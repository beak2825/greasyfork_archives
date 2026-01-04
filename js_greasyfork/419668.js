// ==UserScript==
// @name         Ajax Load ImageHost·Demo
// @namespace      https://greasyfork.org/zh-CN/users/3128
// @version       2.5.7.1
// @description    通过 ajax 的方式，自动加载图床超链接的图片，本脚推荐使用【Tampermonkey】运行，其它脚本扩展引发的使用问题一概无视。
// @author        极品小猫
// @require      https://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
//
// 已应用的网站，可使用于所有网站，但不推荐，强烈建议通过详细匹配的方式使用此脚本，避免造成其它网站的兼容问题。
//
// @include      https://sukebei.*
// @include      https://*.nyaa.*/view/*
// @include      https://jojodl.com/*/detail/*
// @include      https://jojodl.pw/*/detail/*
// @include      https://fapforfun.net/archives/*
// @include      http://www.alabout.com/view.php?*
// @include      /https://[^.]+.blogspot.com/\d{4}/\d{2}/[^.]+.html/
// @exclude      */list.php*

// 以下是图床网站
// metaInIMG
// @connect      postimg.cc

// metaInSmallToBig
// @connect      imgadult.com
// @connect      imgtaxi.com
// @connect      imgur.com

// 需要cookies
// @connect      imgdrive.net
//
// function wuLu => document.getElementById("soDaBug").src
// @connect      pixsera.net
// @connect      imgblaze.net
// @connect      imgair.net
// @connect      imgsee.net
// @connect      imgfrost.net
// @connect      imgsky.net
// @connect      imgfile.net
// @connect      imgpak.xyz

// @connect      iceimg.net
//
//

// post Continue to image
// @connect      uvonahaze.xyz

// post + cookies，以下网站需要通过二次 Post 方法获取数据
// @connect      picbaron.com
// @connect      imgBaron.com
// @connect      kropic.com
// @connect      kvador.com
// @connect      imgsto.com
// @connect      pics4you.net
// @connect      silverpic.com
// @connect      picdollar.com
// @connect      imagexport.com

// @connect      imgbabes.com
// @connect      imgflare.com
//
// #ID > src 规则
// @connect      eroticmovies.xyz
//
// blog
// @connect      3xplanet.com
// @connect      3xplanet.net
//
// @connect      hentai-covers.site

// -----===== 独立规则 =====-----
// class
// @connect      imagetwist.com
// @connect      damimage.com
//
// -----===== 直链网站 =====-----
// @connect      imgur.com
//
// -----===== 不支持的网站 =====-----
// @connect      imgrock.net
// @connect      imgrock.pw
//
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @grant       GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant       GM_notification
// @grant			GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/419668/Ajax%20Load%20ImageHost%C2%B7Demo.user.js
// @updateURL https://update.greasyfork.org/scripts/419668/Ajax%20Load%20ImageHost%C2%B7Demo.meta.js
// ==/UserScript==

/* *
 * 更新日志
 * 2.5.7
 1、破解 imagexport.com、imagetwist.com 防盗链

 * 2.4.7
 1、支持 kvador.com、x8img.com
 2、处理链接中的不规范字符（[/?img]）

 * 2.4.6
 1、3xplanet.net
 2、silverpic.com

 * 2.4.5
 1、匹配 sukebei 类网站
 2、通用规则与域名规则分离
 3、修复通用规则兼容性BUG

 * 2.3.4
 1、[#ID>IMG>src]规则，eroticmovies.xyz
 2、修复 picbaron 等基于 PostPic 规则的网站
 3、PostPic 规则，pics4you.net


*/

(function() {
    'use strict';
    class setting{
        constructor (small, text2link){
            {
                this.small = small;
                this.text2link = text2link;
            }
        }
    }

    let Config,
        hosts=location.hostname.toLowerCase(),
        hostRoot=document.domain.toLowerCase().replace(/.+\.([^.]+\.(com|cn|net|org|pw|ru|com.cn|jp))/i,'$1'),
        domain=location.hostname.replace(/^www\./i,'').toLowerCase();
    let ImgRules={
        meta : 'meta[property="og:image"], meta[name="og:image"]',
        script : function(str){
            return "script:contains("+str+")"
        },
        NotLink : ''
    },
        ShareHost={
            'direct' : {'direct':true}, //直接加载，不需要ajax
            'notSupport' : {notSupport: true},
            'noLink' : {'noLink': true},
            'soDaBug':{
                reHost: 'www.pixsera.net', //映射 Host 规则，最终目标网址被替换为这个
                rule : ".main-content-box>"+ImgRules.script('soDaBug'),
                text : true, //数据在文本中
                src : function(str){
                    let src=str.match(/.src\s*=\s*["'](http[^"']+?)["']/i)[1],
                        host=src.match(/:\/\/([^/]+)/i)[1];
                    console.log(src, host)
                    if(HostToList[host]) src=src.replace(host,'www.pixsera.net');
                    return src;
                }
            },
            'metaInIMG' : {//直接提取meta中的图片地址
                rule : ImgRules.meta,
                attr : 'content'
            },
            'metaInSmallToBig':{
                rule : ImgRules.meta,
                attr : 'content',
                thumb : '', //缩略图信息，用于移除默认缩略图的
                big : true
            },
            'PostPic':{//需要 Cookies，Post 表单，所以需要二次 ajax
                rule : '.pic',
                attr : 'src',
                form : { // 需要进行二次提交表单动作来获取数据，Form Data 由 ImageHostAjaxCore 函数采集
                    method : 'post',
                    cookie : {
                        'file_code' : 'input[name="id"]',
                        'fcode' : 'input[name="id"]',
                        'fadedin' : 'yes', //2020.11.23
                    }, //cookie获取开关，后续将自行获取cookie
                    success : function(){

                    }
                }
            },
        },
        ImgHost={
            'i.imgur.com': {
                rule : ImgRules.meta,
                attr : 'content',
                isIMG : function(a){
                    GM_xmlhttpRequest({
                        'url': a.href,
                        'method':'head',
                        'onload':function(r){
                            //console.log(r);
                            console.log(r.responseHeaders)
                            let rheaders=new Map();
                            r.responseHeaders.split('\n').forEach(function(val, i){
                                //获取返回的 Head 数据，并进行分割
                                var h=val.replace(":",'|').split('|');
                                //console.log(i, h, h[1]);
                                if(h[0]||h[1]) rheaders.set(h[0], h[1].trim());
                            });
                            console.log(rheaders);
                            console.log(rheaders.get('content-type'), rheaders.get('content-type').split('/')[0], rheaders.get('content-type').split('/')[0]=="image");

                            //如果类型是图片，则直接输出图片，不再 ajax 其它内容
                            if(rheaders.get('content-type')&&rheaders.get('content-type').split('/')[0]=="image") {
                                console.log(rheaders.get('content-type'))
                                $(a).append('<br>',$('<img>').attr({'class':'ImageHostAjax', 'src': a.href, 'alt': a.href}));
                            } else {
                                //alert('不是图片');
                            }
                            //content-type
                        }
                    })
                }
            },
            'imagetwist.com':{
                rule : '.pic',
                attr : 'src'
            },
            'imagexport.com':{
                reHost: 'imagetwist.com', //映射 Host 规则，最终目标网址被替换为这个
                rule : '.pic',
                attr : 'src',
                form : {
                    method : 'post',
                    headers : {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'referer' : 'https://imagetwist.com',
                    }
                },
                blobImg : true
            },
            'damimage.com':{rule:'.centred_resized'},

            'hentai-covers.site':{
                rule : '#image-viewer-container>img',
                attr : 'src',
                path : /\/image\/\w+/i, //只匹配特定路径的文件
            },
            'imgbabes.com':{ //需要 cookies，Post 表单，所以需要二次 ajax，recaptcha 验证
                rule : '#source',
                attr : 'src',
                form : {
                    method : 'post',
                    reCaptcha: true,
                    headers : {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    }
                },
            },

            'uvonahaze.xyz':{ //一次性 Post 方法
                rule :'.centred_resized',
                //cookie : '__cfduid=dde74aa5cff52a7e8eefd8f97286e41cd1595311034; PHPSESSID=6df2cf62b9af415d16567e761913c069',
                method : 'post',
                formdata: {"imgContinue":"Continue to image ... "},
                attr : 'src'
            },
            'imgflare.com':{rule : '#source', attr : 'src', form : {method : 'post', reCaptcha: true, headers : {'Content-Type': 'application/x-www-form-urlencoded'}}},//同imgbabes.com，需要 cookies，recaptcha 验证
            '3xplanet.com':{
                errorTips : '.td-404-title',
                rule : '#view-content>img, img#show_image',
                attr : 'src',
                path : /\/view(?:image)?\/\d+.html/i
            },
            'imgdrive.net': { //需要cookies，复制 metaInSmallToBig 模板
                //https://jojodl.com/zh/detail/92942a36c7b46df92d2296aea81aef6fd4767a92.html
                //rule : '.pic',
                //attr : 'src',
                big : true,
                rule : ImgRules.meta,
                attr : 'content',
                errorTips: '.error',
                thumb : 'img[src*="/small/"],',
                onload : function(result, AjaxConf){ //为 ImageHostAjaxCore 独立执行的 onload 事件，不使用默认的 onload 事件

                    msg({'title': AjaxConf.host + ' 独立方法 ajax 结果', css:'color:red;background:yellow;', type:'title'}, {'title': 'AjaxConf', text:AjaxConf, css:"color: green;"}, {'title': 'result', text:result, css:"color: yellow;"});

                    if(result.finalUrl=='https://imgdrive.net/noimage.php') {
                        console.log(AjaxConf);
                        $('img[data-AjaxSrc="'+AjaxConf.urls+'"]').attr('alt', '图片不存在：noimage');
                        return false;
                    } else {
                        let doc=parsetext(result.responseText);

                        if($(doc).find(AjaxConf.ImageHostRule.selection).length>0) {
                            //有图片
                            return true;
                        } else {
                            console.log(result.responseText)


                            let text=$(doc).find('script').text();

                            let L, l, v, u;// text 所需的变量
                            text=text.replace('e(r);','(r)'); //处理掉 eval 方法
                            text=eval(text); //第一次 eval 解码

                            console.log('1', text);

                            text=text.replace('location.reload();',''); //处理掉location.reload();

                            console.log(2, text);

                            text=eval("let "+text);

                            let cookie=text.replace('max-age=86400','max-age=2147483647'); //设置更长的有效期

                            AjaxConf.cookie=cookie;
                            AjaxConf.success=function(src){
                                console.log(src);
                                //console.log('%c 获取到地址：'+src, 'color:green');
                                //if(conf.src) src=conf.src(src); //使用对应站点规则，内置的特殊方法提取Src
                                //if(conf.big) src=smallToBig(src); //将小图转换为大图
                                //console.log(that.host, ' : ' , that.href, src);
                                //$('img[data-AjaxSrc="'+that.href+'"]').attr('src',src);
                            }
                            ImageHostAjaxCore(AjaxConf);
                        }
                    }
                }
            },
            'eroticmovies.xyz':{
                rule : '#view1 img',
                attr : 'src',
                path : /\/(?:(?!new|top|folder\/.+)$).*/i
            },
        },
        HostArr=[],
        HostToList={},
        HostToListArr={//跳转域名对照表（某些图床需要跳转到本体站）
            '3xplanet.com': ['3xplanet.net'],
            //此处的名单会将域名进行映射，而非规则引用

            //'pixsera.net':['imgsee.net']
            //soDaBug 已失效网站 'imgsee.net',
        },
        CurrentHostListArr={//通用规则域名映射表
            'soDaBug':['pixsera.net','imgblaze.net','imgair.net','imghot.net','imgsee.net','imgfrost.net','imgsky.net','imgfile.net','imgpak.xyz','iceimg.net'],
            'metaInIMG' : ['postimg.cc'],
            'metaInSmallToBig' : ['imgtaxi.com','imgadult.com'],
            'PostPic' : ['picbaron.com','kropic.com', 'pics4you.net','imgsto.com','silverpic.com','kvador.com','picdollar.com'],
            'notSupport':['imgrock.net','imgrock.pw'],
            'noLink' : ['img.yt','imgrock.co','imgseed.com'], //已失效的图床网站
            'direct' : ['imgur.com','pone.bnimg.com','image01.myfiles.link','pics.dmm.co.jp','x8img.com'] //直接加载的图床

        },
        JumpHost={ //跳转链规则表，跳转链处理只应用于相应的图片链接上
            'alabout.com':{
                path: '/j.phtml', //跳转链执行文件
                url: 'url', //存放原始链接地址的参数
            },
            'jojodl.pw':{
                path: 'goto.php',
                url: 'gogourl',
            },
            'jojodl.com': {path: 'goto.php',url: 'gogourl'},
        },
        domainRule={ //需要特殊支持的网站（如ajax加载的描述数据，附加功能）
            'alabout.com' : {
                callback : function(){
                    let PageID=Number(getUrlParam('id'));
                    $('a[href="./list.php"]').text('首页').css({'padding':'0 10px'});
                    $('a[href="./list.php"]').before($('<a>').attr({'href':'/view.php?id='+(PageID-1)}).text('上一页 ['+(PageID-1)+']'))
                    $('a[href="./list.php"]').after($('<a>').attr({'href':'/view.php?id='+(PageID+1)}).text('下一页 ['+(PageID+1)+']'))
                }
            },
            'blogspot.com': {
                callback : function(){
                    console.log('注入CSS');
                    GM_addStyle(`.post-body img, .first-img{height:auto!Important;}`);
                }
            },
            'jojodl.pw' : {
                MObserver: '#description',
                callback: function(){
                    GM_addStyle('.form-group{position:sticky;top:55px;z-index:1;}');
                    $('input[placeholder="Search"], button[type="submit"]').removeAttr('disabled'); //解锁搜过功能
                    $('#filelistBox').insertAfter('.form-group'); //移动文件列表
                    //$('#description').next().insertAfter('#description'); //移动分类标签
                }
            },
            'jojodl.com' : {MObserver: '#description'}
        };

    //配置加载
    if(typeof(GM_getValue('config'))=='undefined') {
        console.warn(typeof(GM_getValue('config')), new setting(false,false))
        GM_setValue('config', new setting(false,false));
    } else {
        Config = GM_getValue('Config');
    }




    /*规则映射*/
    for(let i in CurrentHostListArr){ //通用规则域名表转 ImgHost
        //console.log(i);
        for(let j=0;j<CurrentHostListArr[i].length;j++){
            ImgHost[CurrentHostListArr[i][j]]=ShareHost[i]; //通用规则域名映射表中的域名存入 ImgHost
        }
    }
    //for(let i in ShareHost['direct']) ImgHost[ShareHost['direct'][i]]={'direct':true} //直接连接表加入 ImgHost


    for(let i2 in HostToListArr){
        console.log(i2);
        for(let j2=0;j2<HostToListArr[i2].length;j2++){
            HostToList[HostToListArr[i2][j2]]=i2; //存入跳转域名对照表
            ImgHost[HostToListArr[i2][j2]]=ImgHost[i2];
        }
    }

    for(let HostObj in ImgHost) HostArr.push('a[href*="'+HostObj+'"]');					//插入域名对象到数组
    console.log(ImgHost);

    console.group(' -----===== Ajax ImageHost =====----- ');

    if(!ImgHost[hosts.toLowerCase()]||!ImgHost[domain.toLowerCase()]) { //当前网站不是图床网站的时候


        console.log('已匹配的图床链接：', $(HostArr.join(",")));
        /*选择器获取支持的图床链接，显示图片*/

        $(document).ready(function(){
            console.log('已匹配的图床链接：', $(HostArr.join(",")));

            //跳转链预处理，处理掉网页中的跳转链
            if(JumpHost[domain]) {
                $('a[href*="'+JumpHost[domain]['path']+'"]').each(function(){
                    //处理跳转链
                    this.href=decodeURI(getUrlParam(JumpHost[this.host.replace(/^www\./i,'').toLowerCase()]['url'], this.href));
                })
            };

        })

        //console.table(ImgHost);
        GM_addStyle('.ImageHostAjax{max-height:100%!Important;max-width:100%!Important;}');

        let ajaxLib = {
            blobImg : (AjaxConf, src, that) => {
                AjaxConf.headers={
                    'Host' : src.replace(/https?:\/\/([^/]+)\/.+/i, '$1'),
                    'Referer': src,
                    'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
                    'Content-Type': 'image/jpeg',
                    'Cache-Control': 'cache',
                    'Sec-Fetch-Dest' : 'image',
                    'Sec-Fetch-Mode' : 'no-cors',
                    'Sec-Fetch-Site': 'cross-site',
                    'Pragma': 'no-cache'
                }

                GM_xmlhttpRequest({
                    url: src,
                    method: 'get',
                    responseType : 'blob',
                    headers : AjaxConf.headers,
                    onload: function(result){
                        let blob=new Blob([result.response]),
                            bolbUrl=URL.createObjectURL(blob);
                        console.log('blob Img 图片请求成功', result);
                        console.table([src, result.finalUrl, bolbUrl]);
                        $('img[data-AjaxSrc="'+that.href+'"]').attr('src', bolbUrl);
                    },
                    onerror : function(e, result) {
                        console.warn('blob Img 图片请求失败', result)
                        //return result;
                    }
                });
            }
        }

        let ImageAjaxPre = (i, that) => {
            //处理跳转链
            if(JumpHost[that.host.replace(/^www\./i,'').toLowerCase()]) that.href=decodeURI(getUrlParam(JumpHost[that.host.replace(/^www\./i,'').toLowerCase()]['url'], that.href));
            //处理域名
            if(HostToList[that.host.toLowerCase()]) that.host=that.host.toLowerCase().replace(that.host,HostToList[that.host.toLowerCase()]);

            let thisDomain=that.hostname.replace(/^www\./i,''),
                conf=ImgHost[that.host]||ImgHost[thisDomain]; //图床规则装载

            console.log('ImageAjaxPre: ', conf, that, that.host, thisDomain);
            if(!conf.host) conf.host=that.host;
            that.href=that.href.replace(/%5B\/?img%5D/ig,'').replace(/\[\/?img\]/ig,''); //过滤掉 [/?img]

            msg({'title': that.host+" Conf", css:"color: red;background:yellow", type:'title'}, {'title':'Url Path', 'text':that.pathname, css:'color: green;'}, {'title':'Config', 'text':conf, css:'color: #DD045B;'}, {'title':'Path匹配', 'text':conf['path']?conf['path'].test(that.pathname):'无路径匹配', css:'color: green;'});

            if(conf['isIMG']) { //使用内部专用的处理方法
                conf['isIMG'](that);
            } else if(conf['direct']) { //可以直接进行加载，不需要 ajax
                $(that).append('<br>',$('<img>').attr({'class':'ImageHostAjax', 'src': that.href, 'alt': "图片占位", 'data-AjaxSrc': that.href}));
            } else if(conf['notSupport']) {
                $(that).append('<br>',$('<img>').attr({'class':'ImageHostAjax', 'alt': "因防盗链系统，不支持图床： " + conf.host}));
            } else if(conf['notSupport']) {
                $(that).append('<br>',$('<img>').attr({'class':'ImageHostAjax', 'alt': "已失效图床： " + conf.host}));
            }
            //else if(conf['path']&&conf['path'].test(that.href)) { //需要匹配路径的规则
            else {
                //无路径匹配，获取图片
                $(that).append('<br>',$('<img>').attr({'class':'ImageHostAjax', 'src': '', 'alt': "图片占位", 'data-AjaxSrc': that.href}));
                if(conf['pre']) conf['pre'](that.href, conf);

                conf.ImageHostRule={ //用于 AjaxCore 中获取图像地址的规则
                    'errorTips': conf['errorTips'],
                    'selection':conf['rule'],
                    'attr':conf['attr']||'src',
                    'text':conf['text'],
                };
                ImageHostAjaxCore({
                    'urls': that.href,
                    'host': that.host,
                    'HostRuleConf' : conf,
                    'ImageHostRule': conf['ImageHostRule'],
                    'data':{method:conf['method']||'get', formdata:conf['formdata']||{}, headers:conf['headers']||{'Content-Type': 'application/x-www-form-urlencoded',}},
                    'cookie':conf['cookie']||'',
                    'form': conf['form']||'', //需要二次提交表单的时候使用
                    'onload' : conf['onload'], // ImageHostAjaxCore 使用该 onload 方法时，则不使用 success 的处理结果
                    'process' : conf['process'], //站点无 onload 方法时，ImageHostAjaxCore使用该 process 方法，不使用 success 的处理结果
                    'success':function(src, doc){
                        //此属性为处理 ImageHostAjaxCore 返回结果使用，使用 conf['success'] 时，则先处理 conf['success'] 中的内容
                        if(conf['success']) conf['success'](that, src);

                        //console.log('%c 获取到地址：'+src, 'color:green');
                        if(conf.src) src=conf.src(src); //使用对应站点规则，内置的特殊方法提取Src
                        if(conf.big) src=smallToBig(src); //将小图转换为大图，来源于 metaInSmallToBig 规则

                        msg({'title': conf.host + ' 核心结果', css:'color:red', type:'title'}, {'title':'conf: ', 'text': conf, css:'color:red', type:'warn'});


                        //屏蔽了热链接的图床需要二次get图片资源，以 blob 输出
                        if(conf['blobImg']) {
                            ajaxLib.blobImg(conf, src, that);
                        }
                        else {
                            //显示图片内容
                            $('img[data-AjaxSrc="'+that.href+'"]').attr('src', src);
                        }

                        //移除旧的缩略图
                        $(that).find(conf.thumb).remove();
                    }
                });
            }
        }

        let AjaxCoreProcess=(doc)=>{ //doc 由站点匹配结果传递
            if(doc) {
                let newDoc=$(doc).find(HostArr.join(","));
                console.log('图片处理核心：', doc, newDoc);
                newDoc.each(function(i, e){
                    ImageAjaxPre(i, e)
                });

                $(doc).find('img').on({ //绑定 title 事件
                    'mouseover' : function(e){
                        if(!this.title && !$(this).data('img-title')) {
                            if(this.src) {
                                $(this).data('img-title',this.src);
                                this.title=$(this).data('img-title');
                            }
                        } else if(!this.title && $(this).data('img-title')) {
                            this.title=$(this).data('img-title');
                        }
                    },
                    'mouseout' : function(e){
                        if(this.title==$(this).data('img-title')) {
                            $(this).removeAttr('title');
                        }
                    }
                });

            } else {
                //组合ImgHost，用于匹配图床地址
                $(HostArr.join(",")).each(function(i, e){
                    ImageAjaxPre(i, e);
                });
            }


        }

        console.log('当前网站：', location, location.href, domain, hostRoot)
        //种子站点匹配，这些网站需要专用规则处理
        if(domainRule[domain.toLowerCase()]||domainRule[hostRoot]) {
            let domainRuleConfig=domainRule[domain.toLowerCase()]||domainRule[hostRoot];
            console.log('domainRuleConfig:', domainRuleConfig);


            if(domainRuleConfig['MObserver']) {
                MObserver(domainRuleConfig['MObserver'], function(mutations, observer){
                    //mutations 是每次变化的记录集，数组类型
                    console.log('observer: ', observer)
                    console.log('mutations:', mutations);
                    for(let mutation of mutations) {
                        let type = mutation.type;
                        //console.log(type, mutation);
                        switch (type) {
                            case "childList":
                                console.log(" ---=== 节点发生了增加或者删除 ===---");
                                //遍历添加事件的节点
                                for(let x of mutation.addedNodes) { //遍历添加节点记录
                                    //只处理非文本节点，不处理已经包含了 ImageHostAjax className 的节点
                                    if(x.nodeType==1 && x.nodeName!=="BR" && x.className!=="ImageHostAjax") AjaxCoreProcess(x);
                                }
                                break;
                            case "attributes":
                                console.log(`The ${mutation.attributeName} attribute was modified.`);
                                break;
                            case "subtree":
                                console.log(`The subtree was modified.`);
                                break;
                            default:
                                break;
                        }
                    }


                    //=============》增加节点后会执行的代码 ↓
                    /*
                    var nodeAdded = mutations.some(function(x){ //是否增加了节点
                        console.log(x);
                        return x.addedNodes.length > 0;
                    });
                    console.log('nodeAdded: ', nodeAdded);
                    if (nodeAdded) {
                        if(nodeAdded.nodeType==1) {
                            //core(nodeAdded);
                        }

                        console.log(mutations);
                        return true||false; //是否停止监听事件
                    }
                    */
                    //=============》增加节点后会执行的代码 ↑

                }, true)
                //document.querySelector(domainRuleConfig['DOMNodeInserted']).addEventListener('DOMNodeInserted', core);
            }
            if(domainRuleConfig['callback']) {
                domainRuleConfig['callback'](); //网站特殊支持规则
                AjaxCoreProcess();
            }
        } else {
            console.log('通用站点规则')
            AjaxCoreProcess();
        }

    }

    console.groupEnd(' -----===== Ajax ImageHost =====----- ');


    function parsetext(text){
        let doc = null;
        try {
            doc = document.implementation.createHTMLDocument("");
            doc.documentElement.innerHTML = text;
            return doc;
        }
        catch (e) {
            alert("parse error");
        }
    };
    function ImageHostAjaxCore(AjaxConf){

        let Ajax_onload=(doc)=>{ //Ajax 成功结果处理

            msg({'title': AjaxConf.host + ' ajax 结果' + " —— " + AjaxConf.urls, css:'color:red;background:yellow', type:'title'}, {'title': 'AjaxConf', text:AjaxConf, css:"color: green;"});

            let result=$(parsetext(doc)); //返回的内容，没有 responseText
            let src, t = result.find(AjaxConf.ImageHostRule.selection), //使用站点规则的 rule 来做选择器
                errorTips = result.find(AjaxConf.ImageHostRule.errorTips).text();

            if(errorTips) {
                console.warn('图片不存在：', errorTips);
                console.log(AjaxConf.urls, this.url);
                $('img[data-AjaxSrc="'+AjaxConf.urls+'"]').attr('alt', '图片不存在：' + errorTips.trim());
            } else { //没有错误提示时，进入图片地址识别流程
                src = AjaxConf.ImageHostRule.text?t.text():t.attr(AjaxConf.ImageHostRule.attr);
                msg({'title': AjaxConf.host + ' responseText', text:!src?'图片地址无法是被，显示 responseText：\n'+doc:'已找到匹配图片，不显示请求内容', css:"color: #a0ffc0;"})
                msg({'title': '图片地址', text:src, css:"color: green;"}, {'title': 'img', text:t, css:"color: green;"});
                AjaxConf.success(src, doc);
            }
            //return t;
        }

        //本体
        if(AjaxConf.data && AjaxConf.data.method=='post') {
            console.warn('使用 Post 方法')

            GM_xmlhttpRequest({
                url: AjaxConf.urls,
                data : $.param(AjaxConf.data.formdata), //获取表单数据
                cookie: AjaxConf.data.cookie||'',
                method: 'post',
                headers : AjaxConf.data.headers||{
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                onload: function(result){
                    console.log('form 请求成功', result)
                    let formDoc = result.responseText; //转换可被jQuery识别的对象结构
                    console.log($(formDoc).find(AjaxConf.ImageHostRule.selection))
                    Ajax_onload(formDoc)
                }
            });
        } else { //默认 Get 方法
            msg({'title': AjaxConf.host + ' Ajax Data', type:'title', css:"color: red;"},
                {'title': 'AjaxConf', text: AjaxConf, css:"color: #0EB9F9;"},
                {'title': 'AjaxConf data', text:AjaxConf.data, css:"color: yellow;"}
               );
            console.warn('使用Get方法')
            //console.log(AjaxConf);

            if(AjaxConf.HostRuleConf.reHost) { // soDaBug 处理方法，替换掉 Host
                AjaxConf.urls=AjaxConf.urls.replace(AjaxConf.host, AjaxConf.HostRuleConf.reHost);
                console.log('被替换的URL：', AjaxConf.urls);
            }
            GM_xmlhttpRequest({
                url: AjaxConf.urls,
                data : $.param(AjaxConf.data.formdata, true),
                method: AjaxConf.data.method,
                headers : AjaxConf.data.headers,
                cookie: AjaxConf.cookie,
                onload: function (result) {
                    if(AjaxConf['onload']) {
                        AjaxConf['onload'](result, AjaxConf);
                    }
                    // * 此属性为 ImageHostAjaxCore 核心处理结果，如果要使用站点自有的 onload 方法，请在站点配置（AjaxConf）时设置 onload 属性或 process 属性
                    // *

                    //let doc = parsetext(result.responseText), //转换可被jQuery识别的对象结构
                    let doc = result.responseText, //转换可被jQuery识别的对象结构
                        webTitle = $(doc).find('title').text(); //获取网页标题

                    if(webTitle.search('安全检查')>-1) { //检查网页标题
                        $('img[alt="'+AjaxConf.urls+'"]').attr('alt','需访问一次网站，通过安全检查');
                        GM_notification(webTitle, '需访问一次网站，通过安全检查', '');
                        console.log('需访问一次网站，通过安全检查');
                        return false;
                    }

                    //console.log('123123', doc);
                    console.log('AjaxConf.form', AjaxConf.form);
                    if(AjaxConf.form) {
                        if(typeof AjaxConf.form=='boolean') { //初始化 form 数据
                            console.log('需要主动生成 form 表单数据');
                            AjaxConf.form={};
                            AjaxConf.form.method='post';
                            AjaxConf.form.header={
                                'Content-Type': 'application/x-www-form-urlencoded',
                            }
                        }
                        console.log(' 发现 form 表单', $(doc).filter('form'));
                        let docForm=$(doc).filter('form');
                        if(docForm.length>0) {
                            //AjaxConf.form();

                            let formCookie; //formCookie提取缓存
                            if(AjaxConf.form.cookie) {
                                //获取请求的Cookie
                                $(doc).filter('script:contains($.cookie)').each(function(i, e){
                                    console.log(this);
                                    let cookieArr=this.textContent.match(/\$.cookie\('([^\']+)'\s*,\s*'([^\']+)'\s*,\s*.+\)/),
                                        cookie_name=cookieArr[1],
                                        cookie_value=cookieArr[2];
                                    formCookie=cookie_name+"="+cookie_value+'; ';
                                });
                                //融合 Cookie 值

                                $.map(AjaxConf.form.cookie, function(value, name) {
                                    console.log(docForm.find(value).length);
                                    if(docForm.find(value).length>0) //选择器有结果时
                                        formCookie+=name+"="+docForm.find(value).val()+'; ';
                                    else //选择器没有结果，直接赋值
                                        formCookie+=name+"="+value;
                                });
                                //AjaxConf.form.cookie+=Fn_xmlCookies([['file_code', docForm.find('[name="id"]').val()], ['fcode', docForm.find('[name="id"]').val()]]);
                                console.warn('表单Cookie：', AjaxConf.form.cookie, formCookie);
                            }

                            let PostData=$(doc).filter('form').serialize();
                            if(AjaxConf.form.reCaptcha) {
                                PostData+="&g-recaptcha-response="+$(docForm).find('.g-recaptcha').data('sitekey');

                                notifyMe(result.finalUrl,'遇到机器人检测，需要输入验证码，请手动访问',function(){
                                    GM_openInTab(result.finalUrl, false);
                                })
                                /*
                                GM_notification(result.finalUrl, '遇到机器人检测，需要输入验证码，请手动访问', '', function(){
                                    GM_openInTab(result.finalUrl, false);
                                });
                                */

                                $('[data-ajaxsrc="'+result.finalUrl+'"]').on('mouseover', function(){
                                    console.log('222: ', this, this.src, !this.src);
                                    console.log(this.src, typeof this.src);
                                    if(!$(this).attr('src')) {
                                        ImageHostAjaxCore(AjaxConf);
                                    }
                                });
                                //return false;
                            }

                            console.log('PostData: ', PostData);
                            GM_xmlhttpRequest({
                                url: result.finalUrl,
                                data : PostData, //获取表单数据
                                cookie: formCookie||AjaxConf.form.cookie||'',
                                method: AjaxConf.form.method||'post',
                                synchronous: false,
                                headers : AjaxConf.form.headers||{
                                    'Set-Cookie': 'widget_session='+AjaxConf.host,
                                    'SameSite': 'None',
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                },
                                onload: function(data){
                                    if(data.finalUrl.search('op=login')>0)
                                        console.warn('请求失败');
                                    else {
                                        console.log('二次 form 请求成功', data)
                                        let formDoc = data.responseText; //转换可被jQuery识别的对象结构
                                        Ajax_onload(formDoc);
                                    }
                                }
                            });
                        } else { //免 form 提交数据
                            Ajax_onload(doc);
                        }
                    } else {
                        Ajax_onload(doc);
                    }
                },
                onerror: function(e){
                    console.error('e error:', e);
                },
                onreadystatechange : function(e){
                    //console.log('onreadystatechange: ', e);
                }
            });
        }
    }
    function smallToBig(src){
        return src.replace(/\/small\//i,'/big/');
    }
    // Your code here...


    function msg(title, obj, css){
        //console.log('arguments:', arguments.length)

        for(let arg of arguments) {
            //console.log(arg);
            if(Array.isArray(arg)) { //数组模型下的内容
                if(arg.length==2) console.log(arg[0], arg[1]);
                else console.log(arg);
            } else if(typeof(arg)=='object') {
                if(arg.type) {
                    switch(arg.type) {
                        case 'title':
                            console.group('%c -----***** ' + arg.title + ' *****-----', arg.css||'');
                            break;
                        case 'table':
                            console.table(arg.text);
                        case 'warn':
                            console.warn('%c '+arg.title, arg.css||'', arg.text);
                    }
                } else if(typeof(arg.text)=='object') {
                    console.log('%c '+ arg.title +": ", arg.css||'', arg.text);
                }
                else {
                    console.log('%c '+ arg.title +": " + arg.text, arg.css||'');
                }
            }
        }
        console.groupEnd();
    }

    function Fn_xmlCookies(arr){//[[],[]]采用二维数组+对象的模式传递数据
        let xmlCookie='';
        $.each(arr, function(i, e){
            console.log(i, e);
            xmlCookie+=e[0]+"="+e[1]+"; ";
        });
        return xmlCookie;
    }

    function getUrlParam(name, url, option, newVal) {//筛选参数，url 参数为数字时
        let search = url ? url.replace(/^.+\?/,'') : location.search;
        //网址传递的参数提取，如果传入了url参数则使用传入的参数，否则使用当前页面的网址参数
        let reg = new RegExp("(?:^|&)(" + name + ")=([^&]*)(?:&|$)", "i");		//正则筛选参数
        let str = search.replace(/^\?/,'').match(reg);

        if (str !== null) {
            switch(option) {
                case 0:
                    return unescape(str[0]);		//所筛选的完整参数串
                case 1:
                    return unescape(str[1]);		//所筛选的参数名
                case 2:
                    return unescape(str[2]);		//所筛选的参数值
                case 'new':
                    return url.replace(str[1]+'='+str[2], str[1]+'='+newVal);
                default:
                    return unescape(str[2]);        //默认返回参数值
            }
        } else {
            return null;
        }
    }

    function MObserver(selector, callback, kill, option){
        let watch = document.querySelector(selector);
        if (!watch) {
            return;
        }
        let observer = new MutationObserver(function(mutations){
            kill = callback(mutations, observer);
            if(kill) {
                console.log('停止'+selector+'的监控');
                observer.disconnect();
            }
        });
        observer.observe(watch, option||{childList: true, subtree: true});
    }

    function reCAPTCHA(){ //获取身份验证信息g-recaptcha-response

    }

    function notifyMe(title, option, click) {//option {text:'', renotify:false, tag:'', requireInteraction:false, sound:'', silent:''}
        if(typeof(option)=='object'){
            title=title||option.title||document.title;
            click=option.onclick||click;

            option.requireInteraction=option.requireInteraction||false; //保持通知活动，知道确认或关闭
            option.renotify=option.renotify||option.read||false; //默认覆盖通知
            option.tag=option.tag||option.renotify?'renotify':'';
            option.sound=option.sound||"https://s3-ap-northeast-1.amazonaws.com/ssb-av-resource/resource/1573215339389b95ce2bda3c64026b8c899c4897cbcc7/1/15732153393904f02e59fcb984068b160a88cb04c6c05.mp3?v=appresource";
            option.body=option.text=option.body||option.text||'';
            option.silent=option.silent||false;
        } else { //option 为纯文本的时候
            var text=!option?title:option;
            title=!option?document.title:title;
            option={body: text, icon:GM.info.script.icon||''};
            console.log(GM.info.script.icon)
        }


        if(GM_notification) {
            if(/^http/i.test(title)){
                let title_host=title.match(/\/\/([^/]+)/)[1];
                if(!sessionStorage[title_host]) {
                    GM_notification(title, text, '', click);
                    sessionStorage[title_host]=true;
                }
            } else {
                GM_notification(title, text, '', click);
            }
        }
        // 先检查浏览器是否支持
        else if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        }

        // 检查用户是否同意接受通知
        else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            var notification = new Notification(title, option);
            if(click) notification.onclick = click;
        }

        // 否则我们需要向用户获取权限
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {
                // 如果用户同意，就可以向他们发送通知
                if (permission === "granted") {
                    var notification = new Notification(title, option);
                    //notification.title = title;
                    //notification.body = text;
                    //notification.icon = icon;
                    if(click) notification.onclick = click;
                }
            });
        } else if(Notification.permission == 'denied') {
            Notification.requestPermission();
        }


        // 最后，如果执行到这里，说明用户已经拒绝对相关通知进行授权
        // 出于尊重，我们不应该再打扰他们了
    }

    GM_registerMenuCommand('强制加载小图片', );

})();
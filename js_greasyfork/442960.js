// ==UserScript==
// @name         Ajax Load ImageHost·Demo
// @namespace      https://greasyfork.org/zh-CN/users/122964
// @version       2.6.8
// @description    通过 ajax 的方式，自动加载图床超链接的图片，本脚推荐使用【Tampermonkey】运行，其它脚本扩展可能引发的未知问题，请反馈时说明。\n首次访问图床，需要允许脚本访问域名，否则降本将无法正常工作。
// @author        ThisAV
// @require      https://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
//
// @include      https://sukebei.*
// @include      https://*.nyaa.*/view/*
// @include      https://jojodl.com/*/*
// @include      https://jojodl.pw/*/*
// @include      https://fapforfun.net/archives/*
// @include      http://www.alabout.com/view.php?*
// @include      http://roriland.info/*/*/*
// @include      /https://[^.]+.blogspot.com/\d{4}/\d{2}/[^.]+.html/
// @include      https://github.com/Owyn/HandyImage/issues/*
// @exclude      */list.php*

//
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @grant       GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant       GM_notification
// @grant			GM_registerMenuCommand
// @icon         https://www.google.com/s2/favicons?domain=https://blogspot.com/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442960/Ajax%20Load%20ImageHost%C2%B7Demo.user.js
// @updateURL https://update.greasyfork.org/scripts/442960/Ajax%20Load%20ImageHost%C2%B7Demo.meta.js
// ==/UserScript==

/* *
 * 更新日志
 * 2.6.8
 1、支持 Base64 编码加载图片（应用于受CSP限制的网站）
 2、PostPIC → pics4upload.com
 3、SoDaBug → imgyng.buzz、imglqw.buzz、imgmeno.buzz、kejinomama.icu、imgveni.xyz、imgkuiw.xyz、imglina.xyz、imgalor.xyz、imgirx.xyz、imgwewo.xyz、imgbird.xyz、imgkr.xyz、imglin.xyz
 4、#screenshot-image → skr.sh、skrinshoter.ru
 5、MetaInIMG → postimgs.org、ibb.co、imgbb.com、servimg.com、imgstar.eu、rintor.space、
 6、chevereto.com → empornium.sx、empornium.ph
 7、ImgHost → vfl.ru
 8、Redirect → imgtorrnt.in
 9、noLink → imgjazz.xyz
 10、.centred → xxxwebdlxxx.org、olarixas.xyz、imgdawgknuttz.com
 11、noSupport → tezzpic.com、picrok.com



 * 2.5.8
 1、soDabug 图床获取逻辑规则更新
 2、PostPIC → imgsen.com

 * 2.5.7.4
 1、soDaBug 模板更新，支持 imgwang.buzz
 2、metaInSmallToBig 模板更新，支持 imgwallet.com、imgdrive.net
 3、直链 images2.imgbox.com

 * 2.5.7.3
 1、soDaBug 模板更新，支持 imgkaka.xyz
 2、PostPIC 支持 imgstar.eu

 * 2.5.7.1
 1、破解 imagexport.com、imagetwist.com 防盗链
 2、soDaBug 模板网站更新
 3、将 uvonahaze.xyz 转为通用模板 #imgContinue
 4、#imgContinue 支持 pornhd720p.com

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

    let blockList=/bbyxv.xyz|baixn.xyz|8a88b.com/i; //如果文件清单中有这些域名，则黑掉下载按钮，拒绝辣鸡网站

    class setting{
        constructor (small, text2link){
            {
                this.small = small;
                this.text2link = text2link;
            }
        }
    }

    let log_control=true,
        Config,
        hosts=location.hostname.toLowerCase(),
        hostRoot=document.domain.toLowerCase().replace(/.+\.([^.]+\.(com|cn|net|org|pw|ru|com.cn|jp))/i,'$1'),
        domain=location.hostname.replace(/^www\./i,'').toLowerCase(),
        webTitle=document.title;
    let ImgRules={
        meta : 'meta[property="og:image"], meta[name="og:image"]',
        script : function(str){
            return "script:contains("+str+")"
        },
        NotLink : ''
    },
        ShareHost={
            'direct' : {'direct':true}, //直接加载，不需要ajax，域名表需要完整的域名
            'direct403' : {
                blobImg : true
            }, //403拒绝连接，需要使用GM_xml获取
            'notSupport' : {notSupport: true}, //不支持的网站
            'noLink' : {noLink: true}, //已失效网站
            'soDaBug':{
                reHost: 'imgpekele.buzz', //映射 Host 规则，最终目标网址被替换为这个
                //rule : ".main-content-box>"+ImgRules.script('soDaBug'),
                rule : ".main-content-box script:contains(wuLu)",
                text : true, //数据在文本中
                src : function(str){
                    if(!str) return; //图片不存在时
                    let src=str.match(/.src\s*=\s*["'](http[^"']+?)["']/i)[1],
                        host=src.match(/:\/\/([^/]+)/i)[1];
                    console.log(src, host)
                    //if(HostToList[host]) src=src.replace(host,'www.pixsera.net');
                    return src;
                },
                errorTips: '.tackle_flex'
            },
            'metaInIMG' : {//直接提取meta中的图片地址
                rule : ImgRules.meta,
                attr : 'content',
                blobImg : true
            },
            'metaInIMG&Direct':{
                rule : ImgRules.meta,
                attr : 'content',
                blobImg : true,
                isIMG: (a)=>{
                    console.log(123, a);
                    if(/\.(?:jpg|png|gif|webp)/i.test(a.href)) {
                        $(a).append('<br>',$('<img>').attr({'class':'ImageHostAjax', 'src': a.href, 'alt': "图片占位", 'data-AjaxSrc': a.href}));
                        return false;
                    } else {
                        return true;
                    }
                }
            },
            'metaInSmallToBig':{
                rule : ImgRules.meta,
                attr : 'content',
                thumb : '', //缩略图信息，用于移除默认缩略图的
                big : true, //小图转大图
                blobImg : true
            },
            '.centred': {attr : 'src', rule : '.centred', method : 'post', formdata: {"imgContinue":"Continue to image ... "}, path : /\/img-\w+/i, blobImg: true},
            '#imgContinue':{attr : 'src', rule :'.centred_resized', method : 'post', formdata: {"imgContinue":"Continue to image ... "}}, //一次性 Post 方法
            '#image-viewer-container':{attr : 'src', rule : '#image-viewer-container>img', path : /\/image\/\w+/i, blobImg: true},
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
            'MyFileShare':{attr : 'src', rule : '.uk-margin-large-top>img', path : /\/v\/\w+/i, blobImg : true},
            '#screenshot-image': {attr:'src', rule:'#screenshot-image', path:/\/s\/\d+\/\w+\//},
            '#photo': {attr:'src', rule:'#photo', path:/\/view.php/i},
            '#imgpreview': {attr:'src', rule:'#imgpreview', path:/\/\w+\/\w+/i},
            '.main-image': {attr:'src', rule:'.main-image', path:/\/image\/\w+/i},
            'chevereto.com': {},
            'center>a>img': {attr:'src', rule: 'center>a>img'}
        },
        ImgHost={
            'i.postimg.cc': {attr : 'content', rule : ImgRules.meta, reHost: 'pixxxels.cc', NoFileName: true, blobImg : true},
            'm.imgur.com': {attr : 'content', rule : ImgRules.meta, reHost : 'imgur.com',},
            'i.imgur.com': {attr : 'content', rule : ImgRules.meta, },
            'imagetwist.com': {attr : 'src', rule : '.pic', blobImg : true}, //blob 协议加载
            'imagexport.com':{attr:'src', rule:'.pic', reHost: 'imagetwist.com', blobImg:true},
            'imgbabes.com':{ //需要 cookies，Post 表单，所以需要二次 ajax，recaptcha 验证
                rule : '#source', attr : 'src', form : {method : 'post',reCaptcha: true, headers : {'Content-Type': 'application/x-www-form-urlencoded'}},
            },
            'imgtorrnt.in':{attr:'src', path:/view.php/i, redirect: (that)=>{return 'https://i.imgur.com/'+getUrlParam('id', that.href);}},
            'imgflare.com':{rule : '#source', attr : 'src', form : {method : 'post', reCaptcha: true, headers : {'Content-Type': 'application/x-www-form-urlencoded'}}},//同imgbabes.com，需要 cookies，recaptcha 验证
            'eroticmovies.xyz':{attr:'src', rule : '#view1 img', path : /\/(?:(?!new|top|folder\/.+)$).*/i},
            'piccy.info': {attr:'src',rule:'#mainim', path:/view\d\/.+/},
            'vfl.ru': {attr:'src',rule:'#f_image>img', path:/fotos\/.+/i},
            //blog
            '3xplanet.com':{errorTips : '.td-404-title', rule : '#view-content>img, img#show_image', attr : 'src', path : /\/view(?:image)?\/\d+.html/i},
            'xpic.org': {attr:'src',rule:'.img-inner.dark>img', path:/cover-\w+/i},
        },
        HostArr=[],
        HostToList={},
        HostToListArr={//跳转域名对照表（某些图床需要跳转到本体站）
            '3xplanet.com': ['3xplanet.net'],
            //此处的名单会将域名进行映射，而非规则引用

            //'pixsera.net':['imgsee.net']
        },
        CurrentHostListArr={//通用规则域名映射表
            '.centred': ['pornhd720p.com','dimtus.com','picmoney.org','xxxwebdlxxx.org','olarixas.xyz','imgdawgknuttz.com','trans.firm.in'],
            '#imgContinue': ['uvonahaze.xyz','damimage.com','dewimg.com'],
            '#image-viewer-container': ['hentai-covers.site', 'images.free4.xyz'],
            'soDaBug':['pixsera.net','pixsense.net',
                       'imgblaze.net','imgair.net','imghot.net','imgsee.net','imgfrost.net','imgsky.net','imgfile.net','iceimg.net',
                       'imgbig.xyz','imgtigr.xyz','imgkaka.xyz','imgkuiw.xyz','imgveni.xyz','imgpak.xyz','imglina.xyz','imgalor.xyz','imgirx.xyz','imgwewo.xyz','imgbird.xyz','imgkr.xyz','imglin.xyz','imgkoi.xyz',
                       'imgjut.buzz','imgwang.buzz','imgpekele.buzz','imgbbd.buzz','imgyng.buzz','imglqw.buzz','imgmeno.buzz','imgtrw.buzz',
                      ], //主站 'pixsera.net',
            'metaInIMG' : ['servimg.com','imgbb.com','ibb.co',
                           'postimgs.org','postimages.org',
                           'pixxxels.cc','picmoney.org',
                          'rintor.space',
                          ],
            'metaInIMG&Direct' : ['thumbsnap.com','i.pixxxels.cc'], //支持直链 或者 metaInIMG
            'metaInSmallToBig' : ['imgtaxi.com','imgadult.com','imgwallet.com','imgdrive.net'],
            'PostPic' : ['picbaron.com','imgbaron.com','kropic.com', 'imgsto.com','silverpic.com','kvador.com','picdollar.com','imgstar.eu','imgsen.com',
                         'pics4you.net', 'pics4upload.com',],
            'notSupport':['imgrock.net','imgrock.pw',],
            'noLink' : ['img.yt','imgseed.com','imgseeds.com','imgchili.net','imgrock.co','erimge.com','imgmega.com','imgmaster.net','imgcash.co','imgserve.net','imgdino.com','imgtiger.com','imgdream.net',
                        'imgbros.xyz','imgjazz.xyz','imgao.xyz','imgxx.xyz','imageking.xyz','picusha.net','imgazure.com',
                        'imgweng.xyz', //soDabug
                        'beautifulero.com','xxxwebdlxxx.top','imghost.top','placeimg.net','xxx.kodiak.top','multiimg.com','blameless.work','imageshtorm.com','xaoutchouc.live','bustyimg.top','picshost.info','pic.hotimg.site','hdmoza.com'//.centred 规则 —— /img-\w+.html
                       ], //已失效的图床网站
            'direct403' :[],
            'direct' : ['imgur.com','pone.bnimg.com','image01.myfiles.link','pics.dmm.co.jp','x8img.com','images2.imgbox.com'], //直接加载的图床
            'MyFileShare' : ['skviap.xyz','ovkwiz.xyz'],
            '#screenshot-image': ['skr.sh','skrinshoter.ru'],
            '#photo': ['hostpic.org'],
            '#imgpreview': ['pixroute.com'],
            'chevereto.com': ['empornium.ph','empornium.sx'],
            '.main-image': ['imagebam.com'],
            '.picview': [],
            'center>a>img': ['imgprime.com']
//未处理
        },
        JumpHost={ //跳转链规则表，跳转链处理只应用于相应的图片链接上
            'alabout.com':{
                path: '/j.phtml', //跳转链执行文件
                url: 'url', //存放原始链接地址的参数
            },
            'jojodl.pw':{path: 'goto.php',url: 'gogourl',},
            'jojodl.com': {path: 'goto.php',url: 'gogourl'},
        },
        domainRule={ //需要特殊支持的网站（如ajax加载的描述数据，附加功能）
            'github.com': {
                CSP : true, //受到内容安全策略限制，使用Base64加载图片
                callback : function(){
                    console.log('内容安全策略限制，使用Base64加载图片');
                }
            },
            'alabout.com' : {
                callback : function(){
                    let PageID=Number(getUrlParam('id'));
                    $('a[href="./list.php"]').text('首页').css({'padding':'0 10px'});
                    $('a[href="./list.php"]').before($('<a>').attr({'href':'/view.php?id='+(PageID-1)}).text('上一页 ['+(PageID-1)+']'))
                    $('a[href="./list.php"]').after($('<a>').attr({'href':'/view.php?id='+(PageID+1)}).text('下一页 ['+(PageID+1)+']'))
                }
            },
            'blogspot.com' : {
                callback : function(){
                    console.log('注入CSS');
                    GM_addStyle(`.post-body img, .first-img{height:auto!Important;}`);
                }
            },
            'jojodl.pw' : {
                MObserver: '#description',
                callback: function(){

                    //影片规则
    let VideoID_Rule={
        'RJ\d+' : {name:'DLsite', regexp: /(R[EJR]\d{6})/i, replace : '$1'},
        '1Pondo' : {name: '1Pondo', regexp: /1pondo-(\d{6})|(\d{6})-1pon/i, replace : '1Pondo $1$2'},
        'Caribbean' : {name: 'Caribbean', regexp: /Caribbean(?:com)?[-_](\d{6}[-_]\d{3})|(\d{6}[-_]\d{3})[-_]Carib/i, replace : 'Caribbean $1$2'},
        'Heyzo' : {name: 'Heyzo', regexp:  /Heyzo[_-](\d+)/i, replace : 'Heyzo-$1'},
        'H0930' : {name: 'H0930', regexp: /H0930-(\w+)/i, replace : 'H0930-$1'},
        '10musume' : {name:'10musume', regexp: /(\d{6}_\d{2})[-_]10mu/i, replace : '10musume $1'},
        'Pacopacomama' : {name: 'Pacopacomama', regexp: /(\d{6}_\d{3})-paco/i, replace : 'Pacopacomama $1'},
        'FC2-PPV': {name: 'FC2-PPV', regexp: /FC2[-_]PPV[-_](\d{6})/i, replace : 'FC2-PPV-$1'},
        'Uncensored Leaked' : {name: 'Uncensored Leaked', regexp: /([A-Z]{2,4}[-_]\d{2,4})/i, replace : '[Uncensored Leaked]$1', titleRegExp: /Uncensored Leaked/i},
        'DMM' : {name:'DMM', regexp: /([A-Z]{2,4}-\d{2,4})/i, replace : '$1'},
    }

                    if(/detail/i.test(location.href)) {
                        $('input[placeholder="Search"], button[type="submit"]').removeAttr('disabled'); //解锁搜过功能
                        $('#filelistBox').insertAfter('.form-group'); //移动文件列表
                        let tagObj=$('#description').next();
                        tagObj.insertBefore('#description'); //移动分类标签

                        //排版调整
                        //主内容框架
                        GM_addStyle(`
body>.container {margin:15px 0;max-width:100%;}
body>.container>.row{width:400px;position:sticky;top:155px;z-index:1;}
body>.container>.card{width:850px;margin:0 15px;}
body>.container>.row, body>.container>.card {display:inline-flex;}
.newTag {background-color:#ff008d!important;}
`);
                        $('.torrent-file-desc').parent().appendTo('body>.container');
                        //磁力链
                        GM_addStyle('.form-group{position:sticky;top:55px;z-index:2;}');
                        $('.form-group, .entry-title').prependTo('.torrent-file-desc');//.prependTo('body>.container');


                        let magnetBtn=$('.btn-primary:not("#copyBtn")'),
                            magnetA=magnetBtn.find('a'),
                            magnetHash=magnetA.attr('href').replace(/.+urn:btih:(\w{40}).+/i, '$1');
                        magnetA.addClass(magnetBtn.attr('class'));
                        magnetBtn.removeClass();

                        console.log(webTitle, magnetHash);
                        if(webTitle=='- Real Life:Videos - JoJoDL') document.title=localStorage[magnetHash];

                        if(blockList.test($('.torrent-file-list').text())) {
                            GM_addStyle(`a.btn.btn-primary.btn-lg ::after {content: "X";color: red;font-size: 50px;padding: 0;margin: 0;position: absolute;top: 0;left: 8px;text-align: center;}`);
                        };


                        let tagList={},
                            title=$('.entry-title').text().trim(),
                            VideoID=localStorage[magnetHash]||'',
                            VideoID_Number,
                            titleArr=title.split(/[- ]/g);

                        if(!VideoID) {
                            for(let key in VideoID_Rule) {
                                if((VideoID_Rule[key]['titleRegExp'] && VideoID_Rule[key]['titleRegExp'].test(title))||VideoID_Rule[key]['regexp'].test(title)) {
                                    console.warn(key, VideoID_Rule[key]['regexp'], title, title.match(VideoID_Rule[key]['regexp']));
                                    VideoID=VideoID_Rule[key]['replace'].replace('$1', title.match(VideoID_Rule[key]['regexp'])[1]);
                                    console.warn(VideoID);
                                    VideoID_Number=VideoID?VideoID.match(VideoID_Rule[key]['regexp'])[1]:title;
                                    break;
                                }
                            }
                        };
                        VideoID_Number=VideoID?VideoID.match(/(\d{3,6}(?:[-_]\d{2,3})?)/i,'')[1]:!VideoID_Number?title.text().match(/(\d{3,6}(?:[-_]\d{2,3})?)/i,'')[1]:title;

                        $('.tag').each(function(){
                            tagList[$(this).text()]=$(this).text();
                            //#ff008d
                        })
                        console.warn(tagList, VideoID_Number, titleArr);

                        if(VideoID&&VideoID.length>0) {
                            console.warn('%c VideoID: '+VideoID, 'color: green;')
                            magnetA.attr('href', magnetA.attr('href')+"&dn="+VideoID.toString().toUpperCase());
                            if(/FC2[-_ ]?PPV/i.test(VideoID)) {
                                magnetA.click(function(){
                                    es(VideoID_Number);
                                });
                            }
                        }
                        if(VideoID_Number&&VideoID_Number.length>0) {
                            VideoID_Number=VideoID_Number.toString();
                            if(!tagList[VideoID_Number]) $('<a>').attr({'class':'tag newTag', href:'/en/search/ac0/s_'+VideoID_Number}).text(VideoID_Number).prependTo(tagObj)
                        }
                        $('body').on('click', 'a.tag', function(e){
                            //GM_openInTab('es://'+$(this).text(), {active :true, insert:true, setParent : true});
                            if(e.ctrlKey) {
                                es($(this).text());
                                return false;
                            }
                            return true;
                        })
                    } else {
                        GM_addStyle(`.warn18::before {content:'🔞';color:red;}
                        .FindNewPage::before {content:'🔎';color:blue;}`);

                        //页码查找资源
                        function FindNewPageFn ($this, NextPageID, ActivePageID){
                            GM_xmlhttpRequest({
                                url: `/zh/page/${NextPageID}`,
                                nocache: true,
                                onload: (result)=>{
                                    let doc=parsetext(result.response),
                                        $thisHash=$this.href.match(/\w{40}/).toString();
                                    console.log(NextPageID, doc, $thisHash, $(doc).find((`a[href*="${$thisHash}"]`)).length);
                                    if($(doc).find((`a[href="${$thisHash}"]`)).length>0) {
                                        notifyMe(`最新页码${NextPageID}，新增了${NextPageID-ActivePageID}页`,{},function(){
                                            location.href=`https://jojodl.pw/zh/page/${NextPageID}`;
                                        })
                                        return false;
                                    }
                                    else if(NextPageID<100) {
                                        NextPageID++;
                                        FindNewPageFn($this, NextPageID, ActivePageID);
                                    }
                                    else {
                                        alert('已经到页码末尾，未找到记录');
                                        return false;
                                    }
                                }
                            });
                        }


                        $('.torrent-name>a').each(function(e){
                            //插入找寻最新页码位置按钮
                            let $this=this,
                                FindNewPage=$('<span class="FindNewPage">');
                            FindNewPage.click(x=>{
                                let ActivePageID=+($('.btn.btn-secondary.active').text()),
                                    NextPageID=ActivePageID<=100?ActivePageID++:ActivePageID;
                                let newPageID=FindNewPageFn($this, NextPageID, ActivePageID);
                            });
                            $(this).before($this, FindNewPage)

                            //列表中没有标题的，获取文件列表名字
                            //没有标题，添加标题
                            if($(this).text()=='') {
                                let $this=$(this),
                                    hash=this.href.replace(/.+\/(\w{40})\.html$/i, '$1');
                                if(hash && localStorage[hash]) {
                                    $this.addClass('warn18');
                                    $this.text(localStorage[hash]);
                                } else {
                                    GM_xmlhttpRequest({
                                        url: this.href,
                                        onload: (result)=>{
                                            let id=result.response.match(/\d+_\d+(?=\/filelist)/).toString();
                                            //获取文件列表内容
                                            GM_xmlhttpRequest({
                                                url: `/zh/detail/${id}/filelist`,
                                                onload: (result)=>{
                                                    let folderTitle=$(result.response).find('.folder').text();
                                                    $this.addClass('warn18');
                                                    localStorage[hash]=folderTitle;
                                                    $this.text(folderTitle);
                                                    //let id=result.response.match(/\/(\d+_\d+)\/filelist/);
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            },
            'jojodl.com' : {MObserver: '#description'}
        };
    let domainRuleConfig=domainRule[domain.toLowerCase()]||domainRule[hostRoot];

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
    //log('- 图床表 -', ImgHost);

    console.group(' -----===== Ajax ImageHost =====----- ');

    if(!ImgHost[hosts.toLowerCase()]||!ImgHost[domain.toLowerCase()]) { //当前网站不是图床网站的时候


        log('- 已匹配的图床链接 -', $(HostArr.join(",")));
        /*选择器获取支持的图床链接，显示图片*/

        $(document).ready(function(){

            //跳转链预处理，处理掉网页中的跳转链
            if(JumpHost[domain]) {
                console.log('domain', domain, JumpHost[domain]['path']);
                $('a[href*="'+JumpHost[domain]['path']+'"]').each(function(){
                    //处理跳转链
                    //log('-处理跳转链-', this.search, JumpHost[this.host.replace(/^www\./i,'').toLowerCase()]['url'], new URLSearchParams(this.search), this.search);
                    this.href=new URLSearchParams(this.search).get(JumpHost[this.host.replace(/^www\./i,'').toLowerCase()]['url']);
                    //this.href=decodeURIComponent(getUrlParam(JumpHost[this.host.replace(/^www\./i,'').toLowerCase()]['url'], this.href));
                })
            };
        })

        //console.table(ImgHost);
        GM_addStyle('.ImageHostAjax{max-height:100%!Important;max-width:100%!Important;}');

        //图像加载方法原型
        let ajaxLib = {
            blobImg : (AjaxConf, src, that) => { //该方法应用于图床规则
                log('-blobImg-', src, that);
                log(AjaxConf);
                src=src||$(that).find('img').src;
                let srcUrl=new URL(src);
                AjaxConf.headers={
                    Host : srcUrl.host,
                    //'Host' : src.replace(/https?:\/\/([^/]+)\/.+/i, '$1'),
                    'Referer': src, //AjaxConf.headers.referer||src,
                    'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
                    'Content-Type': 'image/jpeg',
                    'Cache-Control': 'cache',
                    'Sec-Fetch-Dest' : 'image',
                    'Sec-Fetch-Mode' : 'no-cors',
                    //'Sec-Fetch-Site': 'same-site',
                    'Sec-Fetch-Site': 'cross-site', //跨域请求
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
            },
            PostImg : (AjaxConf, src, that) => {

            },
            base64Img : (AjaxConf, src, that) => { //该方法应用于存在CSP限制的网站
                console.log('base64Img方法')
                GM_xmlhttpRequest({
                    url: src,
                    responseType: 'arraybuffer',
                    method :"GET",
                    headers: {
                    },
                    onload:function(xhr){
                        console.log('base64Img', xhr);
                        let url=arrayBufferToBase64(xhr.response);
                        $('img[data-AjaxSrc="'+that.href+'"]').attr('src', 'data:image/jpeg;base64,'+url);
                    },
                    onerror : function(e, result) {
                        console.warn('base64 Img 图片请求失败', e)
                        //return result;
                    }
                });


                function arrayBufferToBase64(buffer) {
                    let binary = '';
                    let bytes = new Uint8Array(buffer);
                    let len = bytes.byteLength;
                    for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
                    return window.btoa(binary);
                }
            }
        }

        /******
        **
        **  第二阶段 —— 图片集预处理进程 **
        **
        **
        1、对符合脚本处理要求的链接进行预处理，以便于后续的核心请求函数获取图片真实地址
        2、处理内容保护，跳转链、适用规则筛选
        3、根据适用规则对请求数据加工
        **
        **/
        //
        let ImageAjaxPre = (i, that) => { //that = A 超链接，i = index

            //处理跳转链
            if(JumpHost[that.host.replace(/^www\./i,'').toLowerCase()]) that.href=decodeURI(getUrlParam(JumpHost[that.host.replace(/^www\./i,'').toLowerCase()]['url'], that.href));
            //处理域名
            if(HostToList[that.host.toLowerCase()]) that.host=that.host.toLowerCase().replace(that.host,HostToList[that.host.toLowerCase()]);

            let thisDomain=that.hostname.replace(/^www\./i,''),
                HostConf=ImgHost[that.host]||ImgHost[thisDomain]; //图床规则装载

            console.log('ImageAjaxPre: ', HostConf||'图床规则装载失败（可能不存在该域名规则）', that, that.host, thisDomain);
            if(!HostConf.host) HostConf.host=that.host;

            //过滤掉超链接中的[UBB]内容
            that.href=that.href.replace(/%5B\/?img%5D/ig,'').replace(/\[\/?img\]/ig,''); //过滤掉 [/?img]

            //配置数据加工
            HostConf.href=that.href;

            msg({'title': `2、ImageAjaxPre HostConf —— ${that.host}`, css:"color: red;background:yellow", type:'title'},
                {'title':'Url Path', 'text':that.pathname, css:'color: green;'},
                {'title':'Config', 'text':HostConf, css:'color: #DD045B;'},
                {'title':'Path匹配', 'text':HostConf['path']?HostConf['path'].test(that.pathname):'无路径匹配', css:'color: green;'}
               );

            /**
            **** 规则适配顺序 ****
            1、适配网站专用规则
            2、重定向网址
            3、直链
            4、直链403情况（未完成）
            5、不支持网站（alt内容提示）
            6、失效图床（alt提示图床失效）
            7、通用规则（调取核心图像请求，由核心处理）
            **/
            if(HostConf['isIMG']) { //使用内部专用的处理方法
                if(HostConf['isIMG'](that)) CallImageHostAjaxCore(that, HostConf);
            } else if(HostConf.redirect){
                that.href=HostConf.redirect(that);
                ImageAjaxPre(i, that);
            }
            else if(HostConf['direct']) { //可以直接进行加载，不需要 ajax
                $(that).append('<br>',$('<img>').attr({'class':'ImageHostAjax', 'src': that.href, 'alt': "图片占位", 'data-AjaxSrc': that.href}));
            } else if(HostConf['direct403']) {
                GM_xmlhttpRequest({
                    url: AjaxConf.urls,
                    data : $.param(AjaxConf.data.formdata, true),
                    method: AjaxConf.data.method,
                    headers : AjaxConf.data.headers,
                    cookie: AjaxConf.cookie,
                    onload: function (result) {
                    }
                });
            } else if(HostConf['notSupport']) {
                $(that).append('<br>',$('<img>').attr({'class':'ImageHostAjax', 'alt': "因防盗链系统，不支持图床： " + HostConf.host}));
            } else if(HostConf['noLink']) {
                $(that).append('<br>',$('<img>').attr({'class':'ImageHostAjax', 'alt': "已失效图床： " + HostConf.host}));
            }
            //else if(HostConf['path']&&HostConf['path'].test(that.href)) { //需要匹配路径的规则
            else {
                CallImageHostAjaxCore(that, HostConf);
            }
        }

        //用于第二阶段，调用核心进程
        function CallImageHostAjaxCore(that, HostConf){
            //无路径匹配，获取图片
            $(that).append('<br>',$('<img>').attr({'class':'ImageHostAjax', 'src': '', 'alt': "图片占位", 'data-AjaxSrc': that.href}));
            if(HostConf['pre']) HostConf['pre'](that.href, HostConf);

            HostConf.ImageHostRule={ //用于 AjaxCore 中获取图像地址的规则
                'errorTips': HostConf['errorTips'],
                'selection':HostConf['rule'],
                'attr':HostConf['attr']||'src',
                'text':HostConf['text'],
            };
            ImageHostAjaxCore({ //调用核心请求
                'urls': that.href,
                'host': that.host,
                'HostRuleConf' : HostConf,
                'ImageHostRule': HostConf['ImageHostRule'],
                'data':{method:HostConf['method']||'get', formdata: HostConf['formdata']||{}, headers:HostConf['headers']||{'Content-Type': 'application/x-www-form-urlencoded',}},
                'cookie':HostConf['cookie']||'',
                'form': HostConf['form']||'', //需要二次提交表单的时候使用
                'onload' : HostConf['onload'], // ImageHostAjaxCore 使用该 onload 方法时，则不使用 success 的处理结果
                'process' : HostConf['process'], //站点无 onload 方法时，ImageHostAjaxCore使用该 process 方法，不使用 success 的处理结果
                'success':function(src, doc){
                    //log('-ImageHostAjaxCore-', HostConf, '---', src);
                    //此属性为处理 ImageHostAjaxCore 返回结果使用，使用 HostConf['success'] 时，则先处理 HostConf['success'] 中的内容
                    if(HostConf['success']) HostConf['success'](that, src);

                    //console.log('%c 获取到地址：'+src, 'color:green');
                    if(HostConf.src) src=HostConf.src(src); //使用对应站点规则，内置的特殊方法提取Src
                    if(HostConf.big) src=smallToBig(src); //将小图转换为大图，来源于 metaInSmallToBig 规则

                    msg({'title': HostConf.host + ' 核心结果', css:'color:red', type:'title'}, {'title':'HostConf: ', 'text': HostConf, css:'color:red', type:'warn'});


                    //屏蔽了热链接的图床需要二次get图片资源，以 blob 输出
                    if(domainRuleConfig && domainRuleConfig.CSP) {
                        ajaxLib.base64Img(HostConf, src, that);
                    }
                    else if(HostConf['blobImg']) {
                        ajaxLib.blobImg(HostConf, src, that);
                    }
                    else {
                        //显示图片内容
                        $('img[data-AjaxSrc="'+that.href+'"]').attr('src', src);
                    }

                    //移除旧的缩略图
                    $(that).find(HostConf.thumb).remove();
                }
            });
        }
        //图片集 Ajax 请求发起进程
        /***
        *
        *   第一阶段 ——
        *
        *
        ***/
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
        if(domainRuleConfig) {
            console.log('domainRuleConfig:', domainRuleConfig);

            if(domainRuleConfig['MObserver']) {
                MObserver(domainRuleConfig['MObserver'], function(mutations, observer){
                    //mutations 是每次变化的记录集，数组类型
                    //console.log('observer: ', observer)
                    //console.log('mutations:', mutations);
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
                if(domainRuleConfig.CSP) AjaxCoreProcess();//ImageAjaxPre('base64');
                else AjaxCoreProcess(); //调用图片加载进程
            }
        } else {
            console.log('通用站点规则')
            AjaxCoreProcess();
        }

    }

    console.groupEnd(' -----===== Ajax ImageHost =====----- ');

    //第三阶段——图像加载核心进程
    function ImageHostAjaxCore(AjaxConf){

        let Ajax_onload=(doc, sources)=>{ //Ajax 成功结果处理
            console.log(`请求来源：${sources}`);

            msg({'title': AjaxConf.host + ' ajax 结果' + " —— " + AjaxConf.urls, css:'color:red;background:#a0ffc0', type:'title'}, {'title': 'AjaxConf', text:AjaxConf, css:"color: green;"});

            let result=$(parsetext(doc)); //返回的内容，没有 responseText
            let src, t = result.find(AjaxConf.ImageHostRule.selection), //使用站点规则的 rule 来做选择器
                errorTips = result.find(AjaxConf.ImageHostRule.errorTips).text();

            //检测是否存在错误提示
            if(errorTips) {
                console.warn('图片不存在：', errorTips);
                console.log(AjaxConf.urls, this);

                $('img[data-AjaxSrc="'+(AjaxConf.OriginalUrl||AjaxConf.urls)+'"]').attr('alt', `图片不存在：${errorTips.trim()}`);
            }
            //检测是否链接已过期
            else if(doc=='Link expired') {
                $('img[data-AjaxSrc="'+(AjaxConf.OriginalUrl||AjaxConf.urls)+'"]').attr('alt', `链接已过期：${doc}`);
            }
            else { //没有错误提示时，进入图片地址识别流程
                log(t, AjaxConf.ImageHostRule.text, t.text(), t.attr(AjaxConf.ImageHostRule.attr));
                src = AjaxConf.ImageHostRule.text ? t.text(): t.attr(AjaxConf.ImageHostRule.attr);
                msg({'title': AjaxConf.host + ' responseText', text:!src?'图片地址无法显示，responseText：\n'+doc:'已找到匹配图片，不显示请求内容', css:"color: #a0ffc0;"})
                msg({'title': '图片地址', text:src, css:"color: green;"}, {'title': 'img', text:t, css:"color: green;"});
                if(!src) {
                    notifyMe('未获取到图片地址');
                    debugger;
                    return false;
                }
                AjaxConf.success(src, doc);
            }
            //return t;
        }

        //核心进程开始处理
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
                    console.log('ImageHostRule.selection', $(formDoc).find(AjaxConf.ImageHostRule.selection))
                    switch(result.status) {
                        case 404:
                            $('img[data-AjaxSrc="'+(AjaxConf.OriginalUrl||AjaxConf.urls)+'"]').attr('alt', `404错误，图片不存在`);
                        break;
                        default:
                        Ajax_onload(formDoc);
                    }
                }
            });
        } else { //默认 Get 方法
            console.warn('使用Get方法')
            //console.log(AjaxConf);

            if(AjaxConf.HostRuleConf.reHost) { // soDaBug 处理方法，替换掉 Host
                AjaxConf.OriginalUrl=AjaxConf.urls; //备份原始地址
                //AjaxConf.urls=AjaxConf.urls.replace(/(?<=\/\/)[^/]+/, AjaxConf.HostRuleConf.reHost);
                let newURL=new URL(AjaxConf.urls);
                newURL.host=AjaxConf.HostRuleConf.reHost
                AjaxConf.urls=newURL.href;
                log('-reHost-', AjaxConf.urls);
            }

            if(AjaxConf.HostRuleConf.NoFileName) { //请求的地址不包含文件名
                AjaxConf.urls=AjaxConf.urls.replace(/\/[^/]+\.(jpg|png|gif|webp)$/i, '');
                AjaxConf.href=AjaxConf.urls;
                log('-NoFileName-', AjaxConf.urls)
            }

            if(AjaxConf.data.headers) {
                AjaxConf.data.headers.referer=AjaxConf.urls;
            }

            msg({'title': AjaxConf.host + ' Ajax Data', type:'title', css:"color: red;background:#a0a0ff"},
                {'title': 'AjaxConf', text: AjaxConf, css:"color: #0EB9F9;"},
                {'title': 'AjaxConf data', text:AjaxConf.data, css:"color: yellow;"}
               );

            GM_xmlhttpRequest({
                url: AjaxConf.urls,
                data : $.param(AjaxConf.data.formdata, true),
                method: AjaxConf.data.method,
                headers : AjaxConf.data.headers,
                cookie: AjaxConf.cookie,
                onload: function (result) {
                    log('-Ajax Get- ', result);
                    //用于比较请求地址与响应地址是否一致
                    console.table({'sourcesUrl': AjaxConf.urls, 'finalUrl': result.finalUrl, reHost: AjaxConf.HostRuleConf.reHost});


                    if(AjaxConf.urls!==result.finalUrl) { //请求地址与响应地址不一致，进行更新之后再重新请求
                        AjaxConf.OriginalUrl=AjaxConf.urls; //备份原始地址
                        AjaxConf.urls=result.finalUrl;
                        console.log(`替换URL为：${AjaxConf.urls}`);
                        ImageHostAjaxCore(AjaxConf);
                        return false;
                    }

                    if(AjaxConf['onload']) {
                        AjaxConf['onload'](result, AjaxConf);
                    }
                    // * 此属性为 ImageHostAjaxCore 核心处理结果，如果要使用站点自有的 onload 方法，请在站点配置（AjaxConf）时设置 onload 属性或 process 属性
                    // *

                    //let doc = parsetext(result.responseText), //转换可被jQuery识别的对象结构

                    console.log(result.responseText, $(result.responseText));
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
                    if(AjaxConf.form) { //执行二次请求才能获取图片
                        if(typeof AjaxConf.form=='boolean') { //初始化 form 数据
                            console.log('需要主动生成 form 表单数据');
                            AjaxConf.form={};
                            AjaxConf.form.method='post';
                            AjaxConf.form.header={
                                'Content-Type': 'application/x-www-form-urlencoded',
                            }
                        }
                        console.log(' 发现 form 表单', $(parsetext(doc)).find('form'), $(parsetext(doc)).find('form').length);
                        let docForm=$(parsetext(doc)).find('form');
                        if(docForm.length>0) { //存在可提交表单时
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
                                //PostData+="&g-recaptcha-response="+$(docForm).find('.g-recaptcha').data('sitekey');

                                notifyMe('机器人检测提醒，需要输入验证码', `遇到机器人检测，请点击通知访问网站，手动输入验证码后，再刷新本页面。\n${result.finalUrl}`, function(){
                                    GM_openInTab(result.finalUrl, false);
                                })

                                $('[data-ajaxsrc="'+result.finalUrl+'"]').on('mouseover', function(){
                                    if(!$(this).attr('src')) {
                                        ImageHostAjaxCore(AjaxConf);
                                    }
                                });
                                return false;
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
                                        Ajax_onload(formDoc, '二次 form 请求');
                                    }
                                }
                            });
                        } else { //免 form 提交数据
                            console.warn('不存在可提交表单');
                            Ajax_onload(doc, '免 form 提交数据');
                        }
                    } else {
                        Ajax_onload(doc, '通用方案');
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

    function es(text){
        if(!document.querySelector('#everything')) $('body').after($('<a>').attr({'id':'everything','href':'es://'}).hide());
        $('#everything').attr('href','es://'+text);
        document.querySelector('#everything').click();
    }

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
        ;
        let search = new URLSearchParams(url ? new URL(url).search : location.search);
        //log('URLSearchParams', name, url, search, search.get(name));

        return search.get(name);
    }

    //网红关注管理模块
    function Follow(){

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

    function log(...arg){
        if(log_control)
            if(arg.length>2) {
                console.group('--- arg ---');
                console.log(arg);
                console.groupEnd();
            }
            else
                console.log(arg);
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


        // 先检查浏览器是否支持
        if (!("Notification" in window)) {
            alert("当前浏览器不支持桌面通知，将使用 GM 通知接口");

            if(GM_notification) {
                console.log('使用GM通知接口', GM_notification)
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
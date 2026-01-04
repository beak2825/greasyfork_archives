// ==UserScript==
// @name        Japonx 字幕&视频 下载（支持PotPlayer播放）—— VIP破解
// @namespace   https://www.jianshu.com/u/a7944416fe15
// @description 下载 japonx 的字幕和视频。
// @version     5.1.3.2
// @author      ThisAV
// @connect     japronx.com
// @connect     japonx.net
// @connect     japonx.vip
// @connect     japonx.tv
// @connect     japonx.me
// @connect     1zb27xawwzcypdthone.com
// @connect     x18r.com
// @connect     aoborl.com
// @connect     chuumm.cn
// @include     /https?://(([^.]+\.)?(?:japonx.(net|vip|tv|me))|x18r.com)/(?:index.php/)?portal/index/detail/id//
// @include     /https?://(([^.]+\.)?(?:japonx.(net|vip|tv|me))|x18r.com)/(?:index.php/)?portal/index/detail/identification//
// @include     /https?://(([^.]+\.)?(?:japonx.(net|vip|tv|me))|x18r.com)/?(?:index.php)?$/
// @include     /https?://(([^.]+\.)?(?:japonx.(net|vip|tv|me))|x18r.com)/(?:index.php/)?portal/index/search//
// @include     /https?://(([^.]+\.)?(?:japonx.(net|vip|tv|me))|x18r.com)/(?:index.php/)?portal/index/search.html/
// @include     /https?://(([^.]+\.)?(?:japonx.(net|vip|tv|me))|x18r.com)/(?:index.php/)?portal/index/plays.html
// @include     http://cdn.1zb27xawwzcypdthone.com/*
// @run-at      document-idle
// @require     https://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @require     https://greasyfork.org/scripts/373130/code/ProtocolCheck.js?version=635816
// @icon        https://www.japonx.tv/favicon.ico
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @grant       GM_addStyle
// @grant       unsafeWindow
// @grant       GM_setClipboard
// @grant       GM_xmlhttpRequest
// @grant       GM_openInTab
// @grant       GM_download
// @grant       GM_notification
// @grant       GM.info
// @downloadURL https://update.greasyfork.org/scripts/434281/Japonx%20%E5%AD%97%E5%B9%95%E8%A7%86%E9%A2%91%20%E4%B8%8B%E8%BD%BD%EF%BC%88%E6%94%AF%E6%8C%81PotPlayer%E6%92%AD%E6%94%BE%EF%BC%89%E2%80%94%E2%80%94%20VIP%E7%A0%B4%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/434281/Japonx%20%E5%AD%97%E5%B9%95%E8%A7%86%E9%A2%91%20%E4%B8%8B%E8%BD%BD%EF%BC%88%E6%94%AF%E6%8C%81PotPlayer%E6%92%AD%E6%94%BE%EF%BC%89%E2%80%94%E2%80%94%20VIP%E7%A0%B4%E8%A7%A3.meta.js
// ==/UserScript==

(function(){
/*****
 * 更新日志 *
 ************
 * 5.2.2 2021.04.13
 1、GM存储在each完成后进行

 * 5.1.2 2020.07.16
 1、修复 ID_Hash 提取
 2、其它优化

 * 5.1.1 2020.07.13
 1、停止使用 localStorage 存储数据，完全改用 GM_value API

 * 5.0.1 2020.06.11
 1、修复新获取到的 id 按钮没有绑定 everything 搜索功能

 * 5.0.0 2020.05.11
 1、解码 eval 数据获取视频链接

 * 4.10.22 2020.04.27
 1、番号名提取修正带T

 * 4.10.21 2019.12.23
 1、修正【GM】数据重构中，对无效数据自动删除的问题
 2、修正【情况3】不存在数据时，缺少 videoid 信息不断重复插入数据的问题

 * 4.9.21 2019.12.07
 1、修复数据修正中，女优数据获取错误的问题，已获取的数据需要重新修正
 2、优化 “3、不存在” 情况的数据获取逻辑
 3、同时优化 com.ajaxID 方法，更完善的数据获取逻辑，以及数据获取成功后，添加的 fanhaoBtn 数据同步。

 * 4.8.20 2019.11.26
 1、修正“中字”标签识别（原文字表示变更为图片标识）
 2、移除 identification 页面人工添加 VIP、字幕 标识
 3、更改 Everything 协议使用独立隐藏的超链接对象来激活
 4、番号按钮需要按住 Ctrl 才会触发下载封面

*****/

    'use strict';

    var Table_IMG='IMG_Hash', //GM表名
        Table_IMG_Cache, // IMG缓存表
        GM_DB_Cache //临时数据对象
    ;


    Table_IMG_Cache=GM_getValue(Table_IMG)||{"length": 0}; //初始化GM缓存表
    if(Table_IMG_Cache.length==0) GM_setValue(Table_IMG, Table_IMG_Cache);
    if(!localStorage['toDay'] || getDate(localStorage['toDay'])!==getDate()) {
        localStorage['toDay']=getDate();
        console.log(localStorage.length, Table_IMG_Cache.length);
        for(let key in Table_IMG_Cache){
            if(key.length==32) {
                console.log(key, Table_IMG_Cache[key]);
                if(Table_IMG_Cache[key]['id'] && Table_IMG_Cache[key]['id'].length==32) localStorage[Table_IMG_Cache[key]['id']]=JSON.stringify(Table_IMG_Cache[key]);
            }
        }

    }

    let mod_Count=0, outData=[];
    var mod=function(VD, e){
        console.group('----- 执行数据修正 -----');
        let oldVD=JSON.parse(JSON.stringify(VD)); //复制对象
        var parent=$(e).parentsUntil('ul','li'),
            zimu_img=parent.find('.zimu_img, #zimu, #zimu2').length>0,
            vipimg=parent.find('.vipimg, #vip').length>0, //检测当前对象是否为VIP视频
            yanyuan=parent.find('a[href*="/yanyuan_id/"]').text(), //获取演员信息


            //要进行数据修正的内容
            IMG_Hash=VD.img||e.src.replace(/.+\/upload\/admin\/(\d+)\/(\w{32}).(?:jpg|png)/ig, '$2'),
            IMG_Date=VD.imgdate||e.src.replace(/.+\/upload\/admin\/(\d+)\/(\w{32}).(?:jpg|png)/ig, '$1');

        //msg({title: '修正对象', text:e, css:'background:#466B35;color:yellow;', type:'title'}, {title:'VD', text:VD}, {title:'oldVD', text:oldVD});
        //msg({title:'parent', text:parent}, {title:'IMG_Hash', text:IMG_Hash}, {title:'IMG_Date', text:IMG_Date}, {title:'zimu_img', text:zimu_img}, {title:'vipimg', text:vipimg}, {title:'yanyuan', text:yanyuan})

        /*--- 追加演员信息 ---*/
        if(!VD.yanyuan||VD.yanyuan!==yanyuan) {
            //console.warn('演员：', yanyuan);
            //StorageDB_GM('IMG_Hash', IMG_Hash).add('yanyuan', yanyuan)
            VD.yanyuan=yanyuan;
        }
        /*--- 追加 VIP 信息 ---*/
        if(VD.vip==undefined||VD.vip!==vipimg){
            //如果没有字幕记录，但有字幕标记，添加字幕记录
            //console.warn('VIP：', vipimg);
            //StorageDB_GM('IMG_Hash', IMG_Hash).add('vip', vipimg);
            VD.vip=vipimg;
        }
        /*--- 追加字幕信息 ---*/
        if(VD.zimu==undefined||VD.zimu!==zimu_img){
            //如果没有字幕记录，但有字幕标记，添加字幕记录
            //console.warn('字幕：', zimu_img);
            //StorageDB_GM('IMG_Hash', IMG_Hash).add('zimu', zimu_img);
            VD.zimu=zimu_img;
        }
        /*--- 追加封面日期 ---*/
        if(!VD.imgdate){
            //console.warn('封面日期：', IMG_Date);
            //StorageDB_GM('IMG_Hash', IMG_Hash).add('imgdate', IMG_Date);
            VD.imgdate=IMG_Date;
        }
        /*--- 追加 IMG_Hash ---*/
        if(!VD.img){
            //console.warn('img：', IMG_Hash);
            //StorageDB_GM('IMG_Hash', IMG_Hash).add('img', IMG_Hash);
            VD.img=IMG_Hash;
        }
        /*-- VIP 图片移动到封面前 --*/
        e, parent.find('.vipimg').parent().insertBefore(e);
        console.groupEnd();
        if(dataDiff(VD, oldVD, true, VD.img)) {
            console.log('添加数据');
            console.table({'修正前':oldVD, '修正后':VD});
            mod_Count++;
            StorageDB_GM('IMG_Hash', IMG_Hash).insert(VD);
        }
        return VD;
    }

    const isNullOrUndefined=obj=>obj===null || obj === undefined;
    function dataDiff(data1, data2, diff, time_label){ //数据比较，数据相同则停止操作
        /***
         * data1 = 新数据集
         * data2 = 旧数据集
         * diff = 比较模式开关
         ** diff = true，如果出现数据差异，则返回比较结果true
         ** diff = false，则返回 newData
         * time_label = console.time 的标签名
        ***/
        console.time(time_label);
        let count1=0, count2=0, count3=0, newData={};

        for(let key in data2) { //data2遍历
            if(!isNullOrUndefined(data1[key])) {//判断旧数据是否存在对应键值
                if(typeof(data2[key])==typeof(data1[key])) //判断键值数据类型是否相同
                    if(data2[key]==data1[key]) {//判断键值是否相同
                        newData[key]=data2[key];
                        count3++;
                    }
                    else {
                        //alert('数据不同');
                        if(diff) {
                            outData.push(JSON.stringify({'change':data2.img, key: key, old_data:data2.key, new_data:data1.key})); //记录要输出的数据
                            return true;
                        }
                    }
                else {
                    //alert('数据类型不同');
                    if(diff) return true;
                }
            }
            else {
                newData[key]=data2[key];
                //alert('data1 没有数据');
                console.log('data1 没有数据', key, data2[key], data1[key])
                if(diff) return true;
            }
            count2++;
        }
        console.log('data2遍历完毕');
        for(let key in data1) { //data1遍历
            if(isNullOrUndefined(newData[key])){ //新数据集不存在数据时
                //alert('newData 没有数据');
                if(diff) {
                    outData.push(JSON.stringify({'new':key, data:data1[key]})); //记录要输出的数据
                    return true;
                }
                if(isNullOrUndefined(data2[key])) {//2数据集不存在数据时
                    //alert('data2 没有数据');
                    if(diff) return true;
                    else {//存入数据
                        newData[key]=data2[key];
                        count3++;
                    }
                }
                else if(typeof(data2[key])==typeof(data1[key])) //判断键值数据类型是否相同
                    if(data2[key]==data1[key]) {//判断键值是否相同
                        newData[key]=data2[key];
                        count3++;
                    }
                    else {
                        alert('数据不同');
                        if(diff) return true;
                    }
                else {
                    alert('数据类型不同');
                    if(diff) return true;
                }
            }
            count1++;
        }
        console.log('data1 遍历完毕');
        console.timeEnd(time_label);
        if(count3==count2 && count3==count1 && count2==count1) return false;
        console.log(count3, count2, count1);
        return true;
    }

    msg({title:'JaPonX 数据加载', css:'color:red;background:yellow;', type:'title'}, {title:'IMG_Hash:', text: GM_getValue('IMG_Hash').length});

    var u=unsafeWindow,
        urls=location.href,
        host=location.hostname,
        IDRule=/[TC]$/i;

    var CopyVideoUrl=false, //自动复制m3u8地址开关
        ID_Hash, IMG_Hash;

    var VideoData; //localStorage 信息缓存
///*【自定义】图片列表——番号字幕标签*/.zimu_zhongwen{width: 36px!important;position: absolute!important;left: 5px!important;}
    GM_addStyle(`
/*女优Btn*/ section#contents ul#works p a {margin:0px 1px 1px!important;border:2px solid #d7dadb!important;}
/*女优Btn*/ section#contents ul#works p a:hover {border:2px solid #00aaff!important;}
/*女优Btn*/ section#contents ul#works p a[href*="/yanyuan_id/"] {width:105px;height:auto;}
/*主体框架扩宽*/ #contents, ul#works{width:1300px!Important;}
/*图片列表——悬停背景色*/section#contents ul#works li:hover{background:#DD045B;}
/*图片列表——框架调整 & 边距取消*/section#contents ul#works li{width:260px;height:390px;margin:0px!Important;text-align:center;margin-bottom:20px!important;}
/*图片列表——图片大小调整*/#contents ul#works li a>img{width:auto!important;height:340px!Important;}
/*图片列表——图片边框*/#contents ul#works li a>img{border:solid 5px #FFFCE6!important;box-sizing:border-box!important;padding:3px;}
/*图片列表——图片悬停边框*/#contents ul#works li a:hover>img{border:solid 5px #00aaff!important;}
/*图片列表——图片已访问边框*/#contents ul#works li a:visited>img{border:solid 5px #047ABF!important;}
#to-page-top {width:auto;}
#ajaxid {display: inline;border-radius: 40px;border: solid 3px #3E7237;padding: 10px;width: 80px;box-sizing: border-box;background: #fff;}
/*图片列表——字幕标签*/section#contents ul#works li a .zimu_img{left:10px;}
/*【自定义】图片列表——番号字幕标签*/.zimu_zhongwen:after{position: absolute;left:0px;top:0px;background-image:url('/themes/simpleboot3/public/assets/images/zhongwen.png')!important;background-size:36px!important;background-repeat:no-repeat!important;opacity: 0.5;content:"";width:38px;height:38px;}
/*【自定义】图片列表——番号Btn*/ .fanhao {position:relative;width:110px!important;padding-left:10px!important;margin-left:3px!important;}

/*ID页面*/
dl.desc {width:400px;}
dl.desc>dd {padding-left:50px!important;} /*信息内容左边距缩小*/
#d-btn {width:300px;}
#d-btn>a {margin:0 7px 7px 0!important;}

/* m3u8 btn*/
.d-btn#m3u8{
color:blue;
width:100px;
font-weight:bold;
}

#contents-inline dl a:hover{
border:2px solid #00aaff!important;
margin:0 7px 7px 0!important;/*.no-hover 中为 8px，此处强制统一*/
}
/*.play{margin-right:0px!important;}*/

#JaPonxTool{position:absolute;right:280px;top:20px;}
.btnC{
height:42px;
line-height:42px;
font-size:18px;
cursor:pointer;
border:2px solid #d7dadb;
padding:0px 8px;
/*border-radius:6px;*/
display:inline-block!important;
color:#000;
background:#fff;
}
`);

    $('body').after($('<a>').attr({'id':'everything','href':'everything://'}).hide());
    var com={
        AutoSearch: true, //自动记录开关
        SearchIndex: false,
        CoverMax: $('#works>li>a>img').length,
        CoverCount: 1,
        AjaxCount: 0,
        AjaxList: [],
        Count : function(){
            console.log('遍历计数：', this.CoverMax, this.CoverCount);
            if(this.CoverCount<this.CoverMax) {
                this.CoverCount++;
                u.layer.tips('更新记录'+this.CoverCount, '#ajaxid', {tips: ['2', '#077ee3']});
            } else {
                //所有结果已经获取到
                u.layer.tips('已记录'+this.CoverCount, '#ajaxid', {tips: ['1', '#077ee3'], tipsMore: true, time: 60000});



                if(this.SearchIndex) {
                    var EndPage=$('[title="尾頁"]').attr('href'),
                        MaxPage=parseInt(getUrlParam('page', EndPage)),
                        CurPage=parseInt(getUrlParam('page'));
                    console.log('自动翻页：', EndPage, MaxPage, CurPage, CurPage<MaxPage);
                    if(getUrlParam('AutoSearch')=='true'&&CurPage<MaxPage) {
                        location.href=getUrlParam('page', location.href, 'new', parseInt(CurPage)+1);
                    }
                }
            }
        },
        ajaxID : function(obj, ajax_VideoData) {
            var ajax_ID_Hash=ajax_VideoData.id, ajax_IMG_Hash=ajax_VideoData.img;

            console.log('ajaxID ajax_VideoData:', ajax_VideoData);
            //用于普通视频的ID获取，信息可以从页面中的番号标签直接提取
            GM_xmlhttpRequest({
                url : '/portal/index/detail/identification/'+ajax_ID_Hash+'.html',
                method :'get',
                responseType : 'text',
                async : false,
                timeout : 60000,
                onload : function(e){
                    console.group('----- ajaxID: '+ ajax_ID_Hash +'-----');
                    var res=e.responseText;
                    res=parsetext(res);
                    //error 信息内容：請輸入驗證碼、此片为vip独享、此片為會員獨享 - 將自動跳轉到购买頁面

                   if($(res).find('.error').text()=='此片為會員獨享 - 將自動跳轉到購買頁面'){
                        com.vip_ajax(obj, ajax_ID_Hash, ajax_IMG_Hash);
                    } else if($(res).find('.error').text()) {
                        //其它的错误信息
                        msg({title:'ajaxID error', text:ajax_IMG_Hash, type:'title', css:'color: red;'}, {title:'VideoID', text:VideoID, type:'', css:''}, {title:'ID_Hash', text:ajax_ID_Hash, type:'', css:''}, {title:'IMG_Hash', text:ajax_IMG_Hash, type:'', css:''}, {title:'obj', text:obj, type:'', css:''}, {title:'err text', text:$(res).find('.error').text(), type:'', css:''});
                    } else {
                        console.log('%c 开始获取数据', 'color: #f33');
                        //var VideoID=$(res).find('dt:contains(番號)').next().text().trim().replace(/[TC]$/i,''); //番号
                        let VideoID=$(res).find('img[src*="/themes/simpleboot3/public/assets2/img/detail/2.png"]').next().text().trim().replace(/[TC]$/i,'');  //新改版番号
                        if(VideoID=='undefined'||VideoID==undefined) VideoID='VIP';
                        console.log('%c VideoID: '+VideoID, 'color: #f33');

                        if(VideoID) {
                            msg({title:'ajaxIDFn VideoID', text:'', type:'title', css:''}, {title:'VideoID', text:VideoID, type:'', css:''}, {title:'ID_Hash', text:ajax_ID_Hash, type:'', css:''}, {title:'IMG_Hash', text:ajax_IMG_Hash, type:'', css:''});
                            com.Count();
                            //更新记录
                            StorageDB_GM('IMG_Hash', ajax_IMG_Hash).add({'id': ajax_ID_Hash, 'videoid':VideoID});

                            ajax_VideoData.videoid=VideoID;
                            //PageID 页面，番号添加
                            com.inserfanhao(obj, ajax_VideoData);

                            console.log('免费视频事件：', ajax_ID_Hash);
                            $(obj).click(function(){
                                console.log('免费视频事件：', obj, ajax_ID_Hash);
                                if(ID_Hash!=='VIP') {
                                    console.log('ID页面 获取其它封面的信息：', ajax_ID_Hash, ajax_IMG_Hash);
                                    localStorage[ajax_ID_Hash]=JSON.stringify(Table_IMG_Cache[ajax_IMG_Hash]);
                                }
                            });
                        }
                        console.groupEnd();
                    }
                },
                'error' : function(e){
                    console.log('$ error:', e);
                }
            });
        },
        vip_ajax : function(obj, ajax_ID_Hash, ajax_IMG_Hash){
            //用于 VIP 页面下番号获取，VIP视频的番号必须通过 ajax 方式获得

            $.ajax({
                'url': '/portal/index/detail/identification/'+ajax_ID_Hash+'.html',
                type : 'get',
                async: true, //同步请求
                success : function(e){
                    console.group('%c IMG_Hash: '+ajax_IMG_Hash+' 采用 VIP 方法', 'background:#FFFCE7;color:red;');
                    console.log('ID: ', ajax_ID_Hash);
                    console.log('目标对象：', obj);

                    $.ajax({
                        url : '/portal/index/ekzloi.html?identification='+ajax_ID_Hash,
                        type: 'get',
                        async : true, //同步请求
                        success : function(e){
                            var ajaxData=e.responseText;
                            if(ajaxData=='非vip账号不能播放') {
                                console.log('%c VIP账户限制，无法获得数据', 'background:#FF9900;color:red;');
                                console.log('arrData', Table_IMG_Cache[ajax_IMG_Hash]);
                                return false;
                            } else {
                                console.log('可获得数据：', e)
                            }
                        }
                    });
                    console.groupEnd();
                }
            });
        },
        inserfanhao : function(that, imgVideoData){//图片对象，对应的数据
            //封面番号插入，点击 复制&下载 番号封面图片
            var fanhaoBtn=$('<a>').attr({'href':that.src, 'download':'【'+imgVideoData.videoid+'】'+'【'+imgVideoData.yanyuan+'】'+imgVideoData.img, 'target':'_blank','class':'fanhao','id':imgVideoData.videoid}).css('color', Table_IMG_Cache[IMG_Hash].vip?'blue':'').text(imgVideoData.videoid).click(function(){
                GM_setClipboard(imgVideoData.textContent);
                layer.msg('已复制番号');
            });
            imgVideoData.zimu?fanhaoBtn.addClass('zimu_zhongwen'):''
            $(that).parent().next().append(fanhaoBtn);
        },
        each : function(callback){
            //遍历封面预览图，记录对应的 PageID 信息
            GM_addStyle(`.vipimg{position: relative;z-index: 10000;top:210px;bottom: 0px;width: 100px;height: 100px;left: 0px;}`);

            $('#works>li>a>img').each(function(index, e){
                this.parentNode.target='_blank';
                IMG_Hash=this.src.replace(/.+\/upload\/admin\/(\d+)\/(\w{32}).(?:jpg|png)/ig, '$2');
                let imgA=this.parentNode,
                    parent=$(this).parentsUntil('ul','li'),
                    zimu_img=parent.find('.zimu_img, #zimu, #zimu2').length>0,
                    vipimg=parent.find('.vipimg, #vip').length>0, //检测当前对象是否为VIP视频
                    yanyuan=parent.next().find('a[href*="/yanyuan_id/"]').text(), //获取演员信息
                    VideoData=Table_IMG_Cache[IMG_Hash]||{}; //初始化封面数据

                /* ID_Hash 记录判断 */
                //检测 localStorage 缓存中的 ID

                console.group('-*-*-*-*-*- ID_Hash 提取阶段 IMG_Hash: ' + IMG_Hash + ' -*-*-*-*-*-');
                msg({title:'目标对象', text:imgA, css:'', type:''},{title:'目标对象 href', text:imgA.href, css:'', type:''},{title:'字幕', text:zimu_img, css:'', type:''},{title:'vip 影片', text:vipimg, css:'', type:''});

                if(VideoData.id) {
                    ID_Hash=VideoData.id;

                    msg({title:'存在 ID_Hash 记录', text:imgA, css:'color:red;background:yellow;', type:'title', end:false});

                    //如果记录了错误的 ID Hash，则进行修正处理
                    if(ID_Hash=='javascript:no_down();') {
                        console.warn('修正 ID_Hash', ID_Hash);
                        if(vipimg) ID_Hash='VIP';
                        else ID_Hash='';
                        VideoData.id=ID_Hash;
                    }
                    //如果 ID_Hash 是 VIP，当前不是 VIP 视频，重新截取 ID_Hash，并移除 VIP 标记
                    else if(ID_Hash=='VIP'&&(imgA.href!=='javascript:no_down();'&&imgA.href!=='javascript:;')) {
                        console.log('ID 1: VIP视频转免费视频，重新获取 ID_Hash ', 'color: blue;background:#ccc;');
                        ID_Hash=this.parentNode.href.replace(/.+\/identification\/(\w{32}).html/ig,'$1');
                        VideoData.id=ID_Hash;
                        StorageDB_GM('IMG_Hash', IMG_Hash).add('id', ID_Hash);
                    }
                    //如果 ID_Hash 是 VIP，当前视频是 VIP 视频，href 信息为 JavaScript，更新 ID_Hash
                    //该方法仅在 https://x18r.com/portal/index/detail/identification/ 地址下生效
                    else if(ID_Hash=='VIP'&&vipimg&&imgA.href.search(/javascript:;/i)>-1) {
                        console.log('%c ID 2: VIP视频，记录的 ID_Hash 为 VIP，在资源页面中获取到 ID_Hash，更新 ID_Hash ', 'color: blue;background:#ccc;');
                        ID_Hash=$(imgA).attr('onclick').replace(/goDetail\('(\w{32})'\s*,\s*'1'\)/i,'$1');
                        console.log('更新 ID 记录', ID_Hash);
                        this.parentNode.href='/portal/index/detail/identification/' + ID_Hash + '.html';
                        VideoData.id=ID_Hash;
                        StorageDB_GM('IMG_Hash', IMG_Hash).add('id', ID_Hash);
                        $(imgA).removeAttr('onclick');
                    }

                    //如果缓存 ID_Hash 不是 VIP，但已经转为 VIP 视频，则记录标记为 VIP
                    else if(ID_Hash!=='VIP'&&!VideoData.vip&&(imgA.href=='javascript:no_down();'||imgA.href=='javascript:;')){
                        console.log(' 免费视频已经转换为 VIP 资源，标记为 VIP 视频 ');
                        this.parentNode.href='/portal/index/detail/identification/'+ID_Hash+'.html';
                        StorageDB_GM('IMG_Hash', IMG_Hash).add('vip', true);
                        VideoData.vip=true;
                    } else if(ID_Hash.length==32&&(imgA.href=='javascript:no_down();'||imgA.href=='javascript:;')) {
                        //如果 ID_Hash 为 32 位，则替换链接
                        console.log('免费视频，获取到ID_Hash：', ID_Hash);
                        this.parentNode.href='/portal/index/detail/identification/'+ID_Hash+'.html';
                        $(imgA).removeAttr('onclick');
                    }
                }
                else if(vipimg&&imgA.href.search(/javascript:;/i)>-1) {
                    console.log('%c VIP 视频，获取 ID_Hash', 'color: blue');
                    ID_Hash=$(imgA).attr('onclick').replace(/goDetail\('(\w{32})'\s*,\s*'1'\)/i,'$1');
                    console.log('无 ID 记录，添加新记录', ID_Hash);
                    this.parentNode.href='/portal/index/detail/identification/' + ID_Hash + '.html';
                    VideoData.id=ID_Hash;
                    StorageDB_GM('IMG_Hash', IMG_Hash).add('id', ID_Hash);
                }
                //如果 ID 记录，不是VIP视频，直接提取 ID
                else if((imgA.href!=='javascript:no_down();'&&imgA.href!=='javascript:;')) {
                    console.warn('成功提取 ID_Hash');
                    ID_Hash=this.parentNode.href.replace(/.+\/identification\/(\w{32}).html/ig,'$1');
                } else {
                    if(vipimg) ID_Hash='VIP';
                    else ID_Hash='';
                }
                console.groupEnd('存在 ID 记录');

                msg({title: 'VideoID 检测', text:this, type:'title', type:'warn'}, {title:'IMG_Hash', text:IMG_Hash}, {title:'ID_Hash', text:ID_Hash}, {title:'VideoData', text:VideoData});

                var ajax_ID_Hash=ID_Hash, ajax_IMG_Hash=IMG_Hash;  //用于后续匿名函数事件执行
                if(!VideoData.id) VideoData.id=ID_Hash; //执行ID数据修正操作
                var ajax_VideoData=VideoData=mod(VideoData, this); //执行数据修正操作


                //存在 IMG_Hash，但 VideoID 未记录番号，ID_Hash 已明确时，更新记录
                if(Table_IMG_Cache[IMG_Hash]&&(VideoData.videoid=='VIP'||VideoData.videoid=='')&&ID_Hash!=='VIP') {
                    console.log('VIP 视频更新 VideoID');
                    msg({title: '1、已存在'+IMG_Hash, css:'background:#01A82D;color:red;', type:'title'}, {title:'VideoData', text:VideoData});

                    if(ID_Hash!=='VIP'&&VideoData.id=='VIP') {
                        console.log('%c 更新IMG_Hash：' + IMG_Hash + ' 的 ID ：' + VideoData.id + ' 为 ' + ID_Hash + '', 'background:#99DD99;color:red;');
                        VideoData.id=ID_Hash;
                    }

                    if(vipimg) {
                        console.log('这是VIP视频');
                        com.Count(); //VIP方法已不可用，直接计数
                        //com.vip_ajax_ajax(this, ajax_ID_Hash, ajax_IMG_Hash); //2020-05-12 已经无法获取VIP资源
                    } else {
                        console.log('无料视频', ajax_VideoData);
                        com.ajaxID(this, ajax_VideoData);
                    }
                }
                //如果视频有 ID_Hash 不为 VIP 值，但是 VideoID 为 UNDEFINED-UNDEFINED，重新获取 VideoID
                else if(ID_Hash!=='VIP'&&VideoData.id.length==32&&VideoData.videoid=='UNDEFINED-UNDEFINED'){
                    msg({title: '2、已存在'+IMG_Hash, css:'background:#466B35;color:red;', type:'title'}, {title:'VideoData', text:VideoData}, {title:'视频更新 VideoID', text:VideoData.videoid});
                    console.log(this);
                    //如果对象已经转为 VIP 视频，则标记为VIP

                    if(vipimg) {
                        console.log('vip 视频，采用 vip 方法获取');
                        com.Count(); //VIP方法已不可用，直接计数
                        //com.vip_ajax(this, ajax_ID_Hash, ajax_IMG_Hash);
                    } else {
                        com.ajaxID(this, ajax_VideoData);
                    }
                    u.layer.tips('已更新视频 ID', this,{
                        tips: ['1', '#ff0000'],
                        tipsMore: true,
                        time: 0
                    });
                }
                //不存在 IMG_Hash 记录，或 IMG_Hash 记录不存在 ID时，但是有 ID_Hash 时
                else if((!Table_IMG_Cache[IMG_Hash]||!VideoData.id||!VideoData.videoid)&&ID_Hash) {
                    //ID_Hash 为 VIP 时，仅作记录，不进请求操作
                    //msg('3、不存在 IMG：'+IMG_Hash, VideoData, 'background:yellow;color:red;');
                    msg({title: '3、已存在'+IMG_Hash, css:'background:yellow;color:red;', type:'title'}, {title:'VideoData', text:VideoData});
                    if(vipimg&&ID_Hash=='VIP') { //不存在记录，且视频为 VIP，所有数据信息标记为VIP
                        console.log('3、ID_Hash 为: ', ID_Hash);

                        VideoData.videoid='VIP';
                        StorageDB_GM('IMG_Hash', IMG_Hash).insert(VideoData);
                        $(this).parent().next().append($('<a>').attr({'class':'fanhao'}).text('VIP').css({'color':'red'}));
                        com.Count();
                    }
                    //否则，已知 IMG_Hash、ID_Hash 时请求信息
                    else {
                        if(vipimg) {
                            console.log('%c 3、这是VIP视频，该页面包含 ID 信息', 'background:#868686;color:white;');
                            //StorageDB_GM('VIP_ajax', IMG_Hash).insert(ajax_VideoData); //key 为 IMG_Hash
                            //com.vip_ajax(this, ajax_ID_Hash, ajax_IMG_Hash);
                            com.Count();
                        } else {
                            com.ajaxID(this, ajax_VideoData);
                        }
                    }
                }
                //存在 IMG_Hash 记录，且 ID_Hash 不为 VIP 时，且页面上不存在该视频的 VideoID 信息时
                //else if(Table_IMG_Cache[IMG_Hash]&&ID_Hash!=='VIP'&&!document.getElementById(StorageDB(IMG_Hash).find('videoid'))) {
                else if(Table_IMG_Cache[IMG_Hash]&&ID_Hash!=='VIP'&&!document.getElementById(Table_IMG_Cache[IMG_Hash].videoid)) {
                    //已知 IMG_Hash、ID_Hash 时
                    msg({title: '4、已识别'+IMG_Hash, css:'color:red;', type:'title'}, {title:'VideoData', text:VideoData});

                    //判断是否为 VIP 视频，如果为VIP视频，则对封面图片链接进行修改
                    //var vip=StorageDB(IMG_Hash).find('vip');

                    var vip=Table_IMG_Cache[IMG_Hash].vip;
                    if(vip) $(this).parent().attr({'href':'/portal/index/detail/identification/'+ID_Hash+'.html',target:'_blank'});

                    //封面番号插入，点击 复制&下载 番号封面图片
                    /*
                    $(this).parent().next().append($('<a>').attr({'href':this.src, 'download':'【'+VideoData.videoid+'】'+'【'+VideoData.yanyuan+'】'+IMG_Hash, 'target':'_blank','class':'fanhao','id':VideoData.videoid}).css('color',vip?'blue':'').text(VideoData.videoid).click(function(){
                        GM_setClipboard(this.textContent);
                        layer.msg('已复制番号');
                    }));*/
                    com.inserfanhao(this, VideoData);
                    com.Count();
                } else if($(this).parent().next().find('.fanhao').length==0){
                    msg({title: '5、VIP视频 '+IMG_Hash, css:'color:red;', type:'title'}, {title:'VideoData', text:VideoData});
                    $(this).parent().next().append($('<a>').attr({'class':'fanhao'}).text('VIP').css({'color':'red'}));
                    com.Count();
                }
                console.groupEnd('-*-*-*-*-*- ID 检测阶段 -*-*-*-*-*-');
                console.log('');

                //
                $(this).off("click").click(function imgclick(e){
                    //图片对象 Click 事件
                    console.log(ajax_ID_Hash, e);
                    console.log($(this).data("events"));

                    console.log(localStorage[ajax_ID_Hash]);
                    if(!localStorage[ajax_ID_Hash]){ //如果ID表不存在数据，添加数据
                        localStorage[ajax_ID_Hash]=JSON.stringify(Table_IMG_Cache[ajax_IMG_Hash]);
                        console.table(localStorage[ajax_ID_Hash]);
                    }
                    if(e.shiftKey){
                        var ajax_IMG_Hash_data=prompt('修改 localStorage 数据：'+ajax_IMG_Hash, JSON.stringify(Table_IMG_Cache[ajax_IMG_Hash]));
                        if(ajax_IMG_Hash_data) {
                            console.log(ajax_IMG_Hash_data);
                            Table_IMG_Cache[ajax_IMG_Hash]=ajax_IMG_Hash_data;
                            StorageDB_GM('IMG_Hash', ajax_IMG_Hash).edit(JSON.parse(ajax_IMG_Hash_data));
                            console.table(StorageDB_GM('IMG_Hash', ajax_IMG_Hash).read());
                        }
                        return false;
                    }
                    if(e.ctrlKey){
                        console.log(this.src, this.src.match(/\/(\w+)\.\w+$/));
                        GM_setClipboard(this.src.match(/\/(\w+).\w+$/)[1]);
                        layer.msg('已复制 IMG_Hash：'+ajax_IMG_Hash);
                        return false;
                    }
                });
            });
            //each 函数结尾
            $('li').on('click', 'a.fanhao', function(e, imgClick){//.off('click')
                //GM_setClipboard(this.textContent);
                layer.msg('已复制番号');
                $('#everything').attr('href','everything://'+this.id);
                document.querySelector('#everything').click();
                if(!e.ctrlKey||imgClick) return false;
            });
        }
    }


    $('#to-page-top').append($('<img id="ajaxid">').click(function(){
        new com.each();
        if(mod_Count>0) StorageDB_GM('IMG_Hash').write();
        notifyMe('新增记录：'+mod_Count, {renotify:true}, function(){
            alert(outData.join('\r\n'))
        }); //列表页面
    }).attr({'src':'data:image/png;base64,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'}))



    if(/\/portal\/index\/search/i.test(location.pathname)||location.pathname=='/') {
        //如果是搜索结果页面，则遍历封面获取信息
        //$.getScript("/static/js/layer/layer.js");
        com.SearchIndex=true;
        GM_addStyle(`
        .li_item>a {
        font-size: 18px;
        color: #45320e;
        }
        .nav-main>li{position:initial!important;left:0px!important;display:inline-block;margin: 0 5px;font-weight:bold;}
        `);
        let li_list={
            AutoSearch: {text: '自动翻页', url: 'javascript:void(0)', click: function(){location.href+='&AutoSearch=true'}},
            sjr : {text:'上架日', url: '/portal/index/search/sjr/1.html'},
            free : {text: '免费', url: '/portal/index/search/freeplay/1.html'}
        }
        $.each(li_list, function(key, obj) {
            let li_list_item=$('<a>').text(obj.text).attr({href: obj.url}).click(obj.click);
            $('ul.nav-main').append($('<li class="li_item">').append(li_list_item));
        });
        com.each();
        if(mod_Count>0) StorageDB_GM('IMG_Hash').write();
        notifyMe('新增记录：'+mod_Count,{renotify:true}, function(){
            alert(outData.join('\r\n'))
        });
    } else { //详细页面
        var PageId=location.href.replace(/.+\/identification\/(\w+).html/i,'$1'),
            //VideoID=$('dt:contains(番號)').next().text().trim().replace(/T$/i,''), //番号
            VideoID=$('img[src*="/themes/simpleboot3/public/assets2/img/detail/2.png"]').next().text().trim().replace(/[TC]$/i,''),  //新改版番号
            //AvIdol=$('dt:contains(女優)').next().text().trim(),//获得女优名字
            AvIdol=$('img[src*="/themes/simpleboot3/public/assets2/img/detail/1.png"]').next().text().trim(),
            VideoUrl,
            VideoDownload=false,
            VideoSubUrl, PlayServer='p2',
            VideoFormat='vtt',
            VttLanguage=$('#bxslider #zimu, #bxslider #zimu2').length>0?true:false, //如果有无字幕标签时，为 true
            _VideoID=VttLanguage?VideoID:'【无字幕】'+VideoID,
            download_IMG='【'+VideoID+'】'+'【'+AvIdol+'】',
            webTitle=document.title=VideoID?VideoID+'【'+AvIdol+'】'+(VttLanguage?'【中文】':'【无字幕】'):document.title,
            $btnDiv = $('form[action="/portal/index/download_1.html"]').parent(),
            //$btnDiv = $('#do_play_3').parent(),
            //$btnDiv = $('#d-btn'),
            $M3U8Btn = $('<a class="d-btn">').attr({'id':'m3u8'}).text('获取中'),
            $zmBtn = $('<a class="btnC zm" style="color:#ccc;" href="javascript:void(0);">').text('获取中'),
            $PotBtn = $('<a class="btnC PotPlayer">').css({'color':'black'}).text('Potplayer'),
            $CleanBtn = $('<a class="btnC HideText">').text('干净'),
            $ImgBtn = $('<a class="btnC">').text('IMG'),
            newM3U8Fn,
            M3U8TimeOut;
        $btnDiv.append($M3U8Btn, $zmBtn, $PotBtn, $CleanBtn, $ImgBtn);

        let playIMG=$('#do_play_1'),
            play_IMG_url=playIMG.attr('src'),
            play_IMG_FileName=play_IMG_url.replace(/.+\//, "");
        $ImgBtn.click(function(){
            //this.download=download_IMG+play_IMG_FileName;
            console.log(download_IMG);
            GM_download({
                url: play_IMG_url,
                name: download_IMG+play_IMG_FileName,
                saveAs: true, //不支持 Chrome内核
                onload: () => {
                    const promiseA = new Promise( (resolutionFunc,rejectionFunc) => {
                        resolutionFunc(777);
                    });
                    promiseA.then( (val) => {
                        playIMG.click();
                        $('#everything').attr('href','everything://'+VideoID);
                        document.querySelector('#everything').click();
                        console.log("asynchronous logging has val:",val)
                    });
                },
                onerror: (e) => {
                    GM_notification('封面下载错误', '无法下载封面', '', function(){
                        debugger;
                    })
                    console.log(e)
                }
            });
        })


        //隐藏原来的下载按钮
        $('form[action="/portal/index/download_1.html"]').hide();
        //修改番号，并附加 Everything 事件和复制番号事件
        $('img[src*="/themes/simpleboot3/public/assets2/img/detail/2.png"]').next().on('click', function(){
            GM_setClipboard(VideoID);
            layer.msg('已复制番号');
            $('#everything').attr('href','everything://'+VideoID);
            document.querySelector('#everything').click();
        }).text(VideoID);


        console.log('%c'+VideoID, 'color:red', document.title);

        new com.each(); //在详细页面中进行遍历，获取 VIP 的 ID 信息
        if(mod_Count>0) StorageDB_GM('IMG_Hash').write();
        notifyMe('新增记录：'+mod_Count,{renotify:true});

        var JaPronX={
            CheckUrl : function(url, callback, onerror){
                console.log('JaPronX.CheckUrl 开始请求：', url);
                GM_xmlhttpRequest({
                    url:url,
                    headers: {
                        //'user-agent':'PotPlayer',
                        'Host':'p2.japronx.com',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
                    },
                    method: 'head',
                    synchronous:false,
                    ontimeout:60000,
                    onload: callback,
                    onerror:onerror||function(e){
                        console.log('CheckUrl error:', e.status, url, e);
                        if(e.status==0) {
                            callback(e);
                            //$M3U8Btn.attr({'href':url,'target':'blank'}).text('服务器无响应，请求失败').css({'width':'250px','color':'red'});
                            //$M3U8Btn.attr({'href':url,'target':'blank'}).text('M3U8').css({'width':'250px','color':'red'});
                            //JaPronX.CheckTime();
                        }
                    },
                    ontimeout : function(e, s){
                        console.log('CheckUrl 请求超时', e, s);
                        $M3U8Btn.text('请求超时');
                    }
                });
            },
            newM3U8 : function(option, callback){
                u.layer.tips('点击刷新 M3U8 地址', '#m3u8', {tips:4, time: 10000});
                $M3U8Btn.attr({'href':'javascript:void(0)'}).bind('click', newM3U8Fn = function(){
                    if(option)
                        if(callback) callback(0);
                    clearTimeout(M3U8TimeOut);
                    u.layer.msg('正在刷新 M3U8 地址');
                    console.log(newM3U8Fn);
                    ajaxGetID();
                    newM3U8Fn = null;
                });
            },
            msgM3U8 : function(){
                var m3u8Url=this.href;
                if(this.href.indexOf('.m3u8')>-1) {
                    if(CopyVideoUrl) GM_setClipboard(this.href);
                    u.layer.msg('', {
                        content:'已复制 <a href="'+m3u8Url+'" download="'+_VideoID+'" color="blue">'+_VideoID+'</a> 地址<br><input type="checkbox" id="mp4"><label for="mp4">番号名+“.mp4”',
                        time: 0 //不自动关闭
                        ,btn: ['复制番号','刷新 M3U8', '关闭']
                        ,yes: function(index){
                            u.layer.close(index);
                            if($('#mp4').is(':checked')) _VideoID+=".mp4";
                            GM_setClipboard(_VideoID);
                            u.layer.msg('已复制番号');
                        },
                        btn2: function(index){
                            u.layer.close(index);
                            u.layer.msg('正在刷新 M3U8 地址');
                            $M3U8Btn.unbind('click', newM3U8Fn);
                            ajaxGetID();
                        }
                    });
                }
                return false;
            },
            CheckTime : function(){
                u.layer.tips('点击刷新 M3U8 地址', '#m3u8', {tips:4, tipsMore: true,time: 60000});
                var CheckTime=300, CheckNewM3U8,
                    t=setInterval(function(){
                        $M3U8Btn.text((CheckTime--)+'秒后自动重试');
                        if(CheckTime==0) {
                            clearInterval(t);
                            ajaxGetID();
                        }
                    },1000);
                $M3U8Btn.css({'width':'230px'});
                JaPronX.newM3U8(true, function(e){
                    CheckTime=e;
                    clearInterval(t);
                    return false;//中断后续的代码执行
                });
            }
        }

        /*******

        * ID 页面内容检测

        ********/
        var ajaxGetID=function(){
            GM_xmlhttpRequest({
                //url : '/portal/index/ekzloi.html?identification='+PageId,
                url : '/portal/index/ekzloi_1.html?identification='+PageId+"&types=2", //types 留空为默认线路，1 为亚太线路，2 为欧美线路
                method :'get',
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                responseType : 'json',
                timeout : 60000,
                onload : function(e){
                    console.group(' ***** ajaxGetID ***** ');
                    //$M3U8Btn 绑定 layer 提示组件
                    //$M3U8Btn.unbind('click');
                    //$M3U8Btn.unbind('click', newM3U8Fn);
                    //$M3U8Btn.bind('click', JaPronX.msgM3U8);

                    console.log(PageId, localStorage[PageId]);
                    if(localStorage[PageId]=='undefined') {
                        delete localStorage[PageId];
                        alert('数据加载失败');
                    }
                    let ajaxData=e.responseText, DPdata, pVideoData=JSON.parse(localStorage[PageId]);

                    //console.warn(ajaxData);
                    if(ajaxData=='非vip账号不能播放') {
                        console.log(pVideoData);
                        $('h1').append(ajaxData);
                        console.log('GM_xmlhttpRequest: ', e , e.responseHeaders);

                        //如果这是 VIP 视频，在 VIP 页面中嵌入封面图片
                        var imgsrc='/upload/admin/'+pVideoData.imgdate+'/'+pVideoData.img+'.jpg';
                        $('.system-message>h1').before($('<a>').attr({'class':'btnC','download':'【'+pVideoData.videoid+'】'+'【'+pVideoData.yanyuan+'】'+pVideoData.img,'href':imgsrc}).css({'height':'auto','float':'left'}).append($('<img src="'+imgsrc+'">').click(function(){
                            document.querySelector('#everything').href='everything://'+pVideoData.videoid;
                            document.querySelector('#everything').click();
                        })));
                        return false;
                    }


                    //转换数据为对象，命名为 DPdata
                    var japonxData=eval(ajaxData.replace(/^eval/i,''));
                    var japonxJsonData=japonxData.replace(/\s*var dp=new DPlayer\(/i,'DPdata=').replace(/\);$/,'');
                    var a=eval(japonxJsonData);

                    console.log('GM_xmlhttpRequest: ', e , e.responseHeaders);

                    var ajaxVideoUrl=DPdata.video.url,
                        ajaxVideoID=DPdata.video.thumbnails.replace(/.+\/([^\.]+)\.(?:png|jpg)/i,'$1').toUpperCase().replace(IDRule,''),
                        ajaxVideoSubUrl=DPdata.subtitle.url,
                        ajaxSubType=ajaxVideoSubUrl.replace(/.+\.(\w+)$/,'');

                    ajaxVideoID=ajaxVideoID.replace(/[CT]$/i,'');

                    //console.log('%c '+japonxData, 'color:blue;');
                    //console.log('%c '+japonxJsonData, 'color:green;');
                    console.log('DPdata: ', DPdata);

                    if(!ajaxVideoID) {
                        $.getScript("/static/js/layer/layer.js");
                    }

                    if(pVideoData.videoid=='UNDEFINED-UNDEFINED') {
                        //更新 对象信息
                        pVideoData.videoid=ajaxVideoID;
                        //更新 levelDB ID_Hash 信息
                        localStorage[PageId]=JSON.stringify(pVideoData);
                        //更新 levelDB IMG_Hash 信息
                        StorageDB_GM('IMG_Hash', pVideoData.img).edit(pVideoData);
                    }


                    if(pVideoData.videoid!==ajaxVideoID) {
                        notifyMe('当前视频ID为 ' + ajaxVideoID + '\n 与缓存 '+ pVideoData.videoid + ' 不符，是否更新？','缓存的视频 ID 不符', function(){
                            //更新 levelDB ID_Hash 信息
                            localStorage[PageId]=JSON.stringify(pVideoData);
                            //更新 levelDB IMG_Hash 信息
                            StorageDB_GM('IMG_Hash', pVideoData.img).edit(pVideoData);
                            notifyMe('已更新视频ID：'+StorageDB_GM('IMG_Hash', pVideoData.img).find('videoid'));
                        });
                    }

                    console.table(pVideoData);

                    console.log(ajaxVideoUrl);
                    JaPronX.CheckUrl(ajaxVideoUrl, function(e){
                        console.log('CheckM3U8:', e);

                        switch(e.status) {
                            case 451:
                                $M3U8Btn.text('451');
                                console.log("VTT 检测阶段 451 状态!：", e.finalUrl);
                                notifyMe('451 状态','请求受法律限制，请更换代理服务');
                                break;
                            case 0:
                                console.log(e.status, ' 无响应');
                                $M3U8Btn.text(e.status + ' m3u8 无响应').attr('href', ajaxVideoUrl);
                                break;
                            case 200:
                                $M3U8Btn.text('正在测试 m3u8 地址').attr('href', ajaxVideoUrl).css({'width':'230px'});
                                console.log(VttLanguage)
                                if(VttLanguage) {
                                    if(!ajaxSubType) {
                                        $zmBtn.text('内嵌字幕');
                                        document.title+=(pVideoData.zimu?"【内嵌字幕】":"")
                                    } else {
                                        document.title+="【字幕文件】"
                                        $zmBtn.text(ajaxSubType + ' 字幕').css({'color':'black'}).attr({'download':ajaxVideoID+'.'+ajaxSubType, 'href':ajaxVideoSubUrl});
                                    }
                                } else {
                                    $zmBtn.text('无字幕文件');
                                }
                                VideoDown(ajaxVideoUrl);
                                break;
                            case 404:
                                $M3U8Btn.text('404');
                                console.log('VTT 检测阶段 404：', e.status);
                                break;
                            case 403:
                                $M3U8Btn.text('403');
                                console.log('VTT 检测阶段 403：', e.status);
                                break;
                            default:
                                console.log('VTT 检测阶段 status：', e.status);
                        }
                        console.groupEnd();
                    });

                    console.groupEnd();

                },
                'error' : function(e){
                    console.log('$ error:', e);
                }
            });
        }

        if($('.system-message').length>0) {
            console.log(' ***** VIP视频 *****');

            $('#wait').text('60000')
            $.getScript("/themes/simpleboot3/public/assets2/js/jquery-1.8.3.min.js",function(){
                $.getScript("/static/js/layer/layer.js",function(){
                    console.log('layer loaded');
                    u.layer.tips('layer 加载完毕');
                });
            });
            $("<link>").attr({rel: "stylesheet", type: "text/css", href: "/static/js/layer/skin/default/layer.css?v=3.0.3303"}).appendTo("head");
            u.history.back=function(){return null;} //重写历史记录移除后退功能
            u.setInterval=function(){return null;}     //重写验证码跳转功能
            $('.system-message>h1').html($('<a href="/portal/index/search/sjr/1.html"></a>').text(':)').css('color','red'));
            $('.jump').remove();
            PlayServer='svip2';

            $btnDiv=$('.system-message').append($M3U8Btn.addClass('btnC'), $zmBtn.addClass('btnC'));

            ajaxGetID();
        } else if(/detail\/identification/i.test(location.pathname)) {
            console.log($('.show-box').offset().top);
            //$(document).scrollTop($('#contents-inline').offset().top); //自动滚动到内容区域
            $(document).scrollTop($('.show-box').offset().top-100);

            var HideText=$('#wrap-slider, .wrap-header, #wrap-footer-bottom, .js-ajax-delete, h1, h2, .tx-comment, #works, dl.desc>:not(:nth-child(15)):not(:nth-child(16))');  //干净模式
            $CleanBtn.click(function(){
                if(!localStorage['HideText']) {
                    localStorage['HideText']=true;
                    u.layer.tips('已开启干净模式', '.HideText');
                    HideText.hide();
                } else {
                    u.layer.tips('已关闭干净模式', '.HideText');
                    delete localStorage['HideText'];
                    HideText.show();
                }
            });
            if(localStorage['HideText']) HideText.hide();

            $('.desc>dt:contains(番號)').click(function(){
                GM_openInTab('http://www.javlib.com/cn/vl_searchbyid.php?keyword='+$(this).next().text(),'active')
            });

            $('.desc>dt:contains(番號)').next().click(function(){
                GM_setClipboard(_VideoID);
                u.layer.msg('已复制番号');
            });

            ajaxGetID();
        }

        function VideoDown(VideoUrl){
            console.group('---*** 检查视频链接有效性 ***---');
            JaPronX.CheckUrl(VideoUrl, function(e){//M3U8
                console.log('VideoDown load: ', e.status, VideoUrl, e);
                switch(e.status){
                    case 451:
                        console.log('VideoDown: ','请求受法律限制，请更换代理服务','451 状态');
                        break;
                    case 0:
                        $M3U8Btn.text(e.status + ' m3u8 无响应').attr('href', VideoUrl);
                        break;
                    case 200:
                        console.log('视频地址有效');
                        $M3U8Btn.attr({'href':VideoUrl, 'title':VideoID}).text('M3U8').css({'width':'100px'});
                        $PotBtn.css({'color':'black'}).attr({'href':'potplayer://'+VideoUrl});
                        /*
                        u.layer.tips('M3U8 地址已刷新', '#m3u8', {
                            tips:1,
                            //tipsMore: true,
                            time: 60000
                        });
                        */
                        notifyMe('点击激活下载', {text:VideoID + ' M3U8地址已刷新', renotify:true, tag:VideoID, requireInteraction:false}, function(){
                            document.querySelector('#m3u8').click();
                        });

                        M3U8TimeOut=setTimeout(function(){
                            $M3U8Btn.attr({'href':'javascript:void(0)'}).text('链接已失效，点击刷新').css({'width':'230px'});
                            JaPronX.newM3U8();
                        }, 60*1000);
                        break;
                    case 404:
                        $M3U8Btn.text('404');
                        break;
                    default:
                        console.log('m3u8 ajax error: ', e.status, e);
                        $M3U8Btn.text('获取失败').css({'width':'120px'}).click(function(){
                            JaPronX.newM3U8();
                        });
                        break;
                }
                console.groupEnd();
            });
        }
    }

    function getUrlParam(name, url, option, newVal) {//筛选参数，url 参数为数字时
        var search = url ? url.replace(/^.+\?/,'') : location.search;
        //网址传递的参数提取，如果传入了url参数则使用传入的参数，否则使用当前页面的网址参数
        var reg = new RegExp("(?:^|&)(" + name + ")=([^&]*)(?:&|$)", "i");		//正则筛选参数
        var str = search.replace(/^\?/,'').match(reg);

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

    function StorageDB_GM(collectionName, key) { //collectionName = 对应的 GM_value 表，key = 表中的键名
        let DB;
        if(!GM_DB_Cache) //缓存到脚本临时数据库
            GM_DB_Cache=DB=GM_getValue(collectionName) ? GM_getValue(collectionName) : {"time": new Date().toJSON()};
        else
            DB=GM_DB_Cache;

        if(key && !DB[key]) {
            DB[key]={};
            DB.length++;
        }

        //console.log('StorageDB_GM start', collectionName, key, DB[key]);

        return {
            add : function(name, value) {
                if(!key) {
                    alert('缺乏 key ，无法添加数据');
                    console.error('缺乏 key ，无法添加数据');
                    return DB;
                }
                if(typeof name == 'object') {
                    for(let name_key in name){
                        console.log(name, name_key);
                        DB[key][name_key]=name[name_key];
                    }
                    GM_setValue(collectionName, DB);
                } else {
                    DB[key][name]=value;
                }
                //console.log(collectionName, key, DB, DB[key]);
                //GM_setValue(collectionName, DB);
            },
            del:function(name) {
                if(name) {
                    console.log(DB, DB[name]);
                    delete DB[name];
                    Storage.setItem(collectionName, JSON.stringify(DB));        //回写 localStorage
                } else {
                    //删除整个 localStorage 数据
                    Storage.removeItem(name);
                }
            },
            edit: function(obj){
                if(!key) {
                    console.error('缺乏 key ，无法插入数据');
                    return DB;
                }
                //console.log('StorageDB_GM insert: ', key, obj);
                DB[key]=obj;
                GM_setValue(collectionName, DB);
            },
            insert: function(obj){
                if(!key) {
                    console.error('缺乏 key ，无法插入数据');
                    return DB;
                }
                //console.log('StorageDB_GM insert: ', key, obj);
                DB[key]=obj;
                return DB;
                //GM_setValue(collectionName, DB);
            },
            Updata : function(name, obj, value){
                DB[obj]=DB[obj]||{};
                DB[obj][name]=value;
                Storage.setItem(collectionName, JSON.stringify(DB));        //回写 localStorage
            },
            Query : function(obj,name){
                return DB[obj]?name?(DB[obj][name]?DB[obj][name]:null):DB[obj]:null;
            },
            find : function(name) {
                if(!collectionName) return DB;
                if(DB&&DB[key]) return DB[key][name];
                else return false;
            },
            read : function(name){
                if(key) return $.isEmptyObject(DB[key])?null:DB[key];//如果为空，则返回 null
                return $.isEmptyObject(DB)?null:DB;//如果为空，则返回 null
            },
            write : function(){
                if(new Date()>new Date(DB.time)){
                    DB.time=new Date().toJSON();
                    GM_setValue(collectionName, DB);
                }
                GM_DB_Cache='';
            }
        }
    }

    function msg(title, obj, css){
        //console.log('arguments:', arguments.length)
        let endControl=undefined;

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
                            endControl=arg.end==false?false:true;
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
        console.log('endControl: ', endControl);
        switch(endControl) {
            case false:
                console.log('%c 开启了不结束消息组的模式，请另行关闭消息组。', 'color: red;');
                break;
            case true:
                console.groupEnd();
                break;
            default :
                break;
        }
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
    }
    function getDate(_date, type) {
        var myDate = _date?new Date(_date):new Date();

        var year=myDate.getFullYear();   //获取当前年
        var month=myDate.getMonth()+1;   //获取当前月
        var day=myDate.getDate();     //获取当前日

        switch(type) {
            case '.':return year+type+month+type+day;break;
            case '/': return year+type+month+type+day;break;
            default : return year+'-'+month+'-'+day;
        }
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
})();
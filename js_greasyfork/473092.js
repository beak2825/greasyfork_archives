// ==UserScript==
// @name            网盘自动填写访问码【威力加强版】
// @description	    智能融合网盘密码到网址中，打开网盘链接时不再需要手动复制密码，并自动提交密码，一路畅通无阻。同时记录网盘信息，当你再次打开该分享文件时，不再需要去找提取码，同时可追溯网盘地址的来源。
// @author          极品小猫
// @namespace       https://greasyfork.org/zh-CN/users/3128
// @version         3.24.40.2
//
// @include         http://*
// @include         https://*
//
// @exclude         https://*.12315.cn
// @exclude         http*://*.pcs.baidu.com/*
// @exclude         http*://*.baidupcs.com/*
// @exclude         http*://*:8666/file/*
// @exclude         http*://*.baidu.com/file/*
// @exclude         http*://index.baidu.com/*
//
// @exclude         http*://*.gov/*
// @exclude         http*://*.gov.cn/*
// @exclude         http*://*.taobao.com/*
// @exclude         http*://*.tmall.com/*
// @exclude         http*://*.alimama.com/*
// @exclude         http*://*.jd.com/*
// @exclude         http*://*.zol.com.cn/*
// @exclude         http*://*.ctrip.com/*
// @exclude         http*://*.evernote.com/*
// @exclude         http*://*.yinxiang.com/*
// @exclude         http*://mail.*
// @exclude         http*://ping.*
// @exclude         http*://whois.*
// @exclude         http*://inbox.google.com/*
// @exclude         https://www.12377.cn/*
// @exclude         /^https?://(localhost|10\.|192\.|127\.)/
// @exclude         /https?://www.baidu.com/(?:s|baidu)\?/
// @exclude         http*://www.zhihu.com/question/*/answers/created
// @exclude         https://caiyun.feixin.10086.cn/portal/index.jsp#myfile*
// @require         https://bowercdn.net/c/jquery-2.1.4/dist/jquery.min.js
// @require         https://greasyfork.org/scripts/35940-my-jquery-plugin/code/My%20jQuery%20Plugin.js?version=234478
// @supportURL      https://scriptcat.org/script-show-page/373/issue
// @homepage         https://scriptcat.org/users/46868
// @icon            https://nd-static.bdstatic.com/m-static/wp-brand/favicon.ico

// @connect         agefans.tv
// @grant           unsafeWindow
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @grant           GM_listValues
// @grant           GM_addStyle
// @grant           GM_xmlhttpRequest
// @grant           GM_notification
// @grant           GM_registerMenuCommand
// @grant           GM_info
// @noframes
// @encoding         utf-8
// @run-at          document-idle
// @license          GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/473092/%E7%BD%91%E7%9B%98%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%AE%BF%E9%97%AE%E7%A0%81%E3%80%90%E5%A8%81%E5%8A%9B%E5%8A%A0%E5%BC%BA%E7%89%88%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/473092/%E7%BD%91%E7%9B%98%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%AE%BF%E9%97%AE%E7%A0%81%E3%80%90%E5%A8%81%E5%8A%9B%E5%8A%A0%E5%BC%BA%E7%89%88%E3%80%91.meta.js
// ==/UserScript==

(function(){
    /* globals  $ */
    'use strict';
    let urls=location.href,
        hash=location.hash,
        host=location.hostname.replace(/^(?:www|pan)\.(?!baidu.com|xunlei.com)/i,'').replace(/([^.]+)\.(?=lanzou[a-z]?.com|ctfile.com)/,'').replace(/share\.(115.com)/i,'$1').toLowerCase(),
        hosts=location.hostname.toLowerCase(),
        search=location.search,
        paths=location.pathname.toLowerCase(),
        Control_newTag=true, // 网盘链接添加以新页面打开属性
        u=unsafeWindow,
        msgControl=false; //信息日志关闭开关

    //蓝奏云域名预处理
    host=host.replace(/^\w+\.(?=lanzou)/,'').replace(/(?<=lanzou)[a-z]?/i,'').replace(/^\w+\.(?=lanzn)/,'');
    host=host.replace(/\w+\.(?=ctfile.com)/, '');

    //管理功能开关 & 设置
    let CatPW_Manage_Config, // 管理功能配置，采用 GM_setValue API进行保存，非 localStorage
        StorageSave, // 信息记录功能，localStorage 记录密码开关
        StorageExp, // localStorage 记录密码的有效期(天数)
        UpdataConfig={
            UpdataSave:true, // 再次访问该网盘地址时，更新信息
            UpdataNotify:true, // 更新该网盘地址时，发出桌面通知
            UpdataPlugin:true, // 脚本更新后，发出桌面通知
        };

    if(typeof(GM_getValue('CatPW_Manage'))==='undefined') {
        CatPW_Manage_Config={'StorageSave':true,'UpdataConfig':UpdataConfig,'StorageExp':365};
        GM_setValue('CatPW_Manage', CatPW_Manage_Config);
    } else {
        CatPW_Manage_Config=GM_getValue('CatPW_Manage');
        if(!CatPW_Manage_Config.UpdataConfig) {
            CatPW_Manage_Config.UpdataConfig=UpdataConfig;
            GM_setValue('CatPW_Manage', CatPW_Manage_Config);
        }
    }

    StorageSave=CatPW_Manage_Config.StorageSave;
    StorageExp=CatPW_Manage_Config.StorageExp;
    UpdataConfig=CatPW_Manage_Config.UpdataConfig;

    let Cat = {
        changelog : `
         * v3.24.40.2 [2025.01.29]
         【增加】123pan 新域名 123684.com 的支持
         * v3.24.40.1 [2024.10.12]
         【优化】百度网盘管理按钮挤占订阅按钮问题（挪至分享者用户名后面）
         【优化】空密码时无限提交问题
         * v3.24.40
        【修复】脚本图标
        【增加】蓝奏网盘 lanzo.com 域名支持
        【优化】停止使用 GM.info 接口，以便于兼容Via等其它手机浏览器。
        【优化】脚本更新内容提示逻辑。
        【优化】网盘密码识别策略，增加已融合提取码纠错。
        【增加】新的融合方法，支持【选中提取码】文本点击网盘链接，优先融合选定的提取码。
        【修复】迅雷网盘移动端页面不会自动提交问题。
        【特殊支持】密码融合，异星软件空间（yxssp.com）
        `,
        UpdataPlugin : function(e){
            //插件更新提示
            if(this.changelog!==UpdataConfig.changelog) {
                GM_notification({
                    'title' : '网盘自动填写访问码 - 更新日志',
                    'text' : `更详细的更新信息，请点击通知查看`,
                    'image' : `https://nd-static.bdstatic.com/m-static/wp-brand/favicon.ico`,
                    'timeout' : 60*1000,
                    'onclick' : function(e){
                        alert(`更新日志详细${Cat.changelog}`);
                    }
                });
                CatPW_Manage_Config.UpdataConfig.changelog=this.changelog;
                GM_setValue('CatPW_Manage', CatPW_Manage_Config);
            }
        },
        init : function(){
            this.UpdataPlugin();//更新提示
        }
    };
    Cat.init();

    var site = {
        'pwdRule' : /(?:提取|访问)[码碼]?\s*[:：﹕ ]?\s*([a-z\d]{4})/,			//常规密码
        'codeRule' : /(?:(?:提取|访问|(?<!解压)密[码碼]|艾|Extracted-code)[码碼]?)\s*[:：﹕ ]?\s*([a-z\d]{4})/i,	//其它类型的访问密码
        'codeRuleBorder' : /(?:(?:提取|访问|(?<!解压)密[码碼]|艾|Extracted-code)[码碼]?)\s*[:：﹕ ]?\s*([a-z\d]{4,8})[\)）]/i,	//其它类型的访问密码
        'YunDisk':{
            'pan.baidu.com':{
                exclude : /\/disk\//i,
                CodeParam: 'pwd',
                surl : function(){
                    if(getQueryString('surl')) return getQueryString('surl');
                    else if(yunData.LRURPVSDB) return yunData.LRURPVSDB.replace(/%26%2Fs%2F.+/,'');
                    else return location.pathname.replace('/s/1','').replace(/#.+/,'');
                },
                chk	:	/^[a-z0-9]{4}$/,
                code	:	'.pickpw input, #accessCode, [placeholder="请输入提取码"]',
                btn	:	'.g-button, #submitBtn, #getfileBtn, .m-button-big',
                PreProcess: function() {	//预处理
                    console.group('===== 百度网盘自动填写密码 Begin =====');
                    if(!/mobile/i.test(navigator.userAgent)) {
                        let CatPW_BaiduPan={
                            CatPW_Manage : function(){
                                let CatPW_Manage_Menu_Fn = {
                                    infoFn : function(e){ //信息记录功能
                                        StorageSave=CatPW_Manage_Config.StorageSave=StorageSave?!confirm('你已开启“信息记录功能”，是否需要关闭？'):confirm('你已关闭“信息记录功能”，是否需要开启？');
                                        $(this).text(StorageSave?'已开启信息记录功能':'已关闭信息记录功能');
                                        CatPW_Manage_Menu_Fn.save();
                                        CatPW_BaiduPan.ShowInfo();
                                    },
                                    UpdataConfigFn : {
                                        UpdataSave : function(e){
                                            UpdataConfig.UpdataSave=CatPW_Manage_Config.UpdataConfig.UpdataSave=UpdataConfig.UpdataSave?!confirm('你已开启“信息记录更新功能”，是否需要关闭？'):confirm('你已关闭“信息记录更新功能”，是否需要开启？');
                                            $(this).text(UpdataConfig.UpdataSave?'已开启记录更新功能':'已关闭记录更新功能');
                                            CatPW_Manage_Menu_Fn.save();
                                        },
                                        UpdataNotify : function(e){
                                            UpdataConfig.UpdataNotify=CatPW_Manage_Config.UpdataConfig.UpdataNotify=UpdataConfig.UpdataNotify?!confirm('你已开启“信息记录更新桌面通知功能”，是否需要关闭？'):confirm('你已关闭“信息记录更新桌面通知功能”，是否需要开启？');
                                            $(this).text(UpdataConfig.UpdataNotify?'已开启更新桌面通知':'已关闭更新桌面通知');
                                            CatPW_Manage_Menu_Fn.save();
                                        },
                                        UpdataPlugin : function(e){
                                            UpdataConfig.UpdataPlugin=CatPW_Manage_Config.UpdataConfig.UpdataPlugin=UpdataConfig.UpdataPlugin?!confirm('你已开启“脚本更新桌面通知功能”，是否需要关闭？'):confirm('你已关闭“脚本更新桌面通知功能”，是否需要开启？');
                                            $(this).text(UpdataConfig.UpdataPlugin?'脚本更新桌面通知':'脚本更新不通知');
                                            CatPW_Manage_Menu_Fn.save();
                                        },
                                        MessageUI : function(e){
                                            UpdataConfig.MessageUI=CatPW_Manage_Config.UpdataConfig.MessageUI=UpdataConfig.MessageUI?!confirm('你已开启“网页嵌入式的网盘信息”，是否切换为“顶部浮动式的网盘信息”？'):confirm('你已开启“网页嵌入式的网盘信息”，是否切换为“浮动窗式的网盘信息”？');
                                            $(this).text(UpdataConfig.MessageUI?'切换为浮动式网盘信息':'切换为嵌入式网盘信息');
                                            CatPW_Manage_Menu_Fn.save();
                                            location.reload();
                                        }
                                    },
                                    Exp : function(e){
                                        var _StorageExpTemp;
                                        do{
                                            _StorageExpTemp=prompt("设置信息保存时间（天数）：", _StorageExpTemp||StorageExp)||_StorageExpTemp||StorageExp;
                                            if(!/^\d+$/.test(_StorageExpTemp)) {
                                                alert('所设置的天数不是数字，请重新设置');
                                            }
                                            else break;
                                        } while(!/^\d+$/.test(_StorageExpTemp));
                                        StorageExp=CatPW_Manage_Config.StorageExp=_StorageExpTemp;
                                        $(this).text('信息保存时间：'+_StorageExpTemp+'天');
                                        CatPW_Manage_Menu_Fn.save();
                                    },
                                    CleanInfo : function(e){
                                        var _CleanInfo=confirm("如果所记录的信息并没有及时更新，可通过该功能清除记录。");
                                        if(_CleanInfo) GM_setValue('CatPW', {});
                                    },
                                    save : function(){
                                        GM_setValue('CatPW_Manage', CatPW_Manage_Config);
                                    }
                                };
                                let CatPW_Manage_Main=$('<span style="display:inline;width:150px;text-align:center;">').attr({'class':'g-dropdown-button'});
                                let CatPW_Manage_A=$('<a>').attr({'class':'g-button','href':'javascript:void(0);'});
                                let CatPW_Manage_A_span=$('<span class="g-button-right">');
                                let CatPW_Manage_A_span_span=$('<span class="text">').text('密码填写管理');
                                let CatPW_Manage_Menu=$('<span class="menu" style="width:auto;z-index:41;position:absolute;">');
                                let CatPW_Manage_Menu_infoFn=$('<A class="g-button-menu" href="javascript:void(0);">').text(StorageSave?'已开启信息记录功能':'已关闭信息记录功能').attr({'data-menu-id':'b-menu307'}).click(CatPW_Manage_Menu_Fn.infoFn);
                                let CatPW_Manage_Menu_Exp=$('<A class="g-button-menu" href="javascript:void(0);">').text('信息保存时间：'+StorageExp+'天').attr({'data-menu-id':'b-menu308'}).click(CatPW_Manage_Menu_Fn.Exp);
                                let CatPW_Manage_Menu_CleanInfo=$('<A class="g-button-menu" href="javascript:void(0);">').text('清除缓存记录信息').attr({'data-menu-id':'b-menu309'}).click(CatPW_Manage_Menu_Fn.CleanInfo);
                                let CatPW_Manage_Menu_UpdataSave=$('<A class="g-button-menu" href="javascript:void(0);">').text(UpdataConfig.UpdataSave?'已开启记录更新功能':'已关闭记录更新功能').attr({'data-menu-id':'b-menu310'}).click(CatPW_Manage_Menu_Fn.UpdataConfigFn.UpdataSave);
                                let CatPW_Manage_Menu_UpdataNotify=$('<A class="g-button-menu" href="javascript:void(0);">').text(UpdataConfig.UpdataNotify?'已开启网盘信息通知':'已关闭网盘信息通知').attr({'data-menu-id':'b-menu311'}).click(CatPW_Manage_Menu_Fn.UpdataConfigFn.UpdataNotify);
                                let CatPW_Manage_Menu_UpdataPlugin=$('<A class="g-button-menu" href="javascript:void(0);">').text(UpdataConfig.UpdataPlugin?'已开启脚本更新通知':'已关闭脚本更新通知').attr({'data-menu-id':'b-menu313'}).click(CatPW_Manage_Menu_Fn.UpdataConfigFn.UpdataPlugin);
                                let CatPW_Manage_Menu_MessageUI=$('<A class="g-button-menu" href="javascript:void(0);">').text(UpdataConfig.MessageUI?'切换为浮动式网盘信息':'切换为嵌入式网盘信息').attr({'data-menu-id':'b-menu314'}).click(CatPW_Manage_Menu_Fn.UpdataConfigFn.MessageUI);


                                CatPW_Manage_A.append(CatPW_Manage_A_span);
                                CatPW_Manage_A_span.append(CatPW_Manage_A_span_span);
                                CatPW_Manage_Menu.append(CatPW_Manage_Menu_infoFn, CatPW_Manage_Menu_Exp, CatPW_Manage_Menu_CleanInfo, '<hr>', CatPW_Manage_Menu_UpdataSave, CatPW_Manage_Menu_UpdataNotify, CatPW_Manage_Menu_UpdataPlugin, CatPW_Manage_Menu_MessageUI);

                                //注入到登录信息旁
                                CatPW_Manage_Main.appendTo('.slide-show-user-info, .share-person-inner')//('[node-type="header-apps"]');
                                //注入到下载按钮旁
                                //CatPW_Manage_Main.insertBefore('.x-button-box>.g-button.tools-share-save-hb');

                                CatPW_Manage_Main.append(CatPW_Manage_A).append(CatPW_Manage_Menu).hover(function(){
                                    CatPW_Manage_Main.toggleClass('button-open');
                                });
                                //GM_addStyle('.slide-show-right{width:650px!important;}');
                            },
                            ShowInfo : function(){
                                //显示信息记录
                                var CatPW_Info_Display=$('#CatPW_Info').css('display');
                                if(CatPW_Info_Display) {
                                    if(CatPW_Info_Display=='none') $('#CatPW_Info').css('display','block');
                                    else $('#CatPW_Info').css('display','none');
                                } else if(StorageSave){
                                    //插入信息记录
                                    var yunData=unsafeWindow.yunData, //取得 yunData 数据
                                        CatPW,
                                        CatPW_Format={'date':Dates(),'sCode':'', unPW:'', 'Src':'', 'surl':'', 'Hash':'', "webSrc":'', "webTitle":''};     //初始化信息记录变量
                                    yunData.surl=getQueryString('surl')||location.pathname.replace('/s/1','').replace(/#.+/,'');  //获取当前的分享ID，并添加到 yunData 中
                                    yunData.Src=getQueryString('Src')||location.href.replace(location.search,'');
                                    //初始化 getValue 数据
                                    if(typeof(GM_getValue('CatPW'))==='undefined') {
                                        if(StorageDB('Share_'+yunData.surl).read()) GM_setValue('CatPW', StorageDB('Share_'+yunData.surl).read());
                                        else GM_setValue('CatPW', CatPW_Format);	//初始化
                                    }
                                    var isCatPW=GM_getValue('CatPW').Src.search(yunData.surl)>0; //检查当前网盘地址是否与记录匹配
                                    var isCatPW_DB=StorageDB('Share_'+yunData.surl).read();
                                    CatPW=isCatPW?GM_getValue('CatPW'):isCatPW_DB?isCatPW_DB:CatPW_Format; //取得信息记录
                                    CatPW.Src=urls.replace(hash,'');
                                    CatPW.surl='Share_'+yunData.surl;                                       //获取 分享文件surl
                                    CatPW.unPW=decodeURIComponent(CatPW.unPW);
                                    CatPW.webSrc=decodeURIComponent(CatPW.webSrc);
                                    CatPW.webTitle=decodeURIComponent(CatPW.webTitle);
                                    CatPW.sCode=CatPW.sCode||(CatPW.Hash?CatPW.Hash.replace('#',''):/^#/.test(hash)&&!/^#list\/path=/i.test(hash)?hash.match(/^#([^&]+)&?/)[1]:'');		//获取 提取码
                                    if(!localStorage[CatPW.surl]) { //当不存在记录时，收集信息
                                        msg('不存在记录，插入信息', 'Src:'+CatPW.Src, 'surl:'+yunData.surl, CatPW);
                                        if(CatPW.Src.search(yunData.surl)<0) {//新记录中的网盘地址与当前的分享ID不一致时，更新信息记录变量
                                            CatPW.Src=urls.replace(hash,'');
                                            CatPW.Hash=hash;
                                            CatPW.sCode=CatPW.sCode;
                                            CatPW.unPW=CatPW.webTitle=CatPW.webSrc=''; //当前网址与记录的信息不符时，只保留密码信息
                                        }

                                        CatPW.ShareUK=yunData.SHARE_UK;			                                    //获取 分享用户ID
                                        CatPW.ShareID=yunData.SHARE_ID;		                                      //获取 分享文件ID
                                        StorageDB(CatPW.surl).insert(CatPW);
                                    }

                                    else if(UpdataConfig.UpdataSave && localStorage[CatPW.surl] &&//是否已开启网盘信息记录更新，是否存在缓存
                                            CatPW.Src.search(StorageDB(CatPW.surl).read().surl.replace('Share_',''))>0)//从检测缓存中的分享ID是否与记录中的分享ID匹配
                                    {
                                        var CatPW_StorageDB=StorageDB(CatPW.surl).read();
                                        if(decodeURIComponent(CatPW.webSrc)!==decodeURIComponent(CatPW_StorageDB.webSrc)) {
                                            CatPW_StorageDB.webSrc=decodeURIComponent(CatPW.webSrc);
                                            CatPW_StorageDB.webTitle=decodeURIComponent(CatPW.webTitle);
                                            StorageDB(CatPW.surl).insert(CatPW_StorageDB);
                                            if(UpdataConfig.UpdataNotify) GM_notification({
                                                'text':'网盘地址来源与上一次记录不同，记录已更新',
                                                'title':'网盘信息记录更新通知',
                                                'image':'https://nd-static.bdstatic.com/m-static/wp-brand/favicon.ico',
                                                'timeout': 1.5*1000
                                            });
                                        }
                                    } else {//直接载入记录
                                        msg('载入 locatStorage 记录');
                                        CatPW=StorageDB(CatPW.surl||yunData.SHARE_ID||getQueryString('shareid')).read();
                                    }

                                    msg('分享文件ID：', CatPW.surl, '提取码：', StorageDB(CatPW.surl).find('sCode'));
                                    msg('已收集的信息：', 'conf：', conf, 'localStorage CatPW：', CatPW, 'GM CatPW: ', GM_getValue('CatPW'));


                                    $(conf.btn).on('mouseup', function(e){	//百度网盘访问码提交事件，提交密码时
                                        var $code=$(conf.code).val().trim();
                                        if($code.search(/\*/)>0) return false;
                                        if($code!=='' && !CatPW.sCode){
                                            CatPW.sCode=$code;
                                        }

                                        var tips=$('form[name="accessForm"]~div[style*="display: block"]');
                                        tips.text('')
                                        //提取码提交click事件
                                        if(!localStorage[CatPW.surl]) {
                                            //不存在记录时，添加新纪录
                                            StorageDB(CatPW.surl).insert(CatPW);//插入记录
                                            StorageDB('ShareIDexp').add(CatPW.surl,{'date':Dates(),'id':CatPW.surl,'exp':$.now()+StorageExp*24*60*60*1000});		//记录超时时间
                                        } else if(!StorageDB(CatPW.surl).find('sCode')) {
                                            //不存在提取码信息时，重新获取提取码
                                            StorageDB(CatPW.surl).insert(CatPW);//插入记录
                                            StorageDB('ShareIDexp').add(CatPW.surl,{'date':Dates(),'id':CatPW.surl,'exp':$.now()+StorageExp*24*60*60*1000});		//记录超时时间
                                        } else if($code!==StorageDB(CatPW.surl).find('sCode')&&(tips.text()==='')){
                                            //已记录的提取码与填写的提取码不一致时，更新提取码记录
                                            StorageDB(CatPW.surl).add('sCode', CatPW.sCode);//更新提取码记录
                                            StorageDB('ShareIDexp').add(CatPW.surl,{'date':Dates(),'id':CatPW.surl,'exp':$.now()+StorageExp*24*60*60*1000});		//记录超时时间
                                        }
                                    });

                                    //当存在解压密码时，插入新纪录
                                    if(CatPW.unPW&&!localStorage[CatPW.surl]){
                                        StorageDB(CatPW.surl).insert(CatPW);
                                        StorageDB('ShareIDexp').add(CatPW.surl,{'date':Dates(),'id':CatPW.surl,'exp':$.now()+StorageExp*24*60*60*1000});		//记录超时时间
                                    }

                                    //显示记录的信息
                                    if('Share_'+yunData.surl==CatPW.surl && localStorage[CatPW.surl]){
                                        let baiduPan_API={
                                            //API: require('system-core:context/context.js').instanceForSystem.list.getCurrentList(),
                                            //server_Filename: i => {return baiduPan_API.API[i||0].server_filename;}
                                        }

                                        let CatPW_Data={
                                            //FileName: $('<span>').text('FileName：').append($('<span>').text(baiduPan_API.server_Filename()))
                                        }

                                        var CatPW_Info=$('<DIV>').attr('id','CatPW_Info').text('提取码：'+CatPW.sCode+'　　'+'解压密码：');
                                        //解压密码
                                        var CatPW_Info_unPW=$('<input>').attr({'id':'unPW','title':'点击复制密码，修改内容将被保存'}).css({'margin':'0 10px','width':'150px','text-align':'center'}).val(CatPW.unPW).change(function(){
                                            StorageDB(CatPW.surl).add('unPW',encodeURIComponent(this.value));
                                            CatPW.unPW=encodeURIComponent(this.value);
                                            GM_setValue('CatPW', CatPW);
                                        }).click(function(){
                                            document.execCommand("SelectAll");document.execCommand("copy");
                                        });



                                        //来源页面：
                                        var CatPW_Info_delBtn=$('<button>').text('删除记录').val('删除记录').click(function(){
                                            delete localStorage[CatPW.surl];
                                            StorageDB('ShareIDexp').del(CatPW.surl);
                                            GM_setValue('CatPW', CatPW_Format);
                                            this.disabled=true;
                                        });

                                        var CatPW_Info_WebTitle=$('<span>').attr({'id':'CatPW_webTitle'}).text('网页标题：'+CatPW.webTitle);
                                        var CatPW_Info_WebSrc=$('<A>').attr({'id':'CatPW_webSrc','href':CatPW.webSrc,'target':'_blank'}).text('网盘来源：'+CatPW.webSrc);
                                        GM_addStyle(`
                                        #CatPW_Info{font-size:14px;border:1px solid #06c;padding:5px;display:block;}
                                        #CatPW_Info > span {margin-left:20px;}
                                        button[value="删除记录"][disabled] {background:#aaa;}

                                        `);

                                        CatPW_Info.append(CatPW_Info_unPW, CatPW_Info_delBtn, /*CatPW_Data.FileName,*/ '<br>', CatPW_Info_WebTitle, '<br>', CatPW_Info_WebSrc);
                                        UpdataConfig.MessageUI?CatPW_Info.insertBefore('.module-share-header'):Fn_MessageUI(CatPW_Info);
                                    }

                                    StorageDB('ShareIDexp').deleteExpires();

                                }
                            },
                            init : function(){
                                if(document.querySelector('.verify-input') && !CatPW_Manage_Config?.Tips_BaiduUse) {
                                    let Tips_BaiduUse=$('<div id="Tips_BaiduUse"><span style="color:red">网盘自动填写访问码</span>是一款点击网盘链接时，帮你自动从当前网页匹配网盘密码，并在访问网盘时填写网站上提供的“访问密码”的免费工具。因隐私安全原因，“不支持未知访问码”的网盘链接自动填写，本程序亦不会通过网络途径收集您的任何个人隐私及所访问的网盘内容。所有记录的访问数据均保存在您的本地设备。详细请<a href="https://scriptcat.org/script-show-page/373" target="_blank">阅读脚本使用说明</a>。</div>'),
                                        Tips_BaiduUseClose=$('<button>').text("不再提示").click(()=>{
                                            CatPW_Manage_Config.Tips_BaiduUse=true;
                                            GM_setValue('CatPW_Manage', CatPW_Manage_Config);
                                            Tips_BaiduUse.hide();
                                        });

                                        $('.verify-input').prepend(Tips_BaiduUse.append(Tips_BaiduUseClose));
                                }
                                if(u.currentSekey) {
                                    this.CatPW_Manage();
                                    this.ShowInfo();
                                }
                            }
                        };
                        CatPW_BaiduPan.init();
                    }
                    console.groupEnd();
                },
                preSubmit : function(codebox, cdoebtn, sCode){
                    //百度网盘，手机版页面提交方法
                    if(!document.querySelector("#init-new")) {
                        let CodeInput=$('input', '.extract-content');
                        CodeInput.val(sCode);
                        CodeInput.get(0).dispatchEvent(new InputEvent("input"));
                        setTimeout(function(){
                            $(cdoebtn).click();
                        }, 1000);
                    }
                }
            },
            'eyun.baidu.com': {
                chk:	/^[a-z0-9]{4}$/,
                code:	'.share-access-code',
                btn:	'.g-button-right',
                pwdRule : /(?:提取|访问)[码碼]?\s*[:： ]?\s*([a-z\d]{4,14})/,
                codeRule : /(?:(?:提取|访问|密[码碼]|Extracted-code)[码碼]?)\s*[:： ]?\s*([a-z\d]{4,14})/i,
                PreProcess: function() {
                    if((hash&&!/sharelink|path/i.test(hash))&&!/enterprise/.test(paths)) {
                        location.href=location.href.replace(location.hash,'');
                    }
                    conf.ShareUK=yunData.SHARE_UK||getQueryString('uk');		//获取 分享用户ID
                    conf.ShareID=yunData.SHARE_ID||getQueryString('cid');		//获取 分享文件ID
                    conf.sCode=/^#/.test(hash)?hash.match(/^#(\w+)&?/)[1]:StorageDB(conf.ShareID).find('sCode');		//获取 提取码
                    $(conf.btn).click(function(){
                        if(!localStorage[conf.ShareID]&&conf.sCode) {
                            StorageDB(conf.ShareID).insert({'sCode':conf.sCode});
                            StorageDB('ShareIDexp').add(conf.ShareID,{'id':conf.ShareID,'exp':$.now()+StorageExp*24*60*60*1000});		//记录超时时间
                        }
                    });
                    StorageDB('ShareIDexp').deleteExpires();
                }
            },
            'yunpan.360.cn':{
                chk	:	/^[a-z0-9]{4,8}$/,
                code : '.pwd-input',
                btn : '.submit-btn'
            },
            'lanzou.com':{
                chk	:	/^[a-z0-9]{4,8}$/,
                code : '#pwd',
                btn : '#sub, .passwddiv-btn',
                pwdRule : /(?:提取|访问)[码碼]?\s*[:： ]?\s*([a-z\d]{4,6})/,
                codeRule : /(?:(?:提取|访问|密[码碼]|Extracted-code)[码碼]?)\s*[:： ]?\s*([a-z\d]{4,6})/i,
                IntervalSubmit : true,
                PreProcess : function(){
                    //蓝凑云，手机版页面提交方法
                    console.log('蓝奏云WAP页面提交')
                    let tp=document.querySelector('[href^="/tp/"]');
                    if(tp) {
                        tp.hash=location.hash;
                        tp.target="";
                    }
                },
                preSubmit : function(codebox, cdoebtn, sCode){
                    console.log(`蓝凑云预定义方法提交`)
                    $('.ifr2').contents().find(codebox).val(sCode);
                    $('.ifr2').contents().find(cdoebtn).click();
                },
                HostRule: /lanzou[a-z].com/i
            },
            '115.com': {
                chk	:	/^[a-z0-9]{4,8}$/,
                CodeParam: 'password',
                code : '.form-item input[placeholder="请输入访问码"]',
                btn : '.form-decode>.submit>a[btn="confirm"]',
                IntervalSubmit : true
            },
            'share.weiyun.com': {
                chk: /^[a-z0-9]{6}$/i,
                code: '.input-txt',
                btn: '.btn.btn-l.btn-main',
                pwdRule : /(?:提取|访问)[码碼]?\s*[:： ]?\s*([a-z\d]{4,6})/,
                codeRule : /(?:(?:提取|访问|密[码碼]|Extracted-code)[码碼]?)\s*[:： ]?\s*([a-z\d]{4,6})/i,
                IntervalSubmit : true
            },
            'caiyun.feixin.10086.cn' : {
                chk: /^[a-z0-9]{4}$/i,
                code: '.lookOutLink_tq_input>input[type="text"]',
                btn:  '#linkPassEnter',
                preSubmit : function(codebox, cdoebtn, sCode){
                    setTimeout(function(){
                        $(cdoebtn).click();
                    }, 1000);
                }
            },
            'ctfile.com':{
                code : '#passcode',
                btn : '[onclick="verify_passcode()"]',
                IntervalSubmit : true
            },
            'dufile.com':{
                PreProcess: function(){
                    if(/\/down\//.test(location.pathname)) {
                        var hiddenProperty = 'hidden' in document ? 'hidden' :
                        'webkitHidden' in document ? 'webkitHidden' :
                        'mozHidden' in document ? 'mozHidden' :
                        null;
                        var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
                        var onVisibilityChange = function(){
                            if (!document[hiddenProperty]) {
                                document.title='被发现啦(*´∇｀*) 快来输验证码！';
                            } else {
                                alert('DuFile 快来输验证码！');
                            }
                        }
                        document.addEventListener(visibilityChangeEvent, onVisibilityChange);
                    }
                }
            },
            'fxpan.com':{
                PreProcess:function(){
                    var Key=$('#key').val(); //文件分享ID

                    var CatPW={'date':Dates(),'sCode':'', unPW:'', 'Src':'', 'Hash':'', "webSrc":'', "webTitle":''};
                    var CatPW_Data=(GM_getValue('CatPW')!=('undefined')||GM_getValue('CatPW')!==undefined)?GM_getValue('CatPW'):GM_setValue('CatPW',CatPW);

                    if(CatPW_Data['webSrc'].search(Key)>-1) {
                        var $CatPW_Info=$('<DIV>').attr('id','CatPW_Info');
                        var $CatPW_Info_unPW=$('<div>').text('解压密码：').append($('<input>').attr({'id':'unPW','title':'点击复制密码'}).css({'margin':'0 10px','width':'150px','text-align':'center'}).val(decodeURIComponent(CatPW_Data.unPW)).click(function(){document.execCommand("SelectAll");document.execCommand("copy");}));
                        var $CatPW_Info_title=$('<span>').attr({'id':'CatPW_webTitle'}).text('网页标题：'+decodeURIComponent(CatPW_Data.webTitle));
                        var $CatPW_Info_webSrc=$('<A>').attr({'id':'CatPW_webSrc','href':decodeURIComponent(CatPW_Data.webSrc),'target':'_blank'}).text('网盘来源：'+decodeURIComponent(CatPW_Data.webSrc));
                        $CatPW_Info.append($CatPW_Info_unPW, '<br>', $CatPW_Info_title,'<br>', $CatPW_Info_webSrc).insertBefore('.file_item.file_desc');
                        $('.ysbtn').click(function(){
                            StorageDB(Key).insert(CatPW_Data);
                            StorageDB().insert(CatPW_Data);
                        });
                    }
                    GM_addStyle('#CatPW_Info{font-size:14px;border:1px solid #06c;padding:5px;display:block;}');
                }
            },
            'cloud.189.cn':{
                chk: /^[a-z0-9]{4}$/i,
                code: '#code_txt',
                btn:  '.btn.btn-primary, .button',
                IntervalSubmit : true
            },
            'h5.cloud.189.cn':{
                code: '.access-code-input',
                btn:  '.button',
                sCode: 'CacheCode',
                IntervalSubmit : true
            },
            'own-cloud.cn':{
                chk: /^[a-z0-9]{4,6}$/i,
                pwdRule : /(?:提取|访问)[码碼]?\s*[:： ]?\s*([a-z\d]{4,6})/,
                codeRule : /(?:(?:提取|访问|密[码碼]|Extracted-code)[码碼]?)\s*[:： ]?\s*([a-z\d]{4,6})/i,
                code:'#inputPassword',
                btn:'#submit_pwd'
            },
            'pan.xunlei.com': {
                chk: /^[a-z0-9]{4}$/i,
                code : '[class="td-input__inner"]',
                btn : '#__nuxt .td-button',
                IntervalSubmit : true
            },
            'aliyundrive.com' : {
                chk: /^[a-z0-9]{4}$/i,
                code : '.ant-input:not(.ant-input-borderless)',
                btn : '.button--fep7l',
                IntervalSubmit: true,
            },
            'jianguoyun.com': {chk: /^\w{4,8}$/i, code : '#access-pwd', btn : '.action-button.ok-button'},
            '123pan.com': {
                chk: /^\w{4,8}$/i,
                code : '.ant-input',
                btn : '.ant-input~button, .ca-fot>button',
                //IntervalSubmit: true, 采用ajax模拟请求方式访问
                preSubmit : function(codebox, cdoebtn, sCode){
                    let shareKey=location.pathname.replace('/s/', '').replace(/\.html$/i,''), SharePwd=sCode;
                    localStorage['shareKey']=`"${shareKey}"`;
                    localStorage['SharePwd']=`"${sCode}"`;
                    //$.cookie('shareKey', shareKey);
                    //$.cookie('SharePwd', SharePwd);
                    //模拟发送获取文件列表请求，以确认是否登录成功
                    let post_data=$.param({Limit: 100, next: 0, shareKey: shareKey, SharePwd: sCode, orderBy: 'share_id', orderDirection: 'desc',ParentFileId:0, Page:1});
                    $.ajax({
                        url: "/api/share/get",
                        type: "get",
                        data : post_data,
                        success: function (result) {
                            if(result.message && result.message=='ok') {
                                location.reload();
                            }
                        }
                    }).then(function(result){
                        //请求成功
                    });
                }
            },
            'dubox.com': {chk: /^\w{4,8}$/i, code : '.pwd-box', btn : '.pwd-submit-btn', pwdRule : /Password\s*[:： ]?\s*([a-z\d]{4,6})/i, IntervalSubmit: true},
            'terabox.com': {chk: /^\w{4,8}$/i, code : '.pwd-input', btn : '.pwd-submit-btn', pwdRule : /Password\s*[:： ]?\s*([a-z\d]{4,6})/i, IntervalSubmit: true},
            'bhpan.buaa.edu.cn':{chk: /^\w{4,8}$/i, code : '.password-input', btn : '.button'},
            'disk.simiyun.cn':{
                chk: /^\w{4,8}$/i, CodeParam: 'pwd', code : '.pwd-box', btn : '.pwd-submit-btn', pwdRule : /Password\s*[:： ]?\s*([a-z\d]{4,6})/i, IntervalSubmit: true,
                PreProcess(codebox, cdoebtn, sCode){
                    console.log(codebox, codebtn, sCode);
                    alert('y')
                }, preSubmit(codebox, cdoebtn, sCode){
                    alert('y2');
                }
            },
        },
        //跳转链预处理
        'JumpUrl' : {
            'zhihu.com' :  {
                href: $('A[href*="//link.zhihu.com/?target="]'),
                url:/.*\/\/link\.zhihu\.com\/\?target=/
            },
            'zhuanlan.zhihu.com' :  {
                href: $('A[href*="//link.zhihu.com/?target="]'),
                url:/.*\/\/link\.zhihu\.com\/\?target=/
            },
            'sijihuisuo.club': {
                href: $('.down-tip A[href^="https://www.sijihuisuo.club/go/?url="]'),
                url: 'https://www.sijihuisuo.club/go/?url='
            },
            'nyavo.com':{
                href: $('.content a'),
                url: 'https://www.nyavo.com/go?url='
            },
            'pixiv.net':{href:$('a'), url:'/jump.php?'}
        },
        //密码融合需要特殊支持的网站
        'Support' : {
            'zhidao.baidu.com': {
                path :/question\/\d+.html/,
                callback : function(){
                    let baiduyun=$('baiduyun');
                    baiduyun.each(function(i, e){
                        let bdy=$('<a>').attr({'href':$(this).attr('data_sharelink')+'#'+$(this).attr('data_code')}).text($(this).attr('data_title') + "(" +$(this).attr('data_size') + ")");
                        let filelogo=$('<img>').attr({'src': $(this).attr('data_filelogo'), 'alt': '网盘自动填写访问码（密码融合）', 'title': '网盘自动填写访问码（密码融合）'}).css({'display':'inline-block','width':'32px'});
                        $(this).after("<br>", "密码融合：", bdy, filelogo);
                    });
                }
            },
            '115.com': {
                path: /home\/detail_view/i,
                callback: function(){
                    //console.log('115 特殊支持');
                }
            },
            'agefans.tv':{
                path: /detail/i,
                callback: function(){
                    $('.res_links_a').each(function(){
                        var res_links_a = this;
                        GM_xmlhttpRequest({
                            method: "get",
                            url: res_links_a.href,
                            onload: function (result) {
                                //console.log('load:', res_links_a.href, result.finalUrl, result);
                                //console.log(res_links_a);
                                $(res_links_a).attr({'href': result.finalUrl});
                            }
                        });
                    });
                }
            },
            'yunpanjingling.com':{
                path : /search/i,
                callback:function(){
                    $('.item').each(function(){
                        var name=$(this).find('.name').text().trim();
                        var code=$(this).find('.code').text()||'';
                        var href=$(this).find('.name').find('a');
                        var referrer=$(this).find('.referrer').find('a');
                        referrer.attr('href',decodeURIComponent(getQueryString('url',referrer.attr('href'))));
                        href.attr('href',decodeURIComponent(getQueryString('url',href.attr('href'))));
                        if(code) href.attr('href',href.attr('href')+'#'+code);
                        href.click(function(){
                            var CatPW_Data={'date':Dates(),'sCode':code, unPW:'', 'Src':href.attr('href'), 'Hash':'#'+code, "webSrc":referrer.attr('href'), "webTitle":encodeURIComponent(name)};
                            sessionStorage['CatPW_Data']=JSON.stringify(CatPW_Data);
                        })
                    });
                }
            },
            'jiluhome.cn' : {
                path:/./i,
                callback:function(){
                    var PostID=$.getUrlParam('p', $('link[rel="shortlink"]').attr('href'));
                    //获取网盘地址
                    DownAjax('http://www.jiluhome.cn/wp-content/plugins/erphpdown/download.php?postid='+PostID, '#erphpdown-download', function(e){
                        $(e).find('a[href*="download.php"]').each(function(){
                            var target=this;
                            $.ajax({
                                "url":'http://www.jiluhome.cn/wp-content/plugins/erphpdown/download.php?postid='+PostID+"&url=&key=1",
                                success:function(d){
                                    target.href=d.match(/window.location=\'([^']+?)\'/i)[1];
                                }
                            });
                        });
                        $('#erphpdown>center').append(e);//.replaceWith(e);
                    });
                }
            },
            'dakashangche.com':{
                path:/\/sj\/\d/,
                callback:function(){
                    //console.log('特殊支持');
                    $('.down-tip>a[href*="du.acgget.com"]').each(function(){
                        DownAjax(this.href,'.panel-body',function(e){
                            $(e).appendTo($('#paydown'));
                        });
                    });
                }
            },
            'appinn.com':{
                path:/\/[^\/]+\//i,
                callback:function(){
                    //console.log('小众软件特殊支持');
                    new PreHandle.VM();
                }
            },
            'meta.appinn.com':{
                path:/\/t\/[^/]+\//i,
                callback:function(){
                    new PreHandle.VM();
                    $('A[href*="pan.baidu.com"],A[href*="eyun.baidu.com"]').each(function(){
                        $(this).data({'url':this.href}).click(function(e){
                            location.href=$(this).data('url');
                        });
                    });
                }
            },
            'madsck.com':{
                path: /\/resource\/\d+/,
                callback:function(){
                    var ID=$('.btn-download').data('id');
                    $.ajax({
                        "url":"http://www.madsck.com/ajax/login/download-link?id="+ID,
                        method: "GET",
                        dataType: "json",
                        success:function(e){
                            var res=e.resource;
                            $('.btn-download').css('display','none');
                            $('<a>').attr({'href':res.resource_link+'#'+res.fetch_code,'target':'_blank','class':'btn-download'}).css({'line-height':'60px','text-align':'center','font-size':'24px'}).text('下载').insertBefore('.btn-download');
                        }
                    });
                }
            },
            'idanmu.com': {
                path : /storage\-download/i,
                callback : function(){
                    $('.input-group').each(function(){
                        $(this).text($(this).text()+$(this).find('input').val());
                    });
                }
            },
            'qiuquan.cc':{
                path:/./,
                callback : function(){
                    $('#down>a[href*="pan.baidu.com"]').each(function(){
                        if(!this.hash) {
                            this.hash=$(this).text().match(/[\(（](\w+)[）\)]/i)[1];
                        }
                    });
                }
            },
            'acg44.com':{
                //search:['page_id','p'],
                path:/download/i,
                callback : function(){
                    site['codeRule']=/(?:(?:提取|访问|密[码碼])[码碼]?)\s*[:： ]?\s*([a-z\d]{4}|[^$]+)/i;
                    addMutationObserver('#download-container',function(e){
                        e.some(function(a){
                            for(var i in a.addedNodes){
                                var b=a.addedNodes[i];
                                if(b.className=='animated fadeIn') {
                                    var VerCode=$('[id^="downloadPwd"]').val();
                                    var unZipPW=encodeURIComponent($('[id^="extractPwd"]').val());
                                    var DownUrl=$('#download-container a.btn').attr('href');
                                    if(/pan.baidu.com\/share/i.test(DownUrl)){
                                        $('#download-container a.btn').attr('href',DownUrl+'&unPW='+unZipPW+'&Src='+encodeURIComponent(urls));
                                    } else {
                                        $('#download-container a.btn').attr('href',DownUrl+'#'+VerCode+'&unPW='+unZipPW+'&Src='+encodeURIComponent(urls));
                                    }
                                }
                            }
                        });
                    });
                }
            },
            'reimu.net': {
                path: /archives/i,
                callback: function(){
                    site['codeRule']=/(?:(?:提取|访问|密[码碼])[码碼]?)\s*[:： ]?\s*([a-z\d]{4}|8酱)/i;
                }
            },
            'ccava.net': {
                path: /post/i,
                JumpHref: 'a[href*="/?url="]',
                callback: function(){
                    site['codeRule']=/(?:(?:提取|访问|密[码碼])[码碼]?)\s*[:： ]?\s*([a-z\d]{4,8}|ccava)/i;
                }
            },
            //189天翼云盘支持
            'mebook.cc':{
                path: /download.php/i,
                callback:function(){
                    $('a').click(function(){
                        if(this.hostname=='cloud.189.cn') site['codeRule']=/天翼云盘密码\s*[:： ]?\s*([a-z\d]{4,8})/i;
                        else site['codeRule']=/百度网盘密码\s*[:： ]?\s*([a-z\d]{4,8})/i;
                    });
                }
            },
            'kudm.net':{ //天使动漫
                path:/./,
                callback:function(){
                    $('body').on('click','a',function(){
                        if(this.hostname=='pan.baidu.com') this.hash=$(this).text().replace(/.+(?:[集版]|无修)(\w{4,8})$/,'$1');
                    });
                }
            },
            'mikuclub.org':{
                path:/\d+/,
                callback:function(){
                    $('.passw').each(function(){
                        var dl=$(this).parent().next().find('.dl');
                        dl[0].hash=this.value;
                    });
                }
            },
            //特殊支持——跳转链处理
            '423down.com': {path: /\/\d+\.html/, JumpHref: 'a[href*="/go.php?"]',},
            'dayanzai.me': {path: /\/[^.]+\.html/, JumpHref: '.intro-box a',},

            //特殊支持——异类访问码融合
            //'th-sjy.com':{path:/\/$/, pwdRule:/(?:(?:提取|访问|(?<!解压)密[码碼]|艾|Extracted-code)[码碼]?)\s*[:：﹕ ]?\s*([a-z\d]{4,6})/i},//城通网盘6位访问密码，访问码有边界在括号内，使用 codeRuleBorder 规则
            'meijumi.net':{path:/\/\d+\.html/, pwdRule: /(\w{4,8})/},
            'jpsub.com':{path:/\/forum.php|\/thread-\d+/, pwdRule: /(\w{4,8})/, pwdContainer: 'copy_open brs', Fusion: 'bbs'},


            //特殊支持——文本框访问码融合
            'mikuclub.org':{path:/\d+/, input_password: '.password1', input_unzip: '.password_unzip1'},
            'acgjc.com':{path:/storage-download/, input_password: '[id^="theme_custom_storage-"][id$="-download-pwd"]', input_unzip: '[id^="theme_custom_storage-"][id$="-extract-pwd"]'},

            //特殊支持——下载页面加载
            'sxpdf.com':{path:/\/\d+\.html|\/down.php/,callback:()=>{$('.xz.down').load($('.down>a').attr('href')+' .down-list-box, .down-pass>p');$('a[onclick="copyUrl2()"]').removeAttr('onclick');}},
            'shoucangzhe.top': {
                path:/\d+.html|download.php/,
                callback: ()=>{
                    let PostID=$.getUrlParam('p', $('link[rel="shortlink"]').attr('href'))||$.getUrlParam('postid');
                    if(document.querySelector('.erphpdown-box')) {
                        $('.erphpdown-box').append($('<div>').load(`/wp-content/plugins/erphpdown/download.php?postid=${PostID}&iframe=1 #erphpdown-download`, ()=>{
                            GM_addStyle('#erphpdown-download {margin-top:30px!important;padding:20px;} #erphpdown-download .link {display: inline-block;background: #ff5f33;padding: 3px 12px;color: #fff;border-radius: 20px;font-size: 13px;margin: 0 10px}')
                            $.get(`/wp-content/plugins/erphpdown/download.php?postid=${PostID}&key=1&index=`, e=>{
                                $('#erphpdown-download a[href*="download.php"]').css({'background': '#33a1ff'}).attr('href', e.match(/https?:\/\/[^']+/).toString());
                            });
                        }));
                    } else if(document.querySelector('.erphpdown-down-btn')) {
                        $.get(`/wp-content/plugins/erphpdown/download.php?postid=${PostID}&key=1&index=`, e=>{
                            $('.erphpdown-msg a[href*="download.php"]').css({'background': '#33a1ff'}).attr('href', e.match(/https?:\/\/[^']+/).toString());
                        });
                    }
                }
            },
            'hifini.com': {path: /thread-\d+.htm/,callback: ()=>{$('.alert.alert-success>span').map((i,e)=>{if($(e).css('display')==='none') $(e).remove()});}}, //处理提取码中隐藏的干扰码
            'ygobbs.com': {path: /\/t\/[^/]+\/\d+/, callback: function(){new PreHandle.VM();}},
            'yxssp.com':{
                path: /\/\d+.html/,
                callback: ()=>{
                    $('.downlink').load($('.downbtn').attr('href')+" .mr-auto>.list-group-flush a", (r,s,x)=>{
                        $(`.downlink a`).addClass('downbtn')
                        let lanzou=$('.downlink a[href*="lanz"]'), lanzouPW=r.match(/蓝奏云盘密码：(\w+)/)[1];
                        lanzou.attr('href', lanzou.attr('href')+'#'+lanzouPW)

                    })
                }
            }
        }
    };



    /***** 镜像域名映射 Begin *****/
    var HostToList={}, HostToListArr={
        YunDisk : {
            '123pan.com':['123684.com'],
            'ctfile.com':['089u.com','089m.com','down.sxpdf.com'],
            'lanzou.com': ['lanzou[a-z].com','lanzn.com','woozooo.com'],
            'disk.simiyun.cn':['disk.bestcloud.cn']
        },
        Support : {
            's-dm.com':['fodm.net'],
            'reimu.net':['blog.reimu.net'],
            'idanmu.com':['idanmu.co','idanmu.ch','idanmu.at'],
            'shoucangzhe.top':['shoucangzhe8.top','scz666.top','scz888.top'],
            'meijumi.net':['meijumi.top'],
        }
    },
        HostExpJSON={
        }

    for(let key in HostToListArr){
        HostToList[key]={};
        for(let key_i in HostToListArr[key]) {
            let key_host=HostToListArr[key][key_i];
            for(let key_j=0;key_j<key_host.length;key_j++){
                HostToList[key][key_host[key_j]]=key_i;
            }
        }
    }

    //扩展镜像域名到主 YunDisk 列表
    for(let key in HostToList['YunDisk']) {
        site['YunDisk'][key]=site['YunDisk'][HostToList['YunDisk'][key]];
    }

    //站点存在则加入到 Site 中
    if(HostToList['YunDisk'][host]) site['YunDisk'][host]=site['YunDisk'][HostToList['YunDisk'][host]];
    else if(HostToList['Support'][host]) site['Support'][host]=site['Support'][HostToList['Support'][host]];
    else if(/yunpan.360.cn/.test(host)) host='yunpan.360.cn';  //如果是360云盘，重设主域名Host
    //else if(/lanzou[a-z].com/i.test(host)) host='lanzou.com';  //如果是蓝凑网盘，重设主域名Host
    //console.warn('CheckHostToList: ', host, HostToList['Support'][host], site['Support'][HostToList['Support'][host]]);
    /***** 镜像域名映射 End *****/


    let conf = site['YunDisk'][host];											//设置主域名
    const SupportHost=site['Support'][host]; //特别支持网站

    /* -----===== 生成正则，校验匹配的网盘 Start =====----- */
    let HostArr = [];									//生成域名数组
    for(let i in site['YunDisk']) HostArr.push(i);					//插入域名对象数组
    for(let i in HostToList['YunDisk']) HostArr.push(i);					//插入域名对象数组
    let HostExp = new RegExp(HostArr.join("|"),'i');	//生成支持网盘的校验正则，进行密码融合
    for(let i in HostToList['YunDisk']) HostArr.push(i);
    let HostSelector = HostArr.map(HostI => `[href*="${HostI}"]`);
    /* -----===== 生成正则，校验匹配的网盘 End =====----- */

    msg(`网盘域名正则表：${HostExp}`);

    /* -----===== 检查是否需要处理跳转链 Start =====----- */
    //console.log(site.JumpUrl[host]);
    if(site['JumpUrl'][host]){
        msg(`跳转链处理：${site['JumpUrl'][host]['href']}`);
        if(site['JumpUrl'][host]['Observer']) {
            console.warn('跳转链处理 —— 监听页面变化')
            addMutationObserver(site['JumpUrl'][host]['Observer']['watch'], site['JumpUrl'][host]['Observer']['fn']);
        } else {
            site['JumpUrl'][host]['href'].each(function(){
                //console.log(site['JumpUrl'][host]['rep']);
                $(this).attr({'href':decodeURIComponent($(this).attr('href').replace(site['JumpUrl'][host]['url'],'')),'target':'_blank'});
            });
        }
    }
    /* -----===== 检查是否需要处理跳转链 End =====----- */
    //console.warn('checkSite: ', site, 'YunDisk:', site['YunDisk'], site['YunDisk'][host], 'Support: ', site['Support'], site['YunDisk'][host]);
    //console.warn('checkHost: ', host, conf, 'HostToList: ', HostToList);

    /* -----===== 检查是否为网盘页面 Start =====----- */
    msg({
        host: host,
        conf: conf,
        siteList: site['YunDisk'],
        supportHostList: SupportHost,
        supportHost:SupportHost && SupportHost['path'].test(paths),
    })
    //网盘页面填密码登录
    if(!(SupportHost && SupportHost['path'].test(paths)) && conf && (!conf.exclude || !conf.exclude.test(location.pathname))){
        //地址栏含（提取码：）处理为 #
        if(/(%E5%AF%86%E7%A0%81|%E6%8F%90%E5%8F%96%E7%A0%81)/i.test(location.search)) {
            let newBaiDuPanUrl=location.href.replace(/(?:%20)?(?:%EF%BC%88)?(?:(?:%E8%AE%BF%E9%97%AE)?%E5%AF%86%E7%A0%81|%E6%8F%90%E5%8F%96%E7%A0%81)(?:%EF%BC%9A|:)?(?:%20)?(\w+)(?:%20)?(?:%EF%BC%89)?/i, '#$1'); // 空格+括号+（密码|提取码）+冒号+空格+反括号
            if(/\#\w{4,8}/.test(newBaiDuPanUrl)) location.href=newBaiDuPanUrl;
        }

        // 抓取提取码
        if(conf.PreProcess) conf.PreProcess();		//内容预处理
        let StorageCode = conf.surl ? StorageDB('Share_'+conf.surl()).find('sCode') : null,             //从缓存中读取提取码
            HashCode = /^#/.test(hash) && !/\//i.test(hash) ? hash.match(/^#([^&]+)&?/)[1] : '',     //从Hash中读取提取码
            CodeParam = conf.CodeParam ? $.getUrlParam(conf.CodeParam) : '',                      //从地址参数中读取提取码（115网盘支持）
            ASCII_Param_Code = /(%E5%AF%86%E7%A0%81|%E6%8F%90%E5%8F%96%E7%A0%81)/i.test(location.search) ? location.search.match(/(?:%E8%AE%BF%E9%97%AE%E5%AF%86%E7%A0%81|%E6%8F%90%E5%8F%96%E7%A0%81)(?:%EF%BC%9A|:)?(?:%20)?(\w+)/i)[1] : '',
            CacheCode = GM_getValue('CatPW').Hash.replace('#','');

        let sCode = CodeParam ? CodeParam : (conf.sCode && conf.sCode=='CacheCode') ? CacheCode : (((StorageCode&&StorageCode==HashCode)||(HashCode=='')) ? StorageCode : HashCode)||ASCII_Param_Code;
        //顺序：CodeParam、conf.sCode=CacheCode、StorageCode=HashCode、HashCode、ASCII_Param_Code

        // 调试用，检查是否为合法格式

        if (!sCode) msg('没有 Key 或格式不对');
        else msg('抓取到的提取码: ', sCode);
        msg('code: ', $(conf.code), 'btn: ', $(conf.btn))

        if(conf.IntervalSubmit) { //延时提交，访问码框动态加载，需检测访问码框后才触发提交操作
            let IntervalSubmit_Step=0, t=setInterval(function() {
                msg('间隔提交方式，访问码：', sCode, $(conf.code).val());
                IntervalSubmit_Step++;
                if($(conf.btn).length>0 && sCode) {

                    let CodeInput = document.querySelector(conf.code);

                    if(CodeInput._valueTracker) { //兼容 u.React 方法
                        let PWD_lastValue=CodeInput.value;
                        CodeInput.value=sCode;
                        CodeInput._valueTracker.setValue(PWD_lastValue);
                    } else
                        $(conf.code).val(sCode);

                    if($(conf.code).val()!=='') {
                        if(typeof(InputEvent)!=='undefined') {
                            //使用 InputEvent 方法，主流浏览器兼容
                            CodeInput.dispatchEvent(new InputEvent("input", {bubbles: true})); //模拟事件
                        } else if(KeyboardEvent) {
                            //使用 KeyboardEvent 方法，ES6以下的浏览器方法
                            $(conf.code).get(0).dispatchEvent(new KeyboardEvent("input", {bubbles: true}));
                        }
                        clearInterval(t);
                        //$(conf.btn).click();

                        $(conf.btn).get(0).dispatchEvent(new MouseEvent("click"));
                        //new MouseEvent("click", {bubbles: true,cancelable: true,view: window});

                        if(conf.preSubmit) conf.preSubmit (conf.code, conf.btn, sCode); //特殊提交方式
                    }
                } else if(!sCode) clearInterval(t);
                else if(IntervalSubmit_Step>10) clearInterval(t); //限制延时提交尝试次数
            }, 1000);
        }
        else if($(conf.btn).length>0) { //存在提交按钮时才触发填写操作
            // 加个小延时
            setTimeout (function(){
                // 键入提取码并单击「提交」按钮，报错不用理。
                var codeBox = $(conf.code),
                    btnOk = $(conf.btn);
                msg('提交访问：',codeBox, btnOk);
                if (conf.preSubmit) { //特殊提交方式
                    msg('preSubmit 特殊提交方式');
                    codeBox.val(sCode);		//填写验证码
                    btnOk.click();            //先尝试常规提交
                    conf.preSubmit (conf.code, conf.btn, sCode); //最后尝试预处理方案，可能需要页面 ready 才能生效
                }
                else if(codeBox.length>0) {		//存在密码框时才进行密码提交操作
                    msg('正常提交')
                    codeBox.val(sCode);		//填写验证码
                    if(codeBox.val()) btnOk.click();
                }
            }, 10);
        }

        /* -----===== 检查是否为网盘页面 End =====----- */
    } else {
        //密码融合 特别支持的网站
        if(SupportHost&&(SupportHost['path']?SupportHost['path'].test(paths):getQueryString(SupportHost['search']))) {
            if(SupportHost.input_password) $(SupportHost.input_password).text($(SupportHost.input_password).val()); //转化 input 提取码内容，添加文本
            if(SupportHost.input_unzip) {
                $(SupportHost.input_unzip).text($(SupportHost.input_unzip).val()); //转化 Input 解压密码内容，添加文本
                SupportHost.unzip=$(SupportHost.input_unzip).val();
            }
            if(SupportHost.JumpHref) { //用于处理被加密的跳转链
                $(SupportHost.JumpHref).each(function(){
                    let txt=$(this).text().trim();
                    //let JumpHrefSearch=new URLSearchParams(this.search);
                    //如果目标链接的“文本”为超链接
                    if(/^https?:\/\/[^/]+\/.+/i.test(txt)) {//(baidu|lanzou.?|pcloud|189)
                        $(this).attr('href', txt);
                    } else if(/点击下载/i.test(txt)){ //把纯文本替换为链接
                        $(this).text(this.href);
                    }
                });
            }
            if(SupportHost.pwdRule) site.pwdRule=SupportHost.pwdRule;
            if(SupportHost.AccessPW) {
                switch(SupportHost.AccessPW) {
                    case 'nextSibling':
                        $(HostSelector).each((i,x) => {
                            //console.log(this, x);
                        });
                }
            }
            if(SupportHost.callback) SupportHost.callback();
        }

        let PreHandle={	//内容预处理
            Text : function(text){	//预处理含解码密码的文本
                text=text?typeof(text)=="string"?text.trim():text.textContent.trim():null;
                text=text?text.replace('本帖隐藏的内容',''):null;  //文本内容预处理，提高DZ论坛的匹配率
                text=text?text.replace(/([\[【]?解[压壓]|[压壓][缩縮])密[码碼][\]】]?\s*[:： ]?(?:&nbsp;?)\s*([a-z\d]{4}|[^\n]+)/ig,''):null;
                return text;
            },
            Code : function(obj){	//密码有效性校验
                let text=this.Text(obj);
                if(!text) return;
                /**
                 * PreHandle.Code
                 * @params {string} pwdRule 提取码|访问码
                 * @params {string} codeRuleBorder 带边界的其它类型访问码
                 * @params {string} codeRule 无边界的其它类型访问码
                 * @description 依上述顺序匹配访问码关键字
                 =====*/
                let pw=site['pwdRule'] && site['pwdRule'].test(text) ? text.match(site['pwdRule'])[1] : site['codeRuleBorder']&&site['codeRuleBorder'].test(text) ? text.match(site['codeRuleBorder'])[1] : site['codeRule']&&site['codeRule'].test(text) ? text.match(site['codeRule'])[1]:null;
                msg('尝试获取提取码：', text, site['pwdRule'], site['codeRule']);
                return pw;
            },
            coercive : (target, pass)=>target.href+=`#${pass}`,
            Fusion : function(target, obj){ //融合密码
                let sCode = this.Code(obj);
                msg({
                    targetHash: target.hash,
                    sCode : sCode
                })
                if(!target.hash) {
                    target.href+=`#${sCode}`;
                }
            },
            VM : function(){	//暴力匹配
                let Link=$('A[href*="pan.baidu.com"],A[href*="eyun.baidu.com"]');
                for(i=0;i<Link.length;i++){
                    let LinkParent=$(Link[i]).parent();
                    let LinkParentHtml=LinkParent.html();
                    if(PreHandle.Code(LinkParentHtml)) Link[i].href+='#'+PreHandle.Code(LinkParentHtml);
                }
            },
            PassWord : function(CatPW_Data){
                if(StorageSave) {
                    if(SupportHost && SupportHost.unzip) { //如果存在特殊支持网站，内置解压密码文本框，则使用特殊支持网站的规则
                        msg('特殊网站“解压密码”规则：'+SupportHost.input_unzip, '解压密码提取：'+SupportHost.unzip);
                        CatPW_Data.unPW=encodeURIComponent(SupportHost.unzip);
                    } else { //否则遍历网站提取解压密码

                        let unPWArr=[
                            /[^\w]password(?!=")?([^\n]+)/igm, //passwordd 开头的文本
                            /解压[:： ]?(\w+)/gm,
                            /【解[压壓]密[码碼]】\s*[:： ]?\s*(\w+)/igm,
                            /【解[压壓]密[码碼]】\s*[:： ]?\s*([^\r\n]+)/igm,
                            /\[解[压壓]密[码碼]\]\s*[:： ]?\s*([a-z\d\.:/@]+)/igm,		//http://www.itokoo.com/
                            /(?:解[压壓]密?[码碼])\s*[:： ]?\s*([a-z\d\.:/@]+)(?!-)\b/igm,
                            /(?:解[压壓]密?[码碼])(?:都?是|为)\s*[:： ]?\s*([\w\.:/@]+)[^$\r\n]/igm,
                            /(?:解[压壓]密?[码碼])(?:都?是|为)\s*[:： ]?\s*([^\w]+)[^$\r\n]/igm, //中文类
                            /【?压缩密码】?\s*[:： ]?\s*([^\n]+)/igm,
                            /【?[資资]源密[码碼]】?：(\w+)/   //来源：http://www.abcmm.co
                        ];
                        let bodyText=document.body.innerText, bodyHtml=document.body.outerHTML,
                            BodyHtml_Processing=document.body.outerHTML.replace(/\b[-\w]+=['"]?[^'"]+['"]?/ig,'');
                        for(let i=0;i<unPWArr.length;i++) {
                            let unPWTemp=unPWArr[i].exec(bodyText)||unPWArr[i].exec(BodyHtml_Processing)||unPWArr[i].exec(document.body.textContent);
                            if(unPWTemp) {
                                msg(i, '规则：'+unPWArr[i], '解压密码提取：'+encodeURIComponent(unPWTemp[1]), '所有结果：'+unPWTemp);
                                CatPW_Data.unPW=encodeURIComponent(unPWTemp[1]);
                                break;
                            }
                        }
                    }
                    if(sessionStorage['CatPW_Data']) GM_setValue('CatPW', JSON.parse(sessionStorage['CatPW_Data']));
                    else GM_setValue('CatPW', CatPW_Data);
                    msg('GM_getValue', GM_getValue('CatPW'));
                }
            },
            EachSibling : function($parent, $target, pi, $sibling, $i, $max){
                console.group('=== 同级元素遍历模式 第 ' + pi + ' 次 ===');
                var dz_i=$i||1, dz_maxParent = $max||5, dz_sibling=5||$sibling, dz_parent=$parent;
                while(dz_i<=dz_maxParent){
                    console.group('=== Part2. 同级元素遍历模式 第 ' + dz_i + ' 个父元素 ===');
                    msg('%c === 同级元素遍历模式 向上遍历 '+dz_maxParent+' 次 同级元素 '+dz_sibling+' 个 第 ' + dz_i +' 个父元素 ===', 'color: yellow');
                    msg('目标：', dz_parent, dz_parent.tagName);
                    if($parent.tagName!=='FONT') {
                        dz_i++;
                    } else {
                        msg('不计算父元素 ' + $parent.tagName + ' 节点');
                    }
                    var dz_si=1, dz_nextSibling=dz_parent.nextSibling;//获得节点的兄弟节点
                    while(dz_si<=dz_sibling){
                        msg(' 第 ' + dz_si + ' 个同级元素', dz_nextSibling);
                        if(dz_nextSibling) { //检测同级元素是否存在
                            if(PreHandle.Code(dz_nextSibling)) {
                                console.groupEnd('=== Part2. 同级元素遍历模式 ===');
                                console.groupEnd('--- 普通父级遍历模式 ----');
                                PreHandle.Fusion($target, dz_nextSibling);
                                return;
                            }
                        } else {
                            msg(' 在目标元素查找 ', PreHandle.Code(dz_parent));
                            if(dz_parent==document.body) return;
                            if(PreHandle.Code(dz_parent)) {
                                console.groupEnd('=== 同级元素遍历模式 End ===');
                                console.groupEnd('--- 普通父级遍历模式 End ----');
                                PreHandle.Fusion($target, dz_parent);
                                return true;
                            }
                            break;
                        }
                        //console.groupEnd('=== 同级元素遍历模式 End ===');
                        console.groupEnd('--- 普通父级遍历模式 End ----');
                            dz_si++;
                        dz_nextSibling=dz_nextSibling.nextSibling;
                    }

                    dz_parent=dz_parent.parentNode;
                    msg(dz_parent);
                    console.groupEnd('--- 普通父级遍历模式 ----');
                }
                console.groupEnd('=== 同级元素遍历模式 ===');
            }
        };

        //监听 A 标签点击事件
        $('body').on('click', 'a', function (e) {
            let target=this, CatPW_Data,
                thisHost=this.host.toLowerCase().replace(/^(?:www|pan)\.(?!baidu.com)/i,'');
            //thisHost=thisHost.replace(/^\w+\.(?=lanzou)/,'').replace(/(?<=lanzou)[a-z]?/i,''); //蓝凑云网盘地址变体处理

            msg(`密码融合点击监听`, thisHost);

            //提升密码匹配范围，以兼容部分网盘
            if(site['YunDisk'][thisHost] && site['YunDisk'][thisHost]['pwdRule']) {
                site['pwdRule']=site['YunDisk'][thisHost]['pwdRule'];
            }
            if(site['YunDisk'][thisHost] && site['YunDisk'][thisHost]['codeRule']) {
                site['codeRule']=site['YunDisk'][thisHost]['codeRule'];
            }

            if(HostExp.test(this.href)){
                if(Control_newTag) this.target='_blank';		//新页面打开网盘
                this.href=this.href.replace(/#$/,''); //处理链接末尾的hash标记
                this.href=this.href.replace(/(?:%20)?(?:%EF%BC%88)?(%E8%AE%BF%E9%97%AE%E5%AF%86%E7%A0%81|%E6%8F%90%E5%8F%96%E7%A0%81)(?:%EF%BC%9A)?\w+(?:%EF%BC%89)?/i, ''); //处理掉链接中包含这些文本——“ (?:（)?(访问密码|提取码)(?:：)?\d+(?:）)?”）
                //初始化信息记录变量

                CatPW_Data={'date':Dates(),'sCode':'', unPW:'', 'Src':this.href, 'surl':'', 'Hash':this.hash, "webSrc":encodeURIComponent(urls), "webTitle":encodeURIComponent(document.title)};

                msg(CatPW_Data);

                if((this.hash && !this.hash.includes('/')) || /115.com\/s\/.+\?password/i.test(this.href)) { //如果超链接已有 hash ，或者 115 网盘的 password 参数，则跳过密码融合
                    msg('密码已融合，跳过密码融合步骤');
                    if(sessionStorage['CatPW_Data']) GM_setValue('CatPW', JSON.parse(sessionStorage['CatPW_Data']));
                    else GM_setValue('CatPW', CatPW_Data);
                    PreHandle.PassWord(CatPW_Data);        //融合解压密码
                    return;
                } else if(this.hash && this.hash.includes('/')){
                    //目标有Hash，但是不是提取码，则采用gmVal方案缓存密码，未完成
                    //CatPW_Data.sCode = sCode;
                    //GM_setValue('CatPW', CatPW_Data)
                }
                console.group(' ===== 网盘自动填写密码 密码融合 =====');

                //选定密码强制融合
                if(window.getSelection().toString()) {
                    msg('强制融合密码')
                    let slc=window.getSelection().toString();
                    //选中的内容为纯英文数字时，直接融合为访问码
                    if(!/[^\w]/.test(slc)&&/^\w+$/.test(slc)&&slc.length<=8) {
                        PreHandle.coercive(target, slc)
                    } else if(PreHandle.Code(slc)) {
                        PreHandle.Fusion(target, slc)
                    }
                }

                //论坛兼容模式
                if($.getUrlParam('mod')=='viewthread'&&$.getUrlParam('tid')&&$('.showhide').length>0||u.discuz_uid){
                    if($(target).next().hasClass("showhide") && PreHandle.Code(target.nextElementSibling)) {
                        msg('论坛特殊兼容模式 - 从链接后隐藏内容中查找密码');
                        PreHandle.Fusion(target, target.nextElementSibling);
                    } else if(SupportHost && SupportHost.Fusion) {
                        msg('论坛特殊兼容模式 - 密码在超链接后面的兄弟对象中');
                        let nextTager=target.nextElementSibling;
                        if(SupportHost.pwdContainer) {
                            while(nextTager) {
                                nextTager=nextTager.nextElementSibling;
                                if(nextTager.className==SupportHost.pwdContainer) break;
                            }
                        }
                        PreHandle.Fusion(target, nextTager);
                    }
                }

                //常规匹配模式
                if(PreHandle.Code(target)) {
                    msg('在当前超链接的对象中查找密码');
                    PreHandle.Fusion(target, target);
                } else if(PreHandle.Code(target.nextSibling)){
                    msg('密码在超链接后面的兄弟元素中');
                    PreHandle.Fusion(target, target.nextSibling);
                } else if(PreHandle.Code(target.parentNode)){
                    msg('从父对象中查找密码', target.parentNode);
                    PreHandle.Fusion(target, target.parentNode);
                } else {
                    console.group('--- 普通父级遍历模式 ----');
                    var i = 0,
                        maxParent = 5,	//向上遍历的层级
                        parent = target,
                        $parent = parent;
                    while(i<maxParent) {
                        i++;								//遍历计数
                        parent = parent.parentNode;			//取得父对象
                        msg('遍历上级目录查找密码：'+ i, parent);
                        if(parent.tagName=="TR") {				//如果父对象是表格，则从表格中提取密码
                            if(PreHandle.Code(parent.nextElementSibling)) {
                                parent=parent.nextElementSibling;
                                msg('表格中查找密码成功！',parent);
                                PreHandle.Fusion(target, parent);
                                break;
                            }
                        } else {
                            var EachSiblingResult=PreHandle.EachSibling($parent, target, i);  //同级遍历函数
                            if(EachSiblingResult) break; //遍历取得结果，停止遍历

                            $parent=parent.parentNode;     //取得上一级父对象
                            if(maxParent>5) {
                                msg('已超出遍历范围');
                            }
                        }
                        if(parent==document.body) break;								//如果已经遍历到最顶部
                    }
                    console.groupEnd('--- 普通父级遍历模式 ----');
                }

                CatPW_Data.Hash=this.hash;
                PreHandle.PassWord(CatPW_Data);        //融合解压密码
            }
            console.groupEnd();
        });
    }

    function msg(text){
        let obj = (e)=>{
        }
        if(msgControl) {
            //console.log('arguments.length', arguments.length, arguments);
            if(arguments.length>1) {
                let args=Array.prototype.slice.call(arguments)
                console.log(args);
            } else if(Object.prototype.toString.call(text).includes('Object')){
                console.table(text);
            }
            else {
                console.log(text);
            }
        }
    }

    function addMutationObserver(selector, callback, Kill) {
        var watch = document.querySelector(selector);

        if (!watch) {
            return;
        }
        var observer = new MutationObserver(function(mutations){
            var nodeAdded = mutations.some(function(x){ return x.addedNodes.length > 0; });
            if (nodeAdded) {
                callback(mutations);
                if(Kill) {
                    msg('停止'+selector+'的监控');
                    observer.disconnect();
                }
            }
        });
        observer.observe(watch, {childList: true, subtree: true});
    }

    function getQueryString(name,url) {//筛选参数
        var reg, str;
        url=url?url.match(/[?#].*/).toString():location.search;	//网址传递的参数提取，如果传入了url参数则使用传入的参数，否则使用当前页面的网址参数

        if(Array.isArray(name)){
            for(var i in name){
                reg = new RegExp("(?:^|&)(" + name[i] + ")=([^&]*)(?:&|$)", "i");		//正则筛选参数
                str = url.substr(1).match(reg);
                if (str !== null) return unescape(str[2]);
            }
        } else {
            reg = new RegExp("(?:^|&)(" + name + ")=([^&]*)(?:&|$)", "i");		//正则筛选参数
            str = url.substr(1).match(reg);
            if (str !== null) return unescape(str[2]);
        }
        return null;
    }

    function StorageDB(collectionName) {
        //如果没有 集合名，则使用默认 default
        collectionName = collectionName ? collectionName : 'default';
        //创建JSON缓存，如果缓存存在，则转为JSON，否则新建
        var cache = localStorage[collectionName] ? JSON.parse(localStorage[collectionName]) : {};

        return {
            add : function(name, value) {
                cache[name]=value;
                localStorage.setItem(collectionName, JSON.stringify(cache));        //回写 localStorage
            },
            del:function(name) {
                if(name) {
                    msg(cache, cache[name]);
                    delete cache[name];
                    localStorage.setItem(collectionName, JSON.stringify(cache));        //回写 localStorage
                } else {
                    //删除整个 localStorage 数据
                    localStorage.removeItem(name);
                }
            },
            insert: function(obj){
                localStorage.setItem(collectionName, JSON.stringify(obj));
            },
            Updata : function(name,obj,value){
                cache[obj]=cache[obj]||{};
                cache[obj][name]=value;
                localStorage.setItem(collectionName, JSON.stringify(cache));        //回写 localStorage
            },
            Query : function(obj,name){
                return cache[obj]?name?(cache[obj][name]?cache[obj][name]:null):cache[obj]:null;
            },
            find : function(name) {
                if(!collectionName) return false;
                return cache[name];
            },
            read : function(){
                return $.isEmptyObject(cache)?null:cache;//如果为空，则返回 null
            },
            deleteExpires : function(now){
                now=now||$.now();
                for(var i in cache) {
                    //console.log(i, collectionName, now, cache[i]['exp'], now>cache[i]['exp']); //删除记录显示
                    //console.log(cache[i], localStorage[i]);
                    if(now>cache[i]['exp']) {
                        delete localStorage[i];     //删除对应分享 ID 的记录
                        this.del(i);                //删除时间表中的记录
                    }
                }
            }
        };
    }

    function DiskInfo(Key, target, Prepocess){
        //Key文件分享ID
        var insertTarget=target, //信息插入的目标位置
            CatPW_Data,
            CatPW_Format={'date':Dates(),'sCode':'', unPW:'', 'Src':'', 'Hash':'', "webSrc":'', "webTitle":''};

        //初始化 getValue 数据

        if(StorageDB(Key).read()) {
            GM_setValue('CatPW', StorageDB(Key).read());
            CatPW_Data=StorageDB(Key).read();
        } else if(GM_getValue('CatPW')=='undefined'||GM_getValue('CatPW')===undefined) {
            GM_setValue('CatPW', CatPW_Format);	//初始化
        } else {
            CatPW_Data=GM_getValue('CatPW');
        }
        if(Prepocess) Prepocess(CatPW_Data, Key);

        if((CatPW_Data['Src'].search(Key)>-1||CatPW_Data['FileID']==Key)&&$('#CatPW_Info').length<1) {
            var $CatPW_Info=$('<DIV>').attr('id','CatPW_Info');
            var $CatPW_Info_unPW=$('<div>').text('解压密码：').append($('<input>').attr({'id':'unPW','title':'点击复制密码'}).css({'margin':'0 10px','width':'150px','text-align':'center'}).val(decodeURIComponent(CatPW_Data.unPW)).click(function(){document.execCommand("SelectAll");document.execCommand("copy");}).change(function(){
                StorageDB(Key).add('unPW',encodeURIComponent(this.value));
                CatPW_Data.unPW=encodeURIComponent(this.value);
                GM_setValue('CatPW', CatPW_Data);
            }));
            var $CatPW_Info_title=$('<span>').text('网页标题：').append($('<input>').attr({'id':'CatPW_webTitle','title':'内容修改自动保存'}).val(decodeURIComponent(CatPW_Data.webTitle)).css({'margin':'0 10px','padding':'0 2px','min-width':'450px'}).show(function(){
                $(this).css({'width':this.value.length*15});
            }).change(function(){
                StorageDB(Key).add('webTitle',encodeURIComponent(this.value));
            }));
            var $CatPW_Info_webSrc=$('<A>').attr({'id':'CatPW_webSrc','href':decodeURIComponent(CatPW_Data.webSrc),'target':'_blank'}).text('网盘来源：'+decodeURIComponent(decodeURIComponent(CatPW_Data.webSrc)));
            var $CatPW_Info_DeleteBtn=$('<button>').text('删除记录').val('删除记录').css({'display':'inline-block'}).click(function(){
                delete localStorage[Key];
                GM_setValue('CatPW', CatPW_Format);
                this.disabled=true;
            });
            $CatPW_Info.append($CatPW_Info_unPW.append($CatPW_Info_DeleteBtn), '<br>', $CatPW_Info_title,'<br>', $CatPW_Info_webSrc).insertBefore(insertTarget);
            StorageDB(Key).insert(CatPW_Data);
        } else {
            $('<div>').append('当前记录网盘地址为：',$('<A>').attr({'href':CatPW_Data.Src,'target':'_blank'}).text(CatPW_Data.Src),' 与当前网盘不符').insertBefore(insertTarget);
        }
        GM_addStyle('#CatPW_Info{font-size:14px;border:1px solid #06c;padding:5px;display:block;}');
    }

    function DownAjax(urls, selection,callback){
        GM_xmlhttpRequest({
            method: "GET",
            url: urls,
            onload: function (result) {
                var parsetext = function(text){
                    var doc = null;
                    try {
                        doc = document.implementation.createHTMLDocument("");
                        doc.documentElement.innerHTML = text;
                        return doc;
                    }
                    catch (e) {
                        alert("parse error");
                    }
                };
                var Down;
                var doc = parsetext(result.responseText);
                var t = $(doc).find(selection);
                callback(t);
            }
        });
    }

    function Dates(){
        var sDate=new Date();
        return sDate.getFullYear()+'/'+(sDate.getMonth()+1)+'/'+sDate.getDate();
    }


    function Fn_MessageUI(content){
        GM_addStyle(`
#MessageUI {
width: 100%;
position: fixed;
left: 0;
top: 0;
z-index: 99999999;
pointer-events: none;
}
#MessageUI * {
pointer-events: auto;
}
#MessageUI_Btn {
position: relative;
margin: 0 auto;
padding: 1px 0;
width: 100px;
height: 16px;
color: #000;
font-size: 12px;
line-height: 10px;
cursor: pointer;
text-align: center;
border: 1px solid #AAA;
border-radius: 0 0 12px 12px;
background-color: #fff;
box-shadow: 0 0 5px rgba(0, 0, 0, .1);
}
#MessageUI_Btn:hover {
color: rgba(0, 0, 0, .8);
background-color: rgba(255, 255, 255, 0.8);
}
#MessageUI_Panel {
display: none;
border-top: 5px solid #65adff;
background-color: #FFF;
box-shadow: 0 0 5px rgba(0, 0, 0, .1);
}
#MessageUI_Panel > #MessageUI_Panel_Content {
display: flex;
flex: 1 1 none;
flex-wrap: wrap;
width: 100%;
max-width: 1400px;
margin: 0 auto;
padding: 16px 20px;
position: relative;
}
`);
        /** 添加界面 **/
        var MessageUI=$('<div>').attr({'id':'MessageUI'}),
            MessageUI_Btn=$('<div>').attr({'id':'MessageUI_Btn'}).text('查看网盘信息'),
            MessageUI_Panel=$('<div>').attr({'id':'MessageUI_Panel'}),
            MessageUI_Panel_Content=$('<div>').attr({'id':'MessageUI_Panel_Content'});

        MessageUI_Btn.click(function(ele){
            var eleStyle = MessageUI_Panel.css('display');
            if(MessageUI_Panel.css('display') === 'none'){
                MessageUI_Panel.css('display','block');
                MessageUI_Btn.text('收起网盘信息');
            } else {
                MessageUI_Panel.css('display','');
                MessageUI_Btn.text('查看网盘信息');
            }
        });

        MessageUI_Panel_Content.html(content);

        $('body').after(MessageUI.append(MessageUI_Btn, MessageUI_Panel.append(MessageUI_Panel_Content)));
    }
})();
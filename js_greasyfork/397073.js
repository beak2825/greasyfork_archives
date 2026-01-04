// ==UserScript==
// @name         Steam assistant(Steam小助手)
// @description  WEB端Steam小助手，集合多种功能如Steam批量留言,点赞,好友管理,喜加一...，佛系更新中...欢迎提出您的建议或者共同学习交流
// @version      1.2.3.4.5
// @date         2020.6.30
// @source       https://github.com/Mikuof39/Steam-assistant-Steam-
// @homepage     https://steamcommunity.com/sharedfiles/filedetails/?id=1993903275
// @supportURL   https://greasyfork.org/zh-CN/scripts/397073/feedback
// @author       Miku39
// @license      GPL License
// @namespace    https://steamcommunity.com/id/miku-39/
// @namespace    https://www.tampermonkey.net/
// @namespace    https://greasyfork.org/
// @icon         https://store.steampowered.com/favicon.ico
// @icon64       https://steamcommunity-a.akamaihd.net/public/shared/images/responsive/share_steam_logo.png
// @note         CSS-----------------------------------------------------------------------
// @resource     css_layui https://www.layuicdn.com/layui-v2.5.6/css/layui.css
// @resource     css_laydate https://www.layuicdn.com/layui-v2.5.6/css/modules/laydate/default/laydate.css?v=5.0.9
// @resource     css_layer https://www.layuicdn.com/layui-v2.5.6/css/modules/layer/default/layer.css?v=3.1.1
// @resource     css_layui_Modules https://www.layuicdn.com/layui-v2.5.6/css/modules/code.css
// @resource     css_fontAwesome https://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css
// @note         JS-----------------------------------------------------------------------
// @resource     JS_highstock https://code.highcharts.com.cn/highstock/highstock.js
// @resource     JS_highstock_exporting https://code.highcharts.com.cn/highcharts/modules/exporting.js
// @resource     JS_highstock_oldie https://code.highcharts.com.cn/highcharts/modules/oldie.js
// @resource     JS_highstock_networkgraph https://code.highcharts.com.cn/highcharts/modules/networkgraph.js
// @resource     JS_highstock_zh_CN https://code.highcharts.com.cn/highcharts-plugins/highcharts-zh_CN.js
// @resource     JS_layui https://www.layuicdn.com/layui-v2.5.6/layui.all.js
// @resource     JS_localforage https://cdnjs.cloudflare.com/ajax/libs/localforage/1.7.3/localforage.min.js
// @resource     JS_draw https://cdnjs.cloudflare.com/ajax/libs/pixi.js/5.2.4/pixi.js
// @resource     JS_animate https://code.createjs.com/1.0.0/tweenjs.js
// @resource     JS_sound https://code.createjs.com/1.0.0/soundjs.js
// @resource     JS_render https://cdnjs.cloudflare.com/ajax/libs/three.js/110/three.js
// @resource     JS_multithreading https://gitlab.com/hordesolutions/Hamsters.js/-/raw/master/build/hamsters.min.js
// @resource     JS_pep https://code.jquery.com/pep/0.4.3/pep.js
// @resource     JS_babylon https://preview.babylonjs.com/babylon.js
// @resource     JS_babylon_loaders https://preview.babylonjs.com/loaders/babylonjs.loaders.min.js
// @resource     Jquery_localizationtool https://greasyfork.org/scripts/403927-jquery-localizationtool-js/code/jquerylocalizationTooljs.js?version=808323
// @note         运行页面-> 社区
// @include      /^https?:\/\/steamcommunity.com\/(id\/+[A-Za-z0-9$-_.+!*'(),]+|profiles\/7656119[0-9]{10})\/friends\/?$/
// @include      /^https?:\/\/steamcommunity.com\/(id\/+[A-Za-z0-9$-_.+!*'(),]+|profiles\/7656119[0-9]{10})\/friends\/?(add|pending|blocked|coplay|broadcast_moderator)?\/?$/
// @include      /^https?:\/\/steamcommunity.com\/(id\/+[A-Za-z0-9$-_.+!*'(),]+|profiles\/7656119[0-9]{10})\/(following|groups|groups\/pending)\/?$/
// @include      /^https?:\/\/steamcommunity.com\/(id\/+[A-Za-z0-9$-_.+!*'(),]+|profiles\/7656119[0-9]{10})\/friends\/?([A-Za-z0-9$/-_.+!*'(),])+$/
// @note         运行页面-> 创意工坊-我的
// @include      /^https?:\/\/steamcommunity.com\/(id\/+[A-Za-z0-9$-_.+!*'(),]+|profiles\/7656119[0-9]{10})\/myworkshopfiles\/\?appid=+[0-9]+&browsefilter=myfavorites$/
// @note         运行页面-> 创意工坊-我的收藏
// @include      /^https?:\/\/steamcommunity.com\/(id\/+[A-Za-z0-9$-_.+!*'(),]+|profiles\/7656119[0-9]{10})\/myworkshopfiles\/\?appid=+[0-9]+&browsefilter=myfavorites$/
// @note         运行页面-> 创意工坊-我的订阅
// @include      /^https?:\/\/steamcommunity.com\/(id\/+[A-Za-z0-9$-_.+!*'(),]+|profiles\/7656119[0-9]{10})\/myworkshopfiles\/\?appid=+[0-9]+&browsefilter=myfavorites$/
// @note         运行页面-> 创意工坊-运行过的
// @include      /^https?:\/\/steamcommunity.com\/(id\/+[A-Za-z0-9$-_.+!*'(),]+|profiles\/7656119[0-9]{10})\/myworkshopfiles\/\?appid=+[0-9]+&browsefilter=myfavorites$/
// @note         脚本功能-----------------------------------------------------------------------
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener	
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_getTabs
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_listValues
// @grant        GM_info
// @note         Cdn-----------------------------------------------------------------------
// @connect      code.highcharts.com
// @connect      code.highcharts.com.cn
// @connect      www.layuicdn.com
// @connect      cdnjs.cloudflare.com
// @connect      cdn.90so.net
// @connect      www.jsdelivr.com
// @connect      cdn.bootcss.com
// @connect      stackpath.bootstrapcdn.com
// @connect      greasyfork.org
// @connect      github.com
// @connect      www.bootcdn.cn
// @connect      cdn.jsdelivr.net
// @note         Translate-----------------------------------------------------------------
// @connect      www.deepl.com
// @connect      api.deepl.com
// @connect      translate.google.cn
// @connect      translate.google.com
// @connect      fanyi.baidu.com
// @connect      api.fanyi.baidu.com  //百度通用翻译API HTTP   http://fanyi-api.baidu.com/api/trans/product/prodinfo#0
// @connect      fanyi-api.baidu.com  //百度通用翻译API HTTPS  https://blog.csdn.net/dianfu2892/article/details/101467066
// @connect      fanyi.youdao.com
// @connect      fanyi.so.com
// @connect      fanyi.qq.com
// @connect      fanyi.sogou.com
// @connect      cn.bing.com  //https://cn.bing.com/translator/
// @connect      hjdict.com   //http://www.hjdict.com/app/trans
// @connect      fanyi.dict.cn
// @note         Api-----------------------------------------------------------------------
// @connect      brushes8.com
// @connect      api.help.bj.cn
// @connect      api.avatardata.cn  //https://www.avatardata.cn/Docs
// @connect      route.showapi.com  //会员/免费 https://www.showapi.com/api/apiList
// @connect      zhaiyan.2cys.com
// @connect      api.dongmanxingkong.com
// @connect      api.pingcc.cn
// @connect      47.114.147.221
// @connect      www.dmoe.cc
// @connect      api.mz-moe.cn
// @connect      sinaimg.cn
// @connect      self
// @connect      *
// @noframes
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/397073/Steam%20assistant%28Steam%E5%B0%8F%E5%8A%A9%E6%89%8B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/397073/Steam%20assistant%28Steam%E5%B0%8F%E5%8A%A9%E6%89%8B%29.meta.js
// ==/UserScript==

/**
 */
 
 //----------------------------------------------------------------------------------------------------------------------------------------------------
 //模块: databaseConf.js class DB -> ui.js UI::initUI()
 /* 全局数据库对象 */
 var g_db,g_db1,g_db2,g_db3,g_db4;
 //----------------------------------------------------------------------------------------------------------------------------------------------------
 //模块: databaseConf.js -> ui.js UI::initUI()
 
 const URLs = {
         //您的好友
         g_friendUrlRegExp: /^https?:\/\/steamcommunity.com\/(id\/+[A-Za-z0-9$-_.+!*'(),]+|profiles\/7656119[0-9]{10})\/friends\/?$/,
         //添加好友
         g_otherUrlRegExp1_1: /^https?:\/\/steamcommunity.com\/(id\/+[A-Za-z0-9$-_.+!*'(),]+|profiles\/7656119[0-9]{10})\/friends\/add?\/?$/,
         //待处理邀请
         g_otherUrlRegExp1_2: /^https?:\/\/steamcommunity.com\/(id\/+[A-Za-z0-9$-_.+!*'(),]+|profiles\/7656119[0-9]{10})\/friends\/pending?\/?$/,
         //已屏蔽
         g_otherUrlRegExp1_3: /^https?:\/\/steamcommunity.com\/(id\/+[A-Za-z0-9$-_.+!*'(),]+|profiles\/7656119[0-9]{10})\/friends\/blocked?\/?$/,
         //近期共同游戏的玩家
         g_otherUrlRegExp1_4: /^https?:\/\/steamcommunity.com\/(id\/+[A-Za-z0-9$-_.+!*'(),]+|profiles\/7656119[0-9]{10})\/friends\/coplay?\/?$/,
         //直播版主
         g_otherUrlRegExp1_5: /^https?:\/\/steamcommunity.com\/(id\/+[A-Za-z0-9$-_.+!*'(),]+|profiles\/7656119[0-9]{10})\/friends\/broadcast_moderator?\/?$/,
         //关注的玩家
         g_otherUrlRegExp2_1: /^https?:\/\/steamcommunity.com\/(id\/+[A-Za-z0-9$-_.+!*'(),]+|profiles\/7656119[0-9]{10})\/following\/?$/,
         //您的组
         g_otherUrlRegExp2_2: /^https?:\/\/steamcommunity.com\/(id\/+[A-Za-z0-9$-_.+!*'(),]+|profiles\/7656119[0-9]{10})\/groups\/?$/,
         //待处理邀请
         g_otherUrlRegExp2_3: /^https?:\/\/steamcommunity.com\/(id\/+[A-Za-z0-9$-_.+!*'(),]+|profiles\/7656119[0-9]{10})\/groups\/pending\/?$/,
         //
         g_otherUrlRegExp3: /^https?:\/\/steamcommunity.com\/(id\/+[A-Za-z0-9$-_.+!*'(),]+|profiles\/7656119[0-9]{10})\/friends\/?([A-Za-z0-9$/-_.+!*'(),])+$/,
 };
 //----------------------------------------------------------------------------------------------------------------------------------------------------
 //模块: databaseConf.js -> ui.js UI::initUI()
 const g_steamId64RegExp = /7656119[0-9]{10}/;
 //----------------------------------------------------------------------------------------------------------------------------------------------------
 //模块: externalApis.js class intelligenceAI, class SteamDB, class friendActivity, class UI, class externalApis, class App
 /* 全局对象 */
 var gc_res = null;
 

 
 var gc_ai = null;
 var gc_steamdb = null;
 var gc_friAct = null;
 var gc_menu_friends_ui = null;           //您的好友
 var gc_menu_friends_invite_ui = null;    //待处理邀请
 var gc_menu_shielding_ui = null;         //已屏蔽
 var gc_menu_gameFriend_ui = null;        //近期共同游戏的玩家
 var gc_menu_liveAdmin_ui = null;         //直播版主
 var gc_menu_following_Players_ui = null; //关注的玩家
 var gc_menu_groups_ui = null;            //您的组
 var gc_menu_groups_invite_ui = null;     //待处理邀请
 var gc_exApis = null;
 var gc_app = null;
 //----------------------------------------------------------------------------------------------------------------------------------------------------
 //模块: utility.js -> registeMenu() 和 unRegisteMenu()使用
 /* 全局对象 */
 var g_arrMenuID = [5];



function fixConfInfo(i,steamID){ /*修复配置信息*/
        var isFix = false;
        
        if (g_conf[i].delay < 0){
                isFix = true; g_conf[i].delay = 4;
        }
        if (g_conf[i].strNoOperate == ""){
                isFix = true; g_conf[i].strNoOperate = "(不留言)";
        }
        if (g_conf[i].strRemarkPlaceholder == ""){
                isFix = true; g_conf[i].strRemarkPlaceholder = "{name}";
        }
        
        return isFix;
}

function newUserGuide(steamID){ /*新用户引导*/
        /*新手引导*/
        /*console.log("欢迎使用Steam小助手. 当前版本: 更新时间:");*/
        /*显示简短的教程界面*/
        /*console.log("是否进入教程?");*/
        /*console.log("文字教程: 链接到指南 视频教程: 链接");*/
        var length = g_conf.push(g_default_configuration); /*添加默认配置信息作为新配置信息*/
        g_conf[length-1].steamID = steamID; /*设置当前用户的steamID，作为当前用户的配置信息*/
}

function readUserConfInfoToCurrConfInfo(i){ /*读取用户配置信息到当前配置信息处[0]*/
        g_conf[0].autoLogin = g_conf[i].autoLogin;
        g_conf[0].delay = g_conf[i].delay;
        g_conf[0].strNoOperate = g_conf[i].strNoOperate;
        g_conf[0].strRemarkPlaceholder = g_conf[i].strRemarkPlaceholder;
        g_conf[0].steamID = g_conf[i].steamID;
}

function getProfilesInfo(){ /*获取配置文件信息*/
        
}
function readConfInfo(steamID){ /*读取已保存的对应配置信息*/
        
        if(g_conf.length == 1){ /*说明没有格外的配置信息*/
                newUserGuide(steamID);
        }
        else
        {
                for (let i = 1; i < g_conf.length; i++) { /*遍历所有的配置信息*/
                        if(g_conf[i].steamID == steamID){
                                readUserConfInfoToCurrConfInfo(i); /*读取用户配置信息到当前配置信息处[0]*/
                                return true;
                        }
                }
                /*如果没有查找到，则新建用户引导*/
                newUserGuide(steamID);
                return true;
        }
}

function saveConfInfo(steamID){ /*保存最新的配置信息*/
        if(fixConfInfo(0,steamID)){ /*尝试 修复配置信息*/
                console.log("尝试保存的配置信息无效，已经恢复至默认值. 请检查...");
        }
        
}

function initConfInfo(i,steamID){ /*配置信息初始化(恢复默认)*/
        g_conf[i].autoLogin = g_default_configuration.autoLogin;
        g_conf[i].delay = g_default_configuration.delay;
        g_conf[i].strNoOperate = g_default_configuration.strNoOperate;
        g_conf[i].strRemarkPlaceholder = g_default_configuration.strRemarkPlaceholder;
        g_conf[i].steamID = g_default_configuration.steamID;
}

function exportConfInfo(steamID){ /*导出配置信息(到文件)*/
        if(fixConfInfo(0,steamID)){ /*尝试 修复配置信息*/
                console.log("尝试导出的配置信息无效，已经恢复至默认值. 请检查...");
        }
        /*从0号中读取出来，导出到文件*/
        
}

function importConfInfo(steamID){ /*导入配置信息(选择文件并读取)*/
        
        if(fixConfInfo(0,steamID)){ /*尝试 修复配置信息*/
                console.log("尝试导入的配置信息无效，已经恢复至默认值. 请检查...");
        }
        
        /*保存配置文件*/
}

//-------------------------------------------------------------------------------------------------------------
class DB{
        constructor(){
                this.DBstore = []; //数据库存储数组(多实例)
                this.DBindex = 0;  //当前数据库索引
                
                if(arguments.length == 1){
                        this._constructor(arguments[0]);
                }else if(arguments.length == 2){
                        this._constructor(arguments[0],arguments[1]);
                }
        }
        _constructor(DBConfig,isTest = true){ //默认创建新的数据库 //数据库配置,是否启用测试
                if(isTest == true)
                        this.Test();
                this.initAndCreateNewDBInstance(DBConfig);
        }
        use(DBname){ //指定要使用的数据库
                for (let i = 0; i < this.DBstore.length; i++) {
                        if(DBname == DBstore[i]._dbInfo.name){
                                this.DBindex = i;
                                return DBstore[i];
                        }
                }
                return null;
        }
        async initCurrentDBInstance(DBConfig){ //单数据库 //初始化当前数据库实例
                var obj;
                if(typeof DBConfig == "object"){
                        localforage.config(DBConfig);
                        this.DBindex = this.DBstore.push(obj) -1; //
                        obj = localforage;
                }else{
                        console.log("参数不合法，请检查...");
                }
                
                await obj.ready().then(function() {
                        // 当 localforage 将指定驱动初始化完成时，此处代码运行
                        console.log("数据库初始化成功! 当前使用的是: "+ localforage.driver());
                }).catch(function (e) {
                        // 当没有可用的驱动时，ready()将会失败
                        console.log("数据库初始化失败(没有可用的驱动)! " + e); // No available storage method found.
                });
                return obj;
        }
        initAndCreateNewDBInstance(DBConfig){ //多数据库 //初始化并创建新的数据库实例
                var obj;
                if(typeof DBConfig == "object"){
                        obj = localforage.createInstance(DBConfig);
                        this.DBindex = this.DBstore.push(obj) -1; //
                }else{
                        console.log("参数不合法，请检查...");
                }
                return obj;
        }
        async dropDBInstance(name){ //删除数据库实例
                await localforage.dropInstance({
                  name: name
                }).then(function() {
                        //console.log('删除数据库成功!');
                });
        }
        async Read(key){ //读取数据
                var data;
                await this.DBstore[this.DBindex].getItem(key).then(function(value) {
                        // 当离线仓库中的值被载入时，此处代码运行
                        //console.log("数据读取成功. "+ value);
                        data = value;
                }).catch(function(err) {
                        // 当出错时，此处代码运行
                        console.log("数据读取失败! "+ err);
                });
                return data;
        }
        async ReadAll(){ //读取所有数据(迭代)，返回包含所有数据的数组
                var data = [];
                await this.DBstore[this.DBindex].iterate(function(value, key, iterationNumber) {
                        // 此回调函数将对所有 key/value 键值对运行
                        //console.log([key, value]);
                        data.push([key, value]);
                }).then(function() {
                        //console.log("读取所有数据成功."+ [key, value]);
                }).catch(function(err) {
                        // 当出错时，此处代码运行
                        console.log("读取所有数据失败!"+ err);
                });
                return data;
        }
        async Write(key,value){ //写入数据
                var status = true;
                // 不同于 localStorage，你可以存储非字符串类型
                await this.DBstore[this.DBindex].setItem(key, value).then(function(value) {
                        //console.log("数据写入成功. "+ value);
                }).catch(function(err) {
                        // 当出错时，此处代码运行
                        status = false;
                        console.log("数据写入失败! "+ err);
                });
                return status;
        }
        async Remove(key){ //删除数据
                var status = true;
                await this.DBstore[this.DBindex].removeItem(key).then(function() {
                        // 当值被移除后，此处代码运行
                        //console.log('删除数据成功.');
                }).catch(function(err) {
                        // 当出错时，此处代码运行
                        status = false;
                        console.log('删除数据失败!'+ err);
                });
                return status;
        }
        async RemoveAll(){ //删除所有数据(重置数据库->删除后数据库是空的)
                var status = true;
                await this.DBstore[this.DBindex].clear().then(function() {
                        // 当数据库被全部删除后，此处代码运行
                        //console.log('删除所有数据成功!');
                }).catch(function(err) {
                        // 当出错时，此处代码运行
                        status = false;
                        console.log('删除所有数据失败!'+ err);
                });
                return status;
        }
        async getLength(){ //获取已存储的所有数据总条数(长度)
                var length;
                await this.DBstore[this.DBindex].length().then(function(numberOfKeys) {
                        // 输出数据库的大小
                        //console.log(numberOfKeys);
                        length = numberOfKeys;
                }).catch(function(err) {
                        // 当出错时，此处代码运行
                        console.log(err);
                });
                return length;
        }
        async getKeyNameByIndex(index){ //通过下标(index)获取对应的Key名 //此方法很怪异，于是进行重写
                // var name;
                // await this.DBstore[this.DBindex].key(index).then(function(keyName) {
                //      // key 名
                //      //console.log(keyName);
                //      name = keyName;
                // }).catch(function(err) {
                //      // 当出错时，此处代码运行
                //      console.log("getKeyNameByIndex()失败!" + err);
                // });
                // return name;
                
                var arr_name = await this.getAllKeyName();
                if(index < 0 || index >= arr_name.length){
                        console.log("getKeyNameByIndex()失败! 参数不正确: " +index);
                        return null;
                }
                return arr_name[index];
        }
        async getAllKeyName(){ // 返回 包含所有 key 名的数组
                var key;
                await this.DBstore[this.DBindex].keys().then(function(keys) {
                        // console.log(keys);
                        key = keys;
                }).catch(function(err) {
                    // 当出错时，此处代码运行
                    console.log("getAllKeyName()失败!" + err);
                });
                return key;
        }
        Test(){ //测试当前浏览器的数据库支持情况
                if(localforage.supports(localforage.INDEXEDDB) == true){
                        console.log("当前浏览器支持 IndexedDB.");
                }else{
                        console.log("当前浏览器不支持 IndexedDB!");
                }
                
                if(localforage.supports(localforage.WEBSQL) == true){
                        console.log("当前浏览器支持 WEBSQL.");
                }else{
                        console.log("当前浏览器不支持 WEBSQL!");
                }
                
                if(localforage.supports(localforage.LOCALSTORAGE) == true){
                        console.log("当前浏览器支持 LOCALSTORAGE.");
                }else{
                        console.log("当前浏览器不支持 LOCALSTORAGE!");
                }
        }
}


//---------------------------------------------------------------------------------------
// class GameId {
//     static parseId(id) {
//         if (!id) { return null; }
        
//         let intId = parseInt(id);
//         if (!intId) { return null; }
        
//         return intId;
//     }
    
//     static getAppid(text) {
//         if (!text) { return null; }

//         if (text instanceof HTMLElement) {
//             let appid = text.dataset.dsAppid;
//             if (appid) return GameId.parseId(appid);
//             text = text.href;
//             if (!text) return null;
//         }

//         // app, market/listing
//         let m = text.match(/(?:store\.steampowered|steamcommunity)\.com\/(?:app|market\/listings)\/(\d+)\/?/);
//         return m && GameId.parseId(m[1]);
//     }
    
//     static getSubid(text) {
//         if (!text) { return null; }

//         if (text instanceof HTMLElement) {
//             let subid = text.dataset.dsPackageid;
//             if (subid) return GameId.parseId(subid);
//             text = text.href;
//             if (!text) return null;
//         }
        
//         let m = text.match(/(?:store\.steampowered|steamcommunity)\.com\/sub\/(\d+)\/?/);
//         return m && GameId.parseId(m[1]);
//     }

//     static getBundleid(text) {
//         if (!text) { return null; }

//         if (text instanceof HTMLElement) {
//             let bundleid = text.dataset.dsBundleid;
//             if (bundleid) return GameId.parseId(bundleid);
//             text = text.href;
//             if (!text) return null;
//         }

//         let m = text.match(/(?:store\.steampowered|steamcommunity)\.com\/bundle\/(\d+)\/?/);
//         return m && GameId.parseId(m[1]);
//     }

//     static trimStoreId(storeId) {
//         return Number(storeId.slice(storeId.indexOf('/') + 1));
//     }
    
//     static getAppidImgSrc(text) {
//         if (!text) { return null; }
//         let m = text.match(/(steamcdn-a\.akamaihd\.net\/steam|steamcommunity\/public\/images)\/apps\/(\d+)\//);
//         return m && GameId.parseId(m[2]);
//     }
    
//     static getAppidUriQuery(text) {
//         if (!text) { return null; }
//         let m = text.match(/appid=(\d+)/);
//         return m && GameId.parseId(m[1]);
//     }
    
//     static getAppids(text) {
//         let regex = /(?:store\.steampowered|steamcommunity)\.com\/app\/(\d+)\/?/g;
//         let res = [];
//         let m;
//         while ((m = regex.exec(text)) != null) {
//             let id = GameId.parseId(m[1]);
//             if (id) {
//                 res.push(id);
//             }
//         }
//         return res;
//     }
    
//     static getAppidFromId(text) {
//         if (!text) { return null; }
//         let m = text.match(/game_(\d+)/);
//         return m && GameId.parseId(m[1]);
//     }
    
//     static getAppidFromGameCard(text) {
//         if (!text) { return null; }
//         let m = text.match(/\/gamecards\/(\d+)/);
//         return m && GameId.parseId(m[1]);
//     }
// }

// // todo use https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage
// class LocalStorage {
//     static get(key, defaultValue) {
//         let item = localStorage.getItem(key);
//         if (!item) return defaultValue;
//         try {
//             return JSON.parse(item);
//         } catch (err) {
//             return defaultValue;
//         }
//     }
    
//     static set(key, value) {
//         localStorage.setItem(key, JSON.stringify(value));
//     }

//     static has(key) {
//         return localStorage.getItem(key) !== null;
//     }
    
//     static remove(key) {
//         localStorage.removeItem(key);
//     }
    
//     static keys() {
//         let result = [];
//         for (let i = localStorage.length - 1; i >= 0; --i) {
//             result.push(localStorage.key(i));
//         }
//         return result;
//     }
    
//     static clear() {
//         localStorage.clear();
//     }
// }


// class SyncedStorage {
//     /**
//      * browser.storage.sync limits
//      * QUOTA_BYTES = 102400 // 100KB
//      * QUOTA_BYTES_PER_ITEM = 8192 // 8KB
//      * MAX_ITEMS = 512
//      * MAX_WRITE_OPERATIONS_PER_HOUR = 1800
//      * MAX_WRITE_OPERATIONS_PER_MINUTE = 120
//      */
//     static has(key) {
//         return Object.prototype.hasOwnProperty.call(this.cache, key);
//     }
//     static get(key) {
//         if (typeof this.cache[key] == 'undefined') {
//             if (typeof this.defaults[key] == 'undefined') {
//                 console.warn(`Unrecognized SyncedStorage key '${key}'`);
//             }
//             return this.defaults[key];
//         }
//         return this.cache[key];
//     }

//     static set(key, value) {
//         this.cache[key] = value;
//         return this.adapter.set({ [key]: value, });
//         // this will throw if MAX_WRITE_*, MAX_ITEMS, QUOTA_BYTES* are exceeded
//     }

//     static import(entries) {
//         for (let [key, value] of Object.entries(entries)) {
//             this.cache[key] = value;
//         }
//         return this.adapter.set(entries);
//     }

//     static remove(key) {
//         if (typeof this.cache[key]) {
//             delete this.cache[key];
//         }
//         return this.adapter.remove(key);
//         // can throw if MAX_WRITE* is exceeded
//     }

//     static keys(prefix='') {
//         return Object.keys(this.cache).filter(k => k.startsWith(prefix));
//     }

//     static entries() {
//         return Object.entries(this.cache);
//     }

//     static clear() {
//         this.cache = {};
//         return this.adapter.clear();
//         // can throw if MAX_WRITE* is exceeded
//     }

//     // load whole storage and make local copy
//     static async init() {
//         browser.storage.onChanged.addListener(changes => {
//             for (let [key, { newValue: val, }] of Object.entries(changes)) {
//                 this.cache[key] = val;
//             }
//             if (typeof ContextMenu === "function" && Object.keys(changes).some(key => key.startsWith("context_"))) {
//                 ContextMenu.update();
//             }
//         });

//         let storage = await this.adapter.get(null);
//         Object.assign(this.cache, storage);

//         return this.cache;
//     }
//     static then(onDone, onCatch) {
//         return this.init().then(onDone, onCatch);
//     }

//     static async quota() {
//         let maxBytes = this.adapter.QUOTA_BYTES;
//         let bytes = await this.adapter.getBytesInUse();
//         return bytes / maxBytes; // float 0.0 (0%) -> 1.0 (100%)
//     }
// }
// SyncedStorage.adapter = browser.storage.sync || browser.storage.local;
// SyncedStorage.cache = {};
// SyncedStorage.defaults = {
//     'language': "english",

//     'version': Info.version,
//     'version_show': true,

//     'highlight_owned_color': "#00ce67",
//     'highlight_wishlist_color': "#0491bf",
//     'highlight_coupon_color': "#a26426",
//     'highlight_inv_gift_color': "#800040",
//     'highlight_inv_guestpass_color': "#513c73",
//     'highlight_notinterested_color': "#4f4f4f",
//     'highlight_collection_color': "#856d0e",
//     'highlight_waitlist_color': "#4c7521",

//     'tag_owned_color': "#00b75b",
//     'tag_wishlist_color': "#0383b4",
//     'tag_coupon_color': "#c27120",
//     'tag_inv_gift_color': "#b10059",
//     'tag_inv_guestpass_color': "#65449a",
//     'tag_notinterested_color': "#4f4f4f",
//     'tag_collection_color': "#856d0e",
//     'tag_waitlist_color': "#4c7521",

//     'highlight_owned': true,
//     'highlight_wishlist': true,
//     'highlight_coupon': false,
//     'highlight_inv_gift': false,
//     'highlight_inv_guestpass': false,
//     'highlight_notinterested': false,
//     'highlight_excludef2p': false,
//     'highlight_notdiscounted': false,
//     'highlight_collection': true,
//     'highlight_waitlist': true,

//     'tag_owned': false,
//     'tag_wishlist': false,
//     'tag_coupon': false,
//     'tag_inv_gift': false,
//     'tag_inv_guestpass': false,
//     'tag_notinterested': true,
//     'tag_collection': false,
//     'tag_waitlist': false,
//     'tag_short': false,

//     'hide_owned': false,
//     'hide_ignored': false,
//     'hide_dlcunownedgames': false,
//     'hide_wishlist': false,
//     'hide_cart': false,
//     'hide_notdiscounted': false,
//     'hide_mixed': false,
//     'hide_negative': false,
//     'hide_priceabove': false,
//     'priceabove_value': "",
//     'hidetmsymbols': false,

//     'showlowestprice': true,
//     'showlowestprice_onwishlist': true,
//     'showlowestpricecoupon': true,
//     'showallstores': true,
//     'stores': [],
//     'override_price': "auto",
//     'showregionalprice': "mouse",
//     'regional_countries': ["us", "gb", "ru", "br", "au", "jp"],

//     'show_es_homepagetabs': true,
//     'showmarkettotal': false,
//     'showsteamrepapi': true,
//     'showmcus': true,
//     'showoc': true,
//     'showhltb': true,
//     'showyoutube': true,
//     'showtwitch': true,
//     'showpcgw': true,
//     'showcompletionistme': false,
//     'showprotondb': false,
//     'showviewinlibrary': false,
//     'showsteamcardexchange': false,
//     'showitadlinks': true,
//     'showsteamdb': true,
//     'showbartervg': false,
//     'showastatslink': true,
//     'showyoutubegameplay': true,
//     'showyoutubereviews': true,
//     'showwsgf': true,
//     'exfgls': true,

//     'customize_apppage': {
//         "recentupdates": true,
//         "reviews": true,
//         "about": true,
//         "contentwarning": true,
//         "steamchart": true,
//         "steamspy": true,
//         "surveys": true,
//         "sysreq": true,
//         "legal": true,
//         "morelikethis": true,
//         "recommendedbycurators": true,
//         "customerreviews": true
//     },

//     'customize_frontpage': {
//         "featuredrecommended": true,
//         "specialoffers": true,
//         "trendingamongfriends": true,
//         "discoveryqueue": true,
//         "browsesteam": true,
//         "curators": true,
//         "morecuratorrecommendations": true,
//         "recentlyupdated": true,
//         "fromdevelopersandpublishersthatyouknow": true,
//         "popularvrgames": true,
//         "homepagetabs": true,
//         "gamesstreamingnow": true,
//         "under": true,
//         "updatesandoffers": true,
//         "homepagesidebar": true
//     },

//     //'show_keylol_links': false, // not in use, option is commented out
//     'show_package_info': false,
//     'show_steamchart_info': true,
//     'show_steamspy_info': true,
//     'show_early_access': true,
//     'show_alternative_linux_icon': false,
//     'show_itad_button': false,
//     'skip_got_steam': false,

//     'hideaboutlinks': false,
//     'installsteam': "show",
//     'openinnewtab': false,
//     'keepssachecked': false,
//     'showemptywishlist': true,
//     'showusernotes': true,
//     'showwishliststats': true,
//     'user_notes': {},
//     'replaceaccountname': true,
//     'showfakeccwarning': true,
//     'showlanguagewarning': true,
//     'showlanguagewarninglanguage': "english",
//     'homepage_tab_selection': "remember",
//     'homepage_tab_last': null,
//     'send_age_info': true,
//     'mp4video': false,
//     'horizontalscrolling': true,
//     'showsupportinfo': true,
//     'showdrm': true,
//     'regional_hideworld': false,
//     'showinvnav': true,
//     'quickinv': true,
//     'quickinv_diff': -0.01,
//     'community_default_tab': "",
//     'showallachievements': false,
//     'showallstats': true,
//     'showachinstore': true,
//     'showcomparelinks': false,
//     'hideactivelistings': false,
//     'showlowestmarketprice': true,
//     'hidespamcomments': false,
//     'spamcommentregex': "[\\u2500-\\u25FF]",
//     'wlbuttoncommunityapp': true,
//     'removeguideslanguagefilter': false,
//     'disablelinkfilter': false,
//     'showallfriendsthatown': false,
//     'sortfriendsby': "default",
//     'sortreviewsby': "default",
//     'sortgroupsby': "default",
//     'show1clickgoo': true,
//     'show_profile_link_images': "gray",
//     'profile_steamrepcn': true,
//     'profile_steamgifts': true,
//     'profile_steamtrades': true,
//     'profile_bartervg': true,
//     'profile_steamrep': true,
//     'profile_steamdbcalc': true,
//     'profile_astats': true,
//     'profile_backpacktf': true,
//     'profile_astatsnl': true,
//     'profile_steamid': true,
//     'profile_custom_link': [
//         { 'enabled': true, 'name': "Google", 'url': "google.com/search?q=[ID]", 'icon': "www.google.com/images/branding/product/ico/googleg_lodp.ico", },
//     ],
//     'group_steamgifts': true,
//     'steamcardexchange': true,
//     'purchase_dates': true,
//     'show_badge_progress': true,
//     'show_coupon': true,
//     'show_wishlist_link': true,
//     'show_wishlist_count': true,
//     'show_progressbar': true,
//     'show_backtotop': false,

//     'profile_showcase_twitch': true,
//     'profile_showcase_own_twitch': false,
//     'profile_showcase_twitch_profileonly': false,

//     'itad_import_library': false,
//     'itad_import_wishlist': false,
//     'add_to_waitlist': false,

//     'context_steam_store': false,
//     'context_steam_market': false,
//     'context_itad': false,
//     'context_bartervg': false,
//     'context_steamdb': false,
//     'context_steamdb_instant': false,
//     'context_steam_keys': false,
// };


// class ExtensionResources {
//     static getURL(pathname) {
//         return browser.runtime.getURL(pathname);
//     }

//     static get(pathname) {
//         return fetch(ExtensionResources.getURL(pathname));
//     }

//     static getJSON(pathname) {
//         return ExtensionResources.get(pathname).then(r => r.json());
//     }
//     static getText(pathname) {
//         return ExtensionResources.get(pathname).then(r => r.text());
//     }
// }

// /**
//  * DOMPurify setup
//  * @see https://github.com/cure53/DOMPurify
//  */
// (async function() {
//     let allowOpenInNewTab = SyncedStorage.defaults.openinnewtab;
//     try {
//         await SyncedStorage;
//         allowOpenInNewTab = SyncedStorage.get("openinnewtab");
//     } catch(e) {
//         console.error(e);
//     }

//     /**
//      * NOTE FOR ADDON REVIEWER:
//      * We are modifying default DOMPurify settings to allow other protocols in URLs
//      * and to allow links to safely open in new tabs.
//      *
//      * We took the original Regex and aded chrome-extension://, moz-extension:// and steam://
//      * First two are needed for linking local resources from extension,
//      * steam:// protocol is used by Steam store to open their own client (e.g. when you want to launch a game).
//      * 
//      * The addition of the `target` attribute to the allowed attributes is done in order to be able to open links in a new tab.
//      * We only allow target="_blank" while adding rel="noreferrer noopener" to prevent child window to access window.opener
//      * as described in https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/
//      */

//     let purifyConfig = {
//         ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|chrome-extension|moz-extension|steam):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
//     };

//     if (allowOpenInNewTab) {
//         purifyConfig.ADD_ATTR = ["target"];

//         DOMPurify.addHook("uponSanitizeAttribute", (node, data) => {
//             if (data.attrName === "target") {
//                 if (data.attrValue === "_blank") {
//                     node.setAttribute("rel", "noreferrer noopener");
//                 } else {
//                     data.keepAttr = false;
//                 }
//             }
//         });
//     }

//     DOMPurify.setConfig(purifyConfig);
// })();


// class Language {
//     static getCurrentSteamLanguage() {
//         if (this._currentSteamLanguage != null) {
//             return this._currentSteamLanguage;
//         }

//         let nodes = document.querySelectorAll("script[src]");
//         let re = /(?:\?|&(?:amp;)?)l=([^&]+)/;
//         for (let n of nodes) {
//             let src = n.getAttribute("src");
//             let match = src.match(re);
//             if (match) {
//                 this._currentSteamLanguage = match[1];
//                 return this._currentSteamLanguage;
//             }
//         }

//         // In a Content Context, we can check for a cookie
//         if (typeof CookieStorage != 'undefined') {
//             this._currentSteamLanguage = CookieStorage.get("Steam_Language") || null;
//         }

//         return this._currentSteamLanguage;
//     }

//     static getLanguageCode(language) {
//         let code = Language.languages[language];
//         return code ? code : "en";
//     }

//     static isCurrentLanguageOneOf(array) {
//         return array.includes(Language.getCurrentSteamLanguage());
//     }
// }
// Language._currentSteamLanguage = null;
// Language.languages = {
//     "english": "en",
//     "bulgarian": "bg",
//     "czech": "cs",
//     "danish": "da",
//     "dutch": "nl",
//     "finnish": "fi",
//     "french": "fr",
//     "greek": "el",
//     "german": "de",
//     "hungarian": "hu",
//     "italian": "it",
//     "japanese": "ja",
//     "koreana": "ko",
//     "norwegian": "no",
//     "polish": "pl",
//     "portuguese": "pt-PT",
//     "brazilian": "pt-BR",
//     "russian": "ru",
//     "romanian": "ro",
//     "schinese": "zh-CN",
//     "spanish": "es-ES",
//     "latam": "es-419",
//     "swedish": "sv-SE",
//     "tchinese": "zh-TW",
//     "thai": "th",
//     "turkish": "tr",
//     "ukrainian": "ua",
//     "vietnamese": "vi",
// };

  
// class Localization {
//     static loadLocalization(code) {
//         return ExtensionResources.getJSON(`/localization/${code}/strings.json`);
//     }

//     static init() {
//         if (Localization._promise) { return Localization._promise; }

//         let currentSteamLanguage = Language.getCurrentSteamLanguage();
//         let storedSteamLanguage = SyncedStorage.get("language");
//         if (currentSteamLanguage === null) {
//             currentSteamLanguage = storedSteamLanguage;
//         } else {
//             if (currentSteamLanguage !== storedSteamLanguage) {
//                 storedSteamLanguage = currentSteamLanguage;
//                 SyncedStorage.set("language", currentSteamLanguage);
//                 Background.action("clearpurchases");
//             }
//         }

//         function deepAssign(target, source) {
//             // Object.assign() but deep-assigning objects recursively
//             for (let [key, val] of Object.entries(source)) {
//                 if (target[key] === undefined) {
//                     console.warn("The key %s doesn't exist in the English localization file", key);
//                     continue;
//                 }
//                 if (typeof val === "object") {
//                     deepAssign(target[key], val);
//                 } else if (val !== "") {
//                     target[key] = val;
//                 }
//             }
//             return target;
//         }

//         let local = Language.getLanguageCode(currentSteamLanguage);
//         let codes = ["en",];
//         if (local !== null && local !== "en") {
//             codes.push(local);
//         }
//         Localization._promise = Promise.all(
//             codes.map(lc => Localization.loadLocalization(lc))
//         ).then(function([english, local]) {
//             Localization.str = english;
//             if (local) {
//                 deepAssign(Localization.str, local);
//             }
//             return Localization.str;
//         });
//         return Localization._promise;
//     }

//     static then(onDone, onCatch) {
//         return Localization.init().then(onDone, onCatch);
//     }

//     static getString(key) {
//         // Source: http://stackoverflow.com/a/24221895
//         let path = key.split('.').reverse();
//         let current = Localization.str;

//         while (path.length) {
//             if (typeof current !== 'object') {
//                 return undefined;
//             } else {
//                 current = current[path.pop()];
//             }
//         }
//         return current;
//     }
// }
// Localization._promise = null;

// Localization.init();

addNewScript('g_conf_Script', '\
\n\
var gc_multiLanguage = null;\n\
\n\
var g_conf = [\n\
        {steamID: ""\n\
        ,language: "auto_detected" /*语言: 自动检测*/\n\
        ,delay: 4 /*设置你的留言时间间隔,单位秒*/\n\
        ,strNoOperate: "(不留言)" /*设置你的不留言的标识符: 如果不需要留言,则需在备注中添加这个不留言的标识符*/\n\
        ,strRemarkPlaceholder: "{name}" /*设置你的称呼占位符: 同上*/\n\
        \n\
        ,autoLogin: 1 /*没有登录时是否自动跳转到登录页面 (点击确定跳转，点击关闭不跳转)*/\n\
        ,is_Debug: true /*是否是调试模式(总开关，是否显示调试输出，显示当前运行状态)*/\n\
        ,isTrackRunStatus: true /*是否跟踪运行状态(更详细的调试输出，可控型只显示错误警告 到 变量级)*/\n\
        ,isAddYunBreakWarn: true /*是否添加运行中断警告*/\n\
        \n\
        ,YunStatus: false /*当前运行状态(比如正在留言中之类的就是正在运行)*/\n\
        ,isTranslationText: false /*是否进行了翻译*/\n\
        \n\
        ,isWarnInfo: false /*是否出现警告信息(如果没有则不需要清空)*/\n\
        ,isCommentRunStatus: false /*是否正在留言*/\n\
        ,isNationalityRunStatus: false /*是否正在设置国籍*/\n\
        ,isNoCommentRunStatus: false /*是否正在设置不留言*/\n\
        ,isTimeIntervalRunStatus: false /*是否正在设置留言时间间隔*/\n\
        ,isAutoCommentRunStatus: false /*是否正在设置自动留言计划*/\n\
        ,isFriendToGroupRunStatus: false /*是否正在设置好友分组*/\n\
        }\n\
];/* g_conf[0].*/\n\
\n\
\n\
const g_default_configuration = {\n\
        steamID: ""\n\
        ,language: "auto_detected" /*语言: 自动检测*/\n\
        ,delay: 4 /*设置你的留言时间间隔,单位秒*/\n\
        ,strNoOperate: "(不留言)" /*设置你的不留言的标识符: 如果不需要留言,则需在备注中添加这个不留言的标识符*/\n\
        ,strRemarkPlaceholder: "{name}" /*设置你的称呼占位符: 同上*/\n\
        ,autoLogin: 1 /*没有登录时是否自动跳转到登录页面 (点击确定跳转，点击关闭不跳转)*/\n\
        ,isShowQuickNavigationBar: false /*是否显示快速导航栏*/\n\
};\n\
\n\
\n\
const g_debug_info = [\n\
        {\n\
                language: "简体中文"\n\
        },\n\
        {\n\
                language: "English"\n\
        }\n\
];\n\
\n\
/*ui配置相关信息*/\n\
\n\
var g_uiConf = {\n\
        isShowQuickNavigationBar: false /*是否显示快速导航栏*/\n\
        ,isShow_menu_friend: true /*好友列表*/\n\
        ,isShow_menu_activity: true /*动态列表*/\n\
        ,isShow_menu_registerKey: true /*激活key*/\n\
        ,isShow_menu_redeemWalletCode: true /*充值key*/\n\
        ,isShow_menu_steamdbFree: true /*SteamDB预告*/\n\
};/* g_uiConf.*/\n\
\n\
');
/**
 * common.js
 */

//-------------------------------------------------------------------------------------------------------------

/**
 * @summary 使线程进入休眠模式
 * @async
 * @param {UINT} ms 毫秒数
 * @example
 * await sleep(1000); //使当前线程等待1s后继续执行
 */
function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * @summary 判断页面是移动端还是pc端
 * @return {Boolean} 如果是移动端返回true, 如果是pc端返回false
 */
function opinion() {
        if ((navigator.userAgent.match(
                        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
                ))) {
                return true; //移动端
        } else {
                return false; //pc端
        }
}
/**
 * @summary 判断是否是非负整数
 * @param {int} val 待判断的整数
 * @return {Boolean} 是则返回true，否则返回false
 */
function isIntNum(val){ //
    var regPos = /^\d+$/; // 非负整数
    if(regPos.test(val)){
        return true;
    }else{
        return false;
    }
}
/**
 * @summary 解析JSON字符串
 * @param {String} jsonText JSON字符串
 * @return {Object} JSON对象
 */
function JSON_processing_parsing_JsObj(jsonText){ //
        var JSON_jsObj;
        if (jsonText == "")
                return;
        
        //console.log("待处理数据:");
        //console.log(jsonText);
        JSON_jsObj = JSON.parse(jsonText);
        console.log("解析后数据:");
        console.log(JSON_jsObj);
        return JSON_jsObj;
}
/**
 * @summary 添加新的CSS样式
 * @param {String} id 新的<style>标签id, 可用于修改和删除等
 * @param {String} newStyle 待添加的CSS样式字符串
 */
function addNewStyle(id, newStyle) {
        var styleElement = document.getElementById(id);

        if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.type = 'text/css';
                styleElement.id = id;
                document.getElementsByTagName('head')[0].appendChild(styleElement);
        }
        styleElement.appendChild(document.createTextNode(newStyle));
}
/**
 * @summary 添加新的JS脚本
 * @param {String} id 新的<script>标签id, 可用于修改和删除等
 * @param {String} newScript 待添加的JS脚本字符串
 */
function addNewScript(id, newScript) {
        var styleElement = document.getElementById(id);

        if (!styleElement) {
                styleElement = document.createElement('script');
                styleElement.type = 'text/javascript';
                styleElement.id = id;
                document.getElementsByTagName('head')[0].appendChild(styleElement);
        }
        styleElement.appendChild(document.createTextNode(newScript));
}
/**
 * @summary 添加新的JS脚本(拓展)
 * @param {String} id 新的<script>标签id, 可用于修改和删除等
 * @param {String} newScript 待添加的JS脚本字符串
 * @param {String} mode 添加模式(一般来说是<script>标签的格外标识符, 目前有 "async" 和 "defer" )
 */
function addNewScriptEx(id, newScript,mode) {
        var styleElement = document.getElementById(id);
        
        if (!styleElement) {
                styleElement = document.createElement('script');
                styleElement.type = 'text/javascript';
                styleElement.id = id;
                
                if(mode == "async"){
                        styleElement.setAttribute('async');
                }else if(mode == "defer"){
                        styleElement.setAttribute('defer');
                }
                document.getElementsByTagName('head')[0].appendChild(styleElement);
        }
        styleElement.appendChild(document.createTextNode(newScript));
}
/**
 * @summary 添加新的JS模块(实验)
 * @param {String} id 新的<script>标签id, 可用于修改和删除等
 * @param {String} newScript
 */
function addNewModule(id, newScript){
        var styleElement = document.getElementById(id);
        
        if (!styleElement) {
                styleElement = document.createElement('script');
                styleElement.type = 'module';
                styleElement.id = id;
                document.getElementsByTagName('head')[0].appendChild(styleElement);
        }
        styleElement.appendChild(document.createTextNode(newScript));
}
/**
 * 动态加载一个js/css文件, 位于<head>标签最后面新的<script>标签里, 通过src引入指定的url
 * @summary 动态加载一个js/css文件
 * @param {String} filePath 文件路径
 * @param {String} filetype 文件类型
 */
function loadjscssFile(filePath, filetype) {
        if (filetype == "js") {
                var fileref = document.createElement('script')
                fileref.setAttribute("type", "text/javascript")
                fileref.setAttribute("src", filePath)
        } else if (filetype == "css") {
                var fileref = document.createElement("link")
                fileref.setAttribute("rel", "stylesheet")
                fileref.setAttribute("type", "text/css")
                fileref.setAttribute("href", filePath)
        }

        if (typeof fileref != "undefined") {
                document.getElementsByTagName("head")[0].appendChild(fileref); //向元素添加新的子节点，作为最后一个子节点
        }
}
/**
 * 动态加载一个js/css文件(此方法可以添加id和media类型), 位于<head>标签最后面新的<script>标签里, 通过src引入指定的url
 * @summary 动态加载一个js/css文件(拓展)
 * @param {String} filePath  文件路径
 * @param {String} id        节点id
 * @param {String} filetype  文件类型
 */
function loadjscssFile_media(filePath,id, filetype) { //动态加载一个js/css文件
        if (filetype == "js") {
                var fileref = document.createElement('script')
                fileref.setAttribute("type", "text/javascript")
                fileref.setAttribute("src", filePath)
        } else if (filetype == "css") {
                var fileref = document.createElement("link")
                if(id != "" || id != null || id != undefined){
                        fileref.setAttribute("id", id)
                }
                fileref.setAttribute("rel", "stylesheet")
                fileref.setAttribute("type", "text/css")
                fileref.setAttribute("href", filePath)
                fileref.setAttribute("media", "all")
        }

        if (typeof fileref != "undefined") {
                document.getElementsByTagName("head")[0].appendChild(fileref); //向元素添加新的子节点，作为最后一个子节点
        }
}
/**
 * 获取URL对应的资源数据(伪同步, 会阻塞当前线程, 配合 async 和 await 使用)
 * @summary 获取URL对应的资源数据
 * @async
 * @param {String} resourceURL 资源url
 * @param {Boolean} retDataMode 返回的数据方式
 * @return {String} 返回获取到的数据
 */
async function getResourceByURL(resourceURL,retDataMode){
        var retData = null;
        var waitStatus = true;
        
        GM_xmlhttpRequest({
                method: 'GET',
                url: resourceURL,
                headers: {
                        'User-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36',
                        //'Accept': 'application/atom+xml,application/xml,text/xml',
                        //"Content-Type": "application/x-www-form-urlencoded",
                },
                onload: function(response) {
                        if (response.status === 200) {
                                console.log('getResourceByURL()请求成功!');
                                
                                if(retDataMode == true)
                                        retData = response.responseText;
                                else
                                        retData = response;
                                
                                waitStatus = false; //不等待
                        } else {
                                console.log('getResourceByURL()请求失败! 状态码:' + response.status);
                                //console.log(response);
                                //console.log(response.responseText);
                        }
                },
                onerror: function(err) {
                        console.log('getResourceByURL()请求错误!', err);
                        //waitStatus = false; //不等待
                },
                onabort: function(err) {
                        console.log('getResourceByURL()请求被中止!', err);
                        //waitStatus = false; //不等待
                },
                ontimeout: function(err) {
                        console.log('getResourceByURL()请求超时!', err);
                        //waitStatus = false; //不等待
                }
        });
        
        while (waitStatus){ //强制等待异步函数执行完毕后再执行
                console.log("wait...");
                await sleep(100); //延迟0.1秒
        }
        //console.log(retData);
        return retData;
}

async function getResourceByURL_UsabilitTest(resourceURLs,retDataMode,timeouts){
        var retData = null;
        var waitStatus = true;
        
        GM_xmlhttpRequest({
                method: 'GET',
                url: resourceURL,
                headers: {
                        'User-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36',
                        //'Accept': 'application/atom+xml,application/xml,text/xml',
                        //"Content-Type": "application/x-www-form-urlencoded",
                },
                timeout: timeouts,
                onload: function(response) {
                        if (response.status === 200) {
                                console.log('getResourceByURL()请求成功!');
                                
                                if(retDataMode == true)
                                        retData = response.responseText;
                                else
                                        retData = response;
                                
                                waitStatus = false; //不等待
                        } else {
                                console.log('getResourceByURL()请求失败! 状态码:' + response.status);
                                //console.log(response);
                                //console.log(response.responseText);
                        }
                },
                onerror: function(err) {
                        console.log('getResourceByURL()请求错误!', err);
                        //waitStatus = false; //不等待
                },
                onabort: function(err) {
                        console.log('getResourceByURL()请求被中止!', err);
                        //waitStatus = false; //不等待
                },
                ontimeout: function(err) {
                        console.log('getResourceByURL()请求超时!', err);
                        //waitStatus = false; //不等待
                },
        });
        
        while (waitStatus){ //强制等待异步函数执行完毕后再执行
                console.log("wait...");
                await sleep(100); //延迟0.1秒
        }
        //console.log(retData);
        return retData;
}

/**
 * @async
 * @param {String} resourceURL 资源url
 */
async function getResourceByURL_original(resourceURL) {
        var retData;
        var waitStatus = true;
        
        jQuery.ajax({
                type: "Get", //请求方式
                //async: false,
                //contentType: "application/json;charset=UTF-8",//请求的媒体类型
                url: resourceURL, //请求地址
                // headers: {
                //      'User-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36',
                //      //'Accept': 'application/atom+xml,application/xml,text/xml',
                //      //"Content-Type": "application/x-www-form-urlencoded",
                // },
                //data: JSON.stringify(list),                           //数据，json字符串
                success: function(result) { //请求成功
                        retData = result;
                        console.log("请求成功了!",retData);
                        //let nIstart = Data.indexOf('StartTradeOffer(');
                        //let nIend = Data.indexOf(');', nIstart);
                        //let AccountID = Data.slice(nIstart + 'StartTradeOffer('.length + 1, nIend - 1);
                        //nIstart = Data.indexOf('"steamid":"');
                        //nIend = Data.indexOf('",', nIstart);
                        //let profileID = Data.slice(nIstart + '"steamid":"'.length, nIend);
                        //console.log("getgetProfilesID() i:", i, "AccountID:", AccountID, "profileID:", profileID);

                        // for (let i = 0; i < waitStatus1.length; i++) {
                        //      if (waitStatus1[i][0] == profileID) //是否是同一个用户
                        //      {
                        //              if (waitStatus1[i][1] == false) //这个用户是否已经获取过了(测试多个相同用户信息的获取)
                        //                      continue;
                        //              waitStatus1[i][1] = false;
                        //              //returnData1.push(AccountID); //存储数据
                        //              returnData1[i] = AccountID; //存储数据到对应的位置(受网络影响,响应顺序可能会不同)
                        //              //console.log("getgetProfilesID() 成功存储数据 AccountID:",AccountID);
                        //              return;
                        //              //console.log("waitStatus1[i][1] break",i,waitStatus1[i][1]);
                        //      }
                        // }
                        // console.log("getgetProfilesID 数据错误!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                        // console.log("waitStatus1:", waitStatus1, 'returnData1:', returnData1);
                        // console.log('profileID:', profileID, 'AccountID:', AccountID);
                        return;
                        //console.log("DBG!",nIstart,nIend);
                },
                error: function(e) { //请求失败，包含具体的错误信息
                        console.log("请求失败了!", e.status);
                        console.log("请求失败了!", e.responseText);
                }
        });
        //console.log("getgetProfilesID() i:",i,"waitStatus1:",waitStatus1);
        while (waitStatus){ //强制等待异步函数执行完毕后再执行
                console.log("wait...");
                await sleep(50); //延迟0.1秒
        }
        //console.log("waitStatus1[i][1]:",waitStatus1[i][1],"returnData1[i]:",returnData1[i]);
        return retData;

        // jQuery.get(URL, {
        //      // "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        //      // // "Content-Type": "application/x-www-form-urlencoded", //非常重要
        //      // "Accept-Encoding": "gzip, deflate, br",
        //      // "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
        //      // "Cache-Control": "max-age=0",
        //      // "Connection": "keep-alive",
        //      // "Cookie": "sessionid=6f84a0f48cddb56ad66394b6; steamCountry=HK%7Cda7daa2682f7a361e594f8dad55fe9df; timezoneOffset=28800,0",
        //      // "Host": "steamcommunity.com",
        //      // "Upgrade-Insecure-Requests": "1",
        //      'User-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36',
        // }, function(response) {
        //      if (response.status === 200) {
        //              console.log("获取失败!",response.responseText);
        //      } else {
        //              console.log("获取成功!",response.responseText);
        //      }
        // }).fail(function() {
        //      console.log("无法获取!");
        // }).always(function() {
        //      //console.log("当前处理了 " + (i + 1) + "个, 总计 " + total + " 个好友.");
        // });
}
//-------------------------------------------------------------------------------------------------------------
function WriteLog() {
        // eslint-disable-next-line no-console
        console.log('%c[SteamDB]%c', 'color:#2196F3; font-weight:bold;', '', ...arguments);
}
//console.log("%c百度2020校园招聘简历提交：http://dwz.cn/XpoFdepe", "color:red"))
//color:#00a1d6

//-------------------------------------------------------------------------------------------------------------

class Arguments {
        static getArgumentsAllValue(argumentsObj) { //解析函数的参数并进行合并为字符串
                let str = "";
                for (let i = 0; i < argumentsObj.length; i++) {
                        str += argumentsObj[i] + " ";
                }
                return str;
        }
        static getArgumentsAllValue_noFunction(argumentsObj) { //解析函数的参数并进行合并为字符串
                let str = "";
                for (let i = 0; i < argumentsObj.length; i++) {
                        if (typeof argumentsObj[i] == 'function') { //如果是函数则跳过
                                continue;
                        }
                        str += argumentsObj[i] + " ";
                }
                return str;
        }
        static getArgumentsAllValueByDebug(argumentsObj) { //解析函数的参数并进行合并为字符串 //返回数组[track,str]
                let str = "";
                let track = "";
                console.log(arguments);
                //console.log(arguments.callee.name);
                for (let i = 0; i < argumentsObj.length; i++) {
                        if (typeof argumentsObj[i] == 'number') { //如果是数字则转为字符串
                                //argumentsObj[i] = argumentsObj[i].toString();
                                str += argumentsObj[i] + " ";
                                continue;
                        }
                        let s = argumentsObj[i].match(/\s*[A-Za-z\$\_][A-Za-z\$\_\.0-9]+\s*\(/);
                        if (s != null) {
                                if (null != s[0]) { //提取出' 函数名 ('这样的字符串
                                        track = s[0].slice(0, -1); //去掉最后的(，得到函数名
                                        let s1 = argumentsObj[i].replace(/\s*[A-Za-z\$\_][A-Za-z\$\_\.0-9]+\s*\(/, ""); //从字符串中删除函数名，然后剩下的部分
                                        str += s1.slice(1, s1.length) + " "; //去掉最前面的)，得到提示信息
                                        continue;
                                }
                        }
                        str += argumentsObj[i] + " ";
                }
                return [track, str];
        }
}

//-------------------------------------------------------------------------------------------------------------

/**
 * @class
 * @classdesc 用于输出和记录调试信息的类
 * 
 */
class Log {
         /**
          * @constructs 构造方法(模块名称,调试状态) //默认开启调试
          * @param {String} moduleName 模块名称 (当输出调试信息时会在最前面显示出来)
          * @param {Boolean} debugStatus 调试状态
          */
        constructor(moduleName, debugStatus = true) {
                this.m_moduleNamel = moduleName; //设置模块名称
                this.arrlogContent = []; //日志内容(数组)
                g_conf[0].is_Debug = debugStatus; //设置调试状态
        }
        /**
         *  @param {Boolean} debugStatus 调试状态
         */
        setDebugStatus(debugStatus = true) {
                g_conf[0].is_Debug = debugStatus;
        }
        /**
         * 清除控制台输出
         */
        clear() {
                console.clear();
        }
        /**
         * @param {String} mode 释放资源模式
         */
        release(mode){
                this.arrlogContent = [];
        }
        /**
         * 用于对此类进行测试
         * @param {Object} strTestInfo 需要进行测试输出的字符串
         */
        test(strTestInfo) { //用于对Log类进行输出测试
                if (strTestInfo == undefined)
                        strTestInfo = "默认测试内容";
                log.out("模块名称:", this.m_moduleNamel);
                log.out("是否开启调试:", g_conf[0].is_Debug);
                log.debug(strTestInfo);
                log.info(strTestInfo);
                log.warn(strTestInfo);
                log.error(strTestInfo);
                log.fatal(strTestInfo);
        }
        /**
         * @param {Object} strLog 需要直接输出的字符串
         */
        out(strLog) {
                console.log('%c[' + this.m_moduleNamel + ' out]%c' + Arguments.getArgumentsAllValue(arguments),
                        'color:#000000; font-weight:bold;', 'color:#000000;');
        }
        /**
         * 输出Debug等级的日志信息
         * @param {String} $funcName 需要输出的函数名称
         * @param {String} $strDebugInfo 需要输出的字符串
         */
        //伪重载实现，两种版本
        //log.debug("getArgumentsAllValueByDebug() 111");
        //log.debug(getArgumentsAllValueByDebug,"111");
        debug($funcName, $strDebugInfo) {
                //var This = this;
                //debugger;
                let fontStyle =
                        'font-family:-apple-system,BlinkMacSystemFont,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei","Helvetica Neue",Helvetica,Arial,sans-serif;';
                let titleStyle = 'padding: 2px 6px; border-radius: 3px 0 0 3px; background: #606060;color: #fff;' + fontStyle;
                let contentStyle = 'padding: 2px 6px; border-radius: 0 3px 3px 0; background: #1475b2;color: #fff;' + fontStyle;
                let arr;
                if (typeof $funcName == 'function') { //
                        if (g_conf[0].is_Debug) {
                                //debugger;
                                console.log($funcName);
                                $funcName = '.' + $funcName.name;

                                arr = Arguments.getArgumentsAllValue_noFunction(arguments);
                                console.log('%c[' + this.m_moduleNamel + ' Debug-B]%c' + $funcName + '%c' + arr,
                                        'color:#2196F3; font-weight:bold;', titleStyle, contentStyle);
                        }
                } else {
                        if (g_conf[0].is_Debug) {
                                arr = Arguments.getArgumentsAllValueByDebug(arguments);
                                console.log('%c[' + this.m_moduleNamel + ' Debug-A]%c' + arr[0] + '%c' + arr[1],
                                        'color:#2196F3; font-weight:bold;', titleStyle, contentStyle);
                        }
                }
        }
        /**
         * 输出Info等级的日志信息
         * @param {String} $funcName 需要输出的函数名称
         * @param {String} $strDebugInfo 需要输出的字符串
         */
        info($strLogInfo) {
                if (g_conf[0].is_Debug) {
                        let fontStyle =
                                'font-family:-apple-system,BlinkMacSystemFont,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei","Helvetica Neue",Helvetica,Arial,sans-serif;';
                        let titleStyle = 'padding: 2px 6px; border-radius: 3px 0 0 3px; background: #606060;color: #fff;' + fontStyle;
                        let contentStyle = 'padding: 2px 6px; border-radius: 0 3px 3px 0; background: #42c02e;color: #fff;' + fontStyle;
                        let arr = Arguments.getArgumentsAllValueByDebug(arguments);

                        console.log('%c[' + this.m_moduleNamel + ' Info]%c' + arr[0] + '%c' + arr[1], 'color:#00edc3; font-weight:bold;',
                                titleStyle, contentStyle);
                }
        }
        /**
         * 输出Warn等级的日志信息
         * @param {String} $funcName 需要输出的函数名称
         * @param {String} $strDebugInfo 需要输出的字符串
         */
        warn($strWarnInfo) {
                if (g_conf[0].is_Debug) {
                        let fontStyle =
                                'font-family:-apple-system,BlinkMacSystemFont,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei","Helvetica Neue",Helvetica,Arial,sans-serif;';
                        let titleStyle = 'padding: 2px 6px; border-radius: 3px 0 0 3px; background: #606060;color: #fff;' + fontStyle;
                        let contentStyle = 'padding: 2px 6px; border-radius: 0 3px 3px 0; background: #ff7800;color: #fff;' + fontStyle;
                        let arr = Arguments.getArgumentsAllValueByDebug(arguments);

                        console.log('%c[' + this.m_moduleNamel + ' Warn]%c' + arr[0] + '%c' + arr[1], 'color:#ffa800; font-weight:bold;',
                                titleStyle, contentStyle);
                }
        }
        /**
         * 输出Error等级的日志信息
         * @param {String} $funcName 需要输出的函数名称
         * @param {String} $strDebugInfo 需要输出的字符串
         */
        error($strErrInfo) {
                if (g_conf[0].is_Debug) {
                        let fontStyle =
                                'font-family:-apple-system,BlinkMacSystemFont,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei","Helvetica Neue",Helvetica,Arial,sans-serif;';
                        let titleStyle = 'padding: 2px 6px; border-radius: 3px 0 0 3px; background: #606060;color: #fff;' + fontStyle;
                        let contentStyle = 'padding: 2px 6px; border-radius: 0 3px 3px 0; background: #ff00a2;color: #fff;' + fontStyle;
                        let arr = Arguments.getArgumentsAllValueByDebug(arguments);

                        console.trace('%c[' + this.m_moduleNamel + ' Error]%c' + arr[0] + '%c' + arr[1], 'color:#ff00c0; font-weight:bold;',
                                titleStyle, contentStyle);
                }
        }
        /**
         * 输出Fatal等级的日志信息
         * @param {String} $funcName 需要输出的函数名称
         * @param {String} $strDebugInfo 需要输出的字符串
         */
        fatal($strFatalInfo) {
                if (g_conf[0].is_Debug) {
                        let fontStyle =
                                'font-family:-apple-system,BlinkMacSystemFont,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei","Helvetica Neue",Helvetica,Arial,sans-serif;';
                        let titleStyle = 'padding: 2px 6px; border-radius: 0 3px 3px 0; background: #606060;color: #fff;' + fontStyle;
                        let contentStyle = 'padding: 2px 6px; border-radius: 0 3px 3px 0; background: #ff5252;color: #fff;' + fontStyle;
                        let arr = Arguments.getArgumentsAllValueByDebug(arguments);

                        console.trace('%c[' + this.m_moduleNamel + ' Fatal]%c' + arr[0] + '%c' + arr[1], 'color:#ff0000; font-weight:bold;',
                                titleStyle, contentStyle);
                }
        }
}
var log = new Log("Main");
log.info("Test");
//log.test("Arguments.getArgumentsAllValueByDebug() successed!");
//log.debug("Arguments.getArgumentsAllValueByDebug() 111");
//log.debug(Arguments.getArgumentsAllValueByDebug, "111");

// /**
//  */
// function getRuntimeEnviInfo(){
//      var naObj = window.navigator;
//      document.write("浏览器的信息如下: <hr>");
//      for (var i in naObj) {
//              console.log(i + " : <span style='color:blue;'>" + typeof naObj[i] + '</span><br><span style=\'color:red;\'>' + naObj[i] + "</span><br>");
//      }

// /**
//  */
// function getRuntimeEnviInfo(){
//      var naObj = window.navigator;
//      document.write("浏览器的信息如下: <hr>");
//      for (var i in naObj) {
//              document.write(i + " : <span style='color:blue;'>" + typeof naObj[i] + '</span><br><span style=\'color:red;\'>' + naObj[i] + "</span><br>");
//      }


//      function openWin(url,name,width,height){
//              var str = 'width=' + width + ',height=' + height;
//              return window.open(url,name,str);
//      }

//      function closeWin(winObj){
//              return winObj.close();
//      }
// }


// var textNode = '<div style="z-index: 999;position: relative;"><a href="https://www.baidu.com/" target="newWin">百度</a><button id="open">打开窗口</button><button id="close">关闭窗口</button></div>';

// function createNode(template){
//      var start = Date.now();
//      //var tempNode = document.createElement('div');
//      //tempNode.innerHTML = template;
//      //var node = tempNode;
//      var node = document.createRange().createContextualFragment(textNode);
//      console.log(Date.now() - start);
//      return node;
// }
// document.getElementsByTagName('body')[0].appendChild(createNode(textNode));

// document.getElementById('open').onclick = ()=>{
//      openWin('','newWin',320,240);
// };
// document.getElementById('close').onclick = ()=>{
//      closeWin(newWin);
// };

/**
 * 通知类
 * https://developer.mozilla.org/zh-CN/docs/Web/API/notification/Using_Web_Notifications
 */
class Notifications{
        constructor(arg) {
                this.enabled = true; //是否启用通知
                this.defaultWaitTime = 2000; //通知默认等待时间 (x秒后关闭通知)
        }
        init(){
                // 检查浏览器是否支持通知
                if (!("Notification" in window)) {
                        console.log("此浏览器不支持桌面通知!");
                }
                
                // 检查是否已经授予通知权限
                else if (Notification.permission === "granted") {
                        // 如果用户已经同意了通知权限
                        var notification = new Notification("通知已启用.");
                        return true;
                }
                
                // 否则，需要请求用户的许可
                else if (Notification.permission !== 'denied' || Notification.permission === "default") {
                        Notification.requestPermission(function (permission) {
                                // 如果用户许可了，则创建一个通知进行测试
                                if (permission === "granted") {
                                        var notification = new Notification("通知已启用.");
                                        return true;
                                }
                        });
                }
                return false;
        }
        /**
         * 输出一条通知
         * @param {String} strNotifications
         */
        show(strNotifications){
                if(this.enabled){
                        var notification = new Notification(strNotifications);
                }
                
        }
        /**
         * 设置通知状态
         * @param {Boolean} notificationsStatus 通知状态
         */
        setNotificationsStatus(notificationsStatus = true){
                this.enabled = notificationsStatus;
        }
        /**
         * 设置默认等待时间
         * @param {Number} defaultWaitTime 通知默认等待时间 (x秒后关闭通知)
         */
        setNotificationsDefaultWaitTime(defaultWaitTime = 2000){
                this.defaultWaitTime = defaultWaitTime;
        }
}

/**
 * resource.js
 */
 
class resource {
        constructor(arg) {
                
        }
        async init(type){
                if(type) //第一次加载才需要加载资源
                        await this._loadResource(type);  //加载资源
        }
        
        async _loadResource(type){ //加载资源
                if(type) //第一次加载才需要加载基础资源
                        await this._loadBaseResources(); //加载基础资源
        }
        
        async _loadBaseResources(){ //加载基础资源
                let arr = [];
                var arrjsData = new Array(5);
                
                arr.push(new Promise(async function (resolve, reject){
                        if(document.readyState == "loading"){
                                document.addEventListener("DOMContentLoaded", function(event) {
                                        //console.log("DOM fully loaded and parsed");
                                        // if(gc_menu_friends_ui.loadProgress < 9) //资源是否已经加载完毕(已缓存)，如果加载完成则不需要显示加载UI
                                        // {
                                        //      gc_menu_friends_ui.showLoadUI();
                                        //      gc_menu_friends_ui.loadTextChange(true); //改变当前加载进度
                                        //      gc_menu_friends_ui.isDomLoaded = true;
                                        // }
                                        resolve('DOM fully loaded') // 数据处理完成
                                        // reject('失败') // 数据处理出错
                                });
                        }
                        else{ //document.readyState == "interactive" || document.readyState == "complete"
                                resolve('DOM advance loaded(possible)') // 数据处理完成
                        }
                }));
                
                debugger
                
                var resList = getResConfByID("BaseResources"); //通过资源id获取对应的资源列表, 返回资源列表数组 resInfo
                for (let i = 0; i < resList.length; i++) { //遍历所有的资源
                        var resChildList = resList[i].res;
                        for (let j = 0; j < resChildList.length; j++) { //遍历每个资源的res
                                
                                if(resChildList[j].isFight == true){
                                        
                                }
                                else{
                                        switch (resChildList[j].resMode){
                                                case _RESMODE.res_Tampermonkey:
                                                        arr.push(new Promise(async function (resolve, reject){
                                                                var resData = GM_getResourceText(resChildList[j].sourceInfo[0]);
                                                                if(_RESTYPE.res_css == resChildList[j].resType){
                                                                        if(resChildList[j].onSucceed != null && typeof(resChildList[j].onSucceed) === 'function')
                                                                                resData = resChildList[j].onSucceed(resData);
                                                                        addNewStyle(resList[i].resName, resData);
                                                                }
                                                                else if(_RESTYPE.res_js == resChildList[j].resType){
                                                                        if(resChildList[j].onSucceed != null && typeof(resChildList[j].onSucceed) === 'function')
                                                                                resData = resChildList[j].onSucceed(resData);
                                                                        addNewScript(resList[i].resName, resData);
                                                                }
                                                        
                                                                resolve(resList[i].resName) // 数据处理完成
                                                                // reject('失败') // 数据处理出错
                                                        }));
                                                        break;
                                                case _RESMODE.res_CDN:
                                                        arr.push(new Promise(async function (resolve, reject){
                                                                let URLs =  resChildList[j].sourceInfo;
                                                                var resData;
                                                                for (let i = 0; i < URLs.length; i++) {
                                                                        //loadjscssFile("https://www.layuicdn.com/layui-v2.5.6/layui.all.js","js");
                                                                        resData = await getResourceByURL(URLs[i],true); //
                                                                }
                                                                //console.log("数据获取成果",resData);
                                                                if(_RESTYPE.res_css == resChildList[j].resType){
                                                                        if(resChildList[j].onSucceed != null && typeof(resChildList[j].onSucceed) === 'function')
                                                                                resData = resChildList[j].onSucceed(resData);
                                                                        addNewStyle(resList[i].resName, resData);
                                                                }
                                                                else if(_RESTYPE.res_js == resChildList[j].resType){
                                                                        if(resChildList[j].onSucceed != null && typeof(resChildList[j].onSucceed) === 'function')
                                                                                resData = resChildList[j].onSucceed(resData);
                                                                        addNewScript(resList[i].resName, resData);
                                                                }
                                                                
                                                                resolve(resList[i].resName) // 数据处理完成
                                                                // reject('失败') // 数据处理出错
                                                        }));
                                                        break;
                                                case _RESMODE.res_LocalVariables:
                                                        arr.push(new Promise(async function (resolve, reject){
                                                                if(_RESTYPE.res_css == resChildList[j].resType){
                                                                        if(resChildList[j].onSucceed != null && typeof(resChildList[j].onSucceed) === 'function')
                                                                                eval(resChildList[j].sourceInfo[0]) = resChildList[j].onSucceed( eval(resChildList[j].sourceInfo[0]) );
                                                                        addNewStyle(resList[i].resName, eval(resChildList[j].sourceInfo[0]));
                                                                }
                                                                else if(_RESTYPE.res_js == resChildList[j].resType){
                                                                        if(resChildList[j].onSucceed != null && typeof(resChildList[j].onSucceed) === 'function')
                                                                                eval(resChildList[j].sourceInfo[0]) = resChildList[j].onSucceed( eval(resChildList[j].sourceInfo[0]) );
                                                                        addNewScript(resList[i].resName, eval(resChildList[j].sourceInfo[0]));
                                                                }
                                                                resolve(resList[i].resName) // 数据处理完成
                                                                // reject('失败') // 数据处理出错
                                                        }));
                                                        break;
                                                default:
                                                        
                                                        break;
                                        }
                                }
                        }
                }
                
                
                // arr.push(new Promise(async function (resolve, reject){
                //      // //var cssData = await getResourceByURL("https://www.layuicdn.com/layui-v2.5.6/css/layui.css",true);
                //      // //addNewStyle('layui_style',cssData);
                //      // loadjscssFile_media("https://www.layuicdn.com/layui-v2.5.6/css/layui.css",null, "css");
                //      let css = GM_getResourceText('css_layui');
                //      addNewStyle('css_layui',css);
                //      resolve('css_layui') // 数据处理完成
                //      // reject('失败') // 数据处理出错
                // }));
                // arr.push(new Promise(async function (resolve, reject){
                //      // loadjscssFile_media("https://www.layuicdn.com/layui-v2.5.6/css/modules/laydate/default/laydate.css?v=5.0.9", "layuicss-laydate", "css");
                //      let css = GM_getResourceText('css_laydate');
                //      addNewStyle('css_laydate',css);
                //      resolve('css_laydate') // 数据处理完成
                //      // reject('失败') // 数据处理出错
                // }));
                // arr.push(new Promise(async function (resolve, reject){
                //      // loadjscssFile_media("https://www.layuicdn.com/layui-v2.5.6/css/modules/layer/default/layer.css?v=3.1.1", "layuicss-layer", "css");
                //      let css = GM_getResourceText('css_layer');
                //      addNewStyle('css_layer',css);
                //      resolve('css_layer') // 数据处理完成
                //      // reject('失败') // 数据处理出错
                // }));
                // arr.push(new Promise(async function (resolve, reject){
                //      // loadjscssFile_media("https://www.layuicdn.com/layui-v2.5.6/css/modules/code.css", "layuicss-skincodecss", "css");
                //      let css = GM_getResourceText('css_layui_Modules');
                //      addNewStyle('css_layui_Modules',css);
                //      resolve('css_layui_Modules') // 数据处理完成
                //      // reject('失败') // 数据处理出错
                // }));
                // arr.push(new Promise(async function (resolve, reject){
                //      // //font-awesome
                //      // loadjscssFile("https://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css", "css");
                //      let css = GM_getResourceText('css_fontAwesome');
                //      addNewStyle('css_fontAwesome',css);
                //      resolve('css_fontAwesome') // 数据处理完成
                //      // reject('失败') // 数据处理出错
                // }));
                        
                //0.基本环境-加载css
                arr.push(new Promise(function (resolve, reject){
                
                        addNewStyle('styles_js1',
                                "/*layui.css*/\
                                @font-face {\
                                font-family: layui-icon;\
                                src: url(https://www.layuicdn.com/layui-v2.5.6/font/iconfont.eot?v=256);\
                                src: url(https://www.layuicdn.com/layui-v2.5.6/font/iconfont.eot?v=256#iefix) format('embedded-opentype'),url(https://www.layuicdn.com/layui-v2.5.6/font/iconfont.woff2?v=256) format('woff2'),url(https://www.layuicdn.com/layui-v2.5.6/font/iconfont.woff?v=256) format('woff'),url(https://www.layuicdn.com/layui-v2.5.6/font/iconfont.ttf?v=256) format('truetype'),url(https://www.layuicdn.com/layui-v2.5.6/font/iconfont.svg?v=256#layui-icon) format('svg')\
                                }\
                                /*layer.css?v=3.1.1*/\
                                .layui-layer-load {\
                                        background: url(https://www.layuicdn.com/layui-v2.5.6/css/modules/layer/default/loading-1.gif) center center no-repeat #eee\
                                }\
                                \
                                .layui-layer-ico {\
                                        background: url(https://www.layuicdn.com/layui-v2.5.6/css/modules/layer/default/icon.png) no-repeat\
                                }\
                                \
                                .layui-layer-loading .layui-layer-content {\
                                        width: 60px;\
                                        height: 24px;\
                                        background: url(https://www.layuicdn.com/layui-v2.5.6/css/modules/layer/default/loading-0.gif) no-repeat\
                                }\
                                \
                                .layui-layer-loading .layui-layer-loading1 {\
                                        width: 37px;\
                                        height: 37px;\
                                        background: url(https://www.layuicdn.com/layui-v2.5.6/css/modules/layer/default/loading-1.gif) no-repeat\
                                }\
                                \
                                .layui-layer-ico16,.layui-layer-loading .layui-layer-loading2 {\
                                        width: 32px;\
                                        height: 32px;\
                                        background: url(https://www.layuicdn.com/layui-v2.5.6/css/modules/layer/default/loading-2.gif) no-repeat\
                                }\
                                \
                                .layui-layer-iconext {\
                                        background: url(https://www.layuicdn.com/layui-v2.5.6/css/modules/layer/default/icon-ext.png) no-repeat\
                                }\
                                /*font-awesome.min.css*/\
                                @font-face{\
                                        font-family:'FontAwesome';src:url('https://cdn.bootcss.com/font-awesome/4.7.0/fonts/fontawesome-webfont.eot?v=4.7.0');src:url('https://cdn.bootcss.com/font-awesome/4.7.0/fonts/fontawesome-webfont.eot?#iefix&v=4.7.0') format('embedded-opentype'),url('https://cdn.bootcss.com/font-awesome/4.7.0/fonts/fontawesome-webfont.woff2?v=4.7.0') format('woff2'),url('https://cdn.bootcss.com/font-awesome/4.7.0/fonts/fontawesome-webfont.woff?v=4.7.0') format('woff'),url('https://cdn.bootcss.com/font-awesome/4.7.0/fonts/fontawesome-webfont.ttf?v=4.7.0') format('truetype'),url('https://cdn.bootcss.com/font-awesome/4.7.0/fonts/fontawesome-webfont.svg?v=4.7.0#fontawesomeregular') format('svg');font-weight:normal;font-style:normal\
                                }\
                                "
                        ); /* 覆盖layui的css字体加载路径，改为在线资源路径而不是相对路径 */
                
                        //覆盖layui的css
                        addNewStyle('styles_js0',
                                'a {\
                                        color:#ebebeb;\
                                        text-decoration: none;\
                                }\
                                a:hover {\
                                        color: #aaa\
                                }\
                                .layui-form-checkbox[lay-skin=primary] span{\
                                        color: #ebebeb;\
                                }\
                                .layui-checkbox-disbaled[lay-skin=primary] span{\
                                        color: #999;\
                                }\
                                .layui-tab-brief>.layui-tab-title .layui-this {\
                                        color: #01e0cb;\
                                }\
                                '
                        ); /* 覆盖layui的css样式 */
                        //gc_menu_friends_ui.loadTextChange(true); //改变当前加载进度
                        resolve('css') // 数据处理完成
                        // reject('失败') // 数据处理出错
                }));
                
                // //1.基本环境-加载js到页面上，方便调试
                // arr.push(new Promise(async function (resolve, reject){
                //      let js = GM_getResourceText('JS_highstock')
                //      addNewScript('JS_highstock',js);
                //      resolve('JS_highstock') // 数据处理完成
                //      // reject('失败') // 数据处理出错
                // }));
                // arr.push(new Promise(async function (resolve, reject){
                //      let js = GM_getResourceText('JS_highstock_exporting')
                //      addNewScript('JS_highstock_exporting',js);
                //      resolve('JS_highstock_exporting') // 数据处理完成
                //      // reject('失败') // 数据处理出错
                // }));
                // arr.push(new Promise(async function (resolve, reject){
                //      let js = GM_getResourceText('JS_highstock_oldie')
                //      addNewScript('JS_highstock_oldie',js);
                //      resolve('JS_highstock_oldie') // 数据处理完成
                //      // reject('失败') // 数据处理出错
                // }));
                // arr.push(new Promise(async function (resolve, reject){
                //      let js = GM_getResourceText('JS_highstock_networkgraph')
                //      addNewScript('JS_highstock_networkgraph',js);
                //      resolve('JS_highstock_networkgraph') // 数据处理完成
                //      // reject('失败') // 数据处理出错
                // }));
                // arr.push(new Promise(async function (resolve, reject){
                //      let js = GM_getResourceText('JS_highstock_zh_CN')
                //      addNewScript('JS_highstock_zh_CN',js);
                //      resolve('JS_highstock_zh_CN') // 数据处理完成
                //      // reject('失败') // 数据处理出错
                // }));
                // arr.push(new Promise(async function (resolve, reject){
                //      let js = GM_getResourceText('JS_layui');
                //      //对 o.prototype.addcss 打补丁，使其直接return this, 而不是去加载css, css通过脚本欲加载的资源手动添加
                //      var findStr = 'layui.link(n.dir+"css/"+e,t,o)';
                //      var index = js.indexOf(findStr); //查找代补丁代码的位置
                //      var fixJS = js.slice(0,index); //提取 代补丁代码前部分
                //      fixJS += 'this'; //添加 补丁代码
                //      fixJS += js.slice(index+findStr.length); //提取 代补丁代码后部分
                //      addNewScript('JS_layui',fixJS);
                //      resolve('JS_layui') // 数据处理完成
                //      // reject('失败') // 数据处理出错
                // }));
                // arr.push(new Promise(async function (resolve, reject){
                //      let js = GM_getResourceText('JS_localforage');
                //      addNewScript('JS_localforage',js);
                //      resolve('JS_localforage') // 数据处理完成
                //      // reject('失败') // 数据处理出错
                // }));
                
                // arr.push(new Promise(async function (resolve, reject){
                //      //loadjscssFile("https://www.layuicdn.com/layui-v2.5.6/layui.all.js","js");
                //      var jsData = await getResourceByURL("https://www.layuicdn.com/layui-v2.5.6/layui.all.js",true); //
                //      //console.log("数据获取成果",jsData);
                //      addNewScript('layui_Script', jsData);
                //      //console.log("layui_Script success.");
                //      gc_menu_friends_ui.loadTextChange(true); //改变当前加载进度
                //      resolve('layui') // 数据处理完成
                //      // reject('失败') // 数据处理出错
                // }));
                // arr.push(new Promise(async function (resolve, reject){
                //      //loadjscssFile("https://cdnjs.cloudflare.com/ajax/libs/localforage/1.7.3/localforage.min.js","js");
                //      var jsData = await getResourceByURL("https://cdnjs.cloudflare.com/ajax/libs/localforage/1.7.3/localforage.min.js",true);
                //      //console.log("数据获取成果",jsData);
                //      addNewScript('localforage_Script', jsData);
                //      //console.log("localforage_Script success.");
                //      gc_menu_friends_ui.loadTextChange(true); //改变当前加载进度
                //      resolve('localforage') // 数据处理完成
                //      // reject('失败') // 数据处理出错
                // }));
                // arr.push(new Promise(async function (resolve, reject){
                //      //loadjscssFile("https://code.highcharts.com.cn/highstock/highstock.js","js");
                //      var jsData = await getResourceByURL("https://code.highcharts.com.cn/highstock/highstock.js",true);
                //      //console.log("数据获取成果",jsData);
                //      addNewScript('highstock_Script', jsData);
                //      //console.log("highstock_Script success.");
                //      gc_menu_friends_ui.loadTextChange(true); //改变当前加载进度
                //      resolve('highstock') // 数据处理完成
                //      // reject('失败') // 数据处理出错
                // }));
                // arr.push(new Promise(async function (resolve, reject){
                //      //loadjscssFile("https://code.highcharts.com.cn/highcharts/modules/exporting.js","js");
                //      arrjsData[1] = await getResourceByURL("https://code.highcharts.com.cn/highcharts/modules/exporting.js",true);
                //      //console.log("数据获取成果",jsData);
                //      resolve('highcharts exporting') // 数据处理完成
                //      // reject('失败') // 数据处理出错
                // }));
                // arr.push(new Promise(async function (resolve, reject){
                //      //loadjscssFile("https://code.highcharts.com.cn/highcharts/modules/oldie.js","js");
                //      arrjsData[2] = await getResourceByURL("https://code.highcharts.com.cn/highcharts/modules/oldie.js",true);
                //      //console.log("数据获取成果",jsData);
                //      resolve('highcharts oldie') // 数据处理完成
                //      // reject('失败') // 数据处理出错
                // }));
                // arr.push(new Promise(async function (resolve, reject){
                //      //loadjscssFile("https://code.highcharts.com.cn/highcharts/modules/networkgraph.js","js");
                //      arrjsData[3] = await getResourceByURL("https://code.highcharts.com.cn/highcharts/modules/networkgraph.js",true);
                //      //console.log("数据获取成果",jsData);
                //      resolve('highcharts networkgraph') // 数据处理完成
                //      // reject('失败') // 数据处理出错
                // }));
                // arr.push(new Promise(async function (resolve, reject){
                //      //loadjscssFile("https://code.highcharts.com.cn/highcharts-plugins/highcharts-zh_CN.js","js");
                //      arrjsData[4] = await getResourceByURL("https://code.highcharts.com.cn/highcharts-plugins/highcharts-zh_CN.js",true);
                //      //console.log("数据获取成果",jsData);
                //      resolve('highcharts zh_CN') // 数据处理完成
                //      // reject('失败') // 数据处理出错
                // }));
                
                arr.push(new Promise(async function (resolve, reject){
                        addNewStyle('styles_js',
                                '::selection {color:#000;background: #35d5ff;}\
                                        #addFriendToGroup,#unaddFriendToGroup,#setTimeInterval,#unsetTimeInterval,#setNoLeave,#unsetNoLeave,#addCustomName,#translationText,#setNationality,#unsetNationality,#NationalityGroup,#NationalitySortGroup,#OfflineTimeGroup,#ShowFriendData {font-family: "Motiva Sans", Sans-serif;font-weight: 300;\
                                        padding: 2px 5px;border:0;outline:0;border-radius: 2px;color: #67c1f5 !important;background: rgba(0, 0, 0, 0.5 );}\
                                        .persona.offline, a.persona.offline, .persona.offline.a {color:#ccc;}\
                                        .persona, a.persona, .persona a, .friend_status_offline, .friend_status_offline div, .friend_status_offline a {color:#ccc;}\
                                        .player_nickname_hint {color:#ccc;}\
                                        #addFriendToGroup:hover,#unaddFriendToGroup:hover,#setTimeInterval:hover,#unsetTimeInterval:hover,#setNoLeave:hover,#unsetNoLeave:hover,#addCustomName:hover,#translationText:hover,#setNationality:hover,#unsetNationality:hover,#NationalityGroup:hover,#NationalitySortGroup:hover,#OfflineTimeGroup:hover,#ShowFriendData:hover {background-color: #0a6aa1;color: #fff !important;cursor: pointer;}'
                        ); /* 选择的文本 */
                        addNewStyle('styles1_js',fs_css); /* 选择的文本 */
                        
                        injectJS();
                        
                        //gc_menu_friends_ui.loadTextChange(true); //改变当前加载进度
                        resolve('css js') // 数据处理完成
                        // reject('失败') // 数据处理出错
                }));
                
                // arr.push(new Promise(async function (resolve, reject){
                //      addNewStyle('css_jquery_localizationTool',jquery_localizationTool); /* 选择的文本 */
                        
                //      let js = GM_getResourceText('Jquery_localizationtool');
                //      addNewScript('js_jquery_localizationTool',js);
                        
                //      //gc_menu_friends_ui.loadTextChange(true); //改变当前加载进度
                //      resolve('jquery localizationTool') // 数据处理完成
                //      // reject('失败') // 数据处理出错
                // }));
                
                let res = await Promise.all(arr);
                
                // addNewScript('highcharts_exporting_Script', arrjsData[1]);
                // //console.log("highcharts_exporting_Script success.");
                // gc_menu_friends_ui.loadTextChange(true); //改变当前加载进度
                
                // addNewScript('highcharts_oldie_Script', arrjsData[2]);
                // //console.log("highcharts_oldie_Script success.");
                // gc_menu_friends_ui.loadTextChange(true); //改变当前加载进度
                
                // addNewScript('highcharts_networkgraph_Script', arrjsData[3]);
                // //console.log("highcharts_networkgraph_Script success.");
                // gc_menu_friends_ui.loadTextChange(true); //改变当前加载进度
                
                // addNewScript('highcharts_zh_CN_Script', arrjsData[4]);
                // //console.log("highcharts_zh_CN_Script success.");
                // gc_menu_friends_ui.loadTextChange(true); //改变当前加载进度
                
                // if(!gc_menu_friends_ui.remoreLoadUI()){//移除加载UI
                //      console.log("remoreLoadUI() 失败!");
                // }
                console.log("ret:",res);
        }
        
        async _loadDrawResources(){ //加载绘制资源
                let arr = [];
                var arrjsData = new Array(5);
                        
                arr.push(new Promise(async function (resolve, reject){
                        let js = GM_getResourceText('JS_draw');
                        addNewScript('JS_draw',js);
                        resolve('JS_draw') // 数据处理完成
                        // reject('失败') // 数据处理出错
                }));
                arr.push(new Promise(async function (resolve, reject){
                        let js = GM_getResourceText('JS_animate');
                        addNewScript('JS_animate',js);
                        resolve('JS_animate') // 数据处理完成
                        // reject('失败') // 数据处理出错
                }));
                arr.push(new Promise(async function (resolve, reject){
                        let js = GM_getResourceText('JS_sound');
                        addNewScript('JS_sound',js);
                        resolve('JS_sound') // 数据处理完成
                        // reject('失败') // 数据处理出错
                }));
                arr.push(new Promise(async function (resolve, reject){
                        let js = GM_getResourceText('JS_render');
                        addNewScript('JS_render',js);
                        resolve('JS_render') // 数据处理完成
                        // reject('失败') // 数据处理出错
                }));
                arr.push(new Promise(async function (resolve, reject){
                        let js = GM_getResourceText('JS_multithreading');
                        addNewScript('JS_multithreading',js);
                        resolve('JS_multithreading') // 数据处理完成
                        // reject('失败') // 数据处理出错
                }));
                
                let res = await Promise.all(arr);
                
                console.log("ret:",res);
        }
}

var fs_css = '\
.fs-wrap {\n\
        position: relative;\n\
        display: inline-block;\n\
        vertical-align: bottom;\n\
        width: 200px;\n\
        margin: 3px;\n\
        font-size: 12px;\n\
        line-height: 1\n\
}\n\
\n\
.fs-label-wrap {\n\
        position: relative;\n\
        border: 1px solid #34DEFF;\n\
        cursor: default;\n\
        color: #66ccff;\n\
        border-radius: 4px;\n\
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075)\n\
}\n\
\n\
.fs-label-wrap,\n\
.fs-dropdown {\n\
        -webkit-user-select: none;\n\
        -moz-user-select: none;\n\
        -ms-user-select: none;\n\
        user-select: none\n\
}\n\
\n\
.fs-label-wrap .fs-label {\n\
        padding: 4px 22px 4px 8px;\n\
        text-overflow: ellipsis;\n\
        white-space: nowrap;\n\
        overflow: hidden;\n\
        cursor: pointer\n\
}\n\
\n\
.fs-arrow {\n\
        width: 0;\n\
        height: 0;\n\
        border-left: 4px solid transparent;\n\
        border-right: 4px solid transparent;\n\
        border-top: 6px solid #fff;\n\
        position: absolute;\n\
        top: 0;\n\
        right: 4px;\n\
        bottom: 0;\n\
        margin: auto;\n\
        cursor: pointer\n\
}\n\
\n\
.fs-dropdown {\n\
        position: absolute;\n\
        background-color: #3E9AC6;\n\
        border: 1px solid #000;\n\
        width: 100%;\n\
        z-index: 1000;\n\
        border-radius: 4px\n\
}\n\
\n\
.fs-dropdown .fs-options {\n\
        max-height: 200px;\n\
        overflow: auto\n\
}\n\
\n\
.fs-search input {\n\
        width: 90%;\n\
        padding: 2px 4px;\n\
        border: 0\n\
        outline: 0;\n\
}\n\
\n\
.fs-selectAll {\n\
        float: right;\n\
        cursor: pointer;\n\
        margin-top: 4px;\n\
        height: auto\n\
}\n\
\n\
.fs-selectAll.selected {\n\
        float: right;\n\
        cursor: pointer;\n\
        margin-top: 4px;\n\
        height: auto;\n\
        color: green\n\
}\n\
\n\
.fs-selectAll:hover {\n\
        background-color: #35d5ff\n\
}\n\
\n\
.fs-option,\n\
.fs-search,\n\
.fs-optgroup-label {\n\
        padding: 6px 8px;\n\
        border-bottom: 1px solid #eee;\n\
        cursor: default\n\
}\n\
\n\
.fs-option {cursor: pointer}\n\
.fs-option.hl {\n\
        background-color: #f5f5f5\n\
}\n\
\n\
.fs-wrap.multiple .fs-option {\n\
        position: relative;\n\
        padding-left: 30px\n\
}\n\
\n\
.fs-wrap.multiple .fs-checkbox {\n\
        position: absolute;\n\
        display: block;\n\
        width: 30px;\n\
        top: 0;\n\
        left: 0;\n\
        bottom: 0\n\
}\n\
\n\
.fs-wrap.multiple .fs-option .fs-checkbox i {\n\
        position: absolute;\n\
        margin: auto;\n\
        left: 0;\n\
        right: 0;\n\
        top: 0;\n\
        bottom: 0;\n\
        width: 14px;\n\
        height: 14px;\n\
        border: 1px solid #aeaeae;\n\
        border-radius: 4px;\n\
        background-color: #fff\n\
}\n\
\n\
.fs-wrap.multiple .fs-option.selected .fs-checkbox i {\n\
        background-color: #11a911;\n\
        border-color: transparent;\n\
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAGCAYAAAD+Bd/7AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNXG14zYAAABMSURBVAiZfc0xDkAAFIPhd2Kr1WRjcAExuIgzGUTIZ/AkImjSofnbNBAfHvzAHjOKNzhiQ42IDFXCDivaaxAJd0xYshT3QqBxqnxeHvhunpu23xnmAAAAAElFTkSuQmCC);\n\
        background-repeat: no-repeat;\n\
        background-position: center\n\
}\n\
\n\
.fs-wrap .fs-option:hover {\n\
        background: #48E3FF;\n\
        border-radius: 4px;\n\
        margin-left: 2px;\n\
        margin-right: 2px\n\
}\n\
\n\
.fs-optgroup-label {font-weight: 700}\n\
\n\
.hidden {display: none}\n\
\n\
.fs-options::-webkit-scrollbar {width: 6px}\n\
\n\
.fs-options::-webkit-scrollbar-track {\n\
        -webkit-border-radius: 2em;\n\
        -moz-border-radius: 2em;\n\
        border-radius: 2em;\n\
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, .2);\n\
        background: rgba(0, 0, 0, .1)\n\
}\n\
\n\
.fs-options::-webkit-scrollbar-thumb {\n\
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, .2);\n\
        background: rgba(0, 0, 0, .2);\n\
        -webkit-border-radius: 2em;\n\
        -moz-border-radius: 2em;\n\
        border-radius: 2em\n\
}\n\
';

var jquery_localizationTool_css = '\
.flag {\n\
  width: 16px;\n\
  height: 11px;\n\
  background: url(flags.png) no-repeat;\n\
}\n\
.flag.flag-ad {\n\
  background-position: -16px 0;\n\
}\n\
.flag.flag-ae {\n\
  background-position: -32px 0;\n\
}\n\
.flag.flag-af {\n\
  background-position: -48px 0;\n\
}\n\
.flag.flag-ag {\n\
  background-position: -64px 0;\n\
}\n\
.flag.flag-ai {\n\
  background-position: -80px 0;\n\
}\n\
.flag.flag-al {\n\
  background-position: -96px 0;\n\
}\n\
.flag.flag-am {\n\
  background-position: -112px 0;\n\
}\n\
.flag.flag-an {\n\
  background-position: -128px 0;\n\
}\n\
.flag.flag-ao {\n\
  background-position: -144px 0;\n\
}\n\
.flag.flag-ar {\n\
  background-position: -160px 0;\n\
}\n\
.flag.flag-as {\n\
  background-position: -176px 0;\n\
}\n\
.flag.flag-at {\n\
  background-position: -192px 0;\n\
}\n\
.flag.flag-au {\n\
  background-position: -208px 0;\n\
}\n\
.flag.flag-aw {\n\
  background-position: -224px 0;\n\
}\n\
.flag.flag-az {\n\
  background-position: -240px 0;\n\
}\n\
.flag.flag-ba {\n\
  background-position: 0 -11px;\n\
}\n\
.flag.flag-bb {\n\
  background-position: -16px -11px;\n\
}\n\
.flag.flag-bd {\n\
  background-position: -32px -11px;\n\
}\n\
.flag.flag-be {\n\
  background-position: -48px -11px;\n\
}\n\
.flag.flag-bf {\n\
  background-position: -64px -11px;\n\
}\n\
.flag.flag-bg {\n\
  background-position: -80px -11px;\n\
}\n\
.flag.flag-bh {\n\
  background-position: -96px -11px;\n\
}\n\
.flag.flag-bi {\n\
  background-position: -112px -11px;\n\
}\n\
.flag.flag-bj {\n\
  background-position: -128px -11px;\n\
}\n\
.flag.flag-bm {\n\
  background-position: -144px -11px;\n\
}\n\
.flag.flag-bn {\n\
  background-position: -160px -11px;\n\
}\n\
.flag.flag-bo {\n\
  background-position: -176px -11px;\n\
}\n\
.flag.flag-br {\n\
  background-position: -192px -11px;\n\
}\n\
.flag.flag-bs {\n\
  background-position: -208px -11px;\n\
}\n\
.flag.flag-bt {\n\
  background-position: -224px -11px;\n\
}\n\
.flag.flag-bv {\n\
  background-position: -240px -11px;\n\
}\n\
.flag.flag-bw {\n\
  background-position: 0 -22px;\n\
}\n\
.flag.flag-by {\n\
  background-position: -16px -22px;\n\
}\n\
.flag.flag-bz {\n\
  background-position: -32px -22px;\n\
}\n\
.flag.flag-ca {\n\
  background-position: -48px -22px;\n\
}\n\
.flag.flag-catalonia {\n\
  background-position: -64px -22px;\n\
}\n\
.flag.flag-cd {\n\
  background-position: -80px -22px;\n\
}\n\
.flag.flag-cf {\n\
  background-position: -96px -22px;\n\
}\n\
.flag.flag-cg {\n\
  background-position: -112px -22px;\n\
}\n\
.flag.flag-ch {\n\
  background-position: -128px -22px;\n\
}\n\
.flag.flag-ci {\n\
  background-position: -144px -22px;\n\
}\n\
.flag.flag-ck {\n\
  background-position: -160px -22px;\n\
}\n\
.flag.flag-cl {\n\
  background-position: -176px -22px;\n\
}\n\
.flag.flag-cm {\n\
  background-position: -192px -22px;\n\
}\n\
.flag.flag-cn {\n\
  background-position: -208px -22px;\n\
}\n\
.flag.flag-co {\n\
  background-position: -224px -22px;\n\
}\n\
.flag.flag-cr {\n\
  background-position: -240px -22px;\n\
}\n\
.flag.flag-cu {\n\
  background-position: 0 -33px;\n\
}\n\
.flag.flag-cv {\n\
  background-position: -16px -33px;\n\
}\n\
.flag.flag-cw {\n\
  background-position: -32px -33px;\n\
}\n\
.flag.flag-cy {\n\
  background-position: -48px -33px;\n\
}\n\
.flag.flag-cz {\n\
  background-position: -64px -33px;\n\
}\n\
.flag.flag-de {\n\
  background-position: -80px -33px;\n\
}\n\
.flag.flag-dj {\n\
  background-position: -96px -33px;\n\
}\n\
.flag.flag-dk {\n\
  background-position: -112px -33px;\n\
}\n\
.flag.flag-dm {\n\
  background-position: -128px -33px;\n\
}\n\
.flag.flag-do {\n\
  background-position: -144px -33px;\n\
}\n\
.flag.flag-dz {\n\
  background-position: -160px -33px;\n\
}\n\
.flag.flag-ec {\n\
  background-position: -176px -33px;\n\
}\n\
.flag.flag-ee {\n\
  background-position: -192px -33px;\n\
}\n\
.flag.flag-eg {\n\
  background-position: -208px -33px;\n\
}\n\
.flag.flag-eh {\n\
  background-position: -224px -33px;\n\
}\n\
.flag.flag-england {\n\
  background-position: -240px -33px;\n\
}\n\
.flag.flag-er {\n\
  background-position: 0 -44px;\n\
}\n\
.flag.flag-es {\n\
  background-position: -16px -44px;\n\
}\n\
.flag.flag-esperanto {\n\
  background-position: -192px -165px;\n\
}\n\
.flag.flag-et {\n\
  background-position: -32px -44px;\n\
}\n\
.flag.flag-eu {\n\
  background-position: -48px -44px;\n\
}\n\
.flag.flag-fi {\n\
  background-position: -64px -44px;\n\
}\n\
.flag.flag-fj {\n\
  background-position: -80px -44px;\n\
}\n\
.flag.flag-fk {\n\
  background-position: -96px -44px;\n\
}\n\
.flag.flag-fm {\n\
  background-position: -112px -44px;\n\
}\n\
.flag.flag-fo {\n\
  background-position: -128px -44px;\n\
}\n\
.flag.flag-fr {\n\
  background-position: -144px -44px;\n\
}\n\
.flag.flag-ga {\n\
  background-position: -160px -44px;\n\
}\n\
.flag.flag-gb {\n\
  background-position: -176px -44px;\n\
}\n\
.flag.flag-gd {\n\
  background-position: -192px -44px;\n\
}\n\
.flag.flag-ge {\n\
  background-position: -208px -44px;\n\
}\n\
.flag.flag-gf {\n\
  background-position: -224px -44px;\n\
}\n\
.flag.flag-gg {\n\
  background-position: -240px -44px;\n\
}\n\
.flag.flag-gh {\n\
  background-position: 0 -55px;\n\
}\n\
.flag.flag-gi {\n\
  background-position: -16px -55px;\n\
}\n\
.flag.flag-gl {\n\
  background-position: -32px -55px;\n\
}\n\
.flag.flag-gm {\n\
  background-position: -48px -55px;\n\
}\n\
.flag.flag-gn {\n\
  background-position: -64px -55px;\n\
}\n\
.flag.flag-gp {\n\
  background-position: -80px -55px;\n\
}\n\
.flag.flag-gq {\n\
  background-position: -96px -55px;\n\
}\n\
.flag.flag-gr {\n\
  background-position: -112px -55px;\n\
}\n\
.flag.flag-gs {\n\
  background-position: -128px -55px;\n\
}\n\
.flag.flag-gt {\n\
  background-position: -144px -55px;\n\
}\n\
.flag.flag-gu {\n\
  background-position: -160px -55px;\n\
}\n\
.flag.flag-gw {\n\
  background-position: -176px -55px;\n\
}\n\
.flag.flag-gy {\n\
  background-position: -192px -55px;\n\
}\n\
.flag.flag-hk {\n\
  background-position: -208px -55px;\n\
}\n\
.flag.flag-hm {\n\
  background-position: -224px -55px;\n\
}\n\
.flag.flag-hn {\n\
  background-position: -240px -55px;\n\
}\n\
.flag.flag-hr {\n\
  background-position: 0 -66px;\n\
}\n\
.flag.flag-ht {\n\
  background-position: -16px -66px;\n\
}\n\
.flag.flag-hu {\n\
  background-position: -32px -66px;\n\
}\n\
.flag.flag-ic {\n\
  background-position: -48px -66px;\n\
}\n\
.flag.flag-id {\n\
  background-position: -64px -66px;\n\
}\n\
.flag.flag-ie {\n\
  background-position: -80px -66px;\n\
}\n\
.flag.flag-il {\n\
  background-position: -96px -66px;\n\
}\n\
.flag.flag-im {\n\
  background-position: -112px -66px;\n\
}\n\
.flag.flag-in {\n\
  background-position: -128px -66px;\n\
}\n\
.flag.flag-io {\n\
  background-position: -144px -66px;\n\
}\n\
.flag.flag-iq {\n\
  background-position: -160px -66px;\n\
}\n\
.flag.flag-ir {\n\
  background-position: -176px -66px;\n\
}\n\
.flag.flag-is {\n\
  background-position: -192px -66px;\n\
}\n\
.flag.flag-it {\n\
  background-position: -208px -66px;\n\
}\n\
.flag.flag-je {\n\
  background-position: -224px -66px;\n\
}\n\
.flag.flag-jm {\n\
  background-position: -240px -66px;\n\
}\n\
.flag.flag-jo {\n\
  background-position: 0 -77px;\n\
}\n\
.flag.flag-jp {\n\
  background-position: -16px -77px;\n\
}\n\
.flag.flag-ke {\n\
  background-position: -32px -77px;\n\
}\n\
.flag.flag-kg {\n\
  background-position: -48px -77px;\n\
}\n\
.flag.flag-kh {\n\
  background-position: -64px -77px;\n\
}\n\
.flag.flag-ki {\n\
  background-position: -80px -77px;\n\
}\n\
.flag.flag-km {\n\
  background-position: -96px -77px;\n\
}\n\
.flag.flag-kn {\n\
  background-position: -112px -77px;\n\
}\n\
.flag.flag-kp {\n\
  background-position: -128px -77px;\n\
}\n\
.flag.flag-kr {\n\
  background-position: -144px -77px;\n\
}\n\
.flag.flag-kurdistan {\n\
  background-position: -160px -77px;\n\
}\n\
.flag.flag-kw {\n\
  background-position: -176px -77px;\n\
}\n\
.flag.flag-ky {\n\
  background-position: -192px -77px;\n\
}\n\
.flag.flag-kz {\n\
  background-position: -208px -77px;\n\
}\n\
.flag.flag-la {\n\
  background-position: -224px -77px;\n\
}\n\
.flag.flag-lb {\n\
  background-position: -240px -77px;\n\
}\n\
.flag.flag-lc {\n\
  background-position: 0 -88px;\n\
}\n\
.flag.flag-li {\n\
  background-position: -16px -88px;\n\
}\n\
.flag.flag-lk {\n\
  background-position: -32px -88px;\n\
}\n\
.flag.flag-lr {\n\
  background-position: -48px -88px;\n\
}\n\
.flag.flag-ls {\n\
  background-position: -64px -88px;\n\
}\n\
.flag.flag-lt {\n\
  background-position: -80px -88px;\n\
}\n\
.flag.flag-lu {\n\
  background-position: -96px -88px;\n\
}\n\
.flag.flag-lv {\n\
  background-position: -112px -88px;\n\
}\n\
.flag.flag-ly {\n\
  background-position: -128px -88px;\n\
}\n\
.flag.flag-ma {\n\
  background-position: -144px -88px;\n\
}\n\
.flag.flag-mc {\n\
  background-position: -160px -88px;\n\
}\n\
.flag.flag-md {\n\
  background-position: -176px -88px;\n\
}\n\
.flag.flag-me {\n\
  background-position: -192px -88px;\n\
}\n\
.flag.flag-mg {\n\
  background-position: -208px -88px;\n\
}\n\
.flag.flag-mh {\n\
  background-position: -224px -88px;\n\
}\n\
.flag.flag-mk {\n\
  background-position: -240px -88px;\n\
}\n\
.flag.flag-ml {\n\
  background-position: 0 -99px;\n\
}\n\
.flag.flag-mm {\n\
  background-position: -16px -99px;\n\
}\n\
.flag.flag-mn {\n\
  background-position: -32px -99px;\n\
}\n\
.flag.flag-mo {\n\
  background-position: -48px -99px;\n\
}\n\
.flag.flag-mp {\n\
  background-position: -64px -99px;\n\
}\n\
.flag.flag-mq {\n\
  background-position: -80px -99px;\n\
}\n\
.flag.flag-mr {\n\
  background-position: -96px -99px;\n\
}\n\
.flag.flag-ms {\n\
  background-position: -112px -99px;\n\
}\n\
.flag.flag-mt {\n\
  background-position: -128px -99px;\n\
}\n\
.flag.flag-mu {\n\
  background-position: -144px -99px;\n\
}\n\
.flag.flag-mv {\n\
  background-position: -160px -99px;\n\
}\n\
.flag.flag-mw {\n\
  background-position: -176px -99px;\n\
}\n\
.flag.flag-mx {\n\
  background-position: -192px -99px;\n\
}\n\
.flag.flag-my {\n\
  background-position: -208px -99px;\n\
}\n\
.flag.flag-mz {\n\
  background-position: -224px -99px;\n\
}\n\
.flag.flag-na {\n\
  background-position: -240px -99px;\n\
}\n\
.flag.flag-nc {\n\
  background-position: 0 -110px;\n\
}\n\
.flag.flag-ne {\n\
  background-position: -16px -110px;\n\
}\n\
.flag.flag-nf {\n\
  background-position: -32px -110px;\n\
}\n\
.flag.flag-ng {\n\
  background-position: -48px -110px;\n\
}\n\
.flag.flag-ni {\n\
  background-position: -64px -110px;\n\
}\n\
.flag.flag-nl {\n\
  background-position: -80px -110px;\n\
}\n\
.flag.flag-no {\n\
  background-position: -96px -110px;\n\
}\n\
.flag.flag-np {\n\
  background-position: -112px -110px;\n\
}\n\
.flag.flag-nr {\n\
  background-position: -128px -110px;\n\
}\n\
.flag.flag-nu {\n\
  background-position: -144px -110px;\n\
}\n\
.flag.flag-nz {\n\
  background-position: -160px -110px;\n\
}\n\
.flag.flag-om {\n\
  background-position: -176px -110px;\n\
}\n\
.flag.flag-pa {\n\
  background-position: -192px -110px;\n\
}\n\
.flag.flag-pe {\n\
  background-position: -208px -110px;\n\
}\n\
.flag.flag-pf {\n\
  background-position: -224px -110px;\n\
}\n\
.flag.flag-pg {\n\
  background-position: -240px -110px;\n\
}\n\
.flag.flag-ph {\n\
  background-position: 0 -121px;\n\
}\n\
.flag.flag-pk {\n\
  background-position: -16px -121px;\n\
}\n\
.flag.flag-pl {\n\
  background-position: -32px -121px;\n\
}\n\
.flag.flag-pm {\n\
  background-position: -48px -121px;\n\
}\n\
.flag.flag-pn {\n\
  background-position: -64px -121px;\n\
}\n\
.flag.flag-pr {\n\
  background-position: -80px -121px;\n\
}\n\
.flag.flag-ps {\n\
  background-position: -96px -121px;\n\
}\n\
.flag.flag-pt {\n\
  background-position: -112px -121px;\n\
}\n\
.flag.flag-pw {\n\
  background-position: -128px -121px;\n\
}\n\
.flag.flag-py {\n\
  background-position: -144px -121px;\n\
}\n\
.flag.flag-qa {\n\
  background-position: -160px -121px;\n\
}\n\
.flag.flag-re {\n\
  background-position: -176px -121px;\n\
}\n\
.flag.flag-ro {\n\
  background-position: -192px -121px;\n\
}\n\
.flag.flag-rs {\n\
  background-position: -208px -121px;\n\
}\n\
.flag.flag-ru {\n\
  background-position: -224px -121px;\n\
}\n\
.flag.flag-rw {\n\
  background-position: -240px -121px;\n\
}\n\
.flag.flag-sa {\n\
  background-position: 0 -132px;\n\
}\n\
.flag.flag-sb {\n\
  background-position: -16px -132px;\n\
}\n\
.flag.flag-sc {\n\
  background-position: -32px -132px;\n\
}\n\
.flag.flag-scotland {\n\
  background-position: -48px -132px;\n\
}\n\
.flag.flag-sd {\n\
  background-position: -64px -132px;\n\
}\n\
.flag.flag-se {\n\
  background-position: -80px -132px;\n\
}\n\
.flag.flag-sg {\n\
  background-position: -96px -132px;\n\
}\n\
.flag.flag-sh {\n\
  background-position: -112px -132px;\n\
}\n\
.flag.flag-si {\n\
  background-position: -128px -132px;\n\
}\n\
.flag.flag-sk {\n\
  background-position: -144px -132px;\n\
}\n\
.flag.flag-sl {\n\
  background-position: -160px -132px;\n\
}\n\
.flag.flag-sm {\n\
  background-position: -176px -132px;\n\
}\n\
.flag.flag-sn {\n\
  background-position: -192px -132px;\n\
}\n\
.flag.flag-so {\n\
  background-position: -208px -132px;\n\
}\n\
.flag.flag-somaliland {\n\
  background-position: -224px -132px;\n\
}\n\
.flag.flag-sr {\n\
  background-position: -240px -132px;\n\
}\n\
.flag.flag-ss {\n\
  background-position: 0 -143px;\n\
}\n\
.flag.flag-st {\n\
  background-position: -16px -143px;\n\
}\n\
.flag.flag-sv {\n\
  background-position: -32px -143px;\n\
}\n\
.flag.flag-sx {\n\
  background-position: -48px -143px;\n\
}\n\
.flag.flag-sy {\n\
  background-position: -64px -143px;\n\
}\n\
.flag.flag-sz {\n\
  background-position: -80px -143px;\n\
}\n\
.flag.flag-tc {\n\
  background-position: -96px -143px;\n\
}\n\
.flag.flag-td {\n\
  background-position: -112px -143px;\n\
}\n\
.flag.flag-tf {\n\
  background-position: -128px -143px;\n\
}\n\
.flag.flag-tg {\n\
  background-position: -144px -143px;\n\
}\n\
.flag.flag-th {\n\
  background-position: -160px -143px;\n\
}\n\
.flag.flag-tj {\n\
  background-position: -176px -143px;\n\
}\n\
.flag.flag-tk {\n\
  background-position: -192px -143px;\n\
}\n\
.flag.flag-tl {\n\
  background-position: -208px -143px;\n\
}\n\
.flag.flag-tm {\n\
  background-position: -224px -143px;\n\
}\n\
.flag.flag-tn {\n\
  background-position: -240px -143px;\n\
}\n\
.flag.flag-to {\n\
  background-position: 0 -154px;\n\
}\n\
.flag.flag-tr {\n\
  background-position: -16px -154px;\n\
}\n\
.flag.flag-tt {\n\
  background-position: -32px -154px;\n\
}\n\
.flag.flag-tv {\n\
  background-position: -48px -154px;\n\
}\n\
.flag.flag-tw {\n\
  background-position: -64px -154px;\n\
}\n\
.flag.flag-tz {\n\
  background-position: -80px -154px;\n\
}\n\
.flag.flag-ua {\n\
  background-position: -96px -154px;\n\
}\n\
.flag.flag-ug {\n\
  background-position: -112px -154px;\n\
}\n\
.flag.flag-um {\n\
  background-position: -128px -154px;\n\
}\n\
.flag.flag-us {\n\
  background-position: -144px -154px;\n\
}\n\
.flag.flag-uy {\n\
  background-position: -160px -154px;\n\
}\n\
.flag.flag-uz {\n\
  background-position: -176px -154px;\n\
}\n\
.flag.flag-va {\n\
  background-position: -192px -154px;\n\
}\n\
.flag.flag-vc {\n\
  background-position: -208px -154px;\n\
}\n\
.flag.flag-ve {\n\
  background-position: -224px -154px;\n\
}\n\
.flag.flag-vg {\n\
  background-position: -240px -154px;\n\
}\n\
.flag.flag-vi {\n\
  background-position: 0 -165px;\n\
}\n\
.flag.flag-vn {\n\
  background-position: -16px -165px;\n\
}\n\
.flag.flag-vu {\n\
  background-position: -32px -165px;\n\
}\n\
.flag.flag-wales {\n\
  background-position: -48px -165px;\n\
}\n\
.flag.flag-wf {\n\
  background-position: -64px -165px;\n\
}\n\
.flag.flag-ws {\n\
  background-position: -80px -165px;\n\
}\n\
.flag.flag-ye {\n\
  background-position: -96px -165px;\n\
}\n\
.flag.flag-yt {\n\
  background-position: -112px -165px;\n\
}\n\
.flag.flag-za {\n\
  background-position: -128px -165px;\n\
}\n\
.flag.flag-zanzibar {\n\
  background-position: -144px -165px;\n\
}\n\
.flag.flag-zm {\n\
  background-position: -160px -165px;\n\
}\n\
.flag.flag-zw {\n\
  background-position: -176px -165px;\n\
}\n\
.localizationTool:hover {\n\
  cursor: pointer;\n\
  cursor: hand;\n\
}\n\
.localizationTool.ltool-is-visible ul {\n\
  display: block;\n\
  float: left;\n\
  position: absolute;\n\
  width: 100%;\n\
  list-style-type: none;\n\
}\n\
.localizationTool.ltool-is-visible .ltool-dropdown-label-arrow {\n\
  /* the arrow */\n\
\n\
  content: "";\n\
  display: block;\n\
  width: 0;\n\
  height: 0;\n\
  border-top: 10px solid transparent;\n\
  border-left: 10px solid transparent;\n\
  border-bottom: 10px solid #deedf7;\n\
  border-right: 10px solid transparent;\n\
  position: absolute;\n\
  right: 8px;\n\
  top: 7px;\n\
}\n\
.localizationTool {\n\
  color: #333333;\n\
  /* background: #8dc1e2; */\n\
  background: #009688;\n\
  position: relative;\n\
}\n\
.localizationTool .ltool-dropdown-label {\n\
  display: block;\n\
  padding: 12px 0 12px 12px;\n\
  color: #FFF;\n\
  border: 0;\n\
  position: relative;\n\
}\n\
.localizationTool .ltool-dropdown-label img,\n\
.localizationTool .ltool-dropdown-label .ltool-language-flag {\n\
  margin-left: 0;\n\
}\n\
.localizationTool .ltool-dropdown-label .ltool-language-name {\n\
  color: #deedf7;\n\
}\n\
.localizationTool .ltool-dropdown-label-arrow {\n\
  /* the arrow */\n\
\n\
  content: "";\n\
  display: block;\n\
  width: 0;\n\
  height: 0;\n\
  border-top: 10px solid #deedf7;\n\
  border-left: 10px solid transparent;\n\
  border-bottom: 10px solid transparent;\n\
  border-right: 10px solid transparent;\n\
  position: absolute;\n\
  right: 8px;\n\
  top: 17px;\n\
}\n\
.localizationTool img,\n\
.localizationTool div {\n\
  display: inline;\n\
}\n\
.localizationTool li {\n\
  display: block;\n\
  /* background: #deedf7; */\n\
  background: #009688;\n\
  padding: 5px;\n\
}\n\
.localizationTool li.ltool-is-selected {\n\
  /* background: #f5f1d6; */\n\
  background: #148B7E;\n\
}\n\
.localizationTool li:hover {\n\
  /* background: #f5f1d6; */\n\
  background: #148B7E;\n\
  outline: 0;\n\
  -webkit-appearance: none;\n\
  transition: all .3s;\n\
  -webkit-transition: all .3s;\n\
  box-sizing: border-box;\n\
}\n\
.localizationTool img {\n\
  width: 16px;\n\
  height: 11px;\n\
}\n\
.localizationTool .ltool-language-name {\n\
  /* color: #8dc1e2; */\n\
  color: #ebebeb;\n\
}\n\
.localizationTool .ltool-language-flag {\n\
  display: block;\n\
  float: left;\n\
  margin-top: 3px;\n\
}\n\
.localizationTool .ltool-language-flag,\n\
.localizationTool .ltool-language-countryname {\n\
  margin-left: 8px;\n\
}\n\
.localizationTool ul {\n\
  margin: 0;\n\
  padding: 0;\n\
  display: none;\n\
}\n\
';

var loadUI_css = '\
position: absolute;\n\
left: 0; right: 0; top: 0;\n\
z-index: 10;\n\
background: url(https://steamcommunity-a.akamaihd.net/public/images/friends/colored_body_top2.png?v=2) center top no-repeat #1b2838;\n\
';

var load_cssCode = '\
@charset "utf-8";\n\
@import url("https://fonts.googleapis.com/css?family=Fredoka+One|Open+Sans:300");\n\
*,\n\
*::before,\n\
*::after {\n\
        box-sizing: border-box;\n\
}\n\
\n\
body {\n\
        font-family: "Fredoka One", cursive;\n\
        font-size: 16px;\n\
        margin: 0px;\n\
}\n\
\n\
#loadingUI {\n\
        display: -webkit-box;\n\
        display: -ms-flexbox;\n\
        display: flex;\n\
        -webkit-box-pack: center;\n\
        -ms-flex-pack: center;\n\
        justify-content: center;\n\
        -webkit-box-align: center;\n\
        -ms-flex-align: center;\n\
        align-items: center;\n\
        min-height: 100vh;\n\
        /* background: rgba(249, 249, 249, 0.9); */\n\
        overflow: hidden;\n\
}\n\
\n\
.text-wrapper {\n\
        padding: 0 1rem;\n\
        max-width: 50rem;\n\
        width: 100%;\n\
        text-align: center;\n\
}\n\
\n\
.text {\n\
        font-size: 8em;\n\
        text-transform: uppercase;\n\
        letter-spacing: -14px;\n\
}\n\
\n\
.text .letter {\n\
        position: relative;\n\
        display: inline-block;\n\
        -webkit-transition: all .4s;\n\
        transition: all .4s;\n\
}\n\
\n\
.text .letter .character {\n\
        opacity: 0.65;\n\
        -webkit-transition: color .4s;\n\
        transition: color .4s;\n\
        cursor: pointer;\n\
}\n\
\n\
.text .letter span {\n\
        position: absolute;\n\
        bottom: .8rem;\n\
        left: .4rem;\n\
        display: block;\n\
        width: 100%;\n\
        height: 15px;\n\
}\n\
\n\
.text .letter span::before {\n\
        content: "";\n\
        position: absolute;\n\
        top: 50%;\n\
        left: 50%;\n\
        width: 0;\n\
        height: 0;\n\
        -webkit-transform: translate(-50%, -50%);\n\
        transform: translate(-50%, -50%);\n\
        border-radius: 50%;\n\
        background: rgba(0, 0, 0, 0.25);\n\
}\n\
\n\
.text .letter:hover .character {\n\
        color: #fff !important;\n\
}\n\
\n\
.text.part1 .letter:nth-child(1).poofed {\n\
        -webkit-transform-origin: 50% 50%;\n\
        transform-origin: 50% 50%;\n\
        -webkit-animation: poofing1 1.4s ease-i\n-out infinite alternate;\n\
        animation: poofing1 1.4s ease-in-out infinite alternate;\n\
}\n\
\n\
@-webkit-keyframes poofing1 {\n\
        0% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
        }\n\
        50% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        56% {\n\
                -webkit-transform: rotateZ(459deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(459deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        100% {\n\
                -webkit-transform: rotateZ(459deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
                transform: rotateZ(459deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
        }\n\
}\n\
\n\
@keyframes poofing1 {\n\
        0% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
        }\n\
        50% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        56% {\n\
                -webkit-transform: rotateZ(459deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(459deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        100% {\n\
                -webkit-transform: rotateZ(459deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
                transform: rotateZ(459deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
        }\n\
}\n\
\n\
.text.part1 .letter:nth-child(1) .character {\n\
        color: #f44336;\n\
        -webkit-animation: wave 1.2s linear infinite;\n\
        animation: wave 1.2s linear infinite;\n\
        -webkit-animation-delay: 0.33333s;\n\
        animation-delay: 0.33333s;\n\
}\n\
\n\
.text.part1 .letter:nth-child(1) span::before {\n\
        -webkit-animation: shadow 1.2s linear infinite;\n\
        animation: shadow 1.2s linear infinite;\n\
        -webkit-animation-delay: 0.33333s;\n\
        animation-delay: 0.33333s;\n\
}\n\
\n\
.text.part1 .letter:nth-child(2).poofed {\n\
        -webkit-transform-origin: 50% 50%;\n\
        transform-origin: 50% 50%;\n\
        -webkit-animation: poofing2 1.4s ease-in-out infinite alternate;\n\
        animation: poofing2 1.4s ease-in-out infinite alternate;\n\
}\n\
\n\
@-webkit-keyframes poofing2 {\n\
        0% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
        }\n\
        50% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        56% {\n\
                -webkit-transform: rotateZ(540deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(540deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        100% {\n\
                -webkit-transform: rotateZ(540deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
                transform: rotateZ(540deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
        }\n\
}\n\
\n\
@keyframes poofing2 {\n\
        0% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
        }\n\
        50% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        56% {\n\
                -webkit-transform: rotateZ(540deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(540deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        100% {\n\
                -webkit-transform: rotateZ(540deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
                transform: rotateZ(540deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
        }\n\
}\n\
\n\
.text.part1 .letter:nth-child(2) .character {\n\
        color: #9C27B0;\n\
        -webkit-animation: wave 1.2s linear infinite;\n\
        animation: wave 1.2s linear infinite;\n\
        -webkit-animation-delay: 0.66667s;\n\
        animation-delay: 0.66667s;\n\
}\n\
\n\
.text.part1 .letter:nth-child(2) span::before {\n\
        -webkit-animation: shadow 1.2s linear infinite;\n\
        animation: shadow 1.2s linear infinite;\n\
        -webkit-animation-delay: 0.66667s;\n\
        animation-delay: 0.66667s;\n\
}\n\
\n\
.text.part1 .letter:nth-child(3).poofed {\n\
        -webkit-transform-origin: 50% 50%;\n\
        transform-origin: 50% 50%;\n\
        -webkit-animation: poofing3 1.4s ease-in-out infinite alternate;\n\
        animation: poofing3 1.4s ease-in-out infinite alternate;\n\
}\n\
\n\
@-webkit-keyframes poofing3 {\n\
        0% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
        }\n\
        50% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        56% {\n\
                -webkit-transform: rotateZ(264deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(264deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        100% {\n\
                -webkit-transform: rotateZ(264deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
                transform: rotateZ(264deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
        }\n\
}\n\
\n\
@keyframes poofing3 {\n\
        0% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
        }\n\
        50% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        56% {\n\
                -webkit-transform: rotateZ(264deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(264deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        100% {\n\
                -webkit-transform: rotateZ(264deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
                transform: rotateZ(264deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
        }\n\
}\n\
\n\
.text.part1 .letter:nth-child(3) .character {\n\
        color: #f99b0c;\n\
        -webkit-animation: wave 1.2s linear infinite;\n\
        animation: wave 1.2s linear infinite;\n\
        -webkit-animation-delay: 1s;\n\
        animation-delay: 1s;\n\
}\n\
\n\
.text.part1 .letter:nth-child(3) span::before {\n\
        -webkit-animation: shadow 1.2s linear infinite;\n\
        animation: shadow 1.2s linear infinite;\n\
        -webkit-animation-delay: 1s;\n\
        animation-delay: 1s;\n\
}\n\
\n\
.text.part1 .letter:nth-child(4).poofed {\n\
        -webkit-transform-origin: 50% 50%;\n\
        transform-origin: 50% 50%;\n\
        -webkit-animation: poofing4 1.4s ease-in-out infinite alternate;\n\
        animation: poofing4 1.4s ease-in-out infinite alternate;\n\
}\n\
\n\
@-webkit-keyframes poofing4 {\n\
        0% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
        }\n\
        50% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        56% {\n\
                -webkit-transform: rotateZ(42deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(42deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        100% {\n\
                -webkit-transform: rotateZ(42deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
                transform: rotateZ(42deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
        }\n\
}\n\
\n\
@keyframes poofing4 {\n\
        0% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
        }\n\
        50% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        56% {\n\
                -webkit-transform: rotateZ(42deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(42deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        100% {\n\
                -webkit-transform: rotateZ(42deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
                transform: rotateZ(42deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
        }\n\
}\n\
\n\
.text.part1 .letter:nth-child(4) .character {\n\
        color: #cee007;\n\
        -webkit-animation: wave 1.2s linear infinite;\n\
        animation: wave 1.2s linear infinite;\n\
        -webkit-animation-delay: 1.33333s;\n\
        animation-delay: 1.33333s;\n\
}\n\
\n\
.text.part1 .letter:nth-child(4) span::before {\n\
        -webkit-animation: shadow 1.2s linear infinite;\n\
        animation: shadow 1.2s linear infinite;\n\
        -webkit-animation-delay: 1.33333s;\n\
        animation-delay: 1.33333s;\n\
}\n\
\n\
.text.part1 .letter:nth-child(5).poofed {\n\
        -webkit-transform-origin: 50% 50%;\n\
        transform-origin: 50% 50%;\n\
        -webkit-animation: poofing5 1.4s ease-in-out infinite alternate;\n\
        animation: poofing5 1.4s ease-in-out infinite alternate;\n\
}\n\
\n\
@-webkit-keyframes poofing5 {\n\
        0% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
        }\n\
        50% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        56% {\n\
                -webkit-transform: rotateZ(384deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(384deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        100% {\n\
                -webkit-transform: rotateZ(384deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
                transform: rotateZ(384deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
        }\n\
}\n\
\n\
@keyframes poofing5 {\n\
        0% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
        }\n\
        50% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        56% {\n\
                -webkit-transform: rotateZ(384deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(384deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        100% {\n\
                -webkit-transform: rotateZ(384deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
                transform: rotateZ(384deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
        }\n\
}\n\
\n\
.text.part1 .letter:nth-child(5) .character {\n\
        color: #00c6b2;\n\
        -webkit-animation: wave 1.2s linear infinite;\n\
        animation: wave 1.2s linear infinite;\n\
        -webkit-animation-delay: 1.66667s\n\
        animation-delay: 1.66667s;\n\
}\n\
\n\
.text.part1 .letter:nth-child(5) span::before {\n\
        -webkit-animation: shadow 1.2s linear infinite;\n\
        animation: shadow 1.2s linear infinite;\n\
        -webkit-animation-delay: 1.66667s;\n\
        animation-delay: 1.66667s;\n\
}\n\
\n\
.text.part1 .letter:nth-child(6).poofed {\n\
        -webkit-transform-origin: 50% 50%;\n\
        transform-origin: 50% 50%;\n\
        -webkit-animation: poofing6 1.4s ease-in-out infinite alternate;\n\
        animation: poofing6 1.4s ease-in-out infinite alternate;\n\
}\n\
\n\
@-webkit-keyframes poofing6 {\n\
        0% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
        }\n\
        50% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        56% {\n\
                -webkit-transform: rotateZ(156deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(156deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        100% {\n\
                -webkit-transform: rotateZ(156deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
                transform: rotateZ(156deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
        }\n\
}\n\
\n\
@keyframes poofing6 {\n\
        0% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
        }\n\
        50% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        56% {\n\
                -webkit-transform: rotateZ(156deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(156deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        100% {\n\
                -webkit-transform: rotateZ(156deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
                transform: rotateZ(156deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
        }\n\
}\n\
\n\
.text.part1 .letter:nth-child(6) .character {\n\
        color: #f44336;\n\
        -webkit-animation: wave 1.2s linear infinite;\n\
        animation: wave 1.2s linear infinite;\n\
        -webkit-animation-delay: 2s;\n\
        animation-delay: 2s;\n\
}\n\
\n\
.text.part1 .letter:nth-child(6) span::before {\n\
        -webkit-animation: shadow 1.2s linear infinite;\n\
        animation: shadow 1.2s linear infinite;\n\
        -webkit-animation-delay: 2s;\n\
        animation-delay: 2s;\n\
}\n\
\n\
.text.part1 .letter:nth-child(7).poofed {\n\
        -webkit-transform-origin: 50% 50%;\n\
        transform-origin: 50% 50%;\n\
        -webkit-animation: poofing7 1.4s ease-in-out infinite alternate;\n\
        animation: poofing7 1.4s ease-in-out infinite alternate;\n\
}\n\
\n\
@-webkit-keyframes poofing7 {\n\
        0% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
        }\n\
        50% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        56% {\n\
                -webkit-transform: rotateZ(156deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(156deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        100% {\n\
                -webkit-transform: rotateZ(156deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
                transform: rotateZ(156deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
        }\n\
}\n\
\n\
@keyframes poofing7 {\n\
        0% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
        }\n\
        50% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        56% {\n\
                -webkit-transform: rotateZ(156deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(156deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        100% {\n\
                -webkit-transform: rotateZ(156deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
                transform: rotateZ(156deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
        }\n\
}\n\
\n\
.text.part1 .letter:nth-child(7) .character {\n\
        color: #4CAF50;\n\
        -webkit-animation: wave 1.2s linear infinite;\n\
        animation: wave 1.2s linear infinite;\n\
        -webkit-animation-delay: 2s;\n\
        animation-delay: 2.5s;\n\
}\n\
\n\
.text.part1 .letter:nth-child(7) span::before {\n\
        -webkit-animation: shadow 1.2s linear infinite;\n\
        animation: shadow 1.2s linear infinite;\n\
        -webkit-animation-delay: 2s;\n\
        animation-delay: 3s;\n\
}\n\
\n\
.text.part2 span:nth-child(1).poofed {\n\
        -webkit-animation: sec_poofing1 1.4s ease-in-out infinite alternate;\n\
        animation: sec_poofing1 1.4s ease-in-out infinite alternate;\n\
}\n\
\n\
@-webkit-keyframes sec_poofing1 {\n\
        0% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
        }\n\
        50% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        56% {\n\
                -webkit-transform: rotateZ(268deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(268deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        100% {\n\
                -webkit-transform: rotateZ(268deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
                transform: rotateZ(268deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
        }\n\
}\n\
\n\
@keyframes sec_poofing1 {\n\
        0% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
        }\n\
        50% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        56% {\n\
                -webkit-transform: rotateZ(268deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(268deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        100% {\n\
                -webkit-transform: rotateZ(268deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
                transform: rotateZ(268deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
        }\n\
}\n\
\n\
.text.part2 span:nth-child(1) .character {\n\
        color: #ff5a5f;\n\
        -webkit-animation: wave 1.2s linear infinite;\n\
        animation: wave 1.2s linear infinite;\n\
        -webkit-animation-delay: 2.33333s;\n\
        animation-delay: 2.33333s;\n\
}\n\
\n\
.text.part2 span:nth-child(1) span::before {\n\
        -webkit-animation: shadow 1.2s linear infinite;\n\
        animation: shadow 1.2s linear infinite;\n\
        -webkit-animation-delay: 2.33333s;\n\
        animation-delay: 2.33333s;\n\
}\n\
\n\
.text.part2 span:nth-child(2).poofed {\n\
        -webkit-animation: sec_poofing2 1.4s ease-in-out infinite alternate;\n\
        animation: sec_poofing2 1.4s ease-in-out infinite alternate;\n\
}\n\
\n\
@-webkit-keyframes sec_poofing2 {\n\
        0% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
        }\n\
        50% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        56% {\n\
                -webkit-transform: rotateZ(135deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(135deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        100% {\n\
                -webkit-transform: rotateZ(135deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
                transform: rotateZ(135deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
        }\n\
}\n\
\n\
@keyframes sec_poofing2 {\n\
        0% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
        }\n\
        50% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        56% {\n\
                -webkit-transform: rotateZ(135deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(135deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        100% {\n\
                -webkit-transform: rotateZ(135deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
                transform: rotateZ(135deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
        }\n\
}\n\
\n\
.text.part2 span:nth-child(2) .character {\n\
        color: #f99b0c;\n\
        -webkit-animation: wave 1.2s linear infinite;\n\
        animation: wave 1.2s linear infinite;\n\
        -webkit-animation-delay: 2.66667s;\n\
        animation-delay: 2.66667s;\n\
}\n\
\n\
.text.part2 span:nth-child(2) span::before {\n\
        -webkit-animation: shadow 1.2s linear infinite;\n\
        animation: shadow 1.2s linear infinite;\n\
        -webkit-animation-delay: 2.66667s;\n\
        animation-delay: 2.66667s;\n\
}\n\
\n\
.text.part2 span:nth-child(3).poofed {\n\
        -webkit-animation: sec_poofing3 1.4s ease-in-out infinite alternate;\n\
        animation: sec_poofing3 1.4s ease-in-out infinite alternate;\n\
}\n\
\n\
@-webkit-keyframes sec_poofing3 {\n\
        0% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
        }\n\
        50% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        56% {\n\
                -webkit-transform: rotateZ(442deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(442deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        100% {\n\
                -webkit-transform: rotateZ(442deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
                transform: rotateZ(442deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
        }\n\
}\n\
\n\
@keyframes sec_poofing3 {\n\
        0% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
        }\n\
        50% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        56% {\n\
                -webkit-transform: rotateZ(442deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(442deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        100% {\n\
                -webkit-transform: rotateZ(442deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
                transform: rotateZ(442deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
        }\n\
}\n\
\n\
.text.part2 span:nth-child(3) .character {\n\
        color: #cee007;\n\
        -webkit-animation: wave 1.2s linear infinite;\n\
        animation: wave 1.2s linear infinite;\n\
        -webkit-animation-delay: 3s;\n\
        animation-delay: 3s;\n\
}\n\
\n\
.text.part2 span:nth-child(3) span::before {\n\
        -webkit-animation: shadow 1.2s linear infinite;\n\
        animation: shadow 1.2s linear infinite;\n\
        -webkit-animation-delay: 3s;\n\
        animation-delay: 3s;\n\
}\n\
\n\
.text.part2 span:nth-child(4).poofed {\n\
        -webkit-animation: sec_poofing4 1.4s ease-in-out infinite alternate;\n\
        animation: sec_poofing4 1.4s ease-in-out infinite alternate;\n\
}\n\
\n\
@-webkit-keyframes sec_poofing4 {\n\
        0% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
        }\n\
        50% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        56% {\n\
                -webkit-transform: rotateZ(525deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(525deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        100% {\n\
                -webkit-transform: rotateZ(525deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
                transform: rotateZ(525deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
        }\n\
}\n\
\n\
@keyframes sec_poofing4 {\n\
        0% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
        }\n\
        50% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        56% {\n\
                -webkit-transform: rotateZ(525deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(525deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        100% {\n\
                -webkit-transform: rotateZ(525deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
                transform: rotateZ(525deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
        }\n\
}\n\
\n\
.text.part2 span:nth-child(4) .character {\n\
        color: #00c6b2;\n\
        -webkit-animation: wave 1.2s linear infinite;\n\
        animation: wave 1.2s linear infinite;\n\
        -webkit-animation-delay: 3.33333s;\n\
        animation-delay: 3.33333s;\n\
}\n\
\n\
.text.part2 span:nth-child(4) span::before {\n\
        -webkit-animation: shadow 1.2s linear infinite;\n\
        animation: shadow 1.2s linear infinite;\n\
        -webkit-animation-delay: 3.33333s;\n\
        animation-delay: 3.33333s;\n\
}\n\
\n\
.text.part2 span:nth-child(5).poofed {\n\
        -webkit-animation: sec_poofing5 1.4s ease-in-out infinite alternate;\n\
        animation: sec_poofing5 1.4s ease-in-out infinite alternate;\n\
}\n\
\n\
@-webkit-keyframes sec_poofing5 {\n\
        0% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
        }\n\
        50% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        56% {\n\
                -webkit-transform: rotateZ(419deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(419deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        100% {\n\
                -webkit-transform: rotateZ(419deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
                transform: rotateZ(419deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
        }\n\
}\n\
\n\
@keyframes sec_poofing5 {\n\
        0% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
        }\n\
        50% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        56% {\n\
                -webkit-transform: rotateZ(419deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(419deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        100% {\n\
                -webkit-transform: rotateZ(419deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
                transform: rotateZ(419deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
        }\n\
}\n\
\n\
.text.part2 span:nth-child(5) .character {\n\
        color: #4e2a84;\n\
        -webkit-animation: wave 1.2s linear infinite;\n\
        animation: wave 1.2s linear infinite;\n\
        -webkit-animation-delay: 3.66667s;\n\
        animation-delay: 3.66667s;\n\
}\n\
\n\
.text.part2 span:nth-child(5) span::before {\n\
        -webkit-animation: shadow 1.2s linear infinite;\n\
        animation: shadow 1.2s linear infinite;\n\
        -webkit-animation-delay: 3.66667s;\n\
        animation-delay: 3.66667s;\n\
}\n\
\n\
.text.part2 span:nth-child(6).poofed {\n\
        -webkit-animation: sec_poofing6 1.4s ease-in-out infinite alternate;\n\
        animation: sec_poofing6 1.4s ease-in-out infinite alternate;\n\
}\n\
\n\
@-webkit-keyframes sec_poofing6 {\n\
        0% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
        }\n\
        50% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        56% {\n\
                -webkit-transform: rotateZ(246deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(246deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        100% {\n\
                -webkit-transform: rotateZ(246deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
                transform: rotateZ(246deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
        }\n\
}\n\
\n\
@keyframes sec_poofing6 {\n\
        0% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
        }\n\
        50% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        56% {\n\
                -webkit-transform: rotateZ(246deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(246deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        100% {\n\
                -webkit-transform: rotateZ(246deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
                transform: rotateZ(246deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
        }\n\
}\n\
\n\
.text.part2 span:nth-child(6) .character {\n\
        color: #9C27B0;\n\
        -webkit-animation: wave 1.2s linear infinite;\n\
        animation: wave 1.2s linear infinite;\n\
        -webkit-animation-delay: 4s;\n\
        animation-delay: 4s;\n\
}\n\
\n\
.text.part2 span:nth-child(6) span::before {\n\
        -webkit-animation: shadow 1.2s linear infinite;\n\
        animation: shadow 1.2s linear infinite;\n\
        -webkit-animation-delay: 4s;\n\
        animation-delay: 4s;\n\
}\n\
\n\
.text.part2 span:nth-child(7).poofed {\n\
        -webkit-animation: sec_poofing7 1.4s ease-in-out infinite alternate;\n\
        animation: sec_poofing7 1.4s ease-in-out infinite alternate;\n\
}\n\
\n\
@-webkit-keyframes sec_poofing7 {\n\
        0% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
        }\n\
        50% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        56% {\n\
                -webkit-transform: rotateZ(206deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(206deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        100% {\n\
                -webkit-transform: rotateZ(206deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
                transform: rotateZ(206deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
        }\n\
}\n\
\n\
@keyframes sec_poofing7 {\n\
        0% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
        }\n\
        50% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        56% {\n\
                -webkit-transform: rotateZ(206deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(206deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        100% {\n\
                -webkit-transform: rotateZ(206deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
                transform: rotateZ(206deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
        }\n\
}\n\
\n\
.text.part2 span:nth-child(7) .character {\n\
        color: #f99b0c;\n\
        -webkit-animation: wave 1.2s linear infinite;\n\
        animation: wave 1.2s linear infinite;\n\
        -webkit-animation-delay: 4.33333s;\n\
        animation-delay: 4.33333s;\n\
}\n\
\n\
.text.part2 span:nth-child(7) span::before {\n\
        -webkit-animation: shadow 1.2s linear infinite;\n\
        animation: shadow 1.2s linear infinite;\n\
        -webkit-animation-delay: 4.33333s;\n\
        animation-delay: 4.33333s;\n\
}\n\
\n\
.text.part2 span:nth-child(8).poofed {\n\
        -webkit-animation: sec_poofing8 1.4s ease-in-out infinite alternate;\n\
        animation: sec_poofing8 1.4s ease-in-out infinite alternate;\n\
}\n\
\n\
@-webkit-keyframes sec_poofing8 {\n\
        0% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
        }\n\
        50% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        56% {\n\
                -webkit-transform: rotateZ(60deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(60deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        100% {\n\
                -webkit-transform: rotateZ(60deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
                transform: rotateZ(60deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
        }\n\
}\n\
\n\
@keyframes sec_poofing8 {\n\
        0% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
        }\n\
        50% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        56% {\n\
                -webkit-transform: rotateZ(60deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(60deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        100% {\n\
                -webkit-transform: rotateZ(60deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
                transform: rotateZ(60deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
        }\n\
}\n\
\n\
.text.part2 span:nth-child(8) .character {\n\
        color: #cee007;\n\
        -webkit-animation: wave 1.2s linear infinite;\n\
        animation: wave 1.2s linear infinite;\n\
        -webkit-animation-delay: 4.66667s;\n\
        animation-delay: 4.66667s;\n\
}\n\
\n\
.text.part2 span:nth-child(8) span::before {\n\
        -webkit-animation: shadow 1.2s linear infinite;\n\
        animation: shadow 1.2s linear infinite;\n\
        -webkit-animation-delay: 4.66667s;\n\
        animation-delay: 4.66667s;\n\
}\n\
\n\
.text.part2 span:nth-child(9).poofed {\n\
        -webkit-animation: sec_poofing9 1.4s ease-in-out infinite alternate;\n\
        animation: sec_poofing9 1.4s ease-in-out infinite alternate;\n\
}\n\
\n\
@-webkit-keyframes sec_poofing9 {\n\
        0% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
        }\n\
        50% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        56% {\n\
                -webkit-transform: rotateZ(496deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(496deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        100% {\n\
                -webkit-transform: rotateZ(496deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
                transform: rotateZ(496deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
        }\n\
}\n\
\n\
@keyframes sec_poofing9 {\n\
        0% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);\n\
        }\n\
        50% {\n\
                -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        56% {\n\
                -webkit-transform: rotateZ(496deg) rotateY(360deg) translateY(0px) scale(1);\n\
                transform: rotateZ(496deg) rotateY(360deg) translateY(0px) scale(1);\n\
        }\n\
        100% {\n\
                -webkit-transform: rotateZ(496deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
                transform: rotateZ(496deg) rotateY(360deg) translateY(-700px) scale(0.01);\n\
        }\n\
}\n\
\n\
.text.part2 span:nth-child(9) .character {\n\
        color: #00c6b2;\n\
        -webkit-animation: wave 1.2s linear infinite;\n\
        animation: wave 1.2s linear infinite;\n\
        -webkit-animation-delay: 5s;\n\
        animation-delay: 5s;\n\
}\n\
\n\
.text.part2 span:nth-child(9) span::before {\n\
        -webkit-animation: shadow 1.2s linear infinite;\n\
        animation: shadow 1.2s linear infinite;\n\
        -webkit-animation-delay: 5s;\n\
        animation-delay: 5s;\n\
}\n\
\n\
@-webkit-keyframes wave {\n\
        0% {\n\
                -webkit-transform: translateY(0);\n\
                transform: translateY(0);\n\
        }\n\
        50% {\n\
                -webkit-transform: translateY(-10px);\n\
                transform: translateY(-10px);\n\
        }\n\
        100% {\n\
                -webkit-transform: translateY(0);\n\
                transform: translateY(0);\n\
        }\n\
}\n\
\n\
@keyframes wave {\n\
        0% {\n\
                -webkit-transform: translateY(0);\n\
                transform: translateY(0);\n\
        }\n\
        50% {\n\
                -webkit-transform: translateY(-10px);\n\
                transform: translateY(-10px);\n\
        }\n\
        100% {\n\
                -webkit-transform: translateY(0);\n\
                transform: translateY(0);\n\
        }\n\
}\n\
\n\
@-webkit-keyframes shadow {\n\
        0% {\n\
                width: 0;\n\
                height: 0;\n\
        }\n\
        50% {\n\
                width: 100%;\n\
                height: 100%;\n\
        }\n\
        100% {\n\
                width: 0;\n\
                height: 0;\n\
        }\n\
}\n\
\n\
@keyframes shadow {\n\
        0% {\n\
                width: 0;\n\
                height: 0;\n\
        }\n\
        50% {\n\
                width: 100%;\n\
                height: 100%;\n\
        }\n\
        100% {\n\
                width: 0;\n\
                height: 0;\n\
        }\n\
}\n\
\n\
.how-to {\n\
        margin: 2rem 0 2rem 1rem;\n\
        font-family: "Opens Sans", sans-serif;\n\
        font-weight: 300;\n\
        font-size: .85em;\n\
        letter-spacing: 4px;\n\
        /*color: rgba(0, 0, 0, 0.8);*/\n\
        color: rgba(255, 255, 255, 0.8);\n\
}\n\
\n\
@-webkit-keyframes rotate {\n\
        0% {\n\
                -webkit-transform: rotateZ(0) scale(0.7);\n\
                transform: rotateZ(0) scale(0.7);\n\
        }\n\
        100% {\n\
                -webkit-transform: rotateZ(360deg) scale(0.7);\n\
                transform: rotateZ(360deg) scale(0.7);\n\
        }\n\
}\n\
\n\
@keyframes rotate {\n\
        0% {\n\
                -webkit-transform: rotateZ(0) scale(0.7);\n\
                transform: rotateZ(0) scale(0.7);\n\
        }\n\
        100% {\n\
                -webkit-transform: rotateZ(360deg) scale(0.7);\n\
                transform: rotateZ(360deg) scale(0.7);\n\
        }\n\
}\n\
\n\
@media only screen and (max-width: 767px) {\n\
        .text {\n\
                font-size: 6em;\n\
        }\n\
        .text .letter span {\n\
                bottom: .5rem;\n\
        }\n\
}\n\
\n\
@media only screen and (max-width: 480px) {\n\
        .text {\n\
                font-size: 4em;\n\
        }\n\
        .text .letter span {\n\
                bottom: 0;\n\
        }\n\
}\n\
';

var ExpandUI_QuickNavigationBar_html = '\
/*拓展UI-快捷导航栏的html代码*/\n\
<div style="position: fixed;top: 30%;right: 0;">\n\
        <div class="localTool-1-1 layui-input-block" style="margin-left:0; text-align: center;min-height:0;padding: 2px 0px;background: #282B33;">快捷导航栏</div>\n\
        \n\
        <ul class="layui-nav layui-nav-tree layui-inline" lay-filter="demo" style="margin-right: 10px;">\n\
                <li class="layui-nav-item layui-nav-itemed">\n\
                        <a href="javascript:;">好友分组</a>\n\
                        <dl class="layui-nav-child">\n\
                                <dd><a href="javascript:;">选项一</a></dd>\n\
                                <dd><a href="javascript:;">选项二</a></dd>\n\
                                <dd><a href="javascript:;">选项三</a></dd>\n\
                                <dd><a href="">跳转项</a></dd>\n\
                        </dl>\n\
                </li>\n\
                \n\
                <li class="layui-nav-item">\n\
                        <a href="javascript:;">功能模块</a>\n\
                        <dl class="layui-nav-child">\n\
                                <dd><a href="javascript:;">选项一</a></dd>\n\
                                <dd><a href="javascript:;">选项二</a></dd>\n\
                                <dd><a href="javascript:;">选项三</a></dd>\n\
                                <dd><a href="">跳转项</a></dd>\n\
                        </dl>\n\
                </li>\n\
                \n\
                <li class="layui-nav-item">\n\
                        <a href="javascript:;">其他</a>\n\
                        <dl class="layui-nav-child">\n\
                                <dd><a href="javascript:;">返回顶部</a></dd>\n\
                                <dd><a href="javascript:;">返回底部</a></dd>\n\
                                <dd><a href="javascript:;">选项三</a></dd>\n\
                                <dd><a href="">跳转项</a></dd>\n\
                        </dl>\n\
                </li>\n\
                \n\
                <li class="layui-nav-item">\n\
                        <a href="javascript:;">解决方案</a>\n\
                        <dl class="layui-nav-child">\n\
                                <dd><a href="">移动模块</a></dd>\n\
                                <dd><a href="">后台模版</a></dd>\n\
                                <dd><a href="">电商平台</a></dd>\n\
                        </dl>\n\
                </li>\n\
                \n\
                <li class="layui-nav-item"><a href="">云市场</a></li>\n\
                <li class="layui-nav-item"><a href="">社区</a></li>\n\
        </ul>\n\
</div>\n\
';

var groupUI_html = '\
<div class="layui-tab layui-tab-brief" lay-filter="demo">\n\
        <ul class="layui-tab-title" style="color: #ebebeb;">\n\
                <li class="localTool-2-1 layui-this">留言</li>\n\
                <li>留言设置</li>\n\
                <li>数据分析</li>\n\
                <li>点赞助手</li>\n\
                <li>拓展功能(测试)</li>\n\
                <li>设置</li>\n\
        </ul>\n\
        <div class="layui-tab-content">\n\
        <div class="layui-tab-item layui-show" style="color: #ebebeb;">\n\
        <!----------------------------------------------------------------------------------------------------------------->\n\
          <div class="commentthread_entry">\n\
                        <div class="commentthread_entry_quotebox">\n\
                                <!--<textarea class="commentthread_textarea" id="comment_textarea" onfocus="this.focus();this.select();inBoxShrinkage(\'comment_textarea\',false);" onClick="" onblur="inBoxonblurID=0;inBoxShrinkage(\'comment_textarea\',true);" placeholder="添加留言" style="overflow: hidden; height: 28px;"></textarea>-->\n\
                                <textarea class="commentthread_textarea" id="comment_textarea" onfocus="inBoxonblurID=0;inBoxShrinkage(\'comment_textarea\',false);" onClick="" onblur="inBoxonblurID=0;inBoxShrinkage(\'comment_textarea\',true);" placeholder="添加留言" style="overflow: hidden; height: 28px;"></textarea>\n\
                        </div>\n\
                        \n\
                        <form class="layui-form" action="" lay-filter="example">\n\
                                <div id="strInBytes" style="color: #32CD32;display: inline-block;font-family: Consolas;font-size: 16px;">\n\
                                        <span>当前字符字节数: </span>\n\
                                        <span id="strInBytes_Text">0</span>\n\
                                        <span>/999</span>\n\
                                </div>\n\
                                <div class="layui-inline">\n\
                                        <label class="layui-form-label" style="width: auto;">文本格式(直接添加或选择文字添加)</label>\n\
                                        <div class="layui-input-inline">\n\
                                                <select name="modules" lay-verify="required" lay-search="" id="steamTextStyle">\n\
                                                        <option value="">直接选择或搜索选择</option>\n\
                                                        <option value="1">[h1]标题文字[/h1]</option>\n\
                                                        <option value="2">[b]粗体文本[/b]</option>\n\
                                                        <option value="3">[u]下划线文本[/u]</option>\n\
                                                        <option value="4">[i]斜体文本[/i]</option>\n\
                                                        <option value="5">[strike]删除文本[/strike]</option>\n\
                                                        <option value="6">[spoiler]隐藏文本[/spoiler]</option>\n\
                                                        <option value="7">[noparse]不解析[b]标签[/b][/noparse]</option>\n\
                                                        <option value="8">[url=store.steampowered.com]网站链接[/url]</option>\n\
                                                </select>\n\
                                        </div>\n\
                                        <button type="button" class="layui-btn layui-btn-normal" id="LAY-component-form-getval">添加</button>\n\
                                </div>\n\
                        </form>\n\
                        \n\
                        <fieldset class="layui-elem-field layui-field-title">\n\
                                <legend>翻译模块(需要提前设置国籍):</legend>\n\
                        </fieldset>\n\
                        <div id="translationOptions" style="color:#fff;">\n\
                                <span><span>当前语言:</span> \n\
                                        <select id="origLanguageSelectBox" style="padding: 4px 12px 4px 8px;font-size:12px;outline:0;border: 1px solid #34DEFF;background-color:transparent;color: #66ccff;">\n\
                                                <option name="auto" value="auto" style="color:#fff;background-color: #3E9AC6;">自动检测</option>\n\
                                                <option name="zhc" value="zh-CN" style="color:#fff;background-color: #3E9AC6;">中文简体</option>\n\
                                                <option name="en" value="en" style="color:#fff;background-color: #3E9AC6;">英语</option>\n\
                                                <option name="jp" value="ja" style="color:#fff;background-color: #3E9AC6;">日语</option>\n\
                                        </select>\n\
                                </span>\n\
                                \n\
                                <span style="margin-left: 5px;"><span>目标语言: </span>\n\
                                        <select id="selectBoxID" class="selectBox" multiple="multiple">\n\
                                                <option value="en">英语</option>\n\
                                                <option value="ja">日语</option>\n\
                                                <option value="zh-CN">中文简体</option>\n\
                                                <option value="zh-sg">马新简体[zh-sg]</option>\n\
                                                <option value="zh-hant">繁體中文[zh-hant]</option>\n\
                                                <option value="zh-hk">繁體中文(香港)[zh-hk]</option>\n\
                                                <option value="zh-mo">繁體中文(澳门)[zh-mo]</option>\n\
                                                <option value="zh-tw">繁體中文(台湾)[zh-tw]</option>\n\
                                        </select>\n\
                                </span>\n\
                                \n\
                                <span style="margin-left: 5px;vertical-align: middle;">\n\
                                        <button id="translationText">翻译</button>\n\
                                </span>\n\
                        </div>\n\
                        \n\
                        <fieldset class="layui-elem-field layui-field-title">\n\
                                <legend>添加称呼模块(需要提前设置备注):</legend>\n\
                        </fieldset>\n\
                        <div class="commentthread_entry_submitlink" style="">\n\
                                <span class="isCustom" style="display: block;text-align: left;">\n\
                                        <!-- 默认为{name}，可以自行修改，好友没有备注则使用steam名称  -->\n\
                                        <span style="font-size:14px;line-height: 20px;color: #67c1f5 !important;">自定义称呼模式</span>\n\
                                        <input class="nameAddType" id="select_isCustom_checkbox" name="nameAddType" type="radio" style="vertical-align: middle;margin:2px;">\n\
                                        <span style="margin-left: 5px;vertical-align: middle;">\n\
                                                <button id="addCustomName">在留言框添加自定义称呼标识符</button>\n\
                                        </span>\n\
                                </span>\n\
                                \n\
                                <span class="isName" style="display: block;text-align: left;">\n\
                                        <span style="font-size:14px;line-height: 20px;color: #67c1f5 !important;">是否为组添加称呼(如果组没有备注则使用steam名称)</span>\n\
                                        <input class="nameAddType" id="select_islName_checkbox" name="nameAddType" type="radio" style="vertical-align: middle;margin:2px;">\n\
                                </span>\n\
                                \n\
                                <span class="isSpecialName" style="display: block;text-align: left;">\n\
                                        <span style="font-size:14px;line-height: 20px;color: #67c1f5 !important;">是否为组添加称呼(如果组设置有备注则使用，否则不添加称呼)</span>\n\
                                        <input class="nameAddType" id="select_isSpecialName_checkbox" name="nameAddType"  type="radio" style="vertical-align: middle;margin:2px;">\n\
                                </span>\n\
                                \n\
                                <fieldset class="layui-elem-field layui-field-title" style="padding: 10px 0px;">\n\
                                <span style="display: block;text-align: right;">\n\
                                        <a class="btn_grey_black btn_small_thin" href="javascript:CCommentThread.FormattingHelpPopup( \'Profile\' );">\n\
                                                <span class="btn_grey_black btn_small_thin_text">格式化帮助</span>\n\
                                        </a>\n\
                                        \n\
                                        <span class="emoticon_container">\n\
                                                <span class="emoticon_button small" id="emoticonbtn"></span>\n\
                                        </span>\n\
                                        \n\
                                        <span class="btn_green_white_innerfade btn_small" id="comment_submit">\n\
                                                <span id="comment_submit_text">发送评论给选择的组</span>\n\
                                        </span>\n\
                                        \n\
                                        <span class="btn_green_white_innerfade btn_small" id="comment_submit_special">\n\
                                                <span id="comment_submit_special_text">根据国籍发送评论给选择的组</span>\n\
                                        </span>\n\
                                </span>\n\
                        </div>\n\
                </div>\n\
                <div id="log">\n\
                        <span id="log_head"></span>\n\
                        <span id="log_body" style="display:inline-block;width:100%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; /*超出部分用...代替*/"></span>\n\
                </div>\n\
                <!----------------------------------------------------------------------------------------------------------------->\n\
          \n\
        </div>\n\
        \n\
        <div class="layui-tab-item" style="background-color: rgba(0,0,0,0.2); color: #ebebeb;">\n\
                <div style="text-align: left;margin: 5px 0px;">\n\
                        <span style="margin-left: 5px;vertical-align: middle;">\n\
                                <fieldset class="layui-elem-field layui-field-title">\n\
                                        <legend>设置国籍:</legend>\n\
                                </fieldset>\n\
                                <div style="color: #67c1f5;">请选择要设置的国籍:</div>\n\
                                <select id="nationalitySelectBox" style="padding: 4px 12px 4px 8px;font-size:12px;outline:0;border: 1px solid #34DEFF;background-color:transparent;color: #66ccff;">\n\
                                        <option name="CN" value="CN" style="color:#fff;background-color: #3E9AC6;">简体中文</option>\n\
                                        <option name="EN" value="EN" style="color:#fff;background-color: #3E9AC6;">英语</option>\n\
                                        <option name="JP" value="JP" style="color:#fff;background-color: #3E9AC6;">日语</option>\n\
                                        <option name="CN-SG" value="CN-SG" style="color:#fff;background-color: #3E9AC6;">马新简体(马来西亚,新加坡)[zh-sg]</option>\n\
                                        <option name="CN-HANT" value="CN-HANT" style="color:#fff;background-color: #3E9AC6;">繁體中文[zh-hant]</option>\n\
                                        <option name="CN-HK" value="CN-HK" style="color:#fff;background-color: #3E9AC6;">繁體中文(香港)[zh-hk]</option>\n\
                                        <option name="CN-MO" value="CN-MO" style="color:#fff;background-color: #3E9AC6;">繁體中文(澳门)[zh-mo]</option>\n\
                                        <option name="CN-TW" value="CN-TW" style="color:#fff;background-color: #3E9AC6;">繁體中文(台湾)[zh-tw]</option>\n\
                                </select>\n\
                                <button id="setNationality">为选择的好友设置国籍标识</button>\n\
                        </span>\n\
                        <span style="margin-left: 5px;vertical-align: top;">\n\
                                <button id="unsetNationality">为选择的好友取消国籍标识</button>\n\
                        </span>\n\
                        <br />\n\
                         <fieldset class="layui-elem-field layui-field-title">\n\
                                <legend>设置不留言:</legend>\n\
                         </fieldset>\n\
                        <div style="margin-left: 5px;vertical-align: top;margin-top:5px;">\n\
                                <span>\n\
                                        <button id="setNoLeave">为选择的好友设置不留言</button>\n\
                                </span>\n\
                                <span>\n\
                                        <button id="unsetNoLeave">为选择的好友取消设置不留言</button>\n\
                                </span>\n\
                        </div>\n\
                        <fieldset class="layui-elem-field layui-field-title">\n\
                                <legend>设置留言时间间隔:</legend>\n\
                        </fieldset>\n\
                        <div id="">只选择日期则过n天后再留言，只选择时间则过x时后再留言(严格模式)，日期和时间都选择了则过n天x时后再留言(严格模式)</div>\n\
                        <div id="">这里其实是一个时间差，比如指定的好友3天留言一次，今天是4月10日，你就选择4月13日就行了，这样做方便一点</div>\n\
                        <div class="layui-form">\n\
                          <div class="layui-form-item">\n\
                                <div class="layui-inline" style="opacity:0;filter: alpha(opacity=0);position: absolute;z-index: 0;">\n\
                                  <label class="layui-form-label">请选择留言</label> <!--这个是被点击对象，隐藏、不占空间、触发事件-->\n\
                                  <div class="layui-input-inline">\n\
                                        <input type="text" class="layui-input" id="test-limit2" readonly="" placeholder="yyyy-MM-dd">\n\
                                  </div>\n\
                                </div>\n\
                                <div class="layui-inline" style="position: relative;z-index: -1;">\n\
                                  <label class="layui-form-label">留言日期差</label> <!--这个是克隆出来的对象，显示，占空间、被覆盖，不触发事件-->\n\
                                  <div class="layui-input-inline">\n\
                                        <input type="text" class="layui-input" id="test-limit1" readonly="" placeholder="yyyy-MM-dd">\n\
                                  </div>\n\
                                </div>\n\
                                \n\
                          </div>\n\
                        </div>\n\
                        <div style="margin-left: 5px;vertical-align: top;margin-top:5px;">\n\
                                <span>\n\
                                        <button id="setTimeInterval">为选择的好友设置留言时间间隔</button>\n\
                                </span>\n\
                                <span>\n\
                                        <button id="unsetTimeInterval">为选择的好友取消设置留言时间间隔</button>\n\
                                </span>\n\
                        </div>\n\
                        \n\
                        <fieldset class="layui-elem-field layui-field-title">\n\
                           <legend>设置自动留言计划:</legend>\n\
                        </fieldset>\n\
                        <div class="layui-form">\n\
                          <div class="layui-form-item">\n\
                                <div class="layui-inline" style="opacity:0;filter: alpha(opacity=0);position: absolute;z-index: 0;">\n\
                                        <label class="layui-form-label">请选择时间</label>  <!--这个是被点击对象，隐藏、不占空间、触发事件-->\n\
                                        <div class="layui-input-inline">\n\
                                                <input type="text" class="layui-input" id="test14" placeholder="H时m分s秒">\n\
                                        </div>\n\
                                </div>\n\
                                <div class="layui-inline" style="position: relative;z-index: -1;">\n\
                                        <label class="layui-form-label">请选择时间</label> <!--这个是克隆出来的对象，显示，占空间、被覆盖，不触发事件-->\n\
                                        <div class="layui-input-inline">\n\
                                                <input type="text" class="layui-input" id="test15" placeholder="H时m分s秒">\n\
                                        </div>\n\
                                </div>\n\
                          </div>\n\
                        </div>\n\
                        \n\
                        <table class="layui-hide" id="test" lay-filter="test"></table> <!-- 数据表格 -->\n\
                        \n\
                        <fieldset class="layui-elem-field layui-field-title">\n\
                                <legend>设置好友分组:</legend>\n\
                        </fieldset>\n\
                        <div style="margin-left: 5px;vertical-align: top;margin-top:5px;">\n\
                        \n\
                        <form class="layui-form" action="">\n\
                          <div class="layui-form-item">\n\
                                <div class="layui-inline">\n\
                                  <label class="layui-form-label">分组列表</label>\n\
                                  <div class="layui-input-inline">\n\
                                        <select name="modules" lay-verify="required" lay-search="">\n\
                                          <option value="">直接选择或搜索选择</option>\n\
                                          <option value="1">分组名称</option>\n\
                                          <option value="2">分组名称</option>\n\
                                          <option value="3">分组名称</option>\n\
                                          <option value="4">分组名称</option>\n\
                                          <option value="5">分组名称</option>\n\
                                          <option value="6">分组名称</option>\n\
                                          <option value="7">分组名称</option>\n\
                                          <option value="8">分组名称</option>\n\
                                          <option value="9">分组名称</option>\n\
                                        </select>\n\
                                  </div>\n\
                                  <button type="button" class="layui-btn" id="editFriendGroup">编辑列表</button>\n\
                                </div>\n\
                          </div>\n\
                        </form>\n\
                        \n\
                                <span>\n\
                                        <button id="addFriendToGroup">为选择的好友添加分组</button>\n\
                                </span>\n\
                                <span>\n\
                                        <button id="unaddFriendToGroup">为选择的好友取消添加分组</button>\n\
                                </span>\n\
                                \n\
                                <div class="layui-collapse" lay-filter="test">\n\
                                  <div class="layui-colla-item">\n\
                                        <h2 class="layui-colla-title">分组名称</h2>\n\
                                        <div class="layui-colla-content">\n\
                                          <p>用户</p>\n\
                                          <p>用户</p>\n\
                                          <p>用户</p>\n\
                                        </div>\n\
                                  </div>\n\
                                  <div class="layui-colla-item">\n\
                                        <h2 class="layui-colla-title">分组名称</h2>\n\
                                        <div class="layui-colla-content">\n\
                                          <p>用户</p>\n\
                                          <p>用户</p>\n\
                                          </p>\n\
                                        </div>\n\
                                  </div>\n\
                                  <div class="layui-colla-item">\n\
                                        <h2 class="layui-colla-title">分组名称</h2>\n\
                                        <div class="layui-colla-content">\n\
                                          <p>用户</p>\n\
                                          <p>用户</p>\n\
                                        </div>\n\
                                  </div>\n\
                                  <div class="layui-colla-item">\n\
                                        <h2 class="layui-colla-title">分组名称</h2>\n\
                                        <div class="layui-colla-content">\n\
                                          <p>用户</p>\n\
                                        </div>\n\
                                  </div>\n\
                                </div>\n\
                                \n\
                        </div>\n\
                </div>\n\
          <div id="laydateDemo"></div>\n\
          <div id="log1">\n\
                <span id="log_head1"></span>\n\
                <span id="log_body1" style="display:inline-block;width:100%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; /*超出部分用...代替*/"></span>\n\
          </div>\n\
        </div>\n\
        \n\
        <div class="layui-tab-item" style="background-color: rgba(0,0,0,0.2); color: #ebebeb;">\n\
          \n\
          <span style="margin-left: 5px;vertical-align: top;">\n\
                <button id="NationalityGroup">按国籍进行高亮分组</button>\n\
          </span>\n\
          <span style="margin-left: 5px;vertical-align: top;">\n\
                <button id="NationalitySortGroup">按国籍进行排序分组(慢)</button>\n\
          </span>\n\
          <span style="margin-left: 5px;vertical-align: top;">\n\
                <button id="OfflineTimeGroup">按在线时间进行排序分组</button>\n\
          </span>\n\
          <span style="margin-left: 5px;vertical-align: top;">\n\
                <button id="ShowFriendData">显示好友详细数据-不可用</button>\n\
          </span>\n\
          <div class="layui-tab" lay-filter="test1">\n\
                <ul class="layui-tab-title">\n\
                  <li class="layui-this" lay-id="11" style="color:#ebebeb;">好友数据统计</li>\n\
                  <li lay-id="22" style="color:#ebebeb;">留言数据统计</li>\n\
                  <li lay-id="33" style="color:#ebebeb;">关系网统计</li>\n\
                  <li lay-id="44" style="color:#ebebeb;">当前配置统计</li>\n\
                  <li lay-id="55" style="color:#ebebeb;">查看好友配置统计</li>\n\
                </ul>\n\
                <div class="layui-tab-content">\n\
                        <div class="layui-tab-item layui-show">\n\
                                <span>数据表格(汇总所有的数据:id,名称,备注,国籍(语言),等级,好友数量,游戏数量,dlc数量,创意工坊数量,艺术作品数量,动态数量)</span>\n\
                                <table class="layui-hide" id="friendStatistics" lay-filter="friendStatistics"></table> <!--数据表格-->\n\
                                <div id="container_friendStatistics" style="width: 600px;height:400px;"></div>\n\
                        </div>\n\
                        <div class="layui-tab-item">\n\
                                <span>分为:</span>\n\
                                <span>按国籍的饼图(总留言数量)，</span>\n\
                                <span>按每天留言数据的折线图(统计所有的留言数据，生成的折线图)，</span>\n\
                                <span>按最多留言数据的柱状图(那些好友一天留言数量排行榜/那些好友总留言数量排行榜/累计连续每天留言数量最多)，</span>\n\
                                <span>数据表格(汇总所有的数据)</span>\n\
                                <div id="container_commentStatistics" style="min-width:400px;height:400px"></div>\n\
                        </div>\n\
                        <div class="layui-tab-item">\n\
                                <span>好友关系网(仅统计共同好友)</span>\n\
                                <div id="container_relationshipStatistics" style="min-width: 320px;max-width: 800px;margin: 0 auto;"></div>\n\
                        </div>\n\
                        <div class="layui-tab-item">\n\
                                <span>当前的配置数据和运行状态<span>\n\
                                <div id="container_currConfStatistics"></div>\n\
                        </div>\n\
                        <div class="layui-tab-item">\n\
                                <span>对好友设置的配置数据(比如国籍,不留言,留言时间间隔等)</span>\n\
                                <div id="container_friConfStatistics"></div>\n\
                        </div>\n\
                  </div>\n\
          </div>\n\
          \n\
          <div id="pageDemo"></div>\n\
        </div>\n\
        \n\
        <div class="layui-tab-item" style="background-color: rgba(0,0,0,0.2); color: #ebebeb;">\n\
          <fieldset class="layui-elem-field">\n\
                <legend>动态点赞助手</legend>\n\
                         <form class="layui-form" action="" lay-filter="example">\n\
                                 <div class="layui-form-item" pane="">\n\
                                        <label class="layui-form-label">总开关</label>\n\
                                        <div class="layui-input-block">\n\
                                                <!-- checked="" -->\n\
                                          <input type="checkbox" name="close" lay-skin="switch" lay-filter="switchTest" title="开关" lay-text="开启|关闭" id="friendActivitySwitch">\n\
                                        </div>\n\
                                  </div>\n\
                          </form>\n\
                <div class="layui-field-box">\n\
                        <fieldset class="layui-elem-field layui-field-title">\n\
                           <legend>设置点赞内容:</legend>\n\
                        </fieldset>\n\
                        <form class="layui-form" action="">\n\
                                <div class="layui-form-item">\n\
                                        <label class="layui-form-label">点赞内容:</label>\n\
                                        <div class="layui-row">\n\
                                           <div class="layui-input-block">\n\
                                                         <div class="layui-input-block" style="display:inline-block; margin-left:0px; vertical-align:top;">\n\
                                                                  <input type="checkbox" name="like[1]" lay-skin="primary" title="朋友发布了状态" checked=""><br>\n\
                                                                  <input type="checkbox" name="like[2]" lay-skin="primary" title="朋友发布了评测" checked=""><br>\n\
                                                                  <input type="checkbox" name="like[3]" lay-skin="primary" title="朋友购买了游戏或者DLC" checked=""><br>\n\
                                                                  <input type="checkbox" name="like[4]" lay-skin="primary" title="组发布了通知" checked=""><br>\n\
                                                                  <input type="checkbox" name="like[5]" lay-skin="primary" title="组发布了活动" checked=""><br>\n\
                                                         </div>\n\
                                                        <div class="layui-input-block" style="display:inline-block; margin-left:0px; vertical-align:top;">\n\
                                                                  <input type="checkbox" name="like[6]" lay-skin="primary" title="朋友发布了艺术作品" checked=""><br>\n\
                                                                  <input type="checkbox" name="like[7]" lay-skin="primary" title="朋友发布了创意工坊作品" checked=""><br>\n\
                                                                  <input type="checkbox" name="like[8]" lay-skin="primary" title="朋友发布了指南" checked=""><br>\n\
                                                                  <input type="checkbox" name="like[9]" lay-skin="primary" title="朋友上传了载图" checked=""><br>\n\
                                                                  <input type="checkbox" name="like[10]" lay-skin="primary" title="朋友上传了视频" checked=""><br>\n\
                                                        </div>\n\
                                                        <div class="layui-input-block" style="display:inline-block; margin-left:0px; vertical-align:top;">\n\
                                                                  <input type="checkbox" name="like[11]" lay-skin="primary" title="朋友收藏了艺术作品" checked=""><br>\n\
                                                                  <input type="checkbox" name="like[12]" lay-skin="primary" title="朋友收藏了创意工坊作品" checked=""><br>\n\
                                                                  <input type="checkbox" name="like[13]" lay-skin="primary" title="朋友收藏了指南" checked=""><br>\n\
                                                                  <input type="checkbox" name="like[14]" lay-skin="primary" title="朋友收藏了载图" checked=""><br>\n\
                                                                  <input type="checkbox" name="like[15]" lay-skin="primary" title="朋友收藏了视频" checked=""><br>\n\
                                                        </div>\n\
                                           </div>\n\
                                          </div>\n\
                                  </div>\n\
                         </form>\n\
                        <fieldset class="layui-elem-field layui-field-title">\n\
                           <legend>设置自动点赞模式:</legend>\n\
                        </fieldset>\n\
                        <form class="layui-form" action="">\n\
                                <div class="layui-form-item">\n\
                                        <label class="layui-form-label">点赞模式:</label>\n\
                                        <div class="layui-input-block">\n\
                                          <input type="checkbox" name="like[1]" lay-skin="primary" title="运行后自动开始点赞" checked=""><br>\n\
                                          <input type="checkbox" name="like[2]" lay-skin="primary" title="点赞完成后自动刷新并点赞新动态时间间隔" checked=""><br>\n\
                                        </div>\n\
                                  </div>\n\
                         </form>\n\
                        <fieldset class="layui-elem-field layui-field-title">\n\
                           <legend>设置自动点赞时间区间(默认今天~之前所有的动态内容)</legend>\n\
                        </fieldset>\n\
                        <div class="layui-form">\n\
                          <div class="layui-form-item">\n\
                                        <div class="layui-inline">\n\
                                          <label class="layui-form-label">请选择范围</label>\n\
                                          <div class="layui-input-inline">\n\
                                                <input type="text" class="layui-input" id="test-limit3" readonly="" placeholder=" ~ "> <!--placeholder="yyyy-MM-dd"-->\n\
                                          </div>\n\
                                        </div>\n\
                          </div>\n\
                        </div>\n\
                        <fieldset class="layui-elem-field layui-field-title" style="margin-top: 30px;">\n\
                          <legend style="color:#66ccff;">点赞进度时间线</legend>\n\
                        </fieldset>\n\
                        <ul class="layui-timeline">\n\
                          <li class="layui-timeline-item">\n\
                                <i class="layui-icon layui-timeline-axis"></i>\n\
                                <div class="layui-timeline-content layui-text">\n\
                                  <h3 class="layui-timeline-title" style="color:#66ccff;">8月18日</h3>\n\
                                  <p style="color:#fff;">\n\
                                        <span>已点赞状态x条，点赞发布艺术作品x条，点赞收藏艺术作品x条</span>\n\
                                        <br><span>已点赞评测x条，点赞发布创意工坊x条，点赞收藏创意工坊x条</span>\n\
                                        <br><span>已点赞购买状态x条，点赞发布指南x条，点赞收藏指南x条</span>\n\
                                        <br><span>已点赞组通知x条，点赞上次载图x条，点赞收藏载图x条</span>\n\
                                        <br><span>已点赞组活动x条，点赞上传视频x条，点赞收藏视频x条</span>\n\
                                  </p>\n\
                                </div>\n\
                          </li>\n\
                          <li class="layui-timeline-item">\n\
                                <i class="layui-icon layui-timeline-axis"></i>\n\
                                <div class="layui-timeline-content layui-text">\n\
                                  <h3 class="layui-timeline-title" style="color:#66ccff;">8月16日</h3>\n\
                                  <p style="color:#fff;">杜甫的思想核心是儒家的仁政思想，他有"致君尧舜上，再使风俗淳"的宏伟抱负。个人最爱的名篇有：</p>\n\
                                  <ul style="color:#fff;">\n\
                                        <li>《登高》</li>\n\
                                        <li>《茅屋为秋风所破歌》</li>\n\
                                  </ul>\n\
                                </div>\n\
                          </li>\n\
                          <li class="layui-timeline-item">\n\
                                <i class="layui-icon layui-timeline-axis"></i>\n\
                                <div class="layui-timeline-content layui-text">\n\
                                  <h3 class="layui-timeline-title" style="color:#66ccff;">8月15日</h3>\n\
                                  <p style="color:#fff;">\n\
                                        <span>中国人民抗日战争胜利日</span>\n\
                                        <br><span>常常在想，尽管对这个国家有这样那样的抱怨，但我们的确生在了最好的时代</span>\n\
                                        <br><span>铭记、感恩</span>\n\
                                        <br><span>所有为中华民族浴血奋战的英雄将士</span>\n\
                                        <br><span>永垂不朽</span>\n\
                                  </p>\n\
                                </div>\n\
                          </li>\n\
                          <li class="layui-timeline-item">\n\
                                <i class="layui-icon layui-timeline-axis"></i>\n\
                                <div class="layui-timeline-content layui-text">\n\
                                  <div class="layui-timeline-title" style="color:#66ccff;">过去</div>\n\
                                </div>\n\
                          </li>\n\
                        </ul>\n\
                </div>\n\
          </fieldset>\n\
        </div>\n\
        \n\
        <div class="layui-tab-item" style="background-color: rgba(0,0,0,0.2); color: #ebebeb;">\n\
          <fieldset class="layui-elem-field">\n\
                <legend>喜加一助手</legend>\n\
                <div class="layui-field-box">\n\
                        <!-- <div>是否启动喜加一助手</div> -->\n\
                <form class="layui-form" action="" lay-filter="example">\n\
                        <div class="layui-form-item" pane="">\n\
                           <label class="layui-form-label">总开关</label>\n\
                           <div class="layui-input-block">\n\
                                <!-- checked="" -->\n\
                                 <input type="checkbox" name="close" lay-skin="switch" lay-filter="switchTest2" title="开关" lay-text="开启|关闭" id="FreeGameSwitch">\n\
                           </div>\n\
                         </div>\n\
                </form>\n\
                <form class="layui-form" action="">\n\
                        <div class="layui-form-item">\n\
                                <label class="layui-form-label">设置:</label>\n\
                                <div class="layui-row">\n\
                                   <div class="layui-input-block">\n\
                                                 <div class="layui-input-block" style="display:inline-block; margin-left:0px; vertical-align:top;">\n\
                                                          <input type="checkbox" name="like[1]" lay-skin="primary" title="自动获取喜加一信息" checked=""><br>\n\
                                                 </div>\n\
                                                <div class="layui-input-block" style="display:inline-block; margin-left:0px; vertical-align:top;">\n\
                                                          <input type="checkbox" name="like[6]" lay-skin="primary" title="自动领取喜加一游戏" checked=""><br>\n\
                                                </div>\n\
                                                <div class="layui-input-block" style="display:inline-block; margin-left:0px; vertical-align:top;">\n\
                                                          <input type="checkbox" name="like[11]" lay-skin="primary" title="置顶显示在上方" checked=""><br>\n\
                                                </div>\n\
                                   </div>\n\
                                  </div>\n\
                          </div>\n\
                 </form>\n\
                 \n\
                 <div>设置喜加一数据来源</div>\n\
                 <form class="layui-form" action="">\n\
                        <div class="layui-form-item">\n\
                                <label class="layui-form-label">设置:</label>\n\
                                <div class="layui-row">\n\
                                   <div class="layui-input-block">\n\
                                                 <div class="layui-input-block" style="display:inline-block; margin-left:0px; vertical-align:top;">\n\
                                                          <input type="checkbox" name="like[1]" lay-skin="primary" title="SteamDB" checked=""><br>\n\
                                                 </div>\n\
                                                <div class="layui-input-block" style="display:inline-block; margin-left:0px; vertical-align:top;">\n\
                                                          <input type="checkbox" name="like[6]" lay-skin="primary" title="humblebundle" disabled=""><br>\n\
                                                </div>\n\
                                                <div class="layui-input-block" style="display:inline-block; margin-left:0px; vertical-align:top;">\n\
                                                          <input type="checkbox" name="like[11]" lay-skin="primary" title="fanatical" disabled=""><br>\n\
                                                </div>\n\
                                   </div>\n\
                                  </div>\n\
                          </div>\n\
                  </form>\n\
                </div>\n\
          </fieldset>\n\
        </div>\n\
        \n\
        <div class="layui-tab-item" style="background-color: rgba(0,0,0,0.2); color: #ebebeb;">\n\
                <fieldset class="layui-elem-field">\n\
                  <legend>功能设置</legend>\n\
                  <div class="layui-field-box">\n\
                          \n\
                          <form class="layui-form" action="" lay-filter="example">\n\
                                  <div class="layui-form-item" pane="">\n\
                                         <label class="layui-form-label">Debug模式</label>\n\
                                         <div class="layui-input-block">\n\
                                                                                                        <!-- checked="" -->\n\
                                           <input type="checkbox" name="close" lay-skin="switch" lay-filter="switchTest3" title="开关" lay-text="开启|关闭">\n\
                                         </div>\n\
                                   </div>\n\
                          </form>\n\
                                <div>弹出层</div>\n\
                                <div>滑块</div>\n\
                                <button type="button" class="layui-btn">导入导出重置当前设置</button>\n\
                                <div>弹出层</div>\n\
                                \n\
                                <div class="layui-upload-drag" id="uploadDemo">\n\
                                  <i class="layui-icon"></i>\n\
                                  <p>点击上传，或将文件拖拽到此处</p>\n\
                                  <div class="layui-hide" id="uploadDemoView">\n\
                                        <hr>\n\
                                        <img src="" alt="上传成功后渲染" style="max-width: 100%">\n\
                                  </div>\n\
                                </div>\n\
                  </div>\n\
                </fieldset>\n\
                \n\
                <fieldset class="layui-elem-field">\n\
                        <legend>界面设置</legend>\n\
                        <div class="layui-field-box">\n\
                                \n\
                                <fieldset class="layui-elem-field layui-field-title">\n\
                                <legend>语言配置</legend>\n\
                                <div id="selectLanguageDropdown" class="localizationTool"></div>\n\
                                        <button type="button" class="layui-btn">自动检测(简体中文)</button>\n\
                                        <button type="button" class="layui-btn">简体中文</button>\n\
                                        <button type="button" class="layui-btn">繁体中文</button>\n\
                                        <button type="button" class="layui-btn">English</button>\n\
                                </fieldset>\n\
                                \n\
                                <fieldset class="layui-elem-field layui-field-title">\n\
                                        <legend>主题切换</legend>\n\
                                        <div>请选择一个主题，然后点击应用</div>\n\
                                        <button type="button" class="layui-btn">应用主题</button>\n\
                                </fieldset>\n\
                                \n\
                                <fieldset class="layui-elem-field layui-field-title">\n\
                                        <legend>UI设置</legend>\n\
                                        <div>预览:</div>\n\
                                        <div>\n\
                                        <span>主要字体颜色:<span>\n\
                                                <span style="margin-left: 30px;">\n\
                                                        <input type="hidden" name="color" value="" id="test-all-input">\n\
                                                        <div id="test-all1"></div>\n\
                                                </span>\n\
                                        </div>\n\
                                        \n\
                                        <div>\n\
                                        <span>主要背景颜色:</span>\n\
                                                <span style="margin-left: 30px;">\n\
                                                        <input type="hidden" name="color" value="" id="test-all-input">\n\
                                                        <div id="test-all2"></div>\n\
                                                </span>\n\
                                        </div>\n\
                                        \n\
                                        <div>\n\
                                        <span>留言成功字体颜色:<span>\n\
                                                <span style="margin-left: 30px;">\n\
                                                        <input type="hidden" name="color" value="" id="test-all-input">\n\
                                                        <div id="test-all3"></div>\n\
                                                </span>\n\
                                        </div>\n\
                                        \n\
                                        <div>\n\
                                        <span>留言失败字体颜色:</span>\n\
                                                <span style="margin-left: 30px;">\n\
                                                        <input type="hidden" name="color" value="" id="test-all-input">\n\
                                                        <div id="test-all4"></div>\n\
                                                </span>\n\
                                        </div>\n\
                                        \n\
                                        <div>\n\
                                        <span>留言发生错误字体颜色:</span>\n\
                                                <span style="margin-left: 30px;">\n\
                                                        <input type="hidden" name="color" value="" id="test-all-input">\n\
                                                        <div id="test-all5"></div>\n\
                                                </span>\n\
                                        </div>\n\
                                        \n\
                                        <button type="button" class="layui-btn">保存为主题</button>\n\
                                </fieldset>\n\
                                \n\
                        </div>\n\
                </fieldset>\n\
                \n\
                <fieldset class="layui-elem-field">\n\
                        <legend>关于SteamAssistant(Steam小助手)</legend>\n\
                                <div class="layui-field-box">\n\
                                        <fieldset class="layui-elem-field layui-field-title">\n\
                                        <legend>程序信息:</legend>\n\
                                        <div>当前版本:v0.2.3.0</div>\n\
                                        <div>主程序框架更新时间:2020年4月19日</div>\n\
                                        <div>common模块:2020年4月19日</div>\n\
                                        <div>databaseConf模块:2020年4月19日</div>\n\
                                        <div>externalApis模块:2020年4月19日</div>\n\
                                        <div>steamApis模块:2020年4月19日</div>\n\
                                        <div>translateApis模块:2020年4月19日</div>\n\
                                        <div>Utility模块:2020年4月19日</div>\n\
                                        <div>UI模块:2020年4月19日</div>\n\
                                        <div>Event模块:2020年4月19日</div>\n\
                                        <div>CityList模块:2020年4月19日</div>\n\
                                        <fieldset class="layui-elem-field layui-field-title">\n\
                                        <legend>联系作者:</legend>\n\
                                        <button type="button" class="layui-btn">反馈错误</button>\n\
                                        <button type="button" class="layui-btn">提交建议</button>\n\
                                </div>\n\
                </fieldset>\n\
                \n\
                <div id="sliderDemo" style="margin: 50px 20px;"></div>\n\
        </div>\n\
        \n\
        </div>\n\
</div>\n\
';

var loadUI_Html = '\
<div class="text-wrapper">\n\
        <div class="text part1">\n\
                <div>\n\
                        <span class="letter">\n\
                                <div class="localTool-3-1 character">L</div>\n\
                                <span></span>\n\
                        </span>\n\
                        \n\
                        <span class="letter">\n\
                                <div class="character">o</div>\n\
                                <span></span>\n\
                        </span>\n\
                        \n\
                        <span class="letter">\n\
                                <div class="character">a</div>\n\
                                <span></span>\n\
                        </span>\n\
                        \n\
                        <span class="letter">\n\
                                <div class="character">d</div>\n\
                                <span></span>\n\
                        </span>\n\
                        \n\
                        <span class="letter">\n\
                                <div class="character">i</div>\n\
                                <span></span>\n\
                        </span>\n\
                        \n\
                        <span class="letter">\n\
                                <div class="character">n</div>\n\
                                <span></span>\n\
                        </span>\n\
                        \n\
                        <span class="letter">\n\
                                <div class="character">g</div>\n\
                                <span></span>\n\
                        </span>\n\
                </div>\n\
        </div>\n\
        <div class="how-to"><span>正在加载资源中，已完成0/10，请您耐心等待...</span></div>\n\
</div>\n\
';

var mainUI_html = '\
<div class="layui-tab layui-tab-brief" lay-filter="demo">\n\
        <ul class="layui-tab-title" style="color: #ebebeb;">\n\
                <li class="localTool-4-1 layui-this">留言</li>\n\
                <li>留言设置</li>\n\
                <li>数据分析</li>\n\
                <li>点赞助手</li>\n\
                <li>拓展功能(测试)</li>\n\
                <li>设置</li>\n\
        </ul>\n\
        <div class="layui-tab-content">\n\
        <div class="layui-tab-item layui-show" style="color: #ebebeb;">\n\
        <!----------------------------------------------------------------------------------------------------------------->\n\
          <div class="commentthread_entry">\n\
                        <div class="commentthread_entry_quotebox">\n\
                                <!--<textarea class="commentthread_textarea" id="comment_textarea" onfocus="this.focus();this.select();inBoxShrinkage(\'comment_textarea\',false);" onClick="" onblur="inBoxonblurID=0;inBoxShrinkage(\'comment_textarea\',true);" placeholder="添加留言" style="overflow: hidden; height: 28px;"></textarea>-->\n\
                                <textarea class="commentthread_textarea" id="comment_textarea" onfocus="inBoxonblurID=0;inBoxShrinkage(\'comment_textarea\',false);" onClick="" onblur="inBoxonblurID=0;inBoxShrinkage(\'comment_textarea\',true);" placeholder="添加留言" style="overflow: hidden; height: 28px;"></textarea>\n\
                        </div>\n\
                        \n\
                        <form class="layui-form" action="" lay-filter="example">\n\
                                <div id="strInBytes" style="color: #32CD32;display: inline-block;font-family: Consolas;font-size: 16px;">\n\
                                        <span>当前字符字节数: </span>\n\
                                        <span id="strInBytes_Text">0</span>\n\
                                        <span>/999</span>\n\
                                </div>\n\
                                <div class="layui-inline">\n\
                                        <label class="layui-form-label" style="width: auto;">文本格式(直接添加或选择文字添加)</label>\n\
                                        <div class="layui-input-inline">\n\
                                                <select name="modules" lay-verify="required" lay-search="" id="steamTextStyle">\n\
                                                        <option value="">直接选择或搜索选择</option>\n\
                                                        <option value="1">[h1]标题文字[/h1]</option>\n\
                                                        <option value="2">[b]粗体文本[/b]</option>\n\
                                                        <option value="3">[u]下划线文本[/u]</option>\n\
                                                        <option value="4">[i]斜体文本[/i]</option>\n\
                                                        <option value="5">[strike]删除文本[/strike]</option>\n\
                                                        <option value="6">[spoiler]隐藏文本[/spoiler]</option>\n\
                                                        <option value="7">[noparse]不解析[b]标签[/b][/noparse]</option>\n\
                                                        <option value="8">[url=store.steampowered.com]网站链接[/url]</option>\n\
                                                </select>\n\
                                        </div>\n\
                                        <button type="button" class="layui-btn layui-btn-normal" id="LAY-component-form-getval">添加</button>\n\
                                </div>\n\
                        </form>\n\
                        \n\
                        <fieldset class="layui-elem-field layui-field-title">\n\
                                <legend>翻译模块(需要提前设置国籍):</legend>\n\
                        </fieldset>\n\
                        <div id="translationOptions" style="color:#fff;">\n\
                                <span><span>当前语言:</span> \n\
                                        <select id="origLanguageSelectBox" style="padding: 4px 12px 4px 8px;font-size:12px;outline:0;border: 1px solid #34DEFF;background-color:transparent;color: #66ccff;">\n\
                                                <option name="auto" value="auto" style="color:#fff;background-color: #3E9AC6;">自动检测</option>\n\
                                                <option name="zhc" value="zh-CN" style="color:#fff;background-color: #3E9AC6;">中文简体</option>\n\
                                                <option name="en" value="en" style="color:#fff;background-color: #3E9AC6;">英语</option>\n\
                                                <option name="jp" value="ja" style="color:#fff;background-color: #3E9AC6;">日语</option>\n\
                                        </select>\n\
                                </span>\n\
                                \n\
                                <span style="margin-left: 5px;"><span>目标语言: </span>\n\
                                        <select id="selectBoxID" class="selectBox" multiple="multiple">\n\
                                                <option value="en">英语</option>\n\
                                                <option value="ja">日语</option>\n\
                                                <option value="zh-CN">中文简体</option>\n\
                                                <option value="zh-sg">马新简体[zh-sg]</option>\n\
                                                <option value="zh-hant">繁體中文[zh-hant]</option>\n\
                                                <option value="zh-hk">繁體中文(香港)[zh-hk]</option>\n\
                                                <option value="zh-mo">繁體中文(澳门)[zh-mo]</option>\n\
                                                <option value="zh-tw">繁體中文(台湾)[zh-tw]</option>\n\
                                        </select>\n\
                                </span>\n\
                                \n\
                                <span style="margin-left: 5px;vertical-align: middle;">\n\
                                        <button id="translationText">翻译</button>\n\
                                </span>\n\
                        </div>\n\
                        \n\
                        <fieldset class="layui-elem-field layui-field-title">\n\
                                <legend>添加称呼模块(需要提前设置备注):</legend>\n\
                        </fieldset>\n\
                        <div class="commentthread_entry_submitlink" style="">\n\
                                <span class="isCustom" style="display: block;text-align: left;">\n\
                                        <!-- 默认为{name}，可以自行修改，好友没有备注则使用steam名称  -->\n\
                                        <span style="font-size:14px;line-height: 20px;color: #67c1f5 !important;">自定义称呼模式</span>\n\
                                        <input class="nameAddType" id="select_isCustom_checkbox" name="nameAddType" type="radio" style="vertical-align: middle;margin:2px;">\n\
                                        <span style="margin-left: 5px;vertical-align: middle;">\n\
                                                <button id="addCustomName">在留言框添加自定义称呼标识符</button>\n\
                                        </span>\n\
                                </span>\n\
                                \n\
                                <span class="isName" style="display: block;text-align: left;">\n\
                                        <span style="font-size:14px;line-height: 20px;color: #67c1f5 !important;">是否为好友添加称呼(如果好友没有备注则使用steam名称)</span>\n\
                                        <input class="nameAddType" id="select_islName_checkbox" name="nameAddType" type="radio" style="vertical-align: middle;margin:2px;">\n\
                                </span>\n\
                                \n\
                                <span class="isSpecialName" style="display: block;text-align: left;">\n\
                                        <span style="font-size:14px;line-height: 20px;color: #67c1f5 !important;">是否为好友添加称呼(如果好友设置有备注则使用，否则不添加称呼)</span>\n\
                                        <input class="nameAddType" id="select_isSpecialName_checkbox" name="nameAddType"  type="radio" style="vertical-align: middle;margin:2px;">\n\
                                </span>\n\
                                \n\
                                <fieldset class="layui-elem-field layui-field-title" style="padding: 10px 0px;">\n\
                                <span style="display: block;text-align: right;">\n\
                                        <a class="btn_grey_black btn_small_thin" href="javascript:CCommentThread.FormattingHelpPopup( \'Profile\' );">\n\
                                                <span class="btn_grey_black btn_small_thin_text">格式化帮助</span>\n\
                                        </a>\n\
                                        \n\
                                        <span class="emoticon_container">\n\
                                                <span class="emoticon_button small" id="emoticonbtn"></span>\n\
                                        </span>\n\
                                        \n\
                                        <span class="btn_green_white_innerfade btn_small" id="comment_submit">\n\
                                                <span id="comment_submit_text">发送评论给选择的好友</span>\n\
                                        </span>\n\
                                        \n\
                                        <span class="btn_green_white_innerfade btn_small" id="comment_submit_special">\n\
                                                <span id="comment_submit_special_text">根据国籍发送评论给选择的好友</span>\n\
                                        </span>\n\
                                </span>\n\
                        </div>\n\
                </div>\n\
                <div id="log">\n\
                        <span id="log_head"></span>\n\
                        <span id="log_body" style="display:inline-block;width:100%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; /*超出部分用...代替*/"></span>\n\
                </div>\n\
                <!----------------------------------------------------------------------------------------------------------------->\n\
          \n\
        </div>\n\
        \n\
        <div class="layui-tab-item" style="background-color: rgba(0,0,0,0.2); color: #ebebeb;">\n\
                <div style="text-align: left;margin: 5px 0px;">\n\
                        <span style="margin-left: 5px;vertical-align: middle;">\n\
                                <fieldset class="layui-elem-field layui-field-title">\n\
                                        <legend>设置国籍:</legend>\n\
                                </fieldset>\n\
                                <div style="color: #67c1f5;">请选择要设置的国籍:</div>\n\
                                <select id="nationalitySelectBox" style="padding: 4px 12px 4px 8px;font-size:12px;outline:0;border: 1px solid #34DEFF;background-color:transparent;color: #66ccff;">\n\
                                        <option name="CN" value="CN" style="color:#fff;background-color: #3E9AC6;">简体中文</option>\n\
                                        <option name="EN" value="EN" style="color:#fff;background-color: #3E9AC6;">英语</option>\n\
                                        <option name="JP" value="JP" style="color:#fff;background-color: #3E9AC6;">日语</option>\n\
                                        <option name="CN-SG" value="CN-SG" style="color:#fff;background-color: #3E9AC6;">马新简体(马来西亚,新加坡)[zh-sg]</option>\n\
                                        <option name="CN-HANT" value="CN-HANT" style="color:#fff;background-color: #3E9AC6;">繁體中文[zh-hant]</option>\n\
                                        <option name="CN-HK" value="CN-HK" style="color:#fff;background-color: #3E9AC6;">繁體中文(香港)[zh-hk]</option>\n\
                                        <option name="CN-MO" value="CN-MO" style="color:#fff;background-color: #3E9AC6;">繁體中文(澳门)[zh-mo]</option>\n\
                                        <option name="CN-TW" value="CN-TW" style="color:#fff;background-color: #3E9AC6;">繁體中文(台湾)[zh-tw]</option>\n\
                                </select>\n\
                                <button id="setNationality">为选择的好友设置国籍标识</button>\n\
                        </span>\n\
                        <span style="margin-left: 5px;vertical-align: top;">\n\
                                <button id="unsetNationality">为选择的好友取消国籍标识</button>\n\
                        </span>\n\
                        <br />\n\
                         <fieldset class="layui-elem-field layui-field-title">\n\
                                <legend>设置不留言:</legend>\n\
                         </fieldset>\n\
                        <div style="margin-left: 5px;vertical-align: top;margin-top:5px;">\n\
                                <span>\n\
                                        <button id="setNoLeave">为选择的好友设置不留言</button>\n\
                                </span>\n\
                                <span>\n\
                                        <button id="unsetNoLeave">为选择的好友取消设置不留言</button>\n\
                                </span>\n\
                        </div>\n\
                        <fieldset class="layui-elem-field layui-field-title">\n\
                                <legend>设置留言时间间隔:</legend>\n\
                        </fieldset>\n\
                        <div id="">只选择日期则过n天后再留言，只选择时间则过x时后再留言(严格模式)，日期和时间都选择了则过n天x时后再留言(严格模式)</div>\n\
                        <div id="">这里其实是一个时间差，比如指定的好友3天留言一次，今天是4月10日，你就选择4月13日就行了，这样做方便一点</div>\n\
                        <div class="layui-form">\n\
                          <div class="layui-form-item">\n\
                                <div class="layui-inline" style="opacity:0;filter: alpha(opacity=0);position: absolute;z-index: 0;">\n\
                                  <label class="layui-form-label">请选择留言</label> <!--这个是被点击对象，隐藏、不占空间、触发事件-->\n\
                                  <div class="layui-input-inline">\n\
                                        <input type="text" class="layui-input" id="test-limit2" readonly="" placeholder="yyyy-MM-dd">\n\
                                  </div>\n\
                                </div>\n\
                                <div class="layui-inline" style="position: relative;z-index: -1;">\n\
                                  <label class="layui-form-label">留言日期差</label> <!--这个是克隆出来的对象，显示，占空间、被覆盖，不触发事件-->\n\
                                  <div class="layui-input-inline">\n\
                                        <input type="text" class="layui-input" id="test-limit1" readonly="" placeholder="yyyy-MM-dd">\n\
                                  </div>\n\
                                </div>\n\
                                \n\
                          </div>\n\
                        </div>\n\
                        <div style="margin-left: 5px;vertical-align: top;margin-top:5px;">\n\
                                <span>\n\
                                        <button id="setTimeInterval">为选择的好友设置留言时间间隔</button>\n\
                                </span>\n\
                                <span>\n\
                                        <button id="unsetTimeInterval">为选择的好友取消设置留言时间间隔</button>\n\
                                </span>\n\
                        </div>\n\
                        \n\
                        <fieldset class="layui-elem-field layui-field-title">\n\
                           <legend>设置自动留言计划:</legend>\n\
                        </fieldset>\n\
                        <div class="layui-form">\n\
                          <div class="layui-form-item">\n\
                                <div class="layui-inline" style="opacity:0;filter: alpha(opacity=0);position: absolute;z-index: 0;">\n\
                                        <label class="layui-form-label">请选择时间</label>  <!--这个是被点击对象，隐藏、不占空间、触发事件-->\n\
                                        <div class="layui-input-inline">\n\
                                                <input type="text" class="layui-input" id="test14" placeholder="H时m分s秒">\n\
                                        </div>\n\
                                </div>\n\
                                <div class="layui-inline" style="position: relative;z-index: -1;">\n\
                                        <label class="layui-form-label">请选择时间</label> <!--这个是克隆出来的对象，显示，占空间、被覆盖，不触发事件-->\n\
                                        <div class="layui-input-inline">\n\
                                                <input type="text" class="layui-input" id="test15" placeholder="H时m分s秒">\n\
                                        </div>\n\
                                </div>\n\
                          </div>\n\
                        </div>\n\
                        \n\
                        <table class="layui-hide" id="test" lay-filter="test"></table> <!-- 数据表格 -->\n\
                        \n\
                        <fieldset class="layui-elem-field layui-field-title">\n\
                                <legend>设置好友分组:</legend>\n\
                        </fieldset>\n\
                        <div style="margin-left: 5px;vertical-align: top;margin-top:5px;">\n\
                        \n\
                        <form class="layui-form" action="">\n\
                          <div class="layui-form-item">\n\
                                <div class="layui-inline">\n\
                                  <label class="layui-form-label">分组列表</label>\n\
                                  <div class="layui-input-inline">\n\
                                        <select name="modules" lay-verify="required" lay-search="">\n\
                                          <option value="">直接选择或搜索选择</option>\n\
                                          <option value="1">分组名称</option>\n\
                                          <option value="2">分组名称</option>\n\
                                          <option value="3">分组名称</option>\n\
                                          <option value="4">分组名称</option>\n\
                                          <option value="5">分组名称</option>\n\
                                          <option value="6">分组名称</option>\n\
                                          <option value="7">分组名称</option>\n\
                                          <option value="8">分组名称</option>\n\
                                          <option value="9">分组名称</option>\n\
                                        </select>\n\
                                  </div>\n\
                                  <button type="button" class="layui-btn" id="editFriendGroup">编辑列表</button>\n\
                                </div>\n\
                          </div>\n\
                        </form>\n\
                        \n\
                                <span>\n\
                                        <button id="addFriendToGroup">为选择的好友添加分组</button>\n\
                                </span>\n\
                                <span>\n\
                                        <button id="unaddFriendToGroup">为选择的好友取消添加分组</button>\n\
                                </span>\n\
                                \n\
                                <div class="layui-collapse" lay-filter="test">\n\
                                  <div class="layui-colla-item">\n\
                                        <h2 class="layui-colla-title">分组名称</h2>\n\
                                        <div class="layui-colla-content">\n\
                                          <p>用户</p>\n\
                                          <p>用户</p>\n\
                                          <p>用户</p>\n\
                                        </div>\n\
                                  </div>\n\
                                  <div class="layui-colla-item">\n\
                                        <h2 class="layui-colla-title">分组名称</h2>\n\
                                        <div class="layui-colla-content">\n\
                                          <p>用户</p>\n\
                                          <p>用户</p>\n\
                                          </p>\n\
                                        </div>\n\
                                  </div>\n\
                                  <div class="layui-colla-item">\n\
                                        <h2 class="layui-colla-title">分组名称</h2>\n\
                                        <div class="layui-colla-content">\n\
                                          <p>用户</p>\n\
                                          <p>用户</p>\n\
                                        </div>\n\
                                  </div>\n\
                                  <div class="layui-colla-item">\n\
                                        <h2 class="layui-colla-title">分组名称</h2>\n\
                                        <div class="layui-colla-content">\n\
                                          <p>用户</p>\n\
                                        </div>\n\
                                  </div>\n\
                                </div>\n\
                                \n\
                        </div>\n\
                </div>\n\
          <div id="laydateDemo"></div>\n\
          <div id="log1">\n\
                <span id="log_head1"></span>\n\
                <span id="log_body1" style="display:inline-block;width:100%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; /*超出部分用...代替*/"></span>\n\
          </div>\n\
        </div>\n\
        \n\
        <div class="layui-tab-item" style="background-color: rgba(0,0,0,0.2); color: #ebebeb;">\n\
          \n\
          <span style="margin-left: 5px;vertical-align: top;">\n\
                <button id="NationalityGroup">按国籍进行高亮分组</button>\n\
          </span>\n\
          <span style="margin-left: 5px;vertical-align: top;">\n\
                <button id="NationalitySortGroup">按国籍进行排序分组(慢)</button>\n\
          </span>\n\
          <span style="margin-left: 5px;vertical-align: top;">\n\
                <button id="OfflineTimeGroup">按在线时间进行排序分组</button>\n\
          </span>\n\
          <span style="margin-left: 5px;vertical-align: top;">\n\
                <button id="ShowFriendData">显示好友详细数据-不可用</button>\n\
          </span>\n\
          <div class="layui-tab" lay-filter="test1">\n\
                <ul class="layui-tab-title">\n\
                  <li class="layui-this" lay-id="11" style="color:#ebebeb;">好友数据统计</li>\n\
                  <li lay-id="22" style="color:#ebebeb;">留言数据统计</li>\n\
                  <li lay-id="33" style="color:#ebebeb;">关系网统计</li>\n\
                  <li lay-id="44" style="color:#ebebeb;">当前配置统计</li>\n\
                  <li lay-id="55" style="color:#ebebeb;">查看好友配置统计</li>\n\
                </ul>\n\
                <div class="layui-tab-content">\n\
                        <div class="layui-tab-item layui-show">\n\
                                <span>数据表格(汇总所有的数据:id,名称,备注,国籍(语言),等级,好友数量,游戏数量,dlc数量,创意工坊数量,艺术作品数量,动态数量)</span>\n\
                                <table class="layui-hide" id="friendStatistics" lay-filter="friendStatistics"></table> <!--数据表格-->\n\
                                <div id="container_friendStatistics" style="width: 600px;height:400px;"></div>\n\
                        </div>\n\
                        <div class="layui-tab-item">\n\
                                <span>分为:</span>\n\
                                <span>按国籍的饼图(总留言数量)，</span>\n\
                                <span>按每天留言数据的折线图(统计所有的留言数据，生成的折线图)，</span>\n\
                                <span>按最多留言数据的柱状图(那些好友一天留言数量排行榜/那些好友总留言数量排行榜/累计连续每天留言数量最多)，</span>\n\
                                <span>数据表格(汇总所有的数据)</span>\n\
                                <div id="container_commentStatistics" style="min-width:400px;height:400px"></div>\n\
                        </div>\n\
                        <div class="layui-tab-item">\n\
                                <span>好友关系网(仅统计共同好友)</span>\n\
                                <div id="container_relationshipStatistics" style="min-width: 320px;max-width: 800px;margin: 0 auto;"></div>\n\
                        </div>\n\
                        <div class="layui-tab-item">\n\
                                <span>当前的配置数据和运行状态</span>\n\
                                <div id="container_currConfStatistics"></div>\n\
                        </div>\n\
                        <div class="layui-tab-item">\n\
                                <span>对好友设置的配置数据(比如国籍,不留言,留言时间间隔等)</span>\n\
                                <div id="container_friConfStatistics"></div>\n\
                        </div>\n\
                  </div>\n\
          </div>\n\
          \n\
          <div id="pageDemo"></div>\n\
        </div>\n\
        \n\
        <div class="layui-tab-item" style="background-color: rgba(0,0,0,0.2); color: #ebebeb;">\n\
          <fieldset class="layui-elem-field">\n\
                <legend>动态点赞助手</legend>\n\
                         <form class="layui-form" action="" lay-filter="example">\n\
                                 <div class="layui-form-item" pane="">\n\
                                        <label class="layui-form-label">总开关</label>\n\
                                        <div class="layui-input-block">\n\
                                                <!-- checked="" -->\n\
                                          <input type="checkbox" name="close" lay-skin="switch" lay-filter="switchTest" title="开关" lay-text="开启|关闭" id="friendActivitySwitch">\n\
                                        </div>\n\
                                  </div>\n\
                          </form>\n\
                <div class="layui-field-box">\n\
                        <fieldset class="layui-elem-field layui-field-title">\n\
                           <legend>设置点赞内容:</legend>\n\
                        </fieldset>\n\
                        <form class="layui-form" action="">\n\
                                <div class="layui-form-item">\n\
                                        <label class="layui-form-label">点赞内容:</label>\n\
                                        <div class="layui-row">\n\
                                           <div class="layui-input-block">\n\
                                                         <div class="layui-input-block" style="display:inline-block; margin-left:0px; vertical-align:top;">\n\
                                                                  <input type="checkbox" name="like[1]" lay-skin="primary" title="朋友发布了状态" checked=""><br>\n\
                                                                  <input type="checkbox" name="like[2]" lay-skin="primary" title="朋友发布了评测" checked=""><br>\n\
                                                                  <input type="checkbox" name="like[3]" lay-skin="primary" title="朋友购买了游戏或者DLC" checked=""><br>\n\
                                                                  <input type="checkbox" name="like[4]" lay-skin="primary" title="组发布了通知" checked=""><br>\n\
                                                                  <input type="checkbox" name="like[5]" lay-skin="primary" title="组发布了活动" checked=""><br>\n\
                                                         </div>\n\
                                                        <div class="layui-input-block" style="display:inline-block; margin-left:0px; vertical-align:top;">\n\
                                                                  <input type="checkbox" name="like[6]" lay-skin="primary" title="朋友发布了艺术作品" checked=""><br>\n\
                                                                  <input type="checkbox" name="like[7]" lay-skin="primary" title="朋友发布了创意工坊作品" checked=""><br>\n\
                                                                  <input type="checkbox" name="like[8]" lay-skin="primary" title="朋友发布了指南" checked=""><br>\n\
                                                                  <input type="checkbox" name="like[9]" lay-skin="primary" title="朋友上传了载图" checked=""><br>\n\
                                                                  <input type="checkbox" name="like[10]" lay-skin="primary" title="朋友上传了视频" checked=""><br>\n\
                                                        </div>\n\
                                                        <div class="layui-input-block" style="display:inline-block; margin-left:0px; vertical-align:top;">\n\
                                                                  <input type="checkbox" name="like[11]" lay-skin="primary" title="朋友收藏了艺术作品" checked=""><br>\n\
                                                                  <input type="checkbox" name="like[12]" lay-skin="primary" title="朋友收藏了创意工坊作品" checked=""><br>\n\
                                                                  <input type="checkbox" name="like[13]" lay-skin="primary" title="朋友收藏了指南" checked=""><br>\n\
                                                                  <input type="checkbox" name="like[14]" lay-skin="primary" title="朋友收藏了载图" checked=""><br>\n\
                                                                  <input type="checkbox" name="like[15]" lay-skin="primary" title="朋友收藏了视频" checked=""><br>\n\
                                                        </div>\n\
                                           </div>\n\
                                          </div>\n\
                                  </div>\n\
                         </form>\n\
                        <fieldset class="layui-elem-field layui-field-title">\n\
                           <legend>设置自动点赞模式:</legend>\n\
                        </fieldset>\n\
                        <form class="layui-form" action="">\n\
                                <div class="layui-form-item">\n\
                                        <label class="layui-form-label">点赞模式:</label>\n\
                                        <div class="layui-input-block">\n\
                                          <input type="checkbox" name="like[1]" lay-skin="primary" title="运行后自动开始点赞" checked=""><br>\n\
                                          <input type="checkbox" name="like[2]" lay-skin="primary" title="点赞完成后自动刷新并点赞新动态时间间隔" checked=""><br>\n\
                                        </div>\n\
                                  </div>\n\
                         </form>\n\
                        <fieldset class="layui-elem-field layui-field-title">\n\
                           <legend>设置自动点赞时间区间(默认今天~之前所有的动态内容)</legend>\n\
                        </fieldset>\n\
                        <div class="layui-form">\n\
                          <div class="layui-form-item">\n\
                                        <div class="layui-inline">\n\
                                          <label class="layui-form-label">请选择范围</label>\n\
                                          <div class="layui-input-inline">\n\
                                                <input type="text" class="layui-input" id="test-limit3" readonly="" placeholder=" ~ "> <!--placeholder="yyyy-MM-dd"-->\n\
                                          </div>\n\
                                        </div>\n\
                          </div>\n\
                        </div>\n\
                        <fieldset class="layui-elem-field layui-field-title" style="margin-top: 30px;">\n\
                          <legend style="color:#66ccff;">点赞进度时间线</legend>\n\
                        </fieldset>\n\
                        <ul class="layui-timeline">\n\
                          <li class="layui-timeline-item">\n\
                                <i class="layui-icon layui-timeline-axis"></i>\n\
                                <div class="layui-timeline-content layui-text">\n\
                                  <h3 class="layui-timeline-title" style="color:#66ccff;">8月18日</h3>\n\
                                  <p style="color:#fff;">\n\
                                        <span>已点赞状态x条，点赞发布艺术作品x条，点赞收藏艺术作品x条</span>\n\
                                        <br><span>已点赞评测x条，点赞发布创意工坊x条，点赞收藏创意工坊x条</span>\n\
                                        <br><span>已点赞购买状态x条，点赞发布指南x条，点赞收藏指南x条</span>\n\
                                        <br><span>已点赞组通知x条，点赞上次载图x条，点赞收藏载图x条</span>\n\
                                        <br><span>已点赞组活动x条，点赞上传视频x条，点赞收藏视频x条</span>\n\
                                  </p>\n\
                                </div>\n\
                          </li>\n\
                          <li class="layui-timeline-item">\n\
                                <i class="layui-icon layui-timeline-axis"></i>\n\
                                <div class="layui-timeline-content layui-text">\n\
                                  <h3 class="layui-timeline-title" style="color:#66ccff;">8月16日</h3>\n\
                                  <p style="color:#fff;">杜甫的思想核心是儒家的仁政思想，他有"致君尧舜上，再使风俗淳"的宏伟抱负。个人最爱的名篇有：</p>\n\
                                  <ul style="color:#fff;">\n\
                                        <li>《登高》</li>\n\
                                        <li>《茅屋为秋风所破歌》</li>\n\
                                  </ul>\n\
                                </div>\n\
                          </li>\n\
                          <li class="layui-timeline-item">\n\
                                <i class="layui-icon layui-timeline-axis"></i>\n\
                                <div class="layui-timeline-content layui-text">\n\
                                  <h3 class="layui-timeline-title" style="color:#66ccff;">8月15日</h3>\n\
                                  <p style="color:#fff;">\n\
                                        <span>中国人民抗日战争胜利日</span>\n\
                                        <br><span>常常在想，尽管对这个国家有这样那样的抱怨，但我们的确生在了最好的时代</span>\n\
                                        <br><span>铭记、感恩</span>\n\
                                        <br><span>所有为中华民族浴血奋战的英雄将士</span>\n\
                                        <br><span>永垂不朽</span>\n\
                                  </p>\n\
                                </div>\n\
                          </li>\n\
                          <li class="layui-timeline-item">\n\
                                <i class="layui-icon layui-timeline-axis"></i>\n\
                                <div class="layui-timeline-content layui-text">\n\
                                  <div class="layui-timeline-title" style="color:#66ccff;">过去</div>\n\
                                </div>\n\
                          </li>\n\
                        </ul>\n\
                </div>\n\
          </fieldset>\n\
        </div>\n\
        \n\
        <div class="layui-tab-item" style="background-color: rgba(0,0,0,0.2); color: #ebebeb;">\n\
          <fieldset class="layui-elem-field">\n\
                <legend>喜加一助手</legend>\n\
                <div class="layui-field-box">\n\
                        <!-- <div>是否启动喜加一助手</div> -->\n\
                <form class="layui-form" action="" lay-filter="example">\n\
                        <div class="layui-form-item" pane="">\n\
                           <label class="layui-form-label">总开关</label>\n\
                           <div class="layui-input-block">\n\
                                <!-- checked="" -->\n\
                                 <input type="checkbox" name="close" lay-skin="switch" lay-filter="switchTest2" title="开关" lay-text="开启|关闭" id="FreeGameSwitch">\n\
                           </div>\n\
                         </div>\n\
                </form>\n\
                <form class="layui-form" action="">\n\
                        <div class="layui-form-item">\n\
                                <label class="layui-form-label">设置:</label>\n\
                                <div class="layui-row">\n\
                                   <div class="layui-input-block">\n\
                                                 <div class="layui-input-block" style="display:inline-block; margin-left:0px; vertical-align:top;">\n\
                                                          <input type="checkbox" name="like[1]" lay-skin="primary" title="自动获取喜加一信息" checked=""><br>\n\
                                                 </div>\n\
                                                <div class="layui-input-block" style="display:inline-block; margin-left:0px; vertical-align:top;">\n\
                                                          <input type="checkbox" name="like[6]" lay-skin="primary" title="自动领取喜加一游戏" checked=""><br>\n\
                                                </div>\n\
                                                <div class="layui-input-block" style="display:inline-block; margin-left:0px; vertical-align:top;">\n\
                                                          <input type="checkbox" name="like[11]" lay-skin="primary" title="置顶显示在上方" checked=""><br>\n\
                                                </div>\n\
                                   </div>\n\
                                  </div>\n\
                          </div>\n\
                 </form>\n\
                 \n\
                 <div>设置喜加一数据来源</div>\n\
                 <form class="layui-form" action="">\n\
                        <div class="layui-form-item">\n\
                                <label class="layui-form-label">设置:</label>\n\
                                <div class="layui-row">\n\
                                   <div class="layui-input-block">\n\
                                                 <div class="layui-input-block" style="display:inline-block; margin-left:0px; vertical-align:top;">\n\
                                                          <input type="checkbox" name="like[1]" lay-skin="primary" title="SteamDB" checked=""><br>\n\
                                                 </div>\n\
                                                <div class="layui-input-block" style="display:inline-block; margin-left:0px; vertical-align:top;">\n\
                                                          <input type="checkbox" name="like[6]" lay-skin="primary" title="humblebundle" disabled=""><br>\n\
                                                </div>\n\
                                                <div class="layui-input-block" style="display:inline-block; margin-left:0px; vertical-align:top;">\n\
                                                          <input type="checkbox" name="like[11]" lay-skin="primary" title="fanatical" disabled=""><br>\n\
                                                </div>\n\
                                   </div>\n\
                                  </div>\n\
                          </div>\n\
                  </form>\n\
                </div>\n\
          </fieldset>\n\
        </div>\n\
        \n\
        <div class="layui-tab-item" style="background-color: rgba(0,0,0,0.2); color: #ebebeb;">\n\
                <fieldset class="layui-elem-field">\n\
                  <legend>功能设置</legend>\n\
                  <div class="layui-field-box">\n\
                          \n\
                          <form class="layui-form" action="" lay-filter="example">\n\
                                  <div class="layui-form-item" pane="">\n\
                                         <label class="layui-form-label">Debug模式</label>\n\
                                         <div class="layui-input-block">\n\
                                                                                                        <!-- checked="" -->\n\
                                           <input type="checkbox" name="close" lay-skin="switch" lay-filter="switchTest3" title="开关" lay-text="开启|关闭">\n\
                                         </div>\n\
                                   </div>\n\
                          </form>\n\
                                <div>弹出层</div>\n\
                                <div>滑块</div>\n\
                                <button type="button" class="layui-btn">导入导出重置当前设置</button>\n\
                                <div>弹出层</div>\n\
                                \n\
                                <div class="layui-upload-drag" id="uploadDemo">\n\
                                  <i class="layui-icon"></i>\n\
                                  <p>点击上传，或将文件拖拽到此处</p>\n\
                                  <div class="layui-hide" id="uploadDemoView">\n\
                                        <hr>\n\
                                        <img src="" alt="上传成功后渲染" style="max-width: 100%">\n\
                                  </div>\n\
                                </div>\n\
                  </div>\n\
                </fieldset>\n\
                \n\
                <fieldset class="layui-elem-field">\n\
                        <legend>界面设置</legend>\n\
                        <div class="layui-field-box">\n\
                                \n\
                                <fieldset class="layui-elem-field layui-field-title">\n\
                                <legend>语言配置</legend>\n\
                                <div id="selectLanguageDropdown" class="localizationTool"></div>\n\
                                        <button type="button" class="layui-btn">自动检测(简体中文)</button>\n\
                                        <button type="button" class="layui-btn">简体中文</button>\n\
                                        <button type="button" class="layui-btn">繁体中文</button>\n\
                                        <button type="button" class="layui-btn">English</button>\n\
                                </fieldset>\n\
                                \n\
                                <fieldset class="layui-elem-field layui-field-title">\n\
                                        <legend>主题切换</legend>\n\
                                        <div>请选择一个主题，然后点击应用</div>\n\
                                        <button type="button" class="layui-btn">应用主题</button>\n\
                                </fieldset>\n\
                                \n\
                                <fieldset class="layui-elem-field layui-field-title">\n\
                                        <legend>UI设置</legend>\n\
                                        <div>预览:</div>\n\
                                        <div>\n\
                                        <span>主要字体颜色:</span>\n\
                                                <span style="margin-left: 30px;">\n\
                                                        <input type="hidden" name="color" value="" id="test-all-input">\n\
                                                        <div id="test-all1"></div>\n\
                                                </span>\n\
                                        </div>\n\
                                        \n\
                                        <div>\n\
                                        <span>主要背景颜色:</span>\n\
                                                <span style="margin-left: 30px;">\n\
                                                        <input type="hidden" name="color" value="" id="test-all-input">\n\
                                                        <div id="test-all2"></div>\n\
                                                </span>\n\
                                        </div>\n\
                                        \n\
                                        <div>\n\
                                        <span>留言成功字体颜色:</span>\n\
                                                <span style="margin-left: 30px;">\n\
                                                        <input type="hidden" name="color" value="" id="test-all-input">\n\
                                                        <div id="test-all3"></div>\n\
                                                </span>\n\
                                        </div>\n\
                                        \n\
                                        <div>\n\
                                        <span>留言失败字体颜色:</span>\n\
                                                <span style="margin-left: 30px;">\n\
                                                        <input type="hidden" name="color" value="" id="test-all-input">\n\
                                                        <div id="test-all4"></div>\n\
                                                </span>\n\
                                        </div>\n\
                                        \n\
                                        <div>\n\
                                        <span>留言发生错误字体颜色:</span>\n\
                                                <span style="margin-left: 30px;">\n\
                                                        <input type="hidden" name="color" value="" id="test-all-input">\n\
                                                        <div id="test-all5"></div>\n\
                                                </span>\n\
                                        </div>\n\
                                        \n\
                                        <button type="button" class="layui-btn">保存为主题</button>\n\
                                </fieldset>\n\
                                \n\
                        </div>\n\
                </fieldset>\n\
                \n\
                <fieldset class="layui-elem-field">\n\
                        <legend>关于SteamAssistant(Steam小助手)</legend>\n\
                                <div class="layui-field-box">\n\
                                        <fieldset class="layui-elem-field layui-field-title">\n\
                                        <legend>程序信息:</legend>\n\
                                        <div>当前版本:v0.2.3.0</div>\n\
                                        <div>主程序框架更新时间:2020年4月19日</div>\n\
                                        <div>common模块:2020年4月19日</div>\n\
                                        <div>databaseConf模块:2020年4月19日</div>\n\
                                        <div>externalApis模块:2020年4月19日</div>\n\
                                        <div>steamApis模块:2020年4月19日</div>\n\
                                        <div>translateApis模块:2020年4月19日</div>\n\
                                        <div>Utility模块:2020年4月19日</div>\n\
                                        <div>UI模块:2020年4月19日</div>\n\
                                        <div>Event模块:2020年4月19日</div>\n\
                                        <div>CityList模块:2020年4月19日</div>\n\
                                        <fieldset class="layui-elem-field layui-field-title">\n\
                                        <legend>联系作者:</legend>\n\
                                        <button type="button" class="layui-btn">反馈错误</button>\n\
                                        <button type="button" class="layui-btn">提交建议</button>\n\
                                </div>\n\
                </fieldset>\n\
                \n\
                <div id="sliderDemo" style="margin: 50px 20px;"></div>\n\
        </div>\n\
        \n\
        </div>\n\
</div>\n\
';

var mainUI_template = '\
<script type="text/html" id="switchTpl">\n\
        <!-- 这里的 checked 的状态只是演示 -->\n\
        <input type="checkbox" name="front" value="{{d.id}}" lay-skin="switch" lay-text="是|否" lay-filter="frontDemo" {{ d.id == 10003 ? \'checked\' : \'\' }}>\n\
</script>\n\
\n\
<script type="text/html" id="checkboxTpl">\n\
        <!-- 这里的 checked 的状态只是演示 -->\n\
        <input type="checkbox" name="lock" value="{{d.id}}" title="锁定" lay-filter="lockDemo" {{ d.id == 10006 ? \'checked\' : \'\' }}>\n\
</script>\n\
';

var winBaseFrame = '\
<div></div>\n\
';

/**
 * JS_library.js
 */

function wordCount(data) {
        var intLength = 0;
        for (var i = 0; i < data.length; i++) {
                if ((data.charCodeAt(i) < 0) || (data.charCodeAt(i) > 255))
                        intLength = intLength + 3;
                else
                        intLength = intLength + 1;
        }
        return intLength;
}

//var arrComment = []; /*id文本框的id, height文本框的高度, scrollTop存储收缩状态下的进度条, visible可见性*/
function inBoxShrinkage(id,type,mode = true){ /*参数: string 要伸缩的文本框id,boolean 是收缩还是伸展,boolean 需不需要重置滚动条(默认重置)*/
        var iArr = -1;
        for(let i=0;i<arrComment.length;i++){
                if(arrComment[i].id == id){
                        iArr = i; /*记录旧节点的下标*/
                        /*console.log('记录旧节点的下标','iArr',iArr);*/
                        break;
                }
        }
        if(iArr == -1){
                arrComment.push( {id: id, height: 0, scrollTop: 0, visible: true} ); /*没有找到则是新的节点,就添加*/
                iArr = arrComment.length - 1 ; /*设置新节点的下标*/
        }
        var nHeight = arrComment[iArr].height; /*裁切字符串获取下标*/
        if(nHeight==0){ /*第一次,没有指定的样式*/
                nHeight = document.getElementById('comment_textarea').scrollHeight + 'px'; /*对于每个节点使用当前高度*/
        }
        var commentText = document.getElementById(id);
        if (type == true){
                commentText.removeEventListener('propertychange', change, false);
                commentText.removeEventListener('input', change, false);
                commentText.removeEventListener('focus', change, false);
                commentText.scrollTop = 0;
                
                /*代码位于event.js translationText翻译按钮事件*/
                /*代码位于uiHandler.js 获取输入框和注册的scroll事件*/
                /*代码位于ui.js inBoxShrinkage()判断是否需要重新进行定位*/
                /*https://blog.csdn.net/zhengbo0/article/details/7629506*/
                /*https://www.jb51.net/article/104047.htm*/
                if((mode && arrComment[iArr].height > document.documentElement.clientHeight) || (mode && arrComment[iArr].visible == false)){
                        document.body.scrollTop = arrComment[iArr].scrollTop;
                        document.documentElement.scrollTop = arrComment[iArr].scrollTop;
                        console.log('重新进行定位');
                }
                commentText.style.height = '28px';
        }
        else if (type == false){
                autoTextarea(commentText);
                if(mode){
                        arrComment[iArr].scrollTop = document.documentElement.scrollTop; /*设置 存储收缩状态下的进度条*/
                }
                commentText.style.height = nHeight + 'px';
        }
        else if (type == 'test'){
                if(mode){
                        arrComment[iArr].scrollTop = document.documentElement.scrollTop; /*设置 存储收缩状态下的进度条*/
                }
                commentText.style.height = nHeight + 'px';
        }
}

var change;
var autoTextarea = function autoTextarea(elem, extra, maxHeight) {
        extra = extra || 0;
        var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
                isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),
                addEvent = function(type, callback) {
                        elem.addEventListener ?
                                elem.addEventListener(type, callback, false) :
                                elem.attachEvent('on' + type, callback);
                },
                getStyle = elem.currentStyle ? function(name) {
                        var val = elem.currentStyle[name];
                        if (name === 'height' && val.search(/px/i) !== 1) {
                                var rect = elem.getBoundingClientRect();
                                return rect.bottom - rect.top -
                                        parseFloat(getStyle('paddingTop')) -
                                        parseFloat(getStyle('paddingBottom')) + 'px';
                        };
                        return val;
                } : function(name) {
                        return getComputedStyle(elem, null)[name];
                },
                minHeight = parseFloat(getStyle('height'));
        elem.style.resize = 'none';
        
        change = function(e,id) {
                        var scrollTop, height,
                                padding = 0,
                                style = elem.style;
                        var obj = document.getElementById('strInBytes');
                        var commentText;
                        if(id == undefined || id == null)
                                commentText = document.getElementById(window.event.target.id);
                        else
                                commentText = document.getElementById(id);
                        var numText = wordCount(commentText.value);
                        obj.innerHTML =  "当前字符字节数: <span id='strInBytes_Text'>" + numText + '</span>/999';
                        if (wordCount(commentText.value) >= 1000) {
                                document.getElementById('strInBytes_Text').style.color = '#FF0000';
                                commentText.style.background = '#7C243E';
                                if(g_conf[0].isCommentRunStatus == false)/*如果正在留言则不清除(没有留言则清除)*/
                                        jQuery('#log_head').html('');
                                jQuery('#log_head').html("<br><b style='color:#2CD8D6;'>字数超标啦! 请保持在1000字符以下. " + '当前字数:' + numText + '<b>');
                                g_conf[0].isWarnInfo = true;
                        } else {
                                document.getElementById('strInBytes_Text').style.color = '#32CD32';
                                commentText.style.background = '#1b2838';
                                if(g_conf[0].isCommentRunStatus == false && g_conf[0].isWarnInfo == true){ /*没有留言并且有警告信息才清除*/
                                        jQuery('#log_head').html('');
                                        g_conf[0].isWarnInfo = false;
                                }
                        }
                        if (elem._length === elem.value.length) return;
                                elem._length = elem.value.length;
                        if (!isFirefox && !isOpera) {
                                padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
                        };
                        scrollTop = document.body.scrollTop || document.documentElement.scrollTop; /*定位到最后*/
                        elem.style.height = minHeight + 'px';
                        if (elem.scrollHeight >= minHeight) {
                                if (maxHeight && elem.scrollHeight > maxHeight) {
                                        height = maxHeight - padding;
                                        style.overflowY = 'auto';
                                } else {
                                        height = elem.scrollHeight - padding;
                                        style.overflowY = 'hidden';
                                };
                                style.height = height + extra + 'px';
                                var nHeight1 = height + extra;
                                /*console.log('nHeight1',nHeight1,'newStr',newStr);*/
                                /*https://blog.csdn.net/weixin_34281477/article/details/93702604*/
                                /*https://www.cnblogs.com/cblogs/p/9293522.html*/
                                /*https://www.w3school.com.cn/tiy/t.asp?f=jseg_replace_1*/
                                var iIndex;
                                for(let i=0;i<arrComment.length;i++)
                                {
                                        if(id == undefined || id == null){
                                                if(arrComment[i].id == window.event.target.id){
                                                        iIndex = i;
                                                        break;
                                                }
                                        }
                                        else{
                                                if(arrComment[i].id == id){
                                                        iIndex = i;
                                                        break;
                                                }
                                        }
                                }
                                
                                arrComment[iIndex].height = nHeight1;/*存储*/
                                scrollTop += parseInt(style.height) - elem.currHeight;
                                if(!isNaN(scrollTop)){
                                        document.body.scrollTop = scrollTop;
                                        document.documentElement.scrollTop = scrollTop;
                                }
                                elem.currHeight = parseInt(style.height);
                        };
        };
        addEvent('propertychange', change);
        addEvent('input', change);
        /*addEvent('focus', change);*/
        change();
};

function openThisAndCloseOtherAllinBoxShrinkage(id,type){ /*打开这个，关闭其他所有的inBoxShrinkage*/
        inBoxShrinkage(id,type); /*展开*/
        if(id != 'comment_textarea' && document.getElementById('comment_textarea') != null)
                inBoxShrinkage('comment_textarea',true,false);
        if(id != 'comment_textarea_en' && document.getElementById('comment_textarea_en') != null)
                inBoxShrinkage('comment_textarea_en',true,false);
        if(id != 'comment_textarea_jp' && document.getElementById('comment_textarea_jp') != null)
                inBoxShrinkage('comment_textarea_jp',true,false);
        if(id != 'comment_textarea_zhc' && document.getElementById('comment_textarea_zhc') != null)
                inBoxShrinkage('comment_textarea_zhc',true,false);
        if(id != 'comment_textarea_zh_sg' && document.getElementById('comment_textarea_zh_sg') != null)
                inBoxShrinkage('comment_textarea_zh_sg',true,false);
        if(id != 'comment_textarea_zh_hant' && document.getElementById('comment_textarea_zh_hant') != null)
                inBoxShrinkage('comment_textarea_zh_hant',true,false);
        if(id != 'comment_textarea_zh_hk' && document.getElementById('comment_textarea_zh_hk') != null)
                inBoxShrinkage('comment_textarea_zh_hk',true,false);
        if(id != 'comment_textarea_zh_mo' && document.getElementById('comment_textarea_zh_mo') != null)
                inBoxShrinkage('comment_textarea_zh_mo',true,false);
        if(id != 'comment_textarea_zh_tw' && document.getElementById('comment_textarea_zh_tw') != null)
                inBoxShrinkage('comment_textarea_zh_tw',true,false);
}

var inBoxonblurID = 0;
function addEmojiEvent(emojiCode)
{
        switch (inBoxonblurID){
                case 0:
                        let inObj = document.getElementById('comment_textarea');
                        inObj.value += ':' + emojiCode + ':'; /*添加表情*/
                        if(change != undefined)
                                change(null, 'comment_textarea'); /*统计翻译后的文字长度*/
                        break;
                case 1:
                        let inObj1 = document.getElementById('comment_textarea_en');
                        inObj1.value += ':' + emojiCode + ':'; /*添加表情*/
                        if(change != undefined)
                                change(null, 'comment_textarea_en'); /*统计翻译后的文字长度*/
                        break;
                case 2:
                        let inObj2 = document.getElementById('comment_textarea_jp');
                        inObj2.value += ':' + emojiCode + ':'; /*添加表情*/
                        if(change != undefined)
                                change(null, 'comment_textarea_jp'); /*统计翻译后的文字长度*/
                        break;
                case 3:
                        let inObj3 = document.getElementById('comment_textarea_zhc');
                        inObj3.value += ':' + emojiCode + ':'; /*添加表情*/
                        if(change != undefined)
                                change(null, 'comment_textarea_zhc'); /*统计翻译后的文字长度*/
                        break;
                case 4:
                        let inObj4 = document.getElementById('comment_textarea_zh_sg');
                        inObj4.value += ':' + emojiCode + ':'; /*添加表情*/
                        if(change != undefined)
                                change(null, 'comment_textarea_zh_sg'); /*统计翻译后的文字长度*/
                        break;
                case 5:
                        let inObj5 = document.getElementById('comment_textarea_zh_hant');
                        inObj5.value += ':' + emojiCode + ':'; /*添加表情*/
                        if(change != undefined)
                                change(null, 'comment_textarea_zh_hant'); /*统计翻译后的文字长度*/
                        break;
                case 6:
                        let inObj6 = document.getElementById('comment_textarea_zh_hk');
                        inObj6.value += ':' + emojiCode + ':'; /*添加表情*/
                        if(change != undefined)
                                change(null, 'comment_textarea_zh_hk'); /*统计翻译后的文字长度*/
                        break;
                case 7:
                        let inObj7 = document.getElementById('comment_textarea_zh_mo');
                        inObj7.value += ':' + emojiCode + ':'; /*添加表情*/
                        if(change != undefined)
                                change(null, 'comment_textarea_zh_mo'); /*统计翻译后的文字长度*/
                        break;
                case 8:
                        let inObj8 = document.getElementById('comment_textarea_zh_tw');
                        inObj8.value += ':' + emojiCode + ':'; /*添加表情*/
                        if(change != undefined)
                                change(null, 'comment_textarea_zh_tw'); /*统计翻译后的文字长度*/
                        break;
                default:
                        break;
        }
}
//----------------------------------------------------------------------------------------
function emojiFix() { /*修复表情*/
        console.log("表情开始修复...");
        let obj = document.getElementsByClassName("emoticon_popup es_emoticons")[0];
        if (obj != undefined) {
                obj.style.position = "relative";
                obj.style.zIndex = "999";
        }

        let obj1 = document.getElementsByClassName("emoticon_popup_ctn")[0];
        if (obj1 != undefined) {
                obj1.style.zIndex = "999";
        }

        let emojiObjArrs = document.getElementsByClassName("emoticon_option");
        if (emojiObjArrs.length > 0) {
                for (let i in emojiObjArrs) {
                        emojiObjArrs[i].onclick = function() {
                                addEmojiEvent(emojiObjArrs[i].getAttribute('data-emoticon'));
                        }
                }
                console.log("表情修复完毕!");
        }
        /*console.log("修复表情错误!");*/
}

function dvWidthFix() { /*用于修复PC端留言提示内容溢出导致布局发生错误的问题*/
        $("subpage_container").style.width = "calc(100% - 280px)";
}

function deleteSelectText(){ /*删除选择的文本*/
        window.getSelection().deleteFromDocument(); /*删除选择的文本*/
}

var _ySelectsObj;
function _ySelects($) {
        $.fn.ySelect = function(options) {
                
                var defaultOptions = {
                        placeholder: '请选择',
                        numDisplayed: 4,
                        overflowText: '{n} selected',
                        searchText: '搜索',
                        showSearch: true
                }
                if (typeof options == 'string') {
                        var settings = options;
                } else {
                        var settings = $.extend(true, {}, defaultOptions, options);
                }
                
                function ySelect(select, settings) {
                        this.$select = $(select);
                        this.settings = settings;
                        this.create();
                }
                ySelect.prototype = {
                        create: function() {
                                var multiple = this.$select.is('[multiple]') ? ' multiple' : '';
                                this.$select.wrap('<div class="fs-wrap' + multiple + '"></div>');
                                this.$select.before('<div class="fs-label-wrap"><div class="fs-label">' + this.settings.placeholder +
                                        '</div><span class="fs-arrow"></span></div>');
                                this.$select.before('<div class="fs-dropdown hidden"><div class="fs-options"></div></div>');
                                this.$select.addClass('hidden');
                                this.$wrap = this.$select.closest('.fs-wrap');
                                this.reload();
                        },
                        reload: function() {
                                if (this.settings.showSearch) {
                                        var search = '<div class="fs-search"><input type="search" placeholder="' + this.settings.searchText +
                                                '" /><span class="fs-selectAll"><i class="fa fa-check-square-o"></i></span></div>';
                                        this.$wrap.find('.fs-dropdown').prepend(search);
                                }
                                var choices = this.buildOptions(this.$select);
                                this.$wrap.find('.fs-options').html(choices);
                                this.reloadDropdownLabel();
                        },
                        destroy: function() {
                                this.$wrap.find('.fs-label-wrap').remove();
                                this.$wrap.find('.fs-dropdown').remove();
                                this.$select.unwrap().removeClass('hidden');
                        },
                        buildOptions: function($element) {
                                var $this = this;
                                var choices = '';
                                $element.children().each(function(i, el) {
                                        var $el = $(el);
                                        if ('optgroup' == $el.prop('nodeName').toLowerCase()) {
                                                choices += '<div class="fs-optgroup">';
                                                choices += '<div class="fs-optgroup-label">' + $el.prop('label') + '</div>';
                                                choices += $this.buildOptions($el);
                                                choices += '</div>';
                                        } else {
                                                var selected = $el.is('[selected]') ? ' selected' : '';
                                                choices += '<div class="fs-option' + selected + '" data-value="' + $el.prop('value') +
                                                        '"><span class="fs-checkbox"><i></i></span><div class="fs-option-label">' + $el.html() + '</div></div>';
                                        }
                                });
                                return choices;
                        },
                        reloadDropdownLabel: function() {
                                var settings = this.settings;
                                var labelText = [];
                                this.$wrap.find('.fs-option.selected').each(function(i, el) {
                                        labelText.push($(el).find('.fs-option-label').text());
                                });
                                if (labelText.length < 1) {
                                        labelText = settings.placeholder;
                                } else if (labelText.length > settings.numDisplayed) {
                                        labelText = settings.overflowText.replace('{n}', labelText.length);
                                } else {
                                        labelText = labelText.join(', ');
                                }
                                this.$wrap.find('.fs-label').html(labelText);
                                this.$select.change();
                        },
                        setwrap: function() {
                                return "123";
                        },
                }
                
                return this.each(function() {
                        var data = $(this).data('ySelect');
                        if (!data) {
                                data = new ySelect(this, settings);
                                _ySelectsObj = data;
                                $(this).data('ySelect', data);
                        }
                        if (typeof settings == 'string') {
                                data[settings]();
                        }
                });
        }
        window.ySelect = {
                'active': null,
                'idx': -1
        };

        function setIndexes($wrap) {
                $wrap.find('.fs-option:not(.hidden)').each(function(i, el) {
                        $(el).attr('data-index', i);
                        $wrap.find('.fs-option').removeClass('hl');
                });
                $wrap.find('.fs-search input').focus();
                window.ySelect.idx = -1;
        }

        function setScroll($wrap) {
                var $container = $wrap.find('.fs-options');
                var $selected = $wrap.find('.fs-option.hl');
                var itemMin = $selected.offset().top + $container.scrollTop();
                var itemMax = itemMin + $selected.outerHeight();
                var containerMin = $container.offset().top + $container.scrollTop();
                var containerMax = containerMin + $container.outerHeight();
                if (itemMax > containerMax) {
                        var to = $container.scrollTop() + itemMax - containerMax;
                        $container.scrollTop(to);
                } else if (itemMin < containerMin) {
                        var to = $container.scrollTop() - containerMin - itemMin;
                        $container.scrollTop(to);
                }
        }
        $(document).on('click', '.fs-selectAll', function() {
                $(this).parent().next().find('.fs-option.selected').click();
                $(this).parent().next().find('.fs-option').click();
                $(this).addClass('selected');
        });
        $(document).on('click', '.fs-selectAll.selected', function() {
                $(this).parent().next().find('.fs-option.selected').click();
                $(this).removeClass('selected');
        });
        $(document).on('click', '.fs-option', function() {
                var $wrap = $(this).closest('.fs-wrap');
                if ($wrap.hasClass('multiple')) {
                        var selected = [];
                        $(this).toggleClass('selected');
                        $wrap.find('.fs-option.selected').each(function(i, el) {
                                selected.push($(el).attr('data-value'));
                        });
                } else {
                        var selected = $(this).attr('data-value');
                        $wrap.find('.fs-option').removeClass('selected');
                        $(this).addClass('selected');
                        $wrap.find('.fs-dropdown').hide();
                }
                $wrap.find('select').val(selected);
                $wrap.find('select').ySelect('reloadDropdownLabel');
                $wrap.find('select').ySelect('setwrap');
        });
        $(document).on('keyup', '.fs-search input', function(e) {
                if (40 == e.which) {
                        $(this).blur();
                        return;
                }
                var $wrap = $(this).closest('.fs-wrap');
                var keywords = $(this).val();
                $wrap.find('.fs-option, .fs-optgroup-label').removeClass('hidden');
                if ('' != keywords) {
                        $wrap.find('.fs-option').each(function() {
                                var regex = new RegExp(keywords, 'gi');
                                if (null === $(this).find('.fs-option-label').text().match(regex)) {
                                        $(this).addClass('hidden');
                                }
                        });
                        $wrap.find('.fs-optgroup-label').each(function() {
                                var num_visible = $(this).closest('.fs-optgroup').find('.fs-option:not(.hidden)').length;
                                if (num_visible < 1) {
                                        $(this).addClass('hidden');
                                }
                        });
                }
                setIndexes($wrap);
        });
        $(document).on('click', function(e) {
                var $el = $(e.target);
                var $wrap = $el.closest('.fs-wrap');
                if (0 < $wrap.length) {
                        if ($el.hasClass('fs-label') || $el.hasClass('fs-arrow')) {
                                window.ySelect.active = $wrap;
                                var is_hidden = $wrap.find('.fs-dropdown').hasClass('hidden');
                                $('.fs-dropdown').addClass('hidden');
                                if (is_hidden) {
                                        $wrap.find('.fs-dropdown').removeClass('hidden');
                                } else {
                                        $wrap.find('.fs-dropdown').addClass('hidden');
                                }
                                setIndexes($wrap);
                        }
                } else {
                        $('.fs-dropdown').addClass('hidden');
                        window.ySelect.active = null;
                }
        });
        $(document).on('keydown', function(e) {
                var $wrap = window.ySelect.active;
                if (null === $wrap) {
                        return;
                } else if (38 == e.which) {
                        e.preventDefault();
                        $wrap.find('.fs-option').removeClass('hl');
                        if (window.ySelect.idx > 0) {
                                window.ySelect.idx--;
                                $wrap.find('.fs-option[data-index=' + window.ySelect.idx + ']').addClass('hl');
                                setScroll($wrap);
                        } else {
                                window.ySelect.idx = -1;
                                $wrap.find('.fs-search input').focus();
                        }
                } else if (40 == e.which) {
                        e.preventDefault();
                        var last_index = $wrap.find('.fs-option:last').attr('data-index');
                        if (window.ySelect.idx < parseInt(last_index)) {
                                window.ySelect.idx++;
                                $wrap.find('.fs-option').removeClass('hl');
                                $wrap.find('.fs-option[data-index=' + window.ySelect.idx + ']').addClass('hl');
                                setScroll($wrap);
                        }
                } else if (32 == e.which || 13 == e.which) {
                        $wrap.find('.fs-option.hl').click();
                } else if (27 == e.which) {
                        $('.fs-dropdown').addClass('hidden');
                        window.ySelect.active = null;
                }
        });
        $.fn.ySelectedValues = function(splitString) {
                var result = "";
                var $selects = this.find("option:selected");
                for (var i = 0; i < $selects.length; i++) {
                        result += $selects[i].value + ((i == $selects.length - 1) ? "" : splitString);
                }
                return result;
        }
        $.fn.ySelectedTexts = function(splitString) {
                var result = "";
                var $selects = this.find("option:selected");
                for (var i = 0; i < $selects.length; i++) {
                        result += $selects[i].text + ((i == $selects.length - 1) ? "" : splitString);
                }
                return result;
        }
}


const _RESMODE = {
        res_Tampermonkey: "Tampermonkey-Res",
        res_CDN: "CDN-CommonRequest",
        res_LocalVariables: "JS-LocalVariables"
};

const _RESTYPE = {
        res_css: "css",
        res_js: "js",
        res_json: "json"
};

/**
 * @param {String} strResID 资源id
 */
function getResConfByID(strResID){
        if(_resConf){
                for (let i = 0; i < _resConf.length; i++) {
                        if(_resConf[i].resID == strResID)
                                return _resConf[i].resInfo;
                }
                return new Error("[sophie] not find strResID.");
        }
        else{
                throw new Error("[sophie] _resConf is undefined.");
        }
}

function patchJS_layui(resData){
        //对 o.prototype.addcss 打补丁，使其直接return this, 而不是去加载css, css通过脚本欲加载的资源手动添加
        var findStr = 'layui.link(n.dir+"css/"+e,t,o)';
        var index = resData.indexOf(findStr); //查找代补丁代码的位置
        var fixJS = resData.slice(0,index); //提取 代补丁代码前部分
        fixJS += 'this'; //添加 补丁代码
        fixJS += resData.slice(index+findStr.length); //提取 代补丁代码后部分
        return fixJS;
}

const _resConf = [
        {
                resID: "BaseResources", //资源唯一id
                resInfo: [     //资源相关信息
                        {
                                resName: "css_layui",        //资源名称
                                resDescription: "layui库所需的css", //资源描述
                                res: [ //资源信息: 为了保证最大可用性, 资源可以从多种途径加载, 越前的资源加载优先级越高
                                        {
                                                resMode: _RESMODE.res_Tampermonkey,
                                                resType: _RESTYPE.res_css,
                                                isFight: false, // 同一个资源下，可以手动设置是否需要启动争抢模式，谁先加载完就使用谁的
                                                sourceInfo: ["css_layui"],
                                                onSucceed: null //如果获取资源成功后的回调函数(立刻触发，可用于取消加载资源，资源检查等)
                                        },
                                        {
                                                resMode: _RESTYPE.res_CDN,
                                                resType: _RESTYPE.res_css,
                                                isFight: false,
                                                sourceInfo: [
                                                        "https://www.layuicdn.com/layui-v2.5.6/css/layui.css",
                                                        "https://cdnjs.cloudflare.com/ajax/libs/layui/2.5.6/css/layui.css",
                                                        "https://cdn.90so.net/layui/2.5.6/css/layui.css",
                                                ],
                                                onSucceed: null //如果获取资源成功后的回调函数(立刻触发，可用于取消加载资源，资源检查等)
                                        }
                                ]
                        },
                        {
                                resName: "css_laydate",        //资源名称
                                resDescription: "layui库(laydate组件)所需的css", //资源描述
                                res: [ //资源信息: 为了保证最大可用性, 资源可以从多种途径加载, 越前的资源加载优先级越高
                                        {
                                                resMode: _RESMODE.res_Tampermonkey,
                                                resType: _RESTYPE.res_css,
                                                isFight: false, // 同一个资源下，可以手动设置是否需要启动争抢模式，谁先加载完就使用谁的
                                                sourceInfo: ["css_laydate"],
                                                onSucceed: null //如果获取资源成功后的回调函数(立刻触发，可用于取消加载资源，资源检查等)
                                        },
                                        {
                                                resMode: _RESTYPE.res_CDN,
                                                resType: _RESTYPE.res_css,
                                                isFight: false,
                                                sourceInfo: [
                                                        "https://www.layuicdn.com/layui-v2.5.6/css/modules/laydate/default/laydate.css?v=5.0.9",
                                                        "https://cdnjs.cloudflare.com/ajax/libs/layui/2.5.6/css/modules/laydate/default/laydate.css?v=5.0.9",
                                                        "https://cdn.90so.net/layui/2.5.6/css/modules/laydate/default/laydate.css?v=5.0.9",
                                                ],
                                                onSucceed: null //如果获取资源成功后的回调函数(立刻触发，可用于取消加载资源，资源检查等)
                                        }
                                ]
                        },
                        {
                                resName: "css_layer",        //资源名称
                                resDescription: "layui库(layer组件)所需的css", //资源描述
                                res: [ //资源信息: 为了保证最大可用性, 资源可以从多种途径加载, 越前的资源加载优先级越高
                                        {
                                                resMode: _RESMODE.res_Tampermonkey,
                                                resType: _RESTYPE.res_css,
                                                isFight: false, // 同一个资源下，可以手动设置是否需要启动争抢模式，谁先加载完就使用谁的
                                                sourceInfo: ["css_layer"],
                                                onSucceed: null //如果获取资源成功后的回调函数(立刻触发，可用于取消加载资源，资源检查等)
                                        },
                                        {
                                                resMode: _RESTYPE.res_CDN,
                                                resType: _RESTYPE.res_css,
                                                isFight: false,
                                                sourceInfo: [
                                                        "https://www.layuicdn.com/layui-v2.5.6/css/modules/layer/default/layer.css?v=3.1.1",
                                                        "https://cdnjs.cloudflare.com/ajax/libs/layui/2.5.6/css/modules/layer/default/layer.css?v=3.1.1",
                                                        "https://cdn.90so.net/layui/2.5.6/css/modules/layer/default/layer.css?v=3.1.1",
                                                ],
                                                onSucceed: null //如果获取资源成功后的回调函数(立刻触发，可用于取消加载资源，资源检查等)
                                        }
                                ]
                        },
                        {
                                resName: "css_layui_Modules",        //资源名称
                                resDescription: "layui库(组件)所需的css", //资源描述
                                res: [ //资源信息: 为了保证最大可用性, 资源可以从多种途径加载, 越前的资源加载优先级越高
                                        {
                                                resMode: _RESMODE.res_Tampermonkey,
                                                resType: _RESTYPE.res_css,
                                                isFight: false, // 同一个资源下，可以手动设置是否需要启动争抢模式，谁先加载完就使用谁的
                                                sourceInfo: ["css_layui_Modules"],
                                                onSucceed: null //如果获取资源成功后的回调函数(立刻触发，可用于取消加载资源，资源检查等)
                                        },
                                        {
                                                resMode: _RESTYPE.res_CDN,
                                                resType: _RESTYPE.res_css,
                                                isFight: false,
                                                sourceInfo: [
                                                        "https://www.layuicdn.com/layui-v2.5.6/css/modules/code.css",
                                                        "https://cdnjs.cloudflare.com/ajax/libs/layui/2.5.6/css/modules/code.css",
                                                        "https://cdn.90so.net/layui/2.5.6/css/modules/code.css",
                                                ],
                                                onSucceed: null //如果获取资源成功后的回调函数(立刻触发，可用于取消加载资源，资源检查等)
                                        }
                                ]
                        },
                        {
                                resName: "css_fontAwesome",        //资源名称
                                resDescription: "fontAwesome库所需的css", //资源描述
                                res: [ //资源信息: 为了保证最大可用性, 资源可以从多种途径加载, 越前的资源加载优先级越高
                                        {
                                                resMode: _RESMODE.res_Tampermonkey,
                                                resType: _RESTYPE.res_css,
                                                isFight: false, // 同一个资源下，可以手动设置是否需要启动争抢模式，谁先加载完就使用谁的
                                                sourceInfo: ["css_fontAwesome"],
                                                onSucceed: null //如果获取资源成功后的回调函数(立刻触发，可用于取消加载资源，资源检查等)
                                        },
                                        {
                                                resMode: _RESTYPE.res_CDN,
                                                resType: _RESTYPE.res_css,
                                                isFight: false,
                                                sourceInfo: [
                                                        "https://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css",
                                                        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css",
                                                        "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
                                                ],
                                                onSucceed: null //如果获取资源成功后的回调函数(立刻触发，可用于取消加载资源，资源检查等)
                                        }
                                ]
                        },
                        {
                                resName: "JS_highstock",        //资源名称
                                resDescription: "", //资源描述
                                res: [ //资源信息: 为了保证最大可用性, 资源可以从多种途径加载, 越前的资源加载优先级越高
                                        {
                                                resMode: _RESMODE.res_Tampermonkey,
                                                resType: _RESTYPE.res_js,
                                                isFight: false, // 同一个资源下，可以手动设置是否需要启动争抢模式，谁先加载完就使用谁的
                                                sourceInfo: ["JS_highstock"],
                                                onSucceed: null //如果获取资源成功后的回调函数(立刻触发，可用于取消加载资源，资源检查等)
                                        },
                                        {
                                                resMode: _RESTYPE.res_CDN,
                                                resType: _RESTYPE.res_js,
                                                isFight: false,
                                                sourceInfo: [
                                                        "https://code.highcharts.com.cn/highstock/highstock.js",
                                                        "https://cdnjs.cloudflare.com/ajax/libs/highcharts/8.1.0/highstock.min.js",
                                                        "https://cdn.bootcdn.net/ajax/libs/highcharts/8.1.0/highstock.js",
                                                ],
                                                onSucceed: null //如果获取资源成功后的回调函数(立刻触发，可用于取消加载资源，资源检查等)
                                        }
                                ]
                        },
                        {
                                resName: "JS_highstock_exporting",        //资源名称
                                resDescription: "", //资源描述
                                res: [ //资源信息: 为了保证最大可用性, 资源可以从多种途径加载, 越前的资源加载优先级越高
                                        {
                                                resMode: _RESMODE.res_Tampermonkey,
                                                resType: _RESTYPE.res_js,
                                                isFight: false, // 同一个资源下，可以手动设置是否需要启动争抢模式，谁先加载完就使用谁的
                                                sourceInfo: ["JS_highstock_exporting"],
                                                onSucceed: null //如果获取资源成功后的回调函数(立刻触发，可用于取消加载资源，资源检查等)
                                        },
                                        {
                                                resMode: _RESTYPE.res_CDN,
                                                resType: _RESTYPE.res_js,
                                                isFight: false,
                                                sourceInfo: [
                                                        "https://code.highcharts.com.cn/highcharts/modules/exporting.js",
                                                        "https://cdnjs.cloudflare.com/ajax/libs/highcharts/8.1.0/modules/exporting.min.js",
                                                        "https://cdn.bootcdn.net/ajax/libs/highcharts/8.1.0/modules/exporting.js",
                                                ],
                                                onSucceed: null //如果获取资源成功后的回调函数(立刻触发，可用于取消加载资源，资源检查等)
                                        }
                                ]
                        },
                        {
                                resName: "JS_highstock_oldie",        //资源名称
                                resDescription: "", //资源描述
                                res: [ //资源信息: 为了保证最大可用性, 资源可以从多种途径加载, 越前的资源加载优先级越高
                                        {
                                                resMode: _RESMODE.res_Tampermonkey,
                                                resType: _RESTYPE.res_js,
                                                isFight: false, // 同一个资源下，可以手动设置是否需要启动争抢模式，谁先加载完就使用谁的
                                                sourceInfo: ["JS_highstock_oldie"],
                                                onSucceed: null //如果获取资源成功后的回调函数(立刻触发，可用于取消加载资源，资源检查等)
                                        },
                                        {
                                                resMode: _RESTYPE.res_CDN,
                                                resType: _RESTYPE.res_js,
                                                isFight: false,
                                                sourceInfo: [
                                                        "https://code.highcharts.com.cn/highcharts/modules/oldie.js",
                                                        "https://cdnjs.cloudflare.com/ajax/libs/highcharts/8.1.0/modules/oldie.src.min.js",
                                                        "https://cdn.bootcdn.net/ajax/libs/highcharts/8.1.0/modules/oldie.js",
                                                ],
                                                onSucceed: null ,//如果获取资源成功后的回调函数(立刻触发，可用于取消加载资源，资源检查等)
                                        }
                                ]
                        },
                        {
                                resName: "JS_highstock_networkgraph",        //资源名称
                                resDescription: "", //资源描述
                                res: [ //资源信息: 为了保证最大可用性, 资源可以从多种途径加载, 越前的资源加载优先级越高
                                        {
                                                resMode: _RESMODE.res_Tampermonkey,
                                                resType: _RESTYPE.res_js,
                                                isFight: false, // 同一个资源下，可以手动设置是否需要启动争抢模式，谁先加载完就使用谁的
                                                sourceInfo: ["JS_highstock_networkgraph"],
                                                onSucceed: null //如果获取资源成功后的回调函数(立刻触发，可用于取消加载资源，资源检查等)
                                        },
                                        {
                                                resMode: _RESTYPE.res_CDN,
                                                resType: _RESTYPE.res_js,
                                                isFight: false,
                                                sourceInfo: [
                                                        "https://code.highcharts.com.cn/highcharts/modules/networkgraph.js",
                                                        "https://cdnjs.cloudflare.com/ajax/libs/highcharts/8.1.0/modules/networkgraph.min.js",
                                                        "https://cdn.bootcdn.net/ajax/libs/highcharts/8.1.0/modules/networkgraph.js",
                                                ],
                                                onSucceed: null //如果获取资源成功后的回调函数(立刻触发，可用于取消加载资源，资源检查等)
                                        }
                                ]
                        },
                        {
                                resName: "JS_highstock_zh_CN",        //资源名称
                                resDescription: "", //资源描述
                                res: [ //资源信息: 为了保证最大可用性, 资源可以从多种途径加载, 越前的资源加载优先级越高
                                        {
                                                resMode: _RESMODE.res_Tampermonkey,
                                                resType: _RESTYPE.res_js,
                                                isFight: false, // 同一个资源下，可以手动设置是否需要启动争抢模式，谁先加载完就使用谁的
                                                sourceInfo: ["JS_highstock_zh_CN"],
                                                onSucceed: null //如果获取资源成功后的回调函数(立刻触发，可用于取消加载资源，资源检查等)
                                        },
                                        {
                                                resMode: _RESTYPE.res_CDN,
                                                resType: _RESTYPE.res_js,
                                                isFight: false,
                                                sourceInfo: [
                                                        "https://code.highcharts.com.cn/highcharts-plugins/highcharts-zh_CN.js",
                                                ],
                                                onSucceed: null //如果获取资源成功后的回调函数(立刻触发，可用于取消加载资源，资源检查等)
                                        }
                                ]
                        },
                        {
                                resName: "JS_layui",        //资源名称
                                resDescription: "", //资源描述
                                res: [ //资源信息: 为了保证最大可用性, 资源可以从多种途径加载, 越前的资源加载优先级越高
                                        {
                                                resMode: _RESMODE.res_Tampermonkey,
                                                resType: _RESTYPE.res_js,
                                                isFight: false, // 同一个资源下，可以手动设置是否需要启动争抢模式，谁先加载完就使用谁的
                                                sourceInfo: ["JS_layui"],
                                                onSucceed: patchJS_layui //如果获取资源成功后的回调函数(立刻触发，可用于取消加载资源，资源检查等)
                                        },
                                        {
                                                resMode: _RESTYPE.res_CDN,
                                                resType: _RESTYPE.res_js,
                                                isFight: false,
                                                sourceInfo: [
                                                        "https://www.layuicdn.com/layui-v2.5.6/layui.all.js",
                                                        "https://cdnjs.cloudflare.com/ajax/libs/layui/2.5.6/layui.all.min.js",
                                                        "https://cdn.90so.net/layui/2.5.6/layui.all.js",
                                                ],
                                                onSucceed: patchJS_layui //如果获取资源成功后的回调函数(立刻触发，可用于取消加载资源，资源检查等)
                                        }
                                ]
                        },
                        {
                                resName: "JS_localforage",        //资源名称
                                resDescription: "", //资源描述
                                res: [ //资源信息: 为了保证最大可用性, 资源可以从多种途径加载, 越前的资源加载优先级越高
                                        {
                                                resMode: _RESMODE.res_Tampermonkey,
                                                resType: _RESTYPE.res_js,
                                                isFight: false, // 同一个资源下，可以手动设置是否需要启动争抢模式，谁先加载完就使用谁的
                                                sourceInfo: ["JS_localforage"],
                                                onSucceed: null //如果获取资源成功后的回调函数(立刻触发，可用于取消加载资源，资源检查等)
                                        },
                                        {
                                                resMode: _RESTYPE.res_CDN,
                                                resType: _RESTYPE.res_js,
                                                isFight: false,
                                                sourceInfo: [
                                                        "https://cdnjs.cloudflare.com/ajax/libs/localforage/1.7.3/localforage.min.js",
                                                        "https://cdn.90so.net/localforage/1.7.3/localforage.min.js",
                                                        "https://cdn.bootcdn.net/ajax/libs/localforage/1.7.3/localforage.min.js",
                                                ],
                                                onSucceed: null //如果获取资源成功后的回调函数(立刻触发，可用于取消加载资源，资源检查等)
                                        }
                                ]
                        },
                        {
                                resName: "css_jquery_localizationTool",        //资源名称
                                resDescription: "", //资源描述
                                res: [ //资源信息: 为了保证最大可用性, 资源可以从多种途径加载, 越前的资源加载优先级越高
                                        {
                                                resMode: _RESMODE.res_LocalVariables,
                                                resType: _RESTYPE.res_css,
                                                isFight: false, // 同一个资源下，可以手动设置是否需要启动争抢模式，谁先加载完就使用谁的
                                                sourceInfo: ["jquery_localizationTool_css"],
                                                onSucceed: null //如果获取资源成功后的回调函数(立刻触发，可用于取消加载资源，资源检查等)
                                        }
                                ]
                        },
                        {
                                resName: "js_jquery_localizationTool",        //资源名称
                                resDescription: "", //资源描述
                                res: [ //资源信息: 为了保证最大可用性, 资源可以从多种途径加载, 越前的资源加载优先级越高
                                        {
                                                resMode: _RESMODE.res_Tampermonkey,
                                                resType: _RESTYPE.res_js,
                                                isFight: false, // 同一个资源下，可以手动设置是否需要启动争抢模式，谁先加载完就使用谁的
                                                sourceInfo: ["Jquery_localizationtool"],
                                                onSucceed: null //如果获取资源成功后的回调函数(立刻触发，可用于取消加载资源，资源检查等)
                                        },
                                        {
                                                resMode: _RESTYPE.res_CDN,
                                                resType: _RESTYPE.res_js,
                                                isFight: false,
                                                sourceInfo: [
                                                        "https://greasyfork.org/scripts/403927-jquery-localizationtool-js/code/jquerylocalizationTooljs.js?version=808323",
                                                ],
                                                onSucceed: null //如果获取资源成功后的回调函数(立刻触发，可用于取消加载资源，资源检查等)
                                        }
                                ]
                        }
                ]
        },
        {
                resID: "ExpandResources", //资源唯一id
                resInfo: [     //资源相关信息
                        {
                                resName: "",        //资源名称
                                resDescription: "", //资源描述
                                res: [ //资源信息: 为了保证最大可用性, 资源可以从多种途径加载, 越前的资源加载优先级越高
                                        {
                                                resType: _RESTYPE.res_Tampermonkey,
                                                isFight: false, // 同一个资源下，可以手动设置是否需要启动争抢模式，谁先加载完就使用谁的
                                                sourceInfo: [
                                                        "",
                                                        "",
                                                ],
                                                onSucceed: null //如果获取资源成功后的回调函数(立刻触发，可用于取消加载资源，资源检查等)
                                        },
                                        {
                                                resType: _RESTYPE.res_CDN,
                                                isFight: false,
                                                sourceInfo: [
                                                        "",
                                                        "",
                                                ],
                                                onSucceed: null //如果获取资源成功后的回调函数(立刻触发，可用于取消加载资源，资源检查等)
                                        }
                                ]
                        },
                        {
                                resName: "",        //资源名称
                                resDescription: "", //资源描述
                                res: [ //资源信息: 为了保证最大可用性, 资源可以从多种途径加载, 越前的资源加载优先级越高
                                        {
                                                resType: _RESTYPE.res_Tampermonkey,
                                                isFight: false, // 同一个资源下，可以手动设置是否需要启动争抢模式，谁先加载完就使用谁的
                                                sourceInfo: [
                                                        "",
                                                        "",
                                                ],
                                                onSucceed: null //如果获取资源成功后的回调函数(立刻触发，可用于取消加载资源，资源检查等)
                                        },
                                        {
                                                resType: _RESTYPE.res_CDN,
                                                isFight: false,
                                                sourceInfo: [
                                                        "",
                                                        "",
                                                ],
                                                onSucceed: null //如果获取资源成功后的回调函数(立刻触发，可用于取消加载资源，资源检查等)
                                        }
                                ]
                        },
                        {
                                resName: "",        //资源名称
                                resDescription: "", //资源描述
                                res: [ //资源信息: 为了保证最大可用性, 资源可以从多种途径加载, 越前的资源加载优先级越高
                                        {
                                                resType: _RESTYPE.res_Tampermonkey,
                                                isFight: false, // 同一个资源下，可以手动设置是否需要启动争抢模式，谁先加载完就使用谁的
                                                sourceInfo: [
                                                        "",
                                                        "",
                                                ],
                                                onSucceed: null //如果获取资源成功后的回调函数(立刻触发，可用于取消加载资源，资源检查等)
                                        },
                                        {
                                                resType: _RESTYPE.res_CDN,
                                                isFight: false,
                                                sourceInfo: [
                                                        "",
                                                        "",
                                                ],
                                                onSucceed: null //如果获取资源成功后的回调函数(立刻触发，可用于取消加载资源，资源检查等)
                                        }
                                ]
                        }
                ]
        }
];


function injectJS(){
        var funcCode = "";
        funcCode += wordCount.toString() + "\n\n";
        funcCode += "var arrComment = []; /*id文本框的id, height文本框的高度, scrollTop存储收缩状态下的进度条, visible可见性*/" + "\n";
        funcCode += inBoxShrinkage.toString() + "\n\n";
        funcCode += "var change;" + "\n";
        funcCode += autoTextarea.toString() + "\n\n";
        funcCode += openThisAndCloseOtherAllinBoxShrinkage.toString() + "\n\n";
        funcCode += "var inBoxonblurID = 0;" + "\n";
        funcCode += addEmojiEvent.toString() + "\n\n";
        addNewScript('styles_Script',funcCode);
        
        var funcCode = "";
        funcCode += emojiFix.toString() + "\n\n";
        funcCode += dvWidthFix.toString() + "\n\n";
        funcCode += deleteSelectText.toString() + "\n\n";
        funcCode += _ySelects.toString() + "\n\n";
        addNewScript('Utility_Script',funcCode);
}

var languagesList_ExpandUI_QuickNavigationBar_html = {
'defaultLanguage' : 'auto_detected', /* (optional) although must be defined if you don't want en_GB */
'showFlag': false,            /* (optional) show/hide the flag 显示/隐藏旗帜 */
'showCountry': false,         /* (optional) show/hide the country name 显示/隐藏国家名称 */
'showLanguage': true,        /* (optional) show/hide the country language 显示/隐藏国家语言 */
'labelTemplate': '{{language}}',
'languages' : {              /* (optional) define **ADDITIONAL** custom languages 定义**额外的**自定义语言 */
    'auto_detected' : {
        'country': 'Auto Detected',
        'language' : 'Auto Detected',
        'countryTranslated': 'Auto Detected',
        'languageTranslated': 'Auto Detected',
        'flag' : {
            'url' : 'https://upload.wikimedia.org/wikipedia/commons/2/22/Flag_of_Hokkaido_Prefecture.svg', /* url of flag image 标志图像url */
            'class' : 'auto-flag' /* (optional) class to assign to the flag (e.g., for css styling) 类来分配给标志(例如，用于css样式) */
        }
    }
},
/* 
 * Translate your strings below 翻译下面的字符串
 */
'strings' : {
        'class:localTool_1_1' : { /*要翻译的字符串*/
        'auto_detected' : '快捷导航栏', /*自动检测*/
        'zh_CN' : '快捷导航栏', /*简体*/
        'zh_TW' : '快捷導航欄', /*繁体*/
        'en_GB' : 'Quick Navigation Bar', /*英语*/
        'jp_JP' : 'クイックナビゲーションバー'  /*日语*/
        },

        'class:localTool_1_2' : { /*要翻译的字符串*/
        'auto_detected' : '好友分组', /*自动检测*/
        'zh_CN' : '好友分组', /*简体*/
        'zh_TW' : '好友分組', /*繁体*/
        'en_GB' : 'Friends group', /*英语*/
        'jp_JP' : '友達グループ'  /*日语*/
        },

        'class:localTool_1_3' : { /*要翻译的字符串*/
        'auto_detected' : '选项一', /*自动检测*/
        'zh_CN' : '选项一', /*简体*/
        'zh_TW' : '選項一', /*繁体*/
        'en_GB' : 'Option 1', /*英语*/
        'jp_JP' : 'オプション1'  /*日语*/
        },

        'class:localTool_1_4' : { /*要翻译的字符串*/
        'auto_detected' : '选项二', /*自动检测*/
        'zh_CN' : '选项二', /*简体*/
        'zh_TW' : '選項二', /*繁体*/
        'en_GB' : 'Option 2', /*英语*/
        'jp_JP' : 'オプション2'  /*日语*/
        },

        'class:localTool_1_5' : { /*要翻译的字符串*/
        'auto_detected' : '选项三', /*自动检测*/
        'zh_CN' : '选项三', /*简体*/
        'zh_TW' : '選項三', /*繁体*/
        'en_GB' : 'Option 3', /*英语*/
        'jp_JP' : 'オプション3'  /*日语*/
        },

        'class:localTool_1_6' : { /*要翻译的字符串*/
        'auto_detected' : '跳转项', /*自动检测*/
        'zh_CN' : '跳转项', /*简体*/
        'zh_TW' : '跳轉項', /*繁体*/
        'en_GB' : 'Jump items', /*英语*/
        'jp_JP' : 'ジャンプのアイテム'  /*日语*/
        },

        'class:localTool_1_7' : { /*要翻译的字符串*/
        'auto_detected' : '功能模块', /*自动检测*/
        'zh_CN' : '功能模块', /*简体*/
        'zh_TW' : '功能模塊', /*繁体*/
        'en_GB' : 'functional module', /*英语*/
        'jp_JP' : '機能モジュール'  /*日语*/
        },

        'class:localTool_1_8' : { /*要翻译的字符串*/
        'auto_detected' : '选项一', /*自动检测*/
        'zh_CN' : '选项一', /*简体*/
        'zh_TW' : '選項一', /*繁体*/
        'en_GB' : 'Option 1', /*英语*/
        'jp_JP' : 'オプション1'  /*日语*/
        },

        'class:localTool_1_9' : { /*要翻译的字符串*/
        'auto_detected' : '选项二', /*自动检测*/
        'zh_CN' : '选项二', /*简体*/
        'zh_TW' : '選項二', /*繁体*/
        'en_GB' : 'Option 2', /*英语*/
        'jp_JP' : 'オプション2'  /*日语*/
        },

        'class:localTool_1_10' : { /*要翻译的字符串*/
        'auto_detected' : '选项三', /*自动检测*/
        'zh_CN' : '选项三', /*简体*/
        'zh_TW' : '選項三', /*繁体*/
        'en_GB' : 'Option 3', /*英语*/
        'jp_JP' : 'オプション3'  /*日语*/
        },

        'class:localTool_1_11' : { /*要翻译的字符串*/
        'auto_detected' : '跳转项', /*自动检测*/
        'zh_CN' : '跳转项', /*简体*/
        'zh_TW' : '跳轉項', /*繁体*/
        'en_GB' : 'Jump items', /*英语*/
        'jp_JP' : 'ジャンプのアイテム'  /*日语*/
        },

        'class:localTool_1_12' : { /*要翻译的字符串*/
        'auto_detected' : '其他', /*自动检测*/
        'zh_CN' : '其他', /*简体*/
        'zh_TW' : '其他', /*繁体*/
        'en_GB' : 'other', /*英语*/
        'jp_JP' : '他の'  /*日语*/
        },

        'class:localTool_1_13' : { /*要翻译的字符串*/
        'auto_detected' : '返回顶部', /*自动检测*/
        'zh_CN' : '返回顶部', /*简体*/
        'zh_TW' : '返回頂部', /*繁体*/
        'en_GB' : 'Back to top', /*英语*/
        'jp_JP' : 'トップに戻る'  /*日语*/
        },

        'class:localTool_1_14' : { /*要翻译的字符串*/
        'auto_detected' : '返回底部', /*自动检测*/
        'zh_CN' : '返回底部', /*简体*/
        'zh_TW' : '返回底部', /*繁体*/
        'en_GB' : 'Returns to the bottom', /*英语*/
        'jp_JP' : '下へ戻ります'  /*日语*/
        },

        'class:localTool_1_15' : { /*要翻译的字符串*/
        'auto_detected' : '选项三', /*自动检测*/
        'zh_CN' : '选项三', /*简体*/
        'zh_TW' : '選項三', /*繁体*/
        'en_GB' : 'Option 3', /*英语*/
        'jp_JP' : 'オプション3'  /*日语*/
        },

        'class:localTool_1_16' : { /*要翻译的字符串*/
        'auto_detected' : '跳转项', /*自动检测*/
        'zh_CN' : '跳转项', /*简体*/
        'zh_TW' : '跳轉項', /*繁体*/
        'en_GB' : 'Jump items', /*英语*/
        'jp_JP' : 'ジャンプのアイテム'  /*日语*/
        },

        'class:localTool_1_17' : { /*要翻译的字符串*/
        'auto_detected' : '解决方案', /*自动检测*/
        'zh_CN' : '解决方案', /*简体*/
        'zh_TW' : '解決方案', /*繁体*/
        'en_GB' : 'solution', /*英语*/
        'jp_JP' : '解決'  /*日语*/
        },

        'class:localTool_1_18' : { /*要翻译的字符串*/
        'auto_detected' : '移动模块', /*自动检测*/
        'zh_CN' : '移动模块', /*简体*/
        'zh_TW' : '移動模塊', /*繁体*/
        'en_GB' : 'Mobile Module', /*英语*/
        'jp_JP' : 'モバイルモジュール'  /*日语*/
        },

        'class:localTool_1_19' : { /*要翻译的字符串*/
        'auto_detected' : '后台模版', /*自动检测*/
        'zh_CN' : '后台模版', /*简体*/
        'zh_TW' : '後台模板', /*繁体*/
        'en_GB' : 'Background template', /*英语*/
        'jp_JP' : '背景テンプレート'  /*日语*/
        },

        'class:localTool_1_20' : { /*要翻译的字符串*/
        'auto_detected' : '电商平台', /*自动检测*/
        'zh_CN' : '电商平台', /*简体*/
        'zh_TW' : '電商平台', /*繁体*/
        'en_GB' : 'Electronic business platform', /*英语*/
        'jp_JP' : '電子ビジネスプラットフォーム'  /*日语*/
        },

        'class:localTool_1_21' : { /*要翻译的字符串*/
        'auto_detected' : '云市场', /*自动检测*/
        'zh_CN' : '云市场', /*简体*/
        'zh_TW' : '雲市場', /*繁体*/
        'en_GB' : 'Cloud Market', /*英语*/
        'jp_JP' : 'クラウド市場'  /*日语*/
        },


}
};

var languagesList_groupUI_html = {
'defaultLanguage' : 'auto_detected', /* (optional) although must be defined if you don't want en_GB */
'showFlag': false,            /* (optional) show/hide the flag 显示/隐藏旗帜 */
'showCountry': false,         /* (optional) show/hide the country name 显示/隐藏国家名称 */
'showLanguage': true,        /* (optional) show/hide the country language 显示/隐藏国家语言 */
'labelTemplate': '{{language}}',
'languages' : {              /* (optional) define **ADDITIONAL** custom languages 定义**额外的**自定义语言 */
    'auto_detected' : {
        'country': 'Auto Detected',
        'language' : 'Auto Detected',
        'countryTranslated': 'Auto Detected',
        'languageTranslated': 'Auto Detected',
        'flag' : {
            'url' : 'https://upload.wikimedia.org/wikipedia/commons/2/22/Flag_of_Hokkaido_Prefecture.svg', /* url of flag image 标志图像url */
            'class' : 'auto-flag' /* (optional) class to assign to the flag (e.g., for css styling) 类来分配给标志(例如，用于css样式) */
        }
    }
},
/* 
 * Translate your strings below 翻译下面的字符串
 */
'strings' : {
        'class:localTool_2_1' : { /*要翻译的字符串*/
        'auto_detected' : '留言', /*自动检测*/
        'zh_CN' : '留言', /*简体*/
        'zh_TW' : '留言1', /*繁体*/
        'en_GB' : '留言2', /*英语*/
        'jp_JP' : '留言3'  /*日语*/
        },

        'class:localTool_2_2' : { /*要翻译的字符串*/
        'auto_detected' : '留言设置', /*自动检测*/
        'zh_CN' : '留言设置', /*简体*/
        'zh_TW' : '留言设置1', /*繁体*/
        'en_GB' : '留言设置2', /*英语*/
        'jp_JP' : '留言设置3'  /*日语*/
        },

        'class:localTool_2_3' : { /*要翻译的字符串*/
        'auto_detected' : '数据分析', /*自动检测*/
        'zh_CN' : '数据分析', /*简体*/
        'zh_TW' : '数据分析1', /*繁体*/
        'en_GB' : '数据分析2', /*英语*/
        'jp_JP' : '数据分析3'  /*日语*/
        },

        'class:localTool_2_4' : { /*要翻译的字符串*/
        'auto_detected' : '点赞助手', /*自动检测*/
        'zh_CN' : '点赞助手', /*简体*/
        'zh_TW' : '点赞助手1', /*繁体*/
        'en_GB' : '点赞助手2', /*英语*/
        'jp_JP' : '点赞助手3'  /*日语*/
        },

        'class:localTool_2_5' : { /*要翻译的字符串*/
        'auto_detected' : '拓展功能(测试)', /*自动检测*/
        'zh_CN' : '拓展功能(测试)', /*简体*/
        'zh_TW' : '拓展功能(测试)1', /*繁体*/
        'en_GB' : '拓展功能(测试)2', /*英语*/
        'jp_JP' : '拓展功能(测试)3'  /*日语*/
        },

        'class:localTool_2_6' : { /*要翻译的字符串*/
        'auto_detected' : '设置', /*自动检测*/
        'zh_CN' : '设置', /*简体*/
        'zh_TW' : '设置1', /*繁体*/
        'en_GB' : '设置2', /*英语*/
        'jp_JP' : '设置3'  /*日语*/
        },

        'class:localTool_2_7' : { /*要翻译的字符串*/
        'auto_detected' : '当前字符字节数:', /*自动检测*/
        'zh_CN' : '当前字符字节数:', /*简体*/
        'zh_TW' : '当前字符字节数:1', /*繁体*/
        'en_GB' : '当前字符字节数:2', /*英语*/
        'jp_JP' : '当前字符字节数:3'  /*日语*/
        },

        'class:localTool_2_8' : { /*要翻译的字符串*/
        'auto_detected' : '0', /*自动检测*/
        'zh_CN' : '0', /*简体*/
        'zh_TW' : '01', /*繁体*/
        'en_GB' : '02', /*英语*/
        'jp_JP' : '03'  /*日语*/
        },

        'class:localTool_2_9' : { /*要翻译的字符串*/
        'auto_detected' : '/999', /*自动检测*/
        'zh_CN' : '/999', /*简体*/
        'zh_TW' : '/9991', /*繁体*/
        'en_GB' : '/9992', /*英语*/
        'jp_JP' : '/9993'  /*日语*/
        },

        'class:localTool_2_10' : { /*要翻译的字符串*/
        'auto_detected' : '文本格式(直接添加或选择文字添加)', /*自动检测*/
        'zh_CN' : '文本格式(直接添加或选择文字添加)', /*简体*/
        'zh_TW' : '文本格式(直接添加或选择文字添加)1', /*繁体*/
        'en_GB' : '文本格式(直接添加或选择文字添加)2', /*英语*/
        'jp_JP' : '文本格式(直接添加或选择文字添加)3'  /*日语*/
        },

        'class:localTool_2_11' : { /*要翻译的字符串*/
        'auto_detected' : '直接选择或搜索选择', /*自动检测*/
        'zh_CN' : '直接选择或搜索选择', /*简体*/
        'zh_TW' : '直接选择或搜索选择1', /*繁体*/
        'en_GB' : '直接选择或搜索选择2', /*英语*/
        'jp_JP' : '直接选择或搜索选择3'  /*日语*/
        },

        'class:localTool_2_12' : { /*要翻译的字符串*/
        'auto_detected' : '[h1]标题文字[/h1]', /*自动检测*/
        'zh_CN' : '[h1]标题文字[/h1]', /*简体*/
        'zh_TW' : '[h1]标题文字[/h1]1', /*繁体*/
        'en_GB' : '[h1]标题文字[/h1]2', /*英语*/
        'jp_JP' : '[h1]标题文字[/h1]3'  /*日语*/
        },

        'class:localTool_2_13' : { /*要翻译的字符串*/
        'auto_detected' : '[b]粗体文本[/b]', /*自动检测*/
        'zh_CN' : '[b]粗体文本[/b]', /*简体*/
        'zh_TW' : '[b]粗体文本[/b]1', /*繁体*/
        'en_GB' : '[b]粗体文本[/b]2', /*英语*/
        'jp_JP' : '[b]粗体文本[/b]3'  /*日语*/
        },

        'class:localTool_2_14' : { /*要翻译的字符串*/
        'auto_detected' : '[u]下划线文本[/u]', /*自动检测*/
        'zh_CN' : '[u]下划线文本[/u]', /*简体*/
        'zh_TW' : '[u]下划线文本[/u]1', /*繁体*/
        'en_GB' : '[u]下划线文本[/u]2', /*英语*/
        'jp_JP' : '[u]下划线文本[/u]3'  /*日语*/
        },

        'class:localTool_2_15' : { /*要翻译的字符串*/
        'auto_detected' : '[i]斜体文本[/i]', /*自动检测*/
        'zh_CN' : '[i]斜体文本[/i]', /*简体*/
        'zh_TW' : '[i]斜体文本[/i]1', /*繁体*/
        'en_GB' : '[i]斜体文本[/i]2', /*英语*/
        'jp_JP' : '[i]斜体文本[/i]3'  /*日语*/
        },

        'class:localTool_2_16' : { /*要翻译的字符串*/
        'auto_detected' : '[strike]删除文本[/strike]', /*自动检测*/
        'zh_CN' : '[strike]删除文本[/strike]', /*简体*/
        'zh_TW' : '[strike]删除文本[/strike]1', /*繁体*/
        'en_GB' : '[strike]删除文本[/strike]2', /*英语*/
        'jp_JP' : '[strike]删除文本[/strike]3'  /*日语*/
        },

        'class:localTool_2_17' : { /*要翻译的字符串*/
        'auto_detected' : '[spoiler]隐藏文本[/spoiler]', /*自动检测*/
        'zh_CN' : '[spoiler]隐藏文本[/spoiler]', /*简体*/
        'zh_TW' : '[spoiler]隐藏文本[/spoiler]1', /*繁体*/
        'en_GB' : '[spoiler]隐藏文本[/spoiler]2', /*英语*/
        'jp_JP' : '[spoiler]隐藏文本[/spoiler]3'  /*日语*/
        },

        'class:localTool_2_18' : { /*要翻译的字符串*/
        'auto_detected' : '[noparse]不解析[b]标签[/b][/noparse]', /*自动检测*/
        'zh_CN' : '[noparse]不解析[b]标签[/b][/noparse]', /*简体*/
        'zh_TW' : '[noparse]不解析[b]标签[/b][/noparse]1', /*繁体*/
        'en_GB' : '[noparse]不解析[b]标签[/b][/noparse]2', /*英语*/
        'jp_JP' : '[noparse]不解析[b]标签[/b][/noparse]3'  /*日语*/
        },

        'class:localTool_2_19' : { /*要翻译的字符串*/
        'auto_detected' : '[url=store.steampowered.com]网站链接[/url]', /*自动检测*/
        'zh_CN' : '[url=store.steampowered.com]网站链接[/url]', /*简体*/
        'zh_TW' : '[url=store.steampowered.com]网站链接[/url]1', /*繁体*/
        'en_GB' : '[url=store.steampowered.com]网站链接[/url]2', /*英语*/
        'jp_JP' : '[url=store.steampowered.com]网站链接[/url]3'  /*日语*/
        },

        'class:localTool_2_20' : { /*要翻译的字符串*/
        'auto_detected' : '添加', /*自动检测*/
        'zh_CN' : '添加', /*简体*/
        'zh_TW' : '添加1', /*繁体*/
        'en_GB' : '添加2', /*英语*/
        'jp_JP' : '添加3'  /*日语*/
        },

        'class:localTool_2_21' : { /*要翻译的字符串*/
        'auto_detected' : '翻译模块(需要提前设置国籍):', /*自动检测*/
        'zh_CN' : '翻译模块(需要提前设置国籍):', /*简体*/
        'zh_TW' : '翻译模块(需要提前设置国籍):1', /*繁体*/
        'en_GB' : '翻译模块(需要提前设置国籍):2', /*英语*/
        'jp_JP' : '翻译模块(需要提前设置国籍):3'  /*日语*/
        },

        'class:localTool_2_22' : { /*要翻译的字符串*/
        'auto_detected' : '当前语言:', /*自动检测*/
        'zh_CN' : '当前语言:', /*简体*/
        'zh_TW' : '当前语言:1', /*繁体*/
        'en_GB' : '当前语言:2', /*英语*/
        'jp_JP' : '当前语言:3'  /*日语*/
        },

        'class:localTool_2_23' : { /*要翻译的字符串*/
        'auto_detected' : '自动检测', /*自动检测*/
        'zh_CN' : '自动检测', /*简体*/
        'zh_TW' : '自动检测1', /*繁体*/
        'en_GB' : '自动检测2', /*英语*/
        'jp_JP' : '自动检测3'  /*日语*/
        },

        'class:localTool_2_24' : { /*要翻译的字符串*/
        'auto_detected' : '中文简体', /*自动检测*/
        'zh_CN' : '中文简体', /*简体*/
        'zh_TW' : '中文简体1', /*繁体*/
        'en_GB' : '中文简体2', /*英语*/
        'jp_JP' : '中文简体3'  /*日语*/
        },

        'class:localTool_2_25' : { /*要翻译的字符串*/
        'auto_detected' : '英语', /*自动检测*/
        'zh_CN' : '英语', /*简体*/
        'zh_TW' : '英语1', /*繁体*/
        'en_GB' : '英语2', /*英语*/
        'jp_JP' : '英语3'  /*日语*/
        },

        'class:localTool_2_26' : { /*要翻译的字符串*/
        'auto_detected' : '日语', /*自动检测*/
        'zh_CN' : '日语', /*简体*/
        'zh_TW' : '日语1', /*繁体*/
        'en_GB' : '日语2', /*英语*/
        'jp_JP' : '日语3'  /*日语*/
        },

        'class:localTool_2_27' : { /*要翻译的字符串*/
        'auto_detected' : '目标语言:', /*自动检测*/
        'zh_CN' : '目标语言:', /*简体*/
        'zh_TW' : '目标语言:1', /*繁体*/
        'en_GB' : '目标语言:2', /*英语*/
        'jp_JP' : '目标语言:3'  /*日语*/
        },

        'class:localTool_2_28' : { /*要翻译的字符串*/
        'auto_detected' : '英语', /*自动检测*/
        'zh_CN' : '英语', /*简体*/
        'zh_TW' : '英语1', /*繁体*/
        'en_GB' : '英语2', /*英语*/
        'jp_JP' : '英语3'  /*日语*/
        },

        'class:localTool_2_29' : { /*要翻译的字符串*/
        'auto_detected' : '日语', /*自动检测*/
        'zh_CN' : '日语', /*简体*/
        'zh_TW' : '日语1', /*繁体*/
        'en_GB' : '日语2', /*英语*/
        'jp_JP' : '日语3'  /*日语*/
        },

        'class:localTool_2_30' : { /*要翻译的字符串*/
        'auto_detected' : '中文简体', /*自动检测*/
        'zh_CN' : '中文简体', /*简体*/
        'zh_TW' : '中文简体1', /*繁体*/
        'en_GB' : '中文简体2', /*英语*/
        'jp_JP' : '中文简体3'  /*日语*/
        },

        'class:localTool_2_31' : { /*要翻译的字符串*/
        'auto_detected' : '马新简体[zh-sg]', /*自动检测*/
        'zh_CN' : '马新简体[zh-sg]', /*简体*/
        'zh_TW' : '马新简体[zh-sg]1', /*繁体*/
        'en_GB' : '马新简体[zh-sg]2', /*英语*/
        'jp_JP' : '马新简体[zh-sg]3'  /*日语*/
        },

        'class:localTool_2_32' : { /*要翻译的字符串*/
        'auto_detected' : '繁體中文[zh-hant]', /*自动检测*/
        'zh_CN' : '繁體中文[zh-hant]', /*简体*/
        'zh_TW' : '繁體中文[zh-hant]1', /*繁体*/
        'en_GB' : '繁體中文[zh-hant]2', /*英语*/
        'jp_JP' : '繁體中文[zh-hant]3'  /*日语*/
        },

        'class:localTool_2_33' : { /*要翻译的字符串*/
        'auto_detected' : '繁體中文(香港)[zh-hk]', /*自动检测*/
        'zh_CN' : '繁體中文(香港)[zh-hk]', /*简体*/
        'zh_TW' : '繁體中文(香港)[zh-hk]1', /*繁体*/
        'en_GB' : '繁體中文(香港)[zh-hk]2', /*英语*/
        'jp_JP' : '繁體中文(香港)[zh-hk]3'  /*日语*/
        },

        'class:localTool_2_34' : { /*要翻译的字符串*/
        'auto_detected' : '繁體中文(澳门)[zh-mo]', /*自动检测*/
        'zh_CN' : '繁體中文(澳门)[zh-mo]', /*简体*/
        'zh_TW' : '繁體中文(澳门)[zh-mo]1', /*繁体*/
        'en_GB' : '繁體中文(澳门)[zh-mo]2', /*英语*/
        'jp_JP' : '繁體中文(澳门)[zh-mo]3'  /*日语*/
        },

        'class:localTool_2_35' : { /*要翻译的字符串*/
        'auto_detected' : '繁體中文(台湾)[zh-tw]', /*自动检测*/
        'zh_CN' : '繁體中文(台湾)[zh-tw]', /*简体*/
        'zh_TW' : '繁體中文(台湾)[zh-tw]1', /*繁体*/
        'en_GB' : '繁體中文(台湾)[zh-tw]2', /*英语*/
        'jp_JP' : '繁體中文(台湾)[zh-tw]3'  /*日语*/
        },

        'class:localTool_2_36' : { /*要翻译的字符串*/
        'auto_detected' : '翻译', /*自动检测*/
        'zh_CN' : '翻译', /*简体*/
        'zh_TW' : '翻译1', /*繁体*/
        'en_GB' : '翻译2', /*英语*/
        'jp_JP' : '翻译3'  /*日语*/
        },

        'class:localTool_2_37' : { /*要翻译的字符串*/
        'auto_detected' : '添加称呼模块(需要提前设置备注):', /*自动检测*/
        'zh_CN' : '添加称呼模块(需要提前设置备注):', /*简体*/
        'zh_TW' : '添加称呼模块(需要提前设置备注):1', /*繁体*/
        'en_GB' : '添加称呼模块(需要提前设置备注):2', /*英语*/
        'jp_JP' : '添加称呼模块(需要提前设置备注):3'  /*日语*/
        },

        'class:localTool_2_38' : { /*要翻译的字符串*/
        'auto_detected' : '自定义称呼模式', /*自动检测*/
        'zh_CN' : '自定义称呼模式', /*简体*/
        'zh_TW' : '自定义称呼模式1', /*繁体*/
        'en_GB' : '自定义称呼模式2', /*英语*/
        'jp_JP' : '自定义称呼模式3'  /*日语*/
        },

        'class:localTool_2_39' : { /*要翻译的字符串*/
        'auto_detected' : '在留言框添加自定义称呼标识符', /*自动检测*/
        'zh_CN' : '在留言框添加自定义称呼标识符', /*简体*/
        'zh_TW' : '在留言框添加自定义称呼标识符1', /*繁体*/
        'en_GB' : '在留言框添加自定义称呼标识符2', /*英语*/
        'jp_JP' : '在留言框添加自定义称呼标识符3'  /*日语*/
        },

        'class:localTool_2_40' : { /*要翻译的字符串*/
        'auto_detected' : '是否为组添加称呼(如果组没有备注则使用steam名称)', /*自动检测*/
        'zh_CN' : '是否为组添加称呼(如果组没有备注则使用steam名称)', /*简体*/
        'zh_TW' : '是否为组添加称呼(如果组没有备注则使用steam名称)1', /*繁体*/
        'en_GB' : '是否为组添加称呼(如果组没有备注则使用steam名称)2', /*英语*/
        'jp_JP' : '是否为组添加称呼(如果组没有备注则使用steam名称)3'  /*日语*/
        },

        'class:localTool_2_41' : { /*要翻译的字符串*/
        'auto_detected' : '是否为组添加称呼(如果组设置有备注则使用，否则不添加称呼)', /*自动检测*/
        'zh_TW' : '是否为组添加称呼(如果组设置有备注则使用，否则不添加称呼)1', /*繁体*/
        'en_GB' : '是否为组添加称呼(如果组设置有备注则使用，否则不添加称呼)2', /*英语*/
        'jp_JP' : '是否为组添加称呼(如果组设置有备注则使用，否则不添加称呼)3'  /*日语*/
        },

        'class:localTool_2_42' : { /*要翻译的字符串*/
        'auto_detected' : '格式化帮助', /*自动检测*/
        'zh_CN' : '格式化帮助', /*简体*/
        'zh_TW' : '格式化帮助1', /*繁体*/
        'en_GB' : '格式化帮助2', /*英语*/
        'jp_JP' : '格式化帮助3'  /*日语*/
        },

        'class:localTool_2_43' : { /*要翻译的字符串*/
        'auto_detected' : '发送评论给选择的组', /*自动检测*/
        'zh_CN' : '发送评论给选择的组', /*简体*/
        'zh_TW' : '发送评论给选择的组1', /*繁体*/
        'en_GB' : '发送评论给选择的组2', /*英语*/
        'jp_JP' : '发送评论给选择的组3'  /*日语*/
        },

        'class:localTool_2_44' : { /*要翻译的字符串*/
        'auto_detected' : '根据国籍发送评论给选择的组', /*自动检测*/
        'zh_CN' : '根据国籍发送评论给选择的组', /*简体*/
        'zh_TW' : '根据国籍发送评论给选择的组1', /*繁体*/
        'en_GB' : '根据国籍发送评论给选择的组2', /*英语*/
        'jp_JP' : '根据国籍发送评论给选择的组3'  /*日语*/
        },

        'class:localTool_2_45' : { /*要翻译的字符串*/
        'auto_detected' : '设置国籍:', /*自动检测*/
        'zh_CN' : '设置国籍:', /*简体*/
        'zh_TW' : '设置国籍:1', /*繁体*/
        'en_GB' : '设置国籍:2', /*英语*/
        'jp_JP' : '设置国籍:3'  /*日语*/
        },

        'class:localTool_2_46' : { /*要翻译的字符串*/
        'auto_detected' : '请选择要设置的国籍:', /*自动检测*/
        'zh_CN' : '请选择要设置的国籍:', /*简体*/
        'zh_TW' : '请选择要设置的国籍:1', /*繁体*/
        'en_GB' : '请选择要设置的国籍:2', /*英语*/
        'jp_JP' : '请选择要设置的国籍:3'  /*日语*/
        },

        'class:localTool_2_47' : { /*要翻译的字符串*/
        'auto_detected' : '简体中文', /*自动检测*/
        'zh_CN' : '简体中文', /*简体*/
        'zh_TW' : '简体中文1', /*繁体*/
        'en_GB' : '简体中文2', /*英语*/
        'jp_JP' : '简体中文3'  /*日语*/
        },

        'class:localTool_2_48' : { /*要翻译的字符串*/
        'auto_detected' : '英语', /*自动检测*/
        'zh_CN' : '英语', /*简体*/
        'zh_TW' : '英语1', /*繁体*/
        'en_GB' : '英语2', /*英语*/
        'jp_JP' : '英语3'  /*日语*/
        },

        'class:localTool_2_49' : { /*要翻译的字符串*/
        'auto_detected' : '日语', /*自动检测*/
        'zh_CN' : '日语', /*简体*/
        'zh_TW' : '日语1', /*繁体*/
        'en_GB' : '日语2', /*英语*/
        'jp_JP' : '日语3'  /*日语*/
        },

        'class:localTool_2_50' : { /*要翻译的字符串*/
        'auto_detected' : '马新简体(马来西亚,新加坡)[zh-sg]', /*自动检测*/
        'zh_CN' : '马新简体(马来西亚,新加坡)[zh-sg]', /*简体*/
        'zh_TW' : '马新简体(马来西亚,新加坡)[zh-sg]1', /*繁体*/
        'en_GB' : '马新简体(马来西亚,新加坡)[zh-sg]2', /*英语*/
        'jp_JP' : '马新简体(马来西亚,新加坡)[zh-sg]3'  /*日语*/
        },

        'class:localTool_2_51' : { /*要翻译的字符串*/
        'auto_detected' : '繁體中文[zh-hant]', /*自动检测*/
        'zh_CN' : '繁體中文[zh-hant]', /*简体*/
        'zh_TW' : '繁體中文[zh-hant]1', /*繁体*/
        'en_GB' : '繁體中文[zh-hant]2', /*英语*/
        'jp_JP' : '繁體中文[zh-hant]3'  /*日语*/
        },

        'class:localTool_2_52' : { /*要翻译的字符串*/
        'auto_detected' : '繁體中文(香港)[zh-hk]', /*自动检测*/
        'zh_CN' : '繁體中文(香港)[zh-hk]', /*简体*/
        'zh_TW' : '繁體中文(香港)[zh-hk]1', /*繁体*/
        'en_GB' : '繁體中文(香港)[zh-hk]2', /*英语*/
        'jp_JP' : '繁體中文(香港)[zh-hk]3'  /*日语*/
        },

        'class:localTool_2_53' : { /*要翻译的字符串*/
        'auto_detected' : '繁體中文(澳门)[zh-mo]', /*自动检测*/
        'zh_CN' : '繁體中文(澳门)[zh-mo]', /*简体*/
        'zh_TW' : '繁體中文(澳门)[zh-mo]1', /*繁体*/
        'en_GB' : '繁體中文(澳门)[zh-mo]2', /*英语*/
        'jp_JP' : '繁體中文(澳门)[zh-mo]3'  /*日语*/
        },

        'class:localTool_2_54' : { /*要翻译的字符串*/
        'auto_detected' : '繁體中文(台湾)[zh-tw]', /*自动检测*/
        'zh_CN' : '繁體中文(台湾)[zh-tw]', /*简体*/
        'zh_TW' : '繁體中文(台湾)[zh-tw]1', /*繁体*/
        'en_GB' : '繁體中文(台湾)[zh-tw]2', /*英语*/
        'jp_JP' : '繁體中文(台湾)[zh-tw]3'  /*日语*/
        },

        'class:localTool_2_55' : { /*要翻译的字符串*/
        'auto_detected' : '为选择的好友设置国籍标识', /*自动检测*/
        'zh_CN' : '为选择的好友设置国籍标识', /*简体*/
        'zh_TW' : '为选择的好友设置国籍标识1', /*繁体*/
        'en_GB' : '为选择的好友设置国籍标识2', /*英语*/
        'jp_JP' : '为选择的好友设置国籍标识3'  /*日语*/
        },

        'class:localTool_2_56' : { /*要翻译的字符串*/
        'auto_detected' : '为选择的好友取消国籍标识', /*自动检测*/
        'zh_CN' : '为选择的好友取消国籍标识', /*简体*/
        'zh_TW' : '为选择的好友取消国籍标识1', /*繁体*/
        'en_GB' : '为选择的好友取消国籍标识2', /*英语*/
        'jp_JP' : '为选择的好友取消国籍标识3'  /*日语*/
        },

        'class:localTool_2_57' : { /*要翻译的字符串*/
        'auto_detected' : '设置不留言:', /*自动检测*/
        'zh_CN' : '设置不留言:', /*简体*/
        'zh_TW' : '设置不留言:1', /*繁体*/
        'en_GB' : '设置不留言:2', /*英语*/
        'jp_JP' : '设置不留言:3'  /*日语*/
        },

        'class:localTool_2_58' : { /*要翻译的字符串*/
        'auto_detected' : '为选择的好友设置不留言', /*自动检测*/
        'zh_CN' : '为选择的好友设置不留言', /*简体*/
        'zh_TW' : '为选择的好友设置不留言1', /*繁体*/
        'en_GB' : '为选择的好友设置不留言2', /*英语*/
        'jp_JP' : '为选择的好友设置不留言3'  /*日语*/
        },

        'class:localTool_2_59' : { /*要翻译的字符串*/
        'auto_detected' : '为选择的好友取消设置不留言', /*自动检测*/
        'zh_CN' : '为选择的好友取消设置不留言', /*简体*/
        'zh_TW' : '为选择的好友取消设置不留言1', /*繁体*/
        'en_GB' : '为选择的好友取消设置不留言2', /*英语*/
        'jp_JP' : '为选择的好友取消设置不留言3'  /*日语*/
        },

        'class:localTool_2_60' : { /*要翻译的字符串*/
        'auto_detected' : '设置留言时间间隔:', /*自动检测*/
        'zh_CN' : '设置留言时间间隔:', /*简体*/
        'zh_TW' : '设置留言时间间隔:1', /*繁体*/
        'en_GB' : '设置留言时间间隔:2', /*英语*/
        'jp_JP' : '设置留言时间间隔:3'  /*日语*/
        },

        'class:localTool_2_61' : { /*要翻译的字符串*/
        },

        'class:localTool_2_62' : { /*要翻译的字符串*/
        },

        'class:localTool_2_63' : { /*要翻译的字符串*/
        'auto_detected' : '请选择留言', /*自动检测*/
        'zh_CN' : '请选择留言', /*简体*/
        'zh_TW' : '请选择留言1', /*繁体*/
        'en_GB' : '请选择留言2', /*英语*/
        'jp_JP' : '请选择留言3'  /*日语*/
        },

        'class:localTool_2_64' : { /*要翻译的字符串*/
        'auto_detected' : '留言日期差', /*自动检测*/
        'zh_CN' : '留言日期差', /*简体*/
        'zh_TW' : '留言日期差1', /*繁体*/
        'en_GB' : '留言日期差2', /*英语*/
        'jp_JP' : '留言日期差3'  /*日语*/
        },

        'class:localTool_2_65' : { /*要翻译的字符串*/
        'auto_detected' : '为选择的好友设置留言时间间隔', /*自动检测*/
        'zh_CN' : '为选择的好友设置留言时间间隔', /*简体*/
        'zh_TW' : '为选择的好友设置留言时间间隔1', /*繁体*/
        'en_GB' : '为选择的好友设置留言时间间隔2', /*英语*/
        'jp_JP' : '为选择的好友设置留言时间间隔3'  /*日语*/
        },

        'class:localTool_2_66' : { /*要翻译的字符串*/
        'auto_detected' : '为选择的好友取消设置留言时间间隔', /*自动检测*/
        'zh_CN' : '为选择的好友取消设置留言时间间隔', /*简体*/
        'zh_TW' : '为选择的好友取消设置留言时间间隔1', /*繁体*/
        'en_GB' : '为选择的好友取消设置留言时间间隔2', /*英语*/
        'jp_JP' : '为选择的好友取消设置留言时间间隔3'  /*日语*/
        },

        'class:localTool_2_67' : { /*要翻译的字符串*/
        'auto_detected' : '设置自动留言计划:', /*自动检测*/
        'zh_CN' : '设置自动留言计划:', /*简体*/
        'zh_TW' : '设置自动留言计划:1', /*繁体*/
        'en_GB' : '设置自动留言计划:2', /*英语*/
        'jp_JP' : '设置自动留言计划:3'  /*日语*/
        },

        'class:localTool_2_68' : { /*要翻译的字符串*/
        'auto_detected' : '请选择时间', /*自动检测*/
        'zh_CN' : '请选择时间', /*简体*/
        'zh_TW' : '请选择时间1', /*繁体*/
        'en_GB' : '请选择时间2', /*英语*/
        'jp_JP' : '请选择时间3'  /*日语*/
        },

        'class:localTool_2_69' : { /*要翻译的字符串*/
        'auto_detected' : '请选择时间', /*自动检测*/
        'zh_CN' : '请选择时间', /*简体*/
        'zh_TW' : '请选择时间1', /*繁体*/
        'en_GB' : '请选择时间2', /*英语*/
        'jp_JP' : '请选择时间3'  /*日语*/
        },

        'class:localTool_2_70' : { /*要翻译的字符串*/
        'auto_detected' : '设置好友分组:', /*自动检测*/
        'zh_CN' : '设置好友分组:', /*简体*/
        'zh_TW' : '设置好友分组:1', /*繁体*/
        'en_GB' : '设置好友分组:2', /*英语*/
        'jp_JP' : '设置好友分组:3'  /*日语*/
        },

        'class:localTool_2_71' : { /*要翻译的字符串*/
        'auto_detected' : '分组列表', /*自动检测*/
        'zh_CN' : '分组列表', /*简体*/
        'zh_TW' : '分组列表1', /*繁体*/
        'en_GB' : '分组列表2', /*英语*/
        'jp_JP' : '分组列表3'  /*日语*/
        },

        'class:localTool_2_72' : { /*要翻译的字符串*/
        'auto_detected' : '直接选择或搜索选择', /*自动检测*/
        'zh_CN' : '直接选择或搜索选择', /*简体*/
        'zh_TW' : '直接选择或搜索选择1', /*繁体*/
        'en_GB' : '直接选择或搜索选择2', /*英语*/
        'jp_JP' : '直接选择或搜索选择3'  /*日语*/
        },

        'class:localTool_2_73' : { /*要翻译的字符串*/
        'auto_detected' : '分组名称', /*自动检测*/
        'zh_CN' : '分组名称', /*简体*/
        'zh_TW' : '分组名称1', /*繁体*/
        'en_GB' : '分组名称2', /*英语*/
        'jp_JP' : '分组名称3'  /*日语*/
        },

        'class:localTool_2_74' : { /*要翻译的字符串*/
        'auto_detected' : '分组名称', /*自动检测*/
        'zh_CN' : '分组名称', /*简体*/
        'zh_TW' : '分组名称1', /*繁体*/
        'en_GB' : '分组名称2', /*英语*/
        'jp_JP' : '分组名称3'  /*日语*/
        },

        'class:localTool_2_75' : { /*要翻译的字符串*/
        'auto_detected' : '分组名称', /*自动检测*/
        'zh_CN' : '分组名称', /*简体*/
        'zh_TW' : '分组名称1', /*繁体*/
        'en_GB' : '分组名称2', /*英语*/
        'jp_JP' : '分组名称3'  /*日语*/
        },

        'class:localTool_2_76' : { /*要翻译的字符串*/
        'auto_detected' : '分组名称', /*自动检测*/
        'zh_CN' : '分组名称', /*简体*/
        'zh_TW' : '分组名称1', /*繁体*/
        'en_GB' : '分组名称2', /*英语*/
        'jp_JP' : '分组名称3'  /*日语*/
        },

        'class:localTool_2_77' : { /*要翻译的字符串*/
        'auto_detected' : '分组名称', /*自动检测*/
        'zh_CN' : '分组名称', /*简体*/
        'zh_TW' : '分组名称1', /*繁体*/
        'en_GB' : '分组名称2', /*英语*/
        'jp_JP' : '分组名称3'  /*日语*/
        },

        'class:localTool_2_78' : { /*要翻译的字符串*/
        'auto_detected' : '分组名称', /*自动检测*/
        'zh_CN' : '分组名称', /*简体*/
        'zh_TW' : '分组名称1', /*繁体*/
        'en_GB' : '分组名称2', /*英语*/
        'jp_JP' : '分组名称3'  /*日语*/
        },

        'class:localTool_2_79' : { /*要翻译的字符串*/
        'auto_detected' : '分组名称', /*自动检测*/
        'zh_CN' : '分组名称', /*简体*/
        'zh_TW' : '分组名称1', /*繁体*/
        'en_GB' : '分组名称2', /*英语*/
        'jp_JP' : '分组名称3'  /*日语*/
        },

        'class:localTool_2_80' : { /*要翻译的字符串*/
        'auto_detected' : '分组名称', /*自动检测*/
        'zh_CN' : '分组名称', /*简体*/
        'zh_TW' : '分组名称1', /*繁体*/
        'en_GB' : '分组名称2', /*英语*/
        'jp_JP' : '分组名称3'  /*日语*/
        },

        'class:localTool_2_81' : { /*要翻译的字符串*/
        'auto_detected' : '分组名称', /*自动检测*/
        'zh_CN' : '分组名称', /*简体*/
        'zh_TW' : '分组名称1', /*繁体*/
        'en_GB' : '分组名称2', /*英语*/
        'jp_JP' : '分组名称3'  /*日语*/
        },

        'class:localTool_2_82' : { /*要翻译的字符串*/
        'auto_detected' : '编辑列表', /*自动检测*/
        'zh_CN' : '编辑列表', /*简体*/
        'zh_TW' : '编辑列表1', /*繁体*/
        'en_GB' : '编辑列表2', /*英语*/
        'jp_JP' : '编辑列表3'  /*日语*/
        },

        'class:localTool_2_83' : { /*要翻译的字符串*/
        'auto_detected' : '为选择的好友添加分组', /*自动检测*/
        'zh_CN' : '为选择的好友添加分组', /*简体*/
        'zh_TW' : '为选择的好友添加分组1', /*繁体*/
        'en_GB' : '为选择的好友添加分组2', /*英语*/
        'jp_JP' : '为选择的好友添加分组3'  /*日语*/
        },

        'class:localTool_2_84' : { /*要翻译的字符串*/
        'auto_detected' : '为选择的好友取消添加分组', /*自动检测*/
        'zh_CN' : '为选择的好友取消添加分组', /*简体*/
        'zh_TW' : '为选择的好友取消添加分组1', /*繁体*/
        'en_GB' : '为选择的好友取消添加分组2', /*英语*/
        'jp_JP' : '为选择的好友取消添加分组3'  /*日语*/
        },

        'class:localTool_2_85' : { /*要翻译的字符串*/
        'auto_detected' : '分组名称', /*自动检测*/
        'zh_CN' : '分组名称', /*简体*/
        'zh_TW' : '分组名称1', /*繁体*/
        'en_GB' : '分组名称2', /*英语*/
        'jp_JP' : '分组名称3'  /*日语*/
        },

        'class:localTool_2_86' : { /*要翻译的字符串*/
        'auto_detected' : '用户', /*自动检测*/
        'zh_CN' : '用户', /*简体*/
        'zh_TW' : '用户1', /*繁体*/
        'en_GB' : '用户2', /*英语*/
        'jp_JP' : '用户3'  /*日语*/
        },

        'class:localTool_2_87' : { /*要翻译的字符串*/
        'auto_detected' : '用户', /*自动检测*/
        'zh_CN' : '用户', /*简体*/
        'zh_TW' : '用户1', /*繁体*/
        'en_GB' : '用户2', /*英语*/
        'jp_JP' : '用户3'  /*日语*/
        },

        'class:localTool_2_88' : { /*要翻译的字符串*/
        'auto_detected' : '用户', /*自动检测*/
        'zh_CN' : '用户', /*简体*/
        'zh_TW' : '用户1', /*繁体*/
        'en_GB' : '用户2', /*英语*/
        'jp_JP' : '用户3'  /*日语*/
        },

        'class:localTool_2_89' : { /*要翻译的字符串*/
        'auto_detected' : '分组名称', /*自动检测*/
        'zh_CN' : '分组名称', /*简体*/
        'zh_TW' : '分组名称1', /*繁体*/
        'en_GB' : '分组名称2', /*英语*/
        'jp_JP' : '分组名称3'  /*日语*/
        },

        'class:localTool_2_90' : { /*要翻译的字符串*/
        'auto_detected' : '用户', /*自动检测*/
        'zh_CN' : '用户', /*简体*/
        'zh_TW' : '用户1', /*繁体*/
        'en_GB' : '用户2', /*英语*/
        'jp_JP' : '用户3'  /*日语*/
        },

        'class:localTool_2_91' : { /*要翻译的字符串*/
        'auto_detected' : '用户', /*自动检测*/
        'zh_CN' : '用户', /*简体*/
        'zh_TW' : '用户1', /*繁体*/
        'en_GB' : '用户2', /*英语*/
        'jp_JP' : '用户3'  /*日语*/
        },

        'class:localTool_2_92' : { /*要翻译的字符串*/
        'auto_detected' : '分组名称', /*自动检测*/
        'zh_CN' : '分组名称', /*简体*/
        'zh_TW' : '分组名称1', /*繁体*/
        'en_GB' : '分组名称2', /*英语*/
        'jp_JP' : '分组名称3'  /*日语*/
        },

        'class:localTool_2_93' : { /*要翻译的字符串*/
        'auto_detected' : '用户', /*自动检测*/
        'zh_CN' : '用户', /*简体*/
        'zh_TW' : '用户1', /*繁体*/
        'en_GB' : '用户2', /*英语*/
        'jp_JP' : '用户3'  /*日语*/
        },

        'class:localTool_2_94' : { /*要翻译的字符串*/
        'auto_detected' : '用户', /*自动检测*/
        'zh_CN' : '用户', /*简体*/
        'zh_TW' : '用户1', /*繁体*/
        'en_GB' : '用户2', /*英语*/
        'jp_JP' : '用户3'  /*日语*/
        },

        'class:localTool_2_95' : { /*要翻译的字符串*/
        'auto_detected' : '分组名称', /*自动检测*/
        'zh_CN' : '分组名称', /*简体*/
        'zh_TW' : '分组名称1', /*繁体*/
        'en_GB' : '分组名称2', /*英语*/
        'jp_JP' : '分组名称3'  /*日语*/
        },

        'class:localTool_2_96' : { /*要翻译的字符串*/
        'auto_detected' : '用户', /*自动检测*/
        'zh_CN' : '用户', /*简体*/
        'zh_TW' : '用户1', /*繁体*/
        'en_GB' : '用户2', /*英语*/
        'jp_JP' : '用户3'  /*日语*/
        },

        'class:localTool_2_97' : { /*要翻译的字符串*/
        'auto_detected' : '按国籍进行高亮分组', /*自动检测*/
        'zh_CN' : '按国籍进行高亮分组', /*简体*/
        'zh_TW' : '按国籍进行高亮分组1', /*繁体*/
        'en_GB' : '按国籍进行高亮分组2', /*英语*/
        'jp_JP' : '按国籍进行高亮分组3'  /*日语*/
        },

        'class:localTool_2_98' : { /*要翻译的字符串*/
        'auto_detected' : '按国籍进行排序分组(慢)', /*自动检测*/
        'zh_CN' : '按国籍进行排序分组(慢)', /*简体*/
        'zh_TW' : '按国籍进行排序分组(慢)1', /*繁体*/
        'en_GB' : '按国籍进行排序分组(慢)2', /*英语*/
        'jp_JP' : '按国籍进行排序分组(慢)3'  /*日语*/
        },

        'class:localTool_2_99' : { /*要翻译的字符串*/
        'auto_detected' : '按在线时间进行排序分组', /*自动检测*/
        'zh_CN' : '按在线时间进行排序分组', /*简体*/
        'zh_TW' : '按在线时间进行排序分组1', /*繁体*/
        'en_GB' : '按在线时间进行排序分组2', /*英语*/
        'jp_JP' : '按在线时间进行排序分组3'  /*日语*/
        },

        'class:localTool_2_100' : { /*要翻译的字符串*/
        'auto_detected' : '显示好友详细数据-不可用', /*自动检测*/
        'zh_CN' : '显示好友详细数据-不可用', /*简体*/
        'zh_TW' : '显示好友详细数据-不可用1', /*繁体*/
        'en_GB' : '显示好友详细数据-不可用2', /*英语*/
        'jp_JP' : '显示好友详细数据-不可用3'  /*日语*/
        },

        'class:localTool_2_101' : { /*要翻译的字符串*/
        'auto_detected' : '好友数据统计', /*自动检测*/
        'zh_CN' : '好友数据统计', /*简体*/
        'zh_TW' : '好友数据统计1', /*繁体*/
        'en_GB' : '好友数据统计2', /*英语*/
        'jp_JP' : '好友数据统计3'  /*日语*/
        },

        'class:localTool_2_102' : { /*要翻译的字符串*/
        'auto_detected' : '留言数据统计', /*自动检测*/
        'zh_CN' : '留言数据统计', /*简体*/
        'zh_TW' : '留言数据统计1', /*繁体*/
        'en_GB' : '留言数据统计2', /*英语*/
        'jp_JP' : '留言数据统计3'  /*日语*/
        },

        'class:localTool_2_103' : { /*要翻译的字符串*/
        'auto_detected' : '关系网统计', /*自动检测*/
        'zh_CN' : '关系网统计', /*简体*/
        'zh_TW' : '关系网统计1', /*繁体*/
        'en_GB' : '关系网统计2', /*英语*/
        'jp_JP' : '关系网统计3'  /*日语*/
        },

        'class:localTool_2_104' : { /*要翻译的字符串*/
        'auto_detected' : '当前配置统计', /*自动检测*/
        'zh_CN' : '当前配置统计', /*简体*/
        'zh_TW' : '当前配置统计1', /*繁体*/
        'en_GB' : '当前配置统计2', /*英语*/
        'jp_JP' : '当前配置统计3'  /*日语*/
        },

        'class:localTool_2_105' : { /*要翻译的字符串*/
        'auto_detected' : '查看好友配置统计', /*自动检测*/
        'zh_CN' : '查看好友配置统计', /*简体*/
        'zh_TW' : '查看好友配置统计1', /*繁体*/
        'en_GB' : '查看好友配置统计2', /*英语*/
        'jp_JP' : '查看好友配置统计3'  /*日语*/
        },

        'class:localTool_2_106' : { /*要翻译的字符串*/
        'auto_detected' : '数据表格(汇总所有的数据:id,名称,备注,国籍(语言),等级,好友数量,游戏数量,dlc数量,创意工坊数量,艺术作品数量,动态数量)', /*自动检测*/
        },

        'class:localTool_2_107' : { /*要翻译的字符串*/
        'auto_detected' : '分为:', /*自动检测*/
        'zh_CN' : '分为:', /*简体*/
        'zh_TW' : '分为:1', /*繁体*/
        'en_GB' : '分为:2', /*英语*/
        'jp_JP' : '分为:3'  /*日语*/
        },

        'class:localTool_2_108' : { /*要翻译的字符串*/
        'auto_detected' : '按国籍的饼图(总留言数量)，', /*自动检测*/
        'zh_CN' : '按国籍的饼图(总留言数量)，', /*简体*/
        'zh_TW' : '按国籍的饼图(总留言数量)，1', /*繁体*/
        'en_GB' : '按国籍的饼图(总留言数量)，2', /*英语*/
        'jp_JP' : '按国籍的饼图(总留言数量)，3'  /*日语*/
        },

        'class:localTool_2_109' : { /*要翻译的字符串*/
        'auto_detected' : '按每天留言数据的折线图(统计所有的留言数据，生成的折线图)，', /*自动检测*/
        },

        'class:localTool_2_110' : { /*要翻译的字符串*/
        },

        'class:localTool_2_111' : { /*要翻译的字符串*/
        'auto_detected' : '数据表格(汇总所有的数据)', /*自动检测*/
        'zh_CN' : '数据表格(汇总所有的数据)', /*简体*/
        'zh_TW' : '数据表格(汇总所有的数据)1', /*繁体*/
        'en_GB' : '数据表格(汇总所有的数据)2', /*英语*/
        'jp_JP' : '数据表格(汇总所有的数据)3'  /*日语*/
        },

        'class:localTool_2_112' : { /*要翻译的字符串*/
        'auto_detected' : '好友关系网(仅统计共同好友)', /*自动检测*/
        'zh_CN' : '好友关系网(仅统计共同好友)', /*简体*/
        'zh_TW' : '好友关系网(仅统计共同好友)1', /*繁体*/
        'en_GB' : '好友关系网(仅统计共同好友)2', /*英语*/
        'jp_JP' : '好友关系网(仅统计共同好友)3'  /*日语*/
        },

        'class:localTool_2_113' : { /*要翻译的字符串*/
        'auto_detected' : '当前的配置数据和运行状态', /*自动检测*/
        'zh_CN' : '当前的配置数据和运行状态', /*简体*/
        'zh_TW' : '当前的配置数据和运行状态1', /*繁体*/
        'en_GB' : '当前的配置数据和运行状态2', /*英语*/
        'jp_JP' : '当前的配置数据和运行状态3'  /*日语*/
        },

        'class:localTool_2_114' : { /*要翻译的字符串*/
        'auto_detected' : '对好友设置的配置数据(比如国籍,不留言,留言时间间隔等)', /*自动检测*/
        'zh_CN' : '对好友设置的配置数据(比如国籍,不留言,留言时间间隔等)', /*简体*/
        'zh_TW' : '对好友设置的配置数据(比如国籍,不留言,留言时间间隔等)1', /*繁体*/
        'en_GB' : '对好友设置的配置数据(比如国籍,不留言,留言时间间隔等)2', /*英语*/
        'jp_JP' : '对好友设置的配置数据(比如国籍,不留言,留言时间间隔等)3'  /*日语*/
        },

        'class:localTool_2_115' : { /*要翻译的字符串*/
        'auto_detected' : '动态点赞助手', /*自动检测*/
        'zh_CN' : '动态点赞助手', /*简体*/
        'zh_TW' : '动态点赞助手1', /*繁体*/
        'en_GB' : '动态点赞助手2', /*英语*/
        'jp_JP' : '动态点赞助手3'  /*日语*/
        },

        'class:localTool_2_116' : { /*要翻译的字符串*/
        'auto_detected' : '总开关', /*自动检测*/
        'zh_CN' : '总开关', /*简体*/
        'zh_TW' : '总开关1', /*繁体*/
        'en_GB' : '总开关2', /*英语*/
        'jp_JP' : '总开关3'  /*日语*/
        },

        'class:localTool_2_117' : { /*要翻译的字符串*/
        'auto_detected' : '设置点赞内容:', /*自动检测*/
        'zh_CN' : '设置点赞内容:', /*简体*/
        'zh_TW' : '设置点赞内容:1', /*繁体*/
        'en_GB' : '设置点赞内容:2', /*英语*/
        'jp_JP' : '设置点赞内容:3'  /*日语*/
        },

        'class:localTool_2_118' : { /*要翻译的字符串*/
        'auto_detected' : '点赞内容:', /*自动检测*/
        'zh_CN' : '点赞内容:', /*简体*/
        'zh_TW' : '点赞内容:1', /*繁体*/
        'en_GB' : '点赞内容:2', /*英语*/
        'jp_JP' : '点赞内容:3'  /*日语*/
        },

        'class:localTool_2_119' : { /*要翻译的字符串*/
        'auto_detected' : '设置自动点赞模式:', /*自动检测*/
        'zh_CN' : '设置自动点赞模式:', /*简体*/
        'zh_TW' : '设置自动点赞模式:1', /*繁体*/
        'en_GB' : '设置自动点赞模式:2', /*英语*/
        'jp_JP' : '设置自动点赞模式:3'  /*日语*/
        },

        'class:localTool_2_120' : { /*要翻译的字符串*/
        'auto_detected' : '点赞模式:', /*自动检测*/
        'zh_CN' : '点赞模式:', /*简体*/
        'zh_TW' : '点赞模式:1', /*繁体*/
        'en_GB' : '点赞模式:2', /*英语*/
        'jp_JP' : '点赞模式:3'  /*日语*/
        },

        'class:localTool_2_121' : { /*要翻译的字符串*/
        'auto_detected' : '设置自动点赞时间区间(默认今天~之前所有的动态内容)', /*自动检测*/
        'zh_CN' : '设置自动点赞时间区间(默认今天~之前所有的动态内容)', /*简体*/
        'zh_TW' : '设置自动点赞时间区间(默认今天~之前所有的动态内容)1', /*繁体*/
        'en_GB' : '设置自动点赞时间区间(默认今天~之前所有的动态内容)2', /*英语*/
        'jp_JP' : '设置自动点赞时间区间(默认今天~之前所有的动态内容)3'  /*日语*/
        },

        'class:localTool_2_122' : { /*要翻译的字符串*/
        'auto_detected' : '请选择范围', /*自动检测*/
        'zh_CN' : '请选择范围', /*简体*/
        'zh_TW' : '请选择范围1', /*繁体*/
        'en_GB' : '请选择范围2', /*英语*/
        'jp_JP' : '请选择范围3'  /*日语*/
        },

        'class:localTool_2_123' : { /*要翻译的字符串*/
        'auto_detected' : '点赞进度时间线', /*自动检测*/
        'zh_CN' : '点赞进度时间线', /*简体*/
        'zh_TW' : '点赞进度时间线1', /*繁体*/
        'en_GB' : '点赞进度时间线2', /*英语*/
        'jp_JP' : '点赞进度时间线3'  /*日语*/
        },

        'class:localTool_2_124' : { /*要翻译的字符串*/
        'auto_detected' : '', /*自动检测*/
        'zh_CN' : '', /*简体*/
        'zh_TW' : '1', /*繁体*/
        'en_GB' : '2', /*英语*/
        'jp_JP' : '3'  /*日语*/
        },

        'class:localTool_2_125' : { /*要翻译的字符串*/
        'auto_detected' : '8月18日', /*自动检测*/
        'zh_CN' : '8月18日', /*简体*/
        'zh_TW' : '8月18日1', /*繁体*/
        'en_GB' : '8月18日2', /*英语*/
        'jp_JP' : '8月18日3'  /*日语*/
        },

        'class:localTool_2_126' : { /*要翻译的字符串*/
        'auto_detected' : '已点赞状态x条，点赞发布艺术作品x条，点赞收藏艺术作品x条', /*自动检测*/
        'zh_CN' : '已点赞状态x条，点赞发布艺术作品x条，点赞收藏艺术作品x条', /*简体*/
        'zh_TW' : '已点赞状态x条，点赞发布艺术作品x条，点赞收藏艺术作品x条1', /*繁体*/
        'en_GB' : '已点赞状态x条，点赞发布艺术作品x条，点赞收藏艺术作品x条2', /*英语*/
        'jp_JP' : '已点赞状态x条，点赞发布艺术作品x条，点赞收藏艺术作品x条3'  /*日语*/
        },

        'class:localTool_2_127' : { /*要翻译的字符串*/
        'auto_detected' : '已点赞评测x条，点赞发布创意工坊x条，点赞收藏创意工坊x条', /*自动检测*/
        'zh_CN' : '已点赞评测x条，点赞发布创意工坊x条，点赞收藏创意工坊x条', /*简体*/
        'zh_TW' : '已点赞评测x条，点赞发布创意工坊x条，点赞收藏创意工坊x条1', /*繁体*/
        'en_GB' : '已点赞评测x条，点赞发布创意工坊x条，点赞收藏创意工坊x条2', /*英语*/
        'jp_JP' : '已点赞评测x条，点赞发布创意工坊x条，点赞收藏创意工坊x条3'  /*日语*/
        },

        'class:localTool_2_128' : { /*要翻译的字符串*/
        'auto_detected' : '已点赞购买状态x条，点赞发布指南x条，点赞收藏指南x条', /*自动检测*/
        'zh_CN' : '已点赞购买状态x条，点赞发布指南x条，点赞收藏指南x条', /*简体*/
        'zh_TW' : '已点赞购买状态x条，点赞发布指南x条，点赞收藏指南x条1', /*繁体*/
        'en_GB' : '已点赞购买状态x条，点赞发布指南x条，点赞收藏指南x条2', /*英语*/
        'jp_JP' : '已点赞购买状态x条，点赞发布指南x条，点赞收藏指南x条3'  /*日语*/
        },

        'class:localTool_2_129' : { /*要翻译的字符串*/
        'auto_detected' : '已点赞组通知x条，点赞上次载图x条，点赞收藏载图x条', /*自动检测*/
        'zh_CN' : '已点赞组通知x条，点赞上次载图x条，点赞收藏载图x条', /*简体*/
        'zh_TW' : '已点赞组通知x条，点赞上次载图x条，点赞收藏载图x条1', /*繁体*/
        'en_GB' : '已点赞组通知x条，点赞上次载图x条，点赞收藏载图x条2', /*英语*/
        'jp_JP' : '已点赞组通知x条，点赞上次载图x条，点赞收藏载图x条3'  /*日语*/
        },

        'class:localTool_2_130' : { /*要翻译的字符串*/
        'auto_detected' : '已点赞组活动x条，点赞上传视频x条，点赞收藏视频x条', /*自动检测*/
        'zh_CN' : '已点赞组活动x条，点赞上传视频x条，点赞收藏视频x条', /*简体*/
        'zh_TW' : '已点赞组活动x条，点赞上传视频x条，点赞收藏视频x条1', /*繁体*/
        'en_GB' : '已点赞组活动x条，点赞上传视频x条，点赞收藏视频x条2', /*英语*/
        'jp_JP' : '已点赞组活动x条，点赞上传视频x条，点赞收藏视频x条3'  /*日语*/
        },

        'class:localTool_2_131' : { /*要翻译的字符串*/
        'auto_detected' : '', /*自动检测*/
        'zh_CN' : '', /*简体*/
        'zh_TW' : '1', /*繁体*/
        'en_GB' : '2', /*英语*/
        'jp_JP' : '3'  /*日语*/
        },

        'class:localTool_2_132' : { /*要翻译的字符串*/
        'auto_detected' : '8月16日', /*自动检测*/
        'zh_CN' : '8月16日', /*简体*/
        'zh_TW' : '8月16日1', /*繁体*/
        'en_GB' : '8月16日2', /*英语*/
        'jp_JP' : '8月16日3'  /*日语*/
        },

        'class:localTool_2_133' : { /*要翻译的字符串*/
        },

        'class:localTool_2_134' : { /*要翻译的字符串*/
        'auto_detected' : '《登高》', /*自动检测*/
        'zh_CN' : '《登高》', /*简体*/
        'zh_TW' : '《登高》1', /*繁体*/
        'en_GB' : '《登高》2', /*英语*/
        'jp_JP' : '《登高》3'  /*日语*/
        },

        'class:localTool_2_135' : { /*要翻译的字符串*/
        'auto_detected' : '《茅屋为秋风所破歌》', /*自动检测*/
        'zh_CN' : '《茅屋为秋风所破歌》', /*简体*/
        'zh_TW' : '《茅屋为秋风所破歌》1', /*繁体*/
        'en_GB' : '《茅屋为秋风所破歌》2', /*英语*/
        'jp_JP' : '《茅屋为秋风所破歌》3'  /*日语*/
        },

        'class:localTool_2_136' : { /*要翻译的字符串*/
        'auto_detected' : '', /*自动检测*/
        'zh_CN' : '', /*简体*/
        'zh_TW' : '1', /*繁体*/
        'en_GB' : '2', /*英语*/
        'jp_JP' : '3'  /*日语*/
        },

        'class:localTool_2_137' : { /*要翻译的字符串*/
        'auto_detected' : '8月15日', /*自动检测*/
        'zh_CN' : '8月15日', /*简体*/
        'zh_TW' : '8月15日1', /*繁体*/
        'en_GB' : '8月15日2', /*英语*/
        'jp_JP' : '8月15日3'  /*日语*/
        },

        'class:localTool_2_138' : { /*要翻译的字符串*/
        'auto_detected' : '中国人民抗日战争胜利日', /*自动检测*/
        'zh_CN' : '中国人民抗日战争胜利日', /*简体*/
        'zh_TW' : '中国人民抗日战争胜利日1', /*繁体*/
        'en_GB' : '中国人民抗日战争胜利日2', /*英语*/
        'jp_JP' : '中国人民抗日战争胜利日3'  /*日语*/
        },

        'class:localTool_2_139' : { /*要翻译的字符串*/
        },

        'class:localTool_2_140' : { /*要翻译的字符串*/
        'auto_detected' : '铭记、感恩', /*自动检测*/
        'zh_CN' : '铭记、感恩', /*简体*/
        'zh_TW' : '铭记、感恩1', /*繁体*/
        'en_GB' : '铭记、感恩2', /*英语*/
        'jp_JP' : '铭记、感恩3'  /*日语*/
        },

        'class:localTool_2_141' : { /*要翻译的字符串*/
        'auto_detected' : '所有为中华民族浴血奋战的英雄将士', /*自动检测*/
        'zh_CN' : '所有为中华民族浴血奋战的英雄将士', /*简体*/
        'zh_TW' : '所有为中华民族浴血奋战的英雄将士1', /*繁体*/
        'en_GB' : '所有为中华民族浴血奋战的英雄将士2', /*英语*/
        'jp_JP' : '所有为中华民族浴血奋战的英雄将士3'  /*日语*/
        },

        'class:localTool_2_142' : { /*要翻译的字符串*/
        'auto_detected' : '永垂不朽', /*自动检测*/
        'zh_CN' : '永垂不朽', /*简体*/
        'zh_TW' : '永垂不朽1', /*繁体*/
        'en_GB' : '永垂不朽2', /*英语*/
        'jp_JP' : '永垂不朽3'  /*日语*/
        },

        'class:localTool_2_143' : { /*要翻译的字符串*/
        'auto_detected' : '', /*自动检测*/
        'zh_CN' : '', /*简体*/
        'zh_TW' : '1', /*繁体*/
        'en_GB' : '2', /*英语*/
        'jp_JP' : '3'  /*日语*/
        },

        'class:localTool_2_144' : { /*要翻译的字符串*/
        'auto_detected' : '过去', /*自动检测*/
        'zh_CN' : '过去', /*简体*/
        'zh_TW' : '过去1', /*繁体*/
        'en_GB' : '过去2', /*英语*/
        'jp_JP' : '过去3'  /*日语*/
        },

        'class:localTool_2_145' : { /*要翻译的字符串*/
        'auto_detected' : '喜加一助手', /*自动检测*/
        'zh_CN' : '喜加一助手', /*简体*/
        'zh_TW' : '喜加一助手1', /*繁体*/
        'en_GB' : '喜加一助手2', /*英语*/
        'jp_JP' : '喜加一助手3'  /*日语*/
        },

        'class:localTool_2_146' : { /*要翻译的字符串*/
        'auto_detected' : '总开关', /*自动检测*/
        'zh_CN' : '总开关', /*简体*/
        'zh_TW' : '总开关1', /*繁体*/
        'en_GB' : '总开关2', /*英语*/
        'jp_JP' : '总开关3'  /*日语*/
        },

        'class:localTool_2_147' : { /*要翻译的字符串*/
        'auto_detected' : '设置:', /*自动检测*/
        'zh_CN' : '设置:', /*简体*/
        'zh_TW' : '设置:1', /*繁体*/
        'en_GB' : '设置:2', /*英语*/
        'jp_JP' : '设置:3'  /*日语*/
        },

        'class:localTool_2_148' : { /*要翻译的字符串*/
        'auto_detected' : '设置喜加一数据来源', /*自动检测*/
        'zh_CN' : '设置喜加一数据来源', /*简体*/
        'zh_TW' : '设置喜加一数据来源1', /*繁体*/
        'en_GB' : '设置喜加一数据来源2', /*英语*/
        'jp_JP' : '设置喜加一数据来源3'  /*日语*/
        },

        'class:localTool_2_149' : { /*要翻译的字符串*/
        'auto_detected' : '设置:', /*自动检测*/
        'zh_CN' : '设置:', /*简体*/
        'zh_TW' : '设置:1', /*繁体*/
        'en_GB' : '设置:2', /*英语*/
        'jp_JP' : '设置:3'  /*日语*/
        },

        'class:localTool_2_150' : { /*要翻译的字符串*/
        'auto_detected' : '功能设置', /*自动检测*/
        'zh_CN' : '功能设置', /*简体*/
        'zh_TW' : '功能设置1', /*繁体*/
        'en_GB' : '功能设置2', /*英语*/
        'jp_JP' : '功能设置3'  /*日语*/
        },

        'class:localTool_2_151' : { /*要翻译的字符串*/
        'auto_detected' : 'Debug模式', /*自动检测*/
        'zh_CN' : 'Debug模式', /*简体*/
        'zh_TW' : 'Debug模式1', /*繁体*/
        'en_GB' : 'Debug模式2', /*英语*/
        'jp_JP' : 'Debug模式3'  /*日语*/
        },

        'class:localTool_2_152' : { /*要翻译的字符串*/
        'auto_detected' : '弹出层', /*自动检测*/
        'zh_CN' : '弹出层', /*简体*/
        'zh_TW' : '弹出层1', /*繁体*/
        'en_GB' : '弹出层2', /*英语*/
        'jp_JP' : '弹出层3'  /*日语*/
        },

        'class:localTool_2_153' : { /*要翻译的字符串*/
        'auto_detected' : '滑块', /*自动检测*/
        'zh_CN' : '滑块', /*简体*/
        'zh_TW' : '滑块1', /*繁体*/
        'en_GB' : '滑块2', /*英语*/
        'jp_JP' : '滑块3'  /*日语*/
        },

        'class:localTool_2_154' : { /*要翻译的字符串*/
        'auto_detected' : '导入导出重置当前设置', /*自动检测*/
        'zh_CN' : '导入导出重置当前设置', /*简体*/
        'zh_TW' : '导入导出重置当前设置1', /*繁体*/
        'en_GB' : '导入导出重置当前设置2', /*英语*/
        'jp_JP' : '导入导出重置当前设置3'  /*日语*/
        },

        'class:localTool_2_155' : { /*要翻译的字符串*/
        'auto_detected' : '弹出层', /*自动检测*/
        'zh_CN' : '弹出层', /*简体*/
        'zh_TW' : '弹出层1', /*繁体*/
        'en_GB' : '弹出层2', /*英语*/
        'jp_JP' : '弹出层3'  /*日语*/
        },

        'class:localTool_2_156' : { /*要翻译的字符串*/
        'auto_detected' : '', /*自动检测*/
        'zh_CN' : '', /*简体*/
        'zh_TW' : '1', /*繁体*/
        'en_GB' : '2', /*英语*/
        'jp_JP' : '3'  /*日语*/
        },

        'class:localTool_2_157' : { /*要翻译的字符串*/
        'auto_detected' : '点击上传，或将文件拖拽到此处', /*自动检测*/
        'zh_CN' : '点击上传，或将文件拖拽到此处', /*简体*/
        'zh_TW' : '点击上传，或将文件拖拽到此处1', /*繁体*/
        'en_GB' : '点击上传，或将文件拖拽到此处2', /*英语*/
        'jp_JP' : '点击上传，或将文件拖拽到此处3'  /*日语*/
        },

        'class:localTool_2_158' : { /*要翻译的字符串*/
        'auto_detected' : '界面设置', /*自动检测*/
        'zh_CN' : '界面设置', /*简体*/
        'zh_TW' : '界面设置1', /*繁体*/
        'en_GB' : '界面设置2', /*英语*/
        'jp_JP' : '界面设置3'  /*日语*/
        },

        'class:localTool_2_159' : { /*要翻译的字符串*/
        'auto_detected' : '语言配置', /*自动检测*/
        'zh_CN' : '语言配置', /*简体*/
        'zh_TW' : '语言配置1', /*繁体*/
        'en_GB' : '语言配置2', /*英语*/
        'jp_JP' : '语言配置3'  /*日语*/
        },

        'class:localTool_2_160' : { /*要翻译的字符串*/
        'auto_detected' : '自动检测(简体中文)', /*自动检测*/
        'zh_CN' : '自动检测(简体中文)', /*简体*/
        'zh_TW' : '自动检测(简体中文)1', /*繁体*/
        'en_GB' : '自动检测(简体中文)2', /*英语*/
        'jp_JP' : '自动检测(简体中文)3'  /*日语*/
        },

        'class:localTool_2_161' : { /*要翻译的字符串*/
        'auto_detected' : '简体中文', /*自动检测*/
        'zh_CN' : '简体中文', /*简体*/
        'zh_TW' : '简体中文1', /*繁体*/
        'en_GB' : '简体中文2', /*英语*/
        'jp_JP' : '简体中文3'  /*日语*/
        },

        'class:localTool_2_162' : { /*要翻译的字符串*/
        'auto_detected' : '繁体中文', /*自动检测*/
        'zh_CN' : '繁体中文', /*简体*/
        'zh_TW' : '繁体中文1', /*繁体*/
        'en_GB' : '繁体中文2', /*英语*/
        'jp_JP' : '繁体中文3'  /*日语*/
        },

        'class:localTool_2_163' : { /*要翻译的字符串*/
        'auto_detected' : 'English', /*自动检测*/
        'zh_CN' : 'English', /*简体*/
        'zh_TW' : 'English1', /*繁体*/
        'en_GB' : 'English2', /*英语*/
        'jp_JP' : 'English3'  /*日语*/
        },

        'class:localTool_2_164' : { /*要翻译的字符串*/
        'auto_detected' : '主题切换', /*自动检测*/
        'zh_CN' : '主题切换', /*简体*/
        'zh_TW' : '主题切换1', /*繁体*/
        'en_GB' : '主题切换2', /*英语*/
        'jp_JP' : '主题切换3'  /*日语*/
        },

        'class:localTool_2_165' : { /*要翻译的字符串*/
        'auto_detected' : '请选择一个主题，然后点击应用', /*自动检测*/
        'zh_CN' : '请选择一个主题，然后点击应用', /*简体*/
        'zh_TW' : '请选择一个主题，然后点击应用1', /*繁体*/
        'en_GB' : '请选择一个主题，然后点击应用2', /*英语*/
        'jp_JP' : '请选择一个主题，然后点击应用3'  /*日语*/
        },

        'class:localTool_2_166' : { /*要翻译的字符串*/
        'auto_detected' : '应用主题', /*自动检测*/
        'zh_CN' : '应用主题', /*简体*/
        'zh_TW' : '应用主题1', /*繁体*/
        'en_GB' : '应用主题2', /*英语*/
        'jp_JP' : '应用主题3'  /*日语*/
        },

        'class:localTool_2_167' : { /*要翻译的字符串*/
        'auto_detected' : 'UI设置', /*自动检测*/
        'zh_CN' : 'UI设置', /*简体*/
        'zh_TW' : 'UI设置1', /*繁体*/
        'en_GB' : 'UI设置2', /*英语*/
        'jp_JP' : 'UI设置3'  /*日语*/
        },

        'class:localTool_2_168' : { /*要翻译的字符串*/
        'auto_detected' : '预览:', /*自动检测*/
        'zh_CN' : '预览:', /*简体*/
        'zh_TW' : '预览:1', /*繁体*/
        'en_GB' : '预览:2', /*英语*/
        'jp_JP' : '预览:3'  /*日语*/
        },

        'class:localTool_2_169' : { /*要翻译的字符串*/
        'auto_detected' : '主要字体颜色:', /*自动检测*/
        'zh_CN' : '主要字体颜色:', /*简体*/
        'zh_TW' : '主要字体颜色:1', /*繁体*/
        'en_GB' : '主要字体颜色:2', /*英语*/
        'jp_JP' : '主要字体颜色:3'  /*日语*/
        },

        'class:localTool_2_170' : { /*要翻译的字符串*/
        'auto_detected' : '主要背景颜色:', /*自动检测*/
        'zh_CN' : '主要背景颜色:', /*简体*/
        'zh_TW' : '主要背景颜色:1', /*繁体*/
        'en_GB' : '主要背景颜色:2', /*英语*/
        'jp_JP' : '主要背景颜色:3'  /*日语*/
        },

        'class:localTool_2_171' : { /*要翻译的字符串*/
        'auto_detected' : '留言成功字体颜色:', /*自动检测*/
        'zh_CN' : '留言成功字体颜色:', /*简体*/
        'zh_TW' : '留言成功字体颜色:1', /*繁体*/
        'en_GB' : '留言成功字体颜色:2', /*英语*/
        'jp_JP' : '留言成功字体颜色:3'  /*日语*/
        },

        'class:localTool_2_172' : { /*要翻译的字符串*/
        'auto_detected' : '留言失败字体颜色:', /*自动检测*/
        'zh_CN' : '留言失败字体颜色:', /*简体*/
        'zh_TW' : '留言失败字体颜色:1', /*繁体*/
        'en_GB' : '留言失败字体颜色:2', /*英语*/
        'jp_JP' : '留言失败字体颜色:3'  /*日语*/
        },

        'class:localTool_2_173' : { /*要翻译的字符串*/
        'auto_detected' : '留言发生错误字体颜色:', /*自动检测*/
        'zh_CN' : '留言发生错误字体颜色:', /*简体*/
        'zh_TW' : '留言发生错误字体颜色:1', /*繁体*/
        'en_GB' : '留言发生错误字体颜色:2', /*英语*/
        'jp_JP' : '留言发生错误字体颜色:3'  /*日语*/
        },

        'class:localTool_2_174' : { /*要翻译的字符串*/
        'auto_detected' : '保存为主题', /*自动检测*/
        'zh_CN' : '保存为主题', /*简体*/
        'zh_TW' : '保存为主题1', /*繁体*/
        'en_GB' : '保存为主题2', /*英语*/
        'jp_JP' : '保存为主题3'  /*日语*/
        },

        'class:localTool_2_175' : { /*要翻译的字符串*/
        'auto_detected' : '关于SteamAssistant(Steam小助手)', /*自动检测*/
        'zh_CN' : '关于SteamAssistant(Steam小助手)', /*简体*/
        'zh_TW' : '关于SteamAssistant(Steam小助手)1', /*繁体*/
        'en_GB' : '关于SteamAssistant(Steam小助手)2', /*英语*/
        'jp_JP' : '关于SteamAssistant(Steam小助手)3'  /*日语*/
        },

        'class:localTool_2_176' : { /*要翻译的字符串*/
        'auto_detected' : '程序信息:', /*自动检测*/
        'zh_CN' : '程序信息:', /*简体*/
        'zh_TW' : '程序信息:1', /*繁体*/
        'en_GB' : '程序信息:2', /*英语*/
        'jp_JP' : '程序信息:3'  /*日语*/
        },

        'class:localTool_2_177' : { /*要翻译的字符串*/
        'auto_detected' : '当前版本:v0.2.3.0', /*自动检测*/
        'zh_CN' : '当前版本:v0.2.3.0', /*简体*/
        'zh_TW' : '当前版本:v0.2.3.01', /*繁体*/
        'en_GB' : '当前版本:v0.2.3.02', /*英语*/
        'jp_JP' : '当前版本:v0.2.3.03'  /*日语*/
        },

        'class:localTool_2_178' : { /*要翻译的字符串*/
        'auto_detected' : '主程序框架更新时间:2020年4月19日', /*自动检测*/
        'zh_CN' : '主程序框架更新时间:2020年4月19日', /*简体*/
        'zh_TW' : '主程序框架更新时间:2020年4月19日1', /*繁体*/
        'en_GB' : '主程序框架更新时间:2020年4月19日2', /*英语*/
        'jp_JP' : '主程序框架更新时间:2020年4月19日3'  /*日语*/
        },

        'class:localTool_2_179' : { /*要翻译的字符串*/
        'auto_detected' : 'common模块:2020年4月19日', /*自动检测*/
        'zh_CN' : 'common模块:2020年4月19日', /*简体*/
        'zh_TW' : 'common模块:2020年4月19日1', /*繁体*/
        'en_GB' : 'common模块:2020年4月19日2', /*英语*/
        'jp_JP' : 'common模块:2020年4月19日3'  /*日语*/
        },

        'class:localTool_2_180' : { /*要翻译的字符串*/
        'auto_detected' : 'databaseConf模块:2020年4月19日', /*自动检测*/
        'zh_CN' : 'databaseConf模块:2020年4月19日', /*简体*/
        'zh_TW' : 'databaseConf模块:2020年4月19日1', /*繁体*/
        'en_GB' : 'databaseConf模块:2020年4月19日2', /*英语*/
        'jp_JP' : 'databaseConf模块:2020年4月19日3'  /*日语*/
        },

        'class:localTool_2_181' : { /*要翻译的字符串*/
        'auto_detected' : 'externalApis模块:2020年4月19日', /*自动检测*/
        'zh_CN' : 'externalApis模块:2020年4月19日', /*简体*/
        'zh_TW' : 'externalApis模块:2020年4月19日1', /*繁体*/
        'en_GB' : 'externalApis模块:2020年4月19日2', /*英语*/
        'jp_JP' : 'externalApis模块:2020年4月19日3'  /*日语*/
        },

        'class:localTool_2_182' : { /*要翻译的字符串*/
        'auto_detected' : 'steamApis模块:2020年4月19日', /*自动检测*/
        'zh_CN' : 'steamApis模块:2020年4月19日', /*简体*/
        'zh_TW' : 'steamApis模块:2020年4月19日1', /*繁体*/
        'en_GB' : 'steamApis模块:2020年4月19日2', /*英语*/
        'jp_JP' : 'steamApis模块:2020年4月19日3'  /*日语*/
        },

        'class:localTool_2_183' : { /*要翻译的字符串*/
        'auto_detected' : 'translateApis模块:2020年4月19日', /*自动检测*/
        'zh_CN' : 'translateApis模块:2020年4月19日', /*简体*/
        'zh_TW' : 'translateApis模块:2020年4月19日1', /*繁体*/
        'en_GB' : 'translateApis模块:2020年4月19日2', /*英语*/
        'jp_JP' : 'translateApis模块:2020年4月19日3'  /*日语*/
        },

        'class:localTool_2_184' : { /*要翻译的字符串*/
        'auto_detected' : 'Utility模块:2020年4月19日', /*自动检测*/
        'zh_CN' : 'Utility模块:2020年4月19日', /*简体*/
        'zh_TW' : 'Utility模块:2020年4月19日1', /*繁体*/
        'en_GB' : 'Utility模块:2020年4月19日2', /*英语*/
        'jp_JP' : 'Utility模块:2020年4月19日3'  /*日语*/
        },

        'class:localTool_2_185' : { /*要翻译的字符串*/
        'auto_detected' : 'UI模块:2020年4月19日', /*自动检测*/
        'zh_CN' : 'UI模块:2020年4月19日', /*简体*/
        'zh_TW' : 'UI模块:2020年4月19日1', /*繁体*/
        'en_GB' : 'UI模块:2020年4月19日2', /*英语*/
        'jp_JP' : 'UI模块:2020年4月19日3'  /*日语*/
        },

        'class:localTool_2_186' : { /*要翻译的字符串*/
        'auto_detected' : 'Event模块:2020年4月19日', /*自动检测*/
        'zh_CN' : 'Event模块:2020年4月19日', /*简体*/
        'zh_TW' : 'Event模块:2020年4月19日1', /*繁体*/
        'en_GB' : 'Event模块:2020年4月19日2', /*英语*/
        'jp_JP' : 'Event模块:2020年4月19日3'  /*日语*/
        },

        'class:localTool_2_187' : { /*要翻译的字符串*/
        'auto_detected' : 'CityList模块:2020年4月19日', /*自动检测*/
        'zh_CN' : 'CityList模块:2020年4月19日', /*简体*/
        'zh_TW' : 'CityList模块:2020年4月19日1', /*繁体*/
        'en_GB' : 'CityList模块:2020年4月19日2', /*英语*/
        'jp_JP' : 'CityList模块:2020年4月19日3'  /*日语*/
        },

        'class:localTool_2_188' : { /*要翻译的字符串*/
        'auto_detected' : '联系作者:', /*自动检测*/
        'zh_CN' : '联系作者:', /*简体*/
        'zh_TW' : '联系作者:1', /*繁体*/
        'en_GB' : '联系作者:2', /*英语*/
        'jp_JP' : '联系作者:3'  /*日语*/
        },

        'class:localTool_2_189' : { /*要翻译的字符串*/
        'auto_detected' : '反馈错误', /*自动检测*/
        'zh_CN' : '反馈错误', /*简体*/
        'zh_TW' : '反馈错误1', /*繁体*/
        'en_GB' : '反馈错误2', /*英语*/
        'jp_JP' : '反馈错误3'  /*日语*/
        },


}
};

var languagesList_loadUI_Html = {
'defaultLanguage' : 'auto_detected', /* (optional) although must be defined if you don't want en_GB */
'showFlag': false,            /* (optional) show/hide the flag 显示/隐藏旗帜 */
'showCountry': false,         /* (optional) show/hide the country name 显示/隐藏国家名称 */
'showLanguage': true,        /* (optional) show/hide the country language 显示/隐藏国家语言 */
'labelTemplate': '{{language}}',
'languages' : {              /* (optional) define **ADDITIONAL** custom languages 定义**额外的**自定义语言 */
    'auto_detected' : {
        'country': 'Auto Detected',
        'language' : 'Auto Detected',
        'countryTranslated': 'Auto Detected',
        'languageTranslated': 'Auto Detected',
        'flag' : {
            'url' : 'https://upload.wikimedia.org/wikipedia/commons/2/22/Flag_of_Hokkaido_Prefecture.svg', /* url of flag image 标志图像url */
            'class' : 'auto-flag' /* (optional) class to assign to the flag (e.g., for css styling) 类来分配给标志(例如，用于css样式) */
        }
    }
},
/* 
 * Translate your strings below 翻译下面的字符串
 */
'strings' : {
        'class:localTool_3_1' : { /*要翻译的字符串*/
        'auto_detected' : 'L', /*自动检测*/
        'zh_CN' : 'L', /*简体*/
        'zh_TW' : 'L1', /*繁体*/
        'en_GB' : 'L2', /*英语*/
        'jp_JP' : 'L3'  /*日语*/
        },

        'class:localTool_3_2' : { /*要翻译的字符串*/
        'auto_detected' : 'o', /*自动检测*/
        'zh_CN' : 'o', /*简体*/
        'zh_TW' : 'o1', /*繁体*/
        'en_GB' : 'o2', /*英语*/
        'jp_JP' : 'o3'  /*日语*/
        },

        'class:localTool_3_3' : { /*要翻译的字符串*/
        'auto_detected' : 'a', /*自动检测*/
        'zh_CN' : 'a', /*简体*/
        'zh_TW' : 'a1', /*繁体*/
        'en_GB' : 'a2', /*英语*/
        'jp_JP' : 'a3'  /*日语*/
        },

        'class:localTool_3_4' : { /*要翻译的字符串*/
        'auto_detected' : 'd', /*自动检测*/
        'zh_CN' : 'd', /*简体*/
        'zh_TW' : 'd1', /*繁体*/
        'en_GB' : 'd2', /*英语*/
        'jp_JP' : 'd3'  /*日语*/
        },

        'class:localTool_3_5' : { /*要翻译的字符串*/
        'auto_detected' : 'i', /*自动检测*/
        'zh_CN' : 'i', /*简体*/
        'zh_TW' : 'i1', /*繁体*/
        'en_GB' : 'i2', /*英语*/
        'jp_JP' : 'i3'  /*日语*/
        },

        'class:localTool_3_6' : { /*要翻译的字符串*/
        'auto_detected' : 'n', /*自动检测*/
        'zh_CN' : 'n', /*简体*/
        'zh_TW' : 'n1', /*繁体*/
        'en_GB' : 'n2', /*英语*/
        'jp_JP' : 'n3'  /*日语*/
        },

        'class:localTool_3_7' : { /*要翻译的字符串*/
        'auto_detected' : 'g', /*自动检测*/
        'zh_CN' : 'g', /*简体*/
        'zh_TW' : 'g1', /*繁体*/
        'en_GB' : 'g2', /*英语*/
        'jp_JP' : 'g3'  /*日语*/
        },


}
};

var languagesList_mainUI_html = {
'defaultLanguage' : 'auto_detected', /* (optional) although must be defined if you don't want en_GB */
'showFlag': false,            /* (optional) show/hide the flag 显示/隐藏旗帜 */
'showCountry': false,         /* (optional) show/hide the country name 显示/隐藏国家名称 */
'showLanguage': true,        /* (optional) show/hide the country language 显示/隐藏国家语言 */
'labelTemplate': '{{language}}',
'languages' : {              /* (optional) define **ADDITIONAL** custom languages 定义**额外的**自定义语言 */
    'auto_detected' : {
        'country': 'Auto Detected',
        'language' : 'Auto Detected',
        'countryTranslated': 'Auto Detected',
        'languageTranslated': 'Auto Detected',
        'flag' : {
            'url' : 'https://upload.wikimedia.org/wikipedia/commons/2/22/Flag_of_Hokkaido_Prefecture.svg', /* url of flag image 标志图像url */
            'class' : 'auto-flag' /* (optional) class to assign to the flag (e.g., for css styling) 类来分配给标志(例如，用于css样式) */
        }
    }
},
/* 
 * Translate your strings below 翻译下面的字符串
 */
'strings' : {
        'class:localTool_4_1' : { /*要翻译的字符串*/
        'auto_detected' : '留言', /*自动检测*/
        'zh_CN' : '留言', /*简体*/
        'zh_TW' : '留言1', /*繁体*/
        'en_GB' : '留言2', /*英语*/
        'jp_JP' : '留言3'  /*日语*/
        },

        'class:localTool_4_2' : { /*要翻译的字符串*/
        'auto_detected' : '留言设置', /*自动检测*/
        'zh_CN' : '留言设置', /*简体*/
        'zh_TW' : '留言设置1', /*繁体*/
        'en_GB' : '留言设置2', /*英语*/
        'jp_JP' : '留言设置3'  /*日语*/
        },

        'class:localTool_4_3' : { /*要翻译的字符串*/
        'auto_detected' : '数据分析', /*自动检测*/
        'zh_CN' : '数据分析', /*简体*/
        'zh_TW' : '数据分析1', /*繁体*/
        'en_GB' : '数据分析2', /*英语*/
        'jp_JP' : '数据分析3'  /*日语*/
        },

        'class:localTool_4_4' : { /*要翻译的字符串*/
        'auto_detected' : '点赞助手', /*自动检测*/
        'zh_CN' : '点赞助手', /*简体*/
        'zh_TW' : '点赞助手1', /*繁体*/
        'en_GB' : '点赞助手2', /*英语*/
        'jp_JP' : '点赞助手3'  /*日语*/
        },

        'class:localTool_4_5' : { /*要翻译的字符串*/
        'auto_detected' : '拓展功能(测试)', /*自动检测*/
        'zh_CN' : '拓展功能(测试)', /*简体*/
        'zh_TW' : '拓展功能(测试)1', /*繁体*/
        'en_GB' : '拓展功能(测试)2', /*英语*/
        'jp_JP' : '拓展功能(测试)3'  /*日语*/
        },

        'class:localTool_4_6' : { /*要翻译的字符串*/
        'auto_detected' : '设置', /*自动检测*/
        'zh_CN' : '设置', /*简体*/
        'zh_TW' : '设置1', /*繁体*/
        'en_GB' : '设置2', /*英语*/
        'jp_JP' : '设置3'  /*日语*/
        },

        'class:localTool_4_7' : { /*要翻译的字符串*/
        'auto_detected' : '当前字符字节数:', /*自动检测*/
        'zh_CN' : '当前字符字节数:', /*简体*/
        'zh_TW' : '当前字符字节数:1', /*繁体*/
        'en_GB' : '当前字符字节数:2', /*英语*/
        'jp_JP' : '当前字符字节数:3'  /*日语*/
        },

        'class:localTool_4_8' : { /*要翻译的字符串*/
        'auto_detected' : '0', /*自动检测*/
        'zh_CN' : '0', /*简体*/
        'zh_TW' : '01', /*繁体*/
        'en_GB' : '02', /*英语*/
        'jp_JP' : '03'  /*日语*/
        },

        'class:localTool_4_9' : { /*要翻译的字符串*/
        'auto_detected' : '/999', /*自动检测*/
        'zh_CN' : '/999', /*简体*/
        'zh_TW' : '/9991', /*繁体*/
        'en_GB' : '/9992', /*英语*/
        'jp_JP' : '/9993'  /*日语*/
        },

        'class:localTool_4_10' : { /*要翻译的字符串*/
        'auto_detected' : '文本格式(直接添加或选择文字添加)', /*自动检测*/
        'zh_CN' : '文本格式(直接添加或选择文字添加)', /*简体*/
        'zh_TW' : '文本格式(直接添加或选择文字添加)1', /*繁体*/
        'en_GB' : '文本格式(直接添加或选择文字添加)2', /*英语*/
        'jp_JP' : '文本格式(直接添加或选择文字添加)3'  /*日语*/
        },

        'class:localTool_4_11' : { /*要翻译的字符串*/
        'auto_detected' : '直接选择或搜索选择', /*自动检测*/
        'zh_CN' : '直接选择或搜索选择', /*简体*/
        'zh_TW' : '直接选择或搜索选择1', /*繁体*/
        'en_GB' : '直接选择或搜索选择2', /*英语*/
        'jp_JP' : '直接选择或搜索选择3'  /*日语*/
        },

        'class:localTool_4_12' : { /*要翻译的字符串*/
        'auto_detected' : '[h1]标题文字[/h1]', /*自动检测*/
        'zh_CN' : '[h1]标题文字[/h1]', /*简体*/
        'zh_TW' : '[h1]标题文字[/h1]1', /*繁体*/
        'en_GB' : '[h1]标题文字[/h1]2', /*英语*/
        'jp_JP' : '[h1]标题文字[/h1]3'  /*日语*/
        },

        'class:localTool_4_13' : { /*要翻译的字符串*/
        'auto_detected' : '[b]粗体文本[/b]', /*自动检测*/
        'zh_CN' : '[b]粗体文本[/b]', /*简体*/
        'zh_TW' : '[b]粗体文本[/b]1', /*繁体*/
        'en_GB' : '[b]粗体文本[/b]2', /*英语*/
        'jp_JP' : '[b]粗体文本[/b]3'  /*日语*/
        },

        'class:localTool_4_14' : { /*要翻译的字符串*/
        'auto_detected' : '[u]下划线文本[/u]', /*自动检测*/
        'zh_CN' : '[u]下划线文本[/u]', /*简体*/
        'zh_TW' : '[u]下划线文本[/u]1', /*繁体*/
        'en_GB' : '[u]下划线文本[/u]2', /*英语*/
        'jp_JP' : '[u]下划线文本[/u]3'  /*日语*/
        },

        'class:localTool_4_15' : { /*要翻译的字符串*/
        'auto_detected' : '[i]斜体文本[/i]', /*自动检测*/
        'zh_CN' : '[i]斜体文本[/i]', /*简体*/
        'zh_TW' : '[i]斜体文本[/i]1', /*繁体*/
        'en_GB' : '[i]斜体文本[/i]2', /*英语*/
        'jp_JP' : '[i]斜体文本[/i]3'  /*日语*/
        },

        'class:localTool_4_16' : { /*要翻译的字符串*/
        'auto_detected' : '[strike]删除文本[/strike]', /*自动检测*/
        'zh_CN' : '[strike]删除文本[/strike]', /*简体*/
        'zh_TW' : '[strike]删除文本[/strike]1', /*繁体*/
        'en_GB' : '[strike]删除文本[/strike]2', /*英语*/
        'jp_JP' : '[strike]删除文本[/strike]3'  /*日语*/
        },

        'class:localTool_4_17' : { /*要翻译的字符串*/
        'auto_detected' : '[spoiler]隐藏文本[/spoiler]', /*自动检测*/
        'zh_CN' : '[spoiler]隐藏文本[/spoiler]', /*简体*/
        'zh_TW' : '[spoiler]隐藏文本[/spoiler]1', /*繁体*/
        'en_GB' : '[spoiler]隐藏文本[/spoiler]2', /*英语*/
        'jp_JP' : '[spoiler]隐藏文本[/spoiler]3'  /*日语*/
        },

        'class:localTool_4_18' : { /*要翻译的字符串*/
        'auto_detected' : '[noparse]不解析[b]标签[/b][/noparse]', /*自动检测*/
        'zh_CN' : '[noparse]不解析[b]标签[/b][/noparse]', /*简体*/
        'zh_TW' : '[noparse]不解析[b]标签[/b][/noparse]1', /*繁体*/
        'en_GB' : '[noparse]不解析[b]标签[/b][/noparse]2', /*英语*/
        'jp_JP' : '[noparse]不解析[b]标签[/b][/noparse]3'  /*日语*/
        },

        'class:localTool_4_19' : { /*要翻译的字符串*/
        'auto_detected' : '[url=store.steampowered.com]网站链接[/url]', /*自动检测*/
        'zh_CN' : '[url=store.steampowered.com]网站链接[/url]', /*简体*/
        'zh_TW' : '[url=store.steampowered.com]网站链接[/url]1', /*繁体*/
        'en_GB' : '[url=store.steampowered.com]网站链接[/url]2', /*英语*/
        'jp_JP' : '[url=store.steampowered.com]网站链接[/url]3'  /*日语*/
        },

        'class:localTool_4_20' : { /*要翻译的字符串*/
        'auto_detected' : '添加', /*自动检测*/
        'zh_CN' : '添加', /*简体*/
        'zh_TW' : '添加1', /*繁体*/
        'en_GB' : '添加2', /*英语*/
        'jp_JP' : '添加3'  /*日语*/
        },

        'class:localTool_4_21' : { /*要翻译的字符串*/
        'auto_detected' : '翻译模块(需要提前设置国籍):', /*自动检测*/
        'zh_CN' : '翻译模块(需要提前设置国籍):', /*简体*/
        'zh_TW' : '翻译模块(需要提前设置国籍):1', /*繁体*/
        'en_GB' : '翻译模块(需要提前设置国籍):2', /*英语*/
        'jp_JP' : '翻译模块(需要提前设置国籍):3'  /*日语*/
        },

        'class:localTool_4_22' : { /*要翻译的字符串*/
        'auto_detected' : '当前语言:', /*自动检测*/
        'zh_CN' : '当前语言:', /*简体*/
        'zh_TW' : '当前语言:1', /*繁体*/
        'en_GB' : '当前语言:2', /*英语*/
        'jp_JP' : '当前语言:3'  /*日语*/
        },

        'class:localTool_4_23' : { /*要翻译的字符串*/
        'auto_detected' : '自动检测', /*自动检测*/
        'zh_CN' : '自动检测', /*简体*/
        'zh_TW' : '自动检测1', /*繁体*/
        'en_GB' : '自动检测2', /*英语*/
        'jp_JP' : '自动检测3'  /*日语*/
        },

        'class:localTool_4_24' : { /*要翻译的字符串*/
        'auto_detected' : '中文简体', /*自动检测*/
        'zh_CN' : '中文简体', /*简体*/
        'zh_TW' : '中文简体1', /*繁体*/
        'en_GB' : '中文简体2', /*英语*/
        'jp_JP' : '中文简体3'  /*日语*/
        },

        'class:localTool_4_25' : { /*要翻译的字符串*/
        'auto_detected' : '英语', /*自动检测*/
        'zh_CN' : '英语', /*简体*/
        'zh_TW' : '英语1', /*繁体*/
        'en_GB' : '英语2', /*英语*/
        'jp_JP' : '英语3'  /*日语*/
        },

        'class:localTool_4_26' : { /*要翻译的字符串*/
        'auto_detected' : '日语', /*自动检测*/
        'zh_CN' : '日语', /*简体*/
        'zh_TW' : '日语1', /*繁体*/
        'en_GB' : '日语2', /*英语*/
        'jp_JP' : '日语3'  /*日语*/
        },

        'class:localTool_4_27' : { /*要翻译的字符串*/
        'auto_detected' : '目标语言:', /*自动检测*/
        'zh_CN' : '目标语言:', /*简体*/
        'zh_TW' : '目标语言:1', /*繁体*/
        'en_GB' : '目标语言:2', /*英语*/
        'jp_JP' : '目标语言:3'  /*日语*/
        },

        'class:localTool_4_28' : { /*要翻译的字符串*/
        'auto_detected' : '英语', /*自动检测*/
        'zh_CN' : '英语', /*简体*/
        'zh_TW' : '英语1', /*繁体*/
        'en_GB' : '英语2', /*英语*/
        'jp_JP' : '英语3'  /*日语*/
        },

        'class:localTool_4_29' : { /*要翻译的字符串*/
        'auto_detected' : '日语', /*自动检测*/
        'zh_CN' : '日语', /*简体*/
        'zh_TW' : '日语1', /*繁体*/
        'en_GB' : '日语2', /*英语*/
        'jp_JP' : '日语3'  /*日语*/
        },

        'class:localTool_4_30' : { /*要翻译的字符串*/
        'auto_detected' : '中文简体', /*自动检测*/
        'zh_CN' : '中文简体', /*简体*/
        'zh_TW' : '中文简体1', /*繁体*/
        'en_GB' : '中文简体2', /*英语*/
        'jp_JP' : '中文简体3'  /*日语*/
        },

        'class:localTool_4_31' : { /*要翻译的字符串*/
        'auto_detected' : '马新简体[zh-sg]', /*自动检测*/
        'zh_CN' : '马新简体[zh-sg]', /*简体*/
        'zh_TW' : '马新简体[zh-sg]1', /*繁体*/
        'en_GB' : '马新简体[zh-sg]2', /*英语*/
        'jp_JP' : '马新简体[zh-sg]3'  /*日语*/
        },

        'class:localTool_4_32' : { /*要翻译的字符串*/
        'auto_detected' : '繁體中文[zh-hant]', /*自动检测*/
        'zh_CN' : '繁體中文[zh-hant]', /*简体*/
        'zh_TW' : '繁體中文[zh-hant]1', /*繁体*/
        'en_GB' : '繁體中文[zh-hant]2', /*英语*/
        'jp_JP' : '繁體中文[zh-hant]3'  /*日语*/
        },

        'class:localTool_4_33' : { /*要翻译的字符串*/
        'auto_detected' : '繁體中文(香港)[zh-hk]', /*自动检测*/
        'zh_CN' : '繁體中文(香港)[zh-hk]', /*简体*/
        'zh_TW' : '繁體中文(香港)[zh-hk]1', /*繁体*/
        'en_GB' : '繁體中文(香港)[zh-hk]2', /*英语*/
        'jp_JP' : '繁體中文(香港)[zh-hk]3'  /*日语*/
        },

        'class:localTool_4_34' : { /*要翻译的字符串*/
        'auto_detected' : '繁體中文(澳门)[zh-mo]', /*自动检测*/
        'zh_CN' : '繁體中文(澳门)[zh-mo]', /*简体*/
        'zh_TW' : '繁體中文(澳门)[zh-mo]1', /*繁体*/
        'en_GB' : '繁體中文(澳门)[zh-mo]2', /*英语*/
        'jp_JP' : '繁體中文(澳门)[zh-mo]3'  /*日语*/
        },

        'class:localTool_4_35' : { /*要翻译的字符串*/
        'auto_detected' : '繁體中文(台湾)[zh-tw]', /*自动检测*/
        'zh_CN' : '繁體中文(台湾)[zh-tw]', /*简体*/
        'zh_TW' : '繁體中文(台湾)[zh-tw]1', /*繁体*/
        'en_GB' : '繁體中文(台湾)[zh-tw]2', /*英语*/
        'jp_JP' : '繁體中文(台湾)[zh-tw]3'  /*日语*/
        },

        'class:localTool_4_36' : { /*要翻译的字符串*/
        'auto_detected' : '翻译', /*自动检测*/
        'zh_CN' : '翻译', /*简体*/
        'zh_TW' : '翻译1', /*繁体*/
        'en_GB' : '翻译2', /*英语*/
        'jp_JP' : '翻译3'  /*日语*/
        },

        'class:localTool_4_37' : { /*要翻译的字符串*/
        'auto_detected' : '添加称呼模块(需要提前设置备注):', /*自动检测*/
        'zh_CN' : '添加称呼模块(需要提前设置备注):', /*简体*/
        'zh_TW' : '添加称呼模块(需要提前设置备注):1', /*繁体*/
        'en_GB' : '添加称呼模块(需要提前设置备注):2', /*英语*/
        'jp_JP' : '添加称呼模块(需要提前设置备注):3'  /*日语*/
        },

        'class:localTool_4_38' : { /*要翻译的字符串*/
        'auto_detected' : '自定义称呼模式', /*自动检测*/
        'zh_CN' : '自定义称呼模式', /*简体*/
        'zh_TW' : '自定义称呼模式1', /*繁体*/
        'en_GB' : '自定义称呼模式2', /*英语*/
        'jp_JP' : '自定义称呼模式3'  /*日语*/
        },

        'class:localTool_4_39' : { /*要翻译的字符串*/
        'auto_detected' : '在留言框添加自定义称呼标识符', /*自动检测*/
        'zh_CN' : '在留言框添加自定义称呼标识符', /*简体*/
        'zh_TW' : '在留言框添加自定义称呼标识符1', /*繁体*/
        'en_GB' : '在留言框添加自定义称呼标识符2', /*英语*/
        'jp_JP' : '在留言框添加自定义称呼标识符3'  /*日语*/
        },

        'class:localTool_4_40' : { /*要翻译的字符串*/
        'auto_detected' : '是否为好友添加称呼(如果好友没有备注则使用steam名称)', /*自动检测*/
        'zh_CN' : '是否为好友添加称呼(如果好友没有备注则使用steam名称)', /*简体*/
        'zh_TW' : '是否为好友添加称呼(如果好友没有备注则使用steam名称)1', /*繁体*/
        'en_GB' : '是否为好友添加称呼(如果好友没有备注则使用steam名称)2', /*英语*/
        'jp_JP' : '是否为好友添加称呼(如果好友没有备注则使用steam名称)3'  /*日语*/
        },

        'class:localTool_4_41' : { /*要翻译的字符串*/
        'auto_detected' : '是否为好友添加称呼(如果好友设置有备注则使用，否则不添加称呼)', /*自动检测*/
        },

        'class:localTool_4_42' : { /*要翻译的字符串*/
        'auto_detected' : '格式化帮助', /*自动检测*/
        'zh_CN' : '格式化帮助', /*简体*/
        'zh_TW' : '格式化帮助1', /*繁体*/
        'en_GB' : '格式化帮助2', /*英语*/
        'jp_JP' : '格式化帮助3'  /*日语*/
        },

        'class:localTool_4_43' : { /*要翻译的字符串*/
        'auto_detected' : '发送评论给选择的好友', /*自动检测*/
        'zh_CN' : '发送评论给选择的好友', /*简体*/
        'zh_TW' : '发送评论给选择的好友1', /*繁体*/
        'en_GB' : '发送评论给选择的好友2', /*英语*/
        'jp_JP' : '发送评论给选择的好友3'  /*日语*/
        },

        'class:localTool_4_44' : { /*要翻译的字符串*/
        'auto_detected' : '根据国籍发送评论给选择的好友', /*自动检测*/
        'zh_CN' : '根据国籍发送评论给选择的好友', /*简体*/
        'zh_TW' : '根据国籍发送评论给选择的好友1', /*繁体*/
        'en_GB' : '根据国籍发送评论给选择的好友2', /*英语*/
        'jp_JP' : '根据国籍发送评论给选择的好友3'  /*日语*/
        },

        'class:localTool_4_45' : { /*要翻译的字符串*/
        'auto_detected' : '设置国籍:', /*自动检测*/
        'zh_CN' : '设置国籍:', /*简体*/
        'zh_TW' : '设置国籍:1', /*繁体*/
        'en_GB' : '设置国籍:2', /*英语*/
        'jp_JP' : '设置国籍:3'  /*日语*/
        },

        'class:localTool_4_46' : { /*要翻译的字符串*/
        'auto_detected' : '请选择要设置的国籍:', /*自动检测*/
        'zh_CN' : '请选择要设置的国籍:', /*简体*/
        'zh_TW' : '请选择要设置的国籍:1', /*繁体*/
        'en_GB' : '请选择要设置的国籍:2', /*英语*/
        'jp_JP' : '请选择要设置的国籍:3'  /*日语*/
        },

        'class:localTool_4_47' : { /*要翻译的字符串*/
        'auto_detected' : '简体中文', /*自动检测*/
        'zh_CN' : '简体中文', /*简体*/
        'zh_TW' : '简体中文1', /*繁体*/
        'en_GB' : '简体中文2', /*英语*/
        'jp_JP' : '简体中文3'  /*日语*/
        },

        'class:localTool_4_48' : { /*要翻译的字符串*/
        'auto_detected' : '英语', /*自动检测*/
        'zh_CN' : '英语', /*简体*/
        'zh_TW' : '英语1', /*繁体*/
        'en_GB' : '英语2', /*英语*/
        'jp_JP' : '英语3'  /*日语*/
        },

        'class:localTool_4_49' : { /*要翻译的字符串*/
        'auto_detected' : '日语', /*自动检测*/
        'zh_CN' : '日语', /*简体*/
        'zh_TW' : '日语1', /*繁体*/
        'en_GB' : '日语2', /*英语*/
        'jp_JP' : '日语3'  /*日语*/
        },

        'class:localTool_4_50' : { /*要翻译的字符串*/
        'auto_detected' : '马新简体(马来西亚,新加坡)[zh-sg]', /*自动检测*/
        'zh_CN' : '马新简体(马来西亚,新加坡)[zh-sg]', /*简体*/
        'zh_TW' : '马新简体(马来西亚,新加坡)[zh-sg]1', /*繁体*/
        'en_GB' : '马新简体(马来西亚,新加坡)[zh-sg]2', /*英语*/
        'jp_JP' : '马新简体(马来西亚,新加坡)[zh-sg]3'  /*日语*/
        },

        'class:localTool_4_51' : { /*要翻译的字符串*/
        'auto_detected' : '繁體中文[zh-hant]', /*自动检测*/
        'zh_CN' : '繁體中文[zh-hant]', /*简体*/
        'zh_TW' : '繁體中文[zh-hant]1', /*繁体*/
        'en_GB' : '繁體中文[zh-hant]2', /*英语*/
        'jp_JP' : '繁體中文[zh-hant]3'  /*日语*/
        },

        'class:localTool_4_52' : { /*要翻译的字符串*/
        'auto_detected' : '繁體中文(香港)[zh-hk]', /*自动检测*/
        'zh_CN' : '繁體中文(香港)[zh-hk]', /*简体*/
        'zh_TW' : '繁體中文(香港)[zh-hk]1', /*繁体*/
        'en_GB' : '繁體中文(香港)[zh-hk]2', /*英语*/
        'jp_JP' : '繁體中文(香港)[zh-hk]3'  /*日语*/
        },

        'class:localTool_4_53' : { /*要翻译的字符串*/
        'auto_detected' : '繁體中文(澳门)[zh-mo]', /*自动检测*/
        'zh_CN' : '繁體中文(澳门)[zh-mo]', /*简体*/
        'zh_TW' : '繁體中文(澳门)[zh-mo]1', /*繁体*/
        'en_GB' : '繁體中文(澳门)[zh-mo]2', /*英语*/
        'jp_JP' : '繁體中文(澳门)[zh-mo]3'  /*日语*/
        },

        'class:localTool_4_54' : { /*要翻译的字符串*/
        'auto_detected' : '繁體中文(台湾)[zh-tw]', /*自动检测*/
        'zh_CN' : '繁體中文(台湾)[zh-tw]', /*简体*/
        'zh_TW' : '繁體中文(台湾)[zh-tw]1', /*繁体*/
        'en_GB' : '繁體中文(台湾)[zh-tw]2', /*英语*/
        'jp_JP' : '繁體中文(台湾)[zh-tw]3'  /*日语*/
        },

        'class:localTool_4_55' : { /*要翻译的字符串*/
        'auto_detected' : '为选择的好友设置国籍标识', /*自动检测*/
        'zh_CN' : '为选择的好友设置国籍标识', /*简体*/
        'zh_TW' : '为选择的好友设置国籍标识1', /*繁体*/
        'en_GB' : '为选择的好友设置国籍标识2', /*英语*/
        'jp_JP' : '为选择的好友设置国籍标识3'  /*日语*/
        },

        'class:localTool_4_56' : { /*要翻译的字符串*/
        'auto_detected' : '为选择的好友取消国籍标识', /*自动检测*/
        'zh_CN' : '为选择的好友取消国籍标识', /*简体*/
        'zh_TW' : '为选择的好友取消国籍标识1', /*繁体*/
        'en_GB' : '为选择的好友取消国籍标识2', /*英语*/
        'jp_JP' : '为选择的好友取消国籍标识3'  /*日语*/
        },

        'class:localTool_4_57' : { /*要翻译的字符串*/
        'auto_detected' : '设置不留言:', /*自动检测*/
        'zh_CN' : '设置不留言:', /*简体*/
        'zh_TW' : '设置不留言:1', /*繁体*/
        'en_GB' : '设置不留言:2', /*英语*/
        'jp_JP' : '设置不留言:3'  /*日语*/
        },

        'class:localTool_4_58' : { /*要翻译的字符串*/
        'auto_detected' : '为选择的好友设置不留言', /*自动检测*/
        'zh_CN' : '为选择的好友设置不留言', /*简体*/
        'zh_TW' : '为选择的好友设置不留言1', /*繁体*/
        'en_GB' : '为选择的好友设置不留言2', /*英语*/
        'jp_JP' : '为选择的好友设置不留言3'  /*日语*/
        },

        'class:localTool_4_59' : { /*要翻译的字符串*/
        'auto_detected' : '为选择的好友取消设置不留言', /*自动检测*/
        'zh_CN' : '为选择的好友取消设置不留言', /*简体*/
        'zh_TW' : '为选择的好友取消设置不留言1', /*繁体*/
        'en_GB' : '为选择的好友取消设置不留言2', /*英语*/
        'jp_JP' : '为选择的好友取消设置不留言3'  /*日语*/
        },

        'class:localTool_4_60' : { /*要翻译的字符串*/
        'auto_detected' : '设置留言时间间隔:', /*自动检测*/
        'zh_CN' : '设置留言时间间隔:', /*简体*/
        'zh_TW' : '设置留言时间间隔:1', /*繁体*/
        'en_GB' : '设置留言时间间隔:2', /*英语*/
        'jp_JP' : '设置留言时间间隔:3'  /*日语*/
        },

        'class:localTool_4_61' : { /*要翻译的字符串*/
        },

        'class:localTool_4_62' : { /*要翻译的字符串*/
        },

        'class:localTool_4_63' : { /*要翻译的字符串*/
        'auto_detected' : '请选择留言', /*自动检测*/
        'zh_CN' : '请选择留言', /*简体*/
        'zh_TW' : '请选择留言1', /*繁体*/
        'en_GB' : '请选择留言2', /*英语*/
        'jp_JP' : '请选择留言3'  /*日语*/
        },

        'class:localTool_4_64' : { /*要翻译的字符串*/
        'auto_detected' : '留言日期差', /*自动检测*/
        'zh_CN' : '留言日期差', /*简体*/
        'zh_TW' : '留言日期差1', /*繁体*/
        'en_GB' : '留言日期差2', /*英语*/
        'jp_JP' : '留言日期差3'  /*日语*/
        },

        'class:localTool_4_65' : { /*要翻译的字符串*/
        'auto_detected' : '为选择的好友设置留言时间间隔', /*自动检测*/
        'zh_CN' : '为选择的好友设置留言时间间隔', /*简体*/
        'zh_TW' : '为选择的好友设置留言时间间隔1', /*繁体*/
        'en_GB' : '为选择的好友设置留言时间间隔2', /*英语*/
        'jp_JP' : '为选择的好友设置留言时间间隔3'  /*日语*/
        },

        'class:localTool_4_66' : { /*要翻译的字符串*/
        'auto_detected' : '为选择的好友取消设置留言时间间隔', /*自动检测*/
        'zh_CN' : '为选择的好友取消设置留言时间间隔', /*简体*/
        'zh_TW' : '为选择的好友取消设置留言时间间隔1', /*繁体*/
        'en_GB' : '为选择的好友取消设置留言时间间隔2', /*英语*/
        'jp_JP' : '为选择的好友取消设置留言时间间隔3'  /*日语*/
        },

        'class:localTool_4_67' : { /*要翻译的字符串*/
        'auto_detected' : '设置自动留言计划:', /*自动检测*/
        'zh_CN' : '设置自动留言计划:', /*简体*/
        'zh_TW' : '设置自动留言计划:1', /*繁体*/
        'en_GB' : '设置自动留言计划:2', /*英语*/
        'jp_JP' : '设置自动留言计划:3'  /*日语*/
        },

        'class:localTool_4_68' : { /*要翻译的字符串*/
        'auto_detected' : '请选择时间', /*自动检测*/
        'zh_CN' : '请选择时间', /*简体*/
        'zh_TW' : '请选择时间1', /*繁体*/
        'en_GB' : '请选择时间2', /*英语*/
        'jp_JP' : '请选择时间3'  /*日语*/
        },

        'class:localTool_4_69' : { /*要翻译的字符串*/
        'auto_detected' : '请选择时间', /*自动检测*/
        'zh_CN' : '请选择时间', /*简体*/
        'zh_TW' : '请选择时间1', /*繁体*/
        'en_GB' : '请选择时间2', /*英语*/
        'jp_JP' : '请选择时间3'  /*日语*/
        },

        'class:localTool_4_70' : { /*要翻译的字符串*/
        'auto_detected' : '设置好友分组:', /*自动检测*/
        'zh_CN' : '设置好友分组:', /*简体*/
        'zh_TW' : '设置好友分组:1', /*繁体*/
        'en_GB' : '设置好友分组:2', /*英语*/
        'jp_JP' : '设置好友分组:3'  /*日语*/
        },

        'class:localTool_4_71' : { /*要翻译的字符串*/
        'auto_detected' : '分组列表', /*自动检测*/
        'zh_CN' : '分组列表', /*简体*/
        'zh_TW' : '分组列表1', /*繁体*/
        'en_GB' : '分组列表2', /*英语*/
        'jp_JP' : '分组列表3'  /*日语*/
        },

        'class:localTool_4_72' : { /*要翻译的字符串*/
        'auto_detected' : '直接选择或搜索选择', /*自动检测*/
        'zh_CN' : '直接选择或搜索选择', /*简体*/
        'zh_TW' : '直接选择或搜索选择1', /*繁体*/
        'en_GB' : '直接选择或搜索选择2', /*英语*/
        'jp_JP' : '直接选择或搜索选择3'  /*日语*/
        },

        'class:localTool_4_73' : { /*要翻译的字符串*/
        'auto_detected' : '分组名称', /*自动检测*/
        'zh_CN' : '分组名称', /*简体*/
        'zh_TW' : '分组名称1', /*繁体*/
        'en_GB' : '分组名称2', /*英语*/
        'jp_JP' : '分组名称3'  /*日语*/
        },

        'class:localTool_4_74' : { /*要翻译的字符串*/
        'auto_detected' : '分组名称', /*自动检测*/
        'zh_CN' : '分组名称', /*简体*/
        'zh_TW' : '分组名称1', /*繁体*/
        'en_GB' : '分组名称2', /*英语*/
        'jp_JP' : '分组名称3'  /*日语*/
        },

        'class:localTool_4_75' : { /*要翻译的字符串*/
        'auto_detected' : '分组名称', /*自动检测*/
        'zh_CN' : '分组名称', /*简体*/
        'zh_TW' : '分组名称1', /*繁体*/
        'en_GB' : '分组名称2', /*英语*/
        'jp_JP' : '分组名称3'  /*日语*/
        },

        'class:localTool_4_76' : { /*要翻译的字符串*/
        'auto_detected' : '分组名称', /*自动检测*/
        'zh_CN' : '分组名称', /*简体*/
        'zh_TW' : '分组名称1', /*繁体*/
        'en_GB' : '分组名称2', /*英语*/
        'jp_JP' : '分组名称3'  /*日语*/
        },

        'class:localTool_4_77' : { /*要翻译的字符串*/
        'auto_detected' : '分组名称', /*自动检测*/
        'zh_CN' : '分组名称', /*简体*/
        'zh_TW' : '分组名称1', /*繁体*/
        'en_GB' : '分组名称2', /*英语*/
        'jp_JP' : '分组名称3'  /*日语*/
        },

        'class:localTool_4_78' : { /*要翻译的字符串*/
        'auto_detected' : '分组名称', /*自动检测*/
        'zh_CN' : '分组名称', /*简体*/
        'zh_TW' : '分组名称1', /*繁体*/
        'en_GB' : '分组名称2', /*英语*/
        'jp_JP' : '分组名称3'  /*日语*/
        },

        'class:localTool_4_79' : { /*要翻译的字符串*/
        'auto_detected' : '分组名称', /*自动检测*/
        'zh_CN' : '分组名称', /*简体*/
        'zh_TW' : '分组名称1', /*繁体*/
        'en_GB' : '分组名称2', /*英语*/
        'jp_JP' : '分组名称3'  /*日语*/
        },

        'class:localTool_4_80' : { /*要翻译的字符串*/
        'auto_detected' : '分组名称', /*自动检测*/
        'zh_CN' : '分组名称', /*简体*/
        'zh_TW' : '分组名称1', /*繁体*/
        'en_GB' : '分组名称2', /*英语*/
        'jp_JP' : '分组名称3'  /*日语*/
        },

        'class:localTool_4_81' : { /*要翻译的字符串*/
        'auto_detected' : '分组名称', /*自动检测*/
        'zh_CN' : '分组名称', /*简体*/
        'zh_TW' : '分组名称1', /*繁体*/
        'en_GB' : '分组名称2', /*英语*/
        'jp_JP' : '分组名称3'  /*日语*/
        },

        'class:localTool_4_82' : { /*要翻译的字符串*/
        'auto_detected' : '编辑列表', /*自动检测*/
        'zh_CN' : '编辑列表', /*简体*/
        'zh_TW' : '编辑列表1', /*繁体*/
        'en_GB' : '编辑列表2', /*英语*/
        'jp_JP' : '编辑列表3'  /*日语*/
        },

        'class:localTool_4_83' : { /*要翻译的字符串*/
        'auto_detected' : '为选择的好友添加分组', /*自动检测*/
        'zh_CN' : '为选择的好友添加分组', /*简体*/
        'zh_TW' : '为选择的好友添加分组1', /*繁体*/
        'en_GB' : '为选择的好友添加分组2', /*英语*/
        'jp_JP' : '为选择的好友添加分组3'  /*日语*/
        },

        'class:localTool_4_84' : { /*要翻译的字符串*/
        'auto_detected' : '为选择的好友取消添加分组', /*自动检测*/
        'zh_CN' : '为选择的好友取消添加分组', /*简体*/
        'zh_TW' : '为选择的好友取消添加分组1', /*繁体*/
        'en_GB' : '为选择的好友取消添加分组2', /*英语*/
        'jp_JP' : '为选择的好友取消添加分组3'  /*日语*/
        },

        'class:localTool_4_85' : { /*要翻译的字符串*/
        'auto_detected' : '分组名称', /*自动检测*/
        'zh_CN' : '分组名称', /*简体*/
        'zh_TW' : '分组名称1', /*繁体*/
        'en_GB' : '分组名称2', /*英语*/
        'jp_JP' : '分组名称3'  /*日语*/
        },

        'class:localTool_4_86' : { /*要翻译的字符串*/
        'auto_detected' : '用户', /*自动检测*/
        'zh_CN' : '用户', /*简体*/
        'zh_TW' : '用户1', /*繁体*/
        'en_GB' : '用户2', /*英语*/
        'jp_JP' : '用户3'  /*日语*/
        },

        'class:localTool_4_87' : { /*要翻译的字符串*/
        'auto_detected' : '用户', /*自动检测*/
        'zh_CN' : '用户', /*简体*/
        'zh_TW' : '用户1', /*繁体*/
        'en_GB' : '用户2', /*英语*/
        'jp_JP' : '用户3'  /*日语*/
        },

        'class:localTool_4_88' : { /*要翻译的字符串*/
        'auto_detected' : '用户', /*自动检测*/
        'zh_CN' : '用户', /*简体*/
        'zh_TW' : '用户1', /*繁体*/
        'en_GB' : '用户2', /*英语*/
        'jp_JP' : '用户3'  /*日语*/
        },

        'class:localTool_4_89' : { /*要翻译的字符串*/
        'auto_detected' : '分组名称', /*自动检测*/
        'zh_CN' : '分组名称', /*简体*/
        'zh_TW' : '分组名称1', /*繁体*/
        'en_GB' : '分组名称2', /*英语*/
        'jp_JP' : '分组名称3'  /*日语*/
        },

        'class:localTool_4_90' : { /*要翻译的字符串*/
        'auto_detected' : '用户', /*自动检测*/
        'zh_CN' : '用户', /*简体*/
        'zh_TW' : '用户1', /*繁体*/
        'en_GB' : '用户2', /*英语*/
        'jp_JP' : '用户3'  /*日语*/
        },

        'class:localTool_4_91' : { /*要翻译的字符串*/
        'auto_detected' : '用户', /*自动检测*/
        'zh_CN' : '用户', /*简体*/
        'zh_TW' : '用户1', /*繁体*/
        'en_GB' : '用户2', /*英语*/
        'jp_JP' : '用户3'  /*日语*/
        },

        'class:localTool_4_92' : { /*要翻译的字符串*/
        'auto_detected' : '分组名称', /*自动检测*/
        'zh_CN' : '分组名称', /*简体*/
        'zh_TW' : '分组名称1', /*繁体*/
        'en_GB' : '分组名称2', /*英语*/
        'jp_JP' : '分组名称3'  /*日语*/
        },

        'class:localTool_4_93' : { /*要翻译的字符串*/
        'auto_detected' : '用户', /*自动检测*/
        'zh_CN' : '用户', /*简体*/
        'zh_TW' : '用户1', /*繁体*/
        'en_GB' : '用户2', /*英语*/
        'jp_JP' : '用户3'  /*日语*/
        },

        'class:localTool_4_94' : { /*要翻译的字符串*/
        'auto_detected' : '用户', /*自动检测*/
        'zh_CN' : '用户', /*简体*/
        'zh_TW' : '用户1', /*繁体*/
        'en_GB' : '用户2', /*英语*/
        'jp_JP' : '用户3'  /*日语*/
        },

        'class:localTool_4_95' : { /*要翻译的字符串*/
        'auto_detected' : '分组名称', /*自动检测*/
        'zh_CN' : '分组名称', /*简体*/
        'zh_TW' : '分组名称1', /*繁体*/
        'en_GB' : '分组名称2', /*英语*/
        'jp_JP' : '分组名称3'  /*日语*/
        },

        'class:localTool_4_96' : { /*要翻译的字符串*/
        'auto_detected' : '用户', /*自动检测*/
        'zh_CN' : '用户', /*简体*/
        'zh_TW' : '用户1', /*繁体*/
        'en_GB' : '用户2', /*英语*/
        'jp_JP' : '用户3'  /*日语*/
        },

        'class:localTool_4_97' : { /*要翻译的字符串*/
        'auto_detected' : '按国籍进行高亮分组', /*自动检测*/
        'zh_CN' : '按国籍进行高亮分组', /*简体*/
        'zh_TW' : '按国籍进行高亮分组1', /*繁体*/
        'en_GB' : '按国籍进行高亮分组2', /*英语*/
        'jp_JP' : '按国籍进行高亮分组3'  /*日语*/
        },

        'class:localTool_4_98' : { /*要翻译的字符串*/
        'auto_detected' : '按国籍进行排序分组(慢)', /*自动检测*/
        'zh_CN' : '按国籍进行排序分组(慢)', /*简体*/
        'zh_TW' : '按国籍进行排序分组(慢)1', /*繁体*/
        'en_GB' : '按国籍进行排序分组(慢)2', /*英语*/
        'jp_JP' : '按国籍进行排序分组(慢)3'  /*日语*/
        },

        'class:localTool_4_99' : { /*要翻译的字符串*/
        'auto_detected' : '按在线时间进行排序分组', /*自动检测*/
        'zh_CN' : '按在线时间进行排序分组', /*简体*/
        'zh_TW' : '按在线时间进行排序分组1', /*繁体*/
        'en_GB' : '按在线时间进行排序分组2', /*英语*/
        'jp_JP' : '按在线时间进行排序分组3'  /*日语*/
        },

        'class:localTool_4_100' : { /*要翻译的字符串*/
        'auto_detected' : '显示好友详细数据-不可用', /*自动检测*/
        'zh_CN' : '显示好友详细数据-不可用', /*简体*/
        'zh_TW' : '显示好友详细数据-不可用1', /*繁体*/
        'en_GB' : '显示好友详细数据-不可用2', /*英语*/
        'jp_JP' : '显示好友详细数据-不可用3'  /*日语*/
        },

        'class:localTool_4_101' : { /*要翻译的字符串*/
        'auto_detected' : '好友数据统计', /*自动检测*/
        'zh_CN' : '好友数据统计', /*简体*/
        'zh_TW' : '好友数据统计1', /*繁体*/
        'en_GB' : '好友数据统计2', /*英语*/
        'jp_JP' : '好友数据统计3'  /*日语*/
        },

        'class:localTool_4_102' : { /*要翻译的字符串*/
        'auto_detected' : '留言数据统计', /*自动检测*/
        'zh_CN' : '留言数据统计', /*简体*/
        'zh_TW' : '留言数据统计1', /*繁体*/
        'en_GB' : '留言数据统计2', /*英语*/
        'jp_JP' : '留言数据统计3'  /*日语*/
        },

        'class:localTool_4_103' : { /*要翻译的字符串*/
        'auto_detected' : '关系网统计', /*自动检测*/
        'zh_CN' : '关系网统计', /*简体*/
        'zh_TW' : '关系网统计1', /*繁体*/
        'en_GB' : '关系网统计2', /*英语*/
        'jp_JP' : '关系网统计3'  /*日语*/
        },

        'class:localTool_4_104' : { /*要翻译的字符串*/
        'auto_detected' : '当前配置统计', /*自动检测*/
        'zh_CN' : '当前配置统计', /*简体*/
        'zh_TW' : '当前配置统计1', /*繁体*/
        'en_GB' : '当前配置统计2', /*英语*/
        'jp_JP' : '当前配置统计3'  /*日语*/
        },

        'class:localTool_4_105' : { /*要翻译的字符串*/
        'auto_detected' : '查看好友配置统计', /*自动检测*/
        'zh_CN' : '查看好友配置统计', /*简体*/
        'zh_TW' : '查看好友配置统计1', /*繁体*/
        'en_GB' : '查看好友配置统计2', /*英语*/
        'jp_JP' : '查看好友配置统计3'  /*日语*/
        },

        'class:localTool_4_106' : { /*要翻译的字符串*/
        'auto_detected' : '数据表格(汇总所有的数据:id,名称,备注,国籍(语言),等级,好友数量,游戏数量,dlc数量,创意工坊数量,艺术作品数量,动态数量)', /*自动检测*/
        },

        'class:localTool_4_107' : { /*要翻译的字符串*/
        'auto_detected' : '分为:', /*自动检测*/
        'zh_CN' : '分为:', /*简体*/
        'zh_TW' : '分为:1', /*繁体*/
        'en_GB' : '分为:2', /*英语*/
        'jp_JP' : '分为:3'  /*日语*/
        },

        'class:localTool_4_108' : { /*要翻译的字符串*/
        'auto_detected' : '按国籍的饼图(总留言数量)，', /*自动检测*/
        'zh_CN' : '按国籍的饼图(总留言数量)，', /*简体*/
        'zh_TW' : '按国籍的饼图(总留言数量)，1', /*繁体*/
        'en_GB' : '按国籍的饼图(总留言数量)，2', /*英语*/
        'jp_JP' : '按国籍的饼图(总留言数量)，3'  /*日语*/
        },

        'class:localTool_4_109' : { /*要翻译的字符串*/
        'auto_detected' : '按每天留言数据的折线图(统计所有的留言数据，生成的折线图)，', /*自动检测*/
        },

        'class:localTool_4_110' : { /*要翻译的字符串*/
        },

        'class:localTool_4_111' : { /*要翻译的字符串*/
        'auto_detected' : '数据表格(汇总所有的数据)', /*自动检测*/
        'zh_CN' : '数据表格(汇总所有的数据)', /*简体*/
        'zh_TW' : '数据表格(汇总所有的数据)1', /*繁体*/
        'en_GB' : '数据表格(汇总所有的数据)2', /*英语*/
        'jp_JP' : '数据表格(汇总所有的数据)3'  /*日语*/
        },

        'class:localTool_4_112' : { /*要翻译的字符串*/
        'auto_detected' : '好友关系网(仅统计共同好友)', /*自动检测*/
        'zh_CN' : '好友关系网(仅统计共同好友)', /*简体*/
        'zh_TW' : '好友关系网(仅统计共同好友)1', /*繁体*/
        'en_GB' : '好友关系网(仅统计共同好友)2', /*英语*/
        'jp_JP' : '好友关系网(仅统计共同好友)3'  /*日语*/
        },

        'class:localTool_4_113' : { /*要翻译的字符串*/
        'auto_detected' : '当前的配置数据和运行状态', /*自动检测*/
        'zh_CN' : '当前的配置数据和运行状态', /*简体*/
        'zh_TW' : '当前的配置数据和运行状态1', /*繁体*/
        'en_GB' : '当前的配置数据和运行状态2', /*英语*/
        'jp_JP' : '当前的配置数据和运行状态3'  /*日语*/
        },

        'class:localTool_4_114' : { /*要翻译的字符串*/
        'auto_detected' : '对好友设置的配置数据(比如国籍,不留言,留言时间间隔等)', /*自动检测*/
        'zh_CN' : '对好友设置的配置数据(比如国籍,不留言,留言时间间隔等)', /*简体*/
        'zh_TW' : '对好友设置的配置数据(比如国籍,不留言,留言时间间隔等)1', /*繁体*/
        'en_GB' : '对好友设置的配置数据(比如国籍,不留言,留言时间间隔等)2', /*英语*/
        'jp_JP' : '对好友设置的配置数据(比如国籍,不留言,留言时间间隔等)3'  /*日语*/
        },

        'class:localTool_4_115' : { /*要翻译的字符串*/
        'auto_detected' : '动态点赞助手', /*自动检测*/
        'zh_CN' : '动态点赞助手', /*简体*/
        'zh_TW' : '动态点赞助手1', /*繁体*/
        'en_GB' : '动态点赞助手2', /*英语*/
        'jp_JP' : '动态点赞助手3'  /*日语*/
        },

        'class:localTool_4_116' : { /*要翻译的字符串*/
        'auto_detected' : '总开关', /*自动检测*/
        'zh_CN' : '总开关', /*简体*/
        'zh_TW' : '总开关1', /*繁体*/
        'en_GB' : '总开关2', /*英语*/
        'jp_JP' : '总开关3'  /*日语*/
        },

        'class:localTool_4_117' : { /*要翻译的字符串*/
        'auto_detected' : '设置点赞内容:', /*自动检测*/
        'zh_CN' : '设置点赞内容:', /*简体*/
        'zh_TW' : '设置点赞内容:1', /*繁体*/
        'en_GB' : '设置点赞内容:2', /*英语*/
        'jp_JP' : '设置点赞内容:3'  /*日语*/
        },

        'class:localTool_4_118' : { /*要翻译的字符串*/
        'auto_detected' : '点赞内容:', /*自动检测*/
        'zh_CN' : '点赞内容:', /*简体*/
        'zh_TW' : '点赞内容:1', /*繁体*/
        'en_GB' : '点赞内容:2', /*英语*/
        'jp_JP' : '点赞内容:3'  /*日语*/
        },

        'class:localTool_4_119' : { /*要翻译的字符串*/
        'auto_detected' : '设置自动点赞模式:', /*自动检测*/
        'zh_CN' : '设置自动点赞模式:', /*简体*/
        'zh_TW' : '设置自动点赞模式:1', /*繁体*/
        'en_GB' : '设置自动点赞模式:2', /*英语*/
        'jp_JP' : '设置自动点赞模式:3'  /*日语*/
        },

        'class:localTool_4_120' : { /*要翻译的字符串*/
        'auto_detected' : '点赞模式:', /*自动检测*/
        'zh_CN' : '点赞模式:', /*简体*/
        'zh_TW' : '点赞模式:1', /*繁体*/
        'en_GB' : '点赞模式:2', /*英语*/
        'jp_JP' : '点赞模式:3'  /*日语*/
        },

        'class:localTool_4_121' : { /*要翻译的字符串*/
        'auto_detected' : '设置自动点赞时间区间(默认今天~之前所有的动态内容)', /*自动检测*/
        'zh_CN' : '设置自动点赞时间区间(默认今天~之前所有的动态内容)', /*简体*/
        'zh_TW' : '设置自动点赞时间区间(默认今天~之前所有的动态内容)1', /*繁体*/
        'en_GB' : '设置自动点赞时间区间(默认今天~之前所有的动态内容)2', /*英语*/
        'jp_JP' : '设置自动点赞时间区间(默认今天~之前所有的动态内容)3'  /*日语*/
        },

        'class:localTool_4_122' : { /*要翻译的字符串*/
        'auto_detected' : '请选择范围', /*自动检测*/
        'zh_CN' : '请选择范围', /*简体*/
        'zh_TW' : '请选择范围1', /*繁体*/
        'en_GB' : '请选择范围2', /*英语*/
        'jp_JP' : '请选择范围3'  /*日语*/
        },

        'class:localTool_4_123' : { /*要翻译的字符串*/
        'auto_detected' : '点赞进度时间线', /*自动检测*/
        'zh_CN' : '点赞进度时间线', /*简体*/
        'zh_TW' : '点赞进度时间线1', /*繁体*/
        'en_GB' : '点赞进度时间线2', /*英语*/
        'jp_JP' : '点赞进度时间线3'  /*日语*/
        },

        'class:localTool_4_124' : { /*要翻译的字符串*/
        'auto_detected' : '', /*自动检测*/
        'zh_CN' : '', /*简体*/
        'zh_TW' : '1', /*繁体*/
        'en_GB' : '2', /*英语*/
        'jp_JP' : '3'  /*日语*/
        },

        'class:localTool_4_125' : { /*要翻译的字符串*/
        'auto_detected' : '8月18日', /*自动检测*/
        'zh_CN' : '8月18日', /*简体*/
        'zh_TW' : '8月18日1', /*繁体*/
        'en_GB' : '8月18日2', /*英语*/
        'jp_JP' : '8月18日3'  /*日语*/
        },

        'class:localTool_4_126' : { /*要翻译的字符串*/
        'auto_detected' : '已点赞状态x条，点赞发布艺术作品x条，点赞收藏艺术作品x条', /*自动检测*/
        'zh_CN' : '已点赞状态x条，点赞发布艺术作品x条，点赞收藏艺术作品x条', /*简体*/
        'zh_TW' : '已点赞状态x条，点赞发布艺术作品x条，点赞收藏艺术作品x条1', /*繁体*/
        'en_GB' : '已点赞状态x条，点赞发布艺术作品x条，点赞收藏艺术作品x条2', /*英语*/
        'jp_JP' : '已点赞状态x条，点赞发布艺术作品x条，点赞收藏艺术作品x条3'  /*日语*/
        },

        'class:localTool_4_127' : { /*要翻译的字符串*/
        'auto_detected' : '已点赞评测x条，点赞发布创意工坊x条，点赞收藏创意工坊x条', /*自动检测*/
        'zh_CN' : '已点赞评测x条，点赞发布创意工坊x条，点赞收藏创意工坊x条', /*简体*/
        'zh_TW' : '已点赞评测x条，点赞发布创意工坊x条，点赞收藏创意工坊x条1', /*繁体*/
        'en_GB' : '已点赞评测x条，点赞发布创意工坊x条，点赞收藏创意工坊x条2', /*英语*/
        'jp_JP' : '已点赞评测x条，点赞发布创意工坊x条，点赞收藏创意工坊x条3'  /*日语*/
        },

        'class:localTool_4_128' : { /*要翻译的字符串*/
        'auto_detected' : '已点赞购买状态x条，点赞发布指南x条，点赞收藏指南x条', /*自动检测*/
        'zh_CN' : '已点赞购买状态x条，点赞发布指南x条，点赞收藏指南x条', /*简体*/
        'zh_TW' : '已点赞购买状态x条，点赞发布指南x条，点赞收藏指南x条1', /*繁体*/
        'en_GB' : '已点赞购买状态x条，点赞发布指南x条，点赞收藏指南x条2', /*英语*/
        'jp_JP' : '已点赞购买状态x条，点赞发布指南x条，点赞收藏指南x条3'  /*日语*/
        },

        'class:localTool_4_129' : { /*要翻译的字符串*/
        'auto_detected' : '已点赞组通知x条，点赞上次载图x条，点赞收藏载图x条', /*自动检测*/
        'zh_CN' : '已点赞组通知x条，点赞上次载图x条，点赞收藏载图x条', /*简体*/
        'zh_TW' : '已点赞组通知x条，点赞上次载图x条，点赞收藏载图x条1', /*繁体*/
        'en_GB' : '已点赞组通知x条，点赞上次载图x条，点赞收藏载图x条2', /*英语*/
        'jp_JP' : '已点赞组通知x条，点赞上次载图x条，点赞收藏载图x条3'  /*日语*/
        },

        'class:localTool_4_130' : { /*要翻译的字符串*/
        'auto_detected' : '已点赞组活动x条，点赞上传视频x条，点赞收藏视频x条', /*自动检测*/
        'zh_CN' : '已点赞组活动x条，点赞上传视频x条，点赞收藏视频x条', /*简体*/
        'zh_TW' : '已点赞组活动x条，点赞上传视频x条，点赞收藏视频x条1', /*繁体*/
        'en_GB' : '已点赞组活动x条，点赞上传视频x条，点赞收藏视频x条2', /*英语*/
        'jp_JP' : '已点赞组活动x条，点赞上传视频x条，点赞收藏视频x条3'  /*日语*/
        },

        'class:localTool_4_131' : { /*要翻译的字符串*/
        'auto_detected' : '', /*自动检测*/
        'zh_CN' : '', /*简体*/
        'zh_TW' : '1', /*繁体*/
        'en_GB' : '2', /*英语*/
        'jp_JP' : '3'  /*日语*/
        },

        'class:localTool_4_132' : { /*要翻译的字符串*/
        'auto_detected' : '8月16日', /*自动检测*/
        'zh_CN' : '8月16日', /*简体*/
        'zh_TW' : '8月16日1', /*繁体*/
        'en_GB' : '8月16日2', /*英语*/
        'jp_JP' : '8月16日3'  /*日语*/
        },

        'class:localTool_4_133' : { /*要翻译的字符串*/
        },

        'class:localTool_4_134' : { /*要翻译的字符串*/
        'auto_detected' : '《登高》', /*自动检测*/
        'zh_CN' : '《登高》', /*简体*/
        'zh_TW' : '《登高》1', /*繁体*/
        'en_GB' : '《登高》2', /*英语*/
        'jp_JP' : '《登高》3'  /*日语*/
        },

        'class:localTool_4_135' : { /*要翻译的字符串*/
        'auto_detected' : '《茅屋为秋风所破歌》', /*自动检测*/
        'zh_CN' : '《茅屋为秋风所破歌》', /*简体*/
        'zh_TW' : '《茅屋为秋风所破歌》1', /*繁体*/
        'en_GB' : '《茅屋为秋风所破歌》2', /*英语*/
        'jp_JP' : '《茅屋为秋风所破歌》3'  /*日语*/
        },

        'class:localTool_4_136' : { /*要翻译的字符串*/
        'auto_detected' : '', /*自动检测*/
        'zh_CN' : '', /*简体*/
        'zh_TW' : '1', /*繁体*/
        'en_GB' : '2', /*英语*/
        'jp_JP' : '3'  /*日语*/
        },

        'class:localTool_4_137' : { /*要翻译的字符串*/
        'auto_detected' : '8月15日', /*自动检测*/
        'zh_CN' : '8月15日', /*简体*/
        'zh_TW' : '8月15日1', /*繁体*/
        'en_GB' : '8月15日2', /*英语*/
        'jp_JP' : '8月15日3'  /*日语*/
        },

        'class:localTool_4_138' : { /*要翻译的字符串*/
        'auto_detected' : '中国人民抗日战争胜利日', /*自动检测*/
        'zh_CN' : '中国人民抗日战争胜利日', /*简体*/
        'zh_TW' : '中国人民抗日战争胜利日1', /*繁体*/
        'en_GB' : '中国人民抗日战争胜利日2', /*英语*/
        'jp_JP' : '中国人民抗日战争胜利日3'  /*日语*/
        },

        'class:localTool_4_139' : { /*要翻译的字符串*/
        },

        'class:localTool_4_140' : { /*要翻译的字符串*/
        'auto_detected' : '铭记、感恩', /*自动检测*/
        'zh_CN' : '铭记、感恩', /*简体*/
        'zh_TW' : '铭记、感恩1', /*繁体*/
        'en_GB' : '铭记、感恩2', /*英语*/
        'jp_JP' : '铭记、感恩3'  /*日语*/
        },

        'class:localTool_4_141' : { /*要翻译的字符串*/
        'auto_detected' : '所有为中华民族浴血奋战的英雄将士', /*自动检测*/
        'zh_CN' : '所有为中华民族浴血奋战的英雄将士', /*简体*/
        'zh_TW' : '所有为中华民族浴血奋战的英雄将士1', /*繁体*/
        'en_GB' : '所有为中华民族浴血奋战的英雄将士2', /*英语*/
        'jp_JP' : '所有为中华民族浴血奋战的英雄将士3'  /*日语*/
        },

        'class:localTool_4_142' : { /*要翻译的字符串*/
        'auto_detected' : '永垂不朽', /*自动检测*/
        'zh_CN' : '永垂不朽', /*简体*/
        'zh_TW' : '永垂不朽1', /*繁体*/
        'en_GB' : '永垂不朽2', /*英语*/
        'jp_JP' : '永垂不朽3'  /*日语*/
        },

        'class:localTool_4_143' : { /*要翻译的字符串*/
        'auto_detected' : '', /*自动检测*/
        'zh_CN' : '', /*简体*/
        'zh_TW' : '1', /*繁体*/
        'en_GB' : '2', /*英语*/
        'jp_JP' : '3'  /*日语*/
        },

        'class:localTool_4_144' : { /*要翻译的字符串*/
        'auto_detected' : '过去', /*自动检测*/
        'zh_CN' : '过去', /*简体*/
        'zh_TW' : '过去1', /*繁体*/
        'en_GB' : '过去2', /*英语*/
        'jp_JP' : '过去3'  /*日语*/
        },

        'class:localTool_4_145' : { /*要翻译的字符串*/
        'auto_detected' : '喜加一助手', /*自动检测*/
        'zh_CN' : '喜加一助手', /*简体*/
        'zh_TW' : '喜加一助手1', /*繁体*/
        'en_GB' : '喜加一助手2', /*英语*/
        'jp_JP' : '喜加一助手3'  /*日语*/
        },

        'class:localTool_4_146' : { /*要翻译的字符串*/
        'auto_detected' : '总开关', /*自动检测*/
        'zh_CN' : '总开关', /*简体*/
        'zh_TW' : '总开关1', /*繁体*/
        'en_GB' : '总开关2', /*英语*/
        'jp_JP' : '总开关3'  /*日语*/
        },

        'class:localTool_4_147' : { /*要翻译的字符串*/
        'auto_detected' : '设置:', /*自动检测*/
        'zh_CN' : '设置:', /*简体*/
        'zh_TW' : '设置:1', /*繁体*/
        'en_GB' : '设置:2', /*英语*/
        'jp_JP' : '设置:3'  /*日语*/
        },

        'class:localTool_4_148' : { /*要翻译的字符串*/
        'auto_detected' : '设置喜加一数据来源', /*自动检测*/
        'zh_CN' : '设置喜加一数据来源', /*简体*/
        'zh_TW' : '设置喜加一数据来源1', /*繁体*/
        'en_GB' : '设置喜加一数据来源2', /*英语*/
        'jp_JP' : '设置喜加一数据来源3'  /*日语*/
        },

        'class:localTool_4_149' : { /*要翻译的字符串*/
        'auto_detected' : '设置:', /*自动检测*/
        'zh_CN' : '设置:', /*简体*/
        'zh_TW' : '设置:1', /*繁体*/
        'en_GB' : '设置:2', /*英语*/
        'jp_JP' : '设置:3'  /*日语*/
        },

        'class:localTool_4_150' : { /*要翻译的字符串*/
        'auto_detected' : '功能设置', /*自动检测*/
        'zh_CN' : '功能设置', /*简体*/
        'zh_TW' : '功能设置1', /*繁体*/
        'en_GB' : '功能设置2', /*英语*/
        'jp_JP' : '功能设置3'  /*日语*/
        },

        'class:localTool_4_151' : { /*要翻译的字符串*/
        'auto_detected' : 'Debug模式', /*自动检测*/
        'zh_CN' : 'Debug模式', /*简体*/
        'zh_TW' : 'Debug模式1', /*繁体*/
        'en_GB' : 'Debug模式2', /*英语*/
        'jp_JP' : 'Debug模式3'  /*日语*/
        },

        'class:localTool_4_152' : { /*要翻译的字符串*/
        'auto_detected' : '弹出层', /*自动检测*/
        'zh_CN' : '弹出层', /*简体*/
        'zh_TW' : '弹出层1', /*繁体*/
        'en_GB' : '弹出层2', /*英语*/
        'jp_JP' : '弹出层3'  /*日语*/
        },

        'class:localTool_4_153' : { /*要翻译的字符串*/
        'auto_detected' : '滑块', /*自动检测*/
        'zh_CN' : '滑块', /*简体*/
        'zh_TW' : '滑块1', /*繁体*/
        'en_GB' : '滑块2', /*英语*/
        'jp_JP' : '滑块3'  /*日语*/
        },

        'class:localTool_4_154' : { /*要翻译的字符串*/
        'auto_detected' : '导入导出重置当前设置', /*自动检测*/
        'zh_CN' : '导入导出重置当前设置', /*简体*/
        'zh_TW' : '导入导出重置当前设置1', /*繁体*/
        'en_GB' : '导入导出重置当前设置2', /*英语*/
        'jp_JP' : '导入导出重置当前设置3'  /*日语*/
        },

        'class:localTool_4_155' : { /*要翻译的字符串*/
        'auto_detected' : '弹出层', /*自动检测*/
        'zh_CN' : '弹出层', /*简体*/
        'zh_TW' : '弹出层1', /*繁体*/
        'en_GB' : '弹出层2', /*英语*/
        'jp_JP' : '弹出层3'  /*日语*/
        },

        'class:localTool_4_156' : { /*要翻译的字符串*/
        'auto_detected' : '', /*自动检测*/
        'zh_CN' : '', /*简体*/
        'zh_TW' : '1', /*繁体*/
        'en_GB' : '2', /*英语*/
        'jp_JP' : '3'  /*日语*/
        },

        'class:localTool_4_157' : { /*要翻译的字符串*/
        'auto_detected' : '点击上传，或将文件拖拽到此处', /*自动检测*/
        'zh_CN' : '点击上传，或将文件拖拽到此处', /*简体*/
        'zh_TW' : '点击上传，或将文件拖拽到此处1', /*繁体*/
        'en_GB' : '点击上传，或将文件拖拽到此处2', /*英语*/
        'jp_JP' : '点击上传，或将文件拖拽到此处3'  /*日语*/
        },

        'class:localTool_4_158' : { /*要翻译的字符串*/
        'auto_detected' : '界面设置', /*自动检测*/
        'zh_CN' : '界面设置', /*简体*/
        'zh_TW' : '界面设置1', /*繁体*/
        'en_GB' : '界面设置2', /*英语*/
        'jp_JP' : '界面设置3'  /*日语*/
        },

        'class:localTool_4_159' : { /*要翻译的字符串*/
        'auto_detected' : '语言配置', /*自动检测*/
        'zh_CN' : '语言配置', /*简体*/
        'zh_TW' : '语言配置1', /*繁体*/
        'en_GB' : '语言配置2', /*英语*/
        'jp_JP' : '语言配置3'  /*日语*/
        },

        'class:localTool_4_160' : { /*要翻译的字符串*/
        'auto_detected' : '自动检测(简体中文)', /*自动检测*/
        'zh_CN' : '自动检测(简体中文)', /*简体*/
        'zh_TW' : '自动检测(简体中文)1', /*繁体*/
        'en_GB' : '自动检测(简体中文)2', /*英语*/
        'jp_JP' : '自动检测(简体中文)3'  /*日语*/
        },

        'class:localTool_4_161' : { /*要翻译的字符串*/
        'auto_detected' : '简体中文', /*自动检测*/
        'zh_CN' : '简体中文', /*简体*/
        'zh_TW' : '简体中文1', /*繁体*/
        'en_GB' : '简体中文2', /*英语*/
        'jp_JP' : '简体中文3'  /*日语*/
        },

        'class:localTool_4_162' : { /*要翻译的字符串*/
        'auto_detected' : '繁体中文', /*自动检测*/
        'zh_CN' : '繁体中文', /*简体*/
        'zh_TW' : '繁体中文1', /*繁体*/
        'en_GB' : '繁体中文2', /*英语*/
        'jp_JP' : '繁体中文3'  /*日语*/
        },

        'class:localTool_4_163' : { /*要翻译的字符串*/
        'auto_detected' : 'English', /*自动检测*/
        'zh_CN' : 'English', /*简体*/
        'zh_TW' : 'English1', /*繁体*/
        'en_GB' : 'English2', /*英语*/
        'jp_JP' : 'English3'  /*日语*/
        },

        'class:localTool_4_164' : { /*要翻译的字符串*/
        'auto_detected' : '主题切换', /*自动检测*/
        'zh_CN' : '主题切换', /*简体*/
        'zh_TW' : '主题切换1', /*繁体*/
        'en_GB' : '主题切换2', /*英语*/
        'jp_JP' : '主题切换3'  /*日语*/
        },

        'class:localTool_4_165' : { /*要翻译的字符串*/
        'auto_detected' : '请选择一个主题，然后点击应用', /*自动检测*/
        'zh_CN' : '请选择一个主题，然后点击应用', /*简体*/
        'zh_TW' : '请选择一个主题，然后点击应用1', /*繁体*/
        'en_GB' : '请选择一个主题，然后点击应用2', /*英语*/
        'jp_JP' : '请选择一个主题，然后点击应用3'  /*日语*/
        },

        'class:localTool_4_166' : { /*要翻译的字符串*/
        'auto_detected' : '应用主题', /*自动检测*/
        'zh_CN' : '应用主题', /*简体*/
        'zh_TW' : '应用主题1', /*繁体*/
        'en_GB' : '应用主题2', /*英语*/
        'jp_JP' : '应用主题3'  /*日语*/
        },

        'class:localTool_4_167' : { /*要翻译的字符串*/
        'auto_detected' : 'UI设置', /*自动检测*/
        'zh_CN' : 'UI设置', /*简体*/
        'zh_TW' : 'UI设置1', /*繁体*/
        'en_GB' : 'UI设置2', /*英语*/
        'jp_JP' : 'UI设置3'  /*日语*/
        },

        'class:localTool_4_168' : { /*要翻译的字符串*/
        'auto_detected' : '预览:', /*自动检测*/
        'zh_CN' : '预览:', /*简体*/
        'zh_TW' : '预览:1', /*繁体*/
        'en_GB' : '预览:2', /*英语*/
        'jp_JP' : '预览:3'  /*日语*/
        },

        'class:localTool_4_169' : { /*要翻译的字符串*/
        'auto_detected' : '主要字体颜色:', /*自动检测*/
        'zh_CN' : '主要字体颜色:', /*简体*/
        'zh_TW' : '主要字体颜色:1', /*繁体*/
        'en_GB' : '主要字体颜色:2', /*英语*/
        'jp_JP' : '主要字体颜色:3'  /*日语*/
        },

        'class:localTool_4_170' : { /*要翻译的字符串*/
        'auto_detected' : '主要背景颜色:', /*自动检测*/
        'zh_CN' : '主要背景颜色:', /*简体*/
        'zh_TW' : '主要背景颜色:1', /*繁体*/
        'en_GB' : '主要背景颜色:2', /*英语*/
        'jp_JP' : '主要背景颜色:3'  /*日语*/
        },

        'class:localTool_4_171' : { /*要翻译的字符串*/
        'auto_detected' : '留言成功字体颜色:', /*自动检测*/
        'zh_CN' : '留言成功字体颜色:', /*简体*/
        'zh_TW' : '留言成功字体颜色:1', /*繁体*/
        'en_GB' : '留言成功字体颜色:2', /*英语*/
        'jp_JP' : '留言成功字体颜色:3'  /*日语*/
        },

        'class:localTool_4_172' : { /*要翻译的字符串*/
        'auto_detected' : '留言失败字体颜色:', /*自动检测*/
        'zh_CN' : '留言失败字体颜色:', /*简体*/
        'zh_TW' : '留言失败字体颜色:1', /*繁体*/
        'en_GB' : '留言失败字体颜色:2', /*英语*/
        'jp_JP' : '留言失败字体颜色:3'  /*日语*/
        },

        'class:localTool_4_173' : { /*要翻译的字符串*/
        'auto_detected' : '留言发生错误字体颜色:', /*自动检测*/
        'zh_CN' : '留言发生错误字体颜色:', /*简体*/
        'zh_TW' : '留言发生错误字体颜色:1', /*繁体*/
        'en_GB' : '留言发生错误字体颜色:2', /*英语*/
        'jp_JP' : '留言发生错误字体颜色:3'  /*日语*/
        },

        'class:localTool_4_174' : { /*要翻译的字符串*/
        'auto_detected' : '保存为主题', /*自动检测*/
        'zh_CN' : '保存为主题', /*简体*/
        'zh_TW' : '保存为主题1', /*繁体*/
        'en_GB' : '保存为主题2', /*英语*/
        'jp_JP' : '保存为主题3'  /*日语*/
        },

        'class:localTool_4_175' : { /*要翻译的字符串*/
        'auto_detected' : '关于SteamAssistant(Steam小助手)', /*自动检测*/
        'zh_CN' : '关于SteamAssistant(Steam小助手)', /*简体*/
        'zh_TW' : '关于SteamAssistant(Steam小助手)1', /*繁体*/
        'en_GB' : '关于SteamAssistant(Steam小助手)2', /*英语*/
        'jp_JP' : '关于SteamAssistant(Steam小助手)3'  /*日语*/
        },

        'class:localTool_4_176' : { /*要翻译的字符串*/
        'auto_detected' : '程序信息:', /*自动检测*/
        'zh_CN' : '程序信息:', /*简体*/
        'zh_TW' : '程序信息:1', /*繁体*/
        'en_GB' : '程序信息:2', /*英语*/
        'jp_JP' : '程序信息:3'  /*日语*/
        },

        'class:localTool_4_177' : { /*要翻译的字符串*/
        'auto_detected' : '当前版本:v0.2.3.0', /*自动检测*/
        'zh_CN' : '当前版本:v0.2.3.0', /*简体*/
        'zh_TW' : '当前版本:v0.2.3.01', /*繁体*/
        'en_GB' : '当前版本:v0.2.3.02', /*英语*/
        'jp_JP' : '当前版本:v0.2.3.03'  /*日语*/
        },

        'class:localTool_4_178' : { /*要翻译的字符串*/
        'auto_detected' : '主程序框架更新时间:2020年4月19日', /*自动检测*/
        'zh_CN' : '主程序框架更新时间:2020年4月19日', /*简体*/
        'zh_TW' : '主程序框架更新时间:2020年4月19日1', /*繁体*/
        'en_GB' : '主程序框架更新时间:2020年4月19日2', /*英语*/
        'jp_JP' : '主程序框架更新时间:2020年4月19日3'  /*日语*/
        },

        'class:localTool_4_179' : { /*要翻译的字符串*/
        'auto_detected' : 'common模块:2020年4月19日', /*自动检测*/
        'zh_CN' : 'common模块:2020年4月19日', /*简体*/
        'zh_TW' : 'common模块:2020年4月19日1', /*繁体*/
        'en_GB' : 'common模块:2020年4月19日2', /*英语*/
        'jp_JP' : 'common模块:2020年4月19日3'  /*日语*/
        },

        'class:localTool_4_180' : { /*要翻译的字符串*/
        'auto_detected' : 'databaseConf模块:2020年4月19日', /*自动检测*/
        'zh_CN' : 'databaseConf模块:2020年4月19日', /*简体*/
        'zh_TW' : 'databaseConf模块:2020年4月19日1', /*繁体*/
        'en_GB' : 'databaseConf模块:2020年4月19日2', /*英语*/
        'jp_JP' : 'databaseConf模块:2020年4月19日3'  /*日语*/
        },

        'class:localTool_4_181' : { /*要翻译的字符串*/
        'auto_detected' : 'externalApis模块:2020年4月19日', /*自动检测*/
        'zh_CN' : 'externalApis模块:2020年4月19日', /*简体*/
        'zh_TW' : 'externalApis模块:2020年4月19日1', /*繁体*/
        'en_GB' : 'externalApis模块:2020年4月19日2', /*英语*/
        'jp_JP' : 'externalApis模块:2020年4月19日3'  /*日语*/
        },

        'class:localTool_4_182' : { /*要翻译的字符串*/
        'auto_detected' : 'steamApis模块:2020年4月19日', /*自动检测*/
        'zh_CN' : 'steamApis模块:2020年4月19日', /*简体*/
        'zh_TW' : 'steamApis模块:2020年4月19日1', /*繁体*/
        'en_GB' : 'steamApis模块:2020年4月19日2', /*英语*/
        'jp_JP' : 'steamApis模块:2020年4月19日3'  /*日语*/
        },

        'class:localTool_4_183' : { /*要翻译的字符串*/
        'auto_detected' : 'translateApis模块:2020年4月19日', /*自动检测*/
        'zh_CN' : 'translateApis模块:2020年4月19日', /*简体*/
        'zh_TW' : 'translateApis模块:2020年4月19日1', /*繁体*/
        'en_GB' : 'translateApis模块:2020年4月19日2', /*英语*/
        'jp_JP' : 'translateApis模块:2020年4月19日3'  /*日语*/
        },

        'class:localTool_4_184' : { /*要翻译的字符串*/
        'auto_detected' : 'Utility模块:2020年4月19日', /*自动检测*/
        'zh_CN' : 'Utility模块:2020年4月19日', /*简体*/
        'zh_TW' : 'Utility模块:2020年4月19日1', /*繁体*/
        'en_GB' : 'Utility模块:2020年4月19日2', /*英语*/
        'jp_JP' : 'Utility模块:2020年4月19日3'  /*日语*/
        },

        'class:localTool_4_185' : { /*要翻译的字符串*/
        'auto_detected' : 'UI模块:2020年4月19日', /*自动检测*/
        'zh_CN' : 'UI模块:2020年4月19日', /*简体*/
        'zh_TW' : 'UI模块:2020年4月19日1', /*繁体*/
        'en_GB' : 'UI模块:2020年4月19日2', /*英语*/
        'jp_JP' : 'UI模块:2020年4月19日3'  /*日语*/
        },

        'class:localTool_4_186' : { /*要翻译的字符串*/
        'auto_detected' : 'Event模块:2020年4月19日', /*自动检测*/
        'zh_CN' : 'Event模块:2020年4月19日', /*简体*/
        'zh_TW' : 'Event模块:2020年4月19日1', /*繁体*/
        'en_GB' : 'Event模块:2020年4月19日2', /*英语*/
        'jp_JP' : 'Event模块:2020年4月19日3'  /*日语*/
        },

        'class:localTool_4_187' : { /*要翻译的字符串*/
        'auto_detected' : 'CityList模块:2020年4月19日', /*自动检测*/
        'zh_CN' : 'CityList模块:2020年4月19日', /*简体*/
        'zh_TW' : 'CityList模块:2020年4月19日1', /*繁体*/
        'en_GB' : 'CityList模块:2020年4月19日2', /*英语*/
        'jp_JP' : 'CityList模块:2020年4月19日3'  /*日语*/
        },

        'class:localTool_4_188' : { /*要翻译的字符串*/
        'auto_detected' : '联系作者:', /*自动检测*/
        'zh_CN' : '联系作者:', /*简体*/
        'zh_TW' : '联系作者:1', /*繁体*/
        'en_GB' : '联系作者:2', /*英语*/
        'jp_JP' : '联系作者:3'  /*日语*/
        },

        'class:localTool_4_189' : { /*要翻译的字符串*/
        'auto_detected' : '反馈错误', /*自动检测*/
        'zh_CN' : '反馈错误', /*简体*/
        'zh_TW' : '反馈错误1', /*繁体*/
        'en_GB' : '反馈错误2', /*英语*/
        'jp_JP' : '反馈错误3'  /*日语*/
        },


}
};

var languagesList_mainUI_template = {
'defaultLanguage' : 'zh_CN', /* (optional) although must be defined if you don't want en_GB */
'showFlag': true,            /* (optional) show/hide the flag ��ʾ/�������� */
'showCountry': true,         /* (optional) show/hide the country name ��ʾ/���ع������� */
'showLanguage': true,        /* (optional) show/hide the country language ��ʾ/���ع������� */
'languages' : {              /* (optional) define **ADDITIONAL** custom languages ����**�����**�Զ������� */
    'italian' : {
        'country': 'Italy',
        'language' : 'Italian',
        'countryTranslated': 'Italia',
        'languageTranslated': 'Italiano',
        'flag' : {
            'url' : 'http://upload.wikimedia.org/wikipedia/commons/f/fb/Farm-Fresh_italy.png', /* url of flag image ��־ͼ��url */
            'class' : 'italian-flag' /* (optional) class to assign to the flag (e.g., for css styling) �����������־(���磬����css��ʽ) */
        }
    },
    'barletta-dialect' : {
        'country': 'Barletta',
        'language' : 'Barlettano',
        'countryTranslated': 'Barlett',
        'languageTranslated': "Barlett'n",
        'flag': {
            'url' : 'http://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_Barletta.png'
        }
    }
},
/* 
 * Translate your strings below ����������ַ���
 */
'strings' : {

}
};

var languagesList_winBaseFrame = {
'defaultLanguage' : 'zh_CN', /* (optional) although must be defined if you don't want en_GB */
'showFlag': true,            /* (optional) show/hide the flag ��ʾ/�������� */
'showCountry': true,         /* (optional) show/hide the country name ��ʾ/���ع������� */
'showLanguage': true,        /* (optional) show/hide the country language ��ʾ/���ع������� */
'languages' : {              /* (optional) define **ADDITIONAL** custom languages ����**�����**�Զ������� */
    'italian' : {
        'country': 'Italy',
        'language' : 'Italian',
        'countryTranslated': 'Italia',
        'languageTranslated': 'Italiano',
        'flag' : {
            'url' : 'http://upload.wikimedia.org/wikipedia/commons/f/fb/Farm-Fresh_italy.png', /* url of flag image ��־ͼ��url */
            'class' : 'italian-flag' /* (optional) class to assign to the flag (e.g., for css styling) �����������־(���磬����css��ʽ) */
        }
    },
    'barletta-dialect' : {
        'country': 'Barletta',
        'language' : 'Barlettano',
        'countryTranslated': 'Barlett',
        'languageTranslated': "Barlett'n",
        'flag': {
            'url' : 'http://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_Barletta.png'
        }
    }
},
/* 
 * Translate your strings below ����������ַ���
 */
'strings' : {

}
};

/**
 * uiStyle.js
 */

/**
 * steamNetData.js
 * @file 存储利用网络请求来获取steam相关数据的代码 [steam网络数据]
 */

function getBaseInfo(rank){
        var info3 = {
                language: "",
                name: "",
                url: "",
                steamID64: "",
                steamCustomUrl: "",
                accountId: "",
                confInfoObj: null,
                userInfoObj: null
        };
        
        var info2 = {
                language: "",
                name: "",
                url: "",
                steamID64: "",
                steamCustomUrl: "",
                accountId: "",
        };
        
        var info1 = {
                language: "",
                name: "",
                url: "",
                steamID64: "",
                accountId: "",
        };
        
        switch (rank){
                case 0:
                
                        if(typeof g_steamID != "undefined" && typeof g_steamID == "string" && g_steamID.test(g_steamId64RegExp))
                                return g_steamID;
                        else
                        {
                                var obj = document.getElementById('webui_config');
                                if(obj){
                                        userInfoStr = obj.getAttribute('data-userinfo');
                                        userInfoObj = JSON.parse(userInfoStr);
                                        var userInfoObj;
                                        return userInfoObj.steamid;
                                }
                        }
                        break;
                case 1:
                        
                        break;
                case 2:
                        
                        break;
                case 3:
                        
                        break;
                default:
                        break;
        }
        
        // if(g_rgProfileData && typeof g_rgProfileData == "object"){
        //      info.name = g_rgProfileData.personaname;
        //      info.url = g_rgProfileData.url;
        //      info.steamID64 = g_rgProfileData.steamid;
        // }
        // //https://steamcommunity.com/profiles/76561198373290430/edit
        // //<input class="dynInput" type="text" name="customURL" id="customURL" value="miku-39">
        
        // if(g_steamID && typeof g_steamID == "string" && g_steamID.test(g_steamId64RegExp))
        //      info.steamID64 = g_steamID;
        // else
        // {
        //      var obj = document.getElementById('webui_config');
        //      var confInfoStr,userInfoStr;
        //      var confInfoObj,userInfoObj;
        //      if(obj){
        //              confInfoStr = obj.getAttribute('data-config');
        //              userInfoStr = obj.getAttribute('data-userinfo');
        //              confInfoObj = JSON.parse(confInfoStr);
        //              userInfoObj = JSON.parse(userInfoStr);
        //              info.confInfoObj = confInfoObj;
        //              info.userInfoObj = userInfoObj;
        //              info.steamID64 = userInfoObj.steamid
        //              info.steamCustomUrl = "";
        //              info.accountId = userInfoObj.accountid;
        //              info.language = confInfoObj.language;
        //      }
                
        // }
        
        
}

/**
 * http://www.openjs.com/scripts/events/keyboard_shortcuts/
 * Version : 2.01.B
 * By Binny V A
 * License : BSD
 */
shortcut = {
        'all_shortcuts':{},//All the shortcuts are stored in this array
        'add': function(shortcut_combination,callback,opt) {
                //Provide a set of default options
                var default_options = {
                        'type':'keydown',
                        'disable_in_input':false,
                        'target':document,
                        'keycode':false
                }
                if(!opt) opt = default_options;
                else {
                        for(var dfo in default_options) {
                                if(typeof opt[dfo] == 'undefined') opt[dfo] = default_options[dfo];
                        }
                }

                var ele = opt.target;
                if(typeof opt.target == 'string') ele = document.getElementById(opt.target);
                var ths = this;
                shortcut_combination = shortcut_combination.toLowerCase();

                //The function to be called at keypress
                var func = function(e) {
                        e = e || window.event;
                        
                        if(opt['disable_in_input']) { //Don't enable shortcut keys in Input, Textarea fields
                                var element;
                                if(e.target) element=e.target;
                                else if(e.srcElement) element=e.srcElement;
                                if(element.nodeType==3) element=element.parentNode;

                                if(element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') return;
                        }
        
                        //Find Which key is pressed
                        if (e.keyCode) code = e.keyCode;
                        else if (e.which) code = e.which;
                        var character = String.fromCharCode(code).toLowerCase();
                        
                        if(code == 188) character=","; //If the user presses , when the type is onkeydown
                        if(code == 190) character="."; //If the user presses , when the type is onkeydown

                        var keys = shortcut_combination.split("+");
                        //Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
                        var kp = 0;
                        
                        //Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
                        var shift_nums = {
                                "`":"~",
                                "1":"!",
                                "2":"@",
                                "3":"#",
                                "4":"$",
                                "5":"%",
                                "6":"^",
                                "7":"&",
                                "8":"*",
                                "9":"(",
                                "0":")",
                                "-":"_",
                                "=":"+",
                                ";":":",
                                "'":"\"",
                                ",":"<",
                                ".":">",
                                "/":"?",
                                "\\":"|"
                        }
                        //Special Keys - and their codes
                        var special_keys = {
                                'esc':27,
                                'escape':27,
                                'tab':9,
                                'space':32,
                                'return':13,
                                'enter':13,
                                'backspace':8,
        
                                'scrolllock':145,
                                'scroll_lock':145,
                                'scroll':145,
                                'capslock':20,
                                'caps_lock':20,
                                'caps':20,
                                'numlock':144,
                                'num_lock':144,
                                'num':144,
                                
                                'pause':19,
                                'break':19,
                                
                                'insert':45,
                                'home':36,
                                'delete':46,
                                'end':35,
                                
                                'pageup':33,
                                'page_up':33,
                                'pu':33,
        
                                'pagedown':34,
                                'page_down':34,
                                'pd':34,
        
                                'left':37,
                                'up':38,
                                'right':39,
                                'down':40,
        
                                'f1':112,
                                'f2':113,
                                'f3':114,
                                'f4':115,
                                'f5':116,
                                'f6':117,
                                'f7':118,
                                'f8':119,
                                'f9':120,
                                'f10':121,
                                'f11':122,
                                'f12':123,
                        }
                        
                        var modifiers = { 
                                shift: { wanted:false, pressed:false},
                                ctrl : { wanted:false, pressed:false},
                                alt  : { wanted:false, pressed:false},
                                meta : { wanted:false, pressed:false}   //Meta is Mac specific
                        };
                        
                        if(e.ctrlKey)   modifiers.ctrl.pressed = true;
                        if(e.shiftKey)  modifiers.shift.pressed = true;
                        if(e.altKey)    modifiers.alt.pressed = true;
                        if(e.metaKey)   modifiers.meta.pressed = true;
                        
                        for(var i=0; k=keys[i],i<keys.length; i++) {
                                //Modifiers
                                if(k == 'ctrl' || k == 'control') {
                                        kp++;
                                        modifiers.ctrl.wanted = true;

                                } else if(k == 'shift') {
                                        kp++;
                                        modifiers.shift.wanted = true;

                                } else if(k == 'alt') {
                                        kp++;
                                        modifiers.alt.wanted = true;
                                } else if(k == 'meta') {
                                        kp++;
                                        modifiers.meta.wanted = true;
                                } else if(k.length > 1) { //If it is a special key
                                        if(special_keys[k] == code) kp++;
                                        
                                } else if(opt['keycode']) {
                                        if(opt['keycode'] == code) kp++;

                                } else { //The special keys did not match
                                        if(character == k) kp++;
                                        else {
                                                if(shift_nums[character] && e.shiftKey) { //Stupid Shift key bug created by using lowercase
                                                        character = shift_nums[character]; 
                                                        if(character == k) kp++;
                                                }
                                        }
                                }
                        }
                        
                        if(kp == keys.length && 
                                                modifiers.ctrl.pressed == modifiers.ctrl.wanted &&
                                                modifiers.shift.pressed == modifiers.shift.wanted &&
                                                modifiers.alt.pressed == modifiers.alt.wanted &&
                                                modifiers.meta.pressed == modifiers.meta.wanted) {
                                callback(e);
        
                                if(!opt['propagate']) { //Stop the event
                                        //e.cancelBubble is supported by IE - this will kill the bubbling process.
                                        e.cancelBubble = true;
                                        e.returnValue = false;
        
                                        //e.stopPropagation works in Firefox.
                                        if (e.stopPropagation) {
                                                e.stopPropagation();
                                                e.preventDefault();
                                        }
                                        return false;
                                }
                        }
                }
                this.all_shortcuts[shortcut_combination] = {
                        'callback':func, 
                        'target':ele, 
                        'event': opt['type']
                };
                //Attach the function with the event
                if(ele.addEventListener) ele.addEventListener(opt['type'], func, false);
                else if(ele.attachEvent) ele.attachEvent('on'+opt['type'], func);
                else ele['on'+opt['type']] = func;
        },

        //Remove the shortcut - just specify the shortcut and I will remove the binding
        'remove':function(shortcut_combination) {
                shortcut_combination = shortcut_combination.toLowerCase();
                var binding = this.all_shortcuts[shortcut_combination];
                delete(this.all_shortcuts[shortcut_combination])
                if(!binding) return;
                var type = binding['event'];
                var ele = binding['target'];
                var callback = binding['callback'];

                if(ele.detachEvent) ele.detachEvent('on'+type, callback);
                else if(ele.removeEventListener) ele.removeEventListener(type, callback, false);
                else ele['on'+type] = false;
        }
}

/**
 * websocket.js
 */

// //https://blog.csdn.net/CaptainJava/article/details/102853088
class Socket {
        constructor(arg) {
                this.webSocketObj = null;
                this.fRecvCallBack = null;
        }
        /**
         * @param {String} url 目标通讯url
         * @param {Function} recvCallBack 接收到数据后的回调函数(处理函数)
         * @return {Boolean} true: webSocket初始化成功，false: webSocket初始化失败
         */
        init(url,recvCallBack){
                var URL;
                if(url){
                        URL = url;
                }
                else{
                        URL = "ws://" + window.location.host + "/websocket/message";
                }
                
                if(recvCallBack){
                        this.fRecvCallBack = recvCallBack;
                }
                
                
                //判断当前浏览器是否支持WebSocket
                if ('WebSocket' in window) {
                        this.webSocketObj = new WebSocket(URL);
                } else {
                        alert('Dont support websocket!');
                        return false;
                }
                
                //连接发生错误的回调方法
                this.webSocketObj.onerror = function () {
                        console.log("webSocket error!");
                };
                
                //连接成功建立的回调方法
                this.webSocketObj.onopen = function () {
                        console.log("webSocket connected.");
                };
                
                //接收到消息的回调方法
                this.webSocketObj.onmessage = function (event) {
                        console.log("webSocket收到数据!");
                        
                        if(this.fRecvCallBack){
                                 this.fRecvCallBack();
                        }
                };
                
                //连接关闭的回调方法
                this.webSocketObj.onclose = function () {
                        console.log("webSocket close");
                };
                
                window.addEventListener("beforeunload", function(event) {
                        this.webSocketObj.close();
                });
                return true;
        }
        
        //关闭连接
        close() {
                return this.webSocketObj.close();
        }
        
        //发送消息
        send(message) {
                return this.webSocketObj.send(message);
        }
}

function recvHander(){
        var obj = JSON.parse(event.data);
        if(obj && "message" == obj.type){
                console.log(obj.data);
                // table.reload('test', {
                //      elem: '#test'
                //      ,data: JSON.parse(obj.data)
                // });
        }
}

function test_websocket(){
        var socket = new Socket();
        socket.init("",recvHander);
        socket.send("Hello!");
        socket.close();
}
/**
 * translateApis.js
 */


//-------------------------------------------------------------------------------------------------------------
// 翻译API
/*-------------------------------------------------*/
var b = function(a, b) {
        for (var d = 0; d < b.length - 2; d += 3) {
                var c = b.charAt(d + 2),
                        c = "a" <= c ? c.charCodeAt(0) - 87 : Number(c),
                        c = "+" == b.charAt(d + 1) ? a >>> c : a << c;
                a = "+" == b.charAt(d) ? a + c & 4294967295 : a ^ c
        }
        return a
}
var tk = function(a, TKK) {
        for (var e = TKK.split("."), h = Number(e[0]) || 0, g = [], d = 0, f = 0; f < a.length; f++) {
                var c = a.charCodeAt(f);
                128 > c ? g[d++] = c : (2048 > c ? g[d++] = c >> 6 | 192 : (55296 == (c & 64512) && f + 1 < a.length && 56320 == (a.charCodeAt(
                        f + 1) & 64512) ? (c = 65536 + ((c & 1023) << 10) + (a.charCodeAt(++f) & 1023), g[d++] = c >> 18 | 240, g[d++] =
                        c >> 12 & 63 | 128) : g[d++] = c >> 12 | 224, g[d++] = c >> 6 & 63 | 128), g[d++] = c & 63 | 128)
        }
        a = h;
        for (d = 0; d < g.length; d++) a += g[d], a = b(a, "+-a^+6");
        a = b(a, "+-3^+b+-f");
        a ^= Number(e[1]) || 0;
        0 > a && (a = (a & 2147483647) + 2147483648);
        a %= 1E6;
        return a.toString() + "." + (a ^ h)
}
/*-------------------------------------------------*/
var auto = "auto"; //自动检测
var zhc = "zh-CN"; //中文简体
var zht = "zh-TW"; //中文繁体
var en = "en"; //英语
var jp = "ja"; //日语

var waitStatus = true; //等待状态
var waitStatus_cn = true; //等待状态
var returnData;
var returnData_cn;
async function GoogleTranslateRequest(origLanguage, newLanguage, strText) {
        waitStatus = true;

        var _tkk = "439786.2762026697";
        var _tk = tk(strText, _tkk);
        //console.log("_tk:",_tk);

        //https://translate.google.cn/#view=home&op=translate&sl=auto&tl=zh-CN&text=12312
        //https://translate.google.com.hk/?hl=zh-CN&tab=TT#view=home&op=translate&sl=auto&tl=zh-CN&text=123123
        //https://translate.google.com/?hl=zh-CN#view=home&op=translate&sl=auto&tl=zh-CN&text=111
        //https://translate.google.com.tw/#view=home&op=translate&sl=auto&tl=ja&text=%E4%BD%A0%E5%A5%BD
        //谷歌翻译app抓包
        //第三方getpost请求代发送
        //https://translate.google.cn/translate_a/single?client=t

        //需要拼接的url序列
        var baseURL = "https://translate.google.cn/translate_a/single?";
        var baseURL1 = "https://translate.google.com/translate_a/single?";
        var client = "client=" + "webapp";
        var sl = "&sl=" + origLanguage; //待翻译的原始语言      //默认为auto,即自动检测语言
        var tl = "&tl=" + newLanguage; //需要翻译成什么语言    //默认为zh-CN,即默认翻译为中文
        var hl = "&hl=" + zhc;
        var dt1 = "&dt=at&";
        var dt2 = "dt=bd&";
        var dt3 = "dt=ex&";
        var dt4 = "dt=ld&";
        var dt5 = "dt=md&";
        var dt6 = "dt=qca&";
        var dt7 = "dt=rw&";
        var dt8 = "dt=rm&";
        var dt9 = "dt=ss&";
        var dt0 = "dt=t&";
        var dt = "dt=gt&"; //del
        var otf = "otf=2&"; //1
        var ssel = "ssel=0&";
        var tsel = "tsel=4&"; //0
        var xid = "xid=1782844&";
        var kc = "kc=1&"; //8 //2
        var Tk = "tk=" + _tk;
        var q = "&q=" + encodeURI(strText);

        var requestURL = baseURL + client + sl + tl + hl + dt1 + dt2 + dt3 + dt4 + dt5 + dt6 + dt7 + dt8 + dt9 + dt0 + dt +
                otf +
                ssel + tsel + xid + kc + Tk + q;

        //console.log("requestURL: ",requestURL);

        GM_xmlhttpRequest({
                method: 'GET',
                url: requestURL,
                headers: {
                        'User-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36',
                        //'Accept': 'application/atom+xml,application/xml,text/xml',
                        //"Content-Type": "application/x-www-form-urlencoded",
                },
                onload: function(response) {
                        if (response.status === 200) {
                                console.log('请求成功!');
                                var JSON_jsObj = JSON_processing_parsing_JsObj(response.responseText);
                                //遍历[0][0]数组就可以取得翻译后的文本,原始数据,原始数据的拼音
                                //[2]是检查出的语言
                                //遍历[5]可以取得两种翻译,原始数据和原始数据的长度
                                //遍历[8]可以得到原始语言和翻译语言
                                //for (var i = 0; i < JSON_jsObj.length; i++) {
                                //      for (var j = 0; j < JSON_jsObj[i].length; j++) {
                                //              for (var k = 0; k < JSON_jsObj[i][j].length; k++) {
                                //                      
                                //              }
                                //      }
                                //}
                                var retData = "";
                                for (var j = 0; j < JSON_jsObj[0].length; j++) {
                                        if (JSON_jsObj[0][j][0] != null) {
                                                retData += JSON_jsObj[0][j][0]; //组合每一句翻译
                                        }
                                }
                                returnData = retData; //存储数据
                                //console.log('谷歌翻译:',retData);
                                waitStatus = false; //不等待

                                //console.log(response);
                                //console.log(response.responseText);
                                //if(response.responseText.indexOf('[[["') == 0) //是否是指定的数据格式
                                //{
                                //      var retData = response.responseText.slice(4,response.responseText.indexOf('","',4)); //提取翻译后的文本
                                //      returnData = retData; //存储数据
                                //      //console.log('谷歌翻译:',retData);
                                //      waitStatus = false; //不等待
                                //}
                        } else {
                                console.log('请求失败!');
                                //console.log(response);
                                //console.log(response.responseText);
                        }
                },
                onerror: function(err) {
                        console.log('请求错误!', err);
                }
        });

        while (waitStatus) //强制等待异步函数执行完毕后再执行
        {
                console.log("wait...");
                await sleep(100); //延迟0.1秒
        }
        return returnData;
        // jQuery.ajax({
        //      url: URL,
        //      type: "GET",
        //      dataType: "jsonp", //指定服务器返回的数据类型
        //      jsonp: "callback", //Jquery生成验证参数的名称
        //      processData: false,
        //      success: function (data) {
        //              //var result = JSON.stringify(data); //json对象转成字符串
        //              console.log("GET成功!",data);
        //      },
        //      error: function(XMLHttpRequest, textStatus, errorThrown) {
        //      alert(XMLHttpRequest.status);
        //      alert(XMLHttpRequest.readyState);
        //      alert(textStatus);
        //      }
        // });



        // jQuery.get(URL,function(response,status,xhr){
        //      if (response.success === false) {

        //              console.log("GET失败了!",response);
        //      } else {

        //              console.log("GET成功!",response);
        //      }
        // },"json");


        // jQuery.post(URL, {
        //      comment: newMgs,
        //      count: 6,
        //      sessionid: g_sessionID
        // }, function(response) {
        //      if (response.success === false) {
        //              console.log("留言失败了!");
        //      } else {
        //              console.log("成功发表评论于");
        //      }
        // }).fail(function() {
        //      console.log("无法发表评论于");
        // }).always(function() {
        //      console.log("当前处理了 " + (i + 1) + "个, 总计 " + total + " 个好友.");
        // });
}



async function CNTranslateRequest(newLanguage, strText) { //简体转各类繁体，各类繁体转简体
        waitStatus_cn = true;

        var baseURL = "https://brushes8.com/zhong-wen-jian-ti-fan-ti-zhuan-huan";

        GM_xmlhttpRequest({
                method: 'POST',
                url: baseURL,
                data: "data=" + encodeURI(strText) +
                        "&dochineseconversion=" + "1" +
                        "&variant=" + newLanguage +
                        "&submit=" + encodeURI("开始转换 (Ctrl + Enter)"),
                headers: {
                        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                        "Content-Type": "application/x-www-form-urlencoded", //非常重要
                        "User-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36",
                },
                onload: function(response) {
                        if (response.status === 200) {
                                console.log('请求成功!');
                                var findStr = '<label for="response">转换结果: </label><br /><textarea id="response" rows="15" cols="150">';
                                var retData = response.responseText.slice(response.responseText.lastIndexOf(findStr) + findStr.length);
                                returnData_cn = retData; //存储数据
                                //console.log('谷歌翻译:',retData);
                                waitStatus_cn = false; //不等待
                        } else {
                                console.log('请求失败!', response);
                                //console.log(response);
                                //console.log(response.responseText);
                        }
                },
                onerror: function(err) {
                        console.log('请求错误!', err);
                }
        });

        while (waitStatus_cn) //强制等待异步函数执行完毕后再执行
        {
                console.log("wait...");
                await sleep(100); //延迟0.1秒
        }
        return returnData_cn;
}


//---------------------------------
// DEEP翻译API
//---------------------------------

var default_request_pack = { //默认请求包
        "jsonrpc": "2.0",
        "method": "LMT_handle_jobs", //方法
        "params": { //参数
                "jobs": [ //工作
                        {
                                "kind": "default", //种类
                                "raw_en_sentence": "你好世界", //原始句子
                                "raw_en_context_before": [],  //之前的原始环境(上下文)
                                "raw_en_context_after": [],   //之后的原始环境(上下文)
                                "preferred_num_beams": 4, //首选数字
                                "quality": "fast", //质量
                        },
                ],
                "lang": { //语言
                        "user_preferred_langs": ["EN", "ZH"], //用户首选语言
                        "source_lang_user_selected": "auto", //源语言(用户选择)
                        "target_lang": "EN", //目标语言
                },
                "priority": -1, //优先级
                "commonJobParams": {}, //常见的工作参数
                "timestamp": 1591090077383, //时间戳
        },
        "id": 92910013,
};

var default_split_pack = { //默认分解包(句子拆分再请求)
        "jsonrpc": "2.0",
        "method": "LMT_split_into_sentences", //方法
        "params": { //参数
                "lang": { //语言
                        "lang_user_selected": "auto",        //用户选择语言
                        "user_preferred_langs": ["EN", "ZH"] //用户首选语言
                }
        },
        "id": 92910016
};

var default_split_request_pack = { //默认分解请求包
        "jsonrpc": "2.0",
        "method": "LMT_handle_jobs", //方法
        "params": { //参数
                "jobs": [ //工作
                                        {
                                                "kind": "default", //种类
                                                "raw_en_sentence": "没有人富有得可以不要别人的帮助，也没有人穷得不能在某方面给他人帮助。", //原始句子
                                                "raw_en_context_before": [],                                                       //之前的原始环境(上下文)
                                                "raw_en_context_after": ["凡真心尝试助人者，没有不帮到自己的。"],                      //之后的原始环境(上下文)
                                                "preferred_num_beams": 1 //首选数字
                                        }, 
                                        {
                                        "kind": "default", //种类
                                        "raw_en_sentence": "凡真心尝试助人者，没有不帮到自己的。",                                     //原始句子
                                        "raw_en_context_before": ["没有人富有得可以不要别人的帮助，也没有人穷得不能在某方面给他人帮助。"], //之前的原始环境(上下文)
                                        "raw_en_context_after": [],                                                                //之后的原始环境(上下文)
                                        "preferred_num_beams": 1 //首选数字
                                        },
                                ],
                "lang": { //语言
                        "user_preferred_langs": ["EN", "ZH"], //用户首选语言
                        "source_lang_computed": "ZH", //源语言(计算后的)
                        "target_lang": "EN" //目标语言
                },
                "priority": 1, //优先级
                "commonJobParams": {}, //常见的工作参数
                "timestamp": 1591091506769 //时间戳
        },
        "id": 92910017
};

var default_verification_pack = { //默认验证包
        "jsonrpc": "2.0",
        "method": "getClientState", //方法
        "params": { //参数
                "v": "20180814", //版本
                "clientVars": { //客户端值
                        "userCountry": "CN", //用户国家
                        "showAppPopup": true, //显示应用程序弹出
                        "uid": "a3eb6359-c34e-4f9f-b39d-f7dc71187afc", //用户唯一标识符
                        "testGroupId": 6243, //测试组Id
                        "testGroupIdIsNew": true, //测试组Id是新的
                        "useStatisticsApiV2": true, //使用统计Api V2
                },
        },
        "id": 92910010,
};



function deepTranslateRequest() {
        
}


/**
 * externalApis.js
 */

class intelligenceAI //智能AI模块
{
        constructor(name) { //public 构造方法
                this.arrCityCode;
                this.baseWeatherURL = "https://api.help.bj.cn/";
        }
        
        getWeather(strCityName){ //public 获取天气(城市代码字符串)
                let URL = this.baseWeatherURL + "apis/weather2d/?id=" + strCityName; //生成URL
                $.ajax({
                        type: "Get", //请求方式
                        //async: false,
                        //contentType: "application/json;charset=UTF-8",//请求的媒体类型
                        url: URL, //请求地址
                        // headers: {
                        //      'User-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36',
                        //      //'Accept': 'application/atom+xml,application/xml,text/xml',
                        //      //"Content-Type": "application/x-www-form-urlencoded",
                        // },
                        //data: JSON.stringify(list),                           //数据，json字符串
                        success: function(result) { //请求成功
                                //let Data = JSON_processing_parsing_JsObj(result);
                                console.log("Data",result);
                        },
                        error: function(e) { //请求失败，包含具体的错误信息
                                console.log("请求失败了!", e.status);
                                console.log("请求失败了!", e.responseText);
                        }
                });
        }
}

//-------------------------------------------------------------------------------------------------------------
class externalApis{
        constructor(){
                this.urls = [
                        {
                                name: "mz-moe.cn", //名称
                                describe: "https://mz-moe.cn/?p=23", //描述
                                trait: "Support files only,https,406张图片(2019.8.12)", //特征
                                request: "get", //请求方式
                                mainUrl: "https://api.mz-moe.cn/", //基础url
                                library: [
                                        {
                                                name: "随机动漫图片api", //https://api.dongmanxingkong.com/suijitupian.html
                                                Url: "img.php", //功能url(部分)
                                                Url1: "", //功能url1(部分)
                                                parameter: "", //参数
                                                parameter1: "" //参数1(另外一种类型)
                                        },
                                ]
                        },{
                                name: "樱花", //名称
                                describe: "http://www.dmoe.cc/", //描述
                                trait: "http->https,1000+(2020-03-12)", //特征
                                request: "get", //请求方式
                                mainUrl: "http://www.dmoe.cc/", //基础url
                                library: [
                                        {
                                                name: "随机二次元图片API", //https://api.dongmanxingkong.com/suijitupian.html
                                                Url: "random.php", //功能url(部分)
                                                Url1: "", //功能url1(部分)
                                                parameter: "?return=json", //参数
                                                parameter1: "type=json" //参数1(另外一种类型)
                                        },
                                ]
                        },{
                                name: "动漫星空", //名称
                                describe: "https://api.dongmanxingkong.com/", //描述
                                trait: "https,8千万+张4K精美图片,文字二维码生成", //特征
                                request: "get", //请求方式
                                mainUrl: "https://api.dongmanxingkong.com/", //基础url
                                library: [
                                        {
                                                name: "随机图片API", //https://api.dongmanxingkong.com/suijitupian.html
                                                Url: ["suijitupian/acg/1080p/","suijitupian/acg/2k/","suijitupian/acg/4k/"], //功能url(部分)
                                                Url1: "index.php", //功能url1(部分)
                                                parameter: "?return=json", //参数
                                                parameter1: "type=json" //参数1(另外一种类型)
                                        },{
                                                name: "二维码API", //https://api.dongmanxingkong.com/qr.html
                                                Url: "qr/?text=", //功能url(部分)
                                                Url1: "&size=150", //功能url1(部分)
                                                parameter: "", //参数
                                                parameter1: "" //参数1(另外一种类型)
                                        }
                                ]
                        },{
                                name: "LRY_API(聚合漫画、影视、小说等接口)", //名称
                                describe: "http://api.pingcc.cn/", //描述
                                trait: "warn redirection,http,综合搜索,漫画,影视,小说", //特征
                                request: "get", //请求方式
                                mainUrl: "http://api.pingcc.cn/", //基础url
                                library: [
                                        {
                                                name: "综合搜索", //https://api.dongmanxingkong.com/suijitupian.html
                                                Url: "?name=", //功能url(部分)
                                                Url1: "", //功能url1(部分)
                                                parameter: "", //参数
                                                parameter1: "" //参数1(另外一种类型)
                                        },{
                                                name: "漫画API接口", //https://api.dongmanxingkong.com/qr.html
                                                Url: "?mhname=", //功能url(部分)
                                                Url1: ["?mhurl1=","?mhurl2="], //功能url1(部分) //通过mhurl2获取到的是漫画图片，按顺序排列
                                                parameter: "", //参数
                                                parameter1: "" //参数1(另外一种类型)
                                        },{
                                                name: "影视API接口", //https://api.dongmanxingkong.com/qr.html
                                                Url: "?ysname=", //功能url(部分)
                                                Url1: "?ysurl=", //功能url1(部分)
                                                parameter: "", //参数
                                                parameter1: "" //参数1(另外一种类型)
                                        },{
                                                name: "小说API接口", //https://api.dongmanxingkong.com/qr.html
                                                Url: "?xsname=", //功能url(部分)
                                                Url1: ["?xsurl1=","?xsurl2="], //功能url1(部分) //通过xsurl2获取到的是小说内容
                                                parameter: "", //参数
                                                parameter1: "" //参数1(另外一种类型)
                                        }
                                ]
                        },{
                                name: "宅言API", //名称
                                describe: "https://www.kancloud.cn/acman/zhaiyanapi/31183", //描述
                                trait: "https,动漫台词,角色资料,番组信息接口", //特征
                                request: "get", //请求方式
                                mainUrl: "https://zhaiyan.2cys.com/api", //基础url
                                library: [
                                        {
                                                name: "获取随机库中台词", //https://www.kancloud.cn/acman/zhaiyanapi/367018
                                                Url: "/taici/rands", //功能url(部分)
                                                Url1: "", //功能url1(部分)
                                                parameter: "?type=json", //参数
                                                parameter1: "json(默认)/xml/text" //参数1(另外一种类型)
                                        },{
                                                name: "根据库ID获取台词", //https://www.kancloud.cn/acman/zhaiyanapi/367019
                                                Url: "/taici/id", //功能url(部分)
                                                Url1: "", //功能url1(部分) //通过mhurl2获取到的是漫画图片，按顺序排列
                                                parameter: "?id=", //参数
                                                parameter1: "?type=json" //参数1(另外一种类型)
                                        },{
                                                name: "根据作品名获取数据", //https://www.kancloud.cn/acman/zhaiyanapi/367152
                                                Url: "/taici/names", //功能url(部分)
                                                Url1: "", //功能url1(部分)
                                                parameter: "?name=", //参数
                                                parameter1: ["?rand=0","?type=json"] //参数1(其他参数)
                                        },{
                                                name: "动漫角色资料接口", //https://www.kancloud.cn/acman/zhaiyanapi/48115
                                                Url: "", //功能url(部分)
                                                Url1: "", //功能url1(部分) //通过xsurl2获取到的是小说内容
                                                parameter: "", //参数
                                                parameter1: "" //参数1(另外一种类型)
                                        },{
                                                name: "获取随机库中番组", //https://www.kancloud.cn/acman/zhaiyanapi/368479
                                                Url: "/bangumi/rands", //功能url(部分)
                                                Url1: "", //功能url1(部分) //通过xsurl2获取到的是小说内容
                                                parameter: "?type=json", //参数
                                                parameter1: "" //参数1(另外一种类型)
                                        }
                                ]
                        }
                        
                ];
        }
        getUrlInfo(){
                console.log(this.urls);
        }
        async getDataByApiList(platformsID,apiId,type,name){ //参数: 平台id(区别不同平台提供的api),要调用的api的id(区分是要调用的是什么api),类型(调用api可能需要提供的参数),名称(调用api可能需要提供的参数)
                switch (platformsID){
                        case 0:
                                var obj = this.urls[0]; //mz-moe.cn
                                var lib = obj.library[0]; //随机动漫图片api
                                var url = obj.mainUrl + lib.Url;
                                console.log("url",url);
                                var jsData = await getResourceByURL(url,true); //随机动漫图片api
                                console.log("数据获取成果",jsData);
                                return jsData;
                                break;
                        case 1:
                                var obj = this.urls[1]; //樱花
                                var lib = obj.library[0]; //随机二次元图片API
                                console.log("url",url);
                                
                                var url = obj.mainUrl + lib.Url;
                                if(type == "json")
                                        url += lib.parameter;
                                var jsData = await getResourceByURL(url,true); //随机二次元图片API
                                console.log("数据获取成果",jsData);
                                return jsData;
                                break;
                        case 2:
                                var obj = this.urls[2]; //动漫星空
                                var lib = obj.library[0];  //随机图片API
                                var lib1 = obj.library[1]; //二维码API
                                var url = obj.mainUrl + lib.Url[0] + lib.Url1;
                                if(type == "json")
                                        url += lib.parameter;
                                var url1 = obj.mainUrl + lib1.Url + name + lib1.Url1;
                                console.log("url",url,"url1",url1);
                                var jsData;
                                if(apiId == 0){
                                        jsData = await getResourceByURL(url,true); //随机图片API
                                }else if(apiId == 1){
                                        jsData = await getResourceByURL(url1,true); //二维码API
                                }
                                console.log("数据获取成果",jsData);
                                return jsData;
                                break;
                        case 3:
                                var obj = this.urls[3]; //LRY_API(聚合漫画、影视、小说等接口)
                                var lib = obj.library[0];  //综合搜索
                                var lib1 = obj.library[1]; //漫画API接口
                                var lib2 = obj.library[2]; //影视API接口
                                var lib3 = obj.library[3]; //小说API接口
                                var url = obj.mainUrl + lib.Url  + name;
                                var url1 = obj.mainUrl + lib1.Url + name;
                                var url2 = obj.mainUrl + lib2.Url + name;
                                var url3 = obj.mainUrl + lib3.Url + name;
                                console.log("url",url,"url1",url1,"url2",url2,"url3",url3);
                                var jsData;
                                if(apiId == 0){
                                        jsData = await getResourceByURL(url,true); //综合搜索
                                }else if(apiId == 1){
                                        jsData = await getResourceByURL(url1,true); //漫画API接口
                                }else if(apiId == 2){
                                        jsData = await getResourceByURL(url2,true); //影视API接口
                                }else if(apiId == 3){
                                        jsData = await getResourceByURL(url3,true); //小说API接口
                                }
                                console.log("数据获取成果",jsData);
                                return jsData;
                                break;
                        case 4:
                                var obj = this.urls[4]; //宅言API
                                var lib = obj.library[0];  //获取随机库中台词
                                var lib1 = obj.library[1]; //根据库ID获取台词
                                var lib2 = obj.library[2]; //根据作品名获取数据
                                var lib3 = obj.library[3]; //动漫角色资料接口
                                var lib4 = obj.library[4]; //获取随机库中番组
                                var url = obj.mainUrl + lib.Url + lib.parameter;
                                var url1 = obj.mainUrl + lib1.Url + lib1.parameter + name + lib1.parameter1;
                                var url2 = obj.mainUrl + lib2.Url + lib2.parameter + name + lib2.parameter1[0] +  + lib2.parameter1[1];
                                var url3 = obj.mainUrl + lib3.Url + lib3.parameter;
                                var url4 = obj.mainUrl + lib4.Url + lib4.parameter + lib4.parameter;
                                console.log("url",url,"url1",url1,"url2",url2,"url3",url3,"url4",url4);
                                var jsData;
                                if(apiId == 0){
                                        jsData = await getResourceByURL(url,true); //获取随机库中台词
                                }else if(apiId == 1){
                                        jsData = await getResourceByURL(url1,true); //根据库ID获取台词
                                }else if(apiId == 2){
                                        jsData = await getResourceByURL(url2,true); //根据作品名获取数据
                                }else if(apiId == 3){
                                        jsData = await getResourceByURL(url3,true); //动漫角色资料接口
                                }else if(apiId == 4){
                                        jsData = await getResourceByURL(url4,true); //获取随机库中番组
                                }
                                console.log("数据获取成果",jsData);
                                return jsData;
                                break;
                        default:
                                break;
                }//switch
        }
        
}

//-------------------------------------------------------------------------------------------------------------
class SteamDB
{
        constructor(){
                this.mainURL = "https://steamdb.info/";
                this.freeGameURL = "upcoming/free/";
        }
        async initUI(gameInfo){ //初始化UI
                // jQuery(".friends_header_ctn").after(
                //      '<div id="GameFreeInfo">\
                //                      <div id="add1_head">喜加一</div>\
                //                      <div id="add1_body" style="display:inline-block;width:100%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; /*超出部分用...代替*/">\
                //                      </div>\
                //                      <div id="limitedTime_head">限时免费</div>\
                //                      <div id="limitedTime_body" style="display:inline-block;width:100%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; /*超出部分用...代替*/">\
                //                      </div>\
                //                      <div id="prediction_head">预告</div>\
                //                      <div id="prediction_body" style="display:inline-block;width:100%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; /*超出部分用...代替*/">\
                //                      </div>\
                //      </div>'
                // );
                console.log("initUI success!");
        }
        async GameFreeInfoHelper(){ //游戏免费信息助手
                console.log("GameFreeInfoHelper call...");
                initUI(data); //初始化UI
                
                console.log("GameFreeInfoHelper success!");
        }
        async getFreeGameInfo(){ //获取游戏喜加一信息(SteamDB)
                var url = this.mainURL + this.freeGameURL;
                var jsData = await getResourceByURL(url,true); //
                console.log("数据获取成果",jsData);
        }
        async getGameDiscountsInfoBysteamDB(){ //获取游戏折扣信息(SteamDB,HB,F站...)
                const url_fanatical = "https://www.fanatical.com/";
                const url_humblebundle = "https://www.humblebundle.com/";
                const url_indiegala = "http://indiegala.com/";
                const url_steam = "https://store.steampowered.com/search/?filter=topsellers&specials=1";
        }
}

//-------------------------------------------------------------------------------------------------------------

//1.请求 http://www.sonkwo.hk/store/search?keyword=GameName，手动解析数据
//-------------------------------------------------------------------------------------------------------------
//Fanatical (慢速警告)
//1.请求 https://www.fanatical.com/zh-hans/search?search=GameName，手动解析数据
//-------------------------------------------------------------------------------------------------------------
//humblebundle (慢速警告)
//1.请求 https://www.humblebundle.com/store/search?sort=bestselling&search=GameName，手动解析数据
//-------------------------------------------------------------------------------------------------------------
//1.请求 https://www.ccyyshop.com/bundles，手动解析数据
//-------------------------------------------------------------------------------------------------------------
//第三方网站抓取，比如  https://isthereanydeal.com/ajax/game/info?plain=nierautomata

/**
 * steamApis.js
 */

//-------------------------------------------------------------------------------------------------------------
// steam api
function setRemarks(profileID, remarkName) {
        var URL = "https://steamcommunity.com/profiles/" + profileID + "/ajaxsetnickname/";
        jQuery.post(URL, {
                nickname: remarkName,
                sessionid: g_sessionID
        }, function(response) {
                if (response.success === false) {
                        console.log("设置备注失败了!");
                } else {
                        console.log("成功设置备注于");
                }
        }).fail(function() {
                console.log("无法设置备注于");
        }).always(function() {
                //console.log("当前处理了 " + (i + 1) + "个, 总计 " + total + " 个好友.");
        });
}

class ConfirmDialog {

    static open(strTitle, strDescription, strOKButton, strCancelButton, strSecondaryActionButton) {
        return ExtensionLayer.runInPageContext((a,b,c,d,e) => {
            let prompt = ShowConfirmDialog(a,b,c,d,e);

            return new Promise((resolve, reject) => {
                prompt.done(result => {
                    resolve(result);
                }).fail(() => {
                    resolve("CANCEL");
                });
            });
        },
        [
            strTitle,
            strDescription,
            strOKButton,
            strCancelButton,
            strSecondaryActionButton
        ],
        true);
    }
}
// ConfirmDialog.open("TEST");


//-------------------------------------------------------------------------------------------------------------
function getUserLocation(profileID) //获取用户位置()
{
        var name = document.getElementsByClassName("header_real_name ellipsis")[0].getElementsByTagName("bdi")[0].innerText;
        var str = document.getElementsByClassName("header_real_name ellipsis")[0].innerText;
        var index = str.indexOf(name);
        var strLocation = "";
        var arrLocation = [];
        if( index != -1)
        {
                strLocation = str.slice(index+name.length); //裁剪，获取地址位置字符串
                strLocation = strLocation.replace(/\s+/g,""); //去除所有的空格
                if(strLocation == "")
                {
                        return null; //没有获取到数据
                }
                arrLocation = strLocation.split(',');
        }
        console.log("arrLocation",arrLocation);
        for (let i = arrLocation.length-1; i >= 0; i--) {
                console.log(arrLocation[i]);
                return arrLocation;
        }
}
// var ret = getUserLocation();
// if(ret != null)
// {
//      if(ret>1)
//      {
//              getCityChinsesNameByEnglishName(ret[0]);
//      }
// }

function getUserCommentData(profileID) //获取用户的评论的大数据(用户64位id)
{
        var date = new Date();
        
        jQuery.post("//steamcommunity.com/comment/Profile/post/" + profileID + "/-1/", {
                comment: newMgs,
                count: 6,
                sessionid: g_sessionID
        }, function(response) {
                if (response.success === false) {
                        jQuery("#log_body")[0].innerHTML +=
                                "<a style='color:#ff2c85;' target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID +
                                "\">" + '[' + (i + 1) + '/' + total + '] 留言失败了! ' + profileID + '  ' + name +
                                '&nbsp;&nbsp;&nbsp;&nbsp;' + response.error + "</a><br>";
                } else {
                        jQuery("#log_body")[0].innerHTML +=
                                '[' + (i + 1) + '/' + total + '] ' +
                                "成功发表评论于 <a target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID + "\">" +
                                profileID + '  ' + name + "</a>" +
                                "<span> → </span><a style='color:#FB7299;' target='_blank' href=\"http://steamcommunity.com/profiles/" +
                                profileID + "\">" + newMgs + "</a><br>";
                }
        }).fail(function() {
                jQuery("#log_body")[0].innerHTML +=
                        '[' + (i + 1) + '/' + total + '] ' +
                        "<span style='color:#DA2626;'>无法发表评论于 <a style='color:#DA2626;' target='_blank' href=\"http://steamcommunity.com/profiles/" +
                        profileID + "\">" +
                        profileID + '  ' + name + "</a></span><br>";
        }).always(function() {
                jQuery("#log_head").html("<br><b>当前处理了 " + (i + 1) + "个, 总计 " + total + " 个好友.<b>");
        });
}

function setSaveUserCommentData(profileID,str) //设置已保存的用户评论数据
{
        
}

function getSaveUserCommentData(profileID) //获取已保存的用户评论数据
{
        
}


// var jqobj;

// function traverseAllFriend() //遍历所有好友
// {
//      function concurrentPoll() {
//              this.tasks = []; // 任务队列  
//              this.max = 100; // 最大并发数  
//              setTimeout(() => { // 函数主体执行完后立即执行  
//                      this.run()
//              }, 0);
//      }
//      concurrentPoll.prototype.addTask = function(task) { // 原型添加任务方法  
//              this.tasks.push(task)
//      }
//      concurrentPoll.prototype.run = function() { // 原型任务运行方法  
//              if (this.tasks.length == 0) { // 判断是否还有任务  
//                      return
//              }
//              var min = Math.min(this.tasks.length, this.max); // 取任务个数与最大并发数最小值  
//              for (var i = 0; i < min; i++) {
//                      this.max--; // 执行最大并发递减  
//                      var task = this.tasks.shift(); // 从数组头部取任务  
//                      task().then((res) => { // 重：此时可理解为，当for循环执行完毕后异步请求执行回调,此时max变为0  
//                              console.log(res)
//                      }).catch((err) => {
//                              console.log(err)
//                      }).finally(() => { // 重：当所有请求完成并返回结果后，执行finally回调，此回调将按照for循环依次执行，此时max为0.  
//                              this.max++; // 超过最大并发10以后的任务将按照任务顺序依次执行。此处可理解为递归操作。  
//                              this.run();
//                      })
//              }
//      }
//      var poll = new concurrentPoll(); // 实例
//      //并发多个相同任务

//      jqobj = jQuery(".selectable[data-steamid]"); //选择所有好友
//      //for (let i = 0; i < jqobj.length; i++) {
//      for (let i = 0; i < 1; i++) {
//              let cur = jqobj.get(i);
//              let profileID = cur.getAttribute("data-steamid");
//              poll.addTask(function() {
//                      return new Promise(
//                              function(resolve, reject) {
//                                      // 一段耗时的异步操作
//                                      getProfilesInfo(resolve, reject, i, profileID);
//                              })
//              })
//      }
//      console.log("完毕!");

//      // for (let i=0; i<23; i++) { // 数据模拟  
//      //   poll.addTask(function () {  
//      //   return new Promise(  
//      //   function (resolve, reject) {  
//      //   // 一段耗时的异步操作
//      //   getProfilesInfo(resolve, reject,i,"76561198818854009");
//      //   })})
//      //   }


//      // poll.addTask(async function () {  

//      //      //let arr = [fun(0),fun(1),fun(2)];
//      //      let arr = [];
//      //      for (var i=0; i<13; i++) { // 数据模拟
//      //              //arr.push(fun(i));
//      //              arr.push(new Promise(function (resolve, reject){getProfilesInfo(i,"76561198818854009");}));
//      //      }
//      //      let res = await Promise.all(arr);
//      //  return res;
//      //  // new Promise(
//      //  //  function (resolve, reject) {  
//      //  //  // 一段耗时的异步操作
//      //  //  getProfilesInfo("76561198818854009");
//      //  //  resolve('成功') // 数据处理完成  
//      //  //  // reject('失败') // 数据处理出错
//      //  //  })

//      //  })

// }

// var waitStatus1 = []; //等待状态
// var returnData1 = []; //返回数据
// async function getgetProfilesID(i, profileID) {
//      let URL = "https://steamcommunity.com/profiles/" + profileID + "/";

//      if (waitStatus1.length == 0)
//              waitStatus1.length = jqobj.length; //设置数组长度

//      if (returnData1.length == 0)
//              returnData1.length = jqobj.length; //设置数组长度

//      //waitStatus1.push([profileID,true]); //开始等待
//      waitStatus1[i] = [profileID, true]; //存储数据到对应的位置(受网络影响,响应顺序可能会不同)
//      //console.log("getgetProfilesID() i:",i,"waitStatus1:",waitStatus1);

//      jQuery.ajax({
//              type: "Get", //请求方式
//              //async: false,
//              //contentType: "application/json;charset=UTF-8",//请求的媒体类型
//              url: URL, //请求地址
//              // headers: {
//              //      'User-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36',
//              //      //'Accept': 'application/atom+xml,application/xml,text/xml',
//              //      //"Content-Type": "application/x-www-form-urlencoded",
//              // },
//              //data: JSON.stringify(list),                           //数据，json字符串
//              success: function(result) { //请求成功
//                      let Data = result;
//                      //console.log("请求成功了!",Data);
//                      let nIstart = Data.indexOf('StartTradeOffer(');
//                      let nIend = Data.indexOf(');', nIstart);
//                      let AccountID = Data.slice(nIstart + 'StartTradeOffer('.length + 1, nIend - 1);
//                      nIstart = Data.indexOf('"steamid":"');
//                      nIend = Data.indexOf('",', nIstart);
//                      let profileID = Data.slice(nIstart + '"steamid":"'.length, nIend);
//                      console.log("getgetProfilesID() i:", i, "AccountID:", AccountID, "profileID:", profileID);

//                      for (let i = 0; i < waitStatus1.length; i++) {
//                              if (waitStatus1[i][0] == profileID) //是否是同一个用户
//                              {
//                                      if (waitStatus1[i][1] == false) //这个用户是否已经获取过了(测试多个相同用户信息的获取)
//                                              continue;
//                                      waitStatus1[i][1] = false;
//                                      //returnData1.push(AccountID); //存储数据
//                                      returnData1[i] = AccountID; //存储数据到对应的位置(受网络影响,响应顺序可能会不同)
//                                      //console.log("getgetProfilesID() 成功存储数据 AccountID:",AccountID);
//                                      return;
//                                      //console.log("waitStatus1[i][1] break",i,waitStatus1[i][1]);
//                              }
//                      }
//                      console.log("getgetProfilesID 数据错误!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
//                      console.log("waitStatus1:", waitStatus1, 'returnData1:', returnData1);
//                      console.log('profileID:', profileID, 'AccountID:', AccountID);
//                      return;
//                      //console.log("DBG!",nIstart,nIend);
//              },
//              error: function(e) { //请求失败，包含具体的错误信息
//                      console.log("请求失败了!", e.status);
//                      console.log("请求失败了!", e.responseText);
//              }
//      });
//      //console.log("getgetProfilesID() i:",i,"waitStatus1:",waitStatus1);
//      while (waitStatus1[i][1]) //强制等待异步函数执行完毕后再执行
//      {
//              //console.log("wait...",i,waitStatus1[i][1]);
//              await sleep(50); //延迟0.1秒
//      }
//      //console.log("waitStatus1[i][1]:",waitStatus1[i][1],"returnData1[i]:",returnData1[i]);
//      return returnData1[i];

//      // jQuery.get(URL, {
//      //      // "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
//      //      // // "Content-Type": "application/x-www-form-urlencoded", //非常重要
//      //      // "Accept-Encoding": "gzip, deflate, br",
//      //      // "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
//      //      // "Cache-Control": "max-age=0",
//      //      // "Connection": "keep-alive",
//      //      // "Cookie": "sessionid=6f84a0f48cddb56ad66394b6; steamCountry=HK%7Cda7daa2682f7a361e594f8dad55fe9df; timezoneOffset=28800,0",
//      //      // "Host": "steamcommunity.com",
//      //      // "Upgrade-Insecure-Requests": "1",
//      //      'User-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36',
//      // }, function(response) {
//      //      if (response.status === 200) {
//      //              console.log("获取失败!",response.responseText);
//      //      } else {
//      //              console.log("获取成功!",response.responseText);
//      //      }
//      // }).fail(function() {
//      //      console.log("无法获取!");
//      // }).always(function() {
//      //      //console.log("当前处理了 " + (i + 1) + "个, 总计 " + total + " 个好友.");
//      // });


//      // GM_xmlhttpRequest({
//      //      method: 'GET',
//      //      url: URL,
//      //      headers: {
//      //              'User-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36',
//      //              //'Accept': 'application/atom+xml,application/xml,text/xml',
//      //              //"Content-Type": "application/x-www-form-urlencoded",
//      //      },
//      //      onload: function(response) {
//      //              if (response.status === 200) {
//      //                      console.log('请求成功!',response.responseText);
//      //                      //var JSON_jsObj = JSON_processing_parsing_JsObj(response.responseText);
//      //                      //遍历[0][0]数组就可以取得翻译后的文本,原始数据,原始数据的拼音
//      //                      //[2]是检查出的语言
//      //                      //遍历[5]可以取得两种翻译,原始数据和原始数据的长度
//      //                      //遍历[8]可以得到原始语言和翻译语言
//      //                      //for (var i = 0; i < JSON_jsObj.length; i++) {
//      //                      //      for (var j = 0; j < JSON_jsObj[i].length; j++) {
//      //                      //              for (var k = 0; k < JSON_jsObj[i][j].length; k++) {
//      //                      //                      
//      //                      //              }
//      //                      //      }
//      //                      //}
//      //                      //var retData = "";
//      //                      //for (var j = 0; j < JSON_jsObj[0].length; j++) {
//      //                      //      if (JSON_jsObj[0][j][0] != null) {
//      //                      //              retData += JSON_jsObj[0][j][0]; //组合每一句翻译
//      //                      //      }
//      //                      //}
//      //                      returnData = retData; //存储数据
//      //                      //console.log('谷歌翻译:',retData);
//      //                      waitStatus = false; //不等待

//      //                      //console.log(response);
//      //                      //console.log(response.responseText);
//      //                      //if(response.responseText.indexOf('[[["') == 0) //是否是指定的数据格式
//      //                      //{
//      //                      //      var retData = response.responseText.slice(4,response.responseText.indexOf('","',4)); //提取翻译后的文本
//      //                      //      returnData = retData; //存储数据
//      //                      //      //console.log('谷歌翻译:',retData);
//      //                      //      waitStatus = false; //不等待
//      //                      //}
//      //              } else {
//      //                      console.log('请求失败!');
//      //                      //console.log(response);
//      //                      //console.log(response.responseText);
//      //              }
//      //      },
//      //      onerror: function(err) {
//      //              console.log('请求错误!', err);
//      //      }
//      // });
// }

// var waitStatus = []; //等待状态
// var returnData = []; //返回数据
// async function getProfilesInfo(resolve, reject, i, profileID) {
//      let joinDate, friendDate;
//      let str;

//      if (waitStatus.length == 0)
//              waitStatus.length = jqobj.length; //设置数组长度

//      if (returnData.length == 0)
//              returnData.length = jqobj.length; //设置数组长度

//      jQuery.ajaxSetup({
//              cache: false
//      }); //close AJAX cache

//      ////获取一个数组真实长度
//      //let arrRealLength = undefined;
//      //for (let i = 0; i < waitStatus.length; i++) {
//      //      if(waitStatus[i] == undefined)
//      //      {
//      //              arrRealLength = i;
//      //              break;
//      //      }
//      //}
//      //if(arrRealLength == undefined) //是否为数组最大长度
//      //      arrRealLength = waitStatus.length;


//      //waitStatus.push([profileID,true]); //开始等待
//      waitStatus[i] = [profileID, true]; //存储数据到对应的位置(受网络影响,响应顺序可能会不同)

//      await getgetProfilesID(i, profileID); //

//      let AccountID = returnData1[i];
//      //console.log("getProfilesInfo(): AccountID:",AccountID,'i:',i,"returnData[i]:",returnData[i]);
//      //var AccountID = "242752742";//242752742//858588281

//      let URL = "https://steamcommunity.com/tradeoffer/new/?partner=" + AccountID;

//      jQuery.ajax({
//              type: "Get", //请求方式
//              //async: false,
//              //contentType: "application/json;charset=UTF-8",//请求的媒体类型
//              url: URL, //请求地址
//              // headers: {
//              //      'User-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36',
//              //      //'Accept': 'application/atom+xml,application/xml,text/xml',
//              //      //"Content-Type": "application/x-www-form-urlencoded",
//              // },
//              //data: JSON.stringify(list),                           //数据，json字符串
//              success: function(result) { //请求成功
//                      let Data = result;
//                      if (Data.indexOf("抱歉，发生了某种错误：") != -1) //不能正常进行交易,获取不到数据就跳过
//                      {
//                              waitStatus[i][1] = false;
//                              returnData[i] = null; //不返回数据
//                              return;
//                      }
//                      //console.log("请求成功了!",Data);
//                      let nIstart = Data.indexOf('trade_partner_member_since trade_partner_info_text');
//                      if (nIstart == -1) {
//                              nIstart = Data.indexOf('trade_partner_header responsive_trade_offersection top');
//                              let nindex = Data.indexOf('trade_partner_info_text">', nIstart);
//                              let nIend = Data.indexOf('</div>', nindex);
//                              friendDate = Data.slice(nindex + 'trade_partner_info_text">'.length, nIend); //加入Steam的日期
//                              friendDate = friendDate.replace(/^\s+|\s+$/g, ""); //去除左右两边的空格
//                              joinDate = "查询不到";
//                              nIstart = Data.lastIndexOf('g_ulTradePartnerSteamID');
//                              nIindex = Data.indexOf('\'', nIstart);
//                              nIend = Data.indexOf('\'', nIindex + 1);
//                              profileID = Data.slice(nIindex + 1, nIend);
//                              //console.log("profileID",profileID);
//                      } else {
//                              let nIindex = Data.indexOf('>', nIstart);
//                              let nIend = Data.indexOf('</div>', nIindex);
//                              joinDate = Data.slice(nIindex + 1, nIend); //加入Steam的日期
//                              //console.log("joinDate",joinDate);
//                              nIstart = Data.indexOf('trade_partner_info_text');
//                              nIindex = Data.indexOf('>', nIstart);
//                              nIend = Data.indexOf('</div>', nIindex);
//                              friendDate = Data.slice(nIindex + 1, nIend - 1); //成为好友的日期
//                              friendDate = friendDate.replace(/^\s+|\s+$/g, ""); //去除左右两边的空格
//                              //console.log("friendDate",friendDate);
//                              nIstart = Data.lastIndexOf('g_ulTradePartnerSteamID');
//                              nIindex = Data.indexOf('\'', nIstart);
//                              nIend = Data.indexOf('\'', nIindex + 1);
//                              profileID = Data.slice(nIindex + 1, nIend);
//                              //console.log("profileID",profileID);
//                      }

//                      for (let i = 0; i < waitStatus.length; i++) {
//                              if (waitStatus[i][0] == profileID) //是否是同一个用户
//                              {
//                                      if (waitStatus[i][1] == false) //这个用户是否已经获取过了(测试多个相同用户信息的获取)
//                                              continue;
//                                      waitStatus[i][1] = false;
//                                      //returnData.push([joinDate,friendDate]); //存储数据
//                                      returnData[i] = [joinDate, friendDate]; //存储数据到对应的位置(受网络影响,响应顺序可能会不同)
//                                      //console.log("waitStatus[i][1] break",i,waitStatus[i][1]);
//                                      return;
//                              }

//                      }
//                      console.log("getProfilesInfo 数据错误!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
//                      console.log("waitStatus:", waitStatus, "returnData:", returnData);
//                      console.log("profileID", profileID);
//                      //console.log("Data",Data);
//                      return;
//                      //console.log("DBG!",nIstart,nIend);
//              },
//              error: function(e) { //请求失败，包含具体的错误信息
//                      console.log("请求失败了!", e.status);
//                      console.log("请求失败了!", e.responseText);
//              }
//      });

//      while (waitStatus[i][1]) //强制等待异步函数执行完毕后再执行
//      {
//              //console.log("wait...",i,waitStatus[i][1]);
//              await sleep(50); //延迟0.1秒
//      }
//      if (returnData[i] == null) //检查数据有效性
//      {
//              console.log("str [" + (i + 1) + "] 不能获取到数据,已跳过: https://steamcommunity.com/profiles/" + profileID);
//              return;
//      }
//      console.log("waitStatus[i][1]:", waitStatus[i][1], "waitStatus[i]:", waitStatus[i]);

//      str = "加入日期: " + returnData[i][0] + " 成为好友日期: " + returnData[i][1];
//      console.log("str [" + (i + 1) + ']', str);
//      resolve('成功') // 数据处理完成
//      // reject('失败') // 数据处理出错
//      return str;
// }

// // let arr = [];
// // for (var i=0; i<1; i++) { // 数据模拟
// //   //arr.push(fun(i));
// //   arr.push(new Promise(function (resolve, reject){getProfilesInfo(1,2,i,"76561198818854009");}));
// // }
// // let res = await Promise.all(arr);

// // var jqobj = jQuery(".selectable[data-steamid]"); //选择所有好友
// // let arr = [];
// // for (var i=0; i<20; i++) { // 数据模拟
// // let cur = jqobj.get(i);
// // let profileID = cur.getAttribute("data-steamid");
// //   //arr.push(fun(i));
// //   //getProfilesInfo(1, 2,i,profileID);
// //   arr.push(new Promise(function (resolve, reject){getProfilesInfo(1, 2,i,profileID);}));
// // }
// // let res = await Promise.all(arr);

//------------------------------------------------------------------------------------------------------------------------------------------
//miku-39

class friendActivity{
        constructor(profileID_Url) { /*构造方法(用户id或者自定义链接)*/
                this.steamCommunityUrl = "https://steamcommunity.com/";
                this.customUrl = "id/";
                this.profileIDUrl = "profiles/";
                this.friendActivitUrl = "/home";
                this.friendActivitOptionUrl = "/blotteredit";
                
                this.startElementsId = "blotter_content";
                this.endElementsId = "blotter_throbber";
                this.jsName = "g_BlotterNextLoadURL";
                this.friendActivityElementsBlockId = "blotter_block";
                
                this.isYun = false;
                
                //游戏评测
                this.UserEvaluationUp = "UserReviewVoteUp"; //用户评价 是 的函数名
                this.UserEvaluationDown = "UserReviewVoteDown"; //用户评价 否 的函数名
                this.UserEvaluationHappy = "UserReviewVoteTag"; //用户评价 欢乐 的函数名
                //上传载图、收藏载图
                //指南添加到收藏夹、发表指南
                //艺术作品添加到收藏夹、发布艺术作品
                //添加视频、收藏视频
                this.captureUp = "VoteUp"; //用户评价 赞 的函数名
                this.captureDown = "VoteDown"; //用户评价 否 的函数名
                this.captureShare = "ShowSharePublishedFilePopup"; //用户操作 分享 的函数名
                //购买游戏或者DLC
                this.bus = "VoteUpCommentThread"; //用户评价 赞 的函数名 "VoteUpCommentThread('UserReceivedNewGame"
                //发布状态或者游戏状态
                this.status = "VoteUpCommentThread"; //用户评价 赞 的函数名 "VoteUpCommentThread('UserStatusPublished"
                
                this.groupNotificationUp = "RateAnnouncement"; //用户评价 赞
                this.groupNotificationDown = "RateAnnouncement"; //用户评价 否
                
                this.g_bRecoredUpvote = false;
                
                //制作一件物品时 ghs 强烈推荐 发布艺术作品之类的
                //在某人的截图中? 发布艺术作品之类的，状态等
                //jQuery(".ugc.has_adult_content img, .ugc.has_adult_content div.imgWallItem")
                
                //var obj = jQuery(".ugc.has_adult_content img, .ugc.has_adult_content div.imgWallItem");
                //for (let i = 0; i < obj.length; i++) {
                //      obj[i].style.filter = "none";
                //      obj[i].style.border = "2px red solid";
                //      obj[i].parentNode.parentNode.parentNode.parentNode.style.border = "2px red solid";
                //}
                
                if(isIntNum(profileID_Url)){
                        this.profileID_Url = profileID_Url.toString(); //用户id
                        this.mode = 0;
                        this.Url = this.steamCommunityUrl + this.profileIDUrl + this.profileID_Url;
                }
                else{
                        this.profileID_Url = profileID_Url; //自定义链接
                        this.mode = 1;
                        this.Url = this.steamCommunityUrl + this.customUrl + this.profileID_Url;
                }
        }
        async init(profileID_Url){
                
                if(isIntNum(profileID_Url)){
                        this.profileID_Url = profileID_Url.toString(); //用户id
                        this.mode = 0;
                        this.Url = this.steamCommunityUrl + this.profileIDUrl + this.profileID_Url;
                }
                else{
                        this.profileID_Url = profileID_Url; //自定义链接
                        this.mode = 1;
                        this.Url = this.steamCommunityUrl + this.customUrl + this.profileID_Url;
                }
        }
        
        LogUpvote(){
                if ( !this.g_bRecoredUpvote )
                {
                        this.g_bRecoredUpvote = true;
                        $J.post( 'https://steamcommunity.com/actions/LogFriendActivityUpvote', {sessionID: g_sessionID} );
                }
        }
        
        VoteUp(item_id){ //有些东西点不了赞
                        var options = {
                                method: 'post',
                                postBody: 'id=' + item_id + '&sessionid=' + g_sessionID,
                                onComplete: (function(item_id){
                                        return function(transport)
                                        {
                                                var response = JSON.parse(transport.responseText);
                                                switch (response.success){
                                                        case 1:
                                                        //debugger
                                                        //console.log("VoteUp() 已经点过赞了!",transport.responseText);
                                                                break;
                                                        case 10:
                                                        //debugger
                                                        //console.log("VoteUp() 点赞完成??",transport.responseText);
                                                                break;
                                                        case 15:
                                                        //debugger
                                                        console.log("VoteUp() 点赞错误!!!",transport.responseText);
                                                                break;
                                                        default: //{"success":20} //{"success":16,"items":[2082593203],"results":{"2082593203":16}}
                                                        debugger
                                                        console.log("VoteUp() ????????????????????????????????????????????????????????????",transport.responseText);
                                                                break;
                                                }
                                        }
                                }(item_id))
                        };
                        
                        new Ajax.Request(
                                'https://steamcommunity.com/sharedfiles/voteup',
                                options
                        );
                        this.LogUpvote();
        }
        
        //home页面 InitializeCommentThread
        
        //rgCommentData['pagesize']
        //var CCommentThread = Class.create
        //initialize: function( type, name, rgCommentData, url, nQuoteBoxHeight )
        
        //function InitializeCommentThread( type, name, rgCommentData, url, nQuoteBoxHeight )
        //this.m_cPageSize
        VoteUpCommentThread(commentthreadid){ //这个函数有不确定性
                        let iprefix = commentthreadid.indexOf('_');
                        var prefixUrl = commentthreadid.slice(0,iprefix);
                        let iowner = commentthreadid.indexOf('_',iprefix+1);
                        var ownerUrl = commentthreadid.slice(iprefix+1,iowner);
                        var featureUrl = commentthreadid.slice(iowner+1);
                        
                        this.LogUpvote();
                        
                        var GetActionURL  = function(action){
                                var url = "https://steamcommunity.com/comment/" + prefixUrl + "/" + action + "/";
                                url += ownerUrl + '/';
                                url += featureUrl + '/';
                                return url;
                        }
                        
                        var countValue = 3;
                        
                        switch (prefixUrl){
                                case 'UserReceivedNewGame': //购买游戏或者DLC
                                        countValue = 3;
                                        break;
                                case 'PublishedFile_Public': //没有测试过是否有这个
                                        debugger
                                        countValue = 3;
                                        break;
                                case 'UserStatusPublished': //发布状态或者游戏状态
                                        countValue = 6;
                                        break;
                                default:
                                        debugger
                                        console.log("VoteUpCommentThread() ??????????????????????????????????????????????????");
                                        break;
                        }
                        
                        var params = {
                        vote: 1,
                        count: countValue,
                        sessionid: g_sessionID,
                        feature2: -1,
                        newestfirstpagination: true,
                        };
                        
                        new Ajax.Request( GetActionURL( 'voteup' ), {
                                method: 'post',
                                parameters: params,
                                onSuccess: ()=>{
                                        //console.log("VoteUpCommentThread() 点赞成功!",countValue,commentthreadid)
                                        },
                                onFailure:  ()=>{
                                        console.log("VoteUpCommentThread() 点赞失败! 与网络通信时出错。请稍后再试。",countValue,commentthreadid)
                                        },
                                onComplete: ()=>{
                                        //console.log("VoteUpCommentThread() 点赞完毕! 用时",countValue,commentthreadid)
                                        }
                        } );
                }
                
                UserReviewVoteUp(id)
                {
                        //debugger
                        this.UserReview_Rate( id, true, 'https://steamcommunity.com',
                                function( rgResults,recommendationID ) {
                                        //console.log("UserReviewVoteUp() 点赞成功~",rgResults,recommendationID);
                                }
                        );
                }
                
                UserReview_Rate(recommendationID, bRateUp, baseURL, callback)
                {
                        $J.post( baseURL + '/userreviews/rate/' + recommendationID,{
                                                'rateup' : bRateUp,
                                                'sessionid' : g_sessionID
                        }).done( function( results,recommendationID ) {
                                if ( results.success == 1 )
                                {
                                        callback( results );
                                }
                                else if ( results.success == 21 )
                                {
                                        ShowAlertDialog( '错误', '您必须先登录以执行该操作。' );
                                }
                                else if ( results.success == 15 )
                                {
                                        ShowAlertDialog( '错误', '您的帐户没有足够的权限执行此操作。' );
                                }
                                else if ( results.success == 24 )
                                {
                                        ShowAlertDialog( '错误', '您的帐户不符合使用该功能的要求。<a class="whiteLink" href="https://help.steampowered.com/zh-cn/wizard/HelpWithLimitedAccount" target="_blank" rel="noreferrer">访问 Steam 客服</a>了解更多信息。' );
                                }
                                else
                                {
                                        ShowAlertDialog( '错误', '在尝试处理您的请求的过程中出现了错误：' + results.success );
                                }
                        } );
                }
                
        RateAnnouncement(strArguments){
                //解析参数并填充
                var rateURL, gid, bVoteUp, clanID;
                strArguments = strArguments.replace(/'/g, ""); //去除字符串中出现的所有单引号
                strArguments = strArguments.replace(/\s+/g,""); //去除字符串所有的空格
                var arr = strArguments.split(','); //划分为参数
                rateURL = arr[0];
                gid = arr[1];
                if(arr[2]=="true")
                        bVoteUp = true;
                else bVoteUp = false;
                clanID = parseInt(arr[3]);
                
                rateURL = rateURL + gid;
                $J.post( rateURL, {
                                'voteup' : bVoteUp,
                                'clanid' : clanID,
                                'sessionid' : g_sessionID
                        }
                ).done( function( json ) {
                        //console.log("RateAnnouncement() 点赞成功.",json);
                } )
                .fail( function( jqxhr ) {
                        var responseJSON = jqxhr.responseText.evalJSON();
                        switch ( responseJSON.success )
                        {
                                case 21:
                                        ShowAlertDialog( '错误', '您必须登录才能执行该操作。' );
                                        break;
                                case 24:
                                        ShowAlertDialog( '错误',
                                                '您的帐户不符合使用该功能的要求。<a class="whiteLink" href="https://help.steampowered.com/zh-cn/wizard/HelpWithLimitedAccount" target="_blank" rel="noreferrer">访问 Steam 客服</a>了解更多信息。'
                                        );
                                        break;
                                case 15:
                                        ShowAlertDialog( '错误', '您没有执行该操作的权限。' );
                                        break;
                                default:
                                        ShowAlertDialog( '错误', '在处理您的请求时遇到错误：' + responseJSON.success );
                                        break;
                        }
                } );
                return false;
        }
        
        //g_BlotterNextLoadURL
        //StartLoadingBlotter( g_BlotterNextLoadURL );
        async Run(){ //开始点赞
                var documentData;
                var arrData;
                var nextLoadURL;
                
                var url = this.Url + this.friendActivitUrl;
                this.isYun = true;
                console.log("开始点赞...",url);
                var i = 0;
                while(this.isYun)
                {
                        i++;
                        if(i==1){
                                documentData = await getResourceByURL(url,true);
                                //console.log("url:",this.Url,"data:",documentData);
                                var index = documentData.indexOf(this.startElementsId); //开始区域 blotter_content
                                var endindex = documentData.lastIndexOf(this.endElementsId); //结束区域 blotter_throbber
                                var Data = documentData.slice(index,endindex);
                                var jsindex = documentData.indexOf(this.jsName,endindex);
                                var jsendindex = documentData.indexOf(';',jsindex);
                                var jsData = documentData.slice(jsindex,jsendindex);
                                nextLoadURL = jsData.slice(jsData.indexOf('\'')+1,jsData.lastIndexOf('\''));
                                //console.log("Data:",Data,"nextLoadURL:",nextLoadURL);
                                arrData = Data.split(this.friendActivityElementsBlockId);
                        }
                        //else if ( !response ){
                        //      // print out any error for now 现在打印出任何错误
                        //      console.log("错误:",transport.responseText);
                        //      //$('blotter_content').insert( { bottom: transport.responseText } );
                        //}
                        else
                        {
                                documentData = await getResourceByURL(url,false); //获取原始数据
                                //console.log("url:",this.Url,"data:",documentData);
                                //console.log(documentData);
                                this.g_bRecoredUpvote = false;
                                
                                // load more data
                                //var response = documentData.responseJSON;
                                if(documentData.responseText == undefined){ //针对请求失败的情况(自实现)
                                        console.log("请求失败,错误码: 0x1 潜在的网络故障 url:"+ url);
                                        debugger
                                        var index = url.lastIndexOf('=');
                                        nextLoadURL = url.slice(0,index); //提取最前面的链接
                                        var num = parseInt(url.slice(index+1));s
                                        nextLoadURL += (num+250);
                                        url = nextLoadURL;
                                        continue;
                                }
                                console.log("documentData.responseText",documentData.responseText);
                                var response = JSON.parse(documentData.responseText);
                                if ( response && response.success == true && response.blotter_html ){
                                        // append the new day, having it fade in quickly 补充新的一天，让它迅速消失
                                        
                                        // Scan each blotter response for an event ID we've seen before, so we can prune them out 扫描每个吸纸器响应以获取我们之前见过的事件ID，以便我们将其删节
                                        var html = response.blotter_html;
                                        arrData = html.split(this.friendActivityElementsBlockId);
                                        
                                        //var newDiv = new Element ( 'div' );
                                        //newDiv.update( html );
                                        //newDiv.setOpacity(0);
                                        //$('blotter_content').appendChild( newDiv );
                                        
                                        //Blotter_RecordAppImpressions();
                                        //ApplyAdultContentPreferences();
                                        
                                        //new Effect.Appear( newDiv, { duration: .75 }  );
                                        
                                        //g_BlotterNextLoadURL = response.next_request;
                                        nextLoadURL = response.next_request;
                                        //debugger
                                        //Blotter_InfiniteScrollingCheckForMoreContent();
                                        //Blotter_AddHighlightSliders();
                                }
                                else { //针对请求失败的情况(自实现)
                                        console.log("请求失败,错误码: 0x2 请求错误 url:"+ url);
                                        debugger
                                        var index = url.lastIndexOf('=');
                                        nextLoadURL = url.slice(0,index); //提取最前面的链接
                                        var num = parseInt(url.slice(index+1));s
                                        nextLoadURL += (num+250);
                                        url = nextLoadURL;
                                        continue;
                                }
                        }
                        // debugger
                        for (let i = 0; i < arrData.length; i++) {
                                //console.log(arrData[i]);
                                
                                var k = arrData[i].lastIndexOf(this.bus); //VoteUpCommentThread('UserReceivedNewGame
                                if(k>0)
                                {
                                        var startk = arrData[i].indexOf('(',k);
                                        var endk = arrData[i].indexOf(')',startk);
                                        var code = arrData[i].slice(startk+1,endk);
                                        code = code.replace(/'/g, ""); //去除字符串中出现的所有单引号
                                        code = code.replace(/^\s*|\s*$/g,""); //去除字符串内两头的空格
                                        //console.log("code",code);
                                        //debugger
                                        this.VoteUpCommentThread(code); //点赞
                                        await sleep(50); //延迟0.01秒
                                        continue;
                                }
                                
                                // var l = arrData[i].lastIndexOf(this.status); //VoteUpCommentThread('UserStatusPublished
                                // if(l>0)
                                // {
                                //      var startl = arrData[i].indexOf('(',l);
                                //      var endl = arrData[i].indexOf(')',startl);
                                //      var code = arrData[i].slice(startl+1,endl);
                                //      code = code.replace(/'/g, ""); //去除字符串中出现的所有单引号
                                //      code = code.replace(/^\s*|\s*$/g,""); //去除字符串内两头的空格
                                //      console.log("code",code);
                                //      debugger
                                //      this.VoteUpCommentThread(code); //点赞
                                //      await sleep(50); //延迟0.01秒
                                //      continue;
                                // }
                                
                                var o = arrData[i].lastIndexOf(this.UserEvaluationUp); //UserReviewVoteUp
                                if(o>0)
                                {
                                        var starto = arrData[i].indexOf('(',o);
                                        var endo = arrData[i].indexOf(')',starto);
                                        var code = arrData[i].slice(starto+1,endo);
                                        code = code.replace(/'/g, ""); //去除字符串中出现的所有单引号
                                        code = code.replace(/^\s*|\s*$/g,""); //去除字符串内两头的空格
                                        //debugger
                                        ////console.log("code",code);
                                        this.UserReviewVoteUp(code); //点赞
                                        await sleep(50); //延迟0.01秒
                                        continue;
                                }
                                
                                var j = arrData[i].indexOf(this.captureUp); //VoteUp
                                if(j>0)
                                {
                                        var startj = arrData[i].indexOf('(',j);
                                        var endj = arrData[i].indexOf(')',startj);
                                        var code = arrData[i].slice(startj+1,endj);
                                        //console.log("code",code);
                                        //debugger
                                        if(code.indexOf(',') == -1) //如果不是组点赞则继续点赞，否则继续往后面执行
                                        {
                                                this.VoteUp(parseInt(code)); //点赞
                                                await sleep(50); //延迟0.01秒
                                                continue;
                                        }
                                }
                                
                                var getCode = (m)=>{
                                        var startm = arrData[i].indexOf('(',m);
                                        var endm = arrData[i].indexOf(')',startm);
                                        var code = arrData[i].slice(startm+1,endm);
                                        ////console.log("code",code);
                                        
                                        var iId = arrData[i].indexOf('id',endm);
                                        var startId = arrData[i].indexOf('"',iId);
                                        var endId = arrData[i].indexOf('"',startId+1);
                                        var idValue = arrData[i].slice(startId+1,endId);
                                        //console.log("idValue",idValue);
                                        if(idValue.indexOf('Up') != -1){
                                                
                                                return [true,code];
                                        }
                                        else if(idValue.indexOf('Down') != -1){
                                                return [false,code];
                                        }
                                        else{
                                                console.log("组点赞出错!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                        }
                                }
                                
                                var m = arrData[i].indexOf(this.groupNotificationUp); //RateAnnouncement
                                if(m>0)
                                {
                                        //查找设置
                                        var ret = getCode(m);
                                        //debugger
                                        if(ret[0]==true){
                                                this.RateAnnouncement(ret[1]); //点赞
                                                await sleep(50); //延迟0.01秒
                                        }
                                        else{
                                                this.RateAnnouncement(ret[1]); //踩
                                                await sleep(50); //延迟0.01秒
                                        }
                                        continue;
                                }
                                
                        }
                        //debugger
                        url = nextLoadURL;
                        //console.log(url,"点赞完毕! 加载下一个url:", nextLoadURL);
                        var index = url.indexOf("?start=")+1;
                        var endindex = url.indexOf("&",index);
                        if(endindex == -1)
                                endindex = url.length;
                        var time = url.slice(index + "?start".length,endindex);
                        time = parseInt(time);
                        var date = new Date(time*1000);
                        var year = date.getFullYear();
                        var mon = date.getMonth()+1;
                        var day = date.getDate();
                        var hours = date.getHours();
                        var minu = date.getMinutes();
                        var sec = date.getSeconds();
                        //if(mon<10) mon = "0"+mon;
                        //if(day<10) day = "0"+day;
                        //if(hours<10) hours = "0"+hours;
                        //if(minu<10) minu = "0"+minu;
                        //if(sec<10) sec = "0"+sec;
                        var str = year+'-'+mon+'-'+day+' '+hours+':'+minu+':'+sec; //year+"年"+mon+"月"+day +"日"+hours +"时"+minu +"分"+sec+"秒" //date.toLocaleString()
                        console.log(url,"点赞完毕! 下一次点赞的内容时间是:", str + " startoffset:",url.slice(url.lastIndexOf("startoffset=") + "startoffset=".length));
                } //while
                var time = url.slice(url.indexOf("=")+1);
                time = parseInt(time);
                var date = new Date(time*1000);
                var year = date.getFullYear();
                var mon = date.getMonth()+1;
                var day = date.getDate();
                var hours = date.getHours();
                var minu = date.getMinutes();
                var sec = date.getSeconds();
                var str = year+'-'+mon+'-'+day+' '+hours+':'+minu+':'+sec;
                
                console.log("点赞完毕! 已将"+ str +"这个时间线之后的动态全部点赞完毕!~");
        }
        Stop(){
                console.log("开始停止点赞...");
                this.isYun = false;
        }
        
        async setfriendActivityOption(){
                var url = this.Url + this.friendActivitOptionUrl;
                jQuery.post(url, {
                        setting: 1,
                        sessionid: g_sessionID,
                        "subscription_option[friendadded]": 1,
                        "subscriptions[friendadded]": 1,
                        "subscription_option[achievementunlocked]": 1,
                        "subscriptions[achievementunlocked]": 1,
                        "subscription_option[receivednewgame]": 1,
                        "subscriptions[receivednewgame]": 1,
                        "subscription_option[joinedgroup]": 1,
                        "subscriptions[joinedgroup]": 1,
                        "subscription_option[createsgroup]": 1,
                        "subscriptions[createsgroup]": 1,
                        "subscription_option[addedgametowishlist]": 1,
                        "subscriptions[addedgametowishlist]": 1,
                        "subscription_option[recommendedgame]": 1,
                        "subscriptions[recommendedgame]": 1,
                        "subscription_option[screenshotpublished]": 1,
                        "subscriptions[screenshotpublished]": 1,
                        "subscription_option[videopublished]": 1,
                        "subscriptions[videopublished]": 1,
                        "subscription_option[filefavorited]": 1,
                        "subscriptions[filefavorited]": 1,
                        "subscription_option[postedannouncement]": 1,
                        "subscriptions[postedannouncement]": 1,
                        "subscription_option[scheduledevent]": 1,
                        "subscriptions[scheduledevent]": 1,
                        "subscription_option[selectednewpotw]": 1,
                        "subscriptions[selectednewpotw]": 1,
                        "subscription_option[promotednewadmin]": 1,
                        "subscriptions[promotednewadmin]": 1,
                        "subscription_option[receivesgroupcomment]": 1,
                        "subscriptions[receivesgroupcomment]": 1,
                        "subscription_option[greenlightannouncement]": 1,
                        "subscriptions[greenlightannouncement]": 1,
                        "subscription_option[workshopannouncement]": 1,
                        "subscriptions[workshopannouncement]": 1,
                        "subscription_option[curatorrecommendations]": 1,
                        "subscriptions[curatorrecommendations]": 1,
                        "subscription_option[followingpublishedugc]": 1,
                        "subscriptions[followingpublishedugc]": 1,
                        "subscription_option[taggedinscreenshot]": 1,
                        "subscriptions[taggedinscreenshot]": 1
                }, function(response) {
                        if (response.success === false) {
                                jQuery("#log_body1")[0].innerHTML +=
                                        "<a style='color:#ff2c85;' target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID +
                                        "\">" + '[' + (i + 1) + '/' + total + '] 设置备注失败了! ' + profileID + '  ' + name +
                                        '&nbsp;&nbsp;&nbsp;&nbsp;' + response.error + "</a><br>";
                        } else {
                                jQuery("#log_body1")[0].innerHTML +=
                                        '[' + (i + 1) + '/' + total + '] ' +
                                        "成功设置备注于 <a target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID + "\">" +
                                        profileID + '  ' + name + "</a>" +
                                        "<a style='color:#FB7299;' target='_blank' href=\"http://steamcommunity.com/profiles/" +
                                        profileID + "\">" + "</a><br>";
                        }
                }).fail(function() {
                        jQuery("#log_body1")[0].innerHTML +=
                                '<span style="color:#DA2626;">[' + (i + 1) + '/' + total + '] ' +
                                "无法设置备注于 <a style='color:#DA2626;' target='_blank' href=\"http://steamcommunity.com/profiles/" +
                                profileID + "\">" +
                                profileID + '  ' + name + "</a></span><br>";
                }).always(function() {
                        jQuery("#log_head1").html("<br><b>当前处理了 " + (i + 1) + "个, 总计 " + total + " 个好友.<b>");
                });
                
        }
        
        setGetActivityInfo(){ //设置动态的内容为指定的数据
                
        }
        setGetActivityAll(){ //设置动态内容为默认(全部)
                
        }
        setFriendActivityInfo(){ //设置指定好友动态为跳过,只给指定好友点赞等等
                
        }
}

class SteamData{
        constructor(arg) {
                this.steamCommunityUrl = "https://steamcommunity.com/";
                this.customUrl = "id/";
                this.profileIDUrl = "profiles/";
                this.commentUrl = "/allcomments"; //GET //https://steamcommunity.com/id/miku-39/allcomments
                this.commentNextUrl = "https://steamcommunity.com/comment/Profile/render/"; //POST //https://steamcommunity.com/comment/Profile/render/76561198373290430/-1/
                // start: 0
                // totalcount: 11596
                // count: 50
                // sessionid: 006825ba8313e097671eb93e
                // feature2: -1
                
                // {
                //      start: 50,
                //      totalcount: 11594,
                //      count: 50,
                //      sessionid: 006825ba8313e097671eb93e,
                //      feature2: -1
                // }
                
                // start: 100
                // totalcount: 11595
                // count: 50
                // sessionid: 006825ba8313e097671eb93e
                // feature2: -1
                
                this.statusUrl = "https://steamcommunity.com/actions/GetNotificationCounts"; //GET
                this.userInfoUrl = "https://steamcommunity.com/miniprofile/"; //GET //https://steamcommunity.com/miniprofile/859694761
        }
        getCommentData(){
                var url = this.steamCommunityUrl + this.customUrl + 'miku-39' + this.commentUrl;
                var currentCommentNum = 0; //当前评论数
                var newCurrentCommentNum = 0; //在获取数据时，又出现了新的当前评论数
                
                for (let i = 0; i < currentCommentNum; i++) {
                        _getCommentPageData(url,i);
                        //解析数据
                        
                        //存储数据
                        
                }
                
        }
        _getCommentPageData(url,nPage){
                var data;
                //获取数据
                
                //解析数据
                
                //完成后
                _updateData();
                return data;
        }
        _updateData(){
                //更新当前评论数
                newCurrentCommentNum = 0;
        }
}

/**
 * steamExtend.js
 * @file 存储对当前steam的功能增强代码 [steam功能拓展]
 */

function addRemoveFriendRemind(){ /*添加删除好友提醒*/
        let obj = document.getElementsByClassName("manage_action btnv6_lightblue_blue btn_medium");
        for (let i = 0; i < obj.length; i++) {
                if(obj[i].onclick == null)
                        continue;
                let funcText = obj[i].onclick.toString();
                if(funcText.indexOf("ExecFriendAction('remove', 'friends/all')") != -1) //是否是移除好友按钮
                {
                        obj[i].onclick = ()=>{
                                ShowConfirmDialog('您点击了移除好友按钮', '是否要移除选择的好友?','移除好友').done( function(){
                                        console.log("移除好友");
                                        ExecFriendAction('remove', 'friends/all');
                                        }).fail( function(){
                                        console.log("取消移除好友");
                                        });
                        }
                        return 1;
                }
        }
        return 0;
}
//-----------------------------------------------------------------------------------
function getLoginStatus(){
        if(g_steamID == false)
                return false; //没有登陆
        else if(typeof g_steamID == "string" && g_steamID.indexOf('7656119')==0)
                return true; //成功登陆
}
//-------------------------------------------------------------------------------------------------------------
function addFriendMultipleSelectionMode(){ //添加好友多选模式
        var key_mode = 0;
        var index_arr = [2];
        index_arr[0] = undefined;
        index_arr[1] = undefined;


        var obj = document.getElementById("search_text_box");
        obj && obj.blur(); //搜索框取消获得的焦点
        
        jQuery("#search_results .selectable").click(function(e) {
                var id = jQuery(this).attr("id"); //id
                var index = jQuery(this).index(); //下标
                //console.log(id,index);//得到点击的a标签的title值
                
                switch (key_mode){
                        case 0:
                                index_arr[0] = index-2;
                                //console.log(index_arr[0]);
                                break;
                        case 1: //~ 反选
                                break;
                        case 2: //alt 重新选择
                                break;
                        case 3: //shift 好友快速多选模式
                                if(index_arr[0] == undefined)
                                        index_arr[0] = index-2;
                                else if(index_arr[0] == index-2){ //同一个元素
                                        
                                }
                                else{
                                        //取消选择文字
                                        document.selection && document.selection.empty && ( document.selection.empty(), 1)
                                        || window.getSelection && window.getSelection().removeAllRanges();
                                        //遍历并选择之间的内容
                                        index_arr[1] = index-2;
                                        var obj = jQuery("#search_results>.selectable");
                                        var arr = obj.slice( index_arr[0],index_arr[1]);
                                        arr.addClass("selected");
                                        for (let i = 0; i < arr.length; i++) {
                                                arr[i].getElementsByClassName("select_friend_checkbox")[0].checked = true; //选中
                                        }
                                        UpdateSelection(); //官方，更新计数
                                        console.log("好友快速多选已完成!",index_arr[0],index_arr[1]);
                                        //index_arr[0] = undefined;
                                        //index_arr[1] = undefined;
                                }
                                break;
                        default:
                                break;
                }
        }); //选择的朋友总数
        
        document.addEventListener("keydown", function(e){ //~ 反选
                //console.log(e.keyCode);
                //console.log(e.shiftKey,e.altKey);
                if(e.keyCode == 192){
                        key_mode = 1;
                        //console.log("~ down");
                        
                        var obj = jQuery("#search_results>.selectable");
                        obj.toggleClass("selected");
                        for (let i = 0; i < obj.length; i++) {
                                var bool = obj[i].getElementsByClassName("select_friend_checkbox")[0].checked;
                                obj[i].getElementsByClassName("select_friend_checkbox")[0].checked = !bool; //全部取消选中
                        }
                        UpdateSelection(); //官方，更新计数
                        console.log("~ 反选");
                        return false;
                }
        }, false);
        //-----------------------------------------------------------------------------------
        shortcut.add("Esc",function() { //alt 重新选择
                key_mode = 2;
                //console.log("Alt");
                
                var obj = jQuery("#search_results>.selectable");
                obj.removeClass("selected");
                for (let i = 0; i < obj.length; i++) {
                        obj[i].getElementsByClassName("select_friend_checkbox")[0].checked = false; //全部取消选中
                }
                UpdateSelection(); //官方，更新计数
                console.log("Esc 重新选择");
        }, {
                'type':'keydown', //事件
                'propagate':false, //是否支持冒泡
                'disable_in_input':false, //是否在输入框内有效
                'target':document, //作用范围
        });
        //-----------------------------------------------------------------------------------
        shortcut.add("Shift",function() { //shift 好友快速多选模式
                key_mode = 3;
                //console.log("Shift");
        }, {
                'type':'keydown', //事件
                'propagate':false, //是否支持冒泡
                'disable_in_input':false, //是否在输入框内有效
                'target':document, //作用范围
        });
        //-----------------------------------------------------------------------------------
        document.addEventListener("keyup", function(e){
                //console.log(e.keyCode);
                //console.log(e.shiftKey,e.altKey);
                if(e.keyCode == 192){
                        key_mode = 0;
                        //console.log("~ UP");
                        return false;
                }
                else if(e.keyCode == 27){
                        key_mode = 0;
                        //console.log("Esc UP");
                        return false;
                }
                else if(e.keyCode == 16){
                        key_mode = 0;
                        //console.log("Shift UP");
                        return false;
                }
        }, false);
}
//-------------------------------------------------------------------------------------------------------------------------------------------------
function getSelectedText() {
    if (window.getSelection) {
      return window.getSelection().toString();
    } else if (document.selection) {
      return document.selection.createRange().text;
    }
    return '';
}

function selectText(element) {
        var text = document.getElementById(element);
        text.focus();
        text.select();
        var selection = window.getSelection();
        return selection.toString();
}

function getDifferentIndex(str1,str2){
        var length =  str1.length < str2.length ? str2.length : str1.length; //取最大长度
        var value; //相差的长度
        if(length == str1.length)
                value= str1.length - str2.length;
        else
                value= str2.length - str1.length;
        
        var i;
        for (i = 0; i < length; i++) {
                if(str1.charCodeAt(i) != str2.charCodeAt(i)) //如果超出范围charCodeAt()返回NaN
                {
                        if(str1.charCodeAt(i) == NaN || str2.charCodeAt(i) == NaN)
                                return i+value; //选择的是末尾，从不一样的位置+不一样的长度
                        else
                                return i; //选择的是中间，两个数不一样，返回不一样的位置
                }
                
        }
        return -1; //没有找到返回-1
}

async function setSelectTextMode(mode){
        var eleName;
        
        const text_format = [{
                        tag_start: "[h1]",
                        tag_end: "[/h1]"
                },{
                        tag_start: "[b]",
                        tag_end: "[/b]"
                },{
                        tag_start: "[u]",
                        tag_end: "[/u]"
                },{
                        tag_start: "[i]",
                        tag_end: "[/i]"
                },{
                        tag_start: "[strike]",
                        tag_end: "[/strike]"
                },{
                        tag_start: "[spoiler]",
                        tag_end: "[/spoiler]"
                },{
                        tag_start: "[noparse]",
                        tag_end: "[/noparse]"
                },{
                        tag_start: "[url=",
                        tag_middle: "]",
                        tag_end: "[/url]"
                }
        ]
        var ele;
                switch (inBoxonblurID){
                        case 0:
                                ele = document.getElementById("comment_textarea");
                                eleName = "comment_textarea";
                                break;
                        case 1:
                                ele = document.getElementById("comment_textarea_en");
                                eleName = "comment_textarea_en";
                                break;
                        case 2:
                                ele = document.getElementById("comment_textarea_jp");
                                eleName = "comment_textarea_jp";
                                break;
                        case 3:
                                ele = document.getElementById("comment_textarea_zhc");
                                eleName = "comment_textarea_zhc";
                                break;
                        case 4:
                                ele = document.getElementById("comment_textarea_zh_sg");
                                eleName = "comment_textarea_zh_sg";
                                break;
                        case 5:
                                ele = document.getElementById("comment_textarea_zh_hant");
                                eleName = "comment_textarea_zh_hant";
                                break;
                        case 6:
                                ele = document.getElementById("comment_textarea_zh_hk");
                                eleName = "comment_textarea_zh_hk";
                                break;
                        case 7:
                                ele = document.getElementById("comment_textarea_zh_mo");
                                eleName = "comment_textarea_zh_mo";
                                break;
                        case 8:
                                ele = document.getElementById("comment_textarea_zh_tw");
                                eleName = "comment_textarea_zh_tw";
                                break;
                        default:
                                break;
                }
                //debugger
        var str = getSelectedText(); //获取选择的文本内容
        var oldText = ele.value; //输入框原来的值  document.activeElement.value
        var selection = window.getSelection();
        var selectionStr = selection.toString(); //为了区分是全选了还是根本就没有选择
        var obj = ele; //当前焦点所在的元素 document.activeElement
        var nSelectionStart;
        var elTextArea;
        if(str == ""){ //是否没有选择任何的文本
                elTextArea = ele; //设置为指定的留言框 document.activeElement
                if (elTextArea) {
                        nSelectionStart = elTextArea.selectionStart;//
                        if(nSelectionStart == undefined) //如果没有输入
                        {
                                nSelectionStart = 0;
                                elTextArea.value = "";
                        }
                    newMess = elTextArea.value.substr(0, nSelectionStart);
                }
        }
        else{
                var iindex = ele.selectionStart; //
                await window.getSelection().deleteFromDocument(); /*删除选择的文本*/
                var newText = selectText(eleName); //输入框现在的值
                if(newText == oldText){
                        //debugger
                        return;
                }
                //debugger
                var index;
                // if(iindex != 0 )//是否在开头(针对于相同的字符)
                //      index = getDifferentIndex(oldText,newText); //getDifferentIndex(oldText,newText); //ele.selectionStart
                // else
                        index = iindex;
                
                console.log("index",index);
                var endIndex = index + str.length;
                
                var newMess = oldText.slice(0,index); //添加开头
        }
        switch (mode){
                case 1:
                        newMess += text_format[0].tag_start + str + text_format[0].tag_end; //处理选择的文本并添加
                        if(selectionStr == "" && selection.toString() == ""){ //为了区分是全选了还是根本就没有选择
                                elTextArea.selectionStart = nSelectionStart + (text_format[0].tag_start + str + text_format[0].tag_end).length;
                        }
                        break;
                case 2:
                        newMess += text_format[1].tag_start + str + text_format[1].tag_end; //处理选择的文本并添加
                        if(selectionStr == "" && selection.toString() == ""){
                                elTextArea.selectionStart = nSelectionStart + (text_format[1].tag_start + str + text_format[1].tag_end).length;
                        }
                        break;
                case 3:
                        newMess += text_format[2].tag_start + str + text_format[2].tag_end; //处理选择的文本并添加
                        if(selectionStr == "" && selection.toString() == ""){
                                elTextArea.selectionStart = nSelectionStart + (text_format[2].tag_start + str + text_format[2].tag_end).length;
                        }
                        break;
                case 4:
                        newMess += text_format[3].tag_start + str + text_format[3].tag_end; //处理选择的文本并添加
                        if(selectionStr == "" && selection.toString() == ""){
                                elTextArea.selectionStart = nSelectionStart + (text_format[3].tag_start + str + text_format[3].tag_end).length
                        }
                        break;
                case 5:
                        newMess += text_format[4].tag_start + str + text_format[4].tag_end; //处理选择的文本并添加
                        if(selectionStr == "" && selection.toString() == ""){
                                elTextArea.selectionStart = nSelectionStart + (text_format[4].tag_start + str + text_format[4].tag_end).length;
                        }
                        break;
                case 6:
                        newMess += text_format[5].tag_start + str + text_format[5].tag_end; //处理选择的文本并添加
                        if(selectionStr == "" && selection.toString() == ""){
                                elTextArea.selectionStart = nSelectionStart + (text_format[5].tag_start + str + text_format[5].tag_end).length;
                        }
                        break;
                case 7:
                        newMess += text_format[6].tag_start + str + text_format[6].tag_end; //处理选择的文本并添加
                        if(selectionStr == "" && selection.toString() == ""){
                                elTextArea.selectionStart = nSelectionStart + (text_format[6].tag_start + str + text_format[6].tag_end).length;
                        }
                        break;
                case 8:
                        newMess += text_format[7].tag_start + text_format[7].tag_middle + str + text_format[7].tag_end; //处理选择的文本并添加
                        if(selectionStr == "" && selection.toString() == ""){
                                elTextArea.selectionStart = nSelectionStart + (text_format[7].tag_start + str + text_format[7].tag_end).length;
                        }
                        break;
                default:
                        break;
        }
        if(selectionStr == "" && selection.toString() == ""){ //是否没有选择任何的文本
                newMess += elTextArea.value.substr(nSelectionStart)
        }
        else{
                newMess += oldText.slice(endIndex); //添加结尾
        }
        obj.value = newMess; //重新赋值给输入框
        obj.focus(); //获取焦点，如果不在视野里，会把镜头拉过去
}
//setSelectTextMode(1)
//-------------------------------------------------------------------------------------------------------------------------------------------------
function add_commentthread_textarea_allSelect(){ //添加留言框全选
        document.addEventListener("mousedown", function(e){
                //console.log(e.button);
                if(e.button == 1){
                        if(document.activeElement.id.indexOf("comment_textarea") != -1){ //当前焦点所在的元素如果是留言框才全选
                                let obj;
                                        switch (inBoxonblurID){
                                                case 0:
                                                        obj = document.getElementById("comment_textarea");
                                                        break;
                                                case 1:
                                                        obj = document.getElementById("comment_textarea_en");
                                                        break;
                                                case 2:
                                                        obj = document.getElementById("comment_textarea_jp");
                                                        break;
                                                case 3:
                                                        obj = document.getElementById("comment_textarea_zhc");
                                                        break;
                                                case 4:
                                                        obj = document.getElementById("comment_textarea_zh_sg");
                                                        break;
                                                case 5:
                                                        obj = document.getElementById("comment_textarea_zh_hant");
                                                        break;
                                                case 6:
                                                        obj = document.getElementById("comment_textarea_zh_hk");
                                                        break;
                                                case 7:
                                                        obj = document.getElementById("comment_textarea_zh_mo");
                                                        break;
                                                case 8:
                                                        obj = document.getElementById("comment_textarea_zh_tw");
                                                        break;
                                                default:
                                                        break;
                                        }
                                        obj.focus();
                                        obj.select();
                                        e.stopPropagation(); 
                                        e.stopImmediatePropagation();
                                        e.preventDefault();
                                return false;
                        }
                        return false;
                }
        }, false);
        
        
        document.addEventListener("keyup", function(e){
                //console.log(e.keyCode);
                //console.log(e.shiftKey,e.altKey);
                if(e.keyCode == 18){ //Alt
                let obj;
                        switch (inBoxonblurID){
                                case 0:
                                        obj = document.getElementById("comment_textarea");
                                        break;
                                case 1:
                                        obj = document.getElementById("comment_textarea_en");
                                        break;
                                case 2:
                                        obj = document.getElementById("comment_textarea_jp");
                                        break;
                                case 3:
                                        obj = document.getElementById("comment_textarea_zhc");
                                        break;
                                case 4:
                                        obj = document.getElementById("comment_textarea_zh_sg");
                                        break;
                                case 5:
                                        obj = document.getElementById("comment_textarea_zh_hant");
                                        break;
                                case 6:
                                        obj = document.getElementById("comment_textarea_zh_hk");
                                        break;
                                case 7:
                                        obj = document.getElementById("comment_textarea_zh_mo");
                                        break;
                                case 8:
                                        obj = document.getElementById("comment_textarea_zh_tw");
                                        break;
                                default:
                                        break;
                        }
                        obj.focus();
                        obj.select();
                        e.stopPropagation(); 
                        e.stopImmediatePropagation();
                        e.preventDefault();
                        //console.log("Alt UP");
                        return false;
                }
        }, false);
}

/**
 * utility.js
 */

function _addIDtoHandleLostfocus(){ //添加ID来处理丢失的焦点
                var parentObj = document.getElementById("steamTextStyle").parentNode;
                Obj = parentObj.getElementsByTagName('input');
                for (let i = 0; i < Obj.length; i++) {
                        Obj[i].id = "steamTextStyle_1";
                }
                Obj = parentObj.getElementsByTagName('dl');
                for (let i = 0; i < Obj.length; i++) {
                        Obj[i].id = "steamTextStyle_1";
                }
                Obj = parentObj.getElementsByTagName('dd');
                for (let i = 0; i < Obj.length; i++) {
                        Obj[i].id = "steamTextStyle_1";
                }
}

function registeMenu(){ //注册脚本快捷菜单
        if(g_uiConf.isShow_menu_friend){
                g_arrMenuID[0] = GM_registerMenuCommand("好友列表", function(){
                        window.open("https://steamcommunity.com/my/friends", "_blank");
                });
        }
        if(g_uiConf.isShow_menu_activity){
                g_arrMenuID[1] = GM_registerMenuCommand("动态列表", function(){
                        window.open("https://steamcommunity.com/my/home", "_blank");
                });
        }
        if(g_uiConf.isShow_menu_registerKey){
                g_arrMenuID[2] = GM_registerMenuCommand("激活key", function(){
                        window.open("https://store.steampowered.com/account/registerkey", "_blank");
                });
        }
        if(g_uiConf.isShow_menu_redeemWalletCode){
                g_arrMenuID[3] = GM_registerMenuCommand("充值key", function(){
                        window.open("https://store.steampowered.com/account/redeemwalletcode", "_blank");
                });
        }
        if(g_uiConf.isShow_menu_steamdbFree){
                g_arrMenuID[4] = GM_registerMenuCommand("SteamDB预告", function(){
                        window.open("https://steamdb.info/upcoming/free/", "_blank");
                });
        }
}

function unRegisteMenu(){ //取消注册脚本快捷菜单
        GM_unregisterMenuCommand(g_arrMenuID[0]);
        GM_unregisterMenuCommand(g_arrMenuID[1]);
        GM_unregisterMenuCommand(g_arrMenuID[2]);
        GM_unregisterMenuCommand(g_arrMenuID[3]);
        GM_unregisterMenuCommand(g_arrMenuID[4]);
}


function registeNotification(){ //注册事件完成通知
        var options = {
                text: "文本.",
                title: "标题!",
                image: "https://steamcommunity-a.akamaihd.net/public/shared/images/responsive/share_steam_logo.png",
                ondone: function() {
                        console.log("完成.");
                },
                onclick: function() {
                        console.log("点击.");
                }
        }
        GM_notification(options);
}

function setPageRefreshAndCloseWarn(mode){ //设置页面刷新和关闭警告
        var func_PageRefreshAndCloseWarn = function(event){
                event.returnValue = '当前脚本正在运行中，您确定要离开吗?';
        };
        
        if (mode) {
                window.addEventListener("beforeunload", func_PageRefreshAndCloseWarn, true);
        } else{
                window.removeEventListener("beforeunload", func_PageRefreshAndCloseWarn, true)
        }
}
//setPageRefreshAndCloseWarn(true); //设置页面刷新和关闭警告
//setPageRefreshAndCloseWarn(false); //取消设置页面刷新和关闭警告

function autoSetPageRefreshAndCloseWarn(mode){ //自动判断状态并设置页面刷新和关闭警告
        var func_autoPageRefreshAndCloseWarn = function(event){
                if(g_conf[0].YunStatus == true){
                        if(g_conf[0].isAddYunBreakWarn == true){
                                event.returnValue = '当前脚本正在运行中，您确定要离开吗?';
                        }
                }
        };
        
        if (mode) {
                window.addEventListener("beforeunload", func_autoPageRefreshAndCloseWarn, true);
        } else{
                window.removeEventListener("beforeunload", func_autoPageRefreshAndCloseWarn, true)
        }
}
//autoSetPageRefreshAndCloseWarn(true); //自动判断状态并设置页面刷新和关闭警告
//autoSetPageRefreshAndCloseWarn(false); //取消自动判断状态并设置页面刷新和关闭警告
//-------------------------------------------------------------------------------------------------------------
// API
function getCityCodeByEnglishName(cityEnglishName) {
        if (g_arrCityList == undefined)
                return null;

        for (let i = 0; i < g_arrCityList.length; i++) {
                if (g_arrCityList[i][1].length == cityEnglishName.length &&
                        g_arrCityList[i][1].toLowerCase() == cityEnglishName.toLowerCase()) {
                        return g_arrCityList[i][0];
                }
        }
        return null;
}

function getCityCodeByChinsesName(cityChinseshName) {
        if (g_arrCityList == undefined)
                return null;

        for (let i = 0; i < g_arrCityList.length; i++) {
                if (g_arrCityList[i][3].length == cityChinseshName.length &&
                        g_arrCityList[i][3].toLowerCase() == cityChinseshName.toLowerCase()) {
                        return g_arrCityList[i][0];
                }
        }
        return null;
}

function getCityChinsesNameByEnglishName(cityEnglishName) {
        if (g_arrCityList == undefined)
                return null;

        for (let i = 0; i < g_arrCityList.length; i++) {
                if (g_arrCityList[i][1].length == cityEnglishName.length &&
                        g_arrCityList[i][1].toLowerCase() == cityEnglishName.toLowerCase()) {
                        return g_arrCityList[i][3];
                }
        }
        return null;
}
//-------------------------------------------------------------------------------------------------------------
//RGB
function countRgbColor(r, g, b) //计算RGB渐变颜色
{
        var color;
        //var color = '#' + to2string(r) +  'ffff';
        //console.log(color);
        //return color;
        while (true) {
                switch (RGBindex) {
                        case 0: //红
                                if (RGBr == 0 & RGBg == 0 & RGBb == 0) {
                                        RGBr = 0xFF; //红
                                        color = '#' + to2string(RGBr) + to2string(RGBg) + to2string(RGBb);
                                        //console.log("color:" + color);
                                        return color;
                                } else {
                                        RGBindex = 1;
                                        continue; //重新开始
                                }
                                break;
                        case 1: //红->黄
                                if (RGBg != 0xFF) {
                                        RGBg += 3; //红->黄
                                        color = '#' + to2string(RGBr) + to2string(RGBg) + to2string(RGBb);
                                        //console.log("color:" + color);
                                        return color;
                                } else {
                                        RGBindex = 2;
                                        continue; //重新开始
                                }
                                break;
                        case 2: //黄->绿
                                if (RGBr != 0x00) //黄
                                {
                                        RGBr -= 3; //黄->绿
                                        color = '#' + to2string(RGBr) + to2string(RGBg) + to2string(RGBb);
                                        //console.log("color:" + color);
                                        return color;
                                } else {
                                        RGBindex = 3;
                                        continue; //重新开始
                                }
                                break;
                        case 3: //绿->蓝(天蓝)
                                if (RGBb != 0xFF) {
                                        if (RGBg > 0xBF) {
                                                RGBg -= 3;
                                        }
                                        RGBb += 3;
                                        color = '#' + to2string(RGBr) + to2string(RGBg) + to2string(RGBb);
                                        //console.log("color:" + color);
                                        return color;
                                } else {
                                        RGBindex = 4;
                                        continue; //重新开始
                                }
                                break;
                        case 4: //蓝(天蓝)->蓝(深蓝)
                                if (RGBg != 0x00) {
                                        RGBg -= 3;
                                        color = '#' + to2string(RGBr) + to2string(RGBg) + to2string(RGBb);
                                        //console.log("color:" + color);
                                        return color;
                                } else {
                                        RGBindex = 5;
                                        continue; //重新开始
                                }
                                break;
                        case 5: //蓝(深蓝)->紫
                                if (RGBr < 0x80 || RGBb > 0x80) {
                                        if (RGBr < 0x80) {
                                                RGBr += 3;
                                                color = '#' + to2string(RGBr) + to2string(RGBg) + to2string(RGBb);
                                                //console.log("color:" + color);
                                                return color;
                                        } else if (RGBb > 0x80) {
                                                RGBb -= 3;
                                                color = '#' + to2string(RGBr) + to2string(RGBg) + to2string(RGBb);
                                                //console.log("color:" + color);
                                                return color;
                                        }

                                } else {
                                        RGBindex = 6;
                                        continue; //重新开始
                                }
                                break;
                        case 6: //紫->红
                                if (RGBr != 0xFF || RGBb != 0x00) {
                                        if (RGBr < 0xFF) {
                                                RGBr += 3;
                                                color = '#' + to2string(RGBr) + to2string(RGBg) + to2string(RGBb);
                                                //console.log("color:" + color);
                                                return color;
                                        } else if (RGBb > 0x00) {
                                                RGBb -= 3;
                                                color = '#' + to2string(RGBr) + to2string(RGBg) + to2string(RGBb);
                                                //console.log("color:" + color);
                                                return color;
                                        }

                                } else //继续RGB
                                {
                                        RGBindex = 1;
                                        continue; //重新开始
                                }

                                break;
                        case 7:
                                console.log("end!!!");
                                break;
                        default:
                                console.log("[countRgbColor()-switch(RGBindex):] 未定义异常!")
                                break;
                }
        }
        //红 #FF0000
        //黄 #FFFF00
        //绿 #00FF00
        //蓝 #00BFFF #0000FF
        //紫 #800080

}
// function setRgb() //设置RGB渐变颜色
// {
//      var loginBox = document.getElementById("LoginBaseBox");
//      loginBox.style.background = countRgbColor(0,0,0);
// }
// var tiSysCallback_runRGB = setInterval(function(){runRGB();}, 22); //[启动定时器] 每秒回调函数 // 11 16 22 30
//-------------------------------------------------------------------------------------------------------------
function setBackgroundImg(imgFilePath,type){ //设置背景图片
        if(jQuery("#backgroundIMG")[0] == undefined)
                        jQuery("body").prepend('<div id="backgroundIMG">背景图</div>');
        
        if(type == "img"){
                        var css = "background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('"+ imgFilePath +"') no-repeat fixed;background-size: cover; width: 100%;";
                        //var css = "background: rgba(0,0,0,0) url('"+ imgFilePath +"') no-repeat fixed;background-size: cover; width: 100%;";
                        var other_css = "position: absolute; z-index: -1; height:100%;";
                        var opacity_css = "opacity:1;filter: alpha(opacity=100)";
                        jQuery("#backgroundIMG")[0].style = css + other_css + opacity_css;
                        
                        document.body.style.background = "none"; //去除原背景
                        
                        jQuery(".friends_header_bg")[0].style.background = "none"; //去除 上面那层蓝色背景图片
                        jQuery("#global_header")[0].style.background = "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6))"; //设置 最上面设置黑色区域透明度
                        jQuery(".content")[0].style.background = "none"; //去除 最上面黑色区域
                        
                        var obj = jQuery(".profile_friends.title_bar")[0];
                        if(obj != undefined)
                                obj.style.background = "linear-gradient(rgba(1, 94, 128, 0.6), rgba(1, 94, 128, 0.6))"; //设置 管理好友列表那块的透明度
        }else if(type == "bin"){
                jQuery("#backgroundIMG").attr("src", "data:" + imageType + ";base64," + data);
        }
}

function setBackgroundImgCarousel(arr_img,timeInterval){ //设置背景图片轮播(图片路径,时间间隔)
        //URL()存的图片网络地址 修改背景图  就改这个地址 必须要网络地址噢噢噢(注意这里没有[img][/img]) 壁纸 可以在这找  https://www.enterdesk.com/zhuomianbizhi/dongmankatong/dongmanrenwu/
        
        var x = 0;        //记录当前第几张轮播图
        setBackgroundImg(arr_img[x++],"img");
        setInterval(()=>{
                if (x >= arr_img.length) x = 0;
                setBackgroundImg(arr_img[x++],"img");
        }, timeInterval);
}

async function getNetImgBysourceID(sourceID){
        var data,obj,imgFilePath;
        if(sourceID==0){
                data = await gc_exApis.getDataByApiList(1,0,"json");
                if(data.indexOf('{')!=0){
                        console.log("服务器返回了错误的数据，尝试重新请求: "+ data);
                        return getNetImgBysourceID(sourceID);
                }
                obj = JSON.parse(data); //JSON处理并解析到js对象
                if(obj.code == 200){
                        imgFilePath = obj.imgurl;
                }
        }
        else if(sourceID==1){
                data = await gc_exApis.getDataByApiList(2,0,"json");
                if(data.indexOf('{')!=0){
                        console.log("服务器返回了错误的数据，尝试重新请求: "+ data);
                        return getNetImgBysourceID(sourceID);
                }
                obj = JSON.parse(data); //JSON处理并解析到js对象
                if(obj.code == 200){
                        imgFilePath = obj.imgurl;
                }
        }
        return imgFilePath;
}

async function binImgDatatoBase64(res){ //二进制图片数据转base64编码后直接显示
        var arr = res.responseHeaders.split('\r\n');
        var arr1 = [];
        for (let i = 0; i < arr.length; i++) {
                var str1 = arr[i].slice(0,arr[i].indexOf(':'));
                var str2 = arr[i].slice(arr[i].indexOf(':') +1);
                arr1.push([str1,str2]);
        }
        
        var getResponseHeader = (name)=>{
                for (let i = 0; i < arr1.length; i++) {
                        if(arr1[i][0] == name){
                                return arr1[i][1];
                        }
                }
        };
        
        var imageType = getResponseHeader("content-type");
        var blob = new Blob([res.response], { type: imageType });
        var reader = new FileReader();
        var imgBase64 = reader.readAsDataURL(blob);
        reader.addEventListener("load", function () {
                console.log(reader.result);
                setBackgroundImg(reader.result,"img");
        }, false);
        var imageUrl = (window.URL || window.webkitURL).createObjectURL(blob);
        
        
        //setBackgroundImg(imageUrl,"img");
        
        // var uInt8Array = new Uint8Array(res.response);
        // var i = uInt8Array.length;
        // var binaryString = new Array(i);
        // while (i--) {
        //     binaryString[i] = String.fromCharCode(uInt8Array[i]);
        // }
        // var data = binaryString.join('');
        // debugger
        // var imageType = res.getResponseHeader("Content-Type");
        
        //setBackgroundImg(imgFilePath,"bin");
}

async function binImgDatatoBlob(){ //二进制图片数据转Blob对象
        
}


async function autoGetImgAndSetBackgroundImg(sourceID,mode,timeInterval,maxImgNumber){ //来源id, 模式:true轮播,false不轮播, 时间间隔(不轮播就无效), 最大图片轮播数量(不轮播就无效)
        var arr_img = [];
        var imgFilePath;
        
        if(mode == true){
                imgFilePath = await getNetImgBysourceID(sourceID);
                arr_img[0] = imgFilePath;
                
                if(maxImgNumber > 0){
                        setTimeout(async()=>{
                                for (let i = 0; i < maxImgNumbers; i++) {
                                        imgFilePath = await getNetImgBysourceID(sourceID);
                                        arr_img.push(imgFilePath)
                                }
                        }, 0);
                        setBackgroundImgCarousel(arr_img,timeInterval);
                }else{
                        setBackgroundImg(imgFilePath,"img");
                        setInterval(async()=>{
                                        imgFilePath = await getNetImgBysourceID(sourceID);
                                        setBackgroundImg(imgFilePath,"img");
                        }, timeInterval);
                }
        }else if(mode == false){
                imgFilePath = await getNetImgBysourceID(sourceID);
                //var jsData = await getResourceByURL(imgFilePath,false);
                //binImgDatatoBase64(jsData);
                setBackgroundImg(imgFilePath,"img");
        }
        //gc_exApis.getDataByApiList(0);
        //gc_exApis.getDataByApiList(1,0,"json");
        //gc_exApis.getDataByApiList(1,0);
        //gc_exApis.getDataByApiList(2,0,"json");
        //gc_exApis.getDataByApiList(2,0);
        //gc_exApis.getDataByApiList(2,1,"二维码文本");
        //gc_exApis.getDataByApiList(3,0,"","Miku");
        //gc_exApis.getDataByApiList(3,1,"","Miku");
        //gc_exApis.getDataByApiList(3,2,"","Miku");
        //gc_exApis.getDataByApiList(3,3,"","Miku");
        //gc_exApis.getDataByApiList(4,0);
        //gc_exApis.getDataByApiList(4,1,1);
        //gc_exApis.getDataByApiList(4,2,"Miku");
        //gc_exApis.getDataByApiList(4,3);
        //gc_exApis.getDataByApiList(4,4);
}

//-------------------------------------------------------------------------------------------------------------

function downFile(type,data,fileName) {
        var elementA = document.createElement('a');
        
        if(type == "json") //json对象
                elementA.setAttribute('href', 'data:text/plain;charset=utf-8,' + JSON.stringify(data));
        else if(type == "text") //文本
                elementA.setAttribute('href', 'data:text/plain;charset=utf-8,' + data);
        else if(type == "bin") //二进制数据
                elementA.setAttribute('href', 'data:text/plain;charset=utf-8,' + data);
        else{
                alert("不支持的数据类型!!");
                elementA.setAttribute('href', 'data:text/plain;charset=utf-8,' + data);
        }
        //if(fileName == undefined) fileName = new Date();
        elementA.setAttribute('download', + new Date() + ".data");
        elementA.style.display = 'none';
        document.body.appendChild(elementA);
        elementA.click();
        document.body.removeChild(elementA);
}
//downFile("json",g_conf,"SteamAssistant");

//设置透明 https://www.52pojie.cn/thread-763424-1-1.html
//background: rgba(229, 241, 240,0);
//background: transparent;
//-------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------

/**
 */
class multiLanguage{
        constructor(arg) {
                this.l_en = 'en_GB';
                this.l_cn = 'zh_CN';
                this.l_tw = 'zh_TW';
                this.l_jp = 'jp_JP';
                this.l_auto = 'auto_detected';
        }
        /**
         * 初始化
         */
        init(){
                jQuery('#selectLanguageDropdown').localizationTool(languagesList_mainUI_html); //初始化
                this.readConfig(); //读取当前语言配置
        }
        /**
         * 读取当前语言配置
         */
        readConfig(){
                if(g_conf[0].language == "auto_detected"){
                        this.setAutoDetected();
                }
                else{
                        jQuery('#selectLanguageDropdown').localizationTool('translate',g_conf[0].language);
                }
        }
        /**
         * 保存当前语言配置
         */
        saveConfig(lang){
                g_conf[0].language = lang;
        }
        /**
         * 设置为自动检测
         */
        setAutoDetected(){
                var arrLang = navigator.languages;
                for (let i = 0; i < arrLang.length; i++) {
                        
                        if(arrLang[i].indexOf('en') != -1){ //英语系 "en-US", "en"等变种语言
                                jQuery('#selectLanguageDropdown').localizationTool('translate',this.l_en);
                                return true;
                        }
                        
                        switch (arrLang[i]){
                                case "zh-CN": //简体
                                        jQuery('#selectLanguageDropdown').localizationTool('translate',this.l_cn);
                                        return true;
                                        break;
                                case "zh-TW": //繁体
                                        jQuery('#selectLanguageDropdown').localizationTool('translate',this.l_tw);
                                        return true;
                                        break;
                                case "ja": //日语
                                        jQuery('#selectLanguageDropdown').localizationTool('translate',this.l_jp);
                                        return true;
                                        break;
                        }
                }
                jQuery('#selectLanguageDropdown').localizationTool('translate',this.l_en);
                return false;
        }
        
}
/**
 * ui.js
 */

//UI处理逻辑:
//您的好友                  普通UI                添加将选择的玩家添加到指定分组的选项
//添加好友                                  不处理
//待处理邀请                       精简版普通UI-1     添加将选择的玩家添加到指定分组的选项
//已屏蔽                             精简版普通UI-2
//直播版主                          版主UI
//关注的玩家                       精简版普通UI-0     添加将选择的玩家添加到指定分组的选项
//关注的游戏...                            不处理，因为会覆盖当前页面
//您的组                             组留言UI-1                   添加将选择的组添加到指定分组的选项
//待处理邀请                       组留言UI-2                   添加将选择的组添加到指定分组的选项
//查找组...                                  不处理，因为会覆盖当前页面
//创建组...                                  不处理，因为会覆盖当前页面

/**
 * @class
 * @classdesc UI类
 * @abstract 必须在继承的子类中实现
 */
class UI {
        constructor(arg) {
                this.loadProgress = 0; //加载进度
                this.isDomLoaded = false; //dom是否加载完毕
                registeMenu(); //注册脚本快捷菜单
                //registeNotification(); //注册事件完成通知
                if(gc_multiLanguage == null) gc_multiLanguage = new multiLanguage();      //多语言支持
        }
        
        showLoadUI(){ //
                
                addNewStyle('styles_loading',load_cssCode);
                
                var obj = document.getElementsByClassName("v6 game_bg responsive_page")[0]; //body
                var objElement = document.createElement('div');
                objElement.id="loadingUI" //<div id="loadingUI">\ //</div>
                objElement.style = loadUI_css;
                objElement.innerHTML = loadUI_Html;
                obj.appendChild(objElement);
                console.log("showLoadUI()");
        }
        
        loadTextChange(mode){ //改变当前加载进度
                if(this.isDomLoaded == false){
                        this.loadProgress++;
                }
                else{
                        var obj = document.getElementsByClassName('how-to')[0];
                        obj.innerText = "正在加载资源中，已完成"+ (++this.loadProgress) + "/10，请您耐心等待...";
                }
        }
        
        remoreLoadUI(){ //移除加载UI和css
        
                if((()=>{
                        var obj = document.getElementsByClassName("v6 game_bg responsive_page")[0]; //body
                        var objChildNodes = obj.childNodes; //childNodes
                        for (let i = 0; i < objChildNodes.length; i++) {
                                if(objChildNodes[i].id == "loadingUI"){
                                        obj.removeChild(objChildNodes[i]); //移除加载UI
                                        return true;
                                }
                        }
                        return false;
                })() == false){
                        console.log("移除加载UI失败~!");
                        return false;
                }
                
                if((()=>{
                        var obj = document.getElementsByTagName("head")[0]; //head
                        var objChildNodes = obj.childNodes; //childNodes
                        for (let i = 0; i < objChildNodes.length; i++) {
                                if(objChildNodes[i].id == "styles_loading"){
                                        obj.removeChild(objChildNodes[i]); //移除css
                                        return true;
                                }
                        }
                        return false;
                })() == false){
                        console.log("移除css失败~!");
                        return false;
                }
                
                return true;
        }
                // 添加留言高级设置UI
                // 设置多个留言框按顺序留言+++
                // 设置多次留言
                // 设置留言优先级
                // 设置简单留言自动回复和特殊留言提醒功能
        
        async initUI(type) { //type: true: 第一次加载, false: 再加载
                
                (async()=>{
                        await autoGetImgAndSetBackgroundImg(0,false,5000,0); //加载背景图片
                })();
                
                jQuery(".icon_item.icon_all_friends")[0].style.color ="#66ccff"; //您的好友
                jQuery(".icon_item.icon_blocked_friends")[0].style.color ="#66ccff"; //已屏蔽
                jQuery(".icon_item.icon_all_friends")[1].style.color ="#66ccff"; //直播版主
                jQuery(".icon_item.icon_all_following")[0].style.color ="#66ccff"; //关注的玩家
                jQuery(".icon_item.icon_all_groups")[0].style.color ="#66ccff"; //您的组     
                
        }
        async createUI() {
                //好友数据统计里的置顶和是否锁定的模板
                jQuery("#manage_friends").after(mainUI_template);
        }
        
        async reCreateUI(){
                if(await gc_menu_friends_ui.initUI(false) != false){
                        await gc_menu_friends_ui.createUI();
                }
        }
        f
        async private_saveUIConfFile() {
        
        }
        async private_readUIConfFile() {
        
        }
}


var isReCreateUi = ()=>{ //是否重新创建Ui(url正则表达式,回调函数)
                                var url = window.location.origin + window.location.pathname; //window.location.href //去除参数和锚点后的url
                                var _fn = ()=>{
                                        _ySelects(jQuery);
                                        g_conf[0].YunStatus = false; /*当前运行状态(比如正在留言中之类的就是正在运行)*/
                                        g_conf[0].isTranslationText = false; /*是否进行了翻译*/
                                        g_conf[0].isWarnInfo = false; /*是否出现警告信息(如果没有则不需要清空)*/
                                        g_conf[0].isCommentRunStatus = false; /*是否正在留言*/
                                        g_conf[0].isNationalityRunStatus = false; /*是否正在设置国籍*/
                                        g_conf[0].isNoCommentRunStatus = false; /*是否正在设置不留言*/
                                        g_conf[0].isTimeIntervalRunStatus = false; /*是否正在设置留言时间间隔*/
                                        g_conf[0].isAutoCommentRunStatus = false; /*是否正在设置自动留言计划*/
                                        g_conf[0].isFriendToGroupRunStatus = false; /*是否正在设置好友分组*/
                                };
                                //https://steamcommunity.com/id/miku-39/friends?l=english#state_online => https://steamcommunity.com/id/miku-39/friends
                                if(URLs.g_friendUrlRegExp.test(url)){
                                        _fn();
                                        console.log("重新构建UI-您的好友.");
                                        gc_menu_friends_ui && typeof gc_menu_friends_ui.reCreateUI === 'function' && gc_menu_friends_ui.reCreateUI(); //调用回调
                                }
                                
                                else if(URLs.g_otherUrlRegExp1_1.test(url)){
                                        _fn();
                                        console.log("不处理-添加好友.");
                                        //不处理
                                        return;
                                }
                                else if(URLs.g_otherUrlRegExp1_2.test(url)){
                                        _fn();
                                        console.log("不处理-好友待处理邀请.");
                                        //暂时 不处理
                                        return;
                                }
                                else if(URLs.g_otherUrlRegExp1_3.test(url)){
                                        _fn();
                                        console.log("重新构建UI-已屏蔽.");
                                        gc_menu_shielding_ui && typeof gc_menu_shielding_ui.reCreateUI === 'function' && gc_menu_shielding_ui.reCreateUI(); //调用回调
                                        return;
                                }
                                else if(URLs.g_otherUrlRegExp1_4.test(url)){
                                        _fn();
                                        console.log("不处理-近期共同游戏的玩家.");
                                        //暂时 不处理
                                        return;
                                }
                                else if(URLs.g_otherUrlRegExp1_5.test(url)){
                                        _fn();
                                        console.log("重新构建UI-直播版主.");
                                        gc_menu_liveAdmin_ui && typeof gc_menu_liveAdmin_ui.reCreateUI === 'function' && gc_menu_liveAdmin_ui.reCreateUI(); //调用回调
                                        return;
                                }
                                
                                else if(URLs.g_otherUrlRegExp2_1.test(url)){
                                        _fn();
                                        console.log("重新构建UI-关注的玩家.");
                                        gc_menu_following_Players_ui && typeof gc_menu_following_Players_ui.reCreateUI === 'function' && gc_menu_following_Players_ui.reCreateUI(); //调用回调
                                        return;
                                }
                                else if(URLs.g_otherUrlRegExp2_2.test(url)){
                                        //_fn();
                                        //console.log("重新构建UI-您的组.");
                                        window.location.reload(true); //重新加载当前页面
                                        //gc_menu_groups_ui && typeof gc_menu_groups_ui.reCreateUI === 'function' && gc_menu_groups_ui.reCreateUI(); //调用回调
                                        return;
                                }
                                else if(URLs.g_otherUrlRegExp2_3.test(url)){
                                        _fn();
                                        console.log("不处理UI-组待处理邀请!");
                                        //window.location.reload(true); //重新加载当前页面
                                        //暂时 不处理
                                        return;
                                }
                                
                                // else if(URLs.g_otherUrlRegExp3.test(url)){
                                //      console.log("重新构建UI-您的好友.");
                                //      gc_menu_friends_ui && typeof gc_menu_friends_ui.reCreateUI === 'function' && gc_menu_friends_ui.reCreateUI(); //调用回调
                                // }
                        };

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
/**
 * UI类 - 您的好友 模块 UI具体实现
 * @class
 * @classdesc UI类 - 您的好友 模块 UI具体实现
 * @extends UI
 */
class menu_friends_ui extends UI {
        constructor(arg) {
                super();
        }
        
        async initUI(type) { //type: true: 第一次加载, false: 再加载
        
                super.initUI();
        
                // 设置数据库
                // var db = new DB();
                // db.Test();
                // db.initAndCreateNewDBInstance({
                //      driver: [localforage.WEBSQL,
                //                      localforage.INDEXEDDB,
                //                      localforage.LOCALSTORAGE],
                //      name: 'Steam assistant-Conf',
                //      size: 10485760 //10mb
                // });
                
                g_db = new DB({ //设置
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Conf',
                        size: 10485760 //10mb
                },true);
                
                g_db1 = new DB({ //拓展功能
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Expand',
                        size: 10485760 //10mb
                },false);
                
                g_db2 = new DB({ //动态助手
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Activity',
                        size: 1073741824 //1gb
                },false);
                
                g_db3 = new DB({ //数据分析
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Friend',
                        size: 1073741824 //1gb
                },false);
                
                g_db4 = new DB({ //留言设置
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Comment',
                        size: 104857600 //100mb
                },false);
                
                await g_db.Write('g_conf',g_conf); //写入
                await g_db.Write('g_uiConf',g_uiConf); //写入
                //debugger
                //var data = await g_db.getAllKeyName();
                //console.log("data",data);
                //var data = await g_db.getKeyNameByIndex(1);
                //console.log("data",data);
                //var data = await g_db.getLength();
                //console.log("data",data);
                
                var data = await g_db.Read('g_conf'); //读取
                console.log("data",data);
                var data = await g_db.Read('g_uiConf'); //读取
                console.log("data",data);
                //var data = await g_db.ReadAll(); //读取所有数据
                //console.log("data",data);
                //await g_db.Remove('g_conf'); //删除数据
                //var data = await g_db.ReadAll(); //读取所有数据
                //console.log("data",data);
                //await g_db.RemoveAll(); //删除所有数据
                //var data = await g_db.ReadAll(); //读取所有数据
                //console.log("data",data);
                //if(data.length == 0){
                //      console.log("没有数据!");
                //}
                
                if(getLoginStatus() == false){ //判断是否登录，如果没有登录则不需要继续运行
                        layer.alert('请先登录Steam，才能继续使用哦~', {icon: 0},function(index){
                                if(g_conf[0].autoLogin == 1){
                                        var obj = document.getElementsByClassName("global_action_link");
                                        for (let i = 0; i < obj.length; i++) {
                                                if(obj[i].className == "global_action_link"){
                                                        obj[i].click(); //跳转到登录页面
                                                }
                                        }
                                }
                        });
                        return false;
                }
                
                readConfInfo(g_steamID); //读取已保存的对应配置信息
                
                if(type){ //第一次加载才需要监听这些事件
                        
                        //1.监听url中的hash变化  //window.location.hash='state_online'  =>  https://steamcommunity.com/id/miku-39/friends#state_online //页面不刷新,url改变,定位到指定锚点
                        window.addEventListener('hashchange',function(event){
                                console.log("1.监听url中的hash变化" + event);
                                isReCreateUi(); //是否重新创建Ui
                        });
                        //2.监听通过history来改变url的事件 //浏览器前进，后退等
                        window.addEventListener('popstate', function(event) {
                                console.log("2.监听通过history来改变url的事件" + event);
                                isReCreateUi(); //是否重新创建Ui
                        });
                        //3.监听pushState和replaceState行为 //pushState可以监听到本页替换超链接
                        var _wr = function(type) {
                                var orig = history[type];
                                return function() {
                                        var rv = orig.apply(this, arguments);
                                        var e = new Event(type);
                                        e.arguments = arguments;
                                        window.dispatchEvent(e);
                                        return rv;
                                };
                        };
                        history.pushState = _wr('pushState');
                        history.replaceState = _wr('replaceState');
                        
                        window.addEventListener('replaceState', function(e) {
                                console.log('监听到replaceState!');
                                isReCreateUi(); //是否重新创建Ui
                        });
                        window.addEventListener('pushState', function(e) {
                                console.log('监听到pushState!');
                                var url = window.location.origin + window.location.pathname; //window.location.href //去除参数和锚点后的url 
                                //https://steamcommunity.com/id/miku-39/friends?l=english#state_online => https://steamcommunity.com/id/miku-39/friends
                                isReCreateUi(); //是否重新创建Ui
                        });
                }
                
        }
        async createUI() {
                super.createUI();
                
                //正常html代码
                jQuery("#manage_friends").after(mainUI_html);
                
                if(g_uiConf.isShowQuickNavigationBar){ //是否显示快速导航栏
                        //快捷导航栏
                        jQuery(".responsive_page_template_content").after(ExpandUI_QuickNavigationBar_html);
                }
                
                gc_multiLanguage.init(); //初始化多语言支持
                
                UI.prototype.uiHandler(); //UI与UI事件等相关的处理程序
        }
        
        async reCreateUI(){
                if(await gc_menu_friends_ui.initUI(false) != false){
                        await gc_menu_friends_ui.createUI();
                }
        }
        
        async private_saveUIConfFile() {
        
        }
        async private_readUIConfFile() {
        
        }
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
/**
 * UI类 - 待处理邀请 模块 UI具体实现
 * @class
 * @classdesc UI类 - 待处理邀请 模块 UI具体实现
 * @extends UI
 */
class menu_friends_invite_ui extends UI {
        constructor(arg) {
                super();
        }
        
        async initUI(type) { //type: true: 第一次加载, false: 再加载
        
                super.initUI();
        
                // 设置数据库
                // var db = new DB();
                // db.Test();
                // db.initAndCreateNewDBInstance({
                //      driver: [localforage.WEBSQL,
                //                      localforage.INDEXEDDB,
                //                      localforage.LOCALSTORAGE],
                //      name: 'Steam assistant-Conf',
                //      size: 10485760 //10mb
                // });
                
                g_db = new DB({ //设置
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Conf',
                        size: 10485760 //10mb
                },true);
                
                g_db1 = new DB({ //拓展功能
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Expand',
                        size: 10485760 //10mb
                },false);
                
                g_db2 = new DB({ //动态助手
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Activity',
                        size: 1073741824 //1gb
                },false);
                
                g_db3 = new DB({ //数据分析
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Friend',
                        size: 1073741824 //1gb
                },false);
                
                g_db4 = new DB({ //留言设置
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Comment',
                        size: 104857600 //100mb
                },false);
                
                await g_db.Write('g_conf',g_conf); //写入
                await g_db.Write('g_uiConf',g_uiConf); //写入
                //debugger
                //var data = await g_db.getAllKeyName();
                //console.log("data",data);
                //var data = await g_db.getKeyNameByIndex(1);
                //console.log("data",data);
                //var data = await g_db.getLength();
                //console.log("data",data);
                
                var data = await g_db.Read('g_conf'); //读取
                console.log("data",data);
                var data = await g_db.Read('g_uiConf'); //读取
                console.log("data",data);
                //var data = await g_db.ReadAll(); //读取所有数据
                //console.log("data",data);
                //await g_db.Remove('g_conf'); //删除数据
                //var data = await g_db.ReadAll(); //读取所有数据
                //console.log("data",data);
                //await g_db.RemoveAll(); //删除所有数据
                //var data = await g_db.ReadAll(); //读取所有数据
                //console.log("data",data);
                //if(data.length == 0){
                //      console.log("没有数据!");
                //}
                
                if(getLoginStatus() == false){ //判断是否登录，如果没有登录则不需要继续运行
                        layer.alert('请先登录Steam，才能继续使用哦~', {icon: 0},function(index){
                                if(g_conf[0].autoLogin == 1){
                                        var obj = document.getElementsByClassName("global_action_link");
                                        for (let i = 0; i < obj.length; i++) {
                                                if(obj[i].className == "global_action_link"){
                                                        obj[i].click(); //跳转到登录页面
                                                }
                                        }
                                }
                        });
                        return false;
                }
                
                readConfInfo(g_steamID); //读取已保存的对应配置信息
                
                if(type){ //第一次加载才需要监听这些事件
                        
                        //1.监听url中的hash变化  //window.location.hash='state_online'  =>  https://steamcommunity.com/id/miku-39/friends#state_online //页面不刷新,url改变,定位到指定锚点
                        window.addEventListener('hashchange',function(event){
                                console.log("1.监听url中的hash变化" + event);
                                isReCreateUi(); //是否重新创建Ui
                        });
                        //2.监听通过history来改变url的事件 //浏览器前进，后退等
                        window.addEventListener('popstate', function(event) {
                                console.log("2.监听通过history来改变url的事件" + event);
                                isReCreateUi(); //是否重新创建Ui
                        });
                        //3.监听pushState和replaceState行为 //pushState可以监听到本页替换超链接
                        var _wr = function(type) {
                                var orig = history[type];
                                return function() {
                                        var rv = orig.apply(this, arguments);
                                        var e = new Event(type);
                                        e.arguments = arguments;
                                        window.dispatchEvent(e);
                                        return rv;
                                };
                        };
                        history.pushState = _wr('pushState');
                        history.replaceState = _wr('replaceState');
                        
                        window.addEventListener('replaceState', function(e) {
                                console.log('监听到replaceState!');
                                isReCreateUi(); //是否重新创建Ui
                        });
                        window.addEventListener('pushState', function(e) {
                                console.log('监听到pushState!');
                                var url = window.location.origin + window.location.pathname; //window.location.href //去除参数和锚点后的url 
                                //https://steamcommunity.com/id/miku-39/friends?l=english#state_online => https://steamcommunity.com/id/miku-39/friends
                                isReCreateUi(); //是否重新创建Ui
                        });
                }
                
        }
        async createUI() {
                super.createUI();
                
                //正常html代码
                jQuery("#manage_friends").after(mainUI_html);
                
                if(g_uiConf.isShowQuickNavigationBar){ //是否显示快速导航栏
                        //快捷导航栏
                        jQuery(".responsive_page_template_content").after(ExpandUI_QuickNavigationBar_html);
                }
                UI.prototype.uiHandler(); //UI与UI事件等相关的处理程序
        }
        
        async reCreateUI(){
                if(await gc_menu_friends_invite_ui.initUI(false) != false){
                        await gc_menu_friends_invite_ui.createUI();
                }
        }
        
        async private_saveUIConfFile() {
        
        }
        async private_readUIConfFile() {
        
        }
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
/**
 * UI类 - 已屏蔽 模块 UI具体实现
 * @class
 * @classdesc UI类 - 已屏蔽 模块 UI具体实现
 * @extends UI
 */
class menu_shielding_ui extends UI {
        constructor(arg) {
                super();
        }
        
        async initUI(type) { //type: true: 第一次加载, false: 再加载
        
                super.initUI();
        
                // 设置数据库
                // var db = new DB();
                // db.Test();
                // db.initAndCreateNewDBInstance({
                //      driver: [localforage.WEBSQL,
                //                      localforage.INDEXEDDB,
                //                      localforage.LOCALSTORAGE],
                //      name: 'Steam assistant-Conf',
                //      size: 10485760 //10mb
                // });
                
                g_db = new DB({ //设置
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Conf',
                        size: 10485760 //10mb
                },true);
                
                g_db1 = new DB({ //拓展功能
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Expand',
                        size: 10485760 //10mb
                },false);
                
                g_db2 = new DB({ //动态助手
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Activity',
                        size: 1073741824 //1gb
                },false);
                
                g_db3 = new DB({ //数据分析
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Friend',
                        size: 1073741824 //1gb
                },false);
                
                g_db4 = new DB({ //留言设置
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Comment',
                        size: 104857600 //100mb
                },false);
                
                await g_db.Write('g_conf',g_conf); //写入
                await g_db.Write('g_uiConf',g_uiConf); //写入
                //debugger
                //var data = await g_db.getAllKeyName();
                //console.log("data",data);
                //var data = await g_db.getKeyNameByIndex(1);
                //console.log("data",data);
                //var data = await g_db.getLength();
                //console.log("data",data);
                
                var data = await g_db.Read('g_conf'); //读取
                console.log("data",data);
                var data = await g_db.Read('g_uiConf'); //读取
                console.log("data",data);
                //var data = await g_db.ReadAll(); //读取所有数据
                //console.log("data",data);
                //await g_db.Remove('g_conf'); //删除数据
                //var data = await g_db.ReadAll(); //读取所有数据
                //console.log("data",data);
                //await g_db.RemoveAll(); //删除所有数据
                //var data = await g_db.ReadAll(); //读取所有数据
                //console.log("data",data);
                //if(data.length == 0){
                //      console.log("没有数据!");
                //}
                
                if(getLoginStatus() == false){ //判断是否登录，如果没有登录则不需要继续运行
                        layer.alert('请先登录Steam，才能继续使用哦~', {icon: 0},function(index){
                                if(g_conf[0].autoLogin == 1){
                                        var obj = document.getElementsByClassName("global_action_link");
                                        for (let i = 0; i < obj.length; i++) {
                                                if(obj[i].className == "global_action_link"){
                                                        obj[i].click(); //跳转到登录页面
                                                }
                                        }
                                }
                        });
                        return false;
                }
                
                readConfInfo(g_steamID); //读取已保存的对应配置信息
                
                if(type){ //第一次加载才需要监听这些事件
                        
                        //1.监听url中的hash变化  //window.location.hash='state_online'  =>  https://steamcommunity.com/id/miku-39/friends#state_online //页面不刷新,url改变,定位到指定锚点
                        window.addEventListener('hashchange',function(event){
                                console.log("1.监听url中的hash变化" + event);
                                isReCreateUi(); //是否重新创建Ui
                        });
                        //2.监听通过history来改变url的事件 //浏览器前进，后退等
                        window.addEventListener('popstate', function(event) {
                                console.log("2.监听通过history来改变url的事件" + event);
                                isReCreateUi(); //是否重新创建Ui
                        });
                        //3.监听pushState和replaceState行为 //pushState可以监听到本页替换超链接
                        var _wr = function(type) {
                                var orig = history[type];
                                return function() {
                                        var rv = orig.apply(this, arguments);
                                        var e = new Event(type);
                                        e.arguments = arguments;
                                        window.dispatchEvent(e);
                                        return rv;
                                };
                        };
                        history.pushState = _wr('pushState');
                        history.replaceState = _wr('replaceState');
                        
                        window.addEventListener('replaceState', function(e) {
                                console.log('监听到replaceState!');
                                isReCreateUi(); //是否重新创建Ui
                        });
                        window.addEventListener('pushState', function(e) {
                                console.log('监听到pushState!');
                                var url = window.location.origin + window.location.pathname; //window.location.href //去除参数和锚点后的url 
                                //https://steamcommunity.com/id/miku-39/friends?l=english#state_online => https://steamcommunity.com/id/miku-39/friends
                                isReCreateUi(); //是否重新创建Ui
                        });
                }
                
        }
        async createUI() {
                super.createUI();
                
                //正常html代码
                jQuery("#manage_friends").after(mainUI_html);
                
                if(g_uiConf.isShowQuickNavigationBar){ //是否显示快速导航栏
                        //快捷导航栏
                        jQuery(".responsive_page_template_content").after(ExpandUI_QuickNavigationBar_html);
                }
                UI.prototype.uiHandler(); //UI与UI事件等相关的处理程序
        }
        
        async reCreateUI(){
                if(await gc_menu_shielding_ui.initUI(false) != false){
                        await gc_menu_shielding_ui.createUI();
                }
        }
        
        async private_saveUIConfFile() {
        
        }
        async private_readUIConfFile() {
        
        }
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
/**
 * @class
 * @classdesc UI类 - 共同游戏 模块 UI具体实现
 * @extends UI
 */
class menu_gameFriend_ui extends UI {
        constructor(arg) {
                super();
        }
        
        async initUI(type) { //type: true: 第一次加载, false: 再加载
        
                super.initUI();
        
                // 设置数据库
                // var db = new DB();
                // db.Test();
                // db.initAndCreateNewDBInstance({
                //      driver: [localforage.WEBSQL,
                //                      localforage.INDEXEDDB,
                //                      localforage.LOCALSTORAGE],
                //      name: 'Steam assistant-Conf',
                //      size: 10485760 //10mb
                // });
                
                g_db = new DB({ //设置
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Conf',
                        size: 10485760 //10mb
                },true);
                
                g_db1 = new DB({ //拓展功能
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Expand',
                        size: 10485760 //10mb
                },false);
                
                g_db2 = new DB({ //动态助手
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Activity',
                        size: 1073741824 //1gb
                },false);
                
                g_db3 = new DB({ //数据分析
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Friend',
                        size: 1073741824 //1gb
                },false);
                
                g_db4 = new DB({ //留言设置
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Comment',
                        size: 104857600 //100mb
                },false);
                
                await g_db.Write('g_conf',g_conf); //写入
                await g_db.Write('g_uiConf',g_uiConf); //写入
                //debugger
                //var data = await g_db.getAllKeyName();
                //console.log("data",data);
                //var data = await g_db.getKeyNameByIndex(1);
                //console.log("data",data);
                //var data = await g_db.getLength();
                //console.log("data",data);
                
                var data = await g_db.Read('g_conf'); //读取
                console.log("data",data);
                var data = await g_db.Read('g_uiConf'); //读取
                console.log("data",data);
                //var data = await g_db.ReadAll(); //读取所有数据
                //console.log("data",data);
                //await g_db.Remove('g_conf'); //删除数据
                //var data = await g_db.ReadAll(); //读取所有数据
                //console.log("data",data);
                //await g_db.RemoveAll(); //删除所有数据
                //var data = await g_db.ReadAll(); //读取所有数据
                //console.log("data",data);
                //if(data.length == 0){
                //      console.log("没有数据!");
                //}
                
                if(getLoginStatus() == false){ //判断是否登录，如果没有登录则不需要继续运行
                        layer.alert('请先登录Steam，才能继续使用哦~', {icon: 0},function(index){
                                if(g_conf[0].autoLogin == 1){
                                        var obj = document.getElementsByClassName("global_action_link");
                                        for (let i = 0; i < obj.length; i++) {
                                                if(obj[i].className == "global_action_link"){
                                                        obj[i].click(); //跳转到登录页面
                                                }
                                        }
                                }
                        });
                        return false;
                }
                
                readConfInfo(g_steamID); //读取已保存的对应配置信息
                
                if(type){ //第一次加载才需要监听这些事件
                        
                        //1.监听url中的hash变化  //window.location.hash='state_online'  =>  https://steamcommunity.com/id/miku-39/friends#state_online //页面不刷新,url改变,定位到指定锚点
                        window.addEventListener('hashchange',function(event){
                                console.log("1.监听url中的hash变化" + event);
                                isReCreateUi(); //是否重新创建Ui
                        });
                        //2.监听通过history来改变url的事件 //浏览器前进，后退等
                        window.addEventListener('popstate', function(event) {
                                console.log("2.监听通过history来改变url的事件" + event);
                                isReCreateUi(); //是否重新创建Ui
                        });
                        //3.监听pushState和replaceState行为 //pushState可以监听到本页替换超链接
                        var _wr = function(type) {
                                var orig = history[type];
                                return function() {
                                        var rv = orig.apply(this, arguments);
                                        var e = new Event(type);
                                        e.arguments = arguments;
                                        window.dispatchEvent(e);
                                        return rv;
                                };
                        };
                        history.pushState = _wr('pushState');
                        history.replaceState = _wr('replaceState');
                        
                        window.addEventListener('replaceState', function(e) {
                                console.log('监听到replaceState!');
                                isReCreateUi(); //是否重新创建Ui
                        });
                        window.addEventListener('pushState', function(e) {
                                console.log('监听到pushState!');
                                var url = window.location.origin + window.location.pathname; //window.location.href //去除参数和锚点后的url 
                                //https://steamcommunity.com/id/miku-39/friends?l=english#state_online => https://steamcommunity.com/id/miku-39/friends
                                isReCreateUi(); //是否重新创建Ui
                        });
                }
                
        }
        async createUI() {
                super.createUI();
                
                //正常html代码
                jQuery("#manage_friends").after(mainUI_html);
                
                if(g_uiConf.isShowQuickNavigationBar){ //是否显示快速导航栏
                        //快捷导航栏
                        jQuery(".responsive_page_template_content").after(ExpandUI_QuickNavigationBar_html);
                }
                UI.prototype.uiHandler(); //UI与UI事件等相关的处理程序
        }
        
        async reCreateUI(){
                if(await gc_menu_gameFriend_ui.initUI(false) != false){
                        await gc_menu_gameFriend_ui.createUI();
                }
        }
        
        async private_saveUIConfFile() {
        
        }
        async private_readUIConfFile() {
        
        }
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
/**
 * UI类 - 直播版主 模块 UI具体实现
 * @class
 * @classdesc UI类 - 直播版主 模块 UI具体实现
 * @extends UI
 */
class menu_liveAdmin_ui extends UI {
        constructor(arg) {
                super();
        }
        
        async initUI(type) { //type: true: 第一次加载, false: 再加载
        
                super.initUI();
        
                // 设置数据库
                // var db = new DB();
                // db.Test();
                // db.initAndCreateNewDBInstance({
                //      driver: [localforage.WEBSQL,
                //                      localforage.INDEXEDDB,
                //                      localforage.LOCALSTORAGE],
                //      name: 'Steam assistant-Conf',
                //      size: 10485760 //10mb
                // });
                
                g_db = new DB({ //设置
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Conf',
                        size: 10485760 //10mb
                },true);
                
                g_db1 = new DB({ //拓展功能
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Expand',
                        size: 10485760 //10mb
                },false);
                
                g_db2 = new DB({ //动态助手
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Activity',
                        size: 1073741824 //1gb
                },false);
                
                g_db3 = new DB({ //数据分析
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Friend',
                        size: 1073741824 //1gb
                },false);
                
                g_db4 = new DB({ //留言设置
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Comment',
                        size: 104857600 //100mb
                },false);
                
                await g_db.Write('g_conf',g_conf); //写入
                await g_db.Write('g_uiConf',g_uiConf); //写入
                //debugger
                //var data = await g_db.getAllKeyName();
                //console.log("data",data);
                //var data = await g_db.getKeyNameByIndex(1);
                //console.log("data",data);
                //var data = await g_db.getLength();
                //console.log("data",data);
                
                var data = await g_db.Read('g_conf'); //读取
                console.log("data",data);
                var data = await g_db.Read('g_uiConf'); //读取
                console.log("data",data);
                //var data = await g_db.ReadAll(); //读取所有数据
                //console.log("data",data);
                //await g_db.Remove('g_conf'); //删除数据
                //var data = await g_db.ReadAll(); //读取所有数据
                //console.log("data",data);
                //await g_db.RemoveAll(); //删除所有数据
                //var data = await g_db.ReadAll(); //读取所有数据
                //console.log("data",data);
                //if(data.length == 0){
                //      console.log("没有数据!");
                //}
                
                if(getLoginStatus() == false){ //判断是否登录，如果没有登录则不需要继续运行
                        layer.alert('请先登录Steam，才能继续使用哦~', {icon: 0},function(index){
                                if(g_conf[0].autoLogin == 1){
                                        var obj = document.getElementsByClassName("global_action_link");
                                        for (let i = 0; i < obj.length; i++) {
                                                if(obj[i].className == "global_action_link"){
                                                        obj[i].click(); //跳转到登录页面
                                                }
                                        }
                                }
                        });
                        return false;
                }
                
                readConfInfo(g_steamID); //读取已保存的对应配置信息
                
                if(type){ //第一次加载才需要监听这些事件
                        
                        //1.监听url中的hash变化  //window.location.hash='state_online'  =>  https://steamcommunity.com/id/miku-39/friends#state_online //页面不刷新,url改变,定位到指定锚点
                        window.addEventListener('hashchange',function(event){
                                console.log("1.监听url中的hash变化" + event);
                                isReCreateUi(); //是否重新创建Ui
                        });
                        //2.监听通过history来改变url的事件 //浏览器前进，后退等
                        window.addEventListener('popstate', function(event) {
                                console.log("2.监听通过history来改变url的事件" + event);
                                isReCreateUi(); //是否重新创建Ui
                        });
                        //3.监听pushState和replaceState行为 //pushState可以监听到本页替换超链接
                        var _wr = function(type) {
                                var orig = history[type];
                                return function() {
                                        var rv = orig.apply(this, arguments);
                                        var e = new Event(type);
                                        e.arguments = arguments;
                                        window.dispatchEvent(e);
                                        return rv;
                                };
                        };
                        history.pushState = _wr('pushState');
                        history.replaceState = _wr('replaceState');
                        
                        window.addEventListener('replaceState', function(e) {
                                console.log('监听到replaceState!');
                                isReCreateUi(); //是否重新创建Ui
                        });
                        window.addEventListener('pushState', function(e) {
                                console.log('监听到pushState!');
                                var url = window.location.origin + window.location.pathname; //window.location.href //去除参数和锚点后的url 
                                //https://steamcommunity.com/id/miku-39/friends?l=english#state_online => https://steamcommunity.com/id/miku-39/friends
                                isReCreateUi(); //是否重新创建Ui
                        });
                }
                
        }
        async createUI() {
                super.createUI();
                
                //正常html代码
                jQuery("#manage_friends").after(mainUI_html);
                
                if(g_uiConf.isShowQuickNavigationBar){ //是否显示快速导航栏
                        //快捷导航栏
                        jQuery(".responsive_page_template_content").after(ExpandUI_QuickNavigationBar_html);
                }
                UI.prototype.uiHandler(); //UI与UI事件等相关的处理程序
        }
        
        async reCreateUI(){
                if(await gc_menu_liveAdmin_ui.initUI(false) != false){
                        await gc_menu_liveAdmin_ui.createUI();
                }
        }
        
        async private_saveUIConfFile() {
        
        }
        async private_readUIConfFile() {
        
        }
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
/**
 * UI类 - 关注的玩家 模块 UI具体实现
 * @class
 * @classdesc UI类 - 关注的玩家 模块 UI具体实现
 * @extends UI
 */
class menu_following_Players_ui extends UI {
        constructor(arg) {
                super();
        }
        
        async initUI(type) { //type: true: 第一次加载, false: 再加载
        
                super.initUI();
        
                // 设置数据库
                // var db = new DB();
                // db.Test();
                // db.initAndCreateNewDBInstance({
                //      driver: [localforage.WEBSQL,
                //                      localforage.INDEXEDDB,
                //                      localforage.LOCALSTORAGE],
                //      name: 'Steam assistant-Conf',
                //      size: 10485760 //10mb
                // });
                
                g_db = new DB({ //设置
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Conf',
                        size: 10485760 //10mb
                },true);
                
                g_db1 = new DB({ //拓展功能
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Expand',
                        size: 10485760 //10mb
                },false);
                
                g_db2 = new DB({ //动态助手
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Activity',
                        size: 1073741824 //1gb
                },false);
                
                g_db3 = new DB({ //数据分析
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Friend',
                        size: 1073741824 //1gb
                },false);
                
                g_db4 = new DB({ //留言设置
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Comment',
                        size: 104857600 //100mb
                },false);
                
                await g_db.Write('g_conf',g_conf); //写入
                await g_db.Write('g_uiConf',g_uiConf); //写入
                //debugger
                //var data = await g_db.getAllKeyName();
                //console.log("data",data);
                //var data = await g_db.getKeyNameByIndex(1);
                //console.log("data",data);
                //var data = await g_db.getLength();
                //console.log("data",data);
                
                var data = await g_db.Read('g_conf'); //读取
                console.log("data",data);
                var data = await g_db.Read('g_uiConf'); //读取
                console.log("data",data);
                //var data = await g_db.ReadAll(); //读取所有数据
                //console.log("data",data);
                //await g_db.Remove('g_conf'); //删除数据
                //var data = await g_db.ReadAll(); //读取所有数据
                //console.log("data",data);
                //await g_db.RemoveAll(); //删除所有数据
                //var data = await g_db.ReadAll(); //读取所有数据
                //console.log("data",data);
                //if(data.length == 0){
                //      console.log("没有数据!");
                //}
                
                if(getLoginStatus() == false){ //判断是否登录，如果没有登录则不需要继续运行
                        layer.alert('请先登录Steam，才能继续使用哦~', {icon: 0},function(index){
                                if(g_conf[0].autoLogin == 1){
                                        var obj = document.getElementsByClassName("global_action_link");
                                        for (let i = 0; i < obj.length; i++) {
                                                if(obj[i].className == "global_action_link"){
                                                        obj[i].click(); //跳转到登录页面
                                                }
                                        }
                                }
                        });
                        return false;
                }
                
                readConfInfo(g_steamID); //读取已保存的对应配置信息
                
                if(type){ //第一次加载才需要监听这些事件
                        
                        //1.监听url中的hash变化  //window.location.hash='state_online'  =>  https://steamcommunity.com/id/miku-39/friends#state_online //页面不刷新,url改变,定位到指定锚点
                        window.addEventListener('hashchange',function(event){
                                console.log("1.监听url中的hash变化" + event);
                                isReCreateUi(); //是否重新创建Ui
                        });
                        //2.监听通过history来改变url的事件 //浏览器前进，后退等
                        window.addEventListener('popstate', function(event) {
                                console.log("2.监听通过history来改变url的事件" + event);
                                isReCreateUi(); //是否重新创建Ui
                        });
                        //3.监听pushState和replaceState行为 //pushState可以监听到本页替换超链接
                        var _wr = function(type) {
                                var orig = history[type];
                                return function() {
                                        var rv = orig.apply(this, arguments);
                                        var e = new Event(type);
                                        e.arguments = arguments;
                                        window.dispatchEvent(e);
                                        return rv;
                                };
                        };
                        history.pushState = _wr('pushState');
                        history.replaceState = _wr('replaceState');
                        
                        window.addEventListener('replaceState', function(e) {
                                console.log('监听到replaceState!');
                                isReCreateUi(); //是否重新创建Ui
                        });
                        window.addEventListener('pushState', function(e) {
                                console.log('监听到pushState!');
                                var url = window.location.origin + window.location.pathname; //window.location.href //去除参数和锚点后的url 
                                //https://steamcommunity.com/id/miku-39/friends?l=english#state_online => https://steamcommunity.com/id/miku-39/friends
                                isReCreateUi(); //是否重新创建Ui
                        });
                }
                
        }
        async createUI() {
                super.createUI();
                
                //正常html代码
                jQuery("#manage_friends").after(mainUI_html);
                
                if(g_uiConf.isShowQuickNavigationBar){ //是否显示快速导航栏
                        //快捷导航栏
                        jQuery(".responsive_page_template_content").after(ExpandUI_QuickNavigationBar_html);
                }
                UI.prototype.uiHandler(); //UI与UI事件等相关的处理程序
        }
        
        async reCreateUI(){
                if(await gc_menu_following_Players_ui.initUI(false) != false){
                        await gc_menu_following_Players_ui.createUI();
                }
        }
        
        async private_saveUIConfFile() {
        
        }
        async private_readUIConfFile() {
        
        }
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
/**
 * UI类 - 您的组 模块 UI具体实现
 * @class
 * @classdesc UI类 - 您的组 模块 UI具体实现
 * @extends UI
 */

// var DOMPurify = function DOMPurify(root) {
//     return createDOMPurify(root);
//   };

// var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };


// // Most of the code here comes from dselect.js
// class Sortbox {

//     static init() {
//         this._activeDropLists = {};
//         this._lastSelectHideTime = 0;

//         document.addEventListener("mousedown", e => this._handleMouseClick(e));
//     }

//     static _handleMouseClick(e) {
//         for (let key of Object.keys(this._activeDropLists)) {
//                      if (!this._activeDropLists[key]) continue;
                        
//                  let ulAboveEvent = e.target.closest("ul");
                
//             if (ulAboveEvent && ulAboveEvent.id === `${key}_droplist`) continue;
                
//             this._hide(key);
//          }
//     }

//     static _highlightItem(id, index, bSetSelected) {
//         let droplist = document.querySelector(`#${id}_droplist`);
//         let trigger = document.querySelector(`#${id}_trigger`);
//         let rgItems = droplist.getElementsByTagName("a");

//         if (index >= 0 && index < rgItems.length ) {
//             let item = rgItems[index];
            
//             if (typeof trigger.highlightedItem !== "undefined" && trigger.highlightedItem !== index)
//                 rgItems[trigger.highlightedItem].className = "inactive_selection";
                
//             trigger.highlightedItem = index;
//             rgItems[index].className = "highlighted_selection";
            
//             let yOffset = rgItems[index].offsetTop + rgItems[index].clientHeight;
//             let curVisibleOffset = droplist.scrollTop + droplist.clientHeight;
//             let bScrolledDown = false;
//             let nMaxLoopIterations = rgItems.length;
//             let nLoopCounter = 0;

//             while (curVisibleOffset < yOffset && nLoopCounter++ < nMaxLoopIterations) {
//                 droplist.scrollTop += rgItems[index].clientHeight;
//                 curVisibleOffset = droplist.scrollTop+droplist.clientHeight;
//                 bScrolledDown = true;
//             }
            
//             if ( !bScrolledDown ) {
//                 nLoopCounter = 0;
//                 yOffset = rgItems[index].offsetTop;
//                 curVisibleOffset = droplist.scrollTop;
//                 while(curVisibleOffset > yOffset && nLoopCounter++ < nMaxLoopIterations) {
//                     droplist.scrollTop -= rgItems[index].clientHeight;
//                     curVisibleOffset = droplist.scrollTop;
//                 }
//             }
            
//             if (bSetSelected) {
//                 HTML.inner(trigger, item.innerHTML);
//                 let input = document.querySelector(`#${id}`);
//                 input.value = item.id;
//                 input.dispatchEvent(new Event("change"));
                
//                 this._hide(id);
//             }
//         }
//     }

//     static _onFocus(id) {
//         this._activeDropLists[id] = true;
//     }

//     static _onBlur(id) {
//              if (!this._classCheck(document.querySelector(`#${id}_trigger`), "activetrigger"))
//              this._activeDropLists[id] = false;
//     }

//     static _hide(id) {
//         let droplist = document.querySelector(`#${id}_droplist`);
//         let trigger = document.querySelector(`#${id}_trigger`);
        
//              let d = new Date();
//          this._lastSelectHideTime = d.valueOf();
        
//         trigger.className = "trigger";
//         droplist.className = "dropdownhidden";
//         this._activeDropLists[id] = false;
//         trigger.focus();
//     }

//     static _show(id) {
//              let d = new Date();
//          if (d - this._lastSelectHideTime < 50) return;
                
//         let droplist = document.querySelector(`#${id}_droplist`);
//         let trigger = document.querySelector(`#${id}_trigger`);
        
//         trigger.className = "activetrigger";
//         droplist.className = "dropdownvisible";
//         this._activeDropLists[id] = true;
//         trigger.focus();
//     }

//     static _onTriggerClick(id) {
//         if (!this._classCheck(document.querySelector(`#${id}_trigger`), "activetrigger")) {
//             this._show(id);
//         }
//     }

//     static _classCheck(element, className) {
//         return new RegExp(`\\b${className}\\b`).test(element.className);
//     }

//     /**
//      * NOTE FOR ADDON REVIEWER:
//      * Elements returned by this function are already sanitized (calls to HTML class),
//      * so they can be safely inserted without being sanitized again.
//      * If we would sanitize them again, all event listeners would be lost due to
//      * DOMPurify only returning HTML strings.
//      */
//     static get(name, options, initialOption, changeFn, storageOption) {

//         let id = `sort_by_${name}`;
//         let reversed = initialOption.endsWith("_DESC");

//         let arrowDown = "↓";
//         let arrowUp = "↑";
        
//         let box = HTML.element(
//         `<div class="es-sortbox es-sortbox--${name}">
//             <div class="es-sortbox__label">${Localization.str.sort_by}</div>
//             <div class="es-sortbox__container">
//                 <input id="${id}" type="hidden" name="${name}" value="${initialOption}">
//                 <a class="trigger" id="${id}_trigger"></a>
//                 <div class="es-dropdown">
//                     <ul id="${id}_droplist" class="es-dropdown__list dropdownhidden"></ul>
//                 </div>
//             </div>
//             <span class="es-sortbox__reverse">${arrowDown}</span>
//         </div>`);

//         let input = box.querySelector(`#${id}`);
//         input.addEventListener("change", function() { onChange(this.value.replace(`${id}_`, ''), reversed); });

//         // Trigger changeFn for initial option
//         if (initialOption !== "default_ASC") {
//             input.dispatchEvent(new Event("change"));
//         }

//         let reverseEl = box.querySelector(".es-sortbox__reverse");
//         reverseEl.addEventListener("click", () => {
//             reversed = !reversed;
//             reverseEl.textContent = reversed ? arrowUp : arrowDown;
//             onChange(input.value.replace(`${id}_`, ''), reversed);
//         });
//         if (reversed) reverseEl.textContent = arrowUp;

//         let trigger = box.querySelector(`#${id}_trigger`);
//         trigger.addEventListener("focus", () => this._onFocus(id));
//         trigger.addEventListener("blur", () => this._onBlur(id));
//         trigger.addEventListener("click", () => this._onTriggerClick(id));

//         let ul = box.querySelector("ul");
//         let trimmedOption = getTrimmedValue(initialOption);
//         for (let i = 0; i < options.length; ++i) {
//             let [key, text] = options[i];

//             let toggle = "inactive";
//             if (key === trimmedOption) {
//                 box.querySelector(`#${id}`).value = key;
//                 box.querySelector(".trigger").textContent = text;
//                 toggle = "highlighted";
//             }

//             HTML.beforeEnd(ul,
//                 `<li>
//                     <a class="${toggle}_selection" tabindex="99999" id="${id}_${key}">${text}</a>
//                 </li>`);

//             let a = ul.querySelector("li:last-child > a");
//             //a.href = "javascript:DSelectNoop()";
//             a.addEventListener("mouseover", () => this._highlightItem(id, i, false));
//             a.addEventListener("click",     () => this._highlightItem(id, i, true));
//         }

//         function getTrimmedValue(val) { return val.replace(/(_ASC|_DESC)$/, ''); }

//         function onChange(val, reversed) {
//             val = getTrimmedValue(val);
//             changeFn(val, reversed);
//             if (storageOption) { SyncedStorage.set(storageOption, `${val}_${reversed ? "DESC" : "ASC"}`); }
//         }

//         return box;
//     }
// }



//  DOMPurify.sanitize = function (dirty, cfg) {
//     var body = void 0;
//     var importedNode = void 0;
//     var currentNode = void 0;
//     var oldNode = void 0;
//     var returnNode = void 0;
//     /* Make sure we have a string to sanitize.
//       DO NOT return early, as this will return the wrong type if
//       the user has requested a DOM object rather than a string */
//     if (!dirty) {
//       dirty = '<!-->';
//     }

//     /* Stringify, in case dirty is an object */
//     if (typeof dirty !== 'string' && !_isNode(dirty)) {
//       // eslint-disable-next-line no-negated-condition
//       if (typeof dirty.toString !== 'function') {
//         throw new TypeError('toString is not a function');
//       } else {
//         dirty = dirty.toString();
//         if (typeof dirty !== 'string') {
//           throw new TypeError('dirty is not a string, aborting');
//         }
//       }
//     }

//     /* Check we can run. Otherwise fall back or ignore */
//     if (!DOMPurify.isSupported) {
//       if (_typeof(window.toStaticHTML) === 'object' || typeof window.toStaticHTML === 'function') {
//         if (typeof dirty === 'string') {
//           return window.toStaticHTML(dirty);
//         }

//         if (_isNode(dirty)) {
//           return window.toStaticHTML(dirty.outerHTML);
//         }
//       }

//       return dirty;
//     }

//     /* Assign config vars */
//     if (!SET_CONFIG) {
//       _parseConfig(cfg);
//     }

//     /* Clean up removed elements */
//     DOMPurify.removed = [];

//     if (IN_PLACE) {
//       /* No special handling necessary for in-place sanitization */
//     } else if (dirty instanceof Node) {
//       /* If dirty is a DOM element, append to an empty document to avoid
//          elements being stripped by the parser */
//       body = _initDocument('<!-->');
//       importedNode = body.ownerDocument.importNode(dirty, true);
//       if (importedNode.nodeType === 1 && importedNode.nodeName === 'BODY') {
//         /* Node is already a body, use as is */
//         body = importedNode;
//       } else {
//         // eslint-disable-next-line unicorn/prefer-node-append
//         body.appendChild(importedNode);
//       }
//     } else {
//       /* Exit directly if we have nothing to do */
//       if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && dirty.indexOf('<') === -1) {
//         return trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
//       }

//       /* Initialize the document to work on */
//       body = _initDocument(dirty);

//       /* Check we have a DOM node from the data */
//       if (!body) {
//         return RETURN_DOM ? null : emptyHTML;
//       }
//     }

//     /* Remove first element node (ours) if FORCE_BODY is set */
//     if (body && FORCE_BODY) {
//       _forceRemove(body.firstChild);
//     }

//     /* Get node iterator */
//     var nodeIterator = _createIterator(IN_PLACE ? dirty : body);

//     /* Now start iterating over the created document */
//     while (currentNode = nodeIterator.nextNode()) {
//       /* Fix IE's strange behavior with manipulated textNodes #89 */
//       if (currentNode.nodeType === 3 && currentNode === oldNode) {
//         continue;
//       }

//       /* Sanitize tags and elements */
//       if (_sanitizeElements(currentNode)) {
//         continue;
//       }

//       /* Shadow DOM detected, sanitize it */
//       if (currentNode.content instanceof DocumentFragment) {
//         _sanitizeShadowDOM(currentNode.content);
//       }

//       /* Check attributes, sanitize if necessary */
//       _sanitizeAttributes(currentNode);

//       oldNode = currentNode;
//     }

//     oldNode = null;

//     /* If we sanitized `dirty` in-place, return it. */
//     if (IN_PLACE) {
//       return dirty;
//     }

//     /* Return sanitized string or DOM */
//     if (RETURN_DOM) {
//       if (RETURN_DOM_FRAGMENT) {
//         returnNode = createDocumentFragment.call(body.ownerDocument);

//         while (body.firstChild) {
//           // eslint-disable-next-line unicorn/prefer-node-append
//           returnNode.appendChild(body.firstChild);
//         }
//       } else {
//         returnNode = body;
//       }

//       if (RETURN_DOM_IMPORT) {
//         /* AdoptNode() is not used because internal state is not reset
//                (e.g. the past names map of a HTMLFormElement), this is safe
//                in theory but we would rather not risk another attack vector.
//                The state that is cloned by importNode() is explicitly defined
//                by the specs. */
//         returnNode = importNode.call(originalDocument, returnNode, true);
//       }

//       return returnNode;
//     }

//     var serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;

//     /* Sanitize final string template-safe */
//     if (SAFE_FOR_TEMPLATES) {
//       serializedHTML = serializedHTML.replace(MUSTACHE_EXPR$$1, ' ');
//       serializedHTML = serializedHTML.replace(ERB_EXPR$$1, ' ');
//     }

//     return trustedTypesPolicy ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
//   };


//              class HTML {
                
//                  static escape(str) {
//                      // @see https://stackoverflow.com/a/4835406
//                      let map = {
//                          '&': '&amp;',
//                          '<': '&lt;',
//                          '>': '&gt;',
//                          '"': '&quot;',
//                          "'": '&#039;'
//                      };
                
//                      return str.replace(/[&<>"']/g, function(m) { return map[m]; });
//                  }
                
//                  static fragment(html) {
//                      let template = document.createElement('template');
//                      template.innerHTML = DOMPurify.sanitize(html);
//                      return template.content;
//                  }
                
//                  static element(html) {
//                      return HTML.fragment(html).firstElementChild;
//                  }
                
//                  static inner(node, html) {
//                      if (typeof node == 'undefined' || node === null) {
//                          console.warn(`${node} is not an Element.`);
//                          return null;
//                      }
//                      if (typeof node == "string") {
//                          node = document.querySelector(node);
//                      }
//                      if (!(node instanceof Element)) {
//                          console.warn(`${node} is not an Element.`);
//                          return null;
//                      }
                        
//                      node.innerHTML = DOMPurify.sanitize(html);
//                      return node;
//                  }
                
//                  static replace(node, html) {
//                      if (typeof node == 'undefined' || node === null) {
//                          console.warn(`${node} is not an Element.`);
//                          return null;
//                      }
//                      if (typeof node == "string") {
//                          node = document.querySelector(node);
//                      }
//                      if (!(node instanceof Element)) {
//                          console.warn(`${node} is not an Element.`);
//                          return null;
//                      }
                
//                      node.outerHTML = DOMPurify.sanitize(html);
//                      return node;
//                  }
                
//                  static wrap(node, html) {
//                      if (typeof node == 'undefined' || node === null) {
//                          console.warn(`${node} is not an Element.`);
//                          return null;
//                      }
//                      if (typeof node == "string") {
//                          node = document.querySelector(node);
//                      }
//                      if (!(node instanceof Element)) {
//                          console.warn(`${node} is not an Element.`);
//                          return null;
//                      }
                
//                      let wrapper = HTML.element(html);
//                      node.replaceWith(wrapper);
//                      wrapper.append(node);
//                      return wrapper;
//                  }
                
//                  static adjacent(node, position, html) {
//                      if (typeof node == 'undefined' || node === null) {
//                          console.warn(`${node} is not an Element.`);
//                          return null;
//                      }
//                      if (typeof node == "string") {
//                          node = document.querySelector(node);
//                      }
//                      if (!(node instanceof Element)) {
//                          console.warn(`${node} is not an Element.`);
//                          return null;
//                      }
                        
//                      node.insertAdjacentHTML(position, DOMPurify.sanitize(html));
//                      return node;
//                  }
                
//                  static beforeBegin(node, html) {
//                      HTML.adjacent(node, "beforebegin", html);
//                  }
                
//                  static afterBegin(node, html) {
//                      HTML.adjacent(node, "afterbegin", html);
//                  }
                
//                  static beforeEnd(node, html) {
//                      HTML.adjacent(node, "beforeend", html);
//                  }
                
//                  static afterEnd(node, html) {
//                      HTML.adjacent(node, "afterend", html);
//                  }
//              }
                
//              class GroupsPageClass {
                
//                  constructor() {
//                      this._groups = Array.from(document.querySelectorAll(".group_block"));
//                      this._initSort = true;
                
//                      this._moveSearchBar();
//                      this._addSort();
//                      this._addManageBtn();
//                  }
                
//                  _moveSearchBar() {
//                      // move the search bar to the same position as on friends page
//                      let container = HTML.wrap("#search_text_box", '<div class="searchBarContainer"></div>');
//                      document.querySelector("#search_results").insertAdjacentElement("beforebegin", container);
//                  }
                
//                  _addSort() {
//                      document.querySelector("span.profile_groups.title").insertAdjacentElement("afterend", Sortbox.get(
//                          "groups",
//                          [
//                              ["default", Localization.str.theworddefault],
//                              ["members", Localization.str.members],
//                              ["names", Localization.str.name]
//                          ],
//                          SyncedStorage.get("sortgroupsby"),
//                          (sortBy, reversed) => { this._sortGroups(sortBy, reversed) },
//                          "sortgroupsby")
//                      );
                
//                      let sortbox = document.querySelector("div.es-sortbox");
//                      sortbox.style.flexGrow = "2";
//                      sortbox.style.marginRight = "20px";
//                      sortbox.style.marginTop = "0";
//                      sortbox.style.textAlign = "right";
//                  }
                
//                  _getSortFunc(sortBy) {
//                      let property = `esSort${sortBy}`;
//                      switch(sortBy) {
//                          case "default":
//                              return (a, b) => Number(a.dataset[property]) - Number(b.dataset[property]);
//                          case "members":
//                              return (a, b) => Number(b.dataset[property]) - Number(a.dataset[property]);
//                          case "names":
//                              return (a, b) => a.dataset[property].localeCompare(b.dataset[property]);
//                      }
//                  }
                
//                  _sortGroups(sortBy, reversed) {
//                      if (this._groups.length === 0) { return; }
                
//                      if (this._initSort) {
                
//                          let i = 0;
//                          for (let group of this._groups) {
//                              let name = group.querySelector(".groupTitle > a").textContent;
//                              let membercount = Number(group.querySelector(".memberRow > a").textContent.match(/\d+/g).join(""));
//                              group.dataset.esSortdefault = i.toString();
//                              group.dataset.esSortnames = name;
//                              group.dataset.esSortmembers = membercount.toString();
//                              i++;
//                          }
                
//                          this._initSort = false;
//                      }
                
//                      this._groups.sort(this._getSortFunc(sortBy, `esSort${sortBy}`));
                
//                      let searchResults = document.querySelector("#search_results_empty");
//                      for (let group of this._groups) {
//                          if (reversed) {
//                              searchResults.insertAdjacentElement("afterend", group);
//                          } else {
//                              searchResults.parentElement.appendChild(group);
//                          }
//                      }
//                  }
                
//                  _addManageBtn() {
//                      if (this._groups.length === 0) { return; }
//                      if (!this._groups[0].querySelector(".actions")) { return; }
                
//                      let groupsStr = Localization.str.groups;
                
//                      HTML.beforeEnd(".title_bar", 
//                          `<button id="manage_friends_control" class="profile_friends manage_link btnv6_blue_hoverfade btn_medium btn_uppercase">
//                              <span>${groupsStr.manage_groups}</span>
//                          </button>`);
                
//                      HTML.afterEnd(".title_bar",
//                          `<div id="manage_friends" class="manage_friends_panel">
//                              <div class="row">${groupsStr.action_groups}
//                                  <span class="row">
//                                      <span class="dimmed">${groupsStr.select}</span>
//                                      <span class="selection_type" id="es_select_all">${Localization.str.all}</span>
//                                      <span class="selection_type" id="es_select_none">${Localization.str.none}</span>
//                                      <span class="selection_type" id="es_select_inverse">${Localization.str.inverse}</span>
//                                  </span>
//                              </div>
//                              <div class="row">
//                                  <span class="manage_action anage_action btnv6_lightblue_blue btn_medium btn_uppercase" id="es_leave_groups">
//                                      <span>${groupsStr.leave}</span>
//                                  </span>
//                                  <span id="selected_msg_err" class="selected_msg error hidden"></span>
//                                  <span id="selected_msg" class="selected_msg hidden">${groupsStr.selected.replace("__n__", `<span id="selected_count"></span>`)}</span>
//                              </div>
//                              <div class="row"></div>
//                          </div>`);
                
//                      for (let group of this._groups) {
//                          group.classList.add("selectable");
//                          HTML.afterBegin(group, 
//                              `<div class="indicator select_friend">
//                                  <input class="select_friend_checkbox" type="checkbox">
//                              </div>`);
//                          group.querySelector(".select_friend").addEventListener("click", () => {
//                              group.classList.toggle("selected");
//                              group.querySelector(".select_friend_checkbox").checked = group.classList.contains("selected");
//                              ExtensionLayer.runInPageContext(() => { UpdateSelection(); });
//                          });    
//                      }
                
//                      document.querySelector("#manage_friends_control").addEventListener("click", () => {
//                          ExtensionLayer.runInPageContext(() => { ToggleManageFriends(); });
//                      });
                
//                      document.querySelector("#es_select_all").addEventListener("click", () => {
//                          ExtensionLayer.runInPageContext(() => { SelectAll(); });
//                      });
                
//                      document.querySelector("#es_select_none").addEventListener("click", () => {
//                          ExtensionLayer.runInPageContext(() => { SelectNone(); });
//                      });
                
//                      document.querySelector("#es_select_inverse").addEventListener("click", () => {
//                          ExtensionLayer.runInPageContext(() => { SelectInverse(); });
//                      });
                
//                      document.querySelector("#es_leave_groups").addEventListener("click", () => this._leaveGroups());
//                  };
                
//                  async _leaveGroups() {
//                      let selected = [];
                
//                      for (let group of this._groups) {
//                          if (!group.classList.contains("selected")) {
//                              continue;
//                          }
                
//                          let actions = group.querySelector(".actions");
//                          let admin = actions.querySelector("[href*='/edit']");
//                          let split = actions.querySelector("[onclick*=ConfirmLeaveGroup]")
//                              .getAttribute("onclick").split(/'|"/);
//                          let id = split[1];
                
//                          if (admin) {
//                              let name = split[3];
                
//                              let body = Localization.str.groups.leave_admin_confirm.replace("__name__", `<a href=\\"/gid/${id}\\" target=\\"_blank\\">${name}</a>`);
//                              let result = await ConfirmDialog.open(Localization.str.groups.leave, body);
//                              let cont = (result === "OK");
//                              if (!cont) {
//                                  group.querySelector(".select_friend").click();
//                                  continue;
//                              }
//                          }
                
//                          selected.push([id, group]);
//                      }
                
//                      if (selected.length > 0) {
//                          let body = Localization.str.groups.leave_groups_confirm.replace("__n__", selected.length);
//                          let result = await ConfirmDialog.open(Localization.str.groups.leave, body);
                
//                          if (result === "OK") {
//                              for (let tuple of selected) {
//                                  let [id, group] = tuple;
//                                  let res = await this._leaveGroup(id).catch(err => console.error(err));
                
//                                  if (!res || !res.success) {
//                                      console.error("Failed to leave group " + id);
//                                      continue;
//                                  }
                
//                                  group.style.opacity = "0.3";
//                                  group.querySelector(".select_friend").click();
//                              }
//                          }
//                      }
//                  }
                
//                  _leaveGroup(id) {
//                      let formData = new FormData();
//                      formData.append("sessionid", User.getSessionId());
//                      formData.append("steamid", User.steamId);
//                      formData.append("ajax", 1);
//                      formData.append("action", "leave_group");
//                      formData.append("steamids[]", id);
                
//                      return RequestData.post(User.profileUrl + "/friends/action", formData, {
//                          withCredentials: true
//                      }, "json");
//                  }
//              }

class menu_groups_ui extends UI {
        constructor(arg) {
                super();
        }
        
        async initUI(type) { //type: true: 第一次加载, false: 再加载
        
                super.initUI();
                // 设置数据库
                // var db = new DB();
                // db.Test();
                // db.initAndCreateNewDBInstance({
                //      driver: [localforage.WEBSQL,
                //                      localforage.INDEXEDDB,
                //                      localforage.LOCALSTORAGE],
                //      name: 'Steam assistant-Conf',
                //      size: 10485760 //10mb
                // });
                
                g_db = new DB({ //设置
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Conf',
                        size: 10485760 //10mb
                },true);
                
                g_db1 = new DB({ //拓展功能
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Expand',
                        size: 10485760 //10mb
                },false);
                
                g_db2 = new DB({ //动态助手
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Activity',
                        size: 1073741824 //1gb
                },false);
                
                g_db3 = new DB({ //数据分析
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Friend',
                        size: 1073741824 //1gb
                },false);
                
                g_db4 = new DB({ //留言设置
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Comment',
                        size: 104857600 //100mb
                },false);
                
                await g_db.Write('g_conf',g_conf); //写入
                await g_db.Write('g_uiConf',g_uiConf); //写入
                //debugger
                //var data = await g_db.getAllKeyName();
                //console.log("data",data);
                //var data = await g_db.getKeyNameByIndex(1);
                //console.log("data",data);
                //var data = await g_db.getLength();
                //console.log("data",data);
                
                var data = await g_db.Read('g_conf'); //读取
                console.log("data",data);
                var data = await g_db.Read('g_uiConf'); //读取
                console.log("data",data);
                //var data = await g_db.ReadAll(); //读取所有数据
                //console.log("data",data);
                //await g_db.Remove('g_conf'); //删除数据
                //var data = await g_db.ReadAll(); //读取所有数据
                //console.log("data",data);
                //await g_db.RemoveAll(); //删除所有数据
                //var data = await g_db.ReadAll(); //读取所有数据
                //console.log("data",data);
                //if(data.length == 0){
                //      console.log("没有数据!");
                //}
                
                if(getLoginStatus() == false){ //判断是否登录，如果没有登录则不需要继续运行
                        layer.alert('请先登录Steam，才能继续使用哦~', {icon: 0},function(index){
                                if(g_conf[0].autoLogin == 1){
                                        var obj = document.getElementsByClassName("global_action_link");
                                        for (let i = 0; i < obj.length; i++) {
                                                if(obj[i].className == "global_action_link"){
                                                        obj[i].click(); //跳转到登录页面
                                                }
                                        }
                                }
                        });
                        return false;
                }
                
                readConfInfo(g_steamID); //读取已保存的对应配置信息
                
                if(type){ //第一次加载才需要监听这些事件
                        
                        //1.监听url中的hash变化  //window.location.hash='state_online'  =>  https://steamcommunity.com/id/miku-39/friends#state_online //页面不刷新,url改变,定位到指定锚点
                        window.addEventListener('hashchange',function(event){
                                console.log("1.监听url中的hash变化" + event);
                                isReCreateUi(); //是否重新创建Ui
                        });
                        //2.监听通过history来改变url的事件 //浏览器前进，后退等
                        window.addEventListener('popstate', function(event) {
                                console.log("2.监听通过history来改变url的事件" + event);
                                isReCreateUi(); //是否重新创建Ui
                        });
                        //3.监听pushState和replaceState行为 //pushState可以监听到本页替换超链接
                        var _wr = function(type) {
                                var orig = history[type];
                                return function() {
                                        var rv = orig.apply(this, arguments);
                                        var e = new Event(type);
                                        e.arguments = arguments;
                                        window.dispatchEvent(e);
                                        return rv;
                                };
                        };
                        history.pushState = _wr('pushState');
                        history.replaceState = _wr('replaceState');
                        
                        window.addEventListener('replaceState', function(e) {
                                console.log('监听到replaceState!');
                                isReCreateUi(); //是否重新创建Ui
                        });
                        window.addEventListener('pushState', function(e) {
                                console.log('监听到pushState!');
                                var url = window.location.origin + window.location.pathname; //window.location.href //去除参数和锚点后的url 
                                //https://steamcommunity.com/id/miku-39/friends?l=english#state_online => https://steamcommunity.com/id/miku-39/friends
                                isReCreateUi(); //是否重新创建Ui
                        });
                }
                
        }
        async createUI() {
                super.createUI();
                //修改html代码并注册事件，使点击后和刷新后的ui都保持一致
                //jQuery(".profile_groups.title_bar").remove(); //删除
                
                // jQuery("#groups_list").prepend('\
                // <div class="profile_groups title_bar">\
                //      <span class="profile_groups title">您的组</span>\
                //      <div class="es-sortbox es-sortbox--groups" style="flex-grow: 2; margin-right: 20px; margin-top: 0px; text-align: right;">\
                //              <div class="es-sortbox__label">排序依据：</div>\
                //                      <div class="es-sortbox__container">\
                //                              <input value="default" name="groups" type="hidden" id="sort_by_groups">\
                //                              <a id="sort_by_groups_trigger" class="trigger">默认</a>\
                //                              <div class="es-dropdown">\
                //                                      <ul class="es-dropdown__list dropdownhidden" id="sort_by_groups_droplist">\
                //                                              <li><a id="sort_by_groups_default" tabindex="99999" class="highlighted_selection">默认</a></li>\
                //                                              <li><a id="sort_by_groups_members" tabindex="99999" class="inactive_selection">成员</a></li>\
                //                                              <li><a id="sort_by_groups_names" tabindex="99999" class="inactive_selection">名称</a></li>\
                //                                      </ul>\
                //                              </div>\
                //                      </div>\
                //                      <span class="es-sortbox__reverse">↓</span>\
                //              </div>\
                //      <button class="profile_friends manage_link btnv6_blue_hoverfade btn_medium btn_uppercase" id="manage_friends_control">\
                //              <span>管理组1</span>\
                //     </button>\
                //      </div>\
                //      \
                //      <div class="manage_friends_panel" id="manage_friends">\
                //              <div class="row">请在下方选择您要操作的组。\
                //                      <span class="row">\
                //                              <span class="dimmed">选择：</span>\
                //                                      <span id="es_select_all" class="selection_type">全部</span>\
                //                                      <span id="es_select_none" class="selection_type">无</span>\
                //                                      <span id="es_select_inverse" class="selection_type">逆序</span>\
                //                              </span>\
                //              </div>\
                //              <div class="row">\
                //                      <span id="es_leave_groups" class="manage_action anage_action btnv6_lightblue_blue btn_medium btn_uppercase">\
                //                              <span>离开组</span>\
                //                      </span>\
                //                      <span class="selected_msg error hidden" id="selected_msg_err"></span>\
                //                      <span class="selected_msg hidden" id="selected_msg">已选择 <span id="selected_count"></span> 个。</span>\
                //              </div>\
                //              <div class="row"></div>\
                //      </div>\
                //      \
                //      <div class="searchBarContainer">\
                //              <input name="search_text_box" id="search_text_box" class="groups_search_text_box" value="" onkeyup="ShowMatching( \'search_results\', \'group_block\', \'data-search\', $J(\'#search_text_box\').val(), UpdateGroupList );" autocomplete="off" autofocus="" placeholder="通过名称搜索组1">\
                //      </div>\
                // </div>\
                // ');
                
                //正常html代码
                jQuery("#manage_friends").after(groupUI_html);
                
                // document.querySelector("#manage_friends_control").addEventListener("click", () => {
                //      ToggleManageFriends();
                //      var obj = jQuery(".group_block.invite_row");
                        
                //      if(obj.hasClass("manage")){
                //              obj.removeClass("selectable");
                //              obj.removeClass("manage");
                //      }
                //      else{
                //              obj.addClass("selectable");
                //              obj.addClass("manage");
                //      }
                                
                // });
                
                // document.querySelector("#es_select_all").addEventListener("click", () => {
                //      SelectAll();
                // });
                
                // document.querySelector("#es_select_none").addEventListener("click", () => {
                //      SelectNone();
                // });
                
                // document.querySelector("#es_select_inverse").addEventListener("click", () => {
                //      SelectInverse();
                // });
                
                
                
                //document.querySelector("#es_leave_groups").addEventListener("click", () => this._leaveGroups());
                
                //(new GroupsPageClass());
                
                if(g_uiConf.isShowQuickNavigationBar){ //是否显示快速导航栏
                        //快捷导航栏
                        jQuery(".responsive_page_template_content").after(ExpandUI_QuickNavigationBar_html);
                }
                UI.prototype.uiHandler(); //UI与UI事件等相关的处理程序
        }
        
        async reCreateUI(){
                if(await gc_menu_groups_ui.initUI(false) != false){
                        await gc_menu_groups_ui.createUI();
                }
        }
        
        async private_saveUIConfFile() {
        
        }
        async private_readUIConfFile() {
        
        }
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
/**
 * UI类 - 组邀请 模块 UI具体实现
 * @class
 * @classdesc UI类 - 组邀请 模块 UI具体实现
 * @extends UI
 */
class menu_groups_invite_ui extends UI {
        constructor(arg) {
                super();
        }
        
        async initUI(type) { //type: true: 第一次加载, false: 再加载
        
                super.initUI();
        
                // 设置数据库
                // var db = new DB();
                // db.Test();
                // db.initAndCreateNewDBInstance({
                //      driver: [localforage.WEBSQL,
                //                      localforage.INDEXEDDB,
                //                      localforage.LOCALSTORAGE],
                //      name: 'Steam assistant-Conf',
                //      size: 10485760 //10mb
                // });
                
                g_db = new DB({ //设置
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Conf',
                        size: 10485760 //10mb
                },true);
                
                g_db1 = new DB({ //拓展功能
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Expand',
                        size: 10485760 //10mb
                },false);
                
                g_db2 = new DB({ //动态助手
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Activity',
                        size: 1073741824 //1gb
                },false);
                
                g_db3 = new DB({ //数据分析
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Friend',
                        size: 1073741824 //1gb
                },false);
                
                g_db4 = new DB({ //留言设置
                        driver: [localforage.WEBSQL,
                                        localforage.INDEXEDDB,
                                        localforage.LOCALSTORAGE],
                        name: 'Steam assistant-Comment',
                        size: 104857600 //100mb
                },false);
                
                await g_db.Write('g_conf',g_conf); //写入
                await g_db.Write('g_uiConf',g_uiConf); //写入
                //debugger
                //var data = await g_db.getAllKeyName();
                //console.log("data",data);
                //var data = await g_db.getKeyNameByIndex(1);
                //console.log("data",data);
                //var data = await g_db.getLength();
                //console.log("data",data);
                
                var data = await g_db.Read('g_conf'); //读取
                console.log("data",data);
                var data = await g_db.Read('g_uiConf'); //读取
                console.log("data",data);
                //var data = await g_db.ReadAll(); //读取所有数据
                //console.log("data",data);
                //await g_db.Remove('g_conf'); //删除数据
                //var data = await g_db.ReadAll(); //读取所有数据
                //console.log("data",data);
                //await g_db.RemoveAll(); //删除所有数据
                //var data = await g_db.ReadAll(); //读取所有数据
                //console.log("data",data);
                //if(data.length == 0){
                //      console.log("没有数据!");
                //}
                
                if(getLoginStatus() == false){ //判断是否登录，如果没有登录则不需要继续运行
                        layer.alert('请先登录Steam，才能继续使用哦~', {icon: 0},function(index){
                                if(g_conf[0].autoLogin == 1){
                                        var obj = document.getElementsByClassName("global_action_link");
                                        for (let i = 0; i < obj.length; i++) {
                                                if(obj[i].className == "global_action_link"){
                                                        obj[i].click(); //跳转到登录页面
                                                }
                                        }
                                }
                        });
                        return false;
                }
                
                readConfInfo(g_steamID); //读取已保存的对应配置信息
                
                if(type){ //第一次加载才需要监听这些事件
                        
                        //1.监听url中的hash变化  //window.location.hash='state_online'  =>  https://steamcommunity.com/id/miku-39/friends#state_online //页面不刷新,url改变,定位到指定锚点
                        window.addEventListener('hashchange',function(event){
                                console.log("1.监听url中的hash变化" + event);
                                isReCreateUi(); //是否重新创建Ui
                        });
                        //2.监听通过history来改变url的事件 //浏览器前进，后退等
                        window.addEventListener('popstate', function(event) {
                                console.log("2.监听通过history来改变url的事件" + event);
                                isReCreateUi(); //是否重新创建Ui
                        });
                        //3.监听pushState和replaceState行为 //pushState可以监听到本页替换超链接
                        var _wr = function(type) {
                                var orig = history[type];
                                return function() {
                                        var rv = orig.apply(this, arguments);
                                        var e = new Event(type);
                                        e.arguments = arguments;
                                        window.dispatchEvent(e);
                                        return rv;
                                };
                        };
                        history.pushState = _wr('pushState');
                        history.replaceState = _wr('replaceState');
                        
                        window.addEventListener('replaceState', function(e) {
                                console.log('监听到replaceState!');
                                isReCreateUi(); //是否重新创建Ui
                        });
                        window.addEventListener('pushState', function(e) {
                                console.log('监听到pushState!');
                                var url = window.location.origin + window.location.pathname; //window.location.href //去除参数和锚点后的url 
                                //https://steamcommunity.com/id/miku-39/friends?l=english#state_online => https://steamcommunity.com/id/miku-39/friends
                                isReCreateUi(); //是否重新创建Ui
                        });
                }
                
        }
        async createUI() {
                super.createUI();
                
                //正常html代码
                jQuery("#manage_friends").after(groupUI_html);
                
                if(g_uiConf.isShowQuickNavigationBar){ //是否显示快速导航栏
                        //快捷导航栏
                        jQuery(".responsive_page_template_content").after(ExpandUI_QuickNavigationBar_html);
                }
                UI.prototype.uiHandler(); //UI与UI事件等相关的处理程序
        }
        
        async reCreateUI(){
                if(await gc_menu_groups_invite_ui.initUI(false) != false){
                        await gc_menu_groups_invite_ui.createUI();
                }
        }
        
        async private_saveUIConfFile() {
        
        }
        async private_readUIConfFile() {
        
        }
}

/**
 * uiHandler.js
 */

var commentTextarea_box; /*所有输入框*/

UI.prototype.uiHandler = async function(){ //UI与UI事件等相关的处理程序
        //2.构建UI
        layui.use(['laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider', 'colorpicker', 'form'], function() {
                var $ = layui.$;
                var laydate = layui.laydate //日期
                        ,laypage = layui.laypage //分页
                        ,layer = layui.layer //弹层
                        ,table = layui.table //表格
                        ,carousel = layui.carousel //轮播
                        ,upload = layui.upload //上传
                        ,element = layui.element //元素操作
                        ,slider = layui.slider //滑块
                        ,colorpicker = layui.colorpicker
                        ,form = layui.form;
                //console.log(layui.layer);
        
                //向世界问个好
                //layer.msg('Hello World');
                //layer.alert('见到你真的很高兴', {icon: 6});
                //layui.layer.alert("text");
                
        
        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // 好友数据统计 图表配置
        table.render({
            elem: '#friendStatistics'
            //,url:'/demo/table/user/'
            ,cellMinWidth: 80
            ,cols: [[
              {type:'numbers'}
              ,{type: 'checkbox'}
              ,{field:'Id', title:'ID', width:100, unresize: true, sort: true}
              ,{field:'Name', title:'名称', templet: '#usernameTpl'}
              ,{field:'Remark', title:'备注'}
              ,{field:'City', title: '国籍(城市)', minWidth:120, sort: true}
                  ,{field:'Lever', title: '等级', minWidth:120, sort: true}
                  ,{field:'Friends', title: '好友数量', minWidth:120, sort: true}
                  ,{field:'Games', title: '游戏数量', minWidth:120, sort: true}
                  ,{field:'DLCs', title: 'dlc数量', minWidth:120, sort: true}
                  ,{field:'Workshops', title: '创意工坊数量', minWidth:120, sort: true}
                  ,{field:'Artworks', title: '艺术作品数量', minWidth:120, sort: true}
                  ,{field:'Activitys', title: '动态数量', minWidth:120, sort: true}
              ,{field:'front', title:'置顶', width:85, templet: '#switchTpl', unresize: true}
              ,{field:'lock', title:'是否锁定', width:110, templet: '#checkboxTpl', unresize: true}
            ]]
                ,data: []
            ,page: true
          });
        
        //加载数据
        table.reload('friendStatistics', {
                elem: '#friendStatistics'
                ,page: true
                ,data: [
                        {Id: "1"
                        ,Name: "xxx"
                        ,Remark: "xx"
                        ,City: "xx"
                        ,Lever: "1"
                        ,Friends: "1"
                        ,Games: "1"
                        ,DLCs: '1'
                        ,Workshops: '1'
                        ,Artworks: '1'
                        ,Activitys: '1'
                        },
                        {Id: "1"
                        ,Name: "xxx"
                        ,Remark: "xx"
                        ,City: "xx"
                        ,Lever: "1"
                        ,Friends: "1"
                        ,Games: "1"
                        ,DLCs: '1'
                        ,Workshops: '1'
                        ,Artworks: '1'
                        ,Activitys: '1'
                        },
                        {Id: "1"
                        ,Name: "xxx"
                        ,Remark: "xx"
                        ,City: "xx"
                        ,Lever: "1"
                        ,Friends: "1"
                        ,Games: "1"
                        ,DLCs: '1'
                        ,Workshops: '1'
                        ,Artworks: '1'
                        ,Activitys: '1'
                        },
                ]
        });
        
        //监听置顶操作
        form.on('switch(frontDemo)', function(obj){
          layer.tips(this.value + ' ' + this.name + '：'+ obj.elem.checked, obj.othis);
        });
        
        //监听锁定操作
        form.on('checkbox(lockDemo)', function(obj){
          layer.tips(this.value + ' ' + this.name + '：'+ obj.elem.checked, obj.othis);
        });
        
        //表单取值
        layui.$('#LAY-component-form-getval').on('click', async function(){
                var data = form.val('example');
                //var jsonStr = JSON.stringify(data);
                switch (data.modules){
                        case '1':
                                await setSelectTextMode(1);
                                break;
                        case '2':
                                await setSelectTextMode(2);
                                break;
                        case '3':
                                await setSelectTextMode(3);
                                break;  
                        case '4':
                                await setSelectTextMode(4);
                                break;  
                        case '5':
                                await setSelectTextMode(5);
                                break;  
                        case '6':
                                await setSelectTextMode(6);
                                break;  
                        case '7':
                                await setSelectTextMode(7);
                                break;  
                        case '8':
                                await setSelectTextMode(8);
                                break;  
                        default:
                                break;
                }
                console.log(data.modules);
                _addIDtoHandleLostfocus(); //添加ID来处理丢失的焦点
        });
        
        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // 留言数据统计 图表配置
        // Highcharts.setOptions({
        //              global : {
        //                              useUTC : false
        //              }
        // });
        // // Create the chart
        // Highcharts.stockChart('container_commentStatistics', {
        //              chart : {
        //                              events : {
        //                                              load : function () {
        //                                                              // set up the updating of the chart each second
        //                                                              var series = this.series[0];
        //                                                              setInterval(function () {
        //                                                                              var x = (new Date()).getTime(), // current time
        //                                                                                              y = Math.round(Math.random() * 100);
        //                                                                              series.addPoint([x, y], true, true);
        //                                                              }, 1000);
        //                                              }
        //                              }
        //              },
        //              rangeSelector: {
        //                              buttons: [{
        //                                              count: 1,
        //                                              type: 'minute',
        //                                              text: '1M'
        //                              }, {
        //                                              count: 5,
        //                                              type: 'minute',
        //                                              text: '5M'
        //                              }, {
        //                                              type: 'all',
        //                                              text: 'All'
        //                              }],
        //                              inputEnabled: false,
        //                              selected: 0
        //              },
        //              title : {
        //                              text : 'Live random data'
        //              },
        //              tooltip: {
        //                              split: false
        //              },
        //              exporting: {
        //                              enabled: false
        //              },
        //              series : [{
        //                              name : '随机数据',
        //                              data : (function () {
        //                                              // generate an array of random data
        //                                              var data = [], time = (new Date()).getTime(), i;
        //                                              for (i = -999; i <= 0; i += 1) {
        //                                                              data.push([
        //                                                                              time + i * 1000,
        //                                                                              Math.round(Math.random() * 100)
        //                                                              ]);
        //                                              }
        //                                              return data;
        //                              }())
        //              }]
        // });
        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // // 关系网统计 图表配置
        // // Add the nodes option through an event call. We want to start with the parent
        // // item and apply separate colors to each child element, then the same color to
        // // grandchildren.
        // Highcharts.addEvent(
        //      Highcharts.seriesTypes.networkgraph,
        //      'afterSetOptions',
        //      function (e) {
        //              var colors = Highcharts.getOptions().colors,
        //                      i = 0,
        //                      nodes = {};
        //              e.options.data.forEach(function (link) {
        //                      if (link[0] === 'Proto Indo-European') {
        //                              nodes['Proto Indo-European'] = {
        //                                      id: 'Proto Indo-European',
        //                                      marker: {
        //                                              radius: 20
        //                                      }
        //                              };
        //                              nodes[link[1]] = {
        //                                      id: link[1],
        //                                      marker: {
        //                                              radius: 10
        //                                      },
        //                                      color: colors[i++]
        //                              };
        //                      } else if (nodes[link[0]] && nodes[link[0]].color) {
        //                              nodes[link[1]] = {
        //                                      id: link[1],
        //                                      color: nodes[link[0]].color
        //                              };
        //                      }
        //              });
        //              e.options.nodes = Object.keys(nodes).map(function (id) {
        //                      return nodes[id];
        //              });
        //      }
        // );
        // Highcharts.chart('container_relationshipStatistics', {
        //      chart: {
        //              type: 'networkgraph',
        //              height: '100%'
        //      },
        //      title: {
        //              text: 'The Indo-European Laungauge Tree'
        //      },
        //      subtitle: {
        //              text: 'A Force-Directed Network Graph in Highcharts'
        //      },
        //      plotOptions: {
        //              networkgraph: {
        //                      keys: ['from', 'to'],
        //                      layoutAlgorithm: {
        //                              enableSimulation: true
        //                      }
        //              }
        //      },
        //      series: [{
        //              dataLabels: {
        //                      enabled: true
        //              },
        //              data: [
        //                      ['Proto Indo-European', 'Balto-Slavic'],
        //                      ['Proto Indo-European', 'Germanic'],
        //                      ['Proto Indo-European', 'Celtic'],
        //                      ['Proto Indo-European', 'Italic'],
        //                      ['Proto Indo-European', 'Hellenic'],
        //                      ['Proto Indo-European', 'Anatolian'],
        //                      ['Proto Indo-European', 'Indo-Iranian'],
        //                      ['Proto Indo-European', 'Tocharian'],
        //                      ['Indo-Iranian', 'Dardic'],
        //                      ['Indo-Iranian', 'Indic'],
        //                      ['Indo-Iranian', 'Iranian'],
        //                      ['Iranian', 'Old Persian'],
        //                      ['Old Persian', 'Middle Persian'],
        //                      ['Indic', 'Sanskrit'],
        //                      ['Italic', 'Osco-Umbrian'],
        //                      ['Italic', 'Latino-Faliscan'],
        //                      ['Latino-Faliscan', 'Latin'],
        //                      ['Celtic', 'Brythonic'],
        //                      ['Celtic', 'Goidelic'],
        //                      ['Germanic', 'North Germanic'],
        //                      ['Germanic', 'West Germanic'],
        //                      ['Germanic', 'East Germanic'],
        //                      ['North Germanic', 'Old Norse'],
        //                      ['North Germanic', 'Old Swedish'],
        //                      ['North Germanic', 'Old Danish'],
        //                      ['West Germanic', 'Old English'],
        //                      ['West Germanic', 'Old Frisian'],
        //                      ['West Germanic', 'Old Dutch'],
        //                      ['West Germanic', 'Old Low German'],
        //                      ['West Germanic', 'Old High German'],
        //                      ['Old Norse', 'Old Icelandic'],
        //                      ['Old Norse', 'Old Norwegian'],
        //                      ['Old Norwegian', 'Middle Norwegian'],
        //                      ['Old Swedish', 'Middle Swedish'],
        //                      ['Old Danish', 'Middle Danish'],
        //                      ['Old English', 'Middle English'],
        //                      ['Old Dutch', 'Middle Dutch'],
        //                      ['Old Low German', 'Middle Low German'],
        //                      ['Old High German', 'Middle High German'],
        //                      ['Balto-Slavic', 'Baltic'],
        //                      ['Balto-Slavic', 'Slavic'],
        //                      ['Slavic', 'East Slavic'],
        //                      ['Slavic', 'West Slavic'],
        //                      ['Slavic', 'South Slavic'],
        //                      // Leaves:
        //                      ['Proto Indo-European', 'Phrygian'],
        //                      ['Proto Indo-European', 'Armenian'],
        //                      ['Proto Indo-European', 'Albanian'],
        //                      ['Proto Indo-European', 'Thracian'],
        //                      ['Tocharian', 'Tocharian A'],
        //                      ['Tocharian', 'Tocharian B'],
        //                      ['Anatolian', 'Hittite'],
        //                      ['Anatolian', 'Palaic'],
        //                      ['Anatolian', 'Luwic'],
        //                      ['Anatolian', 'Lydian'],
        //                      ['Iranian', 'Balochi'],
        //                      ['Iranian', 'Kurdish'],
        //                      ['Iranian', 'Pashto'],
        //                      ['Iranian', 'Sogdian'],
        //                      ['Old Persian', 'Pahlavi'],
        //                      ['Middle Persian', 'Persian'],
        //                      ['Hellenic', 'Greek'],
        //                      ['Dardic', 'Dard'],
        //                      ['Sanskrit', 'Sindhi'],
        //                      ['Sanskrit', 'Romani'],
        //                      ['Sanskrit', 'Urdu'],
        //                      ['Sanskrit', 'Hindi'],
        //                      ['Sanskrit', 'Bihari'],
        //                      ['Sanskrit', 'Assamese'],
        //                      ['Sanskrit', 'Bengali'],
        //                      ['Sanskrit', 'Marathi'],
        //                      ['Sanskrit', 'Gujarati'],
        //                      ['Sanskrit', 'Punjabi'],
        //                      ['Sanskrit', 'Sinhalese'],
        //                      ['Osco-Umbrian', 'Umbrian'],
        //                      ['Osco-Umbrian', 'Oscan'],
        //                      ['Latino-Faliscan', 'Faliscan'],
        //                      ['Latin', 'Portugese'],
        //                      ['Latin', 'Spanish'],
        //                      ['Latin', 'French'],
        //                      ['Latin', 'Romanian'],
        //                      ['Latin', 'Italian'],
        //                      ['Latin', 'Catalan'],
        //                      ['Latin', 'Franco-Provençal'],
        //                      ['Latin', 'Rhaeto-Romance'],
        //                      ['Brythonic', 'Welsh'],
        //                      ['Brythonic', 'Breton'],
        //                      ['Brythonic', 'Cornish'],
        //                      ['Brythonic', 'Cuymbric'],
        //                      ['Goidelic', 'Modern Irish'],
        //                      ['Goidelic', 'Scottish Gaelic'],
        //                      ['Goidelic', 'Manx'],
        //                      ['East Germanic', 'Gothic'],
        //                      ['Middle Low German', 'Low German'],
        //                      ['Middle High German', '(High) German'],
        //                      ['Middle High German', 'Yiddish'],
        //                      ['Middle English', 'English'],
        //                      ['Middle Dutch', 'Hollandic'],
        //                      ['Middle Dutch', 'Flemish'],
        //                      ['Middle Dutch', 'Dutch'],
        //                      ['Middle Dutch', 'Limburgish'],
        //                      ['Middle Dutch', 'Brabantian'],
        //                      ['Middle Dutch', 'Rhinelandic'],
        //                      ['Old Frisian', 'Frisian'],
        //                      ['Middle Danish', 'Danish'],
        //                      ['Middle Swedish', 'Swedish'],
        //                      ['Middle Norwegian', 'Norwegian'],
        //                      ['Old Norse', 'Faroese'],
        //                      ['Old Icelandic', 'Icelandic'],
        //                      ['Baltic', 'Old Prussian'],
        //                      ['Baltic', 'Lithuanian'],
        //                      ['Baltic', 'Latvian'],
        //                      ['West Slavic', 'Polish'],
        //                      ['West Slavic', 'Slovak'],
        //                      ['West Slavic', 'Czech'],
        //                      ['West Slavic', 'Wendish'],
        //                      ['East Slavic', 'Bulgarian'],
        //                      ['East Slavic', 'Old Church Slavonic'],
        //                      ['East Slavic', 'Macedonian'],
        //                      ['East Slavic', 'Serbo-Croatian'],
        //                      ['East Slavic', 'Slovene'],
        //                      ['South Slavic', 'Russian'],
        //                      ['South Slavic', 'Ukrainian'],
        //                      ['South Slavic', 'Belarusian'],
        //                      ['South Slavic', 'Rusyn']
        //              ]
        //      }]
        // });
        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // 当前配置统计 图表配置
        
        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // 查看好友配置统计 图表配置
        
        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // 多选下拉框
        _ySelects(jQuery);
        
        jQuery('.selectBox').ySelect({
                placeholder: '请先选择要翻译为的语言',
                searchText: '搜索~发现新世界~',
                showSearch: true,
                numDisplayed: 4,
                overflowText: '已选中 {n}项',
                isCheck: false
        });
        
        //单选框选中和取消选择
        if(jQuery('.nameAddType')[0] != undefined){
                //单选框选中和取消选中 https://segmentfault.com/q/1010000004945347
                jQuery('.nameAddType').on('click', function() {
                        var ischecked = jQuery(this).data('checked');
                        if (!ischecked && this.checked) {
                                jQuery(this).data('checked', true);
                        } else {
                                jQuery(this).prop('checked', false);
                                jQuery(this).data('checked', false);
                        }
                        console.log(jQuery(this).data('checked'))
                }).data('checked', jQuery('.nameAddType').get(0).checked);
        }
        
        
        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------
        
                 //请选择日期
                  laydate.render({
                    elem: '#test-limit2'
                        ,trigger: 'click'
                    ,min: 0
                    ,max: 99999
                        ,done: function(value, date){
                          //layer.alert('你选择的日期是：' + value + '<br>获得的对象是' + JSON.stringify(date));
                          var endTime = new Date(date.year,date.month-1,date.date,date.hours,date.minutes,date.seconds,0).getTime(); //选择的时间
                          var startTime = Math.round(new Date()); //现在的时间
                          if(endTime <= startTime)
                          {
                                 layer.alert("请选择至少一天的时间差!");
                                return false;
                          }
                          let time = endTime >= startTime ? endTime - startTime: startTime - endTime; //计算时间差
                         
                          //计算出相差天数
                          var str = "";
                          let days = Math.floor(time / (24 * 3600 * 1000))
                          //计算出小时数
                          let leave1 = time % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
                          let hours = Math.floor(leave1 / (3600 * 1000))
                          //计算相差分钟数
                          let leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
                          let minutes = Math.floor(leave2 / (60 * 1000))
                          //计算相差秒数
                          let leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
                          //let seconds=Math.round(leave3/1000)
                          let seconds = leave3 / 1000
                          //if (days > 0)
                                str += days + "天";
                          //if (hours > 0)
                                str += hours + "小时";
                          //if (minutes > 0)
                                str += minutes + "分钟";
                          //if (seconds > 0)
                                str += seconds + "秒";
                        
                        var timeleftStr = "过"+ str +"后再留言";
                        var dayStr = "等待"+ (days+1) + "天, ";
                        
                          //console.log(str);
                          jQuery('#test-limit1')[0].value = dayStr + timeleftStr;
                        }
                  });
                  
                  // //请选择时间
                  // laydate.render({
                  //     elem: '#test14'
                  //     ,type: 'time'
                  //     ,format: 'H时m分s秒'
                         //  ,done: function(value, date){
                         //    //layer.alert('你选择的日期是：' + value + '<br>获得的对象是' + JSON.stringify(date));
                                // var endTime = new Date(date.year,date.month-1,date.date,date.hours,date.minutes,date.seconds,0).getTime(); //选择的时间
                                //   var startTime = Math.round(new Date()); //现在的时间
                                //   if(endTime <= startTime)
                                //   {
                                //       layer.alert("请选择至少一天的时间差!");
                                //      return false;
                                //   }
                                //   let time = endTime >= startTime ? endTime - startTime: startTime - endTime; //计算时间差
                                 
                                //   //计算出相差天数
                                //   var str = "";
                                //   let days = Math.floor(time / (24 * 3600 * 1000))
                                //   //计算出小时数
                                //   let leave1 = time % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
                                //   let hours = Math.floor(leave1 / (3600 * 1000))
                                //   //计算相差分钟数
                                //   let leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
                                //   let minutes = Math.floor(leave2 / (60 * 1000))
                                //   //计算相差秒数
                                //   let leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
                                //   //let seconds=Math.round(leave3/1000)
                                //   let seconds = leave3 / 1000
                                //   //if (days > 0)
                                //      str += days + "天";
                                //   //if (hours > 0)
                                //      str += hours + "小时";
                                //   //if (minutes > 0)
                                //      str += minutes + "分钟";
                                //   //if (seconds > 0)
                                //      str += seconds + "秒";
                                
                                // var timeleftStr = "过"+ str +"后再留言";
                                // var dayStr = "等待"+ (days+1) + "天, ";//"过1小时后再留言"
                                
                                //   //console.log(str);
                         //    jQuery('#test15')[0].value = dayStr + timeleftStr;
                         //  }
                  //   });
                
                        table.render({
                            elem: '#test'
                                        // ,height: 315 //容器高度
                            // ,url:'memberStatus?search=1'
                            ,cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
                            ,data: []
                            // ,autoSort: false //取消自动排序
                            ,cols: [
                                [
                                // {field:'id', title: 'ID', align: 'center',sort: true}
                                ,{field:'memberName', title: 'ID', align: 'center',sort: true, width: '8%'} //width 支持：数字、百分比和不填写。你还可以通过 minWidth 参数局部定义当前单元格的最小宽度，layui 2.2.1 新增
                                ,{field:'team', title: '名称', align: 'center', sort: true,width: '12%'} //单元格内容水平居中
                                ,{field:'deviceCode', title: '留言时间', align: 'center',width: '17%',sort: true} //width 支持：数字、百分比和不填写。你还可以通过 minWidth 参数局部定义当前单元格的最小宽度，layui 2.2.1 新增
                                // ,{field:'hp', title: '血量', align: 'center',sort: true}
                                ,{field:'hp', title: '待留言好友', align: 'center',width: '18%',sort: true}
                                ,{field:'hitedNumber', title: '留言内容', align: 'center',width: '15%',sort: true}
                                ,{field:'hitNumber', title: '已执行次数', align: 'center',width: '10%',sort: true}
                                ,{field:'rePlenishBullet', title: '备注', align: 'center',width: '10%',sort: true}
                                ,{field:'reviveNum', title: '设置', align: 'center',width: '10%',sort: true},
                            ]
                                                ]//标题栏 //设置表头
                            ,done:function (res,currentCount) {
                                element.render()
                            }
                        });
                                
                 //监听单元格编辑
                   table.on('edit(test3)', function(obj){
                     var value = obj.value //得到修改后的值
                     ,data = obj.data //得到所在行所有键值
                     ,field = obj.field; //得到字段
                     layer.msg('[ID: '+ data.id +'] ' + field + ' 字段更改为：'+ value);
                   });
                
                table.reload('test', {
                        elem: '#test'
                        ,page: true
                        ,data: [
                                {memberName: "1"
                                ,team: "留言1"
                                ,deviceCode: "2020-5-1"
                                ,hp: "All"
                                ,hitedNumber: "早安安"
                                ,hitNumber: "0"
                                ,rePlenishBullet: "无"
                                ,reviveNum: '<button type="button" class="layui-btn" id="editFriendGroup" style="height: 28px;line-height: 28px;width: 100%;padding: 0px;">属性</button>'
                                },
                                {memberName: "1"
                                ,team: "留言1"
                                ,deviceCode: "2020-5-1"
                                ,hp: "All"
                                ,hitedNumber: "早安安"
                                ,hitNumber: "0"
                                ,rePlenishBullet: "无"
                                ,reviveNum: '<button type="button" class="layui-btn" id="editFriendGroup" style="height: 28px;line-height: 28px;width: 100%;padding: 0px;">属性</button>'
                                },
                                {memberName: "1"
                                ,team: "留言1"
                                ,deviceCode: "2020-5-1"
                                ,hp: "All"
                                ,hitedNumber: "早安安"
                                ,hitNumber: "0"
                                ,rePlenishBullet: "无"
                                ,reviveNum: '<button type="button" class="layui-btn" id="editFriendGroup" style="height: 28px;line-height: 28px;width: 100%;padding: 0px;">属性</button>'
                                },
                        ]
                });
                
                
                //开启全功能
                  colorpicker.render({
                    elem: '#test-all1'
                    ,color: 'rgba(7, 155, 140, 1)'
                    ,format: 'rgb'
                    ,predefine: true
                    ,alpha: true
                    ,done: function(color){
                      $('#test-all-input').val(color); //向隐藏域赋值
                      layer.tips('给指定隐藏域设置了颜色值：'+ color, this.elem);
                      
                      color || this.change(color); //清空时执行 change
                    }
                    ,change: function(color){
                      //给当前页面头部和左侧设置主题色
                      $('.header-demo,.layui-side .layui-nav').css('background-color', color);
                    }
                  });
                  //开启全功能
                    colorpicker.render({
                      elem: '#test-all2'
                      ,color: 'rgba(7, 155, 140, 1)'
                      ,format: 'rgb'
                      ,predefine: true
                      ,alpha: true
                      ,done: function(color){
                        $('#test-all-input').val(color); //向隐藏域赋值
                        layer.tips('给指定隐藏域设置了颜色值：'+ color, this.elem);
                        
                        color || this.change(color); //清空时执行 change
                      }
                      ,change: function(color){
                        //给当前页面头部和左侧设置主题色
                        $('.header-demo,.layui-side .layui-nav').css('background-color', color);
                      }
                    });
                        //开启全功能
                          colorpicker.render({
                            elem: '#test-all3'
                            ,color: 'rgba(7, 155, 140, 1)'
                            ,format: 'rgb'
                            ,predefine: true
                            ,alpha: true
                            ,done: function(color){
                              $('#test-all-input').val(color); //向隐藏域赋值
                              layer.tips('给指定隐藏域设置了颜色值：'+ color, this.elem);
                              
                              color || this.change(color); //清空时执行 change
                            }
                            ,change: function(color){
                              //给当前页面头部和左侧设置主题色
                              $('.header-demo,.layui-side .layui-nav').css('background-color', color);
                            }
                          });
                        //开启全功能
                          colorpicker.render({
                            elem: '#test-all4'
                            ,color: 'rgba(7, 155, 140, 1)'
                            ,format: 'rgb'
                            ,predefine: true
                            ,alpha: true
                            ,done: function(color){
                              $('#test-all-input').val(color); //向隐藏域赋值
                              layer.tips('给指定隐藏域设置了颜色值：'+ color, this.elem);
                              
                              color || this.change(color); //清空时执行 change
                            }
                            ,change: function(color){
                              //给当前页面头部和左侧设置主题色
                              $('.header-demo,.layui-side .layui-nav').css('background-color', color);
                            }
                          });
                        //开启全功能
                          colorpicker.render({
                            elem: '#test-all5'
                            ,color: 'rgba(7, 155, 140, 1)'
                            ,format: 'rgb'
                            ,predefine: true
                            ,alpha: true
                            ,done: function(color){
                              $('#test-all-input').val(color); //向隐藏域赋值
                              layer.tips('给指定隐藏域设置了颜色值：'+ color, this.elem);
                              
                              color || this.change(color); //清空时执行 change
                            }
                            ,change: function(color){
                              //给当前页面头部和左侧设置主题色
                              $('.header-demo,.layui-side .layui-nav').css('background-color', color);
                            }
                          });
                          
                          //监听折叠
                           element.on('collapse(test)', function(data){
                             layer.msg('展开状态：'+ data.show);
                           });
                          
                          //请选择日期
                           laydate.render({
                             elem: '#test-limit3'
                                 ,type: 'date'
                                 ,trigger: 'click'
                                 ,range: '~'
                             ,min: -7
                             ,max: 0
                                 ,value: '2020-4-12 ~ 2020-4-19'
                                 ,isInitValue: true
                           });
                          
                          //监听指定开关
                          form.on('switch(switchTest)', async function(data){
                              layer.msg('开关checked：'+ (this.checked ? 'true' : 'false'), {
                                offset: '6px'
                              });
                              layer.tips('温馨提示：请注意开关状态的文字可以随意定义，而不仅仅是ON|OFF', data.othis);
                                        
                                  if(this.checked == true) //打开了
                                  {
                                        await gc_friAct.Run();
                                  }
                                  else //关闭了
                                  {
                                        gc_friAct.Stop();
                                  }
                                  
                            });
                          
                          
                          //但是，如果你的HTML是动态生成的，自动渲染就会失效
                          //因此你需要在相应的地方，执行下述方法来进行渲染
                          form.render();
                          
                          element.render('collapse');
        });
        
        //-------------------------------------------------------------------------------------------------------------------------------
        if (opinion() == 0) { //判断页面是pc端还是移动端
                dvWidthFix();
        }
        ToggleManageFriends(); //展开管理好友列表按钮
        
        add_commentthread_textarea_allSelect(); //添加留言框全选
        
        var Obj = new CEmoticonPopup($J('#emoticonbtn'), $J('#comment_textarea')); //表情相关
        //ShowAlertDialog( 'Community Ban & Delete Comments', 'You do not have permissions to view this or you are not logged in.' );
        //ShowConfirmDialog('您点击了移除好友按钮', '是否要移除选择的好友?','移除好友');
        
        CEmoticonPopup.prototype.GetEmoticonClickClosure = function(strEmoticonName) { //重写，以适配多留言框
            var _this = this;
            var strTextToInsert = ':' + strEmoticonName + ':';
            return function() {
                        console.log("表情添加到 "+inBoxonblurID);
                        
                        let obj;
                                switch (inBoxonblurID){
                                        case 0:
                                                obj = document.getElementById("comment_textarea");
                                                break;
                                        case 1:
                                                obj = document.getElementById("comment_textarea_en");
                                                break;
                                        case 2:
                                                obj = document.getElementById("comment_textarea_jp");
                                                break;
                                        case 3:
                                                obj = document.getElementById("comment_textarea_zhc");
                                                break;
                                        case 4:
                                                obj = document.getElementById("comment_textarea_zh_sg");
                                                break;
                                        case 5:
                                                obj = document.getElementById("comment_textarea_zh_hant");
                                                break;
                                        case 6:
                                                obj = document.getElementById("comment_textarea_zh_hk");
                                                break;
                                        case 7:
                                                obj = document.getElementById("comment_textarea_zh_mo");
                                                break;
                                        case 8:
                                                obj = document.getElementById("comment_textarea_zh_tw");
                                                break;
                                        default:
                                                break;
                                }
                        
                var elTextArea = obj; //设置为指定的留言框
                if (elTextArea) {
                    var nSelectionStart = elTextArea.selectionStart;
                    elTextArea.value = elTextArea.value.substr(0, nSelectionStart) + strTextToInsert + elTextArea.value.substr(nSelectionStart);
                    elTextArea.selectionStart = nSelectionStart + strTextToInsert.length;
                }
        
                obj.focus(); //获取焦点，如果不在视野里，会把镜头拉过去
        
                _this.DismissPopup(); //关闭表情输入框
        
                if (window.DismissEmoticonHover)
                    window.setTimeout(DismissEmoticonHover, 1);
            };
        };
        
        CEmoticonPopup.prototype.BuildPopup = function(){ //重写，以彻底隐藏表情选择框的同时提前加载表情
                this.m_$Popup = $J('<div/>', {'class': 'emoticon_popup_ctn' } );
                this.m_$Popup[0].style.display = "none"; //提前隐藏
        
                var $PopupInner = $J('<div/>', {'class': 'emoticon_popup' } );
                this.m_$Popup.append( $PopupInner );
                var $Content = $J('<div/>', {'class': 'emoticon_popup_content' } );
                $PopupInner.append( $Content );
        
                for( var i = 0; i < CEmoticonPopup.sm_rgEmoticons.length; i++ )
                {
                        var strEmoticonName = CEmoticonPopup.sm_rgEmoticons[i].replace( /:/g, '' );
                        var strEmoticonURL = 'https://steamcommunity-a.akamaihd.net/economy/emoticon/' + strEmoticonName;
        
                        var $Emoticon = $J('<div/>', {'class': 'emoticon_option', 'data-emoticon': strEmoticonName } );
                        var $Img = $J('<img/>', {'src': strEmoticonURL, 'class': 'emoticon' } );
                        $Emoticon.append( $Img );
        
                        $Emoticon.click( this.GetEmoticonClickClosure( strEmoticonName ) );
        
                        $Content.append( $Emoticon );
                }
        
                $J(document.body).append( this.m_$Popup );
                PositionEmoticonHover( this.m_$Popup, this.m_$EmoticonButton );
                Obj.DismissPopup(); //关闭表情输入框
        };
        
        setTimeout(async function() {
                Obj.LoadEmoticons();
                CEmoticonPopup.sm_deferEmoticonsLoaded.done(function() {
                        (async function () {
                                if (!Obj.m_$Popup)
                                        Obj.BuildPopup(); //重写，以彻底隐藏表情选择框的同时提前加载表情
                                else
                                        PositionEmoticonHover(Obj.m_$Popup, Obj.m_$EmoticonButton);
                                //await emojiFix();
                                console.log("emoticon loaded Done.");
                        })();
                });
        }, 0); //提前加载表情
        
        _addIDtoHandleLostfocus(); //添加ID来处理丢失的焦点
        document.addEventListener("mousedown", function(e){
                
                        if(e.target.id.indexOf("steamTextStyle_1")==0 || e.target.id.indexOf("LAY-component-form-getval")==0 
                        || e.target.id.indexOf("emoticonbtn")==0 || e.target.className.indexOf("emoticon")==0 || e.target.className.indexOf("commentthread_entry_quotebox")==0
                        || e.target.className.indexOf("fs-label")==0  || e.target.id.indexOf("translationText")==0 || e.target.id.indexOf("select_is")==0
                        || e.target.id.indexOf("addCustomName")==0 || e.target.className.indexOf("btn_grey_black btn_small_thin")==0 || e.target.id.indexOf("comment_submit")==0
                        ){
                                //debugger
                                //if(e.target.id == "LAY-component-form-getval"){
                                e.stopPropagation();
                                e.stopImmediatePropagation();
                                e.preventDefault();
                                //  document.getElementById("LAY-component-form-getval").click();
                                return false;
                                //}
                        }
              
        }, false); //点击指定区域,输入框不失去焦点
        
        
        /*代码位于event.js translationText翻译按钮事件*/
        /*代码位于uiHandler.js 获取输入框和注册的scroll事件*/
        /*代码位于ui.js inBoxShrinkage()判断是否需要重新进行定位*/
        commentTextarea_box = document.getElementsByClassName('commentthread_textarea'); /*获取所有输入框*/
        inBoxShrinkage('comment_textarea',"init"); //解决滚动屏幕事件 Cannot set property 'visible' of undefined，传入"init"参数无实际意义，只为了创建arrComment，而不执行收缩功能，防止Cannot read property 'value' of null错误
        var getAllOffsetTopByChildEle = (ele)=>{
                var OffsetTopSum = 0;
                var ParentObj;
                var currentObj = ele;
                //debugger
                //while(currentObj != document){
                        //OffsetTopSum += currentObj.offsetTop;
                        //currentObj = currentObj.parentNode;
                        currentObj = currentObj.parentNode;
                        OffsetTopSum += currentObj.offsetTop;
                        currentObj = currentObj.parentNode;
                        OffsetTopSum += currentObj.offsetTop;
                        
                        //console.log("offsetTop:",currentObj.offsetTop,"scrollTop:",currentObj.scrollTop,"clientTop:",currentObj.clientTop);
                //}
                return OffsetTopSum;
        };
        
        document.addEventListener('scroll',function(){ /*注册事件: 当滚动时，对所有输入框对象可见性进行判断*/
                var visibleBottom = window.scrollY + document.documentElement.clientHeight; /*可见区域底部高度 = 滚动条高度 + 可视窗口高度 (显示窗口的底部坐标)*/
                var visibleTop = window.scrollY; /*可见区域顶部高度 = 页面的滚动条滚动的距离 (显示窗口的顶部坐标)*/
                
                for (var i = 0; i < commentTextarea_box.length; i++) { /*遍历所有元素并进行判断 commentTextarea_box[i].offsetTop*/
                        //var centerY = getAllOffsetTopByChildEle(commentTextarea_box[i]) + (commentTextarea_box[i].offsetHeight / 2); /*dom元素的中心坐标 = dom元素到最顶端的高度 + 自身高度的一半*/
                        var centerY = getAllOffsetTopByChildEle(commentTextarea_box[i]) - 10; //top
                        var centerX = getAllOffsetTopByChildEle(commentTextarea_box[i]) + commentTextarea_box[i].offsetHeight + 20; //bottom
                        if(centerY > visibleTop& centerX < visibleBottom){ /*当dom元素的中心坐标的X及Y坐标均大于显示窗口的顶部，且小于显示窗口的底部坐标时，那么就可以判断该坐标在可见区域*/
                                arrComment[i].visible = true; /*区域可见*/
                                //console.log('第'+i+'个区域可见',centerY,visibleTop,visibleBottom);
                        }else{
                                arrComment[i].visible = false; /*区域不可见*/
                                //console.log('第'+i+'个区域不可见',centerY,visibleTop,visibleBottom);
                        }
                }
                //console.log('');
        });
        
        console.log("注册所有的事件...");
        await registeredAllEvents(); //注册所有的事件
        if(!addRemoveFriendRemind()){/*添加删除好友提醒*/
                console.log("添加删除好友提醒失败了~!");
        }
        
}

/**
 * event.js
 */
 
async function registeredAllEvents() //注册所有的事件
{
        autoSetPageRefreshAndCloseWarn(true); //自动判断状态并设置页面刷新和关闭警告
        addFriendMultipleSelectionMode(); //添加好友多选模式
        
        
        jQuery("#addCustomName").click(async function() { //在留言框添加自定义称呼标识符
                var inString = document.getElementById("comment_textarea");
                var nSelectionStart = inString.selectionStart;//
                inString.value = inString.value.substr(0,nSelectionStart) + g_conf[0].strRemarkPlaceholder + inString.value.substr(nSelectionStart);
                
                document.getElementById("select_isCustom_checkbox").checked = true; //自动选择 自定义称呼模式
        });
        
        //<留言时的时间戳-目标时间戳>
        jQuery("#setTimeInterval").click(async function() { //为选择的好友设置留言时间间隔
                
        });
        
        jQuery("#unsetTimeInterval").click(async function() { //为选择的好友取消设置留言时间间隔
                
        });
        
        jQuery("#translationText").click(async function() { //翻译
                //获取选择的语言
                var selectLanguage = jQuery("#selectBoxID").ySelectedTexts(",");
                var selectLanguageArr = selectLanguage.split(',');
                if (selectLanguageArr.length == 1 && selectLanguageArr[0] == "")
                        return;
                console.log("selectLanguageArr", selectLanguageArr);
                //获取输入的内容
                var inString = document.getElementById("comment_textarea").value;
                if (inString == "")
                        return;
                console.log("inString", inString);
                //获取原始语言选项
                var options = document.getElementById('origLanguageSelectBox'); //获取选中的项目
                var optionsValue = options[options.selectedIndex].value;
                console.log("optionsValue", optionsValue);
                for (let i = selectLanguageArr.length -1; i >= 0 ; i--) { //for (let i = 0; i < selectLanguageArr.length; i++) {
                        g_conf[0].YunStatus = true; //正在运行
                        
                        var _id;
                        var newStrText;
                        switch (selectLanguageArr[i]) {
                                case '中文简体':
                                        _id = "_zhc";
                                        newStrText = await GoogleTranslateRequest(optionsValue, zhc, inString);
                                        console.log("翻译为中文简体:", newStrText);
                                        
                                        if (document.getElementById('comment_textarea_zhc') == null) {
                                                jQuery("#translationOptions").after(
                                                        '\
                                                                <div class="commentthread_entry_quotebox">\
                                                                        <span>' + '翻译为中文简体' +
                                                        '</span>\
                                                                        <textarea class="commentthread_textarea" id="comment_textarea' + _id +
                                                        '" onfocus="inBoxonblurID=3;openThisAndCloseOtherAllinBoxShrinkage(\'comment_textarea_zhc\',false);" onClick="" onblur="inBoxonblurID=3;inBoxShrinkage(\'comment_textarea_zhc\',true);" placeholder="添加留言(中文简体)" style="overflow: hidden; height: 28px;"></textarea>\
                                                                </div>'
                                                );
                                        }
                                        document.getElementById('comment_textarea_zhc').value = newStrText;
                                        break;
                                case '英语':
                                        _id = "_en";
                                        newStrText = await GoogleTranslateRequest(optionsValue, en, inString);
                                        console.log("翻译为英语:", newStrText);
        
                                        if (document.getElementById('comment_textarea_en') == null) {
                                                jQuery("#translationOptions").after(
                                                        '\
                                                                <div class="commentthread_entry_quotebox">\
                                                                        <span>' + '翻译为英语' +
                                                        '</span>\
                                                                        <textarea class="commentthread_textarea" id="comment_textarea' + _id +
                                                        '" onfocus="inBoxonblurID=1;openThisAndCloseOtherAllinBoxShrinkage(\'comment_textarea_en\',false);" onClick="" onblur="inBoxonblurID=1;inBoxShrinkage(\'comment_textarea_en\',true);" placeholder="添加留言(英语)" style="overflow: hidden; height: 28px;"></textarea>\
                                                                </div>'
                                                );
                                        }
                                        document.getElementById('comment_textarea_en').value = newStrText;
                                        break;
                                case '日语':
                                        _id = "_jp";
                                        newStrText = await GoogleTranslateRequest(optionsValue, jp, inString);
                                        console.log("翻译为日语:", newStrText);
        
                                        if (document.getElementById('comment_textarea_jp') == null) {
                                                jQuery("#translationOptions").after(
                                                        '\
                                                                <div class="commentthread_entry_quotebox">\
                                                                        <span>' + '翻译为日语' +
                                                        '</span>\
                                                                        <textarea class="commentthread_textarea" id="comment_textarea' + _id +
                                                        '" onfocus="inBoxonblurID=2;openThisAndCloseOtherAllinBoxShrinkage(\'comment_textarea_jp\',false);" onClick="" onblur="inBoxonblurID=2;inBoxShrinkage(\'comment_textarea_jp\',true);" placeholder="添加留言(日语)" style="overflow: hidden; height: 28px;"></textarea>\
                                                                </div>'
                                                );
                                        }
                                        document.getElementById('comment_textarea_jp').value = newStrText;
                                        break;
                                case "马新简体[zh-sg]":
                                        _id = "_zh_sg";
                                        newStrText = await CNTranslateRequest('zh-sg', inString);
                                        console.log("翻译为马新简体[zh-sg]:", newStrText);
        
                                        if (document.getElementById('comment_textarea_zh_sg') == null) {
                                                jQuery("#translationOptions").after(
                                                        '\
                                                                <div class="commentthread_entry_quotebox">\
                                                                        <span>' + '翻译为马新简体' +
                                                        '</span>\
                                                                        <textarea class="commentthread_textarea" id="comment_textarea' + _id +
                                                        '" onfocus="inBoxonblurID=4;openThisAndCloseOtherAllinBoxShrinkage(\'comment_textarea_zh_sg\',false);" onClick="" onblur="inBoxonblurID=4;inBoxShrinkage(\'comment_textarea_zh_sg\',true);" placeholder="添加留言(马新简体)" style="overflow: hidden; height: 28px;"></textarea>\
                                                                </div>'
                                                );
                                        }
                                        document.getElementById('comment_textarea_zh_sg').value = newStrText;
                                        break;
                                case "繁體中文[zh-hant]":
                                        _id = "_zh_hant";
                                        newStrText = await CNTranslateRequest('zh-hant', inString);
                                        console.log("翻译为繁體中文[zh-hant]:", newStrText);
        
                                        if (document.getElementById('comment_textarea_zh_hant') == null) {
                                                jQuery("#translationOptions").after(
                                                        '\
                                                                <div class="commentthread_entry_quotebox">\
                                                                        <span>' + '翻译为繁體中文' +
                                                        '</span>\
                                                                        <textarea class="commentthread_textarea" id="comment_textarea' + _id +
                                                        '" onfocus="inBoxonblurID=5;openThisAndCloseOtherAllinBoxShrinkage(\'comment_textarea_zh_hant\',false);" onClick="" onblur="inBoxonblurID=5;inBoxShrinkage(\'comment_textarea_zh_hant\',true);" placeholder="添加留言(繁體中文)" style="overflow: hidden; height: 28px;"></textarea>\
                                                                </div>'
                                                );
                                        }
                                        document.getElementById('comment_textarea_zh_hant').value = newStrText;
                                        break;
                                case "繁體中文(香港)[zh-hk]":
                                        _id = "_zh_hk";
                                        newStrText = await CNTranslateRequest('zh-hk', inString);
                                        console.log("翻译为繁體中文(香港)[zh-hk]:", newStrText);
        
                                        if (document.getElementById('comment_textarea_zh_hk') == null) {
                                                jQuery("#translationOptions").after(
                                                        '\
                                                                <div class="commentthread_entry_quotebox">\
                                                                        <span>' + '翻译为繁體中文(香港)' +
                                                        '</span>\
                                                                        <textarea class="commentthread_textarea" id="comment_textarea' + _id +
                                                        '" onfocus="inBoxonblurID=6;openThisAndCloseOtherAllinBoxShrinkage(\'comment_textarea_zh_hk\',false);" onClick="" onblur="inBoxonblurID=6;inBoxShrinkage(\'comment_textarea_zh_hk\',true);" placeholder="添加留言(繁體中文(香港))" style="overflow: hidden; height: 28px;"></textarea>\
                                                                </div>'
                                                );
                                        }
                                        document.getElementById('comment_textarea_zh_hk').value = newStrText;
                                        break;
                                case "繁體中文(澳门)[zh-mo]":
                                        _id = "_zh_mo";
                                        newStrText = await CNTranslateRequest('zh-mo', inString);
                                        console.log("翻译为繁體中文(香港)[zh-hk]:", newStrText);
        
                                        if (document.getElementById('comment_textarea_zh_mo') == null) {
                                                jQuery("#translationOptions").after(
                                                        '\
                                                                <div class="commentthread_entry_quotebox">\
                                                                        <span>' + '翻译为繁體中文(澳门)' +
                                                        '</span>\
                                                                        <textarea class="commentthread_textarea" id="comment_textarea' + _id +
                                                        '" onfocus="inBoxonblurID=7;openThisAndCloseOtherAllinBoxShrinkage(\'comment_textarea_zh_mo\',false);" onClick="" onblur="inBoxonblurID=7;inBoxShrinkage(\'comment_textarea_zh_mo\',true);" placeholder="添加留言(繁體中文(澳门))" style="overflow: hidden; height: 28px;"></textarea>\
                                                                </div>'
                                                );
                                        }
                                        document.getElementById('comment_textarea_zh_mo').value = newStrText;
                                        break;
                                case "繁體中文(台湾)[zh-tw]":
                                        _id = "_zh_tw";
                                        newStrText = await CNTranslateRequest('zh-tw', inString);
                                        console.log("翻译为繁體中文(台湾)[zh-tw]:", newStrText);
        
                                        if (document.getElementById('comment_textarea_zh_tw') == null) {
                                                jQuery("#translationOptions").after(
                                                        '\
                                                                <div class="commentthread_entry_quotebox">\
                                                                        <span>' + '翻译为繁體中文(台湾)' +
                                                        '</span>\
                                                                        <textarea class="commentthread_textarea" id="comment_textarea' + _id +
                                                        '" onfocus="inBoxonblurID=8;openThisAndCloseOtherAllinBoxShrinkage(\'comment_textarea_zh_tw\',false);" onClick="" onblur="inBoxonblurID=8;inBoxShrinkage(\'comment_textarea_zh_tw\',true);" placeholder="添加留言(繁體中文(台湾))" style="overflow: hidden; height: 28px;"></textarea>\
                                                                </div>'
                                                );
                                        }
                                        document.getElementById('comment_textarea_zh_tw').value = newStrText;
                                        break;
                                default:
                                g_conf[0].YunStatus = false; //没有运行
                                        break;
                        }
                        g_conf[0].isTranslationText = true; //进行了翻译
                        g_conf[0].YunStatus = false; //没有运行
        
                }
                commentTextarea_box = document.getElementsByClassName('commentthread_textarea'); /*获取所有输入框*/
                
                var change1;
                var autoTextarea = function(elem, extra, maxHeight) {
                        extra = extra || 0;
                        var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
                                isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),
                                addEvent = function(type, callback) {
                                        elem.addEventListener ?
                                                elem.addEventListener(type, callback, false) :
                                                elem.attachEvent('on' + type, callback);
                                },
                                getStyle = elem.currentStyle ? function(name) {
                                        var val = elem.currentStyle[name];
                                        if (name === 'height' && val.search(/px/i) !== 1) {
                                                var rect = elem.getBoundingClientRect();
                                                return rect.bottom - rect.top -
                                                        parseFloat(getStyle('paddingTop')) -
                                                        parseFloat(getStyle('paddingBottom')) + 'px';
                                        };
                                        return val;
                                } : function(name) {
                                        return getComputedStyle(elem, null)[name];
                                },
                                minHeight = parseFloat(getStyle('height'));
                        elem.style.resize = 'none';
                
                change1 = function(e,id) {
                                                var scrollTop, height,
                                                        padding = 0,
                                                        style = elem.style;
                                                var obj = document.getElementById('strInBytes');
                                                var commentText;
                                                if(id == undefined || id == null)
                                                        commentText = document.getElementById(window.event.target.id);
                                                else
                                                        commentText = document.getElementById(id);
                                                var numText = wordCount(commentText.value);
                                                obj.innerHTML =  "当前字符字节数: <span id='strInBytes_Text'>" + numText + '</span>/999';
                                                if (wordCount(commentText.value) >= 1000) {
                                                        document.getElementById('strInBytes_Text').style.color = '#FF0000';
                                                        commentText.style.background = '#7b3863';
                                                        if(g_conf[0].isCommentRunStatus == false)/*如果正在留言则不清除(没有留言则清除)*/
                                                                jQuery('#log_head').html('');
                                                        jQuery('#log_head').html("<br><b style='color:#2CD8D6;'>字数超标啦! 请保持在1000字符以下. " + '当前字数:' + numText + '<b>');
                                                        g_conf[0].isWarnInfo = true;
                                                } else {        
                                                        document.getElementById('strInBytes_Text').style.color = '#32CD32';
                                                        commentText.style.background = '#1b2838';
                                                        if(g_conf[0].isCommentRunStatus == false && g_conf[0].isWarnInfo == true){ /*没有留言并且有警告信息才清除*/
                                                                jQuery('#log_head').html('');
                                                                g_conf[0].isWarnInfo = false;
                                                        }
                                                }
                                                if (elem._length === elem.value.length) return;
                                                        elem._length = elem.value.length;
                                                if (!isFirefox && !isOpera) {
                                                        padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
                                                };
                                                scrollTop = document.body.scrollTop || document.documentElement.scrollTop; /*定位到最后*/
                                                elem.style.height = minHeight + 'px';
                                                if (elem.scrollHeight >= minHeight) {
                                                        if (maxHeight && elem.scrollHeight > maxHeight) {
                                                                height = maxHeight - padding;
                                                                style.overflowY = 'auto';
                                                        } else {
                                                                height = elem.scrollHeight - padding;
                                                                style.overflowY = 'hidden';
                                                        };
                                                        style.height = height + extra + 'px';
                                                        var nHeight1 = height + extra;
                                                        /*console.log('nHeight1',nHeight1,'newStr',newStr);*/
                                                        /*https://blog.csdn.net/weixin_34281477/article/details/93702604*/
                                                        /*https://www.cnblogs.com/cblogs/p/9293522.html*/
                                                        /*https://www.w3school.com.cn/tiy/t.asp?f=jseg_replace_1*/
                                                        var iIndex;
                                                        for(let i=0;i<arrComment.length;i++)
                                                        {
                                                                if(id == undefined || id == null){
                                                                        if(arrComment[i].id == window.event.target.id){
                                                                                iIndex = i;
                                                                                break;
                                                                        }
                                                                }
                                                                else{
                                                                        if(arrComment[i].id == id){
                                                                                iIndex = i;
                                                                                break;
                                                                        }
                                                                }
                                                        }
                                                        debugger;
                                                        arrComment[iIndex].height = nHeight1;/*存储*/
                                                        scrollTop += parseInt(style.height) - elem.currHeight;
                                                        if(!isNaN(scrollTop)){
                                                                document.body.scrollTop = scrollTop;
                                                                document.documentElement.scrollTop = scrollTop;
                                                        }
                                                        elem.currHeight = parseInt(style.height);
                                                }
                                };
                };
                        inBoxShrinkage('comment_textarea_en',"init");//解决滚动屏幕事件 Cannot set property 'visible' of undefined，传入"init"参数无实际意义，只为了创建arrComment，而不执行收缩功能，防止Cannot read property 'value' of null错误
                        inBoxShrinkage('comment_textarea_jp',"init");
                        inBoxShrinkage('comment_textarea_zhc',"init");
                        inBoxShrinkage('comment_textarea_zh_sg',"init");
                        inBoxShrinkage('comment_textarea_zh_hant',"init");
                        inBoxShrinkage('comment_textarea_zh_hk',"init");
                        inBoxShrinkage('comment_textarea_zh_mo',"init");
                        inBoxShrinkage('comment_textarea_zh_tw',"init");
                        arrComment[1].height = 0;
                        arrComment[1].scrollTop = 0;
                        
                        arrComment[2].height = 0;
                        arrComment[2].scrollTop = 0;
                        
                        arrComment[3].height = 0;
                        arrComment[3].scrollTop = 0;
                        
                        arrComment[4].height = 0;
                        arrComment[4].scrollTop = 0;
                        
                        arrComment[5].height = 0;
                        arrComment[5].scrollTop = 0;
                        
                        arrComment[6].height = 0;
                        arrComment[6].scrollTop = 0;
                        
                        arrComment[7].height = 0;
                        arrComment[7].scrollTop = 0;
                        
                        arrComment[8].height = 0;
                        arrComment[8].scrollTop = 0;
                /*代码位于event.js translationText翻译按钮事件*/
                /*代码位于uiHandler.js 获取输入框和注册的scroll事件*/
                /*代码位于ui.js inBoxShrinkage()判断是否需要重新进行定位*/
        });
        
        jQuery("#setNoLeave").click(async function() { //为选择的好友设置不留言
                var SpecialName = undefined;
                var steamName = undefined;
                var name = undefined;
                var mode = 0;
                const total = jQuery("#search_results .selected").length; //选择的朋友总数
                if (total > 0) //选择的朋友总数
                {
                        if(g_conf[0].isNoCommentRunStatus == false)
                                jQuery("#log_head1, #log_body1").html("");
                        
                        var jqobj = jQuery("#search_results .selected");
                        
                        for (let i = 0; i < jqobj.length; i++) {
                                let cur = jqobj.get(i);
                                let profileID = cur.getAttribute("data-steamid");
                                g_conf[0].YunStatus = true; //正在运行
                                g_conf[0].isNoCommentRunStatus = true;
                                //--------------------------------------------------------------------
                                SpecialName = undefined;
                                steamName = undefined;
                                
                                var nostrNoOperate = g_conf[0].strNoOperate + "-N";
                                
                                // if (document.URL.indexOf("/friends") == -1) { //如果是在个人资料页面
                                //      //获取备注
                                //      var SpecialNameobj = document.getElementsByClassName("nickname"); //nickname
                                //      SpecialName = undefined;
                                //      if (SpecialNameobj != "undefined") {
                                //              SpecialName = SpecialNameobj[0].innerText; //备注
                                //      }
                                //      //获取steam名称
                                //      steamName = document.getElementsByClassName("actual_persona_name")[0].innerText; //steam名称
                                //      name = steamName;
                                // } else //否则如果是好友界面
                                //{
                                        //获取名称,然后判断是备注还是steam名称
                                        var SpecialNameobj = cur.getElementsByClassName("friend_block_content");
                                        var nicknameObj = cur.getElementsByClassName("player_nickname_hint");
                                        SpecialName = undefined;
                        
                        
                                        if (SpecialNameobj.length > 0) //安全检查
                                        {
                                                if (nicknameObj.length > 0) //节点存在则是备注,不存在则是steam名称
                                                {
                                                        console.log("获取到的是备注");
                                                        SpecialName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("*")); //提取备注
                                                        steamName = undefined; //就没有名称
                                                        if (SpecialName.indexOf(g_conf[0].strNoOperate) != -1 || SpecialName.indexOf(nostrNoOperate) != -1) //检查是否设置了不留言标识
                                                        {
                                                                jQuery("#log_body1")[0].innerHTML +=
                                                                        "<a style='color:#00ffd8;' target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID +
                                                                        "\">" + '[' + (i + 1) + '/' + total + '] 已跳过, 没有设置备注! ' + profileID + '  ' + SpecialName + "</a><br>";
                                                                continue;
                                                        }
                                                        name = SpecialName;
                                                        name = name + g_conf[0].strNoOperate; //组合
                                                } else if (nicknameObj.length == 0) {
                                                        console.log("获取到的是steam名称");
                                                        SpecialName = undefined; //就没有备注
                                                        steamName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("\n")); //提取steam名称
                                                        name = steamName;
                                                        name = name + nostrNoOperate; //组合
                                                }
                                        }
                                //}
                                
                                console.log("[Debug] name:", name);
                        
                                (function(i, profileID) {
                                        var URL = "https://steamcommunity.com/profiles/" + profileID + "/ajaxsetnickname/";
                        
                                        jQuery.post(URL, {
                                                nickname: name,
                                                sessionid: g_sessionID
                                        }, function(response) {
                                                if (response.success === false) {
                                                        jQuery("#log_body1")[0].innerHTML +=
                                                                "<a style='color:#ff2c85;' target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID +
                                                                "\">" + '[' + (i + 1) + '/' + total + '] 设置备注失败了! ' + profileID + '  ' + name +
                                                                '&nbsp;&nbsp;&nbsp;&nbsp;' + response.error + "</a><br>";
                                                } else {
                                                        jQuery("#log_body1")[0].innerHTML +=
                                                                '[' + (i + 1) + '/' + total + '] ' +
                                                                "成功设置备注于 <a target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID + "\">" +
                                                                profileID + '  ' + name + "</a>" +
                                                                "<a style='color:#FB7299;' target='_blank' href=\"http://steamcommunity.com/profiles/" +
                                                                profileID + "\">" + "</a><br>";
                                                }
                                        }).fail(function() {
                                                jQuery("#log_body1")[0].innerHTML +=
                                                        '<span style="color:#DA2626;">[' + (i + 1) + '/' + total + '] ' +
                                                        "无法设置备注于 <a style='color:#DA2626;' target='_blank' href=\"http://steamcommunity.com/profiles/" +
                                                        profileID + "\">" +
                                                        profileID + '  ' + name + "</a></span><br>";
                                        }).always(function() {
                                                jQuery("#log_head1").html("<br><b>当前处理了 " + (i + 1) + "个, 总计 " + total + " 个好友.<b>");
                                        });
                        
                                })(i, profileID);
                                await sleep(100);
                                //console.log(cur)
                        }
                        g_conf[0].YunStatus = false; //没有运行
                        g_conf[0].isNoCommentRunStatus = false;
                        window.location.reload(true); //强制从服务器重新加载当前页面
                }
        });
        
        jQuery("#unsetNoLeave").click(async function() { //为选择的好友取消设置不留言
                var SpecialName = undefined;
                var steamName = undefined;
                var name = undefined;
                var mode = 0;
                const total = jQuery("#search_results .selected.selectable").length; //选择的朋友总数
                if (total > 0) //选择的朋友总数
                {
                        if(g_conf[0].isNoCommentRunStatus == false)
                                jQuery("#log_head1, #log_body1").html("");
                                
                        var jqobj = jQuery("#search_results .selected.selectable");
                        
                        for (let i = 0; i < jqobj.length; i++) {
                                let cur = jqobj.get(i);
                                let profileID = cur.getAttribute("data-steamid");
                                g_conf[0].YunStatus = true; //正在运行
                                g_conf[0].isNoCommentRunStatus = true;
                                //--------------------------------------------------------------------
                                SpecialName = undefined;
                                steamName = undefined;
                        
                                var nostrNoOperate = g_conf[0].strNoOperate + "-N";
                        
                                // if (document.URL.indexOf("/friends") == -1) { //如果是在个人资料页面
                                //      //获取备注
                                //      var SpecialNameobj = document.getElementsByClassName("nickname"); //nickname
                                //      SpecialName = undefined;
                                //      if (SpecialNameobj != "undefined") {
                                //              SpecialName = SpecialNameobj[0].innerText; //备注
                                //      }
                                //      //获取steam名称
                                //      steamName = document.getElementsByClassName("actual_persona_name")[0].innerText; //steam名称
                                //      name = steamName;
                                // } else //否则如果是好友界面
                                //{
                                        //获取名称,然后判断是备注还是steam名称
                                        var SpecialNameobj = cur.getElementsByClassName("friend_block_content");
                                        var nicknameObj = cur.getElementsByClassName("player_nickname_hint");
                                        SpecialName = undefined;
                                        
                                        if (SpecialNameobj.length > 0) //安全检查
                                        {
                                                if (nicknameObj.length > 0) //节点存在则是备注,不存在则是steam名称
                                                {
                                                        console.log("获取到的是备注");
                                                        SpecialName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("*")); //提取备注
                                                        steamName = undefined; //就没有名称
                                                        if (SpecialName.lastIndexOf(nostrNoOperate) != -1) //检查是否设置了国籍标识
                                                        {
                                                                SpecialName = SpecialName.slice(0,SpecialName.lastIndexOf(nostrNoOperate)); //去掉国籍标识
                                                                name = ""; //去掉备注
                                                        }
                                                        else if (SpecialName.lastIndexOf(g_conf[0].strNoOperate) != -1) //检查是否设置了国籍标识
                                                        {
                                                                SpecialName = SpecialName.slice(0,SpecialName.lastIndexOf(g_conf[0].strNoOperate)); //去掉国籍标识
                                                                name = SpecialName; //使用原来的备注
                                                        }else {
                                                                jQuery("#log_body1")[0].innerHTML +=
                                                                        "<a style='color:#00ffd8;' target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID +
                                                                        "\">" + '[' + (i + 1) + '/' + total + '] 已跳过, 没有设置国籍不能取消! ' + profileID + '  ' + SpecialName + "</a><br>";
                                                                continue;
                                                        }
                                                } else if (nicknameObj.length == 0) {
                                                        console.log("获取到的是steam名称");
                                                        steamName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("\n")); //提取steam名称
                                                        jQuery("#log_body1")[0].innerHTML +=
                                                                "<a style='color:#00ffd8;' target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID +
                                                                "\">" + '[' + (i + 1) + '/' + total + '] 已跳过, 没有备注不能取消! ' + profileID + '  ' + steamName + "</a><br>";
                                                        continue;
                                                }
                                        }
                                //}
                                console.log("[Debug] name:", name);
                                (function(i, profileID) {
                                        var URL = "https://steamcommunity.com/profiles/" + profileID + "/ajaxsetnickname/";
                        
                                        jQuery.post(URL, {
                                                nickname: name,
                                                sessionid: g_sessionID
                                        }, function(response) {
                                                if (response.success === false) {
                                                        jQuery("#log_body1")[0].innerHTML +=
                                                                "<a style='color:#ff2c85;' target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID +
                                                                "\">" + '[' + (i + 1) + '/' + total + '] 设置备注失败了! ' + profileID + '  ' + name +
                                                                '&nbsp;&nbsp;&nbsp;&nbsp;' + response.error + "</a><br>";
                                                } else {
                                                        jQuery("#log_body1")[0].innerHTML +=
                                                                '[' + (i + 1) + '/' + total + '] ' +
                                                                "成功设置备注于 <a target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID + "\">" +
                                                                profileID + '  ' + name + "</a>" +
                                                                "<a style='color:#FB7299;' target='_blank' href=\"http://steamcommunity.com/profiles/" +
                                                                profileID + "\">" + "</a><br>";
                                                }
                                        }).fail(function() {
                                                jQuery("#log_body1")[0].innerHTML +=
                                                        '[' + (i + 1) + '/' + total + '] ' +
                                                        "<span style='color:#DA2626;'>无法设置备注于 <a style='color:#DA2626;' target='_blank' href=\"http://steamcommunity.com/profiles/" +
                                                        profileID + "\">" +
                                                        profileID + '  ' + name + "</a></span><br>";
                                        }).always(function() {
                                                jQuery("#log_head1").html("<br><b>当前处理了 " + (i + 1) + "个, 总计 " + total + " 个好友.<b>");
                                        });
                        
                                })(i, profileID);
                                await sleep(1000);
                                //console.log(cur)
                        }
                        g_conf[0].YunStatus = false; //没有运行
                        g_conf[0].isNoCommentRunStatus = false;
                        window.location.reload(true); //强制从服务器重新加载当前页面
                }
        });
        
        jQuery("#setNationality").click(async function() { //为选择的好友设置国籍标识
                //获取指定的国籍标识
                var options = document.getElementById('nationalitySelectBox'); //获取选中的项目
                var optionsValue = options[options.selectedIndex].value;
                console.log("optionsValue", optionsValue);
                var strNationality = '{' + optionsValue + '}'; //组合国籍标识
                var strSpecialNationality = '{' + optionsValue + '-N}'; //组合格外国籍标识
                //遍历所有选择的好友,
                //对已经设置了备注的好友,添加国籍标识;
        
                var SpecialName = undefined;
                var steamName = undefined;
                var name = undefined;
                var mode = 0;
                const total = jQuery("#search_results .selected").length; //选择的朋友总数
                if (total > 0) //选择的朋友总数
                {
                        if(g_conf[0].isNationalityRunStatus == false)
                                jQuery("#log_head1, #log_body1").html("");
                        
                        var jqobj = jQuery("#search_results .selected");
        
                        for (let i = 0; i < jqobj.length; i++) {
                                let cur = jqobj.get(i);
                                let profileID = cur.getAttribute("data-steamid");
                                g_conf[0].YunStatus = true; //正在运行
                                g_conf[0].isNationalityRunStatus = true;
                                //--------------------------------------------------------------------
                                SpecialName = undefined;
                                steamName = undefined;
        
                                // if (document.URL.indexOf("/friends") == -1) { //如果是在个人资料页面
                                //      //获取备注
                                //      var SpecialNameobj = document.getElementsByClassName("nickname"); //nickname
                                //      SpecialName = undefined;
                                //      if (SpecialNameobj != "undefined") {
                                //              SpecialName = SpecialNameobj[0].innerText; //备注
                                //      }
                                //      //获取steam名称
                                //      steamName = document.getElementsByClassName("actual_persona_name")[0].innerText; //steam名称
                                //      name = steamName;
                                // } else //否则如果是好友界面
                                //{
                                        //获取名称,然后判断是备注还是steam名称
                                        var SpecialNameobj = cur.getElementsByClassName("friend_block_content");
                                        var nicknameObj = cur.getElementsByClassName("player_nickname_hint");
                                        SpecialName = undefined;
        
        
                                        if (SpecialNameobj.length > 0) //安全检查
                                        {
                                                if (nicknameObj.length > 0) //节点存在则是备注,不存在则是steam名称
                                                {
                                                        console.log("获取到的是备注");
                                                        SpecialName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("*")); //提取备注
                                                        steamName = undefined; //就没有名称
                                                        if (SpecialName.indexOf('{CN}') != -1 || SpecialName.indexOf('{CN-N}') != -1 ||
                                                                SpecialName.indexOf('{EN}') != -1 || SpecialName.indexOf('{EN-N}') != -1 ||
                                                                SpecialName.indexOf('{JP}') != -1 || SpecialName.indexOf('{JP-N}') != -1 ||
                                                                SpecialName.indexOf('{CN-SG}') != -1 || SpecialName.indexOf('{CN-SG-N}') != -1 ||
                                                                SpecialName.indexOf('{CN-HANT}') != -1 || SpecialName.indexOf('{CN-HANT-N}') != -1 ||
                                                                SpecialName.indexOf('{CN-HK}') != -1 || SpecialName.indexOf('{CN-HK-N}') != -1 ||
                                                                SpecialName.indexOf('{CN-MO}') != -1 || SpecialName.indexOf('{CN-MO-N}') != -1 ||
                                                                SpecialName.indexOf('{CN-TW}') != -1 || SpecialName.indexOf('{CN-TW-N}') != -1
                                                        ) //检查是否设置了国籍标识
                                                        {
                                                                if (SpecialName.indexOf('{' + optionsValue + '}') != -1 || SpecialName.indexOf('{' + optionsValue + '-N}') !=
                                                                        -1) //是否与待设置的国籍标识相同
                                                                {
                                                                        jQuery("#log_body1")[0].innerHTML +=
                                                                                "<a style='color:#00ffd8;' target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID +
                                                                                "\">" + '[' + (i + 1) + '/' + total + '] 已跳过, 没有设置备注! ' + profileID + '  ' + SpecialName + "</a><br>";
                                                                        continue;
                                                                } else //重新设置国籍标识
                                                                {
                                                                        if (SpecialName.indexOf('-N}') != -1) {
                                                                                mode = 1;
                                                                        }
                                                                        SpecialName = SpecialName.slice(SpecialName.indexOf('}') + 1); //去掉国籍标识
                                                                }
                                                        }
                                                        if (mode == 0) {
                                                                name = strNationality + SpecialName; //组合成为新的名称  国籍标识
                                                        } else if (mode == 1) {
                                                                name = strSpecialNationality + SpecialName; //组合成为新的名称  格外国籍标识
                                                                mode = 0;
                                                        }
        
        
                                                } else if (nicknameObj.length == 0) {
                                                        console.log("获取到的是steam名称");
                                                        SpecialName = undefined; //就没有备注
                                                        steamName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("\n")); //提取steam名称
                                                        name = strSpecialNationality + steamName; //组合成为新的名称  格外国籍标识
                                                }
                                        }
                                //}
                                console.log("[Debug] name:", name);
        
                                (function(i, profileID) {
                                        var URL = "https://steamcommunity.com/profiles/" + profileID + "/ajaxsetnickname/";
        
                                        jQuery.post(URL, {
                                                nickname: name,
                                                sessionid: g_sessionID
                                        }, function(response) {
                                                if (response.success === false) {
                                                        jQuery("#log_body1")[0].innerHTML +=
                                                                "<a style='color:#ff2c85;' target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID +
                                                                "\">" + '[' + (i + 1) + '/' + total + '] 设置备注失败了! ' + profileID + '  ' + name +
                                                                '&nbsp;&nbsp;&nbsp;&nbsp;' + response.error + "</a><br>";
                                                } else {
                                                        jQuery("#log_body1")[0].innerHTML +=
                                                                '[' + (i + 1) + '/' + total + '] ' +
                                                                "成功设置备注于 <a target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID + "\">" +
                                                                profileID + '  ' + name + "</a>" +
                                                                "<a style='color:#FB7299;' target='_blank' href=\"http://steamcommunity.com/profiles/" +
                                                                profileID + "\">" + "</a><br>";
                                                }
                                        }).fail(function() {
                                                jQuery("#log_body1")[0].innerHTML +=
                                                        '<span style="color:#DA2626;">[' + (i + 1) + '/' + total + '] ' +
                                                        "无法设置备注于 <a style='color:#DA2626;' target='_blank' href=\"http://steamcommunity.com/profiles/" +
                                                        profileID + "\">" +
                                                        profileID + '  ' + name + "</a></span><br>";
                                        }).always(function() {
                                                jQuery("#log_head1").html("<br><b>当前处理了 " + (i + 1) + "个, 总计 " + total + " 个好友.<b>");
                                        });
        
                                })(i, profileID);
                                await sleep(100);
                                //console.log(cur)
                        }
                        g_conf[0].YunStatus = false; //没有运行
                        g_conf[0].isNationalityRunStatus = false;
                        window.location.reload(true); //强制从服务器重新加载当前页面
                }
        
        });
        
        jQuery("#unsetNationality").click(async function() { //为选择的好友取消国籍标识
                //获取指定的国籍标识
                var options = document.getElementById('nationalitySelectBox'); //获取选中的项目
                var optionsValue = options[options.selectedIndex].value;
                console.log("optionsValue", optionsValue);
                var strNationality = '{' + optionsValue + '}'; //组合国籍标识
                var strSpecialNationality = '{' + optionsValue + '-N}'; //组合格外国籍标识
                //遍历所有选择的好友,
                //对已经设置了备注的好友,添加国籍标识;
        
                var SpecialName = undefined;
                var steamName = undefined;
                var name = undefined;
                var mode = 0;
                const total = jQuery("#search_results .selected.selectable").length; //选择的朋友总数
                if (total > 0) //选择的朋友总数
                {
                        if(g_conf[0].isNationalityRunStatus == false)
                                jQuery("#log_head1, #log_body1").html("");
                                
                        var jqobj = jQuery("#search_results .selected.selectable");
        
                        for (let i = 0; i < jqobj.length; i++) {
                                let cur = jqobj.get(i);
                                let profileID = cur.getAttribute("data-steamid");
                                g_conf[0].YunStatus = true; //正在运行
                                g_conf[0].isNationalityRunStatus = true;
                                //--------------------------------------------------------------------
                                SpecialName = undefined;
                                steamName = undefined;
        
                                // if (document.URL.indexOf("/friends") == -1) { //如果是在个人资料页面
                                //      //获取备注
                                //      var SpecialNameobj = document.getElementsByClassName("nickname"); //nickname
                                //      SpecialName = undefined;
                                //      if (SpecialNameobj != "undefined") {
                                //              SpecialName = SpecialNameobj[0].innerText; //备注
                                //      }
                                //      //获取steam名称
                                //      steamName = document.getElementsByClassName("actual_persona_name")[0].innerText; //steam名称
                                //      name = steamName;
                                // } else //否则如果是好友界面
                                //{
                                        //获取名称,然后判断是备注还是steam名称
                                        var SpecialNameobj = cur.getElementsByClassName("friend_block_content");
                                        var nicknameObj = cur.getElementsByClassName("player_nickname_hint");
                                        SpecialName = undefined;
        
                                        if (SpecialNameobj.length > 0) //安全检查
                                        {
                                                if (nicknameObj.length > 0) //节点存在则是备注,不存在则是steam名称
                                                {
                                                        console.log("获取到的是备注");
                                                        SpecialName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("*")); //提取备注
                                                        steamName = undefined; //就没有名称
                                                        if (SpecialName.indexOf('{CN}') != -1 ||
                                                                SpecialName.indexOf('{EN}') != -1 ||
                                                                SpecialName.indexOf('{JP}') != -1 ||
                                                                SpecialName.indexOf('{CN-SG}') != -1 ||
                                                                SpecialName.indexOf('{CN-HANT}') != -1 ||
                                                                SpecialName.indexOf('{CN-HK}') != -1 ||
                                                                SpecialName.indexOf('{CN-MO}') != -1 ||
                                                                SpecialName.indexOf('{CN-TW}') != -1
                                                        ) //检查是否设置了国籍标识
                                                        {
                                                                SpecialName = SpecialName.slice(SpecialName.indexOf('}') + 1); //去掉国籍标识
                                                                name = SpecialName; //使用原来的备注
                                                        } else if (SpecialName.indexOf('{CN-N}') != -1 ||
                                                                SpecialName.indexOf('{EN-N}') != -1 ||
                                                                SpecialName.indexOf('{JP-N}') != -1 ||
                                                                SpecialName.indexOf('{CN-SG-N}') != -1 ||
                                                                SpecialName.indexOf('{CN-HANT-N}') != -1 ||
                                                                SpecialName.indexOf('{CN-HK-N}') != -1 ||
                                                                SpecialName.indexOf('{CN-MO-N}') != -1 ||
                                                                SpecialName.indexOf('{CN-TW-N}') != -1
                                                        ) //检查是否设置了国籍标识
                                                        {
                                                                SpecialName = SpecialName.slice(SpecialName.indexOf('}') + 1); //去掉国籍标识
                                                                name = ""; //去掉备注
                                                        } else {
                                                                jQuery("#log_body1")[0].innerHTML +=
                                                                        "<a style='color:#00ffd8;' target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID +
                                                                        "\">" + '[' + (i + 1) + '/' + total + '] 已跳过, 没有设置国籍不能取消! ' + profileID + '  ' + SpecialName + "</a><br>";
                                                                continue;
                                                        }
                                                } else if (nicknameObj.length == 0) {
                                                        console.log("获取到的是steam名称");
                                                        steamName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("\n")); //提取steam名称
                                                        jQuery("#log_body1")[0].innerHTML +=
                                                                "<a style='color:#00ffd8;' target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID +
                                                                "\">" + '[' + (i + 1) + '/' + total + '] 已跳过, 没有备注不能取消! ' + profileID + '  ' + steamName + "</a><br>";
                                                        continue;
                                                }
                                        }
                                //}
                                console.log("[Debug] name:", name);
                                (function(i, profileID) {
                                        var URL = "https://steamcommunity.com/profiles/" + profileID + "/ajaxsetnickname/";
        
                                        jQuery.post(URL, {
                                                nickname: name,
                                                sessionid: g_sessionID
                                        }, function(response) {
                                                if (response.success === false) {
                                                        jQuery("#log_body1")[0].innerHTML +=
                                                                "<a style='color:#ff2c85;' target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID +
                                                                "\">" + '[' + (i + 1) + '/' + total + '] 设置备注失败了! ' + profileID + '  ' + name +
                                                                '&nbsp;&nbsp;&nbsp;&nbsp;' + response.error + "</a><br>";
                                                } else {
                                                        jQuery("#log_body1")[0].innerHTML +=
                                                                '[' + (i + 1) + '/' + total + '] ' +
                                                                "成功设置备注于 <a target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID + "\">" +
                                                                profileID + '  ' + name + "</a>" +
                                                                "<a style='color:#FB7299;' target='_blank' href=\"http://steamcommunity.com/profiles/" +
                                                                profileID + "\">" + "</a><br>";
                                                }
                                        }).fail(function() {
                                                jQuery("#log_body1")[0].innerHTML +=
                                                        '[' + (i + 1) + '/' + total + '] ' +
                                                        "<span style='color:#DA2626;'>无法设置备注于 <a style='color:#DA2626;' target='_blank' href=\"http://steamcommunity.com/profiles/" +
                                                        profileID + "\">" +
                                                        profileID + '  ' + name + "</a></span><br>";
                                        }).always(function() {
                                                jQuery("#log_head1").html("<br><b>当前处理了 " + (i + 1) + "个, 总计 " + total + " 个好友.<b>");
                                        });
        
                                })(i, profileID);
                                await sleep(1000);
                                //console.log(cur)
                        }
                        g_conf[0].isNationalityRunStatus = false;
                        g_conf[0].YunStatus = false; //没有运行
                        window.location.reload(true); //强制从服务器重新加载当前页面
                }
        
        });
        
        //---------------------------------------------------------------------------------------------------------------
        await jQuery("#comment_submit").click(async function() { //发送评论给选择的好友
                setTimeout(async ()=>{
                        date = new Date();
                        startTime = date.getTime();
                        
                        const total = jQuery("#search_results .selected.selectable").length; //选择的朋友总数
                        const msg = jQuery("#comment_textarea").val(); //获取评论内容
                        var newMgs = "";
                        var mode = 0;
                        var SpecialName = undefined;
                        var steamName = undefined;
                        var name = undefined;
                        
                        if (total > 0 && msg.length > 0) {
                                if(g_conf[0].isCommentRunStatus == false)
                                        jQuery("#log_head, #log_body").html("");
                                
                                
                                //jQuery(".selected").each(async function(i) {
                                var jqobj = jQuery("#search_results .selected.selectable");
                                
                                for (let i = 0; i < jqobj.length; i++) {
                                        let cur = jqobj.get(i);
                                        g_conf[0].YunStatus = true; //正在运行
                                        g_conf[0].isCommentRunStatus = true;
                                        //--------------------------------------------------------------------
                                        SpecialName = undefined;
                                        steamName = undefined;
                                        
                                        // if (document.URL.indexOf("/friends") == -1) { //如果是在个人资料页面
                                        //      //获取备注
                                        //      var SpecialNameobj = document.getElementsByClassName("nickname"); //nickname
                                        //      SpecialName = undefined;
                                        //      if (SpecialNameobj != "undefined") {
                                        //              SpecialName = SpecialNameobj[0].innerText; //备注
                                        //      }
                                        //      //获取steam名称
                                        //      steamName = document.getElementsByClassName("actual_persona_name")[0].innerText; //steam名称
                                        //      name = steamName;
                                        // } else //否则如果是好友界面
                                        //{
                                                //获取名称,然后判断是备注还是steam名称
                                                var SpecialNameobj = cur.getElementsByClassName("friend_block_content");
                                                var nicknameObj = cur.getElementsByClassName("player_nickname_hint");
                                                SpecialName = undefined;
                                                if (SpecialNameobj.length > 0) //安全检查
                                                {
                                                        if (nicknameObj.length > 0) //节点存在则是备注,不存在则是steam名称
                                                        {
                                                                console.log("获取到的是备注");
                                                                SpecialName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("*")); //提取备注
                                                                steamName = undefined; //就没有名称
                                                                name = SpecialName;
                                                        } else if (nicknameObj.length == 0) {
                                                                console.log("获取到的是steam名称");
                                                                SpecialName = undefined; //就没有备注
                                                                steamName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("\n")); //提取steam名称
                                                                name = steamName;
                                                        }
                                                }
                                        //}
                                        //--------------------------------------------------------------------
                                        //判断选择的模式
                                        if ($("select_islName_checkbox").checked == true) {
                                                mode = 1;
                                        }
                                        else if ($("select_isSpecialName_checkbox").checked == true) {
                                                mode = 2;
                                        }
                                        else if ($("select_isCustom_checkbox").checked == true) {
                                                mode = 3;
                                        }
                                        else //如果都没有选中，则直接发送消息
                                                mode = 0;
                                        
                                        if (mode == 1) { //是否为好友添加称呼 (如果好友没有备注则使用steam名称)
                                                //判断是否有备注,没有则使用steam名称
                                                if (SpecialName != undefined) {
                                                        let strNationality = SpecialName.slice(0, SpecialName.indexOf('}') + 1); //提取国籍
                                                        SpecialName = SpecialName.slice(SpecialName.indexOf('}') + 1); //去掉国籍标识
                                                        
                                                        console.log("为" + steamName + "添加称呼: " + SpecialName);
                                                        newMgs = SpecialName + msg;
                                                } else {
                                                        console.log("为" + steamName + "添加称呼: " + steamName);
                                                        newMgs = steamName + msg;
                                                }
                                        } else if (mode == 2) { //是否为好友添加称呼 (请为好友设置备注为需要的称呼,否则不添加称呼)
                                                //判断是否有备注,没有则不操作
                                                if (SpecialName != undefined) {
                                                        let strNationality = SpecialName.slice(0, SpecialName.indexOf('}') + 1); //提取国籍
                                                        SpecialName = SpecialName.slice(SpecialName.indexOf('}') + 1); //去掉国籍标识
                                                        
                                                        console.log("为" + steamName + "添加称呼: " + SpecialName);
                                                        newMgs = SpecialName + msg;
                                                } else {
                                                        newMgs = msg;
                                                }
                                        } else if (mode == 3) { //是否为好友添加称呼 (请为好友设置备注为需要的称呼,否则不添加称呼)
                                                //判断是否有备注,没有则不操作
                                                if (SpecialName != undefined) {
                                                        let strNationality = SpecialName.slice(0, SpecialName.indexOf('}') + 1); //提取国籍
                                                        SpecialName = SpecialName.slice(SpecialName.indexOf('}') + 1); //去掉国籍标识
                                                        
                                                        console.log("为" + steamName + "添加称呼: " + SpecialName);
                                                        let str = msg;
                                                        newMgs = str.replace(new RegExp(g_conf[0].strRemarkPlaceholder, 'g'),SpecialName); //把占位符全部替换为备注
                                                } else {
                                                        let str = msg;
                                                        newMgs = str.replace(new RegExp(g_conf[0].strRemarkPlaceholder, 'g'),steamName); //把占位符全部替换为steam名称
                                                }
                                        } else if (mode == 0) { //直接发送内容
                                                newMgs = msg;
                                        }
                                        console.log("[Debug] mode:", mode);
                                        console.log("[Debug] SpecialName:", SpecialName, "steamName:", steamName);
                                        console.log("[Debug] newMgs:", newMgs, "msg:", msg);
                                        //--------------------------------------------------------------------
                                        let profileID = cur.getAttribute("data-steamid");
                
                                        if (SpecialName != undefined) {
                                                if (SpecialName.indexOf(g_conf[0].strNoOperate) != -1) {
                                                        jQuery("#log_body")[0].innerHTML +=
                                                                "<a style='color:#00ffd8;' target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID +
                                                                "\">" + '[' + (i + 1) + '/' + total + '] 已跳过留言! ' + profileID + '  ' + name + "</a><br>";
                                                        continue;
                                                }
                                        }
                                        
                                        (function(i, profileID) {
                                                //setTimeout(function() {
                
                                                jQuery.post("//steamcommunity.com/comment/Profile/post/" + profileID + "/-1/", {
                                                        comment: newMgs,
                                                        count: 6,
                                                        sessionid: g_sessionID
                                                }, function(response) {
                                                        if (response.success === false) {
                                                                jQuery("#log_body")[0].innerHTML +=
                                                                        "<a style='color:#ff2c85;' target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID +
                                                                        "\">" + '[' + (i + 1) + '/' + total + '] 留言失败了! ' + profileID + '  ' + name +
                                                                        '&nbsp;&nbsp;&nbsp;&nbsp;' + response.error + "</a><br>";
                                                        } else {
                                                                jQuery("#log_body")[0].innerHTML +=
                                                                        '[' + (i + 1) + '/' + total + '] ' +
                                                                        "成功发表评论于 <a target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID + "\">" +
                                                                        profileID + '  ' + name + "</a>" +
                                                                        "<span> → </span><a style='color:#FB7299;' target='_blank' href=\"http://steamcommunity.com/profiles/" +
                                                                        profileID  + "#commentthread_Profile_"+ profileID +"_textarea" + "\">" + newMgs + "</a><br>";
                                                        }
                                                }).fail(function() {
                                                        jQuery("#log_body")[0].innerHTML +=
                                                                '<span style="color:#DA2626;">[' + (i + 1) + '/' + total + '] ' +
                                                                "无法发表评论于 <a style='color:#DA2626;' target='_blank' href=\"http://steamcommunity.com/profiles/" +
                                                                profileID + "\">" +
                                                                profileID + '  ' + name + "</a></span><br>";
                                                }).always(function() {
                                                        jQuery("#log_head").html("<br><b>当前处理了 " + (i + 1) + "个, 总计 " + total + " 个好友.<b>");
                                                });
                
                
                                                //}, i * 6000);
                
                                        })(i, profileID);
                                        await sleep(g_conf[0].delay * 1000)
                                        //console.log(cur)
                                }
                
                
                                date = new Date();
                                endTime = date.getTime();
                                let time = endTime - startTime;
                                //console.log("time",time,endTime,startTime);
                                //--------------------------------------------------------------------------------
                                //计算出相差天数
                                var str = "";
                                let days = Math.floor(time / (24 * 3600 * 1000))
                                //计算出小时数
                                let leave1 = time % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
                                let hours = Math.floor(leave1 / (3600 * 1000))
                                //计算相差分钟数
                                let leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
                                let minutes = Math.floor(leave2 / (60 * 1000))
                                //计算相差秒数
                                let leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
                                //let seconds=Math.round(leave3/1000)
                                let seconds = leave3 / 1000
                                if (days > 0)
                                        str += days + "天";
                                if (hours > 0)
                                        str += hours + "小时";
                                if (minutes > 0)
                                        str += minutes + "分钟";
                                if (seconds > 0)
                                        str += seconds + "秒";
                                //--------------------------------------------------------------------------------
                                jQuery("#log_body")[0].innerHTML +=
                                        "<b>留言完毕! 用时: <span style='color:#35ff8b;'>" + str + "</span></b><br>";
                                //});
                                g_conf[0].isCommentRunStatus = false;
                                
                                g_conf[0].YunStatus = false; //没有运行
                
                        } else {
                                alert("请确保您输入了一条消息并选择了1个或更多好友。");
                        }
                },0);
        });
        
        //---------------------------------------------------------------------------------------------------------------
        await jQuery("#comment_submit_special").click(async function() { //根据国籍发送评论给选择的好友
                
                setTimeout(async()=>{
                        date = new Date();
                        startTime = date.getTime();
                        
                        if(g_conf[0].isTranslationText == false){
                                return;
                        }
                        
                        const total = jQuery("#search_results .selected.selectable").length; //选择的朋友总数
                        const msg = jQuery("#comment_textarea").val(); //获取评论内容
                        const msg_CN = jQuery("#comment_textarea_zhc").val(); //获取评论内容
                        const msg_EN = jQuery("#comment_textarea_en").val(); //获取评论内容
                        const msg_JP = jQuery("#comment_textarea_jp").val(); //获取评论内容
                        const msg_CN_SG = jQuery("#comment_textarea_zh_sg").val(); //获取评论内容
                        const msg_CN_HANT = jQuery("#comment_textarea_zh_hant").val(); //获取评论内容
                        const msg_CN_HK = jQuery("#comment_textarea_zh_hk").val(); //获取评论内容
                        const msg_CN_MO = jQuery("#comment_textarea_zh_mo").val(); //获取评论内容
                        const msg_CN_TW = jQuery("#comment_textarea_zh_tw").val(); //获取评论内容
                        
                        var newMgs = "";
                        var mode = 0;
                        var SpecialName = undefined;
                        var steamName = undefined;
                        var name = undefined;
                                
                        if (total > 0 && msg.length > 0) {
                                
                                if(g_conf[0].isCommentRunStatus == false)
                                        jQuery("#log_head, #log_body").html("");
                                
                                //jQuery(".selected").each(async function(i) {
                                //var jqobj = jQuery(".selected");
                                //var jqobj = jQuery(".selected[data-steamid]"); //排除掉选择的其他的东西
                                var jqobj = jQuery("#search_results .selected.selectable"); //排除掉选择的其他的东西
                                
                                for (let i = 0; i < jqobj.length; i++) {
                                        let cur = jqobj.get(i);
                                        g_conf[0].YunStatus = true; //正在运行
                                        g_conf[0].isCommentRunStatus = true;
                                        //--------------------------------------------------------------------
                                        SpecialName = undefined;
                                        steamName = undefined;
                                
                                        // if (document.URL.indexOf("/friends") == -1) { //如果是在个人资料页面
                                        //      //获取备注
                                        //      var SpecialNameobj = document.getElementsByClassName("nickname"); //nickname
                                        //      SpecialName = undefined;
                                        //      if (SpecialNameobj != "undefined") {
                                        //              SpecialName = SpecialNameobj[0].innerText; //备注
                                        //      }
                                        //      //获取steam名称
                                        //      steamName = document.getElementsByClassName("actual_persona_name")[0].innerText; //steam名称
                                        //      name = steamName;
                                        // } else //否则如果是好友界面
                                        //{
                                                //获取名称,然后判断是备注还是steam名称
                                                var SpecialNameobj = cur.getElementsByClassName("friend_block_content");
                                                var nicknameObj = cur.getElementsByClassName("player_nickname_hint");
                                                SpecialName = undefined;
                                                if (SpecialNameobj.length > 0) //安全检查
                                                {
                                                        if (nicknameObj.length > 0) //节点存在则是备注,不存在则是steam名称
                                                        {
                                                                console.log("获取到的是备注");
                                                                SpecialName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("*")); //提取备注
                                                                steamName = undefined; //就没有名称
                                                                name = SpecialName;
                                                        } else if (nicknameObj.length == 0) {
                                                                console.log("获取到的是steam名称");
                                                                SpecialName = undefined; //就没有备注
                                                                steamName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("\n")); //提取steam名称
                                                                name = steamName;
                                                        }
                                                }
                                        //}
                                        //--------------------------------------------------------------------
                                        //判断选择的模式
                                        if ($("select_islName_checkbox").checked == true) {
                                                mode = 1;
                                        }
                                        else if ($("select_isSpecialName_checkbox").checked == true) {
                                                mode = 2;
                                        }
                                        else if ($("select_isCustom_checkbox").checked == true) {
                                                mode = 3;
                                        }
                                        else //如果都没有选中，则直接发送消息
                                                mode = 0;
                                
                                        var getVA = function(steamName, SpecialName) {
                                                return steamName == undefined ? steamName : SpecialName;
                                        };
                                
                                        console.log("DBG 0", steamName, SpecialName, name);
                                
                                        if (mode == 1) { //是否为好友添加称呼 (如果好友没有备注则使用steam名称)
                                                //判断是否有备注,没有则使用steam名称
                                                if (SpecialName != undefined) {
                                                        let strNationality = SpecialName.slice(0, SpecialName.indexOf('}') + 1); //提取国籍
                                                        SpecialName = SpecialName.slice(SpecialName.indexOf('}') + 1); //去掉国籍标识
                                
                                                        if (strNationality == "{CN}" || strNationality == "{CN-N}") {
                                                                newMgs = SpecialName + msg_CN;
                                                        } else if (strNationality == "{EN}" || strNationality == "{EN-N}") {
                                                                newMgs = SpecialName + msg_EN;
                                                        } else if (strNationality == "{JP}" || strNationality == "{JP-N}") {
                                                                newMgs = SpecialName + msg_JP;
                                                        } else if (strNationality == "{CN-SG}" || strNationality == "{CN-SG-N}") {
                                                                newMgs = SpecialName + msg_CN_SG;
                                                        } else if (strNationality == "{CN-HANT}" || strNationality == "{CN-HANT-N}") {
                                                                newMgs = SpecialName + msg_CN_HANT;
                                                        } else if (strNationality == "{CN-HK}" || strNationality == "{CN-HK-N}") {
                                                                newMgs = SpecialName + msg_CN_HK;
                                                        } else if (strNationality == "{CN-MO}" || strNationality == "{CN-MO-N}") {
                                                                newMgs = SpecialName + msg_CN_MO;
                                                        } else if (strNationality == "{CN-TW}" || strNationality == "{CN-TW-N}") {
                                                                newMgs = SpecialName + msg_CN_TW;
                                                        } else //没有设置国籍则默认使用英文,日语,简体中文,原始语言
                                                        {
                                                                if (msg_EN != undefined && msg_EN != "")
                                                                        newMgs = SpecialName + msg_EN;
                                                                else if (msg_JP != undefined && msg_JP != "")
                                                                        newMgs = SpecialName + msg_JP;
                                                                else if (msg_CN != undefined && msg_CN != "")
                                                                        newMgs = SpecialName + msg_CN;
                                                                else
                                                                        newMgs = SpecialName + msg;
                                                        }
                                                        console.log("DBG 1", steamName, SpecialName, name, strNationality);
                                                        console.log("为" + SpecialName + "添加称呼: " + SpecialName);
                                                        //newMgs = SpecialName + msg;
                                                } else {
                                                        let strNationality = steamName.slice(0, steamName.indexOf('}') + 1); //提取国籍
                                                        steamName = steamName.slice(steamName.indexOf('}') + 1); //去掉国籍标识
                                
                                                        if (strNationality == "{CN}" || strNationality == "{CN-N}") {
                                                                newMgs = steamName + msg_CN;
                                                        } else if (strNationality == "{EN}" || strNationality == "{EN-N}") {
                                                                newMgs = steamName + msg_EN;
                                                        } else if (strNationality == "{JP}" || strNationality == "{JP-N}") {
                                                                newMgs = steamName + msg_JP;
                                                        } else if (strNationality == "{CN-SG}" || strNationality == "{CN-SG-N}") {
                                                                newMgs = steamName + msg_CN_SG;
                                                        } else if (strNationality == "{CN-HANT}" || strNationality == "{CN-HANT-N}") {
                                                                newMgs = steamName + msg_CN_HANT;
                                                        } else if (strNationality == "{CN-HK}" || strNationality == "{CN-HK-N}") {
                                                                newMgs = steamName + msg_CN_HK;
                                                        } else if (strNationality == "{CN-MO}" || strNationality == "{CN-MO-N}") {
                                                                newMgs = steamName + msg_CN_MO;
                                                        } else if (strNationality == "{CN-TW}" || strNationality == "{CN-TW-N}") {
                                                                newMgs = steamName + msg_CN_TW;
                                                        } else //没有设置国籍则默认使用英文,日语,简体中文,原始语言
                                                        {
                                                                if (msg_EN != undefined && msg_EN != "")
                                                                        newMgs = steamName + msg_EN;
                                                                else if (msg_JP != undefined && msg_JP != "")
                                                                        newMgs = steamName + msg_JP;
                                                                else if (msg_CN != undefined && msg_CN != "")
                                                                        newMgs = steamName + msg_CN;
                                                                else
                                                                        newMgs = steamName + msg;
                                                        }
                                                        console.log("DBG 2", steamName, SpecialName, name, strNationality);
                                                        console.log("为" + steamName + "添加称呼: " + steamName);
                                                        //newMgs = steamName + msg;
                                                }
                                        } else if (mode == 2) { //是否为好友添加称呼 (请为好友设置备注为需要的称呼,否则不添加称呼)
                                                //判断是否有备注,没有则不操作
                                                if (SpecialName != undefined) {
                                                        let strNationality = SpecialName.slice(0, SpecialName.indexOf('}') + 1); //提取国籍
                                                        SpecialName = SpecialName.slice(SpecialName.indexOf('}') + 1); //去掉国籍标识
                                
                                                        if (strNationality == "{CN}" || strNationality == "{CN-N}") {
                                                                newMgs = SpecialName + msg_CN;
                                                        } else if (strNationality == "{EN}" || strNationality == "{EN-N}") {
                                                                newMgs = SpecialName + msg_EN;
                                                        } else if (strNationality == "{JP}" || strNationality == "{JP-N}") {
                                                                newMgs = SpecialName + msg_JP;
                                                        } else if (strNationality == "{CN-SG}" || strNationality == "{CN-SG-N}") {
                                                                newMgs = SpecialName + msg_CN_SG;
                                                        } else if (strNationality == "{CN-HANT}" || strNationality == "{CN-HANT-N}") {
                                                                newMgs = SpecialName + msg_CN_HANT;
                                                        } else if (strNationality == "{CN-HK}" || strNationality == "{CN-HK-N}") {
                                                                newMgs = SpecialName + msg_CN_HK;
                                                        } else if (strNationality == "{CN-MO}" || strNationality == "{CN-MO-N}") {
                                                                newMgs = SpecialName + msg_CN_MO;
                                                        } else if (strNationality == "{CN-TW}" || strNationality == "{CN-TW-N}") {
                                                                newMgs = SpecialName + msg_CN_TW;
                                                        } else //没有设置国籍则默认使用英文,日语,简体中文,原始语言
                                                        {
                                                                if (msg_EN != undefined && msg_EN != "")
                                                                        newMgs = SpecialName + msg_EN;
                                                                else if (msg_JP != undefined && msg_JP != "")
                                                                        newMgs = SpecialName + msg_JP;
                                                                else if (msg_CN != undefined && msg_CN != "")
                                                                        newMgs = SpecialName + msg_CN;
                                                                else
                                                                        newMgs = SpecialName + msg;
                                                        }
                                                        console.log("DBG 3", steamName, SpecialName, name, strNationality);
                                                        console.log("为" + steamName + "添加称呼: " + SpecialName);
                                                        //newMgs = SpecialName + msg;
                                                } else {
                                                        let strNationality = steamName.slice(0, steamName.indexOf('}') + 1); //提取国籍
                                                        steamName = steamName.slice(steamName.indexOf('}') + 1); //去掉国籍标识
                                
                                                        if (strNationality == "{CN}" || strNationality == "{CN-N}") {
                                                                newMgs = msg_CN;
                                                        } else if (strNationality == "{EN}" || strNationality == "{EN-N}") {
                                                                newMgs = msg_EN;
                                                        } else if (strNationality == "{JP}" || strNationality == "{JP-N}") {
                                                                newMgs = msg_JP;
                                                        } else if (strNationality == "{CN-SG}" || strNationality == "{CN-SG-N}") {
                                                                newMgs = msg_CN_SG;
                                                        } else if (strNationality == "{CN-HANT}" || strNationality == "{CN-HANT-N}") {
                                                                newMgs = msg_CN_HANT;
                                                        } else if (strNationality == "{CN-HK}" || strNationality == "{CN-HK-N}") {
                                                                newMgs = msg_CN_HK;
                                                        } else if (strNationality == "{CN-MO}" || strNationality == "{CN-MO-N}") {
                                                                newMgs = msg_CN_MO;
                                                        } else if (strNationality == "{CN-TW}" || strNationality == "{CN-TW-N}") {
                                                                newMgs = msg_CN_TW;
                                                        } else //没有设置国籍则默认使用英文,日语,简体中文,原始语言
                                                        {
                                                                if (msg_EN != undefined && msg_EN != "")
                                                                        newMgs = msg_EN;
                                                                else if (msg_JP != undefined && msg_JP != "")
                                                                        newMgs = msg_JP;
                                                                else if (msg_CN != undefined && msg_CN != "")
                                                                        newMgs = msg_CN;
                                                                else
                                                                        newMgs = msg;
                                                        }
                                                        console.log("DBG 4", steamName, SpecialName, name, strNationality);
                                                        //newMgs = msg;
                                                }
                                        } else if (mode == 3) { //是否为好友添加称呼 (请为好友设置备注为需要的称呼,否则不添加称呼)
                                                //判断是否有备注,没有则不操作
                                                if (SpecialName != undefined) {
                                                        let strNationality = SpecialName.slice(0, SpecialName.indexOf('}') + 1); //提取国籍
                                                        SpecialName = SpecialName.slice(SpecialName.indexOf('}') + 1); //去掉国籍标识
                                                        
                                                        if (strNationality == "{CN}" || strNationality == "{CN-N}") {
                                                                if(msg_CN == undefined){
                                                                        return alert("您为选择的好友设置的国籍没有对应翻译过的文本，建议在'选择需要翻译的文本'那里的右上角选择全选，现在将停止运行.\n" + "好友名称:"+SpecialName+"国籍:"+strNationality);
                                                                }
                                                                let str = msg_CN;
                                                                newMgs = str.replace(new RegExp(g_conf[0].strRemarkPlaceholder, 'g'),SpecialName); //把占位符全部替换为备注
                                                        } else if (strNationality == "{EN}" || strNationality == "{EN-N}") {
                                                                if(msg_EN == undefined){
                                                                        return alert("您为选择的好友设置的国籍没有对应翻译过的文本，建议在'选择需要翻译的文本'那里的右上角选择全选，现在将停止运行.\n" + "好友名称:"+SpecialName+"国籍:"+strNationality);
                                                                }
                                                                let str = msg_EN;
                                                                newMgs = str.replace(new RegExp(g_conf[0].strRemarkPlaceholder, 'g'),SpecialName); //把占位符全部替换为备注
                                                        } else if (strNationality == "{JP}" || strNationality == "{JP-N}") {
                                                                if(msg_JP == undefined){
                                                                        return alert("您为选择的好友设置的国籍没有对应翻译过的文本，建议在'选择需要翻译的文本'那里的右上角选择全选，现在将停止运行.\n" + "好友名称:"+SpecialName+"国籍:"+strNationality);
                                                                }
                                                                let str = msg_JP;
                                                                newMgs = str.replace(new RegExp(g_conf[0].strRemarkPlaceholder, 'g'),SpecialName); //把占位符全部替换为备注
                                                        } else if (strNationality == "{CN-SG}" || strNationality == "{CN-SG-N}") {
                                                                if(msg_CN_SG == undefined){
                                                                        return alert("您为选择的好友设置的国籍没有对应翻译过的文本，建议在'选择需要翻译的文本'那里的右上角选择全选，现在将停止运行.\n" + "好友名称:"+SpecialName+"国籍:"+strNationality);
                                                                }
                                                                let str = msg_CN_SG;
                                                                newMgs = str.replace(new RegExp(g_conf[0].strRemarkPlaceholder, 'g'),SpecialName); //把占位符全部替换为备注
                                                        } else if (strNationality == "{CN-HANT}" || strNationality == "{CN-HANT-N}") {
                                                                if(msg_CN_HANT == undefined){
                                                                        return alert("您为选择的好友设置的国籍没有对应翻译过的文本，建议在'选择需要翻译的文本'那里的右上角选择全选，现在将停止运行.\n" + "好友名称:"+SpecialName+"国籍:"+strNationality);
                                                                }
                                                                let str = msg_CN_HANT;
                                                                newMgs = str.replace(new RegExp(g_conf[0].strRemarkPlaceholder, 'g'),SpecialName); //把占位符全部替换为备注
                                                        } else if (strNationality == "{CN-HK}" || strNationality == "{CN-HK-N}") {
                                                                if(msg_CN_HK == undefined){
                                                                        return alert("您为选择的好友设置的国籍没有对应翻译过的文本，建议在'选择需要翻译的文本'那里的右上角选择全选，现在将停止运行.\n" + "好友名称:"+SpecialName+"国籍:"+strNationality);
                                                                }
                                                                let str = msg_CN_HK;
                                                                newMgs = str.replace(new RegExp(g_conf[0].strRemarkPlaceholder, 'g'),SpecialName); //把占位符全部替换为备注
                                                        } else if (strNationality == "{CN-MO}" || strNationality == "{CN-MO-N}") {
                                                                if(msg_CN_MO == undefined){
                                                                        return alert("您为选择的好友设置的国籍没有对应翻译过的文本，建议在'选择需要翻译的文本'那里的右上角选择全选，现在将停止运行.\n" + "好友名称:"+SpecialName+"国籍:"+strNationality);
                                                                }
                                                                let str = msg_CN_MO;
                                                                newMgs = str.replace(new RegExp(g_conf[0].strRemarkPlaceholder, 'g'),SpecialName); //把占位符全部替换为备注
                                                        } else if (strNationality == "{CN-TW}" || strNationality == "{CN-TW-N}") {
                                                                if(msg_CN_TW == undefined){
                                                                        return alert("您为选择的好友设置的国籍没有对应翻译过的文本，建议在'选择需要翻译的文本'那里的右上角选择全选，现在将停止运行.\n" + "好友名称:"+SpecialName+"国籍:"+strNationality);
                                                                }
                                                                let str = msg_CN_TW;
                                                                newMgs = str.replace(new RegExp(g_conf[0].strRemarkPlaceholder, 'g'),SpecialName); //把占位符全部替换为备注
                                                        } else //没有设置国籍则默认使用英文,日语,简体中文,原始语言
                                                        {
                                                                if (msg_EN != undefined && msg_EN != ""){
                                                                        let str = msg_EN;
                                                                        newMgs = str.replace(new RegExp(g_conf[0].strRemarkPlaceholder, 'g'),SpecialName); //把占位符全部替换为备注
                                                                }       
                                                                else if (msg_JP != undefined && msg_JP != ""){
                                                                        let str = msg_JP;
                                                                        newMgs = str.replace(new RegExp(g_conf[0].strRemarkPlaceholder, 'g'),SpecialName); //把占位符全部替换为备注
                                                                }
                                                                else if (msg_CN != undefined && msg_CN != ""){
                                                                        let str = msg_CN;
                                                                        newMgs = str.replace(new RegExp(g_conf[0].strRemarkPlaceholder, 'g'),SpecialName); //把占位符全部替换为备注
                                                                }
                                                                else{
                                                                        let str = msg;
                                                                        newMgs = str.replace(new RegExp(g_conf[0].strRemarkPlaceholder, 'g'),SpecialName); //把占位符全部替换为备注
                                                                }
                                                        }
                                                        console.log("DBG 3", steamName, SpecialName, name, strNationality);
                                                        console.log("为" + steamName + "添加称呼: " + SpecialName);
                                                        //newMgs = SpecialName + msg;
                                                } else {
                                                        let strNationality = steamName.slice(0, steamName.indexOf('}') + 1); //提取国籍
                                                        steamName = steamName.slice(steamName.indexOf('}') + 1); //去掉国籍标识
                                                
                                                        if (strNationality == "{CN}" || strNationality == "{CN-N}") {
                                                                if(msg_CN == undefined){
                                                                        return alert("您为选择的好友设置的国籍没有对应翻译过的文本，建议在'选择需要翻译的文本'那里的右上角选择全选，现在将停止运行.\n" + "好友名称:"+SpecialName+"国籍:"+strNationality);
                                                                }
                                                                let str = msg_CN;
                                                                newMgs = str.replace(new RegExp(g_conf[0].strRemarkPlaceholder, 'g'),steamName); //把占位符全部替换为steam名称
                                                        } else if (strNationality == "{EN}" || strNationality == "{EN-N}") {
                                                                if(msg_EN == undefined){
                                                                        return alert("您为选择的好友设置的国籍没有对应翻译过的文本，建议在'选择需要翻译的文本'那里的右上角选择全选，现在将停止运行.\n" + "好友名称:"+SpecialName+"国籍:"+strNationality);
                                                                }
                                                                let str = msg_EN;
                                                                newMgs = str.replace(new RegExp(g_conf[0].strRemarkPlaceholder, 'g'),steamName); //把占位符全部替换为steam名称
                                                        } else if (strNationality == "{JP}" || strNationality == "{JP-N}") {
                                                                if(msg_JP == undefined){
                                                                        return alert("您为选择的好友设置的国籍没有对应翻译过的文本，建议在'选择需要翻译的文本'那里的右上角选择全选，现在将停止运行.\n" + "好友名称:"+SpecialName+"国籍:"+strNationality);
                                                                }
                                                                let str = msg_JP;
                                                                newMgs = str.replace(new RegExp(g_conf[0].strRemarkPlaceholder, 'g'),steamName); //把占位符全部替换为steam名称
                                                        } else if (strNationality == "{CN-SG}" || strNationality == "{CN-SG-N}") {
                                                                if(msg_CN_SG == undefined){
                                                                        return alert("您为选择的好友设置的国籍没有对应翻译过的文本，建议在'选择需要翻译的文本'那里的右上角选择全选，现在将停止运行.\n" + "好友名称:"+SpecialName+"国籍:"+strNationality);
                                                                }
                                                                let str = msg_CN_SG;
                                                                newMgs = str.replace(new RegExp(g_conf[0].strRemarkPlaceholder, 'g'),steamName); //把占位符全部替换为steam名称
                                                        } else if (strNationality == "{CN-HANT}" || strNationality == "{CN-HANT-N}") {
                                                                if(msg_CN_HANT == undefined){
                                                                        return alert("您为选择的好友设置的国籍没有对应翻译过的文本，建议在'选择需要翻译的文本'那里的右上角选择全选，现在将停止运行.\n" + "好友名称:"+SpecialName+"国籍:"+strNationality);
                                                                }
                                                                let str = msg_CN_HANT;
                                                                newMgs = str.replace(new RegExp(g_conf[0].strRemarkPlaceholder, 'g'),steamName); //把占位符全部替换为steam名称
                                                        } else if (strNationality == "{CN-HK}" || strNationality == "{CN-HK-N}") {
                                                                if(msg_CN_HK == undefined){
                                                                        return alert("您为选择的好友设置的国籍没有对应翻译过的文本，建议在'选择需要翻译的文本'那里的右上角选择全选，现在将停止运行.\n" + "好友名称:"+SpecialName+"国籍:"+strNationality);
                                                                }
                                                                let str = msg_CN_HK;
                                                                newMgs = str.replace(new RegExp(g_conf[0].strRemarkPlaceholder, 'g'),steamName); //把占位符全部替换为steam名称
                                                        } else if (strNationality == "{CN-MO}" || strNationality == "{CN-MO-N}") {
                                                                if(msg_CN_MO == undefined){
                                                                        return alert("您为选择的好友设置的国籍没有对应翻译过的文本，建议在'选择需要翻译的文本'那里的右上角选择全选，现在将停止运行.\n" + "好友名称:"+SpecialName+"国籍:"+strNationality);
                                                                }
                                                                let str = msg_CN_MO;
                                                                newMgs = str.replace(new RegExp(g_conf[0].strRemarkPlaceholder, 'g'),steamName); //把占位符全部替换为steam名称
                                                        } else if (strNationality == "{CN-TW}" || strNationality == "{CN-TW-N}") {
                                                                if(msg_CN_TW == undefined){
                                                                        return alert("您为选择的好友设置的国籍没有对应翻译过的文本，建议在'选择需要翻译的文本'那里的右上角选择全选，现在将停止运行.\n" + "好友名称:"+SpecialName+"国籍:"+strNationality);
                                                                }
                                                                let str = msg_CN_TW;
                                                                newMgs = str.replace(new RegExp(g_conf[0].strRemarkPlaceholder, 'g'),steamName); //把占位符全部替换为steam名称
                                                        } else //没有设置国籍则默认使用英文,日语,简体中文,原始语言
                                                        {
                                                                if (msg_EN != undefined && msg_EN != ""){
                                                                        let str = msg_EN;
                                                                        newMgs = str.replace(new RegExp(g_conf[0].strRemarkPlaceholder, 'g'),steamName); //把占位符全部替换为steam名称
                                                                }       
                                                                else if (msg_JP != undefined && msg_JP != ""){
                                                                        let str = msg_JP;
                                                                        newMgs = str.replace(new RegExp(g_conf[0].strRemarkPlaceholder, 'g'),steamName); //把占位符全部替换为steam名称
                                                                }
                                                                else if (msg_CN != undefined && msg_CN != ""){
                                                                        let str = msg_CN;
                                                                        newMgs = str.replace(new RegExp(g_conf[0].strRemarkPlaceholder, 'g'),steamName); //把占位符全部替换为steam名称
                                                                }
                                                                else{
                                                                        let str = msg;
                                                                        newMgs = str.replace(new RegExp(g_conf[0].strRemarkPlaceholder, 'g'),steamName); //把占位符全部替换为steam名称
                                                                }
                                                        }
                                                        console.log("DBG 4", steamName, SpecialName, name, strNationality);
                                                        //newMgs = msg;
                                                }
                                        } else if (mode == 0) { //直接发送内容
                                                let strNationality = name.slice(0, name.indexOf('}') + 1); //提取国籍
                                                name = name.slice(name.indexOf('}') + 1); //去掉国籍标识
                                
                                                if (strNationality == "{CN}" || strNationality == "{CN-N}") {
                                                        newMgs = msg_CN;
                                                } else if (strNationality == "{EN}" || strNationality == "{EN-N}") {
                                                        newMgs = msg_EN;
                                                } else if (strNationality == "{JP}" || strNationality == "{JP-N}") {
                                                        newMgs = msg_JP;
                                                } else if (strNationality == "{CN-SG}" || strNationality == "{CN-SG-N}") {
                                                        newMgs = msg_CN_SG;
                                                } else if (strNationality == "{CN-HANT}" || strNationality == "{CN-HANT-N}") {
                                                        newMgs = msg_CN_HANT;
                                                } else if (strNationality == "{CN-HK}" || strNationality == "{CN-HK-N}") {
                                                        newMgs = msg_CN_HK;
                                                } else if (strNationality == "{CN-MO}" || strNationality == "{CN-MO-N}") {
                                                        newMgs = msg_CN_MO;
                                                } else if (strNationality == "{CN-TW}" || strNationality == "{CN-TW-N}") {
                                                        newMgs = msg_CN_TW;
                                                } else //没有设置国籍则默认使用英文,日语,简体中文,原始语言
                                                {
                                                        if (msg_EN != undefined && msg_EN != "")
                                                                newMgs = msg_EN;
                                                        else if (msg_JP != undefined && msg_JP != "")
                                                                newMgs = msg_JP;
                                                        else if (msg_CN != undefined && msg_CN != "")
                                                                newMgs = msg_CN;
                                                        else
                                                                newMgs = msg;
                                                }
                                                console.log("DBG 5", steamName, SpecialName, name, strNationality);
                                                //ewMgs = msg;
                                        }
                                        console.log("[Debug] mode:", mode);
                                        console.log("[Debug] SpecialName:", SpecialName, "steamName:", steamName);
                                        console.log("[Debug] newMgs:", newMgs, "msg:", msg);
                                        //--------------------------------------------------------------------
                                        let profileID = cur.getAttribute("data-steamid");
                                        
                                        if (SpecialName != undefined) {
                                                if (SpecialName.indexOf(g_conf[0].strNoOperate) != -1) {
                                                        jQuery("#log_body")[0].innerHTML +=
                                                                "<a style='color:#00ffd8;' target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID +
                                                                "\">" + '[' + (i + 1) + '/' + total + '] 已跳过留言! ' + profileID + '  ' + name + "</a><br>";
                                                        continue;
                                                }
                                        }
                                        
                                        (function(i, profileID) {
                                                //setTimeout(function() {
                                
                                                jQuery.post("//steamcommunity.com/comment/Profile/post/" + profileID + "/-1/", {
                                                        comment: newMgs,
                                                        count: 6,
                                                        sessionid: g_sessionID
                                                }, function(response) {
                                                        if (response.success === false) {
                                                                jQuery("#log_body")[0].innerHTML +=
                                                                        "<a style='color:#ff2c85;' target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID +
                                                                        "\">" + '[' + (i + 1) + '/' + total + '] 留言失败了! ' + profileID + '  ' + name +
                                                                        '&nbsp;&nbsp;&nbsp;&nbsp;' + response.error + "</a><br>";
                                                        } else {
                                                                jQuery("#log_body")[0].innerHTML +=
                                                                        '[' + (i + 1) + '/' + total + '] ' +
                                                                        "成功发表评论于 <a target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID + "\">" +
                                                                        profileID + '  ' + name + "</a>" +
                                                                        "<span> → </span><a style='color:#FB7299;' target='_blank' href=\"http://steamcommunity.com/profiles/" +
                                                                        profileID + "#commentthread_Profile_"+ profileID +"_textarea" + "\">" + newMgs + "</a><br>";
                                                        }
                                                }).fail(function() {
                                                        jQuery("#log_body")[0].innerHTML +=
                                                                '[' + (i + 1) + '/' + total + '] ' +
                                                                "<span style='color:#DA2626;'>无法发表评论于 <a style='color:#DA2626;' target='_blank' href=\"http://steamcommunity.com/profiles/" +
                                                                profileID + "\">" +
                                                                profileID + '  ' + name + "</a></span><br>";
                                                }).always(function() {
                                                        jQuery("#log_head").html("<br><b>当前处理了 " + (i + 1) + "个, 总计 " + total + " 个好友.<b>");
                                                });
                                                
                                                
                                                //}, i * 6000);
                                
                                        })(i, profileID);
                                        await sleep(g_conf[0].delay * 1000)
                                        //console.log(cur)
                                }
                                
                                
                                date = new Date();
                                endTime = date.getTime();
                                let time = endTime - startTime;
                                //console.log("time",time,endTime,startTime);
                                //--------------------------------------------------------------------------------
                                //计算出相差天数
                                var str = "";
                                let days = Math.floor(time / (24 * 3600 * 1000))
                                //计算出小时数
                                let leave1 = time % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
                                let hours = Math.floor(leave1 / (3600 * 1000))
                                //计算相差分钟数
                                let leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
                                let minutes = Math.floor(leave2 / (60 * 1000))
                                //计算相差秒数
                                let leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
                                //let seconds=Math.round(leave3/1000)
                                let seconds = leave3 / 1000
                                if (days > 0)
                                        str += days + "天";
                                if (hours > 0)
                                        str += hours + "小时";
                                if (minutes > 0)
                                        str += minutes + "分钟";
                                if (seconds > 0)
                                        str += seconds + "秒";
                                //--------------------------------------------------------------------------------
                                jQuery("#log_body")[0].innerHTML +=
                                        "<b>留言完毕! 用时: <span style='color:#35ff8b;'>" + str + "</span></b><br>";
                                //});
                                g_conf[0].isCommentRunStatus = false;
                                
                                g_conf[0].YunStatus = false; //没有运行
                                
                        } else {
                                alert("请确保您输入了一条消息并选择了1个或更多好友。");
                        }
                },0);
        });
        
        var GroupMode = 0; //分组标志 0没有分组 1是国籍 2是离线时间
        
        jQuery("#NationalityGroup").click(async function() { //按国籍进行高亮分组
                //1.遍历所有好友,针对不同国籍进行上色
                //2.对好友进行排序
        
                var SpecialName = undefined;
                var steamName = undefined;
                var name = undefined;
                var mode = 0;
                const total = jQuery("#search_results .selectable").length; //选择的朋友总数
                if (total > 0) //选择的朋友总数
                {
                        jQuery("#log_head, #log_body").html("");
                        
                        var jqobj = jQuery("#search_results .selectable");
        
                        for (let i = 0; i < jqobj.length; i++) {
                                let cur = jqobj.get(i);
                                let profileID = cur.getAttribute("data-steamid");
                                g_conf[0].YunStatus = true; //正在运行
                                //--------------------------------------------------------------------
                                SpecialName = undefined;
                                steamName = undefined;
        
                                // if (document.URL.indexOf("/friends") == -1) { //如果是在个人资料页面
                                //      //获取备注
                                //      var SpecialNameobj = document.getElementsByClassName("nickname"); //nickname
                                //      SpecialName = undefined;
                                //      if (SpecialNameobj != "undefined") {
                                //              SpecialName = SpecialNameobj[0].innerText; //备注
                                //      }
                                //      //获取steam名称
                                //      steamName = document.getElementsByClassName("actual_persona_name")[0].innerText; //steam名称
                                //      name = steamName;
                                // } else //否则如果是好友界面
                                //{
                                        //获取名称,然后判断是备注还是steam名称
                                        var SpecialNameobj = cur.getElementsByClassName("friend_block_content");
                                        var nicknameObj = cur.getElementsByClassName("player_nickname_hint");
                                        SpecialName = undefined;
        
                                        if (SpecialNameobj.length > 0) //安全检查
                                        {
                                                if (nicknameObj.length > 0) //节点存在则是备注,不存在则是steam名称
                                                {
                                                        console.log("获取到的是备注");
                                                        SpecialName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("*")); //提取备注
                                                        steamName = undefined; //就没有名称
                                                        if (SpecialName.indexOf('{CN}') != -1 ||
                                                                SpecialName.indexOf('{EN}') != -1 ||
                                                                SpecialName.indexOf('{JP}') != -1 ||
                                                                SpecialName.indexOf('{CN-SG}') != -1 ||
                                                                SpecialName.indexOf('{CN-HANT}') != -1 ||
                                                                SpecialName.indexOf('{CN-HK}') != -1 ||
                                                                SpecialName.indexOf('{CN-MO}') != -1 ||
                                                                SpecialName.indexOf('{CN-TW}') != -1
                                                        ) //检查是否设置了国籍标识
                                                        {
                                                                if (SpecialName.indexOf('{CN}') != -1) {
                                                                        cur.style.background = "#66cc";
                                                                } else if (SpecialName.indexOf('{EN}') != -1) {
                                                                        cur.style.background = "#0C7FB2";
                                                                } else if (SpecialName.indexOf('{JP}') != -1) {
                                                                        cur.style.background = "#008080";
                                                                } else if (SpecialName.indexOf('{CN-SG}') != -1) {
                                                                        cur.style.background = "#808000";
                                                                } else if (SpecialName.indexOf('{CN-HANT}') != -1) {
                                                                        cur.style.background = "#ae7844";
                                                                } else if (SpecialName.indexOf('{CN-HK}') != -1) {
                                                                        cur.style.background = "#649115";
                                                                } else if (SpecialName.indexOf('{CN-MO}') != -1) {
                                                                        cur.style.background = "#0f965b";
                                                                } else if (SpecialName.indexOf('{CN-TW}') != -1) {
                                                                        cur.style.background = "#173eac";
                                                                }
                                                        } else if (SpecialName.indexOf('{CN-N}') != -1 ||
                                                                SpecialName.indexOf('{EN-N}') != -1 ||
                                                                SpecialName.indexOf('{JP-N}') != -1 ||
                                                                SpecialName.indexOf('{CN-SG-N}') != -1 ||
                                                                SpecialName.indexOf('{CN-HANT-N}') != -1 ||
                                                                SpecialName.indexOf('{CN-HK-N}') != -1 ||
                                                                SpecialName.indexOf('{CN-MO-N}') != -1 ||
                                                                SpecialName.indexOf('{CN-TW-N}') != -1
                                                        ) //检查是否设置了国籍标识
                                                        {
                                                                if (SpecialName.indexOf('{CN-N}') != -1) {
                                                                        cur.style.background = "#66cc";
                                                                        cur.style.borderColor = "#FF00FF";
                                                                } else if (SpecialName.indexOf('{EN-N}') != -1) {
                                                                        cur.style.background = "#0C7FB2";
                                                                        cur.style.borderColor = "#FF00FF";
                                                                } else if (SpecialName.indexOf('{JP-N}') != -1) {
                                                                        cur.style.background = "#008080";
                                                                        cur.style.borderColor = "#FF00FF";
                                                                } else if (SpecialName.indexOf('{CN-SG-N}') != -1) {
                                                                        cur.style.background = "#808000";
                                                                        cur.style.borderColor = "#FF00FF";
                                                                } else if (SpecialName.indexOf('{CN-HANT-N}') != -1) {
                                                                        cur.style.background = "#ae7844";
                                                                        cur.style.borderColor = "#FF00FF";
                                                                } else if (SpecialName.indexOf('{CN-HK-N}') != -1) {
                                                                        cur.style.background = "#649115";
                                                                        cur.style.borderColor = "#FF00FF";
                                                                } else if (SpecialName.indexOf('{CN-MO-N}') != -1) {
                                                                        cur.style.background = "#0f965b";
                                                                        cur.style.borderColor = "#FF00FF";
                                                                } else if (SpecialName.indexOf('{CN-TW-N}') != -1) {
                                                                        cur.style.background = "#173eac";
                                                                        cur.style.borderColor = "#FF00FF";
                                                                }
                                                        } else {
                                                                //设置了备注没有设置国籍
                                                                cur.style.background = "#188038";
                                                        }
                                                } else if (nicknameObj.length == 0) {
                                                        console.log("获取到的是steam名称");
                                                        steamName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("\n")); //提取steam名称
                                                        //jQuery("#log_body")[0].innerHTML +=
                                                        //      "<a style='color:#00ffd8;' target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID +
                                                        //      "\">" + '[' + (i + 1) + '/' + total + '] 已跳过, 没有备注不能取消! ' + profileID + '  ' + steamName + "</a><br>";
                                                        //continue;
                                                }
                                        }
                                //}
                                console.log("[Debug] name:", SpecialName);
                                //await sleep(1000);
                                //console.log(cur)
                        }
                        g_conf[0].YunStatus = false; //没有运行
                        //window.location.reload(true); //强制从服务器重新加载当前页面
                }
        
        
        });
        
        await jQuery("#NationalitySortGroup").click(async function() { //按国籍进行排序分组
                var SpecialName = undefined;
                var steamName = undefined;
                var name = undefined;
                var mode = 0;
                const total = jQuery("#search_results .selectable").length; //所有的朋友总数
                jQuery("#log_head, #log_body").html("");
                var jqobj = jQuery("#search_results .selectable"); //所有的朋友
        
        
                var child_CN, child_EN, child_JP, child_CN_SG, child_CN_HANTd, child_CN_HK, child_CN_MO, child_CN_TW;
                if (GroupMode != 1) {
                        var mainFriendObj;
                        if (GroupMode == 2) { //节点已经被模式2处理过
                                //备份和处理
                                if (document.getElementById("search_results1") == null) { //没有被模式1处理过
                                        mainFriendObj = document.getElementById("search_results0"); //获取原节点
                                        var newCopyObj = mainFriendObj.cloneNode(true);
                                        var mainFriendObj1 = document.getElementById("search_results"); //获取之前模式的节点
                                        mainFriendObj1.style.display = "none"; //之前模式的节点隐藏
                                        mainFriendObj1.id = "search_results2"; //之前模式的节点
                                        mainFriendObj1.className = "profile_friends search_results2"; //之前模式的节点
                                        newCopyObj.style.display = ""; //克隆的原节点取消隐藏(显示)
                                        newCopyObj.id = "search_results"; //克隆的原节点
                                        newCopyObj.className = "profile_friends search_results"; //克隆的原节点
                                        mainFriendObj.parentNode.appendChild(newCopyObj); //再添加一个新的备份节点
                                } else { //被模式1处理过
                                        var obj = document.getElementById("search_results1");
                                        var mainFriendObj1 = document.getElementById("search_results"); //获取之前模式的节点
                                        mainFriendObj = document.getElementById("search_results0"); //获取原节点
                                        mainFriendObj1.style.display = "none"; //之前模式的节点隐藏
                                        mainFriendObj1.id = "search_results2"; //之前模式的节点
                                        mainFriendObj1.className = "profile_friends search_results2"; //之前模式的节点
                                        obj.style.display = ""; //取消隐藏(显示)
                                        obj.id = "search_results"; //节点
                                        obj.className = "profile_friends search_results"; //节点
                                }
        
                        } else { //节点还没有被动过
                                //备份和处理
                                mainFriendObj = document.getElementById("search_results"); //获取原节点
                                var newCopyObj = mainFriendObj.cloneNode(true);
                                newCopyObj.style.display = "none"; //克隆的原节点隐藏
                                newCopyObj.id = "search_results0"; //克隆的原节点
                                newCopyObj.className = "profile_friends search_results0"; //克隆的原节点
                                mainFriendObj.parentNode.appendChild(newCopyObj); //再添加一个新的备份节点
        
        
                        }
                        // //备份和处理
                        // var mainFriendObj = document.getElementById("search_results"); //获取原节点
                        // var newCopyObj = mainFriendObj.cloneNode(true);
                        // newCopyObj.style.display = "none"; //隐藏
                        // mainFriendObj.parentNode.appendChild(newCopyObj); //再添加一个新的备份节点
        
                        var StateObj = mainFriendObj.getElementsByClassName("state_block");
                        for (let i = 0; i < StateObj.length; i++) {
                                StateObj[i].style.display = "none"; //隐藏状态条
                        }
        
                        //创建新盒子和克隆分组节点
                        console.log("开始分组...");
                        child_CN = document.createElement('div'); //创建
                        child_CN.id = "Firend_CN";
                        child_CN.style.display = "flex";
                        child_CN.style.flex = "1 100%";
                        child_CN.style.flexFlow = "row wrap";
                        child_CN.style.margin = "8px 0px 0px 0px";
                        // child_CN.style.justifyContent = "space-start";
                        mainFriendObj.appendChild(child_CN);
        
                        child_EN = child_CN.cloneNode(true); //克隆
                        child_EN.id = "Firend_EN";
                        mainFriendObj.appendChild(child_EN);
        
                        child_JP = child_EN.cloneNode(true); //克隆
                        child_JP.id = "Firend_JP";
                        mainFriendObj.appendChild(child_JP);
        
                        child_CN_SG = child_EN.cloneNode(true); //克隆
                        child_CN_SG.id = "Firend_CN_SG";
                        mainFriendObj.appendChild(child_CN_SG);
        
                        child_CN_HANTd = child_EN.cloneNode(true); //克隆
                        child_CN_HANTd.id = "Firend_CN_HANTd";
                        mainFriendObj.appendChild(child_CN_HANTd);
        
                        child_CN_HK = child_EN.cloneNode(true); //克隆
                        child_CN_HK.id = "Firend_CN_HK";
                        mainFriendObj.appendChild(child_CN_HK);
        
                        child_CN_MO = child_EN.cloneNode(true); //克隆
                        child_CN_MO.id = "Firend_CN_MO";
                        mainFriendObj.appendChild(child_CN_MO);
        
                        child_CN_TW = child_EN.cloneNode(true); //克隆
                        child_CN_TW.id = "Firend_CN_TW";
                        mainFriendObj.appendChild(child_CN_TW);
        
                        //-------------------------------------------------
        
                        var newGroupTitle = StateObj[0].cloneNode(true); //克隆
                        newGroupTitle.style.display = ""; //去除隐藏样式
                        newGroupTitle.innerText = "CN";
                        child_CN.appendChild(newGroupTitle);
        
                        newGroupTitle = newGroupTitle.cloneNode(true); //克隆
                        newGroupTitle.innerText = "EN";
                        child_EN.appendChild(newGroupTitle);
        
                        newGroupTitle = newGroupTitle.cloneNode(true); //克隆
                        newGroupTitle.innerText = "JP";
                        child_JP.appendChild(newGroupTitle);
        
                        newGroupTitle = newGroupTitle.cloneNode(true); //克隆
                        newGroupTitle.innerText = "CN_SG";
                        child_CN_SG.appendChild(newGroupTitle);
        
                        newGroupTitle = newGroupTitle.cloneNode(true); //克隆
                        newGroupTitle.innerText = "CN_HANTd";
                        child_CN_HANTd.appendChild(newGroupTitle);
        
                        newGroupTitle = newGroupTitle.cloneNode(true); //克隆
                        newGroupTitle.innerText = "CN_HK";
                        child_CN_HK.appendChild(newGroupTitle);
        
                        newGroupTitle = newGroupTitle.cloneNode(true); //克隆
                        newGroupTitle.innerText = "CN_MO";
                        child_CN_MO.appendChild(newGroupTitle);
        
                        newGroupTitle = newGroupTitle.cloneNode(true); //克隆
                        newGroupTitle.innerText = "CN_TW";
                        child_CN_TW.appendChild(newGroupTitle);
        
                        //遍历所有节点,向盒子里添加节点
                        for (let i = 0; i < jqobj.length; i++) {
                                let cur = jqobj.get(i);
                                let profileID = cur.getAttribute("data-steamid");
                                //--------------------------------------------------------------------
                                SpecialName = undefined;
                                steamName = undefined;
        
                                // if (document.URL.indexOf("/friends") == -1) { //如果是在个人资料页面
                                //      //获取备注
                                //      var SpecialNameobj = document.getElementsByClassName("nickname"); //nickname
                                //      SpecialName = undefined;
                                //      if (SpecialNameobj != "undefined") {
                                //              SpecialName = SpecialNameobj[0].innerText; //备注
                                //      }
                                //      //获取steam名称
                                //      steamName = document.getElementsByClassName("actual_persona_name")[0].innerText; //steam名称
                                //      name = steamName;
                                // } else //否则如果是好友界面
                                //{
                                        //获取名称,然后判断是备注还是steam名称
                                        var SpecialNameobj = cur.getElementsByClassName("friend_block_content");
                                        var nicknameObj = cur.getElementsByClassName("player_nickname_hint");
                                        SpecialName = undefined;
        
                                        if (SpecialNameobj.length > 0) //安全检查
                                        {
                                                if (nicknameObj.length > 0) //节点存在则是备注,不存在则是steam名称
                                                {
                                                        //console.log("获取到的是备注");
                                                        SpecialName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("*")); //提取备注
                                                        steamName = undefined; //就没有名称
                                                        if (SpecialName.indexOf('{CN}') != -1 || SpecialName.indexOf('{CN-N}') != -1) { //检查是否设置了国籍标识
                                                                child_CN.appendChild(SpecialNameobj[0].parentNode);
                                                        } else if (SpecialName.indexOf('{EN}') != -1 || SpecialName.indexOf('{EN-N}') != -1) {
                                                                child_EN.appendChild(SpecialNameobj[0].parentNode);
                                                        } else if (SpecialName.indexOf('{JP}') != -1 || SpecialName.indexOf('{JP-N}') != -1) {
                                                                child_JP.appendChild(SpecialNameobj[0].parentNode);
                                                        } else if (SpecialName.indexOf('{CN-SG}') != -1 || SpecialName.indexOf('{CN-SG-N}') != -1) {
                                                                child_CN_SG.appendChild(SpecialNameobj[0].parentNode);
                                                        } else if (SpecialName.indexOf('{CN-HANT}') != -1 || SpecialName.indexOf('{CN-HANT-N}') != -1) {
                                                                child_CN_HANT.appendChild(SpecialNameobj[0].parentNode);
                                                        } else if (SpecialName.indexOf('{CN-HK}') != -1 || SpecialName.indexOf('{CN-HK-N}') != -1) {
                                                                child_CN_HK.appendChild(SpecialNameobj[0].parentNode);
                                                        } else if (SpecialName.indexOf('{CN-MO}') != -1 || SpecialName.indexOf('{CN-MO-N}') != -1) {
                                                                child_CN_MO.appendChild(SpecialNameobj[0].parentNode);
                                                        } else if (SpecialName.indexOf('{CN-TW}') != -1 || SpecialName.indexOf('{CN-TW-N}') != -1) {
                                                                child_CN_TW.appendChild(SpecialNameobj[0].parentNode);
                                                        } else {
                                                                // jQuery("#log_body")[0].innerHTML +=
                                                                //      "<a style='color:#00ffd8;' target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID +
                                                                //      "\">" + '[' + (i + 1) + '/' + total + '] 已跳过, 没有设置国籍不能取消! ' + profileID + '  ' + SpecialName + "</a><br>";
                                                                // continue;
                                                        }
                                                } else if (nicknameObj.length == 0) {
                                                        //console.log("获取到的是steam名称");
                                                        // steamName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("\n")); //提取steam名称
                                                        // jQuery("#log_body")[0].innerHTML +=
                                                        //      "<a style='color:#00ffd8;' target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID +
                                                        //      "\">" + '[' + (i + 1) + '/' + total + '] 已跳过, 没有备注不能取消! ' + profileID + '  ' + steamName + "</a><br>";
                                                        // continue;
                                                }
                                        }
                                //}
                                //console.log("[Debug] name:", name);
                        }
                        GroupMode = 1;
                }
        
        });
        
        await jQuery("#OfflineTimeGroup").click(async function() { //按在线时间进行排序分组
                var SpecialName = undefined;
                var steamName = undefined;
                var name = undefined;
                var mode = 0;
                const total = jQuery("#search_results .selectable.offline").length; //选择的朋友总数
                if (total > 0) //选择的朋友总数
                {
                        jQuery("#log_head, #log_body").html("");
                        var jqobj = jQuery("#search_results .selectable.offline"); //选择离线的好友
                        var ArrOfflineTime = [];
        
                        if (GroupMode != 2) {
                                var mainFriendObj;
                                if (GroupMode == 1) { //节点已经被模式1处理过
                                        //备份和处理
                                        if (document.getElementById("search_results2") == null) { //没有被模式2处理过
                                                mainFriendObj = document.getElementById("search_results0"); //获取原节点
                                                var newCopyObj = mainFriendObj.cloneNode(true);
                                                var mainFriendObj1 = document.getElementById("search_results"); //获取之前模式的节点
                                                mainFriendObj1.style.display = "none"; //之前模式的节点隐藏
                                                mainFriendObj1.id = "search_results1"; //之前模式的节点
                                                mainFriendObj1.className = "profile_friends search_results1"; //之前模式的节点
                                                newCopyObj.style.display = ""; //克隆的原节点取消隐藏(显示)
                                                newCopyObj.id = "search_results"; //克隆的原节点
                                                newCopyObj.className = "profile_friends search_results"; //克隆的原节点
                                                mainFriendObj.parentNode.appendChild(newCopyObj); //再添加一个新的备份节点
                                        } else { //被模式2处理过
                                                var obj = document.getElementById("search_results2");
                                                var mainFriendObj1 = document.getElementById("search_results"); //获取之前模式的节点
                                                mainFriendObj = document.getElementById("search_results0"); //获取原节点
                                                mainFriendObj1.style.display = "none"; //之前模式的节点隐藏
                                                mainFriendObj1.id = "search_results1"; //之前模式的节点
                                                mainFriendObj1.className = "profile_friends search_results1"; //之前模式的节点
                                                obj.style.display = ""; //取消隐藏(显示)
                                                obj.id = "search_results"; //节点
                                                obj.className = "profile_friends search_results"; //节点
                                        }
                                } else { //节点还没有被动过
                                        //备份和处理
                                        mainFriendObj = document.getElementById("search_results"); //获取原节点
                                        var newCopyObj = mainFriendObj.cloneNode(true);
                                        newCopyObj.style.display = "none"; //克隆的原节点隐藏
                                        newCopyObj.id = "search_results0"; //克隆的原节点
                                        newCopyObj.className = "profile_friends search_results0"; //克隆的原节点
                                        mainFriendObj.parentNode.appendChild(newCopyObj); //再添加一个新的备份节点
        
        
                                }
        
                                var StateObj = mainFriendObj.getElementsByClassName("state_block");
                                for (let i = 0; i < StateObj.length; i++) {
                                        StateObj[i].style.display = "none"; //隐藏状态条
                                }
                                //创建新盒子和克隆分组节点
                                console.log("开始分组...");
                                child_Offline = document.createElement('div'); //创建
                                child_Offline.id = "Firend_Offline";
                                child_Offline.style.display = "flex";
                                child_Offline.style.flex = "1 100%";
                                child_Offline.style.flexFlow = "row wrap";
                                child_Offline.style.margin = "8px 0px 0px 0px";
                                // child_Offline.style.justifyContent = "space-start";
                                mainFriendObj.appendChild(child_Offline);
        
                                child_Online = child_Offline.cloneNode(true); //克隆
                                child_Online.id = "Firend_Online";
                                mainFriendObj.appendChild(child_Online);
        
                                child_InGame = child_Offline.cloneNode(true); //克隆
                                child_InGame.id = "Firend_InGame";
                                mainFriendObj.appendChild(child_InGame);
        
                                //-------------------------------------------------
        
                                var newGroupTitle = StateObj[0].cloneNode(true); //克隆
                                newGroupTitle.style.display = ""; //去除隐藏样式
                                newGroupTitle.innerText = "Offline";
                                child_Offline.appendChild(newGroupTitle);
        
                                newGroupTitle = newGroupTitle.cloneNode(true); //克隆
                                newGroupTitle.innerText = "Online";
                                child_Online.appendChild(newGroupTitle);
        
                                newGroupTitle = newGroupTitle.cloneNode(true); //克隆
                                newGroupTitle.innerText = "InGame";
                                child_InGame.appendChild(newGroupTitle);
        
                                for (let i = 0; i < jqobj.length; i++) {
                                        let cur = jqobj.get(i);
                                        let profileID = cur.getAttribute("data-steamid");
                                        //--------------------------------------------------------------------
                                        SpecialName = undefined;
                                        steamName = undefined;
        
                                        // if (document.URL.indexOf("/friends") == -1) { //如果是在个人资料页面
                                        //      //获取备注
                                        //      var SpecialNameobj = document.getElementsByClassName("nickname"); //nickname
                                        //      SpecialName = undefined;
                                        //      if (SpecialNameobj != "undefined") {
                                        //              SpecialName = SpecialNameobj[0].innerText; //备注
                                        //      }
                                        //      //获取steam名称
                                        //      steamName = document.getElementsByClassName("actual_persona_name")[0].innerText; //steam名称
                                        //      name = steamName;
                                        // } else //否则如果是好友界面
                                        //{
                                                //获取名称,然后判断是备注还是steam名称
                                                var SpecialNameobj = cur.getElementsByClassName("friend_block_content");
                                                var nicknameObj = cur.getElementsByClassName("player_nickname_hint");
                                                SpecialName = undefined;
        
                                                var OfflineTime = SpecialNameobj[0].getElementsByClassName("friend_last_online_text");
                                                var strOfflineTime = "";
        
                                                var nYear = "0",
                                                        nMonth = "0",
                                                        nDay = "0",
                                                        nHours = "0",
                                                        nMinutes = "0",
                                                        nSeconds = "0";
                                                var strData = "";
                                                if (OfflineTime.length > 0) //找到了
                                                {
                                                        strOfflineTime = OfflineTime[0].innerText.slice(5); //去掉‘上次在线’字符串
                                                        var strOfflineTimeArr = strOfflineTime.split(' ');
                                                        strOfflineTimeArr[strOfflineTimeArr.length - 1] = strOfflineTimeArr[strOfflineTimeArr.length - 1].slice(0,
                                                                -1); //去掉最后的‘前’字符串
                                                        //console.log("strOfflineTime",strOfflineTime,strOfflineTimeArr);
                                                        for (let i = 0; i < strOfflineTimeArr.length; i += 2) {
                                                                if (strOfflineTimeArr[i + 1] == "年")
                                                                        nYear = strOfflineTimeArr[i];
                                                                else if (strOfflineTimeArr[i + 1] == "月")
                                                                        nMonth = strOfflineTimeArr[i];
                                                                else if (strOfflineTimeArr[i + 1] == "天")
                                                                        nDay = strOfflineTimeArr[i];
                                                                else if (strOfflineTimeArr[i + 1] == "小时")
                                                                        nHours = strOfflineTimeArr[i];
                                                                else if (strOfflineTimeArr[i + 1] == "分钟")
                                                                        nMinutes = strOfflineTimeArr[i];
                                                                else if (strOfflineTimeArr[i + 1] == "秒")
                                                                        nSeconds = strOfflineTimeArr[i];
                                                        }
                                                        strData = nYear + '/' + nMonth + '/' + nDay + ' ' + nHours + ':' + nMinutes + ':' + nSeconds;
                                                        //console.info("strData",strData);
        
                                                        var hzWeek = new Array("日", "一", "二", "三", "四", "五", "六", "日");
        
                                                        function cweekday(wday) {
                                                                return hzWeek[wday];
                                                        }
        
                                                        function calaDay() { //计算时间差: 一个是当前时间，一个是相差的时间，就都转为秒数进行相减，再还原时间
                                                                var date = new Date();
                                                                ddd = parseInt(nDay); //转数字后取对应负数
                                                                //ttt = new Date(y, m - 1, d).getTime() + ddd * 24000 * 3600;
                                                                ttt = date.getTime() + ~(ddd * 86400);
                                                                theday = new Date();
                                                                theday.setTime(ttt);
                                                                //document.getElementById("result1").innerHTML = theday.getFullYear() + "年" + (1 + theday.getMonth()) + "月" + theday.getDate() + "日" + "星期" + cweekday(theday.getDay());
                                                                return theday.getTime(); //获取对应的时间戳
                                                        }
                                                        
                                                        function calbHMS() { //计算时间差: 一个是当前时间，一个是相差的时间，就都转为秒数进行相减，再还原时间
                                                                var date = new Date();
                                                                var date1 = new Date();
                                                                var s = nHours * 3600 + nMinutes * 60 + nSeconds;
                                                                // y2 = date.getYear();
                                                                // m2 = date.getMonth();
                                                                // d2 = date.getDay();
                                                                date1.setTime(date.getTime() + ~s);
                                                                // y3 = document.getElementById("SY3").value;
                                                                // m3 = document.getElementById("SM3").value;
                                                                // d3 = document.getElementById("SD3").value;
                                                                // day2 = new Date(y2, m2 - 1, d2);
                                                                // day3 = new Date(y3, m3 - 1, d3);
                                                                //document.getElementById("result2").innerHTML = (day3 - day2) / 86400000;
                                                                return date1.getTime();
                                                        }
        
                                                        var nS = 0;
                                                        if (nDay > 0) {
                                                                nS = calaDay()
                                                                //console.log("calaDay(nDay):",nS);
                                                        } else {
                                                                nS = calbHMS()
                                                                //console.log("calbHMS()",nS);
                                                        }
                                                        ArrOfflineTime.push([nS, i]);
                                                }
        
        
                                                //SpecialName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("*")); //提取备注
                                                //创建离线区和在线区
        
                                                //遍历所有的好友,找到离线的好友,解析字符串,装入Date对象 //6个数字指定年、月、日、小时、分钟、秒(0)  //没有的就写0
                                                //获取毫秒数 dateObject.getTime()   或者用   Date.parse(datestring)
                                                // var d=new Date("5/05/11 1:10:0");
                                                // document.write("从 1970/01/01 至今已有：" + d.getTime() + " 毫秒。");
                                                // document.write("从 1970/01/01 至今已有：" + Date.parse("5/05/11 1:10:0") + " 毫秒。");
        
                                                //存储在二维数组里，一个是毫秒数，一个是数组下标
                                                //对秒数进行升序排序，然后取下标，对指定好友依次添加
                                        //}
                                        //console.log("[Debug] name:", name);
                                } //for
                                
                                //console.log(ArrOfflineTime);
                                ArrOfflineTime.sort(function(a, b) {
                                        if (a[0] > b[0])
                                                return 1;
                                        if (a[0] < b[0])
                                                return -1;
                                        return 0;
                                }); //对时间戳排序
                                //console.log(ArrOfflineTime);
        
                                //遍历二维数组，然后取下标，对指定好友依次添加
                                for (let i = 0; i < ArrOfflineTime.length; i++) {
                                        child_Offline.appendChild(jqobj[ArrOfflineTime[i][1]]); //.getElementsByClassName("friend_block_content").parentNode
                                }
                                //将游戏中和在线的好友也添加到分组里
                                var jqobj1 = jQuery("#search_results .selectable.online"); //选择在线的好友
                                var jqobj2 = jQuery("#search_results .selectable.in-game"); //选择游戏中的好友
                                var jqobj3 = jQuery("#search_results .selectable.golden"); //选择金色的好友
                                for (let i = 0; i < jqobj3.length; i++) {
                                        var strGame = jqobj3[i].getElementsByClassName("friend_small_text")[0].innerText;
                                        var game = strGame.replace(/^\s+|\s+$/g, ""); //去除两边的空格
                                        //console.log("strGame");
                                        if (game == "") {
                                                //console.log("在线");
                                                child_Online.appendChild(jqobj3[i]);
                                        } else {
                                                //console.log(game);
                                                child_InGame.appendChild(jqobj3[i]);
                                        }
                                }
                                for (let i = 0; i < jqobj1.length; i++) {
                                        child_Online.appendChild(jqobj1[i]);
                                }
                                for (let i = 0; i < jqobj2.length; i++) {
                                        child_InGame.appendChild(jqobj2[i]);
                                }
                                GroupMode = 2;
                        }
                }
        });
        
        await jQuery("#ShowFriendData").click(async function() { //显示好友详细数据(不可用)
                traverseAllFriend(); //遍历所有好友
        
        });
        
        if((window.location.origin + window.location.pathname).indexOf('/groups') != -1){ //去除参数和锚点后的url
                jQuery("#comment_submit_special").unbind("click"); //取消绑定点击事件
                jQuery("#comment_submit_special").click(async function() {
                        layer.alert("目前还没有完善，请使用旁边第一个按钮!)",{icon: 0});
                        return;
                });
                
                //document.getElementById('group_tab_content_overview').style.display = "block"; //显示
                
                //InitGroupPage
                
                // if ( window.location.hash ) //锚点被提取
                //      {
                //              initial_group_url = window.location.hash.substr( 1 );
                //      }
                //      history.replaceState //锚点被清除
                
                //$('group_tab_content_overview').hide(); //UI被隐藏
                
                jQuery("#comment_submit").unbind("click"); //取消绑定点击事件
                jQuery("#comment_submit").click(async function() { //组留言
                        var postUrl = "https://steamcommunity.com/comment/Clan/post/";  //发布
                        var delUrl = "https://steamcommunity.com/comment/Clan/delete/"; //删除
                        var endUrl = "/-1/";                                            //结尾
                        
                        const newMgs= jQuery("#comment_textarea").val(); //获取评论内容
                        
                        var jqObj = jQuery('.group_block.selected');
                        var total = jqObj.length;
                        
                        if (total > 0) //选择的朋友总数
                        {
                                jQuery("#log_head, #log_body").html("");
                                var jqobj = jQuery("#search_results .selectable.offline"); //选择离线的好友
                                
                                //遍历所有节点,向盒子里添加节点
                                for (let i = 0; i < total; i++) {
                                        var idStr = jqObj[i].getElementsByClassName('groupMemberStat linkStandard steamLink')[0].href;
                                        var id = idStr.slice(idStr.indexOf('\'')+1,idStr.lastIndexOf('\'')); //id
                                        var link = jqObj[i].getElementsByClassName('linkTitle')[0].href; //组链接
                                        var anchorName = "/#commentthread_Clan_" + id + "_area"; //锚点名称
                                        var name = jqObj[i].getElementsByClassName('linkTitle')[0].innerText; //名称
                                        
                                        
                                        (function(i, id) {
                                                //setTimeout(function() {
                                                
                                                jQuery.post(postUrl + id + endUrl, {
                                                        comment: newMgs,
                                                        count: 6,
                                                        sessionid: g_sessionID,
                                                        feature2: -1
                                                }, function(response) {
                                                        if (response.success === false) {
                                                                jQuery("#log_body")[0].innerHTML +=
                                                                        "<a style='color:#ff2c85;' target='_blank' href=\"" + link + "\">" + '[' + (i + 1) + '/' + total + '] 留言失败了! ' + name +
                                                                        '&nbsp;&nbsp;&nbsp;&nbsp;' + response.error + "</a><br>";
                                                        } else {
                                                                jQuery("#log_body")[0].innerHTML +=
                                                                        '[' + (i + 1) + '/' + total + '] ' +
                                                                        "成功发表评论于 <a target='_blank' href=\"" + link + "\">" + name + "</a>" +
                                                                        "<span> → </span><a style='color:#FB7299;' target='_blank' href=\"" + (link + anchorName) + "\">" + newMgs + "</a><br>";
                                                        }
                                                }).fail(function() {
                                                        jQuery("#log_body")[0].innerHTML +=
                                                                '<span style="color:#DA2626;">[' + (i + 1) + '/' + total + '] ' +
                                                                "无法发表评论于 <a style='color:#DA2626;' target='_blank' href=\"" + link + "\">" + name + "</a></span><br>";
                                                }).always(function() {
                                                        jQuery("#log_head").html("<br><b>当前处理了 " + (i + 1) + "个, 总计 " + total + " 个组.<b>");
                                                });
                                                
                                                //}, i * 6000);
                                                
                                        })(i, id);
                                        await sleep(3000);
                                }
                        }
                        
                });
        }
        
}

/**
 * app.js
 */

class App{
        /**
         * 主程序运行环境初始化
         * @param {Object} yunMode 运行模式: 保留，当前未使用
         */
        constructor(yunMode) {
                //初始化 资源(必要)
                if(gc_res == null) gc_res = new resource();
                //初始化 UI(必要)
                if(gc_menu_friends_ui == null) gc_menu_friends_ui = new menu_friends_ui();            //您的好友
                if(gc_menu_friends_invite_ui == null) gc_menu_friends_invite_ui = new menu_friends_invite_ui();     //待处理邀请
                if(gc_menu_shielding_ui == null) gc_menu_shielding_ui = new menu_shielding_ui();          //已屏蔽
                if(gc_menu_gameFriend_ui == null) gc_menu_gameFriend_ui = new menu_gameFriend_ui();         //近期共同游戏的玩家
                if(gc_menu_liveAdmin_ui == null) gc_menu_liveAdmin_ui = new menu_liveAdmin_ui();          //直播版主
                if(gc_menu_following_Players_ui == null) gc_menu_following_Players_ui = new menu_following_Players_ui();  //关注的玩家
                if(gc_menu_groups_ui == null) gc_menu_groups_ui = new menu_groups_ui();             //您的组
                if(gc_menu_groups_invite_ui == null) gc_menu_groups_invite_ui = new menu_groups_invite_ui();      //待处理邀请
                
                //初始化 外部API(可选)
                if(gc_exApis == null) gc_exApis = new externalApis();
                
                //初始化 拓展功能(测试)
                // if(!gc_steamdb)
                // {
                //      gc_steamdb = new SteamDB();
                //      gc_steamdb.getFreeGameInfo();
                // }
                
                // if(!gc_ai)
                // {
                //      gc_ai = new intelligenceAI();
                //      gc_ai.getWeather('北京');
                // }
                
                return (async () => {
                        await this._runtimeInit(); //运行环境初始化
                        return this; // Return the newly-created instance
                }).call(this);
        }
        
        async _runtimeInit(){ //运行环境初始化
                await gc_res.init(true);
        }
        
        _lazyInit(){ //延迟初始化
                var customUrl = "";
                var profileID = getBaseInfo(0);
                if(gc_friAct == null) gc_friAct = new friendActivity(profileID || customUrl);
        }
        
        /* 初始化应用程序
        */
        async init(type){
                //0.读取错误信息数据库，检查是否需要进行恢复
                
                //1.读取存储数据库
                
                //2.准备基本运行环境
                
                var url = window.location.origin + window.location.pathname; //window.location.href //去除参数和锚点后的url
                //https://steamcommunity.com/id/miku-39/friends?l=english#state_online => https://steamcommunity.com/id/miku-39/friends
                if(URLs.g_friendUrlRegExp.test(url)){
                        console.log("重新构建UI-您的好友.");
                        if(gc_menu_friends_ui && typeof gc_menu_friends_ui.initUI === 'function')
                                return await gc_menu_friends_ui.initUI(true); //调用回调s
                }
                
                else if(URLs.g_otherUrlRegExp1_1.test(url)){
                        console.log("不处理-添加好友.");
                        //不处理
                        return false;
                }
                else if(URLs.g_otherUrlRegExp1_2.test(url)){
                        console.log("不处理-好友待处理邀请.");
                        //暂时 不处理
                        return false;
                }
                else if(URLs.g_otherUrlRegExp1_3.test(url)){
                        console.log("重新构建UI-已屏蔽.");
                        if(gc_menu_shielding_ui && typeof gc_menu_shielding_ui.initUI === 'function')
                                return await gc_menu_shielding_ui.initUI(true); //调用回调
                }
                else if(URLs.g_otherUrlRegExp1_4.test(url)){
                        console.log("不处理-近期共同游戏的玩家.");
                        //暂时 不处理
                        return false;
                }
                else if(URLs.g_otherUrlRegExp1_5.test(url)){
                        console.log("重新构建UI-直播版主.");
                        if(gc_menu_liveAdmin_ui && typeof gc_menu_liveAdmin_ui.initUI === 'function')
                                return await gc_menu_liveAdmin_ui.initUI(true); //调用回调
                }
                
                else if(URLs.g_otherUrlRegExp2_1.test(url)){
                        console.log("重新构建UI-关注的玩家.");
                        if(gc_menu_following_Players_ui && typeof gc_menu_following_Players_ui.initUI === 'function')
                                return await gc_menu_following_Players_ui.initUI(true); //调用回调
                }
                else if(URLs.g_otherUrlRegExp2_2.test(url)){
                        console.log("重新构建UI-您的组.");
                        //window.location.reload(false); //重新加载当前页面
                        if(gc_menu_groups_ui && typeof gc_menu_groups_ui.initUI === 'function')
                                return await gc_menu_groups_ui.initUI(true); //调用回调
                }
                else if(URLs.g_otherUrlRegExp2_3.test(url)){
                        console.log("不处理UI-组待处理邀请!");
                        //window.location.reload(false); //重新加载当前页面
                        //暂时 不处理
                        return false;
                }
                
                // else if(URLs.g_otherUrlRegExp3.test(url)){
                //      console.log("重新构建UI-您的好友.");
                // if(gc_menu_friends_ui && typeof gc_menu_friends_ui.initUI === 'function')
                //      return await gc_menu_friends_ui.initUI(true); //调用回调s
                // }
                
                
        }
        /* 运行应用程序
        //方式: 内置, 悬浮窗口 => "internal", "window"
        //语言: 重新设置要加载的语言 ==> 参考 g_languageList 对象
        */
        async run(){
                //0.前置准备
                
                //1.创建应用程序UI
                
                //2.注册应用程序事件
                // (async()=>{
                //      console.log("异步加载绘制资源..");
                //      await gc_res._loadDrawResources();//异步加载绘制资源
                // })();
                
                var url = window.location.origin + window.location.pathname; //window.location.href //去除参数和锚点后的url
                //https://steamcommunity.com/id/miku-39/friends?l=english#state_online => https://steamcommunity.com/id/miku-39/friends
                if(URLs.g_friendUrlRegExp.test(url)){
                        console.log("重新构建UI-您的好友.");
                        if(gc_menu_friends_ui && typeof gc_menu_friends_ui.initUI === 'function')
                                return await gc_menu_friends_ui.createUI(); //调用回调
                }
                
                else if(URLs.g_otherUrlRegExp1_1.test(url)){
                        console.log("不处理-添加好友.");
                        //不处理
                        return false;
                }
                else if(URLs.g_otherUrlRegExp1_2.test(url)){
                        console.log("不处理-好友待处理邀请.");
                        //暂时 不处理
                        return false;
                }
                else if(URLs.g_otherUrlRegExp1_3.test(url)){
                        console.log("重新构建UI-已屏蔽.");
                        if(gc_menu_shielding_ui && typeof gc_menu_shielding_ui.initUI === 'function')
                                return await gc_menu_shielding_ui.createUI(); //调用回调
                }
                else if(URLs.g_otherUrlRegExp1_4.test(url)){
                        console.log("不处理-近期共同游戏的玩家.");
                        //暂时 不处理
                        return false;
                }
                else if(URLs.g_otherUrlRegExp1_5.test(url)){
                        console.log("重新构建UI-直播版主.");
                        if(gc_menu_liveAdmin_ui && typeof gc_menu_liveAdmin_ui.initUI === 'function')
                                return await gc_menu_liveAdmin_ui.createUI(); //调用回调
                }
                
                else if(URLs.g_otherUrlRegExp2_1.test(url)){
                        console.log("重新构建UI-关注的玩家.");
                        if(gc_menu_following_Players_ui && typeof gc_menu_following_Players_ui.initUI === 'function')
                                return await gc_menu_following_Players_ui.createUI(); //调用回调
                }
                else if(URLs.g_otherUrlRegExp2_2.test(url)){
                        console.log("重新构建UI-您的组.");
                        //window.location.reload(false); //重新加载当前页面
                        if(gc_menu_groups_ui && typeof gc_menu_groups_ui.initUI === 'function')
                                return await gc_menu_groups_ui.createUI(); //调用回调
                }
                else if(URLs.g_otherUrlRegExp2_3.test(url)){
                        console.log("不处理UI-组待处理邀请!");
                        //window.location.reload(false); //重新加载当前页面
                        //暂时 不处理
                        return false;
                }
                
                // else if(URLs.g_otherUrlRegExp3.test(url)){
                //      console.log("重新构建UI-您的好友.");
                //      gc_menu_friends_ui && typeof gc_menu_friends_ui.initUI === 'function' && return await gc_menu_friends_ui.createUI(); //调用回调s
                // }
        }
        /* 停止应用程序运行
        //级别: 注销当前事件和UI 停止脚本运行, +还原改动, +释放资源  => "stop", "reModify", "releReSource"
        //方式: 内置, 悬浮窗口 => "internal", "window" 
        */
        stop(rank){
                //
        }
        /* 重新运行应用程序
        //级别: 从缓存重新加载, 从服务器重新加载, 只重新加载,不运行脚本 => "reLoadCache", "reLoadServer", "onlyLoad"
        //方式: 内置, 悬浮窗口 => "internal", "window" 
        */
        async reRun(rank){
                
        }
        /* 设置显示模式
        //模式: 显示, 隐藏 => "show", "hide"
        //方式: 内置, 悬浮窗口 => "internal", "window" 
        */
        setShowMode(showMode = "show", showType = "internal"){
                
        }
        /* 设置窗口参数
        //位置: Position: x, y => css单位
        //大小: Size: width, height => css单位
        //背景透明度: 百分比 => 0~1
        //是否描绘边框: bool => true, false
        //是否显示标题栏: bool => true, false
        */
        reSetWindow(posX, posY, width, height, alpha = 1, isShowBorder = true, isShowTitleBar = true){
                
        }
}

(async()=>{
        gc_app = await new App();
        if(await gc_app.init(true) != false){
                await gc_app.run();
        }
})();

// ==UserScript==
// @name         Any jQuery，页面注入jQuery，方便控制台调试代码
// @namespace    http://bbs.91wc.net/any-jquery.htm
// @version      0.3.12
// @description  write once run anywhere，注入jQuery，方便控制台调试代码
// @author       Wilson
// @match        http*://*/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @resource     jquery https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://greasyfork.org/scripts/411517-mytips/code/MyTips.js?version=851635
// @grant        unsafeWindow
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/411423/Any%20jQuery%EF%BC%8C%E9%A1%B5%E9%9D%A2%E6%B3%A8%E5%85%A5jQuery%EF%BC%8C%E6%96%B9%E4%BE%BF%E6%8E%A7%E5%88%B6%E5%8F%B0%E8%B0%83%E8%AF%95%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/411423/Any%20jQuery%EF%BC%8C%E9%A1%B5%E9%9D%A2%E6%B3%A8%E5%85%A5jQuery%EF%BC%8C%E6%96%B9%E4%BE%BF%E6%8E%A7%E5%88%B6%E5%8F%B0%E8%B0%83%E8%AF%95%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==

var myLibs = {
    "lodash" : "https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.20/lodash.min.js",
    "underscore" : "https://cdn.bootcdn.net/ajax/libs/underscore.js/1.11.0/underscore-min.js",
    "require" : "https://cdn.bootcdn.net/ajax/libs/require.js/2.3.6/require.min.js",
    "loadjs" : "https://unpkg.com/loadjs@4.2.0/dist/loadjs.min.js",
};
var manulUrls = {
    'jquery' : 'http://www.shouce.ren/api/view/a/12780',
    "lodash" : "https://www.lodashjs.com/",
    "underscore" : "https://underscorejs.bootcss.com/",
    "require" : "https://requirejs.org/",
    "loadjs" : "https://github.com/muicss/loadjs",
};

//jQuery注入成功后执行
function afterInject() {
    //Your codes here


    //你也可以像这样向页面中写全局变量或函数
    //_g.a="test a";
    //_g.b = function(){
    //   console.log("test b");
    //}
}

function aferChangeJquery(){

}

function initJQ(){
    //初始化_jq变量
    _g._jq = _g.jQuery;
    _g._jq.version=_g._jq.fn.jquery;
    _g.ww = window;
    _g.ww.version = jQuery.fn.jquery;
};

function initMyInfo(){
    //脚本信息
    _g.myinfo = {};
    _g.myinfo.name=GM_info.script.name;
    _g.myinfo.ver=GM_info.script.version;
    _g.myinfo.jqurl=GM_info.script.resources[0].url;
};

function usefullTools(){
    //切换jQuery版本
    if(typeof _g.changeJquery == 'undefined'){
        _g.changeJquery=_g.chjq=function(ver){
            if(console && console.info) console.info("%cWarning: switching jQuery may destroy the data structure of the original page", "color:red");
            if(!ver && console && console.info){return _g.jqVersions;}
            if(_g.jq === null && console && console.error){return "error: Please inject jQuery first";}
            if(/^\d+$/.test(ver)){ver = _g.jqVersions[ver];}
            var jqurl = "https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js";
            jqurl=jqurl.replace(/@[\d.]+\//, '@'+ver+'/');
            $.get(jqurl, function(data) {
                if($("#_g_jquery").length>0) $("#_g_jquery").remove();
                $("body").append('<script id="_g_jquery">'+data+'</script>');
                initJQ();
                if(fns) _g._jq.fn=_g.$.fn=_g.jQuery.fn = fns;
                if(xtend) _g._jq.extend=_g.$.extend=_g.jQuery.extend = xtend;
                if(xtendfn) _g._jq.fn.extend=_g.$.fn.extend=_g.jQuery.fn.extend = xtendfn;
                if(jqprototype) _g._jq.prototype=_g.$.prototype=_g.jQuery.prototype = jqprototype;
                aferChangeJquery();
                if(console && console.info) console.info("%csucessful","color:green", "loaded from: "+jqurl);
            }).fail(function(jqxhr, settings, exception) {
                if(console && console.log) console.error(exception, "load from: "+jqurl);
            });
            return "loading...";
        }
    }

    //把jQuery恢复到最初的状态
    if(typeof _g.changeToFirst == 'undefined'){
        _g.changeToFirst=_g.chfs=function(){
            if(_g.chfsjq){
                _g.$ = _g.jQuery = _g.chfsjq;
                initJQ();
                setTimeout(function(){
                    if(console && console.info) console.info("%csucessful","color:green");
                });
                return "done";
            } else {
                return "failed";
            }
        }
    }

    //模拟console.log
    if(typeof _g.cc === 'undefined'){
        _g.cc=function(v1,v2,v3,v4,v5){
            var spl="-----------------------------";
            if(v1 !== undefined && v2 !== undefined  && v3 !== undefined && v4 !== undefined && v5 !== undefined) {console.log(v1,v2,v3,v4,v5);return spl;}
            if(v1 !== undefined && v2 !== undefined  && v3 !== undefined && v4 !== undefined) {console.log(v1,v2,v3,v4);return spl;}
            if(v1 !== undefined && v2 !== undefined  && v3 !== undefined) {console.log(v1,v2,v3);return spl;}
            if(v1 !== undefined && v2 !== undefined) {console.log(v1,v2);return spl;}
            if(v1 !== undefined) {console.log(v1);return spl;}
            console.log();return spl;
        }
    }

    //打开手册
    if(typeof _g.manul === 'undefined'){
        _g.manul=function(name){
            name = name || 'jquery';
            window.open(manulUrls[name]);
            return "done";
        }
    }

    //手册列表
    if(typeof _g.manuls === 'undefined'){
        _g.manuls=function(){
            console.log(manulUrls);
        }
    }
    //添加js代码
    if(typeof _g.addScript === 'undefined'){
        _g.addScript=function(jscode){
            $("body").append(`<script>`+jscode+`</script>`);
            return "done";
        }
    }
    //添加css代码
    if(typeof _g.addStyle === 'undefined'){
        _g.addStyle=function(csscode){
             $("body").append(`<style>`+csscode+`</style>`);
            return "done";
        }
    }
    //加载类库
    if(typeof _g.loadLib === 'undefined'){
        _g.loadLib=function(name){
            if(!name) return myLibs;
            $("body").append(`<script src="`+myLibs[name]+`"></script>`);
            return "done";
        }
    }
    //添加html
    if(typeof _g.addHtml === 'undefined'){
        _g.addHtml=function(html){
            $("body").append(html);
            return "done";
        }
    }

    //页面进入编辑模式
    if(typeof _g.editPage === 'undefined'){
        _g.editPage=function(isEdit){
            isEdit = isEdit === undefined ? true : isEdit;
            if(isEdit){
                document.body.contentEditable=true;
                return "页面已进入编辑模式";
            } else {
                document.body.contentEditable=false;
                return "页面已退出编辑模式";
            }
        }
    }

    //获取jQuery版本
    getJQVers();
    //$.getJSON('https://data.jsdelivr.com/v1/package/npm/jquery', function(data) {
    //    if(data && data.versions){
    //        _g.jqVersions = data.versions;
    //    }
    //});
}

function getJQVers() {
    Object.defineProperty(_g, 'jqVersions', {
        get: function() {
            let data = getJSONSync("https://data.jsdelivr.com/v1/package/npm/jquery");
            return data.versions;
        }
    });
}

function getJSONSync(url){
    var request = new XMLHttpRequest(); // 创建新请求
    request.open("GET",url,false); // 传递false实现同步
    request.send(); // 立即发送请求

    // 如果请求不是200 OK,就报错
    if(request.status!==200) throw new Error(request.statusText);
    // 如果类型报错
    var type = request.getResponseHeader("Content-Type");
    // if(!type.match(/^text/))
    //     throw new Error("Expected textual response;got:"+type);
    var rs = {};
    try{rs=JSON.parse(request.responseText);}catch(e){console.log(e)}
    return rs;
}

var fns, xtend, xtendfn,jqprototype;
function injectJquery(){
    if(_g._jq === null){
        setTimeout(function(){
            //动态设置jQuery
            //var jq_code = GM_getResourceText('jquery');
            //$("body").append('<script id="_g_jquery">'+jq_code+'</script>');
            _g.$ = _g.jQuery = jQuery;
            //记住切换前的JQ
            _g.chfsjq = jQuery;

            //初始化_jq变量
            initJQ();
            //call afterInject
            afterInject();
            //system use
            sysAfterInject
        }, 0);
    } else {
        //记住切换前的JQ
        _g.chfsjq = _g._jq;

        //初始化_jq变量
        initJQ();
        //call afterInject
        afterInject();
        //system use
        sysAfterInject

        fns = _g._jq.fn;
        xtend = _g._jq.extend;
        xtendfn = _g._jq.fn.extend;
        jqprototype = _g._jq.prototype;
    }
};

function sysAfterInject(){

}

//防冲突
this.$ = this.jQuery = jQuery.noConflict(true);
//注入jQuery和全局变量_g
$("body").append(`<script id="_g_script">var _g=window, _w=_g, _jq=(typeof jQuery === "undefined") ? null : jQuery;</script>`);
var _g = _g||unsafeWindow;
//注入脚本信息
initMyInfo();
//注入jQuery
var __jq_switch = GM_getValue("__jq_switch")||"open";
if(__jq_switch=="open"){
    injectJquery();
}
//一些工具
usefullTools()

//开关
var jquerySwitchMenu =function(type, callback){
    var closeMenu, closeCallback = function(){
        if(callback) callback("close");
        if(closeMenu) GM_unregisterMenuCommand(closeMenu);
        openMenu = GM_registerMenuCommand("立即注入", openCallback);
    }
    var openMenu, openCallback = function(){
        if(callback) callback("open");
        if(openMenu) GM_unregisterMenuCommand(openMenu);
        closeMenu = GM_registerMenuCommand("取消注入", closeCallback);
    }
    if(type==="open"){
        closeMenu=GM_registerMenuCommand("取消注入", closeCallback);
    } else {
        openMenu=GM_registerMenuCommand("立即注入", openCallback);
    }
};
jquerySwitchMenu(__jq_switch, function(type){
    GM_setValue("__jq_switch", type);
    if(type=="open"){
        injectJquery()
        if(MyTips){top.MyTips.sucessTips("注入成功",null,null,{width:400,height:80});} else {alert("注入成功");}
    }else{
        if(MyTips){top.MyTips.sucessTips("取消成功，下次刷新生效",null,null,{width:400,height:80});} else {alert("取消成功，下次刷新生效");}
    }
});
// ==UserScript==
// @name         自动QQ授权登录
// @namespace    https://www.wan7.xin/
// @version      0.1
// @description  QQ授权登录页面自动选择设置优先授权的QQ或第一个QQ授权登录。
// @author       刘老六
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.js
// @match        https://xui.ptlogin2.qq.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/397523/%E8%87%AA%E5%8A%A8QQ%E6%8E%88%E6%9D%83%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/397523/%E8%87%AA%E5%8A%A8QQ%E6%8E%88%E6%9D%83%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
class QqAutoLogin {
    constructor(uin) {
        this.Uin = uin;
    }
    Auto() {
        var DefaultUid = $("a.face[uin='" + this.Uin + "']");
        if (DefaultUid.length) {
            console.log('使用设置的优先授权qq登录');
            DefaultUid.click()
        } else {
            if($("a.face[uin]").length != 0){
                console.log('选择第一个QQ登录');
                $("a.face[uin]")[0].click()
            }else{
                console.log('没有QQ');
            }
        }
    }
    SetDefaultUid() {
        var QqUid = prompt("请输入优先授权登录QQ");
        if (QqUid != null && QqUid != "") {
            GM_setValue("DefaultUid", QqUid);
        }
    }
}

(function() {
    var DefaultUid = GM_getValue("DefaultUid");
    //也可以不读取储存请注释掉上行，并将下行取消注释，填入优先授权登录QQ。
    //var DefaultUid = '此处输入你优先授权的qq';
    var QqAuto = new QqAutoLogin(DefaultUid);
    GM_registerMenuCommand('设置优先授权登录QQ', function() {
        QqAuto.SetDefaultUid();
    }, 's')
    window.onload=function(){
        QqAuto.Auto()
    };
})();
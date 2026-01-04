// ==UserScript==
// @name         stop misoperation
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  when u using prd env,it can stop misoperation!!
// @author       double jy
// @match        https://www.baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415970/stop%20misoperation.user.js
// @updateURL https://update.greasyfork.org/scripts/415970/stop%20misoperation.meta.js
// ==/UserScript==
function ajaxSend(objectOfXMLHttpRequest, callback) {
    if(!callback){
        return;
    }

    var s_ajaxListener = new Object();
    s_ajaxListener.tempOpen = objectOfXMLHttpRequest.prototype.open;
    s_ajaxListener.tempSend = objectOfXMLHttpRequest.prototype.send;
    s_ajaxListener.callback = function () {
        // this.method :the ajax method used
        // this.url :the url of the requested script (including query string, if any) (urlencoded)
        // this.data :the data sent, if any ex: foo=bar&a=b (urlencoded)
        callback(this.method, this.url, this.data);
    }

    objectOfXMLHttpRequest.prototype.open = function(a,b) {
        if (!a) a='';
        if (!b) b='';
        s_ajaxListener.tempOpen.apply(this, arguments);
        s_ajaxListener.method = a;
        s_ajaxListener.url = b;
        if (a.toLowerCase() == 'get') {
            s_ajaxListener.data = b.split('?');
            s_ajaxListener.data = s_ajaxListener.data[1];
        }
    }

    objectOfXMLHttpRequest.prototype.send = function(a,b) {
        if(s_ajaxListener.method.toLowerCase() == 'post' && s_ajaxListener.url.indexOf('https://www.baidu.com') >= 0){
            if(!confirm("你确定要操作线上环境??????????"))return;
        }
        if (!a) a='';
        if (!b) b='';
        s_ajaxListener.tempSend.apply(this, arguments);
        if(s_ajaxListener.method.toLowerCase() == 'post') {
            s_ajaxListener.data = a;
        }
        s_ajaxListener.callback();
    }
};

function onAjaxSend(method, url, data) {
    if(method=='POST'){
    }
};

(function() {
    'use strict';


    // Your code here...
    ajaxSend(globalThis.XMLHttpRequest, onAjaxSend);
})();
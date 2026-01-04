// ==UserScript==
// @name         keylol屏蔽用户点评(专为AI-Compare编写)
// @namespace    sbnmsl
// @version      0.1
// @description  本脚本用于屏蔽 keylol某喜欢用点评发表各种傻逼巨婴言论的用户
// @author       Sneer_cat
// @match        *://keylol.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492513/keylol%E5%B1%8F%E8%94%BD%E7%94%A8%E6%88%B7%E7%82%B9%E8%AF%84%28%E4%B8%93%E4%B8%BAAI-Compare%E7%BC%96%E5%86%99%29.user.js
// @updateURL https://update.greasyfork.org/scripts/492513/keylol%E5%B1%8F%E8%94%BD%E7%94%A8%E6%88%B7%E7%82%B9%E8%AF%84%28%E4%B8%93%E4%B8%BAAI-Compare%E7%BC%96%E5%86%99%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //此处填写用户uid，单人格式为[xxxxx]，多人格式为[xxxxxx,xxxxxx]
    var uid=[302311];
    //重写ajax添加监听
    function ajaxEventTrigger(event) {
        var ajaxEvent = new CustomEvent(event, { detail: this });
        window.dispatchEvent(ajaxEvent);
    }
    var oldXHR = window.XMLHttpRequest;
    function newXHR() {
        var realXHR = new oldXHR();
        realXHR.addEventListener('abort', function () { ajaxEventTrigger.call(this, 'ajaxAbort'); }, false);
        realXHR.addEventListener('error', function () { ajaxEventTrigger.call(this, 'ajaxError'); }, false);
        realXHR.addEventListener('load', function () { ajaxEventTrigger.call(this, 'ajaxLoad'); }, false);
        realXHR.addEventListener('loadstart', function () { ajaxEventTrigger.call(this, 'ajaxLoadStart'); }, false);
        realXHR.addEventListener('progress', function () { ajaxEventTrigger.call(this, 'ajaxProgress'); }, false);
        realXHR.addEventListener('timeout', function () { ajaxEventTrigger.call(this, 'ajaxTimeout'); }, false);
        realXHR.addEventListener('loadend', function () { ajaxEventTrigger.call(this, 'ajaxLoadEnd'); }, false);
        realXHR.addEventListener('readystatechange', function() { ajaxEventTrigger.call(this, 'ajaxReadyStateChange'); }, false);
        return realXHR;
    }
    window.XMLHttpRequest = newXHR;

    window.addEventListener('ajaxReadyStateChange', function (e) {
        if(e.detail.readyState == 4){
            setTimeout(function(){hideuser();},1000)
        }
    });
    window.addEventListener('ajaxAbort', function (e) {
    });


    var hidetitle=1;
    var hidereply=1;
    var hide = 0;
    hideuser();
    function hideuser(){
        console.info('hidestart');
            for (var m2 = 0; m2 < uid.length; m2++) { //删除点评,特意为只喜欢点评的傻逼AI-Compare(302311)准备
                var nowuid4 = uid[m2];
                var reg4 = new RegExp("suid-" + nowuid4, 'g');
                var replylist4 = document.getElementsByClassName('xi2 xw1');
                for (var n2 = 0; n2 < replylist4.length; n2++) {
                    if (reg4.test(replylist4[n2].href)) {
                        replylist4[n2].parentNode.parentNode.remove();
                        hide++;
                    }
                }
            }
        console.info('共隐藏'+hide+'条主题/回复')
    }
})();

// ==UserScript==
// @name         Kamisato Ayaka University_Togetclass
// @license      Mozilla Public License 1.1 (MPL)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hope we can get the classes we desire all.
// @author       Endorsie
// @grant        none
// @match        https://jxw.sylu.edu.cn/xsxk/zzxkyzb_cxZzxkYzbIndex.html?gnmkdm=N253512&layout=default&su=(学号，填写后删除括号)
// @downloadURL https://update.greasyfork.org/scripts/503476/Kamisato%20Ayaka%20University_Togetclass.user.js
// @updateURL https://update.greasyfork.org/scripts/503476/Kamisato%20Ayaka%20University_Togetclass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.confirm = function() { return true; };  
    window.alert   = function() { return true; };   

    const registrationInterval = 500; 
    const pageRefreshTimeout = 30000;

   let registrationAttempt = setInterval(function() {
        generateMixed('课程代码1', '课程代码2');    
    }, registrationInterval);

    setTimeout(function() {
        clearInterval(registrationAttempt);
        window.location.reload(); 
    }, pageRefreshTimeout);
})();

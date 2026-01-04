// ==UserScript==
// @name         宿舍网210自动登录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动登录宿舍网络
// @author       zhao6x6x
// @match        http://211.138.1.148:8888/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424846/%E5%AE%BF%E8%88%8D%E7%BD%91210%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/424846/%E5%AE%BF%E8%88%8D%E7%BD%91210%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    var zhanghao="19888888888";//账号
    var mima="198888"//密码
    var input=document.querySelector('[name=bpssUSERNAME]');
    input.value=zhanghao;
    document.querySelector('[name=bpssBUSPWD]').value=mima;
    var btn=document.querySelector('#subText');
    btn.click();
    checkLogin();
})();
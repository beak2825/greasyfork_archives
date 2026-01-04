// ==UserScript==
// @name         U2懒人一键签到
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       You
// @match        https://u2.dmhy.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30673/U2%E6%87%92%E4%BA%BA%E4%B8%80%E9%94%AE%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/30673/U2%E6%87%92%E4%BA%BA%E4%B8%80%E9%94%AE%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    function settime() {
        oForm.value = Date();
    }
    if(location.pathname.match('showup.php') && document.getElementById('info_block').tBodies[0].rows[0].cells[0].getElementsByTagName('table')[0].tBodies[0].rows[0].cells[0].getElementsByTagName('a')[5].innerHTML == '立即签到') {
        document.addEventListener('visibilitychange',function(){
            if(document.visibilityState === 'visible') {
                $('#showup p>.faqlink').click();
            }
        },false);
        var oForm = document.getElementById('outer').getElementsByTagName('textarea')[0];
        var timer = setInterval(settime, 1000);
        oForm.value = Date();

        oForm.addEventListener('focus', function(){
            clearInterval(timer);
            oForm.value = "";
        });
        oForm.addEventListener('blur', function(){
            oForm.value = Date();
            timer = setInterval(settime,1000);
        });
    }
    var style = document.createElement('style');
    style.innerHTML = 'td#outer.outer td.embedded td>span {word-break:break-word !important};';
    document.head.appendChild(style);
})();

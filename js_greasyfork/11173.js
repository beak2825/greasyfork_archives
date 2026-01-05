// ==UserScript==
// @name         Depositfiles Helper
// @description  Just a helper
// @namespace    x4_dhelper
// @version      0.1
// @author       x4fab
// @include      http://dfiles.ru/files/*
// @include      http://depositfiles.com/files/*
// @include      https://depositfiles.com/files/*
// @grant        none
// @run-at       document-start
// @license      CC0
// @downloadURL https://update.greasyfork.org/scripts/11173/Depositfiles%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/11173/Depositfiles%20Helper.meta.js
// ==/UserScript==

document.title = 'Depositfiles';

window.onmessage = function(e){
    document.querySelector('#adcopy_response').value =
    document.querySelector('#adcopy-expanded-response').value = e.data;
};

window.onload = function (c, p, d){
    c = p = d = t = b = nn = 1;
    setInterval(function() {
        c && Array.prototype.forEach.call(
            document.querySelectorAll('#free_btn'),
            function (e){
                c = e.click();
            });
        
        p && Array.prototype.forEach.call(
            document.querySelectorAll('[href="javascript:close_iframe_console();"]'),
            function (e){
                p = e.click();
            });
        
        d && Array.prototype.forEach.call(
            document.querySelectorAll('#downloader_file_form[onsubmit="download_started();show_begin_popup(0);"] a'),
            function (e){
                d = e.click();
            });
        
        t && Array.prototype.forEach.call(
            document.querySelectorAll('#adcopy_response'),
            function (e){
                t = 0;
                e.onkeydown = function (e){ if (e.keyCode == 13) document.querySelector('input[value="Continue"]').click() }
            });
        
        b && Array.prototype.forEach.call(
            document.querySelectorAll('.downloadblock.downloadblock_limit .ip .ipbg strong'),
            function (e){
                b = 0;
                var m = e.innerHTML.match(/\s{30}(\d+(?:\.\d+)?) s/);
                setTimeout(function(){ location.reload() }, m ? Math.min(+m[1] * 1e3, 30e3) : 60e3);
            });
        
        nn && Array.prototype.forEach.call(
            document.querySelectorAll('#adcopy_response'),
            function (e){
                nn = 0;
                var n = new Notification('Captcha Required', { icon: 'http://static.dfiles.ru/images/favicon.ico' });
                n.onclick = function(){ window.focus() };
                e.onchange = function(){ n.close(); };
            });
    }, 180);
};
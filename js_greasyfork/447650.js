// ==UserScript==
// @name         哔哩哔哩字幕转str字幕
// @namespace    http://tampermonkey.net/
// @description  哔哩哔哩字幕转str字幕，按F12 查看 console 结果
// @version      0.2
// @author       Itsky71
// @match        https://*.hdslb.com/*.json
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/447650/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%AD%97%E5%B9%95%E8%BD%ACstr%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/447650/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%AD%97%E5%B9%95%E8%BD%ACstr%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var xhr = new XMLHttpRequest();
    xhr.open("get", window.location.href, true);
    xhr.responseType = "json";
    xhr.onload = function() {
        var str = '';
        var body = this.response.body;
        for(var i=0;i<body.length;i++){
            var item = body[i];
            var fromArr = String(item.from).split('.');
            var toArr = String(item.to).split('.');
            var from = '';
            var to = '';
            if (parseInt(fromArr[0]) < 60) {
                var fx = parseInt(fromArr[0]);
                if(fx<10){fx='0'+fx}
                from = '00:00:'+fx;
            } else {
                var fs = parseInt(fromArr[0]) % 60;
                if(fs < 10) {
                    fs = '0'+fs;
                }
                var fm = Math.floor(parseInt(fromArr[0]) / 60);
                if (fm < 10) {
                    fm = '0'+fm;
                }
                var fh = Math.floor(parseInt(fromArr[0]) / 3600);
                if(fh<10){
                    fh='0'+fh;
                }
                from = fh+':'+fm+':'+fs;
            }
            if (parseInt(toArr[0]) < 60) {
                var tx = parseInt(toArr[0]);
                if(tx<10){tx='0'+tx}
                to = '00:00:'+tx;
            } else {
                var ts = parseInt(toArr[0]) % 60;
                if(ts < 10) {
                    ts = '0'+ts;
                }
                var tm = Math.floor(parseInt(toArr[0]) / 60);
                if (tm < 10) {
                    tm = '0'+tm;
                }
                var th = Math.floor(parseInt(toArr[0]) / 3600);
                if(th<10){
                    th='0'+th;
                }
                to = th+':'+tm+':'+ts;
            }
            var fms = parseInt(fromArr[1]);
            var tms = parseInt(toArr[1]);
            if(fms < 10){
                 fms = fms + '00';
            }else if(9<fms<100) {
                fms = fms+'0'
            }
            if(tms < 10){
                 tms = tms + '00';
            }else if(9<tms<100) {
                tms = tms+'0'
            }

            str += parseInt(i+1) + "\n";
            str += from + ',' + fms + ' --> ' + to + ',' + tms;
            str += "\n";
            str += item.content;
            str += "\n";
            str += "\n";
        }
        console.log(str);
    }
    xhr.send();
})();
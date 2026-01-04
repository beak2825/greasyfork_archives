// ==UserScript==
// @name         DM1080_to_ZZZ
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  ('-')emmm
// @author       Anxietier
// @match        *dm1080p.com/archives*
// @match        *52kbd.com/archives*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371288/DM1080_to_ZZZ.user.js
// @updateURL https://update.greasyfork.org/scripts/371288/DM1080_to_ZZZ.meta.js
// ==/UserScript==

(function() {
    var Spans = document.querySelectorAll('.entry-content span')
    var Temp = "";
    for(var i in Spans) {
        var Str = Spans[i].innerText;
        var N1 = Str.indexOf('资料编号：');
        var N2 = Str.indexOf('资料编码：');
        if (N1>=0 || N2>=0) {
            var str = Str. substr((N1>=0?N1:N2)+5,7);
            if (Temp != str){
                var Btn1;
                var Url1 = "https:\/\/www.zzzpan.com\/?\/file\/view-" +str+ ".html";
                (Btn1 = document.createElement("button")).innerHTML = "外链1";
                Btn1.setAttribute("onclick", "window.open('"+Url1+"');");
                Btn1.setAttribute("style", "margin-left:15px;margin-right:15px;");
                Spans[i].appendChild(Btn1);

                var Btn2;
                var Url2 = "https:\/\/zz.52kbd.com\/?\/file\/view-" +str+ ".html";
                (Btn2 = document.createElement("button")).innerHTML = "外链2";
                Btn2.setAttribute("onclick", "window.open('"+Url2+"');");
                Btn2.setAttribute("style", "margin-left:15px;margin-right:15px;");
                Spans[i].appendChild(Btn2);

                Temp = str;
            }
        }
    }
})();
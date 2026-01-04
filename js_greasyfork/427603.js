// ==UserScript==
// @name         mitbbs_helper
// @namespace    https://www.mitbbs.com/
// @version      1.0
// @description  Skip login captcha.
// @author       fantasist
// @match        *://www.mitbbs.com/*mitbbs_login*.php
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/427603/mitbbs_helper.user.js
// @updateURL https://update.greasyfork.org/scripts/427603/mitbbs_helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var btn = document.createElement("button");
    btn.innerText="免Captcha登陆";
    btn.onclick = () => {
        var jsondata;

        var id = document.getElementsByName("id")[0].value;
        var pass = document.getElementsByName("passwd")[0].value;

        var payload = 'msg={"reqType":"0601","username":"' + id + '","password":"' + pass + '","kickmulti":"yes"}';

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/iphone_new/service_new.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(payload);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // in case we reply back from server
                jsondata = JSON.parse(xhr.responseText);
                document.cookie = "UTMPKEY=" + jsondata.data[0].UTMPKEY + ";domain=.mitbbs.com;path=/";
                document.cookie = "UTMPNUM=" + jsondata.data[0].UTMPNUM + ";domain=.mitbbs.com;path=/";
                document.cookie = "UTMPUSERID=" + jsondata.data[0].UTMPUSERID + ";domain=.mitbbs.com;path=/"; // necessary for website, not POST
                window.location = 'https://www.mitbbs.com/newindex/kjjy.php';
            }
        }
    }

    document.getElementsByName("forget")[0].parentNode.appendChild(btn);
})();

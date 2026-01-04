// ==UserScript==
// @name         早会-redmine-增强
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  CC-早会-redmine-增强
// @author       章小慢
// @match        https://t.xjjj.co/projects/cc_sprint/issues*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xjjj.co
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494274/%E6%97%A9%E4%BC%9A-redmine-%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/494274/%E6%97%A9%E4%BC%9A-redmine-%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var cf5 = document.querySelectorAll("td.cf_5");

    for (var cf5_iterm of cf5) {
        if (cf5_iterm.textContent == "") {
            cf5_iterm.innerHTML = "无";
            cf5_iterm.parentNode.style.backgroundColor= "gainsboro"
            continue
        }

        cf5_iterm.firstElementChild.innerText = "有";
        // cf5_iterm.style.display = 'none';
    }

    var cf6 = document.querySelectorAll("td.cf_6");
    for (var cf6_iterm of cf6) {
        if (cf6_iterm.textContent == "") {
            cf6_iterm.innerHTML = "无";
            cf6_iterm.parentNode.style.backgroundColor= "bisque"
            continue
        }
        console.log(cf6_iterm.firstElementChild);
        cf6_iterm.firstElementChild.innerText = "有";
       // cf6_iterm.style.display = 'none';
    }

    var cf7 = document.querySelectorAll("td.cf_7");
    for (var cf7_iterm of cf7) {
        if (cf7_iterm.textContent == "") {
            cf7_iterm.innerHTML = "无";
            cf7_iterm.parentNode.style.backgroundColor= "beige"
            continue;
        }
        console.log(cf7_iterm.firstElementChild);
        cf7_iterm.firstElementChild.innerText = "有";
        // cf7_iterm.style.display = 'none';
    }

    var subjectElements = document.getElementsByClassName("subject");
    for (var subject of subjectElements) {
        if (
            subject.innerHTML.includes("需求汇总") ||
            subject.innerHTML.includes("会议")
           ) {
            subject.parentNode.style.backgroundColor= "#fff"
        }
    }
})();
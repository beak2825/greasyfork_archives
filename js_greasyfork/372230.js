// ==UserScript==
// @name         Notification Filter
// @namespace    http://github.com/yuzulabo
// @version      1.1.2
// @description  一時的に通知を返信のみ見たいけど消したくは無いとき
// @author       nzws / ねじわさ
// @match        https://knzk.me/*
// @match        https://mastodon.cloud/*
// @match        https://friends.nico/*
// @match        https://pawoo.net/*
// @match        https://itabashi.0j0.jp/*
// @license       MIT License
// @downloadURL https://update.greasyfork.org/scripts/372230/Notification%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/372230/Notification%20Filter.meta.js
// ==/UserScript==

(function() {
    window.onload = function () {
        var style = document.createElement("style");
        style.id = "notifilter-js";
        document.querySelector("head").appendChild(style);

        style = document.createElement("style");
        style.innerHTML = "#notifilter{background: #313543;border: 0;color: #9baec8;font-size: 16px;}.notiactive{color:#fff !important;}";
        document.querySelector("head").appendChild(style);

        window.isFilter = false;

        var button_b = document.querySelector(".column button .fa-bell").offsetParent.children[1];
        var button = document.createElement("button");
        button.id = "notifilter";
        button.innerHTML = "<i class='fa fa-comment'></i>";
        button_b.insertBefore(button, button_b.firstChild);

        button.addEventListener('click', filter);
    };

    function filter() {
        window.isFilter = !window.isFilter;
        document.getElementById('notifilter-js').innerHTML = window.isFilter ? '.notification{display:none;}' : '';
        document.getElementById('notifilter').className = window.isFilter ? 'notiactive' : '';
    }
})();
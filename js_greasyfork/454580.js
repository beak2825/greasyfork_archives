// ==UserScript==
// @name           battleHelper
// @author         omne
// @namespace      omne
// @description    Помощь
// @version        0.38
// @include        /^https{0,1}:\/\/((www|qrator|my|h-tst2020)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/(war|warlog|leader_guild|leader_army|inventory).php(?!.?setkamarmy)/
// @grant          GM_xmlhttpRequest
// @license        GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/454580/battleHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/454580/battleHelper.meta.js
// ==/UserScript==

(function() {
    var dailyURL = "https://daily.heroeswm.ru/";
    let e = document.createElement('script');
    e.src = dailyURL + "i/js/dailyJS.js?v=" + Date.now();
    document.head.appendChild(e);
    if (location.pathname.indexOf("inventory.php") >= 0) {
        var inp = "";
        var bt = "";
        function inv_art_search_show() {
            let info = document.getElementById('inv_art_amount');
            for (let i = 0; i < info.children.length; i++) {
                info.children[i].style.display = "none";
            }
            if (inp == "") {
                inp = document.createElement("input");
                inp.setAttribute("placeholder", "Поиск по названию");
                inp.setAttribute("type", "text");
                inp.setAttribute("id", "inp_search");
                info.append(inp);
                inp.addEventListener('input', search);
                inp.style.display = "inline-block";
                bt = document.createElement("button")
                bt.innerHTML = "Скрыть поиск";
                bt.setAttribute("id", "bt_search");
                info.append(bt);
                bt.addEventListener('click', hide_search);
                bt.style.display = "inline-block";
            } else {
                bt.style.display = "inline-block";
                inp.style.display = "inline-block";
            }
            start_hide_hwm_hint();
        }
        function hide_search() {
            let info = document.getElementById('inv_art_amount');
            for (let i = 0; i < info.children.length; i++) {
                info.children[i].style.display = (info.children[i].tagName == "DIV") ? "inline-block" : "none";
            }
        }
        function search() {
            let s = document.getElementById("inp_search").value;
            let el = document.getElementById("inventory_block");
            for (let i = 0; i < el.children.length; i++) {
                let id = el.children[i].getAttribute("art_idx");
                if (id == null) {
                    continue;
                }
                el.children[i].style.display = (arts[id].name.toLowerCase().includes(s.toLowerCase())) ? "block" : "none";
            }
        }
        let sDiv = document.createElement("div");
        let sImg = document.createElement("img");
        sImg.setAttribute("src", dailyURL + "i/search_logo.png");
        sImg.setAttribute("class", "inv_100mwmh");
        sDiv.append(sImg);
        sDiv.classList.add("divs_inline_right_24");
        sDiv.classList.add("btn_hover");
        sDiv.classList.add("show_hint");
        sDiv.style.right = "28px";
        document.getElementById("inv_art_amount").append(sDiv);
        sDiv.setAttribute("hint", "Поиск по названию");
        sDiv.setAttribute("hwm_hint_added", 1);
        sDiv.addEventListener('mousemove', show_hwm_hint);
        sDiv.addEventListener('touchstart', show_hwm_hint);
        sDiv.addEventListener('mouseout', hide_hwm_hint);
        sDiv.addEventListener('touchend', hide_hwm_hint);
        sDiv.addEventListener('click', inv_art_search_show);
    }
    if ((location.pathname.indexOf("war.php") >= 0)||(location.pathname.indexOf("warlog.php") >= 0)) {
        let info = "<b>battlehelper отключён</b>";
        let elem = [];
        elem[0] = document.querySelector("#chat_format");
        elem[1] = document.querySelector("#chat_format_classic");
        elem[0].innerHTML = info + elem[0].innerHTML;
        elem[1].innerHTML = info + elem[1].innerHTML;
    }
})();
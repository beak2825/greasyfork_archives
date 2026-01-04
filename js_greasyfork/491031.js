// ==UserScript==
// @name           battleHelper
// @author         omne
// @namespace      omne
// @description    Помощь
// @version        0.37.1
// @include        /^https{0,1}:\/\/((www|qrator|my)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/(war|warlog|leader_guild|leader_army|inventory).php(?!.?setkamarmy)/
// @grant          GM_xmlhttpRequest
// @license        GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/491031/battleHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/491031/battleHelper.meta.js
// ==/UserScript==

(function() {
    var dailyURL = "https://daily." + location.host.substring(location.host.indexOf(".") + 1) + "/";
    let e = document.createElement('script');
    e.src = "https://cdn.jsdelivr.net/gh/No0Priority/whm/battlehelper.js";
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
    if ((location.pathname.indexOf("war.php") >= 0) || (location.pathname.indexOf("warlog.php") >= 0)) {
        let timer = setInterval(check_start, 10);

        function check_start() {
            if (unsafeWindow.gpause == false) {
                unsafeWindow.gpause = true;
                clearInterval(timer);
            }
        }
        var warid = location.search.match(/warid=([0-9]+)/)[1];
        var key = "";
        if (location.search.match(/show_for_all=([0-9a-zA-Z]+)/)) {
            key = location.search.match(/show_for_all=([0-9a-zA-Z]+)/)[1];
        };
        var att = 0;
        var unit = ["", "", "", "", "", "", "", ""];
        getAtb(0);
        document.getElementById("confirm_ins").addEventListener("click", function() { setTimeout(getAtb(1), 4000); }, false);

        function getAtb(r) {
            GM_xmlhttpRequest({
                method: "GET",
                url: "/battle.php?lastturn=-3&warid=" + warid + "&show_for_all=" + key,
                onload: function(res) {
                    let info = "<style>.cont{position:relative;display:inline-block}.count {position: absolute;right: 0;bottom: 0;color: #f5c140;text-shadow: 0px 0px 3px #000, 0px 0px 3px #000, 0px 0px 3px #000, 0px 0px 3px #000;font-size: 1rem;font-weight: bold;}</style>";
                    info += "<b>Стартовый бонус АТБ</b><BR>";
                    if (res.responseText == "t=950turns=") {
                        if (r == 1) {
                            info += "Ошибка загрузки, начните бой и обновите страницу!";
                        } else {
                            return false;
                        }
                    }
                    let data = res.responseText.substring(res.responseText.indexOf(";/") + 2).split(";");
                    for (let i = 0; i < data.length - 1; i++) {
                        if (data[i].indexOf("|rock|") != -1) {
                            continue;
                        }
                        let unitNum = Number(data[i].substring(1, 3));
                        let armyNum = Number(data[i].substring(5 + 0 * 6, 5 + 1 * 6)) - 1;
                        let count = Number(data[i].substring(5 + 12 * 6, 5 + 13 * 6));
                        let startAtb = 100 - Number(data[i].substring(5 + 9 * 6, 5 + 10 * 6));
                        let img;
                        if (data[i].indexOf("|hero|") == -1) {
                            img = data[i].substring(5 + 24 * 6, data[i].indexOf("|"));
                        } else {
                            img = data[i].split("|")[8].substring(1);
                        }
                        img = img.substring(0, img.length - 3);
                        unit[armyNum] += "<div class = 'cont'><img width = '40px' src='/i/portraits/" + img + "anip40.png'><div class = 'count'>" + startAtb + "</div></div>";
                    }
                    for (let i = 0; i < unit.length; i++) {
                        if (unit[i] != "") {
                            info += "Команда №" + (i + 1) + "<BR>" + unit[i] + "<BR>";
                        }
                    }
                    let elem = [];
                    elem[0] = document.querySelector("#chat_format");
                    elem[1] = document.querySelector("#chat_format_classic");
                    elem[0].innerHTML = "<div class = 'atb-info' style = 'display:none'>" + info + "</div>" + elem[0].innerHTML;
                    elem[1].innerHTML = "<div class = 'atb-info' style = 'display:none'>" + info + "</div>" + elem[1].innerHTML;
                }
            });
        }
    }
})();
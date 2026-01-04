// ==UserScript==
// @name         omneHelper
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://www.heroeswm.ru/pl_info.php*
// @match        https://www.heroeswm.ru/forum_thread.php*
// @match        https://www.heroeswm.ru/forum_ban.php*
// @match        https://www.heroeswm.ru/forum_messages.php*
// @match        https://www.heroeswm.ru/auction_buy_now.php*
// @match        https://my.lordswm.com/clan_info.php*
// @match        https://www.heroeswm.ru/inventory.php*

// @icon         https://www.google.com/s2/favicons?domain=heroeswm.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455297/omneHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/455297/omneHelper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (/pl_info/.test(location.href)) {
        let pid = 0;
        let elem = document.getElementsByClassName('sh_ResourcesItem_icon')[0];
        if (elem === undefined) {
            elem = document.getElementsByClassName('rs')[0];
        }
        elem.addEventListener("click", get_last, false);

        function get_last() {
            if (pid == 0) {
                let l = 0;
                let pers = Array.from(get_hwm("https://www.heroeswm.ru/bselect.php?all=1").matchAll(/pl_info.php\?id=([0-9]+)/g));
                for (let i = 0; i < pers.length; i++) {
                    l = Math.max(l, pers[i][1]);
                }
                let r = l + 63;
                while(pers_empty(r)) {
                    r *= 2;
                }
                while (r - l > 1) {
                    let m = l + Math.floor((r - l) / 2);
                    if (pers_empty(m)) {
                        l = m;
                    } else {
                        r = m;
                    }
                }
                var div = document.createElement("div");
                div.setAttribute("id", "list");
                div.style.position = "absolute";
                div.style.top = "95px";
                div.style.left = "10px";
                div.innerHTML = pers_data(l);
                document.body.appendChild(div);
                pid = l;
            } else {
                for (let i = 0; i < 10; i++) {
                    document.getElementById("list").innerHTML += pers_data(--pid);
                }
            }
        }
    }
    if (/forum_ban/.test(location.href)) {
        let elem = document.getElementsByClassName('sh_ResourcesItem_icon')[0];
        if (elem === undefined) {
            elem = document.getElementsByClassName('rs')[0];
        }
        elem.addEventListener("click", get_year, false);
        if (location.href.indexOf("y=1") > 0) {
            document.documentElement.querySelectorAll("input")[3].value = 365;
            document.documentElement.querySelector("select").value="1440";
            document.querySelector("form").submit();
        }
        function get_year() {
            document.documentElement.querySelectorAll("input")[3].value = 365;
            document.documentElement.querySelector("select").value="1440";
        }
    }

    if (/forum_messages/.test(location.href)) {
        let a = document.querySelector(".table3").querySelectorAll("a");
        for (let i = 0; i < a.length; i++) {
            if (a[i].innerHTML == "Забанить") {
                console.log(a[i].href);
                let pid = a[i].href.match(/pid=([0-9]+)/)[1]
                let ban = document.createElement('div');
                ban.innerHTML = "<a target='_blank' href = 'https://www.heroeswm.ru/forum_ban.php?y=1&mid=19096766&pid=" + pid + "'>Вбанить на год</a>";
                a[i].after(ban);
            }
        }
        document.querySelector("style").innerHTML += `
			table center a {
				margin-inline: 5px;
			}
			table center:first-of-type {
				margin-top: 10px;
			}

			.table3 > tbody {
				display: flex;
				flex-direction: column;
			}
			.table3 > tbody > tr:first-child {
				display: flex;
			}
			table.table3 th {
				display: block;
				width: 100%;
				text-align: center;
			}
			.table3 .c_darkers {
				display: none;
			}
			.message_footer {
				display: flex;
				justify-content: space-between;
			}
			.message_footer > td:first-child {
				display: flex;
				align-items: center;
				flex-grow: 1;
			}
			.message_footer font {
				font-size: 14px!important;
			}
			.message_footer > td > font {
				margin-left: 5px;
			}
			.table3 > tbody > tr:nth-child(2n-1) td {
				display: block;
				margin: auto;
			}`
    }
    if (/auction_buy_now/.test(location.href)) {
        location.href = document.querySelector('.wbwhite').querySelector("a").href;
    }
    if (/clan_info/.test(location.href)) {
        let id = [...document.querySelectorAll(".wb")[1].innerHTML.matchAll("pl_info.php.id=([0-9]+)")];
        let nick = [...document.querySelectorAll(".wb")[1].innerHTML.matchAll("class=\"pi\"\>([^<]+)")];
        let str = ""
        for (let i = 0; i < id.length; i++) {
            str = str + id[i][1] + "\t" + nick[i][1] + "\n";
        }
        console.log(str)
    }




    function pers_empty(id) {
        return (get_hwm("https://www.heroeswm.ru/pl_info.php?id=" + id).match(/Боевой уровень/) != null);
    }

    function pers_data(id) {
        let result = get_hwm("https://www.heroeswm.ru/pl_info.php?id=" + id);
        let data = "<a style = 'text-decoration:none' href = 'https://www.heroeswm.ru/pl_info.php?id=" + id + "'>" + result.match(/<b>.+?<\/b>/) + "</a><BR>";
        return data;
    }

    function get_hwm(url) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.send();
        return xhr.responseText;
    }
})();
// ==UserScript==
// @name         查看小黑屋是被谁封禁的
// @namespace    xmdhs
// @version      0.5.1
// @description  查看小黑屋是被谁封禁的。
// @author       xmdhs
// @match        https://*/forum.php?mod=misc&action=showdarkroom
// @match        http://*/forum.php?mod=misc&action=showdarkroom
// @downloadURL https://update.greasyfork.org/scripts/396815/%E6%9F%A5%E7%9C%8B%E5%B0%8F%E9%BB%91%E5%B1%8B%E6%98%AF%E8%A2%AB%E8%B0%81%E5%B0%81%E7%A6%81%E7%9A%84.user.js
// @updateURL https://update.greasyfork.org/scripts/396815/%E6%9F%A5%E7%9C%8B%E5%B0%8F%E9%BB%91%E5%B1%8B%E6%98%AF%E8%A2%AB%E8%B0%81%E5%B0%81%E7%A6%81%E7%9A%84.meta.js
// ==/UserScript==

const x = new Ajax('JSON');
x.getJSON("forum.php?mod=misc&action=showdarkroom&cid=99999999999", (s) => {
    const list = s.data;
    const td = document.querySelector("#darkroomtable > tbody > tr")

    const th = document.createElement("th")
    th.classList.add("xw1")
    th.style["width"] = "105px"
    th.innerText = "操作者"

    td.appendChild(th)

    document.querySelectorAll("#darkroomtable > tbody > tr[id^=darkroomuid]").forEach((d) => {
        if (!d.id) return
        const uid = d.id.replace("darkroomuid_", "")
        if (uid && uid != "") {
            const td = document.createElement("td")
            td.innerHTML = `<td><a href="home.php?mod=space&amp;uid=${list[uid].operatorid}" target="_blank">${list[uid].operator}</a></td>`
            d.appendChild(td)
        }
    })
}
)
if ($('darkroommore')) {
    $('darkroommore').onclick = function () {
        var obj = this;
        var cid = parseInt(obj.getAttribute('cid').valueOf());
        var url = 'forum.php?mod=misc&action=showdarkroom&cid=' + cid + '&t=' + parseInt((+new Date() / 1000) / (Math.random() * 1000));
        var table = $('darkroomtable');
        var tablerows = table.rows.length;
        var x = new Ajax('JSON');
        x.getJSON(url, function (s) {
            if (s && s.message) {
                if (s.message.dataexist == 1) {
                    obj.setAttribute('cid', s.message.cid);
                } else {
                    obj.style.display = 'none';
                }
                var list = s.data;
                for (i in list) {
                    if ($('darkroomuid_' + list[i].uid)) {
                        continue;
                    }
                    var newtr = table.insertRow(tablerows);
                    if (tablerows % 2 == 0) {
                        newtr.className = 'alt';
                    }
                    newtr.insertCell(0).innerHTML = '<a href="home.php?mod=space&amp;uid=' + list[i].uid + '" target="_blank">' + list[i].username + '</a>';
                    newtr.insertCell(1).innerHTML = list[i].action;
                    newtr.insertCell(2).innerHTML = list[i].groupexpiry;
                    newtr.insertCell(3).innerHTML = list[i].dateline;
                    newtr.insertCell(4).innerHTML = list[i].reason;
                    newtr.insertCell(5).innerHTML = '<a href="home.php?mod=space&amp;uid=' + list[i].operatorid + '" target="_blank">' + list[i].operator + '</a>';
                    tablerows++;
                }
            }
        });
    };
}



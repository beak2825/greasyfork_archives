// ==UserScript==
// @name         evil sdamgia
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @description  auto answers lol (in progress, workaem)
// @author       bazawew
// @match        http*://*.sdamgia.ru/test?id=*
// @icon         https://raw.githubusercontent.com/bazawew/evilsdamgia/main/image.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454190/evil%20sdamgia.user.js
// @updateURL https://update.greasyfork.org/scripts/454190/evil%20sdamgia.meta.js
// ==/UserScript==

//thx @Maxsior for sdamege hacks tho :3

var tasks = document.getElementsByClassName('nobreak');
for (var i = 0; i < tasks.length; i++) {
    var task = tasks[i].getElementsByClassName('prob_nums')[0].innerHTML

    var currtexth = tasks[i].querySelectorAll('[id^=texth]');
    if (currtexth.length != 0) {
        var taskid = currtexth[0].id.replace('texth', '')
        console.log("Номер " + task + " -- это " + taskid);
        tasks[i].getElementsByClassName('prob_nums')[0].innerHTML += "\nЗадание № " + taskid
    }

    var sysid = tasks[i].parentElement.id.replace('maindiv', '');
    console.log("Айди " + task + " -- это " + sysid);
    tasks[i].getElementsByClassName('prob_nums')[0].innerHTML += "\nID=" + sysid
}
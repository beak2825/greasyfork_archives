// ==UserScript==
// @name         CF notification
// @name:zh-CN   CF notification
// @namespace    https://github.com/platelett/script
// @version      0.2.2
// @description  Send a system notification when your friend solves a problem on codeforces.
// @description:zh-CN 看看是谁在卷题
// @author       platelet
// @match        https://codeforces.com/problemset/status?friends=on
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codeforces.com
// @license      MIT
// @source       https://github.com/platelett/script/blob/main/CF%20notification.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458314/CF%20notification.user.js
// @updateURL https://update.greasyfork.org/scripts/458314/CF%20notification.meta.js
// ==/UserScript==

// Open the page https://codeforces.com/problemset/status?friends=on script takes effect.

(function() {
    'use strict';
    onload = () => {
        const interval = 1000 * 12;
        var parser = new DOMParser();
        const query = async (url, path) => parser.parseFromString(await (await fetch(url)).text(), "text/html").querySelectorAll(path);
        Notification.requestPermission(() => {
            if(document.querySelector("#header > div.lang-chooser > div:nth-child(2) > a:nth-child(2)").textContent == "Register") {
                alert("You are not logged in and cannot receive notifications.");
                return;
            }
            var last = document.querySelector("#pageContent > div.datatable > div:nth-child(6) > table > tbody > tr > td.id-cell.dark.left > a").textContent;
            var running = new Set();
            var ID = setInterval(async () => {
                try {
                    var now, result = [];
                    await (async () => {
                        for(var page = 1; page <= 5; page++) {
                            var list = await query("https://codeforces.com/problemset/status/page/" + page + "?friends=on",
                                "#pageContent > div.datatable > div:nth-child(6) > table > tbody > tr:not(.first-row)");
                            if(!list.length) throw "Invalid page";
                            if(page == 1) now = list[0].children[0].textContent.trim();
                            for(var submission of list) {
                                var info = [];
                                for(var i of submission.children) {
                                    if(i.children[0]) i = i.children[0];
                                    info.push(i.textContent.trim());
                                }
                                if(info[0] <= last && (!running.size || info[0] < Math.min.apply(null, [...running]))) return;
                                var visited = info[0] <= last;
                                if(running.has(info[0])) running.delete(info[0]), visited = false;
                                if(visited) continue;
                                if(info[5] == "Accepted" || info[5] == "Happy New Year!" ||
                                info[5].startsWith("Pretests passed") || info[5].startsWith("Perfect result")) {
                                    var parts = info[3].split(" ");
                                    result.push({
                                        title: info[2] + " has solved " + parts[0],
                                        user: info[2],
                                        problem: submission.children[3].children[0].href,
                                        name: parts[0].slice(parts[0].match(/[A-Z]/).index) + ". " + parts.slice(2).join("")
                                    });
                                }
                                if(info[5] == "In queue" || info[5].startsWith("Running on test")) running.add(info[0]);
                            }
                        }
                        running.clear();
                    })();
                    last = now;
                    var all = [];
                    for(var i of result) all.push(new Promise(async resolve => {
                        var tmp = i;
                        for(var node of await query(tmp.problem, "span.tag-box")) {
                            var tag = node.textContent.trim();
                            if(tag[0] == '*') tmp.title += " (" + parseInt(tag.slice(1)) + ")";
                        }
                        tmp.title += ".", resolve();
                    }));
                    await Promise.all(all);
                    while(result.length) {
                        var i = result.pop();
                        if(!i.duplicate) new Notification(i.title, { body: i.name }).onclick
                            = () => window.open(i.problem, '_blank');
                    }
                } catch(err) {
                    new Notification("Error happened! Please check the console.");
                    console.log(err), clearInterval(ID);
                }
            }, interval);
        });
    }
})();
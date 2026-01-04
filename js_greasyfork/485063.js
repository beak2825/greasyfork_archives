// ==UserScript==
// @name         2f5OFT-hElpER
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  .
// @author       Me
// @match        https://i.sjtu.edu.cn/cjcx/cjcx_cxDgXsxmcj.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485063/2f5OFT-hElpER.user.js
// @updateURL https://update.greasyfork.org/scripts/485063/2f5OFT-hElpER.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
    const originOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (_, url) {
        if (url.includes("cjcx_cxXsKccjList.html")) {
            var gnmkdm = url.match(/gnmkdm=(\w+)/)[1];
            var su = url.match(/su=(\w+)/)[1];
            this.addEventListener("readystatechange", async function () {
                if (this.readyState === 4) {
                    const res = JSON.parse(this.responseText);
                    await res.items.forEach(async item => {
                        if (item.xmcj === "成绩查询未开放") {
                            var time = new Date().getTime();
                            var info = await fetch("https://i.sjtu.edu.cn/cjcx/cjcx_cxCjxqGjh.html?time=" + time + "&gnmkdm=" + gnmkdm + "&su=" + su, {
                                "headers": {
                                    "accept": "text/html, */*; q=0.01",
                                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
                                    "cache-control": "no-cache",
                                    "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
                                    "pragma": "no-cache",
                                    "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
                                    "sec-ch-ua-mobile": "?0",
                                    "sec-ch-ua-platform": "\"Windows\"",
                                    "sec-fetch-dest": "empty",
                                    "sec-fetch-mode": "cors",
                                    "sec-fetch-site": "same-origin",
                                    "x-requested-with": "XMLHttpRequest"
                                },
                                "referrer": "https://i.sjtu.edu.cn/cjcx/cjcx_cxDgXscj.html?gnmkdm=" + gnmkdm + "&layout=default&su=" + su,
                                "referrerPolicy": "strict-origin-when-cross-origin",
                                "body": "jxb_id=" + item.jxb_id + "&xnm=" + item.xnm + "&xqm=" + item.xqm + "&kcmc=" + item.kcmc,
                                "method": "POST",
                                "mode": "cors",
                                "credentials": "include"
                            });
                            var text = await info.text();
                            var reg = /<td valign="middle">【 (.*?) 】<\/td>\s*<td valign="middle">(.*?)%&nbsp;<\/td>\s*<td valign="middle">(.*?)&nbsp;<\/td>/g;
                            var match;
                            while (match = reg.exec(text)) {
                                if (item.xmblmc.toString().includes(match[1])) {
                                    var showCount = parseInt(res.showCount);
                                    var currentPage = parseInt(res.currentPage);
                                    var row = parseInt(item.row_id) - (currentPage - 1) * showCount;
                                    $("#tab2").find("#" + row.toString()).find("td").eq(8).text("成绩查询未开放（" + match[3] + "）");
                                }
                            }
                        }
                    });
                }
            });
        }
        originOpen.apply(this, arguments);
    };
})();
// ==UserScript==
// @name         国科大毕业论文PDF全文下载
// @version      0.01
// @description  打破国科大各院所之间的学术藩篱。
// @author       DawudCN
// @match        http://dpaper.las.ac.cn/Dpaper/detail/detailNew?*
// @icon         http://dpaper.las.ac.cn/Dpaper/static/theme/images/logo.png
// @grant        none
// @namespace https://greasyfork.org/users/826324
// @downloadURL https://update.greasyfork.org/scripts/434059/%E5%9B%BD%E7%A7%91%E5%A4%A7%E6%AF%95%E4%B8%9A%E8%AE%BA%E6%96%87PDF%E5%85%A8%E6%96%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/434059/%E5%9B%BD%E7%A7%91%E5%A4%A7%E6%AF%95%E4%B8%9A%E8%AE%BA%E6%96%87PDF%E5%85%A8%E6%96%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';
    setTimeout(function () {
        var crack = {
            "time": 1,
            "clock": null
        }
        var dom = document.querySelector("#fullText > a")
        dom.style = `
		background: #FFC107;
		padding: 5px;
		color: #fff;
		border-radius: 5px;`;
        dom.innerText = "开始处理..."
        crack.clock = setInterval(function () {
            if (crack.time < 3) {
                dom.innerText = ("正在处理..." + (crack.time / 3 * 100).toFixed(2) + "%")
            } else if (crack.time == 3) {
                eval(function (p, a, c, k, e, r) {
                    e = String;
                    if (!''.replace(/^/, String)) {
                        while (c--) r[c] = k[c] || c;
                        k = [function (e) {
                            return r[e]
                        }];
                        e = function () {
                            return '\\w+'
                        };
                        c = 1
                    };
                    while (c--) if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
                    return p
                }('0.1="2";', 3, 3, 'paperDetail|priv|111'.split('|'), 0, {}))
                dom.style = `
				background: #ff1100;
				padding: 5px;
				color: #fff;
				border-radius: 5px;`;
                dom.innerText = "【下载全文 PDF】"
            } else {
                clearInterval(crack.clock)
            }
            crack.time += 1
        }, 1000)
    }, 1000)
})();
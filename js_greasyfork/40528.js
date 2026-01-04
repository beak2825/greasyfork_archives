// ==UserScript==
// @name         BZBZ
// @version      1.0.0
// @description  https://github.com/billchenchina/BZBZ
// @author       Originally by billchenchina, Edited by ZZYSonny
// @match        *://www.lydsy.com/JudgeOnline/problem.php?id=*
// @connect      ruanx.pw
// @grant        GM_xmlhttpRequest
// @namespace    https://greasyfork.org/users/169007
// @downloadURL https://update.greasyfork.org/scripts/40528/BZBZ.user.js
// @updateURL https://update.greasyfork.org/scripts/40528/BZBZ.meta.js
// ==/UserScript==

ojLink = function(pid) {
    return pid
        .replace(/^Luogu([0-9]+)$/, "https://www.luogu.org/problemnew/show/P$1")
        .replace(/^Loj([0-9]+)$/, "https://loj.ac/problem/$1")
        .replace(/^Codevs([0-9]+)$/, "http://codevs.cn/problem/$1/")
        .replace(/^Cogs([0-9]+)$/,"http://cogs.pro:8080/cogs/problem/problem.php?pid=$1")
        .replace(/^Vijos([0-9]+)$/, "https://vijos.org/p/$1");
};

appendLink = function(url, title) {
    const ele = document.getElementsByTagName("h2");
    var link = document.createElement("a");
    link.href = url;
	link.text = title + "\n";
    ele[0].appendChild(link);
};

function add_link() {
    var problem_id_q0dsah6q4v2ex6oh4 = location.href.split("=")[1];

    GM_xmlhttpRequest({
        method: "GET",
        url: "https://ruanx.pw/bzojch/result.json",
        onload: function(res) {
            var text = res.responseText;
            var result = JSON.parse(text);

            for (let i in result) {
                if (result[i][0] == problem_id_q0dsah6q4v2ex6oh4) {
                    console.log(result[i]);

                    var res1 = result[i][4];
                    var res2 = result[i][6];

                    console.log(ojLink(res1));
                    console.log(ojLink(res2));
                    const ele = document.getElementsByTagName("h2");
                    ele[0].innerText += "\n其他OJ链接: ";
                    appendLink(ojLink(res1), res1);
                    appendLink(ojLink(res2), res2);
                }
            }
        }
    });
}
add_link();
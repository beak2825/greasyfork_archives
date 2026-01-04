// ==UserScript==
// @name         AtCoderDetailedRating
// @namespace    https://twitter.com/merom686
// @version      1.0
// @description  レーティングを細かく表示
// @author       merom686
// @match        https://atcoder.jp/users/*/history*
// @downloadURL https://update.greasyfork.org/scripts/459562/AtCoderDetailedRating.user.js
// @updateURL https://update.greasyfork.org/scripts/459562/AtCoderDetailedRating.meta.js
// ==/UserScript==

(function(){
    let ma = location.href.match(/^https:\/\/atcoder\.jp\/users\/(\w+)\/history(\?contestType=(\w+))?/);
    let type = 'algo';
    if (ma[3]) type = ma[3];
    let user = ma[1];

    const S = 724.4744301, R = 0.8271973364;
    const T = (1 - 0.9) / Math.sqrt(1 - 0.81);
    let F = (n) => {
        return T * Math.sqrt(0.81 - Math.pow(0.81, n + 1)) / (0.9 - Math.pow(0.9, n + 1));
    };
    let f = (n) => {
        return (F(n) - T) / (F(1) - T) * 1200;
    };

    let tbody = document.getElementsByTagName("tbody")[0];
    let trs = tbody.getElementsByTagName("tr");
    let n = trs.length;

    let q = [];
    let k = 0, s0 = 0, s1 = 0;

    for (let i = n - 1; i >= 0; i--){
        let tds = trs[i].getElementsByTagName("td");
        if (tds[4].innerText == "-") continue;

        let p = parseInt(tds[3].innerText);
        let r = 0;
        if (type == 'algo'){
            s0 += Math.pow(2.0, p / 800.0);
            s0 *= 0.9;
            s1 += 1;
            s1 *= 0.9;
            r = 800 * Math.log2(s0 / s1) - f(++k);
        } else {
            for (let j = 1; j <= 100; j++){
                q.push(p - S * Math.log(j));
            }
            q.sort((i0, i1) => i1 - i0);
            s0 = 0; s1 = 0;
            for (let j = 99; j >= 0; j--){
                s0 += q[j];
                s0 *= R;
                s1 += 1;
                s1 *= R;
            }
            r = s0 / s1;
        }
        if (r < 400) r = Math.exp((r - 400) / 400) * 400;
        tds[4].innerText = r.toFixed(3);
    }
})();
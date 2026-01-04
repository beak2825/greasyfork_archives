// ==UserScript==
// @name         AtCoderRGBGraph
// @namespace    https://twitter.com/merom686
// @version      1.0
// @description  AGC/ARC/ABCの指定したもののみでレーティングを計算
// @author       merom686
// @match        https://atcoder.jp/users/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/460292/AtCoderRGBGraph.user.js
// @updateURL https://update.greasyfork.org/scripts/460292/AtCoderRGBGraph.meta.js
// ==/UserScript==

(function(){
    if (typeof rating_history === 'undefined') return;
    let ma = location.href.match(/https:\/\/atcoder\.jp\/users\/(\w+)(\?contestType=(\w+))?/);
    if (ma[3] && ma[3] != 'algo') return;
    let user = ma[1];
    let rating_history_original = rating_history;
    let history_array;

    let ex = {"abl":1999, "acl1":2799, "aising2019":1999, "aising2020":1999, "apc001":9999, "caddi2018":2799, "caddi2018b":1199, "cf16-exhibition-final":9999, "cf16-final":9999, "cf16-final-open":9999, "cf17-final":9999, "cf17-final-open":9999, "code-festival-2016-quala":9999, "code-festival-2016-qualb":9999, "code-festival-2016-qualc":9999, "code-festival-2017-quala":9999, "code-festival-2017-qualb":9999, "code-festival-2017-qualc":9999, "ddcc2020-qual":2799, "diverta2019":2799, "diverta2019-2":2799, "dwacon5th-prelims":2799, "dwacon6th-prelims":2799, "exawizards2019":2799, "hhkb2020":1999, "hitachi2020":2799, "jrex2017":9999, "jsc2019-qual":2799, "jsc2021":1999, "keyence2019":2799, "keyence2020":2799, "keyence2021":2799, "m-solutions2019":2799, "m-solutions2020":1999, "mujin-pc-2017":9999, "nikkei2019-2-qual":2799, "nikkei2019-qual":2799, "nomura2020":2799, "panasonic2020":1999, "soundhound2018-summer-qual":1999, "sumitrust2019":1999, "tenka1-2017":2799, "tenka1-2017-beginner":1199, "tenka1-2018":2799, "tenka1-2018-beginner":1199, "tenka1-2019":2799, "tenka1-2019-beginner":1199, "tokiomarine2020":2799, "wtf19":9999, "yahoo-procon2019-qual":2799, "zone2021":1999 };
    let name = (i) => 'A' + 'GRB'[i] + 'C';

    const T = (1 - 0.9) / Math.sqrt(1 - 0.81);
    let F = (n) => T * Math.sqrt(0.81 - Math.pow(0.81, n + 1)) / (0.9 - Math.pow(0.9, n + 1));
    let f = (n) => (F(n) - T) / (F(1) - T) * 1200;

    let update = () => {
        const e = new CustomEvent('load');
        window.dispatchEvent(e);
    };

    let draw = () => {
        if (!history_array){
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://atcoder.jp/users/' + user + '/history/json?contestType=algo',
                onload: (response) => {
                    history_array = JSON.parse(response.responseText);
                    if (history_array) draw();
                }
            });
            return;
        }
        rating_history = [];
        let m = 0;
        for (let i = 0; i < 3; i++){
            if (document.getElementById(name(i)).checked) m ^= 1 << i;
        }
        let old = 0, s0 = 0, s1 = 0;
        let i0 = 0, i1 = 0;
        for (let o of history_array){
            if (!o.IsRated) continue;
            let t = o.ContestScreenName;
            let j = t.indexOf(".");
            if (j >= 0) t = t.substring(0, j);
            let v = 0;
            if (/^a[rgb]c\d{3}$/.test(t)){
                v = {"b":1999, "r":2799, "g":9999}[t[1]];
                if (t[1] == "b" && (t.slice(-3) | 0) < 126) v = 1199;
            } else {
                v = ex[t];
            }
            if (((m & 1) && v == 9999) || ((m & 2) && v == 2799) || ((m & 4) && v <= 1999)){
                s0 += Math.pow(2.0, o.Performance / 800.0);
                s0 *= 0.9;
                s1 += 1;
                s1 *= 0.9;
                let r = 800 * Math.log2(s0 / s1) - f(++i1);
                if (r < 400) r = Math.exp((r - 400) / 400) * 400;
                r = Math.round(r);
                let x = { ...rating_history_original[i0] };
                rating_history.push(x);
                x.NewRating = r;
                x.OldRating = old;
                old = r;
            }
            i0++;
        }
        if (rating_history.length == 0){
            let x = { ...rating_history_original[0] };
            rating_history.push(x);
            x.ContestName = '';
            x.EndTime = 0;
            x.NewRating = 0;
            x.OldRating = 0;
            x.Place = 0;
            x.StandingsUrl = '';
        }
        update();
    };

    let container = document.createElement('div');
    container.style = 'display: inline-block';
    for (let i = 0; i < 3; i++){
        let div = document.createElement('div');
        let id = name(i);

        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = true;
        checkbox.id = id;
        checkbox.addEventListener('change', draw);
        div.appendChild(checkbox);

        let label = document.createElement('label');
        label.htmlFor = id;
        label.innerText = id;
        div.appendChild(label);

        container.appendChild(div);
    }
    let a = document.getElementById('rating-graph-expand');
    a.parentNode.insertBefore(container, a.nextSibling);
})();
// ==UserScript==
// @name         AtCoderAnotherGraph
// @namespace    https://twitter.com/merom686
// @version      1.0
// @description  heuristic/algoの計算式でレーティンググラフを表示
// @author       merom686
// @match        https://atcoder.jp/users/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/455542/AtCoderAnotherGraph.user.js
// @updateURL https://update.greasyfork.org/scripts/455542/AtCoderAnotherGraph.meta.js
// ==/UserScript==

(function(){
    if (typeof rating_history === 'undefined') return;
    let rating_history_original = [...rating_history];
    let ma = location.href.match(/https:\/\/atcoder\.jp\/users\/(\w+)(\?contestType=(\w+))?/);
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
    let update = () => {
        const e = new CustomEvent('load');
        window.dispatchEvent(e);
    };

    let button = document.createElement('button');
    button.className = 'btn btn-default';
    button.innerText = 'another';
    button.onclick = () => {
        if ('another' in rating_history[0] || 'another' in rating_history_original[0]){
            let temp = rating_history;
            rating_history = rating_history_original;
            rating_history_original = temp;
            update();
            return;
        }
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://atcoder.jp/users/' + user + '/history/json?contestType=' + type,
            onload: function(response) {
                let n = rating_history.length;
                const history_array = JSON.parse(response.responseText);
                let p = [];
                for (let o of history_array){
                    if (o.IsRated) p.push(o.Performance);
                }
                let q = [];
                let old = 0, s0 = 0, s1 = 0;
                for (let i = 0; i < n; i++){
                    let r = 0;
                    if (type == 'algo'){
                        for (let j = 1; j <= 100; j++){
                            q.push(p[i] - S * Math.log(j));
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
                    } else {
                        //if (perf < 400) perf = Math.log(perf / 400) * 400 + 400;
                        s0 += Math.pow(2.0, p[i] / 800.0);
                        s0 *= 0.9;
                        s1 += 1;
                        s1 *= 0.9;
                        r = 800 * Math.log2(s0 / s1) - f(i + 1);
                    }
                    if (r < 400) r = Math.exp((r - 400) / 400) * 400;
                    rating_history[i] = { ...rating_history_original[i] };
                    rating_history[i].NewRating = Math.round(r);
                    rating_history[i].OldRating = old;
                    old = rating_history[i].NewRating;
                }
                rating_history[0].another = 1;
                update();
            }
        });
    };
    let a = document.getElementById('rating-graph-expand');
    a.parentNode.insertBefore(button, a.nextSibling);
})();
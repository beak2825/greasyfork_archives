// ==UserScript==
// @name         hiyoko月同接导出csv
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  如题
// @author       jがすdygk
// @match        https://hiyoko.sonoj.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401618/hiyoko%E6%9C%88%E5%90%8C%E6%8E%A5%E5%AF%BC%E5%87%BAcsv.user.js
// @updateURL https://update.greasyfork.org/scripts/401618/hiyoko%E6%9C%88%E5%90%8C%E6%8E%A5%E5%AF%BC%E5%87%BAcsv.meta.js
// ==/UserScript==

(function () {
    let mainn = '';
    document.querySelector('#root > div > div > div.jss2 > header > div > div.jss2').insertAdjacentHTML('afterbegin', "<button id='myButton'>下载本月油管同接</button>")
    document.getElementById("myButton").addEventListener("click", downloadcsv, false);
    function downloadcsv() {
        let dousetsu = [];
        let title = [];
        mainn = document.querySelector('.MuiButton-label').innerText;
        title.push("类型")
        title.push(mainn);
        title.push("标题");
        title.push("星期");
        title.push("同接");
        title.push("再生")
        dousetsu.push(title);
        Array.from(document.querySelectorAll('img[src="/img/youtubelogo24.png"]')).map(el => {
            let x = [];
            let y = el.parentNode.parentNode.children[2].children[1].innerText;
            if (!y.includes('動画') && !y.includes('ライブ配信中') && !y.includes('プレミア公開')) {
                x.push('配信')
                x.push(el.parentNode.parentNode.children[2].children[2].innerText.split(" ")[0]);
                x.push(el.parentNode.parentNode.children[2].children[0].innerText.split(" ")[0]);
                x.push(el.parentNode.parentNode.children[0].innerText.slice(-2,-1));
                x.push(y.replace(" ー", " 无记录").split(" ")[2]);
                x.push(el.parentNode.parentNode.children[2].children[2].children[1].innerText.replace("回再生",""));
                dousetsu.push(x)
            }
            else if(y.includes('プレミア公開') || y.includes('動画')){
                x.push('动画')
                x.push(el.parentNode.parentNode.children[2].children[2].innerText.split(" ")[0]);
                x.push(el.parentNode.parentNode.children[2].children[0].innerText.split(" ")[0]);
                x.push(el.parentNode.parentNode.children[0].innerText.slice(-2,-1));
                x.push('无记录');
                x.push(y.split("\n")[1].replace('再生',''));
                dousetsu.push(x)
            }
        })
        const csv = dousetsu.map(row => row.map(item => (typeof item === 'string' && item.indexOf(',') >= 0) ? `"${item}"` : String(item)).join(',')).join('\n');
        var universalBOM = "\uFEFF";
        const link = document.createElement('a');
        link.setAttribute('href', 'data:text/csv; charset=utf-8,' + encodeURIComponent(universalBOM + csv));
        link.setAttribute('download', mainn + '.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
})();
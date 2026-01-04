// ==UserScript==
// @name         E-Hentai/ExHentai Torrents History Tagger
// @namespace    pikashi@gmail.com
// @version      0.2.3
// @description  记录EXHT BT下载历史
// @author       pks
// @match        https://e-hentai.org/*
// @match        https://exhentai.org/*
// @exclude      https://exhentai.org/g/*
// @exclude      https://e-hentai.org/g/*
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://e-hentai.org/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/386714/E-HentaiExHentai%20Torrents%20History%20Tagger.user.js
// @updateURL https://update.greasyfork.org/scripts/386714/E-HentaiExHentai%20Torrents%20History%20Tagger.meta.js
// ==/UserScript==

let patterns = [

    // 以下为匹配规则列表，各自对应的下载历史单独保存互不干涉，除非name相同（name相同的规则将会合并）
    // regex：必须，为路径匹配正则表达式
    // priority：必须，数值越小优先级越高；取值范围为小于9999的正整数，不同条目的priority数值不能相同
    // quota：可选，默认值200，全局匹配默认值5000，可按自己需要修改;历史条目数量上限值；如果超出上限值的新的下载历史加入，会自动删除最旧（GID最老的）的下载历史；
    // checkDefault:可选，默认值false，仅在非默认规则中使用；如果设为true则此规则工作时也会检查全局匹配列表，且创建新下载时会向全局列表提交下载历史
    { regex: /\/tag\/tankoubon\b(\/\d+)?/, name: 'tankoubon', priority:1, quota: 300, checkDefault:true },
    { regex: /\bf_search=anthology\b/, name: 'anthology', priority:2 },
    { regex: /.*/, name: 'default', priority:9999 }// 此行为全局匹配，请勿修改priority值，如果只想使用全局匹配，请把上面的其他规则都删除

],

count = 200, // 保存上限默认值（不包括全局匹配）
checkDefault = false,
defaultQuota = 5000, // 全局历史条目上限单独设定

$ = jQuery
;

(function() {
    'use strict';

    var css = `
#tipEle {
padding:5px;
position: fixed;
right: 10px;
bottom: 10px;
z-index: 50;
background:
green;text-align:
left;font-size: 14px;
max-width: 320px;
}

#tipEle .highlight {
color:yellow;
}

#tipEle:hover {
opacity: 0.5;
}

.gl1t.downloaded {
opacity: 0.9;
border-radius: 5px;
position:relative;
}

.gl1t.downloaded > a > div::before {
content: "✔";
color: greenyellow;
font-size: 2.4rem;
display: inline-block;
position: absolute;
bottom: 18px;
left: 3px;
z-index: 50;
}
`,
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet){
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);

    // Your code here...
    $(function() {
        let mode = '',list = [];

        function createTip() {
            if (GM_getValue(mode + 'LastDownload')) {
                let tipEle = document.createElement('p');
                tipEle.innerHTML = `上次下载：<br>${GM_getValue(mode + 'LastDownload')}`;
                tipEle.id = 'tipEle';
                if (document.querySelector('#tipEle')) document.querySelector('#tipEle').remove();
                document.body.appendChild(tipEle);
            }
        }

        function getGID(url) {
            return url.match(/g\/(\d+)\//i)[1];
        }

        function getPath(url) {
            return new URL(url).pathname;
        }

        for (let pattern of patterns.sort((a,b)=>(a.priority - b.priority))) {
            if (pattern.regex.test(window.location.href)) {
                mode = pattern.name.toLowerCase();
                if (!!pattern.quota && pattern.name !== 'default') { count = pattern.quota; }
                if (!!pattern.checkDefault && pattern.name !== 'default') { checkDefault = true; }
                break;
            }
        }
        console.log('mode is ' + mode + ', quota limit is ' + count + ', checkDefault status is ' + checkDefault);


        if (mode !== '') {

            const historyVar = mode + 'LastDownloads';

            let last200Downloads = [];
            let defaultLastDownloads = [];
            if (checkDefault && mode !== 'default') {
                defaultLastDownloads = JSON.parse(GM_getValue('defaultLastDownloads'));
            }

            if (GM_getValue(historyVar)) {
                last200Downloads = JSON.parse(GM_getValue(historyVar));
            }

            $('.gl1t').each((_,e) => {
                let id = getGID($(e).find('a')[0].href);
                // console.log(id);
                for (const gid of last200Downloads) {
                    if (gid === id) {
                        // console.log(`find match ${gid}`)
                        $(e).addClass('downloaded');
                    }
                }
            });

            $('div.itg.gld').on('click', 'a.torrentLink', e => {
                // console.log(last200Downloads);

                let url = $(e.target).closest('.gl3t').find('a').first()[0].href;
                let gid = getGID(url);
                let path = getPath(url);
                let date = $(e.target).closest('.gl1t').find('.cs.ct3').next().text();
                let title = $(e.target).closest('.gl3t').find('a img')[0].title;

                let text = `标题：<span class="highlight">${title}</span><br>日期：<span class="highlight">${date}</span><br>URL：<span class="highlight">${url}</span>`;
                let dateRaw = new Date(date).valueOf();
                list.push({date: dateRaw, text: text});
                list.sort((a, b) => {
                    return b.date - a.date;
                });

                console.log('torrent downloading');

                // console.log('mode is ' + mode);
                // console.info(list);

                GM_setValue(mode + 'LastDownload', list[0].text);

                if (last200Downloads.indexOf(gid) === -1 || (defaultLastDownloads.indexOf(gid) === -1 && checkDefault)) {
                    if (last200Downloads.length >= count) last200Downloads.pop();
                    last200Downloads.unshift(gid);
                    GM_setValue(historyVar, JSON.stringify(last200Downloads.sort().reverse()));

                    if (checkDefault && mode !== 'default') {
                        if (defaultLastDownloads.length >= defaultQuota) defaultLastDownloads.pop();
                        defaultLastDownloads.unshift(gid);
                        GM_setValue('defaultLastDownloads', JSON.stringify(defaultLastDownloads.sort().reverse()));
                    }
                    $(e.target).closest('.gl1t').addClass('downloaded');
                }


                // createTip();

            });

            // createTip();
        }
    });
})();
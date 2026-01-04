// ==UserScript==
// @name         filterSuperfluousOnDMM
// @namespace    https://greasyfork.org/ja/users/289387-unagionunagi
// @version      1.5
// @description  DMM・FANZAの通販商品一覧からアウトレット、限定版、および BOD/DOD を除去
// @author       unagiOnUnagi
// @match        https://www.dmm.com/mono/*/list/*
// @match        https://www.dmm.com/mono/*/search/*
// @match        https://www.dmm.co.jp/mono/*/list/*
// @match        https://www.dmm.co.jp/mono/*/search/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPL-2.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/404378/filterSuperfluousOnDMM.user.js
// @updateURL https://update.greasyfork.org/scripts/404378/filterSuperfluousOnDMM.meta.js
// ==/UserScript==

function addStyleSheet() {
    // カスタムスタイルシートの作成
    let styleEl = document.createElement('style');
    styleEl.id = 'filtersuperfluousondmm-css';
    document.head.appendChild(styleEl);

    let styleSheet = styleEl.sheet;

    //  .superfluous {display: none} を追加
    styleSheet.insertRule('.superfluous {}', 0);

    // 全作品フィルター時のラベル点滅ルール
    styleSheet.insertRule(
        '.filtersuperfluousondmm-blink { animation: flash 0.6s linear 3; }', 1);
    styleSheet.insertRule(
        '@keyframes flash { 0%,100% { opacity: 1; } 50% { opacity: 0; } }', 2);
}

function reconfigureEvenOdds(isFiltered) {
    let selector = isFiltered ? '.unsuperfluous' : '.superfluous,.unsuperfluous';
    for (let [i, tr] of document.querySelectorAll(selector).entries()) {
        let [correct, incorrect] = (i % 2) ? ['odd', 'even'] : ['even', 'odd'];
        tr.classList.replace(incorrect, correct);
    }
}

function setDisplayProperty(isChecked) {
    // display プロパティ値を決定
    let [value, priority] = isChecked ? ['none', 'important']
        : document.URL.includes('/view=text/') ? ['table-row', '']
        : ['list-item', ''];

    let rule = document.getElementById('filtersuperfluousondmm-css').sheet.rules[0];
    rule.style.setProperty('display', value, priority);

    if (value == 'table-row') {
        reconfigureEvenOdds(isChecked);
    }
}

function toggleFilter(ev) {
    // チェックボックスの状態を見て表示・非表示を切り換え
    let isChecked = ev.target.checked;
    setDisplayProperty(isChecked);
    GM_setValue('checked', isChecked);
}

function filterSuperflouous(lineup, selItems, selAnchor, getTitle) {
    // アウトレット、限定版、BOD/DOD を非表示に

    // ページヘッダー
    let lastSpan = document.querySelector('.list-boxseparate div.list-unit');
    if (!lastSpan) {
        console.log('Breadcrumb list not found');
        return;
    }

    // 対象文字列正規表現
    const pattern = [/【(特選)?アウトレット】/,
                     /【(DMM|FANZA|数量)限定】/,
                     /（[BD]OD）$/,
                     /アウトレット(BD)?】$/,
                     /【ベストヒッツ】/,
                     /【プレイバック】/];

    const items = lineup.querySelectorAll(selItems);
    const itemsLength = items.length;

    let nof = 0;
    for (let item of items) {
        let anchor = item.querySelector(selAnchor);
        let title = getTitle(anchor);
        let cid = anchor.href.match(/\/cid=(\w+)/)[1];

        // パターンにマッチしたらクラスを追加
        if (pattern.some(re => re.test(title))
           || cid.match(/[bd]od$/)) {
            item.classList.add('superfluous');
            nof++;
        } else {
            item.classList.add('unsuperfluous');
        }
    }

    // フィルターチェックボックスの追加
    let filterSpan = document.createElement('span');
    filterSpan.title = `アウトレット、限定版、BOD/DOD を非表示にします (このページに ${nof} 個)`;
    filterSpan.style.cssText = 'margin-left: 10px; font-size: 10px;';
    lastSpan.parentNode.appendChild(filterSpan);

    let filterCb = document.createElement('input');
    filterCb.type = 'checkbox';
    filterCb.id = 'filtersuperfluousondmm-cb';
    filterCb.name = 'filtersuperfluousondmm-cb';
    filterCb.style.cssText = 'vertical-align: middle; transform: scale(0.8); appearance: auto;';
    filterSpan.appendChild(filterCb);

    let filterLabel = document.createElement('label');
    filterLabel.htmlFor = 'filtersuperfluousondmm-cb';
    filterSpan.appendChild(filterLabel);

    // ページ内全作品が該当したとき
    if (nof == itemsLength) {
        nof = '全作品が該当';
        filterLabel.classList.add('filtersuperfluousondmm-blink');
    }

    filterLabel.innerText = ` フィルター (${nof})`;

    filterCb.checked = GM_getValue('checked', true);
    filterCb.addEventListener('change', toggleFilter);

}

(function() {
    // カスタムスタイルシートの追加
    addStyleSheet();
    setDisplayProperty(GM_getValue('checked', true));

    let lineup = document.getElementById('list');
    if (lineup) {
        // 画像形式表示
        filterSuperflouous(
            lineup, 'li', 'div p.tmb a',
            (item) => item.querySelector('span img').getAttribute('alt'));
    } else if ((lineup = document.querySelector('table[summary=商品一覧] tbody'))) {
        // テキスト形式表示
        filterSuperflouous(
            lineup, 'tr:has(td)', 'td p.ttl a',
            (item) => item.innerText.trim());
        reconfigureEvenOdds(GM_getValue('checked', true));
    }

})();

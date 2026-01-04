// ==UserScript==
// @name         ヘルプリンク変更
// @namespace    http://tampermonkey.net/
// @version      1.17
// @description  ヘルプリンクの更新と仮登録ページにヘルプを追加
// @license      MIT
// @match        *://plus-nao.com/forests/*/mainedit/*
// @match        *://plus-nao.com/forests/*/registered_mainedit/*
// @match        *://plus-nao.com/forests/*/interim_registration
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498662/%E3%83%98%E3%83%AB%E3%83%97%E3%83%AA%E3%83%B3%E3%82%AF%E5%A4%89%E6%9B%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/498662/%E3%83%98%E3%83%AB%E3%83%97%E3%83%AA%E3%83%B3%E3%82%AF%E5%A4%89%E6%9B%B4.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const linksToReplace = [
        {
            oldLink: "http://tk2-217-18298.vs.sakura.ne.jp/boards/5/topics/765",
            newLink: "http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E7%99%BA%E9%80%81%E6%96%B9%E6%B3%95%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6"
        },
        {
            oldLink: "http://tk2-217-18298.vs.sakura.ne.jp/boards/5/topics/45",
            newLink: "http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E7%B4%A0%E6%9D%90%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6"
        },
        {
            oldLink: "http://tk2-217-18298.vs.sakura.ne.jp/boards/5/topics/89",
            newLink: "http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E4%BD%9C%E6%88%90%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6"
        }
    ];

    const anchors = document.getElementsByTagName('a');

    for (let i = 0; i < anchors.length; i++) {
        for (let j = 0; j < linksToReplace.length; j++) {
            if (anchors[i].href === linksToReplace[j].oldLink) {
                anchors[i].href = linksToReplace[j].newLink;
            }
        }
    }

    function createHelpLink(url, text) {
        const container = document.createElement('span');
        container.style.display = 'inline-flex';
        container.style.alignItems = 'center';

        const openingText = document.createTextNode('(=> ');
        const closingText = document.createTextNode(' )');

        const helpLink = document.createElement('a');
        helpLink.href = url;
        helpLink.textContent = text;
        helpLink.target = '_blank';

        container.appendChild(openingText);
        container.appendChild(helpLink);
        container.appendChild(closingText);

        return container;
    }

    if (window.location.href.includes('interim_registration')) {
        const productMasterCodeElement = document.evaluate(
            "//h4[text()='商品マスターコード']",
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (productMasterCodeElement) {
            const helpContainer = createHelpLink(
                'http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E5%95%86%E5%93%81%E3%82%B3%E3%83%BC%E3%83%89%E4%B8%80%E8%A6%A7',
                '商品コード一覧'
            );
            productMasterCodeElement.appendChild(helpContainer);
        }
    }

    const table = document.querySelector('table.hontoroku');
    if (table) {
        const targetCell = document.evaluate(
            '//table[@class="hontoroku"]//th[@width="20%" and @scope="row" and contains(., "仕入れ原価(元")]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (targetCell) {
            const helpContainer = createHelpLink(
                'http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E4%BB%95%E5%85%A5%E3%82%8C%E4%BE%A1%E6%A0%BC%E3%83%98%E3%83%AB%E3%83%97',
                'ヘルプ'
            );
            targetCell.appendChild(helpContainer);
        }
    }
})();

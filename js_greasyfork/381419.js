// ==UserScript==
// @name         popupTitleOverAnchorsOnDMM
// @namespace    https://greasyfork.org/ja/users/289387-unagionunagi
// @description  DMM・FANZAで商品(など)のリンクに(だいたいの)フルタイトルをポップアップ
// @author       unagiOnUnagi
// @match        *://*.dmm.co.jp/*
// @match        *://*.dmm.com/*
// @grant        none
// @license      GPL-2.0-or-later
// @version      1.0.3
// @downloadURL https://update.greasyfork.org/scripts/381419/popupTitleOverAnchorsOnDMM.user.js
// @updateURL https://update.greasyfork.org/scripts/381419/popupTitleOverAnchorsOnDMM.meta.js
// ==/UserScript==

function logger(target) {
    for (const child of target.childNodes) {
        const iText = child.innerText;
        if (iText) {
            console.log(child);
            console.log(iText);
        }
        logger(child);
    }
}

function getTrimText(node) {
    return node.innerText.trim().replace(/\s+/g, ' ');
}

function xpathEval(xpath, cxtNode = document.body) {
    return document.evaluate(
        xpath,
        cxtNode,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
    );
}

function getTitle(anchor) {
    // タイトルの取得
    // alt がなかったら a タグの onclick を見てみる
    // onclick もダメだったら a タグ内のタイトル文字列をそのまま
    //  DMM 動画:
    //        VR top: altなし、span(title), span(price)
    //        Idol top: altなし、span(title), span(price)
    //        IdolCh top: altなし、a直下img><br>title
    //      見放題ch top: altなし、a直下
    let title = anchor.querySelector('img').alt;
    if (title) return title;

    const nameNode = anchor.querySelector(
        '.mainListLinkWork__txt,.responsive-name,.c-product-card__ttl,' +
            '.bx-title,.productCard-title,.title1O8Dg'
    );
    if (nameNode) {
        if ((title = getTrimText(nameNode))) return title;
    }

    for (let c of anchor.childNodes) {
        if (c.nodeName == '#text') {
            if ((title = c.nodeValue.trim())) return title;
        }
    }

    for (let s of anchor.getElementsByTagName('span')) {
        const txt = getTrimText(s);
        if (txt) {
            title = txt;
            break;
        }
    }
    if (!title || title == 't') {
        if ((title = getTrimText(anchor))) return title;
    }
    return title;
}

function addTitleAttrAll(nodes) {
    // a タグに子要素の img の alt から取ってきたタイトルを title 属性として追加
    // ランキングのところは別
    const length = nodes.length || nodes.snapshotLength;
    let getItem = nodes.item || nodes.snapshotItem;
    getItem = getItem.bind(nodes);

    for (let i = 0; i < length; i++) {
        const anchor = getItem(i);
        const title = getTitle(anchor);
        title && (anchor.title = title);
    }
}

function addTitleAttr2Rankings(target) {
    // ランキング内商品 anchorに title= 追加
    // DMM DVD通販 IdolTop: altがt、タイトルがa直下 (非固定spanのtail)
    // FANZA 動画 ビデオtop ranking[1:]: altなし、span(rank) a直下 title br latest
    let prefix = '.';
    if (!target) {
        prefix = './/div[@id="side-rank-tab"]';
        target = document.body;
    }
    const ranking = xpathEval(
        prefix + '//li[div[a[not(@title) or @title=""]]]',
        target
    );
    const rankingLength = ranking.snapshotLength;
    for (let i = 0; i < rankingLength; i++) {
        let li = ranking.snapshotItem(i);
        let alt = li.getElementsByTagName('img')[0].alt;
        if (!alt || alt == 't') alt = getTrimText(li);
        if (alt) {
            for (let textEl of li.querySelectorAll('div > a')) {
                textEl.title = alt;
            }
        } else {
            console.log(`Could not get title on ranking: ${li}`);
        }
    }
}

function addTitlesOnDMMTV(targetNodes) {
    // DMM TV、FANZA TVポップアップ
    for (const target of targetNodes) {
        for (const child of target.childNodes) {
            let objNode, title;
            if (child.nodeType == Node.TEXT_NODE) {
                // FANZA TV ページ上のタイトル
                objNode = target;
                title = child.nodeValue;
            } else {
                // DMM/FANZA TV のポップアップ
                objNode = child;
                title = child.innerText;
            }
            // console.log(objNode);
            if (!objNode.title) {
                objNode.title = title;
            }
        }
    }
}

function addTitleFromInnerText(targetNodes) {
    for (let target of targetNodes) {
        const title = getTrimText(target);
        if (title) target.title = getTrimText(target);
    }
}

(function () {
    // とりあえず title のない画像つきリンクに一律処理
    addTitleAttrAll(xpathEval('.//a[.//img and not(@title)]', document.body));

    // カテゴリトップページランキング
    // 最初に一発やっとかないとあとで更新されないページがある
    addTitleAttr2Rankings();

    // ページの動的変更を監視
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            const target = mutation.target;
            // logger(target);

            addTitleAttrAll(xpathEval('.//a[.//img and not(@title)]', target));
            if (target.id.match(/(ranking|s-tb-sect)/)) {
                addTitleAttr2Rankings(target);
            }

            // .line-clamp-1  DMM TV ポップアップのタイトル
            // .line-clamp-2  DMM TV ポップアップの概要
            // .eu14kkw0      FANZA TV ポップアップのタイトル
            // .eu14kkw2      FANZA TV ポッポアップの概要
            // .mt-2          DMM/FANZA TV ページ上のタイトル
            // 対象ノードが変わるので :not() はここでは使わない
            let dmmTV = target.querySelectorAll(
                '.line-clamp-1,.line-clamp-2,' +
                    '.eu14kkw0,.eu14kkw2,' +
                    '.mt-2'
            );
            if (dmmTV.length > 0) {
                addTitlesOnDMMTV(dmmTV);
            }
            // .e1vo3wos4     DMM/FANZA TV ランキングページのタイトル
            // .e18obyht4     DMM/FANZA TV マイアイテムページのタイトル
            dmmTV = document.body.querySelectorAll(
                'h1.e1vo3wos4:not([title]),.e18obyht4 h1:not([title])'
            );
            if (dmmTV.length > 0) {
                addTitleFromInnerText(dmmTV);
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();

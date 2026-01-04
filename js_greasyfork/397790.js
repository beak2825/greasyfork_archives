// ==UserScript==
// @name         Qiita Sushi
// @namespace    https://greasyfork.org/users/432749
// @description  QiitaのLGTMアイコンをSushiアイコンに変更する
// @author       fukuchan
// @match        https://qiita.com/*
// @version 0.0.1.20200325234213
// @downloadURL https://update.greasyfork.org/scripts/397790/Qiita%20Sushi.user.js
// @updateURL https://update.greasyfork.org/scripts/397790/Qiita%20Sushi.meta.js
// ==/UserScript==

/*
 * OpenSushi
 * (c) remin
 */
const viewBox = '0 0 64 64';
const innerHTML = '<defs><style>.a{fill:#eee;}.b{fill:#bdbdbd;}.c{fill:#d32f2f;}.d{fill:#b71c1c;}</style></defs><title>Sushi</title><path class="a" d="M53.94,44.75l-3.07.77a16,16,0,0,1-12.76-2.21l-14.55-9.7A8,8,0,0,1,20,27V23a8,8,0,0,1,6.06-7.76l3.07-.77a16,16,0,0,1,12.76,2.21l14.55,9.7A8,8,0,0,1,60,33v4A8,8,0,0,1,53.94,44.75Z"/><path class="b" d="M60,33a8,8,0,0,1-6.06,7.73l-3.07.77A16,16,0,0,1,46,42V41a8,8,0,0,0-3.56-6.66l-14.55-9.7A16,16,0,0,0,20.07,22,8.08,8.08,0,0,0,20,23h0v4a8,8,0,0,0,3.56,6.66l14.55,9.7c.42.28.85.53,1.29.76l.29.15c.43.22.87.42,1.31.6l.25.09q.59.23,1.2.41l.29.09c.45.12.9.23,1.36.31l.37.06c.43.07.86.12,1.29.16l.17,0h0a16,16,0,0,0,4.93-.44l3.07-.77A8,8,0,0,0,60,37V33Z"/><path class="a" d="M37.94,54.75l-3.07.77a16,16,0,0,1-12.76-2.21L7.56,43.61A8,8,0,0,1,4,37V33a8,8,0,0,1,6.06-7.76l3.07-.77a16,16,0,0,1,12.76,2.21l14.55,9.7A8,8,0,0,1,44,43v4A8,8,0,0,1,37.94,54.75Z"/><path class="b" d="M37.94,50.75l-3.07.77a16,16,0,0,1-12.76-2.21L7.56,39.61A8,8,0,0,1,4,33v4a8,8,0,0,0,3.56,6.66l14.55,9.7a16,16,0,0,0,12.76,2.21l3.07-.77A8,8,0,0,0,44,47V43A8,8,0,0,1,37.94,50.75Z"/><path class="c" d="M16,17.76v3.42a1,1,0,0,0,.81,1c11.44,2.27,21,12,28.79,19.74a1,1,0,0,0,.95.26l14.69-3.67a1,1,0,0,0,.76-1V32.39a1.2,1.2,0,0,0-.29-.7C56,24,44,15.07,32.22,13a1,1,0,0,0-.43,0l-15,3.76A1,1,0,0,0,16,17.76Z"/><path class="d" d="M61.24,33.36,46.55,37a1,1,0,0,1-.95-.26C37.85,29,28.26,20.59,16.81,18.32a1,1,0,0,1-.78-.77,1,1,0,0,0,0,.21v3.42a1,1,0,0,0,.81,1c11.44,2.27,21,12,28.79,19.74a1,1,0,0,0,.95.26l14.69-3.67a1,1,0,0,0,.76-1V32.39h0A1,1,0,0,1,61.24,33.36Z"/><path class="c" d="M2,26.58V30a1,1,0,0,0,.81,1c11.44,2.27,21,13,28.79,20.74a1,1,0,0,0,.95.26L47.24,48.3a1,1,0,0,0,.76-1V42.22a1,1,0,0,0-.29-.7C39.81,33.61,30,23.9,18.22,21.84a1,1,0,0,0-.43,0l-15,3.76A1,1,0,0,0,2,26.58Z"/><path class="d" d="M47.24,43.19,32.55,46.86a1,1,0,0,1-.95-.26C23.85,38.86,14.26,29.41,2.81,27.15A1,1,0,0,1,2,26.37a1,1,0,0,0,0,.21V30a1,1,0,0,0,.81,1c11.44,2.27,21,13,28.79,20.74a1,1,0,0,0,.95.26L47.24,48.3a1,1,0,0,0,.76-1V42.22h0A1,1,0,0,1,47.24,43.19Z"/>';

// SVG要素の中身をSushiに変更するメソッド
const replaceSvg = svg => {
    svg.setAttribute('viewBox', viewBox);
    svg.innerHTML = innerHTML;
};

// SVG要素やテキストのLGTMを発見し、全てSushiに変更するメソッド
const sushinize = node => {
    // LGTMのSVG要素をそれぞれSushiに変更し、要素の変更を監視する
    const images = node.querySelectorAll('*[class*="like"] svg:not([data-sushinized]), .ItemLink__status svg:not([data-sushinized]), .ms-ItemList_counts svg:not([data-sushinized]), svg[class*="Lgtm"]:not([data-sushinized])');
    images.forEach(image => {
        // Sushiに変更する
        replaceSvg(image);

        // 属性の変更を監視
        new MutationObserver((records, observer) => {
            // 属性変更時に発動するメソッドの中で属性を変更し無限再帰に陥るので一旦observeを停止する
            observer.disconnect();

            // Sushiに再変更する・Sushiを1回転させる
            replaceSvg(records[0].target);
            records[0].target.classList.add("sushi-go-round");

            // observeを再開
            observer.observe(records[0].target, {attributes: true});
        }).observe(image, {attributes: true});

        // 何重にも監視するのを防止するため、data-sushinized属性を追加しておく
        image.dataset.sushinized = "1";
    });

    // 文字列のLGTMをSushiに置換する
    const texts = node.querySelectorAll('.userPopularItems_likeUnit, .notification_actionWrapper span.bold:last-of-type, li[role="presentation"] a[href*="like"], .ms-ItemHeader_likedCount, .op-CounterItem_name, *[class*="Label"], .msg-Item_body, *[class*="UserAnalyzeResult__TagStatsTitle"], a.st-Dropdown_item[href*="lgtm"], a.st-Dropdown_item[href*="like"]');
    texts.forEach(text => {
        text.childNodes.forEach(child => {
            if (child.nodeType === Node.TEXT_NODE) {
                child.textContent = child.textContent.replace("LGTM", "Sushi");
            }
        });
    });
};

// 現在読み込まれているdocument中のLGTMを全てSushiに置換
sushinize(document);

// コメントなど遅延読み込みされる動的な要素中のLGTMを読み込まれると同時に全てSushiに置換
const dynamicNodes = document.querySelectorAll('#comments, *[class*="List_view"], div[data-hyperapp-app="Milestones"], div[id*="Snackbar"], div[class*="UserMain__Content"], div[class*="UserAnalyzeResult"]');
dynamicNodes.forEach(node => {
    new MutationObserver((records, observer) => {
        observer.disconnect();
        sushinize(node);
        observer.observe(node, {childList: true});
    }).observe(node, {childList: true});
});

// 回転SushiのCSSアニメーションを定義
const style = document.createElement('style');
style.innerText = '.liked svg.sushi-go-round, svg.sushi-go-round[color="#fff"] { animation: sushi-go-round 1s ease; } @keyframes sushi-go-round { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
document.head.append(style);
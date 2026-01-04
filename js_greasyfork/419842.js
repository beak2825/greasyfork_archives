// ==UserScript==
// @name                swf2js auto-apply script (Flash to HTML5)
// @name:ja             swf2js 自動適用スクリプト (Flash to HTML5)
// @name:zh-CN          swf2js 自动应用脚本 (Flash to HTML5)
// @name:zh-TW          swf2js 自動應用腳本 (Flash to HTML5)
// @description         Enjoy Flash animations and games safely with your modern browser! This UserScript file finds an embedded Flash .swf file and uses swf2js to convert it to HTML5 and display it in the browser. The success or failure of the conversion depends on the swf2js library.
// @description:ja      最新のブラウザーで、安全に Flash アニメーション・ゲームを楽しみましょう！ この UserScript ファイルは、 Flash の .swf ファイルの埋め込みを見つけたら、 swf2js を使ってそれを HTML5 に変換し、ブラウザ上で表示させます。 変換の成否は、 swf2js ライブラリーに依存します。
// @description:zh-CN   使用现代浏览器安全地享受 Flash 动画和游戏！ 此 UserScript 文件查找嵌入式 Flash .swf 文件，并使用 swf2js 将其转换为 HTML5 并在浏览器中显示。 转换的成功或失败取决于 swf2js 库。
// @description:zh-TW   使用現代瀏覽器安全地享受 Flash 動畫和遊戲！ 此 UserScript 文件查找嵌入式 Flash .swf 文件，並使用 swf2js 將其轉換為 HTML5 並在瀏覽器中顯示。 轉換的成功或失敗取決於 swf2js 庫。
// @author              advanceboy
// @version             1.4
// @include             *
// @grant               none
// @namespace https://greasyfork.org/users/724967
// @downloadURL https://update.greasyfork.org/scripts/419842/swf2js%20auto-apply%20script%20%28Flash%20to%20HTML5%29.user.js
// @updateURL https://update.greasyfork.org/scripts/419842/swf2js%20auto-apply%20script%20%28Flash%20to%20HTML5%29.meta.js
// ==/UserScript==
(() => {
    'use strict';
    let counter = 0;
    // reverse this to process nested elements from the inside.
    const loaderCodes = [...document.querySelectorAll('embed[type="application/x-shockwave-flash"][src$=".swf"], object[type="application/x-shockwave-flash"][data$=".swf"]')].reverse().map((elm) => {
        const { width, height } = elm;
        const src = elm.tagName === "OBJECT" ? elm.data : elm.src;
        const widthStyle = !width ? '' : `width:${width}${(Number(width) != NaN ? 'px' : '')}`;
        const heightStyle = !height ? '' : `height:${height}${(Number(height) != NaN ? 'px' : '')}`;
        const containerId = `swf2js_container_id_${++counter}`;
        const container = document.createElement('div');
        container.id = containerId;
        container.style = `display:inline-block;${widthStyle};${heightStyle};`;
        elm.parentNode.insertBefore(container, elm);
        elm.parentNode.removeChild(elm);
        return `((containerId) => { if (document.getElementById(containerId)) { window.swf2js.load('${src.replace(/(?=\\|')/g, '\\')}', { tagId: containerId }); }; })('${containerId}');`;
    });
    if (loaderCodes.length !== 0) {
        const swf2jsLoadedCallback = () => {
            // inject the code to run the conversion with swf2js
            const s = document.createElement('script');
            s.type = 'text/javascript';
            s.innerHTML = loaderCodes.reverse().join(' ');
            document.body.appendChild(s);
        }
        if (!window.swf2js) {
            // execute swf2js on browser scope
            const swf2jsScriptElm = document.createElement('script');
            swf2jsScriptElm.type = 'text/javascript';
            swf2jsScriptElm.src = 'https://cdn.jsdelivr.net/gh/swf2js/swf2js@d9ec7ebe4a886d5337417a595caba49effdea5dd/swf2js.js';
            swf2jsScriptElm.onload = swf2jsLoadedCallback;
            document.body.appendChild(swf2jsScriptElm);
        } else {
            window.setTimeout(swf2jsLoadedCallback, 1);
        }
    }
})();

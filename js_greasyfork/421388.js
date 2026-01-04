// ==UserScript==
// @name         自动展开全文
// @namespace 	 wangji
// @version      0.0.4
// @description  支持新浪看点、百度经验、百度知道。功能描述：很多网站故意隐藏一些内容，用“在APP打开”这样的按钮来遮挡后面的内容，你总得小心翼翼的避开这些陷阱，避免点到这些按钮，否则会直接进入APK的下载页面🤣。这个脚本用来帮助用户直接在网页上展开这些内容😊
// @author       wangji@sgidi.com
// @include      *://k.sina.cn/article*
// @include      *://jingyan.baidu.com/article*
// @include      *://zhidao.baidu.com/question*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421388/%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/421388/%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==





(function () {
    kandian();
    baidujingyan();
    baiduzhidao();
})();

/** 新浪看点 */
function kandian() {
    const url = window.location.href;
    if (!/k.sina.cn\/article/.test(url)) return;
    function removeAPKDownloadButton() {
        const section = document.querySelector('.z_c1')
        if (!section) return false;
        section.setAttribute("style", "height: auto;overflow: visible;");
        document.querySelector('.look_more')?.remove();
        return true;
    }
    const observer = new MutationObserver(function () {
        const ok = removeAPKDownloadButton();
        if (ok) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
}
/** 百度经验 */
function baidujingyan() {
    const url = window.location.href;
    if (!/jingyan.baidu.com\/article/.test(url)) return;
    function removeSeeMoreButton() {
        const section = document.querySelector('.exp-content-container');
        if (!section) return false;
        section.setAttribute("style", "max-height: fit-content;overflow: visible;");
        document.querySelector('.read-whole-mask')?.remove();
        return true;
    }
    const observer = new MutationObserver(function () {
        const ok = removeSeeMoreButton();
        if (ok) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

/** 百度经验 */
function baiduzhidao() {
    const url = window.location.href;
    if (!/zhidao.baidu.com\/question/.test(url)) return;
    function removeSeeMoreButton() {
        const section = document.querySelector('.best-text');
        if (!section) return false;
        section.removeAttribute('style')
        document.querySelector('.wgt-best-mask')?.remove();
        return true;
    }
    const observer = new MutationObserver(function () {
        const ok = removeSeeMoreButton();
        if (ok) observer.disconnect();
    });
    observer.observe(document.querySelector('.best-text'), { attributeFilter: ['style'], attributes: true });
}
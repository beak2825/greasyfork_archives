// ==UserScript==
// @name:ko           Hitomi 언어 설정
// @name              Hitomi Language Settings
// @name:ru           Hitomi Настройка языка
// @name:ja           Hitomi言語設定
// @name:zh-TW        Hitomi語言設置
// @name:zh-CN        Hitomi语言设置

// @description:ko    모든 언어 페이지를 특정 언어 결과 페이지로 변경합니다.
// @description       Change all language page to specific language result page.
// @description:ru    Измените все языковые страницы на страницы результатов на определенном языке.
// @description:ja    すべての言語ページを特定の言語結果ページに変更します。
// @description:zh-TW 將所有語言頁面更改爲特定語言結果頁面。
// @description:zh-CN 将所有语言页面更改为特定语言结果页面。

// @namespace         https://ndaesik.tistory.com/
// @version           2023.05.01.05.26
// @author            ndaesik
// @icon              https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://hitomi.la
// @match             https://*.la/*

// @grant             GM.getValue
// @grant             GM.setValue
// @grant             GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/465211/Hitomi%20Language%20Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/465211/Hitomi%20Language%20Settings.meta.js
// ==/UserScript==
if (window.location.hostname === 'hitomi.la') {
(async () => {
(await GM.getValue('custom') == undefined) ? GM.setValue('custom', '') : await GM.getValue('custom')
let cst = (await GM.getValue('custom') || '').toLowerCase()
  , set = _ => {GM.setValue('custom', window.prompt('Type your language',)); window.location.reload()}
  , nav = {id:'indonesian',ca:'catalan',cs:'czech',da:'danish',de:'german',et:'estonian',en:'english',es:'spanish',eo:'esperanto',fr:'french',
           hi:'hindi',it:'italian',hu:'hungarian',nl:'dutch',nb:'norwegian',pl:'polish',pt:'portuguese',ro:'romanian',sq:'albanian',sk:'slovak',
           sr:'serbian',fi:'finnish',sv:'swedish',tl:'tagalog',vi:'vietnamese',tr:'turkish',el:'greek',bg:'bulgarian',mn:'mongolian',ru:'russian',
           uk:'ukrainian',he:'hebrew',ar:'arabic',th:'thai',ko:'korean',zh:'chinese',ja:'japanese'}
  , txt = (cst == '') ? nav[window.navigator.language.substring(0,2)] : cst
  , mov = _ => {window.location = window.location.toString().replace(/-all\./, `-${txt}\.`)}
  , tar = document.querySelector('#lang > a')

document.querySelector('#logo > a')?.setAttribute('href', `https://hitomi.la/index-${txt}.html`);
if (document.URL.indexOf(`-${txt}\.`) > -1) {
    window.onpopstate = _ => history.go(-2)
    history.pushState({}, '')
}
if (document.URL.indexOf('-all.html') > -1) mov()
if (tar) {
    tar.href = `https://hitomi.la/index-${txt}.html`
    tar.innerHTML = `${txt}<img src="//ltn.hitomi.la/down-arrow.png">`
    tar.style.cssText = 'padding: 0 10px; width: 150px; display: inline-block'}
GM_registerMenuCommand('Set your language', set)
})()
}
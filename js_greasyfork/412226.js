// ==UserScript==
// @name Блокировщик рекламы на Яндекс Почта
// @namespace https://greasyfork.org/ru/users/303426-титан
// @version 1.1.10
// @description Блокирует рекламу на Яндекс.Почта
// @author Титан
// @license CC BY-NC-SA
// @grant GM_addStyle
// @run-at document-start
// @match *://*.yandex.ru/*
// @downloadURL https://update.greasyfork.org/scripts/412226/%D0%91%D0%BB%D0%BE%D0%BA%D0%B8%D1%80%D0%BE%D0%B2%D1%89%D0%B8%D0%BA%20%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%8B%20%D0%BD%D0%B0%20%D0%AF%D0%BD%D0%B4%D0%B5%D0%BA%D1%81%20%D0%9F%D0%BE%D1%87%D1%82%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/412226/%D0%91%D0%BB%D0%BE%D0%BA%D0%B8%D1%80%D0%BE%D0%B2%D1%89%D0%B8%D0%BA%20%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%8B%20%D0%BD%D0%B0%20%D0%AF%D0%BD%D0%B4%D0%B5%D0%BA%D1%81%20%D0%9F%D0%BE%D1%87%D1%82%D0%B0.meta.js
// ==/UserScript==

(function() {
let css = `
div[class*="ns-view-mail-pro-left-column-button"] /*кнопка "отключить рекламу"*/
,div[data-key="box=advanced-search-box"]+div /*Новая реклама сверху*/
,div[class="ComposeDoneDirect ComposeDoneScreen-Ads"] /*реклама после отправки письма*/
,div[data-key="view=mail-pro-left-column-button"]+div /*Реклама слева*/
, .b-banner	/*Реклама снизу*/
, .ns-view-react-left-column + div /*Скрытая реклама снизу*/
, a[class*="DisableAdsButton__button"] /*Кнопка "отключить рекламу" снизу*/
, .ns-view-react-promo-container + div /*Старая реклама сверху списка писем*/
, .message-list-banner-portal + div /*Реклама сверху списка писем*/
, div[class*="RightColumn"].js-scroller-right /*Реклама справа*/
, [data-testid="page-layout_right-column_container_v1"] /*Новая реклама справа*/

{
	display:none!important;
}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

// ==UserScript==
// @name         LINE theme downloader
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Download LINE themes using Tampermonkey
// @author       gochi_AI
// @match        https://store.line.me/themeshop/*/*/*
// @grant        none
// @icon         https://scdn.line-apps.com/n/line_store_sp/img/favicon_20160805.ico
// @downloadURL https://update.greasyfork.org/scripts/470013/LINE%20theme%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/470013/LINE%20theme%20downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractThemeId(url) {
        let id = url.split('/')[5].split('?')[0];
        return id;
    }

    function extractVersion() {
        var doc = new DOMParser().parseFromString(document.body.innerHTML, 'text/html');
        var version = doc.evaluate('//div[@class="mdCMN38Img"]/img/@src', doc, null, XPathResult.STRING_TYPE, null).stringValue;
        return version.split("/")[10];
    }

    function downloadTheme(url) {
        var themeId = extractThemeId(url);
        var version = extractVersion();
        const buttonElement = document.querySelector('button[data-widget="LinkButton"]');
        var downloadurl = `https://shop.line-scdn.net/themeshop/v1/products/${themeId.substring(0, 2)}/${themeId.substring(2, 4)}/${themeId.substring(4, 6)}/${themeId}/${version}/ANDROID/theme.zip`;
        if (buttonElement === null) {
  const ulElement = document.querySelector('ul.mdCMN38Item01Ul');
  const divElement = document.createElement('div');
  divElement.classList.add('mdCMN38Item01Sub');
  divElement.innerHTML = `<button type="button" class="MdBtn03 mdBtn03P01" data-widget="LinkButton"  data-event-category="sticker" data-event-label="theme_creators" data-event-action="click_theme_premium_trial_PC">download</button>`;
  ulElement.insertAdjacentElement('afterend', divElement);

    const newLinkButton = divElement.querySelector('button[data-widget="LinkButton"]');
    newLinkButton.addEventListener('click', function() {
window.location.href=`${downloadurl}`
  });

} else {
        buttonElement.dataset.href = downloadurl;
        buttonElement.textContent = "download";
        }}
    extractThemeId(window.location.href)
    downloadTheme(window.location.href)
})();
// ==UserScript==
// @name         Twitter icon
// @namespace    https://github.com/LunAhEric
// @version      1.8
// @description  置換推特ICON
// @author       Rutsu
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?domain=twitter.com/
// @license      MIT
// @grant        GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/471593/Twitter%20icon.user.js
// @updateURL https://update.greasyfork.org/scripts/471593/Twitter%20icon.meta.js
// ==/UserScript==

(function () {
    GM.registerMenuCommand('更換', changeIcon);
    GM.registerMenuCommand('復原', resetIcon);
    GM.registerMenuCommand('顏色設定', setColorPicker);
    GM.registerMenuCommand('關閉顏色設定', removeColorPicker);
})();

const main = function () {
    if (localStorage.getItem(localKey) != null) {
        config.iconColor = localStorage.getItem(localKey);
    }
}

const localKey = 'titterIconChangeSetting';
const config = {
    XSvg: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
    birdSvg: 'M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z',
    iconColor: '#1D9BF0'
}

const titterIconList = [
    'https://abs.twimg.com/favicon.ico',
    'https://abs.twimg.com/responsive-web/client-web/icon-ios.b1fc727a.png',
    'https://abs.twimg.com/responsive-web/client-web/icon-svg.168b89da.svg'
]

function changeIcon() {
    const icon = document.querySelector(`path[d="${config.XSvg}"]`);
    if (icon != null) {
        const iconCss = icon.parentElement.parentElement;
        icon.setAttribute('d', config.birdSvg);
        iconCss.style = `color:${config.iconColor};`;
        localStorage.setItem(localKey, config.iconColor);
        iconCss.setAttribute('userSetIconColor', '');
        document.querySelector('link[rel="shortcut icon"]').href = titterIconList[0];
        clearInterval(time);
    }
}

function resetIcon() {
    const icon = document.querySelector(`path[d="${config.birdSvg}"]`);
    const iconCss = icon.parentElement.parentElement;
    icon.setAttribute('d', config.XSvg);
    iconCss.style = '';
}

function setColorPicker() {
    const userSetIconColor = document.querySelector('svg[userSetIconColor]').parentElement.parentElement;
    const colorDiv = document.createElement('div');
    const iconColor = document.createElement('input');
    colorDiv.id = 'i_color_div';
    iconColor.type = 'color';
    iconColor.name = 'icon_color_select';
    iconColor.id = 'i_color';
    iconColor.value = config.iconColor;
    colorDiv.append(iconColor);
    userSetIconColor.append(colorDiv);
    if (document.querySelector('#i_color')) {
        changeColor();
    }
}

function removeColorPicker() {
    document.querySelector('svg[userSetIconColor]').parentElement.parentElement.removeChild(document.querySelector('#i_color_div'));
}

function changeColor() {
    document.querySelector('#i_color').addEventListener('input', function () {
        config.iconColor = this.value;
        document.querySelector('svg[userSetIconColor]').style = `color:${config.iconColor};`;
        localStorage.setItem(localKey, config.iconColor);
    })
}

const time = setInterval(() => {
    changeIcon();
}, 500);

main();
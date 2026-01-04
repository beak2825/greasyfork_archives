// ==UserScript==
// @name        网页字体替换
// @name:en     Replace Web Fonts
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @version     1.5
// @author      T_H_R
// @grant       GM_getValue
// @grant       GM_addStyle
// @description 禁止网站使用某些字体，依赖某些未定义行为。已知问题：网页字体设为system-ui时无效；Chrome支持不完善；Safari未作测试。
// @description:en Prevent website from using some of fonts. Know issue: When website font set to system-ui the script doesnot work; On Chrome the script doesnot work perfect; The script is not tested on Safari.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/543082/%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/543082/%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

'use strict';

const browser = (/Firefox/.test(navigator.userAgent)) ? 'firefox' : 'chrome';

if (browser === 'firefox') {

  const replaceFont = ['Noto Sans CJK SC', 'PingFang SC', 'WenQuanYi Micro Hei',
    'Microsoft YaHei', '微软雅黑', 'Microsoft YaHei UI', 'Microsoft JhengHei', '微軟正黑體', 'Meiryo UI', 'Malgun Gothic',
    'Noto Sans SC', 'Noto Sans JP', 'Noto Sans KR',
    'Arial', 'Segoe UI', 'Roboto', 'SF Pro Display', 'Tahoma', 'Helvetica',
    'SimHei', '黑体', 'STXihei', '华文细黑',
    'SimSun', '宋体',
    'Consolas', 'Menlo', 'Lucida Console', 'Courier', 'Courier New'];

  GM_addStyle(replaceFont.map((font) => `@font-face{font-family:"${font}";src:local("null")}`).join('\n'));

}

else if (browser === 'chrome') {

  const replaceFont = ['Arial', 'Helvetica', 'Segoe UI', 'SF Pro Display', 'Roboto', 'Microsoft YaHei', 'Microsoft YaHei UI', 'PingFang SC', 'Noto Sans CJK SC', 'Noto Sans JP'];

  const tempElement = document.createElement('div');
  tempElement.style.fontFamily = 'initial';
  document.body.appendChild(tempElement);
  const defaultFont = window.getComputedStyle(tempElement).fontFamily;
  document.body.removeChild(tempElement);

  GM_addStyle(replaceFont.map((font) => `@font-face{font-family:"${font}";src:local(${defaultFont})}`).join('\n'));

}

const shadow = GM_getValue("shadow");
if (shadow.enable) {
  // some css styles: 0.16px 0.01em 0.01em 0.02em #707070||0.24px 0 0 0.02em #80808033||- 0 0 0.3px #ACACAC||calc(calc(40px - 1em) / 170) - - - -
  GM_addStyle(`* {-webkit-text-stroke-width: ${shadow.stroke};text-shadow: ${shadow.offsetX} ${shadow.offsetY} ${shadow.blur} ${shadow.color};}`);
}
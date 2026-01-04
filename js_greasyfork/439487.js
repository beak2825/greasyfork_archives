// ==UserScript==
// @name                [RMFM addons]主按钮在右上角
// @namespace           RMFM_main_button_right_top
// @version             0.0.1
// @description         【这是 Reading mode for mobile 的功能插件，无法单独工作】使主按钮的位置在右上角显示
// @author              稻米鼠
// @icon                https://i.v2ex.co/UuYzTkNus.png
// @supportURL          https://meta.appinn.net/t/23292
// @contributionURL     https://afdian.net/@daomishu
// @contributionAmount  8.88
// @antifeature         payment 主脚本（Reading mode for mobile）为付费脚本
// @match               *://*/*
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/439487/%5BRMFM%20addons%5D%E4%B8%BB%E6%8C%89%E9%92%AE%E5%9C%A8%E5%8F%B3%E4%B8%8A%E8%A7%92.user.js
// @updateURL https://update.greasyfork.org/scripts/439487/%5BRMFM%20addons%5D%E4%B8%BB%E6%8C%89%E9%92%AE%E5%9C%A8%E5%8F%B3%E4%B8%8A%E8%A7%92.meta.js
// ==/UserScript==

const opt = window.RMFM ? window.RMFM : window.RMFM={}
const addons = (opt.addons && opt.addons instanceof Array) ? opt.addons : opt.addons=[]
addons.push({
  name: 'Main button right top',
  buttonStyle: `#rmfm-main-button {
    left: initial;
    top: 24px;
    right: 24px;
    bottom: initial;
  }`
})
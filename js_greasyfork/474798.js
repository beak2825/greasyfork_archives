// ==UserScript==
// @name         屏蔽勋章背囊
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  用于屏蔽导航栏“勋章冰箱”及勋章商城界面的“我的勋章”。
// @author       风&nit
// @match        https://www.gamemale.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474798/%E5%B1%8F%E8%94%BD%E5%8B%8B%E7%AB%A0%E8%83%8C%E5%9B%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/474798/%E5%B1%8F%E8%94%BD%E5%8B%8B%E7%AB%A0%E8%83%8C%E5%9B%8A.meta.js
// ==/UserScript==

document.getElementById('mn_N13d5').style.display = 'none';
document.querySelector('[href="wodexunzhang-showxunzhang.html?action=my"]').style.display = 'none';

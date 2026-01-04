// ==UserScript==
// @name         布锅锅联盟宇宙 免关注
// @namespace    https://github.com/UnluckyNinja
// @version      1.0.0
// @description  免除试听等的密码输入，有条件请支持网站作者
// @author       UnluckyNinja
// @license      MIT
// @match        https://voice.buguoguo.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=buguoguo.cn
// @grant        GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/543915/%E5%B8%83%E9%94%85%E9%94%85%E8%81%94%E7%9B%9F%E5%AE%87%E5%AE%99%20%E5%85%8D%E5%85%B3%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/543915/%E5%B8%83%E9%94%85%E9%94%85%E8%81%94%E7%9B%9F%E5%AE%87%E5%AE%99%20%E5%85%8D%E5%85%B3%E6%B3%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    GM_addElement('script', {
        type: 'module',
        textContent: `
import { x } from './assets/index-na7hH_Eo.js';

x().isSubscribed = true
x().setSubscribe = ()=>{}`
    })
})();
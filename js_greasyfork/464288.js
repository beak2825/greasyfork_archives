// ==UserScript==
// @name         UiBot Commander修改CSS样式
// @namespace    https://greasyfork.org/en/scripts/464288-uibot-commander%E4%BF%AE%E6%94%B9css%E6%A0%B7%E5%BC%8F
// @version      1.1
// @description  修改UiBot Commander的样式，显示完整的流程名称
// @include      https://commander.uibot.com.cn/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464288/UiBot%20Commander%E4%BF%AE%E6%94%B9CSS%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/464288/UiBot%20Commander%E4%BF%AE%E6%94%B9CSS%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle('.hide-text[data-v-53b4560a]{max-width: none !important;}');
})();

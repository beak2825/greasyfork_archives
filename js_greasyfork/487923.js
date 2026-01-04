// ==UserScript==
// @name         模糊敏感信息
// @namespace    https://mc.jd.com/
// @version      2024-02-23
// @license      MIT
// @description  模糊敏感信息a
// @author       You
// @match        http*://*.jd.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/487923/%E6%A8%A1%E7%B3%8A%E6%95%8F%E6%84%9F%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/487923/%E6%A8%A1%E7%B3%8A%E6%95%8F%E6%84%9F%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const css = `
.hatcher-ant-tooltip,
.jmtd-popover,
#CardSection4  .jmtd-table-body,
#CardSection8 td.jmtd-table-cell-affix.jmtd-table-cell-affix-left,
.jmtd-modal-content h4.jmtd-typography-color-primary.jmtd-typography-title,
.hatcher-ant-table.hatcher-ant-table-has-fix-right.hatcher-ant-table-bordered tbody .hatcher-ant-table-cell h3 span,
.hatcher-ant-table.hatcher-ant-table-has-fix-right.hatcher-ant-table-bordered tbody .hatcher-ant-table-cell .hatcher-ant-flex p span,
.hatcher-ant-table.hatcher-ant-table-has-fix-right.hatcher-ant-table-bordered tbody .hatcher-ant-table-cell-ellipsis,
        .stage-card__main .num,
        .basicInfoCell,
        .hatcher-ant-table-cell .desc>div,
        .sku-img,
        .sku-info-bg a,
        .sku-info-bg p span,
        section>header>.hatcher-ant-flex a,
        section>header>.hatcher-ant-flex p>span {
            filter:blur(4px);
        }

        .hatcher-ant-table-cell .desc>div.level{
            filter:blur(0px);
        }
        .sku-img,.basicInfoCell img,
        #Card4 .jmtp-summary-card-index,
        #CardSection5 .jmtp-summary-card-index,
        .shop-name
        {
        filter:blur(8px);
        }
        `

    GM_addStyle(css)

    // Your code here...
})();
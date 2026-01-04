// ==UserScript==
// @name            amzShowOpenOrders
// @name:ja         未発送の注文を表示
// @namespace       https://furyutei.work
// @license         MIT
// @version         0.1.0
// @description     View "Open Orders" on Amazon.co.jp
// @description:ja  Amazon.co.jpにて「未発送の注文」を表示します
// @author          furyu
// @match           https://www.amazon.co.jp/*
// @noframes
// @grant           none
// @compatible      chrome
// @compatible      firefox
// @supportURL      https://github.com/furyutei/amzShowOpenOrders/issues
// @contributionURL https://memo.furyutei.work/about#send_donation
// @downloadURL https://update.greasyfork.org/scripts/427835/amzShowOpenOrders.user.js
// @updateURL https://update.greasyfork.org/scripts/427835/amzShowOpenOrders.meta.js
// ==/UserScript==

(() => {

const
    SCRIPT_NAME = 'amzShowOpenOrders';

if (! /\/order-history/.test(location.href)) return;

let open_orders_text = '未発送の注文';

switch (document.documentElement.lang) {
    case 'en-us' :
        open_orders_text = 'Open Orders';
        break;
    
    case 'zh-cn' :
        open_orders_text = '未发出的订单';
        break;
}

let tablist = document.querySelector('#orderTypeMenuContainer ul[role="tablist"]'); // TODO: 「再び購入」メニューだとこの要素が存在しない（現状は未対応）

if (! tablist) return;

let open_orders_tab = tablist.querySelector('li[role="tab"] a.a-link-normal[href*="orderFilter=open"]')?.closest('li[role="tab"]');

if ( open_orders_tab ) return;

let order_tab = tablist.querySelector('li[role="tab"] a.a-link-normal[href*="ref=ppx_yo_dt_b_orders"]')?.closest('li[role="tab"]'),
    selected_tab = tablist.querySelector('li[role="tab"].selected'),
    before_tab = order_tab ?? selected_tab;

if (! before_tab) return;

let is_open_orders_page = ( new URL(location.href).searchParams.get('orderFilter') == 'open' ),
    item_html = is_open_orders_page ? open_orders_text : `<a class="a-link-normal item" href="/gp/your-account/order-history/?ie=UTF8&orderFilter=open">${open_orders_text}</a>`;

before_tab.insertAdjacentHTML('afterend', `
    <li role="tab" ${ is_open_orders_page ? 'class="selected"' : '' }>
        <span class="a-list-item">
            ${item_html}
        </span>
    </li>
`);

})();

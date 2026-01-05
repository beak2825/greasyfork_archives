// ==UserScript==
// @name         Amazon - Hide delivered items from open orders
// @description  Hides all delivered items from your open orders.
// @author       Daku (admin@codeanimu.net)
// @namespace    https://github.com/DakuTree/userscripts
// @homepage     https://github.com/DakuTree/userscripts
// @homepageURL  https://github.com/DakuTree/userscripts
// @supportURL   https://github.com/DakuTree/userscripts/issues
// @icon         https://www.amazon.co.uk/favicon.ico
// @match        https://www.amazon.co.uk/gp/*/order-history/*orderFilter=open*
// @match        https://www.amazon.co.jp/gp/*/order-history/*orderFilter=open*
// @match        https://www.amazon.com/gp/*/order-history/*orderFilter=open*
// @match        https://www.amazon.es/gp/*/order-history/*orderFilter=open*
// @match        https://www.amazon.de/gp/*/order-history/*orderFilter=open*
// @match        https://www.amazon.it/gp/*/order-history/*orderFilter=open*
// @match        https://www.amazon.fr/gp/*/order-history/*orderFilter=open*
// @match        https://www.amazon.ca/gp/*/order-history/*orderFilter=open*
// @match        https://www.amazon.cn/gp/*/order-history/*orderFilter=open*
// @version      1.0.2

// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/16706/Amazon%20-%20Hide%20delivered%20items%20from%20open%20orders.user.js
// @updateURL https://update.greasyfork.org/scripts/16706/Amazon%20-%20Hide%20delivered%20items%20from%20open%20orders.meta.js
// ==/UserScript==


// (?:co(?:m|\.(?:uk|jp))|es|de|it|fr|ca|cn)
'use strict';

//Hide delivered items.
$(/* Delivered items */'.shipment-is-delivered').add(
	$(/* Dispatched items */'.a-color-success:contains(Dispatched)').parents('.shipment')
).add(
	$(/* Irregular delivered items, but not marked as such */'.shipment:not(:has(.shipment-top-row))')
).hide();

//Generate link to show hidden items.
$('#controlsContainer').after(
	$('<div/>', {style: 'text-align: center'}).append(
		$('<a/>', {id: 'show-hidden', href: '#', text: 'Click to show delivered items'})
	)
);
$('body').on('click', 'a#show-hidden', function() {
	$('.shipment-is-delivered').add($('.a-color-success:contains(Dispatched)').parents('.shipment')).show();
	$(this).hide();
});

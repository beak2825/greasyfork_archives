// ==UserScript==
// @name         Melonbooks: cart: better remove button
// @namespace    http://darkfader.net/
// @version      0.1
// @description  Replace cart remove button.
// @author       Rafael Vuijk
// @match        https://www.melonbooks.co.jp/clipboard/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394501/Melonbooks%3A%20cart%3A%20better%20remove%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/394501/Melonbooks%3A%20cart%3A%20better%20remove%20button.meta.js
// ==/UserScript==

// fnFormModeSubmit(...)
const RE_PARAMS = /.*\([' ]*(?<form_id>\w*)[' ]*,[' ]*(?<mode>\w*)[' ]*,[' ]*(?<var>\w*)[' ]*,[' ]*(?<cart_no>\w*)[' ]*\).*/;

HTMLElement.prototype.remove = function() { this.parentNode.removeChild(this); return this; }

let transactionid = null;
let cartKey = null;

// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
async function delete_cart(cart_no) {
    let formData = new FormData();
    formData.append('mode', 'delete');
    formData.append('cart_no', cart_no);
    formData.append('category_id', '');
    formData.append('cartKey', cartKey);
    formData.append('transactionid', transactionid);

    const response = await fetch("https://www.melonbooks.co.jp/clipboard/?", {
        method: 'POST',
        body: formData,
    });
    return await response;
}

function onReady() {

    // get CSRF token
    transactionid = document.body.querySelector('input[name="transactionid"]').getAttribute('value');
    // ???
    cartKey = document.body.querySelector('input[name="cartKey"]').getAttribute('value');

    const xpath = "//tr";

    function process(node) {
        let results = document.evaluate(xpath, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

        for (let i = 0; i < results.snapshotLength; i++) {
            let e = results.snapshotItem(i);

            if (e.hasAttribute('proc')) {    // skip already processed elements. required?
                continue;
            }
            e.setAttribute('proc', true);

            try {
                let action = e.querySelector('td.action');
                let a = action.querySelector('a');
                let click = a.getAttribute('onclick');
                a.removeAttribute('onclick');
                const matchObj = RE_PARAMS.exec(click);
                const cart_no = matchObj.groups.cart_no;
                console.log('cart_no', cart_no);

                a.onclick = () => {
                    console.log('click');
                    delete_cart(cart_no).then(response => {
                        if (response.ok) {
                            console.log('yep');
                            e.remove();
                        }
                    }).catch((error) => {
                        console.error('Error:', error);
                    });
                };
            } catch (error) {
                console.log(error);
            }
        }
    }

    process(document.body);
/*
    var config = { attributes: false, childList: true, characterData: false, subtree: true };

    (document.body.observer = new MutationObserver(function processMutations(mutations) {
        for (var m of mutations) {
            if (m.type == 'childList') {
                if (m.removedNodes.length > 0) {
                    return;// replaced?????
                }
                // TODO: order table, form, div. take highest order.
                [].forEach.call(m.addedNodes, function(v,i,a) {
//                    console.log("type " + type(v));
                    if (v instanceof HTMLTableElement || v instanceof HTMLFormElement || v instanceof HTMLDivElement || v instanceof HTMLSpanElement) {
                        process(v);
                    }
                });
            }
        }
    })).observe(document.body, config);*/
}

// start the onReady...
if (document.readyState !== "loading") {
    setTimeout(onReady, 0);
} else {
    document.addEventListener("DOMContentLoaded", onReady);
}

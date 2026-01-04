// ==UserScript==
// @name         Melonbooks: wishlist: better remove button
// @namespace    http://darkfader.net/
// @version      0.1
// @description  Replace wishlist remove button. Compatible with AutoPagerize.
// @author       Rafael Vuijk
// @match        https://www.melonbooks.co.jp/mypage/favorite.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394491/Melonbooks%3A%20wishlist%3A%20better%20remove%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/394491/Melonbooks%3A%20wishlist%3A%20better%20remove%20button.meta.js
// ==/UserScript==

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

HTMLElement.prototype.remove = function() { this.parentNode.removeChild(this); return this; }

String.prototype.rsplit = function(sep, maxsplit) {
    var split = this.split(sep);
    return maxsplit ? [ split.slice(0, -maxsplit).join(sep) ].concat(split.slice(-maxsplit)) : split;
}

let transactionid = null;

// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
async function delete_favorite(product_id) {
    let formData = new FormData();
    formData.append('mode', 'delete_favorite');
    formData.append('product_id', product_id);
    formData.append('transactionid', transactionid);

    const response = await fetch("https://www.melonbooks.co.jp/mypage/favorite.php?", {
        method: 'POST',
        body: formData,
    });
    return await response;
}

function onReady() {

    // get CSRF token
    transactionid = document.body.querySelector('input[name="transactionid"]').getAttribute('value');

    // var xpath = "//div[contains(@class, 'item')]";
    const xpath = "//div[@class='wishlist']//tr";

    function process(node) {
        let results = document.evaluate(xpath, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

        for (let i = 0; i < results.snapshotLength; i++) {
            let e = results.snapshotItem(i);

            if (e.hasAttribute('proc')) {    // skip already processed elements. required?
                continue;
            }
            e.setAttribute('proc', true);

            try {
                // console.log(e);

                let item = e.querySelector('td.item');
                let title = item.querySelector('p.title');
                let action = e.querySelector('td.action');

                // get product id
                let href = title.querySelector('a').getAttribute('href');
                const product_id = href.rsplit('=', 1).slice(-1)[0];

                // remove old button
                action.querySelector('a[onclick*="delete_favorite"]').remove();

                /*
                // uhh.. we don't actually need to create a form...
                var f = document.createElement('form');
                f.setAttribute('target', "_blank");
                f.setAttribute('method', "post");
                f.setAttribute('action', "https://www.melonbooks.co.jp/mypage/favorite.php?");

                let ff = document.createElement('input');
                ff.setAttribute('type', "hidden");
                ff.setAttribute('name', "mode");
                ff.setAttribute('value', "delete_favorite");
                f.appendChild(ff);

                ff = document.createElement('input');
                ff.setAttribute('type', "hidden");
                ff.setAttribute('name', "product_id");
                ff.setAttribute('value', product_id);
                f.appendChild(ff);

                ff = document.createElement('input');
                ff.setAttribute('type', "hidden");
                ff.setAttribute('name', "transactionid");
                ff.setAttribute('value', transactionid);
                f.appendChild(ff);

                // product_class_id: 483710
                // quantity: 1
*/
                let ff = document.createElement('input');
//                ff.setAttribute('type', "submit");
                ff.setAttribute('type', "button");
                ff.setAttribute('value', 'remove from wishlist');
                ff.setAttribute('class', 'input_btn br_5'); // doesn't work

                // anchor had these styles...
                ff.setAttribute('style', "\
                display: block;\
                font-size: 12px;\
                text-indent: 0px;\
                border: 1px solid #a09d9e;\
                background: -webkit-linear-gradient( 90deg, rgb(230,230,230) 0%, rgb(255,255,255) 100%);\
                color: #333333;\
                line-height: 24px;");

                action.appendChild(ff);
                //action.appendChild(f);

                ff.addEventListener("click", () => {
                    console.log('click');
                    delete_favorite(product_id).then(response => {
                        if (response.ok) {
                            console.log('yep');
                            e.remove();
                        }
                    }).catch((error) => {
                        console.error('Error:', error);
                    });
                });

                //f.appendChild(ff);

            } catch (error) {
                console.log(error);
            }
        }
    }

    process(document.body);

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
    })).observe(document.body, config);
}

// start the onReady...
if (document.readyState !== "loading") {
    setTimeout(onReady, 0);
} else {
    document.addEventListener("DOMContentLoaded", onReady);
}

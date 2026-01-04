// ==UserScript==
// @name         Melonbooks: cart: backup/restore
// @namespace    http://darkfader.net/
// @version      0.2
// @description  Restore cart from backup.
// @author       Rafael Vuijk
// @match        https://www.melonbooks.co.jp/clipboard/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/394506/Melonbooks%3A%20cart%3A%20backuprestore.user.js
// @updateURL https://update.greasyfork.org/scripts/394506/Melonbooks%3A%20cart%3A%20backuprestore.meta.js
// ==/UserScript==

HTMLElement.prototype.remove = function() { this.parentNode.removeChild(this); return this; }

String.prototype.rsplit = function(sep, maxsplit) {
    var split = this.split(sep);
    return maxsplit ? [ split.slice(0, -maxsplit).join(sep) ].concat(split.slice(-maxsplit)) : split;
}

let transactionid = null;
let cartKey = null;

// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
async function add_cart(product_id) {
    let formData = new FormData();
    formData.append('mode', 'cart_ajax');
    formData.append('product_id', product_id);
    formData.append('quantity', '1');
    formData.append('transactionid', transactionid);
    // product_class_id: ....

    const response = await fetch("https://www.melonbooks.co.jp/detail/detail.php?product_id=" + product_id, {
        method: 'POST',
        body: formData,
    });
    return await response;
}

function onReady() {

    let cart_dict = {};

    // get CSRF token
    transactionid = document.body.querySelector('input[name="transactionid"]').getAttribute('value');

    const xpath = '//*[@id="container"]//table[@class="list mb20"]/tbody/tr';

    function process(node) {
        let results = document.evaluate(xpath, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

        for (let i = 0; i < results.snapshotLength; i++) {
            let e = results.snapshotItem(i);

            try {
                let name = e.querySelector("td[class='name']");

                // get product id
                let href = name.querySelector('a').getAttribute('href');
                const product_id = href.rsplit('=', 1).slice(-1)[0];

                cart_dict[product_id] = 1;
                // console.log('product_id', product_id);
            } catch (error) {
                // console.log(error);
            }
        }
    }

    process(document.body);

    let missing = new Set();

    try {
        let backup_cart_dict = JSON.parse(GM_getValue('melonbooks_cart_backup'));
        for (let product_id in backup_cart_dict) {
            if (!(product_id in cart_dict)) {
                console.log('missing', product_id);
                missing.add(product_id);
            }
        }
    } catch (e) {
    }

    if (/*Object.keys(cart_dict).length == 0 &&*/ missing.size != 0) {
        if (window.confirm('Restore cart? (this may take a few seconds)\n' + JSON.stringify([...missing]))) {
            Promise.all(
                [...missing].map(async product_id => {
                    return add_cart(product_id).then(response => {
                        if (!response.ok) {
                            throw "status " + response.status;
                        }
                        cart_dict[product_id] = 1;
                    });
                })
            ).then(() => {
                GM_setValue('melonbooks_cart_backup', JSON.stringify(cart_dict));
                window.location.reload();
            }).catch(error => {
                window.alert('Error: ' + error + "\nReload to try again.")
            });
        } else {
            GM_setValue('melonbooks_cart_backup', JSON.stringify(cart_dict));
        }
    } else {
        GM_setValue('melonbooks_cart_backup', JSON.stringify(cart_dict));
    }
    //function x() {}
    GM_registerMenuCommand("Items: " + Object.keys(cart_dict).length.toString());//, x, "");
}

// start the onReady...
if (document.readyState !== "loading") {
    setTimeout(onReady, 0);
} else {
    document.addEventListener("DOMContentLoaded", onReady);
}

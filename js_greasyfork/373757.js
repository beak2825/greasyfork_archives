// ==UserScript==
// @name        Amazon Automation
// @namespace   https://greasyfork.org/users/222319
// @version     1.5.46
// @date        2018-10-30
// @description Automatically add entire lists, empty cart or saved items.
// @author      Explisam <explisam@gmail.com>
// @compatible  chrome
// @compatible  firefox
// @compatible  opera
// @compatible  safari
// @license     MIT License <https://opensource.org/licenses/MIT>
// @include     *.amazon.co*/*
// @grant       GM_addStyle
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/373757/Amazon%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/373757/Amazon%20Automation.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

(function() {

    const ListPlaceHolder = document.getElementById("wl-list-collaborators");
    const ListContainer = document.getElementById("g-items");
    const CartContainer = document.getElementById('sc-active-cart');
    const SaveContainer = document.getElementById('sc-saved-cart');

    if (ListContainer) {
        ListPolymer();
        CountFlag();
        CountPop();

        var config = { attributes: true, childList: true, subtree: true };
        var observer = new MutationObserver(ListObserver);
        observer.observe(ListContainer, config);
    }

    if (CartContainer) {
        CartPolymer();
    }

    if (SaveContainer) {
        SavePolymer();
    }

    function buttonBuild(id, margin, style, action, text) {
        var buttonDec = document.createElement("span");
        buttonDec.id = id;
        buttonDec.className = "a-declarative a-button a-button-normal a-button-primary " + style;
        buttonDec.addEventListener("click", action, false);

        if (margin) {
            buttonDec.style.marginBottom = margin;
            buttonDec.style.display = "block";
        }

        var buttonInn = document.createElement("span");
        buttonInn.className = "a-button-inner";

        var button = document.createElement("span");
        button.appendChild(document.createTextNode(text));
        button.className = "a-button-text";
        button.role = "button";

        buttonDec.appendChild(buttonInn);
        buttonInn.appendChild(button);

        return buttonDec;
    }

    function spanBuild(id, style, text) {
        var span = document.createElement("span");
        span.className = style;
        span.appendChild(document.createTextNode(text));

        if (id) {
            span.id = id;
        }

        return span;
    }

    function ListPolymer() {
        var checkdi = document.getElementById('amazonAutoCAd');
        var checkli = ListContainer.querySelectorAll('[data-action=add-to-cart]');

        if (!checkdi && checkli[0]) {
            var button = buttonBuild(
                "amazonAutoCAd",
                undefined,
                "wl-info-aa_add_to_cart aok-float-right",
                AddList, "Add List to Cart")
            var referenceNode = ListPlaceHolder.querySelector('.aok-inline-block');
            referenceNode.parentNode.insertBefore(button, referenceNode.nextSibling);
        }
    }

    function CartPolymer() {
        var checkdi = document.getElementById('amazonAutoCDt');
        var checkli = CartContainer.querySelectorAll('*[name^="submit.delete"]');

        if (!checkdi && checkli[0]) {
            var button = buttonBuild(
                "amazonAutoCDt",
                "20px",
                "a-row",
                DeleteCart,
                "Delete all items")
            var referenceNode = document.getElementById('sc-active-cart');
            referenceNode.insertBefore(button, referenceNode.firstChild);
        }
    }

    function SavePolymer() {
        var checkdi = document.getElementById('amazonAutoCSv');
        var checkli = SaveContainer.querySelectorAll('*[name^="submit.delete"]');

        if (!checkdi && checkli[0]) {
            var button = buttonBuild(
                "amazonAutoCSv",
                "20px",
                "a-row",
                DeleteSave,
                "Delete all saved")
            var referenceNode = document.getElementById('sc-saved-cart');
            referenceNode.insertBefore(button, referenceNode.firstChild);
        }
    }

    function CountFlag(observer) {
        var referenceNode =
            document.getElementById('wl-list-info')
        .getElementsByTagName('div')[0]
        .getElementsByTagName('div')[0];

        if (observer) {
            var counter = document.getElementById("amazonAutoCCn");
            referenceNode.removeChild(counter.parentNode);
        }

        var checkli = ListContainer.querySelectorAll('[data-action=add-to-cart]');

        if (checkli[0]) {
            var container = document.getElementById("wl-item-view");
            var whole = container.getElementsByClassName("a-price");
            var price = [];
            var currency = whole[0].getElementsByClassName('a-offscreen')[0].innerText.substring(0,1);

            for (var i = 0; i < whole.length; i++) {
                var itemMeta = JSON.parse(whole[i].parentNode.getAttribute("data-item-prime-info")).id;
                var itemId = 'itemRequested_' + itemMeta;
                var itemQuantity = document.getElementById(itemId).innerText;

                if (!itemQuantity) {
                    itemQuantity = 1;
                } else {
                    itemQuantity = parseFloat(itemQuantity);
                }

                var itemPrice = parseFloat(whole[i].getElementsByClassName('a-offscreen')[0].innerText.substring(1));

                price[i] = itemPrice * itemQuantity;
            }

            var total = price.reduce((a, b) => a + b, 0).toFixed(2);

            var wrapper = document.createElement('span');

            var display = spanBuild(
                "amazonAutoCCn",
                "a-size-medium a-color-price sc-price sc-white-space-nowrap sc-price-sign a-text-bold",
                currency + total + " (Subtotal)");

            wrapper.appendChild(display);

            if (!observer) {
                var space1 = spanBuild(undefined, "a-letter-space", "")
                var space2 = spanBuild(undefined, "a-letter-space", "")

                referenceNode.appendChild(space1);
                referenceNode.appendChild(space2);
            }

            referenceNode.appendChild(wrapper);
        }
    }

    function ListObserver(mutationsList, observer) {
        CountFlag(observer);

        ListLength =
            ListContainer.querySelectorAll('[data-action=add-to-cart]').length +
            ListContainer.getElementsByClassName('g-cart-checkout-btn').length;
    }

    function CountPop() {
        var dialog = document.createElement("div");
        dialog.style.visibility = "visible";
        dialog.style.display = "contents";
        dialog.style.marginTop = "10px";
        dialog.className = "a-popover a-popover-no-header a-declarative a-arrow-right";

        var wrapper = document.createElement("div");
        wrapper.className = "a-popover-wrapper a-popover-inner";
        wrapper.style.border = "1px solid #c45500"
        wrapper.style.borderColor = "rgba(196,85,0,1)"

        var button = document.createElement("button");
        button.className = "a-button-close a-declarative";
        button.addEventListener("click", function(){
            document.getElementById("content-right").removeChild(dialog);
        }, false);

        var icon = document.createElement("i");
        icon.className = "a-icon a-icon-close";

        var content = document.createElement("div");
        content.id = "a-popover-content-1";
        content.className = "a-popover-content";
        content.appendChild(
            document.createTextNode(
                "Make sure to expand your list (scroll to bottom)" +
                " to view full sub-total price"
            ));

        button.appendChild(icon);
        dialog.appendChild(wrapper);
        wrapper.appendChild(button);
        wrapper.appendChild(content);

        var referenceNode = document.getElementById('wl-list-collaborators');
        referenceNode.parentNode.insertBefore(dialog, referenceNode.nextSibling);
    }

    function getRex(name) {
        return document
            .getElementById(name)
            .getElementsByTagName('span')[0]
            .getElementsByTagName('span')[0];
    }

    var ListPass;
    var ListLength;
    var ListTimer;
    var listButtons;

    function AddList(zEvent) {
        if (ListPass) {
            return;
        }

        var addObj = document.getElementById('amazonAutoCAd');
        addObj.disabled = "disabled";
        ListPass = true;

        ListLength = ListContainer.querySelectorAll('[data-action=add-to-cart]').length;

        ListTimer = window.setInterval(function() {
            listButtons = ListContainer.querySelectorAll('[data-action=add-to-cart]');

            if (listButtons[0]) {
                var referenceButton = listButtons[0].getAttribute("data-add-to-cart");
                var referenceMeta = JSON.parse(referenceButton).itemID;
                var referenceView = document.querySelectorAll('[data-itemid=' + referenceMeta + ']')[0];
                referenceView.scrollIntoView({ behavior: 'smooth' });

                listButtons[0].click();
                getRex('amazonAutoCAd').innerText
                    = "Added "
                    + (ListLength - listButtons.length)
                    + " items out of " + ListLength + "..";
            } else {
                getRex('amazonAutoCAd').innerText = "Added " + ListLength + " items to cart";
                window.clearInterval(ListTimer);

                window.scrollTo({ top: 0, behavior: 'smooth' });

                var unavailable = ListContainer.getElementsByClassName('wl-info-aa_buying_options_button').length;

                if (unavailable) {
                    unavailable = unavailable + " unavailable item";

                    if (unavailable.substring(0,1) > 1) {
                        unavailable = unavailable + "s";
                    }

                    var warning = spanBuild(undefined, "aok-float-right", unavailable)
                    warning.style.marginTop = "5px";
                    warning.style.marginRight = "5px";
                    warning.style.color = "#c45500";

                    var referenceNode = document.getElementById('amazonAutoCAd');
                    referenceNode.parentNode.insertBefore(warning, referenceNode.nextSibling);
                }
            }
        }, 500);
    }

    var CartPass;

    function DeleteCart(zEvent) {
        if (CartPass) {
            return;
        }

        var cartLength = CartContainer.querySelectorAll('*[name^="submit.delete"]').length;
        var cartObj = document.getElementById('amazonAutoCDt');
        cartObj.disabled = "disabled";
        CartPass = true;

        var cartTimer = window.setInterval(function() {
            var listButtons = CartContainer.querySelectorAll('*[name^="submit.delete"]');

            if (listButtons[0] && cartLength == listButtons.length) {
                listButtons[0].click();

                cartLength = listButtons.length - 1;
                getRex('amazonAutoCDt').innerText = cartLength + " items left..";
            } else if (!listButtons[0]) {
                cartObj.parentNode.removeChild(cartObj);
                window.clearInterval(cartTimer);
            }
        }, 500);
    }

    var SavePass;

    function DeleteSave(zEvent) {
        if (SavePass) {
            return;
        }

        var saveLength = SaveContainer.querySelectorAll('*[name^="submit.delete"]').length;
        var saveObj = document.getElementById('amazonAutoCSv');
        saveObj.disabled = "disabled";
        SavePass = true;

        var saveTimer = window.setInterval(function() {
            var listButtons = SaveContainer.querySelectorAll('*[name^="submit.delete"]');

            if (listButtons[0] && saveLength == listButtons.length) {
                listButtons[0].click();

                saveLength = listButtons.length - 1;
                getRex('amazonAutoCSv').innerText = saveLength + " items left..";
            } else if (!listButtons[0]) {
                saveObj.parentNode.removeChild(saveObj);
                window.clearInterval(saveTimer);
            }
        }, 500);
    }
})();
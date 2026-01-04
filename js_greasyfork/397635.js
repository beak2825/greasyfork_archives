// ==UserScript==
// @name         mousetrap
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Favorite functionality for seamless orders
// @author       Jeffrey Lu
// @match        https://www.seamless.com/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.4.1.min.js#sha384=vk5WoKIaW/vJyUAd9n/wmopsmNhiy+L2Z+SBxGYnUkunIxVxAv/UtMOhba/xskxh
// @require      https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js#sha384=ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q
// @require      https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.4.1/js/bootstrap.min.js#sha384=wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6
// @downloadURL https://update.greasyfork.org/scripts/397635/mousetrap.user.js
// @updateURL https://update.greasyfork.org/scripts/397635/mousetrap.meta.js
// ==/UserScript==

// adapted from https://bit.ly/2PmGi29
$("head").prepend(
    '<link '
  + 'href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" '
  + 'rel="stylesheet" '
  + 'integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" '
  + 'crossorigin="anonymous">');

$("head").prepend(
    '<link '
  + 'href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.4.1/css/bootstrap.min.css" '
  + 'rel="stylesheet" '
  + 'integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" '
  + 'crossorigin="anonymous">');

// adapted from https://bit.ly/3c9tNRk
GM_addStyle(".mt_heart { padding: 5px; }");
GM_addStyle(".fa-heart-o { cursor: pointer; }");
GM_addStyle(".fa-heart { color: red; cursor: pointer; }");

let mousetrap = (function() {
    // adapted from https://bit.ly/38Z9G6b
    const checkElements = async selector => {
        while (!$(selector).length) {
            await new Promise(resolve => requestAnimationFrame(resolve));
        }
        return $(selector);
    };

    const checkElement = async selector => {
        return checkElements(selector).then(function(elements) {
            return elements.first();
        });
    };

    let mousetrap = {}, favorites_by_restaurant = {};

    mousetrap.run = async function() {
        try {
            favorites_by_restaurant =
                JSON.parse(await GM.getValue("mt_favorites"));
        } catch(e) {
            console.error(e);
        }

        const pathname = window.location.pathname;
        if (/^\/menu\/.*$/.test(pathname)) {
            mousetrap.menu();
        } else if (/^\/checkout\/.*$/.test(pathname)) {
            mousetrap.checkout();
        }
    };

    mousetrap.menu = function() {
        checkElement("h1.ghs-restaurant-nameHeader").then(async function(element) {
            let dropdown_html = `
                <div class="dropdown">
                    <button class="btn btn-info btn-lg dropdown-toggle" type="button" data-toggle="dropdown">Favorites</button>
                    <div id="mt-dropdown" class="dropdown-menu">
                    </div>
                </div>
            `;
            $(element).parent().append(dropdown_html);
            let dropdown_menu = $("#mt-dropdown");

            const restaurant = element.text();
            let favorites = favorites_by_restaurant[restaurant] || {};
            for (const f in favorites) {
                const info = favorites[f];
                $(`<button class="dropdown-item" type="button">
                       ${f}
                   </button>`).appendTo(dropdown_menu).click(async function() {
                       checkElement(`a.menuItem-name[title='${f}']`).then(function(menu_item) {
                           menu_item.parent().click();
                       });

                       for (const e of info["extras"]) {
                           checkElement(`label:contains('${e}')`).then(function(extra) {
                               extra.click();
                           });
                       }

                       checkElement("#specialInstructionsTextarea").then(function(instructions) {
                           // TODO: there should be a cleaner way of doing this
                           // rather than using a timeout
                           setTimeout(function() {
                               instructions.focus();
                               instructions.val(info["instructions"]);

                               // adapted from https://bit.ly/2TYmPr5
                               // this is kind of dumb, but seemingly necessary.
                               // send a dummy keyup event so that the value set
                               // in the "Special instructions" box persists
                               instructions[0].dispatchEvent(new KeyboardEvent("keyup"));
                           }, 100);
                       });
                   });
            }
        });
    };

    mousetrap.checkout = function() {
        // TODO: use the container to synchronously wait for the other elements
        const CONTAINER_SELECTOR = "ghs-site-container #ghs-globalCart-container";
        checkElement(CONTAINER_SELECTOR).then(async function(container) {
            let orderTitle = await checkElement(CONTAINER_SELECTOR +
                                                " div.orderTitle");
            const restaurant = orderTitle.children("div").text();

            let orderItems = await checkElements(CONTAINER_SELECTOR +
                                                 " ghs-cart-order-item.orderItem");
            orderItems.each(function(index, value) {
                let name = $(value).find("div.orderItem-name").text();
                let favorites = favorites_by_restaurant[restaurant];
                let heart;
                if (favorites && favorites.hasOwnProperty(name)) {
                    heart = $('<i class="mt_heart fa fa-heart"></i>').appendTo(this);
                } else {
                    heart = $('<i class="mt_heart fa fa-heart-o"></i>').appendTo(this);
                }

                heart.click(function() {
                    const parent = $(this).parent();
                    let name = parent.find("div.orderItem-name").text();

                    if ($(this).hasClass("fa-heart-o")) {
                        let extras = $.map(
                            parent.find("div.orderItem-description > span.each-item"),
                            function(e) {
                                return $(e).text();
                            });
                        let instructions = parent.find("div.orderItem-instructions").text();
                        instructions = instructions.slice(1, -1);  // remove quotes

                        let favorites = favorites_by_restaurant[restaurant] || {};
                        favorites[name] = {
                            "extras" : extras,
                            "instructions" : instructions,
                        };
                        favorites_by_restaurant[restaurant] = favorites;
                    } else {
                        console.assert($(this).hasClass("fa-heart"));
                        console.assert(favorites_by_restaurant[restaurant]);
                        delete favorites_by_restaurant[restaurant][name];
                    }

                    $(this).toggleClass("fa-heart-o");
                    $(this).toggleClass("fa-heart");

                    GM.setValue("mt_favorites",
                                JSON.stringify(favorites_by_restaurant));
                });
            });
        });
    };

    return mousetrap;
}());

mousetrap.run();

// adapted from https://bit.ly/2VxAqH3
history.pushState = (f => function pushState() {
    var ret = f.apply(this, arguments);
    window.dispatchEvent(new Event('pushstate'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
})(history.pushState);

history.replaceState = (f => function replaceState() {
    var ret = f.apply(this, arguments);
    window.dispatchEvent(new Event('replacestate'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
})(history.replaceState);

window.addEventListener('popstate', () => {
    window.dispatchEvent(new Event('locationchange'));
});

window.addEventListener('locationchange', function() {
    mousetrap.run();
});
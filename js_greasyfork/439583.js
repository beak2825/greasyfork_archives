// ==UserScript==
// @name         Share Coop Basket
// @version      0.1
// @description  Adds two buttons to mad.coop.dk, one to copy the current basket to the clipboard as a JSON string, and one to paste a JSON string to the basket.
// @license      GPL-3
// @author       Anon
// @match        https://mad.coop.dk/*
// @grant        GM_setClipboard
// @grant        window.onurlchange
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @namespace https://greasyfork.org/users/872975
// @downloadURL https://update.greasyfork.org/scripts/439583/Share%20Coop%20Basket.user.js
// @updateURL https://update.greasyfork.org/scripts/439583/Share%20Coop%20Basket.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // START OF Copy basket to clipboard
    function click_close_if_present() {
        var close_btn = document.querySelector("button.close");
        if (close_btn != null) {
            close_btn.click();
        }
    }

    function construct_url(pathname) {
        return new URL(pathname, "https://mad.coop.dk/");
    }

    function find_all_grocery_links() {
        const basket_group_div = document.querySelector(".basket__groups");
        if (basket_group_div == null) {
            throw "Error: Could not find .basket__groups div";
        };
        console.log(basket_group_div);
        find_grocery_items_in_div(basket_group_div);
    }

    function find_grocery_items_in_div(root_el) {
        let basket_lines = root_el.querySelectorAll(".basket-line-item");
        var grocery_items = new Object();

        for (let basket_line of basket_lines) {
            let link_el = basket_line.querySelectorAll("h3 > a");
            let input_el = basket_line.querySelectorAll("input");

            if (link_el.length > 1) {throw "Too many link_el"};
            if (input_el.length > 1) {throw "Too many input_el"};

            let the_link = link_el[0];
            let the_input = input_el[0];

            // console.log(the_link.href);
            // console.log(the_input.value);

            grocery_items[the_link.pathname] = Number(the_input.value);
        };

        let json_string = JSON.stringify(grocery_items, null, 2);

        console.log(json_string);

        GM_setClipboard(json_string);

        alert("Basket copied to clipboard!");

    };

// Create button the user can click
    function create_share_button() {
        const button = document.createElement("button");

        button.innerText = "Copy Basket to clipboard"

        button.setAttribute("class", "c-btn c-btn--primary");
        button.setAttribute("style", "max-width: 250px");

        button.addEventListener('click', () => {
            try {
                find_all_grocery_links();
            }
            catch(e) {
                alert(e);
            }
        })

        var h1 = document.querySelector("h1");

        if (h1 != null) {
        h1.insertAdjacentElement("afterend", button);
        }
        else {
        setTimeout(create_share_button, 250)
        }
    }

    if (window.location == "https://mad.coop.dk/kurv") {
        create_share_button();
    }

    // Share Basket End

    // Paste Basket Begin

        // Safety escape button
    document.onkeyup = function(e) {
        if (e.key === "Escape") {
            GM_setValue(key_name, []);
            window.clearTimeout()
            alert("Mission aborted!");
        }
    };

    console.log("Coop Share Basket Userscript loaded!");

    var key_name = "coop_groceries_to_add";
    var gta = GM_getValue(key_name);
    // console.log(gta);

    function dict_to_array(d) {
        let ar = [];
        if (!Array.isArray(d)) {
            // Convert dict to array if we are given a dict
            for (let key in d) {
                ar.push([key, d[key]]);
            }
        } else {
            ar = d;
        }
        return ar;
    }

    function paste_basket() {
        var ar = dict_to_array(gta);

        if (ar.length == 0) {
            return;
        }

        var target_url = construct_url(ar[0][0])

        if (window.location == target_url.href) {
            GM_log("At the right location!")
            var next_url
            if (ar.length > 1) {
                next_url = construct_url(ar[1][0]).href;
            }
            else {
                next_url = null;
            }
            var url_and_q = ar.shift()
            GM_setValue(key_name, ar);
            let quantity = url_and_q[1];
            setTimeout(()=>{
                click_close_if_present()
                setTimeout(() => {add_quantity(Number(quantity), next_url);}, 100)
            }, 1000)
        } else {
            window.location = target_url.href;
        }
    }

    function add_quantity(q, next_url) {
        setTimeout(() => {
            // Check if there's an add to basket button and click it
            var button = document.querySelector(".c-product-detail__add-to-basket .c-btn");

            if (button != undefined) {
                button.click();
                q--;
            }

            setTimeout(() => {
                function click_plus() {
                    var plus = document.querySelector(".c-product-detail__add-to-basket .plus-accept");
                    if (q > 0) {
                        plus.click();
                        q--;
                    }
                    if (q > 0) {
                        setTimeout(click_plus, 100);
                    } else if (next_url != null) {
                        setTimeout(() => {window.location = next_url;}, 500);
                    }
                }
                click_plus();
            }, 500)
        }, 500);
    }


    function prompt_load_groceries() {
        let grocery_json = prompt("Please paste the basket JSON object:");
        // console.log("loading groceries...");
        const grocery_dict = JSON.parse(grocery_json);
        // console.log(grocery_dict);
        GM_setValue(key_name, grocery_dict);

        gta = grocery_dict;

        paste_basket();
    };

    function create_paste_button() {
    const paste_button = document.createElement("button");

    paste_button.innerText = "Paste Basket"

    paste_button.setAttribute("class", "c-btn c-btn--primary");
    paste_button.setAttribute("style", "max-width: 250px");

    paste_button.addEventListener('click', () => {
        try {
            prompt_load_groceries();
        }
        catch(e) {
            alert(e);
        }
    })

    var parent_el = document.querySelector(".c-content-wrap");

    parent_el.insertBefore(paste_button, parent_el.firstChild);
    }

    create_paste_button()

    if (gta != null && gta != undefined && gta != []) {
        paste_basket();
        }

    // Handle Single Page App navigate to basket page

    if (window.onurlchange === null) {
    // feature is supported
    window.addEventListener('urlchange', (info) => {
        GM_log("URLChange! " + window.location);
        setTimeout(() => {
        if (window.location == "https://mad.coop.dk/kurv") {
            create_share_button()
        }}, 500)
    });
    }

})();

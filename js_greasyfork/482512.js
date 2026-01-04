// ==UserScript==
// @name           Ukrainian Steam Improvements
// @description    Adds (1) the state flag for games that have Ukrainian language, (2) alert emojis for ua and ru -made games, (3) prices at the top, (4) more noticeable score over the game banner.
// @include        https://store.steampowered.com/*
// @grant          GM_addStyle
// @icon           https://community.akamai.steamstatic.com/public/images/countryflags/ua.gif
// @license        https://creativecommons.org/licenses/by-sa/4.0/
// @author         Prudten
// @version        1.1.2
// @namespace https://greasyfork.org/users/1235514
// @downloadURL https://update.greasyfork.org/scripts/482512/Ukrainian%20Steam%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/482512/Ukrainian%20Steam%20Improvements.meta.js
// ==/UserScript==
'use strict';

GM_addStyle(`
    .btn_red_steamui {
    border-radius: 2px;
    border: none;
    padding: 1px;
    display: inline-block;
    cursor: pointer;
    text-decoration: none !important;
    color: #D28BA9; !important;

    background: transparent;    text-shadow: 1px 1px 0px rgba( 0, 0, 0, 0.3 );}

    .btn_red_steamui > span {
        border-radius: 2px;
        display: block;


                    background: #D34320;
            background: -webkit-linear-gradient( top, #D34320 5%, #BC261B 95%);
    background: linear-gradient( to bottom, #D34320 5%, #BC261B 95%);
        background: linear-gradient( to right, #D94C22 5%, #BC261B 95%);    }

.btn_red_steamui:not(.btn_disabled):not(:disabled):not(.btn_active):not(.active):hover {
    text-decoration: none !important;
    color: #fff; !important;

    background: transparent;    }

    .btn_red_steamui:not(.btn_disabled):not(:disabled):not(.btn_active):not(.active):hover > span {
                    background: #8E0E29;
            background: -webkit-linear-gradient( top, #8E0E29 5%, #CE4221 95%);
    background: linear-gradient( to bottom, #8E0E29 5%, #CE4221 95%);
        background: linear-gradient( to right, #8E0E29 5%, #CE4221 95%);    }

    .btn_red_steamui.btn_active, btn_red_steamui.active {
    text-decoration: none !important;
    color: #fff; !important;

        background: transparent;            }

    .btn_red_steamui.btn_active > span, btn_red_steamui.active > span {
                    background: #8E0E29;
            background: -webkit-linear-gradient( top, #8E0E29 5%, #CE4221 95%);
    background: linear-gradient( to bottom, #8E0E29 5%, #CE4221 95%);
        background: linear-gradient( to right, #8E0E29 5%, #CE4221 95%);    }

.discount_block .discount_pct_red, .discount_pct_red {
            font-family: "Motiva Sans", Sans-serif;
        font-weight: normal; /* normal */

            font-weight: 500;
    color: #FF2611;
    background: #B00722;
    display: inline-block;
}

.game_purchase_discount .discount_pct_red,
.game_purchase_discount .bundle_base_discount {
    display: inline-block;
    height: 32px;
    line-height: 32px;
    font-size: 25px;
    text-align: center;
    overflow: hidden;
    padding: 0 6px;
}

.image-container {
    position: relative;
    display: inline-block;
}

.overlay-text {
    position: absolute;
    bottom: 0;
    right: 0;
    background-color: #A00000;
    font-size: 20px;
}

.box {
    position: absolute;
    bottom: 0;
    right: 0;
    background-color: #FF0000;
    float: left;
    height: 40px;
    width: 40px;
    margin-bottom: 1%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #272727;
    font-size: 25px;
    font-weight: bold;
    font-family: HelveticaNeue;
}

.score95 {
    background-color: #00D25F;
}
.score85 {
    background-color: #66CC33;
}
.score75 {
    background-color: #98DD75;
}
.score70 {
    background-color: #FFCC33;
}
.score55 {
    background-color: #FE9640;
}

`);


function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function isNumeric(str) {
    if (typeof str != "string") return false
    return !isNaN(str) && !isNaN(parseFloat(str))
}


if(window.location.toString().includes("app")) {
    // check translations
    var cells = document.getElementsByClassName("ellipsis");
    var title = document.getElementsByClassName("apphub_AppName")[0];
    var oldTitle = title.innerHTML;
    var uagif = "<img src=\"https://community.akamai.steamstatic.com/public/images/countryflags/ua.gif\">";

    var notSupported = ["\n                  Не підтримується                ",
                        "\n\t\t\t\t\tНе підтримується\t\t\t\t"];
    var russian      = ["\n                Russian           ",
                        "\n\t\t\t\tRussian\t\t\t",
                        "\n                російська           ",
                        "\n\t\t\t\tросійська\t\t\t"];
    var ukrainian    = ["\n                Ukrainian           ",
                        "\n\t\t\t\tUkrainian\t\t\t",
                        "\n                українська           ",
                        "\n\t\t\t\tукраїнська\t\t\t"];

    var sunflower = "🌻"
    Array.prototype.forEach.call(cells, function(cell) {
        if (russian.includes(cell.textContent) &&
        !notSupported.includes(cell.nextSibling.nextSibling.textContent)) {
            sunflower = "";
        };
    });

    Array.prototype.forEach.call(cells, function(cell) {
        if (ukrainian.includes(cell.textContent) &&
        !notSupported.includes(cell.nextSibling.nextSibling.textContent)) {
            var original_ua = cell.textContent.split(/(\p{L}.*)/u);
            cell.innerHTML = original_ua[0] + uagif + " " + original_ua[1];
            title.innerHTML = `${oldTitle} ${sunflower}${uagif}`;
        };
    });

    // check if it's Ukrainian
    oldTitle = title.innerHTML;
    var imgs = document.getElementsByTagName("img");
    var ridne = "93f3a9d4a6868bbaadc90dbbeeecfa13770a59a1";
    Array.prototype.forEach.call(imgs, function(img) {
        var imgName = img.src.split("/").pop()
        if ((imgName == `${ridne}.jpg`) ||
        (imgName == `${ridne}_medium.jpg`) ||
        (imgName == `${ridne}_full.jpg`)) {
            title.innerHTML = `💙💛 ${oldTitle}`;
        };
    });

    // check if it's made by 🐷🐶
    oldTitle = title.innerHTML;
    var prices = document.querySelectorAll('.game_purchase_price, .discount_final_price');
    var btns = document.querySelectorAll('.btn_green_steamui, .btn_blue_steamui');
    var dscs = document.querySelectorAll('.discount_pct');
    var roosnya = false;
    var niroosni = ["329f37319a1d6a0c79c67a388414278e3b2996c0.jpg",
                    "329f37319a1d6a0c79c67a388414278e3b2996c0_medium.jpg",
                    "329f37319a1d6a0c79c67a388414278e3b2996c0_full.jpg",
                    "992f3008daabfe9a3a795896a407525ce11b1cc5.jpg",
                    "992f3008daabfe9a3a795896a407525ce11b1cc5_medium.jpg",
                    "992f3008daabfe9a3a795896a407525ce11b1cc5_full.jpg",
                    "5d05c9a196c34e3860fcb34a389c8d0cd6801de8.jpg",
                    "5d05c9a196c34e3860fcb34a389c8d0cd6801de8_medium.jpg",
                    "5d05c9a196c34e3860fcb34a389c8d0cd6801de8_full.jpg"];

    Array.prototype.forEach.call(imgs, function(img) {
        var imgName = img.src.split("/").pop();
        if (!roosnya && niroosni.includes(imgName)) {
            roosnya = true;
            title.innerHTML = `🐷🐶 <font color="red">${oldTitle}</font>`;
            Array.prototype.forEach.call(prices, function(price) {
                var oldPrice = price.innerHTML;
                price.innerHTML = `<font color="red">${oldPrice}</font> 🐷🐶`;
            });
            Array.prototype.forEach.call(btns, function(btn) {
                btn.classList.remove('btn_green_steamui','btn_blue_steamui');
                btn.classList.add('btn_red_steamui');
            });
            Array.prototype.forEach.call(dscs, function(dsc) {
                dsc.classList.remove('discount_pct');
                dsc.classList.add('discount_pct_red');
            });
        };
    });

    // add elements to the top right corner
    var hub = document.getElementsByClassName("btnv6_blue_hoverfade")[0];
    hub.innerHTML = "\n                    <span>✚</span>\n                ";

    var price = document.createElement("div");
    price.classList.add('btnv6_blue_hoverfade','btn_medium');
    insertAfter(price, hub);

    // check if it's not a demo
    if ((document.getElementsByClassName("game_purchase_action").length > 1) &&
    (document.getElementById("demoGameBtn"))) {
        var priceNode = document.getElementsByClassName("game_purchase_action")[1];
    } else {
        var priceNode = document.getElementsByClassName("game_purchase_action")[0];
    };

    // check if it's not released yet
    if (document.getElementsByClassName("game_area_comingsoon")[0]) {
        var priceText = "В розробці";
        if (roosnya) {
            priceText = `<font color="red">${priceText}</font> 🐷🐶`;
        };
    // check the price if it's been released
    } else if (priceNode.getElementsByClassName("game_purchase_price").length > 0) {
        var priceText = priceNode.getElementsByClassName("game_purchase_price")[0].innerHTML;
        // check if it's a free game
        if (document.getElementById("freeGameBtn")) {
            priceText = `<font color="#beee11">${priceText}</font>`;
        };
    // check if it's on sale
    } else if (priceNode.getElementsByClassName("discount_final_price").length > 0) {
        var priceText = priceNode.getElementsByClassName("discount_final_price")[0].innerHTML;

        var discount = document.createElement("div");
        discount.classList.add('btnv6_blue_hoverfade','btn_medium');
        insertAfter(discount, hub);

        if (roosnya) {
            var discountText = priceNode.getElementsByClassName("discount_pct_red")[0].innerHTML;
            discount.innerHTML = `<span><font color="red">${discountText}</font></span>`;
        } else {
            var discountText = priceNode.getElementsByClassName("discount_pct")[0].innerHTML;
            //discount.innerHTML = `<span><font color="#66cc33">${discountText}</font></span>`;
            discount.innerHTML = `<span><font color="#a3cf06">${discountText}</font></span>`;
            //discount.innerHTML = `<span><font color="#beee11">${discountText}</font></span>`;
        };
        discount.insertAdjacentText('beforebegin', `\n                `);
    } else if ((priceNode.getElementsByClassName("game_purchase_price").length === 0) && 
    (priceNode.getElementsByClassName("btn_addtocart").length > 0)) {
        var priceText = `<font color="#beee11">Безкоштовно</font>`;
    };

    price.innerHTML = `<span>${priceText}</span>`;
    price.insertAdjacentText('beforebegin', `\n                `);

    // add score
    var banner = document.getElementsByClassName("game_header_image_full")[0];
    var banner_parent = banner.parentNode;
    var banner_wrapper = document.createElement('div');
    banner_wrapper.classList.add("image-container");
    banner_parent.replaceChild(banner_wrapper, banner);
    banner_wrapper.appendChild(banner);

    var score_txt = document.getElementsByClassName("user_reviews_summary_row")[1];
    if (!score_txt.hasAttribute("data-tooltip-html")) {
        score_txt = document.getElementsByClassName("user_reviews_summary_row")[0];
    };

    score_txt = score_txt.getAttribute("data-tooltip-html").split('%', 1);

    if (isNumeric(score_txt[0])) {
        var score_int = parseInt(score_txt);

        var score = document.createElement("div");
        score.classList.add('box');
        score.textContent = score_txt;

        if (score_int > 95) {
            score.classList.add('score95');
        } else if (score_int >= 85) {
            score.classList.add('score85');
        } else if (score_int >= 75) {
            score.classList.add('score75');
        } else if (score_int >= 70) {
            score.classList.add('score70');
        } else if (score_int >= 55) {
            score.classList.add('score55');
        };

        banner_wrapper.appendChild(score);
    };
};

// insert html inside a text
// and replace specific part of that text
// i.e. insert a tag inside a text node
// from https://stackoverflow.com/a/29301739
// huy znaye yak vono robe ale krasyvo
var matchText = function(node, regex, callback, excludeElements) { 

    excludeElements || (excludeElements = ['script', 'style', 'iframe', 'canvas']);
    var child = node.firstChild;

    while (child) {
        switch (child.nodeType) {
        case 1:
            if (excludeElements.indexOf(child.tagName.toLowerCase()) > -1)
                break;
            matchText(child, regex, callback, excludeElements);
            break;
        case 3:
            var bk = 0;
            child.data.replace(regex, function(all) {
                var args = [].slice.call(arguments),
                    offset = args[args.length - 2],
                    newTextNode = child.splitText(offset+bk), tag;
                bk -= child.data.length + all.length;

                newTextNode.data = newTextNode.data.substr(all.length);
                tag = callback.apply(window, [child].concat(args));
                child.parentNode.insertBefore(tag, newTextNode);
                child = newTextNode;
            });
            regex.lastIndex = 0;
            break;
        }

        child = child.nextSibling;
    }

    return node;
};

// add spaces before ₴ sign
matchText(document.body, new RegExp("₴", "g"), function(node, match, offset) {
    var hryvnia = document.createElement("span");
    hryvnia.style.cssText += "font-family: 'Calibri Light'; font-weight: bold; font-size: 110%;";
    hryvnia.innerHTML = " ₴";
    return hryvnia;
});

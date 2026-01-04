// ==UserScript==
// @name         Shop Wiz Autopricer
// @namespace https://greasyfork.org/en/users/145271-aybecee
// @version      20250604
// @description  Autopricer
// @license MIT
// @match        https://www.grundos.cafe/market/wizard/*
// @match        https://www.grundos.cafe/market/*
// @match        https://www.grundos.cafe/island/kitchen/accept/
// @match        https://www.grundos.cafe/winter/snowfaerie/accept/
// @match        https://www.grundos.cafe/halloween/witchtower/accept/
// @match        https://www.grundos.cafe/halloween/esophagor/accept/
// @match        https://www.grundos.cafe/games/kadoatery/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM_setValue
// @grant        GM_getValue

// @downloadURL https://update.greasyfork.org/scripts/536954/Shop%20Wiz%20Autopricer.user.js
// @updateURL https://update.greasyfork.org/scripts/536954/Shop%20Wiz%20Autopricer.meta.js
// ==/UserScript==
(function () {
    'use strict';
    var shopWiz = GM_getValue('shopWizKey', {});
    var autoclose = GM_getValue('autocloseKey', false);

    function getRandomInt(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
    }
    function clickNextLink(index = 0) {

        GM_setValue('autocloseKey', true);
        const links = $('a[alt="Shop Wizard Search"]:not(.donezo)');
        if (index < links.length) {
            links[index].click();
            setTimeout(() => {
                clickNextLink(index + 1);
            },  getRandomInt(2500, 3500)); // 10 seconds
        }
        if (index + 1 == links.length) {
            setTimeout(() => {
                new Audio('https://emopets.net/soundfiles/smb3_coin.wav').play();
                shopWiz = GM_getValue('shopWizKey', {});
                updatePRICES(shopWiz)
                var delay_time = $('input.form-control.price[style="background: yellow;"]').length;

                if (delay_time > 0){
                    $('input.form-control.third-width.full-width-mobile[value="Update"]').hide()
                    setTimeout(() => {
                        $('input.form-control.third-width.full-width-mobile[value="Update"]:first').click()
                    }, delay_time * 1000)
                }

                GM_setValue('autocloseKey', false);
            }, 3000)

        }
    }

    function updatePRICES(shopWiz){
        $(`.data.medfont input.form-control.price`).each(function(index){
            var itemName = $(this).parent().prev().prev().prev().find("img").attr("alt");
            //  console.log(itemName)
            //  $(this).parent().append(`<div class="shopWizPrice" item="${itemName}">shopWizPrice</div>`)

            if (typeof shopWiz[itemName] !== 'undefined') {
                var xDate = new Date(shopWiz[itemName]["Last Updated"]);
                var now = new Date();

                // Calculate the difference in milliseconds
                var diff = now - xDate;
                var prev_price = Number($(this).parent().find(`input.form-control.price`).val());
                // console.log(shopWiz[itemName]["Last Updated"])

                // Check if the difference is less than or equal to 2 minutes (2 * 60 * 1000 milliseconds)
                if (diff >= 0 && diff <= 10800000    ) {
                    //     console.log("shopWiz'd within the past 3 hours");
                    $(this).parent().append(`✓`)
                    $(this).parent().prev().prev().prev().prev().find(`a[alt="Shop Wizard Search"]`).attr("class","donezo")

                    if (prev_price !== shopWiz[itemName]["Price"] - 1) {
                        // console.log(prev_price)
                        // console.log(shopWiz[itemName]["Price"] - 1)

                        $(this).css(`background`,`yellow`)
                        if (shopWiz[itemName]["Price"] >= 1) {
                            $(this).parent().find(`input.form-control.price`).val(shopWiz[itemName]["Price"] - 1)

                        }

                        if (prev_price - shopWiz[itemName]["Price"] > 0) {
                            $(this).parent().append(`<div style="color:white;background:black" class="edited_hurr">${prev_price - shopWiz[itemName]["Price"]}</div>`)
                        } else {
                            $(this).parent().append(`<div style="color:white;background:red" class="edited_hurr">${prev_price - shopWiz[itemName]["Price"]}</div>`)
                        }
                    }
                } else {
                    //   console.log(`${itemName} is NOT within the past 2 minutes`);
                }
            }

        })
    }

    if (     window.location.href.includes("/island/kitchen/accept/") ||
        window.location.href.includes("/winter/snowfaerie/accept/") ||
        window.location.href.includes("/halloween/witchtower/accept/") ||
        window.location.href.includes("/halloween/esophagor/accept") ||
        window.location.href.includes("/games/kadoatery/") ){
        GM_setValue('autocloseKey', false);
    }

    if (window.location.href.indexOf(`/market/wizard/`) > -1) {
        if ($(`body`).text().includes('Searching for ...')) {

            shopWiz["test"] = { Price: "5000" };

            var itemName = $(`strong:contains(Searching for ...)`).text();
            itemName = itemName.substring(
                itemName.indexOf("... ") + 4
            );

            //            $(`.sw_mine`).remove();

            var itemPrice = $(`.data:not(.sw_mine) strong:contains( NP):first`).text().replace(",","");
            itemPrice = Number(itemPrice.substring(0,
                                                   itemPrice.lastIndexOf(" NP")
                                                  ));
            var currentTime = new Date();
            console.log(itemName)
            console.log(itemPrice)

            $(`.mt-1`).append(`<br>${itemPrice - 1}`)

            shopWiz[itemName] = {
                "Price": itemPrice,
                "Last Updated": currentTime.toString()
            };
            GM_setValue('shopWizKey', shopWiz);

            if (autoclose) {
                window.top.close();
            }

        }
    }

    if ($(`body:contains(you sell an item, the Neopoints will go into your)`).length == 1 ) {

        $(`.threequarters-width.mobile-full.margin-auto`).after(`<input type="checkbox" id="autoclose" name="autoclose">
<label for="autoclose">auto close</label><div id="autoopen" class="fakebutton">autoopen</div>`)
        $(`.threequarters-width.margin-auto:last`).after(`
<div id="updateprices" class="fakebutton">update prices</div>`)
        $(`#autoclose`).prop('checked', autoclose);


        $(`#autoclose`).change(function(){
            if ($(this).is(':checked')){
                GM_setValue('autocloseKey', true);
            } else {
                GM_setValue('autocloseKey', false);
            }
        })

        updatePRICES(shopWiz)

        $(`#updateprices`).click(function(){
            shopWiz = GM_getValue('shopWizKey', {});
            updatePRICES(shopWiz)
        })
        $(`#autoopen`).click(function(){
            clickNextLink();
        })


        // console.log(shopWiz)

    }
})();

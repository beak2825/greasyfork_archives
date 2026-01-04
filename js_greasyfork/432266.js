// ==UserScript==
// @name         [MR] Popmundo Marketplace
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Marketplace plugin for popmundo players. You can sell your items or look for on sale offers.
// @author       Matt Revolve 1736266
// @match        https://*.popmundo.com/*
// @grant        GM_xmlhttpRequest
// @require https://code.jquery.com/jquery-3.5.1.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/js/all.min.js

// @downloadURL https://update.greasyfork.org/scripts/432266/%5BMR%5D%20Popmundo%20Marketplace.user.js
// @updateURL https://update.greasyfork.org/scripts/432266/%5BMR%5D%20Popmundo%20Marketplace.meta.js
// ==/UserScript==

(function() {

    'use strict';
    const chracter_txt = $("[id$=_ucMenu_lnkCharacter]").text().trim();
    const language = chracter_txt == "Karakter" ? "tr" : (chracter_txt == "Character" ? "en" : "-");
    const available_langs = ["tr","en"];
    const api_base_url = "https://serhatyucel.com";
    //const api_base_url = "http://localhost:3000";
    const language_file = {
        "item_sell_title": { "tr": "Bu Eşyayı Satışa Çıkar", "en": "Put This Item On Sale" },
        "item_sell_description": { "tr": "Söz konusu eşyayı satışa çıkarabilirsiniz. Fiyatını sonradan değiştiremeyeceğinizi unutmayın.<br><br>İlanınız 1 hafta sonra otomatik olarak yayından kaldırılacaktır, satış yapamazsanız tekrar eklemeyi unutmayın.", "en": "You can put this item on sale. Note that you cannot change its price later on.<br><br>Your listing will automatically be removed after a week, don't forget to renew it if you haven't sold it yet." },
        "item_sell_button": { "tr": "Satışa Çıkar!", "en": "Put It On Sale!" },
        "marketplace_title": { "tr": "Eşya Pazarı", "en": "Item Market" },
        "marketplace_description": { "tr": "Aşağıdan bir eşya ismi seçerek, satışa sunulmuş eşyaların listesini görebilirsiniz. Söz konusu eşya satılmış olabilir, lütfen satan kişinin id'si ile eşyanın mevcut sahibinin id'sinin aynı olup olmadığına dikkat edin.", "en": "You can see the list of items available for sale by selecting an item name below. The item might have already been sold, please check if the ID of the current owner of the item is the same with the seller ID." },
        "marketplace_cmb_default": { "tr": "Eşya Seçin", "en": "Select Item" },
        "marketplace_table_seller_col": { "tr": "Satıcı", "en": "Seller" },
        "marketplace_table_date_col": { "tr": "İlan Tarihi", "en": "Listing Date" },
        "error_1": { "tr": "Minimum 100M$ değerinde eşya satabilirsiniz!", "en": "You may sell items at 100M$ value at minimum." },
        "error_2": { "tr": "Geçersiz bir para değeri girdiniz!", "en": "You entered an invalid currency value!" },
        "error_3": { "tr": "Bu eşya zaten satışta!", "en": "This item is already on sale!" },
        "error_4": { "tr": "Bir hata meydana geldi, daha sonra tekrar deneyin!", "en": "An error has occurred, try again later!" },
        "success": { "tr": "Eşyayı satışa çıkardınız!", "en": "You have put the item on sale!" }
    };

                    let mr_item_trade_box_html = `
<div class="box ofauto">
        <h2 style="background-image: linear-gradient(to bottom, #000000, #1b1a1a, #2f2e2e, #444343, #5b5959);"><i class="fas fa-shopping-basket"></i> ${language_file.item_sell_title[language]}</h2>
        <p>${language_file.item_sell_description[language]}</p>
        <div id="mr_trade_message"></div>
        <p>
            <input type="number" value="100" min="100" id="mr_item_price" class="width100px round">&nbsp;M$
        </p>
        <p class="actionbuttons"><a href="/World/Popmundo.aspx/Character/1736266"><i class="fas fa-code"></i> Matt Revolve</a> <input type="submit" value="${language_file.item_sell_button[language]}" id="mr_sell_item"></p>
    </div>`;


                    let mr_item_trade_offers_box = `
<div class="box ofauto">
        <h2 style="background-image: linear-gradient(to bottom, #000000, #1b1a1a, #2f2e2e, #444343, #5b5959);"><i class="fas fa-shopping-cart"></i> ${language_file.marketplace_title[language]}</h2>
        <p>${language_file.marketplace_description[language]}</p>
        <div id="mr_trade_message"></div>
        <p>
            <select id="mr_trade_item_names_cmb" class="round rmargin5">
	<option selected="selected" value="-1" disabled>${language_file.marketplace_cmb_default[language]}</option>
</select>
        </p>

        <div id="mr_offer_list_result"></div>
        <p class="actionbuttons" style="margin-top: 20px;"><a href="/World/Popmundo.aspx/Character/1736266"><i class="fas fa-code"></i> Matt Revolve</a></p>
    </div>`;


var mr_item_offers_table = `
<table class="data sortable" id="tablechart">
	<thead>
		<tr>
			<th class="width5 header">#</th>
			<th colspan="2" class="header">${language_file.marketplace_table_seller_col[language]}</th>
			<th class="right">${language_file.marketplace_table_date_col[language]}</th>
		</tr>
	</thead>

	<tbody>
		{{mr_trader_offer_list_tr}}
	</tbod>
</table>`;

    $( document ).ready(function() {
        const url = window.location.href;
        const orig = window.location.origin;

        if(!available_langs.includes(language)) {
            return;
        }

        $("#mnuToolTipShoppingAssistant").before('<li><a href="/World/Popmundo.aspx/Character/ShoppingAssistant"><i class="fas fa-shopping-basket"></i> '+language_file.marketplace_title[language]+'</a></li>')

        if(url.includes("/Character/ItemDetails/") && $("#mnuToolTipImproveCharacter").length != 0) {
            $("#ppm-content > .box:nth-child(3)").after(mr_item_trade_box_html);
         }else if(url.includes("/Character/ShoppingAssistant")) {
             $("#ppm-content  .box:nth-child(4)").before(mr_item_trade_offers_box);
             get_item_names();
         }


         $("#mr_sell_item").on('click', function(event) {
             event.preventDefault();
             sell_item(url);
         });

        $("#mr_trade_item_names_cmb").on('change', function(event) {
             event.preventDefault();
             const item_name_id = $(this).val();
            get_offers(item_name_id);
         });
});

    function sell_item(url) {
        const price = $("#mr_item_price").val().trim();
        const seller_id = $(".idHolder").text().trim();
        const item_id = url.split("/").slice(-1)[0];
        const seller_name = $("[id$=_lnkItemOwner]").text().trim();
        const item_name = $("#ppm-content > .box:nth-child(3) > h2").text().trim();

        const request = {"seller_id": seller_id, "seller_name": seller_name, "item_id": item_id, "item_name": item_name, "price": price, "lang": language};

        if(/^\+?(0|[1-9]\d*)$/.test(price) == false || parseInt(price) < 100) {
            $("#mr_trade_message").html('<div style="border-radius: 7px; background: #ff0000; color: #fff; text-align: center; margin: 10px 0; padding: 10px 0;">'+language_file.error_1[language]+'</div>');
            return;
        }

        GM_xmlhttpRequest ( {
            method:     "POST",
            url:        api_base_url+"/api/popmundo/sell-item",
            data:       JSON.stringify(request),
            headers:    {
                "Content-Type": "application/json"
            },
            onload:     function (res) {
                const response = JSON.parse(res.response);
                console.log(response);
                if(response.status == 0) {
                    $("#mr_trade_message").html('<div style="border-radius: 7px; background: #c30e0e; color: #fff; text-align: center; margin: 10px 0; padding: 10px 0;">'+ language_file['error_'+response.errorCode][language] +'</div>');
                }else{
                    $("#mr_trade_message").html('<div style="border-radius: 7px; background: #4da000; color: #fff; text-align: center; margin: 10px 0; padding: 10px 0;">'+ language_file.success[language] +'</div>');

                }
            }
        } );
    }

    function get_item_names() {
        GM_xmlhttpRequest ( {
            method:     "POST",
            url:        api_base_url+"/api/popmundo/item-names",
            data:       JSON.stringify({"lang":language}),
            headers:    {
                "Content-Type": "application/json"
            },
            onload:     function (res) {
                let response = JSON.parse(res.response);
                response.forEach((element, index) => {
                    $('#mr_trade_item_names_cmb').append($('<option>', {
                        value: element.id,
                        text: element.item_name
                    }));
                });

            }
        } );
    }

    function get_offers(item_name_id) {
        GM_xmlhttpRequest ( {
            method:     "POST",
            url:        api_base_url+"/api/popmundo/offers",
            data:       JSON.stringify({"item_name_id": item_name_id, "lang":language}),
            headers:    {
                "Content-Type": "application/json"
            },
            onload:     function (res) {
                const response = JSON.parse(res.response);
                if (response.status == 0) {
                }else{
                    var tr_list_html = '';
                    response.forEach((element, index) => {
                        const odd_even = (index + 1) % 2 == 0 ? "even": "odd";
                        tr_list_html += `
<tr class="${odd_even}">
	<td>${index+1}</td>
	<td><a href="/World/Popmundo.aspx/Character/${element.seller_id}">${element.seller_name} #${element.seller_id}</a></td>
	<td>${element.price.toLocaleString()} M$</td>
	<td class="right">${element.date}</td>
</tr>
                        `;
                    });
                    const final_out = mr_item_offers_table.replace("{{mr_trader_offer_list_tr}}",tr_list_html);
                    $("#mr_offer_list_result").html(final_out);
                }

            }
        } );
    }



})();
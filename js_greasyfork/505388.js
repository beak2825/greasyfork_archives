// ==UserScript==
// @name         Category detector
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      2024-08-27 12:59
// @author       You
// @description  Hack the system!
// @match        https://web-app-employee.pp-de.metro-marketplace.cloud/seller-support/products/product-data-uploads-v2/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/505388/Category%20detector.user.js
// @updateURL https://update.greasyfork.org/scripts/505388/Category%20detector.meta.js
// ==/UserScript==

function addColumnHeaderForSuggestedCategory () {
    let header = '<th style="color: red;">Suggested categories</th>';
    const table = $('table#pn_id_1-table');
    const tr_th = table.find('thead tr th');
    //const tr_th = table.find('thead tr');
    //debugger;
    const fifth_th = tr_th.eq(4);
    //const parent_td = tr_th.find("div:contains('Product name')").parent('td');
    //$(header).insertAfter(parent_td);
    $(header).insertAfter(fifth_th);
}

function ajaxCall(rowElements, rowIndex) {
    const rowElement = $(rowElements.shift());
    const productName = rowElement.find("div[class*='row-review__product-name']").text().trim();


    $.ajax({
        type: "POST",
        url: 'https://fastapi.title.bi.metro-markets.org/v1/cat_suggestion/',
        data: JSON.stringify({
            "product_title": productName,
            "country": "de"
        }),
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json"
        },
        dataType: 'json',
        success: (categories) => {
            const fourth_td = rowElement.find('td').eq(4);

            let ul_id = 'suggested-categories-'+rowIndex;
            let ul_content = '<ul style="padding: 0; margin: 0;" id="'+ul_id+'"></ul>'
            let ul_element = $(ul_content);


            $.each(categories, function(categoryIndex, category) {
                if (categoryIndex > 2) {
                    return;
                }

                // do something with `item` (or `this` is also `item` if you like)
                //ul_element.append('<li style="margin: 0;">'+category.suggested_categroy_path+' ('+category.suggested_item_type+') '+'</li>');
                ul_element.append('<li style="margin: 0;">'+category.suggested_categroy_path+' <br><span style="color:grey; font-size: 8px">'+category.suggested_item_type+'</span> '+'</li>');
            });

            let td = $('<td></td>');
            //td.append('<b>'+productName+'</b>');
            td.append(ul_element);


            const nameColumnTd = rowElement.find("div[class*='row-review__product-name']").parent('td')
            $(td).insertAfter(nameColumnTd);

            //$(td).insertAfter(fourth_td);
            if (rowElements.length !== 0) {
                ajaxCall(rowElements, ++rowIndex);
            }
        }
    });
}

function addButton() {
    let btn = $('<button id="btn-suggested-category" class="btn btn--primary" type="button">Get suggested categories</button>');
    $('.switch-container__title').append(btn);
    btn.on('click', () => {
        $('#btn-suggested-category').prop("disabled",true);
        addColumnHeaderForSuggestedCategory();

        let rowElements = [];
        $('.row-review__row--pending').each((rowIndex, rowElement) => {
            let element = $(rowElement);
            if (element.find('td').length !== 1) {
                rowElements.push(rowElement);
            }
        });

        ajaxCall(rowElements, 0);
    });
}

jQuery(document).ready(function($) {
    setTimeout(addButton, 5000);
});


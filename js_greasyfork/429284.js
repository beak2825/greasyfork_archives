// ==UserScript==
// @name         Hudu Unfurl
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Unfurl Asset links in place
// @author       You
// @match        https://*.huducloud.com/a/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429284/Hudu%20Unfurl.user.js
// @updateURL https://update.greasyfork.org/scripts/429284/Hudu%20Unfurl.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //check if viewing an asset
    if (document.URL.match('/a/')) {
        //move related items from sidebar to main page
        var current_page_card = document.getElementsByClassName("card card--synced")[0]
        var new_card_sync = document.createElement("div");
        new_card_sync.className = "card card--synced"
        var new_card_header = document.createElement("div");
        new_card_header.className = "card--synced__header"
        new_card_header.innerHTML = '<h1><i class="fas fa-link icon"></i>Related Items</h1>'
        current_page_card.insertAdjacentElement('afterend',new_card_sync)
        new_card_sync.insertAdjacentElement('beforeend',new_card_header)

        var new_card = document.createElement("div");
        new_card.className = "card"
        new_card_sync.insertAdjacentElement('beforeend',new_card)

        var related_sidebar_box = document.getElementsByClassName("asset-sidebar__box")[0]
        if (related_sidebar_box.children.length >0 ) {
            var related_sidebar_box_children = related_sidebar_box.children
            var sidebar_count = related_sidebar_box_children.length
            for (var k = 0; k < sidebar_count; k = k + 2) {
                var new_card_item = document.createElement("div");
                new_card_item.className = "card__item"
                var title_card_item_slot = document.createElement("div")
                title_card_item_slot.className = "card__item-slot"
                var body_card_item_slot = document.createElement("div")
                body_card_item_slot.className = "card__item-slot"
                title_card_item_slot.innerHTML = related_sidebar_box_children[k].children[0].innerHTML;
                var body_inner_html = related_sidebar_box_children[k + 1].innerHTML
                if (body_inner_html.match('<div class="button-group">')){
                    body_inner_html = body_inner_html.replace('<div class="button-group"><a href="" class="button button--small button--secondary"><i class="fas fa-edit"></i></a> <a href="#" class="button button--danger button--small"><i class="fas fa-trash"></i>',"")
                }
                body_card_item_slot.innerHTML = '<div class="field--link">' + body_inner_html.replace("<h3>", '').replace("</h3>", "") +"</div>"
                new_card_item.insertAdjacentElement('beforeend', title_card_item_slot)
                new_card_item.insertAdjacentElement('beforeend', body_card_item_slot)
                new_card.insertAdjacentElement('beforeend',new_card_item)
            }
        }

        //get all asset links
        var link_fields = document.getElementsByClassName("field--link")
        //check if any asset links exist
        if (link_fields.length > 0) {
            // create array of asset links
            var array = []
            for (var i = 0; i < link_fields.length; i++) {
                array.push(link_fields[i])
            }
            //loop through asset links and unfurl
            for (var count = 0; count < array.length; count++) {
                var link_field = array[count]

                if(link_field.parentNode.parentElement.getElementsByClassName("card__item-slot")[0].innerText.match("^SITE$")){
                    continue;
                }
                //create card element
                var cardDiv = document.createElement("div");
                cardDiv.setAttribute('class', "card__info");
                //warp link element in card element
                // `link_field.parentNode` is the element you want to wrap
                var parent = link_field.parentNode;
                // set the wrapper as child (instead of the element)
                parent.replaceChild(cardDiv, link_field);
                // set element as child of wrapper
                cardDiv.appendChild(link_field);

                // add asset link as title
                link_field.classList.add("card__info-title")
                link_field.classList.remove("field--link")
                //create base of card
                var column_Div = document.createElement("div");
                column_Div.setAttribute('class', "card__info-columns");
                link_field.insertAdjacentElement('afterend', column_Div)
                //get html of asset linked
                var link_field_url = link_field.innerHTML.match('(/a/.+)\"')[1]
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.open("GET", link_field_url, false);
                xmlHttp.send(null);
                var linked_asset_html = document.createElement('html');
                linked_asset_html.innerHTML = xmlHttp.responseText

                //get details from linked asset - not integration
                var card = linked_asset_html.getElementsByClassName("card card--synced")[0]
                var card_items = card.getElementsByClassName("card__item")

                //get first 10 fields and add into card
                for (var j = 0; j < card_items.length && j < 10; j++) {

                    //create card section
                    var newSection = document.createElement("section");
                    //create section title
                    var newHeader = document.createElement("header")
                    if (!card_items[j].getElementsByClassName("card__item-slot")[0]){
                        continue;
                    }
                    var newHeaderContent = document.createTextNode(card_items[j].getElementsByClassName("card__item-slot")[0].innerText);
                    //create section value
                    var newMain = document.createElement("main")
                    var mainContent = card_items[j].getElementsByClassName("card__item-slot")[1]
                    //skip if richtext, get text only if embed
                    if (mainContent.innerHTML.match('<div class=\"field\">')) {
                        newMain.innerHTML = card_items[j].getElementsByClassName("card__item-slot")[1].innerText
                    } else if (mainContent.innerHTML.match('field ck-content') || mainContent.innerHTML.match('field field--password-item')) {
                        continue;
                    } else {
                        newMain.innerHTML = card_items[j].getElementsByClassName("card__item-slot")[1].innerHTML
                    }

                    newHeader.appendChild(newHeaderContent);
                    //inset detail into card
                    newSection.insertAdjacentElement('beforeend', newHeader)
                    newSection.insertAdjacentElement('beforeend', newMain)
                    column_Div.insertAdjacentElement('beforeend', newSection)
                }

                //get fields from related side bar and add to card
                var related_sidebar_box = linked_asset_html.getElementsByTagName("relater")[0]
                if (related_sidebar_box.children.length >0 ) {
                    var related_sidebar_box_children = related_sidebar_box.children
                    for (var k = 0; k < related_sidebar_box_children.length && k < 7; k = k + 2) {
                        if (related_sidebar_box_children[k+1].firstElementChild.href == document.URL)
                        {
                            continue;
                        }
                        newSection = document.createElement("section");
                        newHeader = document.createElement("header")
                        newMain = document.createElement("main")
                        newHeader.innerHTML = related_sidebar_box_children[k].children[0].innerHTML;
                        newMain.innerHTML = related_sidebar_box_children[k + 1].innerHTML.replace("<h3>", '<div class ="field--link">').replace("</h3>", "</div>")
                        newSection.insertAdjacentElement('beforeend', newHeader)
                        newSection.insertAdjacentElement('beforeend', newMain)
                        column_Div.insertAdjacentElement('beforeend', newSection)
                    }
                }
            }
        }
    }

})();
// ==UserScript==
// @name         SkinsMonkey Enhanced
// @namespace    https://github.com/OccultismCat/SkinsMonkey-Enhanced/
// @version      0.0.5
// @description  Make improvements to skinsmonkey.com.
// @author       OccultismCat
// @license      CC-BY-ND-4.0
// @github       https://github.com/OccultismCat/SkinsMonkey-Enhanced/
// @homepage     https://greasyfork.org/en/scripts/472727-skinsmonkey-enhanced
// @supportURL   https://github.com/OccultismCat/SkinsMonkey-Enhanced/issues
// @icon         https://skinsmonkey.com/_nuxt/img/logo-mini.96678c5.svg
// @match        https://skinsmonkey.com/free-csgo-skins
// @downloadURL https://update.greasyfork.org/scripts/472727/SkinsMonkey%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/472727/SkinsMonkey%20Enhanced.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const giveaway_join_buttons = [];
    function get_current_time(){
        const current_date = new Date();
        let hours = current_date.getHours() % 12 || 12;
        let minutes = current_date.getMinutes() < 10 ? "0" + current_date.getMinutes() : current_date.getMinutes();
        let seconds = current_date.getSeconds() < 10 ? "0" + current_date.getSeconds() : current_date.getSeconds();
        let am_pm = hours >= 12 ? " PM" : " AM";
        return hours + ':' + minutes + ':' + seconds + am_pm
    }
    function log(text='', element=null){
        const current_time = get_current_time();
        const log_spacer = "_".repeat(current_time.length + 25);
        const log_spacer_bottom = "⎺".repeat(current_time.length + 25);
        const log_text = current_time + ' | [SkinsMonkey-Enhanced]';
        console.log(log_spacer);
        console.log(log_text);
        if (text != '' && text != null && text != undefined){
            console.log(current_time + ' | ' + text);
        }
        if (element != null && element != undefined){
            console.log(element);
        }
        console.log(log_spacer_bottom);
    }
    function log_error(text=''){
        const current_time = get_current_time();
        const log_spacer = "_".repeat(current_time.length + 25);
        const log_spacer_bottom = "⎺".repeat(current_time.length + 25);
        const log_text = current_time + ' | [SkinsMonkey-Enhanced]';
        console.log(log_spacer);
        console.log(log_text);
        if (text != '' && text != null && text != undefined){
            console.error(current_time + ' | ' + text);
        }
        console.log(log_spacer_bottom);
    }
    function locate_element(element){
        if (element != null && element != undefined){
            return true;
        } else {
            return false;
        }
    }
    // { name: '', class: ''},
    const element_classes = [
        { name: 'border', class: 'fa-border'},
        { name: 'bounce', class: 'fa-bounce'},
        { name: 'beat', class: 'fa-beat'},
        { name: 'beat-fade', class: 'fa-beat-fade'},
        { name: 'fade', class: 'fa-fade' },
        { name: 'flip', class: 'fa-flip'},
        { name: 'spin', class: 'fa-spin' },
        { name: 'spin-pulse', class: 'fa-spin-pulse'},
        { name: 'shake', class: 'fa-shake'},
        { name: 'pulse', class: 'fa-pulse'}
    ];
    function get_class(class_name){
        for (const element of element_classes){
            if (element.name === class_name){
                return element.class;
            }
        }
        log_error('[ERROR] | function: get_class() | Unable to find class: "' + class_name + '"')
        return null;
    }
    function create_support_the_developer_title(){
        const free_task_section = document.querySelector("#__layout > div > div.container.free.main > section.free-section.free-tasks");
        if (locate_element(free_task_section) == true){
            var dev_support_title = document.createElement('header');
            dev_support_title.id = 'SkinsMonkey-Enhanced-Dev-Support-Title';
            dev_support_title.style = 'text-align: center; border-color: darkgoldenrod; color: gold; cursor: default; width: 60%; font-family: monospace; font-size: larger; font-variant-caps: petite-caps;';
            dev_support_title.className = 'container ' + get_class('border');
            dev_support_title.textContent = 'Support the developer!';
            free_task_section.insertAdjacentElement('afterbegin', dev_support_title);
        }
    }
    function create_support_the_developer_container(){
        const dev_support_title = document.querySelector('[id="SkinsMonkey-Enhanced-Dev-Support-Title"]')
        if (locate_element(dev_support_title) == true){
            var dev_support_container = document.createElement('div')
            dev_support_container.id = 'SkinsMonkey-Enhanced-Dev-Support-Container';
            dev_support_container.className = 'container base-spinner';
            dev_support_container.style = 'border-color: gold; width: 100%; height: 57px; padding-top: 5px;';
            dev_support_title.insertAdjacentElement('afterend', dev_support_container)
        }
    }
    function create_join_discord_server_button(){
        const discord_server_invite = 'http://tiny.cc/OCDS';
        const discord_image_url = 'https://media.discordapp.net/attachments/1137001499021541507/1138677278285504534/discord-icon.png';
        const dev_support_container = document.querySelector('[id="SkinsMonkey-Enhanced-Dev-Support-Container"]');
        // check if button exists
        if (locate_element(dev_support_container) == true){
            var join_discord_button = document.createElement('button');
            // onclick event
            join_discord_button.onclick = function (){
                join_discord_button.disabled = true;
                join_discord_button.style.cursor = 'default'
                join_discord_button.style.color = 'red';
                join_discord_button_icon.classList.remove(get_class('fade'))
                join_discord_button_icon.classList.add(get_class('beat'))
                window.open(discord_server_invite, '_blank');
                // reset onclick changes
                setTimeout(function (){
                    join_discord_button.disabled = false;
                    join_discord_button.style.cursor = 'pointer'
                    join_discord_button.style.color = 'darkgoldenrod'
                    join_discord_button_icon.classList.remove(get_class('beat'))
                    join_discord_button_icon.classList.add(get_class('fade'))
                }, 1000 * 10)
            }
            join_discord_button.id = 'SkinsMonkey-Enhanced-Discord-Server-Button';
            join_discord_button.textContent = '';
            join_discord_button.style = 'cursor: pointer;color: darkgoldenrod;background-color: black;font-variant: petite-caps;border-color: currentcolor;vertical-align: super; margin-right: 1%;';
            join_discord_button.className = 'fa-2xs';
            join_discord_button.classList.add(get_class('border'));
            dev_support_container.appendChild(join_discord_button)
            // create discord button image
            var join_discord_button_icon = document.createElement('img');
            join_discord_button_icon.classList.add(get_class('fade'));
            join_discord_button_icon.setAttribute('src', discord_image_url);
            join_discord_button_icon.style = 'height: 40px; width: 40px';
            join_discord_button.appendChild(join_discord_button_icon);
        }
    }
    function create_steam_trade_offer_button(){
        const steam_trade_offer_url = 'http://tiny.cc/OCTO'
        const steam_trade_offer_image_url = 'https://media.discordapp.net/attachments/1137001499021541507/1138802804190883870/steam-icon.png'
        const dev_support_container = document.querySelector('[id="SkinsMonkey-Enhanced-Dev-Support-Container"]')
        // check if button exists
        if (locate_element(dev_support_container) == true){
            // create trade offer button
            var trade_offer_button = document.createElement('button')
            // onclick event
            trade_offer_button.onclick = function (){
                trade_offer_button.disabled = true;
                trade_offer_button.style.cursor = 'default';
                trade_offer_button.style.color = 'red';
                trade_offer_button_image.classList.remove(get_class('fade'))
                trade_offer_button_image.classList.add(get_class('beat'))
                window.open(steam_trade_offer_url, '_blank')
                // reset onclick changes
                setTimeout(function (){
                    trade_offer_button.disabled = false;
                    trade_offer_button.style.cursor = 'pointer'
                    trade_offer_button.style.color = 'darkgoldenrod';
                    trade_offer_button_image.classList.remove(get_class('beat'))
                    trade_offer_button_image.classList.add(get_class('fade'))
                }, 1000 * 10)
            }
            trade_offer_button.id = 'SkinsMonkey-Enhanced-Steam-Trade-Offer-Button'
            trade_offer_button.className = 'fa-2xs fa-border'
            trade_offer_button.style = 'cursor: pointer; color: darkgoldenrod; background-color: black; font-variant: petite-caps; border-color: currentcolor; vertical-align: super; margin-right: 1%;'
            dev_support_container.appendChild(trade_offer_button)
            // create trade offer button image
            var trade_offer_button_image = document.createElement('img')
            trade_offer_button_image.id = 'SkinsMonkey-Enhanced-Trade-Offer-Button-Image'
            trade_offer_button_image.className = get_class('fade')
            trade_offer_button_image.style = 'height: 40px; width: 40px;';
            trade_offer_button_image.setAttribute('src', steam_trade_offer_image_url);
            trade_offer_button.appendChild(trade_offer_button_image);
        }
    }
    function create_support_the_developer_disable_button(){
        const disable_button_image_url = 'https://media.discordapp.net/attachments/1137001499021541507/1138844647897190400/exit-icon.png';
        const dev_support_container = document.querySelector('[id="SkinsMonkey-Enhanced-Dev-Support-Container"]');
        const dev_support_title = document.querySelector("#SkinsMonkey-Enhanced-Dev-Support-Title")
        if (locate_element(dev_support_container) == true){
            var disable_button = document.createElement('button');
            disable_button.onclick = function (){
                dev_support_container.style.display = 'none';
                dev_support_title.style.display = 'none';
            }
            disable_button.id = 'SkinsMonkey-Enhanced-Support-The-Developer-Disable-Button';
            disable_button.textContent = '';
            disable_button.className = 'fa-2xs ' + get_class('border');
            disable_button.style = 'cursor: pointer; color: red; background-color: black; border-color: currentcolor; vertical-align: super;';
            dev_support_container.appendChild(disable_button)
            var disable_button_image = document.createElement('img');
            disable_button_image.id = 'SkinsMonkey-Enhanced-Support-The-Developer-Disable-Button-Image';
            disable_button_image.className = '';
            disable_button_image.style = 'height: 40px; width: 40px;';
            disable_button_image.setAttribute('src', disable_button_image_url);
            disable_button.appendChild(disable_button_image)
        }
    }
    function create_support_the_developer_elements(){
        create_support_the_developer_title();
        create_support_the_developer_container();
        create_join_discord_server_button();
        create_steam_trade_offer_button();
        create_support_the_developer_disable_button();
    }
    window.addEventListener('load', () => {
        console.clear()
        // OccultismCat's "Support the developer" buttons. 
        create_support_the_developer_elements();
        // SkinsMonkey-Enhanced Code
        const page_background = document.querySelector("#__layout > div")
        if (locate_element(page_background) == true){
            page_background.style = 'background-color: black;'
        }
        const giveaway_grid = document.querySelector("#__layout > div > div.container.free.main > section.free-section.free-giveaways > div.free-section__body > div")
        if (locate_element(giveaway_grid) == true){
            var giveaway_array = Array.from(giveaway_grid.children)
            giveaway_array.forEach(function(giveaway){
                var giveaway_item_image = giveaway.children[0]
                if (locate_element(giveaway_item_image) == true){
                    giveaway_item_image.children[0].setAttribute('src', 'https://media.discordapp.net/attachments/1137001499021541507/1138521096610643990/skinsmonkey-icon.png')
                    giveaway_item_image.children[1].className = 'container fa-beat free-giveaway-image__main item-image loaded';
                }
                var giveaway_join_button = giveaway.children[1].children[1].children[1]
                giveaway_join_buttons.push(giveaway_join_button)
                var giveaway_enhanced_button = document.createElement('button')
                giveaway_enhanced_button.textContent = 'Auto Join'
                giveaway_enhanced_button.style = 'cursor: pointer;color: green;background-color: black;width: 100%;height: 15%;font-variant: petite-caps;border-color: currentColor;'
                giveaway_enhanced_button.className = 'fa-border fa-xl noUi-base'
                giveaway_enhanced_button.onclick = function (){
                    var joined_giveaway = false
                    var joined_giveaway_free_entry = false
                    var joined_giveaway_email_entry = false
                    giveaway_enhanced_button.textContent = 'Joining Giveaway...'
                    giveaway_enhanced_button.style.color = 'gold'
                    giveaway_join_button.click();
                    var join_entries = setInterval(function (){
                        if (joined_giveaway != true){
                            var giveaway_entries_list = document.querySelector("#__layout > div > div.modal.modal--free-giveaway > div > div > div > div > div.modal-free-giveaway.modal__core > div.modal-body.modal-free-giveaway__body > div.expand-multiple > div > div.free-giveaway-requirements__body")
                            if (locate_element(giveaway_entries_list) == true){
                                var giveaway_entries_list_free_entry = giveaway_entries_list.children[0]
                                if (locate_element(giveaway_entries_list_free_entry.children[0]) == true){
                                    giveaway_entries_list_free_entry.children[0].style = 'background-color: black;'
                                    giveaway_entries_list_free_entry.children[0].click();
                                    setTimeout(function (){
                                        var giveaway_entries_list_free_entry_claim_button = giveaway_entries_list_free_entry.children[1].children[0].children[1].children[0].children[0]
                                        var close_giveaway_list_button = document.querySelector("#__layout > div > div.modal.modal--free-giveaway > div > div > div > div > div.modal__close")
                                        if (locate_element(giveaway_entries_list_free_entry_claim_button) == true){
                                            //console.log(giveaway_entries_list_free_entry_claim_button)
                                            if (giveaway_entries_list_free_entry_claim_button.textContent.match(/Next Claim/) != null){
                                                giveaway_entries_list_free_entry_claim_button.style = 'background-color: red;';
                                                giveaway_enhanced_button.textContent = giveaway_entries_list_free_entry_claim_button.textContent;
                                                giveaway_enhanced_button.style.color = 'red';
                                            } else {
                                                giveaway_entries_list_free_entry_claim_button.style = 'background-color: gold;';
                                                giveaway_enhanced_button.textContent = 'Joined Giveaway!';
                                                giveaway_enhanced_button.style.color = 'gold';
                                                giveaway_entries_list_free_entry_claim_button.click();
                                            }
                                            setTimeout(function() {
                                                close_giveaway_list_button.click();
                                            }, 1000)
                                        }
                                    }, 250)
                                joined_giveaway = true
                                }
                            }
                        } else {
                            clearInterval(join_entries);
                        }
                    }, 500)
                }
                giveaway.appendChild(giveaway_enhanced_button)
            })
        }
    })
})();
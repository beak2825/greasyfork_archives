// ==UserScript==
// @name         SteamGifts-Enhanced-Giveaways
// @namespace    https://github.com/OccultismCat/SteamGifts-Enhanced-Giveaways/
// @version      0.0.1
// @description  A Userscript created for the website SteamGifts.com. This script has a numerous amount of QoL additions, changes, fixes, user customization, better site navigation.
// @author       OccultismCat
// @license      CC-BY-ND-4.0
// @github       https://github.com/OccultismCat/SteamGifts-Enhanced-Giveaways/
// @homepage     https://greasyfork.org/en/scripts/475287-steamgifts-enhanced-giveaways
// @supportURL   https://github.com/OccultismCat/SteamGifts-Enhanced-Giveaways/issues
// @icon         https://cdn.steamgifts.com/img/favicon.ico
// @match        https://www.steamgifts.com
// @match        https://www.steamgifts.com/*
// @downloadURL https://update.greasyfork.org/scripts/475287/SteamGifts-Enhanced-Giveaways.user.js
// @updateURL https://update.greasyfork.org/scripts/475287/SteamGifts-Enhanced-Giveaways.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function edit_body(){
        var site_body = document.querySelector("body");
        if (site_body){
            site_body.style = 'zoom: 70%;';
            console.debug('Finished customizing "Body" element!');
        };
    }
    function go_to_new_giveaways(){
        if (location.href !== 'https://www.steamgifts.com/giveaways/search?type=new'){
            location.href = 'https://www.steamgifts.com/giveaways/search?type=new'
        }
    }
    function go_to_previous_page(){
        var previous_page_button = document.querySelectorAll('[class="fa fa-angle-left"]')[1];
        if (previous_page_button){
            console.debug('Going to previous page: ' + previous_page_button.parentElement.href);
            //previous_page_button.parentElement.click();
        }
    }
    function go_to_next_page(){
        var next_page_button = document.querySelectorAll('[class="fa fa-angle-right"]')[1];
        if (next_page_button){
            console.debug('Going to next page: ' + next_page_button.parentElement.href)
            next_page_button.parentElement.click();
        }
    }
    function refresh_site(){
        console.debug('Reloading page: ' + location.href)
        location.reload();
    }
    function create_auto_refresh(count){
        var refresh_counter = 1;
        const auto_refresh = setInterval(function(){
            if (refresh_counter <= count){
                console.debug('Auto-Refresh: ' + refresh_counter + '/' + count + ' | ' + location.href);
                refresh_counter += 1;
            } else {
                refresh_site();
                clearInterval(auto_refresh);
            }
        }, 1000);
    }
    function remove_bundle_ads(){
        var bundle_ads = document.querySelector('[class="fanatical_container vertical"]')
        if (bundle_ads){
            bundle_ads.remove();
        }
    }
    function edit_featured_giveaway(){
        var featured_giveaway = document.querySelector('[class="featured__inner-wrap"]')
        if (featured_giveaway){
            featured_giveaway.style = 'height: 200px;'
            featured_giveaway.id = 'SteamGifts-Enhanced-Giveaways-Featured-Giveaway'
        }
    }
    function customize_sidebar(){
        var sidebar = document.querySelector('[class="page__inner-wrap"]');
        if (sidebar){
            sidebar.children[0].children[0].style = ''; //'display: none;';
            console.debug('Finished customizing "Sidebar" element!');
        }
    }
    function get_current_points(){
        var points = document.querySelector('[class="nav__points"]');
        if (points){
            return (points.textContent);
        }
    }
    function get_current_giveaways(){
        var giveaways = document.querySelectorAll('[class="giveaway__row-outer-wrap"]')
        if (giveaways){
            return Array.from(giveaways);
        }
    }
    function create_auto_join_button(){
        var giveaways = get_current_giveaways();
        if (giveaways){
            giveaways.forEach(function(giveaway){
                // create steamgifts-enhanced-giveaways container
                var steamgifts_enhanced_giveaways_container = document.createElement('div');
                steamgifts_enhanced_giveaways_container.id = 'steamgifts_enhanced_giveaways_container'
                steamgifts_enhanced_giveaways_container.style = 'font-size: 16px; font-variant: all-small-caps; align-self: center; text-align: center;';
                steamgifts_enhanced_giveaways_container.className = 'container';
                steamgifts_enhanced_giveaways_container.textContent = ''
                giveaway.children[0].insertAdjacentElement('afterbegin', steamgifts_enhanced_giveaways_container);
                // create auto join giveaway button
                var auto_join_giveaway_button = document.createElement('button')
                auto_join_giveaway_button.style = 'cursor: pointer; color: green; background-color: black;'
                auto_join_giveaway_button.textContent = '\u2800Join\u2800'
                auto_join_giveaway_button.onclick = function(){
                    begin_auto_join_giveaway(giveaway);
                }
                steamgifts_enhanced_giveaways_container.appendChild(auto_join_giveaway_button);
                // create current points text
                var current_points_text = document.createElement('h1');
                current_points_text.style = 'color: black;';
                current_points_text.textContent = 'Balance:';
                steamgifts_enhanced_giveaways_container.appendChild(current_points_text);
                // create current points amount
                var current_points_amount = document.createElement('span');
                current_points_amount.style = 'color: darkgoldenrod; font-family: math; font-size: large; letter-spacing: 1px;'
                current_points_amount.textContent = ' ' + get_current_points() + '';
                current_points_text.append(current_points_amount);
            })
        }
    }
    function begin_auto_join_giveaway(giveaway){
        console.debug('Joining Giveaway!')
        sessionStorage.setItem('auto_join_giveaway', giveaway.getAttribute('data-game-id'))
        giveaway.children[0].children[1].children[0].children[0].click();
    }
    function finish_auto_join_giveaway(){
        var auto_join_giveaway = sessionStorage.getItem('auto_join_giveaway');
        if (auto_join_giveaway){
            var timeout_counter = 0
            var enter_giveaway_button = document.querySelector('[data-do="entry_insert"]');
            var not_enough_points_button = document.querySelector('[class="sidebar__error is-disabled"]');
            if (not_enough_points_button){
                console.debug("You don't have enough points to join this giveaway!");
                setTimeout(function(){
                    history.back();
                }, 500)
            }
            if (enter_giveaway_button){
                enter_giveaway_button.click();
                console.debug('Joining Giveaway! | ' + window.location.href)
                const joining_giveaway = setInterval(function(){
                    var leave_giveaway_button = document.querySelector('[data-do="entry_delete"]');
                    // If the button doesn't work, make a timeout timer to clear the interval.
                    if ((timeout_counter / 10) >= 3){
                        console.debug('Unable to find "leave_giveaway_button" before timeout! | Max timeout reached: ' + timeout_counter / 10 + ' Sec/s');
                        history.back();
                        clearInterval(joining_giveaway);
                    } else if (timeout_counter / 10 == 1 || timeout_counter / 10 == 2){
                        console.debug('Current Timeout: ' + timeout_counter / 10 + ' Sec/s')
                    }
                    // If the button does work, check for leave giveaway button then take the user back to the previous website page.
                    if (leave_giveaway_button){
                        if (leave_giveaway_button.className === 'sidebar__entry-delete'){
                            console.debug('Joined Giveaway!')
                            history.back();
                            clearInterval(joining_giveaway);
                        }
                    }
                    timeout_counter += 1
                }, 100)
            }
            sessionStorage.removeItem('auto_join_giveaway')
        }
    }
    const website_links = {
        giveaway_pages: {
            regex_match: /^https:\/\/www\.steamgifts\.com\/giveaways\/search\?page=.*/,
            array_match: [
                'https://www.steamgifts.com/',
                'https://www.steamgifts.com/giveaways/search/.*',
                'https://www.steamgifts.com/giveaways/search?type=wishlist',
                'https://www.steamgifts.com/giveaways/search?type=recommended',
                'https://www.steamgifts.com/giveaways/search?copy_min=2',
                'https://www.steamgifts.com/giveaways/search?dlc=true',
                'https://www.steamgifts.com/giveaways/search?type=group',
                'https://www.steamgifts.com/giveaways/search?type=new',
            ]
        },
        giveaway_page: {
            regex_match: /^https:\/\/www\.steamgifts\.com\/giveaway\/.*/
        }
    }
    window.addEventListener('load', () => {
        console.clear();
        console.debug('SteamGifts-Enhanced-Giveaways Loaded!\n\u2800');
        // make function's that checks for the links & excute corresponding funtion's to shortern the code below
        if (website_links.giveaway_pages.array_match.includes(window.location.href) || window.location.href.match(website_links.giveaway_pages.regex_match)){
            edit_body();
            customize_sidebar();
            edit_featured_giveaway();
            remove_bundle_ads();
            create_auto_join_button();
            create_auto_refresh(30);
        }
        if (window.location.href.match(website_links.giveaway_page.regex_match)){
            console.debug(sessionStorage.getItem('auto_join_giveaway'))
            finish_auto_join_giveaway();
        }
    })
})();
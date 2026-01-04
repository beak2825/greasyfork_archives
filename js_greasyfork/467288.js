// ==UserScript==
// @name         PrimeWire.mx Enhanced
// @namespace    https://github.com/OccultismCat/PrimeWire-Enhanced/
// @version      0.0.9
// @description  Make improvements to primewire.mx website.
// @author       OccultismCat
// @license      CC-BY-ND-4.0
// @github       https://github.com/OccultismCat/PrimeWire-Enhanced
// @homepage     https://greasyfork.org/en/scripts/467288-primewire-enhanced-github
// @supportURL   https://github.com/OccultismCat/PrimeWire-Enhanced/issues
// @icon         https://img.primewire.mx/xxrz/100x100/100/6b/7f/6b7f3c90b5c755ee097086a92182f144/6b7f3c90b5c755ee097086a92182f144.png
// @match        https://primewire.mx/watch-tv/*
// @match        https://primewire.mx/watch-movie/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/467288/PrimeWiremx%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/467288/PrimeWiremx%20Enhanced.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const watch_movie_pattern = /^https:\/\/primewire\.mx\/watch-movie\//;

    function log(text) {
        log('[PrimeWire-Enhanced]\n' + text);
    }

    function log_alert(text) {
        alert('[PrimeWire-Enhanced]\n' + text);
    }

    function start_loop(func, int) {
        setInterval(function () {
            func();
        }, int)
    }

    function remove_element(element) {
        if (element != null && element != undefined) {
            element.remove();
            //log_alert('[Press or Hold "ESC" Key To Quickly Read Alerts!]\n\n[Removing element]\n' + element.innerHTML);
        }
    }

    function remove_elements() {
        const share_popup = document.querySelector('[class="text-close"]');
        const ad_video = document.querySelector("#content-episodes > div > div > video")
        const movie_header = document.querySelector('[id="header"]');
        const movie_top_navigation_bar = document.querySelector('[class="prebreadcrumb"]');
        const movie_synopsis = document.querySelector('[class="block_area block_area_home section-description"]');
        const movie_discription = document.querySelector('[class="block_area block_area_home section-detail mb-0"]');
        const movie_top_removed_imgur_image = document.querySelector('[id="hgiks-top"]');
        const movie_player_rating_bar = document.querySelector('[class="watching_player-control"]');
        const movie_removed_imgur_image = document.querySelector('[id="hgiks-middle"]');
        const movie_you_may_also_like = document.querySelector('[class="film_related film_related-list"]');
        const movie_navigation = document.querySelector('[class="f2r-left"]');
        const movie_footer = document.querySelector('[id="footer"]');
        const movie_blank_footer = document.querySelector('[id="st-1"]');
        const movie_episodes = document.querySelector('[id="content-episodes"]');
        if (share_popup != null) {
            share_popup.click();
        }
        if (watch_movie_pattern.test(window.location.href)){
            remove_element(movie_episodes)
        }
        remove_element(ad_video);
        remove_element(movie_header);
        remove_element(movie_top_navigation_bar);
        remove_element(movie_synopsis);
        remove_element(movie_discription);
        remove_element(movie_top_removed_imgur_image);
        remove_element(movie_player_rating_bar);
        remove_element(movie_removed_imgur_image);
        remove_element(movie_you_may_also_like);
        remove_element(movie_navigation);
        remove_element(movie_footer);
        remove_element(movie_blank_footer);
    }

    function customize_elements() {
        const movie_alert_banner = document.querySelector('[class="alert mb-3"]');
        const movie_player_area = document.querySelector('[class="watching_player-area"]');
        const movie_watch_block = document.querySelector('[id="watch-block"]');
        const movie_episodes = document.querySelector('[id="content-episodes"]');
        const background_watch_block = document.querySelector('[class="detail_page-servers"]');
        const background_episodes = document.querySelector('[class="seasons-list seasons-list-new border-bottom-block"]');
        const background_page = document.querySelector('[id="wrapper"]');
        if (movie_alert_banner != null){
            movie_alert_banner.textContent = '[PrimeWire.mx-Enhanced]'
            movie_alert_banner.style.background = 'red'
        }
        if (movie_player_area != null){
            // Will be adding buttons to switch sizes in the future.
            movie_player_area.setAttribute('style', 'transform: translateY(-192px); height: 846px;') // 1920, 1080: Half Window | 
            // 1920, 1080: Full Window | movie_player_area.setAttribute('style', 'transform: translateX(-610px) translateY(-252px); width: 1900px; height: 860px;')
        }
        if (movie_episodes != null){
            movie_episodes.setAttribute('style', 'transform: translateY(-101px);');
        }
        if (movie_watch_block != null){
            movie_watch_block.setAttribute('style', 'transform: translateY(745px);');
        }
        if (background_watch_block != null){
            background_watch_block.setAttribute('style', 'background: black;')
        }
        if (background_episodes != null){
            background_episodes.setAttribute('style', 'background: black;')
        }
        if (background_page != null){
            background_page.setAttribute('style', 'background: black;')
        }
    }

    function remove_scripts(){
        var scripts = document.getElementsByTagName('script');
        for (var i = 0; i < scripts.length; i++) {
            var src = scripts[i].src
            var type = scripts[i].type
            if (src != null && src != '' && src != undefined){
                if (type != null && type != '' && type != undefined){
                    log(src + '\n\n' + type)
                }
            }
        }
    }

    window.addEventListener("load", () => {
        if (document.readyState == 'complete'){
            log_alert("\nAlerts bypass PrimeWire's scripts to load this script!\n\nPress 'OK' or 'ESC' to continue!")
            remove_elements();
            setTimeout(customize_elements, 1000)
            //customize_elements();
        }
        //start_loop(remove_scripts);
    })
})();
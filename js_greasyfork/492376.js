// ==UserScript==
// @name         Canvas Sidebar Hider
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hides extra buttons on canvas sidebar
// @author       ximwkz
// @match        https://garlandisd.instructure.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instructure.com
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492376/Canvas%20Sidebar%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/492376/Canvas%20Sidebar%20Hider.meta.js
// ==/UserScript==

let menu = {
    options: {
        active: true
    },
    $run: function() {
        if (!menu.active) {
            menu.active = true
            console.log('Mod Menu: Notifications have been reinstated.')
            $$antiNotification(false)
            $$declutter(false)
        }
        else {
            menu.active = false
            console.log('Mod Menu: Notifications have been hidden.')
            $$antiNotification(true)
            $$declutter(true)
        }

    },

}

var $$antiNotification = function(type) {
    if (type) {
        document.querySelector("#global_nav_conversations_link>.menu-item-icon-container>.menu-item__badge").style.display = 'none'
    }
    else {
        document.querySelector("#global_nav_conversations_link>.menu-item-icon-container>.menu-item__badge").style.display = 'block'
    }
    
}

var $$declutter = function(type) {
    
    if (type) {
        document.getElementById("global_nav_conversations_link").style.display          = 'none'
        document.getElementById("global_nav_history_link").style.display                = 'none'
        document.getElementById("global_nav_help_link").style.display                   = 'none'
        document.getElementById("context_external_tool_85_menu_item").style.display     = 'none'
        document.getElementById("global_nav_calendar_link").style.display               = 'none'
    }
    else {
        document.getElementById("global_nav_conversations_link").style.display          = 'block'
        document.getElementById("global_nav_history_link").style.display                = 'block'
        document.getElementById("global_nav_help_link").style.display                   = 'block'
        document.getElementById("context_external_tool_85_menu_item").style.display     = 'block'
        document.getElementById("global_nav_calendar_link").style.display               = 'block'
    }

}

window.onload = () => {

    function createbutton() {

        var menuButton = document.createElement('li')
        menuButton.innerHTML = `
        <li class="menu-item ic-app-header__menu-list-item">
            <a id="global_nav_tampermonkey" role="button" href="#" class="ic-app-header__menu-list-link">
                <div class="menu-item-icon-container" aria-hidden="true">
                    <svg fill="#ffffff" width="800px" height="800px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg">
                        <path d="M243.65527,126.37561c-.33886-.7627-8.51172-18.8916-26.82715-37.208-16.957-16.96-46.13281-37.17578-88.82812-37.17578S56.12891,72.20764,39.17188,89.1676c-18.31543,18.31641-26.48829,36.44531-26.82715,37.208a3.9975,3.9975,0,0,0,0,3.249c.33886.7627,8.51269,18.88672,26.82715,37.19922,16.957,16.95606,46.13378,37.168,88.82812,37.168s71.87109-20.21191,88.82812-37.168c18.31446-18.3125,26.48829-36.43652,26.82715-37.19922A3.9975,3.9975,0,0,0,243.65527,126.37561Zm-32.6914,34.999C187.88965,184.34534,159.97656,195.99182,128,195.99182s-59.88965-11.64648-82.96387-34.61719a135.65932,135.65932,0,0,1-24.59277-33.375A135.63241,135.63241,0,0,1,45.03711,94.61584C68.11133,71.64123,96.02344,59.99182,128,59.99182s59.88867,11.64941,82.96289,34.624a135.65273,135.65273,0,0,1,24.59375,33.38379A135.62168,135.62168,0,0,1,210.96387,161.37463ZM128,84.00061a44,44,0,1,0,44,44A44.04978,44.04978,0,0,0,128,84.00061Zm0,80a36,36,0,1,1,36-36A36.04061,36.04061,0,0,1,128,164.00061Z"/>
                    </svg>
                </div>
                <div class="menu-item__text">Show / Hide</div>
            </a>
        </li>
        `
        document.querySelector(".ic-app-header__menu-list").appendChild(menuButton)
        menuButton.addEventListener('click', function() {menu.$run()})

    }
    (function(){
        createbutton()
        $$antiNotification(true)
        $$declutter(true)
    }());

}

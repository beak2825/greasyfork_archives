// ==UserScript==
// @name         Popmundo Tooltips
// @name:tr      Popmundo Kısayollar
// @namespace    http://tampermonkey.net/
// @version      1.3.3
// @description  Adds useful tooltips to characters, locales, cities and artists that provides quick shortcuts.
// @description:tr Sayfadaki karakter, mekan, şehir ve sanatçılara kısayollar sağlayan açılır mini bir menü ekler.
// @author       Faun Fangorn
// @match        https://*.popmundo.com/*
// @icon         https://www.google.com/s2/favicons?domain=popmundo.com
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://unpkg.com/@popperjs/core@2
// @require https://unpkg.com/tippy.js@6
// @require https://unpkg.com/@popperjs/core@2/dist/umd/popper.min.js
// @require https://unpkg.com/tippy.js@6/dist/tippy-bundle.umd.js
// @require https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/js/all.js
// @resource animation https://unpkg.com/tippy.js@6/animations/perspective.css
// @resource theme https://unpkg.com/tippy.js@6/themes/material.css
// @downloadURL https://update.greasyfork.org/scripts/431497/Popmundo%20Tooltips.user.js
// @updateURL https://update.greasyfork.org/scripts/431497/Popmundo%20Tooltips.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Styles
    const animation = GM_getResourceText("animation");
    GM_addStyle(animation);
    const theme = GM_getResourceText("theme");
    GM_addStyle(theme);

    const addStyle = function(style) {
        const styleEl = document.createElement('style');
        styleEl.textContent = style;
        document.head.append(styleEl);
    }

    addStyle(`
    .tooltip-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    }
     
    .tooltip-option {
    margin-top: 5px !important;
    margin-bottom: 5px !important;
    padding-left: 10px !important;
    padding-right: 10px !important;
    border-right: 1px solid white !important;
    color: #b9b9b9 !important;
    transition: all 0.2s ease-in-out !important;
    }
     
    .tooltip-option:hover {
    text-decoration: none !important;
    color: #fff !important;
    }
     
    .tooltip-option:first-of-type {
    padding-left: 0 !important;
    }
     
    .tooltip-option:last-of-type {
    padding-right: 0 !important;
    border-right: none !important;
    }
     
    `);
    // Tippy configurations
    tippy.setDefaultProps({
        delay: [500,200],
        interactive: true,
        interactiveBorder: 10,
        allowHTML: true,
        animation: "perspective",
        theme: "material"});

    // DOM Selectors
    const allLinks = document.querySelectorAll('#ppm-content a');

    // Select all the characters on the page.
    const characterLinks = Array.from(allLinks).filter(link => {
        return /World\/Popmundo.aspx\/Character\/\d+/.test(link.href);
    });

    // Check if user wants to move to the locale.
    if (document.location.href.indexOf("Popmundo.aspx/Locale") !== -1 && document.location.hash.indexOf("moveto") !== -1) {
        // On a locale page and someone wants to move here
        const moveToLink = document.querySelector("#ppm-sidemenu a[href*='MoveToLocale']");
        if (moveToLink) {
            moveToLink.click();
        } else {
            const notification = document.querySelector(".notification-loading")
            notification.classList.remove("notification-loading")
            notification.classList.add("notification-error")
            notification.innerText = "This locale is in another city."
        }
    }

    // Add tooltip to characers.
    characterLinks.forEach((link) => {
        const charID = link.pathname.split(/\/World\/Popmundo.aspx\/Character\//)[1]
        const urlCall = "/World/Popmundo.aspx/Interact/Phone/"
        const urlMsg = "/World/Popmundo.aspx/Conversations/Conversation/"
        const urlItem = "/World/Popmundo.aspx/Character/OfferItem/"

        const callButton = document.createElement("a");
        callButton.classList.add("tooltip-option");
        const callSVG = document.createElement("a");
        callSVG.classList.add("fas", "fa-phone")
        callButton.append(callSVG);
        callButton.href = urlCall+charID
        callButton.title = "Call"

        const itemButton = document.createElement("a");
        itemButton.classList.add("tooltip-option");
        const itemSVG = document.createElement("a");
        itemSVG.classList.add("fas", "fa-gift")
        itemButton.append(itemSVG);
        itemButton.href = urlItem+charID
        itemButton.title = "Offer Item"

        const msgButton = document.createElement("a");
        msgButton.classList.add("tooltip-option");
        const msgSVG = document.createElement("a");
        msgSVG.classList.add("fas", "fa-envelope");
        msgButton.append(msgSVG);
        msgButton.href = urlMsg+charID
        msgButton.title = "Message"

        const container = document.createElement("div");
        container.classList.add("tooltip-container")
        container.append(callButton, msgButton, itemButton);

        tippy(link, {
            content: container});
    })

    // Select all the locales on the page.
    const localeLinks = Array.from(allLinks).filter(link => {
        return /World\/Popmundo.aspx\/Locale\/\d+/.test(link.href);
    });

    // Add tooltip to locales.
    localeLinks.forEach((link) => {
        const localeID = link.pathname.split(/\/World\/Popmundo.aspx\/Locale\//)[1]
        const urlMove = "/World/Popmundo.aspx/Locale/MoveToLocale/"
        const urlChars = "/World/Popmundo.aspx/Locale/CharactersPresent/"

        const moveButton = document.createElement("a");
        moveButton.classList.add("tooltip-option");
        const moveSVG = document.createElement("a");
        moveSVG.classList.add("fas", "fa-map-marker-alt");
        moveButton.append(moveSVG);
        moveButton.title = "Move to Locale";
        moveButton.href = `/World/Popmundo.aspx/Locale/${localeID}#moveto`

            const charactersButton = document.createElement("a");
        charactersButton.classList.add("tooltip-option");
        const charactersSVG = document.createElement("a");
        charactersSVG.classList.add("fas", "fa-user-friends")
        charactersButton.append(charactersSVG);
        charactersButton.title = "Characters Present";
        charactersButton.href = urlChars+localeID

        const container = document.createElement("div");
        container.classList.add("tooltip-container")
        container.append(charactersButton, moveButton);

        tippy(link, {
            content: container});
    })

    // Select all the cities in the page.
    const cityLinks = Array.from(allLinks).filter(link => {
        return /World\/Popmundo.aspx\/City\/\d+/.test(link.href);
    });

    // Add tooltip to cities.
    cityLinks.forEach((link) => {
        const cityID = link.pathname.split(/\/World\/Popmundo.aspx\/City\//)[1]
        const urlPlane = "/World/Popmundo.aspx/City/BookFlight/"
        const urlJet = "/World/Popmundo.aspx/City/PrivateJet/"
        const urlBand = "/World/Popmundo.aspx/City/RoadTrip/"

        const planeButton = document.createElement("a");
        planeButton.classList.add("tooltip-option");
        const planeSVG = document.createElement("a");
        planeSVG.classList.add("fas", "fa-paper-plane")
        planeButton.append(planeSVG);
        planeButton.title = "Regular Flight";
        planeButton.href = urlPlane+cityID

        const jetButton = document.createElement("a");
        jetButton.classList.add("tooltip-option");
        const jetSVG = document.createElement("a");
        jetSVG.classList.add("fas", "fa-fighter-jet");
        jetButton.append(jetSVG);
        jetButton.title = "VIP Jet";
        jetButton.href = urlJet+cityID

        const bandButton = document.createElement("a");
        bandButton.classList.add("tooltip-option");
        const bandSVG = document.createElement("a");
        bandSVG.classList.add("fas", "fa-car-side");
        bandButton.append(bandSVG);
        bandButton.title = "Other Vehicles";
        bandButton.href = urlBand+cityID

        const container = document.createElement("div");
        container.classList.add("tooltip-container")
        container.append(planeButton, jetButton, bandButton);

        tippy(link, {
            content: container});
    })

    // Select all the artists on the page.
    const artistLinks = Array.from(allLinks).filter(link => {
        return /World\/Popmundo.aspx\/Artist\/\d+/.test(link.href);
    });

    // Add tooltip to artists.
    artistLinks.forEach((link) => {
        const artistID = link.pathname.split(/\/World\/Popmundo.aspx\/Artist\//)[1]
        const urlPopularity = "/World/Popmundo.aspx/Artist/Popularity/"
        const urlShows = "/World/Popmundo.aspx/Artist/UpcomingPerformances/"

        const popularityButton = document.createElement("a");
        popularityButton.classList.add("tooltip-option");
        const popularitySVG = document.createElement("a");
        popularitySVG.classList.add("fas", "fa-star")
        popularityButton.append(popularitySVG);
        popularityButton.title = "Popularity";
        popularityButton.href = urlPopularity+artistID

        const showsButton = document.createElement("a");
        showsButton.classList.add("tooltip-option");
        const showsSVG = document.createElement("a");
        showsSVG.classList.add("fas", "fa-calendar-alt")
        showsButton.append(showsSVG);
        showsButton.title = "Upcoming Shows";
        showsButton.href = urlShows+artistID

        const container = document.createElement("div");
        container.classList.add("tooltip-container")
        container.append(popularityButton, showsButton);

        tippy(link, {
            content: container});
    })
})();
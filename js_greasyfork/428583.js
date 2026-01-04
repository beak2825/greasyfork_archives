// ==UserScript==
// @name         Ad blocker
// @namespace    -
// @version      1.9
// @description  Updated version! Block ads on serval websites.
// @author       Stew
// @match        *://sandbox.moomoo.io/*
// @match        *://moomoo.io/*
// @match        *://sploop.io/*
// @match        *://discord.com/*
// @match        *://aternos.de/*
// @match        *://aternos.org/*
// @match        https://*.youtube.com/*
// @icon         https://img.icons8.com/ios/452/ad-blocker.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428583/Ad%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/428583/Ad%20blocker.meta.js
// ==/UserScript==
 
const elements = {
    MooMoo: [null, "onetrust-consent-sdk","moomooio_728x90_home", "promoImgHolder", "adCard", "pre-content-container", "consentBlock"],
    sploop: [null, "lostworld-io_300x250_1", "lostworld-io_300x250_2", "side-nav-left", 'bottom-content', 'cross-promo'],
    discord: [null, "notice-3bPHh- colorDefault-22HBa0"],
    youtube: [null, "masthead-ad", "player-ads"]
}
 
 
const website = window.location.host
if(website.includes("youtube.com")) {
    let webelements = elements.youtube;
    let $ = (element) => { return document.getElementById(element) }
    let _ = (element) => { return document.getElementsByClassName(element) }
    let _$ = (element) => {return element.parentElement.parentElement.parentElement}
    let special = ['style-scope ytd-display-ad-renderer', 'style-scope ytd-statement-banner-renderer']
    console.log("Ad blocker active!")
    setInterval(() => {
        if(_(special[0])) {
            for( let i = 0; i < _(special[0]).length; i++) {
                console.log('removed add ' + i)
                _$(_(special[0])[i]).remove()
            }
        }
        if(_(special[1])) {
            for( let i = 0; i < _(special[1]).length; i++) {
                console.log('removed add ' + i)
                _(special[1])[i].remove()
            }
        }
        for(let i = 0; i < webelements.length; i++) {
            if(i == 2) {
                if($(`${webelements[i]}`)) {
                    $(`${webelements[i]}`).remove();
                }
            } else {
                if($(`${webelements[i]}`)) {
                    if($(`${webelements[i]}`) == $(`${webelements[2]}`)) {
                        console.log("removed special ad (" + i + ")")
                        $(`${webelements[i]}`).parentElement.remove();
                    }
                    $(`${webelements[i]}`).remove();
                    console.log(webelements[2])
                    console.log("removed ad (" + i + ")")
                }
            }
        }
    }, 100)
}
if(website.includes("moomoo.io")) {
    let webelements = elements.MooMoo;
    let $ = (element) => { return document.getElementById(element) }
    console.log("Ad blocker active!")
    setInterval(() => {
        for(let i = 0; i < webelements.length; i++) {
            if($(`${webelements[i]}`)) {
                if($(`${webelements[i]}`) == $(`${webelements[2]}`)) {
                    console.log("removed special ad (" + i + ")")
                    $(`${webelements[i]}`).parentElement.remove();
                }
                $(`${webelements[i]}`).remove();
                console.log(webelements[2])
                console.log("removed ad (" + i + ")")
            }
        }
    }, 100)
}
if(website.includes("sploop.io")) {
    let webelements = elements.sploop;
    let $ = (element) => { return document.getElementById(element) }
    let specials = ["lostworld-io_300x250_1", "lostworld-io_300x250_2"]
    console.log("Ad blocker active!")
    setInterval(() => {
        for(let i = 0; i < webelements.length; i++) {
            if($(`${webelements[i]}`)) {
                if(specials.includes(webelements[i])) {
                    $(`${webelements[i]}`).parentElement.remove();
                    console.log("removed special ad (" + i + ")")
                } else {
                    $(`${webelements[i]}`).remove();
                    console.log("removed ad (" + i + ")")
                }
 
            }
        }
    }, 100)
}
if(website.includes("discord.com")) {
    let webelements = elements.sploop;
    let $ = (element) => { return document.getElementById(element) }
    let _ = (element) => { return document.getElementsByClassName(element) }
    let classes = ["notice-3bPHh- colorDefault-22HBa0"]
    console.log("Ad blocker active!")
    setInterval(() => {
        for(let i = 0; i < webelements.length; i++) {
            if(classes.includes(webelements[i])) {
                console.log("removed special ad (" + i + ")")
               _(webelements[i])[0].remove()
               }
        }
    }, 100)
}
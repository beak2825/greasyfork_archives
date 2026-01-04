// ==UserScript==
// @name         Page Data
// @namespace    ghill@rehabs.com
// @version      1.7
// @description  Script I created for work to display page information in the console
// @author       Gary H.
// @match        *://aacalumni.com/*
// @match        *://staging.aacalumni.com/*
// @match        *://adcare.com/*
// @match        *://staging.adcare.com/*
// @match        *://addiction-treatment.com/*
// @match        *://staging.addiction-treatment.com/*
// @match        *://addictionblog.org/*
// @match        *://staging.addictionblog.org/*
// @match        *://addictionlabs.com/*
// @match        *://staging.addictionlabs.com/*
// @match        *://addictionculture.com/*
// @match        *://staging.addictionculture.com/*
// @match        *://www.alcohol.org/*
// @match        *://staging.alcohol.org/*
// @match        *://americanaddictioncenters.org/*
// @match        *://staging.americanaddictioncenters.org/*
// @match        *://www.bulimia.com/*
// @match        *://staging..bulimia.com/*
// @match        *://www.centers.org/*
// @match        *://staging.centers.org/*
// @match        *://deserthopetreatment.com/*
// @match        *://staging.deserthopetreatment.com/*
// @match        *://www.detox.net/*
// @match        *://staging.detox.net/*
// @match        *://drugabuse.com/*
// @match        *://staging.drugabuse.com/*
// @match        *://www.drugtreatment.com/*
// @match        *://staging.drugtreatment.com/*
// @match        *://www.greenhousetreatment.com/*
// @match        *://staging.greenhousetreatment.com/*
// @match        *://heroin.net/*
// @match        *://staging.heroin.net/*
// @match        *://lagunatreatment.com/*
// @match        *://staging.lagunatreatment.com/*
// @match        *://luxury.rehabs.com/*
// @match        *://staging-luxury.rehabs.com/*
// @match        *://www.mentalhelp.net/*
// @match        *://staging.mentalhelp.net/*
// @match        *://www.oxfordtreatment.com/*
// @match        *://staging.oxfordtreatment.com/*
// @match        *://www.projectknow.com/*
// @match        *://staging.projectknow.com/*
// @match        *://www.psychguides.com/*
// @match        *://staging.psychguides.com/*
// @match        *://www.recovery.org/*
// @match        *://staging.recovery.org/*
// @match        *://www.recoveryfirst.org/*
// @match        *://staging.recoveryfirst.org/*
// @match        *://www.rehabs.com/*
// @match        *://staging.rehabs.com/*
// @match        *://riveroakstreatment.com/*
// @match        *://staging.riveroakstreatment.com/*
// @match        *://sunrisehouse.com/*
// @match        *://staging.sunrisehouse.com/*
// @match        *://talk.drugabuse.com/*
// @match        *://www.treatment4addiction.com/*
// @match        *://staging.treatment4addiction.com/*
// @match        *://www.withdrawal.net/*
// @match        *://staging.withdrawal.net/*
// @match        *://www.treatmentsolutions.com/*
// @match        *://staging.treatmentsolutions.com/*
// @match        *://web.archive.org/*
// @match        *://rehabs.pdmdev.co/*
// @match        *://rehabs-new.pdmdev.co/*
// @match        *://pdmdev.rehabs.com/*
// @match        *://townsendla.com/*
// @match        *://clientreachapp.rehabs.com/*
// @match        *://talk.drugabuse.com/*
// @match        *://clinicalservicesri.com/*
// @match        *://addiction.sandiegouniontribune.com/*
// @match        *://aacthetruth.com/*
// @match        *://collegeaddiction.rehabs.com/*
// @match        *://lp.rehabs.com/*
// @match        *://www.believablehope.com/*
// @match        *://beta.rehabs.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389447/Page%20Data.user.js
// @updateURL https://update.greasyfork.org/scripts/389447/Page%20Data.meta.js
// ==/UserScript==

var styles = [
    'background: linear-gradient(#2de009, #104704)'
    , 'border: 1px solid #3E0E02'
    , 'color: black'
    , 'display: block'
    , 'text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)'
    , 'box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset'
    , 'line-height: 20px'
    , 'text-align: center'
    , 'font-weight: bold'
].join(';');

var styles2 = [
    'background: linear-gradient(#FF0000, #104704)'
    , 'border: 1px solid #3E0E02'
    , 'color: black'
    , 'display: block'
    , 'text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)'
    , 'box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset'
    , 'line-height: 20px'
    , 'text-align: center'
    , 'font-weight: bold'
].join(';');

window.onload = function()
{
    try{
        console.log("%c TITLE = " + document.title, styles);
    }
    catch (err){
        console.error("Unable to find page title")
    }

    /* try{
        console.log("%c META TITLE = " + document.querySelectorAll("head > meta[property='og:title']")[0].content, styles);
    }
    catch (err){
        console.error("Unable to find meta title")
    } */

    try{
        console.log("%c META DESC = " + document.querySelectorAll("head > meta[name='description']")[0].content, styles);
    }
    catch (err){
        console.error("Unable to find meta desc")
    }

    /* try{
        console.log("%c META OG DESC = " + document.querySelectorAll("head > meta[property='og:description']")[0].content, styles);
    }
    catch (err){
        console.error("Unable to find og meta desc")
    } */

    try{
        console.log("%c CANONICAL TAG = " + document.querySelectorAll("head > link[rel='canonical']")[0].href, styles);
    }
    catch (err){
        console.error("Unable to find the canonical tag")
    }

    try{
        console.log("%c PAGE URL = " + document.URL, styles);
    }
    catch (err){
        console.error("Unable to find the page URL")
    }

    try{
        const CAN = document.querySelectorAll("head > link[rel='canonical']")[0].href
        const URL = document.URL

        if (URL !== CAN){
            console.error("%c The canonical tag and page URL do not match!!!", styles2)
        }
        else console.log("%c The page URL and canonical tag match", styles)
    }
    catch (err){
        console.error("The canonical tag and page URL verification didn't work?")
    }

    try{
        console.log("%c H1 Text = " + document.querySelectorAll("h1")[0].innerText, styles);
    }
    catch (err){
        console.error("Unable to find the h1 text")
    }
}
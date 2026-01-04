// ==UserScript==
// @name         L_PGNET_VISEND
// @namespace    http://tampermonkey.net/
// @version      0.3.8
// @description  LinkedIn - Perpetually Growing NETwork - AutoVisit+AutoEndorse
// @author       TH
// @include      https://www.linkedin.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/367892/L_PGNET_VISEND.user.js
// @updateURL https://update.greasyfork.org/scripts/367892/L_PGNET_VISEND.meta.js
// ==/UserScript==

let prefix = 'L_PGNET_ENDORSE > ';
let alreadyEndorsed = JSON.parse(GM_getValue("alreadyEndorsed", null) ) || {};
let nextProfiles = JSON.parse(GM_getValue("nextProfiles", null) ) || [];

jQuery( document ).ready(function( $ ) {
    $.noConflict();

    let triggerName = 'pgnet_visend';

    function detectTrigger(name) {
        let url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)")
        let results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    function gotoPage(url) {
        window.location = url
    }

    function scroll() {
        console.log(prefix + 'Scrolling')
        $("html, body").animate({
            scrollTop: $(document).height() - $(window).height()
        });
    }

    function endorseProfile(){
        if($('button[data-control-name="endorse"]').length==0){
            console.log(prefix + 'No skill to endorse...')
            return setTimeout(function(){
                searchNext();
            },10000)
        }
        let i = -1
        if($('button[data-control-name="unendorse"]').length<2){
            let maxEndorsements = (Math.random()*4+2)|0
            console.log(prefix + 'Max endorsements: '+maxEndorsements)
            $('button[data-control-name="endorse"]').each(function(skill) {
                if(Math.random()>0.2){
                    i++
                    if(i==maxEndorsements){
                        return false;
                    }else{
                        console.log(prefix + 'Endorsing skill:', $(this).closest('a[data-control-name="skills_endorsement_full_list"] span').text())
                        $(this).click()
                    }
                }
            })
            console.log(prefix + 'Endorsed skills: '+i)
        }else{
            console.log(prefix + 'Already endorsed')
        }
        console.log(prefix + 'Saving')
        alreadyEndorsed[window.location.href] = Date.now();
        GM_setValue("alreadyEndorsed", JSON.stringify(alreadyEndorsed));
        setTimeout(function() {
            searchNext()
        }, 3000)
    }

    function storeProfiles() {
        let i=0;
        $('.mn-connection-card__details > a[data-control-name="connection_profile"]').each(function(link){
            i++
            let profile_link = $(this).prop('href')+'?'+triggerName+'=true'
            if(!(profile_link in alreadyEndorsed) && nextProfiles.indexOf(profile_link)===-1){
               nextProfiles.push(profile_link)
            }
        })
        console.log(prefix + 'Stored profiles: '+i)
        console.log(prefix + 'Saving')
        GM_setValue("nextProfiles", JSON.stringify(nextProfiles));
        if(nextProfiles.length>50){
            setTimeout(function() {
                searchNext()
            }, 10000)
        }else{
            scrollAndThen(storeProfiles)
        }
    }

    function scrollAndThen(cb){
        let loops = 1
        let i=0
        while(i<loops){
            setTimeout(function() {
                scroll()
            }, i*2000+2000)
            i++
        }

        setTimeout(function() {
            cb()
        }, i*2000+3000)
    }

    function searchNext(){
        console.log(prefix + 'Searching next')
        if(nextProfiles.length>0){
            setTimeout(function() {
                let target = nextProfiles.shift()
                GM_setValue("nextProfiles", JSON.stringify(nextProfiles));
                return gotoPage(target)
            },10000);
        }
    }

    (function() {
        'use strict';
        let isTriggered = detectTrigger(triggerName)
        if (isTriggered) {
            console.log(prefix + 'Running...')
            console.log(prefix + 'HREF:', window.location.href)
            console.log(prefix+ 'Remaining Profiles to Visit: '+nextProfiles.length)

                if (window.location.pathname == '/mynetwork/invite-connect/connections/') {
                    console.log(prefix + 'Network Page')
                    let timeBeforeStart = (Math.random()*30000+15000)|0
                    console.log(prefix + 'Starting in',timeBeforeStart, 'ms')
                    setTimeout(function() {
                        console.log(prefix + 'Start')
                        scrollAndThen(storeProfiles)
                    },timeBeforeStart)
                }else if(window.location.pathname.startsWith('/in/')) {
                    console.log(prefix + 'Profile Page')
                    if(!(window.location.href in alreadyEndorsed)){
                        let timeBeforeStart = (Math.random()*30000+15000)|0
                        console.log(prefix + 'Starting in',timeBeforeStart, 'ms')
                        setTimeout(function() {
                            setTimeout(function() {
                                scroll()
                            }, 2000)
                            let index = nextProfiles.indexOf(window.location.href);
                            if(index!=-1){
                                nextProfiles.splice(index,1)
                                console.log(prefix + 'Saving')
                                GM_setValue("nextProfiles", JSON.stringify(nextProfiles));
                            }

                            setTimeout(function() {
                                console.log($("section.pv-skill-categories-section").length)
                                console.log(prefix + 'Expanding hidden skills')
                                $('button[data-control-name="skill_details"]').click()
                            }, 6000)

                            setTimeout(function() {
                                console.log(prefix + 'Focusing on skills section')
                                $('html, body').animate({
                                    scrollTop: $("section.pv-skill-categories-section").offset().top -50
                                }, 0);
                            }, 12000)

                            setTimeout(endorseProfile, 30000)
                        },timeBeforeStart)
                    }else{
                        console.log(prefix + 'Already endorsed')
                        setTimeout(function(){
                            searchNext();
                        },20000)
                    }
                }
        }

    })();
});
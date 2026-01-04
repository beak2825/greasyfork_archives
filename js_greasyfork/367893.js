// ==UserScript==
// @name         L_PGNET
// @namespace    http://tampermonkey.net/
// @version      0.5.17
// @description  LinkedIn - Perpetually Growing NETwork
// @author       TH
// @include      https://www.linkedin.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/367893/L_PGNET.user.js
// @updateURL https://update.greasyfork.org/scripts/367893/L_PGNET.meta.js
// ==/UserScript==

let prefix = 'L_PGNET > ';
let rejectedTitles = JSON.parse(GM_getValue("rejectedTitles", null) ) || [];
let invitedTitles = JSON.parse(GM_getValue("invitedTitles", null) ) || [];
let networkStats = JSON.parse(GM_getValue("networkStats", null) ) || [];

jQuery( document ).ready(function( $ ) {
    $.noConflict();

    let visend_start_button = $('<button id="visend-start" class="pgnet-btn feed-follows-module-recommendation__follow-btn button-secondary-small-muted ml2 follow ember-view"><span class="">⌹ ►</span> Start VISEND</button>').appendTo('.application-outlet');
    visend_start_button.css('position','fixed')
    visend_start_button.css('bottom','10px')
    visend_start_button.css('left','10px')
    visend_start_button.css('width', '200px')

    visend_start_button.click(function(e){
        console.log('L_PGNET_ENDORSE > Asking for a go')
        setTimeout(function(){
            window.location = 'https://www.linkedin.com/mynetwork/invite-connect/connections/?pgnet_visend=true'
        },1000)
    })

    let whiteList = [
		' ey ', 'ernst & young',
		' kpmg ',
		'accenture',
		'bearingpoint',
		'deloitte',
		' pwc ',
		' bcg ', 'boston consulting group',
		'bain & company',

		' pm ', ' pmo ',
        ' mba ',
        'devops',
		'project manager',
		'business manager',
        'product manager',
		'change manager',
		'practice manager',
        'operation manager',
		'business partner',
		'project leader',
		'team leader',
        'group manager',
		'senior consultant',
		'senior advisor',
        'program manager',
        'vice-president', ' vp ',
        'business development manager',
        'head of',
        'chief .+ officer',
        'strategy planning',
        'internal auditor',
        'restructuring',
        'professor',
        'associate professor',
        'transaction services',

        'responsable ressources humaines',
        'responsable rh',
        'manager moa',
		'conduite du changement',
		'consultant.? senior',
		'responsable de projet.?',
		'chef de projet.?',
        'responsable du business development',
        'planning stratégique',
        'planneur stratégique',

		]
    let blackList = ['stagiaire', 'state', 'internship', 'trainee']


    let triggerName = 'pgnet'; // https://www.linkedin.com/mynetwork/?pgnet=true
    let includeFilter = new RegExp(whiteList.join('|'));
    let excludeFilter = new RegExp(blackList.join('|'));
    let targetURL = 'https://www.linkedin.com/mynetwork/'
    let nonTargetURL = [
        'https://www.linkedin.com/feed/',
        'https://www.linkedin.com/jobs/',
        'https://www.linkedin.com/notifications/',
        'https://www.linkedin.com/mynetwork/invitation-manager/sent/'
    ]
    let nbOfNonTargetURL = nonTargetURL.length
    let timeAgoFilter = /(\d+) minute.?|(\d+) heure.?|(\d+) jour.?/i;

    function removeFilterUsers(){
        console.log(prefix + 'Removing old invitations')
        $('.invitation-card').each(function(invitation){
            let invitationSince = $(this).find('.time-badge.time-ago').text().toLowerCase()
            let invitationWithdraw = $(this).find('button[data-control-name="withdraw_single"]')
            let timeExtract = timeAgoFilter.exec(invitationSince);
            if(parseInt(timeExtract[2])>=9){
                invitationWithdraw.click()
            }
            if(parseInt(timeExtract[3])>=1){
                invitationWithdraw.click()
            }
        })
    }

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
        console.log(prefix + 'Scroll')
        $("html, body").animate({
            scrollTop: $(document).height() - $(window).height()
        });
    }

    function addAllUsers() {
        let users = $('button[data-control-name="invite"]');
        for (var i = 0; i < users.length; i++) {
            users[i].click();
        }
    }

    function addFilteredUsers() {
        console.log(prefix + 'Looiking for new invitations to send')
        console.log(prefix + "There are ", rejectedTitles.length, " items in rejectedTitles.");
        console.log(prefix + "There are ", invitedTitles.length, " items in invitedTitles.");
        let i = 0
        let j = 0
        let k = 0
        let l = 0
        $('.mn-pymk-list__card').each(function(user) {
            i++
            let userOccupation = $(this).find('.pymk-card__occupation').text().toLowerCase()
            let userInvite = $(this).find('button[data-control-name="invite"]')
            let title = userOccupation.replace('\\n', '').trim()
            if (includeFilter.test(userOccupation) && !excludeFilter.test(userOccupation)) {
                if(invitedTitles.indexOf(title)===-1){
                    l++
                    invitedTitles.push(title)
                }
                j++
                userInvite.click()
            }else{
                //Rejected Users Titles
                if(rejectedTitles.indexOf(title)===-1){
                    k++
                    rejectedTitles.push(title)
                }
            }
        })
        GM_setValue("rejectedTitles", JSON.stringify(rejectedTitles));
        GM_setValue("invitedTitles", JSON.stringify(invitedTitles));
        console.log(prefix + i,'listed users')
        console.log(prefix + j,'invited users')
        console.log(prefix + k,'new rejected titles')
        console.log(prefix + l,'new invited titles')
        console.log(prefix + 'Saving...')
    }

    function scrollAndThen(loops, cb){
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

    function likePosts(cb){
        let i = 0;
        $('button[data-control-name="like_toggle"]:not(.active)').each(function(button) {
            if(Math.random()>0.7){
                i++;
                $(this).click()
               }
        })
        console.log(prefix + 'Clicked Like buttons:',i)
        return cb();
    }

    (function() {
        'use strict';
        let isTriggered = detectTrigger(triggerName)
        if (isTriggered) {
            console.log(prefix + 'Running...')

                if (window.location.pathname == '/mynetwork/') {
                    console.log(prefix + 'Network Page')
                    let timeBeforeStart = (Math.random()*20000+40000)|0
                    console.log(prefix + 'Starting in',timeBeforeStart, 'ms')
                    setTimeout(function() {
                        console.log(prefix + 'Start')
                        setTimeout(function() {
                            scroll()
                        }, 1000)
                        setTimeout(function() {
                            scroll()
                        }, 4000)
                        setTimeout(function() {
                            scroll()
                        }, 7000)
                        setTimeout(function() {
                            scroll()
                        }, 10000)
                        setTimeout(function() {
                            scroll()
                        }, 13000)
                        setTimeout(function() {
                            scroll()
                        }, 16000)
                        setTimeout(function() {
                            scroll()
                        }, 19000)
                        setTimeout(function() {
                            scroll()
                        }, 22000)
                        setTimeout(function() {
                            scroll()
                        }, 25000)
                        setTimeout(function() {
                            scroll()
                        }, 27000)
                        setTimeout(addFilteredUsers, 33000)
                        if (Math.random() > 0.3) {
                            console.log(prefix + 'Next page is target page')
                            setTimeout(function() {
                                gotoPage(targetURL + '?' + triggerName + '=true')
                            }, 40000)
                        } else {
                            console.log(prefix + 'Next page is random page')
                            setTimeout(function() {
                                let index = (Math.random() * nbOfNonTargetURL) | 0
                                gotoPage(nonTargetURL[index] + '?' + triggerName + '=true')
                            }, 40000)
                        }
                    }, timeBeforeStart)
                } else if (window.location.pathname == '/mynetwork/invitation-manager/sent/') {
                    console.log(prefix + 'Network Page/Invitations sent')
                    let timeBeforeStart = (Math.random()*2000+10000)|0
                    console.log(prefix + 'Starting in',timeBeforeStart, 'ms')
                    setTimeout(function() {
                        console.log(prefix + 'Start')
                        let nbOfConnections = parseInt($('a[data-control-name="connections"] .mn-connections-summary__count').text())
                        let labelOfSentInvitations = $('label[for="contact-select-checkbox"]').text().replace('\\n', '').replace(/\s+/g, '')
                        let nbOfSentInvitations = parseInt(/.*sur(\d+)/i.exec(labelOfSentInvitations)[1]);
                        console.log(prefix + 'Connections:', nbOfConnections)
                        console.log(prefix + 'Sent invitations:', nbOfSentInvitations)
                        networkStats.push({"date":Date.now(), "nbOfConnections":nbOfConnections, "nbOfSentInvitations":nbOfSentInvitations})
                        GM_setValue("networkStats", JSON.stringify(networkStats));

                        setTimeout(removeFilterUsers, 10000)

                        console.log(prefix + 'Loading target page')
                        setTimeout(function() {
                            gotoPage(targetURL + '?' + triggerName + '=true')
                        }, (Math.random() * 5000 + 25000) | 0)
                    }, timeBeforeStart)
                } else if (window.location.pathname == '/feed/') {
                    console.log(prefix + 'Feed Page')
                    let timeBeforeStart = (Math.random()*20000+40000)|0
                    console.log(prefix + 'Starting in',timeBeforeStart, 'ms')
                    setTimeout(function() {
                        console.log(prefix + 'Start')
                        scrollAndThen(5,function(){
                            likePosts(function(){
                                console.log(prefix + 'Loading target page')
                                setTimeout(function() {
                                    gotoPage(targetURL + '?' + triggerName + '=true')
                                }, (Math.random() * 5000 + 25000) | 0)
                            })
                        })
                    }, timeBeforeStart)
                } else {
                    console.log(prefix + 'Non Relevant Page')
                    let timeBeforeStart = (Math.random()*20000+40000)|0
                    console.log(prefix + 'Starting in',timeBeforeStart, 'ms')
                    setTimeout(function() {
                        console.log(prefix + 'Start')
                        if (Math.random() > 0.2) {
                            setTimeout(function() {
                                scroll()
                            }, 2000)
                            setTimeout(function() {
                                scroll()
                            }, 5000)
                            setTimeout(function() {
                                scroll()
                                console.log(prefix + 'Loading target page')
                            }, 10000)
                            setTimeout(function() {
                                gotoPage(targetURL + '?' + triggerName + '=true')
                            }, (Math.random() * 5000 + 25000) | 0)
                        } else {
                            setTimeout(function() {
                                scroll()
                            }, 3000)
                            setTimeout(function() {
                                scroll()
                            }, 6000)
                            setTimeout(function() {
                                scroll()
                                console.log(prefix + 'Loading random page')
                            }, 12000)
                            console.log(prefix + 'Loading random page')
                            setTimeout(function() {
                                let index = (Math.random() * nbOfNonTargetURL) | 0
                                gotoPage(nonTargetURL[index] + '?' + triggerName + '=true')
                            }, (Math.random() * 5500 + 15000) | 0)
                        }

                    }, timeBeforeStart)
                }
        }
    })();
});
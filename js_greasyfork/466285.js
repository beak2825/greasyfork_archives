// ==UserScript==
// @name         Tiktok Follower Miner
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Increase yout tiktok follower!
// @author       nutz_gamer_yt
// @match        http://nutzgamer.rf.gd/*
// @match        https://greasyfork.org/*
// @match        https://www.google.com/*
// @match        https://www.youtube.com/*
// @match        https://myaccount.google.com/*
// @match        https://www.tiktok.com/*
// @connect       https://chrome.google.com/*
// @icon         https://cdn4.iconfinder.com/data/icons/social-media-flat-7/64/Social-media_Tiktok-512.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466285/Tiktok%20Follower%20Miner.user.js
// @updateURL https://update.greasyfork.org/scripts/466285/Tiktok%20Follower%20Miner.meta.js
// ==/UserScript==
(function() {
        'use strict';


        let miniumViewer = 30;
        let farms = ['radhey.radheeyy1',
                'aaanshverma100',
                'anisha_phuyal',
                'su_bam',
                'sujankc_100',
                'khusibhattarai29',
                'gamingsugardady',
                'divya.shrestha.3150',
                'ravichandthakuri44',
                'top_live_hoster_grow10k',

        ];
        localStorage.farms = JSON.stringify(farms);
        let mainURL = 'http://nutzgamer.rf.gd/';

        if (window.name == 'child' && document.URL.includes('live')) {


                window.addEventListener('message', function(event) {
                        // Get the data from the message.
                        var data = event.data;

                        // Do something with the data.
                        if (data !== null) {
                                localStorage.setItem('userName', data)
                        };
                });


        };


        //msg send function
        function sendInfo() {
                let currentLive = JSON.parse(localStorage.farms);
                var dataToSend = {
                        message: currentLive.indexOf(document.URL.slice(24, -5)) + 1
                }

                var parentDomain = mainURL;

                window.opener.postMessage(dataToSend, parentDomain);
                window.close();
        }
        //msg send function




        //profile fetch start
        setTimeout(function() {
                var isProfile = document.querySelector("#main-content-others_homepage > div");
                if (document.URL.includes('tiktok.com') && isProfile !== null) {

                        if (isProfile.children[0].firstChild.lastElementChild.children[2].innerText == 'Edit profile') {
                                var profileFetch = document.querySelector("#main-content-others_homepage > div");
                                var profileImage = document.querySelector("#main-content-others_homepage > div");
                                var parentDomain = mainURL;
                                var dataToSend = {
                                        message1: profileFetch.firstChild.firstChild.children[1].firstChild.innerText,
                                        message2: profileImage.firstChild.firstChild.children[0].firstElementChild.firstChild.src,
                                        message3: 'confirm'
                                };
                                window.opener.postMessage(dataToSend, parentDomain);
                                window.close();

                        }
                }
        }, 5000)
        //profile fetch ends




        // tiktok login start
        setInterval(function() {

                if (document.URL.includes('tiktok.com')) {

                        if (document.URL.includes('nutz_gamer_yt') || document.URL.includes('foryou')) {

                                function sendMultipleDataToParent() {
                                        if (document.querySelector("#header-login-button") == null) {




                                                var parentDomain = mainURL;
                                                var dataToSend = {
                                                        message: 'loginOkay'
                                                };
                                                window.opener.postMessage(dataToSend, parentDomain);
                                        }
                                }

                                sendMultipleDataToParent();

                                window.close();


                        }


                        if (document.querySelector("#header-login-button") !== null) {
                                // Send multiple data values from the child tab to the parent tab
                                function sendMultipleDataToParent() {
                                        var parentDomain = mainURL;
                                        var dataToSend = {
                                                message: 'notLogin'
                                        };
                                        window.opener.postMessage(dataToSend, parentDomain);
                                }

                                sendMultipleDataToParent();
                                window.close();

                        }




                }
        }, 10000);
        //tiktok login end


        //yts msg start
        setTimeout(function() {
                var isSub = document.querySelector("#subscribe-button-shape > button");
                var isnotSub = document.querySelector("#subscribe-button-shape > button");
                if (document.URL.includes('youtube.com/@nutz_gamer')) {
                        //already subscribed

                        if (isSub !== null && isSub.innerText == 'Subscribed') {

                                function sendDataToParentDomain() {
                                        var parentDomain = mainURL;
                                        var dataToSend = {
                                                message: 'subDone'
                                        };
                                        window.opener.postMessage(dataToSend, parentDomain);
                                }
                                sendDataToParentDomain();
                                window.close();
                        }




                        //not subscribed
                        if (isnotSub !== null && isnotSub.innerText == 'Subscribe') {
                                document.querySelector("#subscribe-button-shape > button").click();

                                function sendDataToParentDomain() {
                                        var parentDomain = mainURL;
                                        var dataToSend = {
                                                message: 'subDone'
                                        };
                                        window.opener.postMessage(dataToSend, parentDomain);
                                }
                                sendDataToParentDomain();
                                window.close();

                        }
                }


        }, 3000)
        //yts msg ends



        //sign in check
        if (document.URL.includes('www.google.com/account')) {
                setTimeout(function() {
                        window.close();

                }, 20000)

        }

        // GSI message send
        setTimeout(function() {


                if (document.URL.includes('myaccount.google.com') && document.querySelector("#yDmH0d > c-wiz > div > div:nth-child(2) > div > c-wiz > c-wiz > div > div.s7iwrf.gMPiLc.Kdcijb > div > div > header > h1").innerText.includes('Welcome')) {
                        function sendDataToParentDomain() {

                                var parentDomain = mainURL;
                                var dataToSend = {
                                        message: 'okay'
                                };
                                window.opener.postMessage(dataToSend, parentDomain);
                        }
                        sendDataToParentDomain();
                        window.close();
                }
                // GSI message send end
        }, 3000)
        // sign in check




        //script install & Update
        //send message to parent from greasy
        if (document.URL == 'https://greasyfork.org/en/scripts/466285-tiktok-follower-miner') {


                function sendMultipleDataToParent() {
                        var parentDomain = mainURL;
                        var dataToSend = {
                                message1: document.querySelector("#script-stats > dd.script-show-version > span").innerText,
                                message2: document.querySelector("#script-stats > dd.script-show-updated-date > span > relative-time").innerHTML,
                        };
                        window.opener.postMessage(dataToSend, parentDomain);
                }

                sendMultipleDataToParent();



        }
        //send message to parent from greasy  ends
        //script install & update end



        //tiktok live automator
        setInterval(function() {

                //error haldler

                if (document.referrer.includes(mainURL) && document.URL.includes('live')) {

                        var liveEnded = document.querySelector("#tiktok-live-main-container-id > div.tiktok-1fxlgrb-DivBodyContainer.etwpsg30 > div.tiktok-l1npsx-DivLiveContentContainer.etwpsg32 > div > div > div > div.tiktok-1fiylwg-DivLiveFeedSwiperContent.e7kdtp32 > div > div > div.tiktok-1k53s81-DivLiveContent.e14c6d572 > div.tiktok-3kx2z7-DivLiveMainContent.e14c6d573 > div > div > div.tiktok-1nfnqda-DivFeedLivePlayerCoreContainer.ev4k9611 > div > div.tiktok-1okbypp-DivRoomPlayerActivePanel.eoemvct0 > div.tiktok-19jvnaw-DivLiveEndContainer.efpx4ad0 > h2 > span:nth-child(1)");
                        var noPageFound = document.querySelector("#app > div.css-1bgjdyx-DivContainer.e1ksppba1 > div > p.not-found-desc.css-ggs2g6-PDesc.e1ksppba4");

                        var viewers = document.querySelector("#tiktok-live-main-container-id > div.tiktok-1fxlgrb-DivBodyContainer.etwpsg30").children[1].firstChild.firstChild.firstChild.lastChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.lastChild.lastChild.lastChild;

                        var error = document.querySelector("#tiktok-live-main-container-id > div.tiktok-1fxlgrb-DivBodyContainer.etwpsg30 > div.tiktok-l1npsx-DivLiveContentContainer.etwpsg32 > div > div > div > div.tiktok-1fiylwg-DivLiveFeedSwiperContent.e7kdtp32 > div > div > div.tiktok-1k53s81-DivLiveContent.e14c6d572 > div.tiktok-3kx2z7-DivLiveMainContent.e14c6d573 > div > div > div.tiktok-1nfnqda-DivFeedLivePlayerCoreContainer.ev4k9611 > div > div.tiktok-1okbypp-DivRoomPlayerActivePanel.eoemvct0 > div.tiktok-m6iny2-DivExceptionWrapper.e9fk530 > div > h5");
                        var unavailableLive = document.querySelector("#tiktok-live-main-container-id > div.tiktok-1fxlgrb-DivBodyContainer.etwpsg30 > div.tiktok-l1npsx-DivLiveContentContainer.etwpsg32 > div > div > div > div.tiktok-1fiylwg-DivLiveFeedSwiperContent.e7kdtp32 > div > div > div.tiktok-1k53s81-DivLiveContent.e14c6d572 > div.tiktok-3kx2z7-DivLiveMainContent.e14c6d573 > div > div > div.tiktok-1nfnqda-DivFeedLivePlayerCoreContainer.ev4k9611 > div > div.tiktok-1okbypp-DivRoomPlayerActivePanel.eoemvct0 > div.tiktok-m8utyg-DivLivePlayerStallTipMask.e1fsd1pu0 > p");
                        if (liveEnded !== null) {
                                if (liveEnded.innerText == 'LIVE has ended') {
                                        sendInfo();
                                }
                        } else if (unavailableLive !== null) {
                                if (unavailableLive.innerText == 'LIVE unavailable. Please try again.') {
                                        sendInfo();
                                }
                        } else if (noPageFound !== null) {
                                if (noPageFound.innerText == "Couldn't find this page") {
                                        sendInfo();
                                }
                        } else if (error !== null) {
                                if (error.innerText.includes('wrong on our end')) {
                                        location.reload();
                                }
                        } else if (viewers !== null && !viewers.innerText.includes('.')) {
                                if (parseInt(viewers.innerText.slice(0, -8)) < miniumViewer) {
                                        sendInfo();
                                }
                        } else {
                                console.log('no error found');

                        }


                        //error handler


                        // massage handler



                        function profileActivate() {
                                console.log('profile activated');
                                const dom = document.querySelector("#tiktok-live-main-container-id ");


                                var mentionPosting = dom.lastChild.lastChild.lastChild.lastChild.lastChild.lastChild.lastChild.lastChild.lastChild.lastChild.lastChild.firstChild.firstChild.firstChild.lastChild;
                                var buttonActive = dom.lastChild.lastChild.lastChild.lastChild.lastChild.lastChild.lastChild.lastChild.lastChild.lastChild.lastChild.lastChild;
                                var isClickable = dom.lastChild.lastChild.firstChild.firstChild.firstChild.lastChild.lastChild.lastChild.lastChild.lastChild.children[1].children[1].lastChild;
                                var selectLastUser = dom.lastChild.lastChild.firstChild.firstChild.firstChild.lastChild.lastChild.lastChild.lastChild.lastChild.children[1].children[1].lastChild.children[1].firstChild.firstChild;
                                if (!isClickable.innerHTML.includes('Welcome')) {
                                        selectLastUser.click();
                                        setTimeout(function() {
                                                var currentUser = dom.lastChild.lastChild.firstChild.firstChild.firstChild.lastChild.lastChild.lastChild.lastChild.lastChild.children[2].firstChild.firstChild.firstChild.children[1];
                                                var userName = JSON.stringify(currentUser.innerText).split("\\");
                                                var mentionFound = userName[0].slice(1);
                                                var mentionClose = dom.lastChild.lastChild.firstChild.firstChild.firstChild.lastChild.lastChild.lastChild.lastChild.lastChild.children[2].firstChild.firstChild.firstChild.lastChild;




                                                if (mentionFound !== '"') {

                                                        if (mentionFound !== localStorage.getItem('userName') && mentionFound !== localStorage.getItem('lastMention')) {
                                                                mentionClose.click();

                                                                console.log(mentionFound);
                                                                mentionPosting.innerHTML = '@' + mentionFound;
                                                                setTimeout(function() {
                                                                        buttonActive.className = "tiktok-1dgtn4b-DivPostButton e1ciaho89";

                                                                }, 2000);
                                                                setTimeout(function() {
                                                                        buttonActive.click();

                                                                        console.log('clicked')
                                                                }, 2000);


                                                                localStorage.setItem('lastMention', mentionFound);
                                                                console.log('mention posted  @' + localStorage.getItem('lastMention'));

                                                        } else {
                                                                console.log('Error!! Mention To Self OR Double Mention Detected')
                                                        }
                                                } else {
                                                        console.log('Error!!Blank mention detected')
                                                }


                                        }, 3000)
                                } else {
                                        console.log('Error!! No New Comment')
                                }


                        }

                }
        }, 5000);
        //tiktok live automator




})();
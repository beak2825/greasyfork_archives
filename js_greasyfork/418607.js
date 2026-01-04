// ==UserScript==
// @name         Fiction.Live Merged
// @namespace    http://tampermonkey.net/
// @version      61.0117
// @description  An attempt to improve fiction.live through the addition of various features.
// @author       Tyrannus
// @match        https://fiction.live/*
// @match        https://beta.fiction.live/*
// @grant        none
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/418607/FictionLive%20Merged.user.js
// @updateURL https://update.greasyfork.org/scripts/418607/FictionLive%20Merged.meta.js
// ==/UserScript==
(function () {
    'use strict';
    try {
        insertCSS();
        
        var scriptVersion = GM_info.script.version;

        var rolled = false;
        var lastURL = window.location.href;
        var settings = JSON.parse(localStorage.getItem('FL_Settings'));
        var defaultSettings = {
            'imageResize': false,
            'questRemove': true,
            'questAuthorRemove': true,
            'removeTaggedAuthor': false,
            'anonToggle': false,
            'removeUsernames': false,
            'autoRoller': false,
            'removeTopicForm': true,
            'removeBlankTopics': true,
            'authorHighlight': true,
            'authorBlacklist': ['0jordinio0', 'vexin980', 'reeeanon', 'cathwylf'],
            'bidas': [""],
            'chatBlacklist': true,
            'chatBlacklistReplies': true,
            'chatBlacklisted': ['reeeanon', 'oxer', 'an0n'],
            'tagBlacklist': [],
            'alertBlacklist': [],
            'sortAlerts': false,
            'highlightColor': '#393c59',
            'highlightLight': '#fc8c03',
            'highlightLightToggle': false,
            'liveRestore': true,
            'liveLight': false,
            'functionalLinks': false,
            'functionalVideos': false,
            'removeNSFW': false,
            'updateRequestDismiss': false,
            'alertContainer': 999,
            'akunPlus': 'Ignore',
            'customCSS': [{}, ``],
            'userReveal': false,
            'unpublishBTN': false,
            'messageEdit': false,
            'textStyle': false,
            'diceButton': false,
            'autoHide': false,
            'imageLink': false,
            'reviewDismiss': false,
            'followDismiss': false,
            'likeDismiss': false,
            'alertFilter': false,
            'externalCSS': [],
            'spamRemoval': false,
            'maxWords': 500,
            'bannedString': ['muyumuyu'],
            'deletedString': [],
            'messageBlacklist': false,
            'gifDisable': false,
            'qmSort': false,
            'spaceFix': false,
            'questBlock': false,
            'imgSourceBtn': false,
            'changeTopicLinks': false,
            'importDefaults': true,
            'pollString': ["snap neck"],
            'lastVersion': "",
            'listenTo': ["tyrannus", "tyrannus2"]
        };

        //Updates settings when there is a change between versions.
        if (!settings) {
            console.log('Settings set to defaults.');
            settings = defaultSettings;
        } else if (Object.keys(settings).length !== Object.keys(defaultSettings).length) {
            console.log('Settings differ in length.');
            Object.keys(defaultSettings).forEach(
                function (key) {
                    if (!(key in settings)) {
                        settings[key] = defaultSettings[key];
                        console.log('Added ' + key + ' to the current settings.');
                    };
                });
            if (Object.keys(settings).length > Object.keys(defaultSettings).length) {
                Object.keys(settings).forEach(
                    function (key) {
                        if (!(key in defaultSettings)) {
                            //console.log(`Removed invalid variable and value from settings, ${key}:${settings[key]}.`);
                            //delete settings[key]
                        };
                    });
            }
        };

        function importDefaults(togg) {
            if (!togg){togg = false;}
            if (settings.importDefaults == true || togg == true) {
                defaultSettings.authorBlacklist.forEach(x => {
                    if (!settings.authorBlacklist.includes(x)) {
                        settings.authorBlacklist.push(x);
                    }
                })
                defaultSettings.chatBlacklisted.forEach(x => {
                    if (!settings.chatBlacklisted.includes(x)) {
                        settings.chatBlacklisted.push(x);
                    }
                })
            }
        };

        //settings.uiden={}
        //console.log(settings.uiden)
        var FL_Script = {};
        let purgeButtonAdd;
        try {
            if (settings.followLike == true) {
                settings.likeDismiss == true;
                delete settings.followLike;
            }
        } catch (error) { }
        if (settings.lastVersion != scriptVersion){
            settings.lastVersion = scriptVersion;
            importDefaults(true);
        }

        localStorage.setItem('FL_Settings', JSON.stringify(settings));
        FL_Script.USERNAME = getUser();
        var USERNAME = FL_Script.USERNAME;

        document.addEventListener("mouseover", function (e) {
            //SauceNao Mouseover Event
            //console.log('clicked',e.target)
            try {
                if (settings.imgSourceBtn != true) {
                    return;
                }
                function genSource() {
                    var sourceIt = document.createElement('a');
                    sourceIt.classList.add('FL_Source');
                    sourceIt.style.position = 'relative';
                    sourceIt.style.top = '10px';
                    sourceIt.style.float = 'right';
                    sourceIt.style.fontWeight = 'bold';
                    sourceIt.style.zIndex = '1000';
                    sourceIt.onclick = function () {
                        var url = encodeURIComponent(e.target.src);
                        window.open('https://saucenao.com/search.php?url=' + url, '_blank');
                    }
                    sourceIt.innerText = 'SauceNao'
                    return sourceIt;
                }
                if (e.target.matches('img')) {
                    if (e.target.classList.contains('avatar') ||
                        e.target.classList.contains('mfp-img') ||
                        e.target.classList.contains('profilePic') ||
                        document.body.classList.contains('mfp-zoom-out-cur')) {
                        return;
                    } else if (
                        e.target.closest('.chatItemDetail') ||
                        //e.target.closest('.chapterContent')||
                        e.target.closest('.storyListItem ') ||
                        e.target.closest('.authorPane') ||
                        e.target.closest('.editContainer')) {
                        return;
                    } else if (e.target.closest('.logItem') != null &&
                        e.target.closest('.logItem').querySelector('a.FL_Source')) {
                        return;
                    } else if (e.target.closest('.fieldBody') &&
                        (!e.target.parentNode.previousSibling ||
                            (e.target.parentNode.previousSibling &&
                                !e.target.parentNode.previousSibling.classList.contains('FL_Source')))) {

                        //console.log('1')
                        e.target.closest('.fieldBody').insertBefore(new genSource, e.target.parentNode);

                    } else if (e.target.closest('.logItem')) {
                        e.target.closest('.logItem').insertBefore(new genSource, e.target.closest('.logItem').childNodes[0]);
                    }
                }
            } catch (error) {
                console.log('Error - SauceNao Broken', error);
            };
        });

        ///////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////DEV FUNCTIONS///////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////

        ///////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////OBSERVER FUNCTIONS/////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        function observeContent(mutations) {
            //Runs when a new content div has appeared.
            //The content div appears when the chapter is changed.
            for (let mutation of mutations) {
                try {
                    if (!mutation.addedNodes[0] ||
                        mutation.addedNodes == null ||
                        mutation.addedNodes == undefined ||
                        mutation.addedNodes.length == 0 ||
                        ('#comment', '#text').includes(mutation.addedNodes[0].nodeName) ||
                        mutation.addedNodes[0].classList.contains('blacklist')) {
                        return;
                    }
                    console.log('observeContent childNode', mutation.addedNodes[0].querySelectorAll('.tag'));
                    chatThings();
                    waitForTimer();
                    storyThings();
                } catch (error) {
                    console.log('observeContent', error)
                }
            };
        };

        function observeProfile(mutations) {
            //Runs when a new content div has appeared.
            //The content div appears when the chapter is changed.
            for (let mutation of mutations) {
                try {
                    if (!mutation.removedNodes.length == 0 &&
                        mutation.removedNodes[0].id == 'userProfile') {
                        console.log('Removed', mutation.removedNodes[0]);
                    }
                    if (!mutation.addedNodes[0] ||
                        mutation.addedNodes == null ||
                        mutation.addedNodes == undefined ||
                        mutation.addedNodes.length == 0 ||
                        ('#comment', '#text').includes(mutation.addedNodes[0].nodeName) ||
                        (mutation.addedNodes[0].classList &&
                            mutation.addedNodes[0].classList.contains('blacklist'))) {
                        return;
                    }
                    if (!mutation.addedNodes[0].classList) {
                        continue
                    }
                    // console.log("NEW NODES",mutation.addedNodes[0]);
                    Array.from(document.querySelector(".storiesList").children).forEach(quest => {
                        if (settings.questRemove == true) {
                            tagCheck(quest);
                        }
                        if (settings.questAuthorRemove == true) {
                            authorCheck(quest);
                        }
                    })

                    if (mutation.addedNodes[0].classList.contains('newsFeed')) {
                        //The profile tab
                    } else if (mutation.addedNodes[0].classList.contains('storiesList')) {
                        removeNSFW();
                        //The stories tab
                    } else if (mutation.addedNodes[0].nodeName == 'H1') {
                        //The collections tab
                    }
                } catch (error) {
                    console.log('observeProfile', error)
                }
            };
        };

        function observeMain(mutations) {
            for (let mutation of mutations) {
                try {
                    if (!mutation.addedNodes[0] ||
                        mutation.addedNodes == null ||
                        mutation.addedNodes == undefined ||
                        mutation.addedNodes.length == 0 ||
                        ('#comment', '#text').includes(mutation.addedNodes[0].nodeName) ||
                        mutation.addedNodes[0].classList.contains('blacklist')) {
                        return;
                    }
                    if (mutation.addedNodes[0].id == 'main') {
                        // console.log('observeMain Added', mutation.addedNodes[0]);
                        let profile = mutation.addedNodes[0].querySelector('#main > .profile');
                        let content = mutation.addedNodes[0].querySelector('#main > #content');
                        let boards = mutation.addedNodes[0].querySelector('#main > #frontpage, #main > #board');
                        let explore = mutation.addedNodes[0].querySelector('#main > #explore');
                        let threads = mutation.addedNodes[0].querySelector('#main > .nodeDetail');
                        if (content) {
                            //Quest Page
                            // console.log('Content Exists', content);
                            var observerContent = new MutationObserver(observeContent);
                            observerContent.observe(mutation.addedNodes[0], {
                                childList: true
                            });
                            chatThings();
                            waitForTimer();
                            storyThings();
                        } else if (profile) {
                            //User Page
                            // console.log('Profile Exists', profile);
                            var observerProfile = new MutationObserver(observeProfile);
                            observerProfile.observe(profile, {
                                childList: true
                            });
                        } else if (boards) {
                            //Front Page
                            // console.log('Front Page Exists', boards);
                            questCheck();
                            removeNSFW();
                        } else if (explore) {
                            //Front Page
                            // console.log('Explore Exists', explore);
                            exploreBlacklistCheck();
                            removeNSFW();
                        } else if (threads) {
                            //Front Page
                            try {
                                // console.log('Threads Exists', threads);
                                changeTopicLinks();
                                removeBlankTopics();
                                chatThings();
                            } catch (e) {
                                // console.log('exx', e);
                            }
                        } else {
                            // alert('Neither Exist', [profile, content]);
                        }
                    }
                } catch (error) {
                    console.log('observeMain', error)
                }
            };
        };
        let FP = document.querySelector('#main > #frontpage, #main > #board');
        let Threads = document.querySelector('#main > .nodeDetail');
        if (FP) {
            // console.log('Front Page', FP);
            questCheck();
            removeNSFW();
        } else if (Threads) {
            changeTopicLinks();
            removeBlankTopics();
            chatThings();
        }
        var observerMain = new MutationObserver(observeMain);
        observerMain.observe(document.body, {
            childList: true
        });

        function waitForTimer() {
            if (settings.liveRestore == false) {
                return
            };

            var observerTimer = new MutationObserver(awaitTimer);
            function awaitTimer(mutations) {
                for (let mutation of mutations) {
                    try {
                        var canvas = document.querySelector('header[class="next-live ng-scope"]');
                    } catch (error) { }
                    if (canvas && (canvas !== undefined && canvas.length != 0)) {
                        observerTimer.disconnect(); // stop observing
                        liveRestore()
                        return;
                    };
                };
            };
            observerTimer.observe(document, {
                childList: true,
                subtree: true
            });
            setTimeout(function () {
                try {
                    observerTimer.disconnect();
                } catch (error) { }
            }, 1000);
        };

        function awaitAlerts() {
            try {
                var alerts = document.querySelector('span.feedCount');
                if (alerts) {
                    //console.log('Alerts Exist');
                    try {
                        observerFCP.disconnect();
                    } catch (error) { };
                    monitorFeedCount(alerts.parentNode);
                    monitorFeeds();

                    let alertContainer = document.querySelectorAll('li.feedItem');
                    alertContainer.forEach(alert => {
                        if (/.*went live.*/.test(alert.innerText)) {
                            blacklistCheck(alert);
                        } else if (/.*Looks forward to the next update for.*/.test(alert.innerText) && settings.updateRequestDismiss == true) {
                            alertUpdate(alert)
                        } else if (/.*New review for.*/.test(alert.innerText) && settings.reviewDismiss == true) {
                            alertUpdate(alert)
                        } else if (/.*Is now a new follower of yours.*/.test(alert.innerText) && settings.followDismiss == true) {
                            alertUpdate(alert)
                        } else if (/.*Likes \".*\".*/.test(alert.innerText) && settings.likeDismiss == true) {
                            alertUpdate(alert)
                        } else if (/.*PM:.*/.test(alert.innerText)) { }
                    });
                } else {
                    //console.log('Alerts Dont Exist');
                    var observerFCP = new MutationObserver(awaitFeedCount);
                    observerFCP.observe(document, {
                        childList: true,
                        subtree: true
                    });
                };

                function awaitFeedCount(mutations) {
                    //Wait for the feed count, when found stop and start the FC monitor
                    try {
                        for (let mutation of mutations) {
                            let alerts = document.querySelector('span.feedCount')
                            if (mutation.addedNodes.length > 0) {
                                var elm = mutation.addedNodes[0];
                                if (elm.tagName == 'SPAN' && elm.classList.contains('feedCount')) {
                                    observerFCP.disconnect();
                                    monitorFeedCount(alerts.parentNode);
                                    monitorFeeds();
                                };
                            };
                        };
                    } catch (error) {
                        console.log('AFC', error)
                    };
                };

                function monitorFeedCount(FC) {
                    //Monitors feed count parent for when alerts appear or disappear.
                    try {
                        var observerFC = new MutationObserver(function (mutations) {
                            if (mutations[0].removedNodes.length > 0) {
                                //console.log('Alerts Removed.');
                                try {
                                    FL_Script.alertWatcher.disconnect();
                                    //console.log('AW');
                                } catch (error) { }
                                try {
                                    FL_Script.observerDrop.disconnect();
                                    //console.log('DW');
                                } catch (error) { }
                            } else if (mutations[0].addedNodes.length > 0) {
                                //console.log('Alerts Added.',x[0].addedNodes);
                                monitorFeeds();
                            }
                        })
                        observerFC.observe(FC, {
                            childList: true
                        })
                    } catch (error) {
                        console.log('MFC', error)
                    }
                };

                function monitorFeeds() {
                    //Alerts are stored in feeds, this monitors them
                    function dropdownWatch(mutations) {
                        try {
                            if (dropdown.length == 1) {
                                //console.log('Dropdown has a single child.')
                                return
                            }
                            for (let mutation of mutations) {
                                if (mutation.addedNodes.length > 0 && mutation.addedNodes[0].tagName == 'LI') {
                                    if (mutation.addedNodes[0].closest('.newAlerts')) {
                                        return
                                    }

                                    let text = mutation.addedNodes[0].innerText
                                    let alert = mutation.addedNodes[0]
                                    if (/.*went live.*/.test(text)) {
                                        blacklistCheck(alert);
                                    } else if (/.*Looks forward to the next update for.*/.test(text) && settings.updateRequestDismiss == true) {
                                        alertUpdate(alert)
                                    } else if (/.*New review for.*/.test(text) && settings.reviewDismiss == true) {
                                        alertUpdate(alert)
                                    } else if (/.*Is now a new follower of yours.*/.test(text) && settings.followDismiss == true) {
                                        alertUpdate(alert)
                                    } else if (/.*Likes \".*\".*/.test(alert.innerText) && settings.likeDismiss == true) {
                                        alertUpdate(alert)
                                    } else if (/.*PM:.*/.test(text)) { }
                                    if (settings.qmSort == true) {
                                        FL_Script.alertAddToList(alert);
                                    }
                                }
                            };
                        } catch (error) {
                            console.log('DW', error)
                        };
                    };

                    var dropdown = document.querySelector('#loginMenu').children[1];
                    //console.log('dropdown',dropdown);
                    var observerDrop = new MutationObserver(dropdownWatch);
                    observerDrop.observe(dropdown, {
                        childList: true,
                        subtree: true
                    });
                    FL_Script.observerDrop = observerDrop;

                    let alertContainer = document.querySelectorAll('li.feedItem');
                    alertContainer.forEach(alert => {
                        if (/.*went live.*/.test(alert.innerText)) {
                            blacklistCheck(alert);
                        } else if (/.*Looks forward to the next update for.*/.test(alert.innerText) && settings.updateRequestDismiss == true) {
                            alertUpdate(alert)
                        } else if (/.*New review for.*/.test(alert.innerText) && settings.reviewDismiss == true) {
                            alertUpdate(alert)
                        } else if (/.*Is now a new follower of yours.*/.test(alert.innerText) && settings.followDismiss == true) {
                            alertUpdate(alert)
                        } else if (/.*Likes \".*\".*/.test(alert.innerText) && settings.likeDismiss == true) {
                            alertUpdate(alert)
                        } else if (/.*PM:.*/.test(alert.innerText)) { }
                    });
                };
            } catch (error) {
                console.log('AAlerts', error)
            }
        };

        function awaitMainMenu() {
            try {
                var options = {
                    childList: true,
                    subtree: true
                };
                let observerMenu = new MutationObserver(awaitMenu);
                observerMenu.observe(document, options);
                function awaitMenu(mutations) {
                    for (let mutation of mutations) {
                        try {
                            if (document.querySelector('nav#mainMenu')) {
                                observerMenu.disconnect();
                                settingsContainer();
                                darkCheck();
                                alertSearch();
                            };
                        } catch (error) { };

                    };
                };
            } catch (error) {
                console.log('Error awaiting main menu', error)
            };

        };

        ///////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////MESSAGE FUNCTIONS/////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        function chatThings() {
            try {
                document.addEventListener("mousedown", function (e) {
                    //console.log('clicked',e.target)
                    try {
                        function fetchMessages() {
                            try {
                                let test = target.querySelector('.jadeRepeat');
                            } catch (error) {
                                console.log('F1');
                            }
                            try {
                                if (target.querySelector('.jadeRepeat').childNodes == null) {
                                    console.log('F2.0');
                                }
                                let test = target.querySelector('.jadeRepeat').childNodes;
                            } catch (error) {
                                console.log('F2');
                            }
                            if ((target.querySelector('.jadeRepeat') || target.querySelector('.jadeRepeat').childNodes) == (null || undefined)) {
                                setTimeout(fetchMessages, 500);
                                console.log('Refetch Required.')
                            }
                            try {
                                target.querySelector('.jadeRepeat').childNodes.forEach(d => handleMsg(d));
                            } catch (error) {
                                console.log('fetchMessages fail')
                            }
                        };
                        //If the users clicked a chat button below a story post.
                        var target;
                        function purgeNonImages() {
                            if (e.target.closest('footer.chapter-footer').querySelector('.FL_IMG')) {
                                return;
                            }
                            var removeTextLI = document.createElement('li');
                            removeTextLI.classList.add('FL_IMG');
                            removeTextLI.onclick = function () {
                                this.parentNode.parentNode.querySelector('div.tab-content').querySelectorAll('.chatMsg .message').forEach(
                                    msg => {
                                        if (!msg.querySelector('img')) {
                                            msg.parentNode.parentNode.remove();
                                        }
                                    })
                            }
                            var removeTextA = document.createElement('a');
                            removeTextA.innerText = 'Remove non-images';
                            removeTextLI.appendChild(removeTextA);
                            let q = e.target.closest('footer.chapter-footer')
                            q.querySelector('ul.nav.btn-set').appendChild(removeTextLI);
                        };

                        function inlineChatMessageMonitor(mutations) {
                            for (let mutation of mutations) {
                                try {
                                    var newN = mutation.addedNodes[0];
                                    if (!newN ||
                                        newN.length == 0 ||
                                        newN.nodeName == '#text' ||
                                        newN.classList.contains('linkDiv') ||
                                        newN.classList.contains('linkBtn')) {
                                        continue
                                    }
                                    if (newN.matches('div.chatLog.chapterComments div')) {
                                        // console.log('Added ICMM', newN.parentNode.parentNode.querySelector('.jadeRepeat').children.length);
                                        //callDelay(fetchMessages, 0);
                                        setTimeout(fetchMessages(), 500)
                                    }
                                    observerMessage.disconnect();
                                } catch (error) {
                                    console.log('inlineChatMessageMonitor Error', newN, error);
                                }

                            };
                        };
                        let observerMessage = new MutationObserver(inlineChatMessageMonitor);
                        if (e.target.matches(".expandComments.showWhenDiscussionOpened")) {
                            //var b = e.target.parentNode.parentNode.parentNode;
                            target = e.target.closest('.tabbable');
                            setTimeout(fetchMessages, 500);
                            observerMessage.observe(target, {
                                childList: true,
                                subtree: true
                            });
                            purgeNonImages();
                        } else if (e.target.matches(".btn.expandComments")) {
                            target = e.target.closest('footer');
                            setTimeout(fetchMessages, 500);
                            observerMessage.observe(target, {
                                childList: true,
                                subtree: true
                            });
                            purgeNonImages();
                        } else if (e.target.parentNode.matches(".btn.expandComments")) {
                            target = e.target.parentNode.closest('footer');
                            //setTimeout(fetchMessages, 500);
                            observerMessage.observe(target, {
                                childList: true,
                                subtree: true
                            });
                            purgeNonImages();
                        }
                    } catch (error) {
                        console.log('Error - Post Chat Mousedown', error)
                    };
                });

                function chatBlacklist(message) {
                    try {
                        let username = message.querySelector('.user span').innerText;
                        if (settings.chatBlacklist != true || settings.chatBlacklisted.length == 0) {
                            return;
                        };
                        if (settings.listenTo.includes(username)) {
                            return
                        }
                        if (settings.chatBlacklisted.includes(username)) {
                            message.classList.add('chatListed');
                            return;
                        } else {
                            if (settings.chatBlacklistReplies == true) {
                                replyCheck();
                            };
                        };

                        async function replyCheck() {
                            let msgData = '';
                            let msgData2 = '';
                            if (message.querySelector('.replyAt')) {
                                await fetch(`https://fiction.live/api/node/${message.firstChild.getAttribute('data-id')}`).then(response => response.json()).then(data => {
                                    msgData = data
                                })
                                await fetch(`https://fiction.live/api/node/${msgData.ra._id}`).then(response => response.json()).then(data => {
                                    msgData2 = data
                                });
                                try {
                                    if (settings.chatBlacklisted.includes(msgData2)) {
                                        message.classList.add('chatListed');
                                        setTimeout(function () {
                                            try {
                                                document.querySelectorAll('.chatListed').forEach(mm => mm.remove());
                                            } catch (error) {
                                                //console.log(error);
                                            };
                                        }, 500);
                                    };
                                } catch (error) {
                                    console.log(message)
                                }
                            };
                        };

                        async function delMSG(name) {
                            try {
                                var msgID = message.firstChild.getAttribute('data-id');
                            } catch (error) {
                                console.log('id fail');
                            };
                            try {
                                if (name == message.querySelector('div.user span').innerText) {
                                    message.remove();
                                    return;
                                } else {
                                    var commentName = '',
                                        replyName = '',
                                        msgData = '';
                                    await fetch("https://fiction.live/api/node/" + msgID, {}).then(response => response.json()).then(data => {
                                        msgData = data
                                    });
                                    commentName = msgData.u[0].n;
                                    try {
                                        replyName = msgData.ra.u.n;
                                    } catch (error) {
                                        console.log('reply fail');
                                    };
                                    if (settings.chatBlacklisted.includes(replyName)) {
                                        message.remove();
                                    } else if (settings.chatBlacklisted.includes(commentName)) {
                                        message.remove();
                                    };
                                };
                            } catch (error) {
                                console.log('total fail', message.parentNode);
                            };
                        };
                    } catch (error) { };
                };

                function akunPlus(message) {
                    try {
                        if (settings.akunPlus == 'Ignore') {
                            return;
                        } else if (settings.akunPlus == 'Remove') {
                            message.querySelector('.chatMsg').removeAttribute('plan');
                        } else {
                            message.querySelector('.chatMsg').setAttribute('plan', '1');
                        }
                    } catch (error) {
                        //console.log(message.querySelector('span.name'),message.querySelector('.message').innerText,error)
                    }
                };

                function functionalLinks(message) {
                    function isVisible(element) {
                        try {
                            let bounding = element.getBoundingClientRect();
                            if (bounding.top >= 0 && bounding.left >= 0 &&
                                bounding.right <= (window.innerWidth || document.documentElement.clientWidth) &&
                                bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)) {
                                return true;
                            } else {
                                return false;
                            }

                        } catch (error) { }
                    };

                    try {
                        try {
                            if (message.querySelector('.message').querySelector('img') ||
                                message.querySelector('.linkDiv')) {
                                return;
                            }
                        } catch (error) { }
                        let Control = [0, 0, 0]
                        var elmDiv = document.createElement('div');
                        elmDiv.setAttribute('class', 'linkDiv');
                        var elmDivControl = document.createElement('div');

                        var elmDivControlA = document.createElement('input');
                        elmDivControlA.setAttribute("type", "button");
                        elmDivControlA.setAttribute("hide", 'false');
                        elmDivControlA.value = 'Disable Link(s)'
                        elmDivControlA.onclick = function () {
                            if (this.getAttribute('hide') == 'true' || null) {
                                this.setAttribute('hide', 'false');
                                this.value = 'Disable Link(s)';
                                this.parentNode.parentNode.querySelector('.linkDivA').style.display = 'initial';
                            } else {
                                this.setAttribute('hide', 'true');
                                this.value = 'Enable Link(s)';
                                this.parentNode.parentNode.querySelector('.linkDivA').style.display = 'none';
                            }
                        }

                        var elmDivControlB = document.createElement('input');
                        elmDivControlB.setAttribute("type", "button");
                        elmDivControlB.setAttribute("hide", 'false');
                        elmDivControlB.value = 'Disable Image(s)'
                        elmDivControlB.onclick = function () {
                            if (this.getAttribute('hide') == 'true' || null) {
                                this.setAttribute('hide', 'false');
                                this.value = 'Disable Image(s)';
                                this.parentNode.parentNode.querySelector('.linkDivB').style.display = 'initial';
                            } else {
                                this.setAttribute('hide', 'true');
                                this.value = 'Enable Image(s)';
                                this.parentNode.parentNode.querySelector('.linkDivB').style.display = 'none';
                            }
                        }

                        var elmDivControlC = document.createElement('input');
                        elmDivControlC.setAttribute("type", "button");
                        elmDivControlC.setAttribute("hide", 'true');
                        elmDivControlC.value = 'Enable Video(s)'
                        elmDivControlC.onclick = function () {
                            if (this.getAttribute('hide') == 'true' || null) {
                                this.setAttribute('hide', 'false');
                                this.value = 'Disable Video(s)';
                                this.parentNode.parentNode.querySelector('.linkDivC').style.display = 'initial';
                            } else {
                                this.setAttribute('hide', 'true');
                                this.value = 'Enable Video(s)';
                                this.parentNode.parentNode.querySelector('.linkDivC').style.display = 'none';
                            }
                        }

                        var elmDivA = document.createElement('div');
                        elmDivA.setAttribute('class', 'linkDivA');
                        elmDiv.appendChild(elmDivA);

                        var elmDivB = document.createElement('div');
                        elmDivB.setAttribute('class', 'linkDivB');
                        elmDiv.appendChild(elmDivB);

                        var elmDivC = document.createElement('div');
                        elmDivC.setAttribute('class', 'linkDivC');
                        elmDivC.style.display = 'none'
                        elmDiv.appendChild(elmDivC);

                        function link(type, type2, link) {
                            var elm = document.createElement(type);
                            if (type2 == 1) {
                                elm.src = link;
                                elmDiv.childNodes[1].appendChild(elm);
                            } else if (type2 == 2) {
                                elm.href = link;
                                elm.innerHTML = 'Link';
                                elm.setAttribute('class', 'functionalLink');
                                elm.rel = "noopener noreferrer";
                                elm.target = "_blank";
                                elmDiv.childNodes[0].appendChild(elm);
                            } else if (type2 == 3) {
                                elm = document.createElement('iframe');
                                elm.setAttribute('frameborder', '0')
                                elm.setAttribute('allowFullScreen', '')
                                elm.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                                elm.src = link;
                                elm.setAttribute('class', 'functionalVideo');
                                let functionalContainer = document.createElement('div');
                                functionalContainer.setAttribute('class', 'functionalContainer');
                                functionalContainer.appendChild(elm);
                                elmDiv.childNodes[2].appendChild(functionalContainer);
                            }
                            return elmDiv
                        }

                        function linkProcess(match) {
                            try {
                                //If theres already a link container, check if the links been embedded
                                if (message.querySelector('.linkDiv')) {
                                    var qq = message.querySelector('.linkDiv').querySelectorAll('a').forEach(
                                        x => {
                                            if (x.href == match) {
                                                return;
                                            };
                                        });
                                };
                            } catch (error) {
                                console.log(error);
                            };
                            if (typeof match == 'undefined' || match.startsWith('/') || match.length < 5 || /.+\..+/.test(match) == false) { }
                            else {
                                try {
                                    if (/([a-z]*\.{2,}[a-z]*)/.test(match) == true) {
                                        return
                                    };
                                    var elm;
                                    if (/https?:\/\//.test(match) == false) {
                                        match = 'https://'.concat(match)
                                    };
                                    if (/.*(jpg|jpeg|png|gif|webm|webp)/.test(match)) {
                                        elm = new link('img', 1, match);
                                        Control[1] = 1;

                                    } else if (settings.functionalVideos == true && (/youtu\.?be/.test(match))) {
                                        if (/.*v=((\w|-)+).*/.test(match)) {
                                            let src = `https://www.youtube.com/embed/${(match.match(/v=((\w|-)+)/)[1])}`;
                                            elm = new link('iframe', 3, src);
                                            message.querySelector('.chatMsg').parentNode.appendChild(elm);
                                        } else if (/be\/(\w|-)+/.test(match)) {
                                            let src = `https://www.youtube.com/embed/${(match.match(/be\/((\w|-)+)/)[1])}`;
                                            elm = new link('iframe', 3, src)
                                            message.querySelector('.chatMsg').parentNode.appendChild(elm);
                                        }
                                        Control[2] = 1;
                                    } else {
                                        elm = new link('a', 2, match);
                                        Control[0] = 1;
                                    }
                                } catch (error) {
                                    console.log(error)
                                };
                            }
                        };

                        if (settings.functionalLinks != true) {
                            return;
                        };
                        try {
                            //var regex = new RegExp(/(https?:\/\/(www\.)?)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)*/g);
                            var regex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)*/g);
                            var text = message.querySelector('div.fieldBody').innerText;
                            if (regex.test(text)) {
                                var matches = text.match(regex),
                                    mCount = 0;
                                matches.forEach(match => linkProcess(match));

                                if (Control[0] == 1) {
                                    elmDivControl.appendChild(elmDivControlA);
                                };
                                if (Control[1] == 1) {
                                    elmDivControl.appendChild(elmDivControlB);
                                };
                                if (Control[2] == 1) {
                                    elmDivControl.appendChild(elmDivControlC);
                                };
                                elmDiv.prepend(elmDivControl);
                                message.querySelector('.chatMsg').parentNode.appendChild(elmDiv);
                                let bounding = message.getBoundingClientRect();
                                if (isVisible(message)) {
                                    message.scrollIntoView();
                                }
                            };
                        } catch (error) {
                            //console.log(error)
                        }
                    } catch (error) { }
                };

                function removeUsernames(message) {
                    //return;
                    //console.log('this shouldnt be seen')
                    if (settings.removeUsernames == true && message.querySelector('span.name')) {
                        message.querySelector('span.name').style.display = 'none';
                        let authorList = document.querySelectorAll('.page-author')[0].children
                        let authors = []
                        //authorList.forEach(element => authors.push(element.querySelector('span.name').innerText))
                        Array.from(authorList).forEach(
                            element => {
                                if (element.innerText != '') {
                                    authors.push(element.querySelector('span.name').innerText)
                                }
                            })
                        try {
                            if (authors.includes(message.querySelector('span.name').innerText)) {
                                message.querySelector('span.name').style.display = 'initial';
                                return;
                            } else {
                                setTimeout(function () {
                                    try {
                                        message.querySelector('img.avatar').remove()
                                    } catch (error) { };
                                    try {
                                        message.querySelector('span.name').innerText = 'anon'
                                        message.querySelector('span.name').style.display = 'initial';
                                    } catch (error) {
                                        console.log('Error forcing anon', error);
                                    };
                                    setTimeout(function () {
                                        if (message.querySelector('span.name').innerText != 'anon') {
                                            message.querySelector('span.name').innerText = 'anon'
                                        }
                                    }, 100);
                                }, 100);

                            }
                        } catch (error) {
                            console.log('removeUsernames failed', error);
                        };
                    } else {
                        return
                    }

                };

                function authorHighlight(message) {
                    try {
                        if (settings.authorHighlight == true && message.querySelector('span.name')) {
                            var currentColor;
                            if (FL_Script.darkMode == false) {
                                currentColor = settings.highlightLight;
                            } else {
                                currentColor = settings.highlightColor;
                            }
                            let authorList = document.querySelectorAll('.page-author')[0].children
                            let authors = []
                            Array.from(authorList).forEach(
                                element => {
                                    if (element.innerText != '') {
                                        authors.push(element.querySelector('span.name').innerText)
                                    }
                                })
                            try {
                                if (authors.includes(message.querySelector('span.name').innerText)) {
                                    if (settings.highlightColor) {
                                        try {
                                            message.style.backgroundColor = currentColor;
                                        } catch (error) {
                                            console.log('Failed using custom color', error);
                                        }
                                    }
                                };
                            } catch (error) {
                                console.log('Author highlighter failed', error);
                            };
                        } else {
                            return;
                        };
                    } catch (error) { };

                };

                function imageResize(message) {
                    try {
                        if (settings.imageResize == true) {
                            let msgImage = message.querySelector('div.message').querySelector('img');
                            if (msgImage != null && msgImage != undefined) {
                                let image = message.querySelector('div.message').querySelector('img');
                                if (image.src.includes('?')) {
                                    image.src = image.src.split('?')[0];
                                } else {
                                    image.src = image.src.replace(/(h[0-9]+\-w[0-9]+)/, 'h5600-w5600');
                                    let page = image.src;
                                    image.setAttribute('onclick', "window.open('" + page + "', '_blank');")
                                    try {
                                        image.onerror = (function () {
                                            try {
                                                if (this.retries && this.retries < 5) {
                                                    this.retries = this.retries + 1;
                                                } else if (this.retries == 5) {
                                                    return;
                                                } else {
                                                    this.retries = 1;
                                                }
                                                console.log('Source failed. Retrying. Retries', this.retries, 'of 5.');
                                                setTimeout(this.src = this.src, 500);
                                            } catch (error) {
                                                console.log('ImageResizeRetryError');
                                            }
                                        })
                                    } catch (error) {
                                        console.log('img error add fail', error)
                                    };
                                }
                            };
                        } else {
                            return;
                        };
                    } catch (error) {
                        console.log('ImageResizer', error)
                    }
                };

                async function userReveal(message) {
                    if (settings.userReveal != true || settings.removeUsernames == true) {
                        return
                    }
                    try {
                        var messageID = message.firstChild.getAttribute('data-id')
                        var returnedData = message.firstChild.getAttribute('data-id')
                        try {
                            await fetch(`https://fiction.live/api/node/${messageID}`).then(response => response.json()).then(data => {
                                returnedData = data
                            });
                            if (!returnedData.u[0]._id) {
                                //console.log('no _id')
                                //console.log(returnedData.u)
                                return;
                            };
                            //console.log('got_id',returnedData.u[0]._id)
                            var userID = returnedData.u[0]._id;
                            await fetch(`https://fiction.live/api/anonkun/userCollections/${userID}`, {}).then(response => response.json()).then(data => {
                                userID = data
                            });
                            if (userID.length == 0) {
                                //console.log('len=0',userID,message);
                                return
                            }
                            if (userID[0].u[0].n == 'Anon') {
                                return;
                            }
                            message.querySelector('.user span').innerText = userID[0].u[0].n;
                        } catch (error) {
                            //console.log('no collections',message,error);
                            return;
                        }
                    } catch (error) {
                        //console.log(error);
                        return;
                    }
                };

                function messageEdit(message) {
                    try {
                        if (!message.querySelector('span.name') ||
                            //message.querySelector('.message img') != null ||
                            USERNAME == '') {
                            return
                        }
                    } catch (error) {
                        //console.log('err',error);
                    }
                    try {
                        if (message.querySelector('span.name').innerText != USERNAME) {
                            return;
                        }
                        let messageID = message.firstChild.getAttribute('data-id');
                        let messageCont = document.createElement('div');
                        messageCont.setAttribute('class', 'msgModBox')

                        let messageEdit = document.createElement('input');
                        messageEdit.setAttribute('type', 'button')
                        messageEdit.setAttribute('class', 'msgMod const msgModEdit')
                        messageEdit.onclick = editMsg;
                        messageEdit.value = 'Open Edit Mode';
                        function editMsg() {
                            if (settings.messageEdit != true) {
                                return
                            }
                            if (messageEdit.closest('.logItem').classList.contains('editMode')) {
                                messageEdit.value = 'Open Edit Mode';
                                messageEdit.closest('.logItem').classList.remove('editMode');
                                message.querySelector('textarea').remove();
                                message.querySelector('.chatMsg').style.display = '';
                            } else {
                                messageEdit.value = 'Close Edit Mode';
                                messageEdit.closest('.logItem').classList.add('editMode');
                                var messageText = document.createElement('textarea');
                                messageText.setAttribute('placeholder', 'Add text to alter the message.');
                                messageText.setAttribute("cols", "1");
                                messageText.setAttribute("rows", "5");
                                messageText.addEventListener("keydown", function (press) {
                                    // 13 = Enter, 27 = Escape
                                    if (press.keyCode === 13 & !(press.keyCode === 13 && press.shiftKey)) {
                                        press.preventDefault(); // Cancel the default action, if needed
                                        messageSave.click();
                                    } else if (press.keyCode === 27) {
                                        press.preventDefault();
                                        messageEdit.click();
                                    }
                                });
                                var type = 1;
                                if (messageEdit.closest('.logItem').classList.contains('imgMsg')) {
                                    type = 0;
                                }
                                fetch(`https://fiction.live/api/node/` + messageID).then(response => response.json()).then(data => {
                                    messageText.value = data.i;
                                    if (type == 1) {
                                        messageText.value = data.b
                                    };
                                    message.querySelector('.chatMsg').style.display = 'none';
                                    message.appendChild(messageText);
                                });
                            };
                        };

                        let messageSave = document.createElement('input');
                        messageSave.setAttribute('type', 'button')
                        messageSave.setAttribute('class', 'msgMod edit msgModSave')
                        messageSave.onclick = saveMsg;
                        messageSave.value = 'Save';
                        function saveMsg() {
                            var messageContent = message.querySelector('textarea').value.replaceAll(/(\\)/g, '\\$1');
                            messageContent = messageContent.replaceAll(/\n+/g, '\\n');
                            messageContent = messageContent.replaceAll(/"/g, '\\"');
                            var body = '';
                            if (messageEdit.closest('.logItem').classList.contains('imgMsg')) {
                                body = `{\"_id\":\"${messageID}\",\"i\":\"${messageContent}\"}`
                            } else {
                                body = `{\"_id\":\"${messageID}\",\"b\":\"${messageContent}\"}`
                            }
                            fetch("https://fiction.live/api/node", {
                                "headers": {
                                    "User-Agent": "",
                                    "Accept": "application/json, text/javascript, */*; q=0.01",
                                    "Accept-Language": "en-GB,en;q=0.5",
                                    "Content-Type": "application/json",
                                    "X-Requested-With": "XMLHttpRequest"
                                },
                                "body": body,
                                "method": "PUT",
                                "mode": "cors"
                            });

                            messageCont.closest('.logItem').classList.remove('editMode');
                            messageEdit.value = 'Open Edit Mode';
                            message.querySelector('textarea').remove();
                            message.children[1].style.display = '';
                        };

                        let messageDiscard = document.createElement('input');
                        messageDiscard.setAttribute('type', 'button')
                        messageDiscard.setAttribute('class', 'msgMod edit msgModDiscard')
                        messageDiscard.onclick = discardMsg;
                        messageDiscard.value = 'Discard';
                        function discardMsg() {
                            message.children[2].value = '';
                        };

                        let messageDelete = document.createElement('input');
                        messageDelete.setAttribute('type', 'button')
                        messageDelete.setAttribute('class', 'msgMod const msgModDelete')
                        messageDelete.onclick = deleteMsg;
                        messageDelete.value = 'Delete';
                        function deleteMsg() {
                            if (settings.unpublishBTN != true) {
                                return
                            }
                            fetch("https://fiction.live/api/node", {
                                "headers": {
                                    "User-Agent": "",
                                    "Accept": "application/json, text/javascript, */*; q=0.01",
                                    "Content-Type": "application/json",
                                    "X-Requested-With": "XMLHttpRequest"
                                },
                                "body": `{\"_id\":\"${messageID}\",\"trash\":true}`,
                                "method": "PUT",
                                "mode": "cors"
                            });
                            //messageDelete.remove()
                            message.remove()
                        };

                        if (FL_Script.darkMode != true) {
                            messageCont.classList.add('dark');
                        }
                        messageCont.appendChild(messageEdit);
                        messageCont.appendChild(messageSave)
                        messageCont.appendChild(messageDiscard)
                        messageCont.appendChild(messageDelete)
                        message.prepend(messageCont)
                    } catch (error) {
                        console.log('Error', error);
                    }
                };

                function onX(message) {
                    try {
                        if (!message.querySelector('span.name') ||
                            //message.querySelector('.message img') != null ||
                            USERNAME == '') {
                            return
                        }
                    } catch (error) {
                        //console.log('err',error);
                    }
                    try {
                        if (message.querySelector('.message img')) {
                            message.classList.add('imgMsg');
                        }
                        message.addEventListener('mouseover', function () {
                            if (this.querySelector('div.user span').innerText != USERNAME) {
                                return;
                            };
                            if (this.querySelectorAll('input').length <= 3) {
                                messageEdit(this)
                            };
                            //If delete is enabled and delete class is missing.
                            if (settings.unpublishBTN != true && settings.messageEdit != true) {
                                return
                            }

                            if (settings.unpublishBTN == true && settings.messageEdit == true) {
                                this.classList.add('visAll');
                            } else if (settings.unpublishBTN == true && settings.messageEdit != true) {
                                this.classList.add('delOn');
                            } else if (settings.unpublishBTN != true && settings.messageEdit == true) {
                                this.classList.add('vis');
                            }
                            if (message.querySelector('.msgModBox').isReallyVisible() == true && message.querySelector('footer').isReallyVisible() == false) {
                                //console.log('1')
                                //console.log(message.offsetHeight)
                                if (message.offsetHeight < 300) {
                                    if (message.classList.contains('editMode')) {
                                        return
                                    }
                                    message.closest('article.chatLog').scrollTop += message.querySelector('.msgModBox').offsetHeight
                                }
                            }
                        })
                    } catch (error) {
                        //console.log('Er0',error);
                    }
                    try {
                        message.addEventListener('mouseout', function () {
                            this.classList.remove('vis', 'visAll', 'delOn');
                        })
                    } catch (error) {
                        //console.log('Er1',error);
                    }
                };

                function spamCheck(message) {
                    if (settings.spamRemoval != true) {
                        return
                    }
                    if (message) {

                        try {
                            if (message.innerText.length > settings.maxWords) {
                                let questIDregex = '.*\/stories\/.*\/(.*)\/?';
                                let questID = window.location.href.match('.*\/stories\/.*\/(.*)\/?')[1];
                                let messageID = message.childNodes[0].getAttribute('data-id');
                                fetch("https://fiction.live/api/anonkun/node", {
                                    "credentials": "include",
                                    "headers": {
                                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0",
                                        "Accept": "application/json, text/javascript, */*; q=0.01",
                                        "Accept-Language": "en-GB,en;q=0.5",
                                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                                        "X-Requested-With": "XMLHttpRequest"
                                    },
                                    "referrer": "https://fiction.live/stories/X/fD9TaJwHrfoqb6jBQ",
                                    "body": "deleteFrom=" + questID + "&nid=" + messageID,
                                    "method": "DELETE",
                                    "mode": "cors"
                                });
                                console.log('Deleted', message);
                                message.remove();
                            }
                        } catch (error) {
                            console.log('SC', error);
                        }
                    }
                };

                async function messageBlacklist(message) {
                    if (settings.messageBlacklist != true) {
                        return
                    }
                    try {
                        if (settings.listenTo.includes(message.querySelector('span.name'))) {
                            return
                        }
                        let questIDregex = '.*\/stories\/.*\/(.*)\/?';
                        let questID = window.location.href.match('.*\/stories\/.*\/(.*)\/?')[1];
                        let messageID = message.childNodes[0].getAttribute('data-id');
                        if (settings.bannedString.includes(message.childNodes[0].childNodes[1].innerText)) {
                            fetch("https://fiction.live/api/anonkun/ban", {
                                "credentials": "include",
                                "headers": {
                                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0",
                                    "Accept": "*/*",
                                    "Accept-Language": "en-GB,en;q=0.5",
                                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                                    "X-Requested-With": "XMLHttpRequest"
                                },
                                "body": "blockFor=" + messageID + "&blockFrom=" + questID,
                                "method": "POST",
                                "mode": "cors"
                            });
                            fetch("https://fiction.live/api/anonkun/node", {
                                "credentials": "include",
                                "headers": {
                                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0",
                                    "Accept": "application/json, text/javascript, */*; q=0.01",
                                    "Accept-Language": "en-GB,en;q=0.5",
                                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                                    "X-Requested-With": "XMLHttpRequest"
                                },
                                "referrer": "https://fiction.live/stories/X/fD9TaJwHrfoqb6jBQ",
                                "body": "deleteFrom=" + questID + "&nid=" + messageID,
                                "method": "DELETE",
                                "mode": "cors"
                            });
                            console.log('Banned & Deleted', message);
                            message.remove();

                        };
                        if (settings.deletedString.includes(message.childNodes[0].childNodes[1].innerText)) {
                            fetch("https://fiction.live/api/anonkun/node", {
                                "credentials": "include",
                                "headers": {
                                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0",
                                    "Accept": "application/json, text/javascript, */*; q=0.01",
                                    "Accept-Language": "en-GB,en;q=0.5",
                                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                                    "X-Requested-With": "XMLHttpRequest"
                                },
                                "referrer": "https://fiction.live/stories/X/fD9TaJwHrfoqb6jBQ",
                                "body": "deleteFrom=" + questID + "&nid=" + messageID,
                                "method": "DELETE",
                                "mode": "cors"
                            });
                            console.log('Deleted', message);
                            message.remove();
                        };
                    } catch (error) {
                        console.log('messageBlacklist', error)
                    }
                };

                function gifDisable(message) {
                    if (settings.gifDisable != true) {
                        return
                    }
                    let gif = message.querySelector('.user img')
                    if (gif != (undefined || null) && gif.src.includes('gif')) {
                        gif.remove()
                    }
                }

                function whenNewMessage(chat) {
                    try {
                        function autoRoll(change) {
                            if (settings.autoRoller !== true) {
                                return;
                            } else {
                                try {
                                    var rollRegex = /[0-9]+d[0-9]+(?<!1d1)((\+|\-)[0-9]+)?( ?)(([ie]+)?([ut][0-9]+)?)+/
                                    if (rollRegex.test(change.innerText)) {
                                        var roll = change.innerText.match(rollRegex)[0];
                                        var latestUpdate = document.querySelector('div#storyPosts').firstChild.lastChild;
                                        var poll = latestUpdate.firstChild.firstChild;
                                        if (change.querySelector('span.name') && change.querySelector('span.name').innerText == USERNAME) {
                                            poll.classList.add('rolled');
                                            return
                                        }
                                        if (latestUpdate.classList.contains('readerPost') == false || poll.classList.contains('closed') || poll.classList.contains('rolled')) {
                                            return
                                        } else if (!(poll.classList.contains('closed'))) {
                                            var dataID = latestUpdate.getAttribute('data-id');
                                            var chapterID = document.querySelector('article.threads').getAttribute('threads');
                                            chapterID = chapterID.replace(/\/.*/, '');
                                            var rollSend = `/roll ${roll}`;
                                            var template = `sid=${chapterID}&dice=${encodeURIComponent(rollSend)}`;
                                            chatSend([[chapterID, dataID, roll], template]);
                                            poll.classList.add('rolled');
                                        }
                                    }
                                } catch (error) { }
                            };
                        };
                        function specialMsg(message) { };

                        var options = {
                            childList: true
                        };
                        function messageMod(mutations) {
                            for (let mutation of mutations) {
                                try {
                                    var message = mutation.addedNodes[0];
                                    if (!message || message.length == 0) {
                                        return
                                    }
                                    //specialMsg(message);

                                    messageBlacklist(message);
                                    spamCheck(message);
                                    chatBlacklist(message);
                                    userReveal(message);
                                    removeUsernames(message);
                                    authorHighlight(message);
                                    imageResize(message);
                                    autoRoll(message);
                                    functionalLinks(message);
                                    blockQuest(message);
                                    akunPlus(message);
                                    onX(message);
                                    messageFocus(message);
                                    gifDisable(message);

                                    //observerMessage.disconnect();
                                } catch (error) {
                                    console.log('New Message Error', error);
                                }

                            };
                        };
                        let observerMessage = new MutationObserver(messageMod);
                        observerMessage.observe(chat, options);
                    } catch (error) {
                        if (error instanceof TypeError) {
                            return
                        };
                        console.log(error)
                    }
                };

                function withOldMessage(chat) {
                    var messages = chat.childNodes;
                    try {
                        for (let message of messages) {
                            try {
                                spamCheck(message);
                                chatBlacklist(message);
                                imageResize(message);
                                userReveal(message);
                                authorHighlight(message);
                                removeUsernames(message);
                                functionalLinks(message);
                                akunPlus(message);
                                onX(message);
                                messageFocus(message);
                                gifDisable(message);
                            } catch (error) { };
                        }
                    } catch (error) {
                        console.log('OldMsg', error)
                    };
                };

                function handleMsg(message) {
                    if (message.tagName == 'HEADER') {
                        return;
                    }
                    try {
                        spamCheck(message);
                        chatBlacklist(message);
                        imageResize(message);
                        authorHighlight(message);
                        functionalLinks(message);
                        removeUsernames(message);
                        akunPlus(message);
                        gifDisable(message);
                    } catch (error) { };
                };

                function textStyle() {
                    function getSelectionText() {
                        var text = "";
                        var activeEl = document.activeElement;
                        var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
                        if ((activeElTagName == "textarea") || (activeElTagName == "input" && /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) && (typeof activeEl.selectionStart == "number")) {
                            text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
                        } else if (window.getSelection) {
                            text = window.getSelection().toString();
                        }
                        return text;
                    };

                    function textMod() {

                        function textEffect() {
                            let selected = getSelectionText();
                            let text = this.parentNode.parentNode.querySelector('textarea');
                            let effect = this.getAttribute('name');
                            let regex = new RegExp(`<${effect}>|<\/${effect}>`, 'g')
                            let selectedN;
                            if (selected == '') {
                                return;
                            } else if (regex.test(selected)) {
                                selectedN = selected.replace(regex, '');
                                let activeEl = document.activeElement;
                                let len = Math.abs(selectedN.length - selected.length)
                                let SS = activeEl.selectionStart,
                                    SE = activeEl.selectionEnd - len;
                                text.value = text.value.replace(selected, selectedN);
                                activeEl.selectionStart = SS
                                activeEl.selectionEnd = SE
                            } else {
                                selectedN = `<${effect}>${selected}</${effect}>`;
                                let activeEl = document.activeElement;
                                let len = Math.abs(selectedN.length - selected.length);
                                let SS = activeEl.selectionStart,
                                    SE = activeEl.selectionEnd + len;
                                text.value = text.value.replace(selected, selectedN);
                                activeEl.selectionStart = SS;
                                activeEl.selectionEnd = SE;
                            }
                        };

                        var textMod = document.createElement('div')
                        textMod.setAttribute('class', 'textMod');
                        textMod.addEventListener('mousedown', function (event) {
                            event.stopPropagation();
                            event.preventDefault();
                        })

                        var textModB = document.createElement('input')
                        textModB.setAttribute('class', 'textModBtn');
                        textModB.setAttribute('name', 'b');
                        textModB.setAttribute('type', 'button');
                        textModB.value = 'Bold';
                        textModB.onclick = textEffect;

                        var textModI = document.createElement('input')
                        textModI.setAttribute('class', 'textModBtn');
                        textModI.setAttribute('name', 'i');
                        textModI.setAttribute('type', 'button');
                        textModI.value = 'Italicize';
                        textModI.onclick = textEffect;

                        var textModU = document.createElement('input')
                        textModU.setAttribute('class', 'textModBtn');
                        textModU.setAttribute('name', 'u');
                        textModU.setAttribute('type', 'button');
                        textModU.value = 'Underline';
                        textModU.onclick = textEffect;

                        var textModS = document.createElement('input')
                        textModS.setAttribute('class', 'textModBtn');
                        textModS.setAttribute('name', 'strike');
                        textModS.setAttribute('type', 'button');
                        textModS.value = 'Strikethrough';
                        textModS.onclick = textEffect;

                        var textModS2 = document.createElement('input')
                        textModS2.setAttribute('class', 'textModBtn');
                        textModS2.setAttribute('name', 'spoiler');
                        textModS2.setAttribute('type', 'button');
                        textModS2.value = 'Spoiler';
                        textModS2.onclick = textEffect;

                        textMod.appendChild(textModB);
                        textMod.appendChild(textModI);
                        textMod.appendChild(textModU);
                        textMod.appendChild(textModS);
                        textMod.appendChild(textModS2);
                        return textMod
                    };

                    if (settings.textStyle != true) {
                        return;
                    }
                    try {
                        var chatInput = document.querySelectorAll('form.chatInputContainer');
                        Array.from(chatInput).forEach(CI => {
                            CI.addEventListener('select', function (event) {
                                try {
                                    if (document.querySelector('.textMod') != null) {
                                        return
                                    }
                                    var T = event.target
                                    var elem = new textMod()
                                    if (document.querySelector('#mainChat').contains(T)) {
                                        let aa = window.getComputedStyle(document.querySelector('form.chatInputContainer'));
                                        elem.style.bottom = parseInt(aa.getPropertyValue('padding-top').replace('px', '')) + parseInt(aa.getPropertyValue('margin-top').replace('px', '')) + 'px';
                                        //elem.style.bottom = parseInt(aa.getPropertyValue('padding-top').replace('px',''))*2+parseInt(aa.getPropertyValue('margin-top').replace('px',''))+'px';
                                    }
                                    elem.classList.add('vis');
                                    T.parentNode.parentNode.querySelector('form.chatInputContainer')
                                    T.parentNode.parentNode.insertBefore(elem, T.parentNode.parentNode.querySelector('form.chatInputContainer'));
                                } catch (error) {
                                    console.log('erx', error)
                                };
                            });
                            CI.querySelector('textarea').addEventListener('keyup', function (event) {
                                if (!CI.querySelector('.textMod') == null) {
                                    return;
                                };
                                if (CI.querySelector('.textMod') != null && CI.querySelector('textarea').value == '') {
                                    CI.querySelector('.textMod').remove();
                                }
                            })
                        });

                        document.addEventListener('mousedown', function (event) {
                            if (
                                event.target.getAttribute('name') == 'chapterTitle' ||
                                event.target.closest('.addAchievement') ||
                                event.target.closest('.nextLive') ||
                                event.target.closest('.editStory') ||
                                event.target.closest('.collectionForm') ||
                                event.target.closest('.choicesInterface') ||
                                event.target.closest('#storyTagsAndFilters') ||
                                event.target.closest('#innerAlertSearch')) {
                                return
                            }
                            try {
                                if (document.querySelector('#confBox').contains(event.target)) {
                                    return;
                                };
                            } catch (error) { };
                            var list = event.target.classList;
                            if (event.target.tagName == 'INPUT' || list.contains('textModBtn')) {
                                //event.preventDefault();

                            } else if (list.contains('textMod') || list.contains('chatInput') || event.target.closest('form') != null) {
                                if (getSelectionText() == '') {
                                    if (document.querySelector('.textMod') != null) {
                                        document.querySelector('.textMod').remove()
                                    }
                                }
                            } else {
                                if (document.querySelector('.textMod') != null) {
                                    document.querySelector('.textMod').remove()
                                }
                            }
                        });
                    } catch (error) {
                        console.log(error)
                    };
                };

                function chatHide() {
                    if (settings.autoHide != true) {
                        return;
                    };
                    if (FL_Script.observerTC != undefined) {
                        observerTC.disconnect();
                    }
                    try { }
                    catch (error) { }
                    var observerTC = new MutationObserver(function (mutations) {
                        for (let mutation of mutations) {
                            if (!document.querySelector('#mainChat')) {
                                continue
                            }
                            try {
                                let hideChatBTN = document.getElementsByClassName('section row themeControls')[0].children[3];
                                if (hideChatBTN != (undefined || null)) {
                                    //console.log('hideChatBTN')
                                    hideChatBTN.click();
                                    observerTC.disconnect();
                                }
                            } catch (error) { };
                        }
                    });
                    observerTC.observe(document, {
                        childList: true,
                        subtree: true
                    })

                };

                function messageFocus(message) {
                    try {
                        message.addEventListener('mouseup', function (event) {
                            var messageAwait = new MutationObserver(function (mutations) {
                                for (let mutation of mutations) {
                                    try {
                                        let id = message.querySelector('.chatMsg').getAttribute('data-id')
                                        let focus;
                                        try {
                                            focus = document.querySelector('.chatItemDetail[data-id="' + id + '"]')
                                            if (focus != (null || undefined)) {
                                                messageAwait.disconnect();
                                                imageLinkButton();
                                            }
                                        } catch (error) {
                                            console.log('messageFocus error', error)
                                        }
                                    } catch (error) { };
                                }
                            });
                            messageAwait.observe(document.body, {
                                childList: true
                            })
                        }, false);
                    } catch (error) { }
                };

                function purgeButton() {
                    try {
                        if (settings.messageBlacklist != true) {
                            try {
                                document.querySelector('.purgeButton').remove();
                            } catch (error) { };
                            return;
                        };
                        if (document.querySelector('#mainChat .pagination-dropdown .purgeButton')) {
                            return;
                        };
                        var purge = document.createElement('a');
                        purge.setAttribute('class', 'settings btn dim-font-color hover-font-color purgeButton');
                        purge.setAttribute('title', 'Click to run the chat black/ban lists after adding any entries.');
                        purge.onclick = function () {
                            FL_Script.deleteListedMessages();
                        }
                        purge.innerText = 'Purge Messages'

                        var main = document.querySelector('#mainChat .pagination-dropdown');
                        if (main == null) {
                            setTimeout(function () {
                                main = document.querySelector('#mainChat .pagination-dropdown');
                                if (!document.querySelector('.purgeButton')) {
                                    main.appendChild(purge);
                                }
                            }, 5000);
                        } else {
                            main.appendChild(purge);
                        };
                    } catch (error) { }
                };

                purgeButtonAdd = purgeButton;

                function waitForChat() {
                    //waits for chat to exist
                    var observerChat = new MutationObserver(awaitChat);
                    observerChat.observe(document, {
                        childList: true,
                        subtree: true
                    })
                    function awaitChat(mutations) {
                        function observeChat() {
                            try {
                                var chat = document.querySelector('#mainChat').querySelector('article.chatLog').children[0];
                                var observerChatExist = new MutationObserver(function (mutations) {
                                    for (let mutation of mutations) {
                                        try {
                                            if (mutation.removedNodes.length != 0 && mutation.removedNodes[0].tagName != undefined) {
                                                //console.log(mutation.removedNodes[0])
                                            }
                                            if (mutation.addedNodes.length != 0) {
                                                chat = document.querySelector('#mainChat').querySelector('article.chatLog').children[0];
                                                if (mutation.addedNodes[0].tagName == 'DIV' &&
                                                    mutation.addedNodes[0].classList.contains('jadeRepeat')) {
                                                    whenNewMessage(chat.querySelector('div.jadeRepeat'));
                                                    withOldMessage(chat.querySelector('div.jadeRepeat'))

                                                }
                                            }
                                        } catch (error) {
                                            console.log('new thing error', error)
                                            console.log('chat.querySelector(div.jadeRepeat)', chat.querySelector('div.jadeRepeat'))
                                        };
                                    }
                                });
                                observerChatExist.observe(document.querySelector('#mainChat').querySelector('article.chatLog'), {
                                    childList: true,
                                    subtree: true
                                })
                            } catch (error) {
                                console.log(error)
                            }
                        };
                        for (let mutation of mutations) {
                            try {
                                var chat = document.querySelector('article.chatLog').querySelector('div.jadeRepeat');
                            } catch (TypeError) { };
                            if (chat && chat !== (undefined || null) && chat.length != 0) {
                                observerChat.disconnect();
                                if (settings.messageBlacklist == true) {
                                    purgeButton();
                                }
                                var chatLog = document.querySelectorAll('article.chatLog');
                                for (var i = 0; i < chatLog.length; i++) {
                                    whenNewMessage(chatLog[i].querySelector('div.jadeRepeat'));
                                    withOldMessage(chatLog[i].querySelector('div.jadeRepeat'));
                                    textStyle();
                                    setTimeout(function () {
                                        observeChat();
                                    }, 1000);
                                    chatHide();
                                    newThemeChange();
                                    imageLinkButton();
                                }
                                break;
                            };
                        };
                    };
                };

                waitForChat();
            } catch (error) {
                console.log(error)
            };
        };

        function chatSend(info) {
            let host = 'https://fiction.live'
            let body = info[1];
            try {
                //var encodedBody = encodeURI(body);
                if (window.location.href.includes('beta')) {
                    host = 'https://beta.fiction.live'
                }
                fetch(host + "/api/anonkun/dice", {
                    "credentials": "include",
                    "headers": {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0",
                        "Accept": "*/*",
                        "Accept-Language": "en-GB,en;q=0.5",
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    "referrer": window.location.href,
                    "body": body,
                    "method": "POST",
                    "mode": "cors"
                });
            } catch (error) {
                console.log('Error with chatSend', error);
            }
            try {
                let chapterID = info[0][0]
                let dataID = info[0][1]
                let roll = info[0][2]
                var cookies = document.cookie;
                cookies = cookies.split("; ")
                for (let i = 0; i < cookies.length; i++) {
                    var cookie = cookies[i].split("=")
                    if (/.*distinct_id.*/.test(cookie)) {
                        var cookieName = cookie[0].replace(/_posthog/, '')
                        cookieName = cookieName.replace('ph_', '')
                    }
                }
                fetch(host + "/api/node", {
                    "credentials": "include",
                    "headers": {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0",
                        "Accept": "*/*",
                        "Accept-Language": "en-GB,en;q=0.5",
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    "referrer": `https://fiction.live/stories/${body}`,
                    "body": encodeURI(`r[]=${chapterID}&r[]=${dataID}&nt=chat&b=/roll+`) + encodeURIComponent(`${roll}`) + encodeURI(`&ra[hide]=true&ra[_id]=${dataID}&ra[b]=chapter+${dataID}`),
                    "method": "POST",
                    "mode": "cors"
                });
            } catch (error) {
                console.log('Error with RollSend', error);
            }
        };

        ///////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////FEATURE FUNCTIONS/////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        function darkCheck() {
            if (/\-dark/.test(document.head.querySelector('link[rel="stylesheet"]').href)) {
                FL_Script.darkMode = true;
            } else {
                FL_Script.darkMode = false;
            }
        };

        function getUser() {
            try {
                if (window.ty.currentUser.name) {
                    USERNAME = window.ty.currentUser.name;
                    return USERNAME;
                }
            } catch (error) { }
            if (document.querySelector('.user')) {
                //console.log(document.querySelector('.user').href.replace(/.*user\//,''))
                try {
                    USERNAME = document.querySelector('.user').href.replace(/.*user\//, '')
                    return USERNAME
                } catch (error) {
                    console.log('Username detect 1 failed', error);
                };
            }
            try {
                var cookies = document.cookie;
                cookies = cookies.split("; ")
                for (let i = 0; i < cookies.length; i++) {
                    var cookie = cookies[i].split("=")
                    if (/.*distinct_id.*/.test(cookie)) {
                        var cookieName = cookie[0].replace(/_posthog/, '')
                        cookieName = cookieName.replace('ph_', '')
                        USERNAME = JSON.parse(decodeURIComponent(cookie[1])).distinct_id
                        break
                    }
                }
                return USERNAME
            } catch (error) {
                console.log('Username detect 1 failed', error);
                return '-'
            };
        };

        function tooltipGen(desc) {
            var tip = document.createElement('span')
            tip.classList.add('toolt');
            tip.innerText = '?';
            tip.title = desc;
            return tip
        };

        function sortQuestTags() {
            //ignore this
            var list = document.querySelector('span.tags');
            var l2 = [...list.children];
            var l3 = l2.filter(
                function (value, index, arr) {
                    if (value.className !== 'tag more ng-scope') {
                        return value
                    };
                });
            l3.sort((a, b) => a.innerText > b.innerText ? 1 : -1).forEach(node => list.appendChild(node));
        };

        function blacklistRemove(item) {
            if (settings.alertBlacklist.includes(item)) {
                let position = settings.alertBlacklist.indexOf(item);
                settings.alertBlacklist.splice(position, 1);
                localStorage.setItem('FL_Settings', JSON.stringify(settings));
            };
        };

        function removeNSFW() {
            // console.log('nsfw',settings.removeNSFW)
            if (settings.removeNSFW == true) {
                Array.from(document.getElementsByClassName('nsfwCover')).forEach(qst => qst.classList.remove('nsfwCover'));
            }
        };

        function repeatChecker() {
            try {
                let thisPage = window.location.href;
                if (thisPage !== lastURL) {
                    try {
                        questCheck.observerQst.disconnect();
                    } catch (error) { }
                    try {
                        questCheck.observerTopic.disconnect();
                    } catch (error) { }
                    pageCheck();
                    lastURL = window.location.href;
                };
            } catch (error) {
                console.log('Error with repeatChecker', error);
            };
        };

        function authorCheck(quest) {
            if (quest == null) {
                console.log('Quest is NULL.');
                return;
            }
            if (/fiction.live\/explore|reviews.*/.test(window.location.href)) {
                return
            }
            var author = quest.querySelector('div.authorPane');
            if (author == null) {
                try {
                    author = quest.parentNode.parentNode.querySelector('span.name').innerText
                    quest = quest.parentNode.parentNode.parentNode
                } catch (error) {
                    console.log('authorCheck Null', {
                        quest
                    }, error)
                };
            } else {
                try {
                    author = author.innerText;
                } catch (error) {
                    console.log('authorCheck text fail', error)
                }
            }
            if (settings.authorBlacklist.includes(author)) {
                try {
                    if (quest.parentNode == null) {
                        console.log('Null parent')
                        return
                    }
                    try {
                        if (quest.parentNode.classList.contains('ng-scope') && quest.parentNode.tagName == 'LI') {
                            try {
                                quest.parentNode.remove()
                            } catch (error) {
                                console.log('authorCheck 2 fail', error)
                            }
                        } else {
                            quest.remove()
                        }
                    } catch (error) {
                        console.log('authorCheck 3 fail', error)
                    }
                } catch (error) {
                    console.log('authorCheck remove', error)
                };

            };
        };

        function tagCheck(quest) {
            var tagsContainer = quest.querySelector('.tags');
            if (tagsContainer == null) {
                let tag = quest.parentNode.parentNode.querySelector('div.displayedTag');
                if (tag != null | '' | undefined) {
                    if (settings.tagBlacklist.includes(tag.innerText)) {
                        try {
                            while (true) {
                                if (quest.parentNode == null) {
                                    break;
                                }
                                if (quest.parentNode.classList.contains('ng-scope') && quest.parentNode.tagName == 'LI') {
                                    quest.parentNode.remove();
                                    break;
                                } else {
                                    quest = quest.parentNode;
                                }
                            }
                            return;
                        } catch (error) {
                            console.log('tagCheck remove', error);
                        };
                    };
                    return;

                } else {
                    return;
                };
            };

            var tags = tagsContainer.children;
            for (let i = 0; i < tags.length; i++) {
                if (settings.tagBlacklist.includes(tags[i].innerText)) {
                    var title = quest.querySelector('h2').innerText;
                    var classes = Array.from(quest.classList);
                    try {
                        //quest.parentNode.parentNode.remove();

                        //return
                        //await new Promise(r => setTimeout(r, 20000));
                        if (!quest.classList || !quest.classList.contains('storyListItem')) {
                            //console.log('Type 1',{title, classes});
                            tagsContainer.parentNode.parentNode.parentNode.remove();
                        } else {
                            //console.log('Type 2',{title, classes});
                            tagsContainer.parentNode.parentNode.parentNode.remove();
                        }
                    } catch (error) {
                        console.log('tagCheck remove', {
                            title,
                            classes
                        }, error);
                    };
                    break;
                };
            };
        };

        function removeBlacklisted() {
            let quests = document.querySelectorAll('div.storyListItem');
            for (let i = 0; i < quests.length; i++) {
                if (settings.questRemove == true) {
                    tagCheck(quests[i]);
                }
                if (settings.questAuthorRemove == true) {
                    authorCheck(quests[i]);
                }
            };
        };

        function liveRestore() {
            var navBar = document.querySelector('[id="mainMenuReplacement"][class="navbar navbar-default navbar-fixed-top"]');
            var liveTimer = document.querySelectorAll('[class="next-live ng-scope"]');
            var myLive = document.createElement('div');
            myLive.setAttribute('id', 'liveBox');
            if (document.querySelector('#liveBox')) {
                document.querySelector('#liveBox').appendChild(liveTimer[0].children[0])
                return;
            }
            darkCheck()
            if (FL_Script.darkMode == true) {
                myLive.classList.add('dark')
            }
            while (liveTimer[0].children.length > 0) {
                myLive.appendChild(liveTimer[0].children[0]);
            }
            navBar.appendChild(myLive);
            liveTimer[0].style.display = 'none';
        };

        function questCheck() {
            if (settings.questRemove !== true && settings.questAuthorRemove !== true && settings.removeNSFW !== true) {
                return;
            }
            try {
                var options = {
                    childList: true,
                    subtree: true
                };
                function qstMod(mutations) {
                    for (let mutation of mutations) {
                        try {
                            var quest = mutation.addedNodes[0];
                            if (quest) {
                                try {
                                    if (quest.classList.contains('storiesList') || quest.closest('nav')) {
                                        return;
                                    }
                                    if (quest.classList.contains('storyListItem') && !quest.classList.contains('checked')) {
                                        removeBlacklisted();
                                        if (settings.questRemove == true) {
                                            tagCheck(quest);
                                        }
                                        if (settings.questAuthorRemove == true) {
                                            authorCheck(quest);
                                        }
                                        removeNSFW();
                                        try {
                                            quest.classList.add('checked');
                                        } catch (error) {
                                            console.log('error', error)
                                        }
                                    } else if (quest.nodeName == 'DIV' && quest.childNodes[0].classList.contains('storiesList')) {
                                        //console.log(quest)
                                        //console.log(quest.querySelectorAll('.storyListItem'))
                                        Array.from(quest.childNodes[0].children).forEach(qstBlock => {
                                            //console.log('QB',qstBlock)
                                            if (settings.questRemove == true) {
                                                if (quest) {
                                                    tagCheck(qstBlock);
                                                }
                                            }
                                            try {
                                                if (settings.questAuthorRemove == true) {
                                                    if (quest.querySelector('.storyListItem') != null) {
                                                        authorCheck(qstBlock);
                                                    }
                                                }
                                            } catch (error) {
                                                console.log(error)
                                            }
                                        })
                                    } else if (quest.parentNode.classList.contains('storyListItem') && !quest.parentNode.classList.contains('checked')) {
                                        try {
                                            if (settings.questRemove == true) {
                                                tagCheck(quest);
                                            }
                                            if (settings.questAuthorRemove == true) {

                                                authorCheck(quest);
                                            }
                                            removeNSFW();
                                            try {
                                                quest.parentNode.classList.add('checked');
                                            } catch (error) {
                                                console.log('error', error)
                                            }

                                        } catch (error) {
                                            console.log('error', error)
                                        }

                                    } else if (quest.parentNode.parentNode.parentNode.parentNode.classList.contains('storyListItem') && /.*fiction.live\/$/.test(URL)) {
                                        if (settings.questRemove == true) {
                                            if (quest) {
                                                tagCheck(quest);
                                            }
                                        }
                                        try {
                                            if (settings.questAuthorRemove == true) {
                                                if (quest) {
                                                    authorCheck(quest);
                                                }
                                            }
                                        } catch (error) {
                                            console.log(error)
                                        }
                                        removeNSFW();

                                    } else if (quest.querySelector('.storyListItem') != null && !quest.querySelector('.storyListItem').classList.contains('checked')) {
                                        //return
                                        // For fiction.live
                                        if (settings.questRemove == true) {
                                            if (quest) {
                                                tagCheck(quest.querySelector('.storyListItem'));
                                            }
                                        }
                                        try {
                                            if (settings.questAuthorRemove == true) {
                                                if (quest.querySelector('.storyListItem') != null) {
                                                    authorCheck(quest.querySelector('.storyListItem'));
                                                }
                                            }
                                        } catch (error) {
                                            console.log(error)
                                        }
                                        removeNSFW();
                                        try {
                                            if (quest.querySelector('.storyListItem')) {
                                                quest.querySelector('.storyListItem').classList.add('checked');
                                            }
                                        } catch (error) {
                                            console.log('error', quest, error)
                                        }
                                    }
                                } catch (error) {
                                    //console.log('If this appears more than twice, make an issue.')
                                    if (error instanceof TypeError) { }
                                    else {
                                        console.log(error)
                                    }
                                }

                            }
                            //observerMessage.disconnect();
                        } catch (error) {
                            console.log('New quest Error', error);
                        }

                    };
                };
                var observerQst = new MutationObserver(qstMod);
                observerQst.observe(document, options);
                questCheck.observerQst = observerQst;
                removeBlacklisted();
            } catch (error) {
                console.log('questCheck', error)
            };

        };

        function exploreBlacklistCheck() {
            function checkTagGroup(x) {
                if (settings.tagBlacklist.includes(x.querySelector('h2').innerText.replace('/', ''))) {
                    x.remove();
                } else {
                    var tags = x.getElementsByClassName('displayedTag');
                    let tt = function (tag) {
                        if (settings.tagBlacklist.includes(tag.innerText)) {
                            tag.closest('.embla__slide').remove()
                        }
                    }
                    Array.from(tags).forEach(tag => {
                        tt(tag)
                    });
                }

            }

            function elementAwaitExplore(mutations) {
                for (let mutation of mutations) {
                    try {
                        let topic = mutation.addedNodes[0];
                        if (topic) {
                            try {
                                if (!mutation.addedNodes[0] ||
                                    mutation.addedNodes == null ||
                                    mutation.addedNodes == undefined ||
                                    mutation.addedNodes.length == 0 ||
                                    ('#comment', '#text').includes(mutation.addedNodes[0].nodeName)) {
                                    return;
                                }
                                // console.log(topic)
                                if (!topic.classList) {
                                    continue
                                };
                                if (topic.classList.contains('popular-tags-list')) {
                                    observerTopic.disconnect();
                                    Array.from(topic.children).forEach(tag => {
                                        checkTagGroup(tag)
                                    });
                                    removeNSFW()
                                };

                            } catch (error) {
                                console.log(error)
                            }

                        }
                    } catch (error) {
                        console.log('New quest Error', error);
                    }

                };
            };

            let observerTopic = new MutationObserver(elementAwaitExplore);
            observerTopic.observe(document, {
                childList: true,
                subtree: true
            });
            questCheck.observerTopic = observerTopic;
        };

        function foryouBlacklistCheck() {
            function checkTag(storyListing) {
                try {
                    var tag = storyListing.getElementsByClassName('displayedTag')[0]
                    if (!tag || tag.length == 0) {
                        return
                    }
                    if (settings.tagBlacklist.includes(tag.innerText)) {
                        storyListing.parentNode.remove()
                    }
                } catch (error) { }
            };
            function checkAuthor(storyListing) {
                try {
                    var name = storyListing.querySelector('span.name').innerText
                    if (!name || name.length == 0) {
                        return
                    }
                    if (settings.authorBlacklist.includes(name)) {
                        storyListing.parentNode.remove()
                    }
                } catch (error) { }
            };

            function elementAwaitForYou(mutations) {
                for (let mutation of mutations) {
                    try {
                        var topic = mutation.addedNodes[0];
                        if (topic) {
                            try {
                                if (!topic.classList) {
                                    return
                                }
                                if (topic.classList.contains('storyListItem')) { }
                                var SLIs = document.getElementsByClassName('storyListItem');
                                //console.log('SLIs',SLIs)
                                if (!SLIs || topic.id != 'main') {
                                    continue
                                };
                                if (SLIs) {
                                    observerTopicx.disconnect();
                                    Array.from(SLIs).forEach(SLI => {
                                        checkTag(SLI)
                                    });
                                    Array.from(SLIs).forEach(SLI => {
                                        checkAuthor(SLI)
                                    });
                                    removeNSFW();
                                };
                            } catch (error) {
                                console.log(error);
                            }
                        }
                        removeNSFW();
                    } catch (error) {
                        console.log('New quest Error', error);
                    }
                };
            };

            let observerTopicx = new MutationObserver(elementAwaitForYou);
            observerTopicx.observe(document, {
                childList: true,
                subtree: true
            });
            questCheck.observerTopic = observerTopicx;
        };

        function storyThings() {
            //Detects when the content of a quest is displayed, the rolls/text
            var options = {
                childList: true,
                subtree: true
            };
            var observeDoc = new MutationObserver(function (mutations) {
                for (let mutation of mutations) {
                    try {
                        if (!mutation.addedNodes[0] ||
                            mutation.addedNodes == null ||
                            mutation.addedNodes == undefined ||
                            mutation.addedNodes.length == 0 ||
                            mutation.addedNodes[0].nodeName == ('#comment' || '#text') ||
                            mutation.addedNodes[0].classList.contains('blacklist')) {
                            return;
                        }

                        if (mutation.addedNodes[0].classList.contains('nextLive') ||
                            mutation.target.tagName == 'head' ||
                            mutation.target.tagName == 'ins') {
                            return;
                        } else {
                            //console.log(mutation.addedNodes[0]);
                            var node = mutation;
                        }

                        if (node.addedNodes[0].tagName == 'footer') {
                            //console.log(node)
                        }

                        if (node.addedNodes[0].classList.contains('storyListItem')) {
                            //console.log(node);
                            fetchQuestInfo(node.addedNodes[0]);

                        }

                        var storyPosts = document.getElementById('storyPosts');
                        if (storyPosts.children.length != 0 && typeof (storyPosts.children[0]) != undefined && storyPosts != undefined) {
                            observeDoc.disconnect();
                            checkStory(storyPosts.children[0]);
                            // console.log('storyPosts.children[0]', storyPosts.children[0])
                            monitorStory(storyPosts.children[0]);
                            //break;
                        }
                    } catch (error) {
                        //console.log('errST',mutation,error)
                    };
                }
            });
            if (FL_Script.observeDoc) {
                FL_Script.observeDoc.disconnect();
            }
            FL_Script.observeDoc = observeDoc.observe(document, options);

            async function fetchQuestInfo(questNode) {
                try {
                    let questID = questNode.href.match('.*\/stories\/.*\/(.*)\/?')[1];
                    await fetch("https://fiction.live/api/node/" + questID, {
                        "credentials": "include",
                        "headers": {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0",
                            "Accept": "application/json, text/plain, */*",
                            "Accept-Language": "en-GB,en;q=0.5",
                            "Cache-Control": "max-age=0"
                        },
                        "referrer": "https://fiction.live/stories/A-Hopefully-Super-Simple-Quest/NADtB24rEMDR8ybY9",
                        "method": "GET",
                        "mode": "cors"
                    }).then(response => response.json())
                        .then(r => {
                            let QM = r.u[0].n;
                            //console.log(questNode,QM);
                            if (settings.authorBlacklist.includes(QM)) {
                                questNode.remove()
                            };
                        })
                } catch (error) {
                    console.log('fetchQuestInfo Error')
                }
            }

            function createRollButton(roll) {
                var inp = document.createElement('input');
                inp.setAttribute('type', 'button');
                inp.setAttribute('class', 'rollButton');
                if (FL_Script.darkMode == true) {
                    inp.style = 'height:auto;width:auto;margin:1;padding:1;background:rgb(57, 60, 89);';
                } else {
                    inp.style = 'height:auto;width:auto;margin:1;padding:1;background:rgb(255, 172, 71);';
                }
                inp.value = 'Roll ' + roll;
                inp.onclick = function () {
                    var latestUpdate = document.querySelector('div#storyPosts').firstChild.lastChild;
                    var poll = latestUpdate.firstChild.firstChild;
                    if (latestUpdate.classList.contains('readerPost') == false || poll.classList.contains('closed')) {
                        return;
                    } else if (!(poll.classList.contains('closed'))) {
                        var dataID = this.closest('article').getAttribute('data-id');
                        var chapterID = document.querySelector('article.threads').getAttribute('threads');
                        chapterID = chapterID.replace(/\/.*/, '');
                        var rollSend = `/roll ${roll}`;
                        var template = `sid=${chapterID}&dice=${encodeURIComponent(rollSend)}`;
                        chatSend([[chapterID, dataID, roll], template]);
                    }
                    this.style.display = 'none';
                };
                return inp
            };

            function imageInsert(element) {
                try {
                    if (/\[.*\]/.test(element.innerText)) {
                        let info = element.innerText.replace(/(\[|\])/g, '').split(',')
                        if (!/.*\.(gif|jpe?g|bmp|png|webp|webm|apng|jfif|pjpeg|pjp|svg|bmp|cur|ico|tif|tiff)$/igm.test(info[0])) {
                            return
                        };
                        let image = document.createElement('img');
                        image.src = info[0]
                        let q = document.createElement('br');
                        // console.log(info)
                        if (info[1].toString().toLowerCase() == 'hide') {
                            let hidden = document.createElement('input');
                            hidden.value = 'Show hidden image, potential spoilers.'
                            hidden.setAttribute('type', 'button');
                            hidden.onclick = function () {
                                try {
                                    if (this.parentNode.lastChild != this) {
                                        this.parentNode.insertBefore(q, this.nextSibling)
                                    };
                                    this.replaceWith(this.children[0]);
                                } catch (error) {
                                    console.log(error)
                                };
                            };
                            hidden.appendChild(image);
                            element.replaceWith(hidden);
                        } else {
                            if (element.parentNode.lastChild != element) {
                                element.parentNode.insertBefore(q, element.nextSibling);
                            }
                            element.replaceWith(image);
                        }
                    };
                } catch (error) {
                    console.log(error)
                };
            };

            function imageInsertbtn() {
                let li = document.createElement('li')
                let btn = document.createElement('button');
                btn.setAttribute('class', 'fa fa-photo');
                btn.setAttribute('tooltip-position', 'top');
                btn.setAttribute('tooltip-content', 'Add an image to the quest visible only to script users. Pick show or hide depending if the image is a spoiler.');
                btn.onclick = function () {
                    let p = document.createElement('p')
                    p.setAttribute('class', 'aaaaax');
                    p.innerText = '[ImageURLhere,Show/Hide]';
                    try {
                        if (window.getSelection().anchorNode.tagName != 'DIV') {
                            window.getSelection().anchorNode.parentNode.append(p);
                        } else {
                            window.getSelection().anchorNode.append(p);
                        }
                    } catch (error) {
                        console.log(error)
                        //console.log(window.getSelection().anchorNode)
                    }

                };
                li.appendChild(btn);
                return li;
            };

            function checkStory(storyPosts) {
                try {
                    for (let post of storyPosts.childNodes) {
                        if (post.className.includes('chapter') && post.innerText.match(/\[.*\]/)) {
                            post.querySelectorAll('p').forEach(p => imageInsert(p))
                        };
                    }
                } catch (error) {
                    console.log('Error with checkStory');
                }
            }

            function monitorStoryQM() {
                document.querySelectorAll('.medium-editor-toolbar').forEach(tb => {
                    let btn = new imageInsertbtn;
                    tb.children[0].insertBefore(btn, tb.children[0].children[tb.children[0].children.length - 1]);
                });

                let A = document.createElement('div');
                A.setAttribute('class', 'monitorStoryQM');
                document.body.appendChild(A);
                let options = {
                    childList: true
                };
                let observeToolbars = new MutationObserver(function (mutations) {
                    for (let mutation of mutations) {
                        try {
                            if (mutation.addedNodes.length != 0) {
                                let node = mutation.addedNodes[0];
                                if (node.classList.contains('medium-editor-toolbar')) {
                                    let btn = new imageInsertbtn;
                                    node.children[0].insertBefore(btn, node.children[0].children[node.children[0].children.length - 1]);
                                };
                            }
                        } catch (error) {
                            console.log('monitorStory Error', error);
                        };
                    };
                });
                observeToolbars.observe(document.body, options);
            };
            let addInsert = function (event) {
                document.removeEventListener("dblclick", addInsert, false);
                let QM = document.querySelector('.goLive');
                let Started = document.querySelector('.monitorStoryQM');
                if (Started) {
                    return
                };
                if (QM) {
                    monitorStoryQM()
                };
            };
            document.addEventListener("dblclick", addInsert, false);

            async function pollRemove(pollID, pollChoice) {
                await fetch("https://fiction.live/api/anonkun/editChapter", {
                    "credentials": "include",
                    "headers": {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0",
                        "Accept": "*/*",
                        "Accept-Language": "en-GB,en;q=0.5",
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    "referrer": "https://fiction.live/stories/a/R2LDsDTBHEcSt2vmn",
                    "body": `_id=${pollID}&update%5B%24addToSet%5D%5BxOut%5D=${pollChoice}`,
                    "method": "POST",
                    "mode": "cors"
                })
                await fetch("https://fiction.live/api/anonkun/editChapter", {
                    "credentials": "include",
                    "headers": {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0",
                        "Accept": "*/*",
                        "Accept-Language": "en-GB,en;q=0.5",
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    "referrer": "https://fiction.live/stories/a/R2LDsDTBHEcSt2vmn",
                    "body": `_id=${pollID}&update%5B%24set%5D%5BxOutReasons.${pollChoice}%5D=`,
                    "method": "POST",
                    "mode": "cors"
                });
                await fetch("https://fiction.live/api/anonkun/editChapter", {
                    "credentials": "include",
                    "headers": {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0",
                        "Accept": "*/*",
                        "Accept-Language": "en-GB,en;q=0.5",
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    "referrer": "https://fiction.live/stories/a/R2LDsDTBHEcSt2vmn",
                    "body": `_id=${pollID}&update%5B%24set%5D%5Bchoices.${pollChoice}%5D=permanentlyRemoved`,
                    "method": "POST",
                    "mode": "cors"
                });

            }

            function monitorStory(storyPosts) {
                function rollPro(roll, elm) {
                    elm.querySelector('.chapterContent').appendChild(createRollButton(roll));
                    setTimeout(function () {
                        elm.querySelector('.rollButton').remove()
                    }, 60000);
                };

                function sortPoll(table) {
                    var l3 = [...table.children].filter(
                        function (value, index, arr) {
                            if (value.className !== '') {
                                //Ignore the 'Votes' header
                                return value;
                            };
                        });
                    //Order the poll by total votes
                    l3.sort((a, b) => parseInt(a.querySelector('span[data-hint="Total Votes"]').innerText) < parseInt(b.querySelector('span[data-hint="Total Votes"]').innerText) ? 1 : -1).forEach(node => table.appendChild(node));
                };
                //Checks if new posts are saying that there is a roll, if so, add a button to roll.
                let options = {
                    childList: true
                };
                var observerPosts = new MutationObserver(function (mutations) {
                    for (let mutation of mutations) {
                        //console.log('mutop')
                        try {
                            try {
                                if (!FL_Script.customA) {
                                    FL_Script.customA = true;
                                }
                            } catch (error) { }
                            if (mutation.addedNodes.length != 0) {
                                let elm = mutation.addedNodes[0];
                                console.log('OP new', elm)
                                var diceRegex = /[0-9]+d[0-9]+(?<!1d1)((\+|\-)[0-9]+)?( ?)(([ie]+)?([ut][0-9]+)?)+/g;
                                //If text post like an update
                                if (elm.className.includes('chapter choice')) {
                                    //console.log('2');
                                    //Auto sort poll results by votes
                                    console.log('A poll has been created.')
                                    let pollState = elm.children[0].children[0];
                                    console.log({
                                        pollState
                                    })
                                    let pollID = pollState.getAttribute('data-id');
                                    let observePoll = new MutationObserver(function (mutations) {
                                        for (let mutation of mutations) {
                                            try {
                                                if (mutation.addedNodes[0] && mutation.addedNodes[0].className == "poll") {
                                                    // console.log("new poll mut", mutation)
                                                    let poll = mutation.addedNodes[0];
                                                    if (document.querySelector("span.author").innerText.includes(USERNAME)) {
                                                        poll.querySelectorAll("td").forEach(option => {
                                                            if (option.closest("tr").classList &&
                                                                option.closest("tr").classList.contains("xOut")) { }
                                                            else {
                                                                //console.log("polling",option.innerText);
                                                            }

                                                        })
                                                    }
                                                }
                                                //When the poll gets closed, sort the results and start a timer to stop monitoring.
                                                //console.log(mutation)
                                                if (pollState.className.includes('closed')) {
                                                    //console.log('sort')
                                                    let table = pollState.querySelector('tbody');
                                                    //sortPoll(table);
                                                    //setInterval(function(){try{observePoll.disconnect}catch(e){}},120000)
                                                };
                                            } catch (error) {
                                                console.log(error);
                                            };
                                        };
                                    });
                                    observePoll.observe(pollState, {
                                        attributes: true,
                                        childList: true,
                                        subtree: true
                                    });
                                } else if (elm.className.includes('chapter')) {
                                    //console.log('OP2')
                                    //console.log('1')
                                    if (settings.diceButton == true && diceRegex.test(elm.innerText)) {
                                        //console.log('OP3')

                                        let rolls = elm.innerText.match(diceRegex);
                                        rolls.forEach(roll => rollPro(roll, elm))

                                    }
                                    if (elm.innerText.match(/\[.*\]/)) {
                                        elm.querySelectorAll('p').forEach(p => imageInsert(p))
                                    };
                                    continue
                                } else if (elm.querySelector('.fieldBody > b')) {
                                    console.log('3');
                                    continue;
                                } else if (diceRegex.test(elm.innerText)) {
                                    if (settings.diceButton == true) {
                                        let rolls = elm.innerText.match(diceRegex);
                                        rolls.forEach(roll => rollPro(roll, elm))
                                    };
                                };
                            };
                        } catch (error) {
                            console.log('monitorStory Error', error);
                        };
                    };
                });
                if (FL_Script.monSto != undefined) {
                    observerPosts.disconnect();
                };
                observerPosts.observe(storyPosts, options);
                FL_Script.monSto = observerPosts;
            };
        };

        function pageCheck() {
            try {
                window.FL_ULA()
            } catch (error) { }
            try {
                let URL = window.location.href;
                if ((/.*(fiction.live\/stories\/).*/.test(URL))) {
                    chatThings();
                    waitForTimer();
                    storyThings();
                } else if (/.*(fiction.live$)/.test(URL)) {
                    questCheck();
                } else if (/.*(fiction.live\/stories\/?).*/.test(URL) || /.*(fiction.live\/.*\?.*(contentRating|storyStatus|rInteract|sort)).*/.test(URL)) {
                    questCheck();
                } else if (/.*(fiction.live\/social\/(threads\/)?).*/.test(URL)) {
                    changeTopicLinks();
                    removeBlankTopics();
                    chatThings();
                } else if (/.*(fiction.live\/live\?).*/.test(URL)) {
                    questCheck();
                } else if (/.*(fiction.live\/social).*/.test(URL)) {
                    changeTopicLinks();
                    removeBlankTopics();
                } else if (/.*fiction.live\/$/.test(URL)) {
                    questCheck();
                } else if (/.*fiction.live\/explore/.test(URL)) {
                    exploreBlacklistCheck();
                } else if (/.*fiction.live\/foryou/.test(URL)) {
                    foryouBlacklistCheck();
                } else if (/.*fiction.live\/user\/.*\/(stories$||collections\/.*)/.test(URL)) {
                    questCheck();
                    removeNSFW();
                } else if (/.*fiction.live\/reviews/.test(URL)) {
                    questCheck()
                } else {
                    console.log('Page currently has no specific functions.');
                }
            } catch (error) {
                console.log('Error with pageCheck', error);
            };
        };

        function removeBlankTopics() {
            if (settings.removeBlankTopics !== true) {
                return;
            };
            try {
                var options = {
                    childList: true,
                    subtree: true
                };
                function topicWatch(mutations) {
                    for (let mutation of mutations) {
                        try {
                            let topic = mutation.addedNodes[0];
                            if (topic) {
                                try {
                                    if (typeof (topic.classList) == 'undefined') { }
                                    else if (topic.classList.contains('threadList')) {
                                        let topicItem = topic.querySelectorAll('li.threadListItem');
                                        for (let i = 0; i < topicItem.length; i++) {
                                            if (topicItem[i].querySelector('div.row.title.header').innerText.length == 0) {
                                                topicItem[i].remove();
                                            };
                                        };
                                    };
                                } catch (error) {
                                    console.log(error);
                                };
                            };
                        } catch (error) {
                            console.log('New quest Error', error);
                        };
                    };
                };
                let observerTopic = new MutationObserver(topicWatch);
                observerTopic.observe(document, options);
                questCheck.observerTopic = observerTopic;
            } catch (error) {
                console.log('topicCheck', error)
            };
        };

        function changeTopicLinks() {
            // console.log('x', settings.changeTopicLinks)
            if (settings.changeTopicLinks !== true) {
                return;
            };
            try {
                var options = {
                    childList: true,
                    subtree: true
                };
                function topicWatch(mutations) {
                    for (let mutation of mutations) {
                        try {
                            let topic = mutation.addedNodes[0];
                            if (topic) {
                                try {
                                    //the threadlist contains all the topics, no TL no topics
                                    if (!mutation.addedNodes[0] ||
                                        mutation.addedNodes == null ||
                                        mutation.addedNodes == undefined ||
                                        mutation.addedNodes.length == 0 ||
                                        !mutation.addedNodes[0].classList ||
                                        !mutation.addedNodes[0].classList.contains('threadList')) {
                                        continue;
                                    }
                                    // console.log('topic', topic)
                                    function humgolonumgus() {
                                        var topicItem = topic.querySelectorAll('li.threadListItem');
                                        topicItem.forEach(topic => {
                                            topic.querySelector('a.postItem').target = '';
                                        })
                                    }
                                    var topicItem = topic.querySelectorAll('li.threadListItem');
                                    if (topicItem.length == 0) {
                                        setTimeout(humgolonumgus, 1000)
                                    }
                                    topic.querySelectorAll('li.threadListItem').forEach(topic => {
                                        topic.querySelector('a.postItem').target = '';
                                    })
                                } catch (error) {
                                    console.log(error);
                                };
                            };
                        } catch (error) {
                            console.log('New quest Error', error);
                        };
                    };
                };
                let observerTopic = new MutationObserver(topicWatch);
                observerTopic.observe(document, options);
            } catch (error) {
                console.log('changeTopicLinks', error)
            };
        };

        function newThemeChange() {
            if (settings.useThemeChange != true) {
                return;
            };
            if (FL_Script.TChange == true) {
                return;
            };
            //return
            function cookieCreate(name, value, days) {
                var expires;
                if (days) {
                    var date = new Date();
                    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                    expires = "; expires=" + date.toGMTString();
                } else {
                    expires = "";
                }
                document.cookie = name + "=" + value + expires + "; path=/";
            };
            document.addEventListener("mousedown", function (event) {
                if (settings.useThemeChange != true) {
                    return;
                };
                try {
                    let themeBTN = document.querySelector('[ng-click="changeTheme()"]');
                    if (themeBTN == (null || undefined) || !themeBTN.contains(event.target)) {
                        return;
                    }
                    darkCheck();
                    let style = document.head.querySelector('link[rel="stylesheet"]')
                    if (FL_Script.darkMode == true) {
                        style.href = style.href.replace('style-dark.css', 'style.css');
                        cookieCreate('themeColor', 'default', '300')
                    } else {
                        style.href = style.href.replace('style.css', 'style-dark.css');
                        cookieCreate('themeColor', 'dark', '300')
                    }
                } catch (error) {
                    console.log('newThemeChange.', error)
                };
            });
            try {
                let themeBTN = document.querySelector('[ng-click="changeTheme()"]');
                if (themeBTN != null || undefined) {
                    themeBTN.outerHTML = themeBTN.outerHTML;
                }
            } catch (error) {
                console.log(error)
            };
        };

        function imageLinkButton() {
            if (settings.imageLink != true) {
                try {
                    document.querySelector('.linkImg').remove()
                } catch (error) { };
                return;
            };
            //if (!/.*fiction.live.stories\/.*\/.*/.test(window.location)){return;};
            if (document.querySelector('.chatInputContainer') == null) {
                setTimeout(imageLinkButton(), 1000);
                return;
            }
            if (document.querySelectorAll('.chatInputContainer').length == null) {
                setTimeout(imageLinkButton(), 1000);
                return;
            };
            //if (document.querySelector('.linkImg')){return;}
            function imageSend(info) {
                try {
                    let chapterID = info[0]
                    let dataID = info[1]
                    let imageURL = info[2]
                    let body = encodeURI(`r[]=${chapterID}&r[]=${dataID}&nt=chat&`) + `i=${imageURL}` + encodeURI(`&ra[hide]=true&ra[_id]=${dataID}&ra[b]=chapter+${dataID}`)
                    if (!chapterID) {
                        body = encodeURI(`&r[]=${dataID}&nt=chat&`) + `i=${imageURL}`
                    }
                    fetch("https://fiction.live/api/node", {
                        "headers": {
                            "User-Agent": "",
                            "Accept": "*/*",
                            "Accept-Language": "en-GB,en;q=0.5",
                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                            "X-Requested-With": "XMLHttpRequest"
                        },
                        "body": body,
                        "method": "POST",
                        "mode": "cors"
                    });
                } catch (error) {
                    console.log('Error with RollSend', error);
                }
            };
            document.querySelectorAll('.chatInputContainer').forEach(x => {
                try {
                    var inp = document.createElement('div');
                    inp.setAttribute('class', 'linkImg');
                    inp.onclick = function () {
                        if (settings.imageLink != true) {
                            try {
                                document.querySelector('.linkImg').remove()
                            } catch (error) { };
                            return;
                        };
                        try {
                            //if (document.querySelector('.linkInput')){return;};

                            var linkInputCont = document.createElement('div');
                            linkInputCont.setAttribute('class', 'linkInput');
                            var linkInputSend = document.createElement('input');
                            linkInputSend.setAttribute('type', 'button');
                            linkInputSend.value = 'Send';
                            linkInputSend.onclick = function () {
                                try {
                                    let reply = '';
                                    let imageURL = linkInput.value;
                                    //if (imageURL == '' || !/.*\.(gif|jpe?g|bmp|png|webp)$/i.test(imageURL)){return;};
                                    let dataID;
                                    if (/.*\/threads\/.*/.test(window.location)) {
                                        dataID = document.querySelector('#page-body').querySelector('article[chat]').getAttribute('chat');
                                        imageSend(['', dataID, imageURL, reply]);
                                    } else {
                                        //Old? Doesnt work now anyway
                                        //dataID = document.querySelector('div#storyPosts').firstChild.lastChild.firstChild.firstChild.getAttribute('data-id');
                                        if (this.closest('.chatItemDetail')) {
                                            let ArticleID,
                                                ReplyID,
                                                ImageURL,
                                                MessageText,
                                                MessageAuthor,
                                                MessageAuthorID;
                                            ReplyID = this.closest('.chatItemDetail').getAttribute('data-id');
                                            ArticleID = document.querySelector('div#storyPosts').firstChild.lastChild.getAttribute('data-id');
                                            let ChapterID = document.querySelector('article.threads').getAttribute('threads');
                                            //MessageAuthor = this.closest('.chatItemDetail').querySelector('.user > .content a').innerText;
                                            try {
                                                MessageText = this.closest('.chatItemDetail').querySelector('.fieldBody').innerText;
                                            } catch (error) {
                                                MessageText = null;
                                            }
                                            ChapterID = ChapterID.replace(/\/.*/, '');
                                            MessageAuthorID = '';

                                            ImageURL = imageURL
                                            let body;
                                            if (MessageText != null) {
                                                body = "r%5B%5D=" + ChapterID + "&r%5B%5D=" + ArticleID + "&r%5B%5D=" + ReplyID + "&nt=chat&i=" + ImageURL +
                                                    "&ra%5B_id%5D=" + ReplyID + "&ra%5Bb%5D=" + MessageText + "&ra%5Bu%5D%5Bn%5D=" + MessageAuthor + "&ra%5Bu%5D%5B_id%5D=" + MessageAuthorID
                                            } else {
                                                body = "r%5B%5D=" + ChapterID + "&r%5B%5D=" + ArticleID + "&r%5B%5D=" + ReplyID + "&nt=chat&i=" + ImageURL +
                                                    "&ra%5B_id%5D=" + ReplyID + "&ra%5Bu%5D%5Bn%5D=" + MessageAuthor + "&ra%5Bu%5D%5B_id%5D=" + MessageAuthorID
                                            }
                                            //+"&token=phc_yFaXlxPuv5BU2WbCujfLxNFetXTmh5DjtUesJyA28TF"
                                            //console.log(body)
                                            //return

                                            fetch("https://fiction.live/api/node", {
                                                "headers": {
                                                    "User-Agent": "",
                                                    "Accept": "*/*",
                                                    "Accept-Language": "en-GB,en;q=0.5",
                                                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                                                    "X-Requested-With": "XMLHttpRequest"
                                                },
                                                "body": body,
                                                "method": "POST",
                                                "mode": "cors"
                                            });
                                            return
                                        } else {
                                            dataID = document.querySelector('div#storyPosts').firstChild.lastChild.getAttribute('data-id');
                                            let chapterID = document.querySelector('article.threads').getAttribute('threads');
                                            chapterID = chapterID.replace(/\/.*/, '');
                                            imageSend([chapterID, dataID, imageURL]);
                                        }
                                    }
                                } catch (error) {
                                    console.log(error);
                                }
                            }

                            var linkInputExit = document.createElement('input');
                            linkInputExit.setAttribute('type', 'button');
                            linkInputExit.value = 'Exit';
                            linkInputExit.onclick = function () {
                                this.parentNode.remove()
                            }

                            var linkInput = document.createElement('textarea');
                            linkInput.setAttribute("placeholder", "Input the image link here.");
                            linkInput.setAttribute("cols", "1");
                            linkInput.setAttribute("rows", "2");

                            linkInputCont.appendChild(linkInput);
                            linkInputCont.appendChild(linkInputSend);
                            linkInputCont.appendChild(linkInputExit);

                            //document.querySelector('#right').appendChild(linkInputCont);
                            this.parentNode.appendChild(linkInputCont);

                            //imageSend([chapterID, dataID, imageURL]);

                        } catch (error) {
                            console.log(error)
                        };
                    };
                    x.children[0].after(inp);
                } catch (error) {
                    console.log(error)
                };

            })
        };

        function deleteTopicCreate() {
            let styleS = `.postForm div.formItem{display:none !important;`;
            let style = document.createElement('style');
            style.setAttribute("name", "topicHideStyle");
            try {
                if (settings.removeTopicForm == true) {
                    //let formItem = document.querySelector('div.formItem');
                    //if (formItem) {
                    //    formItem.parentNode.remove();
                    //};
                    style.appendChild(document.createTextNode(styleS));
                    document.getElementsByTagName('head')[0].appendChild(style);
                } else {
                    if (document.querySelector('[name="topicHideStyle"]')) {
                        document.querySelector('[name="topicHideStyle"]').remove();
                        style.appendChild(document.createTextNode(styleS));
                    }
                }
            } catch (error) {
                console.log('Error with removing topic form', error);
            };

        };

        function blacklistAdd() {
            let title = this.parentNode.querySelector('[set-text="item.value.value"]').textContent.replace(' went live', '');
            let author = this.parentNode.querySelector('span.user').innerText;
            let entry = title + '___' + author;
            settings.alertBlacklist.push(entry);
            localStorage.setItem('FL_Settings', JSON.stringify(settings));
            let dismiss = this.parentNode.querySelector('a.dismiss');
            simClick(dismiss);
            document.querySelector('.settingsTab[name="Alerts"]').querySelector('div.settingsBlacklist').appendChild(elementBlacklisted(entry));
        };

        function blockQuest(message) {
            if (USERNAME != document.querySelector("span.author").innerText || settings.listenTo.includes(USERNAME)) {
                return
            };
            if (message.querySelector('span.name') && settings.listenTo.includes(message.querySelector('span.name').innerText)) {
                var text = message.querySelector(".fieldBody").innerText;
                var i = "";
                var list = [];
                if (text.startsWith("bd")) {
                    i = text.split(" ");
                    settings.bidas.push(i[1]);
                    settings.bidas = [...new Set(settings.bidas)];
                    localStorage.setItem('FL_Settings', JSON.stringify(settings));
                    settings = JSON.parse(localStorage.getItem('FL_Settings'));
                    if (i.length != 3 || i[2] != "t") {
                        return;
                    };
                    list.push(i[1]);
                    i = "t";
                } else if (text == "bz") {
                    list = settings.bidas;
                    i = "t";
                } else if (text == "bc") {
                    settings.bidas = [];
                    localStorage.setItem('FL_Settings', JSON.stringify(settings));
                    settings = JSON.parse(localStorage.getItem('FL_Settings'));
                    return
                } else {
                    return;
                }
                let q = message.children[0].getAttribute("data-id");
                fetch("https://fiction.live/api/anonkun/node", {
                    "credentials": "include",
                    "headers": {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0",
                        "Accept": "application/json, text/javascript, */*; q=0.01",
                        "Accept-Language": "en-GB,en;q=0.5",
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    "referrer": "https://fiction.live/stories/a/R2LDsDTBHEcSt2vmn",
                    "body": `deleteFrom=${window.ty.currentStory.storyId}&nid=${q}`,
                    "method": "DELETE",
                    "mode": "cors"
                });
                list.forEach(thing => {
                    fetch("https://fiction.live/api/anonkun/ban", {
                        "credentials": "include",
                        "headers": {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0",
                            "Accept": "*/*",
                            "Accept-Language": "en-GB,en;q=0.5",
                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                            "X-Requested-With": "XMLHttpRequest"
                        },
                        "body": `blockFor=${thing}&blockFrom=${window.ty.currentStory.storyId}`,
                        "method": "POST",
                        "mode": "cors"
                    })
                })

            }

        }

        function blacklistCheck(alert) {
            function alertBlacklistButton(alert) {
                function createBlacklistButton() {
                    var blacklistButton = document.createElement('a');
                    blacklistButton.setAttribute('class', 'blacklist');
                    blacklistButton.innerText = '∅';
                    blacklistButton.onclick = blacklistAdd;
                    return blacklistButton
                }
                alert.childNodes[0].after(createBlacklistButton());
            };
            try {
                var title = alert.querySelector('[set-text="item.value.value"]').textContent.replace(' went live', '');
                var author = alert.querySelector('span.user').innerText;
                var dismiss = alert.querySelector('a.dismiss');
                if (settings.alertBlacklist.includes(title + '___' + author)) {
                    simClick(dismiss);
                    try {
                        dismiss.click()
                    } catch (e) { }
                    try {
                        alert.remove()
                    } catch (e) { }
                } else {
                    if (!alert.querySelector('a.blacklist')) {
                        alertBlacklistButton(alert);
                    }
                };
            } catch (error) {
                console.log('blacklist checker error', error)
            };
        };

        function updateCheck(alert) {
            if (settings.updateRequestDismiss == false) {
                return;
            } else if (alert.classList.length == 0) {
                return
            }
            try {
                var title = alert.querySelector('[set-text="item.value.value"]').innerText;
                if (/.*Looks forward to the next update for.*/.test(title)) {
                    var dismiss = alert.querySelector('a.dismiss');
                    simClick(dismiss);
                }
            } catch (error) {
                console.log('updateCheck error', error)
            };
        };

        function simClick(elem) {
            var evt = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            var canceled = !elem.dispatchEvent(evt);
        };

        function alertUpdate(alert) {
            try {
                //console.log('alert up',alert)
                if (alert.classList.length == 0) {
                    return
                }
                var dismiss = alert.querySelector('a.dismiss');
                simClick(dismiss);
            } catch (error) {
                console.log('AU Error', error)
            }
        };

        function alertSortByQM() {
            if (settings.qmSort != true) {
                if (document.querySelector('[name="sortQM"]')) {
                    document.querySelector('[name="sortQM"]').remove();
                    document.querySelector('.newAlerts').remove();
                    try {
                        FL_Script.OADC.disconnect();
                    } catch (error) { };
                }
                return
            };
            if (!document.querySelector('[name="sortQM"]')) {
                let styleS = `
            li#loginMenu div.dropdown-menu div.inner:nth-of-type(2){display:none !important;}
            li#loginMenu div.dropdown-menu div.inner.newAlerts{display:block !important;}
            `;
                let style = document.createElement('style');
                style.setAttribute("name", "sortQM");
                style.appendChild(document.createTextNode(styleS));
                document.getElementsByTagName('head')[0].appendChild(style);
            }

            function sortLIs() {
                try {
                    var sort_by_name = function (a, b) {
                        let sorted = a.querySelector('.user').innerText.localeCompare(b.querySelector('.user').innerText);
                        return sorted;
                    };
                    if (FL_Script.FLTESTUL.children.length > 1) {
                        var list = Array.from(FL_Script.FLTESTUL.children);
                        list.sort(sort_by_name);
                        for (var i = 0; i < list.length; i++) {
                            list[i].parentNode.appendChild(list[i]);
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            };

            function liGen(li) {
                var newLI = li.cloneNode(true);
                newLI.children[0].onclick = function () {
                    li.children[0].click();
                    this.closest('li').remove()
                };
                newLI.children[1].onclick = function () {
                    li.children[1].click();
                    this.closest('li').remove()
                };
                try {
                    newLI.children[2].onclick = function () {
                        li.children[2].click();
                        this.closest('li').remove()
                    };
                } catch (error) { }
                return newLI;
            };

            FL_Script.alertAddToList = function (alert) {
                try {
                    let parentNum = alert.parentNode.getAttribute('num');
                    document.querySelectorAll('.newAlerts ul')[parentNum].appendChild(new liGen(alert))
                    sortLIs();
                } catch (e) {
                    if (e instanceof TypeError) { }
                    else {
                        console.log('alertAddToList Error', e)
                    }
                }
            };

            let alerts = document.querySelector('li#loginMenu div.dropdown-menu div.inner');
            //alerts.style.display = 'none';
            var options = {
                childList: true,
                subtree: true
            };
            let observerAlerts = new MutationObserver(monitorAlerts);
            //observerAlerts.observe(alerts, options);
            function monitorAlerts(mutations) {
                for (let mutation of mutations) {
                    try {
                        if (mutation.removedNodes.length > 0) {
                            // console.log('mutie', mutation);
                            // console.log('mutie', mutation.removedNodes[0].innerText);
                            let text = mutation.removedNodes[0].innerText
                            Array.from(document.querySelector('.newAlerts').children[ulX].children).forEach(child => {
                                if (child.innerText == text) {
                                    // console.log(child, 'xaaaaa');
                                }
                            })
                            // console.log('mutie', text);
                        }
                    } catch (error) {
                        console.log('ERR--', error);
                    };

                };
            };
            FL_Script.OADC = observerAlerts;

            var newAlerts = document.createElement('div');
            newAlerts.classList.add('inner', 'newAlerts');

            var ulCount = 0;
            var ulX;
            alerts.querySelectorAll('ul').forEach(ul => {
                ul.setAttribute('num', ulCount);

                var newAlertsList = document.createElement('ul');
                newAlertsList.classList.add('feedType');
                newAlertsList.setAttribute('num', ulCount);
                if (ul.innerText.includes('went live')) {
                    FL_Script.FLTESTUL = newAlertsList;
                    ulX = ulCount;
                };

                if (ul.children.length > 0) {
                    //console.log(ul)
                    Array.from(ul.children).forEach(li => {
                        newAlertsList.append(new liGen(li));
                    })
                }

                newAlerts.append(newAlertsList);
                ulCount = ulCount + 1;
            });

            alerts.parentNode.appendChild(newAlerts);
            sortLIs();
        };

        function alertSearch() {
            if (settings.alertFilter != true) {
                try {
                    document.querySelector('#innerAlertSearch').remove()
                } catch (error) { }

                return
            }
            if (document.querySelector('#innerAlertSearch')) {
                return
            }
            var dropdown = document.querySelector('.dropdown-menu.ng-scope.dropdown');

            var settingsSearchBox = document.createElement('div');
            settingsSearchBox.setAttribute('id', 'innerAlertSearch');
            settingsSearchBox.style.width = dropdown.offsetWidth.toString();
            settingsSearchBox.style = 'background:#2a2c3b;padding-top:10px;margin-top:0;';
            settingsSearchBox.addEventListener("click", function (event) {
                event.stopPropagation();
                event.preventDefault();
            });

            var settingsAlertSearchInput = document.createElement('input');
            settingsAlertSearchInput.setAttribute("type", "text");
            settingsAlertSearchInput.setAttribute("name", "alertSearch");
            settingsAlertSearchInput.style = 'margin-bottom:10px;';
            settingsAlertSearchInput.setAttribute("placeholder", "Enter a title or QM to search.");
            settingsAlertSearchInput.oninput = function () {
                let alerts = document.querySelectorAll('.dropdown-menu ul.feedType li.feedItem');
                alerts.forEach(x => {
                    x.style.display = 'table';
                })
                let search = this.parentNode.querySelector('[name="alertSearch"]').value.toLowerCase();
                alerts.forEach(alert => {
                    let text = alert.firstChild.textContent.toLowerCase().replace('author:')
                    if (!text.includes(search)) {
                        alert.style.display = 'none';
                    } else { }
                })
            }

            var settingsAlertSearch = document.createElement('input');
            settingsAlertSearch.setAttribute("type", "button");
            settingsAlertSearch.setAttribute("class", "cssBtn");
            settingsAlertSearch.value = 'Search';
            settingsAlertSearch.style = 'font-weight: 700;border:none;';
            settingsAlertSearch.onclick = function () {
                let alerts = document.querySelectorAll('.dropdown-menu ul.feedType li.feedItem');
                alerts.forEach(x => {
                    x.style.display = 'table';
                })
                let search = this.parentNode.querySelector('[name="alertSearch"]').value.toLowerCase();
                alerts.forEach(alert => {
                    let text = alert.firstChild.textContent.toLowerCase().replace('author:')
                    if (!text.includes(search)) {
                        alert.style.display = 'none';
                    } else { }
                })
            }

            var settingsAlertSearchClear = document.createElement('input');
            settingsAlertSearchClear.setAttribute("type", "button");
            settingsAlertSearchClear.setAttribute("class", "cssBtn");
            settingsAlertSearchClear.value = 'Clear Search';
            settingsAlertSearchClear.style = 'font-weight: 700;border:none;float:right;';
            settingsAlertSearchClear.onclick = function () {
                this.parentNode.querySelector('[name="alertSearch"]').value = '';
                let alerts = document.querySelectorAll('.dropdown-menu ul.feedType li.feedItem');
                alerts.forEach(x => {
                    x.style.display = 'table';
                })

            }

            settingsSearchBox.appendChild(settingsAlertSearchInput);
            //settingsSearchBox.appendChild(settingsAlertSearch);
            settingsSearchBox.appendChild(settingsAlertSearchClear);
            dropdown.insertBefore(settingsSearchBox, dropdown.children[1])
        };

        function elementBlacklisted(element) {
            var settingsBlacklisted = document.createElement('div');
            settingsBlacklisted.setAttribute('class', 'blacklistEntry');

            var settingsBlacklistedText = document.createElement('p');
            settingsBlacklistedText.setAttribute('class', 'colors');
            settingsBlacklistedText.innerText = element;
            settingsBlacklistedText.innerText = settingsBlacklistedText.innerText.replace('___', '\nAuthor: ');

            var settingsBlacklistRemove = document.createElement('a');
            settingsBlacklistRemove.setAttribute('class', 'blacklistRemove')
            settingsBlacklistRemove.innerText = 'Remove'
            settingsBlacklistRemove.onclick = function () {
                blacklistRemove(element);
                this.parentNode.remove();
            }

            settingsBlacklisted.appendChild(settingsBlacklistedText)
            settingsBlacklisted.appendChild(settingsBlacklistRemove)
            return settingsBlacklisted
        };

        function settingsContainer() {
            function settingsDisplay() {
                try {
                    if (!document.querySelector('#confDisp')) {
                        function configDisplay() {
                            var confDisp = document.createElement('div');
                            confDisp.setAttribute('id', 'confDisp');
                            return confDisp
                        };
                        function configBox() {
                            var confBox = document.createElement('div');
                            confBox.setAttribute('id', 'confBox');
                            if (FL_Script.darkMode == true) {
                                confBox.setAttribute('class', 'dark');
                            }
                            return confBox
                        };

                        //Blacklists start here
                        //Blacklists start here
                        //Blacklists start here
                        //Blacklists start here
                        //Blacklists start here

                        function settingsUserBlacklist() {
                            var settingsTab = document.createElement('div');
                            settingsTab.setAttribute('class', 'settingsTab');
                            settingsTab.setAttribute('name', 'Chat');
                            function chatBlacklistRemove(item) {
                                if (settings.chatBlacklisted.includes(item)) {
                                    let position = settings.chatBlacklisted.indexOf(item);
                                    settings.chatBlacklisted.splice(position, 1);
                                    localStorage.setItem('FL_Settings', JSON.stringify(settings));
                                    settings = JSON.parse(localStorage.getItem('FL_Settings'));
                                };
                            };

                            function chatBlacklisted(element) {
                                try {
                                    var chatBlacklisted = document.createElement('div');
                                    chatBlacklisted.setAttribute('class', 'blacklistEntry');

                                    var chatBlacklistedText = document.createElement('p');
                                    chatBlacklistedText.setAttribute('class', 'colors');
                                    chatBlacklistedText.innerText = element;

                                    var settingsUserRemove = document.createElement('a');
                                    settingsUserRemove.setAttribute('class', 'blacklistRemove');
                                    settingsUserRemove.innerText = 'Remove';
                                    settingsUserRemove.onclick = function () {
                                        try {
                                            chatBlacklistRemove(element);
                                            this.parentNode.remove();
                                        } catch (error) {
                                            console.log('Error removing user', error)
                                        }
                                    };
                                    chatBlacklisted.appendChild(chatBlacklistedText);
                                    chatBlacklisted.appendChild(settingsUserRemove);
                                    return chatBlacklisted;
                                } catch (error) {
                                    console.log('44', error)
                                }
                            };

                            function userAddBlacklist() {
                                var settingsUserBox = document.createElement('div');
                                settingsUserBox.setAttribute('id', 'settingsBox');

                                var settingsUserInput = document.createElement('input');
                                settingsUserInput.setAttribute("type", "text");
                                settingsUserInput.setAttribute("class", "settingsInput");
                                settingsUserInput.setAttribute("placeholder", "Input username here.");

                                var settingsUserAdd = document.createElement('input');
                                settingsUserAdd.setAttribute("class", "cssBtn");
                                settingsUserAdd.setAttribute("type", "button");
                                settingsUserAdd.value = 'Add User';
                                settingsUserAdd.onclick = function () {
                                    if (settings.chatBlacklisted.includes(this.parentNode.childNodes[0].value)) {
                                        return;
                                    }
                                    settings.chatBlacklisted.push(this.parentNode.childNodes[0].value);
                                    this.parentNode.parentNode.appendChild(chatBlacklisted(this.parentNode.childNodes[0].value));
                                    this.parentNode.childNodes[0].value = "";
                                    localStorage.setItem('FL_Settings', JSON.stringify(settings));
                                    settings = JSON.parse(localStorage.getItem('FL_Settings'));
                                    removeBlacklisted();
                                };

                                settingsUserBox.appendChild(settingsUserInput);
                                settingsUserBox.appendChild(settingsUserAdd);

                                return settingsUserBox
                            };

                            function maxWordCount() {
                                var settingsBox = document.createElement('div');
                                settingsBox.setAttribute('id', 'settingsBox');

                                var settingsText = document.createElement('div');
                                settingsText.setAttribute('class', 'entryTitle');
                                settingsText.innerText = 'Message Max Character Count';

                                var settingsInput = document.createElement('input');
                                settingsInput.setAttribute("type", "text");
                                settingsInput.setAttribute("class", "settingsInput");
                                settingsInput.setAttribute("placeholder", "Maximum character count per message.");
                                settingsInput.value = settings.maxWords;

                                var settingsAdd = document.createElement('input');
                                settingsAdd.setAttribute("class", "cssBtn");
                                settingsAdd.setAttribute("type", "button");
                                settingsAdd.value = 'Set Maximum Message Length';
                                settingsAdd.onclick = function () {
                                    settings.maxWords = settingsInput.value;
                                    localStorage.setItem('FL_Settings', JSON.stringify(settings));
                                    settings = JSON.parse(localStorage.getItem('FL_Settings'));
                                };

                                var borderBottom = document.createElement('div');
                                borderBottom.setAttribute('class', 'borderBottom');

                                settingsBox.appendChild(settingsText);
                                settingsBox.appendChild(settingsInput);
                                settingsBox.appendChild(settingsAdd);
                                settingsBox.appendChild(borderBottom);

                                return settingsBox

                            };

                            function wordList(word, array) {
                                try {
                                    var blacklistContainer = document.createElement('div');
                                    blacklistContainer.setAttribute('class', 'blacklistEntry');

                                    var blacklistedText = document.createElement('p');
                                    blacklistedText.setAttribute('class', 'colors');
                                    blacklistedText.innerText = word;

                                    var blacklistRemove = document.createElement('a');
                                    blacklistRemove.setAttribute('class', 'blacklistRemove');
                                    blacklistRemove.innerText = 'Remove';
                                    blacklistRemove.onclick = function () {
                                        try {
                                            if (!settings[array].includes(word)) {
                                                return
                                            }
                                            let index = settings[array].indexOf(word);
                                            settings[array].splice(index, 1);
                                            localStorage.setItem('FL_Settings', JSON.stringify(settings));
                                            settings = JSON.parse(localStorage.getItem('FL_Settings'));
                                            this.parentNode.remove();
                                        } catch (error) {
                                            console.log('Error with wordList removal', error)
                                        }
                                    };
                                    blacklistContainer.appendChild(blacklistedText);
                                    blacklistContainer.appendChild(blacklistRemove);
                                    return blacklistContainer;
                                } catch (error) {
                                    console.log('Error with wordList', error)
                                }
                            };

                            function pollBlacklist() {
                                var divOuter = document.createElement('div');
                                divOuter.setAttribute('class', 'settingsBlacklist');

                                var info = document.createElement('div');
                                var title = document.createElement('div');
                                title.setAttribute('class', 'entryTitle');
                                title.innerText = 'Poll Blacklist';

                                var description = document.createElement('div');
                                description.setAttribute('class', 'description');
                                description.innerText = 'Any poll entries containing any of these phrases will be deleted. QM/Mod required.';
                                info.append(title)
                                info.append(description)
                                divOuter.append(info)

                                var input = document.createElement('input');
                                input.setAttribute("type", "text");
                                input.setAttribute("class", "settingsInput");
                                input.setAttribute("placeholder", "Input Phrase Here.");

                                var inputAdd = document.createElement('input');
                                inputAdd.setAttribute("class", "cssBtn");
                                inputAdd.setAttribute("type", "button");
                                inputAdd.value = 'Add A Phrase To Be Auto-Deleteted';
                                inputAdd.onclick = function () {
                                    if (settings.pollString.includes(input.value)) {
                                        return;
                                    }
                                    settings.pollString.push(input.value);
                                    divPL.appendChild(wordList(input.value, 'pollString'));
                                    input.value = "";
                                    localStorage.setItem('FL_Settings', JSON.stringify(settings));
                                    settings = JSON.parse(localStorage.getItem('FL_Settings'));
                                };

                                divOuter.append(input)
                                divOuter.append(inputAdd)

                                var divPL = document.createElement('div');
                                //bannedString + deletedString
                                settings.pollString.forEach(element => divPL.appendChild(wordList(element, 'pollString')));
                                divOuter.appendChild(divPL)

                                var borderBottom = document.createElement('div');
                                borderBottom.setAttribute('class', 'borderBottom');
                                divOuter.appendChild(borderBottom);

                                return divOuter
                            };

                            function wordBlacklist() {
                                var divOuter = document.createElement('div');
                                divOuter.setAttribute('class', 'settingsBlacklist');

                                var info = document.createElement('div');
                                var title = document.createElement('div');
                                title.setAttribute('class', 'entryTitle');
                                title.innerText = 'Word Blacklist';

                                var description = document.createElement('div');
                                description.setAttribute('class', 'description');
                                description.innerText = 'Any messages containing any of these phrases will be deleted. QM/Mod required.';
                                info.append(title)
                                info.append(description)
                                divOuter.append(info)

                                var input = document.createElement('input');
                                input.setAttribute("type", "text");
                                input.setAttribute("class", "settingsInput");
                                input.setAttribute("placeholder", "Input Phrase Here.");

                                var inputAdd = document.createElement('input');
                                inputAdd.setAttribute("class", "cssBtn");
                                inputAdd.setAttribute("type", "button");
                                inputAdd.value = 'Add A Phrase To Be Auto-Deleteted';
                                inputAdd.onclick = function () {
                                    if (settings.deletedString.includes(input.value)) {
                                        return;
                                    }
                                    settings.deletedString.push(input.value);
                                    divBL.appendChild(wordList(input.value, 'deletedString'));
                                    input.value = "";
                                    localStorage.setItem('FL_Settings', JSON.stringify(settings));
                                    settings = JSON.parse(localStorage.getItem('FL_Settings'));
                                };

                                divOuter.append(input)
                                divOuter.append(inputAdd)

                                var divBL = document.createElement('div');
                                //bannedString + deletedString
                                settings.deletedString.forEach(element => divBL.appendChild(wordList(element, 'deletedString')));
                                divOuter.appendChild(divBL)

                                var borderBottom = document.createElement('div');
                                borderBottom.setAttribute('class', 'borderBottom');
                                divOuter.appendChild(borderBottom);

                                return divOuter
                            };

                            function wordBanlist() {
                                var divOuter = document.createElement('div');
                                divOuter.setAttribute('class', 'settingsBlacklist');

                                var info = document.createElement('div');
                                var title = document.createElement('div');
                                title.setAttribute('class', 'entryTitle');
                                title.innerText = 'Word Banlist';

                                var description = document.createElement('div');
                                description.setAttribute('class', 'description');
                                description.innerText = 'Any messages containing any of these phrases will be deleted and the user banned. QM/Mod required.';
                                info.append(title)
                                info.append(description)
                                divOuter.append(info)

                                var input = document.createElement('input');
                                input.setAttribute("type", "text");
                                input.setAttribute("class", "settingsInput");
                                input.setAttribute("placeholder", "Input Phrase Here.");

                                var inputAdd = document.createElement('input');
                                inputAdd.setAttribute("class", "cssBtn");
                                inputAdd.setAttribute("type", "button");
                                inputAdd.value = 'Add A Phrase To Be Auto-Deleteted.';
                                inputAdd.onclick = function () {
                                    if (settings.bannedString.includes(input.value)) {
                                        return;
                                    }
                                    settings.bannedString.push(input.value);
                                    divBL.appendChild(wordList(input.value, 'bannedString'));
                                    input.value = "";
                                    localStorage.setItem('FL_Settings', JSON.stringify(settings));
                                    settings = JSON.parse(localStorage.getItem('FL_Settings'));
                                };

                                divOuter.append(input)
                                divOuter.append(inputAdd)

                                var divBL = document.createElement('div');
                                settings.bannedString.forEach(element => divBL.appendChild(wordList(element, 'bannedString')));
                                divOuter.appendChild(divBL)

                                var borderBottom = document.createElement('div');
                                borderBottom.setAttribute('class', 'borderBottom');
                                divOuter.appendChild(borderBottom);

                                return divOuter
                            };

                            function deleteListedMessages() {
                                FL_Script.deleteListedMessages = function () {
                                    document.querySelector('article.chatLog').querySelectorAll('.logItem').forEach(message => {
                                        let questIDregex = '.*\/stories\/.*\/(.*)\/?';
                                        let questID = document.querySelector('article.threads').getAttribute('threads') //window.location.href.match('.*\/stories\/.*\/(.*)\/?')[1];
                                        let messageID = message.querySelector('.chatMsg').getAttribute('data-id');
                                        settings.bannedString.forEach(string => {
                                            if (message.innerText.includes(string)) {
                                                fetch("https://fiction.live/api/anonkun/ban", {
                                                    "credentials": "include",
                                                    "headers": {
                                                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0",
                                                        "Accept": "*/*",
                                                        "Accept-Language": "en-GB,en;q=0.5",
                                                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                                                        "X-Requested-With": "XMLHttpRequest"
                                                    },
                                                    "body": "blockFor=" + messageID + "&blockFrom=" + questID,
                                                    "method": "POST",
                                                    "mode": "cors"
                                                });
                                                fetch("https://fiction.live/api/anonkun/node", {
                                                    "credentials": "include",
                                                    "headers": {
                                                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0",
                                                        "Accept": "application/json, text/javascript, */*; q=0.01",
                                                        "Accept-Language": "en-GB,en;q=0.5",
                                                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                                                        "X-Requested-With": "XMLHttpRequest"
                                                    },
                                                    "referrer": window.location.href,
                                                    "body": "deleteFrom=" + questID + "&nid=" + messageID,
                                                    "method": "DELETE",
                                                    "mode": "cors"
                                                });
                                                console.log('Banned & Deleted', message);
                                                //message.remove();
                                                return;
                                            }
                                        });
                                        settings.deletedString.forEach(string => {
                                            if (message.innerText.includes(string)) {
                                                fetch("https://fiction.live/api/anonkun/node", {
                                                    "credentials": "include",
                                                    "headers": {
                                                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0",
                                                        "Accept": "application/json, text/javascript, */*; q=0.01",
                                                        "Accept-Language": "en-GB,en;q=0.5",
                                                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                                                        "X-Requested-With": "XMLHttpRequest"
                                                    },
                                                    "referrer": window.location.href,
                                                    "body": "deleteFrom=" + questID + "&nid=" + messageID,
                                                    "method": "DELETE",
                                                    "mode": "cors"
                                                });
                                                console.log('Deleted', message);
                                                //message.remove();
                                            }
                                        });
                                    });
                                };
                                var divOuter = document.createElement('div');

                                var info = document.createElement('div');
                                var title = document.createElement('div');
                                title.setAttribute('class', 'entryTitle');
                                title.innerText = 'Run Blacklist';

                                var description = document.createElement('div');
                                description.setAttribute('class', 'description');
                                description.innerText = 'Activate after adding to the lists to purge older messages. QM/Mod required.';
                                info.append(title)
                                info.append(description)
                                divOuter.append(info)

                                var activate = document.createElement('input');
                                activate.setAttribute("class", "cssBtn");
                                activate.setAttribute("type", "button");
                                activate.value = 'Purge Old Matching Messages';
                                activate.onclick = function () {
                                    FL_Script.deleteListedMessages();
                                };
                                divOuter.appendChild(activate);

                                var borderBottom = document.createElement('div');
                                borderBottom.setAttribute('class', 'borderBottom');
                                divOuter.appendChild(borderBottom);

                                return divOuter

                            };

                            var settingsUserBlacklist = document.createElement('div');
                            settingsUserBlacklist.setAttribute('class', 'settingsBlacklist');
                            settings.chatBlacklisted = [...new Set(settings.chatBlacklisted)]
                            settings.chatBlacklisted.forEach(element => settingsUserBlacklist.appendChild(chatBlacklisted(element)));

                            var settingsUserBlacklistText = document.createElement('div');
                            settingsUserBlacklistText.setAttribute('class', 'entryTitle');
                            settingsUserBlacklistText.innerText = 'Chat User Blacklist';

                            settingsUserBlacklist.prepend(userAddBlacklist());
                            settingsUserBlacklist.prepend(settingsUserBlacklistText);
                            settingsTab.appendChild(maxWordCount());
                            settingsTab.appendChild(wordBlacklist());
                            settingsTab.appendChild(wordBanlist());
                            settingsTab.appendChild(deleteListedMessages());

                            settingsTab.appendChild(settingsUserBlacklist);
                            return settingsTab;
                        };

                        function settingsAuthorsBlacklist() {
                            var settingsTab = document.createElement('div');
                            settingsTab.setAttribute('class', 'settingsTab');
                            settingsTab.setAttribute('name', 'Author');
                            function authorBlacklistRemove(item) {
                                if (settings.authorBlacklist.includes(item)) {
                                    let position = settings.authorBlacklist.indexOf(item);
                                    settings.authorBlacklist.splice(position, 1);
                                    localStorage.setItem('FL_Settings', JSON.stringify(settings));
                                    settings = JSON.parse(localStorage.getItem('FL_Settings'));
                                };
                            };
                            function authorBlacklisted(element) {
                                try {
                                    var authorBlacklisted = document.createElement('div');
                                    authorBlacklisted.setAttribute('class', 'blacklistEntry')
                                    var authorBlacklistedText = document.createElement('p');
                                    authorBlacklistedText.setAttribute('class', 'colors');
                                    authorBlacklistedText.innerText = element;

                                    var settingsAuthorRemove = document.createElement('a');
                                    settingsAuthorRemove.setAttribute('class', 'blacklistRemove');
                                    settingsAuthorRemove.innerText = 'Remove';
                                    settingsAuthorRemove.onclick = function () {
                                        try {
                                            authorBlacklistRemove(element);
                                            this.parentNode.remove();
                                        } catch (error) {
                                            console.log('Error removing author', error)
                                        }
                                    };
                                    authorBlacklisted.appendChild(authorBlacklistedText);
                                    authorBlacklisted.appendChild(settingsAuthorRemove);
                                    return authorBlacklisted;
                                } catch (error) {
                                    console.log('55', error)
                                }
                            };

                            function authorAddBlacklist() {
                                var settingsAuthorBox = document.createElement('div');
                                settingsAuthorBox.setAttribute('id', 'settingsBox');

                                var settingsAuthorsInput = document.createElement('input');
                                settingsAuthorsInput.setAttribute("type", "text");
                                settingsAuthorsInput.setAttribute("class", "settingsInput");
                                settingsAuthorsInput.setAttribute("placeholder", "Input author here.");

                                var settingsAuthorsAdd = document.createElement('input');
                                settingsAuthorsAdd.setAttribute("class", "cssBtn");
                                settingsAuthorsAdd.setAttribute("type", "button");
                                settingsAuthorsAdd.value = 'Add Author';
                                settingsAuthorsAdd.onclick = function () {
                                    if (settings.authorBlacklist.includes(this.parentNode.childNodes[0].value)) {
                                        return;
                                    }
                                    settings.authorBlacklist.push(this.parentNode.childNodes[0].value);
                                    this.parentNode.parentNode.appendChild(authorBlacklisted(this.parentNode.childNodes[0].value));
                                    this.parentNode.childNodes[0].value = "";
                                    localStorage.setItem('FL_Settings', JSON.stringify(settings));
                                    settings = JSON.parse(localStorage.getItem('FL_Settings'));
                                    removeBlacklisted();
                                };

                                settingsAuthorBox.appendChild(settingsAuthorsInput);
                                settingsAuthorBox.appendChild(settingsAuthorsAdd);

                                return settingsAuthorBox
                            };

                            var settingsAuthorsBlacklist = document.createElement('div');
                            settingsAuthorsBlacklist.setAttribute('class', 'settingsBlacklist');
                            settings.authorBlacklist = [...new Set(settings.authorBlacklist)]
                            settings.authorBlacklist.sort().forEach(element => settingsAuthorsBlacklist.appendChild(authorBlacklisted(element)));

                            var settingsAuthorsBlacklistText = document.createElement('div');
                            settingsAuthorsBlacklistText.innerText = 'Authors Blacklist';
                            settingsAuthorsBlacklistText.setAttribute('class', 'entryTitle');
                            settingsAuthorsBlacklist.prepend(authorAddBlacklist());
                            settingsAuthorsBlacklist.prepend(settingsAuthorsBlacklistText);

                            settingsTab.appendChild(settingsAuthorsBlacklist)
                            return settingsTab;
                        };

                        function settingsTagsBlacklist() {
                            var settingsTab = document.createElement('div');
                            settingsTab.setAttribute('class', 'settingsTab');
                            settingsTab.setAttribute('name', 'Tags');
                            function tagBlacklistRemove(item) {
                                if (settings.tagBlacklist.includes(item)) {
                                    let position = settings.tagBlacklist.indexOf(item);
                                    settings.tagBlacklist.splice(position, 1);
                                    localStorage.setItem('FL_Settings', JSON.stringify(settings));
                                    settings = JSON.parse(localStorage.getItem('FL_Settings'));
                                };
                            };
                            function tagBlacklisted(element) {
                                try {
                                    var tagBlacklisted = document.createElement('div');
                                    tagBlacklisted.setAttribute('class', 'blacklistEntry');
                                    var tagBlacklistedText = document.createElement('p');
                                    tagBlacklistedText.setAttribute('class', 'colors');
                                    tagBlacklistedText.innerText = element;

                                    var settingsTagRemove = document.createElement('a');
                                    settingsTagRemove.setAttribute('class', 'blacklistRemove');
                                    settingsTagRemove.innerText = 'Remove';
                                    settingsTagRemove.onclick = function () {
                                        try {
                                            tagBlacklistRemove(element);
                                            this.parentNode.remove();
                                        } catch (error) {
                                            console.log('Error removing tag', error)
                                        }
                                    };
                                    tagBlacklisted.appendChild(tagBlacklistedText);
                                    tagBlacklisted.appendChild(settingsTagRemove);
                                    return tagBlacklisted;
                                } catch (error) {
                                    console.log('78', error)
                                }
                            };

                            function tagAddBlacklist() {
                                var settingsTagBox = document.createElement('div');
                                settingsTagBox.setAttribute('id', 'settingsBox');

                                var settingsTagsInput = document.createElement('input');
                                settingsTagsInput.setAttribute("type", "text");
                                settingsTagsInput.setAttribute("class", "settingsInput");
                                settingsTagsInput.setAttribute("placeholder", "Input tag here.");

                                var settingsTagsAdd = document.createElement('input');
                                settingsTagsAdd.setAttribute("class", "cssBtn");
                                settingsTagsAdd.setAttribute("type", "button");
                                settingsTagsAdd.value = 'Add Tag';
                                settingsTagsAdd.onclick = function () {
                                    if (settings.tagBlacklist.includes(this.parentNode.childNodes[0].value)) {
                                        return;
                                    }
                                    settings.tagBlacklist.push(this.parentNode.childNodes[0].value);
                                    this.parentNode.parentNode.appendChild(tagBlacklisted(this.parentNode.childNodes[0].value));
                                    this.parentNode.childNodes[0].value = "";
                                    localStorage.setItem('FL_Settings', JSON.stringify(settings));
                                    settings = JSON.parse(localStorage.getItem('FL_Settings'));
                                    removeBlacklisted();
                                };

                                settingsTagBox.appendChild(settingsTagsInput);
                                settingsTagBox.appendChild(settingsTagsAdd);

                                return settingsTagBox
                            };

                            var settingsTagsBlacklist = document.createElement('div');
                            settingsTagsBlacklist.setAttribute('class', 'settingsBlacklist');
                            settings.tagBlacklist = [...new Set(settings.tagBlacklist)]
                            settings.tagBlacklist.sort().forEach(element => settingsTagsBlacklist.appendChild(tagBlacklisted(element)));

                            var settingsTagsBlacklistText = document.createElement('div');
                            settingsTagsBlacklistText.innerText = 'Tags Blacklist';
                            settingsTagsBlacklistText.setAttribute('class', 'entryTitle');
                            settingsTagsBlacklist.prepend(tagAddBlacklist());
                            settingsTagsBlacklist.prepend(settingsTagsBlacklistText);

                            settingsTab.appendChild(settingsTagsBlacklist)
                            return settingsTab;
                        };

                        function settingsBlacklist() {
                            var settingsTab = document.createElement('div');
                            settingsTab.setAttribute('class', 'settingsTab');
                            settingsTab.setAttribute('name', 'Alerts');
                            var settingsAlertBox = document.createElement('div');
                            settingsAlertBox.setAttribute('id', 'settingsAlertBox');

                            var settingsAlertAdd = document.createElement('input');
                            settingsAlertAdd.setAttribute("type", "button");
                            settingsAlertAdd.setAttribute("class", "cssBtn");
                            settingsAlertAdd.value = 'Blacklist Current Quest';
                            settingsAlertAdd.onclick = function () {
                                try {
                                    let author = document.querySelector('span.author span.name').innerText;
                                    let title = document.querySelector('header.page-title').innerText;
                                    let entry = title + '___' + author;
                                    settings.alertBlacklist.push(entry);
                                    localStorage.setItem('FL_Settings', JSON.stringify(settings));
                                    settingsBlacklist.appendChild(elementBlacklisted(entry));

                                } catch (error) {
                                    console.log('Something went wrong when trying to blacklist this quest.', error);
                                }
                            };

                            var settingsBlacklist = document.createElement('div');
                            settingsBlacklist.setAttribute('class', 'settingsBlacklist');
                            settings.alertBlacklist = [...new Set(settings.alertBlacklist)]
                            settings.alertBlacklist.forEach(element => settingsBlacklist.appendChild(elementBlacklisted(element)));

                            var settingsBlacklistText = document.createElement('div');
                            settingsBlacklistText.innerText = 'Alert Blacklist';
                            settingsBlacklistText.setAttribute('class', 'entryTitle');

                            var settingsSearchBox = document.createElement('div');
                            settingsSearchBox.setAttribute('id', 'settingsBox');

                            var settingsAlertSearchInput = document.createElement('input');
                            settingsAlertSearchInput.setAttribute("type", "text");
                            settingsAlertSearchInput.setAttribute("class", "settingsInput");
                            settingsAlertSearchInput.setAttribute("name", "alertSearch");
                            settingsAlertSearchInput.setAttribute("placeholder", "Enter a title or QM to search.");

                            var settingsAlertSearch = document.createElement('input');
                            settingsAlertSearch.setAttribute("type", "button");
                            settingsAlertSearch.setAttribute("class", "cssBtn");
                            settingsAlertSearch.value = 'Search';
                            settingsAlertSearch.onclick = function () {
                                this.closest('.settingsBlacklist').querySelectorAll('.blacklistEntry').forEach(x => {
                                    x.style.display = 'initial';
                                })
                                let search = this.parentNode.querySelector('[name="alertSearch"]').value.toLowerCase();
                                let xx = this.closest('.settingsBlacklist').querySelectorAll('.blacklistEntry');
                                xx.forEach(x => {
                                    let text = x.firstChild.textContent.toLowerCase().replace('author:')
                                    if (!text.includes(search)) {
                                        x.style.display = 'none';
                                    } else { }
                                })
                            }

                            var settingsAlertSearchClear = document.createElement('input');
                            settingsAlertSearchClear.setAttribute("type", "button");
                            settingsAlertSearchClear.setAttribute("class", "cssBtn");
                            settingsAlertSearchClear.value = 'Clear Search';
                            settingsAlertSearchClear.onclick = function () {
                                this.parentNode.querySelector('[name="alertSearch"]').value = '';
                                this.closest('.settingsBlacklist').querySelectorAll('.blacklistEntry').forEach(x => {
                                    x.style.display = 'initial';
                                })

                            }

                            settingsSearchBox.appendChild(settingsAlertSearchInput);
                            settingsSearchBox.appendChild(settingsAlertSearch);
                            settingsSearchBox.appendChild(settingsAlertSearchClear);
                            settingsAlertBox.appendChild(settingsSearchBox);
                            settingsAlertBox.appendChild(settingsAlertAdd);
                            settingsBlacklist.prepend(settingsAlertBox);
                            settingsBlacklist.prepend(settingsBlacklistText);
                            settingsTab.appendChild(settingsBlacklist)
                            return settingsTab;
                        };

                        function settingsStyle() {
                            function genStyle(styleAttribute, styleText) {
                                var settingsStyleEntryText = document.createElement('p');
                                settingsStyleEntryText.setAttribute('class', 'styleTitle');
                                settingsStyleEntryText.innerText = styleText;

                                var settingsStylePicker = document.createElement('input');
                                settingsStylePicker.setAttribute('class', 'colorPick');
                                settingsStylePicker.setAttribute('type', 'color');
                                settingsStylePicker.onchange = function () {
                                    this.parentNode.querySelector('.colorSet').value = this.value
                                };

                                var settingsStyleInput = document.createElement('input');
                                settingsStyleInput.setAttribute('class', 'colorSet');
                                settingsStyleInput.setAttribute('type', 'text');

                                if ([styleAttribute] in settings.customCSS[0]) {
                                    settingsStyleInput.value = settings.customCSS[0][styleAttribute]
                                    settingsStylePicker.value = settings.customCSS[0][styleAttribute]
                                };

                                var settingsStyleEntry = document.createElement('div');
                                settingsStyleEntry.setAttribute('class', 'styleEntry');
                                settingsStyleEntry.setAttribute('name', styleAttribute);
                                settingsStyleEntry.appendChild(settingsStyleEntryText);
                                settingsStyleEntry.appendChild(settingsStyleInput);
                                settingsStyleEntry.appendChild(settingsStylePicker);

                                return settingsStyleEntry;
                            };

                            var settingsStyle = document.createElement('div');
                            settingsStyle.setAttribute('class', 'settingsTab');
                            settingsStyle.setAttribute('name', 'Site Style');

                            var settingsStyleText = document.createElement('div');
                            settingsStyleText.setAttribute('class', 'entryTitle');
                            settingsStyleText.innerText = 'Custom Site Style - Beta';

                            var settingsStyleTextBox = new genStyle('color', 'Text Color');
                            var settingsStyleBackgroundBox = new genStyle('background', 'Background Color');

                            var settingsStyleSave = document.createElement('input');
                            settingsStyleSave.setAttribute("type", "button");
                            settingsStyleSave.setAttribute('class', 'cssBtn');
                            settingsStyleSave.setAttribute("class", "cssBtn");
                            settingsStyleSave.onclick = function () {
                                try {
                                    try {
                                        document.querySelectorAll('.styleEntry').forEach(
                                            x => {
                                                let name = x.getAttribute("name");
                                                let value = x.querySelector('.colorSet').value;
                                                if (value !== undefined) {
                                                    settings.customCSS[0][name] = value;
                                                }
                                            });
                                    } catch (error) { }

                                    try {
                                        for (var key in settings.customCSS[0]) {
                                            if (settings.customCSS[0].hasOwnProperty(key)) {
                                                // console.log(key, settings.customCSS[0][key]);
                                            }
                                        }
                                    } catch (error) { }

                                    localStorage.setItem('FL_Settings', JSON.stringify(settings));
                                    let styleS = `*{color:${settings.customCSS[0].color}!important;background:${settings.customCSS[0].background} !important;}`;

                                    let style = document.createElement('style');
                                    style.setAttribute("name", "styleSheet");
                                    if (document.querySelector('[name="styleSheet"]')) {
                                        document.querySelector('[name="styleSheet"]').remove();
                                        style.appendChild(document.createTextNode(styleS));
                                    } else {
                                        style.appendChild(document.createTextNode(styleS));
                                    }
                                    document.getElementsByTagName('head')[0].appendChild(style);
                                } catch (error) { }
                            };
                            settingsStyleSave.value = 'Apply Styling';

                            //External CSS Stuff
                            function settingsStyleEx() {
                                function applyCSS(index, cssFile) {
                                    var style = document.createElement('link');
                                    let check = document.querySelector(`link[name="${index}"]`)
                                    if (check) {
                                        check.remove()
                                    }
                                    style.setAttribute('name', 'eCSS' + index);
                                    style.setAttribute('rel', 'stylesheet');
                                    style.setAttribute('type', 'text/css');
                                    style.href = cssFile
                                    style.appendChild(document.createTextNode(style));
                                    document.getElementsByTagName('head')[0].appendChild(style);
                                };
                                var settingsStyleEx = document.createElement('div');
                                settingsStyleEx.setAttribute('class', 'settingsStyleEx');

                                var settingsStyleExText = document.createElement('div');
                                settingsStyleExText.setAttribute('class', 'entryTitle');
                                settingsStyleExText.innerText = 'External Style Sheets';

                                var settingsStyleExDesc = document.createElement('p');
                                settingsStyleExDesc.style = 'margin:0px;font-size:12px;'
                                settingsStyleExDesc.innerText = 'Paste links to CSS files below to have them applied, in order, to the page. Or use one of the buttons below this text to apply pre-configured CSS files.';

                                var settingsStyleExAddDark = document.createElement('input');
                                settingsStyleExAddDark.setAttribute('type', 'button');
                                settingsStyleExAddDark.classList.add('class', 'ExternalLink', 'cssBtn');
                                settingsStyleExAddDark.value = 'Add old site CSS, dark mode.';
                                settingsStyleExAddDark.style = 'display:inline-block;';
                                settingsStyleExAddDark.onclick = function () {
                                    try {
                                        settingsStyleEx.insertBefore(new externalStyleLink('https://tyranical.github.io/style-dark.css'), settingsStyleEx.childNodes[settingsStyleEx.childNodes.length - 1]);
                                        localStorage.setItem('FL_Settings', JSON.stringify(settings));
                                        settings = JSON.parse(localStorage.getItem('FL_Settings'));
                                    } catch (error) {
                                        console.log('settingsStyleError DDD')
                                    }
                                };
                                var settingsStyleExAddLight = document.createElement('input');
                                settingsStyleExAddLight.setAttribute('type', 'button');
                                settingsStyleExAddLight.classList.add('class', 'ExternalLink', 'cssBtn');
                                settingsStyleExAddLight.value = 'Add old site CSS, light mode.';
                                settingsStyleExAddLight.style = 'display:inline-block;';
                                settingsStyleExAddLight.onclick = function () {
                                    try {
                                        settingsStyleEx.insertBefore(new externalStyleLink('https://tyranical.github.io/style.css'), settingsStyleEx.childNodes[settingsStyleEx.childNodes.length - 1]);
                                        localStorage.setItem('FL_Settings', JSON.stringify(settings));
                                        settings = JSON.parse(localStorage.getItem('FL_Settings'));
                                    } catch (error) {
                                        console.log('settingsStyleError LLL')
                                    }
                                };

                                function externalStyleLink(ival, initial) {
                                    try {
                                        var settingsStyleExCon = document.createElement('div');
                                        settingsStyleExCon.classList.add('eCSSRow');

                                        var settingsStyleExLink = document.createElement('input');
                                        settingsStyleExLink.setAttribute('type', 'text');
                                        settingsStyleExLink.classList.add('ExternalLink', 'eCSS')
                                        settingsStyleExLink.setAttribute('placeholder', 'Place a link to a CSS file to have it applied to the page.');
                                        if (!ival) {
                                            settingsStyleExLink.value = '';
                                        } else {
                                            settingsStyleExLink.value = ival;
                                            if (!initial) {
                                                if (settings.externalCSS.includes(ival)) {
                                                    return;
                                                };
                                                settings.externalCSS.push(ival);
                                                applyCSS(settings.externalCSS.indexOf(ival), ival);
                                            }
                                        }
                                        settingsStyleExLink.onchange = function () {
                                            try {
                                                let all_eCSS = document.querySelectorAll('.eCSS');
                                                if (all_eCSS.length > 1) {
                                                    all_eCSS.forEach(eCSS => {
                                                        var current = this;
                                                        if (eCSS == this) {
                                                            return
                                                        }
                                                        if (eCSS.value == this.value) {
                                                            current.value = 'Duplicate found and removed.';
                                                            setTimeout(function () {
                                                                if (current.value == 'Duplicate found and removed.') {
                                                                    current.value = '';
                                                                }
                                                            }, 5000);
                                                        }
                                                    })
                                                };
                                                if (/.*\.css/.test(this.value)) {
                                                    let i = Array.from(settingsStyleEx.querySelectorAll('.eCSS')).indexOf(this);
                                                    if (!settings.externalCSS[i]) {
                                                        settings.externalCSS.push(this.value);
                                                        applyCSS(i.toString(), this.value);
                                                    } else {
                                                        settings.externalCSS[i] = this.value;
                                                        applyCSS(i.toString(), this.value);
                                                    }
                                                    localStorage.setItem('FL_Settings', JSON.stringify(settings));
                                                    settings = JSON.parse(localStorage.getItem('FL_Settings'));
                                                }
                                            } catch (error) { }
                                        };

                                        var settingsStyleExLinkAdd = document.createElement('input');
                                        settingsStyleExLinkAdd.setAttribute('type', 'button');
                                        settingsStyleExLinkAdd.classList.add('class', 'ExternalLink', 'cssBtn');
                                        settingsStyleExLinkAdd.value = 'Add new Link';
                                        settingsStyleExLinkAdd.style = 'display:inline-block;';
                                        settingsStyleExLinkAdd.onclick = function () {
                                            settingsStyleEx.appendChild(new externalStyleLink)
                                        };

                                        var settingsStyleExLinkRem = document.createElement('input');
                                        settingsStyleExLinkRem.setAttribute('type', 'button');
                                        settingsStyleExLinkRem.classList.add('class', 'ExternalLink', 'cssBtn');
                                        settingsStyleExLinkRem.value = 'Remove This Link';
                                        settingsStyleExLinkRem.style = 'display:inline-block;';
                                        settingsStyleExLinkRem.onclick = function () {
                                            //Select the current external css link
                                            //Get the position of said css link in the array
                                            //Remove the css, the link in the array and the UI elements
                                            let i = Array.from(document.querySelectorAll('.eCSS')).indexOf(this.parentNode.children[0]);
                                            settings.externalCSS.splice(i, 1);
                                            try {
                                                document.querySelector(`link[name="${'eCSS' + i}"]`).remove()
                                            } catch (error) {
                                                console.log('cssRem', error)
                                            }
                                            let rows = document.querySelectorAll('.eCSSRow').length;
                                            if (rows == 1) {
                                                this.parentNode.children[0].value = ''
                                            } else {
                                                this.parentNode.remove()
                                            };
                                            localStorage.setItem('FL_Settings', JSON.stringify(settings));
                                            settings = JSON.parse(localStorage.getItem('FL_Settings'));
                                        };

                                        settingsStyleExCon.appendChild(settingsStyleExLink);
                                        settingsStyleExCon.appendChild(settingsStyleExLinkAdd);
                                        settingsStyleExCon.appendChild(settingsStyleExLinkRem);

                                        return settingsStyleExCon;
                                    } catch (error) { }
                                };

                                settingsStyleExText.appendChild(settingsStyleExDesc);
                                settingsStyleExText.appendChild(settingsStyleExAddDark);
                                settingsStyleExText.appendChild(settingsStyleExAddLight);
                                settingsStyleEx.appendChild(settingsStyleExText);
                                if (settings.externalCSS) {
                                    settings.externalCSS.forEach(css => {
                                        try {
                                            let i = settings.externalCSS.indexOf(css);
                                            var eCSS = new externalStyleLink(css, true);
                                            settingsStyleEx.appendChild(eCSS);
                                            applyCSS(i, css);
                                        } catch (error) {
                                            console.log('Error going over externalCSS', error)
                                        }
                                    })
                                }
                                settingsStyleEx.appendChild(new externalStyleLink());

                                var settingsStyleEntries = document.createElement('div');
                                settingsStyleEntries.setAttribute('id', 'styleEntries');
                                settingsStyleEntries.appendChild(settingsStyleTextBox);
                                settingsStyleEntries.appendChild(settingsStyleBackgroundBox);

                                settingsStyle.appendChild(settingsStyleText);
                                settingsStyle.appendChild(settingsStyleEntries);
                                settingsStyle.appendChild(settingsStyleSave);
                                return settingsStyleEx;
                            };

                            //Complicated CSS Stuff
                            var settingsExternalStyles = document.createElement('input');
                            settingsExternalStyles.setAttribute("type", "button");
                            settingsExternalStyles.setAttribute('class', 'cssBtn');
                            settingsExternalStyles.value = 'Toggle CSS Input';

                            var settingsStyleToggle = document.createElement('input');
                            settingsStyleToggle.setAttribute("type", "button");
                            settingsStyleToggle.setAttribute('class', 'cssBtn');
                            settingsStyleToggle.value = 'Toggle CSS Input';
                            settingsStyleToggle.onclick = function () {
                                let styleInput = document.querySelector('#styleInput');
                                let styleSaveCSS = document.querySelector('#styleSaveCSS');
                                if (styleInput.style.display != 'none') {
                                    styleInput.style.display = 'none';
                                    styleSaveCSS.style.display = 'none';
                                } else {
                                    styleInput.style.display = 'initial';
                                    styleSaveCSS.style.display = 'initial';
                                }
                            };

                            var settingsStyleBoxSave = document.createElement('input');
                            settingsStyleBoxSave.setAttribute("type", "button");
                            settingsStyleBoxSave.setAttribute('id', 'styleSaveCSS');
                            settingsStyleBoxSave.setAttribute('class', 'cssBtn');
                            settingsStyleBoxSave.value = 'Save CSS Input';
                            settingsStyleBoxSave.style.display = 'none';
                            settingsStyleBoxSave.onclick = function () {
                                let styleS = document.querySelector('#styleInput').value
                                if (styleS !== undefined) {
                                    settings.customCSS[1] = styleS;
                                }
                                localStorage.setItem('FL_Settings', JSON.stringify(settings));

                                let style = document.createElement('style');
                                style.setAttribute("name", "styleSheet");
                                if (document.querySelector('[name="styleSheet"]')) {
                                    document.querySelector('[name="styleSheet"]').remove();
                                    style.appendChild(document.createTextNode(styleS));
                                } else {
                                    style.appendChild(document.createTextNode(styleS));
                                }
                                document.getElementsByTagName('head')[0].appendChild(style);
                            };

                            var settingsStyleClear = document.createElement('input');
                            settingsStyleClear.setAttribute("type", "button");
                            settingsStyleClear.setAttribute('class', 'cssBtn');
                            settingsStyleClear.value = 'Reset Style Settings';
                            settingsStyleClear.onclick = function () {
                                try {
                                    document.querySelector('[name="styleSheet"]').remove();
                                    document.querySelectorAll('.colorPick').forEach(x => {
                                        x.value = ''
                                    });
                                    document.querySelectorAll('.colorSet').forEach(x => {
                                        x.value = ''
                                    });
                                    document.querySelector('#styleInput').value = '';
                                    settings.customCSS = [{}, ``];
                                    localStorage.setItem('FL_Settings', JSON.stringify(settings));
                                } catch (error) { }
                            };

                            var settingsStyleBox = document.createElement('textarea');
                            settingsStyleBox.setAttribute('id', 'styleInput');
                            settingsStyleBox.setAttribute('placeholder', 'Add any more complicated CSS here.');
                            settingsStyleBox.setAttribute("cols", "50");
                            settingsStyleBox.setAttribute("rows", "50");
                            settingsStyleBox.style.display = 'none';
                            if (settings.customCSS[1] !== ``) {
                                settingsStyleBox.value = settings.customCSS[1];
                            }

                            settingsStyle.appendChild(new settingsStyleEx);

                            settingsStyle.appendChild(settingsStyleToggle);
                            settingsStyle.appendChild(settingsStyleBoxSave);
                            settingsStyle.appendChild(settingsStyleClear);
                            settingsStyle.appendChild(settingsStyleBox);
                            try {
                                if (settings.customCSS[0] != {}) {
                                    let A = ''
                                    let B = ''
                                    if (settings.customCSS[0].color != undefined) {
                                        A = `color:${settings.customCSS[0].color}!important;`
                                    }
                                    if (settings.customCSS[0].background != undefined) {
                                        B = `background:${settings.customCSS[0].background} !important;}`
                                    }
                                    var styleS = `*{${A}${B}}`;
                                    if (styleS != '*{}') {
                                        var style = document.createElement('style');
                                        style.setAttribute("name", "styleSheet");
                                        if (document.querySelector('[name="styleSheet"]')) {
                                            document.querySelector('[name="styleSheet"]').remove();
                                            style.setAttribute("name", "styleSheet");
                                            style.appendChild(document.createTextNode(styleS));
                                        } else {
                                            style.appendChild(document.createTextNode(styleS));
                                        }
                                        document.getElementsByTagName('head')[0].appendChild(style);
                                    }
                                };
                            } catch (error) {
                                console.log(error)
                            }

                            try {
                                if (settings.customCSS[1] != ``) {
                                    var style2 = document.createElement('style');
                                    var styleS2 = settings.customCSS[1]
                                    if (document.querySelector('[name="styleSheet"]')) {
                                        document.querySelector('[name="styleSheet"]').remove();
                                        style2.setAttribute("name", "styleSheet");
                                        style2.appendChild(document.createTextNode(styleS2));
                                    } else {
                                        style2.setAttribute("name", "styleSheet");
                                        style2.appendChild(document.createTextNode(styleS2));
                                    }
                                    document.getElementsByTagName('head')[0].appendChild(style2);
                                }
                            } catch (error) {
                                console.log('customcss', error)
                            }

                            return settingsStyle;
                        }

                        //Toggles for features start here
                        //Toggles for features start here
                        //Toggles for features start here
                        //Toggles for features start here
                        //Toggles for features start here

                        function settingsNamefagToggle() {
                            if (settings.removeUsernames != true) {
                                return;
                            }
                            try {
                                let authorList = document.querySelectorAll('span.author.ng-scope');
                                let authors = []
                                authorList.forEach(element => authors.push(element.querySelector('span').innerText))
                                let names = document.querySelectorAll('div.user span')
                                document.querySelectorAll('div.user a img').forEach(x => {
                                    x.remove()
                                })
                                names.forEach(name => {
                                    let txt = name.innerText;
                                    if (!authors.includes(txt)) {
                                        name.innerText = 'anon';
                                    }
                                })
                            } catch (error) {
                                console.log('anonForce', error)
                            }
                        };

                        function settingsAnonToggle() {
                            function toggleAnonStatus() {
                                var x = 1
                                try {
                                    try {
                                        var username = localStorage.getItem('username');
                                        var refURL = "https://fiction.live/user/" + username;
                                        var profile = window.ty.currentUser.profile;
                                        profile.asAnon = settings.anonToggle;
                                    } catch (error) {
                                        console.log('Toggle Anon Prep', error);
                                        x = 2;
                                    };
                                    if (x = 1) {
                                        fetch("https://fiction.live/api/user", {
                                            "credentials": "include",
                                            "headers": {
                                                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0",
                                                "Accept": "application/json, text/javascript, */*; q=0.01",
                                                "Accept-Language": "en-GB,en;q=0.5",
                                                "Content-Type": "application/json",
                                                "X-Requested-With": "XMLHttpRequest"
                                            },
                                            "referrer": refURL,
                                            "body": JSON.stringify(profile),
                                            "method": "PUT",
                                            "mode": "cors"
                                        });
                                    };
                                } catch (error) {
                                    console.log('Toggle Anon Set', error);
                                };
                            };

                            var sAT = document.createElement('div');
                            sAT.setAttribute('class', 'settingsToggle');

                            var sATText = document.createElement('div');
                            sATText.innerText = 'Toggle Anon status.';

                            var sATCheckbox = document.createElement('input');
                            sATCheckbox.setAttribute("type", "checkbox");
                            sATCheckbox.setAttribute("class", "toggleCheck");
                            if (settings.anonToggle == true) {
                                sATCheckbox.checked = true;
                            };
                            sATCheckbox.addEventListener('change', (event) => {
                                if (event.target.checked) {
                                    settings.anonToggle = true;
                                    toggleAnonStatus();
                                } else {
                                    settings.anonToggle = false;
                                    toggleAnonStatus();
                                };
                                localStorage.setItem('FL_Settings', JSON.stringify(settings));
                                settings = JSON.parse(localStorage.getItem('FL_Settings'));
                            });
                            sAT.appendChild(sATText);
                            sAT.appendChild(sATCheckbox);
                            return sAT
                        };

                        function settingsLiveRestore() {
                            var sLR = document.createElement('div');
                            sLR.setAttribute('class', 'settingsToggle');

                            var sLRText = document.createElement('div');
                            sLRText.innerText = 'Restore live timer to nav bar.';

                            var sLRCheckbox = document.createElement('input');
                            sLRCheckbox.setAttribute("type", "checkbox");
                            sLRCheckbox.setAttribute("class", "toggleCheck");
                            if (settings.liveRestore == true) {
                                sLRCheckbox.checked = true;
                            };
                            sLRCheckbox.addEventListener('change', (event) => {
                                if (event.target.checked) {
                                    settings.liveRestore = true;
                                    let canvas = document.querySelector('header[class="next-live ng-scope"]');
                                    if (canvas) {
                                        liveRestore()
                                    }
                                } else {
                                    settings.liveRestore = false;
                                };
                                localStorage.setItem('FL_Settings', JSON.stringify(settings));
                                settings = JSON.parse(localStorage.getItem('FL_Settings'));
                            });
                            sLR.appendChild(sLRText);
                            sLR.appendChild(sLRCheckbox);
                            return sLR
                        };

                        function settingsQuestBlock() {
                            try {

                                let styleS = `li[class="userControls ng-scope"] > a{display:none !important;} li[class="userControls ng-scope"]{width:100px;}`;
                                let style = document.createElement('style');
                                style.setAttribute("name", "QBSS");

                                if (settings.questBlock == true) {
                                    //let formItem = document.querySelector('div.formItem');
                                    //if (formItem) {
                                    //    formItem.parentNode.remove();
                                    //};
                                    style.appendChild(document.createTextNode(styleS));
                                    document.getElementsByTagName('head')[0].appendChild(style);
                                } else {
                                    if (document.querySelector('[name="QBSS"]')) {
                                        document.querySelector('[name="QBSS"]').remove();
                                        style.appendChild(document.createTextNode(styleS));
                                    }
                                }
                            } catch (error) {
                                console.log('settingsQuestBlock', error);
                            }
                        };

                        function settingsLiveLight() {
                            var sLL = document.createElement('div');
                            sLL.setAttribute('class', 'settingsToggle');

                            var sLLText = document.createElement('div');
                            sLLText.innerText = 'Light mode live timer.';

                            var sLLCheckbox = document.createElement('input');
                            sLLCheckbox.setAttribute("type", "checkbox");
                            sLLCheckbox.setAttribute("class", "toggleCheck");
                            if (settings.liveLight == true) {
                                sLLCheckbox.checked = true;
                            };
                            sLLCheckbox.addEventListener('change', (event) => {
                                let myLive = document.querySelector('#liveBox')
                                if (event.target.checked) {
                                    settings.liveLight = true;
                                } else {
                                    settings.liveLight = false;
                                };
                                localStorage.setItem('FL_Settings', JSON.stringify(settings));
                                settings = JSON.parse(localStorage.getItem('FL_Settings'));
                            });
                            sLL.appendChild(sLLText);
                            sLL.appendChild(sLLCheckbox);
                            return sLL
                        };

                        function settingsAuthorHighlight() {
                            var sAH = document.createElement('div');
                            sAH.setAttribute('class', 'settingsToggle');

                            var sAHT = document.createElement('div');
                            sAHT.innerText = 'Highlight author(s) in chat.';

                            var sAHC = document.createElement('input');
                            sAHC.setAttribute("type", "checkbox");
                            sAHC.setAttribute("class", "toggleCheck");
                            if (settings.authorHighlight == true) {
                                sAHC.checked = true;
                            };
                            sAHC.addEventListener('change', (event) => {
                                if (event.target.checked) {
                                    settings.authorHighlight = true;
                                    try {
                                        let authorList = document.querySelectorAll('span.author.ng-scope');
                                        let authors = []
                                        authorList.forEach(element => authors.push(element.querySelector('span.name').innerText))
                                        var currentColor = settings.highlightColor;
                                        if (settings.highlightLightToggle == true) {
                                            currentColor = settings.highlightLight;
                                        }
                                        document.querySelectorAll('div.user span.name').forEach(name => {
                                            if (authors.includes(name.innerText)) {
                                                name.closest('.logItem').style.background = currentColor
                                            }
                                        })
                                    } catch (error) { }
                                } else {
                                    settings.authorHighlight = false;
                                };
                                localStorage.setItem('FL_Settings', JSON.stringify(settings));
                                settings = JSON.parse(localStorage.getItem('FL_Settings'));
                            });
                            sAH.appendChild(sAHT);
                            sAH.appendChild(sAHC);
                            return sAH
                        };

                        function settingsLightHighlight() {
                            var sLH = document.createElement('div');
                            sLH.setAttribute('class', 'settingsToggle');

                            var sLHText = document.createElement('div');
                            sLHText.innerText = 'Light mode highlighting.';

                            var sLHCheckbox = document.createElement('input');
                            sLHCheckbox.setAttribute("type", "checkbox");
                            sLHCheckbox.setAttribute("class", "toggleCheck");
                            if (settings.highlightLightToggle == true) {
                                sLHCheckbox.checked = true;
                            };
                            sLHCheckbox.addEventListener('change', (event) => {
                                if (event.target.checked) {
                                    settings.highlightLightToggle = true;
                                    try {
                                        let authorList = document.querySelectorAll('span.author.ng-scope');
                                        let authors = []
                                        authorList.forEach(element => authors.push(element.querySelector('span.name').innerText))
                                        var currentColor = settings.highlightColor;
                                        if (settings.highlightLightToggle == true) {
                                            currentColor = settings.highlightLight;
                                        }
                                        document.querySelectorAll('div.user span.name').forEach(name => {
                                            if (authors.includes(name.innerText)) {
                                                name.closest('.logItem').style.background = currentColor
                                            }
                                        })
                                    } catch (error) { }
                                } else {
                                    settings.highlightLightToggle = false;
                                };
                                localStorage.setItem('FL_Settings', JSON.stringify(settings));
                                settings = JSON.parse(localStorage.getItem('FL_Settings'));
                            });
                            sLH.appendChild(sLHText);
                            sLH.appendChild(sLHCheckbox);
                            return sLH
                        };

                        function settingsNSFWToggle() {
                            var sNSFWT = document.createElement('div');
                            sNSFWT.setAttribute('class', 'settingsToggle');

                            var sNSFWTText = document.createElement('div');
                            sNSFWTText.innerText = 'Remove NSFW covers from quests.';

                            var sNSFWTCheckbox = document.createElement('input');
                            sNSFWTCheckbox.setAttribute("type", "checkbox");
                            sNSFWTCheckbox.setAttribute("class", "toggleCheck");
                            if (settings.removeNSFW == true) {
                                sNSFWTCheckbox.checked = true;
                            };
                            sNSFWTCheckbox.addEventListener('change', (event) => {
                                if (event.target.checked) {
                                    settings.removeNSFW = true;
                                    removeNSFW();
                                } else {
                                    settings.removeNSFW = false;
                                };
                                localStorage.setItem('FL_Settings', JSON.stringify(settings));
                                settings = JSON.parse(localStorage.getItem('FL_Settings'));
                            });
                            sNSFWT.appendChild(sNSFWTText);
                            sNSFWT.appendChild(sNSFWTCheckbox);
                            return sNSFWT
                        };

                        function dismissAlertUpdateRequest() {
                            try {
                                if (settings.updateRequestDismiss == true) {
                                    let alertContainer = document.querySelectorAll('li.feedItem');
                                    alertContainer.forEach(alert => {
                                        if (/.*Looks forward to the next update for.*/.test(alert.innerText)) {
                                            alertUpdate(alert);
                                        };
                                    });
                                }
                            } catch (error) {
                                console.log('Error with removing update request', error);
                            };
                        };

                        function dismissAlertReview() {
                            try {
                                if (settings.reviewDismiss == true) {
                                    let alertContainer = document.querySelectorAll('li.feedItem');
                                    alertContainer.forEach(alert => {
                                        if (/.*New review for.*/.test(alert.innerText)) {
                                            alertUpdate(alert);
                                        };
                                    });
                                }
                            } catch (error) {
                                console.log('Error with removing review alert', error);
                            };
                        };

                        function dismissAlertFollow() {
                            try {
                                if (settings.followDismiss == true) {
                                    let alertContainer = document.querySelectorAll('li.feedItem');
                                    alertContainer.forEach(alert => {
                                        if (/.*Is now a new follower of yours.*/.test(alert.innerText)) {
                                            alertUpdate(alert);
                                        };
                                    });
                                }
                            } catch (error) {
                                console.log('Error with removing follow alert', error);
                            };
                        };

                        function dismissAlertLike() {
                            try {
                                if (settings.likeDismiss == true) {
                                    let alertContainer = document.querySelectorAll('li.feedItem');
                                    alertContainer.forEach(alert => {
                                        if (/.*Likes \".*\".*/.test(alert.innerText)) {
                                            alertUpdate(alert);
                                        };
                                    });
                                }
                            } catch (error) {
                                console.log('Error with removing follow alert', error);
                            };
                        };

                        function settingsAkunPlusToggle() {
                            var sAPT = document.createElement('div');
                            sAPT.setAttribute('class', 'settingsToggle');

                            var sAPTText = document.createElement('div');

                            var sAPTBtn = document.createElement('input');
                            sAPTBtn.setAttribute("type", "button");
                            sAPTBtn.setAttribute("class", "toggleBtn");

                            if (settings.akunPlus == 'Ignore') {
                                sAPTText.innerText = '(Chat) Ignore Akun Premium';
                                sAPTBtn.value = 'Remove';
                            } else if (settings.akunPlus == 'Remove') {
                                sAPTText.innerText = '(Chat) Remove Akun Premium';
                                sAPTBtn.value = 'Global';
                            } else {
                                sAPTText.innerText = '(Chat) Global Akun Premium';
                                sAPTBtn.value = 'Ignore';
                            };
                            sAPTBtn.onclick = function () {
                                try {
                                    if (settings.akunPlus == 'Ignore') {
                                        this.parentNode.childNodes[0].innerText = '(Chat) Remove Akun Premium';
                                        this.value = 'Global';
                                        settings.akunPlus = 'Remove';
                                    } else if (settings.akunPlus == 'Remove') {
                                        this.parentNode.childNodes[0].innerText = '(Chat) Global Akun Premium';
                                        this.value = 'Ignore';
                                        settings.akunPlus = 'Global';
                                    } else {
                                        this.parentNode.childNodes[0].innerText = '(Chat) Ignore Akun Premium';
                                        this.value = 'Remove';
                                        settings.akunPlus = 'Ignore';
                                    };
                                    localStorage.setItem('FL_Settings', JSON.stringify(settings));
                                    settings = JSON.parse(localStorage.getItem('FL_Settings'));
                                } catch (error) {
                                    console.log('Error changin akunPlus', error);
                                };
                            };
                            sAPT.appendChild(sAPTText);
                            sAPT.appendChild(sAPTBtn);
                            return sAPT
                        };

                        function settingsNewThemeChangeToggle() {
                            var settingsToggle = document.createElement('div');
                            settingsToggle.setAttribute('class', 'settingsToggle');

                            var settingsText = document.createElement('div');
                            settingsText.innerText = 'Change themes without page reload.';

                            var settingsCheckbox = document.createElement('input');
                            settingsCheckbox.setAttribute("type", "checkbox");
                            settingsCheckbox.setAttribute("class", "toggleCheck");
                            if (settings.useThemeChange == true) {
                                settingsCheckbox.checked = true;
                            };

                            settingsCheckbox.addEventListener('change', (event) => {
                                if (event.target.checked) {
                                    settings.useThemeChange = true;
                                    try {
                                        newThemeChange();
                                    } catch (error) {
                                        console.log(error)
                                    }
                                } else {
                                    settings.useThemeChange = false;
                                };
                                localStorage.setItem('FL_Settings', JSON.stringify(settings));
                                settings = JSON.parse(localStorage.getItem('FL_Settings'));
                            });
                            settingsToggle.appendChild(settingsText);
                            settingsToggle.appendChild(settingsCheckbox);
                            return settingsToggle
                        };

                        function settingsImageLinkToggle() {
                            var settingsToggle = document.createElement('div');
                            settingsToggle.setAttribute('class', 'settingsToggle');

                            var settingsText = document.createElement('div');
                            settingsText.innerText = 'Display off-site image poster in chat input.';

                            var settingsCheckbox = document.createElement('input');
                            settingsCheckbox.setAttribute("type", "checkbox");
                            settingsCheckbox.setAttribute("class", "toggleCheck");
                            if (settings.imageLink == true) {
                                settingsCheckbox.checked = true;
                            };

                            settingsCheckbox.addEventListener('change', (event) => {
                                if (event.target.checked) {
                                    settings.imageLink = true;
                                    imageLinkButton();
                                } else {
                                    settings.imageLink = false;
                                };
                                localStorage.setItem('FL_Settings', JSON.stringify(settings));
                                settings = JSON.parse(localStorage.getItem('FL_Settings'));
                            });
                            settingsToggle.appendChild(settingsText);
                            settingsToggle.appendChild(settingsCheckbox);
                            return settingsToggle
                        };

                        //Toggle Template/Example
                        function settingsToggle(text, toggled, desc, func) {
                            if (!func) {
                                func = function () { }
                            }
                            try {
                                var settingsToggle = document.createElement('div');
                                settingsToggle.setAttribute('class', 'settingsToggle');

                                var settingsText = document.createElement('div');
                                settingsText.innerText = text;

                                var settingsCheckbox = document.createElement('input');
                                settingsCheckbox.setAttribute("type", "checkbox");
                                settingsCheckbox.setAttribute("class", "toggleCheck");
                                if (settings[toggled] == true) {
                                    settingsCheckbox.checked = true;
                                };

                                settingsCheckbox.addEventListener('change', (event) => {
                                    if (event.target.checked) {
                                        settings[toggled] = true;
                                    } else {
                                        settings[toggled] = false;
                                    };
                                    localStorage.setItem('FL_Settings', JSON.stringify(settings));
                                    settings = JSON.parse(localStorage.getItem('FL_Settings'));
                                    func();
                                });
                                settingsToggle.appendChild(settingsText);
                                settingsToggle.appendChild(settingsCheckbox);

                                if (desc) {
                                    settingsToggle.appendChild(new tooltipGen(desc));
                                }
                                try {
                                    func();
                                } catch (error) {
                                    console.log('Error with ', func, ' in settingsToggle.')
                                }
                                return settingsToggle;
                            } catch (error) {
                                console.log('Error, does', toggled, 'exist?')
                            }
                        };

                        function settingsActual() {
                            var settingsActual = document.createElement('div');
                            settingsActual.setAttribute('class', 'settingsTab');
                            settingsActual.setAttribute('name', 'General');
                            settingsActual.style.display = 'initial';

                            var settingsActualText = document.createElement('div');
                            settingsActualText.innerText = 'General Script Settings';
                            settingsActualText.setAttribute('class', 'entryTitle');

                            //Settings Checkboxes
                            settingsActual.appendChild(new settingsToggle('Automatically dismiss quest update request alerts.', 'updateRequestDismiss', 'Dismisses update request alerts as soon as possible.', dismissAlertUpdateRequest));
                            settingsActual.appendChild(new settingsToggle('Automatically dismiss review alerts.', 'reviewDismiss', 'Dismisses review alerts as soon as possible.', dismissAlertReview));
                            settingsActual.appendChild(new settingsToggle('Automatically dismiss follow alerts.', 'followDismiss', 'Dismisses user follow alerts as soon as possible.', dismissAlertFollow));
                            settingsActual.appendChild(new settingsToggle('Automatically dismiss like alerts.', 'likeDismiss', 'Dismisses user like alerts as soon as possible.', dismissAlertLike));
                            settingsActual.appendChild(settingsNSFWToggle());
                            settingsActual.appendChild(settingsLiveRestore());
                            //Hidden because of dark mode detection
                            //settingsActual.appendChild(settingsLiveLight());
                            settingsActual.appendChild(new settingsToggle('Toggle creation of dice buttons.', 'diceButton', 'Creates a button that rolls a dice, if the QM creates a post containing a roll.'));
                            settingsActual.appendChild(new settingsToggle('Remove blank topics.', 'removeBlankTopics'));
                            settingsActual.appendChild(new settingsToggle('Open topics in the current tab.', 'changeTopicLinks'));
                            settingsActual.appendChild(new settingsToggle('Hides "Post Your Thoughts" form.', 'removeTopicForm', 'Hides the topic creation form, "Post Your Thoughts", in the Alerts tab.', deleteTopicCreate));
                            settingsActual.appendChild(new settingsToggle('Hide quests with blacklisted tags.', 'questRemove', 'Any quests with a tag in the blacklist will be removed from results.'));
                            settingsActual.appendChild(new settingsToggle('Hide tagged on author pages.', 'removeTaggedAuthor', 'Hide quests with blacklisted tags on author pages.'));
                            settingsActual.appendChild(new settingsToggle('Hide quests with blacklisted authors.', 'questAuthorRemove'));
                            settingsActual.appendChild(new settingsToggle('Enable alert filtering.', 'alertFilter', 'Lets you search alerts for a phrase, like QM or quest name.', alertSearch));
                            settingsActual.appendChild(new settingsToggle('Order alerts by QM name.', 'qmSort', 'Orders all story alerts alphabetically by QM name.', alertSortByQM));
                            settingsActual.appendChild(new settingsToggle('(Chromium) Attempt to fix the line spacing issue.', 'spaceFix', 'Fixes the chrome-based browser only spacing issue when you create a new line using Shift+Enter.'));
                            settingsActual.appendChild(new settingsToggle('Hide "+ New Story" button.', 'questBlock', 'Hides the new story button.', settingsQuestBlock));
                            settingsActual.appendChild(settingsNewThemeChangeToggle());
                            settingsActual.appendChild(new settingsToggle('Auto import default blacklists.', 'importDefaults', 'Import the default chat and QM blacklists.', importDefaults));

                            var settingsText = document.createElement('div');
                            settingsText.innerText = 'Chat Settings';
                            settingsText.setAttribute('class', 'entryTitle');

                            settingsActual.appendChild(settingsText);
                            settingsActual.appendChild(settingsAnonToggle());
                            settingsActual.appendChild(new settingsToggle('Toggle Auto Roller.', 'autoRoller', 'Automatically duplicate dice rolls.'));
                            settingsActual.appendChild(settingsAuthorHighlight());
                            //Hidden because of dark mode detection
                            //settingsActual.appendChild(settingsLightHighlight());
                            settingsActual.appendChild(new settingsToggle('Make everyone anon.', 'removeUsernames', 'Change all usernames to anon and remove icons.', settingsNamefagToggle));
                            settingsActual.appendChild(new settingsToggle('Attempt to reveal anon usernames in chat.', 'userReveal'));
                            settingsActual.appendChild(new settingsToggle('Enable the delete button on your messages.', 'unpublishBTN', 'Allows quick message deletion.'));
                            settingsActual.appendChild(new settingsToggle('Hide blacklisted users in chat.', 'chatBlacklist', 'Messages from blacklisted users will be hidden to you.'));
                            settingsActual.appendChild(new settingsToggle('Remove replies to blacklisted users.', 'chatBlacklistReplies', 'Replies to messages from blacklisted users will be hidden to you.'));
                            settingsActual.appendChild(settingsAkunPlusToggle());
                            settingsActual.appendChild(new settingsToggle('Resize images in chat.', 'imageResize', 'Automatically resizes images posted to chat to make them larger.'));
                            settingsActual.appendChild(new settingsToggle('Make text links functional.', 'functionalLinks', 'Turns text links into clickable links.'));
                            settingsActual.appendChild(new settingsToggle('Make video links functional.', 'functionalVideos', 'Turns supported video links into playable videos in chat.'));
                            settingsActual.appendChild(new settingsToggle('Allow message editing in chat.', 'messageEdit', 'Allows you to edit messages in chat.'));
                            settingsActual.appendChild(new settingsToggle('Toggle in-chat text options.', 'textStyle', 'Allows you to modify your messages with bold, italic, underlined, spoiler and strike-through text.'));
                            settingsActual.appendChild(new settingsToggle('Enable automatic chat hide.', 'autoHide', 'Hide chat when you open a quest.'));
                            settingsActual.appendChild(settingsImageLinkToggle());
                            settingsActual.appendChild(new settingsToggle('Enable spam auto delete.', 'spamRemoval', 'Deletes any messages over a set length that appear in chat. Change the length under the \'Chat\' tab.'));
                            settingsActual.appendChild(new settingsToggle('Enable auto-delete and ban phrases.', 'messageBlacklist', 'Enables the \'Purge Messages\' button, to manually trigger the list check and removal of matches.',
                                purgeButtonAdd));
                            settingsActual.appendChild(new settingsToggle('Remove user icons that are gifs.', 'gifDisable'));
                            settingsActual.appendChild(new settingsToggle('Enable SauceNao buttons on images.', 'imgSourceBtn', 'Hovering over an image will create a button to find the image source.'));
                            //settingsActual.appendChild(new settingsToggle('test',));


                            settingsActual.prepend(settingsActualText);

                            return settingsActual
                        }

                        var settingsTop = document.createElement('div');
                        settingsTop.setAttribute('id', 'scriptTitle');


                        var settingsTopText = document.createElement('h1');
                        settingsTopText.innerText = 'Script Config - Script Version ' + scriptVersion;
                        settingsTop.appendChild(settingsTopText);

                        var settingsTopText2 = document.createElement('p');
                        settingsTopText2.style = "margin-left:10px;border-bottom: thick solid red !important;";
                        settingsTopText2.innerText = 'I, tyrannus, have been site banned because kas can only overreact. Script updates are critcal issues only.';
                        settingsTop.appendChild(settingsTopText2);

                        try {
                            var settingsSelect = document.createElement('div');
                            settingsSelect.setAttribute("class", "settingsSelect");
                            var settingsTabs = ['General', 'Tags', 'Chat', 'Alerts', 'Author', 'Site Style'];
                            let tabC = 0;
                            function createTab(tab) {
                                let settingsSelectBTN = document.createElement('input');
                                settingsSelectBTN.setAttribute("type", "button");
                                settingsSelectBTN.setAttribute("class", "settingsSelectBTN");
                                settingsSelectBTN.value = String(tab);
                                if (tabC == 0) {
                                    settingsSelectBTN.style.backgroundColor = '#4b4f6b';
                                    settingsSelectBTN.disabled = true;
                                    tabC = 1;
                                    var settingTab = document.querySelector(`.settingsTab[name="${String(tab)}"]`)

                                }
                                settingsSelectBTN.onclick = function () {
                                    let len = document.querySelectorAll('input.settingsSelectBTN');
                                    for (let i = 0; i < len.length; i++) {
                                        if (len[i].disabled == true) {
                                            len[i].disabled = false;
                                            len[i].style.backgroundColor = '#373952';
                                        }
                                    };
                                    this.disabled = true;
                                    this.style.backgroundColor = '#4b4f6b';
                                    try {
                                        var settingTab = document.querySelector(`.settingsTab[name="${String(tab)}"]`)
                                        if (settingTab) {
                                            var tabs = document.querySelectorAll(`div.settingsTab`)
                                            for (let i = 0; i < tabs.length; i++) {
                                                tabs[i].style.display = 'none';
                                            };
                                            settingTab.style.display = 'initial'
                                        }
                                    } catch (error) {
                                        console.log(error);
                                    };
                                };

                                let settingsSelectDiv = document.createElement('div');
                                settingsSelectDiv.setAttribute('class', 'settingsSelectDiv');
                                settingsSelectDiv.style.width = String(100 / settingsTabs.length) + '%';
                                settingsSelectDiv.appendChild(settingsSelectBTN);
                                settingsSelect.appendChild(settingsSelectDiv);
                            }
                            settingsTabs.forEach(tab => createTab(tab));
                        } catch (error) {
                            console.log(error);
                        }

                        var settingsExit = document.createElement('a');
                        settingsExit.setAttribute('class', 'blacklistRemove');
                        settingsExit.innerText = 'Exit'
                        settingsExit.onclick = function () {
                            document.querySelector('#confDisp').style.display = 'none'
                        };

                        function contact() {
                            var contactLeft = document.createElement('div');
                            contactLeft.setAttribute('class', 'contactL');

                            var contactContainer = document.createElement('div');
                            contactContainer.setAttribute('id', 'reportDiv');
                            contactContainer.innerText = 'Report any issues you encounter to me through either of the links below, though the quest is preferred.';

                            var contactAkun = document.createElement('a');
                            contactAkun.innerText = 'Akun Script Quest';
                            contactAkun.href = 'https://fiction.live/stories/Fiction-live-Merged-Script/2pqyotSpKTcPF9dz8';
                            contactAkun.rel = "noopener noreferrer";
                            contactAkun.target = "_blank";

                            var contactGreasyfork = document.createElement('a');
                            contactGreasyfork.innerText = 'Greasyfork Page';
                            contactGreasyfork.href = 'https://greasyfork.org/en/scripts/418607-fiction-live-merged';
                            contactGreasyfork.rel = "noopener noreferrer";
                            contactGreasyfork.target = "_blank";

                            var contactRight = document.createElement('div');
                            contactRight.setAttribute('class', 'contactR');

                            function download(data) {
                                var file = new Blob([data], {
                                    type: '.txt'
                                });
                                if (window.navigator.msSaveOrOpenBlob) { // IE10+
                                    window.navigator.msSaveOrOpenBlob(file, 'FictionLiveMerged-Settings');
                                } else { // Others
                                    var a = document.createElement("a"),
                                        url = URL.createObjectURL(file);
                                    a.href = url;
                                    a.download = 'FictionLiveMerged-Settings.txt';
                                    document.body.appendChild(a);
                                    a.click();
                                    setTimeout(function () {
                                        document.body.removeChild(a);
                                        window.URL.revokeObjectURL(url);
                                    }, 0);
                                }
                            }

                            var exportSettings = document.createElement('a');
                            exportSettings.setAttribute("class", "exportSettings");
                            exportSettings.innerText = 'Export settings to file.'
                            exportSettings.onclick = function () {
                                download(localStorage.getItem('FL_Settings'))
                            };

                            var importSettings = document.createElement('a');
                            importSettings.setAttribute("class", "exportSettings");
                            importSettings.innerText = 'Import settings from file.';
                            importSettings.onclick = function () {
                                this.parentNode.querySelector('#fileImport').click();
                            };

                            var resetSettings = document.createElement('a');
                            resetSettings.setAttribute("class", "exportSettings");
                            resetSettings.innerText = 'Reset settings.'
                            resetSettings.onclick = function () {
                                if (confirm('Reset all script settings to the defaults?') == true) {
                                    localStorage.setItem('FL_Settings', JSON.stringify(defaultSettings));
                                    location.reload();
                                }
                            };

                            var importContainer = document.createElement('div');
                            var importFile = document.createElement('input');
                            importFile.setAttribute("id", "fileImport");
                            importFile.setAttribute("type", "file");
                            importFile.setAttribute("name", "files[]");
                            importFile.setAttribute("accept", ".txt");
                            importFile.style = 'display:none !important; visibility:hidden !important;'
                            importFile.onchange = function () {
                                var files = event.target.files; // FileList object
                                //console.log(files[0]);
                                //return;
                                var reader = new FileReader();
                                if (files && files[0]) {
                                    reader.onload = function (e) {
                                        let data = e.target.result;
                                        localStorage.setItem('FL_Settings', data);
                                        return;
                                        //displayContents(output);
                                    }; //end onload()
                                    reader.readAsText(files[0]);
                                    location.reload();
                                }

                            };
                            importContainer.appendChild(importSettings)
                            importContainer.appendChild(importFile)

                            var contact = document.createElement('div');
                            contact.setAttribute('class', 'contactMain');
                            contactContainer.appendChild(document.createElement('br'));
                            contactContainer.appendChild(contactAkun);
                            contactContainer.appendChild(document.createElement('br'));
                            contactContainer.appendChild(contactGreasyfork);
                            contactLeft.appendChild(contactContainer);
                            contactRight.appendChild(exportSettings);
                            contactRight.appendChild(importContainer);
                            contactRight.appendChild(resetSettings);
                            contact.appendChild(contactLeft);
                            contact.appendChild(contactRight);

                            return contact;
                        };

                        settingsTop.appendChild(settingsExit)
                        var confDisp = configDisplay();
                        var confBox = configBox();
                        confBox.appendChild(settingsTop);
                        confBox.appendChild(settingsSelect);
                        confBox.appendChild(settingsActual());
                        confBox.appendChild(settingsTagsBlacklist());
                        confBox.appendChild(settingsUserBlacklist());
                        confBox.appendChild(settingsAuthorsBlacklist());
                        confBox.appendChild(settingsStyle());
                        confBox.appendChild(settingsBlacklist());
                        confBox.appendChild(contact());
                        confDisp.appendChild(confBox);
                        document.querySelector('body').prepend(confDisp);

                    }
                } catch (error) {
                    console.log('Settings Display Error', error);
                };
            };

            function settingsOpen() {
                var myLive = document.createElement('li');
                myLive.setAttribute('id', 'confScript');

                var configOpen = document.createElement('a');
                configOpen.innerText = 'Config';
                configOpen.onclick = function () {
                    document.querySelector('#confDisp').style.display = 'block'
                };
                myLive.appendChild(configOpen);
                return myLive
            };

            function settingsInsert() {
                try {
                    let mainMenu = document.querySelector('nav#mainMenu');
                    settingsDisplay()
                    if (!(mainMenu.querySelector('#confScript'))) {
                        mainMenu.childNodes[2].appendChild(settingsOpen());
                    }
                } catch (error) {
                    console.log('Errors inserting Settings', error)
                };
            };

            settingsInsert();
        };

        function fixSpacing() {
            function KeyPress(e) {
                if (settings.spaceFix != true) {
                    return
                }
                var evtobj = window.event ? event : e
                if (evtobj.keyCode == 13 && evtobj.shiftKey) {
                    if (Array.from(document.querySelectorAll('div.fieldEditor')).includes(document.activeElement)) {
                        //THIS WORKS
                        if (window.getSelection) {
                            var selection = window.getSelection(),
                                range = selection.getRangeAt(0),
                                br = document.createElement("br"),
                                textNode = document.createTextNode("\u00a0"); //Passing " " directly will not end up being shown correctly
                            range.deleteContents(); //required or not?
                            range.insertNode(br);
                            range.collapse(false);
                            range.insertNode(textNode);
                            range.selectNodeContents(textNode);
                            selection.removeAllRanges();
                            selection.addRange(range);
                            document.execCommand('delete');
                            return false;
                        }
                    }
                }
            }

            document.onkeydown = KeyPress;
        };

        pageCheck();
        awaitAlerts()
        awaitMainMenu();
        fixSpacing();

        ///////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////OTHER FUNCTIONS//////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////

        //Source - https://github.com/proxy-m/real-visibility
        Element.prototype.isReallyNear = function (otherEl) {
            let el = this;
            if (!el || !otherEl) {
                return null;
            }
            return el.contains(otherEl) || otherEl.contains(el);
        };
        Element.prototype.isReallyVisible = function () {
            let el = this;
            let debug = false;
            if (!document.body.contains(el)) {
                return null;
            }
            if (document.hidden === true) {
                return false;
            } else if (document.hidden !== false) {
                console.warn("NOT FATAL WARNING: Page Visibility API is not supported by your browser.");
            }

            let rectPos = el.getBoundingClientRect();
            if (debug) {
                console.debug("Bounding of: ", el, rectPos);
            }

            let result = 0;
            if (el.isReallyNear(document.elementFromPoint(rectPos.left, rectPos.top))) {
                result++;
            }
            if (el.isReallyNear(document.elementFromPoint(rectPos.left, rectPos.bottom - 1))) {
                result++;
            }
            if (el.isReallyNear(document.elementFromPoint(rectPos.right - 1, rectPos.top))) {
                result++;
            }
            if (el.isReallyNear(document.elementFromPoint(rectPos.right - 1, rectPos.bottom - 1))) {
                result++;
            }

            let info;
            let r = true;
            if (result == 4) {
                info = 'visible';
            } else if (result === 0) {
                info = 'hidden';
                r = false;
            } else {
                info = 'partially visible';
            }
            if (debug) {
                console.debug(info, el);
            }
            return r;
        };

        function insertCSS() {
            var css = `
            
            .hiddenElm{display:none !important;}
            
    /*
    	CSS For: Script Settings Outer Container
    	*/
    	#confDisp {
    		height: 100%;
    		position: fixed;
    		top: 0;
    		bottom: 0;
    		left: 0;
    		right: 0;
    		z-index: 9999;
    		display: none;
    		overflow-y: auto;
    		pointer-events: auto;
    	}

    	/*
    	CSS For: Script Settings Inner Container
    	*/
    	#confBox {
    		height: auto;
    		min-height: 60%;
    		background: #2a2c3b;
    		width: auto;
    		min-width: 60%;
    		position: relative;
    		top: 10px;
            margin:5%;
            margin-top:1%;
    		padding: 1%;
    		display: flex;
    		flex-flow: column;
    		background: #2a2c3b;
    		box-shadow: 0 0 10px #000000;
    		pointer-events: auto;
    	}

    	/*
    	CSS For: Script Settings Inner Container Children
    	*/
    	#confBox * {
    		color: white;
    		background: #2a2c3b;
    	}

    	/*
    	CSS For: Script Settings Inner Container Title
    	*/
    	#confBox h1 {
    		text-rendering: optimizelegibility;
    		font-weight: 700;
    		font-size: 4vmin;
    		margin: 11.999999999999998px 0;
    		line-height: 1.2em
    	}

    	/*
    	CSS For: Script Settings Inner Container Tooltips
    	*/
    	#confBox .toolt {
    		height: 2.5vmin;
    		width: 2.5vmin;
    		background-color: #db722c;
    		color: #2a2c3b;
    		border-radius: 50%;
    		border: 0.1vmin solid #bebeff;
    		display: inline-block;
    		text-align: center;
    		font-weight: 700;
    		margin-left: 1vmin;
    		cursor: help;
    	}

    	/*
    	CSS For: Script Settings Inner Container Inputs
    	*/
    	#confBox select,
    	#confBox textarea,
    	#confBox input[type=text],
    	#confBox input[type=password],
    	#confBox input[type=datetime],
    	#confBox input[type=datetime-local],
    	#confBox input[type=date],
    	#confBox input[type=month],
    	#confBox input[type=time],
    	#confBox input[type=week],
    	#confBox input[type=number],
    	#confBox input[type=email],
    	#confBox input[type=url],
    	#confBox input[type=search],
    	#confBox input[type=tel],
    	#confBox input[type=color],
    	#confBox .uneditable-input {
    		display: inline-block;
    		height: auto;
    		padding: 0.4vmin 0.6vmin;
    		margin-bottom: 10px;
    		font-size: 1.4vmin;
    		line-height: 1.5;
    		vertical-align: middle;
    		width: 100%;
    		height: 3.2vmin;
    	}

    	/*
    	CSS For: Chat Editing Container
    	*/
    	.msgModBox {
    		display: none;
    		padding-bottom: 0.5em;
    	}
    	.delOn .msgModBox,
    	.vis .msgModBox,
    	.visAll .msgModBox {
    		display: unset;
    	}

    	/*
    	CSS For: Chat Editing Buttons
    	*/


    	 .msgModEdit,
    	 .msgModSave,
    	 .msgModDiscard,
    	 .msgModDelete {
    		width: auto;
    		color: white;
    		font-weight: bold;
    		padding: 0 0.5em 0 0.5em;
    		margin: 0 3em 0 0;
    		display: none;
    	}

    	.dark > .msgMod {
    		color: unset;
    	}

    	.delOn .msgModDelete {
    		display: unset;
    	}

    	.visAll .msgModEdit,
    	.visAll.editMode .msgModSave,
    	.visAll.editMode .msgModDiscard,
    	.visAll .msgModDelete,
    	.vis .msgModEdit,
    	.vis.editMode .msgModSave,
    	.vis.editMode .msgModDiscard {
    		display: unset;
    	}

    	.imgMsg .msgModEdit,
    	.imgMsg .msgModSave,
    	.imgMsg .msgModDiscard {
    		/*display: none !important;*/
    	}


    	/*
    	CSS For:
    	*/
    	.description {
    		font-size: 1.6vmin;
    	}

    	.purgeButton {
    		height: 100%;
    		border: thin solid red
    	}

    	.borderBottom {
    		width: 100%;
    		border-bottom: thin solid white;
    		margin: 5px 0 0 0;
    	}


    	#innerAlertSearch {
    		background: rgb(42, 44, 59) none repeat scroll 0% 0%;
    		padding-top: 10px;
    		margin-top: 0px;
    		display: inline-block;
    		width: 100%;
    	}


    	.listView-grid {
    		grid-auto-rows: unset;
    	}

    	#loginMenu .dropdown-menu {
    		right: -6.2em;
    	}


    	.cssBtn {
    		/*! height: 30px; */
    		height: 3.2vmin;
    		font-size: 1.4vmin;
    		padding: 0.2vmin;
    		line-height: normal;
    		/*! border: vmin solid #393a4d; */
    		border-color: #393a4d;
    		border-width: 0.5vmin;
    	}

    	.chatListed {
    		display: none;
    	}

    	#scriptTitle h1 {
    		margin: 0;
    	}

    	.blacklistEntry p.colors {
    		display: inline-block;
    		width: 85%;
    	}

    	#reportDiv {
    		padding: 5px;
    	}

    	.contactMain {
    		font-size: 2vmin;
    	}

    	#confScript {
    		text-shadow='-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000';
    		font-weight='bold';
    	}

    	#scriptTitle * {
    		margin: 0;
    		display: inline;
    	}

    	#scriptTitle {}

    	.settingsSelect {
    		max-height: 80px;
    		padding-top: 5px;
    	}

    	.settingsSelectDiv {
    		display: inline-block;
    		background: #4b4f6b;
    		box-sizing: border-box;
    		height: 3.2vmin;
    	}

    	.settingsSelectBTN {
    		width: 100% !important;
    		height: 100%;
    		font-size: 2vmin;
    		color: white !important;
    		text-decoration: none;
    		background: #373952 !important;
    		box-sizing: border-box;
    		border: .1vmin #21222b solid;
    		line-height: normal;
    	}

    	.settingsSelectBTN:disabled {
    		background: #4b4f6b !important;
    	}

    	.settingsTab {
    		/*padding: 0.5vmin;*/
    		display: none;
    	}

    	.entryTitle {
    		min-width: 100%;
    		font-size: 2vmin;
    		color: white !important;
    		float: left;
    	}

    	.settingsToggle {
    		/*
        min-height: 2.5vmin;
    	max-height: 35px;
        */
    		height: 3.5vmin;
    		min-width: 33%;
    		color: white;
    		border: 0.1vmin solid silver;
    		padding: 0.5vmin;
    		float: left;
    		font-size: 1.75vmin;
    		line-height: normal;
    	}

    	.settingsToggle div {
    		display: inline;
    	}

    	.toggleCheck {
    		-webkit-appearance: none;
    		background: white !important;
    		color: black !important;
    		padding: 1vmin;
    		display: inline-block;
    		position: relative;
    		/*! height: 4.4vmin; */
    		/*
        height: 100% !important;
    	max-height: 100% !important;
        */
    		margin-top: 0 !important;
    		margin-bottom: 0 !important;
    		margin-left: 0.5vmin !important;
    		margin-right: 0 !important;
    		color: black;
    		font-size: 2.5vmin;
    	}

    	.toggleCheck:active,
    	.toggleCheck:checked:active {}

    	.toggleCheck:checked {}

    	.toggleCheck:checked:after {
    		content: '\\2714';
    	}

    	.toggleCheck:after {
    		content: '\\2716';
    		position: absolute;
    		top: -0.8vmin;
    		left: 0vmin;
    	}

    	.settingsBlacklist {
    	}

    	#settingsBox {
    		margin-bottom: 0.5vmin;
    	}

    	.settingsInput {
    		color: white;
    		max-width: 40%;
    		height: 30px;
    		margin: 0 !important;
    	}

    	.blacklistEntry {
    		font-size: 2vmin;
    		/*
        float: left;
        */
    		min-width: 50%;
    		color: white;
    		display: inline-block;
    		border: 0.1vmin solid silver;
    		padding: 0.5vmin;
    	}

    	.blacklistEntry p {
    		margin: 0;
    		display: inline;
    		font-size: 2vmin !important;
    	}

    	.blacklistRemove {
    		color: white !important;
    		font-size: 2vmin;
    		display: inline-block;
    		border: 0.3vmin solid black;
    		background: #4b4f6b !important;
    		float: right;
    		padding-left: 0.5vmin;
    		padding-right: 0.5vmin;
    		-webkit-touch-callout: none;
    		-webkit-user-select: none;
    		-khtml-user-select: none;
    		-moz-user-select: none;
    		-ms-user-select: none;
    		user-select: none;
    	}

    	.blacklistRemove:hover {
    		color: white;
    	}

    	#settingsAlertBox {
    		margin-bottom: 5px;
    	}

    	#styleEntries {}

    	.styleEntry * {
    		display: inline-block;
    		vertical-align: unset;
    	}

    	.styleEntry {
    		display: inline-block;
    		border: thin solid black;
    		padding: 2px 4px 0 4px;
    		margin: 0 5px 5px 5px;
    		background: #373952;
    	}

    	.styleTitle {
    		margin: 0;
    		height: 100%;
    	}

    	.colorSet {
    		width: 7em;
    		margin: 0 1em 0.25em 1em !important;
    		color: white;
    		max-width: 40%;
    		height: 30px;
    	}

    	.colorPick * {
    		all: unset;
    	}

    	.colorPick {
    		width: 25px !important;
    		height: 1.5em !important;
    		border: none !important;
    		padding: 0 !important;
    		margin: 0 0 0.25em 0 !important;
    	}

    	#styleInput {
    		height: 500px;
    		resize: none;
    	}

    	#liveBox {
    		display: block;
    		height: 100%;
    		width: auto;
    		float: right;
    		padding-left: 1%;
    		padding-right: 1%;
    		border-left: solid;
    		border-Right: solid;
    		border-color: #ebf3f7;
    		box-sizing: border-box;
    		font-weight: bold;
    		color: black;
    		text-shadow: -1px -1px 0 #ebf3f7, 1px -1px 0 #ebf3f7, -1px 1px 0 #ebf3f7, 1px 1px 0 #ebf3f7;
    	}

    	#liveBox.dark {
    		border-color: #36394d;
    		color: white !important;
    		text-shadow: -1px -1px 0 #36394d, 1px -1px 0 #36394d, -1px 1px 0 #36394d, 1px 1px 0 #36394d !important;
    	}

    	.blacklist {
    		height: auto;
    		width: 0px;
    	}

    	.linkDiv {
    		width: 100%;
    		overflow: auto;
    	}

    	.linkDiv img {
    		width: 100%;
    		display: block;
    	}

    	.functionalLink {
    		padding: 0.5em;
    	}

    	.functionalContainer {
    		position: relative;
    		width: 100%;
    		padding-bottom: 100%;
    	}

    	.functionalVideo {
    		position: absolute;
    		width: 100%;
    		height: 100%;
    	}

    	.toggleBtn {
    		//-webkit-appearance: none;
    		//padding: 9px;
    		//border-radius: 3px;
    		//display: inline-block;
    		//position: relative;
    		//height:100% !important;
    		//max-height:100% !important;
    		//margin-top:0 !important;
    		//margin-bottom:0 !important;
    		margin-left: 1vmin; //margin-right:0 !important;
    		border: solid #393a4d;
    		border-width: .3vmin .3vmin .3vmin .3vmin;
    		box-shadow: .2vmin .2vmin .2vmin .2vmin #4f516b;
    		height: 2.4vmin;
    		font-size: 1.5vmin;
    		padding: 0 1vmin 0 1vmin;
    		line-height: initial;
    	}

    	.editMode textarea {
    		resize: none;
    		height: 100px;
    	}

    	.contactMain, .contactL, .contactR, .topicMessage {
    		background: #2a2c3b !important;
    		color: white !important;
    	}

    	.contactL {
    		float: left;
    		width: 50%;
    	}

    	.contactR {
    		float: right;
    		width: 50%;
    	}

    	.contactR input {
    		background: #2a2c3b !important;
    	}

    	.topicMessage {
    		resize: none;
    	}

    	.colors {
    		background: #2a2c3b !important;
    		color: white !important;
    	}

    	input[type="button"].textModBtn,
    	.textModBtn {
    		height: 100%;
    		width: 20%;
    		display: inline-block;
    		text-align: center;
    		-moz-user-select: none;
    		-khtml-user-select: none;
    		-webkit-user-select: none;
    		-ms-user-select: none;
    		user-select: none;
    	}

    	.textMod {
    		display: none;
    		position: relative;
    		height: auto;
    		width: 100%;
    		z-index: 20;
    background-color: #323448;
    		color: white;
    		-moz-user-select: none;
    		-khtml-user-select: none;
    		-webkit-user-select: none;
    		-ms-user-select: none;
    		user-select: none;
    	}

    	.textMod.vis {
    		display: block;
    		-moz-user-select: none;
    		-khtml-user-select: none;
    		-webkit-user-select: none;
    		-ms-user-select: none;
    		user-select: none;
    	}

    	.linkImg:before {
    		content: '\\1F517';
    		display: block;
    		position: absolute;
    		right: 50px;
    		top: 25px;
    		cursor: pointer;
    		font: normal normal normal 0.9rem/1 FontAwesome;
    	}

    	.linkInput {
    		display: block;
    		bottom: 5em;
    		width: 100%;
    		height: auto;
    		background: #323448;
    		z-index: 10000;
    		margin: 0 !important;
    	}

    	.linkInput > textarea {
    		padding: 0.25em !important;
    		margin: 0 !important;
    		resize: none;
    		height: 50px;
    		width: 90%;
    		float: left;
    	}

    	.linkInput > input {
    		display: block !important;
    		float: left;
    		padding: 0 !important;
    		margin: 0 !important;
    		height: 25px;
    		width: 10%;
    	}

    	.eCSSRow {
    		margin-bottom: 10px;
    	}
        .ExternalLink{
    		height: 3.2vmin;
            width:min-content;
            }

    	.eCSSRow .ExternalLink:first-of-type {
    		width: 80%;
    	}

    	.eCSSRow input.ExternalLink {
    		height: 3.2vmin;
    		width: 10%;
    		margin: 0 !important;
    	}

    	.eCSS {
    		margin: none;
    	}
                `;
            var style = document.createElement('style');

            if (style.styleSheet) {
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            };
            document.getElementsByTagName('head')[0].appendChild(style);
        };
    } catch (error) {
        console.log('Entire Script Error.', error)
    }
})();

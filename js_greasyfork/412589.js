// ==UserScript==
// @name         Fiction.Live Merged
// @namespace    http://tampermonkey.net/
// @version      1
// @description  An attempt to improve fiction.live through the addition of various features.
// @author       You
// @match        https://fiction.live/*
// @grant        none
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/412589/FictionLive%20Merged.user.js
// @updateURL https://update.greasyfork.org/scripts/412589/FictionLive%20Merged.meta.js
// ==/UserScript==
//console.clear();

(function () {
    var alertBlacklist = JSON.parse(localStorage.getItem('alertBlacklist'));
    alertBlacklist = [...new Set(alertBlacklist)];

    pageCheck();
    findBaseBTN();
    atagthing();
    AlertHandler();

    function pageCheck() {
        let URL = window.location.href;
        if ((/.*(fiction.live\/stories\/).*/.test(URL))) {
            //console.log('quest')
            questThings();
            return;
        } else if (/.*(fiction.live\/stories\?).*/.test(URL)) {
            //console.log('main/search page');
            mainThings();
            return;
        } else if (/.*(fiction.live\/live\?).*/.test(URL)) {
            //console.log('live page');
            LiveThings();
            return;
        } else {
            //console.log('Page not covered by script');
        }
    };

    function atagthing() {
        var options = {
            childList: true,
            subtree: true
        };

        let observerTitle = new MutationObserver(awaitTitle);
        observerTitle.observe(document, options);

        function awaitTitle(mutations) {
            for (let mutation of mutations) {
                try {
                    var anchors = document.querySelectorAll('a');
                } catch (error) {};
                if (anchors && (anchors !== undefined && anchors !== null)) {
                    try {
                        for (let i = 0; i < anchors.length; i++) {
                            let excludes = ['hideLeft', 'hideRight', 'hideChat', 'qstBlacklist'];
                            if (!(excludes.includes(anchors[i].parentNode.id))) {
                                if (anchors[i].className == 'feedItemInner') {
                                    anchors[i].onclick = function () {
                                        setTimeout(function () {
                                            addButtons();
                                            pageCheck();
                                        }, 3000)
                                    }
                                } else if (anchors[i].className != 'blacklist') {
                                    anchors[i].onclick = function () {
                                        addButtons();
                                        pageCheck();
                                    };
                                };
                            };
                        };
                    } catch (error) {
                        console.log('Failure AX1');
                        console.log(error);
                    };
                    break;
                } else {};
            };
        };
    };

    function mainThings() {
        var options = {
            childList: true,
            subtree: true
        };

        let observerTitle = new MutationObserver(awaitTitle);
        observerTitle.observe(document, options);

        function awaitTitle(mutations) {
            for (let mutation of mutations) {
                try {
                    var quests = document.querySelectorAll('div.storyListItem');
                } catch (error) {};
                if (quests.length > 5 && (quests !== undefined && quests !== null)) {
                    observerTitle.disconnect();
                    console.log('Complete mainLoad')
                    addButtons();
                    for (let i = 0; i < quests.length; i++) {
                        try {
                            let anchors = quests[i].querySelectorAll('a');
                            for (let i = 0; i < anchors.length; i++) {
                                anchors[i].onclick = function () {
                                    addButtons();
                                    pageCheck();
                                };
                            };
                        } catch (error) {
                            console.log('Failure AX2')
                        };
                    };
                    break;
                };
            };
        };
    };

    function LiveThings() {
        var options = {
            childList: true,
            subtree: true
        };

        let observerTitle = new MutationObserver(awaitTitle);
        observerTitle.observe(document, options);

        function awaitTitle(mutations) {
            for (let mutation of mutations) {
                try {
                    var quests = document.querySelectorAll('div.storyListItem');
                } catch (error) {};
                if (quests.length > 5 && (quests !== undefined && quests !== null)) {
                    observerTitle.disconnect();
                    console.log('Complete liveLoad')
                    addButtons();
                    for (let i = 0; i < quests.length; i++) {
                        try {
                            let anchors = quests[i].querySelectorAll('a');
                            for (let i = 0; i < anchors.length; i++) {
                                anchors[i].onclick = function () {
                                    addButtons();
                                    pageCheck();
                                };
                            };
                        } catch (error) {
                            console.log('Failure AX3')
                        };
                    };
                    break;
                };
            };
        };
    };
    /*
    OK basic idea.
    QUESTS
    Check for title.
    Find title? Nice, look for a next page button.
    Find THAT, coolio now onclick that fucker.
    Boom, should (try to) add buttons and loop.
    same with chapters/appendix
     */
    function liveRestore() {
        if (document.querySelector('div#liveBox')) {
            return
        };
        var navBar = document.querySelector('[id="mainMenuReplacement"][class="navbar navbar-default navbar-fixed-top"]');
        var liveTimer = document.querySelectorAll('[class="next-live ng-scope"]');
        var myLive = document.createElement('div');
        myLive.setAttribute('id', 'liveBox');
        myLive.style.display = 'block';
        myLive.style.height = '100%';
        myLive.style.width = 'auto';
        myLive.style.float = 'right';
        myLive.style.paddingLeft = '1%';
        myLive.style.paddingRight = '1%';
        myLive.style.borderLeft = 'solid';
        myLive.style.borderRight = 'solid';
        myLive.style.borderColor = '#323448';
        myLive.style.boxSizing = 'border-box';
        myLive.style.color = 'white';
        myLive.style.textShadow = '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000';
        myLive.style.fontWeight = 'bold';
        while (liveTimer[0].childNodes.length > 0) {
            myLive.appendChild(liveTimer[0].childNodes[0]);
        }
        navBar.appendChild(myLive);
        liveTimer[0].style.display = 'none';
        myLive.firstChild.style.color = 'white';
    };

    function waitForTimer() {
        var options = {
            childList: true,
            subtree: true
        };
        var observerTimer = new MutationObserver(awaitTimer);
        function awaitTimer(mutations) {
            for (let mutation of mutations) {
                try {
                    var canvas = document.querySelector('header[class="next-live ng-scope"]');
                } catch (error) {}
                if (canvas && (canvas !== undefined && canvas.length != 0)) {
                    observerTimer.disconnect(); // stop observing
                    liveRestore()
                    return;
                };
            };
        };
        observerTimer.observe(document, options);
    };

    function questThings() {

        function chatWait() {
            function messageWatcher() {
                var options = {
                    childList: true
                };
                let observerMessage = new MutationObserver(messageMod);
                let author = document.querySelector('span.author.ng-scope').querySelector('span.name').innerText
                function messageMod(mutations) {
                    for (let mutation of mutations) {
                        let message = mutation.addedNodes[0];
                        let msgImage = message.querySelector('div.message').querySelector('img');
                        if (msgImage !== null && msgImage !== undefined) {
                            let image = message.querySelector('div.message').querySelector('img');
                            image.src = image.src.replace(/(h[0-9]+\-w[0-9]+)/, 'h5600-w5600');
                            let page = image.src;
                            image.setAttribute('onclick', "window.open('" + page + "', '_blank');")
                        };
                        if (message.querySelector('span.name').innerText === author) {
                            message.style.backgroundColor = '#0e8c2f';
                        };
                        //observerMessage.disconnect();
                    };
                };
                var chat = document.querySelector('article.chatLog').childNodes[2].childNodes[0];
                observerMessage.observe(chat, options);
                let messages = chat.childNodes
                    messages.forEach(function (msg) {
                    try {
                        if (msg.querySelector('span.name').innerText === author) {
                            msg.style.backgroundColor = '#0e8c2f';
                        };
                        var image = msg.querySelector('div.message').querySelector('img');
                        if (image && (image != null || image != undefined || image.length < 1)) {
                            try {
                                image.src = image.src.replace(/(h[0-9]+\-w[0-9]+)/, 'h5600-w5600');
                            } catch (error) {
                                console.log('messageWatcher2');
                            }
                            try {
                                image.setAttribute('onclick', "window.open('" + image.src + "', '_blank');");
                            } catch (error) {
                                console.log('messageWatcher3');
                            }
                        }

                    } catch (error) {
                        console.log('messageWatcher4');
                    }
                })
            };
            var options = {
                childList: true,
                subtree: true
            };
            var observerChat = new MutationObserver(awaitChat);
            observerChat.observe(document, options);
            function awaitChat(mutations) {
                for (let mutation of mutations) {
                    try {
                        var chat = document.querySelector('article.chatLog').childNodes[2].childNodes[0];
                    } catch (TypeError) {};
                    if (chat && (chat !== undefined && chat !== null && chat.length != 0)) {
                        observerChat.disconnect();
                        messageWatcher();
                        break;
                    };
                };
            };
        };

        function timeRetrieve() {
            function stampSave() {
                try {
                    if (!(/.*stories\/.*?\//.test(window.location.href))) {
                        return
                    }
                    var savedTimes = JSON.parse(localStorage.getItem('savedTimes'));
                    try {
                        var timestamp = this.parentNode.parentNode.getAttribute('data-ct')
                    } catch (error) {}
                    var storyID = window.location.href.replace(/.*stories\/.*?\//, '').replace(/\/.*/, '');
                    if (!savedTimes || savedTimes == null) {
                        savedTimes = [storyID + '_' + timestamp];
                        localStorage.setItem('savedTimes', JSON.stringify(savedTimes));
                        try {
                            console.log('Saved time', this.parentNode)
                        } catch (error) {}

                    } else {
                        savedTimes.forEach(
                            function (e) {
                            let regex1 = new RegExp(storyID + '.*');
                            if (regex1.test(e)) {
                                console.log('Overwriting previous saved time');
                                let position = savedTimes.indexOf(e);
                                savedTimes.splice(position, 1);
                                return;
                            }
                        })
                        savedTimes.push(storyID + '_' + timestamp)
                        localStorage.setItem('savedTimes', JSON.stringify(savedTimes));
                    }
                } catch (error) {
                    console.log('Error within stampSave', error)
                }
            }
            function defTimestampBTN() {
                var saveStamp = document.createElement('li'),
                buttonText = document.createElement('a');
                saveStamp.setAttribute('class', 'saveStamp');
                saveStamp.style.height = 'auto';
                saveStamp.style.width = 'auto';
                saveStamp.style.float = 'left';
                saveStamp.style.display = 'block';
                saveStamp.style.z_index = '-3';
                saveStamp.style.position = 'relative';
                saveStamp.style.background = 'none';
                saveStamp.style.border = 'thin solid white';
                saveStamp.style.borderTopRightRadius = '4px';
                saveStamp.style.borderTopLeftRadius = '4px';
                saveStamp.style.borderBottomRightRadius = '4px';
                saveStamp.style.borderBottomLeftRadius = '4px';
                saveStamp.style.padding = '1%';
                saveStamp.style.marginRight = '35%';
                //saveStamp.style.lineHeight = '56px';
                saveStamp.onclick = stampSave;

                //////////////////////////////////////////
                buttonText.style.height = '56px';
                buttonText.style.color = '#90939d';
                buttonText.style.fontFamily = 'Helvetica Neue,HelveticaNeue,Helvetica,Arial,sans-serif';
                buttonText.style.fontWeight = '700';
                buttonText.style.fontSize = '100%';
                buttonText.innerText = 'Save Time';
                saveStamp.appendChild(buttonText);

                return saveStamp
            }

            //Waits for timestamps to be available
            var options = {
                childList: true,
                subtree: true
            };
            let observerTime = new MutationObserver(awaitTimes);
            observerTime.observe(document, options);

            function awaitTimes(mutations) {
                for (let mutation of mutations) {
                    try {
                        var title = document.querySelector('div.jadeRepeat.ng-scope');
                    } catch (TypeError) {};
                    if (title && (title !== (undefined && null) && title.length != 0)) {
                        observerTime.disconnect();
                        try {
                            var times = document.querySelectorAll('div.secondRow > span.ut');
                            if (times.length == 0) {
                                console.log('0')
                            }
                            for (let i = 0; i < times.length; i++) {
                                try {
                                    let saveStamp = defTimestampBTN();
                                    if (!times[i].parentNode.querySelector('li.saveStamp')) {
                                        times[i].parentNode.prepend(saveStamp)
                                    }
                                } catch (error) {
                                    console.log('fuck', error)
                                }
                                try {
                                    var qqq = window.location.href.replace(/.*stories\/.*?\//, '').replace(/\/.*/, '') + '_' + times[i].parentNode.parentNode.parentNode.getAttribute('data-ct');

                                    if (JSON.parse(localStorage.getItem('savedTimes')).includes(qqq)) {
                                        ""
                                    }
                                } catch (error) {}
                                //break;
                            };
                        } catch (error) {
                            console.log('TimeSave div.jadeRepeat.ng-scope > article.chapter', error)
                        };
                    };
                };
            };
        };

        var options = {
            childList: true,
            subtree: true
        };

        let observerTitle = new MutationObserver(awaitTitle);
        observerTitle.observe(document, options);

        function awaitTitle(mutations) {
            for (let mutation of mutations) {
                try {
                    var title = document.querySelector('header.page-title').textContent;
                } catch (TypeError) {};
                if (title && (title !== undefined && title !== null && title.length != 0)) {
                    observerTitle.disconnect();
                    addButtons();
                    findChapterBTN();
                    findAnchors();
                    //chatWait();
                    waitForTimer();
                    timeRetrieve();
                    break;
                };
            };
        };
    };

    function findChapterBTN() {
        //console.log('FCBTN')
        var nextChapter = document.querySelector('a.nextChapter')
            if (nextChapter) {
                nextChapter.onclick = function () {
                    addButtons();
                    questThings();
                };
            }
    };

    function findBaseBTN() {
        document.querySelector('a.site-name').onclick = function () {
            addButtons();
            pageCheck();
        };
    };

    function findAnchors() {
        document
        var options = {
            childList: true,
            subtree: true
        };
        let observer = new MutationObserver(awaitLinkX);
        observer.observe(document, options);

        function awaitLinkX(mutations) {
            for (let mutation of mutations) {
                try {
                    var LinkX = document.querySelector('.contentsInner');
                } catch (error) {
                    console.log('shit')
                };
                if (LinkX != undefined && LinkX != null) {
                    observer.disconnect();
                    //console.log('Yeet2')
                    let Links = LinkX.querySelectorAll('a');
                    for (var i = 0; i < Links.length; i++) {
                        if (!(Links[i].className = 'blacklist')) {
                            Links[i].onclick = function () {
                                addButtons();
                                questThings();
                            }

                        };
                    };
                };
            };
        };
    };

    function addButtons() {
        var btnCheck = document.querySelector('#mainMenuReplacement')
            var savedHide = JSON.parse(localStorage.getItem('chat'));
        var chatHide = [].concat(savedHide)
        chatHide = [...new Set(chatHide)];
        var storyID = window.location.href.replace(/.*stories\/.*?\//, '').replace(/\/.*/, '');

        function updateChat() {

            try {
                if (!(/.*stories\/.*?\//.test(window.location.href))) {
                    return
                }
                if (chatHide.includes(storyID + '_chat')) {
                    let position = chatHide.indexOf(storyID + '_chat');
                    chatHide.splice(position, 1);
                    localStorage.setItem('chat', JSON.stringify(chatHide));
                    console.log('Removed ' + storyID + ' from the auto hide.');
                    if (document.querySelector('div#right').style.display != 'flex') {
                        document.querySelector('div#right').style.display = 'flex';
                    };
                } else {
                    chatHide.push(storyID + '_chat');
                    chatHide = [...new Set(chatHide)];
                    localStorage.setItem('chat', JSON.stringify(chatHide));
                    console.log('Added ' + storyID + ' to the auto hide.');
                    if (document.querySelector('div#right').style.display != 'none') {
                        document.querySelector('div#right').style.display = 'none';
                    };
                };
            } catch (error) {
                console.log('Boost Script Error - UpdateChat')
            };
        };

        function addBlacklistBTN() {
            function blacklistAdd() {
                try {
                    let title = document.querySelector('header.page-title').textContent;
                    let author = document.querySelector('span.author').querySelector('span.name').textContent;
                    let listEntry = title + '___' + author;
                    alertBlacklist.push(listEntry);
                    alertBlacklist = [...new Set(alertBlacklist)];
                    localStorage.setItem('alertBlacklist', JSON.stringify(alertBlacklist));
                    alertBlacklist = JSON.parse(localStorage.getItem('alertBlacklist'));
                    console.log('Added ' + title + ' to the blacklist.');
                    AlertHandler.alertWatcher();
                } catch (error) {
                    console.log('QBL', error)
                }
            };
            try {
                var blacklistBTN = document.createElement('li'),
                buttonText = document.createElement('a');
                blacklistBTN.setAttribute('id', 'qstBlacklist');
                blacklistBTN.style.height = '56px';
                blacklistBTN.style.width = 'auto';
                blacklistBTN.style.float = 'left';
                blacklistBTN.style.display = 'block';
                blacklistBTN.style.z_index = '-3';
                blacklistBTN.style.position = 'relative';
                blacklistBTN.style.background = 'none';
                blacklistBTN.style.border = '0';
                blacklistBTN.style.paddingLeft = '1%';
                blacklistBTN.style.lineHeight = '56px';
                //blacklistBTN.innerText = '∅';

                //////////////////////////////////////////
                buttonText.style.height = '56px';
                buttonText.style.color = '#90939d';
                buttonText.style.fontFamily = 'Helvetica Neue,HelveticaNeue,Helvetica,Arial,sans-serif';
                buttonText.style.fontWeight = '700';
                buttonText.style.fontSize = '100%';
                buttonText.innerText = 'Blacklist Quest';
                blacklistBTN.onclick = blacklistAdd;

                blacklistBTN.appendChild(buttonText);
                return blacklistBTN
            } catch (error) {
                console.log('Error adding in-quest blacklist button.', error);
            };

        };

        function defRightBTN() {
            var hideRight = document.createElement('li'),
            buttonText = document.createElement('a');
            hideRight.setAttribute('id', 'hideRight');
            hideRight.style.height = '56px';
            hideRight.style.width = 'auto';
            hideRight.style.float = 'left';
            hideRight.style.display = 'block';
            hideRight.style.z_index = '-3';
            hideRight.style.position = 'relative';
            hideRight.style.background = 'none';
            hideRight.style.border = '0';
            hideRight.style.paddingLeft = '1%';
            hideRight.style.lineHeight = '56px';
            hideRight.onclick = function () {
                if (document.querySelector('div#right').style.display != 'none') {
                    document.querySelector('div#right').style.display = 'none';
                } else {
                    document.querySelector('div#right').style.display = 'flex';
                };
            };

            //////////////////////////////////////////
            buttonText.style.height = '56px';
            buttonText.style.color = '#90939d';
            buttonText.style.fontFamily = 'Helvetica Neue,HelveticaNeue,Helvetica,Arial,sans-serif';
            buttonText.style.fontWeight = '700';
            buttonText.style.fontSize = '100%';
            buttonText.innerText = 'Hide Chat';
            hideRight.appendChild(buttonText);

            return hideRight
        }

        function defLeftBTN() {
            var hideLeft = document.createElement('li'),
            buttonText = document.createElement('a')
                hideLeft.setAttribute('id', 'hideLeft');
            hideLeft.style.height = '56px';
            hideLeft.style.width = 'auto';
            hideLeft.style.float = 'left';
            hideLeft.style.display = 'block';
            hideLeft.style.z_index = '-3';
            hideLeft.style.position = 'relative';
            hideLeft.style.background = 'none';
            hideLeft.style.border = '0';
            hideLeft.style.paddingLeft = '1%';
            hideLeft.style.lineHeight = '56px';
            hideLeft.onclick = function () {
                if (document.querySelector('nav.watching').style.display != 'none') {
                    document.querySelector('nav.watching').style.display = 'none';
                } else {
                    document.querySelector('nav.watching').style.display = 'block';
                };
            };
            //////////////////////////////////////////
            buttonText.style.height = '56px';
            buttonText.style.color = '#90939d';
            buttonText.style.fontFamily = 'Helvetica Neue,HelveticaNeue,Helvetica,Arial,sans-serif';
            buttonText.style.fontWeight = '700';
            buttonText.style.fontSize = '100%';
            buttonText.innerText = 'hideLeft';
            hideLeft.appendChild(buttonText);
            hideLeft.onclick = function () {
                if (document.querySelector('nav.watching').style.display != 'none') {
                    document.querySelector('nav.watching').style.display = 'none';
                } else {
                    document.querySelector('nav.watching').style.display = 'block';
                };
            };
            return hideLeft
        }

        function hideChatBTN() {
            var hideChat = document.createElement('li'),
            buttonText = document.createElement('a');
            hideChat.setAttribute('id', 'hideChat');
            hideChat.style.height = '56px';
            hideChat.style.width = 'auto';
            hideChat.style.float = 'left';
            hideChat.style.display = 'block';
            hideChat.style.z_index = '-3';
            hideChat.style.position = 'relative';
            hideChat.style.background = 'none';
            hideChat.style.border = '0';
            hideChat.style.paddingLeft = '1%';
            hideChat.style.lineHeight = '56px';
            hideChat.onclick = updateChat;
            //////////////////////////////////////////
            buttonText.style.height = '56px';
            buttonText.style.color = '#90939d';
            buttonText.style.fontFamily = 'Helvetica Neue,HelveticaNeue,Helvetica,Arial,sans-serif';
            buttonText.style.fontWeight = '700';
            buttonText.style.fontSize = '100%';
            buttonText.innerText = 'Auto-hide chat';
            hideChat.appendChild(buttonText);
            return hideChat
        }

        var hideRight = defRightBTN(),
        hideLeft = defLeftBTN(),
        hideChat = hideChatBTN(),
        blacklistButton = addBlacklistBTN();

        //////////////////////////////////////////
        //document.querySelectorAll('nav#mainMenuReplacement')[0].appendChild(hideLeft);
        //document.querySelectorAll('nav#mainMenuReplacement')[0].appendChild(hideRight);
        //document.querySelectorAll('nav#mainMenuReplacement')[0].appendChild(hideChat);
        var hideBox = document.createElement('div')

            try {
                (function () {
                    var options = {
                        childList: true,
                        subtree: true
                    };
                    var observerTop = new MutationObserver(awaitTop);
                    function awaitTop(mutations) {
                        for (let mutation of mutations) {
                            try {
                                var topBars = document.querySelectorAll('nav#mainMenuReplacement');
                            } catch (error) {}
                            if (chatHide.includes(storyID + '_chat')) {
                                document.querySelector('div#right').style.display = 'none';
                            }
                            if (topBars && (topBars !== undefined && topBars !== null)) {
                                observerTop.disconnect(); // stop observing
                                try {
                                    /* if (!(topBars[0].querySelector('#hideLeft'))) {
                                    topBars[0].appendChild(hideLeft);
                                    console.log('added btn')
                                    } */
                                } catch (error) {}
                                /*if (!(topBars[0].querySelector('#hideLeft'))) {
                                topBars[0].appendChild(hideLeft);
                                console.log('added btn')
                                }
                                if (!(topBars[0].querySelector('#hideRight'))) {
                                topBars[0].appendChild(hideRight);
                                }
                                if (!(topBars[0].querySelector('#hideChat'))) {
                                topBars[0].appendChild(hideChat);
                                } */
                                try {
                                    //Quest Visible Buttons
                                    /* if (!(topBars[1].querySelector('#hideLeft'))) {
                                    topBars[1].appendChild(hideLeft);
                                    } */
                                    if (!(topBars[1].querySelector('#hideRight'))) {
                                        topBars[1].appendChild(hideRight);
                                    }
                                    if (!(topBars[1].querySelector('#hideChat'))) {
                                        topBars[1].appendChild(hideChat);
                                    }
                                    if (!(topBars[1].querySelector('#qstBlacklist'))) {
                                        topBars[1].appendChild(blacklistButton);
                                    }
                                } catch (error) {}
                                return;
                            }
                        };
                    };
                    observerTop.observe(document, options);
                })()
            } catch (error) {}
        function existCheck() {
            if (!document.querySelector('li#hideRight')) {
                setTimeout(() => {
                    addButtons()
                }, 2000);
            } else {}
            existCheck();

        }
    }

    function AlertHandler() {
        AlertHandler.alertWatcher = alertWatcher
        function alertCheck(alert) {
            function simClick(elem) {
                var evt = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                var canceled = !elem.dispatchEvent(evt);
            };

            function alertDismiss(alert) {
                console.log('Removing notification for', alertTitle)
                let dismiss = alert.querySelector('[ng-click="dismissFeedItem(item)"]');
                simClick(dismiss);
            };

            try {
                var alertTitle = alert.querySelector('[set-text="item.value.value"]').textContent.replace(' went live', '');
                let alertQM = alert.querySelector('span.user').textContent;
                let listEntry = alertTitle + '___' + alertQM;
                try {
                    if (alertBlacklist.includes(listEntry)) {
                        alertDismiss(alert);
                    } else {
                        if (!(alert.querySelector('a.blacklist'))) {
                            addBlacklistBTN(alert);
                        }
                    };
                } catch (error) {
                    console.log('alertCheck', error)
                };
            } catch (error) {
                console.log('alertCheck', error)
            };
        };

        function alertWatcher() {
            try {
                let alertContainer = document.getElementsByClassName('feedType')[0];
                for (var i = 0; i < alertContainer.children.length; i++) {
                    alertCheck(alertContainer.children[i])
                };
                var observer = new MutationObserver(function (mutations, me) {
                    try {
                        for (let mutation of mutations) {
                            if (mutation.addedNodes[0] !== undefined) {
                                console.log(mutation.addedNodes[0], 'New Alert Detected');

                                if (mutation.addedNodes[0].className != 'blacklist') {
                                    mutation.addedNodes[0].onclick = function () {
                                        addButtons();
                                        questThings();
                                    };
                                };
                                alertCheck(mutation.addedNodes[0]);
                            };
                        };
                    } catch (error) {
                        console.log('alertWatcher broke, dunno why, refresh the page and if it breaks again report it')
                    };
                });
                observer.observe(alertContainer, {
                    childList: true
                });
            } catch (error) {
                console.log('watcher ded')
            };
        };

        function alertAwait() {
            try {
                var observer = new MutationObserver(function (mutations, me) {
                    try {
                        var alertContainer = document.getElementsByClassName('feedCount');
                    } catch (error) {};
                    if (alertContainer !== null || alertContainer !== undefined) {
                        me.disconnect();
                        alertWatcher();
                    };
                });
                observer.observe(document, {
                    childList: true,
                    subtree: true
                });
            } catch (error) {
                console.log('await alert ded')
            };
        };
        alertAwait();

        function addBlacklistBTN(alert) {
            function blacklistAdd() {
                try {
                    let alertTitle = alert.querySelector('[set-text="item.value.value"]').textContent.replace(' went live', '');
                    let alertQM = alert.querySelector('span.user').textContent;
                    let listEntry = alertTitle + '___' + alertQM;
                    alertBlacklist.push(listEntry);
                    alertBlacklist = [...new Set(alertBlacklist)];
                    localStorage.setItem('alertBlacklist', JSON.stringify(alertBlacklist));
                    alertBlacklist = JSON.parse(localStorage.getItem('alertBlacklist'));
                    console.log('Added ' + alertTitle + ' to the blacklist.');
                    alertCheck(this.parentNode);

                } catch (error) {
                    console.log('blacklist failure', error);
                };
            };
            if (alert.querySelector('blacklist') == null) {
                try {
                    var blacklistBTN = document.createElement('a');
                    blacklistBTN.setAttribute('class', 'blacklist');
                    blacklistBTN.style.height = 'auto';
                    blacklistBTN.style.width = '0px';
                    blacklistBTN.innerText = '∅';
                    blacklistBTN.onclick = blacklistAdd;
                    alert.childNodes[0].after(blacklistBTN);
                } catch (error) {
                    console.log('Error adding blacklist button.', error);
                };
            };
        };
    };

})();

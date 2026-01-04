// ==UserScript==
// @name         Fiction.Live Date adder
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  adds dates to posts because kas yeeted them to mars for no reason
// @author       You
// @match        https://fiction.live/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/408700/FictionLive%20Date%20adder.user.js
// @updateURL https://update.greasyfork.org/scripts/408700/FictionLive%20Date%20adder.meta.js
// ==/UserScript==
//contentThing();
chapterMonitor();
function chapterMonitor() {
        //Monitors the chapter to see when it changes, eg chapter 1 changes to chapter 2
        var options = {childList: true, subtree: true};
        let observerTitle = new MutationObserver(awaitTitle);
        observerTitle.observe(document, options);
        function awaitTitle(mutations) {
            for (let mutation of mutations) {
                try {
                    var chat = document.querySelector('article.chapterTitle').textContent;
                } catch (TypeError) {};
                if (chat && (chat !== undefined && chat !== null && chat.length != 0)) {
                    observerTitle.disconnect();
                    //console.log('Chapter Title Has Been Found');
                    chapterActor(chat);
                    contentThing()
                    break;
                };
            };
        };
    };

    function chapterActor(thing) {
        var options = {childList: true, subtree: true};
        let observerTitle = new MutationObserver(awaitTitle);
        observerTitle.observe(document, options);
        function awaitTitle(mutations) {
            for (let mutation of mutations) {
                try {
                    var chat = document.querySelector('article.chapterTitle').textContent;
                } catch (TypeError) {};
                if ((chat && (chat !== undefined && chat !== null && chat.length != 0)) && chat !== thing) {
                    observerTitle.disconnect();
                    //console.log('Chapter Title Has Been Chnaged, Reloading Scripts
                    chapterMonitor();
                    break;
                };
            };
        };
    };


function contentThing() {
    var options = {
        childList: true,
        subtree: true
    };
    let observerTitle = new MutationObserver(awaitTitle);
    observerTitle.observe(document, options);
    function awaitTitle(mutations) {
        for (let mutation of mutations) {
            try {
                var chapter = document.querySelector('div#storyPosts').childNodes[0];
            } catch (TypeError) {};
            if (chapter && chapter !== undefined && chapter !== null && chapter.length != 0) {
                contentDate(chapter);
                observerTitle.disconnect();
                break;
            };
        };
    };
};
function contentDate(chapterContainer) {
    try {
        try {
            chapterContainer.childNodes.forEach(function (child) {
                try {
                    var timeDisplay = document.createElement('div');
                    timeDisplay.setAttribute('class', 'hideRight');
                    timeDisplay.style.height = '56px';
                    timeDisplay.style.width = 'auto';
                    timeDisplay.style.float = 'left';
                    timeDisplay.style.display = 'block';
                    timeDisplay.style.position = 'relative';
                    timeDisplay.style.background = 'none';
                    timeDisplay.style.border = '0';
                    timeDisplay.style.paddingLeft = '1%';
                    timeDisplay.style.lineHeight = '56px';
                    var unixTimestamp = parseInt(child.getAttribute('data-ct'));
                    var newDate = new Date(unixTimestamp);
                    timeDisplay.textContent = newDate.toLocaleString();
                    child.querySelector('div.chapterContent').appendChild(timeDisplay);
                } catch (errors) {
                    console.log('chapterContainer.childNodes.forEach error');
                    console.log(errors);
                }
            })
        } catch (errors) {
            console.log('contentDate error');
            console.log(errors);
        }
        var options = {
            childList: true
        };
        let observerTitlex = new MutationObserver(awaitPosts);
        observerTitlex.observe(chapterContainer, options);
        function awaitPosts(mutations) {
            for (let mutation of mutations) {
                try {
                    var chapterContent = mutation.addedNodes[0]
                } catch (TypeError) {};
                if (chapterContent && (chapterContent !== undefined && chapterContent !== null && chapterContent.length != 0)) {
                    var timeDisplay = document.createElement('div');
                    timeDisplay.setAttribute('class', 'hideRight');
                    timeDisplay.style.height = '56px';
                    timeDisplay.style.width = 'auto';
                    timeDisplay.style.float = 'left';
                    timeDisplay.style.display = 'block';
                    timeDisplay.style.position = 'relative';
                    timeDisplay.style.background = 'none';
                    timeDisplay.style.border = '0';
                    timeDisplay.style.paddingLeft = '1%';
                    timeDisplay.style.lineHeight = '56px';
                    try {
                        var unixTimestamp = parseInt(chapterContent.getAttribute('data-ct'));
                        var newDate = new Date(unixTimestamp);
                        timeDisplay.textContent = newDate.toLocaleString();
                        chapterContent.childNodes[0].appendChild(timeDisplay);
                    } catch (errors) {
                        console.log('awaitPosts error');
                        console.log(errors);
                    }
                };
            };
        };
    } catch (error) {
        console.log('chapter content fucked up dude')
    }
    };
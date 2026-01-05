// ==UserScript==
// @name        4chan_namefig_wall
// @namespace   the_fire_rises
// @description Removes all traces of names while obliterating namefig signal-to-nosie ratio
// @match       *://boards.4chan.org/s4s/*
// @version     1.0
// @grant       none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/27280/4chan_namefig_wall.user.js
// @updateURL https://update.greasyfork.org/scripts/27280/4chan_namefig_wall.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Serenity mode: Show all names as Anonymous, hide the name field in the post / reply form
    const serenityMode = true;
    const showDebug = false;
    
    // When picking a random namefig from recent posts, only consider the N most recently active namefigs
    const RANDOM_POOL_MAX_SIZE = 8;

    // You have to go back.
    var poolNameFigs;
    var threadNameFigs;

    const proto = window.location.protocol;
    const catalogUrl = proto + '//a.4cdn.org/s4s/catalog.json';
    
    const quickReplyThreadRegex = /^thread\/(\d+).*/;

    const threadNumRegex = /^https?:\/\/boards\.4chan\.org\/s4s\/thread\/(\d+)\/?.*/;
    var threadNum;
    var globalThreadUrl;
    
    if(window.location.href.match(threadNumRegex)) {
        threadNum = window.location.href.replace(threadNumRegex, '$1');
        globalThreadUrl = proto + '//a.4cdn.org/s4s/thread/' + threadNum + '.json';
    }

    function decodeHtml(html) {
        var txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }


    // Return a random integer between min (inclusive) and max (exclusive)
    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }


    // An asynchronous HTTP GET request for JSON content
    function httpGetJsonAsync(theUrl, callback) {
        if(showDebug) { console.info('About to request' + theUrl); }
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                callback(xmlHttp.response);
            }
        };
        xmlHttp.open("GET", theUrl, true); // true for asynchronous
        xmlHttp.responseType = 'json';
        xmlHttp.send(null);
        if(showDebug) { console.info('Request sent.'); }
    }
    
    
    // If new post, get a random namefig. If reply, determine whether to use namefig already in thread
    function wreckNameFigs(threadHref) {
        if(showDebug) { console.info('wreckNameFigs called.'); }
        
        poolNameFigs = {};
        threadNameFigs = {};
        
        var threadUrl;
        if(typeof threadHref == 'string' && threadHref.match(quickReplyThreadRegex)) {
            threadNum = threadHref.replace(quickReplyThreadRegex, '$1');
            threadUrl = proto + '//a.4cdn.org/s4s/thread/' + threadNum + '.json';
            if(showDebug) { console.debug(threadUrl); }
        }
        else if(globalThreadUrl) {
            threadUrl = globalThreadUrl;
        }
        if(!threadUrl) {
            httpGetJsonAsync(catalogUrl, fillNameFigPool);
        }
        else {
            httpGetJsonAsync(threadUrl, processThread);
        }
    }


    // Look for namefigs in the thread being replied to
    function processThread(thread) {
        for(let post in thread['posts']) {
            var currentPost = thread['posts'][post];
            var currentNameFig = decodeHtml(currentPost['name']);
            if(currentNameFig !== 'Anonymous') {
                if(showDebug) { console.debug('processThread: adding namefig ' + currentNameFig); }
                threadNameFigs[currentNameFig] = 1;
            }
        }
        
        /*
         * The number of namefigs in the thread determines the probabilty of
         * using one already present in the thread or picking one from the
         * recent replies to all current threads on the board.
         *
         * Reusing namefigs already present in the thread will be more
         * disruptive than choosing namefigs at random from across the board.
         *
         */ 
        var probabilityToUseExistingFig = 0;
        
        var threadNameFigsLength = Object.keys(threadNameFigs).length;
        
        if(showDebug) { console.info('processThread: threadNameFigs.length: ' + threadNameFigsLength); }
        
        switch(threadNameFigsLength) {
            case 0: // No namefigs present in thread. Get a random one that's recently active.
                probabilityToUseExistingFig = -1;
                break;
            case 1: // NameFig detected. 50 / 50 chance to reuse it or bring in a new one.
                probabilityToUseExistingFig = 50;
                break;
            case 2: // Circlejerk detected. Make reuse of existing figs more likely, increasing confusion.
                probabilityToUseExistingFig = 80;
                break;
            case 3: // The more namefigs present, the more likely we reuse one already in the thread.
                probabilityToUseExistingFig = 90;
                break;
            default:
                probabilityToUseExistingFig = 95;
                break;
        }

        if(randomIntFromInterval(0, 100) > probabilityToUseExistingFig) {
            if(showDebug) { console.info('Fetching pool of random recent namefigs from catalog...'); }
            setTimeout(function() {
                httpGetJsonAsync(catalogUrl, fillNameFigPool);
            }, 1000);
        }
        else {
            finishHim();
        }
    }


    // Add or update a nameFig in the pool
    function processNameFigForPool(theNameFig, theNameFigsPostNumber) {
        if(theNameFig !== 'Anonymous' && (!poolNameFigs[theNameFig] || poolNameFigs[theNameFig] < theNameFigsPostNumber)) {
            if(showDebug) { console.debug('Adding namefig ' + theNameFig + ' with post number ' + theNameFigsPostNumber); }
            poolNameFigs[theNameFig] = theNameFigsPostNumber;
        }
    }
    
    
    // Fill up the pool with some namefigs
    function fillNameFigPool(catalog) {
        if(showDebug) { console.info('fillNameFigPool called.'); }
        var maxRepliesThreadNum = 0;
        var maxRepliesThreadCount = 0;
      
        for(var pageNum in catalog) {
            if(showDebug) { console.debug('Examining page num: ' + pageNum); }
            for(let thread in catalog[pageNum]['threads']) {
                var currentThread = catalog[pageNum]['threads'][thread];
                if(showDebug) { console.debug('  Examining thread num: ' + currentThread['no']); }
                if(currentThread['replies'] > maxRepliesThreadCount) {
                    maxRepliesThreadCount = currentThread['replies'];
                    maxRepliesThreadNum = currentThread['no'];
                }
                for(let lastReply in currentThread['last_replies']) {
                    var currentLastReply = currentThread['last_replies'][lastReply];
                    processNameFigForPool(decodeHtml(currentLastReply['name']), +currentLastReply['no']); // Coerce to number
                }
            }
        }
        
        var maxRepliesThreadUrl = proto + '//a.4cdn.org/s4s/thread/' + maxRepliesThreadNum + '.json';
        if(showDebug) { console.info('There are ' + maxRepliesThreadCount + ' replies in thread ' + maxRepliesThreadNum); }
        if(showDebug) { console.debug('' + Object.keys(poolNameFigs).length + ' < ' + RANDOM_POOL_MAX_SIZE + ' ?'); }
        
        // If we need a bigger pool of namefigs, load moar from the longest thread
        if(Object.keys(poolNameFigs).length < RANDOM_POOL_MAX_SIZE) {
            if(showDebug) { console.info('Not enough namefigs found, loading moar from ' + maxRepliesThreadUrl); }
            setTimeout(function() {
                httpGetJsonAsync(maxRepliesThreadUrl, function(maxRepliesThread) {
                    for(let post in maxRepliesThread['posts']) {
                        var currentPost = maxRepliesThread['posts'][post];
                        processNameFigForPool(decodeHtml(currentPost['name']), +currentPost['no']);
                    }
                    finishHim();
                });
            }, 1000);
            
        }
        else {
            finishHim();
        }
    }

    // Pick a random namefig from what we've found, use it, and hide the name field(s) if serenity mode is active
    function finishHim() {
        var finalFigList = [];
        var randomLimit = 0;
        var randomFig = '';
        
        if(showDebug) { console.info('finishHim: threadNameFigs: ' + threadNameFigs); }
        
        // If we filled the pool that means we're going to use one from it
        if(poolNameFigs && Object.keys(poolNameFigs).length !== 0) {
            if(showDebug) { console.info('finishHim: using name from pool.'); }
            finalFigList = Object.keys(poolNameFigs).sort(function (a, b) { return poolNameFigs[b] - poolNameFigs[a]; });
            randomLimit = Math.min(finalFigList.length, RANDOM_POOL_MAX_SIZE);
        }
        
        else {
            finalFigList = Object.keys(threadNameFigs);
            if(showDebug) { console.info('finalFigList: ' + finalFigList); }
            randomLimit = finalFigList.length;
            if(showDebug) { console.info('finalFigList.length: ' + finalFigList.length); }
        }
        
        if(!finalFigList || finalFigList.length === 0) {
            if(showDebug) { console.info('Our victory is complete.'); }
            randomFig = 'Anonymous';
        }
        else {
            randomFig = finalFigList[randomIntFromInterval(0, randomLimit)];
        }
        if(showDebug) { console.info('Random fig: ' + randomFig); }
        var nameThings = Array.from(document.getElementsByName('name'));
        nameThings.forEach(a => a.value = randomFig);
        if(serenityMode) {
            nameThings.forEach(a => a.style.display = 'none');
        }
    }


    // This board is filthy... Let's clean it up!
    function cleanItUp (element) {
        // Posts
        Array.from(element.getElementsByClassName('name')).forEach(a => a.textContent = 'Anonymous');
        Array.from(element.getElementsByClassName('postertrip')).forEach(a => a.parentNode.removeChild(a));
        Array.from(element.getElementsByClassName('n-pu')).forEach(a => a.parentNode.removeChild(a));
        // Catalog tool-tips
        Array.from(element.getElementsByClassName('post-author')).forEach(a => a.textContent = 'Anonymous');
        Array.from(element.getElementsByClassName('post-tripcode')).forEach(a => a.parentNode.removeChild(a));
    }

      
    if(serenityMode) {
        // Visually remove name row from post / reply table
        document.getElementById('postForm').firstChild.firstChild.style.display = 'none';

        // Clean up posts already on the page
        cleanItUp(document.body);

        // Clean up new posts which appear as a result of AJAX activity
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                for(let i = 0; i < mutation.addedNodes.length; i++) {
                    if(showDebug) { console.debug(mutation.addedNodes[i].nodeType); }
                    if(showDebug) { console.debug(mutation.addedNodes[i].tagName); }
                    if(showDebug) { console.debug(mutation.addedNodes[i].childNodes); }
                    cleanItUp(mutation.addedNodes[i]);
                }
            });
        });
        observer.observe(document.getElementsByClassName('thread')[0], { childList: true });
        observer.observe(document.body, { childList: true });
    }

    // Add click listeners to each element which brings up a posting / reply form
    Array.from(document.getElementsByClassName('postNum')).forEach(function(a) {
        var postLinks = a.getElementsByTagName('a');
        postLinks[1].addEventListener('click', function() { wreckNameFigs(postLinks[1].getAttribute('href')); });
    });
    document.getElementById('togglePostFormLink').firstElementChild.addEventListener('click', wreckNameFigs);
    Array.from(document.getElementsByClassName('open-qr-link')).forEach(a => a.addEventListener('click', wreckNameFigs));


})();

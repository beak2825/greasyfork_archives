// ==UserScript==
// @name         Beatport - Hide Duplicate across "tracks" pages
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  When author has several "Tracks" pages, a specific track can be shown multiple times across author's "tracks" pages. So, this script  leaves only  unique track on one page, and hides its duplicates on all other pages/occurences.
// @author       https://puvox.software
// @match        https://www.beatport.com/artist/*/tracks*
// @icon         https://www.google.com/s2/favicons?domain=beatport.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/431937/Beatport%20-%20Hide%20Duplicate%20across%20%22tracks%22%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/431937/Beatport%20-%20Hide%20Duplicate%20across%20%22tracks%22%20pages.meta.js
// ==/UserScript==






(function() {
    'use strict';

    class trackDuplicateClass
    {
        storage = window.localStorage;
        iName   = 'authorBlocks';
        intervalSeconds=3;
        removeIfNotAuthor = true;

        cacheGet() {
            let resultStored = this.storage.getItem(this.iName);
            if (resultStored==null || resultStored==''){
                resultStored = '{}';
            }
            return JSON.parse(resultStored);
        }

        cacheSet(obj) {
            this.storage.setItem(this.iName, JSON.stringify(obj));
        }


        //
        authorarrayGet(authorName) {
            let allAuthors = this.cacheGet();
            let authorTracksArray = {};
            if( authorName in allAuthors ){
                authorTracksArray = allAuthors[authorName];
            }
            else{
                authorTracksArray = { 0 : [] };
            }
            return authorTracksArray;
        }

        authorAdd(authorName, pageId, trackName) {
            let allAuthors = this.cacheGet();
            if( !(authorName in allAuthors) ){
                allAuthors[authorName] = {};
            }
            if( !(pageId in allAuthors[authorName]) ){
                allAuthors[authorName][pageId] = [];
            }
            if( !(allAuthors[authorName][pageId].includes(trackName)) ){
                allAuthors[authorName][pageId].push(trackName);
            }
            this.cacheSet(allAuthors);
        }


        startCheckCurrentTracks()
        {
            window.setInterval(this.checkCurrentTracks.bind(this), this.intervalSeconds * 1000 );
            //this.checkCurrentTracks();
        }

        checkedPagesInSession = [];

        checkCurrentTracks()
        {
            if ( location.href.includes('/artist') && location.href.includes('/tracks') )
            {
                let curPageNum   = this.getCurrentPage();
                let authorName   = this.getAuthorName();

                // avoid endless rechecks
                let authorPageKey = authorName+"_"+curPageNum;
                if (this.checkedPagesInSession.includes(authorPageKey)) return;
                this.checkedPagesInSession.push(authorPageKey);
                //

                this.deleteDuplicatesOnSamePage();
                let pageTracks   = this.getCurrentTracks();
                let authorArr    = this.authorarrayGet(authorName);
                for(var trackName of pageTracks)
                {
                    let	foundPageNum =0;
                    for (let [arrayPageNum, arr] of Object.entries(authorArr) )
                    {
                        if ( arr.includes(trackName) )
                        {
                            foundPageNum = arrayPageNum;
                        }
                    }

                    // add or hide
                    if (!foundPageNum){
                        this.authorAdd( authorName, curPageNum, trackName );
                    }
                    else{
                        if (curPageNum != foundPageNum){
                            this.hideTracksByTitle(trackName);
                        }
                    }
                }
            }
        }


        hideTracksByTitle(trackTitle)
        {
            let AuthorName = this.getAuthorName();
            for( var x of document.querySelectorAll(".ec-bucket .bucket-item") )
            {
                if ( x.getAttribute("data-ec-d1") == AuthorName  && (x.getAttribute("data-ec-name")+x.querySelector(".buk-track-remixed").textContent) ==trackTitle)
                {
                    x.parentNode.removeChild(x);
                }
            }
        }

        getCurrentTracks()
        {
            let AuthorName = this.getAuthorName();

            let allNames = [];
            for( var x of document.querySelectorAll(".ec-bucket .bucket-item") )
            {
                if (x.getAttribute("data-ec-d1") == AuthorName )
                {
                    allNames.push((x.getAttribute("data-ec-name")+x.querySelector(".buk-track-remixed").textContent) );
                }
            }
            return allNames;
        }


        getAuthorName(){
            return this.checkValue( document.querySelector(".interior-title h1").textContent, null);
        }
        getCurrentPage(){
            return this.checkValue( document.querySelector(".pag-number-current").textContent, null);
        }
        checkValue(what, ifEquals){
            if (what == ifEquals) alert("error on script on page..");
            return what;
        }

        deleteDuplicatesOnSamePage()
        {
            let allNames = [];
            let AuthorName = this.getAuthorName();
            let reversedArr =  [].slice.call(document.querySelectorAll(".ec-bucket .bucket-item"), 0).reverse();
            for( var x of reversedArr )
            {
                // if option set
                if (this.removeIfNotAuthor) {
                    if( !x.querySelector(".buk-track-artists").textContent.includes(AuthorName) ) {
                        x.parentNode.removeChild(x);
                    }
                }
                // track name also retrieved from: x.getAttribute("data-ec-name")
                let curName = x.querySelector(".buk-track-title .buk-track-primary-title").textContent +"_"+x.querySelector(".buk-track-title .buk-track-remixed").textContent;
                if (!allNames.includes(curName) )
                {
                    allNames.push(curName);
                }
                else{
                    x.parentNode.removeChild(x);
                }
            }
            return allNames;
        }

    }


    (new trackDuplicateClass()).startCheckCurrentTracks();


})();
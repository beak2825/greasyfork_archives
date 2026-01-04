// ==UserScript==
// @name         F95+ 
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script to add stuff to F95
// @author       You
// @match        https://f95zone.to/*
// @icon         https://www.google.com/s2/favicons?domain=f95zone.to
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446591/F95%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/446591/F95%2B.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var URL = window.location.href;
    function insertCSS() {
        var css = `
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

	#settingsOuter {

		height: auto;
		min-height: 60%;
		background: #2a2c3b;
		width: auto;
		min-width: 60%;
		position: relative;
		top: 10px;
		margin: 10%;
		padding: 1%;
		display: flex;
		flex-flow: column;
		background: #2a2c3b;
		box-shadow: 0 0 10px #000000;
		pointer-events: auto;
	}

	.btnAdd {
		width: auto;
		height: auto;
		background: rgb(24, 26, 29) none repeat scroll 0% 0%;
		color: rgb(238, 238, 238);
	}

	.inputAdd {
		width: 30%;
		height: auto;
		background: rgb(24, 26, 29) none repeat scroll 0% 0%;
		color: rgb(238, 238, 238);
	}

	.blacklist {
		font-size: 1.25rem;
		float: left;
		min-width: 50%;
		color: white;
		display: inline-block;
		border: thin solid silver;
		padding: 5px;
	}

	.blacklistText {
		display: inline-block;
		margin: 0px;
		line-height: 2.5em;
		text-align: center;
	}

	.blacklistRemove {
		color: white !important;
		font-size: 1.25rem;
		display: inline-block;
		border: 3px solid red;
		background: red !important;
		float: right;
		padding-left: 5px;
		padding-right: 5px;
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
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
    insertCSS();
    var settings = JSON.parse(localStorage.getItem('F95_Settings'));
    var defaultSettings = {
        'tagBL': [],
        'tagWL': [],
        'threadBL':{}
    };

    //Updates settings when there is a change between versions.
    if (!settings) {
        console.log('Settings set to defaults.');
        settings = defaultSettings
    }
    else if (Object.keys(settings).length !== Object.keys(defaultSettings).length) {
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
                        console.log(`Removed invalid variable and value from settings, ${key}:${settings[key]}.`);
                        delete settings[key]
                    };
                });
        }
    };

    localStorage.setItem('F95_Settings', JSON.stringify(settings));

    function FullsizeImages(){
        var elements = document.querySelectorAll('.resource-tile_thumb');
        elements.forEach(element => {
            element=element.parentNode;
            var inner = element.innerHTML;
            var newInner = inner.replace(/(?<=(style=\"background-image:url\(https:\/\/attachments\.f95zone\.to\/[0-9]+\/[0-9]+\/))[0-9]+w\/(?=(.*\..*\)\"))/gi, "");
            element.innerHTML = newInner;
        });
    };
    setTimeout(FullsizeImages,'1000');

    function searchRoot(){
        document.querySelectorAll('ol.block-body > li').forEach(li=>{
            try{
                let title = li.querySelector('h3');
                if (/.*post-/.test(title.children[0].href)){
                    let postLink = document.createElement('a');
                    postLink.href = title.children[0].href;
                    postLink.innerText = 'Comment Link';
                    postLink.style.marginLeft = '2em';
                    title.children[0].href = title.children[0].href.replace(/([^\/]+$)/,'');
                    title.insertBefore(postLink,title.children[2]);
                }
            }catch(error){
                console.log(li);
            };
        })
    };

    function titleSet(){
        var r=/page-[0-9]+/;
        document.title = document.title.replace(/ \| F95zone/i,'');
        if (r.test(URL)){
            try{
                document.title += URL.match(/page-([0-9]+)/)[0];
            }catch{}
        };
        if (URL.match(/post-([0-9]+)/)){
            document.title += '_';
            document.title += URL.match(/post-([0-9]+)/)[0];
        }
    };

    function ThreadBlacklist(){
        settings = JSON.parse(localStorage.getItem('F95_Settings'));
        var As = document.querySelectorAll('a.link, a.resource-tile_link,.listBlock a, .contentRow-title a')
        As.forEach(a=>{
            let id = a.href.match(/(?<=\.|\/)[0-9]+/)
            if (!id){return}
            id = id[0]
            if (!id.includes('.')){id = '.'+id}
            if (id in settings.threadBL){
                if (a.closest('.block-outer')||
                    a.closest('.p-body-header')||
                    a.closest('header')||
                    a.closest('footer')
                   ){return}
                else if(a.closest('.brmsContentList')||
                        a.closest('li')){
                    a.closest('li').remove();
                }
                else if(a.closest('.structItem')){
                    a.closest('.structItem').remove()
                }
                else if(a.closest('.resource-tile')){
                    a.closest('.resource-tile').remove()
                }
                else{
                    a.remove();
                };
            }
        })
    };

    function tagCheck(){
        var allTags = document.querySelectorAll('[class="tagItem"]'), tagCount=0, currentTag;
        var count = 0;
        while (currentTag = allTags[tagCount++])
        {
            count++;
            var counter=0;
            if (settings.tagBL.includes(currentTag.text)){
                currentTag.style.background = 'black';
                currentTag.style.color = 'red';
            }
            else if (settings.tagWL.includes(currentTag.text)){
                currentTag.style.background = 'white';
                currentTag.style.color = 'black';
            }
        }
    };

    function settingsMenu(){
        let nav = document.querySelector('.p-navSticky').children[0].children[0];
        let settingsOpen = document.createElement('div');
        settingsOpen.style = 'height:1.75em;width:1.75em;';
        let settingsImage = document.createElement('img');
        settingsImage.src = 'data:image/png;base64,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'
        settingsImage.style = 'filter: invert(0.75);'
        settingsOpen.appendChild(settingsImage);
        settingsOpen.onclick = function(){confDisp.style.display = 'block'}

        nav.appendChild(settingsOpen);
        var settingsOuter = document.createElement('div');
        settingsOuter.setAttribute('id','settingsOuter')

        var top = document.createElement('div');
        top.style.width = '100%';
        top.style.height = '4em';

        var close = document.createElement('div');
        close.setAttribute('class','blacklistRemove')
        close.innerText = 'Exit';
        close.onclick = function(){
            confDisp.style.display = 'none';
        };

        top.appendChild(close);
        settingsOuter.appendChild(top);

        function createArrayDisplay(array,arrayTitle){
            function arrayEntryDisplay(entry){
                try{
                    var tagListing = document.createElement('div');
                    tagListing.setAttribute('class','blacklist');

                    var tagN = document.createElement('p');
                    tagN.setAttribute('class','blacklistText');
                    tagN.innerText = entry;

                    var del = document.createElement('a');
                    del.setAttribute('class','blacklistRemove');
                    del.innerText = 'Remove';
                    del.onclick = function (){
                        try{
                            console.log(settings[array])
                            let entry = this.parentNode.children[0].innerText;
                            settings = JSON.parse(localStorage.getItem('F95_Settings'));
                            if (settings[array].includes(entry)) {
                                let position = settings[array].indexOf(entry);
                                settings[array].splice(position, 1);
                                localStorage.setItem('F95_Settings', JSON.stringify(settings));
                                settings = JSON.parse(localStorage.getItem('F95_Settings'));
                            };
                            tagListing.remove();
                        }catch(error){
                            console.log('arrayRemoveText',error);
                        }
                    };

                    tagListing.appendChild(tagN);
                    tagListing.appendChild(del);
                    tagDisplay.appendChild(tagListing);
                }catch(error){console.log('arrayEntryDisplay',error)}

            }
            var tagDisplay = document.createElement('div');
            tagDisplay.style.width = '100%';
            tagDisplay.style.height = 'auto';
            tagDisplay.style.minHeight = 'auto';

            var title = document.createElement('h3');
            title.innerText = arrayTitle;

            var arrayAdd = document.createElement('div');
            var arrayAddInput = document.createElement('input');
            arrayAddInput.setAttribute('class','inputAdd')

            var arrayAddSend = document.createElement('button');
            arrayAddSend.setAttribute('class','btnAdd')
            arrayAddSend.innerText = 'Add Tag';
            arrayAddSend.onclick = function(){
                if (settings[array].includes(settings[array].value)){return}
                else if (!settings[array].includes(settings[array].value)){
                    settings = JSON.parse(localStorage.getItem('F95_Settings'));
                    settings[array].push(arrayAddInput.value);
                    localStorage.setItem('F95_Settings', JSON.stringify(settings));
                    settings = JSON.parse(localStorage.getItem('F95_Settings'));
                    arrayEntryDisplay(arrayAddInput.value);
                };
            };
            arrayAdd.appendChild(arrayAddInput);
            arrayAdd.appendChild(arrayAddSend);
            settings[array].forEach(entry=>arrayEntryDisplay(entry))

            tagDisplay.prepend(arrayAdd)
            tagDisplay.prepend(title)
            return tagDisplay;
        };

        function createObjectDisplay(object,objectTitle){
            async function fetchTitle(entry){

                var x;
                await fetch(`https://f95zone.to/threads/${entry}/`, {
                    "credentials": "include",
                    "headers": {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0",
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                        "Accept-Language": "en-GB,en;q=0.5",
                        "Upgrade-Insecure-Requests": "1",
                        "Sec-GPC": "1"
                    },
                    "method": "GET",
                    "redirect": "follow",
                    "mode": "cors"
                }).then(function(response) {
                    return (response.text());
                }).then(responsetext=>{
                    var parsedResponse = (new window.DOMParser()).parseFromString(responsetext, "text/html");
                    x = document.querySelector("title").innerHTML = parsedResponse.title
                    x = x.replace(/F95zone/i,'');
                    console.log('xx',x)

                })
                return x
            };
            async function objectEntryDisplay(entry){
                try{
                    let title = settings[object][entry].Title

                    if (title == 'Placeholder' || typeof(title) != 'string'){
                        console.log('q',entry)
                        settings[object][entry].Title = await fetchTitle(entry)
                        localStorage.setItem('F95_Settings', JSON.stringify(settings));
                        settings = JSON.parse(localStorage.getItem('F95_Settings'));
                    }
                    else if(title.includes('Title:')){
                        title = title.replace(' \| ','')
                        settings[object][entry].Title = title.replace('Title: ','')
                        localStorage.setItem('F95_Settings', JSON.stringify(settings));
                        settings = JSON.parse(localStorage.getItem('F95_Settings'));
                    }
                    var tagListing = document.createElement('div');
                    tagListing.setAttribute('class','blacklist');

                    var tagN = document.createElement('p');
                    tagN.setAttribute('class','blacklistText');
                    tagN.innerText = settings[object][entry].Title;

                    var del = document.createElement('a');
                    del.setAttribute('class','blacklistRemove');
                    del.innerText = 'Remove';
                    del.onclick = function (){
                        try{
                            if (entry in settings[object]) {
                                delete settings[object][entry]
                                localStorage.setItem('F95_Settings', JSON.stringify(settings));
                                settings = JSON.parse(localStorage.getItem('F95_Settings'));
                            };
                            tagListing.remove();
                        }catch(error){
                            console.log('objectRemoveText',error)
                        }
                    };

                    tagListing.appendChild(tagN);
                    tagListing.appendChild(del);
                    tagDisplay.appendChild(tagListing);
                }catch(error){console.log('objectEntryDisplay',error)}

            }
            function blacklistCurrentThread(){
                function blacklistThisThread(){
                    if (!URL.match(/\.[0-9]+/)){
                        return;
                    }
                    let threadID = URL.match(/\.[0-9]+/)
                    if (!threadID){
                        return
                    }
                    threadID=threadID[0]
                    settings = JSON.parse(localStorage.getItem('F95_Settings'));
                    if (!(threadID in settings[object])){
                        settings[object][threadID] = {'Title':document.title};
                        localStorage.setItem('F95_Settings', JSON.stringify(settings));
                        settings = JSON.parse(localStorage.getItem('F95_Settings'));
                        console.log(settings[object])
                        objectEntryDisplay(threadID)
                    };

                }
                var objectCurrentSend = document.createElement('button');
                objectCurrentSend.setAttribute('class','btnAdd')
                objectCurrentSend.innerText = 'Add Current Thread';
                objectCurrentSend.onclick = blacklistThisThread;
                window.f95_blThread = blacklistThisThread;
                return objectCurrentSend
            };
            var tagDisplay = document.createElement('div');
            tagDisplay.style.width = '100%';
            tagDisplay.style.height = 'auto';
            tagDisplay.style.minHeight = 'auto';

            var title = document.createElement('h3');
            title.innerText = objectTitle

            var objectAdd = document.createElement('div');
            var objectAddInput = document.createElement('input');
            objectAddInput.setAttribute('class','inputAdd')

            var objectAddSend = document.createElement('button');
            objectAddSend.setAttribute('class','btnAdd')
            objectAddSend.innerText = 'Add Thread';
            objectAddSend.onclick = function(){
                let threadID = objectAddInput.value.match(/\.[0-9]+/)
                if (!threadID){
                    objectAddInput.value = 'Failed to obtain ID'
                    return
                }
                threadID=threadID[0]
                settings = JSON.parse(localStorage.getItem('F95_Settings'));
                if (!(threadID in settings[object])){
                    settings[object][threadID] = {'Title':'Placeholder'};
                    localStorage.setItem('F95_Settings', JSON.stringify(settings));
                    settings = JSON.parse(localStorage.getItem('F95_Settings'));
                    console.log(settings[object])
                    objectEntryDisplay(threadID)
                };
            };
            objectAdd.appendChild(objectAddInput);
            objectAdd.appendChild(objectAddSend);
            objectAdd.appendChild(blacklistCurrentThread());
            for (let [key, value] of Object.entries(settings[object])) {
                objectEntryDisplay(key)
            }

            tagDisplay.prepend(objectAdd)
            tagDisplay.prepend(title)
            return tagDisplay;
        }

        settingsOuter.appendChild(new createArrayDisplay('tagBL','Blacklisted Tags'));
        settingsOuter.appendChild(new createArrayDisplay('tagWL','Whitelisted Tags'));
        settingsOuter.appendChild(new createObjectDisplay('threadBL','Blacklisted Threads'));

        var confDisp = document.createElement('div');
        confDisp.setAttribute('id', 'confDisp');

        confDisp.appendChild(settingsOuter);
        document.body.appendChild(confDisp);


        let settingsBLThread = document.createElement('div');
        settingsBLThread.style = 'height:1.75em;width:1.75em;';
        let settingsBLIMG = document.createElement('img');
        settingsBLIMG.src = 'https://i.imgur.com/vbVjxO0.png';
        settingsBLIMG.style = 'filter: invert(0.75);'
        settingsBLThread.onclick = window.f95_blThread;
        settingsBLThread.appendChild(settingsBLIMG);
        nav.appendChild(settingsBLThread);
    };
    settingsMenu();

    if (URL.match(/\.[0-9]+/)){
        titleSet();
        tagCheck();
        ThreadBlacklist();
    }
    else if (/.*f95zone.to\/search\/[0-9]+/.test(URL)){
        searchRoot();
        ThreadBlacklist();
    }
    else if (URL == 'https://f95zone.to/' || 'https://f95zone.to/latest/'){
        var observerTimer = new MutationObserver(awaitTimer);
        function awaitTimer(mutations) {
            for (let mutation of mutations) {
                try{
                    if (mutation.addedNodes.length != 0 && mutation.addedNodes[0].hasAttribute('classList') && mutation.addedNodes[0].classList.contains('.resource-tile_hover-wrap')){return}
                }catch(error){}
                try {
                    var gamesList = document.querySelector('.brmsContentList,#latest-page_items-wrap_inner');
                } catch (error) {}
                if (gamesList && (gamesList !== undefined && gamesList.length != 0)) {
                    //observerTimer.disconnect(); // stop observing
                    ThreadBlacklist()
                };
            };
        };
        observerTimer.observe(document, {
            childList: true,
            subtree: true
        });
    }

})();
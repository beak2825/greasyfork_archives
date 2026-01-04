// ==UserScript==
// @name         forumfr-last-messages-filter
// @namespace    http://tampermonkey.net/
// @version      0.4.8
// @description  Remplace la liste des derniers messages de la page d'accueil par un flux personnalisé. Cela permet notamment de supprimer les messages envahissants en provenance de la catégorie « Jeux de l'asile ».
// @author       Ed38
// @license      MIT
// @match        https://www.forumfr.com/
// @match        https://www.forumfr.com/?*
// @match        https://www.forumfr.com/discover/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=forumfr.com
// @run-at       document-body
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/522807/forumfr-last-messages-filter.user.js
// @updateURL https://update.greasyfork.org/scripts/522807/forumfr-last-messages-filter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const cacheAgeMax = 300 ;
    const cacheAgeMin = 60 ;
    const maxRetries = 2 ;
    const now = new Date().getTime();
    const defFeedUrl = "https://www.forumfr.com/discover/348" ;
    const defShowTime = true ;
    const defLastFromTopic = true ;
    const defNewMsg = true ;
    const feedSettingsUrlRegex = /^https:\/\/www.forumfr.com\/discover\/.*/i ;
    const feedSelectionUrlRegex = /^https:\/\/www.forumfr.com\/discover\/[0-9]+/i ;
    let menuResetDefaultsId = GM_registerMenuCommand("Réinitialiser les paramètres", resetDefaults);
    let menuShowTimeId ;
    let feedUrl = null ;
    let showTime = null ;
    let cacheTitle = null ;
    let lastFromTopic = null ;
    let newMsg = null ;
    let retry = 0 ;
    let timeout ;

    feedUrl = GM_getValue("feedUrl", null) ;
    if (feedUrl === null){
        feedUrl = defFeedUrl ;
    }
    showTime = GM_getValue("showTime", null) ;
    if (showTime === null){
        showTime = defShowTime ;
    }
    lastFromTopic = GM_getValue("lastFromTopic", null) ;
    if (lastFromTopic === null){
        lastFromTopic = defLastFromTopic ;
    }
    newMsg = GM_getValue("newMsg", null) ;
    if (newMsg === null){
        newMsg = defNewMsg ;
    }

    let lastFromTopicParameter = "?&stream_include_comments=" ;
    if (lastFromTopic) {
        lastFromTopicParameter += "0" ;
    }
    else{
        lastFromTopicParameter += "1" ;
    }
    feedUrl+=lastFromTopicParameter ;


    if (feedSettingsUrlRegex.test(document.location.href)) {
        GM_addStyle(`
            #stream_containers_topic ul[data-role="tokenList"]{
            max-height:180px;
            overflow:scroll;
            }
            #topicSelUnselAll{
            text-align:center;
            }
            #topicSelUnselAll span{
            display:inline-block;
            }
            `);

        document.body.addEventListener("mousedown", topicMenuMod, false) ;
        if(feedSelectionUrlRegex.test(document.location.href)){
            document.body.addEventListener("mousedown", saveMenuMod, false) ;
        }
    }

    GM_addStyle(`
            div[data-widgetarea="col2"] a, div[data-widgetarea="col2"] span {
            visibility:hidden ;
            }
            div[data-widgetarea="col2"].showLastMsgs li div *, div[data-widgetarea="col2"].showLastMsgs div span {
            visibility:visible !important;
            .lmfTime {
            position:absolute;
            right:4px;
            bottom:0px;
            }
            div.lmfOptions {
            font-size:.75em;
            position:absolute;
            right:4px;
            bottom:2px;
            }
            div.lmfOptions input {
            width:10px;
            height:10px;
            }

            `) ;

    let cachedFeed = loadCache() ;
    if(cachedFeed){
        fillHome(cachedFeed) ;
        if(canRefresh()){
            loadFeed() ;
        }
    }
    else {
        preFillTitle() ;
        loadFeed() ;
    }

    showTimeMenu() ;


    function resetDefaults() {
        let r = confirm("Réinitialiser les paramètres de personnalisation du flux d'accueil ?") ;
        if (r === true) {
            GM_deleteValue("feedUrl") ;
            GM_deleteValue("cache") ;
            GM_deleteValue("cacheTime") ;
            GM_deleteValue("showTime") ;
            GM_deleteValue("cacheTitle") ;
            GM_deleteValue("lastFromTopic") ;
            GM_deleteValue("newMsg") ;
        }
    }


    function toggleShowTime(){
        if(showTime){
            showTime = false ;
        } else {
            showTime = true ;
        }
        GM_setValue("showTime",showTime) ;
        showTimeMenu() ;
        location.reload() ;
    }


    function showTimeMenu() {
        if (menuShowTimeId) {
            GM_unregisterMenuCommand(menuShowTimeId) ;
        }
        let status
        if (showTime) {
            status = "ON" ;
        } else {
            status = "OFF" ;
        }
        menuShowTimeId = GM_registerMenuCommand("Âge des messages : " + status, toggleShowTime) ;
    }


    function saveCache(data){
        GM_setValue("cache",data) ;
        GM_setValue("cacheTime",now) ;
    }


    function loadCache(){
        let cacheTime = GM_getValue("cacheTime",null) ;
        if ( cacheTime && ((now - cacheTime) < cacheAgeMax * 1000 )) {
            let data = GM_getValue("cache",null) ;
            if(data) return data ;
        }
        return false ;
    }


    function canRefresh(){
        let cacheTime = GM_getValue("cacheTime",null) ;
        if ( cacheTime && ((now - cacheTime) > cacheAgeMin * 1000 )) return true ;
        return false ;
    }


    function saveMenuMod() {
        let feedOptionsMenu = document.body.querySelector("#elStreamOptions_menu") ;
        if (feedOptionsMenu ){
            document.body.removeEventListener("mousedown", saveMenuMod, false) ;
            let saveHomeHtml = `
        <li>
            <a href="javascript:void(0)" id="saveHome">Utiliser ce flux en page d'accueil</a>
        </li>
        `;
            let saveHomeNode = htmlText2Node(saveHomeHtml) ;
            saveHomeNode.classList = feedOptionsMenu.querySelector("li").classList ;
            feedOptionsMenu.appendChild(saveHomeNode) ;
            feedOptionsMenu.querySelector("#saveHome").addEventListener("mousedown", saveFeedUrl, false) ;
        }
    }


    function saveFeedUrl(){
        let newFeedUrl = document.location.href.match(feedSelectionUrlRegex) ;
        if (newFeedUrl) {
            GM_setValue("feedUrl",newFeedUrl) ;
            clearCache() ;
        }
    }


    function topicMenuMod() {
        let topicList = document.body.querySelector('#ipsTabs_tabs_nodeSelect_stream_containers_topic_nodeSelect_stream_containers_topic_tab_global_panel') ;
        if (topicList){
            document.body.removeEventListener("mousedown", topicMenuMod,false) ;
            let topicSelectUnselectAllHtml = `
        <div id="topicSelUnselAll">
           <span id="topicSelectAll" class="ipsButton_veryLight">Tout sélectionner</span>
           &nbsp;
           <span id="topicUnselectAll" class="ipsButton_veryLight">Tout désélectionner</span>
        </div>
        `;
            let topicSelectUnselectAllNode = htmlText2Node(topicSelectUnselectAllHtml) ;
            topicList.parentNode.insertBefore(topicSelectUnselectAllNode,topicList) ;
            document.getElementById("topicSelectAll").addEventListener("mousedown", topicSelectAll,"select" ,false) ;
            document.getElementById("topicUnselectAll").addEventListener("mousedown", topicUnselectAll,"unselect",false) ;
        }
        // Clear cache in case of possible changes
        if (document.location.href === feedUrl) {
            let elStreamOptions_menu = document.getElementById("elStreamOptions_menu") ;
            if (elStreamOptions_menu) {
                elStreamOptions_menu.addEventListener("mousedown", clearCache, false) ;
            }
            let elStreamFilterForm = document.getElementById("elStreamFilterForm") ;
            if (elStreamFilterForm) {
                elStreamFilterForm.addEventListener("mousedown", clearCache, false) ;
            }
        }
    }

    function clearCache() {
        GM_deleteValue("cache") ;
        GM_deleteValue("cacheTime") ;
        GM_deleteValue("cacheTitle") ;
    }

    function topicSelectAll(){
        topicSelectUnselectAll("select") ;
    }

    function topicUnselectAll(){
        topicSelectUnselectAll("unselect") ;
    }

    function topicSelectUnselectAll(cmd) {
        let list = document.getElementById("topicSelUnselAll").nextElementSibling ;
        let itemClass="ipsSelectTree_item" ;
        let selectedClass="ipsSelectTree_selected" ;
        let items2click ;
        if (cmd === "unselect") {
            items2click = list.querySelectorAll('div.' + itemClass + '.' + selectedClass) ;
        }
        else if (cmd === "select") {
            items2click = list.querySelectorAll('div.' + itemClass + ':not(.' + selectedClass + ')') ;
        }
        else {

            return ;
        }
        items2click.forEach(item2click => item2click.click()) ;
    }

    function htmlText2Node(text){
        let htmlNode = new DOMParser().parseFromString(text, "text/html") ;
        return htmlNode.body.firstChild ;
    }

    async function loadFeedOld() {
        // Chargement du flux personnalisé.
        let feedRequest = await fetch (feedUrl) ;
        let feedHtmlText = await feedRequest.text() ;
        fillHome(feedHtmlText) ;
        saveCache(feedHtmlText) ;
    }

    async function loadFeed() {
        // Chargement du flux personnalisé.
        let feedRequest ;
        let feedHtmlText ;
        try {
            feedRequest = await fetch (feedUrl) ;
            feedHtmlText = await feedRequest.text() ;
        }
        catch (e) {
            retry++ ;
            if (retry <= maxRetries) {
                loadFeed() ;
            }
            else {
                console.error(e) ;
            }
        }

        fillHome(feedHtmlText) ;
        saveCache(feedHtmlText) ;
    }


    function fillHome(feedHtmlText) {
        // Remplissage de la page d'accueil.
        const homeListTest = 'div[data-widgetarea="col2"] li.ipsDataItem:nth-child(16)' ;
        if (document.body.querySelector(homeListTest)){
            writeHomeList(feedHtmlText) ;
        } else {
            waitForElement(homeListTest).then((element) => {
                writeHomeList(feedHtmlText) ;
            });
        }
    }

    function preFillTitle() {
        let cacheTitle = GM_getValue("cacheTitle",null) ;
        let titleSelector = 'div[data-widgetarea="col2"] h3' ;
        if (cacheTitle != null) {
            let elTitle = document.body.querySelector(titleSelector) ;
            if (elTitle) {
                elTitle.innerHTML = cacheTitle ;
            }
            else{
                waitForElement(titleSelector).then((element) => {
                    element.innerHTML=cacheTitle ;
                });
            }
        }
    }

    function writeHomeList(feedHtmlText) {
        let feedHtmlNode = new DOMParser().parseFromString(feedHtmlText, "text/html") ;
        let feedItems = feedHtmlNode.querySelectorAll('li[data-role="activityItem"]') ;
        let homeMsgs = document.evaluate('//div[@data-widgetarea="col2"]//li[@class="ipsDataItem"]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null) ;

        if (homeMsgs.snapshotLength >= 15 && feedItems.length >= 15){
            for (let i = 0; i < 15; i++) {
                let homeMsg = homeMsgs.snapshotItem(i) ;
                let msgLinksHome = homeMsg.querySelectorAll("a") ;
                let msgLinksNew = feedItems[i].querySelectorAll("a") ;
                let subjectHome = msgLinksHome[0] ;
                let subjectNew = msgLinksNew[2] ;
                subjectNew=feedItems[i].querySelector("a[data-linktype='link']") ;

                if (lastFromTopic === true || newMsg === true) {
                    let url = subjectNew.href ;
                    url = new URL(url) ;
                    let params = url.searchParams ;

                    if (lastFromTopic === true) {
                        if (newMsg === true) {
                            params.set("do", "getNewComment") ;
                        }
                        else {
                            params.set("do", "getLastComment") ;
                        }
                        params.delete("comment") ;
                    }
                    else if (newMsg === true) {
                        params.set("do", "getNewComment") ;
                        params.delete("comment") ;
                    }
                    url.search = params.toString() ;
                    subjectNew.href = url.toString() ;
                }

                subjectHome.href = subjectNew.href ;
                let subjectText = subjectNew.innerHTML ;
                subjectHome.title = "Afficher le sujet " + subjectText ;

                if (subjectText.length > 61) {
                    subjectText = subjectText.substring(0 ,61) + "..." ;
                }
                subjectHome.innerHTML = subjectText ;
                let authorHome = msgLinksHome[1] ;
                let authorNew = msgLinksNew[5] ;
                authorNew = feedItems[i].querySelector("p > a") ;
                authorHome.href = authorNew.href ;
                authorHome.dataset.ipshoverTarget = authorNew.dataset.ipshoverTarget ;
                authorHome.innerHTML = authorNew.innerHTML ;
                authorHome.title = authorNew.title ;

                if (showTime){
                    let msgTime = feedItems[i].querySelector("time").getAttribute("data-short") ;
                    let elTime = homeMsg.querySelector('*[class*="lmfTime"]') ;
                    if (elTime === null) {
                        let elTimeHtml = `
                    <div class="lmfTime ipsType_light ipsType_small">
                    <i class="fa fa-clock-o"></i>
                    <span>` + msgTime + `</span>
                    </div>
                    ` ;
                    elTime = htmlText2Node(elTimeHtml) ;
                        homeMsg.appendChild(elTime) ;
                    }
                    else {
                        elTime.querySelector("span").innerHTML = msgTime ;
                    }
                }
            }


            if (!document.querySelector("#lmfLastMsg")) {
                let elLastMsgDivHtml=`
            <div class="lmfOptions">
               <div><input type="checkbox" id="lmfLastMsg" />&nbsp;Afficher uniquement le dernier message du sujet</div>
               <div><input type="checkbox" id="lmfNewMsg" />&nbsp;Aller au premier message non lu</div>
            </div>
            ` ;
            let elOptionsDiv = htmlText2Node(elLastMsgDivHtml) ;
                homeMsgs.snapshotItem(15).appendChild(elOptionsDiv) ;

                let elLastMsgCheckbox = document.getElementById("lmfLastMsg") ;
                if (lastFromTopic === true) {
                    let attChecked = document.createAttribute("checked") ;
                    attChecked.value = "checked" ;
                    elLastMsgCheckbox.setAttributeNode(attChecked) ;
                }
                elLastMsgCheckbox.addEventListener("change", lastFromTopicToggle,false) ;

                let elNewMsgCheckbox = document.getElementById("lmfNewMsg") ;
                if (newMsg === true) {
                    let attChecked = document.createAttribute("checked") ;
                    attChecked.value = "checked" ;
                    elNewMsgCheckbox.setAttributeNode(attChecked) ;
                }
                elNewMsgCheckbox.addEventListener("change", newMsgToggle,false) ;
            }

            homeMsgs.snapshotItem(15).querySelectorAll("a")[0].href=feedUrl ;

            let panel = document.body.querySelector('div[data-widgetarea="col2"]') ;
            let title = feedHtmlNode.querySelector('span[data-role="streamTitle"]').innerHTML ;
            panel.querySelector('h3').innerHTML = title ;
            panel.classList.add("showLastMsgs") ;
            GM_setValue("cacheTitle",title) ;
        }
        else
        {
            clearCache() ;
            retry++ ;
            if (retry <= maxRetries) {
                loadFeed() ;
            }
        }
    }

    function lastFromTopicToggle() {
        if (lastFromTopic === true) {
            lastFromTopic = false ;
        }
        else {
            lastFromTopic = true ;
        }
        GM_setValue("lastFromTopic",lastFromTopic);
        GM_deleteValue("cacheTime") ;
        location.reload();
    }

    function newMsgToggle() {
        if (newMsg === true) {
            newMsg = false ;
        }
        else {
            newMsg = true ;
        }
        GM_setValue("newMsg",newMsg) ;
        location.reload() ;
    }

    function waitForElement(selector) {
        return new Promise((resolve) => {
            const observer = new MutationObserver((mutations, observer) => {
                const element = document.body.querySelector(selector) ;
                if (element) {
                    observer.disconnect() ;
                    resolve(element) ;
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        });
    }

})() ;
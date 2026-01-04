// ==UserScript==
// @name Ctrl+Paint: Add missing Next and Previous buttons
// @namespace https://github.com/T1mL3arn
// @description There are no navigation buttons for some video pages of tutorial series. This script adds missing buttons like Next or Previous. 
// @author T1mL3arn
// @version 1.2
// @icon https://static1.squarespace.com/static/50a3c190e4b0d12fc9231429/t/50f87f8ce4b0b3f0a2deeb1d/1537054440579/
// @match https://www.ctrlpaint.com/library* 
// @match https://www.ctrlpaint.com/videos/* 
// @run-at document-end
// @noframes
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_listValues
// @grant GM.setValue
// @grant GM.getValue
// @grant GM.deleteValue
// @grant GM.listValues
// @license GPLv3 
// @homepageURL https://github.com/t1ml3arn-userscript-js/Ctrl-Paint-Add-missing-Next-and-Previous-buttons
// @supportURL https://github.com/t1ml3arn-userscript-js/Ctrl-Paint-Add-missing-Next-and-Previous-buttons/issues
// @downloadURL https://update.greasyfork.org/scripts/373039/Ctrl%2BPaint%3A%20Add%20missing%20Next%20and%20Previous%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/373039/Ctrl%2BPaint%3A%20Add%20missing%20Next%20and%20Previous%20buttons.meta.js
// ==/UserScript==

(() => {
    // lib section
    let log = console.log;
    let err = console.error;
    function findHeader(elt){
        let prev = elt;
        while(prev = prev.previousSibling)
            if(prev.tagName == 'H3')
                return prev;
        return null;
    }
    function mapsListItemsToNames(list){
        let items = list.querySelectorAll('li a');
        let result = [];
        items.forEach((item)=>result.push(item.textContent));
        return result;
    }
    function mapListItemsToLinks(list){
        let items = list.querySelectorAll('li a');
        let result = [];
        items.forEach((item)=>result.push(item.href));
        return result;
    }
    function readSeriesFrom(document){
        let lists = document.querySelectorAll('ol, ul');
        let results = [];

        lists.forEach((list)=>{

            // skip empty lists
            if(list.children.length == 0)
                return;
            
            let header = findHeader(list);
            if(header){
                let links = mapListItemsToLinks(list);
                if(links.length > 0){
                    let names = mapsListItemsToNames(list);

                    // just to be sure
                    if(names.length != links.length){
                        throw `Count of links isn\'t equal to count of names\nProblem in ${header.textContent}`;
                    }

                    results.push({
                        name: header.textContent,
                        videoNames: names,
                        videoLinks: links
                    });
                }
            }
        });
        
        if(results.length == 0)
            throw 'There are no tutorial series at all!';

        return results;
    }
    async function findTutorialSeriesDataForCurrentPage() {
        const data = await gm.getValue(TUTORIAL_SERIES_KEY, null)
        if (!data)  throw "Cannot find data for tutorial series"
        
        let path = window.location.pathname;
        let videoIndex;
        let index = data.findIndex((seriesData)=>{
            videoIndex = seriesData.videoLinks.findIndex((link)=>path != "/" && link.indexOf(path) != -1)
            return videoIndex != -1;
        });

        if(index == -1)
            return null;
        
        let seriesData = data[index];
        seriesData.currentVideoIndex = videoIndex;
        return seriesData;
    }
    function addButtons(seriesData) {
        
        function getButtonHtml(href, label, name) {

            return `<div class="button-block sqs-block-button" data-block-type="53" style="${btnCss}">
            <div class="sqs-block-content">
                <div class="sqs-block-button-container--center" data-alignment="center" data-button-size="small">
                    <a href="${href}" class="sqs-block-button-element--small sqs-block-button-element" data-initialized="true">
                    ${label}
                    ${name ? 
                    `<br>
                    <span style="${videoNameCss}">${name}</span>` : ''
                    }
                    </a>
                </div>
            </div>
            </div>`
        }
        function arrayToCss(acc, val, ind){
            return ind%2 == 0 ? `${acc}${val}: ` : `${acc}${val} !important; `;
        }

        let btnCss = ["flex", "0 1 auto", "align-self", "auto", "margin", "10px"].reduce(arrayToCss, '');
        let videoNameCss = "font-size, 11px, text-transform, none, color, #DDD".split(", ").reduce(arrayToCss);
        let btnContCss = [
            "display", "flex",
            "flex-direction", "row",
            "flex-wrap", "wrap",
            "justify-content", "space-around",
            "align-content", "center",
            "align-items", "center",
            "padding", "15px",
        ].reduce(arrayToCss, '');

        let buttonsWrapper = document.createElement('div');
        buttonsWrapper.setAttribute('style', btnContCss);

        let videoBlock = document.querySelector('.sqs-block.embed-block.sqs-block-embed');
        if(videoBlock == null)
            throw 'There is no video block';

        videoBlock.insertAdjacentElement('afterend', buttonsWrapper);
        
        let names = seriesData.videoNames;
        let links = seriesData.videoLinks;
        let index = seriesData.currentVideoIndex;

        let nextHtml = index+1 < names.length ? getButtonHtml(links[index+1], 'NEXT', names[index+1]) : '';
        let prevHtml = index-1 > -1 ? getButtonHtml(links[index-1], 'PREVIOUS', names[index-1]) : '';

        buttonsWrapper.insertAdjacentHTML('beforeend', prevHtml);
        buttonsWrapper.insertAdjacentHTML('beforeend', nextHtml);
    }
    function patchSeriesData(seriesDataList) {
        
        try {
            let data = seriesDataList.find((seriesData) => seriesData.name.indexOf('Painting With Color') != -1);
            let index = data.videoNames.indexOf('Color Constructor Pt.2 Exercises');
            data.videoLinks[index] = 'https://www.ctrlpaint.com/videos/color-constructor-pt2-exercises';
        } catch (e) {
            err('Patch-1 error', e);
        }
        
        // remove the first series cause it has next/prev buttons
        index = seriesDataList.findIndex((seriesData) => seriesData.name.indexOf('Digital Painting 101') != -1);
        if(index != -1)
            seriesDataList.splice(index, 1);
        else
            throw 'Patch-2 error';
        
        return seriesDataList;
    }    

    const TUTORIAL_SERIES_KEY = 'tutorial_series_key';
    const ETAG_KEY = "etag"
    
    let global = this;
    let gm = {};

    try {

        if(typeof GM != 'undefined')
            gm = GM;
        else {
            gm = {};
            gm.info = GM_info;
            
            Object.entries({
                'GM_addStyle': 'addStyle',
                'GM_deleteValue': 'deleteValue',
                'GM_getResourceURL': 'getResourceUrl',
                'GM_getValue': 'getValue',
                'GM_listValues': 'listValues',
                'GM_notification': 'notification',
                'GM_openInTab': 'openInTab',
                'GM_registerMenuCommand': 'registerMenuCommand',
                'GM_setClipboard': 'setClipboard',
                'GM_setValue': 'setValue',
                'GM_xmlhttpRequest': 'xmlHttpRequest',
                'GM_getResourceText': 'getResourceText',
            }).forEach(([oldKey, newKey]) => {
            let old = global[oldKey] || window[oldKey];
            if(old && (typeof gm[newKey] == 'undefined')){
                gm[newKey] = function(...args){
                    return new Promise((resolve, reject) => {
                        try { resolve(old.apply(global, args)) } 
                        catch(e) { reject(e) }
                    });
                  }
                }
            });
        }

        log(`
        [ ${gm.info.script.name} ] inited
        Script handler is ${gm.info.scriptHandler}
        `);

    } catch (e) {
        log('ctrlpaint+ inited partialy. Something went wrong.');
    }

    // structure sample
    let series ={
        name: 'First Steps',                /* Name of chapter */
        videoNames: ['welcome', 'tut01'],   /* Names of all videos in this chapter  */
        videoLinks: ['#', '#'],             /* Links to each video in this chapter */
        currentVideoIndex: -1               /* Uses to find previous or next video in this chapter */
    };

    async function fetchLibraryPage() {

        // with this Cache-Control header I get cache hits
        const url = 'https://www.ctrlpaint.com/library'
        let response = await fetch(url, {headers: {"Cache-Control": "max-age=0"} });
        if(!response.ok) throw `Cannot fetch library page at ${url}`;

        return response
    }

    async function parseAndStoreTutorialSeriesData(response) {
        let pageText = await response.text();
        let libraryDocument = new DOMParser().parseFromString(pageText, 'text/html');

        let tutorialSeries = readSeriesFrom(libraryDocument);
        tutorialSeries = patchSeriesData(tutorialSeries);

        await gm.setValue(TUTORIAL_SERIES_KEY, tutorialSeries);
        await gm.setValue(ETAG_KEY, response.headers.get('ETag'))
    }

    (async ()=>{
        lastTutorialData = await gm.getValue(TUTORIAL_SERIES_KEY, null);
        lastETag = await gm.getValue(ETAG_KEY, null)

        // update all - it is the very first time or the previous version of the script
        if (lastTutorialData === null || lastETag === null) {

            const response = await fetchLibraryPage()
            await parseAndStoreTutorialSeriesData(response)

        } else if (lastETag !== null) {
            // ETAG is set, so lets check it

            const response = await fetchLibraryPage()
            const currentETag = response.headers.get('etag')

            // new etag, so I need to parse data again
            if (lastETag !== currentETag)
                await parseAndStoreTutorialSeriesData(response)
                
        }

        // check if current page is a VIDEO page
        if (window.location.pathname.startsWith("/videos/")) {

            let seriesData = await findTutorialSeriesDataForCurrentPage();
            if(seriesData != null) addButtons(seriesData)

        }

    })();
})();
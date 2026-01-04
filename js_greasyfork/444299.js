// ==UserScript==
// @name         No Spam Results in Google Search
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  No more spam results in your google search!
// @author       CY Fung
// @match        https://www.google.com/search?*
// @match        https://www.google.*.*/search?*
// @match        http://*/*
// @match        https://*/*
// @icon         https://greasyfork.org/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBeGswQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--d840d20219ec465d39691a24251f7affa09443a5/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RkhKbGMybDZaVjkwYjE5c2FXMXBkRnNIYVFISWFRSEkiLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--e4f27e4605e5535222e2c2f9dcbe36f4bd1deb29/nospam.png
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.deleteValue
// @grant       GM_getTab
// @grant       GM_saveTab
// @grant       GM_registerMenuCommand
// @license MIT
// @noframes

// @downloadURL https://update.greasyfork.org/scripts/444299/No%20Spam%20Results%20in%20Google%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/444299/No%20Spam%20Results%20in%20Google%20Search.meta.js
// ==/UserScript==

'use strict';

const cssTxt = `
a[href^="http"].gs-spam-link-disable, a[href^="http"].gs-spam-link-disable>h3 {
    text-decoration: initial;
    color: #d88a8a;
    background: #605766;
    cursor: no-drop;
}
`;

(function () {
    'use strict';

    const [window, document, hostname, location, history] = new Function('return [window, document, location.hostname, location, history];')(); // real window & document object
    let isGoogleSearchPage = hostname.includes('.google')?/\w+\.(google|googleusercontent)\.com(\.\w{0,2}){0,2}/.test(hostname):false;

    function getOrigin(url){
        let nt=null;
        url = `${url}`;
        try{
            nt=new URL(url);
        }catch(e){
            return url;
        }
        return `${nt.origin}`;
    }

    function purify(url){
        let nt=null;
        url = `${url}`;
        try{
            nt=new URL(url);
        }catch(e){
            return url;
        }
        return `${nt.origin}${nt.pathname}`;
    }
    function elementCount(document){
        if(!document) return null;
        try{
            return document.all.length;
        }catch(e){
            return document.getElementsByTagName("*").length;
        }
    }
    function consoleJSON(object){
        try{
            console.table(JSON.stringify(object,null,2))
        }catch(e){
            console.log('consoleJSON is not supported');
        }
    }
    function getTopDomain(str){
        let m = /((?<![^\/]\/)\b[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.\b[a-zA-Z]{2,3}(?:\.\b[a-zA-Z]{2})?)(?:$|\/)/.exec(str);
        if(m) return m[1];
        return str;
    }
    function checkSpam(tabObject){

        if( tabObject.hitAt>1 && Date.now()- tabObject.hitAt<30*1000){
            let filteredTimeline = tabObject.timeline.filter(entry=>entry.timeAt>=tabObject.hitAt);
                consoleJSON(filteredTimeline);
            let [entryA, entryB] = [filteredTimeline[0],filteredTimeline[1]]
            if(filteredTimeline.length<10 && filteredTimeline.length>=2 && entryA.type=='click' && entryB.type=='start'){

                let networkTime = entryB.timeAt - entryA.timeAt;
                let [entryZ, entryY] = [filteredTimeline[filteredTimeline.length-1],filteredTimeline[filteredTimeline.length-2]]

                function noPageContentGenerated(){
                    // not reliable.
                    return filteredTimeline.filter(entry=>entry.type=='complete').every(entry=>entry.elementCount<20);
                }

                function noRenderOfActualPage(){
                    // check whether there is any rendering of actual page
                    let renderOK= true;
                    filteredTimeline.reduce((a,b)=>{
                        if(a && b && a.type=='start' && b.type=='complete' && a.pageHref === b.pageHref && b.timeAt-a.timeAt>5000){
                            // assume >5000 rendering time is not spam page
                            renderOK = false;
                        }
                        return b;
                    },null);
                    return renderOK;
                }


                function jsHistCounter(){

                    if(entryA.type=='click' && entryB.type=='start' && entryA.histCount >= entryB.histCount) entryA.histCount = entryB.histCount-1;

                    let jsHistCountInOrder = true;
                    let endHist = -1;
                    filteredTimeline.map(entry=>entry.histCount).reduce((a,b)=>{
                        if(a>-1 && b>-1 && a<=b){
                            endHist = b
                        }else{
                            jsHistCountInOrder=false;
                        }
                        return b;
                    },0);

                    if(jsHistCountInOrder){
                        return endHist - entryA.histCount;
                    }

                    return 0;

                }


                function countDomains(filteredTimeline){
                    let domains = {}
                    for(const entry of filteredTimeline){
                        if(entry.type==='click') continue;
                        let domain = getTopDomain(new URL(entry.pageHref).hostname)
                        domains[domain]=(domains[domain]||0)+1
                    }
                    domains._arr=Object.keys(domains)
                    domains._count=domains._arr.length
                    return domains;
                }


                let redirectFlag = false;

                if(entryA.type=='click' && entryB.type=='start' && getTopDomain(entryA.clickedHref) !== getTopDomain(entryB.pageHref) ){
                    // server side redirect
                    redirectFlag = true;

                }else if(entryZ.type=='start' && (entryY.type=='complete' || entryY.type=='start')){
                    let [domainZ, domainY] =[ getTopDomain(new URL(entryZ.pageHref).hostname), getTopDomain(new URL(entryY.pageHref).hostname)]
                    if(domainZ!==domainY && entryZ.timeAt-entryY.timeAt<=1.25*networkTime && entryZ.timeAt-entryB.timeAt<=3*networkTime){
                        redirectFlag = true;
                    }
                }

                consoleJSON(filteredTimeline);

                function startCount(){
                    return filteredTimeline.filter(entry=>entry.type=='start').length
                }

                if(redirectFlag || (noPageContentGenerated() && noRenderOfActualPage() && startCount()>=2)){

                    let jhc = jsHistCounter();
                    if(jhc>0){

                        // in case redirect on the same domain
                        // it is allowed
                        let domains = countDomains(filteredTimeline)
                        if(domains._count===1) return;

                        return {filteredTimeline, jhc};
                    }

                }
            }
        }
    }

    GM_getTab(tabObject=>{

        if(!tabObject.timeline)tabObject.timeline=[];

        if(isGoogleSearchPage){
            if(tabObject.hitAt<0){
                history.pushState({},null);
            }
            tabObject.timeline.length=0;
            tabObject.hitAt=0;
        }else if(!tabObject.hitAt){
            return;
        }else if(Date.now()-tabObject.hitAt>30*1000){
            tabObject.timeline.length=0;
            tabObject.hitAt=0;
            GM_saveTab(tabObject);
            return;
        }

        // either isGoogleSearchPage or hitTime < 30s

        tabObject.timeline.push({type:'start', pageHref:purify(location.href), timeAt:Date.now() , histCount: history.length});

        let resCheckSpam = checkSpam(tabObject);
        if(resCheckSpam){
            let {filteredTimeline, jhc}=resCheckSpam;
            tabObject.hitAt=-1;
            GM_saveTab(tabObject);

            let clickEntry = filteredTimeline[0]
            // let entryZ = filteredTimeline[filteredTimeline.length-1];

            ;(async ()=>{
                try{
                    let spamDomains = (await GM.getValue('spamDomains', "")).split(',');

                    // Note awaiting the set -- required so the next get sees this set.

                    await GM.setValue('spamDomains', spamDomains+','+ new URL(clickEntry.clickedHref).origin);

                }catch(e){}
            })();

            alert(`Spam Website Detected.\n - Spam Domain: "${getOrigin(clickEntry.clickedHref)}"\n - Go back: "${getOrigin(clickEntry.pageHref)}"`);
            history.go(-jhc);
        }else{
            GM_saveTab(tabObject);
        }



        function addStyle (styleText) {
            const styleNode = document.createElement('style');
            styleNode.type = 'text/css';
            styleNode.textContent = styleText;
            document.documentElement.appendChild(styleNode);
            return styleNode;
        }


        function onReady(){

            let emc = elementCount(document);
            if(emc<40){ // including html, body, script, div, ... //7 16 33
                emc-=document.querySelectorAll('script, style, meta, title, head, link, noscript').length; //remove count for non-visual elements //6 12
            }
            tabObject.timeline.push({type:'complete', pageHref:purify(location.href), timeAt:Date.now(), elementCount: emc , histCount: history.length });
            GM_saveTab(tabObject);

            let hElems = null
            if(isGoogleSearchPage){
                hElems = [...document.querySelectorAll('a[href^="http"]')].filter(elm=>!/^https?\:\/\/\w+\.(google|googleusercontent)\.com(\.\w{0,2}){0,2}\//.test(elm.href))
                for(const hElem of hElems){
                    hElem.addEventListener('click',function(){
                        tabObject.hitAt = Date.now();
                        tabObject.timeline.push({type:'click', clickedHref:purify(hElem.href), pageHref:purify(location.href), timeAt:tabObject.hitAt , histCount: history.length});
                        GM_saveTab(tabObject);
                    })
                }

                ;(async () => {

                    let spamDomains = (await GM.getValue('spamDomains', "")).split(',');
                    console.log(spamDomains)
                    let spamLinks = hElems.filter( elm=> spamDomains.includes(new URL(elm.href).origin) )

                    if(spamLinks.length>0){

                        let noClickFunc=function(evt){if(evt){evt.returnValue = false; evt.preventDefault();} return false;}
                        for(const spamLink of spamLinks) {
                            spamLink.classList.add('gs-spam-link-disable');
                            spamLink.onclick=noClickFunc
                        }
                        addStyle (cssTxt);

                    }

                })();

                async function clearSpamDomainList(){
                    await GM.deleteValue('spamDomains');
                    for(const spamLink of hElems) {
                        spamLink.classList.remove('gs-spam-link-disable');
                        spamLink.onclick=null
                    }
                }
                GM_registerMenuCommand('Clear Spam Domain List', clearSpamDomainList);

            }else{

                function fx(){
                    document.removeEventListener('mousedown',fx,true);
                    document.removeEventListener('keydown',fx,true);
                    tabObject.timeline.length=0;
                    tabObject.hitAt=0;
                    GM_saveTab(tabObject);
                }

                document.addEventListener('mousedown',fx,true);
                document.addEventListener('keydown',fx,true);
            }

        }

        ;(function uiMain(){
            if(document.documentElement == null) return window.requestAnimationFrame(uiMain)
            if (document.readyState !== 'loading') {
                onReady();
            } else {
                document.addEventListener('DOMContentLoaded', onReady);
            }
        })();

    })
})();
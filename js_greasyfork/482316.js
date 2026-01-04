// ==UserScript==
// @name        Paywall Unblocker v2 updated
// @name:de     Paywall Unblocker v2 updated
// @license     MIT
// @namespace   http://tampermonkey.net/
// @version     0.66
// @match        https://www.allgemeine-zeitung.de/*
// @match        https://www.cz.de/*
// @match        https://www.dieharke.de/*
// @match        https://www.dnn.de/*
// @match        https://www.echo-online.de/*
// @match        https://www.goettinger-tageblatt.de/*
// @match        https://www.haz.de/*
// @match        https://www.hochheimer-zeitung.de/*
// @match        https://www.kn-online.de/*
// @match        https://www.ksta.de/*
// @match        https://www.ln-online.de/*
// @match        https://www.lvz.de/*
// @match        https://www.maz-online.de/*
// @match        https://www.ndz.de/*
// @match        https://www.neuepresse.de/*
// @match        https://www.nw.de/*
// @match        https://www.oberhessische-zeitung.de/*
// @match        https://www.op-marburg.de/*
// @match        https://www.ostsee-zeitung.de/*
// @match        https://www.paz-online.de/*
// @match        https://www.rnd.de/*
// @match        https://www.rundschau-online.de/*
// @match        https://www.saechsische.de/*
// @match        https://www.siegener-zeitung.de/*
// @match        https://www.sn-online.de/*
// @match        https://www.tah.de/*
// @match        https://www.waz-online.de/*
// @match        https://www.wiesbadener-kurier.de/*
// @match        https://www.wormser-zeitung.de/*
// @grant       GM_addStyle
// @description unblocks Madsack Paywall
// @description:de  entfernt Madsack Paywall
// @author      hazuser99
// @require     https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/482316/Paywall%20Unblocker%20v2%20updated.user.js
// @updateURL https://update.greasyfork.org/scripts/482316/Paywall%20Unblocker%20v2%20updated.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url,site,html,parser,htmlDoc,articleText,jsonText,jsonObj,locationText;
    insert();

    async function caesar(){
        var url,site,html,parser,htmlDoc,articleText,jsonText,jsonObj,locationText;
        switch (location.hostname) {
            case "www.allgemeine-zeitung.de":
            case "www.echo-online.de":
            case "www.hochheimer-zeitung.de":
            case "www.lauterbacher-anzeiger.de":
            // case "www.main-spitze.de":
            // case "www.mittelhessen.de":
            case "www.oberhessische-zeitung.de":
            case "www.wiesbadener-kurier.de":
            case "www.nw.de":
            case "www.wormser-zeitung.de":
                {
                    GM.addStyle(".loadingBanner,.adSlot {display:none!important;}");
                    breakVrmArticles();
                    setInterval(() => {if (url != null && location.href != url){GM.addStyle("div.contentWrapper.app__content.--page {display:none!important;}"); url = location.href; location.reload();}},0);
                    break;
                }
            case "www.cz.de":
            case "www.dieharke.de":
            case "www.dnn.de":
            case "www.goettinger-tageblatt.de":
            case "www.haz.de":
            case "www.kn-online.de":
            case "www.ln-online.de":
            case "www.lvz.de":
            case "www.maz-online.de":
            case "www.saechsische.de":
            case "www.neuepresse.de":
            case "www.ndz.de":
            case "www.op-marburg.de":
            case "www.ostsee-zeitung.de":
            case "www.paz-online.de":
            case "www.rnd.de":
            case "www.siegener-zeitung.de":
            case "www.tah.de":
            case "www.sn-online.de":
            case "www.waz-online.de":
                {
                    if(location.href.endsWith("?outputType=valid_amp")) {
                        location.href = location.href.replace("?outputType=valid_amp","");
                    }
                    var paywall = document.querySelector('div.paywalledContent');
                    if (paywall){
                        console.log("paywall");
                        GM.addStyle('[class^="ReadProgressstyled"],[class^="ArticleContentLoaderstyled__Gradient-"],[id^="piano-home-inline-haz"],[id^="piano-lightbox-article-"],article > svg {display:none;}');
                        GM.addStyle('[class^="Adstyled__AdWrapper-sc"],[class^="Adstyled__AdWrapper-sc-"],article > svg {display:none;}');
                        GM.addStyle('[class^="HeaderWithNavBarstyled"] {position:relative !important;}');
                        GM.addStyle(".h2-pw {font-family: 'DIN Next LT Pro', Arial, Roboto, sans-serif; font-weight:700; letter-spacing:-0.25px; font-size:22px; padding-bottom:4px;}");
                        $("div[class='OUTBRAIN'").remove();
                        $("div[id^='mad_m_incontent-'").remove();
                        paywall.classList.remove(paywall.classList.item(1));
                        var articleParagraph = paywall.querySelector("div > p");
                        jsonText = document.querySelector("#fusion-metadata").innerHTML.split(/;Fusion\.globalContent.*?=/)[1];
                        jsonObj = JSON.parse(jsonText);
                        var elements = jsonObj.elements.filter(i => i.type != "ad");
                        var readAlsoIndex = elements.findIndex(i => i.text?.includes("Lesen Sie auch"));
                        if (readAlsoIndex != -1)
                            elements.splice(readAlsoIndex, 2);
                        var appAdIndex = elements.findIndex(i => i.text?.match(/Laden Sie sich jetzt hier kostenfrei unsere .*-App.* herunter:/));
                        if (appAdIndex != -1)
                            elements.splice(appAdIndex, 3);
                        appAdIndex = elements.findIndex(i => i.text?.match(/Laden Sie sich jetzt hier kostenfrei unsere .*-App.* herunter[^:]/));
                        if (appAdIndex != -1)
                            elements.splice(appAdIndex, 3);
                        articleText = [{text: articleParagraph.innerHTML},...elements.slice(1)]
                            .map(i => (i.type=="header"?`<h2 class="h2-pw ${articleParagraph.className}">`:`<p class="${articleParagraph.className}">`)
                                 + (i.text??"") + (i.type == "header"?"</h2>":"</p>")
                                 + (i.type == "image"?`<div><img alt="${i.imageInfo?.alt}" src="${i.imageInfo?.src}" width="100%"><div class=""><p class="ClTDP">${i.imageInfo?.caption}</p><p class="bIdZuO">${i.imageInfo?.credit}</p></div></div>`:"")
                                 + (i.type == "list"?"<ul>" + i.list?.items?.map(l => "<li>• " + l.text + "</li>").join("") + "</ul>":"")).join("");
                        articleParagraph.parentElement.innerHTML = articleText;

                        //Css Fixing
                        paywall.querySelectorAll('*').forEach($el => {
                            $el.style.height = "auto";
                            // $el.className='';
                            // $el.style.fontSize = "17px";
                            // $el.style.lineHeight = "26px";
                            // $el.style.fontFamily  = "Source Serif Pro, Palatino, Droid Serif, serif";
                        });
                        paywall.querySelectorAll('li').forEach($el => {
                            $el.style.fontSize = "17px";
                            $el.style.marginBottom = "0.5em";
                            $el.style.fontFamily  = "Calibri";
                        });
                        paywall.querySelectorAll('li>a').forEach($el => {
                            $el.style.color = "green";
                            $el.style.fontDecoration  = "underline";
                        });
                    }
                    break;
                }
            case "www.ksta.de":
            case "www.rundschau-online.de":
                {
                    GM.addStyle(".tm-visible,.dm-slot {display:none!important;}");
                    document.querySelector(".dm-mural.dm-paint").classList.remove("dm-mural","dm-paint");
                    break;
                }
        }
        async function breakVrmArticles(){
            url = location.href
            GM.addStyle(".div.contentWrapper.app__content.--page {display:initial!important;}");
            if (document.querySelector(".articleHeader__top .badges")){
                GM.addStyle(".quoteWrapper {display:none;}");
                document.querySelector(".storyElementWrapper__paywall > div").style.display = "none";
                document.querySelector(".storyElementWrapper__paywallContainer").classList.remove("storyElementWrapper__paywallContainer");
                document.querySelector(".storyElementWrapper__paywall").classList.replace("storyElementWrapper__paywall","storyElementWrapper");
                document.querySelector(".storyElementWrapper__paywallWrapper").classList.replace("storyElementWrapper__paywallWrapper","storyElementWrapper");
                document.querySelector(".storyElementWrapper__paywallStoryline").classList.replace("storyElementWrapper__paywallStoryline","storyElementWrapper__Storyline");
                site = await fetch(location.href);
                html = await site.text();
                parser = new DOMParser();
                htmlDoc = parser.parseFromString(html, "text/html");
                jsonText = htmlDoc.querySelector("div~script").innerText.replace(/^window\.__INITIAL_STATE__=/,"").replace(/;\(function\(\).*/,"");
                console.log(jsonText);
                jsonObj = JSON.parse(jsonText);
                articleText = jsonObj.contentPage.data.context.storylineText;

                var texts = articleText.split(/<\/p>/).map(i => i.slice(3));
                [...document.querySelectorAll(".storyElementWrapper__container > div > p:not(.multimediaIntro)")].forEach(i => {i.parentElement.parentElement.innerHTML = i.parentElement.parentElement.innerHTML.replace(/(storyElementWrapper__element)/g,"contentWrapper $1 --medium")});
                [...document.querySelectorAll(".toggleBox__content.--padding.--border")].forEach(i => {i.closest(".storyElementWrapper__container").innerHTML = i.closest(".storyElementWrapper__container").innerHTML.replace(/(style=")(background: ?linear-gradient)/g,"$1display:none;$2").replace(/(storyElementWrapper__element)/g,"contentWrapper $1 --small").replace(/(class="toggleBox__contentWrapper --medium")/g,"style=\"height:auto!important\" $1").replace(/(class="toggleBox__headline paragraph --blockIntro")/g,"style=\"display:none\" $1")});

                var paragraphs = [...document.querySelectorAll(".storyElementWrapper__container > div > p:not(.multimediaIntro) > span"),...document.querySelectorAll(".toggleBox__content.--padding.--border .infoBox__storylineElement p.--small > span")];
                paragraphs.forEach((p,i) => {
                    var cursor = 0;
                    var source = p.innerHTML;
                    if (i == 0 && source.indexOf(".") > 0 && source.indexOf(".") < 20){
                        [locationText, source] = source.split(/\. (.*)/s).filter(i => i);
                    }
                    var splittedSource = source.split(/(<.*?>)/);
                    var replaceText = texts[i];
                    var replaceTexts = [];
                    for (let splittedText of splittedSource){
                        if (splittedText.length != 0 && splittedText.slice(0,1) != "<"){
                            splittedText = replaceText.slice(cursor,cursor + splittedText.length);
                            cursor += splittedText.length;
                        }
                        replaceTexts.push(splittedText);
                    }
                    replaceText = replaceTexts.join("");
                    if (locationText != null && location.href.split("/")[3] == "lokales"){
                        var locationLinkText = document.querySelector(".storyPage__sectionLink").innerText;
                        if (locationText.length == locationLinkText.length){
                            replaceText = `${locationLinkText}. ${replaceText}`;
                        }
                    }
                    p.innerHTML = replaceText;
                });
            }
        };
    }
    async function run() {
        caesar();
    }
    async function removeADS() {
        console.log("removeADS");
        $("div[class^='Articlestyled__CenteredContentWrapper-sc'] svg").each(function() {
            $(this).remove();
        });
        $("div[class^='Articlestyled__ArticleBodyWrapper-sc'] svg").each(function() {
        // $(this).each(function() {
            $(this).remove();
        });
        // $("div[class^='Adstyled__AdWrapper-sc']").remove();
    }

    function loopFunction(delay, f,callback){
        var loop = function(){
            f;
            callback();
            setTimeout(loop, delay);
        }; loop();
    };

    function insert(){
        loopFunction(100, run(),function(){
            run();
        });
        loopFunction(100, run(),function(){
            removeADS();
        });
    }
})();

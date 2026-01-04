// ==UserScript==
// @name         No More Cop News on Techdirt
// @namespace    http://wxw.moe/@dia
// @version      0.1.0
// @description  Gray out cops-related articles by Tim Cushing on Techdirt because, while I wholeheartedly agree with what he says about the US police, I'm also tired of reading them
// @author       Dia
// @match        https://www.techdirt.com/
// @match        https://www.techdirt.com/page/*
// @match        https://www.techdirt.com/edition/*
// @match        https://www.techdirt.com/tag/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-end
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/482221/No%20More%20Cop%20News%20on%20Techdirt.user.js
// @updateURL https://update.greasyfork.org/scripts/482221/No%20More%20Cop%20News%20on%20Techdirt.meta.js
// ==/UserScript==

//manually change these parameters to suit your needs
const USCRIPT_DEBUG_MODE = false; //set to true for useful console logs
const HIDE_COPS_ARTICLES_BY_TIM_CUSHING = true;
const HIDE_DAILY_DEALS = false;

(function() {
    'use strict';
    const GRAY_STYLE_BLUR = "color:transparent; text-shadow: 0 0 8px #000; filter:grayscale(100%) blur(3px)";
    const GRAY_STYLE_NORMAL = "color:gray !important; filter:grayscale(100%) !important";
    const COP_WORDS_INSENSITIVE = /\b(cops|police)\b/gmi;
    const COP_WORDS_PD = /\b([A-Z]{2})?(PD)\b/gm;
    const COP_TOPIC = "Legal Issues";
    function grayBlurElms(elms){
        for (let i=0; i<elms.length; i++){
            elms[i].setAttribute("style", GRAY_STYLE_BLUR);
        }
    }
    function grayNormalElms(elms){
        for (let i=0; i<elms.length; i++){
            elms[i].setAttribute("style", GRAY_STYLE_NORMAL);
        }
    }
    function isStoryAboutCops(postBodyElm){
        //returns true if "cops", "PD" and "police" are mentioned more than twice in the article
        const pElms = postBodyElm.getElementsByTagName("p");
        let timesCopsMentioned = 0;
        for (let i=0; i<pElms.length; i++){
            const pParentElm = pElms[i].parentNode;
            if (pParentElm.tagName == "DIV"){
                if (pParentElm.className == "postbody"){
                    const pText = pElms[i].innerHTML;
                    const pTextMatches1 = pText.match(COP_WORDS_INSENSITIVE);
                    const pTextMatches2 = pText.match(COP_WORDS_PD);
                    let matchCount = 0;
                    if (pTextMatches1 != null){
                        matchCount += pTextMatches1.length;
                    }
                    if (pTextMatches2 != null){
                        matchCount += pTextMatches2.length;
                    }
                    timesCopsMentioned += matchCount;
                }
            }
        }
        let hidingDecision = timesCopsMentioned > 2;
        if (USCRIPT_DEBUG_MODE){
            console.log("\tMentions cops-related words: " + timesCopsMentioned + " times");
            console.log("\tMeets criteria: " + hidingDecision);
        }
        return hidingDecision;
    }

    if (USCRIPT_DEBUG_MODE){
        console.log("Userscript is run with the following options");
        console.log("\tHide cop-related articles by Tim Cushing: " + HIDE_COPS_ARTICLES_BY_TIM_CUSHING);
        console.log("\tHide daily deals: " + HIDE_DAILY_DEALS);
    }

    const postsElm = document.getElementById("posts");
    const storyElms = postsElm.getElementsByClassName("storyblock");
    for (let i=0; i<storyElms.length; i++){
        const bylineElm = storyElms[i].getElementsByClassName("byline")[0];
        const storyAuthor = bylineElm.getElementsByTagName("a")[0].innerHTML;
        const postBodyElm = storyElms[i].getElementsByClassName("postbody")[0];
        const postTitle = storyElms[i].getElementsByClassName("posttitle")[0].getElementsByTagName("a")[0].innerHTML;
        let isAboutCops = false;
        if (USCRIPT_DEBUG_MODE){
            console.log("Title: " + postTitle);
            console.log("Author: " + storyAuthor);
        }

        if (storyAuthor.trim() == "Tim Cushing"){
            if (HIDE_COPS_ARTICLES_BY_TIM_CUSHING){
                isAboutCops = isStoryAboutCops(postBodyElm);
                if (isAboutCops){
                    storyElms[i].addEventListener("mouseover", function handleMouseOver(){
                        grayNormalElms([storyElms[i]]);
                        grayNormalElms(storyElms[i].getElementsByTagName("a"));
                        grayNormalElms(storyElms[i].getElementsByTagName("h3"));
                        grayNormalElms(storyElms[i].getElementsByClassName("pub_date"));
                        grayNormalElms(storyElms[i].getElementsByTagName("img"));
                    });
                    storyElms[i].addEventListener("mouseout", function handleMouseOver(){
                        grayBlurElms([storyElms[i]]);
                        grayBlurElms(storyElms[i].getElementsByTagName("a"));
                        grayBlurElms(storyElms[i].getElementsByTagName("h3"));
                        grayBlurElms(storyElms[i].getElementsByClassName("pub_date"));
                        grayBlurElms(storyElms[i].getElementsByTagName("img"));
                    });
                    grayBlurElms([storyElms[i]]);
                    grayBlurElms(storyElms[i].getElementsByTagName("a"));
                    grayBlurElms(storyElms[i].getElementsByTagName("h3"));
                    grayBlurElms(storyElms[i].getElementsByClassName("pub_date"));
                    grayBlurElms(storyElms[i].getElementsByTagName("img"));
                }
            }
        }
        else if (storyAuthor.trim() == "Daily Deal"){
            if (HIDE_DAILY_DEALS){
                storyElms[i].style.display = "none";
            }
        }
    }
})();
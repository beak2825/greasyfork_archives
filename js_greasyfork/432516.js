// ==UserScript==
// @name         Facebook - Hides Suggested and Sponsored Posts
// @namespace    http://tampermonkey.net/
// @version      0.6.1
// @description  Hides Suggested For You, sponsored posts on the main feed & those silly sponsored ads in Marketplace
// @author       ArthurG
// @match        https://www.facebook.com/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432516/Facebook%20-%20Hides%20Suggested%20and%20Sponsored%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/432516/Facebook%20-%20Hides%20Suggested%20and%20Sponsored%20Posts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const pollTimeout = 3000;
    const debounceTimeout = 2000;
    const debugHighlightAds = false;
    const obfuscationTextSizeLimit = 45;

    const debouncedFindAndHide = debounce(findAndHide, debounceTimeout, false);

    function textNodesUnder(el){
        let n;
        const a = [];
        const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);

        // It's beem a 'while' since I've had to use you.
        while(n = walk.nextNode()) {
            a.push(n);
        }

        return a;
    }

    /**
     * Checks for the word in a set of random characters. Doesn't allow repeat of characters.
     * Taken from https://stackoverflow.com/questions/58323445/how-can-i-check-a-word-is-made-of-letters-in-different-array
     */
    function isWordValid(attemptedWord, validLetters) {
        const validLettersSplitted = validLetters.split("");
        const attemptedWordSplitted = attemptedWord.split("");
        return attemptedWordSplitted.every(attemptedLetter => {
            const letterIndex = validLettersSplitted.indexOf(attemptedLetter);
            if(letterIndex > -1){
                validLettersSplitted.splice(letterIndex, 1);
                return true;
            } else {
                return false
            }
        });
    }

    function isWorthScrutinizing(el) {
        return $(el).text().length < obfuscationTextSizeLimit;
    }

    function extractValidTextFromDom(el) {
        let validText = '';
        const textNodes = textNodesUnder(el);

        textNodes.forEach(n => {
            const style = getComputedStyle(n.parentElement);
            if(style.position !== 'absolute' && style.display !== 'none') {
                validText += $(n).text();
            }
        })
        return validText;
    }

    function cleanupObsucatingText(s) {
        if(s.length < obfuscationTextSizeLimit) {
            return s.replace(/[^Sponsored]+/g, '').replace(/(.)\1+/g, '$1');
        }
        return s;
    }

    function elIsRealSponsored(el) {
        if(isWorthScrutinizing(el)) {
            const validTextFromDom = extractValidTextFromDom(el);
            const text = cleanupObsucatingText(validTextFromDom);

            if(text === 'Sponsored' || isWordValid('Sponsored', text)) {
                return true;
            }
        } else {
            return false;
        }
    }

    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = window.__fbNativeSetTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };


    function findAndHide(skipPoll) {
        // Suggested For You
        $( "span:contains('Suggested for you')" ).closest('[data-pagelet*="FeedUnit"]').hide();

        //Sponsored Ads in the Feed
        $('a[href*="/ads/"]').closest('[data-pagelet*="FeedUnit"]').hide();
        $('[data-pagelet*="FeedUnit"] a[href="#"]').each((index, el) => {
            if(elIsRealSponsored(el)) {
                if(debugHighlightAds) {
                    $(el).closest('[data-pagelet*="FeedUnit"]').get(0).style.border = "thick solid #FF0000";
                } else {
                    $(el).closest('[data-pagelet*="FeedUnit"]').hide();
                }
            }
        });

        $('[data-pagelet*="FeedUnit"] [aria-label="Shared with Public"]').parent().parent().parent().parent().each((index, el) => {
            if(elIsRealSponsored(el)) {
                if(debugHighlightAds) {
                    $(el).closest('[data-pagelet*="FeedUnit"]').get(0).style.border = "thick solid #00FF00";
                } else {
                    $(el).closest('[data-pagelet*="FeedUnit"]').hide();
                }
            }
        });

        $('[data-pagelet*="FeedUnit"] [role="button"]').each((index, el) => {
            const elText = $(el).text();
            if(elText.includes('Sponsored')) {
                if(debugHighlightAds) {
                    $(el).closest('[data-pagelet*="FeedUnit"]').get(0).style.border = "thick solid #0000FF";
                } else {
                    $(el).closest('[data-pagelet*="FeedUnit"]').hide();
                }
            }
        });

        $('[data-pagelet*="RightRail"] h3').each((i, j) => {
            if(isWordValid('Sponsored', $(j).text())) {
                $(j).parent().parent().parent().parent().parent().parent().parent().hide();
            }
          }
        );

        //Sponsored Ads in Marketplace
        $('a[href*="/ads/"]').closest('span > div > a > div > div > div').parent().parent().parent().parent().parent().parent().hide();

        //Hide Sponsored Ads Header in Marketplace
        $(`a[href*="/ads/about"] span:contains('Sponsored')`).parent().parent().hide();

        console.log('Found and hid!');

        if(!skipPoll) {
            window.__fbNativeSetTimeout(function() {
              findAndHide();
           }, pollTimeout);
        }
    }

    $(window).scroll(debounce(() => { findAndHide(true); }, debounceTimeout, true));

    //Kick off the polling
    findAndHide();
})();


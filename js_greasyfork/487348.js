// ==UserScript==
// @name         Feber Improvements
// @namespace    http://tampermonkey.net/
// @version      2024-02-15
// @description  Fixes some stuff on Feber.se that I personally find bad or obnoxious
// @author       Rokker
// @match        https://feber.se/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=feber.se
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487348/Feber%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/487348/Feber%20Improvements.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const $ = window.jQuery;

    //Bättre färg på dark mode artiklar
    document.styleSheets[0].insertRule(":root [data-darkmode='on']{ --f-article-background:#161616 !important }");
    document.styleSheets[0].insertRule("f-article > a{ max-width: 980px; width: 100%; justify-self: center; }");
    document.styleSheets[0].insertRule("f-content > a{ max-width: 980px; width: 100%; justify-self: center; display: contents; }");
    document.styleSheets[0].insertRule("iframe{ border-radius: 5px; padding: 5px; }");
    document.styleSheets[0].insertRule("f-article{ background: #222222 !important; }");

    var modifiedClass = 'har-redan-moddat';
    var looping = 0;

    var css = {
        collapsedArticle: {
            'max-height':'32px',
            'overflow': 'hidden',
            'background': 'orange',
            'cursor': 'pointer',
            'max-width': '980px',
            'padding': '0 5px'
        },
        expandedArticle: {
            'max-height':'initial',
            'overflow':'auto',
            'background':'initial',
            'cursor': 'initial',
            'max-width': 'initial',
            'padding': 'initial'
        }
    }


    var expandedArticles = JSON.parse(localStorage.getItem('expandedArticles') || "[]");
    expandedArticles.forEach(function(x){ $('.'+x).addClass('expandedArticle') });

    var cleanUpArticles = function(itemSelector, replacerText, color){
        var articles = $.makeArray($(itemSelector).not('.' + modifiedClass));
        articles.forEach(function(article){
            article = $(article);
            article.addClass(modifiedClass);
            var title = article.find('f-article-headline').text().replace(/[\t\n]/g,'').trim();
            var replacerElement = $('<span><h3>'+title+'</h3>('+ replacerText +')</span>').css({padding: "0 5px", background: color, 'z-index': 100});
            article.prepend(replacerElement)
            article.css(css.collapsedArticle).css({background: color});
            article.find('f-bubble').css({opacity: 0});
            article.bind('click', function(x){
                $(this).addClass('expandedArticle').css(css.expandedArticle);
                $(this).find('f-bubble').css({opacity: 1});
                expandedArticles.push($(this).closest('f-article').attr('id'));
                localStorage.setItem('expandedArticles',JSON.stringify(expandedArticles));
            });
        });
    }

    var cleanUpFeber = function() {
        if(looping > 1000){		//Something is really wrong here.
            debugger;
            return aObserver.disconnect();
        }

        cleanUpArticles($('.writer_icon[alt="Bobby Green"]').closest('f-article'),'Denna jefla Bobby Green', 'orange');
        cleanUpArticles($('f-viathanks-tags a, f-viathanks-cat a').filter(function() { return ['john oliver'].indexOf($(this).text().trim().toLowerCase()) !== -1; }).closest('f-article'),'F*CK John Oliver', 'salmon');
        cleanUpArticles($('f-viathanks-tags a, f-viathanks-cat a').filter(function() { return ['bil', 'racing'].indexOf($(this).text().trim().toLowerCase()) !== -1; }).closest('f-article'),'Bilj&auml;vel', 'lawngreen');
        cleanUpArticles($('f-adstripe').closest('f-article'),'Annons-ish', 'dodgerblue');
        $('f-adstripe').remove();
        looping++;
    };

    const targetNode = document.querySelector("body");
    const aObserver = new MutationObserver(cleanUpFeber);
    const observerOptions = { childList: true, attributes: false, subtree: true };
    aObserver.observe(targetNode, observerOptions);
    cleanUpFeber();
    localStorage.setItem('niceGuy', true);


    //New adblock thingy
    // var adBlockThingRegex = new RegExp('^f-[0-9]*$');
    var adBlockThingRegex = new RegExp('^f-[0-9]+[a-zA-Z0-9]*$');
    var adBlockRemoval = function(){
        $($.makeArray($('*')).filter(function(x){
            var tagName = $(x).prop('tagName').toLowerCase();
            return adBlockThingRegex.test(tagName);
        })).remove();
    };
    setInterval(adBlockRemoval,400);
    setTimeout(adBlockRemoval);

})();
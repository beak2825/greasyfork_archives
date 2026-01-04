// ==UserScript==
// @name                DOI to Sci-Hub
// @name:zh-CN          DOI跳转Sci-Hub
// @namespace           https://greasyfork.org/users/692574
// @version             1.0.31
// @description         Highlight DOI link on the current webpage and redirect it to Sci-Hub.
// @description:zh-CN   高亮当前页面的DOI链接，并重定向至Sci-Hub。
// @author              Chase Choi
// @license             MIT
// @match               https://*.sciencemag.org/*
// @match               http*://*.webofknowledge.com/*
// @match               https://academic.oup.com/*
// @match               https://academic.microsoft.com/*
// @match               https://dl.acm.org/doi/*
// @match               https://ieeexplore.ieee.org/*
// @match               https://journals.sagepub.com/*
// @match               https://link.springer.com/*
// @match               https://onlinelibrary.wiley.com/doi/*
// @match               https://psycnet.apa.org/*
// @match               https://pubmed.ncbi.nlm.nih.gov/*
// @match               https://pubs.rsc.org/*
// @match               https://pubs.acs.org/doi/*
// @match               https://pubsonline.informs.org/doi/abs/*
// @match               https://schlr.cnki.net/Detail/index/*
// @match               https://schlr.cnki.net//Detail/index/*
// @match               https://xueshu.baidu.com/usercenter/paper/*
// @match               https://www.aeaweb.org/*
// @match               https://www.ingentaconnect.com/*
// @match               https://www.jstor.org/*
// @match               https://www.nature.com/*
// @match               https://www.ncbi.nlm.nih.gov/*
// @match               https://www.researchgate.net/*
// @match               https://www.sciencedirect.com/*
// @match               http://www.socolar.com/*
// @match               https://www.scinapse.io/*
// @match               https://www.science.org/*
// @match               https://www.tandfonline.com/*
// @match               https://www.webofscience.com/wos/*
// @require             https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require             https://cdn.jsdelivr.net/gh/sizzlemctwizzle/GM_config@2207c5c1322ebb56e401f03c2e581719f909762a/gm_config.js
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_registerMenuCommand
// @grant               GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/412498/DOI%20to%20Sci-Hub.user.js
// @updateURL https://update.greasyfork.org/scripts/412498/DOI%20to%20Sci-Hub.meta.js
// ==/UserScript==

// global variables
const defaultBaseURL = "https://sci-hub.se";
let sciHubBaseURL;
const doiRegex = new RegExp('(10\.\\d{4,}/[-._;()/:\\w]+)');
const completePrefix = ['http://dx.doi.org/', 'https://doi.org/', 'https://dx.doi.org/'];
const partialPrefix = ['//dx.doi.org/'];

// Initialize configuration page
GM_config.init({
    'id': 'DOI2Sci-Hub',
    'title': 'Settings',
    'fields': {
        'UserDefinedBaseURL': {
            'label': 'Custom Sci-Hub URL',
            'type': 'text',
            'default': ''
        }
      }
});

const callback = function(mutationsList, observer) {
    
    if (!$('.sci-hub-link').length) {
        // Web of Science New Interface
        convertPlainTextDOI('span#FullRTa-DOI');
        
        // scinapse
        convertPlainTextDOI('span[class*="doiInPaperShow_doiContext"]');

        // PsycNet
        // journal article info page
        convertPlainTextDOI('div.citation div a');
        // search result page
        convertPlainTextDOI('a[tooltip="DOI link"]');

        // General
        convertHrefDOI(completePrefix, true);
        convertHrefDOI(partialPrefix, false);
    }
};

(function () {
    'use strict';
    GM_registerMenuCommand("Settings", openSettingsPanel, "s");
    const userDefinedBaseURL = GM_config.get('UserDefinedBaseURL');
    
    if (userDefinedBaseURL.length != 0) {
        console.log('Load user-defined base URL');
        sciHubBaseURL = userDefinedBaseURL.trim();
        sciHubBaseURL += sciHubBaseURL.endsWith("/") ? "" : "/";
        redirectToSciHub();
        return
    }

    console.log('Skip user-defined base URL');
    GM.xmlHttpRequest({
        method: "GET",
        url: "https://sci-hub.41610.org/",
        onload: function (response) {
            let data = response.responseText;
            sciHubBaseURL = $('li > a[href^="https://sci-hub"]', data).first().attr('href') ?? defaultBaseURL
            sciHubBaseURL += sciHubBaseURL.endsWith("/") ? "" : "/"
            redirectToSciHub()
        }
    });
})();

function redirectToSciHub() {

    // hyperlink
    
    convertHrefDOI(completePrefix, true);
    convertHrefDOI(partialPrefix, false);

    let observer = new MutationObserver(callback);
    const config = { childList: true, subtree: true };
    observer.observe(document, config);

    // Plain text

    // Science
    convertPlainTextDOI('.meta-line:contains("DOI: 10.")');

    // Web of Science
    convertPlainTextDOI('.FullRTa-DOI:contains("DOI:")');

    // Baidu Scholar
    convertPlainTextDOI('.doi_wr > .kw_main');

    // CNKI Scholar
    convertPlainTextDOI('.doc-doi > a');

    // PubMed
    convertPlainTextDOI('span:contains("doi: 10")');

    // ResearchGate
    // article detail page
    convertPlainTextDOI('div.research-detail-header-section__flex-container a.nova-legacy-e-link');
    // search result
    convertPlainTextDOI('li.nova-legacy-e-list__item');

    // AEA
    convertPlainTextDOI('#article-information cite span.doi');

}

function convertPlainTextDOI(doiTextLineSelector) {
    if ($(doiTextLineSelector).length) {
        $(doiTextLineSelector).each(function () {
            let modified = $(this).html().replace(doiRegex, `<a href="${sciHubBaseURL}` + '$1" target="_blank" class="sci-hub-link">$1</a>');
            $(this).html(modified);
        });
        $('.sci-hub-link').css('background-color', '#FFFF00');
    }
}

function convertHrefDOI(prefixArray, isComplete) {
    prefixArray.forEach((prefix) => {
        let elements = $(`a[href^="${prefix}"]`);
        if (elements.length) {
            let doi = "";
            elements.each(function () {
                if (isComplete == false) {
                    doi = $(this).text();    
                } else {
                    doi = $(this).attr('href');
                }
                $(this).attr('href', `${sciHubBaseURL}${doi}`);
                $(this).addClass('sci-hub-link');
                $(this).css('background-color', '#FFFF00');
            });
        }
    })
}

function openSettingsPanel() {
    GM_config.open();
}

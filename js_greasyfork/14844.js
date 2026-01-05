// ==UserScript==
// @name        WaniKani Hide Context Sentence
// @namespace   rfindley
// @description Hide context sentences until hovered.
// @version     2.0.1
// @match       https://www.wanikani.com/*
// @match       https://preview.wanikani.com/*
// @copyright   2015+, Robin Findley
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/14844/WaniKani%20Hide%20Context%20Sentence.user.js
// @updateURL https://update.greasyfork.org/scripts/14844/WaniKani%20Hide%20Context%20Sentence.meta.js
// ==/UserScript==

(function(gobj) {

    /* global app_load, page_load, before_page_render, frame_load, before_frame_render */

    const match_patterns = [
        '/subjects/extra_study',
        '/subject-lessons/*',
        '/subjects/*/lesson',
        '/subjects/review',
        '/vocabulary/*'
    ];
    function url_matches(patterns,url) {patterns=patterns||match_patterns;url=url||window.location.pathname;if(url[0]!=='/')url=new URL(url).pathname;return ((Array.isArray(patterns)?patterns:[patterns]).findIndex((pattern)=>{let regex=new RegExp(pattern.replace(/[.+?^${}()|[\]\\]/g,'\\$&').replaceAll('*','.*'));return (regex.test(url));})>=0);}
    function is_turbo_page() {return (document.querySelector('script[type="importmap"]')?.innerHTML.match('@hotwired/turbo') != null);}

    if (is_turbo_page()) {
        try {app_load();} catch(e){}
        try {document.documentElement.addEventListener('turbo:load', page_load);} catch(e){}
        try {document.documentElement.addEventListener('turbo:before-render', before_page_render);} catch(e){}
        try {document.documentElement.addEventListener('turbo:frame-load', frame_load);} catch(e){}
        try {document.documentElement.addEventListener('turbo:before-frame-render', before_frame_render);} catch(e){}
    } else {
        try {app_load();} catch(e){}
        try {page_load({detail:{url:window.location.href},target:document.documentElement});} catch(e){}
        try {frame_load({target:document.documentElement});} catch(e){}
    }

    function app_load() {
        if (!url_matches()) return;

        // Insert CSS
        document.head.insertAdjacentHTML('beforeend',`
            <style name="hide_context_sentence" type="text/css">
            .context-sentence-group p:not([lang="ja"]):not(:hover),
            .subject-collocations__collocation-text:not([lang="ja"]):not(:hover),
            .context-sentences .wk-text:not([lang="ja"]):not(:hover)
            {
                background-color:#ccc;
                color:#ccc;
                text-shadow:none;
            }
            </style>
        `);
    }

    function page_load(e) { // e = {detail: {url: '...'}, target: <elem> }
        if (!url_matches()) return;
        add_new_context_sentences(e.target);
    }

    function before_page_render(e) { // e = {detail: {newBody: <elem>} }
        if (!url_matches()) return;
        add_new_context_sentences(e.detail.newBody);
    }

    function before_frame_render(e) { // e = {detail: {newFrame: <elem>} }
        if (!url_matches()) return;
        add_new_context_sentences(e.detail.newFrame);
    }

    function add_new_context_sentences(target) {
        // Add '.context-sentence-group' to "Context Sentences" sections.
        Array.from(target.querySelectorAll('.subject-section__subtitle'))
            ?.find((node) => node.textContent.match('Context Sentences'))
            ?.closest('section')
            ?.querySelectorAll('.subject-section__text')
            ?.forEach((elem) => elem.classList.add('context-sentence-group'));
    }

}());

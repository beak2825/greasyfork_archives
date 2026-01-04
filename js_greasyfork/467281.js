// ==UserScript==
// @name        Wanikani Reviews SRS Preview
// @namespace   rfindley
// @description Shows an item's current SRS level before answering.
// @match       https://www.wanikani.com/*
// @match       https://preview.wanikani.com/*
// @version     1.0.1
// @author      Robin Findley
// @copyright   2017-2023, Robin Findley
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/467281/Wanikani%20Reviews%20SRS%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/467281/Wanikani%20Reviews%20SRS%20Preview.meta.js
// ==/UserScript==

/* global app_load, page_load, before_page_render, frame_load, before_frame_render, Stimulus */
/* jshint esversion:11 */

window.review_srs_indicator = {};

(function(gobj) {

    const match_patterns = [
        '/subjects/review',
    ];
    function url_matches(patterns,url) {patterns=patterns||match_patterns;url=url||window.location.pathname;if(url[0]!=='/')url=new URL(url).pathname;return ((Array.isArray(patterns)?patterns:[patterns]).findIndex((pattern)=>{let regex=new RegExp(pattern.replace(/[.+?^${}()|[\]\\]/g,'\\$&').replaceAll('*','.*'));return (regex.test(url));})>=0);}
    function is_turbo_page() {return (document.querySelector('script[type="importmap"]')?.innerHTML.match('@hotwired/turbo') != null);}
    function get_controller(name) {return Stimulus.getControllerForElementAndIdentifier(document.querySelector(`[data-controller~="${name}"]`),name);}

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

    function page_load(e) { // e = {detail: {url: '...'}, target: <elem> }
        window.removeEventListener('willShowNextQuestion', handle_next_question);
        window.removeEventListener('didUnanswerQuestion', handle_next_question_delayed);
        if (url_matches()) {
            window.addEventListener('willShowNextQuestion', handle_next_question);
            window.addEventListener('didUnanswerQuestion', handle_next_question_delayed);
            handle_next_question();
        }
    }

    function handle_next_question_delayed() {
        setTimeout(handle_next_question, 1);
    }

    function handle_next_question() {
        let quiz_header = get_controller('quiz-header');
        if (!quiz_header.hasSrsContainerTarget) return;
        let quiz_input = get_controller('quiz-input');
        if (!quiz_input.currentSubject) {
            setTimeout(handle_next_question, 100);
            return;
        }
        let subject_id = quiz_input.currentSubject.id;
        let quiz_queue = get_controller('quiz-queue');
        let srs_info = JSON.parse(quiz_queue.subjectIdsWithSRSTarget.innerText);
        let srs_stage = (srs_info.find((info) => info[0] === subject_id) || [0,undefined])[1];
        if (srs_stage === undefined) {
            quiz_header.srsContainerTarget.dataset.hidden = true;
        } else {
            let srs_stage_name = ['','Apprentice 1','Apprentice 2','Apprentice 3','Apprentice 4','Guru 1','Guru 2','Master','Enlightened'];
            quiz_header.srsIconUpTarget.hidden = true;
            quiz_header.srsIconDownTarget.hidden = true;
            quiz_header.srsTextTarget.innerText = '('+srs_stage_name[srs_stage]+')';
            quiz_header.srsContainerTarget.dataset.wentUp = '';
            quiz_header.srsContainerTarget.dataset.hidden = false;
        }
    }

})(window.doublecheck);

// ==UserScript==
// @name         WaniKani Show Hidden Allowed Answers
// @description  Adds a section below the "primary" and "alternative" answers to show the hidden "allowed" answers when any exist
// @version      1.1.1
// @author       Inserio
// @namespace    wkshowhiddenallowedanswers
// @match        https://www.wanikani.com/*
// @match        https://preview.wanikani.com/*
// @require      https://greasyfork.org/scripts/430565-wanikani-item-info-injector/code/WaniKani%20Item%20Info%20Injector.user.js?version=1380162
// @license      MIT; http://opensource.org/licenses/MIT
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497781/WaniKani%20Show%20Hidden%20Allowed%20Answers.user.js
// @updateURL https://update.greasyfork.org/scripts/497781/WaniKani%20Show%20Hidden%20Allowed%20Answers.meta.js
// ==/UserScript==
/* jshint esversion: 11 */
/* global wkof, wkItemInfo */
(function() {
    'use strict';

    const scriptId = 'wk-show-hidden-allowed-answers', scriptName = 'WaniKani Show Hidden Allowed Answers';
    const state = {
        itemsEl: null,
        sectionEl: null,
        titleEl: null,
        allSubjects: null,
    };

    main();

    function main() {
        if (!window.wkof) {
            if (confirm(scriptName+' requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?'))
                window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
            return;
        }

        wkof.include('ItemData');
        wkof.ready('ItemData')
            .then(async () => await Promise.all([getCachedSubjects(),createSectionElements()]))
            .then(setupListener);
    }

    function setupListener() {
        wkItemInfo.on("lesson,lessonQuiz,review,extraStudy,itemPage").under('meaning').notifyWhenVisible(onMeaningVisible);
    }

    async function onMeaningVisible(itemInfo) {
        try {
            await addAllowedAnswers(itemInfo);
        } catch (e) {
            console.error(`Error while adding allowed answers section: ${e.message}`);
        }
    }

    async function addAllowedAnswers(itemInfo) {
        let prevSibling;
        let meaningsSectionSelector, subsectionTextSelector;
        if (itemInfo.on !== 'lesson') {
            meaningsSectionSelector = '#section-meaning .subject-section__meanings';
            subsectionTextSelector = '.subject-section__meanings-title';
            state.sectionEl.classList.toggle('subject-section', false);
            state.sectionEl.classList.toggle('subject-section__meanings', true);
            state.titleEl.classList.toggle('subject-section__title', false);
            state.titleEl.classList.toggle('subject-section__meanings-title', true);
            state.itemsEl.classList.toggle('wk-text', false);
            state.itemsEl.classList.toggle('wk-text--bottom-normal', false);
            state.itemsEl.classList.toggle('subject-section__meanings-items', true);
        } else {
            meaningsSectionSelector = '#meaning .subject-section';
            subsectionTextSelector = '.subject-section__title-text';
            state.sectionEl.classList.toggle('subject-section', true);
            state.sectionEl.classList.toggle('subject-section__meanings', false);
            state.titleEl.classList.toggle('subject-section__title', true);
            state.titleEl.classList.toggle('subject-section__meanings-title', false);
            state.itemsEl.classList.toggle('wk-text', true);
            state.itemsEl.classList.toggle('wk-text--bottom-normal', true);
            state.itemsEl.classList.toggle('subject-section__meanings-items', false);
        }
        const meaningsSubsections = document.querySelectorAll(meaningsSectionSelector);
        for (let i = 0; i < meaningsSubsections.length; i++){
            let subsection = meaningsSubsections[i];
            let sectionText = subsection.querySelector(subsectionTextSelector).innerText;
            if (sectionText === 'User Synonyms' || sectionText === 'Word Type')
                break;
            prevSibling = subsection;
        }
        if (prevSibling === undefined)
            return;

        const auxiliaryMeanings = await getHiddenAllowedAnswers(itemInfo);
        if (auxiliaryMeanings === null || auxiliaryMeanings.length <= 0)
            return;

        state.itemsEl.textContent = auxiliaryMeanings.map(item => item.meaning).join(', ');
        prevSibling.insertAdjacentElement('afterend', state.sectionEl);
    }

    async function createSectionElements() {
        state.sectionEl = document.createElement("section");
        state.titleEl = document.createElement("h2");
        const titleTextEl = document.createElement("span"),
              contentContainerEl = document.createElement("section");
        state.itemsEl = document.createElement("p");

        state.sectionEl.setAttribute("id", `${scriptId}-container`);
        state.titleEl.classList.add('subject-section__title', 'subject-section__meanings-title');
        titleTextEl.classList.add('subject-section__title-text');
        titleTextEl.textContent = 'Allowed';
        contentContainerEl.classList.add('subject-section__content');
        state.itemsEl.textContent = '';

        state.titleEl.appendChild(titleTextEl);
        contentContainerEl.appendChild(state.itemsEl);
        state.sectionEl.appendChild(state.titleEl);
        state.sectionEl.appendChild(contentContainerEl);
    }

    async function getHiddenAllowedAnswers(itemInfo) {
        const wkItem = await getItemFromSubjectsCache(itemInfo);
        if (wkItem === undefined)
            return null;
        const auxiliaryMeanings = [...wkItem.auxiliary_meanings];
        return auxiliaryMeanings.filter((aux_meaning) => aux_meaning.type === 'whitelist');
    }

    async function getCachedSubjects() {
        if (state.allSubjects !== null)
            return state.allSubjects;
        const config = {wk_items: {options: {subjects: true, assignments: false, review_statistics: false, study_materials: false, include_hidden: false}}};
        const wkItems = await wkof.ItemData.get_items(config);
        const indexed = await wkof.ItemData.get_index(wkItems, 'subject_id');
        return state.allSubjects = indexed;
    }

    async function getItemFromSubjectsCache(item) {
        const subjects = await getCachedSubjects();
        return subjects[item.id]?.data;
    }

})();

// ==UserScript==
// @name          WaniKani Show Specific SRS 2
// @namespace     https://www.wanikani.com
// @description   Show "Apprentice 3" instead of "Apprentice", etc.
// @author        Gijsc1
// @version       2.1.0
// @match         https://www.wanikani.com/*
// @license       MIT; http://opensource.org/licenses/MIT
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/464179/WaniKani%20Show%20Specific%20SRS%202.user.js
// @updateURL https://update.greasyfork.org/scripts/464179/WaniKani%20Show%20Specific%20SRS%202.meta.js
// ==/UserScript==



(async function(){
    document.documentElement.addEventListener('turbo:load', ()=>{console.log("DEBUG: caught a page load")});

    // taken from doublecheck
    function get_controller(name) {
        return Stimulus.getControllerForElementAndIdentifier(document.querySelector(`[data-controller~="${name}"]`),name);
    }

    let script_name = 'WaniKani Show Specific SRS 2';
    let wkof_version_needed = '1.2.2';

    if (!window.wkof) {
        if (confirm(script_name+' requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?')) {
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        }
        return;
    }
    if (wkof.version.compare_to(wkof_version_needed) === 'older') {
        if (confirm(script_name+' requires Wanikani Open Framework version '+wkof_version_needed+'.\nDo you want to be forwarded to the update page?')) {
            window.location.href = 'https://greasyfork.org/en/scripts/38582-wanikani-open-framework';
        }
        return;
    }
    let target_path = '/subjects/review';
    //console.log('registering specific srs listener');
    wkof.on_pageload([target_path], () => setTimeout(load_script, 0));

    //Hopefully temporary code to deal with registering after the load event has already fired.
    setTimeout(()=>{
        if(!srs_manager && window.location.pathname == target_path)
        {
            load_script();
            console.log('Specific SRS initialized');

        }
    }
    , 500)

    let DidChangeSRSEvent;
    let quiz_queue;
    let srs_manager;
    async function load_script() {
        //console.log('Specific SRS initialization started');
        // This seems like a weird way to import something, but doublecheck does it this way and it just works.
        DidChangeSRSEvent = (await importShim('events/did_change_srs_event')).default;
        quiz_queue = await grab_queue();
        srs_manager = quiz_queue.quizQueue.srsManager;
        //console.log('actual srs_manager:',srs_manager);
        // swap out method with updated one below.
        srs_manager.updateSRS = new_updateSRS;
        console.log('Specific SRS initialized');
    }

    // Waits for both stimulus and the quiz_queue to be defined, which happens after some unkown precondition is met somewhere else.
    async function grab_queue(){
        let temp_queue;
        for (let i = 0; i < 50; i++) {
            // Probably the worst line of code I have ever written.
            //console.log('Stimulus status in iteration ',i,' :',typeof Stimulus);
            if (typeof Stimulus !== 'undefined' && (temp_queue = get_controller('quiz-queue')))
            {return temp_queue;}
            // apparantly this is what passes for a sleep function in javascript.
            await new Promise(r => setTimeout(r, 100));
        }
        console.error("Failed to load stimulus, script will probably crash later.");
        return temp_queue
    }

    let updatedSrsNames = ["invalid srs index","Apprentice 1","Apprentice 2","Apprentice 3","Apprentice 4","Guru 1","Guru 2","Master","Enlighten","Burn"]

    // A copy of the updateSRS method of the controllers/quiz_queue/srs_manager class.
    // Apparantly it is not possible to override static methods, so I override the method that calls the static method to instead call updateSrsNames.
    // I don't know if monkeypatching a method with the keyword 'this' in it will work, and what 'this' will then refer to.
    // I sidestep the issue by replacing 'this' with the specific srs_manager object.
    function new_updateSRS({subject, stats}) {
        if (!srs_manager.subjectIdSRSMap.has(subject.id))
        {
            return;
        }
        const {srsId, srsPosition} = srs_manager.subjectIdSRSMap.get(subject.id)
        const totalIncorrect = stats.meaning.incorrect + stats.reading.incorrect
        if (totalIncorrect === 0) {
            window.dispatchEvent(new DidChangeSRSEvent({wentUp: true, newLevelText: updatedSrsNames[srsPosition+1] }))
        } else {
            const srsDropCoeffecient = srsPosition >= 5 ? 2 : 1;
            const newSRSStagePosition = Math.max(1, srsPosition - (srsDropCoeffecient * Math.round(totalIncorrect / 2)))
            window.dispatchEvent(new DidChangeSRSEvent({wentUp: false, newLevelText: updatedSrsNames[newSRSStagePosition] }))
        }
    }
})();
// ==UserScript==
// @name         Retail Training Completion
// @namespace    http://tampermonkey.net/
// @version      0.4.6
// @description  Complete retail trainings for various sites.
// @author       You
// @match        https://arena.amd.com/lms_content/courses/*
// @match        https://googleretailtraining.exceedlms.com/student/path/*
// @match        https://googleretailtraining.exceedlms.com/student/collection/*
// @match        https://googleretailtraining.exceedlms.com/uploads/resource_courses/*
// @match        https://cpcontents.adobe.com/*
// @match        https://retailedge.intel.com/content/activities*
// @match        https://retailedge.intel.com/50/ASMO/quiz*
// @include      /^https:\/\/(www\.bbylearningnetwork\.com|www\.msftexpo\.com|www\.motorolainsiders\.com|www\.fitbitlearn\.com|na\.connecttolearnfb\.com|elearning\.speckproducts\.com)\/player/
// @match        https://www.bestbuyvirtualevents.com/player/monsoon/*
// @match        https://www.msftdigitalevents.com/player/ssla/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/415429/Retail%20Training%20Completion.user.js
// @updateURL https://update.greasyfork.org/scripts/415429/Retail%20Training%20Completion.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    await sleep(2500);
    if (window.location.host.match(/google/)) {
        console.log('google')
        google()
    } else if (window.location.host.match(/intel/)) {
        window.IREP.quiz = new window.IREP.Quiz(window.courseOptions);
        window.IREP.quiz.options.returnUrl = "learning"
        window.IREP.quiz.buildReturnUrl()
        await bruteAnswer();
        await sleep(2500);
        window.close();
    }
    else if (window.location.host.match(/msftdigitalevents/)) {
        microsoft()
    } else {
        monsoon()
        scorm()
        await sleep(2500);
        window.close();
    }

})();

async function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}


async function microsoft() {
    await sleep(4000);
    window.API.saveCallbacks[0][1].allScos.status="passed";
    window.API.saveCallbacks[0][1].allScos.score="100";
    window.API.LMSCommit("");
    window.ssla.navigate("exit");
}

function passMonsoon($window) {
    if ($window) {
      $window.$.post($window.Monsoon.Course.dispatch_url, JSON.stringify({
      course: $window.Monsoon.Course,
      service: 'set_score',
      status: true,
      score: 100,
      data: $window.Monsoon.Score.qbq()
    }), 'json')
    }
    $.post(Monsoon.Course.dispatch_url, JSON.stringify({
      course: Monsoon.Course,
      service: 'set_score',
      status: true,
      score: 100,
      data: Monsoon.Score.qbq()
    }), 'json')
}

async function monsoon() {
    if (!window.Monsoon) {
        const iframes = document.querySelectorAll('iframe')
        for(let iframe of iframes) {
            if (iframe.contentWindow.Monsoon) {
                console.log('monsoon found in iframe')
                passMonsoon(iframe.contentWindow)
            }
        }
    } else {
        passMonsoon()
    }

}

async function scorm() {
    console.log('scorm?')
    if (!window.Controller && !window.LMSProxy && window.SCORM_SetPassed) {
        const iframes = document.querySelectorAll('iframe')
        for(let iframe of iframes) {
            if (iframe.contentWindow.Controller) {
                console.log('scorm found in iframe')
                iframe.contentWindow.Controller.send_complete('pass', '100')
            }
            if (iframe.contentWindow.LMSProxy) {
                console.log('scorm proxy found in iframe')
                iframe.contentWindow.LMSProxy.SetScore(100,100,0)
            }
            if (iframe.contentWindow.Runtime) {
                console.log('scorm runtime found in iframe')
                let id = iframe.contentDocument.querySelector('html').textContent.match(/quizId = \"(.*)\"/)
                if (id !== null) {
                    id = id[1]
                }
                console.log(id)
                iframe.contentWindow.Runtime.finishQuiz(true, 100, id)
            }
        }
    } else {

        window.Controller.send_complete('pass', '100')
        window.LMSProxy.SetScore(100,100,0)
        window.SCORM_SetPassed()
    }
}

async function googleClick() {
    const $course = document.querySelectorAll('[data-path-id]')[1];
    await sleep(2000);
    window.rbk.finished=true;
    window.cmi.core.lesson_status="passed";
    window.submitCommand();
    window.courseware_window.close();
    await sleep(500);
    try {
        document.querySelector('.coursepage__navlink--next').click();
    } catch(e) {
        location.reload();
    }

}

function google() {
    const $courses = document.querySelectorAll('.launch_courseware')
    $courses.forEach(course => {
        course.addEventListener('click', googleClick)
        if (!course.querySelector('span.catalogflag')) {
            course.click()
        }
    })
    try {
        document.querySelector('.course__quickstart a').click()
    } catch (e) {}

}


async function submitQuiz() {
    const data = await window.IREP.quiz.submitQuiz()
    const {result: {answers, pass, score}} = data
    if (pass) return true
    return false
}

async function bruteAnswer() {
    for(let i=0; i<4; i++) {
        const firstQuestion = window.IREP.quiz.options.questions[0]
        window.IREP.quiz.options.answers = [{
            questionId: firstQuestion.questionId,
            answerId: firstQuestion.answers[i].answerId
        }]
        await sleep(300);
        if (await submitQuiz()) {
            window.location.href = window.IREP.quiz.options.returnUrl
        }
    }
}
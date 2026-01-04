// ==UserScript==
// @name         C-SATS Banner
// @namespace    Uchiha Clan
// @version      1.25
// @description  Unleashes Your Sharingan
// @author       Eisenpower
// @icon         https://i.imgur.com/M0jWVYS.png
// @include      *.csats*
// @include      *worker.mturk.com/projects/*/tasks/*assignment_id=*
// @include      *mturkcontent.com/dynamic/*
// @require      https://code.jquery.com/jquery-latest.min.js
// @require      https://greasyfork.org/scripts/33763-nyquery/code/NyQuery.js
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/369969/C-SATS%20Banner.user.js
// @updateURL https://update.greasyfork.org/scripts/369969/C-SATS%20Banner.meta.js
// ==/UserScript==

var sound_url = 'https://freesound.org/data/previews/276/276609_4409114-lq.mp3';
var time_interval, play = false, finished = false, assignment;

$(document).ready(function() {
    if (window.location.href.includes('mturk')) {
        if (window.location.href.includes('mturkcontent')) {
            if (document.querySelector('.panel-body').textContent.includes('C-SATS') || document.querySelector('a[href="https://research.csats.pizza/faq"]')) {
                setTimeout(function() {
                    assignment = window.open(document.querySelector('a[href*="Assignment="]').href, 'C-SATS');
                }, 1000*5);
            }
        }

        window.addEventListener('message', function(event) {
            MESSAGE_HANDLER(event);
        });
    }

    else var load_interval = setInterval(load_check, 5000);
});

function load_check () {
    if (document.getElementById('continueToNextSurvey') || document.querySelector('.completionCode')) {
        CSATS();
    }

    else if (window.location.href.match(/csats.com\/nomore|csats.com\/cancelled/)) {
        console.log('Message Sent');
        window.opener.postMessage({ status: 'Return' }, "*");
    }

    else setTimeout(load_check, 1000);
}

function CSATS () {
    console.log('Loaded');
    setTimeout(function() {

        if (document.querySelector('video')) {
            //time_interval = setInterval(function(){ time_check(); }, 1000*10.1);
            if (document.querySelector('[surveytitle="Training"]') || document.body.textContent.includes('Select the more experienced surgeon')) {
              training();
            }
            else time_check();
        }

        else if (document.body.textContent.includes('You must continue to the next step for your completion code')) {
            if (document.getElementById('continueToNextSurvey').disabled) {
                load_check();
            }
            else {
                document.getElementById('continueToNextSurvey').click();
                load_check();
            }
        }

        else if (document.querySelector('h3')) {
            if (document.querySelector('h3').textContent == "HIT completed. Your completion code is") {
                CODE();
            }
        }

        else if (document.querySelector('h1')) {
            if (document.querySelector('h1').textContent.includes("HIPAA and PSQIA Subcontractor Agreement")) {
                document.querySelector('[type="radio"]').click();
                document.getElementById('continueToNextSurvey').click();
                load_check();
            }
        }

        else if (document.querySelector('[surveytitle="Training"]') || document.body.textContent.includes('Select the more experienced surgeon')) {
          training();
        }

        else if (document.querySelector('[surveytitle="Training Review"]')) {
            document.getElementById('continueToNextSurvey').click();
            load_check();
        }

    }, 1000*2);
}

function training() {
  document.querySelector('[type="radio"][value="2"]').click();
  document.getElementById('continueToNextSurvey').click();
  load_check();
}

function time_check () {
    const duration = document.querySelector('.vjs-duration-display').textContent
    const time = document.querySelector('.vjs-current-time-display').textContent.match(/\d{1,2}:\d{2}/)[0] || '-:-';
    const durationNum = duration.match(/\d{1,2}:\d{2}/) ? duration.match(/\d{1,2}:\d{2}/)[0] : '-:-';
    const timeNum = time.match(/\d{1,2}:\d{2}/) ? time.match(/\d{1,2}:\d{2}/)[0] : '-:-';

    console.log(timeNum, durationNum);
    if (!play) {
        play = true;
        document.querySelector('video').muted = 'muted'
        document.querySelector(`button[class="vjs-big-play-button"]`).click();
    }
    else if (durationNum != '00:00' && durationNum != '-:-' && durationNum != '0:00' && durationNum == timeNum && !finished) {
        console.log('Finished');
        finished = true;
        clearInterval(time_interval);
        playSound();
        FINISH();
    }
}

function playSound() {
    var sound = new Audio(sound_url);
    try {
        sound.play();
    }

    catch(error) {
        console.log(error)
    }
}

function FINISH () {
    var boxes = $('article');
    console.log(boxes.length);

    for (let i = 0; i < boxes.length; i++) {
        console.log(boxes[i]);
        if (boxes[i].querySelector('[type="radio"]')) {
            if (boxes.eq(i).find('[type="radio"]:checked').length == 0) {
                console.log(boxes.eq(i).find('[type="radio"]:checked'));
                let radios = boxes[i].querySelectorAll('[type="radio"]');
                setTimeout(function() { CHOOSE(radios); }, i * 200);
            }
        }
    }
    setTimeout(function() {
        console.log('Ready To Continue');
        document.getElementById('continueToNextSurvey').click();
        load_check();
    }, 5000);
}

function CHOOSE (choices) {
    var select = randNum(1,10);
    var weight = [8, 9, 10];

    if (choices.length == 5) {

        // 4 Rating
        if (select <= weight[0]) {
            choices[3].click();
        }

        // 3 Rating
        else if (select <= weight[1]) {
            choices[2].click();
        }

        // 5 Rating
        else if (select <= weight[2]) {
            choices[4].click();
        }
    }

    if (choices.length == 4) {
        // 3 Rating
        if (select <= weight[0]) {
            choices[2].click();
        }

        // 2 Rating
        else if (select <= weight[1]) {
            choices[1].click();
        }

        // 4 Rating
        else if (select <= weight[2]) {
            choices[3].click();
        }
    }

    if (choices.length == 2) {
        choices[0].click();
    }

    console.log(select);
}

function CODE () {
    var code = document.querySelector('.completionCode').textContent;
    window.opener.postMessage({code: code}, "*");
}

function MESSAGE_HANDLER (event) {
    if (event.origin.includes("csats")) {
        if (window.origin == "https://www.mturkcontent.com") {
            if (event.data.code) {
                setTimeout(function() {
                    var code = event.data.code;
                    document.querySelector('input[type="text"]').value = code;
                    assignment.close();
                    setTimeout(function() {
                        document.getElementById('submitButton').click();
                    }, 750);
                }, 500);
            }

            else if (event.data.status) {
                if (event.data.status == 'Return') {
                    assignment.close();
                    window.parent.postMessage({status: 'Return HIT'}, "*");
                }
            }
        }
    }

    else if (event.origin.includes('mturkcontent')) {
        if (window.origin == "https://worker.mturk.com") {
            if (event.data.status == 'Return HIT') {
                document.querySelector('[class="btn btn-secondary"]').click();
            }
        }
    }
}
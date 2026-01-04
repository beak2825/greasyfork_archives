// ==UserScript==
// @name        Duolingo - autoStart next
// @description Automatically start next lesson/tips or story when in stories mode.
// @version     1.4
// @namespace   minirock
// @match       https://www.duolingo.com/*
// @match       https://stories.duolingo.com/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant       GM_notification
// @downloadURL https://update.greasyfork.org/scripts/395615/Duolingo%20-%20autoStart%20next.user.js
// @updateURL https://update.greasyfork.org/scripts/395615/Duolingo%20-%20autoStart%20next.meta.js
// ==/UserScript==

var lURL0 = '';
var lURL1 = '';

function last_url() {
    lURL0 = lURL1;
    lURL1 = window.location.href;
}

function next_lesson_start() {
    let lessons = document.querySelectorAll("div[class='Af4up QmbDT']");
    // console.log('XXXXXXXXXXXXXXXXXXX');
    // console.log(lessons.length);
    if (lessons.length !== 0) {
        for (let i = 0; i < lessons.length; ++i) {
            var lesson = lessons[i].querySelector("div[data-test='level-crown']");
            if (lesson === null) {
                var last_finished = i;
                break;
            }
        }

        // go to next unfinished lesson
        lessons[last_finished].querySelector("div[class='_2albn']").click();

        var status = Array.prototype.filter.call(lessons[last_finished].querySelectorAll("div[class='_2yvEQ']"), function (element) {
            return RegExp('^0% Complete').test(element.textContent);
        });

        // status > 0 == lesson : tips
        if (status.length !== 0) {
            console.log('TIPS');
            lessons[last_finished].querySelectorAll("button")[1].click();

//             GM_notification({
//                 timeout: 3000,
//                 text: last_finished + '/' + lessons.length
//             });
        } else {
            console.log('LESSON');
            lessons[last_finished].querySelector("button[data-test='start-button']").click();
        }
    }

    //////////////////////////////////////////////////////////

    // stories
    let stories = document.querySelectorAll("div[class='story-cover-illustration']");
    if (stories.length !== 0) {
        for (let i = 0; i < stories.length; ++i) {
            var story = stories[i].querySelector("button[style='background: rgb(255, 177, 0); cursor: pointer;']");
            console.log(i);
            if (story === null) {
                var last_finished_story = i;
                break;
            }
        }
        stories[last_finished_story].click();

            GM_notification({
                timeout: 3000,
                text: last_finished_story + '/' + stories.length
            });
    }
}

function next_lesson_start_from_tips() {
    let tips = document.querySelector("div[class='_2LApJ']");
    if (tips !== null) {
        tips.querySelectorAll("button")[0].click();
    }
}

$(document).ready(function () {
    last_url();
    setTimeout(next_lesson_start, 2000);
});

let keyEventListener = function (event) {
    if (event.keyCode === 13) {
        next_lesson_start_from_tips();
        next_lesson_start();
    }
}

document.addEventListener("keyup", keyEventListener);

// start automatically next after 2s
history.pushState = (f => function pushState() {
    var ret = f.apply(this, arguments);
    window.dispatchEvent(new Event('pushstate'));
    window.dispatchEvent(new Event('locationchange'));

    last_url();

    if (lURL0.indexOf('/practice') == -1) setTimeout(next_lesson_start, 3000);
    else setTimeout(function () {
        window.location.href = '/practice';
    }, 3000);

    return ret;
})(history.pushState);

window.addEventListener('popstate', () => {
    window.dispatchEvent(new Event('locationchange'))
});
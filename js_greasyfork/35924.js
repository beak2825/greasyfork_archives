// ==UserScript==
// @name         Captcha Clear
// @version      1.1
// @description  Unleashes Your Sharingan on Worker Captchas.
// @author       Eisenpower
// @namespace    Uchiha Clan
// @icon         https://i.imgur.com/M0jWVYS.png
// @include      *mturk*
// @include      *google.com/evaluation/endor/*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/35924/Captcha%20Clear.user.js
// @updateURL https://update.greasyfork.org/scripts/35924/Captcha%20Clear.meta.js
// ==/UserScript==

// Put your HIT's group ID here.
// Default is Crowdsurf Support (https://worker.mturk.com/projects/3K3X4GGOSLN9WHITSDB41LMDI6SMCK/tasks/)
var captcha_hit_group_id = '3K3X4GGOSLN9WHITSDB41LMDI6SMCK';

// Forces quick captcha load.
GM_addStyle("#javascriptDependentFunctionality { display: block !important; }");

if ($("p:contains(stocks will go up or down)").length) return;

var workerCaptcha = document.getElementById('captchaInput');

// Opens the HIT window.
document.onkeydown = function(e){
    if (e.keyCode === 109 || e.keyCode === 189){ //"Numpad(Minus)- and Keyboard(Dash)-" is the default. Go to "http://keycode.info/" to get the keycode for your preffered key.
        var worker_window = window.open(`https://worker.mturk.com/projects/${captcha_hit_group_id}/tasks/`, `workerCaptchaClear`, `width=700, height=400, top=200, left=360, statusbar=no`);

        // Check pop up status
        try {
            worker_window.focus();
        }
        catch (e) {
            alert('Captcha Clear pop-up blocked! Please add this site to your exception list.');
        }
    }
};

if (window.name == "workerCaptchaClear") WORKER();

function WORKER () {
    // Removes the Worker iframe
    var frame = document.querySelectorAll('.row.m-b-sm');
    for (i = 0; i < frame.length; i ++) {
        frame[i].remove();
    }

    // Returns the HIT
    var return_button = $('button.btn.btn-secondary')[0];
    if (return_button.textContent == 'Return' && window.location.href.indexOf(captcha_hit_group_id) != -1) {
        return_button.click();
    }

    // Closes the window if no Captcha.
    else if (!workerCaptcha) {
        window.close();
    }
}
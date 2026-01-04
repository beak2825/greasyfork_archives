// ==UserScript==
// @name         Energy Game Bot
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  This Bot can be used to win the Energy Game for Tickets for the Energy Air or Star Night. Use at own risk! Any liability is Rejected.
// @author       I'm not sure. But it wasn't you.
// @match        https://game.energy.ch/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=energy.ch
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447278/Energy%20Game%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/447278/Energy%20Game%20Bot.meta.js
// ==/UserScript==

const questions = {
    "WELCHEN KLEIDUNGSSTIL VERFOLGT TALLY WEIJL GRUNDSÄTZLICH?":"Just in time (voll im Trend)",
}

const STATES = {
	LOST: 0,
	TICKET_DECISION: 1,
	RECAPTCHA: 2,
	VERIFY: 3,
    QUESTION: 4,
    WON: 5,
    ERROR: 6,
    CREDENTIALS_REQUEST: 7
}

var i = 0;
var x = 0;

function getState() {
    if(sessionStorage.getItem('energy-bot-credentials-mail') !== null && sessionStorage.getItem('energy-bot-credentials-password') !== null) {
        if(document.getElementById('lose')) {
            return STATES.LOST;
        }
        if(document.getElementsByClassName('tickets').length) {
            return STATES.TICKET_DECISION;
        }
        if(document.getElementById('g-recaptcha')) {
            return STATES.RECAPTCHA;
        }
        if(document.getElementById('verification')) {
            return STATES.VERIFY;
        }
        if(document.getElementsByClassName('question-number').length) {
            return STATES.QUESTION;
        }
        if(document.getElementById('win-game')) {
            return STATES.WON;
        }
        return STATES.ERROR;
    }
    return STATES.CREDENTIALS_REQUEST;
}

function getCredentials() {
    var email = prompt("Bitte E-Mail Adresse eingeben: ");
    while(!validateEmail(email)) {
        alert("Dies ist keine gültige E-Mail Adresse!");
        email = prompt("Bitte E-Mail Adresse eingeben: ");
    }
    sessionStorage.setItem('energy-bot-credentials-mail', email);

    var password = prompt("Bitte gib das zugehörige Passwort ein: ");
    while(password == "") {
        password = prompt("Bitte gib das zugehörige Passwort ein: ");
    }
    sessionStorage.setItem('energy-bot-credentials-password', password);
}

function validateEmail(email) {
    return String(email)
    .toLowerCase()
    .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

function randomTimeout() {
    return Math.floor(Math.random() * (1200 -850 + 1)) + 1200;
}

function currQuestion() {
    if($('h3.question-text').html() != null) {
        return $('h3.question-text').html().toUpperCase();
    }
}

function nextQuestion() {
    $('button#next-question').trigger('click');
}

function startGame() {
    $('.game-button').trigger('click');
}

function restartGame() {
    $('button#lose').trigger('click');
}

function selectBubble() {
    document.getElementsByTagName('img')[2].click();
}

function decisionTicket() {
    document.getElementsByTagName('img')[2].click();
    setTimeout(selectBubble, randomTimeout());
}

function answerQuestion() {
    let curr = currQuestion();
    console.log(curr, questions[curr]);
    $('#answers .answer-wrapper').each((i, el) => {
        if($(el).children('label').html() === questions[curr]) {
            $(el).children('input').trigger('click');
        }
    });
    setTimeout(nextQuestion, randomTimeout());
}

window.clearSession = function(text) {
    sessionStorage.removeItem('energy-bot-credentials-mail');
    sessionStorage.removeItem('energy-bot-credentials-password');
};

function run() {
    var currentState = getState();

    console.log(currentState);

    if(currentState !== STATES.RECAPTCHA) {
        i = 0;
    }

    if(currentState !== STATES.ERROR) {
        x = 0;
    }

    switch(getState()) {
        case STATES.CREDENTIALS_REQUEST:
            getCredentials();
            break;
        case STATES.LOST:
            restartGame();
            break;
        case STATES.TICKET_DECISTION:
            decisionTicket();
            break;
        case STATES.RECAPTCHA:
            i++;
            console.log('warten auf recaptcha. In zukünftiger Version evtl. automatisiert. Versuch:'+i);
            if(i>50) {
                location.reload();
            }
            break;
        case STATES.VERIFY:
            startGame();
            break;
        case STATES.QUESTION:
            answerQuestion();
            break;
        case STATES.WON:
            alert("GEWONNEN!");
            return;
            break;
        case STATES.ERROR:
            x++;
            console.log('etwas ist schief gelaufen. Versuch: '+x);
            if(x>50) {
                alert('Bitte neu anmelden');
                x=0;
            }
            break;
    }
    setTimeout(run, randomTimeout());
}


$(document).ready(function() {
    console.log('starting...');
    setTimeout(run, randomTimeout());
});

// ==UserScript==
// @name         Raucbanner
// @namespace    https://greasyfork.org/users/144229
// @version      1.2
// @description  Makes Money
// @author       MasterNyborg + Eisenpower
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *mturkcontent*
// @include      *worker.mturk.com*
// @exclude      *worker.mturk.com/NyQueue
// @exclude      *worker.mturk.com/tasks?NyQ
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @require      https://greasyfork.org/scripts/33763-nyquery/code/NyQuery.js
// @downloadURL https://update.greasyfork.org/scripts/39630/Raucbanner.user.js
// @updateURL https://update.greasyfork.org/scripts/39630/Raucbanner.meta.js
// ==/UserScript==
//ADD THIS-LINE BREAKS GF UPLOAD "// @require https://cdn.rawgit.com/naptha/tesseract.js/1.0.10/dist/tesseract.js"
var note = "Raucous Captcha Challenge";

$(document).ready(function() {
    if (!$('p:contains(Please review the provided Webpage:)').length) {
        return;
    }

    if (document.querySelector('option') || document.querySelector('[name="captcha_challenge_response"]')) {
        document.querySelector('body').style.backgroundColor = 'red';
        //notifications.bang(note);
        //notifications.speak(note);
        var myImage = document.querySelector('img').src;
        Tesseract.recognize(myImage)
            .then(function(result){
            var number = result.words[0].text;
            console.log(result.words[0].text);
            document.querySelector(`option[value="${number}"]`).selected = true;
            pick();
        });
    }

    else pick();

});

function pick () {
    var rando = randNum(12000,15000);
    setTimeout(function(){
        $('input[value=No]').click();
        $('input[value=NO]').click();
        $('input[value=Submit]').click();
    },rando);
}

const notifications = {
    speak (note) {
        var phrase = new SpeechSynthesisUtterance();
        window.speechSynthesis.getVoices();
        phrase.text = 'Rockus Captchuh Present';
        window.speechSynthesis.speak(phrase);
    },

    bang (note) {
        Notification.requestPermission();
        const n = new Notification(note, {
            icon: `https://i.imgur.com/M0jWVYS.png`,
            body: note,
        });
        setTimeout(n.close.bind(n), 5000);
    }
};
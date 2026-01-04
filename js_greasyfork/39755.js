// ==UserScript==
// @name         Endor-Pinterest Batch Limit
// @author       Eisenpower
// @namespace    Uchiha Clan
// @version      1.44
// @description  Unleashes Your Sharingan
// @icon         https://i.imgur.com/M0jWVYS.png
// @include      *worker.mturk.com*
// @include      *google.com/evaluation/endor/*
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/39755/Endor-Pinterest%20Batch%20Limit.user.js
// @updateURL https://update.greasyfork.org/scripts/39755/Endor-Pinterest%20Batch%20Limit.meta.js
// ==/UserScript==

var token = 'Placeholder';
var does = 'https://worker.mturk.com/projects/3LNJUJ6UPA3NDVXPADTL0GIVNJ9REI/tasks';
var topics = 'https://worker.mturk.com/projects/3RFNWL8VQUBWU5VXTJO1CTTFMDPGZJ/tasks';
var ceiling = 15;
var capped = SET_CAP();

if (window.name.toLowerCase() == 'john doe') ENDOR_CHECK('John Doe', does);
if (window.name.toLowerCase() == 'topics') ENDOR_CHECK('Topics', topics);

if (window.location.href.includes('google.com/evaluation/endor/')) {
    $(document).ready(function(){
        if (document.querySelector('body').textContent.includes('have been reserved for other workers')) {
            window.parent.postMessage({batchLimit: true}, "*");
        }
        else if (document.querySelector('body').textContent.includes('An error occurred.')) {
            window.parent.postMessage({batchLimit: 'error'}, "*");
        }
        else if (document.querySelector('h3').textContent.includes('Instructions') || document.querySelector('h2').textContent.includes('Instructions')) {
            window.parent.postMessage({batchLimit: false}, "*");
        }
    });
}

else if (window.location.href.includes('worker.mturk.com/projects/')) {
    var school = document.querySelector('.project-detail-bar');
    var requester = JSON.parse(school.querySelector('span').getAttribute('data-react-props')).modalOptions.requesterName;
    var sergey = requester.includes('Sergey Schmidt');
    var johnDoe = requester.includes('John Doe');

    document.querySelector('[id="MainContent"] > [class="row"]').remove();

    if (!sergey && !johnDoe) return;

    if (document.getElementById('captchaInput')) return;

    window.addEventListener('message', function(event) {
        MESSAGE_HANDLER(event);
    });

    BUTTON();

    var accept = document.querySelector('[class="btn btn-primary"]');

    if ((sergey || johnDoe) && accept && GM_getValue('batchLimit') === true && GM_getValue('limiter') == 'on') {
        if (capped < ceiling) {
            accept.click();
        }

        else {
            GM_setValue('capped', 0);
            //alert(`Cap Limit Reached: ${ceiling} caps!`);
        }
    }

    if (window.name.toLowerCase() == 'john doe' || window.name.toLowerCase() == 'topics' && (sergey || johnDoe)) {
        if (GM_getValue('batchLimit') === false) {
            accept.click();
        }
        // Manually change the name of the tab and set a function to go to the Doe page if it matches the name.
        setInterval(function(){ console.log('Still Running'); }, 10 * 60000);
        setTimeout(function() {
            GM_setValue('batchLimit', false);
            if (window.name.toLowerCase() == 'john doe') window.location.href = does;
            else window.parent.location.reload();
        }, 1.8e+6); // 30 Minutes
    }
}

function SET_CAP () {
    if (!GM_getValue('capped')) {
        GM_setValue('capped', 0);
    }
    return GM_getValue('capped');
}

function ENDOR_CHECK (hit, url) {
    // (Manually Input in Console) document.title = 'John Doe';
    setTimeout(function() {
        if (hit == 'Topics') {
            GM_setValue('batchLimit', false);
            const push = {
                type: `note`,
                title: `${hit} Alert`,
                body: `Check Caps`
            };

            $.ajax({
                type: `POST`,
                headers: {Authorization: `Bearer ${token}`},
                url: `https://api.pushbullet.com/v2/pushes`,
                data: push
            });
        }

        window.location.href = url;
        //}, 1.8e+6); // 30 Minutes
    }, 3.6e+6); // 1 Hour
    var button = `<button class="btn" style= "height: 30px; margin-left: 10px; padding: 7px; background-color: green; color: white;">${hit}</button>`;
    var bar = document.querySelector('[class*="btn btn-secondary"]');
    bar.insertAdjacentHTML('beforebegin', button);
}

function MESSAGE_HANDLER (event) {
    console.log(event);
    //console.log('This is GM_getValue(batchLimit): ' + GM_getValue('batchLimit'));
    if (event.origin == "https://www.google.com") {
        if (event.data.batchLimit === true) {
            if (window.origin == "https://worker.mturk.com") {
                setTimeout(function() {
                    capped ++;
                    console.log(`False Caps: ${capped}`);
                    GM_setValue('capped', capped);
                    GM_setValue('batchLimit', true);
                    document.querySelector('button[class="btn btn-secondary"]').click();
                }, 500);
            }
        }
        else if (window.origin == "https://worker.mturk.com" && !document.querySelector('h2')) {
            setTimeout(function() {
                GM_setValue('capped', 0);
                GM_setValue('batchLimit', false);
            }, 500);
        }
    }

    if (event.origin == "https://sofia.pinadmin.com") {
        if (event.data.golden) {
            if (window.origin == "https://worker.mturk.com") {
                setTimeout(function() {
                    document.querySelector('button[class="btn btn-secondary"]').click();
                }, 500);
            }
        }
    }

    if (event.origin == "https://sofia.pinadmin.com") {
        if (event.data.golden) {
            if (window.origin == "https://worker.mturk.com") {
                setTimeout(function() {
                    document.querySelector('button[class="btn btn-secondary"]').click();
                }, 500);
            }
        }
    }
}

function BUTTON () {
    if (!GM_getValue('limiter')) {
        GM_setValue('limiter', 'on');
    }
    var button = `<button id="endor_button" class="btn" style= "height: 30px; margin-left: 10px; margin-right: 10px; padding: 7px; background-color: green; color: white;">Endor Limit</button>`;
    var bar = document.querySelector('[class*="btn btn-secondary"]');
    bar.insertAdjacentHTML('beforebegin', button);
    //console.log(GM_getValue('limiter'));
    $('#endor_button').click(function (e) {
        e.preventDefault();
        console.log('Clicked');
        CHANGE();
        COLOR();
    });

    function CHANGE () {
        switch (GM_getValue('limiter')) {
            case 'on':
                GM_setValue('limiter', 'off');
                console.log(GM_getValue('limiter'));
                break;

            case 'off':
                GM_setValue('limiter', 'on');
                console.log(GM_getValue('limiter'));
                break;
        }
    }

    function COLOR () {
        switch (GM_getValue('limiter')) {
            case 'on':
                $('#endor_button').css({'background-color' : 'green', 'color' : 'white'});
                break;

            case 'off':
                $('#endor_button').css({'background-color' : '#eeeeee', 'color' : 'black'});
                break;
        }
    }
    COLOR();
}

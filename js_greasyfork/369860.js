// ==UserScript==
// @name         Adsforce Handler
// @author       Eisenpower
// @namespace    Uchiha Clan
// @version      1.0
// @description  Unleashes Your Sharingan
// @icon         https://i.imgur.com/M0jWVYS.png
// @include      *worker.mturk.com*
// @include      https://www.facebook.com/se/cc/survey*
// @require      http://code.jquery.com/jquery-latest.min.js
// @require      https://greasyfork.org/scripts/33763-nyquery/code/NyQuery.js
// @downloadURL https://update.greasyfork.org/scripts/369860/Adsforce%20Handler.user.js
// @updateURL https://update.greasyfork.org/scripts/369860/Adsforce%20Handler.meta.js
// ==/UserScript==

if (window.location.href.includes('facebook.com/se/cc/survey')) {
    $(document).ready(function(){
        if (document.querySelector('body').textContent.includes('Please Skip or Return This HIT.')) {
            window.parent.postMessage({return: true}, "*");
        }
    });
}

// Returns and Accepts HITs
else if (window.location.href.includes('worker.mturk.com/projects/')) {
    var school = document.querySelector('.project-detail-bar');
    var requester = JSON.parse(school.querySelector('span').getAttribute('data-react-props')).modalOptions.requesterName;
    var ads = requester.includes('AdsForce');

    if (!ads) return;

    if (document.getElementById('captchaInput')) return;

    window.addEventListener('message', function(event) {
        MESSAGE_HANDLER(event);
    });

    var accept = document.querySelector('[class="btn btn-primary"]');

    if (ads && accept) {
        setTimeout(function () {
            accept.click();
        }, 3000);
    }
}

// Pick Random HIT
else if (document.querySelector('span[class="primary-color"]').textContent.toLowerCase() == 'adsforce') {
    if (document.querySelector(`[data-react-class="require('reactComponents/alert/Alert')['PureAlert']"]`)) {
        var hits = document.querySelectorAll('[class="hit-set-table-row table-row expandable"]');
        var ads = [];

        for (let i = 0; i < hits.length; i++) {
            //if (hits[i].textContent.includes('AdsForceWatch 10 fun videos and get')) {
                ads.unshift(hits[i]);
            //}
        }

        setTimeout(function() {
            var pick = randNum(0, ads.length);
            hits[pick].querySelector('[class="btn work-btn hidden-sm-down"]').click();
        }, 3000);
    }
}

function MESSAGE_HANDLER (event) {
    console.log(event);
    if (event.origin == "https://www.facebook.com") {
        if (window.origin == "https://worker.mturk.com") {
            if (event.data.return) {
                setTimeout(function() {
                    document.querySelector('button[class="btn btn-secondary"]').click();
                }, 500);
            }
        }
    }
}
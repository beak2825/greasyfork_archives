// ==UserScript==
// @name         hybrid scrape
// @namespace    pryo
// @version      0.4
// @description  scrape hybrid for today's work
// @author       pyro
// @match        https://www.gethybrid.io/workers/projects
// @grant        none
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/368236/hybrid%20scrape.user.js
// @updateURL https://update.greasyfork.org/scripts/368236/hybrid%20scrape.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let refresh = 60, interv; // seconds

    $("<audio id='audio_accepted'><source src='https://www.soundjay.com/button/button-21.mp3' type='audio/mpeg'></audio>").appendTo($('body'));

    scrape(); //initial scrape;
    interv = setInterval( function() {
        scrape();
    }, refresh * 1000);

})();

function scrape() {
    let work = [], url = 'https://www.gethybrid.io/workers/projects', settings = {snooze: false};
    let month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][new Date().getMonth()];
    let day = new Date().getDate() > 9 ? String(new Date().getDate()) : "0" + new Date().getDate();
    let today = month + " " + day;
    $.get(url, function (data) {
        $('a[href^="/workers/tasks?project_id"]', $(data)).each( (k,v) =>  work[k] = {
            description: $(v).text(),
            link: v.href,
            tasks: Number($(v).parent().next('td').text().replace(/[^0-9]+/g,'')),
            pay: Number($(v).parent().next('td').next().text().replace('$','')),
            created: $(v).parent().next('td').next().next().text()
        });
        console.log(work);

        console.log(today);
        work.forEach( function(el) {
            //console.log(el);
            if (el.pay >= 0.80 && today === el.created) {
               notify(el); //desktop notification
               new Audio('https://www.soundjay.com/button/button-21.mp3').play(); //plays sound
            }
        });

    });

}

document.addEventListener('DOMContentLoaded', function () {
    if (Notification.permission !== "granted")
        Notification.requestPermission();
});

function notify(obj) {
    if (Notification.permission !== "granted")
        Notification.requestPermission();
    else {
        let notification = new Notification('New Hybrid work', {
            icon: 'https://www.shareicon.net/download/2016/11/14/852458_h-square_512x512.png',
            body: obj.description
        });

        notification.onclick = function () {
          window.open(obj.link);
        };
    }
}
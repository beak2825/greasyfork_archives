// ==UserScript==
// @name         hybrid scrape
// @namespace    pryo
// @version      0.6
// @description  scrape hybrid for today's work
// @author       pyro
// @match        https://www.gethybrid.io/workers/projects
// @grant        none
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/375999/hybrid%20scrape.user.js
// @updateURL https://update.greasyfork.org/scripts/375999/hybrid%20scrape.meta.js
// ==/UserScript==
 
//   SETTINGS
var pushbullet_key = ''; //need to enter pushbullet api key here to get phone notifications
var min_pay = 0.60; //minimum pay you want notifications for
var scrape_interval = 30; // will scrape after this many seconds
 
// Press space to start/stop the scraping, status will show in the title bar. Hit F12 to view the console and see live scrape data
 
//  SCRIPTY SCRIPT STUFF
var notified = [];
 
(function() {
    'use strict';
    let interv, running = false; // seconds
    document.title = 'Hybrid - Not Scraping';
 
    document.onkeydown = function (k) {
       if (k.keyCode === 32 && running) {
           running = false;
           document.title = 'Hybrid - Not Scraping';
           clearInterval(interv);
           console.log('Stopped Scraping');
 
       }
       else if (k.keyCode === 32 && !running) {
           running = true;
           document.title = 'Hybrid - Scraping';
           scrape();
           console.log('Started Scraping');
           interv = setInterval( function() {
               scrape();
           }, scrape_interval * 1000);
       }
    }
 
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
        console.clear();
        console.log(new Date());
        console.table(work,['description','tasks','pay','created']);
        work.forEach( function(el) {
 
            if (el.pay >= min_pay && today === el.created /* && !el.description.includes(ignoreList[0]) && !el.description.includes(ignoreList[1]) && !el.description.includes(ignoreList[2]) && !el.description.includes(ignoreList[3]) */ ) {
               if (!notified.includes(el.description)) {
                  notify(el); //desktop notification
                  if (pushbullet_key.length) { pushItRealGood(el.description + ' - $' + el.pay + ' - ' + el.tasks + ' hits'); }
                  notified.push(el.description);
 
               }
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
 
function pushItRealGood(msg) {
    var push = {};
    push['type'] = 'note';
    push['title'] = msg;
    push['body'] = '';
    $.ajax({
       type    : 'POST',
       headers : {'Authorization': 'Bearer ' + pushbullet_key},
       url     : 'https://api.pushbullet.com/v2/pushes',
       data    : push
    });
}
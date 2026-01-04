// ==UserScript==
// @name         Hybrid Scraper/Block All in One
// @version      1.9.5
// @description  none
// @author       Pyro, CT {Tehapollo Edit}
// @include      https://www.gethybrid.io/workers/projects*
// @grant        GM_log
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @namespace    tehapollo
// @downloadURL https://update.greasyfork.org/scripts/377469/Hybrid%20ScraperBlock%20All%20in%20One.user.js
// @updateURL https://update.greasyfork.org/scripts/377469/Hybrid%20ScraperBlock%20All%20in%20One.meta.js
// ==/UserScript==

////Block Section////////////////////////////////////////////////////////////////
let blocked_projects = localStorage.getItem('hybrid_project_blocklist') || '';

$(document).ready(function(){
    $('table').attr('id', 'unblocked_projects');
    $('table > thead > tr:first').prepend('<th>Block</th>');
    $('table > tbody > tr').prepend(`<td style="text-align: center;"><a href="#" onclick="return false;" class="btn btn-danger btn-xs btn-block-project"><i class="fa fa-smile-o"></i></a></td>`);


    $(document).on('click', '#unblocked_projects > tbody > tr > td > .btn-block-project', function(){
        let row = $(this).parent().parent();
        let project_id = row.children('td:eq(1)').children('a').text();
        console.log(project_id);

        blocked_projects += project_id + ',';
        localStorage.setItem('hybrid_project_blocklist', blocked_projects);

        let row_to_move = row.detach();
        $('#blocked_projects_table > tbody').append(row);
    });

    $(document).on('click', '#blocked_projects_table > tbody > tr > td > .btn-block-project', function(){
        let row = $(this).parent().parent();
        let project_id = row.children('td:eq(1)').children('a').text();
        blocked_projects = blocked_projects.replace(project_id + ',', '');
        localStorage.setItem('hybrid_project_blocklist', blocked_projects);

        let row_to_move = row.detach();
        $('#unblocked_projects > tbody').append(row);
    });

    let blocked_rows = [];
    $('table > tbody > tr').each(function(){
        let row = $(this);
        let project_id = row.children('td:eq(1)').children('a').text();

        if (blocked_projects.indexOf(project_id) > -1) blocked_rows.push(row.detach());
    });

    $('table').after(`<h1 id="blocked_projects_toggle">Blocked Projects</h1>
<table id="blocked_projects_table" class="table table-striped data-table dt-reponsive hidden">
    <thead>
        <tr><th>Unblock</th><th>Name</th><th>Available tasks</th><th>Pay</th><th>Created</th>
    </thead>
    <tbody>
    </tbody>
</table>`);
    for (var i = 0; i < blocked_rows.length; i++){
        $('#blocked_projects_table').children('tbody').append(blocked_rows[i]);
    }

    $(document).on('click', '#blocked_projects_toggle', function(){
        $('#blocked_projects_table').toggleClass('hidden');
    });

});
/////////////////////////////////////////////////////////////////////////////////////////////////

///SCRAPER STUFF/////////////////////////////////////////////////////////////////////////////////
//Styling
$('<input type="checkbox" id="Pushing" name="Pushing"/><label>PushBullet <label/>').insertAfter("h1");
$('<input type="checkbox" id="Desktop" name="Desktop"/><label>Desktop <label/>').insertAfter("h1");
$('<input type="checkbox" id="ConstantSound" name="ConstantSound"/><label>Constant Sound <label/>').insertAfter("h1");
$('<input type="checkbox" id="Today" name="Today"/><label>Today Only <label/>').insertAfter("h1");
$('<input type="checkbox" id="Auto" name="Auto"/><label>Auto-Start Scraper <label/>').insertAfter("h1");
$('<h5><h5/><label>Min Pay:$<label/><input type="text" name="minPay" id="minPay" value=""style="width: 50px; height: 18px;">').insertBefore('table.table-striped.data-table.dt-reponsive');
$('<label>Scrape Speed:<label/><input type="text" name="SSpeed" id="SSpeed" value=""style="width: 28px; height: 18px;">').insertAfter('input#minPay');
$('<label>Min Task#:<label/><input type="text" name="Task#" id="Task#" value=""style="width: 28px; height: 18px;">').insertAfter('input#minPay');
$('<label>Push API:<label/><input type="text" name="PushAPI" id="PushAPI" value=""style="width: 200px; height: 18px;">').insertAfter('input#SSpeed');
$('<label>Sound URL:<label/><input type="text" name="SoundURL" id="SoundURL" value=""style="width: 200px; height: 18px;">').insertAfter('input#PushAPI');
$('<h6><h6/><input type="button" value="Save Settings" id="SaveSettings"/>').insertBefore('table.table-striped.data-table.dt-reponsive');
$('<input type="button" value="Change API/SOUND" id="APISOUND"/>').insertAfter('input#SaveSettings');

//   SETTINGS
var pushbullet_key = ''; //need to enter pushbullet api key here to get phone notifications
var min_pay = 0.00; //minimum pay you want notifications for
var scrape_interval = 30; // will scrape after this many seconds
var audio = new Audio('https://themushroomkingdom.net/sounds/wav/drm64_mario2.wav');// this is your alert sound
var constant_sound = document.getElementById("ConstantSound");//Ignore
var bullet_checked = document.getElementById("Pushing");//Ignore
var desktop_note = document.getElementById("Desktop");//Ignore
var Today_Only = document.getElementById("Today");//Ignore
var auto_start = document.getElementById("Auto");//Ignore
var min_task = 1
let R_sounds = localStorage.getItem('S_YesNo') || '';
let R_bullet = localStorage.getItem('B_YesNo') || '';
let R_desktop = localStorage.getItem('D_YesNo') || '';
let R_today = localStorage.getItem('T_YesNo') || '';
let R_auto = localStorage.getItem('A_YesNo') || '';
let R_MinPay = localStorage.getItem('MinPay') || '';
let R_SSpped = localStorage.getItem('SSpeed') || '';
let R_API = localStorage.getItem('PAPI') || '';
let R_Sound = localStorage.getItem('Sound') || 'https://themushroomkingdom.net/sounds/wav/drm64_mario2.wav';
let R_Tasks = localStorage.getItem ('Tasks') || '';
// Press space to start/stop the scraping, status will show in the title bar. Hit F12 to view the console and see live scrape data

//  SCRIPTY SCRIPT STUFF
var notified = [];
var pushed = [];
var sound_note = [];
let interv, running = false; // seconds
    document.title = 'Hybrid - Not Scraping';
$('h1').append('<p id="WarnText" style=" margin: 0px 50px 0px; font-size: 50pt;"form="usrform">WARNING Scraper Not On!!!!!!!</p>');
(function() {
    'use strict';


    document.onkeydown = function (k) {
       if (k.keyCode === 32 && running) {
           $('p#WarnText').text("WARNING Scraper Not On!!!!!!!");
           running = false;
           document.title = 'Hybrid - Not Scraping';
           clearInterval(interv);
           console.log('Stopped Scraping');

       }
       else if (k.keyCode === 32 && !running) {
           running = true;
           $('p#WarnText').text("");
           document.title = 'Hybrid - Scraping';
           scrape();
           console.log('Started Scraping');
           interv = setInterval( function() {
               scrape();
           }, scrape_interval * 1000);
       }
    }

})();
//////////////////////////////////////////////////////////////////////////
$(document).ready(function(Remember_Settings){

   $("input#SaveSettings").click(function() {
  $(document.getElementById('SoundURL').style.display = 'none');
   var pay = document.getElementById("minPay").value
   var Speed = document.getElementById("SSpeed").value
   var Task_Count = document.getElementById("Task#").value
   localStorage.setItem('Tasks', Task_Count);
   localStorage.setItem('SSpeed', Speed);
   localStorage.setItem('MinPay', pay);
let R_MinPay = localStorage.getItem('MinPay') || '';
let R_SSpped = localStorage.getItem('SSpeed') || '';
let R_Tasks = localStorage.getItem ('Tasks') || '';
min_task = R_Tasks
scrape_interval = R_SSpped
min_pay = R_MinPay
if(document.getElementById('PushAPI').style.display = 'inline'){
    var API = document.getElementById("PushAPI").value
    let R_API = localStorage.getItem('PAPI') || '';
    localStorage.setItem('PAPI', API);
    pushbullet_key = R_API
    document.getElementById('PushAPI').style.display = 'none';
   if(document.getElementById('SoundURL').style.display = 'inline' && document.getElementById('SoundURL').value.length ){
       var Song = document.getElementById("SoundURL").value
      let R_Sound = localStorage.getItem('Sound') || '';
      localStorage.setItem('Sound', Song);
     audio = new Audio(R_Sound);


   }


}
   });

$("input#APISOUND").click(function() {
 document.getElementById('PushAPI').style.display = 'inline';

 document.getElementById('SoundURL').style.display = 'inline';
});




    if (R_sounds == "on"){
   document.getElementById("ConstantSound").checked = true;
}
if (R_bullet == "on"){
    document.getElementById("Pushing").checked = true;
}
if (R_desktop == "on"){
    document.getElementById("Desktop").checked = true;
}
if (R_today == "on"){
    document.getElementById("Today").checked = true;
}
if (R_auto == "on"){
    document.getElementById("Auto").click();

    }
});

$(document.getElementById("minPay").value= R_MinPay)
$(document.getElementById("SSpeed").value= R_SSpped)
$(document.getElementById("PushAPI").value= R_API)
$(document.getElementById("Task#").value= R_Tasks)
$(document.getElementById('SoundURL').style.display = 'none');
$(document.getElementById('PushAPI').style.display = 'none');
pushbullet_key = R_API
scrape_interval = R_SSpped
min_pay = R_MinPay
min_task = R_Tasks
audio = new Audio(R_Sound);







constant_sound.addEventListener('change', (event) => {
  if (event.target.checked) {
    localStorage.setItem('S_YesNo', "on");
  } else {
   localStorage.setItem('S_YesNo', "off");
  }
})


bullet_checked.addEventListener('change', (event2) => {
  if (event2.target.checked) {
    localStorage.setItem('B_YesNo', "on");
  } else {
   localStorage.setItem('B_YesNo', "off");
  }
})



desktop_note.addEventListener('change', (event3) => {
  if (event3.target.checked) {
    localStorage.setItem('D_YesNo', "on");
  } else {
   localStorage.setItem('D_YesNo', "off");
  }
})

Today_Only.addEventListener('change', (event4) => {
  if (event4.target.checked) {
    localStorage.setItem('T_YesNo', "on");
  } else {
   localStorage.setItem('T_YesNo', "off");
  }
})

auto_start.addEventListener('change', (event5) => {
  if (event5.target.checked && running == false) {
   localStorage.setItem('A_YesNo', "on");
      $('p#WarnText').text("");
      running = true;
           document.title = 'Hybrid - Scraping';
           scrape();
           console.log('Started Scraping');
           interv = setInterval( function() {
               scrape();
           }, scrape_interval * 1000);

  }
    else if (event5.target.checked){
    localStorage.setItem('A_YesNo', "on");
    }
    else {
   localStorage.setItem('A_YesNo', "off");
  }
})
//////////////////////////////////////////////////////////////////////////
function scrape() {
    let work = [], url = 'https://www.gethybrid.io/workers/projects?pinterest=1', settings = {snooze: false};
    let month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][new Date().getMonth()];
    let day = new Date().getDate() > 9 ? String(new Date().getDate()) : "0" + new Date().getDate();
    let today = month + " " + day;
    $.get(url, function (data) {
        $('a[href^="/workers/tasks?project_id"]', $(data)).each( (k,v) =>  work[k] = {
            description: $(v).text(),
            link: v.href,
            tasks: Number($(v).parent().next('td').text().replace(/[^0-9]+/g,'')),
            pay: Number($(v).parent().next('td').next().text().replace('$','')),
            created: $(v).parent().next('td').next().next().text(),
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
               });

        console.clear();
        console.log(new Date());
        console.table(work,['description','tasks','pay','created']);
        work.forEach( function(el) {

            if (el.pay >= min_pay && today === el.created && constant_sound.checked == true && !blocked_projects.includes(el.description) && Today_Only.checked == true && !el.description.includes("Draw a box") && !el.description.includes("_UTC") && el.tasks >= min_task || el.pay >= min_pay && constant_sound.checked == true && !blocked_projects.includes(el.description) && Today_Only.checked == false && !el.description.includes("Draw a box") && !el.description.includes("_UTC") && el.tasks >= min_task) {
                audio.play();
                  if (pushbullet_key.length && !pushed.includes(el.description) && bullet_checked.checked == true) { pushItRealGood(el.description + ' - $' + el.pay + ' - ' + el.tasks + ' hits'+ ' - '+el.time)
                      pushed.push(el.description); }

                   if (!notified.includes(el.description) && desktop_note.checked == true){
                    notify(el);
                    notified.push(el.description);
                   }
                }
            else if (el.pay >= min_pay && today === el.created && constant_sound.checked == false && !blocked_projects.includes(el.description) && Today_Only.checked == true && !el.description.includes("Draw a box") && !el.description.includes("_UTC") && el.tasks >= min_task|| el.pay >= min_pay && constant_sound.checked == false && !blocked_projects.includes(el.description) && Today_Only.checked == false && !el.description.includes("Draw a box") && !el.description.includes("_UTC") && el.tasks >= min_task) {
                 if (pushbullet_key.length && !pushed.includes(el.description) && bullet_checked.checked == true) { pushItRealGood(el.description + ' - $' + el.pay + ' - ' + el.tasks + ' hits'+ ' - '+el.time)
                      pushed.push(el.description); }

                   if (!notified.includes(el.description) && desktop_note.checked == true){
                    notify(el);
                    notified.push(el.description);
                   }
                   if (!sound_note.includes(el.description)){
                    audio.play();
                      sound_note.push(el.description)
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
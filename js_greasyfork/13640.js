// ==UserScript==
// @name         PANDER
// @version      0.1.5.2
// @description  Run fast panda refreshes
// @author       Saqfish
// @match        https://www.mturk.com/mturk/dashboard*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js
// @grant        none
// @namespace    saqfish
// @downloadURL https://update.greasyfork.org/scripts/13640/PANDER.user.js
// @updateURL https://update.greasyfork.org/scripts/13640/PANDER.meta.js
// ==/UserScript==


var timeintervals = [];
var winders = [];
var Timers = [];
var playtimer = false;
var captcha_url = "https://www.mturk.com/mturk/preview?groupId=3T4QHDVBXBLD2A4YZC57CBG4IE9ZWF";

base64string = "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"
var snd = new Audio("data:audio/wav;base64," + base64string);

var nullload = true;

if (localStorage.getItem('pander_timers') === null) {
    storedTimers = [];
}else{
    var storedTimers = JSON.parse(localStorage['pander_timers']);
    nullload = false; 

    for (var i =0; i < storedTimers.length; i++){
        var NewHit = new Timer(storedTimers[i].name, storedTimers[i].url);
        Timers.push(NewHit);

    }
    loadthing();

}

function Timer(name, url){
    var self = this;
    this.name = name;
    this.url = url;
}

Timer.prototype.start = function(id){
    var i = 0;
    var url = this.url;
    //winders[id] = window.open(url, this.name);
    timeintervals[id] = setInterval(function() {
        console.log("Started " + id);
        i++;
        //winders[id].location.reload(true);
        //$.get(url);
        $.get(url, function(data)
              {
                  var src = $(data);
                  var pR = src.find('td[class="error_title"]:contains("You have exceeded the maximum allowed page request rate for this website.")');
                  if (pR.length !== 0)
                  {
                      console.log("Refresh rate");
                  }else{
                      var aBh = $(data);
                      aBh2 = aBh.find('span[id="alertboxHeader"]:contains("There are no more available HITs in this group. See more HITs available to you below")');
                      if (aBh2.length !== 0)
                      {
                          console.log("...");
                      } else{
                          aBh3 = aBh.find('td:contains("In order to accept your next HIT")');
                          if (aBh3.length !== 0)
                          {
                               StopAll();
                              alert("Captcha!");
                              window.open(captcha_url);
                             
                          }else{
                              console.log("Got one!");
                              snd.play();
                          }
                      }
                  }


              });
    }, 500);
};

Timer.prototype.stop = function(id){ 
    clearInterval(timeintervals[id]);
    //winders[id].close();
    console.log("Stopped " + id);
};


loadthing();


$(document).on('click', '#AddBtn', function(e) {
    var  a = prompt("Name");
    var  b = prompt("Url - Start with either http:// or www!");
    if (b.substring(0, 8) != "https://"){
        b = "https://" + b;
    }
    var NewHit = new Timer(a,b);
    Timers.push(NewHit);
    StopAll();
    loadthing();

});

//Load Button. Removed because it is done automatically. Un-comment to have it back. Plus un-comment the code below for LoadBtn.
//$(document).on('click', '#LoadBtn', function(e) {
//    for (var i =0; i < storedTimers.length; i++){
//       var NewHit = new Timer(storedTimers[i].name, storedTimers[i].url);
//        Timers.push(NewHit);
//    }
//   loadthing();
//
//});

$(document).on('click', '#SAllBtn', function(e) {
    StopAll();
});

$(document).on('click', '#AllBtn', function(e) {
    for (var i =0; i < Timers.length; i++){
        Timers[i].start(i);
    }
});

$(document).on('click', "[id^=StartBtn]", function(e) {
    var eid = e.target.id.substring(8);
    if(playtimer){
        Timers[eid].stop(eid);
        $('#TimerStatus' + eid ).css('background-color','red'); 
        playtimer = false;
        $('#StartBtn' + eid ).attr("src","http://i.imgur.com/G44S4bK.png");
    }else{

        Timers[eid].start(eid);
        $('#TimerStatus' + eid ).css('background-color','green');
        playtimer = true;
        $('#StartBtn' + eid ).attr("src","http://i.imgur.com/p1DmQwZ.png");
    }
});

//Seperate Stop Button. Removed because play now turns into a stop button once clicked. Un-comment to have it back. Plus un-comment the code below for StopBtn.
///$(document).on('click', "[id^=StopBtn]", function(e) {
//    var eid = e.target.id.substring(7);
//    Timers[eid].stop(eid);
//    $('#TimerStatus' + eid ).css('background-color','red');
//});

$(document).on('click', "[id^=DelBtn]", function(e) {
    var eid = e.target.id.substring(6);
    Timers.splice(eid,1);
    StopAll();
    loadthing();
});

$(window).unload(function() {
    localStorage["pander_timers"] = JSON.stringify(Timers);
});


function loadthing(){
    if( $('#tabe').length )        
    {
        var content = '<table id="tabe" width="760" align="center" cellspacing="0" cellpadding="0"><tbody><tr><td width="10" bgcolor="#7fb4cf" style="padding-left: 10px;"><img src="http://i.imgur.com/kmBEbFN.png" width="20" height="20" class="SettBtn" id="SettBtn" type="button"></img></td><td bgcolor="#7fb4cf" class="white_text_14_bold">PANDER</td><td bgcolor="#7fb4cf"><img  width="20" height="20" src="http://i.imgur.com/P6yjtwK.png></img></td>';
        content += '<td bgcolor="#7fb4cf"><img src="http://i.imgur.com/J3KyG10.png" width="20" height="20" class="ABtn" id="AddBtn" type="button"></img>';
        //content += '<td bgcolor="#7fb4cf"><button class="LBtn" id="LoadBtn" type="button">LOAD</button></td>';  --Removed Load Button
        content += '<img src="http://i.imgur.com/DbcQFTV.png" width="25" height="25" class="AllBtn" id="AllBtn" type="button"></img>';
        content += '<img src="http://i.imgur.com/ZFBJjUM.png" width="25" height="25" class="SAllBtn" id="SAllBtn" type="button"></img></td><tbody>';
        content += '</tr><tr><td width="100%"><table width="100%" class="metrics-table" ><tbody>';
        for (var i =0; i < Timers.length; i++){

            content +='<tr width="100%" class="odd"><td><input type="checkbox" id="HitChckBx'+ i +'" name="HitChckBx'+ i +'" value="HitChckBx'+ i +'"> </input></td>'
            content += '<td class="metrics-table-first-value">'+ Timers[i].name +'</td>';
            content +='<td><img src="http://i.imgur.com/G44S4bK.png" width="20" height="20" class="StartBtn'+ i +'" id="StartBtn'+ i +'" type="button"></img>';
            //content +='<img src="http://i.imgur.com/p1DmQwZ.png" width="20" height="20" class="StopBtn'+ i +'" id="StopBtn'+ i +'" type="button"></img>';  --Removed Stop Button
            content +='<img src="http://i.imgur.com/nUlYYUg.png" width="20" height="20"class="DelBtn'+ i +'" id="DelBtn'+ i +'" type="button"></img></td>';
            content +='<td class="TimerStatus'+ i +'" id="TimerStatus'+ i +'" bgcolor="#FF0000"></td>';
            content +='</tr>';

        }
        content += '</tbody></td></table><tr></td></tbody></table>';
        $('#tabe').replaceWith(content);

    }else{

        var content = '<table id="tabe" width="760" align="center" cellspacing="0" cellpadding="0"><tbody><tr><td width="10" bgcolor="#7fb4cf" style="padding-left: 10px;"><img src="http://i.imgur.com/kmBEbFN.png" width="20" height="20" class="SettBtn" id="SettBtn" type="button"></img></td><td bgcolor="#7fb4cf" class="white_text_14_bold">PANDER</td><td bgcolor="#7fb4cf"><img  width="20" height="20" src="http://i.imgur.com/P6yjtwK.png></img></td>';
        content += '<td bgcolor="#7fb4cf"><img src="http://i.imgur.com/J3KyG10.png" width="20" height="20" class="ABtn" id="AddBtn" type="button"></img>';
        //content += '<td bgcolor="#7fb4cf"><button class="LBtn" id="LoadBtn" type="button">LOAD</button></td>'; --Removed Load Button
        content += '<img src="http://i.imgur.com/DbcQFTV.png" width="25" height="25" class="AllBtn" id="AllBtn" type="button"></img>';
        content += '<img src="http://i.imgur.com/ZFBJjUM.png" width="25" height="25" class="SAllBtn" id="SAllBtn" type="button"></img></td><tbody>';
        content += '</tr><tr><td width="100%"><table width="100%" class="metrics-table" ><tbody>';
        for (var i =0; i < Timers.length; i++){

            content +='<tr width="100%" class="odd"><td><input type="checkbox" id="HitChckBx'+ i +'" name="HitChckBx'+ i +'" value="HitChckBx'+ i +'"> </input></td>' 
            content += '<td class="metrics-table-first-value">'+ Timers[i].name +'</td>';
            content +='<td><img src="http://i.imgur.com/G44S4bK.png" width="20" height="20" class="StartBtn'+ i +'" id="StartBtn'+ i +'" type="button"></img>';
            //content +='<img src="http://i.imgur.com/p1DmQwZ.png" width="20" height="20" class="StopBtn'+ i +'" id="StopBtn'+ i +'" type="button"></img>'; --Removed Stop Button
            content +='<img src="http://i.imgur.com/nUlYYUg.png" width="20" height="20"class="DelBtn'+ i +'" id="DelBtn'+ i +'" type="button"></img></td>';
            content +='<td class="TimerStatus'+ i +'" id="TimerStatus'+ i +'" bgcolor="#FF0000"></td>';
            content +='</tr>';

        }
        content += '</tbody></td></table><tr></td></tbody></table>';
        $('.footer_separator:first').before(content);
    }

}

function StopAll(){
    for (var i =0; i < Timers.length; i++){
        Timers[i].stop(i);
        $('#TimerStatus' + i ).css('background-color','red'); 
        playtimer = false;
        $('#StartBtn' + i ).attr("src","http://i.imgur.com/G44S4bK.png");
    }
}

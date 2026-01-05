// ==UserScript==
// @name         Instant Agarlist AutoRunner
// @namespace    http://tampermonkey.net/
// @version      1.6.6
// @description  Improving running in Instant - Agarlist.com
// @author       Tinsten
// @match        http://*agarlist.com/*
// @updateurl    chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/options.html#nav=071a34a7-8776-4729-aa15-c8727b78a195+editor
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21261/Instant%20Agarlist%20AutoRunner.user.js
// @updateURL https://update.greasyfork.org/scripts/21261/Instant%20Agarlist%20AutoRunner.meta.js
// ==/UserScript==
//Basic variables
var run = false;
var iSpeed = false;
var dSpeed = false;
var mode = "hold";
var skinChanger = false;
var skinSpeed = 500;
var i = 0;
//Auto runner
(function() {
    'use strict';
    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);
    function keydown(e) {
        
         if( e.keyCode === 82 && mode == "toggle" && !($("#input_box2").is(":focus")) ) {
        run = !run;
             
         }
         if (e.keyCode === 82 && mode == "hold") {
        run = true;
        }
        if(e.keyCode === 38) {
        iSpeed = true;
        dSpeed = false;
        }
        if(e.keyCode === 40) {
        dSpeed = true;
        iSpeed = false;
        }
        if(e.keyCode === 67 && !($("#input_box2").is(":focus"))) {
        skinChanger = !skinChanger;
        }
        if(e.keyCode === 27) {
        skinChanger = false;
        }
    }
    function keyup(e) {
        if(mode == "hold" && e.keyCode === 82) {
          
          run = false;
          
        }
        if(e.keyCode === 38) {
        dSpeed = false;
        iSpeed = false;
        }
        if(e.keyCode === 40) {
        dSpeed = false;
        iSpeed = false;
        }
    }
    setInterval(function (){
    $('#support').text(iSpeed + " " + dSpeed);
    if(iSpeed) {
    $(".speedInput").val(parseInt($(".speedInput").val()) + 1);
    console.log('Increased');
    }
        if(dSpeed) {
        if($('.speedInput').val() > 1) {
   $(".speedInput").val(parseInt($(".speedInput").val()) - 1);
    console.log('Decreased');
           }
        }
    }, 280);
    setInterval(function runner() {
        if( run && !($("#input_box2").is(":focus")) ) {
        $("body").trigger($.Event("keydown", { keyCode: 32}));
        $("body").trigger($.Event("keyup", { keyCode: 32}));
      }
    }, $('.speedInput').val() * 1000);
    //$('<div id="autorunner" class="msg" style="margin-left:110px;margin-top:50px;width:200px;"><img src="https://cdn3.iconfinder.com/data/icons/faticons/32/arrow-up-01-128.png" id="up" class="arrow" title="Increase time between each split"></img><br/><input type="number" title="The time between each split" class="speedInput" min="1" value="5" readonly /><br/><img src="https://cdn3.iconfinder.com/data/icons/faticons/32/arrow-down-01-128.png" title="Decrease time between each split" class="arrow" id="down"></img></div>').appendTo('#overlays2');
    $('.speedInput')
        .css('width','55px')
        .css('max-width','50px;')
        .css('text-align','center')
        .css('border-radius','20%')
        .css('padding','auto')
        .css('color','azure');
    $('.arrow')
        .css('height','40px')
        .css('width','40px');
    $('<div class="form-group"><input type="url" class="form-control" id="backgroundUrl" style="width:160px;font-size:77%;margin-right:20px;margin-bottom:20px;" value="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcR3JM3zRZ-f1Oz76DfpamD7eMQ2I4cXY4C_CcZ-j3Dhvry98nAQkw" placeholder="Custom Background Image Url"></div>').appendTo('#theming')
    .css('width','160px')
    
    .css('margin-right','20px')
    .css('float','right');
    //<button class="btn btn-url-check" style="width:160px;margin-right:20px;margin-bottom:20px;color:darkgray;" onclick="setBackground()">Set Background</button>
    setInterval(function() {
    $('#minimapNode').css('background-image',"url(" /* + $('#backgroundUrl').val()*/ + ")")
    .css('background-repeat','no-repeat')
    .css('background-size','200px 200px');
    },800);
    
})();

$('#up').click(function incSpeed(){
   $(".speedInput").val(parseInt($(".speedInput").val()) + 1);
    console.log('Increased');
});
$('#down').click(function decSpeed(){
 if($('.speedInput').val() > 1) {
   $(".speedInput").val(parseInt($(".speedInput").val()) - 1);
    console.log('Decreased');
      }
});
$('<div id="holdToggle"><select id="mode" value="hold" required onchange="changeMode()" style="width: 75px;height:37px;"><option value="hold">Hold</option><option value="toggle">Toggle</option></select></div>').appendTo('.settingsRow');

$('#mode').change(function(){ mode = $('#mode').val(); });



var skinList = ["http://imgur.com/vsdNeO3.png",
                "http://imgur.com/eAQcuSx.png",
                "http://imgur.com/9p2uQz7.png",
                "http://imgur.com/Y9yPfOt.png",
                "http://imgur.com/1o0PW4e.png",
                "http://imgur.com/2QpaEna.png",
                "http://imgur.com/a48GyJq.png",
                "http://imgur.com/xRtplUc.png",
                "http://imgur.com/a48GyJq.png",
                "http://imgur.com/2QpaEna.png",
                "http://imgur.com/1o0PW4e.png",
                "http://imgur.com/Y9yPfOt.png",
                "http://imgur.com/9p2uQz7.png",
                "http://imgur.com/eAQcuSx.png",
                "http://i.imgur.com/vsdNeO3.png"
               ];


//$('.content').append('<input style="border:1px solid grey;width:271px;" placeholder="Skin change speed in milliseconds" id="skin_speed" class="form-control" value="5000" type="number" min="300"/>');


setInterval(function(){
    if(skinChanger) {
    document.getElementById('skin_url').value = skinList[i];
    i++;
    if(i === skinList.length) {i = 0;}
    setNick(document.getElementById('nick').value);
          }
    }, skinSpeed);
//$('#overlays2').append('<h6 style="margin-left:500px">Agarlist Skin Changer by Tinsten</h6>')

$('#mode').val("hold").change();
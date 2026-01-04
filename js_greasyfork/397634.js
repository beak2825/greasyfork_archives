// ==UserScript==
// @name         BitrixCallUp
// @namespace    http://tampermonkey.net/
// @version      0.12.0.26.7
// @description  try to take over the world!
// @author       DIMASSS
// @match        https://stsgroup.bitrix24.ru/crm/contact*
// @require  https://code.jquery.com/jquery-3.4.1.js
// @require https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @grant        none

// @connect  hook.integromat.com
// @connect  *.integromat.com
// @connect  .integromat.com

// @downloadURL https://update.greasyfork.org/scripts/397634/BitrixCallUp.user.js
// @updateURL https://update.greasyfork.org/scripts/397634/BitrixCallUp.meta.js
// ==/UserScript==

(function() {
    'use strict';

var no_phone_mode = 0;

//проверка символа вначале номера, 0 не проверится
var numchck = "7";

    //nig
//var numchck = "2";
var prefix ="";
var send_hangup = 0;
var number = "";


var last_zalili_value = "undefined";

function check_zalili()
    {
    var element1212 = $("div.crm-alert-entity-counter-animate-wrap.crm-alert-entity-counter-origin");
    var el_content = element1212.innerText;
if (typeof(element1212) != 'undefined' && element1212 != null)
{
 if(last_zalili_value!=el_content  &&  el_content!="undefined" &&  el_content!="0")
 {
  last_zalili_value=el_content;
alert(last_zalili_value);

//new url is https://hook.integromat.com/ulp9i2wtixx5l2141uogevpoiwtjf3ja?title=my title&content=my content
  // $.get("https://hook.integromat.com/ulp9i2wtixx5l2141uogevpoiwtjf3ja?text="+last_zalili_value, function() {

  //  });
 }
}

    }
   // setInterval(check_zalili ,1000);

var previous_url = "";
var previous_email ="";
var attention_sound = 0;
var played_attention_sound = 0;
//ПОМЕНЯЙТЕ НА СВОЕГО ОПЕРАТОРА
var operator = "O5 O5";
//АВТОЗВОНОК ПРИ ОТКРЫТИИ КОНТАКТА


var autocall = 1;
var autooperator = 1;
//ДЛИТЕЛЬНОСТЬ ЗВОНКА, СЕК.

var var_for_count =0 ;
var DELAY = "28";
var email ="";
var timerId;
var button = document.createElement("button");
var button_hangup = document.createElement("button");
var button_op_change = document.createElement("button");
var Ebutton = document.createElement("button");
var audioElemen0t = document.createElement('audio');
    audioElemen0t.setAttribute('src', 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg');

    //var looker = /\S\n/g;
        var looker = /]/g;

      function email_get()
    {

email = "";
  var matchingElements = [];
  var allElements = document.getElementsByTagName('*');
  for (var i = 0, n = allElements.length; i < n; i++)
  {
    if (allElements[i].getAttribute("class") == "crm-entity-email")
    {
     email = allElements[i].textContent;
    }
  }

//if(email!="")
  //navigator.clipboard.writeText(email);


//alert(email);


    }

    function beep_short_0()
    {

    audioElemen0t.play();
    }

    function email_to_clip()
    {

if(email.length < 3 && no_phone_mode){
var audioElement235 = document.createElement('audio');
    audioElement235.setAttribute('src', 'https://actions.google.com/sounds/v1/impacts/trash_dropping_in_dumpster.ogg');
         audioElement235.play();
}
  navigator.clipboard.writeText(email);
    }

    function hangup()
    {

        var this_comment = "\n" + $(".crm-entity-widget-content-block-inner-comment").text() + "\n\n ";
        //this_comment = this_comment.trim().replace(/\s/g, '');
this_comment = this_comment.split(' ').join('');
        console.log(this_comment.split(' ').join(''));

//alert("\"" + this_comment +"\"\n"+ (this_comment.match(looker) || []) + " len: " + (this_comment.match(looker) || []).length);

    clearTimeout(timerId);

if (send_hangup) window.location.href ="hangup://";

//change_op();
email_to_clip();

        if (var_for_count > 1)
        {
            if(!played_attention_sound){
                played_attention_sound = 1;
                 var audioElement23 = document.createElement('audio');
    audioElement23.setAttribute('src', 'https://actions.google.com/sounds/v1/cartoon/cartoon_cowbell.ogg');
         audioElement23.play(); }
        }

    }

    function change_op()
    {


    console.log("поменяли");
            $('div.crm-widget-employee-container > span.crm-widget-employee-change:contains("Сменить")').click();

    $('div.bx-finder-box-item-t7-name:contains('+operator+')').click();



//:contains(контакт проработан)


//setTimeout(click_it, 2000);




function click_it() {
var my_obj = $("div.crm-entity-widget-content-block-inner-comment");
    if(my_obj.length)
    {
        console.log("my_obj.length" + my_obj.length);




fireClick(my_obj);




    my_obj.css("background-color", "yellow");
    //alert("good");
           }

}


    }

    function getPhoneAndCall()
    {
        played_attention_sound = 0;
attention_sound = 0;
     var matchingElements = [];
  var allElements = document.getElementsByTagName('*');

for (var i = 0, n = allElements.length; i < n; i++)
  {
    if (allElements[i].getAttribute("class") == "crm-entity-phone-number")
    {

     number = allElements[i].textContent;
        if(!isNaN(number) )
        break;

    }
  }



let to = parseInt("0");
  let current = parseInt(DELAY);
  timerId = setInterval(function() {
      //console.log("to: " + to + " current: " + current + " delay: " + DELAY);
    button.innerHTML = "Звоним (" + (DELAY - current) +")";
    if (current == to) {


if (attention_sound)
{
    played_attention_sound=1;
    var audioElement23 = document.createElement('audio');
    audioElement23.setAttribute('src', 'https://actions.google.com/sounds/v1/cartoon/cartoon_cowbell.ogg');
         audioElement23.play();

} else {
   var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
    audioElement.play();
}


      clearInterval(timerId);
        button.innerHTML = "Позвонили!";
    }
    current--;
  }, 1000);





			console.log("number that we call");
            console.log(number);

        var reso;
        if(numchck!="0"){
        reso = number.charAt(0);
if(numchck!="0"&&numchck==reso){
   window.location.href ="callto://"+prefix+number;
}

} if(numchck!="0"&&numchck!=reso) {
var audioElement23512 = document.createElement('audio');
    audioElement23512.setAttribute('src', 'https://actions.google.com/sounds/v1/impacts/trash_dropping_in_dumpster.ogg');
         audioElement23512.play();
}
        
     if(numchck=="0")
     window.location.href ="callto://"+prefix+number;
        var this_comment = "\r\n" + $(".crm-entity-widget-content-block-inner-comment").text() + "\r\n\r\n";
        //
var_for_count =0 ;
        var str_for_count="";
       // alert("comment " + this_comment);
        var arr = this_comment.split("\n");





        arr.forEach((element) => {
 // alert(element);
  if(element.length>3)
  {    var_for_count+=1;}
})



//alert("counted " +var_for_count);



        //this_comment = this_comment.split(' ').join('');

//alert("\"" + this_comment +"\"\n"+ (this_comment.match(looker) || []) + " len: " + (this_comment.match(looker) || []).length);
        //if (($(".crm-entity-widget-content-block-inner-comment").text().match(/]/g) || []).length > 1)
        if (var_for_count > 1)
        {
            attention_sound = 1;
                 var audioElement23 = document.createElement('audio');
    audioElement23.setAttribute('src', 'https://actions.google.com/sounds/v1/cartoon/cartoon_cowbell.ogg');
         audioElement23.play();
           }


    else {
if(numchck!="0"&&numchck==reso){
   var audioElement2 = document.createElement('audio');
    audioElement2.setAttribute('src', 'https://actions.google.com/sounds/v1/alarms/winding_alarm_clock.ogg');
    audioElement2.play();}

        if(numchck=="0"){
   var audioElement2d = document.createElement('audio');
    audioElement2d.setAttribute('src', 'https://actions.google.com/sounds/v1/alarms/winding_alarm_clock.ogg');
    audioElement2d.play();}


}
    }


document.onkeyup = function(e) {
    var key = e.keyCode;
//alert(key);
    if (e.ctrlKey && key == 32) //ctrl space - емаил
    {

        email_get();
email_to_clip();
        if(email.length < 3){

var audioElement2351 = document.createElement('audio');
    audioElement2351.setAttribute('src', 'https://actions.google.com/sounds/v1/impacts/trash_dropping_in_dumpster.ogg');
         audioElement2351.play();
            var win = window.open(url, '_blank');
}

    }
    if (e.ctrlKey && key == 81) //ctrl q - повесить трубку
    {
        hangup();
    }
        if (e.altKey && key == 84) //alt t - testing
    {
            $.get("https://hook.integromat.com/ulp9i2wtixx5l2141uogevpoiwtjf3ja?text=TAMPERMONKEY%20SUCCEEDED", function() {
     //   alert("GOOD");
    });
    }
}



    button.innerHTML = "Позвонить";
    button.style.margin = "0px 20px 0px 0px";
    button.style.width = "150px";
    button.style.height = "50px";


    button_hangup.innerHTML = "Отбой";
    button_hangup.style.margin = "0px 20px 0px 0px";
    button_hangup.style.width = "150px";
    button_hangup.style.height = "50px";

    Ebutton.innerHTML = "Email";
    Ebutton.style.margin = "0px 20px 0px 0px";
    Ebutton.style.width = "70px";
    Ebutton.style.height = "50px";




 if(!no_phone_mode)  {  waitForKeyElements ( "a.crm-entity-phone-number", test);}
    else {

     waitForKeyElements ( "a.crm-entity-email", no_phone);
    }


    //console.log("we here");



    function test(jNode)
    {
//sound_type = 0;
//$("div.crm-entity-widget-before-action[data-field-tag*='PHONE']").append(button);
 if (window.location.href != previous_url)
 {
//(temp.match(/is/g) || []).length



    previous_url =  window.location.href;

     $('.pagetitle').css({
    position: 'absolute'
});


setTimeout(email_get, 300);
if(autooperator == 1 ) setTimeout(change_op, 200);
if(autocall == 1) setTimeout(getPhoneAndCall, 200);




$("div.crm-entity-section.crm-entity-section-info[data-tab-id*='main']").dblclick(function() {
  hangup();
});


Ebutton.addEventListener ("click", function() {

                   var email = "";
         var matchingElements = [];
  var allElements = document.getElementsByTagName('*');
  for (var i = 0, n = allElements.length; i < n; i++)
  {
    if (allElements[i].getAttribute("class") == "crm-entity-email")
    {
     email = allElements[i].textContent;

    }
  }
  navigator.clipboard.writeText(email);
  });

button.addEventListener ("click", function() {
$('div.crm-widget-employee-container > span.crm-widget-employee-change:contains("Сменить")').click();

    $('div.bx-finder-box-item-t7-name:contains('+operator+')').click();

         var number = "";
         var matchingElements = [];
  var allElements = document.getElementsByTagName('*');
  for (var i = 0, n = allElements.length; i < n; i++)
  {
    if (allElements[i].getAttribute("class") == "crm-entity-phone-number")
    {
     number = allElements[i].textContent;
        alert(number);

    }
  }

window.location.href ="callto://"+prefix+number;

});
button_hangup.addEventListener ("click", function() {


clearTimeout(timerId);

window.location.href ="hangup://";

    $('div.crm-widget-employee-container > span.crm-widget-employee-change:contains("Сменить")').click();

    $('div.bx-finder-box-item-t7-name:contains('+operator+')').click();

});

button_op_change.addEventListener ("click", function() {
button.innerHTML = "Позвонили!";
//PlaySound("sound2");
$('div.crm-widget-employee-container > span.crm-widget-employee-change:contains("Сменить")').click();

$('div.bx-finder-box-item-t7-name:contains('+operator+')').click();



});



}
    }

function no_phone ()
    {
 if (window.location.href != previous_url)
 {
email_get();
          //$('.pagetitle').css({position: 'absolute'});
     previous_url = window.location.href;
change_op();

     setTimeout(email_to_clip, 300);
     setTimeout(beep_short_0,3000);
 }

    }


})();
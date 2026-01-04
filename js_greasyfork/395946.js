// ==UserScript==
// @name         Perevod
// @namespace    http://tampermonkey.net/
// @version      1.0.1.1
// @description  Перевод статусов списка заказов Megagroup.ru
// @author       DIMASSS
// @match        https://cp21.megagroup.ru/my/s3/data/menu/edit.php*
// @grant        none
// @require            https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant              GM_getValue
// @grant              GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/395946/Perevod.user.js
// @updateURL https://update.greasyfork.org/scripts/395946/Perevod.meta.js
// ==/UserScript==

(function() {
    'use strict';





var crawl = localStorage.getItem('perevod_is_working');

console.log("-----SCRIPT START-------");

//------------------waitForKeyElements------------------
    /*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
      that detects and handles AJAXed content.

      Usage example:

          waitForKeyElements (
              "div.comments"
              , commentCallbackFunction
          );

          //--- Page-specific function to do what we want when the node is found.
          function commentCallbackFunction (jNode) {
              jNode.text ("This comment changed by waitForKeyElements().");
          }

      IMPORTANT: This function requires your script to have loaded jQuery.
  */
  function waitForKeyElements(
    selectorTxt /* Required: The jQuery selector string that
                          specifies the desired element(s).
                      */,
    actionFunction /* Required: The code to run when elements are
                          found. It is passed a jNode to the matched
                          element.
                      */,
    bWaitOnce /* Optional: If false, will continue to scan for
                          new elements even after the first match is
                          found.
                      */,
    iframeSelector /* Optional: If set, identifies the iframe to
                          search.
                      */
  ) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined") targetNodes = $(selectorTxt);
    else
      targetNodes = $(iframeSelector)
        .contents()
        .find(selectorTxt);

    if (targetNodes && targetNodes.length > 0) {
      btargetsFound = true;
      /*--- Found target node(s).  Go through each and act if they
              are new.
          */
      targetNodes.each(function() {
        var jThis = $(this);
        var alreadyFound = jThis.data("alreadyFound") || false;

        if (!alreadyFound) {
          //--- Call the payload function.
          var cancelFound = actionFunction(jThis);
          if (cancelFound) btargetsFound = false;
          else jThis.data("alreadyFound", true);
        }
      });
    } else {
      btargetsFound = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj = waitForKeyElements.controlObj || {};
    var controlKey = selectorTxt.replace(/[^\w]/g, "_");
    var timeControl = controlObj[controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound && bWaitOnce && timeControl) {
      //--- The only condition where we need to clear the timer.
      clearInterval(timeControl);
      delete controlObj[controlKey];
    } else {
      //--- Set a timer, if needed.
      if (!timeControl) {
        timeControl = setInterval(function() {
          waitForKeyElements(
            selectorTxt,
            actionFunction,
            bWaitOnce,
            iframeSelector
          );
        }, 300);
        controlObj[controlKey] = timeControl;
      }
    }
    waitForKeyElements.controlObj = controlObj;
  }
//------------------/waitForKeyElements------------------

//------------------Navigate------------------
function Navigate (text)
{
       // text="888888888888888";
        console.log('-search go: ' + text);
//alert(window.location.href);
        var url=window.location.href;
if (url.indexOf("search_text") === -1)
{
url = [url.slice(0, url.indexOf("order_date_from")-1), "&search_text="+ text, url.slice(url.indexOf("order_date_from")-1)].join('');
}
        else
        {
url=url.replace(/(search_text)(.+?)(?=order_date_from)/, "$1="+text+"&");

        }
        //url=url.replace(/search_text=.*&order_date_from/, 'search_text=' + text + '&order_date_from')
       // alert(url);
console.log('searching: ' + url);
        window.location.href = url;
   // window.location.assign(url);
        document.location.reload(true);


//exit();

    }
//------------------/Navigate------------------

//------------------eventFire------------------
function eventFire(el, etype){
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}
//------------------/eventFire------------------


//------------------set_status------------------
function set_status(status_to,numb)
{
//--------------

console.log("params: "+status_to+", "+numb)

var items;
//document.querySelector("#shop2_orders_container")

items = document.getElementsByClassName("view order-number");


var index;
for (var j = 0; j < items.length; j++) {
console.log("ITEMS textContent ");
var temp = items[j].textContent.trim();
temp = temp.split("(")[0];
temp = temp.trim();

console.log(temp );
console.log("comparing -"+temp+"- with -"+numb+'-');
if (temp == numb)
{
index=j;
}



}
    console.log("index is " + index);

if (index == undefined)
{
    return 'NOT_found';
//alert("Критическая ошибка! index == undefined заказ " + numb + "НЕ переведён!!!!!!");
   /*  crawl = '0';
     localStorage.setItem('perevod_is_working','2');
     document.location.reload(true);*/
}


//-----------------
//console.log("searching" + status_to);


var textToFind = status_to;
var result ;
var dd = document.querySelectorAll("#order_status_style");
//var dd = document.getElementById('order_status_style');

//alert("danger zone 1");
    if (dd[index-1] != null)
    {
for (var i = 0; i < dd[index-1].options.length; i++) {
    if (dd[index-1].options[i].text === textToFind) {
        dd[index-1].selectedIndex = i;
        break;
    }
}
//alert("danger zone 2");
        var element = document.querySelectorAll("#order_status_style");
//alert(element.length);
		//var element = document.querySelectorAll("#order_status_style");
        if ("createEvent" in document) {
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("change", false, true);
	//RETURN ME!!!!
    element[index-1].dispatchEvent(evt);
	//element[index].dispatchEvent(evt);

}
else {
//RETURN ME!!!!
  element[index-1].fireEvent("onchange");
  //element[index].fireEvent("onchange");
   }
//alert("success");
    result="good";
    }
    else result="NOT_found";
console.log("result" + result);

return result;
    }
//------------------/set_status------------------
//------------------msToTime------------------
function msToTime(duration,short=0) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

if(short==0) return hours + " ч. " + minutes + " мин. " + seconds + " сек. ";
else return seconds + " сек. " + milliseconds + " мил.";
}
//------------------/msToTime------------------
//JUST FINISHED
if (crawl == '2')
{
//DO SMTH WITH RESULTS
crawl = 0;
var src_nums_array = localStorage.getItem('perevod_nomera_src').split('\n');
var tmp = localStorage.getItem('res_array');
//console.log(tmp);
if (tmp.charAt(0) == ',')
{


tmp = tmp.slice(0, 0) + tmp.slice(1);

}

var final_results_array =tmp.split(',');
var i;
var concatenated_result = "";
var good = 0;
var not_f = 0;
var undef = 0;


for (i=0;i<src_nums_array.length; i++)
{
if (final_results_array[i] == 'good') good++;
if (final_results_array[i] == 'NOT_found') not_f++;
if (final_results_array[i] == 'undefined') undef++;

concatenated_result+=src_nums_array[i] + ": " + final_results_array[i]+"\r\n";

}
//alert(concatenated_result);
//console.log(concatenated_result);
var fstart_date = localStorage.getItem('start_date');

var finish_gmc = new GM_configStruct(
{
  'id': 'RESULTS', // The id used for this instance of finish_gmc
    'title': 'РЕЗУЛЬТАТЫ за ' + msToTime( new Date().getTime() - fstart_date) + ": good(" + good + "), notf(" + not_f +"), undef(" + undef +")", // Panel Title
  'fields': // Fields object
  {
    'from': // This is the id of the field
    {'labelPos': 'above',
      'label': 'Переводили ИЗ статуса', // Appears next to field
      'type': 'text', // Makes this setting a text field

      'default': 'ТРЕК ПРИСВОЕН' // Default value if user doesn't change it
    },
      'to': // This is the id of the field
    {'labelPos': 'above',
      'label': 'Переводили В статус', // Appears next to field

      'type': 'text', // Makes this setting a text field
      'default': 'ПОЛУЧЕН' // Default value if user doesn't change it
    },
      'nomera':
    {
      'label': 'Результаты перевода',
      'type': 'textarea',
      'default': '12312'
    //  ,'title': 'Введите номера заказов каждый с новой строки'

    }
  }


    ,'events': {
    'init': function() {
this.set('from', localStorage.getItem('perevod_from'));
this.set('to', localStorage.getItem('perevod_to'));
this.set('nomera', concatenated_result);


        },
    'close': function(){
localStorage.setItem('perevod_is_working','0');
crawl = 0;
    }
    }
});
finish_gmc.open();


//uncomment if fails
//final_results_array = [];
//localStorage.setItem('res_array', "");



//alert("res_array:" + final_results_array);
//alert("localStorage res_array:" + localStorage.getItem('res_array'));
}


//MAKE CRAWL
if (crawl == '1')
{console.log("We are Working");

//INIT VALS BEFORE FOUND ELEMENT
var res_array = localStorage.getItem('res_array', res_array).split(",");
var nums_array = localStorage.getItem('perevod_nomera').split("\n");
var status_to = localStorage.getItem('perevod_to');
var current = nums_array.shift();

var time_label_text = "";

if(res_array.length == '1') //this is first one
{


//var today = ;
//var time =  + ":" +  + ":" + ;
localStorage.setItem('start_date', new Date().getTime());
//alert(new Date().getTime() + " set");
/*localStorage.setItem('start_minutes',today.getMinutes());
localStorage.setItem('start_seconds',today.getSeconds());
localStorage.setItem('start_mseconds',today.getMilliseconds()); */
}

//TIME CALCULATION
 if (res_array.length >= '2') //means 2 or more, divide current time and started.
{


var start_date = localStorage.getItem('start_date');
var for_one = Math.abs( ( new Date().getTime() - start_date ) / (res_array.length-1) );

time_label_text = "Осталось: " + msToTime(for_one*nums_array.length) + ", сред. " + msToTime(for_one,1) + ", прошло " + msToTime( new Date().getTime() - start_date);
$('body').before(time_label_text).show();
}
//






 //STOP BUTTON
if (!$('#perevod-settings-test').length > 0) {
  //

    var btn_CANCEL = document.createElement("button");
    btn_CANCEL.innerHTML = "CANCEL";
	btn_CANCEL.title = "Нажмите чтобы CANCEL.";
    btn_CANCEL.className = "s3-btn without-margin";
    btn_CANCEL.id="perevod-CANCEL";
    btn_CANCEL.style.margin = "0px 20px 0px 0px";
    $("body").before(btn_CANCEL);
    btn_CANCEL.addEventListener("click", function () {


// LOOP STOP

crawl = 2;
localStorage.setItem('perevod_is_working','2');
document.location.reload(true);

});
}

/* $.when(Preloader.hide()).done({
    // the code here will be executed when all four ajax requests resolve.
    // a1, a2, a3 and a4 are lists of length 3 containing the response text,
    // status, and jqXHR object for each of the four ajax calls respectively.
	let_work

});

setTimeout(function () {


if (newState == -1) {
alert('VIDEO HAS STOPPED');
}


}, 5000);



*/
/* setTimeout(function () {


}, 1000); *///#filter_psp
waitForKeyElements(".s3-preloader-hide", let_work);
/*$( document ).ajaxComplete(function(event,xhr,settings) {
alert(Object.values(settings));

});
 */


// window.addEventListener('load', (event) => {

// });


function let_work()
{
//alert("its hidden");
console.log("-all loaded, continuing");


//if (res_array == null) { res_array = "[]";}



res_array.push(set_status(status_to,current));

localStorage.setItem('res_array', res_array.join(','));


console.log("--set_status worked for first elem");

localStorage.setItem('perevod_nomera',nums_array.join('\n'));


 if (nums_array.length > 0)
{
Navigate (nums_array[0]);
}
else {

//alert("nums_array.length > 0\r\n"+nums_array);
     crawl = '0';
     localStorage.setItem('perevod_is_working','2');
     document.location.reload(true);

     }

 }


}



//MAKE INIT
if (crawl == '0' || crawl == 'NULL' || crawl == null)
{console.log("We are Not working");


var settings_gmc = new GM_configStruct(
{
  'id': 'MyConfig', // The id used for this instance of GM_config
    'title': 'Настройки перевода статусов', // Panel Title
  'fields': // Fields object
  {
    'from': // This is the id of the field
    {'labelPos': 'above',
      'label': 'ИЗ статуса', // Appears next to field
      'type': 'text', // Makes this setting a text field

      'default': 'ТРЕК ПРИСВОЕН' // Default value if user doesn't change it
    },
      'to': // This is the id of the field
    {'labelPos': 'above',
      'label': 'В статус', // Appears next to field

      'type': 'text', // Makes this setting a text field
      'default': 'ПОЛУЧЕН' // Default value if user doesn't change it
    },
      'nomera':
    {
      'label': 'Номера заказов',
      'type': 'textarea',
      'default': 'some text'
    //  ,'title': 'Введите номера заказов каждый с новой строки'

    }
  }


    ,'events': {
        'init': function() {
            localStorage.setItem('res_array', '[]');
            var f_from = localStorage.getItem('perevod_from');
            if(f_from == null) f_from= "";

            var f_to = localStorage.getItem('perevod_to');
            if(f_to == null) f_to= "";
this.set('from', f_from);
this.set('to', f_to);

var nums_string_1 = localStorage.getItem('perevod_nomera');
var nums_string;
            if(nums_string_1 == null)
            {nums_string= "[]";
            }
            else
            {nums_string = localStorage.getItem('perevod_nomera').replace(',' , '\n');
            }






this.set('nomera', localStorage.getItem('perevod_nomera_src'));
//this.set('nomera', "32006");
        },
    'save': function(){





localStorage.setItem('perevod_from', this.get('from'));
localStorage.setItem('perevod_to', this.get('to'));
localStorage.setItem('res_array', "");

//var str = '\r\n' + GM_config.get('nomera') + '\r\n';
        //var str = GM_config.get('nomera');
//var array = str.split("\n");
localStorage.setItem('perevod_nomera', this.get('nomera'));
localStorage.setItem('perevod_nomera_src', this.get('nomera'));

//alert("perevod_nomera set like" + this.get('nomera'));

    }
    } /* */
});
//SETTINGS BUTTON
    if (!$('#perevod-settings').length > 0) {
  //

    var btn_open_settings = document.createElement("button");
    btn_open_settings.innerHTML = "Установки перевода";
	btn_open_settings.title = "Нажмите чтобы устанвить параметры.";
    btn_open_settings.className = "s3-btn without-margin";
    btn_open_settings.id="perevod-settings";
    btn_open_settings.style.margin = "0px 20px 0px 0px";
    $("body").before(btn_open_settings);
    btn_open_settings.addEventListener("click", function () {
    settings_gmc.open();


});
}

//START BUTTON
    if (!$('#perevod-start').length > 0) {


    var btn_start = document.createElement("button");
    btn_start.innerHTML = "start";
	btn_start.title = "Нажмите чтобы поехать.";
    btn_start.className = "s3-btn without-margin";
    btn_start.id="perevod-start";
    btn_start.style.margin = "0px 20px 0px 0px";
    $("body").before(btn_start);
    btn_start.addEventListener("click", function () {


var res_array = ['1','2'];
res_array.length = 0;
localStorage.setItem('res_array', res_array.join(','));


localStorage.setItem('perevod_nomera', settings_gmc.get('nomera'));

// LOOP
 localStorage.setItem('perevod_is_working','1');

var str = settings_gmc.get('nomera');
var array = str.split("\n");
console.log("starting! search ("+ array[0]+") ");
Navigate(array[0]);


});
}
//TEST BUTTON
    var btn_test = document.createElement("button");
    btn_test.innerHTML = "test";
	btn_test.title = "Нажмите чтобы поехать.";
    btn_test.className = "s3-btn without-margin";
    btn_test.id="perevod-test";
    btn_test.style.margin = "0px 20px 0px 0px";
   // $("body").before(btn_test);
    btn_test.addEventListener("click", function () {

//TESTCODE





// END TESTCODE



});

}



})();
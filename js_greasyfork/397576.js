// ==UserScript==
// @name         getTimezones
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       DIMASSS
// @match        https://dadata.ru/*
// @grant        none
// @require  https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require            https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @grant              GM_getValue
// @grant              GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/397576/getTimezones.user.js
// @updateURL https://update.greasyfork.org/scripts/397576/getTimezones.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //localStorage.setItem('power',"off");
  var POWER = localStorage.getItem('power');
  var finished = localStorage.getItem('finished');
  
  if (finished == "1") {
      
    
  
  localStorage.setItem('finished',"0");

  var finish_gmc = new GM_configStruct(
    {
      'id': 'finish_id', // The id used for this instance of GM_config
        'title': 'Результаты поиска', // Panel Title
      'fields': // Fields object
      {'cities_utcs_list':
        {
          'label': 'Список временных зон',
          'type': 'textarea',
          'default': ''
    
        }
      }
    
    
        ,'events': {
            'init': function() {
                this.set('cities_utcs_list',JSON.parse(localStorage.getItem("cities_utcs")).join("\n"));

            },
        'save': function(){
            finish_gmc.close();
        }
        } 
    });

    finish_gmc.open();
}


  if (POWER == "null") POWER="off";
  
  console.log(POWER);
  
  
  //alert(POWER);
  if (POWER == "off" || POWER == "null")
  {
    //alert("OFF");
    
    var settings_gmc = new GM_configStruct(
      {
        'id': 'MyConfig', // The id used for this instance of GM_config
          'title': 'Настройки поиска', // Panel Title
        'fields': // Fields object
        {'cities_names_list':
          {
            'label': 'Список городов',
            'type': 'textarea',
            'default': 'Абакан\r\nАзов\r\nАлександров\r\nАлексин\r\nАльметьевск\r\nАнапа\r\n'
      
          }
        }
      
      
          ,'events': {
              'init': function() {
              //  let x = localStorage.getItem('cities_names_list').split("\n");
  
               // alert(x[0]);
  
              },
          'save': function(){
  
            localStorage.setItem("cities_names_arr", JSON.stringify(this.get('cities_names_list').split("\n")));
            var arr = [];
            localStorage.setItem("cities_utcs", JSON.stringify(arr));
            
            localStorage.setItem("index", 0);
            settings_gmc.close();
          }
          } 
      });
  
    //settings button
    var btn_open_settings = document.createElement("button");
    btn_open_settings.innerHTML = "Установки поиска";
    btn_open_settings.title = "Нажмите чтобы установить параметры.";
    //btn_open_settings.className = "s3-btn without-margin";
    //btn_open_settings.id="perevod-settings";
    btn_open_settings.style.margin = "0px 20px 0px 0px";
    $("body").before(btn_open_settings);
    btn_open_settings.addEventListener("click", function () {
  
      
    settings_gmc.open();
  
  
   });
  
  //go button
  var btn_test = document.createElement("button");
  btn_test.innerHTML = "Go";
  btn_test.title = "Нажмите чтобы поехать.";
  btn_test.className = "s3-btn without-margin";
  btn_test.id="perevod-test";
  btn_test.style.margin = "0px 20px 0px 0px";
  $("body").before(btn_test);
  btn_test.addEventListener("click", function () {
  
    localStorage.setItem("cities_names_arr", JSON.stringify(settings_gmc.get('cities_names_list').split("\n")));
    var arr = [];
    localStorage.setItem("cities_utcs", JSON.stringify(arr));
    
    localStorage.setItem("index", 0);
  
    localStorage.setItem('power',"on");
  //TESTCODE
  
  //document.querySelector("#id_address").value ="Волжский";
  //document.querySelector("#process-person-form > table > tbody > tr:nth-child(6) > td > button").click();
  
  window.location.assign("https://dadata.ru/");
  
  // END TESTCODE
  });
  
  }
  
  if (POWER == "on")
  {
    //alert(POWER);
    var index = parseInt(localStorage.getItem("index"));
    var storedNames = JSON.parse(localStorage.getItem("cities_names_arr"));
    var cities_utcs = JSON.parse(localStorage.getItem("cities_utcs"));
  
   
    //var storedNames = JSON.parse(localStorage.getItem("names"));
    console.log("index " + index + "storedNames " + storedNames[index]); 
    
    
    //settings button
    var btn_cancel = document.createElement("button");
    btn_cancel.innerHTML = "ВЫКЛючить";
    btn_cancel.title = "Нажмите чтобы остановить выполнение.";
    //btn_open_settings.className = "s3-btn without-margin";
    //btn_open_settings.id="perevod-settings";
    btn_cancel.style.margin = "0px 20px 0px 0px";
    $("body").before(btn_cancel);
    btn_cancel.addEventListener("click", function () {
  
      
      localStorage.setItem('power',"off");
  
      window.location.assign("https://dadata.ru/");
      // window.location.assign(url);
      //document.location.reload(true);
  
   });
  
  
  if (document.URL.includes("clean/simple"))
  {//alert("waiting");
    
  waitForKeyElements (
    ".announcement"
    , setTimeTimeTime
  ); 

  function setTimeTimeTime () {
  
    console.log("timeout set.");
    setTimeout("window.location.assign('https://dadata.ru/');", 10000);
  
  }


    waitForKeyElements (
      "#processing_result_address"
      , writeTimeZone
  );
  } 
  else {
    
  
  console.log("index: " + index + " storedNames: " + storedNames[index]);
  


 


  waitForKeyElements (
    ".button--red"
    , press_button
  );
  

  

  
  
  function press_button ()
  {
     // alert(storedNames+" + " + cities_utcs);
    document.querySelector("#id_address").value = storedNames[index];
  
    setTimeout("document.querySelector('#process-person-form > table > tbody > tr:nth-child(6) > td > button').click();", 2000);
    
  }
  
  
  } 
  
  function writeTimeZone ()
  {
      var timezone = getTimezone();
      var city = storedNames[index];
    cities_utcs.push(timezone);

    index+=1;
    while (storedNames[index] == city) {

if (storedNames.length-1 > index)
{   cities_utcs.push(timezone);
    console.log("adding more of " + timezone + " to " + storedNames[index]);
    index+=1;
} else break;

      }
      localStorage.setItem("index", index);
      localStorage.setItem("cities_utcs", JSON.stringify(cities_utcs));
  
  
    if(storedNames.length-1 < index)
    {
        localStorage.setItem('power',"off");
  
        localStorage.setItem('finished',"1");
      }

    window.location.assign("https://dadata.ru/");
   //window.location.assign(url);
       //document.location.reload(true);
       
  }
  
    
  
    
  }
  
  
  
  
      
  
  
      
  function getTimezone() {
  var timezone = "not_f";
    for (let index = 0; index < document.getElementById("processing_result_address").rows.length; index++) {
        

        if (document.getElementById("processing_result_address").rows.item(index).innerHTML.includes("Часовой пояс")) {
            timezone = document.getElementById("processing_result_address").rows[index].cells[1].innerHTML.trim();
            timezone=parseInt(timezone.replace("UTC",""));
            timezone-=2;
            //учли ригу


          }

        if (document.getElementById("processing_result_address").rows.item(index).innerHTML.includes("Коды качества")) {
            if(document.getElementById("processing_result_address").rows[index].cells[1].innerHTML.includes("На ручную проверку"))
            {
                index = document.getElementById("processing_result_address").rows.length;
            }
          }



            
            
          }
  return timezone;
  
  
  
        }
  
  }
  )();
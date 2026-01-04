// ==UserScript==
// @name         X_Order
// @namespace    http://tampermonkey.net/
// @version      0.4.3
// @description  try to take over the world!
// @author       DIMASS
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @match        https://mail.yandex.ru/*
// @match        https://svparfum.com/*
// @match        http://svparfum.com/*
// @require            https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant              GM_getValue
// @grant              GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/397253/X_Order.user.js
// @updateURL https://update.greasyfork.org/scripts/397253/X_Order.meta.js
// ==/UserScript==

(function() {
  'use strict';

//-----------------vars
var STEP;

// папка в которой находятся новые письма
var mailbox_URL = "https://mail.yandex.ru/?uid=716173348#folder/7"; 
//действие очистки корзины
var clean_cart_URL = "http://svparfum.com/magazin?mode=cart&action=cleanup"; 
//это получается в адресной строе после перехода на страницу очистки корзины
var cart_URL = "https://svparfum.com/magazin/cart"; 
//задержка, мсек
var delay = 60000;
var end_date=GM_getValue('end_date', 0);
//var skipped=parseInt(0);
var timedebug = "";

var skipped=parseInt(GM_getValue('skipped',0));
var is_product_added = GM_getValue('is_product_added',0);
var POWER = GM_getValue('POWER',"OFF");
var button_all = document.createElement("button");

var URL_tag = "Ссылка на страницу товара: ";
var FIO_tag = "ФИО: ";
var TEL_tag = "Телефон: ";
var ADRES_tag = "Адрес: ";


var URL = "";
var FIO = "";
var TEL = "";
var ADRES = "";




//--------------------

var info_panel = document.createElement("p");
document.body.before(info_panel);
decide_what_to_do();


var power_switch_button = document.createElement("button");
if (POWER == "ON") power_switch_button.innerHTML = 'ВЫКЛ'; else power_switch_button.innerHTML = 'ВКЛ';
document.body.before(power_switch_button);
power_switch_button.addEventListener ("click", function() { 
  GM_setValue('is_product_added',0);
  if(POWER == "ON") GM_setValue('POWER',"OFF");
  else GM_setValue('POWER',"ON");
document.location.reload(true);
});






function output(some_text )
{
  //alert(some_text);
    info_panel.innerHTML = some_text;

}

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



  
function decide_what_to_do()
{
//info_panel("страница " + window.location.href +" готова");


URL = GM_getValue('OURL',"");

if(document.title.includes("Яндекс.Почта")) STEP = "get letter";

if( document.getElementById("order-print")!= null) STEP = "move to inbox";

if (window.location.href.includes("svparfum.com/magazin/cart") && is_product_added == 1) STEP = "MAKE_ORDER";

if (window.location.href == URL) STEP = "MOVE_TO_CART";

if (window.location.href.includes("svparfum.com/magazin/cart") && is_product_added == 0) STEP = "MOVE_TO_PRODUCT";

GM_setValue("STEP",STEP);
//alert("is_product_added: " + is_product_added + " STEP " + STEP);
info_panel.innerHTML = STEP;
return STEP;
}



//---------action-section
if (POWER == "ON")
{
  //output("POWER_ON");

if (STEP == "get letter")
{

  var time_allowed = 0;
  //композитный таймер, который проверяет каждые 3 сек. пришло ли время и есть ли нужный элемент на странице,
  // и запускает navigate_to_letter
  const timer1 = setInterval(function(){ 
  
  if ((new Date().getTime() - end_date ) > delay) 
  {timedebug = "time Allowed: now is " + new Date().getTime() + " ended at " + end_date + " diff " + (new Date().getTime() - end_date ) + " > " + delay;
    
    
  time_allowed = 1;
  clearTimeout(timer1);
  }
  
  else {
    output("Скрипт работает. Ждём таймаут (" + delay / 1000 + "). Осталось  " + ( (delay -(new Date().getTime() - end_date )) / 1000  ) + " сек ") ;
    timedebug = "time NOT allowed: now is " + new Date().getTime() + " ended at " + end_date + " diff " + (new Date().getTime() - end_date ) + " < " + delay;
    }
  console.log(timedebug);
  
  
  if ( time_allowed == 1 ) 
  {	
      info_panel.innerHTML = "Скрипт работает. Пришло время добавлять, но писем нет. Ждём.";
  console.log("waiting for .state_toRead");
  waitForKeyElements(".state_toRead", navigate_to_letter, true);


  function navigate_to_letter (jNode) {

    //output("заходим в письмо");
    jNode.parent().click();
    waitForKeyElements(".mail-Message-Body-Content", take_contents);
    
    
    }

    function take_contents(jNode)
    {
    
    console.log("taking the contents");
    var x1 = document.getElementsByClassName("mail-Message-Body-Content");
    
    console.log("starting to count");
    var message = "";
    for (let element of x1) {
    if(typeof element.outerText !== "undefined") {
      console.log(element.outerText);
      
      message = element.outerText.split("\n");}
    }
    
    
    
    //---------------------PARCING CONTENTS
    
    URL = "";
    FIO = "";
    TEL = "";
    ADRES = "";
    
    for (let element of message)
    {
      /**/
    
      
      
      
    if (element.includes(URL_tag))  URL = element.replace(URL_tag,''); 
    if (element.includes(FIO_tag))  FIO = element.replace(FIO_tag,''); 
    if (element.includes(TEL_tag))  TEL = element.replace(TEL_tag,''); 
    if (element.includes(ADRES_tag))  ADRES = element.replace(ADRES_tag,''); 
        
    
      
      
    }
    
    if (URL != "" && FIO != "" && TEL != "")	{
      
    
    GM_setValue('OURL',URL);
    GM_setValue('OFIO',FIO);
    GM_setValue('OTEL',TEL);
    GM_setValue('OADRES',ADRES);
    
    
    
      console.log("ALL Necessary data fields gathered");
     
      
      
      
      output("взяли всё из письма, очищаем корзину");
      window.location.assign(clean_cart_URL);
      //window.location.href = "http://svparfum.com/magazin?mode=cart&action=cleanup";
      //document.location.reload(true);
    }
    else {
      alert("Не вышло собрать все необходимые поля данных. Проверьте правильность указания названий полей письма.");
      
    }
    
    
    }


  }
  
  
   }, 1000);

}

if (STEP == "MOVE_TO_PRODUCT") window.location.assign(GM_getValue('OURL'));

if (STEP == "MOVE_TO_CART") {
  
  var buttons = document.getElementsByClassName("shop-btn buy shop-buy-btn");

  for (let element of buttons) {
  if(typeof element.outerText !== "undefined" && element.outerText=="Добавить в корзину") {
  
      GM_setValue('is_product_added',1);
      //setTimeout("", 1000);
      element.click();
    
     
    //setTimeout("", 3000);
    window.location.assign(cart_URL);
    
    }
  }

}

if (STEP == "MAKE_ORDER")
{

waitForKeyElements(".shop2-warning", skipping);
function skipping ()
{
  GM_setValue('is_product_added',0);
  STEP = "get letter";
  window.location.assign(inbox_URL);
}

if(document.getElementById("user_fio") == null) 
{

  if(skipped >= 3)
  {GM_setValue('skipped',0);
    console.log("skipped " + skipped);
    STEP = "get letter";
    window.location.assign(URL); 
  }
  skipped+=1;
  GM_setValue('skipped',skipped);
  console.log("WE are making order! Wanted to enter our credentials, but there is no such fields. is_product_added = " + is_product_added + "skipped " + skipped);
  setTimeout("document.location.reload(true);", 5000);
}
else {
  URL = GM_getValue('OURL',"");
  //alert("cookie_Url "+ URL);
  FIO = GM_getValue('OFIO',"");
  TEL = GM_getValue('OTEL',"");
  ADRES = GM_getValue('OADRES',"");


	//add_to_log("мы в корзине в которой товар. оформляемся");
		let textArea = document.getElementsByName("1171606[0]");
		if (ADRES == "") ADRES = "000000 СПРОСИТЬ";
		textArea[0].value = ADRES;
		
		let fio_field = document.getElementById("user_fio");
		fio_field.value = FIO;
		
		let tel_field = document.getElementById("user_phone");
		tel_field.value = TEL;
		
		let email_field = document.getElementById("user_email");
		email_field.value = "dimas-bot@ya.ru";
		
		
		let check = document.getElementsByName("order[personal_data]");
		check[0].checked = true;
		
		
		
var buttons_g = document.getElementsByClassName("g-button");
for (let element of buttons_g) {
	
if(typeof element.outerText !== "undefined" && element.outerText=="Оформить заказ") {
	//is_product_added = 2;
	GM_getValue('is_product_added',2);
//	add_to_log("всё заполнили жмём оформить");
	element.click();
	
	}
}
}
}

if (STEP == "move to inbox")
{
  GM_setValue('is_product_added',0);
  GM_setValue('end_date', new Date().getTime());
  //add_to_log("установили время конца, идём в ящик");
  window.location.assign(mailbox_URL);
  
}

}




})();
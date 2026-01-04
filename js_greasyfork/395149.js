// ==UserScript==
// @name         Megagroup Operate
// @namespace    http://tampermonkey.net/
// @version      2.2.8.5
// @description  Интеграция с Postiko: информация по отправлениям, отправка смс.
// @author       DIMASSS
// @require  https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require  https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @grant    GM_xmlhttpRequest
// @connect  xn----8sb0bfecee0b2g.xn--p1ai
// @connect  on-free-server.000webhostapp.com
// @connect  hook.integromat.com
// @connect  *.integromat.com
// @connect  .integromat.com
// @match    https://cp21.megagroup.ru/my/s3/data/menu/edit.php*
 
// @downloadURL https://update.greasyfork.org/scripts/395149/Megagroup%20Operate.user.js
// @updateURL https://update.greasyfork.org/scripts/395149/Megagroup%20Operate.meta.js
// ==/UserScript==
 
/*https://www.integromat.com/
как я прикрутил беседу в чат бот для скайпа:
1 зайти на https://web.skype.com/
2 открыть беседу и открыть консоль разработчика
3 написать сообщение в беседу
4 увидеть урл с форматом https://client-s.gateway.messenger.live.com/v1/users/ME/conversations/19%3A85e6e20fe663470dbaa72393fa08a4e7%40thread.skype/messages?x-ecs-etag=%22bXr2Wuenfg%2B0xD8%2FwzvhdgtLV9z4%2FMiUhM7fz8Ez94I%3D%22
5 декодировать часть >19%3A85e6e20fe663470dbaa72393fa08a4e7%40thread.skype<
на https://www.urldecoder.org/
6 валидный Id выглядит так 19:85e6e20fe663470dbaa72393fa08a4e7@thread.skype
7. бот должен быть в конфе.
 
*/
 
 
 
 
 
 
 
(function() {
  "use strict";
  var debug = 0;
 
 
 
 
 
 
 
function send_to_skype()
    {
 
if(debug)  console.log("Greetings from send_to_skype(message)! Message is: " + TO_SKYPE_MESSAGE);
 
    //    console.log("Response message is: " + response.responseText);
 
 
GM_xmlhttpRequest({
  method: "GET",
  url: "https://hook.integromat.com/o7lu2dullggj6e4xbcr6mt2ylm151wwp?text=" + TO_SKYPE_MESSAGE,
  headers: {
    "User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
    "Accept": "text/xml"            // If not specified, browser defaults will be used.
  },
  onload: function(response) {
    var responseXML = null;
    // Inject responseXML into existing Object (only appropriate for XML content).
    if (!response.responseXML) {
      responseXML = new DOMParser()
        .parseFromString(response.responseText, "text/xml");
    }
 
  if(debug)  console.log([
      response.status,
      response.statusText,
      response.readyState,
      response.responseHeaders,
      response.responseText,
      response.finalUrl,
      responseXML
    ].join("\n"));
  }
});
 
 
 
if(debug) console.log("Goodbye from send_to_skype(message)! See you laters!");
 
    }
 
 
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
 
  var ORDER_TOTAL_SUM;
  var ORDER_PHONE;
  var ORDER_TEMPLATE;
  var TO_SKYPE_MESSAGE;
  var button = document.createElement("button");
  var number;
 
  //----------------------------
 
 
       // document.querySelector("#my_select_option")
 //   waitForKeyElements("my_select_option", make_template);
 
/* function make_modal()
    {
     var button_123 = document.createElemnt('button');
        button_123.id = "myBtn_123";
        document.body.append(button_123);
 
var div_123 = document.createElement('div');
 
div_123.innerHTML = "<div style=\"left: 0; top: 0; display: block; position: fixed; z-index: 1; padding-top: 100px; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4); \" id=\"myModal\" ><div style=\"background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 80%;\"><span  class=\"close\"style=\"     color: #aaa;float: right;font-size: 28px;font-weight: bold;\">&times;</span><p>Some text in the Modal..</p></div>";
 
var css_123 = '.close:hover, .close:focus { color: black; text-decoration: none;cursor: pointer;}';
var style_123 = document.createElement('style');
 
if (style_123.styleSheet) {
    style_123.styleSheet.cssText = css_123;
} else {
    style_123.appendChild(document.createTextNode(css_123));
}
 
document.getElementsByTagName('head')[0].appendChild(style_123);
 
 
document.append(div_123);
 
var modal_123 = document.getElementById("myModal");
 
// Get the button that opens the modal
var btn_123 = document.getElementById("myBtn_123");
 
// Get the <span> element that closes the modal
var span_123 = document.getElementsByClassName("close")[0];
 
// When the user clicks on the button, open the modal
btn_123.onclick = function() {
  modal_123.style.display = "block";
}
 
// When the user clicks on <span> (x), close the modal
span_123.onclick = function() {
  modal_123.style.display = "none";
}
 
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal_123) {
    modal_123.style.display = "none";
  }
}
 
    }
 
function make_skype_button(elem)
    {
        var div_skype = document.createElement('div');
        div_skype.id = "my_skype_id";
        div_skype.innerHTML = '<div id="call_32" style="width:20%;background-color:#0094ff"><script type="text/javascript">Skype.ui({name: "call",element: "call_32",participants: ["echo123"],imageSize: 32,});</script></div>';
        elem.append(div_skype);
 
    }
     */
 
function make_template()
    {
//searching 4 element start
    var i;
    var j;
    var z;
    var element;
        var fio;
    for (z = 0; z <= 40; z++) {
      for (i = 0; i <= 10; i++) {
        for (j = 0; j <= 10; j++) {
 
element = document.querySelector("#shop-order-container > table:nth-child(" + z + ") > tbody > tr:nth-child(" + i + ") > td:nth-child(" + j + ")");
          if (typeof element != "undefined" && element != null) {
            if(debug) console.log("    found element with text: " + element.innerText);
            if (element.innerText == "ФИО") {
 
fio = document.querySelector("#shop-order-container > table:nth-child(" + z + ") > tbody > tr:nth-child(" + i + ") > td:nth-child(" + (j +1) + ")").textContent;
 
             if(debug)  console.log("    FIO found:" + fio.textContent);
            }
          }
        }
      }
    }
     //searching 4 element end
 
 
//var fio = document.querySelector("#shop-order-container > table:nth-child(6) > tbody > tr:nth-child(1) > td:nth-child(2)").textContent;
        fio=fio.replace(/\s\s+/g, ' ');
        if (fio.charAt(1) == " ") fio=fio.removeCharAt(1)
       if(debug) console.log("Fio is:" + fio);
var index = document.querySelector("#my_select_option");
if (index.selectedIndex == 0 )  { ORDER_TEMPLATE = 'сбербанк 4276 4000 9426 7078 Анна Н.К. к оплате ' + ORDER_TOTAL_SUM ;
                                 TO_SKYPE_MESSAGE =  number + ",  на карту " + ORDER_TOTAL_SUM + ", "  + ORDER_PHONE;
 
                                document.querySelector("#my_input_text_field").style.display = 'inline';
                                }
if (index.selectedIndex == 1 )  { ORDER_TEMPLATE = 'Добрый день. Номер вашей посылки №' + ORDER_TOTAL_SUM +'. Хорошего дня!';
                                 TO_SKYPE_MESSAGE = number + ", " +' трек отправлен: '+ ORDER_TOTAL_SUM + ", " +  ORDER_PHONE;
                              document.querySelector("#my_input_text_field").style.display = 'inline';
                                }
if (index.selectedIndex == 2 )  { ORDER_TEMPLATE = 'Вам звонили из магазина парфюмерии svparfum.com' ;
                                 TO_SKYPE_MESSAGE = number + ", " +"Отправлено соощение о недозвоне, " +  ORDER_PHONE;
         document.querySelector("#my_input_text_field").style.display = 'none';
                                }
if (index.selectedIndex == 3 )  { ORDER_TEMPLATE = 'Если заказ актуален, можете связаться с нами WhatsApp +79036248880' ;
                                 TO_SKYPE_MESSAGE = "Отправлена просьба свзяаться: " + number + ", телефон: " + ORDER_PHONE;
                               document.querySelector("#my_input_text_field").style.display = 'none';
                                }
 
if(debug) console.log("made template: " + ORDER_TEMPLATE);
 
    }
 
 
  waitForKeyElements("#shop-order-container", takeSum);
 
  //document.querySelector("body > script:nth-child(2)")
  function takeSum(jNode) {
//if (document.getElementById("my_skype_id") == null )
 
 
   // make_skype_button(jNode);
 
 
    if (debug) console.log("Hello from takeSum function");
 
    //document.querySelector("#shop-order-container > table:nth-child(19) > tbody > tr:nth-child(5) > td:nth-child(1) > span")
    var i;
    var j;
    var z;
    var element;
    for (z = 0; z <= 40; z++) {
      for (i = 0; i <= 10; i++) {
        for (j = 0; j <= 10; j++) {
          //document.querySelector("#shop-order-container > table:nth-child(18) > tbody > tr:nth-child(5) > td:nth-child(1) > span")
          element = document.querySelector(
            "#shop-order-container > table:nth-child(" +
              z +
              ") > tbody > tr:nth-child(" +
              i +
              ") > td:nth-child(" +
              j +
              ") > span"
          );
          if (typeof element != "undefined" && element != null) {
            if(debug) console.log("    found element with text: " + element.innerText);
            if (element.innerText == "СУММА К ОПЛАТЕ") {
            if(debug)   console.log(
                "    ORDER_TOTAL_SUM set: " +
                  document.querySelector(
                    "#shop-order-container > table:nth-child(" +
                      z +
                      ") > tbody > tr:nth-child(" +
                      i +
                      ") > td:nth-child(" +
                      (j + 1) +
                      ") > strong"
                  ).innerText
              );
 
              ORDER_TOTAL_SUM = document.querySelector(
                "#shop-order-container > table:nth-child(" +
                  z +
                  ") > tbody > tr:nth-child(" +
                  i +
                  ") > td:nth-child(" +
                  (j + 1) +
                  ") > strong"
              ).innerText;
              $("#my_input_text_field").value = ORDER_TOTAL_SUM;
 
             if(debug)  console.log("    Set over, ORDER_TOTAL_SUM is " + ORDER_TOTAL_SUM);
            }
          }
        }
      }
    }
 
    if (debug) console.log("exiting from takeSum function!");
  }
 
  //---------------------------
  waitForKeyElements(
    "#shop-order-container > table:nth-child(6) > tbody > tr:nth-child(2) > td:nth-child(2) > select",
    takeTemplate
  );
 
      waitForKeyElements(
    "#shop-order-container > table:nth-child(6) > tbody > tr:nth-child(2) > td:nth-child(2) > select",
    takeTemplate
  );
 
 
 
  //KOPIRUEM NOMER ZAKAZA
  waitForKeyElements(
    "#ajaxPopupWindow_0 > div > table > tbody > tr:nth-child(1) > td.draggable_title > span",
    copyNomerZakaza
  );
 
  function copyNomerZakaza(jNode) {
    number = jNode.text();
    number = number.substring(7, number.indexOf("("));
  }
 
  waitForKeyElements(
    "#shop-order-container > table:nth-child(6) > tbody > tr:nth-child(2) > td:nth-child(2)",
    takePhone
  );
 
  function takeTemplate(jNode) {
      make_template();
    if (typeof jNode != "undefined" && jNode != null) {
      //--------take template func
      if (debug) console.log("hello from takeTemplate function!");
      //if (debug) console.log("    We have here ORDER_TEMPLATE= " + ORDER_TEMPLATE + " and jNode.val()= " + jNode.val());
      jNode.change(function() {
          make_template();
 
        button.innerHTML = "SMS: " + ORDER_TEMPLATE;
      });
      if (debug)
        console.log(
          "    We have here ORDER_TEMPLATE= " +
            ORDER_TEMPLATE +
            " and jNode.val()= " +
            jNode.val()
        );
      ORDER_TEMPLATE = jNode.val();
        make_template();
      button.innerHTML = "SMS: " + ORDER_TEMPLATE;
 
      if (debug) console.log("    exiting from takeTemplate function!");
    }
 
    //--------/take template func
  }
 
 
 
 
 
 
  function takePhone(jNode) {
 
 
 
//var tableRow = document.querySelector("td").filter(function() { return $(this).text() == "Способ оплаты"; }).closest("tr"); tableRow.style.display="none";
 
 
 
 
 
document.querySelector("#shop-order-container > table:nth-child(6) > tbody > tr:nth-child(2) > td:nth-child(2)").style.fontSize="20px";
/*document.querySelector("#shop-order-container > table:nth-child(6) > tbody > tr:nth-child(4)").style.display="none";
document.querySelector("#shop-order-container > table:nth-child(6) > tbody > tr.prn-hidden").style.display="none";
document.querySelector("#shop-order-container > table:nth-child(6) > tbody > tr:nth-child(6)").style.display="none";
document.querySelector("#shop-order-container > table:nth-child(6) > tbody > tr:nth-child(8)").style.display="none";
document.querySelector("#shop-order-container > table:nth-child(6) > tbody > tr:nth-child(9)").style.display="none";
*/
//GM_addStyle("");
 
    if (debug) console.log("hello from takePhone function!");
 
   if (debug) console.log($.trim(jNode.html().replace("&nbsp;", "")));
 
    ORDER_PHONE = $.trim(jNode.html().replace("&nbsp;", ""));
 
    button.innerHTML = ORDER_TEMPLATE;
    button.className = "s3-btn without-margin";
  button.title = "Нажмите чтобы отправить SMS с этим текстом";
    jNode.append(button);
 
    var select = document.createElement("select");
    select.innerHTML =
      '<option   value="сбербанк 4276 4000 9426 7078 Анна Н.К. к оплате ' +
      ORDER_TOTAL_SUM +
      '">карта</option>';
 
 
      select.innerHTML +=
      '<option   value="Добрый день. Номер вашей посылки №' +
      ORDER_TOTAL_SUM +
      '. Хорошего дня!">трек</option>';
		select.innerHTML += '<option value="">звонили</option>';
      select.innerHTML += '<option value="Если заказ актуален, можете связаться с нами WhatsApp +79036248880">Связаться с нами</option>';
 
    select.setAttribute("id", "my_select_option");
    select.title = "Нажмите чтобы выбрать шаблон";
    jNode.append(select);
 
    var x = document.createElement("INPUT");
    x.setAttribute("type", "text");
    x.id = "my_input_text_field";
    x.style.margin = "0px 0px 0px 20px";
    x.title = "Скорректируйте сумму или введите трек для другого шаблона.";
    x.value = ORDER_TOTAL_SUM;
 
    x.oninput = function() {
 
      ORDER_TOTAL_SUM = x.value;
        make_template();
      button.innerHTML = ORDER_TEMPLATE;
    };
 
    jNode.append(x);
   //????? button.addEventListener("click", function() {});
 
    button.addEventListener("click", function some_unique_function() {
 
      if (sessionStorage.getItem(number) != ORDER_TEMPLATE) {
        if (window.confirm("Отправить SMS?")) {
          sessionStorage.setItem(number, ORDER_TEMPLATE);
var error_var = 0;
 
 
          if(debug) console.log("data: phone=" + ORDER_PHONE + "&text=" + ORDER_TEMPLATE);
          GM_xmlhttpRequest({
            method: "POST",
            dataType: "json",
            url:
              "https://on-free-server.000webhostapp.com/send_sms.php?OpenAgent&callback",
            data: "phone=" + ORDER_PHONE + "&text=" + ORDER_TEMPLATE,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
 
            onload: function(response) {
              //output content
 
              var responseXML = null;
              // Inject responseXML into existing Object (only appropriate for XML content).
              if (!response.responseXML) {
                responseXML = new DOMParser().parseFromString(
                  response.responseText,
                  "text/xml"
                );
              }
 
            if (debug)   console.log(
                [
                  "    response.status:  " + response.status,
                  "    response.statusText:  " + response.statusText,
                  "    response.readyState:  " + response.readyState,
                  "    response.responseHeaders:  " + response.responseHeaders,
                  "    response.responseText:  " + response.responseText,
                  "    response.finalUrl:  " + response.finalUrl,
                  "    responseXML:  " + responseXML
                ].join("\n")
              );
 
              //-------------
if(debug) console.log(response.responseText);
              var result_here = jQuery.parseJSON(response.responseText);
 
              if (result_here.result == "1") {
                jNode.parent().css("background", "#DFF68F"); // green
               if (debug)  console.log("    We detected success in result");
                var newtext = document.createTextNode("Сообщение отправлено!");
 
                $(
                  "#shop-order-container > table:nth-child(6) > tbody > tr:nth-child(2) > td:nth-child(2)"
                ).append(newtext);
                if (debug) console.log("    Сообщение отправлено");
              } else {
               if (debug)  console.log("error from php: " + result_here.result);
                jNode.parent().css("background", "#FFE7D1"); // example red
                var newtext2 = document.createTextNode(
                  "error from php: " + result_here.result
                );
                $(
                  "#shop-order-container > table:nth-child(6) > tbody > tr:nth-child(2) > td:nth-child(2)"
                ).append(newtext2);
              }
            },
            onerror: function(err) {
				jNode.parent().css("background", "#FFE7D1"); // example red
			alert("Случился сбой отправки сообщения. readyState: " + err.readyState + ", responseHeaders: " + err.responseHeaders + ", responseText: " + err.responseText + ", status: " + err.status + ", statusText: " + err.statusText );
              
              var newtext3 = document.createTextNode("Error global: " + err.responseText);
              $(
                "#shop-order-container > table:nth-child(6) > tbody > tr:nth-child(2) > td:nth-child(2)"
              ).append(newtext3);
            
            }
          });
if(!error_var) {send_to_skype("Отправлено смс: " + ORDER_TEMPLATE +" на номер "+ORDER_PHONE + " по заказу "+ number);}
else { alert("Сообщение в скайп НЕ будет отправлено.");}
 
          button.removeEventListener("click", some_unique_function);
        }
      }
      else {
          if(debug) console.log("Prevented multiple sending");
      }
 
    });
 
    if (debug) console.log("exiting from takePhone function!");
  }
 
 
 
//----------END OF SMS
 
 
 
 
    function RetrieveInfo (jNode)
{
        if (debug) console.log("RetrieveInfo (jNode) welcomes you!");
 
 
 
 
//btn_retr_info.addEventListener("click", function retr_info () {});
//btn_retr_info.addEventListener("click", function retr_info() {
//sessionStorage.setItem(number, ORDER_TEMPLATE);
if (debug) console.log("retr_info() welcomes you!");
        if(debug)   console.log("    sending data: phone=" + ORDER_PHONE );
          GM_xmlhttpRequest({
            method: "POST",
            dataType: "json",
            url:
              "https://on-free-server.000webhostapp.com/retrieve_info.php?OpenAgent&callback",
            data: "phone=" + ORDER_PHONE +"&method=multiple",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
 
            onload: function(response) {
              //output content
 
              var responseXML = null;
              // Inject responseXML into existing Object (only appropriate for XML content).
              if (!response.responseXML) {
                responseXML = new DOMParser().parseFromString(
                  response.responseText,
                  "text/xml"
                );
              }
 
           if(debug)    console.log(
                [
                  "    response.status:  " + response.status,
                  "    response.statusText:  " + response.statusText,
                  "    response.readyState:  " + response.readyState,
                  "    response.responseHeaders:  " + response.responseHeaders,
                  "    response.responseText:  " + response.responseText,
                  "    response.finalUrl:  " + response.finalUrl,
                  "    responseXML:  " + responseXML
                ].join("\n")
              );
 
              //-------------
//if(debug) console.log("    json_decode(response.responseText)= " + json_decode(response.responseText));
 
 
if(response.responseText != "[]")
                {
                    var arr_tracks_and_statuses= [];
var vrucheno=0;
                var priem=0;
                var obrabotka=0;
                    var vozvrat=0;
 
var result_here = jQuery.parseJSON(response.responseText);
 
 
if (typeof jNode != "undefined" && jNode != null)
{
   if (Object.keys(result_here) != "success")
   {
var txt_error = document.createTextNode("Ошибка, ответ сервера: " + response.statusText);
jNode.after(txt_error);
 
   }
 
}
                    else
                    {
                     var txt_error2 = document.createTextNode("Ошибка, ответ сервера, " + response.responseText);
jNode.after(txt_error2);
                    }
 
 
 
 
 
 
if (debug) console.log("    TOTAL packages: " + Object.keys(result_here.success).length + " typrof Object.keys(result_here.success): " + typeof(Object.keys(result_here.success)));
if (debug) console.log("    TOTAL packages: " + Object.keys(result_here.success));
var i;
                var g;
                    var obj;
                for (i = 0; i <= Object.keys(result_here.success).length-1; i++)
                {
                    g=result_here.success[Object.keys(result_here.success)[i]].length;
if (debug) console.log(" counting package phases: " + g);
                 //here we detect last one track, so its delivering now
                    if (g==0)
                   { priem++;
 
                       arr_tracks_and_statuses.unshift("( " + (Object.keys(result_here.success).length-i) +" ) Трек: " + Object.keys(result_here.success)[i] + " - почта еще не передала информацию в сервис." ); //[i] not sure
                        break;
                   }
 
 
//var obj =  result_here.success[Object.keys(result_here.success)[i]] ;
obj =  result_here.success[Object.keys(result_here.success)[i]] ;
if (debug) console.log(" last phase: " +       obj[g-1][0]           );
                    if (obj[g-1][0] == "Вручение" && !obj[g-1][4].includes('тправител')) vrucheno++;
                    if (obj[g-1][0] == "Обработка") obrabotka++;
                    if (obj[g-1][0] == "Приём") priem++;
                    if (obj[g-1][4].includes('тправител')   ) vozvrat++;
 
 
//"Заказ: " +obj[g-1][6] +",
arr_tracks_and_statuses.unshift("( " + (Object.keys(result_here.success).length-i) +" ) Трек: " + Object.keys(result_here.success)[i] + ", статус вручения: " + obj[g-1][0] + ", в: " + obj[g-1][1] + ", "+  obj[g-1][3] + ", " + obj[g-1][4]+ ", Стоимость: " + obj[0][6] + " руб.");
if (debug) console.log("    track: " + Object.keys(result_here.success)[i] + " and status: " + obj[g-1][0] + " at: " + obj[g-1][1] );
                }
var txt_vrucheno = document.createElement("b");
  txt_vrucheno.innerHTML = "Выкуплено: " + vrucheno + ", в пути: "+obrabotka + ", отгружено: " + priem + ", возвращено: " + vozvrat;
 
//var txt_vrucheno = document.createTextNode("Выкуплено: " + vrucheno + ", в пути: "+obrabotka + ", отгружено: " + priem );
jNode.after(txt_vrucheno);
//! append
//var button
 
var btn_retr_tracks = document.createElement("button");
    btn_retr_tracks.innerHTML = "Информация по отправлениям";
	btn_retr_tracks.title = "Нажмите чтобы увидеть информацию.";
    btn_retr_tracks.className = "s3-btn without-margin";
    btn_retr_tracks.style.margin = "0px 20px 0px 0px";
 
//! append
jNode.after(btn_retr_tracks);
 
var btn_retr_track = document.createElement("button");
    btn_retr_track.innerHTML = "Этот заказ";
    btn_retr_track.className = "s3-btn without-margin";
    btn_retr_track.style.margin = "0px 20px 0px 0px";
 
 
 
//! append
jNode.after(btn_retr_tracks);
 
 
 
//ДО ЛУЧШИХ ВРЕМЕН
 
 
 
 
 
 
 
 
 
//jNode.after(btn_retr_track);
 
 
 
 
btn_retr_track.addEventListener("click", function retr_track () {
 
 
if(debug) console.log("Greetings from retr_this_order_info or something like that...");
if(debug) console.log("    requesting with " + ORDER_PHONE);
GM_xmlhttpRequest({
    method: "POST",
    dataType: "json",
    url:
      "https://on-free-server.000webhostapp.com/retrieve_info.php?OpenAgent&callback",
   // data: "phone=" + ORDER_PHONE +"&method=v2",
    data: "phone=" + ORDER_PHONE +"&method=v2",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
 
    onload: function(response) {
      //output content
 
      var responseXML = null;
 
      if (!response.responseXML) {
        responseXML = new DOMParser().parseFromString(
          response.responseText,
          "text/xml"
        );
      }
 
    if (debug)  console.log(
        [
          "    response.status:  " + response.status,
          "    response.statusText:  " + response.statusText,
          "    response.readyState:  " + response.readyState,
          "    response.responseHeaders:  " + response.responseHeaders,
          "    response.responseText:  " + response.responseText,
          "    response.finalUrl:  " + response.finalUrl,
          "    responseXML:  " + responseXML
        ].join("\n")
      );
 
if(response.responseText != "[]")
{
    if (debug) console.log("    not empty response...");
 
        }
        else {
 
var txt_none2 = document.createTextNode("Не найдено отправлений по номеру заказа. " );
//! append
jNode.before(txt_none2);
        }
 
 
    },
    onerror: function(err) {
jNode.parent().css("background", "#FFE7D1"); // example red
			alert("Случился сбой получения треков. readyState: " + err.readyState + ", responseHeaders: " + err.responseHeaders + ", responseText: " + err.responseText + ", status: " + err.status + ", statusText: " + err.statusText );
              
              var newtext4 = document.createTextNode("Error global: " + err.responseText);
      jNode.before(newtext4);
 
    }
  });
 
 
 
});
btn_retr_tracks.addEventListener("click", function retr_tracks () {
 
//var div = document.getElementById("yourDivElement");
var input = document.createElement("textarea");
//var button = document.createElement("button");
input.name = "post";
input.id = "all_info";
input.maxLength = "5000";
input.cols = "130";
input.rows = "10";
input.value = arr_tracks_and_statuses.join("\n");;
    //alert(arr_tracks_and_statuses[1]);
//! before remained
jNode.before(input); //appendChild
 
 
 
 
 
 
});
 
 
 
 
                }
                else {
 
                    var txt_none = document.createTextNode("Не найдено отправлений по номеру телефона. " );
//! append
jNode.before(txt_none);
                }
 
//result_here.success[Object.keys(result_here.success)[1]].forEach(function(item){
 
//    if (debug) console.log(item.count());
 
//});
               // if (debug) console.log("    first package status: " +  Object.keys(result_here.success)  );
 
 
//if (debug) console.log("-    trying to count down elements");
 
/*
              if (result_here.result == "1") {
                jNode.parent().css("background", "#DFF68F"); // green
              if (debug)  console.log("    We detected success in result");
                var newtext = document.createTextNode("Сообщение отправлено!");
 
                $(
                  "#shop-order-container > table:nth-child(6) > tbody > tr:nth-child(2) > td:nth-child(2)"
                ).append(newtext);
              if (debug)  console.log("    Сообщение отправлено");
              } else {
               if (debug) console.log("error from php: " + result_here.result);
                jNode.parent().css("background", "#FFE7D1"); // example red
                var newtext2 = document.createTextNode(
                  "error from php: " + result_here.result
                );
                $(
                  "#shop-order-container > table:nth-child(6) > tbody > tr:nth-child(2) > td:nth-child(2)"
                ).append(newtext2);
              }*/
            },
            onerror: function(err) {
jNode.parent().css("background", "#FFE7D1"); // example red
			alert("Случился сбой получения треков. readyState: " + err.readyState + ", responseHeaders: " + err.responseHeaders + ", responseText: " + err.responseText + ", status: " + err.status + ", statusText: " + err.statusText );
              
              var newtext4 = document.createTextNode("Error global: " + err.responseText);
              $(
                "#shop-order-container > table:nth-child(6) > thead > tr > th"
              ).append(newtext4);
 
            }
          });
 
        //  button.removeEventListener("click", some_unique_function);
        //  if (sessionStorage.getItem(number) != ORDER_TEMPLATE) {
       // if (window.confirm("Получить инфо?")) {
       // }
     // }
     // else {
    //      if(debug) console.log("Prevented multiple sending");
     // }
if (debug) console.log("retr_info() says good bye to you!");
   // });
if (debug) console.log("RetrieveInfo (jNode) says good bye to you!");
 
    }
 
      waitForKeyElements(
 
    "#shop-order-container > div.s3-actions-panel-wrap.prn-hidden",
    RetrieveInfo
  );
 
    //
})();
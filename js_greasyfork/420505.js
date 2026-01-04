// ==UserScript==
// @name        Insert Expert finder 
// @namespace   Violentmonkey Scripts
// @match       https://test.itsm.services.sap/*
// @grant       none
// @version     1.0.5
// @author      I843865
// @license MIT
// @description 1/21/2021, 4:04:08 PM
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/420505/Insert%20Expert%20finder.user.js
// @updateURL https://update.greasyfork.org/scripts/420505/Insert%20Expert%20finder.meta.js
// ==/UserScript==
   
   
   
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
console.log("aham1");

  
function pollDOM() {
  
  
  console.log("aham2")
  
  if(document.querySelector("sn-workspace-content") != null){
    if(document.querySelector("sn-workspace-content").shadowRoot != null){
      if(document.querySelector("sn-workspace-content").shadowRoot.querySelector("now-record-form-connected") != null){
      if(document.querySelector("sn-workspace-content").shadowRoot.querySelector("now-record-form-connected").shadowRoot.querySelector("sn-form-internal-workspace-form-layout") != null){
        if(document.querySelector("sn-workspace-content").shadowRoot.querySelector("now-record-form-connected").shadowRoot.querySelector("sn-form-internal-workspace-form-layout").shadowRoot.querySelector("now-record-common-sidebar") != null){
          if(document.querySelector("sn-workspace-content").shadowRoot.querySelector("now-record-form-connected").shadowRoot.querySelector("sn-form-internal-workspace-form-layout").shadowRoot.querySelector("now-record-common-sidebar").shadowRoot.querySelector("sn-form-internal-sidebar-toolbar") != null){
            if(document.querySelector("sn-workspace-content").shadowRoot.querySelector("now-record-form-connected").shadowRoot.querySelector("sn-form-internal-workspace-form-layout").shadowRoot.querySelector("now-record-common-sidebar").shadowRoot.querySelector("sn-form-internal-sidebar-toolbar").shadowRoot.firstChild != null){
              
              var x = document.querySelector("sn-workspace-content").shadowRoot.querySelector("now-record-form-connected").shadowRoot.querySelector("sn-form-internal-workspace-form-layout").shadowRoot.querySelector("now-record-common-sidebar").shadowRoot.querySelector("sn-form-internal-sidebar-toolbar").shadowRoot.firstChild;
              
              
              var btn2 = document.createElement("BUTTON");
              
              btn2.innerHTML = "c";
              btn2.style= "margin: 0 2px;"
              
              
              x.appendChild(btn2);
              
              
              btn2.onclick = function () {
                  var getText = document.querySelector("sn-workspace-content").shadowRoot.querySelector("now-record-form-connected").shadowRoot.querySelector("sn-form-internal-workspace-form-layout").shadowRoot.querySelector("now-record-form-blob").shadowRoot.querySelector("sn-form-internal-tabs").shadowRoot.querySelector("sn-form-internal-tab-contents").shadowRoot.querySelector("now-record-form-section-column-layout").shadowRoot.querySelector("now-activity-combo").shadowRoot.querySelector("now-activity-stream-connected").shadowRoot.firstChild.getElementsByClassName("tile");
                //.item(1).value;
                  var iframeText = document.querySelector("sn-workspace-content").shadowRoot.querySelector("now-record-form-connected").shadowRoot.querySelector("sn-form-internal-workspace-form-layout").shadowRoot.querySelector("now-record-form-blob").shadowRoot.querySelector("sn-form-internal-tabs").shadowRoot.querySelector("sn-form-internal-tab-contents").shadowRoot.querySelector("now-record-form-section-column-layout").shadowRoot.querySelector("now-activity-combo").shadowRoot.querySelector("now-activity-stream-compose-connected").shadowRoot.querySelector("now-record-html-editor").shadowRoot.querySelector("iframe").contentWindow.document;
                
                  var naoachou = 0;
                  console.log(getText);
                  for (var i = 0; i < getText.length; i++) {
                      if (typeof getText.item(i).value !== 'undefined'){
                        if(getText.item(i).value.indexOf("#Management Summary") !== -1){
                        console.log("ACHEIIIIIII");
                          if (naoachou == 0){
                            console.log("troquei");
                            iframeText.body.innerHTML+= getText.item(i).value;
                            naoachou = 1;
                          }
                        }
                      }//second console output
                  }
                
                var template = '<p>Management Summary of Technical Problem:</p><p>[1]<br />[2]</p><p>#Current Business Impact:<br />[1] name and function of core business process(es) affected:<br />[2] deadline to fix/workaround incident (asap/date&#43;time&#43;timezone):<br />[3] workaround available (Y/N):<br />[4] number of users affected:<br />[5] financial loss:<br />[6] 24/7 contact available (Y/N):<br />[7] senior management involved (SAP/Customer) &#43; role:<br />[8] political background:<br />[9] additional information:</p><p>#Changes applied to system before incident:<br />[Use change analysis tool for ABAP stack systems. Refer to link<br /><a href="https://mcc-agsdev.dispatcher.hana.ondemand.com/index.html#/services/4ba798bb-6ee9-2dae-37b3-ff713770d993" rel="nofollow">https://mcc-agsdev.dispatcher.hana.ondemand.com/index.html#/services/4ba798bb-6ee9-2dae-37b3-ff713770d993</a>]</p><p>[1] …<br />[2]</p><p>#Actions Taken:<br />[1]<br />[2]</p><p>#Action Plan to customer/partner:<br />[1] …<br />[2]</p><p>#Action Plan to SAP:<br />[1] …<br />[2] …<br />[lookup actions plan templates at <a href="https://mcc-agsdev.dispatcher.hana.ondemand.com/index.html#/services?filter&#61;1000" rel="nofollow">https://mcc-agsdev.dispatcher.hana.ondemand.com/index.html#/services?filter&#61;1000</a>]</p><p>#Contact information:<br />Customer:<br />Name:<br />Function:<br />Tel:<br />Available from: to:</p><p>Bridge call:<br />schedule<br />access code<br />number</p><p>SAP<br />Name:<br />Function:<br />Tel</p>'; 
                
                if(naoachou == 0){
                  console.log("nao achei")
                  iframeText.body.innerHTML+= template;
                }
                
                
                  
                 
                //console.log(document.querySelector("sn-workspace-content").shadowRoot.querySelector("now-record-form-connected").shadowRoot.querySelector("sn-form-internal-workspace-form-layout").shadowRoot.querySelector("now-record-form-blob").shadowRoot.querySelector("sn-form-internal-tabs").shadowRoot.querySelector("sn-form-internal-tab-contents").shadowRoot.querySelector("now-record-form-section-column-layout").shadowRoot.querySelector("now-activity-combo").shadowRoot.querySelector("now-activity-stream-compose-connected").shadowRoot.querySelector("now-record-html-editor").shadowRoot.querySelector("iframe"));
                  
                
                //iframeText = $("#myframe").contents().find('body');
                
    
                
                //iframeText.body.innerHTML+= getText;


                }
              /*
              var getText = document.querySelector("sn-workspace-content").shadowRoot.querySelector("now-record-form-connected").shadowRoot.querySelector("sn-form-internal-workspace-form-layout").shadowRoot.querySelector("now-record-form-blob").shadowRoot.querySelector("sn-form-internal-tabs").shadowRoot.querySelector("sn-form-internal-tab-contents").shadowRoot.querySelector("now-record-form-section-column-layout").shadowRoot.querySelector("now-activity-combo").shadowRoot.querySelector("now-activity-stream-connected").shadowRoot.firstChild.getElementsByClassName("tile");
              var iframeText = document.querySelector("sn-workspace-content").shadowRoot.querySelector("now-record-form-connected").shadowRoot.querySelector("sn-form-internal-workspace-form-layout").shadowRoot.querySelector("now-record-form-blob").shadowRoot.querySelector("sn-form-internal-tabs").shadowRoot.querySelector("sn-form-internal-tab-contents").shadowRoot.querySelector("now-record-form-section-column-layout").shadowRoot.querySelector("now-activity-combo").shadowRoot.querySelector("now-activity-stream-compose-connected").shadowRoot.querySelector("now-record-html-editor").shadowRoot.querySelector("iframe").contentWindow.document;
              iframeText.open();
              iframeText.write('test');
              iframeText.close();
*/
              
             // console.log(xy.item(0).value);
              
              console.log("aquiiiii")
                 /*document.querySelector("sn-workspace-content").shadowRoot.querySelector("now-record-form-connected").shadowRoot.querySelector("sn-form-internal-workspace-form-layout").shadowRoot.querySelector("now-record-common-sidebar").shadowRoot.querySelector("sn-form-internal-sidebar-toolbar").shadowRoot.firstChild*/

  /*                
var x = document.querySelector("sn-workspace-content").shadowRoot.querySelector("now-record-form-connected").shadowRoot.querySelector("sn-form-internal-workspace-form-layout").shadowRoot.querySelector("now-record-common-sidebar").shadowRoot.querySelector("sn-form-internal-sidebar-panel").shadowRoot.querySelector("now-agent-assist").shadowRoot.firstChild;
              x.firstChild.remove();
              x.firstChild.remove();
                  
  var iframe = document.createElement('iframe');
  iframe.style.width = "100%";
  iframe.height = "100%";
  //iframe.style.width = "550";
  //iframe.style.frameborder = "0";
                  
  iframe.src = "https://zqueuemonitor-supportportal.dispatcher.hana.ondemand.com/?hc_reset";
  x.appendChild(iframe);
  */
              
                  
            }else {
  setTimeout(pollDOM, 500);
  //console.log("not now1"); // try again in 300 milliseconds
}
            }else {
  setTimeout(pollDOM, 500);
  //console.log("not now1"); // try again in 300 milliseconds
}
            } else {
  setTimeout(pollDOM, 800);
  //console.log("not now2"); // try again in 300 milliseconds
}
          } else {
  setTimeout(pollDOM, 800);
  //console.log("not now3"); // try again in 300 milliseconds
}
        } else {
  setTimeout(pollDOM, 800);
  //console.log("not now4"); // try again in 300 milliseconds
}
      } else {
  setTimeout(pollDOM, 300);
  //console.log("not now5"); // try again in 300 milliseconds
}
  } else {
  setTimeout(pollDOM, 300);
  //console.log("not now6"); // try again in 300 milliseconds
}
}

pollDOM();

      

/******/ })()
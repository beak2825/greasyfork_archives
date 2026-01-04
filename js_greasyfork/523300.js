// ==UserScript==
// @name         kibana-html-decode
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  kibana html decode
// @author       You
// @include      https://*monitor-*/*
// @include      https://kibana*/*
// @include      http://kibana*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523300/kibana-html-decode.user.js
// @updateURL https://update.greasyfork.org/scripts/523300/kibana-html-decode.meta.js
// ==/UserScript==

(function() {
    'use strict';

     const filter = (list, filterFunction) => {
         const results = [];
         list.forEach(item=>{
             if(filterFunction(item)){
                 results.push(item);
             }
         })
         return results;
     }

     const decodeHTML = function (html) {
         var txt = document.createElement('textarea');
         txt.innerHTML = html;
         return txt.value;
     };

    const decodeHTMLForElements = (elements)=>{
        elements.forEach(element=>{
            element.innerHTML = decodeHTML(element.innerHTML);
        });
    }

    const decode = () => {
       const messageElements = filter(document.querySelectorAll("dt"), (item)=> item.innerText.includes("message"))
                                .map((item)=>{
                                    return item.nextElementSibling;
                                });
        decodeHTMLForElements(filter(messageElements, (item)=>item!==null));

        const messageDetailElements = document.querySelectorAll("[data-test-subj=tableDocViewRow-message-value]");
        decodeHTMLForElements(messageDetailElements);

        const tableHeader=document.querySelectorAll("[data-test-subj=docTableHeader]>th");
        let i=0;
        for(let j = 0; j < tableHeader.length; j++) {
            if (tableHeader[j].querySelector("[data-test-subj=docTableHeader-message]")){
                i=j;
            }
        }
        
        const tableRow=document.querySelectorAll("[data-test-subj=docTableRow]");
        tableRow.forEach(item=>{
            //decodeHTMLForElements(item.querySelectorAll("td")[i].querySelectorAll("[ng-non-bindable]"));
            decodeHTMLForElements(item.querySelectorAll("td")[i].querySelectorAll("[class=truncate-by-height]"));
        })
    }

    const handler = setInterval(()=>{
      const querySubmitButton = document.querySelector("[data-test-subj=querySubmitButton]");
      if(!querySubmitButton){
          return;
      }
      //clearInterval(handler);
      if (querySubmitButton.parentElement.querySelector("#decode")){
         return;
      }

      const decodeButton = document.querySelector("[data-test-subj=querySubmitButton]").cloneNode();
      decodeButton.id = "decode";
      decodeButton.innerText = "Decode";
      decodeButton.onclick = decode;
      querySubmitButton.parentElement.appendChild(decodeButton);

    }, 1000);

})();
// ==UserScript==
// @name         Stock Connect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This is a private script intended to manipulate stock connect website for private use
// @author       You
// @match        https://stockplan.morganstanley.com/solium/servlet/ui/dashboard
// @icon         https://www.google.com/s2/favicons?domain=morganstanley.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430789/Stock%20Connect.user.js
// @updateURL https://update.greasyfork.org/scripts/430789/Stock%20Connect.meta.js
// ==/UserScript==

(function() {
    'use strict';


     function SearchAmount(){
         var element = document.querySelector(".fancyCurrency-value");
        
         if (element!=null)
         {
             var sum = element.innerHTML.replace("M","")
             sum = getWithoutTax(sum);
             sum = sum - 1718000
             sum = sum.toLocaleString();
             //element.innerHTML = sum;
             var div = document.createElement("div");
             div.style.paddingLeft = "44px";
             div.style.fontSize = "20px";
              div.style.color = "green";
             div.innerHTML = "₪" + sum;

             var parentDiv = element.parentNode.parentNode;
             insertAfter(div, parentDiv);

             var containers = document.querySelectorAll(".breakdownRow-container");
             if (containers.length>0){
                 for(var i=0;i<containers.length;i++){
                     var innerContainer  =containers[i].querySelector(".fancyCurrency-value");
                     var amount = innerContainer.innerText;
                     //debugger;
                     var net = getWithoutTax(amount);
                     //reformat net
                     net = Number(net/1000000).toFixed(2);
                     //innerContainer.style.color = "green";
                     innerContainer.innerHTML = amount + "<span style='color:green'> (₪" + net + "M) </span> ";
                 }
             }

         }
         else
         {
             setTimeout(SearchAmount, 200);
         }
     }

    function getWithoutTax(amount){
        if (amount.indexOf('M')>-1)
            amount = amount.replace("M","");

        amount = (amount*1000000)*72/100;
        return amount;
    }
    function insertAfter(newNode, existingNode) {
        existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
    }
     SearchAmount();
})();
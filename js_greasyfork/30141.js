// ==UserScript==
// @name         Easier Fanatics TMS
// @namespace    https://greasyfork.org/users/4756
// @author       saibotshamtul (Michael Cimino)
// @version      0.1.6
// @description  adds (S) to search for POs and (C) to add content
// @atch        https://fanatics.mercurygate.net/MercuryGate/newmenu/AppFrame.jsp?returnUrl=../mainframe/MainFrame.jsp&kick=*
// @match        https://fanatics.mercurygate.net/MercuryGate/dashboard/wide/dashboardExt.jsp*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30141/Easier%20Fanatics%20TMS.user.js
// @updateURL https://update.greasyfork.org/scripts/30141/Easier%20Fanatics%20TMS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function SelectPOs(){
        var pos = prompt("POs");
        if (pos===''){return;}
        var mydata = pos.split(",");
        var pot = eval("document.querySelector('.sajtable')");
        var count = 0;
        var pon = '';
        for (var p=0;p<mydata.length;p++){
            var po = mydata[p];
            var found = false;
            for (var i=0;i<pot.children[0].children.length;i++){
                var row = pot.children[0].children[i];
                if (row.children[1].innerText == po){
                    row.children[0].children[0].click();
                    count++;
                    found = true;
                    break;
                }
            }
            if (found===false){
                if (pon.length>0){
                    pon = pon + ",";
                }
                pon = pon + po;
            }
        }
        alert(count + " POs clicked.");
        if (pon.length>0){
            prompt("POs not found:",pon);
        }
    }
    window.SelectPOs = SelectPOs;

    var a = document.createElement("div");
    a.style.cssText="position:absolute;padding:10px;left:1370px;top:70px;display:inline-block; font-family:Arial;color:#888;font-size:10pt";

    var po_select_element = document.createElement("span");
    po_select_element.innerHTML="&nbsp;(S)&nbsp;";
    po_select_element.onclick = SelectPOs;

    a.appendChild(po_select_element);

    function Clothing100(){
        document.querySelector('[name=description1]').value = "Clothing, Garments or Apparel, NOI";
        for (var i=0; i<100; i++){
            //change category to Clothing
            var d = document.querySelector('[name=description'+i+']');
            if (d!==null){
                d.value = document.querySelector('[name=description1]').value;
            }

            //change class to 100
            var f = document.querySelector('[name=freightClass'+i+']');
            if (f!==null){
                f.value = 100;
            }

            //this POs is document.querySelector('[name=description1]').parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.children[1].children[0].children[0].children[0].children[1].innerText.replace(" (PONumber)","")
        }
    }

    var fillc100 = document.createElement("span");
    fillc100.innerHTML="&nbsp;(C)&nbsp;";
    fillc100.onclick = Clothing100;

    a.appendChild(fillc100);

    document.body.appendChild(a);

})();

/*
for (var i=0; i<100; i++){
  var d = document.querySelector('[name=description'+i+']');
  if (d!=null){
    d.value = document.querySelector('[name=description1]').value;
  }
  var f = document.querySelector('[name=freightClass'+i+']');
  if (f!=null){
    f.value = 100;
  }
}
*/
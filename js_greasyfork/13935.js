// ==UserScript==
// @name         Easier Burlington Routing AutoFill
// @namespace    https://greasyfork.org/users/4756
// @version      0.3.2
// @description  enter something useful
// @author       You
// @match        https://bcfroutingform.coat.com/bcf-routing-form/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13935/Easier%20Burlington%20Routing%20AutoFill.user.js
// @updateURL https://update.greasyfork.org/scripts/13935/Easier%20Burlington%20Routing%20AutoFill.meta.js
// ==/UserScript==

vendor.value="Outerstuff/Statco";
contact.value="Michael Cimino";
email.value="outerstuff1@statcowhse.com";
phone.value="(201) 792-7000";
city.value="Jersey City";
zipcode.value="07310";
totalpallets.value="1";
description.value="Wearing Apparel";
comments.value="First Come, First Served\nClosed for lunch 12-1";

/*
state_label.innerText="New Jersey";
freighttype_label.innerText="Cartons";
stackablepallets_label.innerText="No";
*/

//state_label.click()
state_panel.children[0].children[0].children[31].click();
freighttype_panel.firstChild.firstChild.children[1].click();
stackablepallets_panel.firstChild.firstChild.children[2].click();

//j_idt38_onclick_orig = j_idt38.onclick;
//j_idt38.onclick = function(){ponumber.focus();setTimeout(function(){ponumber.value=' '},1000);return j_idt38_onclick_orig()};

additem = document.querySelectorAll(".ui-button")[3];
additem_onclick_orig = additem.onclick;
//additem.onclick = function(){ponumber.focus();setTimeout(function(){ponumber.value=' '},1000);return additem_onclick_orig()};
additem.onclick = function(){setTimeout(function(){ponumber.value='';ponumber.focus();},1000);return additem_onclick_orig();};

/*

(function(a,b,c,d){e=[ponumber,TtlCartons,TtlWeight,TtlCubicFt];for(f in e){e[f].value=[a,b,c,d][f].toString()};TtlCartonsWt.value=parseInt(c/b);j_idt41.click()})(425268409,3,43,3)

*/

function easyParseData(){
  window.mydata = prompt('data');
  window.mydata = window.mydata.split(",");
  window.mydatafields = [ponumber,TtlCartons,TtlWeight,TtlCubicFt];
  window.passData = function(){
          if (window.mydata.length > 0){
              temp = [0,0,0,0];
              for (var b in window.mydatafields){
                  popped = window.mydata.splice(0,1).toString();
                  temp[b] = popped;
                  window.mydatafields[b].value = popped;
              }
              //console.log(temp);
              TtlCartonsWt.value=parseInt(temp[2]/temp[1]);
              additem_onclick_orig();
              setTimeout(window.passData,750*4);
          }
      };
  window.passData();
}
window.easyParseData = easyParseData;
orderlist = document.querySelectorAll("h4")[3];
orderlist.onclick = easyParseData;
orderlist.innerHTML="<span style='color:#060'>"+orderlist.innerHTML+"</span>";
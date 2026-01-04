// ==UserScript==
// @name         Open GM Links
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license MIT 
// @description  Open links all gm in new window!
// @author       Mac
// @match        https://ironbow.servicenowservices.com/sn_customerservice_case_list.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=servicenowservices.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466870/Open%20GM%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/466870/Open%20GM%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var hf = document.querySelector("[id*='_last_row']");

console.log(hf.innerHTML);
//subelement is always 14
var subElements = document.getElementsByClassName("list_row list_odd  list_row_compact").children;
//    if (hf.innerHTML % 2 == 0) {
for (let i = 0; i < hf.innerHTML/2; i++) {
                var a = document.createElement('a');
                a.innerHTML = "click GM";
                                console.log(i);
                                if (document.getElementsByClassName('list_row list_odd  list_row_compact')[i].children[14].innerHTML.length >= 4 && document.getElementsByClassName('list_row list_odd  list_row_compact')[i].children[14].innerHTML.length <=7) {
                                                console.log(document.getElementsByClassName('list_row list_odd  list_row_compact')[i].children[14].innerHTML);
                                    a.target= '_blank';
                                    a.href = "https://help.globalmed.com/hc/en-us/requests/" + document.getElementsByClassName('list_row list_odd  list_row_compact')[i].children[14].innerHTML;
                                                console.log(i + "" + a.href);
                                                console.log(document.getElementsByClassName('list_row list_odd  list_row_compact')[i]);
                                                document.getElementsByClassName('list_decoration_cell col-control col-small col-center ')[i*2].appendChild(a);
                }


                /*else{
                                if (document.getElementsByClassName('list_row list_even  list_row_compact')[i].children[14].innerHTML.length == 5) {
                                console.log(document.getElementsByClassName('list_row list_even  list_row_compact')[i].children[14].innerHTML);
                                var container = document.getElementsByClassName('list_decoration_cell col-small col-center ')[i];
                                a.href = https://help.globalmed.com/hc/en-us/requests/ + document.getElementsByClassName('list_row list_odd  list_row_compact')[i].children[14].innerHTML;
                                console.log(i + a.href);
                                console.log(a.href);
                                document.getElementsByClassName('list_decoration_cell col-control col-small col-center ')[i].appendChild(a);
                }*/
}
for (let i = 0; i < hf.innerHTML/2; i++) {
                                var a = document.createElement('a');
                                a.innerHTML = "click GM";
                                                console.log(i);
                if (document.getElementsByClassName('list_row list_even  list_row_compact')[i].children[14].innerHTML.length >= 4 && document.getElementsByClassName('list_row list_even  list_row_compact')[i].children[14].innerHTML.length <=7) {
                                                                console.log(document.getElementsByClassName('list_row list_even  list_row_compact')[i].children[14].innerHTML);
                    a.target= '_blank';
                    a.href = "https://help.globalmed.com/hc/en-us/requests/"+ document.getElementsByClassName('list_row list_even  list_row_compact')[i].children[14].innerHTML;
                                                                console.log(i + "" + a.href);
                                                                console.log(document.getElementsByClassName('list_row list_odd  list_row_compact')[i]);
                                                                document.getElementsByClassName('list_decoration_cell col-control col-small col-center ')[i*2+1].appendChild(a);
                                }
}

})();

// ==UserScript==
// @name        影城搜尋器
// @namespace   http://userscripts.org/scripts/show/0
// @description 增快搜尋速度
// @include     *
// @version     1.0
// @author      weichun
// @license     
// @downloadURL https://update.greasyfork.org/scripts/11784/%E5%BD%B1%E5%9F%8E%E6%90%9C%E5%B0%8B%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/11784/%E5%BD%B1%E5%9F%8E%E6%90%9C%E5%B0%8B%E5%99%A8.meta.js
// ==/UserScript==

$(document).ready(function () {
  //your code here
  console.log("hi");
$("#title").append('<div id="div'  + '">導演:<input type="text" id="search" onkeyup="searchdirector()" /> </div>');
$("#title").append('<div id="div'  + '">演員:<input type="text" id="search" onkeyup="searchactor()" /> </div>');
  var body = document.body;
  $("body").append('<div id="div'  + '">導演:<input type="text" id="search" onkeyup="searchdirector()" /> </div>');
  $("body").append('<div id="div'  + '">演員:<input type="text" id="search" onkeyup="searchactor()" /> </div>');
});



function searchdirector(){
             var searchvalue= document.getElementById('search').value;
             var from_s = document.getElementsByName("directors");
             for (var i=0;i<from_s.options.length;i++) {
                var st=from_s.options[i].text;
                  if(st.search(searchvalue)>-1) {
                  var temp  = from_s.options[i];
                 from_s.add(temp, from_s.options[0]);
                 }            
             }
           }

function searchdirector(){
             var searchvalue= document.getElementById('search').value;
             var from_s = document.getElementByName('actors');
             for (var i=0;i<from_s.options.length;i++) {
                var st=from_s.options[i].text;
                  if(st.search(searchvalue)>-1) {
                  var temp  = from_s.options[i];
                 from_s.add(temp, from_s.options[0]);
                 }            
             }
           }


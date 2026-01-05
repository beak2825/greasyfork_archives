// ==UserScript==
// @name        影城搜尋器
// @namespace   http://userscripts.org/scripts/show/0
// @description 增快搜尋速度
// @include     *
// @version     1.0
// @author      weichun
// @license     
// @downloadURL https://update.greasyfork.org/scripts/11804/%E5%BD%B1%E5%9F%8E%E6%90%9C%E5%B0%8B%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/11804/%E5%BD%B1%E5%9F%8E%E6%90%9C%E5%B0%8B%E5%99%A8.meta.js
// ==/UserScript==

var script = document.createElement("script")
script.async = "async"
script.defer = "defer"
script.type= "text/javascript";
script.src = "http://ajax.useso.com/ajax/libs/jquery/1.7.2/jquery.min.js?ver=3.4.2"
script.onload = onload;
var headers = document.getElementsByTagName("head");
var header = headers[0];

header.appendChild(script); 


var script1 = document.createElement("script")
script1.type= "text/javascript";
script1.text = searchdirector;
script1.src = "http://weichunchin.github.io/WP-win/finalTest/test.user.js"
header.appendChild(script1); 



function searchdirector(){
             var searchvalue= document.getElementById('search').value;
             var from_s = document.getElementsByName('directors[]')[0];
             for (var i=0;i<from_s.options.length;i++) {
                var st=from_s.options[i].text;
                  if(st.search(searchvalue)>-1) {
                  var temp  = from_s.options[i];
                 from_s.add(temp, from_s.options[0]);
                 }            
             }
           }

function searchactor(){
             var searchvalue1= document.getElementById('search1').value;
             var from_s1 = document.getElementsByName('actors[]')[0];
             for (var i=0;i<from_s1.options.length;i++) {
                var st=from_s1.options[i].text;
                  if(st.search(searchvalue1)>-1) {
                  var temp  = from_s1.options[i];
                 from_s1.add(temp, from_s1.options[0]);
                 }            
             }
           }



function onload()
{
	
console.log("hi");
$("#title").append('<div id="div'  + '">導演:<input type="text" id="search" onkeyup="searchdirector()" /> </div>');
$("#title").append('<div id="div'  + '">演員:<input type="text" id="search1" onkeyup="searchactor()" /> </div>');
  var body = document.body;
  $("body").append('<div id="div'  + '">導演:<input type="text" id="search" onkeyup="searchdirector()" /> </div>');
  $("body").append('<div id="div'  + '">演員:<input type="text" id="search1" onkeyup="searchactor()" /> </div>');
  
//$("body").text('<script></script>');



}

/*
$(document).ready(function () {
  //your code here
  
 
console.log("hi");
$("#title").append('<div id="div'  + '">導演:<input type="text" id="search" onkeyup="searchdirector()" /> </div>');
$("#title").append('<div id="div'  + '">演員:<input type="text" id="search1" onkeyup="searchactor()" /> </div>');
  var body = document.body;
  $("body").append('<div id="div'  + '">導演:<input type="text" id="search" onkeyup="searchdirector()" /> </div>');
  $("body").append('<div id="div'  + '">演員:<input type="text" id="search1" onkeyup="searchactor()" /> </div>');
});
*/




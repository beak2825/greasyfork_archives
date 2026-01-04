// ==UserScript==
// @name        vor zurück jumper 
// @namespace   basti 10121012
// @include     **
 
 
// @namespace   
// @author       pennerhackisback früher basti1012 oder pennerhack
// @description  wer faul ist und klicks ersparen will nimmt dieses script
 
// @version      3.10.2017 001
// @author			basti1012
// @grant			GM_getValue
// @grant			GM_setValue
// @grant			GM_xmlhttpRequest
// @grant			GM_openInTab
// @grant			GM_log

// @require		  https://code.jquery.com/jquery-3.2.1.min.js
// @require		  https://code.jquery.com/ui/1.11.4/jquery-ui.js
 // @require		  https://code.jquery.com/jquery-1.10.2.js



 
// @require		http://code.jquery.com/ui/1.10.2/jquery-ui.js

 // @icon          http://www.lildevil.org/greasemonkey/images/IC-icon.png


 
// @downloadURL https://update.greasyfork.org/scripts/34956/vor%20zur%C3%BCck%20jumper.user.js
// @updateURL https://update.greasyfork.org/scripts/34956/vor%20zur%C3%BCck%20jumper.meta.js
// ==/UserScript==
 
 document.getElementById('content').innerHTML += '<div id="response"></div><div id="ww"></div>';

  function addGlobalStyle(css) {
    var head, style;
    
    head = document.getElementsByTagName('body')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
 
 var url = document.location.href;
 
var xmlHttp = new XMLHttpRequest();
var response = document.getElementById("response");
xmlHttp.open("GET", url, true); // true for asynchronous
xmlHttp.send(null);
xmlHttp.onreadystatechange = function() {
	response.innerHTML = xmlHttp.status;
};
 
 
addGlobalStyle('.nav1 {height:50px; width:60px; position:fixed; top:0; right:0;z-index:999;  background-color:transparent; opacity:1;border:2px solid #2A2A2A;}');

addGlobalStyle('#vorr {top:25; right:0;height:25px; width:60px;background-color:#171717;}');
 addGlobalStyle('#vor {top:0; right:0;height:25px; width:60px;background-color:#171717;}');
addGlobalStyle('#vorr{display:block; font-size:16px;color:white;  line-height:8px; float:left; padding:0px;}');
 addGlobalStyle('#vor{display:block; font-size:14px;color:white; line-height:8px; float:left; padding:0px;}');




addGlobalStyle('.nav2 {height:50px; width:60px; position:fixed; top:0; left:0;z-index:999;  background-color:transparent; opacity:1;border:2px solid #2A2A2A;}');
 addGlobalStyle('#zur { height:25px;width:60px; top:0; left:0;background-color:#171717;}');
addGlobalStyle('#zurr { height:25px; width:60px; top:25; left:0;background-color:#171717;}');
addGlobalStyle('#zur{display:block; font-size:14px;color:white; line-height:8px; float:left; padding:0px;}');
 addGlobalStyle('#zurr{display:block; font-size:16px;color:white; line-height:8px; float:left; padding:0px;}');

  
//-------------------------------------------------------------------------------------------



g =check()
 

function test(k){
var g1 =parseInt(g)+parseInt(k);
return g1;
}

function test1(k){
var g1 =parseInt(g)-k;
return g1;
}




document.getElementsByTagName('body')[0].innerHTML  +=''
+'<div class="nav2">'
  +'<button id="zur" name="zur"  >Zurück</button>'
//  +'<div id="select2> '
 
  +'<select id="zurr" name="zurr">'
  +'<option value="'+test1(1)+'">'+test1(1)+'</option> '
+'<option value="'+test1(2)+'">'+test1(2)+'</option>'
+' <option value="'+test1(3)+'">'+test1(3)+'</option>'
+'<option value="'+test1(4)+'">'+test1(4)+'</option> '
+'<option value="'+test1(5)+'">'+test1(5)+'</option>'
+' <option value="'+test1(6)+'">'+test1(6)+'</option>'
+'<option value="'+test1(7)+'">'+test1(7)+'</option> '
+'<option value="'+test1(8)+'">'+test1(8)+'</option>'
+' <option value="'+test1(9)+'">'+test1(9)+'</option>'
+'<option value="'+test1(10)+'">'+test1(10)+'</option>' 
+'<option value="'+test1(11)+'">'+test1(11)+'</option>'
+' <option value="'+test1(12)+'">'+test1(12)+'</option>'
+' </select></div>'
  
    +'<div class="nav1">'
  +'<button id="vor" name="vor" >Vor</button>'
 // +'<div id="select1>'
  +'<select id="vorr" name="vorr">'
  +'<option value="'+test(1)+'">'+test(1)+'</option> '
+'<option value="'+test(2)+'">'+test(2)+'</option>'
+' <option value="'+test(3)+'">'+test(3)+'</option>'
+'<option value="'+test(4)+'">'+test(4)+'</option> '
+'<option value="'+test(5)+'">'+test(5)+'</option>'
+' <option value="'+test(6)+'">'+test(6)+'</option>'
+'<option value="'+test(7)+'">'+test(7)+'</option> '
+'<option value="'+test(8)+'">'+test(8)+'</option>'
+' <option value="'+test(9)+'">'+test(9)+'</option>'
+'<option value="'+test(10)+'">'+test(10)+'</option>' 
+'<option value="'+test(11)+'">'+test(11)+'</option>'
+' <option value="'+test(12)+'">'+test(12)+'</option>'
+' </select>  </div>'; 
 
  

addGlobalStyle('.progress{	width: 1px;	height: 14px;	color: white;	font-size: 12px;  overflow: hidden;	background-color: navy;	padding-left: 5px;}');

 
$(window).on('scroll', function() {
    console.log($(this).scrollTop());
    if ($(this).scrollTop() > 150 && !$('.nav').hasClass('visible')) {
        $('.nav').animate({opacity : 1}, 'slow', function() {
            $(this).addClass('visible').removeAttr('style');
        });
    } else if ($(this).scrollTop() <= 150 && $('.nav').hasClass('visible')) {
        $('.nav').animate({opacity : 0}, 'slow', function() {
            $(this).removeClass('visible').removeAttr('style');
        });
    }
});
function check(){
  var urls = document.location.href;
if (urls.indexOf("http")>=0) {
  var url1 = urls.replace("http://", "");
}
if (urls.indexOf("www")>=0) {
  var url1 = urls.replace("www.", "");
}
if (urls.indexOf("http://www.")>=0) {
   var url1 = urls.replace("http://www.", "");
 }
if (urls.indexOf("https")>=0) {
  var url1 = urls.replace("https://", "");
}
if (urls.indexOf("https://www.")>=0) {
   var url1 = urls.replace("https://www.", "");
 }  
  
 
 
     for(f=1;1<=5;f++){
      g = url1.split('/')[f].split('/')[0];
      
      if(parseInt(g)>=0){
        
  return g;
      
      }
     }
}

 

 $("#vor").button().click(function () {
 
 
 var f = parseInt(g)+1;
  var k='/'+g+'/';
  var h ='/'+f+'/';
   var urlsa = document.location.href;
     var gu = urlsa.replace(k,h);
 
 location.href =gu;
   })
 
  var sele1 = document.getElementById('vorr');
   sele1.onchange = function() {
     var t =  document.getElementsByName('vorr')[0].value;   
     var f = parseInt(t);
     var k='/'+g+'/';
     var h ='/'+f+'/';
     var urlsa = document.location.href;
     var gu = urlsa.replace(k,h);
     location.href =gu;
 }
   
   
   
 $("#zur").button().click(function () {
   var urlsa = document.location.href;
   var f = parseInt(g)-1;
   var k='/'+g+'/';
   var h ='/'+f+'/';
   var gu = urlsa.replace(k,h);
  location.href =gu;
 })



 var sele1 = document.getElementById('zurr');
   sele1.onchange = function() {
     var t =  document.getElementsByName('zurr')[0].value;   
     var f = parseInt(t);
     var k='/'+g+'/';
     var h ='/'+f+'/';
     var urlsa = document.location.href;
     var gu = urlsa.replace(k,h);
     location.href =gu;
 }
 
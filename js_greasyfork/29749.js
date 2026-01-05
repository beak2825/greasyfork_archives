// ==UserScript==
// @name         Clean TheOldReader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes unused features of TheOldReader to clean up the interface
// @author       You
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @match        https://theoldreader.com/*
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/29749/Clean%20TheOldReader.user.js
// @updateURL https://update.greasyfork.org/scripts/29749/Clean%20TheOldReader.meta.js
// ==/UserScript==

//<dl class="dl-horizontal">
if (document.location == "https://theoldreader.com/") {
$(".col-md-12").hide();
}

//if (document.location.includes("https://theoldreader.com/folders/")) {
$(".btn-star").hide();
$(".btn-share").hide();
$(".btn-like").hide();
$(".dropdown-toggle").hide();
//}

//var starButton = document.getElementById('btn btn-small btn-star');
//if (starButton) {
//	document.body.removeChild(starButton);
//}

//<a href="/posts/7e0b0c28411dc1f135abfb60_56cb7e72ca9f40f2ad005f6e" class="btn btn-small btn-star" rel="noreferrer"><i class="icon icon-star"></i> <span>Star</span></a>
//theoldreader.com##.btn.btn-small.btn-star

//var p = document.getElementsByClassName('protected-icon');
//for (var i=p.length; --i>=0;) {
//    p[i].parentNode.removeChild(p[i]);
//}

//var badDivs = $("div.btns:contains('btn-star')");
//badDivs.parent ().remove ();

//var page;
//page = document.body.innerHTML
//document.body.innerHTML= document.body.innerHTML.replace(/<td>10<span class=\"grey\">.<\/span>019<\/td>/g,"<td>done.<\/td>");
//page = page.replace(/"icon icon-star"/g,"");
//document.body.innerHTML = page;

//var btns = document.getElementsByClassName("btns");
//for(var i = 0; i < btns.length; i++){
//    var btnsData = btns[i].innerHTML;
//    alert(btnsData);
//    var n = btnsData.indexOf("btn btn-small btn-star");
//    if (n > 0){
//        //function x() { // Please find a better name!
//        var a = btns[i].getElementsByTagName("a");
//        for(var j = 0; j < a.length; j++) {
//            //alert(a[j].attributes[1].name);
//            var attr = a[j].getAttribute("class");
//            //alert(atrr);
//            if (attr == "btn btn-small btn-star"){
//                //alert(attr + '\n' + btns[i]);
//                a[j].innerHTML = "";
//            }
//            if (attr == "btn btn-small dropdown-toggle"){
//                //alert(attr + '\n' + btns[i]);
//                a[j].innerHTML = "";
//            }
//            if (attr == "btn btn-small btn-share"){
//                //alert(attr + '\n' + btns[i]);
//                a[j].innerHTML = "";
//            }
//            if (attr == "btn btn-small btn-like"){
//                //alert(attr + '\n' + btns[i]);
//                a[j].innerHTML = "";
//            }
//            
//            //a.click(); // Careful, IE only, see comments
//        }
//        //}
//        //alert(btns[i].innerHTML);
//    }
    //btns[i].innerHTML = btns[i].innerHTML.replace(/btn btn-small btn-star/g,'btn btn-small btn-read');
    //btns[i].innerHTML = btns[i].innerHTML.replace(/<span>Star<\/span>/g,'<span>Tree</span>');
    //btns[i].innerHTML = btns[i].innerHTML.replace(/<i class='icon icon-star'>/g,'<i class=\'icon icon-check\'>');
//}

//var divs = document.getElementsByTagName("div");
//alert(divs.length);
//for(var i = 0; i < divs.length; i++){
//    var divData = divs[i].innerHTML;
//    var n = divData.indexOf("<div class=\"btns\">");
//    //alert(divData);
//   //divs[i].innerHTML = "something new...";
//}
//getElementsByClass("btns");

//function getElementsByClass( searchClass, domNode, tagName) { 
//	if (domNode == null) domNode = document;
//	if (tagName == null) tagName = '*';
//	var el = new Array();
//	var tags = domNode.getElementsByTagName(tagName);
//	var tcl = " "+searchClass+" ";
//	for(i=0,j=0; i<tags.length; i++) { 
//		var test = " " + tags[i].className + " ";
//		if (test.indexOf(tcl) != -1) 
//			el[j++] = tags[i];
//	} 
//	return el;
//} 
 
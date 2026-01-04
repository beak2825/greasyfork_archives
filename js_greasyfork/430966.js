// ==UserScript==
// @name     PsychMentor
// @version  1.3
// @grant    none
// @include  https://www.mrcpsychmentor.com/review/textbook**
// @namespace psychmentor
// @description PsychMentor Notes
// @downloadURL https://update.greasyfork.org/scripts/430966/PsychMentor.user.js
// @updateURL https://update.greasyfork.org/scripts/430966/PsychMentor.meta.js
// ==/UserScript==



var pushTo = function(elem,id,host,loc){
var host = document.querySelector(host);
var x = document.createElement(elem);
x.id = id;
if(loc==1||loc==null||loc=='after'){host.appendChild(x);}
if(loc==0||loc=='before'){host.parentNode.insertBefore(x,host);}
}

var injectCss = function(css){
var head = document.getElementsByTagName('head')[0];
var style = document.createElement('style');
style.type = "text/css";
style.innerHTML = css;
head.insertBefore(style,head.childNodes[1]);
}



pushTo("button","mybtn",".nav-item",0)
let mybtn = document.getElementById("mybtn")

mybtn.innerHTML = "Run"

//Choose Title to be opened here N=0,1,2...
var select_title = document.querySelectorAll('[data-catid="1"]');
select_title[0].click();

mybtn.onclick = function(){
  let title = document.getElementById("passmedicine-title");
	title.setAttribute("style", "text-transform:capitalize");
  var str = title.innerHTML.replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());

  navigator.clipboard.writeText(str).then(function() {
    console.log('inside')
      var notes = document.querySelector("#passmedicinenotes")
  if(notes){
    console.log("notes detected..converting page")

    document.body.innerHTML = notes.innerHTML;

    window.print();

  }else{
    console.log("no notes")
  }
	}, function() {
  	console.log('outside')
	});

  


}



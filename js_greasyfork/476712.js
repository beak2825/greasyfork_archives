// ==UserScript==
// @name        CursoresDeAcanas
// @namespace   Acanas
// @include     *swad.ugr.es*
// @version     1.1
// @grant       none
// @description Cambia los cursores mostrados en el SWAD para mostrar a nuestro fundador
// @downloadURL https://update.greasyfork.org/scripts/476712/CursoresDeAcanas.user.js
// @updateURL https://update.greasyfork.org/scripts/476712/CursoresDeAcanas.meta.js
// ==/UserScript==
//el nomalein
var amog='url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto';

var styles = `
//este luego lo cambio por el del texto para algunos casos. Duplicado porque el primero no funciona 0_o
input { cursor: url("https://i.postimg.cc/c4tmWvNr/l64.png") 7 0,  auto; }
input { cursor: url("https://i.postimg.cc/c4tmWvNr/l64.png") 7 0,  auto; }
body.canias  { cursor: url("https://i.postimg.cc/VvpWM8Xf/p64.png"), auto; }
figcaption  { cursor: url("https://i.postimg.cc/VvpWM8Xf/p64.png"), auto; }
d-none  { cursor: url("https://i.postimg.cc/VvpWM8Xf/p64.png"), auto; }
#text{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
.Tml_TXT{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
.Tml_TOP_PUBLISHER{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
.Tml_RIGHT_TIME{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
.Tml_LEFT_TIME{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
.DAY{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
.NOTICE_DATE{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
.NOTICE_TEXT_BRIEF{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
.NOTICE_TEXT{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
.NOTICE_AUTHOR{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
.FRAME_TITLE{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
.FRAME_TITLE_BIG{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
legend{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
label{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
CON_SINCE{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
#current_time{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
.MONTH{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
.HEAD_USR{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
.ALERT_TXT{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
h2{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
.strong{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
.HELP_EDIT{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
textarea{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
.Tml_MED_INPUT_WIDTH{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
p{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
b{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
h4{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
h3{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
.sr-only{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
.small{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
h1{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
h2{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
.aviso_legal{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
.ABOUT{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
input[type=text]{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
input[type=search]{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
.copyright-block{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
.BROWSER_SUBTITLE{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }
.RM{ cursor: url("https://i.postimg.cc/ZYMcXr2G/t64.png") 7 32, auto; }






a { cursor: url("https://i.postimg.cc/c4tmWvNr/l64.png") 7 0, auto; }
.clickable { cursor: url("https://i.postimg.cc/c4tmWvNr/l64.png") 7 0, auto; }
select { cursor: url("https://i.postimg.cc/c4tmWvNr/l64.png") 7 0,  auto; }
form { cursor: url("https://i.postimg.cc/c4tmWvNr/l64.png") 7 0, auto; }
.Tml_SHARER { cursor: url("https://i.postimg.cc/c4tmWvNr/l64.png") 7 0, auto; }
.fa { cursor: url("https://i.postimg.cc/c4tmWvNr/l64.png") 7 0, auto; }

`

var styleSheet = document.createElement("style")
styleSheet.innerText = styles
document.body.appendChild(styleSheet)

document.body.className = 'canias';

var amog='url("https://i.postimg.cc/c4tmWvNr/l64.png") 13 0, auto';
		  var fle = document.getElementsByTagName("li");
		  Array.from(fle).forEach(cosa => {
			 cosa.style.cursor=amog;
		  })
					  var fle = document.getElementsByTagName("a");
		  Array.from(fle).forEach(cosa => {
			 cosa.style.cursor=amog;
		  })
      var fle = document.getElementsByTagName("button");
		  Array.from(fle).forEach(cosa => {
			 cosa.style.cursor=amog;
		  })
      var fle = document.getElementsByTagName("form");
		  Array.from(fle).forEach(cosa => {
			 cosa.style.cursor=amog;
		  })      
      var fle = document.getElementsByClassName("MENU_ICO_TXT");
		  Array.from(fle).forEach(cosa => {
			 cosa.style.cursor=amog;
		  })
      var fle = document.getElementsByClassName("CM");
		  Array.from(fle).forEach(cosa => {
			 cosa.style.cursor=amog;
		  })
			
			function sleep(milliseconds) {
 var start = new Date().getTime();
 for (var i = 0; i < 1e7; i++) {
  if ((new Date().getTime() - start) > milliseconds) {
   break;
  }
 }
}

function demo() {
sleep(500);
	
	var fle = document.getElementsByTagName("li");
		  Array.from(fle).forEach(cosa => {
			 cosa.style.cursor=amog;
		  })
					  var fle = document.getElementsByTagName("a");
		  Array.from(fle).forEach(cosa => {
			 cosa.style.cursor=amog;
		  })
      var fle = document.getElementsByTagName("button");
		  Array.from(fle).forEach(cosa => {
			 cosa.style.cursor=amog;
		  })
      var fle = document.getElementsByTagName("form");
		  Array.from(fle).forEach(cosa => {
			 cosa.style.cursor=amog;
		  })      
      var fle = document.getElementsByClassName("MENU_ICO_TXT");
		  Array.from(fle).forEach(cosa => {
			 cosa.style.cursor=amog;
		  })
      var fle = document.getElementsByClassName("CM");
		  Array.from(fle).forEach(cosa => {
			 cosa.style.cursor=amog;
		  })
}

demo();

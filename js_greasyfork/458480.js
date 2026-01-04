// ==UserScript==
// @name        Sharty Themes
// @namespace   soyjak.partythemes
// @match       http*://soyjak.party/*
// @match       http*://www.soyjak.party/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @connect     *
// @license MIT
// @version     1.2
// @author      Base framework by Zyl, Mainly created by Doughy
// @description The Gemmiest Enhancements for the 'ty
// @downloadURL https://update.greasyfork.org/scripts/458480/Sharty%20Themes.user.js
// @updateURL https://update.greasyfork.org/scripts/458480/Sharty%20Themes.meta.js
// ==/UserScript==

const version = "v1.2";
console.log(`Sharty Themes ${version}`);

const namespace = "ShartyThemes.";
function setValue(key, value) {
  if (key == "hiddenthreads" || key == "hiddenimages") {
    if (typeof GM_setValue == "function") {
      GM_setValue(key, value);
    }
    localStorage.setItem(key, value);
  } else {
    if (typeof GM_setValue == "function") {
      GM_setValue(namespace + key, value);
    } else {
      localStorage.setItem(namespace + key, value);
    }
  }
}

function getValue(key) {
  if (key == "hiddenthreads" || key == "hiddenimages") {
    if (typeof GM_getValue == "function" && GM_getValue(key)) {
      localStorage.setItem(key, GM_getValue(key).toString());
    }
    return localStorage.getItem(key);
  }
  if (typeof GM_getValue == "function") {
    return GM_getValue(namespace + key);
  } else {
    return localStorage.getItem(namespace + key);
  }
}

function themeEnabled(key) {
  let value = getValue(key);
  if (value == null) {
    value = optionsEntries[key][2];
    setValue(key, value);
  }
  return value.toString() == "true";
}

function getNumber(key) {
  let value = parseInt(getValue(key));
  if (Number.isNaN(value)) {
    value = 0;
  }
  return value;
}

function getJson(key) {
  let value = getValue(key);
  if (value == null) {
    value = "{}";
  }
  return JSON.parse(value);
}

function addToJson(key, jsonKey, value) {
  let json = getJson(key);
  let parent = json;
  jsonKey.split(".").forEach((e, index, array) => {
    if (index < array.length - 1) {
      if (!parent.hasOwnProperty(e)) {
        parent[e] = {};
      }
      parent = parent[e];
    } else {
      parent[e] = value;
    }
  });
  setValue(key, JSON.stringify(json));
  return json;
}

function removeFromJson(key, jsonKey) {
  let json = getJson(key);
  let parent = json;
  jsonKey.split(".").forEach((e, index, array) => {
    if (index < array.length - 1) {
      parent = parent[e];
    } else {
      delete parent[e];
    }
  });
  setValue(key, JSON.stringify(json));
  return json;
}

function customAlert(a) {
    document.body.insertAdjacentHTML("beforeend", `
<div id="alert_handler">
  <div id="alert_background" onclick="this.parentNode.remove()"></div>
  <div id="alert_div">
    <a id='alert_close' href="javascript:void(0)" onclick="this.parentNode.parentNode.remove()"><i class='fa fa-times'></i></a>
    <div id="alert_message">${a}</div>
    <button class="button alert_button" onclick="this.parentNode.parentNode.remove()">OK</button>
  </div>
</div>`);
}


const optionsEntries = {

  "underwater": ["checkbox", "Underwater Theme", false],
  "soot": ["checkbox", "Soot Theme", false],
  "cia": ["checkbox", "CIA Theme", false],
  "colorjak": ["checkbox", "Colorjak Theme", false],
  "beta": ["checkbox", "Beta Theme", false],
  "leftypol": ["checkbox", "Leftycoal Theme", false],
  "cafe": ["checkbox", "Crystal Theme", false],
  "gurochan": ["checkbox", "Gurochan Theme", false],
}






let options = Options.add_tab("sharty-themes", "gear", "Sharty Themes").content[0];


let optionsHTML = `<span style="display: block; text-align: center">${version}</span>`;
optionsHTML += `<a style="display: block; text-align: center" href="https://greasyfork.org/en/scripts/456980-sharty-fixes-gemerald">Best used with Sharty Fixes Gemerald</a><br>`;
optionsHTML += `<span style="display: block; text-align: center"><h1></h1></span>`;
for ([optKey, optValue] of Object.entries(optionsEntries)) {
  optionsHTML += `<input type="${optValue[0]}" id="${optKey}" name="${optKey}"><label for="${optKey}">${optValue[1]}</label><br>`;
}
options.insertAdjacentHTML("beforeend", optionsHTML);

options.querySelectorAll("input[type=checkbox]").forEach(e => {
  e.checked = themeEnabled(e.id);
  e.addEventListener("change", e => {
    setValue(e.target.id, e.target.checked);
  });
});




document.head.insertAdjacentHTML("beforeend", `
<style>







${themeEnabled("gurochan") ? `
html, body {
        font-size:10pt;
        background:#EDDAD2;
        color: #800;
}
* {
        font-family: Tahoma, Verdana, Arial, sans-serif;
        font-size: 10pt;
}
input, textarea {
        background-color: #E6CBC0;
        border: 1px solid #CA927B;
}

a, a:visited{
	color: #AF0A0F;
}


a:hover {
	color: #D00;
}

a.quotelink {
        color:#DD0000;
}
div.post.reply.highlighted{
        background:#D9AF9E
}
form table tr th {
        background: #D9AF9E;
        border: 1px solid #CA927B;
        padding: 2px 5px 2px 5px;
}
div.banner{
        background: #D9AF9E;
        border: 1px solid #CA927B;
        color: #800;
        font-weight: bold;
        padding: 2px 5px 2px 5px;
}
div.post.reply{
        padding: 2px 5px 2px 5px;
	background:#E6CBC0;
	color:#800;
	border:1px solid #D9AF9E;
}
div.post.reply div.body a{
       color: #AF0A0F;
}

.bar
{
       background:#D9AF9E;
       color:#800;
}

.bar a {
        color:#800;
}

.bar.bottom {
    border-top: 1px solid #CA927B;
}

.desktop-style div.boardlist:not(.bottom), .desktop-style div.boardlist:not(.bottom) a {
    font-size: 10pt;
    background:#D9AF9E;
    color:#800;
    border-bottom: 1px solid #CA927B;
}

h1.glitch a{
        font-size: 24pt;
        color: #AF0A0F;
        font-family: "Trebuchet MS", Tahoma, Verdana, Arial, sans-serif;
}
h1.glitch {
        font-size: 24pt;
        color: #AF0A0F;
        font-family: "Trebuchet MS", Tahoma, Verdana, Arial, sans-serif;
}
hr {
        border-top: 1px dotted #D9AF9E;
}
#options_div {
        background: #D9AF9E;
        border: 2px solid #CA927B;
}
#options_tablist {
	border: 1px solid #CA927B;
}
div.module, div.ban {
        background: #D9AF9E;
        border: 1px solid #CA927B;
}
div.ban h2 {
        background: #CA927B;
}
.fc td, .fc th {
        background: #CA927B;
}
.hljs, .hljs-subst {
        background: #EDDAD2;
        border: 1px solid #CA927B;
}

.intro a.email:hover{
    color: #D00;
}

.intro a.email span.name {
    color: #AF0A0F;
}

.intro span.name {
    color: #AF0A0F;
}

.intro span.subject {
    color: #800;
}

.options_tab_icon{
    color: #AF0A0F;
}


#quick-reply th {
    border: 1px solid #D9AF9E;
}


div.pages input{
    background:#D9AF9E;
    color:#800;
}

div.pages a.selected{
    color:#800;
}

.quote {
    color: #866;
}


div.banner a, textarea {
    color: #800;
}


a.selected:nth-child(1) {
        color:#800;
}
` : ""}


${themeEnabled("underwater") ? `

a:link, a:visited {
text-decoration: none;
color: #00637B;
}

a:link:hover, a:visited:hover {
color: #DD0000;
}

a.post_no {
color: #000033;
}

.intro a.email span.name {
color: #0093AB;
}

.intro a.email:hover span.name {
color: #DD0000;
}

h2, div.title, h1 {
color: #800000;
}

form table tr th {
background: #95D2D3;
}

div.banner {
background-color: #E04000;
}

div.post.op hr {
border-color: #B7C9D5;
}

.intro span.subject {
color: #117743;
font-weight: 800;
}

.intro span.name {
color: #117743;
font-weight: 800;
}

div.post.reply.highlighted {
background: #a9d8ff;
}

div.post.reply {
background: #B6DDDE;
border-color: #8FCCCD;
}

div.ban {
border: 1px solid #0093AB;
}

div.ban h2 {
background: #B6DDDE;
color: #0093AB;
}

div.pages {
color: #8899AA;
background: #B6DDDE;
border-right: 1px solid #8FCCCD;
border-bottom: 1px solid #8FCCCD;
}

hr {
border-color: #B7D9C5;
}

div.boardlist {
color: #0093AB;
    background-color: rgba(65%, 85%, 95%, 0.2);
}

.desktop-style div.boardlist:nth-child(1) {
  text-shadow: #D2FFEE 1px 1px 1px, #D2FFEE -1px -1px 1px;
}
* {
   background-image: url('https://files.catbox.moe/hp03xs.png');
}

.soifish {
   background-image: url('https://files.catbox.moe/rxmvyr.png');
   position: fixed;
    pointer-events: none;
  -webkit-animation: moveX 30s linear 0s infinite alternate, moveY 30s linear 0s infinite alternate;
  -moz-animation: moveX 30s linear 0s infinite alternate, moveY 30s linear 0s infinite alternate;
  -o-animation: moveX 30s linear 0s infinite alternate, moveY 30s linear 0s infinite alternate;
  animation: moveX 30s linear 0s infinite alternate, moveY 30s linear 0s infinite alternate;
}

@-webkit-keyframes moveX {
  from { left: 0; } to { left: 100%; }
}
@-moz-keyframes moveX {
  from { left: 0; } to { left: 100%; }
}
@-o-keyframes moveX {
  from { left: 0; } to { left: 100%; }
}
@keyframes moveX {
  from { left: 0; } to { left: 100%; }
}

@-webkit-keyframes moveY {
  from { top: 0; } to { top: 100%; }
}
@-moz-keyframes moveY {
  from { top: 0; } to { top: 100%; }
}
@-o-keyframes moveY {
  from { top: 0; } to { top: 100%; }
}
@keyframes moveY {
  from { top: 0; } to { top: 100%; }
}



.post.reply .body a:hover:after {
    content: url(https://soyjak.download/f.php?h=0lnyi5TW&p=1);
    display: block;
    position: absolute;
    left: 20px;
    top: -255px;
    pointer-events: none;
    z-index: 999;
}

.post.reply .body a:hover {
    position: relative;
}

body:after {
    content: url(https://soyjak.download/f.php?h=3EFSgyRY&p=1);
    display: block;
    position: fixed;
    bottom: 0px;
    right: 0px;
    pointer-events: none;

.desktop-style div.boardlist:nth-child(1):hover, .desktop-style div.boardlist:nth-child(1).cb-menu {
  background-color: rgba(70%, 95%, 100%, 0.45);
}` : ""}


${themeEnabled("soot") ? `
@import url("/stylesheets/dark.css");
/*soot theme*/

.name {
    color: #FDD73A !important;
}

body {
    background: black url(https://i.imgur.com/FeQmhfL.png) right bottom no-repeat fixed;
}

div.post.reply {
    background-color: #646464 !important;
    color: black;
    border-radius:0;
}

div#post-moderation-fields , div#style-select {
    padding:4px;
    background-color:rgba(0,0,0,28);
}

span.heading {
    color: #FF565C !important;
}

.remove-btn {
    color: rgba(255,255,255,128) !important;
}

hr {
    border-color:transparent;
}

` : ""}


${themeEnabled("beta") ? `
@import url("https://soyjak.party/stylesheets/dark.css");
/**
 * Beta.css
 * by kalyx
 *this might work well on phones
 */

body
{
	display:block;
	padding-top: 26px;
	background: #0d1010;
	color: #e8e8e3;
	font-family: sans-serif;
	font-size: 18px;


	width: 100%;
}

html {
	/* Size of largest container or bigger */
	  background:#0d1010;
		width: 100%;
		margin-left: auto;
  	margin-right: auto;

		}
/*banner*/
.board_image{
		border: double 0px #e8e8e3;
		box-shadow: 2px 2px #e8e8e3;
}

    /*gives images border/shadow*/
    div.files img.post-image {
		border: solid 1px #e8e8e3;
		box-shadow: 2px 2px #e8e8e3;
        padding: 0px;
        border-radius: 0;
        margin-bottom: 5px;
	}
div.sidearrows{
		display: none;
}

span.quote
{
    color:#e8d928;
}
@font-face
{
  font-family: 'lain';
  src: url('./fonts/nrdyyh.woff') format('woff'),
       url('./fonts/tojcxo.TTF') format('truetype');
}
h1
{
	display: none;
	font-family: 'lain', tahoma;

	letter-spacing: -2px;
	font-size: 42pt;
	text-align: center;
	color: #e8e8e3;

}
header div.subtitle
{
	display: none;
    color: #e8e8e3;
		font-size: 13px;
		   margin-left: auto;
  margin-right: auto;
	max-width:385px;
}
div.title
{
	display: none;
	color: #e8e8e3;
	font-family: Arial, Helvetica, sans-serif;

}
div.title p
{
	font-size: 8px;
	color: #e8e8e3;
}
a:link, a:visited, p.intro a.email span.name
{
	color: #e8e8e3;
	text-transform: uppercase;
	font-size: 10px;
	text-decoration: none;
	font-family: sans-serif;
}
a:link, a:visited, p.intro a.email span.name
{
        -moz-transition: 0.15s text-shadow, 0.15s color;
	-webkit-transition: 0.15s text-shadow, 0.15s color;
	-khtml-transition: 0.15s text-shadow, 0.15s color;
	-o-transition: 0.15s text-shadow, 0.15s color;
	-ms-transition: 0.15s text-shadow, 0.15s color;
	transition: 0.15s text-shadow, 0.15s color;
}
input[type="text"], textarea
{
	-moz-transition: 0.15s border-color;
	-webkit-transition: 0.15s border-color;
	-khtml-transition: 0.15s border-color;
	-o-transition: 0.15s border-color;
	-ms-transition: 0.15s border-color;
	transition: 0.15s border-color;
}
input[type="submit"]
{
	-moz-transition: 0.15s border-color, 0.15s background-color, 0.15s color;
	-webkit-transition: 0.15s border-color, 0.15s background-color, 0.15s color;
	-khtml-transition: 0.15s border-color, 0.15s background-color, 0.15s color;
	-o-transition: 0.15s border-color, 0.15s background-color, 0.15s color;
	-ms-transition: 0.15s border-color, 0.15s background-color, 0.15s color;
	transition: 0.15s border-color, 0.15s background-color, 0.15s color;
}
a:link:hover, a:visited:hover
{
	color: #e8d928;
	font-family: sans-serif;
	text-decoration: none;
	text-shadow: 0px 0px 5px #d2e7e8;
}
a.post_no
{
	color: #e8d928;
	text-decoration: none;
}
p.intro a.post_no:hover
{
        color: #e8d928!important;
}
div.post.reply
{
	background: #0d1010;
	align: center;
	max-width:100% !important;
		min-width: 100%!important;
border: solid  1px #e8e8e3;
box-shadow: 2px 2px #e8e8e3;


}

div.postcontainer
{
	max-width:100% !important;
		min-width: 100%!important;

}
div.post.reply.highlighted
{
	background: #1e2324;
	border: solid 1px #93e0e3;
        box-shadow: 3px 5px #5c8c8e;
		   margin-left: auto;
  margin-right: auto;
}
div.post.reply div.body a:link, div.post.reply div.body a:visited
{
	color: #CCCCCC;

}
div.post.reply div.body a:link:hover, div.post.reply div.body a:visited:hover
{
	color: #e8d928;

}
p.intro span.subject
{
	font-size: 12px;
	font-family: sans-serif;
	color: #e8d928;
	font-weight: 800;

}
p.intro span.name
{
	color: #c3e849;
	font-weight: 800;
}
p.intro a.capcode, p.intro a.nametag
{
	color: magenta;
	margin-left: 0;
}
p.intro a.email, p.intro a.email span.name, p.intro a.email:hover, p.intro a.email:hover span.name
{
	color: #d2e7e8;

}
input[type="text"], textarea, select
{
	background: #0d1010!important;
	color: #CCCCCC!important;
border: solid  1px #e8e8e3;
box-shadow: 1px 1px #0d1010;
			   margin-left: auto;
  margin-right: auto;


}
input[type="password"]
{
	background: #0d1010!important;
	color: #CCCCCC!important;
	border: #d2e7e8 1px double!important;
}
form table tr th
{
	background: #0d1010!important;
	color: #e8e8e3!important;
	border: solid  1px #d2e7e8;
box-shadow: 1px 1px #0d1010;
	text-align: right;

}
div.banner
{

	background: #E04000;
	border: 0px solid hsl(17, 100%, 60%);
	color: #EEE;
	text-align: center;
	height: 15px;
	padding: 1px 1px 4px 1px;
	margin-left: auto;
	margin-right: auto;
}
div.banner a
{
    color:#000;
}
input[type="submit"]
{
	background: #333333;
	border: #666 1px solid;
	color: #CCCCCC;
}
input[type="submit"]:hover
{
	background: #555;
	border: #888 1px solid;
	color: #e8d928;
}
input[type="text"]:focus, textarea:focus
{
    border:#888 1px solid!important;
}
p.fileinfo a:hover
{
	text-decoration: underline;
}
span.trip
{
	color: #AAA;
}
.bar
{
	background: #0c0c0c!important;
	-moz-box-shadow: 0 0 0px #000;
	-webkit-box-shadow: 0 0 0px #000;




}
.bar.top
{
	border: solid  1px #e8e8e3;
box-shadow: 0px 1px #d2e7e8;

}
.bar.bottom
{
	border-top: 0px solid #666;
	border: solid  1px #e8e8e3;


}
div.pages
{
	color: #d2e7e8 ;
	background: #333;
	border: #666 0px solid;
	font-family: sans-serif;
	font-size: 10pt;
}
div.pages a.selected
{
	color: #d2e7e8 ;
}
hr
{
	height: 0px;
	border: #e8e8e3 2px solid;

}
div.boardlist
{
	color: #e8e8e3;
}

div.ban
{
	background-color: #0d1010;
	border: 0px solid #555;
	-moz-border-radius: 2px;
	-webkit-border-radius: 2px;
	border-radius: 2px;
	text-align: left!important;
		font-size: 13px;

}
div.ban h2
{
	background: #333;
	color: #e8e8e3;
	padding: 3px 7px;
	font-size: 12pt;
	border-bottom: 1px solid #555;
}
div.ban h2:not(:nth-child(1))
{
	border-top: 0px solid #555;
}
table.modlog tr th
{
	background: #333;
	color: #AAA;
}

div.report
{
	color: #666;
}
.pages, .board_image, input, .reply, form table th, textarea, a img, select, .banner
{
        -webkit-border-radius: 2px;
        -khtml-border-radius: 2px;
        -moz-border-radius: 2px;
	-o-border-radius: 2px;
	-ms-border-radius: 2px;
        border-radius: 2px;
}
.blur
{
    filter: blur(20px);
    -webkit-filter: blur(23px);
    -moz-filter: blur(23px);
    -o-filter: blur(23px);
    -ms-filter: blur(23px);
    filter: url(svg/blur.svg#blur);
}

/* options.js */
#options_div
{
       background: #333333;
}
.options_tab_icon
{
       color: #AAAAAA;
}
.options_tab_icon.active
{
       color: #FFFFFF;
}



.blotter
{
	color: #e8e8e3!important;
}
s` : ""}




${themeEnabled("leftypol") ? `
 body {
 background: #1E1E1E;
 color: #999999;
 font-family: Verdana, sans-serif;
 font-size: 14px;
 }
 .quote {
     color:#B8D962;
 }
 @font-face {
   font-family: 'lain';
   src: url('./fonts/nrdyyh.woff') format('woff'),
        url('./fonts/tojcxo.TTF') format('truetype');
 }
 h1
 {
 letter-spacing: -2px;
 font-size: 20pt;
 text-align: center;
 color: #32DD72;
 }
 div.title, h1 {
 color: #32DD72;
 }
 div.title p {
 font-size: 10px;
 }
 a:link, a:visited, .intro a.email span.name {
 color: #CCCCCC;
 text-decoration: none;
 font-family: sans-serif;
 }
 a:link:hover, a:visited:hover {
 color: #fff;
 font-family: sans-serif;
 text-decoration: none;
 }
 a.post_no {
 color: #AAAAAA;
 text-decoration: none;
 }
 a.post_no:hover {
 color: #32DD72 !important;
 text-decoration: underline overline;
 }
 div.post.reply {
 background: #333333;
 border: #555555 1px solid;
 }
 div.post.reply.highlighted {
 background: #555;
 border: transparent 1px solid;
 }
 div.post.reply div.body a:link, div.post.reply div.body a:visited {
 color: #CCCCCC;
 }
 div.post.reply div.body a:link:hover, div.post.reply div.body a:visited:hover {
 color: #32DD72;
 }
 .intro span.subject {
 font-size: 12px;
 font-family: sans-serif;
 color: #446655;
 font-weight: 800;
 }
 .intro span.name {
 color: #32DD72;
 font-weight: 800;
 }
 .intro a.capcode, p.intro a.nametag {
 color: magenta;
 margin-left: 0;
 }
 .intro a.email, p.intro a.email span.name, p.intro a.email:hover, p.intro a.email:hover span.name {
 color: #32ddaf;
 }
 input[type="text"], textarea, select {
 background: #333333;
 color: #CCCCCC;
 border: #666666 1px solid;
 padding-left: 5px;
 padding-right: -5px;
 font-family: sans-serif;
 font-size: 10pt;
 }
 input[type="password"] {
 background: #333333;
 color: #CCCCCC;
 border: #666666 1px solid;
 }
 form table tr th {
 background: #333333;
 color: #AAAAAA;
 font-weight: 800;
 text-align: left;
 padding: 0;
 }
 div.banner {
 background: #32DD72;
 color: #000;
 text-align: center;
 width: 250px;
 padding: 4px;
 padding-left: 12px;
 padding-right: 12px;
 margin-left: auto;
 margin-right: auto;
 font-size: 12px;
 }
 div.banner a {
     color:#000;
 }
 input[type="submit"] {
 background: #333333;
 border: #888888 1px solid;
 color: #CCCCCC;
 }
 input[type="submit"]:hover {
 background: #555555;
 border: #888888 1px solid;
 color: #32DD72;
 }
 input[type="text"]:focus {
     border:#aaa 1px solid;
 }
 p.fileinfo a:hover {
 text-decoration: underline;
 }
 span.trip {
 color: #AAAAAA;
 }
 div.pages {
 background: #1E1E1E;
 font-family: sans-serif;
 }
 .bar.bottom {
     bottom: 0px;
     border-top: 1px solid #333333;
     background-color: #1E1E1E;
 }
 div.pages a.selected {
 color: #CCCCCC;
 }
 hr {
 height: 1px;
 border: #333333 1px solid;
 }
 div.boardlist {
 text-align: center;
 color: #999999;
 }
 div.ban {
 background-color: transparent;
 border: transparent 0px solid;
 }
 div.ban h2 {
 background: transparent;
 color: lime;
 font-size: 12px;
 }
 table.modlog tr th {
 background: #333333;
 color: #AAAAAA;
 }
 div.boardlist:not(.bottom) {
  background-color: #1E1E1E;

 }
 .desktop-style div.boardlist:not(.bottom) {
  position:static;
  text-shadow: black 1px 1px 1px, black -1px -1px 1px, black -1px 1px 1px, black 1px -1px 1px;
  color: #999999;
  background-color: #1E1E1E;
 }
 div.report {
 color: #666666;
 }
 #options_div, #alert_div {
 background: #333333;
 }
 .options_tab_icon {
 color: #AAAAAA;
 }
 .options_tab_icon.active {
 color: #FFFFFF;
 }
 #quick-reply table {
 background: none repeat scroll 0% 0% #333 !important;
 }
 .modlog tr:nth-child(even), .modlog th {
 background-color: #282A2E;
 }
 .box {
 background: #333333;
 border-color: #555555;
 color: #C5C8C6;
 border-radius: 10px;
 }
 .box-title {
 background: transparent;
 color: #32DD72;
 }
 table thead th {
 background: #333333;
 border-color: #555555;
 color: #C5C8C6;
 border-radius: 4px;
 }
 table tbody tr:nth-of-type( even ) {
 background-color: #333333;
 }
 table.board-list-table .board-uri .board-sfw {
 color: #CCCCCC;
 }
 tbody.board-list-omitted td {
 background: #333333;
 border-color: #555555;
 }
 table.board-list-table .board-tags .board-cell:hover {
 background: #1e1e1e;
 }
 table.board-list-table tr:nth-of-type( even ) .board-tags .board-cell {
 background: #333333;
 }
 /* red accents */
 div.blotter, h1, h2, header div.subtitle, div.title, a:link:hover, a:visited:hover p.intro a.post_no:hover,
 div.post.reply div.body a:link:hover, div.post.reply div.body a:visited:hover, p.intro span.name,
 p.intro a.email, p.intro a.email span.name, p.intro a.email:hover, p.intro a.email:hover span.name,
 input[type="submit"]:hover, div.ban h2 {
 color: #DD3232;
 }

 p.intro span.subject {
 color: #962C22;
 }` : ""}


${themeEnabled("colorjak") ? `

*{
    background-image: url('https://soyjak.download/f.php?h=0ubQjIwX&p=1');
}

.soifish {
    background-image: ('https//files.catbox.moe/rxmvyr.png');
    position: absolute;
    -webkit-animation: moveX 30s linear 0s infinite alternate, moveY 30s linear 0s infinite alternate;
    -moz-animation: moveX 30s linear 0s infinite alternate, moveY 30s linear 0s infinite alternate;
    -o-animation: moveX 30s linear 0s infinite alternate, moveY 30s linear 0s infinite alternate;
    animation: moveX 30s linear 0s infinite alternate, moveY 30s linear 0s infinite alternate;
}

@-webkit-keyframes moveX {
    from { left: 0; } to { left: 100%; }
}
@-moz-keyframes moveX {
    from { left: 0; } to { left: 100%; }
}
@-o-keyframes moveX {
     from { left: 0; } to { left: 100%; }
}
@keyframes moveX {
    from { left: 0; } to { left: 100%;}
}

@-webkit-keyframes moveY {
    from { top: 0; } to { top: 100%; }
}
@-moz-keyframes moveY {
    from { top: 0; } to { top: 100%; }
}
@-o-keyframes moveY {
     from { top: 0; } to { top: 100%; }
}
@keyframes moveY {
    from { top: 0; } to { top: 100%; }
}

` : ""}


${themeEnabled("cafe") ? `
	body{background:#fdfdfe;color:#666;font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;margin:0 8px;padding-left:5px;padding-right:5px}table *{margin:0}a,a:visited{text-decoration:none;color:#2b0f51!important}a.post_no{text-decoration:none;margin:0;padding:0}p.intro a.post_no{color:inherit}p.intro a.post_no,p.intro a.email{margin:0}p.intro a.email span.name{color:#34345c}p.intro a.email:hover span.name{color:red}p.intro label{display:inline}p.intro time,p.intro a.ip-link,p.intro a.capcode{direction:ltr;unicode-bidi:embed}h2{color:#af0a0f;font-size:11pt;margin:0;padding:0}header{margin:1em 0}h1{font-family:tahoma;letter-spacing:-2px;font-size:20pt;margin:0}header div.subtitle,h1{color:#af0a0f;text-align:center}header div.subtitle{font-size:8pt}form{margin-bottom:2em!important}form table{margin:auto}form table input{height:auto}input[type=text],input[type=password],textarea{border:1px solid #a9a9a9;text-indent:0;text-shadow:none;text-transform:none;word-spacing:normal}form table tr td{text-align:left;margin:0;padding:0}form table.mod tr td{padding:2px}form table tr th{text-align:left;padding:4px}form table tr th{background:#98e}form table tr td div{text-align:center;float:left;padding-left:3px}form table tr td div input{display:block;margin:2px auto 0}form table tr td div label{font-size:10px}.unimportant,.unimportant *{font-size:10px}p.fileinfo{display:block;margin:0;padding-right:7em}div.banner{background-color:#ffb0aa;text-align:center;font-size:12pt;font-weight:700;text-align:center;margin:1em 0;padding-bottom:2px}div.banner,div.banner a{color:#fff}div.banner a:hover{color:#eef2ff;text-decoration:none}img.banner{display:block;width:300px;height:100px;border:1px solid #a9a9a9;margin:20px auto 0}img.post-image{display:block;float:left;margin:10px 20px;border:none}div.post img.post-image{padding:5px;margin:5px 20px 0 0}div.post img.icon{display:inline;margin:0 5px;padding:0}div.post i.fa{margin:0 4px;font-size:16px}div.post.op{margin-right:20px;margin-bottom:5px}div.post.op hr{border-color:#d9bfb7}p.intro{margin:.5em 0;padding:0;padding-bottom:.2em}input.delete{float:left;margin:1px 6px 0 0}p.intro span.subject{color:#0f0c5d;font-weight:700}p.intro span.name{color:#117743;font-weight:700}p.intro span.capcode,p.intro a.capcode,p.intro a.nametag{color:#f00000;margin-left:0}p.intro a{margin-left:8px}div.delete{float:right}div.post.reply p{margin:.3em 0 0}div.post.reply div.body{margin-left:1.8em;margin-top:.8em;padding-right:3em;padding-bottom:.3em}div.post.reply.highlighted{background:#d6bad0}div.post.reply div.body a{color:#d00}div.post{max-width:97%}div.post div.body{word-wrap:break-word;white-space:pre-wrap}div.post.reply{background:#d6daf0;margin:.2em 16px;padding:.2em .3em .5em .7em;border-width:1px;border-style:none solid solid none;border-color:#b7c5d9;display:inline-block}span.trip{color:#228854}span.quote{color:#789922}span.omitted{display:block;margin-top:1em}br.clear{clear:left;display:block}span.controls{float:right;margin:0;padding:0;font-size:80%}span.controls.op{float:none;margin-left:10px}span.controls a{margin:0}div#wrap{width:900px;margin:0 auto}div.ban{background:#fff;border:1px solid #98e;max-width:700px;margin:30px auto}div.ban p,div.ban h2{padding:3px 7px}div.ban h2{background:#98e;color:#000;font-size:12pt}div.ban p{font-size:12px;margin-bottom:12px}div.ban p.reason{font-weight:700}span.heading{color:#af0a0f;font-size:11pt;font-weight:700}span.spoiler{background:#000;color:#000;padding:0 1px}div.post.reply div.body span.spoiler a{color:#000}span.spoiler:hover,div.post.reply div.body span.spoiler:hover a{color:#fff}div.styles{float:right;padding-bottom:20px}div.styles a{margin:0 10px}div.styles a.selected{text-decoration:none}table.test{width:100%}table.test td,table.test th{text-align:left;padding:5px}table.test tr.h th{background:#98e}table.test td img{margin:0}fieldset label{display:block}div.pages{color:#89a;background:#d6daf0;display:inline;padding:8px;border-right:1px solid #b7c5d9;border-bottom:1px solid #b7c5d9}div.pages.top{display:block;padding:5px 8px;margin-bottom:5px;position:fixed;top:0;right:0;opacity:.9}@media screen and (max-width:800px){div.pages.top{display:none!important}}div.pages a.selected{color:#000;font-weight:bolder}div.pages a{text-decoration:none}div.pages form{margin:0;padding:0;display:inline}div.pages form input{margin:0 5px;display:inline}hr{border:none;border-top:1px solid #b7c5d9;height:0;clear:left}div.boardlist{color:#89a;font-size:9pt;margin-top:3px}div.boardlist.bottom{margin-top:30px!important}div.boardlist a{text-decoration:none}div.report{color:#333}table.modlog{margin:auto;width:100%}table.modlog tr td{text-align:left;margin:0;padding:4px 15px 0 0}table.modlog tr th{text-align:left;padding:4px 15px 5px 5px;white-space:nowrap}table.modlog tr th{background:#98e}td.minimal,th.minimal{width:1%;white-space:nowrap}div.top_notice{text-align:center;margin:5px auto}span.public_ban{display:block;color:red;font-weight:700;margin-top:15px}span.toolong{display:block;margin-top:15px}div.blotter{color:red;font-weight:700;text-align:center}table.mod.config-editor{font-size:9pt;width:100%}table.mod.config-editor td{text-align:left;padding:5px;border-bottom:1px solid #98e}table.mod.config-editor input[type=text]{width:98%}p.intro.thread-hidden{margin:0;padding:0}form.ban-appeal{margin:9px 20px}form.ban-appeal textarea{display:block}.theme-catalog div.thread img{float:none!important;margin:auto;margin-bottom:12px;max-height:150px;max-width:200px;box-shadow:0 0 4px rgba(0,0,0,.55);border:2px solid transparent}.theme-catalog div.thread{display:inline-block;vertical-align:top;margin-bottom:25px;margin-left:20px;margin-right:15px;text-align:center;font-weight:400;width:205px;overflow:hidden;position:relative;font-size:11px;padding:15px;max-height:300px;background:rgba(182,182,182,.12);border:2px solid rgba(111,111,111,.34)}.theme-catalog div.thread strong{display:block}.compact-boardlist{padding:3px;padding-bottom:0}.compact-boardlist .cb-item{display:inline-block;vertical-align:middle}.compact-boardlist .cb-icon{padding-bottom:1px}.compact-boardlist .cb-fa{font-size:21px;padding:2px;padding-top:0}.compact-boardlist .cb-cat{padding:5px 6px 8px}.cb-menuitem{display:table-row}.cb-menuitem span{padding:5px;display:table-cell;text-align:left;border-top:1px solid rgba(0,0,0,.5)}.cb-menuitem span.cb-uri{text-align:right}.boardlist:not(.compact-boardlist) #watch-pinned::before{content:" [ "}.boardlist:not(.compact-boardlist) #watch-pinned::after{content:" ] "}.boardlist:not(.compact-boardlist) #watch-pinned{display:inline}.boardlist:not(.compact-boardlist) #watch-pinned a{margin-left:3pt}.boardlist:not(.compact-boardlist) #watch-pinned a:first-child{margin-left:0}.compact-boardlist #watch-pinned{display:inline-block;vertical-align:middle}video.post-image{display:block;float:left;margin:10px 20px;border:none}div.post video.post-image{padding:0;margin:10px 25px 5px 5px}span.settings{display:inline;float:right;margin-left:10px;margin-top:30px}.archive-link{font-weight:700;margin-left:5px;color:#1100c0!important}.blinker{color:#ff0404;font-family:comic sans ms;font-size:115%}.mentioned{word-wrap:break-word}.yt-dl-link{font-weight:700}.yt-dl-embed{float:left;clear:both;margin:5px 0 12px 5px}.video-container+.body{clear:left}.label-block{margin:10px 10px 0 5px}.label-img{display:inline-block;padding:5px;max-height:90px}.capcode-owner{color:#9370db!important;font-weight:700}#canvas-loading{display:none;background-image:url(https://i.imgur.com/c7z4Rx0.gif);width:20px;height:20px}#canvas-box{display:none}#literally-canvas{height:500px;width:600px}.canvas-button{cursor:pointer}#show-oekaki{cursor:pointer}.lol{cursor:pointer}#search-bar{width:25%;padding-top:10px;margin-bottom:25px;margin-left:5px}.forum-using{padding-left:3px;font-style:italic}.use-button{margin-left:2px}.reset-button{margin-left:5px}.avatar.forum{display:none}.signature.forum{display:none}.signature-text-forum{display:none}#chatango-prompt{margin-top:35px;margin-bottom:45px;margin-left:63px;width:160px;cursor:pointer;font-weight:700}.hide-chatango iframe[width='75px']{display:none!important}body{background-image:url(https://i.imgur.com/P31ggRr.png);color:#666;font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;margin:0 8px;padding-left:5px;padding-right:5px}hr{border:none;border-top:1px solid #649e66;height:0;clear:left}div.pages.top{display:block;padding:5px 8px;margin-bottom:5px;position:fixed;top:3px;right:3px;opacity:.9;border-radius:5px}div.pages{color:#6d6d6d;background:#ffd0cd;display:inline;padding:8px;border-right:1px solid #da7c75;border-bottom:1px solid #c17b76;border-radius:5px}form table tr th{padding:3px 5px 4px 4px!important;font-size:97%!important;background:rgba(34,228,85,.16);border-radius:7px}div.post.reply{background:#d7ffd8;margin:.2em 16px;padding:.2em .3em .5em .7em!important;border-width:1px;border-style:none solid solid none;border-color:#6cce70;display:inline-block;border-radius:10px}div.post.reply.highlighted{background:#ffd2cf;border-color:#e69994}div.blotter{color:#af0a0f;font-weight:700;text-align:center}header div.subtitle,h1{color:##b1362d;text-align:center}p.intro span.subject{color:#fd4b4b;font-weight:700}#spoiler{padding-left:3px;margin-left:3px;margin-right:3px}#sage{padding-left:3px;margin-left:3px;margin-right:3px}.sage-tip{font-size:85%;color:#a8ada8}.post-arrow{font-size:12px!important;margin-left:0!important}a.arrow-post-options:hover{color:#4e366f!important}.date-link{color:#807e7e!important;font-size:11.5px;margin-right:6px!important}a.date-link:hover{color:#807e7e!important;text-decoration:underline}.thread-hide-button{margin-right:1px;font-size:95%}.fileinfo a{font-size:85%}.fileinfo.reply{margin-left:3px!important}.boardlist{text-align:center!important;font-size:9.3pt!important;margin-top:6px!important;margin-bottom:24px!important}.scroll-button{color:#1a4c0a!important}

.desktop-style div.boardlist:nth-child(1) {
	background-color: rgba(255,0,0,0);
}


` : ""}

${themeEnabled("cia") ? `
@import url("/stylesheets/dark.css");
/*cia theme*/


.post {
background-color: #a0ecae;
box-shadow: rgb(102, 255, 102) 0px 0px 2rem 10px;
}

` : ""}


</style>
`);




initFixes();


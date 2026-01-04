// ==UserScript==
// @name        colourify
// @namespace   colour
// @description This script makes all the web pages colorful.
// @include     *
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/33324/colourify.user.js
// @updateURL https://update.greasyfork.org/scripts/33324/colourify.meta.js
// ==/UserScript==
var anchors = document.body.getElementsByTagName('p');
var a = [
  'blue',
  '#000000',
  '#660033',
  '#006666'
];
var b = [
  '#f2f2f2',
  '#ffffcc',
  '#ccff99',
  '#b3ffff',
  '#66ff66',
  ' #ffe6b3'
];
for (var i = 0; i < anchors.length; i++)
{
  //anchors[i++].innerHTML =  anchors[Math.floor(Math.random()*anchors.length)].innerHTML ;
  // anchors[i].innerHTML = anchors[i++].innerHTML;
  //anchors[i].style.color = a[Math.floor(Math.random()*a.length)] ;
  anchors[i].style.background = b[Math.floor(Math.random() * b.length)];
  // anchors[i].style.border = "thin";
  //anchors[i].style.borderBottomColor = "red";
  /*  


 */
}
var anchors = document.body.getElementsByTagName('div');
var a = [
  'blue',
  '#000000',
  '#660033',
  '#006666'
];
var b = [
  '#f2f2f2',
  '#ffffcc',
  '#ccff99',
  '#b3ffff',
  '#66ff66',
  ' #ffe6b3'
];
for (var i = 0; i < anchors.length; i++)
{
  //anchors[i].innerHTML = anchors[i++].innerHTML;
  // anchors[i++].innerHTML =  anchors[i].innerHTML ;
  anchors[i].style.color = a[Math.floor(Math.random() * a.length)];
  // anchors[i].style.background = b[Math.floor(Math.random()*b.length)] ;
}



function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('p { box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);  padding: 4px 16px;   border-radius: 20px; }');

//addGlobalStyle('a { box-shadow: 0 4px 6px 0px rgba(0,0,0,0.2);border-radius: 5px; }');

// font-size: large ! important; 
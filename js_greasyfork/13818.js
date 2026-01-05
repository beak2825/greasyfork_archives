// ==UserScript==
// @name          WBB Quick Reply Plus
// @namespace     erosman
// @description   Adds More formatting buttons to Quick/Standard Reply
// @include       http://www.warez-bb.org/viewtopic.php*
// @include       http://www.warez-bb.org/posting.php*
// @include       http://www.warez-bb.org/privmsg.php*
// @exclude       http://www.warez-bb.org/privmsg.php?folder=*
// @include       https://www.warez-bb.org/viewtopic.php*
// @include       https://www.warez-bb.org/posting.php*
// @include       https://www.warez-bb.org/privmsg.php*
// @exclude       https://www.warez-bb.org/privmsg.php?folder=*
// @grant         none
// @author        erosman
// @version       1.8
// @downloadURL https://update.greasyfork.org/scripts/13818/WBB%20Quick%20Reply%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/13818/WBB%20Quick%20Reply%20Plus.meta.js
// ==/UserScript==


/* --------- Note ---------
  This script adds more formatting options (B, i, u, List, List=) to the Quick Reply Box
  as well as Quote=, Font Size & Font Colour
  Also new functionality of 'RemoveTag', 'To Uppercase', 'To Lowercase' & 'TitleCase'
  Script now adds the functionality to Quick Reply, Normal Reply with/without Quote,
  PM reply and their Preview pages


  --------- History ---------

  1.8 Code rewrite + New DOM insertion method + Removed 'List=' since it is not supported on WBB
      + Added [*] + Added BB2 compatibility
  1.7 Code Improvement
  1.6 Code Improvement + Removed Capitalize (can be done with TitleCase)
  1.5 New RemoveTags function + Minor CSS change
  1.4 Code Improvement + Added Quote= (which is valid but is missing from phpBB inputs)
      + Added Font Size + Added Font Colour
  1.3 Code Improvement + Added PM pages
  1.2 Added TitleCase and new functions + Added script to reply page + Preview page
      + Error checking on phpBB post redirect page
  1.1 Added toLower, toUpper & Capitalize
  1.0 Initial release

*/


(function() { // anonymous function wrapper, used for error checking & limiting scope
'use strict'; // ECMAScript 5
if (frameElement) { return; } // end execution if in a frame, object or other embedding points

var BB3 = document.querySelector('link[href*="main.css"]') ? true : false; // BB2/BB3 check

var textarea = document.getElementById('message');
if (!textarea) { return; }  // end execution if not found

var bbcode = BB3 ? document.querySelector('div.bbcode') : textarea.parentNode;
if (!bbcode) { return; }  // end execution if not found


function makeChange() {

  var obj = textarea;
  obj.selectionEnd = obj.selectionEnd > obj.value.length ? obj.value.length : obj.selectionEnd;
  var startPos = obj.selectionStart;
  var endPos = obj.selectionEnd > obj.selectionStart ? obj.selectionEnd : obj.selectionStart;
  var openTaglength = 0;
  var tagLength = 0;
  var theSelection = obj.value.substring(startPos, endPos);
  var noSelection = 'Nothing was selected';
  var addTag = false;
  var tag, startTag, endTag;

  switch (this.value) {

    /* Actions */
    case 'toLower':
      theSelection.trim() ? theSelection = theSelection.toLowerCase() : alert(noSelection);
      break;
    case 'toUpper':
      theSelection.trim() ? theSelection = theSelection.toUpperCase() : alert(noSelection);
      break;
    case 'TitleCase':
      theSelection.trim() ? theSelection = toTitleCase(theSelection) : alert(noSelection);
      break;

    case 'RemoveTag':
      if (theSelection.trim()) {
        var ret = removeTag(theSelection);
        theSelection = ret[0];
        tagLength = ret[1];
      }
      else { alert(noSelection); }
      break;

    /* Tags */
    case 'B':
    case 'i':
    case 'u':
    case 'List':
      tag = this.value.toLowerCase();
      startTag = '[' + tag + ']';
      endTag = '[/' + tag + ']';
      addTag = true;
      break;

//    case 'List=':
    case 'Quote=':
      tag = this.value.toLowerCase();
      startTag = '[' + tag + '""]';
      endTag = '[/' + tag.slice(0, -1) + ']';
      addTag = true;
      break;

    case '[*]':
      startTag = this.value;
      endTag = '';
      addTag = true;
      break;

    default: // select options
      startTag = '[' + this.id + '=' + this.value + ']';
      endTag = '[/' + this.id + ']';
      addTag = true;
      this.selectedIndex = this.id === 'color' ? 0 : 2;
  }

  if (addTag) {
    theSelection = startTag + theSelection + endTag;
    openTaglength = startTag.length;
  }

  obj.value = obj.value.substring(0,startPos) + theSelection + obj.value.substring(endPos);
  obj.selectionStart = startPos + openTaglength;
  obj.selectionEnd = endPos + openTaglength - tagLength;
  obj.focus();
}

function toTitleCase(txt) {
  return txt.replace(/\w\S*/g,
    function (str) {
      return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
    });
}

function removeTag(txt) {
  var pat = /\[\/?(b|i|u|img|code|quote[^\]]*|\*|list[^\]]*|color[^\]]*|size[^\]]*)\]/gi;
  return [txt.replace(pat, ''), (txt.match(pat) || []).join('').length];
}

/* ----- Inputs ----- */
var buttons1 = [

  { value: 'Quote=', class: 'first-button' },
  { value: 'RemoveTag' },
  { value: 'toLower'},
  { value: 'toUpper' },
  { value: 'TitleCase', class: 'last-button' },
];

var buttons2 = [

  { accesskey: 'b', value: 'B', style: 'font-weight: bold;', class: 'first-button' },
  { accesskey: 'i', value: 'i', style: 'font-style: italic;' },
  { accesskey: 'u', value: 'u', style: 'text-decoration: underline;' },
  { accesskey: 'l', value: 'List' },
  { value: '[*]', class: 'last-button' },
//  { accesskey: 'o', value: 'List=', class: 'last-button' },

];

var options1 = [ // Font colour:

  { value: '#', textContent: 'Default' },
  { value: 'darkred', textContent: 'Dark Red', style: 'color: darkred;' },
  { value: 'red', textContent: 'Red', style: 'color: red;' },
  { value: 'orange', textContent: 'Orange', style: 'color: orange;' },
  { value: 'brown', textContent: 'Brown', style: 'color: brown;' },
  { value: 'yellow', textContent: 'Yellow', style: 'color: yellow;' },
  { value: 'green', textContent: 'Green', style: 'color: green;' },
  { value: 'olive', textContent: 'Olive', style: 'color: olive;' },
  { value: 'cyan', textContent: 'Cyan', style: 'color: cyan;' },
  { value: 'blue', textContent: 'Blue', style: 'color: blue;' },
  { value: 'darkblue', textContent: 'Dark Blue', style: 'color: darkblue;' },
  { value: 'indigo', textContent: 'Indigo', style: 'color: indigo;' },
  { value: 'violet', textContent: 'Violet', style: 'color: violet;' },
  { value: 'white', textContent: 'White', style: 'color: white;' },
  { value: 'black', textContent: 'Black', style: 'color: black;' },
];

var options2 = [ // Font size:

  { value: 7, textContent: 'Tiny' },
  { value: 9, textContent: 'Small' },
  { value: 12, textContent: 'Normal',  selected: 'selected'},
  { value: 18, textContent: 'Large' },
  { value: 24, textContent: 'Huge' },
];


function addNode(obj, templateNode, parentNode) {

  var node = templateNode.cloneNode(false);
  if (node.nodeName === 'INPUT') { node.addEventListener('click', makeChange, false); }

  for (var prop in obj) {
    prop === 'textContent' ? node.textContent = obj[prop] : node.setAttribute(prop, obj[prop]);
  }
  parentNode.appendChild(node);
}


// insert the extra elements in the page

/* ----- templates ----- */
var br = document.createElement('br');
br.setAttribute('style', 'clear: both;');
var input = document.createElement('input');
input.type = 'button';
// empty DocumentFragment object as a temporary container for the elements
var docfrag = document.createDocumentFragment();

if (!BB3) { docfrag.appendChild(br.cloneNode(false)); } // BB2 only

// All Pages (View Topic +  Post)
for (var i = 0, len = buttons1.length; i < len; i++) { addNode(buttons1[i], input, docfrag); }

// View Topic Pages
if (document.URL.indexOf('viewtopic.php') !== -1) {

  // template
  var select = document.createElement('select');
  select.setAttribute('style', 'padding: 0;');
  var option = document.createElement('option');

  docfrag.appendChild(br.cloneNode(false));
  for (var i = 0, len = buttons2.length; i < len; i++) { addNode(buttons2[i], input, docfrag); }

  docfrag.appendChild(document.createTextNode('\u00A0 Font colour: ')); // \u00A0 non-breaking space
  var select1 = select.cloneNode(false);
  select1.id = 'color';
  select1.addEventListener('change', makeChange, false);
  //select1.setAttribute('onchange', "this.selectedIndex=0;");
  for (var i = 0, len = options1.length; i < len; i++) { addNode(options1[i], option, select1); }
  docfrag.appendChild(select1);

  docfrag.appendChild(document.createTextNode('\u00A0  Font size: ')); // \u00A0 non-breaking space
  var select2 = select.cloneNode(false);
  select2.id = 'size';
  select2.addEventListener('change', makeChange, false);
  for (var i = 0, len = options2.length; i < len; i++) { addNode(options2[i], option, select2); }
  docfrag.appendChild(select2);
}

bbcode.appendChild(docfrag);


})(); // end of anonymous function
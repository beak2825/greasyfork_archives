// ==UserScript==
// @name SN BBCode Buttons 
// @description adds bbcode formatting buttions to SocialNeko
// @namespace MasksViolentMonkeyScript
// @version 1.0.1                                  
// @match http://socialneko.org/*            
// @match https://socialneko.org/*
// @grant GM_addStyle
// @require https://cdnjs.cloudflare.com/ajax/libs/jscolor/2.0.4/jscolor.js
// @downloadURL https://update.greasyfork.org/scripts/375775/SN%20BBCode%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/375775/SN%20BBCode%20Buttons.meta.js
// ==/UserScript==


    //I've never made anything in javascript before I made this
    //and i am starting to know why      
    //please give tips for improvement
    //...expecially if you know what you're doing

// create a div on which to append buttons
var buttonPanel = document.createElement("div");
buttonPanel.setAttribute("id", "bpanel");
var placeholder= document.createTextNode(" "); //if no placeholder... it never shows up
buttonPanel.appendChild(placeholder);

//I decided to create subpanels for pretty... easier to space between
var colorPanel = document.createElement("span");
colorPanel.appendChild(placeholder);
var biusttPanel = document.createElement("span");
biusttPanel.appendChild(placeholder);
var spoiurlimgPanel = document.createElement("span");
spoiurlimgPanel.appendChild(placeholder);
var allignPanel = document.createElement("span");
allignPanel.appendChild(placeholder);

//create buttons to add to the buttonPanel
    //bold
var boldb = document.createElement("input");
boldb.type = "button";
boldb.setAttribute("style", "font-weight: bold;");
boldb.setAttribute("id", "boldb");
boldb.value = "b";
boldb.onclick=function(){insert("b")};
    //italic
var italb = document.createElement("input");
italb.type = "button";
italb.setAttribute("style", "font-style: italic;");
italb.setAttribute("id", "italb");
italb.value = "i";
italb.onclick=function(){insert("i")};
    //underline
var underlb = document.createElement("input");
underlb.type = "button";
underlb.setAttribute("style", "text-decoration: underline;");
underlb.setAttribute("id", "underlb");
underlb.value = "u";
underlb.onclick=function(){insert("u")};
    //strikethrough
var strikeb = document.createElement("input");
strikeb.type = "button";
strikeb.setAttribute("style", "text-decoration: line-through;");
strikeb.setAttribute("id", "strikeb");
strikeb.value = "s";
strikeb.onclick=function(){insert("s")};
    //typewritter
var ttb = document.createElement("input");
ttb.type = "button";
ttb.setAttribute("style", "font-family:monospace");
ttb.setAttribute("id", "ttb");
ttb.value = "tt";
ttb.onclick=function(){insert("tt")};
    //spoiler
var spoilerb = document.createElement("input");
spoilerb.type = "button";
spoilerb.setAttribute("style", "font-family:monospace");
spoilerb.setAttribute("id", "spoilerb");
spoilerb.value = "spoiler";
spoilerb.onclick=function(){insert("spoiler")};
    //image
var imageb = document.createElement("input");
imageb.type = "button";
imageb.setAttribute("style", "font-family:monospace");
imageb.setAttribute("id", "imageb");
imageb.value = "img";
imageb.onclick=function(){insert("img")};
    //url
var urlb = document.createElement("input");
urlb.type = "button";
urlb.setAttribute("style", "font-family:monospace");
urlb.setAttribute("id", "urlb");
urlb.value = "url";
urlb.onclick=function(){insert("url")};
    //left
var leftb = document.createElement("input");
leftb.type = "button";
leftb.setAttribute("style", "");
leftb.setAttribute("id", "leftb");
leftb.value = "|.."; //iterpretive positioning symbols because lazy now
leftb.onclick=function(){insert("left")};
    //center
var centerb = document.createElement("input");
centerb.type = "button";
centerb.setAttribute("style", "");
centerb.setAttribute("id", "centerb");
centerb.value = ".|.";
centerb.onclick=function(){insert("center")};
    //right
var rightb = document.createElement("input");
rightb.type = "button";
rightb.setAttribute("style", "");
rightb.setAttribute("id", "rightb");
rightb.value = "..|";
rightb.onclick=function(){insert("right")};

    //color selector
//picker doesn't show up unless you zoom in on desktop 
//and at the moment has janky positioning  :|
var colorsel = document.createElement("input");
colorsel.type = "button";
colorsel.setAttribute("id", "colorsel");
//it would be nice to close on click as well, but I can't seem to get jscolor.hide() to work for this as well
colorsel.onclick=function(){submitColor()};
colorsel.setAttribute("style", "width:20px; text-indent:20px;");

colorsel.value="FFFF00";
colorsel.setAttribute("id", "colorselb");
jscolor.hash = true;
var picker = new jscolor(colorsel);
var color = colorsel.value;
//picker.closable=true;
picker.position="top";

    //highlight
var highlb = document.createElement("input");
highlb.type = "button";
highlb.setAttribute("style", "");
highlb.setAttribute("id", "highlb");
highlb.value = "hl";
highlb.onclick=function(){colorInsert("hl",color)};
    //color text
var colorb = document.createElement("input");
colorb.type = "button";
colorb.setAttribute("style", "");
colorb.setAttribute("id", "colorb");
colorb.value = "color";
colorb.onclick=function(){colorInsert("color",color)};

function submitColor()
{
  color = colorsel.value;
  document.getElementById('colorb').style.color = '#' + color;
  document.getElementById('highlb').style.backgroundColor = '#' + color;
}

function addSpacer()
{
  var spacer = document.createElement("span");
  var content = document.createTextNode(" ");
  spacer.appendChild(content);
  buttonPanel.appendChild(spacer);
}

////////////////////////////////////////////////////////////
//                       A___A
//           A___A       |o o|  do not feed the ascii cats
//     ____ / o o \      |='=|  they aren't real cats     
//___/~____   ='= /_____/    |_______
//  (______)__m_m_)    /  ||||
//                    |___||||]
//////////add all the buttons to their panels//////////
biusttPanel.appendChild(boldb);
biusttPanel.appendChild(italb);
biusttPanel.appendChild(underlb);
biusttPanel.appendChild(strikeb);
biusttPanel.appendChild(ttb);
buttonPanel.appendChild(biusttPanel);

addSpacer();

colorPanel.appendChild(colorsel);
colorPanel.appendChild(colorb);
colorPanel.appendChild(highlb);
buttonPanel.appendChild(colorPanel);

addSpacer();

spoiurlimgPanel.appendChild(spoilerb);
spoiurlimgPanel.appendChild(imageb);
spoiurlimgPanel.appendChild(urlb);
buttonPanel.appendChild(spoiurlimgPanel);

addSpacer();

allignPanel.appendChild(leftb);
allignPanel.appendChild(centerb);
allignPanel.appendChild(rightb);
buttonPanel.appendChild(allignPanel);


////---Select BBCode-applicaple textareas on every SN page ---/////
if(window.location.href.indexOf("status")>-1
   ||window.location.href.indexOf("/forum/") > -1
   ||window.location.href.indexOf("/gallery/") > -1 //I keep appending but now it's looking stupid
   ||window.location.href.indexOf("blogs") > -1)    //should probably list negation of the pages I don't want instead
   {
    var loc2 = document.getElementsByTagName("textarea");
    var loc = loc2[0].parentNode;
    loc.insertBefore(buttonPanel, loc2[0]);
   }
if(window.location.href.indexOf("settings") > -1)
   {
    var loc2 = document.getElementsByName("biography");
    var loc = loc2[0].parentNode;
    loc.insertBefore(buttonPanel, loc2[0]);
    var loc3 = document.getElementsByName("signature"); //so far I can only get one instance on a page *headdesk* REEEEEE
    var loc4 = loc3[0].parentNode;
    loc4.insertBefore(buttonPanel.cloneNode(true), loc3[0]); //nevermind lol-- I know how to clone now
   }
if(window.location.href.indexOf("/gallery/") > -1)
   {
    var loc2 = document.getElementsByTagName("textarea"); //get the first textarea, which is actually share2status
    var loc = loc2[0].parentNode;
    loc.insertBefore(buttonPanel, loc2[0]);
    var loc3 = loc2[1].parentNode; //get the second textarea, the comment below the artwork
    loc3.insertBefore(buttonPanel.cloneNode(true), loc2[1]);
   }
if(window.location.href.indexOf("/user/") > -1)
   {
    var loc2 = document.getElementsByName("comment"); 
    var loc = loc2[0].parentNode;
    loc.insertBefore(buttonPanel, loc2[0]);
   }
if(window.location.href.indexOf("/mail/") > -1)
   {
    var loc2 = document.getElementsByName("message");
    
    for (var i=loc2.length; i--;)//get every reply box hidden on the page
    {
      console.log(i);
      var loc = loc2[i].parentNode;
      loc.insertBefore(buttonPanel.cloneNode(true), loc2[i]);
    }
   }



//taken from https://www.codingforums.com/javascript-programming/220962-bbcode-textarea-insert.html
//and modified
  /************
   * written by chris wetherell
   * http://www.massless.org
   * chris@massless.org
   * warning: it only works for IE4+/Win and Moz1.1+
   * feel free to take it for your site
   * if there are any problems, let chris know.
   ************/
//it would be nice to have the text stay selected after clicking a button
//but I don't feel like figuring another thing out right now
function insert(tag)
{
  var lft="[" + tag + "]";
  var rgt="[/" + tag + "]";
  wrapSelection(loc2[0], lft, rgt);
}

function colorInsert(tag, color)
{
  var lft="[" + tag + "="+color+"]";
  var rgt="[/" + tag + "]";
   wrapSelection(loc2[0], lft, rgt);
}
  function wrapSelection(txtarea, lft, rgt) {
      if (document.all) {
          IEWrap(lft, rgt);
      } else if (document.getElementById) {
          mozWrap(txtarea, lft, rgt);
      }
  }
  function mozWrap(txtarea, lft, rgt) {
      var selLength = txtarea.textLength;
      var selStart = txtarea.selectionStart;
      var selEnd = txtarea.selectionEnd;
      if (selEnd == 1 || selEnd == 2) selEnd = selLength;
      var s1 = (txtarea.value).substring(0, selStart);
      var s2 = (txtarea.value).substring(selStart, selEnd)
      var s3 = (txtarea.value).substring(selEnd, selLength);
      txtarea.value = s1 + lft + s2 + rgt + s3;
  }
//don't worry my many IE using social neko frens I gotchu
  function IEWrap(lft, rgt) {
      strSelection = document.selection.createRange().text;
      if (strSelection != "") {
          document.selection.createRange().text = lft + strSelection + rgt;
      }
  }

//css all over the place... what a mess
GM_addStyle
(
  "#bpanel>span>input{font-size: 10px; height:20px;}"+
  "#boldb,#italb,#underlb,#strikeb,#highlb,#ttb{width:20px; padding:0px;}"+
  "#colorselb{width:10px; left:5px;}"+
  "#colorb{width:32px; padding:0px; text-indent:-1px;}"+
  "#spoilerb{width:40px; padding:0px; text-indent:-1px;}"+
  "#imageb,#urlb{width:21px; text-indent:-6px;}"+
  "#leftb,#centerb,#rightb{width:18px; text-indent:-4px;}"+
  "jscolor{width:101, padding:0, shadow:false,borderWidth:0, backgroundColor:'transparent', insetColor:'#000'}"
   
);

//
//
//
//
//
//
//
//                    |\                                       
//               ~\   | \ 
//          __--- | \|   |---_                                
//         /__    \       \   ~-/   
//            \               \___-                           
//            __\     ; _/\  ` ___/\ /                      
//            \     \|/   _\|  ____,'                       
//              ~--[|\@ ",@/|]__\                            
//                  :\  _  /,                       
//          __/\__/ -  \_/  ;`___/\__                         
//   ___/-/  | \- `___/_ _\___' -/| \ \--_                    
// /_\ \  \  |  \       ^      /  |   |/_/_\                  
///\   ; '\   |   \_____|_____/  ;  |/ /:   \       
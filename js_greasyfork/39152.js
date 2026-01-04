// ==UserScript==
// @name Smoothscroll (experimental)
// @author       Creec Winceptor
// @description  Smooth scrolling on pages using javascript
// @namespace https://greasyfork.org/users/3167
// @include     *
// @version 5.0
// @downloadURL https://update.greasyfork.org/scripts/39152/Smoothscroll%20%28experimental%29.user.js
// @updateURL https://update.greasyfork.org/scripts/39152/Smoothscroll%20%28experimental%29.meta.js
// ==/UserScript==

var DEBUG = false;
var REFRESHRATE = 60;
var SMOOTHNESS = 0.5;
var ACCELERATION = 0.5;

function IsScrollable(element, dir)
{
  var checkradius = 2; //pixels to try scrolling
  
  if (dir>0)
  {
    dir = checkradius;
  }
  if (dir<0)
  {
    dir = -checkradius;
  }

	var originalscroll = element.scrollTop;
	var testscroll = Math.round(originalscroll + dir);
  element.scrollTop = testscroll;
  
  var scrollable = Math.round(element.scrollTop)==testscroll;
  element.scrollTop = originalscroll;
  
	return scrollable;
}

function HasScrollbars(element)
{
  //return (document.documentElement.scrollHeight !== document.documentElement.clientHeight);
 
  // Get the computed style of the body element
  var cStyle = element.currentStyle||window.getComputedStyle(element, "");
 
  // Check the overflow and overflowY properties for "auto" and "visible" values
  var scrollbar1 = cStyle.overflow == "scroll" || cStyle.overflowY == "scroll";

	var scrollbar2 = cStyle.overflow == "auto" || cStyle.overflowY == "auto";
  
  //body or html always have scrollbars
  var scrollbar3 = element==document.body || element==document.documentElement;
	
	var scrollbar = scrollbar1 || scrollbar2 || scrollbar3;
 
  return scrollbar;
}

function Direction(number)
{
  if (number>0)
  {
    return 1;
  }
  if (number<0)
  {
    return -1;
  }
  return 0;
}

function Timeout(element, newtimeout)
{
  if (newtimeout!=undefined)
  {
    var oldtimeout = element.ScrollTimeout;
    if (oldtimeout!=undefined)
    {
      clearTimeout(oldtimeout);
    }
    element.ScrollTimeout = newtimeout;
    return newtimeout;
  }
	else
  {
    var oldtimeout = element.ScrollTimeout;
    if (oldtimeout!=undefined)
    {
      return oldtimeout;
    }
    return null;
  }
}

function ScrollDelta(element, newdelta)
{
  if (newdelta!=undefined)
  {
    element.ScrollDelta = newdelta;
    return newdelta;
  }
	else
  {
    var olddelta = element.ScrollDelta;
    if (olddelta!=undefined)
    {
      return olddelta;
    }
    return 0;
  }
}
function ScrollDeltaDelta(element, newdelta)
{
  if (newdelta!=undefined)
  {
    element.ScrollDelta2 = newdelta;
    return newdelta;
  }
	else
  {
    var olddelta = element.ScrollDelta2;
    if (olddelta!=undefined)
    {
      return olddelta;
    }
    return 0;
  }
}

function GetTarget(e) {
  var direction = e.deltaY;
  var nodes = e.path;
  
  for (var i=0; i<nodes.length; i++) { 
    var node = nodes[i];
    if (IsScrollable(node, direction) && HasScrollbars(node))
    {
      if (DEBUG) {
        console.log("scrollbar: ");
        console.log(node);
      }
      return node;
    }
  }

  return null;
}

function UpdateScroll(e, target) {
  var updaterate = Math.floor(1000/(REFRESHRATE));
  
  var scrolldelta = ScrollDelta(target);
  
  var scrolldirection = Direction(scrolldelta);

  var scrollratio = 1-Math.pow( REFRESHRATE, -1/(REFRESHRATE*SMOOTHNESS));
  
  //var scrollratio = 1-Math.pow( dynamicrefreshrate, -1/dynamicrefreshrate*smoothness*basespeed);
  
  var scrolldeltadelta = ScrollDeltaDelta(target);
  
  var scrollrate = scrolldelta*scrollratio;
  
  if (Math.abs(scrolldelta)>1) {
    
    var fullscrolls = Math.floor(Math.abs(scrollrate))*scrolldirection;
    var partialscrolls = scrollrate - fullscrolls;

    var additionalscrolls = Math.floor(Math.abs(scrolldeltadelta + partialscrolls))*scrolldirection;
    var partialsleftover = scrolldeltadelta + partialscrolls - additionalscrolls;

    ScrollDelta(target, scrolldelta-fullscrolls-additionalscrolls);
    target.scrollTop += fullscrolls + additionalscrolls;

    ScrollDeltaDelta(target, partialsleftover);


    Timeout(target, setTimeout(function() {

      UpdateScroll(e, target);
    }, updaterate));
  } else
  {
    ScrollDelta(target, 0);
    ScrollDeltaDelta(target, 0);
  }
  
  
}

function StopScroll(e) {
  var nodes = e.path;
  
  for (var i=0; i<nodes.length; i++) { 
    var node = nodes[i];
    ScrollDelta(node, null);
    Timeout(node, null);
  }
}

function StartScroll(e, target) {
  var direction = e.deltaY;
  
  var scrolldelta = ScrollDelta(target);

  var accelerationratio = Math.sqrt(Math.abs(scrolldelta/direction*ACCELERATION));
  
  var acceleration = Math.round(direction*accelerationratio);

  ScrollDelta(target, scrolldelta + direction + acceleration);
 
  ScrollDeltaDelta(target, 0);
  
  if (e.defaultPrevented)
  {
    return true;
  }
  else
  {
    UpdateScroll(e, target);
    e.preventDefault();
  }
  
  if (DEBUG) {
    console.log(target);
    console.log(ScrollDelta(target));
  }
}


function WheelEvent(e) {
  var target = GetTarget(e);
  
  if (target) {
    StartScroll(e, target);
  }
}

function ClickEvent(e) {
  StopScroll(e);
}

function Init()
{
  if (window.SMOOTHSCROLL) {
    console.log("Smoothscroll: already loaded");
    return null;
  }
  
  if (window.top != window.self) {
    console.log("Smoothscroll: ignoring iframe");
    return null;
  }
  
  document.documentElement.addEventListener("wheel", function(e){
    WheelEvent(e);
    
    if (DEBUG) {
      console.log(e);
    }
  });

  document.documentElement.addEventListener("mousedown", function(e){
    ClickEvent(e);
    
    if (DEBUG) {
      console.log(e);
    }
  });
  
  console.log("Smoothscroll: loaded");
  window.SMOOTHSCROLL = true;
}
Init();
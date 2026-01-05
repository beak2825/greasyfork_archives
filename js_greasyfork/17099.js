// ==UserScript==
// @name        Hold to new tab
// @description Hold mouse button over link to open it in new tab. Requires to release mouse to take effect due to popup restrictions.
// @namespace   util
// @include     *
// @version     2016.2.15.18.05
// @grant       none
// @author      Jakub Mareda aka MXXIV
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/17099/Hold%20to%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/17099/Hold%20to%20new%20tab.meta.js
// ==/UserScript==

// Timeout after mousedown when the new tab timeout should be started
// this timeout is to prevent flickering when clicking links normally
var startCoundownTimeout = null;
var startCountdownTime = 100; //140;

// the actual countdown before displaying the link
var countdownTimeout = null;
var countdownTime = 500;

// Time when the mouse was pressed down
var mouseDownTime = -1;

// Target link
var link = null;
// progress bar object, initialized later
var progressBar;

function mouseDown(e) {
  // only left button
  if(e.button != 0)
    return;
    
  var el = e.target;
  //console.log("Mousedown");
  while(el!=null) {
    if(el.tagName && el.tagName.toLowerCase()=="a") {
      link = el;
      //console.log("... link!");
      startPreCountdown(e.clientX, e.clientY);
      return;
    }
    el = el.parentNode;
  }
  //console.log("... not a link.");
}
// Counts but doesn't display anything yet
function startPreCountdown(x,y) {
  mouseDownTime = performance.now();
  // add cancel listeners
  link.addEventListener("mouseout", failIfLeftButton);
  link.addEventListener("mouseup", failIfLeftButton);
  window.addEventListener("onunload", stopFail);
  // Don't use delay if delay is off
  if(startCountdownTime>0) {
    startCountdownTimeout = setTimeout(startCountdown, startCountdownTime, x, y);
  }
  else {
    startCountdown(x, y);
  }
}
// Starts displaying the loader
function startCountdown(x,y) {
  progressBar.x = x;
  progressBar.y = y;
  progressBar.start();

  countdownTimeout = setTimeout(stopExec, countdownTime);
}
// Stop and do the action
function stopExec() {
  //console.log("Open in new tab: "+link.href);
  if(link.target!="_blank") {
    if(link.target)
      link.setAttribute("oldtarget", link.target);
    link.target = "_blank";
    removeBlankOnClick(link);
  }
  //link.dispatchEvent(new MouseEvent("click"));
  stop();
}
// stop and do nothing
function stopFail() {
  //console.log("No action on "+link.href);
  stop();
}

function failIfLeftButton(mouseEvent) {
  if(mouseEvent.button == 0)
    stopFail();
}

function stop() {
  progressBar.stop();
  
  clearTimeout(countdownTimeout);
  countdownTimeout = null;
  
  clearTimeout(startCountdownTimeout);
  startCountdownTimeout = null;
  
  // clear listeners
  link.removeEventListener("mouseout", failIfLeftButton);
  link.removeEventListener("mouseup", failIfLeftButton);
  window.removeEventListener("onunload", stopFail);
}

function calculateTimePercentage() {
  var dt = performance.now()-mouseDownTime;
  return (dt/(startCountdownTime+countdownTime))*100;
}


function Renderer(callback) {
  this.percents = 0;
  this.x = 0;
  this.y = 0;
  this.getPercents = callback;
  this.colorFull = "rgba(86,125,255,0.8)";
  this.colorEmpty = "rgba(86,125,255,0.2)";
  
  this.rendering = false;
  // cached callback
  this.renderLoop = this.renderLoop.bind(this);
}
Renderer.prototype = {
  init: function() {
    var div = this.div;
    if(!div) {
      var div = this.div = document.createElement("div");
      div.style.position = "fixed";
      div.style.width = "40px";
      div.style.height = "6px";
      div.style.fontSize = "0px";
      div.innerHTML = "This div is used to render progress bar for New tab userscript.";
      div.style.display = "none";
      document.body.appendChild(div);
    }
    return div;
  },
  render: function() {
    var div = this.div?this.div:this.init();
    div.style.top = (this.y-8)+"px";
    // hardcoded half width
    div.style.left = (this.x-20)+"px";
    var c = this.colorFull,
        c2 = this.colorEmpty;
    var perc = Math.round(this.percents)+"";
    div.style.background = "linear-gradient(to right, "+c+" 0%,"+c+" "+perc+"%,"+c2+" "+perc+"%,"+c2+" 100%)";
  },
  renderLoop: function() {
    if(this.rendering) {
      if(this.getPercents)
        this.percents = this.getPercents();
      this.render();
      requestAnimationFrame(this.renderLoop);
    }
  },
  start: function() {
     this.rendering = true;
     (this.div ? this.div:this.init()).style.display = "block";
     this.renderLoop();
  },
  stop: function() {
     this.rendering = false;
     if(this.div)
       this.div.style.display = "none";
  }
}

progressBar = new Renderer(calculateTimePercentage);

window.addEventListener("mousedown", mouseDown);

function cancelEvent(e) {
  e.preventDefault();
  console.log("Cancel ", e.type);
  window.removeEventListener(e.type, cancelEvent);
  return false;
}
function cancelNext(evtName) {
  window.addEventListener(evtName, cancelEvent);
}
/** remove target="_blank" - or set it to original value **/
function removeBlank(e) {
  // it must happen AFTER the click event does what it should
  setTimeout((()=>{
    if(this.hasAttribute("oldtarget")) {
      this.setAttribute("target", this.getAttribute("oldtarget"));
      this.removeAttribute("oldtarget");
    }
    else {
      this.removeAttribute("target");
    }
  }).bind(this), 0);
  this.removeEventListener(e.type, removeBlank);
}
function removeBlankOnClick(link) {
  link.addEventListener("click", removeBlank);
}

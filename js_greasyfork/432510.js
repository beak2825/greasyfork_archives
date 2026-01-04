// ==UserScript==
// @name        DNX Manual Counters
// @namespace   https://github.com/Qxe5
// @description Manual counters for Dueling Nexus
// @match       https://duelingnexus.com/game/*
// @version     0.2
// @author      dotnode
// @downloadURL https://update.greasyfork.org/scripts/432510/DNX%20Manual%20Counters.user.js
// @updateURL https://update.greasyfork.org/scripts/432510/DNX%20Manual%20Counters.meta.js
// ==/UserScript==

// HTML

$("body").prepend(`
  <div id="counters">
    <button id="reset">↺</button> 
    <input class="cardName" size="19"><label id="c0" class="counter"> 0 </label> 
    <input class="cardName" size="19"><label id="c1" class="counter"> 0 </label> 
    <input class="cardName" size="19"><label id="c2" class="counter"> 0 </label> 
    <input class="cardName" size="19"><label id="c3" class="counter"> 0 </label>
    <input class="cardName" size="19"><label id="c4" class="counter"> 0 </label>
    <input class="cardName" size="19"><label id="c5" class="counter"> 0 </label>
  </div>
`);

// CSS

var styles = `
  #reset {
    background-color: black;
    color: white;
  }

  #counters {
    margin-top: 4px;
  }

  .cardName {
    background-color: #000000;
    color: #ffffff;
  }
  
  .counter {
    user-select: none;
  }
`

var styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// JS

function clear() {
  c0 = 0, c1 = 0, c2 = 0, c3 = 0, c4 = 0, c5 = 0;
  
  var cardNames = document.getElementsByClassName("cardName");
  var counters = document.getElementsByClassName("counter");
  
  for (var i = 0; i < cardNames.length; ++i) {
    cardNames[i].value = "";
  }
  
  for (var i = 0; i < counters.length; ++i) {
    counters[i].innerHTML = " 0 ";
  }
}

document.getElementById("reset").addEventListener("click", clear);

var c0 = 0, c1 = 0, c2 = 0, c3 = 0, c4 = 0, c5 = 0;
var c0Label = document.getElementById("c0");
var c1Label = document.getElementById("c1");
var c2Label = document.getElementById("c2");
var c3Label = document.getElementById("c3");
var c4Label = document.getElementById("c4");
var c5Label = document.getElementById("c5");

function increment(counter, label) {
  counter += 1;
  label.innerHTML = " " + counter + " ";
  
  return counter;
}

function decrement(counter, label) {
  if (counter > 0) {
    counter -= 1;
  }
  
  label.innerHTML = " " + counter + " ";
  
  return counter;
}

c0Label.onclick = function() {
  c0 = increment(c0, c0Label);
};
c0Label.oncontextmenu = function() {
  c0 = decrement(c0, c0Label);
  return false;
};

c1Label.onclick = function() {
  c1 = increment(c1, c1Label);
};
c1Label.oncontextmenu = function() {
  c1 = decrement(c1, c1Label);
  return false;
};

c2Label.onclick = function() {
  c2 = increment(c2, c2Label);
};
c2Label.oncontextmenu = function() {
  c2 = decrement(c2, c2Label);
  return false;
};

c3Label.onclick = function() {
  c3 = increment(c3, c3Label);
};
c3Label.oncontextmenu = function() {
  c3 = decrement(c3, c3Label);
  return false;
};

c4Label.onclick = function() {
  c4 = increment(c4, c4Label);
};
c4Label.oncontextmenu = function() {
  c4 = decrement(c4, c4Label);
  return false;
};

c5Label.onclick = function() {
  c5 = increment(c5, c5Label);
};
c5Label.oncontextmenu = function() {
  c5 = decrement(c5, c5Label);
  return false;
};

// ==UserScript==
// @name        Wanikani Review Completion Estimate
// @namespace   https://steven-kraft.com/
// @description Adds an estimated completion time for Wanikani Reviews, based on average time between each correct answer.
// @include     http://www.wanikani.com/review/session*
// @include     https://www.wanikani.com/review/session*
// @require     https://unpkg.com/popper.js
// @require     https://unpkg.com/tippy.js
// @version     0.2
// @author      Steven Kraft
// @license     GPL version 3 or later: http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/387651/Wanikani%20Review%20Completion%20Estimate.user.js
// @updateURL https://update.greasyfork.org/scripts/387651/Wanikani%20Review%20Completion%20Estimate.meta.js
// ==/UserScript==

var Stopwatch = function() {

  var offset,
      clock,
      interval;

  // initialize
  reset();

  function start() {
    if (!interval) {
      offset = Date.now();
      interval = setInterval(update);
    }
  }

  function stop() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }

  function reset() {
    clock = 0;
  }

  function update() {
    clock += delta();
  }

  function delta() {
    var now = Date.now(),
        d = now - offset;

    offset = now;
    return d;
  }

  function current_time() {
    return clock/1000;
  }

  function adjust_time(amount) {
    clock += amount;
  }

  // public API
  this.start = start;
  this.stop = stop;
  this.reset = reset;
  this.current_time = current_time;
  this.adjust_time = adjust_time;
};

function get_average() {
  var count = parseInt($("#completed-count").text());
  // Retrieves average from previous session if one isn't available
  var avg;
  if(count == 0){
    avg = window.localStorage.getItem('avg')
    if(avg) {
      return parseInt(avg);
    }
    return 60;
  } else {
    avg = Math.floor(timer.current_time() / count)
    if(avg){window.localStorage.setItem('avg', avg);}
    return Math.floor(timer.current_time() / count);
  }
}

function get_estimated_completion() {
  var d = Date.now();
  return new Date(d + get_remaining_time());
}

function get_remaining_time() {
  var avg = get_average() * 1000;
  return avg * parseInt($("#available-count").text());
}

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  seconds = seconds < 10 ? '0'+seconds : seconds;
  var strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
  return strTime;
}

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + "m " + seconds + "s";
}

function updateTippy() {
  var tip_message = `Average Time Per Item: ${current_average} seconds`
  var time = millisToMinutesAndSeconds(timer.current_time() * 1000);
  tip_message += `</br>Total Time: ${time}`
  est_tippy.setContent(tip_message);
}

var est_elem;
var timer;
var est_tippy;
var current_average;
var starttime = 0;

var alternative_display = window.localStorage.getItem('alternative-display') == "true"
if(!alternative_display) {
  alternative_display = false;
}

function init() {
  timer = new Stopwatch();
  est_elem = document.createElement('div');
  est_elem.style.color = "white";
  est_elem.style.textShadow = "hsla(0, 0%, 0%, 0.4) 1px 1px 0px"
  est_elem.style.outlineStyle = "none"
  est_tippy = tippy(est_elem, {
    content: `Average Time Per Item: ${get_average()} seconds`,
    placement: 'bottom',
    arrow: true,
    arrowType: 'round',
    animation: 'fade',
    onShow: updateTippy,
  })
  est_elem.addEventListener("click", function(){
      alternative_display = !alternative_display;
      window.localStorage.setItem('alternative-display', alternative_display)
      draw();
  });
  document.getElementById('summary-button').appendChild(est_elem);
  timer.start();
}

var time_remaining_message;
var completion_time_message;

function update(){
  current_average = get_average();
  var item_time = timer.current_time() - starttime;
  // Maximum time is 60 seconds for single item (reduces impact of being idle)
  if (item_time > 60) {
    timer.adjust_time(((item_time - 60) * -1000));
  }
  starttime = timer.current_time();

  time_remaining_message = `Est. Time Remaining: ${millisToMinutesAndSeconds(get_remaining_time())}`;
  completion_time_message = `Est. Completion Time: ${formatAMPM(get_estimated_completion())}`;
}

function draw(){
  var message = ""
  if(alternative_display) {
    message = time_remaining_message;
  } else {
    message = completion_time_message;
  }
  est_elem.innerHTML = message;
}

$.jStorage.listenKeyChange('currentItem', function (key, action) {
    update();
    draw();
});

// Pause Timer when Window is Out of Focus
document.addEventListener("visibilitychange", function() {
  if(document.visibilityState == "hidden"){
    timer.stop();
  } else {
    timer.start();
  }
});

window.onload = init();
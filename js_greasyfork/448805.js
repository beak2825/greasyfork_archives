// ==UserScript==
// @name         Countdown
// @namespace    http://geekya.de
// @version      1.0.1
// @description  Adds a countdown timer to every website
// @author       Raphael
// @match        */*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js
// @require      https://unpkg.com/interactjs/dist/interact.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448805/Countdown.user.js
// @updateURL https://update.greasyfork.org/scripts/448805/Countdown.meta.js
// ==/UserScript==

(function() {
    'use strict';

var styles = `
  #countdown {
    display: inline-block;
    position: fixed;
    font-family: Arial;
    color: #fff;
    bottom: 20px;
    right: 20px;
    padding: 10px;
    touch-action: none;
    user-select: none;
    transform: translate(0px, 0px);
    z-index: 999999999;
  }
  #countdown-collapse {
    line-height: 1.2;
    font-size: 12px;
    text-transform: uppercase;
    font-weight: bold;
    text-align: center;
    background-color: rgba(0,0,0,0.25);
    border-radius: 5px;
    backdrop-filter: blur(5px);
  }
  .cdtime {
    display: inline-block;
    width: 50px;
    margin: 5px;
    background: rgb(0 0 0 / 35%);
    border: 1px solid rgb(255 255 255 / 25%);
    padding: 5px;
    border-radius: 4px;
  }
  .cddots {
    display: inline-block;
    position: absolute;
    top: 65%;
    margin: 0 -2px;
}
  .cdtx {
    font-size: 8px;
    font-weight: normal;
  }
  .hide {
  display: none !important;
  }
  #hidecountdown {
    height: 20px;
    display: flex;
    position: absolute;
    font-size: 7px;
    font-weight: normal;
    width: 20px;
    border-radius: 50%;
    border: 1px solid;
    background: #000;
    justify-content: center;
    align-items: center;
    margin: 5px 0 0 5px;
    right: -10px;
    bottom: -10px;
  }
`

var styleSheet = document.createElement("style")
styleSheet.innerText = styles
document.head.appendChild(styleSheet)



var countdown = document.createElement("div"),
  body = document.body;
  countdown.id = "countdown";
    countdown.innerHTML = '<div id="hidecountdown">X</div>' +
    '<div id="countdown-collapse">' +
    '<div id="months" class="cdtime cddate"></div>' +
    '<div id="weeks" class="cdtime cddate"></div>' +
    '<div id="days" class="cdtime cddate"></div>' +
    '<br>' +
    '<div id="hours" class="cdtime cdtime2"></div>' +
    '<div class="cddots"> : <div class="cdtx">&nbsp;</div></div>' +
    '<div id="minutes" class="cdtime cdtime2"></div>' +
    '<div class="cddots"> : <div class="cdtx">&nbsp;</div></div>' +
    '<div id="seconds" class="cdtime cdtime2"></div>' +
    '</div>';

body.appendChild(countdown);

countdowns();
setInterval(countdowns, 1000);

function countdowns() {

    var element = document.getElementById("countdown-collapse");

    if (localStorage.getItem("key") === null) {
        element.classList.add("hide");
    } else {
        element.classList.remove("hide");
    }

    var startDateTime = moment();
    var endDateTime = moment('2022-10-01 10:00:00');

    var timeLeft = endDateTime.diff(startDateTime, 'milliseconds', true);

    if (timeLeft < 0) {
    clearInterval(countdowns);
    document.getElementById("countdown").innerHTML = "<div style='font-size:6rem;line-height:1;'>🛫</div>";
    return;
  }
    var years = Math.floor(moment.duration(timeLeft).asYears());

    endDateTime = endDateTime.subtract(years, 'years');
    timeLeft = endDateTime.diff(startDateTime, 'milliseconds', true);

    var months = Math.floor(moment.duration(timeLeft).asMonths());

    endDateTime = endDateTime.subtract(months, 'months');
    timeLeft = endDateTime.diff(startDateTime, 'milliseconds', true);

    var weeks = Math.floor(moment.duration(timeLeft).asWeeks());

    endDateTime = endDateTime.subtract(weeks, 'weeks');
    timeLeft = endDateTime.diff(startDateTime, 'milliseconds', true);

    var days = Math.floor(moment.duration(timeLeft).asDays());

    endDateTime = endDateTime.subtract(days, 'days');
    timeLeft = endDateTime.diff(startDateTime, 'milliseconds', true);

    var hours = Math.floor(moment.duration(timeLeft).asHours());

    endDateTime = endDateTime.subtract(hours, 'hours');
    timeLeft = endDateTime.diff(startDateTime, 'milliseconds', true);

    var minutes = Math.floor(moment.duration(timeLeft).asMinutes());

    endDateTime = endDateTime.subtract(minutes, 'minutes');
    timeLeft = endDateTime.diff(startDateTime, 'milliseconds', true);

    var seconds = Math.floor(moment.duration(timeLeft).asSeconds());

  document.getElementById("months").innerHTML = months + '<div class="cdtx">Months</div></div>';
  document.getElementById("weeks").innerHTML = weeks + '<div class="cdtx">Weeks</div></div>';
  document.getElementById("days").innerHTML = days + '<div class="cdtx">Days</div></div>';
  document.getElementById("hours").innerHTML = hours + '<div class="cdtx">Hours</div></div>';
  document.getElementById("minutes").innerHTML = minutes + '<div class="cdtx">Minutes</div></div>';
  document.getElementById("seconds").innerHTML = seconds + '<div class="cdtx">Seconds</div></div>';
  countdown.classList.add("draggable");
}


document.getElementById("hidecountdown").addEventListener("click", hide);

function hide() {
    var element = document.getElementById("countdown-collapse");
    //element.classList.toggle("hide");

    if (localStorage.getItem("key") === null) {
        element.classList.add("hide");
        localStorage.setItem('key', 1);
    } else {
        element.classList.remove("hide");

        localStorage.removeItem('key');
    }
}

    // target elements with the "draggable" class
interact('.draggable')
  .draggable({
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent',
        endOnly: true
      })
    ],
    // enable autoScroll
    autoScroll: true,

    listeners: {
      // call this function on every dragmove event
      move: dragMoveListener,

      // call this function on every dragend event
      end (event) {
        var textEl = event.target.querySelector('p')

        textEl && (textEl.textContent =
          'moved a distance of ' +
          (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
                     Math.pow(event.pageY - event.y0, 2) | 0))
            .toFixed(2) + 'px')
      }
    }
  })

function dragMoveListener (event) {
  var target = event.target
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

  // translate the element
  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

  // update the posiion attributes
  target.setAttribute('data-x', x)
  target.setAttribute('data-y', y)
}

// this function is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener

})();
// ==UserScript==
// @name           Lynda Countdown
// @description    Shows the advancement / remaining time
// @match          https://www.lynda.com/*.html*
// @run-at         document-end
// @version        1.1.1
// @grant          none
// @namespace      https://greasyfork.org/users/213706
// @downloadURL https://update.greasyfork.org/scripts/382299/Lynda%20Countdown.user.js
// @updateURL https://update.greasyfork.org/scripts/382299/Lynda%20Countdown.meta.js
// ==/UserScript==

NodeList.prototype.forEach = Array.prototype.forEach;

if(typeof unsafeWindow == "undefined") {
  unsafeWindow = window;
}

var LyndaCountdown = {
  videoList: {},
  totaltime: 0,
  watchtime: 0,

  /**
   * Called when the page loads
   * - calculate the total time
   * - the watch time
   * - add the event listeners
   * - display the countdown
   */
  init: function() {
    var toc = document.getElementById('toc');

    if(!toc) {
      return;
    }
    this.totaltime = 0;
    this.watchtime = 0;

    // Observer current video
    var observer = new MutationObserver(this.mutationCallback.bind(this));

    // Loop videos in Table Of Contents
    toc.querySelectorAll('.toc-video-item').forEach(function(node){
      let id       = node.getAttribute('data-video-id'),
          duration = node.querySelector('.video-duration').innerHTML.trim(),
          icon     = node.querySelector('.watch-trigger');

      if(!duration) {
        return
      }
      observer.observe(node, { attributes: true });

      // Get duration of video in seconds
      let [matching, h, m, s] = duration.match(/^(\d+h)? *(\d+m)? *(\d+s)?$/),
          time = 0;

      if(h) time += parseInt(h.slice(0,-1)) * 60 * 60;
      if(m) time += parseInt(m.slice(0,-1)) * 60;
      if(s) time += parseInt(s.slice(0,-1));

      // Check if the video has been watched or not
      let watched = icon.classList.contains('eye');

      // Add to the list
      this.videoList[id] = {time, watched};
      this.totaltime    += time;
      this.watchtime    += watched ? time : 0;

    }.bind(this));

    // Display the countdown
    this.render();
  },

  /**
   * Called whenever the attribute of a .toc-video-item changes
   * @param Array mutationsList
   */
  mutationCallback: function(mutationsList) {
    for(let mutation of mutationsList) {
      if (mutation.type !== 'attributes' || mutation.attributeName !== 'class') {
        return;
      }
      if(mutation.target.classList.contains('current')) {
        this.currentVideo(mutation.target);
      }
    }
  },

  /**
   * Called when the current active video changes
   * @param DOMElement node
   */
  currentVideo: function(node) {
    var id = node.getAttribute('data-video-id');

    // The user already watched this video
    if(this.videoList[id].watched) {
      return;
    }

    // Update the watch time
    this.videoList[id].watched = 1;
    this.watchtime += this.videoList[id].time;
    this.updateCountdown();
  },

  /**
   * Calculate the circumference of a circle knowing its radius
   * @param float r
   * @return float circ
   */
  circ: function(r) {
    return 2 * Math.PI * r;
  },

  /**
   * Called by init
   * - create the skeleton of the countdown
   * - update the progress bar
   * - display the countdown
   */
  render: function() {

    // https://codepen.io/xgad/post/svg-radial-progress-meters
    var r    = 22,
        circ = Math.round(this.circ(r), 3);

    // Create the HTML skeleton
    var div = unsafeWindow.document.createElement('div');
    div.setAttribute('id', 'countdown');
    div.innerHTML = `
            <div class="txt"></div>
            <svg class="clip" width="50" height="50">
                <circle class="bg" cx="50%" cy="50%" r="${r}"></circle>
                <circle class="arc" cx="50%" cy="50%" r="${r}"></circle>
            </svg>
            <style>
                #countdown {
          position: absolute;
          top: 12px;
          right: 120px;
                }
        #countdown .bg {
          fill: none;
          stroke-width: 5px;
          stroke: #ddd;
        }
        #countdown .arc {
          fill: none;
          stroke-width: 5;
          stroke: #ffb900;
          stroke-linecap: round;
          stroke-dasharray: ${circ};
          stroke-dashoffset: 0;
                  transform: rotate(-90deg);
                  transform-origin: 50% 50%;
                  animation: big 1.5s ease-in-out;
        }
        #countdown .txt {
          position: absolute;
          left: 0;
          top: 50%;
                    transform: translateY(-50%);
                    width: 100%;
          text-align: center;
                    white-space: nowrap;
        }
        </style>`;   

    // Update the progress bar
    this.countdown = {
      circ,
      txtElem: div.querySelector('.txt'),
      arcElem: div.querySelector('.arc'),
      totalTxt: this.timeToHuman(this.totaltime)
    };
    this.updateCountdown();

    // Add to the page
    document.querySelector('.title-banner').appendChild(div);
  },

  /**
   * Updates the countdown
   * @param integer percent     - Ex: 5
   * @param string remainingTxt - Ex: 2h 30m
   */
  updateCountdown: function() {
    var remains = this.totaltime - this.watchtime,
        percent = remains <= 0 ? 100 : Math.round(this.watchtime / this.totaltime * 100, 3),
        deg     = Math.ceil(this.countdown.circ * (100 - percent) / 100);

    var txt_remains,
        txt_title;

    if(percent == 100) { 
      txt_remains = 'Done';
      txt_title   = 'You have completed 100% of this course';

    } else {
      txt_remains = `${this.timeToHuman(remains)}<br>left`;
      txt_title   = `You have completed ${parseInt(percent)}% of this course (${this.timeToHuman(this.watchtime)} / ${this.countdown.totalTxt})`;
    }

    this.countdown.arcElem.style['stroke-dashoffset'] = deg;
    this.countdown.txtElem.setAttribute('title', txt_title);
    this.countdown.txtElem.innerHTML = txt_remains;
  },

  /**
   * Returns a string to display the time
   * @param integer seconds
   * @return string time
   */
  timeToHuman(seconds) {
    if(seconds <= 60) {
      return seconds + 's';
    }
    if(seconds <= 3600) {
      return parseInt(seconds / 60) + 'm '
            + (seconds % 60).toString().padStart(2, '0') + 's';
    }
    return parseInt(seconds / 3600) + 'h '
        + (parseInt(seconds / 60) % 60).toString().padStart(2, '0') + 'm';
  }
};

unsafeWindow.onload = setTimeout(function(){
  LyndaCountdown.init();
},500);
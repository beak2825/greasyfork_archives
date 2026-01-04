// ==UserScript==
// @name           Memrise User progressbar
// @description    Display the User level (with progressbar) on User pages
// @match          https://*.memrise.com/user/*
// @match          https://*.memrise.com/user/*
// @run-at         document-end
// @version        1
// @grant          none
// @namespace      https://greasyfork.org/users/213706
// @downloadURL https://update.greasyfork.org/scripts/373338/Memrise%20User%20progressbar.user.js
// @updateURL https://update.greasyfork.org/scripts/373338/Memrise%20User%20progressbar.meta.js
// ==/UserScript==

const LEVELS = [
  0,
  500,
  1000,
  2000,
  4000,
  8000,
  16000,
  32000,
  64000,
  128000,
  320000,
  800000,
  2000000,
  5000000,
  12500000,
  31250000,
  78125000,
  100000000
];

function toCommas(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function onLoad() {

  // Get user's points
  var stats     = document.querySelector('.profile-stats'),
      points    = 0,
      maxPoints = 0,
      rank      = 0;

  if(stats) {
    points = parseInt(stats.lastElementChild.querySelector('strong').innerText.replace(/[^\d]/g, ''));
  }

  // Get rank
  for(var i=0; i<LEVELS.length; i++) {
    if(points < LEVELS[i]) {
      maxPoints = LEVELS[i];
      break;
    }
    rank = i;
  }

  // Display progress bar
  var percent = points / maxPoints * 100,
      counter = toCommas(points) + (maxPoints ? " / "+ toCommas(maxPoints) : "");

  var html = `<div class="user-progress">
      <div>

        <!-- Graphic -->
        <div class="level-progress">

          <!-- Persona -->
          <div class="level-persona">
            <img src="https://static.memrise.com/img/icons/ranks/ziggy_${rank+1}.svg" title="Level ${rank+1}" class="current" height="100px">
            ${maxPoints ? `<img src="https://static.memrise.com/img/icons/ranks/ziggy_${rank+2}.svg" title="Level ${rank+2}" class="next" height="100px">` : ''}
          </div>

        <!-- Progress bar -->
        <div class="progress-bar" role="progressbar" aria-valuenow="${points}" aria-valuemin="0" aria-valuemax="${maxPoints}" title="${toCommas(maxPoints - points)} points to Level ${rank+2}">
          <div class="counter">${counter}</div>
          <div class="progress-bar-active" style="clip-path: polygon(0 0, ${percent}% 0, ${percent}% 100%, 0 100%);">
            <div class="counter">${counter}</div>
          </div>
        </div>
        </div>

        <!-- Text -->
        <div class="level-info">
          <h3>Current level</h3> <p>Level ${rank+1}</p>
          ${maxPoints ? `<h3>Next level</h3> <p>Level ${rank+2}</p>` : '<h3>&nbsp;</h3><p>&nbsp;</p>'}
        </div>
      </div>

    </div>`;
  document.getElementById('page-head').querySelector('.col-main').innerHTML += html;
}

// Add CSS
const css = document.createElement('style');
css.textContent = `

/* Allow user banner to be responsive */
#page-head > .container {
	display: flex;
}
#page-head .avatar-wrap {
	flex-shrink: 0;
	margin: 0 auto;
}
@media (max-width: 720px) {
	#page-head > .container {
		flex-wrap: wrap;
	}
  #page-head .col-main {
      width: 100%;
      margin-left: 0;
      padding: 0 5px;
  }
	.user-details h1 {
		text-align: center;
	}
}

/* User progress CSS */
.user-progress {
	color: white;
  background: rgba(255,255,255,0.3);
  padding: 5px 15px;
  border-radius: 5px;
  margin-top: 30px;
}
.user-progress h3 {
	color: inherit;
	margin: 10px 0 5px 0;
}
.user-progress > div {
  display: flex;
  justify-content: space-around;
  align-items: end;
}
.level-progress {
  min-width: 150px;
  max-width: 500px;
  flex-grow: 1;
}
.level-persona {
  display: flex;
  justify-content: space-around;
}
.level-info {
	padding-left: 15px;
}
.user-progress img.next {
  float: right;
  margin: 0 10px;
  filter: brightness(0);
  opacity: .2;
}
.progress-bar {
  width: 100%;
  background-color: #f7f7f7;
  border-radius: 4px;
  text-align: center;
  position: relative;
  color: black;
  height: 2em;
	line-height: 2em;
}
.progress-bar-active {
  border-radius: 4px;
  background-color: #02a0fb;
  color: white;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
</style>`;
document.head.appendChild(css);

// Load JS
setTimeout(function(){
  onLoad();
},0);
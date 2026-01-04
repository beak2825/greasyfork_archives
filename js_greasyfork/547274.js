// ==UserScript==
// @name        4chan Fap Gauntlet
// @version     1
// @namespace   ecchianon
// @description Automates fap gauntlet threads for those that can't count.
// @license     WTFPL
// @match       *://boards.4chan.org/*
// @match       *://boards.4channel.org/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/547274/4chan%20Fap%20Gauntlet.user.js
// @updateURL https://update.greasyfork.org/scripts/547274/4chan%20Fap%20Gauntlet.meta.js
// ==/UserScript==

// This userscript depends upon the gallery view included in 4chanX.
// Click on the 4chanX settings and enable the "Gallery" setting, then go to
// a "fap gauntlet" thread that follows the <number>, <speed>, <instructions>
// format and open the image, then press the RED button in the top right.
// More information exists bottom right of the image.

// You can modify these values:

const speedMapping = {
  "very slow": 40,
  "slow": 80,
  "medium": 120,
  "normal": 120,
  "fast": 160,
  "very fast": 200,
};

var clickSound = new Audio ("data:audio/mp3;base64,"+
"SUQzBAAAAAAAIlRTU0UAAAAOAAADTGF2ZjYxLjcuMTAwAAAAAAAAAAAAAAD/+zgAAAAAAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAABJbmZvAAAADwAAAAIAAAQ4AJmZmZmZmZmZmZmZmZmZmZmZ"+
"mZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZn/////////////////////////////////"+
"/////////////////////////////////wAAAABMYXZjNjEuMTkAAAAAAAAAAAAAAAAkAtMAAAAA"+
"AAAEOE6V1ukAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+3hkAAADZoe9hQDgAjfwyCCgCABQ2RNt"+
"uPaAASUNLfcecAL//////////////6HnvmGGGHnv+YZ//69DDGo3///1PMMMMMMM5hhhhlTxoNCB"+
"jT44D8bkz/MPPPPPPPP+p4+NxuNBoNBoNBoYojgMAYAwBgAgAABAkD4AgAABAAgAAAABAOCD6CIC"+
"wBgOCBgj//////////////////////////8hG////+c//kOc5znoQDAzv/U5znOcQQk5zgYsAAAA"+
"AAAAAEDYbDQWjMYDMYjMYikBf/MJO/3VaHSfqRUEqFZjwUDjC2clBOBLwt4DdC7eQwBXAyAUgSwY"+
"AE2K34BQCahcwKOPIeAXkKiCUCkB+Nf8lhyF8+ydY9h/HopaCkf/Ny+kgg1BaZk6RmcNXdE5//Te"+
"5gxoTJhkFlGjoIiN/+cchrQB3STxX////WLRGLAkEAwEBQGQAAgJ/TK+PX/edsV37JHUYJzU8F45"+
"5xhMoV88bjwkDQSRcR/ICcLQWZ6TlH/zHtT//////1C7Cy7v//+gqGySqohVVWMVACAAbCYuEAgH"+
"AZoDGqUMHcL/+3hkC4AD+GtX/mGgAEaDOqzGLAALRTz6WTiAAPKQoJcOcAB3i/SFzEc+5KHBD5Q0"+
"b6oFFEsL8xLomwkw0ukplxLB7ArJASO1+FqEzCtCbC3ElWiSKNv3JEnHSVpGPRff/HaZGyJ0ukia"+
"tdbV+//5ko6ySRkkbf///+tVFHdFSSLL0v/////RRJHLytskAYAAAAKwEEAAD4vj7SvGEK7Jlkhy"+
"MaEokk1FvmiikxH4JTwCSa5x6vbj8gTzpsqCoIyu2Akf4udCYKo/87JA1W//+sFQAAEIIAMVQth4"+
"EJgAN8MUBCPwEcLWfC/wfsHrfj+K6NER1/iOhxkwTRuXf/zE8klKRk///qU5iiy1sl///pTJJ16K"+
"Lf///+xkHRQCnQVdPf/+WfBVYalg6EyoAEAAEgLhf5b42CvgJCX5z/x0iPf5zjxz//7joaF3fyzA"+
"o+d/5VyAooi3/+VDUsHRQCtb//6xkGnxdZJiqkxBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqq"+
"qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo=");

//////////////////////////////////////////////////////////////
//                                                          //
// You are not supposed to change anything below this line. //
//                                                          //
//////////////////////////////////////////////////////////////

var active_count = 0;
var total_count = 0;
var timer = undefined;

var gauntlet_started = false;

var label_counter = null;
var label_instructions = null;
var fap_button = null;

let galImageNode = null;

function get_speed(phrase) {
    return speedMapping[phrase] || speedMapping["normal"];
}

function bpm_to_ms(bpm) {
  return 60_000/bpm;
}

function beat(timer) {
  if(!gauntlet_started) {
    return;
  }
  
  clickSound.play();
  
  updateLabel();
  
  active_count--;
  if (active_count < 0) {
    clearInterval(timer);
    document.querySelector('.gal-next').click();
  }
}

function show() {
  label_counter.style.display = 'block';
  label_instructions.style.display = 'block';
  fap_button.style.display = '';
}

/*
function hide() {
  label_counter.style.display = 'none';
  label_instructions.style.display = 'none';
  fap_button.style.display = 'none';
}
*/

function setup() {
  // "e.<post number>"
  let selected_post = document
    .querySelector(".gal-image")
    .querySelector("img")
    .getAttribute("data-post");

  let post_number = selected_post.slice(2);

  let post_text = document
    .querySelector("#m"+post_number)
    .innerHTML;

  let fap_regex = "([0-9]+)[,|.] ([A-Z|a-z| ]+)[,|.] ([A-Z|a-z| ]+)";

  var match = undefined;

  let lines = post_text.split(/<br\s*\/?>/);
  for (let i = 0;i < lines.length;i++) {
    match = lines[i].match(fap_regex);
    if(match) {
      break;
    }
  }

  if(undefined === match) return;

  let count = match[1]*1; // string to integer conversion I guess
  let speed = match[2];
  let instructions = match[3];
  
  let bpm = get_speed(speed);
  
  show();
  
  label_instructions.innerHTML = speed+" / "+instructions;

  total_count = count;
  active_count = count;

  updateLabel();
  
  clearInterval(timer);
  timer = setInterval(function() {beat(timer)}, bpm_to_ms(bpm));
}

function updateLabel() {
  label_counter.innerHTML = 'Beat count: '+
                           '<span class="count">'+active_count+'</span> / <span class="total">'+total_count+'</span>';
}

function addButton() {
	let l = document.querySelector(".gal-buttons");
	l.insertAdjacentHTML('afterbegin', "<a id=\"fap-start\" class=\"gal-start\" style='display:none;color:red;' title=\"Start gauntlet\"><i></i></a>");
 
  fap_button = document.getElementById('fap-start');
  
  fap_button.addEventListener('click', function(event) {
		event.preventDefault();  
		gauntlet_started = !gauntlet_started;
  });
}

function ifBodyChange() {
  if(!document.body.contains(galImageNode)) {
    gauntlet_started = false;
    clearInterval(timer);
  }
  
  if (null !== galImageNode && document.body.contains(galImageNode)) {
   return; 
  }
  
  galImageNode = document.querySelector('.gal-image');
  if (!galImageNode) {
    return;
  }
  
  let l = document.querySelector(".gal-labels");
  
  l.insertAdjacentHTML('afterbegin', "<span style='display:none;' class='gal-count weird'></span>");
  label_counter = document.querySelector(".weird");
  updateLabel();
  
  l.insertAdjacentHTML('afterbegin', "<span style='display:none;' class='gal-count instructions'></span>");
  label_instructions = document.querySelector(".instructions");
  
  addButton();
    
  setup();
  
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      setup();
    });
  });

  observer.observe(galImageNode, {
    childList: true,
    subtree: true,
    attributes: true
  });
}

function init() {
  const targetNode = document.querySelector('body');
  
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      ifBodyChange();
    });
  });

  observer.observe(targetNode, {
    childList: true,
    subtree: true,
    attributes: true
  });
}

init();
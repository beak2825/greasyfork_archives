// ==UserScript==
// @name        Snow Lolzteam 2
// @namespace   snow_lzt
// @match       https://lolz.guru/*
// @match       https://zelenka.guru/*
// @grant       none
// @version     2.0
// @author      its_niks
// @icon        https://zelenka.guru/favicon.ico
// @description Снежный фон для форума Lolzteam
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/455705/Snow%20Lolzteam%202.user.js
// @updateURL https://update.greasyfork.org/scripts/455705/Snow%20Lolzteam%202.meta.js
// ==/UserScript==

var particles_count = 150

function addStyle(styleString) {
  const style = document.createElement('style');
  style.textContent = styleString;
  document.head.append(style);
};



window.addEventListener('load', function(){
	var div = document.createElement('div');
	div.id = "snow";
	document.body.append(div);

	addStyle(`
		  #snow {
			    position: fixed;
			    top: 0;
			    left: 0;
			    right: 0;
			    bottom: 0;
			    pointer-events: none;
			    z-index: 111;
			}
		`);

	var script = document.createElement('script');
	script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
	script.onload = function(){
	    particlesJS("snow", {
	        "particles": {
	            "number": {
	                "value": particles_count,
	                "density": {
	                    "enable": true,
	                    "value_area": 800
	                }
	            },
	            "color": {
	                "value": "#ffffff"
	            },
	            "opacity": {
	                "value": 0.7,
	                "random": false,
	                "anim": {
	                    "enable": false
	                }
	            },
	            "size": {
	                "value": 5,
	                "random": true,
	                "anim": {
	                    "enable": false
	                }
	            },
	            "line_linked": {
	                "enable": false
	            },
	            "move": {
	                "enable": true,
	                "speed": 5,
	                "direction": "bottom",
	                "random": true,
	                "straight": false,
	                "out_mode": "out",
	                "bounce": false,
	                "attract": {
	                    "enable": true,
	                    "rotateX": 300,
	                    "rotateY": 1200
	                }
	            }
	        },
	        "interactivity": {
	            "events": {
	                "onhover": {
	                    "enable": false
	                },
	                "onclick": {
	                    "enable": false
	                },
	                "resize": false
	            }
	        },
	        "retina_detect": true
	    });
	}
	document.head.append(script);
});

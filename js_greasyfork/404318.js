// ==UserScript==
// @name         Social Club Simulator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Barracuda10
// @match        https://socialclub.rockstargames.com/member/*/games
// @grant        none
// @run-at       document-end
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/404318/Social%20Club%20Simulator.user.js
// @updateURL https://update.greasyfork.org/scripts/404318/Social%20Club%20Simulator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function(e){
        //alert('load');
        $(document).ready(function(){
            document.title = 'Social Club Simulator';
            function checklastplayed(){
				document.title = 'Social Club Simulator';
				var lastplayed = document.getElementsByClassName('Games__lastPlayed__VpkFO')[0];
				var checking = setInterval(function(){
					if(lastplayed === undefined){
						console.log('loading');
						lastplayed = document.getElementsByClassName('Games__lastPlayed__VpkFO')[0];
					}
					else{
						document.title = 'Social Club Simulator';
						console.log('checking');
						if(lastplayed.innerText == 'Today'){
							document.title = '(1) Social Club Simulator';
							var sound = new Audio('');
							sound.play();
							var log = window.open('');
							log.document.title = Date();
							log.document.body.innerText = Date();
							console.log('today');
						}
						clearTimeout(checking);
					}
				},500);
            }
            checklastplayed();
            setInterval(function(){
                window.location.reload();
            },60000 * 10);
        });
    });
})();
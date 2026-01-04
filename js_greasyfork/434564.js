// ==UserScript==
// @name         Nitro Type random race text color
// @namespace    ginfio.com/giveaways
// @version      1.3
// @description  Chnage the color of the text on the race page randomly.
// @author       Ginfio
// @match        https://www.nitrotype.com/race
// @match        https://www.nitrotype.com/race/*
// @downloadURL https://update.greasyfork.org/scripts/434564/Nitro%20Type%20random%20race%20text%20color.user.js
// @updateURL https://update.greasyfork.org/scripts/434564/Nitro%20Type%20random%20race%20text%20color.meta.js
// ==/UserScript==
 
window.onload = function(){
	function changeColor(){
		document.querySelectorAll(".dash-copyContainer")[0].style.background = '#1d1e23';
		var txt = document.querySelector(".dash-copy");
		var x = document.querySelectorAll(".dash-copy")
		setInterval(function(){
			console.log(x.length)	
		}, 5000)
		
		var randColor = function() {
		    var color = '#';
		    var val = "789abcdef";
		    for (var i = 0; i < 6; i++) {
		        color += val.charAt(Math.floor(Math.random() * val.length));
		    }
		    return color;
		}
		

		const stl = document.createElement('style');
		stl.innerHTML = `
      .dash-copy{
      color: ${randColor()}!important
		}
		.dash-letter.is-correct{
			color: #999!important;
		}
    `;
	document.head.appendChild(stl);
		
	}
		var check = setInterval(function() {
			    if (document.querySelector(".dash-copyContainer") == null || document.querySelector(".dash-copyContainer") == 'undefined'){
			    	return 
			    } else {
			    	 clearInterval(check);
			    	 changeColor()
			    }
					
			}, 1);
	
}

 
 
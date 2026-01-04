// ==UserScript==
// @name         You got it! NT Gold.
// @namespace    https://www.youtube.com/@GaSk-nitype
// @version      2.22
// @description  You will get NT gold cars everywhere in Garage on nitro type and math. (It's very shiny!)
// @author       GaSk (GaSkertube)
// @match        https://www.nitrotype.com/garage
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494305/You%20got%20it%21%20NT%20Gold.user.js
// @updateURL https://update.greasyfork.org/scripts/494305/You%20got%20it%21%20NT%20Gold.meta.js
// ==/UserScript==
 
 
 
 
/*88+pro.get_post(local_)
      GET.CAR.id(175);
    game = Nitro Type;
  game.give(GaSk NT, NT Gold);
amount = garageFull; */
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
var carId = 175;
var cr = "https://www.nitrotype.com/cars/"+carId+"_large_1.png";
window.onload = function(){
	var t = document.querySelectorAll(".is-empty");
	var pC = document.querySelector(".profile-car");
			t.forEach(function(tt){
				tt.className = "garage-spot";
			})
			
	var nw = document.querySelectorAll(".garage-spot");
	nw.forEach(function(gs){
		gs.addEventListener("click", function(){
			pC.src = cr;
			setTimeout(function(){
				pC.src = cr;
				pC.setAttribute("class", "profile-car is-exiting");
			}, 200);
		setTimeout(function(){
			pC.setAttribute("class", "profile-car is-entering");
			pC.src = "https://www.nitrotype.com/cars/97_large_1.png";
			document.querySelectorAll(".mtm")[0].innerHTML = "Wampus"
		}, 300)
		
			})
	})
	var x = document.querySelectorAll(".garage-vehichleImage");
	x.forEach(function(y){
		y.style.backgroundImage = "url(https://www.nitrotype.com/cars/175_small_1.png)";
		y.setAttribute("data-tip", "NT Gold");
		
	})
	
}
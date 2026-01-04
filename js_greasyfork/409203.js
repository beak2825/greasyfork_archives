
// ==UserScript==
// @name         Made for Dragon Typer - Garage full of Wampus cars! (Nitro type)
// @namespace    https://youtu.be/hAiM2XY2hzo
// @version      1
// @description  Made it for Dragon Typer. I'm sure he'll let you use it too. Use this to get garage full of Wampus cars on nitro type.
// @author       Ginfio
// @match        https://www.nitrotype.com/garage
// @downloadURL https://update.greasyfork.org/scripts/409203/Made%20for%20Dragon%20Typer%20-%20Garage%20full%20of%20Wampus%20cars%21%20%28Nitro%20type%29.user.js
// @updateURL https://update.greasyfork.org/scripts/409203/Made%20for%20Dragon%20Typer%20-%20Garage%20full%20of%20Wampus%20cars%21%20%28Nitro%20type%29.meta.js
// ==/UserScript==




/*88+pro.get_post(local_)
      GET.CAR.id(97);
    game = Nitro Type;
  game.give(Dragon Tper, Wampus);
amount = garageFull; */





















var carId = 97;
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
		y.style.backgroundImage = "url(https://www.nitrotype.com/cars/97_small_1.png)";
		y.setAttribute("data-tip", "Wampus");
		
	})
	
}
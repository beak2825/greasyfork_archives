// ==UserScript==
// @name Gamdom Rain Bot By Stephanzion
// @author Stephanzion
// @namespace GamdomRainBotByStephanzion
// @version 1.8.4
// @include https://gamdom.com/hilo
// @run-at document-idle
// @description Gamdom Rain Bot

// @downloadURL https://update.greasyfork.org/scripts/41013/Gamdom%20Rain%20Bot%20By%20Stephanzion.user.js
// @updateURL https://update.greasyfork.org/scripts/41013/Gamdom%20Rain%20Bot%20By%20Stephanzion.meta.js
// ==/UserScript==

(function () {


	// ПИГУЛЬ - СЕКС
	// СТЕПАН - БОГОКОДЕР


	if (confirm('Запустить мега скрипт от Stephanzion?')) {





		try{document.getElementById('game-header').remove();}catch(e){}
		try{document.getElementById('footer').remove();}catch(e){}
		try{document.getElementById('chat-channel-selector').remove();}catch(e){}
		try{document.getElementsByClassName('tab-container noselect')[0].remove();}catch(e){}
		try{document.getElementsByClassName('tabs-container')[0].remove();}catch(e){}
		try{document.getElementsByClassName('chat-input')[0].remove();}catch(e){}



		try{


			document.getElementById('mainNavBar').remove();
			document.getElementsByClassName('tab-container noselect')[0].remove();



		}catch(e){}




		var text = "";
       

		function fire() {

			for(var i = 0; i < document.getElementsByTagName('img').length; i++){  document.getElementsByTagName('img')[i].remove();      }  
			try{	text = document.getElementById('chat').innerHTML  ;}catch(e){}

			/////////////////////////////////////////////////////////////////////////////////////////
			if (text.includes("free coins!") | text.includes("Идет дождь"))
			{

				try{document.getElementsByClassName('col-xs-12 col-sm-8 col-md-8 col-lg-9 col-xl-9 hilo-game-container')[0].innerHTML='<h1 style=" border: none; color: rgb(238, 238, 238); background-color: rgb(14, 14, 17)" >Rain Detected. Sending messages...</h1>';}catch(e){};


				/////////////////



				var anonym = 'https://cors.io/?';

				var links = ['https://goo.gl/hwtfjD','https://goo.gl/GvfnRC', 'https://goo.gl/aMfCqE', 'https://goo.gl/JtVdKp','https://goo.gl/gRgPLC','https://goo.gl/kXu6Ke','https://goo.gl/5EwRrx','https://goo.gl/B88qsy',];



				links.forEach(function(item, i, links)
							  {

					setTimeout(function() {


						try{  SendMessage(anonym + item);}catch(e){}

						console.log('sended ' + item);



					}, 100);

				});



				///////////////

				setTimeout(fire, 60 * 1000);

			}
			else ///////////////////////////////////////////////////////////////////////
			{	
				
				
			//	try{document.getElementsByClassName('col-xs-12 col-sm-8 col-md-8 col-lg-9 col-xl-9 hilo-game-container')[0].innerHTML='<textarea style="font-size: 8pt; border: none; color: rgb(238, 238, 238); background-color: rgb(14, 14, 17)"  rows="100" cols="200">' + text + '</textarea>';}catch(e){}

				try{document.getElementsByClassName('col-xs-12 col-sm-8 col-md-8 col-lg-9 col-xl-9 hilo-game-container')[0].innerHTML='<h1 style=" border: none; color: rgb(238, 238, 238); background-color: rgb(14, 14, 17)" >RainBot is working now (' + text.length+ ')</h1>';}catch(e){};



				setTimeout(fire, 100);

			}
			//////////////////////////////////////////////////////////////////////////////////////////

		}


		fire();




		function SendMessage(theUrl)
		{
			try{

				fetch(theUrl).then(resp => console.log(resp.url));




			}catch(e){}

		}


	} else {

	}







})(window);
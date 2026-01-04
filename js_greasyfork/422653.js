// ==UserScript==
// @name           Bot fetch for Chatovod
// @name:es        Bot fetch para Chatovod
// @description    Bot fetch para Chatovod. Send messages automatically.
// @description:es Bot fetch for Chatovod. Envía mensajes automáticamente.
// @namespace      http://tampermonkey.net/
// @version        0.1.11
// @author         ArtEze
// @match          *://*.chatovod.com/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/422653/Bot%20fetch%20for%20Chatovod.user.js
// @updateURL https://update.greasyfork.org/scripts/422653/Bot%20fetch%20for%20Chatovod.meta.js
// ==/UserScript==

function enviar(json){
	json.mensajes.pop();
	var csrfarr = document.body.textContent.match(
		/csrfToken: "([a-z0-9]*)",/i
	);
	if(csrfarr!=null){
		for(var i=0;i<json.cantidad;++i){
			setTimeout((function fconid(i,json){
				return function(){
					var indice = i%json.mensajes.length
					fetch("chat/send?"+
					"csrf="+csrfarr[1]+
					"&roomId="+json.sala+
					"&to="+json.mensajes[indice][0].join(",")+
					"&msg="+encodeURIComponent(
						json.mensajes[indice][1]
					),{
						credentials: "same-origin",
						headers: {
							"Content-Type":
								"application/x-www-form-urlencoded"
						}
					}).then(function(x){return x.text();})
					.then(function(x){
						console.log(x);
						return x;
					});
				};
			})(i,json),json.tiempo*i);
		}
	}
}

enviar({
	cantidad: 19,
	tiempo: 100,
	sala: 1,
	mensajes: [
		[["ArtEze"],
		`[b]hola
mundo[/b]`
		],
		[[""],
		`hola mundo`
		],
	""],
});

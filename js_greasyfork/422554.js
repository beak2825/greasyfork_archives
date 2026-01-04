// ==UserScript==
// @name           Bot fetch fork for Chatovod
// @name:es        Bot fetch fork para Chatovod
// @description    Bot fetch fork para Chatovod. Send messages automatically.
// @description:es Bot fetch fork for Chatovod. Envía mensajes automáticamente.
// @namespace      http://tampermonkey.net/
// @version        0.1.3
// @author         ArtEze
// @match          *://*.chatovod.com/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/422554/Bot%20fetch%20fork%20for%20Chatovod.user.js
// @updateURL https://update.greasyfork.org/scripts/422554/Bot%20fetch%20fork%20for%20Chatovod.meta.js
// ==/UserScript==

function enviar(json){
    if(json.intento==undefined){json.intento=0;}
    ++json.intento;
    json.mensajes.pop();
    json.mensajes.push(json.mensajes.shift());
    json.mensajes.push("");
    var csrfarr = document.body.textContent.match(
		/csrfToken: "([a-z0-9]*)",/i
	);
	if(csrfarr!=null){
		fetch("chat/send?"+
		"csrf="+csrfarr[1]+
		"&msg="+encodeURIComponent(json.mensajes.slice(-2)[0][1])+
		"&roomId="+json.sala+
		"&to="+json.mensajes.slice(-2)[0][0].join(","),{
			credentials: "same-origin",
			headers: {"Content-Type": "application/x-www-form-urlencoded"}
		}).then(function(x){return x.text();})
		.then(function(x){
			console.log(x);
			if(json.intento<json.cantidad && !x.includes("error") ){
				setTimeout(function(){
					enviar(json);
				},json.tiempo);
			}
			return x;
		});
	}
}

enviar({
	cantidad: 19,
	tiempo: 20,
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

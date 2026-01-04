// ==UserScript==
// @name Colorier pseudo de l'auteur
// @author QuelquunSurJvc
// @match https://www.jeuxvideo.com/forums/*
// @grant GM.setValue
// @grant GM.getValue
// @description Colorie le pseudo de l'auteur et de ses posts dans un topic
// @version 1.01
// @namespace https://www.jeuxvideo.com/
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/410836/Colorier%20pseudo%20de%20l%27auteur.user.js
// @updateURL https://update.greasyfork.org/scripts/410836/Colorier%20pseudo%20de%20l%27auteur.meta.js
// ==/UserScript==

/*Version modifiée de Ryakunin*/

let idtopic = parseInt(window.location.href.split("-0-1-0")[0].split("-")[2])
let page = parseInt(window.location.href.split("-0-1-0")[0].split("-")[3])
let posts = document.querySelectorAll(".bloc-message-forum")

function pageUn() {
    let pages = document.querySelectorAll("#forum-main-col > div.conteneur-messages-pagi > div:nth-child(1) > div.bloc-liste-num-page > span > a")
    for (var i = 0; i < pages.length; i++) {
        if (pages[i].textContent === "1") {
            return pages[i].href
        }
    }
}

async function getTopicAuteur() {
  
	const gmget = await GM.getValue(idtopic)
	if (typeof gmget === "string") {return gmget}
  else {
    
		if (page === 1) {
		let a = $(posts[0]).find(".xXx.bloc-pseudo-msg.text-user").text().trim().toLowerCase()
		GM.setValue(idtopic, a)
		return a} //Retourne l'auteur du topic
    
    }
}

(async function() {
    'use strict';
    let auteur_topic = await getTopicAuteur()
    posts.forEach(post => {
        let auteur_post = $(post).find(".xXx.bloc-pseudo-msg.text-user")
        if (auteur_post.text().trim().toLowerCase() === auteur_topic) {
            $(auteur_post).css("cssText", "color: blue !important;")
        }
    })
})();
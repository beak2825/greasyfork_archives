// ==UserScript==
// @name         JVC blacklist bouffons
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Pour blacklist les bouffons du blabla kh3
// @author       Roy
// @match        http://www.jeuxvideo.com/*
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/372759/JVC%20blacklist%20bouffons.user.js
// @updateURL https://update.greasyfork.org/scripts/372759/JVC%20blacklist%20bouffons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM.getValue( "liste_utilisteurs_blacklist", "[]").then(value => {
        let blacklist = JSON.parse(value);

        const clickBlacklist = (event, element) => {

            let pseudo = event.target.closest('.conteneur-message').getElementsByClassName('bloc-pseudo-msg')[0].innerText.trim().toLowerCase();

            if (blacklist.includes(pseudo)){
            	removeBlackList(pseudo)
            } else{
            	addBlackList(pseudo);
            }

            saveBlackList(blacklist);

        };

        const addBlackList = (pseudo) => {
            blacklist.push(pseudo);
            GM.setValue("liste_utilisteurs_blacklist", JSON.stringify(blacklist));
            location.reload();

        };

        const removeBlackList = (pseudo) => {
            blacklist = blacklist.filter(item => item !== pseudo);
        };

        const saveBlackList = (liste) => {
            GM.setValue("liste_utilisteurs_blacklist", JSON.stringify(liste));
            location.reload();

        }

        [...document.getElementsByClassName("bloc-options-msg")]
            .forEach(e => {
	            let span = document.createElement("span");
	            span.classList.add('picto-msg-tronche', 'blacklist-sp-delphinou');
	            span.style.backgroundPositionX = '-5rem';
	            span.addEventListener("click", clickBlacklist);
	            e.append(span);
	        });



        [...document.getElementsByClassName("bloc-message-forum")]
            .filter(f => blacklist.includes(f.getElementsByClassName("bloc-pseudo-msg")[0].innerText.trim().toLowerCase()))
            .forEach(e => {

				e.style.display = "none";

	            // e.style.fontStyle = 'italic';
	            // e.getElementsByClassName('bloc-contenu')[0].innerHTML = 'Message blacklisté khey';
	        });

        [...document.getElementsByClassName('blockquote-jv')]
            .filter(f => f.innerText.includes('a écrit :'))
            .forEach(e => {
            	let pseudo_blacked;
	            if(blacklist.some(pseudo => {
	            	if(e.innerText.toLowerCase().includes(pseudo)){
	            		pseudo_blacked = pseudo;
	            		return true;
	            	} else {
	            		return false;
	            	}
	            })){
	                e.style.fontStyle = 'italic';
	                e.innerHTML = 'Message blacklisté de ' + pseudo_blacked;
	            }
	        });

        let page_blacklist = document.querySelector('#blacklist>ul') || null;

    	console.log(page_blacklist);

	    if (page_blacklist) {
	    	console.log(blacklist);
	    	blacklist.forEach(elem => {
	    		let li = document.createElement('li');

	    		li.innerHTML = `<span>` + elem + `</span>
                    <i class="icon-cross-entypo" style="color: #f00" title="Retirer ce pseudo des indésirables"></i>`;

	    		li.classList.add('blacklist_perso');

                li.getElementsByClassName('icon-cross-entypo')[0]
                	.addEventListener("click", e => {
                		removeBlackList(elem);
                		saveBlackList(blacklist);
                	});

                console.log(li);
                page_blacklist.append(li);

	    	});
	    }

    }, () => {})
})();
// ==UserScript==
// @name         Zepirates Spy
// @namespace    https://zenoo.fr
// @version      0.4
// @description  Get an alert when an event occurs + Spy fugitive pirates + Randomize race with UP KEY
// @author       Zenoo
// @match        http://www.zepirates.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370536/Zepirates%20Spy.user.js
// @updateURL https://update.greasyfork.org/scripts/370536/Zepirates%20Spy.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    //RARE EVENTS
    let note = document.querySelector('img[src^="img/tinote"]');
    if(note){
        alert('Note trouvée !');
    }

    let zeuf = document.querySelector('a[href*="zeuf"],a[href*="oeuf"],img[src*="Zef"]');
    if(zeuf){
        if(zeuf.getAttribute('href')){
            if(!zeuf.getAttribute('href').includes('Les herbes peuvent')) alert('Zeuf trouvé !');
        }else{
            alert('Zeuf trouvé !');
        }
    }

    let map = document.querySelector('img[src^="img/minimap"]');
    if(map){
        alert('Parchemin trouvé !');
    }

    let temoin = document.querySelector('img[src^="img/temoin"]');
    if(temoin){
        alert('Témoin trouvé !');
    }

    //FUGITIVES
    if(window.location.href.endsWith('wanted.php')){
        let fugitives = document.querySelectorAll('[id^=divPi]');
        let fugitivesToFind = Array.from(fugitives).filter(e => !e.querySelector('img[src^="img/arrete"]'));

        if(fugitives){
            let today = new Date();
            localStorage.setItem('fugitives_date',today.getFullYear()+'/'+today.getMonth()+'/'+today.getDate());
            localStorage.setItem('fugitives_list',fugitivesToFind.map(e => e.id.slice(5)).join(','));
        }
    }else if(window.location.href.endsWith('affichco.php')){
        let storedDate = localStorage.getItem('fugitives_date');
        if(storedDate){
            let today = new Date();
            storedDate = storedDate.split('/');
            if(today.getFullYear() == +storedDate[0] && today.getMonth() == +storedDate[1] && today.getDate() == +storedDate[2]){
                let fugitives = localStorage.getItem('fugitives_list').split(',');

                let onlinePirates = document.querySelectorAll('html>body>center>table>tbody>tr>td>center>table>tbody>tr>td>center>center>table>tbody>tr[bgcolor]');
                for(let pirate of onlinePirates){
                    if(fugitives.includes(pirate.querySelector('a[href^="messagerie.php"]').getAttribute('href').split('=').pop())){
                        alert('Pirate recherché '+pirate.firstElementChild.lastElementChild.innerText+' trouvé !');
                    }
                }
            }else{
                localStorage.removeItem('fugitives_date');
            }
        }
	}
	
	// RACE RANDOMIZER
    if(window.location.href.endsWith('course_tres.php')){
        document.addEventListener('keydown', e => {
            if(e.keyCode == 38){
                rafraichit(Math.floor(Math.random() * 4));
            }
        });
    }
});


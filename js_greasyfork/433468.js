// ==UserScript==
// @name         Filtre topic
// @namespace    https://www.jeuxvideo.com/
// @version      1.02
// @description  Fitre les topics sur jvc par pseudo
// @include      https://www.jeuxvideo.com/forums/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433468/Filtre%20topic.user.js
// @updateURL https://update.greasyfork.org/scripts/433468/Filtre%20topic.meta.js
// ==/UserScript==

let html = `
  <div class="bloc-rech-forum">
    <input class="txt-search" onClick="this.select();" type="text" placeholder="Pseudo à rechercher" autocomplete="off" value="">
    <button class="btn btn-lancer-rech"><span class="icon-search"></span></button>
  </div>
`;

let regex = /(?<=forums\/)(\d+)(-\d+-\d+-)(\d+)/;

// ajoute l'html pour rechercher un pseudo 
if (regex.exec(window.location.href)[1] != '0') {
    document.querySelector('.group-two').style.marginBottom = '.3125rem';
    document.querySelector('.bloc-pre-left').insertAdjacentHTML('afterend', html);
    if (regex.exec(window.location.href)[3] == 1) {
        document.querySelector('.txt-search').setAttribute('value', document.querySelector('.bloc-header').firstElementChild.innerText);
    }
    document.querySelector('.btn-lancer-rech').onclick = rechercheAuteur;
}

async function rechercheAuteur() {
    let pageCount = 1;
    // liste des pages
    document.querySelectorAll('div:nth-child(1) > div.bloc-liste-num-page > span').forEach((element) => {
        // test si c'est un nombre pour éviter d'avoir un »
        if (/^-?\d+$/.test(element.textContent))
            pageCount = element.textContent;
    });

    let auteur = document.querySelector('.txt-search').value.toLowerCase();
    // supprime tous les messages de la page actuelle
    document.querySelectorAll('.bloc-message-forum').forEach(e => e.remove());

    for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
        let response = await fetch(window.location.href.replace(regex, '$1$2' + (pageIndex + 1)));
        let data = new DOMParser().parseFromString(await response.text(), "text/html");
        let messages = data.getElementsByClassName('bloc-message-forum');
        
        for (let i = messages.length - 1; i >= 0; i--) {
            let pseudo = messages[i].querySelector('.bloc-header > span');
            // supprime le message si il ne correspond pas au pseudo recherché ou si le pseudo a été supprimé
            if (pseudo == null || pseudo.innerText.replace(/\s+/g, '').toLowerCase() !== auteur) {
                messages[i].parentNode.removeChild(messages[i]);
            } else {
                // supprime JvCare
                messages[i].querySelectorAll('.JvCare').forEach(e => {
                    let classes = e.getAttribute('class');
                    let href = jvCake(classes);
                    classes = classes.split(' ');
                    let index = classes.indexOf('JvCare');
                    classes.splice(index, index + 2);
                    classes.unshift('xXx');
                    classes = classes.join(' ');
                    e.outerHTML = '<a href="' + href + '" class="' + classes + '">' + e.innerHTML + '</a>';
                });
                // corrige les citations
                messages[i].querySelectorAll('.blockquote-jv .blockquote-jv').forEach(blockquote => {
                    // ajoute le bouton "Voir la citation"
                    blockquote.insertAdjacentHTML('afterbegin', '<div class="nested-quote-toggle-box"></div>');
                    blockquote.querySelector('.nested-quote-toggle-box').onclick = () => {
                        if (blockquote.getAttribute('data-visible') !== '1') {
                            blockquote.setAttribute('data-visible', '1')
                        } else {
                            blockquote.setAttribute('data-visible', '0')
                        }
                    };
                });
            }
        }
        // ajoute tous les messages avant la liste des pages
        document.querySelectorAll('.bloc-pagi-default')[1].before(...messages);
    }
}

function jvCake(cls) {
    let base16 = '0A12B34C56D78E9F',
    lien = '',
    s = cls.split(' ')[1];
    for (let i = 0; i < s.length; i += 2) {
        lien += String.fromCharCode(base16.indexOf(s.charAt(i)) * 16 + base16.indexOf(s.charAt(i + 1)));
    }
    return lien;
}
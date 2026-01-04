    // ==UserScript==
    // @name         Jvc Better Citations
    // @namespace    http://tampermonkey.net/
    // @version      0.4.1
    // @description  Rend les citations plus simples à lire en évitant que tout s'affiche lorsqu'on appuie sur le bouton 'voir la citation' initialement présent sur jvc
    // @author       Dereliction
    // @license      MIT
    // @match        https://www.jeuxvideo.com/forums/*
    // @icon         https://www.google.com/s2/favicons?sz=64&domain=jeuxvideo.com
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441571/Jvc%20Better%20Citations.user.js
// @updateURL https://update.greasyfork.org/scripts/441571/Jvc%20Better%20Citations.meta.js
    // ==/UserScript==

    (function() {
        'use strict';
        console.log('JBC loaded');
        let theme = document.querySelector('html').classList.length;//0=dark 1=light
        //on récupère tous les blockquotes
        const blockquotes = document.getElementsByClassName('blockquote-jv');
        //on récupère les blockquotes qui servent de conteneur de base pour changer leurs propriétés
        const bqContenu = document.querySelectorAll('.bloc-contenu div > blockquote > blockquote');
        for( const bq of bqContenu){
            bq.style.display = 'none';
            bq.style.overflow='auto';
            bq.style.paddingTop='0';
            bq.style.height='auto';
        }


        //Pour tous les blockquotes sauf le premier, on met le display à none et on lui ajoute un bouton
        for(const bq of blockquotes){
            if(!bq.parentNode.parentNode.classList.contains('bloc-contenu')){
                bq.style.display ='none';
                let numberNestedBq = bq.querySelectorAll('blockquote').length;
                bq.previousElementSibling.append(createButton(numberNestedBq+1));
            }
        }


        //obligé d'appeler la fonction qui retire les boutons par défaut de jvc avec un petit délai parce qu'ils ne sont pas présent dès le chargement de la page, il sont ajoutés après via un script de jvc
        setTimeout(nqRemove, 500);

        function nqRemove(){
            let arrNQ = Array.prototype.slice.call(document.getElementsByClassName('nested-quote-toggle-box'));
            console.log('test : ' + arrNQ.length);
            arrNQ.forEach(nq =>{
                nq.remove();
            });
        }


        //la fonction qui crée le bouton
        function createButton(nestedNum){
            let btn = document.createElement('button');
            btn.innerHTML = 'ouvrir <span style="color:#7dc3f7">('+nestedNum+')</span>';
            btn.classList.add('btn-opener');
            btn.style.marginLeft = '10px';
            btn.style.border = '1px solid rgba(0, 0, 0, 0.2)';
            btn.style.borderRadius = '0 10px 10px 10px';
            btn.style.zIndex ='10';
            btn.style.position ='relative';
            if(theme){
                btn.style.background = 'white';
                btn.style.color = 'black';
            }
            btn.addEventListener('click', function(){toggleDisplay(btn,nestedNum)});
            return btn;
        }

        //quand on appuie sur un bouton, on toggle le display du blockquote qui lui est lié et on change le texte/couleur du bouton
        function toggleDisplay(btn,nestedNum){
            let nextBq = btn.parentNode.nextSibling;
            if(nextBq.style.display === 'none'){
                nextBq.style.display ='block';
                btn.innerHTML = 'fermer <span style="color:#f66031">('+nestedNum+')</span>';
            }
            else{
                nextBq.style.display ='none';
                btn.innerHTML = 'ouvrir <span style="color:#7dc3f7">('+nestedNum+')</span>';
            }
        }

        //pour changer la couleur des boutons quand l'utilisateur change de thème
        const toggleThemeBtn = document.querySelector('button.toggleTheme');
        toggleThemeBtn.addEventListener('click', ()=>{
            let theme = document.querySelector('html').classList.length;
            if(theme){
                for(const btn of document.getElementsByClassName('btn-opener')){
                    btn.style.background = 'white';
                    btn.style.color = 'black';
                }
            }
            else{
                for(const btn of document.getElementsByClassName('btn-opener')){
                    btn.style.background = '#2b2a33';
                    btn.style.color = 'white';
                }
            }
        });

    })();


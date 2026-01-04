// ==UserScript==
// @name         Baemon Pex
// @namespace    alandara script
// @version      3.0.2
// @description  gestion de la dépense de PE
// @author       Dain
// @match        https://www.jdr.alandara.net/*
// @match        https://jdr.alandara.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=alandara.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515623/Baemon%20Pex.user.js
// @updateURL https://update.greasyfork.org/scripts/515623/Baemon%20Pex.meta.js
// ==/UserScript==

(function() {
    const whitelist = ["4973"];

    const contentField=document.querySelector('#content');
    var totalpe,training;

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            // Vérifier si la div cible est ajoutée au DOM
            if(mutation.type === 'childList'){
                const peinvest=document.querySelector('#peinvest');
                if(peinvest){
                    console.log('Div trouvée !');
                    // Lancer la fonction pour surveiller ses changements
                    if(!document.querySelector('#peField')){
                        peinvest.setAttribute('value', 1);
                        peinvest.value=1;

                        const btncarte=peinvest.parentNode.querySelector('button.BTN_carte');
                        const datapersos = document.querySelectorAll('a[onclick^="personnage_voir_desc("]');
                        const nbpersos = datapersos.length;
                        if(nbpersos>1){
                            btncarte.setAttribute('onclick','situation_entrainement()');
                            btncarte.removeEventListener('click',function(){alert("Vous n\'êtes pas seule !")});
                            for(const d of datapersos){
                                const onclickValue = d.getAttribute("onclick");
                                const dataValue = onclickValue.split('(')[1].split(')')[0];
                                if(!whitelist.includes(dataValue)){
                                    btncarte.removeAttribute('onclick');
                                    btncarte.addEventListener('click',function(){alert("Vous n\'êtes pas seule !")});
                                    break;
                                }
                            }
                        }else{
                            btncarte.setAttribute('onclick','situation_entrainement()');
                            btncarte.removeEventListener('click',function(){alert("Vous n\'êtes pas seule !")});
                        }

                        const peField=document.createElement('input');
                        peField.style.display='none';
                        peField.type='number';
                        peField.id='peField';
                        peField.value=peinvest.getAttribute('value');
                        peinvest.insertAdjacentElement('afterend', peField);

                        const trainSelec=document.querySelector('#training');
                        trainSelec.addEventListener('change',selectTraining);
                        if(localStorage.training){
                            document.querySelector('#training').value=localStorage.training;
                        }else{
                            selectTraining();
                        }

                        function selectTraining(){
                            localStorage.training=document.querySelector('#training').value;
                            training=document.querySelector('#training').value;
                        }
                    }
                }
            }
        });
    });
    observer.observe(contentField, { childList: true, subtree: true });

    // fin du script
})();
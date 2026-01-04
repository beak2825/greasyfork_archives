// ==UserScript==
// @name         KI-AthenaNike
// @namespace    SW31399
// @version      2024-08-11-0936
// @description  nuker le spam visiteur
// @author       gyeongeun
// @match        http://www.kraland.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kraland.org
// @license      CC-BY-SA-4.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503021/KI-AthenaNike.user.js
// @updateURL https://update.greasyfork.org/scripts/503021/KI-AthenaNike.meta.js
// ==/UserScript==

(function(){
    'use strict';

    var centralText=document.querySelector('#central-text');
    var isForum=centralText.querySelector('div.r.forum-button');
    var forumPart=centralText.querySelectorAll('table');
    var k=forumPart.length-1;

    if(isForum){
        let mDiv=document.createElement('div');
        mDiv.id='mDiv';

        let nButton=document.createElement('button');
        nButton.innerHTML="Détruire";
        nButton.title="Détruire les sujets visiteurs";
        nButton.id='nButton';
        nButton.addEventListener('click',destroyGuestMsg);
        nButton.addEventListener('mouseover', function(event){
            event.target.style.textDecoration="overline underline";
            event.target.style.color='red';
        });
        nButton.addEventListener('mouseout', function(event){
            event.target.style.textDecoration="none";
            event.target.style.color='';
        });
        nButton.style.cursor='pointer';

        mDiv.appendChild(nButton);
        centralText.insertBefore(mDiv,centralText.querySelector('form'));
    }

    async function destroyGuestMsg(){
        let ok=confirm('Détruire les sujets des visiteurs ?');
        if(!ok){return;}

        var mframe=document.createElement('iframe');
        mframe.id="result";
        mframe.name="nuked";
        mframe.style.display='none';
        centralText.appendChild(mframe);

        let ssbn=document.createElement('div');
        ssbn.id="Columbia";
        ssbn.style.display="none";
        centralText.appendChild(ssbn);

        var allTr=forumPart[k].querySelectorAll('tr');
        for(let i=1;i<allTr.length;i++){
            var notGuest=allTr[i].querySelectorAll('td')[4].querySelector('a');
            if(!notGuest){
                let topicLink=allTr[i].querySelector('p a').href;
                topicLink+='&p0=5';
                await fire(topicLink);
            }
        }
        alert("Terminated - ok pour actualiser");
        window.location.reload();

        async function fire(urlX){
            try {
                var response= await fetch(urlX);
                if(!response.ok){
                    throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
                    return;
                }
                var docX= await parseKI(response);
                let responseY=await nuke(docX);
            }catch(err){
                console.log(err)
            }
        }
    }

    function nuke(docX){
        var icbm=docX.querySelector('#central-text form');
        icbm.id='peacekeeper';
        icbm.target='nuked';
        var cbxp1=icbm.querySelectorAll('input[name="p1[]"]');
        cbxp1.forEach(cbx=>{cbx.checked=true;});
        icbm.querySelector('select[name="p3"]').value=1;
        let ssbn=document.querySelector('#Columbia');
        ssbn.innerHTML='';
        ssbn.appendChild(icbm);
        centralText.appendChild(ssbn);
        icbm.submit();

    }

    async function parseKI(response){
        const buffer= await response.arrayBuffer();
        const decoder= new TextDecoder('iso-8859-1');
        const text= decoder.decode(buffer);
        const parser= new DOMParser();
        var doc= parser.parseFromString(text, 'text/html');
        return doc;
    }
})();
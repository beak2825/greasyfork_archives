// ==UserScript==
// @name         immodem.JS
// @namespace    http://tampermonkey.net/
// @version      0.10
// @description  agencement des cartes pour immodem en fonction de l'étape.
// @author       coz3n
// @match        https://immodem.poste-immo.intra.laposte.fr/*
// @require https://greasyfork.org/scripts/394721-w84kel/code/w84Kel.js?version=763614
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372653/immodemJS.user.js
// @updateURL https://update.greasyfork.org/scripts/372653/immodemJS.meta.js
// ==/UserScript==

let obsconf = {childList: true},
    url = [],
    initLaunch,
    buckets = ["Validation CP","Réalisation","Validation technique","Réception de la demande"],
    sessionVal = localStorage.getItem("user_session");

console.log(JSON.parse(sessionVal));

waitForKeyElements(".taskCard", card => ux(card));

function formatInfos(infos) {
    infos.forEach(info => {
        let infoSplit = info.innerHTML.split(" : ")
        info.innerHTML = "<span class=\"infoLabel\">" + infoSplit[0] + "</span><span class=\"infoValue\">" + infoSplit[1];
    });
}

function ux() {
    let container = document.querySelector('[vertilize-container]'),
        card = arguments[0].parentElement,
        taskInfos = arguments[0].querySelectorAll('.taskInfos'),
        step = card.querySelector(".itemStep").innerText;

    let infosFormated = formatInfos(taskInfos);
    card.classList.add("card");
    step = step.replace(/\n|\r|(\n\r)|\s/g,'');

    buckets.forEach(bucketId => {
        let newBucketId = bucketId.replace(/\n|\r|(\n\r)|\s/g,'');
        let bucket = document.getElementById(newBucketId);
        if (!bucket) {
            let divBucket = document.createElement('div'),
                headBucket = document.createElement('h4'),
                tasksContainer = document.createElement('div');
            headBucket.innerText = bucketId;
            tasksContainer.classList.add("tasksContainer");
            divBucket.id = newBucketId;
            divBucket.dataset.step = newBucketId;
            divBucket.classList.add("stepBucket");
            divBucket.appendChild(headBucket);
            divBucket.appendChild(tasksContainer);
            container.appendChild(divBucket);
            if (step === newBucketId) {
                tasksContainer.appendChild(card);
            }
        } else {
            if (bucket.id === step) {
                let tasksContainer = bucket.querySelector(".tasksContainer");
                tasksContainer.appendChild(card);
            }
        }
    })
}
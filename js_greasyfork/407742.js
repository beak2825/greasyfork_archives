// ==UserScript==
// @name         Repubblica - Sintesi vocale
// @name:en      Repubblica - Add Speech Synthesis
// @namespace    http://cosoleto.free.fr/
// @version      1.8
// @description  Aggiunge la sintesi vocale agli articoli di repubblica.it
// @description:en  Add Speech Synthesis for repubblica.it articles
// @author       Francesco Cosoleto
// @match        http*://www.repubblica.it/*
// @match        http*://rep.repubblica.it/*
// @match        http*://ricerca.repubblica.it/*
// @match        http*://bari.repubblica.it/*
// @match        http*://bologna.repubblica.it/*
// @match        http*://firenze.repubblica.it/*
// @match        http*://genova.repubblica.it/*
// @match        http*://milano.repubblica.it/*
// @match        http*://napoli.repubblica.it/*
// @match        http*://palermo.repubblica.it/*
// @match        http*://parma.repubblica.it/*
// @match        http*://roma.repubblica.it/*
// @match        http*://torino.repubblica.it/*
// @match        http*://www.salute.eu/*
// @match        http*://www.italian.tech/*
// @match        http*://espresso.repubblica.it/*
// @match        http*://www.greenandblue.it/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407742/Repubblica%20-%20Sintesi%20vocale.user.js
// @updateURL https://update.greasyfork.org/scripts/407742/Repubblica%20-%20Sintesi%20vocale.meta.js
// ==/UserScript==

const PAUSA = '(Pausa)';
const RESUME = '(Riprendi)';
var articleElement;
var shadow;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function main(){
    var speechButtonsElement, speechButtonsDestinationElement, pauseButton;

    var cloneElement = articleElement.cloneNode(true);
    var createElement = "div";

    if (location.host.startsWith("rep.")) {
        if (shadow) {
            speechButtonsDestinationElement = shadow.getElementsByClassName("detail-article_container")[1];
        } else {
            speechButtonsDestinationElement = document.getElementsByClassName("detail-article_container")[1];
        }
        cloneElement.querySelectorAll("script,style,.detail_bottom-trigger,#detail-values_big,.detail-tag_container").forEach(el => el.remove());
    } else if (location.host.startsWith("ricerca.")) {
        cloneElement = cloneElement.querySelector("article");
        var uselessElement = cloneElement.querySelector("aside");
        if (uselessElement) {
            cloneElement.removeChild(uselessElement);
            cloneElement.innerText = cloneElement.innerText.replace("© RIPRODUZIONE RISERVATA","");
        }
        speechButtonsDestinationElement = document.getElementById("header");
    } else if (location.pathname.endsWith("/amp/")) {
        speechButtonsDestinationElement = document.getElementsByClassName("social-share")[0];
        if (!speechButtonsDestinationElement) {
            speechButtonsDestinationElement = document.getElementsByClassName("fixed-bar-container")[0];
      }
        cloneElement.querySelectorAll("aside, .inline-embed, section, .video-container, figcaption").forEach(el => el.remove());
    } else {
        speechButtonsDestinationElement = document.getElementById("gs-social-sharebutton-float");

        var idealDestinationElement = speechButtonsDestinationElement.querySelector("ul");
        if (idealDestinationElement) {
            speechButtonsDestinationElement = idealDestinationElement;
            createElement = "li";
        }

        cloneElement.querySelectorAll("article, figure, section, #adv-Bottom, script, style, .inline-embed, .story__tags, .fkeditorref, button#commentsTrigger").forEach(el => el.remove());
    }

    articleElement = cloneElement;

    speechButtonsElement = document.createElement(createElement);
    speechButtonsElement.setAttribute("class", "vf-share-option");
    speechButtonsElement.innerHTML = `<a class="vf-share-icon" href="javascript:void(0);" title="Leggi">🔊</a>`;

    window.addEventListener("unload", function() { if (speechSynthesis.speaking) { speechSynthesis.cancel(); } } );

    pauseButton = document.createElement("a");
    pauseButton.setAttribute("href", "javascript:void(0);");
    pauseButton.setAttribute("style", "display: none");

    var utterance = new SpeechSynthesisUtterance;
    utterance.lang = 'it-IT';
    utterance.onend = function () {pauseButton.style = "display: none";};

    function setVoice() {
        var voices = speechSynthesis.getVoices();

        for (var i = 0; i < voices.length; i++) {
            if (voices[i].localService) {
                if (voices[i].lang == utterance.lang) {
                    utterance.voice = voices[i];
                }
            }
        }
        return;
    }

    setVoice();
    if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = setVoice;
    }

    speechButtonsElement.firstChild.addEventListener("click", function () {
        utterance.text = articleElement.innerText;

        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
        //console.debug(articleElement.innerText);

        setTimeout(function() {
            pauseButton.style = "display: block";
            pauseButton.innerText = PAUSA;
        }, 1000);
    });

    pauseButton.addEventListener("click", function () {
        if (speechSynthesis.paused) {
            speechSynthesis.resume();
            pauseButton.innerText = PAUSA;
        }
        else {
            speechSynthesis.pause();
            pauseButton.innerText = RESUME;
        }
    });

    speechButtonsDestinationElement.appendChild(speechButtonsElement);
    speechButtonsElement.appendChild(pauseButton);
}

async function find_article() {
    var sleeptime = 1;
    do {
        if (location.pathname.endsWith("/amp/")) {
            articleElement = document.getElementsByClassName("story__wrapper")[0] || document.getElementsByClassName("article-body")[0];
        } else {
            articleElement = document.getElementById("article-body") || document.getElementsByClassName("paywall")[0] || document.getElementById("singolo-elemento");
        }
        if (!articleElement) {
            try {
                shadow = document.querySelector("news-app").shadowRoot.getElementById("1").shadowRoot.querySelector(".amp-doc-host").shadowRoot.querySelector("main")
                articleElement = shadow.querySelector(".paywall");
            } catch (e) {}
        }
        sleeptime *= 2;
        await sleep(sleeptime);
        if (sleeptime > 90000) {
            return;
        }
    } while (articleElement === null);

    await sleep(900);
    main();
}

(function() {
    "use strict";

    if (location.pathname.length === 1) {
        return;
    }

    if (document.readyState === "complete" || document.readyState === "loaded") {
        find_article();
    } else {
        window.addEventListener("load", find_article);
    }
})();

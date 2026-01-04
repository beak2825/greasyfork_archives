// ==UserScript==
// @name         KaniWani audio
// @namespace    http://tampermonkey.net/
// @version      0.27
// @description  Play audio in KaniWani upon correct answers
// @author       voithos
// @match        *://*.kaniwani.com/*
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481498/KaniWani%20audio.user.js
// @updateURL https://update.greasyfork.org/scripts/481498/KaniWani%20audio.meta.js
// ==/UserScript==


// Based on original version by CometZero:
// https://greasyfork.org/en/scripts/25373-kaniwani-audio

var buttonHtml = `<button id="playAudio">Play Audio</button>`;
var colorDisabled = "hsl(0, 0%, 65%)";

var loadingImageHtml = `<img src="http://img.etimg.com/photo/45627788.cms"
alt="Loading ..." style="margin-left:5px;width:15px;height:15px;display:none;">`;

var playSoundButton;
var loadingImage;

var audioWord = null;
var audio = null;
var lastAudio = null;
var isPendingPlay = false;
var isLoadingAudio = false;


var onAudioReady = function(audioNode){
    audio = audioNode;
    audio.style.display = 'none';
    document.body.appendChild(audio);

    isLoading = false;
    loadingImage.style.display = "none"; // hide loading image
    playSoundButton.style.color = ""; // set default text color

    if(isPendingPlay){
        audio.play();
        isPendingPlay = false;
    }
};

var onAudioLoading = function(){
    loadingImage.style.display = "inline"; // show loading image
    playSoundButton.style.color = colorDisabled; // dimm play button
    isLoading = true;
};


(function() {
    'use strict';

    initWhenReady();
})();

// wait until the first word has been loaded so that we can complete the setup
function initWhenReady(){
    console.log("Trying to initialize KaniWani audio...");
    var wordDom = getWordDom();
    if(wordDom){
        console.log("KaniWani audio initialized");
        init();
    }else{
        //wait a bit and then try again, assuming the initial loading will be complete soon
        setTimeout(function(){ initWhenReady(); }, 500);
    }
}

function init(){
    initElements();

    // loads audio for the first time;
    loadAudio();

    onNewWordObserver(function(mutations, observer) {
        // loads audio everytime the word DOM changes
        loadAudio();
    });
  
    onCorrectAnswerObserver(function() {
        playAudio();
    });

    playSoundButton.onclick = function(){
        playAudio();
    };
  
    var initialLocation = location.pathname;
    // check to make sure that the location hasn't changed
    // if it has, redo the initialization
    var intervalId = setInterval(function(){
        if (location.pathname !== initialLocation) {
            clearInterval(intervalId);
            initWhenReady();
        }
    }, 1000);
}

// plays the audio
// finds the word than loads the audo if needed and plays it
function playAudio(){
    var word = getWord();

    if(!word) {
        console.log("Cannot get word for audio :(");
        return;
    }

    // if audio is available just play it
    if(audio){
        audio.play();
        return;
    }
    // audio is not available we need to load it

    // make sure audio is not already loading
    if(!isLoadingAudio){
        loadAudio(word);
    }

    // set pendingPlay true so when it loads it will play the audio
    isPendingPlay = true;
}

// accepts function that is triggered when new word is shown
function onNewWordObserver(f){
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    var observer = new MutationObserver(f);

    // configuration of the observer:
    var config = { attributes: true, childList: true, characterData: true };

    // select the target node
    var target = getWordDom();

    // pass in the target node, as well as the observer options
    observer.observe(target.parentNode.parentNode, config);
}

// accepts function that is triggered when user has answered correctly
function onCorrectAnswerObserver(f){
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    var observer = new MutationObserver(function() {
        var target = document.querySelector('form > div');
console.log(window.getComputedStyle(target).backgroundColor);
        if (target && ( window.getComputedStyle(target).backgroundColor === 'rgb(127, 212, 104)' || window.getComputedStyle(target).backgroundColor === 'rgb(68, 119, 51)')) {
            // Answer was correct!
            f();
        }
    });

    // configuration of the observer:
    var config = { attributes: true, childList: true, characterData: true };

    var target = document.querySelector('form');
    // pass in the target node, as well as the observer options
    observer.observe(target, config);
}

// adds all the buttons and loading images to the webpage
function initElements(){
    // create "play audio button"
    playSoundButton = htmlToElement(buttonHtml);
    loadingImage = htmlToElement(loadingImageHtml);
    playSoundButton.appendChild(loadingImage);

    // insert
    var addSynonymButton = document.evaluate("//button[contains(., 'Add Synonym')]", document, null, XPathResult.ANY_TYPE, null ).iterateNext();
    if (addSynonymButton) {
        playSoundButton.className = addSynonymButton.className;
        addSynonymButton.parentNode.appendChild(playSoundButton);
    }
}

// get the dom that is containg word that it has to play
function getWordDom(){
    var answers = document.querySelectorAll('[data-answer=true]');
    if (answers && answers.length >= 1) {
        var first = answers[0];
        return first.querySelector('[data-ruby]');
    }
    return null;
}

// finds the word that it has to play
function getWord(){
    var kanjisDom = getWordDom();

    if(!kanjisDom){
        return null;
    }

    // get the word
    var word = kanjisDom.dataset.ruby;
    if (word) {
        var parts = word.split(/\s+/);
        if (parts.length !== 2) {
            console.log(`Malformed ruby answer! '${word}'`);
            return null;
        }
        return parts[0];
    }
}

// get audio url for a word and play it
function loadAudio(){
    var vocabKanji = getWord();
    if(!vocabKanji) throw "vocabKanji cannot be empty!";

    if (vocabKanji === audioWord) return;
    audioWord = vocabKanji;

    // keep the last audio element around in case it's currently being played,
    // or else the audio might get cut off.
    if (lastAudio) {
        document.body.removeChild(lastAudio);
    }
    if (audio) {
        lastAudio = audio;
    }
    audio = null;
    onAudioLoading();

    GM_xmlhttpRequest ( {
        method: 'GET',
        url:    `https://www.wanikani.com/vocabulary/${vocabKanji}`,
        accept: 'text/xml',
        onreadystatechange: function (response) {
            if (response.readyState != 4)
                return;

            // get responseTxt
            var responseTxt = response.responseText;
            var domRoot = document.createElement('html');
            domRoot.innerHTML = responseTxt;
            var audioNode = domRoot.querySelector('audio');
            if (audioNode) {
                onAudioReady(audioNode);
            }
        }
    } );
}

/**
 * Creates dom element from string.
 * @param {String} HTML representing a single element
 * @return {Element}
 */
function htmlToElement(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstChild;
}
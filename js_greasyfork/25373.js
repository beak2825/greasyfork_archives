// ==UserScript==
// @name         KaniWani audio
// @namespace    http://tampermonkey.net/
// @version      0.22 alpha
// @description  Play audio in KaniWani
// @author       CometZero
// @match        https://kaniwani.com/kw/review/
// @match        https://www.kaniwani.com/kw/review/
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/25373/KaniWani%20audio.user.js
// @updateURL https://update.greasyfork.org/scripts/25373/KaniWani%20audio.meta.js
// ==/UserScript==

//https://kaniwani.com/kw/review/

var buttonHtml =
`<a id="playAudio" class="button -addsynonym" href="#">Play Audio</a>`;
var colorDisabled = "hsl(0, 0%, 65%)";

var loadingImageHtml = `<img src="http://img.etimg.com/photo/45627788.cms"
alt="Loading ..." style="margin-left:5px;width:15px;height:15px;display:none;">`;

var playSoundButton;
var loadingImage;

var audio = null;
var isPendingPlay = false;
var isLoadingAudio = false;


var onAudioReady = function(){
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

    // TODO test if my service is still working (wanikaniaudio.herokuapp.com)
    // and notify the user to motivate me to enable the service

    initElements();

    // loads audio for the first time
    loadAudio();


    onNewWordObserver(function(mutations, observer) {
        // loads audio everytime the word DOM changes
        loadAudio();
    });


    playSoundButton.onclick = function(){
        playAudio();
    };


    document.getElementById('submitAnswer').onclick = function(){
        playAudio();
    };

})();

// plays the audio
// finds the word than loads the audo if needed and plays it
function playAudio(){
    var word = getWord();

    if(word === null) {
        console.log("Cannot get word :(");
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
    observer.observe(target, config);
}

// accepts function that is triggered when user has answered correctly
function onCorrectAnswerObserver(f){
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    var observer = new MutationObserver(f);

    // configuration of the observer:
    var config = { attributes: true, childList: true, characterData: true };

    // TODO find target and change the config
    // select the target node
    var target = null;
    
    // pass in the target node, as well as the observer options
    observer.observe(target, config);
}

// adds all the buttons and loading images to the webpage
function initElements(){
    // create "play audio button"
    playSoundButton = htmlToElement(buttonHtml);
    loadingImage = htmlToElement(loadingImageHtml);
    playSoundButton.appendChild(loadingImage);
    //buttonWraper.innerHTML = buttonHtml;

    // insert
    var answerPanel = document.getElementById('answerPanel');
    answerPanel.parentNode.insertBefore(playSoundButton, answerPanel.nextSibling);    
}

// get the dom that is containg word that it has to play
function getWordDom(){
    var detailKanjiDiv = document.getElementById("detailKanji");
    var kanjisDom = detailKanjiDiv.getElementsByClassName("text");

    if(kanjisDom && kanjisDom.length >= 1){
        return kanjisDom[0];
    }
    
    return null;
}

// finds the word that it has to play
function getWord(){
    var kanjisDom = getWordDom();

    if(kanjisDom != null){
        // get just the first kanji
        var kanjis =  kanjisDom.innerHTML;
        var splitKanjis = kanjis.split("<br>");

        return splitKanjis[0];;
    } else {
        return null;
    }
}

// get audio url for a word and play it
function loadAudio(){
    vocubKanji = getWord();
    if(isEmpty(vocubKanji)) throw "vocubKanji cannot be empty!";

    audio = null;
    onAudioLoading();

    GM_xmlhttpRequest ( {
        method: 'GET',
        url:    'https://wanikaniaudio.herokuapp.com/url/' + vocubKanji,
        accept: 'text/xml',
        onreadystatechange: function (response) {
            console.log(response);

            if (response.readyState != 4)
                return;

            // get responseTxt
            var responseTxt = response.responseText;

            // check if responseTxt is valid
            if (!isEmpty(responseTxt) && !responseTxt.startsWith("Cannot")){
                audio = new Audio(responseTxt);
                onAudioReady(audio);
            } else {
                console.log("Invalid response " + responseTxt);
            }
        }
    } );
}

// check if string is empty
function isEmpty(str) {
    return (!str || 0 === str.length);
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

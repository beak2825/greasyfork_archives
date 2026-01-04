// ==UserScript==
// @name         Jisho Audio
// @namespace    https://github.com/deelawn/user-scripts
// @version      0.1
// @description  Adds audio to words and sentences on vocabulary. Works with Firefox and works with Chrome if referrers are disabled
// @author       deelawn
// @include      /^http(s?)://((www\.)?)jisho\.org/(search|word|sentences)/(.+)$/
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/39798/Jisho%20Audio.user.js
// @updateURL https://update.greasyfork.org/scripts/39798/Jisho%20Audio.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var audioLinkPartOne = "<a href=\"#\" class=\"concept_audio concept_light-status_link\" onclick=\"var audio = document.createElement('audio'); audio.src='https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=";
  var audioLinkPartTwo = "&tl=ja&total=1&idx=0'; audio.type='audio/mpeg'; audio.play();\">Play audio</a>";

  function processWord(wrapper, sourceObj){
    // Do nothing if audio provided by Jisho
    if ($(wrapper + " > div[class*='concept_light-status'] > audio", sourceObj).length){
      return;
    }

    // Get the text to be used in the audio source link
    var jpText = $(wrapper + " > div[class*='concept_light-readings'] > div > span[class='text']", sourceObj).text().trim();
    var insertLinkSel = wrapper + " > div[class*='concept_light-status']";

    // Some katakana words are structured differently
    if($(" > div[class*='concept_light-status']", sourceObj).length){
      insertLinkSel = " > div[class*='concept_light-status']";
    }

    // Insert the play audio link before the first non-span element under the word
    $(insertLinkSel, sourceObj).children().each(function(){
      if(!($(this).is("span"))){
        $(this).before(audioLinkPartOne + jpText + audioLinkPartTwo);
        return false;
      }
    });
  }

  function processSentence(sourceObj){
    // Build the japanese sentence
    var jpText = "";
    $(" > div[class='sentence_content'] > ul", sourceObj).children().each(function(){
      jpText += $(" > span[class='unlinked']", this).text().trim();
    });

    // Insert link after the sentence block
    $(" > div[class='sentence_content'] > div[class*='english_sentence']", sourceObj).after(audioLinkPartOne + jpText + audioLinkPartTwo);
  }

  $(document).ready(function() {
    // Need to remove the referrer; otherwise returns 404s
    var remRef = document.createElement('meta');
    remRef.name = 'referrer';
    remRef.content = 'no-referrer';
    document.querySelector('head').append(remRef);

    var wordsIdentifier = "div[id='primary']";
    var sentencesIdentifier = "div[id='secondary'] > div[class='sentences_block'] > ul";
    var detailWordIdentifier = "article[class*='concept_page'] > div[class*='concept_light']";
    var detailSentenceIdentifier = "article[class*='sentences'] > li";

    // Process words search results
    if ($(wordsIdentifier).length){
      // Children of the primary div are two divs: words and concepts
      $(wordsIdentifier).children().each(function(){
        $(this).children().each(function(){
          // First child will be h4, so skip
          if ($(this).is("h4")){
            return;
          }

          var wrapper = "div[class*='concept_light-wrapper']";
          processWord(wrapper, this);
        });
      });
    }

    // Process sentences search results
    if($(sentencesIdentifier).length){
      $(sentencesIdentifier).children().each(function(){
        processSentence(this);
      });
    }

    var url = window.location.href;

    // Process individual words
    // First check URL matches and that content exists
    var regEx = /^http(s?):\/\/((www\.)?)jisho\.org\/word\/(.+)$/;
    if($(detailWordIdentifier).length && regEx.test(url)){
      var wrapper = detailWordIdentifier + " > div[class*='concept_light-wrapper']";
      processWord(wrapper, this);
    }

    // Process individual sentences
    regEx = /^http(s?):\/\/((www\.)?)jisho\.org\/sentences\/(.+)$/;
    if($(detailSentenceIdentifier).length && regEx.test(url)){
      processSentence($(detailSentenceIdentifier));
    }
  });
})();
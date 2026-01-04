// ==UserScript==
// @name         ao3 multishipper savior
// @namespace    ao3
// @version      1.0
// @description  Show only works with the specified character(s) in a (romantic/platonic/any) relationship
// @match      http*://archiveofourown.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498763/ao3%20multishipper%20savior.user.js
// @updateURL https://update.greasyfork.org/scripts/498763/ao3%20multishipper%20savior.meta.js
// ==/UserScript==

//DISCLAIMER
// this code is based on the ao3 savior and ao3 savior config script, which I adapted for another purpose.
// ao3 savior and ao3 savior config were created by tuff on greasyfork.org or tuff_ghost on userscripts.org, who kindly gave me permission to use it and share.


(function () {
  'use strict';

  /**** CONFIG ********************/
  
window.ao3MSsaviorConfig = {

    //Put the name of the character(s) that you want to read about in quotes and arterisk
    //you can put in several characters. Separate them with commas. Each name needs the quotes and asterisk
    characterList: ['*Aragorn*', '*Cloud Strife*'],

    //set to true if you want to include romantic relationships (Character/any)
    romantic: true,

    //set to true if you want to include platonic relationships (Character & any)
    platonic: false,

    //set to true, if you want to include works tagging the character one type of relationship (Character/any but not character & any and vice versa)
    //use with caution
    exclusive_relationship_type: false,

    //set to true, if you want to include works with the character tagged in past relationships or minor relationships
    //does not work perfectly because of tagging conventions
    include_past_or_minor_ship: false};


}());

 /********************************/
//
    //STOP RIGHT HERE
    //DO NOT EDIT THE REST OF THE SCRIPT

(function () {
  'use strict';

 var STYLE = '\n  html body .ao3-ms-savior-hidden.ao3-ms-savior-hidden {\n    display: none;\n  }\n  \n  \n';

  function addStyle() {
    var style = document.createElement('style');
    style.innerHTML = STYLE;
    style.className = 'ao3-ms-savior';

    document.head.appendChild(style);
  }

  var CSS_NAMESPACE = 'ao3-ms-savior';

  function blockWork(work, reason) {
      if(!reason) return

    work.className += ' ' + CSS_NAMESPACE + '-hidden';
  }

  function matchTermsWithWildCard(term0, pattern0) {
    var term = term0.toLowerCase();
    var pattern = pattern0.toLowerCase();

    if (term === pattern) return true;
    if (pattern.indexOf('*') === -1) return false;

    var lastMatchedIndex = pattern.split('*').filter(Boolean).reduce(function (prevIndex, chunk) {
      var matchedIndex = term.indexOf(chunk);
      return prevIndex >= 0 && prevIndex <= matchedIndex ? matchedIndex : -1;
    }, 0);

    return lastMatchedIndex >= 0;
  }

    var showThisItem = function showThisItem(list, includedCharacters, comparator,flagr, flagp, flagpm) {
    var matchingEntry = void 0;
    list.some(function (item) {
      includedCharacters.some(function (entry) {
        var matched = comparator(item, entry);
      if (matched) {
            if(!flagpm){
                if(flagr && item.indexOf("/")>0 && item.indexOf("Past ") == -1 && item.indexOf("Minor ") == -1 ) matchingEntry = entry;
                if(flagp && item.indexOf("&")>0 && item.indexOf("Past ") == -1 && item.indexOf("Minor ") == -1 ) matchingEntry = entry;
            }else{
          if(flagr && item.indexOf("/")>0) matchingEntry = entry;
          if(flagp && item.indexOf("&")>0) matchingEntry = entry;
            }
        }
        return matched;
      });
    });

    return matchingEntry;
  };


  function getBlockReason(ref,ref2) {
    var ref$tags = ref.tags,
        tags = ref$tags === undefined ? [] : ref$tags;

      var ref2$characterList = ref2.characterList,
        characterList = ref2$characterList === undefined ? [] : ref2$characterList;
      var romantic = ref2.romantic,
        platonic = ref2.platonic,
          pastMinor=ref2.include_past_or_minor_ship,
          exclusive= ref2.exclusive_relationship_type;


    var whiteTag = showThisItem(tags, characterList, matchTermsWithWildCard, romantic, platonic, pastMinor);
    var exclusiveTag=showThisItem(tags,characterList, matchTermsWithWildCard, !romantic, !platonic, pastMinor);
        if(whiteTag){
            if(exclusive){
                if(exclusiveTag) return true;
                else return null;
            }
            return null;
        } else{
        return true};
  }


  function isDebug(location) {
    return location.hostname === 'localhost' || /\ba3sv-debug\b/.test(location.search);
  }

  var getText = function getText(element) {
    return element.textContent.replace(/^\s*|\s*$/g, '');
  };
  var selectTextsIn = function selectTextsIn(root, selector) {
    return Array.from(root.querySelectorAll(selector)).map(getText);
  };

  function selectFromBlurb(blurb) {
    return {tags: [].concat(selectTextsIn(blurb, 'a.tag'), selectTextsIn(blurb, '.required-tags .text'))};
  }

  setTimeout(function () {
    var debugMode = isDebug(window.location);
    var config = window.ao3MSsaviorConfig;
    var workContainer = document.querySelector('#main.works-show');
    var blocked = 0;
    var total = 0;

    if (debugMode) {
      console.groupCollapsed('AO3 MS SAVIOR');
    }

    addStyle();

    Array.from(document.querySelectorAll('li.blurb')).forEach(function (blurb) {
      var blockables = selectFromBlurb(blurb);
      var reason = getBlockReason(blockables, config);

      total++;

      if (reason) {
        blockWork(blurb, reason);
        blocked++;

        if (debugMode) {
          console.groupCollapsed('- blocked ' + blurb.id);
          console.log(blurb, reason);
          console.groupEnd();
        }
      } else if (debugMode) {
        console.groupCollapsed('  skipped ' + blurb.id);
        console.log(blurb);
        console.groupEnd();
      }
    });
    if (debugMode) {
      console.log('Blocked ' + blocked + ' out of ' + total + ' works');
      console.groupEnd();
    }
  }, 10);

}());
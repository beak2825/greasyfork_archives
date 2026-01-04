// ==UserScript==
// @name        WaniKani Updated Show Context Sentence
// @namespace   joshuacancellier
// @match       https://www.wanikani.com/review/session
// @grant       none
// @version     1.0.2
// @license     Apache, https://www.apache.org/licenses/LICENSE-2.0
// @author      joshuacancellier
// @description Show context sentence on review page.
// @downloadURL https://update.greasyfork.org/scripts/427087/WaniKani%20Updated%20Show%20Context%20Sentence.user.js
// @updateURL https://update.greasyfork.org/scripts/427087/WaniKani%20Updated%20Show%20Context%20Sentence.meta.js
// ==/UserScript==

(function() {

if (!window.wkof) {
    alert('The show context sentence script requires Wanikani Open Framework.\nYou will now be forwarded to installation instructions.');
    window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
    return;
}

var currItem = null;
var sentence = "";
var sentenceNode = null;
var wk_items = null;

function process_items()
{
    if (wk_items == null || (currItem && typeof(currItem) === "undefined")) {
      return;
    }

    let type_index = wkof.ItemData.get_index(wk_items, 'item_type');
    if (typeof(currItem.voc) !== "undefined") {
      let voc = type_index['vocabulary'];
      let voc_by_name = wkof.ItemData.get_index(voc, 'slug');
      sentence = voc_by_name[currItem.voc].data.context_sentences[0].ja;
    } else if (typeof(currItem.kan) !== "undefined") {
      let kan = type_index['kanji'];
      let kan_by_name = wkof.ItemData.get_index(kan, 'slug');
      if (typeof(kan_by_name[currItem.kan]).data.context_sentences !== "undefined") {
        sentence = kan_by_name[currItem.kan].data.context_sentences[0].ja;
      } else {
        sentence = "";
      }
    } else {
      sentence = "";
    }

    sentenceNode.innerHTML = '<a target="_blank" href="https://jisho.org/search/' + sentence + '">' + sentence + '</a>';

}

// Code from Stack Overflow to detect changes in the DOM.
// (http://stackoverflow.com/questions/3219758/detect-changes-in-the-dom/14570614#14570614)
var observeDOM = (function()
{
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver,
        eventListenerSupported = window.addEventListener;

    return function(obj, callback) {
        if (MutationObserver) {
            // define a new observer
            var obs = new MutationObserver(function(mutations, observer){
                if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
                    callback();
            });
            // have the observer observe for changes in children
            obs.observe( obj, { childList:true, subtree:true });
        }
        else if( eventListenerSupported ){
            obj.addEventListener('DOMNodeInserted', callback, false);
            obj.addEventListener('DOMNodeRemoved', callback, false);
        }
    }
})();

function fetch_items()
{
    wkof.ItemData.get_items()
        .then((items) => { wk_items = items; })
        .then(process_items);
}

function startup_wkof()
{
    wkof.include('ItemData');
    wkof.ready('ItemData')
      .then(fetch_items);
}

function install_context_sentence_css()
{
    var better_font = "<link href=\"https://fonts.googleapis.com/css?family=Sawarabi+Mincho\" rel=\"stylesheet\">";
    var context_sentence_css = ".wf-sawarabimincho { font-family: \"Sawarabi Mincho\"; font-size:1.5em; background-color:#a100f1; color:inherit; text-decoration:none; }"
    var a_css = "a { color: inherit; text-decoration: none; }"

    $('head').append(better_font);
    $('head').append('<style>' + a_css + '</style>');
    $('head').append('<style>'+ context_sentence_css +'</style>');
}

// Callback function observing the 'question-type' div 'h1' element
var observeMe = $('#question-type h1')[0];

$(document).ready(function()
{
  parent =
  sentenceNode = document.createElement('div');
  // sentenceNode.setAttribute('style', 'font-family: \'Sawarabi Mincho\', serif;');
  sentenceNode.setAttribute('class', 'wf-sawarabimincho');
  // sentenceNode.innerHTML = '<a href="https://jisho.org/search/' + sentence + '">' + sentence + '</a>';
  sentenceNode.innerHTML = '<span>' + sentence + '</span>';
  $(document.getElementById("question").insertBefore(sentenceNode, document.getElementById("question-type")));
  startup_wkof();
  install_context_sentence_css();
  console.log( "ready!" );
});

function get_new_sentence(item)
{
    process_items(wk_items);
}
            
observeDOM(observeMe, function()
{
  var objCurItem = $.jStorage.get("currentItem");

  // Make sure that the currentItem has changed before updating.
  // Otherwise you will respond to your own DOM changes.
  if (objCurItem !== currItem) {
    currItem = objCurItem;
    get_new_sentence();
  }
});

})();

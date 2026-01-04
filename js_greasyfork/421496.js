// ==UserScript==
// @name        WaniKani Show Context Sentence
// @namespace   skatefriday
// @match       https://www.wanikani.com/subjects/review
// @match       https://www.wanikani.com/subjects/extra_study*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant       none
// @version     1.1.2
// @license     Apache, https://www.apache.org/licenses/LICENSE-2.0
// @author      skatefriday
// @description Show context sentence on review page.
// @downloadURL https://update.greasyfork.org/scripts/421496/WaniKani%20Show%20Context%20Sentence.user.js
// @updateURL https://update.greasyfork.org/scripts/421496/WaniKani%20Show%20Context%20Sentence.meta.js
// ==/UserScript==

(function() {
  
if (!window.wkof) {
    alert('The show context sentence script requires Wanikani Open Framework.\nYou will now be forwarded to installation instructions.');
    window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
    return;
}

var currSubject = null;
var sentence = "";
var sentenceNode = null;
var wk_items = null;

function get_new_sentence()
{
    if (wk_items == null) {
      return;
    }

    if (currSubject.type === "Vocabulary") {
      let id_index = wkof.ItemData.get_index(wk_items, 'subject_id');
      let item = id_index[currSubject.id]
      sentence = item.data.context_sentences[0]?.ja || '';
    } else {
      sentence = ""
    }
  
    sentenceNode.innerHTML = '<span>' + sentence + '</span>';
}

window.addEventListener(`willShowNextQuestion`, e => {
	console.log(e.detail);
  currSubject = e.detail.subject;
  get_new_sentence();
});

var config = {
    wk_items: {
        options: {
            study_materials: true
        }
    }
};

//
// Note that this async operation is slower than the willShowNextQuestion above.
// Which is why we cache the current subject as a global in the event handler.  
// Otherwise the first item, if vocabulary, will have no sentence.
//
function fetch_items()
{
    wkof.ItemData.get_items(config)
        .then((items) => { wk_items = items; })
        .then(get_new_sentence);
    
    console.log("Fetched the items")
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
    var context_sentence_css = ".wf-sawarabimincho { font-family: \"Sawarabi Mincho\"; font-size:1.5em; background-color:#a100f1; color:#ffffff}"

    $('head').append(better_font);
    $('head').append('<style>'+ context_sentence_css +'</style>');
}

$(document).ready(function()
{
  parent =
  sentenceNode = document.createElement('div');
  // sentenceNode.setAttribute('style', 'font-family: \'Sawarabi Mincho\', serif;');
  sentenceNode.setAttribute('class', 'wf-sawarabimincho');
  sentenceNode.setAttribute('style', 'text-align:center')
  sentenceNode.innerHTML = '<span>' + sentence + '</span>';
  $(document.getElementsByClassName('quiz__content')[0].insertBefore(sentenceNode, document.getElementsByClassName('quiz-input')[0]));
  startup_wkof();
  install_context_sentence_css();
  console.log( "ready!" );
});
          
})();

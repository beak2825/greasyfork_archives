// ==UserScript==
// @name        Wanikani Common Vocab Indicator
// @namespace   dtwigs
// @author      dtwigs
// @description Show whether the vocabulary word is common or not according to Jisho.org
// @run-at      document-end
// @include     *://www.wanikani.com/review/session*
// @include     *://www.wanikani.com/lesson/session*
// @version     0.0.4
// @run-at      document-end
// @grant       GM_xmlhttpRequest
// @connect     *
// @downloadURL https://update.greasyfork.org/scripts/33129/Wanikani%20Common%20Vocab%20Indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/33129/Wanikani%20Common%20Vocab%20Indicator.meta.js
// ==/UserScript==

console.log('/// start of WK Common Vocab Indicator');


var css = 
    '.common-indicator-item {' +
    '    position: absolute;' +
    '    padding: 0px 5px 2px;' +
    '    top: 40px;' +
    '    left: 20px;' +
    '    -webkit-border-radius: 3px;' +
    '    -moz-border-radius: 3px;' +
    '    border-radius: 3px;' +
    '    z-index: 100;' +
    '    letter-spacing: 0;' +
    '    opacity: 0.8;' +
    '    text-decoration: none;' +
    '}' +
    '.common-indicator-item.hide {' +
    '    background-color: transparent;' +
    '    color: transparent;' +
    '}' +
    '.common-indicator-item.fetching {' +
    '    background-color: white;' +
    '    opacity: 0.4;' +
    '    color: #a100f1;' +
    '}' +
    '.common-indicator-item.common {' +
    '    background-color: white;' +
    '    color: #a100f1;' +
    '}' +
    '.common-indicator-item.uncommon {' +
    '    background-color: transparent;' +
    '    color: white;' +
    '    opacity: 0.5;' +
    '}';

var jishoApiUrl = "http://jisho.org/api/v1/search/words?keyword=";
var jishoSearchUrl = "http://jisho.org/search/";
var allClasses = {
  hide: {
    klass: 'hide',
    text: '',
  },
  fetching: {
    klass: 'fetching',
    text: '...',
  },
  common: {
    klass: 'common',
    text: 'common'
  },
  uncommon: {
    klass: 'uncommon',
    text: 'not common',
  }
};

addStyle(css);

$('#question').append('<div id="common-indicator" class="common-indicator-item"></div>');
$('#lessons').append('<div id="common-indicator" class="common-indicator-item"></div>');

//every time item changes, look up vocabulary from jisho.org
$.jStorage.listenKeyChange('currentItem', function(){
   var currentItem = $.jStorage.get('currentItem');
   var vocab = currentItem.voc;
    
   // Check if item is not vocab
   if (currentItem.on || currentItem.kun) {
      setClassAndText(allClasses.hide);
      return;
   }
   
   fetchJishoData(vocab);
});

$.jStorage.listenKeyChange('l/currentLesson', function(){
  var currentLesson = $.jStorage.get('l/currentLesson');
  var vocab = currentLesson.voc;

  // Check if item is not vocab
   if (currentLesson.on || currentLesson.kun) {
      setClassAndText(allClasses.hide);
      return;
   }

   fetchJishoData(vocab);
});

function fetchJishoData(vocab) {
  setClassAndText(allClasses.fetching);
  GM_xmlhttpRequest({
      method: 'get',
      url: jishoApiUrl + vocab, 
      responseType: 'json',
      onload: function(response) {
        setCommonIndicator(response.response.data[0].is_common);
      }, 
      onerror: function(error){
          console.log('Jisho error: ', error); 
      }
  });
}

function setCommonIndicator(isCommon) {  
    if (isCommon) {
        setClassAndText(allClasses.common); 
    } else {
        setClassAndText(allClasses.uncommon);
    }
}

function setClassAndText(aObj) {
    var $wrapper = $('#common-indicator');
    for (var klass in allClasses) {
        $wrapper.removeClass(klass);
    }

    $wrapper.text(aObj.text).addClass(aObj.klass);
}

function addStyle(aCss) {
  var head, style;
  head = document.getElementsByTagName('head')[0];
  if (head) {
    style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.textContent = aCss;
    head.appendChild(style);
    return style;
  }
  return null;
}
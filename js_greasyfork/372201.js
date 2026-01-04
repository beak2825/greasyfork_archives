// ==UserScript==
// @name        NHK Easy Jisho Lookup
// @namespace   dtwigs
// @author      dtwigs
// @description Click to show jisho dictionary definition
// @run-at      document-end
// @include     *://www3.nhk.or.jp/news/easy/*
// @version     0.0.5
// @run-at      document-end
// @grant       GM_xmlhttpRequest
// @connect     *
// @downloadURL https://update.greasyfork.org/scripts/372201/NHK%20Easy%20Jisho%20Lookup.user.js
// @updateURL https://update.greasyfork.org/scripts/372201/NHK%20Easy%20Jisho%20Lookup.meta.js
// ==/UserScript==

console.log('/// start of NHK Easy Jisho Lookup');

var css = 
    '.jisho-definition {' +
    '    position: relative;' +
    '    padding: 8px 12px;' +
    '    border: 1px solid #92d863;' +
    '    margin: 8px 0 0;' +
    '    background-color: #edf5f7;' +
    '    font-size: 11px;' +
    '}';

var jishoApiUrl = "http://jisho.org/api/v1/search/words?keyword=";

addStyle(css);
$(document).ready(function () {
    $('.dicWin').click(function () {  
        fetchJishoData($('.dictionary-contents__title span').text() || '');  
    });
});
    
function fetchJishoData(vocab) {
  GM_xmlhttpRequest({
      method: 'get',
      url: jishoApiUrl + vocab, 
      responseType: 'json',
      onload: function(response) {
        populateDefinition(response.response.data[0].senses);
      }, 
      onerror: function(error){
          console.log('Jisho error: ', error); 
      }
  });
}

function populateDefinition(definitions) {
    var keywords = definitions[0].english_definitions.join(", ");
    $('#js-dictionary-box .dictionary-contents').append("<div class='jisho-definition'><span style='font-weight: bold;'>Jisho results:</span><div>" + keywords + "</div></div>"); 
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
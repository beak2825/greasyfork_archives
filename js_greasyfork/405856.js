// ==UserScript==
// @name     Sanskrit transliteration
// @version  0.0.0.1
// @description:en Adds transliterations in IAST for Sanskrit written in a variety of Indic scripts.
// @include  http*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require  https://cdn.jsdelivr.net/npm/@sanskrit-coders/sanscript@1.1.0/sanscript.min.js
// @require  https://unpkg.com/@popperjs/core@2
// @require  https://unpkg.com/tippy.js@6
// @namespace https://greasyfork.org/users/624256
// @description Adds transliterations in IAST for Sanskrit written in a variety of Indic scripts.
// @downloadURL https://update.greasyfork.org/scripts/405856/Sanskrit%20transliteration.user.js
// @updateURL https://update.greasyfork.org/scripts/405856/Sanskrit%20transliteration.meta.js
// ==/UserScript==

//var timePre = performance.now();
addTransliteration(document.body);
//var timeAfter = performance.now();
//console.log('Indic transliteration added. Time elapsed: ' + (timeAfter - timePre) + ' ms.');

function addTransliteration(rNode) {
  var node, nodes=document.createTreeWalker(rNode,NodeFilter.TEXT_NODE);
  while(node = nodes.nextNode()) {
    if(node.nodeType !== Node.COMMENT_NODE &&
       node.parentElement.type !== "textarea") {
      var text = node.nodeValue;
      if(text !== null && hasIndicCharacters(text)) {
        var words = text.split(' ');
        var out = [];
        words.forEach(function(word) {
          var indicType = getIndicCharType(word)
          if(indicType !== "none") {
            var transliterated = Sanscript.t(word, indicType, 'iast');
            transliterated = transliterated.replace(/["\.,\(\) \?]/g, '');
            out.push('<span class="tippy-indic-word" data-tippy-content="' + transliterated + '">' + word + '</span>');
          } else {
            out.push(word);
          }
        });
        var newNode = document.createElement('span');
        newNode.setAttribute('class', 'tippy-indic-wrapper');
        newNode.innerHTML = out.join(' ');
        node.parentNode.insertBefore(newNode, node);
        node.nodeValue = '';
      }
    }
  }
  tippy('.tippy-indic-word', {
    followCursor: 'initial',
    delay: [100, null],
  });
}

function hasIndicCharacters(str) {
  return (str.split("").filter(function(char) {
    var charCode = char.charCodeAt();
    return (charCode >= 0x900 && charCode <= 0xd7f);
  }).length > 0);
}

function getIndicCharType(str) {
  var charIndicTypes = str.split("").map( function(char){ 
    var charCode = char.charCodeAt();
    if(charCode >= 0x900 && charCode <= 0x97f) return 'devanagari';
    else if(charCode >= 0x980 && charCode <= 0x9ff) return 'bengali';
    else if(charCode >= 0xa00 && charCode <= 0xa7f) return 'gurmukhi';
    else if(charCode >= 0xa80 && charCode <= 0xaff) return 'gujarati';
    else if(charCode >= 0xb00 && charCode <= 0xb7f) return 'oriya';
    else if(charCode >= 0xb80 && charCode <= 0xbff) return 'tamil';
    else if(charCode >= 0xc00 && charCode <= 0xc7f) return 'telugu';
    else if(charCode >= 0xc80 && charCode <= 0xcff) return 'kannada';
    else if(charCode >= 0xd00 && charCode <= 0xd7f) return 'malayalam';
    else return null;
  }).filter(function(value, index, self) {
    return (value !== null && self.indexOf(value) === index);
  });
  if(charIndicTypes.length === 0) return 'none';
  else if(charIndicTypes.length === 1) return charIndicTypes[0];
  else return 'mixed';
}
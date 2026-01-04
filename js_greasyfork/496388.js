// ==UserScript==
// @name     4chan umineko colored truths
// @description enable umineko colored truths on 4chan
// @version  6
// @grant    none
// @include *//boards.4chan.org/*
// @include *//boards.4channel.org/*
// @namespace https://greasyfork.org/users/1308655
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496388/4chan%20umineko%20colored%20truths.user.js
// @updateURL https://update.greasyfork.org/scripts/496388/4chan%20umineko%20colored%20truths.meta.js
// ==/UserScript==
function process() {
  posts=document.getElementsByClassName('postMessage');
  for (var post of posts) {
    for (var i = 0; i < post.childNodes.length; ++i) {
      var node = post.childNodes[i];
      if (node.nodeName == '#text') {
        var a, b;
        a = node.textContent.indexOf('[red]');
        b = node.textContent.indexOf('[/red]', a);
        if (a != -1 && b != -1 && a < b) {
          var span = document.createElement("span");
          span.textContent = node.textContent.substring(a + 5, b);
          span.style='color:red;font-weight:bold';
          var prefix = document.createTextNode(node.textContent.substring(0, a));
          node.textContent = node.textContent.substring(b + 6);
          post.insertBefore(prefix, node);
          post.insertBefore(span, node);
          --i;
          continue;
        }
        a = node.textContent.indexOf('[blue]');
        b = node.textContent.indexOf('[/blue]', a);
        if (a != -1 && b != -1 && a < b) {
          var span = document.createElement("span");
          span.textContent = node.textContent.substring(a + 6, b);
          span.style='color:blue;font-weight:bold';
          var prefix = document.createTextNode(node.textContent.substring(0, a));
          node.textContent = node.textContent.substring(b + 7);
          post.insertBefore(prefix, node);
          post.insertBefore(span, node);
          --i;
          continue;
        }
        a = node.textContent.indexOf('[purple]');
        b = node.textContent.indexOf('[/purple]', a);
        if (a != -1 && b != -1 && a < b) {
          var span = document.createElement("span");
          span.textContent = node.textContent.substring(a + 8, b);
          span.style='color:purple;font-weight:bold';
          var prefix = document.createTextNode(node.textContent.substring(0, a));
          node.textContent = node.textContent.substring(b + 9);
          post.insertBefore(prefix, node);
          post.insertBefore(span, node);
          --i;
          continue;
        }
        a = node.textContent.indexOf('[gold]');
        b = node.textContent.indexOf('[/gold]', a);
        if (a != -1 && b != -1 && a < b) {
          var span = document.createElement("span");
          span.textContent = node.textContent.substring(a + 6, b);
          span.style='color:gold;font-weight:bold';
          var prefix = document.createTextNode(node.textContent.substring(0, a));
          node.textContent = node.textContent.substring(b + 7);
          post.insertBefore(prefix, node);
          post.insertBefore(span, node);
          --i;
          continue;
        }
      }
    }
  }
}
function replaceTextOnPage(from, to){
  getAllTextNodes().forEach(function(node){
    node.nodeValue = node.nodeValue.replace(new RegExp(quote(from), 'g'), to);
  });

  function getAllTextNodes(){
    var result = [];

    (function scanSubTree(node){
      if(node.childNodes.length)
        for(var i = 0; i < node.childNodes.length; i++)
          scanSubTree(node.childNodes[i]);
      else if(node.nodeType == Node.TEXT_NODE)
        result.push(node);
    })(document);

    return result;
  }

  function quote(str){
    return (str+'').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
  }
}
replaceTextOnPage('KeiRika', 'RatoKei');
replaceTextOnPage('Keirika', 'Ratokei');
replaceTextOnPage('keirika', 'ratokei');
replaceTextOnPage('SatoRika', 'RaToko');
replaceTextOnPage('Satorika', 'Ratoko');
replaceTextOnPage('satorika', 'ratoko');
replaceTextOnPage('Rika', 'Ratka');
replaceTextOnPage('rika', 'ratka');
replaceTextOnPage('nano desu', 'nano dechuu');
replaceTextOnPage('nipah', 'chuupah');
process();
document.addEventListener('4chanXInitFinished', function(e) {
  process();
});
document.addEventListener('ThreadUpdate', function(e) {
  process();
});

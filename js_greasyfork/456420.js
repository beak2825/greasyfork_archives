// ==UserScript==
// @name          Wikipedia Anarchy Hack
// @namespace     greasyfork
// @description	  Fun with Wikipedia.org, appealing for 'Ⓐnarchy!!'' on every 'A'
// @author        Noudio
// @license       MIT
// @homepage      -
// @include       http://wikipedia.org/*
// @include       https://wikipedia.org/*
// @include       http://*.wikipedia.org/*
// @include       https://*.wikipedia.org/*
// @include       http://wikimedia.org/*
// @include       https://wikimedia.org/*
// @include       http://*.wikimedia.org/*
// @include       https://*.wikimedia.org/*
// @run-at        document-idle
// @version       1.3
// @downloadURL https://update.greasyfork.org/scripts/456420/Wikipedia%20Anarchy%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/456420/Wikipedia%20Anarchy%20Hack.meta.js
// ==/UserScript==
(function() {

    function isDomain(x) {
        return document.domain.substring(document.domain.indexOf(x)) == x;
    }
    var isPedia = isDomain("wikipedia.org");
    var isMedia = isDomain("wikimedia.org");
    if (!isPedia && !isMedia)
        return;

    //console.log('anarchy1!');

    // -----------------------------
    // text replacement function
    function doSomething(element) {
      element.nodeValue =
          element.nodeValue.replace(/A([A-Za-z]*)/g,
              function(a,b){
                  exclNr = Math.floor(Math.random()*4.0);
                  if (b != '')
                      return "Ⓐ"+b+" - Ⓐnarchy"+"!".repeat(exclNr)+" -";
                      return "Ⓐ";});
      //console.log('anarchy el:'+element.nodeValue);
    }

    // -----------------------------
    // recursive scan for text nodes
    function recurse(element)
    {
        // recursively call your self on your child nodes
        element.childNodes.forEach(n => recurse(n));

        // do only something for capital letters A
        if (element.nodeType == Node.TEXT_NODE && /A/.test(element.nodeValue))
            doSomething(element);
    }

    // ---------------------------------------------------
    // handler to continuously observe dom for added nodes
    var observeDOM = (function(){
      var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

      return function( obj, callback ){
        if( !obj || obj.nodeType !== 1 ) return;

        if( MutationObserver ){
          // define a new observer
          var mutationObserver = new MutationObserver(callback)

          // have the observer observe for changes in children
          mutationObserver.observe( obj, { childList:true, subtree:true })
          return mutationObserver
        }

        // browser support fallback
        else if( window.addEventListener ){
          obj.addEventListener('DOMNodeInserted', callback, false)
          obj.addEventListener('DOMNodeRemoved', callback, false)
        }
      }
    })();

    // ---------------------------------------------------
    // first time replace the body
    recurse(document.body);

    // --------------------------------------------------------------
    // Observe the body element and apply anarchy for added elements:
    observeDOM( document.body, function(m){
      var addedNodes = [], removedNodes = [];

      m.forEach(record => record.addedNodes.length & addedNodes.push(...record.addedNodes))
      //m.forEach(record => record.removedNodes.length & removedNodes.push(...record.removedNodes))
     //console.clear();
     //console.log('Added:', addedNodes, 'Removed:', removedNodes);
     //console.log('Added:', addedNodes);
     addedNodes.forEach(n => recurse(n));
   });


})();
//Taf!

// ==UserScript==
// @name         DeviantART Details Raised
// @version      2019.04.10
// @description  Makes details section more prominent by moving it up to below the download button.
// @author       Obsidian
// @namespace    https://greasyfork.org/en/users/318252-obsidian
// @grant        none
// @include      /^https?://www\.deviantart\.com/.+/art/.*-[0-9]+/
// @include      /^https?://www\.deviantart\.com/.+/gallery/
// @include      /^https?://www\.deviantart\.com/tag/.+/
// @include      /^https?://www\.deviantart\.com/(.+/)*\?.+/
// @include      /^https?://www\.deviantart\.com/(.+/)*/
// @include      /^https?://www\.deviantart\.com$/
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/387556/DeviantART%20Details%20Raised.user.js
// @updateURL https://update.greasyfork.org/scripts/387556/DeviantART%20Details%20Raised.meta.js
// ==/UserScript==

  (function() {
    var strScript = 'var insertionListener = function(event){ \r\n' +
    '  if(event.animationName === "nodeInserted"){ \r\n' +
    '    if(!!event.target.className && event.target.className.indexOf("dev-metainfo-content dev-metainfo-stats")>0){ \r\n' +
    '      /* console.log("Node has been inserted: " + event.target); */ \r\n' +
    '      moveDetailsSection(event.target.parentElement); \r\n' +
    '    } \r\n' +
    '  } \r\n' +
    '}; \r\n' +
    'function moveDetailsSection(root) { \r\n' +
    '  if(typeof root === "undefined" || root===null){root = document;} \r\n' +
    '  /* console.log(root.className); */ \r\n' +
    '  var destNode = root.getElementsByClassName("dev-meta-actions")[0]; \r\n' +
    '  if(typeof destNode === "undefined"){return;} \r\n' +
    '  var wrapper = document.createElement("div"); \r\n' +
    '  destNode.parentNode.insertBefore(wrapper, destNode.nextElementSibling); \r\n' +
    '  var hrNode; \r\n' +
    '  hrNode = root.getElementsByClassName("dev-metainfo-details")[0].previousElementSibling; \r\n' +
    '  wrapper.appendChild( root.getElementsByClassName("dev-metainfo-details")[0] ); \r\n' +
    '  wrapper.appendChild( root.getElementsByClassName("dev-metainfo-details")[1] ); \r\n' +
    '  wrapper.appendChild( hrNode ); \r\n' +
    '  hrNode = root.getElementsByClassName("dev-metainfo-stats")[0].previousElementSibling; \r\n' +
    '  wrapper.appendChild( root.getElementsByClassName("dev-metainfo-stats")[0] ); \r\n' +
    '  wrapper.appendChild( root.getElementsByClassName("dev-metainfo-stats")[1] ); \r\n' +
    '  wrapper.appendChild( hrNode ); \r\n' +
    '  console.log("Details/Stats section moved"); \r\n' +
    '  /** extra: detect and move ".dev-metainfo-license" **/ \r\n' +
    '  if(root.getElementsByClassName("dev-metainfo-license").length > 0){ \r\n' +
    '    hrNode = root.getElementsByClassName("dev-metainfo-license")[0].previousElementSibling; \r\n' +
    '    wrapper.appendChild( root.getElementsByClassName("dev-metainfo-license")[0] ); \r\n' +
    '    wrapper.appendChild( root.getElementsByClassName("dev-metainfo-license")[1] ); \r\n' +
    '    wrapper.appendChild( hrNode ); \r\n' +
    '    console.log("License section moved"); \r\n' +
    '  } \r\n' +
    '  /** extra: detect and move ".dev-metainfo-camera" **/ \r\n' +
    '  if(root.getElementsByClassName("dev-metainfo-camera").length > 0){ \r\n' +
    '    hrNode = root.getElementsByClassName("dev-metainfo-camera")[0].previousElementSibling; \r\n' +
    '    wrapper.appendChild( root.getElementsByClassName("dev-metainfo-camera")[0] ); \r\n' +
    '    wrapper.appendChild( root.getElementsByClassName("dev-metainfo-camera")[1] ); \r\n' +
    '    wrapper.appendChild( hrNode ); \r\n' +
    '    console.log("Camera section moved"); \r\n' +
    '  } \r\n' +
    '} \r\n' +
    'document.addEventListener("animationstart", insertionListener, false); \r\n' +
    'document.addEventListener("webkitAnimationStart", insertionListener, false)';
    
    var strCss = '@keyframes nodeInserted { \r\n' +
    '  from { opacity: 0.99; } \r\n' +
    '  to { opacity: 1; } \r\n' +
    '} \r\n' +
    '.dev-view-meta * { \r\n' +
    '  animation-duration: 0.001s; \r\n' +
    '  animation-name: nodeInserted; \r\n' +
    '}';
    
    var cssNode =  window.document.createElement('style');
    cssNode.type = 'text/css';
    var cssTxt = window.document.createTextNode(strCss);
    cssNode.appendChild(cssTxt);
    
    var scriptNode = window.document.createElement('script');
    scriptNode.type = 'text/javascript';
    scriptNode.async = true;
    scriptNode.setAttribute('id', 'insertion-listener');
    scriptNode.onload = function(){
        // remote script has loaded
    };
    var scriptTxt = window.document.createTextNode(strScript);
    scriptNode.appendChild(scriptTxt);
    
    var inject_elements = function(){
      window.document.getElementsByTagName('head')[0].appendChild(cssNode);
      window.document.getElementsByTagName('head')[0].appendChild(scriptNode);
    };
    
    // Test if readyState was fired yet and append the elements
    if(/comp|inter|loaded/.test(document.readyState)){
      // In case DOMContentLoaded was already fired, the document readyState will be one of "complete" or "interactive" or (nonstandard) "loaded".
      inject_elements();
    }else{
      document.addEventListener("DOMContentLoaded", inject_elements, false);
    }
  }());
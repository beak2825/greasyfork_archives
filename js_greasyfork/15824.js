// ==UserScript==
// @name         AutoTOC
// @namespace    http://runeskaug.com/greasemonkey
// @description  Automatically creates a table of contents for all HTML-headers on a web page.
// @author       Rune Skaug (greasemonkey@runeskaug.com), IzzySoft
// @license      CC BY (https://creativecommons.org/licenses/by/2.5/)
// @include      http://*
// @include      https://*
// @version      1.9.2
// @grant        GM_registerMenuCommand
// @grant        GM.registerMenuCommand
// @grant        GM_addStyle
// @grant        GM.addStyle
// @homepageURL  https://codeberg.org/izzy/userscripts
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/15824/AutoTOC.user.js
// @updateURL https://update.greasyfork.org/scripts/15824/AutoTOC.meta.js
// ==/UserScript==

(function() {
  // text constants
  var fullTOCText = "Table of Contents";
  var hideBtnText = "\u00a0X\u00a0";
  var RXmatch = /^h[1-4]$/i; // regexp
  var XPmatch = "//h1|//h2|//h3|//h4"; // xpath
  //set the optional behaviour of the TOC box
  // if true, resets it to its initial state after you have selected a header - false does not reset it
  var resetSelect = true;
  // if true, shows a "Hide TOC"/close button on the left side of the bar
  var showHide = true;
  // if true, hides the TOC for all pages on current site
  var useCookie = true;
  // if true, adds menu item (Toggle TOC)
  var addMenuItem = true;
  // to check whether loading CSS is blocked by CSP
  var cssLoaded = false;
  // CSS definition
  cssJsToc = 'position: fixed; left: 0; right: 0; top: auto; bottom: 0; width: 100%; display: block; border-top: 1px solid #777; background: #ddd; margin: 0; padding: 3px; z-index: 9999;';
  cssSelect = 'font: 8pt verdana, sans-serif; margin: 0; margin-left:5px; background: #fff; color: #000; float: left; padding: 0; vertical-align: bottom;';
  cssOption = 'font: 8pt verdana, sans-serif; color: #000;';
  cssHideBtn = 'font: bold 8pt verdana, sans-serif !important; float: left; margin-left: 2px; margin-right: 2px; padding: 1px; border: 1px solid #999; background: #e7e7e7;';
  cssHideLink = 'color: #333; text-decoration: none; background: transparent;} #js-toc .hideBtn a:hover { color: #333; text-decoration: none; background: transparent;';

  function f() {
    //only on (X)HTML pages containing at least one heading - excludes XML files, text files, plugins and images (displayed using minimal HTML)
    if (document.getElementsByTagName("html").length && ( document.getElementsByTagName('h1').length || 
                                                          document.getElementsByTagName('h2').length || 
                                                          document.getElementsByTagName('h3').length || 
                                                          document.getElementsByTagName('h4').length ) 
                                                     && (!useCookie || (useCookie && getCookie('autotoc_hide')!='true'))) {
      var aHs = getHTMLHeadings();
      if (aHs.length>1) { // HTML document, more than one heading.
        var body = document.getElementsByTagName('body')[0];
        body.style.marginBottom = "24px !important";
        GM_addStyle('@media print { #js-toc {display: none; visibility: hidden; }}\n'+
                    '@media screen { #js-toc { '+cssJsToc+' }\n'+
                    '#js-toc-dummy { display:none; }\n'+
                    '#js-toc select { '+cssSelect+' }\n'+
                    '#js-toc option { '+cssOption+' }\n'+
                    '#js-toc .hideBtn { '+cssHideBtn+' }\n'+
                    '#js-toc .hideBtn a { '+cssHideLink+' }\n'+
                    '#js-toc:not(:hover) { height: 2px !important; width: 5px !important; border-radius: 5px !important; background-color: #00f !important; }'
                   );
        // check whether our CSS was loaded:
        var dummy = document.createElement('span');
        dummy.id = 'js-toc-dummy';
        document.body.appendChild(dummy);
        if ( getComputedStyle(document.getElementById('js-toc-dummy')).display == 'none' ) { cssLoaded = true; }
        dummy.parentNode.removeChild(dummy);
        // Browser sniff++ - due to rendering bug(s) in FF1.0
        var toc = document.createElement(window.opera||showHide?'tocdiv':'div');
        toc.id = 'js-toc';
        if (showHide) {
          var hideDiv = document.createElement('div');
          hideDiv.setAttribute('class','hideBtn');
          var hideLink = document.createElement('a');
          hideLink.setAttribute("href","#");
          hideLink.addEventListener("click",function(){if(useCookie){document.getElementById('js-toc').style.display='none';document.cookie='autotoc_hide=true; path=/';return false;}else{document.getElementById('js-toc').style.display='none';}});
          hideLink.appendChild(document.createTextNode(hideBtnText));
          if ( !cssLoaded ) hideLink.style = cssHideLink;
          hideDiv.appendChild(hideLink);
          if ( !cssLoaded ) hideDiv.style = cssHideBtn;
          toc.appendChild(hideDiv);
        }
        tocSelect = document.createElement('select');
        tocSelect.addEventListener("change", function(){gotoAnchor(this)});
        tocSelect.id = 'toc-select';
        tocEmptyOption = document.createElement('option');
        tocEmptyOption.setAttribute('value','');
        tocEmptyOption.appendChild(document.createTextNode(fullTOCText));
        if ( !cssLoaded ) tocEmptyOption.style = cssOption;
        tocSelect.appendChild(tocEmptyOption);
        if ( !cssLoaded ) tocSelect.style = cssSelect;
        toc.appendChild(tocSelect);
        if ( !cssLoaded ) toc.style = cssJsToc;
        document.body.appendChild(toc);  
        for (var i=0,aH;aH=aHs[i];i++) {
          if (aH.offsetWidth) {
            op  = document.createElement("option");
            op.appendChild(document.createTextNode(gs(aH.tagName)+getInnerText(aH).substring(0,100)));
            var refID = aH.id ? aH.id : aH.tagName+'-'+(i*1+1);
            op.setAttribute("value", refID);
            if ( !cssLoaded ) op.style = cssOption;
            document.getElementById("toc-select").appendChild(op);
            aH.id = refID;
          }
        }
      }
    }
  };

  function autoTOC_toggleDisplay() {
    if (document.getElementById('js-toc')) {
      // toc-bar exists
      if (document.getElementById('js-toc').style.display == 'none') {
        document.getElementById('js-toc').style.display = 'block'; 
        if (useCookie) {document.cookie = 'autotoc_hide=; path=/';}
      }
      else {
        document.getElementById('js-toc').style.display = 'none'; 
        if (useCookie) {document.cookie = 'autotoc_hide=true; path=/';}
      };
    } else {
      // toc-bar not created yet, clear hide-cookie and run main script
      if (useCookie) {document.cookie = 'autotoc_hide=; path=/';}
      f();
    }
  }

  function flash(el,rep,delay) {
    for (var i=rep;i>0;i--) {
      window.setTimeout(function(){el.style.background="#ff7";},delay*i*2);
      window.setTimeout(function(){el.style.background=elbg;},delay*((i*2)+1));
    }
  }
  function gotoAnchor(selectEl) {
    if(selectEl) {
      el = document.getElementById(selectEl.value);
      elbg = el.style.background;
      location.href = '#' + selectEl.value;
      flash(el,5,100);
      if ( resetSelect ) { selectEl.selectedIndex = 0; }
    }
  }

  function getHTMLHeadings() {
    function acceptNode(node) {
      if (node.tagName.match(RXmatch)) { if (node.value+''!='') { return NodeFilter.FILTER_ACCEPT; } }
      return NodeFilter.FILTER_SKIP;
    }
    outArray = new Array();
    // XPath
    if (document.evaluate) {
      var nodes = document.evaluate(XPmatch, document, null, XPathResult.ANY_TYPE, null);
      var thisHeading = nodes.iterateNext();
      var j = 0;
      while (thisHeading) {
        if (thisHeading.textContent+''!='') {
          outArray[j++] = thisHeading;
        }
        thisHeading = nodes.iterateNext();
      }
    }
    // document.getElementsByTagName - slow! :)
    else {
      var els = document.getElementsByTagName("*");
      var j = 0;
      for (var i=0,el;el=els[i];i++) {
        if (el.tagName.match(RXmatch)) outArray[j++] = el;
      }
    }
    return outArray;
  }
  function gs(s){
    s = s.toLowerCase();
    var ret = "";
    for (var i=1; i<(s.substring(1)*1);i++) {
      ret = ret + "\u00a0 \u00a0 ";
    }
    return ret;
  }
  function getInnerText(el) {
    var s='';
    for (var i=0,node; node=el.childNodes[i]; i++) {
      if (node.nodeType == 1) s += getInnerText(node); 
      else if (node.nodeType == 3) s += node.nodeValue;
    }
    return s;
  }
  function getCookie(cname)
  {
    var namesep = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0, c; c=ca[i]; i++)
    {
        c = c.replace(/^\s*|\s*$/g,"");
        if (c.indexOf(namesep) == 0) {
            return c.substring(namesep.length,c.length);
        }
    }
    return null;
  }
  // main()
  if (!window.opera && addMenuItem) {
    GM.registerMenuCommand('AutoTOC: Toggle display', autoTOC_toggleDisplay);
  }
  f();
})();
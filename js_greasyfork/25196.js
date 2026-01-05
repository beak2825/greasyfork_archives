// ==UserScript==
// @name         Chrome Object Spy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Object Spy for chrome browser
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25196/Chrome%20Object%20Spy.user.js
// @updateURL https://update.greasyfork.org/scripts/25196/Chrome%20Object%20Spy.meta.js
// ==/UserScript==

(function() {
    'use strict';
     var arrayWithElements = new Array();
     document.onclick = clickListener;

function clickListener(e) {
   if(e.target.getAttribute("id")!='dont show popup')
      {
    var clickedElement;
    var clickedElement1;
    var arialabel;
    var clickedtagname;
    var attrname;
    var attrnamelen;
    var tagdetails = "";
    var itext;
    if(e === null)
    {
       var clickedElement = event.srcElement.getAttribute("id");
       clickedtagname =  event.srcElement.tagName;
    }
    else
    {
       var x = e.target.parentNode.nodeName;
       clickedElement = e.target.getAttribute("id");
       clickedElement1 = e.target.getAttribute("class");
       clickedtagname = e.target.tagName;
       var xpth = createXPathFromElement(e.target);
       arialabel = e.target.getAttribute("aria-label");
       itext =  e.target.innerText;
       if(clickedtagname !== null)
       {
           tagdetails = tagdetails+"<title>Chrome Object Spy</title><table border='1|0'><tr><th>Property</th><th>Value</th></tr><tr><td>TagName</td><td>"+clickedtagname+"</td></tr>";
        }
        if(itext !== null)
        {
           tagdetails = tagdetails+"<tr><td>innertext</td><td>"+ itext+"</td></tr>";
         }
        if(xpth !== null)
           {
              tagdetails = tagdetails+"<tr><td>Xpath</td><td>"+ xpth+"</td></tr>";
           }
         for(var i = 0;i<e.target.attributes.length;i++)
         {
            attrnamelen = e.target.attributes[i].name.length;
            attrname =  e.target.attributes[i].name;
            var attr1 = e.target.attributes[i].name;
            while(attrnamelen<25)
                {
                    attr1 = attr1+ " ";
                    attrnamelen = attr1.length;
                 }
             attr1 = attr1;
               tagdetails = tagdetails +"<tr><td>"+attr1 +"</td><td>"+ e.target.attributes[i].value+"</td></tr>";
          }
        var a = document.createElement("a");
        var dt = 'data:text/html,'+tagdetails;
        a.id = 'dont show popup';
        a.addEventListener("click", function(){window.open(dt, 'newwindow', 'width=300, height=250'); return false;});
        document.getElementsByTagName('body')[0].appendChild(a);
        a.click();
     }
   }
}
function createXPathFromElement(elm) {
    var allNodes = document.getElementsByTagName('*');
    for (var segs = []; elm && elm.nodeType == 1; elm = elm.parentNode)
    {
       if (elm.hasAttribute('aria-labelledby')) {
            segs.unshift(".//"+elm.tagName.toLowerCase()+"[@aria-labelledby='" + elm.getAttribute('aria-labelledby') + "']<br>");
            break;
       }
       else if(elm.hasAttribute('aria-label')) {
          var uniqueIdCount = 0;
                for (var n=0;n < allNodes.length;n++) {
                    if (allNodes[n].hasAttribute('aria-label') && allNodes[n].id == elm.id) uniqueIdCount++;
                    if (uniqueIdCount > 1) break;
                }
                if ( uniqueIdCount == 1) {
                    segs.unshift(".//"+elm.tagName.toLowerCase()+"[@aria-label='" + elm.getAttribute('aria-label') + "']<br>");
                    return segs;
                } else {
                    segs.unshift(".//"+elm.tagName.toLowerCase()+"[@aria-label='" + elm.getAttribute('aria-label') + "']<br>");
                }
                break;
          //segs.unshift(elm.localName.toLowerCase() + ".//"+elm.tagName+"[@aria-label='" + elm.getAttribute('aria-label') + "']");
       }
       else if (elm.hasAttribute('id')) {
             var uniqueIdCount = 0; 
                for (var n=0;n < allNodes.length;n++) {
                    if (allNodes[n].hasAttribute('id') && allNodes[n].id == elm.id) uniqueIdCount++;
                    if (uniqueIdCount > 1) break;
                }
                if ( uniqueIdCount == 1) { 
                    segs.unshift(".//"+elm.tagName.toLowerCase()+"[@id='" + elm.getAttribute('id') + "']<br>"); 
                    return segs; 
                } else { 
                    segs.unshift(".//"+elm.tagName.toLowerCase()+"[@id='" + elm.getAttribute('id') + "']<br>"); 
                } 
         break;
        } else if (elm.hasAttribute('class')) { 
            segs.unshift(".//"+elm.tagName.toLowerCase()+"[@class='" + elm.getAttribute('class') + "']<br>"); 
           break;
        } else { 
            for (i = 1, sib = elm.previousSibling; sib; sib = sib.previousSibling) { 
                if (sib.localName == elm.localName)  i++; }
                segs.unshift(elm.localName.toLowerCase() + '[' + i + ']'); 
        } 
    }
    return segs.length ? '' + segs : null; 
}

function lookupElementByXPath(path) { 
    var evaluator = new XPathEvaluator(); 
    var result = evaluator.evaluate(path, document.documentElement, null,XPathResult.FIRST_ORDERED_NODE_TYPE, null); 
    return  result.singleNodeValue; 
} 
})();
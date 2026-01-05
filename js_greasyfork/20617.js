// ==UserScript==
// @name           Indeed.com: Highlight non-sponsored jobs
// @namespace      localhost
// @description    This script just highlights sponsored and non-sponsored jobs by different colors for better visualization.

// @include        *.indeed.com/*
// @include        *.indeed.co.uk/*
// @include        *.indeed.*/*
// @run-at         document-end

// @author         lukie80
// @copyright      Creative Commons Attribution-ShareAlike 3.0 Unported (CC-BY-SA 3.0)
// @license        http://creativecommons.org/licenses/by-sa/3.0/
// @version        1.5
// @lastupdated    2016.06.15
// 
// @downloadURL https://update.greasyfork.org/scripts/20617/Indeedcom%3A%20Highlight%20non-sponsored%20jobs.user.js
// @updateURL https://update.greasyfork.org/scripts/20617/Indeedcom%3A%20Highlight%20non-sponsored%20jobs.meta.js
// ==/UserScript==
//-------------------------------------------------------------------------------------------------------------------

//source: http://stackoverflow.com/a/9496574 - not needed for script, just here for educational purposes
function getAllElementsWithAttribute(attribute)
{
  var matchingElements = [];
  var allElements = document.getElementsByTagName('*');
  for (var i = 0, n = allElements.length; i < n; i++)
  {
    if (allElements[i].getAttribute(attribute) !== null)
    {
      // Element exists with attribute. Add to array.
      matchingElements.push(allElements[i]);
    }
  }
  return matchingElements;
}

//source: http://stackoverflow.com/a/4275177 - needed
function getElementsStartsWithId( id ) {
  var children = document.body.getElementsByTagName('*');
  var elements = [], child;
  for (var i = 0, length = children.length; i < length; i++) {
    child = children[i];
    if (child.id.substr(0, id.length) == id)
      elements.push(child);
  }
  return elements;
}

var goodDivs = getElementsStartsWithId("p_");
for (var i = 0; i < goodDivs.length; i++){
  goodDivs[i].style.background = '#F8F8F8';
}

if (getElementsStartsWithId("pj_")[0]){
  var badDivs = getElementsStartsWithId("pj_");
  for (var i = 0; i < badDivs.length; i++){
    badDivs[i].style.background = '#fdf9fd';
    badDivs[i].style.border = 'thin solid #f7e6f7';
    badDivs[i].style.margin = "-1px -1px -1px -1px";
    //badDivs[i].remove(); 
    //this can remove the sponsored jobs but this is not suggested 
    //because they are not spam. However they are 
    //quantitative spam.
  }
}

// create link company job search
if (document.getElementsByClassName("company")){
  var companyEles = document.getElementsByClassName("company");
  for (var i = 0; i < companyEles.length; i++){
     	   	var companyLinkEle = document.createElement('a');
    		companyLinkEle.href = "http:\/\/"+window.location.href.match(/[\w.]*indeed[\w.]+/)+"\/jobs?q=company:\""+encodeURI(companyEles[i].textContent.replace(/^\s*/, ''))+"\"&amp;l=";
    		companyLinkEle.innerHTML = companyEles[i].textContent;
    		companyLinkEle.setAttribute("target", "_blank");
            companyEles[i].textContent="";
    		companyEles[i].appendChild(companyLinkEle);
  }
}

//-------------------------------------------------------------------------------------------------------------------
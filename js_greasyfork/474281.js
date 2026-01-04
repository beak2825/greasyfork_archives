// ==UserScript==
// @name       Google Podcasts - Remove completed episodes
// @name:de    Google Podcasts – Abgeschlossene Episoden entfernen
// @description	Remove completed podcast episodes from google podcasts
// @description:de	Entfernen von abgeschlossenen Podcast-Episoden aus Google Podcasts
// @namespace	Grizzly86
// @version		1.0.1
// @author		Grizzly86
// @icon		https://ssl.gstatic.com/images/branding/product/2x/podcasts_24dp.png	
// @match		*://podcasts.google.com/*
// @grant		none
// @run-at		document-idle
// @downloadURL https://update.greasyfork.org/scripts/474281/Google%20Podcasts%20-%20Remove%20completed%20episodes.user.js
// @updateURL https://update.greasyfork.org/scripts/474281/Google%20Podcasts%20-%20Remove%20completed%20episodes.meta.js
// ==/UserScript==

console.log('Google Podcasts - Remove completed episodes');
removeCompletedEpisodes(); 

var callback = function(mutationsList) 
{
  for (var mutation of mutationsList) 
  {
    if (mutation.type == 'childList') 
      removeCompletedEpisodes();
  }
};
 
var config = 
{
  attributes: true,
  childList: true,
  subtree: true
};

var observer = new MutationObserver(callback);
observer.observe(document.body, config);
  
function removeCompletedEpisodes()
{
  document.querySelectorAll('[role="listitem"]').forEach(function (el)
  {
  	var element = getElementByXpath(el,'./descendant::span[normalize-space(.)="Completed"]');

    if (element != null) // Remove Completed
    {
      el.nextSibling.remove();
      el.remove();
    }    
  });
}
  
function getElementByXpath(node,path) {
  return document.evaluate(path, node, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
// ==UserScript==
// @name        Redirect Removed Steam ID to steamdb
// @namespace   https://greasyfork.org/en/users/2205
// @description Redirects links to removed AppID's on steampowered.com to steamdb.info
// @description:en Redirects links to removed AppID's on steampowered.com to steamdb.info
// @license     Apache-2.0
// @author      Rudokhvist
// @locale      en-US
// @include     *
// @version     1.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27887/Redirect%20Removed%20Steam%20ID%20to%20steamdb.user.js
// @updateURL https://update.greasyfork.org/scripts/27887/Redirect%20Removed%20Steam%20ID%20to%20steamdb.meta.js
// ==/UserScript==
    function addanchors(element) {
        try {
            var links = element.getElementsByTagName('a');
            for (var i=links.length-1; i>=0; i--) {
                if (links[i].hasAttribute("href")) {
                    if (links[i].getAttribute("href").includes("steampowered")) {
                        if (!links[i].getAttribute("href").includes("#")){
                            links[i].setAttribute("href",links[i].getAttribute("href").replace(/(http.{0,1}:\/\/store\.steampowered\.com\/)([^\/]*)\/(\d+)(.*)/,"$1$2\/$3$4#$2$3"));
                        }
                    }
                }
            }
            return null;
        } catch (e) {
            console.log("Redirect Removed Steam ID to steamdb error");
            return null;
        }
    }

+function () {
  var res;
  if (res=window.location.href.match(/http.{0,1}:\/\/store\.steampowered\.com\/#(\D+)(\d+)/)) {
    window.location = "https:\/\/steamdb.info\/"+res[1]+"\/"+res[2];
  } else if (res=window.location.href.match(/(http.{0,1}:\/\/store\.steampowered\.com\/.+)#(\D+)(\d+)/)){
    window.history.replaceState(null, null, res[1]);
  }
  addanchors(document);
  var mutationObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
          mutation.addedNodes.forEach( function(currentValue, currentIndex, listObj) {
              if (currentValue.nodeType == Node.ELEMENT_NODE) {
                  addanchors(currentValue);
              }
          });
      });
  });
  mutationObserver.observe(document.documentElement, {
      childList: true,
      subtree: true
  });
}();
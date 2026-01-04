// ==UserScript==
// @name         SFDC Entitlement
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Alert when entitlement or search location is done
// @author       Emanuel Farinha
// @match        https://hp--c.visualforce.com/apex/GSDCSCEntitlementlightningPage
// @match        https://hp--c.visualforce.com/apex/GSDCSCEntitlementlightningPage?*
// @match        https://hp--c.visualforce.com/apex/gsdcscaccountlocationsearch
// @match        https://hp--c.visualforce.com/apex/gsdcscaccountlocationsearch?*
// @icon         https://www.google.com/s2/favicons?domain=visualforce.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441727/SFDC%20Entitlement.user.js
// @updateURL https://update.greasyfork.org/scripts/441727/SFDC%20Entitlement.meta.js
// ==/UserScript==

var source = document.getElementsByTagName("html")[0].innerHTML;

var found = source.indexOf("closeAndopenTabs('false','false','false')");

if (found > 0) {
  window.A4J.AJAX.finishRequest = function (request) {
    var options = request.options;
    if (!request._oncomplete_aborted) {
      var oncomp;
      try {
        oncomp = request.getElementById("org.ajax4jsf.oncomplete");
      } catch (e) {
        LOG.warn("Error reading oncomplete from request " + e.message);
      }
      if (oncomp) {
        LOG.debug("Call request oncomplete function after processing updates");
        window.setTimeout(function () {
          A4J.AJAX.invokeAjaxRequestPreOncomplete(request);
          var event = request.domEvt,
            data;
          try {
            data = request.getJSON("_ajax:data");
          } catch (e) {
            LOG.warn("Error reading data from request " + e.message);
          }
          try {
            var target = null;
            if (event) {
              target = event.target ? event.target : event.srcElement;
            }
            var newscript = Sarissa.getText(oncomp, true);
            var oncomplete = new Function(
              "request",
              "event",
              "data",
              newscript
            );
            oncomplete.call(target, request, event, data);
            if (options.queueoncomplete) {
              options.queueoncomplete.call(target, request, event, data);
            }
          } catch (e) {
            LOG.error("Error evaluate oncomplete function " + e.Message);
            if (LOG.throwExs) {
              throw e;
            }
          }
          A4J.AJAX.status(request.containerId, options.status, false);
        }, 0);
        setTimeout(() => {
          console.log("close");
          document.body.innerHTML =
            '<h1 style="font-size:30px">The Entitlement is done, you can close the window</h1>';
        }, 2000);
      } else if (options.oncomplete || options.queueoncomplete) {
        LOG.debug("Call local oncomplete function after processing updates");
        window.setTimeout(function () {
          A4J.AJAX.invokeAjaxRequestPreOncomplete(request);
          var event = request.domEvt,
            data;
          try {
            data = request.getJSON("_ajax:data");
          } catch (e) {
            LOG.warn("Error reading data from request " + e.message);
          }
          if (options.oncomplete) {
            options.oncomplete(request, event, data);
          }
          if (options.queueoncomplete) {
            options.queueoncomplete(request, event, data);
          }
          A4J.AJAX.status(request.containerId, options.status, false);
        }, 0);
      } else {
        LOG.debug(
          "Processing updates finished, no oncomplete function to call"
        );
        setTimeout(function () {
          A4J.AJAX.invokeAjaxRequestPreOncomplete(request);
          A4J.AJAX.status(request.containerId, options.status, false);
        }, 0);
      }
    } else {
      LOG.debug("Aborted request, won't call oncomplete at all");
      setTimeout(function () {
        A4J.AJAX.status(request.containerId, options.status, false);
      }, 0);
    }
    A4J.AJAX.popQueue(request);
  };
}

window.issearchlocationbutton = false;

document.onclick = inputChange;

function inputChange(e) {
  if (
    document.getElementById(
      "PageID:FormId:searchsection:searchresultsection:detailpageclock:createSubscriptionCase"
    )
  ) {
    window.issearchlocationbutton = true;
  }
}

if (document.querySelector(".mainTitle").innerHTML == "Search Location") {
  window.A4J.AJAX.finishRequest = function (request) {
    var options = request.options;
    if (!request._oncomplete_aborted) {
      var oncomp;
      try {
        oncomp = request.getElementById("org.ajax4jsf.oncomplete");
      } catch (e) {
        LOG.warn("Error reading oncomplete from request " + e.message);
      }
      if (oncomp) {
        LOG.debug("Call request oncomplete function after processing updates");
        window.setTimeout(function () {
          A4J.AJAX.invokeAjaxRequestPreOncomplete(request);
          var event = request.domEvt,
            data;
          try {
            data = request.getJSON("_ajax:data");
          } catch (e) {
            LOG.warn("Error reading data from request " + e.message);
          }
          try {
            var target = null;
            if (event) {
              target = event.target ? event.target : event.srcElement;
            }
            var newscript = Sarissa.getText(oncomp, true);
            var oncomplete = new Function(
              "request",
              "event",
              "data",
              newscript
            );
            oncomplete.call(target, request, event, data);
            if (options.queueoncomplete) {
              options.queueoncomplete.call(target, request, event, data);
            }
          } catch (e) {
            LOG.error("Error evaluate oncomplete function " + e.Message);
            if (LOG.throwExs) {
              throw e;
            }
          }
          A4J.AJAX.status(request.containerId, options.status, false);
        }, 0);
        if (window.issearchlocationbutton) {
          setTimeout(() => {
            console.log("close");
            document.body.innerHTML =
              '<h1 style="font-size:30px">The Search Location is done, you can close the window</h1>';
          }, 2000);
        }
      } else if (options.oncomplete || options.queueoncomplete) {
        LOG.debug("Call local oncomplete function after processing updates");
        window.setTimeout(function () {
          A4J.AJAX.invokeAjaxRequestPreOncomplete(request);
          var event = request.domEvt,
            data;
          try {
            data = request.getJSON("_ajax:data");
          } catch (e) {
            LOG.warn("Error reading data from request " + e.message);
          }
          if (options.oncomplete) {
            options.oncomplete(request, event, data);
          }
          if (options.queueoncomplete) {
            options.queueoncomplete(request, event, data);
          }
          A4J.AJAX.status(request.containerId, options.status, false);
        }, 0);
      } else {
        LOG.debug(
          "Processing updates finished, no oncomplete function to call"
        );
        setTimeout(function () {
          A4J.AJAX.invokeAjaxRequestPreOncomplete(request);
          A4J.AJAX.status(request.containerId, options.status, false);
        }, 0);
      }
    } else {
      LOG.debug("Aborted request, won't call oncomplete at all");
      setTimeout(function () {
        A4J.AJAX.status(request.containerId, options.status, false);
      }, 0);
    }
    A4J.AJAX.popQueue(request);
  };
}

// ==UserScript==
// @name         document.load client injection
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  The Avocent PM1000/2000/3000 PDU runs an old JavaScript interface that relies on the XMLDocument.fetch() function that has been removed. Emulate this.
// @description  inject the document.load implementation into real page context.
// @author       Andreas Thienemann <andreas@bawue.net>, based on a script from jnd@chromium.org, based on idea from gurreiro_fabio@yahoo.com.br
// @match http://172.16.10.64/*
// @match http://172.16.10.65/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/429691/documentload%20client%20injection.user.js
// @updateURL https://update.greasyfork.org/scripts/429691/documentload%20client%20injection.meta.js
// ==/UserScript==

var script_payload = `
// This script is for document.load client implementation
// The basic idea is that we write a load method for document object since
// WebKit based browser do not provide the document.load support.
// Author: jnd@chromium.org,  based on idea from gurreiro_fabio@yahoo.com.br
// See crbug.com/988 for more details.

// window.chromeCompatUtils is the namespace of all utilities for
// Chrome compatibility
if (!window.chromeCompatUtils)
  window.chromeCompatUtils = { };

chromeCompatUtils.UserMethodObject = function(targetObject,
                                              userMethodName,
                                              userMethod) {
  this.userMethodName_ = userMethodName;
  // This target object in which the user method will be installed.
  this.installTargetObject_ = targetObject;
  this.userMethod_ = userMethod;
  this.oldMethod_ = null;
}

chromeCompatUtils.UserMethodObject.prototype.install = function() {
  this.oldMethod_ = this.installTargetObject_[this.userMethodName_];
  this.installTargetObject_[this.userMethodName_] = this.userMethod_;
}

chromeCompatUtils.UserMethodObject.prototype.uninstall = function() {
  this.installTargetObject_[this.userMethodName_] = this.oldMethod_;
}

var loadMethod = new chromeCompatUtils.UserMethodObject(
    window.Document.prototype,
    "load",
    function(url) {
  var xhr = new window.XMLHttpRequest();
  var currentLoadDoc = this;
  var loadMethodEvents = { };

  function processEvents(obj, events, isInstall) {
    for (var eventName in events) {
      if (isInstall)
        obj.addEventListener(eventName, events[eventName], false);
      else
        obj.removeEventListener(eventName, events[eventName], false);
    }
  }

  var internalOnLoad = function(isSync){
    if (xhr && xhr.responseXML) {
      var xhrDoc = xhr.responseXML;
      // Copy and append new dom tree into current document.
      var clonedNode = xhrDoc.documentElement.cloneNode(true);
      var rootElement = currentLoadDoc.documentElement ?
                        currentLoadDoc.documentElement : currentLoadDoc;
      rootElement.appendChild(clonedNode, true);
      currentLoadDoc.parseError = false;
    } else {
      currentLoadDoc.parseError = true;
    }
    if (!isSync) {
      processEvents(xhr, loadMethodEvents, false);
      // Call document.onload if it exists.
      if (currentLoadDoc.onload && typeof currentLoadDoc.onload == "function")
        currentLoadDoc.onload();
    }
  };

  var internalOnError = function(isSync) {
    currentLoadDoc.parseError = true;
    if (!isSync) {
      processEvents(xhr, loadMethodEvents, false);
      // Call document.onerror if it exists.
      if (currentLoadDoc.onerror &&
          typeof currentLoadDoc.onerror == "function")
        currentLoadDoc.onerror();
    }
  };

  loadMethodEvents["load"] = internalOnLoad;
  loadMethodEvents["error"] = internalOnError;

  try {
    this.async = !!this.async;
    if (this.async)
      processEvents(xhr, loadMethodEvents, true);
    xhr.open("GET", url, this.async);
    xhr.send(null);
    // For synchronous call, directly call internalOnLoad.
    if (this.async)
      this.parseError = false;
    else
      internalOnLoad(true);
  } catch (e) {
    internalOnError(!this.async);
  }
  return !this.parseError;
});

loadMethod.install();
`;

// At first, we need to get head tag, then we will inject the script under
// head tag.
(function() {
  var injected_ = false;
  function InjectDocLoad(head) {
    if (injected_)
      return;
    injected_ = true;
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.charset = "utf-8";
//    script.src = "http://repository.sys.bawue.net/tt/doc_load_impl.js";
    script.appendChild(document.createTextNode(script_payload));
    head.appendChild(script);
  }

  function GetHeadTag() {
   var head = null;
    try {
      head = document.getElementsByTagName('head')[0];
    } catch (e) {
      head = null;
    }
    return head;
  }

  function headInsertedChecker() {
    var head = GetHeadTag();
    if (head) {
      InjectDocLoad(head);
      document.documentElement.removeEventListener("DOMNodeInserted",
                                                   headInsertedChecker,
                                                   false);
    }
  }

  if (!document.documentElement) {
    // should not happen.
    return;
  }
  var head = GetHeadTag();
  if (!head) {
     document.documentElement.addEventListener("DOMNodeInserted",
                                               headInsertedChecker,
                                               false);
  } else {
    InjectDocLoad(head);
  }
})();
// ==UserScript==
// @name         Loose Content Injector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.tampermonkey.net/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();function LooseContentInjector(injectorName, injectionInterval_ms, completionCallback) {
    //region Content Item Object
    function ContentItem(name, required, priority, failureLimit) {

      var instance = this;

      this.failureLimit = failureLimit || 250;
      this.required = required || false;
      this.priority = priority || 5;

      this.name = name || undefined;
      this.inject = null;
      this.callback = null;
      this.canInject = null;
      this.isInjected = null;

      this.failures = 0;
      this.lastError = null;

      this.sendCallback = function(){
          if (typeof instance.callback === "function") {
              instance.callback(instance);
            }
      };
      this.isFailed = function() {
        return instance.failures >= instance.failureLimit;
      };
      this.canInject = function() {
        try {
          return instance.canInject();
        } catch (e) {
          instance.lastError = e;
          return false;
        }
      };
      this.isCompleted = function() {
        return instance.isFailed() || instance.isInjected();
      };
      this.reset = function() {
        instance.failures = 0;
        instance.failureLimit = failureLimit;
        instance.lastError = null;
      };
    }
    this.CreateContentItem = function(
      name,
      required,
      priority,
      failureLimit
    ) {
      return new ContentItem(name, required, priority, failureLimit);
    };
    //endregion

    //region Members
    var instance = this;
    var _contentItems = [];
    var _completionCallback = completionCallback;

    var canceled = false;
    var errorMessage = null;

    var currentPriority = 10;
    //endregion

    //region Public Methods
    this.inject = function(callback) {
      _completionCallback = completionCallback;
      console.log("LCI [" + injectorName + "]: Injecting...");
      injectLoop();
    };
    this.cancelInjection = function() {
      canceled = true;
    };
    this.hasError = function() {
      return errorMessage !== null;
    };
    this.getLastError = function() {
      return errorMessage;
    };

    this.addContentItem = function(contentItem) {
      _contentItems.push(contentItem);
    };
    this.removeContentItem = function(contentItem) {
      var index;
      if ((index = _contentItems.indexOf(contentItem)) > -1) {
        _contentItems.splice(index, 1);
      }
    };
    this.isCanceled = function() {
      return canceled;
    };
    this.isComplete = function() {
      if (instance.isCanceled() || instance.hasError()) {
        return true;
      }
      for (var i = 0; i < _contentItems.length; i++) {
        if (!_contentItems[i].isCompleted()) {
          return false;
        }
      }
      return true;
    };
    this.reset = function() {
      for (var i = 0; i < _contentItems.length; i++) {
        _contentItems[i].reset();
      }
    };
    //endregion

    //region Private Methods
    function sendCompletionCallback(success) {
      if (typeof _completionCallback === "function") {
        _completionCallback(success);
      }
    }

    function sendCompleted() {
      var loadedCount = 0;
      for (var i = 0; i < _contentItems.length; i++) {
        if (_contentItems[i].isInjected()) {
          loadedCount++;
        }
      }
      if (instance.errorMessage !== null || canceled) {
          sendCompletionCallback(false);
      }
      else{
          sendCompletionCallback(true);
      }
      console.log("LCI [" + injectorName + "]: Injected. (" + loadedCount + "/" + _contentItems.length + ")");
    }

    function injectLoop() {

      var currentPriorityItems = _contentItems.filter(item => item.priority === currentPriority && !item.isCompleted());
      while(currentPriority > 0 && currentPriorityItems.length === 0){
          currentPriority--;
          if(currentPriority < 0){
              sendCompleted();
              return;
          }
          currentPriorityItems = _contentItems.filter(item => item.priority === currentPriority && !item.isCompleted());
      }

      for (var index = 0; index < currentPriorityItems.length; index++) {

        var contentItem = currentPriorityItems[index];
        var preText = "LCI [" + injectorName + "][" + contentItem.name + "]: ";
        try {
          if (contentItem.canInject()) {
              contentItem.inject();
              if (!contentItem.isInjected()) {
                  contentItem.failures++;
                  contentItem.lastError = "Injection check failed";
              }
          }
          else {
              contentItem.failures++;
              contentItem.lastError = "Injection conditions not met";
          }
      } catch (e) {
          contentItem.failures++;
          contentItem.lastError = "Injection error: " + e.errorMessage;
      }

      if (contentItem.isCompleted()) {
          contentItem.sendCallback();
          if (contentItem.isFailed()) {
              console.log(preText + "Injection failed. (" + contentItem.lastError + ")");
              if (contentItem.required) {
                  instance.errorMessage = "A Required injection failed. [" + contentItem.name + "]";
                  sendCompleted();
                  return;
              }
          }
          else {
            console.log(preText + "Injection success. ");
          }
        }
      }
      if (instance.isComplete()) {
        sendCompleted();
      } else {
        setTimeout(injectLoop, injectionInterval_ms);
      }
    }
    //endregion
  }
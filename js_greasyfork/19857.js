/**
 * https://github.com/soufianesakhi/node-creation-observer-js
 * MIT licensed
 * Copyright (c) 2016 Soufiane Sakhi
 */
var NodeCreationObserver = function () {
    var mutationObserver = null;
    var observedNodeAttribute = "observed";
    var listeners = {};
    var options = {
        childList: true,
        subtree: true
    };
    var ListenerContext = (function () {
        function ListenerContext(removeOnFirstMatch) {
            this.callbacks = [];
            this.removeOnFirstMatch = removeOnFirstMatch == undefined ? false : removeOnFirstMatch;
        }
        return ListenerContext;
    }());
    function onMutationCallback() {
        Object.keys(listeners).forEach(function (selector) {
            invokeCallbacks(selector);
        });
    }
    function invokeCallbacks(selector) {
        var callbacks = listeners[selector].callbacks;
        var elements = document.querySelectorAll(selector);
        var newElements = filterNewElements(elements);
        if (newElements.length > 0) {
            if (listeners[selector].removeOnFirstMatch) {
                removeListener(selector);
            }
            newElements.forEach(function (element) {
                callbacks.forEach(function (callback) {
                    callback.call(element, element);
                });
            });
        }
    }
    function filterNewElements(elements) {
        var newElements = [];
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            var attr = element.getAttribute(observedNodeAttribute);
            if (attr == null) {
                element.setAttribute(observedNodeAttribute, "1");
                newElements.push(element);
            }
        }
        ;
        return newElements;
    }
    function observe() {
        if (mutationObserver == null) {
            mutationObserver = new MutationObserver(onMutationCallback);
            mutationObserver.observe(document.documentElement, options);
        }
    }
    function removeListener(selector) {
        delete listeners[selector];
        if (Object.keys(listeners).length == 0) {
            stopObserving();
        }
    }
    function stopObserving() {
        if (mutationObserver != null) {
            mutationObserver.disconnect();
            mutationObserver = null;
        }
    }
    return {
        init: function (customObservedNodeAttribute) {
            observedNodeAttribute = customObservedNodeAttribute;
        },
        onCreation: function (selector, callback, removeOnFirstMatch) {
            if (!listeners[selector]) {
                listeners[selector] = new ListenerContext(removeOnFirstMatch);
            }
            listeners[selector].callbacks.push(callback);
            observe();
            if (document.querySelector(selector) != null) {
                invokeCallbacks(selector);
            }
        },
        remove: removeListener,
        stop: function () {
            listeners = {};
            stopObserving();
        }
    };
}();

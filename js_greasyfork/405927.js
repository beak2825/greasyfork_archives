// ==UserScript==
// ==UserLibrary==
// @name         UtilLibrary
// @namespace    sami@kankaristo.fi
// @version      0.7.4
// @description  Util function library
// @author       sami@kankaristo.fi
// @license      MIT
// @exclude      *
// @match        *://*/*
// @grant        GM_openInTab
// ==/UserLibrary==
// ==/UserScript==


//
// NOTE: To make this work in TamperMonkey, also install:
// https://greasyfork.org/en/scripts/433051-trusted-types-helper
//

// LIBRARY: START
const Util = (() => {
var exports = {};


exports.LOGGING_ID = "";

exports.LOGGING_LEVELS = [
    "DEBUG",
    "INFO",
    "NOTE",
    "WARN",
    "ERROR"
];

exports.MINIMUM_LOGGING_LEVEL = exports.LOGGING_LEVELS.findIndex(
    (element) => (element == "NOTE")
);

exports.SetMinimumLoggingLevel = (minimumLevel) => {
    exports.MINIMUM_LOGGING_LEVEL = exports.LOGGING_LEVELS.findIndex(
        (element) => (element == minimumLevel)
    );
};

exports.LOG_MESSAGES_WITHOUT_LOGGING_LEVEL = true;


///
/// Log a message.
///
exports.Log = (...args) => {
    var loggingLevelIndex = exports.LOGGING_LEVELS.findIndex(
        (element) => (element == args[0])
    );
    
    if (loggingLevelIndex != -1) {
        if (loggingLevelIndex < exports.MINIMUM_LOGGING_LEVEL) {
            return;
        }
        
        //args = args.slice(1);
    }
    else if (!exports.LOG_MESSAGES_WITHOUT_LOGGING_LEVEL) {
        // Don't log messages without a logging level
        return;
    }
    
    console.log.apply(
        null,
        [
            (new Date()).toISOString()
            + " " + exports.LOGGING_ID + ":\n"
        ].concat(args)
    );
};


///
/// Log a message (warn).
///
exports.Warn = (...args) => {
    var loggingLevelIndex = exports.LOGGING_LEVELS.findIndex(
        (element) => (element == args[0])
    );
    
    if (loggingLevelIndex != -1) {
        if (loggingLevelIndex < exports.MINIMUM_LOGGING_LEVEL) {
            return;
        }
        
        //args = args.slice(1);
    }
    else if (!exports.LOG_MESSAGES_WITHOUT_LOGGING_LEVEL) {
        // Don't log messages without a logging level
        return;
    }
    
    console.warn.apply(
        null,
        [
            (new Date()).toISOString()
            + " " + exports.LOGGING_ID + ":\n"
        ].concat(args)
    );
};


///
/// Log a message (error).
///
exports.Error = (...args) => {
    var loggingLevelIndex = exports.LOGGING_LEVELS.findIndex(
        (element) => (element == args[0])
    );
    
    if (loggingLevelIndex != -1) {
        if (loggingLevelIndex < exports.MINIMUM_LOGGING_LEVEL) {
            return;
        }
        
        //args = args.slice(1);
    }
    else if (!exports.LOG_MESSAGES_WITHOUT_LOGGING_LEVEL) {
        // Don't log messages without a logging level
        return;
    }
    
    console.error.apply(
        null,
        [
            (new Date()).toISOString()
            + " " + exports.LOGGING_ID + ":\n"
        ].concat(args)
    );
};


///
/// Create a click event.
///
/// NOTE: initEvent() is deprecated, so this will stop working at some point.
///
exports.CreateClickEvent = () => {
    var clickEvent = document.createEvent("Events");
    clickEvent.initEvent("click", true, false);
    
    return clickEvent;
};


///
/// Create a CSS element.
///
exports.CreateCssElement = (css) => {
    exports.Log("CreateCssElement()");
    
    var style = document.createElement("style");
    style.classList.add("custom-css");
    style.innerHTML = css;
    var body = document.getElementsByTagName("body")[0];
    if (body != null) {
        body.append(style);
    }
};


///
/// Get the value of an attibute, or return a default value.
///
exports.GetAttributeValue = (elem, attributeName, defaultValue = null) => {
    var attribute = elem.attributes[attributeName];
    
    if (attribute == null) {
        return defaultValue;
    }
    
    return attribute.value;
};


///
/// Recurse parent elements until one with the given class is found.
///
exports.GetParentWithClass = (element, className) => {
    while (element != null) {
        if (element.classList.contains(className)) {
            return element;
        }
        
        element = element.parentElement;
    }
    
    return null;
};


///
/// Listen for mouse movements and save mouse position.
///
exports.mousePosition = {
    "x": 0,
    "y": 0
};
document.addEventListener(
    "mousemove",
    (event) => {
        exports.mousePosition.x = event.clientX;
        exports.mousePosition.y = event.clientY;
    },
    true
);


///
/// Get the element currently under the mouse.
///
exports.GetElementUnderMouse = () => {
    var hoverElement = document.elementFromPoint(
        Util.mousePosition.x,
        Util.mousePosition.y
    );
    
    return hoverElement;
};


///
/// Get the element currently under the mouse.
///
exports.InIframe = () => {
    try {
        return (window.self !== window.top);
    }
    catch (e) {
        return true;
    }
};


exports.URL_OPEN_LIMIT = 1000;
var _urlsOpened = 0;

///
/// Open a window with a given URL and delay (timeout).
///
exports.OpenUrl = (url, openInBackground) => {
    if (!openInBackground) {
        openInBackground = false;
    }
    
    exports.Log(_urlsOpened, exports.URL_OPEN_LIMIT);
    if (_urlsOpened >= exports.URL_OPEN_LIMIT) {
        return false;
    }
    
    exports.Log("OpenUrl(" + url + ")");
    ++_urlsOpened;
    /*/
    setTimeout(
        function () {
            window.open(url);
        },
        10 * _urlsOpened
    );
    /*/
    GM_openInTab(url, openInBackground);
    //*/
    
    return true;
};


///
/// Reset the opened URL counter.
///
exports.ResetOpenedUrlCounter = () => {
    _urlsOpened = 0;
};


///
/// Parse float from a string (any numeric value from a string).
///
exports.ParseFloatFromString = (string) => {
    var regex = /[+-]?\d+([.,]\d+)?/g;
    
    var matches = string.match(regex);
    
    if (matches == null) {
        return 0.0;
    }
    
    var floats = matches.map(
        function(v) {
            return parseFloat(v.replace(",", "."));
        }
    );
    
    return ((floats.length != 0) ? floats[0] : 0.0);
};


///
/// Query a selector until it isn't null.
///
exports.WaitForSelector = (selector, maxWaitTime) => {
    var querySelector = null;
    querySelector = (resolve, maxWait, startTime) => {
        startTime = startTime || (new Date()).getMilliseconds();
        var currentTime = (new Date()).getMilliseconds();
        
        //exports.Log("WaitForSelector.querySelector()", startTime, startTime + maxWait, currentTime);
        
        if (currentTime >= (startTime + maxWait)) {
            resolve(null);
            
            return;
        }
        
        var element = document.querySelector(selector);
        
        if (element == null) {
            // Element not found, try again next frame
            setTimeout(
                () => querySelector(resolve, maxWait, startTime),
                0
            );
            
            return;
        }
        
        // Element found, resolve
        resolve(element);
    };
    
    maxWaitTime = maxWaitTime || 500;
    
    return new Promise(
        (resolve) => querySelector(resolve, maxWaitTime)
    );
};


// LIBRARY: END
return exports;
})();

// ==UserScript==
// @name         App info
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  The script is used to extract app info to display it on the page
// @author       You
// @match        https://*.staples.com
// @match        https://*.staplesadvantage.com
// @match        https://*.staples.com/*
// @match        https://*.staplesadvantage.com/*
// @exclude      https://*staples.com/staplesui/*
// @exclude      https://*.staples.com/CSRToolsApp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=staples.com
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/476191/App%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/476191/App%20info.meta.js
// ==/UserScript==

const css = `
       .appInfo__container {
         background-color: #f3f3f3;
         position: fixed;
         color: hsl(51, 68.7%, 18.9%);
         top: 10px;
         right: 0;
         z-index: 9999999;
         padding: 10px 10px 10px 0;
         white-space: nowrap;
         transition: max-width 0.25s;
         padding-right: inherit;
         border-radius: 100px 0 0 100px;
         box-shadow: 0 4px 6px hsla(0, 0%, 0%, 0.2);
       }

       .appInfo__container:has(> span.appInfo__collapse) {
           max-width: 30px;
       }

       .appInfo__container:has(> span.appInfo__expand) {
           max-width: 320px;
       }

       .appInfo__version {
         pading-left: 10px;
       }

       .appInfo__expand, .appInfo__collapse {
         font-size: 16px;
         background-color: #f3f3f3;
         padding: 10px;
         font-family: Motiva-Extra-Bold,Helvetica,Arial,sans-serif;
         border-radius: 100px 0 0 100px;
       }

       .appInfo__collapse::before {
           content: "<";
       }

       .appInfo__expand:hover, .appInfo__collapse:hover {
           cursor: pointer;
       }

       .appInfo__expand::before {
           content: ">";
       }
    `;

(function() {
    'use strict';
    GM_addStyle(css);
    const ajaxInterceptor = initAjaxInterceptor();

    ajaxInterceptor.addResponseCallback((xhr) => {
        const { status, responseURL } = xhr;
        let responseText = '{}';
        if ((xhr.responseType === 'text' || xhr.responseType === '') && xhr.responseText) {
            responseText = xhr?.responseText || '{}';
        }

        if (isUrlAllowed(responseURL)) {
            const appName = getAppName(window.location.pathname);
            // console.log('xhr:', xhr.responseURL);
            const data = JSON.parse(responseText);
            let appInfo = {};
            if (appName === 'ptd') {
                appInfo = data?.ptdMMx?.APP_INFO;
            } else if (appName === 'hc') {
                appInfo = data?.config?.appInfo;
            }

            if (appInfo?.version) {
                // console.log(`~~~~~~~>app-info: window.location.pathname (sl): ${window.location.pathname}`);
                const { version, env, region, isCanary } = appInfo;

                const appInfoElement = document.getElementById("appInfo");
                if (appInfoElement) {
                    updateAppInfo(appName, version, env, region, isCanary, appInfoElement);
                } else {
                    createAppInfo(appName, version, env, region, isCanary);
                }
            }
        }
    });


    window.navigation.addEventListener("navigate", (event) => {
        // console.log(`~~~~~~~>app-info: navigate event triggered`);

        const addr = new URL(event.destination.url);
        // console.log(addr.pathname);
        const appName = getAppName(addr.pathname);

        if (!appName) {
            const appInfoElement = document.getElementById("appInfoContainer");
            appInfoElement?.remove();
        }
    });

    const appName = getAppName(window.location.pathname);

    ajaxInterceptor.wire();
    if (appName) {
        //
        // Executes on the initial page load
        //
        initialize(appName);
    } else {
        return; // No app name found
    }
})();

function initialize(appName) {
    const { version, env, region, isCanary } = getAppInfo(appName) || {};
    createAppInfo(appName, version, env, region, isCanary);
}

function createAppInfo(appName, version, env, region, isCanary) {
    const expandCollapseElement = createExpandCollapseElement();
    const appInfoContent = getAppInfoContent(appName, version, env, region, isCanary)
    const appInfoElement = createAppInfoElement(appInfoContent);
    const appInfoContainer = createAppInfoContainer();
    appInfoContainer.appendChild(expandCollapseElement);
    appInfoContainer.appendChild(appInfoElement);

    const nextDiv = document.getElementById("__next");
    document.body.insertBefore(appInfoContainer, nextDiv);
}

function updateAppInfo(appName, version, env, region, isCanary, appInfoElement) {
    const appInfoContent = getAppInfoContent(appName, version, env, region, isCanary);
    appInfoElement.innerHTML = appInfoContent;
}


function getAppInfo(appName) {
    const nextData = document.getElementById("__NEXT_DATA__");
    // console.log(`~~~~~~~>app-info: window.location.pathname: ${window.location.pathname}`);
    const nextDataContent = nextData.innerHTML;
    const parsedNextDataContent = JSON.parse(nextDataContent);
    let appInfo = {};
    if (appName === 'ptd') {
        appInfo = parsedNextDataContent.props.initialStateOrStore.ptdMMx.APP_INFO;
    } else if (appName === 'hc') {
        appInfo = parsedNextDataContent.props.initialStateOrStore.helpcenter.config.appInfo;
    }

    return appInfo;
}

function getAppName(pathname) {
    let appName = '';

    if (isPTDPage(pathname)) {
        appName = 'ptd';
    } else if (isHCPage(pathname)) {
        appName = 'hc';
    }

    return appName;
}

function isPTDPage(pathname) {
    return pathname.indexOf('/ptd/') !== -1;
}

function isHCPage(pathname) {
    return pathname.indexOf('/hc') !== -1 || pathname.indexOf('/tc') !== -1;
}

function createExpandCollapseElement() {
    const newChild = document.createElement("span");
    newChild.classList.add('appInfo__expand');
    newChild.addEventListener('click', () => {
        // console.log(`~~~~~~~>app-info: clicked occured`);
        const currentClassname = newChild.classList.toString();
        if (currentClassname === 'appInfo__expand') {
            newChild.classList.remove('appInfo__expand');
            newChild.classList.add('appInfo__collapse');
        } else {
            newChild.classList.remove('appInfo__collapse');
            newChild.classList.add('appInfo__expand');
        }
    });
    return newChild;
}

function createAppInfoElement(appInfoContent) {
    const newChild = document.createElement("span");
    newChild.classList.add('appInfo__version');
    newChild.setAttribute('id', 'appInfo');
    newChild.innerHTML = appInfoContent;
    return newChild;
}

function getAppInfoContent(appName, version = 'n/a', env = 'n/a', region = '', isCanary) {
    const canaryText = isCanary ? '&nbsp; 🐤 canary' : '';
    const regionText = region ? `(${region})` : '';
    const envText = isCanary ? '' : `&nbsp; 🌐 ${env} ${regionText}`;
    return `📱 ${appName.toUpperCase()} &nbsp; 📦 ${version} ${envText} ${canaryText} &nbsp;`;
}

function createAppInfoContainer() {
    const newChild = document.createElement("div");
    newChild.classList.add('appInfo__container');
    newChild.setAttribute('id', 'appInfoContainer');
    return newChild;
}

function isUrlAllowed(url) {
    const allowedUrlPatterns = ['/sdc/ptd/api/.*/ptd/', '/hc/api/.*/hc', '/hc/api/.*/tc'];

    const found = allowedUrlPatterns.find((pattern) => {
        const regex = new RegExp(pattern);
        return regex.test(url);
    });

    return found || false;
}



//
// ajax-interceptor BEGINS
//

function initAjaxInterceptor() {
    const COMPLETED_READY_STATE = 4;

    const RealXHRSend = XMLHttpRequest.prototype.send;

    const requestCallbacks = [];
    const responseCallbacks = [];
    let wired = false;

    function arrayRemove(array,item) {
        var index = array.indexOf(item);
        if (index > -1) {
            array.splice(index, 1);
        } else {
            throw new Error("Could not remove " + item + " from array");
        }
    }


    function fireCallbacks(callbacks,xhr) {
        for( var i = 0; i < callbacks.length; i++ ) {
            callbacks[i](xhr);
        }
    }

    function fireResponseCallbacksIfCompleted(xhr) {
        if( xhr.readyState === COMPLETED_READY_STATE ) {
            fireCallbacks(responseCallbacks,xhr);
        }
    }

    function proxifyOnReadyStateChange(xhr) {
        var realOnReadyStateChange = xhr.onreadystatechange;
        if ( realOnReadyStateChange ) {
            xhr.onreadystatechange = function() {
                fireResponseCallbacksIfCompleted(xhr);
                realOnReadyStateChange();
            };
        }
    }

    function addResponseCallback(callback) {
        responseCallbacks.push(callback);
    };

    function wire() {
        if ( wired ) throw new Error("Ajax interceptor already wired");

        // Override send method of all XHR requests
        XMLHttpRequest.prototype.send = function() {

            // Fire request callbacks before sending the request
            fireCallbacks(requestCallbacks,this);

            // Wire response callbacks
            if( this.addEventListener ) {
                var self = this;
                this.addEventListener("readystatechange", function() {
                    fireResponseCallbacksIfCompleted(self);
                }, false);
            }
            else {
                proxifyOnReadyStateChange(this);
            }

            RealXHRSend.apply(this, arguments);
        };
        wired = true;
    };

    function isWired() {
        return wired;
    }

    function unwire() {
        if ( !wired ) throw new Error("Ajax interceptor not currently wired");
        XMLHttpRequest.prototype.send = RealXHRSend;
        wired = false;
    };

    return {
        addResponseCallback,
        wire,
        unwire,
        isWired
    }
}

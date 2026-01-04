// ==UserScript==
// @name         HTTP Request/Response logger
// @namespace    tacatman@gmail.com/scripts
// @version      1.1
// @description  Listen to all ajax http requests and responses and renders a button on screen that allows it's download (groups by request). Exports in mockserver format.
// @author       Pedro Fonseca
// @license      GPL
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @require     https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.3/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/372617/HTTP%20RequestResponse%20logger.user.js
// @updateURL https://update.greasyfork.org/scripts/372617/HTTP%20RequestResponse%20logger.meta.js
// ==/UserScript==
var startup = function() {
    var XMLHttpRequestOpen = XMLHttpRequest.prototype.open;
    var exportFile = function (key) {
        var blob = new Blob([JSON.stringify(window.requestSnifferForMock[key], null, 2)], {type : 'application/json'});
        requestSnifferForMockSaveAs(blob, key+".json");
    };
    var addButton = function(text, func) {
        var div = document.createElement('div');
        div.setAttribute('style', 'padding: 10px; display: flex;');
        var button = document.createElement('button');
        button.setAttribute('style', 'flex: 1 0 auto');
        button.addEventListener('click', func, false);
        button.innerText = text;
        div.appendChild(button);
        return div;
    };
    var updateDownloaderDiv = function() {
        const element = document.getElementById('requestSnifferForMockDiv');
        if (Object.keys(window.requestSnifferForMock).length > 0) {
            element.innerHTML = "";
            Object.keys(window.requestSnifferForMock).forEach((t) => {
                element.appendChild(addButton(t + '(' + window.requestSnifferForMock[t].length + ')', exportFile.bind(undefined, t)));
            });
            element.appendChild(addButton('Clear', clear));
        } else {
            element.innerHTML = "listening...";
        }
    };
    var clear = function() {
        Object.keys(window.requestSnifferForMock).forEach((t) => {
            delete window.requestSnifferForMock[t];
        });
        updateDownloaderDiv();
    };
    XMLHttpRequest.prototype.open = function() {
        const request = {
            method: arguments['0']
        };
        const url = arguments['1'];
        const index = url.indexOf('?');
        if (index >= 0) {
            request.path = url.substring(0, index);
            request.queryStringParameters = url.substring(url.indexOf('?') + 1).split('&').map((t) => t.split('=')).reduce((agg, t) => ({ ...agg, [t[0]] : [t[1]]}) , {});
        } else {
            request.path = url;
        }

        this.addEventListener("load", () => {
            if (window.requestSnifferForMock[request.path] == null) {
                window.requestSnifferForMock[request.path] = [];
            }
            window.requestSnifferForMock[request.path].push({
                httpRequest: request,
                httpResponse: {
                    statusCode: this.status,
                    body: JSON.stringify(JSON.parse(this.responseText)),
                },
            });
            updateDownloaderDiv();
        });

        XMLHttpRequestOpen.apply(this, arguments);
    };
    updateDownloaderDiv();
};

window.requestSnifferForMock = {};
window.requestSnifferForMockSaveAs = saveAs;
var div = document.createElement('div');
div.setAttribute('id', 'requestSnifferForMockDiv');
div.setAttribute('style', 'background-color: yellow; border-color: red; position: absolute; z-index: 1000;');
document.body.appendChild(div);
var script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.innerText = '(' + String(startup) + '())';
document.body.appendChild(script);
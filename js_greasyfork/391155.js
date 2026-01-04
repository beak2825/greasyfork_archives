// ==UserScript==
// @name         SD++ Extension
// @version      0.4
// @description  SD++ Extension for Microsoft Service Desk
// @icon         https://www.microsoft.com/favicon.ico?v2
// @license      GPL version 3
// @encoding     utf-8
// @date         10/14/2019
// @modified     10/14/2019
// @author       Franklin Chen <myfreedom614@gmail.com>
// @supportURL   http://franklin614.com/
// @include      http*://servicedesk.microsoft.com/*
// @grant        GM_xmlhttpRequest
// @copyright	 2019, Franklin Chen
// @namespace	 https://greasyfork.org/en/scripts/391155-sd-extension
// @downloadURL https://update.greasyfork.org/scripts/391155/SD%2B%2B%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/391155/SD%2B%2B%20Extension.meta.js
// ==/UserScript==
(function (window) {
    'use strict';
    if (typeof window.addin !== 'undefined') {
        return;
    }

    var rootElement = document.getElementById('eas-iframe');

    if (rootElement !== null) {
        return;
    }

    var platforms = [],
        url = location.href,
        options = {};

    function getByValue(arr, value) {
        for (var i = 0, iLen = arr.length; i < iLen; i++) {
            if (arr[i].getAttribute("rel") == value) return arr[i];
        }
    }

    platforms.push({
        'name': 'sd',
        'id': 12,
        'exp': new RegExp('servicedesk.microsoft.com/#/customer/commercial.*caseNumber=([0-9]*)'),
        'instanceIdIndex': 1,
        'render': function () {
            var checkExist = setInterval(function() {
                if (document.getElementsByClassName('case-basic-info').length) {
                    clearInterval(checkExist);

                    var fireOnHashChangesToo = true;
                    var pageURLCheckTimer = setInterval (
                        function () {
                            if (this.lastPathStr !== location.pathname
                                || this.lastQueryStr !== location.search
                                || (fireOnHashChangesToo && this.lastHashStr !== location.hash)
                               ) {
                                this.lastPathStr = location.pathname;
                                this.lastQueryStr = location.search;
                                this.lastHashStr = location.hash;
                                gmMain();
                            }
                        }
                        , 111
                    );

                    function removeElementsParentById(id) {
                        var elem = document.getElementById(id).parentNode;
                        return elem.parentNode.removeChild(elem);
                    }

                    function gmMain() {
                        if(document.getElementById('eas-iframe') !== null){
                            removeElementsParentById('eas-iframe');
                        }

                        var topBar = document.getElementsByClassName('case-basic-info')[0];
                        var topRightArea = topBar.getElementsByClassName('section-2')[0];
                        var items = topRightArea.getElementsByClassName('item');
                        var firstChild = items[items.length-2];
                        var section = document.createElement('div');
                        section.className = 'item ng-scope';
                        section.innerHTML = '<section id="eas-iframe"><div><button id="eas-collapse-button" title="Load SD++ iframe" class="c-button" style="text-decoration: none;background-color: #1e75bb;">SD++</button></div><div id="eas-iframe-placeholder"></div></section>';
                        topRightArea.insertBefore(section, firstChild);

                        var collapseButton = document.getElementById('eas-collapse-button');
                        var array = platform.exp.exec(location.href);

                        collapseButton.addEventListener("click", function () {
                            var product = document.getElementsByClassName('area-path-search')[4].value;
                            var topLeftArea = topBar.getElementsByClassName('section-1')[0];
                            var sap = topLeftArea.getElementsByClassName('row-1')[0].getElementsByClassName('item')[2].getElementsByTagName('span')[1].innerText;
                            var title = topLeftArea.getElementsByClassName('row-2')[0].getElementsByTagName('span')[1].innerText;

                            switch(product) {
                                case 'Visual Studio App Center':
                                    console.log('{questionId: "' + array[platform.instanceIdIndex] + '", platformId: ' + platform.id + ', title: "'+ encodeURIComponent (title) + '", sap: "' + encodeURIComponent (sap) + '"}');
                                    collapseButton.disabled = true;
                                    GM_xmlhttpRequest ( {
                                        method:     "POST",
                                        url:        "https://cas-ext-api.azurewebsites.net/sd/ts",
                                        data:       '{questionId: "' + array[platform.instanceIdIndex] + '", platformId: ' + platform.id + ', title: "'+ encodeURIComponent (title) + '", sap: "' + encodeURIComponent (sap) + '"}',
                                        headers:    {
                                            "Content-Type": "application/json"
                                        },
                                        onload: function (response) {
                                            var res = response.responseText;
                                            if(res) alert(res)
                                            else{
                                                var iframeUrl = 'https://cas-ext-app.azurewebsites.net/#/boot/' + platform.id + '/' + array[platform.instanceIdIndex] + '/vsac/';
                                                console.log(iframeUrl);
                                                window.open(iframeUrl, '_blank', 'location=no,height=770,width=600,scrollbars=yes,status=yes');
                                            }
                                            collapseButton.disabled = false;
                                        },
                                        onerror: function(err) {
                                            alert(err);
                                            collapseButton.disabled = false;
                                        }
                                    } );
                                    break;
                                default:
                                    console.log('The product: ' + product + ' is not supported in SD++ extension');
                                    alert('The product: ' + product + ' is not supported in SD++ extension');
                            }
                        }, false);
                    }
                }
            }, 500);
        }
    });

    function getCurrentPlatform() {
        for (var name in platforms) {
            if(platforms[name].exp !== undefined){
                if (platforms[name].exp.test(url)) {
                    return platforms[name];
                }
            }
        }

        return null;
    }

    var platform = getCurrentPlatform();

    if (platform === null) {
        console.log("not supported platform");

        return;
    }

    var array = platform.exp.exec(url);

    var indentity = array[platform.instanceIdIndex];

    console.log('indentity = ' + indentity);

    // load options from local storage
    var auto = localStorage.getItem(platform.name + ".auto");

    options.auto = (auto !== undefined && auto === 'true');

    function afterRender(){
        var collapseButton = document.getElementById('eas-collapse-button');

        var autoExpandCheckbox = document.getElementById('auto-expand-checkbox');

        var placeholder = document.getElementById('eas-iframe-placeholder');

        autoExpandCheckbox.checked = options.auto;

        autoExpandCheckbox.addEventListener('change', function () {
            localStorage.setItem(platform.name + ".auto", autoExpandCheckbox.checked);
        });

        collapseButton.addEventListener("click", function () {
            updatePanel();
        }, false);

        function updatePanel() {
            var icon = collapseButton.textContent[0];

            if (icon === '+') {
                var iframeUrl = 'https://cas-ext-app.azurewebsites.net/#/boot/' + platform.id + '/' + indentity + '/';

                var iframeHtml = '<iframe src="' + iframeUrl + '" style="width:100%;height:500px;"></iframe>';

                placeholder.innerHTML = iframeHtml;

                collapseButton.textContent = "- Community Analysis";
            }
            else if (icon === '-') {

                while (placeholder.firstChild) {
                    placeholder.removeChild(placeholder.firstChild);
                }

                collapseButton.textContent = "+ Community Analysis";
            }
        }

        if (options.auto) {
            updatePanel();
        }
    }

    // render the html and bind events
    platform.render();

    afterRender();

    window.addin = this;
})(window);
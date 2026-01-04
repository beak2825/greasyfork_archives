// ==UserScript==
// @name           Includes : HttpRequest
// @description    HttpRequest Function
// @author         You
// @version        1.0
// @language       en
// @include        nowhere
// @exclude        *
// @namespace https://greasyfork.org/users/1385333
// @downloadURL https://update.greasyfork.org/scripts/522380/Includes%20%3A%20HttpRequest.user.js
// @updateURL https://update.greasyfork.org/scripts/522380/Includes%20%3A%20HttpRequest.meta.js
// ==/UserScript==

/**************************************************************************

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See
    the GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

**************************************************************************/

HttpRequest = function () {};
HttpRequest.open = function (params) {
    return new (function (params) {
        if (!/^https?:\/\//.test(params.url)) {
            params.url = "http://" + params.url;
        }

        this.options = {
            "method"        : params.method.toUpperCase() || "GET",
            "url"           : params.url,
            "headers"       : { "User-Agent" : window.navigator.userAgent },
            "synchronous"   : !!params.synchronous,
            "onload"        : function (e) {
                var obj = params.parameters || {};

                obj.response = {
                    "raw"    : e,
                    "text"   : e.responseText,
                    "xml"    : e.responseXML
                };

                if (/^Content-Type: (?:text|application)\/(?:x-)?json/m.test(e.responseHeaders)) {
                    try {
                        obj.response.json = (typeof JSON != "undefined" && typeof JSON.parse == "function" ? JSON.parse(e.responseText) : eval("(" + e.responseText + ")") );
                    } catch (e) {
                        obj.response.json = {};
                    }
                }

                if (!obj.response.xml) {
                    if (/^Content-Type: text\/xml/m.test(e.responseHeaders)) {
                        obj.response.xml = new DOMParser().parseFromString(e.responseText, "text/xml");
                    } else if (/^Content-Type: text\/html/m.test(e.responseHeaders)) {
                        var doc = document.implementation.createHTMLDocument("");
                        doc.documentElement.innerHTML = e.responseText;

                        obj.response.xml = doc;
                    }
                }

                if (typeof params.onsuccess == "function") {
                    params.onsuccess(obj);
                }
            }
        };

        if ("headers" in params) {
            for (var header in params.headers) {
                this.options.headers[header] = params.headers[header];
            }
        }

        this.send = function (content) {
            if (content) {
                if (content instanceof unsafeWindow.HTMLCollection || content instanceof HTMLCollection) {
                    content = Array.prototype.slice.apply(content);
                }

                var data = {};
                if (content instanceof Array) {
                    for (var e of content) {  // Using 'for...of' loop here
                        if (!/^(?:radio|checkbox)$/i.test(e.type) || e.checked) {
                            if (e.checked && /^checkbox$/i.test(e.type)) {
                                if (e.name in data) {
                                    data[e.name].push(e.value);
                                } else {
                                    data[e.name] = [e.value];
                                }
                            } else {
                                data[e.name] = e.value;
                            }
                        }
                    }

                    content = data;
                }

                if (typeof content == "object") {
                    var x = "";
                    for (var key in content) {
                        if (content[key] instanceof Array) {
                            var keyarr = key.replace(/^\s+|\s+$/g, "");
                            if (!/\[\w*\]$/.test(key))
                                keyarr += "[]";

                            for (var v of content[key]) {  // Using 'for...of' loop for array items
                                x += "&" + encodeURIComponent(keyarr) + "=" + encodeURIComponent(v);
                            }
                        } else {
                            x += "&" + encodeURIComponent(key) + "=" + encodeURIComponent(content[key]);
                        }
                    }

                    content = x.substr(1);

                    if ("POST" == this.options.method) {
                        this.options.headers["Content-Type"] = "application/x-www-form-urlencoded";
                        this.options.data = content;
                    } else {
                        this.options.url += (/\?/.test(this.options.url) ? "&" : "?") + content;
                    }
                } else {
                    this.options.data = content;
                }
            }

            this.result = GM_xmlhttpRequest(this.options);

            return this;
        }
    })(params);
};

// ==UserScript==
// @name           ProxyXMLHttpRequest
// @namespace      ProxyXMLHttpRequest
// @description    Proxy for the XMLHttpRequest.
// @version        0.1
// @include        http://superplayer.000webhostapp.com/*
// @include        https://superplayer.000webhostapp.com/*
// @grant          GM.xmlHttpRequest
// @grant          unsafeWindow
// @run-at         document-start
// @connect        googlevideo.com
// @connect        youtube.com
// @downloadURL https://update.greasyfork.org/scripts/392317/ProxyXMLHttpRequest.user.js
// @updateURL https://update.greasyfork.org/scripts/392317/ProxyXMLHttpRequest.meta.js
// ==/UserScript==

var oldXMLHttpRequest = unsafeWindow.XMLHttpRequest;

var CONNECTS = ['youtube.com', 'googlevideo.com'];

function CheckAllowConnect(url){
    for(var i = 0; i < CONNECTS.length; ++i){
        if (url.indexOf(CONNECTS[i]) > -1 ) return true;
    }
    return false;
}

function SupportXMLHttpRequest() {
    var self = this;
    self.headers = null;
    self.readyState = 0;
    self.status = 0;
    self.statusText = "";
    self.responseText = "";
    self.responseHeaders = "";
    self.responseXML = "";
    self.response = null;
    self.responseType = "";

    self.open = function(_method, _url, _async, _user, _psw) {

        if(_url.startsWith('blob') || !CheckAllowConnect(_url)){
            var req = new oldXMLHttpRequest();
            req.open(_method, _url, _async, _user, _psw);
            self.setRequestHeader = function(header, value) {
                req.setRequestHeader(header, value);
            }
            self.send = function(data) {
                if(self.responseType) req.responseType = self.responseType;
                req.send(data);
            }
            self.abort = function(data) {
                req.abort();
            }
            self.getAllResponseHeaders = function() {
                return req.getAllResponseHeaders();
            }
            self.getResponseHeader = function(header) {
                return req.getResponseHeader(header);
            }
            req.onreadystatechange = function(responseDetails) {
                copyValues(req);
                if(self.onreadystatechange) self.onreadystatechange();
            }

            req.onload = function(e){
                self.onload && self.onload(e);
            }

            req.onerror = function(e){
                if(self.onerror) self.onerror(e);
            }
            req.onloadend = function(e){
                if(self.onloadend) self.onloadend(e);
            }
            req.onloadstart = function(e){
                if(self.onloadstart) self.onloadstart(e);
            }
            req.onprogress = function(e){
                if(self.onprogress) self.onprogress(e);
            }
            req.onabort = function(e){
                if(self.onabort) self.onabort(e);
            }
            req.ontimeout = function(e){
                if(self.ontimeout) self.ontimeout(e);
            }
            return;
        }
        if(_user) self.username = _user;
        if(_psw) self.password = _psw;
        self.method = _method;
        if (!_url.match(/^http[s]:/)) {
            self.url = (new URL(_url, unsafeWindow.location.href)).href;
        }
        else{
            self.url = _url;
        }
    }

    self.setRequestHeader = function(_header, _value) {
        if (self.headers == null) {
            var handler = {
                    b : true,
                    ownKeys: function (obj, prop) {
                        var props = [];
                        for(var p in obj)
                        {
                            if(this.b === true && p.toLowerCase() === "cookie") {
                                this.b = false;
                                continue;
                            }
                            props.push(p);
                        }
                        return props;
                     }
                };
            self.headers = new Proxy(new Object(), handler);
        }
        self.headers[_header] = _value;
    }



    self.abort = function() {
        if(self.GM_abort) {
            self.GM_abort.abort();
        }
        else{
            // throw("XMLHttpRequest - Bypass Security doesn't support the 'abort' method yet.");
            console.log("XMLHttpRequest - Bypass Security doesn't support the 'abort' method yet.");
        }
    }
    self.getAllResponseHeaders = function() {
        return self.responseHeaders || ""
    }

    self.getResponseHeader = function(_header) {
        var headers = self.parseHeaders(self.responseHeaders);
        var value = headers[_header];
        return value;
    }

    self.overrideMimeType = function() {
        // throw("XMLHttpRequest - Bypass Security doesn't support the 'overrideMimeType' method yet.");
        console.log("XMLHttpRequest - Bypass Security doesn't support the 'overrideMimeType' method yet.");
    }

    self.send = function(_data) {
        var oldOnload = self.onload;
        var oldOnerror = self.onerror;
        var oldOnreadystatechange = self.onreadystatechange;
        self.data = _data;

        self.onload = function(responseDetails) {
            var e = {};
            e['target'] = self;
            if (oldOnload) { oldOnload(e); }
        }

        self.onerror = function(responseDetails) {
            copyValues(responseDetails);
            var e = {};
            e['target'] = self;
            if (oldOnerror) { oldOnerror(e); }
        }

        self.onreadystatechange = function(responseDetails) {
            copyValues(responseDetails);
            if (oldOnreadystatechange ) { oldOnreadystatechange.call(self); }
        }

        self.GM_abort = GM.xmlHttpRequest(self);
    }

    self.parseHeaders = function (headers) {
        if (self._responseHeaders) { return self._responseHeaders; }
        var ret = new Array();
        var lines = headers.split("\n");
        for (var i = 0; i < lines.length; i++) {
            var sepIndex = lines[i].indexOf(':');
            if (sepIndex > 0) {
                var header = lines[i].substring(0, sepIndex);
                var value = lines[i].substring(sepIndex + 1);
                value = value.replace(/^\s+/, '');
                ret[header] = value;
            }
        }

        self._responseHeaders = ret;
        return ret;
    }

    function copyValues(responseDetails) {

        self = Object.assign(self, responseDetails);
        if(responseDetails.readyState === 4){
            try{
                self.response = responseDetails.response;
            } catch(e) { /*console.log(e);*/}
            try{
                self.responseText = responseDetails.responseText;
            } catch(e) { /*console.log(e);*/}
            try{
                self.responseXML = responseDetails.responseXML;
            } catch(e) { /*console.log(e);*/}
        }
    }
}

unsafeWindow.ProxyXHR = true;
unsafeWindow.XMLHttpRequest = SupportXMLHttpRequest;

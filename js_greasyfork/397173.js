// ==UserScript==
// @name         f-ck-sangfor-hac
// @namespace    https://github.com/acshmily/f-ck-sangfor-hac
// @version      0.1
// @description  just you know why,本插件仅为个人学习测试使用，请在下载后24小时内删除，不得用于商业用途，否则后果自负
// @author       acshmily
// @match        *://192.168.19.99/fort/operation/sso/*
// @grant        none
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAIVBMVEXX14YAAADhwLfw4Nv////IubXHubWrnJiPgHtzY15XR0Im8u3JAAAAAXRSTlMAQObYZgAAAPZJREFUKM9djj1PwzAQht1/EKtK6EpRu0evrYSZDKzo9CZ0jtK9RFHn8iGFGVXABv8UpbVNmpv8PHe+95QKpSN1UfomjS4ZSCeMIpowogkH4dmLwE7MTryC9WJ+6hPiRVKjIDuQlRM01UJ3eDhcnUXccMe9IK46N9EI2AFSiRNlPUT+p8RNDVgaKz5lK8AjkFk/sa1xe9zEHdzSmLU9DivazH/hRvL+/fNDwh1f/fNyeS0+lt/pkymQ+6VJ0+b6rcjmsv45fynb3B60fln/KndpZV7v8t7zsBT3fegPd1AMVoGHCY5ZJSTLEasZyTErpSeslB69/wBjCEnPNRwuRAAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/397173/f-ck-sangfor-hac.user.js
// @updateURL https://update.greasyfork.org/scripts/397173/f-ck-sangfor-hac.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    console.info('初始化拦截器成功')

})();
(function(xhr) {

    const fuckPath = 'fort/sso/get_sso_graphic'
    const fuckSsh = 'fort/sso/get_sso_cmd'
    const XHR = XMLHttpRequest.prototype;

    const open = XHR.open;
    const send = XHR.send;
    const setRequestHeader = XHR.setRequestHeader;

    XHR.open = function(method, url) {
        this._method = method;
        this._url = url;
        this._requestHeaders = {};
        this._startTime = (new Date()).toISOString();

        return open.apply(this, arguments);
    };

    XHR.setRequestHeader = function(header, value) {
        this._requestHeaders[header] = value;
        return setRequestHeader.apply(this, arguments);
    };

    XHR.send = function(postData) {
        //console.info(postData)
        this.addEventListener('load', function() {
            const endTime = (new Date()).toISOString();

            const myUrl = this._url ? this._url.toLowerCase() : this._url;
            if(myUrl) {

                if (postData) {
                    if (typeof postData === 'string') {
                        try {
                            // here you get the REQUEST HEADERS, in JSON format, so you can also use JSON.parse
                            this._requestHeaders = postData;
                        } catch(err) {
                            console.log('Request Header JSON decode failed, transfer_encoding field could be base64');
                            console.log(err);
                        }
                    } else if (typeof postData === 'object' || typeof postData === 'array' || typeof postData === 'number' || typeof postData === 'boolean') {
                        // do something if you need
                    }
                }

                // here you get the RESPONSE HEADERS
                const responseHeaders = this.getAllResponseHeaders();

                if ( this.responseType != 'blob' && this.responseText) {

                    // responseText is string or null
                    try {

                        // here you get RESPONSE TEXT (BODY), in JSON format, so you can use JSON.parse
                        const arr = this.responseText;
                        // console.log(this._url);
                        let host = this._url.split('/')[2]
                        let fuck = JSON.parse(arr)
                        // printing url, request headers, response headers, response body, to console
                        if(this._url.indexOf(fuckPath) != -1){

                            //alert(fuck.fortSsoVoQuery.sid)

                            window.open('rdp:full%20address=s:' +
                                        host +
                                        ':12025&disable menu anims=i:1&prompt for credentials on client=i:1&gatewayusagemethod=i:2&authentication level=i:2&redirectclipboard=i:1&enablecredsspsupport=i:1&displayconnectionbar=i:1&StartFullScreen=i:0&screen mode id=i:1&username=s:'+fuck.fortSsoVoQuery.sid)
                        }else if(this._url.indexOf(fuckSsh) != -1){

                            window.open('ssh://'+fuck.fortSsoVoQuery.sid+":''@"+host+':12024')


                        }
                        //console.log(arr)
                        //console.log(JSON.parse(this._requestHeaders));
                        //console.log(responseHeaders);


                    } catch(err) {
                        console.log("Error in responseType try catch");
                        console.log(err);
                    }
                }

            }
        });

        return send.apply(this, arguments);
    };

})(XMLHttpRequest);
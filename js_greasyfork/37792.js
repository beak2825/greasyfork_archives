// ==UserScript==
// @name 速卖通产品数据追踪
// @version      0.4
// @description 抓取速卖通单账号产品数据追踪信息
// @match        *://*.aliexpress.com/*
// @run-at       document-start
// @include        *://www.aliexpress.com/*
// @run-at       document-start
// @namespace aliexpress
// @downloadURL https://update.greasyfork.org/scripts/37792/%E9%80%9F%E5%8D%96%E9%80%9A%E4%BA%A7%E5%93%81%E6%95%B0%E6%8D%AE%E8%BF%BD%E8%B8%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/37792/%E9%80%9F%E5%8D%96%E9%80%9A%E4%BA%A7%E5%93%81%E6%95%B0%E6%8D%AE%E8%BF%BD%E8%B8%AA.meta.js
// ==/UserScript==
(function (root, factory) {
    if ( typeof define === 'function' && define.amd ) {
        define([], (function () {
            return factory(root);
        }));
    } else if ( typeof exports === 'object' ) {
        module.exports = factory(root);
    } else {
        window.atomic = factory(root);
    }
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, (function (window) {

    'use strict';

    //
    // Variables
    //

    var atomic = {}; // Object for public APIs
    var supports = !!window.XMLHttpRequest && !!window.JSON; // Feature test
    var settings;

    // Default settings
    var defaults = {
        type: 'GET',
        url: null,
        data: {},
        callback: null,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        responseType: 'text',
        withCredentials: false
    };


    //
    // Methods
    //

    /**
     * Merge two or more objects. Returns a new object.
     * @private
     * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
     * @param {Object}   objects  The objects to merge together
     * @returns {Object}          Merged values of defaults and options
     */
    var extend = function () {

        // Setup extended object
        var extended = {};

        // Merge the object into the extended object
        var merge = function (obj) {
            for ( var prop in obj ) {
                if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
                    if ( Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
                        extended[prop] = extend( true, extended[prop], obj[prop] );
                    } else {
                        extended[prop] = obj[prop];
                    }
                }
            }
        };

        // Loop through each object and conduct a merge
        for (var i = 0; i < arguments.length; i++) {
            var obj = arguments[i];
            merge(obj);
        }

        return extended;

    };

    /**
     * Parse text response into JSON
     * @private
     * @param  {String} req The response
     * @return {Array}      A JSON Object of the responseText, plus the orginal response
     */
    var parse = function (req) {
        var result;
        if (settings.responseType !== 'text' && settings.responseType !== '') {
            return [req.response, req];
        }
        try {
            result = JSON.parse(req.responseText);
        } catch (e) {
            result = req.responseText;
        }
        return [result, req];
    };

    /**
     * Convert an object into a query string
     * @private
     * @@link  https://blog.garstasio.com/you-dont-need-jquery/ajax/
     * @param  {Object|Array|String} obj The object
     * @return {String}                  The query string
     */
    var param = function (obj) {
        if (typeof (obj) === 'string') return obj;
        if (/application\/json/i.test(settings.headers['Content-type']) || Object.prototype.toString.call(obj) === '[object Array]') return JSON.stringify(obj);
        var encoded = [];
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                encoded.push(encodeURIComponent(prop) + '=' + encodeURIComponent(obj[prop]));
            }
        }
        return encoded.join('&');
    };

    /**
     * Make an XML HTTP request
     * @private
     * @return {Object} Chained success/error/always methods
     */
    var xhr = function () {

        // Our default methods
        var methods = {
            success: function () {},
            error: function () {},
            always: function () {}
        };

        // Create our HTTP request
        var request = new XMLHttpRequest();

        // Override defaults with user methods and setup chaining
        var atomXHR = {
            success: function (callback) {
                methods.success = callback;
                return atomXHR;
            },
            error: function (callback) {
                methods.error = callback;
                return atomXHR;
            },
            always: function (callback) {
                methods.always = callback;
                return atomXHR;
            },
            abort: function () {
                request.abort();
            },
            request: request
        };

        // Setup our listener to process compeleted requests
        request.onreadystatechange = function () {

            // Only run if the request is complete
            if ( request.readyState !== 4 ) return;

            // Parse the response text
            var req = parse(request);

            // Process the response
            if (request.status >= 200 && request.status < 300) {
                // If successful
                methods.success.apply(methods, req);
            } else {
                // If failed
                methods.error.apply(methods, req);
            }

            // Run always
            methods.always.apply(methods, req);

        };

        // Setup our HTTP request
        request.open(settings.type, settings.url, true);
        request.responseType = settings.responseType;

        // Add headers
        for (var header in settings.headers) {
            if (settings.headers.hasOwnProperty(header)) {
                request.setRequestHeader(header, settings.headers[header]);
            }
        }

        // Add withCredentials
        if (settings.withCredentials) {
            request.withCredentials = true;
        }

        // Send the request
        request.send(param(settings.data));

        return atomXHR;
    };

    /**
     * Make a JSONP request
     * @private
     * @return {[type]} [description]
     */
    var jsonp = function () {
        // Create script with the url and callback
        var ref = window.document.getElementsByTagName( 'script' )[ 0 ];
        var script = window.document.createElement( 'script' );
        settings.data.callback = settings.callback;
        script.src = settings.url + (settings.url.indexOf( '?' ) + 1 ? '&' : '?') + param(settings.data);

        // Insert script tag into the DOM (append to <head>)
        ref.parentNode.insertBefore( script, ref );

        // After the script is loaded and executed, remove it
        script.onload = function () {
            this.remove();
        };
    };

    /**
     * Make an Ajax request
     * @public
     * @param  {Object} options  User settings
     * @return {String|Object}   The Ajax request response
     */
    atomic.ajax = function (options) {

        // feature test
        if ( !supports ) return;

        // Merge user options with defaults
        settings = extend( defaults, options || {} );

        // Make our Ajax or JSONP request
        return ( settings.type.toLowerCase() === 'jsonp' ? jsonp() : xhr() );

    };


    //
    // Public APIs
    //

    return atomic;

}));

if(window.localStorage){
    storage = window.localStorage;
}

var $ = function(str){
    return document.getElementById(str);
};

var init,checkState,storage,aliexpress_account,
    globalData = [],
    onlineUrl = "http://120.25.67.160/wms/Index/Api/smtDataReceive",
    href = document.location.href;

var script = document.createElement("script");
script.type = "text/javascript";
script.src = "http://tools.jb51.net/static/passcreate/md5.js";
script.charset = "utf-8";
document.getElementsByTagName('head')[0].appendChild(script);

var tool = {
    window: function(){
        var w;
        try {
            w = unsafeWindow;
        } catch (e) {
            w = window;
        } return w;
    },
    reg: function(str){
        var result = str.match(/val=\"(.*?)\"/g);
        if (result) return result.map(function(element){
            return element.replace(/\"/g, '');
        });
        return false;
    },
    trim: function(str){
        return str.replace(/^\s+|\s+$/g, "");
    },
    setCookie: function(name, value, expiredays){
        var expdate = new Date();
        var outms = expiredays*24*60*60*1000;
        expdate.setTime(expdate.getTime() + outms);
        document.cookie = name+"="+encodeURIComponent(value)+";path=/;domain="+document.domain+";expires="+expdate.toGMTString();
    },
    getCookie: function(cookiename){
        var value = document.cookie.match(new RegExp("(^| )" + cookiename + "=([^;]*)(;|$)"));
        return null != value ? decodeURIComponent(value[2]) : null;
        // if (document.cookie.length > 0) {
        //     c_start = document.cookie.indexOf(cookiename + "=");
        //     if (c_start != -1) {
        //         c_start = c_start + cookiename.length+1;
        //         c_end = document.cookie.indexOf(";", c_start);
        //         if (c_end == -1) c_end = document.cookie.length;
        //         return unescape(document.cookie.substring(c_start, c_end));
        //     }
        // }
        // return "";
    },
    checkCookie: function(key){
        var cookieVal = this.getCookie(key);
        if (cookieVal != null && cookieVal != "") {
            return cookieVal;
        } else {
            return "";
        }
    },
    getClassName: function (para, obj){
        obj = obj||document;
        var arrClass = [];
        if(obj.getElementsByClassName){
            return obj.getElementsByClassName(para);
        } else {
            var boxClass = obj.getElementsByTagName('*');
            for (var i = 0; i < boxClass.length; i++) {
                var nameBox = boxClass[i].className.split(' ');
                for (var j = 0; j < nameBox.length; j++) {
                    if (nameBox[j] == para) {
                        arrClass.push(boxClass[i]);
                    }
                }
            }
        }
        return(arrClass);
    }
};

(function () {
    function invokes(){
        var headerBar = document.querySelectorAll(".header-welcome-bar ul li:first-child span")[0];
        aliexpress_account = headerBar.innerText.replace('欢迎您， ', '');

        if (aliexpress_account == null || typeof aliexpress_account == 'undefined') {
            // aliexpress_account = tool.getCookie("account");
            if (aliexpress_account == '' || tool.trim(aliexpress_account).length < 2 || aliexpress_account == 'undefined') {
                if (href.indexOf('login.aliexpress.com') > 0 || href.indexOf('passport.aliexpress.com') > 0) {
                    return false;
                }
                if (href.indexOf('accountPortal.htm') < 1) {
                    // window.open("https://myae.aliexpress.com/seller/account/accountPortal.htm");
                } else {
                    var table = $("verif-detail");
                    var tr = table.rows;
                    if (tr.length < 1) {
                        return false;
                    }
                    for (var k = 0; k < tr.length; k++) {
                        var nodeLocalName = tr[k].parentNode.localName;
                        if (nodeLocalName.toLocaleUpperCase() == 'TBODY') {
                            for (var l = 0; l < tr[k].cells.length; l++) {
                                var cells = tr[k].cells[l];
                                var cellsText = tool.trim(cells.innerHTML);
                                if (cellsText.length > 4) {
                                    // tool.setCookie("account", cellsText, 1);
                                    // aliexpress_account = cellsText;
                                    break;
                                }
                            }
                            break;
                        }
                    }
                }
            }
        }
        var index = href.indexOf('wsDlProductAnalysis.htm');
        if (index > 0 && document.readyState == 'complete'){
            var tb = $("pdt-ana-tb");
            var rows = tb.rows;
            if (rows.length < 2) {
                return false;
            }
            var pageData = [];
            for (var i = 0; i < rows.length; i++) {
                var obj = {};
                var arr = [];
                var localName = rows[i].parentNode.localName;
                if (localName.toLocaleUpperCase() == 'TBODY') {
                    for (var j = 0; j < rows[i].cells.length; j++) {
                        var cell = rows[i].cells[j];
                        var html = cell.innerHTML;
                        var nodeName = rows[i].nodeName.toLocaleUpperCase();
                        if (j == 0) {
                            html = cell.children[0].href;
                            html = html.substring(html.lastIndexOf('/')+1, html.lastIndexOf('.'));
                        } else if (j == 7 || j == 1) {
                            continue;
                        }
                        arr.push(html);
                    }
                    globalData.push(arr);
                    pageData.push(arr);
                }
            }

            if (pageData.length > 0) {
                var paramsJson = JSON.stringify({"account": aliexpress_account, "data" : pageData});
                var secretKey = "PANGUAPI#20171229";
                var sign = hex_md5('paramsJson:'+paramsJson+';'+secretKey).toUpperCase();
                var method = "track";
                var data = {paramsJson: paramsJson, sign: sign, method: method};
                var log = JSON.stringify(data);
                try {
                    atomic.ajax({
                        type: "JSONP",
                        url: onlineUrl,
                        callback: "callbackFunc",
                        data: data
                    });
                } catch(err) {
                }

                constract(globalData.length);
            }

        } else {
            if (document.readyState != 'complete') {
                checkState = setTimeout(invokes, 2000);
            }
        }
    }

    var callbackFunc = function (data){};

    function constract(dLen) {
        if (dLen < 1) {
            return false;
        }
        var obj = tool.getClassName("ui-pagination-navi");
        if (obj) {
            obj = obj[0];
        }
        var childNodes = obj.childNodes;
        for (var i = 0; i < childNodes.length; i++) {
            var lastIndex = childNodes.length-1;
            var nodeName = childNodes[lastIndex].nodeName.toLocaleUpperCase();
            if (nodeName == 'A') {
                childNodes[lastIndex].click();
                setTimeout(invokes, 2000);
                break;
            } else if (nodeName == 'SPAN') {
                break;
            }
        }
    }

    window.onload = function (){
        init = setTimeout(invokes, 2000);
    };
})();
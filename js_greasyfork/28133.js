// ==UserScript==
// @name         dwr logger
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Loga as chamadas de dwr
// @match        http://localhost:8080/*
// @match        https://dev.uspdigital.usp.br/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/28133/dwr%20logger.user.js
// @updateURL https://update.greasyfork.org/scripts/28133/dwr%20logger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var contador = 0;

    (function(send) {
		XMLHttpRequest.prototype.send = function(data) {
            var lista = data.split("\n");
            var scriptName = "", sp = "", metodo = "";
            var params = ""; var refs = []; var _l;

            for (var i = 0; i < lista.length; i++) {
                if(lista[i].indexOf("c0-scriptName=") >= 0){
                    scriptName = lista[i].replace("c0-scriptName=",""); // extrair o nome do script. Ex: ControleAutorizadoDWR
                }
                else if(lista[i].indexOf("c0-param0=string:") >= 0 && scriptName === 'ControleAutorizadoDWR'){
                    sp = lista[i].replace("c0-param0=string:",""); // extrair o nome da proc
                }
                else if(lista[i].indexOf("c0-methodName=") >= 0){
                    metodo = lista[i].replace("c0-methodName=",""); // extrair o nome do método: executar, obter, etc
                }
                else if(lista[i].indexOf("c0-param") >= 0){ // parâmetros dwr
                    params += (params !== ""?",":"");
                    if(lista[i].indexOf("Object_Object:") >= 0){
                        params += lista[i].split("Object_Object:")[1];
                    } else if(lista[i].indexOf("array:") >= 0){
                        params += lista[i].split("array:")[1];
                    } else {
                        params += '"' + lista[i].split(":")[1] + '"';
                    }
                }
                else if(lista[i].indexOf("c0-e") >= 0){ // ref dos params
                    _l = lista[i].split("=");

                    if(lista[i].indexOf("Object_Object:") >= 0){
                        refs[_l[0]] = _l[1].split("Object_Object:")[1];
                    } else {
                        refs[_l[0]] = _l[1].split(":")[1];
                    }
                }
            }

            for (var j = 0; j < 2; j++) {
                for(var chave0 in refs) params = params.replace("reference:"+chave0+",",'"'+refs[chave0]+'",');
                for(var chave1 in refs) params = params.replace("reference:"+chave1+"}",'"'+refs[chave1]+'"}');
                for(var chave2 in refs) params = params.replace("reference:"+chave2+"]",'"'+refs[chave2]+'"]');
            }

            if(scriptName == 'ControleAutorizadoDWR'){ // usp-dwr
                log(metodo + '.' + sp + ':' + decodeURIComponent(params));
            } else {
                log(scriptName + '.' + metodo + ':[' + decodeURIComponent(params) + ']');
            }

            //log(data);

            contador++;
            document.getElementById("loggerTab").innerHTML = "log("+contador+")";

		   	send.call(this, data);
		};
	})(XMLHttpRequest.prototype.send);
})();


///////////////////////////////////////////////////////////////////////////////
// Logger.js
// =========
// singleton log class (module pattern)
//
// This class creates a drawable tab at the bottom of web browser. You can slide
// up/down by clicking the tab. You can toggle on/off programmatically by
// calling Logger.toggle(), or Logger.show() and Logger.hide() respectively.
// It can be completely hidden by calling Logger.hide(). To get it back, call
// Logger.show(). It can be also enabled/disabled by Logger.enable()/disable().
// When it is disabled, a message with log() won't be written to logger.
// When you need to purge all previous messages, use Logger.clear().
//
// Use log() utility function to print a message to the log window.
// e.g.: log("Hello") : print Hello
//       log(123)     : print 123
//       log()        : print a blank line
//
// History:
//          1.15: Fixed height issue for box-sizing CSS.
//          1.14: Added toggle() to draw logger window up/down.
//                Added open()/close() to slide up/down.
//                Changed show()/hide() for visibility.
//                Changed tab size smaller.
//          1.13: Added the class name along with version.
//          1.12: Removed width and added margin-left for msgDiv.
//          1.11: Added clear() function.
//          1.10: Added enable()/disable() functions.
//          1.09: Added z-index attribute on the logger container.
//          1.08: Use requestAnimationFrame() for animations.
//          1.07: Wrap a message if it is longer than the window width.
//          1.06: Print "undefined" or "null" if msg is undefined or null value.
//          1.05: Added time stamp for log() (with no param).
//          1.04: Modified handling undefined type of msg.
//          1.03: Fixed the error when msg is undefined.
//          1.02: Added sliding animation easy in/out using cosine.
//          1.01: Changed "display:none" to visibility:hidden for logDiv.
//                Supported IE v8 without transparent background.
//          1.00: First public release.
//
//  AUTHOR: Song Ho Ahn (song.ahn@gmail.com)
// CREATED: 2011-02-15
// UPDATED: 2016-12-09
//
// Copyright 2011. Song Ho Ahn
// http://www.songho.ca/misc/logger/files/Logger.js
//
//
// utility function to print message with timestamp to log
// e.g.: log("Hello")   : print Hello
//       log(123)       : print 123
//       log()          : print a blank line
function log(msg)
{
    if(arguments.length === 0)
        Logger.print(""); // print a blank line
    else
        Logger.print(msg);
}



///////////////////////////////////////////////////////////////////////////////
var Logger = (function()
{
    "use strict";

    ///////////////////////////////////////////////////////////////////////////
    // private members
    ///////////////////////////////////////////////////////////////////////////
    var version = "1.15";
    var containerDiv = null;
    var tabDiv = null;
    var logDiv = null;
    var visible = true;     // flag for visibility
    var opened = false;     // flag for toggle on/off
    var enabled = true;     // does not accept log messages any more if it is false
    var logHeight = 215;    // 204 + 2*padding + border-top
    var tabHeight = 20;
    // for animation
    var animTime = 0;
    var animDuration = 200; // ms
    var animFrameTime= 16;  // ms

    ///////////////////////////////////////////////////////////////////////////
    // get time and date as string with a trailing space
    var getTime = function()
    {
        var now = new Date();
        var hour = "0" + now.getHours();
        hour = hour.substring(hour.length-2);
        var minute = "0" + now.getMinutes();
        minute = minute.substring(minute.length-2);
        var second = "0" + now.getSeconds();
        second = second.substring(second.length-2);
        return hour + ":" + minute + ":" + second;
    };
    var getDate = function()
    {
        var now = new Date();
        var year = "" + now.getFullYear();
        var month = "0" + (now.getMonth()+1);
        month = month.substring(month.length-2);
        var date = "0" + now.getDate();
        date = date.substring(date.length-2);
        return year + "-" + month + "-" + date;
    };
    ///////////////////////////////////////////////////////////////////////////
    // return available requestAnimationFrame(), otherwise, fallback to setTimeOut
    var getRequestAnimationFrameFunction = function()
    {
        var requestAnimationFrame = window.requestAnimationFrame ||
                                    window.mozRequestAnimationFrame ||
                                    window.msRequestAnimationFrame ||
                                    window.oRequestAnimationFrame ||
                                    window.webkitRequestAnimationFrame;
        if(requestAnimationFrame)
            return function(callback){ return requestAnimationFrame(callback); };
        else
            return function(callback){ return setTimeout(callback, 16); };
    };



    ///////////////////////////////////////////////////////////////////////////
    // public members
    ///////////////////////////////////////////////////////////////////////////
    var self =
    {
        ///////////////////////////////////////////////////////////////////////
        // create a div for log and attach it to document
        init: function()
        {
            // avoid redundant call
            if(containerDiv)
                return true;

            // check if DOM is ready
            if(!document || !document.createElement || !document.body || !document.body.appendChild)
                return false;

            // constants
            var CONTAINER_DIV = "loggerContainer";
            var TAB_DIV = "loggerTab";
            var LOG_DIV = "logger";
            var Z_INDEX = 9999;

            // create logger DOM element
            containerDiv = document.getElementById(CONTAINER_DIV);
            if(!containerDiv)
            {
                // container
                containerDiv = document.createElement("div");
                containerDiv.id = CONTAINER_DIV;
                containerDiv.setAttribute("style", "width:100%; " +
                                                   "margin:0; " +
                                                   "padding:0; " +
                                                   "box-sizing:border-box; " +
                                                   "position:fixed; " +
                                                   "left:0; " +
                                                   "z-index:" + Z_INDEX + "; " +
                                                   "bottom:" + (-logHeight) + "px; ");  /* hide it initially */

                // tab
                tabDiv = document.createElement("div");
                tabDiv.id = TAB_DIV;
                tabDiv.appendChild(document.createTextNode("log"));
                tabDiv.setAttribute("style", "width:55px; " +
                                             "box-sizing:border-box; " +
                                             "overflow:hidden; " +
                                             "font:bold 10px verdana,helvetica,sans-serif; " +
                                             "line-height:" + (tabHeight-1) + "px; " +  /* subtract top-border */
                                             "color:#fff; " +
                                             "position:absolute; " +
                                             "left:20px; " +
                                             "top:" + -tabHeight + "px; " +
                                             "margin:0; padding:0; " +
                                             "text-align:center; " +
                                             "border:1px solid #aaa; " +
                                             "border-bottom:none; " +
                                             /*"background:#333; " + */
                                             "background:rgba(0,0,0,0.7); " +
                                             "-webkit-border-top-right-radius:8px; " +
                                             "-webkit-border-top-left-radius:8px; " +
                                             "-khtml-border-radius-topright:8px; " +
                                             "-khtml-border-radius-topleft:8px; " +
                                             "-moz-border-radius-topright:8px; " +
                                             "-moz-border-radius-topleft:8px; " +
                                             "border-top-right-radius:8px; " +
                                             "border-top-left-radius:8px; ");
                // add mouse event handlers
                tabDiv.onmouseover = function()
                {
                    this.style.cursor = "pointer";
                    this.style.textShadow = "0 0 1px #fff, 0 0 2px #0f0, 0 0 6px #0f0";
                };
                tabDiv.onmouseout = function()
                {
                    this.style.cursor = "auto";
                    this.style.textShadow = "none";
                };
                tabDiv.onclick = function()
                {
                    Logger.toggle();
                };

                // log message
                logDiv = document.createElement("div");
                logDiv.id = LOG_DIV;
                logDiv.setAttribute("style", "font:12px monospace; " +
                                             "height: " + logHeight + "px; " +
                                             "box-sizing:border-box; " +
                                             "color:#fff; " +
                                             "overflow-x:hidden; " +
                                             "overflow-y:scroll; " +
                                             "visibility:hidden; " +
                                             "position:relative; " +
                                             "bottom:0px; " +
                                             "margin:0px; " +
                                             "padding:5px; " +
                                             /*"background:#333; " + */
                                             "background:rgba(0, 0, 0, 0.7); " +
                                             "border-top:1px solid #aaa; ");

                // style for log message
                var span = document.createElement("span");  // for coloring text
                span.style.color = "#afa";
                span.style.fontWeight = "bold";

                // the first message in log
                var msg = "===== Log Started at " +
                          getDate() + ", " + getTime() + ", " +
                          //"(Logger version " + version + ") " +
                          "=====";

                span.appendChild(document.createTextNode(msg));
                logDiv.appendChild(span);
                logDiv.appendChild(document.createElement("br"));   // blank line
                logDiv.appendChild(document.createElement("br"));   // blank line

                // add divs to document
                containerDiv.appendChild(tabDiv);
                containerDiv.appendChild(logDiv);
                document.body.appendChild(containerDiv);
            }

            return true;
        },
        ///////////////////////////////////////////////////////////////////////
        // print log message to logDiv
        print: function(msg)
        {
            // ignore message if it is disabled
            if(!enabled)
                return;

            // check if this object is initialized
            if(!containerDiv)
            {
                var ready = this.init();
                if(!ready)
                    return;
            }

            var msgDefined = true;

            // convert non-string type to string
            if(typeof msg == "undefined")   // print "undefined" if param is not defined
            {
                msg = "undefined";
                msgDefined = false;
            }
            else if(msg === null)           // print "null" if param has null value
            {
                msg = "null";
                msgDefined = false;
            }
            else
            {
                msg += ""; // for "object", "function", "boolean", "number" types
            }

            var lines = msg.split(/\r\n|\r|\n/);
            for(var i in lines)
            {
                // format time and put the text node to inline element
                var timeDiv = document.createElement("div");            // color for time
                timeDiv.setAttribute("style", "color:#999;" +
                                              "float:left;");

                var timeNode = document.createTextNode(getTime() + "\u00a0");
                timeDiv.appendChild(timeNode);

                // create message span
                var msgDiv = document.createElement("div");
                msgDiv.setAttribute("style", "word-wrap:break-word;" +  // wrap msg
                                             "margin-left:6.0em;");     // margin-left = 9 * ?
                if(!msgDefined)
                    msgDiv.style.color = "#afa"; // override color if msg is not defined

                // put message into a text node
                var line = lines[i].replace(/ /g, "\u00a0");
                var msgNode = document.createTextNode(line);
                msgDiv.appendChild(msgNode);

                // new line div with clearing css float property
                var newLineDiv = document.createElement("div");
                newLineDiv.setAttribute("style", "clear:both;");

                logDiv.appendChild(timeDiv);            // add time
                logDiv.appendChild(msgDiv);             // add message
                logDiv.appendChild(newLineDiv);         // add message

                logDiv.scrollTop = logDiv.scrollHeight; // scroll to last line
            }
        },
        ///////////////////////////////////////////////////////////////////////
        // slide log container up and down
        toggle: function()
        {
            if(opened)  // if opened, close the window
                this.close();
            else        // if closed, open the window
                this.open();
        },
        open: function()
        {
            if(!this.init()) return;
            if(!visible) return;
            if(opened) return;

            logDiv.style.visibility = "visible";
            animTime = Date.now();
            var requestAnimationFrame = getRequestAnimationFrameFunction();
            requestAnimationFrame(slideUp);
            function slideUp()
            {
                var duration = Date.now() - animTime;
                if(duration >= animDuration)
                {
                    containerDiv.style.bottom = 0;
                    opened = true;
                    return;
                }
                var y = Math.round(-logHeight * (1 - 0.5 * (1 - Math.cos(Math.PI * duration / animDuration))));
                containerDiv.style.bottom = "" + y + "px";
                requestAnimationFrame(slideUp);
            }
        },
        close: function()
        {
            if(!this.init()) return;
            if(!visible) return;
            if(!opened) return;

            animTime = Date.now();
            var requestAnimationFrame = getRequestAnimationFrameFunction();
            requestAnimationFrame(slideDown);
            function slideDown()
            {
                var duration = Date.now() - animTime;
                if(duration >= animDuration)
                {
                    containerDiv.style.bottom = "" + -logHeight + "px";
                    logDiv.style.visibility = "hidden";
                    opened = false;
                    return;
                }
                var y = Math.round(-logHeight * 0.5 * (1 - Math.cos(Math.PI * duration / animDuration)));
                containerDiv.style.bottom = "" + y + "px";
                requestAnimationFrame(slideDown);
            }
        },
        ///////////////////////////////////////////////////////////////////////
        // show/hide the logger window and tab
        show: function()
        {
            if(!this.init())
                return;

            containerDiv.style.display = "block";
            visible = true;
        },
        hide: function()
        {
            if(!this.init())
                return;

            containerDiv.style.display = "none";
            visible = false;
        },
        ///////////////////////////////////////////////////////////////////////
        // when Logger is enabled (default), log() method will write its message
        // to the console ("logDiv")
        enable: function()
        {
            if(!this.init())
                return;

            enabled = true;
            tabDiv.style.color = "#fff";
            logDiv.style.color = "#fff";
        },
        ///////////////////////////////////////////////////////////////////////
        // when it is diabled, subsequent log() calls will be ignored and
        // the message won't be written on "logDiv".
        // "LOG" tab and log text are grayed out to indicate it is disabled.
        disable: function()
        {
            if(!this.init())
                return;

            enabled = false;
            tabDiv.style.color = "#444";
            logDiv.style.color = "#444";
        },
        ///////////////////////////////////////////////////////////////////////
        // clear all messages from logDiv
        clear: function()
        {
            if(!this.init())
                return;

            logDiv.innerHTML = "";
        }
    };
    return self;
})();
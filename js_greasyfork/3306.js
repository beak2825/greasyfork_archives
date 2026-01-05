// ==UserScript==
// @name 		User Interface Script (Big Release World)
// @namespace 	http://wofh.ru/
// @author      akasoft,andryxa,Regis,simplexe
// @version     1.3.11.2
// @include     http://w*.wofh.ru/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @grant       GM_addStyle
// @description User Interface Script
// @downloadURL https://update.greasyfork.org/scripts/3306/User%20Interface%20Script%20%28Big%20Release%20World%29.user.js
// @updateURL https://update.greasyfork.org/scripts/3306/User%20Interface%20Script%20%28Big%20Release%20World%29.meta.js
// ==/UserScript==

String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
};

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    
    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
};

Date.prototype.format = function(str) {
    // yyyy.mm.dd hh:nn:ss
    return str.split('yyyy').join(this.getFullYear()).split('mm').join(LZ(this.getMonth() + 1)).split('dd').join(LZ(this.getDate())).split('hh').join(LZ(this.getHours())).split('nn').join(LZ(this.getMinutes())).split('ss').join(LZ(this.getSeconds()));
};

Date.prototype.formatTime = function() {
    // HH:MM:SS
    return LZ(this.getUTCHours() + (this.getUTCDate() - 1) * 24) + ":" + LZ(this.getUTCMinutes()) + ":" + LZ(this.getUTCSeconds());
};

Math.randomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

function _setValue(key, value) {
    window.localStorage.setItem(key + '_' + playerName + '_' + currentHost, value);
}

function _getValue(key, defaultValue) {
    var itm = window.localStorage.getItem(key + '_' + playerName + '_' + currentHost);
    return itm != null ? itm == 'false' ? false : itm : defaultValue;
}

function _serialize(obj) {
    return (obj.toSource) ? obj.toSource() : JSON.stringify(obj);
}

function _deserialize(str) {
    return eval('(' + str + ')');
}

// Отладка
var debug = true;

function _log(text) {
    if (!debug) return;
    console.log(text);
}

function $q(element) {
    if (arguments.length > 1) {
        for (var i = 0, elements = [], length = arguments.length; i < length; i++)
            elements.push($q(arguments[i]));
        return elements;
    }
    if (typeof element == 'string')
        element = document.getElementById(element);
    return element;
}

// одно expression --> в 1 или более элементов
function $x(expression, parent) {
    var results = [];
    var query = document.evaluate(expression, $q(parent) || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0, length = query.snapshotLength; i < length; i++)
        results.push(query.snapshotItem(i));
    return results;
}


function $c(className, parent) {
    "use strict";
    return (parent || document).getElementsByClassName(className)
}

// создание элемента
function $e(tag, content, attributes, style, parent) {
    
    var result = document.createElement(tag);
    if (content)
        result.innerHTML = content;
    
    if (attributes)
        for (var a in attributes)
            result.setAttribute(a, attributes[a]);
    
    if (style)
        for (var a in style)
            result.style[a] = style[a];
    
    if (parent) {
        parent = $q(parent) || document;
        parent.appendChild(result);
    }
    return result;
}

function $t(text) {
    return document.createTextNode(text);
}

function $n(element) {
    if (arguments.length > 1) {
        for (var i = 0, elements = [], length = arguments.length; i < length; i++)
            elements.push($n(arguments[i]));
        return elements;
    }
    if (typeof element == 'string')
        element = document.getElementsByName(element)[0];
    return element;
}

function LZ(n) {
    return (n > 9 ? n : '0' + n);
}

function isInt(x) {
    var y = parseInt(x);
    if (isNaN(y)) return false;
    return x == y && x.toString() == y.toString();
}

function _addStyle(css) {
    var NSURI = 'http://www.w3.org/1999/xhtml';
    var hashead = document.getElementsByTagName('head')[0];
    var parentel = hashead || document.documentElement;
    var newElement = document.createElementNS(NSURI, 'link');
    newElement.setAttributeNS(NSURI, 'rel', 'stylesheet');
    newElement.setAttributeNS(NSURI, 'type', 'text/css');
    newElement.setAttributeNS(NSURI, 'href', 'data:text/css,' + encodeURIComponent(css));
    if (hashead) {
        parentel.appendChild(newElement);
    } else {
        parentel.insertBefore(newElement, parentel.firstChild);
    }
}

function __addStyle(cssStyle) {
    try {
        GM_addStyle(cssStyle);
    } catch (e) {
        _addStyle(cssStyle);
    }
}

var isMinMenu = false;
var playerName = '';
var currentHost = '';

var wofh = unsafeWindow.wofh;
var utils = unsafeWindow.utils;
var Build = unsafeWindow.Build;
var JSN =  unsafeWindow.JSN;
var lib = unsafeWindow.lib;
/* Идея.
 Есть несколько панелек с однотипным видом и поведением.
 Div-контейнер с заголовком и кнопкой, по щелчку по которой сворачивается/разворачивается контент
 Меняется текст заголовка и цвет фона заголовка
 Меняется контент
 Сохраняются положение (left, top) контейнера и видимость контента

 Описатель панели (Pane)
 {
 pane: { id: 'pane', left: '10px', top: '10px' },
 title: { id: 'panetitle', },
 button: { id: 'panebutton', image: '' },
 caption: { id: 'panecaption', text: '', bkcolor: '' },
 content: { id: 'panecontent', visible: false, text: '' }
 }/**/

/* массив используемых картинок
 0 - кнопка панелек
 1 - pause, png
 2 - play, png
 3 - del, png
 4 - city1, gif, желтый
 5 - красный
 6 - синий
 7 - зелёный
 8 - салатовый
 9 - белый
 10 - фиолетовый /**/

var imageList = [
    "data:image/gif;base64,R0lGODlhFAAUAHcAACH5BAEAAAAALAAAAAAUABQApwEAANDt/+X1//T7/+j2/8fq//X7/9zy/////+34/9Pu/8jq//r9/wI0jNvx/9Lu/0u48snq/8To/7/m/9vy/9zx/+35/6Hb/8Pp/+T1//v9/x9otMPo/z2e3k6w67Tj/8Ho//f8/0u58nC+8MXR5b7n/7zm/7Xk/8za62fB9yV1voPO+iFst/T6/8nr/zOO0UOq5zFiqZXN8wg/lPDz+LXg/H/L+brl/6rf/6nQ7iVcpwk8kqXd/3Wl1b/j+5au0mOIv4GgzT6i4Wqy5muz5keg3Uep5q/X9B9QnihWn3iVw5at0gtFmSlWoBZXpQtGmRZWpR9RnjNmrEep5bnZ89jr+a/O6iZ1vnWm1TmX2TKM0Lja8y6Fykaf3cvk96re/27G+7Xj/6vf/7Xi/5fX/y+Fyyp9xSyBx6Da/yp9xEyy7Uuz7Uq07+X2/8Tp/0Or6N3y/1/A9vH5/kaw7Eaw63XL/r/k+8Lo/8Ln/3bL/pbY/7jk/7nk/8Hn/77m//r+/1+/9h5ptB9ptZGz2MjZ7RxjsR9ptBxksHmVw8jZ7B5otZi43NPv/7/n/0+38Uq1727H+1C38TVxtjNssZGy2DZxtjt4uwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAj/AAEIHAhABASDECAQXDjwkaM4kPLUAQMoEhuGAumsScFjQYYQITIs4JFCzZyFMDys4DDAgMuXAzis8ACDoBEbNwjoJPBmp84bNqYM7DCCTAAKDpAKSeogaQA9IzoI7HLhwoIAWANkyYq1AJoLRQC8GIJDDJ8CaAtoQbtgQYE9OL4QeVFGxpgPJ0xgwCDhDAY3EiSYOPEhjAwuZmpMmNDIDwg8d1RI4ACiT4nFJWqkuWLHRVsXESIcMbShtCJBgUL7UMEix4MHChgpoGJpiwLYt3PnYFEIy4EKB+B4mWTlwG/gwI33OARAkoDnVaQsev48QxvqAioJdELJQgIgQSyITE9AvnyCQVAG6khkQM6A9y3ewzdASAdBJjFQaGCw/89+BgCiEMMTC80QxQ8IJKhggksgMQNGAOyQBCIk0EADCUo0sQOEBDXg4YcYBQQAOw==",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJjSURBVDjLpZNLbxJhFIb7A/wF/A5YunTDzuqmO+PdsDFx0dSVpJq4aIyQmUIU06a1gUqCJlXb1Ehb6QhiGgsdKFNAwAIOhWEcBobLUI5zPpgRLzsneRfz5bzPec93mQCAiXGdc4FJk0WTVdPUSNbRmunP+nHjGU3muy8lW+DjMR3ZTzMHiUMhziaF3b0U82InR0/76zaswdrfACPzWV+obI8fZjm+JoGs9EA9HRA1Wl0oVeoQ3mO5hc2sHWt1iA4wo5lNfZXbHRXwU7p9qMs9EDQ1O32yJitd2I3GZM/6EULMBIBzYWzsrJurUhcqP7rAi0OVxQ6U6h0DsrkV5m6v8DiOCQGWAPONxti6+eKDENxyJw3z5OwOXHclSBr8UrnvQPkjNHoRYA1/OWJwZoyKpgv3EZAgXYtCWwNsE0Ct0QOppcKJqMDi6msGvQiYih0kBNwsLEAAdryhAY5rbaJJ+zZcm2dJOvzvqqew4l0V0EsA+3GWALAAu+qRsbhQbcP5e0G4Sg8B+C+1erC49NwAWD98TjKi3IGGog47ksgs5E8UyFUUDfCeAHBj8WTSRREoj9cYweINZuhCqQaDAZAOGBeV5RUiNF+mWDJerz+ArU9JsLvfGptouuOr2oKhKCdIbeMkdKXLLeM40ZzRujufLHNX3OnhMeoXiXoVt6+9C8l8vUmSiE2VpMEx8PjQnC7WweHxyTPU+q+LNH6V57xR+7J/jYvEMlDgJbInOHMyL8BGKA5z1AI37Xzz91Uef0w3n+Vts0836EeuJYaadwuPnbTw0OFhZhwB+hKd+vdj+p/n/BMZPwxzcSL1lgAAAABJRU5ErkJggg==",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJfSURBVDjLpZNNbxJRFIb7A/wF/A5YunTDrpouujNxY8LGxEVTVyU11UVjCmEsUUyb1gYqEWuqtqmRWukUimksH6UMHwIW6FCYwWFgYBjKcc6FGam68ybvZuY87/m4544BwNiobiyCQZVJlVnV5FDm4TfDn/Gj4DVVxgdvBIvv4IwKHafp2MkpF40nuP2jJP1qL0dNeXkLxmDsFYMhfN0TKFujp1mGrQkgSl1QLvtEjZYMpQoPwaM4s7STtWKsZqIZGBGOJ7+L7Y4CeCS5B7zYBU5Vs9Mj30RJhv1wRHRtpdDESAywLywbM2twVZCh8lOGt+EKsHUZyvUOlPiObrKzG2TurbHYjgENTD76B4Vlj8II3noYgI3DCoHPam0iPMncOTi8IQpZNDAHv6Vo7BlLRVDLenN2j+h1iCVwodoGoaXARV2C5fV3NLJoMBmJnXA4rFqjS2DMWOTaKvyZaOJRCPwxDnIViRjJyiWsudc5ZInBcTRODLB8DcZAAs8dwPiMn/zLstKwii4sr7zUDcxfviboutiBhqTovWLgxBx9Bc6ct8jNpIt1cLjcegsmtz9DFUo16PeBgPkLiZQ7PvOJwAimyy1IlVrQ7fVh9zABVucHfYiG+56qxR8IM5wwmDJmQyGsgclSkyTIqNntz1aZO8704Bq1RXJsRK2bHwMiyw8C601FrwaXCTOnizzYXB5x2rH1e5FGV3neHbauejeZUCQDBVYgM8GeE3kOtgNRmHcsMVP293+v8uhjuvsib5l9vk09WVyhHU+d3IKd4h7bXPS0zUfdppL/fkz/85x/AR14FVfMwp4lAAAAAElFTkSuQmCC",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIhSURBVDjLlZPrThNRFIWJicmJz6BWiYbIkYDEG0JbBiitDQgm0PuFXqSAtKXtpE2hNuoPTXwSnwtExd6w0pl2OtPlrphKLSXhx07OZM769qy19wwAGLhM1ddC184+d18QMzoq3lfsD3LZ7Y3XbE5DL6Atzuyilc5Ciyd7IHVfgNcDYTQ2tvDr5crn6uLSvX+Av2Lk36FFpSVENDe3OxDZu8apO5rROJDLo30+Nlvj5RnTlVNAKs1aCVFr7b4BPn6Cls21AWgEQlz2+Dl1h7IdA+i97A/geP65WhbmrnZZ0GIJpr6OqZqYAd5/gJpKox4Mg7pD2YoC2b0/54rJQuJZdm6Izcgma4TW1WZ0h+y8BfbyJMwBmSxkjw+VObNanp5h/adwGhaTXF4NWbLj9gEONyCmUZmd10pGgf1/vwcgOT3tUQE0DdicwIod2EmSbwsKE1P8QoDkcHPJ5YESjgBJkYQpIEZ2KEB51Y6y3ojvY+P8XEDN7uKS0w0ltA7QGCWHCxSWWpwyaCeLy0BkA7UXyyg8fIzDoWHeBaDN4tQdSvAVdU1Aok+nsNTipIEVnkywo/FHatVkBoIhnFisOBoZxcGtQd4B0GYJNZsDSiAEadUBCkstPtN3Avs2Msa+Dt9XfxoFSNYF/Bh9gP0bOqHLAm2WUF1YQskwrVFYPWkf3h1iXwbvqGfFPSGW9Eah8HSS9fuZDnS32f71m8KFY7xs/QZyu6TH2+2+FAAAAABJRU5ErkJggg==",
    
    "data:image/gif;base64,R0lGODlhAgACAPcAAP/YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwAAAAAAgACAAAIBgABCAQQEAA7",
    "data:image/gif;base64,R0lGODlhAgACAPcAAP8A3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwAAAAAAgACAAAIBgABCAQQEAA7",
    "data:image/gif;base64,R0lGODlhAgACAPcAAAAm/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwAAAAAAgACAAAIBgABCAQQEAA7",
    "data:image/gif;base64,R0lGODlhAgACAPcAAAD/IQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwAAAAAAgACAAAIBgABCAQQEAA7",
    "data:image/gif;base64,R0lGODlhAgACAPcAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwAAAAAAgACAAAIBgABCAQQEAA7",
    "data:image/gif;base64,R0lGODlhAgACAPcAAAD//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwAAAAAAgACAAAIBgABCAQQEAA7",
    "data:image/gif;base64,R0lGODlhAgACAPcAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwAAAAAAgACAAAIBgABCAQQEAA7"
];
//FIXME: пофиксить 
var unitSpeedHolder = eval('({0: 4, 1: 4, 2: 5, 3: 5, 4: 6, 5: 3, 6: 7, 7: 9, 8: 4, 9: 8, 10: 10, 11: 6, 12: 4, 13: 7, 14: 12, 15: 8, 16: 7, 17: 6, 18: 3, 19: 11, 20: 5, 21: 4, 22: 6, 23: 5, 24: 9, 25: 5, 26: 6, 27: 10, 28: 6, 29: 5, 30: 4, 31: 12, 32: 7, 33: 7, 34: 7, 35: 7, 36: 5, 37: 5, 38: 4, 39: 3, 40: 5, 41: 2, 42: 2, 43: 1, 44: 2, 45: 2, 46: 2, 47: 7, 48: 6, 49: 7, 50: 7, 51: 8, 52: 7, 53: 9, 54: 8, 55: 8, 56: 1, 57: 4, 58: 7, 59: 13, 60: 1, 61: 1, 62: 1, 63: 1, 64: 1, 65: 1, 66: 9, 67: 9, 68: 11, 69: 10, 70: 7, 71: 10, 72: 9, 73: 11, 74: 5, 75: 6, 76: 7, 77: 8, 78: 5, 79: 6, 80: 5, 81: 3, 82: 11, 83: 9, 84: 10, 85: 2, 86: 10, 87: 7, 88: 12, 89: 15, 90: 12, 91: 13, 92: 1, 93: 7, 94: 20, 95: 16, 96: 6, 97: 6, 98: 6, 99: 6})');
var buildLevelMap = {13:5, 14: 1, 19:0, 34: 1, 40: 0, 51:0, 67: 0};
var Holder = (function() {
    
    var actualConstructor = function() {
        this.currentHost = '';
        this.playerName = '';
        this.isMinMenu = false;
        this.buildingInProgress = false;
        this.cities = null;
        arguments.callee.instances.push(this);
    }
    actualConstructor.instances = [];
    return actualConstructor;
}
             )();

Holder.prototype.setTownPanel = function(panel) {
    this.townPanel = panel;
}

Holder.prototype.updateTownPanel = function() {
    this.townPanel.caption.text = ' Города (' + getArrayCount(this.townInfo) + ')';
    this.townPanel.updateCaption();
    this.townPanel.renderContent(this);
}

Holder.prototype.collectPageInfo = function() {
    
    // имя игрока из заголовка страницы
    playerName = document.title.split('—')[1].trim();
    currentHost = location.host;
    isMinMenu = _getValue('isMinMenu', false);
    
    this.cities = _deserialize(_getValue('cities', '{ current: null, list: [] }'));
    // собираем инфу о городах игрока: название, координаты, id
    //  cities = { current: null, list: [] };
    // ищем select со списком городов (по аттрибуту name)
    var items = $x("//div[@id='town_select']/div[contains(@class, 'iteml1')]");
    for (var i in items) {
        var s = items[i].innerHTML;
        var id = items[i].getAttribute('value');
        if (!this.cities.list[i])
            this.cities.list[i] = {};
        
        this.cities.list[i].id = id;
        this.cities.list[i].name = s.trim();
        if (items[i].getAttribute('class').indexOf('iteml1_hover') != -1)
            this.cities.current = i;
    }
    // ищем строительство
    
    if (!this.cities.list[this.cities.current].building)
        this.cities.list[this.cities.current].building = {};
    this.cities.list[this.cities.current].building.at = new Date().getTime();
    
    if (document.location.href.indexOf('town') != -1) {
        this.buildingInProgress = $q('buildp') != null;
        if (this.buildingInProgress) {
            if (!this.cities.list[this.cities.current].building.item)
                this.cities.list[this.cities.current].building.item = {};
            var b = $x("//div[@class='task_b' or @class='task_d']/a[contains(@href,'build?pos=')]");
            if (b.length > 0) {
                var sid = parseInt(b[0].href.match(/pos=(\d+)/)[1]);
                var s = $x("//div[@class='task_b']/div[@class='task_desc']/b");
                var d = $x("//div[@class='task_d']/div[@class='task_desc']/b");
                if (s.length > 0) { //здание строится
                    var shtml = s[0].innerHTML;
                    // обновить информацию
                    this.cities.list[this.cities.current].building.item.caption = shtml.substring(0, shtml.indexOf('<br>'));
                    this.cities.list[this.cities.current].building.item.level = parseInt(shtml.substring(shtml.indexOf('—') + 2, shtml.length));
                    this.cities.list[this.cities.current].building.item.sid = sid;
                } else if (d.length > 0) { //здание разрушается
                    var shtml = d[0].innerHTML;
                    // обновить информацию
                    this.cities.list[this.cities.current].building.item.caption = shtml.substring(0, shtml.indexOf('<br>'));
                    this.cities.list[this.cities.current].building.item.level = parseInt(shtml.substring(shtml.indexOf('—') + 2, shtml.length));
                    this.cities.list[this.cities.current].building.item.sid = sid;
                }
                    }
            var btime = $q('buildt').innerHTML;
            if (btime) {
                var s2 = btime.match(/\>(\d+)\</);
                if (s2 && s2[1])
                    btime = s2[1];
                this.cities.list[this.cities.current].building.item.time = 1000 * parseInt(btime);
            }
            var bprogress = $q('buildp').innerHTML;
            if (bprogress) {
                var s2 = bprogress.match(/\>(\d+)\</);
                if (s2 && s2[1])
                    bprogress = s2[1];
                this.cities.list[this.cities.current].building.item.progress = 1000 * parseInt(bprogress);
            }
        } else
            this.cities.list[this.cities.current].building.item = null;
    }
    
    _setValue('cities', _serialize(this.cities));
}

Holder.prototype.injectTownInfo = function() {
    this.townInfo = _deserialize(_getValue('townlist', '{}'));
    if (document.location.href.indexOf('mapinfo?o=') == -1 && document.location.href.indexOf('mapinfo?x=') == -1)
        return;
    // вставляем div с инфой и командами под ссылками
    
    var form = $x("//form[@action='postmessage' and @method='post']");
    
    if (form.length == 0) {
        return;
    }
    
    var tid = -1;
    var data = $x("//div[@class='pagetitle']/div");
    //тут, видимо был блок, который удалялся.
    //data = data[0].innerHTML.match(/^(.*)\((.*)\)$/);
    //старый трим не робит, дергаем контекстом
    var tname = data[0].textContent.trim();
    //_log(tname);
    //тут я так понял надо дергать ссылку на город
    //нет, все-таки на местность
    tid = data[1].textContent.split(' ')[0];
    // _log(tid);
    data = $x("//div[@class='inf_t_l_b2']/dl/dd/a[contains(@href, 'account?id=')]");
    var pid = data[0].href.match(/id=(\d+)/)[1];
    var pname = data[0].innerHTML.trim();
    var country = null;
    data = $x("//div[@class='inf_t_l_b2']/dl/dd/a[contains(@href, 'countryinfo?id=')]");
    if (data.length == 1) {
        country = { id: data[0].href.match(/id=(\d+)/)[1], name: data[0].innerHTML.trim() };
    } else {
        country = { id: -1, name: 'В стране не состоит' };
    }
    
    var popdate = new Date().getTime();
    
    var popvalue = 0;
    var tclimate = '';
    var trelief = '';
    var trace = '';
    
    data = $x("//div[@class='inf_t_l_b2']/dl/dd/img[contains(@class, 'res')]");
    if (data.length > 0) {
        popvalue = parseInt(data[0].parentNode.lastChild.nodeValue);
    }
    /*
     var i=0;
     while (i <data.length) {
     var o = data[i].innerHTML;
     i++;
     if(!data[i-1].nextSibling)
     continue;
     var o1 = data[i-1].nextSibling.innerHTML;

     if (o && o1) {
     if (o.indexOf('Население') != -1) {
     _log("data: " + o1);
     popvalue = parseInt(o1.substring(0, o1.indexOf('<img')));
     } else if (o.indexOf('Климат') != -1)
     tclimate = o1;
     else if (o.indexOf('Рельеф') != -1)
     trelief = o1;
     else if (o.indexOf('Раса') != -1)
     trace = o1;
     }
     }
     */
    var town = {id: tid, name: tname, climate: tclimate, relief: trelief, race: trace,
                player: { id: pid, name: pname },
                country: country,
                pop: [
                    {date: popdate, value: popvalue}
                ]};
    
    // втавка панельки
    form = form[0];
    
    var inner = '<a id="townadd" href="javascript: void(0)">Добавить/обновить город</a>';
    /*
    inner += '<br/><a id="playeradd" href="javascript: void(0)">Добавить игрока во враги</a>';
    if (town.country.id > -1) {
        inner += '<br/><a id="countryadd" href="javascript: void(0)">Добавить страну во враги</a>';
    }
*/
    
    if (this.townInfo[town.id]) {
        var t = this.townInfo[town.id];
        var s2 = '';
        if (t.pop.length > 0) {
            var j = t.pop.length - 1;
            while (j >= 0) {
                if (!t.pop[j]) {
                    j--;
                    continue;
                }
                var d = new Date(t.pop[j].date);
                if (s2.length > 0)
                    s2 += ', ';
                s2 += t.pop[j].value + '<sub>' + d.format('dd.mm hh:nn') + '</sub>';
                j--;
            }
        }
        else
            s2 = '-';
        
        var d = new Date(popdate);
        s2 = '<b>' + popvalue + '<sub>' + d.format('dd.mm hh:nn') + '</sub></b>, ' + s2;
        inner += '<br /><br />' + s2;
    }
    
    var elem = $e('div', inner, { id: 'towndiv' });
    var infDiv = $c("inf_line")[0];
    infDiv.parentNode.insertBefore(elem, infDiv.nextSibling);
    
    $q('townadd').addEventListener('click', clickAddTown(town, this), false);
    /*
    $q('playeradd').addEventListener('click', this.clickAddPlayer(town.player), false);
    if (town.country.id > -1) {
        $q('countryadd').addEventListener('click', this.clickAddCountry(town.country), false);
    }
*/
    
}

function clickAddTown(town, holder) {
    return function () {
        if (holder.townInfo[town.id]) {
            var found = false;
            for (var i in holder.townInfo[town.id].pop) {
                var p = holder.townInfo[town.id].pop[i];
                if (Math.abs(town.pop[0].date - p.date) <= 60 * 1000) {
                    found = true;
                    p.date = town.pop[0].date;
                    p.value = town.pop[0].value;
                    break;
                }
            }
            if (!found)
                holder.townInfo[town.id].pop.push(town.pop[0]);
            holder.townInfo[town.id].country = town.country;
            holder.townInfo[town.id].name = town.name;
        } else {
            holder.townInfo[town.id] = town;
        }
        holder.saveTownInfo();
        holder.updateTownPanel();
    }
}

/*
Holder.prototype.clickAddPlayer = function(player) {
    return function () {
        if (holder.enemyInfo.players[player.id] != player.name) {
            holder.enemyInfo.players[player.id] = player.name;
        }
    }
}

Holder.prototype.clickAddCountry = function(country) {
    return function () {
        if (holder.enemyInfo.countries[country.id] != country.name) {
            holder.enemyInfo.countries[country.id] = country.name;
        }
    }
}
*/

Holder.prototype.saveTownInfo = function() {
    _setValue('townlist', _serialize(this.townInfo));
}


var Panel = (function() {
    
    var Pane = function(id, left, top) {
        this.id = id + 'pane';
        this.leftKey = id + 'pane_left';
        this.topKey = id + 'pane_top';
        this.left = left || '10px';
        this.top = top || (160 + 50 * panelCount) + 'px';
    }
    Pane.prototype.className = 'pane';
    
    var Title = function(id, normalBackground, alertBackground) {
        this.id = id + 'panetitle';
        this.normalBackground = normalBackground || '#90DD43';
        this.alertBackground = alertBackground || 'red';
        __addStyle('#' + id + 'pane { z-index: ' + (3030 - panelCount * 5) + '; background-color: ' + this.normalBackground + ';}');
    }
    Title.prototype.className = 'panetitle';
    
    var Button = function(id, imageIndex) {
        this.id = id + 'panebutton';
        this.image = imageList[0];
    }
    Button.prototype.className = 'panebutton';
    
    var Caption = function(id, text) {
        this.id = id + 'panecaption';
        this.text = text ? text : 'Тоже панель';
    }
    Caption.prototype.className = 'panecaption';
    
    var Content = function(id) {
        this.id = id + 'panecontent';
        this.visibleKey = id + 'pane_visible';
        this.visible = _getValue(this.visibleKey, false);
        this.text = 'Пусто';
    }
    Content.prototype.className = 'panecontent';
    
    var panelCss = '.pane { border: 2px groove black; \
position: absolute; padding: 5px 5px; -moz-border-radius: 5px; } \
.panebutton img { vertical-align: middle; } \
.panetitle { cursor: move; text-align: left; vertical-align: middle; \
padding: 1px 1px; } \
.panecaption { vertical-align: middle; \
white-space: nowrap; color:#000000; } \
.panecontent { padding: 2px 0px; text-align: left; } \
.panecontent div { padding: 0px 0px; text-align: left; font-size: 80%; } \
#towndiv { padding: 5px 5px; background-color: #ffff66; } \
.towns { border: 1px solid #999966; padding: 0px 0px;  font-size: 80%; \
max-width: 500px;} \
.towns tr, .towns td { border: 1px solid #999966; padding: 0px 0px; color: #000000; } \
.towns td img { height: 16px; width: 16px; vertical-align: middle; } \
.tactics { font-size: 80%; } \
.tactics, .tactics tr, .tactics td { border-style: none; color:#000} \
.trainTable { border:1px solid #000000;} \
.trainTable td {text-align:center; border-left:1px solid #000000; color: #000000} \
.tradeTable { border:1px solid #000000;} \
.tradeTable td { text-align:center; border-left:1px solid #000000; border-top:1px solid #000000; color: #000000} \
'
__addStyle(panelCss);
    
    var panelCount = 0;
    var actualConstructor = function (id, caption, normalBackground, alertBackground) {
        this.pane = new Pane(id);
        this.title = new Title(id, normalBackground, alertBackground);
        this.button = new Button(id, 0);
        this.caption = new Caption(id, caption);
        this.content = new Content(id);
        arguments.callee.instances.push(this);
        panelCount++;
    }
    actualConstructor.instances = [];
    return actualConstructor;
})();

Panel.prototype.updateCaption = function() {
    $q(this.caption.id).innerHTML = (this.content.visible || !isMinMenu) ? this.caption.text : '';
}

Panel.prototype.action = function(render) {
    //_log('reder=' + render + ' ' + this.content.visibleKey + ':' + this.content.visible);
    !render && (this.content.visible = !this.content.visible);
    this.updateCaption();
    var content = $q(this.content.id);
    var button = $q(this.button.id);
    if (this.content.visible) {
        content.style.display = '';
        button.setAttribute('title', 'Спрятать');
        //_log(this.content.visibleKey + ':' + this.content.visible);
    }
    else {
        content.style.display = 'none';
        button.setAttribute('title', 'Показать');
    }
    _setValue(this.content.visibleKey, this.content.visible);
}

Panel.prototype.render = function() {
    var inner = [];
    inner.push('<div id="');
    inner.push(this.title.id);
    inner.push('" class="');
    inner.push(this.title.className);
    inner.push('">');
    inner.push('<a id="');
    inner.push(this.button.id);
    inner.push('" class="');
    inner.push(this.button.className);
    inner.push('" href="javascript: void(0)"><img src="');
    inner.push(this.button.image);
    inner.push('" /></a>');
    inner.push('<span id="');
    inner.push(this.caption.id);
    inner.push('" class="');
    inner.push(this.caption.className);
    inner.push('">');
    inner.push('</span></div><div id="');
    inner.push(this.content.id);
    inner.push('" class="');
    inner.push(this.content.className);
    inner.push(' " style="display:none" >');
    inner.push(this.content.text);
    inner.push('</div>');
    var element = $e('div', inner.join(''), {id: this.pane.id},
                     {left: this.pane.left,top: this.pane.top}, document.body);
    element.className = this.pane.className;
    this.updateCaption();
    $q(this.button.id).addEventListener('click', bindMethod(this, this.action), false);
    
    
    _setValue(this.content.visibleKey, this.content.visible);
    
    function bindMethod(o, f) {
        return function() {
            return f.apply(o);
        }
    }
}

Panel.prototype.renderContent = function(holder) {
    
}


function onUSLoad() {
    
    function correctUI() {
        var unitbtn = $x("//div[@class='tunit_btns']");
        for (var i in unitbtn) {
            unitbtn[i].style.padding = '3px 92px 25px';
        }
    }
    
    if (document.body.innerHTML.length == 0) {
        // С 10.10.2009
        // Ошибка на сервере или ещё почему страничка не загружена
        // пробуем рефрешить её через 30-60 сек
        document.body.innerHTML = 'О-о! Ошибка при загрузке страницы. \
Возможно, на сервере технические работы или проблемы с каналом Интернет. \
Попытка обновления начнётся автоматически через 30..60 секунд...';
        
        var tid = window.setInterval(function() {
            location.href = document.URL;
        }, (20 + getRandomInt(10, 40)) * 1000);
        
        return;
    }
    _log('loading...');
    var holder = new Holder();
    try {
        holder.collectPageInfo();
    } catch (e) {
        _log(e);
    }
    
    /* стили панелек
     #tradepane { z-index: 3040; background-color: #99ccff; } \
     #buildpane { z-index: 3030; background-color: #ffcc33; } \
     #trainpane { z-index: 3025; background-color: #1C9205; } \
     #citypane { z-index: 3020; background-color: #ffff66; } \
     #mappane { z-index: 3010; background-color: #efefef; } \
     #enemypane {z-index: 3005; background-color: #ffffff; }\
     #pane { z-index: 3000; background-color: #90DD43; } \
     */
    var trade = new Panel('trade', ' Торговля', '#99ccff');
    
    trade.renderContent = function(holder) {
        var text = '<table class="tradeTable"><tr><td>N</td><td>Операция</td><td>Товар</td><td>Время</td></tr>';
        
        for (var i in holder.cities.list) {
            
            var c = holder.cities.list[i];
            var s = c.name;
            if ((document.location.href.indexOf("market") != -1 || document.location.href.indexOf("town") != -1)  && wofh.town.id == c.id) {
                //_log(c);
                c.traders = {};
                c.traders.total = wofh.town.trade.traders.count;
                c.traders.market = wofh.town.trade.traders.reserve;
                if (wofh.events != null) {
                    var result = 0;
                    wofh.events.forEach(function(entry) {
                        switch(entry.event) {
                            case 108:
                            case 109:
                            case 111:
                                if (c.id == entry.town1)
                                    result += parseInt(entry.data.split(',')[1].split(':')[1]);
                                break;
                        }
                    });
                    c.traders.free = c.traders.total - result;
                } else {
                    c.traders.free = c.traders.total-wofh.town.trade.traders.busy;
                }
                holder.cities.list[i].traders = c.traders;
                _setValue('cities', _serialize(holder.cities));
                
            }
            if (c.traders) {
                s += ' (' + c.traders.free + '/' + c.traders.market + '/' + c.traders.total + ')';
            }
            if (i == holder.cities.current)
                s = '<b>' + s + '</b>';
            s = '<a href="http://' + currentHost + '/town?tid=' + c.id + '">' + s + '</a>';
            s += ' <a href="http://' + currentHost + '/market?target=' + holder.cities.list[i].id + '#send'
            + '"><img title="Транспортировать ресурсы" class="ibut ib2" src="/p/spacer.gif"></a>';
            s += '  <a href="http://' + currentHost + '/market?target=' + holder.cities.list[i].id + '#stream&info'
            + '"><img title="Начать снабжение ресурсами" class="ibut ib3" src="/p/spacer.gif"></a>'
            s = '<tr><td colspan="4">' + s + '</td></tr>';
            /*
            var num = 1;
            if (wofh.events != null) {
            wofh.events.forEach(function(entry) {
                        switch(entry.event) {
                            case 108:
                            case 109:
                                    _log("o");
                                    s += '<tr><td>';
                                    s += num;
                                    s += '</td><td>';
                                    s += entry.data.split(',')[1].split(':')[0];
                                    s += '</td><td>';
                                    s += utils.parseResString(entry.data.split(',')[0].split(':')[1]);
                                    s += '</td><td>';
                                    s += '<span id="op_' + i + '_' + num + '" >' + new Date(entry.time - new Date().getTime()).formatTime() + '</span>';
                                    s += '</td></tr>';
                                    num++;

                                break;
                        }
                });
            }
            */
            text += s;
        }
        $q(this.content.id).innerHTML = text;
    }
    var build = new Panel('build', ' Строения', '#FFCC33');
    
    build.renderContent = function(holder) {
        var text = '';
        for (var i in holder.cities.list) {
            var c = holder.cities.list[i];
            var s = c.name;
            if (i == holder.cities.current)
                s = '<b>' + s + '</b>';
            s = '<a href="' + applyTidToUri(c.id, 'town?', true) + '">' + s + '</a>';
            s = '<td>' + s + '</td><td>';
            
            if (c.building) {
                s += '(' + (new Date(c.building.at)).format('hh:nn:ss') + ') ';
                var item = c.building.item;
                if (item == null)
                    s += 'Ничего не строится'
                    else {
                        // _log('showBuilding: '+c.building.toSource());
                        var complete = c.building.at + item.time - item.progress;
                        s += ' <a href="' + applyTidToUri(c.id, 'build?pos=' + item.sid) + '">' + item.caption + ' x' + item.level + '</a> в ' + (new Date(complete)).format('hh:nn:ss');
                    }
            }
            else
                s += ' Нет информации';
            s += '</td>';
            text += '<tr>' + s + '</tr>';
        }
        text += '<tr><td><a id="show_build" href="javascript:void(0)">Рассчитать прочность города</a></td><td></td></tr>';
        
        $q(this.content.id).innerHTML = '<table class="tactics" cellpadding="0" cellspacing="0">' + text + '</table>';
        $q('show_build').addEventListener('click', buildingInfo(), false);
        
    }
    
    var train = new Panel('train', ' Тренировка', '#90DD43');
    
    train.renderContent = function(holder) {
        var text = '';
        for (var ci in holder.cities.list) {
            var c = holder.cities.list[ci];
            var s = c.name;
            if (ci == holder.cities.current)
                s = '<b>' + s + '</b>';
            s = '<a href="' + applyTidToUri(c.id, 'town?', true) + '">' + s + '</a>';
            s = '<td>' + s + '&nbsp;</td><td>';
            //
            s += '<table class="trainTable" >';
            s += '<tr>';
            
            //Динамическая секция по всем строениям
            var trInfoArr = holder.cities.list[ci].train;
            for (var i in trInfoArr) {
                if (trInfoArr[i]) {
                    s += '<td>&nbsp;<a href="' + applyTidToUri(c.id, 'http://' + currentHost + '/build?pos=' + i) + '">' + trInfoArr[i].building + ' x' + trInfoArr[i].level + '</a>&nbsp;</td>';
                }
            }
            s += '</tr><tr>';
            for (var i in trInfoArr) {
                if (trInfoArr[i]) {
                    if (trInfoArr[i].unitId > -1) {
                        s += '<td><img src="p/spacer.gif" class="unit u' + trInfoArr[i].unitId + '"> (' + trInfoArr[i].unitCount + ')</td>';
                    } else {
                        s += '<td>&nbsp;</td>';
                    }
                }
            }
            s += '</tr><tr>';
            for (var i in trInfoArr) {
                if (trInfoArr[i]) {
                    if (trInfoArr[i].timeEnd) {
                        s += '<td>&nbsp;<span id="tr_' + ci + '_' + i + '" >' + new Date(trInfoArr[i].timeEnd - new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000).formatTime() + '</span>&nbsp;';
                    } else
                        s += '<td>&nbsp;';
                    s += '<div style="display:inline; font-size:100%; padding-left:20px"><a style="color:red" id="rm_' + ci + '_' + i + '" href="javascript:void(0);">X</a></div></td>';
                }
            }
            // -- конец
            
            s += '</tr></table>';
            s += '</td>';
            text += '<tr>' + s + '</tr>';
            
        }
        text += '<tr><td><a id="clean_end_train" href="javascript:void(0)">Очистить построенные</a></td><td></td></tr>'
        text = '<table class="tactics" >' + text + '</table>';
        $q(this.content.id).innerHTML = text;
        for (var ci in holder.cities.list) {
            var trInfoArr = holder.cities.list[ci].train;
            for (var i in trInfoArr) {
                if (trInfoArr[i]) {
                    $q('rm_' + ci + '_' + i).addEventListener('click', onRemoveTrainBox(ci, i, holder, this), false);
                }
            }
        }
        $q('clean_end_train').addEventListener('click', onCleanEndTrain(holder, this), false);
    }
    
    var city = new Panel('city', ' Города', '#ffff66');
    
    city.renderContent = function(holder) {
        this.caption.text = ' Города (' + getArrayCount(holder.townInfo) + ')';
        //$q(desc.caption.id).innerHTML = s;
        var s = '<tr><td>ID/X/Y</td><td>Город</td><td>Игрок</td><td>Население</td><td>-</td></tr>';
        for (var i in holder.townInfo) {
            var t = holder.townInfo[i];
            var ti = getTownView(i, holder);
            var cn = '';
            if (t.country)
                cn = ', ' + t.country.name;
            s += '<tr>';
            s += '<td><a id="tgom' + i + '" href="javascript: void(0)" title="Свернуть и перейти на карту">' + t.id + '</a></td>';
            s += '<td><a id="tgot' + i + '" href="javascript: void(0)" title="Свернуть и перейти на город">' + t.name + '</a> <a id="tdelc' + i + '" href="javascript: void(0)" title="Удалить город из списка"><img src="' + imageList[3] + '"></a> <a id="tmapc' + i + '" class="lbl" href="javascript: void(0)" title="' + ti.hint + ', переключить видимость">' + ti.caption + '</a></td>';
            s += '<td><a id="tgop' + i + '" href="javascript: void(0)" title="Свернуть и перейти на игрока">' + t.player.name + cn + '</a></td>';
            s += '<td>';
            
            var s2 = '';
            if (t.pop.length > 0) {
                var j = t.pop.length - 1;
                while (j >= 0) {
                    if (!t.pop[j]) {
                        j--;
                        continue;
                    }
                    var d = new Date(t.pop[j].date);
                    if (s2.length > 0)
                        s2 += '<br />';
                    var aPop = t.pop[j].value;
                    if (s2.length == 0)
                        aPop = '<b>' + aPop + '</b>';
                    s2 += aPop;
                    s2 += '<sub>' + d.format('dd.mm hh:nn') + '</sub>';
                    s2 += ' <a id="tdelp' + i + j + '" href="javascript: void(0)" title="Удалить население из списка"><img src="' + imageList[3] + '"></a>';
                    j--;
                }
            }
            else
                s2 = '-';
            s += s2;
            s += '</td>';
            s += '<td>-</td>';
            s += '</tr>';
        }
        $q(this.content.id).innerHTML = '<table class="towns" cellpadding="0" cellspacing="0"><tbody>' + s + '</tbody></table>';
        for (var i in holder.townInfo) {                
            var t = holder.townInfo[i];
            $q('tgom' + i).addEventListener('click', onShowMap(t.id, this), false);
            $q('tgot' + i).addEventListener('click', onShowTown(t.id, this), false);
            $q('tgop' + i).addEventListener('click', onShowPlayer(t.player.id, this), false);
            $q('tdelc' + i).addEventListener('click', onDelTown(t.id, holder), false);
            $q('tmapc' + i).addEventListener('click', onChangeViewTown(t.id, holder), false); // на карте
            if (t.pop.length > 0) {
                var j = t.pop.length - 1;
                while (j >= 0) {
                    $q('tdelp' + i + j).addEventListener('click', onDelPop(t.id, j, holder), false);
                    j--;
                }
            }
        }
    }
    /*
    var enemy = new Panel('enemy', ' Враги', '#ffffff');
*/    
    
    if (!$q('settingspane')) {
        __addStyle('#settingspane a { color:#ffffff;}');
        var sett = new Panel('settings', 'Min', '#000000');
        // поднял выше        
        sett.pane.top = '360px';
        
        sett.action = function(render) {
            if (render)
                return;
            isMinMenu = !isMinMenu;
            _setValue('isMinMenu', isMinMenu)
            for (var i in Panel.instances)
                Panel.instances[i].updateCaption();
        };
        
        sett.updateCaption = function() {
            $q(this.button.id).innerHTML = (isMinMenu ? 'Max' : 'Min');
        }
    } else {
        var action = function() {
            isMinMenu = !isMinMenu;
            for (var i in Panel.instances)
                Panel.instances[i].updateCaption();
            
        };
        $q('settingspanebutton').addEventListener('click', action, false);
    }
    
    holder.setTownPanel(city);
    holder.injectTownInfo();
    
    for (var i in Panel.instances) {
        Panel.instances[i].render();
        try {
            Panel.instances[i].renderContent(holder);
        } catch (e) {
            _log(e);
        }
        Panel.instances[i].action(true);
    }
    
    //применить цветовую раскраску
    try {
        resourceColorer();
    } catch(e) {
        _log(e);
    }
    //распознаем транспортировку ресов
    if (document.location.href.indexOf('market') != -1){
        injectCityListInTrade(holder);
        injectTradeOps(holder);
        
    }
    //распознаем отправку войск
    if (document.location.href.indexOf('getarmy') != -1) {
        injectCities($x("//form[@action='getarmy']/p"), 'DIV', holder);
        injectArmySpeed();
    }
    //распознаем отзыв подкрепления
    if (document.location.href.indexOf('turnout?home') !=-1) {
        injectArmySpeed();
    }
    // Распознаем форму тренировки войск
    /*
    if (document.location.href.indexOf('trainpage') != -1 || document.location.href.indexOf('build?pos=') != -1) {
        trameTimeCalculate();
        collectTrainInfo(holder, train);
    }
*/
    if (document.location.href.indexOf('town') != -1 || document.location.href.indexOf('build?pos=') != -1) {
        trameTimeCalculate();
        collectTrainInfo(holder, train);
    }
    
    
    if (document.location.href.indexOf('account?id=') != -1) {
        parseCityListPage();
    }
    
    if (document.location.href.indexOf('map') != -1) {
        parseMapPage();
        var allPlayerCitiesHolder = _deserialize(_getValue("all_player_cities_holder", '{}'));
        var cities = _deserialize(_getValue('cities', '{ current: null, list: [] }'));
        var baseCoords = allPlayerCitiesHolder[cities.list[cities.current].id];
        if (baseCoords) {
            var linkDiv = $x("//div[@id='map_all']/div[contains(@style, 'position:absolute')]")[0];
            $e('DIV', '<a id="inf_tt_ico" class="a_osn_yes"></a>', {id:'inf_tt_ico_a'}, null, linkDiv);
            document.getElementById('inf_tt_ico_a').addEventListener('click', switchMapHelp);
        }
        $x("//div[@id='landlnks']")[0].addEventListener("DOMNodeInserted", onMapDivNodeInserted, false);
    }
    
    //распознаем форму Экономики города
    if (document.location.href.indexOf('economics') != -1) {
        injectEconomicCalc(holder);
    }
    
    
    if (document.location.href.indexOf('market?stream') != -1) {
        injectTPCities();
        streamSort();
    }
    /*
    if (document.location.href.indexOf('buildinfo?id=') != -1) {
        parseBuildingInfo();
    }
*/
    if (document.location.href.indexOf('countryinfo') !=-1) {
        var players = $x("//table[@class='def_table players']/tbody/tr/td/a[@class='ulink0']");
        var line = "";
        for (var i in players) {
            line += players[i].innerHTML + '|';
        }
        _log(line);
    }
    /*
    if (document.location.href.indexOf('town') != -1) {
        var blocks = $x("//div[contains(@style,'/p/if/stone/sh_sl.png')]");
        if (blocks.length == 0) {
            $e('DIV', null, {id: 'en_build_info_panel'}, {cursor:'pointer', background: 'url(/p/if/stone/sh_sl.png)', position: 'absolute', left: '-7px', top:'444px', zIndex:10000, width:'29px', height:'26px'}, $x("//div[@class='balka2_ balka2_p1']/div[@id='cont04']")[0]);
            $q('en_build_info_panel').addEventListener('click', changeBuildPanelView(), false);
        }
    }

    if (_getValue('build_info_panel', false) && document.location.href.indexOf('town') != -1) {
        addBuildInfoPanel();
    }
*/
    
    if ((document.location.href.indexOf('market') != -1 || document.location.href.indexOf('trade') != -1) && document.location.href.indexOf('adv') != -1 && document.location.href.indexOf('buy') != -1) {
        injectAdvTrade();
        $x("//table[contains(@class, 'trade_table')]")[0].addEventListener("DOMNodeInserted", onTradeTableNodeInserted, false);
    }
    
    applyHelpToBuildings();
    
    trainTimer(holder, train);
    var help_div = document.createElement('DIV');
    help_div.id = 'help_div';
    help_div.style.position = 'absolute';
    help_div.style.zIndex = 10000;
    help_div.style.border = '1px solid #333';
    help_div.style.backgroundColor = '#EEE';
    help_div.style.width = '190px';
    help_div.style.height = '180px';
    help_div.style.color = '#000';
    help_div.style.fontSize = '.8em';
    help_div.style.visibility = 'hidden';
    help_div.style.display = 'none';
    document.body.appendChild(help_div);
}


// common functions

//Применить цветовую раскраску к складу:
//фиолетовый - склад заполниться менее чем за 6 часов
//зеленый - склад опустеет более чем за 24 часа/склад заполняется
//оранжевый - склад опустеет менее чем через 24 часа но более чем за 12 часов
//бардовый - склад опустеет менее чем за 12 часов но более чем за 6 часов
//красный жирный - склад опустеет менее чем за 6 часов
//В диалоге постройки здания применить цвета к ресурсам, необходимым для постройки
//зеленый - ресурсов достаточно для постройки
//красный - ресурсов недостаточно для постройки
var arr = new Array();
function resourceColorer() {
    var lis = $x("//ul[@id='myres']/li");
    //Добавить информацию о максимальном количестве
    var capacity = null;
    for (var i in lis) {
        var cap = $x("./center/b/a/span[@id='storemax']", lis[i])[0];
        if (cap) {
            capacity = parseInt(cap.innerHTML);
            continue;
        }
        if (!capacity) continue;
        var i_nodes = $x("./i", lis[i]);
        if (i_nodes.length > 0 && i_nodes.length < 4) {
            i_nodes[1].parentNode.insertBefore($t("/"), i_nodes[1]);
            i_nodes[1].parentNode.insertBefore($e("i", capacity), i_nodes[1]);
        } else {
            i_nodes = $x("./img", lis[i]);
            if (i_nodes.length > 0) {
                i_nodes[0].parentNode.appendChild($t("/" + capacity));
            }
        }
    }
    for (var i in lis) {
        var imgs = $x("img", lis[i]);
        if (imgs.length == 0)
            continue;
        var resId = parseInt(imgs[0].className.substring(5, imgs[0].className.length));
        if (resId < 2)
            continue;
        var iss = $x("i", lis[i]);
        if (iss.length < 2) {
            var nodes = lis[i].childNodes;
            var txt = '';
            for (k in nodes) {
                if (nodes[k].nodeName == '#text') {
                    txt = txt + nodes[k].nodeValue;
                }
            }
            var art = txt.match(/(\d+)\/(\d+)/);
            if (art && art.length > 1)
                arr[resId] = parseInt(art[1]);
            else
                continue;
            imgs[0].title = imgs[0].title + ' - осталось места: ' + formatNumber(parseInt(art[2]) - parseInt(art[1]), 3);
            continue;
        }
        var nres = parseInt(iss[0].innerHTML);
        var nmax = parseInt(iss[1].innerHTML);
        imgs[0].title = imgs[0].title + ' - осталось места: ' + formatNumber(nmax - nres, 3);
        if (iss.length > 3) {
            var min = parseFloat(iss[2].innerHTML.substring(1));
            if (iss[2].innerHTML.indexOf('-') > -1) {
                if (min * 24 < nres) {
                    setColor(iss[0], iss[1], iss[2], 'green', nres / min);
                } else if (min * 12 < nres) {
                    setColor(iss[0], iss[1], iss[2], '#C27811', nres / min);
                } else if (min * 6 < nres) {
                    setColor(iss[0], iss[1], iss[2], '#A52A2A', nres/min);
                } else {
                    setColor(iss[0], iss[1], iss[2], 'red', nres/min);
                    applyBold(iss[0]);
                    applyBold(iss[1]);
                    applyBold(iss[2]);
                }
            } else if (iss[2].innerHTML.indexOf('+') > -1 ) {
                if (min * 6 + nres > nmax) {
                    setColor(iss[0], iss[1], iss[2], '#5D0EDC', (nmax-nres)/min);
                } else
                    setColor(iss[0], iss[1], iss[2], 'green', (nmax-nres)/min);
            }
                if (nres >= 100000) {
                    applyBold(iss[0]);
                }
        }
        arr[resId] = nres;
    }
    
    
    if (location.href.indexOf('build?pos=') > -1) {
        //раскрасить улучшение
        var fonts = $x("//div[@class='build_title']")
        for (var i in fonts)
            processNode(fonts[i], arr);
        //раскрасить перестройку
        fonts = $x("//div[@class='build_rebuild']/table/tbody/tr/td")
        for (var i in fonts)
            processNode(fonts[i], arr);
        //раскрасить список строительства
        var itms = $x("//div[@id='build_prc_cont']");
        for (var j in itms) {
            processNode(itms[j], arr);
        }
        
    }
    
    var nasI = $x("//div[@class='chcol2 chcol_p1']/div[@class='aC']/nobr/span");
    if (nasI && nasI.length > 0) {
        //расчитать время до макс. населения
        var nasCurr = parseFloat($x("./span", nasI[0])[0].innerHTML);
        var nasMax = parseFloat($x("./span", nasI[0])[1].innerHTML);
        var dt = $x("//div[@class='aC']/nobr")[1];
        var temp = parseFloat(dt.innerHTML.match(/(\d+.\d|\d+)/)[1]);
        var ttime = 0;
        if (temp > 0) {
            ttime = 24*(nasMax - nasCurr)/temp;
        }
        var clr = 'green';
        if (ttime < 0) {
            clr = 'red';
            ttime = -1*ttime;
        }
        var nobr = $e('nobr', null, null, null, $x("//div[@class='chcol2 chcol_p1']/div[@class='aC']")[0]);
        $e('span', '[' + Math.round(ttime*10)/10 + ']', null, {float: 'right', fontWeight: 'bold', color: clr}, nobr);
        
    }
    
}

function applyBold(iss) {
    iss.style.fontWeight='bold';
}

function processNode(node, arr) {
    var spans = $x("./span", node);
    for (var spi in spans) {
        var nd = spans[spi];
        var childs = nd.childNodes;
        var i = 0;
        while (i < childs.length) {
            var nod = childs[i];
            if (nod.nodeName == 'IMG') {
                var txt = nod.className.substring(5, nod.className.length)
                var colorSpan = document.createElement('SPAN');
                var val = parseInt(childs[i + 1].nodeValue);
                if (arr[parseInt(txt)] >= val)
                    colorSpan.style.color = 'green';
                else {
                    colorSpan.style.color = '#A52A2A';
                    nod.title = nod.title + ': Нехватает ' + formatNumber(val - arr[parseInt(txt)], 3);
                }
                colorSpan.style.fontWeight = 'bold';
                colorSpan.innerHTML = childs[i + 1].nodeValue;
                nd.removeChild(childs[i + 1]);
                nd.insertBefore(colorSpan, nod.nextSibling);
            }
            i++;
        }
    }
}

function setColor(el, el1, el2, clr, ttime){
    el.style.color = clr;
    el1.style.color = clr;
    el2.style.color = clr;
    var nfo = document.createElement('span');
    nfo.setAttribute('style', 'float:right;font-weight:bold; color:' + clr);
    nfo.innerHTML = '[' + Math.round(ttime * 10) / 10 + ']';
    el1.parentNode.appendChild(nfo);
}

function applyTidToUri(tid, url, notUsePrefix) {
    var s = document.location.href;
    if (url)
        s = url;
    var pref = '&';
    if (notUsePrefix)
        pref = '';
    if (s.indexOf('tid=') == -1)
        return s+pref+'tid='+tid;
    else
        return s.replace(/tid\=\d+/, 'tid='+tid);
}

function formatNumber(num, digits) {
    var snum = new String(num);
    var ln = snum.length;
    var fmtNum = '';
    for (var i=ln-1; i>=0; i--) {
        fmtNum = snum.charAt(i) + fmtNum;
        if (i > 0 && (ln - i) % digits == 0) {
            fmtNum = '.' + fmtNum;
        }
    }
    return fmtNum;
}

function injectCityListInTrade(holder) {
    //reformat cities in trade list to new format
    var pTrade = $x("//select[@name='id']/option", null);
    for (var i in pTrade) {
        if (pTrade[i].value)
            pTrade[i].value = pTrade[i].value;
        else
            pTrade[i].value = '0';
    }
    var sTrade = $x("//select[@name='id']", null)[0];
    sTrade.options[sTrade.options.length] = new Option('-----------------', '0');
    for (var i in holder.townInfo) {
        var town = holder.townInfo[i];
        if (town.view == 2 || town.view == 4) {
            var coords = parseCityCoordinats(town.id);
            sTrade.options[sTrade.options.length] = new Option(town.name, coords[0]);
        }
    }
    sTrade.removeAttribute('onchange');
    sTrade.addEventListener('change', changeTradeCoord, false);
}

function parseCityCoordinats(id) {
    var inf = id.match(/(\d+)\/(\d+)\/(\d+)/);
    if (inf && inf.length > 3) {
        return [inf[1], inf[2], inf[3]];
    }
    inf = id.match(/(\d+)\/(\d+)/);
    if (inf && inf.length > 2) {
        return [0, inf[1], inf[2]];
    }
}

function injectTPCities() {
    var tplinks = $x("//div[@class='tradeway_3_sh']/div/table[@class='def_table_cw']/tbody/tr/td/a[contains(@href, 'towninfo?id=')]");
    if (tplinks.length > 0) {
        var sel = $x("//select[@name='id']")[0];
        $e('OPTION', '------ТП------', {disabled:true, name: 'id', value: '0'}, null, sel);
        for (var i in tplinks) {
            var id = parseInt(tplinks[i].href.match(/id=(\d+)/)[1]);
            $e('OPTION', tplinks[i].innerHTML, {name: 'id', value:id},null, sel);
        }
    }
}

function injectArmySpeed() {
    var armyTd = $x("//table[@id='armyetable']/tbody/tr/td");
    for (var i in armyTd) {
        var id = parseInt($x("./a", armyTd[i])[0].href.match(/id=(\d+)/)[1]);
        $e('TD', '<img class="icnu ic8" src="/p/_.gif" title="Скорость">' + unitSpeedHolder[id], null, null, armyTd[i].parentNode);
    }
}

function injectCities(pTrade, container, holder) {
    var txt = '<select id="injCities" name="id" ><option value=""></option>';
    for (var ci in holder.cities.list) {
        var c = holder.cities.list[ci];
        txt +='<option value="' + c.id + '>'+ c.name + '</option>';
    }
    txt +='</select>';
    $e(container, txt, null, null, pTrade[0]);
    document.getElementById('injCities').addEventListener('change', changeTradeCoord, false);
    
}

function changeTradeCoord() {
    
    var tradeList = $x("//select[@name='id']", null)[0];  
    if (tradeList.selectedIndex != -1) {
        var id = tradeList.options[tradeList.selectedIndex].value;
        tradeList.value = id;
        //alert(tradeList.value);
        var fCity = false;
        if (document.location.href.indexOf("market") != -1) {
            for (var i=0; i < wofh.account.townsArr.length; i++) {
                //alert(wofh.account.townsArr[i].id);
                if (wofh.account.townsArr[i].id == id)
                    fCity = true;
            }
            
            if (fCity != true) {
                document.location = 'http://' + currentHost + '/market?target=' +id+ '#send';
            } else {
                fCity = false;
            }
        }
    }
    
    
}

function getTownView(id, holder) {
    var view = 0;
    if ('view' in holder.townInfo[id])
        view = holder.townInfo[id].view;
    var result = { caption: '?', hint: '' };
    switch (view) {
        case 0:
        default:
            result.caption = '-';
            result.hint = 'не показано';
            break;
        case 1:
            result.caption = 'М<img src="'+imageList[3+view]+'" />';
            result.hint = 'мой город';
            break;
        case 2:
            result.caption = 'С<img src="'+imageList[3+view]+'" />';
            result.hint = 'участник страны';
            break;
        case 3:
            result.caption = 'К<img src="'+imageList[3+view]+'" />';
            result.hint = 'кормушка';
            break;
        case 4:
            result.caption = 'Д<img src="'+imageList[3+view]+'" />';
            result.hint = 'друг';
            break;
        case 5:
            result.caption = 'В<img src="'+imageList[3+view]+'" />';
            result.hint = 'враг';
            break;
    }
    return result;
}

function onShowMap(id, cityPanel){
    return function(){
        try {
            cityPanel.action();
            var inf = parseCityCoordinats(id);
            location.href = 'http://' + currentHost + '/map?o=' + inf[0] + '&x=' + inf[1] + '&y=' + inf[2];
        } catch (e) {
            _log(e);
        }
    }
}

function onShowTown(id, cityPanel){
    return function(){
        cityPanel.action();
        var inf = parseCityCoordinats(id);
        location.href = 'http://' + currentHost + '/mapinfo?o=' + inf[0] + '&x=' + inf[1] + '&y=' + inf[2];
    }
}

function onShowPlayer(id, cityPanel){
    return function(){
        cityPanel.action();
        location.href = 'http://' + currentHost + '/account?id=' + id;
    }
}

function onDelTown(id, holder){
    return function(){
        // удаляем элемент
        delete holder.townInfo[id];
        holder.saveTownInfo();
        holder.updateTownPanel();
    }
}


function onChangeViewTown(id, holder) {
    return function(){
        // меняем видимость
        var view = 0;
        if ('view' in holder.townInfo[id])
            view = holder.townInfo[id].view;
        view++;
        if (view > 5)
            view = 0;
        holder.townInfo[id].view = view;
        
        holder.saveTownInfo();
        holder.updateTownPanel();
    }
}

function onDelPop(id, item, holder){
    return function(){
        // удаляем элемент
        holder.townInfo[id].pop.splice(item, 1);
        holder.saveTownInfo();
        holder.updateTownPanel();
    }
}

function getArrayCount(arr) {
    var result = 0;
    for (var i in arr)
        result++;
    return result;
}

function injectTradeOps(holder) {
    if (wofh.town.trade.traders.busy > 0) {
        holder.cities.list[holder.cities.current].traders.total = wofh.town.trade.traders.count;
        holder.cities.list[holder.cities.current].traders.free =  wofh.town.trade.traders.count - wofh.town.trade.traders.busy;
        holder.cities.list[holder.cities.current].traders.market = wofh.town.trade.traders.reserve;
        _setValue('cities', _serialize(holder.cities));
    }
    var tradeContainer = new TradeContainer(holder.cities.list[holder.cities.current].traders.free * 250);
    tradeContainer.init();
}


//К форме тренировки войск добавляется количество юнитов, которое можно создать в течении суток
// напр. Требушет  [Пища] 100 [Древесина] 600 [Металл] 100 [Житель] 5  5:47:13(4.1)
function trameTimeCalculate() {
    var armyTd = $x("//form[@action='train']/div/div/table/tbody/tr/td[@class='utm']/span");
    for (var i in armyTd) {
        var txt = armyTd[i].innerHTML;
        var radio_id = $x("./td[@class='urd']/input", armyTd[i].parentNode.parentNode)[0].getAttribute('id');
        var input_id = $x("./div[@class='tunit_btns']/div[@class='cnt']/input", armyTd[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode)[0].getAttribute('id');
        armyTd[i].innerHTML = txt + "<a href=\"javascript:void(0)\" id=\"setup_" + i + "\">[" + calcTime(txt) + "]</a>";
        document.getElementById('setup_' + i).addEventListener('click', setTraneCount(radio_id, input_id, Math.round(calcTime(txt)), false));
    }
}

function setTraneCount(radio_id, input_id, count) {
    return function() {
        $q(radio_id).checked = true;
        $q(input_id).value = count;
        
        
        var evObj = document.createEvent('UIEvents');
        evObj.initUIEvent( 'keyup', true, true, window, 1 );
        evObj.keyCode = 13;
        $q(input_id).dispatchEvent(evObj);
    }
}

function calcTime(str) {
    var tm = str.split(':');
    var tm1 = tm[1];
    if (tm1.indexOf('0') == 0) {
        tm1 = tm1.substring(1,tm1.length);
    }
    var tt = parseInt(tm[0])*60*60 + parseInt(tm1)*60 + parseInt(tm[2]);
    return Math.round(24*60*60/tt*10)/10;
}

function collectTrainInfo(holder, panel) {
    var timeToFinish;
    
    
    holder.cities.list[holder.cities.current].train = {};
    if (document.location.href.indexOf('town') != -1 || document.location.href.indexOf('build?pos=') != -1) {
        for (var i=0; i < wofh.town.events.items.length; i++) {
            var event = wofh.town.events.items[i];
            
            if (event.cls.name == 'masstrn') {
                //_log(lib.units.list[event.data.unit].name);
                
                var trInfo = {};
                trInfo.building = lib.builds[wofh.town.build.slots[event.slot].id].name;
                trInfo.level = wofh.town.build.slots[event.slot].level;
                trInfo.unitId = event.data.unit;
                trInfo.unitCount = event.data.count;                
                trInfo.timeEnd = wofh.core.calcTrainEventData(wofh.town, wofh.town.build.slots[event.slot], wofh.town.events.items[i]).time;
                holder.cities.list[holder.cities.current].train[i] = trInfo;
                _setValue('cities', _serialize(holder.cities));
                panel.renderContent(holder);
            }
        }
    }
    /*
	if (document.location.href.indexOf('build?pos=') != -1) {
		var tr = $x("//div[@class='tunit_cont']/form[contains(@action, 'train')]");
		var buildDiv =  $x("//div[@class='build_train']/div[@class='desc']");
        if (tr.length == 0 && buildDiv.length == 0)
			return;

        var trInfo = {};
        var bpos = parseInt(document.location.href.match(/pos=(\d+)/)[1]);
        var info = $x("//div[@id='cont04']/div[@class='pagetitle']/div");
        var txt = info[0].innerHTML;
        var nfo = txt.match(/<a .*>(.*)<\/a> - (\d+)/);
        trInfo.building = nfo[1];
        trInfo.level = parseInt(nfo[2]);
        if (tr.length > 0) {
            // Присутвует форма тренировки - здание свободно
            trInfo.unitId = -1;
            trInfo.unitCount = 0;
            trInfo.timeEnd = 0;
        } else {
			if (buildDiv.length > 0) {
				// идет производство войск
				var hr = $x("a[contains(@href,'unitinfo?id=')]", buildDiv[0])[0].href;
				trInfo.unitId = parseInt(hr.match(/id=(\d+)/)[1]);
				
				// быстрохак
				if (currentHost.indexOf("waysofhistory") != -1) {
			        trInfo.unitCount = parseInt(buildDiv[0].innerHTML.match(/Ready:\s*(\d+)\s*of\s*(\d+)/)[2]);
			        var s = $x("span/span[contains(@id, 'timer')]", buildDiv[0]);
                    var found = null;
                    if (s.length > 0) {
                        s = s[0].innerHTML;
                        found = s.match(/(\d+)\:(\d+)\:(\d+)/);
                    } else {
                        s = $x("./span[@class='td']", buildDiv[0])[0].innerHTML;
                        var days = s.match(/(\d+).(\d+) days/);
                        var minutes = (parseInt(days[1]) + parseInt(days[2])/10) * 24 * 60 * 60;
                        found = ['0', '0', '00', '' + Math.round(minutes)] ;
                    }
                    var found2 = found[2];
                    if (found2.indexOf('0') == 0) {
                        found2 = found2.substring(1,found2.length);
                    }
                    trInfo.timeEnd = new Date().getTime() + (parseInt(found[1])*60*60 + parseInt(found2)*60 + parseInt(found[3]))*1000; 
			    } else {
			        trInfo.unitCount = parseInt(buildDiv[0].innerHTML.match(/Готово:\s*(\d+)\s*из\s*(\d+)/)[2]);
                    var s = $x("./span[@class='td build_train_timer']", buildDiv[0])[0].getAttribute("data-time");
                    timeToFinish = parseInt(s, 10) * 1000;
                    trInfo.timeEnd = new Date().getTime() + timeToFinish;
                }
            }
		}
        holder.cities.list[holder.cities.current].train[bpos] = trInfo;
		_setValue('cities', _serialize(holder.cities));
		panel.renderContent(holder);
	} else {

	var trExists = $x("//div[@id='cont04']/div[@class='pagecont3']/span/div[@class='build_train']");
	if (trExists.length ==0)
	  return;
	var trainDiv = $x("//div[@id='cont04']/div[@class='pagecont3']");
    var trNodes = trainDiv[0].childNodes;
	var trCnt = -1;
	for (var i in trNodes) {
	    var trInfo = null;
	    try {
			if (trNodes[i].nodeName == 'P') {
				//Получаем информацию о военном строении и его уровне
				var descr = $x(".//a[contains(@href,'build?pos=')]/span", trNodes[i]);
				if (descr.length == 0)
					continue;
				trInfo = {};
				trInfo.building = descr[0].innerHTML;

				var hr = $x(".//a[contains(@href,'build?pos=')]", trNodes[i])[0].href;
				trCnt = parseInt(hr.match(/pos=(\d+)/)[1]);

				var s = trNodes[i].lastChild.lastChild.nodeValue;
				trInfo.level = parseInt(s.match(/\d+/)[0]);
				trInfo.unitId = -1;
				holder.cities.list[holder.cities.current].train[trCnt] = trInfo;
			}
			if (trNodes[i].nodeName == 'SPAN') {
				//Получаем информацию о строящихся войсках
				var trInfo = holder.cities.list[holder.cities.current].train[trCnt];
				var buildDiv =  $x(".//div/div[@class='desc']", trNodes[i]);
				if (buildDiv.length > 0) {
					//	идет производство войск
					var hr = $x(".//a[contains(@href,'unitinfo?id=')]", buildDiv[0])[0].href;
					trInfo.unitId = parseInt(hr.match(/id=(\d+)/)[1]);
					
					// быстрохак 
					if (currentHost.indexOf("waysofhistory") != -1) {
					    
			            trInfo.unitCount = parseInt(buildDiv[0].innerHTML.match(/Ready:\s*(\d+)\s*of\s*(\d+)/)[2]);
			            var s = $x("span/span[contains(@id, 'timer')]", buildDiv[0]);
                        var found = null;
                        if (s.length > 0) {
                            s = s[0].innerHTML;
                            found = s.match(/(\d+)\:(\d+)\:(\d+)/);
                        } else {
                            s = $x("./span[@class='td']", buildDiv[0])[0].innerHTML;
                            var days = s.match(/(\d+).(\d+) days/);
                            var minutes = (parseInt(days[1]) + parseInt(days[2])/10) * 24 * 60 * 60;
                            found = ['0', '0', '00', '' + Math.round(minutes)] ;
                        }
                        var found2 = found[2];
                        if (found2.indexOf('0') == 0) {
                            found2 = found2.substring(1,found2.length);
                        }
                        alert (found);
                        trInfo.timeEnd = new Date().getTime() + (parseInt(found[1])*60*60 + parseInt(found2)*60 + parseInt(found[3]))*1000;
			            
			        } else {
			            trInfo.unitCount = parseInt(buildDiv[0].innerHTML.match(/Готово:\s+(\d+)\s*из\s*(\d+)/)[2]);
					    var s = $x("./span[@class='td build_train_timer']", buildDiv[0])[0].getAttribute("data-time");
                        timeToFinish = parseInt(s, 10) * 1000;
                        trInfo.timeEnd = new Date().getTime() + timeToFinish;
                    }
                    
					holder.cities.list[holder.cities.current].train[trCnt] = trInfo;
				}
			}
	    } catch (except) {
			_log(except);
	    }

	    if (trInfo && trCnt >-1)
			holder.cities.list[holder.cities.current].train[trCnt] = trInfo;
	}
	_setValue('cities', _serialize(holder.cities));
    
    }
    */
}

function onRemoveTrainBox(ci, i, holder, panel){
    return function(){
        if (confirm("Вы точно хотите удалить строение из списка?")) {
            delete holder.cities.list[ci].train[i];
            _setValue('cities', _serialize(holder.cities));
            panel.renderContent(holder);
        }
    }
}

function onCleanEndTrain(holder, panel){
    return function(){
        for (var ci in holder.cities.list) {
            var trInfoArr = holder.cities.list[ci].train;
            for (var i in trInfoArr) {
                if (trInfoArr[i] && trInfoArr[i].timeEnd) {
                    if (trInfoArr[i].timeEnd - new Date().getTime() <=0) {
                        if (document.getElementById("tr_" + ci + "_" + i).innerHTML == 'постройка окончена') {
                            delete holder.cities.list[ci].train[i];
                            _setValue('cities', _serialize(holder.cities));
                        }
                    }
                }
            }
        }
        panel.renderContent(holder);   
    }
}

function trainTimer(holder, panel) {
    for (var ci in holder.cities.list) {
        var trInfoArr = holder.cities.list[ci].train;
        for (var i in trInfoArr) {
            if (trInfoArr[i] && trInfoArr[i].timeEnd) {
                if (trInfoArr[i].timeEnd - new Date().getTime() <=0) {
                    document.getElementById("tr_" + ci + "_" + i).innerHTML = 'постройка окончена';
                    //Ахтунг, здание простаивает!!! А игрок не в курсе!
                    $q(panel.title.id).style.backgroundColor = panel.title.alertBackground;
                } else {
                    document.getElementById("tr_" + ci + "_" + i).innerHTML =  new Date(trInfoArr[i].timeEnd - new Date().getTime()).formatTime();
                }
            }
        }
    }
    var visible = _getValue(panel.content.visibleKey, panel.content.visible);
    if (visible)
        for (var ci in holder.cities.list) {
            var trInfoArr = holder.cities.list[ci].tradeOperation;
            for (var i in trInfoArr) {
                if (trInfoArr[i] && trInfoArr[i].time) {
                    if (trInfoArr[i].time - new Date().getTime() <=0) {
                        document.getElementById("op_" + ci + "_" + i).innerHTML = 'просрочено';
                    } else {
                        document.getElementById("op_" + ci + "_" + i).innerHTML =  new Date(trInfoArr[i].time - new Date().getTime()).formatTime();
                    }
                }
            }
        }
    setTimeout(function(){
        trainTimer(holder, panel)
    }, 1000);
}

var nas = 0;
var cr = 0;
var pp = 0;
function injectEconomicCalc(holder) {
    
    var infoDivs = $x("//div[@id='econstats']/table/tbody/tr/td");
    var pNode = infoDivs[0].lastChild;
    var eNode = infoDivs[2];
    var cNode = infoDivs[4];
    
    nas = parseInt(pNode.nodeValue);
    infoDivs[0].replaceChild($e('SPAN', nas, {id: 'info_div_0_value'}), pNode);
    
    pp = eNode.innerHTML.match(/(\d+)/)[1];
    cr = cNode.innerHTML.match(/(\d+)/)[1];
    
    eNode.replaceChild($t('Потенциал: '), eNode.firstChild);
    eNode.insertBefore($e('SPAN', pp, {id: 'info_div_1_value'}), eNode.lastChild);
    eNode.insertBefore($t(' '), eNode.lastChild);
    
    cNode.replaceChild($t('Коррупция: '), cNode.firstChild);
    cNode.insertBefore($e('SPAN', cr, {id: 'info_div_2_value'}), cNode.lastChild);
    cNode.insertBefore($t('% '), cNode.lastChild);
    
    var trElement = $x("//div[@id='econstats']/table/tbody");
    var changeNode = $e('TD', null, {colspan : 7}, {color: '#000000'}, $e('TR', null, null, null, trElement[0]));
    
    var content = [];
    content.push('Население: ');
    content.push('<a href="javascript: void(0)" id="info_div_0_add_10" >+10</a>');
    content.push('/<a href="javascript: void(0)" id="info_div_0_rm_10" >-10</a>   ');
    content.push('<a href="javascript: void(0)" id="info_div_0_add_100" >+100</a>');
    content.push('/<a href="javascript: void(0)" id="info_div_0_rm_100" >-100</a>  ');
    content.push('<a href="javascript: void(0)" id="info_div_0_add_1000" >+1K</a>');
    content.push('/<a href="javascript: void(0)" id="info_div_0_rm_1000" >-1K</a>');
    content.push('  Уровень суда: ');
    var lvls = [1,1.3,1.7,2.1,2.6,3.1,3.6,4.1,4.6,5.2,5.8,6.3,6.9,7.5,8.1,8.7,9.4,10,10.6,11.3,11.9];
    content.push('<select id="info_sel_change">');
    for (var i in lvls) {
        content.push('<option value="');
        content.push(lvls[i]);
        content.push('">Суд ');
        content.push(i);
        content.push('</option>');
    }
    content.push('</select>');
    
    changeNode.innerHTML = content.join('');
    
    $q('info_sel_change').addEventListener('change', onRecalcCorrupt(holder), false);
    
    $q('info_div_0_add_10').addEventListener('click', onRecalcNas(10), false);
    $q('info_div_0_rm_10').addEventListener('click', onRecalcNas(-10), false);
    $q('info_div_0_add_100').addEventListener('click', onRecalcNas(100), false);
    $q('info_div_0_rm_100').addEventListener('click', onRecalcNas(-100), false);
    $q('info_div_0_add_1000').addEventListener('click', onRecalcNas(1000), false);
    $q('info_div_0_rm_1000').addEventListener('click', onRecalcNas(-1000), false);
    
}


function onRecalcCorrupt(holder){
    return function(){
        var effect = $q('info_sel_change').value;
        
        var corr = -20;
        for (var c in holder.cities.list) {
            corr+=20;
        }
        cr = corr/effect;
        if (cr > 90)
            cr = 90;
        $q("info_div_2_value").innerHTML = Math.round(cr);
        recalcEconomic();
    }
}

function onRecalcNas(val){
    return function(){
        if (nas + val < 0)
            return;
        nas = nas + val;
        pp = Math.pow(nas, 0.85) + 10;
        $q("info_div_0_value").innerHTML = nas;
        $q("info_div_1_value").innerHTML = Math.round(pp);
        
        recalcEconomic();
    }
}


function recalcEconomic() {
    var datas = $x("//div[@id='epro']/table[@id='tbprod']/tbody/tr");
    for (var i in datas) {
        var cur_value = 0;
        var next = false;
        var tds = $x("td", datas[i]);
        for (var j in tds) {
            if (tds[j].getAttribute('class') != 'tc') {
                if (next) {
                    var foundBonus = tds[j].innerHTML.match(/(\d+)\+(\d+)/);
                    tds[j].innerHTML = Math.round(cur_value);
                    if (foundBonus) {
                        tds[j].innerHTML = tds[j].innerHTML + '+' + foundBonus[2];
                    }
                    continue;
                }
                if (tds[j].innerHTML.indexOf('=') > -1) {
                    next = true;
                    continue;
                }
                var ext_found = tds[j].innerHTML.match(/(\d+) \* (\d+)\%( \* (\d+)%)?/);
                if (ext_found) {
                    cur_value += pp * (100 - cr) / 100;
                    cur_value = cur_value * parseInt(ext_found[2]) / 100;
                    if (ext_found[3] && ext_found[4]) {
                        cur_value = cur_value * parseInt(ext_found[4]) / 100;
                    }
                    continue;
                }
                var found = tds[j].innerHTML.match(/(\d+)/);
                if (found) {
                    var value = found[1];
                    if (tds[j].innerHTML.indexOf('%') > -1) {
                        cur_value = cur_value * parseInt(value) / 100;
                    } else  {
                        cur_value += pp *(100 - cr) / 100;
                    }
                }
            }
        }
        next = false;
    }
}
function changeBuildPanelView() {
    return function() {
        _setValue('build_info_panel', !_getValue('build_info_panel'));
        window.location.reload();
    }
}

function buildingInfo() {
    return function () {
        var total = 0;
        var line = "";
        for (var i = 0; i < wofh.town.build.slots.length; i++) {
            try {
                var id = wofh.town.build.slots[i].id;
                if (id >= 0) {
                    var bTitle = lib.builds[id].name;
                    line += bTitle + ' - ';
                    var cc = 0;
                    var bhelper = new Build(id);
                    var level = wofh.town.build.slots[i].level;
                    for (var j = 1; j <= level; j++) {
                        var cost = bhelper.getCostLevel(j);
                        for (var k in cost) {
                            if (cost[k] > 0) {
                                total += cost[k];
                                cc += cost[k];
                            }
                        }
                    }
                    line += cc;
                    line += '\n';
                }
            } catch (e) {
                _log(e.toString());
            }
        }
        alert('Прочность города: ' + total + '\n' + line);
    }
}

function applyHelpToBuildings() {
    
    //looking for script injected panel
    var buildings = $x("//div[@class='pmaincont']/a[contains(@href, 'build?pos=') and contains(@class, 'build_icon_s')]", null);
    
    //not found? looking for native panel
    if (buildings.length == 0) {
        if ($x("//div[@class='pmaincont']/a[contains(@href, 'build?pos=')]/div[@class='pmaintg']").length > 0) {
            buildings = $x("//div[@class='pmaincont']/a[contains(@href, 'build?pos=')]");
        }
    }
    
    for (var i in buildings) {
        //_log(buildings[i]);
        buildings[i].addEventListener("mouseover", showTooltip(buildings[i]), false);
        buildings[i].removeAttribute("title") ;
        buildings[i].addEventListener("mouseout", hideTooltip, false);
        
        //buildings[i].addEventListener('mousedown', showHelp(buildings[i].href), false);
    }
    
}

function showHelpMess(bld) {
    return function() {
        _log(bld);
    }
}

function showTooltip(link) {
    return function() {
        var tt = $q('help_div');
        var href = $x('./img',link);
        if (href.length > 0) {
            href = href[0].src;
        } else {
            href = link.style.backgroundImage;
        }
        var id = parseInt(href.match(/\/p(\/g)?\/b\/(\d+)_/)[2]);
        var mapbuildings = $x("//area[contains(@href, 'build?pos=')]");
        var title = "";
        for (var i in mapbuildings) {
            if (link.href == mapbuildings[i].href)
                title = mapbuildings[i].title.match(/уровень\s*(\d+)/);
        }
        var level = parseInt(title[1]);
        var bhelper = new Build(id);
        var text = link.title + '<hr><b>Сл. уровень.</b><BR>';
        if (level >=20) {
            text += '<b>Максимальный уровень</b>';
        } else {
            var cost = bhelper.getCostLevel(level + 1);
            for (var k in cost) {
                var  st = '';
                if (arr[k] >= cost[k])
                    st = 'green';
                else
                    st = '#A52A2A';
                if (cost[k] > 0) {
                    text += '<nobr><span style="color: ' + st + '"><img class="res r' + k + '" src="/p/_.gif">'+ cost[k] + '</span></nobr> '; 
                }
            }
            text += '<nobr><span><img src="/p/_.gif" class="stimer"> ' + bhelper.getTime(level + 1).toString().toHHMMSS() + '</span></nobr>';
            
        }
        text += '<hr><b>Тек. эффект/стоимость/спад</b><br>';
        var cpay = 0;
        if (wofh.account.race == 3) {
            cpay = bhelper.getPay(level, true);
            
        } else {
            cpay = bhelper.getPay(level, false);
        }
        if (cpay < 0)
            cpay = 0;
        var cungrown = (utils.oddFunc(bhelper.getAttributes(id).ungrown, level) * wofh.town.pop.incReal / wofh.town.pop.inc);
        text += bhelper.getEffectLevel(level) + '&nbsp;/&nbsp;<img class="res r1" src="/p/_.gif" >' + cpay + '&nbsp;/&nbsp;' + cungrown.toFixed(2);
        if (level < 20) {
            var npay = 0;
            if (wofh.account.race == 3) {
                npay = bhelper.getPay(level + 1, true);
                
            } else {
                npay = bhelper.getPay(level + 1, false);
            }
            if (npay < 0)
                npay = 0;
            var nungrown = (utils.oddFunc(bhelper.getAttributes(id).ungrown, level + 1) * wofh.town.pop.incReal / wofh.town.pop.inc);
            text += '<hr><b>+1 ур. эффект/стоимость/спад</b><br>';
            text += bhelper.getEffectLevel(level + 1) + '&nbsp;/&nbsp;<img class="res r1" src="/p/_.gif" >' + npay + '&nbsp;/&nbsp;' + nungrown.toFixed(2);
        }
        tt.innerHTML = '<div>' + text + '</div>';
        
        tt.style.left = _getX(link) + 'px';
        tt.style.top = _getY(link) - 180 + 'px';
        tt.style.visibility = 'visible';
        tt.style.display = '';
    }
}

function hideTooltip() {
    $q('help_div').style.visibility = 'hidden';
}

function _getX(e){
    var x = 0;
    while (e) {
        x += e.offsetLeft;
        e = e.offsetParent;
    }
    return x;
}

function _getY(e){
    var y = 0;
    while (e) {
        y += e.offsetTop;
        e = e.offsetParent;
    }
    return y;
}

// end common functions

function parseBuildingInfo() {
    var datas = $x("//table[@class='def_table']/tbody/tr");
    var id = document.location.href.match(/id=(\d+)/)[1];
    var infoLine = id + ':{';
    for (var i in datas) {
        var children = datas[i].childNodes;
        var time = children[0].childNodes[0].getAttribute("title");
        var lvl = parseInt(children[0].childNodes[1].nodeValue);
        
        var cost = $x("./nobr", children[1]);
        var costClass = '';
        for (var j in cost) {
            var className = cost[j].childNodes[0].getAttribute("class");
            var resType = className.match(/res r(\d+)/)[1];
            var resCount = cost[j].childNodes[1].nodeValue;
            costClass += resType + ':' + resCount;
            if (j < cost.length - 1)
                costClass +=', '; 
        }
        
        var price = 0;
        if (children[2].childNodes.length > 0) {
            price = parseInt(children[2].childNodes[1].nodeValue);
        }
        var effect = children[3].innerHTML;
        var spad = 0;
        if (children[4].innerHTML.length > 0) {
            spad = parseFloat(children[4].innerHTML);
        }
        
        infoLine += lvl + ': {time:\\\'' + time + '\\\', cost:{' + costClass +'}, price:' + price + ', effect:\\\'' + effect + '\\\', spad:' + spad + '}';
        if (i < datas.length - 1)
            infoLine +=', '; 
    }
    infoLine +='}';
    _log(infoLine);
}

function addBuildInfoPanel() {
    
    
    var text = '<div class="pmaincont">';
    var blds = $x("//div[@id='cont04']/div[@class='tmain']/div[contains(@style, 'width:auto')]");
    var c_url = null;
    var c_title = null;
    var c_lvl = null;
    var textAreas = [];
    var merr_img = null;
    for (var i in blds) {
        if (i == 0) {
            try {
                var img = $x("./a/img", blds[i])[0];
                c_url = img.src;
                c_title = img.title;
                try {c_lvl = $x("./a/div/div",blds[i])[0].className; } catch (e) {};
                var group = img.src.match(/.*p\/(?:g\/)?b\/(\d+)_(.*)_.*/);
                if (group) {
                    var lvlId = buildLevelMap[parseInt(group[1])];
                    if (!lvlId && lvlId !=0) {
                        merr_img = '<img width="45" height="46" src="' + img.src + '" />';
                        if (group[2].indexOf("b") !=-1) lvlId =  group[2].substring(0, group[2].length -1); else lvlId= group[2];
                    }
                    c_url = '&quot;/p/b/bg/ss0.png&quot;';
                } else {
                    c_url = '&quot;/p/b/sw.gif&quot;';
                }
            } catch (e) {_log(e)}
            continue;
        }
        var href = $x("./a",blds[i])[0].href;
        var img = $x("./a/img", blds[i])[0];
        var lvlClass = null;
        var group = img.src.match(/.*p\/(?:g\/)?b\/(\d+)_(.*)_.*/);
        var style =  '/p/b/s0/sm.png';
        if (group) {
            style = img.src;
        } else {
            group = img.src.match(/.*p\/(?:g\/)?b\/s(\d+)\/(.*).png/);
            if (group && group[2].indexOf('a') == -1) style = '/p/b/s' + group[1] + '/s.png';
        }
        try {lvlClass = $x("./a/div/div",blds[i])[0].className; } catch (e) {};
        
        var area_index = parseInt(href.match(/pos=(\d+)/)[1]);
        var area_text = '<a href="' + href + '" style="background: url(/p/b/bg/ss0.png)" title="' + img.title + '">'
        + '<img width="45" height="46" src="' + style + '" />';
        if (lvlClass && group[2].indexOf("b") != -1 && group[2].length > 1)  {
            area_text +='<div class="pmaintb"><div class="' + lvlClass + '"></div></div>'
        } else if (lvlClass && lvlClass.indexOf('mnnd') != -1) {
            area_text +='<div class="pmaintd"><div class="' + lvlClass + '"></div></div>';
        } else if (lvlClass) {
            area_text +='<div class="pmaint"><div class="' + lvlClass + '"></div></div>';
        }
            area_text += '</a>';
        textAreas[area_index] = area_text;
    }
    for (var i = 1; i<19; i++) {
        if (textAreas[i]) {
            text += textAreas[i];
        } else {
            text += '<a href="/build/pos=' + i + '" style="background: url(/p/b/bg/ss0.png)" >'
            + '<img width="45" height="46" src="/p/b/s0/sm.png" />'
        }
    }
    
    
    try {
        text += '<a href="build?pos=0" style="left:-95px; top:-70px; poisition:absolute; z-index:1000; background: url('
        + c_url + ')" title="' + c_title + '">';
        if (merr_img) text += merr_img;
        if (c_lvl) {
            text += '<div class="lalala-pmaint"><div class="' + c_lvl + '"></div></div>';
        } } catch (e) {_log(e)};
    text += '</a>'
    text += '</div>';
    var div = $e('DIV', text, {class : 'pmain'}, {display: 'block'});
    var table = $x("//div[@id='cont04']/div[@class='tmain']")[0];
    table.parentNode.appendChild(div);
}

function calcDistance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

function roundNumber(num, dec) {
    var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
    return result;
}

function onMapDivNodeInserted() {
    if (injectMapDivProcessing)
        return;
    parseMapPage();
}

function switchMapHelp() {
    mapHelpEnabled = !mapHelpEnabled;
    document.getElementById('inf_tt_ico').setAttribute('class', !mapHelpEnabled ? 'a_osn_yes' : 'a_pos_no');
    var allPlayerCitiesHolder = _deserialize(_getValue("all_player_cities_holder", '{}'));
    var cities = _deserialize(_getValue('cities', '{ current: null, list: [] }'));
    var baseCoords = allPlayerCitiesHolder[cities.list[cities.current].id];
    if (baseCoords) {
        var landLinks = $x("//div[@id='landlnks']/a");
        for (var i in landLinks) {
            var coords = landLinks[i].href.match(/x=(\d+)&y=(\d+)/);
            var range = calcDistance(baseCoords.x, baseCoords.y, parseInt(coords[1]), parseInt(coords[2]));
            applyMapOpacity(landLinks[i], range, mapHelpEnabled);
        }
    }
}

function applyMapOpacity(link, range, enabled) {
    if (enabled) {
        link.style.opacity = 0.4;
        link.style.backgroundColor = range > 25 ? '#e83838' : '#0ce70c';
    } else {
        link.style.opacity = null;
        link.style.backgroundColor = null;
    }
}

var mapHelpEnabled = false;
var injectMapDivProcessing = false;
function parseMapPage() {
    injectMapDivProcessing = true;
    var allPlayerCitiesHolder = _deserialize(_getValue("all_player_cities_holder", '{}'));
    var cities = _deserialize(_getValue('cities', '{ current: null, list: [] }'));
    var baseCoords = allPlayerCitiesHolder[cities.list[cities.current].id];
    if (baseCoords) {
        var landLinks = $x("//div[@id='landlnks']/a");
        for (var i in landLinks) {
            if (landLinks[i].getAttribute('ws_processed') == 'true')
                continue;
            var coords = landLinks[i].href.match(/x=(\d+)&y=(\d+)/);
            var range = calcDistance(baseCoords.x, baseCoords.y, parseInt(coords[1]), parseInt(coords[2]));
            landLinks[i].setAttribute('tooltip', 'Расстояние: ' + roundNumber(range, 3) + '. ' + landLinks[i].getAttribute('tooltip'));
            if (mapHelpEnabled) {
                applyMapOpacity(landLinks[i], range, true);
            }
            landLinks[i].setAttribute('ws_processed', 'true');
            
        }
    }
    injectMapDivProcessing = false;
}

function parseCityListPage() {
    
    //определяем персональную страницу игрока
    var pname = $x("//div[@class='ptitle2_ ptitle2_p1']/h2")[0].innerHTML.match(/[^\s]*? (.*)/)[1];
    var infoTr = $x("//div[@id='tb_town']/div[@class='town_row tB']");
    if (pname == playerName) {
        var allPlayerCitiesHolder = {};
        for (var i in infoTr) {
            var centroid = $x("./div[@class='conbut2']/div[@class='M_bt M_bt_cent fR']/a", infoTr[i])[0];
            var coords = centroid.href.match(/x=(\d+)&y=(\d+)/);
            var townLink = $x("./*/div[@class='t_name fwB']/a", infoTr[i])[0];
            var id = townLink.getAttribute("href").match(/id=(\d+)/)[1];
            allPlayerCitiesHolder[id] = {x: parseInt(coords[1]), y: parseInt(coords[2])};
        }
        _setValue("all_player_cities_holder", _serialize(allPlayerCitiesHolder));
        _log(allPlayerCitiesHolder);
    }
    var allPlayerCitiesHolder = _deserialize(_getValue("all_player_cities_holder", '{}'));
    var cities = _deserialize(_getValue('cities', '{ current: null, list: [] }'));
    var baseCoords = allPlayerCitiesHolder[cities.list[cities.current].id];
    for (var i in infoTr) {
        var centroid = $x("./div[@class='conbut2']/div[@class='M_bt M_bt_cent fR']/a", infoTr[i])[0];
        var coords = centroid.href.match(/x=(\d+)&y=(\d+)/);
        if (coords.length > 2) {
            var divInfoHolder = $x("./div[@class='t_n_cont']/div[@class='t_dist fR']", infoTr[i])[0];
            var range = calcDistance(baseCoords.x, baseCoords.y, parseInt(coords[1]), parseInt(coords[2]));
            if (divInfoHolder.innerHTML == '')
                divInfoHolder.appendChild($t('Расстояние: ' + roundNumber(range, 3)));
        }
    }
    
    
    
    var infoTr = $x("//div[@id='tb_town']/div[@class='town_row tB']");
    var pname = $x("//div[@class='ptitle2_ ptitle2_p1']/h2")[0].innerHTML.match(/[^\s]*? (.*)/)[1];
    var plId = document.location.href.match(/id=(\d+)/)[1];
    var allPlayersHolder = _deserialize(_getValue("all_players_holder", '{data: []}'));
    var cityInfoList = [];
    for (var i in infoTr) {
        var cityInfo = {};
        cityInfoList[i] = cityInfo;
        
        var cview = $x("./div", $x("./div", infoTr[i])[1]);
        if (cview.length > 1) {
            cityInfo.mestorod = cview[1].title;
        }
        
        if (!cityInfo.mestorod) {
            cityInfo.mestorod = 'нет';
        }
        var ct = $x("./div", infoTr[i])[3];
        cityInfo.link = $x("./div/a", ct)[0].href;
        cityInfo.name = $x("./div/a", ct)[0].innerHTML;
        cityInfo.nas = $x("./div", ct)[1].lastChild.nodeValue;
        
        var rast = $x('./nobr', $x("./div", ct)[2])[0];
        if (rast) {
            cityInfo.rast = rast.childNodes[0].nodeValue.match(/(\d+.\d)/)[1];
            cityInfo.put = rast.childNodes[1].innerHTML;
        } else {
            cityInfo.rast = '';
            cityInfo.put = '';
        }
    }
    var divNfo = $e('DIV');
    $x("//div[@id='tb_town']")[0].appendChild(divNfo);
    var lastData = allPlayersHolder.data[plId];
    divNfo.appendChild($e('DIV', 'Последнее обновление: ' + (lastData ? lastData.date : 'никогда'), {id: 'last_data_info_div'}));
    divNfo.appendChild($e('A', 'Добавить/Обновить', {id: 'last_data_info_href',  href: 'javascript:void(0)'}));
    $x("//div[@id='tb_town']")[0].appendChild($e('A', 'Показать таблицу', {id: 'show_table_link', href: 'javascript:void(0)'}));
    $q('show_table_link').addEventListener('click', showCityInfoList(allPlayersHolder), false);
    $q('last_data_info_href').addEventListener('click', addToCityInfoList(cityInfoList, plId, pname, allPlayersHolder), false);
    _log(cityInfoList);
    
}
function addToCityInfoList(cityInfoList, plId, pname, allPlayersHolder) {
    return function() {
        allPlayersHolder.data[plId] = {};
        allPlayersHolder.data[plId].date = new Date();
        allPlayersHolder.data[plId].player = pname;
        allPlayersHolder.data[plId].data = cityInfoList;
        $q('last_data_info_div').innerHTML = 'Последнее обновление: ' + allPlayersHolder.data[plId].date;
        _setValue("all_players_holder", _serialize(allPlayersHolder));
    }
}
function showCityInfoList(allPlayersHolder) {
    return function() {
        var text = '<div align="right"><a id="city_list_div_close" href="javascript:void(0);">Закрыть</a></div><table border="5px" style="color:black;"><tr><td>Игрок</td><td>id</td><td>Обновление</td></tr>';
        var textarea = 'Игрок\tID\tГород\tСсылка\tМесторождение\tНаселение\tРасстояние\tПуть\n';
        for (var i in allPlayersHolder.data) {
            if (!allPlayersHolder.data[i])
                continue;
            text += '<tr><td>' + allPlayersHolder.data[i].player +
                '</td><td>' + i +
                '</td><td>' + allPlayersHolder.data[i].date +
                '</td></tr>';
            
            for (var j in allPlayersHolder.data[i].data) {
                var cityInfo = allPlayersHolder.data[i].data[j];
                textarea += allPlayersHolder.data[i].player + '\t'
                + i + '\t' + cityInfo.name + '\t' + cityInfo.link + '\t'
                + cityInfo.mestorod + '\t' + cityInfo.nas + '\t'
                + cityInfo.rast + '\t' + cityInfo.put + '\n';
            }
            
        }
        text += '</table><textarea rows="10" cols="25">';
        text += textarea;
        text += '</textarea>';
        var tt = $e('DIV', text, {id: 'city_list_div', class: 'pane'}, {zIndex: 4000, left: '0px', top:'0px', backgroundColor: '#FF6'}, document.body);
        var table = $x("//div[@id='tb_town']")[0];
        tt.style.left = _getX(table) + 'px';
        tt.style.top = _getY(table) + 'px';
        document.getElementById('city_list_div_close').addEventListener('click', closeCityInfoList, false);
    }
}

function closeCityInfoList() {
    document.body.removeChild($q('city_list_div'));
}
function onTradeTableNodeInserted() {
    if (injectAdvTradeProcessing)
        return;
    injectAdvTrade()
}

var injectAdvTradeProcessing = false;
function injectAdvTrade(){
    
    injectAdvTradeProcessing = true;
    var tradeTr = $x("//table[contains(@class, 'trade_table')]/tbody/tr[contains(@class, 'tbl_row')]");
    
    for (var i in tradeTr) {
        var tradeTd = $x("td", tradeTr[i]);
        if (tradeTr[i].getAttribute('ws_processed') == 'true')
            continue;
        if (tradeTd.length == 7) {
            
            
            var maxval = parseInt(tradeTd[2].lastChild.nodeValue!=null?tradeTd[2].lastChild.nodeValue:tradeTd[2].lastChild.lastChild.nodeValue); //максимум, который выставил продавец/покупатель
            //покупаем или продаем?
            var isSell = document.getElementById('r1').checked;
            var maxMessage = 'max - 1';
            var maxValue = maxval - 250;
            
            if (isSell) { //продаем. Пересчитать возможный максимум.
                var maxByTraders = parseInt($x("//span[@id='inpb']")[0].innerHTML); //максимум, который могут перевезти торговцы.
                var maxByResources = parseInt($x("./nobr/img", tradeTd[2])[0].getAttribute('class').match(/res r(\d+)/)[1]);
                maxByResources = isInt(arr[maxByResources]) ? arr[maxByResources] : 0; //максимум данного ресурса на складе
                
                maxval = Math.min(maxval, maxByTraders, maxByResources);
                maxMessage = 'max';
                maxValue = maxval;
            }
            
            var l = $e('a', '+1', { href: 'javascript: void(0)', id: 'incb' + i });
            var l2 = $e('a', '+4', { href: 'javascript: void(0)', id: 'incbt' + i });
            var l3 = $e('a', '-1', { href: 'javascript: void(0)', id: 'decb' + i });
            var l4 = $e('a', '-4', { href: 'javascript: void(0)', id: 'decbt' + i });
            var lmax = $e('a', maxMessage, { href: 'javascript: void(0)', id: 'maxb' +i});
            
            tradeTd[5].appendChild($e('br'));
            tradeTd[5].appendChild(l);
            tradeTd[5].appendChild($t(' '));
            tradeTd[5].appendChild(l2);
            
            tradeTd[4].appendChild($e('br'));
            tradeTd[4].appendChild(l3);
            tradeTd[4].appendChild($t(' '));
            tradeTd[4].appendChild(l4);
            
            tradeTd[3].appendChild($e('br'));
            tradeTd[3].appendChild(lmax);
            
            var inpu = $x(".//input[@name='count']", tradeTd[6])[0];
            $q('incb' + i).addEventListener('click', onIncValue(inpu, 1, maxval), false);
            $q('incbt' + i).addEventListener('click', onIncValue(inpu, 4, maxval), false);
            $q('decb' + i).addEventListener('click', onIncValue(inpu, -1, maxval), false);
            $q('decbt' + i).addEventListener('click', onIncValue(inpu, -4, maxval), false);
            $q('maxb' + i).addEventListener('click', onMaxValue(inpu, maxValue), false);
            
            tradeTr[i].setAttribute('ws_processed', 'true');
            
        }
    }
    injectAdvTradeProcessing = false;
    
}

function onIncValue(elem, cnt, maxval) {
    return function() {
        var incval = 250*cnt;
        var s = elem.value;
        if (s.length == 0)
            s = 0;
        else
            s = parseInt(s);
        if (s + incval > maxval)
            s = maxval;
        else
            s += incval;
        if (s < 0) {
            s = 0;
        }
        elem.value = s;
    }
}

function onMaxValue(elem, maxval) {
    return function() 
    {        
        elem.value = maxval;
    }
}

var Resource = (function() {
    var actualConstructor = function(id, max, container, parent) {
        this.id = id;
        this.max = max;
        this.container = container;
        this.parent = parent;
        arguments.callee.instances.push(this);
    }
    actualConstructor.instances = [];
    return actualConstructor;
})();

Resource.prototype.capacity = function() {
    return this.container.value.length == 0 || isNaN(this.container.value) ? 0 : parseInt(this.container.value);
}

Resource.prototype.onAdd = function(count) {
    var mmax = this.parent.capacity(this.id);
    if (this.max < mmax)  mmax = this.max;
    
    var incval = 250*count;
    
    var s = this.capacity();
    if (s + incval > mmax)
        s = mmax;
    else
        s += incval;
    if (s < 0) {
        s = 0;
    }
    this.container.value = s;
    JSN.market.pages.send.calcCurCapacity();
}

Resource.prototype.onMax = function() {
    var mmax = this.parent.capacity(this.id);
    if (this.max < mmax) mmax = this.max;
    this.container.value = mmax;
    JSN.market.pages.send.calcCurCapacity();
}

var TradeContainer = (function() {
    
    var actualConstructor = function(size) {
        this.size = size;
        this.resources = {};
        arguments.callee.instances.push(this);
    }
    actualConstructor.instances = [];
    return actualConstructor;
}
                     )();

TradeContainer.prototype.registerResource = function(id, max, container) {
    this.resources[id] = new Resource(id, max, container, this);
    addToContainer(container, $e('label', 'max', {href: 'javascript: void(0)', id: 'maxb' + id }, {color:'red'}));
    $q('maxb' + id).addEventListener('click', onMax(id, this), false);
    addToContainer(container, $e('label', '-4', { href: 'javascript: void(0)', id: 'decbt' + id }, {color: '#008000'}));
    $q('decbt' + id).addEventListener('click', onAdd(id, -4, this), false);
    addToContainer(container, $e('label', '-1', { href: 'javascript: void(0)', id: 'decb' + id }, {color: '#008000'}));
    $q('decb' + id).addEventListener('click', onAdd(id, -1, this), false);
    addToContainer(container, $e('label', '+4', { href: 'javascript: void(0)', id: 'incbt' + id }, {color: '#008000'}));
    $q('incbt' + id).addEventListener('click', onAdd(id, 4, this), false);
    addToContainer(container, $e('label', '+1', { href: 'javascript: void(0)', id: 'incb' + id }, {color: '#008000'}));
    $q('incb' + id).addEventListener('click', onAdd(id, 1, this), false);
}

function addToContainer(container, element) {
    container.parentNode.insertBefore(element, container.nextSibling);
    container.parentNode.insertBefore($t(' '), element);
}

TradeContainer.prototype.capacity = function(id) {
    var total = 0;
    for (var i in this.resources) {
        if (id != i)
            total += this.resources[i].capacity();
    }
    return this.size - total;
}

function onAdd(id, count, tradeContainer) {
    return function() {
        tradeContainer.resources[id].onAdd(count);
    }
}

function onMax(id, tradeContainer) {
    return function() {
        tradeContainer.resources[id].onMax();
    }
}

TradeContainer.prototype.init = function() {
    var elements = $x("//table[@id='inp']/tbody/tr/td/input[@type='text' and contains(@name, 'res')]");
    for (var i in elements) {
        var resId = elements[i].name.match(/res(\d+)/)[1];
        this.registerResource(resId, Math.floor(arr[resId]/250)*250, elements[i]);
    }
}

var sortType = 0;
var sortOrder = 1;

function streamSort() {
    
    var sortArray = [];
    var tabs = $x("//table[@class='def_table trway']", null);
    var tabIndex = tabs.length > 1 ? 1 : 0;
    var lines = $x("./tbody/tr", tabs[tabIndex]);
    for (var i in lines) {
        var columns = $x("./td", lines[i]);
        var cHolder = {city: {}, res: {}, pay: {}, traders: {}, optype: {}, time: {}, panel: ''};
        cHolder.city.text = columns[0].innerHTML;
        cHolder.city.value = $x("./a", columns[0])[0].innerHTML;
        cHolder.res.text = columns[1].innerHTML;
        cHolder.res.value = parseInt(columns[1].lastChild.nodeValue);
        cHolder.res.type = parseInt($x("./img", columns[1])[0].getAttribute('class').match(/res r(\d+)/)[1]);
        cHolder.pay.text = columns[2].innerHTML;
        cHolder.pay.value = parseFloat(columns[2].lastChild.nodeValue);
        cHolder.traders.text = columns[3].innerHTML;
        cHolder.traders.value = 0;
        if (columns[3].childNodes.length > 0) {
            cHolder.traders.value = parseInt(columns[3].firstChild.nodeValue);
        }
        cHolder.optype.text = columns[4].innerHTML;
        cHolder.optype.value = columns[4].innerHTML == 'Покупка' ? true : false;
        cHolder.time.text = columns[5].innerHTML;
        try {
            cHolder.time.value = parseFloat(columns[5].innerHTML.match(/(\d+\.\d+) /)[1]);
        } catch (e) {
            cHolder.time.value = 0;
        }
        cHolder.panel = columns[6].innerHTML;
        sortArray[i] = cHolder;
    }
    
    var columns = $x("./thead/tr/td", tabs[tabIndex]);
    for (var i in columns) {
        columns[i].innerHTML='<a id="sort_col_' + i + '" href="javascript:void(0)" >' + columns[i].innerHTML + '</a>';
        document.getElementById('sort_col_' + i).addEventListener('click', startSort(i, sortArray), false);
    }
}

function startSort(type, sortArray) {
    return function() {
        if  (sortType == type) {
            sortOrder = -1 * sortOrder;
        } else {
            sortType = type;
            sortOrder = 1;
        }
        sortArray.sort(streamComparator);
        var tabs = $x("//table[@class='def_table trway']", null);
        var lines = $x("./tbody/tr", tabs[tabs.length - 1]);
        for (var i in lines) {
            var columns = $x("./td", lines[i]);
            columns[0].innerHTML = sortArray[i].city.text;
            columns[1].innerHTML = sortArray[i].res.text;
            columns[2].innerHTML = sortArray[i].pay.text;
            columns[3].innerHTML = sortArray[i].traders.text;
            columns[4].innerHTML = sortArray[i].optype.text;
            columns[5].innerHTML = sortArray[i].time.text;
            columns[6].innerHTML = sortArray[i].panel;
        }
    }
}

function streamComparator(a, b) {
    if (sortType == 0) {
        //sort by city
        var x = a.city.value.toLowerCase();
        var y = b.city.value.toLowerCase();
        return sortOrder*((x < y) ? -1 : ((x > y) ? 1 : 0));
    }
    if (sortType ==1) { //sort by resource type/count
        if (a.res.type == b.res.type) {
            return sortOrder*(a.res.value - b.res.value);
        } else {
            return sortOrder*(a.res.type - b.res.type);
        }
    }
    if (sortType ==2) { //sort by payment value
        return sortOrder*(a.pay.value - b.pay.value);
    }
    if (sortType ==3) { //sort by traders count
        return sortOrder*(a.traders.value - b.traders.value);
    }
    if (sortType ==4) { //sort by operation type
        return sortOrder*(a.optype.value == b.optype.value ? 0 : a.optype.value ? -1 : 1);
    }
    if (sortType ==5) { //sort by time
        return sortOrder*(a.time.value - b.time.value);
    }
    return 0;
    
}


function onUSUnload() {}

var is_chrome = /chrome/.test( navigator.userAgent.toLowerCase() );
if (!is_chrome){
    window.addEventListener('load', onUSLoad, false);
    window.addEventListener('unload', onUSUnload, false);
}else {
    onUSLoad();
    
}

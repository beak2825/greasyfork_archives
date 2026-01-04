// ==UserScript==
// @name         链接参数去重去空
// @namespace    https://raw.githubusercontent.com/fangtiansheng/xinhua/master/script/deurl.js
// @include      https://*/*
// @version      0.2
// @description  链接的参数会自动去除重复去除空值参数排序重新打开链接
// @author       房天生
// @icon           https://www.valuesimplex.com/images/favicon.ico
// @grant          none
// @run-at         document-start
// @require        https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.js
// @match        http://*/*
// @grant           GM_xmlhttpRequest

// @downloadURL https://update.greasyfork.org/scripts/429179/%E9%93%BE%E6%8E%A5%E5%8F%82%E6%95%B0%E5%8E%BB%E9%87%8D%E5%8E%BB%E7%A9%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/429179/%E9%93%BE%E6%8E%A5%E5%8F%82%E6%95%B0%E5%8E%BB%E9%87%8D%E5%8E%BB%E7%A9%BA.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...
  function jsonToUrl(json) {
    var str = "";
    var nullPara = false;
    try {
      json = eval("(" + json + ")");
    } catch (e) {
      console.log("JSON格式有误");
    }
    for (var key in json) {
      if (nullPara) {
        console.log(nullPara);
        if (json[key] === "") {
          continue;
        }
      }
      if (typeof json[key] === "object") {
        str += key + "=" + JSON.stringify(json[key]) + "&";
      } else {
        str += key + "=" + json[key] + "&";
      }
    }
    str = "?" + str;

    str = encodeURI(str);

    return str.substr(0, str.length - 1);
  }
  function isNumber(val) {
    var regPos = /^\d+(\.\d+)?$/;
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/;
    return regPos.test(val) || regNeg.test(val);
  }
  function sortJson(jsonObj) {
    var keys = [];
    for (var key in jsonObj) {
      keys.push(key);
    }
    keys.sort();
    var sortedJson = {};
    for (var i in keys) {
      sortedJson[keys[i]] = jsonObj[keys[i]];
    }
    return sortedJson;
  }
  function urlFormat(url) {
    var tickDecode = true;
    var tickFormat = true;
    var toJson = true;
    var str = url;
    if (str.split("?").length === 2 && str.charAt(0) === "?") {
      str = str.substr(1);
    }
    var json = {};
    if (tickDecode) {
      str = decodeURIComponent(str);
    }
    if (tickFormat) {
      if (str.indexOf("?") < str.indexOf("&")) {
        str = str.replace(/\?/, "?\r\n");
      }
      str = str.replace(/&/g, "\r\n").replace(/\+/g, " ");
      var lines = str.split("\n");
      var temp = "";
      for (var k in lines) {
        temp += lines[k].replace(/=/, ": ") + "\n";
      }
      str = temp.trim();
    }
    if (toJson) {
      tickDecode ? (str = decodeURIComponent(url)) : (str = url);
      str = str.replace(/\+/g, " ");
      var paramList = [];
      var params = [];
      var paramValue = "";
      if (str.indexOf("?") < 0) {
        if (str.indexOf("&") < 0) {
          if (str.indexOf("=") < 0) {
            return str;
          } else {
            paramList = str.split("=");
            paramValue = paramList[1];
            if (isNumber(paramValue) && paramValue.length < 17) {
              paramValue = parseFloat(paramValue);
            }
            json[paramList[0]] = paramValue;
          }
        } else {
          params = str.split("&");
          for (var i = 0; i < params.length; i++) {
            if (params[i].endsWith("=")) {
              continue;
            }
            paramList = params[i].split("=");
            paramValue = paramList[1];
            if (isNumber(paramValue) && paramValue.length < 17) {
              paramValue = parseFloat(paramValue);
            }
            json[paramList[0]] = paramValue;
          }
        }
      } else {
        if (str.indexOf("?") < str.indexOf("&")) {
          params = str.substr(str.indexOf("?") + 1).split("&");
          for (var j = 0; j < params.length; j++) {
            if (params[i].endsWith("=")) {
              continue;
            }
            var key = params[j].substr(0, params[j].indexOf("="));
            var value = params[j].substr(params[j].indexOf("=") + 1);
            paramList = [key, value];
            paramValue = paramList[1];
            if (isNumber(paramValue) && paramValue.length < 17) {
              paramValue = parseFloat(paramValue);
            }
            json[paramList[0]] = paramValue;
          }
        } else {
          params = str.split("&");
          for (var h = 0; h < params.length; h++) {
            if (params[i].endsWith("=")) {
              continue;
            }
            paramList = params[h].split("=");
            paramValue = paramList[1];
            if (isNumber(paramValue) && paramValue.length < 17) {
              paramValue = parseFloat(paramValue);
            }
            json[paramList[0]] = paramValue;
          }
        }
      }
      return JSON.stringify(json, null, 5);
    } else {
      return str;
    }
  }
  function dedupURIParam(url) {
    var params = url.split("?");
    if (params.length < 2) {
      return url;
    }
    var baseurl = params[0];
    var query = params[1];

    var json = urlFormat(query);
    if (json == query) {
      return query;
    } else {
      var new_url = baseurl + jsonToUrl(json);
      return new_url;
    }
  }

  var url = window.location.href;
  var new_url = dedupURIParam(url);
  if (new_url == url) {
    console.log("没有重复参数");
  } else {
    console.log(new_url);
    window.location.href = new_url;
  }
})();

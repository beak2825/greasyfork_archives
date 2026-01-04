// ==UserScript==
// @name         ocot自检JSON折叠参数
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  ocot自检时，对JSON参数进行折叠
// @author       wdd
// @match        https://octo.mws.sankuai.com/*
// @match        https://octo.mws-test.sankuai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sankuai.com
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @require https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @require https://update.greasyfork.org/scripts/476008/1255570/waitForKeyElements%20gist%20port.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474741/ocot%E8%87%AA%E6%A3%80JSON%E6%8A%98%E5%8F%A0%E5%8F%82%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/474741/ocot%E8%87%AA%E6%A3%80JSON%E6%8A%98%E5%8F%A0%E5%8F%82%E6%95%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';


    //demo 地址：https://www.pianshen.com/article/2826479058/
    // GitHub地址：https://github.com/abodelot/jquery.json-viewer

    // waitForKeyElements 代码地址：https://gist.github.com/raw/2625891/waitForKeyElements.js


    // 将 base64 编码字符串转换成 Uint8Array 类型的字节数组
    function byteDecode(str) {

        var bytes = new Uint8Array(str.length);
        var index = 0;
        for (var i = 0; i < str.length; i += 4) {
            var c1 = base64DecodeChars.indexOf(str.charAt(i));
            var c2 = base64DecodeChars.indexOf(str.charAt(i + 1));
            var c3 = base64DecodeChars.indexOf(str.charAt(i + 2));
            var c4 = base64DecodeChars.indexOf(str.charAt(i + 3));
            bytes[index++] = (c1 << 2) | (c2 >> 4);
            if (c3 != 64) {
                bytes[index++] = ((c2 & 15) << 4) | (c3 >> 2);
            }
            if (c4 != 64) {
                bytes[index++] = ((c3 & 3) << 6) | c4;
            }
        }
        var byteArray = new Uint8Array(bytes.buffer, 0, index);
        return byteArray;
    }

    // 将字节数组解码成字符串
    function base64Dec(byteArray) {

        var decoder = new TextDecoder('utf-8');
        var decodedStr = decoder.decode(byteArray);
        return decodedStr;
    }

    function base64Decode(str) {

        var byteArray = byteDecode(str);
        // 将字节数组解码成字符串
        var decodedStr = base64Dec(byteArray);
        return decodedStr;
    }

var base64DecodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    function req(){
//    alert($('.json-btn').length)
    $('.json-btn').append('<span id="jsonViewerBtn">折叠</span>');

    $('.params-tab.mtd-tabs.mtd-tabs-nocard.mtd-tabs-large').append('<pre id="json-renderer"></pre>');

    $('#jsonViewerBtn').css('padding-left','12px')
    $('#jsonViewerBtn').click(function(){
//        alert("addCond");
        var jsonData = eval('('+$('.mtd-textarea.text-style').val()+')')
//        alert(con)
        $('#json-renderer').jsonViewer(jsonData);
    });
    }

    waitForKeyElements('.json-btn', req)

        function res(){
//    alert($('.json-btn').length)
    $('.base-style').append('<span id="jsonViewerBtn2">折叠</span>');

    $('.base-style').append('<pre id="json-renderer2"></pre>');

    $('#jsonViewerBtn2').css('padding-left','12px').css('color','#0a70f5').css('cursor','pointer')
    $('#jsonViewerBtn2').click(function(){
//        alert("addCond");
        var jsonData = eval('('+$('.mtd-textarea').last().val()+')')
//        alert(con)
        $('#json-renderer2').jsonViewer(jsonData);
    });


    //********** adRenderExtData(resend透传参数) start ************
    $('.base-style').append('<span id="jsonViewerBtn3">adRenderExtData(resend透传参数)</span>');
    $('.base-style').append('<pre id="json-renderer3"></pre>');
    $('#jsonViewerBtn3').css('padding-left','34px').css('color','#0a70f5').css('cursor','pointer')
    $('#jsonViewerBtn3').click(function(){
        var res = $('.mtd-textarea').last().val();
//        alert(res);
        var resJson = JSON.parse(res);
//        console.log(res);
        var extendParams = resJson['extendParams'];
        console.log(JSON.stringify(extendParams));

        var base64Str;
        if('{\"@class\":\"java.lang.String\",\"value\":\"adRenderExtData\"}' in extendParams){
            console.log(extendParams['{\"@class\":\"java.lang.String\",\"value\":\"adRenderExtData\"}']);
            base64Str = extendParams['{\"@class\":\"java.lang.String\",\"value\":\"adRenderExtData\"}'];
            console.log(base64Str);
        }else if("adRenderExtData" in extendParams) {
            console.log(extendParams["adRenderExtData"]);
            base64Str = extendParams["adRenderExtData"];
            console.log(base64Str);
        }

        var decodedStr = base64Decode(base64Str);
        decodedStr = decodedStr.substr(0, decodedStr.lastIndexOf('}')+1);
        console.log(decodedStr);
         var jsonData = JSON.parse(decodedStr);

        $('#json-renderer3').jsonViewer(jsonData);
    });
    // ************* adRenderExtData(resend透传参数) end **************

    //********** adString(机制透传参数) start ************
    $('.base-style').append('<span id="jsonViewerBtn4">adString(机制透传参数)</span>');
    $('.base-style').append('<pre id="json-renderer4"></pre>');
    $('#jsonViewerBtn4').css('padding-left','34px').css('color','#0a70f5').css('cursor','pointer')
    $('#jsonViewerBtn4').click(function(){
        var res = $('.mtd-textarea').last().val();
        //        alert(res);
        var resJson = JSON.parse(res);
        //        console.log(res);
        var adString = resJson['adString'];
        //        console.log(adString);



        // 构建请求参数
        var params = {
            adInfo: adString,

        };

        // 将请求参数转换为查询字符串
        var queryString = Object.keys(params).map(function(key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
        }).join('&');

        // 发送HTTP请求
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://weidongdong03-19.ide:8080/api/adInfo?' + queryString,
            onload: function(response) {
               console.log(response.responseText);
                // 解析返回的JSON数据
               // var data = JSON.parse(response.responseText);

                // 在控制台打印返回的数据
                //console.log(data);

                // 在页面中显示返回的数据
                var jsonData = eval('('+response.responseText+')');
                $('#json-renderer4').jsonViewer(jsonData);
            },
            onerror: function(error) {
                console.error('Error:', error);
            }
        });

    });
     // ************* adString(机制透传参数) end **************

    }

    waitForKeyElements('.result-container', res)


// 下面是json-viewer 源码
{
  /**
   * Check if arg is either an array with at least 1 element, or a dict with at least 1 key
   * @return boolean
   */
  function isCollapsable(arg) {
    return arg instanceof Object && Object.keys(arg).length > 0;
  }

  /**
   * Check if a string looks like a URL, based on protocol
   * This doesn't attempt to validate URLs, there's no use and syntax can be too complex
   * @return boolean
   */
  function isUrl(string) {
    var protocols = ['http', 'https', 'ftp', 'ftps'];
    for (var i = 0; i < protocols.length; ++i) {
      if (string.startsWith(protocols[i] + '://')) {
        return true;
      }
    }
    return false;
  }

  /**
   * Return the input string html escaped
   * @return string
   */
  function htmlEscape(s) {
    return s.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/'/g, '&apos;')
      .replace(/"/g, '&quot;');
  }

  /**
   * Transform a json object into html representation
   * @return string
   */
  function json2html(json, options) {
    var html = '';
    if (typeof json === 'string') {
      // Escape tags and quotes
      json = htmlEscape(json);

      if (options.withLinks && isUrl(json)) {
        html += '<a href="' + json + '" class="json-string" target="_blank">' + json + '</a>';
      } else {
        // Escape double quotes in the rendered non-URL string.
        json = json.replace(/&quot;/g, '\\&quot;');
        html += '<span class="json-string">"' + json + '"</span>';
      }
    } else if (typeof json === 'number' || typeof json === 'bigint') {
      html += '<span class="json-literal">' + json + '</span>';
    } else if (typeof json === 'boolean') {
      html += '<span class="json-literal">' + json + '</span>';
    } else if (json === null) {
      html += '<span class="json-literal">null</span>';
    } else if (json instanceof Array) {
      if (json.length > 0) {
        html += '[<ol class="json-array">';
        for (var i = 0; i < json.length; ++i) {
          html += '<li>';
          // Add toggle button if item is collapsable
          if (isCollapsable(json[i])) {
            html += '<a href class="json-toggle"></a>';
          }
          html += json2html(json[i], options);
          // Add comma if item is not last
          if (i < json.length - 1) {
            html += ',';
          }
          html += '</li>';
        }
        html += '</ol>]';
      } else {
        html += '[]';
      }
    } else if (typeof json === 'object') {
      // Optional support different libraries for big numbers
      // json.isLosslessNumber: package lossless-json
      // json.toExponential(): packages bignumber.js, big.js, decimal.js, decimal.js-light, others?
      if (options.bigNumbers && (typeof json.toExponential === 'function' || json.isLosslessNumber)) {
        html += '<span class="json-literal">' + json.toString() + '</span>';
      } else {
        var keyCount = Object.keys(json).length;
        if (keyCount > 0) {
          html += '{<ul class="json-dict">';
          for (var key in json) {
            if (Object.prototype.hasOwnProperty.call(json, key)) {
              var keyJson =json[key];
              key = htmlEscape(key);
              var keyRepr = options.withQuotes ?
                '<span class="json-string">"' + key + '"</span>' : key;

              html += '<li>';
              // Add toggle button if item is collapsable
              if (isCollapsable(keyJson)) {
                html += '<a href class="json-toggle">' + keyRepr + '</a>';
              } else {
                html += keyRepr;
              }
              html += ': ' + json2html(keyJson, options);
              // Add comma if item is not last
              if (--keyCount > 0) {
                html += ',';
              }
              html += '</li>';
            }
          }
          html += '</ul>}';
        } else {
          html += '{}';
        }
      }
    }
    return html;
  }

  /**
   * jQuery plugin method
   * @param json: a javascript object
   * @param options: an optional options hash
   */
  $.fn.jsonViewer = function(json, options) {
    // Merge user options with default options
    options = Object.assign({}, {
      collapsed: false,
      rootCollapsable: true,
      withQuotes: false,
      withLinks: true,
      bigNumbers: false
    }, options);

    // jQuery chaining
    return this.each(function() {

      // Transform to HTML
      var html = json2html(json, options);
      if (options.rootCollapsable && isCollapsable(json)) {
        html = '<a href class="json-toggle"></a>' + html;
      }

      // Insert HTML in target DOM element
      $(this).html(html);
      $(this).addClass('json-document');

      // Bind click on toggle buttons
      $(this).off('click');
      $(this).on('click', 'a.json-toggle', function() {
        var target = $(this).toggleClass('collapsed').siblings('ul.json-dict, ol.json-array');
        target.toggle();
        if (target.is(':visible')) {
          target.siblings('.json-placeholder').remove();
        } else {
          var count = target.children('li').length;
          var placeholder = count + (count > 1 ? ' items' : ' item');
          target.after('<a href class="json-placeholder">' + placeholder + '</a>');
        }
        return false;
      });

      // Simulate click on toggle button when placeholder is clicked
      $(this).on('click', 'a.json-placeholder', function() {
        $(this).siblings('a.json-toggle').click();
        return false;
      });

      if (options.collapsed == true) {
        // Trigger click to collapse all nodes
        $(this).find('a.json-toggle').click();
      }
    });
  };

// 下面是 json-viewer 的 css 源码
let style= " .json-document {padding: 1em 2em; } ul.json-dict, ol.json-array {list-style-type: none; margin: 0 0 0 1px; border-left: 1px dotted #ccc; padding-left: 2em; } .json-string {color: #0B7500; } .json-literal {color: #1A01CC; font-weight: bold; } a.json-toggle {position: relative; color: inherit; text-decoration: none; } a.json-toggle:focus {outline: none; } a.json-toggle:before {font-size: 1.1em; color: #c0c0c0; content: \"\\25BC\"; position: absolute; display: inline-block; width: 1em; text-align: center; line-height: 1em; left: -1.2em; } a.json-toggle:hover:before {color: #aaa; } a.json-toggle.collapsed:before {transform: rotate(-90deg); } a.json-placeholder {color: #aaa; padding: 0 1em; text-decoration: none; } a.json-placeholder:hover {text-decoration: underline; }"

   GM_addStyle(style)
    }
})();
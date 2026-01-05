// ==UserScript==
// @name         JsonView格式化
// @namespace    https://greasyfork.org/zh-CN/scripts/27421-jsonview%E6%A0%BC%E5%BC%8F%E5%8C%96
// @version      0.0.5
// @description  基于JSONView的JSON格式化脚本，方便查看json数据
// @author       王洋
// @match        http*://*/*
//@required      http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
//@license       The MIT License (MIT); http://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/27421/JsonView%E6%A0%BC%E5%BC%8F%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/27421/JsonView%E6%A0%BC%E5%BC%8F%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //CSS样式
    var style ='body {font-family: sans-serif;}' +
        '.prop {font-weight: bold;}' +
        '.null {color: red;}' +
        '.bool {color: blue;}' +
        '.num {color: blue;}' +
        '.string {color: green;}' +
        '.collapser {position: absolute; left: -1em; cursor: pointer;}' +
        'li {position: relative;}' +
        'li:after {content: ",";}' +
        'li:last-child:after {content: "";}' +
        '#error {-moz-border-radius: 8px; border: 1px solid #970000; background-color: #F7E8E8; margin: .5em; padding: .5em;}' +
        '.errormessage {font-family: monospace;  }' +
        '#json {font-family: monospace; font-size: 1.1em;}' +
        'ul {list-style: none; margin: 0 0 0 2em; padding: 0;}' +
        'h1 {font-size: 1.2em;}' +
        '.callback + #json {padding-left: 1em;}' +
        '.callback {font-family: monospace; color: #A52A2A;}';
    
    //JS脚本
    var defaultJs = 
        'document.addEventListener("DOMContentLoaded", function() {' +
          'function collapse(evt) {' +
            'var collapser = evt.target;' +
            'var target = collapser.parentNode.getElementsByClassName("collapsible");' +    
            'if ( ! target.length ) {return;}' +
            'target = target[0];' +

          '  if ( target.style.display == "none" ) {' +
              'var ellipsis = target.parentNode.getElementsByClassName("ellipsis")[0];' +
              'target.parentNode.removeChild(ellipsis);' +
              'target.style.display = "";' +
            '} else {' +
              'target.style.display = "none";' +
              'var ellipsis = document.createElement("span");' +
              'ellipsis.className = "ellipsis";' +
              'ellipsis.innerHTML = " &hellip; ";' +
              'target.parentNode.insertBefore(ellipsis, target);' +
            '}' +
            'collapser.innerHTML = ( collapser.innerHTML == "-" ) ? "+" : "-";' +
          '}' +
          
          'function addCollapser(item) {' +
            'if ( item.nodeName != "LI" ) {' +
              'return;' +
            '}' +
            'var collapser = document.createElement("div");' +
            'collapser.className = "collapser";' +
            'collapser.innerHTML = "-";' +
            'collapser.addEventListener("click", collapse, false);' +
            'item.insertBefore(collapser, item.firstChild);' +
          '}' +
          
          'var items = document.getElementsByClassName("collapsible");' +
          'for( var i = 0; i < items.length; i++) {' +
          '  addCollapser(items[i].parentNode);' +
          '}' +
        '}, false);';
    
    function htmlEncode(t) {
      return t;
    }

    function decorateWithSpan(value, className) {
      return '<span class="' + className + '">' + htmlEncode(value) + '</span>';
    }

    // Convert a basic JSON datatype (number, string, boolean, null, object, array) into an HTML fragment.
    function valueToHTML(value) {
      var valueType = typeof value;

      var output = "";
      if (value == null) {
        output += decorateWithSpan('null', 'null');
      } else if (value && value.constructor == Array) {
        output += arrayToHTML(value);
      } else if (valueType == 'object') {
        output += objectToHTML(value);
      } else if (valueType == 'number') {
        output += decorateWithSpan(value, 'num');
      } else if (valueType == 'string') {
        if (/^(http|https):\/\/[^\s]+$/.test(value)) {
          value = htmlEncode(value);
          output += '<a href="' + value + '">' + value + '</a>';
        } else {
          output += decorateWithSpan('"' + value + '"', 'string');
        }
      } else if (valueType == 'boolean') {
        output += decorateWithSpan(value, 'bool');
      }

      return output;
    }

    // Convert an array into an HTML fragment
    function arrayToHTML(json) {
      var output = '[<ul class="array collapsible">';
      var hasContents = false;
      for (var prop in json) {
        hasContents = true;
        output += '<li>';
        output += valueToHTML(json[prop]);
        output += '</li>';
      }
      output += '</ul>]';

      if (!hasContents) {
        output = "[ ]";
      }

      return output;
    }

    // Convert a JSON object to an HTML fragment
    function objectToHTML(json) {
      var output = '{<ul class="obj collapsible">';
      var hasContents = false;
      for (var prop in json) {
        hasContents = true;
        output += '<li>';
        output += '<span class="prop">' + htmlEncode(prop) + '</span>: ';
        output += valueToHTML(json[prop]);
        output += '</li>';
      }
      output += '</ul>}';

      if (!hasContents) {
        output = "{ }";
      }

      return output;
    }

    // Convert a whole JSON object into a formatted HTML document.
    function jsonToHTML(json, callback, uri) {
      var output = '';
      if (callback) {
        output += '<div class="callback">' + callback + ' (</div>';
        output += '<div id="json">';
      } else {
        output += '<div id="json">';
      }
      output += valueToHTML(json);
      output += '</div>';
      if (callback) {
        output += '<div class="callback">)</div>';
      }
      return toHTML(output, uri);
    }

    // Produce an error document for when parsing fails.
    function errorPage(error, data, uri) {
      var output = '<div id="error">Error parsing JSON: ' + error.message + '</div>';
      output += '<h1>' + error.stack + ':</h1>';
      output += '<div id="json">' + htmlEncode(data) + '</div>';
      return toHTML(output, uri + ' - Error');
    }

    // Wrap the HTML fragment in a full document. Used by jsonToHTML and errorPage.
    function toHTML(content, title) {
      return '<doctype html>' +
        '<html><head><title>' + title + '</title>' +
        '<style type="text/css">' + 
          style +
        '</style>' +
        '<script type="text/javascript">' +
          defaultJs +
         '</script>' + 
        '</head><body>' +
        content + 
        '</body></html>';
    }
    
    
    
    //格式化函数
    function formateJSON() {
      var data = document.body.innerHTML;
      var uri = document.location.href;
      data = data.replace(/<(?:.|\s)*?>/g, ''); //Aggressively strip HTML.
      
      // Test if what remains is JSON or JSONp
      var json_regex = /^\s*([\[\{].*[\}\]])\s*$/; // Ghetto, but it works
      var jsonp_regex = /^[\s\u200B\uFEFF]*([\w$\[\]\.]+)[\s\u200B\uFEFF]*\([\s\u200B\uFEFF]*([\[{][\s\S]*[\]}])[\s\u200B\uFEFF]*\);?[\s\u200B\uFEFF]*$/;
      var jsonp_regex2 = /([\[\{][\s\S]*[\]\}])\)/;
      var is_json = json_regex.test(data);
      var is_jsonp = jsonp_regex.test(data);
      console.log("JSONView: is_json=" + is_json + " is_jsonp=" + is_jsonp);

      if (is_json || is_jsonp) {
        console.log("JSONView: sexytime!");

        // Sanitize & output -- all magic from JSONView Firefox
        var outputDoc = '';
        // text = text.match(jsonp_regex)[1]; 
        var cleanData = '',
          callback = '';

        var callback_results = jsonp_regex.exec(data);
        
        if (callback_results && callback_results.length == 3) {
          console.log("THIS IS JSONp");
          callback = callback_results[1];
          cleanData = callback_results[2];
        } else {
          console.log("Vanilla JSON");
          cleanData = data;
        }
        console.log(cleanData);

        // Covert, and catch exceptions on failure
        try {
          // var jsonObj = this.nativeJSON.decode(cleanData);
          var jsonObj = JSON.parse(cleanData);
          if (jsonObj) {
            outputDoc = jsonToHTML(jsonObj, callback, uri);
            console.log(outputDoc);
          } else {
            throw "There was no object!";
          }
        } catch (e) {
            console.log(e);
            alert(e);
            return;
            //关闭错误输出页面
          //outputDoc = errorPage(e, data, uri);
        }
        var links = '<style type="text/css">' +  
            style +
        '</style>' +
        '<script type="text/javascript">' + 
            defaultJs +
        '</script>';
        document.body.innerHTML = links + outputDoc;
      }
    }
    
    //执行格式化脚本
    formateJSON();

})();
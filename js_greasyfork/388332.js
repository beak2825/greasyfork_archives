// ==UserScript==
// @name         WebService JSON 格式化（EI专用）
// @namespace    http://tampermonkey.net/
// @version      0.01
// @description  可能仅适合本公司使用吧！
// @author       You
// @match        http://*/*.asmx/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388332/WebService%20JSON%20%E6%A0%BC%E5%BC%8F%E5%8C%96%EF%BC%88EI%E4%B8%93%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/388332/WebService%20JSON%20%E6%A0%BC%E5%BC%8F%E5%8C%96%EF%BC%88EI%E4%B8%93%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        jsonFormat();
    }, 1);

})();

function jsonFormat() {
    var body = document.getElementsByTagName('body')[0];

    var text = body.querySelector('.text').innerText;
    try {
        var jsonParse = JSON.parse(text);
    } catch (e) {
        body.innerHTML = body.innerHTML + '<div id="jsonFormat">格式化失败，请检查JSON格式！</div>';
        body.querySelector('#jsonFormat').style.cssText = 'margin: 20px;font-size: 15px;color: red;' +
            'font-family: Menlo,Monaco,Consolas,"Courier New",monospace;';
        return;
    }
    var json = JSON.stringify(jsonParse, null, 4);

    body.innerHTML = body.innerHTML + '<div id="jsonFormat"><pre>' + syntaxHighlight(json) + '</pre></div>';
    // body.innerHTML = body.innerHTML + '<div id="jsonFormat"><button id="btn1" class="btn">复制原始数据</button>  <button id="btn2" class="btn">复制格式化数据</button><pre>' + syntaxHighlight(json) + '</pre><input id="tempInput" style="display: none;"/></div>';

    // document.getElementById('btn1').addEventListener('click',btn1);

    body.querySelector('#jsonFormat').style.cssText ='margin: 10px 20px;';

    //  body.querySelectorAll('.btn').forEach((element, index, array) => {
    //     array[index].style.cssText = 'color: #fff;background-color: #337ab7; border-color: #2e6da4; border-radius: 3px; border: 1px solid transparent;padding: 5px 10px;cursor: pointer;';
    //  });

    body.querySelector('pre').style.cssText =
        'display: block;' +
        'padding: 9.5px;' +
        //'margin: 20px;' +
        'font-size: 13px;' +
        'line-height: 1.6;' +
        'color: #333;' +
        'word-break: break-all;' +
        'word-wrap: break-word;' +
        'background-color: #f5f5f5;' +
        'border: 1px solid #ccc;' +
        'border-radius: 4px;' +
        'font-family: Menlo,Monaco,Consolas,"Courier New",monospace;';


    //loadStyleString(".key{color: #CC0000; font-weight: bold;}"); // xml失败？
    body.querySelectorAll('.key').forEach((element, index, array) => {
        array[index].style.cssText = 'color: #CC0000; font-weight: bold;';
    });

    body.querySelectorAll('.string').forEach((element, index, array) => {
        array[index].style.cssText = 'color: #007777;';
    });

    body.querySelectorAll('.number').forEach((element, index, array) => {
        array[index].style.cssText = 'color: #AA00AA;';
    });

    body.querySelectorAll('.boolean').forEach((element, index, array) => {
        array[index].style.cssText = 'color: blue;';
    });

    body.querySelectorAll('.null').forEach((element, index, array) => {
        array[index].style.cssText = 'color: magenta;';
    });
}

function syntaxHighlight(json) {

    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 4);
    }

    json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');

    return json.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        function(match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
}

function loadStyleString(css){
    var style = document.createElement("style");
    style.type = "text/css";
    try{
        style.appendChild(document.createTextNode(css));
    } catch (ex){
        style.styleSheet.cssText = css;
    }
    //var head = document.getElementsByTagName("head")[0];
    //head.appendChild(style);
    document.head.appendChild(style);
}
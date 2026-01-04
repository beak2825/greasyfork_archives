// ==UserScript==
// @name         AtCoder♡♡
// @namespace    http://atcoder.jp/
// @version      1.0.1
// @description  AtCoderの問題文を雑な♡喘ぎ仕様にします。
// @author       Nauclhlt
// @match        https://atcoder.jp/contests/*/tasks/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512956/AtCoder%E2%99%A1%E2%99%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/512956/AtCoder%E2%99%A1%E2%99%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    
    let ReplaceMap = {
        "ています。" : "てるのっ♡♡♡",
        "てください。": "てっ…♡♡おねがいだからぁっ♡♡",
        "られます。": "られちゃうのぉぉっ♡♡　",
        "られる。": "られちゃうのぉぉっ♡♡",
        "せよ。": "してっ♡♡♡",
        "となる。": "になっちゃうぅぅぅぅ♡♡♡",
        "となる": "になっちゃうぅぅぅぅ♡♡♡",
        "よい。": "いいよ♡♡",
        "良い。": "いいよ♡♡",
        "ます。": "まぁす♡♡",
        "。": "♡♡　",
        "て、": "てぇっ♡♡　",
        "、": "っ♡♡　"
    };
    
    function dfsReplace(root, map)
    {
        let stack = [root];

        while (stack.length > 0)
        {
            let element = stack.pop();
            if ( element.tagName == "P" || element.tagName == "LI" )
            {
                for ( let key in map )
                {
                    element.innerHTML = element.innerHTML.replaceAll(key, map[key]);
                }
            }
            
            
            if (element.children.length > 0)
            {
                for (let i = 0; i < element.children.length; i++)
                {
                    stack.push(element.children[i]);
                }
            }
        }

        return false;
    }

    let taskStatement = document.getElementById("task-statement");
    
    dfsReplace( taskStatement, ReplaceMap );
})()
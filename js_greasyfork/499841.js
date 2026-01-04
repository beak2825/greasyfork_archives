// ==UserScript==
// @name         魔方公式转换助手
// @namespace    http://tampermonkey.net/
// @version      v1.2
// @description  魔方公式转换助手用于将英文公式转化为上勾下回的中文公式
// @author       licat
// @match        http://algdb.net/*
// @icon         https://img.alicdn.com/imgextra/i3/917298378/O1CN01tKRdYY2BlBD0ZVzOJ_!!917298378.png
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499841/%E9%AD%94%E6%96%B9%E5%85%AC%E5%BC%8F%E8%BD%AC%E6%8D%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/499841/%E9%AD%94%E6%96%B9%E5%85%AC%E5%BC%8F%E8%BD%AC%E6%8D%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //转化规则
    const maps = {
        "U": "勾",
        "U'": "回",
        "U2": "勾勾",
        "U'2": "回回",
        "R": "上",
        "R'": "下",
        "R2": "上上",
        "R'2": "下下",
        "F":"压",
        "F'":"提",
        "F2":"压压",
        "F'2":"提提",
        "D": "外",
        "D'": "里",
        "D2": "外外",
        "D'2": "里里",
        "L": "(左下)",
        "L'":"(左上)",
        "L2": "(左下下)",
        "L'2": "(左上上)",
        "B": "(后提)",
        "B'":"(后压)",
        "B2":"(后提提)",
        "B'2":"(后压压)",
        "x": "(上翻)",
        "x'": "(下翻)",
        "x2":"(上翻翻)",
        "y":"(左翻)",
        "y'":"(右翻)",
        "y2":"(左翻翻)",
        "z":"(压翻)",
        "z'":"(提翻)",
        "z2":"(压翻翻)",
        "M'":"中",
        "M2":"中中",
        "E": "(中回)",
        "E'":"(中勾)",
        "E2":"(中回回)",
        "S": "(中压)",
        "S'":"(中提)",
        "S2":"(中压压)",
        "r":"(双上)",
        "r'":"(双下)",
        "r2":"(双上上)",
        "l":"( 左双下)",
        "l'":"(左双上)",
        "l2":"(左双下下)",
        "u":"(双勾)",
        "u'":"(双回)",
        "u2":"(双勾勾)",
        "d":"(双外)",
        "d'":"(双里)",
        "d2":"(双外外)",
        "f":"(双压)",
        "f'":"(双提)",
        "f2":"(双压压)",
        "b":"( 后双提)",
        "b'":"(后双压)",
        "b2":"(后双提提)",
    }
    var hostMap = {
        "algdb.net": convert_algdb,
    }
    function convert_algdb(){
        var retryCount = 0;
        var callback = ()=>{
            let formulas = window.document.body.querySelectorAll("table tbody .case td:last-of-type div span span");
            if(!formulas.length) {
                if (retryCount >= 5){
                    console.log("not find target element");
                    return
                }
                retryCount++;
                setTimeout(callback, 500);
                return;
            }
            formulas.forEach((formula)=>{
                let formulaText = formula.textContent.trim();
                let texts = formulaText.split(" ");
                let newTexts = texts.map((t,i)=>{
                    let v = maps[t]?maps[t]:t;
                    return v;
                });
                formula.innerHTML = formulaText + '<br _ngcontent-c6=""><span style="color: #007bff">' + newTexts.join("") + '</span><br _ngcontent-c6="">';
            });
            let divs = window.document.body.querySelectorAll("table tbody .case td:last-of-type div");
            divs.forEach((d)=>{
                d.style.height = "auto";
            });
            return;
        }
        return callback;
    }
    let runfunc = hostMap[window.location.host];
    if(typeof runfunc === 'function'){
        runfunc()();
    }
})();
// ==UserScript==
// @name         融e学
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  融e学自动答题
// @author       土豆
// @match        https://www.i-ronge.com/paper/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416204/%E8%9E%8De%E5%AD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/416204/%E8%9E%8De%E5%AD%A6.meta.js
// ==/UserScript==

(function() {
        var dt = document.getElementsByTagName("input");
        var pattern = /answerLite/;
        var txt = document.getElementsByClassName("c-666 fsize16")
        console.log(txt)
        var values = []
        for (var i = 0; i < dt.length; i++) {
            if (undefined != dt[i].attributes.value && undefined != dt[i].attributes.name) {
                if (pattern.test(dt[i].attributes.name.value)) {
                    var answer = ''
                    if ("69E5F5329EA40941C80BF846BD4A0C80" == dt[i].attributes.value.value) {
                        answer = 'A'
                    }
                    if ("788F39B8CB1683C32078D00229E2C0E2" == dt[i].attributes.value.value) {
                        answer = 'B'
                    }
                    if ("9C8AC69080DFA6A1C42A61C6DE3E9F85" == dt[i].attributes.value.value) {
                        answer = 'C'
                    }
                    if ("3070734AF1072080BF231388EA5DA062" == dt[i].attributes.value.value) {
                        answer = 'D'
                    }
                    //------------------------------------------------------------------
                    if ("6C58A7D963F15C5EDFF9F1D327C87585" == dt[i].attributes.value.value) {
                        answer = 'BC'
                    }
                    if ("B7B66DAA31C3FD0DF84B09459F8F5A53" == dt[i].attributes.value.value) {
                        answer = 'ABCD'
                    }
                    if ("885E6D5FE813282817D08225C2A1A923" == dt[i].attributes.value.value) {
                        answer = 'ACD'
                    }
                    if ("C28E144761B2A5DA6D0B1E68DD0E5A6E" == dt[i].attributes.value.value) {
                        answer = 'AD'
                    }
                    if ("E31112F6A4905E4F6B912D4B9494126A" == dt[i].attributes.value.value) {
                        answer = 'ABD'
                    }
                    if ("F7830E919D1A907F81D41D2A01E6B426" == dt[i].attributes.value.value) {
                        answer = 'AB'
                    }
                    if ("A0BC42305640E626E87E65B673E6CD74" == dt[i].attributes.value.value) {
                        answer = 'ABC'
                    }
                    if ("F883B680671E23AA20288C90DC0757B5" == dt[i].attributes.value.value) {
                        answer = 'BCD'
                    }
                    if ("A1E75B226FBAD2C99B7FCFF3FCCD6211" == dt[i].attributes.value.value) {
                        answer = 'CD'
                    }
                    if ("A24E4282AF5F0441AF5DF10AA799FA97" == dt[i].attributes.value.value) {
                        answer = 'BD'
                    }
                    if ("0823D8DDAB641E66B2647FF6432A8197" == dt[i].attributes.value.value) {
                        answer = 'AC'
                    }
                    //-------------------------------------------------------------------
                    if ("69E5F5329EA40941C80BF846BD4A0C80" == dt[i].attributes.value.value) {
                        answer = '√或A'
                    }
                    if ("788F39B8CB1683C32078D00229E2C0E2" == dt[i].attributes.value.value) {
                        answer = '×或B'
                    }
                    var value = "(答案:" + answer + "\tCSDN:potato_not_tudou"+")"
                    values.push(value)
                }

            }

        }
    console.log(values)
    for(var c=0;c<values.length;c++){
               txt[c].innerText = txt[c].innerText +values[c]
            }
})();
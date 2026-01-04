// ==UserScript==
// @name         清蛤英语在线
// @namespace    ludoux
// @version      0.1
// @description  清华社英语在线
// @author       ludoux
// @match        *://www.tsinghuaelt.com/course-study-student/*
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/413702/%E6%B8%85%E8%9B%A4%E8%8B%B1%E8%AF%AD%E5%9C%A8%E7%BA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/413702/%E6%B8%85%E8%9B%A4%E8%8B%B1%E8%AF%AD%E5%9C%A8%E7%BA%BF.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var auto
    var randomBase
    var randomMin
    var randomMax
    auto = GM_getValue('auto', true);
    randomBase = GM_getValue('randomBase', 100);
    randomMin = GM_getValue('randomMin', 100);
    randomMax = GM_getValue('randomMax', 200);
    //randomBase = GM_getValue('randomBase', 6341)
    //randomMin = GM_getValue('randomMin', 1147)
    //randomMax = GM_getValue('randomMax', 8475)

    (function (open) {
        XMLHttpRequest.prototype.open = function () {
            this.addEventListener("readystatechange", function () {
                if (this.responseURL.indexOf("tsenglish/textbook/pageDetail") != -1 && this.responseText.length > 0) {
                    //alert(this.responseURL)
                    handleXhr(this.responseText);
                }
            });
            open.apply(this, arguments)
        };
    })(XMLHttpRequest.prototype.open);
    function handleXhr(text) {
        var answerText = ''
        try {
            var jsonObject = jQuery.parseJSON(text);
        }
        catch (err) {
            return
        }
        jsonObject = jsonObject['object']['item']['object'] //exerciseList
        if ('exerciseList' in jsonObject) {
            jsonObject = jsonObject['exerciseList']
            console.log('into exerciseList')
            for (const i in jsonObject) {//choices
                var jsoni = jsonObject[i]
                if ('fillBlanks' in jsoni) {//填空
                    for (const it in jsoni['fillBlanks']) {
                        //console.log(jsoni['fillBlanks'][it].standardAnswer)
                        answerText += '{' + jsoni['fillBlanks'][it].answer + '}'
                    }
                }
                else if ('choices' in jsoni) {//选择
                    //alert(jsoni.answer)
                    for (const it in jsoni['choices']) {
                        //console.log(jsoni['fillBlanks'][it].standardAnswer)
                        if (jsoni['choices'][it].id == jsoni.answer)
                            answerText += '{' + String.fromCharCode(parseInt(it) + 65) + '}'
                    }
                }
                else if ('answer' in jsoni) { //大填空
                    answerText += '{' + jsoni.answer + '}'
                }

            }
        }//imgFillBlanks
        else if ('imgFillBlanks' in jsonObject) {
            jsonObject = jsonObject['imgFillBlanks']
            for (const i in jsonObject) {//choices
                var jsoni = jsonObject[i]
                if ('fillBlank' in jsoni) {//填空
                    for (const it in jsoni['fillBlank']) {
                        //console.log(jsoni['fillBlanks'][it].standardAnswer)
                        answerText += '{' + jsoni['fillBlank'].answer + '}'
                    }
                }
            }
        }
        else if ('fillBlanks' in jsonObject) {
            //alert('备选路线alert！')
            console.log('into fillBlanks')
            for (const it in jsonObject['fillBlanks']) {
                console.log(jsonObject['fillBlanks'][it].answer)
                answerText += '{' + jsonObject['fillBlanks'][it].answer + '}'
            }
        }
        setTimeout(function () {
            createDiv(answerText)
            if (document.querySelectorAll('span[id^="a-"]').length > 0) {//小填空
                //match(/(?<={).+?(?=[,}])/g);
                //console.log('into')
                let ans = answerText.match(/(?<={).+?(?=[,;}])/g)
                let e = document.querySelectorAll('span[id^="a-"]')
                for (let index in ans) {
                    setTimeout(function () { doInput(e[index], ans[index]) }, (Number(index) + 1) * (randomBase + Math.floor(Math.random() * (randomMax - randomMin + 1)) + randomMin))
                }
            }
            else if (document.querySelectorAll('div[class^="lib-single-box"]').length > 0) {//单选
                let ans = answerText.match(/(?<={).+?(?=[,;}])/g);
                let e = document.querySelectorAll('div[class^="lib-single-box"]')
                for (let index in ans) {
                    setTimeout(function () { doCheckbox(e[index].querySelectorAll('p[class^="lib-single-item-one"]')[ans[index].charCodeAt() - 65]) }, (Number(index) + 1) * (randomBase + Math.floor(Math.random() * (randomMax - randomMin + 1)) + randomMin))
                }
            }
            else if (document.querySelectorAll('textarea[class^="img-blank-answer"]').length > 0) {//图片下方的填空
                let ans = answerText.match(/(?<={).+?(?=[,;}])/g);
                let e = document.querySelectorAll('textarea[class^="img-blank-answer"]')
                for (let index in ans) {
                    setTimeout(function () { doInput(e[index], ans[index]) }, (Number(index) + 1) * (randomBase + Math.floor(Math.random() * (randomMax - randomMin + 1)) + randomMin))
                }
            }
        }, 1500)
    }
    function createDiv(answer) {
        if ($('#divAnswer').length > 0) {
            $("div#divAnswer").text(answer)
            return
        }
        let divWrapper = $("<div></div>")
        divWrapper.attr('id', 'divWrapper')
        divWrapper.attr("style",
            "top: 10px; left: 10px; margin: 0 auto; z-index: 1024; border-radius: 4px;"
            + " box-shadow: 0 11px 15px -7px rgba(0,0,0,.2), 0 24px 38px 3px rgba(0,0,0,.14), 0 9px 46px 8px rgba(0,0,0,.12);"
            + " position: fixed; background: #fff; width: 250px; max-height: 800px; min-height: 200px;");
        $("body").append(divWrapper)//div#divWrapper
        let divAnswer = $("<div></div>")
        divAnswer.attr('id', 'divAnswer')
        divAnswer.text(answer)
        divWrapper.append(divAnswer)
    }
    window.onload = function () {
        //页面框架ok了
        if ($('#explorer').length > 0) {
            $('#explorer').remove()
        }

        createDiv('正在加载')
    };
    function doInput(dom, st) {
        $(dom).trigger('click')
        $(dom).trigger('focus')
        //$(dom).trigger('keydown')
        $(dom).trigger('input')//
        $(dom).trigger('compositionstart')
        $(dom).text(st)

        //$(dom).trigger('keyup')
        try {
            if (/input/i.test(dom.tagName)) {
            var setValue = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
            setValue.call(dom, st)
            var e = new Event('input', { bubbles: true })
            dom.dispatchEvent(e)
        } else {
            var evt = new InputEvent('input', {
                inputType: 'insertText',
                data: st,
                dataTransfer: null,
                isComposing: false
            })
            dom.value = st
            dom.dispatchEvent(evt)
        }
        } catch (error) {

        }
        finally {
            $(dom).text(st)
        $(dom).trigger('compositionend')
        $(dom).trigger('change')
        $(dom).trigger('focus')
        $(dom).trigger('blur')
        }


    }
    function doCheckbox(dom) {
        dom.click()
    }
})();
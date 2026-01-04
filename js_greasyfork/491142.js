// ==UserScript==
// @name         不知名-英语系列 U校园网课答案显示/U校园答案自动填入需要代刷请看描述
// @namespace    https://www.github.com/SSmJaE/
// @description  脚本已失效<，需要代刷请添加微信：bzm8866999
// @version      2.1.5
// @author      不知名的打工仔
// @license      GPL-3.0
// @compatible   Chrome
// @run-at       document-end
// @match        *://u.unipus.cn/*
// @match        *://ucamapi.unipus.cn/*
// @match        *://sso.unipus.cn/sso/login*
// @match        *://uexercise.unipus.cn/uexercise*
// @match        *://u.unipus.cn/user/student/homework*
// @match        *://ucontent.unipus.cn/_pc_default/pc.html?*
// @match        *://ucontent.unipus.cn/_utalk_default/pc.html?*
// @connect      localhost
// @connect      mz.3ds2.top
// @connect      u.unipus.cn
// @connect      47.97.90.127
// @connect      ucamapi.unipus.cn
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        window.close
// @grant        window.onurlchange
// @antifeature  payment
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/491142/%E4%B8%8D%E7%9F%A5%E5%90%8D-%E8%8B%B1%E8%AF%AD%E7%B3%BB%E5%88%97%20U%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%AF%BE%E7%AD%94%E6%A1%88%E6%98%BE%E7%A4%BAU%E6%A0%A1%E5%9B%AD%E7%AD%94%E6%A1%88%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%A5%E9%9C%80%E8%A6%81%E4%BB%A3%E5%88%B7%E8%AF%B7%E7%9C%8B%E6%8F%8F%E8%BF%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/491142/%E4%B8%8D%E7%9F%A5%E5%90%8D-%E8%8B%B1%E8%AF%AD%E7%B3%BB%E5%88%97%20U%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%AF%BE%E7%AD%94%E6%A1%88%E6%98%BE%E7%A4%BAU%E6%A0%A1%E5%9B%AD%E7%AD%94%E6%A1%88%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%A5%E9%9C%80%E8%A6%81%E4%BB%A3%E5%88%B7%E8%AF%B7%E7%9C%8B%E6%8F%8F%E8%BF%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';
      let userset = {
        hasInput: true,       //是否开启自动答题，如果设置为false，
        //每道题之间的答题间隔 [单位:毫秒]
        //无需延迟设置min和max为0即可
        //代表（随机1-3秒）    建议2-5秒
        min:1000,
        max:3000,
      }
    const wrapperId = "answerWrapper"
    const titleId = "answerTitle"
    const contentId = "answerContent"
    const innerText = html => {
        let div = document.createElement('div')
        div.innerHTML = html
        if (div.firstChild) {
            return div.firstChild.innerText
        } else {
            return null;
        }
    }
    const inputValue = (dom, st) => {
        if (/input/i.test(dom.tagName)) {
            var setValue = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            setValue.call(dom, st);
            var e = new Event('input', { bubbles: true });
            dom.dispatchEvent(e);
        } else {
            let evt = new InputEvent('input', {
                inputType: 'insertText',
                data: st,
                dataTransfer: null,
                isComposing: false
            });
            dom.value = st;
            dom.dispatchEvent(evt);
        }
    }
    const knownQuestionKeys = [
        "questions:shortanswer",
        "shortanswer:shortanswer",
        "questions:scoopquestions",
        "questions:sequence",
        "questions:questions",
        "questions:textmatch",
        "questions:bankedcloze",
        "questions:scoopselection"
    ]
    let Timer = function (func) {
        let hasLoaded = false;
        return function (selector, answers) {
          if (!userset.hasInput) {
                return;
            }
            if (hasLoaded) {
                return;
            }
            let cnt = 15;
            let handler = window.setInterval(() => {
                hasLoaded = true;
                if (!(cnt--)) {
                    window.clearInterval(handler);
                    location.reload(true);
                    alert("自动答题失败！");
                }
                hasLoaded = func(selector, answers, handler);
            }, 1000);
        }
    };
    let inputAnswers = Timer((selector, answers, handler) => {
            if (!userset.hasInput) {
                return;
            }
        let inputs = document.querySelectorAll(selector);
        let hasLoaded = true;
        if (inputs.length) {
            window.clearInterval(handler);
            hasLoaded = false;
            for (let i = 0; i < inputs.length; i++) {
                window.setTimeout(() => {
                    if (/(input)|(textarea)/i.test(inputs[i].tagName) && !inputs[i].value) {
setTimeout(function(){
                        inputs[i].click();
                        inputs[i].focus();
                        answers[i] = answers[i].replace('\n','');
                        if(answers[i].indexOf(" | ") != -1){
                            answers[i] = answers[i].split(" | ");
                            answers[i] = answers[i][0];
                           }
                        inputValue(inputs[i], answers[i]);
                        inputs[i].blur();
},Math.floor(Math.random() * (userset.max - userset.min + 1)) + userset.min);
                    }
                }, i * 500 + Math.random() * 300);
            }
        }
        return hasLoaded;
    });
    let selectAnswers = Timer((selector, answers, handler) => {
            if (!userset.hasInput) {
                return;
            }
            var xi;
            for (xi = 0; xi < selector.length; xi++){
            let lists = document.querySelectorAll(selector[xi]);
            if (lists.length != 0) {
                break;
           }
         }
        let lists = document.querySelectorAll(selector[xi]);
        let hasLoaded = true;
        if (lists.length) {
            window.clearInterval(handler);
            hasLoaded = false;
            for (let i = 0; i < lists.length; i++) {
                window.setTimeout(() => {
                    let inputs = lists[i].querySelectorAll('input[type="radio"]');
                    console.log(inputs)
                    for (let j = 0; j < inputs.length; j++) {
                        if (inputs[j].value === answers[i].toUpperCase() || inputs[j].value === answers[i].toLowerCase()) {
                            setTimeout(function(){
                              inputs[j].click();
                             },Math.floor(Math.random() * (userset.max - userset.min + 1)) + userset.min);
                        }
                    }
                }, i * 500 + Math.random() * 300);
            }
        }
        return hasLoaded;
    });
    const answerResolvers = [
        json => {
            console.log('answerResolvers' + 0);
            let answer = "";
            let answers = [];
            json.questions.forEach(question => {
                let text = `\n${innerText(question.analysis.html)}`
                answer += text;
                answers.push(innerText(question.analysis.html).replace('?', '').replace(/[\d]+?\./, '').trim());
            });
            inputAnswers('div.questions textarea', answers);
            return answer
        },
        json => {
            let answer = ""
            let as = [];
            let as2 = [];
            var iii;
            console.log('answerResolvers' + 1);
            if (!innerText(json.analysis.html)) {
                console.log("1")
                for (iii = 0; iii < json.questions.length; iii++) {
                answer = json.questions[iii];
                if (typeof answer === "string") {
                    answer = JSON.parse(answer);
                }
                answer = answer.analysis.html
                answer = innerText(answer);
                as2.push("\n"+answer)
                as.push(answer.replace('?', '').replace(/[\d]+?\./, '').trim())
              }
               console.log(as)
              inputAnswers('div.questions textarea', as);
              return as2;
            } else {
                console.log("2")
                answer = innerText(json.analysis.html);

            }
            inputAnswers('#mainLrRight textarea', [answer]);
            return answer;
        },
        json => {
            console.log('answerResolvers' + 2);
            let answer = [];
            let answers = [];
            var as = "";
            json.questions.forEach(question => {
                as = `\n${innerText(question.content.html)} ${question.answers.join(" | ")}`
                //    answer += `\n${ innerText(question.content.html) } ${ question.answers.join(" | ") }`
                //answer.push("answer:")
                answer.push(as)
                answers.push(question.answers[0]);
            });
            console.log("XX",answers)
            console.log(answer)
            inputAnswers('div#root div.questions input', answers);
            return answer
        },
        json => {
            console.log('answerResolvers' + 3);

            return json.questions.map(question => question.answer).join(", ")
        },
        json => {
           console.log('answerResolvers' + 4);
            //console.log(json.questions.map(question => question.answers))
            let answers = json.questions.map(question => question.answers[0]);
            if(answers[0].length > 1){
                inputAnswers('div#root div.questions input', answers);
            }else{
                selectAnswers(['#main-top ul','#mainLrRight ul'], answers);
            }
            return answers.join(", ")

            },
        json => {
            console.log('answerResolvers' + 5);
            let answers = json.questions.map(question => question.answer);
            inputAnswers('#mainLrRight input',answers);
            return answers.join(", ")
        },
        json => {
            console.log('answerResolvers' + 6);

            return json.questions.map(question => question.answer).join(", ")
        },
        json => {
            console.log('answerResolvers' + 7);
            var si;
            let answers = json.questions.map(question => question.answers[0]);
            for (si = 0;si < answers.length; si++){
             var numa;
             var as;
             var numb;
             numa = th(answers[si])
             as = innerText(json.questions[si].options[numa-1].content.html);
             numb = si+1
             answers[si] = "\n"+numb+". "+as;
            }
           // inputAnswers('div#root div.questions input', answers);
            return answers.join(", ");
        }
    ]
    const specialQuestions = [
        /^content_\d:questions$/,
    ]
    const specialscoopquestions = [
        /^content_\d:scoopquestions$/,
    ]
    const specialAnswerResolvers = [
        json => {
            let answer = ""
            let resolver = answerResolvers[knownQuestionKeys.indexOf("questions:questions")]
            console.log(resolver)
            answer = Object.keys(json).sort().map((key, index) => (index + 1) + ". " + resolver(json[key])).join('\n')
            console.log(answer)
            return answer+"\n[该选择题需手动换页，谢谢配合]！"
        },
    ]
    const showAnswer = json => {
        let answer = "No answer found"
        let isQuestion = true
        if (json != null && json.hasOwnProperty("content")) {
            let contentJson = JSON.parse(json.content)
            console.log("%c%s", "color: red; font-size: 16px;", JSON.stringify(contentJson, '', 2))
            let keys = Object.keys(contentJson)
            let key = keys[0]
            let keyIndex = knownQuestionKeys.indexOf(key)
            if (keyIndex !== -1) {
                answer = answerResolvers[keyIndex](contentJson[key])
                console.log("answer=" + answer);
            } else {
                let specialKeyIndex = -1
                specialQuestions.forEach((pattern, index) => {
                    if (pattern.test(key)) {
                        specialKeyIndex = index
                    }
                })
                if (specialKeyIndex == -1) {
                    console.log(contentJson)
                    specialscoopquestions.forEach((pattern, index) => {
                    if (pattern.test(key)) {
                        specialKeyIndex = index

                    }
                })
                }
                if (specialKeyIndex !== -1) {
                    console.log(contentJson)
                    answer = specialAnswerResolvers[specialKeyIndex](contentJson)
                } else {
                    answer = "Not a question\n" + JSON.stringify(contentJson, '', 2)
                    isQuestion = false
                }
            }
        }

        let title = "参考答案"
        let wrapperElem = document.getElementById(wrapperId) ? document.getElementById(wrapperId) : document.createElement("div");
        let titleElem = document.getElementById(titleId) ? document.getElementById(titleId) : document.createElement("div");
        let contentElem = document.getElementById(contentId) ? document.getElementById(contentId) : document.createElement("div");
        let br = document.createElement("br")
        let tuiguang = document.createElement("a")
        tuiguang.setAttribute("href","http://wpa.qq.com/msgrd?v=3&uin=41737035&site=qq&menu=yes")
        tuiguang.setAttribute("target","_blank")
        tuiguang.text = "查题机器人??"
        if (!isQuestion) {
            return
        }
        wrapperElem.setAttribute("id", wrapperId)
        titleElem.setAttribute("id", titleId)
        contentElem.setAttribute("id", contentId)
        wrapperElem.setAttribute("style",
            "top: 100px; left: 100px; margin: 0 auto; z-index: 1024; border-radius: 1em;"
            + " box-shadow: 0 11px 15px -7px rgba(0,0,0,.2), 0 24px 38px 3px rgba(0,0,0,.14), 0 9px 46px 8px rgba(0,0,0,.12);"
            + " position: absolute; background: #fff; width: 250px; max-height: 400px; min-height: 200px;")
        titleElem.setAttribute("style", "background: inherit; height: 25px; margin-top: 10px; text-align: center; font-size: x-large")
        contentElem.setAttribute("style", "margin: 10px; color: orange; font-size: medium; overflow-y: auto; max-height: 375px")
        titleElem.innerText = title
        contentElem.innerText = answer
        makeDraggable(titleElem)
        wrapperElem.appendChild(titleElem)
        contentElem.appendChild(br)
        contentElem.appendChild(tuiguang)
        wrapperElem.appendChild(contentElem)
        document.body.appendChild(wrapperElem)
    }
    const real_fetch = window.fetch
    window.fetch = (url, init = null) => real_fetch(url, init).then(response => {
        if (/.*\/course\/api\/content\//.test(url)) {
            let res = response.clone()
            res.json().then(showAnswer)
        }
        return response
    })
    function makeDraggable(elem) {
        document.mouseState = 'up'
        elem.mouseState = 'up'
        elem.lastMousePosY = null
        elem.lastMousePosX = null
        elem.proposedNewPosY = parseInt(elem.style.top, 10)
        elem.proposedNewPosX = parseInt(elem.style.left, 10)
        document.onmousedown = _ => {
            document.mouseState = 'down'
        }

        document.onmouseup = _ => {
            document.mouseState = 'up'
            elem.mouseState = 'up'
        }
        elem.onmousedown = e => {
            elem.lastMousePosY = e.pageY
            elem.lastMousePosX = e.pageX
            elem.mouseState = 'down'
            document.mouseState = 'down'
            document.onselectstart = e => {
                e.preventDefault()
                return false
            }
        }
        elem.onmouseup = e => {
            elem.mouseState = 'up'
            document.mouseState = 'up'
            document.onselectstart = null
        }
        const getAtInt = (obj, attrib) => parseInt(obj.style[attrib], 10)
        document.onmousemove = e => {
            if ((document.mouseState === 'down') && (elem.mouseState === 'down')) {
                elem.proposedNewPosY = getAtInt(elem.parentElement, 'top') + e.pageY - elem.lastMousePosY
                elem.proposedNewPosX = getAtInt(elem.parentElement, 'left') + e.pageX - elem.lastMousePosX
                if (elem.proposedNewPosY < 0) {
                    elem.parentElement.style.top = "0px"
                } else if (elem.proposedNewPosY > window.innerHeight - getAtInt(elem.parentElement, 'height')) {
                    elem.parentElement.style.top = window.innerHeight - getAtInt(elem.parentElement, 'height') + 'px'
                } else {
                    elem.parentElement.style.top = elem.proposedNewPosY + 'px'
                }
                if (elem.proposedNewPosX < 0) {
                    elem.parentElement.style.left = "0px"
                } else if (elem.proposedNewPosX > window.innerWidth - getAtInt(elem.parentElement, 'width')) {
                    elem.parentElement.style.left = window.innerWidth - getAtInt(elem.parentElement, 'width') + 'px'
                } else {
                    elem.parentElement.style.left = elem.proposedNewPosX + 'px'
                }
                elem.lastMousePosY = e.pageY
                elem.lastMousePosX = e.pageX
            }
        }
    }
    function th(s){
   return s.split("").map(function(o){
      return o.toUpperCase().charCodeAt()-64;
   }).join("");
}
})();
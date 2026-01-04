// ==UserScript==
// @name         自动点名机器人 - acfun.cn
// @namespace    http://tampermonkey.net/
// @version      0.17
// @description  掌门带点名机器人1.0版本
// @author       You
// @match        https://live.acfun.cn/live/34905158
// @icon         https://www.google.com/s2/favicons?domain=acfun.cn
// @grant        none
// @license      https://live.acfun.cn/live/34905158
// @downloadURL https://update.greasyfork.org/scripts/436542/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%90%8D%E6%9C%BA%E5%99%A8%E4%BA%BA%20-%20acfuncn.user.js
// @updateURL https://update.greasyfork.org/scripts/436542/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%90%8D%E6%9C%BA%E5%99%A8%E4%BA%BA%20-%20acfuncn.meta.js
// ==/UserScript==

setTimeout(() => {
  //自动带牌子! (虽然我没办 但你你么你给我带
      fetch(`https://www.acfun.cn/rest/pc-direct/fansClub/fans/medal/wear?uperId=34905158`, {
        method: 'post',
        credentials: 'include',
    })
    var like = function fireKeyEvent(el, evtType, keyCode) {
    var evtObj;
    if (document.createEvent) {
        if (window.KeyEvent) {//firefox 浏览器下模拟事件
            evtObj = document.createEvent('KeyEvents');
            evtObj.initKeyEvent(evtType, true, true, window, true, false, false, false, keyCode, 0);
        } else {//chrome 浏览器下模拟事件
            evtObj = document.createEvent('UIEvents');
            evtObj.initUIEvent(evtType, true, true, window, 1);
            delete evtObj.keyCode;
            if (typeof evtObj.keyCode === "undefined") {//为了模拟keycode
                Object.defineProperty(evtObj, "keyCode", { value: keyCode });
                Object.defineProperty(evtObj, "key", { value: "KeyL" });
                Object.defineProperty(evtObj, "code", { value: "KeyL" });
                Object.defineProperty(evtObj, "which", { value: "76" });
                Object.defineProperty(evtObj, "target", { value: "notTEXTAREA" });
            } else {
                evtObj.key = String.fromCharCode(keyCode);
            }
            if (typeof evtObj.ctrlKey === 'undefined') {//为了模拟ctrl键
                Object.defineProperty(evtObj, "ctrlKey", { value: true });
            } else {
                evtObj.ctrlKey = true;
            }
        }
        el.dispatchEvent(evtObj);
    } else if (document.createEventObject) {//IE 浏览器下模拟事件
        evtObj = document.createEventObject();
        evtObj.keyCode = keyCode
        el.fireEvent('on' + evtType, evtObj);
    }

    };
    window.setInterval(like, 1000,document.body,'keyup',76);
    window.inputValue = function (dom, st) {
        var evt = new InputEvent('input', {
            inputType: 'insertText',
            data: st,
            dataTransfer: null,
            isComposing: false
        });
        dom.value = st;
        dom.dispatchEvent(evt);
        }


        var targetNode = document.getElementsByClassName("live-feed-messages")[0]
        // 观察者的选项(要观察哪些突变)
        var config = { attributes: true, childList: true, subtree: true };
        var comments=["我来了我来了","我还在","在这在这","我来了","我回来了","不在","1111","????"]
        // 当观察到突变时执行的回调函数

        var callback = function (mutationsList, observer) {
            // Use traditional 'for loops' for IE 11
            console.log(mutationsList);
            console.log(observer);
            mutationsList.forEach(function (item, index) {
                var className = item["addedNodes"][index]["className"]
                if (className == "comment") {
                    console.log(item);
                    var message = item["addedNodes"][index]["innerText"].split("：")[1]

                    if (message.search("来|到|在|这") != -1&&comments.indexOf(message)==-1) {
                        // document.getElementsByClassName('danmaku-input')[1].value=comments[Math.floor(Math.random() * comments.length)]
                        window.inputValue(document.getElementsByClassName('danmaku-input')[1],comments[Math.floor(Math.random() * comments.length)])
                        //document.getElementsByClassName('send-btn')[1].setAttribute("class","send-btn enable")
                        document.getElementsByClassName('send-btn enable')[0].click();
                    }
                }
            })
        };


        // 创建一个链接到回调函数的观察者实例
        var observer = new MutationObserver(callback);

        // 开始观察已配置突变的目标节点
        observer.observe(targetNode, config);
}, 3000);

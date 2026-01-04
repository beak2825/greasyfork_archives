// ==UserScript==
// @name         mathonline crack answer
// @name:zh-cn   mathonline 破解答案
// @namespace    https://github.com/LINKLang
// @version      3.0.2
// @description  use toast to show the crack answer of mathonline task
// @description:zh-cn  使用 toast 破解显示 mathonline 作业的答案
// @author       Ling - LINK
// @match        https://www.mathsonline.com.au/students/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mathsonline.com.au
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503733/mathonline%20crack%20answer.user.js
// @updateURL https://update.greasyfork.org/scripts/503733/mathonline%20crack%20answer.meta.js
// ==/UserScript==

(function() {
    // 初始化，从本地存储读取状态
    var waitAnswer = null;
    var toastDisabled = localStorage.getItem('toastDisabled');
    if (toastDisabled === null) {
        toastDisabled = false;
        localStorage.setItem('toastDisabled', 'false');
    } else {
        toastDisabled = toastDisabled === 'true';
    }

    // function changeLStorage(varName, varValue) {
    //     localStorage.setItem(varName, `${varValue}`);
    //     if (varValue instanceof Boolean) {
    //         eval(`var ${varName} = localStorage.getItem('${varName}') === 'true';`);
    //     } else {
    //         eval(`var ${varName} = ${varValue}`);
    //     }
    // }

    function waitForElement(selector, callback, maxRetries = 100, interval = 500) {
        let attempts = 0;
    
        const checkExistence = () => {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
            } else if (attempts < maxRetries) {
                attempts++;
                setTimeout(checkExistence, interval);
            } else {
                console.log(`Element ${selector} not found after ${maxRetries} attempts.`);
            }
        };
    
        checkExistence();
    }

    function showToast(message, hideTimeLimit=3000, showWait=false) {
        if (toastDisabled) {waitAnswer=message; console.log(`waitanswer ${waitAnswer}`); return;}
        if (showWait && waitAnswer !== null) {console.log(`, \n\nWait to show answer is ${waitAnswer}`); message[0]+=`, \n\nWait to show answer is ${waitAnswer}`; console.log(message); waitAnswer=null;}
        const toast = document.createElement('div');
        toast.className = 'AnswerToast'
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.padding = '10px 20px';
        toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        toast.style.color = 'white';
        toast.style.borderRadius = '5px';
        toast.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        toast.style.zIndex = '9999';
        toast.style.fontSize = '16px';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s';
        
        var answer = "";
        for (let index = 1; index < message.length+1; index++) {
            // if (index != 1) {
            //     answer += ' ][ ';
            // }
            answer += `[ Q${index}: ${message[index-1]} ]`;
        }
        toast.textContent = answer;

        const existeToasts = document.querySelectorAll("div[class*='AnswerToast']");
        existeToasts.forEach(toast => {
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.parentNode.removeChild(toast);
            }, 500);
        });

        // 向body添加toast元素
        document.body.appendChild(toast);

        // 设置toast元素延迟1000毫秒后透明度变为1
        setTimeout(() => {
            toast.style.opacity = '1';
        }, 1000);

        // 设置toast元素 hideTimeLimit 秒后透明度变为0，并从页面中移除
        // const hideTimeout = setTimeout(() => {
        //     toast.style.opacity = '0';
        //     setTimeout(() => {
        //         document.body.removeChild(toast);
        //     }, 500);
        // }, hideTimeLimit);

        // 为toast元素添加点击事件，点击后禁用toast，清除定时器，透明度变为0，并从页面中移除
        toast.addEventListener('click', () => {
            localStorage.setItem('toastDisabled', 'true');
            toastDisabled = localStorage.getItem('toastDisabled') === 'true';
            waitAnswer=message; console.log(`waitanswer ${waitAnswer}`);
            console.log('Toasts disabled');
            // clearTimeout(hideTimeout);
            toast.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 500);
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'b') {
            if (toastDisabled){
                localStorage.setItem('toastDisabled', 'false');
                toastDisabled = localStorage.getItem('toastDisabled') === 'true';
                console.log('Toasts re-enabled');
                showToast(['Toasts re-enabled'], undefined, true);
            } else {
                localStorage.setItem('toastDisabled', 'true');
                toastDisabled = localStorage.getItem('toastDisabled') === 'true';
                // waitAnswer=message; console.log(`waitanswer ${waitAnswer}`);
                console.log('Toasts disabled');
                // clearTimeout(hideTimeout);
                const existeToasts = document.querySelectorAll("div[class*='AnswerToast']");
                existeToasts.forEach(toast => {
                    toast.style.opacity = '0';
                    setTimeout(() => {
                        toast.parentNode.removeChild(toast);
                    }, 500);
                });
            }
            // localStorage.setItem('toastDisabled', 'false');
            // toastDisabled = localStorage.getItem('toastDisabled') === 'true';
            // console.log('Toasts re-enabled');
            // showToast(['Toasts re-enabled'], undefined, true);
        }
    });
    document.querySelector('.navbar-brand').addEventListener('click', function(e) {
        if (toastDisabled) {
            e.preventDefault();
            localStorage.setItem('toastDisabled', 'false');
            toastDisabled = localStorage.getItem('toastDisabled') === 'true';
            console.log('Toasts re-enabled');
            showToast(['Toasts re-enabled'], undefined, true);
        }
    });

    var xhr = window.XMLHttpRequest;
    var originalOpen = xhr.prototype.open;
    var originalSend = xhr.prototype.send;
    xhr.prototype.open = function(method, url, async) {
        this._url = url;
        return originalOpen.apply(this, arguments);
    };

    xhr.prototype.send = function(data) {
        if (window.location.pathname.includes("/students/worksheets")){
            if (this._url.includes('ajax/svg_interactives/startQuestionSet?')){
                console.log('捕捉到特定URL的请求:', this._url);
                this.addEventListener("readystatechange", () => {
                    var Answers=[]; // 存放答案
                    if (this.readyState === 4 && this.status === 200) {
                        var AnswersIndex = 0; // 问题索引
                        // var startNewAnswer = false;
                        var currentQaStartIndex = null;
                        var lastQaType = null; // 记录上一个问题的类型
                        var jsonData = JSON.parse(this.responseText);
                        // console.log('Response:', jsonData);
                        // var data = jsonData.data.concat(jsonData.data);
                        // console.log('Data:', data);
                        
                        // 等待 .svgui-content-progress-nav 出现
                        waitForElement('#svgui-content-progress-nav', (navContainer) => {
                            console.log("#svgui-content-progress-nav create start looking");
                        
                            // 创建 MutationObserver 实例
                            const observer = new MutationObserver(() => {
                                const activeOption = navContainer.querySelector('.active');
                                
                                if (activeOption) {
                                    let questionIndex = activeOption.getAttribute('data-question-index');
                                    if (!questionIndex)
                                        questionIndex = 0;
                                    questionIndex = Number.parseInt(questionIndex);
                                    var components = jsonData.data[questionIndex].components;
                                    components = JSON.parse(components);
                                    console.log('Components:', components);
                                    for (let index = 1; index < components.length; index++) {
                                        console.log("index: ",index);
                                        var data = components[index].Data;
                                        console.log('Data:', data);
                                        console.log(components[index]);
                                        try {
                                            data = JSON.parse(data);
                                        } catch (e) {
                                            console.error('Failed to parse data as JSON:', e);
                                            break;
                                        }
                                        if (data && data.AutoTab) {
                                            AnswersIndex++;
                                            lastQaType = null;
                                            currentQaStartIndex = null; // 重置当前问题索引
                                        } else if (data && data.Answers) {
                                            if(lastQaType != 'blank' && lastQaType != null) {
                                                AnswersIndex++;
                                                lastQaType = null;
                                                currentQaStartIndex = null; // 重置当前问题索引
                                            }
                                            console.log('blank question');
                                            lastQaType = 'blank';
                                            let answer = data.Answers;
                                            console.log('Answer:', answer);
                                            if(currentQaStartIndex === null) {
                                                currentQaStartIndex = index;
                                                Answers[AnswersIndex] = "";
                                            } else {
                                                Answers[AnswersIndex] += ` | `;
                                            }
                                            Answers[AnswersIndex] += answer;

                                        } else if (data && data.Correct) {
                                            if(lastQaType != 'choice' && lastQaType != null) {
                                                AnswersIndex++;
                                                lastQaType = null;
                                                currentQaStartIndex = null; // 重置当前问题索引
                                            }
                                            console.log('choice question');
                                            lastQaType = 'choice';
                                            if(currentQaStartIndex === null) {
                                                currentQaStartIndex = index;
                                                Answers[AnswersIndex] = "option: ";
                                            }
                                            if (data.Correct === 'true') {
                                                let checkData = data.Value;
                                                console.log('checkData:', checkData);
                                                if(Answers[AnswersIndex] != "option: "){
                                                    Answers[AnswersIndex] += ` | `;
                                                }
                                                // if(checkData === undefined){
                                                    let currentQaIndex = index-currentQaStartIndex+1;
                                                    Answers[AnswersIndex] += currentQaIndex;
                                                // } else {
                                                //     // 获取子数组的长度
                                                //     let subarrayLength = components.length - currentQaStartIndex;
                                                //     console.log('subarrayLength:', subarrayLength);
                                                //     let currentQaIndex = subarrayLength - (index - currentQaStartIndex);
                                                //     console.log('currentQaIndex:', currentQaIndex);
                                                //     Answers[AnswersIndex] += currentQaIndex;
                                                // }
                                            }
                                        } else if (data && data.DropTargetID) {
                                            if(lastQaType != 'Drop' && lastQaType != null) {
                                                AnswersIndex++;
                                                lastQaType = null;
                                                currentQaStartIndex = null; // 重置当前问题索引
                                            }
                                            console.log('drag question');
                                            lastQaType = 'Drop';
                                            if(currentQaStartIndex === null) {
                                                currentQaStartIndex = index;
                                                Answers[AnswersIndex] = "option: ";
                                            }
                                            if (data.DropTargetID === '1') {
                                                let currentQaIndex = index-currentQaStartIndex+1;
                                                Answers[AnswersIndex] += currentQaIndex;
                                                if(Answers[AnswersIndex] != "option: "){
                                                    Answers[AnswersIndex] += ` | `;
                                                }
                                            }
                                        }
                                    }
                                    showToast(Answers);
                                    AnswersIndex = 0; // 问题索引
                                    // startNewAnswer = false;
                                    currentQaStartIndex = null;
                                    lastQaType = null; // 记录上一个问题的类型
                                    Answers=[]
                                    console.log(`Active question index: ${questionIndex}`);
                                }
                            });
                        
                            // 配置 MutationObserver，监听子节点和属性的变化
                            observer.observe(navContainer, {
                                attributes: true,
                                childList: true,
                                subtree: true,
                                attributeFilter: ['class']
                            });
                        });
                    } else {
                        console.log(this.readyState," ",this.status );
                    }
                });
            }
        }else{
            if (this._url.includes('/ajax/svg_interactives/getNextSvgInteractive?') || this._url.includes('/ajax/svg_interactives/startQuestionSet?')) {
                console.log('捕捉到特定URL的请求:', this._url);
                this.onreadystatechange = function() {
                    var Answers=[]; // 存放答案
                    if (this.readyState === 4 && this.status === 200) {
                        var AnswersIndex = 0; // 问题索引
                        // var startNewAnswer = false;
                        var currentQaStartIndex = null;
                        var lastQaType = null; // 记录上一个问题的类型
                        var jsonData = JSON.parse(this.responseText);
                        var components = jsonData.components;
                        console.log('Components:', components);
                        for (let index = 1; index < components.length; index++) {
                            console.log("index: ",index);
                            var data = components[index].Data;
                            try {
                                data = JSON.parse(data);
                            } catch (e) {
                                console.error('Failed to parse data as JSON:', e);
                                break;
                            }
                            if (data && data.AutoTab) {
                                AnswersIndex++;
                                lastQaType = null;
                                currentQaStartIndex = null; // 重置当前问题索引
                            } else if (data && data.Answers) {
                                if(lastQaType != 'blank' && lastQaType != null) {
                                    AnswersIndex++;
                                    lastQaType = null;
                                    currentQaStartIndex = null; // 重置当前问题索引
                                }
                                console.log('blank question');
                                lastQaType = 'blank';
                                let answer = data.Answers;
                                console.log('Answer:', answer);
                                if(currentQaStartIndex === null) {
                                    currentQaStartIndex = index;
                                    Answers[AnswersIndex] = "";
                                } else {
                                    Answers[AnswersIndex] += ` | `;
                                }
                                Answers[AnswersIndex] += answer;
                            } else if (data && data.Correct) {
                                if(lastQaType != 'choice' && lastQaType != null) {
                                    AnswersIndex++;
                                    lastQaType = null;
                                    currentQaStartIndex = null; // 重置当前问题索引
                                }
                                console.log('choice question');
                                lastQaType = 'choice';
                                if(currentQaStartIndex === null) {
                                    currentQaStartIndex = index;
                                    Answers[AnswersIndex] = "option: ";
                                }
                                if (data.Correct === 'true') {
                                    let checkData = data.Value;
                                    console.log('checkData:', checkData);
                                    if(Answers[AnswersIndex] != "option: "){
                                        Answers[AnswersIndex] += ` | `;
                                    }
                                    // if(checkData === undefined){
                                        let currentQaIndex = index-currentQaStartIndex+1;
                                        Answers[AnswersIndex] += currentQaIndex;
                                    // } else {
                                    //     // 获取子数组的长度
                                    //     let subarrayLength = components.length - currentQaStartIndex;
                                    //     console.log('subarrayLength:', subarrayLength);
                                    //     let currentQaIndex = subarrayLength - (index - currentQaStartIndex);
                                    //     console.log('currentQaIndex:', currentQaIndex);
                                    //     Answers[AnswersIndex] += currentQaIndex;
                                    // }
                                }
                            } else if (data && data.DropTargetID) {
                                if(lastQaType != 'Drop' && lastQaType != null) {
                                    AnswersIndex++;
                                    lastQaType = null;
                                    currentQaStartIndex = null; // 重置当前问题索引
                                }
                                console.log('drag question');
                                lastQaType = 'Drop';
                                if(currentQaStartIndex === null) {
                                    currentQaStartIndex = index;
                                    Answers[AnswersIndex] = "option: ";
                                }
                                if (data.DropTargetID === '1') {
                                    let currentQaIndex = index-currentQaStartIndex+1;
                                    Answers[AnswersIndex] += currentQaIndex;
                                    if(Answers[AnswersIndex] != "option: "){
                                        Answers[AnswersIndex] += ` | `;
                                    }
                                }
                            }
                        }
                        showToast(Answers)
                    }
                };
            }
        }
        return originalSend.apply(this, arguments);
    };
})();

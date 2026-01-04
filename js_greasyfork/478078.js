// ==UserScript==
// @name         Vtuber-GPT-TTS
// @namespace    GPT-TTS
// @version      0.2
// @description  用于模拟主播直播用的文字转语音脚本
// @author       ollwhl
// @match        https://flowgpt.com/chat
// @match        https://chat.openai.com/*
// @grant        GM_xmlhttpRequest
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.1/jquery.min.js
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478078/Vtuber-GPT-TTS.user.js
// @updateURL https://update.greasyfork.org/scripts/478078/Vtuber-GPT-TTS.meta.js
// ==/UserScript==
(function() {

    'use strict';
    var useGradioAPI=true;
    //是否使用Grdio的Api，如果不使用填写false
    //use gradioApi or not
    //GradioAPiを使うか、使わないならfalseをいれてください
    var localURL="http://127.0.0.1:5000";
    //填写你的本地TTS服务器地址
    //Enter your local TTS server address.
    //ローカルのTTSサーバーのアドレスを入力してください
    var gradioURL="https://xzjosh-carol-bert-vits2.hf.space/--replicas/x6tfx/";
    var gradioSpeaker="Carol"
    //填写Gradio服务器的地址，必须是在外部服务器部署的，如果是本地部署的Gradio没法读取文件，如果使用请先到Gradio的GUI上查看via API地址
    //Enter the address of the Gradio server. It must be deployed on an external server, as locally deployed Gradio cannot access files.Before using, please first check the 'via API' address on the Gradio GUI.
    //Gradioサーバーのアドレスを入力してください。外部サーバーにデプロイされている必要があり、ローカルにデプロイされたGradioはファイルにアクセスできません。使用する前に、GradioのGUIで'via API'のアドレスを確認してください。
    var inputQueue = [
        "台本：向直播间的观众问好",
        "台本：分享一下自己今天的心情和发生的事情",
        "台本：向观众介绍自己吃了什么",
        "台本：分享近期的一个小秘密或趣事",
        "台本：询问观众们最近是否有新的推荐歌曲","wait",
        "台本：推荐一首自己最近特别喜欢的歌",
        "台本：与观众进行一个“真心话大冒险”互动环节",
        "台本：询问观众们想知道关于自己哪方面的事情","wait",
        "台本：分享一下最近的工作或学习进展",
        "台本：询问观众最近有没有什么困扰或烦恼","wait",
        "台本：讲述一个自己经历过的困扰或烦恼",
        "台本：邀请观众分享自己的有趣故事或经历","wait",
        "台本：向观众展示一个新学的技能，如唱段新歌、朗诵等",
        "台本：询问观众对于自己未来的期望或建议","wait",
        "台本：分享对于未来的计划和期待",
        "台本：感谢观众们的陪伴，告知接下来的直播或活动计划",
        "台本：向直播间的观众说再见，告知下次直播的时间"
    ];
    var useLive2D = false;
    var toggleButton = document.createElement("button");
    if (!useGradioAPI) {
        toggleButton.textContent = "using LocalAPI";
        toggleButton.title = "Click to switch to Gradio API";
    } else {
        toggleButton.textContent = "using GradioAPI";
        toggleButton.title = "Click to switch to Local API";
    }
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '200px';
    toggleButton.style.right = '10px';
    toggleButton.style.zIndex = '9999';
    toggleButton.addEventListener("click", function () {
        useGradioAPI = !useGradioAPI;
        if (!useGradioAPI) {
            toggleButton.textContent = "using LocalAPI";
            toggleButton.title = "Click to switch to Gradio API";
        } else {
            toggleButton.textContent = "using GradioAPI";
            toggleButton.title = "Click to switch to Local API";
        }
    });
    document.body.appendChild(toggleButton);

    var massageClass;
    var baseDomain = window.location.hostname;
    if (baseDomain === "chat.openai.com") {
        massageClass=".prose";
    } else if (baseDomain === "flowgpt.com") {
        massageClass="div.flowgpt-markdown.prose-invert.flex-1.whitespace-pre-wrap.markdown-body.overflow-auto";
    } else {
        console.log("This is some other domain!");
    }

    document.addEventListener("beforescriptexecute", function(event) {
        var oldCSP = document.querySelector("meta[http-equiv='Content-Security-Policy']");
        if (oldCSP) {
            oldCSP.remove();
        }

        // Add the new CSP
        var newCSP = document.createElement("meta");
        newCSP.httpEquiv = "Content-Security-Policy";
        newCSP.content = "default-src 'self' https://xzjosh-carol-bert-vits2.hf.space; media-src 'self' https://xzjosh-carol-bert-vits2.hf.space;";
        document.head.appendChild(newCSP);
    });


    let startButton = document.createElement('button');
    startButton.innerText = 'StartTTS';
    startButton.style.position = 'fixed';
    startButton.style.top = '100px';
    startButton.style.right = '10px';
    startButton.style.zIndex = '9999';
    startButton.addEventListener('click', startScript);
    document.body.appendChild(startButton);

    let stopButton = document.createElement('button');
    stopButton.innerText = 'StopTTS';
    stopButton.style.position = 'fixed';
    stopButton.style.top = '150px';
    stopButton.style.right = '10px';
    stopButton.style.zIndex = '9999';
    stopButton.addEventListener('click', stopListening(massageClass));
    document.body.appendChild(stopButton);

    console.log("TTS script activate");
    var isListeningDomChange =false;

    let inputButton = document.createElement('button');
    inputButton.innerText = 'start act';
    inputButton.style.position = 'fixed';
    inputButton.style.top = '250px';
    inputButton.style.right = '10px';
    inputButton.style.zIndex = '9999';
    function startScript() {
        if(!isListeningDomChange){
            alert('TTS has started!');
             if (baseDomain === "flowgpt.com"){
            listenDOMChange('.chakra-text.css-1pw8fnh');
             }
            isListeningDomChange =true;
            startButton.innerText = 'TTS STARTED';
        }else{
            console.log("Speaker changed");
        }
        $(massageClass).addClass('processed');

        listenForNewElements('body',massageClass,checkText)
        inputButton.addEventListener('click', function() {
            startAct();
        });
        document.body.appendChild(inputButton);
        //listenKey(massageClass,checkText)
    }
    //setTimeout(function() {
    //    console.log("script activate 1");
    //    $('div.flowgpt-markdown.prose-invert.flex-1.whitespace-pre-wrap.markdown-body.overflow-auto').addClass('processed');
    //    listenKey('div.flowgpt-markdown.prose-invert.flex-1.whitespace-pre-wrap.markdown-body.overflow-auto',checkText);
    //}, 5000);
    const skip=0;
    var skipCount = skip;
    const requestQueue = [];
    var isRequestPending = false;
    var textChecked = false;
    var inputIndex = 0;
    var inputElement = '#prompt-textarea';
    console.log(inputElement);
    function inputText(inputElement){
       var element = $(inputElement);
        console.log("input element:",element);
        if (inputIndex < inputQueue.length) {
            var currentText = inputQueue[inputIndex];
            inputIndex++;
            if(currentText.includes("song:")){
                var songElement = ($("<div></div>"));
                songElement.text(currentText);
                console.log("songElement",songElement);
                //requestQueue.push(songElement);
                //console.log("push song request:",requestQueue.length);
                //sendNextText();
            }
            if(currentText.includes("wait")){
                alert("可以开始与主播互动了")
                isRunningAct=false;
                console.log('停止');
                inputButton.innertext='开始';
                clearInterval(intervalId);
                return
            }
            element.focus(); // 确保元素获取焦点
            let inputLabel = $(inputElement); //这里获取需要自动录入的input内容
            let lastValue = inputLabel[0].value;
            inputLabel[0].value = currentText;
            let event = new Event("input", { bubbles: true });
            //  React15
            event.simulated = true;
            //  React16 内部定义了descriptor拦截value，此处重置状态
            let tracker = inputLabel[0]._valueTracker;
            if (tracker) {
                tracker.setValue(lastValue);
            }
            inputLabel[0].dispatchEvent(event);
            var buttonToClick = $("button[data-testid='send-button']");
            buttonToClick.click();
            isTextFinish=false;
        } else {
            console.log("已经输入完所有文本");
            console.log('停止');
            inputButton.innertext='开始';
            clearInterval(intervalId);
            inputIndex=0;
        }
    }
    var isRunningAct=false;
    var intervalId;
    var isTextFinish = true;
    function startAct () {
        isRunningAct=!isRunningAct;
        if (isRunningAct) {
            console.log('开始');
            inputButton.innertext='停止';
            intervalId = setInterval(function () {
                if(isTextFinish){
                    inputText(inputElement);
                }
            }, 1000);
        } else {
            console.log('停止');
            inputButton.innertext='开始';
            clearInterval(intervalId);
        }
    }
    function checkText(element) {
        textChecked = true;
        if (!element.hasClass('processed')) {
            console.log(skipCount);
            if (skipCount > 0) {
                skipCount--;
            } else {
                skipCount = skip;
                var text = element.text();
                console.log(text);
                requestQueue.push(element)
                console.log("push text request:",requestQueue.length);
                sendNextText();
                element.addClass('processed');
            }
        }
    }
    function removeTextWithinBrackets(str) {
        return str.replace(/(\(.*?\)|（.*?）|\{.*?\})/g, '');;
    }
    function strToJson(str){
        if(str.includes("jsonCopy code")||str.includes("data")){
            str=str.trim();
            const jsonIndex = str.indexOf("{");
            var tmpStr = str.substring(jsonIndex);
            console.log(tmpStr)
            tmpStr=tmpStr.trim();
            try {
                var json=JSON.parse(tmpStr);
                console.log("json化成功：",json);
                return json;
            } catch (error) {
                console.log("json化失败：",tmpStr);
                return removeTextWithinBrackets(str);
            }
        }else{
            console.log("不是json类型");
            return removeTextWithinBrackets(str);
        }
    }
    var elementCompair;
    var audioQueue = [];
    var isPlaying = false;
    var route="text"
    function sendText(element) {
        if (isRequestPending) {
            console.log("等待上一个响应完成...");
            return;
        }
        isRequestPending = true;
        var json = strToJson(element.text());
        var text;
        if(useLive2D){
            useGradioAPI=false;
            text=json;
        }else{
            try{
                text=json.data[0]
            }catch{
                text=json;
            }
        }
        if(text===""||text===" "){
            isRequestPending = false;
            sendText(element);
        }
        if(useGradioAPI){
            console.log("sending request to gradioServer：",text );
            sendTextToGrodio(element);
        }else{
            console.log("sending request to localServer：",text );
            GM_xmlhttpRequest({
                method: "GET",
                url: "http://127.0.0.1:5000/" + route + "?text=" + encodeURIComponent(text),
                responseType: 'arraybuffer',
                onload: function(response) {
                    if (response.status >= 200 && response.status < 400) {
                        console.log("成功：", response);
                        isRequestPending = false;
                        var clonedBuffer = response.response.slice(0);
                        if(elementCompair!=element){
                            var playButton = $('<button>').text('播放').click(function() {
                                //playAudioWithBlob(savedAudioDataMap[text]);
                                //var audioBuffer = $(this).data(clonedBuffer);
                                elementCompair=element;
                                var jThis = element;
                                console.log("index :",element.text(),"data: ",element)
                                sendText(element);
                            });
                            element.after(playButton);
                        }
                        audioQueue.push(clonedBuffer);
                        playNextAudio();
                        //playAudio(clonedBuffer);
                        //playAudioWithBlob(savedAudioDataMap[text]);
                    } else {
                        console.log("出错：", response.statusText);
                        var textElement = $("<p>请求出错，请按F12查看控制台信息</p>");
                        element.after(textElement);
                    }
                },
                onerror: function(error) {
                    console.log("请求失败：", error);
                    var textElement = $("<p>请求失败，请按F12查看控制台信息</p>");
                    element.after(textElement);
                }
            });
        }
        sendNextText()
    }
    function sendNextText(){
        var interval;
        interval = setInterval(function () {
            if(requestQueue.length===0){
                console.log("STOP SEND")
                clearInterval(interval)
            }
            if(!isRequestPending){
                console.log("shift request:",requestQueue.length);
                sendText(requestQueue.shift());
            }else{
                console.log("wait last request respons");
            }
        }, 100); // 1秒延迟，根据需要调整
    }
    async function sendTextToGrodio(element){
        const urlObj = new URL(gradioURL);
        const baseDomain = urlObj.origin;
        var text = removeTextWithinBrackets(element.text());
        GM_xmlhttpRequest({
            method: "POST",
            url: baseDomain+"/run/predict",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify({
                "fn_index": 0,
                "data": [
                    text,
                    gradioSpeaker,
                    0.5,
                    0.6,
                    0.6,
                    1.2
                ]
            }),
            onload: function(response) {
                console.log("成功：", response);
                var path;
                var filePath;
                if (response && response.responseText) {
                    try {
                        const parsedResponse = JSON.parse(response.responseText);
                        if (Array.isArray(parsedResponse.data) && parsedResponse.data.length > 1) {
                            path = parsedResponse.data[1].name;
                            filePath=gradioURL+'file='+path;
                            console.log("filePath:", filePath);
                        } else {
                            console.error("Unexpected parsed response:", parsedResponse);
                        }
                    } catch (e) {
                        console.error("Failed to parse JSON:", e);
                    }
                } else {
                    console.error("Invalid or empty response:", response);
                }
                const id = path.match(/gradio\/([a-f0-9]+)\/audio\.wav/);
                console.log("sending request to :", filePath);
                GM_xmlhttpRequest({
                    method: "GET",
                    url: filePath,
                    responseType: 'arraybuffer',
                    onload: function(response) {
                        if (response.status >= 200 && response.status < 400) {
                            console.log("成功：", response);
                            isRequestPending = false;
                            var clonedBuffer = response.response.slice(0);
                            if(elementCompair!=element){
                                var playButton = $('<button>').text('播放').click(function() {
                                    GM_xmlhttpRequest({
                                        method: "GET",
                                        url: filePath,
                                        responseType: 'arraybuffer',
                                        onload: function(response) {
                                            if (response.status >= 200 && response.status < 400) {
                                                isSending=false;
                                                console.log("成功：", response);
                                                var clonedBuffer = response.response.slice(0);
                                                audioQueue.push(clonedBuffer);
                                                playNextAudio();
                                                //playAudioWithBlob(savedAudioDataMap[text]);
                                            } else {
                                                console.log("出错：", response.statusText);
                                                var textElement = $("<p>请求出错，请按F12查看控制台信息</p>");
                                                element.after(textElement);
                                            }
                                        },
                                        onerror: function(error) {
                                            console.log("请求失败：", error);
                                            var textElement = $("<p>请求失败，请按F12查看控制台信息</p>");
                                            element.after(textElement);
                                        }
                                    });
                                });
                                element.after(playButton);
                            }
                            audioQueue.push(clonedBuffer);
                            playNextAudio();
                            //playAudioWithBlob(savedAudioDataMap[text]);
                        } else {
                            console.log("出错：", response.statusText);
                        }
                    },
                    onerror: function(error) {
                        console.log("请求失败：", error);
                        var textElement = $("<p>请求出错，请按F12查看控制台信息</p>");
                        targetElement.after(textElement);
                    }
                });
            },
            onerror: function(response) {
                console.log("Error: ", response);
            }
        })};
    function addPlayButton(element,text){
        var playButton = $('<button>').text('播放').click(function() {
            playAudio(savedAudioDataMap[text]);
        });
        element.after(playButton);
    }
    function playAudioWithBlob(audioData, mimeType = 'audio/wav') {
        const blob = new Blob([audioData], { type: mimeType });
        const audio = new Audio(URL.createObjectURL(blob));
        audio.play();
    }
    async function playAudio(audioData) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        try {
            const buffer = await audioContext.decodeAudioData(audioData);
            const audioSource = audioContext.createBufferSource();
            audioSource.buffer = buffer;
            audioSource.connect(audioContext.destination);
            audioSource.start();
        } catch (error) {
            console.error('Error decoding audio data:', error);
        }
    }
    function playNextAudio() {
        if (audioQueue.length > 0 && !isPlaying) {
            isPlaying = true;
            var audioData = audioQueue.shift();

            var audioContext = new (window.AudioContext || window.webkitAudioContext)();
            audioContext.decodeAudioData(audioData, function (buffer) {
                var audioSource = audioContext.createBufferSource();
                audioSource.buffer = buffer;
                audioSource.connect(audioContext.destination);
                audioSource.start();
                audioSource.onended = function () {
                    isPlaying = false;
                    playNextAudio();
                };
            });
        }
    }
    function listenDOMChange(selectorTxt) {
        var targetNode = $(selectorTxt).get(0);

        var config = { childList: true, subtree: true, characterData: true };

        var callback = function(mutationsList) {
            for(var mutation of mutationsList) {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    //stopListening('div.flowgpt-markdown.prose-invert.flex-1.whitespace-pre-wrap.markdown-body.overflow-auto');
                    startScript();
                }
            }
        };

        var observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    };
    var isListening = false;
    function listenKey(selectorTxt, actionFunction, bWaitOnce, iframeSelector) {
        if (isListening) {
            return;
        }
        isListening = true;
        var targetNodes, btargetsFound;

        if (typeof iframeSelector == "undefined")
            targetNodes = $(selectorTxt);
        else
            targetNodes = $(iframeSelector).contents()
                .find(selectorTxt);

        if (targetNodes && targetNodes.length > 0) {
            btargetsFound = true;
            targetNodes.each(function () {
                var jThis = $(this);
                var alreadyFound = jThis.data('alreadyFound') || false;

                if (!alreadyFound) {
                    jThis.addClass('listened-element');
                    var initialContent = jThis.html();
                    var cancelFound = false;
                    var interval = setInterval(function () {
                        var currentContent = jThis.html();
                        if (initialContent !== currentContent) {
                            clearInterval(interval);
                            cancelFound = actionFunction(jThis);
                            jThis.data('alreadyFound', true);
                            jThis.removeClass('listened-element'); 
                            if (!cancelFound) {
                                listenKey(selectorTxt, actionFunction, bWaitOnce, iframeSelector);
                            }
                        }
                    }, 2000);
                }
            });
        } else {
            btargetsFound = false;
        }

        var controlObj = listenKey.controlObj || {};
        var controlKey = selectorTxt.replace(/[^\w]/g, "_");
        var timeControl = controlObj[controlKey];

        if (btargetsFound && bWaitOnce && timeControl) {
            clearInterval(timeControl);
            delete controlObj[controlKey];
        } else {
            if (!timeControl) {
                timeControl = setInterval(function () {
                    listenKey(selectorTxt, actionFunction, bWaitOnce, iframeSelector);
                }, 300);
                controlObj[controlKey] = timeControl;
            }
        }
        isListening = false;
        listenKey.controlObj = controlObj;
    }
    function listenForNewElements(parentSelector, childSelector, actionFunction, iframeSelector) {
        var parentNodes;

        if (typeof iframeSelector == "undefined") {
            parentNodes = $(parentSelector);
        } else {
            parentNodes = $(iframeSelector).contents().find(parentSelector);
        }

        parentNodes.each(function() {
            var jThis = $(this);
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList') {
                        $(mutation.addedNodes).each(function() {
                            var newNode = $(this);
                            if (newNode.is(childSelector)) {
                                waitForElementStability3(newNode, actionFunction);
                            }
                        });
                    }
                });
            });

            var config = { childList: true, subtree: true };
            observer.observe(jThis[0], config);
        });
    }
    function waitForElementStability1(element, actionFunction) {
        var lastContent = element.html();
        var stabilityTimer = null;
        var stabilityDelay = 1000; 

        var observer = new MutationObserver(function() {
            console.log($('.btn.relative.btn-neutral').text().includes("Stop generating"));
            if (element.html() !== lastContent&&!$('.btn.relative.btn-neutral').text().includes("Stop generating")) {
                lastContent = element.html();
                if (stabilityTimer) {
                    clearTimeout(stabilityTimer); 
                }
                stabilityTimer = setTimeout(function() {
                    actionFunction(element);
                    observer.disconnect();
                }, stabilityDelay);
            }
        });

        observer.observe(element[0], { childList: true, subtree: true });
    }
    function waitForElementStability3(element, actionFunction, checkInterval) {
        checkInterval = checkInterval || 1000;  
        var interval = setInterval(function() {
            console.log(element.length && !$('.btn.relative.btn-neutral').text().includes("Stop generating"),)
            if (element.length && !$('.btn.relative.btn-neutral').text().includes("Stop generating")) {
                isTextFinish=true;
                actionFunction(element);
                clearInterval(interval);
            }
        }, checkInterval);
    }
    function waitForElementStability2(element, actionFunction, waitTime) {
        var timer = null;
        waitTime = waitTime || 500; 

        if (!element.length) {
            return;
        }
        var observer = new MutationObserver(function(mutations) {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(function() {
                if (!$('.btn.relative.btn-neutral').text().includes("Stop generating")) {
                    console.log($('.btn.relative.btn-neutral').text());
                    actionFunction(element);
                    timer = null;
                }
            }, waitTime);
        });
        observer.observe(element[0], { childList: true, subtree: true });
    }
    function stopListening(elementText){
        startButton.innerText = 'StartTTS'
        var myElement = $(elementText);
        var clonedElement = myElement.clone(true);
        myElement.replaceWith(clonedElement);
    }
    // Your code here...
})();
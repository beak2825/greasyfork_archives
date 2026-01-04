// ==UserScript==
// @name         Twitch Smooth Scroll
// @namespace    TwitchSmoothScrollScript
// @version      0.2
// @description TwitchのチャットをNCVのようにスクロールさせます。
// @author       EEE
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451316/Twitch%20Smooth%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/451316/Twitch%20Smooth%20Scroll.meta.js
// ==/UserScript==

(function() {
    //頻繁に変わりそうなクラス名など
    const ClassName = {
        AddedChat: ()=>{return "chat-line__message"},
        ChatField: ()=>{return "chat-scrollable-area__message-container"},
        ChatMessageContainer: () => {return "chat-line__no-background"},
    }

    const Element = {
        GetChatField: () => {
            return document.getElementsByClassName(ClassName.ChatField())[0]
        },
        GetMessageElement: (chat) => {
            return chat.getElementsByClassName(ClassName.ChatMessageContainer())[0]
        }
    }

    let chatQueue = new Queue();
    let waitInterval;
    let chatLoopInterval;
    let loopMs = 100;

    const ChatFieldObserver = new MutationObserver(function(mutations){
        mutations.forEach(function(e){
            let chat = e.addedNodes;

            for(let i = 0; i < chat.length; i++){
                //if(chat[i].className != ClassName.AddedChat()){
                //    continue;
                //}
                if(chat[i] == undefined){
                    continue;
                }
                try {
                    HideElement(chat[i]);
                    chatQueue.enqueue(chat[i]);

                }
                catch ( e ) {
                    console.error(e.message);
                }
                finally{
                    continue;
                }
            }
        })
    });

    window.onload = function(){
        WaitPageLoaded();
    }

    function ShowChatLoop(){
        const size = chatQueue.size();

        if(0 < size){
            let chat = chatQueue.dequeue()
            ShowElement(chat);
        }

        if(size < 5){
            loopMs = 100;
        }
        else if(5 <= size && size < 10){
            loopMs = 50;
        }
        else if(10 <= size){
            loopMs = 20;
        }

        setTimeout(ShowChatLoop, loopMs);
    }

    function WaitPageLoaded(){
        let count = 1;
        clearInterval(waitInterval);

        waitInterval = setInterval(function(){
            count++;

            //console.log(ClassName.ChatField());

            //発見時
            if(Element.GetChatField() !== undefined){
                log('Element detected.');
                Initialize();

                count = 0;
                clearInterval(waitInterval);
            }

            //発見不可
            if(10 < count){
                log('Element cannot be found.');

                count = 0;
                clearInterval(waitInterval);
            }

        },1000);
    }

    function Initialize(){
        ChatFieldObserver.disconnect();
        ChatFieldObserver.observe(
            Element.GetChatField(),
            {childList: true}
        );

        ShowChatLoop();
    }

    //指定のエレメントを非表示
    function HideElement(element){
        element.style.display = "none";
    }

    function ShowElement(element){
        element.style.display = "block";
    }

    function log(text){
        console.log("【TSS】"+text);
    }

    //
    // Queue (FIFO)
    //

    function Queue() {
        this.__a = new Array();
    }

    Queue.prototype.enqueue = function(o) {
        this.__a.push(o);
    }

    Queue.prototype.dequeue = function() {
        if( this.__a.length > 0 ) {
            return this.__a.shift();
        }
        return null;
    }

    Queue.prototype.size = function() {
        return this.__a.length;
    }

    Queue.prototype.toString = function() {
        return '[' + this.__a.join(',') + ']';
    }

})();
// ==UserScript==
// @name         B站直播间删投喂礼物弹幕
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  删除礼物投喂弹幕，禁止评论栏上下跳动
// @author       You
// @license MIT
// @match        https://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443421/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E5%88%A0%E6%8A%95%E5%96%82%E7%A4%BC%E7%89%A9%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/443421/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E5%88%A0%E6%8A%95%E5%96%82%E7%A4%BC%E7%89%A9%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

function debug(message){
    console.log('[DEBUG]:',message)
}
function error(message){
    console.log('[ERROR]:',message)
}
function info(message){
    console.log('[INFO]:',message)
}
function print(message){
    console.log(message)
}

function ban_sleep(){
    const o_settimeout = setTimeout
    const o_setInterval = setInterval
    const sleep_function_name = 'triggerSleepCallback'
    setTimeout = function(func,...args){
        if(func.toString().indexOf(sleep_function_name) > -1){
            info('ban sleep')
            return null
        }
        return o_settimeout.call(this,func,...args)
    }

    setInterval = function(func,...args){
        if(func.toString().indexOf(sleep_function_name) > -1){
            info('ban sleep')
            return null
        }
        return o_setInterval.call(this,func,...args)
    }

}
class ChatListListen{
    constructor(class_name){
        this.class_name = class_name
        this._chat_list = null
        this.filter_gift_danmu = 0
        this.filter_style_change = 0

    }
    inject_style(){
        const style = document.createElement('style')
        style
    }
    set chat_list(value){
        this._chat_list = value
        this.shortest_class = value.className
        const chat_mutation = new MutationObserver(this.chat_list_changed.bind(this))
        const config = {childList:true,subtree:true}
        chat_mutation.observe(this._chat_list,config)

        const style_mutation = new MutationObserver(this.chat_list_style_changed.bind(this))
        const style_config = {attributes:true}
        style_mutation.observe(this._chat_list,style_config)

    }
    get char_list(){
        return this.char_list
    }
    chat_list_style_changed(mutations,ob){
        for(let mutation of mutations){
            if(mutation.target){
                if(mutation.target.className.indexOf('ps--active-y') > -1){
                    mutation.target.classList.remove('ps--active-y')
                    this.filter_style_change ++
                }
                if(mutation.target.className.indexOf('with-penury-gift') > -1){
                    mutation.target.classList.remove('with-penury-gift')
                    this.filter_style_change ++
                }
            }
        }
    }
    chat_list_changed(mutations,ob){
        for(let mutation of mutations){
            if(mutation.type == 'childList'){
                for(let node of mutation.addedNodes){
                    if(node.classList.contains('gift-item')){
                        node.style.display = 'none'
                        this.filter_gift_danmu ++
                    }
                }
            }
        }
    }
    listen(){
        const char_list = document.getElementsByClassName(this.class_name)[0]
        if(char_list){
            this.chat_list = char_list
            const penury = document.getElementById('penury-gift-msg')
            penury && penury.parentElement.removeChild(penury)
        }else{
            requestAnimationFrame(this.listen.bind(this))
        }
    }
}
(function() {
    'use strict';
    var char_list = new ChatListListen('chat-history-list')
    ban_sleep()
    char_list.listen()
})();


// ==UserScript==
// @name         Twitch User Chat Log
// @namespace    TwitchUserChatLogScript
// @version      1.1
// @description  Twitchで他のユーザーのチャット履歴を見ることができるスクリプトです.
// @author       Emble
// @match        https://www.twitch.tv/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423510/Twitch%20User%20Chat%20Log.user.js
// @updateURL https://update.greasyfork.org/scripts/423510/Twitch%20User%20Chat%20Log.meta.js
// ==/UserScript==

(function() {
    var intervalID = []
    let retryCounter = [0, 0]
    const Page = {
        isStreaming: (location.pathname.indexOf('video') !== -1)? false : true,
        getChatArea: ()=>{return (location.pathname.indexOf('video') !== -1)?document.getElementsByClassName('tw-align-items-end tw-flex tw-flex-wrap tw-full-width')[0]:document.getElementsByClassName('chat-scrollable-area__message-container tw-flex-grow-1 tw-pd-b-1')[0]},
        putOpenPanelButton: ()=>{
            if(!Page.checkExistElementClass('tw-flex tw-flex-grow-1 tw-flex-wrap tw-mg-b-05 tw-mg-l-1')){
                return
            }
            const prt = document.getElementsByClassName('tw-flex tw-flex-grow-1 tw-flex-wrap tw-mg-b-05 tw-mg-l-1')[0]
            const btn = document.createElement('div')
            btn.className = 'tw-mg-r-05 tw-mg-t-05'
            btn.innerHTML = HTML.logButton

            prt.appendChild(btn)
            return
        },
        putClosePanelButton: ()=>{
            if(!Page.checkExistElementId('TUCL_top_bar') || Page.checkExistElementId('TUCL_button_close_panel')){
                return
            }
            const prt = document.getElementById('TUCL_top_bar')
            const btn = document.createElement('button')
            btn.id = 'TUCL_button_close_panel'
            btn.innerHTML = '<span>X</span>'
            btn.style.width = '20px'
            btn.style.height = '20px'
            btn.style.zIndex = '2'
            btn.onclick = Page.closeLogPanel

            prt.appendChild(btn)
        },
        putEvent: ()=>{
            document.getElementById('TUCL_button_open_panel').onclick = Page.createLogPanel
            return
        },
        createLogPanel: ()=>{
            if(Page.checkExistElementId('TUCL_LogPanel')){
                Page.clearChatLog()
                Page.drawChatLog()
                return
            }
            const pr = document.getElementsByClassName('chat-room__content tw-c-text-base tw-flex tw-flex-column tw-flex-grow-1 tw-flex-nowrap tw-full-height tw-relative')[0]
            const pl = document.createElement('div')
            pl.id = 'TUCL_LogPanel'
            pl.style.background = 'var(--color-background-body)'
            pl.style.overflowY = 'scroll'
            pl.style.whiteSpace = 'normal'
            pl.style.position = 'absolute'
            pl.style.width = '350px'
            pl.style.height = '400px'
            pl.style.left = '-300px'
            pl.style.opacity = '90%'
            pl.style.zIndex = '1'
            pl.innerHTML = '<div id="TUCL_top_bar"></div><div id="TUCL_chat_log_list"></div>'

            pr.appendChild(pl)

            Page.drawChatLog()
            Page.putClosePanelButton()
        },
        closeLogPanel: ()=>{
            const el = document.getElementById('TUCL_LogPanel')
            el.parentNode.removeChild(el)
        },
        clearChatLog: ()=>{
            if(!Page.checkExistElementId('TUCL_chat_log_list')){
                return
            }
            document.getElementById('TUCL_chat_log_list').innerHTML = ''
        },
        getTargetUserName: () => {
            const el = document.getElementsByClassName('tw-link tw-link--hover-color-inherit tw-link--hover-underline-none tw-link--inherit')[0]
            const href = el.getAttribute('href')
            console.log(href.substr(1))
            return href.substr(1)
        },
        drawChatLog: () => {
            if(!Page.checkExistElementId('TUCL_chat_log_list')){
                return
            }
            const name = Page.getTargetUserName()
            //名前の検索
            const array = JSON.parse(sessionStorage.getItem('TUCL_Log'))
            let chatLog = []
            for(let key of Object.keys(array)){
                if(key == name){
                    chatLog = array[key]
                    break
                }
            }
            let html = ''
            chatLog.map((chat)=>{
                html += '<span style="font-size: 16px;color: var(--color-text-base);display: block;border-bottom: solid 1px var(--color-text-base);">'+chat+'</span>'
            })

            const panel = document.getElementById('TUCL_chat_log_list')
            panel.innerHTML = html
            console.log(chatLog)
        },
        waitUserCardLoading: ()=>{
            clearInterval(intervalID[1])
            intervalID[1] = setInterval(()=>{
                if(Page.checkExistElementClass('tw-flex tw-flex-grow-1 tw-flex-wrap tw-mg-b-05 tw-mg-l-1')){
                    if(!Page.checkExistElementId('TUCL_Label')){
                        Page.putOpenPanelButton()
                        Page.putEvent()
                    }
                    Page.clearChatLog()
                    Page.drawChatLog()

                    clearInterval(intervalID[1])
                }
                if(retryCounter[1] > 10){
                    clearInterval(intervalID[1])
                }
            },500)
        },
        observeUserCard: new MutationObserver((ms)=>{
            ms.forEach((e) => {
                const addedElements = e.addedNodes
                for(let i = 0; i < addedElements.length; i++){
                    if(addedElements[i].getAttribute('data-a-target') === 'viewer-card-positioner'
                       || addedElements[i].className==='tw-border-radius-medium tw-c-background-base tw-elevation-2 tw-flex tw-flex-column viewer-card'){
                        Page.waitUserCardLoading()
                    }
                }
            })
        }),
        checkExistElementId: (el) => {
            if(document.getElementById(el) !== null){
                return true
            }
            return false
        },
        checkExistElementClass: (el) => {
            if(document.getElementsByClassName(el).length > 0){
                return true
            }
            return false
        }
    }

    const HTML = {
        logButton: `<div class="tw-inline-flex viewer-card-drag-cancel" id="TUCL_Label">
  <button class="ScCoreButton-sc-1qn4ixc-0 ScCoreButtonPrimary-sc-1qn4ixc-1 jeBpig tw-core-button" data-a-target="usercard-whisper-button" data-test-selector="whisper-button" id="TUCL_button_open_panel">
    <div class="ScCoreButtonLabel-lh1yxp-0 bUTtZU tw-core-button-label">
      <div class="tw-align-items-center tw-flex tw-mg-r-05">
        <div class="ScCoreButtonIcon-khv8ri-0 fVWBSS tw-core-button-icon">
          <div class="ScIconLayout-sc-1bgeryd-0 kbOjdP tw-icon" data-a-selector="tw-core-button-icon">
            <div class="ScAspectRatio-sc-1sw3lwy-1 dNNaBC tw-aspect">
              <div class="ScAspectSpacer-sc-1sw3lwy-0 gkBhyN">
              </div>
              <svg width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px" class="ScIconSVG-sc-1bgeryd-1 cMQeyU"><g><path fill-rule="evenodd" d="M7.828 13L10 15.172 12.172 13H15V5H5v8h2.828zM10 18l-3-3H5a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2l-3 3z" clip-rule="evenodd"></path></g></svg>
            </div>
          </div>
        </div>
      </div>
      <div data-a-target="tw-core-button-label-text" class="tw-align-items-center tw-flex tw-flex-grow-0 tw-justify-content-start">
        履歴
      </div>
    </div>
  </button>
</div>`
    }

    const Chat = {
        Observer: new MutationObserver((ms) => {
            ms.forEach((e) => {
                const addedChats = e.addedNodes
                for(let i = 0; i < addedChats.length; i++){
                    if(addedChats[i].className === 'tw-accent-region'){
                        continue
                    }

                    const chatData = Chat.convertChat(addedChats[i])
                    addStorage(chatData.userName, chatData.chat)
                }
            })
        }),
        convertChat: (chat) =>{
            let Data = {
                chat: null,
                userName: null
            }
            const getUserName = () => {
                if(chat.getElementsByClassName('chat-author__intl-login').length > 0){
                    const name = chat.getElementsByClassName('chat-author__intl-login')[0].innerHTML
                    return name.match(/(?<=\().*?(?=\))/)[0]
                }
                if(chat.getElementsByClassName('chat-author__display-name').length > 0){
                    return chat.getElementsByClassName('chat-author__display-name')[0].innerHTML
                }
                return null
            }
            Data.chat = (chat.getElementsByClassName('text-fragment')[0])?chat.getElementsByClassName('text-fragment')[0].innerHTML:null
            Data.userName = getUserName()

            return Data
        }
    }

    const findChatArea = (c) => {
        intervalID[0] = setInterval(()=>{
            let chatAreaElement = Page.getChatArea()
            if(chatAreaElement !== undefined ){
                log('Found element')

                initialize()
                clearInterval(intervalID[0])
            }
            if(retryCounter[0] > c){
                log('Element not found.')

                clearInterval(intervalID[0])
            }
            retryCounter++
        },1000)
    }
    const runObserver = () => {
        if(Page.getChatArea() === undefined || null)return
        if(document.getElementsByClassName('tw-full-height tw-full-width tw-relative tw-z-above viewer-card-layer').length <= 0)return

        Page.observeUserCard.disconnect()
        Page.observeUserCard.observe(document.getElementsByClassName('tw-full-height tw-full-width tw-relative tw-z-above viewer-card-layer')[0],
                                     {childList: true,
                                     characterData: true,
                                     subtree: true})
        Chat.Observer.disconnect()
        Chat.Observer.observe(Page.getChatArea(), {childList: true})
    }
    const initialize = () => {
        if(!sessionStorage.getItem('TUCL_Log')){
            let array = {}
            sessionStorage.setItem('TUCL_Log', JSON.stringify(array))
        }

        runObserver()
    }
    const addStorage = (name, chat) =>{
        /*
        * let array = {
        *   "user1": ["chat1", "chat2"],
        *   "user2": ["chatA", "chatB", "chatC"]
        *    .
        *    .
        *    .
        * }
        */

        //名前の検索
        let array = JSON.parse(sessionStorage.getItem('TUCL_Log'))
        for(let key of Object.keys(array)){
            if(key == name){
                let val = array[key]
                val.push(chat)
                array[key] = val
                sessionStorage.setItem('TUCL_Log', JSON.stringify(array))
                return
            }
        }
        //見つからなければ新規追加
        array[name] = []
        let val = array[name]
        val.push(chat)
        array[name] = val
        sessionStorage.setItem('TUCL_Log', JSON.stringify(array))
    }
    const getStorage = (n) => {
        return JSON.parse(sessionStorage.getItem('TUCL_Log'))
    }
    const openLogWindow = () => {

    }
    let storedHref = location.href;
    const URLObserver = new MutationObserver(function(ms){
        ms.forEach(function(m){
            if(storedHref !== location.href){
                storedHref = location.href
                log('URL Changed', storedHref, location.href)

                Chat.Observer.disconnect()
                clearInterval(intervalID[0])
                findChatArea(60)
            }
        })
    })
    const log = (m) => console.log('[TUCL] '+m)

    window.onload = () => {
        if(!sessionStorage){
            alert('セッションストレージ非対応ブラウザです。')
            return
        }
        URLObserver.observe(document, {childList: true, subtree: true})
        findChatArea(60)
    }
})()
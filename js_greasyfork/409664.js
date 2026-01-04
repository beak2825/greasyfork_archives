// ==UserScript==
// @name            Chat Filter for Youtube Live
// @namespace       ChatFilterForYoutubeLive
// @version         0.2
// @description     特定の単語やユーザーを含んだチャットを非表示にできるスクリプトです
// @author          emblejp
// @name:en         Chat Filter for Youtube Live
// @description:en  Filter chats for Youtube Live
// @match           https://www.youtube.com/*
// @require         https://code.jquery.com/jquery-3.3.1.min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js
// @resource        toastrCSS https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_addStyle
// @grant           GM_getResourceText
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/409664/Chat%20Filter%20for%20Youtube%20Live.user.js
// @updateURL https://update.greasyfork.org/scripts/409664/Chat%20Filter%20for%20Youtube%20Live.meta.js
// ==/UserScript==
(function(){
    GM_addStyle(GM_getResourceText('toastrCSS'))

    let USER_CONFIG = {
        Lang: GM_getValue('CFY_LANG')||'EN',

        NGWords: GM_getValue('CFY_NG_WORDS')||'',

        NGRegWords: GM_getValue('CFY_NG_REG_WORDS')||'',

        NGUsers: GM_getValue('CFY_NG_USERS')||'',
    }

    const LIVE_PAGE = {
        getChatField: ()=>{
            let chatField
            if(document.getElementById('chatframe')!==null){
                chatField = document.getElementById('chatframe').contentDocument.querySelector("#items.style-scope.yt-live-chat-item-list-renderer")
            }else{
                chatField = document.querySelector("#items.style-scope.yt-live-chat-item-list-renderer")
            }
            return chatField
        }
    }

    let SETTINGS = {
        CreateNGButtons: true,
        SimpleChatField: false,
        DisplaySettingPanel: false,
        NGWords: [],
        NGRegWords: [],
        NGUsers: [],
        UserID: '',
    }

    $(document).ready(() => {
        setTimeout(function(){
            findChatField()
        }, 1000)
    })

    //URL変更検知オブザーバー
    let storedHref = location.href;
    const URLObserver = new MutationObserver(function(mutations){
        mutations.forEach(function(mutation){
            if(storedHref !== location.href){
                findChatField()
                storedHref = location.href
                log('URL Changed', storedHref, location.href)
            }
        })
    })
    //URL監視
    URLObserver.disconnect()
    URLObserver.observe(document, {childList: true, subtree: true})

    var findInterval
    const findChatField = () =>{
        let FindCount = 1
        clearInterval(findInterval)
        findInterval = setInterval(function(){
            FindCount++
            if(FindCount > 180){
                log('The element cannot be found')
                clearInterval(findInterval)
                FindCount = 0
            }
            if(document.getElementById('chatframe')){
                if(LIVE_PAGE.getChatField() !== null){
                    log('Found the element: ')
                    console.log(LIVE_PAGE.getChatField())

                    initialize()

                    clearInterval(findInterval)
                    FindCount = 0
               }
            }
        }, 1000)
    }

    const initialize = () =>{
        log('initialize...')
        //変数初期化
        initializeParameter()

        //チャット欄監視
        if(LIVE_PAGE.getChatField() !== null){
            ChatFieldObserver.disconnect()
            ChatFieldObserver.observe(LIVE_PAGE.getChatField(), {childList: true})
        }

        //CSS配置
        createScriptCSS()

        //設定パネル配置
        createSettingPanel()
    }

    const initializeParameter = () => {
        if(GM_getValue('CFY_NG_BUTTON') === true || GM_getValue('CFY_NG_BUTTON') === undefined){
            SETTINGS.CreateNGButtons = true
        }else{
            SETTINGS.CreateNGButtons = false
        }
        if(GM_getValue('CFY_SIMPLE_CHAT_FIELD') === false || GM_getValue('CFY_SIMPLE_CHAT_FIELD') === undefined){
            SETTINGS.SimpleChatField = false
        }else{
            SETTINGS.SimpleChatField = true
        }
        if(GM_getValue('CFY_NG_WORDS') !== undefined){
            SETTINGS.NGWords = USER_CONFIG.NGWords.split(/\r\n|\n/)
        }
        if(GM_getValue('CFY_NG_REG_WORDS') !== undefined){
            SETTINGS.NGRegWords = USER_CONFIG.NGRegWords.split(/\r\n|\n/)
        }
        if(GM_getValue('CFY_NG_USERS') !== undefined){
            SETTINGS.NGUsers = USER_CONFIG.NGUsers.split(/\r\n|\n/)
        }
    }

    const createScriptCSS = () => {
        const ScriptCSS = document.getElementById('cfy_style')

        //既にCSSがあれば消す
        if(ScriptCSS){
            ScriptCSS.parentNode.removeChild(ScriptCSS)
        }

        let ScriptCSS_HTML = ''
        ScriptCSS_HTML +=`<style type="text/css" id="cfy_style">`
        ScriptCSS_HTML +=
            `.cfy_panel{
               background-color: rgba(30,30,30,0.9);
               width: auto;
               height: auto;
               z-index: 5;
               display: inline-block;
               visibility: hidden;
               position: absolute;
               bottom: 35px;
               right: 10px;
               padding: 10px;
               color: #fff;
               font-size: 14px;
             }`
        ScriptCSS_HTML +=
            `.cfy_panel_box{
               /*display: inline-block;*/
               width: 210px;
               float: left;
               padding-left: 5px;
             }`
        ScriptCSS_HTML +=
            `.cfy_button{
               display: inline-block;
               border-style: none;
               z-index: 4;
               font-weight: 500;
               color: var(--yt-spec-text-secondary);
             }`
        ScriptCSS_HTML +=
            `.cfy_inputform{
               width: 100%;
               background-color: transparent;
               color: #FFF;
               border: 2px solid #aaa;
               border-radius: 4px;
               margin: 0px 10px;
               outline: none;
               padding: 8px;
               box-sizing: border-box;
               transition: 0.3s;
             }
            `
        ScriptCSS_HTML +=
            `.cfy_ngbutton{
               fill: #fff;
             }`
        ScriptCSS_HTML +=
            `.toast{
               font-size: 14px;
             }`
        ScriptCSS_HTML += '</style>'

        document.body.insertAdjacentHTML('beforeend', ScriptCSS_HTML)

        //youtubeのCSSの設定
        document.getElementById('chatframe').contentDocument.querySelector('#item-scroller.animated.yt-live-chat-item-list-renderer #item-offset.yt-live-chat-item-list-renderer').style.overflow = 'unset'

        //toastrの設定
        toastr.options = {
            'positionClass': 'toast-bottom-left',
            'timeOut': '2500',
            'progressBar': true,
            'newestOnTop': true,
            'extendedTimeOut': '1000'
        }
    }

    //--------------コメント関連--------------

    const ChatFieldObserver = new MutationObserver(function(mutations){
        mutations.forEach(function(e){
            let addedChats = e.addedNodes
            if(addedChats.length <= 0){
                return
            }

            for(let i = 0; i < addedChats.length; i++){
                //.yt-live-chat-placeholder-item-rendererを避ける
                if(addedChats[i].children.length <= 0){
                    continue
                }

                const chatData = convertChat(addedChats[i])

                if(checkBannedWords(chatData) || checkBannedRegexpWords(chatData) || checkBannedUsers(chatData)){
                    addedChats[i].style.display='none'
                    continue
                }else{
                    //youtubeのチャットは同じ要素を使い回すので、NG以外のときに表示させる処理も必要
                    if(addedChats[i].getElementsByClassName('style-scope yt-live-chat-paid-message-renderer').length > 0){
                        //スパチャの場合
                        addedChats[i].style.display='block'
                    }else{
                        //通常の場合
                        addedChats[i].style.display='flex'
                    }
                }

                if(SETTINGS.CreateNGButtons&&addedChats[i].getElementsByClassName('owner')[0]===undefined){
                    createNGButton(addedChats[i], chatData.authorID)
                }

                simplificationCommentField(addedChats[i], SETTINGS.SimpleChatField)
            }
        })
    })
    const createNGButton = (chat, id) =>{
        //既にボタンがあれば無視
        if(chat.children['content'] && chat.children['content'].children['cfy_ngbutton'])return
        //スパチャは無視
        if(chat.children['card'])return

        let button = document.createElement('button')
        button.className = 'style-scope yt-icon-button cfy_button'
        button.id = 'cfy_ngbutton'
        button.style = 'padding: 0px;width: 20px; height: 20px;'
        button.setAttribute('aria-label','NGに入れる')
        button.innerHTML =
            '<div style="width: 100%; height: 75%;fill: var(--yt-spec-text-secondary);">'+
              '<svg class="style-scope yt-icon" width="100%" height="100%" version="1.1" viewBox="0 0 512 512" x="0px" y="0px">'+
                '<path d="M437.023,74.977c-99.984-99.969-262.063-99.969-362.047,0c-99.969,99.984-99.969,262.063,0,362.047c99.969,99.969,262.078,99.969,362.047,0S536.992,174.945,437.023,74.977z M137.211,137.211c54.391-54.391,137.016-63.453,201.016-27.531L109.68,338.227C73.758,274.227,82.82,191.602,137.211,137.211z M374.805,374.789c-54.391,54.391-137.031,63.469-201.031,27.547l228.563-228.563C438.258,237.773,429.18,320.414,374.805,374.789z" fill-rule="evenodd">'+
                '</path>'+
              '</svg>'+
            '</div>'

        button.onclick = () =>{
            try{
                console.log('【CFY】Added to Banned Users: '+id)
                if(document.getElementById('cfy_ngusers').value !== ''){
                    document.getElementById('cfy_ngusers').value += '\n'+id
                }else{
                    document.getElementById('cfy_ngusers').value += id
                }
                GM_setValue('CFY_NG_USERS', document.getElementById('cfy_ngusers').value)
                USER_CONFIG.NGUsers = document.getElementById('cfy_ngusers').value
                SETTINGS.NGUsers = USER_CONFIG.NGUsers.split(/\r\n|\n/)

                chat.style.display='none'

                toastr.success('Added Banned User: '+id)
            }catch(e){

                toastr.error('Error: '+e.message)
            }
        }

        chat.children['content'].children['message'].appendChild(button)
    }
    //チャット欄に追加されたチャットから必要なものを抽出する
    const convertChat = (chat) => {
        let message = ''
        let authorID

        //チャットの子要素を見ていく
        let children = Array.from(chat.children)
        children.some(_chat =>{

            let childID = _chat.id

            //テキストの場合
            if(childID === 'content'){
                let message = Array.from(_chat.children).find((v) => v.id === 'message')
                //正規表現で文字と画像要素を分ける
                let textChildren = message.innerHTML.split(/<img|">/g)
                textChildren.some(_text => {
                    //絵文字の場合
                    if(_text.match('emoji style-scope yt-live-chat-text-message-renderer')){
                    }else{//テキストの場合
                        message += _text
                    }
                })

            }

            //アイコンの場合
            if(childID === 'author-photo'){
                let str = _chat.lastElementChild.getAttribute('src')||''
                let result = str.split('/')

                //yt3.ggpht.com/【-xxxxxxxxxxx】/AAAAAAAAAAI/AAAAAAAAAAA/【xxxxxxxxxxx】/s32-c-k-no-mo-rj-c0xffffff/photo.jpg
                authorID = result[3]+result[6]
            }

            //スパチャの場合
            if(childID === 'card'){
                //通常
                if(_chat.className === 'style-scope yt-live-chat-paid-message-renderer'){
                    let content = _chat.children[1]
                    let text = content.children[0].innerText
                    let authorName = _chat.querySelector('#author-name')

                    message += text
                    authorID = authorName
                }
                //ステッカー
                if(_chat.className === 'style-scope yt-live-chat-paid-sticker-renderer'){
                    let authorName = _chat.querySelector('#author-name')

                    message += ''
                    authorID = authorName
                }
            }
        })

        let result={
            message: message,
            authorID: authorID
        }
        return result
    }

    const checkBannedWords = (chatData) => {
        if(!USER_CONFIG.NGWords||!chatData.message){
            return false
        }

        let target = chatData.html

        for(let i = 0; i < SETTINGS.NGWords.length; i++){
            if(target.indexOf(SETTINGS.NGWords[i]) > -1){
                return true
                break
            }
        }
        return false
    }

    const checkBannedRegexpWords = (chatData) => {
        if(!USER_CONFIG.NGRegWords||!chatData.message){
            return false
        }

        let target = chatData.html

        for(let i = 0; i < SETTINGS.NGRegWords.length; i++){
            if(SETTINGS.NGRegWords[i] === ''){continue}
            let result = target.match(SETTINGS.NGWords[i])
            if(result !== null){
                return true
                break
            }
        }
        return false
    }

    const checkBannedUsers = (chatData) => {
        if(!USER_CONFIG.NGUsers||!chatData.authorID){
            return false
        }

        let target = chatData.authorID

        for(let i = 0; i < SETTINGS.NGUsers.length; i++){
            if(SETTINGS.NGUsers[i]!==''){
                let result = target.match(SETTINGS.NGUsers[i])
                if(result !== null){
                    return true
                    break
                }
            }
        }
        return false
    }

    const simplificationCommentField = (chat, setting) => {
        if(setting === true){
            chat.style.borderBottom='1px solid var(--yt-spec-text-secondary)'
            if(chat.getElementsByClassName('style-scope yt-live-chat-paid-message-renderer').length>0)return
            if(chat.getElementsByClassName('owner')[0])return
            chat.children['author-photo'].style.display = 'none'
            chat.querySelector('yt-live-chat-author-chip.style-scope.yt-live-chat-text-message-renderer').style.display = 'none'
        }else{
            chat.style.borderBottom='none'
            if(chat.getElementsByClassName('style-scope yt-live-chat-paid-message-renderer').length>0)return
            if(chat.getElementsByClassName('owner')[0])return
            chat.children['author-photo'].style.display = 'block'
            chat.querySelector('yt-live-chat-author-chip.style-scope.yt-live-chat-text-message-renderer').style.display = 'inline-flex'
            chat.setAttribute('style', 'border-bottom: none;')
        }
    }

    const changeSizeInChatField = (size) => {
        document.getElementsByClassName('yt-live-chat-renderer').fontSize = size+'px'
    }

    //-----------設定パネル関連-----------------
    //設定パネル
    const createSettingPanel = () => {
        if(document.getElementsByClassName('cfy_settings')[0]!==undefined)return

            const HTML_EN = `
<div class="cfy_settings">
  <div class="cfy_panel" id="cfy-setting-panel-block-or-hide">
      <div class="cfy_panel_box">
        <div>
          <span>Language(Refresh after change)</span>
          <div>
            <select id="cfy_input_lang" style="width: 60%">
              <option value="EN">English</option>
              <option value="JA">日本語</option>
            </select>
          </div>
        </div>
        <div>
          <span>Banned Words</span>
          <div>
            <textarea name="cfy_ngwords" id="cfy_ngwords" rows="4" style="resize: horizontal;width: 190px;">`+USER_CONFIG.NGWords+`</textarea>
          </div>
        </div>
        <div>
          <span>Banned Words(Regexp)</span>
          <div>
            <textarea name="cfy_ngwords_reg" id="cfy_ngwords_reg" rows="4" style="resize: horizontal;width: 190px;">`+USER_CONFIG.NGRegWords+`</textarea>
          </div>
        </div>
        <div>
          <span>Banned Users<font color="red">*</font></span>
          <div>
            <textarea name="cfy_ngusers" id="cfy_ngusers" rows="4" style="resize: horizontal;width: 190px;">`+USER_CONFIG.NGUsers+`</textarea>
          </div>
        </div>
        <div>
          <div>
            <input type="checkbox" class="cfy_input_checkbox" id="cfy_toggle_simple_chat_field" checked="`+SETTINGS.SimpleChatField+`"><label for="cfy_toggle_simple_chat_field">Simple Chat Field</label>
          </div>
          <div>
            <input type="checkbox" class="cfy_input_checkbox" id="cfy_check_button_to_ban" checked="`+SETTINGS.CreateNGButtons+`"><label for="cfy_check_button_to_ban">Show Button to Ban</label>
          </div>
        </div>
        <div>
          <button id="cfy_reload_button" style="bottom: 0;margin: 6px 0px;">Reload</button>
          <button id="cfy_input_save_button" style="float: right;bottom: 0px;margin: 6px 0px;">SAVE</button>
        </div>
      </div>

    </div>
    </div>
  </div>
  <button type="button" name="panelbutton" value="panelbutton" class="cfy_button" id="cfy-setting-panel-button" style="background: rgba(0,0,0,0);margin-left: 10px;white-space: nowrap;">
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" viewBox="0 0 640 640" width="15" height="15" style="position: relative;top: 1px;">
      <defs>
        <path d="M135.38 58.17L136.02 58.22L136.65 58.29L137.3 58.39L137.95 58.52L138.61 58.66L139.27 58.83L139.94 59.01L140.61 59.22L141.29 59.45L141.98 59.7L142.66 59.96L143.35 60.25L144.05 60.55L144.74 60.87L145.44 61.2L146.15 61.55L146.85 61.92L147.56 62.3L148.27 62.69L148.97 63.1L149.69 63.52L150.4 63.95L151.11 64.4L196.98 91.31L197.88 90.81L206.8 86.34L215.92 82.22L216.84 81.84L216.84 224.11L214.42 226.66L210.89 230.67L207.51 234.82L204.29 239.1L201.23 243.51L198.33 248.04L195.6 252.69L193.05 257.45L190.68 262.32L188.49 267.29L186.49 272.36L184.67 277.53L183.06 282.79L181.65 288.14L180.44 293.57L179.44 299.08L178.66 304.65L178.09 310.3L177.75 316.01L177.63 321.78L177.75 327.56L178.09 333.27L178.66 338.91L179.44 344.49L180.44 350L181.65 355.43L183.06 360.77L184.67 366.04L186.49 371.2L188.49 376.28L190.68 381.25L193.05 386.12L195.6 390.88L198.33 395.53L201.23 400.06L204.29 404.47L207.51 408.75L210.89 412.89L214.42 416.91L218.1 420.78L221.92 424.51L225.88 428.08L229.97 431.51L234.2 434.77L238.54 437.87L243.01 440.81L247.6 443.57L252.3 446.16L257.1 448.56L262.01 450.78L267.02 452.81L272.12 454.65L277.31 456.28L282.59 457.72L287.95 458.94L293.38 459.95L298.89 460.75L304.46 461.32L310.09 461.67L315.79 461.78L321.48 461.67L327.12 461.32L332.69 460.75L338.2 459.95L343.63 458.94L348.99 457.72L354.27 456.28L359.46 454.65L364.56 452.81L369.57 450.78L374.48 448.56L379.28 446.16L383.98 443.57L388.57 440.81L393.03 437.87L397.38 434.77L401.61 431.51L405.7 428.08L409.66 424.51L413.48 420.78L417.16 416.91L420.69 412.89L424.07 408.75L427.29 404.47L430.35 400.06L433.25 395.53L435.97 390.88L438.53 386.12L440.9 381.25L443.09 376.28L445.09 371.2L446.9 366.04L448.52 360.77L449.93 355.43L451.14 350L452.14 344.49L452.92 338.91L453.49 333.27L453.83 327.56L453.95 321.78L453.83 316.01L453.77 314.95L487.06 314.95L627.33 378.59L627.31 378.6L626.83 379L626.32 379.38L625.8 379.75L625.25 380.11L624.68 380.47L624.1 380.81L623.5 381.15L622.87 381.48L622.24 381.8L621.58 382.11L620.91 382.42L620.22 382.72L619.52 383.01L618.81 383.31L618.08 383.59L617.34 383.87L616.58 384.15L615.82 384.43L615.04 384.7L614.26 384.98L613.46 385.25L612.66 385.52L611.84 385.78L560.61 399.62L559.29 403.96L555.92 413.56L552.21 422.99L548.14 432.23L543.73 441.27L543.23 442.18L569.79 488.66L570.23 489.38L570.65 490.1L571.07 490.82L571.47 491.54L571.86 492.26L572.24 492.98L572.6 493.69L572.94 494.4L573.27 495.11L573.59 495.82L573.89 496.52L574.17 497.22L574.43 497.92L574.67 498.61L574.9 499.3L575.1 499.98L575.29 500.65L575.45 501.33L575.59 501.99L575.71 502.65L575.81 503.31L575.89 503.96L575.94 504.6L575.96 505.23L575.97 505.85L575.94 506.47L575.89 507.08L575.81 507.68L575.71 508.27L575.58 508.86L575.42 509.43L575.22 510L575 510.55L574.75 511.09L574.47 511.63L574.16 512.15L573.81 512.66L573.44 513.16L573.03 513.64L572.58 514.12L505.59 582L505.12 582.45L504.65 582.86L504.16 583.24L503.67 583.58L503.16 583.89L502.65 584.16L502.12 584.4L501.59 584.61L501.05 584.79L500.5 584.93L499.94 585.05L499.38 585.14L498.8 585.2L498.22 585.23L497.63 585.24L497.03 585.22L496.42 585.18L495.8 585.11L495.18 585.02L494.55 584.9L493.91 584.77L493.26 584.61L492.61 584.44L491.95 584.24L491.28 584.03L490.6 583.8L489.92 583.55L489.23 583.29L488.54 583.01L487.83 582.71L487.13 582.41L486.41 582.09L485.69 581.76L484.96 581.42L484.23 581.06L483.49 580.7L482.74 580.33L481.99 579.95L481.23 579.56L480.47 579.17L434.6 552.26L433.7 552.76L424.78 557.23L415.66 561.35L406.36 565.12L396.89 568.53L392.6 569.87L378.95 621.78L378.68 622.61L378.42 623.42L378.15 624.23L377.88 625.03L377.61 625.81L377.34 626.59L377.06 627.35L376.78 628.1L376.5 628.84L376.21 629.57L375.92 630.28L375.62 630.97L375.32 631.65L375.01 632.32L374.69 632.96L374.37 633.59L374.04 634.2L373.7 634.8L373.35 635.37L372.99 635.92L372.63 636.46L372.25 636.97L371.86 637.46L371.46 637.92L371.05 638.37L370.63 638.79L370.19 639.18L369.74 639.55L369.28 639.89L368.8 640.21L368.31 640.5L367.81 640.76L367.29 641L366.75 641.2L366.19 641.38L365.62 641.52L365.03 641.64L364.43 641.72L363.8 641.77L363.16 641.78L268.42 641.78L267.78 641.77L267.14 641.72L266.53 641.64L265.93 641.52L265.34 641.38L264.77 641.2L264.22 641L263.68 640.76L263.15 640.5L262.63 640.21L262.13 639.89L261.64 639.55L261.17 639.18L260.71 638.79L260.26 638.37L259.83 637.92L259.4 637.46L258.99 636.97L258.59 636.46L258.21 635.92L257.83 635.37L257.47 634.8L257.11 634.2L256.77 633.59L256.44 632.96L256.12 632.32L255.81 631.65L255.51 630.97L255.22 630.28L254.94 629.57L254.67 628.84L254.41 628.1L254.16 627.35L253.91 626.59L253.68 625.81L253.45 625.03L253.24 624.23L253.03 623.42L252.82 622.61L252.63 621.78L238.98 569.87L234.69 568.53L225.22 565.12L215.92 561.35L206.8 557.23L197.88 552.76L196.8 552.17L151.11 578.98L150.4 579.42L149.69 579.86L148.97 580.28L148.27 580.68L147.56 581.08L146.85 581.46L146.15 581.83L145.44 582.18L144.74 582.51L144.05 582.83L143.35 583.13L142.66 583.42L141.98 583.68L141.29 583.93L140.61 584.16L139.94 584.36L139.27 584.55L138.61 584.72L137.95 584.86L137.3 584.98L136.65 585.08L136.02 585.16L135.38 585.21L134.76 585.24L134.14 585.24L133.53 585.21L132.93 585.16L132.34 585.08L131.75 584.98L131.18 584.84L130.61 584.68L130.05 584.49L129.51 584.26L128.97 584.01L128.45 583.73L127.93 583.41L127.43 583.06L126.94 582.68L126.46 582.26L125.99 581.81L59 513.93L58.55 513.45L58.15 512.97L57.78 512.48L57.44 511.98L57.14 511.46L56.87 510.94L56.63 510.41L56.42 509.87L56.25 509.33L56.1 508.77L55.99 508.2L55.9 507.63L55.84 507.05L55.81 506.45L55.8 505.85L55.82 505.25L55.86 504.63L55.93 504.01L56.02 503.37L56.13 502.73L56.27 502.09L56.42 501.43L56.59 500.77L56.78 500.1L57 499.42L57.22 498.74L57.47 498.05L57.73 497.35L58 496.64L58.29 495.93L58.59 495.21L58.91 494.49L59.24 493.76L59.57 493.02L59.92 492.28L60.28 491.53L60.65 490.77L61.02 490.01L61.4 489.24L61.79 488.47L88.29 442.09L87.85 441.27L83.44 432.23L79.37 422.99L75.65 413.56L72.29 403.96L70.96 399.62L19.74 385.78L18.92 385.52L18.12 385.25L17.32 384.98L16.54 384.7L15.76 384.43L15 384.15L14.24 383.87L13.5 383.59L12.77 383.31L12.06 383.01L11.36 382.72L10.67 382.42L10 382.11L9.34 381.8L8.7 381.48L8.08 381.15L7.48 380.81L6.9 380.47L6.33 380.11L5.78 379.75L5.26 379.38L4.75 379L4.27 378.6L3.81 378.2L3.37 377.78L2.96 377.35L2.57 376.91L2.2 376.46L1.87 375.99L1.55 375.51L1.27 375.01L1.01 374.5L0.78 373.97L0.57 373.42L0.4 372.86L0.26 372.28L0.15 371.68L0.07 371.07L0.02 370.44L0 369.78L0 273.78L0.02 273.13L0.07 272.49L0.15 271.87L0.26 271.26L0.4 270.67L0.57 270.09L0.78 269.52L1.01 268.98L1.27 268.44L1.55 267.92L1.87 267.41L2.2 266.92L2.57 266.44L2.96 265.97L3.37 265.52L3.81 265.07L4.27 264.65L4.75 264.23L5.26 263.83L5.78 263.43L6.33 263.05L6.9 262.68L7.48 262.33L8.08 261.98L8.7 261.64L9.34 261.32L10 261L10.67 260.7L11.36 260.41L12.06 260.12L12.77 259.85L13.5 259.58L14.24 259.33L15 259.08L15.76 258.84L16.54 258.62L17.32 258.4L18.12 258.18L18.92 257.98L19.74 257.78L70.96 243.95L72.29 239.6L75.65 230L79.37 220.58L83.44 211.34L87.85 202.3L88.35 201.39L61.79 154.91L61.4 154.13L61.02 153.37L60.65 152.61L60.28 151.85L59.92 151.1L59.57 150.36L59.24 149.62L58.91 148.89L58.59 148.16L58.29 147.45L58 146.73L57.73 146.03L57.47 145.33L57.22 144.64L57 143.96L56.78 143.28L56.59 142.61L56.42 141.95L56.27 141.29L56.13 140.64L56.02 140L55.93 139.37L55.86 138.75L55.82 138.13L55.8 137.52L55.81 136.92L55.84 136.33L55.9 135.75L55.99 135.17L56.1 134.61L56.25 134.05L56.42 133.5L56.63 132.96L56.87 132.43L57.14 131.91L57.44 131.4L57.78 130.9L58.15 130.41L58.55 129.92L59 129.45L125.99 61.57L126.46 61.12L126.94 60.7L127.43 60.32L127.93 59.97L128.45 59.65L128.97 59.37L129.51 59.11L130.05 58.89L130.61 58.7L131.18 58.53L131.75 58.4L132.34 58.29L132.93 58.21L133.53 58.16L134.14 58.14L134.76 58.14L135.38 58.17ZM576.75 2.01L579.53 2.29L582.28 2.69L584.99 3.18L587.66 3.79L590.29 4.49L592.88 5.3L595.42 6.2L597.92 7.2L600.37 8.29L602.76 9.47L605.11 10.75L607.39 12.11L609.62 13.55L611.79 15.08L613.9 16.68L615.94 18.37L617.91 20.13L619.82 21.96L621.65 23.87L623.41 25.84L625.1 27.89L626.71 29.99L628.23 32.16L629.68 34.39L631.04 36.68L632.31 39.02L633.49 41.42L634.59 43.86L635.58 46.36L636.49 48.91L637.29 51.49L638 54.13L638.6 56.8L639.1 59.51L639.49 62.25L639.77 65.03L639.94 67.84L640 70.68L640 208.48L639.94 211.32L639.77 214.13L639.49 216.91L639.1 219.66L638.6 222.37L638 225.04L637.29 227.67L636.49 230.26L635.58 232.8L634.59 235.3L633.49 237.75L632.31 240.14L631.04 242.49L629.68 244.77L628.23 247L626.71 249.17L625.1 251.28L623.41 253.32L621.65 255.29L619.82 257.2L617.91 259.03L615.94 260.79L613.9 262.48L611.79 264.09L609.62 265.61L607.39 267.06L605.11 268.42L602.76 269.69L601.78 270.18L623.59 340.98L481.84 277.38L326.79 277.38L323.95 277.32L321.14 277.15L318.36 276.87L315.62 276.48L312.91 275.98L310.24 275.38L307.6 274.67L305.02 273.87L302.47 272.96L299.97 271.96L297.53 270.87L295.13 269.69L292.79 268.42L290.5 267.06L288.27 265.61L286.1 264.09L284 262.48L281.95 260.79L279.98 259.03L278.07 257.2L276.24 255.29L274.48 253.32L272.8 251.28L271.19 249.17L269.66 247L268.22 244.77L266.86 242.49L265.59 240.14L264.4 237.75L263.31 235.3L262.31 232.8L261.41 230.26L260.6 227.67L259.9 225.04L259.29 222.37L258.8 219.66L258.41 216.91L258.12 214.13L257.95 211.32L257.89 208.48L257.89 70.68L257.95 67.84L258.12 65.03L258.41 62.25L258.8 59.51L259.29 56.8L259.9 54.13L260.6 51.49L261.41 48.91L262.31 46.36L263.31 43.86L264.4 41.42L265.59 39.02L266.86 36.68L268.22 34.39L269.66 32.16L271.19 29.99L272.8 27.89L274.48 25.84L276.24 23.87L278.07 21.96L279.98 20.13L281.95 18.37L284 16.68L286.1 15.08L288.27 13.55L290.5 12.11L292.79 10.75L295.13 9.47L297.53 8.29L299.97 7.2L302.47 6.2L305.02 5.3L307.6 4.49L310.24 3.79L312.91 3.18L315.62 2.69L318.36 2.29L321.14 2.01L323.95 1.84L326.79 1.78L571.1 1.78L573.94 1.84L576.75 2.01Z" id="d1TbzTC1zI">
        </path>
      </defs>
      <g><g><g>
        <use xlink:href="#d1TbzTC1zI" opacity="1" fill="var(--iron-icon-fill-color, currentcolor)" fill-opacity="1">
        </use>
      </g></g></g>
    </svg>
    <font style="position:relative;top: -2px;margin-left: 8px;">Settings</font>
  </button>
</div>
`
            const HTML_JA = `
<div class="cfy_settings">
  <div class="cfy_panel" id="cfy-setting-panel-block-or-hide">
    <div class="cfy_panel_box">
      <div>
        <span>言語(更新後に反映)</span>
        <div>
          <select id="cfy_input_lang" style="width: 60%">
            <option value="EN">English</option>
            <option value="JA">日本語</option>
          </select>
        </div>
      </div>
      <div>
        <span>NGワード</span>
        <div>
          <textarea name="cfy_ngwords" id="cfy_ngwords" rows="4" style="resize: horizontal;width: 190px;">`+USER_CONFIG.NGWords+`</textarea>
        </div>
      </div>
      <div>
        <span>NGワード(正規表現)</span>
        <div>
          <textarea name="cfy_ngwords_reg" id="cfy_ngwords_reg" rows="4" style="resize: horizontal;width: 190px;">`+USER_CONFIG.NGRegWords+`</textarea>
        </div>
      </div>
      <div>
        <span>NGユーザー<font color="red">*</font></span>
        <div>
          <textarea name="cfy_ngusers" id="cfy_ngusers" rows="4" style="resize: horizontal;width: 190px;">`+USER_CONFIG.NGUsers+`</textarea>
        </div>
      </div>
      <div>
        <div>
          <input type="checkbox" class="cfy_input_checkbox" id="cfy_toggle_simple_chat_field" checked="`+SETTINGS.SimpleChatField+`"><label for="cfy_toggle_simple_chat_field">チャット欄を簡略化する</label>
        </div>
        <div>
          <input type="checkbox" class="cfy_input_checkbox" id="cfy_check_button_to_ban" checked="`+SETTINGS.CreateNGButtons+`"><label for="cfy_check_button_to_ban">NGボタンを表示する</label>
        </div>
      </div>
      <div>
        <button id="cfy_reload_button" style="bottom: 0;margin: 6px 0px;">再読み込み</button>
        <button id="cfy_input_save_button" style="float: right;bottom: 0px;margin: 6px 0px;">保存</button>
      </div>
    </div>
  </div>
</div>
<button type="button" name="panelbutton" value="panelbutton" class="cfy_button" id="cfy-setting-panel-button" style="background: rgba(0,0,0,0);margin-left: 10px;white-space: nowrap;">
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" viewBox="0 0 640 640" width="15" height="15" style="position: relative;top: 1px;">
    <defs>
      <path d="M135.38 58.17L136.02 58.22L136.65 58.29L137.3 58.39L137.95 58.52L138.61 58.66L139.27 58.83L139.94 59.01L140.61 59.22L141.29 59.45L141.98 59.7L142.66 59.96L143.35 60.25L144.05 60.55L144.74 60.87L145.44 61.2L146.15 61.55L146.85 61.92L147.56 62.3L148.27 62.69L148.97 63.1L149.69 63.52L150.4 63.95L151.11 64.4L196.98 91.31L197.88 90.81L206.8 86.34L215.92 82.22L216.84 81.84L216.84 224.11L214.42 226.66L210.89 230.67L207.51 234.82L204.29 239.1L201.23 243.51L198.33 248.04L195.6 252.69L193.05 257.45L190.68 262.32L188.49 267.29L186.49 272.36L184.67 277.53L183.06 282.79L181.65 288.14L180.44 293.57L179.44 299.08L178.66 304.65L178.09 310.3L177.75 316.01L177.63 321.78L177.75 327.56L178.09 333.27L178.66 338.91L179.44 344.49L180.44 350L181.65 355.43L183.06 360.77L184.67 366.04L186.49 371.2L188.49 376.28L190.68 381.25L193.05 386.12L195.6 390.88L198.33 395.53L201.23 400.06L204.29 404.47L207.51 408.75L210.89 412.89L214.42 416.91L218.1 420.78L221.92 424.51L225.88 428.08L229.97 431.51L234.2 434.77L238.54 437.87L243.01 440.81L247.6 443.57L252.3 446.16L257.1 448.56L262.01 450.78L267.02 452.81L272.12 454.65L277.31 456.28L282.59 457.72L287.95 458.94L293.38 459.95L298.89 460.75L304.46 461.32L310.09 461.67L315.79 461.78L321.48 461.67L327.12 461.32L332.69 460.75L338.2 459.95L343.63 458.94L348.99 457.72L354.27 456.28L359.46 454.65L364.56 452.81L369.57 450.78L374.48 448.56L379.28 446.16L383.98 443.57L388.57 440.81L393.03 437.87L397.38 434.77L401.61 431.51L405.7 428.08L409.66 424.51L413.48 420.78L417.16 416.91L420.69 412.89L424.07 408.75L427.29 404.47L430.35 400.06L433.25 395.53L435.97 390.88L438.53 386.12L440.9 381.25L443.09 376.28L445.09 371.2L446.9 366.04L448.52 360.77L449.93 355.43L451.14 350L452.14 344.49L452.92 338.91L453.49 333.27L453.83 327.56L453.95 321.78L453.83 316.01L453.77 314.95L487.06 314.95L627.33 378.59L627.31 378.6L626.83 379L626.32 379.38L625.8 379.75L625.25 380.11L624.68 380.47L624.1 380.81L623.5 381.15L622.87 381.48L622.24 381.8L621.58 382.11L620.91 382.42L620.22 382.72L619.52 383.01L618.81 383.31L618.08 383.59L617.34 383.87L616.58 384.15L615.82 384.43L615.04 384.7L614.26 384.98L613.46 385.25L612.66 385.52L611.84 385.78L560.61 399.62L559.29 403.96L555.92 413.56L552.21 422.99L548.14 432.23L543.73 441.27L543.23 442.18L569.79 488.66L570.23 489.38L570.65 490.1L571.07 490.82L571.47 491.54L571.86 492.26L572.24 492.98L572.6 493.69L572.94 494.4L573.27 495.11L573.59 495.82L573.89 496.52L574.17 497.22L574.43 497.92L574.67 498.61L574.9 499.3L575.1 499.98L575.29 500.65L575.45 501.33L575.59 501.99L575.71 502.65L575.81 503.31L575.89 503.96L575.94 504.6L575.96 505.23L575.97 505.85L575.94 506.47L575.89 507.08L575.81 507.68L575.71 508.27L575.58 508.86L575.42 509.43L575.22 510L575 510.55L574.75 511.09L574.47 511.63L574.16 512.15L573.81 512.66L573.44 513.16L573.03 513.64L572.58 514.12L505.59 582L505.12 582.45L504.65 582.86L504.16 583.24L503.67 583.58L503.16 583.89L502.65 584.16L502.12 584.4L501.59 584.61L501.05 584.79L500.5 584.93L499.94 585.05L499.38 585.14L498.8 585.2L498.22 585.23L497.63 585.24L497.03 585.22L496.42 585.18L495.8 585.11L495.18 585.02L494.55 584.9L493.91 584.77L493.26 584.61L492.61 584.44L491.95 584.24L491.28 584.03L490.6 583.8L489.92 583.55L489.23 583.29L488.54 583.01L487.83 582.71L487.13 582.41L486.41 582.09L485.69 581.76L484.96 581.42L484.23 581.06L483.49 580.7L482.74 580.33L481.99 579.95L481.23 579.56L480.47 579.17L434.6 552.26L433.7 552.76L424.78 557.23L415.66 561.35L406.36 565.12L396.89 568.53L392.6 569.87L378.95 621.78L378.68 622.61L378.42 623.42L378.15 624.23L377.88 625.03L377.61 625.81L377.34 626.59L377.06 627.35L376.78 628.1L376.5 628.84L376.21 629.57L375.92 630.28L375.62 630.97L375.32 631.65L375.01 632.32L374.69 632.96L374.37 633.59L374.04 634.2L373.7 634.8L373.35 635.37L372.99 635.92L372.63 636.46L372.25 636.97L371.86 637.46L371.46 637.92L371.05 638.37L370.63 638.79L370.19 639.18L369.74 639.55L369.28 639.89L368.8 640.21L368.31 640.5L367.81 640.76L367.29 641L366.75 641.2L366.19 641.38L365.62 641.52L365.03 641.64L364.43 641.72L363.8 641.77L363.16 641.78L268.42 641.78L267.78 641.77L267.14 641.72L266.53 641.64L265.93 641.52L265.34 641.38L264.77 641.2L264.22 641L263.68 640.76L263.15 640.5L262.63 640.21L262.13 639.89L261.64 639.55L261.17 639.18L260.71 638.79L260.26 638.37L259.83 637.92L259.4 637.46L258.99 636.97L258.59 636.46L258.21 635.92L257.83 635.37L257.47 634.8L257.11 634.2L256.77 633.59L256.44 632.96L256.12 632.32L255.81 631.65L255.51 630.97L255.22 630.28L254.94 629.57L254.67 628.84L254.41 628.1L254.16 627.35L253.91 626.59L253.68 625.81L253.45 625.03L253.24 624.23L253.03 623.42L252.82 622.61L252.63 621.78L238.98 569.87L234.69 568.53L225.22 565.12L215.92 561.35L206.8 557.23L197.88 552.76L196.8 552.17L151.11 578.98L150.4 579.42L149.69 579.86L148.97 580.28L148.27 580.68L147.56 581.08L146.85 581.46L146.15 581.83L145.44 582.18L144.74 582.51L144.05 582.83L143.35 583.13L142.66 583.42L141.98 583.68L141.29 583.93L140.61 584.16L139.94 584.36L139.27 584.55L138.61 584.72L137.95 584.86L137.3 584.98L136.65 585.08L136.02 585.16L135.38 585.21L134.76 585.24L134.14 585.24L133.53 585.21L132.93 585.16L132.34 585.08L131.75 584.98L131.18 584.84L130.61 584.68L130.05 584.49L129.51 584.26L128.97 584.01L128.45 583.73L127.93 583.41L127.43 583.06L126.94 582.68L126.46 582.26L125.99 581.81L59 513.93L58.55 513.45L58.15 512.97L57.78 512.48L57.44 511.98L57.14 511.46L56.87 510.94L56.63 510.41L56.42 509.87L56.25 509.33L56.1 508.77L55.99 508.2L55.9 507.63L55.84 507.05L55.81 506.45L55.8 505.85L55.82 505.25L55.86 504.63L55.93 504.01L56.02 503.37L56.13 502.73L56.27 502.09L56.42 501.43L56.59 500.77L56.78 500.1L57 499.42L57.22 498.74L57.47 498.05L57.73 497.35L58 496.64L58.29 495.93L58.59 495.21L58.91 494.49L59.24 493.76L59.57 493.02L59.92 492.28L60.28 491.53L60.65 490.77L61.02 490.01L61.4 489.24L61.79 488.47L88.29 442.09L87.85 441.27L83.44 432.23L79.37 422.99L75.65 413.56L72.29 403.96L70.96 399.62L19.74 385.78L18.92 385.52L18.12 385.25L17.32 384.98L16.54 384.7L15.76 384.43L15 384.15L14.24 383.87L13.5 383.59L12.77 383.31L12.06 383.01L11.36 382.72L10.67 382.42L10 382.11L9.34 381.8L8.7 381.48L8.08 381.15L7.48 380.81L6.9 380.47L6.33 380.11L5.78 379.75L5.26 379.38L4.75 379L4.27 378.6L3.81 378.2L3.37 377.78L2.96 377.35L2.57 376.91L2.2 376.46L1.87 375.99L1.55 375.51L1.27 375.01L1.01 374.5L0.78 373.97L0.57 373.42L0.4 372.86L0.26 372.28L0.15 371.68L0.07 371.07L0.02 370.44L0 369.78L0 273.78L0.02 273.13L0.07 272.49L0.15 271.87L0.26 271.26L0.4 270.67L0.57 270.09L0.78 269.52L1.01 268.98L1.27 268.44L1.55 267.92L1.87 267.41L2.2 266.92L2.57 266.44L2.96 265.97L3.37 265.52L3.81 265.07L4.27 264.65L4.75 264.23L5.26 263.83L5.78 263.43L6.33 263.05L6.9 262.68L7.48 262.33L8.08 261.98L8.7 261.64L9.34 261.32L10 261L10.67 260.7L11.36 260.41L12.06 260.12L12.77 259.85L13.5 259.58L14.24 259.33L15 259.08L15.76 258.84L16.54 258.62L17.32 258.4L18.12 258.18L18.92 257.98L19.74 257.78L70.96 243.95L72.29 239.6L75.65 230L79.37 220.58L83.44 211.34L87.85 202.3L88.35 201.39L61.79 154.91L61.4 154.13L61.02 153.37L60.65 152.61L60.28 151.85L59.92 151.1L59.57 150.36L59.24 149.62L58.91 148.89L58.59 148.16L58.29 147.45L58 146.73L57.73 146.03L57.47 145.33L57.22 144.64L57 143.96L56.78 143.28L56.59 142.61L56.42 141.95L56.27 141.29L56.13 140.64L56.02 140L55.93 139.37L55.86 138.75L55.82 138.13L55.8 137.52L55.81 136.92L55.84 136.33L55.9 135.75L55.99 135.17L56.1 134.61L56.25 134.05L56.42 133.5L56.63 132.96L56.87 132.43L57.14 131.91L57.44 131.4L57.78 130.9L58.15 130.41L58.55 129.92L59 129.45L125.99 61.57L126.46 61.12L126.94 60.7L127.43 60.32L127.93 59.97L128.45 59.65L128.97 59.37L129.51 59.11L130.05 58.89L130.61 58.7L131.18 58.53L131.75 58.4L132.34 58.29L132.93 58.21L133.53 58.16L134.14 58.14L134.76 58.14L135.38 58.17ZM576.75 2.01L579.53 2.29L582.28 2.69L584.99 3.18L587.66 3.79L590.29 4.49L592.88 5.3L595.42 6.2L597.92 7.2L600.37 8.29L602.76 9.47L605.11 10.75L607.39 12.11L609.62 13.55L611.79 15.08L613.9 16.68L615.94 18.37L617.91 20.13L619.82 21.96L621.65 23.87L623.41 25.84L625.1 27.89L626.71 29.99L628.23 32.16L629.68 34.39L631.04 36.68L632.31 39.02L633.49 41.42L634.59 43.86L635.58 46.36L636.49 48.91L637.29 51.49L638 54.13L638.6 56.8L639.1 59.51L639.49 62.25L639.77 65.03L639.94 67.84L640 70.68L640 208.48L639.94 211.32L639.77 214.13L639.49 216.91L639.1 219.66L638.6 222.37L638 225.04L637.29 227.67L636.49 230.26L635.58 232.8L634.59 235.3L633.49 237.75L632.31 240.14L631.04 242.49L629.68 244.77L628.23 247L626.71 249.17L625.1 251.28L623.41 253.32L621.65 255.29L619.82 257.2L617.91 259.03L615.94 260.79L613.9 262.48L611.79 264.09L609.62 265.61L607.39 267.06L605.11 268.42L602.76 269.69L601.78 270.18L623.59 340.98L481.84 277.38L326.79 277.38L323.95 277.32L321.14 277.15L318.36 276.87L315.62 276.48L312.91 275.98L310.24 275.38L307.6 274.67L305.02 273.87L302.47 272.96L299.97 271.96L297.53 270.87L295.13 269.69L292.79 268.42L290.5 267.06L288.27 265.61L286.1 264.09L284 262.48L281.95 260.79L279.98 259.03L278.07 257.2L276.24 255.29L274.48 253.32L272.8 251.28L271.19 249.17L269.66 247L268.22 244.77L266.86 242.49L265.59 240.14L264.4 237.75L263.31 235.3L262.31 232.8L261.41 230.26L260.6 227.67L259.9 225.04L259.29 222.37L258.8 219.66L258.41 216.91L258.12 214.13L257.95 211.32L257.89 208.48L257.89 70.68L257.95 67.84L258.12 65.03L258.41 62.25L258.8 59.51L259.29 56.8L259.9 54.13L260.6 51.49L261.41 48.91L262.31 46.36L263.31 43.86L264.4 41.42L265.59 39.02L266.86 36.68L268.22 34.39L269.66 32.16L271.19 29.99L272.8 27.89L274.48 25.84L276.24 23.87L278.07 21.96L279.98 20.13L281.95 18.37L284 16.68L286.1 15.08L288.27 13.55L290.5 12.11L292.79 10.75L295.13 9.47L297.53 8.29L299.97 7.2L302.47 6.2L305.02 5.3L307.6 4.49L310.24 3.79L312.91 3.18L315.62 2.69L318.36 2.29L321.14 2.01L323.95 1.84L326.79 1.78L571.1 1.78L573.94 1.84L576.75 2.01Z" id="d1TbzTC1zI">
      </path>
    </defs>
    <g><g><g>
      <use xlink:href="#d1TbzTC1zI" opacity="1" fill="var(--iron-icon-fill-color, currentcolor)" fill-opacity="1">
      </use>
    </g></g></g>
  </svg>
  <font style="position:relative;top: -2px;margin-left: 8px;">設定</font>
</button>
`
        //言語設定
        let HTML = ''
        if(USER_CONFIG.Lang === 'EN'){
            HTML = HTML_EN
        }

        if(USER_CONFIG.Lang === 'JA'){
            HTML = HTML_JA
        }
        else{
            HTML = HTML_EN
        }

        const menuElement = document.getElementById('menu-container').getElementsByClassName('dropdown-trigger style-scope ytd-menu-renderer')[0]
        menuElement.insertAdjacentHTML('beforebegin', HTML);

        //設定ボタン押下時のバルーン開閉
        const HIDE_OR_BLOCK_JUDGE_ELEMENT = document.getElementById('cfy-setting-panel-block-or-hide')
        document.getElementById('cfy-setting-panel-button').onclick = function(){
            if(SETTINGS.DisplaySettingPanel==false){
                HIDE_OR_BLOCK_JUDGE_ELEMENT.style.visibility = 'visible'
                SETTINGS.DisplaySettingPanel=true
            }else if(SETTINGS.DisplaySettingPanel==true){
                HIDE_OR_BLOCK_JUDGE_ELEMENT.style.visibility = 'hidden'
                SETTINGS.DisplaySettingPanel=false
            }
        }
        //同期
        document.getElementById('cfy_check_button_to_ban').checked = SETTINGS.CreateNGButtons
        document.getElementById('cfy_toggle_simple_chat_field').checked = SETTINGS.SimpleChatField
        document.getElementById('cfy_input_lang').value = USER_CONFIG.Lang

        //設定保存
        document.getElementById('cfy_input_save_button').onclick = function(){
            try{
                let val = document.getElementById('cfy_input_lang').value
                USER_CONFIG.Lang = val
                GM_setValue('CFY_LANG', val)

                val = document.getElementById('cfy_ngwords').value
                USER_CONFIG.NGWords = val
                GM_setValue('CFY_NG_WORDS', val)

                val = document.getElementById('cfy_ngwords_reg').value
                USER_CONFIG.NGRegWords = val
                GM_setValue('CFY_NG_REG_WORDS', val)

                val = document.getElementById('cfy_ngusers').value
                USER_CONFIG.NGUsers = val
                GM_setValue('CFY_NG_USERS', val)

                val = document.getElementById('cfy_toggle_simple_chat_field').checked
                SETTINGS.SimpleChatField = val
                GM_setValue('CFY_SIMPLE_CHAT_FIELD', val)

                val = document.getElementById('cfy_check_button_to_ban').checked
                SETTINGS.CreateNGButtons = val
                GM_setValue('CFY_NG_BUTTON', val)

                SETTINGS.NGWords = USER_CONFIG.NGWords.split(/\r\n|\n/)
                SETTINGS.NGRegWords = USER_CONFIG.NGRegWords.split(/\r\n|\n/)
                SETTINGS.NGUsers = USER_CONFIG.NGUsers.split(/\r\n|\n/)

                toastr.success('Saved.')
            }catch(e){
                toastr.error('Error: '+e.message)
            }
        }

        document.getElementById('cfy_input_lang').onchange = function(){
            let val = document.getElementById('cfy_input_lang').value
            USER_CONFIG.Lang = val
            GM_setValue('CFY_LANG', val)
        }

        document.getElementById('cfy_reload_button').onclick = function(){
            try{
                console.log(LIVE_PAGE.getChatField())

                initialize()
                ChatFieldObserver.disconnect()
                ChatFieldObserver.observe(LIVE_PAGE.getChatField(), {childList: true})

                toastr.success('Reloaded.')
            }catch(e){
                toastr.error('Error: '+e.message)
            }
        }
    }

    //------------------------------------------
    const log = (mes) => {console.log('【CFY】'+mes)}
})()
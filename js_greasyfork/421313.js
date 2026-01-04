// ==UserScript==
// @name            Flow Youtube Chat Modified
// @namespace       FlowYoutubeChatModifiedScript
// @version         0.93
// @description     Youtubeのチャットをニコニコ風に画面上へ流すスクリプトです(改造版)
// @author          ly-dia
// @name:en         Flow Youtube Chat Modified
// @description:en  Flow the chat on Youtube(Modding)
// @match           https://www.youtube.com/*
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_addStyle
// @grant           GM_getResourceText
// @require         https://code.jquery.com/jquery-3.3.1.min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js
// @resource        toastrCSS https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/421313/Flow%20Youtube%20Chat%20Modified.user.js
// @updateURL https://update.greasyfork.org/scripts/421313/Flow%20Youtube%20Chat%20Modified.meta.js
// ==/UserScript==

/*
    TODOめも：
    ・強調で色を付ける
    ・登録ユーザー判定の処理を軽量化させたい（キャッシュできるかな？）
    ・日本語と中国語対応（保存処理の見直しが必要そう）
    ・再読み込みボタンを外にも出しとく？
        →チャット欄のリフレッシュも含めてワンタッチ化したいわー

    ・オブザーバーまわりの判定おかしい気がするから見直し（元々の不具合）
    ・jqueryやcssをインコード化したい
    ・できればAGPLライセンスにする
 */

(function(){
    GM_addStyle(GM_getResourceText('toastrCSS'))

    //---ユーザー設定||デフォルトの数値---
    //---User Settings||Default Value---
    let USER_CONFIG = {
        Lang: GM_getValue('FYC_LANG')||'FYC_JA',

        Font: GM_getValue('FYC_FONT')||'',

        Opacity: GM_getValue('FYC_OPACITY')||0.7,

        Color: GM_getValue('FYC_COLOR')||'#FFFFFF',

        ColorOwner: GM_getValue('FYC_COLOR_OWNER')||'#ffd600',

        ColorModerator: GM_getValue('FYC_COLOR_MODERATOR')||'#5e84f1',

        ColorMember: GM_getValue('FYC_COLOR_MEMBER')||'#2ba640',

        Size: GM_getValue('FYC_SIZE')||0.7,

        SizeInChatField: GM_getValue('FYC_SIZE_IN_CHATFIELD')||13, // なんぞこれ

        Weight: GM_getValue('FYC_WEIGHT')||600,

        WeightShadow: GM_getValue('FYC_WEIGHT_SHADOW')||1,

        Limit: GM_getValue('FYC_LIMIT')||40,

        Speed: GM_getValue('FYC_SPEED')||18,

        MaxLength: GM_getValue('FYC_MAX')||100,

        LaneNum: GM_getValue('FYC_LANE_DIV')||13,

        NGWords: GM_getValue('FYC_NG_WORDS')||'',

        NGRegWords: GM_getValue('FYC_NG_REG_WORDS')||'',

        NGUsers: GM_getValue('FYC_NG_USERS')||'',

        ColorPickup1: GM_getValue('FYC_COLOR_PICKUP1')||'#ff00c0',

        PickupUsers1: GM_getValue('FYC_PICKUP_USERS1')||''
    }
    //ページの要素関連
    let LIVE_PAGE = {
        getPlayer: ()=>{return document.getElementById('movie_player')},
        getMainVideo: ()=>{return document.getElementsByClassName('video-stream html5-main-video')[0]},
        getUserIcon: ()=>{return document.getElementsByClassName('style-scope ytd-topbar-menu-button-renderer no-transition')[0].lastElementChild},
        getChatField: ()=>{
            //現在アカウントによってはchatframeが見つからないバグが有り
            let chatField
            if(document.getElementById('chatframe')!==null){
                chatField = document.getElementById('chatframe').contentDocument.querySelector("#items.style-scope.yt-live-chat-item-list-renderer")
            }else{
                chatField = document.querySelector("#items.style-scope.yt-live-chat-item-list-renderer")
            }
            return chatField
        }
    }
    //コメント関連
    let COMMENTS = {
        getAll: ()=>{return document.getElementsByClassName('fyc_comment')},
        Visibility: 'visible',
        AnimState: 'running'
    }
    //設定関連
    let SETTINGS = {
        CreateComments: true,
        CreateNGButtons: true,
        SimpleChatField: false,
        DisplayOwner: true,
        DisplayModerator: true,
        DisplayMember: true,
        DisplayModeratorName: true,
        DisplaySettingPanel: false,
        NGWords: [],
        NGRegWords: [],
        NGUsers: [],
        UserID: '',
        DisplayOwnerSpeed: true,
        DisplayModeratorSpeed: true,
        DisplayMemberSpeed: true,
        DisplayMemberIcon: true,
        DisplayMemberName: false,
        DisplayNonMemberIcon: false,
        DisplayNonMemberName: false,
        PickupUsersToggle: true,
    }

    //-----------立ち上がり------------
    //$(window).on('load', () => {
    $(document).ready(() => {
        //チャット欄とプレイヤーが出るまで待つ
        findChatField()
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

    //リサイズ検知オブザーバー
    function playerResizeObserve(){
        clearInterval(playerResizeInterval_id)

        let storedSize = LIVE_PAGE.getPlayer().clientWidth + LIVE_PAGE.getPlayer().clientHeight
        var playerResizeInterval_id = setInterval(() => {
            if(LIVE_PAGE.getPlayer().clientWidth + LIVE_PAGE.getPlayer().clientHeight !== storedSize){
                clearInterval(playerResizeInterval_id)
                deleteAllComments()
                initialize()
            }
        },1000)
    }

    var findInterval
    function findChatField(){
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
               if(LIVE_PAGE.getChatField() !== null && LIVE_PAGE.getPlayer() !== null){// && LIVE_PAGE.getUserIcon() !== null){
                   log('Found the element: ')
                   console.log(LIVE_PAGE.getChatField())
                   console.log(LIVE_PAGE.getPlayer())
                   //console.log(LIVE_PAGE.getUserIcon())

                   setTimeout(function(){//少し待つ
                       initialize()
                   }, 1000)

                   clearInterval(findInterval)
                   FindCount = 0
               }
            }
        }, 1000)
    }

    //-----------初期化とか------------
    function initialize(){
        log('initialize...')
        //変数初期化
        initializeParameter()

        //チャット欄監視
        if(LIVE_PAGE.getChatField() !== null){
            ChatFieldObserver.disconnect()
            ChatFieldObserver.observe(LIVE_PAGE.getChatField(), {childList: true})
        }

        //プレイヤーサイズ監視
        playerResizeObserve()

        //CSS配置
        createScriptCSS()

        //コメント描画レイヤー配置
        if(!document.getElementById('fyc_comment_screen')){
            LIVE_PAGE.getPlayer().insertAdjacentHTML('afterbegin', '<div id="fyc_comment_screen" style="pointer-events: none;"></div>')
        }

        //コメントリロードボタン配置
        createToggleCommentReloadButton()

        //コメント表示切り替えボタン配置
        createToggleCommentDisplayButton()

        //コメント送信フォーム設置
        //createCommentSubmitForm()

        //イベント設置
        putEvents()

        //設定パネル配置
        createSettingPanel()
    }

    function initializeParameter(){
        if(GM_getValue('FYC_TOGGLE_CREATE_COMMENTS') === true || GM_getValue('FYC_TOGGLE_CREATE_COMMENTS') === undefined){
            SETTINGS.CreateComments = true
        }else{
            SETTINGS.CreateComments = false
        }
        if(GM_getValue('FYC_NG_BUTTON') === true || GM_getValue('FYC_NG_BUTTON') === undefined){
            SETTINGS.CreateNGButtons = true
        }else{
            SETTINGS.CreateNGButtons = false
        }
        if(GM_getValue('FYC_SIMPLE_CHAT_FIELD') === false || GM_getValue('FYC_SIMPLE_CHAT_FIELD') === undefined){
            SETTINGS.SimpleChatField = false
        }else{
            SETTINGS.SimpleChatField = true
        }
        if(GM_getValue('FYC_DISPLAY_MODERATOR_NAME') === true || GM_getValue('FYC_DISPLAY_MODERATOR_NAME') === undefined){
            SETTINGS.DisplayModeratorName = true
        }else{
            SETTINGS.DisplayModeratorName = false
        }
        if(GM_getValue('FYC_DISPLAY_COMMENTS') === true || GM_getValue('FYC_DISPLAY_COMMENTS') === undefined){
            COMMENTS.Visibility = 'visible'
        }else{
            COMMENTS.Visibility = 'hidden'
        }
        //NG更新
        if(GM_getValue('FYC_NG_WORDS') !== undefined){
            SETTINGS.NGWords = USER_CONFIG.NGWords.split(/\r\n|\n/)
        }
        if(GM_getValue('FYC_NG_REG_WORDS') !== undefined){
            SETTINGS.NGRegWords = USER_CONFIG.NGRegWords.split(/\r\n|\n/)
        }
        if(GM_getValue('FYC_NG_USERS') !== undefined){
            SETTINGS.NGUsers = USER_CONFIG.NGUsers.split(/\r\n|\n/)
        }

        if(GM_getValue('FYC_DISPLAY_OWNER_SPEED') === true || GM_getValue('FYC_DISPLAY_OWNER_SPEED') === undefined){
            SETTINGS.DisplayOwnerSpeed = true
        }else{
            SETTINGS.DisplayOwnerSpeed = false
        }
        if(GM_getValue('FYC_DISPLAY_MODERATOR_SPEED') === true || GM_getValue('FYC_DISPLAY_MODERATOR_SPEED') === undefined){
            SETTINGS.DisplayModeratorSpeed = true
        }else{
            SETTINGS.DisplayModeratorSpeed = false
        }
        if(GM_getValue('FYC_DISPLAY_MEMBER_SPEED') === true || GM_getValue('FYC_DISPLAY_MEMBER_SPEED') === undefined){
            SETTINGS.DisplayMemberSpeed = true
        }else{
            SETTINGS.DisplayMemberSpeed = false
        }

        if(GM_getValue('FYC_DISPLAY_MEMBER_ICON') === true || GM_getValue('FYC_DISPLAY_MEMBER_ICON') === undefined){
            SETTINGS.DisplayMemberIcon = true
        }else{
            SETTINGS.DisplayMemberIcon = false
        }
        if(GM_getValue('FYC_DISPLAY_MEMBER_NAME') === true || GM_getValue('FYC_DISPLAY_MEMBER_NAME') === undefined){
            SETTINGS.DisplayMemberName = true
        }else{
            SETTINGS.DisplayMemberName = false
        }
        if(GM_getValue('FYC_DISPLAY_NONMEMBER_ICON') === true || GM_getValue('FYC_DISPLAY_NONMEMBER_ICON') === undefined){
            SETTINGS.DisplayNonMemberIcon = true
        }else{
            SETTINGS.DisplayNonMemberIcon = false
        }
        if(GM_getValue('FYC_DISPLAY_NONMEMBER_NAME') === false || GM_getValue('FYC_DISPLAY_NONMEMBER_NAME') === undefined){
            SETTINGS.DisplayNonMemberName = false
        }else{
            SETTINGS.DisplayNonMemberName = true
        }
        if(GM_getValue('FYC_PICKUP_USERS_TOGGLE') === true || GM_getValue('FYC_PICKUP_USERS_TOGGLE') === undefined){
            SETTINGS.PickupUsersToggle = true
        }else{
            SETTINGS.PickupUsersToggle = false
        }
        if(GM_getValue('FYC_PICKUP_USERS1') !== undefined){
            SETTINGS.PickupUsers1 = USER_CONFIG.PickupUsers1.split(/\r\n|\n/)
        }
    }

    // CSS設定（toastr.minも混ぜたいとこ）
    function createScriptCSS(){
        //const Player = LIVE_PAGE.getPlayer()
        const screenWidth = LIVE_PAGE.getPlayer().clientWidth
        const screenHeight = LIVE_PAGE.getMainVideo().clientHeight
        const screenY = (LIVE_PAGE.getPlayer().clientHeight - screenHeight)/2 //プレイヤー全体の高さ-実際の動画の高さ
        const screenWidthLimit = 0 - screenWidth * 4//コメントを 横幅の-4倍 まで流す
        const ScriptCSS = document.getElementById('fyc_style')

        //既にCSSがあれば消す
        if(ScriptCSS){
            ScriptCSS.parentNode.removeChild(ScriptCSS)
        }

        let ScriptCSS_HTML = ''
        ScriptCSS_HTML +=`<style type="text/css" id="fyc_style">`
        ScriptCSS_HTML+=
            `.fyc_comment{
               line-height: 1;
               z-index: 30;
               position: absolute;
               display: inline-block;
               user-select: none;
               white-space: nowrap;
               color: `+USER_CONFIG.Color+`;
               border-color: yellow;
               border-width: thin;
               text-shadow: -`+USER_CONFIG.WeightShadow+`px -`+USER_CONFIG.WeightShadow+`px #000, `+USER_CONFIG.WeightShadow+`px -`+USER_CONFIG.WeightShadow+`px #000,	-`+USER_CONFIG.WeightShadow+`px `+USER_CONFIG.WeightShadow+`px #000, `+USER_CONFIG.WeightShadow+`px `+USER_CONFIG.WeightShadow+`px #000;
               display: inline-block;
               animation-timing-function: linear;
               animation-fill-mode: forwards;
               animation-play-state: running;
             }`
        ScriptCSS_HTML +=
            `#fyc_comment_screen{
               z-index: 30;
             }`
        ScriptCSS_HTML +=
            `.fyc-comment-button{
               background: none;
               border: none;
               cursor: pointer;
               float: left;
               font-size: 1em;
               height: 4em;
               outline: none;
               overflow: visible;
               padding: 0 0 0em;
               position: relative;
               width: 3em;
             }`
        ScriptCSS_HTML +=
            `.fyc_panel{
               background-color: rgba(30,30,30,0.9);
               width: 650px;
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
            `.fyc_panel_box{
               /*display: inline-block;*/
               width: 210px;
               float: left;
               padding-left: 5px;
             }`
        ScriptCSS_HTML +=
            `.fyc_button{
               display: inline-block;
               border-style: none;
               z-index: 4;
               font-weight: 500;
               color: var(--yt-spec-text-secondary);
             }`
        ScriptCSS_HTML +=
            `.fyc_inputform{
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
            `.fyc_ngbutton{
               fill: #fff;
             }`
        ScriptCSS_HTML +=
            `.fyc_pickup1button{
               fill: #fff;
             }`
        ScriptCSS_HTML +=
            `.fyc_range{
               width: 150px
             }\n`
        ScriptCSS_HTML +=
            `.toast{
               font-size: 14px;
             }`

        //レーン設置
        //レーンは3週目まで想定。2週目レーンは、1週目のレーンの間から流す
        const LANE_NUM = USER_CONFIG.LaneNum
        for(let i = 0; i < LANE_NUM * 3 - 1; i++){
            let laneHeight = screenHeight * (i%LANE_NUM/LANE_NUM) + 4//文字が見切れるので4足してる
            if(i > LANE_NUM - 1&&i < LANE_NUM * 2 - 1)laneHeight = screenHeight * ((i%LANE_NUM)/LANE_NUM + 1/(LANE_NUM*2))//2週目の処理
            if(i > LANE_NUM * 2 - 2)laneHeight = screenHeight * ((i+1)%LANE_NUM/LANE_NUM) + 4
            laneHeight = Math.round(laneHeight * 100) / 100//少数第2位まで
            ScriptCSS_HTML +=
                '@keyframes lane'+i+' {'+
                'from{ transform: translate('+screenWidth+'px, '+(screenY+laneHeight)+'px); }'+
                'to{ transform: translate('+screenWidthLimit+'px, '+(screenY+laneHeight)+'px); }'+
                '}\n'
        }
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

                const commentData = convertChat(addedChats[i])
                //const commentLaneNum = judgeLaneNum(commentData)

                if(checkBannedWords(commentData) || checkBannedRegexpWords(commentData) || checkBannedUsers(commentData)){
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

                if(SETTINGS.CreateComments){
                    findCommentsOutOfScreen()
                    createComment(commentData)
                }
                if(SETTINGS.CreateNGButtons&&addedChats[i].getElementsByClassName('owner')[0]===undefined){
                    createNGButton(addedChats[i], commentData.authorID)
                }
                if(SETTINGS.PickupUsersToggle&&addedChats[i].getElementsByClassName('owner')[0]===undefined){
                    createPickupUsers1Button(addedChats[i], commentData.authorID)
                }

                // 第二引数はコードにする
                if(commentData.isPickup){
                    emphasizeCommentField(addedChats[i], true)
                }
                deleteOldComments()
            }
        })
    })

    function calcSpeed(length, isOwner, isModerator, isMember){
        const MAX_LENGTH = USER_CONFIG.MaxLength
        let speed = 0

        speed = 720/(length+30)
        //最高文字数以上では速さ固定
        if(length >= MAX_LENGTH){
            speed = 720/(MAX_LENGTH+30)
        }
        //最大速度以上では速さ固定
        if(speed < 720/(MAX_LENGTH+30)){
            speed = 720/(MAX_LENGTH+30)
        }
        //ユーザー設定適用
        speed = speed * (20/USER_CONFIG.Speed)

        //オーナー、モデレーター、メンバーのコメントは速度を低下させる
        if (SETTINGS.DisplayOwnerSpeed === true) {
            if (isOwner === true){
                speed = speed * 2.0
            }
        }
        if (SETTINGS.DisplayModeratorSpeed === true) {
            if (isModerator === true){
                speed = speed * 1.7
            }
        }
        if (SETTINGS.DisplayMemberSpeed === true) {
            if (isMember === true){
                speed = speed * 1.1
            }
        }

        return speed
    }

    function createComment(commentData){
        const screenHeight = LIVE_PAGE.getMainVideo().clientHeight

        const commentHTML = commentData.html
        const commentLength = commentData.length
        const commentColor = commentData.color
        const commentAuthorID = commentData.authorID
        const commentIsMine = commentData.isMine
        const commentIsMember = commentData.isMember
        const commentIsOwner = commentData.isOwner
        const commentIsModerator = commentData.isModerator
        const commentIsPickup = commentData.isPickup

        const commentSize = Math.round(((USER_CONFIG.Size-0.2) * (screenHeight/USER_CONFIG.LaneNum))*100)/100
        const commentSpeed = calcSpeed(commentLength, commentData.isOwner, commentData.isModerator, commentData.isMember)
        const commentLaneNum = judgeLaneNum(commentData)

        let html = ''
        html += '<span class="fyc_comment" data-lane="'+commentLaneNum+'" style="'
        html += 'visibility: '+COMMENTS.Visibility+';'
        if(commentIsMine){
            html += 'border-style: "solid";'//自分のコメントは縁取り
        }
        html += 'color: '+commentColor+';'
        html += 'font-size: '+commentSize+'px;'
        html += 'font-weight: '+USER_CONFIG.Weight+';'
        html += 'font-family: '+USER_CONFIG.Font+';'
        html += 'opacity: '+USER_CONFIG.Opacity+';'
        html += 'animation-name: lane'+commentLaneNum+';'
        html += 'animation-duration: '+commentSpeed+'s;'
        html += '">'+commentHTML+'</span>'

        if(document.getElementsByClassName('fyc_comment_usable').length > 0){
            const element = document.getElementsByClassName('fyc_comment_usable')
            element[element.length-1].outerHTML = html
        }else{
            document.getElementById('fyc_comment_screen').insertAdjacentHTML('beforeend', html)
        }
    }

    function createNGButton(chat, id){
        //既にボタンがあれば無視
        if(chat.children['content'] && chat.children['content'].children['fyc_ngbutton'])return
        //スパチャは無視
        if(chat.children['card'])return

        let button = document.createElement('button')
        button.className = 'style-scope yt-icon-button fyc_button'
        button.id = 'fyc_ngbutton'
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
                console.log('【FYC】Added to Banned Users: '+id)
                if(USER_CONFIG.NGUsers !== null && USER_CONFIG.NGUsers != ""){
                    USER_CONFIG.NGUsers += '\n'+id
                }else{
                    USER_CONFIG.NGUsers += id
                }
                GM_setValue('FYC_NG_USERS', GM_getValue('FYC_NG_USERS')+'\n'+id)
                document.getElementById('fyc_ngusers').value = USER_CONFIG.NGUsers
                SETTINGS.NGUsers = USER_CONFIG.NGUsers.split(/\r\n|\n/)

                chat.style.display='none'

                toastr.success('Added Banned User: '+id)
            }catch(e){
                toastr.error('Error: '+e.message)
            }
        }

        chat.children['content'].children['message'].appendChild(button)
    }

    function createPickupUsers1Button(chat, id){
        //既にボタンがあれば無視
        if(chat.children['content'] && chat.children['content'].children['fyc_pickup1button'])return
        //スパチャは無視
        if(chat.children['card'])return

        let button = document.createElement('button')
        button.className = 'style-scope yt-icon-button fyc_button'
        button.id = 'fyc_pickup1button'
        button.style = 'padding: 0px;width: 20px; height: 20px;'
        button.setAttribute('aria-label','強調ユーザー1に入れる')
        button.innerHTML =
            '<div style="width: 100%; height: 80%;fill: var(--yt-spec-text-secondary);">'+
                '<svg class="style-scope yt-icon" width="100%" height="100%" version="1.1" viewBox="0 0 512 512" x="0px" y="0px">'+
                    '<style type="text/css">'+
                    '.st0{fill:#4B4B4B;}'+
                    '</style>'+
                    '<g>'+
'<path class="st0" d="M495.469,241.969c-113.594,0-152.875-28.5-174.906-50.531c-22.031-22.125-50.578-61.344-50.578-174.922 c0-4.328-0.453-16.516-14.016-16.516C242.531,0,242,12.188,242,16.516c0,113.578-28.563,152.797-50.594,174.922 c-22.094,22.031-61.375,50.531-174.906,50.531c-4.344,0-16.5,0.5-16.5,14.047c0,13.453,12.156,13.938,16.5,13.938 c113.531,0,152.813,28.578,174.906,50.625C213.438,342.625,242,381.922,242,495.5c0,4.344,0.531,16.5,13.969,16.5 c13.563,0,14.016-12.156,14.016-16.5c0-113.578,28.547-152.875,50.578-174.922c22.031-22.078,61.313-50.625,174.906-50.625 c4.328,0,16.531-0.422,16.531-13.984C512,242.516,499.797,241.969,495.469,241.969z" style="fill: rgb(150, 150, 150);"></path>'+
                    '</g>'+
                '</svg>'+
            '</div>'

        button.onclick = () =>{
            try{
                console.log('【FYC】Added to Picup Users A: '+id)
                if(USER_CONFIG.PickupUsers1 !== null && USER_CONFIG.PickupUsers1 != ""){
                    USER_CONFIG.PickupUsers1 += '\n'+id
                }else{
                    USER_CONFIG.PickupUsers1 += id
                }
                GM_setValue('FYC_PICKUP_USERS1', GM_getValue('FYC_PICKUP_USERS1')+'\n'+id)
                document.getElementById('fyc_pickupusers1').value = USER_CONFIG.PickupUsers1
                SETTINGS.PickupUsers1 = USER_CONFIG.PickupUsers1.split(/\r\n|\n/)

                toastr.success('Added Pickup User 1: '+id)
            }catch(e){
                toastr.error('Error: '+e.message)
            }
        }

        chat.children['content'].children['message'].appendChild(button)
    }

    //チャット欄に追加されたチャットから必要なものを抽出する
    function convertChat(chat){
        const MAX_LENGTH = USER_CONFIG.MaxLength

        let html = ''
        let length = 0
        let color = USER_CONFIG.Color
        let isMine = false
        let isMember = false
        let authorID = null
        let isOwner = false
        let isModerator = false
        let isPickup = false

        //オーナーチップの有無
        if(chat.getElementsByClassName('owner')[0]){
            isOwner = true
            color = USER_CONFIG.ColorOwner
        }
        //モデレーターチップの有無
        if(chat.getElementsByClassName('moderator')[0]){
            isModerator = true
            color = USER_CONFIG.ColorModerator
        }
        //メンバーチップの有無
        if(chat.getElementsByClassName('member')[0]){
            isMember = true
            color = USER_CONFIG.ColorMember
        }

        //チャットの子要素を見ていく
        let children = Array.from(chat.children)
        let authorName = ''
        children.some(_chat =>{

            let childID = _chat.id

            //テキストの場合
            if(childID === 'content'){

                authorName = _chat.querySelector('#author-name').innerText

                //モデレーターの名前表示
                if(chat.getElementsByClassName('owner')[0]
                    || (chat.getElementsByClassName('moderator')[0] && SETTINGS.DisplayModeratorName === true)
                    || (chat.getElementsByClassName('member')[0] && SETTINGS.DisplayMemberName === true)
                    || SETTINGS.DisplayNonMemberName === true){
                        html += authorName + ': '
                }


                let text = Array.from(_chat.children).find((v) => v.id === 'message')
                //正規表現で文字と画像要素を分ける
                let textChildren = text.innerHTML.split(/<img|">/g)
                textChildren.some(_text => {
                    //絵文字の場合

                    /* ちょくちょくclassが変わるためメモのつもり */
//                    if(_text.match('emoji style-scope yt-live-chat-text-message-renderer')){
                    if(_text.match('emoji yt-formatted-string style-scope yt-live-chat-text-message-renderer')){

                        let src = _text.match(/src="(\\.|[^"\\])*"/g)//<img 「src="xxxxxxx"」 ...>
                        let size = Math.round(((USER_CONFIG.Size-0.2) * (LIVE_PAGE.getMainVideo().clientHeight/USER_CONFIG.LaneNum))*100)/100

                        html += '<img '+src+' height="'+size+'px">'
                        length++
                    }else{//テキストの場合
                        html += (_text.length >= MAX_LENGTH)? _text.substr(0, MAX_LENGTH) : _text//最大文字数以上なら切り捨て
                        length += _text.length
                    }
                    if(length >= MAX_LENGTH)return true
                })

            }
            //アイコンの場合(アイコンの画像URLはアカウントによって違うためこれでNGユーザー処理が出来そうだ)
            if(childID === 'author-photo'){
                //yt3.ggpht.com/【-xxxxxxxxxxx】/AAAAAAAAAAI/AAAAAAAAAAA/【xxxxxxxxxxx】/s32-c-k-no-mo-rj-c0xffffff/photo.jpg
                let str = _chat.lastElementChild.getAttribute('src')||''
                let result = str.split('/')

                // nから初まる大量の文字にする…？じゃあ下のフォーマットで、"ほにゃらら"だけを使って識別してみる
                // ユーザー名:[ほにゃらら]
                // ここではまだauthorNameを取れないので、「ユーザー名」は返却のタイミングで代入
                authorID = '[' + result[4].substring(5, result[4].indexOf("=s32")) + ']'

                //強調ユーザーグループAの場合
                if(checkPickupUsers1(authorID)){
                    isPickup = true
                    color = USER_CONFIG.ColorPickup1
                }

                //アイコンの表示
                if(chat.getElementsByClassName('owner')[0]
                    || (chat.getElementsByClassName('moderator')[0] && SETTINGS.DisplayModeratorName === true)
                    || (chat.getElementsByClassName('member')[0] && SETTINGS.DisplayMemberIcon === true)
                    || SETTINGS.DisplayNonMemberIcon === true){
                    if(childID === 'author-photo'){
                        let str = _chat.lastElementChild.getAttribute('src')||''
                        let result = str.split('/')

                        html += '<img src="'+str+'">&nbsp;'
                    }
                }
            }
            //スパチャの場合
            if(childID === 'card'){
                //通常
                if(_chat.className === 'style-scope yt-live-chat-paid-message-renderer'){
                    let header = _chat.children[0]
                    let content = _chat.children[1]
                    let text = content.children[0].innerText
                    let textColor = window.getComputedStyle(header, null).getPropertyValue('background-color');//文字の色
                    let amountColor = window.getComputedStyle(content, null).getPropertyValue('background-color');//金額の色
                    authorName = _chat.querySelector('#author-name')
                    let paidAmount = _chat.querySelector('#purchase-amount')||_chat.querySelector('#purchase-amount-chip')

                    text = (text.length >= MAX_LENGTH)? text.substr(0,MAX_LENGTH) : text
                    html += '<span style="color: '+textColor+';">'+authorName.innerText+': </span>'
                    html += '<span style="color: '+textColor+';">'+text+'</span>'
                    html += '<span style="color: '+amountColor+'; font-size: smaller;"><strong>'+paidAmount.innerText+'</strong></span>'

                    length += text.length + paidAmount.innerText.length

                    authorID = null
                }
                //ステッカー
                if(_chat.className === 'style-scope yt-live-chat-paid-sticker-renderer'){
                    let textColor = window.getComputedStyle(chat, null).getPropertyValue('--yt-live-chat-paid-sticker-chip-background-color')
                    let amountColor = window.getComputedStyle(chat, null).getPropertyValue('--yt-live-chat-paid-sticker-background-color')

                    //本当ならステッカーも表示させたいが、srcが取得出来るのはimg要素が出てから0.1秒遅延があり、無理
                    //let sticker = _chat.querySelector('#sticker')

                    authorName = _chat.querySelector('#author-name')
                    let paidAmount = _chat.querySelector('#purchase-amount')||_chat.querySelector('#purchase-amount-chip')

                    html += '<span style="color: '+textColor+';">'+authorName.innerText+': </span>'
                    html += '<span style="color: '+amountColor+'; font-size: smaller;"><strong>'+paidAmount.innerText+'</strong></span>'

                    length += paidAmount.innerText.length

                    authorID = null
                }
            }
        })

        let convertedComment={
            html: html,
            length: length,
            color: color,
            isMine: isMine,
            isMember: isMember,
            isOwner: isOwner,
            isModerator: isModerator,
            isPickup: isPickup,
            authorID: authorName + authorID
        }

        return convertedComment
    }
    //レーン判定
    function judgeLaneNum(commentData){
        /*
        *1. 描画されてるコメントを全部見る
        *2. コメントの右端がスクリーンからはみ出てたらそのコメントのdata-lane属性のレーン番号をfalseにする　そうでないならtrue
        *(2.5). 一つ前のコメントとの文字数差が10文字以上、かつ、一つ前のコメントのX座標がプレイヤーの横幅*0.4より右にある、という場合、コメントの判定ボックスを画面外まで引き伸ばして強制的にfalseにする(コメントが追い越して被るのを防ぐため)
        *3. レーンの真偽を頭から順番に見る。falseだったら次のレーンを見て、trueだったらそのレーンに設定してbreak
        */
            const screenWidth = LIVE_PAGE.getPlayer().clientWidth
            const comments = COMMENTS.getAll()
            const latestCommentLength = commentData.length

            let acceptableLane = new Array(USER_CONFIG.LaneNum*2-1).fill(true)
            //1と2
            //console.log('judge: ' + commentData.html)
            for(let i = 0; i <= comments.length - 1; i++){
                const commentLane = comments[i].getAttribute('data-lane')
                const commentX = comments[i].getBoundingClientRect().x + comments[i].getBoundingClientRect().width//コメントの右端のx座標
                const commentLength = comments[i].innerText.length

                //2.5(なんともアナログな調整法だけど)
                let commentBoxAdjustment = 0
                if(latestCommentLength - commentLength >= 3　&& commentX > screenWidth * 0.8 && commentX > 0){
                    commentBoxAdjustment = screenWidth - (commentX) + 70
                }
                if(latestCommentLength - commentLength >= 10　&& commentX > screenWidth * 0.4 && commentX > 0){
                    commentBoxAdjustment = screenWidth - (commentX) + 70
                }
                //コメントの右端がスクリーンからはみ出ていたらfalse
                if(acceptableLane[commentLane]!==false){
                    acceptableLane[commentLane] = commentX + commentBoxAdjustment> screenWidth ? false : true
                    //console.log('acceptableLane['+commentLane+']: '+acceptableLane[commentLane])
                    //console.log(': '+commentX+' + '+commentBoxAdjustment+' > '+screenWidth)
                }
            }
            //3
            let resultLaneNum = 0
            let i = 0
            while(resultLaneNum === 0){
                if(acceptableLane[i]==true){
                    resultLaneNum = i
                    i = 0
                    break
                }else if(i > USER_CONFIG.LaneNum*3-1){//無限ループ対策
                    resultLaneNum = 0
                    i = 0
                    break
                }else if(acceptableLane[i]==false){
                    resultLaneNum = 0
                }
                i++
            }

            return resultLaneNum
        }

    function checkBannedWords(commentData){
        if(!USER_CONFIG.NGWords||!commentData.html){
            return false
        }

        let target = commentData.html

        for(let i = 0; i < SETTINGS.NGWords.length; i++){
            if(target.indexOf(SETTINGS.NGWords[i]) > -1){
                //console.log('Banned Words:  '+commentData.html)
                return true
                break
            }
        }
        return false
    }

    function checkBannedRegexpWords(commentData){
        if(!USER_CONFIG.NGRegWords||!commentData.html){
            return false
        }

        let target = commentData.html

        for(let i = 0; i < SETTINGS.NGRegWords.length; i++){
            if(SETTINGS.NGRegWords[i] === ''){continue}
            let result = target.match(SETTINGS.NGWords[i])
            if(result !== null){
                //console.log('Banned Words(Regexp):  '+commentData.html)
                return true
                break
            }
        }
        return false
    }

    function checkBannedUsers(commentData){
        if(!USER_CONFIG.NGUsers||!commentData.authorID){
            return false
        }

        let target = commentData.authorID

        for(let i = 0; i < SETTINGS.NGUsers.length; i++){
            if(SETTINGS.NGUsers[i]!==''){
                let checkID = SETTINGS.NGUsers[i].slice(SETTINGS.NGUsers[i].indexOf("[") + 1, -1)
                let result = target.match(checkID)
                if(result !== null){
                    //log(commentData.authorID+': '+commentData.html)
                    return true
                    break
                }
            }
        }
        return false
    }

    function checkPickupUsers1(authorID){
        if(!USER_CONFIG.PickupUsers1||!authorID){
            return false
        }

        let target = authorID

        for(let i = 0; i < SETTINGS.PickupUsers1.length; i++){
            if(SETTINGS.PickupUsers1[i]!==''){
                let checkID = SETTINGS.PickupUsers1[i].slice(SETTINGS.PickupUsers1[i].indexOf("[") + 1, -1)
                let result = target.match(checkID)
                if(result !== null){
                    //log(authorID)
                    return true
                    break
                }
            }
        }
        return false
    }

    function findCommentsOutOfScreen(){
        const comments = COMMENTS.getAll()
        for(let i = comments.length-1; i >= 0; i--){
            if(comments[i].getBoundingClientRect().x + comments[i].getBoundingClientRect().width <= 0){//なんかしらんけど70足りねえから足してる
                //再利用
                if(comments[i].className !== 'fyc_comment fyc_comment_usable'){
                    comments[i].className += ' fyc_comment_usable'
                    //console.log(comments[i])
                }
            }
        }
    }

    function deleteOldComments(){
        const comments = COMMENTS.getAll()
        if(comments.length<=USER_CONFIG.Limit)return;
        while(comments.length>USER_CONFIG.Limit){
            comments[0].parentNode.removeChild(comments[0])
        }
    }

    function deleteAllComments(){
        const comments = COMMENTS.getAll()
        for(let i = comments.length-1; i >= 0; i--){
            comments[i].parentNode.removeChild(comments[i])
        }
    }

    function createCommentSubmitForm(){
        //既にあればやらない
        if(document.getElementById('fyc_input_comment') !== null)return
        //送信フォーム設置
        let parent = document.getElementsByClassName('ytp-chrome-controls')[0]
        let inputArea = document.createElement('div')
        inputArea.id = 'fyc_input_comment'
        inputArea.style = 'display: inline-block;'
        inputArea.innerHTML =
            `<input type="text" id="fyc_input_comment_textbox" class="style-scope paper-input" placeholder="メッセージを入力…" autocapitalize="none" autocomplete="off" autocorrect="off" spellcheck="false" onblur="onBlurSubmitForm();" onfocus="onFocusSubmitForm();">
             <i class="fa fa-user fa-lg fa-fw" aria-hidden="true"></i>`
        parent.appendChild(inputArea)
        //Enterキー押下時
        $('#fyc_input_comment_textbox').on('keydown',(e)=>{
            if(e.keyCode === 13){
                const message = document.querySelector('#fyc_input_comment_textbox').value
                document.getElementById('chatframe').contentDocument.querySelector('#input.style-scope.yt-live-chat-text-input-field-renderer').innerHTML = message
                document.getElementById('chatframe').contentDocument.querySelector('#send-button.style-scope.yt-live-chat-message-input-renderer').querySelector('#button.style-scope.yt-icon-button').click()
            }
        })

        //ショートカットキー無効化
        var ignoreShortcut = (e) => {
            //J,K,L,F,M,C
            var list = [74,75,76,70,77,67];
            if(list.indexOf(e.keyCode) != -1){
                e.stopPropagation();
            }
        }
        document.querySelector('#fyc_input_comment_textbox').onfocus = () => {
            log('focus')
            window.addEventListener("keydown", ignoreShortcut, true);
        }
        document.querySelector('#fyc_input_comment_textbox').onblur = () => {
            log('blur')
            window.removeEventListener("keydown", ignoreShortcut, true)
        }
    }

    function simplificationCommentField(chat, setting){
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

    // TODO:
    function emphasizeCommentField(chat, setting){
        if(setting === true){
            chat.style.borderTop='1px solid var(--yt-spec-text-secondary)'
            chat.style.borderBottom='1px solid var(--yt-spec-text-secondary)'
//            if(chat.getElementsByClassName('style-scope yt-live-chat-paid-message-renderer').length>0)return
//            if(chat.getElementsByClassName('owner')[0])return
//            chat.children['author-photo'].style.display = 'none'
//            chat.querySelector('yt-live-chat-author-chip.style-scope.yt-live-chat-text-message-renderer').style.display = 'none'
        }else{
            chat.style.borderTop='none'
            chat.style.borderBottom='none'
//            if(chat.getElementsByClassName('style-scope yt-live-chat-paid-message-renderer').length>0)return
//            if(chat.getElementsByClassName('owner')[0])return
//            chat.children['author-photo'].style.display = 'block'
//            chat.querySelector('yt-live-chat-author-chip.style-scope.yt-live-chat-text-message-renderer').style.display = 'inline-flex'
//            chat.setAttribute('style', 'border-bottom: none;')
        }
    }

    function changeSizeInChatField(size){
        document.getElementsByClassName('yt-live-chat-renderer').fontSize = size+'px'
    }

    //-----------設定パネル関連-----------------

    function putEvents(){
        const video = document.getElementsByTagName('video')[0]
        video.addEventListener('playing', changeCommentAnimState)
        video.addEventListener('pause', changeCommentAnimState)
    }

    const changeCommentAnimState = () => {
        if(document.getElementsByTagName('video')[0].paused){
            document.styleSheets.item(document.styleSheets.length-1).cssRules.item(0).style.animationPlayState = 'paused'
            COMMENTS.AnimState = 'paused'
        }else{
            document.styleSheets.item(document.styleSheets.length-1).cssRules.item(0).style.animationPlayState = 'running'
            COMMENTS.AnimState = 'running'
        }
    }

    //コメントリロードボタン配置
    function createToggleCommentReloadButton(){
        //既にあればやらない
        if(document.getElementById('fyc_comment_reload_button') !== null){
            return
        }

        const parent = document.querySelector('.ytp-right-controls')
        let button = document.createElement('button')
        button.className = 'ytp-button fyc-comment-button'
        button.id = 'fyc_comment_reload_button'
        button.type = 'button'

        button.setAttribute('aria-label', 'コメントリロード')
        button.setAttribute('title', 'コメントリロード')
        button.innerHTML =
        `<svg id="icon_comment_button" version="1.1" viewBox="0 0 36 36" style="width:100%;">
         <path class="st0" d="M268.149,12.153c-7.179,0-14.309,0.309-21.374,0.926l4.905,56.561h0.016 c5.392-0.462,10.882-0.698,16.453-0.698c51.745,0.016,98.326,20.886,132.272,54.782c33.896,33.954,54.783,80.534,54.783,132.28 c0,51.745-20.887,98.326-54.783,132.271c-33.945,33.896-80.526,54.767-132.272,54.783c-51.746-0.016-98.326-20.886-132.272-54.783 c-18.239-18.264-32.532-40.279-42.017-64.699l31.102-4.376L44.729,201.952l-17.93,54.052h-2.485c0,2.192,0.26,4.32,0.325,6.505 L0,336.765l36.414-5.116c31.85,97.611,123.485,168.189,231.735,168.197C402.84,499.839,511.984,390.688,512,256.004 C511.984,121.313,402.84,12.161,268.149,12.153z" style="fill: rgb(75, 75, 75);"></path>
         <path class="st0" d="M113.041,151.425c3.054-4.532,6.335-8.941,9.794-13.237l-44.144-35.707 c-4.466,5.522-8.722,11.23-12.717,17.167l47.052,31.777H113.041z" style="fill: rgb(75, 75, 75);"></path>
         <path class="st0" d="M193.762,84.314c9.079-3.938,18.532-7.17,28.292-9.648L208.12,19.607c-12.766,3.232-25.11,7.472-36.966,12.62 l22.609,52.078V84.314z" style="fill: rgb(75, 75, 75);"></path>
         <path class="st0" d="M167.353,98.412l-30.664-47.807c-10.996,7.041-21.374,14.95-31.054,23.615l37.86,42.318 C150.933,109.887,158.908,103.812,167.353,98.412z" style="fill: rgb(75, 75, 75);"></path>
         </svg>`

        button.onclick = buttonCommentReload

        //挿入
        parent.appendChild(button)

    }

    //コメント表示切り替えボタン設置
    function createToggleCommentDisplayButton(){
        //既にあればやらない
        if(document.getElementById('fyc_comment_visibility_button') !== null){
            return
        }

        const parent = document.querySelector('.ytp-right-controls')
        let button = document.createElement('button')
        button.className = 'ytp-button fyc-comment-button'
        button.id = 'fyc_comment_visibility_button'
        button.type = 'button'
        if(COMMENTS.Visibility === 'visible'){//コメントが表示設定だったとき
            button.setAttribute('aria-label', 'コメント非表示')
            button.setAttribute('title', 'コメント非表示')
            button.innerHTML =
            `<svg id="icon_comment_button" version="1.1" viewBox="0 0 36 36" style="width:100%;">
             <path id="comment_button_path" d="M 11 12 L 28 12 Q 29 12 29 13 L 29 22 Q 29 23 28 23 L 27 23 L 27 25 L 23 23 L 11 23 Q 10 23 10 22 L 10 13 Q 10 12 11 12 Z"
             fill="#fff" fill-opacity="1" stroke="#fff" stroke-width="2"></path>
             </svg>`
        }else{//コメントが非表示設定だったとき
            button.setAttribute('aria-label', 'コメント表示')
            button.setAttribute('title', 'コメント表示')
            button.innerHTML =
            `<svg id="icon_comment_button" version="1.1" viewBox="0 0 36 36" style="width:100%;">
             <path id="comment_button_path" d="M 11 12 L 28 12 Q 29 12 29 13 L 29 22 Q 29 23 28 23 L 27 23 L 27 25 L 23 23 L 11 23 Q 10 23 10 22 L 10 13 Q 10 12 11 12 Z"
             fill="#fff" fill-opacity="0" stroke="#fff" stroke-width="2"></path>
             </svg>`
        }
        button.onclick = changeCommentDisplay

        //挿入
        parent.appendChild(button)

    }

    //コメントリロードボタン処理
//    document.getElementById('fyc_reload_button').onclick = function(){
    const buttonCommentReload = () => {
        try{
            // TODO:参考
//            document.getElementById('chatframe').contentDocument.querySelector('#send-button.style-scope.yt-live-chat-message-input-renderer').querySelector('#button.style-scope.yt-icon-button').click()
//            document.getElementsByClassName('yt-simple-endpoint style-scope yt-dropdown-menu iron-selected').click()
//            document.getElementById('chatframe').contentDocument.querySelector('#send-button.style-scope.yt-live-chat-message-input-renderer').querySelector('#button.style-scope.yt-icon-button').click()

            // TODO: 動かない：「上位のチャットのリプレイ」イベント発生
//            document.getElementsByClassName('yt-simple-endpoint style-scope yt-dropdown-menu iron-selected').parentNode.contentDocument.querySelector('a').click()
            $('.yt-simple-endpoint.style-scope.yt-dropdown-menu.iron-selected').click()
//            $('.iron-selected').click()

            console.log(LIVE_PAGE.getChatField())
//            document.getElementById('fyc_comment_screen').parentNode.removeChild(document.getElementById('fyc_comment_screen'))
//            document.getElementsByClassName('ytp-button fyc-comment-button')[0].parentNode.removeChild(document.getElementsByClassName('ytp-button fyc-comment-button')[0])

            initialize()
            ChatFieldObserver.disconnect()
            ChatFieldObserver.observe(LIVE_PAGE.getChatField(), {childList: true})

            toastr.success('Reloaded.')
        }catch(e){
            toastr.error('Error: '+e.message)
        }
    }

    //表示切り替え処理
    const changeCommentDisplay = () => {
        const comments = COMMENTS.getAll()
        if(COMMENTS.Visibility==='visible'){//コメントを非表示にするとき
            GM_setValue('FYC_DISPLAY_COMMENTS', false)
            COMMENTS.Visibility='hidden'
            if(comments.length){
                for(let i = comments.length-1; i >= 0; i--){
                    comments[i].style.visibility = 'hidden'
                }
            }
            document.getElementById('fyc_comment_visibility_button').setAttribute('aria-label', 'コメント表示')
            document.getElementById('fyc_comment_visibility_button').setAttribute('title', 'コメント表示')
            document.getElementById('comment_button_path').setAttribute('fill-opacity', '0')
        }else{//コメントを表示させるとき
            GM_setValue('FYC_DISPLAY_COMMENTS', true)
            COMMENTS.Visibility='visible'
            if(comments.length){
                for(let i = comments.length-1; i >= 0; i--){
                    comments[i].style.visibility = 'visible'
                }
            }
            document.getElementById('fyc_comment_visibility_button').setAttribute('aria-label', 'コメント非表示')
            document.getElementById('fyc_comment_visibility_button').setAttribute('title', 'コメント非表示')
            document.getElementById('comment_button_path').setAttribute('fill-opacity', '1')
        }
    }

    //設定パネル
    function createSettingPanel(){
        if(document.getElementsByClassName('fyc_settings')[0]!==undefined)return

            const HTML_EN = `
<div class="fyc_settings">
  <div class="fyc_panel" id="fyc-setting-panel-block-or-hide">

      <div class="fyc_panel_box">
        <div>
          <span>Language(Refresh after change)</span>
          <div>
            <select id="fyc_input_lang" style="width: 60%">
              <option value="FYC_EN">English</option>
              <option value="FYC_JA">日本語</option>
            </select>
          </div>
        </div>

        <div>
          <span>Font</span>
          <div>
            <select id="fyc_input_font" style="width: 60%">
            <option value="Default">Default</option>
            <option value="arial">Arial</option>
            <option value="arial black">Arial Black</option>
            <option value="arial narrow">Arial Narrow</option>
            <option value="Century">Century</option>
            <option value="Comic Sans MS">Comic Sans MS</option>
            <option value="Courier">Courier</option>
            <option value="cursive">cursive</option>
            <option value="fantasy">fantasy</option>
            <option value="Impact">Impact</option>
            <option value="Meiryo">Meiryo</option>
            <option value="Meiryo UI">Meiryo UI</option>
            <option value="monospace">monospace</option>
            <option value="Monotype Corsiva">Monotype Corsiva</option>
            <option value="MS PGothic">MS PGothic</option>
            <option value="MS Gothic">MS Gothic</option>
            <option value="MS Sans Serif">MS Sans Serif</option>
            <option value="MS Serif">MS Serif</option>
            <option value="MS UI Gothic">MS UI Gothic</option>
            <option value="sans-serif">Sans-serif</option>
            <option value="serif">Serif</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Yu Gothic">Yu Gothic</option>
            <option value="YuGothic">YuGothic</option>
            </select>
          <span id="fyc_font_sample_text" style="`+USER_CONFIG.Font+`">Aa1あア亜</span>
          </div>
        </div>

        <div>
          <span>Color<font color="red">*</font></span>
          <div>
            <input type="text" class="fyc_input_text" id="fyc_input_color" /*name="fyc_color"*/ size="10" value="`+USER_CONFIG.Color+`"maxlength="30">
            <span id="fyc_font_sample_text_normal" style="color:`+USER_CONFIG.Color+`">Aa1あア亜</span>
          </div>
        </div>
        <div>
          <span>Color(Owner)<font color="red">*</font></span>
          <div>
            <input type="text" class="fyc_input_text" id="fyc_input_color_owner" /*name="fyc_color"*/ size="10" value="`+USER_CONFIG.ColorOwner+`"maxlength="30">
            <span id="fyc_font_sample_text_owner" style="color:`+USER_CONFIG.ColorOwner+`">Aa1あア亜</span>
          </div>
        </div>
        <div>
          <span>Color(Moderator)<font color="red">*</font></span>
          <div>
            <input type="text" class="fyc_input_text" id="fyc_input_color_moderator" /*name="fyc_color"*/ size="10" value="`+USER_CONFIG.ColorModerator+`"maxlength="30">
            <span id="fyc_font_sample_text_moderator" style="color:`+USER_CONFIG.ColorModerator+`">Aa1あア亜</span>
          </div>
        </div>
        <div>
          <span>Color(Member)<font color="red">*</font></span>
          <div>
            <input type="text" class="fyc_input_text" id="fyc_input_color_member" /*name="fyc_color"*/ size="10" value="`+USER_CONFIG.ColorMember+`"maxlength="30">
            <span id="fyc_font_sample_text_member" style="color:`+USER_CONFIG.ColorMember+`">Aa1あア亜</span>
          </div>
        </div>
        <div style="text-align: right;margin: 3px 6px">
          <span><font size=1><font color="red">*</font> requires [Reload]</font></span>
        </div>
        <div style="text-align: right;margin: 3px 6px">
          <span><font size=1><a href="https://greasyfork.org/ja/scripts/421313-flow-youtube-chat-modified/feedback" style="color: white;" target="_blank" rel="noopener">* Report to this page</a></font></span>
        </div>
<br>
          <br>[Extension 1]
        <div style="font-size:10px;">
          <span>Pickup User Group A<font color="red">*</font></span>
          <div>
            <textarea name="fyc_pickupusers1" id="fyc_pickupusers1" rows="4" style="resize: both; max-height: 250px; width: 190px;">`+USER_CONFIG.PickupUsers1+`</textarea>
          </div>
        </div>
        <div style="font-size:10px;">
          <span>Color(Pickup User Group A)<font color="red">*</font></span>
          <div>
            <input type="text" class="fyc_input_text" id="fyc_input_color_pickup1" /*name="fyc_color"*/ size="10" value="`+USER_CONFIG.ColorPickup1+`"maxlength="30">
            <span id="fyc_font_sample_text_pickup1" style="color:`+USER_CONFIG.ColorPickup1+`">Aa1あア亜</span>
          </div>
        </div>
        <div style="font-size:10px;">
          <div>
            <input type="checkbox" class="fyc_input_checkbox" id="fyc_check_pickup_users" checked="`+SETTINGS.PickupUsersToggle+`"><label for="fyc_check_pickup_users">Show Button to Pickup</label>
          </div>
        </div>
      </div>

      <div class="fyc_panel_box">
    <div>
      <span>Opacity</span>
      <div>
        <input type="range" class="fyc_range" id="fyc_range_opacity" name="fyc_opacity" min="0" value="`+USER_CONFIG.Opacity*10+`" max="10">
        <output id="output_opacity">`+USER_CONFIG.Opacity+`</output>
      </div>
    </div>
      <div>
        <span>Size</span>
          <div>
            <input type="range" class="fyc_range" id="fyc_range_size" name="fyc_size" min="1" value="`+USER_CONFIG.Size*10+`" max="20">
            <output id="output_size">`+USER_CONFIG.Size+`</output>
          </div>
        </div>
        <div>
          <span>Weight</span>
          <div>
            <input type="range" class="fyc_range" id="fyc_range_weight" name="fyc_weight" min="1" value="`+USER_CONFIG.Weight/10+`" max="100">
            <output id="output_weight">`+USER_CONFIG.Weight+`</output>
          </div>
        </div>
        <div>
          <span>Weight(Shadow) <font color="red">*</font></span>
          <div>
            <input type="range" class="fyc_range" id="fyc_range_weight_shadow" name="fyc_weight_shadow" min="0" value="`+USER_CONFIG.WeightShadow*10+`" max="30">
            <output id="output_weight_shadow">`+USER_CONFIG.WeightShadow+`</output>
          </div>
        </div>
        <div>
          <span>Speed</span>
          <div>
            <input type="range" class="fyc_range" id="fyc_range_speed" name="fyc_speed" min="1" value="`+USER_CONFIG.Speed+`" max="50">
            <output id="output_speed">`+USER_CONFIG.Speed+`</output>
          </div>
        </div>
        <div>
          <span>Max number of comments <font color="red">*</font></span>
          <div>
            <input type="range" class="fyc_range" id="fyc_range_limit" name="fyc_weight" min="1" value="`+USER_CONFIG.Limit/5+`" max="40">
            <output id="output_limit">`+USER_CONFIG.Limit+`</output>
          </div>
        </div>
        <div>
          <span>Max number of characters <font color="red">*</font></span>
          <div>
            <input type="range" class="fyc_range" id="fyc_range_max" name="fyc_max" min="1" value="`+USER_CONFIG.MaxLength/5+`" max="40">
            <output id="output_max">`+USER_CONFIG.MaxLength+`</output>
          </div>
        </div>
        <div>
          <span>Number of Lines <font color="red">*</font></span>
          <div>
            <input type="range" class="fyc_range" id="fyc_range_line" name="fyc_line" min="1" value="`+USER_CONFIG.LaneNum+`" max="20">
            <output id="output_line">`+USER_CONFIG.LaneNum+`</output>
          </div>
          <br>[Extension 2]
          <div style="font-size:10px;">
            <div>
              <input type="checkbox" class="fyc_input_checkbox" id="fyc_check_display_owner_speed" checked="`+SETTINGS.DisplayOwnerSpeed+`"><label for="fyc_check_display_owner_speed">Adjust comment speed of Owner</label>
            </div>
            <div>
              <input type="checkbox" class="fyc_input_checkbox" id="fyc_check_display_moderator_speed" checked="`+SETTINGS.DisplayModeratorSpeed+`"><label for="fyc_check_display_moderator_speed">Adjust comment speed of Moderator</label>
            </div>
            <div>
              <input type="checkbox" class="fyc_input_checkbox" id="fyc_check_display_member_speed" checked="`+SETTINGS.DisplayMemberSpeed+`"><label for="fyc_check_display_member_speed">Adjust comment speed of Member</label>
            </div>
          </div>
          <div style="padding-left:30px;font-size:9px;">
          *Speed of the comment decreases
          <br>
          <table>
          <tr><td style="padding-left:10px;">Owner:</td><td style="text-align:right;">100%</td></tr>
          <tr><td style="padding-left:10px;">Moderator:</td><td style="text-align:right;">70%</td></tr>
          <tr><td style="padding-left:10px;">Member:</td><td style="text-align:right;">10%</td></tr>
          </table>
          </div>
        </div>
      </div>

      <div class="fyc_panel_box">
        <div>
          <span>Banned Words</span>
          <div>
            <textarea name="fyc_ngwords" id="fyc_ngwords" rows="4" style="resize: both; max-height: 250px; width: 190px;">`+USER_CONFIG.NGWords+`</textarea>
          </div>
        </div>
        <div>
          <span>Banned Words(Regexp)</span>
          <div>
            <textarea name="fyc_ngwords_reg" id="fyc_ngwords_reg" rows="4" style="resize: both; max-height: 250px; width: 190px;">`+USER_CONFIG.NGRegWords+`</textarea>
          </div>
        </div>
        <div>
          <span>Banned Users<font color="red">*</font></span>
          <div>
            <textarea name="fyc_ngusers" id="fyc_ngusers" rows="4" style="resize: both; max-height: 250px; width: 190px;">`+USER_CONFIG.NGUsers+`</textarea>
          </div>
        </div>
        <div>
          <div>
            <input type="checkbox" class="fyc_input_checkbox" id="fyc_toggle_simple_chat_field" checked="`+SETTINGS.SimpleChatField+`"><label for="fyc_toggle_simple_chat_field">Simple Chat Field</label>
          </div>
          <div>
            <input type="checkbox" class="fyc_input_checkbox" id="fyc_check_button_to_ban" checked="`+SETTINGS.CreateNGButtons+`"><label for="fyc_check_button_to_ban">Show Button to Ban</label>
          </div>
          <div>
            <input type="checkbox" class="fyc_input_checkbox" id="fyc_check_display_moderator_name" checked="`+SETTINGS.DisplayModeratorName+`"><label for="fyc_check_display_moderator_name">Show Moderator's Name</label>
          </div>
          <div>
            <input type="checkbox" class="fyc_input_checkbox" id="fyc_button_toggle_create_comments" checked="`+SETTINGS.CreateComments+`"><label for="fyc_button_toggle_create_comments">Flow comments on screen</label>
          </div>
          <br>[Extension 3]
          <div style="font-size:10px;">
            <div>
              <input type="checkbox" class="fyc_input_checkbox" id="fyc_check_display_member_icon" checked="`+SETTINGS.DisplayMemberIcon+`"><label for="fyc_check_display_member_icon">Show Member's Icon</label>
            </div>
            <div>
              <input type="checkbox" class="fyc_input_checkbox" id="fyc_check_display_member_name" checked="`+SETTINGS.DisplayMemberName+`"><label for="fyc_check_display_member_name">Show Member's Name</label>
            </div>
            <div>
              <input type="checkbox" class="fyc_input_checkbox" id="fyc_check_display_nonmember_icon" checked="`+SETTINGS.DisplayNonMemberIcon+`"><label for="fyc_check_display_nonmember_icon">Show non-Member's Icon</label>
            </div>
            <div>
              <input type="checkbox" class="fyc_input_checkbox" id="fyc_check_display_nonmember_name" checked="`+SETTINGS.DisplayNonMemberName+`"><label for="fyc_check_display_nonmember_name">Show non-Member's Name</label>
            </div>
          </div>

        <div>
          <button id="fyc_reload_button" style="bottom: 0;margin: 6px 0px;">Reload</button>
          <button id="fyc_input_save_button" style="float: right;bottom: 0px;margin: 6px 0px;">SAVE</button>
        </div>

      </div>

    </div>
    </div>
  </div>
  <button type="button" name="panelbutton" value="panelbutton" class="fyc_button" id="fyc-setting-panel-button" style="background: rgba(0,0,0,0);margin-left: 10px;white-space: nowrap;">
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
    <font style="position:relative;top: -2px;margin-left: 8px;">Comment Settings</font>
  </button>
</div>
`
            const HTML_JA = `
<div class="fyc_settings">
  <div class="fyc_panel" id="fyc-setting-panel-block-or-hide">

      <div class="fyc_panel_box">
        <div>
          <span>言語(要ページ再読み込み)</span>
          <div>
            <select id="fyc_input_lang" style="width: 60%">
              <option value="FYC_EN">English</option>
              <option value="FYC_JA">日本語</option>
            </select>
          </div>
        </div>

        <div>
          <span>フォント</span>
          <div>
            <select id="fyc_input_font" style="width: 60%">
            <option value="Default">デフォルト</option>
            <option value="arial">Arial</option>
            <option value="arial black">Arial Black</option>
            <option value="arial narrow">Arial Narrow</option>
            <option value="Century">Century</option>
            <option value="Comic Sans MS">Comic Sans MS</option>
            <option value="Courier">Courier</option>
            <option value="cursive">cursive</option>
            <option value="fantasy">fantasy</option>
            <option value="Impact">Impact</option>
            <option value="Meiryo">メイリオ</option>
            <option value="Meiryo UI">メイリオ UI</option>
            <option value="monospace">monospace</option>
            <option value="Monotype Corsiva">Monotype Corsiva</option>
            <option value="MS PGothic">MS Pゴシック</option>
            <option value="MS Gothic">MS ゴシック</option>
            <option value="MS Sans Serif">MS Sans Serif</option>
            <option value="MS Serif">MS Serif</option>
            <option value="MS UI Gothic">MS UI Gothic</option>
            <option value="sans-serif">Sans-serif</option>
            <option value="serif">Serif</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Yu Gothic">遊ゴシック</option>
            <option value="YuGothic">游ゴシック体</option>
            </select>
            <span id="fyc_font_sample_text">Aa1あア亜</span>
          </div>
        </div>

        <div>
          <span>色(通常)<font color="red">*</font></span>
          <div>
            <input type="text" class="fyc_input_text" id="fyc_input_color" /*name="fyc_color"*/ size="10" value="`+USER_CONFIG.Color+`"maxlength="30">
            <span id="fyc_font_sample_text_normal" style="color:`+USER_CONFIG.Color+`">Aa1あア亜</span>
          </div>
        </div>
        <div>
          <span>色(オーナー)<font color="red">*</font></span>
          <div>
            <input type="text" class="fyc_input_text" id="fyc_input_color_owner" /*name="fyc_color"*/ size="10" value="`+USER_CONFIG.ColorOwner+`"maxlength="30">
            <span id="fyc_font_sample_text_owner" style="color:`+USER_CONFIG.ColorOwner+`">Aa1あア亜</span>
          </div>
        </div>
        <div>
          <span>色(モデレーター)<font color="red">*</font></span>
          <div>
            <input type="text" class="fyc_input_text" id="fyc_input_color_moderator" /*name="fyc_color"*/ size="10" value="`+USER_CONFIG.ColorModerator+`"maxlength="30">
            <span id="fyc_font_sample_text_moderator" style="color:`+USER_CONFIG.ColorModerator+`">Aa1あア亜</span>
          </div>
        </div>
        <div>
          <span>色(メンバー)<font color="red">*</font></span>
          <div>
            <input type="text" class="fyc_input_text" id="fyc_input_color_member" /*name="fyc_color"*/ size="10" value="`+USER_CONFIG.ColorMember+`"maxlength="30">
            <span id="fyc_font_sample_text_member" style="color:`+USER_CONFIG.ColorMember+`">Aa1あア亜</span>
          </div>
        </div>
        <div style="text-align: right;margin: 3px 6px">
          <span><font size=1><font color="red">*</font>は要[再読み込み]</font></span>
        </div>
        <div style="text-align: right;margin: 3px 6px">
          <span><font size=1><a href="https://greasyfork.org/ja/scripts/377491-flow-youtube-chat/feedback" style="color: white;" target="_blank" rel="noopener">バグ報告、要望はこちら</a></font></span>
        </div>
<br>
          <br>[拡張機能１]
        <div style="font-size:10px;">
          <span>強調ユーザーグループA<font color="red">*</font></span>
          <div>
            <textarea name="fyc_pickupusers1" id="fyc_pickupusers1" rows="4" style="resize: both; max-height: 250px; width: 190px;">`+USER_CONFIG.PickupUsers1+`</textarea>
          </div>
        </div>
        <div style="font-size:10px;">
          <span>色(強調ユーザーグループA)<font color="red">*</font></span>
          <div>
            <input type="text" class="fyc_input_text" id="fyc_input_color_pickup1" /*name="fyc_color"*/ size="10" value="`+USER_CONFIG.ColorPickup1+`"maxlength="30">
            <span id="fyc_font_sample_text_pickup1" style="color:`+USER_CONFIG.ColorPickup1+`">Aa1あア亜</span>
          </div>
        </div>
        <div style="font-size:10px;">
          <div>
            <input type="checkbox" class="fyc_input_checkbox" id="fyc_check_pickup_users" checked="`+SETTINGS.PickupUsersToggle+`"><label for="fyc_check_pickup_users">ユーザー強調ボタンを表示する</label>
          </div>
        </div>
      </div>

      <div class="fyc_panel_box">
        <div>
          <span>透明度</span>
          <div>
            <input type="range" class="fyc_range" id="fyc_range_opacity" name="fyc_opacity" min="0" value="`+USER_CONFIG.Opacity*10+`" max="10">
            <output id="output_opacity">`+USER_CONFIG.Opacity+`</output>
          </div>
        </div>
        <div>
          <span>サイズ</span>
          <div>
            <input type="range" class="fyc_range" id="fyc_range_size" name="fyc_size" min="1" value="`+USER_CONFIG.Size*10+`" max="20">
            <output id="output_size">`+USER_CONFIG.Size+`</output>
          </div>
        </div>
        <div>
          <span>太さ</span>
          <div>
            <input type="range" class="fyc_range" id="fyc_range_weight" name="fyc_weight" min="1" value="`+USER_CONFIG.Weight/10+`" max="100">
            <output id="output_weight">`+USER_CONFIG.Weight+`</output>
          </div>
        </div>
        <div>
          <span>太さ(影) <font color="red">*</font></span>
          <div>
            <input type="range" class="fyc_range" id="fyc_range_weight_shadow" name="fyc_weight_shadow" min="0" value="`+USER_CONFIG.WeightShadow*10+`" max="30">
            <output id="output_weight_shadow">`+USER_CONFIG.WeightShadow+`</output>
          </div>
        </div>
        <div>
          <span>速度</span>
          <div>
            <input type="range" class="fyc_range" id="fyc_range_speed" name="fyc_speed" min="1" value="`+USER_CONFIG.Speed+`" max="50">
            <output id="output_speed">`+USER_CONFIG.Speed+`</output>
          </div>
        </div>
        <div>
          <span>最大表示数 <font color="red">*</font></span>
          <div>
            <input type="range" class="fyc_range" id="fyc_range_limit" name="fyc_weight" min="1" value="`+USER_CONFIG.Limit/5+`" max="40">
            <output id="output_limit">`+USER_CONFIG.Limit+`</output>
          </div>
        </div>
        <div>
          <span>最大文字数 <font color="red">*</font></span>
          <div>
            <input type="range" class="fyc_range" id="fyc_range_max" name="fyc_max" min="1" value="`+USER_CONFIG.MaxLength/5+`" max="40">
            <output id="output_max">`+USER_CONFIG.MaxLength+`</output>
          </div>
        </div>
        <div>
          <span>行数 <font color="red">*</font></span>
          <div>
            <input type="range" class="fyc_range" id="fyc_range_line" name="fyc_line" min="1" value="`+USER_CONFIG.LaneNum+`" max="20">
            <output id="output_line">`+USER_CONFIG.LaneNum+`</output>
          </div>
          <br>[拡張機能２]
          <div style="font-size:10px;">
            <div>
              <input type="checkbox" class="fyc_input_checkbox" id="fyc_check_display_owner_speed" checked="`+SETTINGS.DisplayOwnerSpeed+`"><label for="fyc_check_display_owner_speed">チャンネルのコメント速度の自動調節</label>
            </div>
            <div>
              <input type="checkbox" class="fyc_input_checkbox" id="fyc_check_display_moderator_speed" checked="`+SETTINGS.DisplayModeratorSpeed+`"><label for="fyc_check_display_moderator_speed">モデレーターのコメント速度の自動調節</label>
            </div>
            <div>
              <input type="checkbox" class="fyc_input_checkbox" id="fyc_check_display_member_speed" checked="`+SETTINGS.DisplayMemberSpeed+`"><label for="fyc_check_display_member_speed">メンバーのコメント速度の自動調節</label>
            </div>
          </div>
          <div style="padding-left:30px;font-size:9px;">
          ※コメントの速度が減少します
          <br>
          <table>
          <tr><td style="padding-left:10px;">チャンネル：</td><td style="text-align:right;">100%</td></tr>
          <tr><td style="padding-left:10px;">モデレーター：</td><td style="text-align:right;">70%</td></tr>
          <tr><td style="padding-left:10px;">メンバー：</td><td style="text-align:right;">10%</td></tr>
          </table>
          </div>
        </div>
      </div>

      <div class="fyc_panel_box">
        <div>
          <span>NGワード</span>
          <div>
            <textarea name="fyc_ngwords" id="fyc_ngwords" rows="4" style="resize: both; max-height: 250px; width: 190px;">`+USER_CONFIG.NGWords+`</textarea>
          </div>
        </div>
        <div>
          <span>NGワード(正規表現)</span>
          <div>
            <textarea name="fyc_ngwords_reg" id="fyc_ngwords_reg" rows="4" style="resize: both; max-height: 250px; width: 190px;">`+USER_CONFIG.NGRegWords+`</textarea>
          </div>
        </div>
        <div>
          <span>NGユーザー<font color="red">*</font></span>
          <div>
            <textarea name="fyc_ngusers" id="fyc_ngusers" rows="4" style="resize: both; max-height: 250px; width: 190px;">`+USER_CONFIG.NGUsers+`</textarea>
          </div>
        </div>
        <div>
          <div>
            <input type="checkbox" class="fyc_input_checkbox" id="fyc_toggle_simple_chat_field" checked="`+SETTINGS.SimpleChatField+`"><label for="fyc_toggle_simple_chat_field">チャット欄を簡略化する</label>
          </div>
          <div>
            <input type="checkbox" class="fyc_input_checkbox" id="fyc_check_button_to_ban" checked="`+SETTINGS.CreateNGButtons+`"><label for="fyc_check_button_to_ban">NGボタンを表示する</label>
          </div>
          <div>
            <input type="checkbox" class="fyc_input_checkbox" id="fyc_check_display_moderator_name" checked="`+SETTINGS.DisplayModeratorName+`"><label for="fyc_check_display_moderator_name">モデレータの名前を表示する</label>
          </div>
          <div>
            <input type="checkbox" class="fyc_input_checkbox" id="fyc_button_toggle_create_comments" checked="`+SETTINGS.CreateComments+`"><label for="fyc_button_toggle_create_comments">画面上にコメントを流す</label>
          </div>
          <br>[拡張機能３]
          <div style="font-size:10px;">
            <div>
              <input type="checkbox" class="fyc_input_checkbox" id="fyc_check_display_member_icon" checked="`+SETTINGS.DisplayMemberIcon+`"><label for="fyc_check_display_member_icon">メンバーのアイコンを表示する</label>
            </div>
            <div>
              <input type="checkbox" class="fyc_input_checkbox" id="fyc_check_display_member_name" checked="`+SETTINGS.DisplayMemberName+`"><label for="fyc_check_display_member_name">メンバーの名前を表示する</label>
            </div>
            <div>
              <input type="checkbox" class="fyc_input_checkbox" id="fyc_check_display_nonmember_icon" checked="`+SETTINGS.DisplayNonMemberIcon+`"><label for="fyc_check_display_nonmember_icon">メンバー以外のアイコンを表示する</label>
            </div>
            <div>
              <input type="checkbox" class="fyc_input_checkbox" id="fyc_check_display_nonmember_name" checked="`+SETTINGS.DisplayNonMemberName+`"><label for="fyc_check_display_nonmember_name">メンバー以外の名前を表示する</label>
            </div>
          </div>

        <div>
          <button id="fyc_reload_button" style="bottom: 0;margin: 6px 0px;">再読み込み</button>
          <button id="fyc_input_save_button" style="float: right;bottom: 0px;margin: 6px 0px;">保存</button>
        </div>

      </div>

    </div>
    </div>
  </div>
  <button type="button" name="panelbutton" value="panelbutton" class="fyc_button" id="fyc-setting-panel-button" style="background: rgba(0,0,0,0);margin-left: 10px;white-space: nowrap;">
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
    <font style="position:relative;top: -2px;margin-left: 8px;">コメント設定</font>
  </button>
</div>
`

        //言語設定
        let HTML = ''
        if(USER_CONFIG.Lang === 'FYC_EN'){
            HTML = HTML_EN
        }

        if(USER_CONFIG.Lang === 'FYC_JA'){
            HTML = HTML_JA
        }

        //言語設定が不正
        if(HTML == ''){
            HTML = HTML_EN
        }

        const menuElement = document.getElementById('menu-container').getElementsByClassName('dropdown-trigger style-scope ytd-menu-renderer')[0]
        menuElement.insertAdjacentHTML('beforebegin', HTML);

        //設定ボタン押下時のバルーン開閉
        let HIDE_OR_BLOCK_JUDGE_ELEMENT = document.getElementById('fyc-setting-panel-block-or-hide')
        document.getElementById('fyc-setting-panel-button').onclick = function(){
            if(SETTINGS.DisplaySettingPanel==false){
                HIDE_OR_BLOCK_JUDGE_ELEMENT.style.visibility = 'visible'
                SETTINGS.DisplaySettingPanel=true
            }else if(SETTINGS.DisplaySettingPanel==true){
                HIDE_OR_BLOCK_JUDGE_ELEMENT.style.visibility = 'hidden'
                SETTINGS.DisplaySettingPanel=false
            }
        }
        //同期
        document.getElementById('fyc_check_button_to_ban').checked = SETTINGS.CreateNGButtons
        document.getElementById('fyc_check_display_moderator_name').checked = SETTINGS.DisplayModeratorName
        document.getElementById('fyc_button_toggle_create_comments').checked = SETTINGS.CreateComments
        document.getElementById('fyc_toggle_simple_chat_field').checked = SETTINGS.SimpleChatField
        document.getElementById('fyc_input_font').value = USER_CONFIG.Font
        document.getElementById('fyc_input_lang').value = USER_CONFIG.Lang

        document.getElementById('fyc_check_display_owner_speed').checked = SETTINGS.DisplayOwnerSpeed
        document.getElementById('fyc_check_display_moderator_speed').checked = SETTINGS.DisplayModeratorSpeed
        document.getElementById('fyc_check_display_member_speed').checked = SETTINGS.DisplayMemberSpeed
        document.getElementById('fyc_check_display_member_icon').checked = SETTINGS.DisplayMemberIcon
        document.getElementById('fyc_check_display_member_name').checked = SETTINGS.DisplayMemberName
        document.getElementById('fyc_check_display_nonmember_icon').checked = SETTINGS.DisplayNonMemberIcon
        document.getElementById('fyc_check_display_nonmember_name').checked = SETTINGS.DisplayNonMemberName
        document.getElementById('fyc_check_pickup_users').checked = SETTINGS.PickupUsersToggle

        //設定保存
        document.getElementById('fyc_input_save_button').onclick = function(){
            try{
                let val = document.getElementById('fyc_input_color').value
                USER_CONFIG.Color = val
                GM_setValue('FYC_COLOR', val)

                val = document.getElementById('fyc_input_color_owner').value
                USER_CONFIG.ColorOwner = val
                GM_setValue('FYC_COLOR_OWNER', val)

                val = document.getElementById('fyc_input_color_moderator').value
                USER_CONFIG.ColorModerator = val
                GM_setValue('FYC_COLOR_MODERATOR', val)

                val = document.getElementById('fyc_input_color_member').value
                USER_CONFIG.ColorMember = val
                GM_setValue('FYC_COLOR_MEMBER', val)

                val = document.getElementById('fyc_ngwords').value
                USER_CONFIG.NGWords = val
                GM_setValue('FYC_NG_WORDS', val)

                val = document.getElementById('fyc_ngwords_reg').value
                USER_CONFIG.NGRegWords = val
                GM_setValue('FYC_NG_REG_WORDS', val)

                val = document.getElementById('fyc_ngusers').value
                USER_CONFIG.NGUsers = val
                GM_setValue('FYC_NG_USERS', val)

                val = document.getElementById('fyc_input_color_pickup1').value
                USER_CONFIG.ColorPickup1 = val
                GM_setValue('FYC_COLOR_PICKUP1', val)

                val = document.getElementById('fyc_pickupusers1').value
                USER_CONFIG.PickupUsers1 = val
                GM_setValue('FYC_PICKUP_USERS1', val)

                val = document.getElementById('fyc_toggle_simple_chat_field').checked
                SETTINGS.SimpleChatField = val
                GM_setValue('FYC_SIMPLE_CHAT_FIELD', val)

                val = document.getElementById('fyc_check_button_to_ban').checked
                SETTINGS.CreateNGButtons = val
                GM_setValue('FYC_NG_BUTTON', val)

                val = document.getElementById('fyc_check_display_moderator_name').checked
                SETTINGS.DisplayModeratorName = val
                GM_setValue('FYC_DISPLAY_MODERATOR_NAME', val)

                val = document.getElementById('fyc_button_toggle_create_comments').checked
                SETTINGS.CreateComments = val
                GM_setValue('FYC_TOGGLE_CREATE_COMMENTS', val)

                val = document.getElementById('fyc_check_display_owner_speed').checked
                SETTINGS.DisplayOwnerSpeed = val
                GM_setValue('FYC_DISPLAY_OWNER_SPEED', val)
                val = document.getElementById('fyc_check_display_moderator_speed').checked
                SETTINGS.DisplayModeratorSpeed = val
                GM_setValue('FYC_DISPLAY_MODERATOR_SPEED', val)
                val = document.getElementById('fyc_check_display_member_speed').checked
                SETTINGS.DisplayMemberSpeed = val
                GM_setValue('FYC_DISPLAY_MEMBER_SPEED', val)

                val = document.getElementById('fyc_check_display_member_icon').checked
                SETTINGS.DisplayMemberIcon = val
                GM_setValue('FYC_DISPLAY_MEMBER_ICON', val)
                val = document.getElementById('fyc_check_display_member_name').checked
                SETTINGS.DisplayMemberName = val
                GM_setValue('FYC_DISPLAY_MEMBER_NAME', val)
                val = document.getElementById('fyc_check_display_nonmember_icon').checked
                SETTINGS.DisplayNonMemberIcon = val
                GM_setValue('FYC_DISPLAY_NONMEMBER_ICON', val)
                val = document.getElementById('fyc_check_display_nonmember_name').checked
                SETTINGS.DisplayNonMemberName = val
                GM_setValue('FYC_DISPLAY_NONMEMBER_NAME', val)
                val = document.getElementById('fyc_check_pickup_users').checked
                SETTINGS.PickupUsersToggle = val
                GM_setValue('FYC_PICKUP_USERS_TOGGLE', val)

                SETTINGS.NGWords = USER_CONFIG.NGWords.split(/\r\n|\n/)
                SETTINGS.NGRegWords = USER_CONFIG.NGRegWords.split(/\r\n|\n/)
                SETTINGS.NGUsers = USER_CONFIG.NGUsers.split(/\r\n|\n/)

                toastr.success('Saved.')
            }catch(e){
                toastr.error('Error: '+e.message)
            }
        }

        document.getElementById('fyc_input_color').onchange = function(){
            let val = document.getElementById('fyc_input_color').value
            document.getElementById('fyc_font_sample_text_normal').style.color = val
            USER_CONFIG.Color = val
            GM_setValue('FYC_COLOR', val)
        }
        document.getElementById('fyc_input_color_owner').onchange = function(){
            let val = document.getElementById('fyc_input_color_owner').value
            document.getElementById('fyc_font_sample_text_owner').style.color = val
            USER_CONFIG.ColorOwner = val
            GM_setValue('FYC_COLOR_OWNER', val)
        }
        document.getElementById('fyc_input_color_moderator').onchange = function(){
            let val = document.getElementById('fyc_input_color_moderator').value
            document.getElementById('fyc_font_sample_text_moderator').style.color = val
            USER_CONFIG.ColorModerator = val
            GM_setValue('FYC_COLOR_MODERATOR', val)
        }
        document.getElementById('fyc_input_color_member').onchange = function(){
            let val = document.getElementById('fyc_input_color_member').value
            document.getElementById('fyc_font_sample_text_member').style.color = val
            USER_CONFIG.ColorMember = val
            GM_setValue('FYC_COLOR_MEMBER', val)
        }
        document.getElementById('fyc_input_color_member').onchange = function(){
            let val = document.getElementById('fyc_input_color_member').value
            document.getElementById('fyc_font_sample_text_member').style.color = val
            USER_CONFIG.ColorMember = val
            GM_setValue('FYC_COLOR_MEMBER', val)
        }
        document.getElementById('fyc_input_color_pickup1').onchange = function(){
            let val = document.getElementById('fyc_input_color_pickup1').value
            document.getElementById('fyc_font_sample_text_pickup1').style.color = val
            USER_CONFIG.ColorMember = val
            GM_setValue('FYC_COLOR_PICKUP1', val)
        }

        document.getElementById('fyc_input_font').onchange = function(){
            let val = document.getElementById('fyc_input_font').value
            if(val === 'Default')val=''
            document.getElementById('fyc_font_sample_text').style.fontFamily = val
            USER_CONFIG.Font = val
            GM_setValue('FYC_FONT', val)
        }
        document.getElementById('fyc_input_lang').onchange = function(){
            let val = document.getElementById('fyc_input_lang').value
            USER_CONFIG.Lang = val
            GM_setValue('FYC_LANG', val)
        }
        document.getElementById('fyc_range_opacity').oninput = function(val){
            val=this.value/10
            document.getElementById('output_opacity').value = val
            USER_CONFIG.Opacity = val
            GM_setValue('FYC_OPACITY', val)
        }
        document.getElementById('fyc_range_size').oninput = function(val){
            val=this.value/10
            document.getElementById('output_size').value = val
            USER_CONFIG.Size = val
            GM_setValue('FYC_SIZE', val)
        }
        document.getElementById('fyc_range_weight').oninput = function(val){
            val=this.value*10
            document.getElementById('output_weight').value = val
            USER_CONFIG.Weight = val
            GM_setValue('FYC_WEIGHT', val)
        }
        document.getElementById('fyc_range_weight_shadow').oninput = function(val){
            val=this.value/10
            document.getElementById('output_weight_shadow').value = val
            USER_CONFIG.WeightShadow = val
            GM_setValue('FYC_WEIGHT_SHADOW', val)
        }
        document.getElementById('fyc_range_speed').oninput = function(val){
            val=this.value
            document.getElementById('output_speed').value = val
            USER_CONFIG.Speed = val
            GM_setValue('FYC_SPEED', val)
        }
        document.getElementById('fyc_range_limit').oninput = function(val){
            val=this.value*5
            document.getElementById('output_limit').value = val
            USER_CONFIG.Limit = val
            GM_setValue('FYC_LIMIT', val)
        }
        document.getElementById('fyc_range_max').oninput = function(val){
            val=this.value*5
            document.getElementById('output_max').value = val
            USER_CONFIG.Max = val
            GM_setValue('FYC_MAX', val)
        }
        document.getElementById('fyc_range_line').oninput = function(val){
            val=this.value
            document.getElementById('output_line').value = val
            USER_CONFIG.LaneNum = val
            GM_setValue('FYC_LANE_DIV', val)
        }
        document.getElementById('fyc_reload_button').onclick = function(){
            try{
                console.log(LIVE_PAGE.getChatField())
                document.getElementById('fyc_comment_screen').parentNode.removeChild(document.getElementById('fyc_comment_screen'))
                document.getElementsByClassName('ytp-button fyc-comment-button')[0].parentNode.removeChild(document.getElementsByClassName('ytp-button fyc-comment-button')[0])

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
    function log(mes){console.log('【FYC】'+mes)}
})()
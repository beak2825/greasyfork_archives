// ==UserScript==
// @name         Twitch Chat User Highlight
// @namespace    1N07
// @version      0.5
// @description  Highlights messages by user, on username or @username click
// @author       1N07
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @include      https://www.twitch.tv*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/420479/Twitch%20Chat%20User%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/420479/Twitch%20Chat%20User%20Highlight.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ChatList, MutUser, ChatGetInterval, AutoHighlightStopTimeout;
    const MutConf = {childList: true};
    const Observer = new MutationObserver(OnNewComment);

    var HighlightStopTimer = GM_getValue("HighlightStopTimer", 5);
    var MenuOptionRegister;
    MenuOptionRegister = GM_registerMenuCommand("Set HighlightStopTimer ("+HighlightStopTimer+")", MenuOptionRegisterFunc);
    function MenuOptionRegisterFunc()
    {
        HighlightStopTimer = prompt("Set HighlightStopTimer\nThe time it takes for the user highlighting to automatically stop after the mouse leaves the chat area.\nRe-entering the chat area resets and stops the timer.", HighlightStopTimer);
        GM_setValue("HighlightStopTimer", HighlightStopTimer);
        GM_unregisterMenuCommand(MenuOptionRegister);
        MenuOptionRegister = GM_registerMenuCommand("Set HighlightStopTimer ("+HighlightStopTimer+")", MenuOptionRegisterFunc);
    }

    addGlobalStyle(`
        .tcuh-highlighted {
            border: rgba(255,255,255,0.5) 2px solid;
            background: rgba(255,255,255,0.15);
        }
        .chat-line__message-mention, .mention-fragment, .mentioning
        {
            cursor: pointer;
            font-weight: 700;
        }
    `);


    var lastCheckedUrl = window.location.href;
    OnPageLoad();

    setInterval(() => {
        if(lastCheckedUrl != window.location.href)
        {
            lastCheckedUrl = window.location.href;
            OnPageLoad();
        }
    }, 200);


    function OnPageLoad()
    {
        Initialize();
        AfterChatIsAvailable(() => {
            StartClickListener();
        });
    }





    function Initialize()
    {
        if(ChatGetInterval)
            clearInterval(ChatGetInterval);

        if(ChatList && ChatList.length > 0)
            ChatList.off();

        MutUser = ChatList = ChatGetInterval = null;
        StopHighlightingUsers();
    }

    function AfterChatIsAvailable(callback)
    {
        ChatGetInterval = setInterval(() => {
            ChatList = $(".chat-scrollable-area__message-container"); //Live vanilla & FFZ
            if(ChatList.length <= 0) ChatList = $("div.video-chat__message-list-wrapper > div > ul"); //VODs vanilla & FFZ

            if(ChatList.length > 0)
            {
                callback();
                clearInterval(ChatGetInterval);
            }
        }, 50);
    }

    function StartClickListener()
    {
        //post author
        ChatList.on("click", ".video-chat__message-author, .chat-line__username", function(e){ //VODs vanilla & FFZ, Live vanilla & FFZ
            e.preventDefault();
            e.stopPropagation();

            let user = $(this).find(".chat-author__display-name[data-a-user]"); //Live & VODs vanilla
            if(user.length == 0) user = $(this).closest(".chat-line__message[data-user]"); //Live FFZ
            if(user.length == 0) user = $(this).find(".chat-author__display-name"); //VODs FFZ

            user = user.data("aUser") || user.data("user") || user.parent().parent().data("user"); //Live & VODs vanilla || Live FFZ || VODs FFZ

            StartHighlightingUser(user);
        });
        //@
        ChatList.on("click", ".chat-line__message-mention, .mention-fragment, .mentioning", function(e){ //Live & VODs FFZ, Live & VODs vanilla, ?
            e.preventDefault();
            e.stopPropagation();
            let user = $(this).data("login") || $(this).text().replace("@", "").toLowerCase(); //Live & VODs FFZ || Live & VODs vanilla
            StartHighlightingUser(user);
        });
    }

    function StartHighlightingUser(user)
    {
        if(user && user.length > 0)
        {
            StopHighlightingUsers(false);
            if(user == MutUser)
                MutUser = null;
            else
            {
                MutUser = user;

                let targets = ChatList.find(".chat-line__message .chat-author__display-name[data-a-user='"+MutUser+"']"); //Live vanilla
                if(targets.length > 0)
                {
                    targets.each(function(e){
                        $(this).closest(".chat-line__message").addClass("tcuh-highlighted");
                    });
                }
                else
                {
                    targets = ChatList.find(".chat-line__message[data-user='"+MutUser+"']"); //Live FFZ
                    if(targets.length > 0)
                    {
                        targets.each(function(e){
                            $(this).addClass("tcuh-highlighted");
                        });
                    }
                    else
                    {
                        targets = ChatList.find(".vod-message .chat-author__display-name[data-a-user='"+MutUser+"'], .vod-message [data-user='"+MutUser+"']"); //VODs vanilla & FFZ
                        if(targets.length > 0)
                        {
                            targets.each(function(e){
                                let target = $(this).closest(".vod-message").parent().addClass("tcuh-highlighted");
                            });
                        }
                    }
                }

                Observer.observe(ChatList[0], MutConf);

                if(HighlightStopTimer != 0)
                {
                    $(".chat-shell").off();
                    $(".chat-shell").mouseenter(function(){
                        clearTimeout(AutoHighlightStopTimeout);
                    });
                    $(".chat-shell").mouseleave(function(){
                        StartHighlightAutoStopTimer();
                    });
                }
            }
        }
    }

    function StartHighlightAutoStopTimer()
    {
        clearTimeout(AutoHighlightStopTimeout);
        AutoHighlightStopTimeout = setTimeout(StopHighlightingUsers, HighlightStopTimer * 1000);
    }

    function StopHighlightingUsers(alsoClearMutUser = true)
    {
        if(alsoClearMutUser)
            MutUser = null;
        $(".tcuh-highlighted").removeClass("tcuh-highlighted");
        Observer.disconnect();
    }

    function OnNewComment(mutationsList, observer)
    {
        for(let i = 0; i < mutationsList.length; i++)
        {
            if(mutationsList[i].type == 'childList' && mutationsList[i].addedNodes.length > 0)
            {
                for(let j = 0; j < mutationsList[i].addedNodes.length; j++)
                {
                    if($(mutationsList[i].addedNodes[j]).find(".chat-author__display-name[data-a-user='"+MutUser+"']").length > 0 || //Live vanilla
                       $(mutationsList[i].addedNodes[j]).find(".vod-message .chat-author__display-name[data-a-user='"+MutUser+"']").length > 0 || //VODs vanilla
                       $(mutationsList[i].addedNodes[j]).find(".vod-message [data-user='"+MutUser+"']").length > 0 || //VODs FFZ
                       $(mutationsList[i].addedNodes[j]).data("user") == MutUser) //Live FFZ
                    {
                        $(mutationsList[i].addedNodes[j]).addClass("tcuh-highlighted");
                    }
                }
            }
        }
    }

    function addGlobalStyle(css)
    {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

})();
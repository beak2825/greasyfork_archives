// ==UserScript==
// @name         block 'drop' in steam.tv
// @version      1.4.1
// @description  block noob!
// @author       xz
// @include      *://steam.tv/*
// @grant        none
// @namespace https://greasyfork.org/users/48754
// @downloadURL https://update.greasyfork.org/scripts/372035/block%20%27drop%27%20in%20steamtv.user.js
// @updateURL https://update.greasyfork.org/scripts/372035/block%20%27drop%27%20in%20steamtv.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //auto report spam user, maybe steam will ban u
    var AutoReport=false;

    var lastMessage={};

    if(typeof CBroadcastChat !== 'undefined'){
        console.log("script has loaded! AutoReport is "+(AutoReport?"on":"off"));
        CBroadcastChat.prototype.DisplayChatMessage = function( strPersonaName, bInGame, steamID, strMessage, bLocal )
        {
            var _chat = this;
            if(lastMessage[steamID]===strMessage||strMessage.search(/^!|drop$|box$|(\w)\1{4,}|^(\u02d0.*?\u02d0)\2{4,}|^\u02d0(\w)*\u02d0$|^.$|tradeoffer\/new/i)>-1){
                console.log("%s(%s)\t\t%s%s",steamID,strPersonaName,strMessage,lastMessage[steamID]===strMessage?"(Multiple identical messages)":"");
                if ( AutoReport && !this.m_mapMutedUsers[steamID])
                    //this.MuteUserForSession(steamID,strPersonaName);
                {
                    this.m_mapMutedUsers[steamID] = strPersonaName;
                    var rgParams =
                        {
                            chat_id: this.m_ulChatID,
                            user_steamid: steamID,
                            muted: 1
                        };
                    this.m_webapi.ExecJSONP( 'IBroadcastService', 'MuteBroadcastChatUser', rgParams, true, null, 15 )
                        .done( function()
                              {
                        return 0;
                    })
                        .fail( function()
                              {
                        if (bOwner)
                        {
                            console.log('Failed to mute %s. Please try again.'.replace( /%s/, strPersonaName ) );
                            delete _chat.m_mapMutedUsers[steamID];
                            return 0;
                        }
                    });
                    console.log("auto reported user: "+this.GetMutedUsers().length);
                    return 0;
                }else{
                    return 0;
                }
                //console.log(this.IsUserMutedLocally(steamID));
            }
            lastMessage[steamID]=strMessage;
            var elMessage = $J('#ChatMessageTemplate').clone();
            elMessage.attr( 'id', '' );
            elMessage.attr( 'data-steamid', steamID );

            var elChatName = $J( '.tmplChatName', elMessage );
            elChatName.text(strPersonaName);
            elChatName.attr( 'href', 'https://steamcommunity.com/profiles/' + steamID );
            elChatName.attr( 'data-miniprofile', 's' + steamID );

            if ( steamID == this.m_broadcastSteamID )
                elMessage.addClass( 'Broadcaster' );

            var elText = $J( '.tmplChatMessage', elMessage ).text(strMessage);

            var strHTML = elText.html();
            strHTML = this.AddEmoticons(strHTML, steamID, bLocal);
            strHTML = this.AddLinks(strHTML);

            elText.html(strHTML);

            elMessage.show();

            var bAutoScroll = this.BAutoScroll();
            $J('#ChatMessages').append(elMessage);

            // if text is too long, add expand button
            var elText = $J( '.tmplChatMessage', elMessage );
            if ( elText.height() > elMessage[0].clientHeight )
            {
                var elExpand = $J( '<div class="ChatExpand">+</div>' );
                elMessage.append(elExpand);
                elExpand.on('click', function () { _chat.ExpandMessage(elMessage) } );
            }

            if (bAutoScroll)
                this.ScrollToBottom();
        };
    }
})();
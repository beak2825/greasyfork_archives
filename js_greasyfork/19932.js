// ==UserScript==
// @name         Twitch Material Design
// @namespace    
// @version      0.1
// @description  Materialize Twitch
// @author       d3xtr0
// @match        *.twitch.tv/*
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/19932/Twitch%20Material%20Design.user.js
// @updateURL https://update.greasyfork.org/scripts/19932/Twitch%20Material%20Design.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var betterttv = true;

    $(function(){

var cssstyle = `
<style>

.app-main{
  top:50px !important;
}

.material-header{
  height:50px;
  width:100%;
  background:#6441a4;
}

#material_logo{
  height:30px;
  margin:10px;
  fill:#fff;
  display:inline-block;
}

.material-hamburger{
  //height:25px;
  fill:#fff;
  vertical-align: top;
  margin:10px;
  cursor:pointer;
}

#sidebar_search{
  position:absolute;
  display: inline-block;
  width: 400px;
  max-width:30%;
  vertical-align: top;
  left: 50%;
  margin-top: 7px;
  transform:translateX(-50%);
}

#sidebar_search input, #sidebar_search input:focus, #left_col .warp input{
  height:35px;
  background-color:rgba(255,255,255,0.15) !important;
  box-shadow:0 1px 1.5px rgba(0,0,0,.06),0 1px 1px rgba(0,0,0,.12);
}

.leaf-wrapper svg{
  left:10px;
}
.leaf-wrapper svg path{
  fill:rgba(255,255,255,0.8);
}

#left_close{
  display:none;
}

.material-avatar{
  position:absolute;
  right:10px;
  top:5px;
}

.material-avatar img{
  height:40px;
  width:40px;
  border-radius:50%;
}


.warp{
  height: calc(100vh - 50px);
  min-height: calc(100vh - 50px);
}

.chat-buttons-container .button, .profile-info .buttons .button, #channel_actions .button{
  box-shadow:0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12) !important;
  transition:all .25s;
  border:0 !important;
}
.chat-buttons-container .button:hover, .profile-info .buttons .button:hover, #channel_actions .button:hover{
  box-shadow:0 4px 9px 0 rgba(0,0,0,0.18),0 4px 13px 0 rgba(0,0,0,0.15) !important;
}

#chat_text_input, #chat_text_login, .ember-chat .chat-interface textarea{
  border:0 !important;
}

</style>`;

var header = `
<div class="material-header">

<svg data-ember-action="" class="material-hamburger" height="25px" id="Layer_1" style="enable-background:new 0 0 32 32;" version="1.1" viewBox="0 0 32 32" width="32px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z"/></svg>

  <a aria-label="Twitch" href="/" id="material_logo" title="Twitch">
  <svg aria-label="Twitch - Main Page" class="svg-logo_twitch" height="32px" role="img" version="1.1" viewBox="0 0 94 32" width="94px" x="0px" y="0px">
  <title>Twitch</title>
  <desc>Main Page</desc>
  <path clip-rule="evenodd" d="M88,5h-6V0h-9l-6,5h-5.5L59,7.5V5h-5V0H36v5H16l-5-5H0v22l5,5.25L14,32h6v-1.5l3,1.5h12l2-3l1,3h7v-3l3,3h8l0.5-3l2.5,3h10l3-3v3h4l3-3v3h7l7-6V10L88,5z M13,13H8v6h5v6H6l-4-4V2h6v5h5V13z M36,21.5L32.5,25H15V7h6v12h2V7h6v12h2V7h5V21.5z M44,25h-6V7h6V25z M44,5h-6V2h6V5z M57,13h-5v6h5v6h-7l-4-4V2h6v5h5V13z M72,13h-7v6h7v6h-9l-4-4V11l4-4h9V13z M91,25h-6V13h-5v12h-6V2h6v5h7l4,4V25z" fill-rule="evenodd"></path>
  </svg>
  </a>

  <div class="material-avatar"><a href="" data-ember-action="" data-tt_content="profile" original-title="Profile"></a></div>


</div>
`;

        $('body').append(header);

        var search = $('#sidebar_search').clone();
        $('#sidebar_search').remove();

        var avatar = $('.warp .warp__avatar > img').eq(0).clone();

        var profile_url = $('a.warp__tipsy[href$="/profile"]').attr("href");
        var profile_action = $('a.warp__tipsy[href$="/profile"]').attr("data-ember-action");


        $('.material-header').append(search);
        $('.material-header .material-avatar a').append(avatar);
        $('.material-header .material-avatar a').attr("href",profile_url);
        $('.material-header .material-avatar a').attr("data-href",profile_url);
        $('.material-header .material-avatar a').attr("data-ember-action",profile_action);


        var more_stuff = $('.warp__list.warp__list--sm.drawer__item').clone();
        $('.warp__list.warp__list--sm.drawer__item').remove();

        var user_links = $('.warp__anchor.warp__list .warp__drawer > ul').clone();
        $('.warp__anchor.warp__list .warp__drawer > ul').remove();

        $('.warp__anchor.warp__list .warp__drawer').append(more_stuff);
        $('.drawer .tse-content').append('<dt class="warp__item warp__item--header"><span>Channel</span></dt>');
        $('.drawer .tse-content').append(user_links);

        updateGames();


        $('.material-hamburger').attr('data-ember-action',$('#left_close').attr('data-ember-action'));

        $('.drawer .warp__item.drawer__item.drawer__item--brick').remove(); // remove logo


        $('body').append(cssstyle);

        /* BetterTTV */
        if(betterttv){
            $('.drawer .tse-content').append('<ul class="warp__list warp__list--md"><li class="warp__item"><a class="warp__tipsy bttvLink" data-tt_medium="twitch_leftnav" href="javascript:void(0);" original-title="BetterTTV Settings"><figure class="warp__avatar bttvSettingsIconDropDown"></figure><span class="drawer__item">BetterTTV Settings</span></a></li></ul>');
            $('body').on('click','.bttvLink',function(){
                $('#bttvSettingsPanel').toggle();
            });
        }

        /* Follow Games */

        $('body').on('click','.follow-button a.follow',function(){
            if (typeof gmGet("twgames") !== "undefined" && gmGet("twgames") !== "undefined" && gmGet("twgames") != "[]") {
                var games = JSON.parse(gmGet("twgames"));
            }else{
                var games = [];
            }
            var title = $('h2.title').clone().children().remove().end().text().trim();
            var id = games.indexOf(title);
            if (id == -1) {
                games.push(title);
            }else{
                games.splice(id, 1);
            }
            gmSet("twgames", JSON.stringify(games));
            updateGames();
        });

        function updateGames(){
            $('.material-games').remove();
            if (typeof gmGet("twgames") !== "undefined" && gmGet("twgames") !== "undefined" && gmGet("twgames") != "[]") {

                var games = JSON.parse(gmGet("twgames"));
                var gamestr = '<div class="material-games"><dt class="warp__item warp__item--header"><span>Games</span></dt><ul class="warp__list">';
                for (var i = 0; i < games.length; i++) {
                    gamestr += '<li class="warp__item"><a href="/directory/game/' + encodeURIComponent(games[i]) + '">' + games[i] + '</a></li>';
                }
                gamestr += '</ul></div>';
                $('.tse-content .warp__list').eq(0).after(gamestr);
            }

        }
        function gmGet(name) {
            var theValue = GM_getValue(name);
            return theValue;
        }

        function gmSet(name, value) {
            GM_setValue(name, value);
        }


    });

})();

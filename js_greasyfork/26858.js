// ==UserScript==
// @name         DotD Mutik Chatmover
// @namespace    http://idrinth.de/
// @version      1.2.2
// @description  moves the alliance chat provided by mutik's script(https://greasyfork.org/en/scripts/406-mutik-s-dotd-script) to a seperate window. Developement at https://github.com/Idrinth/DotD-Mutik-Chatmover
// @author       Idrinth
// @include      http://www.kongregate.com/games/5thplanetgames/dawn-of-the-dragons*
// @include      http://kongregate.com/games/5thplanetgames/dawn-of-the-dragons*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26858/DotD%20Mutik%20Chatmover.user.js
// @updateURL https://update.greasyfork.org/scripts/26858/DotD%20Mutik%20Chatmover.meta.js
// ==/UserScript==
window.setTimeout ( function () {
    var idrinth4mutik = window.setInterval ( function () {
        if ( document.getElementById ( 'alliance_room' ) ) {
            window.clearInterval ( idrinth4mutik );
            var createButton = function() {
              var r = document.createElement ( 'div' );
              r.id = "idrinth_alliance_chat_wrapper";
              r.appendChild ( document.createElement ( 'a' ) );
              r.lastChild.appendChild ( document.createTextNode ( 'Alliance' ) );
              r.lastChild.setAttribute ( 'href', '#' );
              r.addEventListener ( 'click', function () {
                  var el = document.getElementById ( 'alliance_room' );
                  var el2 = document.getElementById ( 'idrinth_alliance_chat_wrapper' );
                  var css = el2.getAttribute ( 'class' );
                  if ( css === null ) {
                      css = '';
                  }
                  if ( css.match ( /(^|\s)active(\s|$)/ ) ) {
                      el.setAttribute ( 'class', 'disabled' );
                      el2.setAttribute ( 'class', 'chat_room_tab' );
                  } else {
                      el2.setAttribute ( 'class', 'chat_room_tab active' );
                      el.setAttribute ( 'class', '' );
                  }
              } );
              r.setAttribute ( 'class', 'chat_room_tab active' );
              document.getElementById ( 'chat_room_tabs' ).appendChild ( r );
            };
            var handleRoom = function() {
              var room = document.getElementById ( 'alliance_room' );
              document.getElementsByTagName ( 'body' )[0].appendChild ( room );
              room.setAttribute ( 'draggable', 'true' );
              room.addEventListener ( 'mousedown', function (e) {
                  var target = document.getElementById ( 'alliance_room' );
                  target.mouseDown=true;
                  target.dotdmutikchatmover = {
                      x: target.getBoundingClientRect ().left - e.pageX,
                      y: target.getBoundingClientRect ().top - e.pageY
                  };
              } );
              var drag = function (e) {
                  if ( !e.pageX || !e.pageY ) {
                      return;
                  }
                  var target = document.getElementById ( 'alliance_room' );
                  target.wasDragged=true;
                  target.dotdmutikchatmover = target.dotdmutikchatmover ? target.dotdmutikchatmover : {
                      x: 0,
                      y: 0
                  };
                  target.setAttribute ( 'style', 'left:' + ( e.pageX + target.dotdmutikchatmover.x ) + 'px;top:' + ( e.pageY + target.dotdmutikchatmover.y ) + 'px' );
              };
              var mouseUp = function (e) {
                  document.getElementById ( 'alliance_room' ).mouseDown=false;
              };
              room.ondragstart=function(e){
                  e.dataTransfer.setData('text/plain', 'alliance_room');
              }
              document.getElementsByTagName('body')[0].addEventListener ( 'mouseup', mouseUp );
              room.addEventListener ( 'drag', drag );
              room.addEventListener ( 'dragend', drag );
              room.addEventListener ( 'drop', drag );
              room.addEventListener ( 'dragend', mouseUp );
              room.addEventListener ( 'drop', mouseUp );
              document.getElementsByTagName('body')[0].addEventListener ( 'mousemove', function (e) {
                  if ( !e.pageX || !e.pageY) {
                      return;
                  }
                  var target = document.getElementById ( 'alliance_room' );
                  if(!target.wasDragged&&target.mouseDown) {
                      target.dotdmutikchatmover = target.dotdmutikchatmover ? target.dotdmutikchatmover : {
                          x: 0,
                          y: 0
                      };
                      target.setAttribute ( 'style', 'left:' + ( e.pageX + target.dotdmutikchatmover.x ) + 'px;top:' + ( e.pageY + target.dotdmutikchatmover.y ) + 'px' );
                  }
              } );
              room.addEventListener ( 'click', function (e) {
                  if ( !e.target.getAttribute('class') || !(e.target.getAttribute('class')).match(/(^| )chatRaidLink($| )/) ) {
                      return true;
                  }
                  e.preventDefault();
                  e.stopPropagation();
                  var raid = (e.target.getAttribute('class')).split(' ')[1].split('|');
                  SRDotDX.request.joinRaid({
                    boss:raid[2],
                    id:raid[0],
                    hash:raid[1],
                    sid: raid[4]
                  });
                  return false;
              } );
              room.appendChild ( document.createElement ( 'span' ) );
              room.lastChild.innerHTML = '&#x2600;';
              room.lastChild.setAttribute ( 'title', 'Drag me!' );
            };
            var addStyles = function() {
              var styles = document.createElement ( 'style' );
              styles.appendChild ( document.createTextNode ( '#alliance_tab{display:none}'
                      + '#alliance_room{z-index: 10000000;width:300px;background:#aaa;height:80%;position:fixed;top:10%;}'
                      + '#alliance_room > span{cursor:move;-moz-user-select: none;-webkit-user-select: none;user-select: none;color:red;display:block;background-color:#fff;background-image:linear-gradient(to bottom,rgba(0,0,0,0.1),rgba(255,255,255,0.1),rgba(0,0,0,0.25)),linear-gradient(to right,rgba(0,0,0,0.1),rgba(255,255,255,0.1),rgba(0,0,0,0.25));width:1em;height:1em;padding:3px;position:absolute;border-radius:3px;top:0;margin-top:-0.25em;font-size:150%;right:0;margin-right:0.25em;}'
                      + '#alliance_room.disabled{display:none}'
                      + '#alliance_room > div{padding:1px;box-sizing:border-box}'
                      + '#alliance_users{height:20%;overflow-y:scroll;background:rgba(0,0,0,0.25);color:#ddd}'
                      + '#alliance_users > div{height:auto;width:100%;overflow:hidden}'
                      + '#alliance_users > div > span{max-width:40%;overflow:hidden;display:block;float:left;padding:2px;box-sizing:border-box;margin:1px}'
                      + '#alliance_users > div > span:nth-of-type(1){max-width:20%;border-radius:4px;background:darkRed;font-weight:bold}'
                      + '#alliance_chat_window{height:70% !important;overflow-y:scroll;overflow-x:hidden;color:#ddd}'
                      + '#alliance_chat_window img{max-width:95%}'
                      + '#alliance_chat_window embed{max-width:95%;height: auto !important;}'
                      + '#alliance_chat_window .username{font-weight:bold;color:red}'
                      + '#alliance_chat_window .whisper{font-style:italic;color:#fff}'
                      + '#alliance_chat_window .emote{color:orange}'
                      + '#alliance_chat_window .emote .separator{display:none}'
                      + '#alliance_chat_window .emote .username{display:none}'
                      + '#alliance_chat_window a{color:lightcoral}'
                      + '#alliance_chat_window > div > p{background:rgba(0,0,0,0.5);overflow:hidden}'
                      + '#alliance_chat_window > div > p.even{background:rgba(0,0,0,0.65);}'
                      + '#alliance_room > .chat_controls{height:10%}'
                      + '#alliance_room textarea{resize:none}'
                      + '#alliance_room > .chat_controls > textarea{background:rgba(0,0,0,0.65);color:#fff;height:100%;width:100%;box-sizing:border-box;display:block}' ) );
              document.getElementsByTagName ( 'head' )[0].appendChild ( styles );
            };
            createButton();
            handleRoom();
            addStyles();
        }
    }, 1000 );
}, 1000 );

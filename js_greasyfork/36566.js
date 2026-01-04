// ==UserScript==
// @name         Legacy Chat 2
// @namespace    https://www.twitch.tv/garych
// @version      0.0.1
// @include      *://*.twitch.tv/*
// @exclude      *://www.twitch.tv/*/chat*
// @exclude      *://twitch.tv/*/chat*
// @exclude      *://api.twitch.tv/*
// @exclude      *://*.destiny.gg/*
// @author       garych
// @grant        GM_addStyle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @description  Replaces New Chat
// @downloadURL https://update.greasyfork.org/scripts/36566/Legacy%20Chat%202.user.js
// @updateURL https://update.greasyfork.org/scripts/36566/Legacy%20Chat%202.meta.js
// ==/UserScript==


(function(factory, undefined) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        // CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Global jQuery
        factory(jQuery);
    }
}(function($, undefined) {

    function getHandle(selector, $el) {
        if (selector && selector.trim()[0] === ">") {
            selector = selector.trim().replace(/^>\s*/, "");

            return $el.find(selector);
        }

        return selector ? $(selector) : $el;
    }

    if ($.fn.resizable)
        return;

    $.fn.resizable = function fnResizable(options) {
        var opt = {
            // selector for handle that starts dragging
            handleSelector: null,
            // resize the width
            resizeWidth: true,
            // resize the height
            resizeHeight: true,
            // the side that the width resizing is relative to
            resizeWidthFrom: 'right',
            // the side that the height resizing is relative to
            resizeHeightFrom: 'bottom',
            // hook into start drag operation (event passed)
            onDragStart: null,
            // hook into stop drag operation (event passed)
            onDragEnd: null,
            // hook into each drag operation (event passed)
            onDrag: null,
            // disable touch-action on $handle
            // prevents browser level actions like forward back gestures
            touchActionNone: true
        };
        if (typeof options == "object") opt = $.extend(opt, options);

        return this.each(function() {
            var startPos, startTransition;

            var $el = $(this);

            var $handle = getHandle(opt.handleSelector, $el);

            if (opt.touchActionNone)
                $handle.css("touch-action", "none");

            $el.addClass("resizable");
            $handle.bind('mousedown.rsz touchstart.rsz', startDragging);

            function noop(e) {
                e.stopPropagation();
                e.preventDefault();
            };

            function startDragging(e) {
                // Prevent dragging a ghost image in HTML5 / Firefox and maybe others
                if (e.preventDefault) {
                    e.preventDefault();
                }
                document.body.style.pointerEvents = 'none';
                startPos = getMousePos(e);
                startPos.width = parseInt($el.width(), 10);
                startPos.height = parseInt($el.height(), 10);

                startTransition = $el.css("transition");
                $el.css("transition", "none");

                if (opt.onDragStart) {
                    if (opt.onDragStart(e, $el, opt) === false)
                        return;
                }
                opt.dragFunc = doDrag;

                $(document).bind('mousemove.rsz', opt.dragFunc);
                $(document).bind('mouseup.rsz', stopDragging);
                if (window.Touch || navigator.maxTouchPoints) {
                    $(document).bind('touchmove.rsz', opt.dragFunc);
                    $(document).bind('touchend.rsz', stopDragging);
                }
                $(document).bind('selectstart.rsz', noop); // disable selection
            }

            function doDrag(e) {
                var pos = getMousePos(e),
                    newWidth, newHeight;

                if (opt.resizeWidthFrom === 'left')
                    newWidth = startPos.width - pos.x + startPos.x;
                else
                    newWidth = startPos.width + pos.x - startPos.x;

                if (opt.resizeHeightFrom === 'top')
                    newHeight = startPos.height - pos.y + startPos.y;
                else
                    newHeight = startPos.height + pos.y - startPos.y;

                if (!opt.onDrag || opt.onDrag(e, $el, newWidth, newHeight, opt) !== false) {
                    if (opt.resizeHeight)
                        $el.height(newHeight);

                    if (opt.resizeWidth)
                        $el.width(newWidth);
                }
            }

            function stopDragging(e) {
                e.stopPropagation();
                e.preventDefault();
                document.body.style.pointerEvents = 'auto';
                $(document).unbind('mousemove.rsz', opt.dragFunc);
                $(document).unbind('mouseup.rsz', stopDragging);

                if (window.Touch || navigator.maxTouchPoints) {
                    $(document).unbind('touchmove.rsz', opt.dragFunc);
                    $(document).unbind('touchend.rsz', stopDragging);
                }
                $(document).unbind('selectstart.rsz', noop);

                // reset changed values
                $el.css("transition", startTransition);

                if (opt.onDragEnd)
                    opt.onDragEnd(e, $el, opt);

                return false;
            }

            function getMousePos(e) {
                var pos = { x: 0, y: 0, width: 0, height: 0 };
                if (typeof e.clientX === "number") {
                    pos.x = e.clientX;
                    pos.y = e.clientY;
                } else if (e.originalEvent.touches) {
                    pos.x = e.originalEvent.touches[0].clientX;
                    pos.y = e.originalEvent.touches[0].clientY;
                } else
                    return null;

                return pos;
            }
        });
    };
}));


function cleanName(str) {
    var strLength = str.length;
    for (var i = 0; i < strLength; i++) {
        if (!/^\w+$/.test(str[i])) {
            return str.slice(0, i);
        }
    }
    return str;
}


function switchChannel(channel, iframe) {
    if (event.key === 'Enter') {
        chat = $(iframe);
        if (channel === '') {
            if (iframe == '.chat-1') {
                chat[0].style.maxHeight = "0";
                chat.attr('src', "about:blank");
            } else {
                return;
            }
        } else {
            if ((iframe == '.chat-1') && ($(".resizable").length === 0)) {
                $(".chat-1").resizable({
                    handleSelector: ".splitter-horizontal",
                    resizeWidth: false
                });
            }
            if (channel !== 'destinygg') {
                chat.attr('src', ("https://www.twitch.tv/" + channel + "/chat"));
            } else {
                chat.attr('src', "https://destiny.gg/embed/chat");
            }
            if (chat[0].offsetHeight < (0.1 * $('#chats').height())) {
                $('.chat-1')[0].style.height = "calc(50% - 7px)";
                $('.chat-1')[0].style.maxHeight = "calc(100% - 14px)";
            }
        }
    }
}

$(document).keyup(function (e) {
    if ($("#input-1:focus") && (e.keyCode === 13)) {
       switchChannel($('#input-1')[0].value,'.chat-1');
    }
    if ($("#input-2:focus") && (e.keyCode === 13)){
        switchChannel($('#input-2')[0].value,'.chat-2');
    }
 });

GM_addStyle('#chat-holder {margin: 0; height: 100%}');

GM_addStyle('#chat-selection { margin-top: 0; padding: 0;}');

GM_addStyle('#input-1, #input-2 { border-style: solid; background-color: #252525; border-color: #3b3b3b; border-width: 1px; display: inline-block; margin-right: 0px; padding-left: 9px; width: 50%; color: #d3d3d3;}');

GM_addStyle('#chat-selection,#input-1,#input-2 {    height: 32px;}');

GM_addStyle('#chats, .chat-1, .chat-2 {    background-color: #252525;}');

GM_addStyle('.chat-1 {    transition: height 0.2s ease;}');

GM_addStyle('#chats {    height: calc(100% - 32px);    display: flex;    flex-direction: column;}');

GM_addStyle('.chat-1,.chat-2 {    border: none;    min-height: 0;    max-height: calc(100% - 14px);    width: 100%;}');

GM_addStyle('.chat-1 {    flex: 0 0 auto;    height: 0;}');

GM_addStyle('.splitter-horizontal {    flex: 0 0 auto;    height: 14px;    background: url(https://raw.githubusercontent.com/RickStrahl/jquery-resizable/master/assets/hsizegrip.png) center center no-repeat #191919;    cursor: row-resize;}');

GM_addStyle('.chat-2 {    margin-bottom: 0px;    flex: 1 1 auto;}');

function replaceChat() {
    var url = window.location.href;
    var chan = url.split("/");
    var chanName = cleanName(chan[3]);
    var chat1 = "'.chat-1'";
    var chat2 = "'.chat-2'";
    var embeddedChat = '<div id="chat-holder"><div id="chat-selection"> <input id="input-1" type="text" placeholder="Top" onkeydown="switchChannel(this,'+chat1+')"><input id="input-2" type="text" placeholder="Bottom" onkeydown="switchChannel(this,'+chat2+')"></div><div id="chats"><iframe class="chat-1" src="about:blank"></iframe><div class="splitter-horizontal"></div><iframe class="chat-2" src="https://www.twitch.tv/'+chanName+'/chat"></iframe></div></div>';
    $(".chat-room__container").html(embeddedChat);
}
var observer = new MutationObserver(function() {
    console.log("Mutation Detected");
    if (!$(".chat-room__container #chat-holder").length) {
        console.log("Replacing Chat");
        replaceChat();
    }
});

var config = {
    attributes: true,
    childList: true,
    characterData: true
};

observer.observe(document.body, config);

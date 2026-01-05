// ==UserScript==
// @name Chaturbate - Better Modding
// @namespace http://www.vpycha.com/gmscripts
// @description Provides a better modding interface for the cam girls site of chaturbate.com. This script makes modding faster and easier. Check out the details.
// @include http://chaturbate.com/*
// @include https://chaturbate.com/*
// @include http://*.chaturbate.com/*
// @include https://*.chaturbate.com/*
// @exclude http://serve.ads.chaturbate.com/*
// @exclude https://serve.ads.chaturbate.com/*
// @grant none
// @run-at document-start
// @license GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @version 2.12
// @downloadURL https://update.greasyfork.org/scripts/3819/Chaturbate%20-%20Better%20Modding.user.js
// @updateURL https://update.greasyfork.org/scripts/3819/Chaturbate%20-%20Better%20Modding.meta.js
// ==/UserScript==

// Author: Vladimir Pycha vpycha@gmail.com
// Website: vladpride.cz
// Nickname on chaturbate.com: vlad88x (banned permanently), vlad88z
// Nickname on greasyfork.org: vlad88
// First revision created and released on: July 2013

// The home page of this script is: https://greasyfork.org/scripts/3819-chaturbate-better-modding
// There is also a detailed description of this script there.

function doBetterModdingChanges() {
  'use strict';

  var messagesCountMax = 200;
  var maxMessagesCountColor = 'rgb(255, 0, 0)';

  var mostRecentMessagesCount = 4;

  var cookieExpirePeriod = 1 * 365;

  var pixelsToScrollOffChatBottom = 5;

  var expandChar = '+';
  var collapseChar = '-';

  var collapsedMessageHeight = '10px';
  var removedMessageBgColor = 'rgb(225, 225, 225)';

  var removedTitle = 'removed';
  var silencedTitlePrefix = 'silenced by ';
  var bannedTitle = 'kicked out';

  var bannedOutlineColor = 'rgb(40, 40, 40)';
  var bannedOutlineWidth = '2px';
  var bannedOutlineStyle = 'solid';

  var pendingSilenceOutlineColor = 'rgb(150, 150, 150)';
  var pendingSilenceOutlineWidth = '2px';
  var pendingSilenceOutlineStyle = 'solid';

  var pendingBanOutlineColor = 'rgb(40, 40, 40)';
  var pendingBanOutlineWidth = '2px';
  var pendingBanOutlineStyle = 'dashed';


  console.info("doing changes in chat room page");

  var output = document.createElement('div');
  output.setAttribute('id', 'ChaturbateBetterModding');
  output.setAttribute('style', 'padding: 0px 8px 10px 8px');
  output.innerHTML = 'ChaturbateBetterModding user script is active<br /><span title="In simulation mode you can excersize modding without having to be a mod"><label for="ChaturbateBetterModding_SimulationMode">Simulation mode: </label><input id="ChaturbateBetterModding_SimulationMode" type="checkbox" /></span>';
  document.body.appendChild(output);

  $.error = console.error;

  function strStartsWith(str, prefix) {
    return str.substring(0, prefix.length) === prefix;
  }

  function strEndsWith(str, suffix) {
    return str.substring(str.length - suffix.length) === suffix;
  }

  var oldConfirm = window.confirm;
  var silenceMsgTemplateLocalized = gettext('Silence %(username)s?');
  window.confirm = function(msg) {
    var parts = silenceMsgTemplateLocalized.split('%(username)s');
    if (strStartsWith(msg, parts[0]) && strEndsWith(msg, parts[1])) {
      var userToSilence = msg.substring(parts[0].length, msg.length - parts[1].length);
      var usernameValidationRegExp = /^\S+$/;
      if (userToSilence.replace(usernameValidationRegExp, '') === '') {
        return true;
      }
    }
    return oldConfirm(msg);
  }

  var theElement = document.body;

  var simulationModeCookieName = 'btmd_sim_mode';
  var deletedMessagesShouldBeExpandedCookieName = 'btmd_expand';

  var simulationMode = $.cookie(simulationModeCookieName) == '1';
  var deletedMessagesShouldBeExpanded = $.cookie(deletedMessagesShouldBeExpandedCookieName) == '1';

  setSimulationModeCookie();
  setDeletedMessagesShouldBeExpandedCookie();

  if (simulationMode) {
    console.warn("simulation mode is enabled");
  }

  function setSimulationModeCookie() {
    $.cookie(simulationModeCookieName, simulationMode ? '1' : '0', {
        expires: cookieExpirePeriod,
        path: '/'
    });
  }
  function setDeletedMessagesShouldBeExpandedCookie() {
    $.cookie(deletedMessagesShouldBeExpandedCookieName, deletedMessagesShouldBeExpanded ? '1' : '0', {
        expires: cookieExpirePeriod,
        path: '/'
    });
  }

  var simulationModeCheckbox = document.getElementById('ChaturbateBetterModding_SimulationMode');
  simulationModeCheckbox.checked = simulationMode;
  simulationModeCheckbox.onclick = function(evt) {
    simulationMode = this.checked;
    this.blur();
    document.body.focus();
    setSimulationModeCookie();

    if (simulationMode) {
      console.warn("enabled simulation mode");
    }
    else {
      console.info("disabled simulation mode");
    }
  }

  var domele = $(theElement.getElementsByClassName('chat-list')[0]);
  var chat = domele.get(0);

  var messagesCount = 0;
  var previousChatOuterWidth = 0;

  var broadcaster = window.broadcaster;

  var controlsContainer = document.createElement('div');
  controlsContainer.innerHTML = '<input type="button" id="ChaturbateBetterModding_ChatLength" value="' + messagesCount + '" title="Click to delete all messages except the\nlast page, or except the last ' + mostRecentMessagesCount + ' messages\nif clicked with Shift key down" /><br />' +
    '<input type="button" id="ChaturbateBetterModding_ToggleExpand" value="' + (deletedMessagesShouldBeExpanded ? collapseChar : expandChar) + '" title="Click to toggle the automatic expanding or collapsing of\ndeleted messages and to expand or collapse all of them\n(keyboard shortcut is <), or click it with Shift key down to\ndo it without the toggling (shortcut is >)" />';
  controlsContainer.style.textAlign = 'center';
  document.body.appendChild(controlsContainer);
  var chatLengthButton = document.getElementById('ChaturbateBetterModding_ChatLength');
  var toggleExpandButton = document.getElementById('ChaturbateBetterModding_ToggleExpand');
  chatLengthButton.style.paddingLeft = '1px';
  chatLengthButton.style.paddingRight = '1px';
  toggleExpandButton.style.paddingLeft = '1px';
  toggleExpandButton.style.paddingRight = '1px';
  var origValue = chatLengthButton.value;
  chatLengthButton.value = 266;
  var chatLengthButtonMinWidth = $(chatLengthButton).outerWidth(); // really outer width is correct here, I do not know why not inner width
  chatLengthButton.value = origValue;
  chatLengthButton.style.minWidth = chatLengthButtonMinWidth + 'px';
  toggleExpandButton.style.minWidth = chatLengthButtonMinWidth + 'px';
  setControlsContainerPosition();

  function setControlsContainerPosition() {
    var chatPosition = domele.offset();
    controlsContainer.style.position = 'absolute';
    var chatOuterWidth = domele.outerWidth();
    if (previousChatOuterWidth && previousChatOuterWidth - chatOuterWidth == 1) {
      // this is a work-aroud
      chatOuterWidth = previousChatOuterWidth;
    }
    else {
      previousChatOuterWidth = chatOuterWidth;
    }
    var left = chatPosition.left + chatOuterWidth + 10;
    var top = chatPosition.top;
    if (left + controlsContainer.clientWidth > document.body.scrollWidth) {
      left = chatPosition.left + chatOuterWidth - controlsContainer.clientWidth - 20;
      top -= 9;
    }
    controlsContainer.style.left = left + 'px';
    controlsContainer.style.top = top + 'px';
  }

  var updateChatLength = function() {
    chatLengthButton.value = messagesCount.toString();
    if (messagesCount >= messagesCountMax) {
      chatLengthButton.style.color = maxMessagesCountColor;
    }
    else {
      chatLengthButton.style.color = '';
    }
  }

  chatLengthButton.onclick = function(evt) {
    if (document.activeElement == chatLengthButton) {
      chatLengthButton.blur();
      document.body.focus();
    }

    var bigDelete = evt.shiftKey;

    var recentMessagesCount;
    if (bigDelete) {
      recentMessagesCount = mostRecentMessagesCount;
    }
    else {
      recentMessagesCount = 0;
      var totalHeight = 0;
      var element = chat.lastElementChild;
      do {
        if (!element) {
          break;
        }
        totalHeight += $(element).outerHeight(true);
        recentMessagesCount++;
        element = element.previousElementSibling;
      } while (totalHeight < chat.clientHeight + pixelsToScrollOffChatBottom);
    }

    while (messagesCount > recentMessagesCount) {
      chat.removeChild(chat.firstElementChild);
      messagesCount--;
    }

    chat.scrollTop = chat.scrollHeight;
    updateChatLength();
  }

  var messagesToCollapse = [];
  var removedMessagesOf = null;

  chat.addEventListener('scroll', onChatScroll, false);

  var removedNickAttr = 'data-removed-nick';
  // valid values of attribute: remove, silence, ban
  var removeTypeAttr = 'data-remove-type';
  var removedByAttr = 'data-removed-by';

  function is_at_bottom() {
    return chat.scrollTop >= chat.scrollHeight - chat.clientHeight;
  }

  function onChatScroll(evt) {
    if (messagesToCollapse.length > 0 && is_at_bottom()) {
      for (var i = messagesToCollapse.length - 1; i >= 0; i--) {
        var msgDiv = messagesToCollapse[i];
        messagesToCollapse[i] = null;
        if (!deletedMessagesShouldBeExpanded && msgDiv && msgDiv.parentNode) {
          if (!msgDiv.msgCollapsed) {
            collapseMessage(msgDiv);
          }
        }
        messagesToCollapse.length = i;
      }
    }
  }

  function getSilencedByTitle(silencer_nick) {
    return silencedTitlePrefix + silencer_nick;
  }

  var removeMessage = function(msgDiv) {
    msgDiv.style.background = '';
    msgDiv.style.backgroundColor = removedMessageBgColor;
    messagesToCollapse[messagesToCollapse.length] = msgDiv;

    var paragraph = msgDiv.firstElementChild;
    while (paragraph) {
      if (paragraph.style.backgroundColor) {
        paragraph.style.background = '';
      }
      paragraph = paragraph.nextElementSibling;
    }
  };

  var on_user_silenced = function (silenced_nick, silencer_nick, index) {
    if (index === undefined) {
      index = 0;
    }

    $(".chat-list > div.text > p > [data-nick='" + silenced_nick + "']").each(function (index, value) {
      var msgDiv = this.parentNode.parentNode;
      if (!msgDiv.hasAttribute(removeTypeAttr) || msgDiv.getAttribute(removeTypeAttr) == 'remove') {
        msgDiv.setAttribute(removedNickAttr, silenced_nick);
        msgDiv.setAttribute(removeTypeAttr, 'silence');
        msgDiv.setAttribute(removedByAttr, silencer_nick);
        msgDiv.setAttribute('title', getSilencedByTitle(silencer_nick));

        removeMessage(msgDiv);
      }

      onChatScroll(null);
    });
    var text = 'User ' + silenced_nick + ' was silenced by ' + silencer_nick;
    $.add_system_message(text, domele, index);
  };

  var on_user_banned = function (username) {
    $(".chat-list > div.text > p > [data-nick='" + username + "']").each(function (index, value) {
      var msgDiv = this.parentNode.parentNode;
      if (msgDiv.getAttribute(removeTypeAttr) != 'ban') {
        if (msgDiv.hasAttribute(removedByAttr)) {
          msgDiv.removeAttribute(removedByAttr);
        }

        msgDiv.setAttribute(removedNickAttr, username);
        msgDiv.setAttribute(removeTypeAttr, 'ban');
        msgDiv.setAttribute('title', bannedTitle);

        removeMessage(msgDiv);

        msgDiv.style.outlineColor = bannedOutlineColor;
        msgDiv.style.outlineWidth = bannedOutlineWidth;
        msgDiv.style.outlineStyle = bannedOutlineStyle;
      }

      onChatScroll(null);
    });
    var text = 'User ' + username + ' was kicked out of the room';
    $.add_system_message(text, domele);
  };

  var remove_messages = function (username) {
    removedMessagesOf = username;

    $(".chat-list > div.text > p > [data-nick='" + username + "']").each(function (index, value) {
      var msgDiv = this.parentNode.parentNode;
      if (!msgDiv.hasAttribute(removeTypeAttr)) {
        msgDiv.setAttribute(removedNickAttr, username);
        msgDiv.setAttribute(removeTypeAttr, 'remove');
        msgDiv.setAttribute('title', removedTitle);

        removeMessage(msgDiv);
      }

      onChatScroll(null);
    });
  };

  var old_add_message;
  var message_outbound = null;

  var handler;
  if (window.TSHandler) {
    handler = TSHandler;
  }
  else {
    console.info("using ws_handler instead of TSHandler");
    handler = ws_handler;
  }
  var defchat_message_receiver = null;
  var old_connect = handler.connect;
  handler.connect = function(message_receiver, room, settings, groups_and_privates) {
    defchat_message_receiver = message_receiver;
    old_connect(message_receiver, room, settings, groups_and_privates);
  };

  setTimeout(function() {
    if (defchat_settings.handler !== handler) {
      handler = defchat_settings.handler;
      console.error("bad guess of used handler:", handler);
    }

    message_outbound = handler.message_outbound;

    setControlsContainerPosition();

    var message_receiver = defchat_message_receiver;

    if (message_receiver === null) {
      console.error("not having message_receiver");
    }
    else {
      // these methods are no longer called
      //message_receiver.on_user_silenced = on_user_silenced;
      //message_receiver.on_user_banned = on_user_banned;

      // this method is called instead
      message_receiver.remove_messages = remove_messages;

      old_add_message = message_receiver.add_message;
      messagesCount = chat.children.length;
      message_receiver.add_message = add_message;
    }
  });

  function getTitle(msgDiv) {
    if (!msgDiv.hasAttribute(removeTypeAttr)) {
      return '';
    }

    switch (msgDiv.getAttribute(removeTypeAttr)) {
    case 'remove':
      return removedTitle;
    case 'silence':
      return getSilencedByTitle(msgDiv.getAttribute(removedByAttr));
    case 'ban':
      return bannedTitle;
    default:
      return '';
    }
  }

  function expandMessage(msgDiv) {
    msgDiv.style.height = '';

    for (var i = 0; i < msgDiv.children.length; i++) {
      var child = msgDiv.children[i];
      child.style.display = '';
    }

    msgDiv.setAttribute('title', getTitle(msgDiv));

    msgDiv.msgCollapsed = false;
  }

  function collapseMessage(msgDiv) {
    for (var i = msgDiv.children.length - 1; i >= 0; i--) {
      var child = msgDiv.children[i];
      child.style.display = 'none';
    }

    msgDiv.style.height = collapsedMessageHeight;

    var username = msgDiv.getAttribute(removedNickAttr);
    var title = getTitle(msgDiv);
    msgDiv.setAttribute('title', '' + username + ', ' + title);

    msgDiv.msgCollapsed = true;
  }

  function add_message(message, domeleParam, index) {
    if (!domeleParam) {
      domeleParam = domele;
    }
    if (domeleParam.get(0) != chat) {
      return old_add_message.call(this, message, domeleParam);
    }

    if (removedMessagesOf !== null) {
      var nick = removedMessagesOf;
      removedMessagesOf = null;

      if (typeof message == "string") {
        var silencer = getSilencer(message, nick);
        if (silencer) {
          on_user_silenced(nick, silencer);
          return;
        }

        if (isBanText(message, nick)) {
          on_user_banned(nick);
          return;
        }
      }
    }

    var originalScrollTop = chat.scrollTop;
    var at_bottom = is_at_bottom();
    var result;

    var oldFind = domeleParam.find;
    domeleParam.find = function(selector) {
      if (selector == 'div.text') {
        return [];
      }
      return oldFind.call(this, selector);
    };
    try {
      result = old_add_message.call(this, message, domeleParam, index);
    }
    finally {
      domeleParam.find = oldFind;
    }

    messagesCount++;

    var totalHeight = 0;
    while (messagesCount > messagesCountMax) {
      var element = chat.firstElementChild;
      if (!at_bottom) {
        var outerHeight = $(element).outerHeight(true);
        totalHeight += outerHeight;
      }
      chat.removeChild(element);
      messagesCount--;
    }
    if (at_bottom) {
        chat.scrollTop = chat.scrollHeight;
    }
    else {
      chat.scrollTop = originalScrollTop - totalHeight;
    }

    updateChatLength();

    return result;
  }

  function getSilencer(message, nick) {
    var slug = 'silencer';
    var text = interpolate(gettext("User %(username)s was silenced by %(silencer)s and his/her messages have been removed"), {
        username: nick,
        silencer: slug
    }, true);
    var parts = text.split(slug);
    var part1Index = message.indexOf(parts[0]);
    if (part1Index >= 0) {
      var part2Index = message.indexOf(parts[1], part1Index + parts[0].length);
      if (part2Index >= 0) {
        var silencer = message.substring(part1Index + parts[0].length, part2Index);
        if (silencer) {
          return silencer;
        }
      }
    }
    return null;
  }

  function isBanText(message, nick) {
    var text = gettext('User') + ' ' + nick + ' ' +
        gettext('was kicked out of the room and his/her messages have been removed');
    return message.indexOf(text) >= 0;
  }

  chat.addEventListener('dblclick', onChatClick, false);
  chat.addEventListener('click', onChatClick, false);

  function onChatClick(evt) {
    if (evt.button != 0 || evt.shiftKey || evt.altKey || evt.metaKey) {
      return;
    }

    var element = evt.target;
    while (element == chat || element.parentNode != chat) {
      if (element == chat || !element.parentNode) {
        return;
      }
      element = element.parentNode;
    }
    if (element.nodeName != 'DIV' || !element.classList.contains('text')) {
      return;
    }

    var msgDiv = element;

    var nick = null;
    if (msgDiv.hasAttribute(removedNickAttr)) {
      nick = msgDiv.getAttribute(removedNickAttr);
    }
    else {
      var paragraph = msgDiv.firstElementChild;
      if (paragraph && paragraph.nodeName == 'P') {
        var usernameElement = paragraph.firstElementChild;
        if (usernameElement && usernameElement.hasAttribute('data-nick')) {
          nick = usernameElement.getAttribute('data-nick');
        }
      }
    }
    if (!nick) {
      return;
    }

    var ban = evt.ctrlKey;

    if (evt.type == 'click') {
      // toggling expanded/collapsed state
      if (msgDiv.hasAttribute(removeTypeAttr) && !ban) {
        if (msgDiv.msgCollapsed) {
          expandMessage(msgDiv);
        }
        else {
          collapseMessage(msgDiv);
        }
      }
    }
    else
    if (evt.type == 'dblclick' && evt.detail == 2) {
      // modding
      if (!msgDiv.hasAttribute(removeTypeAttr) || ban && msgDiv.getAttribute(removeTypeAttr) != 'ban') {
        window.getSelection().removeAllRanges();
        evt.stopImmediatePropagation();
        evt.stopPropagation();
        evt.preventDefault();
        if (messagesCount >= messagesCountMax && chat.scrollTop <= 0) {
          alert('The chat box is scrolled to the top and there is also the maximum mumber of messages in it, which is ' + messagesCountMax + '. First, either scroll it a little bit down, or delete some of the messages by clicking on that floating button with the number of messages.');
          return;
        }
        if (is_at_bottom() && chat.scrollHeight > chat.clientHeight) {
          alert('The chat list is scrolled to the bottom. First, scroll it up by pressing SPACE.');
          return;
        }

        if (!simulationMode) {
          if (ban) {
            message_outbound.send_kickban_user(nick);
          }
          var url = '/' + (ban ? 'roomban' : 'roomsilence') + '/' + nick + '/' + broadcaster + '/';
          $.post(url, {
              'foo': 'bar'
          }, function(data, textStatus, jqXHR) {
            if (data == 'OK' && textStatus == 'success') {
            }
            else {
              if (ban) {
                alert('A ban request has failed.');
              }
              else {
                alert('A silence request has failed.');
              }
            }
          }).fail(function() {
              if (ban) {
                alert('A ban request has failed.');
              }
              else {
                alert('A silence request has failed.');
              }
          });
        }
        else {
          window.setTimeout(function() {
            /*
            if (ban) {
              on_user_banned(nick);
            }
            else {
              on_user_silenced(nick, 'nobody');
            }
            */

            remove_messages(nick);

            var text;
            if (ban) {
              text = gettext('User') + ' ' + nick + ' ' +
                  gettext('was kicked out of the room and his/her messages have been removed');
            }
            else {
              text = interpolate(gettext("User %(username)s was silenced by %(silencer)s and his/her messages have been removed"), {
                  username: nick,
                  silencer: 'nobody'
              }, true);
            }
            $.add_system_message(text, domele);

          }, 700);
        }

        msgDiv.style.outlineColor = ban ? pendingBanOutlineColor : pendingSilenceOutlineColor;
        msgDiv.style.outlineWidth = ban ? pendingBanOutlineWidth : pendingSilenceOutlineWidth;
        msgDiv.style.outlineStyle = ban ? pendingBanOutlineStyle : pendingSilenceOutlineStyle;
      }
    }
  }

  function toggleExpand(noStateChange) {
    var expand = !deletedMessagesShouldBeExpanded;

    if (!noStateChange) {
      toggleExpandButton.value = expand ? collapseChar : expandChar;
      deletedMessagesShouldBeExpanded = expand;
      setDeletedMessagesShouldBeExpandedCookie();
    }

    var at_bottom = is_at_bottom();

    var msgDiv = chat.firstElementChild;
    while (msgDiv) {
      if (msgDiv.hasAttribute(removeTypeAttr)) {
        if (expand) {
          if (msgDiv.msgCollapsed) {
            expandMessage(msgDiv);
          }
        }
        else {
          if (!msgDiv.msgCollapsed) {
            collapseMessage(msgDiv);
          }
        }
      }
      msgDiv = msgDiv.nextElementSibling;
    };

    if (at_bottom) {
      chat.scrollTop = chat.scrollHeight;
    }
  }

  theElement.addEventListener('keypress', function(evt) {
    var nodeName = evt.target.nodeName;
    if (nodeName != 'INPUT' && nodeName != 'TEXTAREA' && nodeName != 'BUTTON') {
      var character = String.fromCharCode(evt.charCode);
      if (character == ' ') {
        if (is_at_bottom()) {
          chat.scrollTop = chat.scrollHeight -
                      chat.clientHeight - pixelsToScrollOffChatBottom;
        }
        else {
          chat.scrollTop = chat.scrollHeight;
        }

        evt.stopImmediatePropagation();
        evt.stopPropagation();
        evt.preventDefault();
      }
      else
      if (character == '<' || character == '>') {
        var noStateChange = character == '>';
        toggleExpand(noStateChange);
      }
    }
  }, false);

  toggleExpandButton.onclick = function(evt) {
    var noStateChange = evt.shiftKey;
    toggleExpand(noStateChange);
    if (document.activeElement == toggleExpandButton) {
      toggleExpandButton.blur();
      document.body.focus();
    }
  }
}

console.info("ChaturbateBetterModding user script is running");

function contentEval(source) {
  'use strict';

  // Check for function input.
  if (typeof source == 'function') {
    // Execute this function with no arguments, by adding parentheses.
    // One set around the function, required for valid syntax, and a
    // second empty set calls the surrounded function.
    source = '(' + source + ')();'
  }

  // Create a script node holding this  source code.
  var script = document.createElement('script');
  script.setAttribute('type', 'application/javascript');
  script.textContent = source;

  // Insert the script node into the page, so it will run, and immediately
  // remove it to clean up.
  document.body.appendChild(script);
  document.body.removeChild(script);
}

function getBroadcaster() {
  'use strict';

  var pathArray = window.location.pathname.split('/');
  if (pathArray.length == 3 && pathArray[0] == '' && pathArray[1] != '' && pathArray[2] == '') {
    return pathArray[1];
  }
  else
  if (pathArray.length == 4 && pathArray[0] == '' && pathArray[1] == 'b' && pathArray[2] != '' && pathArray[3] == '') {
    return pathArray[2];
  }
  else {
    return;
  }
}

if (getBroadcaster()) {
  var func = function(event) {
    if (document.forms.chat_form) {
      if (window.$) {
        doBetterModdingChanges();
      }
      else {
        // we are running in sandbox
        console.info("injecting content script");
        contentEval(doBetterModdingChanges);
      }
    }
  };

  if (window.defchat_settings) {
    // This script was injected way too late.
    // Will not be able to get message_receiver.
    console.error("defchat already initialized");
    func();
  }
  else
  if (window.$) {
    // jQuery was loaded before this script. It sometimes happens in Chromium.
    // Need to use jQuery's handler of DOMContentLoaded event.
    console.warn("using jQuery's handler of DOMContentLoaded event");
    $(func);
  }
  else {
    // the normal case
    document.addEventListener('DOMContentLoaded', func);
  }
}

// vim: tabstop=2:shiftwidth=2:expandtab

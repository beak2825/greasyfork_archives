// ==UserScript==
// @name        Picarto.tv ignore
// @namespace   picarto.tv.ignore.stuff.dasprids.de
// @description Ignore users on Picarto.tv channel chats.
// @include     https://picarto.tv/*
// @version     3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12596/Picartotv%20ignore.user.js
// @updateURL https://update.greasyfork.org/scripts/12596/Picartotv%20ignore.meta.js
// ==/UserScript==

try {
  var blockedUsers = JSON.parse(window.localStorage.getItem('blockedUsers'));
} catch (e) {
  var blockedUsers = [];
}

// Handle ignores
var checkMessage = function($node, username, hide) {
  // Normal messages
  if ($node.hasClass('um-' + username.toLowerCase())) {
    hide ? $node.hide() : $node.show();
    return;
  }

  // Action messages
  if ($node.hasClass('messageli') && $node.find('img[title="' + username + '"]').length > 0) {
    hide ? $node.hide() : $node.show();
    return;
  }

  // Whisper messages
  if ($node.hasClass('whisperli') && $node.find('span[title="whisper ' + username + '"]').length > 0) {
    hide ? $node.hide() : $node.show();
    return;
  }
}

var hideIgnoredMessage = function(node) {
  var $node = window.jQuery(node);

  blockedUsers.forEach(function(username) {
    checkMessage($node, username, true);
  });
}

var observer = new MutationObserver(function(mutations) {
  for (var i = 0; i < mutations.length; ++i) {
    for (var j = 0; j < mutations[i].addedNodes.length; ++j) {
      hideIgnoredMessage(mutations[i].addedNodes[j]);
    }
  }
});

var targetNode = document.getElementById('msgs');

if (targetNode) {
  observer.observe(targetNode, {
    childList: true
  });
  
  window.jQuery('#msgs > li').each(function() {
    hideIgnoredMessage(this);
  });
}

// Handle toolbox
var handleToolbox = function(node) {
  var $node = window.jQuery(node);
  
  if ($node.attr('id') !== 'toolsDiv') {
    return;
  }
  
  var username = $node.find('#toolsUsername').text();
  var blocked  = window.jQuery.inArray(username, blockedUsers) > -1;
  
  var button = window.jQuery('<button id="toolsIgnore" class="toolButtons"/>');
  button.text(blocked ? 'Unblock' : 'Block');
  $node.append(button);

  button.on('click', function() {
    if (blocked) {
      blockedUsers.splice(window.jQuery.inArray(username, blockedUsers), 1);
      button.text('Block');
    } else {
      blockedUsers.push(username);
      button.text('Unblock');
    }
    
    blocked = !blocked;
    
    window.jQuery('#msgs > li').each(function() {
      checkMessage($(this), username, blocked);
    });
    
    window.localStorage.setItem('blockedUsers', JSON.stringify(blockedUsers));
  });
}

var observer = new MutationObserver(function(mutations) {
  for (var i = 0; i < mutations.length; ++i) {
    for (var j = 0; j < mutations[i].addedNodes.length; ++j) {
      handleToolbox(mutations[i].addedNodes[j]);
    }
  }
});

var targetNode = document.getElementById('channel_chat');

if (targetNode) {
  observer.observe(targetNode, {
    childList: true
  });
}

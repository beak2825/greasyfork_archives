// ==UserScript==
// @name        FetLife Full Date
// @namespace   https://fetlife.com/users/3846707
// @description Show full date and time on some FetLife pages instead of relative "ago" time.
// @include     https://fetlife.com/conversations/*
// @include     https://fetlife.com/groups/*/group_posts/*
// @include     https://fetlife.com/users/*/posts/*
// @include     https://fetlife.com/users/*/pictures/*
// @include     https://fetlife.com/users/*/videos/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27924/FetLife%20Full%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/27924/FetLife%20Full%20Date.meta.js
// ==/UserScript==
$(document).ready(function() {
  $('time').each(function() { 
    $(this)
      .removeClass('refresh-timestamp')
      .text( $(this).attr('title') );
  });
});

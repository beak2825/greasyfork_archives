// ==UserScript==
// @name        MyDramaListCompletedHighlight
// @description Simple highlights of movies and shows you already finished.
// @namespace   mdl
// @include     http://mydramalist.com/browse/*
// @include     http://mydramalist.com/shows/top*
// @include     http://mydramalist.com/movies/top*
// @version     1.02
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/28475/MyDramaListCompletedHighlight.user.js
// @updateURL https://update.greasyfork.org/scripts/28475/MyDramaListCompletedHighlight.meta.js
// ==/UserScript==
$(window).ready(function ()
{
  
  var color = 'yellow'; //Chose Color for the background.
  
  
  
  
  var username = $('body').find('.username').text();
  var onList = null;
  $.ajax({
    url: 'http://mydramalist.com/dramalist/' + username,
    type: 'GET',
    success: function (data) {
      itemlists(data,color);
    }
  });
  function itemlists(data,color)
  {
    $('.btnManageList').each(function ()
    {
      var btn = $(this);
      var titleId = $(this).data('id');
      onList = $(data).find('table#list_2').find('.btnManageList[data-id=' + titleId + ']').data('id');
      if (onList == titleId)
      {
       
        btn.parents().eq(2).css('background-color', color);
      }
    });
  }
});

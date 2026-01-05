// ==UserScript==
// (C) Paul Potseluev, Stepan Kiryushkin
// @name        TJ
// @namespace   TJ
// @include     https://tjournal.ru/*
// @version     3
// @grant       none
// @description thread navigation helper for TJ club
// @description:ru Расширение упращяет навигацию в обсуждениях в клубе TJ
TJComments = {
  d: $(document),
  b: $('html, body'),

  init: function() {
    this.createAnchors();

    $('.b-comment__up').click(function(e) {
      e.preventDefault();

      var $this     = $(this),
          $previous = $this.prev(),
          parent_item = $(this).parents(".b-comment__head"),
          parent_id = $(parent_item).find('.b-comment__datetime ').attr('data-parent-id');
          $parent   = $('#commentBox' + parent_id),
          $children = $this.parents('.b-comment');

      TJComments.scrollTo($parent);
      var ifHasChildId = $($parent).find('.b-comment__down').attr('data-children-id');
      if (ifHasChildId === undefined) {
        TJComments.createBack($parent, $children);
      }
    });

    TJComments.d.on('click', '.b-comment__down', function(e) {
      e.preventDefault();

      var $this       = $(this),
          children_id = $this.data('children-id'),
          $children   = $('#commentBox' + children_id);

      $this.remove();
      TJComments.scrollTo($children);
    });
   
  },

  scrollTo: function($element) {
    TJComments.b.animate({ scrollTop: $element.offset().top }, 500)
    $element.effect("highlight", { color: 'rgba(217,239,55,0.1)' }, 1500);
  },
   
  createAnchors: function() {
    var html =  '<a href="#" class="b-comment__up">' +
        '&nbsp;&nbsp;<i class="icon-up-open-big" style="color: #999999"></i></a>';
    $('.b-comment__datetime.highlightParent').append(html);
  },

  createBack: function($parent, $children) {
    var html =  '<a href="#" class="b-comment__down" data-children-id="' + $children.data('id') + '">' +
        '&nbsp;&nbsp;<i class="icon-down-open-big" style="color: #999999"></i></a>';

    
    $parent.find('.b-comment__datetime').append(html);
  }
}

TJComments.d.ready(function() {
  TJComments.init();
  
});

function illuminate($parentId) {
  var html = '<div class="b-illuminate" style="margin-top:-4px;color:#ffb833;font-size:7px;">' +
             '<i class="icon-circle"></i></div>'
  $parentId = '#commentBox' + $parentId;
  $($parentId).find('.icon-star').append(html);
  $parentId = $($parentId).find('.b-comment__datetime ').attr('data-parent-id');
  if ($parentId != 0) {
    illuminate($parentId);
  }
}

function hide() {
  $('div.b-illuminate').remove();
}

function makeSignature () {
  var $parentId;
  var $parentIdValue;
  var $name;
  var html;
  var  $commentsSecondLvl = $('.b-comment__up').parents(".b-comment__wrapper");
  $($commentsSecondLvl).each( function () {
    $parentIdValue = $(this).find('.b-comment__datetime ').attr('data-parent-id');
    $parentId = '#commentBox' + $parentIdValue;
    $name = $($parentId).find('.b-comment__user').find("span").get(0);
    $name = $($name).html();
    html = '<a data-commentid="' + $parentIdValue + '" style="margin-left:-12px;padding-right:2px;color:#999;text-decoration:none" href="#comment'+ $parentIdValue + '"><i class="icon-reply-1" style="color: #999999"></i> ' + $name + '  </a>';
    $(this).find('.b-comment__datetime').prepend(html);
  });
}

function correctSource() {

  $('.b-comment__source a .icon-apple').offset(function(i,val){
	  return {top:val.top-1, left:val.left};
	});
  $('.b-comment__source a .icon-android').offset(function(i,val){
	  return {top:val.top-2, left:val.left};
	});
}

$(document).ready( function(){  
  makeSignature();
  correctSource();
  $('.b-comment__wrapper').mouseover( function(e) {
  var $parentId;
  var id;
  if(!($('div').is(".b-illuminate"))) {
    $parentId = $(this).find('.icon-star').attr('data-objectid');
    illuminate($parentId);
  }
  });
  
  $('.b-comment__wrapper').mouseleave( function(e) {
      hide();
  });
  
  $('a[href^="#comment"]').click( function(e){
    e.preventDefault();
    scrollId = $(this).attr('href');
    var sidLength = scrollId.length;
    var tPlace = scrollId.indexOf('t');
    scrollId = scrollId.substring(tPlace + 1, sidLength);
    var $scroll_el = $('#commentBox'+scrollId);
    TJComments.scrollTo($scroll_el);
    $('html, body').animate({ scrollTop: $element.offset().top }, 500);
  });
});


// @downloadURL https://update.greasyfork.org/scripts/11315/TJ.user.js
// @updateURL https://update.greasyfork.org/scripts/11315/TJ.meta.js
// ==/UserScript==
// (C) Paul Potseluev, Stepan Kiryushkin
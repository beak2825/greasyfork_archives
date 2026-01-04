// ==UserScript==
// @name        Unclutter VB5
// @namespace   RattleSN4K3/EpicGames
// @description Cleans up forum, mainly by removing additional space and merging elements
// @include     *//www.epicgames.com/unrealtournament/forums
// @include     *//www.epicgames.com/unrealtournament/forums/*
// @require     https://code.jquery.com/jquery-1.11.0.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/1.7.2/moment.min.js
// @version     1
// @author      RattleSN4K3
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/30319/Unclutter%20VB5.user.js
// @updateURL https://update.greasyfork.org/scripts/30319/Unclutter%20VB5.meta.js
// ==/UserScript==

var IsProcessed = false;
var IsStickyHidden = false;

// add events for DOM and page loaded
document.addEventListener ("DOMContentLoaded", DOM_ContentReady);
window.addEventListener ("load", pageFullyLoaded);

function DOM_ContentReady () {
  mainProc();

  // check for mutations due to last/first-page links updated via Javascript
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      UpdatePaginationLinks(mutation.target);
    });    

    // Stop observing if needed:
    //this.disconnect();
  });
  $('.pagenav-container .js-pagenav-last-button, .pagenav-container .js-pagenav-first-button').each(function() {
    observer.observe(this, {childList: true, subtree: true, attributes: true, attributeFilter: ['href']});
  });
}

function pageFullyLoaded () {
  momentProc();
  
  window.setTimeout(checkAjaxInNewWindow, 500);

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      dynamicProc(mutation.target, true);
      momentProc(mutation.target);
    });

    // Stop observing if needed:
    //this.disconnect();
  });
  
  $('#topic-tab').each(function() {
    observer.observe(this, {childList: true});
  });
  $('#thread-view-tab').each(function() {
    observer.observe(this, {childList: true, subtree: true});
  });
  
  // observer for dialog
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(addnode) {
        if ($(addnode).hasClass('ui-dialog-content') == true) {
          momentProc(addnode);
        }
      });
    });

    // Stop observing if needed:
    //this.disconnect();
  });

  // start observing body for dynamically added dialogs
  $('body').each(function() {
    observer.observe(this, {childList: true});
  });
}

function checkAjaxInNewWindow() {
  var hasajaxcommand = false;
  var urlparms = window.location.search.substr(1).split("&");
  $.each(urlparms, function(index, item) {
    if (item.startsWith("quote-") == true) {
      hasajaxcommand = true;
      var selector = '#'+item; //+' .b-post-control__label';
      $(selector).trigger('click');
    }
    else if (item.startsWith("edit-") == true) {
      hasajaxcommand = true;
      var selector = '#'+item;
      $(selector).trigger('click');
      document.getElementById(selector).scrollIntoView();
    }
    
    if (index == urlparms.length - 1) {
      if (hasajaxcommand == true) {
        history.replaceState( {} , '', GetThreadURL() );
      }
    }
  });
}

// hide logo and sub-forums manually with pure-Javascript and CSS before pages loads
(document.head || document.documentElement).insertAdjacentHTML('beforeend',
    `<style>
        #header { display: none!important; }
        .subforum-list { display: none!important; }
        div.votes-count { display: none!important; }

		.b-module.default-widget.page-title-widget { min-height: 0px; margin-bottom: 0px; }
		.b-module.default-widget.page-title-widget .widget-header .module-title { display: none!important; }

		.button-cloak { color: inherit!important; }

		.scrolltofixed-floating .floating-control { display: none!important; }
		.scrolltofixed-floating.scrolltofixed-top.scrolltofixed .floating-control { display: inline-block!important; }
		.scrolltofixed-floating.scrolltofixed-top .floating-control-sticky { display: inline-block!important; }

		.videocontainer .restrain { width: 640px!important; }
		.videocontainer .restrain { margin-right: 10px!important; }

    </style>`);

  
function dynamicProc(root, ajaxloaded) {
  ajaxloaded = ajaxloaded || false;
  
  if (root === null) {
    root = $(document);
  }

  if (ajaxloaded) {
    if (!IsStickyHidden) {
      IsStickyHidden = true;
      $('head').prepend('<style id="stickyhidden">.sticky-list { display: none!important; }');
    }

    // hide sticky topics and add notice to re-show them
    if (!$('.sticky-show').length && $('.sticky-list', root).length) {
      var showdiv = $('<div class="conversation-status-message notice stick"><span></span></div>');
      showdiv.addClass('sticky-show');
      var showlink = $('<a href="#" />');
      showlink.text('Sticky topics hidden (Click to show)');
      showlink.click(function(event) {
        event.preventDefault();
        IsStickyHidden = false;
        $('#stickyhidden').remove();
        $('.sticky-show').remove();
      });
      $('span', showdiv).html(showlink);
      $('.conversation-toolbar-wrapper').append(showdiv);
    }
  }

  // sub-forum list into main forum entry
  $('.subforum-list', root).each(function(index_sub, subforum){
    var mainforum = $(subforum).prev('tr');
    var subforumul = $('<ul style="margin-top: 10px;" />');
    $('tr td div', subforum).each(function(index_itm, subitm){
      $(subitm).css('width', '-moz-fit-content');
      subforumul.append($('<li style="display: inline; float: left; margin-left: 10px;" />').append(subitm));
    });
    $('.forum-info', mainforum).append(subforumul);
    $(subforum).remove();
  });
  
  $('li.b-post-control.js-post-control__edit', root).each(function(index_edit, editli) {
    // prevent adding additional controls link twice
    if ($(editli).data('unclutter') == true) return;
    $(editli).data('unclutter', true);

    // add link to edit 'buttons'
    var edita = $('<a class="editlink" nohref style="color: inherit!important;" href="'+GetThreadURL()+'?'+editli.id+'" onclick="return false;" />');
    $(editli).wrapInner(edita);
  });
  
  $('li.b-post-control__quote', root).each(function(index_quote, quoteli) {
    // prevent adding additional controls link twice
    if ($(quoteli).data('unclutter') == true) return;
    $(quoteli).data('unclutter', true);
    
    // adding multi-quote link
    var multiquoteli = $(quoteli).clone();
    $(multiquoteli).off();
    $('span', $(multiquoteli)).off();
    $(multiquoteli).removeClass('js-post-control__quote');
    $(multiquoteli).removeClass('b-post-control__quote');
    
    multiquoteli.attr('id', "multi" + multiquoteli.attr('id'));
    $('.b-post-control__label', multiquoteli).html("Multi Quote");
    $(multiquoteli).click(function() {
      var editordivs = [];
      $('.js-editor').each(function(index, elem) {
        var editordiv = $(elem).parents('.b-content-entry');
        editordivs.push(editordiv);

        editordiv.removeClass('b-content-entry');
        editordiv.removeClass('js-content-entry');
      });

      $(quoteli).trigger('click');
      
      $.each(editordivs, function( index, div ) {
        $(div).addClass('b-content-entry');
        $(div).addClass('js-content-entry');
      });
    });
    
    $(quoteli).after(multiquoteli);
    
    
    // add link to quote 'buttons'
    var quotea = $('<a class="quotelink" nohref style="color: inherit!important;" href="'+GetThreadURL()+'?'+quoteli.id+'" onclick="return false;" />');
    $(quoteli).wrapInner(quotea);
  });

  // thread likes remove and add to previous element
  $('.votes-count', root).each((i, elem) => {
    $(elem).prev('div').attr('title', $(elem).text());
    elem.remove();
  });
}

function mainProc()
{
  if (typeof jQuery == 'undefined') {
    return;
  }

  // mutex
  if (IsProcessed) return;
  IsProcessed = true;

  console.log("Unclutter VB5 loaded...");

  var topbar = $('#channel-tabbar');
  if (topbar === undefined || topbar === null || !topbar.length) {
    console.error("Unclutter VB5: no top bar");
    return;
  }

  var subbar = $('#channel-subtabbar');
  if (subbar === undefined || subbar === null || !subbar.length) {
    console.error("Unclutter VB5: No sub bar");
    return;
  }
  
  var mainbar = $('#main-navbar');
  var bread = $('#breadcrumbs');

  // Move main-bar search into channel bar
  $('#header > .toolbar > ul > li.search-container').css('margin', '0px');
  $('#header > .toolbar > ul').detach().appendTo(topbar);


  $('ul.secondary-nav', mainbar).addClass('channel-subtabbar-list');
  $('ul.secondary-nav', mainbar).addClass('js-channel-subtabbar-list');
  $('ul.secondary-nav', mainbar).detach().appendTo(subbar);


  // add profile link
  $('.notifications-container').before('<li class="welcomelink">Welcome, <a href="'+window.profileUrl+'">'+window.userName+'</a></li>');

  // add profile options
  $('.notifications-container').after('<li class="logoutlink"><a href="'+window.logoutUrl+'" onclick="return log_out(\'Are you sure you want to log out?\')">Log Out</a></li>');
  $('.notifications-container').after('<li><a href="'+window.settingUrl+'">Settings</a></li>');
  //$('#notifications').before('<li><a href="'+window.PROFILEURL+'">My Profile</a></li>');

  // add register/login for guests
  if (window.pageData === undefined || window.pageData.userid === undefined || window.pageData.userid == '0') {
    var nouserlist = $('<ul></ul>')
    .addClass('nouser')
    .addClass('h-right')
    .addClass('channel-subtabbar-list')
    .addClass('js-channel-subtabbar-list');

    if (window.signInLinks !== undefined && window.signInLinks.length > 0) {
      var registerurl = window.signInLinks[0].href;
      nouserlist.append('<li><a href="'+registerurl+'" rel="nofollow" class="notreg">Register</a></li>');
      nouserlist.append('<li>or</li>');
    }
    nouserlist.append('<li><a href="'+window.loginUrl+'" rel="nofollow" class="notreg">Sign in</a></li>');
    nouserlist.appendTo(subbar);
  }

  dynamicProc();

  // move post options ("see more", "goto post") into post controls bar
  $('li.b-post').each(function(index_post, post) {
    var postlinks = $('.post-links', post);
    var postli = $('<li class="h-margin-top-m" />');
        //$('ul.h-left', post)
    //postlinks.detach().appendTo($('<li class="h-margin-top-m" />').append($('ul.h-left', post))) ;
    postlinks.detach().appendTo(postli);
    $('ul.h-left', post).append(postli);

    //postlinks.detach().appendTo(.remove();
  });


  var threadbar = $('#thread-view-tab .conversation-toolbar');
  if (threadbar !== null && threadbar.length) {

    // check or create toolset
    var toolset = null;
    var toolsetcheck = $('ul.toolset-left', threadbar);
    if (toolsetcheck.length) {
      toolset = toolsetcheck.first();
    } else if ($('ul.toolset-right', threadbar).length) {
      var toolsetleft = $('ul.toolset-right', threadbar).clone().empty();
      toolsetleft.removeClass('toolset-right');
      toolsetleft.addClass('toolset-left');
      toolsetleft.appendTo(threadbar);
      toolset = toolsetleft;
    } else {
      console.info("Unclutter VB5: What to do with toolset?");
    }

    if (toolset !== null) {

      // move subscribe button in thread toolset section
      $('.conversation-controls button').each(function(){
        var libutton = $('<li></li>').append($(this));
        toolset.append(libutton);
      });


      // add thread into thread bar
      var threadli = $('<li></li>');
      //threadli.addClass('ui-widget-header');
      var threaddiv = GetTitleDiv();// $('div.module-title').last();
      threaddiv.removeClass('module-title');
      var threada = $('<a href="'+GetThreadURL()+'"/>');
      threada.css('color', 'inherit');
      threada[0].style.setProperty('background-color', 'inherit', 'important');
      $('h1', threaddiv).wrapInner(threada);
      threadli.append(threaddiv);

      toolset.append(threadli);
      /*var threadli = $('<li></li>')
      var threadtitle = $('.module-title h1.main-title').last().text();
      //var threadlink = $('<a />')
      //threadlink.text(threadtitle);
      //threadlink.attr('href', GetThreadURL());
      //threadlink.addClass('linkcontainer');
      var threadlink = $('<a href="'+GetThreadURL()+'"/>');
      threadlink.text(threadtitle);
      threadlink.css('color', 'inherit');
      threadlink.css('background-color', 'inherit !important');
      $('.module-title h1.main-title').last().wrapInner(threadlink);

      threadli.append(threadlink);
      toolset.append(threadli);
      $('.module-title h1.main-title').last().remove();
      */

      // add 'goto to top/bottom'
      var gotobuttons = CreateGotoButtons();
      $('.toolset-right', threadbar).prepend(gotobuttons);
    }
  }

  var topicbar = $('#topic-tab .conversation-toolbar');
  if (topicbar !== null && topicbar.length) {

    // move subscribe button in topic toolset section
    $('.channel-controls button').each(function(){
      var libutton = $('<li></li>').append($(this));
      $('ul', topicbar).first().append(libutton);
    });

    // move rss icon into breadcrumbs
    var rssa = $('div.module-title a');
    //$('<li class="vb-icon separator"></li>').appendTo(bread);
    //$('<li class="crumb ellipsis"></li>').append(bread);
    $('<li class="separator" />').appendTo(bread);
    rssa.appendTo(bread);


    // move title into topic bar
    var topiccontrols = $('ul', topicbar).first();
    if (topiccontrols.length) {
      var titleli = $('<li></li>');
      //titleli.addClass('ui-widget-header');
      var titlediv = $('div.module-title').last();
      titlediv.removeClass('module-title');
      var titlea = $('<a href="'+GetTopicURL()+'"/>');
      titlea.css('color', 'inherit');
      titlea[0].style.setProperty('background-color', 'inherit', 'important');
      $('h1', titlediv).wrapInner(titlea);
      titleli.append(titlediv);

      topiccontrols.append(titleli);
    } else {
      // remove remaining title
      $('div.module-title').last().remove();
    }
    
    // add 'goto to top/bottom'
    var gotobuttons = CreateGotoButtons();
    $('.toolset-right', topicbar).prepend(gotobuttons);
  }

  // move page title into breadcrumbs if not in thread/topic view
  var pagetitle = GetTitleDiv();
  if (pagetitle !== null && pagetitle.length) {
    pagetitle = pagetitle.first();

    if (!bread.is(':empty')) {
      $('<li class="vb-icon separator"></li>').appendTo(bread);
      $('<li class="crumb ellipsis"></li>').append($('h1', pagetitle).html()).appendTo(bread);

      pagetitle.remove();
    } else {
      $('.widget-content .b-button.b-button--secondary').after($('h1', pagetitle));
      pagetitle.remove();
    }
  }
  

  // adding last/first page to page controls
  $('.pagenav-controls form').each(function(index_pagenav, pagenavform) {
    var arrows = $('.horizontal-arrows', $(pagenavform));

    var firstpagea = $('a[rel="prev"]', arrows).clone();
    firstpagea.removeClass('arrow'); // prevent javascript code being added
    firstpagea.addClass('pagebound');
    firstpagea.addClass('unclutter-first-page');
    firstpagea.attr('title', 'First Page');
    firstpagea.attr('href', GetFirstPageURL(1));
    firstpagea.attr('data-page', '1');
    $('.vb-icon-arrow-left', firstpagea).clone().appendTo(firstpagea);

    var lastpagea = $('a[rel="next"]', arrows).clone();
    lastpagea.removeClass('arrow'); // prevent javascript code being added
    lastpagea.addClass('pagebound');
    lastpagea.addClass('unclutter-last-page');
    lastpagea.attr('title', 'Last Page');
    var lastpagenum = $('.pagetotal', $(pagenavform)).text();
    lastpagea.attr('href', GetLastPageURL(lastpagenum));
    lastpagea.attr('data-page', lastpagenum);
    $('.vb-icon-arrow-right', lastpagea).clone().appendTo(lastpagea);

    //setTimeout(function(){
    //firstpagea.addClass('arrow');
    //lastpagea.addClass('arrow');
    //firstpagea.off('click');
    //firstpagea.unbind('click');
    //}, 50);

    firstpagea.add(lastpagea).click(function(event) {
      var form = this.form || $(this).closest("form").get(0);

      // abort href handling for ajax buttons
      var element = $('.js-pagenum', form);
      var events = $(element).data('events');
      if (events && events['click'] != undefined) {
        event.preventDefault();
      }

      $(this).addClass('arrow');

      // easiest solution by manipulating page num box and trigger keypress
      var num22 = $(this).attr('data-page');
      $('.js-pagenum', form).val(num22);

      var e = jQuery.Event('keypress');
      e.which = 13; // # Some key code value
      e.keyCode  = 13;
      $('.js-pagenum', form).trigger(e);

      $(this).removeClass('arrow');

      setTimeout(function(){
        var currentpage = $('.js-pagenum', $(pagenavform)).val();
        var lastpage = $('.pagetotal', $(pagenavform)).text();
        $('.pagebound', pagenavform).each(function(){
          var reltag = $(this).attr('rel');
          if (reltag == 'next') {
            if (currentpage == lastpage && $(this).hasClass('h-disabled') == false)
              $(this).addClass('h-disabled');
            else if (currentpage != lastpage && $(this).hasClass('h-disabled') == true)
              $(this).removeClass('h-disabled');

          } else if (reltag == 'prev') {
            if (currentpage == 1 && $(this).hasClass('h-disabled') == false)
              $(this).addClass('h-disabled');
            else if (currentpage != 1 && $(this).hasClass('h-disabled') == true)
              $(this).removeClass('h-disabled');
          }

        });
      }, 50);
    });

    arrows.prepend(firstpagea);
    arrows.prepend(lastpagea);
  });

  // increase editor height
  /* TODO: NOT WORKING
  $('.cke_inner .cke_contents').each(function(index, editor) {
    console.log("editor too small");
    if ($(editor).height() < 100) {
      $(editor).css('height', $(editor).height() + 'px');
    }
  });
  */


  // remove margin from thread bar
  $('.widget-content').css('margin-top', '0px');

  // remove header
  $('#header').remove();

  // fixing line wrapping of links in sub-bar
  $('li > a', subbar).css('display', 'inline');

  // fixing widget offset
  $('.b-module.canvas-widget').css('min-height', '0px');
  //$('.b-module.canvas-widget').css('margin-bottom', '0px');
  $('.b-module.canvas-widget').each(function(index, widget){
    if (!$(widget).is(':visible') || $(widget).is(':hidden')) {
      $(widget).css('margin-bottom', '0px');
    } else {
      $(widget).css('margin-bottom', 'auto');
    }
  });
}

function momentProc(root) {

  if (root === null) {
    root = $(document);
  }

  $('time', root)
  .add('div.post-date:not(:has("*"))', root)
  .add('span.post-date:not(:has("*"))', root)
  .add('span.date:not(:has("*"))', root)
  .add('span.time:not(:has("*"))', root)
  .each(function(i, elem) {
    var d = moment($(elem).html(), 'MM/DD/YYYY, hh:mm a Z', true);
    if (d.isValid && $(elem).html().indexOf(',') >= 0) { // trying to prevent converting multiple times
      var originaltext = $(elem).html();
      originaltext += " (" + d.utc().fromNow() + ")";
      $(elem).attr('title', originaltext);
      $(elem).html(d.local().format("YYYY-MM-DD HH:mm"));
    }
  });

  $('.profile-info-item:contains("Last Activity")', root).each(function(i, elem) {
    var d = moment($(elem).html(), '[Last Activity:] MM/DD/YYYY, hh:mm a Z');
    $(elem).html(d.local().format("[Last Activity:] YYYY-MM-DD HH:mm"));
  });

  $('.profile-info-item:contains("Joined")', root).each(function(i, elem) {
    var d = moment($(elem).html(), '[Joined:] MM/DD/YYYY Z');
    $(elem).html(d.local().format("[Joined:] YYYY-MM-DD"));
  });
}

function UpdatePaginationLinks(root) {
  var parent = $(document);
  if (root !== null) {
    parent = root.parent;
  }

  var newlink = $(root).attr('href');
  if ($(root).hasClass('js-pagenav-last-button') == true) {
    $('a.unclutter-last-page', parent).attr('href', newlink);
  }
  
  if ($(root).hasClass('js-pagenav-first-button') == true) {
    $('a.unclutter-first-page', parent).attr('href', newlink);
  }
}

function GetTitleDiv() {
  var returndiv = null;
  $('.b-module.page-title-widget').each(function(index, div) {
    if (!$(div).hasClass('announcement-widget')) {
      if (returndiv === null) returndiv = $('.module-title', $(div));
    }
  });

  return returndiv;
}

function GetTopicURL() {
  var formref = $('.pagenav-controls > form');
  return formref && formref.first().attr('action');
}

function GetThreadURL() {
  var formref = $('.pagenav-controls > form');
  return formref && formref.first().attr('action');
}

function CreateGotoButtons() {
  var gotoli = $('<li />')
  var gotobuttons = $('<div class="h-clearfix js-button" />')
  .append('<a class="floating-control-sticky button-cloak" href="' + location.href + '#footer"><div class="label h-left">Bottom</div><div class="arrow vb-icon-wrapper h-left"><span class="vb-icon vb-icon-triangle-down-wide"></span></div></a>')
  .append('<a class="floating-control button-cloak h-margin-left-m" href="' + location.href + '#topic-module-top"><div class="label h-left">Top</div><div class="arrow vb-icon-wrapper h-left"><span class="vb-icon vb-icon-triangle-up-wide"></span></div></a>')
  gotoli.append(gotobuttons);
  return gotoli;
}

function GetFirstPageURL(pagenum) {
  if (pagenum === null) pagenum = 1;
  
  var pagelink = $('.pagenav-container a.js-pagenav-first-button').each(function(){
    var pagelink = $(this);
    if (pagelink.length && pagelink.attr('href') && pagelink.attr('href') != window.pageData.baseurl) {
      return pagelink.attr('href');
    }
  });
    
  return vBulletin.makePaginatedUrl(location.href, pagenum);
}

function GetLastPageURL(pagenum) {
  if (pagenum === null) pagenum = 99;
  
  var pagelink = $('.pagenav-container a.js-pagenav-last-button').each(function(){
    var pagelink = $(this);
    if (pagelink.length && pagelink.attr('href') && pagelink.attr('href') != window.pageData.baseurl) {
      return pagelink.attr('href');
    }
  });
                                                                       
  return vBulletin.makePaginatedUrl(location.href, pagenum);
}

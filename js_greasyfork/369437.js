// ==UserScript==
// @name         Reddit UHD
// @namespace    http://qashto.com/
// @version      1.3.4
// @description  Reddit for UHD displays
// @author       qashto
// @match        *://*.reddit.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/369437/Reddit%20UHD.user.js
// @updateURL https://update.greasyfork.org/scripts/369437/Reddit%20UHD.meta.js
// ==/UserScript==

$(function() {
  const log = console.log;
  let opt = {
    v: true
  };

  let curPageUrl = window.location.href;
  let commentsPage = curPageUrl.includes('/comments');
  let submitPage = curPageUrl.includes('/submit');
  let prefsPage = curPageUrl.includes('/prefs');
  let msgPage = curPageUrl.includes('/message');
  let usrPage = curPageUrl.includes('/user');
  let resPage = curPageUrl.includes('/#res:settings');
  let homePage = ((curPageUrl == 'https://www.reddit.com/') ||
    (curPageUrl == 'https://old.reddit.com/'));
  let redditPage = !(commentsPage || submitPage || prefsPage ||
    msgPage || usrPage || resPage);

  let observers = [];
  let mutationConfig = {
    attributes: false,
    childList: true
  };

  if (!Array.prototype.last) {
    Array.prototype.last = function() {
      return this[this.length - 1];
    };
  };

  $.fn.swapWith = function(that) {
    var $this = this;
    var $that = $(that);

    // create temporary placeholder
    var $temp = $("<div>");

    // 3-step swap
    $this.before($temp);
    $that.before($this);
    $temp.after($that).remove();

    return $this;
  }

  $.fn.hide = function() {
    this.attr('style', 'display:none!important;');
  }

  $.fn.vanish = function() {
    this.attr('style', `
			display:none!important;
			margin:0!important;
			padding:0!important;
			border:none!important;
		`);
  }

  function makeRequest(method, url) {
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.onload = function() {
        if (this.status >= 200 && this.status < 300) {
          resolve(xhr.responseText);
        } else {
          reject({
            status: this.status,
            statusText: xhr.statusText
          });
        }
      };
      xhr.onerror = function() {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      };
      xhr.send();
    });
  }

  async function getContent($thing) {
    let url = $thing.attr('data-url');
    if (!url) {
      return null;
    }
    let content = '';
    if (!url || url.slice(0, 1) == '/') {
      return null;
    }
    let parsedURL;
    try {
      parsedURL = new URL(url);
    } catch (err) {
      log(err);
      return null;
    }
    if (url.includes('gfycat.com')) {
      content = '<video controls="" name="media" loop=""><source src="';
      content += url.replace('gfycat', 'giant.gfycat');
      content += '.webm" type="video/webm" loop=""></video>';
      return `<div class="full-res-content col-12">
				<center>${content}</center>
				</div>`;
    }
    if (!parsedURL.pathname.includes('.') ||
      parsedURL.pathname.split('.').pop() == 'html') {

      if (url.includes('v.redd.it')) {
        return null;
      }
      if (url.slice(0, 5) != 'https') {
        url = 'https' + url.slice(4);
      }
      try {
        if (url.includes('flickr')) {
          url = 'https://www.flickr.com/' +
            url.match(/photos\/[^\/]+\/[^\/]+/) + '/sizes/o/';
        }
        let xhr = '<div>' + await makeRequest("GET", url) + '</div>';
        let $xml = $($.parseHTML(xhr));
        let special;
        if (url.includes('flickr')) {
          special = $xml.find('#allsizes-photo').children().eq(0).attr('src');
        }
        if (!special) {
          url = $xml.find('meta[property="og:image"]').attr('content');
        } else {
          url = special;
        }
        if (opt.v) {
          log('RUHD log og:image: ' + url);
        }
      } catch (err) {
        log('error: ' + url);
        log(err);
        return '';
      }
      if (!url || url.slice(0, 1) == '/') {
        return null;
      }
      parsedURL = new URL(url);
      if (!parsedURL.pathname.includes('.')) {
        return null;
      }
    }
    url = parsedURL.origin + parsedURL.pathname.match(/[^.]*[^\/]*/)[0];
    if (url.slice(0, 5) != 'https') {
      url = 'https' + url.slice(4);
    }
    let ext = parsedURL.pathname.split('.').pop();
    let type = 'content';
    switch (ext) {
      case 'com':
      case 'html':
        return null;
      case 'gifv':
        content = `<img src="${url.slice(0, -1)}"
					style="max-width:100%; max-height:var(--qaru-full-height)"`;
        break;
      default:
        type = 'img';
        content = `<img src="${url}"
					style="max-width:var(--qaru-full-width); max-height:var(--qaru-full-height)"`;
    }
    content += ` onerror="this.style='display:none'">`;
    return `<div class="full-res-${type} col-12">
			<center>${content}</center></div>`;
  }

  function iconTagger(icon, size, extraClass) {
    return `<i class="material-icons md-light ${size} ${extraClass}">
			${icon}</i>`;
  }

  async function editThing($thing, isPrimary) {
    $thing.addClass('qaru row' +
      ((redditPage || (commentsPage && isPrimary) || msgPage || usrPage) ?
        ' justify-content-center' : ''));
    let content;
    // data-whitelist-status="promo_adult_nsfw" use this prop to filter nsfw
    if (((redditPage && !$thing.hasClass('spoiler') &&
        !$thing.hasClass('promoted')) || commentsPage) && !opt.l) {
      try {
        content = await getContent($thing);
        if (content) {
          $thing.prepend(content);
          $thing.find('.thumbnail-div').remove();
        }
      } catch (err) {
        log(err);
      }
    }
    if (usrPage) {
      $thing.find('.parent').eq(0).wrap(`
<div class="row justify-content-center">
	<div class="parent-div col-10 col-md-8 col-lg-6">
	</div>
</div>
`);
    }
    $thing.find('.rank').hide();

    let entryClass;
    if (commentsPage && !isPrimary) {
      entryClass = 'col-12';
    } else if (content || msgPage || (commentsPage && isPrimary)) {
      entryClass = 'col-11 col-md-10 col-lg-8 col-xl-6';
    } else {
      entryClass = 'col-10 col-md-9 col-lg-7 col-xl-5';
    }
    $thing.find('.entry').addClass(entryClass);

    $thing.find('.top-matter').addClass('row');
    let $topMatter = $thing.find('.top-matter');
    $topMatter.find('.title').eq(0).wrapAll(
      '<div class="title-div col-12 px-0 pb-0"></div>');
    $topMatter.find('.tagline').eq(0).wrapAll(
      '<div class="tagline-div col-auto m-0 mr-auto"></div>');
    if (commentsPage && isPrimary &&
      $topMatter.find('.flat-list').length == 0) {
      $topMatter.append($thing.find('.flat-list').eq(0).detach());
    }
    $topMatter.find('.flat-list').eq(0).wrapAll(
      '<div class="list-div col-auto"></div>');
    $thing.find('.child').addClass('col-12');
    $thing.find('.clearleft').addClass('col-12');
    $thing.find('.expando-button').hide();

    $thing.find('.arrow').addClass('material-icons mx-auto my-0');

    let $interact = $thing.find('.flat-list');
    let iconSize = ((redditPage || (commentsPage && isPrimary)) ? ' ' : 'md-8');

    if (!usrPage && !(commentsPage && isPrimary)) {
      let $bylinks = $interact.find('.bylink').slice(1);
      $bylinks.parent().hide();
    } else {
      $interact.find('.first').hide();
    }

    let $crosspost = $interact.find('.crosspost-button').children();
    $crosspost.text('');
    $crosspost.prepend(iconTagger('call_split', iconSize, 'turn-r'));

    let modalName = $crosspost.attr('data-crosspost-fullname') + '_qaru-modal';
    let $comment = $interact.find('.first').eq(0);
    //		$comment.children().text('');
    if (redditPage) {
      $('#siteTable_organic').attr('style', '');
      $('.usertext').vanish();
    }
    $('span.domain').hide();

    $interact.find('.res-toggleAllChildren').parent().hide();

    let $share = $interact.find('.share').eq(0).hide();

    $interact.find('.hide-button').parent().addClass('hidepost-button');
    let $hide = $interact.find('.hide-button').find('span').children();
    $hide.text('');
    $hide.prepend(iconTagger('highlight_off', iconSize));

    let $ptitle = $thing.find('p.title').eq(0);
    $ptitle.append($ptitle.find('.linkflairlabel').detach());

    let $report = $interact.find('.report-button').children();
    $report.text('');
    $report.prepend(iconTagger('error_outline', iconSize));

    if (redditPage) {
      $comment = $comment.children();
      $comment.prop('target', '_blank');
      $interact.before(`
<p class="comments-num">
${$comment.text()
	.replace('comments', '')
	.replace('1 comment', '1')
	.replace('comment', '0')}
</p>`);
      $comment.text('');
      $comment.append(iconTagger('comment', iconSize));
      $interact.find('.give-gold-button').vanish();
    }
    if (redditPage || (commentsPage && isPrimary)) {
      $thing.find('.midcol, div.Post__scoreWrap').addClass(
        'vote col-1 mx-0 my-auto');

      let $save = $interact.find('.save-button').children();
      $save.text('');
      $save.prepend(iconTagger('bookmark_border', iconSize));

      let $source = $interact.find('.viewSource').eq(0).children();
      $source.attr('data-text', '');
      $source.prepend(iconTagger('code', iconSize));

      $interact.find('.redditSingleClick').prepend(iconTagger('layers', iconSize));

      $thing.find('.expando').hide();
      $thing.find('a.title').attr('target', '_blank');
    }
    if ((commentsPage && !isPrimary) || msgPage || usrPage) {
      $comment.hide();

      $interact.find('.viewSource, .saveComments').hide();

      $interact.find('.toggleChildren, .embed-comment').parent().hide();

      let $save = $interact.find('.save-button').children();
      $save.text('');
      $save.prepend(iconTagger('bookmark_border', iconSize));

      let $reply = $interact.find('.reply-button').children();
      $reply.text('');
      $reply.prepend(iconTagger('reply', iconSize));

      let $gold = $interact.find('.give-gold-button').children();
      $gold.text('');
      $gold.prepend(iconTagger('star_border', iconSize));

      let $del = $interact.find('.togglebutton');
      $del.text('');
      $del.eq(0).prepend(iconTagger('do_not_disturb_on', iconSize));
      $del.eq(1).prepend(iconTagger('delete', iconSize));

      let $edit = $interact.find('.edit-usertext');
      $edit.text('');
      $edit.prepend(iconTagger('mode_edit', iconSize));

      $thing.find('.sitetable').addClass('col-12 m-0');
      $thing.find('.flat-list').addClass('m-0');
      for (let j = 0; j < 3; j++) {
        let $score = $thing.find('.score').eq(j);
        $score.text($score.text().split(' ')[0]);
        $score.addClass('md-8 comment-score-text mx-0 my-auto');
        $thing.find('.arrow').eq(0).after($score.detach());
      }
      $thing.find('.arrow').addClass('md-8 comment-vote-arrow mx-0 my-auto');
      $thing.find('.midcol, div.Post__scoreWrap').addClass('comment-vote');
      $thing.find('.flat-list').addClass('comment-button-list');
      $thing.find('p.tagline').eq(0).after($thing.find('.midcol, div.Post__scoreWrap').eq(0));
      $thing.find('.midcol, div.Post__scoreWrap').eq(0).after($thing.find('.flat-list').eq(0));
      $thing.find('div.usertext-body').addClass('col-12');
    }
    if (msgPage) {
      $thing.find('p.subject').eq(0).addClass('mx-auto my-auto');
      $thing.find('p.subject').eq(0).wrapAll(`
<div class="row justify-content-center">
	<div class="subject-div col-12 col-md-11 col-lg-9 col-xl-7">
	</div>
</div>
`);

      let $markUnread = $interact.find('.unread').find('a').eq(0);
      $markUnread.text('');
      $markUnread.prepend(iconTagger('visibility_off', iconSize));

      let $reply = $interact.children().last().children();
      $reply.text('');
      $reply.prepend(iconTagger('reply', iconSize));

      $interact.append($interact.next().detach());
      let $showParent = $interact.children().last().children();
      $showParent.text('');
      $showParent.prepend(iconTagger('short_text', iconSize, 'flip-x flip-y'));

    }
    if (msgPage || usrPage) {
      let $context = $interact.find('.bylink')
        .filter(function(i) {
          return ($(this).text() == 'context');
        });
      $context.text('');
      $context.prepend(iconTagger('clear_all', iconSize, 'flip-x'));
    }
  }

  async function mutationCallback(mutationsList) {
    for (let mutation of mutationsList) {
      if (mutation.type == 'childList') {
        let newNodes = mutation.addedNodes;
        if (newNodes) {
          let $nodes = $(newNodes);
          for (let i = 0; i < $nodes.length; i++) {
            let $node = $nodes.eq(i);
            if ($node.hasClass('thing') || $node.hasClass('sitetable')) {
              if (opt.v) {
                log('added ' + (($node.hasClass('thing')) ? 'thing' : 'sitetable'));
              }
              if ($node.hasClass('sitetable')) {
                $node.addClass('col-12 m-0');
              }
              let $things = $node.find('.thing');
              for (let j = (($node.hasClass('thing')) ? -1 : 0); j < $things.length; j++) {
                try {
                  await editThing(((j < 0) ? $node : $things.eq(j)));
                } catch (err) {
                  log(err);
                }
              }
            }
          }
        }
      }
    }
  }

  function commentPageContentShown() {
    $('#qaru-comments-page-show-content').hide();
  }

  async function editPage() {
    $('head').append(`
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css" integrity="sha384-PsH8R72JQ3SOdhVi3uxftmaW6Vc51MKb0q5P2rRUpPvrszuE4W1povHYgTpBfshb" crossorigin="anonymous">
    `);
    if (typeof GM_addStyle === 'undefined') {
      $('head').append(`
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js" integrity="sha384-vFJXuSJphROIrBnz7yo7oB41mKfc8JzQZiCq4NCceLEaO4IHwicKwpJf9c9IpFgh" crossorigin="anonymous"></script>
      `);
    } else {
      $('head').append(`
<link href="https://cdn.rawgit.com/quinton-ashley/reddit-uhd/master/css/qashto_reddit-uhd.css" rel="stylesheet">
      `);
    }
    $('.listing-chooser').hide();
    $('.infobar').hide();
    $('iframe').remove();
    $('body').addClass('container-fluid');
    $('input[type=text]').addClass('form-control');
    $('input[type=url]').addClass('form-control');
    $('textarea').addClass('form-control');

    if (redditPage || msgPage || usrPage) {
      $('#header').addClass('row');
      $('#sr-header-area').addClass('col-8 pl-0');
      $('#header-bottom-left').addClass('col-8 col-lg-10 px-1');
      $('#header-bottom-left').children().eq(0).remove();
      $('form#search').children().eq(0).addClass(
        'form-control-sm reddit-search mx-0 my-2 px-1 py-0');
      $('form#search').children().eq(1).remove();
      $('ul.sr-bar').eq(1).remove();
      $('#header-bottom-left').eq(0).after($('form#search').detach());
      $('form#search').eq(0).wrap('<div class="col-4 col-lg-2 px-1 my-auto"></div>');
      $('#sr-header-area').after($('#header-bottom-right').detach());
      $('#header-bottom-right').addClass('col-4 px-1 py-0 text-right');
      $('span.separator, span.BlueBar__accountDivider').remove();

      // usr page for new reddit
      $('div.App, div.ProfileTemplate').addClass('row');
      $('div.App__body, div.SubscriptionBar, div.BlueBar, div.ProfileTemplate__body').addClass('col-12');
      $('div.ProfileTemplate__content').addClass('col-9');
      $('div.ProfileTemplate__sidebar').addClass('col-3');

      let barIcons = ['home', 'people', 'public', 'shuffle', 'face'];
      let $bar = $('ul.sr-bar').children();
      if ($bar.eq(4).children().eq(0).text()[0] != 'u') {
        $bar.eq(4).remove();
        $bar = $('ul.sr-bar').children();
      }
      for (let i = 0; i < barIcons.length; i++) {
        $bar.eq(i).children().eq(0).text('');
        $bar.eq(i).children().eq(0).prepend(iconTagger(barIcons[i], 'md-8', 'px-1'));
      }
      $('.selected.title').text('').prepend(iconTagger('menu', 'md-8', 'px-1'));

      if (redditPage || usrPage) {
        $('.menuarea').hide();
      } else if (msgPage) {
        $('.menuarea').children().eq(0).children().eq(0).children().eq(0).remove();
        $('.tabmenu').append($('.menuarea').children().eq(0).children().eq(0).children().detach());
        $('.menuarea').hide();
      }
      let $tabs = $('ul.tabmenu').children();
      if (homePage) {
        $tabs.eq(0).remove();
      }
      if (redditPage) {
        $tabs.parent().prepend(`
<li><a href="submit"></a></li>`);
        $tabs = $('ul.tabmenu').children();
        for (let i = 0; i < $tabs.length; i++) {
          let href = $tabs.eq(i).children().eq(0).attr('href');
          if (href == 'https://www.reddit.com/' ||
            href == 'https://old.reddit.com/') {
            $tabs.eq(i).remove();
          }
        }
        $tabs = $('ul.tabmenu').children();

        $('.nextprev').parent().wrapAll(`<center></center>`);
      }
      let icons;
      if (redditPage) {
        icons = ['edit', 'whatshot', 'fiber_new', 'trending_up',
          'announcement', 'vertical_align_top', 'account_balance', 'language'
        ];
      } else if (msgPage) {
        icons = ['mode_edit', 'inbox', 'send', 'visibility', 'markunread_mailbox',
          'forum', 'art_track', 'contact_mail'
        ];
        $tabs.find('a[href$="/messages/"]').parent().remove();
        $tabs = $('ul.tabmenu').children();
      } else if (usrPage) {
        icons = ['account_box', 'forum', 'art_track', 'account_balance'];
      }
      for (let i = 0; i < icons.length; i++) {
        $tabs.eq(i).children().eq(0).text('');
        $tabs.eq(i).children().eq(0).prepend(iconTagger(icons[i]));
      }

      let $prof = $('#header-bottom-right');
      $prof.find('span.user').attr('style', 'vertical-align:text-top;');
      $prof.find('.beta-hint').remove();
      let $mail = $prof.find('#mail');
      $mail.text('');
      $mail.prepend(iconTagger('mail_outline', 'md-8'));
      if ($('.message-count').length) {
        $mail.addClass('pl-1 pr-0');
      } else {
        $mail.addClass('px-1');
      }
      let $chat = $prof.find('#chat');
      $chat.text('');
      $chat.prepend(iconTagger('chat_bubble_outline', 'md-8'));
      $chat.addClass('px-1');
      let $settings = $prof.find('a.pref-lang');
      $settings.text('');
      $settings.prepend(iconTagger('settings', 'md-8'));
      $settings.addClass('px-1');
      let $logout = $prof.find('form.logout').children().last();
      $logout.text('');
      $logout.prepend(iconTagger('exit_to_app', 'md-8'));
      $logout.addClass('px-1');
      //			$('.spacer').replaceWith($('.spacer').last());
      $('.trending-subreddits').parent().remove();
      $('.spacer').addClass('row');
    } else if (commentsPage || submitPage || prefsPage) {
      $('#header').remove();
      $('div.footer-parent').remove();
      $('.side').eq(0).remove();
    }
    if (commentsPage) {
      $('.tabmenu').remove();
      $('.commentarea').addClass('col-xl-6 col-lg-8 col-md-10 col-sm-12');
      $('.nestedlisting').eq(0).addClass('p-3');
      $('#siteTable').wrap('<div class="row justify-content-center">');
      $('.commentarea').wrap('<div class="row justify-content-center">');
      $('.panestack-title').addClass('row justify-content-center');
      $('.menuarea').addClass('mx-0 my-auto pl-3');
      $('.panestack-title').append($('.menuarea').detach());
      $('.panestack-title').children().wrapAll(`
<div class="col-10"><div class="row justify-content-center"></div></div>`);
      $('.panestack-title').append(`
<div class="col-1 ml-auto mr-0 my-auto">
<a id="qaru-close-comments-page" onclick="window.close();">
	${iconTagger('close')}
</a>
</div>`);
      $('.panestack-title').prepend(`
<div class="col-1 ml-auto mr-0 my-auto">
<a id="qaru-comments-page-show-content" onclick="
				console.log('show content');
				$('.thing').eq(0).attr('style', 'display:flex!important');
				$('#qaru-comments-page-show-content').hide();
">
	${iconTagger('art_track')}
</a>
</div>`);

      let $gold = $('.give-gold-button').eq(0).children().eq(0);
      $gold.text('');
      $gold.prepend(iconTagger('star_border'));

      $('.title-button').addClass('px-0 my-auto');
      $('.usertext-edit').parent().addClass('row justify-content-center');
      $('.usertext-edit').addClass('col-10');
      $('.usertext-edit').children().eq(0).children().eq(0).addClass('mx-auto my-auto');
      $('.help-hoverable').parent().hide();
    } else if (submitPage) {
      let $tabs = $('ul.tabmenu').children();
      $tabs.eq(0).children().eq(0).text('');
      $tabs.eq(0).children().eq(0).prepend(iconTagger('link'));
      $tabs.eq(1).children().eq(0).text('');
      $tabs.eq(1).children().eq(0).prepend(iconTagger('text_fields'));

      $('br').remove();
      $('div.content').addClass('row justify-content-center');
      $('form.submit').addClass('col-1');
      $('div.content').children().eq(0).remove();

      $('div#url-field').children().eq(0).remove();
      $('div#image-field').children().eq(0).remove();
      $('div#title-field').children().eq(0).remove();
      $('div#text-field').children().eq(0).remove();
      $('div#text-field').children().eq(0).remove();
      $('div#reddit-field').children().eq(0).remove();
      $('div#items-required').remove();
      $('input#submit_type_profile').next().hide();
      $('input#submit_type_subreddit').next().hide();
      $('input#submit_type_profile').hide();
      $('input#submit_type_subreddit').hide();
      $('input#sendreplies').parent().prev().remove();
      $('input#url').attr('placeholder', 'url');
      $('textarea').eq(0).attr('placeholder', 'title');
      $('textarea').eq(1).attr('placeholder', 'text');
      $('input#sr-autocomplete').attr('placeholder', 'subreddit');
    }

    $('#chat-app').hide();

    $('.content').attr('style',
      'width: var(--qaru-full-width)!important; max-width: var(--qaru-full-width)!important;');
    $('#siteTable').addClass('col-12');
    $('.thumbnail').wrap(
      '<div class="thumbnail-div col-1 mx-0 my-auto"></div>');

    let $things = $('.thing');
    for (let i = 0; i < $things.length; i++) {
      let $thing = $things.eq(i);
      try {
        await editThing($thing, (i == 0));
      } catch (err) {
        log(err);
      }
      if (commentsPage && i == 0) {
        $thing.find('.thumbnail-div').remove();
        if (!($thing.find('.full-res-content').length ||
            $thing.find('.full-res-img').length)) {
          $thing.find('.expando').addClass(
            'col-xl-6 col-lg-8 col-md-10 col-sm-12 px-auto py-5');
          $thing.find('.expando').attr('style', 'display: block!important;');
          $thing.prepend($thing.find('.expando').detach());
          $thing.find('.expando').wrapAll('<div class="row justify-content-center"></div>');
          commentPageContentShown();
        } else {
          if ($thing.hasClass('spoiler')) {
            $thing.find('.expando').hide();
            commentPageContentShown();
          } else {
            $thing.hide();
          }
        }
      }
    }
    // control over RES
    $(`.entry,.RESUserTag, #RESShortcutsEditContainer, .res-tabmenu-button,
			.res-show-images, .md-container`).addClass('qaru');
    $('.srSep').remove();
    $('#openRESPrefs').children().append(`
<a href="#res:settings/about">
${iconTagger('settings_applications', 'md-8')}
</a>`);


    // removes all spaces from the body, they are not elements
    // so this can't be done with jquery
    $('body').html($('body').html().split('&nbsp;').join(''));

    let children = [];
    if (commentsPage) {
      children = document.querySelectorAll('.sitetable, .child');
    } else if (redditPage) {
      children = document.querySelectorAll('.organic-listing, .siteTable');
    }
    for (let i = 0; i < children.length; i++) {
      observers.push(new MutationObserver(mutationCallback));
      observers.last().observe(children.item(i), mutationConfig);
    }

    log('qashto reddit-uhd loaded!');
  }

  log('qashto reddit-uhd loading...');
  if (!resPage) {
    editPage();
  }
});

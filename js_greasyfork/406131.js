// ==UserScript==
// @name          Trim Reddit
// @namespace     stgeorge
// @description   Trimmer for Reddit
// @require       http://code.jquery.com/jquery-1.12.4.min.js
// @match         *://old.reddit.com/*
// @match         *://www.reddit.com/*
// @grant         GM.xmlHttpRequest
// @grant         GM.getValue
// @grant         GM.setValue
// @grant         GM.deleteValue
// @version       3.34
// @license       MIT
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/406131/Trim%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/406131/Trim%20Reddit.meta.js
// ==/UserScript==

(() => {
  let side = null;

  let DONT_MATCH = [
    /\/r\/\w+\/comments\//,
    /\/login/,
    /\/over18/,
  ];

  // Add a 'new' link to to the header.
  const OPT_NEW_LINKS = true;

  // Delete Automoderator comments.
  const OPT_NO_AUTOMODERATOR = false;

  const IMG_LINKS = $([
    'imgur.com',
    'i.imgur.com',
    'preview.redd.it',
    'youtube.com'
  ]);

  const CSS = 
    $(`<style id="trimreddit">
      .selected .choice {
        color: red !important;
      }
      .choice {
        color: black !important;
      }
      #tm-wrapper {
        display: grid;
        justify-content: center;
        align-items: center;
      }
      #search {
        transform:none !important;
        background: revert !important;
        position:sticky !important;
        left: 0 !important;
      }
      #search input {
        background-image: none !important;
        max-width: revert !important;
        min-width: revert !important;
        position: revert !important;
        margin: 0 !important;
        border: solid 1px #aaa !important;
        padding: 5px !important;
      }
      #search input[type="submit"] {
        margin-left: 5px !important;
        display: inline-block !important;
      }
      .tabmenu {
        margin: 10px 0 10px 0 !important;
        position: sticky !important;
        left: 0 !important;
        border: solid 1px #aaa important;
        padding: 5px important;
      }
      .tabmenu li a {
        font-weight: normal !important;
        background-color: white !important;
        color: black !important;
      }
      #body-wrapper {
        display: flex;
        height: calc(100vh - 50px);
      }
      #sr-header-area {
        visibility: visible !important;
        top: 0 !important;
        position: revert !important;
        background-image: none !important;
        background-color: white !important;
        font-size: 14px !important;
        text-transform: capitalize !important;
        padding-top: 5px !important;
        padding-bottom: 5px !important;
      }
      #header {
        height: revert !important;
        min-height: 0 !important;
        position: sticky !important;
        font-size: 0.7rem;
        background: white !important;
        border-bottom: solid 1px black !important;
        padding: 0 !important;
        margin: 0 !important;
        z-index: 999 !important;
      }
      #header * {
        font-weight: bold !important;
        font-size: 14px !important;
      }
      #sr-header-area #newr, #sr-header-area #lgn {
        color: red !important;
      }
      #header::before {
        position: revert !important;
      }
      #header::after {
        position: revert !important;
        height: revert !important;
      }
      .thing {
        border: revert !important;
        border-bottom: solid 1px #ccc !important;
        border-radius: revert !important;
        box-shadow: revert !important;
      }
      .thing .title {
        color: #0079d3 !important;
        overflow: visible !important;
        padding-left: 0 !important;
        font-size: 16px !important;
      }
      .thing .title:visited {
        color: #802b2b !important;
      }
      p.title {
        margin-left: revert !important;
      }
      .domain {
        display: table !important;
      }
      .link, .link.odd, .link.even {
        margin: 0 !important;
        padding: 0px !important;
      }
      .thing.link {
        background-image: none !important;
      }
      .thing .collapsed {
        border-bottom: transparent !important;
      }
      .thing.noncollapsed {
        border-bottom: solid 1px #ddd !important;
      }
      .link .thumbnail {
        margin-left: 5px !important;
        display: none !important;
      }
      .search-result-link .thumbnail {
        margin-left: 5px !important;
        display: none !important;
      }
      .link * {
        padding: 3px 2px 0px 5px !important;
      }
      .link .rank,.title::before,.midcol {
        display: none !important;
      }
      .link.linkflair {
      }
      .link.linkflair::after, .link.promoted::after {
        content: revert !important;
      }
      .linkflairlabel {
        cursor: pointer;
        position: revert !important;
        margin: revert !important;
        margin-right: 5px !important;
        padding: 3px !important;
        font-size: 12px !important;
        min-height:15px !important;
      }
      .flaircolordark: {
        color: revert !important;
      }
      .entry {
        margin-left: 2px !important;
        overflow: visible !important;
        border: none !important;
        background-color: revert !important;
      }
      .entry * {
        font-size: 16px !important;
      }
      body {
        padding-top: 0 !important;
        margin-left: 0 !important;
      }
      body div.content {
        margin: 5px !important;
      }
      .sitetable {
        border-bottom: 0 !important;
        border-left: 0 !important;
        border-right:solid 1px #eeeeff !important;
        margin-right: revert !important;
      }
      .linklisting.sitetable {
        margin-right: 0 !important;
      }
      .listing-page #siteTable {
        margin-right: 0;
      }
      #siteTable::before {
        padding: 0 !important;
        margin: 5px 0 5px 0 !important;
        content: '' !important;
        height: 0 !important;
        width: 0 important;
        border: none !important;
      }
      .thing .tagline .curuser {
        color: red !important;
        font-weight: bold !important;
      }
      div.side {
        background-image: none !important;
      }
      .side {
        margin: 0 !important;
        z-index: 100 !important;
        background: url('') !important;
        background-color: transparent !important;
        box-shadow: revert !important;
        width:100% !important;
        overflow-y:auto !important;
        padding-top: 15px !important;
        border-left: solid 1px black !important;
      }
      .side::before {
        content: revert !important;
        background: revert !important;
      }
      .side .tagline {
        display: revert !important;
      }
      .side:after {
        content: '';
      }
      .side * .thumbnail {
        display: none !important;
      }
      .side * {
        font-size: 16px !important;
        text-align: left !important;
      }
      .side a {
        background-color: revert !important;
      }
      a.title {
        background: url('') !important;
      }
      a.title:hover {
        color: revert !important;
      }
      .side .usertext {
        width: 100% !important;
      }
      .side .usertext p {
        background-color: revert !important;
        color: black !important;
        padding: 0 !important;
      }
      p:first-child,p:nth-child(2),p:nth-child(3) {
        border: none !important;
      }
      .side .md > ul:first-of-type {
        display: none !important;
      }
      .side .md p {
        border-bottom: 0 !important;
        margin: 1px !important;
      }
      .side .md h3, .side .md h2 {
        display: none !important;
      }
      .side .md p::before {
        border-right: 0 !important;
      }
      .side .md blockquote {
        position: relative !important;
      }
      .side .commentarea {
        margin-right: revert !important;
        background-color: revert !important;
      }
      .awardings-bar {
        position: revert !important;
      }
      .thing .comment {
        background-color: transparent !important;
      }
      .sidemenu {
        width:100%;
        position:fixed;
        padding:2px 2px 5px 5px;
        margin:2px;
        background-color: #eeeeee;
        z-index:999;
        top:1.7em;
      }
      .sidemenu-button {
        font-weight:bold;
        cursor:pointer;
      }
      .side .expando * {
        background-color: revert !important;
      }
      .expando {
        position: revert !important;
      }
      .expando-button {
        display: none !important;
      }
      .md {
      }
      div.md>blockquote>p {
        position: inherit !important;
      }
      .content .usertext .md p {
        font-size: 16px !important;
      }
      .md p::before {
        width:0 !important;
      }
      .content:before {
        background-color: revert !important;
        background-image: revert !important;
        height:0px !important;
      }
      .content[role="main"] {
        padding: revert !important;
      }
      .content {
        padding-right: 0;
      }
      .clicked {
        background-color: aliceblue !important;
      }
      .ui-resizable-e { 
        cursor: e-resize; 
        width: 2px; 
        right: -1px; 
        top: 0; 
        bottom: 0; 
        background-color: blue !important;
      }
      #popup {
        position: fixed;
        top: 0;
        left:0;
        background:rgba(0,0,0,0.75);
        width:100%;
        height:100%;
        display:none;
      }
      .searchpane,.search-result-group-header {
        display:none !important;
      }
      .search-result-listing {
        margin: revert !important;
      }
      .search-result-group {
        max-width: 100% !important;
        min-width: 100% !important;
        padding-left: 5px !important;
        padding-right: 5px !important;
      }
      .disabled {
        cursor:not-allowed;
      }
      .hide {
        display:none !important;
      }
      .menuarea,a[name="content"] {
        visibility:hidden;
        display:none;
      }
      .media-preview, .media-preview img.preview {
        display: block !important;
        visibility: visible !important;
      }
    </style>`);

  const CLASSIC_BUTTONS_CSS = 
    $(`<style>
      .classic-button {
        border:none !important;
        padding:8px !important;
        border-radius:9999px !important;
        color:white !important;
        background-color:#0045ac !important;
        font-weight:bold !important;
      }
    </style>`);

  function trim() {
    appendStyles();
    let tabmenu = $('.tabmenu').detach();
    $('.infobar').remove();
    $('.footer-parent').remove();
    $('#sr-header-area').siblings().remove();
    $('#sr-more-link').remove();
    let content = $('.content[role="main"]');

    content.css({
      width:'35%',
      // height: '1000px',
      'overflow-y': 'auto',
      resize:'horizontal',
      margin: '0',
    });

    //
    // We make the right-hand side sidebar (.side) bigger and empty its
    // contents. Then, we make the main pane (.content) thinner and
    // use it show the list of articles. (We mark it as resizable horizontally
    // so that it can be widened.) When an article is clicked on in
    // the .content pane, we show its threaded comments in the .side pane.
    //
    // +----------------------------------------------------+
    // |                      #header                       |
    // +----------------------------------------------------+
    // |                #body-wrapper (new)                 |
    // | +-------------+----------------------------------+ |
    // | |  .content   |             .side                | |
    // | |+-----------+|                                  | |
    // | | #tm-wrappr ||                                  | |
    // | |    (new)   ||                                  | |
    // | ||+---------+||                                  | |
    // | ||| tabmenu |||                                  | |
    // | |||---------|||        Post and comments         | |
    // | ||| #search |||                                  | |
    // | ||+---------+||                                  | |
    // | |+-----------+|                                  | |
    // | || Post list ||                                  | |
    // | ||  ...      ||                                  | |
    // | |+-----------+|                                  | |
    // | +-------------+----------------------------------+ |
    // +----------------------------------------------------+
    //
    if (document.URL.indexOf('old.reddit.com') != -1) {
      $('body').css({'overflow-y':'hidden'});
    }
    let wrapper = $('<div id="body-wrapper"></div>');
    $('#header').after(wrapper);
    wrapper.append(content);

    let tm_wrapper = $('<div id="tm-wrapper"></div>');
    content.prepend(tm_wrapper);

    let search = $('#search').detach();
    tm_wrapper.prepend(search);
    tm_wrapper.prepend(tabmenu);

    search.find('label').detach();
    let subs = /r\/(\w+)\//i.exec(top.location.href);
    if (subs && subs.length > 1) 
      $('#search').children('input[name="q"]').first().val('subreddit:'+subs[1]+' ');
    side = $('.side');
    side.empty();
    wrapper.append(side);

    $('.linkflairlabel').each(function(k,v) {
      let t = $(this);
      let colors = t.css('background-color').match(/\d+/g);
      let brightness = (299 * parseInt(colors[0]) +
        587 * parseInt(colors[1]) +
        114 * parseInt(colors[2]))/1000;
      if (brightness <= 155) {
        t.css('color', 'white');
      } else {
        t.css('color', 'black');
      }
      t.on('click', function(e) {
        let url = document.URL.replace('old','www');
        let m = url.match(/(.*\/r\/.*?)\//);
        let flair = t.children('span:first').text();
        if (flair) {
          top.location.href = m[1] +
            '?f=flair_name%3A%22'+encodeURIComponent(flair)+'%22';
        }
      });
    });

    let curbg = 'white';
    let first = null;
    retargetLinks($('.entry').add('.search-result'));
!!
    $('a.thumbnail').each(function(k,v) {
      let a = $(this);
      let href = a.attr('href');
      if (isImage(href)) {
        retarget(a);
      }
    });
    $('.entry a').add('.search-result a').add('a.title').each(function(k,v) {
      let t = $(this).closest('.thing');
      if (t.length == 0)
        t = $(this).closest('.search-result');
      let a = $(this);
      let title = a.text();
      let href = a.attr('href');
      if (href.indexOf('i.redd.it') != -1) {
        // Try to open inline images locally.
        href = t.find('a.comments').first().attr('href');
        if (href == null)
          href = t.find('a.bylink').first().attr('href');
      }
      if ((href != null) && (href.indexOf('/comments/') != -1)) {
        a.on('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          t.css({'background-color':'#ffeeee'});
          t.addClass('clicked');
          t.siblings().css({'background-color':curbg});
          t.siblings().removeClass('clicked');
          href = href.replace('www.reddit.com', 'old.reddit.com').
            replace('//reddit.com', '//www.reddit.com');
          (async () => {await GM.setValue('lastseen', href)})();
          loadComment(href+'?sort=new');
        });
        if (first === null && !t.hasClass('stickied')) {
          first = a;
        }
      }
    });
    (async() => {
      let last_seen = await GM.getValue('lastseen', null);
      GM.deleteValue('lastseen');
      let l = null;
      if (last_seen) {
        l = $('a[href="'+last_seen+'"]');
      }
      let to_show = (l && l.length > 0) ? l : first;
      if (to_show) {
        to_show.click();
      }
    })();
  }

  function appendStyles() {
    CSS.appendTo('head');
  }

  function appendClassicButtonStyles() {
    CLASSIC_BUTTONS_CSS.appendTo('head');
  }

  function isImage(href) {
    is_image = false;
    if (href) {
      IMG_LINKS.each(function(x,y) {
        if (href.indexOf('/'+y+'/') != -1) {
          is_image = true;
          return false;
        }
      });
    }
    return is_image;
  }

  function canRetarget(href) {
    do_retarget = false;
    if (href) {
      do_retarget =
        (href.startsWith('http://') || href.startsWith('https://'))
        && (
          (href.indexOf('.reddit.com/') == -1)
          || (
            (href.indexOf('/comments/') == -1)
            && ((href.indexOf('/user/') != -1) || (href.indexOf('/r/') != -1))
          )
        );
    }
    return do_retarget;
  }

  function retargetLinks(div) {
    div.find('a').each(function(k,v) {
      let anchor = $(this);
      let href = anchor.attr('href');
      let is_image = isImage(href);
      // Replace gallery link with the corr. comment link.
      if (href && (is_image || href.indexOf('.reddit.com/gallery/') != -1)) {
        let comment_anchor = anchor.closest('.top-matter').find('a.comments').first();
        href = comment_anchor.attr('href');
        anchor.attr('href', href);
      }
      if (is_image || canRetarget(href)) {
        retarget(anchor);
      }
    });
  }

  function retarget(link) {
    link.attr('rel','noopener');
    link.attr('target','_new');
  }

  function toggleComments(expand) {
    $('.commentarea').find('.comment').each(function(k,v) {
      let cur = $(v);
      let p = cur.parents('.comment');
      if (p.length == 0) {
        let children = cur.find('.comment');
        if (expand) {
          children.removeClass('collapsed').addClass('noncollapsed');
        } else {
          children.addClass('collapsed').removeClass('noncollapsed');
        }
        cur.removeClass('collapsed').addClass('noncollapsed');
      }
    });
  }
  
  function loadComment(u) {
    GM.xmlHttpRequest({
      method: "GET",
      url: u+'?sort=new',
      onload: function(response) {
        side.html($.parseHTML(response.responseText));
        let c = side.find('.content[role="main"]').detach();
        side.empty();
        side.append(`
          <div class="sidemenu">
            <span class="sidemenu-button" title="Expand/collapse lower levels" id="toggleall">[+/-]</span>
            <span style="margin-left:1em" title="Next entry by author" class="hide sidemenu-button" id="fnext">[&#9660;]</span>
            <span class="hide sidemenu-button" title="Previous entry by author" id="fprev">[&#9650;]</span>
            </div>
          </div>
        `);
        side.append(c);
        c.css({margin:'10px'});
        side.find('.infobar').detach();
        side.find('.top-matter').detach();
        // Remove Automoderator comments.
        if (OPT_NO_AUTOMODERATOR)
          side.find('.moderator').closest('.entry').detach();
        let toggle_expand = false;
        $('#toggleall').on('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          toggleComments(toggle_expand);
          toggle_expand = !toggle_expand;
        });
        retargetLinks(side);
        let all = [];
        let all_index = -1;
        let url = document.URL.replace(/\?.*/, '');
        side.find('a.author').each(function(k,v) {
          let a = $(this);
          if (a.attr('href') == top.location.href) {
            a.addClass('curuser');
            all.push(a);
          }
        });

        if (all.length > 0) {
          $('#fnext,#fprev').removeClass('hide');
          $('#fnext').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (++all_index >= all.length)
              all_index = 0;
            scrollTo(side, all[all_index]);
          });
          $('#fprev').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (--all_index < 0)
              all_index = all.length - 1;
            scrollTo(side, all[all_index]);
          });
        }
        setTimeout(function() {
          $(document).scrollTop(0);
          side.scrollTop(0);
          $('#toggleall').click();
        }, 500);
      }
    });
  }

  function enable(x, v) {
    if (v) {
      $(x).removeClass('disabled');
    } else {
      $(x).addClass('disabled');
    }
  }

  function scrollTo(p, el) {
    if (!el) return;
    setTimeout(function() {
      p.animate({
        scrollTop: el.offset().top - p.offset().top + p.scrollTop() - 50
      }, 1000);
    }, 500);
  }

  function fixHeader() {
    //
    // If OPT_NEW_LINKS is set, we add a 'new' link to to the header
    // to toggle between old and new reddits and a 'login' link.
    if (OPT_NEW_LINKS) {
      let bars = $('#sr-bar');
      let i = 0;
      bars.find('li').each(function(k,v) {
        if (i++ == 1) {
          let li = $(this);
          bars.prepend(addLink(li, 'newr', 'new',
            top.location.href.replace('old','www'), 'New Reddit'));
          bars.prepend(addLink(li, 'lgn', 'login',
            top.location.href.replace(/\.com\/.*/, '.com/login'), 'Login'));
          return false;
        }
      });
    }
  }

  function addLink(template, new_id, new_text, new_url, new_title) {
    let x = template.clone(true);
    let span = x.find('span').first();
    let a = x.find('a').first();
    a.text(new_text);
    a.attr('id', new_id);
    a.attr('href', new_url);
    a.attr('title', new_title);
    span.before(a);
    return x;
  }

  function trimClassicReddit() {
    addClassicButtons();
  }

  function toggleSidebars() {
    $('.sidebar-grid').toggleClass('grid');
    $('.grid-container').toggleClass('grid');
    $('.main-container').toggleClass('grid');
    $('.left-sidebar-min').toggle();
    $('.left-sidebar').toggle();
    $('reddit-sidebar-nav').toggle();
    $('.right-sidebar').toggle();
  }

  function addClassicButtons() {
    //
    // Add a button to switch to old reddit.
    //
    appendClassicButtonStyles();
    let x = $('#get-app');

    // Ugh!
    x.before($('<button id="old-button" class="classic-button justify-center flex items-center button" type="button">Old</button>'));
    x.remove();
    let old_button = $('#old-button');
    old_button.closest('faceplate-tracker').next('span').text('Old (Classic) Reddit');

    let button_parent = old_button.closest('span.contents');
    let sidebar_toggle = button_parent.clone();
    sidebar_toggle.find('#old-button').replaceWith(
      $('<button id="sidebar-button" class="classic-button justify-center flex items-center button" type="button">Sidebars</button>')
    );
    button_parent.before(sidebar_toggle);
    $('#sidebar-button').closest('faceplate-tracker').next('span').text('Toggle sidebars');

    old_button.on('click', function() {
      top.location.hostname = 'old.reddit.com';
    });
    $('#sidebar-button').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleSidebars();
    });
  }

  // Main.
  setTimeout(function() {
    if (document.URL.indexOf('www.reddit.com') != -1) {
      // NEW REDDIT.
      trimClassicReddit();
      $('div[data-adclicklocation="title"] a').each(function(k,v) {
        let a = $(this);
        a.on('click', function() {
          window.open(a.attr('href'), '_blank');
          return false;
        });
      });
    } else {
      // OLD REDDIT.
      let do_trim = true;
      $(DONT_MATCH).each(function(k,v) {
        if (document.URL.match(v)) {
          do_trim = false;
          return false;
        }
      });
      if (do_trim) {
        trim();
        fixHeader();
      }
    }
  }, 1000);

})();

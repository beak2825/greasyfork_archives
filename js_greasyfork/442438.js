// ==UserScript==
//
// @name         KG Ignore
// @version      1.5
// @namespace    https://forum.karagarga.in/index.php?showtopic=42452
// @description  Backseat-moderation tool for KG
// @icon         data:image/png;base64,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
// @license      MIT
//
// @homepage     https://forum.karagarga.in/index.php?showtopic=42452
// @supportURL   https://forum.karagarga.in/index.php?showtopic=42452
//
// @compatible   firefox
// @compatible   opera
// @compatible   chrome
// @compatible   safari
// @compatible   edge
//
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @require      https://cdn.jsdelivr.net/gh/sizzlemctwizzle/GM_config@43fd0fe4de1166f343883511e53546e87840aeaf/gm_config.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
//
// @include      https://forum.karagarga.in/index.php?showtopic=*
// @include      https://karagarga.in/details.php?id=*
// @include      https://karagarga.in/comments.php*
// @include      https://karagarga.in/
//
// @grant        GM_registerMenuCommand
// @grant        GM.registerMenuCommand
//
// @run-at       document-start
//
// @downloadURL https://update.greasyfork.org/scripts/442438/KG%20Ignore.user.js
// @updateURL https://update.greasyfork.org/scripts/442438/KG%20Ignore.meta.js
// ==/UserScript==
/*=========================  Version History  ==================================

1.5     - Reverted 1.4

1.4     - Removed slash from @include

1.3     - Fixed: Blocking stopped working on the homepage.

1.2     - Added support for homepage comments in "read more comments ?" pages.

1.1     - Options to ignore on torrent & homepage posts (quoted posts too).

1.0     - First release. Ignore forum post and quoted post.

==============================================================================*/

function startIgnore() {
  var ignore = GM_config.get('ignore_list').split(',');

  if (GM_config.get('forum_comments') && Boolean(location.href.match('showtopic'))) {
    ignore.forEach(function(user) {
      $('a.name>span:contains(' +user+ ')').parents('div.post_block').css("display", "none");
      $('p.citation:contains(' +user+ ')').parents('div.post_block').css("display", "none");
    });
  }

  if (GM_config.get('torrent_comments') && Boolean(location.href.match('details.php'))) {
    ignore.forEach(function(user) {
      $('p.sub>a:contains(' +user+ ')').parents('form[method=post]>table table').css("display", "none");
      $('p.sub:contains(' +user+ ' wrote:)').parents('form[method=post]>table table').css("display", "none");
    });
  }

  if (GM_config.get('homepage_comments') && $('head>title').text().match(/^KG$/)) {
    ignore.forEach(function(user) {
      $('i>a:contains(' +user+ ')').parents('td.tabletitle').parent().css("display", "none");
      $('p.sub:contains(' +user+ ' wrote:)').parents('td.tabletitle').parent().css("display", "none");
    });
  }
}

//==============================================================================
//    Settings Menu (GM_config)
//==============================================================================

var config_fields = {
  'aftertitle': {
    'section': ' ',
    'label': ' &nbsp',
    'type': 'hidden'
  },
  'ignore_list': {
    'label': 'Ignore list: ',
    'type': 'text',
    'default': 'boooni,moooni,babooni'
  },
  'forum_comments': {
    'type': 'checkbox',
    'label': 'Ignore on forum comments?',
    'default': true
  },
  'torrent_comments': {
    'type': 'checkbox',
    'label': 'Ignore on torrent comments?',
    'default': true
  },
  'homepage_comments': {
    'type': 'checkbox',
    'label': 'Ignore on homepage comments?',
    'default': true
  }
};

//==============================================================================
//    Initialize and register GM_config
//==============================================================================

GM_config.init({
  'id': 'kg_ignore',
  'title': 'KG Ignore Settings',
  'fields': config_fields,
  'css': `.field_label { \
             display:         flex !important; \
             align-items:   center !important; \
             font-weight:   normal !important;}\
          .config_var { \
             margin-top:       2px !important; \
             margin-bottom:    2px !important; \
             display:         flex !important; \
             align-items:   center !important;}\
          #kg_ignore_aftertitle_var { \
             margin-top:       0px !important; \
             margin-bottom:    0px !important;}\
          input { \
             margin-top:       0px !important; \
             margin-bottom:    0px !important;}\
          .grey_link { \
             margin-left:      4px !important;}\
          #kg_ignore_section_header_0 { \
             font-weight:     bold !important; \
             border:           0px !important; \
             margin-top:       0px !important; \
             background:   #bfbfbf !important;}\
          #kg_ignore_header { \
             background:     black !important; \
             color:          white !important;}\
          #kg_ignore_section_0 { \
             margin-top:       0px !important;}`,
  'events':
  {
    'open': function() {
      // Iframe position.
      this.frame.style.top    = '50px';
      this.frame.style.left   = 'auto';
      this.frame.style.right  = '150px';
      this.frame.style.height = '40%';
      this.frame.style.width  = '450px';

      $('#kg_ignore').contents().find('input#kg_ignore_field_ignore_list').attr('size', '47');

      const modVersion = 'KG Ignore v' + GM.info.script.version;
      const modUrl = 'https://greasyfork.org/en/scripts/442438-kg-ignore';
      $('#kg_ignore').contents().find('#kg_ignore_section_header_0').append($('<a href="'+modUrl+'" target ="_blank">'+modVersion+'</a>'));
      $('#kg_ignore').contents().find('#kg_ignore_section_header_0').find('a').css({
       'text-decoration': 'none',
       'color': '#cb0000'
      });
    },

    'close': function() {
      location.reload();
    }
  }
});

GM.registerMenuCommand('KG Ignore Settings', function() {GM_config.open();});


window.addEventListener('DOMContentLoaded', startIgnore);


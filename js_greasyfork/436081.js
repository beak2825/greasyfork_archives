// ==UserScript==
// @name AO3: Add Paragraph Breaks
// @description Convert line breaks to paragraphs on Archive of our Own fics
// @author the_wanlorn
// @version 1.0
// @license MIT
// @grant GM_getValue
// @grant GM_setValue
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require https://openuserjs.org/src/libs/sizzle/GM_config.js
// @include https://archiveofourown.org/works/*
// @include https://archiveofourown.org/*/works/*
// @include http://archiveofourown.org/works/*
// @include http://archiveofourown.org/*/works/*
// @namespace https://greasyfork.org/users/844343
// @downloadURL https://update.greasyfork.org/scripts/436081/AO3%3A%20Add%20Paragraph%20Breaks.user.js
// @updateURL https://update.greasyfork.org/scripts/436081/AO3%3A%20Add%20Paragraph%20Breaks.meta.js
// ==/UserScript==

(function ($) {
  var frame = document.createElement('div');
  document.body.appendChild(frame);

  var gmc = new GM_configStruct({
    'id': 'ao3_add_paragraphs',
    'title': 'AO3: Add Paragraphs Settings',
    'fields': {
      'autoFormat': {
        'label': 'Auto-Format Fics',
        'type': 'checkbox',
        'default': false
      },
      'doubleBreaks': {
        'label': 'Convert single paragraph breaks to double paragraph breaks',
        'type': 'checkbox',
        'default': false
      }
    },
    'frame': frame,
    'events': {
      'open': addStyling,
      'save': function () { gmc.close(); },
      'close': initFormat,
      'reset': function () { gmc.save(); }
    }
  });

  initFormat();

  /**
   * Add UI elements and potentially format the page, if autoformatting is
   * turned on.
   */
  function initFormat() {
    var auto_format = gmc.get('autoFormat'),
      double_breaks = gmc.get('doubleBreaks');

    if (auto_format) {
      formatPage(double_breaks);
    }

    addLinks(auto_format);
  }

  /**
   * Add UI elements
   *
   * @param {bool} auto_format Whether the page is to be formatted automatically.
   */
  function addLinks(auto_format) {
    var $header_menu = $('ul.primary.navigation.actions'),
      $menu_link = $('.ao3_add_pars_settings'),
      $format_button = $('.ao3_add_pars');

    // If we don't already have a menu link there, add it.
    if ($menu_link.length === 0) {
      $menu_link = $('<li class="ao3_add_pars_settings dropdown"></li>').html('<a>Format Settings</a>');
      $header_menu.find('li.search').before($menu_link);
      $menu_link.on('click', function () {
        // Remove the open class since it's not actually a dropdown, we're just
        // cribbing the styling.
        $(this).toggleClass('open');
        // Open the settings dialogue
        gmc.open();
      });
    }

    // If we're not autoformatting the page, add a button to trigger it.
    if (!auto_format && $format_button.length === 0) {
      $format_button = $('<input class="button ao3_add_pars" type="button" value="Format Page"></input>');
      $format_button.css('marginLeft', '1em').css('marginRight', '1em');
      $header_menu.find('#search').prepend($format_button);
      $format_button.on('click', function() {
        var double_breaks = gmc.get('doubleBreaks');
        formatPage(double_breaks);
      });
    }
    // Otherwise, if we are autoformatting, get rid of the button.
    else if (auto_format && $format_button) {
      $format_button.remove();
    }
  }

  /**
   * Replace the current tags with the new tags.
   *
   * @param {bool} double Whether to add a double <br> tag to already-existing <p> tags.
   */
  function formatPage(double) {
    var $chapters = $('#chapters'),
      html_string = $chapters.html();

    if (double) {
      html_string = html_string.replaceAll('</p>', '<dblbrkspc></p>');
    }

    html_string = html_string.replaceAll('<br>', '</p><p>');

    if (double) {
      html_string = html_string.replaceAll('<dblbrkspc>', '<br /><br />');
    }

    $chapters.html(html_string);
  }

  /**
   * Add the required styling to the settings dialogue.
   *
   * @param {Object} document The document the given frame is in.
   * @param {Object} window   The window of the given frame.
   * @param {Object} frame    The frame to add styling to.
   */
  function addStyling(document, window, frame) {
    var frame_style = 'border: 1px solid #000; left: 50%; position: fixed; '
      + 'top: 50%; width: 310px; z-index: 9999; transform: translate(-50%, -50%);',
      $frame_obj = $(frame);

    $frame_obj.attr('style', frame_style);
    $frame_obj.find('#ao3_add_paragraphs_closeBtn').hide();
    $frame_obj.find('.field_label').css({"font-size": "1em", "font-weight": "400"});
    $frame_obj.find('.config_header').css({"font-size": "2em", "paddingBottom": "1em"});
    $frame_obj.find('.config_var').css({"margin": "0 0 10px 40px", "position": "relative"});
    $frame_obj.find('input[type="checkbox"]').css({"position": "absolute", "left": "-25px", "top": "0"});
  }
})(jQuery);

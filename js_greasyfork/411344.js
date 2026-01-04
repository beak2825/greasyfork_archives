// ==UserScript==
// @name           gmail basic enhancements
// @namespace      camelsoft
// @description    Extended labels and check all messages
// @include        https://mail.google.com/mail/u/0/h/*
// @icon           https://ssl.gstatic.com/ui/v1/icons/mail/images/favicon5.ico
// @require        https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @version        1.0.4
// @grant          none
// @license        GPLv3
// @downloadURL https://update.greasyfork.org/scripts/411344/gmail%20basic%20enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/411344/gmail%20basic%20enhancements.meta.js
// ==/UserScript==

jQuery.noConflict();

(function ($) { $(function () {
// -----------------------------------------------------------------------------

function shorten_combobox_options () {
  var cur_path = $('body').data('cbb_cur_path')||'';
  var cur_lvl  = $('body').data('cbb_cur_lvl' )||0;

  var path = $(this).val().substring(3);
  var path_parent  = path.substr(0, path.lastIndexOf("/"));
  var path_element = path.substring(parseInt(path.lastIndexOf("/"))+1);

  if (cur_path != path_parent) {
    cur_path = path_parent;
    cur_lvl  = (path_parent.match(/\//g) || []).length;
    $('body').data('cbb_cur_path', path_parent);
    $('body').data('cbb_cur_lvl' , cur_lvl);
  }//if

  var label = '<tt>';
  if (cur_lvl > 0) {
    label += "&nbsp;&nbsp;".repeat(cur_lvl);
    label += '&#x21B3;&nbsp;';
  }//if
  label += '</tt>'

  $(this).
    attr('title', decodeURIComponent(path)).
    html(label + decodeURIComponent(path_element));
}//shorten_combobox_options

function shorten_sidebar_links () {
  var cur_path = $('body').data('sbl_cur_path')||'';
  var cur_lvl  = $('body').data('sbl_cur_lvl' )||0;

  var path = $(this).attr('href').substring(8);
  var path_parent  = path.substr(0, path.lastIndexOf("/"));
  var path_element = path.substring(parseInt(path.lastIndexOf("/"))+1);

  if (cur_path != path_parent) {
    cur_path = path_parent;
    cur_lvl  = (path_parent.match(/\//g) || []).length;
    $('body').data('sbl_cur_path', path_parent);
    $('body').data('sbl_cur_lvl' , cur_lvl);
  }//if

  var label = '';
  if (cur_lvl > 0) {
    label += '&#x21B3;&nbsp;';
    $(this).css('margin-left', (0.75*cur_lvl)+'rem');
  }//if

  var unread = $(this).text().trim().match(/.+(\([0-9]+\))/) ?
    $(this).text().trim().replace(/.+(\([0-9]+\))/, '$1') : ''

  $(this).
    attr('title', decodeURIComponent(path)).
    children().first().html(label + decodeURIComponent(path_element) + '&nbsp;' + unread);
}//shorten_sidebar_links

// stop sidebar movement after labels resize
$('body > table:last td:first').css('width', '12rem');

// extend labels on "More actions..." combobox
$('select[name=tact] option[value^=ac_]').each(shorten_combobox_options);
$('select[name=tact] option[value^=rc_]').each(shorten_combobox_options);

// striped labels on the left sidebar
$('td.lb:contains(Labels) a').
  css('border-radius', '5px').
  css('display', 'inline-block').
  css('width', '8rem').
  css('padding', '1px');

// extend labels on the left sidebar
$('td.lb:contains(Labels) a:odd').css('background-color', '#dcdcdc');
$('td.lb:contains(Labels) a').each(shorten_sidebar_links);

// add toggle all messages checkbox
$('<input type="checkbox" name="toggle_all" title="Toggle all messages">').
  prependTo('form[name=f] td:first');
$('input[type=checkbox][name=toggle_all]').click(function () {
  $(this).prop('checked', false);
  $('input[type=checkbox][name=t]').each(function () {
    $(this).prop('checked', !$(this).prop('checked'));
  });
});

// remove label from emails rows
$('form[name=f] span.ts > font:first-child').remove();
// -----------------------------------------------------------------------------
});})(jQuery);

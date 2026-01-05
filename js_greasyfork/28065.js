// ==UserScript==
// @name         Redacted :: Edit Links in New Tabs
// @author       newstarshipsmell
// @namespace    https://greasyfork.org/en/scripts/28065-redacted-edit-links-in-new-tabs
// @description  Hold Shift, Ctrl and/or Alt while clicking Artist, Torrent Group or Torrent links in forum posts to open an edit page for them in a new tab.
// @version      1.1
// @require      https://greasyfork.org/libraries/GM_config/20131122/GM_config.js
// @include      https://redacted.ch/forums.php*
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/28065/Redacted%20%3A%3A%20Edit%20Links%20in%20New%20Tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/28065/Redacted%20%3A%3A%20Edit%20Links%20in%20New%20Tabs.meta.js
// ==/UserScript==

var settingsFields = {
  'script_use': {
    'label': 'Script Use', 'type': 'button',
    'title': 'How to use this userscript',
    'click': function() {
      alertMessage = 'This script will enable the user to open the appropriate/associated edit pages in new tabs when clicking upon artist, torrent and group links in the forums, when the appropriate keys (Shift, Ctrl and/or Alt) are held down while clicking the links.\n\nIf multiple keys are checked, then all of the checked keys must be pressed simultaneously for the desired effect - pressing only one of them will result in the browser\'s default behavior for clicking a link with that key pressed.\n\nUnchecking all three will result in normal behavior when you click on links (i.e. the script won\'t open edit pages for them.)\n\nThese tabs will either open in the background (the browser will remain on the current page) or switch focus to them immediately, depending upon the setting below.';
      alert(alertMessage);
    }
  },
  'hold_shift_key': {
    'type': 'checkbox', 'label': 'Hold Shift Key', 'default': true,
    'title': 'Hold Shift while clicking artist/torrent/group links to open their edit pages in a new tab.'
  },
  'hold_ctrl_key': {
    'type': 'checkbox', 'label': 'Hold Ctrl Key', 'default': false,
    'title': 'Hold Ctrl while clicking artist/torrent/group links to open their edit pages in a new tab.'
  },
  'hold_alt_key': {
    'type': 'checkbox', 'label': 'Hold Alt Key', 'default': false,
    'title': 'Hold Alt while clicking artist/torrent/group links to open their edit pages in a new tab.'
  },
  'open_in_background': {
    'type': 'checkbox', 'label': 'Open edit tabs in the background', 'default': true,
    'title': 'This will keep the current page focused and open the edit pages in new tabs in the background.\nOtherwise, the browser will switch to the new tab automatically.'
  },
  'replace_pth': {
    'type': 'checkbox', 'label': 'Replace PTH links with RED links', 'default': true,
    'title': 'This will replace \'passtheheadphones.me\' with \'redacted.ch\' in the target links.\nIf the userscript "Redacted :: Fix PTH URLs" is also installed, this setting is redundant and affects nothing.'
  }
};

GM_config.init({
  'id': 'SettingsMenu', 'title': 'Edit Links in New Tabs', 'fields': settingsFields,
  'css': '.section_header { background: white !important; color: black !important; border: 0px !important; text-align: left !important;} .field_label { font-weight: normal !important;}',
  'events':
  {
    'save': function() { location.reload(); }
  }
});

GM_registerMenuCommand('Edit Links in New Tabs Settings', function() {GM_config.open();});

var holdShift = GM_config.get('hold_shift_key');
var holdCtrl = GM_config.get('hold_ctrl_key');
var holdAlt = GM_config.get('hold_alt_key');
var openInBackground = GM_config.get('open_in_background');
var replacePTH = GM_config.get('replace_pth');

document.addEventListener("click", function(e) {
  if ((e.shiftKey == holdShift && e.ctrlKey == holdCtrl && e.altKey == holdAlt) &&
      (holdShift === true || holdCtrl === true || holdAlt === true) &&
      e.target.tagName == 'A' &&
      (e.target.href.indexOf('artist.php?id=') > -1 ||
       e.target.href.indexOf('torrents.php?id=') > -1 ||
       e.target.href.indexOf('torrents.php?torrentid=') > -1)) {
    e.preventDefault();
    if (e.target.hostname == 'passtheheadphones.me' && replacePTH === true)
      e.target.hostname = 'redacted.ch';

    if (e.target.href.indexOf('artist.php?id=') > -1) {
      GM_openInTab(e.target.href.replace(/\?id=/, '?action=edit&artistid='), openInBackground);
    }

    if (e.target.href.indexOf('torrents.php?id=') > -1 && e.target.href.indexOf('torrentid=') < 0) {
      GM_openInTab(e.target.href.replace(/\?id=/, '?action=editgroup&groupid='), openInBackground);
    }

    if (e.target.href.indexOf('torrentid=') > -1) {
      GM_setValue('REDsetUR', false);
      GM_openInTab(e.target.href.replace(/\?(|id=\d+&)torrentid=/, '?action=edit&id=').replace(/#torrent\d+/, ''), openInBackground);
    }
  }
});
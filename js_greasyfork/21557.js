var valuesSaved = false;
var oinkplusConfigFieldsMain = {
  'lastfm_api_key': {
    'label': ' <b>Last.fm API Key</b> (required for Last.fm API calls)', 'type': 'text', 'size': 48, 'title': 'Your Last.fm API Key',
    'default': '', 'section': ['', '<b><u>Last.fm Settings</u></b>']
  },
  'get_lastfm_api_key': {
    'label': 'Get API Key', 'type': 'button',
    'title': 'Click to open the Last.fm API Key application page in a new tab\nYou only need to fill in the Contact email and Application name fields on the application page - the rest are optional',
    'click': function() {
      GM_openInTab('http://www.last.fm/api/account/create', false);
    }
  },
  'max_tags': {
    'label': ' Maximum tags', 'labelPos': 'right', 'title': 'Maximum number of tags to display\nMust be an integer (0-100)', 'type': 'unsigned int', 'size' : 1, 'min': 0,
    'max': 100, 'default': 5
  },
  'max_sim_artists': {
    'label': ' Maximum similar artists', 'labelPos': 'right', 'title': 'Maximum number of similar artists to display\nMust be an integer (0-100)', 'type': 'unsigned int',
    'size' : 1, 'min': 0, 'max': 100, 'default': 25
  },
  'min_artist_thresh': {
    'label': ' Similarity threshhold', 'labelPos': 'right', 'title': 'Similar artists less similar than this will not be displayed\nMust be an integer (0-100 percentage)',
    'type': 'unsigned int', 'size' : 1, 'min': 0, 'max': 100, 'default': 0
  },
  'min_sim_artists': {
    'label': ' Minimum similar artists', 'labelPos': 'right', 'title': 'Minimum number of similar artists to display, regardless of similarity\nMust be an integer (0-100)',
    'type': 'unsigned int', 'size' : 1, 'min': 0, 'max': 100, 'default': 0
  },
  'max_bio_len': {
    'label': ' Maximum bio length', 'labelPos': 'right',
    'title': 'Maximum number of characters to display in the biography\nMust be an integer\nBiographies exceeding this length will be truncated, with a "read more" link to expand it',
    'type': 'unsigned int', 'size' : 1, 'min': 0, 'default': 450
  },
  'truncate_parenths': {
    'type': 'checkbox', 'label': 'Parse foreign artist names',
    'title': 'Parse artist names with trailing parenthetical text\nTest which name is predominantly standard ASCII and which is higher Unicode and discard the latter\ne.g. "Hi-Posi (ハイポジ)" will be parsed as "Hi-Posi" only\nEnabling this option will achieve better results in the Last.fm metadata returned',
    'default': false
  },
  'hide_useless_tags': {
    'type': 'checkbox', 'label': 'Hide useless tags',
    'title': 'Useless Last.fm tags listed below will be omitted from the displayed tags\nThey will not count towards the Maximum Tags limit',
    'default': false
  },
  'useless_tags': {
    'title': 'Useless Last.fm tags listed below will be omitted from the displayed tags\nThey will not count towards the Maximum Tags limit',
    'type': 'textarea', 'rows': 1, 'cols': 48, 'default': 'amazing, animal cruelty, awesome, beautiful, bimbo, bootylicious, boring, check this out, constant lip syncher, cool, crap, cunt, cute, drugs, favorite, favorites, favorite artists, fun, genius, great voice, guilty pleasure, guilty pleasures, happy, hot, iwasrecommendedthis, love, love this, mainstream, mislabel, need to rate, officially shallow, officially shit, overrated, party, playmoreonlastfm, potential, rap, seen live, sexy, shit, slsk, talentless, the pricipal picture is shit, to check out, to see it, want to see live, weed, whore, your ears will bleed'
  },
  'link_tags': {
    'type': 'checkbox', 'label': 'Link tags',
    'title': 'Link tags to a tag search on the respective tracker, when tracker tag searches are supported',
    'default': false
  },
  'link_artist_image': {
    'type': 'checkbox', 'label': 'Link artist image',
    'title': 'Link the artist image to that artist\'s image gallery page on Last.fm',
    'default': false
  },
  'artist_colors': {
    'label': 'Colorize Artists', 'type': 'button', 'title': 'Artists Color Menu', 'click': function() {
      gmc_oinkplusartistcolors.open();
    }
  },
  'icon_size': {
    'label': ' Icon size', 'labelPos': 'right', 'title': 'Icon size in pixels for trackers and external sites', 'type': 'select',
    'options': ['12', '16', '20', '24', '28', '32'], 'size': 4, 'default': '24'
  },
  'icon_padding': {
    'label': ' Padding', 'labelPos': 'right', 'title': 'Width in pixels of padding around icons', 'type': 'select',
    'options': ['0', '1', '2', '3', '4', '5', '6', '7', '8'], 'size': 4, 'default': '4'
  },
  'group_padding': {
    'label': ' Group Padding', 'labelPos': 'right', 'title': 'Extra rows between site groups',
    'type': 'select', 'options': ['0', '1', '2', '3', '4'], 'size': 4, 'default': '0'
  },
  'site_settings': {
    'label': 'Site Settings', 'title': 'Tracker / External Site Menu', 'type': 'button', 'click': function() {
      gmc_oinkplussites.open();
    }
  },
  'artist_list': {
    'label': 'Artist List', 'title': 'Artist List Menu', 'type': 'button','click': function() {
      gmc_oinkplusartists.open();
    }
  },
  'embedded_players_menu': {
    'label': 'Embedded Players', 'type': 'button', 'title': 'Embedded Players Menu\nNot implemented yet', 'click': function() {
      gmc_oinkplusplayers.open();
    }
  },
  'tracker_menu': {
    'label': 'Tracker Settings', 'title': 'Trackers Advanced Settings Menu', 'type': 'button', 'section': ['', '<b><u>Advanced Settings</u></b>'], 'click': function() {
      gmc_oinkplustrackers.open();
    }
  },
  'external_menu': {
    'label': 'External Site Settings', 'title': 'External Sites Advanced Settings Menu', 'type': 'button', 'click': function() {
      gmc_oinkplusexternals.open();
    }
  },
  'oinkplus_menu': {
    'label': 'OiNKPlus Settings', 'title': 'OiNKPlus Advanced Settings Menu', 'type': 'button', 'click': function() {
      gmc_oinkplusadvsettings.open();
    }
  }
};

GM_config.init({
  'id': 'oinkplusMainMenu', 'title': 'OiNKPlus Settings Main Menu', 'fields': oinkplusConfigFieldsMain,
  'css':  '.section_header { background: white   !important; color:  black       !important; border: 0px         !important; text-align: left    !important;} .field_label { font-weight: normal !important;}',
  'events':
  {
    'open': function(doc) {
      valuesSaved = false;
      var config = this;
      doc.getElementById(config.id + '_resetLink').title =
        'Reset fields to default values\nMake sure you copy your existing Last.fm API Key before you click this - it will be reset as well';
    },
    'save': function(values) {
      valuesSaved = true;
    },
    'close': function(values) {
      console.log('valuesSaved: ' + valuesSaved);
      if (valuesSaved) {
        valuesSaved = false;
        location.reload();
      }
    },
  }
});

GM_registerMenuCommand('OiNKPlus Settings', function() {GM_config.open();});

var oinkplusConfigFieldsArtistColors = {
  'col_sim_artists': {
    'type': 'checkbox', 'label': 'Colorize similar artists',
    'title': 'Colorize similar artists based on similarity\nSimilar Artist names will be colorized along a range of colors, determined by the settings below\nDefault settings display most similar as green and least similar as red, shading through yellow and orange between',
    'default': false, 'section': ['', '<b><u>Similar Artist Colors</u></b>']
  },
  'sim_artists_least_hue': {
    'label': ' Least similar hue', 'labelPos': 'right',
    'title': 'Hue for least similar artists (0%)\n0° = red, 120° = green and 240° = blue\nMust be an integer (0-360 degrees)',
    'type': 'unsigned int', 'size': 1, 'min': 0, 'max': 360, 'default': 0,
  },
  'sim_artists_most_hue': {
    'label': ' Most similar hue', 'labelPos': 'right',
    'title': 'Hue for most similar artists (100%)\n0° = red, 120° = green and 240° = blue\nMust be an integer (0-360 degrees)',
    'type': 'unsigned int', 'size': 1, 'min': 0, 'max': 360, 'default': 120,
  },
  /*  'sim_artists_hue_curve': {
    'label': ' Hue curvature', 'labelPos': 'right',
    'title': 'Hue range will be curved per the following\n1: curved like the upper-left quadrant of a circle\n0: straight line\n-1: curved like the lower-right quadrant of a circle\nMust be a number (-1 to 1)',
    'type': 'signed float', 'size': 1, 'min': -1, 'max': 1, 'default': 0
  },*/
  'sim_artists_hue_dir': {
    'type': 'select', 'options': ['Positive', 'Negative'], 'default': 'Positive', 'label': ' Hue direction',
    'title': 'Direction (positive or negative) to scale colors from least to most similar'
  },
  'sim_artists_least_sat': {
    'label': ' Least similar saturation', 'labelPos': 'right',
    'title': 'Saturation for least similar artists (0%)\n0% = white, 100% = fully saturated\nMust an integer (0-100 percentage)',
    'type': 'unsigned int', 'size': 1, 'min': 0, 'max': 100, 'default': 100,
  },
  'sim_artists_most_sat': {
    'label': ' Most similar saturation', 'labelPos': 'right',
    'title': 'Saturation for most similar artists (100%)\n0% = white, 100% = fully saturated\nMust be an integer (0-100 percentage)',
    'type': 'unsigned int', 'size': 1, 'min': 0, 'max': 100, 'default': 100,
  },
  /*  'sim_artists_sat_curve': {
    'label': ' Saturation curvature', 'labelPos': 'right',
    'title': 'Saturation range will be curved per the following\n1: curved like the upper-left quadrant of a circle\n0: straight line\n-1: curved like the lower-right quadrant of a circle\nMust be a number (-1 to 1)',
    'type': 'signed float', 'size': 1, 'min': -1, 'max': 1, 'default': 0
  },*/
  'sim_artists_least_val': {
    'label': ' Least similar value', 'labelPos': 'right',
    'title': 'Value (brightness) for least similar artists (0%)\n0% = black, 100% = full color\nMust be an integer (0-100 percentage)',
    'type': 'unsigned int', 'size': 1, 'min': 0, 'max': 100, 'default': 100,
  },
  'sim_artists_most_val': {
    'label': ' Most similar value', 'labelPos': 'right',
    'title': 'Value (brightness) for most similar artists (100%)\n0% = black, 100% = full color\nMust be an integer (0-100 percentage)',
    'type': 'unsigned int', 'size': 1, 'min': 0, 'max': 100, 'default': 100,
  },
  /*  'sim_artists_val_curve': {
    'label': ' Value curvature', 'labelPos': 'right',
    'title': 'Value range will be curved per the following\n1: curved like the upper-left quadrant of a circle\n0: straight line\n-1: curved like the lower-right quadrant of a circle\nMust be a number (-1 to 1)',
    'type': 'signed float', 'size': 1, 'min': -1, 'max': 1, 'default': 0
  },*/
  'col_sim_artists_valmod': {
    'label': ' Value modifier (for light themes)', 'labelPos': 'right',
    'title': 'On trackers added to the list below, the value (brightness) will be multiplied by this modifier\n(for better visibility on light themes, if you use both, and customize the other settings for a darker theme)',
    'type': 'unsigned float', 'size' : 1, 'min': 0, 'max': 1, 'default': 0.66
  },
  'col_sim_artists_sites': {
    'label': 'Trackers with light themes', 'labelPos': 'above',
    'title': 'List of trackers with light themes\nPut each tracker name on a separate line',
    'type': 'textarea', 'rows': 10, 'cols': 28, 'default': ''
  },
  'hsv_wiki': {
    'label': 'HSV Wiki', 'title': 'Click to open the Wikipedia page on "HSL and HSV" in a new tab', 'type': 'button', 'click': function() {
      GM_openInTab('https://en.wikipedia.org/wiki/HSL_and_HSV', false);
    }
  },
  'col_var_artists': {
    'type': 'checkbox', 'label': 'Colorize various artists', 'title': 'Colorize various artists based on artist role\nThis feature is not yet implemented, and will only work on Gazelle trackers with the multiple Artist feature',
    'default': false, 'save': false, 'section': ['', '<b><u>Various Artists Colors</u></b>']
  },
  'col_role_main': {
    'type': 'text', 'size': 3, 'default': '#00ff00', 'label': ' Main artist', 'title': 'Color for Main artists\nShould be in hexidecimal #rrggbb format'
  },
  'col_role_guest': {
    'type': 'text', 'size': 3, 'default': '#ffff00', 'label': ' Guest', 'title': 'Color for Guest artists\nShould be in hexidecimal #rrggbb format'
  },
  'col_role_composer': {
    'type': 'text', 'size': 3, 'default': '#00ffff', 'label': ' Composer', 'title': 'Color for Composers\nShould be in hexidecimal #rrggbb format'
  },
  'col_role_conductor': {
    'type': 'text', 'size': 3, 'default': '#007fff', 'label': ' Conductor', 'title': 'Color for Conductors\nShould be in hexidecimal #rrggbb format'
  },
  'col_role_compiler': {
    'type': 'text', 'size': 3, 'default': '#00ff00', 'label': ' DJ / Compiler', 'title': 'Color for DJ / Compiler\nShould be in hexidecimal #rrggbb format'
  },
  'col_role_remixer': {
    'type': 'text', 'size': 3, 'default': '#ff0000', 'label': ' Remixer', 'title': 'Color for Remixers\nShould be in hexidecimal #rrggbb format'
  },
  'col_role_producer': {
    'type': 'text', 'size': 3, 'default': '#ff00ff', 'label': ' Producer', 'title': 'Color for Producers\nShould be in hexidecimal #rrggbb format'
  },
};

var gmc_oinkplusartistcolors = new GM_configStruct(
  {
    'id': 'oinkplusArtistColorsMenu',
    'title': 'OiNKPlus: Artist Colors Menu',
    'fields': oinkplusConfigFieldsArtistColors,
    'css':  '.section_header { background: white   !important; color:  black       !important; border: 0px         !important; text-align: left    !important;} .field_label { font-weight: normal !important;}',
    'events':
    {
      'open': function() {
      },
      'save': function(values) {
        valuesSaved = true;
      },
      'close': function(values) {
        gmc_oinkplusartistcolors.close();
      }
    }
  });
gmc_oinkplusartistcolors.init();

var oinkplusConfigFieldsArtistList = {
  'sim_artists_notif': {
    'type': 'checkbox', 'label': 'Highlight similar artists',
    'title': 'Highlight similar artists listed in your Artist List\nYou must manually add a list of artists to the list below, or import it from your Artist Notifications filter',
    'default': false, 'section': ['', '<b><u>Similar Artists Settings</u></b>']
  },
  'sim_artists_b': {
    'type': 'checkbox', 'label': '<b>Embolden</b>', 'title': 'Embolden highlighted similar artists', 'default': false
  },
  'sim_artists_i': {
    'type': 'checkbox', 'label': '<i>Italicize</i>', 'title': 'Italicize highlighted similar artists', 'default': false
  },
  'sim_artists_u': {
    'type': 'checkbox', 'label': '<u>Underline</u>', 'title': 'Underline highlighted similar artists', 'default': false
  },
  'sim_artists_img': {
    'type': 'checkbox', 'label': 'Append image', 'title': 'Append an image after highlighted similar artists\nDefault image is a checkmark', 'default': false
  },
  'sim_artists_imgsize': {
    'label': 'Image size', 'title': 'Size of image (pixels x pixels) to append\nMust be an integer (≥1)', 'type': 'unsigned int', 'size': 1, 'min': 1, 'default': 11
  },
  'artist_list': {
    'label': 'Artist List',
    'title': 'The Artist List contains a list of artists which, if Highlight similar artists is enabled below, will highlight Last.fm similar artists matching entries in this list, per the settings below\nEach artist in this list should be on a separate line\nDo not paste comma-separated lists of artists in here, or it will treat the entire row as a single artist! You can manually copy/paste such lists into the "Artists to add" field below, or click the "Import Artists" button to automatically import a list of artists from your Artist notifications filter',
    'type': 'textarea', 'rows': 8, 'cols': 96, 'default': '', 'section': ['', '<b><u>Artist List</u></b>']
  },
  'sort_list': {
    'label': 'Sort & Prune List', 'title': 'Sort the Artist List and remove duplicate entries', 'type': 'button', 'click': function() {
      sortPruneArtists(gmc_oinkplusartists.oinkplusConfigFieldsArtistList.artist_list.toValue());
      gmc_oinkplusartists.close();
      location.reload();
    }
  },
  'artist_notifs_import': {
    'label': 'Artists to add', 'title': 'Copy/paste your comma-separated list of artists to append/replace', 'type': 'textarea', 'rows': 8, 'cols': 96, 'default': '',
    'section': ['', '<b><u>Artist Notifications Filter List - Manual Import</u></b>']
  },
  'parse_featured_artists': {
    'type': 'checkbox', 'label': 'Parse Featured Artists', 'title': 'Parse variants of "feat." artists in the artist values/tags', 'default': false
  },
  'parse_featured_tracks': {
    'type': 'checkbox', 'label': 'Parse Featured Artists in Track Tags', 'title': 'Parse variants of "feat." artists in the tracktitle tags', 'default': false
  },
  'featured_tracks_prefix': {
    'label': 'Track prefix',
    'title': 'Track title tag prefix\nShould be prepended to track title tags pasted or imported into the Artist List\nShould be a string that is unlikely to occur at the beginning of a tag, e.g. "!track: " (the default value)',
    'type': 'text', 'size': 16, 'default': '!track:'
  },
  'artist_notifs_append': {
    'type': 'checkbox', 'label': 'Append artists', 'title': '', 'default': true, 'save': false
  },
  'get_artist_manual': {
    'label': 'Add Artists',
    'title': 'Add the comma-separated list of Artists above into the Artist List\nList added will overwrite the stored Artist List if Import mode is "replace", otherwise it will append it',
    'type': 'button', 'click': function() {
      //gmc_oinkplusartists.set('artist_notifs_import', gmc_oinkplusartists.oinkplusConfigFieldsArtistList['artist_notifs_import'].toValue());
      getArtistNotifs(gmc_oinkplusartists.oinkplusConfigFieldsArtistList.artist_notifs_import.toValue(),
                      gmc_oinkplusartists.oinkplusConfigFieldsArtistList.artist_notifs_append.toValue());
      //gmc_oinkplusartists.close();
      //location.reload();
    }
  },
  'featured_artists_added': {
    'label': 'Featured Artists added to list', 'title': 'List of artists added to Artists List\nParsed from variants of "feat." in the artist and/or tracktitle values/tags',
    'type': 'textarea', 'rows': 6, 'cols': 96, 'default': '', 'section': ['', '<b><u>Featured Artists in Artist List</u></b>']
  },
  'clear_featured_artists': {
    'label': 'Clear', 'title': 'Clear the list of Featured Artists above\nClick this if none of the entries are invalid', 'type': 'button',
    'click': function() {
      if (confirm('OiNKPlus will clear the list of Featured Artists added to your Artist List.\n\nContinue?')) {
        gmc_oinkplusartists.set('clear_featured_artists', '');
        gmc_oinkplusartists.close();
        gmc_oinkplusartists.open();
      }
    }
  },
  'remove_featured_artists': {
    'label': 'Remove', 'title': 'Remove the list of Featured Artists above from your Artists List\nClick this after deleting valid entries from the Featured Artists list above, so it only contains invalid entries that should be removed from the Artist List', 'type': 'button',
    'click': function() {
      if (confirm('OiNKPlus will remove the current list of Featured Artists from your Artist List.\n\nContinue?')) {
        removeFeatArtists(gmc_oinkplusartists.oinkplusConfigFieldsArtistList.featured_artists_added.toValue());
        gmc_oinkplusartists.set('clear_featured_artists', '');
        gmc_oinkplusartists.close();
        gmc_oinkplusartists.open();
        alert('Featured Artists removed!\n\nList of Featured Artists cleared.');
      }
    }
  },
  'foobar2000_artists': {
    'label': 'OiNKPlus Artists list',
    'title': 'Add this pattern to your foobar2000 Text Tools Quick copy commands\nIt will copy a newline-separated list of artists, with multiple artists on the same track split to separate lines\n',
    'type': 'textarea', 'rows': 1, 'cols': 48, 'save': false, 'default': '$replace($meta_sep(artist,;newline;),;newline;,$crlf())',
    'section': ['', '<b><u>foobar2000 Text Tools Quick copy commands</u></b>']
  },
  'foobar2000_artists_tracks': {
    'label': 'OiNKPlus Artists & Tracks list', 'title': 'OiNKPlus Artists & Tracks list', 'type': 'textarea', 'rows': 4, 'cols': 96, 'save': false,
    'default': '$puts(prefix,\'!track:\')$replace($meta_sep(artist,;newline;),;newline;,$crlf())$if($or($strstr(%title%, Featuring ),$strstr(%title%, featuring ),$strstr(%title%, Feat. ),$strstr(%title%, feat. ),$strstr(%title%, Feat ),$strstr(%title%, feat ),$strstr(%title%, \'(\'Featuring ),$strstr(%title%, \'(\'featuring ),$strstr(%title%, \'(\'Feat. ),$strstr(%title%, \'(\'feat. ),$strstr(%title%, \'(\'Feat ),$strstr(%title%, \'(\'feat )),$crlf()$get(prefix)%title%,)'
  },
  'foobar2000_texttools': {
    'label': 'Text Tools', 'title': 'Click to open the foobar2000 Text Tools component page in a new tab', 'type': 'button', 'click': function() {
      GM_openInTab('http://www.foobar2000.org/components/view/foo_texttools', false);
    }
  }
};

var oinkplusConfigFieldsSites = {
  'tracker_order': {
    'label': '<b>Tracker order</b>', 'title': 'Order to display the Tracker links\nEach tracker should be a on separate line\nUse the spellings below or they will not load',
    'type': 'textarea', 'rows': 8, 'cols': 16,
    'default': 'ArenaBG\nDEEPBASSNiNE\nindietorrents\nJPopsuki\nKaragarga\nKraytracker\nLibble\nMusicVids\nRockBox\nRuTracker\nSecretCinema\nShellife\nThePirateBay\nTorrentz\nWaffles\nWhatCD',
    'section': ['', '<b><u>Tracker Links</u></b>']
  },
  'show_ArenaBG': {
    'type': 'checkbox', 'label': 'Add ArenaBG', 'default': false,
  },
  'center_ArenaBG': {
    'type': 'unsigned int', 'label': ' ArenaBG center width', 'min': 100, 'size': 1,
    'title': 'The width in pixels of the center section of OiNKPlus\nUsed to adjust the embedded players so they do not spread into the right column\nMust be a number (≥250)',
    'default': 100,
  },
  'show_DEEPBASSNiNE': {
    'type': 'checkbox', 'label': 'Add DEEPBASSNiNE', 'default': true
  },
  'center_DEEPBASSNiNE': {
    'type': 'unsigned int', 'label': ' DEEPBASSNiNE center width', 'min': 100, 'size': 1,
    'title': 'The width in pixels of the center section of OiNKPlus\nUsed to adjust the embedded players so they do not spread into the right column\nMust be a number (≥250)',
    'default': 440,
  },
  'show_indietorrents': {
    'type': 'checkbox', 'label': 'Add indietorrents', 'default': true
  },
  'center_indietorrents': {
    'type': 'unsigned int', 'label': ' indietorrents center width', 'min': 100, 'size': 1,
    'title': 'The width in pixels of the center section of OiNKPlus\nUsed to adjust the embedded players so they do not spread into the right column\nMust be a number (≥250)',
    'default': 218,
  },
  'show_JPopsuki': {
    'type': 'checkbox', 'label': 'Add JPopsuki', 'default': true
  },
  'center_JPopsuki': {
    'type': 'unsigned int', 'label': ' JPopsuki center width', 'min': 100, 'size': 1,
    'title': 'The width in pixels of the center section of OiNKPlus\nUsed to adjust the embedded players so they do not spread into the right column\nMust be a number (≥250)',
    'default': 270,
  },
  'show_Karagarga': {
    'type': 'checkbox', 'label': 'Add Karagarga', 'default': true
  },
  'center_Karagarga': {
    'type': 'unsigned int', 'label': ' Karagarga center width', 'min': 100, 'size': 1,
    'title': 'The width in pixels of the center section of OiNKPlus\nUsed to adjust the embedded players so they do not spread into the right column\nMust be a number (≥250)',
    'default': 304,
  },
  'show_Kraytracker': {
    'type': 'checkbox', 'label': 'Add Kraytracker', 'default': true
  },
  'center_Kraytracker': {
    'type': 'unsigned int', 'label': ' Kraytracker center width', 'min': 100, 'size': 1,
    'title': 'The width in pixels of the center section of OiNKPlus\nUsed to adjust the embedded players so they do not spread into the right column\nMust be a number (≥250)',
    'default': 100,
  },
  'show_Libble': {
    'type': 'checkbox', 'label': 'Add Libble', 'default': true
  },
  'center_Libble': {
    'type': 'unsigned int', 'label': ' Libble center width', 'min': 100, 'size': 1,
    'title': 'The width in pixels of the center section of OiNKPlus\nUsed to adjust the embedded players so they do not spread into the right column\nMust be a number (≥250)',
    'default': 300,
  },
  'show_MusicVids': {
    'type': 'checkbox', 'label': 'Add MusicVids', 'default': true
  },
  'center_MusicVids': {
    'type': 'unsigned int', 'label': ' MusicVids center width', 'min': 100, 'size': 1,
    'title': 'The width in pixels of the center section of OiNKPlus\nUsed to adjust the embedded players so they do not spread into the right column\nMust be a number (≥250)',
    'default': 100,
  },
  'show_RockBox': {
    'type': 'checkbox', 'label': 'Add RockBox', 'default': true
  },
  'center_RockBox': {
    'type': 'unsigned int', 'label': ' RockBox center width', 'min': 100, 'size': 1,
    'title': 'The width in pixels of the center section of OiNKPlus\nUsed to adjust the embedded players so they do not spread into the right column\nMust be a number (≥250)',
    'default': 100,
  },
  'show_RuTracker': {
    'type': 'checkbox', 'label': 'Add RuTracker', 'default': true
  },
  'center_RuTracker': {
    'type': 'unsigned int', 'label': ' RuTracker center width', 'min': 100, 'size': 1,
    'title': 'The width in pixels of the center section of OiNKPlus\nUsed to adjust the embedded players so they do not spread into the right column\nMust be a number (≥250)',
    'default': 100,
  },
  'show_SecretCinema': {
    'type': 'checkbox', 'label': 'Add SecretCinema', 'default': true
  },
  'center_SecretCinema': {
    'type': 'unsigned int', 'label': ' SecretCinema center width', 'min': 100, 'size': 1,
    'title': 'The width in pixels of the center section of OiNKPlus\nUsed to adjust the embedded players so they do not spread into the right column\nMust be a number (≥250)',
    'default': 100,
  },
  'show_Shellife': {
    'type': 'checkbox', 'label': 'Add Shellife', 'default': true
  },
  'center_Shellife': {
    'type': 'unsigned int', 'label': ' Shellife center width', 'min': 100, 'size': 1,
    'title': 'The width in pixels of the center section of OiNKPlus\nUsed to adjust the embedded players so they do not spread into the right column\nMust be a number (≥250)',
    'default': 454,
  },
  'show_ThePirateBay': {
    'type': 'checkbox', 'label': 'Add ThePirateBay', 'default': true
  },
  'center_ThePirateBay': {
    'type': 'unsigned int', 'label': ' ThePirateBay center width', 'min': 100, 'size': 1,
    'title': 'The width in pixels of the center section of OiNKPlus\nUsed to adjust the embedded players so they do not spread into the right column\nMust be a number (≥250)',
    'default': 100,
  },
  'show_Torrentz': {
    'type': 'checkbox', 'label': 'Add Torrentz', 'default': true
  },
  'center_Torrentz': {
    'type': 'unsigned int', 'label': ' Torrentz center width', 'min': 100, 'size': 1,
    'title': 'The width in pixels of the center section of OiNKPlus\nUsed to adjust the embedded players so they do not spread into the right column\nMust be a number (≥250)',
    'default': 380,
  },
  'show_Waffles': {
    'type': 'checkbox', 'label': 'Add Waffles', 'default': true
  },
  'center_Waffles': {
    'type': 'unsigned int', 'label': ' Waffles center width', 'min': 100, 'size': 1,
    'title': 'The width in pixels of the center section of OiNKPlus\nUsed to adjust the embedded players so they do not spread into the right column\nMust be a number (≥250)',
    'default': 340,
  },
  'show_WhatCD': {
    'type': 'checkbox', 'label': 'Add WhatCD', 'default': true
  },
  'center_WhatCD': {
    'type': 'unsigned int', 'label': ' WhatCD center width', 'min': 100, 'size': 1,
    'title': 'The width in pixels of the center section of OiNKPlus\nUsed to adjust the embedded players so they do not spread into the right column\nMust be a number (≥250)',
    'default': 270,
  },
  'show_descriptions': {
    'type': 'checkbox', 'label': 'Site descriptions', 'title': 'Show site descriptions (if available) instead of the site names in the icon tooltips',
    'default': false, 'section': ['', '<b><u>External Links</u></b>']
  },
  'qobuz_country': {
    'label': 'Qobuz country (language) to search:',
    'type': 'select',
    'options': ['Austria (German)', 'Belgium (Français)', 'Belgium (Nederlands)', 'France (Français)', 'Germany (Deutsch)', 'Great Britain (English)',
                'Ireland (English)', 'Spain (English)', 'Switzerland (Deutsch)', 'Switzerland (Français)'],
    'default': 'Great Britain (English)'
  },
  'group_order': {
    'label': '<b>Group order</b>', 'title': 'Order to display the External site groups\nEach group should be a on separate line\nUse the spellings below or they will not load',
    'type': 'textarea', 'rows': 8, 'cols': 16, 'default': 'Streaming Sites\nWebstores\nMusic Databases\nSocial Media\nMusic Blogs\nCD Stores\nGeneral'
  },
  'add_favorites': {
    'type': 'checkbox', 'label': 'Add Favorites row', 'title': 'Add a row of favorite External sites below the Trackers, above the other External site groups', 'default': false
  },
  'favorites_order': {
    'label': '<b>Favorites order</b>',
    'title': 'Order to display the External site links in the Favorites row\nEach site should be a on separate line\nUse the spellings below or they will not load',
    'type': 'textarea', 'rows': 8, 'cols': 16,
    'default': ''
  },
  'streaming_sites_order': {
    'label': '<b>Streaming Sites order</b>',
    'title': 'Order to display the External site links in the Streaming Sites row\nEach site should be a on separate line\nUse the spellings below or they will not load',
    'type': 'textarea', 'rows': 8, 'cols': 16, 'default': 'Deezer\nPandora\nPureVolume\nSoundCloud\nSpotify\nTidal\nWiMP', 'section': ['', '<b><u>Streaming Sites</u></b>']
  },
  'show_Deezer': {
    'type': 'checkbox', 'label': 'Add Deezer', 'default': true
  },
  'show_Pandora': {
    'type': 'checkbox', 'label': 'Add Pandora', 'default': true
  },
  'show_PureVolume': {
    'type': 'checkbox', 'label': 'Add PureVolume', 'default': true
  },
  'show_SoundCloud': {
    'type': 'checkbox', 'label': 'Add SoundCloud', 'default': true
  },
  'show_Spotify': {
    'type': 'checkbox', 'label': 'Add Spotify', 'default': true
  },
  'show_Tidal': {
    'type': 'checkbox', 'label': 'Add Tidal', 'default': true
  },
  'show_WiMP': {
    'type': 'checkbox', 'label': 'Add WiMP', 'default': false
  },
  'webstores_order': {
    'label': '<b>Webstores order</b>',
    'title': 'Order to display the External site links in the Webstores row\nEach site should be a on separate line\nUse the spellings below or they will not load',
    'type': 'textarea', 'rows': 8, 'cols': 16,
    'default': '7Digital\nBandcamp\nBeatport\nBleep\nBoomkat\nDigitalTunes\nGooglePlay\nHDtracks\nItunes\nJunoDownload\nMagnatune\nQobuz\nWhatPeoplePlay',
    'section': ['', '<b><u>Webstores</u></b>']
  },
  'show_7Digital': {
    'type': 'checkbox', 'label': 'Add 7Digital', 'default': true
  },
  'show_Bandcamp': {
    'type': 'checkbox', 'label': 'Add Bandcamp', 'default': true
  },
  'show_Beatport': {
    'type': 'checkbox', 'label': 'Add Beatport', 'default': true
  },
  'show_Bleep': {
    'type': 'checkbox', 'label': 'Add Bleep', 'default': true
  },
  'show_Boomkat': {
    'type': 'checkbox', 'label': 'Add Boomkat', 'default': true
  },
  'show_DigitalTunes': {
    'type': 'checkbox', 'label': 'Add DigitalTunes', 'default': true
  },
  'show_GooglePlay': {
    'type': 'checkbox', 'label': 'Add GooglePlay', 'default': true
  },
  'show_HDtracks': {
    'type': 'checkbox', 'label': 'Add HDtracks', 'default': true
  },
  'show_Itunes': {
    'type': 'checkbox', 'label': 'Add Itunes', 'default': true
  },
  'show_JunoDownload': {
    'type': 'checkbox', 'label': 'Add JunoDowndload', 'default': true
  },
  'show_Magnatune': {
    'type': 'checkbox', 'label': 'Add Magnatune', 'default': true
  },
  'show_Qobuz': {
    'type': 'checkbox', 'label': 'Add Qobuz', 'default': true
  },
  'show_WhatPeoplePlay': {
    'type': 'checkbox', 'label': 'Add WhatPeoplePlay', 'default': true
  },
  'music_databases_order': {
    'label': '<b>Music Databases order</b>',
    'title': 'Order to display the External site links in the Music Databases row\nEach site should be a on separate line\nUse the spellings below or they will not load',
    'type': 'textarea', 'rows': 8, 'cols': 16,
    'default': 'AllMusic\nDiscogs\nFreeDB\nLastfm\nMusicBrainz\nRateYourMusic\nReverbNation',
    'section': ['', '<b><u>Music Databases</u></b>']
  },
  'show_AllMusic': {
    'type': 'checkbox', 'label': 'Add AllMusic', 'default': true
  },
  'show_Discogs': {
    'type': 'checkbox', 'label': 'Add Discogs', 'default': true
  },
  'show_FreeDB': {
    'type': 'checkbox', 'label': 'Add FreeDB', 'default': true
  },
  'show_Lastfm': {
    'type': 'checkbox', 'label': 'Add Lastfm', 'default': true,
  },
  'show_MusicBrainz': {
    'type': 'checkbox', 'label': 'Add MusicBrainz', 'default': true
  },
  'show_RateYourMusic': {
    'type': 'checkbox', 'label': 'Add RateYourMusic', 'default': true
  },
  'show_ReverbNation': {
    'type': 'checkbox', 'label': 'Add ReverbNation', 'default': true
  },
  'social_media_order': {
    'label': '<b>Social Media order</b>',
    'title': 'Order to display the External site links in the Social Media row\nEach site should be a on separate line\nUse the spellings below or they will not load',
    'type': 'textarea', 'rows': 8, 'cols': 16,
    'default': 'Facebook\nGooglePlus\nMyspace\nTwitter\nTumblr\nYouTube\nVimeo',
    'section': ['', '<b><u>Social Media</u></b>']
  },
  'show_Facebook': {
    'type': 'checkbox', 'label': 'Add Facebook', 'default': true
  },
  'show_GooglePlus': {
    'type': 'checkbox', 'label': 'Add GooglePlus', 'default': true
  },
  'show_Myspace': {
    'type': 'checkbox', 'label': 'Add Myspace', 'default': true
  },
  'show_Twitter': {
    'type': 'checkbox', 'label': 'Add Twitter', 'default': true
  },
  'show_Tumblr': {
    'type': 'checkbox', 'label': 'Add Tumblr', 'default': true
  },
  'show_YouTube': {
    'type': 'checkbox', 'label': 'Add YouTube', 'default': true
  },
  'show_Vimeo': {
    'type': 'checkbox', 'label': 'Add Vimeo', 'default': true
  },
  'music_blogs_order': {
    'label': '<b>Music Blogs order</b>',
    'title': 'Order to display the External site links in the Music Blogs row\nEach site should be a on separate line\nUse the spellings below or they will not load',
    'type': 'textarea', 'rows': 8, 'cols': 16, 'default': 'HypeMachine\nMagiska\nMBSR\nScnlog', 'section': ['', '<b><u>Music Blogs</u></b>']
  },
  'show_HypeMachine': {
    'type': 'checkbox', 'label': 'Add HypeMachine', 'default': true
  },
  'show_Magiska': {
    'type': 'checkbox', 'label': 'Add Magiska', 'default': true
  },
  'show_MBSR': {
    'type': 'checkbox', 'label': 'Add MBSR', 'default': true
  },
  'show_Scnlog': {
    'type': 'checkbox', 'label': 'Add Scnlog', 'default': true
  },
  'cd_stores_order': {
    'label': '<b>CD Stores order</b>',
    'title': 'Order to display the External site links in the CD Stores row\nEach site should be a on separate line\nUse the spellings below or they will not load',
    'type': 'textarea', 'rows': 8, 'cols': 16,
    'default': 'Amazon\nAmazonAU\nAmazonBR\nAmazonCA\nAmazonCN\nAmazonDE\nAmazonES\nAmazonFR\nAmazonIT\nAmazonJP\nAmazonMX\nAmazonUK\nBigCartel\nCDandLP\nCDBaby\nEbay\nMusicStack',
    'section': ['', '<b><u>CD Stores</u></b>']
  },
  'show_Amazon': {
    'type': 'checkbox', 'label': 'Add Amazon', 'default': true
  },
  'show_AmazonAU': {
    'type': 'checkbox', 'label': 'Add AmazonAU', 'default': false
  },
  'show_AmazonBR': {
    'type': 'checkbox', 'label': 'Add AmazonBR', 'default': false
  },
  'show_AmazonCA': {
    'type': 'checkbox', 'label': 'Add AmazonCA', 'default': false
  },
  'show_AmazonCN': {
    'type': 'checkbox', 'label': 'Add AmazonCN', 'default': false
  },
  'show_AmazonDE': {
    'type': 'checkbox', 'label': 'Add AmazonDE', 'default': false
  },
  'show_AmazonES': {
    'type': 'checkbox', 'label': 'Add AmazonES', 'default': false
  },
  'show_AmazonFR': {
    'type': 'checkbox', 'label': 'Add AmazonFR', 'default': false
  },
  'show_AmazonIT': {
    'type': 'checkbox', 'label': 'Add AmazonIT', 'default': false
  },
  'show_AmazonJP': {
    'type': 'checkbox', 'label': 'Add AmazonJP', 'default': false
  },
  'show_AmazonMX': {
    'type': 'checkbox', 'label': 'Add AmazonMX', 'default': false
  },
  'show_AmazonUK': {
    'type': 'checkbox', 'label': 'Add AmazonUK', 'default': false
  },
  'show_BigCartel': {
    'type': 'checkbox', 'label': 'Add BigCartel', 'default': true
  },
  'show_CDandLP': {
    'type': 'checkbox', 'label': 'Add CDandLP', 'default': true
  },
  'show_CDBaby': {
    'type': 'checkbox', 'label': 'Add CDBaby', 'default': true
  },
  'show_Ebay': {
    'type': 'checkbox', 'label': 'Add Ebay', 'default': true
  },
  'show_MusicStack': {
    'type': 'checkbox', 'label': 'Add MusicStack', 'default': true
  },
  'general_order': {
    'label': '<b>General order</b>',
    'title': 'Order to display the External site links in the General row\nEach site should be a on separate line\nUse the spellings below or they will not load',
    'type': 'textarea', 'rows': 8, 'cols': 16, 'default': 'GoogleSearch\nWikipedia', 'section': ['', '<b><u>General</u></b>']
  },
  'show_GoogleSearch': {
    'type': 'checkbox', 'label': 'Add GoogleSearch', 'default': true
  },
  'show_Wikipedia': {
    'type': 'checkbox', 'label': 'Add Wikipedia', 'default': true
  }
};

var gmc_oinkplussites = new GM_configStruct(
  {
    'id': 'oinkplusSitesMenu',
    'title': 'OiNKPlus: Tracker / External Site Menu',
    'fields': oinkplusConfigFieldsSites,
    'css':  '.section_header { background: white   !important; color:  black       !important; border: 0px         !important; text-align: left    !important;} .field_label { font-weight: normal !important;}',
    'events':
    {
      'open': function() {
      },
      'save': function(values) {
        valuesSaved = true;
      },
      'close': function(values) {
        gmc_oinkplussites.close();
      }
    }
  });
gmc_oinkplussites.init();

var gmc_oinkplusartists = new GM_configStruct(
  {
    'id': 'oinkplusArtistList',
    'title': 'OiNKPlus: Artist List Menu',
    'fields': oinkplusConfigFieldsArtistList,
    'css':  '.section_header { background: white   !important; color:  black       !important; border: 0px         !important; text-align: left    !important;} .field_label { font-weight: normal !important;}',
    'events':
    {
      'open': function() {
      },
      'save': function(values) {
        valuesSaved = true;
      },
      'close': function(values) {
        gmc_oinkplusartists.close();
      }
    }
  });
gmc_oinkplusartists.init();

var oinkplusConfigFieldsPlayers = {
  'player_order': {
    'label': '<b>Player Order</b>', 'title': 'The order in which the players will be displayed\nPut each site on a separate line', 'type': 'textarea', 'rows': 3, 'cols': 16,
    'default': 'Bandcamp\nSoundCloud\nSpotify'
  },
  /*  'player_bandcamp_width': {
    'type': 'unsigned int', 'label': ' Width', 'title': 'Width of player in percentage\nMust be an integer (370-700)', 'size': 1, 'min': 1, 'default': 100,
    'section': ['', '<b><u>Bandcamp Player</u></b>']
  },*/
  'player_bandcamp_height': {
    'type': 'unsigned int', 'label': ' Height', 'title': 'Height of player in pixels\nMust be an integer (≥120)', 'size': 1, 'min': 120, 'default': 120,
    'section': ['', '<b><u>Bandcamp Player</u></b>']
  },
  /*  'player_bandcamp_border': {
    'type': 'unsigned int', 'label': ' Frame border', 'title': 'Frame border size', 'size': 1, 'min': 0, 'default': 0
  },*/
  'player_bandcamp_color': {
    'type': 'text', 'label': ' Link color', 'title': 'Color of the link, in RGB hex\nMust be a six-digit hexidecimal number', 'size': 3, 'default': '0687f5'
  },
  'player_bandcamp_backcolor': {
    'type': 'text', 'label': ' Background color', 'title': 'Color of the background, in RGB hex\nMust be a six-digit hexidecimal number', 'size': 3, 'default': 'ffffff'
  },
  'player_bandcamp_transparent': {
    'type': 'checkbox', 'label': 'Transparency', 'title': 'Allow transparency', 'default': true
  },
  /*  'player_bandcamp_artwork': {
    'type': 'select', 'options': ['small', 'big'], 'label': 'Artwork', 'title': 'Size of the artwork\nDefault is small - this cannot be changed', 'default': 'small', 'save': false
  },*/
  /*  'player_soundcloud_width': {
    'type': 'unsigned int', 'label': ' Width', 'title': 'Width of player in percentage\nMust be an integer (1-100)', 'size': 1, 'min': 1, 'default': 100,
    'section': ['', '<b><u>SoundCloud Player</u></b>']
  },*/
  'player_soundcloud_height': {
    'type': 'unsigned int', 'label': ' Height', 'title': 'Height of player in pixels\nMust be an integer (≥166)', 'size': 1, 'min': 166, 'default': 166,
    'section': ['', '<b><u>SoundCloud Player</u></b>']
  },
  'player_soundcloud_color': {
    'type': 'text', 'label': ' Color', 'title': 'Color of the play button, in RGB hex\nMust be a six-digit hexidecimal number', 'size': 3, 'default': 'ff5500'
  },
  /*  'player_soundcloud_border': {
    'type': 'checkbox', 'label': 'Frame border', 'title': 'Add frame border', 'default': false
  },*/
  'player_soundcloud_autoplay': {
    'type': 'checkbox', 'label': 'Autoplay', 'title': 'Autoplay on load', 'default': false
  },
  'player_soundcloud_hiderelated': {
    'type': 'checkbox', 'label': 'Hide related', 'title': 'Hide related playlist', 'default': true
  },
  'player_soundcloud_comments': {
    'type': 'checkbox', 'label': 'Show comments', 'title': 'Show comments', 'default': false
  },
  'player_soundcloud_user': {
    'type': 'checkbox', 'label': 'Show user', 'title': 'Show user', 'default': true
  },
  'player_soundcloud_reposts': {
    'type': 'checkbox', 'label': 'Show reposts', 'title': 'Show reposts\nThis cannot be changed', 'default': false, 'save': false
  },
  /*  'player_spotify_width': {
    'type': 'unsigned int', 'label': ' Width', 'title': 'Width of player in pixels\nMust be an integer', 'size': 1, 'min': 1, 'default': 300,
    'section': ['', '<b><u>Spotify Player</u></b>']
  },*/
  'player_spotify_height': {
    'type': 'unsigned int', 'label': ' Height', 'title': 'Height of player in pixels\nMust be an integer (≥80)', 'size': 1, 'min': 80, 'default': 80,
    'section': ['', '<b><u>Spotify Player</u></b>']
  },
  /*  'player_spotify_border': {
    'type': 'checkbox', 'label': 'Frame border', 'title': 'Add frame border', 'default': false
  },*/
  'player_spotify_transparent': {
    'type': 'checkbox', 'label': 'Transparency', 'title': 'Allow transparency', 'default': true
  }
};

var gmc_oinkplusplayers = new GM_configStruct(
  {
    'id': 'oinkplusEmbeddedPlayers',
    'title': 'OiNKPlus: Embedded Players Menu',
    'fields': oinkplusConfigFieldsPlayers,
    'css':  '.section_header { background: white   !important; color:  black       !important; border: 0px         !important; text-align: left    !important;} .field_label { font-weight: normal !important;}',
    'events':
    {
      'open': function() {
      },
      'save': function(values) {
        valuesSaved = true;
      },
      'close': function(values) {
        gmc_oinkplusplayers.close();
      }
    }
  });
gmc_oinkplusplayers.init();

var oinkplusConfigFieldsAdvSettings = {
  'oinkplus_css_code': {
    'label': '<b>OiNKPlus CSS Code</b>', 'type': 'textarea', 'rows': 8, 'cols': 96,
    'default': '.OinkPlus { position:relative; max-width:1300px; }\n.explore  { text-decoration:none; }\n.leftinfo {clear:both;}\n.floatright { border: solid #000000 0px;float:right;margin:0pt 0pt 10px 10px;padding:2px;text-align: left;}\n.floatleft { border: solid #000000 0px;float:left;text-align: left; width:140px;  }\n.floatleft-small { border: solid #000000 0px;float:left;text-align: left;   }\n.floatmiddle { border: solid #000000 0px;text-align: left; margin-left:140px;} ',
    'section': ['', '<b><u>CSS / Basic Layout</u></b>']
  },
  'oinkplus_basic_layout': {
    'label': '<b>OiNKPlus Basic Layout</b>', 'type': 'textarea', 'rows': 24, 'cols': 96,
    'default': '<div id="OinkPlus" class="OinkPlus"><div class="floatleft"><h2><div id="ArtistName"></div></h2>  \n <div id="toggleLastFMSimilar"></div>&nbsp;<b>Similar artists:</b><br>    \n <div id="LastFMSimilar"></div>   \n <br> \n <div id="toggleHistory"></div>&nbsp;<b>Browsing History:</b><br>    \n <div id="History"></div><br>   \n </div>          \n <div id="artistinfo" class="floatmiddle">\n <div class="floatright"> \n <div id="ArtistSearchField"></div><br>     \n <div id="ArtistImage"></div><br>   \n </div><div id="ArtistTitle"></div><div class="floatleft-small"><img src="%tagicon%" style="vertical-align:bottom; margin-top:5px; margin-right:5px; !important;" > </div>      \n <div id="LastFMTags"></div><br>    \n <div id="toggleLastFMBio"></div>&nbsp;<b>Abstract:</b><br>       \n <div id="LastFMBio"></div><br>      \n <b>Trackers :</b><br>      \n <div id="HydraLinks"></div><br>   \n <b>Sites:</b><br>      \n <div id="ExternalLinks"></div><br>\n</div>       \n <div id="UpdateNotify" class="leftinfo"></div>   \n </div> '
  },
  'oinkplus_link_position': {
    'type': 'select', 'options': ['center', 'right'], 'label': ' Tracker/Site link position',
    'title': 'The column the tracker/external site link icons will be displayed\nThis setting does not actually set where they appear; it only determines how many should be placed on each row, based on the column width',
    'default': 'center'
  },
  'oinkplus_icon_plustype': {
    'label': '<b>Plus Toggle icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'gif',
    'section': ['', '<b><u>Icon Images</u></b>']
  },
  'oinkplus_icon_plusdata': {
    'title': 'Plus Toggle icon base64-encoded image', 'type': 'textarea', 'rows': 1, 'cols': 96,
    'default': 'R0lGODlhCQAJAIAAAOLn7UtjfCwAAAAACQAJAAACEYyPoAu28aCSDSJLc44s3lMAADs%3D'
  },
  'oinkplus_icon_minustype': {
    'label': '<b>Minus Toggle icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'gif'
  },
  'oinkplus_icon_minusdata': {
    'title': 'Minus Toggle icon base64-encoded image', 'type': 'textarea', 'rows': 1, 'cols': 96,
    'default': 'R0lGODlhCQAJAIAAAOLn7UtjfCwAAAAACQAJAAACEIyPoAvG614L80x5ZXyohwIAOw%3D%3D'
  },
  'oinkplus_icon_spinnertype': {
    'label': '<b>Spinner icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'gif'
  },
  'oinkplus_icon_spinnerdata': {
    'title': 'Spinner icon base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'R0lGODlhEAAQAPMAAP%2F%2F%2FwAAAAAAAIKCgnJycqioqLy8vM7Ozt7e3pSUlOjo6GhoaAAAAAAAAAAAAAAAACH%2FC05FVFNDQVBFMi4wAwEAAAAh%2FhpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh%2BQQJCgAAACwAAAAAEAAQAAAEKxDISau9OE%2FBu%2F%2FcQBTGgWDhWJ5XSpqoIL6s5a7xjLeyCvOgIEdDLBqPlAgAIfkECQoAAAAsAAAAABAAEAAABCsQyEmrvThPwbv%2FXJEMxIFg4VieV0qaqCC%2BrOWu8Yy3sgrzoCBHQywaj5QIACH5BAkKAAAALAAAAAAQABAAAAQrEMhJq704T8G7%2F9xhFMlAYOFYnldKmqggvqzlrvGMt7IK86AgR0MsGo%2BUCAAh%2BQQJCgAAACwAAAAAEAAQAAAEMRDISau9OE%2FBu%2F%2BcghxGkQyEFY7lmVYraaKqIMpufbc0bLOzFyXGE25AyI5myWw6KREAIfkECQoAAAAsAAAAABAAEAAABDYQyEmrvThPwbv%2FnKQgh1EkA0GFwFie6SqIpImq29zWMC6xLlssR3vdZEWhDwBqejTQqHRKiQAAIfkECQoAAAAsAAAAABAAEAAABDYQyEmrvThPwbv%2FHKUgh1EkAyGF01ie6SqIpImqACu5dpzPrRoMpwPwhjLa6yYDOYuaqHRKjQAAIfkECQoAAAAsAAAAABAAEAAABDEQyEmrvThPwbv%2FnKUgh1EkAxFWY3mmK9WaqCqIJA3fbP7aOFctNpn9QEiPZslsOikRACH5BAkKAAAALAAAAAAQABAAAAQrEMhJq704T8G7%2FxymIIexEOE1lmdqrSYqiGTsVnA7q7VOszKQ8KYpGo%2FICAAh%2BQQJCgAAACwAAAAAEAAQAAAEJhDISau9OE%2FBu%2F%2BcthBDEmZjeWKpKYikC6svGq9XC%2B6e5v%2FAICUCACH5BAkKAAAALAAAAAAQABAAAAQrEMhJq704T8G7%2Fxy2EENSGOE1lmdqrSYqiGTsVnA7q7VOszKQ8KYpGo%2FICAAh%2BQQJCgAAACwAAAAAEAAQAAAEMRDISau9OE%2FBu%2F%2BctRBDUhgHElZjeaYr1ZqoKogkDd9s%2Fto4Vy02mf1ASI9myWw6KREAIfkECQoAAAAsAAAAABAAEAAABDYQyEmrvThPwbv%2FHLUQQ1IYByKF01ie6SqIpImqACu5dpzPrRoMpwPwhjLa6yYDOYuaqHRKjQAAIfkECQoAAAAsAAAAABAAEAAABDYQyEmrvThPwbv%2FnLQQQ1IYB0KFwFie6SqIpImq29zWMC6xLlssR3vdZEWhDwBqejTQqHRKiQAAIfkECQoAAAAsAAAAABAAEAAABDEQyEmrvThPwbv%2F3EIMSWEciBWO5ZlWK2miqiDKbn23NGyzsxclxhNuQMiOZslsOikRADsAAAAAAAAAAAA%3D'
  },
  'oinkplus_icon_searchtype': {
    'label': '<b>Search icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'gif'
  },
  'oinkplus_icon_searchdata': {
    'title': 'Search icon base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'R0lGODlhDgAOANUAAPr6%2Bri4uPLy8vz8%2FMbGxtjY2Pf3997e3vv7%2B9bW1rq6utPT07u7u7S0tLKystzc3NDQ0MPDw7CwsO%2Fv783NzczMzNTU1PT09NXV1ezs7LW1tc%2FPz7Ozs%2FPz86mpqevr6%2Fb29v39%2Fbm5uf7%2B%2Fqampv%2F%2F%2FwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAAAAAALAAAAAAOAA4AAAZvwJJwSCwOB6GRcmm0MDwMzMVYIpCuV0KnuCCJEp9EgLQoikgFA8BQ8I6IHlInVAp1SB768PwYPrwDRBAkCgcABwokFHpCGRFYWA4gRAgfGwEeARUOJA2TQiMIIAITAh0fDSQanyVvRAAfHBICVFRBADs%3D'
  },
  'oinkplus_icon_exploretype': {
    'label': '<b>Explore Similar icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'oinkplus_icon_exploredata': {
    'title': 'Explore Similar icon base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABGdBTUEAAK%2FINwWK6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAAASAAAAEgARslrPgAAAOFJREFUOMvVUqFuw1AMvE7VpHxAQHDA0Da4gf5DUL4kLN%2FzWFDQAwNT2camRQMJHA0NsC9O3lCrri3oFtSTLFuWfD75vAohYAluFk1fH0FZli9FUdz%2Bm0BVNyLyddhbhRDgnAsAYGYwM5AESagqVBUiAlVFHMcgia7rPp1zjwCw3jGlaYp5njFN068ws5M8DMNDlmXvdV0%2FrQ837wiOh47rcRxBctwrMDM0TXNWtohARBBFEZIkQd%2F3aNv2w3u%2F2d%2FgEuR5%2FkzyleS39%2F7uzy5UVfVGcmtm9ycuLMGVvfI5%2FADcE8BIG7ekhwAAACJ6VFh0U29mdHdhcmUAAHjac0zJT0pV8MxNTE8NSk1MqQQAL5wF1K4MqU0AAAAASUVORK5CYII%3D'
  },
  'oinkplus_icon_tagtype': {
    'label': '<b>Tag icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'oinkplus_icon_tagdata': {
    'title': 'Tag icon base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAAA4AAAAJCAYAAAACTR1pAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJlJREFUeNpi%2FP%2F%2FPwMMMHUcqwNSjQyEwT5GmEaopnAgPgfE3whoTGNC1sTJwnRhQ7CGIRE2MrDANEnzsl3ZGa7lqCXCJQnkHyWkkQnqp3O5xpJSUE1EAZDGJiA2mnz2%2BdNrb749J1rjvwqreiC95unnX7qmCy7t3Xr3%2FTViNCKHKsjJIUB8Boh%2FEApVRrR4BGmuI8LCHQABBgC0YDp2HRMWcAAAAABJRU5ErkJggg%3D%3D'
  },
  'oinkplus_icon_similartype': {
    'label': '<b>Highlighted Similar Artist icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'],
    'default': 'png'
  },
  'oinkplus_icon_similardata': {
    'title': 'Highlighted Similar Artist icon base64-encoded image\nAppended to highlighted similar artists if enabled\nDefault image is a checkmark',
    'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHISURBVChTVZHdS1oBGMbPfzBqRLsRWjCIDt3vwsL1cSKzIqIaUuqy0s6CIizTzmpizhs3yciojVoXx0N0IbHNIipYZASLirQIImksK+ysTh8Yp6AnlSbsuXlvfvweeF6CeMwrVRepMrs40/B3ocM9C/qjV6g2OLliFUP+YxK3QG2usrNL4mTgFi7/Nd75eOg9v6EcCaKSYcVcpaEiAcaNlomf4ujaLWyLV2j3RlA3HkKRYwM53YuQ9c0hjx6KUuq+LOK10cU5V0QYZy6h5U6gcO/hhWkVKc0+mLlNLAXDoIwsSnVWltB9+ibQXgE1X48gc+4irX0ZT5p8oL/8QuCAh2chgMxaOwqb+nmixv4DJSOH8KydY3rjFE/1M1AO+BE6vsDCeghkvQOSUiPyVAyI8t4pgbRuY37nDPcA5reOEf57ja39E7zUuRJgBkWDamB4Qt7q4NJj1c/ezmJ5N4Ib8Q5h/hIlhs9JMFuuR5nuPUsUNzKktG1MTNVM4rl2Av7gH2hsXAzsShgzC7Qo1JijiubYGvHEd5S1uqMZdYOQVNmSYLa8JV4fldZ2Kv57DKU2ZZXRH7j8RiufW9+DojcMX95iYZPGGP0AZecJAEoHq2IAAAAASUVORK5CYII='
  },
  'open_online_base64': {
    'label': 'Base64 Encoder', 'title': 'Click to open an online Base64 encoding page in a new tab:\nMotobit Software\'s Online Base64 decoder and encoder\nOther images can be used instead of the default images - click the Base64 Encoder button below, upload/convert image, and copy/paste code into this box (change the image type to match if necessary)', 'type': 'button',
    'click': function() {
      GM_openInTab('http://www.motobit.com/util/base64-decoder-encoder.asp', false);
    }
  },
  'oinkplus_var_apikey': {
    'label': 'API Key',
    'title': 'The variable to be replaced with the API Key in Last.fm API Call URLs\nChanging this setting WILL NOT change the API Call URL settings - they must also be manually updated if this is changed',
    'type': 'text', 'size': 12, 'default': '%APIKEY%', 'section': ['', '<b><u>URL Variables</u></b>']
  },
  'oinkplus_var_artist': {
    'label': 'Artist',
    'title': 'The variable to be replaced with the searched Artist in search URLs\nChanging this setting WILL NOT change the search URL settings - they must also be manually updated if this is changed',
    'type': 'text', 'size': 12, 'default': '%ARTIST%'
  },
  'oinkplus_var_album': {
    'label': 'Album',
    'title': 'The variable to be replaced with the searched Album in search URLs\nChanging this setting WILL NOT change the search URL settings - they must also be manually updated if this is changed',
    'type': 'text', 'size': 12, 'default': '%ALBUM%'
  },
  'oinkplus_var_tag': {
    'label': 'Tag',
    'title': 'The variable to be replaced with the searched Tag in search URLs\nChanging this setting WILL NOT change the search URL settings - they must also be manually updated if this is changed',
    'type': 'text', 'size': 12, 'default': '%TAG%'
  },
  'lastfm_artist_url': {
    'label': 'Artist', 'title': 'The URL for the artist on Last.fm\nReplace the artist name with the Artist variable (default is %ARTIST%)', 'type': 'text', 'size': 72,
    'default': 'http://www.last.fm/music/%ARTIST%', 'section': ['', '<b><u>Last.fm URLs</u></b>']
  },
  'lastfm_bio_url': {
    'label': 'Biography URL', 'title': 'The URL for the biography on Last.fm\nReplace the artist name with the Artist variable (default is %ARTIST%)', 'type': 'text',
    'size': 72, 'default': 'http://www.last.fm/music/%ARTIST%/%2bwiki'
  },
  'lastfm_bio_link': {
    'label': 'Biography Link', 'title': 'The link for the biography on Last.fm\nReplace the artist name with the Artist variable (default is %ARTIST%)', 'type': 'text',
    'size': 72, 'default': '<a href="http://www.last.fm/music/%ARTIST%/%2bwiki" target="_blank">read more</a>'
  },
  'lastfm_gallery_url': {
    'label': 'Gallery', 'title': 'The URL for the image gallery on Last.fm\nReplace the artist name with the Artist variable (default is %ARTIST%)', 'type': 'text',
    'size': 72, 'default': 'http://www.last.fm/music/%ARTIST%/+images'
  },
  'lastfm_info_url': {
    'label': 'getInfo', 'title': 'The URL for the getInfo API API Call on Last.fm\nReplace the artist name and API key with the Artist and API Key variables (default is %ARTIST% and %APIKEY%)',
    'type': 'text', 'size': 96, 'default': 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=%ARTIST%&api_key=%APIKEY%'
  },
  'lastfm_tags_url': {
    'label': 'getTopTags', 'title': 'The URL for the getTopTags API Call on Last.fm\nReplace the artist name and API key with the Artist and API Key variables (default is %ARTIST% and %APIKEY%)',
    'type': 'text', 'size': 96, 'default': 'http://ws.audioscrobbler.com/2.0/?method=artist.getTopTags&artist=%ARTIST%&api_key=%APIKEY%'
  },
  'lastfm_similar_url': {
    'label': 'getSimilar', 'title': 'The URL for the getSimilar API Call on Last.fm\nReplace the artist name and API key with the Artist and API Key variables (default is %ARTIST% and %APIKEY%)',
    'type': 'text', 'size': 96, 'default': 'http://ws.audioscrobbler.com/2.0/?method=artist.getSimilar&artist=%ARTIST%&api_key=%APIKEY%'
  },
  'lastfm_albums_url': {
    'label': 'getTopAlbums', 'title': 'The URL for the getTopAlbums API Call on Last.fm\nReplace the artist name and API key with the Artist and API Key variables (default is %ARTIST% and %APIKEY%)',
    'type': 'text', 'size': 96, 'default': 'http://ws.audioscrobbler.com/2.0/?method=artist.getTopAlbums&artist=%ARTIST%&api_key=%APIKEY%'
  },
  'resourceLoadTimeout': {
    'label': 'Timeout', 'title': 'Time in milliseconds to wait before timing out loading Last.fm resources\nMust be a positive integer', 'type': 'unsigned int',
    'size': 8, 'min': 1, 'default': 10000, 'section': ['', '<b><u>Other Variables</u></b>']
  },
  'oinkplus_debug': {
    'type': 'checkbox', 'label': 'Debug mode', 'title': 'Logs various status messages to the console', 'default': false
  }
};

var gmc_oinkplusadvsettings = new GM_configStruct(
  {
    'id': 'oinkplusAdvSettingsMenu',
    'title': 'OiNKPlus Advanced Settings Menu',
    'fields': oinkplusConfigFieldsAdvSettings,
    'css':  '.section_header { background: white   !important; color:  black       !important; border: 0px         !important; text-align: left    !important;} .field_label { font-weight: normal !important;}',
    'events':
    {
      'save': function(values) {
        valuesSaved = true;
      },
      'close': function(values) {
        gmc_oinkplusadvsettings.close();
      }
    }
  });
gmc_oinkplusadvsettings.init();

var oinkplusConfigFieldsTrackersAdvanced = {
  'tracker_ArenaBG_name': {
    'label': '<b>Name</b>', 'title': 'ArenaBG', 'type': 'text', 'size': 16, 'default': 'ArenaBG', 'section': ['', '<b><u>ArenaBG Settings</u></b>']
  },
  'tracker_ArenaBG_version': {
    'label': '<b>Version</b>', 'type': 'text', 'size': 1, 'default': '0'
  },
  'tracker_ArenaBG_addtosite': {
    'type': 'checkbox', 'label': 'Add OiNKPlus', 'title': 'Add the OiNKPlus box to torrent/artist pages on this tracker', 'default': false
  },
  'tracker_ArenaBG_isGazelle': {
    'type': 'checkbox', 'label': 'Gazelle', 'title': 'Tracker is Gazelle-based', 'default': false
  },
  'tracker_ArenaBG_url': {
    'label': '<b>Match pattern</b>', 'title': 'Regex pattern to match artist/music release pages:', 'type': 'text', 'size': 48, 'default': 'arenabg\\.(com|ch)/torrent-download'
  },
  'tracker_ArenaBG_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'Tracker link search URL\nReplace the searchTerms with the Artist variable (default is %ARTIST%)', 'type': 'text', 'size': 48,
    'default': 'http://arenabg.com/en/torrents/%ARTIST%'
  },
  'tracker_ArenaBG_tagurl': {
    'label': '<b>Tag Link</b>', 'title': 'Tracker tag link search URL\nReplace the searchTerms with the Tag variable (default is %TAG%)', 'type': 'text', 'size': 48, 'default': ''
  },
  'tracker_ArenaBG_tagreplace': {
    'label': '<b>Tag Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'tracker_ArenaBG_morelink': {
    'label': '<b>More link</b>', 'type': 'text', 'size': 48, 'default': ''
  },
  'tracker_ArenaBG_css': {
    'label': '<b>CSS</b>', 'type': 'textarea', 'rows': 1, 'cols': 40, 'default': ''
  },
  'tracker_ArenaBG_isAudioRelease': {
    'label': '<b>isAudioRelease</b>', 'type': 'textarea', 'rows': 1, 'cols': 12,  'default': 'return false;'
  },
  'tracker_ArenaBG_hook': {
    'label': '<b>hook</b>', 'type': 'textarea', 'rows': 1, 'cols': 12, 'default': 'return null;'
  },
  'tracker_ArenaBG_findArtist': {
    'label': '<b>findArtist</b>', 'type': 'textarea', 'rows': 1, 'cols': 12, 'default': 'return null;'
  },
  'tracker_ArenaBG_findAlbum': {
    'label': '<b>findAlbum</b>', 'type': 'textarea', 'rows': 1, 'cols': 12, 'default': 'return null;'
  },
  'tracker_ArenaBG_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'tracker_ArenaBG_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6REQ5QUYzNTJENUU3MTFFMzlDMUJCMTk5NjZCMjdERTUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6REQ5QUYzNTNENUU3MTFFMzlDMUJCMTk5NjZCMjdERTUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpERDlBRjM1MEQ1RTcxMUUzOUMxQkIxOTk2NkIyN0RFNSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpERDlBRjM1MUQ1RTcxMUUzOUMxQkIxOTk2NkIyN0RFNSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoYQdfgAAAdHSURBVHjaxFd7jFTV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'
  },
  'tracker_DEEPBASSNiNE_name': {
    'label': '<b>Name</b>', 'title': 'DEEPBASSNiNE', 'type': 'text', 'size': 16, 'default': 'DEEPBASSNiNE', 'section': ['', '<b><u>DEEPBASSNiNE Settings</u></b>']
  },
  'tracker_DEEPBASSNiNE_version': {
    'label': '<b>Version</b>', 'type': 'text', 'size': 1, 'default': '1'
  },
  'tracker_DEEPBASSNiNE_addtosite': {
    'type': 'checkbox', 'label': 'Add OiNKPlus', 'title': 'Add the OiNKPlus box to torrent/artist pages on this tracker', 'default': true
  },
  'tracker_DEEPBASSNiNE_isGazelle': {
    'type': 'checkbox', 'label': 'Gazelle', 'title': 'Tracker is Gazelle-based', 'default': true
  },
  'tracker_DEEPBASSNiNE_url': {
    'label': '<b>Match pattern</b>', 'title': 'Regex pattern to match artist/release pages', 'type': 'text', 'size': 48,
    'default': 'deepbassnine\\.com/(artist|torrents)\\.php(\\?|\\?page=\\d+&)id='
  },
  'tracker_DEEPBASSNiNE_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'Tracker link search URL\nReplace the searchTerms with the Artist variable (default is %ARTIST%)', 'type': 'text', 'size': 48,
    'default': 'https://www.deepbassnine.com/artist.php?artistname=%ARTIST%'
  },
  'tracker_DEEPBASSNiNE_tagurl': {
    'label': '<b>Tag Link</b>', 'title': 'Tracker tag link search URL\nReplace the searchTerms with the Tag variable (default is %TAG%)', 'type': 'text', 'size': 48,
    'default': '/torrents.php?taglist=%TAG%'
  },
  'tracker_DEEPBASSNiNE_tagreplace': {
    'label': '<b>Tag Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': '/[ \\-\\/]/g, \'.\''
  },
  'tracker_DEEPBASSNiNE_morelink': {
    'label': '<b>More link</b>', 'title': 'Artist search linked to artist name heading text\nRedundant on Gazelle trackers', 'type': 'text', 'size': 48,
    'default': '/torrents.php?artistname=%ARTIST%'
  },
  'tracker_DEEPBASSNiNE_css': {
    'label': '<b>CSS</b>', 'type': 'textarea', 'rows': 3, 'cols': 40,
    'default': '.artistHeadline {font-size: 10pt;text-align:left;} \nfont-size: 10pt !important;}'
  },
  'tracker_DEEPBASSNiNE_isAudioRelease': {
    'label': '<b>isAudioRelease</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'var tds = document.getElementsByTagName(\'td\');\nfor (var i = 0, len = tds.length; i < len; i++){\n  if (tds[i].className == \'heading\' && tds[i].textContent.match(new RegExp(\'Type\'))){\n    typeFieldContent = tds[i].nextSibling.textContent;\n    if (typeFieldContent.match(new RegExp(\'(Apps|Comics|E-books|E-learning videos)\')))\n      return false;\n    break;\n  }\n}\nreturn true;'
  },
  'tracker_DEEPBASSNiNE_hook': {
    'label': '<b>hook</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'var divs = document.querySelectorAll(\'.head\');\nvar centertable;\nfor (var i = 0, len = divs.length; i < len; i++) {\n  if (new RegExp(\'(Artist|Album|EP|Anthology|Compilation|Single|Mixtape/Live|Remix|Bootleg|Unknown) info\').test(divs[i].innerHTML)) {\n    centertable = divs[i].parentNode;\n    break;\n  }\n}\nhook = centertable.lastChild.previousSibling;\nmyDiv = document.createElement(\'div\');\nmyDiv.className = \'box\';\nmyHeadline = document.createElement(\'div\');\ntoggleDiv = document.createElement(\'div\');\ntoggleDiv.id = \'toggleOiNKPlus\';\nmyHeadline.appendChild(toggleDiv);\nmyHeadline.appendChild(document.createTextNode(\' \'));\nmyBoldText = document.createElement(\'b\');\nmyBoldText.textContent = \'OiNKPlus\';\nmyHeadline.appendChild(myBoldText);\nmyHeadline.className=\'head\';\nmyDiv.appendChild(myHeadline);\nmyNode = document.createElement(\'div\');\nmyNode.className = \'OiNK\';\nmyNode.innerHTML = \'<div id="OiNKPlus"></div>\';\nmyDiv.appendChild(myNode);\nhook.parentNode.appendChild(myDiv);\nseperator = document.createElement(\'div\');\nseperator.setAttribute(\'style\',\'clear: both\');\nhook.parentNode.insertBefore(seperator, myDiv.nextSibling);'
  },
  'tracker_DEEPBASSNiNE_findArtist': {
    'label': '<b>findArtist</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'var h2s = document.getElementsByTagName(\'h2\');\nif (h2s.length > 0) {\n  var str = h2s[0].textContent;\n  str = str.replace(/\\[[^\\]]*\\]/g, \'\');\n  if (str.split(\' - \').length > 1) {\n    return str.split(\' - \')[0].replace(/^\\s+|\\s+$/g, \'\');\n  }\n  else return str.replace(/^\\s+|\\s+$/g, \'\');\n}\nreturn \'\';'
  },
  'tracker_DEEPBASSNiNE_findAlbum': {
    'label': '<b>findAlbum</b>:', 'type': 'textarea', 'rows': 1, 'cols': 12, 'default': 'return null;'
  },
  'tracker_DEEPBASSNiNE_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'tracker_DEEPBASSNiNE_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': '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'
  },
  'tracker_indietorrents_name': {
    'label': '<b>Name</b>', 'title': 'indietorrents', 'type': 'text', 'size': 16, 'default': 'indietorrents', 'section': ['', '<b><u>indietorrents Settings</u></b>']
  },
  'tracker_indietorrents_version': {
    'label': '<b>Version</b>', 'type': 'text', 'size': 1, 'default': '1'
  },
  'tracker_indietorrents_addtosite': {
    'type': 'checkbox', 'label': 'Add OiNKPlus', 'title': 'Add the OiNKPlus box to torrent/artist pages on this tracker', 'default': true
  },
  'tracker_indietorrents_isGazelle': {
    'type': 'checkbox', 'label': 'Gazelle', 'title': 'Tracker is Gazelle-based', 'default': true
  },
  'tracker_indietorrents_url': {
    'label': '<b>Match pattern</b>', 'title': 'Regex pattern to match artist/release pages', 'type': 'text', 'size': 48,
    'default': 'indietorrents\\.com/(artist|torrents)\\.php(\\?|\\?page=\\d+&)id='
  },
  'tracker_indietorrents_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'Tracker link search URL\nReplace the searchTerms with the Artist variable (default is %ARTIST%)', 'type': 'text', 'size': 48,
    'default': 'https://indietorrents.com/artist.php?artistname=%ARTIST%'
  },
  'tracker_indietorrents_tagurl': {
    'label': '<b>Tag Link</b>', 'title': 'Tracker tag link search URL\nReplace the searchTerms with the Tag variable (default is %TAG%)', 'type': 'text', 'size': 48,
    'default': '/torrents.php?taglist=%TAG%'
  },
  'tracker_indietorrents_tagreplace': {
    'label': '<b>Tag Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': '/[ \\-\\/]/g, \'.\''
  },
  'tracker_indietorrents_morelink': {
    'label': '<b>More link</b>', 'title': 'Artist search linked to artist name heading text\nRedundant on Gazelle trackers', 'type': 'text', 'size': 48,
    'default': '/artist.php?artistname=%ARTIST%'
  },
  'tracker_indietorrents_css': {
    'label': '<b>CSS</b>', 'type': 'textarea', 'rows': 3, 'cols': 40,
    'default': '.artistHeadline {font-size: 10pt;text-align:left;} \nfont-size: 10pt !important;}'
  },
  'tracker_indietorrents_isAudioRelease': {
    'label': '<b>isAudioRelease</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'var tds = document.getElementsByTagName(\'td\');\nfor (var i = 0, len = tds.length; i < len; i++) {\n  if (tds[i].className == \'heading\' && tds[i].textContent.match(new RegExp(\'Type\'))) {\n    typeFieldContent = tds[i].nextSibling.textContent;\n    if (typeFieldContent.match(new RegExp(\'(Apps|Comics|E-books|E-learning videos)\')))\n      return false;\n    break;\n  }\n}\nreturn true;'
  },
  'tracker_indietorrents_hook': {
    'label': '<b>hook</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'var divs = document.getElementsByTagName(\'div\');\nvar centertable;\nfor (var i = 0, len = divs.length; i < len; i++){\n  if (divs[i].className == \'main_column\') {\n    centertable = divs[i];\n    break;\n  }\n}\nhook = centertable.firstChild.nextSibling.nextSibling.nextSibling;\nmyDiv = document.createElement(\'div\');\nmyDiv.className = \'box\';\nmyHeadline = document.createElement(\'div\');\ntoggleDiv = document.createElement(\'div\');\ntoggleDiv.id = \'toggleOiNKPlus\';\nmyHeadline.appendChild(toggleDiv);\nmyHeadline.appendChild(document.createTextNode(\' \'));\nmyBoldText = document.createElement(\'b\');\nmyBoldText.textContent = \'OiNKPlus\';\nmyHeadline.appendChild(myBoldText);\nmyHeadline.className=\'head\';\nmyDiv.appendChild(myHeadline);\nmyNode = document.createElement(\'div\');\nmyNode.className = \'OiNK\';\nmyNode.innerHTML = \'<div id="OiNKPlus"></div>\';\nmyDiv.appendChild(myNode);\nhook.parentNode.insertBefore(myDiv, hook.nextSibling);\nseperator = document.createElement(\'div\');\nseperator.setAttribute(\'style\',\'clear: both\');\nhook.parentNode.insertBefore(seperator, myDiv.nextSibling);'
  },
  'tracker_indietorrents_findArtist': {
    'label': '<b>findArtist</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'var h2s = document.getElementsByTagName(\'h2\');\nif (h2s.length > 0) {\n  var str = h2s[1].textContent;\n  str = str.replace(/\\[[^\\]]*\\]/g, \'\');\n    if (str.split(\' - \').length > 1)\n      return str.split(\' - \')[0].replace(/^\\s+|\\s+$/g, \'\');\n    else return str.replace(/^\\s+|\\s+$/g, \'\');\n}\nreturn \'\';'
  },
  'tracker_indietorrents_findAlbum': {
    'label': '<b>findAlbum</b>:', 'type': 'textarea', 'rows': 1, 'cols': 12, 'default': 'return null;'
  },
  'tracker_indietorrents_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'tracker_indietorrents_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': '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'
  },
  'tracker_JPopsuki_name': {
    'label': '<b>Name</b>', 'title': 'JPopsuki', 'type': 'text', 'size': 16, 'default': 'JPopsuki', 'section': ['', '<b><u>JPopsuki Settings</u></b>']
  },
  'tracker_JPopsuki_version': {
    'label': '<b>Version</b>', 'type': 'text', 'size': 1, 'default': '1'
  },
  'tracker_JPopsuki_addtosite': {
    'type': 'checkbox', 'label': 'Add OiNKPlus', 'title': 'Add the OiNKPlus box to torrent/artist pages on this tracker', 'default': true
  },
  'tracker_JPopsuki_isGazelle': {
    'type': 'checkbox', 'label': 'Gazelle', 'title': 'Tracker is Gazelle-based', 'default': true
  },
  'tracker_JPopsuki_url': {
    'label': '<b>Match pattern</b>', 'title': 'Regex pattern to match artist/release pages', 'type': 'text', 'size': 48,
    'default': 'jpopsuki\\.eu/(artist|torrents)\\.php(\\?|\\?page=\\d+&)id='
  },
  'tracker_JPopsuki_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'Tracker link search URL\nReplace the searchTerms with the Artist variable (default is %ARTIST%)',
    'type': 'text', 'size': 48, 'default': 'https://jpopsuki.eu/artist.php?name=%ARTIST%'
  },
  'tracker_JPopsuki_tagurl': {
    'label': '<b>Tag Link</b>', 'title': 'Tracker tag link search URL\nReplace the searchTerms with the Tag variable (default is %TAG%)',
    'type': 'text', 'size': 48, 'default': '/torrents.php?searchtags=%TAG%'
  },
  'tracker_JPopsuki_tagreplace': {
    'label': '<b>Tag Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': '/[ \\-\\/]/g, \'.\''
  },
  'tracker_JPopsuki_morelink': {
    'label': '<b>More link</b>', 'title': 'Artist search linked to artist name heading text\nRedundant on Gazelle trackers', 'type': 'text', 'size': 48,
    'default': '/artist.php?name=%ARTIST%'
  },
  'tracker_JPopsuki_css': {
    'label': '<b>CSS</b>', 'type': 'textarea', 'rows': 3, 'cols': 40,
    'default': '.artistHeadline {font-size: 10pt;text-align:left;} \nfont-size: 10pt !important;}'
  },
  'tracker_JPopsuki_isAudioRelease': {
    'label': '<b>isAudioRelease</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'var tds = document.getElementsByTagName(\'td\');\nfor (var i = 0, len = tds.length; i < len; i++) {\n  if (tds[i].className == \'heading\' && tds[i].textContent.match(new RegExp(\'Type\'))) {\n    typeFieldContent = tds[i].nextSibling.textContent;\n    if (typeFieldContent.match(new RegExp(\'(Apps|Comics|E-books|E-learning videos)\')))\n      return false;\n    break;\n  }\n}\nreturn true;'
  },
  'tracker_JPopsuki_hook': {
    'label': '<b>hook</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'var divs = document.getElementsByTagName(\'div\');\nvar centertable;\nfor (var i = 0, len = divs.length; i < len; i++) {\n  if (divs[i].className == \'main_column\') {\n    centertable =  divs[i];\n    break;\n  }\n}\nhook = centertable.firstChild.nextSibling.nextSibling.nextSibling;\nmyDiv = document.createElement(\'div\');\nmyDiv.className = \'box\';\nmyHeadline = document.createElement(\'div\');\ntoggleDiv = document.createElement(\'div\');\ntoggleDiv.id = \'toggleOiNKPlus\';\nmyHeadline.appendChild(toggleDiv);\nmyHeadline.appendChild(document.createTextNode(\' \'));\nmyBoldText = document.createElement(\'b\');\nmyBoldText.textContent = \'OiNKPlus\';\nmyHeadline.appendChild(myBoldText);\nmyHeadline.className=\'head\';\nmyDiv.appendChild(myHeadline);\nmyNode = document.createElement(\'div\');\nmyNode.className = \'OiNK\';\nmyNode.innerHTML = \'<div id="OiNKPlus"></div>\';\nmyDiv.appendChild(myNode);\nhook.parentNode.insertBefore(myDiv, hook.nextSibling);\nseperator = document.createElement(\'div\');\nseperator.setAttribute(\'style\',\'clear: both\');\nhook.parentNode.insertBefore(seperator, myDiv.nextSibling);'
  },
  'tracker_JPopsuki_findArtist': {
    'label': '<b>findArtist</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'var h2s = document.getElementsByTagName(\'h2\');\nif (h2s.length > 0) {\n  var str = h2s[0].textContent;\n  str = str.replace(/\\[[^\\]]*\\]/g, \'\');\n  if (str.split(\' - \').length > 1)\n    return str.split(\' - \')[0].replace(/^\\s+|\\s+$/g, \'\');\n  else return str.replace(/^\\s+|\\s+$/g, \'\');\n}\nreturn \'\';'
  },
  'tracker_JPopsuki_findAlbum': {
    'label': '<b>findAlbum</b>:', 'type': 'textarea', 'rows': 1, 'cols': 12, 'default': 'return null;'
  },
  'tracker_JPopsuki_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'tracker_JPopsuki_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': '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'
  },
  'tracker_Karagarga_name': {
    'label': '<b>Name</b>', 'title': '', 'type': 'text', 'size': 16, 'default': 'Karagarga', 'section': ['', '<b><u>Karagarga Settings</u></b>'],
  },
  'tracker_Karagarga_version': {
    'label': '<b>Version</b>', 'type': 'text', 'size': 1, 'default': '1'
  },
  'tracker_Karagarga_addtosite': {
    'type': 'checkbox', 'label': 'Add OiNKPlus', 'title': 'Add the OiNKPlus box to torrent/artist pages on this tracker', 'default': true
  },
  'tracker_Karagarga_isGazelle': {
    'type': 'checkbox', 'label': 'Gazelle', 'title': 'Tracker is Gazelle-based', 'default': false
  },
  'tracker_Karagarga_url': {
    'label': '<b>Match pattern</b>', 'title': 'Regex pattern to match artist/release pages', 'type': 'text', 'size': 48, 'default': 'karagarga\\.in/details\\.php'
  },
  'tracker_Karagarga_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'Tracker link search URL\nReplace the searchTerms with the Artist variable (default is %ARTIST%)', 'type': 'text', 'size': 48,
    'default': 'https://karagarga.in/browse.php?search=%ARTIST%&search_type=director&cat=2'
  },
  'tracker_Karagarga_tagurl': {
    'label': '<b>Tag Link</b>', 'title': 'Tracker tag link search URL\nReplace the searchTerms with the Tag variable (default is %TAG%)', 'type': 'text', 'size': 48, 'default': ''
  },
  'tracker_Karagarga_tagreplace': {
    'label': '<b>Tag Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'tracker_Karagarga_morelink': {
    'label': '<b>More link</b>', 'title': 'Artist search linked to artist name heading text\nRedundant on Gazelle trackers', 'type': 'text', 'size': 48,
    'default': '/browse.php?dirsearch=%ARTIST%'
  },
  'tracker_Karagarga_css': {
    'label': '<b>CSS</b>', 'type': 'textarea', 'rows': 3, 'cols': 40,
    'default': '.artistHeadline {font-size: 10pt;text-align:left;} \nfont-size: 10pt !important;}'
  },
  'tracker_Karagarga_isAudioRelease': {
    'label': '<b>isAudioRelease</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'var tds = document.getElementsByTagName(\'td\');\nfor (var i = 0, len = tds.length; i < len; i++) {\n  if (tds[i].className == \'heading\' && tds[i].textContent.match(new RegExp(\'Type\'))) {\n    typeFieldContent = tds[i].nextSibling.textContent;\n    if (typeFieldContent.match(new RegExp(\'Music\')))\n      return true;\n    break;\n  }\n}\nreturn false;'
  },
  'tracker_Karagarga_hook': {
    'label': '<b>hook</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'var tds = document.getElementsByTagName(\'td\');\nvar centertable, oinkinsert;\nfor (var i = 0, len = tds.length; i < len; i++) {\n  if (tds[i].className == \'rowhead\') {\n    centertable =  tds[i].parentNode.parentNode;\n  }\n  if (tds[i].innerHTML == \'Pots <a name="pots"></a>\') {\n    oinkinsert = tds[i].parentNode;\n  }\n}\nvar new_row = centertable.lastChild.previousSibling.previousSibling.cloneNode(true);\ntoggleDiv = document.createElement(\'div\');\ntoggleDiv.id = \'toggleOiNKPlus\';\nif (new_row.firstChild.hasChildNodes()) {\n  new_row.firstChild.innerHTML = \'\';\n}\nnew_row.firstChild.appendChild(toggleDiv);\nnew_row.firstChild.appendChild(document.createTextNode(\' \' + \'OiNKPlus\'));\nnew_row.firstChild.nextSibling.innerHTML = \'<div id="OiNKPlus"></div>\';\ncentertable.insertBefore(new_row, oinkinsert);'
  },
  'tracker_Karagarga_findArtist': {
    'label': '<b>findArtist</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'var artist = document.querySelectorAll(\'h1 a\');\nreturn artist[0].innerHTML;'
  },
  'tracker_Karagarga_findAlbum': {
    'label': '<b>findAlbum</b>:', 'type': 'textarea', 'rows': 1, 'cols': 12, 'default': 'return null;'
  },
  'tracker_Karagarga_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'tracker_Karagarga_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': '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'
  },
  'tracker_Kraytracker_name': {
    'label': '<b>Name</b>', 'title': 'Kraytracker', 'type': 'text', 'size': 16, 'default': 'Kraytracker', 'section': ['', '<b><u>Kraytracker Settings</u></b>']
  },
  'tracker_Kraytracker_version': {
    'label': '<b>Version</b>', 'type': 'text', 'size': 1, 'default': '1'
  },
  'tracker_Kraytracker_addtosite': {
    'type': 'checkbox', 'label': 'Add OiNKPlus', 'title': 'Add the OiNKPlus box to torrent/artist pages on this tracker', 'default': true
  },
  'tracker_Kraytracker_isGazelle': {
    'type': 'checkbox', 'label': 'Gazelle', 'title': 'Tracker is Gazelle-based', 'default': true
  },
  'tracker_Kraytracker_url': {
    'label': '<b>Match pattern</b>', 'title': 'Regex pattern to match artist/release pages', 'type': 'text', 'size': 48,
    'default': 'kraytracker.com/(artist|torrents).php(\\?|\\?page=\\d+&)id='
  },
  'tracker_Kraytracker_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'Tracker link search URL\nReplace the searchTerms with the Artist variable (default is %ARTIST%)', 'type': 'text', 'size': 48,
    'default': 'http://kraytracker.com/artist.php?artistname=%ARTIST%'
  },
  'tracker_Kraytracker_tagurl': {
    'label': '<b>Tag Link</b>', 'title': 'Tracker tag link search URL\nReplace the searchTerms with the Tag variable (default is %TAG%)', 'type': 'text', 'size': 48,
    'default': 'torrents.php?taglist=%TAG%'
  },
  'tracker_Kraytracker_tagreplace': {
    'label': '<b>Tag Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': '/[ \\-\\/]/g, \'.\''
  },
  'tracker_Kraytracker_morelink': {
    'label': '<b>More link</b>', 'title': 'Artist search linked to artist name heading text\nRedundant on Gazelle trackers', 'type': 'text', 'size': 48,
    'default': '/?cls=2&act=audio&orderby=added&sortby=desc&artist=%ARTIST%'
  },
  'tracker_Kraytracker_css': {
    'label': '<b>CSS</b>', 'type': 'textarea', 'rows': 3, 'cols': 40,
    'default': '.artistHeadline {font-size: 12pt;} \n.OiNKPlusHeadline {text-align:left }'
  },
  'tracker_Kraytracker_isAudioRelease': {
    'label': '<b>isAudioRelease</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'var tds = document.getElementsByTagName(\'td\');\nfor (var i = 0, len = tds.length; i < len; i++) {\n  if (tds[i].className == \'td_dark\' && tds[i].innerHTML.indexOf(\'Artist\') > -1) {\n    return true;\n    break;\n  }\n}\nreturn false;'
  },
  'tracker_Kraytracker_hook': {
    'label': '<b>hook</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'myDiv = document.createElement(\'div\');\nmyHeadline = document.createElement(\'h4\');\ntoggleDiv = document.createElement(\'div\');\ntoggleDiv.id = \'toggleOiNKPlus\';\nmyHeadline.appendChild(toggleDiv);\nmyHeadline.appendChild(document.createTextNode(\' \' + \'OiNKPlus\'));\nmyHeadline.className = \'OiNKPlusHeadline\';\nmyDiv.appendChild(myHeadline);\nmyDiv.appendChild(document.createElement(\'br\'));\nmyNode = document.createElement(\'div\');\nmyNode.innerHTML = \'<div id="OiNKPlus"></div>\';\nmyDiv.appendChild(myNode);\nvar tds = document.getElementsByTagName(\'table\');\nvar centertable;\nfor (var i = 0, len = tds.length; i < len; i++) {\n  if (tds[i].className == \'main\') {\n    centertable =  tds[i].parentNode.parentNode.parentNode;\n    break;\n  }\n}\nvar new_row = centertable.lastChild.previousSibling.cloneNode(true);\nif (new_row.firstChild.hasChildNodes()) {\n  new_row.firstChild.innerHTML = \'\';\n}\nnew_row.firstChild.appendChild(myDiv);\nvar parent = centertable.lastChild.previousSibling.parentNode;\nparent.appendChild(new_row);'
  },
  'tracker_Kraytracker_findArtist': {
    'label': '<b>findArtist</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'var title = document.getElementsByTagName(\'title\')[0].innerHTML;\ntitle = title.replace(\'Kraytracker / \', \'\');\nif (title.indexOf(\'-\') < 0 ) return null;\nvar myartist = title.replace(/\\[.*?\\]/g, \'\').replace(/_/g, \' \').split(\' - \')[0];\nreturn myartist.replace(/(^( )*)|(( )*$)/g, \'\').replace(/[ ]{2,}/gi, \' \');'
  },
  'tracker_Kraytracker_findAlbum': {
    'label': '<b>findAlbum</b>:', 'type': 'textarea', 'rows': 1, 'cols': 12, 'default': 'return null;'
  },
  'tracker_Kraytracker_icontype': {
    'label': '<b>Icon/b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'tracker_Kraytracker_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': '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'
  },
  'tracker_Libble_name': {
    'label': '<b>Name</b>', 'title': 'Libble', 'type': 'text', 'size': 16, 'default': 'Libble', 'section': ['', '<b><u>Libble Settings</u></b>']
  },
  'tracker_Libble_version': {
    'label': '<b>Version</b>', 'type': 'text', 'size': 1, 'default': '1'
  },
  'tracker_Libble_addtosite': {
    'type': 'checkbox', 'label': 'Add OiNKPlus', 'title': 'Add the OiNKPlus box to torrent/artist pages on this tracker', 'default': true
  },
  'tracker_Libble_isGazelle': {
    'type': 'checkbox', 'label': 'Gazelle', 'title': 'Tracker is Gazelle-based', 'default': true
  },
  'tracker_Libble_url': {
    'label': '<b>Match pattern</b>', 'title': 'Regex pattern to match artist/release pages', 'type': 'text', 'size': 48,
    'default': 'libble\\.me/(artist|torrents)\\.php(\\?|\\?page=\\d+&)id='
  },
  'tracker_Libble_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'Tracker link search URL\nReplace the searchTerms with the Artist variable (default is %ARTIST%)', 'type': 'text', 'size': 48,
    'default': 'https://libble.me/artist.php?artistname=%ARTIST%'
  },
  'tracker_Libble_tagurl': {
    'label': '<b>Tag Link</b>', 'title': 'Tracker tag link search URL\nReplace the searchTerms with the Tag variable (default is %TAG%)', 'type': 'text', 'size': 48,
    'default': '/torrents.php?taglist=%TAG%'
  },
  'tracker_Libble_tagreplace': {
    'label': '<b>Tag Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': '/[ \\-\\/]/g, \'.\''
  },
  'tracker_Libble_morelink': {
    'label': '<b>More link</b>', 'title': 'Artist search linked to artist name heading text\nRedundant on Gazelle trackers', 'type': 'text', 'size': 48,
    'default': '/artist.php?name=%ARTIST%'
  },
  'tracker_Libble_css': {
    'label': '<b>CSS</b>', 'type': 'textarea', 'rows': 3, 'cols': 40,
    'default': '.artistHeadline {font-size: 10pt;text-align:left;} \nfont-size: 10pt !important;}'
  },
  'tracker_Libble_isAudioRelease': {
    'label': '<b>isAudioRelease</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'var tds = document.getElementsByTagName(\'td\');\nfor (var i = 0, len = tds.length; i < len; i++) {\n  if (tds[i].className == \'heading\' && tds[i].textContent.match(new RegExp(\'Type\'))) {\n    typeFieldContent = tds[i].nextSibling.textContent;\n    if (typeFieldContent.match(new RegExp(\'(Apps|Comics|E-books|E-learning videos)\')))\n      return false;\n    break;\n  }\n}\nreturn true;'
  },
  'tracker_Libble_hook': {
    'label': '<b>hook</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'var divs = document.getElementsByTagName(\'div\');\nvar centertable;\nfor (var i = 0, len = divs.length; i < len; i++) {\n  if (divs[i].className == \'main_column\') {\n    centertable = divs[i];\n    break;n\  }\n}\nhook = centertable.firstChild.nextSibling.nextSibling.nextSibling;\nmyDiv = document.createElement(\'div\');\nmyDiv.className = \'box\';\nmyHeadline = document.createElement(\'div\');\ntoggleDiv = document.createElement(\'div\');\ntoggleDiv.id = \'toggleOiNKPlus\';\nmyHeadline.appendChild(toggleDiv);\nmyHeadline.appendChild(document.createTextNode(\' \'));\nmyBoldText = document.createElement(\'b\');\nmyBoldText.textContent = \'OiNKPlus\';\nmyHeadline.appendChild(myBoldText);\nmyHeadline.className=\'head\';\nmyDiv.appendChild(myHeadline);\nmyNode = document.createElement(\'div\');\nmyNode.className = \'OiNK\';\nmyNode.innerHTML = \'<div id="OiNKPlus"></div>\';\nmyDiv.appendChild(myNode);\nhook.parentNode.insertBefore(myDiv, hook.nextSibling);\nseperator = document.createElement(\'div\');\nseperator.setAttribute(\'style\',\'clear: both\');\nhook.parentNode.insertBefore(seperator, myDiv.nextSibling);'
  },
  'tracker_Libble_findArtist': {
    'label': '<b>findArtist</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'var h2s = document.getElementsByTagName(\'h2\');\nif (h2s.length > 0) {\n  var str = h2s[0].textContent;\n  str = str.replace(/\\[[^\\]]*\\]/g, \'\');\n  if (str.split(\' - \').length > 1) {\n    return str.split(\' - \')[0].replace(/^\\s+|\\s+$/g, \'\');\n  } else return str.replace(/^\\s+|\\s+$/g, \'\');\n}\nreturn \'\';'
  },
  'tracker_Libble_findAlbum': {
    'label': '<b>findAlbum</b>:', 'type': 'textarea', 'rows': 1, 'cols': 12, 'default': 'return null;'
  },
  'tracker_Libble_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'tracker_Libble_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': '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'
  },
  'tracker_MusicVids_name': {
    'label': '<b>Name</b>', 'title': 'MusicVids', 'type': 'text', 'size': 16, 'default': 'MusicVids', 'section': ['', '<b><u>MusicVids Settings</u></b>']
  },
  'tracker_MusicVids_version': {
    'label': '<b>Version</b>', 'type': 'text', 'size': 1, 'default': '1'
  },
  'tracker_MusicVids_addtosite': {
    'type': 'checkbox', 'label': 'Add OiNKPlus', 'title': 'Add the OiNKPlus box to torrent/artist pages on this tracker', 'default': true
  },
  'tracker_MusicVids_isGazelle': {
    'type': 'checkbox', 'label': 'Gazelle', 'title': 'Tracker is Gazelle-based', 'default': true
  },
  'tracker_MusicVids_url': {
    'label': '<b>Match pattern</b>', 'title': 'Regex pattern to match artist/release pages', 'type': 'text', 'size': 48,
    'default': 'music-vid\\.com/details\\.php'
  },
  'tracker_MusicVids_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'Tracker link search URL\nReplace the searchTerms with the Artist variable (default is %ARTIST%)', 'type': 'text', 'size': 48,
    'default': 'http://music-vid.com/browse.php?search=%ARTIST%&searchtype=1'
  },
  'tracker_MusicVids_tagurl': {
    'label': '<b>Tag Link</b>', 'title': 'Tracker tag link search URL\nReplace the searchTerms with the Tag variable (default is %TAG%)', 'type': 'text', 'size': 48,
    'default': '/torrents.php?taglist=%TAG%'
  },
  'tracker_MusicVids_tagreplace': {
    'label': '<b>Tag Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': '/[ \\-\\/]/g, \'.\''
  },
  'tracker_MusicVids_morelink': {
    'label': '<b>More link</b>', 'title': 'Artist search linked to artist name heading text\nRedundant on Gazelle trackers', 'type': 'text', 'size': 48,
    'default': '/browse.php?searchtype=1&search=%ARTIST%'
  },
  'tracker_MusicVids_css': {
    'label': '<b>CSS</b>', 'type': 'textarea', 'rows': 1, 'cols': 40, 'default': ''
  },
  'tracker_MusicVids_isAudioRelease': {
    'label': '<b>isAudioRelease</b>', 'type': 'textarea', 'rows': 1, 'cols': 12, 'default': 'return true;'
  },
  'tracker_MusicVids_hook': {
    'label': '<b>hook</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'var centertable = document.getElementById(\'oinkpluslocation\');\ndocument.getElementById(\'spam\').innerHTML=\'\';\ncentertable.style.dispay=\'inline\';\nvar new_row = document.createElement(\'div\');\ntoggleDiv = document.createElement(\'div\');\ntoggleDiv.id = \'toggleOiNKPlus\';\nnew_row.appendChild(document.createElement(\'div\'));\nnew_row.firstChild.appendChild(toggleDiv);\nnew_row.firstChild.appendChild(document.createTextNode(\' \' + \'Oinkplus\'));\nvar div = document.createElement(\'div\');\ndiv.id = \'OiNKPlus\';\nnew_row.firstChild.appendChild(div);\ncentertable.appendChild(new_row);'
  },
  'tracker_MusicVids_findArtist': {
    'label': '<b>findArtist</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'var h1s = document.getElementsByTagName(\'h1\');\nif (h1s.length > 0) {\n  var str = h1s[0].innerHTML;\n  return h1s[0].getElementsByTagName(\'b\')[0].innerHTML;\n}\nreturn \'\';'
  },
  'tracker_MusicVids_findAlbum': {
    'label': '<b>findAlbum</b>:', 'type': 'textarea', 'rows': 1, 'cols': 12, 'default': 'return null;'
  },
  'tracker_MusicVids_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'tracker_MusicVids_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': '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'
  },
  'tracker_RockBox_name': {
    'label': '<b>Name</b>', 'title': 'RockBox', 'type': 'text', 'size': 16, 'default': 'RockBox', 'section': ['', '<b><u>RockBox Settings</u></b>']
  },
  'tracker_RockBox_version': {
    'label': '<b>Version</b>', 'type': 'text', 'size': 1, 'default': '1'
  },
  'tracker_RockBox_addtosite': {
    'type': 'checkbox', 'label': 'Add OiNKPlus', 'title': 'Add the OiNKPlus box to torrent/artist pages on this tracker', 'default': true
  },
  'tracker_RockBox_isGazelle': {
    'type': 'checkbox', 'label': 'Gazelle', 'title': 'Tracker is Gazelle-based', 'default': false
  },
  'tracker_RockBox_url': {
    'label': '<b>Match pattern</b>', 'title': 'Regex pattern to match artist/release pages', 'type': 'text', 'size': 48,
    'default': 'psychocydd\\.co\\.uk/details\\.php'
  },
  'tracker_RockBox_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'Tracker link search URL\nReplace the searchTerms with the Artist variable (default is %ARTIST%)', 'type': 'text', 'size': 48,
    'default': 'http://psychocydd.co.uk/torrents.php?search=%ARTIST%'
  },
  'tracker_RockBox_tagurl': {
    'label': '<b>Tag Link</b>', 'title': 'Tracker tag link search URL\nReplace the searchTerms with the Tag variable (default is %TAG%)', 'type': 'text', 'size': 48, 'default': ''
  },
  'tracker_RockBox_tagreplace': {
    'label': '<b>Tag Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'tracker_RockBox_morelink': {
    'label': '<b>More link</b>', 'title': 'Artist search linked to artist name heading text\nRedundant on Gazelle trackers', 'type': 'text', 'size': 48,
    'default': '/torrents.php?search=%ARTIST%'
  },
  'tracker_RockBox_css': {
    'label': '<b>CSS</b>', 'type': 'textarea', 'rows': 1, 'cols': 40, 'default': ''
  },
  'tracker_RockBox_isAudioRelease': {
    'label': '<b>isAudioRelease</b>', 'type': 'textarea', 'rows': 1, 'cols': 12, 'default': 'return true;'
  },
  'tracker_RockBox_hook': {
    'label': '<b>hook</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'hookNode = document.evaluate("//tr//tr//tr[contains(self::node(),\'Added:\')]/parent::*/tr[position() = last()]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;\nvar new_row = hookNode.cloneNode(true);\ntoggleDiv = document.createElement(\'div\');\ntoggleDiv.id = \'toggleOiNKPlus\';\nif (new_row.firstChild.hasChildNodes()){\n  new_row.firstChild.innerHTML = \'\';\n}\nnew_row.firstChild.appendChild(toggleDiv);\nnew_row.firstChild.appendChild(document.createTextNode(\' \' + \'OiNKPlus\'));\nnew_row.firstChild.nextSibling.innerHTML = \'<div id="OiNKPlus"></div>\';\nvar parent = hookNode.parentNode;\nparent.appendChild(new_row);'
  },
  'tracker_RockBox_findArtist': {
    'label': '<b>findArtist</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'var hint = document.evaluate("//tr//tr//tr[contains(self::node(),\'Torrent:\')]//a[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;\nstr = hint.textContent;\nstr = str.replace(/\\[[^\\]]*\\]/g, \'\');\nif (str.split(\' - \').length > 1) {\n  return str.split(\' - \')[0].replace(/^\\s+|\\s+$/g, \'\');\n}\nif (str.split(\-\).length > 1) {\n  return str.split(\-\)[0].replace(/^\\s+|\\s+$/g, \'\').replace(/_/g, \' \');\n}\nreturn \'\';'
  },
  'tracker_RockBox_findAlbum': {
    'label': '<b>findAlbum</b>:', 'type': 'textarea', 'rows': 1, 'cols': 12, 'default': 'return null;'
  },
  'tracker_RockBox_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'tracker_RockBox_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAATPSURBVFhHrZcHktswDEXttbf33nvvvc9Wb++9ak+SXMlnRPgQU+EqtK3MxDN/aFEU8AF8QHbCfEoNfhpkCyGZTCrsdWlpaXZkZCQ7Ozub3djYyM7Pz2ebm5u/nSkpKQm/e/DDIGWQyBhIMRhjYoyLcSyjo6NydnYm9/f38vz8LHd3d/Lw8CBPT0+yubkp1dXV4TNROxHgOxE4G3mB46amJtnd3ZXHx0d5f39Xh5eXl7K9vS2Tk5NycnKi++fn59Le3h6HAL6LEygrK5OhoSHZ39+Xl5cXdfL5+Sk3NzcyNTWlgIAph977+PiQ29tb6e3tLUaiOIF0Oi3Dw8NycHCgacYBJC4uLrQEpv4yMzMjExMTiuvra3l9fdVzV1dX0tfXp6Xz2TYoTAD2XV1dsre3p2kl5W9vb0rg6OhIy4FzMD4+LmNjY7pmMpnwHMQbGhq89g0KE0BMpBWDEEBwOMYJ0dq0UwKbAfZ2dna0RJwnI4uLi5JKpXw+/AQ4jOgaGxtlYWFBDg8PVfWkFgECoif9y8vLKsL19XWZnp5WMpBCnJSIlc6oqqrSUkTK8Z2Ae4C1o6NDjVECFE5KiQyRAQiRaurNSs1XVlZka2tLSaIZtAKBurq60K6zBglT5wCVk24it6q1BBAgERIx0ZBWnLMCqwtIWPFBlC6wBCBVU1OjdrGPH8SN74RxHJBuNiESJdDd3a0GyMLp6ak6tBHjCBJcB0GgxNiDCOmnTREhQWDbEsA5PvGdMF8CG7m9aQl0dnaKGa+hDigDUeHo6+srLAUEKA2OuQ8JpiMg/a2trd9EiO2cv98a4IJNm5pceqSlpUUfxgjO5+bmtNUgRDcQvStMzjCsrGbIgHlHaAaw5xIA+FYCzkZ4kwfq6+u1rTDCPEAnlZWVmpWBgQFVPg4BHcFeT0+PEmdyHh8fKxnGsrUPbMD4NvjTBS44UFtbKxUVFSEpFxCi7Zh0OGY2IDR7HydklBcXhGyZI37yEwBEysO+e/Q19ykJRBGV7xyOIeZqwEHhDPT394t55/91D2CU6JiSaAMS0TPYoP5kyxM9KEyA2gNaiGt7j2ioNe2J0Kgz105tdeU5JiV6sM9G4CeAofLycllbW1O18zsAY6SZfWYDxLhH25EFph/7ZIbyIFYc0w2M56iPHPJnAAOonF5mBiwtLWk0tCAvF6Ln5cM5HNAFTEtII87BwUHdoz057/NhkJ8AESMwdEAdeTHRhmQD8aENm26rB2rN8OL9QXaYnKxkyy2hg/wEeMAOJYDImAsAEqyuUfb4BcT4pkyAIQYpssG1az+H/ARcoAkygHGip9bUGU3YqckeNWcu4JhsQRDBcu6fMxAFGcA4JEg3UTHhKAWRU2fakTN2IPnsRBCfAFHgnKmH0HAIqC/iRKS8M9AMZP87AURJpAgMAnQDrcd3VgjQBQi3ra3Na8OD+ASoM3VH5cx9Il9dXQ1bkpcW5UCMCC7P6I3i3wjwYuLdQO1RN7+GyYhtVUiwz2yARIwyxCdARCielUygdIggRnSBPvjdR5dAIKYQ4xPAGM4xTib4jhNAy1lC/AdAhJyLSyDWn1NAGXBsYa/JDF2CUCHDyr7PRgT65zRtUPTvuYWJKoQhEK6GhH43RPQa+J53YP6eJ5K/AGogsilS/sISAAAAAElFTkSuQmCC'
  },
  'tracker_RuTracker_name': {
    'label': '<b>Name</b>', 'title': 'RuTracker', 'type': 'text', 'size': 16, 'default': 'RuTracker', 'section': ['', '<b><u>RuTracker Settings</u></b>']
  },
  'tracker_RuTracker_version': {
    'label': '<b>Version</b>', 'type': 'text', 'size': 1, 'default': '0'
  },
  'tracker_RuTracker_addtosite': {
    'type': 'checkbox', 'label': 'Add OiNKPlus', 'title': 'Add the OiNKPlus box to torrent/artist pages on this tracker', 'default': false
  },
  'tracker_RuTracker_isGazelle': {
    'type': 'checkbox', 'label': 'Gazelle', 'title': 'Tracker is Gazelle-based', 'default': false
  },
  'tracker_RuTracker_url': {
    'label': '<b>Match pattern</b>', 'title': 'Regex pattern to match artist/release pages', 'type': 'text', 'size': 48,
    'default': 'rutracker\\.org/viewtopic\\.php\\?t='
  },
  'tracker_RuTracker_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'Tracker link search URL\nReplace the searchTerms with the Artist variable (default is %ARTIST%)', 'type': 'text', 'size': 48,
    'default': 'http://rutracker.org/forum/tracker.php?nm=%ARTIST%'
  },
  'tracker_RuTracker_tagurl': {
    'label': '<b>Tag Link</b>', 'title': 'Tracker tag link search URL\nReplace the searchTerms with the Tag variable (default is %TAG%)', 'type': 'text', 'size': 48, 'default': ''
  },
  'tracker_RuTracker_tagreplace': {
    'label': '<b>Tag Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'tracker_RuTracker_morelink': {
    'label': '<b>More link</b>', 'title': 'Artist search linked to artist name heading text\nRedundant on Gazelle trackers', 'type': 'text', 'size': 48,
    'default': ''
  },
  'tracker_RuTracker_css': {
    'label': '<b>CSS</b>', 'type': 'textarea', 'rows': 1, 'cols': 40, 'default': ''
  },
  'tracker_RuTracker_isAudioRelease': {
    'label': '<b>isAudioRelease</b>', 'type': 'textarea', 'rows': 1, 'cols': 12, 'default': 'return false;'
  },
  'tracker_RuTracker_hook': {
    'label': '<b>hook</b>', 'type': 'textarea', 'rows': 1, 'cols': 12, 'default': 'return null;'
  },
  'tracker_RuTracker_findArtist': {
    'label': '<b>findArtist</b>', 'type': 'textarea', 'rows': 1, 'cols': 12, 'default': 'return null;'
  },
  'tracker_RuTracker_findAlbum': {
    'label': '<b>findAlbum</b>:', 'type': 'textarea', 'rows': 1, 'cols': 12, 'default': 'return null;'
  },
  'tracker_RuTracker_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'tracker_RuTracker_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': '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'
  },
  'tracker_SecretCinema_name': {
    'label': '<b>Name</b>', 'title': 'Secret Cinema', 'type': 'text', 'size': 16, 'default': 'Secret Cinema', 'section': ['', '<b><u>SecretCinema Settings</u></b>']
  },
  'tracker_SecretCinema_version': {
    'label': '<b>Version</b>', 'type': 'text', 'size': 1, 'default': '0'
  },
  'tracker_SecretCinema_addtosite': {
    'type': 'checkbox', 'label': 'Add OiNKPlus', 'title': 'Add the OiNKPlus box to torrent/artist pages on this tracker', 'default': false
  },
  'tracker_SecretCinema_isGazelle': {
    'type': 'checkbox', 'label': 'Gazelle', 'title': 'Tracker is Gazelle-based', 'default': false
  },
  'tracker_SecretCinema_url': {
    'label': '<b>Match pattern</b>', 'title': 'Regex pattern to match artist/release pages', 'type': 'text', 'size': 48,
    'default': 'secret-cinema\\.net/viewtopic\\.php?id=\\d+(?!&p=)'
  },
  'tracker_SecretCinema_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'Tracker link search URL\nReplace the searchTerms with the Artist variable (default is %ARTIST%)', 'type': 'text', 'size': 48,
    'default': 'http://www.secret-cinema.net/browse.php?cat16=on&search=%ARTIST%'
  },
  'tracker_SecretCinema_tagurl': {
    'label': '<b>Tag Link</b>', 'title': 'Tracker tag link search URL\nReplace the searchTerms with the Tag variable (default is %TAG%)', 'type': 'text', 'size': 48, 'default': ''
  },
  'tracker_SecretCinema_tagreplace': {
    'label': '<b>Tag Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'tracker_SecretCinema_morelink': {
    'label': '<b>More link</b>', 'type': 'text', 'size': 48, 'default': ''
  },
  'tracker_SecretCinema_css': {
    'label': '<b>CSS</b>', 'type': 'textarea', 'rows': 1, 'cols': 40, 'default': ''
  },
  'tracker_SecretCinema_isAudioRelease': {
    'label': '<b>isAudioRelease</b>', 'type': 'textarea', 'rows': 1, 'cols': 12, 'default': 'return true;'
  },
  'tracker_SecretCinema_hook': {
    'label': '<b>hook</b>', 'type': 'textarea', 'rows': 1, 'cols': 12, 'default': 'return null;'
  },
  'tracker_SecretCinema_findArtist': {
    'label': '<b>findArtist</b>', 'type': 'textarea', 'rows': 1, 'cols': 12, 'default': 'return null;'
  },
  'tracker_SecretCinema_findAlbum': {
    'label': '<b>findAlbum</b>:', 'type': 'textarea', 'rows': 1, 'cols': 12, 'default': 'return null;'
  },
  'tracker_SecretCinema_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'tracker_SecretCinema_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQAAAAAAAQABAgABAwABBAQAAAARAQANKwEPLAAOLQAOLgAOMAAPMgEQLAIQMAMRMgAQNgMSNAESNwITOwUVOwUWPgUXPwAnBAApBAUsCAIwBgIyBwA2BQE3BgI7BwQ7CSsAACsDAS0AACwDATEAADACAjIDAzYAADcCAjQDAzsDAzsGBj4GBgYYQQcaR0EHB0cICA4/rxRHvRpOxRtPxhxQxx5TzR9Uyx5V0ilZxSpbyitdziFX0yJY1S9h0i5g0y9i1Tx3/D14/T96/xmjJhzLLR7TLx7WMCXFNSbKNifONyDgMjj9Sjj9Szn/TK8QEL0XF8UeHsYfH8cgIMskJM0iIsUwMMoxMc4yMtIiItMmJtUnJ9M1NdI2NtU2NvxGRv1HR/9JSQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADnTsmUAAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABTElEQVQ4T42Q1ULDMBSGiw0Y7gOGlcFw9+EZNqA4DBmQ93+IcqxtEi7gv0jOOd/XtKkX/hFX8H4NZJd4ECkldovcMawOYJ1rmA2gqdslxzBqAPlH/TltG0kJ45m3b60rc5YRVzDMv2vMx6JpRAWMck/wPKbiG4bsMEj5dyK8jKIQEV49L1vM+K/Ey7PExaAVmuGzq4uR8YcvrZ8nGUMiAcrsaRAEpcHcvS5PMKSwAMXQyTUIwfnA2A1dMg4KsPVdIoaU+nme5D+C9YqG5Z4qJhz6BuMjm9ZUoZURRW6BBl2zZf1Iqe22aqbEWaAzipnGLYUpdDMWRCsaqfTqMQlqpz7hkYBG84YIB+mExwIa7XvM5w2eCGh07cIZ+701BjcEOmNTHXaYz1sCGp0rC3hJGWDMGo1a/JHSUqwGDYc7AhlSSpwWDCmiuL2TMPwBV1xR+9Q0uSUAAAAASUVORK5CYII='
  },
  'tracker_Shellife_name': {
    'label': '<b>Name</b>', 'title': 'Shellife', 'type': 'text', 'size': 16, 'default': 'Shellife', 'section': ['', '<b><u>Shellife Settings</u></b>']
  },
  'tracker_Shellife_version': {
    'label': '<b>Version</b>', 'type': 'text', 'size': 1, 'default': '1'
  },
  'tracker_Shellife_addtosite': {
    'type': 'checkbox', 'label': 'Add OiNKPlus', 'title': 'Add the OiNKPlus box to torrent/artist pages on this tracker', 'default': true
  },
  'tracker_Shellife_isGazelle': {
    'type': 'checkbox', 'label': 'Gazelle', 'title': 'Tracker is Gazelle-based', 'default': false
  },
  'tracker_Shellife_url': {
    'label': '<b>Match pattern</b>', 'title': 'Regex pattern to match artist/release pages', 'type': 'text', 'size': 48, 'default': 'shellife.eu/details_?\\.php'
  },
  'tracker_Shellife_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'Tracker link search URL\nReplace the searchTerms with the Artist variable (default is %ARTIST%)',
    'type': 'text', 'size': 48, 'default': 'http://shellife.eu/browse.php?search=%ARTIST%&cat=1&exact=1'
  },
  'tracker_Shellife_tagurl': {
    'label': '<b>Tag Link</b>', 'title': 'Tracker tag link search URL\nReplace the searchTerms with the Tag variable (default is %TAG%)', 'type': 'text', 'size': 48,
    'default': '/browse.php?cat='
  },
  'tracker_Shellife_tagreplace': {
    'label': '<b>Tag Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'tracker_Shellife_morelink': {
    'label': '<b>More link</b>', 'title': 'Artist search linked to artist name heading text\nRedundant on Gazelle trackers', 'type': 'text', 'size': 48,
    'default': '/browse.php?search=%ARTIST%&cat=1&exact=1'
  },
  'tracker_Shellife_css': {
    'label': '<b>CSS</b>', 'type': 'textarea', 'rows': 1, 'cols': 40, 'default': ''
  },
  'tracker_Shellife_isAudioRelease': {
    'label': '<b>isAudioRelease</b>', 'type': 'textarea', 'rows': 1, 'cols': 12, 'default': 'return true;'
  },
  'tracker_Shellife_hook': {
    'label': '<b>hook</b>', 'type': 'textarea', 'rows': 2, 'cols': 96,
    'default': 'document.getElementById(\'greasemonkey\').innerHTML = \'<table class="row2" width="100%"><tr><td class="row1" align="center"><div id="OiNKPlus"></div></td></tr></table>\';'
  },
  'tracker_Shellife_findArtist': {
    'label': '<b>findArtist</b>', 'type': 'textarea', 'rows': 1, 'cols': 96, 'default': 'return document.getElementById(\'greasemonkey\').title;'
  },
  'tracker_Shellife_findAlbum': {
    'label': '<b>findAlbum</b>:', 'type': 'textarea', 'rows': 1, 'cols': 12, 'default': 'return null;'
  },
  'tracker_Shellife_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'tracker_Shellife_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAANgSURBVFhHxda9q1VHFAVw/6qgRIs8kkbFSqzEIhYRQQSxEEFsxEaxEBtTpNNYJII2WogWggiKoqgoLz78QkUlSP6B8f0OWZe58+a8+y4KFouZ2fecvdb+mH3uulLKd0XXuFacOHmqHDt2vFjh7O9/LJv7z46ha5yFQ4cOl3PnL5TrN26WO3fvl8dPnpZbt26XK1evDWifXw1d4xhEiwDh4j9L5fnSi/L6zdvy8tWbARFCVPvuGLrGFohF/ODho4Ho3fsP5eOnf6fABkR8UwH79u0vF/78q9y7/2AgR/b5839d+E1WiGj9jKFrDJD/ffHyEFHSvZoASDlaX2PoGmHPnr1D5Kmp9M8iB2X4agG6/PTpMwM54qfPFocSrEUEAbLV+hxD16jpkKslZ6DrnYmom7Amd/bsV2VA3V21uuPVnmOZUA52tlpIyOe5AbDCYJql6eK4FdCKiEiiW3+zMHU4cODgZNC0zglgR24CImPzG5HzpL3G1ME8T/Q1Oed6AGkEAEF5zju1r7Vi6uDO101mRZ701wJkSqOakPkoXbp0ednNNMEsTDb1nBd1IrNHzo4cKQGe3759xwAzw+o3mEfIZKP+MpCRi9ga1AKQLyz8XBZ++qVs3rx12O/cuWv4ndggvlfDZCOKjN186axxRgBxokO48cdNAwYhy/A+ccrBDxhm8T+GySYCkCAOQq7+fhO9qCNg/Q8bBpgf+sE7RniCif8xTDZ1CRJ1jYhAFAEhD/iQBdmTKUKICkcPk43UeZjqpB/s65uAZEyAUiDWpPmW2Iejh6kDEV4SLUTA6/8b0t4z6YFWAJsgkgVT1b7maDF1qL//okWKvL6SIkQ0lgGEniVEELP+qE4d8hnOTQh5vgn2IlOClpwgDYqYSL2EXN/UHC1WGNxnL6odJ0TUn1tRpQSBeYA8TehdGRTMXD0AHG3Zsq3s/vW3koxkQnLKFgGuLnJ9YZ+UE6GUMrHmW1DDWEWSSQcZuUeOHB2uokxxTqw0+03PpAmztr5bdI3AoZTKBHJEzjIgS7lqIk69EeYmpYyt3xZdYyBK5FbkCJFbkw0k9hEk7Upm3/rroWuskSgRWGWEIDVmUw52ZZAd5ES0fsbQNfYgWtmwhlzkKUcy0743C13jLGgwUcM80a5EWfcF4aYWKiAxeMwAAAAASUVORK5CYII='
  },
  'tracker_ThePirateBay_name': {
    'label': '<b>Name</b>', 'title': 'ThePirateBay', 'type': 'text', 'size': 16, 'default': 'The Pirate Bay', 'section': ['', '<b><u>ThePirateBay Settings</u></b>']
  },
  'tracker_ThePirateBay_version': {
    'label': '<b>Version</b>', 'type': 'text', 'size': 1, 'default': '1'
  },
  'tracker_ThePirateBay_addtosite': {
    'type': 'checkbox', 'label': 'Add OiNKPlus', 'title': 'Add the OiNKPlus box to torrent/artist pages on this tracker', 'default': true
  },
  'tracker_ThePirateBay_isGazelle': {
    'type': 'checkbox', 'label': 'Gazelle', 'title': 'Tracker is Gazelle-based', 'default': false
  },
  'tracker_ThePirateBay_url': {
    'label': '<b>Match pattern</b>', 'title': 'Regex pattern to match artist/release pages', 'type': 'text', 'size': 48, 'default': 'thepiratebay\\.org/torrent/'
  },
  'tracker_ThePirateBay_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'Tracker link search URL\nReplace the searchTerms with the Artist variable (default is %ARTIST%)',
    'type': 'text', 'size': 48, 'default': 'https://thepiratebay.org/search/%ARTIST%/0/7/100'
  },
  'tracker_ThePirateBay_tagurl': {
    'label': '<b>Tag Link</b>', 'title': 'Tracker tag link search URL\nReplace the searchTerms with the Tag variable (default is %TAG%)', 'type': 'text', 'size': 48,
    'default': '/tag/%TAG%'
  },
  'tracker_ThePirateBay_tagreplace': {
    'label': '<b>Tag Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': '/ /g, \'+\''
  },
  'tracker_ThePirateBay_morelink': {
    'label': '<b>More link</b>', 'title': 'Artist search linked to artist name heading text\nRedundant on Gazelle trackers', 'type': 'text', 'size': 48,
    'default': '/s/?q=%ARTIST%&audio=on&searchTitle=on&page=0&orderby=7'
  },
  'tracker_ThePirateBay_css': {
    'label': '<b>CSS</b>', 'type': 'textarea', 'rows': 3, 'cols': 40,
    'default': '.artistHeadline {font-size: 12pt;}\nh2 {clear:none !important; text-align:left !important;}'
  },
  'tracker_ThePirateBay_isAudioRelease': {
    'label': '<b>isAudioRelease</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'var details = document.getElementById(\'details\');\nvar atags = details.getElementsByTagName(\'a\');\nif (/Audio &gt; (Music|FLAC|Other)/.test(atags[0].innerHTML) return true;\nreturn false;'
  },
  'tracker_ThePirateBay_hook': {
    'label': '<b>hook</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'myDiv = document.createElement(\'div\');\nmyHeadline = document.createElement(\'h4\');\ntoggleDiv = document.createElement(\'div\');\ntoggleDiv.id = \'toggleOiNKPlus\';\nmyHeadline.appendChild(toggleDiv);\nmyHeadline.appendChild(document.createTextNode(\' \' + \'OiNKPlus\'));\nmyDiv.appendChild(myHeadline);\nmyDiv.appendChild(document.createElement(\'br\'));\nmyNode = document.createElement(\'div\');\nmyNode.innerHTML = \'<div id="OiNKPlus"></div>\';\nmyDiv.appendChild(myNode);\nvar divs = document.getElementsByTagName(\'div\');\nvar nfoDiv;\nfor (var i = 0, len = divs.length; i < len; i++) {\n  if (divs[i].className == \'nfo\') {\n    nfoDiv =  divs[i];\n    break;\n  }\n}\nnfoDiv.parentNode.insertBefore(myDiv, nfoDiv.nextSibling);'
  },
  'tracker_ThePirateBay_findArtist': {
    'label': '<b>findArtist</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'var title = document.getElementsByTagName(\'title\')[0].textContent.replace(/\(download torrent\) - TPB/, \'\');\nif (title.indexOf(\"-\") < 0 ) return null;\nvar myartist = title.replace(/\\[.*?\\]/g, \'\').replace(/_/g, \' \').split(\'-\')[0];\nreturn myartist.replace(/(^( )*)|(( )*$)/g, \'\').replace(/[ ]{2,}/gi, \' \');'
  },
  'tracker_ThePirateBay_findAlbum': {
    'label': '<b>findAlbum</b>:', 'type': 'textarea', 'rows': 1, 'cols': 12, 'default': 'return null;'
  },
  'tracker_ThePirateBay_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'tracker_ThePirateBay_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAUCSURBVFhHxVdNTFRXFBaGGf4iBYUBEVBogcJILURLQSsosQUTfgstCeWnW8SNxki7ckG76khiYlGTUiAsiIILXRCW7mBBWillQatho4QgQuQ3DMzX+x3nvnkzoCkkpSf5cu89591zvnvueefN7KO43e4jCjcUbu4R2hQOm4OvYI9FxXythjASuPFGtfeiYjtJ4KZnvefC2NsSUDqfcTfCveb9eu2nezuBzc1NzMzMoKenB93d3TtGV1eX4N69e1hZWfEJrOWdBNbX11FVVQVVp7tCQECAIDAwEK2trTsnsLq6iry8PB+H2823W5t1HBsbG8WnP4m3EqCQQH5+vpxAw2KxyEinnHPUYDD9nF5rAg0NDR6vvvKvCOgAdGy323Ho0CGZR0REIC0tzUB4eLjoExISEBUVZewjCWZgO9kRgaSkJDx9+hQvXrxAbm4uampq5BkW2NLSEgoLC6Vm5ufnMTIy4kNixxlQOnHMGtBOSkpKsLGxIW9Hc3MzEhMTUVlZKSgvL5fs3Lp1S/aura0hPT1d9ukMUK+hRc3fTmB5eRknTpwwCISFhcHpdMqrFRMTY9y1GSkpKejr65Oqt1qtoiOB6upqIa59a3kngbm5OcTFxYkTBtMB9dy/CLVNz3URErw++tTQwtg+BMwPzM7OIjY21nBmBAlQBPRoCig2rtWztJv18fHxhl/zqOAlwIK6f/8+RkdHJV3mDGjnwcHBCLbakPpBKj79JNewMRsFBQWIjbEjxBYMW5DVhxzfHPr0BJW5Z+0l0Nvbi6CgIDn11NQUXr58Kcy1E4J3WV5ahm8bm/Bj2w9GEO67e+cuCs8UoOGbepwtKPTZd/ToUSlgdteJiQkpUg8JL4H+/n5xRKfs5YuLi+jo6EBWVhYyMjKQmZkpOJbpgEONjoxM0Wubw+Hw2hS0PicnBwMDAxKcr6PNZsPly5fhcrm8BNybbtz+uQNBKpUWdbcR+/cj5+NsXFSv26+/dGJi/E8svV6Ee8M3jXpOMY9mUHj6sbExozeUlZUJAWV/Q+DV3CtEvRcpxRN98CC+rKzCkcQkhIaEwGoJQnhoGN5PTpH0d3Z2Ynx8XDKkA3CkQzYhXt/jx48li1euXEFRUZFk4sCBA8aVMLPcYxBgJyv+/AtkpH+IluaL+OhYFr5v/Q5Pfvsddzpuo/arr8VGQnTAa2IjqqiokHSWlpbi+PHjOKjI69eTfYC9Izo6GqmpqTh58iT2q8zSxtZNsgYBnsKl7mhhYQH19fXyECve+ZMTtxXblpYWFBcXbylKBmPdmHWRkZFoampCT1e3HOCPJ2M4feq0FOKFCxcQog6RnJyM6elpXwJq5IDh4WG5K55Sg4XD07HTMaWXLl1Ce3s7BgcH8ejRI1y7dk26JtPM53l6XmnBZ2dwOv8ULEpHsm1tbZicnJTTb3kLSICgkWx5Gqbt4cOH0hvYmLjJ/KwZtPFDNTQ0hKtXr6Lo7DnYVctmUbO2srOz5RcWC9K0ZyuBZ8+eyd0xtaZiMWAWf7157Vp34e/JvxQJuxymtrbWx+7BVgKs5gcPHshHhR+k3Qp98Yt6/vx5IVBXV2fE0KLmbwhog4bHaMx3I9zLa2FHZa08f/5c1mafau7NgNnIkfDfsBPRPraDFjX3Evg/RBPgH0WPas/lOgkcVuAfxT0VFXNWIVT91lC/INS/VLVwKvj/jf5PoOJdV6MKvm/fPz7k+j3SMXAOAAAAAElFTkSuQmCC'
  },
  'tracker_Torrentz_name': {
    'label': '<b>Name</b>', 'title': '', 'type': 'text', 'size': 16, 'default': 'Torrentz', 'section': ['', '<b><u>Torrentz Settings</u></b>']
  },
  'tracker_Torrentz_version': {
    'label': '<b>Version</b>', 'type': 'text', 'size': 1, 'default': '1'
  },
  'tracker_Torrentz_addtosite': {
    'type': 'checkbox', 'label': 'Add OiNKPlus', 'title': 'Add the OiNKPlus box to torrent/artist pages on this tracker', 'default': true
  },
  'tracker_Torrentz_isGazelle': {
    'type': 'checkbox', 'label': 'Gazelle', 'title': 'Tracker is Gazelle-based', 'default': false
  },
  'tracker_Torrentz_url': {
    'label': '<b>Match pattern</b>', 'title': 'Regex pattern to match artist/release pages', 'type': 'text', 'size': 48,
    'default': 'torrent(z((-proxy)?\\.com|\\.eu)|smirror\\.com)/'
  },
  'tracker_Torrentz_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'Tracker link search URL\nReplace the searchTerms with the Artist variable (default is %ARTIST%)', 'type': 'text', 'size': 48,
    'default': 'https://torrentz.com/search?q=%ARTIST%+music'
  },
  'tracker_Torrentz_tagurl': {
    'label': '<b>Tag Link</b>', 'title': 'Tracker tag link search URL\nReplace the searchTerms with the Tag variable (default is %TAG%)', 'type': 'text', 'size': 48, 'default': ''
  },
  'tracker_Torrentz_tagreplace': {
    'label': '<b>Tag Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'tracker_Torrentz_morelink': {
    'label': '<b>More link</b>', 'title': 'Artist search linked to artist name heading text\nRedundant on Gazelle trackers', 'type': 'text', 'size': 48,
    'default': '/search?q=%ARTIST%+music'
  },
  'tracker_Torrentz_css': {
    'label': '<b>CSS</b>', 'type': 'textarea', 'rows': 3, 'cols': 40,
    'default': '.OiNK {float: left !important;} \n.OinkPlus {float: left !important; min-width:700px;} \n.artistHeadline {font-size: 10pt;}'
  },
  'tracker_Torrentz_isAudioRelease': {
    'label': '<b>isAudioRelease</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'var divs = document.getElementsByTagName(\'div\');\nfor (var i = 0, len = divs.length; i < len; i++) {\n  if (divs[i].className == \'download\') {\n    if (divs[i].textContent.match(new RegExp(\'(audio|music)\')))\n      return true;\n    break;\n  }\n}\nreturn false;'
  },
  'tracker_Torrentz_hook': {
    'label': '<b>hook</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'myDiv = document.createElement(\'div\');\nmyDiv.className = \'results\';\nmyDiv.setAttribute(\'style\',\'position: relative\');\nmyHeadline = document.createElement(\'h2\');\ntoggleDiv = document.createElement(\'div\');\ntoggleDiv.id = \'toggleOiNKPlus\';\nmyHeadline.appendChild(toggleDiv);\nmyHeadline.appendChild(document.createTextNode(\' \' + \'OiNKPlus\'));\nmyDiv.appendChild(myHeadline);\nmyNode = document.createElement(\'div\');\nmyNode.className = \'OiNK\';\nmyNode.innerHTML = \'<div id="OiNKPlus"></div>\';\nmyDiv.appendChild(myNode);\nvar divs = document.getElementsByTagName(\'div\');\nvar filesDiv;\nfor (var i = 0, len = divs.length; i < len; i++) {\n  if (divs[i].className == \'download\') {\n    filesDiv = divs[i];\n    break;\n  }\n}\nfilesDiv.parentNode.insertBefore(myDiv, filesDiv.nextSibling);\nseperator = document.createElement(\'div\');\nseperator.setAttribute(\'style\',\'clear: both\');\nfilesDiv.parentNode.insertBefore(seperator, myDiv.nextSibling);'
  },
  'tracker_Torrentz_findArtist': {
    'label': '<b>findArtist</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'var title = document.getElementsByTagName(\'title\')[0].innerHTML;\ntitle = title.replace(/Torrent Download/, \'\');\nif (title.indexOf(\'-\') < 0 ) return null;\nvar myartist = title.replace(/\\[.*?\\]/g, \'\').replace(/_/g, \' \').split(\'-\')[0];\nreturn myartist.replace(/(^( )*)|(( )*$)/g, \'\').replace(/[ ]{2,}/gi, \' \');'
  },
  'tracker_Torrentz_findAlbum': {
    'label': '<b>findAlbum</b>:', 'type': 'textarea', 'rows': 1, 'cols': 12, 'default': 'return null;'
  },
  'tracker_Torrentz_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'tracker_Torrentz_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAJ9SURBVFhH3ZfLaxNRFMbzD7j2b3BpmtZWWyyICgruLCLShWmaWJJQFF+tIqhdCCUrhaaZaaxNsD4CUo3BGhctCEWqoihajNhYJaHSGps2yeT1eWfmZuhMxkdwbtUe+MFw5pz5vsy9nMk1acPc4atjCZWpDnPnQLfZNtBf1+kFS0QNi827ncrKQcVX9BpYQPTmNluvbKLyxMAa/HItynKIF2LC9nAOuVIZRsXs4xC2demLV9h6mNvw7xhoOTmKgxdDONT3A0beIVmgBnPfEPQ9QLteHaXtNI96u75wBZWBX9L/Eh/zJdlAdhGe89fRoFdXA+vDgC34FCPjL2qCvx3F7qO8MQY8M1k5V0Msf36LA73+dWJAt3Y1Dg77/c8RSxel1lJRwJPxR9jjHlwbA7v6JjGVFEA78f7VNNpOcNI99ga67iI8m0FlfJTSCZzpGYKF3mdsgEP31CKU4ZpPYfTSsKqHmQGLcxgd9+JIFWX1QiaF8LVbaHKo69gYOOKHPfAG8WV505ULOUTuR7HDNVhVy8TAzt6watMlYjNoJ0NHWyfCwAAPz+s06JsHhAV4znKor6qTMdSAxR2Aa+ILBKmgDGFpHjcuX1U/Q4NxBhxBnIp8UjZdMfMVAX8IjZpNp8UgAxys/DN8IJNOki/mMRGexF6nr/oZGgwx0NoTQjSRUzbdQjwGxzGfMmx+hiEGzk0voSBnyajLIhK8o/sPScWFm2h1csYYGEvKqZqC9B8n/fv+LwPks9rsGkKLm+Di0WiXJ1uTk+ZqgfQ3kH5pCaSzwd88mIghntXE45JeIRNs3rEtVt9GKi+HeFb77eX4A0SNKvHVIa4LS6gMDZPpOzm1vHjonRGeAAAAAElFTkSuQmCC'
  },
  'tracker_Waffles_name': {
    'label': '<b>Name</b>', 'title': '', 'type': 'text', 'size': 16, 'default': 'Waffles', 'section': ['', '<b><u>Waffles Settings</u></b>'],
  },
  'tracker_Waffles_version': {
    'label': '<b>Version</b>', 'type': 'text', 'size': 1, 'default': '1'
  },
  'tracker_Waffles_addtosite': {
    'type': 'checkbox', 'label': 'Add OiNKPlus', 'title': 'Add the OiNKPlus box to torrent/artist pages on this tracker', 'default': true
  },
  'tracker_Waffles_isGazelle': {
    'type': 'checkbox', 'label': 'Gazelle', 'title': 'Tracker is Gazelle-based', 'default': false
  },
  'tracker_Waffles_url': {
    'label': '<b>Match pattern</b>', 'title': 'Regex pattern to match artist/release pages', 'type': 'text', 'size': 48, 'default': 'waffles\\.ch/details\\.php'
  },
  'tracker_Waffles_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'Tracker link search URL\nReplace the searchTerms with the Artist variable (default is %ARTIST%)', 'type': 'text', 'size': 48,
    'default': 'https://waffles.ch/browse.php?artist=%ARTIST%&s=year&d=desc'
  },
  'tracker_Waffles_tagurl': {
    'label': '<b>Tag Link</b>', 'title': 'Tracker tag link search URL\nReplace the searchTerms with the Tag variable (default is %TAG%)', 'type': 'text', 'size': 48,
    'default': '/browse.php?q=tag%3A%22%TAG%%22&t=1'
  },
  'tracker_Waffles_tagreplace': {
    'label': '<b>Tag Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': '/ /g, \'+\''
  },
  'tracker_Waffles_morelink': {
    'label': '<b>More link</b>', 'title': 'Artist search linked to artist name heading text\nRedundant on Gazelle trackers', 'type': 'text', 'size': 48,
    'default': '/browse.php?q=artist_full%3A%22%ARTIST%%22'
  },
  'tracker_Waffles_css': {
    'label': '<b>CSS</b>', 'type': 'textarea', 'rows': 3, 'cols': 40,
    'default': '.artistHeadline {font-size: 10pt;text-align:left;} \nfont-size: 10pt !important;}'
  },
  'tracker_Waffles_isAudioRelease': {
    'label': '<b>isAudioRelease</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'var tds = document.getElementsByTagName(\'td\');\nfor (var i = 0, len = tds.length; i < len; i++) {\n  if (tds[i].className == \'heading\' && tds[i].textContent.match(new RegExp(\'Type\'))) {\n    typeFieldContent = tds[i].nextSibling.textContent;\n    if (typeFieldContent.match(new RegExp(\'(Apps|Components|eBook)\')))\n      return false;\n    break;\n  }\n}\nreturn true;'
  },
  'tracker_Waffles_hook': {
    'label': '<b>hook</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'var tds = document.getElementsByTagName(\'td\');\nvar centertable, oinkinsert;\nfor (var i = 0, len = tds.length; i < len; i++) {\n  if (tds[i].className == \'rowhead\') {\n    centertable =  tds[i].parentNode.parentNode;\n  }\n  if (tds[i].innerHTML == \'Type\') {\n    oinkinsert = tds[i].parentNode;\n  }\n}\nvar new_row = centertable.lastChild.previousSibling.cloneNode(true);\ntoggleDiv = document.createElement(\'div\');\ntoggleDiv.id = \'toggleOiNKPlus\';\nif (new_row.firstChild.hasChildNodes()) {\n  new_row.firstChild.innerHTML = \'\';\n}\nnew_row.firstChild.appendChild(toggleDiv);\nnew_row.firstChild.appendChild(document.createTextNode(\' \' + \'OiNKPlus\'));\nnew_row.firstChild.nextSibling.innerHTML = \'<div id="OiNKPlus"></div>\';\ncentertable.insertBefore(new_row, oinkinsert);'
  },
  'tracker_Waffles_findArtist': {
    'label': '<b>findArtist</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'var h1s = document.getElementsByTagName(\'h1\');\nif (h1s.length > 0) {\n  var str = h1s[0].innerHTML;\n  str = str.replace(/\\[[^\\]]*\\]/g, \'\');\n  if (str.split(\' - \').length > 1) {\n    return str.split(\' - \')[0].replace(/^\\s+|\\s+$/g, \'\');\n  }\n}\nreturn \'\';'
  },
  'tracker_Waffles_findAlbum': {
    'label': '<b>findAlbum</b>:', 'type': 'textarea', 'rows': 1, 'cols': 12, 'default': 'return null;'
  },
  'tracker_Waffles_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'tracker_Waffles_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4zjOaXUAAAALZJREFUWEfNk8ENgDAMA/PhxYON2YIdWIQH67AASFBTKIEWVFJXuo9lOVaUCl7fNrMlbqx/mulP3Fg/eBrrE1Y6X4Ghq1asdJ4CpeApgBWB3SByIrs/angb+NYfGi5H4oJCPZs/arAqUAqeAlgRsNL5CqQeTy6dp8Ad+FZf0TKP8BTAikCoa+FP3OWEOl+B2PFow46k5kDnKVAKngJYEbDS+QqkHk8uvXwBPAhWuLH+aaY/2aaKLGf12hn2gF8pAAAAAElFTkSuQmCC'
  },
  'tracker_WhatCD_name': {
    'label': '<b>Name</b>', 'title': '', 'type': 'text', 'size': 16, 'default': 'What.CD', 'section': ['', '<b><u>What.CD Settings</u></b>']
  },
  'tracker_WhatCD_version': {
    'label': '<b>Version</b>', 'type': 'text', 'size': 1, 'default': '1'
  },
  'tracker_WhatCD_addtosite': {
    'type': 'checkbox', 'label': 'Add OiNKPlus', 'title': 'Add the OiNKPlus box to torrent/artist pages on this tracker', 'default': true
  },
  'tracker_WhatCD_isGazelle': {
    'type': 'checkbox', 'label': 'Gazelle', 'title': 'Tracker is Gazelle-based', 'default': true
  },
  'tracker_WhatCD_url': {
    'label': '<b>Match pattern</b>', 'title': 'Regex pattern to match artist/release pages', 'type': 'text', 'size': 48,
    'default': 'what\\.cd/(artist|torrents)\\.php(\\?|\\?page=\\d+&)id='
  },
  'tracker_WhatCD_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'Tracker link search URL\nReplace the searchTerms with the Artist variable (default is %ARTIST%)', 'type': 'text', 'size': 48,
    'default': 'https://what.cd/artist.php?artistname=%ARTIST%'
  },
  'tracker_WhatCD_tagurl': {
    'label': '<b>Tag Link</b>', 'title': 'Tracker tag link search URL\nReplace the searchTerms with the Tag variable (default is %TAG%)', 'type': 'text', 'size': 48,
    'default': '/torrents.php?taglist=%TAG%'
  },
  'tracker_WhatCD_tagreplace': {
    'label': '<b>Tag Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': '/[ \\-\\/]/g, \'.\''
  },
  'tracker_WhatCD_morelink': {
    'label': '<b>More link</b>', 'title': 'Artist search linked to artist name heading text\nRedundant on Gazelle trackers', 'type': 'text', 'size': 48,
    'default': '/torrents.php?artistname=%ARTIST%'
  },
  'tracker_WhatCD_css': {
    'label': '<b>CSS</b>', 'type': 'textarea', 'rows': 3, 'cols': 40,
    'default': '.artistHeadline {font-size: 10pt;text-align:left;} \nfont-size: 10pt !important;}'
  },
  'tracker_WhatCD_isAudioRelease': {
    'label': '<b>isAudioRelease</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'var tds = document.getElementsByTagName(\'td\');\nfor (var i = 0, len = tds.length; i < len; i++){\n  if (tds[i].className == \'heading\' && tds[i].textContent.match(new RegExp(\'Type\'))){\n    typeFieldContent = tds[i].nextSibling.textContent;\n    if (typeFieldContent.match(new RegExp(\'(Apps|Comics|E-books|E-learning videos)\')))\n      return false;\n    break;\n  }\n}\nreturn true;'
  },
  'tracker_WhatCD_hook': {
    'label': '<b>hook</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'var divs = document.getElementsByTagName(\'div\');\nvar centertable;\nfor (var i = 0, len = divs.length; i < len; i++) {\n  if (divs[i].className == \'box torrent_description\' || (divs[i].className == \'box\' && divs[i].id == \'artist_information\')) {\n    centertable = divs[i];\n    break;\n  }\n}\nhook = centertable.firstChild.nextSibling.nextSibling.nextSibling;\nmyDiv = document.createElement(\'div\');\nmyDiv.className = \'box\';\nmyHeadline = document.createElement(\'div\');\ntoggleDiv = document.createElement(\'div\');\ntoggleDiv.id = \'toggleOiNKPlus\';\nmyHeadline.appendChild(toggleDiv);\nmyHeadline.appendChild(document.createTextNode(\' \'));\nmyBoldText = document.createElement(\'b\');\nmyBoldText.textContent = \'OiNKPlus\';\nmyHeadline.appendChild(myBoldText);\nmyHeadline.className=\'head\';\nmyDiv.appendChild(myHeadline);\nmyNode = document.createElement(\'div\');\nmyNode.className = \'OiNK\';\nmyNode.innerHTML = \'<div id="OiNKPlus"></div>\';\nmyDiv.appendChild(myNode);\nhook.parentNode.insertBefore(myDiv, hook.nextSibling);\nseperator = document.createElement(\'div\');\nseperator.setAttribute(\'style\',\'clear: both\');\nhook.parentNode.insertBefore(seperator, myDiv.nextSibling);'
  },
  'tracker_WhatCD_findArtist': {
    'label': '<b>findArtist</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'var h2s = document.getElementsByTagName(\'h2\');\nif (h2s.length > 0) {\n  var str = h2s[0].textContent;\n  str = str.replace(/\\[[^\\]]*\\]/g, \'\');\n  if (str.split(\' - \').length > 1) {\n    return str.split(\' - \')[0].replace(/^\\s+|\\s+$/g, \'\');\n  }\n  else return str.replace(/^\\s+|\\s+$/g, \'\');\n}\nreturn \'\';'
  },
  'tracker_WhatCD_findAlbum': {
    'label': '<b>findAlbum</b>:', 'type': 'textarea', 'rows': 4, 'cols': 96, 'default': 'var titles = document.getElementsByTagName("title");\n  if (titles.length > 0) {\n    var str = titles[0].textContent;\n    str = str.replace(/(.+?) - (.+) \\[\\d{4}\\]( :: What\.CD)?/, \'$2\');\n    return str;\n  } else return \'\';'
  },
  'tracker_WhatCD_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'tracker_WhatCD_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': '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'
  }
};

var gmc_oinkplustrackers = new GM_configStruct(
  {
    'id': 'oinkplusTrackersAdvancedMenu',
    'title': 'OiNKPlus: Trackers Advanced Settings Menu',
    'fields': oinkplusConfigFieldsTrackersAdvanced,
    'css':  '.section_header { background: white   !important; color:  black       !important; border: 0px         !important; text-align: left    !important;} .field_label { font-weight: normal !important;}',
    'events':
    {
      'open': function() {
      },
      'save': function(values) {
        valuesSaved = true;
      },
      'close': function(values) {
        gmc_oinkplustrackers.close();
      }
    }
  });
gmc_oinkplustrackers.init();

var oinkplusConfigFieldsExternalsAdvanced = {
  'external_7Digital_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': '7Digital', 'section': ['', '<b><u>7Digital Settings</u></b>']
  },
  'external_7Digital_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'https://7Digital.com/search/artist?q=%ARTIST%&f=17%2C16%2C12%2C9%2C2'
  },
  'external_7Digital_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_7Digital_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_7Digital_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_7Digital_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': '7Digital Group Plc is a publicly listed digital music and radio services platform. 7Digital offers both B2B services for digital media partners as well as 7Digital branded direct to consumer (D2C) music download stores. 7Digital\'s platform and API have been used to power digital music services for businesses like Guvera, Onkyo, Rok Mobile, Samsung, BlackBerry, and HMV. 7Digital\'s group companies Smooth Operations, Unique Production and Above The Title, produce independent content for broadcasters like BBC Radio 1, Radio 1Xtra, BBC Radio 2 and BBC Radio 3. 7Digital music download stores are available globally and have major label catalogue in over 40 countries. They also have a mobile web-store, smartphone apps for Android, BlackBerry 10 devices, Firefox OS, Windows and iOS.',
  },
  'external_7Digital_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_7Digital_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': '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'
  },
  'external_AllMusic_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'AllMusic', 'section': ['', '<b><u>AllMusic Settings</u></b>']
  },
  'external_AllMusic_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'http://www.allmusic.com/search/artist/%22%ARTIST%%22'
  },
  'external_AllMusic_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_AllMusic_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_AllMusic_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_AllMusic_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'AllMusic (previously known as All Music Guide or AMG) is an online music guide service website, owned by All Media Network, LLC. AllMusic was founded in 1991 by popular culture archivist Michael Erlewine as a guide for consumers. Its first reference book was published the following year. When first released onto the Internet, AMG predated the World Wide Web and was first available as a Gopher site. In late 2007, Macrovision (now Rovi Corporation) acquired AMG for a reported $72 million.',
  },
  'external_AllMusic_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_AllMusic_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': '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'
  },
  'external_Amazon_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Amazon', 'section': ['', '<b><u>Amazon Settings</u></b>']
  },
  'external_Amazon_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96,
    'default': 'http://www.amazon.com/gp/search?ie=UTF8&keywords=%ARTIST%&index=music'
  },
  'external_Amazon_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_Amazon_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_Amazon_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_Amazon_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'Amazon.com, Inc. is an American international electronic commerce company with headquarters in Seattle, Washington, United States. It is the world\'s largest internet company, based on revenue and number of employees. Amazon.com started as an online bookstore, but soon diversified, selling DVDs, VHSs, CDs, video and MP3 downloads/streaming, software, video games, electronics, apparel, furniture, food, toys, and jewelry. The company also produces consumer electronics-notably, Amazon Kindle e-book readers, Kindle Fire tablets, Fire TV and Fire Phone - and is a major provider of cloud computing services. Jeff Bezos incorporated the company (as Cadabra) on July 5, 1994 and the site went online as Amazon.com in 1995. Bezos changed the name cadabra.com to amazon.com because it sounded too much like cadaver. Additionally, a name beginning with "A" was preferential due to the probability it would occur at the top of any list that was alphabetized. Amazon has separate retail websites for United States, United Kingdom, France, Canada, Germany, Italy, Spain, Australia, Brazil, Japan, China, India and Mexico, with sites for Sri Lanka and South East Asian countries coming soon. Amazon also offers international shipping to certain other countries for some of its products. In 2011, it had professed an intention to launch its websites in Poland, Netherlands, and Sweden, as well. An Austrian website operates as part of the German website.',
  },
  'external_Amazon_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_Amazon_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAARkSURBVFhHtVdLSyRXFO4fEYaQ1yoYskp8RXtUEkHBrAU3YXBUomgUYYgBdy50IWQWunDU2CEQp1VwoTGBtK1maMiDDGKMAZWBxOD4fratdnXX4+R8t6o6VZbVXRkqHxy76t5b5/vuOede7w3cxMXFxduXl5dN8Xj8gZ/GPhv4N8+gceLq6uqV8/Pz6YODA21vb492d3d9NfiEbxYxzWJeNmh1gPzk5OQvHkCSJJGmaeQ34BO+wcFcz/j9jkEfCPDMY+j4P4hvQlVVIYIjERXkyDlCA3VeAJFwwlGjo6MjOj4+pmQyKdq8TgDjmVNF5AMoOOTHy8enp6c0MjJCdXV1FAwGqaioSFh5eTk1NjbS3NwcybJsjHYHuFAXzH0/gArFSzbgg+XlZaqsrKTCwsKs1tnZKXKdCzs7O5RIJB54EoDBFRUVDrL8/HxHGwxRyhVR+AR3TgFw1NfXZyNAJMLhMK2urtLk5KRIgbW/trZW1EQ2eBYAR9XV1TaCxcXFzAzxOzo6ausvKyvLWQueBQBra2s0MzNDQ0ND1N/fL6rYBAREo1EqKCjICCgpKclZB/9JgAmQISKYHZbg+vo6xWIxIcoagdLSUv8FgHxzc5N6e3uppqaGiouLbaRW812Aoig0MDAg1ryVCGG3ht40XwVg5mNjYw6Sjo4OWlhYoO3tbbEBWYX4KoD/cQiHVvKenh7bMrtZhL4KWFpaspHDNjY2jF49QhMTE7Z+X1fB1NSUzTlsa2vL6NX3ifb29qxjboNnAbOzsw7noVBIzBwWiUQc/TCkCf1u8CwAS++mc6yGtrY2am1tdfSZhjHYqt3gWQBC3NLSciuJaVVVVdTV1WVra2hoID5rGF6ccBWgJU/xV38xgJXQ1NSUqXRzP8B7c3OzcHZ9fU319fWivbu7Wy9CpCl5RurOT6T8+T2pJyhe3fftAviD9A+fkrw6SpqM/f5fIYjEysqK2BMGBwdpfHxcrAbrcuQDBs3Pz2fa1L2nlP7uHqUjH1Nq+kOSQm+x32vR5x4BReIPWig1+YFQTaoihL0IRKEmnpOy9iWpR3+Q9DhImqr/l8xeAzxI/rmXpOE3KDXxPsm/DZMa52WlsRgBN0FoZ9JUgpS/Fykd/YSkL94k+elDkn8PCZ/mZLILAHiguh0jKVzGQl4XlgqXU/rJZ2JGylZUhFg9WCH1+Y+kPJsl+dfPKf3tRySN5enffP0eqTwOs0YaNCluONcFiCMZbizZDqXImcLqU4/vkvToVREV4fzRa3YbhnEfP6fGgyJqWvrKcMJRMZ8Z4MKkmfseIpCX+1jO4rgW1N1fRBhT39RxPjkyX73L9g4/3xVt6MMYDXXjmqbMsVxmAfoNiS8mT3BZsFa0O9gxooV64IIVhmcRQXdSE+DY399H/iOCHIASXJcgAuqybaEvCvg0Zo77xTpvUi8Z9Dp4wJ2zs7MwD1CRHxSJnwafh4eHMjgc5FbgusQRuY8KxQrxw+ALBZfJeQaBwD/EtTEAOD/fOwAAAABJRU5ErkJggg=='
  },
  'external_AmazonAU_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Amazon Australia', 'section': ['', '<b><u>AmazonAU Settings</u></b>']
  },
  'external_AmazonAU_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96,
    'default': 'http://www.amazon.com.au/gp/search?ie=UTF8&keywords=%ARTIST%&index=music'
  },
  'external_AmazonAU_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_AmazonAU_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_AmazonAU_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_AmazonAU_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 2, 'cols': 96,
    'default': 'Amazon Australia did not contain a music section as of the last script update, and probably won\'t return a useful result.',
  },
  'external_AmazonAU_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_AmazonAU_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': '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'
  },
  'external_AmazonBR_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Amazon Brazil', 'section': ['', '<b><u>AmazonBR Settings</u></b>']
  },
  'external_AmazonBR_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96,
    'default': 'http://www.amazon.com.br/gp/search?ie=UTF8&keywords=%ARTIST%&index=music'
  },
  'external_AmazonBR_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_AmazonBR_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_AmazonBR_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_AmazonBR_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 2, 'cols': 96,
    'default': 'Amazon Brazil did not contain a music section as of the last script update, and probably won\'t return a useful result.',
  },
  'external_AmazonBR_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_AmazonBR_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAQmSURBVFhHtVdNSBtdFJ1ll12V8n1tcVXorv6hVqURFFwWBLdWBa2iCKWWunOhUJe6sCpaXNio0IXWTSX+lCzaQhFrXah88FUQDeJP/E/izOT2nTsZfZPJJFM6PXCSzLw395x3330v85RknJycPDg7O6s/Pj5+7iVFzFrxfT8hY8f5+fk/R0dH73d3d+OhUIh2dnY8JWIitjDxXpi5nZA1APGDg4OfogNFo1GKx+PkNRATsaEhtP4T17cS8ooiRh5Ew98QToau62xCZCLA4phzpAbu3AAmEURkjfb29mh/f58ikQjfczsA9BeaOjKvoOAwP24ePjw8pMHBQaqurqaioiLKy8tjlpSUUF1dHc3MzJCqqonezoAW6kJoP1VQobhIBzywtLREZWVllJubm5ZtbW0815mwvb1Np6enz10ZQOfS0lKbWHZ2tu0eiCxlyihiQjujAQTq7u62CCATfr+fVlZWaGJigqdAbq+qquKaSAfXBhCooqLCIjA/P381QnwPDQ1Z2ouLizPWgmsDwOrqKk1NTVF/fz/19PRwFZuAgUAgQDk5OVcGCgoKMtbBbxkwATFkBKPDElxbW6NgMMim5AwUFhZ6bwDiGxsb1NXVRZWVlZSfn28Rlem5AU3TqLe3l9e8LIS0y6k36akBjHx4eNgm0traSnNzc7S1tcUbkGzEUwPij4MDyuKdnZ2WZZZchJ4aWFhYsIiD6+vriVYjQ+Pj45Z2T1fB5OSkJTi4ubmZaDX2iZaWlrR9UsG1genpaVvwkZERHjk4OztrawcxTWh3gmsDWHrJwbEampubqampydZmEn2wVTvBtQGkuLGxMaWIyfLycmpvb7fcq62tJfGukYhih6OBeOQQn8ZFAlgJ9fX1V5Vu7ge4bmho4GAXFxdUU1PD9zs6OowixDRFwqRvfybt/4+kH6B4jdipDYgHLhdfkLoyRHEV+/21EWRieXmZ94S+vj4aGxvj1aBkKaT4UvNmpcFUbUw8a8uAFqXL2UaKTfjYNekaG3MCB+q08uZrhV59VCgUNojfuJfcj59NNsDQVVK/dFF04B7Fxh+T+n2A9GOxrOLCDOPakGxAFv4SzuKV8HrqKXqlNuJoABCj1reCFPUXCyN3mTF/CV1+ekna6lvSNgOkh75xEFkYYouLPiFO5POJK3HrxsOfbMhmBAZwYkn3UhpXL0j7MUKxd48o+uZfzgobenOH+eTZtbDJrKxFFoYBGDEoPqQ+eAbPIgP3M7+WC3OiFvSdrzw1sQ/VFH0nMjP6MK0B0wS+R0fFD6nPlQFAHEw+4bAg/8E4Q5hBtlAPomCdpkAWhyHHKQBwVsNxCSbwupVuC00GB0lThBg5fluE5SI0IURvhcNhP04sKEpsFG4oGzApG0kpbFI2YALHJZxYcGjACsnEP9uIFPoFsnxGBn8/F/4AAAAASUVORK5CYII='
  },
  'external_AmazonCA_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Amazon Canada', 'section': ['', '<b><u>AmazonCA Settings</u></b>']
  },
  'external_AmazonCA_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'http://www.amazon.ca/gp/search?ie=UTF8&keywords=%ARTIST%&index=music'
  },
  'external_AmazonCA_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_AmazonCA_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_AmazonCA_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_AmazonCA_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 1, 'cols': 24,'default': '',
  },
  'external_AmazonCA_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_AmazonCA_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAARBSURBVFhHtVddTCNVGO3TPhijDxqykVVjYjbok/wFWEAlQsI7Ca8IJBAISLIRE15WTMCER3hglwb8ZVvQjeFnTcQCbvqgJoawiAYQd5eVACH8tfy1pTM93nM77c60M+1srCc5befeO985893v3s51JOL4+PiN09PTRr/ffz2TFDHrxfdVTSYZZ2dnL/l8vju7u7uRnZ0dbG9vZ5SMydjCxB1h5rImGwXFDw4OHokBCAaDiEQiyDQYk7GpIbTWxXWWJu9wiCf3suP/EE6EqqrShMiER4pzzpkaurMDmmQQkTXs7e1hf38fgUBAttl9AI4Xmioz72DBcX7s3Hx4eIihoSHU1taipKQEBQUFkmVlZWhoaMD09DTC4bA22hrUYl0I7fcdrFBepAJvWFhYQEVFBfLz81Oyo6NDznU6bG1t4eTk5LotAxxcXl6eJJabm5vURjJL6TLKmNROa4CBent7DQLMhMvlwtLSEsbGxuQU6PtrampkTaSCbQMMVFVVZRCYm5uLPyG/nU6nob+0tDRtLdg2QCwvL2NiYgKDg4Po6+uTVRwDDXg8HuTl5cUNFBUVpa2DpzIQA8WYET4dl+DKygq8Xq80pc9AcXFx5g1QfG1tDT09PaiurkZhYaFBVM+MG1AUBf39/XLN64WYdn3qY8yoAT758PBwkkh7eztmZ2exubkpNyC9kYwaEH8cMqBevLu727DMEoswowbm5+cN4uTq6qrWG82Q2+029Gd0FYyPjxuCkxsbG1pvdJ9oa2tLOcYMtg1MTk4mBR8ZGZFPTs7MzCT1k5wm9lvBtgEuvcTgXA2tra1oaWlJ6ouRY7hVW8G2Aaa4ubnZVCTGyspKdHZ2Gtrq6+sh3jW0KMmwNBAJHPIzeqGBK6GxsTFe6bH9gNdNTU0y2Pn5Oerq6mR7V1dXtAg5TYEjqFs/Q3n4A9QDFm80trkBccPFTx8ivOREJMz9/okRZmJxcVHuCQMDAxgdHZWroeiZS/jgxWfjvPHxjZTUj+W9yRlQgriYaUZo7F3pGqoijVmBgf7OuRynElHi9H/nxumPdw1t+rG817wG1DDCv/QgeOsVhNzvIHz/FlS/WFYiQBRPDFkZCP55Hw9zXpMMrf3xlAYI8dTqphdBV6kw8rJkyFWGi3sfQVn+DMqGB+rOb6YGfO7P4bs7hfUrz0uefD8F3zdfmxvgiSXVS2kkfA7l9xGEbl9D8Ga2zIo0dPOKpJmBx9fy8eB1re3NbDzIycbjt4stM3A1/Wu5MCdqQd3+VU5NaKoWwdsiM1+8ZWrgn+r3sP7qC/E2/mabqQFCHEzu8bCg/4OxhjDDbIlgEAVrZiBm4q+s5yQfaeKWBnhW43GJJvi6lWoLTYSVgb1PP4HvSyeOx7+Sv1MaIIRo1tHRkYsnFhYlNwo7tDJAshj930aLL0b9WIOBGHhc4omFhwaukHT8bxvRJfwLyfmYizsmtAgAAAAASUVORK5CYII='
  },
  'external_AmazonCN_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Amazon China', 'section': ['', '<b><u>AmazonCN Settings</u></b>']
  },
  'external_AmazonCN_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'http://www.amazon.cn/gp/search?ie=UTF8&keywords=%ARTIST%&index=music'
  },
  'external_AmazonCN_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_AmazonCN_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_AmazonCN_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_AmazonCN_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 1, 'cols': 24,'default': '',
  },
  'external_AmazonCN_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_AmazonCN_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAPRSURBVFhHtVdLSxtRGJ2f0JWUvuhK6K6+UJtIFRTcC9lqFBRFEaQW3GWhC5e68BG0uNCo4ELrphK1kkVbKGJtFiqFKoiKaOI7mTiPr/fczJiZjEnGdnrgZJi5d75z7ne/ezNXSMfl5eWr6+vrpouLiy4nyWJ62TVfk7Hi5ubmyfn5+dzx8bF6dHREh4eHjhIxEZuZmGNmHmuySUA8Eonssg4kiiKpqkpOAzERGxpM6xe7z9PkBYGNPISG/yGcDkVRuAmWiSAXx5wjNXBnBzCJICxrdHJyQqenpxSPx/kzuwNAf6apIPMCCg7zY+flaDRKo6Oj5PF4qLy8nIqLizndbjc1NjbS4uIiSZKk9c4MaKEumHaDgArFTTbghfX1daqqqqKioqKs7Ozs5HOdCwcHB3R1ddVlywA6V1RUWMQKCgosz0BkKVdGERPaOQ0gUF9fn0kAmQgEArS5uUkzMzN8CoztdXV1vCaywbYBBKqpqTEJrKys3I0QV7/fb2p3uVw5a8G2ASAcDtP8/DwNDQ1Rf38/r2IdMBAMBqmwsPDOQGlpac46eJABHRBDRjA6LMGtrS0KhULclDEDZWVlzhuA+M7ODvX29lJtbS2VlJSYRI103IAsyzQwMMDXvFEIaTemXqejBjDysbExi0hHRwctLy/T/v4+34CMRhw1wP44eECjuM/nMy2z9CJ01MDq6qpJHNze3tZakxmanp42tTu6CmZnZ03Bwb29Pa01uU+0t7dn7XMfbBtYWFiwBB8fH+cjB5eWliztIKYJ7Zlg2wCWXnpwrIa2tjZqbW21tOlEH2zVmWDbAFLc0tJyr4jO6upq6u7uNj3zer3EvjW0KFZkNKDGo/hN3mjASmhqarqrdH0/wH1zczMPFovFqL6+nj/v6elJFiGmKX5GysEXkn9/IiWC4k3Gvt8Ae+H28zuSNv2kStjvU0aQiY2NDb4nDA4O0uTkJF8NlYJAvr8k3rVmQBbpdqmFEjOV3DUpMjeWCQhEOiu1a8Oj1LMsxLv314AikfS1l8SRF5SYfkvSjxFSLtiyUpkZjpQhbgDCE0x0l9GnCdgwkdkAwEat7IdIDLiYkeeciYCbbtfekxz+QPJekJSj76kM6AZeasJ2DeDEku2jVJViJP8cp8TUGxKHn/KscEPDzzjvDEAQ4sjGA6cgP/dnOTPHakE5/ManJvHRQ+IUy8zE65SBvyA3ALCDyRoOC8Y/mMxgZpAt1AMrWEcM4KyG4xJM4HMr2xaaDkcMAEw07+zsLIATC4oSG4UdOmZAB45LOLHg0IAVkov/thEJ9AdN+Dh+5wMkvQAAAABJRU5ErkJggg=='
  },
  'external_AmazonDE_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Amazon Germany', 'section': ['', '<b><u>AmazonDE Settings</u></b>']
  },
  'external_AmazonDE_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'http://www.amazon.de/gp/search?ie=UTF8&keywords=%ARTIST%&index=music'
  },
  'external_AmazonDE_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_AmazonDE_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_AmazonDE_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_AmazonDE_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 1, 'cols': 24,'default': '',
  },
  'external_AmazonDE_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_AmazonDE_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAPISURBVFhHtVdLSxtRGM2vkNLXUuiuvlCbSCMouBeytTGgKIogteAui7hwqQutwZQuNEZwoXVTiVrJoi0UsWkWKoU2EJIgGjU+8nBm8vWem0RnMnmMcXrgKDP33u+c+93v3sw1FOLi4uLF1dWVLR6Pj+pJFtPK/tfmZNS4vr5+fH5+vnJ0dJSJRqMUiUR0JWIiNjOxwsw8yslmAfFYLPaXdaBUKkWZTIb0BmIiNjSY1m/2XJOTNxjYzH1o+B/ChZAkiZtgmfBycaw5UgN3WgCTCMKyRsfHx3RyckLJZJK/0zoB9GeaEjJvQMFhfbQMPj09pbm5ObJYLNTa2kqNjY2cJpOJent7aX19nQRByPUuDWihLpj2GwMqFA/lgAG7u7vU3t5ODQ0NZTkyMsLXuhLC4TBdXl6OajKAzm1tbSqxuro61TsQWaqUUcSEdkUDCDQxMaEQQCbcbjf5/X7yeDx8CeTt3d3dvCbKQbMBBOrs7FQIbG1t3c4Q/51Op6LdaDRWrAXNBoBAIECrq6s0MzNDk5OTvIrzgAGv10v19fW3BpqbmyvWwb0M5AExZASzwxbc398nn8/HTckz0NLSor8BiB8eHpLD4aCuri5qampSiMqpuwFRFGlqaorvebkQ0i5PfZ66GsDM5+fnVSLDw8O0ublJoVCIH0ByI7oaYD8cPKBc3G63K7ZZYRHqamB7e1shDh4cHORasxlaWlpStOu6C5aXlxXBwWAwmGvNnhNDQ0Nl+xSDZgNra2uq4C6Xi88c3NjYULWDWCa0l4JmA9h6hcGxGwYHB2lgYEDVlif64KguBc0GkOL+/v6iInl2dHTQ2NiY4p3VaiX2rZGLokZJA5nkKf5mH3LATrDZbLeVnj8P8NzX18eDJRIJ6unp4e/Hx8ezRYhlSp6RFP5K4p/PJMVQvNnYxQ2wATdf3pLgd1JGwHl/ZwSZ2Nvb42fC9PQ0LSws8N3APqoeRlUGxBTdbPRT2mPmrkkSubFSKBr0Piw0wCEJJHxzUOr9c0ovvSbh53uS4mxbZZgZjjtDRYPeh0UNAGzWUshHKbeRGXnGmXab6GbnHYmBDyQGvSRFf5CZBbFXSYzFR6m13EdpRkiQ+MtF6cVXlJp9wrPCDc0+5UQgNpWqiLHIQG3lz3JmjtWCFPnOlyb9yUKpRZaZjy8fbgBgF5MdXBbkPzClwcwgW6gHVrB2Mwtmr44Yyw3grobrEkzgc6vcEVoIO4JRdcRYbgBgojVnZ2du3FhQlDgotFA3A3nguoQbCy4N2CGVaGZpRKBqaDYb6B9ovzF+fnpAXwAAAABJRU5ErkJggg=='
  },
  'external_AmazonES_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Amazon Spain', 'section': ['', '<b><u>AmazonES Settings</u></b>']
  },
  'external_AmazonES_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'http://www.amazon.es/gp/search?ie=UTF8&keywords=%ARTIST%&index=music'
  },
  'external_AmazonES_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_AmazonES_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_AmazonES_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_AmazonES_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 1, 'cols': 24, 'default': '',
  },
  'external_AmazonES_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_AmazonES_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAP4SURBVFhHtVdLSxtRGJ1fIaWvpdBdfaFWpREU3AtuNQqKoghSC+6y0IVLXfhCiwuNCi60bhriI2TRFopY60Kl0ASCivh+JnFm8vU7NxOdyeQx1emBk2Hmzv3Oud/97s1cKRmXl5dvrq+vmy4uLrrsJMd08jVXkzHj5ubm+fn5+fzh4WHs4OCA9vf3bSViIjabmGczzzTZOCB+cnIS4BcoEolQLBYju4GYiA0N1vrN9zmavCTxyP1o+B/CyVBVVZjgTHiFOOYcqYE7K4BJBOGs0dHRER0fH1M4HBbPrA4A77OmisxLKDjMj5XOp6enNDo6SnV1dVRaWkqFhYWC5eXl1NjYSEtLSyTLsvZ2ekALdcHaDRIqFDeZgA7r6+tUWVlJBQUFGdnZ2SnmOhv29vbo6uqqy5IBvFxRUWESy8vLMz0DkaVsGUVMaGc1gEB9fX0GAWTC7XbT5uYmzc7OiinQt9fW1oqayATLBhCourraILCysnI/QlzHxsYM7WVlZVlrwbIBYGtrixYWFmhoaIj6+/tFFScAA16vl/Lz8+8NFBcXZ62DfzKQAMSQEYwOS3B7e5v8fr8wpc9ASUmJ/QYgvru7S729vVRTU0NFRUUGUT1tN6AoCg0MDIg1rxdC2vWpT9BWAxj5+Pi4SaSjo4OWl5cpFAqJDUhvxFYD/MchAurFXS6XYZklF6GtBlZXVw3i4M7OjtYaz9DMzIyh3dZVMDc3ZwgOBoNBrTW+T7S3t2d8JxUsG1hcXDQFn5iYECMHPR6PqR3ENKE9HSwbwNJLDo7V0NbWRq2traa2BPEOtup0sGwAKW5paUkpkmBVVRV1d3cbnjmdTuJvDS2KGWkNxMKn+I3faMBKaGpquq/0xH6A++bmZhHs9vaW6uvrxfOenp54EWKawmek7n0l5c8XUk9QvPHYqQ1wh7u1DyRvjlFMxn7/YASZ2NjYEHvC4OAgTU1NidXgkCRyPZLoa86AEqE7TwtFZx3CNamKMJYOCESPJPqmrgFVJvlbL0VGXlN05j3JP0dIveBlFWMzAg+GXA4O5noc0Td9EfKo1ZCfIu4yNvJKMOoupzvfR1K2PpES9JJ68IOXGwejOAMBvq5J5OPAgQbtXmtLRfTFR6kz00dpTL4l5dcERaffUWT4hciKMDT8UlBvwOdj0Um+Njh4hC5xrxdMpjDAGcjN/lnO5rgW1P3vYmqin+soMs2ZmXxrzIAQl2jS1UABh4N8urZUFAYAPpj4cFjQ/8GkB5tBtlAPXLCmDCDtXFyYAksZAHBWw3EJJvC5lWkLTUaqIoR48rNUFEWYAIvmnJ2duXFiQVFio7DCJy/DZOC4hBMLDg1YIdn4tI1Ior+EQnEx4H1MygAAAABJRU5ErkJggg=='
  },
  'external_AmazonFR_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Amazon France', 'section': ['', '<b><u>AmazonFR Settings</u></b>']
  },
  'external_AmazonFR_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'http://www.amazon.fr/gp/search?ie=UTF8&keywords=%ARTIST%&index=music'
  },
  'external_AmazonFR_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_AmazonFR_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_AmazonFR_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_AmazonFR_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 1, 'cols': 24, 'default': '',
  },
  'external_AmazonFR_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_AmazonFR_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAPBSURBVFhHtVdLSxtRGJ1fIaWvpdBdfaE2kUZQcC+4tTGgKIogteAui7hwqQutwZQuNIngQuumErWSRVsoYtMsVAptIKiIz/hIJs7j6z03E81k8pjieOBkmLl3vnPud797M1fIx8XFxYurqytXIpEYspIsppNdKzUZI66vrx+fn58vHB4eqgcHB7S/v28pEROxmYkFZuaRJpsBxE9OTv6yDiSKIqmqSlYDMREbGkzrN7uv0OQFgY08jIaHEM6HoijcBMtEiItjzpEauDMDmEQQljU6Ojqi4+NjSqVS/JnZAaA/01SQeQEFh/kx8/Lp6SlNT09TR0cHNTY2Um1tLafdbqeuri5aXl4mSZK03sUBLdQF034joEJxUwp4YXNzk5qbm6mmpqYkBwcH+VyXw97eHl1eXg6ZMoDOTU1NBrGqqirDMxBZKpdRxIR2WQMINDo6qhNAJvx+P0UiEQoGg3wKctvb29t5TZSCaQMI1NraqhNYW1u7HSGuXq9X126z2crWgmkDQDQapcXFRZqcnKSxsTFexVnAQCgUourq6lsD9fX1ZevgvwxkATFkBKPDEtze3qZwOMxN5WagoaHBegMQ393dJY/HQ21tbVRXV6cTzaXlBmRZpvHxcb7mc4WQ9tzUZ2mpAYx8ZmbGIDIwMECrq6sUj8f5BpRrxFID7I+DB8wVd7vdumWWX4SWGlhfX9eJgzs7O1prJkOBQEDXbukqmJ+f1wUHY7GY1prZJ/r7+0v2KQTTBpaWlgzBfT4fHzm4srJiaAcxTWgvBtMGsPTyg2M19PX1UW9vr6EtS/TBVl0Mpg0gxT09PQVFsmxpaaHh4WHdM6fTSexbQ4tiRFEDauoUv5kbDVgJLpfrttKz+wHuu7u7ebBkMkmdnZ38+cjISKYIMU2pM1L2vpL85zMpJyjeTOzCBtgLN1/ekhTxkiphv78zgkxsbW3xPWFiYoJmZ2f5ahAEB6NbR4fDzWtAR4eD3IKgo4PRmAFZpJuVHkoHHdw1KTI3VgwZUVzvyPSMwMO8jjBRuAYUiaRvHhLfP6d04DVJP9+TkmDLSmVmOO4MPYwBgI1aiYdJ9NuYkWecab+dbjbekRz9QHIsRMrBDxbnngZwYin1UapKSZJ/+Sg994rEqSc8K9zQ1FNOKzJQWf6znJljtaDsf+dTk/7UQeIcy8zHlyzOPQ0A7GCygcNC7h9McTAzyBbqgRWsJQZwVsNxCSbwuVVqC82HJQYAJlpxdnbmx4kFRYmNwgwtM5AFjks4seDQgBVSjvfbiAT6B8ZdizDEXhtSAAAAAElFTkSuQmCC'
  },
  'external_AmazonIN_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Amazon India', 'section': ['', '<b><u>AmazonIN Settings</u></b>']
  },
  'external_AmazonIN_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96,
    'default': 'http://www.amazon.in/gp/search?ie=UTF8&keywords=%ARTIST%&index=music'
  },
  'external_AmazonIN_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_AmazonIN_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_AmazonIN_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_AmazonIN_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 1, 'cols': 24, 'default': '',
  },
  'external_AmazonIN_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_AmazonIN_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAPjSURBVFhHtVdLSxtRGJ2f4KqUvnAldFdfqE2kERRcCoJbEwOKoghSC+6y0IU7deELLS40ieBC66YStZJFWyhiUxcqhSpIIqLxrUmcmXy952aimcwkmdrxwEmYuXO/c+53v3tnrpCOi4uL11dXV87z8/MuM8liOth/gSKjxfX19bOzs7O5w8PD+MHBAYVCIVOJmIjNTMwxM08V2QQgHg6Hd9kDFI1GKR6Pk9lATMSGBtP6za6fKPKCwEbuR8NjCKdDlmVugmXCx8Ux50gN3BkBTCIIyxodHR3R8fExRSIRfs/oAPA805SReQEFh/kx0vnk5ITGxsaooaGBKioqqKSkhNNqtVJTUxMtLi6SKIrK05kBLdQF07YLqFBcZAM6rK+vU1VVFRUXF2dlZ2cnn+tcCAaDdHl52WXIAB6urKzUiBUWFmrugchSrowiJrRzGkCgvr4+lQAy4Xa7KRAIkNfr5VOQ2l5fX89rIhsMG0CgmpoalcDKysrdCPE/Pj6uardYLDlrwbABYHNzk+bn52l4eJj6+/t5FScBAz6fj4qKiu4MlJWV5ayDfzKQBMSQEYwOS3Bra4v8fj83lZqB8vJy8w1AfGdnh3p7e6m2tpZKS0tVoqk03YAkSTQ4OMjXfKoQ0p6a+iRNNYCRT0xMaEQ6OjpoeXmZ9vf3+QaUasRUA+zFwQOmirtcLtUySy9CUw2srq6qxMHt7W2lNZEhj8ejajd1FczOzqqCg3t7e0prYp9ob2/P+oweDBtYWFjQBJ+cnOQjB5eWljTtIKYJ7Zlg2ACWXnpwrIa2tjZqbW3VtCWJZ7BVZ4JhA0hxS0uLrkiS1dXV1N3drbrncDiIfWsoUbTIaCAeOcFv4kIBVoLT6byr9OR+gOvm5mYe7ObmhhobG/n9np6eRBFimiKnJAe/kvTnM8lhFG8itr4B1uH2y3sSA+MUF7Hf3xtBJjY2NvieMDQ0RNPT03w12PLzyGXLfxDRV5sBKUq3Sy0U89q4a5IlbiwTEIj9PIjoq18Dskjit16Kjr6imOcdiT9HST5nyyrOzHDcG3ocAwAbtbzvp6jbwoy85Iy5rXS79oGkzY8k7flIPvhBLnsd0dqULgfqXJx6bSD64qPUke2jNC7ekPRrkmIzbyk68pxnhRsaecGJ9a6HgYFdFfWAvshAQe7PcmaO1YIc+s6nJvapgaIzLDNTb/7fAMAOJms4LKS+YDKDmUG2UA+sYG12NpdrLl3m1dk59dpA9OUGcFbDcQkm8LmVbQtNh2ATSHA9kOibBBN9cnp66saJBUWJjcIITTOQBI5LOLHg0IAVkotCvhLoIcwX6C+VWYq0/AaO1AAAAABJRU5ErkJggg=='
  },
  'external_AmazonIT_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Amazon Italy', 'section': ['', '<b><u>AmazonIT Settings</u></b>']
  },
  'external_AmazonIT_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96,
    'default': 'http://www.amazon.it/gp/search?ie=UTF8&keywords=%ARTIST%&index=music'
  },
  'external_AmazonIT_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_AmazonIT_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_AmazonIT_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_AmazonIT_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 1, 'cols': 24, 'default': '',
  },
  'external_AmazonIT_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_AmazonIT_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAPCSURBVFhHtVdLSxtRGJ1fIaUvuhK6qy/URmkEBfdCtj4CBkURpBbcZaELl7rQGkzpQpMILrRuKlErWbSFItZmoVJoA8EE0cR3Hs5Mvt5zM9GZTB5THA+chJl75zvnfve7d+YK+bi4uHh5dXVlPz8/HzaTLGY3+69UZPS4vr5+fHZ2tnR0dJSJRqMUiURMJWIiNjOxxMw8UmSzgHgsFvvLOlAqlaJMJkNmAzERGxpM6ze7rlDkBYGNPICGhxDOhyzL3ATLhJ+LY86RGrgzAphEEJY1Oj4+ppOTE0omk/ye0QGgP9OUkXkBBYf5MfJwPB6n2dlZstls1NjYSLW1tZxNTU3U09NDq6urJIqi0rs4oIW6YNpdAioUF6WAB7a3t6mlpYVqampKcmhoiM91ORweHtLl5eWwIQPo3NzcrBOrqqrS3QORpXIZRUxolzWAQOPj4xoBZMLj8dDu7i75fD4+Ber2jo4OXhOlYNgAArW1tWkENjY2bkeIf5fLpWm3WCxla8GwASAYDNLy8jJNT0/TxMQEr+IcYMDv91N1dfWtgfr6+rJ18F8GcoAYMoLRYQnu7e1RIBDgptQZaGhoMN8AxA8ODmhsbIza29uprq5OI6qm6QYkSaLJyUm+5tVCSLs69TmaagAjn5ub04kMDg7S+vo6hcNhvgGpjZhqgL04eEC1uNPp1Cyz/CI01cDm5qZGHNzf31dasxnyer2adlNXweLioiY4GAqFlNbsPjEwMFCyTyEYNrCysqIL7na7+cjBtbU1XTuIaUJ7MRg2gKWXHxyrob+/n/r6+nRtOaIPtupiMGwAKXY4HAVFcmxtbaWRkRHNve7ubmLfGkoUPYoayCTj+M1eKMBKsNvtt5We2w9w3dvby4MlEgnq7Ozk90dHR7NFiGlKnpJ8+JWkP59JjqF4s7ELG2AP3Hx5S+KuizIi9vs7I8jEzs4O3xOmpqZofn6erwbhhUCCVUtrl5XXgIZWdk8QNLQy6jMgpehmzUFpn5W7JlnixoqBizq1dG45lVYVmAligmrCROEakEUSv41R6v1zSnvfkPjzPcnnbFllmBmOO0MPYwBgo5bDAUp5LMzIM860p4lutt6RFPxAUshPcvTH/Q3gxFLqozQjJkj65ab0wmtKzTzhWeGGZp5ympGByvKf5cwcqwU58p1PTfqTjVILLDMfX93fAMAOJls4LKhfMMXBzCBbqAdWsKYYwFkNxyWYwOdWqS00H6YYAJhoxenpqQcnFhQlNgojNM1ADjgu4cSCQwNWSDnebyMS6B+k6HTYPVbYKwAAAABJRU5ErkJggg=='
  },
  'external_AmazonJP_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Amazon Japan', 'section': ['', '<b><u>AmazonJP Settings</u></b>']
  },
  'external_AmazonJP_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_AmazonJP_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96,
    'default': 'http://www.amazon.co.jp/gp/search?ie=UTF8&keywords=%ARTIST%&index=music'
  },
  'external_AmazonJP_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_AmazonJP_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_AmazonJP_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 1, 'cols': 24, 'default': '',
  },
  'external_AmazonJP_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_AmazonJP_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAPpSURBVFhHtVdLSxtRGM1P6KpIX0uhu/pCrZFGUHAvuLUaMCiKILXgzkVcuKsufKGlC40KLrRuGuKLLNpCEWuzUCnUQEiCaBLjK4kzk6/33GR0HnmMdXrgSzJz73zn3HO/ezPXosX5+fnLy8tLezwe7zczWM529l2apdHj6urqydnZ2fLx8XE6HA5TKBQyNZATuZmIZSamJEubAcgjkcgR60DJZJLS6TSZDeREbnAwrt/s+nGW3mJhI/ei4X8QayFJEhfBnPBwcsw5rIE6I4BIJGGu0cnJCZ2enlIikeD3jA4A/RmnBOctKDjMj5GHo9EoTU1NUWtrK9XW1lJlZSUPq9VKHR0dtLa2RoIgZHvnB7hQF4z7rQUViotCwAM7OzvU0NBAFRUVBaOvr4/PdTEEg0G6uLjoNyQAnevr63VkZWVlunsIuFTMUeQEd1EBSDQ8PKwigBMul4v29vZocXGRT4GyvaWlhddEIRgWgERNTU0qgo2NjdsR4nt6elrVXldXV7QWDAsAfD4frays0Pj4OI2MjPAqlgEBHo+HysvLbwVUV1cXrYN7CZABMjiC0WEJ7u/vk9fr5aKUDtTU1JgvAOSHh4fkdDqpubmZqqqqVKTKMF2AKIo0OjrK17ySCLYrrZfDVAEY+czMjI6kt7eX1tfXKRAI8A1IKcRUAeyPgydUkg8NDamWmbYITRWwubmpIkccHBxkWzMOLSwsqNpNXQVLS0uq5Ai/359tzewTPT09BfvkgmEBq6uruuSzs7N85Ai3261rR2Ca0J4PhgVg6WmTYzV0d3dTV1eXrk0O9MFWnQ+GBcBih8ORk0SOxsZGGhgYUN1rb28n9q6RzaJHXgHpRBSfmYsssBLsdvttpcv7Aa47Ozt5suvra2pra+P3BwcHM0WIaUrESAp+JfHPF5IiKN5M7twC2AM3W+9I2JumtID9/k4InNjd3eV7wtjYGM3NzfHVYLPZ+Hz/S+BZvQNikm7cDkot2rhqkkQuLB+QKCfCR0STHzKB3zmAZ3PXgCSQ8M1JyckXlFp4Q8LPSZLibFmlmRiOO0E5BWxtEZU8IrJYMoHfuKdBfgEAG7UU8FLSVceEPOeRclnpZvs9ib6PJPo9JIV/6AVgtEpypQiNE1wATiyFXkrTwjWJv2YpNf+akhNPuStc0MQzHjoBsFxLLgfaFJAdKC3+Ws7EsVqQQt/51KQ+t1Jynjnz6dXDBQDsYLKNw4LyDyY/mBi4hXpgBasTcN8pAHBWw3EJIvC6VWgL1UInALhPEcpgpI9jsZgLJxYUJTYKI5FTAIDRwnKEZuQyVAJk4LiEEwsODVghxeJhG5GN/gINnfWgc7N/5AAAAABJRU5ErkJggg=='
  },
  'external_AmazonMX_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Amazon Mexico', 'section': ['', '<b><u>AmazonMX Settings</u></b>']
  },
  'external_AmazonMX_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96,
    'default': 'http://www.amazon.com.mx/gp/search?ie=UTF8&keywords=%ARTIST%&index=music'
  },
  'external_AmazonMX_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_AmazonMX_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_AmazonMX_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_AmazonMX_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 2, 'cols': 96,
    'default': 'Amazon Mexico did not contain a music section as of the last script update, and probably won\'t return a useful result.',
  },
  'external_AmazonMX_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_AmazonMX_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAPnSURBVFhHtVdLS9xQGM2vkNIXXQnd1RdqVRpBwb3g1hcoiiJILbibhS5c6kKraOlCRwUXWjeVUUdm0RaKWOtCpVAFURHfz5kxyXz9zp2MJpNJJsV44ExI7s13zv3ud+/kSsm4uLh4fXV1VX9+ft7uJTlmLV8zdRkrrq+vn56dnU0dHBzE9vf3aW9vz1MiJmKziSk280SXjQPix8fHW9yBIpEIxWIx8hqIidjQYK0/fJ+hy0sSjzyEhscQToamacIEZyIgxDHnSA3cuQFMIghnjQ4PD+no6IjC4bB45nYA6M+aGjIvoeAwP25ePjk5ocHBQaqqqqLCwkLKzc0VLC4uprq6OpqdnSVFUfTe9oAW6oK1ayRUKG6cgBeWl5eptLSUcnJyHNnW1ibmOh12d3fp8vKy3ZUBdC4pKbGIZWVlWZ6ByFK6jCImtNMaQKDu7m6TADLh9/tpdXWVJiYmxBQY2ysrK0VNOMG1AQQqLy83CSwsLNyNENehoSFTe1FRUdpacG0AWFtbo+npaerv76eenh5RxQnAQCAQoOzs7DsD+fn5aevgvwwkADFkBKPDElxfX6dQKCRMGTNQUFDgvQGIb25uUldXF1VUVFBeXp5J1EjPDaiqSr29vWLNG4WQdmPqE/TUAEY+PDxsEWltbaX5+Xna2dkRG5DRiKcG+I9DBDSK+3w+0zJLLkJPDSwuLprEwY2NDb01nqHx8XFTu6erYHJy0hQc3N7e1lvj+0RLS4tjn1RwbWBmZsYSfGRkRIwcnJubs7SDmCa028G1ASy95OBYDc3NzdTU1GRpSxB9sFXbwbUBpLixsTGlSIJlZWXU0dFhelZbW0v8raFHscLWQCx8gt/4jQ6shPr6+rtKT+wHuG9oaBDBbm5uqLq6Wjzv7OyMFyGmKXxK2u43Uv9+Je0YxRuPndoAv3AbfE/K6hDFFOz390aQiZWVFbEn9PX10ejoqFgN0iuJJNlMuUYWNWCizM8kyUSZac2AGqHbuUaKTsjCNWmqMGYHIeoz07fk01sNYBPEgkbCROoa0BRSvndR5ONLio6/I+XXR9LOeVnF2IzAvaHHMQDwqLWdEEX8RWzkhWDUX0y3Sx9IXftE6naAtP2fjgZkPe1bwaC9AZxYnD5KY8oNqb9HKDr2liIDz0RWhKGB54J2BmpQB2wA84xrkO9TGuAMZKb/LGdzXAva3g8xNdEvVRQZ48x8fmNrAIUo+2RhBLTNAMAHkyUcFox/MPZgM8gW6oEL1nEKdBNBpykAcFbDcQkm8LnltIUm48FFmACLZpyenvpxYkFRYqNwQ88MJIDjEk4sODRghaTjwzYiif4B1oFZPHSFSXEAAAAASUVORK5CYII='
  },
  'external_AmazonUK_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Amazon UK', 'section': ['', '<b><u>AmazonUK Settings</u></b>']
  },
  'external_AmazonUK_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96,
    'default': 'http://www.amazon.co.uk/gp/search?ie=UTF8&keywords=%ARTIST%&index=music'
  },
  'external_AmazonUK_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_AmazonUK_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_AmazonUK_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_AmazonUK_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 1, 'cols': 24, 'default': '',
  },
  'external_AmazonUK_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_AmazonUK_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAQlSURBVFhHtVdLSyNZFK6f0KtGpnsaVw2za1+oozIRFFwKgltfoCiK0rQD7mqh0O7Uha2iQxYaI/RCx01L1JEsZgYGUceFSsMoiIr4iO8kVlVOn++mSqtSeVSTmg9O6tZ9nO+75557U1dKxM3NzU93d3ct19fX79009tnEz7c6jR339/c/XF1dfT49PY2dnJzQ8fGxqwaf8M0iPrOYHJ02DpBfXFzscweKRCIUi8XIbcAnfIODub7y+0udXpJ45kE0/B/EidA0TYjgSAQEOdYcoYE6J4BIOOGo0dnZGZ2fn1M4HBZ1TieA/sypIfISEg7r42Tw5eUljY+PU319PZWWllJhYaGw8vJyam5upsXFRVIURe+dGuBCXjB3o4QMxUs6YMD6+jpVVlZSQUFBWuvu7hZrnQlHR0d0e3v73pEAdK6oqLCR5eXl2epgiFKmiMInuDMKgKOBgQELASLh8/loa2uL/H6/WAJze11dnciJdHAsAI6qq6stBCsrK08zxHNiYsLSXlZWljEXHAsAtre3aX5+nkZHR2lwcFBksQEICAQClJ+f/ySguLg4Yx58lwADIENEMDtswZ2dHQoGg0KUOQIlJSXuCwD53t4e9ff3U01NDRUVFVlIzea6AFVVaXh4WOx5MxHCbg69Ya4KwMwnJydtJF1dXbS8vEyHh4fiADILcVUA/3EIh2ZyWZYt2ywxCV0VsLq6aiGH7e7u6q3xCM3OzlraXd0Fc3NzFuewg4MDvTV+TnR2dqbtkwyOBSwsLNicT01NiZnDlpaWbO0wLBPaU8GxAGy9ROfYDR0dHdTe3m5rMwx9cFSngmMBCHFbW1tSEsOqqqqot7fXUtfU1ET8raF7sSOlgFj4Er/xFx3YCS0tLU+ZbpwHeG9tbRXOHh4eqKGhQdT39fXFkxDLFA6RdvQnqf99Ie0CyRv3nVwAD3j84wMpWxMUU3DePwtBJDY2NsSZMDIyQtPT02I3eHJeUE+PTLm5MkmS58k8nkaSJUkYyuY2SWqk2lqZ67lsi4AaocelNor6PUI1aaoQlgo9NbX800ihj0M0NEQsZI0JZE7CNeKCMJRRJ0leJt6nTf+GGCMnEyCgKaT81U+RsTcUnf2FlM0x0q55W8VYjMCzoPhsnp0aQrzefZOA/aR9cnM5MkkFADxr7TBIEV8ZC/lRWNRXTo9rv5K6/RupBwHSTv6Jh5pnCJLNTR63wyRjQxQKcVkXIMqmeq+XxBixNLixpPsojSkPpP47RdGZnyny6ZWIihD06bUwrLFB9L2GsYjA28yf5SyOc0E7/lssTfT3eorMcGS877IXAPDFZA2XBfMfTGqwGEQL+cAJm/USALir4boEEfjcSneEJiLrJDTApC9DoZAPNxYkJQ4KJ5b1NkwErku4seDSgB2SybI6iHJe0DcKHnsUO/9EFgAAAABJRU5ErkJggg=='
  },
  'external_Bandcamp_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Bandcamp', 'section': ['', '<b><u>Bandcamp Settings</u></b>']
  },
  'external_Bandcamp_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'http://bandcamp.com/search?q=%ARTIST%'
  },
  'external_Bandcamp_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_Bandcamp_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_Bandcamp_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_Bandcamp_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'Bandcamp is a privately held company founded in 2007 by former Oddpost co-founders Ethan Diamond and Shawn Grunberger, together with programmers Joe Holt and Neal Tucker; providing an online music store launched in 2008, as well as a platform for artist promotion, that caters mainly to independent artists. Artists who use Bandcamp are provided with a customizable microsite where the music they create can be uploaded and shared. All tracks can be played for free on the website and users are most often provided with the option to purchase the album or a specific track at flexible prices. The site also allows for artists to offer free music downloads with the option to donate to the artist or to receive a free track or album by joining the artist\'s email list. Other options include sending purchased music as a gift, viewing lyrics and saving individual songs or albums in a wish list. These options can be toggled by the artist depending on how they plan to price their music. The options provide smaller and independent artists with a free online presence for their music, while making the process of selling their music easier. Uploading music to Bandcamp is free, but the company takes a 15% cut of sales made from their website (in addition to payment processing fees), which drops to 10% after an artist\'s sales surpass $5000. Bandcamp\'s website offers user with access to an artist\'s page featuring information on the artist, social media links, merchandising links and listing the artist\'s available music. These options can be toggled and customized on the artist\'s page allowing artists to change the look of their page, and to customize its features. In 2010 the site enabled embedded/shared links in other microblogging sites such as Facebook, Twitter, WordPress, Google+, and Tumblr with options for email. In 2013 Bandcamp launched mobile apps for iOS and Android devices, with compatibility for Blackberry 10 devices through app sideloading, providing the ability to download music straight from the app and allowing access to artist pages which have been optimized for mobile viewing.',
  },
  'external_Bandcamp_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_Bandcamp_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowNkNENTcxOTBGMjA2ODExQTk2MUFFOUU1QjE3OEVDQSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2MTA0NzhDRTY3NUIxMUUyOEE5MUMzM0NFRUNERTVGMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2MTA0NzhDRDY3NUIxMUUyOEE5MUMzM0NFRUNERTVGMCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjA3Q0Q1NzE5MEYyMDY4MTFBOTYxQUU5RTVCMTc4RUNBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjA2Q0Q1NzE5MEYyMDY4MTFBOTYxQUU5RTVCMTc4RUNBIi8+IDwvcmRmOkRlc2NyaXB0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'
  },
  'external_Beatport_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Beatport', 'section': ['', '<b><u>Beatport Settings</u></b>']
  },
  'external_Beatport_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96,
    'default': 'http://www.beatport.com/search?query=%ARTIST%&facets[0]=fieldType%3Aperformer'
  },
  'external_Beatport_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_Beatport_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_Beatport_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': '/%26/g, \'%2526\''
  },
  'external_Beatport_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'Beatport is an online music store specializing in electronic music and culture. Beatport is a privately held company owned and operated by Beatport LLC and based in Denver, Colorado with offices in Los Angeles, California, San Francisco, Tokyo, Japan and Berlin, Germany. It was founded in 2004, and in 2013 bought by Robert F. X. Sillerman\'s company SFX Entertainment, for a reported price of slightly over $50 million. Its annual revenue for 2012 was reportedly around $15-18 million, with losses of $2 million.',
  },
  'external_Beatport_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_Beatport_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABONJREFUeNq8V0tsVFUY/s69dzqvPmg7pSStdDSUYCu1C9oSEhvExChsjERCYmOmxkQi0YibxhUSFwY3LlBkRSvaRCHEGKXdGITEGGrFVFSCxcgU2kUfUzrtPNqZe+/x/GeenbkzbXQyf/LPnbnnP//3/Y/zGIakNJ7o8XnrjJNtjYa33s1R7zJRSglEFATCDLdnVb9/UT01+9HYEL1n9NH6btfgkc4q39GeZ1BXvVO+ZSit8OTH4vIkvvn1e3w2Hhq6+8F4P2t8u9v3+j518MWup2CyAMJrfuhmCLoRKikBTa2EplTCbfdC4fUY/ulHXBjX+9W257Z93b9v25Y47iG4Oom4EYZhxgVZVlIln+Q7HJsRAS7BW1uLm1PBTq3VY3gNtoRILCh4qiiHRGKLYMwAYWs1Toa4GYailgc8JabAJGytxi7aTdFg8s1NDEcV/DHpxD/TFeveP9YcwxM7o3A7N7l6FKDGHodmckWAaxvazwU0fHmlBldvVBa1O7A3hKOHgthar2+cBW4QARUmihP44YYLZy7UbiowIkj65isP8fTeyAYEdGhcZIDz4vX/9ur6qB9t1tHdsQa32KxcTo75gIqfb9lxbzoTyFdXqrG/Z6343iCwBQFWlMAnX1TBP22T39tb4zhyMCyfufLSwQj+vGvDxRG3fM4JUh9/vgXH+1aKEBBNyE1FMrGSa2N2kX6HjOR4X2gdcytp22HgvbeWk8Qr5dyWJgOH9q9aExDYikkZEOs/V8NRDUOX3fA2G/AdXrW0KaZv9EXl3EsjLunLyoawRfhiGVJEWUrpuzjiEBMZunbrcDnybUjHf6uQajVGSnPJB/kin/k2VILkVpmS+UUFA6ddciLJpVE72loNmd5cOTvslM/zHfnnxu2/VTmXZOSaHdfHKnB6IIKGOjPrgBIZ4DklGL9lS4Nn19y6TEyqZRly+oTsyPd6G0kgfSqnmedLYjwSYZiaVgp29XyASZvsOblZyfZJ2JKAbAW5HEVEEWZ5ltPY2eEKDHzoEOnU5O/s5eQXxGiMbBJZtdjGIyyNk8BEYh9gjBrETLIsHOGe3SZ++V3FpwSCWPq9f0bB+2cqEBFpJptCku2bMJMl4FCYlj63G+q4ZQlorLfHwLGXE5vQueHMYZQCpzGySTR1fiZbmngaR2ISdsJ9hpk1gYz0dmdIpM/3FHi3UXSu28mzQkpgygwwRUlVGo+3GgVudBnt7dYFYKYE9J3e5drlSsJ3YowwCVvjaTY8WWcDl0dtOfD5DgnQk1zTbTtMC8rcooeMtB/ZhJBNaEIhNiwR+Xaxfb7zGsfUjJpVFlFXZhaICJYdT6U8/Hwsq/6G8K2nbSUmp4sAEWCKYJQB2NMRE/r/rlwN9aYgUPhSQpiELUpgiB/UmUZZ74QpTG0tboorM+0FXKakLODiDkqYy1FBYD5kghsMNtWBNX2lLAQ0xSUxl1fFKri/aPqXgmFvw1YPYkawLATcFR7Mz4VB2CpvbwyqZviFXU3NqHLXirrEZW04j1us6/+uTDSdw1Yt/gu0IBa147uxO5h4EDsh98vtxzoHn213+w48uQsNHg9UVVwUtNL+PdV1EZYhLrALCxi9eQfX/woP3T830Z9G8bza6WusxslHarm3ygGQllJWVhP64CHzzy7j1ML5Cfn3/F8BBgD35aA+vllSYAAAAABJRU5ErkJggg=='
  },
  'external_BigCartel_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Big Cartel', 'section': ['', '<b><u>BigCartel Settings</u></b>']
  },
  'external_BigCartel_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'http://www.google.com/search?q=site%3Abigcartel.com%20%22%ARTIST%%22'
  },
  'external_BigCartel_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_BigCartel_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': true
  },
  'external_BigCartel_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_BigCartel_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'Big Cartel - Founded in 2005 to help our co-founder sell his band\'s merch, Big Cartel is now home to over 500,000 independent artists worldwide, and growing like crazy. Like our stores, we are designers, musicians, crafters, painters, and technology nerds, spread across the globe. Our team is small but mighty, and we love what we do.',
  },
  'external_BigCartel_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_BigCartel_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4zjOaXUAAAAO5JREFUSEvN1bFtAkEQhWFquQhnpggI3ABGdAA1kFIARWCTIZfgjB6gABCkBASA9L8XjHS60woJzX3Z7uzOk06avV71ZhkBH/CiWB9eBBkBB3zDW63G2MNbQUbAA3f84hMuQztr6KRuuRzkBUQnzDHDES5jB7cIuhHQ5IolvuAWQVcD/jHECje4RdC9gAU0hhouF+AWQUZAHJy6HzSdcYsgI+AM3yh2gVsEGQFb+F6xP7hFkBGg8dEz4NutdHIEtwgyAmQCPdTuVKPqFL5Wkxcg+jXqx6nhkg0G8NEG2QGRHjh9Om8V6FLAa94cUFVPmk4rZLNsakcAAAAASUVORK5CYII='
  },
  'external_Bleep_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Bleep', 'section': ['', '<b><u>Bleep Settings</u></b>']
  },
  'external_Bleep_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'https://bleep.com/search/query?q=%ARTIST%'
  },
  'external_Bleep_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_Bleep_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_Bleep_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_Bleep_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'Bleep Limited is a British online music store focusing on the independent music sector. Created by Warp Records and launched in January 2004, Bleep was one of the UK\'s first legal music download businesses and the only one to originate from within the music industry. The store offers single track or whole album DRM-free mp3 and WAV downloads alongside vinyl records, CDs, DVDs, T-shirts and other merchandise. Since its launch, the range of music offered by Bleep has grown and now provides music from independent labels including Rough Trade, Domino, Beggars Banquet, One Little Indian, XL Recordings, Ninja Tune, Stones Throw, Hyperdub, Planet Mu, Tempa, and many more. In addition, a large catalogue of rare titles has been acquired from many small labels from all over the world.',
  },
  'external_Bleep_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_Bleep_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyMzRGMjgwNzUwNzYxMUUzOENBRUI1MTJEM0Y4QjMzNSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyMzRGMjgwODUwNzYxMUUzOENBRUI1MTJEM0Y4QjMzNSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjIzNEYyODA1NTA3NjExRTM4Q0FFQjUxMkQzRjhCMzM1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjIzNEYyODA2NTA3NjExRTM4Q0FFQjUxMkQzRjhCMzM1Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+gSYwrwAAAdFJREFUeNpiNDe3PsDAwKAMxDIM9AVPgPguywBZzgCzk2mALIc7golhgMGoA1gIKag80UTQkP///jH8+PSD4e3jNwwPT99juLDxLMOnlx/pFwKMTEwMnAJcDDK6cgzWSQ4MaSvzGDRddAYuClg5WBn8m0IYJDSkBi4NgELFMMCE8jSADn5+/ckwLaAPRYxHhIfBtcibQcFUCUVcVFmc+g5g+P+f4cfn7yhCIP6hWXsxHEDXNMDMwowh9vjCQ+qHACMTI4OAtCCKGK8oH4NzgSeK2LcPXxnOrDpBfQewcbEzZK4txKvm04uPDOurVzJ8fv1pYHLBn99/GPjE+QeuHBCSFWYIbAtnMA41p34U/P7+i2FN2XIUMQ4+DgYVK3UGXW8DFHGHLFeGa7suM3z/+I16Dvj39x/Dg9N3McRv7L3KwMzGzKDlqotIL5xsDOoOmuC6gS5R8Oj8AwwxQWB00C0NCEoLYc22NC8HQFlTyVyFwTjEDEP9hyfv6V8OINoJ/xnuHr81cC2i8xtOM3x8/mFgHHB52wWGPf3baVAb4sqef/4yfHj2AVgBPWC4vP0iw2MsOQJrmgL2jP6PNstHvAOeDKD9T0AOuDtAjgB3zwECDADaL4gW9nGVswAAAABJRU5ErkJggg=='
  },
  'external_Boomkat_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Boomkat', 'section': ['', '<b><u>Boomkat Settings</u></b>']
  },
  'external_Boomkat_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'http://boomkat.com/products?q[keywords]=%ARTIST%'
  },
  'external_Boomkat_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_Boomkat_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_Boomkat_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_Boomkat_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'Boomkat - A specialist music website brought to you by a dedicated team who have been operating in this field for over 7 years now - building up a huge resource of information and opinion about music that exists beyond the radar. Our product extends to cover the most underground forms of Electronic music, Hip Hop, Post-Folk, Alt.Country, IDM, Electro, Acoustica, Post-Rock, Ambient, Micro House, Detroit Techno, Mentalism, Electropop, Indiepop, Grime, Free Jazz, Modern Composition, Cologne Techno, Future Disco, Drone, Sublow, Soundtracks, Noise and out and out post-generic objects of wonder.',
  },
  'external_Boomkat_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_Boomkat_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzhBOUNGNjcxRjUyMTFFMUE1RTRDNkJBODFBMjQ2Q0MiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzhBOUNGNjgxRjUyMTFFMUE1RTRDNkJBODFBMjQ2Q0MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3OEE5Q0Y2NTFGNTIxMUUxQTVFNEM2QkE4MUEyNDZDQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3OEE5Q0Y2NjFGNTIxMUUxQTVFNEM2QkE4MUEyNDZDQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv9ew7UAAAP+SURBVHjatJdpSFRRFMfPvLmjlrYJfagox7CCaIGIEoJog760fxAtmyW1zT6VFvQh8WPpGFGo0TKmaWBBhC30IaigNIgyRdqgpn2xbDGdeaPv3e65M296M/PebE5/vD7ve/ee37nnnnfu0wB+1ThbbOPGjqmYmDnBPCotDUanpUIyNegRwe3xQG/fD9ev3/2Ve+2bGwIPTzRfct552En7B91UpvS/NmTcf9xNkYlsg+Nss23R/LnOhXNmsZ4BJEkGNhDYz4hkK9kCDaeaA31mGgT2y2gUAI23d/bA456ndmFsRkbFDPNUGJYoiN5hdmUOyOhA4g3hTaeb+VW5hzbRto9BYXZONiCbZI4fZ04hJnZT0l3Nth1b4ezJpojP1Wo6fR5woY3saikuDJuLLGQim6SmpLCQyyBQQdN40U5LwNCZ+kbeD1XjqfNAjIZAf/Gyxfz64PYD/sxS4purFjKRzRwwsf0x8DCFw61sNU2wZEUu3LvVAVuZE9gnRiHi/iNY7cj07Jww+8hENmFbown3iQZgS1bmcsNoVAFoSYGqnSmwb9ZkIJvwJImS0XrAUFiksVoMZBMlS+OReo+jjVPGaDH8DshxOxANHArXd0BmOcA2YkepPeGCo5UTyr3gCITPRTZzQIYLzpawh+fazkGtozZuuDpCarislYQyvv4J1lz1KmORXtVM2IHQVeq9FdGcIvJIT52Y4FSzEMk8AnJyHIj2ZoSGHgs3soVkRUDLCSUqVCcHZF4H5OQ5ELoVkeoA9UeA4Kn0v6BqWlgO+E9EQkewBdFKcv+gB4p32aOVYprUxHOLXrBttwb6x2rqE3sNrWutEaudWt4hiX8rKDrqqA86cvXEkxDLoZ7UToSu2DssQWHRln/Q6vqIB49aOVMnwcfePl6KifqU0PqYUJxQnmdlZUOeNd/3v0RVXcxQRTOmTYaXbz/C5ImZ0Hj5+r8twMNH63NKHQnUtYs3wFFVGxd0X/luPmdm1hR48eYDn/fpWx/cvNsOxCuKkG8rgNeuV0GTsqaxlVrydZMnVpXtL4W21iv87+eu974DSBD4lzGyiej18l2orqmGsr1lQZOrDp+Iy4HyA3vC7ilw5Yo225/cgaULlgOyye8/Ay5Jksxa33DxvKAIv+qHqDUvdx50dXTBmrz1cITBO7ruwqrc1fDl23dAtjDodlduyivRPcFiaeUHSsPgCEb54Ov4yk3EyOFuFvruZy8B2XzQoaN1zoZLbZRNom6Pm7cNBRvp176fURuOUwUsqKE95e/1+Rvou8+99FHPC3qm9QpFplKSuQ5WHbelpaZWZKSnm1NMBEwmU1IPqaGhIVawhuHPwIDLI4qVosHV4ChzwF8BBgApiWk4tODWVQAAAABJRU5ErkJggg=='
  },
  'external_CDandLP_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'CDandLP', 'section': ['', '<b><u>CDandLP Settings</u></b>']
  },
  'external_CDandLP_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'http://www.cdandlp.com/en/search/?a=%ARTIST%'
  },
  'external_CDandLP_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_CDandLP_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_CDandLP_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_CDandLP_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'CDandLP.com enables you to buy and sell musical items at fixed price proposed by different sellers either private or professional. CDandLP.com does not sell anything, it\'s a marketplace, and we are intermediary of payment and third-party during the whole ordering process between buyers and sellers. You can easily find the music you like with the search engine and the categories. You can also register your wants list, we will inform you as soon as the wanted items are listed for sale on CDandLP.com',
  },
  'external_CDandLP_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_CDandLP_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': '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'
  },
  'external_CDBaby_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'CD Baby', 'section': ['', '<b><u>CDBaby Settings</u></b>']
  },
  'external_CDBaby_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'http://www.google.com/search?q=site%3Acdbaby.com/Artist/*%20%22%ARTIST%%22'
  },
  'external_CDBaby_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_CDBaby_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': true
  },
  'external_CDBaby_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_CDBaby_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'CD Baby, Inc. is an online music store specializing in the sale of CDs and music downloads from independent musicians to consumers. The company is also a digital aggregator of independent music recordings, distributing content to several online music retailers. CD Baby is one of the few sources of information on physical CD sales in the independent music industry.',
  },
  'external_CDBaby_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_CDBaby_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': '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'
  },
  'external_Deezer_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Deezer', 'section': ['', '<b><u>Deezer Settings</u></b>']
  },
  'external_Deezer_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'http://www.deezer.com/search/%ARTIST%'
  },
  'external_Deezer_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_Deezer_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_Deezer_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': '/%26/g, \'%2526\''
  },
  'external_Deezer_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'Deezer is a web-based music streaming service. It allows users to listen to music content from record labels including EMI, Sony, Universal Music Group, and Warner Music Group on various devices online or offline. Created in Paris, France, Deezer currently has 35 million licensed tracks in its library, over 30,000 radio channels, 16 million monthly active users, and 5 million paid subscribers as of 6 November 2013. The service is available for Web, Android, Kindle Fire HDX, OS X, BlackBerry, iOS, Windows Phone and Symbian.0',
  },
  'external_Deezer_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_Deezer_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKNSURBVFhH7dfvSxNxHAdw/4p6Hj2ydjftrt3Nu1UTIirBSItl5s+VurTNprPpbE1xM9ZkaitTKyVMk9iTIRkUpYjSk7IQeuCTwp4UZESE0IN3uyuaH08RJLaCPXhxx32+3Pd9n+99H3wzMllev4vhopk6bjl+RTL8niuqzJ2h3KwuJlk0I5lfvpYyt9KBdYvJkg6QDpCUAN7xSfTNvyOKXT61lpQAjuvD6IhNEQU1TrW2pQDNJ2ux0PGQeGDvWnes4tJwFOGZBcJS71FrWwrgLKjCnPceMWQLrDtWcbFvBFcfzxEnal1q7f8M8NeXINcoYdpl1eCyDZqXKRzHz+J5yx1ioLodzb5KjMe8hMtTtvlPeEiSseS3axg4QTO54kqRA++vTRCxhgiCvXWYnQ8TgS7b5tvwgJCDCUepxkYdsOWXI9YYIborPXC6S3B31E3YG4thC95E6+gEkW+tU9+lBjgsm/A15NTYqAP+Mw1Y7n1GPG0eRE9/PV4v3iBCkQvxlk9jaPEzUdry66dVA+xjsjDG7NA4dYzD2G2RGOwRYWXzMcLaiQBbhrLzInxhiSipFrHXFYQYuk9kWaoSAY4wLFZ02zWazvFYWZKJD28kdLLl+KaPEFN6D9p6JDx6ZSYuhyTIIzMwv/hC8M7ORACZycYAs1OjMI/DQLdIhAMCSpg83GJriFb2NIqsIpr8EmGpEMDb2yC09xNZhRWJAEfjHYBum4a7mgc+ysSntxKCbAV+6PuIWb0XHREZTxbMhLIM8tgccl9+J5RlSXfgTwAmTtkJa2Vz8ef7eUI28eAYASbGRBiZHHACDzFeX22PgYfOaIZOPkjs5qVEgFRKB0h9gH/haJbiw2lKj+e8/if7hYp3VOy3mwAAAABJRU5ErkJggg=='
  },
  'external_DigitalTunes_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Digital Tunes', 'section': ['', '<b><u>DigitalTunes Settings</u></b>']
  },
  'external_DigitalTunes_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'https://www.digital-tunes.net/search/%ARTIST%'
  },
  'external_DigitalTunes_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_DigitalTunes_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_DigitalTunes_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_DigitalTunes_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'Digital Tunes - The best download store on the planet for underground dance music: from Drum & Bass and Bass Music to House and Techno. Cheapest WAV/FLAC/ALAC prices in the universe. Pay with Bitcoin, Credit Card or Paypal.',
  },
  'external_DigitalTunes_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_DigitalTunes_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAANHSURBVFhH7ZdpT5NBEMf5UmJMEIgSUFAkGIFwSSsqiHglQMDSeIJcpQhEosQAkoIECxRBasul3FRBylloqVBKwQP9BOPstNs80IoYEHzRTf6Zmd3Zmd+zu31RLz42fpphP+Voax/uEvZDB9qcywPgAfh/AKpqn8FhX3+H/MC8rIe4CyLwPuoHxsVxuJx6hdYCgkMo/2TYGfALDALJXYlgn12KhmpIl2SQf8T/GNi+GCAyLpZii3XGPcDzmqdwyMcX0m9nUNOz0VEgTrpIczkFD8jmyXLhbaeK8oNCQ8HneADoxnpBqaqn9ZDwcGhXK6Gg+BHFmdJMsvGJYohOiCffYp3eHqCsQg7eeALhUZEIcInmHubbAV41K8CyOgO2dYMTgO1lRdl6RGw0xZVVFY5aJWT3DIAXTL5+Fa8g7I8A8nIZ2T0DKMU1ZpOvpUDwDgC4/gqgUJ6Pj8U9gKy0kOxOAST3JGSFANNzI7CC18j7ugBwdfW2Qaw4gfwRXTfEiM4715IQQHgFyyt2gHMxHOAJxfzE4hNFTgCmG2k3XQG6DIMg1dSBVItCW7M8Arn9zSDTNkD10jCUDb2Gyu4mWq8bVUNOTyO09LXTXsM3A2TjniLM71nTQ6leQzUeo83WKKBDp4XG4Q57bVSNTu0KUGMZAR+90kXiuQ6yETNtkLP4nvz7i+8gcLIZypcGwbphAq1tguZPT7eC1NTj3MulWNHBHVOvM05b6HIFsP0wwcL3ech1NGFJLG60fqCYAMybAZjftjoOGtsn8kMFABK0A+uTMPl1FmotozQXN/sGjFhzecPoCsAlM/dTcpapm2LV6hjFvwNgeuE4PSEAVz1+PRPzE/A0t/bbEwA/fRNZIUDqvJYasxOYQN1a6ARfnM8y2uty7RogZV5DlkkIUGju21S3e20C4vEEAqdaoEiwtmsAlfUjPlQ1+dsBMOXhHFtLd/cIubYCsBceMq2CE0guwi8IwMZlSwNOgKH1KXpspzBHCMCg5J/7oRjVih/BfL6fPXTezwWgBBPZXbFXzOde4l2yOaZ0o52eAbF4GAFYrMSTCEMA9nPjuVwSvHfu8/1cLgD7LQ+AB+DgAQ7y/yE158Ndwr+UvauX1y/oBh6oBNcH9QAAAABJRU5ErkJggg=='
  },
  'external_Discogs_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Discogs', 'section': ['', '<b><u>Discogs Settings</u></b>']
  },
  'external_Discogs_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'http://www.discogs.com/search/?q=%ARTIST%&type=artist&strict=true'
  },
  'external_Discogs_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_Discogs_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_Discogs_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_Discogs_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'Discogs, short for discographies, is a website and database of information about audio recordings, including commercial releases, promotional releases, and bootleg or off-label releases. The Discogs servers, currently hosted under the domain name discogs.com, are owned by Zink Media, Inc., and are located in Portland, Oregon, US. While the site lists releases in all genres and on all formats, it is especially known as one of the largest online databases of electronic music releases, and of releases on vinyl media. Discogs currently contains more releases than there are English-language Wikipedia pages, at 5 million releases, by 3.4 million artists, across over 600,000 labels, contributed from over 195,000 contributor user accounts - with these figures constantly growing as users continually add previously unlisted releases to the site over time.',
  },
  'external_Discogs_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_Discogs_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': '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'
  },
  'external_Ebay_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'eBay', 'section': ['', '<b><u>Ebay Settings</u></b>']
  },
  'external_Ebay_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'http://www.ebay.com/sch/i.html?_nkw=%ARTIST%&_sacat=11233'
  },
  'external_Ebay_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_Ebay_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_Ebay_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_Ebay_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'eBay is an American multinational corporation and e-commerce company, providing consumer-to-consumer sales services via Internet. It is headquartered in San Jose, California, United States. eBay was founded by Pierre Omidyar in 1995, and became a notable success story of the dot-com bubble; it is a multi-billion dollar business with operations localized in over thirty countries. The company manages eBay.com, an online auction and shopping website in which people and businesses buy and sell a broad variety of goods and services worldwide. In addition to its auction-style sales, the website has since expanded to include "Buy It Now" shopping; shopping by UPC, ISBN, or other kind of SKU (via Half.com); online classified advertisements (via Kijiji or eBay Classifieds); online event ticket trading (via StubHub); online money transfers (via PayPal) and other services.',
  },
  'external_Ebay_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_Ebay_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': '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'
  },
  'external_Facebook_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Facebook', 'section': ['', '<b><u>Facebook Settings</u></b>']
  },
  'external_Facebook_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'https://www.facebook.com/search/pages/?q=%ARTIST%'
  },
  'external_Facebook_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96,
    'default': 'https://www.google.com/#q=site%3Afacebook.com+%22%ARTIST%+Musician%2FBand%22'
  },
  'external_Facebook_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_Facebook_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_Facebook_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'Facebook is an online social networking service headquartered in Menlo Park, California. Its name comes from a colloquialism for the directory given to students at some American universities. Facebook was founded on February 4, 2004, by Mark Zuckerberg with his college roommates and fellow Harvard University students Eduardo Saverin, Andrew McCollum, Dustin Moskovitz and Chris Hughes. The founders had initially limited the website\'s membership to Harvard students, but later expanded it to colleges in the Boston area, the Ivy League, and Stanford University. It gradually added support for students at various other universities and later to their high-school students. Facebook now allows anyone who claims to be at least 13 years old worldwide to become a registered user of the website, although proof is not required.',
  },
  'external_Facebook_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_Facebook_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAOLSURBVFhH5Zf5TxNBFMeX+Jv+H8ZEf9Oo0HIZUUyUGBOkBzdisEgwCCIYUBCIIomGa7ccFQtqueQURBQUBESwHCJHOUUICOWSQzCY58yyFNquwoY1aPwmn/6yb9777szsdB5hKNOzifvMJKSrUEzK+EQgIT2EIuoQQYAJU0pfQoek3ZaO8tc34l/Ay7oeaO0agQ+aUd6obuyHGEUVHHVLaTN1SDBjyq7IVCzfc8orTduGAiem5kGR2wgB0SXgG1nEC5dvPYWEh3XweWSaRuKvWjQVJR5hyhOEhZR6i12q24fhhOd9EEqoP4K1SzKUvdHAyPhXsD2nGNp/Ur6TMBeTB0Njy2FyeoGX4uZSCryu50Fcei2kF6hBiZBn1tOzgJ9bOiVB94AWkrPfgZmIciTQj89z5EqZrzZKxhX34Bzo+aQFNuF9tRoXSVVAR+8YoI0ZSwhEZJD64zAE3y3TS8YVqb8K5haWmHLGelat0cU6XckC7eQ8NqBYMYDWHm+69Qm5UqMeYEqxq6iyQxcr8nsMWrTZeTNg45YKy8s/mFIrGh2fhbS89/T6Y/zX5efdAJ5+QwXGlLLGYng3gNfUUJ4hT1hjMbwbcP4vDeAkVQ39NI1tQ0zZNTWhnKvPMZSqXm/slg3gN+Si8ppu3dhtMVBY0a4buy0GVCUturG8GLCTKSEuoxbiEY+Km5kya8oqbdU9x8jC8nVjsQH8t78lA+v5Jz/Dv28G8F3QQipnHbARXA24BmXrG8CHBj4oZOEF9Ll+5mIG2KLbkbVzMmsCQ35nAF10wcY9FewuKOk39wzJg/DECuMZwAZ8IoqM8L5ZCOdD88D9Wi64XM0GR1RM4p8J4ssqlHCFgDulTNk1RclfoZ1fwJqT1QD5CwObARczVIyimjUWY2wAXcmSsxtYgzcDVwM4XmcAdSs++JzGdza24M3A1YCyoAk6+8bATELFEQJp0uEw9AXMzC7Sa8k2YCO4GPCNKoZB1Jzg5kcgJp1xX2KCdmpjR+8X2lVANHcTEWQlzM4v6XE7pcoo7hIqXtc8CGMTc6gHSRuxcVTuojsj3JCelimnOvvGYWrmG32DjUet1L0HNbwQi5qUnLI2uiPCOAVmfjcXJx6ni69KIIrfa+WUVB8lr6QbyS5kRtPPD12I+pZB2sgxj1SNwIG0YsoaC3VKBxBeQjHlxycCCeUtFCdY2ttn7WBKIRHET6FyW6fa52ppAAAAAElFTkSuQmCC'
  },
  'external_FreeDB_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'freedb', 'section': ['', '<b><u>FreeDB Settings</u></b>']
  },
  'external_FreeDB_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96,
    'default': 'http://www.freedb.org/freedb_search.php?page=1&words=%ARTIST%&allfields=NO&fields%5B%5D=artist&allcats=YES&grouping=none'
  },
  'external_FreeDB_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_FreeDB_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_FreeDB_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_FreeDB_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'freedb is a database of compact disc track listings, where all the content is under the GNU General Public License. To look up CD information over the Internet, a client program calculates a hash function from the CD table of contents and uses it as a disc ID to query the database. If the disc is in the database, the client is able to retrieve and display the artist, album title, tracklist and some additional information. Because it inherited the CDDB limitations, there is no data field in the freedb database for composer. This limits its usefulness for classical music CDs. Furthermore, CDs in a series are often introduced in the database by different people, resulting in inconsistent spelling and naming conventions across discs. It was originally based on the now-proprietary CDDB (compact disc database). As of April 24, 2006, the database holds just under 2,000,000 CDs. As of 2007, MusicBrainz - a project with similar goals - has a freedb gateway that allows access to their own database.',
  },
  'external_FreeDB_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_FreeDB_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAAF5SURBVFhHzZUBjoMwEAN5Ok/rz3o4dKhZHOAqNXeWTBqvs2vSSp3AczBeY1dIeDwez3mel8JKff42tuECgxk+IoBwCKCbGInt+v3tCaHV6TUBreoVeJJvksBwJ82rLk1INdEH9HrTQzi9gTRENfezdy9gT896rnnac0EtCKmpgKa6w70+zEFPzt4K0BtEDaKphwdIHrH1as8FiJ8EYIXqgV7pvtarPRdg+E2AqvtZvwGHdPd9FADd/a4B9pz3UGinAarZQa3Sz/vASrAF0BCxNqiag3o6C6pHdGwB/grL31G+onGM4khGsU++a61o2ovuu88o9skPjYH+o6ree4xin8MD1Cu/ClD914ziSoYlpAAJteeRUdw35m08UC8AXoCvzygerxqCFIDhVUfLjOI7gDd1PQVwnwhqjz2j+I8CMAiCFMAHnQXbM4q5sWspgMD53gscGcWVNElIAZKf8H1G8U01UGMfCN3DXqv7r9mQCiO4QzJ8k8I0/QDachmIpR1kNgAAAABJRU5ErkJggg=='
  },
  'external_GoogleSearch_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Google Search', 'section': ['', '<b><u>GoogleSearch Settings</u></b>']
  },
  'external_GoogleSearch_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'http://www.google.com/search?q=%22%ARTIST%%22'
  },
  'external_GoogleSearch_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_GoogleSearch_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_GoogleSearch_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_GoogleSearch_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'Google Search, commonly referred to as Google Web Search or just Google, is a web search engine owned by Google Inc. It is the most-used search engine on the World Wide Web, handling more than three billion searches each day.',
  },
  'external_GoogleSearch_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_GoogleSearch_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': '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'
  },
  'external_GooglePlay_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Google Play Music', 'section': ['', '<b><u>GooglePlay Settings</u></b>']
  },
  'external_GooglePlay_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'https://play.google.com/store/search?q=%ARTIST%&c=music&docType=3'
  },
  'external_GooglePlay_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_GooglePlay_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_GooglePlay_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_GooglePlay_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'Google Play Music is a music streaming service and online music locker operated by Google. Users with standard accounts can upload and listen to up to 50,000 songs at no cost. An "All Access" subscription, available for US$9.99 per month, entitles users to on-demand streaming of any song in the Google Play Music catalogue and the ability to create custom radio stations. Users can purchase individual tracks through the music store section of Google Play. In addition to offering music streaming for Internet-connected devices, the Google Play Music mobile app allows music to be stored and listened to offline. The service was announced on May 10, 2011, and after a six-month, invitation-only beta period, it was publicly launched on November 16. Google Play Music offers more than 30 million tracks for purchase or streaming. It is currently available in 58 countries for Android and iOS devices, web browsers, and various media players (such as Sonos and Chromecast).',
  },
  'external_GooglePlay_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_GooglePlay_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': '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'
  },
  'external_GooglePlus_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Google+', 'section': ['', '<b><u>GooglePlus Settings</u></b>']
  },
  'external_GooglePlus_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'https://plus.google.com/s/%ARTIST%/people'
  },
  'external_GooglePlus_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_GooglePlus_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_GooglePlus_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_GooglePlus_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'Google+ is a social networking and identity service that is owned and operated by Google Inc. Google has described Google+ as a "social layer" that enhances many of its online properties, and that it is not simply a social networking website, but also an authorship tool that associates web-content directly with its owner/author. It is the second-largest social networking site in the world after Facebook. 540 million monthly active users are part of the Identity service site, by interacting socially with Google+\'s enhanced properties, like Gmail, +1 button, and YouTube comments. In October 2013, Google counted 540 million active users who used at least one Google+ service, of which 300 million users are active in "the stream".',
  },
  'external_GooglePlus_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_GooglePlus_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyOTkyQjA3NThERDAxMUUyOUEyN0Y4NjY2QTExNDU1NiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyOTkyQjA3NjhERDAxMUUyOUEyN0Y4NjY2QTExNDU1NiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjA5REZCMkEwOERDMDExRTI5QTI3Rjg2NjZBMTE0NTU2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjI5OTJCMDc0OEREMDExRTI5QTI3Rjg2NjZBMTE0NTU2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+vThexgAABFxJREFUeNrEV31oG2UY/10+2qZtmnSr++oS13ZTWyWdC0KLbmvnKP5ThzqpUtn+kFnBjwnaDRQc8w9BOtAJzgmKutqhIPsQEYqTDelQi6Oakm51XSltOje3NulHvu5y7/nchaS55i5tA03f8Evu8rzv8/zufT7e5zhJkrCSw4AVHqbUm7HnGlwSz3fQZSPBvAz2BMJFLi+v3fHtJY/8B5dwwehTdS4pGvmdLi05ePAwV2Cpc575zZN0AYuGOyRIFkIuPhYWCXXMj4HGHLu/URUD5ImMPo+Rp4IxEVH6FSVGUGePmeNgM5lQYOQWS8A8Lwj10zEYY+DLK+BsboG1phZmxyYYiq3qSURo4uQxTP/QmV0aMkkbPAPym/Zi2xdnYbj7H8bf3I+Rlkb4T30atxsTMPheO64/4ULgfKeuHi3MiwFJE1J5Jba8dQSzXg/8Z7+ExARIYhSTp09gqvscOJMZW95+H+Lqtbo69JFKQGeOrWkPJSuH8NhImizQdTKuhEiU7GrOxv4cAbkeaKGg3KnIOVspbZtaJtzyISITkyOqqDhtrS/M6+pN1J85AmCaQGBCkdtr3QgZzSqZSN+8f1KRi9e9aWt3/jqoq1fRrd4BThOzF36M12xrCUr2vIBZQYLIOMQIU5IBlo1OBHsvY+byz2lrM+lNyBd0Qcj7J+6c+IDClqHiwBtY9cx++M0WzKzfhKojxxHu+wM3j74GJorK/HHa9gTkkXqv5YLkWXBtd03GcznfUQXr9iaY125A/tZHlNiY7O3B7XfaZCXJeQ9cGNDVQTZU9zSXM6XuQKYRGR1CpGtIuXZ82AUQASYy+KlI2cijBkN8S68+Xp1cU/3LVdV95n5AJpABPNXioCBimhcxeuozMIFHWf0O1Bz/BjP2NYgRmbR1C+lVnQU6DMkeAkxE6cOPwrF9F4o334+8deUkiFLu5cHucsNNVbL/8MswDPXLJUNdoRcoxckY8DbclzaXp3rJHqpD9aGjMIo87n73FUKeXvCU/+AMWPVkK9a9chjUYEAMBXGtbS91NTcWfQ48eOkfLmMlNLh3wP3J12DTfgy3PYtA9xnw//ricsqKyXOdGDm4D4yMGwuLsKblxewrodaMqlcPKU96+3s6ZISI5pzQwBXcOv25oiHPZl9yLTbNnYbp3iq6tzLeyFkK6fwnLjoenaZyvIF+Q/1XNPUsMgu4NIQGlL4RztYDCFjsCBILgclkOdkDFKAcJui/e3Y3I3xjkFzSpalHFwu5YPzYuxAm7qDQWYG6rp+w+vmXwFfWYMpaimDZehTUN2DbR50wsxiGD7aChUNLdkEyC/5+bLPm3plKbCh7eh9K6ncqnZCpsBhicIaC8SaC3j74u8/TTvVl1RTW9gxxKQQqc/6KVNszPFeKaUeEZXoZyfSSktITgruYy6dP2EsSGCuytwtMCi+lqcwWsh0f2VMFoTw+3rrRRef6sr8bGozG9tf/8nnSCKzE+F+AAQDcLn22XOtb+AAAAABJRU5ErkJggg=='
  },
  'external_HDtracks_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'HDtracks', 'section': ['', '<b><u>HDtracks Settings</u></b>']
  },
  'external_HDtracks_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96,
    'default': 'http://www.hdtracks.com/catalogsearch/result/index/?dir=desc&order=artist&q=%ARTIST%'
  },
  'external_HDtracks_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_HDtracks_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_HDtracks_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_HDtracks_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'HDtracks is a high-resolution digital music store offering DRM-free music in multiple formats as well as cover art (and liner notes via PDF file downloads for a majority of catalog offerings) with Audio CD-quality and high definition audio master recording quality download selections.',
  },
  'external_HDtracks_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_HDtracks_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAOBSURBVFhH7ZddUxJRHMb7Ks30YqllvqRCYYpIo5iIooy8uKYiqSgiiAgKuwJpU2YWRS+jZU05ky/VTXVR0411WX4SP8LT7qKHPXvMxhvtoovf7Jnnef7nPMscLvZYLBYrisfjGyLbIjgkpLM2pLOPSQuFcdhsSAUO883VbEsF9jIOjf8F/p0CT5dWsPRqneL2XJoE05klxp+//wTJ1E1GV/IgsyhndvdRQwq8+fADa59/UczOL5Lgq7Vvoral8Lew8HQVN2fvKDQlUjbL248/8fjFe0wnUmS/XUiB9MuvyKx8p4imHpHgg+efGH967iUSqdviepPxaCR/E+nlLxCSM2RPCVJg+v4HJNKfKHyReRJMLqwzfoB/gnjiFqPvh3DvHeL8NFtgJLECX3INvkSO3pFZEhxLvmZ8d3ABk/wMpcmZ5Kr8HJHXOyj8kJBhC3QFF+EKLlPYPQIJ9oWfMX5H/ywmplIq/QVsA/fAuf1wemJw+FVzgWVwweeYjPG5AjzPo8XzEM2eDI37LnoD8zKt/Y8Y38wJCEUTMKt0a98dUtw/zosaPSvlh8eyF1IuIAgCjK451HbePRDGjigCEwIMLlpv4Ojbbh+4hVrV/p0D2XtAClS1z+DyAalpDWFUfEO1bujIHS5xfSjBZFq7Y3SByhYBFRaacgsvPtXkfJ3ZD38oLuboueq2CFXAcYNXZXhcc4boAmWmCEoaaIpr+1FrdkPf5MbFhhDja01e+MamUFJP6zrzGFVAbxV1RaZUpMXppwsU1flxvm6UcE6kqrGPbFJtCVG+RMVVD4aDk4yuMfnkmalYHM0udu68IYDOHi9doFDvRUHNECG/2ovL9T2kgK5pVNRov8zQg+HAFPJVc4U1g9BbRlFi9FEzBTVe2T9ziUM4PEEXOFvlQZ6uj0J7lSMFtKYhxi/Rc/D6o4z+N4xNTrIvKZCn7cJpGY6gNeaCmnoP4xdfscM7EqG0fdF0Ib+8WXz78B4FKh04VWGn0Bg6SLDS2MP4F3Q2DPomcFKlS0iaWs8rbcDQcPZ+7EIKnC634WRZO07sIK01+nYSrDBwxNv1iy5ZxQJhef0nTpS24nhhHa4YmjA+nv3rKZELSFhtnTCZ29AoIj1N5nbYnV0k6HB1K7wsbTYHItFJWKyOPWlpc4DjuqmfXA0pcFT8L/BPFDjyT7Oj/Tg92s/zWNFvSc6DvcohrKoAAAAASUVORK5CYII='
  },
  'external_HypeMachine_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'The Hype Machine', 'section': ['', '<b><u>HypeMachine Settings</u></b>']
  },
  'external_HypeMachine_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'http://hypem.com/search/%ARTIST%'
  },
  'external_HypeMachine_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_HypeMachine_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_HypeMachine_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_HypeMachine_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'The Hype Machine is an MP3 blog aggregator created by Anthony Volodkin. The Hype Machine is a music database created in 2005 by Anthony Volodkin, a sophomore computer science major at Hunter College. The site was born out of Volodkin\'s frustration with music magazines and radio stations. He said, "I discovered MP3 blogs like Stereogum and Music for Robots. I couldn\'t believe there were people spending their time writing about music, putting up tracks so you could hear them. And I thought, there has to be a way to bring this all together." In 2005, Volodkin sent his site address to pioneers in the online music domain, including Lucas Gonze of Webjay, in order to gain feedback. Instead of sending a response, Gonze and others posted the link online. Volodkin observed, "[Hype Machine] got launched without ever being launched."',
  },
  'external_HypeMachine_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_HypeMachine_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAASSSURBVFhHrVf9T1tVGO5foD9P47+gTn5RE7WE1uE6hwNJNJNF5xITF0iMxmSufKelbKPUYVnZ0M1NIpQ1EJiUAZbNbm3tx5gwxiY2Fk0Gi6lxA0qnvX097+257bm3p1/i0zw595z7nud5b8+5556jKhajS51PWG/Ufdjlr7KfCOwNH/fvSRi8FYDE6xOBqnBXoGoIYzCWdts+vl6s32kO1IwYvRqh3aOGYkhiE2Z/zQj2pTKlYzpserw7WNOPT8gzKYakb7I7UHPGTrSobHE4eeOdZzq8uyI80f9Ck++1X62hA09T+fywzR0sN3g06+3XSWceUZS9Zut5iJqoTW346PUf3Gn0ajfTHQuJl5AA0ujRbp6eO/QstZMDx7zTV7mS7qAU5hnlM5fuKWKO/ahbsQc5cwInHBtYMnMlo2wndfSitil89dPh59KznQ1WsOUq4eg++NLVCKO+0zAVGgRn8BuweyzQM1UP+glNJj5PQuiFntRepbIEa8d4mUrXTS419Do/hfk7IUgmk5AL6xvrMBO6CIaJWrkOq03rluCbY6L55LL1qQ6vNrXISEEMmy/pwL/gphbFYWsrBuddJmj9gaNJEzD6tImZ3049qbLdfK9BalQm0TS+G36J3KWyJYL8Uw63DdquUT1Jm/FCb/L3VzvYRskcx/uK30nVMkiSn/AoDkJsM9OSFMR2JQTSfvJyfVpTmQAZBocKPyxsoxTYan+bO97xpVuwqlPDPc0LsDE9AX9aTHCv8iWIdhnEp1bi1nII2twZXdYLvVXkvUzIzGn57bSVSsgRNTTC2itlKVY8D2svp65XSRkPL9OoDAQhAfrxXdwE0Fsl+9hIQdfLYcQ5SCXkiHY0p0wJ79NExJLUtxbnaRSLJJgm92eZI9E7RwJqODfURwXkiC/fgVXy90vGkvn9D+ogKQg0KgMcxqZxXUZbmYBsCJA0sKW3gUpkY8PtglXti6lhoOb/RP+gd+WI/B6GliuMNuMlDoFsEkoBpGx0VIFr1kVlshG/exvW6qrhr7M2EP5+RFuVSMKFKXP6oZQJiJMQXwW2kQ0+Yn0X5hcWqJgS+PrhrM+9MvpCHtB/p5Vpsl7ia5hvIWq7Vg5H+w/A0PAgPHj4gMoWBs5858wl0Dtel+mJZLzEhQiX4vR+jxdMytbJPTDr/p7KpyYWD9FoFGavzoKx/xNom9mdrYek5rhvFJdiBPdjxHKsFmKxGCzeXoS+AQt81nMIDNYjYLvwOZwd7IMvzh2H9r6PoPH8fmi5XCnvK+myJSF6iuYI8XPsqUjykygHQ89RaLIeBv3wG+KwKO/L6wVIPNAra8fcHag+w+0gsoCJMnGpjiV7TUv0orYZ4Na5A7dknA5iyZLXxjLP/WM+3crEz82PUVs5em+STSnZOPI6clkoEQWN3lc3cm5KJWRty0s0yUWDV/Pw1Nz7amqTH3iI6CSHCdH8fyBqWUNvFXcwkYBb520fzchsxwmXc8yLwcBSQ5l4OCV7OJ4Jj9LhdGDp4zIqs304I7YdePQ2B/Zd5B/P94a7g9XDGOOMmHfQbgWgUv0LCIZS8Clax6YAAAAASUVORK5CYII='
  },
  'external_Itunes_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'The iTunes Store', 'section': ['', '<b><u>Itunes Settings</u></b>']
  },
  'external_Itunes_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'http://www.google.com/search?q=site%3Aitunes.apple.com/*/artist%20%22%ARTIST%%20on%20iTunes%22'
  },
  'external_Itunes_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_Itunes_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': true
  },
  'external_Itunes_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_Itunes_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'The iTunes Store, originally the iTunes Music Store, is a software-based online digital media store operated by Apple Inc. It opened on April 28, 2003, and has been the largest music vendor in the United States since April 2008, and the largest music vendor in the world since February 2010. It offers over 37 million songs, 700,000 apps, 190,000 TV episodes and 45,000 films as of September 12, 2012. The iTunes Store\'s revenues in the first quarter of 2011 totalled nearly US$1.4 billion; by February 6, 2013, the store had sold 25 billion songs worldwide. While most downloaded files initially included usage restrictions enforced by FairPlay, Apple\'s implementation of digital rights management (DRM), iTunes later initiated a shift into selling DRM-free music in most countries, marketed as iTunes Plus. On January 6, 2009, Apple announced that DRM had been removed from 80% of its music catalog in the US. Full iTunes Plus availability was achieved in the US on April 7, 2009, coinciding with the introduction of a three-tiered pricing model; however, television episodes, many books, and films are still FairPlay-protected. As of June 2013, the iTunes Store possesses 575 million active user accounts, and serves over 315 million mobile devices, including iPods, iPhones and iPads.',
  },
  'external_Itunes_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_Itunes_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': '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'
  },
  'external_JunoDownload_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Juno Records', 'section': ['', '<b><u>JunoDownload Settings</u></b>']
  },
  'external_JunoDownload_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'http://www.junodownload.com/search/?q[artist][]=%ARTIST%'
  },
  'external_JunoDownload_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_JunoDownload_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_JunoDownload_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_JunoDownload_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'Juno Records is a UK-based online dance music retail store, selling vinyl records, CDs, music downloads and music accessories, founded by Richard Atherton and Sharon Boyd. The website was created in 1996 as an information-only site called The Dance Music Resource Pages, listing new dance music titles each day as they were released. In 1997 the site changed into the commercial store Juno Records, allowing users to buy the records and CDs listed. During the e-commerce boom of the late 1990s, the site differentiated itself from other dance music stores by maintaining a text-based presentation. In December 2004, version 2 of Juno Records\' web site was launched, adding graphics, and more flexible navigation to the original site design. In February 2006, Juno Records added MP3 and WAV downloads to its catalogue, and in July 2006 launched Juno Download as a standalone site. In the same year, the web site also won Best Entertainment site in the Website Of The Year awards. In September 2006, a Spanish-language version of the web site was added.',
  },
  'external_JunoDownload_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_JunoDownload_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': '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'
  },
  'external_Lastfm_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Last.fm', 'section': ['', '<b><u>Lastfm Settings</u></b>']
  },
  'external_Lastfm_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'http://www.last.fm/music/%ARTIST%'
  },
  'external_Lastfm_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_Lastfm_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_Lastfm_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_Lastfm_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'Last.fm is a music website, founded in the United Kingdom in 2002. Using a music recommender system called "Audioscrobbler", Last.fm builds a detailed profile of each user\'s musical taste by recording details of the tracks the user listens to, either from Internet radio stations, or the user\'s computer or many portable music devices. This information is transferred ("scrobbled") to Last.fm\'s database either via the music player itself (Rdio, Spotify, Clementine, Amarok, MusicBee) or via a plugin installed into the user\'s music player. The data are then displayed on the user\'s profile page and compiled to create reference pages for individual artists. By April 2011, Last.fm had reported more than 50 billion scrobbles. It claimed 30 million active users in March 2009, and on 30 May 2007, it was acquired by CBS Interactive for UK£140 million (US$280 million). The site offers numerous social networking features and can recommend and play artists similar to the user\'s favourites; it also features a wiki system analogous to Wikipedia, wherein registered users can collaborate on hyperlinked information about tracks, releases (albums, etc.), artists, bands, tags, and record labels.',
  },
  'external_Lastfm_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_Lastfm_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': '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'
  },
  'external_Magiska_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Magiska', 'section': ['', '<b><u>Magiska Settings</u></b>']
  },
  'external_Magiska_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'http://magiska.vlsweb.net.br/?s=%ARTIST%'
  },
  'external_Magiska_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_Magiska_lucky': {
    'type': 'hidden', 'default': false
  },
  'external_Magiska_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_Magiska_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': '',
  },
  'external_Magiska_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_Magiska_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': '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'
  },
  'external_Magnatune_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Magnatune', 'section': ['', '<b><u>Magnatune Settings</u></b>']
  },
  'external_Magnatune_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'http://my.magnatune.com/search?w=%ARTIST%'
  },
  'external_Magnatune_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_Magnatune_lucky': {
    'type': 'hidden', 'default': false
  },
  'external_Magnatune_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_Magnatune_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'Magnatune is an American independent record label based in Berkeley, California, founded in spring 2003. It originally only sold music for download through its website, but added a print-CDs-on-demand service in late 2004, and in October 2007 began selling complete albums and individual tracks through Amazon.com. In May 2008, Magnatune launched all-you-can-eat membership plans. From March 2010 Magnatune dropped the CD printing service and moved exclusively to all-you-can-eat membership plans. Magnatune was the first record label to license music online and as of August 2014 had sold over 5,000 licenses in its five years of existence.',
  },
  'external_Magnatune_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_Magnatune_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAU9SURBVFhH1VddUFRlGN6ZpouumuyqGy7ADRREkwRLyBgHppFy+hFpnKYZi5yQWBYWAkEhFYNIBtKRWNhdYIG1BVwBcTVImEzaQIgQMiMCYhCRBPlnYXd5+95zvnP2LLuL0OyNz8w7e/S83/s855z3D9EThYhsnUdAqtrgIZHbmae0yBCRW2OIy9E+Q91dg/fzan13pZZHb0lQmTfGFFo2SgrBmYmZX7l59xcas39KWViUstGdhvl/cJcU7PFLLp10RPY4E8cWQkBKWf/mpFI3Gm7tCE3XbtibVTXgISk0CoOStwBBaRXwifwa5F65BeobPaBq7obTOgNE5NVCQGoZbIpT2Aghb21+S7LSff9aP01ojnZD4PHy1hdji/gg3jIlxBb/AA1dAzA+swCOYFlehv4Hk6C5eQfePXMJhOc3xyshLLOqMryy8ilK4xxvZlUPCA/7JhbDpbZeWFgyUSoWSGg0mZn/x2sOeDkxuwAZF38GL6n1beC1e5L8WUrjGPjNha89NKMSOvpHaWgrTBYLlP30O+zL1oF/ihry9LfAuGSmd1mgqHLis+3zYl4EebDh4JNaT0pni4/P630DUtR8wvnIVNBOyJcFT8dhen4R9mZWWwNLi6D9b3uhS2YLyZHbvB8mppe0KJJS2iLklDaac9wUr4ALLX/QMPaYnDMCKTU+MNqPd4boXXvI1M0MOefrFpX/HKW1YntSiZlzOEyyfM64RI/bY70C7t4bh13HK3jfwLQKHaW1AhsI3sSMxaRbDesVgDlzRNEo9H9AaVmEZFQeJQKW8ebOY2Uw9HCaHmWBaTA8PsNXwmoCzJZlGJuas6kMRH1HH5B2zfiSipiPK256j9KLRCQ7DVygt7/W2SVelKKByeagdA0Yeu85FWAiSffRt1eJbwlEFlxj/s3h3+l5kltKxheTdne6JovSi0Q4TLhAieXN9AgLLC+2x7OW//2vTJ07EtB4e4DvhPi78rO8KsgDwulYQFbNL9SdxQxJRqGA7LpWphs6EvAdqRwvKgB/a1bk0ltfXeT9nQo4UdVC3Vm4UkBIhpb3dyogkpSgEK4SgE3JN1HF+9sI8E1Q8QJeJ4FnBT3AVQK6Bsf4e55SxdKBnLojlF4kOpBTE8wtGy8llUDrXyP0mOsE4DkxN+RiVvQBBCkNphGh05nLbaSe2RJyhQD035dtTUDveKW9gJeT1Wc5h8A0DfSNPmIOzy+abATkXml3KuDqb/02ZdjU8w8TQ9fai6S874fn9QmU1gpvmWoHaUgmzung2ctM58OWdChfz8zz7cmlTFCcEx+cq+cDYocbmZhhDMcztnOyE8Loo1kYIfbKsXLe97V0jTEss8J+GCHIOK7iphYuJSerWxgy7Hy61j+hc8A6cjGpZOomiFY2QtH1LqZdI+4Twra++wz54NgU7M+p4cmJTYg/KwyidPYIz6tz80lQzXMH8EmQBD+DI2BpLZKtyLZxsxh6OGW3mgWf0HRTKufwkha8QJwHuUNo75BAN+8OM4vIasAZMjo5x+yFO8inEMYgOdHpd1j+NKVZHe4SldgjRj4uDLCVDKPw3Fr4Rt/ObErTC6wYjrS5ZwhSLtyAN76s4hORMx+ZstMr+tzzNPza4EcWSPJX0DBOLmEwfKWYkEiylSysuLrhNSaicOuhNrHnlLZ7zU++ErGK657bEksid5J9f0Xgx1rI6Urjqgm3HmDZfKpo0GEDwS5GntgiTC58etJ4lvAeWe06cOc7mF/vuNRcgcgCfbr/0dIsHChiYiS7sySlTdbe/uRAJPoPYtbtYky8jo0AAAAASUVORK5CYII='
  },
  'external_MBSR_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'MBSR', 'section': ['', '<b><u>MBSR Settings</u></b>']
  },
  'external_MBSR_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'http://forum.shoegaze.lt/search.php?sid=983eefb9b91458ec7e8e24a843d76007&keywords=%ARTIST%&terms=all&sc=1&sf=titleonly&sr=topics&sk=t&sd=d&ch=300&st=0'
  },
  'external_MBSR_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_MBSR_lucky': {
    'type': 'hidden', 'default': false
  },
  'external_MBSR_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_MBSR_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': '',
  },
  'external_MBSR_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_MBSR_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAAZ2SURBVFhHfdf16xZbFwVw/0G7u7u7xULFwlbEwMBGUcTAQMXC7u5OsBX84dz3s+93P3e8et+BzZwz88xZa68d5zz18nr//n2pG9Yuz9LevXv3R3vx4kV59uxZefv2be3ZokWLSps2bUqnTp3KsmXLyvPnz2vvjXfu3FkGDRoUv6sB/z8CuTDLuQUfP35czp07Vw4dOlSOHj1a+43nd+/eLQ8ePAhyL1++LI8ePSr37t0r165dC/AWLVqUjh07lno+qMOrXQlctVycWfDq1atl48aNZfXq1WX27Nll8eLF8fz169dB7tWrV0Fu7969Zdq0aWXo0KHlxIkT8Zvbt2+XsWPHhkp1kP9cwPKeY6BJ4s2bN+XChQsh7YQJE0r37t1D6t27dwc4YPbw4cMyffr00qxZs9K0adPSvHnzMnXq1HLq1Kly5syZcvny5bJp06b/JuBKElVwHy5ZsiSAedC+ffuycuXKsn///pCY/OfPnw9v27Vr9wuB9evXR6iGDBlS5s2bF6r9Jncddu2qek+6uXPnlp49e5ZWrVrFwuPGjQvgJ0+ehEfIXbp0KYgeOXKkzJgxowwePDjUSNBhw4bF98jVwfx9/ZtAlZhkEu++ffvGxzyaMmVKOX36dMR61apVkVQUQfL+/fuRhAcPHixbtmwpvXr1ilC1bNkyEhB4hw4dfg9B9Upw3stigMl8+PDhtTjyECGKAOjXr18oohLWrVtXunXrFu8Ykm3btg0SwlgH9d/eV+uX3ADEkNfkFGfgGWsm64XL3fsmTZrU3gH3W2atOrh/rgRmgBkSbNeuXREG4Bs2bCitW7eORS0GpHHjxjFfu3ZtWbFiRXhr7h3lAPpNhsCzOtjfryQh85kSU8NPnz6N5LK4xdI7Y4t27dq1jBgxIkC8a9SoUZj3SdCcEhyoSZ+A1THvAe/bty+6nbarxIwnTpwYJCyS3vfu3TsqJEEbNmwY4WF+w+SDRO3Tp08QhffLVQUXd2CdO3eOcjp27FjZvn17EDp58mSMhUJyVr2tX79+gDOEkCW38pN41DEfMGDAnwmk55rKjh07IpEkHMNaaW3dujW8UA2aEEkbNGhQA0ZESBCggPIFnCSNlWUd7K+eM3EXb6WmqwHUz32oGmS4hUnPM5VhQYtnPiSJzPz8PYLmUQUJXAU3lun6u2Zy8+bNcvHixTJmzJggkF6lNyznFgcCVFiolxXgWZLLxP0jAQbYhqKZ6Hba67Zt2yKGPk6p+/fvXwNNA5AggJFD3DwTNpPyj/KzbECy/vDhw5ELs2bNih0wvbZQepILsgTivUSbNGlShMx+MHny5FBy4MCB8T7AkUhgLVeGG9tWb926Ve7cuRP1zQs7YEpdJZHGW8lpP7D7OTNoSk4/ns2fP78sX7483qmgXxSQeDJ6wYIFIf3x48fjBOPwoQJ69OgRJKoKuPOW5EgCsvDChQujYiRm5gDzvTnv7Rk1cJIrO+DqWqlhS3L1LiHJmZ5X5WbKkbdLly4NBYCkaVYSkHpIJCFkatJrs8pNiYmZYxaPeKYR2QNsqeZVcJIjvHnz5vgOEEBgjAJiTn6qzJkzp4wfPz7WRqRGwH7vtDJy5MiQW10nyy5dukSta72Z8cDddTme5yEDKBLUQurGjRu1iqKwHBNeZe19jcCVK1fizKZXy1geVmPt8ICQeXoOBDj5U2qxdSoCAhS48fXr1yOX3G3VHGZBQNvd8r9TiwXJbcH0kMcsmwhiwmBDse0qK8SAI6lceQrM4ROg05F9xSHFWGIL99mzZ/8mgKnsJbVaHz16dE0B/d1d3WbcEaCSkzFijOcaFXALOznLq0xyBkulIeMc6YQcBDCTdDNnzowjlm5X9Z6R3DNgPF2zZk2QIj1w35NUC7f458+fy6dPn8qHDx/Kx48fw4yZ0ld19ppaCLLhaLnKjqc8loSphjup/amgGDLmCPtWYonvt2/fwr58+RIkkgyrkokmlAR0PRlKFkmTmS0veAic9DwGLkxij4TOxhu9A9iPHz+CwNevX2OOiHvVUp1oREgoQQlkcaCSK73PmkZAKTqCZx0Lh3gzsf/582eNQFWJtCoBStSTlRTgQbZc5UhWgAB0NuUpD+x+uh3pmeYksQ4cOBAK/okAJf6tQo2AvV62SkReOIK5i7MKILFkIzdCo0aNiq5mThWdUyj37NkT7RyB79+//0Kg6j3gvH/69Kn8Bb1qdSc2lL12AAAAAElFTkSuQmCC'
  },
  'external_MusicBrainz_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'MusicBrainz', 'section': ['', '<b><u>MusicBrainz Settings</u></b>']
  },
  'external_MusicBrainz_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'http://musicbrainz.org/search?query=%ARTIST%&type=artist'
  },
  'external_MusicBrainz_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_MusicBrainz_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_MusicBrainz_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_MusicBrainz_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'MusicBrainz is a project that aims to create an open content music database. Similar to the freedb project, it was founded in response to the restrictions placed on the CDDB. However, MusicBrainz has expanded its goals to reach beyond a compact disc metadata storehouse to become a structured open online database for music. MusicBrainz captures information about artists, their recorded works, and the relationships between them. Recorded works entries capture at a minimum the album title, track titles, and the length of each track. These entries are maintained by volunteer editors who follow community written style guidelines. Recorded works can additionally store information about the release date and country, the CD ID, cover art, acoustic fingerprint, free-form annotation text and other metadata. As of 6 February 2014, MusicBrainz contained information about roughly 850,000 artists, 1.3 million releases, and 13.5 million recordings. End-users can use software that communicates with MusicBrainz to add metadata tags to their digital media files, such as MP3, Ogg Vorbis or AAC.',
  },
  'external_MusicBrainz_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_MusicBrainz_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAAUoSURBVFhHxVV7TJV1GOZOEAES1wNiKgTIkbiIEIGo3MVzkosQCAkaYQgpsVxlqXOjmqZzWZZBaqCLctmMMrtBrFK2rFnNWpet29Yf5da0y1rWnt73Pef38fHxcamk3u3Zd77f7Xm+933e33FxBv4nSKCj7ei0In5uuhBGRSbhvo29UMFj0ypAEfNTT6xijAAV+kNUGN9V6NfqwaQli1fj8767nSvHxj8WYJzXvyvwuWbkLIrnOEwFTPQ0/jZ7V1AkHJx+vQ/UHD8Jf1+APtS4EYpEEaqSTCkDU/1t9q6gJ2FSJURBzRGmXwCDRRjDOWcuQA/9uDH06/Tgczn4yek3izEC/i2MqVYkPKbvCL0pCZdHgCLnw5lMEfL5OjINl10An2PW9xOdrwmIiLDCxzcUQYEOBAZEIPna2YIoSxwsllQkJJSgqmwL1jc9idZbD2Jjy9O4o/XZUYcZQ2VFT6qHJiAs0AM7m5Px58lq4NWbMPxwATBYKzi1Jx+t9lgkRPvDy9Mb4WExWJzdgKb63djQ3Iv21mfkMCbjs1S/8++JyBmagDOPFuK5bTmwXx+J6txodDbMx4GOhWgsmi3AqXqc6MyVDa6OTZg10yoZaWs+hPb1DhEMJmcReqLxoAmozo2Cu5urEDPRvbXzRExj4RwRh6FVeH9fETbXJOK7vhvh4e4qmwOoVCtKO6QsZgSTQRPAWFcaI1/KZHibnmca8enBUnzUVeIox0CNY26oToTUF1yD0EBv8Q6LMCOYDJqAuRY/+XIRwGRE/khrGmyZFnz21HLg9M346YVKFKdH4OvDdnn/4flyDOxYgsz4ADFtlX0TWtZ2kTFHyjEZNAFri6JRmBaOcweWScrtGRYEXeWFFTdE4vayOLy4fZGIu215DLbVW3FpoFbWs/CsxGA5iLvlgycoW2TiqUIT8ObOHPFAXkq4mIxJLxyvxIX+ldIFH3MZSMCaojlYmhwqpfjysA372hZgZc5MeHq4yWFsvkN3ZpiSmUETUJoeggL6IjYYtxzebXCUgheyH+j9ix4b/Hw84O3phuzEEJx9vNixjsqxpyWVjOkQsSCJWthANB40Ad3tKejbnAW8VQe8XiOOl1rTIq5zzz1ZKKdy7GhKRj95JYZSH3ilJz7pdhqU8P3RMnRUxMld8R7tN5KZQRPAtT62NVu+dv+GdPh6uWNoV54cPLg7DzVLomG52sexkdacP1YuIvJTwhwCSDTeoCfNZcbPkAvISGYGTQCbsMUWK2nld76EpOV4IdX+q16bjIsoJnKmnY36zRHbSLloz2sP5sLPL3gU0XjQBOAdGqBDuM249TRyZ9//0l8pHfDtESoLkw2vFgPy9czteekVusJ5nMSyj9w8/LQSToRRArhuvt4eUn8hprR+uL9YLiN2/EXqCv6v+P1EtbRbXJS/lIbvDPbCXdUJGNxbKOUMDvCfkg9GBJyuwV66eKTO9MWygAyZYw1BRJCP9HtabBByk0JljD3C+3o2ZcpX/0Fi+XbksfzUMDy0LkMMaSQ0YkTAcK2klL9KBNCBv75UhS2rrHIxcZovHq/Aj5QFzkjnLdchYsYVWDQ/BD/zPyhf0yS4buksPLAmCS/fX4B5CfmmpHqMEtDVvlAuFHE0TcpfM7elMhiDS+M04dnHHIaV9uVx8sWu5hQx57luOzJS6J5Q+8bBiAAqAbch/xanO7MgZPQ8Tz3OtWWRbEiZo9RvrbOiIjvKIZL28GXGgn47WYfC7GWmpHooARzq5T+Gi8tfA3Z4bJq4jN0AAAAASUVORK5CYII='
  },
  'external_MusicStack_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'MusicStack', 'section': ['', '<b><u>MusicStack Settings</u></b>']
  },
  'external_MusicStack_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96,
    'default': 'http://www.musicstack.com/show.cgi?find=%ARTIST%&search_type=artist&find_focus=0'
  },
  'external_MusicStack_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_MusicStack_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_MusicStack_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_MusicStack_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'MusicStack was started in 1997 out of my Ohio State University college dorm room (pre-google) when finding anything on the internet was hard to do and other resources for finding and buying music were just plain terrible. Nearly 20 years later MusicStack is still one of the best sites on the net for finding vinyl records, LPs and CDs.',
  },
  'external_MusicStack_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_MusicStack_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': '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'
  },
  'external_Myspace_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Myspace', 'section': ['', '<b><u>Myspace Settings</u></b>']
  },
  'external_Myspace_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'https://myspace.com/search/artists?q=%ARTIST%'
  },
  'external_Myspace_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_Myspace_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_Myspace_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_Myspace_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'Myspace is a social networking service with a strong music emphasis owned by Specific Media LLC and pop music singer and actor Justin Timberlake. Myspace was launched in August 2003 and is headquartered in Beverly Hills, California. In April 2014, Myspace had 1 million unique U.S. visitors. Myspace was founded in 2003 by Chris DeWolfe and Tom Anderson, and was later acquired by News Corporation in July 2005 for $580 million. From 2005 until early 2008, Myspace was the most visited social networking site in the world, and in June 2006 surpassed Google as the most visited website in the United States. In April 2008, Myspace was overtaken by Facebook in the number of unique worldwide visitors, and was surpassed in the number of unique U.S. visitors in May 2009, though Myspace generated $800 million in revenue during the 2008 fiscal year. Since then, the number of Myspace users has declined steadily in spite of several redesigns. As of May 2014, Myspace was ranked 982 by total web traffic, and 392 in the United States. Myspace had a significant influence on pop culture and music and created a gaming platform that launched the successes of Zynga and RockYou, among others. The site also started the trend of creating unique URLs for companies and artists.',
  },
  'external_Myspace_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_Myspace_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAF0klEQVR4nL2Xz28TSRbHP93Vbcdx2nY8mxA7ENgh8SHaAwpIDCsBElLEDSHgwAEJ7V64rnaRECf+gexoJSQQl9kZiStcOCIkDoH8EvFGQEIUE5YAjjKZ+Eec2LHdVbWHpBubZLQSk8y7dXV1ve/7vu97r9oAGBwcdOr1+j8KxeLVUqnUbhqmxGB3TYPSSjiOk49Foz/Ztv3Px48fl4zLly9H5t/N/zu3krvwh85OuhNJDMPY/GJXzUBrzafFLL/8/DPxb+IPv/3jt3+xCoXC33MruQu9fX38+cQJgsEgruui9e4CMAwDy7KoVqs8HxkhMzd3Id4ef2kcOXLkv3YgcPDEd9+Rz+dZXFykXq/vCQDbtkkkErS3tzMyOkq9Vntv9Pb1FQ/09ETaWlvJZrMYhrGVgt03rTVaa5LJJGvlMh8WFlYtYQq3Uq5QWV/Htu09cfylLS8vg2EiTOFaGFB361im+bs498yVdTDAQmu0Uug9ov3XTCsFWvP7hr2DWZ4wvlS9aZoYxmbtesJUSqG1bnonpdy2Xyn1q2ueeT6txodGy+Vy1Ot1QqEQ1WqVjY0NHMchHA6Ty+Wo1WoEg0Hi8TimaVIoFKhWqwSDQRzHAdhxrRHAjgx4EZ48eZJoNMr8/Dw9PT3s37+fdDrNq1evuHjxIp2dnXz8+JEnT55g2zbHjx+no6ODbDbLzMwMAEePHiWRSLCyssLLly99NpsY+NK5Ugrbtrl58ya9vb2sra3R1tYGQKlUYm5ujoGBAT+SBw8ecOPGDQYHB7ly5Qrv3r3j0qVLuK7LrVu3SKVSPHz4kLGxMVpaWgD8tGitMdUOAJRSuK4LQFtbG8ViEaUUjuMwMDBAuVymXC4DcP78eY4dO8bTp08B6Orq4sCBA3R0dLBv3z4AxsfHqdVq25hWWmPqLYeecyml/wwwPDzM6dOnuX//PgCrq6tcvXqVa9euUalUEEJw6NAh0uk02WyWUChEKpXi8OHDRKNRlpeXefHiBaZp+sF5vrRSWyn4QpmNgvzw4QPv379nenoagLW1NTKZjC+8UCiEaZosLi4yPT1NMpmkv7+f1dVVAGZnZ8lms1iW1XSu9vSm9GZDAHx0jRuFENi2jRAC2Cwty7Ka5oUQgkqlwujoKABnz57lzJkzAExMTFAqlRBCNJej1iitsJT6vOhR1FizXq035s6rfc884Y6Pj+O6LolEgkQigZSSZ8+eYdv2tj6w6UdjbqL6TH1jnpo3N4NqolNrhBC8ffvWL0GATCbD7OwsQoimcxt9mpuL2xnQDWlpZGAnQN7+YrHI8PCwvz4yMkI+n286x/tO680zTG8oeK3WozcSiQAQDoeRUhIIBIDNsvSi8PpDMBhESonrukxMTPjvx8bG/MuNlNIHYBgG3hC0GqP1rmK1Wo27d+8Sj8d58+YN4XCYdDrN0NAQpVKJjY0NAIaGhnAch8nJSQKBgN+uAZaWlkin05im6Qe1U9PbEqFu2lCtVrl3754feTgcZnJykuHhYUzT9CO/ffs2SilCoZB/lzx16hSGYfD69WsWFhYQQjQB8KrJ82sppVANGpBSYhgGra2tfi5d10UI4UfnRREOh/09lUqFgwcPcu7cOQCeP39OqVQiFos15P3zLFBbGrCkkmiaNfA1d0KvFO/cuYPrujx69IiWlpYmQTeOdo1GKomlpERJ5Uf6tQCEEMzMzHD9+nW01kQiEQKBgD9TGpkDUFKhpNwSofrtDHggYrGY/9zo3APgM+CJUEppKS39dru+vu4LZbdNKUUwGMS2bbTSSCkty3GcfKFQjOzvlnR1dSGlpFar7QmAlpYW30e+kMdxnLzV3d3949TU1K1MJkNvby+pVGobdbtllmVRq9XIZDJUymVSfX0/WrFY7PtkMvmnT58+XfzP1BTRSGRP/4yKq6vUqlW6u7sfxGKx7w2A/v5+R0r5t6Wlpb8WCoV2QP6fs77WRHt7e76zs/MHIcS/pqenS/8D7PEu8my61KsAAAAASUVORK5CYII='
  },
  'external_Pandora_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Pandora', 'section': ['', '<b><u>Pandora Settings</u></b>']
  },
  'external_Pandora_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'http://www.pandora.com/music/artist/%ARTIST%'
  },
  'external_Pandora_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_Pandora_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_Pandora_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 2, 'cols': 16, 'default': '/%26/g, \'%252526\'\n/%2F/g, \'%252F\''
  },
  'external_Pandora_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'Pandora Internet Radio (also known as Pandora Radio or simply Pandora) is a music streaming and automated music recommendation service that serves as "custodian" of the Music Genome Project. The service, operated by Pandora Media, Inc., is only available in the United States, Australia and New Zealand. The service plays musical selections of a certain genre based on the user\'s artist selection. The user then provides positive or negative feedback for songs chosen by the service, which are taken into account when Pandora selects future songs. While listening, users are offered the ability to buy the songs or albums at various online retailers. Over 400 different musical attributes are considered when selecting the next song. These 400 attributes are combined into larger groups called focus traits. There are 2,000 focus traits. Examples of these are rhythm syncopation, key tonality, vocal harmonies, and displayed instrumental proficiency. The Pandora media player is based on OpenLaszlo. Pandora can also be accessed through many media streaming devices, such as the Roku, Reciva-based radios (from companies like Grace Digital, Sanyo, and Sangean), Frontier Silicon-based connected audio systems, Slim Devices, and Sonos product(s). On July 11, 2008, Pandora launched a mobile version of their software for the Apple iPhone and iPod Touch through the iTunes App Store. Pandora is also available for Windows Phone, Android phones, BlackBerry platforms, HP webOS (used on the Palm Pre, Palm Pixi, Palm Pre 2, and HP Veer). Pandora was the provider for MSN Radio until MSN discontinued their internet radio service on June 18, 2008. A modified version of Pandora has been made available for Sprint Nextel. Pandora is available on Comcast\'s X1/X2 cable TV products. A GNU/Linux based application, called Pithos, which is available for accessing Pandora Radio and is available for most distributions via their repositories and is also available to build from source at https://pithos.github.io/ The service has two subscription plans: a free subscription supported by advertisements, and a fee-based subscription without ads. There are also ads in Pandora Mobile for mobile phones and the Pandora in The Home computer appliance. Most users choose the free subscription.',
  },
  'external_Pandora_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_Pandora_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAAQ1SURBVFhH7ZZ7TNNXFMeLmYMNnJmNMiUxW5DhDJsPRmEE3VDHiIzIgszphGy4PixjgaDhZaYzmzLdlqGutFVBmLIsVgRhujnDQF0k9QljgzoeKuVR+uSfJSPhd3bObWtbWuqSFv/ZTvJNm97fud9P7z3n3h/vvxQBtk/vEVpQE5z8UVmCaM9xkXBvtVTsgyhf9Em1ZF3WjsS5SzJCcHqvEAHRazMWphVWVabkV+gzihQTm4oVnK/aWKTkUvJkptQCuYqfvTOSfKx2kyI09PXg1bkVlRsKFeNNzW3cvYFB0A4O+6z72iG4eOU6wUys3HqgcV7U6lC0c4eIeGPHylXSCsP5Szc4s9kMRqPRb6L5Ll/r5BJzZH8tiFn3Htq5A0S9/bE4vbRm4j5SU5LJZPKbjEYTjOj0kLWnllsY/87XixblBtpsHbH4rRLppt21nHZI5wIwrBuF7j4t3Lk7CN39qD5XafC3/oFh0I0aYMxCK+cOQNLp9SAsU3FhcRuO8eOzZ9lsHTEVwNWOHpB80QBJ22sg6n3ZA0VmHoaILYeYYsRKSC05CWUnWhiQ2cnYLgbwOQGkV84RvPuUzdYRUwGQaA/vakcg8zMVRIsUIJAo4eCpK9B6UwOtNzTw7Y/XIaXoBBtbX1ILbR29LvkknwBIZrOJmZJJ7DYlNFzqYGD28RYEScw/zsaz9p7GrdO75PsMYEGzul/aIVroDGAdo30f1RtAdKAeVgjlEJ9zlG2dwWkevwCcvfybRwDS2JgFtsvOw3IEoFVQNd8Co1P+tAOQWW55EwMQSI5A87XuR7cCtAW/9wxYCxHHU4tPstZ0nsfvAPWtCIC/k/nNrn4QY6vS0r8iPQrfX7zl1op+A6AiI6NlH8hhaXYF03L8Tq255dNTcKGty//nAMkBoGAHz84jF6DqnBqqflBDXUs7qDv72Gk4Oc+uadoC6zlABehc8Z40rUX4b+QXAPrXtAUEQMtueZQAVFjKhjZYgQVINSA/c5XdfpOfm0o+AZD5EJ7twv31rANeFisgu6yO3fGeKt6THgqwJL00Z/Pu79wA1J29rOLplnsRW875Sk4rrYVdx36GP3oHXMw86aEAL6QWbtu4y74CjsShET0aaEGDLyR01z94GcHvd1Bd+LLirf1I1CH0zNZ9Km6+IA0Bkt0B5kYnJ62Syiy/3v6Ts7eXPdmEQATlTc6GbsJibdfcg6Q85Tg/PPYrjwC8mDX88DWinyT7T3O38WG9wWCT0QdZ82kF8w82QvhaUc/MoFmZ6Pak1dQ1AgJnh732bMJmdfKH5X/nl5+FYvk5rsQHUX7B4UZ4M++b8edezeoNnD1vH/q8hJrBHD1EEC/o6YSQ+ZFfzomIO8N/Pq7JZ4XHNYYsiKye8XhwHs4fi3qCOXmJmbhCz+DHUh7vMYEfFINzLkOFWef+P5yDx/sHpsOr7DVpJL4AAAAASUVORK5CYII='
  },
  'external_PureVolume_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'PureVolume', 'section': ['', '<b><u>PureVolume Settings</u></b>']
  },
  'external_PureVolume_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'http://www.purevolume.com/search?keyword=%ARTIST%'
  },
  'external_PureVolume_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_PureVolume_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_PureVolume_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': '/%26/g, \'%2526\''
  },
  'external_PureVolume_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'PureVolume (formerly Unborn Media) was the first independently run website of its type, allowing for the upload and stream of music files. PureVolume was created by Unborn Media, Inc; Mitchell Pavao, Brett Woitunski, and Nate Hudson all from the University of Massachusetts. PureVolume is a website for the discovery and promotion of new music and emerging artists. The mission was to give artists a new promotion tool. Each artist had a profile that typically contains basic info, updates, photos, shows and music for streaming. Artists had the option of making each of their songs available for free download. Listeners and fans were also able to create profiles to interact with artists and each other, as well as track and share music they like. PureVolume went through several layout changes and a change from orange to blue in their color, however the layout from the homepage to the artist profiles remained essentially the same since 2003. The focus is on promoting "indie" music groups and artists, meaning those who are not in the mainstream, although has also seen the rise of many of the previously "indie" bands they were promoting.',
  },
  'external_PureVolume_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_PureVolume_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkVBMTJGMTBERjBGRDExREY5NTQ2OUQ1Q0I5ODZEMjg3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkVBMTJGMTBFRjBGRDExREY5NTQ2OUQ1Q0I5ODZEMjg3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RUExMkYxMEJGMEZEMTFERjk1NDY5RDVDQjk4NkQyODciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RUExMkYxMENGMEZEMTFERjk1NDY5RDVDQjk4NkQyODciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6bn0yNAAAE/0lEQVR42rRXzW4cRRCunp+149hrIRlHICH8BMicOKAQpEiIE8qRo/0ICCHBkRNIIPEI8Rtw4wAHQEoOnIx4gRgkJJwQYq+t2Ls73UVVV1V3z+yGCITHGk93T039fPVVda9DROCrbds7VVV9tToa7aBz4Gi9fPLlVJYvW7P1/jxK9Nbsms1mR977T+fz+YF+i2z87ks3tvduv/0W7LzyKq2qEVLEOsRJJ8umU5YA1ZgjwShfyNh39gHLHP32K/zw4z34/fj4gJzZd03T3Hlxa+vr9959B04mE3j05+O+hd4Y1alCKc2DRe768iUy7AwPt7e2YDwewzfffgd/PHy070Zte3j71s3d6eUlnJ6fi7aqwKyc25iejp6oltO4kItrz/hmvLkOK6NV+P7e/aOmHY12L8j4yenE4gDwElnKoU864juRkUgrGvvemiLgIaGW1vV5enJGTsTU7zS8cDY5gxAwKQxJT9A50q3KBlcwp+PI9XQ4hxF602EBBvo7m5zD9bVVaFhg1nVg1RCWGvh31/N0MFfYZiDkyAFPEAZhu+OykCiY87gkYpHpj9FZ+SlKn9yXhc/eHBhWnIKQmYNuOLvsBESD/L1kO5uu+nFgkQgbY+Z+lNd1RynsOazPQINA6jz9a9ATAuQRM7TiD4OHUGXTAbroXBXZXCASnPpWlitfHVsQ8iMWDucUo5GWIGmEa0IgXyQtpiDBS5GgsDyorYqjCxoVhVhZP1A+sm8ptZgDwqhXCM/BN9YkMAzbDiqMUpI+tmV16OOfBJfP31AZqTAbMwJeMS+6t2KJWnEQg2qiPKfAGeW04xWkixMsmOetSkMG1xWcMChDGZV2RHXAKbKxDIMn32qOsDIqEtQhRZxZLyByhC6y2UvUzG76toqpYscK1qHocfzWmV8+9oZYBRibGyn03DAwNboqwl6SkRV2Yk07oxnyUcazX2Sk7Hy+4GhX7lLgAa0MJRpW1sV+51L3tN3Nf3QouHzxuix6YTlBp1tiLgwnEYndEBIvrBKclmFdVfHZxLzR3YUgUZF0wMVWVkkBawoMSoRekWHegIK1chQ6y54kY6kuzCkQpV5qNLLdRShTaXkL0esDJS0oO4T78JeImPvyNdHmNVIf8l6RSsi2R0lHYxsEN6NYNi4TMfUFGsz5Mysfb2zHAesxyYdC3lDyaf/2UNMfV1EjtRqit9phFncAVRRyL1XIsW94MA840GQOoEvV2URW0+2jcNANBXqbLxrrMSNgZ0GXM5POjDiYp81I01zF/cc4gAp96MoTZQ8FH3JXBOjXOep7vmp9z/OqRAQyae1oBgkB3Se9ttyqwqUbfNpcFEks5mmj1LkbyOcMoB64cpBNyp1GibjkDJB6NxblV6TkOe8zlcRzp2mPqNJvAXz5xjY8OT0RSNoVuKqrm0/TGeOFzTE8pBN4SkGKZgkC/9eVU+QTAo3VaVO3MJ/PrtaBoAcUlwnaQD6MQ8CrRcCKp6krIb4eSH6+vJzurtIR+el0CrPpdNHzQV9wvf7WP5At+254baytw9OLSx4e1cTI4+ls/v54fR2urYygo7OB1euzlP4jzEvmsWQp4pW2hc2NDajbGh7/9YRffxB/nNZ1fZcc2duk32zX164tNBBnJZN+47kFVMpUJrIpue3JsF9cXFDFTXh+QCnYTy2RypF/nh+SMA5v2SQXx//lJhsP6N4zu38LMABbc58tQ/iNogAAAABJRU5ErkJggg=='
  },
  'external_Qobuz_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Qobuz', 'section': ['', '<b><u>Qobuz Settings</u></b>']
  },
  'external_Qobuz_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'http://www.qobuz.com/fr-fr/search?q=%ARTIST%&i=boutique'
  },
  'external_Qobuz_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_Qobuz_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_Qobuz_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': '/%26/g, \'%2526\''
  },
  'external_Qobuz_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'Qobuz is the first music service that provides online access to all labels (majors and independents) and all artists in all genres of music in High Fidelity. Qobuz offers: Subscriptions unlimited music streaming True CD quality (16 bit / 44.1 kHz). Download in lossless True CD quality (16 bit / 44.1 kHz) on its entire catalog. Download HD to 24-bit / 192 kHz over 12,000 albums "Qobuz Studio Masters". Qobuz also offers extensive documentation on albums including tens of thousands of digital books, biographies and interviews with artists, and many exclusive editorial content. The purpose of Qobuz: offer the best music service in the world!',
  },
  'external_Qobuz_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_Qobuz_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': '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'
  },
  'external_RateYourMusic_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Rate Your Music', 'section': ['', '<b><u>RateYourMusic Settings</u></b>']
  },
  'external_RateYourMusic_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'http://rateyourmusic.com/search?searchtype=a&searchterm=%ARTIST%'
  },
  'external_RateYourMusic_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_RateYourMusic_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_RateYourMusic_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': '/%26/g, \'%2526\''
  },
  'external_RateYourMusic_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'Rate Your Music (or RYM) is an online collaborative metadata database of musical and non-musical releases and films which can be cataloged, rated and reviewed by users. Rate Your Music was founded on December 24, 2000 by Seattle resident Hossein Sharifi. Unlike Discogs, focusing on electronic music, Rate Your Music was in its beginning more rock oriented, before gradually integrating every other genre. The main idea of the website is to allow the users to add albums, EPs, singles, videos and bootlegs to the database and to rate them. The rating system uses a scale of minimum a half-star (or 0.5 points) to maximum five stars (or 5 points). In this manner, Rate Your Music bears resemblance to a Wiki, as all of the databases content is generated jointly by the registered user community (artists, releases, biographies,...); however, the majority of new, edited content must be approved by a moderator to prevent virtual vandalism.',
  },
  'external_RateYourMusic_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_RateYourMusic_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAAEbSURBVFhH7Y/RasJQEERD8fOlT/2cfkHpP9lMneA6OdfrTZBacOCAJrtzNtPT5/j+edqKK7aHSkdx1VioaC+u7oeWxffXx93QvrCiHVoSJOlBPcKqdWiYipPD2+EXeieo18rr5BCVEcsBI0dYeUkOUEmLesBchTMiHWezU1/Q8i3q19ffRPVYve/rRUrnyuYR6XrIAcuz+n8hXasDaKnHyAGi+l4HPOSAufLvDshjiOr7Xwcs5S1oh6i+1QGClkiY0F6Sruc4QKkPaZGECe0l1WP1OfWFyEUSVnKeSIfVl+RAFpBY5ByR3VZeJ4cElY1CvVauQ8OCintQj7CqHVoSJGlB+8KKfmh5L64eCxWN4qrtodJ7ccUrNzJNP/u1WSLy8Qs3AAAAAElFTkSuQmCC'
  },
  'external_ReverbNation_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'ReverbNation', 'section': ['', '<b><u>ReverbNation Settings</u></b>']
  },
  'external_ReverbNation_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96,
    'default': 'http://www.reverbnation.com/main/search?utf8=%E2%9C%93&filter_type=artist&q=%ARTIST%&use_postal_code=0&geo=Global&sort=relevance'
  },
  'external_ReverbNation_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_ReverbNation_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_ReverbNation_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_ReverbNation_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'ReverbNation.com is an online platform, launched in 2006, that develops technology used by the music industry, including artists, managers, labels, venues and festivals, for promotion, content management and cross-media licensing opportunities.',
  },
  'external_ReverbNation_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_ReverbNation_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': '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'
  },
  'external_Scnlog_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Scnlog.eu', 'section': ['', '<b><u>Scnlog Settings</u></b>']
  },
  'external_Scnlog_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'http://scnlog.eu/?s=%ARTIST%&cat=8'
  },
  'external_Scnlog_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_Scnlog_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_Scnlog_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_Scnlog_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 1, 'cols': 24, 'default': '',
  },
  'external_Scnlog_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_Scnlog_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAAQHSURBVFhH7VdrTNVlGP9/87LUtaYtdV0+pEvzgpemYqEtdVqrlfNCo1RQmRdEUETQgYAgQmUhIAqoFWQIaoiB4i1QcDD1JJApKjABFVG8kBwPt1/v8/zf/8s5wNbpQ9AHfttv4zyX93nOcztDM4AuhgyrQ8q6HN0a3EBPAj0J/H8SKCwqw4zF2/HaNK9O6RPxMyyNTYhOOgnHhSGd2rw+3Rs3Ku5hx77j/HnKgmAcOHYBTc0tMoqO+mdmjPrIH5EJmXoCDWYLBk9dg15vuzLJeW9aDq7erFasrqnDjCXblc2YjzfhgummjQ0Fp7feeN9b2RFHzvHD3kO5MFsaOYHY5FPo57AM5VW1egKU0ZB3PW2c+o5eikW+e1B1r46d1ocfsNEfzy1ieXskpefZ2FnzzZk+XMGRH/rB2TuW7VULqkUgN/8E9BntZuM0aPJq/mbWCY79ZDNaWmzLSmhtbcXk+UGYvfQrDjRs5gabtwz2HuWKvEul7KNRye7WPtZ5/zHST1/GiDkblfELY5dxeQdOWqVkLuvj2nwkqc85hX+Kx91w4nwxP97Y1IzkjHxMnBuofImOziGsJ2irgr5H/3HLO+Vbs315iAhRP2bj5SmrO7V71WktntQ34AufOEyaF4TmdtVpFsll5V7hIR8wzh0HswqkRiRAZSOcyi/BsbMmZr7pBsva41mDBecuXld2Bk/mlbDOAL1ZUloldL93sCWWipYa4AQulZRz6YwShe/OkGodZJOYmoOh7+lzMHzWBkz/chsmfBagfJxcQtmuuLQSU523qvdoW8jWmoVFt+TLcgiXbIxXD704cQVq656y0sBOUf7eUj/+0wA0PNfX6VrZHeVHpFtivc5zPaK4HdSCw9kXkZJZgGw5Hwa0yrsPRR/dlZNH8A9SpePBo3q89M5KpU/NKpQa8HEy5LT78z2j1WfaJtPVCrbLOGNSct/IFJYZ0MLijrY5ibIVX6+UKh3UX0NPB+q5pYnl1TWPxIrqm0FrlZD6Gw+jYTvNJUy0hE0xyzWCZbRR5ZX3daGEtiJwv3KiBNaF/4StsemKBVdusSPpX3H0QHDML0wHcQtI1s9hOSLif+VgTiKo8RZtUIjw9/v6oJqHhV4xMmwbNDqxW3YegVdYcgcGRh3mHlIVKLH2+sjETJRZfSNqZ8B3hzrYGSy6dltatkFdQntwXlyvDxaHw9UvHv7fpCIo+gjcA/bxZaRjRPAMTYJZDqk9sCsBmvqaB08wSFzDYeKe048JJZAofrCoPZ+v28V2l/+owKYdafy3vfjHBGi3F6yNwZ6Us/x7QHtNwUN3HeWTSzNAA7f52zSe8Kd/maWnffhXLfgv0JNATwLdn0B3/n/IwQ1IWZdBj6ppfwONaZ4VPY21VAAAAABJRU5ErkJggg=='
  },
  'external_SoundCloud_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'SoundCloud', 'section': ['', '<b><u>SoundCloud Settings</u></b>']
  },
  'external_SoundCloud_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'http://soundcloud.com/search/people?q=%ARTIST%'
  },
  'external_SoundCloud_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_SoundCloud_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_SoundCloud_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_SoundCloud_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'SoundCloud is an online audio distribution platform based in Berlin, Germany that enables its users to upload, record, promote and share their originally-created sounds. In July 2013, it had 40 million registered users and 200 million listeners.',
  },
  'external_SoundCloud_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_SoundCloud_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': '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'
  },
  'external_Spotify_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Spotify', 'section': ['', '<b><u>Spotify Settings</u></b>']
  },
  'external_Spotify_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'https://play.spotify.com/search/%ARTIST%/artists'
  },
  'external_Spotify_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': 'spotify:search:artist:%ARTIST%'
  },
  'external_Spotify_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_Spotify_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_Spotify_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'Spotify is a commercial music streaming service providing digital rights management-restricted content from record labels including Sony, EMI, Warner Music Group and Universal. Music can be browsed or searched by artist, album, genre, playlist, or record label. Paid "Premium" subscriptions remove advertisements and allow users to download music to listen to offline. On computers, a link allows users to purchase selected material via partner retailers.',
  },
  'external_Spotify_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_Spotify_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': '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'
  },
  'external_Tidal_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Tidal', 'section': ['', '<b><u>Tidal Settings</u></b>']
  },
  'external_Tidal_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'https://listen.tidalhifi.com/search/artists/%ARTIST%'
  },
  'external_Tidal_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_Tidal_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_Tidal_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': '/%26/g, \'%2526\''
  },
  'external_Tidal_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'TIDAL offers true High Fidelity lossless sound quality, a prerequisite to enjoying music the way it was intended by the artists. For a single monthly subscription, TIDAL is the first to offer both quantity and quality with an extensive music library of 25 million-plus tracks, streaming at more than twice the bit rate of competitive services. TIDAL subscribers will also be able to watch music videos, all ad-free. TIDAL\'s editors hand pick the music presented in the service, personally selecting and showcasing the best new albums and tracks across all genres every day.',
  },
  'external_Tidal_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_Tidal_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAAKESURBVFhHvZVJaiphFIVLAyEDJ4qjBKPo1BayhDg0CCoqToJkG4HY4QZMJARFcAUiuAqbsQ1RHIQQp1FjQ27e/R+/qeZW6UNe/fCBde6pOsdqBdECnZEsyqAHbFEDPSFFPSFFPVGKTqdToVGcnp7CxcUFOZPjcDjAaDRSM6mQyWTg8/MTrq+vJbocDG80GjAej/cW9nq98P7+DtVqlSrxu5HL5eD7+5sxn89VS2B4s9nceSeTiWoJDP/4+Nh5a7WavMTfH/l8fmfiYIlgMCg2K8I5VAmfzycJ58hKCFAoFBQmjrjE2dkZtFot0odMp1NwuVzM6/f7YTabkT6kXq/DyckJCMVikTSIwRKhUEgznIMlotGoZjgHSwh3d3ew3W5JAwdPI57O5+dnci6m1+tBIBCA0WhEzsXgZWeXIJ1Oq5bAcLyR0GcwGKBcLpM+pNvtgtVqZd7Ly0sYDoekD8lms8zHCiBUCXx0PB4PNzKwxNPTk8SHdDodsFgsEi++IwaDgcKLj7rI97vD7e0tbDYbZsJwt9stNu7AEo+Pj7sDUuEceYmHhwe5R7LBSry9vamGiymVStBut8FsNpNzzvn5OfT7fbi/v6fmCgFMJpNCo8DrHIlEyJkcjWOS4l5sNhu70xeLBXtEKc+BkKIm+M9fX19313W5XB5TghRVkYeLS9zc3JD77IEUSex2O/v6ycM5X19fEA6HyX01IEUF+B045O2GJa6urshjqECKJKlUCtbrNRnMUfnma0GKqiSTSdUSlUrlX8MRUtQkkUgoSry8vLA3JOXfAynuJR6Pw2q1OjYcIcWDiMVi7JtwRDhCinpCinpCinrCFjXQA8miDP+TP0sQfgAbiI7MBa0d0QAAAABJRU5ErkJggg=='
  },
  'external_Tumblr_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Tumblr', 'section': ['', '<b><u>Tumblr Settings</u></b>']
  },
  'external_Tumblr_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'https://www.tumblr.com/search/%ARTIST%'
  },
  'external_Tumblr_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_Tumblr_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_Tumblr_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_Tumblr_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'Tumblr is a microblogging platform and social networking website founded by David Karp and owned by Yahoo! Inc. The service allows users to post multimedia and other content to a short-form blog. Users can follow other users\' blogs, as well as make their blogs private. Much of the website\'s features are accessed from the "dashboard" interface, where the option to post content and posts of followed blogs appear.',
  },
  'external_Tumblr_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_Tumblr_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpDRjVDRjVGRkNEMjA2ODExOTk0Q0JENjYyMjkyMDY0NyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo0OUE5MzczQzJDNzUxMUUwODZENEY1QzQ4MzY2ODM0MiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0OUE5MzczQjJDNzUxMUUwODZENEY1QzQ4MzY2ODM0MiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkNGNUNGNUZGQ0QyMDY4MTE5OTRDQkQ2NjIyOTIwNjQ3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkNGNUNGNUZGQ0QyMDY4MTE5OTRDQkQ2NjIyOTIwNjQ3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+iQZhKgAABidJREFUeNp8V12IHEUQrp6Zvb27vTtzeOFyEuUC+VGDJpBoHtRA9CUPBgUFUZ/ExMRXUR+EiAiK8UlRIQElgvoiGAki+hAkb9EQ0UQihFxMJD/mLrnby+3P7WZnuqyq7p7u2dukl9runu6pqq76qqZaISKoKFIbtr+0vDwwvJfGrwBAHygFrvnR0lmxYY8RT2TWIbqCOjtw/PtPPqSxRq1RkSA1MHJnaf225z9bdc9dO+9fMwlxHHlxygtWt9IDu4cYyDVNaw2t1k344+8pmJ2b//zE4U9fpccZKxBv2rHnrbHlY++uHF8ON+pNaLbaxCK0gLIClVVI9Ty9EYi5QmgHivpIRTA8NAAjlQE4e+Ei3Ji/8drvP+z/mI8aqzjZlcSJCG8seuFKBCoxgyIGZmx6M496P4/sO5YP88vIAvMLDagu1GFwcJD2xLtpKUn4j7aNddIMtAg3tuOXkfmgOTDmTvDW6O1+tAfA/BE6X1DfaLahk6as7N1OgZg2RM5PTnO0cjA/iQoAoZYqoAK8YSjceQVlkmaZKEQU00rECij7oMgMDQLZAk4Zsxbd3gLKow/DJQcNK8vKEwVoos0DJ9ChH91hlT+1Hc9MT8OV/y6JgI0bN1lfWQG8R2MuVHiLVdArRzK5Jc5HsolfioyvEbrCTwUuoH7r5nvhhSd3y/Tt/YeDmPPAw0JEBIoEFo+8AmQF0MGiI+3HogOdfmYatmxYK2g3iAcbCaE/0AIRc/5eOMnRuksBPj3v0XaT2U+kDAiI0k4Gly5egkc3rIa1q1ZCFEVCStjYfcJQ+dDRmOvj5DgZo6OjKuE/1kjbDcriIAowoMGccPb6DLy44zHYvvWhAv5OnvzTJiINfaUSrFmzztpNeTugSVT52PrGYMBqpKyPWAMDygAFNH195zPw4LpVS3Lgzwffz8dXr1Vh38EfC8GBARgxsEQAQm0pcJ8I1aSLMv4jC7C5w+9ErxbHNgk5LFmmXkaAiYICbAXlfIacnmSMxgHCpDJYIQHxbRUol/sLfmbSWYgrtxYqoBkDWsCT5z2tJOewLhEaXHz0zU9ihQN7Xy4I3fPel5ZxJrwMpgzShcDOcwv4KEiq1SqucGbhh1FkIautOxS9TF8za076hFMCL1rBnSg/ccHUKO9jDypYQJjYX6TyuLHEJyAMsFIUHkmXG+QbYpWDMNTYsnlYB26xa0UFAhCy0ZS2aV9cYGDMzDiwki4giukD0xp+mTd7zr+HC8JMmLGvacF807UIV9p/il2y63bB7Ows3LFsmfBo1GoQkYKcD3JhDuRBZBRTsYCnaDrudUa9o9SPYw7HgJ5+fDP8c+4snD83BRvXrYTJiTHDQ/ZjF+9eLshztQEdcnrVJvvpiN3BGRIl5SoqHRapZBum0sq1N3c9K+TaBwe+hYtXr+emhy7zL7WAgMxophG9HwVEIWVCX3x3RBLSrahcLnu/awPOpZHQ63Ocp8FIYlf8LunBWgAj6Q8f+RWuTM/CU088DNu2PJCf/Mz5y/DLsVO0fqx42twSviYohqErSEDb8sekXinHRHhklTChwYr9dvIMHD91Jk/4ebVjc4jJ9T4/QJiarUtCBbjxBcWXk+bKUFQCTJWqbGHiel/OYV4TOuHmwNpbWDK8rKFTgNyqL2dpZ3WUlCjPqGIRaEss+bAqq5StjH3ZjYXizwvzpvanRyrRUxY6S7ykGtZpu/nVYn1BwlFrnadlrX0iCUEolPmxrOfzInglFRf4ZNBu1CFrL35dKpWymI9Um/n3r4HRFZO0eX1ESUaqOcyCzJZZv7pnGdvNzom41NaZPUBKfZrv1W6PzY6tZhMWF+YOzZ8/8U61Olc3VxkADurRFfc98kapXHmOsDDGV7bCjbBHKa5UcV4o7YvodLfFVN9sHWpcu7BP3VyYmpuba9i7F7CwcqVSGcqyrJIkST/IJwBVX1+fIlMJ0XPpBTxJ0vOanKapuQp3Oshj7pnY1cS7Te83iW9tYmKidfr06Y5y13OblOLx8fESvRCPjIxIkhoeHlZDQ0MijO50ionH/f39hZ5bq9VCJh43m01k4nG9XsdarYaUoLJ2u92ZnJxMjx49mvH1/H8BBgBsZZyuUowGlwAAAABJRU5ErkJggg=='
  },
  'external_Twitter_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Twitter', 'section': ['', '<b><u>Twitter Settings</u></b>']
  },
  'external_Twitter_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'https://twitter.com/search?q=%ARTIST%&vertical=default&f=users'
  },
  'external_Twitter_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_Twitter_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_Twitter_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_Twitter_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'Twitter is an online social networking service that enables users to send and read short 140-character messages called "tweets". Registered users can read and post tweets, but unregistered users can only read them. Users access Twitter through the website interface, SMS, or mobile device app. Twitter Inc. is based in San Francisco and has more than 25 offices around the world. Twitter was created in March 2006 by Jack Dorsey, Evan Williams, Biz Stone and Noah Glass and by July 2006 the site was launched. The service rapidly gained worldwide popularity, with more than 100 million users who in 2012 posted 340 million tweets per day. The service also handled 1.6 billion search queries per day. In 2013 Twitter was one of the ten most-visited websites, and has been described as "the SMS of the Internet."',
  },
  'external_Twitter_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_Twitter_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADeElEQVR4nL2XP2wbVRzHP2f7znHv4j/BMY5cqzJYYqkgTEg0C1O9wAAL6gBIHdkYEBKoiI7e6VAJqclQJndADEZIsAQJTynIHVIsjNRacR3HvpzvmuSefWZI7OD4znHS4O90er937/u59+f3fie98/1fCnAL+ARIMRvVgHvA7QDwjaxFv5C1KJI/MBP3fq+bEqb+pTB1vw+4Kc/HZmYOIPkDyPMxgJs+YFHy+WdmPoQ49Fz0zdz5hC5+3vv942dJmh3A860qfac31q5E4shaFNvYQXTahBJpfHJwMsBe4wmOOBgZwEu9fYv9nS1ymTAfXY2RVOVhrFg1uLPRxNxtspwI8caVBVbLT1BT2ckAjjjg7vU0Ff2AfKkB4Amxv7PFp2/G+eC18XguE2Y5EQIgqcrcWt8icGl+pM84wNEaZmNBsrHDqcqXGnSfdwgl0iNdbWOH5UTI1XygwYxU2ge8nVIBi99bzwjGXgbg1FOQy4S5ez1NQnGwahWEqQ9jotPmWko9bYjhB1m2w/pTa2gObjNwtHNN20FTfMOX7797hWLV4MHjXSq15rD7q7Hg2BBu+najSWFTZ+6lpZF2z1NQeKzz8dWFkbZcJkwuE6ZuCX57amEKB02eLpUUNnUuLWU4mfQ8AVbLLa6l1OE++K+Sqjxx3b0kSeOwnpvwlw+zY6HzyrSdAcFYbBzpqNPDxt6FAUway3UBAyGNtXLrwgD+2N7zvG1dAYILSR429siXGsfT9wL6qWoQirvXOp5bWE1lKVYN3nvw9wuZF6sGpu0gBWTXuCdAvyvQFB8/vP/Kuc1N22Gt3EaJxD37eAJIARnTdvjs19q5l2H1UYu6JSZeZhOziJrKUmkfcOPHfyhs6tQtMbV5sWoMk88kTQSwd49T7mHWm650K1YN8qUGSiQ+lvlOyvVsCFMfmt9eWWLl8nQXjmk7rD5qUdjUT60jJgLYu00+fytBLhOeyhgOv3qt3KZuCdecfyYAJRInX2pwZ6PJSkrj9cQcSVUmGw2iKT7qlqBudalbgj8b+6zXTEzbQYnEUVNnuyNcAWQtiqxFcbqCn2vPKFYNzwH8yhzBWBrV45yfC2AgKSAzt3h5tLHfn6ranVZn/y+4QPMBwLZbOf1/68hz2wd8Jzpt+r3u7Mx7XUSnDXAvAHwtTF0Rpn4DSM6IoQ7cB776F2hFQPDrlggRAAAAAElFTkSuQmCC'
  },
  'external_Vimeo_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Vimeo', 'section': ['', '<b><u>Vimeo Settings</u></b>']
  },
  'external_Vimeo_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'http://vimeo.com/search/people?advanced=1&q=%ARTIST%'
  },
  'external_Vimeo_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_Vimeo_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_Vimeo_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_Vimeo_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'Vimeo is a U.S.-based video-sharing website on which users can upload, share and view videos. Vimeo was founded in November 2004 by Jake Lodwick and Zach Klein. Vimeo was founded in November 2004 by Jake Lodwick and Zach Klein, who left the company in 2007. The name Vimeo was created by Lodwick, as a play on the words video and me. Vimeo is also an anagram of the word movie. IAC/InterActiveCorp purchased Vimeo in August 2006, as part of its acquisition of Connected Ventures. In January 2009, Dae Mellencamp joined IAC as General Manager of Vimeo. She served as the CEO of Vimeo until March 19, 2012 when Kerry Trainor joined Vimeo as the CEO. As of September 2013, Vimeo\'s search feature requires Google Analytics to work properly and users of Firefox and Chrome web browsers cannot search on Vimeo without disabling privacy protection. As of December 2013, Vimeo attracts over 100 million unique visitors per month and more than 22 million registered users. Fifteen percent of Vimeo\'s traffic comes from mobile devices. As of February 2013, Vimeo accounted for 0.11% of all Internet bandwidth, following fellow video sharing sites YouTube and Facebook. The community of Vimeo includes indie filmmakers and their fans. The Vimeo community has adopted the name "Vimeans", meaning a member of the Vimeo community, usually one who is active and engaged with fellow users on a regular basis. Numerous popular entertainers have used Vimeo to host content. In 2009, Britney Spears used Vimeo as a platform to premier the music video for her single "Radar". The White House posts high-definition versions of its broadcasts to Vimeo. Vimeo has helped to offload traffic from Improv Everywhere\'s servers after new pranks are announced, and continues to host most of their videos. Vimeo was also the original location of Noah Kalina\'s "everyday" video, a popular viral video.',
  },
  'external_Vimeo_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_Vimeo_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M0BrLToAAAABV0RVh0Q3JlYXRpb24gVGltZQA2LzI0LzA59sFr4wAAAjpQTFRF////////AAAAAAAAKioqAAAAAAAAAAAAAAAAAAAAFBQUSbHNRq3KH3mmHmaNR7XVGHWwTLrZR7PVJIK7Em6tDHC3DnW7E4nFFHq8Fo7GFpTKGZnMGaDQG5rMG6HQHaPRH6TRIKXSIqbTJJPIJKjTJYzEJZXJJqnUJ6rUKI7FKYjDKavVKorFKqDPKqPRK43GK6zVLKDPLZDHLaTRLarULazWLa7WLpLILq/XL5TJL6PRL6XSMJbLMLDXMafSMazVMpjLMqrVMrHYM5vNM67WNJ3PNK7WNK/WNLLYNZPHNZfKNa3VNbTZNp/PNq7WNrDXN5bIN7XaOKHQOLDXOaPQObbaOqbSOrTZOrXZOrfbPKjUPLjbPbHYPqrUPrXZPrrcP6vWP7bZQJfIQLfaQLvcQa3WQbzdQrDXQ73eRLLXRb7eRrTYR7zdR8DfSLXaTJzJTq3TT6HMT73eUMPhU7TXV7DWV77cWcDeWr3dWsHfW6bPW7fYXLfYXLfZXbjYXr/dYK3TYMPhYr/cYsDdYsHdZajNZajOZqnPa8PebMvlca3Pcszld7TXfdLnfrPRf9LogMPbgMTdgszlg8nfi8bdkNLnmtDhm9PlntfrpMXYp9fnqNjqqsvertLhr8rYuODuwd7rx97lx+jzydzoytfezubtz+fv0N7k0enw19zg2N7i2ujv3ePn4Ofq4uLi4ujt5OTk5ubm5uzw6Ojo6urq7Ozs7e3t7+/v8fHx8/Pz9fX19/f3+fn5+/v7bd+UPAAAABV0Uk5TAAIDCgwNDiUwMTORkqK12uXn6O7x7LQiJwAAActJREFUGBl1wc9LFGEcwOHPO/N1NDNbrDQsyIo8SFSXqHunqEMEHeoWRIeCLv0dEQR1lYIunrpF16ioi4foEKTlsFhp6yKLuuv74zvN7Gg/cOd5DJjB5Ca9TNuNDIMZvjMSReyk2nzSygxDd0eWLb0ko83Ha0IymNJbOx1LMNxTTxWJHglhM6JKpx9BUSopgjq2NL5PDpDr1Jc4dJRCjKCerjB78cJrARaGr+znx4c95BTBKYWV+v0DjD7bx89Lx/ug9muJnEMIntzX07cSGDqVcmaKwsQiOUEIHpi7MUVh0DevGgotTy4geAfcnmiOUHDn5mtHgM3UketDUA/Mrr69Ngao/8j5CWB5kYIiqAXSlLWDgLE0DhvovLcUFME5upZPAOral8eBL9/ocggdR5cYwHZGzxpYeEGpQ4RueWlyY6vXdxlTn9ZtCMFSMsDkg35ovLJsCQjeUWrthQGgMTPHNo8QAqX1GoWVpyl/BATNKDlDrv68zl+K4AKl+WPA54f8yyEEpTQzXtt4847/BAwn16m2+5OgPqZKUGLUxFRxrbZg+3xMbyGzSNSOEx9H7KQhs+1ITGw1UXrJrI8zAXWOChmYyESGKplmvwFhk85THbgQpwAAAABJRU5ErkJggg=='
  },
  'external_WhatPeoplePlay_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'WhatPeoplePlay', 'section': ['', '<b><u>WhatPeoplePlay Settings</u></b>']
  },
  'external_WhatPeoplePlay_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'https://www.whatpeopleplay.com/search/%ARTIST%&category=search_category_artists&submit='
  },
  'external_WhatPeoplePlay_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_WhatPeoplePlay_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_WhatPeoplePlay_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': '/%26/g, \'%2526\''
  },
  'external_WhatPeoplePlay_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'Whatpeopleplay.com is the digital download site of Wordandsound (Medien GmbH, Hamburg, Germany). Wordandsound is one of the market leaders in forward thinking electronic and alternative music offering fine Vinyl, CD and Digital Distribution Formats to customers around the globe.',
  },
  'external_WhatPeoplePlay_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_WhatPeoplePlay_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAASoSURBVFhH7Vb7U1NHFOYvamun79e00xdCq6FSW0cQdbRKdTotsUFEdErF1xRLgmCqDYQQHuGVyLMhAZpCk4AQZqACQmIhVaa2KNRAIEjydffc3JBAptIfgF/8Zs7cs2fPnvPt7tndGyNi69MKbKQE0wqI5rARsqnJRVlFIPYpOX33vF+E/DPtkKZUR/SvRcQYa5EIAoXnOvDH+AOcPlqPk6kGcOi1/REDHicFZ4UYp1gM3tZeseHwR9pVfqJEECgttFPSc7JmZIYRiN+Sj6R3Vdj+QkHEYN5Ofq8Iia8qQzZNgY3G8Ri8vS9OjYSXr5Cf5MXCkJ8oIQKXc9rh+WeeBk/fn0P3L7dJt3e44L49xbQA5mYXcOm0ifx1qhuY9y6SfWnJj4HeO6gquhEWw4ur31nQWDWARd8S+fkWHsGo/w0fPnd5NYGvknXos47T4PamYZQpu0n3LwVg0DpIAgGwpD6c/NzA9ABGb/6J3KxWmOuHyPdm/10WY4J0HuOn2kHSO5pH8G1aI3q7fmetAL4PTiKCABdxC86ntwRrIABbhzPYL8fdiWnql6ZUIUfahNRELQ6x/dWpesjOiQhbEMB5WUtoEg77BM4ea8aRnWX4el81bYuY8zEEAEPZchE6R/4iG09qY1uz6HvEVsKP+397yL6SwIFtGky6p2m1uI1/Bx13sPf/EAg/Bc6Re8wSgOm6sOQ1JX3Y/faPkO2vofZKAh+//gMVb8bBOnYa7HDdEiZgMd4KxYxKoCTfigvHW0iPRkDc5zNsGyQvFVJhcSwTANQKKy0991de+BmJrymRdeQ6ta3trlDMCAL86IjLxQuKQ8+KT+wXCeR9Y6bK9/v9tA393W6y97OEfPXEGL+2OTHzYI50P/Pn9tmHC0hLrgrFjCDA5TNJKU4cqqPvwe0a7HrrWqhv71Y12T54Nh+pO7Ssms2sqGronuB2LnHP5Adj6JESy+4INvPsLxsgZ6R54e5842pEvlUENlqeENh8AsqLFhSwd4AXyaVTJlw8YWSnoQU5x5pY8TTSy5h52IDjB+roFuNX9he7KnH0kwoqRF54++PV2MMKbvc7Knz65jU6/zteUSKBHdFtzxfQ3R/PCjdui4IVqZhcjlgmMeyMrBsCfuGh4o/RwvwivLM+OoYPZ7zssZrF1D3P+hJYC54QiEpgcnIS8/PCjwWHz+fD3By/Uv8bPT3CsxyOhoaGoBYdIQKjo6OUeGBgAJWVlWhtbUVvby8sFgs6OzthNpuhUChQUVGB+vp6lJeXU3C1Wg2tVguVSgWlUkljDQYD0tPTkZGRgbS0NOh0OmRlZSEvLw8OhwN2u/DocYQIcGNbWxvkcjmsVitmZmZQXV1NOk/idDpRXFyMkpISZGZmkh9PWltbSzonK5PJIJVKiQj/8oRJSUnIzs6GRCKhOAkJCfB6vcGsYQTcbjc8Hg+Gh4cxNTVFyz42NkYEBgcH0dfXR4n5inDdZDLRbIxGI3Jzc6HX6zE0NET9NpuNEpeWlpLOfTQaDbq6umhFwrHmIuRP6fi48M+4EtHsLpcrqC2DE+eTC8eaCawXNp8AR1DfcFByEUHbhkHIGhPzL55X8rj4ubC7AAAAAElFTkSuQmCC'
  },
  'external_Wikipedia_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'Wikipedia', 'section': ['', '<b><u>Wikipedia Settings</u></b>']
  },
  'external_Wikipedia_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'http://en.wikipedia.org/w/index.php?search=%ARTIST%'
  },
  'external_Wikipedia_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_Wikipedia_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_Wikipedia_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_Wikipedia_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'Wikipedia is a free-access, free content Internet encyclopedia, supported and hosted by the non-profit Wikimedia Foundation. Anyone who can access the site can edit almost any of its articles. Wikipedia is the sixth-most popular website and constitutes the Internet\'s largest and most popular general reference work. As of February 2014, it has 18 billion page views and nearly 500 million unique visitors each month.',
  },
  'external_Wikipedia_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_Wikipedia_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1MzmNZGAwAAABV0RVh0Q3JlYXRpb24gVGltZQAyNy8zLzA56KykjAAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAwOS0wMy0yN1QxNToyODozMVo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAwOS0wOS0wOFQyMzoxMzowMVo8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgpRAV/wAAAapQTFRFAAAArKysxcXFxcXFpaWlpqamp6envb29wMDAwcDABAQEBwcHCwsLDw8PEhISFhYWGRkZGhoaHR0dISEhJSUlKCgoLCwsLy8vMTExMzMzNTU1NjY2PDw8QkJCQ0NDRUVFSUlJSkpKS0tLUFBQU1NTVlZWXl5eYGBgYmJiY2NjaGhobGxscXFxc3NzdnZ2eHh4hoaGiIiIiYmJjY2Nj4+PkZGRlZWVnJyco6OjpKSkpaWkpaWlpqamp6enqKioqampqqqqq6urrKysrq6ur6+vsLCwsrKytLS0tbW1tra2t7e3uLi4ubm5urq6u7u7vLy8vr6+v7+/wMDAw8PDxMTExsbGx8fHy8vLzMzMzs7Oz8/P0dHR0tLS1NTU1tbW19fX2tra29va29vb3Nzb3Nzc3d3d3t7d3t7e397f39/f4ODg4eHh4uLi4+Pj5OTk5eXl5ubm5+fn6Ojo6enp6urq6+vr7Ozs7e3t7e7t7u7u7+/v8PDw8fHx8vLx8vLy8/Py8/Pz9PT09fX09fX19vb29/f3+Pj4+fn5+vr6+/v7/Pz8/f39/v7+////F171MgAAAAp0Uk5TAJCQkfPz8/Pz83vstw0AAAK1SURBVBgZBcHNbtZVEMDh38w584JA1SCYAG0ENGK0fiTWAHVLjAsT9QJY6J15BW51oys3qGlCE4hgiJa2FAKC2Jb3/86ZGZ9HaLPPSyGVRKuURBMUkh88RL8+f8pSExEgFVJTUxOova3vu104TUa0oAERNDKiZbQSOZuz9sXbKaO0UocMEZEaqSklI6U4NuvRYjQqWuloo0WLRlURtKJ69aqM6AOBkAhEcqguehDATDo1YRmEERrmioNbBuZdJDvVPN0gvWXLljRvmQ7ZqjJ65iRTD0bP7KNHi2JiAqYOJr2QQXRk6kQIU0cAGD0Ys+hF1c/bANd/2gG++XEHzl37DuB6E2kX3zioj17ajqPfLj6cP4krJz+4Pfvq4+no/b765SJtS6VUnr75Th0+1GeXz9a9uvPvZ0ee1ntLl9ZfVJEa4SUvLve64bK/3h9sb5w54ekb09X9gZRoJZm5f64eiIucq43Hn8xT5O5bhykjM1SSGqXrzX+pYr09Or1Umreer45RWolGpYtkLdd2ZtbJWrjkuLvcU9JTUanMdK9P2+HvmXt79eiR5+3nVydxTx+hJUNDtXg996o2T6zmzRr3VlSrSpXSqjExZY61enJrb2ftct99/MeTd0fmkJGIjlKda4z58eXavnlq5b+VuvPn8qvzmEcs5pEqMU0tp0X6Wu3urr6YVuvvf9amnDKnTB1Kw9wBllbqtYvwyoqvHKcbYAYK5gbA4ny9/ww7OF8Xhgtm5kTrAebmmHPp2l9zNy5du39gjrkZRBfccHA42KQDB5sg4OCAKrgZZgaoGM0NOmY4Bh0w3HAsDMfCHAPHHKVpTUfw7mDewMxxAAxMbYT++nBpZmKAFQAGlAPokWMPfuu+W2deDmhEI2gBNIJGtGlrdwjSrow+OgM6o48e1UfPhM4Nr/8BUnnSnwJjWWsAAAAASUVORK5CYII='
  },
  'external_WiMP_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'WiMP', 'section': ['', '<b><u>WiMP Settings</u></b>']
  },
  'external_WiMP_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'http://play.wimpmusic.com/search/artists/%ARTIST%'
  },
  'external_WiMP_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_WiMP_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_WiMP_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': '/%26/g, \'%2526\''
  },
  'external_WiMP_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'WiMP is a music streaming service. The service is available on mobiles, tablets, network players and computers. The service is made by the Norwegian company WiMP Music, which is owned by Swedish Aspiro AB, listed on the Nasdaq OMX stock exchange in Stockholm. Music in WiMP is streamed using the AAC+ file format in a bitrate of 96 kbit/s or the AAC file format in a bitrate of 320 kbit/s if the high quality streaming option is selected. WiMP also offers a HiFi-product with FLAC/ALAC.',
  },
  'external_WiMP_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_WiMP_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAATJSURBVFhHtVdrbBVFFF6NGprevTWBpIkhNT4TSMREghAKdxdtIdrex1ba1NDSUmoErVS0/CjBK8FSFcUSUUyIf4j4gn8YU5SXCIlJE0UNMZGWNEFra21BCrW0Xns8Zx47s3t3b2sTv+RkZs6c833nzs7O7DUAwJgpFhoLb7UMa5YYzgz/pYBEgVXimHa7Y1pHnaj9E1o/2h9OgX0R2zNo+xNmbG08f3GhSJkaUxWAv/CWlGltQeGeioIV4DXbN+Y+LGQM7YNkfuwBQROOXAXEo7HSbOEgUd30eRtSpr0DqW7mjAEIKyAVjaWzCaey4FhcjdNIeRNn9iGogFTUPsCTiTCsgCC/38fHb294FWXggKD3wl8Aiotfnk00vTH11fiJ2x+Bv0ZGqQBCWsgooFP0+C5XRGEmyYOK0I37d9WmubRCiZDjQAdr5xvzb6Pd6yXNZf4Cgu2rT77ksgpjTFACHaxNmlZLEEG2TU9YWl/3JS6rIWnGHk8YS00mjGPWpqLW795kXUguqzR/jH+e+2vvjEPm7wxXFfjmyNdszolYq5kw+oxkvmWHk+p+fZzLeFzDfRUwOTnJlQVaS5vYnGPGPlIFmLF2L0GY2ZAufx72bXoTOta/AhsfXOP6s4uzoWpOKYxcvsqVEZlMBurvTrF53G8DbgF4WnUqguB208P10HPuZ86k4eSHR6FydomI1Y3ybDh/5pyIBBi9eh2qC1e5MfGodS8rAKvp9SdSHy8Z1lbNKYGR4T85SwB6f+wWuTJf9lfAZ/sOiyiAG6NjUFNU5sYlo8tXyQJG/YkyiNrtyRbOgPjh1Lew7bFm2L1uh37A4Ep0Bua+27RLRHBsWPCkO4/HfZVWgJ7oLWb/i3tY8sSNcVzuR13/sw/VenY5HToqj3NsXdkkZjk2Fze6c06BVckLwPtcJerGA2UBg5cGXJ+0dPlmNkeYGJ+ASnxcKsZme0fHFutpN9fB21ZswhhuQiWo+nzcsb6NJV+/co3tBxXD404c7GTzhK7Pz7p+av2P4LlFdWJe34Sm1SadurBsXypr5tkI9QyV0YWjb9LvjnfBG3Xb4b3m3WznS9AKVReuxBz20dLvvobxyLJiIqq/JwWN81azAL2QxnmVnAFBG5ALyyK5teDSTgW6F2Q8fmUddAugc5muYXpn+3p+gdOfHsMgXcCG4f4hRtJevVXze21nVSuLCcJQ36A4hDgvewVlAQQnz5q7Zm4Z7uwauHZlhF0inJivBBVGeDn5gkuiTI2bF6+DUx9/AQO9v8HlgWG4+P0FOPLOISBuGetErV+ZKEEWkMhbegc+l38kEYHeeaqall2ipqjcJZKxYYZCE7zvjU1ElseYKAE5RQ9vxMgySwbV3ZX0HDT0vu95qk2Q5BLPXRh+5PJLSAK5RY8Dr+VWlWDD3o2vwd5nXoeG+ytcn1ckaKy3yo8rcgElvB+n/gIIuCHfyibxE4ZZtjATN+3ulLlotpBQCCqAgCuxzUs0XeOCeiH4y8/iH5yIoPYirAACHZWYfF6R6a1XJGgeN/W4+GMSjlwFSOBR3YBEXcFi2YbCg/gYO8pnFRcJinBMpwAJ+nTDE2yn78/pEFovLTPa+/iptbbUWJAvUv4/0F/zJcaSPDGcIQzjX5mBSLYDDTZXAAAAAElFTkSuQmCC'
  },
  'external_YouTube_name': {
    'label': '<b>Name</b>', 'type': 'text', 'size': 16, 'default': 'YouTube', 'section': ['', '<b><u>YouTube Settings</u></b>']
  },
  'external_YouTube_searchurl': {
    'label': '<b>Search URL</b>', 'title': 'External site link search URL', 'type': 'text', 'size': 96, 'default': 'https://www.youtube.com/results?sp=EgIQAg%253D%253D&q=%ARTIST%'
  },
  'external_YouTube_alturl': {
    'label': '<b>Alternate search URL</b>', 'title': 'External site link alternate search URL', 'type': 'text', 'size': 96, 'default': ''
  },
  'external_YouTube_lucky': {
    'type': 'checkbox', 'label': 'Google Lucky search', 'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL', 'default': false
  },
  'external_YouTube_urlreplace': {
    'label': '<b>Pattern/Replace</b>',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
    'type': 'textarea', 'rows': 1, 'cols': 16, 'default': ''
  },
  'external_YouTube_description': {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'YouTube is a video-sharing website headquartered in San Bruno, California. The service was created by three former PayPal employees in February 2005 and has been owned by Google since late 2006. The site allows users to upload, view, and share videos, and it makes use of Adobe Flash Video and HTML5 technology to display a wide variety of user-generated and corporate media video. Available content includes video clips, TV clips, music videos, and other content such as video blogging, short original videos, and educational videos. Most of the content on YouTube has been uploaded by individuals, but media corporations including CBS, the BBC, Vevo, Hulu, and other organizations offer some of their material via YouTube, as part of the YouTube partnership program. Unregistered users can watch videos, and registered users can upload an unlimited number of videos. Videos considered to contain potentially offensive content are available only to registered users affirming themselves to be at least 18 years old. YouTube, LLC was bought by Google for US$1.65 billion in November 2006 and now operates as a Google subsidiary.',
  },
  'external_YouTube_icontype': {
    'label': '<b>Icon</b>', 'title': 'Type of image (extension)', 'type': 'select', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png'
  },
  'external_YouTube_icondata': {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': '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'
  }
};

var gmc_oinkplusexternals = new GM_configStruct(
  {
    'id': 'oinkplusExternalsAdvancedMenu',
    'title': 'OiNKPlus: External Sites Advanced Settings Menu',
    'fields': oinkplusConfigFieldsExternalsAdvanced,
    'css':  '.section_header { background: white   !important; color:  black       !important; border: 0px         !important; text-align: left    !important;} .field_label { font-weight: normal !important;}',
    'events':
    {
      'open': function() {
      },
      'save': function(values) {
        valuesSaved = true;
      },
      'close': function(values) {
        gmc_oinkplusexternals.close();
      }
    }
  });
gmc_oinkplusexternals.init();
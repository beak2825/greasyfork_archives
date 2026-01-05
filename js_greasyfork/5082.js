// ==UserScript==
// @name        MusicBrainz: Fix featured artists
// @description Tries to detect artist names in artist and track fields and allows you to extract those. Found entries are added to the corresponding editor for fast adding.
// @supportURL  https://github.com/JensBee/userscripts
// @namespace   http://www.jens-bertram.net/userscripts/fix-featured-artists
// @icon        https://wiki.musicbrainz.org/-/images/3/39/MusicBrainz_Logo_Square_Transparent.png
// @license     MIT
// @version     2.3.1beta
//
// @require     https://greasyfork.org/scripts/5140-musicbrainz-function-library/code/MusicBrainz%20function%20library.js?version=21997
//
// @grant       none
// @include     *://musicbrainz.org/recording/*/edit
// @include     *://*.musicbrainz.org/recording/*/edit
// @include     *://musicbrainz.org/recording/create
// @include     *://*.musicbrainz.org/recording/create
// @include     *://musicbrainz.org/release/*/edit
// @include     *://*.musicbrainz.org/release/*/edit
// @include     *://musicbrainz.org/release-group/*/edit
// @include     *://*.musicbrainz.org/release-group/*/edit
// @include     *://musicbrainz.org/release/add
// @include     *://*.musicbrainz.org/release/add
// @include     *://musicbrainz.org/artist/*/edit
// @include     *://*.musicbrainz.org/artist/*/edit
// @include     *://musicbrainz.org/artist/*/split
// @include     *://*.musicbrainz.org/artist/*/split
// @downloadURL https://update.greasyfork.org/scripts/5082/MusicBrainz%3A%20Fix%20featured%20artists.user.js
// @updateURL https://update.greasyfork.org/scripts/5082/MusicBrainz%3A%20Fix%20featured%20artists.meta.js
// ==/UserScript==
//**************************************************************************//
var mbz = {};
mbz.fix_feat = {
  splitPoints: [ // order matters
    '\\s&\\s',
    '\\s+\\s',
    ',\\s',
    '\\s/\\s',
    '\\s\\(?and\\s',
    '\\s\\(?with\\s',
    '\\s\\(?meets\\s',
    '\\s\\(?feat\\.\\s',
    '\\s\\(?ft\\.\\s',
    '\\s\\(?featuring\\s',
  ],
  splitPointsRx : [],
  btn: {
    add: '<button class="nobutton add-artist-credit mbz-fix-feat-add-credit" '
      + 'type="button" title="Add Artist Credit">'
      + '<div class="add-item icon img" title="Add artist credit"></div>'
      + '</button>',
    addAll: '<button class="nobutton add-artist-credit '
      + 'mbz-fix-feat-add-all-credits" type="button" title="Add all artist credits">'
      + '<div class="add-item icon img" title="Add all new artist credits"></div>'
      + '</button>',
    remove: '<button class="icon remove-item mbz-fix-feat-remove-credit" '
      + 'type="button" title="Remove Artist Credit">'
      + '<div class="remove-item icon img" title="Remove this credit"></div>'
      + '</button>',
    removeAll: '<button class="icon remove-item mbz-fix-feat-remove-all-credits" '
      + 'type="button" title="Remove all new artist credits">'
      + '<div class="remove-item icon img" title="Remove all credits"></div>'
      + '</button>',
    trigger: '<button>Try detect artists</button>',
    triggerShort: '<button title="Try detect artists">FixFeat</button>',
    triggerTrackList: '<button title="Try detect artists in track name" '
      + 'class="icon mbz-fix-feat">'
  },
  rowDiv: '<div class="row"><label>Fix featured artists:</label></div>',
  rowTab: '<tr><td><label>Fix featured artists:</label></td></tr>',

  _init: function() {
    // create RegEx objects
    for (let splitPoint of this.splitPoints) {
      this.splitPointsRx.push(new RegExp(splitPoint, 'gi'));
    }
    // append style
    MBZ.Html.addStyle(''
      + '#release-editor #track-ac-bubble {width:66%!important}'
      + 'tr.MBZ-FixFeat-Ruler td {height:2px;padding:0!important;}'
      + 'tr.MBZ-FixFeat-Ruler td:nth-child(2),'
      +	'#track-ac-bubble tr.MBZ-FixFeat-Ruler td {border-top:1px dotted #666;}'
      + '#track-ac-bubble .MBZ-FixFeat-Item .mbz-fix-feat-add-credit {'
        +	'width:170px;'
        + 'margin-left:0!important;'
      + '}'
      + '#track-ac-bubble .MBZ-FixFeat-ItemAddAll td {text-align:right;}'
      + '#track-ac-bubble .MBZ-FixFeat-ItemAddAll .mbz-fix-feat-add-credit {'
        + 'width:auto;'
        + 'margin-left:0!important;'
      + '}'
      + 'input.MBZ-FixFeat-MaySplit {background-color:#FFFFD0;}'
    );
  },

  /**
    * Check, if there's something to split
    */
  hasSplitPoints: function(str) {
    var cnt = 0;
    str = str.replace(/\s+/, ' ');
    for (let splitPoint of this.splitPoints) {
      if (str.match(splitPoint)) {
        cnt++;
      }
    }
    return cnt;
  },

  /**
    * Split something.
    */
  splitArtists: function(str) {
    var artists = [];
    var artistsCleaned = [];
    str = str.replace(/\s+/, ' ');
    for (let splitPointRx of this.splitPointsRx) {
      str = str.replace(splitPointRx, '|SPLT|');
    }
    artists = str.split('|SPLT|');
    for (let idx in artists) {
      var artist = artists[idx].trim();
      // skip empty and dupes
      if (artist != '' && artistsCleaned.indexOf(artist) == -1) {
        artistsCleaned.push(artist);
      }
      if (idx == artistsCleaned.length -1) {
        // remove possibly unbalanced parenthesis
        artistsCleaned[idx] = artistsCleaned[idx].replace(/\)$/, '');
      }
    }
    return artistsCleaned;
  }
};

mbz.fix_feat.BubbleEditor = function(bubbleEditorApi) {
  var b = null;
  var bubbleApi = null;
  var initialized = false;
  var self = this;

  this.getBubble = function() {
    if (!b || b.length == 0) {
      return null;
    }
    return b;
  };

  this.getBubbleApi = function() {
    return bubbleApi;
  };

  this.setBubble = function(bubble) {
    if (!bubble || bubble.length == 0) {
      console.err("No bubble.");
    } else {
      b = bubble;
      bubbleApi = bubbleEditorApi;
      initialized = true;

      b.on('click', 'button', function() {
        var btn = $(this);
        if (btn.hasClass('mbz-fix-feat-remove-credit')) {
          // remove row
          self.removeButtonRow.call(self, btn);
          return false;
        } else if (btn.hasClass('mbz-fix-feat-add-credit')) {
          // add artist
          bubbleApi.addArtist(btn.data('artist'), true);
          // remove row
          self.removeButtonRow.call(self, btn);
          return false;
        } else if (btn.hasClass('mbz-fix-feat-add-all-credits')) {
          btn.remove();
          b.find('.MBZ-FixFeat-Item button.mbz-fix-feat-add-credit').click();
          self.clear();
          return false;
        } else if (btn.hasClass('mbz-fix-feat-remove-all-credits')) {
          self.clear();
          return false;
        }
      });
    }
  }
};
mbz.fix_feat.BubbleEditor.prototype = {
  removeButtonRow: function(btn) {
    var b = this.getBubble();

    btn.remove();
    // remove lefotovers
    $.each(b.find('.MBZ-FixFeat-Item'), function() {
      // if one button removed itself, remove the whole item
      if ($(this).find('button.mbz-fix-feat-add-credit').length == 0
          || $(this).find('button.mbz-fix-feat-remove-credit').length == 0) {
        $(this).remove();
      }
    });

    var items = b.find('.MBZ-FixFeat-Item');
    if (items.length == 0) {
      // remove other elements, if no credit is left
      this.clear();
    } else if (items.length == 1) {
      b.find('tr.MBZ-FixFeat-ItemAddAll').remove();
    }
  },

  /**
    * Attach the list of found entities.
    * @artists Array of artists to attach
    * @return true if something was added
    */
  attachArtists: function(artists) {
    // check, if there's something to add
    if (artists.length == 0) {
      console.debug("No artists to attach.");
      return false;
    }

    var b = this.getBubble();
    if (!b) {
      console.debug("No bubble.");
      return;
    }
    var api = this.getBubbleApi();

    // clear any previous attached items
    this.clear();

    // show bubble
    api.tryOpen($('#open-ac'));

    var rows = [];
    var ruler = '';

    switch(api.type) {
      case MBZ.BubbleEditor.types.artistCredits:
        rows = b.find('.row-form tr');
        ruler = '<tr class="MBZ-FixFeat MBZ-FixFeat-Ruler">'
          + '<td></td><td colspan="2"></td></tr>';
        break;
      case MBZ.BubbleEditor.types.trackArtistCredits:
        rows = api.getCreditRows();
        ruler = '<tr class="MBZ-FixFeat MBZ-FixFeat-Ruler">'
          + '<td colspan="3"></td></tr>';
        break;
    }

    if (rows.length > 0) {
      artists.reverse();
      var self = this;

      var addButtons = function(target, idx) {
        var artist = artists[idx];
        // add button
        var btnAdd = $(mbz.fix_feat.btn.add);
        btnAdd.data('artist', artist);
        target.append(btnAdd.prepend(artist)).append(
          // remove button
          $(mbz.fix_feat.btn.remove)
        );
      };

      var target = null;
      switch(api.type) {
        case MBZ.BubbleEditor.types.artistCredits:
          // target is last row
          target = $(rows.get(rows.length -1));
          // append a row for each entity
          for (let idx in artists) {
            var aCell = $('<td colspan="3">');
            addButtons(aCell, idx);
            target.after($('<tr class="MBZ-FixFeat MBZ-FixFeat-Item">')
              .append(aCell));
          }
          break;
        case MBZ.BubbleEditor.types.trackArtistCredits:
          target = b.find('tr:has(button.add-item)');
          var rowCode = '<tr class="MBZ-FixFeat">';
          var row = $(rowCode);
          // append a row for two entries
          target.after(row);
          for (let idx in artists) {
            var aCell = $('<td class="MBZ-FixFeat-Item">');
            aCell.data('id', idx);
            addButtons(aCell, idx);
            if ((idx + 1) < artists.length && ((idx + 1) % 2) == 0) {
              var oldRow = row;
              row = $(rowCode);
              oldRow.after(row);
            }
            row.append(aCell);
          }
          break;
      }

      // append add all button, if more than one artist is present
      if (artists.length > 1) {
        target.after($('<tr class="MBZ-FixFeat MBZ-FixFeat-ItemAddAll">').append(
          $('<td colspan="3">').append(
            $(mbz.fix_feat.btn.addAll).prepend('<b>All new credits</b>')
          ).append($(mbz.fix_feat.btn.removeAll))
        ));
      }

      // append ruler before/after attached items
      var aItems = b.find('.MBZ-FixFeat');
      aItems.first().before(ruler)
      aItems.last().after(ruler);
    }
    return true;
  },

  clear: function() {
    var b = this.getBubble();
    if (b) {
      b.find('.MBZ-FixFeat').remove();
    }
  },
};

/**
  * Show only a link to the split artist editor on single artist edit page,
  * if we are able to split the name.
  */
mbz.fix_feat.artistPage = {
  init: function() {
    var strEl = $('#id-edit-artist\\.name');
    var str = strEl.val();
    var lnk = 'Please use the <a href="'
      + window.location.toString().replace(/\/edit/, '/split') + '">'
      + 'split artist editor</a>.';
    if (mbz.fix_feat.hasSplitPoints(str)) {
      var row = $('<div class="row"></div>');
      row.append($(mbz.fix_feat.rowDiv)).append(lnk);
      strEl.after(row);
    }
  }
};

/**
  * Parse entries on release pages.
  */
mbz.fix_feat.Release = function () {
  var initialized = false;
  var bubbleEditor = null;
  var currentBubbleRow = null;
  var entryCode = {
    item: '<span class="MBZ-FixFeat-Item" style="display:block">',
    row: '<tr class="MBZ-FixFeat"><td colspan="3"></td></tr>'
  };

  this.init = function() {
    if (initialized) {
      return;
    }
    initialized = true;
    var strEl = $('#release-artist');
    var canSplit = false;

    // init ac-bubble editor, if release artist name is splitable
    if (strEl.length > 0 && mbz.fix_feat.hasSplitPoints(strEl.val())) {
      var acbEdit = new mbz.fix_feat.BubbleEditor(
        MBZ.BubbleEditor.ArtistCredits);
      MBZ.BubbleEditor.ArtistCredits.onAppear({cb: acbEdit.setBubble});
      var row = $(mbz.fix_feat.rowTab);
      var btn = $(mbz.fix_feat.btn.trigger);
      btn.click(function(){
        btn.text('Rescan');
        var artists = mbz.fix_feat.splitArtists(strEl.val());
        if (artists.length > 0) {
          if (!acbEdit.attachArtists(
            MBZ.BubbleEditor.ArtistCredits.removePresentArtists(artists)
          )) {
            btn.remove();
            row.find('td').last().append('<em>No new artists found.</em>');
          }
        }
        return false;
      });
      row.append($('<td colspan="2"></td>').append(btn));
      strEl.parentsUntil('table').filter('tr').next().after(row);
    }

    var trackList = MBZ.TrackList.getList();
    if (trackList) {
      trackList.on('click', 'button', function(){
        if ($(this).parent().hasClass('credits-button')) {
          currentBubbleRow = $(this).parents('tr');
        };
      });

      // check rows that may be splitted
      var stoppedTyping;
      trackList.on('keypress', 'input[type="text"]', function() {
        if (stoppedTyping) clearTimeout(stoppedTyping);
        var el = $(this);
        stoppedTyping = setTimeout(function() {
          scanRow(el.parentsUntil('table').filter('tr'));
        }, 1000);
      });
    }

    // re-check rows that may be splitted on row changes
    MBZ.TrackList.onContentChange({cb: scanRows});

    // now initialize the track artists credits bubble editor
    bubbleEditor = new mbz.fix_feat.BubbleEditor(
      MBZ.BubbleEditor.TrackArtistCredits);
    MBZ.BubbleEditor.TrackArtistCredits.onAppear({cb: bubbleAppears});
  };

  function bubbleAppears(bubble) {
    bubbleEditor.setBubble(bubble);
    var btn = $(mbz.fix_feat.btn.triggerShort);
    btn.click(function(){
      scanBubble(btn);
      return false;
    });
    btn.attr('type', 'button');
    bubble.find('div.buttons').first().append(btn);
  };

  var creditEditor = {
    addAll: function(row) {
      var items = row.find('.MBZ-FixFeat-Item');
      if (items.length > 0) {
        var artists = [];
        $.each(items, function() {
          artists.push($(this).text().trim());
        });
      }
    },

    checkCreditsCount: function(row) {
      if (row.hasClass('MBZ-FixFeat')
          && row.find('.MBZ-FixFeat-Item').length == 0) {
        creditEditor.clear(row);
      }
    },

    clear: function(row) {
      row.find('.MBZ-FixFeat-Item').remove();
      if (row.next().hasClass('MBZ-FixFeat')) {
        row.next().remove();
      }
    }
  };

  function scanBubble(btn) {
    var artistsSplitted = [];
    // add all artist credits listed
    for (let artist of MBZ.BubbleEditor.TrackArtistCredits.getArtistCredits()) {
      artistsSplitted = artistsSplitted.concat(
        mbz.fix_feat.splitArtists(artist));
    }
    // add value from current track title
    if (currentBubbleRow) {
      var fromTrackTitle = mbz.fix_feat.splitArtists(
        currentBubbleRow.find('td.title input').val());
      if (fromTrackTitle.length > 1) { // first entry should be track title
        fromTrackTitle.shift();
        artistsSplitted = artistsSplitted.concat(fromTrackTitle);
      }
    }
    // attach all artist we gathered
    bubbleEditor.attachArtists(
      MBZ.BubbleEditor.TrackArtistCredits.removePresentArtists(artistsSplitted)
    );
  };

  function scanRow(row) {
    row = $(row);
    if (row.hasClass('track')) {
      var title = row.find('td.title input');
      if (mbz.fix_feat.hasSplitPoints(title.val())) {
        title.addClass('MBZ-FixFeat-MaySplit');
      } else {
        title.removeClass('MBZ-FixFeat-MaySplit');
      }
    }
  };

  function scanRows(tl, mutations) {
    if (mutations) {
      MBZ.Util.Mutations.forAddedTagName(mutations, 'tr', scanRow);
    }
  };
};

/**
  * Generic way to catch artist credit bubble editors.
  */
mbz.fix_feat.acBubble = {
  /**
    * Initialize the editor.
    * @strEl jQuery Element containing the artists name.
    */
  init: function(strEl) {
    if (strEl.length > 0 && mbz.fix_feat.hasSplitPoints(strEl.val())) {
      var bEdit = new mbz.fix_feat.BubbleEditor(MBZ.BubbleEditor.ArtistCredits);
      MBZ.BubbleEditor.ArtistCredits.onAppear({cb: bEdit.setBubble});
      var row = $(mbz.fix_feat.rowDiv);
      var btn = $(mbz.fix_feat.btn.trigger);
      btn.click(function(){
        btn.text('Rescan');
        var artists = mbz.fix_feat.splitArtists(strEl.val());
        if (artists.length > 0) {
          bEdit.attachArtists(
            MBZ.BubbleEditor.ArtistCredits.removePresentArtists(artists)
          );
        }
        return false;
      });
      row.append(btn);
      $('#open-ac').parent().after(row);
    }
  }
};

/**
  * Main initializer function.
  */
mbz.fix_feat.init = function() {
  mbz.fix_feat._init();
  var pageType = MBZ.Util.getMbzPageType();
  if (pageType.indexOf("artist") > -1) {
    if (pageType.indexOf("split") > -1) {
      mbz.fix_feat.acBubble.init($('#entity-artist'));
    } else {
      mbz.fix_feat.artistPage.init();
    }
  } else if (pageType.indexOf("recording") > -1) {
    mbz.fix_feat.acBubble.init($('#entity-artist'));
  } else if (pageType.indexOf("release") > -1) {
    // init observer, since component may need time to load
    var instance = new mbz.fix_feat.Release();
    MBZ.BubbleEditor.ArtistCredits.onAppear({cb: instance.init});
  } else if (pageType.indexOf("release-group") > -1) {
    mbz.fix_feat.acBubble.init($('#entity-artist'));
  }
};

mbz.fix_feat.init();

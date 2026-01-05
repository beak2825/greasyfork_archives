// ==UserScript==
// @name        MusicBrainz: Archive.org importer
// @namespace   http://www.jens-bertram.net/userscripts/import-internetarchive
// @description Import audio files and collections into Musicbrainz. Also supports scanning bookmarks and search results for MusicBrainz relations.
// @icon        http://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Internet_Archive_logo_and_wordmark.png/240px-Internet_Archive_logo_and_wordmark.png
// @supportURL  https://github.com/JensBee/userscripts
// @license     MIT
// @version     0.4.7beta
//
// @grant       none
// @require     https://code.jquery.com/jquery-2.1.1.min.js
// @require     https://greasyfork.org/scripts/5140-musicbrainz-function-library/code/MusicBrainz%20function%20library.js?version=21997
//
// @include     *://archive.org/details/*
// @include     *://archive.org/bookmarks.php
// @include     *//archive.org/search.php*
// @downloadURL https://update.greasyfork.org/scripts/5126/MusicBrainz%3A%20Archiveorg%20importer.user.js
// @updateURL https://update.greasyfork.org/scripts/5126/MusicBrainz%3A%20Archiveorg%20importer.meta.js
// ==/UserScript==
var mbz = mbz || {};
mbz.archive_org_importer = {
  // https://archive.org/about/faqs.php#Audio
  audioFormats: [
    'mp3',
    'flac',
    'ogg',
    'audio',
    'aiff',
    'shorten',
    'weba'],

  /**
    * Check file type for audio format. Filters out most (but not all) other
    * file types.
    * @formatStr file format name
    */
  isAudioFile: function(formatStr) {
    formatStr = formatStr.toLowerCase();
    for (var format in this.audioFormats) {
      if (formatStr.contains(format)) {
        return true;
      }
    }
    return false;
  }
};

/**
  * Functions to parse a list of links for MusicBrainz relations.
  */
mbz.archive_org_importer.linkCheck = {
  btn: MBZ.Html.getMbzButton('Check link relations',
    'Check entries being linked from MusicBrainz.'),

  /**
    * Link scanner status values
    */
  links: {
    found: null,
    checked: 0,
    matched: 0
  },

  /**
    * RexEx to strip off current base-url.
    */
  re: new RegExp('^'+window.location.origin),

  /**
    * Scan status elements.
    */
  status: {
    base: $('<span>'),
    current: $('<span>'),
    matched: $('<span>')
  },

  /**
    * Start scanner.
    * @params[links] jQuery object with target links
    * @params[controlEl] jQuery element to append controls to
    */
  scan: function(params) {
    this.links.found = params.links;

    if (this.links.found.length > 0 && params.controlEl) {
      var self = this;

      this.status.current.text(this.links.checked);
      this.status.matched.text(this.links.matched);
      this.status.base.append('&nbsp;Checked: ')
        .append(this.status.current)
        .append('&nbsp;Matches: ')
        .append(this.status.matched)
        .hide();

      this.btn.click(function () {
        self.btn.prop("disabled", true);
        self.btn.text("Checking..");
        self.status.base.show();
        var urls = [];
        $.each(self.links.found, function(idx, link) {
          urls.push('http://archive.org'+$(link).attr('href'));
        });
        MBZ.Release.getUrlRelations({
          urls: MBZ.Util.expandProtocols(urls),
          cb: self.rel.attach,
          cbInc: self.rel.inc,
          cbDone: self.rel.done,
          scope: self
        });
      });
      params.controlEl.append(this.btn).append(this.status.base);
    }
  },

  /**
    * Callback handlers for relation parsing.
    */
  rel: {
    /**
      * Relation was found, data is attached.
      */
    attach: function(data) {
      if (!data._res) {
        return;
      }
      var res = data._res.replace(this.re, '');
      var self = this;
      $.each(self.links.found, function(idx, link) {
        var link = $(link);
        if (link.attr('href') == res) {
          self.status.matched.text(self.links.matched++);
          MBZ.Release.insertMBLink(data, link);
        }
      });
    },

    /**
      * All relations have been resolved.
      */
    done: function() {
      this.status.base.html('&nbsp;' + this.links.checked
        + ' links checked with ' + this.links.matched + ' matches.');
      this.btn.text('Check done');
    },

    /**
      * A relation was checked.
      */
    inc: function() {
      this.status.current.text(this.links.checked++);
    },
  }
}

/**
  * Functions to import a single release.
  */
mbz.archive_org_importer.Release = function() {
  this.btn = MBZ.Html.getMbzButton('Import',
    'Import this release to MusicBrainz');
  this.dEl = $('<div id="mbzDialog">').hide(); // dialog elements
  this.mbLinkTarget = null;
  this.importRunning = false;
  this.importInitialized = false;
  // release data object finally passed on to MusicBrainz.
  this.release = new MBZ.Release();
  this.tracks = new mbz.archive_org_importer.Release.Tracks();
  var self = this;
  var submitted = false;

  /**
    * Initialize release parsing.
    */
  function init() {
    this.tracks.detectSources();

    var playerJSON = this.tracks.getPlayerJSON();
    if (playerJSON.length == 0) {
      console.error('Player JSON data not found. Disabling MusicBrainz import.');
      return;
    }

    var cEl = $('<div id="mbzControls">'); // control elements
    var url = MBZ.Util.rmTrSlash($(location).attr('href'));
    var urlJSON = url + '&output=json';
    var trackData = $.parseJSON(playerJSON);
    var pageJSON = null; // page data as JSON object

    this.btn.click(function () {
      if (submitted) {
        self.release.submitRelease();
        return;
      }

      if (!self.importInitialized) {
        self.btn.prop("disabled", true);
        self.btn.text("Initializing import");
        // prepare source data
        $.getJSON(urlJSON, function (data) {
          pageJSON = data;
          self.tracks.parseSources.call(self, data);
        }).fail(function(jqxhr, textStatus, error) {
          var err = textStatus + ', ' + error;
          console.error("Request (" + urlJSON + ") failed: " + err);
          self.btn.text("ERROR");
        });
        return;
      }

      self.dEl.hide();
      self.btn.prop("disabled", true);
      // *** static data
      self.release.addMedium({
        idx: 0,
        fmt: 'Digital Media'
      });
      self.release.setPackaging('none');
      self.release.setNote('Imported from The Internet Archive (' + url + ')');
      // *** parsed data from release JSON object
      self.parseJSON.urls(self.release, pageJSON);
      self.parseJSON.artists(self.release, pageJSON);
      self.parseJSON.title(self.release, pageJSON);
      self.parseJSON.labels(self.release, pageJSON);
      self.parseJSON.release(self.release, pageJSON);
      self.parseJSON.annotation(self.release, pageJSON);
      self.tracks.commit(self.release);
      // submit
      //self.release.dump();
      self.btn.text("Submitting..");
      self.release.submitRelease(function() {
        submitted = true;
        self.btn.prop("disabled", false);
        self.btn.text("Submit again");
      });
    });
    $('.breadcrumbs').before(cEl.append(this.btn));
    cEl.after(self.dEl);
    self.mbLinkTarget = self.btn;
    MBZ.Release.getUrlRelations({
      urls: MBZ.Util.expandProtocol(url),
      cb: MBZ.Release.insertMBLink,
      scope: self
    });
  };

  init.call(this);
};
mbz.archive_org_importer.Release.prototype = {
  /**
    * Callback function. Called when all sources are parsed.
    */
  enableImport: function() {
    this.importInitialized = true;

    if (this.tracks.validSources > 1) {
      this.tracks.showSources.call(this);
      this.btn.text("Start import");
      this.btn.prop("disabled", false);
    } else {
      this.btn.click();
    }
  }
};
/**
  * Parse JSON response for a release.
  */
mbz.archive_org_importer.Release.prototype.parseJSON = {
  annotation: function (release, data) {
    if (data.metadata.notes) {
      release.setAnnotation(data.metadata.notes[0]);
    }
  },
  artists: function (release, data) {
    if (data.metadata.creator) {
      $.each(data.metadata.creator, function (idx, val) {
        release.addArtist(val);
      });
    }
  },
  labels: function (release, data) {
    if (data.metadata.collection) {
      $.each(data.metadata.collection, function (idx, val) {
        release.addLabel({
          name: val,
          catNo: data.metadata.identifier[0]
        });
      });
    }
  },
  release: function (releaseObj, data) {
    var dates = data.metadata.date || data.metadata.publicdate;
    if (dates) {
      $.each(dates, function (idx, val) {
        var date = val.match(/([0-9]{4})-([0-9]{2})-([0-9]{2}).*/);
        if (date && date.length == 4) {
          releaseObj.addRelease({
            y: date[1],
            m: date[2],
            d: date[3],
            cc:'XW'
          });
        }
      });
    }
  },
  urls: function (release, data) {
    var url = $(location).attr('href');
    release.addUrl(url, '75');
    release.addUrl(url, '85');
    if (data.creativecommons && data.creativecommons.license_url) {
      release.addUrl(data.creativecommons.license_url, '301');
    }
  },
  title: function (release, data) {
    if (data.metadata.title) {
      release.setTitle(data.metadata.title[0]);
    }
  },
  /**
    * First parse track list from player JSON data. The provided information
    * may not be complete, so gather the parsed data in a local array.
    */
  tracksFromPlayer: function(data) {
    if (data.length > 0) {
      var self = this;
      $.each(data, function(idx, val) {
        var duration = MBZ.Util.hmsToSeconds(val.duration);
        duration = Math.round(parseFloat(duration) * 1000); // sec to msec
        if (isNaN(duration)) {
          duration = null;
        }
        // get source file name
        var file = val.sources[0].file;
        if (file) {
          self.tracks.updateData({
            med: 0,
            tit: val.title.replace(/^[0-9]+\.\s/,''),
            idx: idx,
            dur: duration,
            file: MBZ.Util.getLastPathSegment(file)
          });
        } else {
          console.log("Could not parse file name from player JSON.");
        }
      });
    }
  },
  tracksFromPage: function(data) {
    if (data && data.files) {
      var self = this;
      $.each(data.files, function(file, val){
        if (mbz.archive_org_importer.isAudioFile(val.format)) {
          var fileName = file.replace(/^\//, ''); // remove leading slash
          var duration = MBZ.Util.hmsToSeconds(val.duration);
          duration = Math.round(parseFloat(duration) * 1000); // sec to msec
          if (isNaN(duration)) {
            duration = null;
          }

          self.tracks.updateData({
            med: 0,
            tit: val.title,
            dur: duration,
            file: fileName
          });
        }
      });
    }
  }
};
/**
  * Handle track sources and the displaying of those data.
  */
mbz.archive_org_importer.Release.Tracks = function() {
  /**
    * Target element to display track source contents.
    */
  var contentHtml = $('<div>');
  /**
    * Store parsed track data objects to allow multiple data editing passes.
    */
  var tracks = {};
  /**
    * Track data sources available.
    */
  var sources = [];
  /**
    * Track source to use.
    */
  var selectedSource = null;
  /**
    * Number of unique valid sources.
    */
  var validSources = 0;

  /**
    * Add all available track sources to a user dialog.
    */
  function addSources(show) {
    var sourceSelect = $('<select>');

    sourceSelect.on('change', function(){
      selectedSource = this.value;
      showSources();
    });

    // add sources
    $.each(sources, function(idx, source) {
      if (!source.dupe && source.files && source.files.length > 0) {
        var sourceTitle = '';
        if (source.type == 'player') {
          sourceTitle = 'Web Player';
        } else {
          sourceTitle = 'Playlist (' + source.name + ')';
        }
        sourceSelect.append('<option value="' + idx + '">'
          + sourceTitle + '</option>');
      }
    });

    // add elements
    this.dEl.append(sourceSelect);
    sourceSelect.before('Found multiple track listings with different items.'
      + '<br/>Please select a track data source to import: ');
    this.dEl.append(contentHtml);
  };

  /**
    * Commit currently selected tracks source to be included in MusicBrainz
    * submission.
    */
  this.commit = function(release) {
    $.each(sources[selectedSource].files, function(idx, val) {
      tracks[val].idx = idx; // reset track number
      release.addTrack(tracks[val]);
    });
  };

  /**
    * Check which track sources are available. Called on page loading.
    */
  this.detectSources = function() {
    // internal player data
    var playerJSON = this.getPlayerJSON();
    if (playerJSON.length > 0) {
      sources.push({
        type: 'player',
        name: 'web-player',
        data: $.parseJSON(playerJSON)
      });
    }

    // playlists
    $('#ff0 a').each(function(idx, item){
      var url = $(item).attr('href');
      if (url.endsWith('.m3u')) {
        sources.push({
          type: 'playlist',
          name: MBZ.Util.getLastPathSegment(decodeURIComponent(url)),
          url: url
        });
      }
    });

    if (sources.length > 0) {
      // default to first entry
      selectedSource = 0;
    }
  };

  /**
    * Parse track data from all available sources. Called, when import is
    * initialized.
    * @pageData page data as JSON object
    */
  this.parseSources = function(pageData) {
    var self = this;
    var sourceParsedCount = 0;

    function incParsedCount() {
      // increase parsed sources counter
      if (++sourceParsedCount == sources.length) {
        squashSources.call(self);
        if (validSources > 1) {
          addSources.call(self);
        }
        // all data parsed, proceed with import
        self.enableImport();
      }
    }

    function getTrackList(source) {
      if (source.files && source.files.length > 0) {
        // looks like data is already set
        return;
      }
      source.files = [];
      if (source.type == 'player') {
        $.each(source.data, function(idx, val) {
          var file = val.sources[0].file;
          if (file) {
            source.files.push(MBZ.Util.getLastPathSegment(file));
          }
        });
        // done
        incParsedCount();
      } else if (source.type == 'playlist') {
        // needed, since we get redirected to differet subdomain
        var url = 'https://cors-anywhere.herokuapp.com/archive.org:443'
          + source.url;
        $.get(url, function(data) {
          //source.data = data;
          var files = data.split('\n');
          $.each(files, function(idx, file) {
            file = MBZ.Util.getLastPathSegment(file.trim());
            if (file.length > 0) {
              source.files.push(file);
            }
          });
        }, 'text').fail(function(jqxhr, textStatus, error) {
          var err = textStatus + ', ' + error;
          console.error("Request (" + url + ") failed: " + err);
        }).always(function() {
          // done
          incParsedCount();
        });
      }
    }

    // First try to parse data from the internal player as a basis. This data
    // may be incomplete (cropped track names) so add it first and overwrite it
    // later with more complete data from the page's JSON.
    $.each(sources, function(idx, val) {
      var source = sources[idx];
      if (source.type == 'player') {
        // parse some track data from the player
        self.parseJSON.tracksFromPlayer.call(self, source.data);
      }
    });

    // try to get missing data from page's JSON object
    if (pageData.files) {
      self.parseJSON.tracksFromPage.call(self, pageData);
    }

    // since track data is available, pase the track list for each source
    $.each(sources, function(idx, val) {
      getTrackList(val);
    });
  };

  /**
    * Initialize and show the source's track data dialog. Also called, to update
    * on track source data select change.
    */
  this.showSources = function() {
    var self = this;
    var trackTable = $('<table id="mbzImportTrackTable">'
      + '<thead>'
      + '<tr>'
      + '<td>#</td><td>Title</td><td>Length</td>'
      + '</tr></thead></table>');
    var trackList = $('<tbody>');

    $.each(sources[selectedSource].files,
        function(idx, val) {
      if (tracks[val]) {
        var duration = data[val].dur;
        duration = (duration ? MBZ.Util.msToHms(duration) : '&mdash;');
        trackList.append($('<tr>'
          + '<td>' + (idx + 1) + '</td>'
          + '<td>' + tracks[val].tit + '</td>'
          + '<td>' + duration + '</td>'
          + '</tr>'));
      } else {
        console.warn('No data for file "' + val + '" found.');
      }
    });

    trackTable.append(trackList);
    contentHtml.html(trackTable);
    this.dEl.show();
  };

  /**
    * Remove duplicated sources which have the same track lists.
    */
  function squashSources() {
    // go through all source's files
    for (var i=0; i<sources.length; i++) {
      var src = sources[i];
      if (!src.dupe) {
        var a = src.files;
        if (!a || a.length == 0) {
          src.dupe = true;
          console.warn("Remove source '" + src.name + "' no files found.");
        } else if ((i + 1) < sources.length) {
          for (var j=i + 1; j<sources.length; j++) {
            var b = sources[j];
            if (!b.dupe) {
              if (mbz.archive_org_importer.Release.Tracks
                  .compareSourceFiles(a, b.files)) {
                b.dupe = true;
              }
            }
          }
        }
      }
    }

    // count valid sources
    $.each(sources, function(idx, val) {
      if (!val.dupe && val.files.length > 0) {
        validSources++;
      }
    });
  };

  /**
    * Update track metadata with new values. If a value is already set, it will
    * get overwritten with the new one.
    */
  this.updateData = function(data) {
    var isValid = mbz.archive_org_importer.Release.Tracks.isValidTrackData;

    if (tracks[data.file]) {
      var tData = tracks[data.file];
      // update
      if (isValid(data.med)) {
        tData.med = data.med;
      }
      if (isValid(data.tit)) {
        tData.tit = data.tit.trim();
      }
      if (isValid(data.idx)) {
        tData.idx = data.idx;
      }
      if (isValid(data.dur)) {
        tData.dur = data.dur;
      }
    } else {
      // add new
      tracks[data.file] = data;
    }
  };
};
/**
  * Check if some track data is valid (i.e. not empty or undefined).
  */
mbz.archive_org_importer.Release.Tracks.isValidTrackData = function (dataEntry) {
  if (typeof dataEntry !== 'undefined' && dataEntry != null) {
    if (typeof dataEntry === 'string') {
      if (dataEntry.trim().length > 0) {
        return true;
      }
      return false;
    } else {
      return true;
    }
  }
  return false;
};
/**
  * Compare files for two sources.
  */
mbz.archive_org_importer.Release.Tracks.compareSourceFiles = function(a, b) {
  if (a.length != b.length) {
    return false;
  }

  for (var i=0; i<a.length; i++) {
    if (a[i] != b[i]) {
      return false;
    }
  }
  return true;
};
mbz.archive_org_importer.Release.Tracks.prototype = {
  /**
    * Get player JSON data as string.
    * @return player JSON data or empty string, if nothing was found
    */
  getPlayerJSON: function() {
    var pJSON = $('#midcol > script').text().trim()
      .match(/Play\([\s\S]*?(\[{[\s\S]*}\])/);
    if (pJSON && pJSON[1]) {
      return pJSON[1];
    }
    return "";
  }
};

mbz.archive_org_importer.init = function() {
  var pageType = window.location.pathname.split('/');
  if (pageType.length >= 2) {
    pageType = pageType[1].toLowerCase()
  } else {
    return;
  }

  if (pageType == 'details' && $('body').hasClass('Audio')) {
    // import a release
    MBZ.Html.globStyle.append(
      '#mbzImportTrackTable {margin-top:0.5em;margin-left:0.5em;}'
      + '#mbzImportTrackTable thead {'
        + 'font-weight:bold;'
        + 'background-color:rgba(115,108,174,0.5);'
      + '}'
      + '#mbzImportTrackTable tbody td:nth-child(1) {'
        + 'border-right:1px solid #666;'
        + 'padding-right:0.15em;'
      + '}'
      + '#mbzImportTrackTable tbody tr:nth-child(odd) {'
        + 'background-color:rgba(0,0,0,0.1);'
      + '}'
      + '#mbzImportTrackTable tbody td:nth-child(2) {'
        + 'padding-left:0.3em;'
      + '}'
      + '#mbzImportTrackTable tbody td:nth-child(3) {'
        + 'padding-left:0.3em;'
        + 'font-family:courier,monospace;'
        + 'text-align:right;'
      + '}'
    );
    //mbz.archive_org_importer.release.init();
    new mbz.archive_org_importer.Release();
  } else if (pageType == 'bookmarks.php') {
    // check all bookmarks for MusicBrainz relations
    var links = $('.box>table>tbody a').filter(function(idx) {
      // no way to check type for audio here
      return $(this).attr('href').startsWith('/details/');
    });
    var control = $('<div id="mbzControls">');
    $('.box>h1').after(control);
    if (links.length > 0) {
      mbz.archive_org_importer.linkCheck.scan({
        links: links,
        controlEl: control
      });
    }
  } else if (pageType == 'search.php') {
    var links = [];
    // check audio links for MusicBrainz relations
    var audioItems = $('.numberCell>img[alt="[audio]"]').filter(function(idx) {
      // get the first linked audio item..
      var el = $(this).parent().next().children('a')[0];
      if (el) {
        el = $(el);
        if (el.attr('href').startsWith('/details/')) {
          // ..and extract it's url
          links.push(el);
        }
      }
    });
    var control = $('<div>');
    var col = $('<td colspan="2">');
    col.append(control);
    var row = $('<tr>').append(col);
    $('.resultsTable').prepend(row);
    if (links.length > 0) {
      mbz.archive_org_importer.linkCheck.scan({
        links: links,
        controlEl: control
      });
    }
  }
};

mbz.archive_org_importer.init();

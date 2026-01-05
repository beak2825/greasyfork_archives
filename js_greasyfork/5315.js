// ==UserScript==
// @name        MusicBrainz: FreeMusicArchive.org importer
// @namespace   http://www.jens-bertram.net/userscripts/import-fma
// @description Import releases from Free Music Archive
// @supportURL  https://github.com/JensBee/userscripts
// @icon        http://blogfiles.wfmu.org/JI/FMAlogo_web_white.jpg
// @license     MIT
// @version     0.2.1beta
//
// @grant       none
// @require     https://greasyfork.org/scripts/5140-musicbrainz-function-library/code/MusicBrainz%20function%20library.js?version=21997
//
// @include     *://*.freemusicarchive.org/music/*
// @include     *://freemusicarchive.org/music/*
// @downloadURL https://update.greasyfork.org/scripts/5315/MusicBrainz%3A%20FreeMusicArchiveorg%20importer.user.js
// @updateURL https://update.greasyfork.org/scripts/5315/MusicBrainz%3A%20FreeMusicArchiveorg%20importer.meta.js
// ==/UserScript==
var mbz = mbz || {};
mbz.freemusicarchive_org_importer = {};

mbz.freemusicarchive_org_importer.Release = function() {
  var self = this;

  function init() {
    $.each($('.play-lrg-list'), function(idx, release) {
      release = $(release);
      if (release.find('.inp-embed-code').length > 0) {
        new mbz.freemusicarchive_org_importer.Release.Item(release);
      }
    });
  };

  init.call(this);
};
mbz.freemusicarchive_org_importer.Release.Item = function(container) {
  this.cnt = container;
  this.parseState = {
    hasError: false,
    license: false,
    page: false,
    xml: false
  };
  this.release;
  this.btn;
  this.submitted = false;

  function init() {
    this.addBtn();
  }

  init.call(this);
};
mbz.freemusicarchive_org_importer.Release.Item.prototype = {
  url: MBZ.Util.rmTrSlash($(location).attr('href')),

  addBtn: function() {
    var self = this;
    this.btn = MBZ.Html.getMbzButton('Import',
      'Import this release to MusicBrainz');
    this.btn.click(function() {
      if (self.submitted && self.release) {
        self.release.submitRelease();
        return;
      };
      self.importRelease.call(self);
    });
    this.getElement('.colr-sml-toppad').prepend(this.btn);
  },

  finishedParsing: function(what, success) {
    if (success) {
      switch (what) {
        case 'xml':
          this.parseState.xml = true;
          break;
        case 'page':
          this.parseState.page = true;
          break;
        case 'license':
          this.parseState.license = true;
          break;
      }

      // submit, if all items are parsed
      if (this.parseState.xml && this.parseState.page && this.parseState.license
          && !this.parseState.hasError) {
        this.release.submitRelease();
        this.submitted = true;
        this.btn.prop("disabled", false);
        this.btn.text("Submit again");
      }
    } else {
      this.parseState.hasError = true;
    }
  },

  importRelease: function() {
    var self = this;
    this.release = new MBZ.Release();
    this.btn.prop("disabled", true);
    this.btn.text("Import running..");

    // *** static data
    this.release.addMedium({
      idx: 0,
      fmt: 'Digital Media'
    });
    this.release.setPackaging('none');
    this.release.setNote('Imported from the Free Music Archive ('
      + this.url + ')');

    // *** parsed data from page content
    // release date
    var upDate = this.getElement('.sbar-stat.first-stat>b').text().split('/');
    if (upDate.length == 3) {
      this.release.addRelease({
        y: upDate[2],
        m: upDate[0],
        d: upDate[1],
        cc:'XW'
      });
    }

    // label(s)
    $.each($('.col-l'
      + ' div[class^="sbar-stat"]:not([class~="sbar-stat-btns"])'
      + ' a[href*="freemusicarchive.org/label/"]'),
        function(idx, el) {
      self.release.addLabel({
        name: $(el).text().trim()
      });
    });

    // links
    $.each($('.col-l'
      + ' div[class^="sbar-stat"]:not([class~="sbar-stat-btns"])'
      + ' a:not([href*="freemusicarchive.org/"])'),
        function(idx, el) {
      self.release.addUrl($(el).attr('href'));
    });

    // license (if single release page)
    var licenseUrl = $('div[class^="sbar-stat"] a[rel="license"]');
    if (licenseUrl.length > 0) {
      this.release.addUrl($(licenseUrl.get(0)).attr('href'), '301'); // license
      this.finishedParsing('license', true);
    } else {
      // load detail page to get license type
      var detailLink = $(this.getElement('.sbar-links a.lbut').get(0))
        .attr('href');
      $.ajax({
        url: detailLink,
        dataType: 'html',
        success: function(html) {
          var page = $.parseHTML(html);
          licenseUrl = $(page).find('.sbar-stat-multi a[rel="license"]');
          if (licenseUrl.length > 0) {
            self.release.addUrl($(licenseUrl.get(0)).attr('href'),
              '301'); // license
          }
          self.finishedParsing.call(self, 'license', true);
        },
        error: function(jqxhr, textStatus, error) {
          var err = textStatus + ', ' + error;
          console.error("Request (" + detailLink + ") failed: " + err);
          self.btn.text("ERROR");
          self.finishedParsing.call(self, 'license', false);
        }
      });
    }

    this.finishedParsing('page', true);

    // *** parsed data from release XML
    var xmlLinkCode = $.parseHTML(this.getElement('.inp-embed-code')
      .find('input').val());
    var xmlLink = $($(xmlLinkCode).find('param[name="flashvars"]').get(0))
      .attr('value').replace(/^playlist=/, '');

    $.ajax({
      url: xmlLink,
      dataType: 'xml',
      success: function(xml) {
        self.parseReleaseXML.call(self, xml);
        self.finishedParsing.call(self, 'xml', true);
      },
      error: function(jqxhr, textStatus, error) {
        var err = textStatus + ', ' + error;
        console.error("Request (" + xmlLink + ") failed: " + err);
        self.btn.text("ERROR");
        self.finishedParsing.call(self, 'xml', false);
      }
    });
  },

  getElement: function(selector) {
    var el = this.cnt.find(selector);
    if (el.length > 1) {
      return $(el.get(0));
    }
    return el;
  },

  getElements: function(selector) {
    return this.cnt.find(selector);
  },

  parseReleaseXML: function(xml) {
    var self = this;
    xml = $(xml);

    // meta
    this.release.addArtist(xml.find('playlist>author').text().trim());
    this.release.setTitle(xml.find('playlist>title').text().trim());

    // links
    var audioUrl = xml.find('playlist>download').text().trim();
    this.release.addUrl(audioUrl, '75'); // download for free
    this.release.addUrl(audioUrl, '85'); // stream for free

    this.release.addUrl($(xml.find('playlist>title').get(0)).attr('href'),
      '288'); // discography entry

    // tracks
    $.each(xml.find('playlist>tracks>track'), function(idx, el) {
      var trackData = $(el);
      var tLength = $(trackData.find('stream').get(0)).attr('length');
      if (tLength) {
        tLength = Math.round(parseFloat(tLength) * 1000); // sec to msec
      }
      var artists = [];
      $.each(trackData.find('artist'), function(idx, el) {
        artists.push({
          name: $(el).text().trim()
        });
      });

      self.release.addTrack({
        med: 0,
        tit: trackData.find('name').text().trim(),
        idx: idx,
        dur: tLength,
        artists: artists
      });
    });
  },
};

mbz.freemusicarchive_org_importer.init = function() {
  var pageType = window.location.pathname.split('/');
  if (pageType.length >= 2) {
    pageType = pageType[1].toLowerCase()
  } else {
    return;
  }

  MBZ.Html.globStyle.append('button.mbzButton{margin-bottom:0.5em;}');

  if (pageType == "music") {
    new mbz.freemusicarchive_org_importer.Release();
  }
};

mbz.freemusicarchive_org_importer.init();

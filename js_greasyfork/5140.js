// ==UserScript==
// @name        MusicBrainz function library
// @namespace   http://www.jens-bertram.net/userscripts/mbz-lib
// @description Musicbrainz function library. Requires jQuery to run.
// @supportURL  https://github.com/JensBee/userscripts
// @icon        https://wiki.musicbrainz.org/-/images/3/39/MusicBrainz_Logo_Square_Transparent.png
// @license     MIT
// @version     0.4beta
//
// @grant       none
// ==/UserScript==
// Function library to work with MusicBrainz pages.
// Please beware that this library is not meant for public use. It may change
// between versions in any incompatible way. If you make use of this library you
// may want to fork it or use a service like greasyfork which is able to point
// to a specific version of this library.
MBZ = null;

/**
  * Event callback for re-using library.
  *	@lib Library passed in from callback.
  */
var loader = function(lib) {
  MBZ = lib;
};

/**
  * Library specification for re-using.
  */
var thisScript = {
  id: 'mbz-lib',
  version: '0.4beta',
  loader: loader
};

// trigger load event
$(window).trigger('MBZLoadingLibrary', thisScript);

// reuse existing library, if already set by callback
if (MBZ) {
  console.log("Reusing library", MBZ);
} else {
  // we have to wrap this in the else statement, because GreasyMonkey does not
  // like a return statement in top-level code

  MBZ = {
    baseUrl: 'https://musicbrainz.org/',
    impl: {} // concrete implementations, unloaded after initialization
  };
  MBZ.iconUrl = MBZ.baseUrl + 'favicon.ico',

  MBZ.impl.Html = function() {
    this.globStyle = null;

    /**
      * Add CSS entry to pages <head/>.
      * @param style definition to add
      */
    function init() {
      if ($('head').length == 0) {
        $('body').append($('<head>'));
      }
      this.globStyle = $('head>style');
      if (this.globStyle.length == 0) {
        this.globStyle = $('<style>');
        this.globStyle.attr('type', 'text/css');
        $('head').append(this.globStyle);
      }
      this.globStyle.append(''
        + 'button.mbzButton{'
          + 'cursor:pointer;'
          + 'text-decoration:none;'
          + 'text-shadow:-1px -1px 0 rgba(255,201,97,0.3);'
          + 'font-weight:bold;'
          + 'color:#000;'
          + 'padding:5px 5px 5px 25px;'
          + 'border-radius:5px;'
          + 'border-top:1px solid #736CAE;'
          + 'border-left:1px solid #736CAE;'
          + 'border-bottom:1px solid #FFC961;'
          + 'border-right:1px solid #FFC961;'
          + 'background:#FFE3B0 url("' + MBZ.iconUrl + '") no-repeat 5px center;'
        + '}'
        + 'button.mbzButton:hover{'
          + 'border:1px solid #454074;'
          + 'background-color:#FFD88C;'
        + '}'
        + 'button.mbzButton:disabled{'
          + 'cursor:default;'
          + 'border:1px solid #ccc;'
          + 'background-color:#ccc;'
          + 'color:#5a5a5a;'
        + '}'
        + 'div#mbzDialog{'
          + 'margin:0.5em 0.5em 0.5em 0;'
          + 'padding:0.5em;'
          + 'background-color:#FFE3B0;'
          + 'border-top:1px solid #736CAE;'
          + 'border-left:1px solid #736CAE;'
          + 'border-bottom:1px solid #FFC961;'
          + 'border-right:1px solid #FFC961;'
        + '}'
      );
    };

    /**
      * Add some CSS to the global page style.
      * @style CSS to add
      */
    this.addStyle = function(style) {
      this.globStyle.append(style);
    };

    // constructor
    init.call(this);
  };
  MBZ.impl.Html.prototype = {
    mbzIcon: '<img src="' + MBZ.iconUrl + '" />',

    /**
      * Create a MusicBrainz link.
      * @params[type] type to link to (e.g. release)
      * @params[id] mbid to link to (optional)
      * @params[more] stuff to add after mbid + '/' (optional)
      * @return plain link text
      */
    getLink: function (params) {
      return MBZ.baseUrl + params.type + '/'
        + (params.id ? params.id + '/' : '') + (params.more || '');
    },

    /**
      * Create a MusicBrainz link.
      * @params[type] type to link to (e.g. release)
      * @params[id] mbid to link to (optional)
      * @params[more] stuff to add after mbid + '/' (optional)
      * @params[title] link title attribute (optional)
      * @params[text] link text (optional)
      * @params[before] stuff to put before link (optional)
      * @params[after] stuff to put after link (optional)
      * @params[icon] true/false: include MusicBrainz icon (optional,
      *		default: true)
      * @return link jQuery object
      */
    getLinkElement: function (params) {
      params.icon = (typeof params.icon !== 'undefined'
        && params.icon == false ? false : true);
      var retEl = $('<div style="display:inline-block;">');
      if (params.before) {
        retEl.append(params.before);
      }
      var linkEl = $('<a>' + (params.icon ? this.mbzIcon : '')
        + (params.text || '') + '</a>');
      linkEl.attr('href', this.getLink({
        type: params.type,
        id: params.id,
        more: params.more
      })).attr('target', '_blank');
      if (params.title) {
        linkEl.attr('title', params.title);
      }
      retEl.append(linkEl);
      if (params.after) {
        retEl.append(params.after);
      }
      return retEl;
    },

    getMbzButton: function(caption, title) {
      var btn = $('<button type="button" class="mbzButton">' + caption
        + '</button>');
      if (title) {
        btn.attr('title', title);
      }
      return btn;
    }
  };

  /**
    * Utility functions.
    */
  MBZ.impl.Util = function() {};
  MBZ.impl.Util.prototype = {
    /**
     * Convert anything to string.
     * @data object
     */
    asString: function (data) {
      if (data == null) {
        return '';
      }
      switch (typeof data) {
        case 'string':
          return data.trim();
        case 'object':
          return data.toString().trim();
        case 'function':
          return 'function';
        case 'undefined':
          return '';
        default:
          data = data + '';
          return data.trim();
      }
    },

    /**
      * Creates http + https url from a given https? url.
      * @url http/https url
      * @return array with given url prefixed with http + https or single url,
      * if not https? protocol
      */
    expandProtocol: function(url) {
      var urls;
      if (url.toLowerCase().startsWith('http')) {
        var urlPath = url.replace(/^https?:\/\//,'');
        urls = ['http://' + urlPath, 'https://' + urlPath];
      } else {
        urls = [url];
      }
      return urls;
    },

    /**
     * Creates http + https urls from a given array of https? urls.
     * @urls array of http/https urls
     * @return array with given urls prefixed with http + https
     */
    expandProtocols: function(urls) {
      var newUrls = [];
      var self = this;
      $.each(urls, function(idx, val){
        newUrls = newUrls.concat(self.expandProtocol(val));
      });
      return newUrls;
    },

    /**
      * Get the last path segment from a URL.
      */
    getLastPathSegment: function(str) {
      if (!str || typeof str !== 'string' || str.indexOf('/') == -1) {
        return str;
      }
      var seg = str.split('/');
      return seg[seg.length -1];
    },

    /**
      * Detect the MusicBrainz page we're on.
      */
    getMbzPageType: function() {
      var type = [];
      if (this.isMbzPage()) {
        var path = window.location.pathname;
        if (path.contains("/artist/")) {
          type.push("artist");
        } else if (path.contains("/recording/")) {
          type.push("recording");
        } else if (path.contains("/release/")) {
          type.push("release");
        } else if (path.contains('/release-group/')) {
          type.push("release-group");
        }
        var lps = this.getLastPathSegment(path);
        // exclude id strings
        if (!lps.match(/^[0-9a-f]+-[0-9a-f]+-[0-9a-f]+-[0-9a-f]+-[0-9a-f]+$/)) {
          type.push(lps);
        }
      }
      return type;
    },

    /**
     * Convert HH:MM:SS, MM:SS, SS to seconds.
     * http://stackoverflow.com/a/9640417
     * @str string
     * @return seconds extracted from initial string
     */
    hmsToSeconds: function (str) {
      str = MBZ.Util.asString(str);
      if (str.indexOf(':') > -1) {
        var p = str.split(':'), s = 0, m = 1;

        while (p.length > 0) {
            s += m * parseInt(p.pop(), 10);
            m *= 60;
        }

        return s;
      } else {
        return str;
      }
    },

    /**
      * Check, if we're on a musicbrainz page.
      * @return true if so
      */
    isMbzPage: function() {
      if (window.location.hostname.contains('musicbrainz.org')
          || window.location.hostname.contains('mbsandbox.org')) {
        return true;
      }
      return false;
    },

    /**
      * Convert milliseconds to HH:MM:SS.ss string.
      * https://coderwall.com/p/wkdefg
      */
    msToHms: function (ms) {
      str = this.asString(ms);
      if (str.match(/^[0-9]+$/)) {
        var milliseconds = parseInt((ms % 1000) / 100)
            , seconds = parseInt((ms / 1000) % 60)
            , minutes = parseInt((ms / (1000 * 60)) % 60)
            , hours = parseInt((ms / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return (hours && hours != '00' ? (hours + ":") : '') + minutes + ":"
          + seconds + (milliseconds ? ("." + milliseconds) : '');
      } else {
        return ms;
      }
    },

    /**
     * Remove a trailing slash from a string
     * @str string
     * @return intial string with trailing slash removed
     */
    rmTrSlash: function (str) {
      if(str.substr(-1) == '/') {
          return str.substr(0, str.length - 1);
      }
      return str;
    }
  };

  /**
    * Util functions to work with results from MutationObservers.
    */
  MBZ.impl.Util.Mutations = function() {};
  MBZ.impl.Util.Mutations.prototype = {
    /**
      * Checks mutation records if an element with a given tagName was added.
      * If callback function returns true, no further elements will be checked.
      * @mutationRecords mutation records passed by an observer
      * @tName tagname to check for (case is ignored)
      * @cb callback function
      * @scope optionl scope for callback
      * @return if callback returned true, false otherwise
      */
    forAddedTagName: function(mutationRecords, tName, cb, scope) {
      if (!mutationRecords || !cb || !tName || tName.trim().length == 0) {
        return false;
      }
      tName = tName.toLowerCase();
      return mutationRecords.some(function(mutationRecord){
        for (let node of mutationRecord.addedNodes) {
          if (node.tagName && node.tagName.toLowerCase() == tName) {
            var ret;
            if (scope) {
              ret = cb.call(scope, node);
            } else {
              ret = cb(node);
            }
            if (ret == true) {
              return ret;
            }
          }
        };
      });
    }
  };

  /**
    * Shared bubble editor functions.
    */
  MBZ.impl.BubbleEditor = function() {};
  MBZ.impl.BubbleEditor.prototype = {
    /**
      * Add an artist credit.
      * Must be called in scope.
      * @bubble bubble element
      *	@data String or array with 1-3 elements. [mb-artist name, artist as
      *	credited, join phrase]
      * @noAc if true, displaying the autocomplete popup will be disabled
      */
    addArtist: function(data, noAc) {
      if (typeof data === 'string') {
        data = [data];
      }
      if (data && data.length > 0) {
        var rows = this.getCreditRows();
        if (rows.length > 0) {
          var targets = this.getCreditInputs(rows.get(rows.length -1));
          // check, if row is all empty..
          if (targets[0].val() != '' || targets[1].val() != ''
              || targets[2].val() != '') {
            // ..if not, add one row and re-set target
            if (targets[2].val().trim() == '') {
              // at least in track bubble adding a new artist is not possible
              // without a join-phrase - so add one
              targets[2].val(" & ");
              targets[2].trigger('change');
            }
            $(this.getBubble().find('.add-item').get(0)).click();
            rows = this.getCreditRows();
            targets = this.getCreditInputs(rows.get(rows.length -1));
          }
          if (noAc) {
            targets[0].autocomplete({disabled: true});
          }

          targets[0].val(data[0]);

          if (data.length > 1) {
            targets[1].val(data[1]);
          } else {
            targets[1].val(data[0]);
          }
          if (data.length > 2) {
            targets[2].val(data[2]);
          }
          targets[0].trigger('input');

          if (noAc) {
            targets[0].autocomplete({disabled: false});
          }
        }
      }
    },

    /**
      * Get all mb-artist credits currently listed in the bubble editor.
      * Must be called in scope.
      * @return array with artist names
      */
    getArtistCredits: function() {
      var rows = this.getCreditRows();
      var artists = [];

      if (rows.length > 0) {
        var self = this;

        $.each(rows, function() {
          var row = $(this);
          var inputs = self.getCreditInputs(row);
          if (inputs[0]) {
            artists.push(inputs[0].val());
          }
        });
      }

      return artists;
    },

    /**
      * See Observer.addAppearCb.
      */
    onAppear: function(params) {
      return this._bubble.observer.addAppearCb(params);
    },

    /**
      * See Observer.addChangedCb.
      */
    onContentChange: function(params) {
      return this._bubble.observer.addChangedCb(params);
    },

    /**
      * Remove a complete artist credit by it's row.
      * @row artists data row
      */
    removeArtist: function(row) {
      if (row) {
        // may be <button/> or <input/> - so check attribute only
        $(row).find('.remove-artist-credit').click();
      }
    },

    /**
      * Get a new array with artists removed already present in bubble editor.
      * Checks are done against the mb artist name. Check is done by using
      * all lower case letters.
      * Must be called in scope.
      * @artists Array of artist names
      */
    removePresentArtists: function(artists) {
      var rows = this.getCreditRows();
      var newArtists = [];

      var presentArtists = this.getArtistCredits();

      if (rows.length > 0) {
        var presentArtists = [];
        var self = this;

        $.each(rows, function() {
          var row = $(this);
          var inputs = self.getCreditInputs(row);
          if (inputs[0]) {
            presentArtists.push(inputs[0].val().toLowerCase());
          }
        });

        // sort out new ones
        for (let artist of artists) {
          if (presentArtists.indexOf(artist.toLowerCase()) == -1) {
            newArtists.push(artist);
          }
        }
      }

      return newArtists;
    },

    /**
      * Tries to open the bubble by clicking the given handler.
      * @bubble bubble element
      * @handler handler to click
      */
    tryOpen: function(handler) {
      var bubble = this.getBubble();
      if (bubble && !bubble.is(':visible')) {
        handler.click();
      }
    },

    /**
      * Bubble observer class.
      * @instance Bubble class instance.
      * @ids[bubble] Id of bubble element
      * @ids[container] For two-stage loading: container that will contain the
      * bubble (optional)
      */
    Observer: function(instance) {
      var observer = null;
      var disconnected = false;
      var onAppearCb = [];
      var onChangeCb = [];
      var that = instance;
      var noBubble = false;

      function mutated(mutationRecords) {
        if (that._bubble.el) {
          // remove observer, if noone is listening
          if (onChangeCb.length == 0) {
            console.debug("Remove bubble observer - noone listening.");
            observer.disconnect();
            disconnected = true;
          } else {
            for (let cbParams of onChangeCb) {
              cbParams.cb(that._bubble.el, mutationRecords);
            }
          }
        } else {
          var bubble = $(that._bubble.id);
          if (bubble && bubble.length ==1) {
            that._bubble.el = bubble;
            hasAppeared();
          }
        }
      };

      function hasAppeared() {
        // call onAppear callbacks
        while (onAppearCb.length > 0) {
          onAppearCb.pop().cb(that._bubble.el);
        }
        // check if someone is listening for changes
        if (onChangeCb.length == 0) {
          if (observer) {
            console.debug("Remove bubble observer - noone listening.");
            observer.disconnect();
            disconnected = true;
          } else {
            console.debug("Not attaching bubble observer - noone listening.");
          }
        }
      };

      function init() {
        var bubble = $(that._bubble.id);
        var e;
        if (bubble && bubble.length ==1) {
          that._bubble.el = bubble;
          e = bubble.get(0);
          hasAppeared();
        }

        if (!e) {
          console.debug(that.type,
            "Bubble not found. Giving up.");
          noBubble = true;
        } else {
          observer = new MutationObserver(mutated);
          observer.observe(e, {
            childList: true,
            subtree: true
          });
        }
      };

      function reAttach() {
        if (disconnected) {
          console.debug("Re-attach bubble observer - new listener.");
          observer.observe(that._bubble.el.get(0), {
            childList: true,
            subtree: true
          });
        }
      };

      /**
        * Add a listener to listen to appearance of the bubble. Callback is
        * called directly, if bubble is already present.
        * @cb[cb] callcack function
        * @return true, if added or called immediately, false, if there's no
        * bubble to attach to
        */
      this.addAppearCb = function(cb) {
        if (noBubble) {
          console.debug("Not attaching to event. No bubble.");
          return false;
        }
        if (that._bubble.el) {
          // direct call, bubble already there
          cb.cb(that._bubble.el);
        } else {
          // add to stack
          onAppearCb.push(cb);
        }
        return true;
      };

      /**
        * Add a listener to listen to changes to the bubble.
        * @cb[cb] callcack function
        * @return true, if added, false, if there's no bubble to attach to
        */
      this.addChangedCb = function(cb) {
        if (noBubble) {
          console.debug("Not attaching to event. No bubble.");
          return false;
        }
        reAttach();
        onChangeCb.push(cb);
        return false;
      };

      // constructor
      init.call(this);
    }
  };

  /**
    * Bubble editors base class.
    */
  MBZ.BubbleEditor = {
    /**
    * Differenciate types of bubble editors.
    */
    types: {
      artistCredits: 'ArtistCreditBubble',
      trackArtistCredits: 'TrackArtistCreditBubble'
    }
  };

  /**
    * Artists credits bubble.
    */
  MBZ.BubbleEditor.ArtistCredits = function() {
    this.type = MBZ.BubbleEditor.types.artistCredits;
    this._bubble = {
      el: null,
      id: '#artist-credit-bubble',
      observer: null
    };

    /**
      * Get the bubble element.
      */
    this.getBubble = function() {
      return this._bubble.el;
    };

    /**
      * Extract the inputs for mb-artist, credited-artist and join-phrase from a
      *	single data row.
      *	@row data row
      * @return array with input elements for mb-artist, credited-artist and
      * join-phrase from a single data row.
      */
    this.getCreditInputs = function(row) {
      if (!row || (row.length && row.length == 0)) {
        console.debug("Empty row.");
        return [];
      }
      row = $(row);

      var rowData = [];
      var el = row.find('input[type="text"]'); // mb-artist

      if (el.length == 1) {
        rowData.push(el);
        el = row.next().find('input[type="text"]'); // artist as credited
        if (el.length == 1) {
          rowData.push(el);
          el = row.next().next().find('input[type="text"]'); // join phrase
          if (el.length == 1) {
            rowData.push(el);
            return rowData;
          }
        }
      }
      return [];
    };

    /**
      * Get the rows containing inputs for mb-artist, credited-artist and
      * join-phrase from the bubble.
      *	@return jQuery object containing each data row. This is for each entry
      * the first row containing the mb-artist name.
      */
    this.getCreditRows = function() {
      if (this._bubble.el) {
        return this._bubble.el.find('tr:has(input.name)');
      } else {
        console.debug("No rows found. Bubble not present.");
        return $();
      }
    };

    /**
      * Called when bubble has appeared to call the real observer.
      */
    function attachObserver() {
      this._bubble.observer = new this.Observer(this);
    }

    // wait until bubble container appears
    MBZ.ReleaseEditor.onAppear({
      cb: attachObserver,
      scope: this,
      selector: this._bubble.id
    });
  };

  /**
    * Track artists credits bubble.
    */
  MBZ.BubbleEditor.TrackArtistCredits = function() {
    this.type = MBZ.BubbleEditor.types.trackArtistCredits;
    this._bubble = {
      el: null,
      id: '#track-ac-bubble',
      observer: null
    };

    /**
      * Get the bubble element.
      */
    this.getBubble = function() {
      return this._bubble.el;
    };

    /**
      * Get the rows containing inputs for mb-artist, credited-artist and
      * join-phrase from the bubble.
      *	@return jQuery object containing each data row
      */
    this.getCreditRows = function() {
      if (this._bubble.el) {
        return this._bubble.el.find('tr:has(td span.artist)');
      } else {
        console.debg("No rows found. Bubble not present.");
        return $();
      }
    };

    /**
      * Extract the inputs for mb-artist, credited-artist and join-phrase from a
      *	single data row.
      *	@row data row
      * @return array with input elements for mb-artist, credited-artist and
      * join-phrase from a single data row.
      */
    this.getCreditInputs = function(row) {
      if (!row) {
        console.debug("Empty row.");
        return [];
      }

      var inputs = $(row).find('td input[type="text"]');
      if (inputs.length == 3) {
        return [
          $(inputs.get(0)), // mb-artist
          $(inputs.get(1)), // artist as credited
          $(inputs.get(2)) // join-phrase
        ];
      } else {
        return [];
      }
    };

    this._bubble.observer = new this.Observer(this);
  };

  MBZ.impl.ReleaseEditor = function() {
    var observer = new MutationObserver(mutated);
    var e = $('#release-editor');
    var onAppearCb = [];
    var observing = false;

    function checkExistance(cbConf) {
      var result = e.find(cbConf.selector);
      if (result.length > 0) {
        if (cbConf.scope) {
          cbConf.cb.call(cbConf.scope, result);
        } else {
          cbConf.cb(result);
        }
        return true;
      }
      return false;
    };

    function checkObserver() {
      if (onAppearCb.length > 0) {
        if (!observing) {
          observer.observe(e.get(0), {
            childList: true,
            subtree: true
          });
          observing = true;
          console.debug("Attach ReleaseEditor observer - new listener.");
        }
      } else if (observing) {
          observer.disconnect();
          observing = false;
          console.debug("Remove ReleaseEditor observer - noone listening.");
      }
    };

    function mutated(mutationRecords) {
      var surviving = [];
      for (var cbConf of onAppearCb) {
        if (!checkExistance(cbConf)) {
          surviving.push(cbConf);
        }
      }
      onAppearCb = surviving;
      checkObserver();
    };

    /**
      * cbConf[selector] element selector to search for
      * cbConf[cb] callback function
      * cbConf[scope] optional scope for callback
      */
    this.onAppear = function(cbConf) {
      if (!checkExistance(cbConf)) {
        checkObserver();
        onAppearCb.push(cbConf);
      }
    };
  };

  /**
    * Release tracklist.
    */
  MBZ.impl.TrackList = function() {
    var observer;
    var id = '#tracklist';

    var Observer = function() {
      var observer;
      var onChangeCb = [];

      function attach() {
        console.debug("Creating tracklist observer - new listener.");
        observer = new MutationObserver(mutated);
        observer.observe($(id).get(0), {
          childList: true,
          subtree: true
        });
      };

      function mutated(mutationRecords) {
        var element = $(id);
        for (cb of onChangeCb) {
          cb.cb(element, mutationRecords);
        }
      };

      /**
        * Add a listener to listen to changes to the bubble.
        * @cb[cb] callcack function
        */
      this.addChangedCb = function(cb) {
        if (!observer) {
          attach();
        }
        onChangeCb.push(cb);
      };
    };

    this.getList = function() {
      return $(id);
    };

    this.onContentChange = function(params) {
      if (!observer) {
        console.debug("Not attaching to event. No tracklist.");
        return false;
      }
      return observer.addChangedCb(params);
    };

    if ($(id).length == 1) {
      observer = new Observer();
    }
  };

  /**
    * Cover art archive.
    */
  MBZ.impl.CA = function() {};
  MBZ.impl.CA.prototype = {
    baseUrl: 'https://coverartarchive.org/',
    originBaseUrl: 'https://cors-anywhere.herokuapp.com/coverartarchive.org:443/',

    /**
      * Create a CoverArtArchive link.
      * @params[type] type to link to (e.g. release)
      * @params[id] mbid to link to (optional)
      * @params[more] stuff to add after mbid (optional)
      */
    getLink: function (params) {
      return this.originBaseUrl + params.type + '/'
        + (params.id ? params.id + '/' : '') + (params.more || '');
    }
  };

  /**
   * MusicBrainz web service v2 interface.
   */
  MBZ.impl.WS = function() {};
  MBZ.impl.WS.prototype = {
    _baseUrl: MBZ.baseUrl + 'ws/2/',
    _queue: [],
    _pollFreq: 1100,
    _pollInterval: null,

    /**
     * Add to request queue.
     * @params[cb] callback
     * @params[url] request url
     * @params[args] callback function parameters object
     * @params[scope] scope for calling callback function
     */
    _qAdd: function(params) {
      this._queue.push(params);
      if (!this._pollInterval) {
        if (this._queue.length == 1) {
          this._qPoll();
        }
        this._pollInterval = setInterval(this._qPoll, this._pollFreq);
      }
    },

    /**
     * Execute queued requests.
     */
    _qPoll: function() {
      if (MBZ.WS._queue.length > 0) {
        var item = MBZ.WS._queue.pop();
        $.getJSON(item.url, function(data) {
          if (item.args) {
            if (item.scope) {
              item.cb.call(item.scope, data, item.args);
            } else {
              item.cb(data, item.args);
            }
          } else {
            if (item.scope) {
              item.cb.call(item.scope, data);
            } else {
              item.cb(data);
            }
          }
        }).fail(function(jqxhr, textStatus, error) {
          var err = textStatus + ', ' + error;
          console.error("Request (" + item.url + ") failed: " + err);
          if (item.scope) {
            item.cb.call(item.scope);
          } else {
            item.cb();
          }
        });
      } else if (MBZ.WS._queue.length == 0 && MBZ.WS._pollInterval) {
        clearInterval(MBZ.WS._pollInterval);
      }
    },

    /**
      * Lookup a musicbrainz url relation
      * @params[cb] callback function
      * @params[res] url to lookup
      * @params[rel] relation type
      * @params[scope] scope for callback function
      */
    getUrlRelation: function (params) {
      this._qAdd({
        cb: params.cb,
        url: this._baseUrl + 'url?resource=' + encodeURIComponent(params.res)
          + '&inc=' + params.rel + '-rels',
        scope: params.scope
      });
    },

    /**
      * Lookup musicbrainz url relations
      * @params[urls] array of urls to lookup
      * @params[rel] relation type
      * @params[cb] callback function for each response
      * @params[cbInc] callback for each item looked up
      * @params[cbDone] callback to call if all items have been looked up
      * @params[scope] scope for callback functions
      */
    getUrlRelations: function(params) {
      var self = this;
      var count = params.urls.length;
      var current = 0;
      function localCb(data) {
        if (params.scope) {
          params.cb.call(params.scope, data);
        } else {
          params.cb(data);
        }
        if (typeof params.cbInc === 'function') {
          if (params.scope) {
            params.cbInc.call(params.scope);
          } else {
            params.cbInc();
          }
        }
        if (++current == count && typeof params.cbDone === 'function') {
          if (params.scope) {
            params.cbDone.call(params.scope);
          } else {
            params.cbDone();
          }
        }
      }
      $.each(params.urls, function(idx, val) {
        self.getUrlRelation({
          cb: localCb,
          res: val,
          rel: params.rel
        });
      });
    }
  };

  /**
    * Library initialization.
    */
  function init() {
    // base
    console.debug("Loading MBZ base classes");
    MBZ.Html = new MBZ.impl.Html();
    MBZ.Util = new MBZ.impl.Util();
    MBZ.Util.Mutations = new MBZ.impl.Util.Mutations();
    MBZ.CA = new MBZ.impl.CA();
    MBZ.WS = new MBZ.impl.WS();

    // initialize the following only on MusicBrainz pages
    var pageType = MBZ.Util.getMbzPageType();
    if (pageType.length > 0) {
      // release editor
      if (pageType.indexOf("release") > -1 || pageType.indexOf("edit") > -1) {
        console.debug("Loading MBZ.ReleaseEditor");
        MBZ.ReleaseEditor = new MBZ.impl.ReleaseEditor();
      }

      // bubble editors
      if (pageType.indexOf("edit") > -1 || pageType.indexOf("add") > -1) {
        // track editor only, if we edit releases
        if (pageType.indexOf("release") > -1) {
          console.debug("Loading MBZ.BubbleEditor.TrackArtistCredits");
          MBZ.BubbleEditor.TrackArtistCredits.prototype =
            new MBZ.impl.BubbleEditor();
          MBZ.BubbleEditor.TrackArtistCredits =
            new MBZ.BubbleEditor.TrackArtistCredits();
        }

        // artist editor on artist edit or release types
        if (pageType.indexOf("artist") > -1
            || pageType.indexOf("release") > -1
            || pageType.indexOf("release-group") > -1) {
          console.debug("Loading MBZ.BubbleEditor.ArtistCredits");
          MBZ.BubbleEditor.ArtistCredits.prototype =
              new MBZ.impl.BubbleEditor();
          MBZ.BubbleEditor.ArtistCredits = new MBZ.BubbleEditor.ArtistCredits();
        }
      }

      // tracklist is only available on release pages
      if (pageType.indexOf("release") > -1) {
        console.debug("Loading MBZ.TrackList");
        MBZ.TrackList = new MBZ.impl.TrackList();
      }
    }

    // release MBZ.impl.* classes to garbage collection
    console.debug("Unloading MBZ.impl.*");
    delete MBZ.impl;
  }
  init();

  // Library initialization finished.
  // ============================== On demand classes - created by users =======

  /**
   * Release related functions.
   */
  MBZ.Release = function() {
    var form = $('<form method="post" id="' + MBZ.Release._form.baseName + '-'
      + (MBZ.Release._form.count++) + '" target="_blank" action="'
      + MBZ.Release._form.target + '" acceptCharset="UTF-8"></form>');
    var submitted = false;

    this.data = {
      annotation: '', // content
      artists: [],
      labels: [],
      mediums: [],
      note: '', // content
      packaging: '', // type
      releases: [],
      title: '', // content
      tracks: [],
      urls: [] // [target, type]
    };

    function addField(name, value) {
      name = MBZ.Util.asString(name);
      value = MBZ.Util.asString(value);
      if (name.length > 0 && value.length > 0) {
        form.append($('<input type="hidden" name="' + name + '" value="' + value
          .replace(/&/g, '&amp;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
        + '"/>'));
      }
    }

    function buildForm(dataSet) {
      if (dataSet.annotation != '') {
        addField('annotation', dataSet.annotation);
      }

      if (dataSet.artists.length > 0) {
        $.each(dataSet.artists, function(idx, val) {
          var prefix = 'artist_credit.names.' + (val.idx || idx);
          addField(prefix + '.name', val.cred);
          addField(prefix + '.mbid', val.id);
          addField(prefix + '.artist.name', val.name);
          addField(prefix + '.join_phrase', val.join);
        });
      }

      if (dataSet.labels.length > 0) {
        $.each(dataSet.labels, function(idx, val) {
          var prefix = 'labels.' + (val.idx || idx);
          addField(prefix + '.mbid', val.id);
          addField(prefix + '.name', val.name);
          addField(prefix + '.catalog_number', val.catNo);
        });
      }

      if (dataSet.note != '') {
        addField('edit_note', dataSet.note);
      }

      if (dataSet.releases.length > 0) {
        $.each(dataSet.releases, function(idx, val) {
          var prefix = 'events.' + (val.idx || idx);
          addField(prefix + '.date.year', val.y);
          addField(prefix + '.date.month', val.m);
          addField(prefix + '.date.day', val.d);
          addField(prefix + '.country', val.cc);
        });
      }

      $.each(dataSet.mediums, function(idx, val) {
        var prefix = 'mediums.' + (val.idx || idx);
        addField(prefix + '.format', val.fmt);
        addField(prefix + '.name', val.name);
      });

      if (dataSet.packaging != '') {
        addField('packaging', dataSet.packaging);
      }

      if (dataSet.title != '') {
        addField('name', dataSet.title);
      }

      $.each(dataSet.tracks, function(idx, val) {
        var prefix = 'mediums.' + val.med + '.track.' + (val.idx || idx);
        addField(prefix + '.name', val.tit);
        addField(prefix + '.number', val.num);
        addField(prefix + '.recording', val.recId);
        addField(prefix + '.length', val.dur);

        if (val.artists) {
          $.each(val.artists, function(aIdx, aVal) {
            var aPrefix = prefix + '.artist_credit.names.' + (aVal.idx || aIdx);
            addField(aPrefix + '.name', aVal.cred);
            addField(aPrefix + '.mbid', aVal.id);
            addField(aPrefix + '.artist.name', aVal.name);
            addField(aPrefix + '.join_phrase', aVal.join);
          });
        }
      });

      if (dataSet.urls.length > 0) {
        $.each(dataSet.urls, function(idx, val) {
          addField('urls.' + idx + '.url', val[0]);
          addField('urls.' + idx + '.link_type', val[1]);
        });
      }
    }

    /**
      * Submit data to musicbrainz.
      */
    this.submitRelease = function() {
      if (!submitted) {
        buildForm(this.data);
        $('body').append(form);
        submitted = true;
      }
      form.submit();
    };
  };

  MBZ.Release._relationCb = function(data) {
    if (!data) {
      return {};
    }
    if (data.relations) {
      var rels = {_res: data.resource};
      $.each(data.relations, function(idx, val) {
        var id = val.release.id;
        var type = val.type;
        if (!rels[id]) {
          rels[id] = [];
        }
        if (rels[id].indexOf(type) == -1) {
          rels[id].push(type);
        }
      });
      return rels;
    }
  };

  MBZ.Release._form = {
    baseName: 'mbAddReleaseForm',
    count: 0,
    target: MBZ.baseUrl + 'release/add'
  };

  /**
    * Lookup a musicbrainz url relation for 'release' type.
    * @params[cb] callback function
    * @params[res] url to lookup
    * @params[scope] scope for callback function
    */
  MBZ.Release.getUrlRelation = function(params) {
    function innerCb(cbData) {
      if (params.scope) {
        params.cb.call(params.scope, MBZ.Release._relationCb(cbData));
      } else {
        params.cb(MBZ.Release._relationCb(cbData));
      }
    }
    MBZ.WS.getUrlRelation({
      cb: innerCb,
      res: params.res,
      rel: 'release',
      scope: params.scope
    });
  };

  /**
    * Lookup musicbrainz url relations for 'release' type.
    * @params[urls] array of urls to lookup
    * @params[cb] callback function for each response
    * @params[cbInc] callback for each item looked up
    * @params[cbDone] callback to call if all items have been looked up
    * @params[scope] scope for callback functions
    */
  MBZ.Release.getUrlRelations = function(params) {
    function innerCb(cbData) {
      if (params.scope) {
        params.cb.call(params.scope, MBZ.Release._relationCb(cbData));
      } else {
        params.cb(MBZ.Release._relationCb(cbData));
      }
    }
    MBZ.WS.getUrlRelations({
      urls: params.urls,
      rel: 'release',
      cb: innerCb,
      cbInc: params.cbInc,
      cbDone: params.cbDone,
      scope: params.scope
    });
  };

  /**
    * Insert a link, if a release has MusicBrainz relations.
    * @data key=mbid value=string array: relation types
    * @target target jQuery element to append (optional) or
    * this.mbLinkTarget set in scope
    */
  MBZ.Release.insertMBLink = function(data, target) {
    if (data) {
      var self = this;
      target = target || self.mbLinkTarget;
      if (!target) {
        return;
      }
      $.each(data, function(k, v) {
        if (!k.startsWith('_')) { // skip internal data
          var relLink = MBZ.Html.getLinkElement({
            type: 'release',
            id: k,
            title: "Linked as: " + v.toString(),
            before: '&nbsp;'
          });
          target.after(relLink);
          var editLink = MBZ.Html.getLinkElement({
            type: 'release',
            id: k,
            more: 'edit',
            text: 'edit',
            title: 'Edit release',
            before: ', ',
            icon: false
          });
          var artLinkTitle = 'set';
          $.ajax({
            url: MBZ.CA.getLink({
              type: 'release',
              id: k,
              more: 'front'
            })
          }).success(function(){
            artLinkTitle = 'edit';
          }).always(function() {
            var artLink = MBZ.Html.getLinkElement({
              type: 'release',
              id: k,
              more: 'cover-art',
              text: artLinkTitle + ' art',
              title: artLinkTitle + ' cover art for release',
              before: ', ',
              icon: false
            });
            relLink.after('<sup> ' + v.length + editLink.html()
              + artLink.html() + '</sup>');
          });
        }
      });
    }
  };

  MBZ.Release.prototype = {
    /**
      * Add an artist entry.
      * @params plain artist name as string or object:
      *   params[cred] artist name as credited
      *   params[id] artists mbid
      *   params[idx] position
      *   params[join] phrase to join with next artist
      *   params[name] artist name
      */
    addArtist: function(params) {
      if (typeof params === 'string') {
        this.data.artists.push({name: params});
      } else {
        this.data.artists.push(params);
      }
    },

    /**
      * Add a label entry.
      * @params plain label name as string or object.
      *   params[catNo] catalog number
      *   params[id] mbid
      *   params[idx] position
      *   params[name] label name
      */
    addLabel: function(params) {
      if (typeof params === 'string') {
        this.data.labels.push({name: params});
      } else {
        this.data.labels.push(params);
      }
    },

    /**
      * Set format of a medium.
      * @params[idx] position
      * @params[fmt] format type name
      * @params[name] name
      */
    addMedium: function(params) {
      this.data.mediums.push(params)
    },

    /**
      * Add a release event.
      * @params[y] YYYY
      * @params[m] MM
      * @params[d] DD
      * @params[cc] country code
      * @params[idx] position
      */
    addRelease: function(params) {
      this.data.releases.push(params);
    },

    /**
      * Add a track.
      * @params[med] medium number
      * @params[tit] track name
      * @params[idx] track number
      * @params[num] track number (free-form)
      * @params[dur] length in MM:SS or milliseconds
      * @params[recId] mbid of existing recording to associate
      * @params[artists] array of objects:
      *   obj[cred] artist name as credited
      *   obj[id] artists mbid
      *   obj[idx] position
      *   obj[join] phrase to join with next artist
      *   obj[name] artist name
      */
    addTrack: function(params) {
      this.data.tracks.push(params);
    },

    /**
      * @url target url
      * @type musicbrainz url type
      * @return true if value was added
      */
    addUrl: function(url, type) {
      url = MBZ.Util.asString(url);
      type = MBZ.Util.asString(type);

      this.data.urls.push([url, type]);
      return true;
    },

    /**
      * Dump current data (best viewed in FireBug).
      */
    dump: function() {
      console.log(this.data);
    },

    /**
      * @content annotation content
      * @return old value
      */
    setAnnotation: function(content) {
      var old = this.data.annotation;
      this.data.annotation = MBZ.Util.asString(content);
      return old;
    },

    /**
      * @content edeting note content
      * @return old value
      */
    setNote: function(content) {
      var old = this.data.note;
      this.data.note = MBZ.Util.asString(content);
      return old;
    },

    /**
      * @content packaging type
      * @return old value
      */
    setPackaging: function(type) {
      var old = this.data.packaging;
      this.data.packaging = MBZ.Util.asString(type);
      return old;
    },

    /**
      * @name release title
      * @return old value
      */
    setTitle: function(name) {
      var old = this.data.title;
      this.data.title = MBZ.Util.asString(name);
      return old;
    },
  };

  $(window).on('MBZLoadingLibrary', function(e, ts){
    if (ts.id == thisScript.id && ts.version == thisScript.version
        && typeof ts.loader === 'function') {
      ts.loader(MBZ);
    }
  });
}

// ==UserScript==
// @name           NWCD Populate Label Collage
// @namespace      notwhat.cd
// @description    Finds missing releases in label collages
// @version        1.0.2
// @match          https://*.notwhat.cd/collage*.php*id=*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/26371/NWCD%20Populate%20Label%20Collage.user.js
// @updateURL https://update.greasyfork.org/scripts/26371/NWCD%20Populate%20Label%20Collage.meta.js
// ==/UserScript==



var ORIGINAL = 0;
var REMASTER = 1;


// Ajax handler

var ajx = {
  numReqs: 0,
  queue: [],
  processing: false,

  get: function (req) {
    ajx.queue[req.priority ? 'unshift' : 'push'](req);
    if (!ajx.processing) {
      ajx.processing = true;
      ajx.doNext();
    }
  },

  doNext: function () {
    if (ajx.queue[0]) {
      if (ajx.numReqs < 5) {
        if (ajx.numReqs === 0) setTimeout(ajx.newPeriod, 10000);
        var req = ajx.queue.shift();
        if (req.test && !req.test.call(req)) {
          ajx.doNext();
        } else {
          ajx.numReqs++;
          ajx.send(req);
          setTimeout(ajx.doNext, 400);
        }
      }
    } else {
      ajx.processing = false;
    }
  },

  newPeriod: function () {
    ajx.numReqs = 0;
    ajx.doNext();
  },

  send: function (req) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', req.url, true);
    xhr.responseType = 'json';
    xhr.originalRequest = req;
    xhr.context = req.context;
    xhr.onload = ajx.onLoad;
    xhr.onerror = req.onError || null;
    if (req.timeout) {
      xhr.ontimeout = req.onTimeout || xhr.onerror;
      xhr.timeout = req.timeout;
    }
    xhr.send(null);
  },

  onLoad: function () {
    if (this.response) {
      var req = this.originalRequest;
      if (this.response.status == 'success') {
        req.onLoad.call(this);
        return;
      } else if (this.response.error == 'rate limit exceeded') {
        setTimeout(function () { ajx.get(req); }, 2000);
        return;
      }
    }
    if (this.onerror) this.onerror.call(this);
  }
};



// DOM methods

var dom = {
  id: function (id) { return document.getElementById(id); },
  qs: function (s, p) { return (p || document).querySelector(s); },
  qsa: function (s, p) { return (p || document).querySelectorAll(s); },
  cl: function (cl, p) { return (p || document).getElementsByClassName(cl); },
  tag: function (tag, p) { return (p || document).getElementsByTagName(tag); },
  txt: function (txt) { return document.createTextNode(txt); },
  app: function (parent, var_args) {
    for (var i = 1, il = arguments.length; i < il; ++i) {
      var child = arguments[i];
      if (typeof child == 'string') child = this.txt(child);
      if (child) parent.appendChild(child);
    }
  },
  mk: function (tag, attr, var_args) {
    var elem = document.createElement(tag);
    if (attr) for (var a in attr) if (attr.hasOwnProperty(a)) elem[a] = attr[a];
    if (arguments.length > 2) {
      var args = Array.prototype.slice.call(arguments, 2);
      args.unshift(elem);
      this.app.apply(this, args);
    }
    return elem;
  },
  par: function (tag, el) {
    do el = el.parentNode;
    while (el && el.tagName != tag.toUpperCase());
    return el;
  }
};



var categoryIsLabel = !!dom.qs('.box_category a[href$="cats[4]=1"]');
if (categoryIsLabel) {


  // Set the search string from the name of the collage

  var searchString = dom.tag('h2')[0].textContent.
      // specific words:
      replace(/\b(?:^an?\s+|the|and|label|record(?:ing)?s|musi(?:[ck]|que)|produ[ck]tions?|publications|entertainment|media|group|ltd|limited|inc|incorporated|international|publishing|company|co|discography|releases|albums|discs|series|compilations?|(?:its +)?sublabels)\b/ig, ' ').
      // anything in parentheses or brackets, except at the beginning:
      replace(/(.)(?:\([^)]*\)|\[[^\]]*\])/g, '$1 ').
      // special characters:
      replace(/[&+.,:;!?\-_/\\=%*#|~()[\]"'`´\u2122]/g, ' ').
      // extra spaces:
      replace(/\s{2,}/g, ' ').trim();



  // Create the box

  var box = dom.mk('div', {className: 'box'},
    dom.mk('div', {className: 'head'},
      dom.mk('strong', null, 'Find missing groups')),
    dom.mk('div', {className: 'pad'},
      dom.mk('form', null,
        dom.mk('div', {className: 'field_div'},
          dom.mk('input', {type: 'text', size: 20, value: searchString})),
        dom.mk('div', {className: 'submit_div'},
          dom.mk('input', {type: 'submit', value: 'Search'})))));

  var elem = dom.cl('box_addtorrent')[0];
  elem.parentNode.insertBefore(box, elem);

  dom.tag('form', box)[0].addEventListener('submit', function (e) {
    e.preventDefault();
    var field = dom.qs('.field_div > input', box);
    searchString = field.value.trim();
    if (searchString) startSearch();
    else window.alert('The search string is too short!');
  });



  // Add CSS

  var updateCSS = function () {

    function addStyle(css) {
      dom.app(document.head, dom.mk('style', {type: 'text/css'}, css));
    }

    var boxStyle = getComputedStyle(box);
    var col = boxStyle.color;
    var fw = parseInt(boxStyle.fontWeight, 10);

    addStyle([
      '#plc_progress { height: 3px; width: 96%;',
                      'border: 1px solid ', col, '; border-radius: 2px; }',
      '#plc_progress > div { height: 100%; width: 0; background-color: ', col, ';}',
      '#plc_progress.plc_error { border-color: #ce1717; }',
      '#plc_progress.plc_error > div { background-color: #ce1717; }',

      '#plc_cont > div { margin-bottom: 10px; }',
      '#plc_cont > div:first-child { margin-bottom: 16px; }',

      '#plc_table td:first-child { width: 12px; }',
      '.plc_present > td { background-color: rgba(57, 225, 20, 0.05) !important; }',
      '.plc_label { margin-top: 4px; }',
      '.plc_label, .plc_viewall {',
          'float: right;', fw < 400 ? '}' : 'font-weight: normal !important; }',

      '.plc_tag0  { font-size: 10px; opacity: 0.7; }',
      '.plc_tag1  { font-size: 11px; }',
      '.plc_tag2  { font-size: 12px; }',
      '.plc_tag3  { font-size: 13px; }',
      '.plc_tag4  { font-size: 14px; }',
      '.plc_tag5  { font-size: 15px; }',
      '.plc_tag6  { font-size: 16px; }',
      '.plc_tag7  { font-size: 17px; }',
      '.plc_tag8  { font-size: 18px; }',
      '.plc_tag9  { font-size: 19px; }',
      '.plc_tag10 { font-size: 20px; }'
    ].join(''));

    var done = false;

    return function () {
      if (done) return;

      var elem = dom.qs('#plc_table .group_info');
      if (elem) {
        if (getComputedStyle(elem).display == 'table-cell') {
          addStyle('#plc_table .group_info { width: 650px; }');
          elem = dom.qs('#plc_table img');
          if (elem) {
            var s = getComputedStyle(elem);
            var w = parseInt(s.width, 10) + parseInt(s.borderLeftWidth, 10) +
                    parseInt(s.borderRightWidth, 10);
            addStyle('#plc_table .group_image { min-width: ' + w + 'px; }');
          }
        }
        done = true;
      }
    };
  }();
}

// Finished setting things up





// Initiate a new search

function startSearch() {


  // Update number of selected/found groups in the status box

  function refreshStatus() {
    var numSel = 0;
    var elems = dom.qsa('.group input', table);
    for (var i = elems.length; i--; ) {
      if (elems[i].checked) numSel++;
    }
    cont.children[1].textContent = ['Selected: ', numSel, ' / ', elems.length].join('');
    cont.children[2].disabled = !numSel; // "Add" button
  }




  // Update the search progress bar

  function updateProgress(pct) {
    pct = Math.floor(pct * 100);
    cont.children[0].children[0].style.width = pct + '%';
  }




  // Things that should happen when all searches have loaded

  function onSearchFinished() {
    var numGroups = dom.cl('group', table).length;

    if (numGroups === 0) {
      dom.app(table.children[0], dom.mk('tr', null,
        dom.mk('td', {className: 'center', colSpan: 2}, 'Found no missing groups.')));

    } else if (numGroups < 4) {
      showAllLabels();

    } else {
      dom.app(table.rows[0].cells[1],
        dom.mk('a', {className: 'plc_viewall brackets', href: '#'}, 'View all labels'));
    }
  }




  // Show all the labels

  function showAllLabels() {
    var links = dom.cl('plc_viewlabel', table);
    if (links[0]) links[0].click();
    for (var i = links.length; i--; ) {
      links[i].click();
    }
  }




  // Submit all selected groups to the server

  function addSelectedToCollage() {
    var urls = [];
    var base = 'https://notwhat.cd/torrents.php?id=';
    var elems = dom.qsa('.group input', table);
    for (var i = elems.length; i--; ) {
      if (elems[i].checked) urls.push(base + elems[i].value);
    }
    if (urls.length) {
      var form = dom.qs('.add_form[name="torrents"]');
      dom.tag('textarea', form)[0].value = urls.join('\n');
      form.submit();
    }
  }




  // Cancel all pending requests and restore the page

  function cancelSearch() {
    searchIsActive = false;
    box.removeChild(cont);
    table.parentNode.removeChild(table);
    box.lastElementChild.classList.remove('hidden');
  }





  // Load search results

  var loadSearch = function () {

    function testRequest() {
      // this also handles the "too many pages" site bug
      return searchIsActive && this.context.page <= numPages[this.context.edition];
    }


    function onFailSearch() {
      cont.children[0].classList.add('plc_error');
    }


    var onLoadSearch = function () {
      var processedPages = 0;
      var foundGroups = {}; // used to test for dupes

      return function () {

        var page = this.context.page;
        var edition = this.context.edition;
        var groups = this.response.response.results;
        var respPages = this.response.response.pages;

        if (groups.length) {
          if (page == 1) {
            for (var i = 2; i <= respPages; i++) {
              loadSearch({ edition: edition, page: i });
            }
          }

          var foundSomething = false;
          for (var i = 0, il = groups.length; i < il; i++) {
            var id = 'group_' + groups[i].groupId;
            if (!foundGroups[id] && !dom.id(id)) {
              foundGroups[id] = foundSomething = true;
              appendGroup(groups[i]);
            }
          }

          processedPages++;
          // beware the "too many pages" bug:
          if (respPages < numPages[edition]) numPages[edition] = respPages;

          if (foundSomething) {
            refreshStatus();
            updateCSS();
          }

        } else {
          if (numPages[edition] == Infinity) numPages[edition] = 0;
        }

        var totalPages = numPages[ORIGINAL] + numPages[REMASTER];
        var progress = totalPages ? processedPages / totalPages : 1;
        updateProgress(progress);
        if (progress == 1) onSearchFinished();

      };
    }();


    var search = encodeURIComponent(searchString);
    var numPages = [Infinity, Infinity];


    return function (param) {
      param.page = param.page || 1;

      ajx.get({
        url:     ['ajax.php?action=browse', param.edition == ORIGINAL ? '&' : '&remaster',
                  'recordlabel=', search, '&page=', param.page].join(''),
        context: param,
        onLoad:  onLoadSearch,
        onError: onFailSearch,
        test:    testRequest
      });
    };

  }(); // loadSearch





  // Load torrent group info

  var loadGroup = function () {

    function testRequest() {
      return searchIsActive;
    }


    function onFailGroup() {
      this.context.textContent = 'Loading failed';
    }


    function onLoadGroup() {

      var grp = this.response.response.group;
      var tor = this.response.response.torrents;

      var labelKeys = [];
      var labelStrings = [];

      var addLabel = function (label, cat) {
        // get rid of duplicates
        var key = (label + cat).replace(/\s+/g, '').toLowerCase();
        if (key && labelKeys.indexOf(key) < 0) {
          labelKeys.push(key);
          labelStrings.push((label || '(none)') + (cat ? ' / ' + cat : ''));
        }
      };

      addLabel(grp.recordLabel, grp.catalogueNumber);
      for (var i = 0, il = tor.length; i < il; i++) {
        addLabel(tor[i].remasterRecordLabel, tor[i].remasterCatalogueNumber);
      }

      var elem = this.context;
      elem.innerHTML = labelStrings.join('<br>');

      // look for more artists
      var row = dom.par('tr', elem);
      if (!row.classList.contains('plc_present') && grp.musicInfo) {
        var artists = grp.musicInfo.dj.concat(grp.musicInfo.with,
            grp.musicInfo.remixedBy, grp.musicInfo.producer);
        if (testArtists(artists)) {
          row.classList.add('plc_present');
        }
      }
    }


    return function (elem) {
      var row = dom.par('tr', elem);
      var id = row.cells[0].children[0].value;

      ajx.get({
        url:      'ajax.php?action=torrentgroup&id=' + id,
        context:  elem,
        priority: true,
        onLoad:   onLoadGroup,
        onError:  onFailGroup,
        test:     testRequest
      });
    };

  }(); // loadGroup





  // Test if any of the artists are present in the collage,
  // as far as we know (they could be hidden under Various Artists)

  var testArtists = function () {

    var artistIds = {};
    var artistLinks = dom.qsa('#discog_table a[href*="artist.php"], .box_artists a');
    for (var i = artistLinks.length; i--; ) {
      var id = artistLinks[i].href.split('id=')[1];
      artistIds[id] = true;
    }

    return function (artists) {
      if (artists && artistLinks.length) {
        return artists.some(function (artist) {
          return artistIds[artist.id];
        });
      }
      return false;
    };
  }();





  // Create a new table row for this group

  var appendGroup = function () {

    function makeImg(src) {
      src = src || 'static/common/noartwork/music.png';
      var suffix = /ptpimg(?!.*_thumb)/.test(src) ? '_thumb' :
                   /imgur.*\/(\w{5}|\w{7})\.\w+$/.test(src) ? 'm' : '';
      var thumb = suffix ? src.replace(/\.\w+$/, suffix + '$&') : src;

      return dom.mk('img', {src: thumb, alt: 'Cover', width: 90, height: 90});
    }


    function brkt(str) {
      return str ? ' [' + str + ']' : '';
    }


    var makeTagDiv = function () {

      function getClass(score) {
        for (var i = 0; i < 11; i++) {
          if (score*10 <= i) return 'plc_tag' + i;
        }
      }

      function ci(num, total) {
        if (num === 0 || total === 0) return 0;
        var z = 1.96;
        var p = num / total;
        return (p + z*z / (2*total) - z * Math.sqrt((p*(1 - p) +
            z*z / (4*total)) / total)) / (1 + z*z / total);
      }

      var tagCls = {}; // cache of tag classes
      var colTable = dom.id('discog_table');
      var totalTor = dom.cl('group', colTable).length;

      return function (tags) {
        // if torrent has no tags, the array contains one empty string
        var div = dom.mk('div', {className: 'tags'});
        for (var i = 0; i < tags.length; i++) {
          var t = tags[i];
          if (t) {
            if (totalTor && !(t in tagCls)) {
              var numTor = dom.qsa('a[href$="taglist=' + t + '"]', colTable).length;
              tagCls[t] = getClass(ci(numTor, totalTor));
            }
            dom.app(div, i ? ', ' : null, dom.mk('a', {className: tagCls[t] || ''}, t));
          }
        }
        return div;
      };
    }();


    return function (grp) {
      // if the category is not music, grp.torrents is undefined
      var artHere = grp.torrents && testArtists(grp.torrents[0].artists);

      dom.app(table.children[0],
        dom.mk('tr', {className: 'group discog' + (artHere ? ' plc_present' : '')},
          dom.mk('td', {className: 'center'},
            dom.mk('input', {type: 'checkbox', value: grp.groupId})),
          dom.mk('td', {className: 'big_info'},
            dom.mk('div', {className: 'group_image float_left clear'},
              makeImg(grp.cover)),
            dom.mk('div', {className: 'group_info clear'},
              dom.mk('strong', null,
                dom.mk('a', {href: 'torrents.php?id=' + grp.groupId, target: '_blank'},
                  dom.mk('span', {innerHTML: grp.artist || '', dir: 'ltr'}),
                  grp.artist ? ' - ' : null,
                  dom.mk('span', {innerHTML: grp.groupName, dir: 'ltr'})),
                brkt(grp.groupYear) + brkt(grp.releaseType) + brkt(grp.category)),
              makeTagDiv(grp.tags),
              dom.mk('div', {className: 'plc_label'},
                dom.mk('a', {className: 'plc_viewlabel brackets', href: '#'},
                  'View label'))))));
    };

  }(); // appendGroup





  // Create the container

  var cont = dom.mk('div', {id: 'plc_cont', className: 'pad'},
    dom.mk('div', {id: 'plc_progress'}, dom.mk('div')),
    dom.mk('div', null, 'Selected: 0 / 0'),
    dom.mk('input', {type: 'button', value: 'Add', disabled: true}), ' ',
    dom.mk('input', {type: 'button', value: 'Cancel'}));

  cont.addEventListener('click', function (e) {
    if (e.target.tagName == 'INPUT') {
      if (e.target.value == 'Add') addSelectedToCollage();
      else cancelSearch();
    }
  }, false);

  box.lastElementChild.classList.add('hidden');
  dom.app(box, cont);



  // Create the table

  var table = dom.mk('table', {id: 'plc_table', className: 'torrent_table'},
    dom.mk('tbody', null,
      dom.mk('tr', {className: 'colhead'},
        dom.mk('td', {className: 'center'},
          dom.mk('input', {type: 'checkbox'})),
        dom.mk('td', null,
          dom.mk('strong', null, 'Missing torrent groups')))));

  table.addEventListener('change', function (e) {
    if (dom.par('tr', e.target).rowIndex === 0) {
      var elems = dom.qsa('.group input', table);
      for (var i = elems.length; i--; ) {
        elems[i].checked = e.target.checked;
      }
    }
    refreshStatus();
  }, false);

  table.addEventListener('click', function (e) {

    if (e.target.classList.contains('plc_viewlabel')) {
      e.preventDefault();
      loadGroup(e.target.parentNode);
      e.target.parentNode.textContent = 'Loading...';
    }

    if (e.target.classList.contains('plc_viewall')) {
      e.preventDefault();
      showAllLabels();
      e.target.style.opacity = '0.4';
      setTimeout(function () { e.target.style.display = 'none'; }, 80);
    }

    if (e.target.tagName == 'IMG') {
      if (window.lightbox && lightbox.init) {
        var src = e.target.src.
            replace(/(ptpimg.*)_thumb(\.\w+)$/, '$1$2').
            replace(/(imgur.*\/(?:\w{5}|\w{7}))m(\.\w+)$/, '$1$2');
        lightbox.init(src, 90);
      }
    }
  }, false);

  var parent = dom.cl('main_column')[0];
  parent.insertBefore(table, parent.firstChild);



  // Begin searching

  var searchIsActive = true;
  loadSearch({ edition: ORIGINAL });
  loadSearch({ edition: REMASTER });


}
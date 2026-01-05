// ==UserScript==
// @name           RED Report Support
// @namespace      RED
// @description    Some changes that make viewing reports easier
// @version        1.0.1
// @include        http*://*redacted.cd/torrents.php*
// @include        http*://*redacted.cd/top10.php*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/25378/RED%20Report%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/25378/RED%20Report%20Support.meta.js
// ==/UserScript==


var pref = {
// ____________________________________________________________________
// ____________________ Preferences ___________________________________

//   Select a style for the "Reported" labels
//     0: No style (use stylesheet default)
//     1: Red text
//     2: Red box
//     3: Red shadow
//     4: User defined style

          style: 2,


//   Style to use with option 4 above

          userStyle: 'background: black; color: white;',


//   Load torrent details via torrent ID rather than group ID
//     (Slower, but will find the report even if the torrent was
//      moved into another group, and will tell you the reason if
//      the torrent was deleted)

          useTorrentId: false

// ____________________________________________________________________
// _________________ End of Preferences _______________________________
};



function setLabelFromTable(label, table) {
  var rex = /"(.+)"/, reasons = [], i = 0, reason;
  while (table.rows[++i]) {
    reason = table.rows[i].textContent.match(rex);
    if (reason) reasons.push(reason[1]);
  }

  toolt.set(label, reasons.join(' + ') || 'Reported');
  if (reasons.length > 1) {
    label.textContent += [' (', reasons.length, ')'].join('');
  }
}



function doDetails() {

  function reportToggler(tId) {

    function elem(name) {
      return dom.id([name, tId].join('_'));
    }

    return function (e) {
      e.preventDefault();
      var tEl = elem('torrent');
      var rEl = elem('reported');
      if (tEl && rEl && ~[tEl.className, rEl.className].join().indexOf('hidden')) {
        e.stopPropagation();
        var names = ['peers', 'files', 'snatches', 'downloads', 'logs'];
        for (var i = names.length; i--; ) {
          var el = elem(names[i]);
          if (el) el.classList.add('hidden');
        }
        rEl.classList.remove('hidden');
        tEl.classList.remove('hidden');
      }
    };
  }

  var tables = dom.cl('reportinfo_table');
  for (var i = tables.length; i--; ) {
    var tId = dom.par(tables[i]).id.split('_')[1];
    var row = dom.id('torrent' + tId);
    var repLabel = row && dom.qs('.tl_reported, .gm_color_reported', row);
    if (repLabel) {
      setLabelFromTable(repLabel, tables[i]);
      repLabel.addEventListener('click', reportToggler(tId), false);
    }
  }

} // doDetails



function doBrowse() {

  function initLabel(label) {
    if (label.id) return label.id.split('_')[2];

    if (!dom.id('gmrs_parentelem')) {
      css.init();
      // replicate dom structure so the table looks fine with most stylesheets
      var parentElem = dom.id('content');
      if (!dom.id('torrents')) {
        parentElem = dom.mk('div', {id: 'torrents'});
        dom.app(dom.id('content'), parentElem);
      }
      dom.app(parentElem,
        dom.mk('div', {className: 'main_column'},
          dom.mk('table', {id: 'torrent_details', className: 'torrent_table details'},
            dom.mk('tbody', null,
              dom.mk('tr', {className: 'torrentdetails pad'},
                dom.mk('td', {id: 'gmrs_parentelem'}))))));
    }

    var torrentLink = dom.qs('a[href*="torrentid="]', dom.par(label, 'td'));
    var ids = torrentLink.search.match(/\d+/g);
    processGroup(ids[0], [ids[1]]);
    return ids[1];
  }


  function processGroup(groupId, tIds) {
    var tLinks = dom.qsa(['a[href*="id=', groupId, '&torrentid"]'].join(''));

    for (var i = tLinks.length; i--; ) {
      var repLabel = dom.qs('.tl_reported, .gm_color_reported', dom.par(tLinks[i], 'td'));

      if (repLabel && !repLabel.id) {
        var tId = tLinks[i].search.split('torrentid=')[1];
        if (tId != tIds[0]) tIds.push(tId);

        repLabel.id = 'gmrs_label_' + tId;
        if (!toolt.useTooltipster) toolt.set(repLabel, 'Loading...');
        evt.toggleHover(repLabel, false);

        if (!dom.id('gmrs_box_' + tId)) {
          var repBox = dom.mk('div', {id: 'gmrs_box_' + tId, className: 'gmrs_repbox hidden'},
            dom.mk('table', {className: 'gmrs_status'}, dom.mk('tbody', null,
              dom.mk('tr', {className: 'colhead_dark'},
                dom.mk('td', null, 'Loading...', status.makeCloser())),
              dom.mk('tr', null,
                dom.mk('td', {className: 'gmrs_statusbody'}, dom.mk('br'))))));
          dom.app(dom.id('gmrs_parentelem'), repBox);

          var alignElem = dom.par(tLinks[i]).tagName != 'STRONG' ? tLinks[i] : dom.par(tLinks[i]);
          var offset = css.getOffset(alignElem);
          repBox.style.top = [offset.top + 12, 'px'].join('');
          repBox.style.left = [offset.left + 10 + css.hidePx, 'px'].join('');
          repBox.addEventListener('click', evt.onClickBox, true);
        }

        if (toolt.useTooltipster && tLinks[i].classList.contains('tooltip')) {
          toolt.remove(tLinks[i]);
        }
      }
    } // for each tLink

    var req = new XMLHttpRequest();
    req.tIds = tIds;
    req.onload = onLoad;
    req.onerror = onError;
    req.open('GET', 'torrents.php?' +
        (pref.useTorrentId ? 'torrentid=' + tIds[0] : 'id=' + groupId), true);
    req.send(null);
  }


  function onLoad() {
    var match = /<body id="(torrents|log)">([\s\S]*)<\/body>/.exec(this.responseText);
    if (match) {
      var responseElem = dom.mk('div', {innerHTML: match[2]});
      if (match[1] == 'torrents') {

        for (var i = 0, il = this.tIds.length; i < il; i++) {
          var tId = this.tIds[i];
          var repLabel = dom.id('gmrs_label_' + tId);
          var repTable = dom.qs('#reported_' + tId + ' > table', responseElem);

          if (repTable) { // report found
            setLabelFromTable(repLabel, repTable);
            dom.app(repTable.rows[0].cells[0], status.makeCloser());
            var repBox = dom.id('gmrs_box_' + tId);
            repBox.replaceChild(repTable, repBox.firstElementChild);
            var elems = dom.cl('tooltip', repTable);
            for (var j = elems.length; j--; ) toolt.init(elems[j]);

          } else if (dom.qs('#torrent' + tId, responseElem)) { // torrent found
            repLabel.style.opacity = '0.3';
            setTimeout(status.removeLabel, 3000, repLabel);
            status.update(tId, 'This report has been resolved',
                'The torrent is no longer reported.');

          } else {
            if (pref.useTorrentId) {
              status.reset(tId);
            } else {
              status.update(tId, 'The torrent is no longer in this group',
                  'It has either been deleted or moved into another group.', true);
            }
          }
        }

      } else { // redirected to site log
        if (pref.useTorrentId) {
          var tId = this.tIds.shift();
          dom.par(dom.id('gmrs_label_' + tId), 'td').style.opacity = '0.4';
          status.update(tId, 'This torrent was deleted',
              status.getLogEntry(dom.qs('#log_table', responseElem), tId));
          status.reset(this.tIds);
        } else {
          status.update(this.tIds, 'This group no longer exists',
              'The torrent was either deleted or moved into another group.', true);
        }
      }

    } else {
      onError.call(this);
    }
  }


  function onError() {
    status.update(this.tIds, 'Loading failed', '', true);
  }



  var status = {
    update: function (tIds, msg, msg2, unknown) {
      tIds = Array.isArray(tIds) ? tIds : [tIds];
      for (var i = 0, il = tIds.length; i < il; i++) {
        var repLabel = dom.id('gmrs_label_' + tIds[i]);
        toolt.set(repLabel, msg);
        if (unknown) repLabel.textContent += '?';

        var table = dom.cl('gmrs_status', dom.id('gmrs_box_' + tIds[i]))[0];
        if (table) {
          table.rows[0].cells[0].firstChild.textContent = msg;
          if (msg2 instanceof HTMLElement) {
            table.rows[1].replaceChild(msg2, table.rows[1].cells[0]);
          } else if (msg2) {
            table.rows[1].cells[0].textContent = msg2;
          }
        }
      }
    },
    reset: function (tIds) {
      tIds = Array.isArray(tIds) ? tIds : [tIds];
      for (var i = tIds.length; i--; ) {
        var repLabel = dom.id('gmrs_label_' + tIds[i]);
        toolt.resetLabel(repLabel);
        repLabel.id = '';
        evt.toggleHover(repLabel, true);
      }
    },
    removeLabel: function (label) {
      var node = label.previousSibling;
      node.textContent = node.textContent.replace(/[/-]\s*$/, '');
      label.classList.add('hidden');
    },
    makeCloser: function () {
      var closer = dom.mk('a', {href: '#', className: 'gmrs_closer brackets'}, ' X ');
      toolt.set(closer, 'Close');
      return closer;
    },
    getLogEntry: function (table, tId) {
      var re = new RegExp(['Torrent ', tId, '\\b.*deleted by'].join(''));
      var row = table.rows[1];
      while (row && !re.test(row.cells[1].textContent)) {
        row = row.nextElementSibling;
      }
      if (row) {
        var timeElem = row.cells[0].firstElementChild;
        timeElem.textContent = timeElem.textContent.replace('J', 'j');
        toolt.init(timeElem);

        var node = row.cells[1].firstElementChild.childNodes[1];
        while (node && !/deleted by $/.test(node.previousSibling.textContent)) {
          node = node.nextSibling;
        }
        if (node) {
          var deleterElem = node;
          var msgElem = dom.mk('span');
          while (node = deleterElem.nextSibling) msgElem.appendChild(node);
          msgElem.firstChild.textContent =
              msgElem.firstChild.textContent.replace(/^([ :]|for the reason)*/, '');
          msgElem.lastChild.textContent =
              msgElem.lastChild.textContent.replace(/\([0-9A-F]{40}\)$/, '');

          var cell = dom.mk('td', null, deleterElem, ' deleted it ', timeElem);
          if (msgElem.textContent.trim()) {
            dom.app(cell, ' for the reason:', dom.mk('blockquote', null, msgElem));
          } else {
            dom.app(cell, '.');
          }
          return cell;
        }
      }
      return dom.mk('td', null, 'It is gone forever.');
    }
  };


  var evt = {
    timer: 0,
    toggleHover: function (label, on) {
      if (!toolt.useTooltipster) return;
      var method = (on ? 'add' : 'remove') + 'EventListener';
      label[method]('mouseover', this.onMouseover, false);
      label[method]('mouseout', this.onMouseout, false);
    },
    onMouseover: function (e) {
      evt.timer = setTimeout(initLabel, toolt.delay, e.target);
    },
    onMouseout: function () {
      clearTimeout(evt.timer);
    },
    onClickLabel: function (e) {
      e.preventDefault();
      clearTimeout(evt.timer);
      var tId = e.target.id.split('_')[2] || initLabel(e.target);

      var repBoxes = dom.cl('gmrs_repbox');
      for (var i = repBoxes.length; i--; ) {
        var thisId = repBoxes[i].id.split('_')[2];
        repBoxes[i].classList[thisId != tId ? 'add' : 'toggle']('hidden');
      }
    },
    onClickBox: function (e) {
      if (e.target.classList.contains('gmrs_closer')) {
        e.preventDefault();
        e.currentTarget.classList.add('hidden');
      } else if (e.target.nextElementSibling &&
                 e.target.nextElementSibling.classList.contains('spoiler')) {
        e.stopPropagation();
        e.target.nextElementSibling.classList.toggle('hidden');
        e.target.textContent = e.target.textContent == 'Show' ? 'Hide' : 'Show';
      }
    }
  };


  css.addStyle('.tl_reported, .gm_color_reported { cursor: pointer; }'); // top10

  var labels = dom.qsa('.tl_reported, .gm_color_reported');
  for (var i = labels.length; i--; ) {
    toolt.resetLabel(labels[i]);
    labels[i].addEventListener('click', evt.onClickLabel, false);
    evt.toggleHover(labels[i], true);
  }

} // doBrowse



var css = {
  contRel: false,
  hidePx: 9999,
  labelStyles: [
    '',
    'color: #e20; background: initial; padding: 0;',
    'background: rgba(200,50,39,0.8); color: #fdffe8; font-weight: normal;' +
        'border-radius: 2px; padding: 0 2px; display: inline-block;',
    'text-shadow: 0 0 0.6em #f55, 0 0 1.8em #b00;' +
        'background: initial; color: inherit; padding: 0;',
    pref.userStyle
  ],
  addStyle: function (s) {
    dom.app(document.head || dom.tag('head')[0],
        dom.mk('style', {textContent: s, type: 'text/css'}));
  },
  getOffset: function (elem) {
    var rect = elem.getBoundingClientRect();
    var from = this.contRel ? dom.id('content').getBoundingClientRect() :
                              { top: -window.scrollY, left: -window.scrollX };
    return { top: Math.round(rect.bottom - from.top),
             left: Math.round(rect.left - from.left) };
  },
  init: function () {
    var contStyle = getComputedStyle(dom.id('content'));
    this.contRel = contStyle.position == 'relative';
    var bgColour = contStyle.backgroundColor;
    if (bgColour == 'transparent') {
      bgColour = getComputedStyle(document.body).backgroundColor;
    }
    this.addStyle([
      '.main_column { position: absolute !important; top: 0; left: -', this.hidePx, 'px; }',
      '.gmrs_repbox { position: absolute; z-index: 99; box-shadow: 3px 3px 12px -2px #111; ',
          'background: ', bgColour, '; }', // avoid transparent box with some stylesheets
      '#torrents .torrentdetails.pad table {', // must override monov2
          'width: 520px !important; margin: 0 !important; }', // margin fix for monov2, anorex
      '.reportinfo_table img { max-width: 465px !important; }',
      '.reportinfo_table blockquote > blockquote > img { max-width: 425px !important; }',
      '.gmrs_status .colhead_dark { font-weight: bold; }',
      '.gmrs_statusbody { padding: 12px 12px 15px !important; }',
      '.gmrs_closer { float: right; font-weight: normal !important; }'
    ].join(''));
  }
};


var toolt = {
  delay: 500,
  useTooltipster: !!(window.jQuery && jQuery.fn.tooltipster),
  init: function (elem) {
    if (!this.useTooltipster) return;
    elem.classList.add('tooltip');
    jQuery(elem).tooltipster({ delay: this.delay, maxWidth: 400 });
  },
  set: function (elem, tt) {
    if (this.useTooltipster && !elem.title && elem.classList.contains('tooltip')) {
      jQuery(elem).tooltipster('update', tt);
    } else {
      elem.title = tt;
      if (!elem.classList.contains('tooltip')) this.init(elem);
    }
  },
  remove: function (elem) {
    if (this.useTooltipster) {
      elem.classList.remove('tooltip');
      jQuery(elem).tooltipster('destroy');
    }
    elem.title = '';
  },
  resetLabel: function (label) {
    this.set(label, this.useTooltipster ? 'Loading...' : 'Click to show report');
  }
};


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
      parent.appendChild(child);
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
  par: function (el, tag) {
    do { el = el.parentNode; }
    while (el && tag && el.tagName != tag.toUpperCase());
    return el;
  }
};


if (pref.style) {
  css.addStyle(['.tl_reported:not(.tl_bad_tags):not(.tl_bad_folders):not(.tl_bad_file_names)',
      '{', css.labelStyles[pref.style], '}'].join(''));
}

if (/[?&]id=/.test(window.location.search)) {
  doDetails();
} else {
  doBrowse(); // or Top10
}
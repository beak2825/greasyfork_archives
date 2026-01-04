// ==UserScript==
// @name           RED Least Seeded by Artist
// @namespace      passtheheadphones.me
// @description    Lists the least seeded releases on artist & collage pages
// @version        1.1.1
// @include        https://redacted.ch/artist.php*id=*
// @include        https://redacted.ch/collage*.php*id=*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/434041/RED%20Least%20Seeded%20by%20Artist.user.js
// @updateURL https://update.greasyfork.org/scripts/434041/RED%20Least%20Seeded%20by%20Artist.meta.js
// ==/UserScript==


var pref = {
// _________________________________________________________
// ____________________ Preferences ________________________


//   Initial number of groups shown:

        numInit: 3,


//   Maximum number of groups shown:

        numTotal: 100,


//   Release types to include (those prefixed
//   with "-" are omitted from the filtered list):

        relTypes: {
             1: '+Album',
             3: '+Soundtrack',
             5: '+EP',
             6: '+Anthology',
             7: '-Compilation',
             9: '+Single',
            11: '+Live album',
            13: '+Remix',
            14: '+Bootleg',
            15: '+Interview',
            16: '-Mixtape',
            17: '+Demo',
            18: '+Concert Recording',
            19: '+DJ Mix', // filtered if this artist is not the DJ
            21: '+Unknown',
          1021: '-Produced By',
          1022: '+Composition',
          1023: '-Remixed By',
          1024: '-Guest Appearance'
        },


//   Filter list by default?

        filter: true,


//   Mark former staff picks with an asterisk?

        markPicks: true,


//   Open group page instead of scrolling down?

        noScroll: true,


//   Add a link to search for forum recommendations?

        addForumLink: true,


//   Show most popular in collages too?

        doCollages: true

// _________________________________________________________
// _________________ End of Preferences ____________________
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
  ins: function (newEl, refEl) {
    if (typeof newEl == 'string') newEl = this.txt(newEl);
    refEl.parentNode.insertBefore(newEl, refEl);
  }
};



function onClickExpand(e) {
  e.preventDefault();
  mainColumn.classList.toggle('mp_collapsed');
}



function onClickFilter(e) {
  e.preventDefault();
  var filt = +!pref.filter;
  if (dom.id('mp_table_' + filt)) {
    mainColumn.classList.toggle('mp_filtered');
  } else {
    makeList(filt);
  }
}



function setTitle(elem, str) {
  elem.title = str;
  if (window.jQuery && jQuery.fn.tooltipster) {
    jQuery(elem).tooltipster({ delay: 500, maxWidth: 400 });
  }
}



function getStats(groupRows) {
  var stats = {};
  for (var i = 0, il = groupRows.length; i < il; ++i) {

    if (groupRows[i].classList.contains('group')) {
      var row = groupRows[i].nextElementSibling;
      // if the group is empty, row will be another group row (or null)
      var groupId = row && (/groupid_(\d+)/.exec(row.className) || '')[1];
      if (!groupId || groupId in stats) continue;

      var snatchCount = 0;
      while (row && !/\b(?:group|torrent)\b/.test(row.className)) {
        if (row.classList.contains('torrent_row')) {
          snatchCount += parseInt(row.cells[3].textContent.replace(',', ''), 10);
        }
        row = row.nextElementSibling;
      }
      stats[groupId] = snatchCount;

    } else { // non-grouped torrent (i.e. non-music in a collage)
      var groupId = groupRows[i].id.split('_')[1];
      stats[groupId] = parseInt(groupRows[i].cells[5].textContent.replace(',', ''), 10);
    }
  }

  return stats;
}



function prependArtistsTo(node, elem) {
  while (node.previousSibling) {
    dom.ins(node.nodeType == 3 ?
        node.textContent.indexOf('Various') < 0 ?
          node.textContent :
          node.textContent.length != 36 ? ' - ' : ' under ' :
        dom.mk('span', {dir: 'ltr'}, node.textContent.replace('Symphony Orchestra', 'SO')),
      elem.firstChild);
    node = node.previousSibling;
  }
}



function makeList(filt) {
  var sel = '';
  if (artistPage) {
    for (var num in pref.relTypes) {
      if (pref.relTypes.hasOwnProperty(num) && !(filt && pref.relTypes[num][0] == '-')) {
        sel += [sel ? ',' : '', '.group.releases_', num].join('');
      }
    }
  } else {
    sel = '.group, .torrent';
  }

  var groupStats = getStats(dom.qsa(sel));
  var sortedIds = Object.keys(groupStats).sort(function (b, a) {
    return groupStats[b] - groupStats[a];
  });


  var tab = dom.mk('table', {id: 'mp_table_' + filt, className: 'mp_table collage_table'},
    dom.mk('tr', {className: 'colhead'},
      dom.mk('td', null, 'Least Seeded ',
        dom.mk('a', {className: 'mp_expandlink hidden', href: '#'},
          dom.mk('span', null, '(Show more)'),
          dom.mk('span', null, '(Show fewer)'))),
      dom.mk('td', null, '# seeds')));


  for (var i = 0, il = sortedIds.length, numRows = 0;
       i < il && numRows < pref.numTotal;
       ++i) {
    var groupRow = dom.id('group_' + sortedIds[i]) ||
                   dom.cl('groupid_' + sortedIds[i])[0].previousElementSibling;
    var relType = artistPage && /releases_(\d+)/.exec(groupRow.className)[1];
    var infoEl = dom.qs('strong', groupRow);

    if (filt && relType == '19' && infoEl.textContent.indexOf(artistName) < 0) {
      continue; // filter DJ mixes where they are not the DJ
    }

    ++numRows;
    groupRow.id = 'group_' + sortedIds[i];

    var grouped = groupRow.classList.contains('group');
    var link = dom.qs('a:last-of-type', infoEl);
    var year = (/\d{4}/.exec(artistPage ? infoEl.textContent :
                infoEl.lastChild.textContent) || '')[0];
    var snatches = groupStats[sortedIds[i]].toString().replace(/\B(?=\d{3}\b)/, ',');
    var staffPick = pref.markPicks &&
                    !!dom.qs('a[href*="taglist=staff.picks"]', infoEl.parentNode);

    var suffix = grouped && year ? ' (' + year + ')' : '';
    if (artistPage) suffix += ' [' + pref.relTypes[relType].slice(1) + ']';
    if (staffPick) suffix += '*';

    var newLink = dom.mk('a', {href: pref.noScroll ? link.href : '#group_' + sortedIds[i]},
        dom.mk('span', {dir: 'ltr'}, link.textContent), suffix);

    if (link.previousElementSibling && !(filt && relType == '19')) {
      prependArtistsTo(link.previousSibling, newLink);
    } else if (!artistPage && grouped) {
      dom.ins('VA - ', newLink.firstChild);
    }

    dom.app(tab, dom.mk('tr', numRows > pref.numInit ? {className: 'mp_expandrow'} : null,
      dom.mk('td', null, numRows + '. ', newLink),
      dom.mk('td', {className: 'number_column'}, snatches)));
  }


  var expLink = dom.cl('mp_expandlink', tab)[0];
  if (numRows > pref.numInit) {
    expLink.classList.remove('hidden');
    expLink.addEventListener('click', onClickExpand, false);
  }

  if (artistPage) {
    var filtLink = dom.mk('a', {className: 'brackets', href: '#'},
                          filt ? 'Remove filter' : 'Apply filter');
    expLink.parentNode.appendChild(filtLink);
    filtLink.addEventListener('click', onClickFilter, false);
    setTitle(filtLink, filt ? 'Include all releases' : 'Only include the artist\'s own releases');
  }


  dom.ins(tab, dom.qs('.torrent_table'));
  mainColumn.classList[filt ? 'add' : 'remove']('mp_filtered');
}



var artistPage = window.location.pathname == '/artist.php';
var artistName = artistPage && document.title.slice(0, -11);
var mainColumn = dom.qs('.main_column');

if ((artistPage || pref.doCollages) && pref.numTotal > 0 && dom.qs('.torrent_table')) {
  dom.app(document.head, dom.mk('style', {type: 'text/css'}, [
    '.mp_table { width: 100%; }',
    '.mp_table td:first-child { width: 85% !important; }',
    '.mp_table .brackets { float: right; font-weight: normal !important; }',

    '.mp_collapsed .mp_expandrow,',
    '.mp_collapsed .mp_expandlink > span:last-child,',
    '.main_column:not(.mp_collapsed) .mp_expandlink > span:first-child,',
    '.mp_filtered #mp_table_0,',
    '.main_column:not(.mp_filtered) #mp_table_1 { display: none; }'
  ].join('')));
  mainColumn.classList.add('mp_collapsed');
  makeList(artistPage ? +pref.filter : 0);
}

if (pref.addForumLink && artistName) {
  var aLink = dom.qs('.linkbox > a[href$="#info"]') || dom.qs('.linkbox > a');
  if (aLink) {
    var searchUrl = 'forums.php?action=search&threadid=18703&search=' +
        encodeURIComponent(artistName).replace(/%20/g, '+');
    dom.ins(dom.mk('a', {href: searchUrl, className: 'brackets'}, 'Search forum'), aLink);
    dom.ins(' ', aLink);
  }
}

// ==UserScript==
// @name           redacted.ch :: Group Top 10
// @namespace      passtheheadphones.me
// @description    Groups torrents from the same album in Top 10 lists
// @version        1.1
// @include        https://redacted.ch/top10.php*
// @include        https://redacted.ch/user.php*action=edit*
// @exclude        https://redacted.ch/top10.php*type=users*
// @exclude        https://redacted.ch/top10.php*type=tags*
// @exclude        https://redacted.ch/top10.php*type=votes*
// @exclude        https://redacted.ch/top10.php*type=lastfm*
// @exclude        https://redacted.ch/top10.php*type=donors*
// @exclude        https://redacted.ch/top10.php*type=request_contest*
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/25537/redactedch%20%3A%3A%20Group%20Top%2010.user.js
// @updateURL https://update.greasyfork.org/scripts/25537/redactedch%20%3A%3A%20Group%20Top%2010.meta.js
// ==/UserScript==


function main() {

  function doTop10() {

    function doTable(table) {

      if (!table.rows[1].classList.contains('torrent')) return; // Server busy/Nothing found


      // Get sorting criterion

      var columns = { Data: 4, Snatched: 5, Seeded: 6, Active: 8 };
      var head = table.previousElementSibling.firstChild;
      var sortCol = columns[head.textContent.trim().split(' ')[3]];


      // Populate arrays

      var allRows = {}, ids = [];
      var bookmarks = dom.qsa('.add_bookmark, .remove_bookmark', table);
      var rl = table.rows.length;
      for (var i = 1; i < rl; ++i) {
        var row = table.rows[i];
        var id = bookmarks[i-1].firstElementChild.id.split('_')[2];
        if (!(id in allRows)) {
          ids.push(id);
          allRows[id] = [row.cloneNode(true)];
        }
        allRows[id].push(row);
      }


      // Sum up stats

      for (var i = ids.length; i--; ) {
        var rows = allRows[ids[i]], rl = rows.length, stats = [];
        if (rl > 2) {

          for (var j = 1; j < rl; ++j) {
            if (rows[j].classList.contains('snatched_torrent')) {
              rows[0].classList.add('snatched_torrent'); // do this now to save us a loop later
            }

            for (var c = 3; c < 9; ++c) {
              stats[c] = (stats[c] || 0) + cell.getNum(rows[j], c);
            }
          }

          for (var c = 3; c < 9; ++c) {
            if (options.avgStats) {
              stats[c] = Math.round(stats[c] / (rl-1));
            }
            cell.setNum(rows[0], c, stats[c]);
          }

        }
      }


      // Sort rows, format them, and rebuild table

      ids.sort(function (a, b) {
        return cell.getNum(allRows[b][0], sortCol) - cell.getNum(allRows[a][0], sortCol);
      });

      var formatRegex = /\[(.+?)[\]\s\/-]*$/;
      var rows, row, rowClasses = ['rowa', 'rowb'];
      var tbod = dom.mk('tbody', null, table.rows[0]);
      var numGroups = Math.min(ids.length, maxGroups);
      var il = options.useFilter ? ids.length : numGroups;

      for (var i = 0; i < il; ++i) {
        var rows = allRows[ids[i]], rl = rows.length, snatched = false;

        for (var j = 0; j < rl; ++j) {
          row = rows[j];
          var infoDiv = dom.cl('group_info', row)[0];
          var strongs = dom.tag('strong', infoDiv);
          var link = strongs[0].lastElementChild;
          var dl = strongs[0].previousElementSibling;


          if (j === 0) {

            // Modify grouprow

            row.cells[0].firstElementChild.textContent = i + 1;
            infoDiv.removeChild(dl);
            var node = strongs[1]; // "Snatched!" / "Reported"
            while (node && (node.nodeType == 3 || node.nodeName == 'STRONG')) {
              var nextNode = node.nextSibling;
              infoDiv.removeChild(node);
              node = nextNode;
            }
            strongs[0].nextSibling.textContent = rl > 2 ? ' (' + (rl - 1) + ') ' : ' ';
            link.href = link.pathname.substr(1) + link.search.split('&')[0];

            if (row.classList.contains('snatched_torrent')) {
              row.className = row.className.replace('snatched_torrent', 'snatched_group');
              snatched = true;
            }

            if (link.className.indexOf('wcds_') > -1) {
              link.className = link.className.replace(/wcds_[^b]\w+/g, '');
            }


          } else {

            // Modify torrentrow

            var format = strongs[0].nextSibling.textContent.match(formatRegex);
            if (format) link.textContent = format[1];
            if (strongs[1]) { // "Snatched!" / "Reported"
              for (var k = 1; k < strongs.length; ++k) {
                dom.app(link, ' / ', strongs[k]);
              }
            }

            infoDiv = infoDiv.cloneNode(false);
            dom.app(infoDiv, dl, ' \u00BB ', link);

            if (!options.expandAll) row.style.display = 'none';
            row.className += ' gt10_torrent' + (snatched ? ' snatched_group' : '');
            row.cells[1].classList.remove('cats_col');
            cell.setText(row, 1, cell.getText(row, 0));
            cell.setText(row, 0, '');
            cell.setText(row, 2, '');
            dom.app(row.cells[2], infoDiv);

            link.classList.remove('group_snatched');
            link.classList.remove('wcds_bookmark');

          }

          row.className = row.className.replace(rowClasses[(i+1)%2], rowClasses[i%2]);
          if (i >= maxGroups) row.classList.add('gt10_filtered');
          dom.app(tbod, row);

        }
      }

      table.replaceChild(tbod, table.firstElementChild);
      table.addEventListener('click', makeClickHandler(), false);

      head.textContent = head.textContent.replace(/\d+/, numGroups).
          replace('Torrents', 'Album' + (numGroups !=1 ? 's' : ''));

    } // doTable



    function makeClickHandler() {

      var expanded = options.expandAll;

      return function (e) {
        var clickedRow = dom.par(e.target, 'tr', true);
        if (!clickedRow) return; // clicked the table border

        // Column header: expand/collapse all groups
        if (clickedRow.rowIndex === 0) {
          var disp = expanded ? 'none' : '';
          var rows = dom.cl('gt10_torrent', clickedRow.parentNode);
          for (var i = rows.length; i--; ) {
            rows[i].style.display = disp;
          }
          expanded = !expanded;
          return;
        }

        var cell = dom.par(e.target, 'td', true);
        if (!cell || cell.cellIndex > 1) return;

        // Expand/collapse clicked group
        for (var gRow = clickedRow; gRow.classList.contains('gt10_torrent');
             gRow = gRow.previousSibling);
        var row = gRow.nextSibling;
        var disp = row.style.display ? '' : 'none';
        while (row && row.classList.contains('gt10_torrent')) {
          row.style.display = disp;
          row = row.nextSibling;
        }
      };
    }



    function replaceTable(num, newTable) {
      var oldTable = dom.cl('torrent_table')[num];
      oldTable.previousElementSibling.className = 'gt10_loaded';
      newTable.className = oldTable.className;
      oldTable.parentNode.replaceChild(newTable, oldTable);
      doTable(newTable);

      var links = dom.qsa('a[class*="wcds_"], .group_snatched', oldTable);
      for (var i = links.length; i--; ) {
        var newLink = dom.qs('a[href$="' + links[i].search + '"]', newTable);
        if (newLink) newLink.className = links[i].className;
      }
    }



    function loadTable(num) {

      function onLoad(response) {
        if (response.status == '200') {
          var match = /<table.*?torrent_table.*?>([\s\S]*?)<\/table>/.
              exec(response.responseText);

          if (match) {
            var newTable = dom.mk('table', { innerHTML: match[1] });
            if (newTable.rows.length > 2) {
              replaceTable(num, newTable);
              if (options.useFilter && filter.text()) filter.apply();
              cache.set(num, match[1]);
              return;
            }
          }
        }
        onError();
      }

      function onError() {
        dom.tag('h3')[num].className = 'gt10_failed';
      }

      var listTypes = ['day', 'week', 'month', 'year', 'overall', 'snatched', 'data', 'seeded'];
      var url = ['https://', wl.host, '/top10.php?type=torrents&limit=100&details=',
                 listTypes[num]].join('');

      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        headers: { Accept: 'text/xml' },
        onload: onLoad,
        onerror: onError
      });
    }



    var convert = function () {
      function toNum(val, isSize) {
        return isSize ? toBytes(val) : remComma(val);
      }
      function fromNum(num, isBytes) {
        return isBytes ? toSize(num) : insComma(num);
      }
      function insComma(num) {
        return num.toString().replace(regex, ',');
      }
      function remComma(str) {
        return parseFloat(str.replace(',', ''));
      }
      function toSize(bytes) {
        if (bytes <= 0) return '0 B';
        var e = Math.min(Math.floor(Math.log(bytes)/Math.log(1024)), 4);
        var sizeNum = (Math.round(bytes * 1000 / Math.pow(1024, e)) / 1000).
                       toFixed(Math.max(e-1, 2)); // use three decimals for TB
        return insComma(sizeNum) + ' ' + prefixes.charAt(e).replace(' ', '') + 'B';
      }
      function toBytes(size) {
        var e = prefixes.indexOf(size.charAt(size.length-2));
        return Math.round(remComma(size) * Math.pow(1024, e));
      }
      var prefixes = ' KMGT', regex = /\B(?=(\d{3})(?!\d))/;
      return { textToNum: toNum, numToText: fromNum };
    }();


    var cell = {
      getText: function (row, c) {
        return row.cells[c].textContent;
      },
      setText: function (row, c, txt) {
        row.cells[c].textContent = txt;
      },
      getNum: function (row, c) {
        return convert.textToNum(this.getText(row, c), c < 5);
      },
      setNum: function (row, c, num) {
        this.setText(row, c, convert.numToText(num, c < 5));
      }
    };



    var aCell = dom.qs('.torrent > td');
    var cellStyle = aCell && getComputedStyle(aCell);
    if (cellStyle && cellStyle.borderBottomStyle != 'none') {
      var borderStyle = [cellStyle.borderBottomWidth, cellStyle.borderBottomStyle,
                         cellStyle.borderBottomColor].join(' ');
      GM_addStyle([
        '.torrent_table { border-bottom: ', borderStyle, '; }',
        '.torrent, .torrent > td { border-top: ', borderStyle, '; }'
      ].join(''));
    }

    GM_addStyle([
      cellStyle && parseInt(cellStyle.fontWeight, 10) < 400 ? '' :
          '.gt10_torrent, .gt10_torrent a { font-weight: normal !important; }',
      '.torrent, .torrent > td { border-bottom-style: none !important; }',
      '.gt10_torrent, .gt10_torrent > td { border-top-style: none !important; }',
      '.colhead, .torrent > td:first-child, .torrent > td:first-child + td { cursor: pointer; }',
      '.cats_col { min-width: 18px; }'
    ].join(''));

    var ssLink = dom.qs('link[rel="stylesheet"][title]', document.head || dom.tag('head')[0]);
    if (ssLink && ssLink.title.indexOf('mono') > -1) {
      GM_addStyle('.gt10_torrent span { float: right; }');
    }


    var tables = dom.cl('torrent_table');
    var maxGroups = tables.length > 1 ? 10 : 250;
    var advanced = wl.search.indexOf('advanced=1') > -1;
    for (var i = 0, il = tables.length; i < il; ++i) {
      doTable(tables[i]);
    }


    // Load more?
    if (tables.length > 1 && !advanced) {
      var queueTable = function () {
        var delay = 500;
        return function (num) {
          setTimeout(function () { loadTable(num); }, delay);
          delay += 1500;
        };
      }();

      GM_addStyle([
        '.gt10_loading, .gt10_loading + .torrent_table td { cursor: progress !important; }',
        '.gt10_loading_status { float: right; margin: 2px 10px 0 0; }',
        '.gt10_loaded > .gt10_loading_status, .gt10_loading .important_text,',
            '.gt10_failed .important_text_alt { display: none; }'
      ].join(''));

      for (var i = 0, il = options.getMore.length; i < il; ++i) {
        if (options.getMore[i]) {

          if (cache.test(i)) {
            replaceTable(i, dom.mk('table', { innerHTML: cache.get(i) }));

          } else {
            var head = dom.tag('h3')[i];
            head.className = 'gt10_loading';
            dom.app(head,
              dom.mk('small', {className: 'gt10_loading_status'},
                dom.mk('strong', {className: 'important_text_alt'}, 'Loading...'),
                dom.mk('strong', {className: 'important_text'}, 'Failed')));
            queueTable(i);
          }
        }
      }
    } // load more



    if (!options.useFilter) return;

    var filter = {
      textField: dom.mk('input', {type: 'text', size: 75, spellcheck: false}),
      text: function () { return this.textField.value.trim(); },

      getWords: function () {
        return this.text().toLowerCase().split(/[ ,]+/).
            map(function (word) {
              var prefix = word.indexOf('!') > -1 ? '!' : '';
              if (word.indexOf('*') > -1) prefix += '*';
              return prefix ? prefix + word.replace(/[!*]/g, '') : word;
            }).
            filter(function (word) {
              return /[^!*]/.test(word);
            });
      },

      applyDelayed: function () {
        clearTimeout(filter.timer);
        filter.timer = setTimeout(filter.apply, 400);
      },
      clear: function () {
        filter.textField.value = '';
        filter.apply();
      },
      saveDefault: function () {
        options = stor.getOptions();
        options.filter = filter.getWords().join(', ');
        stor.set('gt10_options', options);
      },
      restoreDefault: function () {
        if (typeof options.filter == 'string' && options.filter != filter.text()) {
          filter.textField.value = options.filter;
          filter.apply();
        }
      },

      apply: function () {

        function isFiltered(row) {

          function testWords(words) {
            for (var i = words.length; i--; ) {
              var fuzzy = words[i][0] == '*';
              var word = fuzzy ? words[i].slice(1) : words[i];
              var tags = fuzzy ? tagStr : tagArr;
              if (tags.indexOf(word) > -1) return true;
            }
            return false;
          }

          var tagStr = dom.cl('tags', row)[0].textContent.trim();
          var tagArr = tagStr.split(/[ ,]+/);

          if (testWords(excl)) return true;
          if (testWords(incl)) return false;
          return incl.length > 0;
        }


        var incl = [], excl = [];
        var words = filter.getWords();
        for (var i = words.length; i--; ) {
          if (words[i][0] != '!') incl.push(words[i]);
          else excl.push(words[i].slice(1));
        }

        var hide, numFiltered = 0;
        var groupNum = 0, numShown = 0;
        var cls = ['rowa', 'rowb'];
        var rows = dom.cl('torrent');

        for (var i = 0, il = rows.length; i < il; ++i) {
          if (!rows[i].classList.contains('gt10_torrent')) { // a group row
            if (rows[i].rowIndex == 1) groupNum = numShown = 0;
            ++groupNum;
            hide = numShown >= maxGroups || isFiltered(rows[i]);
            if (!hide) ++numShown;
            else if (groupNum <= maxGroups) ++numFiltered;
          }

          if (hide) {
            rows[i].classList.add('gt10_filtered');
          } else {
            rows[i].classList.remove('gt10_filtered');
            rows[i].className = rows[i].className.replace(cls[numShown%2], cls[(numShown+1)%2]);
          }
        }

        dom.id('gt10_numfilt').textContent = numFiltered ? '-' + numFiltered : '';
      }
    };


    GM_addStyle([
      '.gt10_filtered { display: none; }',
      '#gt10_numfilt, #gt10_buttons > input:last-child { margin-left: 14px; }'
    ].join(''));

    var form = dom.mk('form', {className: 'search_form'},
      dom.mk('table', {className: 'layout border', width: '100%',
                       cellSpacing: 1, cellPadding: 6, border: 0},
        dom.mk('tbody', null,
          dom.mk('tr', null,
            dom.mk('td', {className: 'label'}, 'Tag filter: '),
            dom.mk('td', {className: 'ft_taglist'},
              filter.textField,
              dom.mk('strong', {id: 'gt10_numfilt'}))),
          dom.mk('tr', null,
            dom.mk('td', {id: 'gt10_buttons', className: 'center', colSpan: 2},
              dom.mk('input', {type: 'button', value: 'Clear'}), ' ',
              dom.mk('input', {type: 'button', value: 'Restore'}), ' ',
              dom.mk('input', {type: 'button', value: 'Make default'}))))));

    var elem = dom.cl('header')[0].nextElementSibling;
    elem.parentNode.insertBefore(form, elem);
    form.addEventListener('submit', function (e) { e.preventDefault(); });

    // Hide regular elite+ filter box, add toggle
    var oldForm = form.nextElementSibling;
    if (oldForm.tagName == 'FORM') {
      dom.togCl('hidden', advanced ? form : oldForm);
      var toggleLink = dom.mk('a', {className: 'brackets', href: '#'}, 'Toggle filterbox');
      var linkBox = oldForm.nextElementSibling;
      linkBox.insertBefore(toggleLink, linkBox.firstChild);
      toggleLink.addEventListener('click', function (e) {
        e.preventDefault();
        dom.togCl('hidden', form, oldForm);
      }, false);
    }

    var buttons = dom.id('gt10_buttons');
    buttons.children[0].addEventListener('click', filter.clear, false);
    buttons.children[1].addEventListener('click', filter.restoreDefault, false);
    buttons.children[2].addEventListener('click', filter.saveDefault, false);
    filter.textField.addEventListener('input', filter.applyDelayed, false);

    if (!advanced) filter.restoreDefault();

  } // doTop10




  function doSettings() {

    function makeOption(name, descr) {
      var id = name.split('_'), opt = options[id[0]];
      if (id[1]) opt = opt[+id[1]];
      return dom.mk('li', null,
        dom.mk('label', null,
          dom.mk('input', {id: 'gt10_' + name, type: 'checkbox', checked: opt}),
          ' ' + descr));
    }

    function updateBoxes() {
      var boxes = dom.tag('input', newRow);
      for (var i = 1, il = boxes.length; i < il; ++i) {
        boxes[i].disabled = !options.groupEm;
      }
    }


    GM_addStyle([
      '#gt10_options { position: relative; }',
      '#gt10_options p { margin: 8px 5px 6px; }',
      '#gt10_options p > span { font-size: 0.8em; }',
      '#gt10_saving { position: absolute; right: 5px; top: 0; }'
    ].join(''));

    var table = dom.id('torrent_settings');
    var thatRow = dom.par(dom.id('showtags'), 'tr') || table.rows[9];

    var newRow = dom.mk('tr', null,
      dom.mk('td', {className: 'label'},
        dom.mk('strong', null, 'Top 10')),
      dom.mk('td', null,
        dom.mk('div', {id: 'gt10_options'},
          dom.mk('ul', {className: 'options_list nobullet'},
            makeOption('groupEm', 'Group torrents'),
            makeOption('expandAll', 'Expand groups by default'),
            makeOption('avgStats', 'Use averages in group stats'),
            makeOption('useFilter', 'Enable real-time tag filtering')),
          dom.mk('p', null,
            'On the Top 10 index page, make the following lists more accurate: ',
            dom.mk('a', {className: 'brackets', href: '#', onclick: function () {
              dom.togCl('hidden', dom.par(this).nextSibling, this.firstChild, this.lastChild);
              return false;
            }},
              dom.mk('span', null, 'Show'),
              dom.mk('span', {className: 'hidden'}, 'Hide'))),
          dom.mk('div', {className: 'hidden'},
            dom.mk('ul', {className: 'options_list nobullet'},
              makeOption('getMore_0', 'Most Active Torrents Uploaded in the Past Day'),
              makeOption('getMore_1', 'Most Active Torrents Uploaded in the Past Week'),
              makeOption('getMore_2', 'Most Active Torrents Uploaded in the Past Month'),
              makeOption('getMore_3', 'Most Active Torrents Uploaded in the Past Year')),
            dom.mk('p', null,
              dom.mk('span', null,
                'Selected lists will automatically load the top 100 torrents.'))),
          dom.mk('strong', {id: 'gt10_saving', className: 'important_text_alt hidden'},
            'Saving settings...'))));

    updateBoxes();
    table.tBodies[0].insertBefore(newRow, thatRow);

    var timer;
    newRow.addEventListener('change', function (e) {
      options = stor.getOptions();
      var id = e.target.id.split('_');

      if (id[2]) options[id[1]][+id[2]] = e.target.checked;
      else options[id[1]] = e.target.checked;
      if ('groupEm' == id[1]) updateBoxes();

      dom.id('gt10_saving').classList.remove('hidden');
      clearTimeout(timer);
      timer = setTimeout(function () {
        dom.id('gt10_saving').classList.add('hidden');
      }, 900);

      stor.set('gt10_options', options);

    }, false);


    cache.purgeOld();

  } // doSettings





  var stor = {
    get: function (key, def) {
      var val = window.localStorage && localStorage.getItem(key);
      return val ? JSON.parse(val) : def;
    },
    set: function (key, val) {
      try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
    },
    getOptions: function () {
      var opt = this.get('gt10_options', { groupEm: true, expandAll: false, avgStats: false,
                                           useFilter: true, getMore: [true, true] });
      if (typeof opt.useFilter == 'undefined') opt.useFilter = true;
      if (opt.getMore.length > 4) opt.getMore = opt.getMore.slice(0, 4);
      return opt;
    }
  };


  var dom = {
    id: function (id) { return document.getElementById(id); },
    qs: function (s, p) { return (p || document).querySelector(s); },
    qsa: function (s, p) { return (p || document).querySelectorAll(s); },
    cl: function (cl, p) { return (p || document).getElementsByClassName(cl); },
    tag: function (tag, p) { return (p || document).getElementsByTagName(tag); },
    par: function (elem, tag, inclSelf) {
      if (!inclSelf) elem = elem && elem.parentNode;
      while (elem && tag && elem.nodeName !== tag.toUpperCase()) elem = elem.parentNode;
      return elem;
    },
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
    togCl: function (cl, var_args) {
      for (var i = 1, il = arguments.length; i < il; ++i) {
        arguments[i].classList.toggle(cl);
      }
    }
  };


  var cache = {
    data: stor.get('gt10_cache', []),

    get: function (num) {
      return this.expand(this.data[num].html);
    },

    set: function (num, htm) {
      this.data[num] = { time: Math.floor(Date.now() / 60000), html: this.shorten(htm) };
      stor.set('gt10_cache', this.data);
    },

    test: function (num) {
      return this.data[num] && this.data[num].time + 15 > Date.now() / 60000;
    },

    pats: [
      /<strong><a href="artist\.php\?id=([\d]+)" dir="ltr">/g,
      /<a href="torrents\.php\?([^"]+)" class="tooltip" title="View torrent" dir="ltr">/g,
      /<a href="torrents\.php\?taglist=([^"]+)">[^<]+<\/a>/g,
      /<td class="number_column">([\d]+)<\/td>/g,
      /<td class="number_column nobr">([^<]+)<\/td>/g,
      new RegExp([
        '<span class="add_bookmark float_right"> <a href="#" id="bookmarklink_torrent_([\\d]+)" ',
        'class="bookmarklink_torrent_[\\d]+ brackets" onclick="Bookmark\\(\'torrent\', [\\d]+, ',
        '\'Remove bookmark\'\\); return false;">Bookmark</a> </span> <div class="tags"'
      ].join(''), 'g'),
      new RegExp([
        '<div class="group_info clear"> <span><a href="torrents\\.php\\?action=download&amp;',
        'id=([^"]+)" title="Download" class="brackets tooltip">DL</a></span>'
      ].join(''), 'g'),

      [new RegExp(['<td class="big_info"> <div class="group_image float_left clear"> ',
          '<img src="[^"]+" width="90" height="90" alt="Cover" ',
          'onclick="lightbox.init\\(\'([^\']+)\', 90\\)" /> </div>'].join(''), 'g'),
      function (m, p) {
        return ['<td class="big_info"> <div class="group_image float_left clear"> <img src="',
            cache.thumb(p), '" width="90" height="90" alt="Cover" onclick="lightbox.init(\'',
            p, '\', 90)" /> </div>'].join('');
      }]
    ],

    thumb: function (src) {
      var suffix = /ptpimg(?!.*_thumb)/.test(src) ? '_thumb' :
                   /imgur.*\/(\w{5}|\w{7})\.\w+$/.test(src) ? 'm' : '';
      return src.replace(/\.\w+$/, suffix + '$&');
    },

    shorten: function (htm) {
      htm = htm.trim().replace(/\s{2,}/g, ' ');
      for (var i = this.pats.length; i--; ) {
        var regex = Array.isArray(this.pats[i]) ? this.pats[i][0]: this.pats[i];
        htm = htm.replace(regex, '<' + i + '=$1>');
      }
      return htm;
    },

    expand: function (htm) {
      var p = /\(?\[[^\]]+\]\+\)?/g;
      for (var i = this.pats.length; i--; ) {
        var replacer = Array.isArray(this.pats[i]) ? this.pats[i][1] :
            this.pats[i].toString().slice(1, -2).replace(p, '$$1').replace(/\\/g, '');
        htm = htm.replace(new RegExp('<' + i + '=([^>]+)>', 'g'), replacer);
      }
      return htm;
    },

    purgeOld: function () {
      var updated = false;
      for (var i = 0; i < this.data.length; ++i) {
        if (this.data[i] && !this.test(i)) {
          delete this.data[i];
          updated = true;
        }
      }
      if (updated) stor.set('gt10_cache', this.data);
    }
  };


  var options = stor.getOptions();

  var wl = window.location;
  if (wl.pathname == '/user.php') doSettings();
  else if (options.groupEm) doTop10();


} // main


(function hideBody() {
  var head = document.head || document.getElementsByTagName('head')[0];
  if (head) GM_addStyle('#top10:not(.gt10_ready) { display: none; }');
  else setTimeout(hideBody, 100);
})();

document.addEventListener('DOMContentLoaded', function () {
  try { main(); }
  finally { document.body.classList.add('gt10_ready'); }
}, false);

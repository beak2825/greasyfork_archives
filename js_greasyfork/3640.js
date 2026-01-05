// ==UserScript==
// @name           Sanskrit Tools - Toolbar
// @namespace      stgeorge
// @description    Sanskrit Language Tools - Quick access to Sanskrit dictionary, thesarus, news and other tools, on Firefox and Chrome browsers.
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @match          *://*/*
// @version        3.9
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/3640/Sanskrit%20Tools%20-%20Toolbar.user.js
// @updateURL https://update.greasyfork.org/scripts/3640/Sanskrit%20Tools%20-%20Toolbar.meta.js
// ==/UserScript==

/*
 * This script does three things:
 * On the sanskrit dictionary site:
 *  It adds a link (a triangle icon) to each result row, that when
 *    pressed, takes you to the definition of the word in that row.
 *  It adds a (Sanskrit sa) icon to the bottom right of the page.
 *    Clicking the icon sorts the dictionary entries.
 * On the grammar site:
 *  It fixes some styles to make it look a tad less garish.
 * On other sites:
 *  It adds a (Sanskrit sa) icon to the bottom right of the page.
 *    Clicking the icon brings up a toolbar at the top of the page.
 *    The toolbar contains some useful Sanskrit-related links.
 *    If the auto-dictionary is checked in the toolbar,
 *    double-clicking a word launches the Sanskrit dictionary in
 *    another window/tab with the selected word.
 */

(() => {
  let $j = jQuery.noConflict();
  let DEBUG = false;

  let SANSKRIT_SITE_OLD = 'spokensanskrit.org';
  let SANSKRIT_SITE_NEW = 'learnsanskrit.cc';

  // === Dictionary site stuff ===

  let SANSKRIT_SITES = [SANSKRIT_SITE_OLD,SANSKRIT_SITE_NEW];

  let ALLOW_ANCHORS = [
    'sanskrit.uohyd.ernet.in/cgi-bin/scl/SHMT/generate.cgi',
  ];

  let verbMatch = /(verb)\s*(.*)/;
  let verbRootMatch = /\[\s*(.*)\s*\]/;
  let verbClassMatch = /\s*([0-9]+)\s*/g;
  let nounMatch = /\b([fmn](?=\.))/g;
  let nounRootMatch = /^\s*(.*)\s*$/;
  let vurl = 'http://sanskrit.inria.fr/cgi-bin/SKT/sktconjug.cgi?lex=SH&q=%Q%&t=KH&c=%C%&font=deva';
  let nurl = 'http://sanskrit.inria.fr/cgi-bin/SKT/sktdeclin.cgi?lex=SH&q=%Q%&t=KH&g=%G%&font=deva';
  let genders = { f: 'Fem', n: 'Neu', m: 'Mas' };
  let gender_names = { f: 'feminine', n: 'neuter', m: 'masculine' };

  let dictTable = null;
  let dictTableRows = null;
  let dictTableRowsSorted = null;
  let tableSorted = false;

  function dictCheck() {
    for (let i = 0; i < SANSKRIT_SITES.length; ++i) {
      let s = SANSKRIT_SITES[i];
      if (document.URL.indexOf(s) != -1)
        return true;
    }
  }

  function dictInit() {
    dictTable = $j('#results');
    _dictObserve(dictTable, (m) => {
      let allRows = $j('tr.normalrow,tr.redrow');
      let firstRow = allRows.first();
      _debug('observer called');
      if (firstRow.hasClass('processed') === false) {
        _debug('observer processing');
        firstRow.addClass('processed');
        _dictSetupSorting(allRows);
        _dictAddGrammarLinks(allRows);
      }
    });
  }

  function _dictObserve(ele, cb) {
    let observer = new MutationObserver(function(mutations) {
      setTimeout(cb(mutations), 100);
    });
    observer.observe(ele[0], { 
      childList: true, 
    });
  }

  function _dictSetupSorting(rows) {
    dictTableRows = rows;
    dictTableRows.wrapAll('<tbody id="resultsbody">');
    dictTableRowsSorted = $j.extend([], dictTableRows);
    dictTableRowsSorted.sort(function(a, b) {
      let val1 = $j(a).children('td').first().text();
      let val2 = $j(b).children('td').first().text();
      return val1.localeCompare(val2);
    });
  }

  function _dictToggleSorted() {
    let rows = tableSorted ? dictTableRows : dictTableRowsSorted;
    let rb = $j('#resultsbody');
    $j.each(rows, function(index, row) {
      rb.append(row);
    });
    tableSorted = !tableSorted;
  }

  function dictFixSuggestBox() {
    let ans = $j('#cont_answer');
    ans.css({
      'top':'500px',
      'left':'50%',
      'background': 'transparent',
    });
  }

  function _dictAddGrammarLinks(rows) {
    let line = 1;
    rows.each(function() {
      let row = $j(this);
      // Each row is of the form:
      // sans_text grammar_info translit_text meaning
      let col = row.children().first(); let sansText = col.text().trim();
      col = col.next(); let grammarInfo = col.text().trim();
      col = col.next(); let transText = col.text().trim();
      _debug("line " + (line++) + "='" + sansText + "' '" + grammarInfo + "' '" + transText + "'");
      let links = [];
      if (_dictMatchVerb(sansText, grammarInfo, transText, links) ||
        _dictMatchNoun(sansText, grammarInfo, transText, links)) {
        _dictMakeURLs(row, links);
      }
      _debug('-----');
    });
  }

  function _dictMatchVerb(sansText, grammarInfo, transText, links) {
    // Grammar is of the form: verb N 
    _debug('verb: matching ' + grammarInfo + ' with verb');
    let a = grammarInfo.match(verbMatch);
    if (a && a[1] == 'verb') {
      // transText is of the form xlit_word (xlit_root).
      // We want the root.
      _debug('verb: matching ' + transText + ' with verbroot 1');
      let b = transText.match(verbRootMatch);
      if (!b || !b[1]) return false;
      b[1] = b[1].trim().replace(/[\s-]/g, "")
      _debug('verb: matching ' + transText + ' with verbroot 2');
      if (b[1].match(/[^A-Za-z]/)) return false;
      let n;
      // For verbs, see if grammar_info has the gaNA info.
      if (a[2])
        n = a[2].trim().match(verbClassMatch);
      if (!(n && n[0])) {
        return false;
      }
      // At this point, b[1] is the transliterated verb root,
      // sansText is the devangari verb root, and n the gaNa.
      _debug('verb=' + b[1]);
      _debug('ganas=' + n);
      for (let i = 0; i < n.length; ++i) {
        links.push({
          tooltip: 'Inflections for ' + a[1] + '(' + n[i].trim() + ') ' + sansText,
          url: vurl.replace('%Q%', b[1]).replace('%C%', n[i].trim()),
          sym: '&rtrif;',
          target: 'l_grammar',
        });
      }
      return true;
    }
    return false;
  }

  function _dictMatchNoun(sansText, grammarInfo, transText, links) {
    // grammar, in turn, is of the forms: m./f./n./adj. etc (for nouns)
    _debug('noun: matching ' + grammarInfo + ' with noun');
    let a = grammarInfo.match(nounMatch);
    if (!(a && a[0])) return false;
    _debug('noun: matching ' + transText + ' with nounroot 1');
    let b = transText.match(nounRootMatch);
    if (!b || !b[1]) return false;
    b[1] = b[1].trim().replace(/[\s-]/g, "")
    _debug('noun: matching ' + transText + ' with nounroot 2');
    if (b[1].match(/[^A-Za-z]/)) return false;
    // At this point, b[1] is the xlit noun, sansText is the
    // devanagari noun, and a is one or more lingas.
    _debug('noun=' + b[1]);
    _debug('lingams=' + a);
    if (a.length > 0) {
      for (let i = 0; i < a.length; ++i) {
        links.push({
          url: nurl.replace('%Q%', b[1]).replace('%G%', genders[a[i]]),
          tooltip: 'Inflections for ' + gender_names[a[i]] + ' noun ' + sansText,
          sym: '&rtrif;',
          target: 'l_grammar',
        });
      }
      return true;
    }
    return false;
  }

  function _dictMakeURLs(row, links) {
    let ltd = row.children().first().children('#word0').first();
    ltd.attr('valign','top');
    ltd.attr('align', 'left');
    let html = '';
    for (let i in links) {
      l = links[i];
      html +=
        '<a data-id="' +i+
          '" target=_new class="def stil4" style="text-decoration:none;color: #96290e;font-weight:bold;" href="' +
          l.url + '" title="' + l.tooltip + '">'+l.sym+'</a>';
    }
    _debug("link: " + l.url + " --> " + l.tooltip);
    ltd.before('<div style="float:left; padding-right:3px">'+html+'</div>');
    return true;
  }

  // === Grammar site stuff ===

  function grammarCheck() {
    return (document.URL.indexOf('sanskrit.inria.fr') != -1);
  }

  function grammarFixStyles() {
    $j(['.bandeau','.cyan_cent','.deep_sky_cent']).each(function(k,v) {
      $j(v).css({'background':'#eeeeff'});
    });
    $j(['.chamois_back','.inflexion']).each(function(k,v) {
      $j(v).css({'background':'white'});
    });
    $j('.devared').css({'color':'black'});
    $j('.red').css({'color':'mediumblue'});
  }

  // === Toolbar stuff ===

  // Sites to ignore (we won't add the toolbar here).
  let IGNORES = [
    'mail.yahoo.com',
    'groups.yahoo.com',
    SANSKRIT_SITE_OLD,
    SANSKRIT_SITE_NEW,
  ];

  // Toolbar items to add. Format:
  // [HK-encoded/English name, URL, target_window, devanagari name]
  let TOOLBAR_ITEMS = [
    [ 'vArtAvaliH', 'https://www.youtube.com/playlist?list=PLxx0m3vtiqMZGmsUEVeTAuWIXqc9fTMHy', 'l_news',
      '&#2357;&#2366;&#2352;&#2381;&#2340;&#2366;&#2357;&#2354;&#2367;&#2307;', 'Indian Sanskrit Program YouTube Channel'],
    [ 'samprati vArtAH', 'http://samprativartah.in/', 'l_mag2',
      '&#2360;&#2350;&#2381;&#2346;&#2381;&#2352;&#2340;&#2367;&#2357;&#2366;&#2352;&#2381;&#2340;&#2366;&#2307;', 'Indian Daily Sanskrit News'],
    [ 'sudharmA', 'http://epapersudharmasanskritdaily.in/', 'l_mag3',
      '&#2360;&#2369;&#2343;&#2352;&#2381;&#2350;&#2366;', 'Sanskrit Magazine'],
    [ 'sambhASaNa sandezaH', 'http://www.sambhashanasandesha.in/', 'l_mag1',
      '&#2360;&#2350;&#2381;&#2349;&#2366;&#2359;&#2339; &#2360;&#2344;&#2381;&#2342;&#2375;&#2358;&#2307;', 'Sanskrit Magazine'],
    [ 'mAhezvarasUtrANi', 'https://www.themathesontrust.org/library/shiva-sutras', 'l_msutra',
      '&#2350;&#2366;&#2361;&#2375;&#2358;&#2381;&#2357;&#2352;&#2360;&#2370;&#2340;&#2381;&#2352;&#2366;&#2339;&#2367;', ''],
    [ 'sandhiH', 'http://sanskrit.jnu.ac.in/sandhi/viccheda.jsp', 'l_sandhi',
      '&#2360;&#2344;&#2381;&#2343;&#2367;&#2307;', 'Sandhi Splitter'],
    [ 'Noun/Verb', 'http://sanskrit.inria.fr/DICO/grammar.fr.html', 'l_inria',
      '&#2358;&#2348;&#2381;&#2342;-/&#2343;&#2366;&#2340;&#2369;-&#2352;&#2370;&#2346;&#2366;&#2357;&#2354;&#2368;', 'Sanskrit Grammar Lookup' ],
    [ 'Books', 'http://www.sanskrit.nic.in/ebooks.php', 'l_books',
      '&#2346;&#2369;&#2360;&#2381;&#2340;&#2325;&#2366;&#2344;&#2367;', 'Sanskrit Books'],
    [ 'Wikipedia', 'http://sa.wikipedia.org', 'l_wiki',
      '&#2357;&#2367;&#2325;&#2367;&#2346;&#2368;&#2337;&#2367;&#2351;&#2366;', 'Wikipedia in Sanskrit'],
  ];

  // Template for the toolbar.
  let TOOLBAR_TEMPLATE = '\
    <table id="s_toolbar">\
      <tr>\
        %LINKS%\
        <td class="st_lastcol">\
          <div title="When enabled, double-clicking a word will automatically launch the dictionary" class="st_link st_common st_option">\
            <input type="checkbox" id="o_auto" class="st_link st_checkbox" title="When enabled, double-clicking a word will automatically launch the dictionary"/>\
            <label for="o_auto" class="st_link st_label">Auto-dictionary</label>\
          </div>\
        </td>\
      </tr>\
    </table>\
    <a id="a_dict" style="display:none" href="" target="l_dict"></a>\
  </div>';

  let ICON_HTML = '<div id="s_icon">\u0938</div>';
  let ICON_CSS = `#s_icon {
    cursor:pointer;
    float:right;
    padding: 0px 15px 25px;
    font-weight:bold;
    background-color: transparent;
    color:red;
    position:fixed;
    right:0;
    bottom: 0;
    height:10px;
    width:10px;
    zIndex:9999;
  }`;

  let icon;
  let visible = {};
  let numClicks = 0;
  let vdiv = null;
  let allowAnchor = false;
  let selectedText = null;

  function toolbarCheck() {
    for (let i in IGNORES) {
      if (document.URL.indexOf(IGNORES[i]) != -1) {
        return false;
      }
    }
    return true;
  }

  function toolbarInit() {
    for (let i in ALLOW_ANCHORS) {
      if (document.URL.indexOf(ALLOW_ANCHORS[i]) != -1) {
        allowAnchor = true;
        break;
      }
    }
  }

  function toolbarBuild() {
    $j(`<style>
      #s_toolbar {
        font-family: sans-serif;
        position: fixed;
        top: 0;
        margin: 0;
        width: 100%;
        z-index: 2999999999;
        background-color: white;
        float: left;
        display:none;
        line-height: 20px;
      }
      .st_lastcol {
        border: solid 1px #aaa;,
        padding: 0;
      }
      .st_li {
        text-align: center;
        border: solid 1px #aaa;
        line-height: 1.5em;
      }
      .st_space' {
        margin-left:20px;
      }
      .st_common {
        float: left;
        border: 0;
        margin: 0;
        padding: 0;
        font-weight: normal;
        vertical-align: middle;
        color: black;
      }
      .st_link {
        text-decoration: none;
        margin-left:5px;
        padding:2px;
        cursor: pointer;
        font-size: large;
        color: black;
      }
      .st_label {
        margin-left: 5px;
      }
      .st_option {
        display: inline-block;
        margin: 5px;
      }
      .st_link::hover {
        color:orange !important;
      }
      .st_checkbox {
        margin: 5px;
      }
      .st_menutrigger {
        position: relative;
      }
      .st_menu' {
        background-color:#eee;
        display:none;
        listStyle: none;
        position:absolute;
        width:120px;
        top: 50px;
        box-shadow: 5px 5px 5px #888888;
        z-index:999;
      }
      .st_menu li {
        width:100px;
        list-style: none inside;
      }
      ${ICON_CSS}
      #s_icon {
        cursor:pointer;
        float:right;
        padding: 0px 15px 25px;
        font-weight:bold;
        background-color: transparent;
        color:red;
        position:fixed;
        right:0;
        bottom: 0;
        height:10px;
        width:10px;
        zIndex:9999;
      }
      </style>`
    ).appendTo('head');
    let item_html = '';
    for (let i in TOOLBAR_ITEMS) {
      let item = TOOLBAR_ITEMS[i];
        item_html +=
          '<td class="st_li">' +
            '<a class="st_common st_link" href="'+item[1]+'" title="'+item[4]+'" target="'+item[2]+'">'+item[3]+'<br/>'+item[0]+'</a>'+
          '</td>'
    }
    place(TOOLBAR_TEMPLATE.replace('%LINKS%', item_html));
    $j('.st_menutrigger').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      let trigger = $j(this);
      let tgt = trigger.attr('data-menu');
      let v = visible[tgt];
      if (v)
        $j(tgt).css('display', 'none');
      else
        $j(tgt).css('display', 'block');
      visible[tgt] = !v;
    });
    $j(document).on('click', function(e) {
      $j('.st_menu').css('display', 'none');
      for (let i in visible) {
        visible[i] = false;
      }
    });
    document.addEventListener('mouseup', function(e) {
      let node = (e.target || e.srcElement);
      if (e.button != 0 || (node.nodeName == 'A' && !allowAnchor)
        || node.nodeName == 'INPUT') {
        return;
      }
      let n = node;
      while (n) {
        if (n == icon) {
          return;
        }
        if (n.getAttribute) {
          let ce = n.getAttribute('contenteditable');
          if (ce) {
            return;
          }
        }
        n = n.parentNode;
      }
      if (++numClicks == 1) {
        window.setTimeout(function() {
          selectedText = getSelectedText(true);
          if (selectedText != null && selectedText.length > 0) {
            if (selectedText.indexOf(' ') != -1) {
              selectedText = null;
              return;
            }
            if ($j('#o_auto').prop('checked')) {
              showDict(selectedText);
            }
          } else {
            hideDict();
          }
          numClicks = 0;
        }, 300);
      }
    }, false);
  }

  function place(html) {
    $j('body').prepend(html);
  }

  function getSelectedText(trim) {
    let text =
      (window.getSelection) ? window.getSelection().toString() :
      (document.getSelection) ? document.getSelection().toString() :
      (document.selection) ? document.selection.createRange().text : null;
    if (trim && text != null)
      text = text.trim();
    return text;
  }
 
  function showDict(text) {
    hideDict();
    let a = $j('#a_dict');
    a.on('click', function(e) {
      a.attr('href',
        'https://'+SANSKRIT_SITE_NEW+'/translate?dir=au&search='+text);
    });
    a.get(0).click();
  }
  
  function hideDict() {
    if (vdiv) {
      vdiv.close();
      vdiv = null;
    }
  }
 
  // =========== Common stuff. ===========

  function buildIcon(isDictionary) {
    $j(`<style>${ICON_CSS}</style>`).appendTo('head');
    place(ICON_HTML);
    icon = $j('#s_icon').get(0);
    $j('#s_icon').attr('title', isDictionary ? 'Click to sort dictionary' : 'Click to show/hide Sanskrit Toolbar');

    $j('#s_icon').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (isDictionary) {
        _dictToggleSorted();
      } else {
        let tb = $j('#s_toolbar');
        let v = tb.css('display');
        if (v == 'none') {
          tb.css({ 'display':'table'});
          $j('body').css('marginTop', '50px');
        } else {
          tb.css({'display':'none'});
          $j('body').css('marginTop', 0);
        }
      }
    });
  }

  function _debug(s) {
    if (DEBUG)
      console.log(s);
  }

  // =========== Main ===========

  if (window.top != window.self)
    return;

  if (dictCheck()) {
    dictInit();
    buildIcon(true);
    dictFixSuggestBox();
  } else if (grammarCheck()) {
    grammarFixStyles();
  } else if (toolbarCheck()) {
    toolbarInit();
    buildIcon(false);
    toolbarBuild();
  }
})();

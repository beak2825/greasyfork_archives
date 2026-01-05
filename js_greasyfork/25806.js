// ==UserScript==
// @name           Label List in Upload Form
// @author         newstarshipsmell
// @namespace      https://greasyfork.org/en/scripts/25806-label-list-in-upload-form
// @description    Adds a dropdown list for record labels to the upload/edit forms. Also adds an optional Label Collage search link.
// @version        1.0.5
// @require        https://greasyfork.org/libraries/GM_config/20131122/GM_config.js
// @include        /https?://apollo\.rip/(upload\.php|torrents\.php\?action=edit|requests\.php\?action=(new|edit)).*/
// @include        /https?://notwhat\.cd/(upload\.php|torrents\.php\?action=edit|requests\.php\?action=(new|edit)).*/
// @include        /https?://redacted\.ch/(upload\.php|torrents\.php\?action=edit|requests\.php\?action=(new|edit)).*/
// @grant          GM_openInTab
// @grant          GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/25806/Label%20List%20in%20Upload%20Form.user.js
// @updateURL https://update.greasyfork.org/scripts/25806/Label%20List%20in%20Upload%20Form.meta.js
// ==/UserScript==

// Thanks to WCD user orkyl for originally writing this script. I made some modifications to the Collage search and added the settings menu. ~newstarshipsmell

// ________________________________________

var settingsFields = {
  'top_labels': {
    'label': 'List of default Labels', 'type': 'textarea', 'rows': 4, 'cols': 32, 'default': 'Self-Released\n---',
    'title': 'A list of Labels that always appear at the top of the list\nPut each label on a separate line'
  },
  'add_search_link': {
    'type': 'checkbox', 'default': true, 'label': 'Add [Search] link for searching collages',
    'title': 'If enabled, [Search] link will open a collage search, in a new background tab, restricted to Label Collages only, with the search terms defined by the text currently listed in the Label field.',
  },
  'search_background': {
    'type': 'checkbox', 'default': true, 'label': 'Open Label Collage search tab in background',
    'title': 'If enabled, [Search] link will open in a new background tab.',
  },
  'exclude_terms': {
    'type': 'checkbox', 'default': true, 'label': 'Exclude certain words from collage searches:',
    'title': 'If enabled, [Search] link collage searches will exclude certain predefined words, defined below.\nWhen enabled, can be overridden with Shift+Click. (i.e. searches for the entire Label field current value)',
  },
  'label_articles': {
    'label': 'Leading Articles:', 'labelPos': 'above', 'type': 'textarea', 'rows': 1, 'cols': 96, 'default': 'a, an, the, la, el',
    'title': 'An array of leading articles to exclude from collage searches'
  },
  'label_terms': {
    'label': 'Common Label Terms:', 'labelPos': 'above', 'type': 'textarea', 'rows': 2, 'cols': 96,
    'default': 'ab, comm.unications?, co.mpany, corp.oration, discs, dist.rib.ution, ent.ertainment, group, inc.orp.orated, ind.ustries, label, ltd., media, music, prod.uctions, pub.l.ishing, records?, recordings?, vinyl',
    'title': 'An array of common label terms to exclude from collage searches\nSyntax: use "." to break terms where they are commonly abbreviated\nUse "s?" to match both simple singular and plural forms\nExample: comm.unications? will match/exclude comm, comm., communication and communications'
  },
  'label_countries': {
    'label': 'Countries:', 'labelPos': 'above', 'type': 'textarea', 'rows': 8, 'cols': 96,
    'default': 'Afghanistan, Albania, Algeria, Andorra, Angola, Antigua and Barbuda, Argentina, Armenia, Aruba, Australia, Austria, Azerbaijan, Bahamas, Bahrain, Bangladesh, Barbados, Belarus, Belgium, Belize, Benin, Bhutan, Bolivia, Bosnia and Herzegovina, Botswana, Brazil, Britain, Brunei, Bulgaria, Burkina Faso, Burma, Burundi, Cambodia, Cameroon, Canada, Cape Verde, Central African Republic, Chad, Chile, China, Colombia, Comoros, Costa Rica, Côte d\'Ivoire, Croatia, Cuba, Cyprus, Czech Republic, Democratic Republic of the Congo, Denmark, Djibouti, Dominican Republic, East Timor, East Timor , Ecuador, Egypt, El Salvador, Eritrea, Estonia, Ethiopia, Faroe Islands, Fiji, Finland, France, Gabon, Georgia, Germany, Ghana, Greece, Greenland, Guam, Guatemala, Haiti, Honduras, Hong Kong, Hungary, Iceland, India, Indonesia, Iran, Iraq, Ireland, Israel, Italy, Ivory Coast , Jamaica, Japan, Jordan, Kazakhstan, Kenya, Kiribati, Kosovo, Kuwait, Kyrgyzstan, Laos, Latvia, Lebanon, Lesotho, Liberia, Libya, Liechtenstein, Lithuania, Luxembourg, Macau, Macedonia, Madagascar, Malawi, Malaysia, Maldives, Mali, Malta, Mauritania, Mauritius, Mexico, Moldova, Monaco, Mongolia, Montenegro, Morocco, Mozambique, Myanmar, Nagorno-Karabakh, Namibia, Nauru, Nepal, Netherlands, New Caledonia, New Zealand, Nicaragua, Niger, Nigeria, Niue, North Korea, Northern Cyprus, Norway, Oman, Pakistan, Palau, Palestine, Panama, Papua New Guinea, Paraguay, Peru, Philippines, Poland, Portugal, Puerto Rico, Qatar, Republic of Taiwan, Republic of the Congo, Romania, Russia, Rwanda, Saudi Arabia, Senegal, Serbia, Sierra Leone, Singapore, Slovakia, Slovenia, Somalia, Somaliland, South Africa, South Korea, South Ossetia, South Sudan, Spain, Sri Lanka, Sudan, Suriname, Swaziland, Sweden, Switzerland, Syria, Tajikistan, Tanzania, Thailand, The Gambia, Togo, Tonga, Transnistria , Trinidad and Tobago, Tunisia, Turkey, Turkmenistan, Tuvalu, Uganda, Ukraine, United Arab Emirates, United Kingdom, United States, Uruguay, Uzbekistan, Vanuatu, Vatican City, Venezuela, Vietnam, Yemen, Zambia, Zimbabwe',
    'title': 'An array of countries to exclude from collage searches'
  }
};

GM_config.init({
  'id': 'SettingsMenu', 'title': 'Label List in Upload Form', 'fields': settingsFields,
  'css': '.section_header { background: white !important; color: black !important; border: 0px !important; text-align: left !important;} .field_label { font-weight: normal !important;}',
  'events':
  {
    'save': function() { location.reload(); }
  }
});

GM_registerMenuCommand('Label List Settings', function() {GM_config.open();});

var currentSite = location.protocol + '//' + location.hostname + '/'
var topLabels = GM_config.get('top_labels').split('\n');
var addSearchLink = GM_config.get('add_search_link');
var searchBackground = GM_config.get('search_background');
var excludeTerms = GM_config.get('exclude_terms');
var labelArticles = GM_config.get('label_articles').split(', ');
var labelTerms = GM_config.get('label_terms').split(', ');
var labelCountries = GM_config.get('label_countries').split(', ');

// ________________________________________

function removeRegexChars (pattern) {
  return pattern.replace('+', '').replace('^', '').replace('*', '')
    .replace(')', '').replace('(', '').replace('[', '').replace(']', '')
    .replace('{', '').replace('}', '').replace('\\', '').replace('|', '')
    .replace('.', '').replace('/', '').replace('?', '');
}

function removeRegexCharsNotDotQuery (pattern) {
  return pattern.replace('+', '').replace('^', '').replace('*', '')
    .replace(')', '').replace('(', '').replace('[', '').replace(']', '')
    .replace('{', '').replace('}', '').replace('\\', '').replace('|', '')
    .replace('/', '');
}

if ((labelArticles === undefined) || (typeof labelArticles !== 'object')) {
  var labelArticles = [''];
  var labelArticlePattern = new RegExp(/^$/);
} else {
  var labelArticleStr = (labelArticles.length > 1) ? '(' : '';
  for (var i = 0; i < labelArticles.length; i++) {
    labelArticleStr += '^' + removeRegexChars(labelArticles[i]) + '$|';
  }
  labelArticleStr = (labelArticles.length > 1) ? labelArticleStr
    .replace(/\|$/, ')') : labelArticleStr.replace(/\|$/, '');
  var labelArticlePattern = new RegExp(labelArticleStr,"i");
}

if ((labelTerms === undefined) || (typeof labelTerms !== 'object')) {
  var labelTerms = [''];
  var labelTermPattern = new RegExp(/^$/);
} else {
  var labelTermStr = (labelTerms.length > 1) ? '(' : '';
  for (var i = 0; i < labelTerms.length; i++) {
    labelTermStr += '^';
    if (labelTerms[i].includes('.')) {
      for (var j = 0; j < labelTerms[i].split('.').length; j++) {
        labelTermStr += (j > 0) ? '(\\.?|' + 
          removeRegexCharsNotDotQuery(labelTerms[i].split('.')[j]) 
        : removeRegexCharsNotDotQuery(labelTerms[i].split('.')[j]);
      }
      labelTermStr += ')'.repeat(labelTerms[i].split('.').length - 1);
    } else {
      labelTermStr += removeRegexCharsNotDotQuery(labelTerms[i]);
    }
    labelTermStr += '$|';
  }
  labelTermStr = (labelTerms.length > 1) ? labelTermStr.replace(/\|$/, 
                                                                ')') : labelTermStr.replace(/\|$/, '');
  var labelTermPattern = new RegExp(labelTermStr,"i");
}

if ((labelCountries === undefined) || (typeof labelCountries !== 'object')) {
  var labelCountries = [''];
  var labelCountryPattern = new RegExp(/^$/);
} else {
  var labelCountryStr = (labelCountries.length > 1) ? '(' : '';
  for (var i = 0; i < labelCountries.length; i++) {
    labelCountryStr += '^' + removeRegexChars(labelCountries[i]) + 
      '$|';
  }
  labelCountryStr = (labelCountries.length > 1) ? labelCountryStr
    .replace(/\|$/, ')') : labelCountryStr.replace(/\|$/, '');
  var labelCountryPattern = new RegExp(labelCountryStr,"i");
}

var mk = {
  opt: function (txt) {
    var opt = d.createElement('option');
    opt.text = txt;
    return opt;
  },

  sel: function (num) {
    var sel = d.createElement('select');
    sel.id = 'lluf_dropdown_' + num;
    sel.style.width = '160px';

    sel.appendChild(mk.opt('---'));
    for (var i = 0, il = topLabels.length; i < il; i++) {
      sel.appendChild(mk.opt(topLabels[i]));
    }
    for (i = 0, il = labels.length; i < il; i++) {
      sel.appendChild(mk.opt(labels[i]));
    }

    sel.addEventListener('change', evt.changeSel);
    return sel;
  },

  but: function (txt, title, handler) {
    var but = d.createElement('input');
    but.type = 'button';
    but.value = txt;
    but.title = title;
    but.addEventListener('click', handler, false);
    return but;
  },

  lnk: function (txt, title, handler) {
    var lnk = d.createElement('a');
    lnk.href = '#';
    lnk.className = 'brackets';
    lnk.textContent = txt;
    lnk.title = title;
    lnk.addEventListener('click', handler, false);
    return lnk;
  },

  ta: function () {
    var ta = d.createElement('textarea');
    ta.id = 'lluf_import';
    ta.className = 'hidden noWhutBB';
    ta.rows = 8;
    ta.cols = 60;
    return ta;
  },

  cb: function () {
    var cb = d.createElement('input');
    cb.type = 'checkbox';
    cb.title = 'Append';
    return cb;
  }
};


var evt = {
  changeSel: function (e) {
    var sel = e.currentTarget;
    var inp = sel.previousElementSibling;
    var cb = sel.nextElementSibling;
    var val = inp.value.trim();
    inp.value = sel.selectedIndex < 1 ? '' :
    cb.checked && val ? [val, '/', sel.value].join(' ') : sel.value;
  },

  clickSave: function (e) {

    function addLabel(txt) {
      if (txt && labels.indexOf(txt) + topLabels.indexOf(txt) == -2) {
        labels.push(txt);
        return txt;
      }
      return '';
    }

    function updateSel(num, val) {
      var oldSel = d.getElementById('lluf_dropdown_' + num);
      var newSel = mk.sel(num);
      newSel.value = val || oldSel.value;
      oldSel.parentNode.replaceChild(newSel, oldSel);
    }

    var lastAdded = '';
    var ta = d.getElementById('lluf_import');

    if (!ta || ta.classList.contains('hidden')) {
      inp1.value = inp1.value.trim();
      lastAdded = addLabel(inp1.value);

    } else {
      var names = ta.value.split(/[\n\r]+/);
      for (var i = 0, il = names.length; i < il; i++) {
        var name = names[i].trim();
        if (addLabel(name)) lastAdded = name;
      }
      ta.value = '';
    }

    if (lastAdded) {
      labels.sort(function (a, b) {
        return a.localeCompare(b);
      });
      updateSel(0, lastAdded);
      if (uploadPage) updateSel(1);
      stor.set('lluf_labels', labels);
    }
  },

  clickDelete: function (e) {
    var sel1 = d.getElementById('lluf_dropdown_0');
    var sel2 = d.getElementById('lluf_dropdown_1');

    var ix = sel1.selectedIndex;
    if (ix > topLabels.length) {
      var opt = sel1.options[ix];
      sel1.removeChild(opt);
      if (sel2) sel2.removeChild(sel2.options[ix]);

      ix = labels.indexOf(opt.text);
      if (ix > -1) {
        labels.splice(ix, 1);
        stor.set('lluf_labels', labels);
      }
    }
  },

  clickImport: function (e) {
    e.preventDefault();
    var ta = d.getElementById('lluf_import');
    if (e.ctrlKey) {
      ta.value = labels.join('\n');
      ta.classList.remove('hidden');
      ta.select();
    } else {
      ta.classList.toggle('hidden');
    }
    ta.focus();
  },

  clickSearch: function (e) {
    e.preventDefault();

    var lableSearch = inp1.value;
    if ((excludeTerms) && (!e.shiftKey)) {
      lableSearch = (lableSearch.includes('/')) ? lableSearch.split('/')[0]
        .trim() : lableSearch;
      lableSearch = ((lableSearch.includes('(')) && (lableSearch
                                                     .endsWith(')'))) ? lableSearch.split('(')[0].trim() : lableSearch;
      var lableSearchWords = lableSearch.split(' ');
      if ((lableSearchWords.length > 1) && (labelArticlePattern.test(
        lableSearchWords[0]))) {
        lableSearchWords.shift();
      }
      lableSearch = lableSearchWords.shift();
      if (lableSearchWords.length > 0) {
        for (var i = 0; i < lableSearchWords.length; i++) {
          lableSearch += ((!labelTermPattern.test(lableSearchWords[i])) && (!labelCountryPattern.test(lableSearchWords[i]))) ? " " + lableSearchWords[i] : '';
        }
      }
    }

    if (lableSearch.length > 2) {
      GM_openInTab(currentSite + 'collages.php?action=search&cats[4]=1&search=' + encodeURIComponent(lableSearch), searchBackground);
    }
  },

  clickSettings: function (e) {
    e.preventDefault();

    GM_config.open();
  }
};


var stor = {
  get: function (key, def) {
    var val = window.localStorage && localStorage.getItem(key);
    return typeof val == 'string' ? JSON.parse(val) : def;
  },
  set: function (key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }
};


var labels = stor.get('lluf_labels', []);
var uploadPage = window.location.pathname == '/upload.php';

var d = document;
var inp1 = d.getElementById('record_label') ||              // upload.php
    d.getElementById('remaster_record_label') ||     // torrents.php?action=edit
    d.querySelector('input[name="record_label"]') || // torrents.php?action=editgroup
    d.querySelector('#recordlabel_tr input');        // requests.php

var inps = [inp1, d.getElementById('remaster_record_label')];

var addElements = function (num) {

  function insert(el) {
    par.insertBefore(el, sib);
    par.insertBefore(d.createTextNode(' '), el);
  }

  var par = inps[num].parentNode;
  var sib = inps[num].nextSibling;

  insert(mk.sel(num));
  insert(mk.cb());
  if (num) return;

  insert(mk.but('+', 'Add to list', evt.clickSave));
  insert(mk.but('\u2212', 'Remove selected entry', evt.clickDelete));

  if (uploadPage) {
    insert(mk.lnk('Import', 'Toggle bulk import box (ctrl-click to export)', evt.clickImport));
  }

  if (addSearchLink) {
    if (excludeTerms) {
      insert(mk.lnk('Search', 'Search label collages (shift-click for all terms)', evt.clickSearch));
    } else {
      insert(mk.lnk('Search', 'Search label collages', evt.clickSearch));
    }
  }

  insert(mk.lnk('Settings', 'Label List Settings', evt.clickSettings));

  insert(d.createElement('br'));
  insert(mk.ta());
};

addElements(0);
if (uploadPage) addElements(1);
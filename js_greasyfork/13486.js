// ==UserScript==
// @name Fanfiction.net Unwanted Result Filter
// @namespace   http://www.ficfan.org/
// @description Make up for how limited Fanfiction.net's result filtering is
//              compared to sites like Twisting the Hellmouth.
// @copyright   2014-2015, 2018, Stephan Sokolow (http://www.ssokolow.com/)
// @license     MIT; http://www.opensource.org/licenses/mit-license.php
// @version     0.1.11
//
// @match       *://www.fanfiction.net/*
// @noframes
//
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
//
// @grant       GM_registerMenuCommand
// @grant       GM.registerMenuCommand
//
// @grant       GM_getValue
// @grant       GM_setValue
// NOTE: GM_config doesn't currently support GM4 APIs, so allowing the GM4
//       versions of these isn't helpful and could result in users losing 
//       access to their settings if GM_config suddenly starts supporting
//       them without transparently migrating data from its localStorage
//       fallback.
// @downloadURL https://update.greasyfork.org/scripts/13486/Fanfictionnet%20Unwanted%20Result%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/13486/Fanfictionnet%20Unwanted%20Result%20Filter.meta.js
// ==/UserScript==

// ----==== Configuration ====----

var IGNORED_OPACITY = 0.3;

var fieldDefs = {
  'filter_slash': {
    'section': ['Slash Filter',
      'Hide stories with slash based on warnings in story descriptions'],
      'label': 'Enabled',
      'labelPos': 'right',
      'type': 'checkbox',
      'default': true,
  },
  'hide_slash': {
      'label': 'No Placeholder',
      'labelPos': 'right',
      'type': 'checkbox',
      'default': false,
  },
  'slash_pat': {
    'label': 'Slash is...',
    'title': 'A regular expression which matches slash in descriptions',
    'type': 'text',
    'size': 255,
    'default': ".*(slash|yaoi)([.,!:) -]|$)"
  },
  'not_slash_pat': {
    'label': '...but not...',
    'title': 'A regular expression which matches "not slash" and so on',
    'type': 'text',
    'size': 255,
    'default': ".*(fem|not?[ ]+)(slash|yaoi)([.,!: ]|$)"
  },
  'filter_cats': {
    'section': ['Unwanted Category Filter',
      'Hide unwanted fandoms in author pages and "All Crossovers" searches'],
      'label': 'Enabled',
      'labelPos': 'right',
      'type': 'checkbox',
      'default': true,
  },
  'hide_cats': {
      'label': 'No Placeholder',
      'labelPos': 'right',
      'type': 'checkbox',
      'default': false,
  },
  'unwanted_cats': {
    'label': 'Unwanted categories (One per line, blank lines and lines ' +
      'beginning with # will be ignored):',
      'type': 'textarea',
      'size': 100,
      'default': [
        "# --== Never wanted ==-- ",
        "Invader Zim",
        "Supernatural",
        "Twilight",
        "",
        "# --== Not right now ==-- ",
        "Harry Potter & Avengers",
        "Naruto",
      ].join("\n"),
  },
  'unwanted_cats_escape': {
    'label': 'Lines are literal strings (uncheck for regular expressions)',
    'labelPos': 'right',
    'title': 'NOTE: Leading/trailing whitespace is always ignored and ' +
             'newlines always have OR behaviour.',
    'type': 'checkbox',
    'default': true,
  },
  'unwanted_cats_commute': {
    'label': 'Automatically generate "B & A" lines from "A & B" lines',
    'labelPos': 'right',
    'title': "WARNING: This will break regexes with & inside () or []",
    'type': 'checkbox',
    'default': true,
  },
  'filter_manual': {
    'section': ['Manual Filter',
      'Hide an arbitrary list of story IDs'],
      'label': 'Enabled',
      'labelPos': 'right',
      'type': 'checkbox',
      'default': true,
  },
  'hide_manual': {
      'label': 'No Placeholder',
      'labelPos': 'right',
      'type': 'checkbox',
      'default': false,
  },
  'manual_reason': {
    'label': 'Reason to display in placeholders:',
    'type': 'text',
    'size': 255,
    'default': "Already Read"
  },
  'unwanted_manual': {
    'label': 'Unwanted story IDs (One per line, blank lines and lines ' +
      'beginning with # will be ignored):',
      'type': 'textarea',
      'size': 100,
      'default': "",
  },
  // TODO: Ideas for future filters:
  // - Genre (allowing more than one whitelist/blacklist entry)
  // TODO: Ideas for filters requiring an in-page UI:
  // - sort orders not already offered (eg. faves/follows on authors faves)
  // - min/max words as a freeform range entry
  // - filter sets which can be toggled
};

let frame = document.createElement('div')
document.body.append(frame);

var config_params = {
  'id': 'ffnet_result_filter',
  'title': 'Fanfiction.net Unwanted Result Filter',
  'fields': fieldDefs,
  'css': ('#ffnet_result_filter ' + [
    // Match Fanfiction.net styling more closely
    ".section_header { background-color: #339 !important; }",
    ".section_desc { background-color: #f6f7ee !important; border: none; " +
    "  padding: 1px; }",
    ".config_header { font-size: 16pt; }",
    ".field_label { font-size: 13px; font-weight: normal; }",
    // Layout adjustments for using a non-iframe container
    "label { display: inline; }",
    ".section_header_holder { padding: 15px; margin-bottom: 2em; }",
    ".modal-footer { margin-top: -2em; }",
    ".saveclose_buttons.btn { margin: 0 0 0 5px !important; }",
    ".reset_holder { padding-right: 12px; }",
    "input[type=checkbox] { margin: 2px 4px 2px; }",
    // Make the panel sanely scrollable
    "#ffnet_result_filter_wrapper { " +
      " display: flex; flex-direction: column; height: 100%; }\n" +
    "#ffnrfilter_contentbox { " +
      " flex: 1 1 auto; min-height: 0px; overflow-y: scroll; }\n" +
    // Form layout fixes
    "input[type=text], textarea " +
    "  { width: calc(100% - 1.1em); resize: vertical; }\n" +
    "#ffnet_result_filter_filter_manual_var, " +
    "#ffnet_result_filter_filter_slash_var, " +
    "#ffnet_result_filter_filter_cats_var, " +
    "#ffnet_result_filter_hide_manual_var, " +
    "#ffnet_result_filter_hide_slash_var, " +
    "#ffnet_result_filter_hide_cats_var, " +
    "#ffnet_result_filter_slash_pat_var, " +
    "#ffnet_result_filter_not_slash_pat_var " +
    "    { display: inline-block; margin-right: 1em !important; } " +
    "#ffnet_result_filter_field_slash_pat, " +
    "#ffnet_result_filter_field_not_slash_pat " +
    "    { max-width: 20em; } " +
    "#ffnet_result_filter_field_unwanted_cats { min-height: 10em; }"
    ].join('\n#ffnet_result_filter ')),
  'events': {
    'open': function(doc) {
      // Reconcile GM_config and Bootstrap CSS
      this.frame.style.zIndex = 1050;
      this.frame.style.top = "50px";
      this.frame.style.height = "calc(99% - 100px)";
      this.frame.style.borderColor = "#d4d4d4";
      this.frame.classList.add('modal', 'fade', 'in');

      let header = document.querySelector('.config_header');
      header.classList.add('modal-header');
      
      this.frame.querySelectorAll('button').forEach(
        function(node) { node.classList.add('btn'); });
      this.frame.querySelectorAll('.reset_holder').forEach(
        function(node) { node.classList.add('btn', 'pull-left'); });
      
      console.log(document.getElementById('ffnet_result_filter_buttons_holder'));       
      document.getElementById('ffnet_result_filter_buttons_holder')
        .classList.add('modal-footer');
      document.getElementById('ffnet_result_filter_slash_pat_var').before(
        document.createElement("br"));

      // Move the content into a wrapper DIV for styling
      let contentbox = document.createElement('div');
      contentbox.id = "ffnrfilter_contentbox";
      header.after(contentbox);

      this.frame.querySelectorAll('.section_header_holder').forEach(function(node) {
        node.remove();
        contentbox.append(node);
      });
      
      // Add a clickable backdrop for the panel
      let modal_back = document.createElement('div');
      modal_back.id = "gm_modal_back";
      modal_back.addEventListener("click", function() { GM_config.close(); });
      modal_back.classList.add('modal-backdrop', 'fade', 'in')
      document.body.append(modal_back);
    },
    'close': function() {
      // Plumb the added backdrop into the close handler
      document.getElementById("gm_modal_back").remove();
    }
  },
  'frame': frame,
};

// ----==== Functions ====----

/// Escape string for literal meaning inside a regular expression
/// Source: http://stackoverflow.com/a/3561711/435253
var re_escape = function(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

/// Use with Array.filter() to remove comments and blank lines
var rows_filter = function(elem, idx, arr) {
  elem = elem.trim()
  if (elem.charAt(0) == '#' || !elem) {
    return false;
  }
  return true;
};

/// Parse an array from a newline-delimited string containing # comments
var parse_lines = function(s) {
  return s.split("\n").map(function(e, i, a) {
    return e.trim();
  }).filter(rows_filter);
};

/// Parse a usable list of category patterns from a raw string
var parse_cats_list = function(s, escape, commute) {
  // Parse the config
  var cats_raw = parse_lines(s);
  if (escape) { cats_raw = cats_raw.map(re_escape) }
  if (commute) {
    var cats_out = [];
    for (var i = 0, len = cats_raw.length; i < len; i++) {
      var line = cats_raw[i];
      cats_out.push(line);
      var parts = line.split(' & ');
      if (parts.length > 1) {
        cats_out.push(parts[1] + ' & ' + parts[0]);
      }
    }
  }
  return cats_out;
};

// Parse a usable list of story IDs from a raw string
var parse_id_list = function(s) {
  return parse_lines(s).filter(rows_filter);
};

/// Hide a story entry in a way it can be recovered
var hide_entry = function(node) {
  node.classList.add('filtered')
  node.style.display = "none";
};

/// Hide a story entry and add a clickable placeholder
var add_placeholder = function(node, reason) {
  let placeholder = node.cloneNode();

  placeholder.textContent = "Click to Show (" + reason + ")";
  placeholder.style.minHeight = 0;
  placeholder.style.maxHeight = "1em";
  placeholder.style.color = "lightgray";
              placeholder.style.textAlign = "center";
  placeholder.style.cursor = "pointer";
  placeholder.classList.add("filter_placeholder");
  
  placeholder.addEventListener("click", (e) => {
    e.stopPropagation();
    e.target.remove();
    node.style.display = "block";
  });
  
  node.before(placeholder);
  hide_entry(node);
};

/// Code which must be re-run to reapply filters after changing the config
var initialize_filters_and_apply = function() {
  // Parse the config
  var bad_cats = parse_cats_list(
    GM_config.get('unwanted_cats'),
    GM_config.get('unwanted_cats_escape'),
    GM_config.get('unwanted_cats_commute')
  );

  if (GM_config.get('filter_manual')) {
    var manual_story_ids = parse_id_list(GM_config.get('unwanted_manual'));
  } else {
    var manual_story_ids = [];
  }
  var story_link_re = new RegExp("\/s\/(\\d+)\/");

  // Generate RegExp objects from the parsed config
  var slash_re = new RegExp(GM_config.get('slash_pat'), 'i');
  var not_slash_re = new RegExp(GM_config.get('not_slash_pat'), 'i');
  var cats_re = new RegExp("(?:^|- )(.*(" + bad_cats.join('|') + ').*) - Rated:.*');
  var cat_link_re = new RegExp(bad_cats.join('|'));

  // Clean up after any previous run
  document.querySelectorAll(".filter_placeholder").forEach(function(node) { node.remove() });
  document.querySelectorAll(".filtered").forEach(function(node) { node.style.display = "block"; });
  document.querySelectorAll(".ignored").forEach(function(node) {
    node.style.opacity = 1;
    node.style.display = "block";
    node.classList.remove('ignored');
  });

  document.querySelectorAll(".z-list").forEach(function(story) {
    let meta_row = story.querySelector('.xgray').textContent;
    let description = story.querySelector('.z-padtop').childNodes[0].data;

    // TODO: Redesign to collapse runs of hidden entries
    // TODO: Show a comma-separated list of reasons something was hidden
    var reason = null;
    if (manual_story_ids.length > 0) {
      var story_url = story.querySelector('a.stitle').getAttribute('href');
      var story_id = story_link_re.exec(story_url)[1];
      if (story_id && manual_story_ids.indexOf(story_id) != -1) {
        if (GM_config.get('hide_manual')) {
          hide_entry(story);
        } else {
          add_placeholder(story, GM_config.get('manual_reason'));
        }
        return;
      }
    }

    if (GM_config.get('filter_slash') && slash_re.test(description)
        && !not_slash_re.test(description)) {
      if (GM_config.get('hide_slash')) {
        hide_entry(story);
      } else {
        add_placeholder(story, "Slash");
      }
      return;
    }

    if (GM_config.get('filter_cats')) {
      var matches = meta_row.match(cats_re);
      if (matches && matches.length > 0) {
        if (GM_config.get('hide_cats')) {
          hide_entry(story);
        } else {
          add_placeholder(story, matches[1]);
        }
        return;
      }
    }
  });

  if (GM_config.get('filter_cats')) {
    let hide_cats = GM_config.get('hide_cats');
    document.querySelectorAll('#list_output a').forEach(function(node) {
      // "Browse" wraps the title and entry count in a <div> that lets us
      // easily fade both while "Community" puts them directly in the <td>
      // which defines the column.
      let parent = node.closest('div');
      if (parent) { node = parent; }

      if (cat_link_re.test(node.textContent)) {
        node.classList.add('ignored');
        if (hide_cats) {
          node.style.display = "none";
        } else {
          node.style.opacity = IGNORED_OPACITY;
        }
      }
    });
  }
};

// ----==== Begin Main Program ====----

// Stuff which either must or need only be called once
GM_config.init(config_params);
GM_config.onSave = initialize_filters_and_apply;

// Only clutter up the context menu (in GM4) on relevant pages
if (document.querySelector('#list_output a, .z-list')) {
	GM.registerMenuCommand("Configure Result Filter...",
  	                     function() { GM_config.open(); }, 'C');
}

// Clear out ad box which misaligns "Hidden" message if it's first result
try {
      document.querySelector('#content_wrapper_inner ins.adsbygoogle')
              .parentElement.remove();
} catch(_) {}

initialize_filters_and_apply();
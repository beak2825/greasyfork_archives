// ==UserScript==
// @name        Convert Page to IPA Pronunciation
// @description Replaces all English words on a webpage with their pronunciation in the international phonetic alphabet. American and British English flavors available!
// @version     2.0.0
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @include     *
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @namespace   https://greasyfork.org/en/users/13329-qguv
// @downloadURL https://update.greasyfork.org/scripts/18981/Convert%20Page%20to%20IPA%20Pronunciation.user.js
// @updateURL https://update.greasyfork.org/scripts/18981/Convert%20Page%20to%20IPA%20Pronunciation.meta.js
// ==/UserScript==

/* All thanks, donations, hugs, etc. should go to Oliden, the original author:
 * https://greasyfork.org/en/users/9379-oliden
 * I just cleaned things up a bit and improved performance.
 */

/* fetch_dict fetches the relevant word-to-ipa dictionary from Oliden's site
 * and passes it to a given callback function. Pass variant "US" or "GB" for
 * American or British English pronunciations, respectively. N.b. that
 * everyone's English dialect is different; there is no one 'british' or
 * 'american' pronunciation! */
function fetch_dict(variant, callback) {
  var dict_url = "http://www.olivetti.info/";
  if (variant === "GB-R" || variant === "GB-NR") {
    dict_url += "words.json";
  } else {
    dict_url += "wordsAmE.json";
  }
  return GM_xmlhttpRequest({
    method: "GET",
    url: dict_url,
    onload: function (r) { callback(JSON.parse(r.response)); }
  });
}

/* to_ipa takes a string, a hashmap from English words to their IPA
 * pronunciations, and a flag indicating whether to display stress markers in
 * IPA words. */
function to_ipa(s, wordmap, preserve_stress, variant) {
  if (s.length === 0) { return ''; }

  var this_word   = '';
  var ipa_word    = '';
  var converted  = '';
  var delimeters = ' ,.;:<>()\n!\"—';
  s.split('').forEach(function (c, i) {

    // not a delimeter
    if ((delimeters.indexOf(c) === -1) && (i != (s.length - 1))) {
      this_word += c;

    // is a delimeter or last item
    } else {
      ipa_word = wordmap[this_word];
      if (ipa_word === undefined) {
        ipa_word = this_word;
      } else if (!preserve_stress) {
        ipa_word = ipa_word.replace(/[.ˈ]/g,'').replace(/[ˌ]/g,'');
      }
      var new_rhotic = '';
      if (variant === "GB-R") {
        new_rhotic = 'r';
      }
      ipa_word = ipa_word.replace(/[(]r[)]/g, new_rhotic);
      converted += ipa_word;
      converted += c;
      this_word = '';
    }
  });

  return converted;
}

function transform_webpage_text(page, transform_fn) {
  const TEXT_NODE = 3;
  const ELEMENT_NODE = 1;

  if (page.nodeType === TEXT_NODE) {
    var parent_type = page.parentNode.nodeName.toLowerCase();
    if( parent_type != "style" && parent_type != "script" ){
      ns = transform_fn(page.data.toLowerCase());
      page.data = ns;
    }
  } else if (page.nodeType === ELEMENT_NODE) {
    for (var child = page.firstChild; null != child; child = child.nextSibling) {
      transform_webpage_text(child, transform_fn);
    }
  }
}

function page_to_ipa(variant, preserve_stress) {
  fetch_dict(variant, function (wordmap) {
    if (typeof wordmap == 'undefined') {
      alert("? Couldn't fetch pronunciation dictionary!");
      return;
    }
    transform_webpage_text(document.body, function (s) {
      var i = to_ipa(s, wordmap, preserve_stress, variant);
      console.log("transforming " + s + " to " + i);
      return i;
    });
  });
}

GM_registerMenuCommand(
    "Page to IPA",
    function () { page_to_ipa("US", false); }
);

GM_registerMenuCommand(
    "Page to IPA with stress",
    function () { page_to_ipa("US", true); }
);

GM_registerMenuCommand(
    "Page to IPA (Rhotic British English)",
    function () { page_to_ipa("GB-R", false); }
);

GM_registerMenuCommand(
    "Page to IPA with stress (Rhotic British English)",
    function () { page_to_ipa("GB-R", true); }
);

GM_registerMenuCommand(
    "Page to IPA (Non-Rhotic British English)",
    function () { page_to_ipa("GB-NR", false); }
);

GM_registerMenuCommand(
    "Page to IPA with stress (Non-Rhotic British English)",
    function () { page_to_ipa("GB-NR", true); }
);

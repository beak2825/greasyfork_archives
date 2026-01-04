// ==UserScript==
// @name         Wiki Randomizer
// @namespace    https://script.zgc.im/
// @version      1.7.2
// @description  Press a key to view a random page on current Wiki.
// @author       MidAutumnMoon
//
// @include /^.*://.*\.wiki(pedia|voyage|source|books)\.org/.*$/
// @match *://*.wiktionary.org/*
// @include /^.*://wiki\.(archlinux|debian)\.org/.*$/
// @include /^.*://.*\.wikihow\.(com|pet)/.*$/
// @match *://*.fandom.com/*
// @match *://*.moegirl.org.cn/*
// @match *://tcrf.net/*
// @match *://*.rosettacode.org/*
// @match *://esolangs.org/*
// @match *://*.uesp.net/*
// @match *://thwiki.cc/*
//
// @icon         https://zh.wikipedia.org/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425258/Wiki%20Randomizer.user.js
// @updateURL https://update.greasyfork.org/scripts/425258/Wiki%20Randomizer.meta.js
// ==/UserScript==

//
// Issues and requests: https://gitlab.com/MidAutumnMoon/butterpotato/
//

// The default trigger key
const THAT_KEY = 'F8';


const MediawikiCommon         = 'Special:Random';
const MediawikiRootpageCommon = 'Special:RandomRootpage';
const MoinMoinCommon          = 'RandomPage';
const WikiHowCommon           = 'Special:Randomizer'

// The total rules
const RULES = new Map([
  // All about Wikipedia
  [ 'wikipedia.org',  `wiki/${MediawikiCommon}` ],
  [ 'wikivoyage.org', `wiki/${MediawikiCommon}` ],
  [ 'wikisource.org', `wiki/${MediawikiCommon}` ],
  [ 'wikibooks.org',  `wiki/Special:RandomInCategory/Book:Wikibooks_Stacks/Books` ],
  [ 'wiktionary.org', `wiki/${MediawikiCommon}` ],

  // Cutting Room Floor
  [ 'tcrf.net', MediawikiRootpageCommon ],

  // 萌百！
  [ 'moegirl.org.cn', MediawikiCommon ],

  // Fandom
  [ 'fandom.com', `wiki/${MediawikiRootpageCommon}` ],

  // Arch Linux wiki
  [ 'wiki.archlinux.org', `index.php/${MediawikiCommon}` ],

  // Debian wiki
  [ 'wiki.debian.org', MoinMoinCommon ],

  // Rosetta Code
  [ 'www.rosettacode.org', `wiki/${MediawikiCommon}` ],

  // The esoteric programming languages wiki
  [ 'esolangs.org', `wiki/${MediawikiCommon}` ],

  // WikiHow sites
  [ 'wikihow.com', WikiHowCommon ],
  [ 'wikihow.pet', WikiHowCommon ],

  // Officially the Unofficial Elder Scrolls Pages
  [ 'uesp.net', `wiki/${MediawikiCommon}` ],

  // Million Karts
  [ 'thwiki.cc', MediawikiCommon ],
]);

// Main
(function() {
  'use strict';

  // Navigate to the `location` of current site.
  const navigate_to = ( location ) => {
    window.location.href = new URL( window.location.href ).origin + '/' + location;
  };

  // Get the rule associated with current site.
  const get_rule = () => {
    let domain = new URL( window.location.href ).host;
    let rule = '';

    for (;;) {
      rule = RULES.get(domain);

      if ( rule === undefined ) {
        // If no rules were found for current domain,
        // try matching 1 level upper instead.
        if ( ! validated_domain(domain) ) {
          return null;
        }
        // truncate one level of subdomain
        domain = domain.substring( domain.indexOf('.') + 1 );
      } else {
        // Otherwise just return the matched rule.
        return rule;
      }
    }

  };

  // There must be at least 2 dots in a valid domain name.
  const validated_domain = ( domain ) => {
    return ( (domain.match(/\./g) || []).length >= 2 );
  };

  // make codes clearer
  const main = () => {
    const location = get_rule();

    switch ( location ) {
      case null:
        console.log( 'No rules for current site!' );
        break;
      default:
        navigate_to( location );
        break;
    }
  };

  // ...when press that key.
  document.addEventListener('keydown', ( event ) => {
    if ( event.code === THAT_KEY )
      main();
  });

})();

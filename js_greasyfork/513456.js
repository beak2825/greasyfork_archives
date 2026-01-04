// ==UserScript==
// @name        wings.io Patches
// @namespace   http://tampermonkey.net/
// @version     3.9-(14/Nov/2024)
// @description | Dark Mode | Profanity Filter | and more... patches are designed to run on load, make required edits and reload
// @author      ⟐Ragav
// @icon        https://wings.io/images/favicon.png
// @match       https://wings.io/
// @match       https://wings.io/#*
// @run-at      document-start
// @grant       GM_getResourceText
// @require     https://raw.githubusercontent.com/google/diff-match-patch/cd60d246aecf871367313c7cf6dc8814af32c5e3/javascript/diff_match_patch.js#sha256=d422c483b926ca7cea768a03c8f0f26ebc69d5041e3deb550d2709dd40fa16ea
// @resource    default_profanity_blacklist     https://raw.githubusercontent.com/mogade/badwords/refs/heads/master/en.txt
// @resource    wingsio_index_pаge              https://wings.io/
// @resource    wingsio_index_page              https://gw6mc32y.pages.dev/source/index.html#sha256=b47f7772b08ff125efc1293526993b9ad50729f8a1e42fd1d92c2d5e13f526e8
// @resource    feat-dark-theme                 https://gw6mc32y.pages.dev/patches/feat-dark-theme/patch.diff#sha256=d27f248fba284a0d257000ce7219954b0905c862139a7f42067e4089b2f42520
// @resource    feat-profanity-filter           https://gw6mc32y.pages.dev/patches/feat-profanity-filter/patch.diff#sha256=69e9f1ef323baeb8aac7568ad9e430469def3319442b1e4f60380bd23dde41e8
// @resource    feat-server-ping                https://gw6mc32y.pages.dev/patches/feat-server-ping/patch.diff#sha256=474e4e5d0a1a8a4e1c330a55f5ab5f3b7f7913b1dacd35630e1bcf96f62c26ad
// @resource    mod-always-show-nickinput       https://gw6mc32y.pages.dev/patches/mod-always-show-nickinput/patch.diff#sha256=e9ace3789b4fd92b32878e7bc2ba382ce9465d9cba0bcff5e7bc07d199553983
// @resource    mod-colorful-trail              https://gw6mc32y.pages.dev/patches/mod-colorful-trail/patch.diff#sha256=6219cbf04c55b814502f98f4a7a11e0b08703d1661cb5356774521be598b0fa6
// @resource    mod-disable-shake               https://gw6mc32y.pages.dev/patches/mod-disable-shake/patch.diff#sha256=e75676367ef61ec6ca486831335c839c23a086b412a3906f7e5c7057a35772d5
// @resource    mod-mark-bots-with-color        https://gw6mc32y.pages.dev/patches/mod-mark-bots-with-color/patch.diff#sha256=5815ad548fee2bf94bced7ebef45e00b170bf00826bd6a43cad50411a7a95d53
// @resource    mod-mark-bots-with-emoji        https://gw6mc32y.pages.dev/patches/mod-mark-bots-with-emoji/patch.diff#sha256=44df21c987f4d68f46a8a0b076ca91a83119ce600d079c54b00f4d925e71c406
// @resource    mod-remove-leaderboard-limit    https://gw6mc32y.pages.dev/patches/mod-remove-leaderboard-limit/patch.diff#sha256=6c9b16eef346e8da114a033ded4918c2e8c1c37b4e54bbee728d93e3cc588480
// @license     AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/513456/wingsio%20Patches.user.js
// @updateURL https://update.greasyfork.org/scripts/513456/wingsio%20Patches.meta.js
// ==/UserScript==

(function () {
  // EDITABLE REGION

  // Comment to disable patch
  const patches = [
    'feat-dark-theme',
    'feat-profanity-filter',
    'feat-server-ping',
    // 'mod-always-show-nickinput',
    // 'mod-colorful-trail',
    // 'mod-disable-shake',
    // 'mod-mark-bots-with-color',
    // 'mod-mark-bots-with-emoji',
    // 'mod-remove-leaderboard-limit',
  ];

  const settings = {
    profanity_filter_character: "✲",
    debug_profanity_filter_show_filtered: false,
  }

  const profanity_regex_blacklist = [

    ...(GM_getResourceText('default_profanity_blacklist').split("\n")),
  ];
  const profanity_regex_whitelist = [

  ];
  // END OF EDITABLE REGION

  const profanity_filter_extension = `
  let profanity_regex_blacklist=\`${profanity_regex_blacklist.toString()}\`.split(',').filter(str => str.length > 0);
  let profanity_regex_whitelist=\`${profanity_regex_whitelist.toString()}\`.split(',').filter(str => str.length > 0);
  const debug_show_filtered_profanity=${settings.debug_profanity_filter_show_filtered};

  profanity_regex_blacklist = profanity_regex_blacklist.map(regex_str => new RegExp(regex_str, 'ig'));
  profanity_regex_whitelist = profanity_regex_whitelist.map(regex_str => new RegExp(regex_str, 'ig'));
  function filter_name(name) {
      for (const regex_block of profanity_regex_blacklist) {
          name = name.replaceAll(new RegExp(regex_block, 'ig'), match=>{
              for(const regex_allow of profanity_regex_whitelist) {
                  if(match.search(regex_allow) > -1) return match;
              }
              return '${settings.profanity_filter_character}'.repeat(match.length) + (debug_show_filtered_profanity ? ' ('+match+')' : '');
          })
      }
      return name;
  };`;

  function getPatchedPage() {
    const dmp = new diff_match_patch();
    dmp.Match_Distance = Infinity;

    let result, str_html = GM_getResourceText("wingsio_index_page");

    let list_patches = [];
    for(const patch of patches) list_patches.push(...(dmp.patch_fromText(GM_getResourceText(patch))));

    [str_html, result] = dmp.patch_apply(list_patches, str_html);
    if(patches.includes('feat-profanity-filter')) str_html = str_html.replace('(function(w,x,s){', profanity_filter_extension+'(function(w,x,s){');

    console.log(result.every(Boolean) ? 'All patches applied successfully' : 'Failed to apply some patches');

    return str_html;
  }

  var observer = new MutationObserver(mutationRecords => {
    mutationRecords.every( record => {
      if (record.addedNodes[0]) {
        observer.disconnect();
        document.write(getPatchedPage());
        document.close();
        return false
      }
      return true
    })
  });

  observer.observe(document, {
    childList: true,
    subtree: true
  });
})();

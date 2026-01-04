// ==UserScript==
// @name        Teams - Team ID In Team Settings
// @namespace   Eliot Cole Scripts
// @match       https://teams.microsoft.com/v2/*
// @grant       none
// @license     MIT
// @version     1.0
// @author      Eliot Cole
// @description 08/10/2024, 17:21:02
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @require     https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/511897/Teams%20-%20Team%20ID%20In%20Team%20Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/511897/Teams%20-%20Team%20ID%20In%20Team%20Settings.meta.js
// ==/UserScript==

VM.observe(document.body, () => {
  const $node = $('div[data-tid="taco-team-settings-tab-renderer"] > div.fui-Accordion > div.fui-AccordionItem > div.fui-AccordionPanel > div.fui-Primitive > div.fui-Flex > div.fui-Flex > div.fui-Flex > span.fui-Avatar > img.fui-Avatar__image[role="presentation"]');
  if ($node.length) {
    let GimmeTeamzId = $node.attr('src').split('/teams/')[1].split('?')[0];
    console.log('ladidahdidah: '+GimmeTeamzId);
    $('h2.fui-StyledText[dir="auto"][as="h2"]').after('<span dir="auto" class="fui-StyledText" style="font-face: monotype;">'+GimmeTeamzId+'</span>');
    return true;
  }
});
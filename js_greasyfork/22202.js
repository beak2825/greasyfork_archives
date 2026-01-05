// ==UserScript==
// @name         Greasy Fork - Change Default Script Sort
// @namespace    https://greasyfork.org/users/649
// @version      1.3.5
// @description  Change default script sort on GreasyFork
// @author       Adrien Pyke
// @match        *://greasyfork.org/*/users/*
// @match        *://greasyfork.org/*/scripts*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/gh/kufii/My-UserScripts@22210afba13acf7303fc91590b8265faf3c7eda7/libs/gm_config.js
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/22202/Greasy%20Fork%20-%20Change%20Default%20Script%20Sort.user.js
// @updateURL https://update.greasyfork.org/scripts/22202/Greasy%20Fork%20-%20Change%20Default%20Script%20Sort.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const commonValues = [
    { value: 'daily-installs', text: 'Daily installs' },
    { value: 'total_installs', text: 'Total installs' },
    { value: 'ratings', text: 'Ratings' },
    { value: 'created', text: 'Created date' },
    { value: 'updated', text: 'Updated date' },
    { value: 'name', text: 'Name' }
  ];
  const Config = GM_config([
    {
      key: 'all',
      label: 'All Scripts Sort',
      default: 'daily-installs',
      type: 'dropdown',
      values: commonValues
    },
    {
      key: 'search',
      label: 'Search Sort',
      default: 'relevance',
      type: 'dropdown',
      values: [{ value: 'relevance', text: 'Relevance' }, ...commonValues]
    },
    {
      key: 'user',
      label: 'User Profile Sort',
      default: 'daily-installs',
      type: 'dropdown',
      values: commonValues
    }
  ]);
  GM_registerMenuCommand('GreasyFork Sort Settings', Config.setup);

  const onSearch = location.href.match(
    /^https?:\/\/greasyfork\.org\/.+?\/scripts\/?.*\?.*q=/iu
  );
  const onScripts = location.href.match(
    /^https?:\/\/greasyfork\.org\/.+?\/scripts\/?/iu
  );
  const onProfile = location.href.match(
    /^https?:\/\/greasyfork\.org\/.+?\/users\//iu
  );

  waitForElems({
    sel: '#script-list-sort > ul > li:first-of-type > a',
    stop: true,
    onmatch(defaultSort) {
      const url = new URL(defaultSort.href);
      url.searchParams.set('sort', onSearch ? 'relevance' : 'daily-installs');
      defaultSort.href = url.href;
    }
  });

  const url = new URL(location.href);
  const sort = url.searchParams.get('sort');
  if (!sort) {
    const cfg = Config.load();
    let cfgSort;
    if (onSearch) {
      cfgSort = cfg.search;
    } else if (onScripts) {
      cfgSort = cfg.all;
    } else if (onProfile) {
      cfgSort = cfg.user;
    }
    if (cfgSort) {
      url.searchParams.set('sort', cfgSort);
      window.location.replace(url.href);
    }
  }
})();

// ==UserScript==
// @name         Kitsu External Links
// @namespace    https://greasyfork.org/users/649
// @version      1.0.1
// @description  adds a link to myanimelist and anilist on Kitsu entries
// @author       Adrien Pyke
// @match        *://kitsu.io/*
// @grant        none
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @downloadURL https://update.greasyfork.org/scripts/420706/Kitsu%20External%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/420706/Kitsu%20External%20Links.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const Api = {
    cache: {},
    getId: () =>
      document
        .querySelector('.cover-photo')
        .getAttribute('style')
        .match(/cover_images\/(?<id>\d+)/iu).groups.id,
    getType: () =>
      location.href.match(/kitsu\.io\/(?<type>anime|manga)/iu).groups.type,
    getLinks: async (id, type) => {
      const endpoint = `https://kitsu.io/api/edge/${type}/${id}?include=mappings`;
      if (Api.cache[endpoint]) return Api.cache[endpoint];
      const response = await fetch(endpoint);
      const json = await response.json();
      const mappings = json.included
        .filter(i =>
          i.attributes.externalSite.match(
            /^(myanimelist|anilist)\/(anime|manga)$/iu
          )
        )
        .map(i => i.attributes);
      Api.cache[endpoint] = mappings;
      return mappings;
    }
  };

  const getLinksContainer = container => {
    const node = document.createElement('div');
    node.classList.add('where-to-watch-widget');
    const links = document.createElement('ul');
    links.classList.add('nav');
    node.appendChild(links);
    container.appendChild(node);
    return links;
  };

  const getLinkNode = mapping => {
    const { site, type } = mapping.externalSite.match(
      /^(?<site>myanimelist|anilist)\/(?<type>anime|manga)$/iu
    ).groups;
    const webSite =
      site === 'anilist' ? 'https://anilist.co' : 'https://myanimelist.net';
    const href = `${webSite}/${type}/${mapping.externalId}`;

    const node = document.createElement('li');
    const link = document.createElement('a');
    link.classList.add('hint--top', 'hint--bounce', 'hint--rounded');
    Object.assign(link, { href, target: '_blank', rel: 'noopener noreferrer' });
    link.setAttribute('aria-label', site);
    node.appendChild(link);
    const logo = document.createElement('img');
    Object.assign(logo, {
      src:
        site === 'anilist'
          ? 'https://anilist.co/img/icons/android-chrome-512x512.png'
          : 'https://upload.wikimedia.org/wikipedia/commons/7/7a/MyAnimeList_Logo.png',
      width: '20',
      height: '20'
    });
    link.appendChild(logo);
    return node;
  };

  waitForElems({
    sel: '.media-sidebar',
    onmatch(container) {
      const links = getLinksContainer(container);
      const id = Api.getId();
      const type = Api.getType();
      Api.getLinks(id, type).then(list =>
        list.forEach(m => links.appendChild(getLinkNode(m)))
      );
    }
  });
})();

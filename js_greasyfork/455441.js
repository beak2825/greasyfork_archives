
// ==UserScript==
// @namespace    https://openuserjs.org/users/SB100
// @name         IMDb Torrent Links - Kalindi
// @description  Show links to torrent sites on IMDb film pages
// @version      1.0.0
// @author       SB100
// @copyright    2021, SB100 (https://openuserjs.org/users/SB100)
// @license      MIT
// @include      https://www.imdb.com/title/tt*
// @downloadURL https://update.greasyfork.org/scripts/455441/IMDb%20Torrent%20Links%20-%20Kalindi.user.js
// @updateURL https://update.greasyfork.org/scripts/455441/IMDb%20Torrent%20Links%20-%20Kalindi.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author SB100
// ==/OpenUserJS==

/* jshint esversion: 6 */

/**
 * =============================
 * ADVANCED OPTIONS
 * =============================
 */

(function () {
  const CONFIG = [{
      name: 'PTP',
      icon: 'https://ptpimg.me/732co1.png',
      basePath: 'https://passthepopcorn.me/torrents.php?searchstr=',
    },
    {
      name: 'BTN',
      icon: 'https://ptpimg.me/u23i4l.png',
      basePath: 'https://broadcasthe.net/torrents.php?imdb=',
    },

        {
      name: 'YouTube',
      icon: 'https://www.youtube.com/s/desktop/b4335f76/img/favicon_32.png',
      basePath: 'https://www.youtube.com/results?search_query=',
      extra: {
        useMovieNameInstead: true,
           append: ' trailer'
      },
        },
                      {
      name: 'ktuvit',
      icon: 'https://i.imgur.com/mN6ofGN.png',
      basePath: 'https://www.ktuvit.me/Search.aspx?q=',
      extra: {
        useMovieNameInstead: true,
      },
    },

        {
      name: 'wizdom',
      icon: 'https://www.google.com/s2/favicons?domain=https://wizdom.xyz/#/',
      basePath: 'https://wizdom.xyz/tv/',
    },
                           {
      name: 'subscene',
      icon: 'https://i.imgur.com/9d6AjB8.png',
      basePath: 'https://subscene.com/subtitles/searchbytitle?query=',
             extra: {
        useMovieNameInstead: true,
      },
         },
                          {
      name: 'filelist',
      icon: 'http://i.imgur.com/tfnsPEn.jpg',
      basePath: 'http://filelist.io/browse.php?cat=0&searchin=0&sort=3&search=',
    },
                   {
      name: 'iptorrents',
      icon: 'http://i.imgur.com/cmbcH7k.png',
      basePath: 'http://www.iptorrents.com/t?o=size;q=',
    },
                   {
      name: 'hd-torrents',
      icon: 'http://i.imgur.com/iQfuiyn.png',
      basePath: 'https://hd-torrents.org/torrents.php?&active=0&order=size&search=',
    },
                                     {
      name: 'fuzer',
      icon: 'https://i.imgur.com/NDcWOfZ.png',
      basePath: 'https://www.fuzer.me/browse.php?ref_=basic&query=',
    },
         {
      name: 'hebits',
      icon: 'https://i.imgur.com/OaYzlhT.png',
      basePath: 'https://hebits.net/torrents.php?searchstr=',
             extra: {
        useMovieNameInstead: true,
      },
         },
                      {
      name: 'netflix',
      icon: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.netflix.com/search?q=&size=16',
      basePath: 'https://www.netflix.com/search?q=',
             extra: {
        useMovieNameInstead: true,
      },
    },
         {
             name: 'gaytorrent',
      icon: 'https://i.imgur.com/5pspNDC.png',
      basePath: 'https://www.gaytorrent.ru/browse.php?c45=1&incldead=1&inname=1&indesc=1&infn=1&orderby=size&sort=desc&search=',
             extra: {
        useMovieNameInstead: true,
      },
         },
             {
      name: 'gay-area',
      icon: 'https://i.imgur.com/NQ7frJp.png',
      basePath: 'https://gay-area.org/torrents_beta.php?active=0&options=1&category[]=41&order=size&by=DESC&search=',
             extra: {
        useMovieNameInstead: true,
      },
         },
  ]

  /**
   * =============================
   * END ADVANCED OPTIONS
   * DO NOT MODIFY BELOW THIS LINE
   * =============================
   */

  /**
   * Find the IMDb ID from the URL
   */
  function getTTId() {
    const idMatch = window.location.href.match(/tt[\d]+/);
    return idMatch && idMatch[0];
  }

  /**
   * Find the movie name from the header
   */
  function getMovieName() {
    const name = document.querySelector('[data-testid="hero-title-block__title"]');
    if (!name) {
      return '';
    }

    return name.innerText;
  }

  /**
   * Build a list of icons to be placed into the navigation bar
   */
  function buildIcons(imdbId, movieName) {
    const fragment = document.createDocumentFragment();

    CONFIG.forEach(c => {
      const img = document.createElement('img');
      img.src = c.icon;
      img.title = c.name;
      img.classList.add('t-link__img');

      const searchString = `${c.extra && c.extra.useMovieNameInstead ? movieName : imdbId}${c.extra && c.extra.append ? c.extra.append : ''}`;
      const a = document.createElement('a');
      a.href = `${c.basePath}${encodeURIComponent(searchString)}`
      a.target = '_self'; //blank
      a.rel = 'noopener noreferrer';
      a.classList.add('t-link');

      a.appendChild(img);
      fragment.appendChild(a);
    });

    return fragment;
  }

  /**
   * Add the built list of icons to the navigation bar
   */
  function addIconsToSite(icons) {
    const nav = document.querySelector('[data-testid="hero-subnav-bar-left-block"]');
    if (!nav) {
      return;
    }

    const li = document.createElement('li');
    li.classList.add('ipc-inline-list__item');
    li.appendChild(icons);

    nav.appendChild(li);
  }

  /**
   * Create a style tag to add into the document head, and add some styles to it
   */
  function createCss() {
    const css = `.t-link {
      padding: 0 4px;
      position: relative;
      top: 2px;
  }

  .t-link__img {
      max-width: 24px;
      max-height: 24px;
  }`;

    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));

    document.head.appendChild(style);
  }

    function onload() {
	  createCss();
      const imdbId = getTTId();
      const movieName = getMovieName();
      const icons = buildIcons(imdbId, movieName);
      addIconsToSite(icons);
	}

    window.onload = onload;
})();
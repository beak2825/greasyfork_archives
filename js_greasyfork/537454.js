// ==UserScript==
// @namespace    IMDb Torrent Links -  Hebits
// @name         IMDb Torrent Links -  Hebits
// @description  Show links to torrent sites on IMDb film pages
// @version      V2.0
// @author       iSolt
// @copyright
// @license
// @include      https://www.imdb.com/title/tt*
// @downloadURL https://update.greasyfork.org/scripts/537454/IMDb%20Torrent%20Links%20-%20%20Hebits.user.js
// @updateURL https://update.greasyfork.org/scripts/537454/IMDb%20Torrent%20Links%20-%20%20Hebits.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author iSolt
// ==/OpenUserJS==

/* jshint esversion: 6 */

/**
 * =============================
 * ADVANCED OPTIONS
 * =============================
 */

(function () {
})();
  const CONFIG = [
        {
      name: '_blank',
      icon: 'https://i.imgur.com/Wy2n2fp.gif',
      basePath: '_blank',
      extra: {
        useMovieNameInstead: true,
           append: ''
      },
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
      basePath: 'https://wizdom.xyz/movie/',
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
      name: 'hebits2',
      icon: 'https://i.imgur.com/oJTb6cO.png',
      basePath: 'https://hebits.net/torrents.php?searchstr=',
           },
                      {
      name: 'netflix',
      icon: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.netflix.com/search?q=&size=16',
      basePath: 'https://www.netflix.com/search?q=',
             extra: {
        useMovieNameInstead: true,
      },    },
                                       {
      name: 'disneyplus',
      icon: 'https://i.imgur.com/3pIksB4.jpeg',
      basePath: 'https://www.apps.disneyplus.com/il/explore?search_query=',
             extra: {
        useMovieNameInstead: true,
                                        //https://img.hotstar.com/image/upload/v1711625492/feature/rebranding/disney-plus-favicon.ico

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
      const name = document.querySelector('[data-testid="hero__pageTitle"]');
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

    //window.onload = onload;
onload();
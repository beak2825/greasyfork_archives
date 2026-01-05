// ==UserScript==
// @namespace         https://www.github.com/fytriht/

// @name              movie-easy-download

// @description       在豆瓣电影页面添加电影和字幕的下载链接

// @homepageURL       https://github.com/fytriht/movie-easy-download
// @supportURL        https://github.com/fytriht/movie-easy-download/issues/

// @author            fytriht
// @version           0.0.1
// @license           MIT


// @match             https://movie.douban.com/subject/*
// @grant             none
// @downloadURL https://update.greasyfork.org/scripts/27520/movie-easy-download.user.js
// @updateURL https://update.greasyfork.org/scripts/27520/movie-easy-download.meta.js
// ==/UserScript==

(function () {

  var sites = [
    {
      text: 'rargb',
      api: 'https://rarbg.to/torrents.php?search='
    },
    {
      text: 'torrentz',
      api: 'https://torrentz2.eu/search?f=',
    },
    {
      text: 'addic7ed',
      api: 'http://www.addic7ed.com/search.php?Submit=Search&search='
    },
    {
      text: 'openst',
      api: 'https://www.opensubtitles.org/en/search2/sublanguageid-eng/moviename-'
    }
  ];

  function createEl (querystring) {
    return function (text, api) {
      var el  = document.createElement('span');
      el.innerText = text;
      el.style.margin = '0 5px';
      el.style.color = '#f0f3f5';
      el.addEventListener('click', () => window.open(api + querystring));
      return el;
    };
  }

  function appendTo (cont) {
    return function (el) {
      cont.appendChild(el);
    };
  }

  try {
    var title = document.querySelector('[property="v:itemreviewed"]').innerText;
    var qs = title.match(/[a-z0-9]+/gi).join('%20');

    if (qs === null) return;

    var cont = document.querySelector('#content > h1');

    var appendToCont = appendTo(cont);
    var fn = createEl(qs);

    sites
      .map(site => fn(site.text, site.api))
      .forEach(el => appendToCont(el));
  }
  catch (_) {/* fail silently */}

})();


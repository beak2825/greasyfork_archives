// ==UserScript==
// @name       Manga Loader
// @namespace  http://www.fuzetsu.com/MangaLoader
// @version    1.6.23
// @description  Loads manga chapter into one page in a long strip format, supports switching chapters and works for a variety of sites, minimal script with no dependencies, easy to implement new sites, loads quickly and works on mobile devices through bookmarklet
// @copyright  2014+, fuzetsu
// @noframes
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
// @grant GM_registerMenuCommand
// @match http://bato.to/read/*
// @match http://mangafox.me/manga/*/*/*
// @match http://readms.com/r/*/*/*/*
// @match http://mangastream.com/read/*/*/*/*
// @match http://g.e-hentai.org/s/*/*
// @match http://exhentai.org/s/*/*
// @match *://www.fakku.net/*/*/read*
// @match http://www.mangareader.net/*/*
// @match http://www.mangahere.co/manga/*/*
// @match http://www.mangapanda.com/*/*
// @match http://mangapark.me/manga/*/*/*/*
// @match http://mangacow.co/*/*
// @match http://nowshelf.com/watch/*
// @match http://nhentai.net/g/*/*
// @match http://centraldemangas.org/online/*/*
// @match http://*.com.br/leitura/online/capitulo/*
// @match http://www.mangatown.com/manga/*/*
// @match http://manga-joy.com/*/*
// @match http://*.dm5.com/m*
// @match http://*.senmanga.com/*/*/*
// @match http://www.japscan.com/lecture-en-ligne/*
// @match http://www.pecintakomik.com/manga/*/*
// @match http://dynasty-scans.com/chapters/*
// @match http://mangawall.com/manga/*/*
// @match http://manga.animea.net/*
// @match http://kissmanga.com/Manga/*/*
// @match http://view.thespectrum.net/series/*
// @match http://manhua.dmzj.com/*/*
// @match http://www.8muses.com/picture/*/category/*
// @match http://hqbr.com.br/hqs/*/capitulo/*/leitor/0
// @match http://www.dmzj.com/view/*/*
// @match http://mangaindo.id/*/*
// @match *://hitomi.la/reader/*
// @match http://www.doujin-moe.us/*
// @match http://mangadoom.co/*/*
// @match http://www.mangago.me/read-manga/*/*/*/*
// @match http://mangalator.ch/show.php?gallery=*
// @match http://eatmanga.com/Manga-Scan/*/*
// @match http://www.mangacat.me/*/*/*
// @match http://pururin.com/view/*
// @match http://www.hentairules.net/galleries*/picture.php*
// @match http://www.mangakaka.com/*/*
// @match http://www.readmanga.today/*/*
// @match http://manga.redhawkscans.com/reader/read/*
// @match http://reader.s2smanga.com/read/*
// @match http://casanovascans.com/read/*
// @downloadURL https://update.greasyfork.org/scripts/10829/Manga%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/10829/Manga%20Loader.meta.js
// ==/UserScript==

// should be set to true externally if auto loading is wanted (e.g. bookmarklet)
var BM_MODE;

// short reference to unsafeWindow (or window if unsafeWindow is unavailable e.g. bookmarklet)
var W = (typeof unsafeWindow === 'undefined') ? window : unsafeWindow;

var scriptName = 'Manga Loader';
var pageTitle = document.title;

var IMAGES = {
  refresh_large: '//rgeorgeeb-tilebuttongenerator.googlecode.com/hg-history/c35993682c2d50149976fd7a1f302f8c01a88716/asset-studio/src/res/clipart/icons/refresh.svg'
};

/**
Sample Implementation:
{
    name: 'something' // name of the implementation 
  , match: "http://domain.com/.*" // the url to react to for manga loading
  , img: '#image' // css selector to get the page's manga image
  , next: '#next_page' // css selector to get the link to the next page
  , numpages: '#page_select' // css selector to get the number of pages. elements like (select, span, etc)
  , curpage: '#page_select' // css selector to get the current page. usually the same as numPages if it's a select element
  , nextchap: '#next_chap' // css selector to get the link to the next chapter
  , prevchap: '#prev_chap' // same as above except for previous
  , wait: 3000 // how many ms to wait before auto loading (to wait for elements to load)
  , pages: function(next_url, current_page_number, callback, extract_function) {
    // gets called requesting a certain page number (current_page_number)
    // to continue loading execute callback with img to append as first parameter and next url as second parameter
    // only really needs to be used on sites that have really unusual ways of loading images or depend on javascript
  }

  Any of the CSS selectors can be functions instead that return the desired value.
}
*/

var implementations = [{
  name: 'batoto',
  match: "^http://bato.to/read/.*",
  img: function(ctx) {
    var img = getEl('#comic_page', ctx);
    if(img) {
      return img.src;
    } else {
      var imgs = getEls('#content > div:nth-child(8) > img', ctx).map(function(page) {
        return page.src;
      });
      if(imgs.length > 0) {
        this.next = function() { return imgs[0]; };
        this.numpages = function() { return imgs.length; };
        this.pages = function(url, num, cb, ex) {
          cb(imgs[num - 1], num);
        };
        return imgs[0];
      }
    }
  },
  next: '#full_image + div > a',
  numpages: '#page_select',
  curpage: '#page_select',
  nextchap: 'select[name=chapter_select]',
  prevchap: 'select[name=chapter_select]',
  invchap: true
}, {
  name: 'manga-panda',
  match: "^http://www.mangapanda.com/.*/[0-9]*",
  img: '#img',
  next: '.next a',
  numpages: '#pageMenu',
  curpage: '#pageMenu',
  nextchap: 'td.c5 + td a',
  prevchap: 'table.c6 tr:last-child td:last-child a'
}, {
  name: 'mangafox',
  match: "^http://mangafox.me/manga/[^/]*/[^/]*/[^/]*",
  img: '#image',
  next: 'a.next_page',
  numpages: function() {
    return extractInfo('select.m') - 1;
  },
  curpage: 'select.m',
  nextchap: '#chnav p + p a',
  prevchap: '#chnav a'
}, {
  name: 'manga-stream',
  match: "^http://(readms|mangastream).com/(r|read)/[^/]*/[^/]*/[^/]*",
  img: '#manga-page',
  next: '.next a',
  numpages: function() {
    var lastPage = getEl('.subnav-wrapper .controls .btn-group:last-child ul li:last-child');
    return parseInt(lastPage.textContent.match(/[0-9]/g).join(''), 10);
  },
  nextchap: function(prev) {
    var found;
    var chapters = [].slice.call(document.querySelectorAll('.controls > div:first-child > .dropdown-menu > li a'));
    chapters.pop();
    for (var i = 0; i < chapters.length; i++) {
      if (window.location.href.indexOf(chapters[i].href) !== -1) {
        found = chapters[i + (prev ? 1 : -1)];
        if (found) return found.href;
      }
    }
  },
  prevchap: function() {
    return this.nextchap(true);
  }
}, {
  name: 'manga-reader',
  match: "^http://www.mangareader.net/.*/.*",
  img: '#img',
  next: '.next a',
  numpages: '#pageMenu',
  curpage: '#pageMenu',
  nextchap: '#chapterMenu',
  prevchap: '#chapterMenu',
  wait: function() {
    return getEl('#chapterMenu option');
  }
}, {
  name: 'manga-town',
  match: "^http://www.mangatown.com/manga/[^/]+/[^/]+",
  img: '#image',
  next: '#viewer a',
  numpages: '.page_select select',
  curpage: '.page_select select',
  nextchap: '#top_chapter_list',
  prevchap: '#top_chapter_list',
  wait: 1000
}, {
  name: 'manga-cow, manga-doom, manga-indo',
  match: "^http://(mangacow|mangadoom|mangaindo)\\.(co|id)/[^/]+/[0-9.]+",
  img: '.prw a > img',
  next: '.prw a',
  numpages: 'select.cbo_wpm_pag',
  curpage: 'select.cbo_wpm_pag',
  nextchap: function(prev) {
    var next = extractInfo('select.cbo_wpm_chp', {type: 'value', val: (prev ? 1 : -1)});
    if(next) return window.location.href.replace(/\/[0-9.]+\/?([0-9]+\/?)?[^/]*$/, '/' + next);
  },
  prevchap: function() {
    return this.nextchap(true);
  }
}, {
  name: 'manga-here',
  match: "^http://www.mangahere.co/manga/[^/]+/[^/]+",
  img: '#viewer img',
  next: '#viewer a',
  numpages: 'select.wid60',
  curpage: 'select.wid60',
  nextchap: function(prev) {
    var chapter = W.chapter_list[W.current_chapter_index + (prev ? -1 : 1)];
    return chapter && chapter[1];
  },
  prevchap: function() {
    return this.nextchap(true);
  },
  wait: function() {
    return areDefined(W.current_chapter_index, W.chapter_list);
  }
}, {
  name: 'manga-park',
  match: "^http://mangapark\\.me/manga/[^/]+/[^/]+/[^/]+",
  img: '.img-link > img',
  next: '.page > span:last-child > a',
  numpages: '#sel_page_1',
  curpage: '#sel_page_1',
  nextchap: function(prev) {
    var next = extractInfo('#sel_book_1', {type: 'value', val: (prev ? -1 : 1)});
    if(next) return window.location.href.replace(/\/s[0-9.]\/c[0-9.](\/[^\/]+)?$/, next + '/1');
  },
  prevchap: function() {
    return this.nextchap(true);
  }
}, {
  name: 'central-de-mangas',
  match: "^http://(centraldemangas\\.org|[^\\.]+\\.com\\.br/leitura)/online/[^/]*/[0-9]*",
  img: '#manga-page',
  next: '#manga-page',
  numpages: '#manga_pages',
  curpage: '#manga_pages',
  nextchap: function(prev) {
    var next = extractInfo('#manga_caps', {type: 'value', val: (prev ? -1 : 1)});
    if(next) return window.location.href.replace(/[^\/]+$/, next);
  },
  prevchap: function() {
    return this.nextchap(true);
  },
  pages: function(url, num, cb, ex) {
    url = url.slice(0, url.lastIndexOf('-') + 1) + ("0" + num).slice(-2) + url.slice(url.lastIndexOf('.'));
    cb(url, url);
  }
}, {
  name: 'manga-joy',
  match: "^http://manga-joy.com/[^/]*/[0-9]*",
  img: '.prw img',
  next: '.nxt',
  numpages: '.wpm_nav_rdr li:nth-child(3) > select',
  curpage: '.wpm_nav_rdr li:nth-child(3) > select',
  nextchap: function(prev) {
    var next = extractInfo('.wpm_nav_rdr li:nth-child(2) > select', {type: 'value', val: prev ? 1 : -1});
    if(next) return window.location.href.replace(/\/[0-9.]+\/?([0-9]+(\/.*)?)?$/, '/' + next);
  },
  prevchap: function() {
    return this.nextchap(true);
  }
}, {
  name: 'geh-and-exh',
  match: "^http://(g.e-hentai|exhentai).org/s/.*/.*",
  img: '.sni > a > img, #img',
  next: '.sni > a, #i3 a',
  numpages: 'body > div > div:nth-child(2) > div > span:nth-child(2)',
  curpage: 'body > div > div:nth-child(2) > div > span:nth-child(1)'
}, {
  name: 'fakku',
  match: "^http(s)?://www.fakku.net/.*/.*/read",
  img: '.current-page',
  next: '.current-page',
  numpages: '.drop',
  curpage: '.drop',
  pages: function(url, num, cb, ex) {
    var firstNum = url.lastIndexOf('/'),
        lastDot = url.lastIndexOf('.');
    var c = url.charAt(firstNum);
    while (c && !/[0-9]/.test(c)) {
      c = url.charAt(++firstNum);
    }
    var curPage = parseInt(url.slice(firstNum, lastDot), 10);
    url = url.slice(0, firstNum) + ('00' + (curPage + 1)).slice(-3) + url.slice(lastDot);
    cb(url, url);
  }
}, {
  name: 'nowshelf',
  match: "^http://nowshelf.com/watch/[0-9]*",
  img: '#image',
  next: '#image',
  numpages: function() {
    return parseInt(getEl('#page').textContent.slice(3), 10);
  },
  curpage: function() {
    return parseInt(getEl('#page > input').value, 10);
  },
  pages: function(url, num, cb, ex) {
    cb(page[num], num);
  }
}, {
  name: 'nhentai',
  match: "^http://nhentai\\.net\\/g\\/[0-9]*/[0-9]*",
  img: '#image-container > a > img',
  next: '#image-container > a > img',
  numpages: '.num-pages',
  curpage: '.current',
  pages: function(url, num, cb, ex) {
    url = url.replace(/\/[^\/]*$/, '/') + num;
    cb(url, url);
  }
}, {
  name: 'dm5',
  match: "^http://[^\\.]*\\.dm5\\.com/m[0-9]*",
  img: '#cp_image',
  next: '#cp_image',
  numpages: '#pagelist',
  curpage: '#pagelist',
  pages: function(url, num, cb, ex) {
    var cid = window.location.href.match(/m[0-9]*/g)[2].slice(1),
        xhr = new XMLHttpRequest();
    xhr.open('get', 'chapterfun.ashx?cid=' + cid + '&page=' + num);
    xhr.onload = function() {
      var images = eval(xhr.responseText);
      cb(images[0], images[0]);
    };
    xhr.send();
  }
}, {
  name: 'senmanga',
  match: "^http://raw\\.senmanga\\.com/[^/]*/[^/]*/[0-9]*",
  img: function() {
    return W.new_image;
  },
  next: function() {
    return this.img();
  },
  numpages: 'select[name=page]',
  curpage: 'select[name=page]',
  nextchap: function(prev) {
    var next = extractInfo('select[name=chapter]', {type: 'value', val: (prev ? 1 : -1)});
    if(next) return window.location.href.replace(/\/[^\/]*\/[0-9]+\/?$/, '') + '/' + next + '/1';
  },
  prevchap: function() {
    return this.nextchap(true);
  },
  pages: function(url, num, cb, ex) {
    cb(W.new_image.replace(/page=[0-9]+/, 'page=' + num), num);
  }
}, {
  name: 'japscan',
  match: "^http://www\\.japscan\\.com/lecture-en-ligne/[^/]*/[0-9]*",
  img: '#imgscan',
  next: '#next_link',
  numpages: '#pages',
  curpage: '#pages',
  nextchap: '#next_chapter',
  prevchap: '#back_chapter'
}, { // pecintakomik
  match: "^http://www\\.pecintakomik\\.com/manga/[^/]*/[^/]*",
  img: '.picture',
  next: '.pager a:nth-child(3)',
  numpages: 'select[name=page]',
  curpage: 'select[name=page]',
  nextchap: function(prev) {
    var next = extractInfo('select[name=chapter]', {type: 'value', val: (prev ? 1 : -1)});
    if(next) return window.location.href.replace(/\/([^\/]+)\/[0-9]+\/?$/, '/$1/' + next);
  },
  prevchap: function() {
    return this.nextchap(true);
  }
}, {
  name: 'dynasty-scans',
  match: "^http://dynasty-scans.com/chapters/.*",
  img: '#image > img',
  next: '#image > img',
  numpages: function() {
    return W.pages.length;
  },
  curpage: function() {
    return parseInt(getEl('#image > div.pages-list > a.page.active').textContent);
  },
  nextchap: '#next_link',
  prevchap: '#prev_link',
  pages: function(url, num, cb, ex) {
    url = W.pages[num - 1].image;
    cb(url, url);
  }
}, {
  name: 'manga-kaka',
  match: "^http://www\\.mangakaka\\.com/[^/]+/[0-9]+",
  img: 'img.manga-page',
  next: '.nav_pag > li:nth-child(1) > a',
  numpages: 'select.cbo_wpm_pag',
  curpage: 'select.cbo_wpm_pag',
  nextchap: function(prev) {
    var chapter = extractInfo('select.cbo_wpm_chp', { type: 'value', val: (prev ? 1 : -1) });
    if(chapter) return window.location.href.replace(/\/[0-9\.]+\/?([0-9]+\/?)?$/, '/' + chapter);
  },
  prevchap: function() {
    return this.nextchap(true);
  }
}, {
  name: 'manga-wall',
  _page: null,
  match: "^http://mangawall\\.com/manga/[^/]*/[0-9]*",
  img: 'img.scan',
  next: function() {
    if(this._page === null) this._page = W.page;
    return W.series_url + '/' + W.chapter + '/' + (this._page += 1);
  },
  numpages: '.pageselect',
  curpage: '.pageselect',
  nextchap: function(prev) {
    return W.series_url + '/' + (parseInt(W.chapter.slice(1)) + (prev ? -1 : 1)) + '/1';
  },
  prevchap: function() {
    return this.nextchap(true);
  }
}, {
  name: 'anime-a',
  _page: null,
  match: "^http://manga\\.animea.net/.+chapter-[0-9]+(-page-[0-9]+)?.html",
  img: '#scanmr',
  next: function() {
    if(this._page === null) this._page = W.page;
    return W.series_url + W.chapter + '-page-' + (this._page += 1) + '.html';
  },
  numpages: '.pageselect',
  curpage: '.pageselect',
  nextchap: function(prev) {
    return W.series_url + 'chapter-' + (parseInt(W.chapter.match(/[0-9]+/)[0]) + (prev ? -1 : 1)) + '-page-1.html';
  },
  prevchap: function() {
    return this.nextchap(true);
  }
}, {
  name: 'kiss-manga',
  match: "^http://kissmanga\\.com/Manga/[^/]+/.+",
  img: '#divImage img',
  next: '#divImage img',
  numpages: function() {
    return W.lstImages.length;
  },
  curpage: function() {
    if(getEls('#divImage img').length > 1) {
      return 1;
    } else {
      return W.currImage + 1;
    }
  },
  nextchap: '#selectChapter, .selectChapter',
  prevchap: '#selectChapter, .selectChapter',
  pages: function(url, num, cb, ex) {
    cb(W.lstImages[num - 1], num);
  }
}, {
  name: 'the-spectrum-scans',
  match: "^http://view\\.thespectrum\\.net/series/[^\\.]+\\.html\\?ch=[^&]+&page=[0-9]+",
  img: '#mainimage',
  next: '#mainimage',
  numpages: '.selectpage',
  curpage: '.selectpage',
  nextchap: function(prev) {
    var next = extractInfo('.selectchapter', {type: 'value', val: prev ? -1 : 1});
    if(next) return window.location.href.replace(/ch=.+/, 'ch=' + next + '&page=1');
  },
  prevchap: function() {
    return this.nextchap(true);
  },
  pages: function(url, num, cb, ex) {
    var numRegex = /([0-9]+)\.([a-z]+)$/;
    var curNum = url.match(numRegex);
    curNum = parseInt(curNum[1]) + 1;
    url = url.replace(numRegex, ('00' + curNum).slice(-3) + '.$2');
    cb(url, url);
  }
}, {
  name: 'manhua-dmzj',
  match: "http://manhua.dmzj.com/[^/]*/[0-9]+(-[0-9]+)?\\.shtml",
  img: '.pic_link',
  next: '.pic_link',
  numpages: function() {
    return W.arr_pages.length;
  },
  curpage: function() {
    return W.COMIC_PAGE.getPageNumber();
  },
  nextchap: '#next_chapter',
  prevchap: '#prev_chapter',
  pages: function(url, num, cb, ex) {
    cb(W.img_prefix + W.arr_pages[num - 1], num);
  }
}, {
  name: '8muses',
  match: "http://www.8muses.com/picture/[^/]+/category/.+",
  img: '.image',
  next: '.imgLiquidFill > a'
}, {
  name: 'hqbr',
  match: "http://hqbr.com.br/hqs/[^/]+/capitulo/[0-9]+/leitor/0",
  img: '#hq-page',
  next: '#hq-page',
  numpages: function() {
    return W.pages.length;
  },
  curpage: function() {
    return W.paginaAtual + 1;
  },
  nextchap: function(prev) {
    var chapters = getEls('#chapter-dropdown a'),
        current = parseInt(W.capituloIndex),
        chapter = chapters[current + (prev ? -1 : 1)];
    return chapter && chapter.href;
  },
  prevchap: function() {
    return this.nextchap(true);
  },
  pages: function(url, num, cb, ex) {
    cb(W.pages[num - 1], num);
  }
}, {
  name: 'dmzj',
  match: "http://www.dmzj.com/view/[^/]+/.+\\.html",
  img: '#pic',
  next: '#pic',
  numpages: '.select_jump',
  curpage: '.select_jump',
  nextchap: '.next > a',
  prevchap: '.pre > a',
  pages: function(url, num, cb, ex) {
    cb('http://images.dmzj.com/' + W.pic[num - 1], num);
  },
  wait: 1000
}, {
  name: 'hitomi',
  match: "http(s)?://hitomi.la/reader/[0-9]+.html",
  img: '#comicImages > img',
  next: '#comicImages > img',
  numpages: function() {
    return W.images.length;
  },
  curpage: function() {
    return parseInt(W.curPanel);
  },
  pages: function(url, num, cb, ex) {
    cb(W.images[num - 1].path, num);
  }
}, {
  name: 'doujin-moe',
  _pages: null,
  match: "http://www.doujin-moe.us/.+",
  img: 'img.picture',
  next: 'img.picture',
  numpages: function() {
    if(!this._pages) {
      this._pages = getEls('#gallery djm').map(function(file) {
        return file.getAttribute('file');
      });
    }
    return this._pages.length;
  },
  curpage: function() {
    return parseInt(getEl('.counter').textContent.match(/^[0-9]+/)[0]);
  },
  pages: function(url, num, cb, ex) {
    cb(this._pages[num - 1], num);
  }
}, {
  name: 'mangago',
  match: "http://www.mangago.me/read-manga/[^/]+/[^/]+/[^/]+",
  img: '#page1',
  next: '#pic_container',
  numpages: '#dropdown-menu-page',
  curpage: function() {
    return parseInt(getEls('#page-mainer a.btn.dropdown-toggle')[1].textContent.match(/[0-9]+/)[0]);
  },
  nextchap: function(prev) {
    var chapters = getEls('ul.dropdown-menu.chapter a'),
        curName = getEls('#page-mainer a.btn.dropdown-toggle')[0].textContent,
        curIdx;
    chapters.some(function(chap, idx) {
      if(chap.textContent.indexOf(curName) === 0) {
        curIdx = idx;
        return true;
      }
    });
    var chapter = chapters[curIdx + (prev ? 1 : -1)];
    return chapter && chapter.href;
  },
  prevchap: function() {
    return this.nextchap(true);
  }
}, {
  name: 'mangalator',
  match: "http://mangalator.ch/show.php\\?gallery=[0-9]+",
  img: '.image img',
  next: '#next',
  numpages: 'select[name=image]',
  curpage: 'select[name=image]',
  nextchap: function(prev) {
    var next = extractInfo('select[name=gallery]', {type: 'value', val: (prev ? 1 : -1)});
    if(next) return location.href.replace(/\?gallery=[0-9]+/, '?gallery=' + next);
  },
  prevchap: function() {
    return this.nextchap(true);
  }
}, {
  name: 'eatmanga',
  match: "http://eatmanga.com/Manga-Scan/[^/]+/.+",
  img: '#main_content img',
  next: '#page_next',
  numpages: '#pages',
  curpage: '#pages',
  nextchap: '#bottom_chapter_list',
  prevchap: '#bottom_chapter_list',
  invchap: true
}, {
  name: 'manga-cat',
  match: "http://www.mangacat.me/[^/]+/[^/]+/[^\\.]+.html",
  img: '.img',
  next: '.img-link',
  numpages: '#page',
  curpage: '#page',
  nextchap: '.info a:nth-child(4)',
  prevchap: '.info a:nth-child(2)'
}, {
  name: 'pururin',
  match: "^http://pururin\\.com/view/.+\\.html",
  img: '.image img',
  next: 'a.image-next',
  numpages: 'select.image-pageSelect',
  curpage: 'select.image-pageSelect'
}, {
  name: 'hentai-rules',
  match: "^http://www\\.hentairules\\.net/galleries[0-9]+/picture\\.php.+",
  img: '#theMainImage',
  next: '#linkNext',
  imgmod: {
    altProp: 'data-src'
  },
  numpages: function(cur) {
    return parseInt(getEl('.imageNumber').textContent.replace(/([0-9]+)\/([0-9]+)/, cur ? '$1' : '$2'));
  },
  curpage: function() {
    return this.numpages(true);
  }
}, {
  name: 'ero-senmanga',
  match: "^http://ero\\.senmanga\\.com/[^/]*/[^/]*/[0-9]*",
  img: '#picture',
  next: '#omv > table > tbody > tr:nth-child(2) > td > a',
  numpages: 'select[name=page]',
  curpage: 'select[name=page]',
  nextchap: function(prev) {
    var next = extractInfo('select[name=chapter]', {type: 'value', val: (prev ? -1 : 1)});
    if(next) return window.location.href.replace(/\/[^\/]*\/[0-9]+\/?$/, '') + '/' + next + '/1';
  },
  prevchap: function() {
    return this.nextchap(true);
  }
}, {
  name: 'readmanga.today',
  match: "http://www\\.readmanga\\.today/[^/]+/.+",
  img: '.page_chapter img',
  next: '.list-switcher-2 > li:nth-child(3) > a',
  numpages: '.list-switcher-2 select[name=category_type]',
  curpage: '.list-switcher-2 select[name=category_type]',
  nextchap: '.jump-menu[name=chapter_list]',
  prevchap: '.jump-menu[name=chapter_list]',
  invchap: true
}, {
  name: 'foolslide',
  match: "^(http://manga.redhawkscans.com/reader/read/.+|http://reader.s2smanga.com/read/.+|http://casanovascans.com/read/.+)",
  img: 'img.open',
  next: 'img.open',
  numpages: function() {
    return W.pages.length;
  },
  curpage: function() {
    return W.current_page + 1;
  },
  nextchap: function(prev) {
    var desired;
    var dropdown = getEls('ul.dropdown')[1] || getEls('ul.uk-nav')[1];
    if(!dropdown) return;
    getEls('a', dropdown).forEach(function(chap, idx, arr) {
      if(location.href.indexOf(chap.href) === 0) desired = arr[idx + (prev ? 1 : -1)];
    });
    return desired && desired.href;
  },
  prevchap: function() {
    return this.nextchap(true);
  },
  pages: function(url, num, cb, ex) {
    cb(W.pages[num - 1].url, num);
  },
  wait: function() {
    return W.pages;
  }
}];

var log = function(msg, type) {
  type = type || 'log';
  if (type === 'exit') {
    throw scriptName + ' exit: ' + msg;
  } else {
    console[type]('%c' + scriptName + ' ' + type + ':', 'font-weight:bold;color:green;', msg);
  }
};

var getEl = function(q, c) {
  if (!q) return;
  return (c || document).querySelector(q);
};

var getEls = function(q, c) {
  return [].slice.call((c || document).querySelectorAll(q));
};

var storeGet = function(key) {
  if (typeof GM_getValue === "undefined") {
    var value = localStorage.getItem(key);
    if (value === "true" || value === "false") {
      return (value === "true") ? true : false;
    }
    return value;
  }
  return GM_getValue(key);
};

var storeSet = function(key, value) {
  if (typeof GM_setValue === "undefined") {
    return localStorage.setItem(key, value);
  }
  return GM_setValue(key, value);
};

var storeDel = function(key) {
  if (typeof GM_deleteValue === "undefined") {
    return localStorage.removeItem(key);
  }
  return GM_deleteValue(key);
};

var areDefined = function() {
  return [].every.call(arguments, function(arg) {
    return arg !== undefined && arg !== null;
  });
};

var extractInfo = function(selector, mod, context) {
  selector = this[selector] || selector;
  if (typeof selector === 'function') {
    return selector.call(this, context);
  }
  var elem = getEl(selector, context),
      option;
  mod = mod || {};
  if (elem) {
    switch (elem.nodeName.toLowerCase()) {
      case 'img':
        return (mod.altProp && elem.getAttribute(mod.altProp)) || elem.src || elem.getAttribute('src');
      case 'a':
        return elem.href || elem.getAttribute('href');
      case 'ul':
        return elem.children.length;
      case 'select':
        switch (mod.type) {
          case 'index':
            return elem.options.selectedIndex + 1;
          case 'value':
            option = elem.options[elem.options.selectedIndex + (mod.val || 0)] || {};
            return option.value;
          default:
            return elem.options.length;
        }
        break;
      default:
        switch (mod.type) {
          case 'index':
            return parseInt(elem.textContent);
          default:
            return elem.textContent;
        }
    }
  }
};

var addStyle = function() {
  if (!this.MLStyle) {
    this.MLStyle = document.createElement('style');
    this.MLStyle.dataset.name = 'ml-style';
    document.head.appendChild(this.MLStyle);
  }
  this.MLStyle.textContent += [].join.call(arguments, '\n');
};

var toStyleStr = function(obj, selector) {
  var stack = [],
      key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      stack.push(key + ':' + obj[key]);
    }
  }
  if (selector) {
    return selector + '{' + stack.join(';') + '}';
  } else {
    return stack.join(';');
  }
};

var throttle = function(callback, limit) {
  var wait = false;
  return function() {
    if (!wait) {
      callback();
      wait = true;
      setTimeout(function() {
        wait = false;
      }, limit);
    }
  };
};

var createButton = function(text, action, styleStr) {
  var button = document.createElement('button');
  button.textContent = text;
  button.onclick = action;
  button.setAttribute('style', styleStr || '');
  return button;
};

var getViewer = function(prevChapter, nextChapter) {
  var viewerCss = toStyleStr({
    'background-color': 'white',
    'font': '0.813em courier',
    'text-align': 'center',
  }, 'body'),
      imagesCss = toStyleStr({
        'margin-top': '10px',
        'margin-bottom': '10px'
      }, '.ml-images'),
      imageCss = toStyleStr({
        'max-width': '100%',
        'display': 'block',
        'margin': '3px auto'
      }, '.ml-images img'),
      counterCss = toStyleStr({
        'background-color': '#222',
        'color': 'white',
        'border-radius': '10px',
        'width': '30px',
        'margin-left': 'auto',
        'margin-right': 'auto',
        'margin-top': '-12px',
        'padding-left': '5px',
        'padding-right': '5px',
        'border': '1px solid white',
        'z-index': '100',
        'position': 'relative'
      }, '.ml-counter'),
      navCss = toStyleStr({
        'text-decoration': 'none',
        'color': 'white',
        'background-color': '#444',
        'padding': '3px 10px',
        'border-radius': '5px',
        'transition': '250ms'
      }, '.ml-chap-nav a'),
      navHoverCss = toStyleStr({
        'background-color': '#555'
      }, '.ml-chap-nav a:hover'),
      boxCss = toStyleStr({
        'position': 'fixed',
        'background-color': '#222',
        'color': 'white',
        'padding': '7px',
        'border-top-left-radius': '5px',
        'cursor': 'default'
      }, '.ml-box'),
      statsCss = toStyleStr({
        'bottom': '0',
        'right': '0',
        'opacity': '0.4',
        'transition': '250ms'
      }, '.ml-stats'),
      statsCollapseCss = toStyleStr({
        'color': 'orange',
        'cursor': 'pointer'
      }, '.ml-stats-collapse'),
      statsHoverCss = toStyleStr({
        'opacity': '1'
      }, '.ml-stats:hover'),
      manualReloadCss = toStyleStr({
        'cursor': 'pointer'
      }, '.ml-manual-reload'),
      floatingMsgCss = toStyleStr({
        'bottom': '50px',
        'right': '0',
        'border-bottom-left-radius': '5px',
        'text-align': 'left',
        'font': 'inherit',
        'max-width': '95%',
        'white-space': 'pre-wrap'
      }, '.ml-floating-msg'),
      infoButtonCss = toStyleStr({
        'cursor': 'pointer'
      }, '.ml-info-button');
  // clear all styles and scripts
  var title = document.title;
  document.head.innerHTML = '<meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">';
  document.title = title;
  // navigation
  var nav = '<div class="ml-chap-nav">' + (prevChapter ? '<a class="ml-chap-prev" href="' + prevChapter + '">Prev Chapter</a> ' : '') +
      '<a class="ml-exit" href="" data-exit="true">Exit</a> ' +
      (nextChapter ? '<a class="ml-chap-next" href="' + nextChapter + '">Next Chapter</a>' : '') + '</div>';
  // message area
  var floatingMsg = '<pre class="ml-box ml-floating-msg"></pre>';
  // stats
  var stats = '<div class="ml-box ml-stats"><span title="hide stats" class="ml-stats-collapse">&gt;&gt;</span><span class="ml-stats-content"><span class="ml-stats-pages"></span> <i class="fa fa-info ml-info-button" title="See userscript information and help"></i> <i class="fa fa-refresh ml-manual-reload" title="Manually refresh next clicked image."></i></span></div>';
  // combine ui elements
  document.body.innerHTML = nav + '<div class="ml-images"></div>' + nav + floatingMsg + stats;
  // add all styles to the page
  addStyle(viewerCss, imagesCss, imageCss, counterCss, navCss, navHoverCss, statsCss, statsCollapseCss, statsHoverCss, manualReloadCss, boxCss, floatingMsgCss, infoButtonCss);
  // set up return UI object
  var UI = {
    images: getEl('.ml-images'),
    statsContent: getEl('.ml-stats-content'),
    statsPages: getEl('.ml-stats-pages'),
    statsCollapse: getEl('.ml-stats-collapse'),
    btnManualReload: getEl('.ml-manual-reload'),
    btnInfo: getEl('.ml-info-button'),
    floatingMsg: getEl('.ml-floating-msg'),
    btnNextChap: getEl('.ml-chap-next'),
    btnPrevChap: getEl('.ml-chap-prev'),
    btnExit: getEl('.ml-exit')
  };
  // message func
  var messageId = null;
  var showFloatingMsg = function(msg, timeout) {
    clearTimeout(messageId);
    log(msg);
    UI.floatingMsg.textContent = msg;
    UI.floatingMsg.style.display = msg ? '' : 'none';
    if(timeout) {
      messageId = setTimeout(function() {
        showFloatingMsg('');
      }, timeout);
    }
  };
  // configure initial state
  UI.floatingMsg.style.display = 'none';
  // set up listeners
  document.addEventListener('click', function(evt) {
    if (evt.target.nodeName === 'A') {
      if(evt.target.className.indexOf('ml-chap') !== -1) {
        log('next chapter will autoload');
        storeSet('autoload', 'yes');
      } else if(evt.target.className.indexOf('ml-exit') !== -1) {
        log('exiting chapter, stop autoload');
        storeSet('autoload', 'no');
      }
    }
  });
  UI.btnManualReload.addEventListener('click', function(evt) {
    var imgClick = function(e) {
      var target = e.target;
      UI.images.removeEventListener('click', imgClick, false);
      UI.images.style.cursor = '';
      if(target.nodeName === 'IMG' && target.parentNode.className === 'ml-images') {
        showFloatingMsg('');
        if(!target.title) {
          showFloatingMsg('Reloading "' + target.src + '"', 3000);
          if(target.complete) target.onload = null;
          target.src = target.src + (target.src.indexOf('?') !== -1 ? '&' : '?') + new Date().getTime();
        }
      } else {
        showFloatingMsg('Cancelled manual reload...', 3000);
      }
    };
    showFloatingMsg('Left click the image you would like to reload.\nClick on the page margin to cancel.');
    UI.images.style.cursor = 'pointer';
    UI.images.addEventListener('click', imgClick, false);
  });
  UI.statsCollapse.addEventListener('click', function(evt) {
    var test = UI.statsCollapse.textContent === '>>';
    UI.statsContent.style.display = test ? 'none' : '';
    UI.statsCollapse.textContent = test ? '<<' : '>>';
  });
  UI.btnInfo.addEventListener('click', function(evt) {
    if(UI.floatingMsg.textContent) {
      showFloatingMsg('');
    } else {
      showFloatingMsg('Information:\n' +
                      'Nothing to say yet, but messages about new features will appear here in the future.\n\n' +
                      'Keybindings:\n' +
                      'Z - previous chapter\n' +
                      'X - exit\n' +
                      'C - next chapter\n\n' +
                      'Click the info button again to close this message.');
    }
  });
  // keybindings
  UI.keys = {
    PREV_CHAP: 90, EXIT: 88, NEXT_CHAP: 67
  };
  UI._keys = {};
  Object.keys(UI.keys).forEach(function(action) {
    UI._keys[UI.keys[action]] = action;
  });
  window.addEventListener('keydown', function(evt) {
    // perform action
    switch(evt.keyCode) {
      case UI.keys.PREV_CHAP:
        if(UI.btnPrevChap) {
          UI.btnPrevChap.click();
        }
        break;
      case UI.keys.EXIT:
        UI.btnExit.click();
        break;
      case UI.keys.NEXT_CHAP:
        if(UI.btnNextChap) {
          UI.btnNextChap.click();
        }
        break;
    }
  }, true);
  return UI;
};

var getCounter = function(imgNum) {
  var counter = document.createElement('div');
  counter.classList.add('ml-counter');
  counter.textContent = imgNum;
  return counter;
};

var addImage = function(src, loc, imgNum, callback) {
  if(!src) return;
  var image = new Image(),
      counter = getCounter(imgNum);
  image.onerror = function() {
    log('failed to load ' + src);
    image.onload = null;
    image.style.backgroundColor = 'white';
    image.style.cursor = 'pointer';
    image.title = 'Reload?';
    image.src = IMAGES.refresh_large;
    image.onclick = function() {
      image.onload = callback;
      image.title = '';
      image.style.cursor = '';
      image.src = src;
    };
  };
  image.onload = callback;
  image.src = src;
  loc.appendChild(image);
  loc.appendChild(counter);
};

var loadManga = function(imp) {
  var ex = extractInfo.bind(imp),
      imgUrl = ex('img', imp.imgmod),
      nextUrl = ex('next'),
      numPages = ex('numpages'),
      curPage = ex('curpage', {
        type: 'index'
      }) || 1,
      nextChapter = ex('nextchap', {
        type: 'value',
        val: (imp.invchap && -1) || 1
      }),
      prevChapter = ex('prevchap', {
        type: 'value',
        val: (imp.invchap && 1) || -1
      }),
      xhr = new XMLHttpRequest(),
      d = document.implementation.createHTMLDocument(),
      addAndLoad = function(img, next) {
        updateStats();
        addImage(img, UI.images, curPage, function() {
          pagesLoaded += 1;
          updateStats();
        });
        loadNextPage(next);
      },
      updateStats = function() {
        UI.statsPages.textContent = ' ' + pagesLoaded + '/' + curPage + ' loaded' + (numPages ? ', ' + numPages + ' total' : '');
      },
      getPageInfo = function() {
        var page = d.body;
        d.body.innerHTML = xhr.response;
        try {
          // find image and link to next page
          addAndLoad(ex('img', imp.imgmod, page), ex('next', null, page));
        } catch (e) {
          log('error getting details from next page, assuming end of chapter.');
        }
      },
      loadNextPage = function(url) {
        if (mLoadLess && count % loadInterval === 0) {
          if (resumeUrl) {
            resumeUrl = null;
          } else {
            resumeUrl = url;
            log('waiting for user to scroll further before loading more images, loaded ' + count + ' pages so far, next url is ' + resumeUrl);
            return;
          }
        }
        if (curPage + 1 > numPages) {
          log('reached "numPages" ' + numPages + ', assuming end of chapter');
          return;
        }
        if (lastUrl === url) {
          log('last url (' + lastUrl + ') is the same as current (' + url + '), assuming end of chapter');
          return;
        }
        curPage += 1;
        count += 1;
        lastUrl = url;
        if (imp.pages) {
          imp.pages(url, curPage, addAndLoad, ex, getPageInfo);
        } else {
          xhr.open('get', url);
          xhr.onload = getPageInfo;
          xhr.onerror = function() {
            log('failed to load page, aborting', 'error');
          };
          xhr.send();
        }
      },
      count = 1,
      pagesLoaded = curPage - 1,
      loadInterval = 10,
      lastUrl, UI, resumeUrl;

  if (!imgUrl || !nextUrl) {
    log('failed to retrieve ' + (!imgUrl ? 'image url' : 'next page url'), 'exit');
  }
  
  // do some checks on the chapter urls
  nextChapter = (nextChapter && nextChapter.trim() === location.href + '#' ? null : nextChapter);
  prevChapter = (prevChapter && prevChapter.trim() === location.href + '#' ? null : prevChapter);

  UI = getViewer(prevChapter, nextChapter);

  UI.statsPages.textContent = ' 0/1 loaded, ' + numPages + ' total';

  if (mLoadLess) {
    window.addEventListener('scroll', throttle(function(e) {
      if (!resumeUrl) return; // exit early if we don't have a position to resume at
      if(!UI.imageHeight) {
        UI.imageHeight = getEl('.ml-images img').clientHeight;
      }
      var scrollBottom = document.body.scrollHeight - ((document.body.scrollTop || document.documentElement.scrollTop) + window.innerHeight);
      if (scrollBottom < UI.imageHeight * 2) {
        log('user scroll nearing end, loading more images starting from ' + resumeUrl);
        loadNextPage(resumeUrl);
      }
    }, 100));
  }

  addAndLoad(imgUrl, nextUrl);

};

var pageUrl = window.location.href,
    btnLoadCss = toStyleStr({
      'position': 'fixed',
      'bottom': 0,
      'right': 0,
      'padding': '5px',
      'margin': '0 10px 10px 0',
      'z-index': '99999'
    }),
    currentImpName, btnLoad;

// used when switching chapters
var autoload = storeGet('autoload');
// manually set by user in menu
var mAutoload = storeGet('mAutoload') || false;
// should we load less pages at a time?
var mLoadLess = storeGet('mLoadLess') === false ? false : true;

// clear autoload
storeDel('autoload');

// register menu commands
if (typeof GM_registerMenuCommand === 'function') {
  GM_registerMenuCommand('ML: ' + (mAutoload ? 'Disable' : 'Enable') + ' manga autoload', function() {
    storeSet('mAutoload', !mAutoload);
    window.location.reload();
  });
  GM_registerMenuCommand('ML: Load ' + (mLoadLess ? 'full chapter in one go' : '10 pages at a time'), function() {
    storeSet('mLoadLess', !mLoadLess);
    window.location.reload();
  });
}

log('starting...');

var success = implementations.some(function(imp) {
  var intervalId;
  if (imp.match && (new RegExp(imp.match, 'i')).test(pageUrl)) {
    currentImpName = imp.name;
    if (autoload !== 'no' && (BM_MODE || mAutoload || autoload)) {
      log('autoloading...');
      if(typeof imp.wait === 'function') {
        log('Waiting for load condition to be fulfilled');
        intervalId = setInterval(function() {
          if(imp.wait()) {
            log('Condition fulfilled, loading');
            clearInterval(intervalId);
            loadManga(imp);
          }
        }, 200);
      } else {
        setTimeout(loadManga.bind(null, imp), imp.wait || 0);
      }
      return true;
    }
    // append button to dom that will trigger the page load
    btnLoad = createButton('Load Manga', function(evt) {
      loadManga(imp);
      this.remove();
    }, btnLoadCss);
    document.body.appendChild(btnLoad);
    return true;
  }
});

if (!success) {
  log('no implementation for ' + pageUrl, 'error');
}
// ==UserScript==
// @name            Enhanced viewer for acomics.ru
// @name:ru         Улучшенный просмотрщик для acomics.ru
// @description:ru  Предзагрузка, удобная навигация и прочие улучшения для сайта acomics.ru
// @description     Preload, navigation and other enhancements for acomics.ru comics viewer
// @author          Sanya_Zol (https://github.com/SanyaZol)
// @license         Unlicense
// @icon            data:image/gif;base64,R0lGODlhIAAgAMQAAP////22bNMQNf/MXP63WOprSP/DWPvQsP/gZ/7Hl/CFTOjazv7hzvzAgP/VXdgkONK9udeylN3Nwujj4OdWRPzx6uDDp/Hr5/Px8Pv18vv5+f/uedDBwea6cvehWOA8PSH5BAAAAAAALAAAAAAgACAAAAX/ICCOopQwWaWR7LgkSdMErdgQQXJg9XhVt8GAQKhNhAZCo9IDXGYDxMYRrVkGG4QhwFjVIA6EdINFtCYEw4ZsOHhbDcTQ4wkEPC2IUhHIJt4kVw4KAoWFHy0dDgEPBVkBFwCAaAQOH4aFeCRHCIQCA4snTC5CHpgCHwMsFgYDlwIKDklcIxM3BhSnsSQLW6aFDwMGw24irAa/hh/DIxkdabmGHlMODSsaDcLRhrEWPkkEpxRUAw0ivUOnD2kSIxLDBacCHsMBBwARYvGYCuUjGAGSPJBXoFW5C4oMDDS0zkCEERyGeVJXacCJbPsMFUBAIIEIDBFaLZTXbwuDCYwwyzXs+DHgRHnLWh3IcGCkgJUNMmhIkOQVQ0z0yh1okLHQxiEnhSWTV2jcIhkpGRqQFSACjm2oCmAVUKkjtq0bqSKzqaCBAZ8CClBpY2HpTQJy0hR9MKzBy3VaAlQ4sDXWWrIOOgAkq4UAAwZug4W5W8mChg5FPzwKMMFCXwSWMI2zgEFD21NxtvBwm+rlPAcLRFyIgFWtAW8SAqCdh/ZDBwupP0Y4Rc+bBpCnPnAYPlxCbhbDIXCAYDwSROUQIkBoQr269evYs2vfXj0EADs=
// @homepageURL     https://greasyfork.org/ru/scripts/10521
// @supportURL      https://greasyfork.org/ru/scripts/10521
// @namespace       Sanya_Zol
// @version         0.3.0
// @match           https://acomics.ru/*
// @run-at          document-start
// @grant           none
// @require         https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/10521/%D0%A3%D0%BB%D1%83%D1%87%D1%88%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9%20%D0%BF%D1%80%D0%BE%D1%81%D0%BC%D0%BE%D1%82%D1%80%D1%89%D0%B8%D0%BA%20%D0%B4%D0%BB%D1%8F%20acomicsru.user.js
// @updateURL https://update.greasyfork.org/scripts/10521/%D0%A3%D0%BB%D1%83%D1%87%D1%88%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9%20%D0%BF%D1%80%D0%BE%D1%81%D0%BC%D0%BE%D1%82%D1%80%D1%89%D0%B8%D0%BA%20%D0%B4%D0%BB%D1%8F%20acomicsru.meta.js
// ==/UserScript==

// @ts-check
// Greasy Fork: https://greasyfork.org/ru/scripts/10521
// Github: https://github.com/SanyaZol/acomics-enhanced-viewer-userscript

/** @typedef {{Page:number,LastPage:number,Image:string|null,ContentSerialNomargin:string,ContentMargin:string,Title:string}} parsedPage */

(function () {

  class AcomicsViewer {
    settings = {
      // Блокировать случайное закрытие страницы
      blockUnload: false,
      // таймаут запроса в милисекундах (секундах*1000)
      AjaxRequestTimeoutMs: 10000,
      // чтобы деактивировать или снова активировать быстрый скролл, нажми Shift+[˄] или Shift+[˅]
      scrollFasterDefault: true,
      // сейчас при скролле страницы стрелками по вертикали [˄] и [˅] будет быстрый скролл на 300 пикселей
      scrollFasterPx: 300,
      // а при зажатом Ctrl - на 100
      scrollFasterCtrlPx: 100,
      // время в милисекундах, за которое скроллить при использовании быстрого скролла
      scrollFasterSpeed: 75,
      // время в милисекундах, за которое скроллить наверх при смене страниц
      scrollSpeed: 75,
      // выпилить комментарии - они будут вылазить при нажатии [˄]+[˃]
      // (стрелки вправо при зажатой стрелке вверх) и выезжать при нажатии [˂]+[˃]
      contentMarginMover: false,
      // выводить отладочную информацию в левом верхнем углу страницы
      visualLog: false,
    };
    constants = {
      eventNamespace: 'acomics-enhanced-viewer-userscript',
      // префикс localStorage
      localStorageKeyPrefix: '**zol**page**',
      logPrefix: '[acViewer] ',
    };
    stage = 'noInit';
    /** @type {JQuery<HTMLElement> | null} */
    logOverlay = null;
    log(text) {
      let s = `[${this.stage}] ${text}`;
      if (this.settings.visualLog) {
        if (!this.logOverlay) {
          this.logOverlay = $('<div/>');
          this.logOverlay.css({
            position: 'fixed', // absolute
            zIndex: 1e6,
            left: '1px',
            top: '1px',
            padding: '1px',
            fontFamily: 'Verdana',
            fontSize: '7px',
            color: '#fff',
            textShadow: '#000 0px 0px 1px',//, #000 2px 2px 2px
            background: 'rgba(255,255,255,0.3)',
            borderRadius: '2px',
            border: '1px rgba(255,255,255,0.5) solid',
            overflowY: 'hidden',
            maxHeight: '60px'
          }).appendTo('body');
        }
        $('<div/>').text(s).hide().prependTo(this.logOverlay).slideDown(200).delay(5000).slideUp(200, function () { $(this).remove(); });
        this.logOverlay.fadeIn().finish().delay(5000).slideUp(200);
      }
      console.log(`${this.constants.logPrefix}${s}`);
    }
    preInitFailed = false;
    preInitGuard = false;
    preInitSucceeded = false;
    /** @type {string|null} */
    comicsName = null;
    /** @type {number|null} */
    comicsPage = null;
    /**
     * @param {number} id
     * @returns {string}
     */
    makeUrl(id) {
      if (!this.comicsName) throw new Error("makeUrl() requires this.comicsName to be set");
      if (id === null) throw new Error("makeUrl() requires id to be set");
      return '/~' + this.comicsName + '/' + id;
    }
    /** @type {string|null} */
    localStorageKey = null;
    /** @type {string|null} */
    localStorageKeyPage = null;
    /** @returns {void} */
    store() {
      if (!this.localStorageKey || this.comicsPage === null) throw new Error("store() requires this.localStorageKey to be set");
      if (this.comicsPage !== this.wantPage) throw new Error("store() requires this.comicsPage === this.wantPage");
      window.localStorage.setItem(this.localStorageKey, `${this.comicsPage}`);
    }
    /** @type {number|null} */
    wantPage = null;
    static _rx1 = /(?:(?:Мой )?(?:патреон|яндекс|yandex|paypal|wm(?:z|r|e|u)|кошелек|счет)[\s.-]*(?:кошелек|money|деньги)?:?|(?:https?:\/\/)?(?:www\.)?patreon.com\/[^\s]*|41\d{13}\b|(?:wm)?(?:z|r|e|u)\d{12}\b)/gi;
    static _rx2 = /(?:(?:\s*(?:<p>\s*<\/p>|<br ?\/? ?>)\s*)+|^(?:\s*<br ?\/? ?>)+|(?:<br ?\/? ?>\s*)+$)/gi;
    static _dangerous_tags = (['script', 'style', 'link', 'embed', 'object'].join(', '));
    static removeInlineHandlers(element) {
      // http://stackoverflow.com/a/3593250 http://stackoverflow.com/q/3593242 http://stackoverflow.com/questions/3593242/how-to-remove-all-attributes-from-body-with-js-or-jquery
      for (var i = element.attributes.length; i-- > 0;) {
        var attr = element.attributes[i];
        if (attr.nodeName.toLowerCase().indexOf('on') == 0) {
          element.removeAttributeNode(attr);
        }
      }
    }
    static removeScripts(el) {
      var f;
      while (f = el.querySelector(AcomicsViewer._dangerous_tags)) { // we querying selector every time because tags can contain each other
        f.parentNode.removeChild(f);
      }
      var f = el.querySelectorAll('*');
      for (var i = f.length; i-- > 0;) {
        AcomicsViewer.removeInlineHandlers(f[i]);
      }
    }
    /**
     *
     * @param {string} s
     * @returns {parsedPage|null}
     */
    parsePageString(s) {
      // TODO: validate comics page is really from the comics that is in URL
      var o = {};
      var parser = new DOMParser();
      var d = parser.parseFromString(s, "text/html");
      {
        let x1 = d.querySelector('.common-content .button-goto span');
        if (!x1) { return null; }
        let x = $.trim(x1.innerHTML).match(/^(\d+)\/(\d+)$/);
        if (!x) { return null; }
        o.Page = parseInt(x[1]);
        o.LastPage = parseInt(x[2]);
      }
      {
        let x = d.querySelector('.common-content .issue-description-buttons');
        if (x) { x.parentNode?.removeChild(x); };
      }
      {
        let x = d.querySelector('.common-content .reader-comment-form');
        if (x) { x.parentNode?.removeChild(x); };
      }
      {
        let x = d.querySelector('.common-content .reader-issue img.issue')?.getAttribute('src');
        o.Image = x || null;
      }
      {
        let x = d.querySelector('.common-content .reader-issue');
        if (!x) return null;
        AcomicsViewer.removeScripts(x);
        o.ContentSerialNomargin = x.innerHTML;
      }
      {
        let x = d.querySelector('.common-content .view-container .view-article');
        if (!x) return null;
        AcomicsViewer.removeScripts(x);
        let y = x.querySelector('.issue-description-text');
        if (y) y.innerHTML = y.innerHTML.replace(AcomicsViewer._rx1, '').replace(AcomicsViewer._rx2, '');
        o.ContentMargin = x.innerHTML;
      }
      {
        let x = d.querySelector('title');
        o.Title = x ? ($.trim(x.innerText)) : '?';
      }
      return o;
    }
    /** @type {number|null} */
    comicsLastPage = null;
    /** @type {number|null} */
    init_comicsPage = null;
    /** @type {number|null} */
    init_wantPage = null;
    /** @type {parsedPage|null} */
    tmp_curr = null;
    /** @returns {boolean} */
    preInit() {
      if (this.preInitSucceeded) return true;
      if (this.preInitFailed || this.preInitGuard) { return false; }
      this.preInitFailed = true;
      this.preInitGuard = true;
      this.stage = 'preInit.1';

      {
        const m = /^\/~([^\/]+)\/(\d*)(?:\D|$)/.exec(location.pathname.toString());
        if (!m) { return false; }

        if (!window.$) {
          this.log('no window.$');
          return false;
        }

        this.comicsName = m[1];
        const page = parseInt(m[2], 10);
        if (m[2] == '' || isNaN(page) || page < 1) {
          return false;
        }
        this.comicsPage = page;
      }

      this.localStorageKey = this.constants.localStorageKeyPrefix + this.comicsName;
      this.localStorageKeyPage = this.localStorageKey + '*';

      {
        /** @var {number|null} */
        let stored = null;
        const storedString = window.localStorage.getItem(this.localStorageKey);
        if (storedString) {
          stored = parseInt(storedString, 10) || null;
        }
        if (stored !== null && stored != this.comicsPage) {
          this.wantPage = stored;
        } else {
          this.wantPage = this.comicsPage;
        }
      }

      this.stage = 'preInit.2';

      let curr = this.parsePageString($('html')[0].outerHTML);
      if (!curr) { return false; }

      this.comicsLastPage = curr.LastPage;
      this.comicsPageTitle = curr.Title;

      this.init_comicsPage = this.comicsPage;
      this.init_wantPage = this.wantPage;

      this.stage = 'preInit.3';

      if (this.comicsPage != curr.Page) {
        if (
          confirm(
            'Что-то пошло не так.'
            + '\n'
            + '\n[1] Сохраненная страница:\t' + this.comicsPage
            + '\n[2] Страница комикса (html):\t' + curr.Page
            + '\n[3] Максимальная страница (html):\t' + this.comicsLastPage
            + '\n'
            + '\nЗаменить сохраненную страницу ' + this.comicsPage + ' на ' + curr.Page + '?'
          )
        ) {
          this.wantPage = this.comicsPage = curr.Page;
          this.store();
          location.href = this.makeUrl(this.comicsPage);
        }
        return false;
      }

      this.tmp_curr = curr;
      // this.putCached( this.comicsPage, curr );
      // this.putCached( this.tmp_curr.Page, this.tmp_curr ); delete this.tmp_curr;
      this.stage = 'preInit.4';
      this.preInitSucceeded = true;
      return true;
    }
    initSucceeded = false;
    initFailed = false;
    initGuard = false;
    noPushState = false;
    firstPushState = false;
    changeHandlers() {
      this.store();
      this.ShouldIDoSomething();
      if (this.noPushState) {
        this.noPushState = false;
        return;
      }
      let stateObj = { page: this.comicsPage };
      let title = `#${this.comicsPage} | ${this.comicsPageTitle}`;
      let url = this.makeUrl(this.comicsPage);
      if (this.firstPushState) {
        this.firstPushState = false;
        history.replaceState(stateObj, title, url);
      } else {
        history.pushState(stateObj, title, url);
      }
    }
    $htmlbody = null;
    doScroll(relative, scrollAmount) {
      this.$htmlbody || (this.$htmlbody = $('html,body'));
      if (relative) {
        this.$htmlbody.finish().animate({
          scrollTop: Math.max(0, $(window).scrollTop() + scrollAmount)
        }, this.settings.scrollFasterSpeed);
      } else {
        this.$htmlbody.finish().animate({
          scrollTop: scrollAmount
        }, this.settings.scrollSpeed);
      }
    }
    SessCacheQuery(page) {
      if (!this.localStorageKeyPage) throw new Error("No localStorageKeyPage");
      var r = window.sessionStorage.getItem(this.localStorageKeyPage + page);
      if (!r) return false;
      try {
        r = JSON.parse(r);
      } catch (e) {
        return false;
      }
      return r;
    };
    SessCachePut(page, data) {
      if (!this.localStorageKeyPage) throw new Error("No localStorageKeyPage");
      var d = JSON.stringify(data);
      window.sessionStorage.setItem(this.localStorageKeyPage + page, d);
    };
    /** @type {number|null} */
    handleSwapTimeout = null;
    handleSwap(page, o) {
      this.log('page.swap: swapping page to #' + page + (
        o.Preloaded ? '' : ' which doesn\'t have preloaded image'
      ));
      this.$contentMargin.html(o.ContentMargin);
      this.$contentSer.find('img.issue').attr('src', o.Image);
      if (this.handleSwapTimeout !== null) clearTimeout(this.handleSwapTimeout);
      this.handleSwapTimeout = setTimeout(() => {
        this.$contentSer.html(o.ContentSerialNomargin);
        this.handleSwapTimeout = null;
      }, 50);
      this.$contentCounter.html(`${o.Page}/${o.LastPage}`);
      if (o.Page < 2) this.$contentBtnPrev.addClass('button-inactive'); else this.$contentBtnPrev.removeClass('button-inactive');
      if (o.Page >= o.LastPage) this.$contentBtnNext.addClass('button-inactive'); else this.$contentBtnNext.removeClass('button-inactive');

      // title
      this.comicsPageTitle = o.Title;
      this.comicsPage = page;

      document.title = '#' + this.comicsPage + ' | ' + this.comicsPageTitle;

      // $(window).scrollTop(0);
      this.doScroll(false, 0);
      this.changeHandlers();
    };
    /** @type {Object} */
    plData = Object.create(null);
    putCached(page, data) {
      this.plData[page] = data;
      this.SessCachePut(page, data);
      this.putCachedPreloadImage(page);
    };
    putCachedPreloadImage(page) {
      this.plData[page].Preloaded = false;
      this.plData[page].DomImage = new Image();
      this.plData[page].DomImage.onerror = (err) => {
        console.error('Cannot load image #' + page + ' (window._err_img): ' + this.plData[page].Image);
        console.error({ "this.plData[page].Image": this.plData[page].Image, "err (event)": err });
        // TODO: debugger;
        window._err_img = this.plData[page].Image;
        if (typeof (this.plData[page]) != 'undefined') {
          delete this.plData[page];
        }
      };
      var log = false;
      this.plData[page].DomImage.onload = () => {
        delete this.plData[page].DomImage.onload;

        if (typeof (this.plData[page]) == 'object') {
          if (log) {
            this.log('page.cache: IMG preloaded #' + page);
          }
          this.plData[page].Preloaded = true;
        } else {
          this.log('page.cache: IMG preloaded #' + page + ' but OBJ DOES NOT EXISTS!!');
        }
      };
      this.plData[page].DomImage.src = this.plData[page].Image;
      setTimeout(() => { log = true; }, 30);
    };
    /** @type {JQuery<HTMLElement>|null} */
    $contentMargin = null;
    /** @type {JQuery<HTMLElement>|null} */
    $content = null;
    /** @type {JQuery<HTMLElement>|null} */
    $contentSer = null;
    /** @type {JQuery<HTMLImageElement>|null} */
    $contentImage = null;
    /** @type {JQuery<HTMLElement>|null} */
    $contentCounter = null;
    /** @type {JQuery<HTMLElement>|null} */
    $contentBtnPrev = $('.common-content .button-previous');
    /** @type {JQuery<HTMLElement>|null} */
    $contentBtnNext = $('.common-content .button-next');

    gcAllowed = false;
    gcAllowedSet() { this.gcAllowed = true; }
    gc() {
      if (!this.gcAllowed) { return; }

      var r = this.populateList(5);
      r.push(this.wantPage);
      for (var page_str in this.plData) {
        page = parseInt(page_str, 10);
        if ($.inArray(page, r) == -1) {
          this.log('this.gc: removing old page #' + page);
          delete this.plData[page];
          window.sessionStorage.removeItem(this.localStorageKeyPage + page);
        }
      }

      var prefixl = this.localStorageKeyPage.length;
      for (var i = window.sessionStorage.length; i-- > 0;) {
        var k = window.sessionStorage.key(i);
        if (typeof (k) == 'string' && k.indexOf(this.localStorageKeyPage) == 0) {
          var page = parseInt(k.substr(prefixl), 10);
          if ($.inArray(page, r) == -1) {
            this.log('this.gc: removing sessionStorage page #' + page);
            window.sessionStorage.removeItem(this.localStorageKeyPage + page);
          }
        }
      }
      // key()
      this.gcAllowed = false;
      setTimeout(() => this.gcAllowedSet(), 10000);
    };
    swapPage() {
      var page = this.wantPage;
      if (typeof (this.plData[page]) == 'undefined') {
        this.log('page.swap: NO CACHE FOR #' + page);
        return false;
      }
      if (typeof (this.plData[page]) == 'boolean') {
        this.log('page.swap: CACHE STILL WAITING #' + page);
        return true;
      }
      if (typeof (this.plData[page]) == 'object') {
        var o = this.plData[page];
        this.handleSwap(page, o);
      }
      return true;
    };
    ShouldIDoSomething() {
      if (this.wantPage < 1) {
        this.log('page.swap: wrong wantPage = ' + this.wantPage);
        this.wantPage = 1;
      } else if (this.wantPage > this.comicsLastPage) {
        this.log('page.swap: wrong wantPage = ' + this.wantPage);
        this.wantPage = this.comicsLastPage;
      }
      if (this.wantPage != this.comicsPage) {
        if (!this.swapPage()) {
          this.log('page.cache: requesting non-preloaded page #' + this.wantPage);
          this.ajaxPreload(this.wantPage);
          return true;
        }
      }

      var r = this.populateList(0);
      var rl = r.length;
      for (var i = 0; i < rl; i++) {
        var page = r[i];
        if (typeof (this.plData[page]) == 'undefined') {
          var cached = this.ajaxPreload(page);
          if (!cached) {
            this.log('page.cache: preloading page #' + page);
            return true;
          }
        }
      }
      this.gc();
      return false;
    };
    ticker() {
      var to = this.ShouldIDoSomething() ? 300 : 1000;
      this.tickerTO = setTimeout(() => this.ticker(), to);
    };
    populateList(Add) {
      var a = [];
      for (var i = 1; i <= (4 + Add); i++) {
        var np = this.wantPage + i;
        if (np <= this.comicsLastPage) {
          a.push(np);
        }
      }
      for (var i = 1; i <= (2 + Add); i++) {
        var np = this.wantPage - i;
        if (np >= 1) {
          a.push(np);
        }
      }
      return a;
    };
    ajaxPreload(page) { // return cached
      var sc = this.SessCacheQuery(page);
      if (sc) {
        this.plData[page] = sc;
        // this.SessCachePut( page, data );
        this.putCachedPreloadImage(page);
        return true;
      }

      this.plData[page] = true;
      $.ajax({
        type: 'GET',
        dataType: 'text',
        cache: true,
        url: this.makeUrl(page),
        timeout: this.settings.AjaxRequestTimeoutMs,
        error: (...args) => {
          console.error({ _: `ajaxPreload(${page}) failed!`, args });
          if (typeof (this.plData[page]) != 'undefined') {
            delete this.plData[page];
          }
        },
        success: (d) => {
          var parsed = this.parsePageString(d);
          if (!parsed) {
            console.error('Cannot parse data (see window._err_data)');
            window._err_data = d;
            if (typeof (this.plData[page]) != 'undefined') {
              delete this.plData[page];
            }
          } else {
            this.log('page.ajax: preloaded #' + page);
            this.putCached(page, parsed);
            this.ShouldIDoSomething();
          }
        }
      });

      return false;
    };
    handlePrev() {
      // this.wantPage = this.comicsPage;
      this.wantPage--;
      this.ShouldIDoSomething();
    };
    handleNext() {
      this.wantPage++;
      this.ShouldIDoSomething();
    };
    uparrow_pressed = false;
    last_scroll = 0;
    documentKeydown(e) {
      var prevent = true;
      // if( e.which==13 && e.shiftKey ) { // Shift+Enter
      // } else
      if ((e.which == 38 || e.which == 40) && e.shiftKey) { // ^/v
        this.scroll_faster = !this.scroll_faster;
      }
      if (e.which == 37) { // <
        if (this.settings.contentMarginMover) { this.$contentMargin.hide(); }
        if (this.uparrow_pressed) {
          if (this.settings.contentMarginMover) { $(window).scrollTop(this.last_scroll); }
          this.$content.addClass('notitle');
        } else {
          this.handlePrev();
        }
      } else if (e.which == 39) { // >
        if (this.uparrow_pressed) {
          if (this.settings.contentMarginMover) { this.$contentMargin.show(); }
          this.$content.removeClass('notitle');
          // $(window).scrollTop(0);
          this.doScroll(false, 0);
        } else {
          if (this.settings.contentMarginMover) { this.$contentMargin.hide(); }
          this.handleNext();
        }
      } else if (e.which == 38) { // ^
        this.uparrow_pressed = true;
        this.last_scroll = $(window).scrollTop();
        if (this.settings.scrollFasterPx && this.scroll_faster) {
          // $(window).scrollTop( Math.max( 0, $(window).scrollTop()-this.settings.scrollFasterPx ) );
          this.doScroll(true, -(e.ctrlKey ? this.settings.scrollFasterCtrlPx : this.settings.scrollFasterPx));
        } else {
          prevent = false;
        }
      } else if (e.which == 40) { // v
        if (this.settings.scrollFasterPx && this.scroll_faster) {
          // $(window).scrollTop( $(window).scrollTop()+this.settings.scrollFasterPx );
          this.doScroll(true, (e.ctrlKey ? this.settings.scrollFasterCtrlPx : this.settings.scrollFasterPx));
        } else {
          prevent = false;
        }
      } else {
        prevent = false;
      }
      if (prevent) { e.preventDefault(); return false; }
    }
    documentKeyup(e) {
      if (e.which == 38) { // ^
        this.uparrow_pressed = false;
      }
    }
    scroll_faster = false;
    /** @returns {boolean} */
    init() {
      if (!this.preInit()) { return false; }
      if (this.initSucceeded) return true;
      if (this.initFailed || this.initGuard) { return false; }

      this.initFailed = true;
      this.initGuard = true;
      this.stage = 'init.1';

      this.noPushState = false;
      // this.firstPushState = true;

      $(window)
        .off(`popstate.${this.constants.eventNamespace}`)
        .on(`popstate.${this.constants.eventNamespace}`, (e) => {
          var d = e?.originalEvent?.state || false;
          if (d && d.page) {
            this.wantPage = d.page;
            this.noPushState = true;
            this.ShouldIDoSomething();
          }
        });

      // TODO: add button and click event for this thing and script settings
      window.eval('window.z_SetPage=function(){ $(window).trigger(\'' +
        this.constants.localStorageKeyPrefix + ':setpage'
        + '\') };');
      this.storePage = () => { // z_SetPage
        var p = parseInt(prompt('Set page to:', this.comicsPage), 10);
        if (isNaN(p) || p < 1 || p > this.comicsLastPage) {
          alert('Wrong page!\nMust be: 1 < page < ' + this.comicsLastPage);
          return;
        }
        if (!confirm('Warning! Really update page from ' + this.comicsPage + ' to ' + p + ' ?')) {
          return;
        }
        this.wantPage = p;
        this.ShouldIDoSomething();
      };
      $(window).on(this.constants.localStorageKeyPrefix + ':setpage', this.storePage);

      // this.wantPage = this.comicsPage;
      setTimeout(() => {
        if (this.wantPage == this.comicsPage) {
          this.swapPage();
        } else {
          this.ShouldIDoSomething();
        }
      }, 1);

      this.plData = Object.create(null);

      // this.wantPage = this.comicsPage;

      this.$content = $('.common-content');
      this.$contentMargin = $('.common-content .view-container .view-article');
      this.$contentSer = $('.common-content .reader-issue');
      // this.$contentImage = $('.common-content .reader-issue img.issue');
      this.$contentCounter = $('.common-content .button-goto span, .common-content .reader-issue-title > .number-without-name');
      this.$contentBtnPrev = $('.common-content .button-previous');
      this.$contentBtnNext = $('.common-content .button-next');

      // custom stylesheets
      $('<style/>').attr('type', 'text/css').html(''
        + ' .common-header-background, .common-header {display:none !important;}'
        + ' .common-content > .serial-header, .common-content > .serial-reader-menu {display:none;}'
        + ' .common-content .reader-issue-title > a, .common-content #title > a {display:none;}'
        + ' .common-content .reader-issue-title, .common-content #title {padding:0 !important;min-height:0 !important;}'
        + ' .common-content.notitle .reader-issue-title, .common-content.notitle #title {display:none;}'
        // + ' .common-content img.issue {max-width: none !important; width: auto; }'
        + ' .page-margins {max-width: none !important;}'
        + ' .page-margins {background-color: transparent !important;}'
        + ' div.page-background {padding-top: 0 !important;}'
        + ' .common-footer {display:none;}'
        + ' body {grid-template-rows: 1fr !important;}'

        + ' .view-container {max-width:var(--max-width);margin-right:auto;margin-left:auto;background-color:#fff;box-shadow:0 3px 6px 1px rgba(0,0,0,0.05);}'

        + ' .common-content .reader-navigator .button-content>* {display:none;}'
        + ' .common-content .reader-navigator .button-first>* {display:none;}'
        + ' .common-content .reader-navigator .button-last>* {display:none;}'
        + ' .common-content .reader-navigator .button-random>* {display:none;}'
      ).appendTo('body');

      this.$content.addClass('notitle');
      if (this.settings.contentMarginMover) {
        this.$contentMargin
          .detach()
          .css({
            position: 'absolute',
            left: '5px',
            top: '64px',
            border: '1px #000 solid',
            background: '#fff'
          })
          .appendTo('body')
          .hide();
      }
      this.gcAllowedSet();

      this.tickerTO = setTimeout(() => this.ticker(), 10);

      this.uparrow_pressed = false;
      this.last_scroll = 0;

      this.scroll_faster = this.settings.scrollFasterDefault;
      $(document)
        .off(`keydown.${this.constants.eventNamespace}`)
        .on(`keydown.${this.constants.eventNamespace}`, (e) => this.documentKeydown(e))
        .off(`keyup.${this.constants.eventNamespace}`)
        .on(`keyup.${this.constants.eventNamespace}`, (e) => this.documentKeyup(e))
        ;

      this.$contentSer
        .off(`click.${this.constants.eventNamespace}`, 'a.reader-issue-next')
        .on(`click.${this.constants.eventNamespace}`, 'a.reader-issue-next', (e) => { e.preventDefault(); this.handleNext(); });
      this.$contentSer
        .off(`click.${this.constants.eventNamespace}`, 'a.reader-issue-previous')
        .on(`click.${this.constants.eventNamespace}`, 'a.reader-issue-previous', (e) => { e.preventDefault(); this.handlePrev(); });
      this.$contentBtnPrev.find('a')
        .attr('href', '#js-prev')
        .off(`click.${this.constants.eventNamespace}`)
        .on(`click.${this.constants.eventNamespace}`, (e) => {
          e.preventDefault();
          this.handlePrev();
          return false;
        });
      this.$contentBtnNext.find('a')
        .attr('href', '#js-next')
        .off(`click.${this.constants.eventNamespace}`)
        .on(`click.${this.constants.eventNamespace}`, (e) => {
          e.preventDefault();
          this.handleNext();
          return false;
        });
      $(window)
        .off(`beforeunload.${this.constants.eventNamespace}`)
        .on(`beforeunload.${this.constants.eventNamespace}`, (event) => {
          if (this.settings.blockUnload) {
            event.preventDefault();
            return 'You shall not pass.';
          }
        });

      this.putCached(this.tmp_curr.Page, this.tmp_curr);
      this.tmp_curr = null;

      enableIntercept = true;

      this.stage = 'init.2';

      this.log('init(finish)');
    };
    createRunInterface() {
      var current = this.init_comicsPage == this.init_wantPage;
      var label = 'Запуск читалки';
      if (!current) {
        label = 'Продолжить чтение (стр. ' + this.init_wantPage + ')';
      }
      var d = $('<div/>');

      $('<button/>').html('&times;').css({
        color: '#F00', fontWeight: 'bold', fontSize: '16px',
        position: 'absolute', left: '-10px', top: '-10px', width: '20px', height: '20px', padding: '1px'
      }).click((e) => {
        e.preventDefault();
        d.remove();
      }).appendTo(d);


      $('<button/>').html(label).css({
        fontSize: '14px'
      }).click((e) => {
        e.preventDefault();
        d.remove();
        this.init();
        // w.history.pushState({a:location.href}, "* Супер-читалка", location.href);
      }).appendTo(d);
      if (!current) {
        d.append('<div>Произойдет переход на стр. ' + this.init_wantPage + '</div>');
        $('<button/>').html(
          'Читать со страницы ' + this.init_comicsPage + ''
        ).css({
          fontSize: '12px'
        }).click((e) => {
          e.preventDefault();
          if (confirm(''
            + 'Вы собираетесь удалить закладку со страницы ' + this.init_wantPage
            + '\nи продолжить чтение со страницы ' + this.init_comicsPage
            + '\n\nВсё верно?'
          )) {
            this.wantPage = this.comicsPage = this.init_comicsPage;
            // this.store();
            // location.href = this.makeUrl(this.comicsPage);
            d.remove();
            this.init();
          }
        }).appendTo(d);
        d.append('<div style="font-size:10px;">Закладка со стр. ' + this.init_wantPage + ' будет удалена.</div>');
      }
      d.css({
        borderRadius: '4px',
        position: 'fixed', // absolute
        zIndex: 1e6,
        right: '3px',
        top: '3px',
        padding: '4px',
        background: 'rgba(0,0,0,0.6)',
        color: '#fff',
        border: '2px rgba(0,0,0,0.9) solid'
      }).appendTo('body');
      setTimeout(() => {
        var inner = $('header.common > div.inner');
        if (!inner.length) return;
        if (d.offset().left < (inner.offset().left + inner.width() + 55)) {
          d.css({ top: Math.round(inner.height() + 3) + 'px' });
        }
      }, 1);
    }
  }


  var enableIntercept = false;
  // disable built-in navigation with left/right arrow keys.
  let _addEventListener = document.addEventListener;
  document.addEventListener = function (en, fn, ...rest) {
    if (en == 'keydown') {
      let fnStr = fn?.toString();
      if (fnStr.indexOf(`navElement.querySelector('a').getAttribute('href')`) !== -1) {
        let origFn = fn;
        fn = function (e) {
          if (enableIntercept) return;
          return origFn(e);
        };
      }
    }
    return _addEventListener.call(this, en, fn, ...rest);
  };

  class AcomicsViewerList2 {
    static makeUrlReference(id, comicsName) {
      return '/~' + comicsName + '/' + id;
    };
    initGuard = false;
    init() {
      if (this.initGuard) return;
      this.initGuard = true;
      if (!/\/-[A-Za-z0-9_-]+\/list2/.test(location.pathname)) { return; }

      // $('div.contentSerialMargin > div.agrHolder >table.agr >tbody>tr:first-child>td.agrBody>div.numbers')

      var div = $('div.agrHolder');
      if (!div.length) { return; }
      div.find('>table.agr').css({ marginBottom: '4px' }).each(function () {
        // var a = $(this).find('>tbody>tr:first-child>td.agrBody>h3>a');
        // if(!a.length){return;}
        // a = a[0].pathname;
        // if( a.substr(0,2)!='/~' ){return;}
        // a=a.substr(2);
        var b = $(this).find('>tbody>tr:first-child>td.agrBody>div.numbers a').eq(0);
        if (!b.length) { return; }
        b = b[0].pathname;
        var m = /^\/~([^\/]+)\/(\d*)(?:\D|$)/.exec(b);
        if (!m) { return; }

        // parse page info
        var comicsName = m[1];
        var comicsPage = parseInt(m[2], 10);
        if (m[2] == '' || isNaN(comicsPage) || comicsPage < 1) { return; }

        var k = this.constants.localStorageKeyPrefix + comicsName; // stored shit
        var stored = window.localStorage.getItem(k);
        if (stored) { stored = parseInt(stored, 10) || false; } else { stored = false; }
        if (!stored) { return; }

        if (stored == comicsPage) {
          $(this).css({ backgroundColor: '#ccc', outline: '1px #999 solid' });
        } else if (stored < comicsPage) {
          $(this).css({ backgroundColor: '#cff', outline: '1px #9ff solid' });

          var link = $('<a/>').addClass('agr-today').attr(
            'href', AcomicsViewerList2.makeUrlReference(stored, comicsName)
          ).text(
            'Продолжить чтение со страницы ' + stored + ' (из ' + comicsPage + ')'
          ).css({
            fontSize: '18px'
          });
          $(this).find('>tbody>tr:first-child>td.agrBody>div.numbers').prepend('<hr/>').prepend(link);
        }

        // this.comicsName = m[1];
        // var comicsPage = parseInt(m[2],10);
      });
    }
  }

  $(function () {
    (function () {
      // $('.common .inner td.nainmenu > nav > a[href$="/list2"]').css({backgroundColor:'#f00'});
      var a = $('.common .inner td.logo > a');
      var img = a.find('> img');
      if (!img.length) { return; }
      var div = $('<div style="display:inline-block;overflow:hidden;width:55px;height:54px;height:100%;vertical-align:middle;padding-top:7px;" />');
      img.detach();
      div.append(img).appendTo(a);
      $('.common .inner td.logo').css('width', 'auto');

      var x = $('.common .inner td.nainmenu > nav > a[href$="/list2"]');

      x.css({ fontWeight: 'bold' });
      var y = $('<div/>').html('обновления').css({
        display: 'inline-block', background: '#99f', borderRadius: '4px', border: '1px #66f solid',
        position: 'absolute', marginTop: '-12px', marginLeft: '-48px',
        width: '64px', height: '14px',
        fontSize: '10px', fontFamily: 'sans-serif', textTransform: 'none', textAlign: 'center', fontWeight: 'normal'
      });
      y.insertBefore(x.find('>span'));

      var live = $('.common .inner td.nainmenu > nav > a[href$="/live"]').contents().filter(function () { return this.nodeType === 3; }).eq(0);
      if (live.length) { live[0].textContent = 'Live'; }
      var Top = $('.common .inner td.nainmenu > nav > a[href$="//top.a-comics.ru/"]').contents().filter(function () { return this.nodeType === 3; }).eq(0);
      if (Top.length) { Top[0].textContent = 'ТОП'; }
      // window.lol_y = y;
      // window.lol_x = x;
    })();

    let acomicsViewer = new AcomicsViewer();

    if (!acomicsViewer.preInit()) {
      let list2 = new AcomicsViewerList2();
      list2.init();
      return;
    }

    acomicsViewer.createRunInterface();
  });

})();

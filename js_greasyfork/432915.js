// ==UserScript==
// @name          bangumi-sort-index
// @name:zh       排序首页条目
// @namespace     https://trim21.me/
// @description   Build your UserScript with webpack
// @version       0.0.10
// @author        Trim21 <i@trim21.me>
// @source        https://github.com/trim21/bgm-tv-userscripts
// @supportURL    https://github.com/trim21/bgm-tv-userscripts/issues
// @license       MIT
// @include       /^https://(bangumi\.tv|bgm\.tv|chii\.in)/[^/]*/
// @require       https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @run-at        document-end
// @grant         GM_info
// @downloadURL https://update.greasyfork.org/scripts/432915/bangumi-sort-index.user.js
// @updateURL https://update.greasyfork.org/scripts/432915/bangumi-sort-index.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// external "$"
const external_$_namespaceObject = $;
;// ./scripts/sort-index/src/style.css
/* harmony default export */ const style = ("#prgManagerHeader ul#prgManagerOrder li a span {\n}\n\n#prgManagerHeader ul#prgManagerOrder li a.focus span {\n  filter: invert();\n}\n\n/* https://www.flaticon.com/free-icons/sort */\n\n#prgManagerHeader ul#prgManagerOrder li a#switchSmartOrder span {\n  /* https://icons8.com/icon/69918/sort-by-recently-viewed */\n  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKaSURBVGhD7dlLyExhHMfxcS2KolxzS5SFpNwtWBAKZaVkI0VZocRCoiQrKynKQiyssLF0CRsJWdkQSRayQIhy/f6m+ff+Oz3nvPM+zTznHJ1ffXqb55xnen5zzsycM2+rSZMmTf6rrMYujGk/KidrsR0j2o8isgJ/8BdXNVBCtsDWcEoDMdkHPYG81kAJ0eJtDfc0EBNf5I0GIjIeczAJMafGadgaHmggJjFFtNhNuIL3sPnyDXexFxPRTUopsg7PYXOKfMFhjEZRkhbRUTgH23conmAG8pKsiF7Rm7D9jD5prmMbFkMfoVqUjkR233dYiFCSFNGRuAbbx/zCDoQyFy+QnfMWoSOTpMhR2HbvOIqyCD+RnfcI2fdM34voVAgt5gfGwTIbKrah/WggN5CdK8fg0/cioVNK9Kr6PIXGdbot0EAnh5CdK9+h7x5L34vcgm3zHsLnFWzbMg10cgB+nvmNybD0vYi+M2yb9wmjYFkFfXodbD8ayCWE5l+AT5I3+0XYdm83ijIdX5Gdp+u5CfBJUmQsdCrZPkZHZSlC0QfBfWTn6PLFn3qWJEUUXQyGLku0sBOYh2HQK70TL5HdV2/wjQglWRFFi8x78w9GF5Z6H+UlaRFlJPZDp5XNKaJLmMuYiqIkL2KZAn1HPIPN9XQEzmIJuklpRXz0fbAGW7Ee8zEcQ0klivQiTRGfpkgP0xTxaYr0MD0psgf2JB9xpAT6HczWcBtRWQl7kio4g+jk3Vun9gHTEB3d7ekQ38HjCH4x+hkotE8R3e+cx0yUGl9kswbqmqZI1VLLIsuh+w7PF9FPrNnt+gGjctE/Tru91ZWTqGy6LVPpEpbBytSihCWvTK1KWFTmM2pdwmJlal3CMqvzt49ptf4B0C4sGC5Wg58AAAAASUVORK5CYII=)\n    no-repeat top;\n  background-size: 20px 20px;\n}\n\n#prgManagerHeader ul#prgManagerOrder li a#switchNormalOrder span {\n  /* https://icons8.com/icon/69920/sort-by-modified-date */\n  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHySURBVGhD7Zg9LwRBHIcPkSA6lXj5DApv0VBQ0ZLoNAoRnUQhKhGJRCQqjVqhEJ0GEY3CN1AIrQIlEfx+e/tPJnP7cju3tzN7mSd5snbudrLP7U1uV8Xj8Xhaiim4AruDPTtMwyXYEewZMAF/4R8844AFFqCcwx4HTFiDnIA+cyAneuERvIL8pJPgycs53HHABDXkhQM5wIh7KPPy096AcexDeS+PM6IZIXPwB8q8NCnG2RCyCKNiZqCOUyH8Om3CtmCvSlTMDtRxJkRdE6cwLobbUajjRIi+sGlUzBdcDvZqsR4SFSHqMQPhNgqrIUkRoh4Th7WQeiIo1wRvf9KwEpIlIm5N6BQewhu6WyjvjzNLBLFyRfrgJZRjdLNGEGtrZBXKMaomEcRayAj8hnIcNY0g1kJIFxyD57CRCFJYCK/AevXPGhjTSAQpLOQA8s41LqZRCglph6+QrzMm7WnPhEJCBiEfgY/hJAeagNXFnic+RMWH5IgPUWmZEPUG8B1uWVB9NLiGRvC3QSZxwUNozAWMmrRo32A/NKYT8hLfwEcD1ZN5Csey+ABP4BC0ihoyz4Gy4kNco5Qh43BWUw3ZDsdUe6Bz8D+HH1A9+SR3obPUG+N0hJAWU4oIIS6mVBECYz5hqSMEiSl1hDAcbptIpfIPemrPlazYnP4AAAAASUVORK5CYII=)\n    no-repeat top;\n  background-size: 20px 20px;\n}\n\n#prgManagerHeader ul#prgManagerOrder li a span {\n  display: block;\n  text-indent: -9999px;\n  height: 18px;\n  width: 20px;\n}\n");
;// ./scripts/sort-index/src/index.ts


function addStyle(css) {
  'use strict';

  const head = document.getElementsByTagName('head')[0];
  if (head) {
    const style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.textContent = css;
    head.appendChild(style);
  }
}
addStyle(style);
const castKeyword = '首播';
const configKey = 'index-sort-order';
function bangumiSortIndex() {
  class Subject {
    constructor(el) {
      this.el = el;
      const titleEL = el.find('.epGird .tinyHeader .textTip').last();
      this.title = titleEL.attr('data-subject-name-cn') ?? titleEL.attr('data-original-title') ?? titleEL.attr('data-subject-name') ?? 'title';
      const nextWatch = el.find('li a:not(.epBtnWatched)').first();
      const rel = nextWatch.attr('rel');
      if (rel) {
        this.nextDate = getDate(rel);
      } else {
        this.nextDate = 0;
      }
      this.airing = el.find('li a.epBtnNA, li a.epBtnToday').length !== 0 ? -1 : 1;
    }
  }
  const container = external_$_namespaceObject('#cloumnSubjectInfo .infoWrapper_tv');
  const originals = Array.from(external_$_namespaceObject('.infoWrapper_tv [id^=subjectPanel_]')).map(element => {
    return new Subject(external_$_namespaceObject(element));
  });
  const subjects = [...originals];
  function getDate(rel) {
    const castDate = Array.from(document.querySelector(rel)?.querySelector('span.tip')?.childNodes ?? []).filter(e => e.nodeType === Node.TEXT_NODE).map(e => e.textContent ?? '').filter(t => t.includes(castKeyword));
    if (castDate.length) {
      return new Date(castDate[0].replace(`${castKeyword}:`, '')).getTime();
    }
    return 0;
  }
  function render(subjects) {
    subjects.forEach(s => {
      s.el.remove();
    });
    subjects.forEach((s, i) => {
      s.el.removeClass('odd');
      s.el.removeClass('even');
      if (i % 2) {
        s.el.addClass('even');
      } else {
        s.el.addClass('odd');
      }
      container.append(s.el);
    });
  }
  function smart(subjects) {
    subjects.sort((a, b) => {
      if (a.airing === b.airing) {
        return (b.nextDate - a.nextDate) * a.airing;
      }
      return a.airing;
    });
    render(subjects);
  }
  function normal() {
    render(originals);
  }
  function onLoad() {
    const orderUI = external_$_namespaceObject(`<ul id='prgManagerOrder' class='categoryTab clearit rr'>

<li data-mode='normal'><a href='javascript:void(0);' id='switchNormalOrder' title='修改順序'><span>標準</span></a></li>
<li data-mode='smart' ><a href='javascript:void(0);' id='switchSmartOrder'  title='智障順序'><span>智能</span></a></li>

</ul>`);
    external_$_namespaceObject('#prgManagerHeader').append(orderUI[0]);
    if (!localStorage['index-sort-order']) {
      localStorage['index-sort-order'] = 'smart';
    }
    const optionUIs = orderUI.find('li');
    let mode = localStorage.getItem(configKey) ?? 'normal';
    function click(ctx) {
      optionUIs.find('a').removeClass('focus');
      if (ctx) {
        const el = external_$_namespaceObject(ctx);
        mode = el.attr('data-mode')?.toString();
        localStorage.setItem(configKey, mode);
      }
      switch (mode) {
        case 'smart':
          smart(subjects);
          break;
        case 'normal':
          normal();
          break;
        default:
          mode = 'normal';
          localStorage.setItem(configKey, mode);
          normal();
      }
      external_$_namespaceObject(`#prgManagerOrder li[data-mode="${mode}"]`).find('a').addClass('focus');
    }
    optionUIs.on('click', function () {
      click(this);
    });
    click();
  }
  onLoad();
}
bangumiSortIndex();
/******/ })()
;
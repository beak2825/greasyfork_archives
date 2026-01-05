// ==UserScript==
// @name         WaniKani Kanjidamage Mnemonics
// @namespace    https://greasyfork.org/users/649
// @version      2.0.7
// @description  Includes Kanjidamage Mnemonics in WaniKani
// @author       Adrien Pyke
// @match        *://www.wanikani.com/kanji/*
// @match        *://www.wanikani.com/level/*/kanji/*
// @match        *://www.wanikani.com/review/session
// @match        *://www.wanikani.com/lesson/session
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/20106/WaniKani%20Kanjidamage%20Mnemonics.user.js
// @updateURL https://update.greasyfork.org/scripts/20106/WaniKani%20Kanjidamage%20Mnemonics.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const SCRIPT_NAME = 'WaniKani Kanjidamage Mnemonics';

  const Util = {
    log(...args) {
      args.unshift(`%c${SCRIPT_NAME}:`, 'font-weight: bold;color: #233c7b;');
      console.log(...args);
    },
    fromEntries:
      Object.fromEntries ||
      (iterable =>
        [...iterable].reduce((obj, [key, val]) => ((obj[key] = val), obj), {})),
    q: (query, context = document) => context.querySelector(query),
    qq: (query, context = document) =>
      Array.from(context.querySelectorAll(query)),
    appendAfter: (elem, elemToAppend) =>
      elem.parentNode.insertBefore(elemToAppend, elem.nextElementSibling),
    makeElem: (type, { classes, ...opts } = {}) => {
      const node = Object.assign(
        document.createElement(type),
        Util.fromEntries(
          Object.entries(opts).filter(([_, value]) => value != null)
        )
      );
      classes && classes.forEach(c => node.classList.add(c));
      return node;
    },
    fetch: (url, method = 'GET') =>
      new Promise((resolve, reject) =>
        GM_xmlhttpRequest({
          url,
          method,
          onload: resolve,
          onerror: reject
        })
      ),
    newTabLink: { target: '_blank', rel: 'noopener noreferrer' }
  };

  const App = {
    cachedKanji: [],
    getKanjiDamageInfo: async (kanji, inLesson) => {
      if (App.cachedKanji[kanji]) {
        Util.log(`${kanji} cached`);
        return App.cachedKanji[kanji];
      }
      Util.log(`Loading Kanjidamage information for ${kanji}`);

      try {
        const response = await Util.fetch(
          `http://www.kanjidamage.com/kanji/search?q=${kanji}`
        );

        Util.log(`Found Kanjidamage information for ${kanji}`);

        const tempDiv = Util.makeElem('div', {
          innerHTML: response.responseText
        });

        const replaceClasses = elem => {
          if (elem.classList.contains('onyomi')) {
            elem.classList.remove('onyomi');
            elem.classList.add(
              inLesson ? 'highlight-reading' : 'reading-highlight'
            );
          }
          if (elem.classList.contains('component')) {
            elem.classList.remove('component');
            elem.classList.add(
              inLesson ? 'highlight-radical' : 'radical-highlight'
            );
          }
          if (elem.classList.contains('translation')) {
            elem.classList.remove('translation');
            elem.classList.add(
              inLesson ? 'highlight-kanji' : 'kanji-highlight'
            );
          }
        };

        const readTableHtml = header => {
          const section = Util.qq('h2', tempDiv).find(elem =>
            elem.textContent.includes(header)
          );
          if (!section) return;
          const content = Util.q('td:nth-child(2)', section.nextElementSibling);
          Util.qq('span', content).forEach(replaceClasses);
          Util.qq('img', content)
            .filter(img => img.getAttribute('src').startsWith('/'))
            .forEach(
              img =>
                (img.src =
                  'http://www.kanjidamage.com' + img.getAttribute('src'))
            );
          return content.innerHTML;
        };

        const reading = readTableHtml('Onyomi');
        const mnemonic = readTableHtml('Mnemonic');

        App.cachedKanji[kanji] = {
          character: kanji,
          reading,
          mnemonic,
          url: response.finalUrl
        };

        return App.cachedKanji[kanji];
      } catch (e) {
        Util.log(`Could not find Kanjidamage information for ${kanji}`);
      }
    },
    createH2() {
      const h2 = Util.makeElem('h2');
      const link = Util.makeElem('a', {
        textContent: 'Kanjidamage',
        ...Util.newTabLink
      });
      h2.appendChild(link);
      return { h2, link };
    },
    createSection(node) {
      const { h2, link } = App.createH2();
      const section = Util.makeElem('section');
      if (node) {
        Util.appendAfter(node, h2);
        Util.appendAfter(h2, section);
      }
      return { h2, link, section };
    },
    createContainer(sel, selNode) {
      const container = Util.makeElem('section');
      const { h2, link, section } = App.createSection();
      container.appendChild(h2);
      container.appendChild(section);
      if (typeof sel === 'string')
        waitForElems({
          sel,
          onmatch: elem =>
            Util.q(selNode).classList.contains('kanji') &&
            Util.appendAfter(elem, container)
        });
      else Util.appendAfter(sel, container);
      return { container, h2, link, section };
    },
    getKanjiObjHtml: ({ reading, mnemonic }) =>
      (reading || '') + (mnemonic || ''),
    initWatch: (sel, selKanji, cb, cbClear) =>
      waitForElems({
        context: Util.q(sel),
        config: {
          attributes: true,
          childList: true,
          characterData: true,
          subtree: true
        },
        onchange: async () => {
          cbClear && cbClear();
          if (!Util.q(sel).classList.contains('kanji')) return;
          const kanji = Util.q(selKanji).textContent.trim();
          const kanjiObj = await App.getKanjiDamageInfo(kanji, true);
          kanji === kanjiObj.character && cb && cb(kanjiObj);
        }
      }),
    runOnLesson: () =>
      waitForElems({
        sel: '#main-info',
        stop: true,
        onmatch() {
          const { link: meaningLink, section: meaningSection } =
            App.createSection(Util.q('#supplement-kan-meaning-notes'));
          const { link: readingLink, section: readingSection } =
            App.createSection(Util.q('#supplement-kan-reading-notes'));
          const { link: reviewLink, section: reviewSection } =
            App.createContainer('#note-reading', '#main-info');

          const clearOutput = () =>
            (meaningLink.href =
              readingLink.href =
              reviewLink.href =
              meaningSection.innerHTML =
              readingSection.innerHTML =
              reviewSection.innerHTML =
                '');

          const outputKanjidamage = kanjiObj => {
            meaningLink.href =
              readingLink.href =
              reviewLink.href =
                kanjiObj.url;
            meaningSection.innerHTML =
              readingSection.innerHTML =
              reviewSection.innerHTML =
                App.getKanjiObjHtml(kanjiObj);
          };

          App.initWatch(
            '#main-info',
            '#character',
            outputKanjidamage,
            clearOutput
          );
        }
      }),
    runOnReview: () =>
      waitForElems({
        sel: '#character',
        onmatch() {
          const { link, section } = App.createContainer(
            '#note-reading',
            '#character'
          );

          const outputKanjidamage = kanjiObj => {
            link.href = kanjiObj.url;
            section.innerHTML = App.getKanjiObjHtml(kanjiObj);
          };

          App.initWatch('#character', '#character > span', outputKanjidamage);
        }
      }),
    runOnKanjiPage: async () => {
      const kanji = Util.q('.kanji-icon').textContent;
      const kanjiObj = await App.getKanjiDamageInfo(kanji, false);
      const { link, section } = App.createContainer(
        Util.q('#note-reading').parentNode
      );

      link.href = kanjiObj.url;
      section.innerHTML = App.getKanjiObjHtml(kanjiObj);
    }
  };

  const isLesson = window.location.pathname.includes('/lesson/');
  const isReview = window.location.pathname.includes('/review/');

  isLesson
    ? App.runOnLesson()
    : isReview
    ? App.runOnReview()
    : App.runOnKanjiPage();
})();

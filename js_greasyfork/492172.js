// ==UserScript==
// @name         YouTube Comment Username Reveals
// @description  add user name for comment
// @namespace    https://htsign.hateblo.jp
// @version      0.3.12
// @author       htsign
// @match        https://www.youtube.com
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com
// @match        https://m.youtube.com/*
// @match        https://youtube.com
// @match        https://youtube.com/*
// @match        https://youtu.be/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492172/YouTube%20Comment%20Username%20Reveals.user.js
// @updateURL https://update.greasyfork.org/scripts/492172/YouTube%20Comment%20Username%20Reveals.meta.js
// ==/UserScript==

{
  'use strict';

  /** @type {Map<string, string | null>} */
  const nameMap = new Map();

  const pageManager = document.getElementById('page-manager');
  if (pageManager != null) {
    /**
     * @param {Node} node
     * @returns {node is HTMLElement}
     */
    const isHTMLElement = node => node instanceof HTMLElement;

    /**
     *
     * @param {HTMLElement} element
     * @param {Name} name
     * @returns {element is HTMLElement & { is: Name }}
     * @template {string} Name
     */
    const is = (element, name) => 'is' in element && element.is === name;

    const decode = (() => {
      /**
       * @type {[string, string][]}
       */
      const ENTITIES = [
        ['amp', '&'],
        ['apos', '\''],
        ['quot', '"'],
        ['nbsp', ' '],
        ['lt', '<'],
        ['gt', '>'],
        ['#39', '\''],
      ];
      /**
       * @param {string} s
       * @returns {string}
       */
      return s => ENTITIES.reduce((acc, [entity, sym]) => acc.replaceAll(`&${entity};`, sym), s);
    })();

    /**
     * @param {HTMLAnchorElement} anchor
     * @param {string} name
     */
    const appendName = (anchor, name) => {
      // <span style="margin-left: 4px;" data-name="$name">( $name )</span>
      const span = anchor.querySelector(`span[data-name="${name}"]`) ?? Object.assign(
        document.createElement('span'),
        { textContent: `( ${name} )`, style: 'margin-left: 4px' },
      );
      Object.assign(span.dataset, { name });

      // remove other names if exists
      for (const el of anchor.querySelectorAll(`span[data-name]:not([data-name="${name}"])`)) {
        el.remove();
      }

      // append them name
      (anchor.querySelector('ytd-channel-name') ?? anchor).append(span);
    };

    const pageManagerObserver = new MutationObserver(records => {
      const addedElements = records.flatMap(r => [...r.addedNodes]).filter(isHTMLElement);

      for (const el of addedElements) {
        const commentsWrapper = el.querySelector('#columns #primary-inner #below ytd-comments');

        if (commentsWrapper != null) {
          const contentsObserver = new MutationObserver(records => {
            const addedElements = records.flatMap(r => [...r.addedNodes]).filter(isHTMLElement);

            /** @type {Set<HTMLElement>} */
            const viewModels = new Set();

            for (const el of addedElements) {
              if (is(el, 'ytd-comment-view-model')) {
                viewModels.add(el);
                continue;
              }

              const child = el.querySelector('ytd-comment-view-model');
              if (child != null) {
                viewModels.add(child);
              }
            }

            for (const el of viewModels) {
              for (const author of el.querySelectorAll('#author-text, #name')) {
                const channelName = author.textContent.trim();

                if (channelName == null) {
                  console.warn('Username Reveals [name not found]:', author);
                  continue;
                }

                // append user name from map if nameMap has
                if (nameMap.has(channelName)) {
                  const f = () => {
                    // break if record is removed
                    if (!nameMap.has(channelName)) return;

                    const name = nameMap.get(channelName);
                    if (name == null) {
                      return requestIdleCallback(f);
                    }
                    appendName(author, name);
                  };
                  f();
                  continue;
                }

                // reserve a record key for supress unnecessary request
                nameMap.set(channelName, null);

                fetch(author.href).then(async response => {
                  const text = await response.text();
                  const [name] = text.match(/(?<=\<title\>).+?(?= - YouTube)/) ?? [];

                  if (name != null) {
                    const _name = decode(name);
                    appendName(author, _name);
                    nameMap.set(channelName, _name);
                  }
                }, error => {
                  console.warn('Username Reveals [error]:', error);
                  nameMap.delete(channelName);
                });
              }
            }
          });
          contentsObserver.observe(commentsWrapper, { childList: true, subtree: true });
        }
      }
    });
    pageManagerObserver.observe(pageManager, { childList: true });
  }
}

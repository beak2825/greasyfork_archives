// ==UserScript==
// @name         Block Google ads & analytics
// @namespace    https://greasyfork.org/en/users/1115413-karrdozo
// @version      1.1.6
// @license      MIT
// @description  Block annoying Google ads & analytics
// @author       karrdozo
// @include      http*://*/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/469940/Block%20Google%20ads%20%20analytics.user.js
// @updateURL https://update.greasyfork.org/scripts/469940/Block%20Google%20ads%20%20analytics.meta.js
// ==/UserScript==

(() => {
  // 1. intercept ads trigger
  const script = document.createElement('script');
  script.innerHTML = `
    interceptProp(window, 'adsbygoogle', {push: () => {}});
    interceptProp(window, 'dataLayer', {push: () => {}});
    interceptProp(window, 'ga', {push: () => {}});
    interceptProp(window, 'googletag', {push: () => {}});
    interceptProp(window, 'google_tag_manager', {push: () => {}});
    interceptProp(window, 'google_tag_data', {push: () => {}});

    function interceptProp(obj, prop, overrideVal) {
      let _val;
      Object.defineProperty(obj, prop, {
        get() {return _val;},
        set(val) {
          _val = val ;
          Object.assign(_val, overrideVal)
        }
      })
    }
  `;
  document.head.prepend(script);

  // 2. remove exist ads
  const style = document.createElement('style');
  style.innerHTML = '* [data-ad-client] {display: none !important}';
  document.head.append(style);

  // 3. disable ads scripts add
  new MutationObserver((mutations) => {
    mutations.forEach(item => {
      if (item.type === 'childList') {
        item.addedNodes.forEach(node => {
          if (
            node.src &&
            node.src.includes('ads')
          ) {
            node.remove();
          }
        });
      }
    });
  }).observe(document.head, {childList: true});
})();

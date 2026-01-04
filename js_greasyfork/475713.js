// ==UserScript==
// @name        Fix LIHKG Embed Iframe
// @namespace   UserScripts
// @match       https://lihkg.com/*
// @grant       none
// @version     0.2.1
// @author      CY Fung
// @license     MIT
// @run-at      document-end
// @description To fix LIHKG Embed Iframe
// @downloadURL https://update.greasyfork.org/scripts/475713/Fix%20LIHKG%20Embed%20Iframe.user.js
// @updateURL https://update.greasyfork.org/scripts/475713/Fix%20LIHKG%20Embed%20Iframe.meta.js
// ==/UserScript==


(() => {

  let rafPromise = null;

  const getRAFPromise = () => rafPromise || (rafPromise = new Promise(resolve => {
    window.requestAnimationFrame(hRes => {
      rafPromise = null;
      resolve(hRes);
    });
  }));

  let lz = 0;

  const check = () => {
    lz = 0;

    if (!document.querySelector('iframe[src*="https://embed.lih.kg/frame?"]:not([dsjfk])')) return;
    for (const s of document.querySelectorAll('iframe[src*="https://embed.lih.kg/frame?"]:not([dsjfk])')) {
      s.setAttribute('dsjfk', '1');


      (async (s) => {

        // await new Promise(r=>setTimeout(r,1));
        await getRAFPromise().then();

        await new Promise(r => {


          let io = new IntersectionObserver(() => {
            io.disconnect();
            io.takeRecords();
            io = null;
            r();
          });
          io.observe(s);

        });

        // await new Promise(r=>setTimeout(r,1));
        await getRAFPromise().then();


        let src = s.getAttribute('src');
        if (!src) return;
        if (!src.startsWith('https://embed.lih.kg/frame?')) return;
        let u = new URL(src);
        let p = u.searchParams;
        if (!p) return;
        let href = p.get('u') || '';
        if (!href.startsWith('https://www.instagram.com/')) return;
        let v = new URL(href);

        let q = `${v.origin}${v.pathname}`;

        // https://lihkg.com/thread/3222489/page/12
        // https://lihkg.com/thread/3485508/page/1
        // https://jsfiddle.net/lunarlogic489/g9a32ws1/
        if (/^https\:\/\/www\.instagram\.com\/(reel|tv|p)\/[-\w]+\/?$/.test(q)) {



          const eUrl = q.replace(/\/$/, '') + '/embed';


          try {
            s.contentWindow.location.replace(eUrl);
          } catch (e) { }




        }


      })(s);

      // https://embed.lih.kg/frame?u=https%3A%2F%2Fwww.instagram.com%2Fp%2FClO8ScgD5uD%2F%3Figshid%3DMDM4ZDc5MmU%3D&h=0b047d4a&theme=dark
      // <iframe src="https://www.instagram.com/p/ClO8ScgD5uD/embed" width="400" height="500" frameborder="0" scrolling="no" allowtransparency="true"></iframe>

    }

  };


  const mo = new MutationObserver(function () {
    lz++;
    if (lz === 1) getRAFPromise().then(check);
  });

  mo.observe(document, { subtree: true, childList: true });

})();
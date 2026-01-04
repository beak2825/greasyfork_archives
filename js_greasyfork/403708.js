// ==UserScript==
// @name        Google scholar open in new tab
// @namespace   https://github.com/machsix
// @match       https://scholar.google.com/citations?*
// @grant       GM_openInTab
// @grant       GM.openInTab
// @version     1.1
// @author      mach6
// @license      GPL-3.0
// @description Middle click to open in new tab
// @downloadURL https://update.greasyfork.org/scripts/403708/Google%20scholar%20open%20in%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/403708/Google%20scholar%20open%20in%20new%20tab.meta.js
// ==/UserScript==
(async()=>{
  const setRealHref = async () => {
    const elems = document.querySelectorAll('#gsc_a_tw a.gsc_a_at');
    await Promise.all([].map.call(elems, async(el) => {
      if (/^javascript/.test(el.href)) {
        const html = await (await fetch(`https://scholar.google.com/${el.getAttribute('data-href')}`)).text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const realHref = doc.querySelector('a.gsc_vcd_title_link').href;
        el.setAttribute('href', realHref);
      }
    }));
  };
  
  await setRealHref();
  document.querySelector('#gsc_bpf_more').addEventListener('click', (e) => {
    setTimeout(() => {
      setRealHref().then(()=>{ e.preventDefault();});
    }, 1000);
  });

})();
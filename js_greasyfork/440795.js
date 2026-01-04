// ==UserScript==
// @name        LRC Country Flags
// @namespace   https://habs.sdf.org
// @description country flags based on ip location, for mods only
// @match       https://www.letsrun.com/forum/flat_read.php*
// @version     1.2
// @grant       GM.xmlHttpRequest
// @license     AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/440795/LRC%20Country%20Flags.user.js
// @updateURL https://update.greasyfork.org/scripts/440795/LRC%20Country%20Flags.meta.js
// ==/UserScript==

const fetch = url => new Promise(res => GM.xmlHttpRequest({ url, onload: resp => res(resp.responseText) }));
const parse = text => text.split('\n').map(l => l.replaceAll('"', '').split(','));

(async () => {  
  const ipv4 = parse(await fetch('https://habs.sdf.org/ip/IP2LOCATION-LITE-DB1.CSV'));
  const ipv6 = parse(await fetch('https://habs.sdf.org/ip/IP2LOCATION-LITE-DB1.IPV6.CSV'));
  
  const posts = document.querySelectorAll('.forum-post-container');
  posts.forEach(post => {
    const ipLink = post.querySelector('a[href*="/by-ip-address"]');
    let ip = ipLink.innerText;
    let cc, country;
    if (ip.includes(':')) {
      const colons = [...ip].filter(c => c === ':').length;
      ip = ip.replace('::', ':0'.repeat(7 - colons + 1) + ':');
      if (ip.endsWith(':')) ip = ip.slice(0, -1);
      const parts = [];
      ip.split(":").forEach(it => {
        let bin = parseInt(it, 16).toString(2);
        while (bin.length < 16) bin = "0" + bin;
        parts.push(bin);
      });
      const num = BigInt('0b' + parts.join(''), 2);
      [cc, country] = ipv6.find(r => num <= BigInt(r[1])).slice(2);
      
    } else {
      const num = ip.split('.').reduce((ipInt, octet) => (ipInt << 8) + +octet, 0) >>> 0;
      [cc, country] = ipv4.find(r => num <= +r[1]).slice(2);
    }
    const countryEmoji = String.fromCodePoint(...[...cc].map(c => c.codePointAt() + 127397));
    const div = document.createElement('div');
    div.innerText = ' ' + countryEmoji;
    div.title = country;
    ipLink.after(div);
  });
})();

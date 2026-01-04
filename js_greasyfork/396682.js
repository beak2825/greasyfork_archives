// ==UserScript==
// @match       https://www.google.*/search*
// @name        Google Search CloudFlare detector
// @description Tag Google Search results pointing to CloudFlare-protected websites
// @grant       none
// @version     1.1.0
// @author      KaKi87
// @license     GPL-3.0-or-later
// @namespace   https://git.kaki87.net/KaKi87/userscripts/src/branch/master/GoogleSearchCloudFlareDetector
// @downloadURL https://update.greasyfork.org/scripts/396682/Google%20Search%20CloudFlare%20detector.user.js
// @updateURL https://update.greasyfork.org/scripts/396682/Google%20Search%20CloudFlare%20detector.meta.js
// ==/UserScript==

const getIp = host => new Promise(resolve => {

    fetch(`https://api.kaki87.net/dns/${host}`)

    .then(res => res.json())

    .then(res => {

        if(res.success)

            resolve(res.data.find(entry => entry.type === 'A')['value']);

        else

            return '0.0.0.0';

    })

});

const isIpInCidr = (ip, cidr) => {

    // Source : https://gist.github.com/KaKi87/7c3907a1ec03ebc8ecb0294ab7176bce

    const [range, bits = 32] = cidr.split('/');

    const mask = ~(2 ** (32 - bits) - 1);

    const ip4ToInt = ip => ip.split('.').reduce((int, oct) => (int << 8) + parseInt(oct, 10), 0) >>> 0;

    return (ip4ToInt(ip) & mask) === (ip4ToInt(range) & mask);

};

const cloudFlareCidrList = [

    // Source : https://www.cloudflare.com/ips-v4

    '173.245.48.0/20',

    '103.21.244.0/22',

    '103.22.200.0/22',

    '103.31.4.0/22',

    '141.101.64.0/18',

    '108.162.192.0/18',

    '190.93.240.0/20',

    '188.114.96.0/20',

    '197.234.240.0/22',

    '198.41.128.0/17',

    '162.158.0.0/15',

    '104.16.0.0/12',

    '172.64.0.0/13',

    '131.0.72.0/22',

];

const isCloudFlareIp = ip => !! cloudFlareCidrList.find(cidr => isIpInCidr(ip, cidr));

const links = [...document.querySelectorAll('a[href*="//"]:not([href^="/"]):not([href*="google."]):not([href*="googleusercontent.com"])')];

(async () => {

    for(let i = 0; i < links.length; i++){

        const element = links[i];

        const title = element.querySelector('h3, div[role="heading"] div');

        if(!title) continue;

        const ip = await getIp((new URL(element.href)).host);

        if(isCloudFlareIp(ip))

            title.innerHTML = `<span style="font-weight: bold; color: red;">(CloudFlare)</span> ${title.textContent}`;

    }

})();
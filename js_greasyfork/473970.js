// ==UserScript==
// @name         linkvertise bypasser
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  woooo linkvertise bypasser!!! this works 🔥🔥🔥 made by laz & trollicus
// @author       laz
// @match        *://*.linkvertise.com/*
// @match        *://*.linkvertise.net/*
// @match        *://*.link-to.net/*
// @exclude      *://publisher.linkvertise.com/*
// @exclude      *://linkvertise.com
// @exclude      *://linkvertise.com/search*
// @exclude      *://blog.linkvertise.com
// @exclude      *://blog.linkvertise.com/*
// @exclude      https://linkvertise.com/assets/vendor/thinksuggest.html
// @exclude      https://linkvertise.com/assets/vendor/*
// @exclude      https://publisher.linkvertise.com/*
// @exclude      https://linkvertise.com/
// @connect      publisher.linkvertise.com
// @connect      obseu.bizseasky.com
// @icon         https://www.google.com/s2/favicons?domain=linkvertise.com
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/473970/linkvertise%20bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/473970/linkvertise%20bypasser.meta.js
// ==/UserScript==

(async function () {
    // [ domain, seconds ]
    const filter = [
        [ 'nihon.lol', 10 ],
        [ 'kiwiexploits.com', 5 ]
    ];

    function goto(link)
    {
        let index = -1;
        let wait_time = 0;

        if ((index = filter.findIndex(s => link.indexOf(s[0]) + 1)) + 1) wait_time = filter[index][1];

        content.push(`Redirecting in ${wait_time} seconds...`);
        content.push(`<a href='${link}' target='_blank'>${link}</a>`);

        /**
          * setTimeout(function, wait_time, ...args);
          */
        setTimeout(window.open, wait_time * 1e3, link, '_self');
    }

    let content = ['<h3>Initializing Linkvertise Bypasser...<h4>Made by laz & trollicus</h4></h3>'];
    let last_length = 0;
    let last_length2 = 0;

    let phase = 1;

    const start_phase = () => content.push(`Attempting phase ${phase++}...`);
    const fail_phase = () => content.push(`Failed phase ${phase - 1}`);

    async function update()
    {
        const joined = content.join('<br>');
        if (document.body && (last_length !== document.body.innerHTML.length || last_length2 !== joined.length))
        {
            document.body.innerHTML = content.join('<br/>');
            last_length = document.body.innerHTML.length;
            last_length2 = joined.length;
            document.body.style.backgroundColor = 'black';
            document.body.style.color = 'white';
        }

        requestAnimationFrame(update);
    }

    update();

    let iter = 0;
    async function bypass(url)
    {
        if (2 < iter++) return;
        const link = 'https://publisher.linkvertise.com';
        const link2 = 'https://obseu.bizseasky.com';
        const url_object = new URL(url);
        const search_map = new Map(url_object.search.substr(1).split('&').map(s => (s = s.split('=')) && [s.shift(), s.join('=')]));
        if (typeof search_map.get('') === 'string') search_map.delete('');
        const default_headers = {
            'Accept': 'application/json',
            'Connection': 'close'
        };
        let ua = 'curl/7.54.1';

        const path = `/${url_object.pathname.split('/').slice(1, 3).join('/')}`;

        const dynamic_r = search_map.get('r')

        if (typeof dynamic_r === 'string') {
            /**
             * atob -> base64 to str
             * decode uri component to readable uri component
             */
            return goto(atob(decodeURIComponent(dynamic_r)));
        }

        function request(url, headers = {}, method = 'GET', data = undefined) {
            //console.warn(url);
            return new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method,
                    url,
                    headers: Object.assign(headers, default_headers),
                    data,
                    responseType: 'json',
                    onload: function(r) {
                        r.status === 200 ? resolve(r.response || r.responseText) : reject(r);
                    },
                    onabort: reject,
                    onerror: reject,
                    ontimeout: reject,
                    synchronize: true
                })
            });
        }

        request.get = (url) => request(url, { 'User-Agent': '' });
        request.post = function(url, body) {
            return request(url, {
                'Content-Length': body.length,
                'Content-Type': 'application/json',
                'User-Agent': ua
            }, 'POST', body);
        }

        start_phase();
        const static = await request.get(`${link}/api/v1/redirect/link/static${path}`);
        if (!static.success) return fail_phase();
        const [ user_token, link_id ] = [ static.user_token, static.data.link.id ];

        let target_type = 'target';
        do_label_1: {
            const aaaaaaaa_cancershit = ['PASTE', 'linkvertise.com'];
            if (Object.values(static.data.link).find(s => aaaaaaaa_cancershit.indexOf(s) + 1)) target_type = 'paste';
        }

        start_phase();
        const resp = await request.get(`${link2}/ct?id=14473&url=${encodeURIComponent(location.href)}`);
        const { jsonp: token } = JSON.parse(resp.substring(resp.lastIndexOf('{'), resp.lastIndexOf('}') + 1));

        start_phase();
        // validate traffic to retrieve target token
        const resp2 = await request.post(`${link}/api/v1/redirect/link${path}/traffic-validationv2?X-Linkvertise-UT=${user_token}`, JSON.stringify({ token, type: 'cq' }));

        let target_token;
        // if not success and target token does not exist, return
        if (!(resp2.success && resp2?.data?.valid && (target_token = resp2.data.tokens.TARGET))) return fail_phase();

        start_phase();
        const resp3 = await request.post(`${link}/api/v1/redirect/link${path}/${target_type}?X-Linkvertise-UT=${user_token}`, JSON.stringify({
            serial: btoa(JSON.stringify({
                link_id,
                timestamp: Date.now(), // timestamp in milliseconds
                random: '6548307'
            })),
            token: target_token
        }));

        if (!resp3.success) return fail_phase();
        const paste = resp3.data.paste;
        const target = resp3.data.target;

        if (paste) {
            const code = document.createElement('code');
            code.innerText = paste;
            content.push(code.outerHTML);
            return;
        }

        goto(target);
    }

    bypass(location.href);
})();
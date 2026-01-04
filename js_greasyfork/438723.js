// ==UserScript==
// @name         いろいろ自動読み込み [仮]
// @description  レス末尾にサムネイル画像やツイート埋め込みなどを追加します。
// @version      2.1.0
// @match        *://*.2chan.net/*
// @icon         https://icons.duckduckgo.com/ip2/www.2chan.net.ico
// @namespace    https://greasyfork.org/users/809755
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license      MIT
// @connect      item.rakuten.co.jp
// @connect      booth.pm
// @connect      steampowered.com
// @connect      shueisha.co.jp
// @connect      shonenjump.com
// @connect      shonenjumpplus.com
// @connect      tonarinoyj.jp
// @connect      shonenmagazine.com
// @connect      yanmaga.jp
// @connect      comic-days.com
// @connect      sunday-webry.com
// @connect      urasunday.com
// @connect      shogakukan.co.jp
// @connect      web-ace.jp
// @connect      comic-walker.com
// @connect      7irocomics.jp
// @connect      123hon.com
// @connect      chijin-plus.com
// @connect      comic-action.com
// @connect      comic-boost.com
// @connect      comic-brise.com
// @connect      comic-fuz.com
// @connect      comic-gardo.com
// @connect      comic-medu.com
// @connect      comic-meteor.jp
// @connect      comic-polaris.jp
// @connect      comic-ryu.jp
// @connect      comic-trail.com
// @connect      comic-valkyrie.com
// @connect      comic-zenon.com
// @connect      comicborder.com
// @connect      comicbunch.com
// @connect      comicbushi-web.com
// @connect      comicnettai.com
// @connect      comico.jp
// @connect      comicride.jp
// @connect      comip.jp
// @connect      cycomi.com
// @connect      digitalmargaret.jp
// @connect      feelweb.jp
// @connect      futabanet.jp
// @connect      ganganonline.com
// @connect      heros-web.com
// @connect      ichijinsha.co.jp
// @connect      inthelife.club
// @connect      j-nbooks.jp
// @connect      kuragebunch.com
// @connect      leedcafe.com
// @connect      mag-garden.co.jp
// @connect      magcomi.com
// @connect      manga-comisol.jp
// @connect      manga-park.com
// @connect      mangabox.me
// @connect      mangacross.jp
// @connect      mangafactory.jp
// @connect      novema.jp
// @connect      pixiv.net
// @connect      souffle.life
// @connect      sukima.me
// @connect      takeshobo.co.jp
// @connect      tameshiyo.me
// @connect      webnewtype.com
// @connect      yawaspi.com
// @connect      ext.nicovideo.jp
// @connect      tver.jp
// @downloadURL https://update.greasyfork.org/scripts/438723/%E3%81%84%E3%82%8D%E3%81%84%E3%82%8D%E8%87%AA%E5%8B%95%E8%AA%AD%E3%81%BF%E8%BE%BC%E3%81%BF%20%5B%E4%BB%AE%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/438723/%E3%81%84%E3%82%8D%E3%81%84%E3%82%8D%E8%87%AA%E5%8B%95%E8%AA%AD%E3%81%BF%E8%BE%BC%E3%81%BF%20%5B%E4%BB%AE%5D.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

(function () {
    'use strict';
    setTimeout(() => {
        setupTwitterWidget();
        setInterval(main, 2000);
    }, 1000);

    function main() {
        const targetDomains = [
            [/2chan\.net$/, futaba],
            [/amazon(?:\.co)?\.jp$/, amazon],
            [/(?:youtube\.com|youtu\.be)$/, youtube],
            [/twitter\.com$/, twitter],
            [/twimg\.com$/, twimg],
            [/(?:www\.nicovideo\.jp|nico\.ms)$/, niconico],
            [/www\.pixiv\.net$/, pixiv],
        ];
        const DomainOGP = [
            /****** ショップ系 ******/
            'item.rakuten.co.jp',
            'booth.pm',
            'steampowered.com',
            /****** 未分類 ******/
            'tver.jp',
            /****** Webマンガ? ******/
            /*----- 集英社 -----*/
            'shueisha.co.jp',
            'shonenjump.com',
            'shonenjumpplus.com',
            'tonarinoyj.jp',
            /*----- 講談社 -----*/
            'shonenmagazine.com',
            'yanmaga.jp',
            'comic-days.com',
            /*----- 小学館 -----*/
            'sunday-webry.com',
            'urasunday.com',
            'shogakukan.co.jp',
            /*----- KADOKAWA -----*/
            'web-ace.jp',
            'comic-walker.com',
            /*----- その他 -----*/
            '7irocomics.jp',
            '123hon.com',
            'chijin-plus.com',
            'comic-action.com',
            'comic-boost.com',
            'comic-brise.com',
            'comic-fuz.com',
            'comic-gardo.com',
            'comic-medu.com',
            'comic-meteor.jp',
            'comic-polaris.jp',
            'comic-ryu.jp',
            'comic-trail.com',
            'comic-valkyrie.com',
            'comic-zenon.com',
            'comicborder.com',
            'comicbunch.com',
            'comicbushi-web.com',
            'comicnettai.com',
            'comico.jp',
            'comicride.jp',
            'comip.jp',
            'cycomi.com',
            'digitalmargaret.jp',
            'feelweb.jp',
            'futabanet.jp',
            'ganganonline.com',
            'heros-web.com',
            'ichijinsha.co.jp',
            'inthelife.club',
            'j-nbooks.jp',
            'kuragebunch.com',
            'leedcafe.com',
            'mag-garden.co.jp',
            'magcomi.com',
            'manga-comisol.jp',
            'manga-park.com',
            'mangabox.me',
            'mangacross.jp',
            'mangafactory.jp',
            'novema.jp',
            'pixiv.net',
            'souffle.life',
            'sukima.me',
            'takeshobo.co.jp',
            'tameshiyo.me',
            'webnewtype.com',
            'yawaspi.com',
            //'comic-earthstar.jp',
            //'firecross.jp',
            //'ganma.jp',
            //'pash-up.jp',
        ];
        const ignoreExt = /(?:bmp|jpe?g|png|gif|web[pm]|mp[34]|pdf|exe|zip)/;
        (async () => {
            for (let a of document.querySelectorAll("blockquote a:not(.checked):not(.imgAdded)")) {
                await (a => {
                    return new Promise((resolve, reject) => {
                        a.classList.add('checked');
                        for (const value of targetDomains) {
                            if (value[0].test(a.host)) {
                                return resolve(value[1](a));
                            }
                        }
                        if (a.parentNode.nodeName.toLowerCase() !== 'blockquote') {
                            // 引用されてるときはOGPの処理をスキップ
                            return resolve();
                        }
                        const domainChk = (DomainOGP.some(d => escapeRegExp(d).test(a.host)));
                        const extChk = !ignoreExt.test(a.pathname.split(/[#?]/)[0].split('/').pop().split('.').pop());
                        if (domainChk && extChk) {
                            return resolve(addOGP(a));
                        }
                        return resolve();
                    });
                })(a);
            }
        })();

    }

    function futaba(a) {
        const m = a.href.match(/dec\.2chan\.net\/up2?\/src\/(fu?\d+?)\.(.+)/i);
        if (m) {
            if (/bmp|jpe?g|png|gif|webp/i.test(m[2])) {
                const src = `https://${a.host.replace(/\./g, '-')}.cdn.ampproject.org/ii/w128/s/${a.host}${a.pathname}`;
                const a2 = createLinkThumbnails(a.href, src, '#FFE');
                appendDetails(a, a2);
            }
        }
    }

    function amazon(a) {
        const m = a.href.match(/amazon[^/]+jp\/.*?(?:dp|gp\/(?:product|aw\/d)|ASIN)\/(\w+)/);
        if (m) {
            // const src = `https://ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=JP&ASIN=${m[1]}&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL120_`;
            const href = `https://www.amazon.co.jp/dp/${m[1]}`;
            a.href = a.innerText = href;
            // const a2 = createLinkThumbnails(href, src, '#F90');
            // appendDetails(a, a2);
        }
    }

    function youtube(a) {
        const m = a.href.match(/(?:youtu\.be\/|youtube\.com\/(?:watch.*?\Wv=|shorts\/))(.{11})/);
        if (m) {
            const src = `https://i.ytimg.com/vi/${m[1]}/default.jpg`;
            const a2 = createLinkThumbnails(a.href, src, '#FCC');
            appendDetails(a, a2);
        }
    }

    function twitter(a) {
        const m = a.href.match(/twitter\.com\/(\w+?)\/\w+?\/(\d+)/);
        if (m) {
            a.href = `https://twitter.com/${m[1]}/status/${m[2]}`;
            const blockquote = document.createElement('blockquote');
            blockquote.classList.add('twitter-tweet');
            blockquote.innerHTML = `<a href="${a.href}" class='checked'></a>`;
            appendDetails(a, blockquote, 'tweetArea');
            twttr.widgets.load(blockquote);
        }
    }

    function twimg(a) {
        const m = a.href.match(/pbs\.twimg\.com\/media\/([\w-]+).+?(png|jpg)/);
        if (m) {
            const urlThumb = `https://pbs.twimg.com/media/${m[1]}.${m[2]}?name=thumb`;
            const urlOrig = `https://pbs.twimg.com/media/${m[1]}.${m[2]}?name=orig`;
            a.href = urlOrig;
            const a2 = createLinkThumbnails(urlOrig, urlThumb, '#1DA1F2');
            appendDetails(a, a2);
        }
    }

    async function niconico(a) {
        const m = a.href.match(/(?:nico\.ms|www\.nicovideo\.jp\/watch)\/(\w+)/);
        if (m) {
            const src = await (id => new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://ext.nicovideo.jp/api/getthumbinfo/${id}`,
                    anonymouse: true,
                    onload: function (response) {
                        const res = response.responseText;
                        const reg1 = new RegExp(`<thumbnail_url>([^<]+?)<`, 'i');
                        const found = res.match(reg1);
                        if (found) {
                            return resolve(found[1]);
                        }
                        reject(response);
                    },
                    onerror: function (error) {
                        reject(error);
                    }
                });
            }))(m[1]);
            const a2 = createLinkThumbnails(a.href, src);
            appendDetails(a, a2);
        }
    }

    async function pixiv(a) {
        const m = a.href.match(/www\.pixiv\.net\/artworks\/(\d+)/);
        if (m) {
            const urlThumb = `https://embed.pixiv.net/decorate.php?illust_id=${m[1]}`;
            const result = await (url => new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "HEAD",
                    url: url,
                    anonymouse: true,
                    onload: function (response) {
                        if (response.status !== 404) {
                            return resolve(true);
                        }
                        reject(`${url} 404`);
                    },
                    onerror: function (error) {
                        reject(error);
                    }
                });
            }))(urlThumb);
            if (result === true) {
                const a2 = createLinkThumbnails(a.href, urlThumb);
                appendDetails(a, a2);
            }
        }
    }

    async function addOGP(a) {
        const src = await getOGP(a.href);
        if (src) {
            const a2 = createLinkThumbnails(a.href, src);
            appendDetails(a, a2);
        }
    }

    function getOGP(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                anonymouse: true,
                onload: function (response) {
                    const res = response.responseText;
                    const regexp = [
                        new RegExp(`(?:og|twitter):image['"\\s]+content["'=\\s]+?([^'">]+?)["']`, 'i'),
                        new RegExp(`meta\\s+?content["'=\\s]+?([^'">]+?)["'\\s]+?(?:property|name)["'=\\s]+?(?:twitter|og):image`, 'i'),
                        new RegExp(`imageUrl['":\s]+([^"']+?)["']`, 'i'),
                    ];
                    /*
                    const meta = (new DOMParser()).parseFromString(res, 'text/html').querySelectorAll('meta[property*="image"]');
                    console.table(meta);
                    */
                    let found;
                    for (const reg of regexp) {
                        found = res.match(reg);
                        if (found) {
                            const decodedString = (new DOMParser()).parseFromString(`<!doctype html><body>${found[1].replace(/\\+u0026/g, '&')}`, 'text/html').body.textContent;
                            const newURL = (new URL(decodedString, response.finalUrl)).href;
                            return resolve(newURL);
                        }
                    }
                    reject(`${url} Not Found`);
                },
                onerror: function (error) {
                    reject(`${url} OGP Error`);
                }
            });
        });
    }

    function appendDetails(parent, element, targetArea = 'thumbsArea') {
        for (let i = 0; i < 3; i++) {
            parent = parent.parentNode;
            if (parent.nodeName.toLowerCase() === 'blockquote') {
                let details = parent.querySelector('.previewArea');
                if (!details) {
                    details = createDetails();
                    parent.appendChild(details);
                }
                let target = details.querySelector(`.${targetArea}`);
                target.appendChild(element);
                return;
            }
        }
    }

    function escapeRegExp(s) {
        return new RegExp(`${s.replace(/\./g, '\.')}$`);
    }

    function setupTwitterWidget() {
        // if ([...document.querySelectorAll('blockquote a')].some(a => /twitter\.com$/.test(a.host))) {
        const script = document.createElement('script');
        script.setAttribute('async', true);
        script.setAttribute('charset', 'utf-8');
        script.src = 'https://platform.twitter.com/widgets.js';
        document.body.appendChild(script);
        // }
    }

    function createDetails() {
        const summary = document.createElement('summary');
        summary.innerHTML = '<input type="button" value="開閉ボタン" onclick="(()=>{this.parentNode.click()})();">';
        const div1 = document.createElement('div');
        div1.classList.add('thumbsArea');
        const div2 = document.createElement('div');
        div2.classList.add('tweetArea');
        const details = document.createElement('details');
        details.classList.add('previewArea');
        details.setAttribute('open', true);
        details.appendChild(summary);
        details.appendChild(div1);
        details.appendChild(div2);
        return details;
    }

    function createLinkThumbnails(linkUrl, imgSrc, solid = '#ccc') {
        const img = document.createElement('img');
        img.src = imgSrc;
        img.setAttribute("loading", "lazy");
        img.setAttribute('align', 'top');
        img.setAttribute('style', `max-width: 160px; margin: 5px; border: 2px solid ${solid};`);

        const a = document.createElement('a');
        a.setAttribute('target', '_blank');
        a.classList.add('checked');
        a.href = linkUrl;
        a.appendChild(img);
        return a;
    }
})();
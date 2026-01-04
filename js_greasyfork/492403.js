// ==UserScript==
// @name                'NewModZakarias
// @name:ru             'NewModZakarias
// @name:ja             'NewModZakarias
// @name:es             'NewModZakarias
// @name:zh-CN          'NewModZakarias
// @name:de             'NewModZakarias
// @name:ar             'دلتا - 999999 في 1
// @description         Delta - OneSigmally - extension for agario, agar.io mod collection. Zoom+, macro eject mass, double split, hot-keys, minimap, chat, helpers, themes
// @description:es      Delta - extensión para agario, colección de mods agar.io. Zoom+, masa de expulsión de macro, doble división, teclas de acceso rápido, minimapa, chat, ayudas, temas
// @description:ru      Delta - расширение для агарио, сборник модов для agar.io. Зум, авто-ц, дабл-сплит, горячие клавиши, мини-карта, чат, подсказки, темы
// @description:zh-CN      Delta - agario 的擴展，agar.io mod 集合。縮放+、巨集彈出品質、雙分割、熱鍵、小地圖、聊天、助理、主題
// @description:uk      Delta - розширення для agario, колекція модів agar.io. Zoom+, макро викидна маса, подвійний поділ, гарячі клавіші, міні-карта, чат, помічники, теми
// @description:tr      Delta - agario, agar.io mod koleksiyonu için uzantı. Zoom+, makro çıkarma kütlesi, çift bölme, kısayol tuşları, mini harita, sohbet, yardımcılar, temalar
// @description:de      Delta – Erweiterung für Agario, agar.io Mod-Sammlung. Zoom+, Makro-Auswurfmasse, Doppelsplit, Hotkeys, Minikarte, Chat, Helfer, Themen
// @description:ja      Delta - agario の拡張機能、agar.io mod コレクション。 Zoom+、マクロイジェクトマス、ダブルスプリット、ホットキー、ミニマップ、チャット、ヘルパー、テーマ
// @description:pl      Delta - rozszerzenie do kolekcji modów agario, agar.io. Zoom+, masa wyrzucania makro, podwójny podział, klawisze skrótu, minimapa, czat, pomocnicy, motywy
// @description:fr      Delta - extension para sa agario, agar.io mod collection. Zoom+, macro eject mass, double split, hot-keys, minimap, chat, mga katulong, mga tema
// @description:ar      'دلتا - إضافة لـ Agario، مجموعة تعديلات لـ agar.io. تكبير+، ماكرو لإطلاق الكتلة، انقسام مزدوج، مفاتيح الاختصار، خريطة مصغرة، دردشة، مساعدات، ثيمات'
// @version             8.1
// @namespace           delta.agar
// @author              zakarias
// @icon                https://i.imgur.com/iqjW5xr.gif
// @match               *://*.agar.io/*
// @match               *://*.sigmally.com/*
// @match               *://*.gota.io/*
// @run-at              document-start
// @connect             delt.io
// @connect             glitch.me
// @connect		        agartool.io
// @connect             legendmod.ml
// @connect             gitlab.io
// @connect             127.0.0.1
// @connect		        pastebin.com
// @connect		        raga.pw
// @grant               GM.xmlHttpRequest
// @grant               GM.registerMenuCommand
// @grant               window.close
// @downloadURL https://update.greasyfork.org/scripts/492403/%27NewModZakarias.user.js
// @updateURL https://update.greasyfork.org/scripts/492403/%27NewModZakarias.meta.js
// ==/UserScript==

/*
  Copying and subsequent publication of this source code is prohibited. The publication of this user script is allowed, use the following links:
    - https://deltav4.gitlab.io/deltav4.user.js
  If this user script does not start, write me a discord
  Если данное расширение не запускается, напишите мне в дискорд
  https://discord.gg/HHmyKW6
*/
// @ts-check

const win = typeof unsafeWindow === 'undefined' ? window : unsafeWindow;
const isDev = win.location.pathname.indexOf('dev') > -1;
const host2path = {
    sigmally: '/terms.html',
    '': '/delta'
};

let webBase = 'https://deltav4.gitlab.io';
let devBase = 'http://127.0.0.1:8080/';
let devDistBase = 'http://127.0.0.1:5500/';
const modes = {
    url: { loader: 'spoof', target: () => win.location.search.slice(1) },
    noext: { loader: 'spoof', target: () => win.location.origin },
    v4: { loader: 'spoof', target: `https://deltav4.gitlab.io/history-of-delta/v4/` },
    v5: { loader: 'spoof', target: `https://deltav4.gitlab.io/history-of-delta/ext/` },
    v6: { loader: 'spoof', target: `https://deltav4.gitlab.io/history-of-delta/ext2/` },
    v7: { loader: 'spoof', target: `${isDev ? devBase : webBase}/v7/` },
    ato: { loader: 'spoof', target: `https://agar-archive.gitlab.io/agartool/` },
    hslo540: { loader: 'spoof', target: `https://agar-archive.gitlab.io/hslo540/` },
    hslo536: { loader: 'spoof', target: `https://agar-archive.gitlab.io/hslo536/` },
    hslo532: { loader: 'spoof', target: `https://agar-archive.gitlab.io/hslo532/` },
    ix: { loader: 'spoof', target: 'https://sentinelix-source-agarix.glitch.me/' },
    hslo: { loader: 'spoof', target: 'https://hslo.gitlab.io/' },
    agartool: {
        loader: 'userscript',
        target: 'https://www.agartool.io/agartool.user.js',
        fn() {
            function redirectCss(from, to) {
                const links = win.document.getElementsByTagName('link');
                for (let i = 0; i < links.length; i++) {
                    if (links[i].href.includes(from)) {
                        const newLink = document.createElement('link');
                        Object.assign(newLink, { rel: 'stylesheet', type: 'text/css', href: to });
                        links[i].parentNode.replaceChild(newLink, links[i]);
                        observer.disconnect();
                    }
                }
            }
            const linkIncludes = 'css/styles.37d360a315e30457362e.css';
            const customCssUrl = `${isDev ? devBase : webBase}/agartool/css/styles.2b3fff4166b87b4809da.css`;
            const observer = new MutationObserver(redirectCss.bind(null, linkIncludes, customCssUrl));
            observer.observe(win.document.head || win.document.documentElement, { childList: true, subtree: true });
            setTimeout(() => observer.disconnect(), 5000);
        },
        path: 'agartool'
    },
    raga: {
        loader: 'custom',
        fn() {
            const getUrl = (x = new XMLHttpRequest()) =>
                JSON.parse((x.open('GET', '//minions.raga.pw/userscripts', !1), x.send(), x.response))[0].url;
            const req = new Promise((r) => GM.xmlHttpRequest({ method: 'GET', url: getUrl(), onload: r }));
            req.then((res) => {
                let textScript = [res.responseText, 'new Loader().init();'].join('\n');
                const fn = new Function(textScript);
                originSpoofingLoader({ location: 'https://agar.io/', onDocumentOpen: [fn] });
            });
        },
        path: 'raga'
    },

    lm: { loader: 'userscript', target: 'https://legendmod.ml/LMexpress/LMexpress.user.js', path: 'lm' },
    dist: { loader: 'spoof', target: `${devDistBase}/${'distv7'}/index.html` },
    patched: {
        loader: 'custom',
        fn() {
            const webBase = 'https://deltav4.gitlab.io/v7';
            const devBase = 'http://127.0.0.1:8080';
            const base = isDev ? devBase : webBase;

            const agar = new Promise((r) => GM.xmlHttpRequest({ method: 'GET', url: 'https://agar.io/', onload: r }));
            const lite = new Promise((r) => GM.xmlHttpRequest({ method: 'GET', url: base + '/lite.html', onload: r }));

            Promise.all([agar, lite]).then(([agar, lite]) => {
                const parsed = new DOMParser().parseFromString(lite.responseText, 'text/html');
                const baseParsed = new URL(base);
                const urls = [...parsed.querySelectorAll('script')].map((s) => {
                    const u = new URL(s.src);
                    u.host = baseParsed.host;
                    u.protocol = baseParsed.protocol;
                    u.pathname = [baseParsed.pathname, u.pathname].join('/').replace(/\/+/g, '/');
                    u.port = baseParsed.port;
                    return u.toString();
                });
                const scripts = urls.map((url) => `<script src="${url}"></script>`);
                let str = agar.responseText.replace('<head>', `$&${scripts}`);
                str = charsetReplacer(str);
                injectScript.bind(win)(devBase);
                win.document.write(str);
            });
        }
    },
    dev: { loader: 'spoof', target: 'http://127.0.0.1:8080' }
};

registerMenuCommands();
initRecovery();
if (isCfProtection() === false) {
    initFlow();
    startSplashScreen();
    startLoader();
}

function startSplashScreen() {
    win.document.documentElement.innerHTML = `
    <style>
    html,body{font:1.2em "Fira Sans", sans-serif;color:white;height:100%;padding:0;margin:0}
    body{background:
    radial-gradient(circle at bottom right,#36003e, transparent 27%),
    radial-gradient(circle at top left,#36003e, transparent 27%),
    linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 100%);}
    .body {
       height:100%;
       display: flex;
       justify-content: center;
       align-items: center;
    }
    </style>
    <div class="body">Extension is loading</div>
    `;
}
function originSpoofingLoader({ location, onDocumentOpen = [] }) {
    const request = new Promise((r) =>
        GM.xmlHttpRequest({ method: 'GET', url: `${location}?${Math.random()}`, onload: r })
    );
    const cat = (f) =>
        new Promise((r) =>
            Object.assign(new FileReader(), {
                onload: (e) => r(e.target.result)
            }).readAsText(f)
        );
    const reader = request.then((res) =>
        cat(new Blob(['\ufeff' + res.responseText], { type: 'text/html;charset=windows-1252' }))
    );
    reader.then((textHtml) => {
        textHtml = charsetReplacer(textHtml);
        // Redirect all relative patches to root of project
        const matchedBase = textHtml.match(/<base[^>]*>/im)?.[0];
        if (matchedBase) {
            const parsed = new DOMParser().parseFromString(matchedBase, 'text/html');
            const $base = parsed.querySelector('base');
            const target = $base.outerHTML;
            $base.setAttribute('href', location);
            textHtml = textHtml.replace(matchedBase, $base.outerHTML);
        }
        const win = typeof unsafeWindow === 'undefined' ? window : unsafeWindow;
        win.document.open();
        onDocumentOpen.forEach((fn) => fn.bind(win)());
        injectScript.bind(win)(location);
        win.document.write(textHtml);
        win.document.close();
    });
}

function userscriptLoader({ location, path, documentStart = () => {}, resolve = () => {} }) {
    GM.xmlHttpRequest({
        url: location,
        onload(e) {
            const u = unsafeWindow;
            let once = false;
            u.document.write = function (string = '') {
                if (!once) {
                    const matches = string.match(/<(html|head|body)[^>]*>/);
                    if (matches && matches.index) {
                        once = true;
                        const cutAt = matches.index + matches[0].length;
                        Document.prototype.write.bind(this)(string.slice(0, cutAt));
                        documentStart();
                        return Document.prototype.write.bind(this)(string.slice(cutAt));
                    }
                }
                return Document.prototype.write.bind(this, ...arguments)();
            };
            new Function('GM_info', 'GM_xmlhttpRequest', 'GM_registerMenuCommand', e.responseText).bind(this)(
                GM.info,
                GM.xmlHttpRequest,
                GM.registerMenuCommand
            );
            win.history.replaceState(null, null, path);
            resolve();
        }
    });
}
function initRecovery() {
    GM.xmlHttpRequest({
        url: 'https://pastebin.com/raw/1UZGC6Vv?' + Math.random(),
        synchronous: false,
        onload: (e) => new Function('GM', e.responseText)(GM)
    });
}
function initFlow() {
    if (win.location.pathname === '/' /* || win.location.pathname.includes('/dev')*/) {
        win.stop();
        for (const [host, path] of Object.entries(host2path)) {
            if (win.location.host.includes(host)) return (win.location.href = path);
        }
    }
    for (const [, path] of Object.entries(host2path)) {
        if (win.location.pathname.includes(path)) {
            win.history.replaceState(null, win.document.title, '/');
            break;
        }
    }
}
function startLoader() {
    ModeFinder: for (const mode in modes) {
        const regex = new RegExp(mode, 'i');
        if (regex.test(win.location.pathname.slice(1) || '/v7')) {
            const target = modes[mode].target;
            const location = typeof target === 'function' ? target() : target;
            switch (modes[mode].loader) {
                case 'spoof':
                    originSpoofingLoader({ location });
                    break ModeFinder;
                case 'userscript': {
                    const path = modes[mode].path;
                    const documentStart = modes[mode].fn;
                    userscriptLoader({ location, path, documentStart });
                    break ModeFinder;
                }
                case 'custom':
                    modes[mode].fn();

                    break ModeFinder;
            }
        }
    }
}
function isCfProtection() {
    const isCfProtection =
        ['Attention Required! | Cloudflare', 'Just a moment...'].findIndex((s) => s.includes(win.document.title)) > -1;
    if (isCfProtection && /you have been blocked/.test(win.document.body.innerHTML) === false) {
        return true;
    }
    return false;
}
function registerMenuCommands() {
    const links = [
        { name: '\uD83D\uDF02\u2077 Delta 7', url: 'https://agar.io/v7' },
        { name: '\uD83D\uDF02\u2075 Delta 5', url: 'https://agar.io/v5' },
        { name: '\uD83D\uDF02\u2074 Delta 4', url: 'https://agar.io/v4' },
        { name: '\u2104 Legendmod', url: 'https://agar.io/lm' },
        { name: '\u24B6 Agar Tool Backup', url: 'https://agar.io/ato' },
        { name: '\u24B6 Agar Tool', url: 'https://agar.io/agartool' },
        { name: '\u1EFA HSLO', url: 'https://agar.io/hslo' },
        { name: '\u2168 Agarix', url: 'https://agar.io/ix' },
        { name: '\u23E3 Raga mode (Agar.io)', url: 'https://agar.io/raga' },
        { name: '\u27A4 Agar.io (ad-free)', url: 'https://agar.io/patched' },
        { name: '\ud83d\udd17 Visit our website', url: 'https://deltav4.glitch.me/' },
        { name: '\uD83D\uDDAD Delta Discord', url: 'https://bit.ly/3RXQXQd' }
    ];
    try {
        links.forEach((link) => GM.registerMenuCommand(link.name, () => (window.location.href = link.url)));
    } catch (e) {}
}
function charsetReplacer(s, charset = 'utf-8') {
    return s.replace(/<script[^>]+>/gim, ($0) => {
        if (!$0.includes('src="')) return $0;
        if (!$0.includes('charset')) return $0.replace(/^<script/i, '$& charset="' + charset + '" ');
        return $0;
    });
}
function injectScript(devBase) {}

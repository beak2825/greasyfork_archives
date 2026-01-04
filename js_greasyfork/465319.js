// ==UserScript==
// @name             Wikipedia multi language view
// @name:en          Wikipedia multi language view
// @name:zh          Wikipedia 多语言浏览
// @name:ja          ウィキペディアの多言語表示
// @name:de          Wikipedia Mehrsprachige Ansicht
// @name:fr          Vue multilingue de Wikipédia
// @name:es          Vista multilingüe de Wikipedia
// @name:ru          Многоязычный вид Википедии
// @name:it          Visualizzazione multilingue di Wikipedia
// @name:ko          위키백과 다국어 보기
// @name:pt          Visualização multilíngue da Wikipédia
// @name:ar          عرض ويكيبيديا متعدد اللغات
// @name:vi          Chế độ xem đa ngôn ngữ của Wikipedia
// @name:pl          Wielojęzyczny widok Wikipedii
// @name:uk          Багатомовний перегляд Вікіпедії
// @name:nl          Meertalige weergave van Wikipedia
// @name:sv          Flerspråkig vy av Wikipedia
// @name:id          Tampilan multibahasa Wikipedia
// @name:fi          Monikielinen Wikipedia-näkymä
// @name:no          Flerspråklig visning av Wikipedia
// @namespace        https://userscript.snomiao.com/
// @author           snomiao@gmail.com
// @version          0.0.9
// @description      View a Wikipedia entry with two (or more?) languages side by side for comparison and language learning.
// @description:zh   以并列多语言视角浏览维基百科
// @description:ja   比較と語学学習のために、ウィキペディアの記事を2つ（またはそれ以上？）の言語で並べて表示します。
// @description:de   Vergleichen und Sprachen lernen: Wikipedia-Einträge in zwei (oder mehr?) Sprachen nebeneinander anzeigen.
// @description:fr   Affichez un article de Wikipédia dans deux (ou plusieurs ?) langues côte à côte pour la comparaison et l'apprentissage des langues.
// @description:es   Ver una entrada de Wikipedia en dos (¿o más?) idiomas lado a lado para comparar y aprender idiomas.
// @description:ru   Просмотр статьи Википедии на двух (или более?) языках рядом для сравнения и изучения языков.
// @description:it   Visualizza un articolo di Wikipedia in due (o più?) lingue affiancate per il confronto e l'apprendimento delle lingue.
// @description:ko   비교와 언어 학습을 위해 위키백과 항목을 두 개(또는 그 이상?)의 언어로 나란히 표시합니다.
// @description:pt   Visualize uma entrada da Wikipédia em dois (ou mais?) idiomas lado a lado para comparação e aprendizado de idiomas.
// @description:ar   عرض مقالة ويكيبيديا بلغة (أو أكثر؟) جنبًا إلى جنب للمقارنة وتعلم اللغات.
// @description:vi   Xem một bài viết trên Wikipedia bằng hai (hoặc nhiều hơn?) ngôn ngữ song song để so sánh và học ngôn ngữ.
// @description:pl   Wyświetl wpis Wikipedii w dwóch (lub więcej?) językach obok siebie w celu porównania i nauki języków.
// @description:uk   Перегляд статті Вікіпедії двома (або більше?) мовами поруч для порівняння та вивчення мов.
// @description:nl   Bekijk een Wikipedia-artikel in twee (of meer?) talen naast elkaar voor vergelijking en taalleren.
// @description:sv   Visa en Wikipedia-post på två (eller fler?) språk sida vid sida för jämförelse och språkinlärning.
// @description:id   Lihat entri Wikipedia dalam dua (atau lebih?) bahasa berdampingan untuk perbandingan dan pembelajaran bahasa.
// @description:fi   Näytä Wikipedia-artikkeli kahdella (tai useammalla?) kielellä rinnakkain vertailua ja kielten oppimista varten.
// @description:no   Vis en Wikipedia-artikkel på to (eller flere?) språk side om side for sammenligning og språklæring.
// @match            https://*.wikipedia.org/wiki/*
// @match            https://zh.wikipedia.org/zh-*/*
// @grant            none
// @run-at           document-start
// @license          MIT
// @supportURL       https://github.com/snomiao/multilang-wiki/issues
// @contributionURL  https://snomiao.com/donate
// @downloadURL https://update.greasyfork.org/scripts/465319/Wikipedia%20multi%20language%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/465319/Wikipedia%20multi%20language%20view.meta.js
// ==/UserScript==
//
// ref:
// @downloadURL-old  https://raw.githubusercontent.com/snomiao/userscript.js/main/src/wiki-multilang.user.js
// [javascript - Resize Cross Domain Iframe Height - Stack Overflow]( https://stackoverflow.com/questions/22086722/resize-cross-domain-iframe-height )
//
// 2025-05-29 udpate: add more languages, support more than 2 columns

// const Langs = ['en', 'ja', 'zh', 'de', 'fr', 'es', 'ru', 'it', 'ko', 'pt', 'ar', 'vi', 'pl', 'uk', 'nl', 'sv', 'id', 'fi', 'no', 'tr', 'cs', 'da', 'he', 'hu', 'ro', 'th']
// can modify this to your preferred languages, will be used to load the 2nd language iframe
const langs = navigator.languages
    .map((e) => e.replace(/-.*/, ""))
    .reduce((acc, lang) => (acc.add(lang), acc), new Set());

(async function main() {
    // hide sidebars
    setTimeout(() => {
        [
            ...document.body.querySelectorAll(
                "#sidebarCollapse,.vector-pinnable-header-unpin-button"
            ),
        ]
            .filter((e) => e?.checkVisibility?.())
            .map((e) => e?.click?.());
    }, 1e3);
})();

if (location.hash.match("#langIfr")) {
    // iframe code send height
    const sendHeight = () =>
        parent.postMessage?.(
            {
                langIfr: {
                    height: document.body.scrollHeight,
                    lang: location.hash.match?.(/#langIfr-(..)/)?.[1],
                },
            },
            "*"
        );
    window.addEventListener("resize", sendHeight, false);
    window.addEventListener("load", sendHeight, false);

    sendHeight();
    document.head.appendChild(createHtmlElement('<base target="_parent" />'));
} else {
    // parent code recv iframe's height
    const msgHandler = (e) => {
        const setHeight = ({ height, lang }) =>
            height &&
            lang &&
            document
                .querySelector?.(`.langIfr[lang=${lang}]`)
                ?.setAttribute("height", height);
        setHeight(e.data?.langIfr);
    };
    window.addEventListener("message", msgHandler, false);
    // load iframe
    const langLnksGet = () =>
        Object.fromEntries(
            [...document.querySelectorAll("a.interlanguage-link-target")]
                .map((e) => ({
                    lang: e.getAttribute("lang"),
                    href: e.href,
                    language: e.textContent,
                }))
                .map((e) => [e.lang, e])
        );
    const columns = (document.body.clientWidth / 800) | 0;
    console.log("multilang-wiki: " + columns + " columns");
    const exlangFrameLoad = () => {
        const langLnks = langLnksGet();
        const avaliableLangs = langs
            .filter((lang) => langLnks[lang])
            .filter((lang, i) => i < columns);
        console.log("Avaliable languages: " + avaliableLangs);

        const width = (100 / (avaliableLangs.length + 1)).toFixed(2) + "vw";
        const langIframeLoad = (lang = "en") => {
            if (!langLnks[lang]) return null;
            const count = [...document.querySelectorAll(".langIfr")].length;
            document.body.setAttribute(
                "style",
                `width: ${width}; overflow-x: hidden`
            );
            document.body.querySelector(`.langIfr[lang=${lang}]`)?.remove();
            const langIfr = createHtmlElement(`
              <iframe
                class="langIfr"
                lang="${lang}"
                src="${langLnks[lang].href + "#langIfr-" + lang}"
                style="border: none; position:absolute; left: calc(${
                    1 + count
                } * ${width}); top: 0vh; width: ${width}; min-height: 100vh"
                allow="fullscreen"
              ></iframe>`);
            document.body.appendChild(langIfr);
            return langIfr;
        };

        // the load 2st language for current page

        avaliableLangs.forEach((lang) => langIframeLoad(lang));

        // langs.find(lang => langIframeLoad(lang))
    };
    window.addEventListener("load", exlangFrameLoad, false);
}

function createHtmlElement(innerHTML = "<span>hello</span>") {
    return Object.assign(document.createElement("div"), { innerHTML })
        .children[0];
}

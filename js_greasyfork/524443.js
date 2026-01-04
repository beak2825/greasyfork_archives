// ==UserScript==
// @name           Animator.ru – True Links [Ath]
// @name:ru        Animator.ru – Настоящие Ссылки [Ath]
// @name:uk        Animator.ru – Справжні Посилання [Ath]
// @name:be        Animator.ru – Сапраўдныя Спасылкі [Ath]
// @name:bg        Animator.ru – Истински Връзки [Ath]
// @name:tt        Animator.ru – Чын Сылтамалар [Ath]
// @name:sl        Animator.ru – Prave Povezave [Ath]
// @name:sr        Animator.ru – Pravi Linkovi [Ath]
// @name:ka        Animator.ru – ნამდვილი ბმულები [Ath]
// @description    Improves navigation on Animator.ru: displays long lists without pagination; replaces script links (JavaScript) with real ones (href), so they can be opened in a new tab, copied, etc.
// @description:ru Улучшает навигацию на Animator.ru: отображает длинные списки целиком без разбиения на страницы; заменяет скриптовые ссылки (JavaScript) на настоящие (href), чтобы их можно было открывать в новой вкладке, копировать адрес и т.п.
// @description:uk Покращує навігацію на Animator.ru: відображає довгі списки повністю без розбиття на сторінки; замінює скриптові посилання (JavaScript) на справжні (href), щоб їх можна було відкривати у новій вкладці, копіювати адресу тощо.
// @description:be Паляпшае навігацыю на Animator.ru: паказвае доўгія спісы цалкам без падзелу на старонкі; замяняе скрыптовыя спасылкі (JavaScript) на сапраўдныя (href), каб іх можна было адкрываць у новай укладцы, капіяваць адрас і г.д.
// @description:bg Подобрява навигацията на Animator.ru: показва дълги списъци без разделяне на страници; заменя скриптовите връзки (JavaScript) с истински (href), така че те да могат да се отварят в нов таб, да се копират и т.н.
// @description:tt Animator.ru сайтында навигацияне яхшырта: озын исемлекләрне битләргә бүлмичә күрсәтә; скрипт сылтамаларын (JavaScript) чын сылтамаларга (href) алыштыра, шулай итеп аларны яңа тәрәзәдә ачып, адресын күчереп алырга һ.б. мөмкинлек бирә.
// @description:sl Izboljša navigacijo na Animator.ru: prikazuje dolge sezname brez razdelitve na strani; nadomešča skriptne povezave (JavaScript) z resničnimi (href), tako da jih lahko odpremo v novem zavihku, kopiramo naslov itd.
// @description:sr Poboljšava navigaciju na Animator.ru: prikazuje duge liste bez paginacije; zamenjuje skript linkove (JavaScript) sa pravim (href), tako da ih je moguće otvoriti u novom tabu, kopirati adresu itd.
// @description:ka ანიმატორის ნავიგაციას ამეტებს Animator.ru-ზე: აჩვენებს გრძელ სიას გვერდების გარეშე; შეცვლის სკრიპტის ბმულებს (JavaScript) ნამდვილებით (href), რათა მათ შეიძლება ახალ ჩანართში გახსნა, მისამართის ასლი და ა.შ.
// @namespace      athari
// @author         Athari (https://github.com/Athari)
// @copyright      © Prokhorov ‘Athari’ Alexander, 2024–2025
// @license        MIT
// @homepageURL    https://github.com/Athari/AthariUserJS
// @supportURL     https://github.com/Athari/AthariUserJS/issues
// @version        1.0.0
// @icon           https://www.google.com/s2/favicons?sz=64&domain=animator.ru
// @match          https://*.animator.ru/*
// @grant          unsafeWindow
// @run-at         document-end
// @require        https://cdn.jsdelivr.net/npm/@athari/monkeyutils@0.3.1/monkeyutils.u.min.js
// @tag            athari
// @downloadURL https://update.greasyfork.org/scripts/524443/Animatorru%20%E2%80%93%20True%20Links%20%5BAth%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/524443/Animatorru%20%E2%80%93%20True%20Links%20%5BAth%5D.meta.js
// ==/UserScript==

(async () => {
  'use strict'

  const { urlSearch, adjustLocationSearch, attempt, els } =
    //require("../@athari-monkeyutils/monkeyutils.u"); // TODO
    athari.monkeyutils;

  const el = els(document, {
    navPaginationLast: ".mynavig div:last-child",
    javascriptLinks: "[onclick]",
  });

  el.tag.head.insertAdjacentHTML('beforeEnd', /*html*/`
    <style>
      body {
        background: #aaa;
      }
      .ath-link {
        font-size: 14px;
        margin: 0 0 3px 0;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    </style>`);

  const nPages = el.navPaginationLast?.id.substring(2) ?? 0;
  if (nPages > 0) {
    await attempt("load pagination", async () => {
      const win1251Decoder = new TextDecoder('windows-1251');
      const tableSelector = [ ".FilmDiv", "table[style*='rgb(33,12,99)']", "table:has(> tbody > script ~ tr)" ]
        .map(sel => ({ sel, el: document.querySelector(sel) }))
        .filter(i => i.el != null)[0]?.sel;
      console.debug({ tableSelector });
      const docs = [];
      unsafeWindow.docs = docs;
      const rows = await Promise.all(
        [...Array(+nPages).keys()].map(async (iPage) => {
          const response = await fetch(adjustLocationSearch({ cPage: iPage + 1 }));
          const doc = new DOMParser().parseFromString(win1251Decoder.decode(await response.arrayBuffer()), 'text/html');
          docs.push(doc);
          return [...doc.querySelectorAll(`${tableSelector} script ~ tr`)].slice(1).map(r => r.outerHTML).join("");
        })
      );
      document.querySelector(tableSelector)?.tBodies[0].insertAdjacentHTML('beforeEnd', rows.join(""));
      console.debug("docs", docs);
    });
  }

  const search = urlSearch(location);
  const langPrefix = search.ver == 'eng' ? "ver=eng&" : "";
  const funs = {
    showNews: id => `/?${langPrefix}p=show_news&nid=${id}`,
    showNewsCat: (t, p) => `/?${langPrefix}p=news&type=${t}&cPage=${p}`,
    showFilm: id => `/db/?${langPrefix}p=show_film&fid=${id}`,
    showPerson: id => `/db/?${langPrefix}p=show_person&pid=${id}`,
    showStudia: id => `/db/?${langPrefix}p=show_studia&sid=${id}`,
    showVSource: id => `/db/?${langPrefix}p=vsource&id=${id}`,
    snb_click: id => adjustLocationSearch({ sp: id }),
    ReGroupFilms: b => `/db/?${langPrefix}p=show_person&pid=${search.pid}&JoinFilmsInFilmography=${b}`,
  };
  for (let [ elLink, js ] of el.all.javascriptLinks.map(el => [ el, el.getAttribute('onclick') ])) {
    const [, fun, ids] = js.match(/([\w_]+)\('?(\d+(,\d+)*)'?\)/) ?? [];
    let href = funs[fun]?.(...ids.split(","));
    if (!href)
      [,, href] = js.match(/(?:self\.)?location\.href\s*=\s*(['"])([^'"]+)\1/) ?? [];
    if (href) {
      elLink.outerHTML = /*html*/`<a href="${href}" class="ath-link">${elLink.innerText}</a>`;
      elLink.removeAttribute('onclick');
    } else {
      console.warn("Failed to convert onclick to href", elLink, js);
    }
  }
})();
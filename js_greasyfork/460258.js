// ==UserScript==
// @name        Enhanced FE Heroes list
// @namespace   https://github.com/gudine
// @match       https://guide.fire-emblem-heroes.com/*
// @grant       none
// @version     1.0
// @author      Gudine
// @description Changes hero pages' titles, and links to other associated characters' pages
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460258/Enhanced%20FE%20Heroes%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/460258/Enhanced%20FE%20Heroes%20list.meta.js
// ==/UserScript==


window.addEventListener("load", async () => {
  if (document.querySelector("main[id^='CHARA_']")) {
    const style = document.createElement("style");
    document.head.appendChild(style);

    style.textContent = `
      .char_icons {
        width: 75%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin: auto;
        margin-top: -20px;
      }

      .char_icons figure {
        margin: 0;
        position: relative;
      }

      .char_icons figure img {
        height: 6em;
      }

      .char_icons figure figcaption {
        visibility: hidden;
        position: absolute;
        width: max-content;
        transform: translateX(-50%);
        left: 50%;
        color: white;
        background: url("/wp-content/themes/feh_theme20190130/common/img/bg.jpg") no-repeat center;
        padding: .5em;
        border-radius: 10px;
        z-index: 1;
      }

      .char_icons figure:hover figcaption {
        visibility: visible;
      }
    `;

    const urlRegex = /.+\/(?=[^/]+)/;
    const url = window.location.href.match(urlRegex)[0];

    const tagList = {
      ex_works_heroes: 1,
      ex_works_shadowdragon: 2,
      ex_works_mystery_of_the_emblem: 2,
      ex_works_new_mystery_of_the_emblem: 2,
      ex_works_shadows_of_valentia: 2,
      ex_works_genealogy_of_the_holy_war: 3,
      ex_works_thracia_776: 3,
      ex_works_the_binding_blade: 4,
      ex_works_the_blazing_blade: 4,
      ex_works_the_sacred_stones: 5,
      ex_works_path_of_radiance: 6,
      ex_works_radiant_dawn: 6,
      ex_works_awakening: 7,
      ex_works_fates: 7,
      ex_works_three_houses: 8,
      ex_works_three_hopes: 8,
      "ex_works_tokyo_mirage_sessions_fe_encore-character": 9,
      ex_works_engage: 10,

      heroes: "Hero",
      special_heroes: "Special Hero",
      legendary_heroes: "Legendary Hero",
      mythic_heroes: "Mythic Hero",
      duo_heroes: "Duo Hero",
      harmonized_heroes: "Harmonized Hero",
      ascended_heroes: "Ascended Hero",
      rearmed_heroes: "Rearmed Hero",

      heroes_li: null,
      character: null,
      new_heroes: null,
      stay_heroes: null,
    }

    const seriesLookup = {
      "Fire Emblem Heroes": 1,
      "Fire Emblem: Shadow Dragon & the Blade of Light": 2,
      "Fire Emblem: Mystery of the Emblem": 2,
      "Fire Emblem: New Mystery of the Emblem": 2,
      "Fire Emblem Echoes: Shadows of Valentia": 2,
      "Fire Emblem: Genealogy of the Holy War": 3,
      "Fire Emblem: Thracia 776": 3,
      "Fire Emblem: The Binding Blade": 4,
      "Fire Emblem: The Blazing Blade": 4,
      "Fire Emblem: The Sacred Stones": 5,
      "Fire Emblem: Path of Radiance": 6,
      "Fire Emblem: Radiant Dawn": 6,
      "Fire Emblem Awakening": 7,
      "Fire Emblem Fates": 7,
      "Fire Emblem: Three Houses": 8,
      "Fire Emblem Warriors: Three Hopes": 8,
      "Tokyo Mirage Sessions ＃FE Encore": 9,
      "Fire Emblem Engage": 10,

      "ファイアーエムブレム ヒーローズ": 1,
      "ファイアーエムブレム 暗黒竜と光の剣": 2,
      "ファイアーエムブレム 紋章の謎": 2,
      "ファイアーエムブレム 新・紋章の謎": 2,
      "ファイアーエムブレム　Echoes": 2,
      "ファイアーエムブレム 聖戦の系譜": 3,
      "ファイアーエムブレム トラキア776": 3,
      "ファイアーエムブレム 封印の剣": 4,
      "ファイアーエムブレム 烈火の剣": 4,
      "ファイアーエムブレム 聖魔の光石": 5,
      "ファイアーエムブレム 蒼炎の軌跡": 6,
      "ファイアーエムブレム 暁の女神": 6,
      "ファイアーエムブレム 覚醒": 7,
      "ファイアーエムブレムif": 7,
      "ファイアーエムブレム 風花雪月": 8,
      "ファイアーエムブレム無双 風花雪月": 8,
      "幻影異聞録♯ＦＥ Encore": 9,
      "ファイアーエムブレム エンゲージ": 10,

      // "Fire Emblem Heroes": 1,
      // "ファイアーエムブレム 暗黒竜と光の剣": 2,
      // "ファイアーエムブレム 紋章の謎": 2,
      // "ファイアーエムブレム 新・紋章の謎": 2,
      // "ファイアーエムブレム　Echoes": 2,
      // "ファイアーエムブレム 聖戦の系譜": 3,
      // "ファイアーエムブレム トラキア776": 3,
      // "ファイアーエムブレム 封印の剣": 4,
      // "ファイアーエムブレム 烈火の剣": 4,
      // "ファイアーエムブレム 聖魔の光石": 5,
      "ファイアーエムブレム　蒼炎の軌跡": 6,
      "ファイアーエムブレム　暁の女神": 6,
      // "ファイアーエムブレム 覚醒": 7,
      // "ファイアーエムブレムif": 7,
      "FIRE EMBLEM 風花雪月": 8,
      "FIRE EMBLEM無雙 風花雪月": 8,
      "幻影異聞錄♯ＦＥ Encore": 9,
      "FIRE EMBLEM ENGAGE": 10,
    }

    // Change page title

    const charName = document.querySelector(".sec_charaname").textContent.trim();
    const charNick = document.querySelector(".sec_charanick").textContent.trim();

    document.title = `${charName}: ${charNick} | ${document.title}`;

    // Link to related characters

    const rawHtml = await fetch(`${url}/category/character/`)
      .then(res => res.text());

    const charList = (new DOMParser()).parseFromString(rawHtml, "text/html");

    const heroes = [...charList.querySelectorAll(".heroes_li")].map((elem) => ({
      link: elem.querySelector("a").href,
      name: elem.querySelector(".character_name").textContent.trim(),
      nick: elem.querySelector(".character_nick").textContent.trim(),
      img: elem.querySelector("img").src,
      tags: [...elem.classList].map((el) => tagList[el]).filter(el => el),
    }));

    const currSeries = document.querySelectorAll(".sec_charaappearancetxt")[1]
      .innerText.split("\n")
      .map((el) => seriesLookup[el])
      .filter(el => el);

    const charHeaders = [...document.querySelectorAll(".sec_h4charatxt")];

    charHeaders.forEach((header) => {
      const name = header.textContent.trim();

      const candidates = heroes.filter((char) => {
        const seriesIntersection = char.tags.filter(el => currSeries.includes(el));

        return char.name === name && seriesIntersection.length;
      });

      if (!candidates) return;

      const iconsAside = document.createElement("aside");
      iconsAside.className = "char_icons";

      candidates.forEach((candidate) => {
        const fig = document.createElement("figure");

        const link = document.createElement("a");
        link.href = candidate.link;
        fig.appendChild(link);

        const img = document.createElement("img");
        img.src = candidate.img;
        link.appendChild(img);

        const caption = document.createElement("figcaption");
        caption.innerText = `${candidate.name}: ${candidate.nick}`;
        fig.appendChild(caption);

        iconsAside.appendChild(fig);
      });

      header.insertAdjacentElement("afterend", iconsAside);
    });
  }
});

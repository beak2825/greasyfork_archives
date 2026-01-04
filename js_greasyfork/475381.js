// ==UserScript==
// @name            power Trakt.tv - Torrent Download in TV Movie Calendar - RARBG, Torrentz2, PirateBay
// @description     adds buttons to trakt.tv
// @version         1.1.1
// @match           *://trakt.tv/*
// @grant           GM_getValue
// @grant           GM_setValue
// @require         https://cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js#sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=
// @require         https://cdn.jsdelivr.net/gh/soufianesakhi/node-creation-observer-js@edabdee1caaee6af701333a527a0afd95240aa3b/release/node-creation-observer-latest.min.js
// @run-at          document-end
// @namespace https://greasyfork.org/users/1173925
// @downloadURL https://update.greasyfork.org/scripts/475381/power%20Trakttv%20-%20Torrent%20Download%20in%20TV%20Movie%20Calendar%20-%20RARBG%2C%20Torrentz2%2C%20PirateBay.user.js
// @updateURL https://update.greasyfork.org/scripts/475381/power%20Trakttv%20-%20Torrent%20Download%20in%20TV%20Movie%20Calendar%20-%20RARBG%2C%20Torrentz2%2C%20PirateBay.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
(function () {
   'use strict';

   //TODO: POSSIBLE ENHANCEMENTS:
   //Search by title instead for specials
   //4K (4k|2160p|2160)
   //Quotes around Episode Title, Series, and/or Movie Title (Possibly based on User Settings)?
   //(00x03 OR "Episode Title") when supported?

   const searchHevcSetting = 'Search for x265 (HEVC)';
   const searchHevc = getSetting(searchHevcSetting, true);

   const search720pSetting = 'Search for 720p';
   const search720p = getSetting(search720pSetting, false);

   const search1080pSetting = 'Search for 1080p';
   const search1080p = getSetting(search1080pSetting, false);

   const neverHevcRarbgSetting = 'Search for x265 (HEVC) Excludes RARBG';
   const neverHevcRarbg = getSetting(neverHevcRarbgSetting, true);

   const sortBySizeSetting = 'Sort by Size';
   const sortBySize = getSetting(sortBySizeSetting, true);

   const cutoffRatingSetting = 'Cutoff Rating-only Line in Calendar'; //"Cutoff % to Avoid Line Wrap in Calendar"
   const cutoffRating = getSetting(cutoffRatingSetting, false);

   const blackButtonsSetting = 'Black Buttons in Calendar';
   const blackButtons = getSetting(blackButtonsSetting, false);

   const buttonColorCalendarSetting = 'Button Color in Calendar';
   let buttonColorCalendarPref = getSetting(buttonColorCalendarSetting, '#');
   if (buttonColorCalendarPref === "#") buttonColorCalendarPref = '';

   //Selector constants for jQuery
   const itemSel = '.grid-item[data-type]';
   const toolbarSel = 'div.quick-icons';
   const actionsSel = toolbarSel + "> div.actions";
   const itemToolbarSel = itemSel + " " + toolbarSel;
   const itemActionsSel = itemSel + " " + actionsSel;
   const itemRatingSel = itemSel + toolbarSel + "> div.metadata";
   const itemHeartSel = itemRatingSel + " div.fa-heart";
   const episodeTitleSel = "span.main-title";
   const episodeNumSel = episodeTitleSel + "-sxe";
   const tvSeriesSel = "div.titles > h4";
   const movieNameSel = "div.titles > h3";

   //Constants
   const specialPrefix = "Special";
   const torrentButtonClass = "torrent-button";
   const torrentButtonSel = "." + torrentButtonClass;
   const buttonColorDefault = "#333"; // dark gray //OR: "#3b2b2b"; //redish gray

   //Calculated values based on Settings

   const buttonColor = buttonColorCalendarPref || buttonColorDefault;
   //MAYBE: can verify user pref, if 3/6 hex (0-f) then prefix with # if missing, unless specified named color like red

   addStyles(
      //iconCss("blue", "rgb(56, 96, 187)"),
      //iconCss("green", "rgb(135, 212, 44)"),
      iconPngDataCss("RARBG", 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsSAAALEgHS3X78AAAB+UlEQVQ4y4XTMYhURxzH8c8elyA7QWzeKyzCq1LcgljEIzZxmzR79UGKEK5Wq+BZiElErDRFCl1SpLj+6q0E2Uu5lyqwh4jIw/JNY4QZgsiNxd4adQ35wzDD/Jnv//ebmX+vlNLD5/gOn+HYajzHIzxdyZRSLpZSHpb/j79LKT+WUj4ppfSWYx1f4cvpvDPeawnvF+ijqoKtYXV6OKhv4wyuLfPry0VKtDHrZ3L6QGabHRxGuztsD+vL+B2P3wME9MNivjCobF2qwOQwOjqKEibT1mhYnwp8vQKA0F/MTcNws4bjjaZeuzqekbKM1BFqZ1csLFV8GDknfRlUgVCDZx8FLCmxS6azTsp5bXrYySnpIqNhJfASf/wHIJE4jNH+wdHbLdgebdjZGsB9tKuvkLP5USulrK77mn4wb+NCVOgvD7/E3rsl1956TUnbtmLsXNioTfZ2bA0bMXZibF25tw+n8Ss+XQEstGZSXHwK3N0dGTRBStl0MnXl1j6M8NNHAFlOUc5ZWhh/HUL45/7dHeEEPh7ve7A3gRv4Hutr/94BYkfq5JzhBe5sDppXP+9uy3mRu3p9bDKdwW182yulfIM7XZc227aV0dSVpqn/wnn8gh9m8zmJjCoEg0HzBDd7J+18DpffaedjjDE76afr+AKvT2y/wm/48w0S6gShbzTkKwAAAABJRU5ErkJggg=='),
      iconPngDataCss("PirateBay", 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAAAAAA6mKC9AAAACXBIWXMAAEzlAABM5QF1zvCVAAAA3UlEQVQY02P4DwT/YADIZvj//7qnozMYODmtAAusZoCDELDAegYGViZhAWZmRoYoqIDupfhNN1M3dTBEggXWMZg9jZRXV77YxhAOFpjDwMAPMoCXmcHsF1SAQZ6bQY2VgUEbKHClcAYzg3mINEO8jSCD478/DPsZmvqWblu1bOmStes3Pp0ezVDF4Gif0Hfx9///74/ObRZ2YNiZ47C8XIRBxFJR0jbSSUud4f9zAQWn8NTuziAt2zy5xIMM/z8LFX0E+fD/x0MRDCeA1v7Z++Y/FDzyvAtyBxIA+h8A8ZKLeT+lJroAAAAASUVORK5CYII='),
      iconPngDataCss("Torrentz", 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAACXBIWXMAAAsSAAALEgHS3X78AAAAOVBMVEUAAAAAAIA4VY4qY44wYZIvXpcxY5gxZZYzZJgxZZczZJgzZZgyZZkyZpgzZZgyZZgyZZkyZZgzZpl0n9g8AAAAEnRSTlMAAQgRFBpHTVNhZ4WSk5S54utIMGOpAAAAQUlEQVQY02NgEEIBDGh8oAimAAMIQFSDGAwMqAIM1BbgEhTgQBHgYWYXRNPCyo8qwMjHgirAy4ZqKDcnmi0gggkA/4MH+8LzWccAAAAASUVORK5CYII='),
      iconPngDataCss("Zooqle", 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAAAAAA6mKC9AAAACXBIWXMAAAsSAAALEgHS3X78AAAA10lEQVQY02P4jwYYgPjZtedA8ueju2/AAr+Xh9aErvr3vjO2NGQbSOCQyeF/B0zPrzJ+9HuK02ugQJHL2/8vLeYUl/77f8b0FFAgFyjwynpOQfn//+dMTgIF9gCFT5meWWrx/P9ik4dAgV9z/Tpilvx925Lc7GbxFGTt34fnTzz///Pmifs7TJ+ArP33f1eoz9Yui7rXV02eAQVeb1hpbGRobGhgmLvQ4TlQ4O8mEyNji9X1RoZGpg7PwGacm7/k2v9Pe2ZvOmoBFkCAFw5PUQVeB6EJgAAA8orDDIzPjT8AAAAASUVORK5CYII='),

      iif(!blackButtons, cssRule(torrentButtonSel, "background-color: " + buttonColor)), /* Dark gray button background to visually group together (#333 for darker, #444 for lighter).  OR: dotted or inset 1px 9e2424 (dark red) border around all buttons (left for 1st, right for last, top + bottom for all) */

      cssRule(torrentButtonSel + ":hover", "background-color: #16a085"),
      /* MAYBE: Or can use border around group of buttons, with dotted/inset/solid style, instead of different background color, though line wrap may not keep them together */
      /* iif(borderNotBackground, cssRule(torrentButtonSel, "border-style: dotted; border-color: #9e2424; border-width: 1px 0px"), cssRule(torrentButtonSel + "-first", "border-width-left: 1px"), cssRule(torrentButtonSel + "-last", "border-width-right: 1px")), */

      cssRule(itemToolbarSel, "height: auto"),
      cssRule(itemActionsSel, "float: none"),

      iif(cutoffRating,
         cssRule(itemRatingSel, "float: none") +
         cssRule(itemHeartSel, "margin-left: 5px"))
      /* Rating Line-wrapping Results (per Actions/Ratings Float value combo):
         None/Right = Heart stays bottom-right, never cutoff, but won't hide to prevent additional line just for it sometimes
         None/None = (Alternative if cutoffRating = true) Heart shown after last button (so needs { margin-left: 5px; }) if zoomed out OR stays top-right (if buttons wrap to 2nd line). Sometimes cut-off/partially shown. Never causes 2nd/3rd line just for it, but sometimes shows left instead of right aligned.
         Left/None = (Less useful) Heart stays top-right, usually hidden (unless zoomed out), but never shown as partially cutoff
         None/Left = (Less useful) Heart is just after last button (not right aligned), wraps to next line (needs { margin-left: 5px; }` for space between it and button)
         Left/Right = (Worst) (Trakt default) Heart shows on 3rd line by itself if any button wraps to 2nd line usually (instead of combining when there is space), remains top-right on 1st line otherwise.
      */

      );


   //grid-item[data-type="movie"] [data-type="episode"] //OLD: div[itemprop="episode"] grid-item

   //use MutationObserver, not supported by jQuery directly, as the new reliable and efficient suggested alternative to .on() or DOMNodeInserted
   //$(itemSel).each(
   // observe nodes, even if created later (eg. when click on Movies, Episodes, etc. tabs on Calendar sidebar)
   NodeCreationObserver.init("torrent-link-inserter");
   NodeCreationObserver.onCreation(itemSel,
      function (element) {

         const item = $(element); //$(this);

         //find elements to parse episode info from or (for actions) insert buttons into
         const actions = item.find(actionsSel); //get first result
         const episodeNumbersStr = item.find(episodeNumSel).text().trim();
         const episodeTitle = item.find(episodeTitleSel).text().trim();
         const movieTitle = item.find(movieNameSel).eq(0).text().trim();
         const tvSeries = item.find(tvSeriesSel).eq(0).text().trim();

         let isSpecial = false; //episodeNumbersStr.startsWith(specialPrefix);

         //format season and episode from 1x3 or Special 4 to S01E03 or S00E04
         const seasonAndEpisode = episodeNumbersStr.split(/[ x]/).map(num => {
            if (num === specialPrefix) {
               isSpecial = true;
               return "00"; //00x15 for Special 15
            }

            //prefix single digits with 0 (3 to 03, 11 to 11)
            return num.replace(/^(\d)$/, "0$1");
         });

         const isEpisode = seasonAndEpisode.length === 2; //episodeNumbersStr.length > 0;
         const seasonEpisode = isEpisode ? ("S" + seasonAndEpisode[0] + "E" + seasonAndEpisode[1]) : "";

         //Regex and constants:
         const multiSpaceRegex = /\s{2,}/g;

         //console.log("[Trakt Torrent Script]", { strSeries, objSeries, arrNumbers, strEpiNumber });

         //generate Torrent search URLs / query strings

         const queryNoEscaping = (isEpisode ? (tvSeries + " " + (isSpecial ? episodeTitle : seasonEpisode)) : movieTitle).replace(multiSpaceRegex, ' ');

         //escape & and other characters
         const query = encodeURIComponent(queryNoEscaping);
         //remove & and ' (apostrophe) before escaping.
         //Pirate Bay usually provides no results for apostrophe ('), since doesn't make it optional like others. Also ignores everything after & (even when escaped)
         const queryNoPunc = encodeURIComponent(queryNoEscaping.replace(/['&]/g, '').replace(multiSpaceRegex, ' '));

         const hdMax = search1080p ? " 1080p" : iif(search720p, " 720p");
         const hd = (search720p && search1080p) ? " (720p OR 1080p)" : hdMax;
         const hdPipeOr = (search720p && search1080p) ? " (720p|1080p)" : hdMax;
         //if only one, then use it OR use the max?
         const hdNoBoolean = hdMax; //!(search720p && search1080p) ? hdMax : '';

         const hevc = iif(searchHevc, " (x265 OR HEVC OR 10bit OR HDR)" );
         const hevcPipeOr = iif(searchHevc, " (x265|HEVC|10bit|HDR)");
         //OR: leave empty since can't rely on it?
         //x265 is more popular term than HEVC
         const hevcNoBoolean = iif(searchHevc, " x265");

         //Rarbg can't use boolean search
         //const rarbgUrl = `https://1337x.to/search/${query}/1/`;
         const rarbgUrl = `https://rarbgproxied.org/torrents.php?search=${query}`;

         const torrentzUrl = `https://torrentz2.eu/search${iif(sortBySize, 'S')}?f=${query}${hd}${hevc}`;  //searchS for by Size, else search= (for by Seeders)

         const pirateBayDomain = 'thepiratebay.org'; //'thepiratebay.vip';
         const pirateBayUrl = `https://${pirateBayDomain}/search/${queryNoPunc}${hdPipeOr}${hevcPipeOr}${iif(sortBySize, '/0/5/0')}`;
         const zooqleUrl = `https://zooqle.com/search?q=${query}${hd}${hevc}${iif(sortBySize, '&s=sz&sd=d')}`;

         //const torrentFunkUrl = `https://www.torrentfunk.com/television/torrents/${strSeries.toLowerCase().replace(/ +/g, '-')}-${strEpiNumber.toLowerCase().replace(/ +/g, '-')}.html?v=&smi=&sma=&i=50&sort=size&o=asc`;

         //console.log({query, hd, hdNoBoolean, hevc, hevcNoBoolean, rarbgUrl, torrentzUrl});

         function addButton(site, url, color) {

            //with target= can prevent opening duplicate tabs
            const openInTab = '_blank'; //site + ' ' + strSeries + ' ' + strEpiNumber;
            const tooltip = `Search for this episode on ${site}`;

            const html =
`<a class="${torrentButtonClass}" data-original-title="${tooltip}" title="${tooltip}" href="${url}" target="${openInTab}">
  <div class="base torrent-icon-${site}"></div>
  <div class="torrent-icon-${color}"></div>
</a>`;

            actions.append(html);
         }

         addButton("RARBG", rarbgUrl);
         addButton("Torrentz", torrentzUrl);
         addButton("PirateBay", pirateBayUrl);
         addButton("Zooqle", zooqleUrl);

      });//end of each episode item element handler

   //utility functions (outside of element handler)


   //will save the default value if don't already have the setting defined, so that user will see settings available to edit.
   //will treat empty string same as undefined
   //gm_get/setValue will automatically JSON parse/stringify, so that strings will be saved with quotes around them, and boolean and numbers won't
   function getSetting(settingName, defaultValue, treatEmptyStringAsUndefined = false) {

      //read value from saved settings (Values tab in Violentmonkey)
      let val = GM_getValue(settingName, undefined);

      if (val === undefined || treatEmptyStringAsUndefined && val === "") {
         val = defaultValue;
         //save the value so user sees and can edit it
         GM_setValue(settingName, val);
      }
      return val;
   }

   function addStyles() { /* cssLines */
      const cssText = $.makeArray(arguments).join('\n');

      const css = $(
`<style type="text/css" name="Torrent-Styles">
${cssText}
</style>`);

      $('head').append(css);

   }

   function iif(condition, valueIfConditionOtherwiseEmpty) {
      return condition ? valueIfConditionOtherwiseEmpty : '';
   }
   function cssRule(selector, styling) {
      return `${selector} { ${styling}; } `;
   }
   function iconCss(colorName, color) {
      return `.torrent-icon-${colorName}:before { content: "☠"; color: ${color}; }`;
   }
   function iconPngDataCss(site, base64PngData) {
      return `.torrent-icon-${site} { background: url('data:image/png;base64,${base64PngData}') no-repeat center; }`;
   }

   //end of module
})();
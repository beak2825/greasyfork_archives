// ==UserScript==
// @name         Flag Tooltip - Bonk.io
// @version      1.0.0
// @description  Shows full country name when hovering over flags in the Lobby Listing.
// @author       Miquella
// @namespace    https://greasyfork.org/en/users/1502869
// @license      GPL-3.0
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/545061/Flag%20Tooltip%20-%20Bonkio.user.js
// @updateURL https://update.greasyfork.org/scripts/545061/Flag%20Tooltip%20-%20Bonkio.meta.js
// ==/UserScript==

(function () {
    //for the non-flag knowers out there...
    //skill issue in my opinion.
  // dictionary of country codes mapped to readable country names
  const countryMap = {
    // common
    br: "Brazil", ru: "Russia", kr: "South Korea", tr: "Turkey", us: "United States", ca: "Canada",
    tw: "Taiwan", in: "India", ph: "Philippines", de: "Germany", fr: "France", gb: "United Kingdom",
    mx: "Mexico", jp: "Japan", cn: "China", ar: "Argentina", au: "Australia", es: "Spain", it: "Italy",
    pl: "Poland", nl: "Netherlands", id: "Indonesia", ve: "Venezuela", th: "Thailand", eg: "Egypt",
    my: "Malaysia", se: "Sweden", no: "Norway", fi: "Finland", pt: "Portugal", vn: "Vietnam",
    ro: "Romania", hu: "Hungary", il: "Israel", sa: "Saudi Arabia", pk: "Pakistan", bd: "Bangladesh",
    cl: "Chile", ae: "United Arab Emirates", za: "South Africa", cz: "Czech Republic", ua: "Ukraine",
    be: "Belgium", dk: "Denmark", at: "Austria", gr: "Greece", nz: "New Zealand", co: "Colombia",
    hk: "Hong Kong", sg: "Singapore",
    // additional supported
    az: "Azerbaijan", ie: "Ireland", tn: "Tunisia", hr: "Croatia", rs: "Serbia", ge: "Georgia",
    bg: "Bulgaria", sk: "Slovakia", si: "Slovenia", lt: "Lithuania", lv: "Latvia", ee: "Estonia",
    iq: "Iraq", ir: "Iran", sy: "Syria", jo: "Jordan", ma: "Morocco", dz: "Algeria", ng: "Nigeria",
    ke: "Kenya", gh: "Ghana", et: "Ethiopia", kz: "Kazakhstan", uz: "Uzbekistan", lk: "Sri Lanka",
    ne: "Niger", zm: "Zambia"
  };
  // set to avoid logging duplicate unknown flags
  const loggedUnknowns = new Set();
  // injects CSS to style the country name tooltip
  const style = document.createElement('style');
  style.textContent = `
    tr[data-country-name] {
      position: relative;
    }

    tr[data-country-name]::after {
      content: attr(data-country-name);
      position: absolute;
      top: -30px;
      left: 50%;
      transform: translateX(-50%);
      background: #222;
      color: #fff;
      padding: 4px 8px;
      font-size: 12px;
      border-radius: 4px;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.15s ease-in-out;
      z-index: 9999;
    }

    tr[data-country-name]:hover::after {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);
  /**
   * applies tooltips with country names to each lobby row
   */
  const applyCountryTooltips = () => {
    const rows = document.querySelectorAll('tr[data-myid]');
    rows.forEach(row => {
      // skip if already processed
      if (row.hasAttribute("data-country-name")) return;
      // find flag image in this row
      const flag = row.querySelector('img[src*="graphics/flags/"]');
      if (!flag) return;
      // extract 2-letter country code from the image filename
      const src = flag.getAttribute("src");
      const match = src.match(/graphics\/flags\/([a-z]{2})\.png/i);
      if (!match) return;
      const code = match[1].toLowerCase();
      const name = countryMap[code];
      // warn once for any unknown country code
      if (!name && !loggedUnknowns.has(code)) {
        console.warn("unknown flag code:", code);
        loggedUnknowns.add(code);
        return;
      }
      // apply country name as attribute for tooltip display
      if (name) {
        row.setAttribute("data-country-name", name);
      }
    });
  };
  // monitor DOM changes and reapply tooltips when lobby list updates
  new MutationObserver(applyCountryTooltips).observe(document.body, {
    childList: true,
    subtree: true
  });
  // run immediately on page load
  applyCountryTooltips();
})();
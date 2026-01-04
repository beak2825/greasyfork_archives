// ==UserScript==
// @name tumblr dashboard responsive
// @namespace https://gitlab.com/breatfr
// @version 1.0.1
// @description tumblr dashboard website is more suitable for wide screens.
// @author BreatFR (https://breat.fr)
// @homepageURL https://gitlab.com/breatfr/tumblr
// @supportURL https://discord.gg/Q8KSHzdBxs
// @license AGPL-3.0-or-later; https://www.gnu.org/licenses/agpl-3.0.txt
// @grant GM_addStyle
// @run-at document-start
// @match *://*.tumblr.com/*
// @match https://www.tumblr.com/domains
// @match https://www.tumblr.com/explore/trending
// @match https://www.tumblr.com/inbox
// @match https://www.tumblr.com/likes
// @match https://www.tumblr.com/following
// @match https://www.tumblr.com/dashboard*
// @match https://www.tumblr.com/settings/*
// @downloadURL https://update.greasyfork.org/scripts/497108/tumblr%20dashboard%20responsive.user.js
// @updateURL https://update.greasyfork.org/scripts/497108/tumblr%20dashboard%20responsive.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "tumblr.com" || location.hostname.endsWith(".tumblr.com"))) {
  css += `
      body {
          overflow-x: hidden !important;
      }
      
      /* abo */
      #adBanner,
      .HOjIH,
      .I6Lwl {
          display: none;
      }
      
      /* Radar */
      aside > div:nth-child(5),
      aside > div:nth-child(6) {
          display: none;
      }
  `;
}
if (location.href.startsWith("https://www.tumblr.com/dashboard")) {
  css += `
      /* Versions */
      :root {
          --themeversion: 'Theme v1.0.1 by BreatFR \\A';
          --link: ' gitlab.com/breatfr/tumblr-dashboard-responsive ';
      }

      body::after {
          background: linear-gradient(88.55deg, rgb(139, 109, 255) 22.43%, rgb(254, 132, 132) 92.28%);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          content: var(--themeversion) url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBoZWlnaHQ9IjIwIiB3aWR0aD0iMjAiIHN0eWxlPSJ0cmFuc2Zvcm06IHNjYWxlWSgtMSk7Ij48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNS4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZmlsbD0iI2NiY2JjYiIgZD0iTTMwNyAzNC44Yy0xMS41IDUuMS0xOSAxNi42LTE5IDI5LjJ2NjRIMTc2Qzc4LjggMTI4IDAgMjA2LjggMCAzMDRDMCA0MTcuMyA4MS41IDQ2Ny45IDEwMC4yIDQ3OC4xYzIuNSAxLjQgNS4zIDEuOSA4LjEgMS45YzEwLjkgMCAxOS43LTguOSAxOS43LTE5LjdjMC03LjUtNC4zLTE0LjQtOS44LTE5LjVDMTA4LjggNDMxLjkgOTYgNDE0LjQgOTYgMzg0YzAtNTMgNDMtOTYgOTYtOTZoOTZ2NjRjMCAxMi42IDcuNCAyNC4xIDE5IDI5LjJzMjUgMyAzNC40LTUuNGwxNjAtMTQ0YzYuNy02LjEgMTAuNi0xNC43IDEwLjYtMjMuOHMtMy44LTE3LjctMTAuNi0yMy44bC0xNjAtMTQ0Yy05LjQtOC41LTIyLjktMTAuNi0zNC40LTUuNHoiLz48L3N2Zz4=") var(--link) url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBoZWlnaHQ9IjIwIiB3aWR0aD0iMjAiIHRyYW5zZm9ybT0icm90YXRlKDE4MCkiPjwhLS0hRm9udCBBd2Vzb21lIEZyZWUgNi41LjEgYnkgQGZvbnRhd2Vzb21lIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20gTGljZW5zZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tL2xpY2Vuc2UvZnJlZSBDb3B5cmlnaHQgMjAyNCBGb250aWNvbnMsIEluYy4tLT48cGF0aCBmaWxsPSIjY2JjYmNiIiBkPSJNMzA3IDM0LjhjLTExLjUgNS4xLTE5IDE2LjYtMTkgMjkuMnY2NEgxNzZDNzguOCAxMjggMCAyMDYuOCAwIDMwNEMwIDQxNy4zIDgxLjUgNDY3LjkgMTAwLjIgNDc4LjFjMi41IDEuNCA1LjMgMS45IDguMSAxLjljMTAuOSAwIDE5LjctOC45IDE5LjctMTkuN2MwLTcuNS00LjMtMTQuNC05LjgtMTkuNUMxMDguOCA0MzEuOSA5NiA0MTQuNCA5NiAzODRjMC01MyA0My05NiA5Ni05Nmg5NnY2NGMwIDEyLjYgNy40IDI0LjEgMTkgMjkuMnMyNSAzIDM0LjQtNS40bDE2MC0xNDRjNi43LTYuMSAxMC42LTE0LjcgMTAuNi0yMy44cy0zLjgtMTcuNy0xMC42LTIzLjhsLTE2MC0xNDRjLTkuNC04LjUtMjIuOS0xMC42LTM0LjQtNS40eiIvPjwvc3ZnPg==") ;
          display: flex;
          flex-direction: column;
          font-size: 18px;
          pointer-events: none;
          position: fixed;
          right: 20%;
          text-align: center;
          top: .25em;
          width: max-content;
          white-space: pre-line;
          z-index: 9999;
      }
      
      :root {
         color-scheme: only light !important;
      }
      
      .ypwxx,
      video {
          object-fit: contain !important;
          height: auto !important;
          max-height: none !important;
          max-width: 1670px !important;
          width: 100% !important
      }
      .wrapper>video {
          display: none !important;
      }
      .video,
      ._3xgk.ZN00W {
          object-fit: contain !important;
          max-width: 1670px !important;
          min-width: 1670px !important;
          width: 1670px !important;
      }
      
      #base-container > div:nth-of-type(2) > div > div:nth-of-type(2),
      #base-container > div:nth-of-type(2) > div > div:nth-of-type(2) > div {
          max-width: calc(100vw - 260px) !important;
          min-width: calc(100vw - 260px) !important;
      }
      
      #base-container > div:nth-of-type(2) > div > div:nth-of-type(2) > div > div:nth-of-type(1) {
          max-width: calc(100% - 320px) !important;
      }
      #base-container > div:nth-of-type(2) > div > div:nth-of-type(2) > div > div:nth-of-type(1) > main,
      #base-container > div:nth-of-type(2) > div > div:nth-of-type(2) > div > div:nth-of-type(1) > main > div:nth-of-type(3) > div:nth-of-type(3) > div,
      #base-container > div:nth-of-type(2) > div > div:nth-of-type(2) > div > div:nth-of-type(1) > main > div:nth-of-type(3) > div:nth-of-type(3) > div article {
          max-width: 100% !important;
      }
      
      .Sv170.POcHT {
          height: auto !important;
          max-height: none !important;
      }
  `;
}
if (location.href.startsWith("https://www.tumblr.com/settings/")) {
  css += `
      :root {
         color-scheme: only light !important;
      }
      
      body {
          overflow-x: hidden;
      }
      

      ._3xgk.ZN00W {
          object-fit: contain;
          max-width: 1670px !important;
          min-width: 1670px !important;
          width: 1670px !important;
      }
      .gPQR5.ah4XU .lSyOz,    
      .O4V_R {
          max-width: 1350px !important;
          min-width: 1350px !important;
          width: 1350px !important;
      }
      .s5oiJ.RZLCp {
          max-width: 100% !important;
      }
  `;
}
if (location.href === "https://www.tumblr.com/domains") {
  css += `
      :root {
         color-scheme: only light !important;
      }
      
      body {
          overflow-x: hidden;
      }
      

      ._3xgk.ZN00W {
          object-fit: contain;
          max-width: 1670px !important;
          min-width: 1670px !important;
          width: 1670px !important;
      }
      .gPQR5.ah4XU .lSyOz,    
      .O4V_R {
          max-width: 1350px !important;
          min-width: 1350px !important;
          width: 1350px !important;
      }
      .s5oiJ.RZLCp {
          max-width: 100% !important;
      }
  `;
}
if (location.href === "https://www.tumblr.com/explore/trending") {
  css += `
      video,
      .video,
      ._3xgk.ZN00W {
          object-fit: contain;
          max-width: 1670px !important;
          min-width: 1670px !important;
          width: 1670px !important;
      }
      .gPQR5.ah4XU .lSyOz,
      .YDpaw.V9TEa.peM4H,
      .BjErQ,
      .FtjPK {
          max-width: 1350px !important;
          min-width: 1350px !important;
          width: 1350px !important;
      }
  `;
}
if (location.href === "https://www.tumblr.com/inbox") {
  css += `
      ._3xgk.ZN00W {
          max-width: 1670px !important;
          min-width: 1670px !important;
          width: 1670px !important;
      }
      .gPQR5.ah4XU .lSyOz {
          max-width: 1350px !important;
          min-width: 1350px !important;
          width: 1350px !important;
      }
  `;
}
if (location.href === "https://www.tumblr.com/likes") {
  css += `
      ._3xgk.ZN00W {
          object-fit: contain;
          max-width: 1670px !important;
          min-width: 1670px !important;
          width: 1670px !important;
      }
      .gPQR5.ah4XU .lSyOz,
      .NLCTe,
      .BjErQ,
      .FtjPK {
          max-width: 1350px !important;
          min-width: 1350px !important;
          width: 1350px !important;
      }
  `;
}
if (location.href === "https://www.tumblr.com/following") {
  css += `
      ._3xgk.ZN00W {
          object-fit: contain;
          max-width: 1670px !important;
          min-width: 1670px !important;
          width: 1670px !important;
      }
      .gPQR5.ah4XU .lSyOz,
      .rmkqO.BSxQO,
      .zAlrA>div,
      .FtjPK {
          max-width: 1350px !important;
          min-width: 1350px !important;
          width: 1350px !important;
      }
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

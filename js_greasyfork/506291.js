// ==UserScript==
// @name         Voxelium Dark Theme
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  CSS For Voxiom.IO | Dark Theme
// @author       Whoami Scripts
// @match        https://voxiom.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506291/Voxelium%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/506291/Voxelium%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        @font-face {
            font-family: 'Overpass';
            src: url('https://fonts.googleapis.com/css2?family=Overpass:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
        }
        @font-face {
            font-family: 'Lexend';
            src: url('https://fonts.googleapis.com/css2?family=Lexend:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
        }
        @font-face {
            font-family: 'Montserrat';
            src: url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
        }
        @font-face {
            font-family: 'Chivo';
            src: url('https://fonts.googleapis.com/css2?family=Chivo:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
        }
        #key-input {
          background-color: #000000;
          color: #fffde7;
          font-family: 'Chivo';
        }
        #fps-booster-container {
          background-color: #1a1a1a;
          height: 160px;
        }
        body div button {
          font-family: 'Chivo';
          height: 60px;
        }
        div.sc-iJKOTD.jqbzkO, a.sc-giYglK.bzRdHa, img.sc-pVTFL.iRqeFU {
          display: none;
        }
        a.sc-llYSUQ.jIHuvv {
          background-color: #000000;
          font-family: 'Montserrat';
          border-color: #ffeb3b;
          height: 40px;
          width: 90px;
          align-items: center;
        }
        div.sc-lbCmg.kLCLJb, a.sc-kTwdzw.fPcDtj, a.sc-cgLTVH.hqKrdE, div.sc-fjHZBf.dnwnzt, div.sc-ddCuvZ.gLLxZA {
          font-family: 'Montserrat';
        }
        div.sc-ivsNig.kqMamr, div.sc-ikJyIC.vCrTy, div.sc-kLwhqv.hhwIom, div.sc-kITQLZ.gNxOdb, div.sc-inrDdN.ehvxZP, div.sc-bxYNtK.ekaCUa, div.sc-efaPnb.fJtqgn, div.sc-hnCQzQ.gFCsYN, div.sc-gJvHvF.iNiBGU, div.sc-kBysnm.bWLXlX, div.sc-wAsCI.iA-diDa, div.Dropdown-control, div.Dropdown-placeholder.is-selected, div.sc-bDOMBz.emNSSu, div.sc-bUKjYF.dZDPlS {
          background-color: #000000;
        }
        div.sc-fpGCtG.ifHbmM, div.sc-kudmJA.eOpYps {
          font-family: 'Overpass';
          background-color: #000000;
        }
        div.sc-ccATMr.bUdBeT, div div div {
          background-color: #0c0d0d;
          font-family: 'Montserrat';
        }
    `;
    document.head.appendChild(style);
})();

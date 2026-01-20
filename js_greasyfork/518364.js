// ==UserScript==
// @name Omnivox UI Optimizer
// @description A simple user script to improve the UI of Omnivox.
// @version 1.3.23
// @author Evan Luo
// @homepage https://github.com/evannotfound/omnivox-optimizer
// @match *://*.omnivox.ca/*
// @grant GM_xmlhttpRequest
// @license GPL-3.0
// @run-at document-start
// @namespace https://greasyfork.org/users/1399797
// @downloadURL https://update.greasyfork.org/scripts/518364/Omnivox%20UI%20Optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/518364/Omnivox%20UI%20Optimizer.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 609:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("// Imports\nimport ___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___ from \"../../node_modules/.pnpm/css-loader@7.1.2_webpack@5.96.1/node_modules/css-loader/dist/runtime/noSourceMaps.js\";\nimport ___CSS_LOADER_API_IMPORT___ from \"../../node_modules/.pnpm/css-loader@7.1.2_webpack@5.96.1/node_modules/css-loader/dist/runtime/api.js\";\nvar ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___);\n// Module\n___CSS_LOADER_EXPORT___.push([module.id, `:root {\n/* Slate */\n  --slate-50: 210 40% 98%;\n  --slate-100: 210 40% 96.1%;\n  --slate-200: 214.3 31.8% 91.4%;\n  --slate-300: 212.7 26.8% 83.9%;\n  --slate-400: 215 20.2% 65.1%;\n  --slate-500: 215.4 16.3% 46.9%;\n  --slate-600: 215.3 19.3% 34.5%;\n  --slate-700: 215.3 25% 26.7%;\n  --slate-800: 217.2 32.6% 17.5%;\n  --slate-900: 222.2 47.4% 11.2%;\n  --slate-950: 228.6 84% 4.9% /* Gray */;\n  --gray-50: 210 20% 98%;\n  --gray-100: 220 14.3% 95.9%;\n  --gray-200: 220 13% 91%;\n  --gray-300: 216 12.2% 83.9%;\n  --gray-400: 217.9 10.6% 64.9%;\n  --gray-500: 220 8.9% 46.1%;\n  --gray-600: 215 13.8% 34.1%;\n  --gray-700: 216.9 19.1% 26.7%;\n  --gray-800: 215 27.9% 16.9%;\n  --gray-900: 220.9 39.3% 11%;\n  --gray-950: 224 71.4% 4.1% /* Zinc */;\n  --zinc-50: 0 0% 98%;\n  --zinc-100: 240 4.8% 95.9%;\n  --zinc-200: 240 5.9% 90%;\n  --zinc-300: 240 4.9% 83.9%;\n  --zinc-400: 240 5% 64.9%;\n  --zinc-500: 240 3.8% 46.1%;\n  --zinc-600: 240 5.2% 33.9%;\n  --zinc-700: 240 5.3% 26.1%;\n  --zinc-800: 240 3.7% 15.9%;\n  --zinc-900: 240 5.9% 10%;\n  --zinc-950: 240 10% 3.9% /* Neutral */;\n  --neutral-50: 0 0% 98%;\n  --neutral-100: 0 0% 96.1%;\n  --neutral-200: 0 0% 89.8%;\n  --neutral-300: 0 0% 83.1%;\n  --neutral-400: 0 0% 63.9%;\n  --neutral-500: 0 0% 45.1%;\n  --neutral-600: 0 0% 32.2%;\n  --neutral-700: 0 0% 25.1%;\n  --neutral-800: 0 0% 14.9%;\n  --neutral-900: 0 0% 9%;\n  --neutral-950: 0 0% 3.9% /* Stone */;\n  --stone-50: 60 9.1% 97.8%;\n  --stone-100: 60 4.8% 95.9%;\n  --stone-200: 20 5.9% 90%;\n  --stone-300: 24 5.7% 82.9%;\n  --stone-400: 24 5.4% 63.9%;\n  --stone-500: 25 5.3% 44.7%;\n  --stone-600: 33.3 5.5% 32.4%;\n  --stone-700: 30 6.3% 25.1%;\n  --stone-800: 12 6.5% 15.1%;\n  --stone-900: 24 9.8% 10%;\n  --stone-950: 20 14.3% 4.1% /* Red */;\n  --red-50: 0 85.7% 97.3%;\n  --red-100: 0 93.3% 94.1%;\n  --red-200: 0 96.3% 89.4%;\n  --red-300: 0 93.5% 81.8%;\n  --red-400: 0 90.6% 70.8%;\n  --red-500: 0 84.2% 60.2%;\n  --red-600: 0 72.2% 50.6%;\n  --red-700: 0 73.7% 41.8%;\n  --red-800: 0 70% 35.3%;\n  --red-900: 0 62.8% 30.6%;\n  --red-950: 0 74.7% 15.5% /* Orange */;\n  --orange-50: 33.3 100% 96.5%;\n  --orange-100: 34.3 100% 91.8%;\n  --orange-200: 32.1 97.7% 83.1%;\n  --orange-300: 30.7 97.2% 72.4%;\n  --orange-400: 27 96% 61%;\n  --orange-500: 24.6 95% 53.1%;\n  --orange-600: 20.5 90.2% 48.2%;\n  --orange-700: 17.5 88.3% 40.4%;\n  --orange-800: 15 79.1% 33.7%;\n  --orange-900: 15.3 74.6% 27.8%;\n  --orange-950: 13 81.1% 14.5% /* Amber */;\n  --amber-50: 48 100% 96.1%;\n  --amber-100: 48 96.5% 88.8%;\n  --amber-200: 48 96.6% 76.7%;\n  --amber-300: 45.9 96.7% 64.5%;\n  --amber-400: 43.3 96.4% 56.3%;\n  --amber-500: 37.7 92.1% 50.2%;\n  --amber-600: 32.1 94.6% 43.7%;\n  --amber-700: 26 90.5% 37.1%;\n  --amber-800: 22.7 82.5% 31.4%;\n  --amber-900: 21.7 77.8% 26.5%;\n  --amber-950: 20.9 91.7% 14.1% /* Yellow */;\n  --yellow-50: 54.5 91.7% 95.3%;\n  --yellow-100: 54.9 96.7% 88%;\n  --yellow-200: 52.8 98.3% 76.9%;\n  --yellow-300: 50.4 97.8% 63.5%;\n  --yellow-400: 47.9 95.8% 53.1%;\n  --yellow-500: 45.4 93.4% 47.5%;\n  --yellow-600: 40.6 96.1% 40.4%;\n  --yellow-700: 35.5 91.7% 32.9%;\n  --yellow-800: 31.8 81% 28.8%;\n  --yellow-900: 28.4 72.5% 25.7%;\n  --yellow-950: 26 83.3% 14.1% /* Lime */;\n  --lime-50: 78.3 92% 95.1%;\n  --lime-100: 79.6 89.1% 89.2%;\n  --lime-200: 80.9 88.5% 79.6%;\n  --lime-300: 82 84.5% 67.1%;\n  --lime-400: 82.7 78% 55.5%;\n  --lime-500: 83.7 80.5% 44.3%;\n  --lime-600: 84.8 85.2% 34.5%;\n  --lime-700: 85.9 78.4% 27.3%;\n  --lime-800: 86.3 69% 22.7%;\n  --lime-900: 87.6 61.2% 20.2%;\n  --lime-950: 89.3 80.4% 10% /* Green */;\n  --green-50: 138.5 76.5% 96.7%;\n  --green-100: 140.6 84.2% 92.5%;\n  --green-200: 141 78.9% 85.1%;\n  --green-300: 141.7 76.6% 73.1%;\n  --green-400: 141.9 69.2% 58%;\n  --green-500: 142.1 70.6% 45.3%;\n  --green-600: 142.1 76.2% 36.3%;\n  --green-700: 142.4 71.8% 29.2%;\n  --green-800: 142.8 64.2% 24.1%;\n  --green-900: 143.8 61.2% 20.2%;\n  --green-950: 144.9 80.4% 10% /* Emerald */;\n  --emerald-50: 151.8 81% 95.9%;\n  --emerald-100: 149.3 80.4% 90%;\n  --emerald-200: 152.4 76% 80.4%;\n  --emerald-300: 156.2 71.6% 66.9%;\n  --emerald-400: 158.1 64.4% 51.6%;\n  --emerald-500: 160.1 84.1% 39.4%;\n  --emerald-600: 161.4 93.5% 30.4%;\n  --emerald-700: 162.9 93.5% 24.3%;\n  --emerald-800: 163.1 88.1% 19.8%;\n  --emerald-900: 164.2 85.7% 16.5%;\n  --emerald-950: 165.7 91.3% 9% /* Teal */;\n  --teal-50: 166.2 76.5% 96.7%;\n  --teal-100: 167.2 85.5% 89.2%;\n  --teal-200: 168.4 83.8% 78.2%;\n  --teal-300: 170.6 76.9% 64.3%;\n  --teal-400: 172.5 66% 50.4%;\n  --teal-500: 173.4 80.4% 40%;\n  --teal-600: 174.7 83.9% 31.6%;\n  --teal-700: 175.3 77.4% 26.1%;\n  --teal-800: 176.1 69.4% 21.8%;\n  --teal-900: 175.9 60.8% 19%;\n  --teal-950: 178.6 84.3% 10% /* Cyan */;\n  --cyan-50: 183.2 100% 96.3%;\n  --cyan-100: 185.1 95.9% 90.4%;\n  --cyan-200: 186.2 93.5% 81.8%;\n  --cyan-300: 187 92.4% 69%;\n  --cyan-400: 187.9 85.7% 53.3%;\n  --cyan-500: 188.7 94.5% 42.7%;\n  --cyan-600: 191.6 91.4% 36.5%;\n  --cyan-700: 192.9 82.3% 31%;\n  --cyan-800: 194.4 69.6% 27.1%;\n  --cyan-900: 196.4 63.6% 23.7%;\n  --cyan-950: 197 78.9% 14.9% /* Sky */;\n  --sky-50: 204 100% 97.1%;\n  --sky-100: 204 93.8% 93.7%;\n  --sky-200: 200.6 94.4% 86.1%;\n  --sky-300: 199.4 95.5% 73.9%;\n  --sky-400: 198.4 93.2% 59.6%;\n  --sky-500: 198.6 88.7% 48.4%;\n  --sky-600: 200.4 98% 39.4%;\n  --sky-700: 201.3 96.3% 32.2%;\n  --sky-800: 201 90% 27.5%;\n  --sky-900: 202 80.3% 23.9%;\n  --sky-950: 204 80.2% 15.9% /* Blue */;\n  --blue-50: 213.8 100% 96.9%;\n  --blue-100: 214.3 94.6% 92.7%;\n  --blue-200: 213.3 96.9% 87.3%;\n  --blue-300: 211.7 96.4% 78.4%;\n  --blue-400: 213.1 93.9% 67.8%;\n  --blue-500: 217.2 91.2% 59.8%;\n  --blue-600: 221.2 83.2% 53.3%;\n  --blue-700: 224.3 76.3% 48%;\n  --blue-800: 225.9 70.7% 40.2%;\n  --blue-900: 224.4 64.3% 32.9%;\n  --blue-950: 226.2 57% 21% /* Indigo */;\n  --indigo-50: 225.9 100% 96.7%;\n  --indigo-100: 226.5 100% 93.9%;\n  --indigo-200: 228 96.5% 88.8%;\n  --indigo-300: 229.7 93.5% 81.8%;\n  --indigo-400: 234.5 89.5% 73.9%;\n  --indigo-500: 238.7 83.5% 66.7%;\n  --indigo-600: 243.4 75.4% 58.6%;\n  --indigo-700: 244.5 57.9% 50.6%;\n  --indigo-800: 243.7 54.5% 41.4%;\n  --indigo-900: 242.2 47.4% 34.3%;\n  --indigo-950: 243.8 47.1% 20% /* Violet */;\n  --violet-50: 250 100% 97.6%;\n  --violet-100: 251.4 91.3% 95.5%;\n  --violet-200: 250.5 95.2% 91.8%;\n  --violet-300: 252.5 94.7% 85.1%;\n  --violet-400: 255.1 91.7% 76.3%;\n  --violet-500: 258.3 89.5% 66.3%;\n  --violet-600: 262.1 83.3% 57.8%;\n  --violet-700: 263.4 70% 50.4%;\n  --violet-800: 263.4 69.3% 42.2%;\n  --violet-900: 263.5 67.4% 34.9%;\n  --violet-950: 261.2 72.6% 22.9% /* Purple */;\n  --purple-50: 270 100% 98%;\n  --purple-100: 268.7 100% 95.5%;\n  --purple-200: 268.6 100% 91.8%;\n  --purple-300: 269.2 97.4% 85.1%;\n  --purple-400: 270 95.2% 75.3%;\n  --purple-500: 270.7 91% 65.1%;\n  --purple-600: 271.5 81.3% 55.9%;\n  --purple-700: 272.1 71.7% 47.1%;\n  --purple-800: 272.9 67.2% 39.4%;\n  --purple-900: 273.6 65.6% 32%;\n  --purple-950: 273.5 86.9% 21% /* Fuchsia */;\n  --fuchsia-50: 289.1 100% 97.8%;\n  --fuchsia-100: 287 100% 95.5%;\n  --fuchsia-200: 288.3 95.8% 90.6%;\n  --fuchsia-300: 291.1 93.1% 82.9%;\n  --fuchsia-400: 292 91.4% 72.5%;\n  --fuchsia-500: 292.2 84.1% 60.6%;\n  --fuchsia-600: 293.4 69.5% 48.8%;\n  --fuchsia-700: 294.7 72.4% 39.8%;\n  --fuchsia-800: 295.4 70.2% 32.9%;\n  --fuchsia-900: 296.7 63.6% 28%;\n  --fuchsia-950: 296.8 90.2% 16.1% /* Pink */;\n  --pink-50: 327.3 73.3% 97.1%;\n  --pink-100: 325.7 77.8% 94.7%;\n  --pink-200: 325.9 84.6% 89.8%;\n  --pink-300: 327.4 87.1% 81.8%;\n  --pink-400: 328.6 85.5% 70.2%;\n  --pink-500: 330.4 81.2% 60.4%;\n  --pink-600: 333.3 71.4% 50.6%;\n  --pink-700: 335.1 77.6% 42%;\n  --pink-800: 335.8 74.4% 35.3%;\n  --pink-900: 335.9 69% 30.4%;\n  --pink-950: 336.2 83.9% 17.1% /* Rose */;\n  --rose-50: 355.7 100% 97.3%;\n  --rose-100: 355.6 100% 94.7%;\n  --rose-200: 352.7 96.1% 90%;\n  --rose-300: 352.6 95.7% 81.8%;\n  --rose-400: 351.3 94.5% 71.4%;\n  --rose-500: 349.7 89.2% 60.2%;\n  --rose-600: 346.8 77.2% 49.8%;\n  --rose-700: 345.3 82.7% 40.8%;\n  --rose-800: 343.4 79.7% 34.7%;\n  --rose-900: 341.5 75.5% 30.4%;\n  --rose-950: 343.1 87.7% 15.9%;\n}\n/* Basic improvements */\nbody {\n  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;\n  background: hsl(var(--neutral-100));\n  -webkit-font-smoothing: antialiased;\n}\n/* Font */\n.infoCGNoCours,\n.infoCGNomCours,\n.infoCGTous,\n.infoCGNoGroupe,\n.om a,\n.om a:link,\n.om a:visited,\n.om a:active {\n  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;\n}\nheader.lea #headerImage {\n  background-image: url(\"https://assets.ohevan.com/img/d7418ab98f310ba3fd14214d7b11771f.jpg\") !important;\n  background-size: cover !important;\n  background-position: center !important;\n}\n/* Remove background images */\n[style*='accueil_cal_bot2.jpg'],\n[style*='accueil_cal_tile.jpg'],\n[style*='accueil_cal_top5.jpg'],\n[style*='accueil_cal_top1.jpg'],\n[style*='accueil_cal_top2.jpg'],\n[style*='accueil_mio_top3.jpg'] {\n  background-image: none !important;\n}\n/* Hide decorative images */\nimg[src*='accueil_cal_top4.jpg'] {\n  display: none !important;\n}\n.TitrePageLigne1 {\n  margin-top: 1rem;\n  text-align: left;\n  font-size: 1.4rem;\n  margin-bottom: 0.5rem;\n  letter-spacing: -0.02em;\n}\n.TitrePageLigne2 {\n  font-size: 1rem;\n  color: hsl(var(--zinc-400));\n  text-align: left;\n  margin-bottom: 1rem;\n}\n`, \"\"]);\n// Exports\nexport default ___CSS_LOADER_EXPORT___;\n");

/***/ }),

/***/ 597:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("// Imports\nimport ___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___ from \"../../node_modules/.pnpm/css-loader@7.1.2_webpack@5.96.1/node_modules/css-loader/dist/runtime/noSourceMaps.js\";\nimport ___CSS_LOADER_API_IMPORT___ from \"../../node_modules/.pnpm/css-loader@7.1.2_webpack@5.96.1/node_modules/css-loader/dist/runtime/api.js\";\nvar ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___);\n// Module\n___CSS_LOADER_EXPORT___.push([module.id, `:root {\n/* Slate */\n  --slate-50: 210 40% 98%;\n  --slate-100: 210 40% 96.1%;\n  --slate-200: 214.3 31.8% 91.4%;\n  --slate-300: 212.7 26.8% 83.9%;\n  --slate-400: 215 20.2% 65.1%;\n  --slate-500: 215.4 16.3% 46.9%;\n  --slate-600: 215.3 19.3% 34.5%;\n  --slate-700: 215.3 25% 26.7%;\n  --slate-800: 217.2 32.6% 17.5%;\n  --slate-900: 222.2 47.4% 11.2%;\n  --slate-950: 228.6 84% 4.9% /* Gray */;\n  --gray-50: 210 20% 98%;\n  --gray-100: 220 14.3% 95.9%;\n  --gray-200: 220 13% 91%;\n  --gray-300: 216 12.2% 83.9%;\n  --gray-400: 217.9 10.6% 64.9%;\n  --gray-500: 220 8.9% 46.1%;\n  --gray-600: 215 13.8% 34.1%;\n  --gray-700: 216.9 19.1% 26.7%;\n  --gray-800: 215 27.9% 16.9%;\n  --gray-900: 220.9 39.3% 11%;\n  --gray-950: 224 71.4% 4.1% /* Zinc */;\n  --zinc-50: 0 0% 98%;\n  --zinc-100: 240 4.8% 95.9%;\n  --zinc-200: 240 5.9% 90%;\n  --zinc-300: 240 4.9% 83.9%;\n  --zinc-400: 240 5% 64.9%;\n  --zinc-500: 240 3.8% 46.1%;\n  --zinc-600: 240 5.2% 33.9%;\n  --zinc-700: 240 5.3% 26.1%;\n  --zinc-800: 240 3.7% 15.9%;\n  --zinc-900: 240 5.9% 10%;\n  --zinc-950: 240 10% 3.9% /* Neutral */;\n  --neutral-50: 0 0% 98%;\n  --neutral-100: 0 0% 96.1%;\n  --neutral-200: 0 0% 89.8%;\n  --neutral-300: 0 0% 83.1%;\n  --neutral-400: 0 0% 63.9%;\n  --neutral-500: 0 0% 45.1%;\n  --neutral-600: 0 0% 32.2%;\n  --neutral-700: 0 0% 25.1%;\n  --neutral-800: 0 0% 14.9%;\n  --neutral-900: 0 0% 9%;\n  --neutral-950: 0 0% 3.9% /* Stone */;\n  --stone-50: 60 9.1% 97.8%;\n  --stone-100: 60 4.8% 95.9%;\n  --stone-200: 20 5.9% 90%;\n  --stone-300: 24 5.7% 82.9%;\n  --stone-400: 24 5.4% 63.9%;\n  --stone-500: 25 5.3% 44.7%;\n  --stone-600: 33.3 5.5% 32.4%;\n  --stone-700: 30 6.3% 25.1%;\n  --stone-800: 12 6.5% 15.1%;\n  --stone-900: 24 9.8% 10%;\n  --stone-950: 20 14.3% 4.1% /* Red */;\n  --red-50: 0 85.7% 97.3%;\n  --red-100: 0 93.3% 94.1%;\n  --red-200: 0 96.3% 89.4%;\n  --red-300: 0 93.5% 81.8%;\n  --red-400: 0 90.6% 70.8%;\n  --red-500: 0 84.2% 60.2%;\n  --red-600: 0 72.2% 50.6%;\n  --red-700: 0 73.7% 41.8%;\n  --red-800: 0 70% 35.3%;\n  --red-900: 0 62.8% 30.6%;\n  --red-950: 0 74.7% 15.5% /* Orange */;\n  --orange-50: 33.3 100% 96.5%;\n  --orange-100: 34.3 100% 91.8%;\n  --orange-200: 32.1 97.7% 83.1%;\n  --orange-300: 30.7 97.2% 72.4%;\n  --orange-400: 27 96% 61%;\n  --orange-500: 24.6 95% 53.1%;\n  --orange-600: 20.5 90.2% 48.2%;\n  --orange-700: 17.5 88.3% 40.4%;\n  --orange-800: 15 79.1% 33.7%;\n  --orange-900: 15.3 74.6% 27.8%;\n  --orange-950: 13 81.1% 14.5% /* Amber */;\n  --amber-50: 48 100% 96.1%;\n  --amber-100: 48 96.5% 88.8%;\n  --amber-200: 48 96.6% 76.7%;\n  --amber-300: 45.9 96.7% 64.5%;\n  --amber-400: 43.3 96.4% 56.3%;\n  --amber-500: 37.7 92.1% 50.2%;\n  --amber-600: 32.1 94.6% 43.7%;\n  --amber-700: 26 90.5% 37.1%;\n  --amber-800: 22.7 82.5% 31.4%;\n  --amber-900: 21.7 77.8% 26.5%;\n  --amber-950: 20.9 91.7% 14.1% /* Yellow */;\n  --yellow-50: 54.5 91.7% 95.3%;\n  --yellow-100: 54.9 96.7% 88%;\n  --yellow-200: 52.8 98.3% 76.9%;\n  --yellow-300: 50.4 97.8% 63.5%;\n  --yellow-400: 47.9 95.8% 53.1%;\n  --yellow-500: 45.4 93.4% 47.5%;\n  --yellow-600: 40.6 96.1% 40.4%;\n  --yellow-700: 35.5 91.7% 32.9%;\n  --yellow-800: 31.8 81% 28.8%;\n  --yellow-900: 28.4 72.5% 25.7%;\n  --yellow-950: 26 83.3% 14.1% /* Lime */;\n  --lime-50: 78.3 92% 95.1%;\n  --lime-100: 79.6 89.1% 89.2%;\n  --lime-200: 80.9 88.5% 79.6%;\n  --lime-300: 82 84.5% 67.1%;\n  --lime-400: 82.7 78% 55.5%;\n  --lime-500: 83.7 80.5% 44.3%;\n  --lime-600: 84.8 85.2% 34.5%;\n  --lime-700: 85.9 78.4% 27.3%;\n  --lime-800: 86.3 69% 22.7%;\n  --lime-900: 87.6 61.2% 20.2%;\n  --lime-950: 89.3 80.4% 10% /* Green */;\n  --green-50: 138.5 76.5% 96.7%;\n  --green-100: 140.6 84.2% 92.5%;\n  --green-200: 141 78.9% 85.1%;\n  --green-300: 141.7 76.6% 73.1%;\n  --green-400: 141.9 69.2% 58%;\n  --green-500: 142.1 70.6% 45.3%;\n  --green-600: 142.1 76.2% 36.3%;\n  --green-700: 142.4 71.8% 29.2%;\n  --green-800: 142.8 64.2% 24.1%;\n  --green-900: 143.8 61.2% 20.2%;\n  --green-950: 144.9 80.4% 10% /* Emerald */;\n  --emerald-50: 151.8 81% 95.9%;\n  --emerald-100: 149.3 80.4% 90%;\n  --emerald-200: 152.4 76% 80.4%;\n  --emerald-300: 156.2 71.6% 66.9%;\n  --emerald-400: 158.1 64.4% 51.6%;\n  --emerald-500: 160.1 84.1% 39.4%;\n  --emerald-600: 161.4 93.5% 30.4%;\n  --emerald-700: 162.9 93.5% 24.3%;\n  --emerald-800: 163.1 88.1% 19.8%;\n  --emerald-900: 164.2 85.7% 16.5%;\n  --emerald-950: 165.7 91.3% 9% /* Teal */;\n  --teal-50: 166.2 76.5% 96.7%;\n  --teal-100: 167.2 85.5% 89.2%;\n  --teal-200: 168.4 83.8% 78.2%;\n  --teal-300: 170.6 76.9% 64.3%;\n  --teal-400: 172.5 66% 50.4%;\n  --teal-500: 173.4 80.4% 40%;\n  --teal-600: 174.7 83.9% 31.6%;\n  --teal-700: 175.3 77.4% 26.1%;\n  --teal-800: 176.1 69.4% 21.8%;\n  --teal-900: 175.9 60.8% 19%;\n  --teal-950: 178.6 84.3% 10% /* Cyan */;\n  --cyan-50: 183.2 100% 96.3%;\n  --cyan-100: 185.1 95.9% 90.4%;\n  --cyan-200: 186.2 93.5% 81.8%;\n  --cyan-300: 187 92.4% 69%;\n  --cyan-400: 187.9 85.7% 53.3%;\n  --cyan-500: 188.7 94.5% 42.7%;\n  --cyan-600: 191.6 91.4% 36.5%;\n  --cyan-700: 192.9 82.3% 31%;\n  --cyan-800: 194.4 69.6% 27.1%;\n  --cyan-900: 196.4 63.6% 23.7%;\n  --cyan-950: 197 78.9% 14.9% /* Sky */;\n  --sky-50: 204 100% 97.1%;\n  --sky-100: 204 93.8% 93.7%;\n  --sky-200: 200.6 94.4% 86.1%;\n  --sky-300: 199.4 95.5% 73.9%;\n  --sky-400: 198.4 93.2% 59.6%;\n  --sky-500: 198.6 88.7% 48.4%;\n  --sky-600: 200.4 98% 39.4%;\n  --sky-700: 201.3 96.3% 32.2%;\n  --sky-800: 201 90% 27.5%;\n  --sky-900: 202 80.3% 23.9%;\n  --sky-950: 204 80.2% 15.9% /* Blue */;\n  --blue-50: 213.8 100% 96.9%;\n  --blue-100: 214.3 94.6% 92.7%;\n  --blue-200: 213.3 96.9% 87.3%;\n  --blue-300: 211.7 96.4% 78.4%;\n  --blue-400: 213.1 93.9% 67.8%;\n  --blue-500: 217.2 91.2% 59.8%;\n  --blue-600: 221.2 83.2% 53.3%;\n  --blue-700: 224.3 76.3% 48%;\n  --blue-800: 225.9 70.7% 40.2%;\n  --blue-900: 224.4 64.3% 32.9%;\n  --blue-950: 226.2 57% 21% /* Indigo */;\n  --indigo-50: 225.9 100% 96.7%;\n  --indigo-100: 226.5 100% 93.9%;\n  --indigo-200: 228 96.5% 88.8%;\n  --indigo-300: 229.7 93.5% 81.8%;\n  --indigo-400: 234.5 89.5% 73.9%;\n  --indigo-500: 238.7 83.5% 66.7%;\n  --indigo-600: 243.4 75.4% 58.6%;\n  --indigo-700: 244.5 57.9% 50.6%;\n  --indigo-800: 243.7 54.5% 41.4%;\n  --indigo-900: 242.2 47.4% 34.3%;\n  --indigo-950: 243.8 47.1% 20% /* Violet */;\n  --violet-50: 250 100% 97.6%;\n  --violet-100: 251.4 91.3% 95.5%;\n  --violet-200: 250.5 95.2% 91.8%;\n  --violet-300: 252.5 94.7% 85.1%;\n  --violet-400: 255.1 91.7% 76.3%;\n  --violet-500: 258.3 89.5% 66.3%;\n  --violet-600: 262.1 83.3% 57.8%;\n  --violet-700: 263.4 70% 50.4%;\n  --violet-800: 263.4 69.3% 42.2%;\n  --violet-900: 263.5 67.4% 34.9%;\n  --violet-950: 261.2 72.6% 22.9% /* Purple */;\n  --purple-50: 270 100% 98%;\n  --purple-100: 268.7 100% 95.5%;\n  --purple-200: 268.6 100% 91.8%;\n  --purple-300: 269.2 97.4% 85.1%;\n  --purple-400: 270 95.2% 75.3%;\n  --purple-500: 270.7 91% 65.1%;\n  --purple-600: 271.5 81.3% 55.9%;\n  --purple-700: 272.1 71.7% 47.1%;\n  --purple-800: 272.9 67.2% 39.4%;\n  --purple-900: 273.6 65.6% 32%;\n  --purple-950: 273.5 86.9% 21% /* Fuchsia */;\n  --fuchsia-50: 289.1 100% 97.8%;\n  --fuchsia-100: 287 100% 95.5%;\n  --fuchsia-200: 288.3 95.8% 90.6%;\n  --fuchsia-300: 291.1 93.1% 82.9%;\n  --fuchsia-400: 292 91.4% 72.5%;\n  --fuchsia-500: 292.2 84.1% 60.6%;\n  --fuchsia-600: 293.4 69.5% 48.8%;\n  --fuchsia-700: 294.7 72.4% 39.8%;\n  --fuchsia-800: 295.4 70.2% 32.9%;\n  --fuchsia-900: 296.7 63.6% 28%;\n  --fuchsia-950: 296.8 90.2% 16.1% /* Pink */;\n  --pink-50: 327.3 73.3% 97.1%;\n  --pink-100: 325.7 77.8% 94.7%;\n  --pink-200: 325.9 84.6% 89.8%;\n  --pink-300: 327.4 87.1% 81.8%;\n  --pink-400: 328.6 85.5% 70.2%;\n  --pink-500: 330.4 81.2% 60.4%;\n  --pink-600: 333.3 71.4% 50.6%;\n  --pink-700: 335.1 77.6% 42%;\n  --pink-800: 335.8 74.4% 35.3%;\n  --pink-900: 335.9 69% 30.4%;\n  --pink-950: 336.2 83.9% 17.1% /* Rose */;\n  --rose-50: 355.7 100% 97.3%;\n  --rose-100: 355.6 100% 94.7%;\n  --rose-200: 352.7 96.1% 90%;\n  --rose-300: 352.6 95.7% 81.8%;\n  --rose-400: 351.3 94.5% 71.4%;\n  --rose-500: 349.7 89.2% 60.2%;\n  --rose-600: 346.8 77.2% 49.8%;\n  --rose-700: 345.3 82.7% 40.8%;\n  --rose-800: 343.4 79.7% 34.7%;\n  --rose-900: 341.5 75.5% 30.4%;\n  --rose-950: 343.1 87.7% 15.9%;\n}\n`, \"\"]);\n// Exports\nexport default ___CSS_LOADER_EXPORT___;\n");

/***/ }),

/***/ 484:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("// Imports\nimport ___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___ from \"../../../node_modules/.pnpm/css-loader@7.1.2_webpack@5.96.1/node_modules/css-loader/dist/runtime/noSourceMaps.js\";\nimport ___CSS_LOADER_API_IMPORT___ from \"../../../node_modules/.pnpm/css-loader@7.1.2_webpack@5.96.1/node_modules/css-loader/dist/runtime/api.js\";\nvar ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___);\n// Module\n___CSS_LOADER_EXPORT___.push([module.id, `:root {\n/* Slate */\n  --slate-50: 210 40% 98%;\n  --slate-100: 210 40% 96.1%;\n  --slate-200: 214.3 31.8% 91.4%;\n  --slate-300: 212.7 26.8% 83.9%;\n  --slate-400: 215 20.2% 65.1%;\n  --slate-500: 215.4 16.3% 46.9%;\n  --slate-600: 215.3 19.3% 34.5%;\n  --slate-700: 215.3 25% 26.7%;\n  --slate-800: 217.2 32.6% 17.5%;\n  --slate-900: 222.2 47.4% 11.2%;\n  --slate-950: 228.6 84% 4.9% /* Gray */;\n  --gray-50: 210 20% 98%;\n  --gray-100: 220 14.3% 95.9%;\n  --gray-200: 220 13% 91%;\n  --gray-300: 216 12.2% 83.9%;\n  --gray-400: 217.9 10.6% 64.9%;\n  --gray-500: 220 8.9% 46.1%;\n  --gray-600: 215 13.8% 34.1%;\n  --gray-700: 216.9 19.1% 26.7%;\n  --gray-800: 215 27.9% 16.9%;\n  --gray-900: 220.9 39.3% 11%;\n  --gray-950: 224 71.4% 4.1% /* Zinc */;\n  --zinc-50: 0 0% 98%;\n  --zinc-100: 240 4.8% 95.9%;\n  --zinc-200: 240 5.9% 90%;\n  --zinc-300: 240 4.9% 83.9%;\n  --zinc-400: 240 5% 64.9%;\n  --zinc-500: 240 3.8% 46.1%;\n  --zinc-600: 240 5.2% 33.9%;\n  --zinc-700: 240 5.3% 26.1%;\n  --zinc-800: 240 3.7% 15.9%;\n  --zinc-900: 240 5.9% 10%;\n  --zinc-950: 240 10% 3.9% /* Neutral */;\n  --neutral-50: 0 0% 98%;\n  --neutral-100: 0 0% 96.1%;\n  --neutral-200: 0 0% 89.8%;\n  --neutral-300: 0 0% 83.1%;\n  --neutral-400: 0 0% 63.9%;\n  --neutral-500: 0 0% 45.1%;\n  --neutral-600: 0 0% 32.2%;\n  --neutral-700: 0 0% 25.1%;\n  --neutral-800: 0 0% 14.9%;\n  --neutral-900: 0 0% 9%;\n  --neutral-950: 0 0% 3.9% /* Stone */;\n  --stone-50: 60 9.1% 97.8%;\n  --stone-100: 60 4.8% 95.9%;\n  --stone-200: 20 5.9% 90%;\n  --stone-300: 24 5.7% 82.9%;\n  --stone-400: 24 5.4% 63.9%;\n  --stone-500: 25 5.3% 44.7%;\n  --stone-600: 33.3 5.5% 32.4%;\n  --stone-700: 30 6.3% 25.1%;\n  --stone-800: 12 6.5% 15.1%;\n  --stone-900: 24 9.8% 10%;\n  --stone-950: 20 14.3% 4.1% /* Red */;\n  --red-50: 0 85.7% 97.3%;\n  --red-100: 0 93.3% 94.1%;\n  --red-200: 0 96.3% 89.4%;\n  --red-300: 0 93.5% 81.8%;\n  --red-400: 0 90.6% 70.8%;\n  --red-500: 0 84.2% 60.2%;\n  --red-600: 0 72.2% 50.6%;\n  --red-700: 0 73.7% 41.8%;\n  --red-800: 0 70% 35.3%;\n  --red-900: 0 62.8% 30.6%;\n  --red-950: 0 74.7% 15.5% /* Orange */;\n  --orange-50: 33.3 100% 96.5%;\n  --orange-100: 34.3 100% 91.8%;\n  --orange-200: 32.1 97.7% 83.1%;\n  --orange-300: 30.7 97.2% 72.4%;\n  --orange-400: 27 96% 61%;\n  --orange-500: 24.6 95% 53.1%;\n  --orange-600: 20.5 90.2% 48.2%;\n  --orange-700: 17.5 88.3% 40.4%;\n  --orange-800: 15 79.1% 33.7%;\n  --orange-900: 15.3 74.6% 27.8%;\n  --orange-950: 13 81.1% 14.5% /* Amber */;\n  --amber-50: 48 100% 96.1%;\n  --amber-100: 48 96.5% 88.8%;\n  --amber-200: 48 96.6% 76.7%;\n  --amber-300: 45.9 96.7% 64.5%;\n  --amber-400: 43.3 96.4% 56.3%;\n  --amber-500: 37.7 92.1% 50.2%;\n  --amber-600: 32.1 94.6% 43.7%;\n  --amber-700: 26 90.5% 37.1%;\n  --amber-800: 22.7 82.5% 31.4%;\n  --amber-900: 21.7 77.8% 26.5%;\n  --amber-950: 20.9 91.7% 14.1% /* Yellow */;\n  --yellow-50: 54.5 91.7% 95.3%;\n  --yellow-100: 54.9 96.7% 88%;\n  --yellow-200: 52.8 98.3% 76.9%;\n  --yellow-300: 50.4 97.8% 63.5%;\n  --yellow-400: 47.9 95.8% 53.1%;\n  --yellow-500: 45.4 93.4% 47.5%;\n  --yellow-600: 40.6 96.1% 40.4%;\n  --yellow-700: 35.5 91.7% 32.9%;\n  --yellow-800: 31.8 81% 28.8%;\n  --yellow-900: 28.4 72.5% 25.7%;\n  --yellow-950: 26 83.3% 14.1% /* Lime */;\n  --lime-50: 78.3 92% 95.1%;\n  --lime-100: 79.6 89.1% 89.2%;\n  --lime-200: 80.9 88.5% 79.6%;\n  --lime-300: 82 84.5% 67.1%;\n  --lime-400: 82.7 78% 55.5%;\n  --lime-500: 83.7 80.5% 44.3%;\n  --lime-600: 84.8 85.2% 34.5%;\n  --lime-700: 85.9 78.4% 27.3%;\n  --lime-800: 86.3 69% 22.7%;\n  --lime-900: 87.6 61.2% 20.2%;\n  --lime-950: 89.3 80.4% 10% /* Green */;\n  --green-50: 138.5 76.5% 96.7%;\n  --green-100: 140.6 84.2% 92.5%;\n  --green-200: 141 78.9% 85.1%;\n  --green-300: 141.7 76.6% 73.1%;\n  --green-400: 141.9 69.2% 58%;\n  --green-500: 142.1 70.6% 45.3%;\n  --green-600: 142.1 76.2% 36.3%;\n  --green-700: 142.4 71.8% 29.2%;\n  --green-800: 142.8 64.2% 24.1%;\n  --green-900: 143.8 61.2% 20.2%;\n  --green-950: 144.9 80.4% 10% /* Emerald */;\n  --emerald-50: 151.8 81% 95.9%;\n  --emerald-100: 149.3 80.4% 90%;\n  --emerald-200: 152.4 76% 80.4%;\n  --emerald-300: 156.2 71.6% 66.9%;\n  --emerald-400: 158.1 64.4% 51.6%;\n  --emerald-500: 160.1 84.1% 39.4%;\n  --emerald-600: 161.4 93.5% 30.4%;\n  --emerald-700: 162.9 93.5% 24.3%;\n  --emerald-800: 163.1 88.1% 19.8%;\n  --emerald-900: 164.2 85.7% 16.5%;\n  --emerald-950: 165.7 91.3% 9% /* Teal */;\n  --teal-50: 166.2 76.5% 96.7%;\n  --teal-100: 167.2 85.5% 89.2%;\n  --teal-200: 168.4 83.8% 78.2%;\n  --teal-300: 170.6 76.9% 64.3%;\n  --teal-400: 172.5 66% 50.4%;\n  --teal-500: 173.4 80.4% 40%;\n  --teal-600: 174.7 83.9% 31.6%;\n  --teal-700: 175.3 77.4% 26.1%;\n  --teal-800: 176.1 69.4% 21.8%;\n  --teal-900: 175.9 60.8% 19%;\n  --teal-950: 178.6 84.3% 10% /* Cyan */;\n  --cyan-50: 183.2 100% 96.3%;\n  --cyan-100: 185.1 95.9% 90.4%;\n  --cyan-200: 186.2 93.5% 81.8%;\n  --cyan-300: 187 92.4% 69%;\n  --cyan-400: 187.9 85.7% 53.3%;\n  --cyan-500: 188.7 94.5% 42.7%;\n  --cyan-600: 191.6 91.4% 36.5%;\n  --cyan-700: 192.9 82.3% 31%;\n  --cyan-800: 194.4 69.6% 27.1%;\n  --cyan-900: 196.4 63.6% 23.7%;\n  --cyan-950: 197 78.9% 14.9% /* Sky */;\n  --sky-50: 204 100% 97.1%;\n  --sky-100: 204 93.8% 93.7%;\n  --sky-200: 200.6 94.4% 86.1%;\n  --sky-300: 199.4 95.5% 73.9%;\n  --sky-400: 198.4 93.2% 59.6%;\n  --sky-500: 198.6 88.7% 48.4%;\n  --sky-600: 200.4 98% 39.4%;\n  --sky-700: 201.3 96.3% 32.2%;\n  --sky-800: 201 90% 27.5%;\n  --sky-900: 202 80.3% 23.9%;\n  --sky-950: 204 80.2% 15.9% /* Blue */;\n  --blue-50: 213.8 100% 96.9%;\n  --blue-100: 214.3 94.6% 92.7%;\n  --blue-200: 213.3 96.9% 87.3%;\n  --blue-300: 211.7 96.4% 78.4%;\n  --blue-400: 213.1 93.9% 67.8%;\n  --blue-500: 217.2 91.2% 59.8%;\n  --blue-600: 221.2 83.2% 53.3%;\n  --blue-700: 224.3 76.3% 48%;\n  --blue-800: 225.9 70.7% 40.2%;\n  --blue-900: 224.4 64.3% 32.9%;\n  --blue-950: 226.2 57% 21% /* Indigo */;\n  --indigo-50: 225.9 100% 96.7%;\n  --indigo-100: 226.5 100% 93.9%;\n  --indigo-200: 228 96.5% 88.8%;\n  --indigo-300: 229.7 93.5% 81.8%;\n  --indigo-400: 234.5 89.5% 73.9%;\n  --indigo-500: 238.7 83.5% 66.7%;\n  --indigo-600: 243.4 75.4% 58.6%;\n  --indigo-700: 244.5 57.9% 50.6%;\n  --indigo-800: 243.7 54.5% 41.4%;\n  --indigo-900: 242.2 47.4% 34.3%;\n  --indigo-950: 243.8 47.1% 20% /* Violet */;\n  --violet-50: 250 100% 97.6%;\n  --violet-100: 251.4 91.3% 95.5%;\n  --violet-200: 250.5 95.2% 91.8%;\n  --violet-300: 252.5 94.7% 85.1%;\n  --violet-400: 255.1 91.7% 76.3%;\n  --violet-500: 258.3 89.5% 66.3%;\n  --violet-600: 262.1 83.3% 57.8%;\n  --violet-700: 263.4 70% 50.4%;\n  --violet-800: 263.4 69.3% 42.2%;\n  --violet-900: 263.5 67.4% 34.9%;\n  --violet-950: 261.2 72.6% 22.9% /* Purple */;\n  --purple-50: 270 100% 98%;\n  --purple-100: 268.7 100% 95.5%;\n  --purple-200: 268.6 100% 91.8%;\n  --purple-300: 269.2 97.4% 85.1%;\n  --purple-400: 270 95.2% 75.3%;\n  --purple-500: 270.7 91% 65.1%;\n  --purple-600: 271.5 81.3% 55.9%;\n  --purple-700: 272.1 71.7% 47.1%;\n  --purple-800: 272.9 67.2% 39.4%;\n  --purple-900: 273.6 65.6% 32%;\n  --purple-950: 273.5 86.9% 21% /* Fuchsia */;\n  --fuchsia-50: 289.1 100% 97.8%;\n  --fuchsia-100: 287 100% 95.5%;\n  --fuchsia-200: 288.3 95.8% 90.6%;\n  --fuchsia-300: 291.1 93.1% 82.9%;\n  --fuchsia-400: 292 91.4% 72.5%;\n  --fuchsia-500: 292.2 84.1% 60.6%;\n  --fuchsia-600: 293.4 69.5% 48.8%;\n  --fuchsia-700: 294.7 72.4% 39.8%;\n  --fuchsia-800: 295.4 70.2% 32.9%;\n  --fuchsia-900: 296.7 63.6% 28%;\n  --fuchsia-950: 296.8 90.2% 16.1% /* Pink */;\n  --pink-50: 327.3 73.3% 97.1%;\n  --pink-100: 325.7 77.8% 94.7%;\n  --pink-200: 325.9 84.6% 89.8%;\n  --pink-300: 327.4 87.1% 81.8%;\n  --pink-400: 328.6 85.5% 70.2%;\n  --pink-500: 330.4 81.2% 60.4%;\n  --pink-600: 333.3 71.4% 50.6%;\n  --pink-700: 335.1 77.6% 42%;\n  --pink-800: 335.8 74.4% 35.3%;\n  --pink-900: 335.9 69% 30.4%;\n  --pink-950: 336.2 83.9% 17.1% /* Rose */;\n  --rose-50: 355.7 100% 97.3%;\n  --rose-100: 355.6 100% 94.7%;\n  --rose-200: 352.7 96.1% 90%;\n  --rose-300: 352.6 95.7% 81.8%;\n  --rose-400: 351.3 94.5% 71.4%;\n  --rose-500: 349.7 89.2% 60.2%;\n  --rose-600: 346.8 77.2% 49.8%;\n  --rose-700: 345.3 82.7% 40.8%;\n  --rose-800: 343.4 79.7% 34.7%;\n  --rose-900: 341.5 75.5% 30.4%;\n  --rose-950: 343.1 87.7% 15.9%;\n}\n.assignments-page {\n  max-width: 100%;\n  margin: 0 auto;\n  width: 100%;\n}\n.page-header {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  text-align: left;\n  margin-bottom: 1.5rem;\n}\n.assignments-container {\n  display: flex !important;\n  flex-direction: column;\n  gap: 1.5rem;\n}\n.category-container {\n  background: #fff;\n  border: 1px solid  hsl(var(--neutral-200));\n  border-radius: 12px;\n  overflow: hidden;\n}\n.category-header {\n  display: flex;\n  align-items: center;\n  padding: 1.25rem 1.5rem;\n  font-size: 1.05rem;\n  font-weight: 600;\n  color: hsl(var(--slate-900));\n  border-bottom: 1px solid  hsl(var(--neutral-200));\n  background: hsl(var(--slate-50));\n}\n.assignments-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));\n  gap: 1rem;\n  padding: 1.25rem;\n  background: hsl(var(--neutral-50));\n}\n.assignment-card {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  background: #fff;\n  border-radius: 12px;\n  border: 1px solid  hsl(var(--neutral-200));\n  padding: 1.25rem;\n  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;\n  cursor: pointer;\n}\n.assignment-card:hover {\n  transform: translateY(-2px);\n  border-color: hsl(var(--neutral-300));\n  box-shadow: 0 4px 12px rgba(15,23,42,0.08);\n}\n.assignment-card.unread {\n  border-color: hsl(var(--blue-300));\n}\n.assignment-card.submitted {\n  border-color: hsl(var(--emerald-300));\n}\n.assignment-header {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n}\n.assignment-title-row {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  width: 100%;\n  align-items: center;\n  gap: 0.75rem;\n  flex: 1;\n}\n.assignment-title {\n  font-size: 1.1rem;\n  font-weight: 600;\n  color: hsl(var(--slate-900));\n  text-decoration: none;\n  line-height: 1.05;\n  text-align: left;\n}\n.assignment-title:hover {\n  color: hsl(var(--blue-600));\n}\n.due-date {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  background-color: #fff;\n  padding: 0.5rem 0.75rem;\n  border-radius: 10px;\n  font-size: 0.9rem;\n  color: hsl(var(--slate-700));\n  border: 1px solid  hsl(var(--slate-200));\n  box-shadow: 0 1px 2px rgba(15,23,42,0.05);\n}\n.due-date.overdue {\n  background-color: hsl(var(--red-50));\n  color: hsl(var(--red-700));\n  border-color: hsl(var(--red-200));\n}\n.due-date .due-label {\n  color: hsl(var(--slate-500));\n  font-weight: 500;\n}\n.due-date .date {\n  font-weight: 500;\n  color: hsl(var(--slate-800));\n}\n.due-date .relative-date-badge {\n  background-color: hsl(var(--emerald-50));\n  color: hsl(var(--emerald-700));\n  font-size: 0.7rem;\n  font-weight: 600;\n  padding: 0.25rem 0.6rem;\n  border-radius: 999px;\n  margin-left: auto;\n  white-space: nowrap;\n}\n.assignment-details {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  font-size: 0.9rem;\n}\n.assignment-details .label {\n  color: hsl(var(--slate-500));\n  margin-right: 0.5rem;\n}\n.assignment-details .status.submitted {\n  color: hsl(var(--green-600));\n}\n.submission-info,\n.status-info {\n  display: flex;\n  align-items: center;\n}\n.status-info {\n  flex-direction: column;\n  align-items: flex-start;\n  gap: 0.25rem;\n}\n.status-info .label {\n  margin-right: 0;\n}\n.status-info .status {\n  display: block;\n  text-align: left;\n  width: 100%;\n}\n.status-indicators {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.indicator {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 28px;\n  height: 28px;\n  border-radius: 50%;\n  background: hsl(var(--neutral-100));\n  color: hsl(var(--slate-500));\n  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;\n}\n.indicator svg {\n  width: 16px;\n  height: 16px;\n  fill: none !important;\n}\n.indicator:hover {\n  background: hsl(var(--neutral-200));\n  color: hsl(var(--slate-700));\n  transform: translateY(-1px);\n}\n.indicator.new-indicator {\n  color: hsl(var(--blue-600));\n  background: hsl(var(--blue-100));\n}\n.indicator.submitted-indicator {\n  color: hsl(var(--emerald-600));\n  background: hsl(var(--emerald-100));\n}\n.indicator.overdue-indicator {\n  color: hsl(var(--red-600));\n  background: hsl(var(--red-100));\n}\ntable[id*=\"ListeTrav\"] {\n  display: table !important;\n}\n`, \"\"]);\n// Exports\nexport default ___CSS_LOADER_EXPORT___;\n");

/***/ }),

/***/ 732:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("// Imports\nimport ___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___ from \"../../../node_modules/.pnpm/css-loader@7.1.2_webpack@5.96.1/node_modules/css-loader/dist/runtime/noSourceMaps.js\";\nimport ___CSS_LOADER_API_IMPORT___ from \"../../../node_modules/.pnpm/css-loader@7.1.2_webpack@5.96.1/node_modules/css-loader/dist/runtime/api.js\";\nvar ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___);\n// Module\n___CSS_LOADER_EXPORT___.push([module.id, `:root {\n/* Slate */\n  --slate-50: 210 40% 98%;\n  --slate-100: 210 40% 96.1%;\n  --slate-200: 214.3 31.8% 91.4%;\n  --slate-300: 212.7 26.8% 83.9%;\n  --slate-400: 215 20.2% 65.1%;\n  --slate-500: 215.4 16.3% 46.9%;\n  --slate-600: 215.3 19.3% 34.5%;\n  --slate-700: 215.3 25% 26.7%;\n  --slate-800: 217.2 32.6% 17.5%;\n  --slate-900: 222.2 47.4% 11.2%;\n  --slate-950: 228.6 84% 4.9% /* Gray */;\n  --gray-50: 210 20% 98%;\n  --gray-100: 220 14.3% 95.9%;\n  --gray-200: 220 13% 91%;\n  --gray-300: 216 12.2% 83.9%;\n  --gray-400: 217.9 10.6% 64.9%;\n  --gray-500: 220 8.9% 46.1%;\n  --gray-600: 215 13.8% 34.1%;\n  --gray-700: 216.9 19.1% 26.7%;\n  --gray-800: 215 27.9% 16.9%;\n  --gray-900: 220.9 39.3% 11%;\n  --gray-950: 224 71.4% 4.1% /* Zinc */;\n  --zinc-50: 0 0% 98%;\n  --zinc-100: 240 4.8% 95.9%;\n  --zinc-200: 240 5.9% 90%;\n  --zinc-300: 240 4.9% 83.9%;\n  --zinc-400: 240 5% 64.9%;\n  --zinc-500: 240 3.8% 46.1%;\n  --zinc-600: 240 5.2% 33.9%;\n  --zinc-700: 240 5.3% 26.1%;\n  --zinc-800: 240 3.7% 15.9%;\n  --zinc-900: 240 5.9% 10%;\n  --zinc-950: 240 10% 3.9% /* Neutral */;\n  --neutral-50: 0 0% 98%;\n  --neutral-100: 0 0% 96.1%;\n  --neutral-200: 0 0% 89.8%;\n  --neutral-300: 0 0% 83.1%;\n  --neutral-400: 0 0% 63.9%;\n  --neutral-500: 0 0% 45.1%;\n  --neutral-600: 0 0% 32.2%;\n  --neutral-700: 0 0% 25.1%;\n  --neutral-800: 0 0% 14.9%;\n  --neutral-900: 0 0% 9%;\n  --neutral-950: 0 0% 3.9% /* Stone */;\n  --stone-50: 60 9.1% 97.8%;\n  --stone-100: 60 4.8% 95.9%;\n  --stone-200: 20 5.9% 90%;\n  --stone-300: 24 5.7% 82.9%;\n  --stone-400: 24 5.4% 63.9%;\n  --stone-500: 25 5.3% 44.7%;\n  --stone-600: 33.3 5.5% 32.4%;\n  --stone-700: 30 6.3% 25.1%;\n  --stone-800: 12 6.5% 15.1%;\n  --stone-900: 24 9.8% 10%;\n  --stone-950: 20 14.3% 4.1% /* Red */;\n  --red-50: 0 85.7% 97.3%;\n  --red-100: 0 93.3% 94.1%;\n  --red-200: 0 96.3% 89.4%;\n  --red-300: 0 93.5% 81.8%;\n  --red-400: 0 90.6% 70.8%;\n  --red-500: 0 84.2% 60.2%;\n  --red-600: 0 72.2% 50.6%;\n  --red-700: 0 73.7% 41.8%;\n  --red-800: 0 70% 35.3%;\n  --red-900: 0 62.8% 30.6%;\n  --red-950: 0 74.7% 15.5% /* Orange */;\n  --orange-50: 33.3 100% 96.5%;\n  --orange-100: 34.3 100% 91.8%;\n  --orange-200: 32.1 97.7% 83.1%;\n  --orange-300: 30.7 97.2% 72.4%;\n  --orange-400: 27 96% 61%;\n  --orange-500: 24.6 95% 53.1%;\n  --orange-600: 20.5 90.2% 48.2%;\n  --orange-700: 17.5 88.3% 40.4%;\n  --orange-800: 15 79.1% 33.7%;\n  --orange-900: 15.3 74.6% 27.8%;\n  --orange-950: 13 81.1% 14.5% /* Amber */;\n  --amber-50: 48 100% 96.1%;\n  --amber-100: 48 96.5% 88.8%;\n  --amber-200: 48 96.6% 76.7%;\n  --amber-300: 45.9 96.7% 64.5%;\n  --amber-400: 43.3 96.4% 56.3%;\n  --amber-500: 37.7 92.1% 50.2%;\n  --amber-600: 32.1 94.6% 43.7%;\n  --amber-700: 26 90.5% 37.1%;\n  --amber-800: 22.7 82.5% 31.4%;\n  --amber-900: 21.7 77.8% 26.5%;\n  --amber-950: 20.9 91.7% 14.1% /* Yellow */;\n  --yellow-50: 54.5 91.7% 95.3%;\n  --yellow-100: 54.9 96.7% 88%;\n  --yellow-200: 52.8 98.3% 76.9%;\n  --yellow-300: 50.4 97.8% 63.5%;\n  --yellow-400: 47.9 95.8% 53.1%;\n  --yellow-500: 45.4 93.4% 47.5%;\n  --yellow-600: 40.6 96.1% 40.4%;\n  --yellow-700: 35.5 91.7% 32.9%;\n  --yellow-800: 31.8 81% 28.8%;\n  --yellow-900: 28.4 72.5% 25.7%;\n  --yellow-950: 26 83.3% 14.1% /* Lime */;\n  --lime-50: 78.3 92% 95.1%;\n  --lime-100: 79.6 89.1% 89.2%;\n  --lime-200: 80.9 88.5% 79.6%;\n  --lime-300: 82 84.5% 67.1%;\n  --lime-400: 82.7 78% 55.5%;\n  --lime-500: 83.7 80.5% 44.3%;\n  --lime-600: 84.8 85.2% 34.5%;\n  --lime-700: 85.9 78.4% 27.3%;\n  --lime-800: 86.3 69% 22.7%;\n  --lime-900: 87.6 61.2% 20.2%;\n  --lime-950: 89.3 80.4% 10% /* Green */;\n  --green-50: 138.5 76.5% 96.7%;\n  --green-100: 140.6 84.2% 92.5%;\n  --green-200: 141 78.9% 85.1%;\n  --green-300: 141.7 76.6% 73.1%;\n  --green-400: 141.9 69.2% 58%;\n  --green-500: 142.1 70.6% 45.3%;\n  --green-600: 142.1 76.2% 36.3%;\n  --green-700: 142.4 71.8% 29.2%;\n  --green-800: 142.8 64.2% 24.1%;\n  --green-900: 143.8 61.2% 20.2%;\n  --green-950: 144.9 80.4% 10% /* Emerald */;\n  --emerald-50: 151.8 81% 95.9%;\n  --emerald-100: 149.3 80.4% 90%;\n  --emerald-200: 152.4 76% 80.4%;\n  --emerald-300: 156.2 71.6% 66.9%;\n  --emerald-400: 158.1 64.4% 51.6%;\n  --emerald-500: 160.1 84.1% 39.4%;\n  --emerald-600: 161.4 93.5% 30.4%;\n  --emerald-700: 162.9 93.5% 24.3%;\n  --emerald-800: 163.1 88.1% 19.8%;\n  --emerald-900: 164.2 85.7% 16.5%;\n  --emerald-950: 165.7 91.3% 9% /* Teal */;\n  --teal-50: 166.2 76.5% 96.7%;\n  --teal-100: 167.2 85.5% 89.2%;\n  --teal-200: 168.4 83.8% 78.2%;\n  --teal-300: 170.6 76.9% 64.3%;\n  --teal-400: 172.5 66% 50.4%;\n  --teal-500: 173.4 80.4% 40%;\n  --teal-600: 174.7 83.9% 31.6%;\n  --teal-700: 175.3 77.4% 26.1%;\n  --teal-800: 176.1 69.4% 21.8%;\n  --teal-900: 175.9 60.8% 19%;\n  --teal-950: 178.6 84.3% 10% /* Cyan */;\n  --cyan-50: 183.2 100% 96.3%;\n  --cyan-100: 185.1 95.9% 90.4%;\n  --cyan-200: 186.2 93.5% 81.8%;\n  --cyan-300: 187 92.4% 69%;\n  --cyan-400: 187.9 85.7% 53.3%;\n  --cyan-500: 188.7 94.5% 42.7%;\n  --cyan-600: 191.6 91.4% 36.5%;\n  --cyan-700: 192.9 82.3% 31%;\n  --cyan-800: 194.4 69.6% 27.1%;\n  --cyan-900: 196.4 63.6% 23.7%;\n  --cyan-950: 197 78.9% 14.9% /* Sky */;\n  --sky-50: 204 100% 97.1%;\n  --sky-100: 204 93.8% 93.7%;\n  --sky-200: 200.6 94.4% 86.1%;\n  --sky-300: 199.4 95.5% 73.9%;\n  --sky-400: 198.4 93.2% 59.6%;\n  --sky-500: 198.6 88.7% 48.4%;\n  --sky-600: 200.4 98% 39.4%;\n  --sky-700: 201.3 96.3% 32.2%;\n  --sky-800: 201 90% 27.5%;\n  --sky-900: 202 80.3% 23.9%;\n  --sky-950: 204 80.2% 15.9% /* Blue */;\n  --blue-50: 213.8 100% 96.9%;\n  --blue-100: 214.3 94.6% 92.7%;\n  --blue-200: 213.3 96.9% 87.3%;\n  --blue-300: 211.7 96.4% 78.4%;\n  --blue-400: 213.1 93.9% 67.8%;\n  --blue-500: 217.2 91.2% 59.8%;\n  --blue-600: 221.2 83.2% 53.3%;\n  --blue-700: 224.3 76.3% 48%;\n  --blue-800: 225.9 70.7% 40.2%;\n  --blue-900: 224.4 64.3% 32.9%;\n  --blue-950: 226.2 57% 21% /* Indigo */;\n  --indigo-50: 225.9 100% 96.7%;\n  --indigo-100: 226.5 100% 93.9%;\n  --indigo-200: 228 96.5% 88.8%;\n  --indigo-300: 229.7 93.5% 81.8%;\n  --indigo-400: 234.5 89.5% 73.9%;\n  --indigo-500: 238.7 83.5% 66.7%;\n  --indigo-600: 243.4 75.4% 58.6%;\n  --indigo-700: 244.5 57.9% 50.6%;\n  --indigo-800: 243.7 54.5% 41.4%;\n  --indigo-900: 242.2 47.4% 34.3%;\n  --indigo-950: 243.8 47.1% 20% /* Violet */;\n  --violet-50: 250 100% 97.6%;\n  --violet-100: 251.4 91.3% 95.5%;\n  --violet-200: 250.5 95.2% 91.8%;\n  --violet-300: 252.5 94.7% 85.1%;\n  --violet-400: 255.1 91.7% 76.3%;\n  --violet-500: 258.3 89.5% 66.3%;\n  --violet-600: 262.1 83.3% 57.8%;\n  --violet-700: 263.4 70% 50.4%;\n  --violet-800: 263.4 69.3% 42.2%;\n  --violet-900: 263.5 67.4% 34.9%;\n  --violet-950: 261.2 72.6% 22.9% /* Purple */;\n  --purple-50: 270 100% 98%;\n  --purple-100: 268.7 100% 95.5%;\n  --purple-200: 268.6 100% 91.8%;\n  --purple-300: 269.2 97.4% 85.1%;\n  --purple-400: 270 95.2% 75.3%;\n  --purple-500: 270.7 91% 65.1%;\n  --purple-600: 271.5 81.3% 55.9%;\n  --purple-700: 272.1 71.7% 47.1%;\n  --purple-800: 272.9 67.2% 39.4%;\n  --purple-900: 273.6 65.6% 32%;\n  --purple-950: 273.5 86.9% 21% /* Fuchsia */;\n  --fuchsia-50: 289.1 100% 97.8%;\n  --fuchsia-100: 287 100% 95.5%;\n  --fuchsia-200: 288.3 95.8% 90.6%;\n  --fuchsia-300: 291.1 93.1% 82.9%;\n  --fuchsia-400: 292 91.4% 72.5%;\n  --fuchsia-500: 292.2 84.1% 60.6%;\n  --fuchsia-600: 293.4 69.5% 48.8%;\n  --fuchsia-700: 294.7 72.4% 39.8%;\n  --fuchsia-800: 295.4 70.2% 32.9%;\n  --fuchsia-900: 296.7 63.6% 28%;\n  --fuchsia-950: 296.8 90.2% 16.1% /* Pink */;\n  --pink-50: 327.3 73.3% 97.1%;\n  --pink-100: 325.7 77.8% 94.7%;\n  --pink-200: 325.9 84.6% 89.8%;\n  --pink-300: 327.4 87.1% 81.8%;\n  --pink-400: 328.6 85.5% 70.2%;\n  --pink-500: 330.4 81.2% 60.4%;\n  --pink-600: 333.3 71.4% 50.6%;\n  --pink-700: 335.1 77.6% 42%;\n  --pink-800: 335.8 74.4% 35.3%;\n  --pink-900: 335.9 69% 30.4%;\n  --pink-950: 336.2 83.9% 17.1% /* Rose */;\n  --rose-50: 355.7 100% 97.3%;\n  --rose-100: 355.6 100% 94.7%;\n  --rose-200: 352.7 96.1% 90%;\n  --rose-300: 352.6 95.7% 81.8%;\n  --rose-400: 351.3 94.5% 71.4%;\n  --rose-500: 349.7 89.2% 60.2%;\n  --rose-600: 346.8 77.2% 49.8%;\n  --rose-700: 345.3 82.7% 40.8%;\n  --rose-800: 343.4 79.7% 34.7%;\n  --rose-900: 341.5 75.5% 30.4%;\n  --rose-950: 343.1 87.7% 15.9%;\n}\n#ctl00 > center {\n  padding: 1rem !important;\n}\n.documents-container {\n  display: flex;\n  flex-direction: column;\n  gap: 1.5rem;\n  max-width: 100%;\n  margin: 0 auto;\n  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;\n}\n.category-container {\n  border: 1px solid  hsl(var(--neutral-200));\n  border-radius: 12px;\n  overflow: hidden;\n  background: #fff;\n}\n.category-header {\n  background: #fff;\n  border-bottom: 1px solid  hsl(var(--neutral-200));\n  padding: 1rem 1.25rem;\n  font-weight: 600;\n  color: hsl(var(--slate-900));\n  font-size: 1.05rem;\n}\n.category-actions {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.documents-page-title {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.75rem;\n  flex-wrap: wrap;\n}\n.documents-toolbar {\n  display: flex;\n  justify-content: flex-end;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0 1rem;\n  margin-bottom: 0.75rem;\n}\n.documents-toolbar-inline {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.5rem;\n  margin-left: auto;\n}\n.category-read-all,\n.documents-read-all {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n  padding: 0.35rem 0.85rem;\n  border-radius: 9999px;\n  font-size: 0.75rem;\n  font-weight: 600;\n  border: 1px solid rgba(148,163,184,0.35);\n  background: #fff;\n  color: hsl(var(--slate-600));\n  cursor: pointer;\n  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;\n}\n.category-read-all.is-active,\n.documents-read-all.is-active {\n  border-color: rgba(239,68,68,0.35);\n  background: rgba(239,68,68,0.08);\n  color: #ef4444;\n}\n.category-read-all.is-active:hover,\n.documents-read-all.is-active:hover {\n  background: rgba(239,68,68,0.16);\n}\n.category-read-all:disabled,\n.documents-read-all:disabled {\n  cursor: default;\n  color: hsl(var(--neutral-500));\n  border-color: rgba(148,163,184,0.25);\n  background: hsl(var(--neutral-100));\n}\n.documents-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));\n  gap: 1rem;\n  padding: 1rem;\n  background: hsl(var(--neutral-50));\n}\n.doc-unread-indicator {\n  position: absolute;\n  top: 0.75rem;\n  right: 0.75rem;\n  display: flex;\n  align-items: center;\n  gap: 0.35rem;\n  font-size: 0.7rem;\n  font-weight: 600;\n  color: #ef4444;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  white-space: nowrap;\n}\n.doc-unread-dot {\n  width: 0.5rem;\n  height: 0.5rem;\n  border-radius: 50%;\n  background: #ef4444;\n}\nbody > table:nth-child(8) > tbody > tr.trBandeau > td:nth-child(2),\n#tblExplicationsEtudiant,\n#ctl00 > center > table:nth-child(4) {\n  display: none;\n}\n`, \"\"]);\n// Exports\nexport default ___CSS_LOADER_EXPORT___;\n");

/***/ }),

/***/ 417:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("// Imports\nimport ___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___ from \"../../../node_modules/.pnpm/css-loader@7.1.2_webpack@5.96.1/node_modules/css-loader/dist/runtime/noSourceMaps.js\";\nimport ___CSS_LOADER_API_IMPORT___ from \"../../../node_modules/.pnpm/css-loader@7.1.2_webpack@5.96.1/node_modules/css-loader/dist/runtime/api.js\";\nvar ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___);\n// Module\n___CSS_LOADER_EXPORT___.push([module.id, `:root {\n/* Slate */\n  --slate-50: 210 40% 98%;\n  --slate-100: 210 40% 96.1%;\n  --slate-200: 214.3 31.8% 91.4%;\n  --slate-300: 212.7 26.8% 83.9%;\n  --slate-400: 215 20.2% 65.1%;\n  --slate-500: 215.4 16.3% 46.9%;\n  --slate-600: 215.3 19.3% 34.5%;\n  --slate-700: 215.3 25% 26.7%;\n  --slate-800: 217.2 32.6% 17.5%;\n  --slate-900: 222.2 47.4% 11.2%;\n  --slate-950: 228.6 84% 4.9% /* Gray */;\n  --gray-50: 210 20% 98%;\n  --gray-100: 220 14.3% 95.9%;\n  --gray-200: 220 13% 91%;\n  --gray-300: 216 12.2% 83.9%;\n  --gray-400: 217.9 10.6% 64.9%;\n  --gray-500: 220 8.9% 46.1%;\n  --gray-600: 215 13.8% 34.1%;\n  --gray-700: 216.9 19.1% 26.7%;\n  --gray-800: 215 27.9% 16.9%;\n  --gray-900: 220.9 39.3% 11%;\n  --gray-950: 224 71.4% 4.1% /* Zinc */;\n  --zinc-50: 0 0% 98%;\n  --zinc-100: 240 4.8% 95.9%;\n  --zinc-200: 240 5.9% 90%;\n  --zinc-300: 240 4.9% 83.9%;\n  --zinc-400: 240 5% 64.9%;\n  --zinc-500: 240 3.8% 46.1%;\n  --zinc-600: 240 5.2% 33.9%;\n  --zinc-700: 240 5.3% 26.1%;\n  --zinc-800: 240 3.7% 15.9%;\n  --zinc-900: 240 5.9% 10%;\n  --zinc-950: 240 10% 3.9% /* Neutral */;\n  --neutral-50: 0 0% 98%;\n  --neutral-100: 0 0% 96.1%;\n  --neutral-200: 0 0% 89.8%;\n  --neutral-300: 0 0% 83.1%;\n  --neutral-400: 0 0% 63.9%;\n  --neutral-500: 0 0% 45.1%;\n  --neutral-600: 0 0% 32.2%;\n  --neutral-700: 0 0% 25.1%;\n  --neutral-800: 0 0% 14.9%;\n  --neutral-900: 0 0% 9%;\n  --neutral-950: 0 0% 3.9% /* Stone */;\n  --stone-50: 60 9.1% 97.8%;\n  --stone-100: 60 4.8% 95.9%;\n  --stone-200: 20 5.9% 90%;\n  --stone-300: 24 5.7% 82.9%;\n  --stone-400: 24 5.4% 63.9%;\n  --stone-500: 25 5.3% 44.7%;\n  --stone-600: 33.3 5.5% 32.4%;\n  --stone-700: 30 6.3% 25.1%;\n  --stone-800: 12 6.5% 15.1%;\n  --stone-900: 24 9.8% 10%;\n  --stone-950: 20 14.3% 4.1% /* Red */;\n  --red-50: 0 85.7% 97.3%;\n  --red-100: 0 93.3% 94.1%;\n  --red-200: 0 96.3% 89.4%;\n  --red-300: 0 93.5% 81.8%;\n  --red-400: 0 90.6% 70.8%;\n  --red-500: 0 84.2% 60.2%;\n  --red-600: 0 72.2% 50.6%;\n  --red-700: 0 73.7% 41.8%;\n  --red-800: 0 70% 35.3%;\n  --red-900: 0 62.8% 30.6%;\n  --red-950: 0 74.7% 15.5% /* Orange */;\n  --orange-50: 33.3 100% 96.5%;\n  --orange-100: 34.3 100% 91.8%;\n  --orange-200: 32.1 97.7% 83.1%;\n  --orange-300: 30.7 97.2% 72.4%;\n  --orange-400: 27 96% 61%;\n  --orange-500: 24.6 95% 53.1%;\n  --orange-600: 20.5 90.2% 48.2%;\n  --orange-700: 17.5 88.3% 40.4%;\n  --orange-800: 15 79.1% 33.7%;\n  --orange-900: 15.3 74.6% 27.8%;\n  --orange-950: 13 81.1% 14.5% /* Amber */;\n  --amber-50: 48 100% 96.1%;\n  --amber-100: 48 96.5% 88.8%;\n  --amber-200: 48 96.6% 76.7%;\n  --amber-300: 45.9 96.7% 64.5%;\n  --amber-400: 43.3 96.4% 56.3%;\n  --amber-500: 37.7 92.1% 50.2%;\n  --amber-600: 32.1 94.6% 43.7%;\n  --amber-700: 26 90.5% 37.1%;\n  --amber-800: 22.7 82.5% 31.4%;\n  --amber-900: 21.7 77.8% 26.5%;\n  --amber-950: 20.9 91.7% 14.1% /* Yellow */;\n  --yellow-50: 54.5 91.7% 95.3%;\n  --yellow-100: 54.9 96.7% 88%;\n  --yellow-200: 52.8 98.3% 76.9%;\n  --yellow-300: 50.4 97.8% 63.5%;\n  --yellow-400: 47.9 95.8% 53.1%;\n  --yellow-500: 45.4 93.4% 47.5%;\n  --yellow-600: 40.6 96.1% 40.4%;\n  --yellow-700: 35.5 91.7% 32.9%;\n  --yellow-800: 31.8 81% 28.8%;\n  --yellow-900: 28.4 72.5% 25.7%;\n  --yellow-950: 26 83.3% 14.1% /* Lime */;\n  --lime-50: 78.3 92% 95.1%;\n  --lime-100: 79.6 89.1% 89.2%;\n  --lime-200: 80.9 88.5% 79.6%;\n  --lime-300: 82 84.5% 67.1%;\n  --lime-400: 82.7 78% 55.5%;\n  --lime-500: 83.7 80.5% 44.3%;\n  --lime-600: 84.8 85.2% 34.5%;\n  --lime-700: 85.9 78.4% 27.3%;\n  --lime-800: 86.3 69% 22.7%;\n  --lime-900: 87.6 61.2% 20.2%;\n  --lime-950: 89.3 80.4% 10% /* Green */;\n  --green-50: 138.5 76.5% 96.7%;\n  --green-100: 140.6 84.2% 92.5%;\n  --green-200: 141 78.9% 85.1%;\n  --green-300: 141.7 76.6% 73.1%;\n  --green-400: 141.9 69.2% 58%;\n  --green-500: 142.1 70.6% 45.3%;\n  --green-600: 142.1 76.2% 36.3%;\n  --green-700: 142.4 71.8% 29.2%;\n  --green-800: 142.8 64.2% 24.1%;\n  --green-900: 143.8 61.2% 20.2%;\n  --green-950: 144.9 80.4% 10% /* Emerald */;\n  --emerald-50: 151.8 81% 95.9%;\n  --emerald-100: 149.3 80.4% 90%;\n  --emerald-200: 152.4 76% 80.4%;\n  --emerald-300: 156.2 71.6% 66.9%;\n  --emerald-400: 158.1 64.4% 51.6%;\n  --emerald-500: 160.1 84.1% 39.4%;\n  --emerald-600: 161.4 93.5% 30.4%;\n  --emerald-700: 162.9 93.5% 24.3%;\n  --emerald-800: 163.1 88.1% 19.8%;\n  --emerald-900: 164.2 85.7% 16.5%;\n  --emerald-950: 165.7 91.3% 9% /* Teal */;\n  --teal-50: 166.2 76.5% 96.7%;\n  --teal-100: 167.2 85.5% 89.2%;\n  --teal-200: 168.4 83.8% 78.2%;\n  --teal-300: 170.6 76.9% 64.3%;\n  --teal-400: 172.5 66% 50.4%;\n  --teal-500: 173.4 80.4% 40%;\n  --teal-600: 174.7 83.9% 31.6%;\n  --teal-700: 175.3 77.4% 26.1%;\n  --teal-800: 176.1 69.4% 21.8%;\n  --teal-900: 175.9 60.8% 19%;\n  --teal-950: 178.6 84.3% 10% /* Cyan */;\n  --cyan-50: 183.2 100% 96.3%;\n  --cyan-100: 185.1 95.9% 90.4%;\n  --cyan-200: 186.2 93.5% 81.8%;\n  --cyan-300: 187 92.4% 69%;\n  --cyan-400: 187.9 85.7% 53.3%;\n  --cyan-500: 188.7 94.5% 42.7%;\n  --cyan-600: 191.6 91.4% 36.5%;\n  --cyan-700: 192.9 82.3% 31%;\n  --cyan-800: 194.4 69.6% 27.1%;\n  --cyan-900: 196.4 63.6% 23.7%;\n  --cyan-950: 197 78.9% 14.9% /* Sky */;\n  --sky-50: 204 100% 97.1%;\n  --sky-100: 204 93.8% 93.7%;\n  --sky-200: 200.6 94.4% 86.1%;\n  --sky-300: 199.4 95.5% 73.9%;\n  --sky-400: 198.4 93.2% 59.6%;\n  --sky-500: 198.6 88.7% 48.4%;\n  --sky-600: 200.4 98% 39.4%;\n  --sky-700: 201.3 96.3% 32.2%;\n  --sky-800: 201 90% 27.5%;\n  --sky-900: 202 80.3% 23.9%;\n  --sky-950: 204 80.2% 15.9% /* Blue */;\n  --blue-50: 213.8 100% 96.9%;\n  --blue-100: 214.3 94.6% 92.7%;\n  --blue-200: 213.3 96.9% 87.3%;\n  --blue-300: 211.7 96.4% 78.4%;\n  --blue-400: 213.1 93.9% 67.8%;\n  --blue-500: 217.2 91.2% 59.8%;\n  --blue-600: 221.2 83.2% 53.3%;\n  --blue-700: 224.3 76.3% 48%;\n  --blue-800: 225.9 70.7% 40.2%;\n  --blue-900: 224.4 64.3% 32.9%;\n  --blue-950: 226.2 57% 21% /* Indigo */;\n  --indigo-50: 225.9 100% 96.7%;\n  --indigo-100: 226.5 100% 93.9%;\n  --indigo-200: 228 96.5% 88.8%;\n  --indigo-300: 229.7 93.5% 81.8%;\n  --indigo-400: 234.5 89.5% 73.9%;\n  --indigo-500: 238.7 83.5% 66.7%;\n  --indigo-600: 243.4 75.4% 58.6%;\n  --indigo-700: 244.5 57.9% 50.6%;\n  --indigo-800: 243.7 54.5% 41.4%;\n  --indigo-900: 242.2 47.4% 34.3%;\n  --indigo-950: 243.8 47.1% 20% /* Violet */;\n  --violet-50: 250 100% 97.6%;\n  --violet-100: 251.4 91.3% 95.5%;\n  --violet-200: 250.5 95.2% 91.8%;\n  --violet-300: 252.5 94.7% 85.1%;\n  --violet-400: 255.1 91.7% 76.3%;\n  --violet-500: 258.3 89.5% 66.3%;\n  --violet-600: 262.1 83.3% 57.8%;\n  --violet-700: 263.4 70% 50.4%;\n  --violet-800: 263.4 69.3% 42.2%;\n  --violet-900: 263.5 67.4% 34.9%;\n  --violet-950: 261.2 72.6% 22.9% /* Purple */;\n  --purple-50: 270 100% 98%;\n  --purple-100: 268.7 100% 95.5%;\n  --purple-200: 268.6 100% 91.8%;\n  --purple-300: 269.2 97.4% 85.1%;\n  --purple-400: 270 95.2% 75.3%;\n  --purple-500: 270.7 91% 65.1%;\n  --purple-600: 271.5 81.3% 55.9%;\n  --purple-700: 272.1 71.7% 47.1%;\n  --purple-800: 272.9 67.2% 39.4%;\n  --purple-900: 273.6 65.6% 32%;\n  --purple-950: 273.5 86.9% 21% /* Fuchsia */;\n  --fuchsia-50: 289.1 100% 97.8%;\n  --fuchsia-100: 287 100% 95.5%;\n  --fuchsia-200: 288.3 95.8% 90.6%;\n  --fuchsia-300: 291.1 93.1% 82.9%;\n  --fuchsia-400: 292 91.4% 72.5%;\n  --fuchsia-500: 292.2 84.1% 60.6%;\n  --fuchsia-600: 293.4 69.5% 48.8%;\n  --fuchsia-700: 294.7 72.4% 39.8%;\n  --fuchsia-800: 295.4 70.2% 32.9%;\n  --fuchsia-900: 296.7 63.6% 28%;\n  --fuchsia-950: 296.8 90.2% 16.1% /* Pink */;\n  --pink-50: 327.3 73.3% 97.1%;\n  --pink-100: 325.7 77.8% 94.7%;\n  --pink-200: 325.9 84.6% 89.8%;\n  --pink-300: 327.4 87.1% 81.8%;\n  --pink-400: 328.6 85.5% 70.2%;\n  --pink-500: 330.4 81.2% 60.4%;\n  --pink-600: 333.3 71.4% 50.6%;\n  --pink-700: 335.1 77.6% 42%;\n  --pink-800: 335.8 74.4% 35.3%;\n  --pink-900: 335.9 69% 30.4%;\n  --pink-950: 336.2 83.9% 17.1% /* Rose */;\n  --rose-50: 355.7 100% 97.3%;\n  --rose-100: 355.6 100% 94.7%;\n  --rose-200: 352.7 96.1% 90%;\n  --rose-300: 352.6 95.7% 81.8%;\n  --rose-400: 351.3 94.5% 71.4%;\n  --rose-500: 349.7 89.2% 60.2%;\n  --rose-600: 346.8 77.2% 49.8%;\n  --rose-700: 345.3 82.7% 40.8%;\n  --rose-800: 343.4 79.7% 34.7%;\n  --rose-900: 341.5 75.5% 30.4%;\n  --rose-950: 343.1 87.7% 15.9%;\n}\n.descSection > span:first-child {\n  margin-left: 0 !important;\n}\n.dlsCal {\n  top: 0 !important;\n}\n/* Title styling */\nh1.classes-titre {\n  padding: 0 !important;\n  margin-top: 1rem !important;\n}\n.section-centre {\n  display: flex !important;\n  flex-direction: column !important;\n  gap: 0.5rem !important;\n  padding: 1rem 2rem !important;\n}\n/* Classes wrapper flex layout */\n.classes-wrapper.materialize-wrapper {\n  display: flex !important;\n  flex-wrap: wrap !important;\n  width: 100% !important;\n  gap: 20px !important;\n  padding: 20px !important;\n  margin: 0 auto !important;\n  max-width: 1400px !important;\n  padding: 0 !important;\n}\n/* Make course cards flex items */\n.classes-wrapper.materialize-wrapper > * {\n  flex: 1 1 300px !important;\n  min-width: 300px !important;\n  max-width: 400px !important;\n  margin: 0 !important;\n}\n/* Improve main content area and right section in menu */\n.td-menu {\n  background: #fff;\n  box-shadow: 0 1px 3px rgba(0,0,0,0.1);\n  padding: 10px;\n}\n.section-droite {\n  margin-top: 20px !important;\n  border-top: 1px solid #e0e0e0 !important;\n  padding-top: 20px !important;\n  height: 25vh !important;\n  overflow-y: auto !important;\n}\n/* Hide unnecessary decorative elements */\nimg[src*='/cvir/UI/Theme/Lea_Defaut/Images/'],\n.table-plug-skytech,\n.UnInstantClassVirtuelle {\n  display: none !important;\n}\n/* Improve course links */\n.contenuMenuGroupeLEASelectV3estdMenuV2 {\n  background: #fff !important;\n  padding: 10px !important;\n  margin: 5px 0 !important;\n  border-radius: 4px !important;\n  border: 1px solid #e0e0e0 !important;\n  transition: background-color 0.2s !important;\n}\n.contenuMenuGroupeLEASelectV3estdMenuV2:hover {\n  background: #f8f9fa !important;\n}\n#cntFormulaire_mioInfoTile,\n#cntFormulaire_leaInfoTile {\n  display: none !important;\n}\n/* Optimize sidebar container */\n.trBandeau > td:first-child {\n  padding: 0 16px !important;\n}\n.trBandeau {\n  position: sticky !important;\n  top: 56px !important;\n}\ntd#spLeftSize {\n  padding-top: 0 !important;\n}\n/* Lea and Mio buttons */\n#region-raccourcis-services-skytech {\n  padding: 20px !important;\n  display: flex !important;\n  flex-direction: row !important;\n  gap: 16px !important;\n  justify-content: center !important;\n  margin: 0 !important;\n}\n#region-raccourcis-services-skytech * {\n  box-sizing: content-box !important;\n}\n#region-raccourcis-services-skytech .raccourci {\n  padding: 1rem !important;\n  background: #fff !important;\n  border-radius: 12px !important;\n  border: 1px solid #e0e0e0 !important;\n  transition: all 0.2s ease !important;\n  text-decoration: none !important;\n  min-width: 120px !important;\n  display: flex !important;\n  flex-direction: row !important;\n  justify-content: space-between !important;\n  align-items: center !important;\n  gap: 8px !important;\n  width: 50% !important;\n  box-shadow: 0 1px 2px 0  hsl(var(--neutral-100)) !important;\n}\n#region-raccourcis-services-skytech .raccourci:hover {\n  background: #f8f9fa !important;\n  transform: translateY(-2px) !important;\n  box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;\n}\n#region-raccourcis-services-skytech .svg-icon {\n  width: 24px !important;\n  height: 24px !important;\n  opacity: 0.8 !important;\n  border-radius: 4px !important;\n  margin: 0 !important;\n  padding: 0.5rem !important;\n}\n#region-raccourcis-services-skytech .titre {\n  font-weight: 500 !important;\n  color: #2c3e50 !important;\n  padding: 0 !important;\n}\n#region-raccourcis-services-skytech .raccourci .svg-icon {\n  box-shadow: 0 0 0 1px  hsl(var(--neutral-200)) !important;\n}\n/* Optimize card panel */\n.card-panel.section-spacing {\n  box-shadow: 0 1px 2px 0  hsl(var(--neutral-200)) !important;\n  border: 1px solid  hsl(var(--neutral-300)) !important;\n}\n.cvirContenuCVIR {\n  padding: 0 !important;\n}\n/* =================================================\nLEFT MENU\n================================================ */\n.parent-menu-gauche {\n  padding: 0 !important;\n  margin: 0 !important;\n}\n.menu-section-title {\n  padding: 10px 0 !important;\n  text-align: left !important;\n  margin: 0;\n  font-size: 16px;\n  font-weight: bold;\n  color: #4a951f;\n}\n.trMenuPrincipal > td:first-child {\n  padding: 0 !important;\n}\n.infoCGNoCours {\n  font-size: 1.2rem;\n  letter-spacing: -0.02em;\n}\n.cgSelect,\n.cgBg {\n  background-image: none !important;\n}\n.cgBg div {\n  margin: 0 !important;\n}\n.cgSelect {\n  margin: 0.5rem 0 !important;\n  display: flex !important;\n  justify-content: center !important;\n  align-items: center !important;\n  background: hsl(var(--slate-50)) !important;\n  padding: 0.5rem 0 !important;\n  border-radius: 0.5rem !important;\n}\n.cgSelect table {\n  margin: 0 !important;\n}\n/* Remove text shadow effect in cgSelect */\n.cgSelect font,\n.cvirLienCoursShadow font {\n  display: none !important;\n}\n/* Adjust the original text styling */\n.cgSelect a,\n.cvirLienCoursShadow {\n  position: static !important;\n  left: 0 !important;\n  color: #2c3e50 !important /* Or any color you prefer */;\n  font-weight: 500 !important;\n}\n/* Semester selector styling improvements */\n.cgSelect {\n  background: #fff !important;\n  border: 1px solid #e0e0e0 !important;\n  border-radius: 8px !important;\n  padding: 12px 16px !important;\n  margin: 8px 0 !important;\n  box-shadow: 0 1px 3px rgba(0,0,0,0.05) !important;\n}\n.cgSelect-table {\n  width: 100% !important;\n}\n/* Style the semester and class selection links */\n.cgSelect a {\n  color: #2c3e50 !important;\n  font-size: 15px !important;\n  font-weight: 500 !important;\n  text-decoration: none !important;\n  transition: color 0.2s ease !important;\n}\n.cgSelect a:hover {\n  color: #4a951f !important /* Green accent color on hover */;\n}\n/* Remove the text shadow effect more cleanly */\n.cgSelect font {\n  display: none !important;\n}\n/* Adjust spacing between semester and class selection */\n.cgSelect td {\n  padding: 0 8px !important;\n}\n/* Add subtle separator between semester and class selection */\n.cgSelect td:last-child {\n  border-left: 1px solid #e0e0e0 !important;\n  padding-left: 16px !important;\n}\nbody > table:nth-child(8) > tbody > tr.trBandeau > td.td-menu > div.parent-menu-gauche > table:nth-child(2) > tbody > tr:nth-child(4) > td > table > tbody > tr > td:nth-child(2) {\n  text-align: center !important;\n  padding: 0 !important;\n}\n#divChoixCoursGroupeCoursMenuV2,\n#tblChoixCoursGroupeSession {\n  margin-top: 1.1rem !important;\n}\n/* Menu items base styles and hover effect */\n.tdMenuNonSelectionneMesClasses a,\n.tdMenuNonSelectionneMesClasses span,\n.tdMenuNonSelectionneSeulMesClasses a,\n.tdMenuNonSelectionneSeulMesClasses span,\n.tdMenuNonSelectionneMesServices a,\n.tdMenuNonSelectionneMesServices span,\n.tdMenuNonSelectionneSeulMesServices a,\n.tdMenuNonSelectionneSeulMesServices span,\n.tdMenuSelectionneMesClasses a,\n.tdMenuSelectionneMesClasses span,\n.tdMenuSelectionneSeulMesClasses a,\n.tdMenuSelectionneSeulMesClasses span,\n.tdMenuSelectionneMesServices a,\n.tdMenuSelectionneMesServices span,\n.tdMenuSelectionneSeulMesServices a,\n.tdMenuSelectionneSeulMesServices span,\n.tdMenuNonAccessibleMesClasses a,\n.tdMenuNonAccessibleMesClasses span,\n.tdMenuNonAccessibleMesServices a,\n.tdMenuNonAccessibleMesServices span,\n.tdMenuNonSelectionneSeulAssi a,\n.tdMenuNonSelectionneSeulAssi span,\n.tdMenuNonSelectionneAssisPedMenu a,\n.tdMenuNonSelectionneAssisPedMenu span,\n.tdMenuSelectionneSeulAssi a,\n.tdMenuSelectionneSeulAssi span,\n.tdMenuSelectionneAssisPedMenu a,\n.tdMenuSelectionneAssisPedMenu span {\n  padding: 0.5rem 0px !important;\n  transition: background-color 0.2s ease !important;\n  display: block !important;\n  border-radius: 0.5rem !important;\n}\n/* Hover effect */\n.tdMenuNonSelectionneMesClasses a:hover,\n.tdMenuNonSelectionneSeulMesClasses a:hover,\n.tdMenuNonSelectionneMesServices a:hover,\n.tdMenuNonSelectionneSeulMesServices a:hover,\n.tdMenuSelectionneMesClasses a:hover,\n.tdMenuSelectionneSeulMesClasses a:hover,\n.tdMenuSelectionneMesServices a:hover,\n.tdMenuSelectionneSeulMesServices a:hover,\n.tdMenuNonAccessibleMesClasses a:hover,\n.tdMenuNonAccessibleMesServices a:hover,\n.tdMenuNonSelectionneSeulAssi a:hover,\n.tdMenuNonSelectionneAssisPedMenu a:hover,\n.tdMenuSelectionneSeulAssi a:hover,\n.tdMenuSelectionneAssisPedMenu a:hover {\n  background-color: rgba(0,0,0,0.05) !important;\n}\n.sousMenuTable,\n.sousMenuTable table,\n.tdMenuNonSelectionneMesClasses,\n.tdMenuNonSelectionneSeulMesClasses {\n  background-image: none !important;\n}\n/* Hide \"My services\" table */\nbody > table:nth-child(8) > tbody > tr.trBandeau > td.td-menu > div.parent-menu-gauche > table:nth-child(5),\nbody > table:nth-child(8) > tbody > tr.trBandeau > td.td-menu > div.parent-menu-gauche > table:nth-child(6) {\n  display: none !important;\n}\n/* Optimize calendar section */\n.descSection > span:first-child {\n  padding-right: 0 !important;\n}\n/* Flex menu */\n.flex-menu {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  padding: 8px;\n}\n.flex-menu-item {\n  position: relative;\n}\n.flex-menu-item > a {\n  display: block;\n  padding: 8px 16px;\n  text-decoration: none;\n  color: inherit;\n  border-radius: 4px;\n  transition: background-color 0.2s ease;\n  text-align: left !important;\n}\n.flex-menu-item > a:hover {\n  background-color: rgba(0,0,0,0.05);\n}\n.flex-submenu {\n  display: none;\n  position: absolute;\n  left: 50%;\n  top: 0;\n  background: #fff;\n  border: 1px solid #e0e0e0;\n  border-radius: 4px;\n  box-shadow: 0 2px 8px rgba(0,0,0,0.1);\n  min-width: 200px;\n  z-index: 28e !important;\n}\n.flex-menu-item:hover .flex-submenu {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  padding: 4px;\n}\n.flex-submenu-item a {\n  display: block;\n  padding: 8px 16px;\n  text-decoration: none;\n  color: inherit;\n  border-radius: 4px;\n  transition: background-color 0.2s ease;\n  white-space: nowrap;\n}\n.flex-submenu-item a:hover {\n  background-color: rgba(0,0,0,0.05);\n}\n`, \"\"]);\n// Exports\nexport default ___CSS_LOADER_EXPORT___;\n");

/***/ }),

/***/ 978:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./basic.styl": 609,
	"./colors.styl": 597,
	"./lea/assignments.styl": 484,
	"./lea/documents.styl": 732,
	"./lea/home.styl": 417
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 978;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";

;// ./src/modules/styles.js
// Import all Stylus files from the styles directory
const stylusModules = __webpack_require__(978);

function injectStyles() {
    // Add font preconnect links
    const preconnectGoogle = document.createElement('link');
    preconnectGoogle.rel = 'preconnect';
    preconnectGoogle.href = 'https://fonts.googleapis.com';
    
    const preconnectGstatic = document.createElement('link');
    preconnectGstatic.rel = 'preconnect';
    preconnectGstatic.href = 'https://fonts.gstatic.com';
    preconnectGstatic.crossOrigin = 'anonymous';
    
    const fontStylesheet = document.createElement('link');
    fontStylesheet.rel = 'stylesheet';
    fontStylesheet.href = 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap';

    // Append font links to head
    document.head.appendChild(preconnectGoogle);
    document.head.appendChild(preconnectGstatic);
    document.head.appendChild(fontStylesheet);

    // Add Tailwind CSS Play CDN
    const tailwindScript = document.createElement('script');
    tailwindScript.src = 'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4';
    document.head.appendChild(tailwindScript);

    // Remove problematic rules from Tailwind's default styles
    tailwindScript.addEventListener('load', () => {
        const styleTags = document.head.querySelectorAll('style');
        if (styleTags.length > 0) {
            const lastStyleTag = styleTags[styleTags.length - 1];
            if (lastStyleTag.textContent) {
                // Remove the box-sizing reset that breaks existing styles
                lastStyleTag.textContent = lastStyleTag.textContent.replace(
                    /\*,\s*::after,\s*::before,\s*::backdrop,\s*::file-selector-button\s*\{[^}]*box-sizing:\s*border-box;[^}]*\}/g,
                    ''
                );
                // Remove problematic img/video height: auto rule
                lastStyleTag.textContent = lastStyleTag.textContent.replace(
                    /img,\s*video\s*\{([^}]*?)height:\s*auto;([^}]*?)\}/g,
                    'img, video {$1$2}'
                );
            }
        }
    });

    // Original style injection code
    const styles = stylusModules.keys()
        .map(key => {
            const module = stylusModules(key);
            const cssMatch = module.default.match(/`([^`]+)`/);
            return cssMatch ? cssMatch[1] : '';
        })
        .join('\n');

    if (styles) {
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }
}
;// ./src/modules/lea/home.js
// Function to remove &nbsp; from table text
function removeNbspFromTable() {
	const cgSelectTable = document.querySelector(".cgSelect-table");
	if (cgSelectTable) {
		// Get all text nodes in the table
		const walker = document.createTreeWalker(
			cgSelectTable,
			NodeFilter.SHOW_TEXT,
			null,
			false
		);

		let node;
		while ((node = walker.nextNode())) {
			// Replace &nbsp; with regular space
			node.textContent = node.textContent.replace(/\u00A0/g, " ").trim();
		}
	}
}

// Function to move the Calendar header
function moveCalendarHeader() {
	// Find the calendar header element
	const calendarLink = document.querySelector(".dlsCal");

	// Find the target section-droite div
	const sectionDroite = document.querySelector(".section-droite");

	if (calendarLink && sectionDroite) {
		// Create a new div to hold the calendar header
		const newHeader = document.createElement("div");
		newHeader.className = "calendar-header";
		newHeader.style.cssText =
			"padding: 10px; font-size: 16px; font-weight: bold;";

		// Move the calendar link to the new header
		newHeader.appendChild(calendarLink);

		// Insert the new header at the beginning of section-droite
		sectionDroite.insertBefore(newHeader, sectionDroite.firstChild);
	}
}

function convertMenuToFlex() {
	// Find the main menu table
	const menuTable = document.querySelector(".tblMenuStyleXPDeuxNiveaux");
	if (!menuTable) return;

	// Create new flex container
	const flexMenu = document.createElement("div");
	flexMenu.className = "flex-menu";

	// Get all menu items (tr elements with class trMenuPrincipal)
	const menuItems = menuTable.querySelectorAll(".trMenuPrincipal");

	menuItems.forEach((item) => {
		// Create container for menu item
		const menuItem = document.createElement("div");
		menuItem.className = "flex-menu-item";

		// Get the link and submenu
		const link = item.querySelector("a");
		const submenu = item.querySelector(".divContenuMenu");

		if (link) {
			// Clone the link to preserve event listeners
			const newLink = link.cloneNode(true);
			menuItem.appendChild(newLink);
		}

		if (submenu) {
			// Create flex submenu
			const flexSubmenu = document.createElement("div");
			flexSubmenu.className = "flex-submenu";

			// Get all submenu links
			const submenuLinks = submenu.querySelectorAll("a");
			submenuLinks.forEach((subLink) => {
				const subItem = document.createElement("div");
				subItem.className = "flex-submenu-item";
				const newSubLink = subLink.cloneNode(true);
				subItem.appendChild(newSubLink);
				flexSubmenu.appendChild(subItem);
			});

			menuItem.appendChild(flexSubmenu);
		}

		flexMenu.appendChild(menuItem);
	});

	// Replace original table with flex menu
	menuTable.parentNode.replaceChild(flexMenu, menuTable);
}

function setCustomCourseColors() {
	// Default colors if none are set
	const defaultColors = {
		// "201-SF5-RE": "#df8e1d", // Discrete Math
		// "201-SN2-RE": "#d20f39", // Calculus
		// "345-101-MQ": "#40a02b", // Humanities
		// "420-SF1-RE": "#04a5e5", // Programming
		// "602-101-MQ": "#fe640b", // French
		// "603-101-MQ": "#ea76cb", // English
	};

	const storedColors = JSON.parse(localStorage.getItem("courseColors") || "{}");
	const courseColors = { ...defaultColors, ...storedColors };

	// Apply colors to each course card
	document.querySelectorAll(".card-panel-header").forEach((header) => {
		const titleElement = header.querySelector(".card-panel-title");
		if (!titleElement) return;

		const courseCode = Object.keys(courseColors).find((code) =>
			titleElement.textContent.trim().startsWith(code)
		);

		if (courseCode) {
			header.style.backgroundColor = courseColors[courseCode];
		}
	});

	return courseColors;
}

// Function to move title outside wrapper
function moveElementsOutsideWrapper() {
	const wrapper = document.querySelector(".classes-wrapper");
	const title = wrapper?.querySelector("h1.classes-titre");
	if (wrapper && title) {
		wrapper.parentNode.insertBefore(title, wrapper);
	}
}

// Function to move "My classes" title
function moveMyClassesTitle() {
	const menuParent = document.querySelector(".parent-menu-gauche");
	const myClassesTitle = menuParent?.querySelector(".titre-menu-middle");
	if (menuParent && myClassesTitle) {
		const newHeading = document.createElement("h2");
		newHeading.textContent = myClassesTitle.textContent;
		newHeading.className = "menu-section-title";

		const firstTable = menuParent.querySelector("table");
		if (firstTable) {
			menuParent.insertBefore(newHeading, firstTable);
			const titleRow = myClassesTitle.closest("tr");
			if (titleRow) {
				titleRow.style.display = "none";
			}
		}
	}
}

// Function to move right section
function moveRightSection() {
	const rightSection = document.querySelector(".section-droite");
	const menuArea = document.querySelector(".td-menu");
	if (rightSection && menuArea) {
		menuArea.appendChild(rightSection);
	}
}

// Function to remove br tags
function removeBrTags() {
	const trBandeau = document.querySelector(".trBandeau");
	if (trBandeau) {
		const brTags = trBandeau.getElementsByTagName("br");
		while (brTags.length > 0) {
			brTags[0].remove();
		}
	}
}

;// ./src/modules/lea/documents.js
function optimizeCourseDocuments() {
	const documentsTable = document.querySelector("#tblDocuments");
	if (!documentsTable) return;

	const resolveDocumentUrl = (anchor) => {
		if (!anchor) return null;
		const hrefAttr = anchor.getAttribute("href") || "";
		const patterns = [
			/'(Visualise(?:Document|Video)\.aspx[^']*)'/i,
			/"(Visualise(?:Document|Video)\.aspx[^"]*)"/i,
			/(Visualise(?:Document|Video)\.aspx[^'"]*)/i,
		];

		for (const pattern of patterns) {
			const match = hrefAttr.match(pattern);
			if (match?.[1]) return match[1];
		}

		if (hrefAttr && !hrefAttr.startsWith("javascript:")) {
			return hrefAttr;
		}

		return null;
	};

	const toAbsoluteUrl = (url) => {
		if (!url) return null;
		try {
			return new URL(url, window.location.href).toString();
		} catch {
			return null;
		}
	};

	const createButton = (className) => {
		const button = document.createElement("button");
		button.type = "button";
		button.className = className;
		return button;
	};

	const setButtonInteractiveState = (button, disabled) => {
		button.disabled = disabled;
		button.classList.toggle("is-active", !disabled);
	};

	const mainContainer = document.createElement("div");
	mainContainer.className = "documents-container";

	const centerContainer = document.querySelector("#ctl00 > center");

	centerContainer?.querySelectorAll("br").forEach((br) => {
		br.remove();
	});

	const allEntries = [];

	const markEntryRemote = async (entry) => {
		if (!entry.isUnread) return;

		if (entry.viewUrl) {
			try {
				await fetch(entry.viewUrl, { credentials: "include" });
			} catch (error) {
				console.warn("Unable to mark document as read automatically", error);
			}
		}

		entry.markLocal();
	};

	const categories = documentsTable.querySelectorAll(".CategorieDocument");

	categories.forEach((category) => {
		const categoryContainer = document.createElement("div");
		categoryContainer.className = "category-container";

		const categoryHeader = document.createElement("div");
		categoryHeader.className = "category-header flex items-center justify-between gap-3 flex-wrap";

		const categoryTitle =
			category.querySelector(".DisDoc_TitreCategorie")?.textContent?.trim() ||
			"Documents";

		const headerTitle = document.createElement("span");
		headerTitle.className = "text-left";
		headerTitle.textContent = categoryTitle;
		categoryHeader.appendChild(headerTitle);
        
		categoryContainer.appendChild(categoryHeader);

		const gridContainer = document.createElement("div");
		gridContainer.className = "documents-grid";

		const documentRows = category.querySelectorAll(
			".itemDataGrid, .itemDataGridAltern"
		);

		const docEntries = [];

		documentRows.forEach((row) => {
			const title = row
				.querySelector(".lblTitreDocumentDansListe")
				?.textContent?.trim();
			const date = row
				.querySelector(".DocDispo")
				?.textContent?.trim()
				.replace("since", "")
				.trim();
			const fileLink = row.querySelector(".colVoirTelecharger a");
			const fileIcon = row.querySelector(".colVoirTelecharger img");
			const fileSize = row
				.querySelector(".colVoirTelecharger")
				?.textContent?.trim()
				.split("\n")
				.pop()
				?.trim();
			const isUnread = Boolean(row.querySelector(".classeEtoileNouvDoc"));

			if (!title || !fileLink) return;

			const originalHref = fileLink.getAttribute("href") || "";
			const originalTarget = fileLink.getAttribute("target") || "";

			const viewUrl = resolveDocumentUrl(fileLink);
			const absoluteViewUrl = toAbsoluteUrl(viewUrl);

			const fallbackUrl =
				originalHref && !originalHref.toLowerCase().startsWith("javascript:")
					? fileLink.href
					: null;

			const docCard = document.createElement("a");
			docCard.className =
				"flex flex-col items-start gap-4 justify-between p-4 bg-white rounded-xl border border-neutral-200 shadow-sm shadow-neutral-100 transition-all duration-200 relative hover:-translate-y-0.5 hover:border-neutral-300 no-underline group";

			const cardHref = absoluteViewUrl || fallbackUrl || "#";
			docCard.href = cardHref;

			if (originalTarget) {
				docCard.target = originalTarget;
				if (originalTarget === "_blank") {
					docCard.rel = "noopener noreferrer";
				}
			}

			const unreadBadge = isUnread
				? `<span class="absolute top-3 right-3 flex items-center gap-1.5 text-xs font-semibold text-red-600 tracking-wide leading-none whitespace-nowrap rounded-full bg-red-800/5 px-2 py-1" role="status" aria-label="Unread document">
					<span class="uppercase">Unread</span>
					<span class="w-2 h-2 rounded-full bg-red-600" aria-hidden="true"></span>
				</span>`
				: "";

			docCard.innerHTML = `
				<div class="flex flex-col gap-4">
					${unreadBadge}
					<div class="flex-shrink-0 w-6 h-6 flex items-center justify-center">
						${fileIcon ? `<img src="${fileIcon.src}" alt="File type" class="w-6 h-6 object-contain">` : ""}
					</div>

				</div>
				<div class="w-full flex flex-col gap-2">
                    <div class="text-base font-semibold text-slate-900 no-underline tracking-tight leading-tight text-left group-hover:text-red-800 text-neutral-600">${title}</div>
					<div class="flex justify-between items-center w-full">
						${date ? `<span class="text-xs text-neutral-500">${date}</span>` : ""}
						${fileSize ? `<span class="text-xs text-neutral-500">${fileSize}</span>` : ""}
					</div>
				</div>
			`;

			const entry = {
				card: docCard,
				viewUrl: absoluteViewUrl,
				isUnread,
				listeners: new Set(),
			};

			entry.markLocal = () => {
				if (!entry.isUnread) return;
				entry.isUnread = false;
				const indicator = entry.card.querySelector('[role="status"]');
				if (indicator) indicator.remove();
				entry.listeners.forEach((listener) => listener(entry));
			};

			entry.addListener = (listener) => {
				if (typeof listener === "function") {
					entry.listeners.add(listener);
				}
			};

			docCard.addEventListener("click", (event) => {
				if (!absoluteViewUrl && originalHref.toLowerCase().startsWith("javascript:")) {
					event.preventDefault();
					try {
						// eslint-disable-next-line no-eval
						window.eval(originalHref.replace(/^javascript:/i, ""));
					} catch (error) {
						console.warn("Unable to trigger document handler", error);
					}
				}

				window.requestAnimationFrame(() => entry.markLocal());
			});

			docEntries.push(entry);
			allEntries.push(entry);
			gridContainer.appendChild(docCard);
		});

		if (docEntries.length) {
			const actions = document.createElement("div");
			actions.className = "category-actions";

			const readAllButton = createButton("category-read-all");
			readAllButton.textContent = "Mark all read";
			setButtonInteractiveState(readAllButton, true);

			const updateCategoryButton = () => {
				if (readAllButton.dataset.state === "busy") return;

				const unreadCount = docEntries.filter((entry) => entry.isUnread).length;
				if (!unreadCount) {
					setButtonInteractiveState(readAllButton, true);
					readAllButton.textContent = "All read";
					return;
				}

				setButtonInteractiveState(readAllButton, false);
				readAllButton.textContent =
					unreadCount === docEntries.length
						? `Mark all read (${unreadCount})`
						: `Mark as read (${unreadCount})`;
			};

			readAllButton.addEventListener("click", async () => {
				const unreadEntries = docEntries.filter((entry) => entry.isUnread);
				if (!unreadEntries.length) return;

				readAllButton.dataset.state = "busy";
				setButtonInteractiveState(readAllButton, true);
				readAllButton.textContent = "Marking…";

				for (const entry of unreadEntries) {
					// eslint-disable-next-line no-await-in-loop
					await markEntryRemote(entry);
				}

				delete readAllButton.dataset.state;
				updateCategoryButton();
			});

			docEntries.forEach((entry) => entry.addListener(updateCategoryButton));
			updateCategoryButton();

			actions.appendChild(readAllButton);
			categoryHeader.appendChild(actions);
		}

		categoryContainer.appendChild(gridContainer);
		mainContainer.appendChild(categoryContainer);
	});

	if (allEntries.length) {
		const readAllButton = createButton("documents-read-all");
		readAllButton.textContent = "Mark all read";
		setButtonInteractiveState(readAllButton, true);

		const updateToolbarButton = () => {
			if (readAllButton.dataset.state === "busy") return;

			const unreadCount = allEntries.filter((entry) => entry.isUnread).length;
			if (!unreadCount) {
				setButtonInteractiveState(readAllButton, true);
				readAllButton.textContent = "All read";
				return;
			}

			setButtonInteractiveState(readAllButton, false);
			readAllButton.textContent = `Mark all read (${unreadCount})`;
		};

		readAllButton.addEventListener("click", async () => {
			const unreadEntries = allEntries.filter((entry) => entry.isUnread);
			if (!unreadEntries.length) return;

			readAllButton.dataset.state = "busy";
			setButtonInteractiveState(readAllButton, true);
			readAllButton.textContent = "Marking…";

			for (const entry of unreadEntries) {
				// eslint-disable-next-line no-await-in-loop
				await markEntryRemote(entry);
			}

			delete readAllButton.dataset.state;
			updateToolbarButton();
		});

		allEntries.forEach((entry) => entry.addListener(updateToolbarButton));
		updateToolbarButton();

		const pageTitleLine = document.querySelector(".TitrePageLigne1");
		if (pageTitleLine) {
			pageTitleLine.classList.add("documents-page-title");
			const inlineControls = document.createElement("span");
			inlineControls.className = "documents-toolbar-inline";
			inlineControls.appendChild(readAllButton);
			pageTitleLine.appendChild(inlineControls);
		} else {
			const toolbar = document.createElement("div");
			toolbar.className = "documents-toolbar";
			toolbar.appendChild(readAllButton);
			mainContainer.insertBefore(toolbar, mainContainer.firstChild);
		}
	}

	// Replace table with new container
	documentsTable.parentNode.replaceChild(mainContainer, documentsTable);
}

;// ./src/modules/lea/assignments.js
function optimizeAssignmentsList() {
    // Add debug logging
    console.log('Optimizing assignments list...');
    
    // Find the main assignments table (the outer one)
    const mainTable = document.querySelector('table[width="550"]');
    if (!mainTable) {
        console.log('No main table found');
        return;
    }

    // Find the inner assignments table
    const assignmentsTable = document.querySelector('#tabListeTravEtu');
    if (!assignmentsTable) {
        console.log('No assignments table found');
        return;
    }

    // Create main container
    const pageContainer = document.createElement('div');
    pageContainer.className = 'assignments-page';

    // Move the title elements
    const titleElements = document.querySelectorAll('.TitrePageLigne1, .TitrePageLigne2');
    const titleContainer = document.createElement('div');
    titleContainer.className = 'page-header';
    titleElements.forEach(el => {
        titleContainer.appendChild(el.cloneNode(true));
    });
    pageContainer.appendChild(titleContainer);

    // Create assignments container
    const mainContainer = document.createElement('div');
    mainContainer.className = 'assignments-container';
    
    // Process each category
    const categories = [];
    let currentCategory = null;

    assignmentsTable.querySelectorAll('tr').forEach(row => {
        // Skip header rows
        if (row.querySelector('.EnteteListTabTravauxEtu')) {
            return;
        }

        const categoryTitle = row.querySelector('.TitreCategorie');
        if (categoryTitle) {
            currentCategory = {
                title: categoryTitle.textContent.trim() || 'Assignments',
                assignments: []
            };
            categories.push(currentCategory);
            return;
        }

        const assignmentLink = row.querySelector('a[onclick*="OpenCentre"]');
        if (!assignmentLink) {
            return;
        }

        if (!currentCategory) {
            currentCategory = {
                title: 'Assignments',
                assignments: []
            };
            categories.push(currentCategory);
        }

        const assignmentData = extractAssignmentFromRow(row, assignmentLink);
        if (assignmentData) {
            currentCategory.assignments.push(assignmentData);
        }
    });

    const populatedCategories = categories.filter(category => category.assignments.length > 0);

    // Create the new grid-based interface
    if (populatedCategories.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'assignments-empty-state';
        emptyState.innerHTML = `
            <div class="empty-title">No assignments to display</div>
            <div class="empty-subtitle">Check back later for new assignments.</div>
        `;
        mainContainer.appendChild(emptyState);
    } else {
        populatedCategories.forEach(category => {
            const categoryContainer = document.createElement('div');
            categoryContainer.className = 'category-container';

            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'category-header';
            categoryHeader.textContent = category.title;
            categoryContainer.appendChild(categoryHeader);

            const assignmentsGrid = document.createElement('div');
            assignmentsGrid.className = 'assignments-grid';

            category.assignments.forEach(assignment => {
                const assignmentCard = document.createElement('div');
                assignmentCard.className = `assignment-card ${assignment.isUnread ? 'unread' : ''} ${assignment.isSubmitted ? 'submitted' : ''}`;

                const cardClickHandler = createCardClickHandler(assignment.onClickAttribute);
                if (cardClickHandler) {
                    assignmentCard.addEventListener('click', cardClickHandler);
                    assignmentCard.addEventListener('keydown', event => {
                        if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            cardClickHandler();
                        }
                    });
                    assignmentCard.setAttribute('role', 'button');
                    assignmentCard.tabIndex = 0;
                    assignmentCard.style.cursor = 'pointer';
                }

                const formattedDueDate = formatDate(assignment.dueDate, assignment.dueText);
                const relativeDueDate = formatRelativeDate(assignment.dueDate);
                const isOverdueAssignment = !assignment.isSubmitted && isOverdue(assignment.dueDate);

                assignmentCard.innerHTML = `
                    <div class="assignment-header">
                        <div class="assignment-title-row">
                            <span class="assignment-title">${assignment.title}</span>
                            ${createStatusIndicators(assignment)}
                        </div>
                        ${assignment.dueText ? `
                            <div class="due-date ${isOverdueAssignment ? 'overdue' : ''}">
                                <span class="due-label">Due:</span>
                                <span class="date">${formattedDueDate}</span>
                                ${!isOverdueAssignment && relativeDueDate ? `
                                    <span class="relative-date-badge">${relativeDueDate}</span>
                                ` : ''}
                            </div>
                        ` : ''}
                    </div>
                    <div class="assignment-details">
                        ${assignment.submissionMethod ? `
                            <div class="submission-info">
                                <span class="label">Submit via:</span>
                                <span class="method">${assignment.submissionMethod}</span>
                            </div>
                        ` : ''}
                        ${assignment.statusLabel !== '-' ? `
                            <div class="status-info">
                                <span class="label">Status:</span>
                                <span class="status ${assignment.isSubmitted ? 'submitted' : ''}">${assignment.statusLabel}</span>
                            </div>
                        ` : ''}
                    </div>
                   
                `;
                assignmentsGrid.appendChild(assignmentCard);
            });

            categoryContainer.appendChild(assignmentsGrid);
            mainContainer.appendChild(categoryContainer);
        });
    }

    pageContainer.appendChild(mainContainer);

    // Replace the entire table with the new container
    const centerElement = document.querySelector('center');
    if (centerElement) {
        // Remove all children from center
        while (centerElement.firstChild) {
            centerElement.removeChild(centerElement.firstChild);
        }
        // Add our new container
        centerElement.appendChild(pageContainer);
    }
}

function extractAssignmentFromRow(row, linkElement) {
    const title = linkElement.textContent ? linkElement.textContent.trim() : '';
    const onClickAttribute = linkElement.getAttribute('onclick') || '';
    const linkMatch = onClickAttribute.match(/OpenCentre\('([^']+)'/);
    const link = linkMatch ? linkMatch[1] : null;

    const cells = Array.from(row.children).filter(cell => cell.tagName === 'TD');
    const dueCell = cells[2] || null;
    const statusCell = cells[3] || null;

    const submissionMethod = dueCell?.querySelector('.RemTrav_Sommaire_ProchainsTravauxDesc')?.textContent?.trim() || null;

    let dueText = null;
    if (dueCell) {
        const primarySpan = Array.from(dueCell.querySelectorAll('span')).find(span => !span.classList.contains('RemTrav_Sommaire_ProchainsTravauxDesc'));
        const rawDueText = primarySpan?.textContent ?? dueCell.textContent ?? '';
        const cleanedDueText = normalizeWhitespace(rawDueText);
        if (cleanedDueText) {
            if (submissionMethod) {
                const normalizedMethod = normalizeWhitespace(submissionMethod);
                dueText = cleanedDueText.replace(normalizedMethod, '').trim();
            } else {
                dueText = cleanedDueText;
            }
        }
    }

    let statusLabel = '-';
    if (statusCell) {
        const normalizedStatus = normalizeWhitespace(statusCell.textContent);
        if (normalizedStatus) {
            statusLabel = normalizedStatus;
        }
    }

    const isSubmitted = /submitted|remise\s*ok|remis/i.test(statusLabel);
    const isUnread = row.querySelector('.CellEnonceNonVisualise img[src*="TravailNonVisualise"]') !== null;
    const dueDate = parseDueDate(dueText);

    if (!title || !link) {
        return null;
    }

    return {
        title,
        link,
        onClickAttribute,
        dueText,
        dueDate,
        submissionMethod,
        statusLabel,
        isSubmitted,
        isUnread
    };
}

function createCardClickHandler(rawOnClick) {
    if (!rawOnClick) {
        return null;
    }

    try {
        const handler = new Function(rawOnClick);
        return () => {
            try {
                const scope = typeof window !== 'undefined' ? window : globalThis;
                handler.call(scope);
            } catch (error) {
                console.error('Failed to execute assignment handler', error);
            }
        };
    } catch (error) {
        console.error('Failed to create assignment handler', error);
        return null;
    }
}

function normalizeWhitespace(value) {
    return typeof value === 'string'
        ? value.replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim()
        : '';
}

function parseDueDate(rawText) {
    if (!rawText) {
        return null;
    }

    const sanitized = normalizeWhitespace(rawText);
    if (!sanitized) {
        return null;
    }

    const nativeParsed = new Date(sanitized);
    if (!Number.isNaN(nativeParsed.getTime())) {
        return nativeParsed;
    }

    const normalized = sanitized
        .replace(/([A-Za-z\u00C0-\u017F]+)-(\d{1,2}),/u, '$1 $2,')
        .replace(/\s+at\s+/i, ' ');
    const normalizedParsed = new Date(normalized);
    if (!Number.isNaN(normalizedParsed.getTime())) {
        return normalizedParsed;
    }

    const match = sanitized.match(/([A-Za-z\u00C0-\u017F]+)-?(\d{1,2}),\s*(\d{4})(?:\s+at\s+(\d{1,2})(?::(\d{2}))?(?:\s*(am|pm))?)?/i);
    if (!match) {
        return null;
    }

    const monthToken = normalizeMonthToken(match[1]);
    const monthIndex = monthTokenToIndex(monthToken);
    if (monthIndex === null) {
        return null;
    }

    const day = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    let hour = match[4] ? parseInt(match[4], 10) : 0;
    const minute = match[5] ? parseInt(match[5], 10) : 0;
    const meridiem = match[6] ? match[6].toLowerCase() : null;

    if (meridiem === 'pm' && hour < 12) {
        hour += 12;
    } else if (meridiem === 'am' && hour === 12) {
        hour = 0;
    }

    const parsedDate = new Date(year, monthIndex, day, hour, minute);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function normalizeMonthToken(token) {
    return stripAccents(token).replace(/\./g, '').toLowerCase();
}

function monthTokenToIndex(token) {
    if (!token) {
        return null;
    }

    const monthMap = {
        jan: 0,
        january: 0,
        janv: 0,
        janvier: 0,
        feb: 1,
        february: 1,
        fev: 1,
        fevrier: 1,
        mar: 2,
        march: 2,
        mars: 2,
        apr: 3,
        april: 3,
        avr: 3,
        avril: 3,
        may: 4,
        mai: 4,
        jun: 5,
        june: 5,
        juin: 5,
        jul: 6,
        july: 6,
        juil: 6,
        juillet: 6,
        aug: 7,
        august: 7,
        aou: 7,
        aout: 7,
        sep: 8,
        sept: 8,
        september: 8,
        septembre: 8,
        oct: 9,
        october: 9,
        octobre: 9,
        nov: 10,
        november: 10,
        novembre: 10,
        dec: 11,
        december: 11,
        decembre: 11
    };

    if (token in monthMap) {
        return monthMap[token];
    }

    return null;
}

function stripAccents(value) {
    return value
        ? value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        : '';
}

function toDate(value) {
    if (!value) {
        return null;
    }

    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value;
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isOverdue(dateValue) {
    const dueDate = toDate(dateValue);
    if (!dueDate) {
        return false;
    }

    const now = new Date();
    return dueDate.getTime() < now.getTime();
}

function formatDate(dateValue, fallbackText = '') {
    const date = toDate(dateValue);
    if (!date) {
        return fallbackText;
    }

    const displayDate = new Date(date);
    if (displayDate.getHours() === 0 && displayDate.getMinutes() === 0) {
        displayDate.setHours(23, 59);
    }

    return displayDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
}

function formatRelativeDate(dateValue) {
    const date = toDate(dateValue);
    if (!date) {
        return null;
    }

    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
        return null;
    }

    if (diffDays === 1) {
        return 'Tomorrow';
    }

    if (diffDays < 7) {
        return `In ${diffDays} days`;
    }

    if (diffDays < 30) {
        return `${Math.floor(diffDays / 7)} weeks`;
    }

    return null;
}

function createStatusIndicators(assignment) {
    return `
        <div class="status-indicators">
            ${assignment.isUnread ? `
                <div class="indicator new-indicator" title="New">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-diamond-plus"><path d="M12 8v8"/><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0z"/><path d="M8 12h8"/></svg>
                </div>
            ` : ''}
            ${assignment.isSubmitted ? `
                <div class="indicator submitted-indicator" title="Submitted">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="m9 12 2 2 4-4"/>
                    </svg>
                </div>
            ` : ''}
            ${!assignment.isSubmitted && isOverdue(assignment.dueDate) ? `
                <div class="indicator overdue-indicator" title="Overdue">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alarm-clock-minus">
                        <circle cx="12" cy="13" r="8"/>
                        <path d="M5 3 2 6"/>
                        <path d="m22 6-3-3"/>
                        <path d="M6.38 18.7 4 21"/>
                        <path d="M17.64 18.67 20 21"/>
                        <path d="M9 13h6"/>
                    </svg>
                </div>
            ` : ''}
        </div>
    `;
}

;// ./src/modules/console.js
function logScriptInfo() {
    console.group("Script Information");
    
    // Create styled console log
    const styles = [
        'color: #2ecc71',
        'font-size: 14px',
        'font-weight: bold',
        'padding: 8px',
        'border-radius: 4px'
    ].join(';');

    console.log('%cOmnivox UI Optimizer', styles);
    console.log('Version:', GM_info.script.version);
    console.log('Author:', GM_info.script.author);
    console.log('Homepage:', GM_info.script.homepage);
    console.log('Description:', GM_info.script.description);
    console.groupEnd();
}

async function checkForUpdates() {
    try {
        // Use GM_xmlhttpRequest instead of fetch
        GM_xmlhttpRequest({
            method: 'GET',
            url: GM_info.script.updateURL,
            onload: function(response) {
                if (response.status === 200) {
                    const text = response.responseText;
                    // Extract version from meta.js
                    const versionMatch = text.match(/@version\s+([^\s]+)/);
                    if (versionMatch) {
                        const latestVersion = versionMatch[1];
                        const currentVersion = GM_info.script.version;
                        
                        if (latestVersion !== currentVersion) {
                            console.group("Update Available");
                            console.log(
                                `%cA new version (${latestVersion}) is available! You are running version ${currentVersion}.\nVisit ${GM_info.script.homepage} to update.`,
                                'color: #e67e22; font-weight: bold;'
                            );
                            console.groupEnd();
                        }
                    }
                }
            },
            onerror: function(error) {
                console.warn('Failed to check for updates:', error);
            }
        });
    } catch (error) {
        console.warn('Failed to check for updates:', error);
    }
}
;// ./src/index.js








(function () {
    'use strict';
  
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Omnivox UI Optimizer loaded');
        logScriptInfo();

        // Inject styles
        injectStyles();

        const currentUrl = window.location.href;
        console.log('Current URL:', currentUrl);

        // Call all home.js functions
        removeNbspFromTable();
        moveCalendarHeader();
        convertMenuToFlex();
        setCustomCourseColors();
        moveElementsOutsideWrapper();
        moveMyClassesTitle();
        moveRightSection();
        removeBrTags();

        // Optimize documents page
        if (currentUrl.includes('ListeDocuments.aspx') || currentUrl.includes('documents')) {
            console.log('Documents page detected');
            optimizeCourseDocuments();
        }


        // Optimize assignments page
        if (currentUrl.includes('ListeTravauxEtu.aspx') || currentUrl.includes('travaux')) {
            console.log('Assignments page detected');
            optimizeAssignmentsList();
        }

        // Check for updates
        checkForUpdates();

    });


})();

})();

/******/ })()
;
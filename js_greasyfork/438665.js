// ==UserScript==
// @name        beautiful-code
// @description 格式化并高亮代码块
// @namespace   github.com/backtolife2021
// @include     http*://*
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @require     https://unpkg.com/@vscode/vscode-languagedetection@1.0.21
// @require     https://unpkg.com/shiki@0.9.15/dist/index.unpkg.iife.js
// @require     https://unpkg.com/prettier@2.5.1/standalone.js
// @require     https://unpkg.com/prettier@2.5.1/parser-typescript.js
// @require     https://unpkg.com/prettier@2.5.1/parser-babel.js
// @version     1.0.1
// @homepage    https://github.com/backtolife2021/beautiful-code
// @author      backtolife
// @license     MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/438665/beautiful-code.user.js
// @updateURL https://update.greasyfork.org/scripts/438665/beautiful-code.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2022 backtolife2021

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/* globals VM shiki prettier globalThis["vscode-languagedetection"]*/
(function (VM, vscodeLanguagedetection, prettier, shiki) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var VM__default = /*#__PURE__*/_interopDefaultLegacy(VM);
    var prettier__default = /*#__PURE__*/_interopDefaultLegacy(prettier);
    var shiki__default = /*#__PURE__*/_interopDefaultLegacy(shiki);

    /**
     * @see https://github.com/microsoft/vscode-languagedetection#usage
     * @see https://github.com/microsoft/vscode/blob/3a1cf8e51e3797a2d9ccb12d207378de364596c4/src/vs/workbench/services/languageDetection/browser/languageDetectionService.ts#L59
     * @see https://unpkg.com/browse/@vscode/vscode-languagedetection@1.0.21/model/
     */
    const modulOperations = new vscodeLanguagedetection.ModelOperations({
        async modelJsonLoaderFunc() {
            const response = await fetch('https://unpkg.com/@vscode/vscode-languagedetection@1.0.21/model/model.json');
            const modelJSON = (await response.json());
            return modelJSON;
        },
        async weightsLoaderFunc() {
            const response = await fetch('https://unpkg.com/@vscode/vscode-languagedetection@1.0.21/model/group1-shard1of1.bin');
            const buffer = await response.arrayBuffer();
            return buffer;
        },
    });
    /**
     * @see https://github.com/shikijs/shiki/blob/main/docs/languages.md#all-languages
     * [
        {
            "languageId": "js",
            "confidence": 0.24262011051177979
        },
        {
            "languageId": "groovy",
            "confidence": 0.2068355679512024
        },
        {
            "languageId": "coffee",
            "confidence": 0.08538007736206055
        },
        {
            "languageId": "ts",
            "confidence": 0.07805327326059341
        },
        {
            "languageId": "lua",
            "confidence": 0.04159870371222496
        },
        {
            "languageId": "rb",
            "confidence": 0.03658360242843628
        },
        {
            "languageId": "r",
            "confidence": 0.03136871010065079
        },
        {
            "languageId": "swift",
            "confidence": 0.02843020297586918
        },
        {
            "languageId": "dart",
            "confidence": 0.025191379711031914
        },
        {
            "languageId": "php",
            "confidence": 0.02489558607339859
        },
        {
            "languageId": "scala",
            "confidence": 0.016375916078686714
        },
        {
            "languageId": "py",
            "confidence": 0.01570715941488743
        },
        {
            "languageId": "kt",
            "confidence": 0.014793860726058483
        },
        {
            "languageId": "cs",
            "confidence": 0.010329823940992355
        },
        {
            "languageId": "ps1",
            "confidence": 0.009833300486207008
        },
        {
            "languageId": "html",
            "confidence": 0.009663671255111694
        },
        {
            "languageId": "f90",
            "confidence": 0.00893926527351141
        },
        {
            "languageId": "json",
            "confidence": 0.008335321210324764
        },
        {
            "languageId": "mm",
            "confidence": 0.008064116351306438
        },
        {
            "languageId": "matlab",
            "confidence": 0.0077512627467513084
        },
        {
            "languageId": "md",
            "confidence": 0.007669923361390829
        },
        {
            "languageId": "java",
            "confidence": 0.006278263870626688
        },
        {
            "languageId": "clj",
            "confidence": 0.00619084807112813
        },
        {
            "languageId": "cpp",
            "confidence": 0.005193199031054974
        },
        {
            "languageId": "ex",
            "confidence": 0.004912080243229866
        },
        {
            "languageId": "cmake",
            "confidence": 0.004895167890936136
        },
        {
            "languageId": "rs",
            "confidence": 0.004293493460863829
        },
        {
            "languageId": "tex",
            "confidence": 0.0040983883664011955
        },
        {
            "languageId": "prolog",
            "confidence": 0.003859680611640215
        },
        {
            "languageId": "csv",
            "confidence": 0.0037101071793586016
        },
        {
            "languageId": "dm",
            "confidence": 0.003579826094210148
        },
        {
            "languageId": "c",
            "confidence": 0.003512203460559249
        },
        {
            "languageId": "jl",
            "confidence": 0.003408814314752817
        },
        {
            "languageId": "sql",
            "confidence": 0.002867681672796607
        },
        {
            "languageId": "css",
            "confidence": 0.002399126533418894
        },
        {
            "languageId": "bat",
            "confidence": 0.002297078724950552
        },
        {
            "languageId": "vba",
            "confidence": 0.002262661000713706
        },
        {
            "languageId": "go",
            "confidence": 0.002190779196098447
        },
        {
            "languageId": "ini",
            "confidence": 0.002004046691581607
        },
        {
            "languageId": "ml",
            "confidence": 0.001782393315806985
        },
        {
            "languageId": "erl",
            "confidence": 0.0016315156826749444
        },
        {
            "languageId": "xml",
            "confidence": 0.0015882366569712758
        },
        {
            "languageId": "pas",
            "confidence": 0.001484898617491126
        },
        {
            "languageId": "pm",
            "confidence": 0.0014668531948700547
        },
        {
            "languageId": "hs",
            "confidence": 0.0009900418808683753
        },
        {
            "languageId": "yaml",
            "confidence": 0.0007946646073833108
        },
        {
            "languageId": "asm",
            "confidence": 0.000721517251804471
        },
        {
            "languageId": "sh",
            "confidence": 0.0007181295077316463
        },
        {
            "languageId": "lisp",
            "confidence": 0.0006713239708915353
        },
        {
            "languageId": "cbl",
            "confidence": 0.0005515082157216966
        },
        {
            "languageId": "dockerfile",
            "confidence": 0.0005290511180646718
        },
        {
            "languageId": "makefile",
            "confidence": 0.0002923230640590191
        },
        {
            "languageId": "v",
            "confidence": 0.00028496066806837916
        },
        {
            "languageId": "toml",
            "confidence": 0.000118325486255344
        }
    ]
     */
    const langMap = new Map([['kt', 'kotlin']]);
    /**
     * @see https://github.com/shikijs/shiki#usage
     * @see https://github.com/shikijs/shiki/blob/main/docs/languages.md#all-languages
     */
    const highlight = () => {
        void shiki__default["default"]
            .getHighlighter({
            langs: [...shiki__default["default"].BUNDLED_LANGUAGES],
            theme: 'dracula',
        })
            .then((highlighter) => {
            // eslint-disable-next-line promise/no-nesting
            void Promise.all(Array.from(document.querySelectorAll('pre')).map(async (pre) => {
                if (pre.dataset.isHighlighted === 'true')
                    return void 0;
                const rawCodeText = pre.textContent ?? '';
                const result = await modulOperations.runModel(rawCodeText);
                const lang = result.at(0)?.languageId ?? 'tsx';
                const code = highlighter.codeToHtml((() => {
                    try {
                        /**
                         * @see https://prettier.io/docs/en/browser.html#global
                         */
                        return prettier__default["default"].format(rawCodeText, {
                            parser: 'babel-ts',
                            plugins: window.prettierPlugins,
                            semi: false,
                            trailingComma: 'all',
                            singleQuote: true,
                            arrowParens: 'always',
                            endOfLine: 'lf',
                        });
                    }
                    catch {
                        return rawCodeText;
                    }
                })(), { lang: langMap.get(lang) ?? lang });
                /**
                 * @see https://stackoverflow.com/a/67571022/11791657
                 */
                const range = document.createRange();
                const fragment = range.createContextualFragment(code
                    .replace('class="shiki"', () => 'class="shiki notranslate" data-is-highlighted="true"')
                    .replace('<code>', () => '<code style="background-color: transparent">'));
                pre.replaceWith(fragment);
            })).catch((err) => {
                console.error(err);
            });
        });
    };
    /**
     * @see https://violentmonkey.github.io/guide/observing-dom/
     */
    VM__default["default"].observe(document.body, () => {
        highlight();
        return false;
    });

})(VM, window["vscode-languagedetection"], prettier, shiki);
//# sourceMappingURL=production.user.js.map

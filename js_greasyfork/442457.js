// ==UserScript==
// @license      GNU GPLv3
// @name         Тёмная сторона
// @namespace    http://tampermonkey.net/
// @version      2.7.6
// @description  Выбери свою сторону!
// @author       Алексей Иващенко
// @include    /^https?:\/\/.*\.tinkoff.ru.*/
// @include    /^https?:\/\/.*\.tbank.ru.*/
// @include    /^https?:\/\/.*\.dev.t-tech.team.*/
// @include    /^https?:\/\/proc-builder.t-tech.team.*/
// @icon64       data:image/png;base64,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
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/442457/%D0%A2%D1%91%D0%BC%D0%BD%D0%B0%D1%8F%20%D1%81%D1%82%D0%BE%D1%80%D0%BE%D0%BD%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/442457/%D0%A2%D1%91%D0%BC%D0%BD%D0%B0%D1%8F%20%D1%81%D1%82%D0%BE%D1%80%D0%BE%D0%BD%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

const darkVersion = "2.7.6";
const minorUpdate = true;

function addStyle(styleString) {
	const style = document.createElement('style');
	style.textContent = styleString;
	style.setAttribute("id" , "dark_style");
	document.head.append(style);
}

addStyle(`
/* ------------------------------------------ DARK MODE ------------------------------------------ */

/* Цвета блоков
--------------------------------------------------------------------------------------------------
*/

body.dark-mode[palette="luna"] {
    --dside-orange: linear-gradient(180deg, #ff1d8c 0%, #e222e2 100%);
    --dside-orange-active: linear-gradient(180deg, #ff80bd 0%, #f08ef0 100%);
    --dside-orange-glow: drop-shadow(0px 0px 10px #ff99c8);
    --dside-orange-button: #cd1da0;
    --dside-orange-comment: #ff1d8c;

    --dside-green: linear-gradient(180deg, #4dff6e 35%, #00b38f 100%);
    --dside-green-active: linear-gradient(180deg, #b3ffc1 35%, #00ffcc 100%);
    --dside-green-glow: drop-shadow(0px 0px 10px #99ffe4);
    --dside-green-button: #31c968;
    --dside-green-comment: #4dff6e;

    --dside-blue: linear-gradient(180deg, #5b4dff 35%, #6800b3 100%);
    --dside-blue-active: linear-gradient(180deg, #8a80ff 35%, #9500ff 100%);
    --dside-blue-glow: drop-shadow(0px 0px 10px #dd99ff);
    --dside-blue-button: #5336cf;
    --dside-blue-comment: #5b4dff;

  /*  --dside-yellow: linear-gradient(180deg, #ffff4d 35%, #b3b300 100%);
    --dside-yellow-active: linear-gradient(180deg, #ffffb3 35%, #ffff00 100%);
    --dside-yellow-glow: drop-shadow(0px 0px 10px #ffff99);
    --dside-yellow-button: #c9c931;
    --dside-yellow-comment: #ffff4d;
*/
    --dside-yellow: linear-gradient(180deg, #ffff4d 5%, #5b4dff 100%);
    --dside-yellow-active: linear-gradient(180deg, #ffffb3 5%, #8a80ff 100%);
    --dside-yellow-glow: drop-shadow(0px 0px 10px #ffff99);
    --dside-yellow-button: #c9c931;
    --dside-yellow-comment: #b0ae74;

    --dside-diff-text: #818db1;
    --dside-diff: #202534;
    --dside-diff-hover: #30384f;
    --dside-diff-active: #444f6f;
    --dside-diff-border: #61709e;

    --dside-overlay: #00010a66;
    --canvas-shadow: drop-shadow(0px 6px 5px #00033366);

    --dside-lasso-border: #5740bf80;
    --dside-lasso-color: #5740bf40;

    --dark-background-main: #131d39;
    --dark-background-header: #20316040;
    --dark-scheme-text-color: #fff;
    --dark-scheme-text-color-transparent: #0006;
    --tui-base-01: #202534 !important;
    --tui-base-02: #202534 !important;
    --tui-base-04: #60709f !important;
    --tui-focus: #60709f !important;
    --tui-base-03: #262f4b !important;
    --tui-base-05: #3a4a78 !important;
    --tui-base-07: #262d4080 !important;
    --tui-secondary: #0a1224 !important;
    --tui-secondary-hover: #00081a !important;
    --tui-secondary-active: #0d1426 !important;
    --tui-primary: #9e6cff !important;
    --tui-primary-hover: #8350e6 !important;
    --tui-primary-active: #6937cb !important;

    --tui-elevation-01: #202534 !important;
    --tui-elevation-02: #202534 !important;

    --dark-context-background: #20316040;

    --syntax-line-bg: #0004;
    --syntax-line: #3a435f;
    --syntax-shadow: #00033366;

    --syntax-function : #00b38f;
    --syntax-base: #9fafdf;
    --syntax-variable: #8a80ff;
    --syntax-character: #fff;
    --syntax-error: #FF1D8C;

    --syntax-selectionBackground: #004080;
    --syntax-inactiveSelectionBackground: #2d4053;
}

body.dark-mode[palette="luna"] app-console-view > tui-expand > .t-wrapper > .content:before {
    visibility: visible;
}

body.dark-mode[palette="original_palette"] {
    --dside-orange: linear-gradient(180deg, #ff991d 0%, #e24b20 100%);
    --dside-orange-active: linear-gradient(180deg, #ffc680 0%, #f0a38e 100%);
    --dside-orange-glow: drop-shadow(0px 0px 10px #ffc680);
    --dside-orange-button: #F1721F;

    --dside-green: linear-gradient(180deg, #1dd74d 0%, #208a00 100%);
    --dside-green-active: linear-gradient(180deg, #80e99b 0%, #8ec374 100%);
    --dside-green-glow: drop-shadow(0px 0px 10px #80e99b);
    --dside-green-button: #1FB127;

    --dside-blue: linear-gradient(180deg, #4db3ff 35%, #0085b0 100%);
    --dside-blue-active: linear-gradient(180deg, #9bd4ff 35%, #74c1d6 100%);
    --dside-blue-glow: drop-shadow(0px 0px 10px #9bd4ff);
    --dside-blue-button: #279CD8;

    --dside-yellow: linear-gradient(180deg, #d7d71d 35%, #8a8a00 100%);
    --dside-yellow-active: linear-gradient(180deg, #e9e981 35%, #c3c374 100%);
    --dside-yellow-glow: drop-shadow(0px 0px 10px #e9e981);
    --dside-yellow-button: #f1f11e;

    --dside-diff-text: #888;
    --dside-diff: #444;
    --dside-diff-hover: #555;
    --dside-diff-active: #666;
    --dside-diff-border: #777;

    --dside-overlay: #000000bf;
    --canvas-shadow: drop-shadow(0px 6px 5px rgba(0, 0, 0, 0.3));

    --dside-lasso-border: #fff5;
    --dside-lasso-color: #fff4;

    --dark-background-main: #35363b;
    --dark-background-header: #292a2daa;
    --dark-scheme-text-color: #fff;
    --dark-scheme-text-color-transparent: #fff6;

    --dark-context-background: #303236ab;

    /* Syntax colors
    -------------------------------------------------------------------------
    */
    --syntax-base: #fff;
    --syntax-line: #5E5E5E;
    --syntax-line-bg: #0004;

    --syntax-function: #4db3ff;
    --syntax-variable: #1dd74d;
    --syntax-character: #fff;
    --syntax-argument: #ff991d;
    --syntax-string: #d7d71d;
    --syntax-error: #ff0000;

    --syntax-shadow: #0006;

    --syntax-selectionBackground: #004080;
    --syntax-inactiveSelectionBackground: #2d4053;
}

body.dark-mode[palette="flat_palette"] {
    --dside-orange: linear-gradient(180deg, #F1721F 0%, #F1721F 100%);
    --dside-orange-active: linear-gradient(180deg, #F8B587 0%, #F8B587 100%);
    --dside-orange-glow: drop-shadow(0px 0px 10px #F8B587);
    --dside-orange-button: #F1721F;

    --dside-green: linear-gradient(180deg, #1FB127 0%, #1FB127 100%);
    --dside-green-active: linear-gradient(180deg, #87D688 0%, #87D688 100%);
    --dside-green-glow: drop-shadow(0px 0px 10px #87D688);
    --dside-green-button: #1FB127;

    --dside-blue: linear-gradient(180deg, #279CD8 35%, #279CD8 100%);
    --dside-blue-active: linear-gradient(180deg, #88CBEB 35%, #88CBEB 100%);
    --dside-blue-glow: drop-shadow(0px 0px 10px #88CBEB);
    --dside-blue-button: #279CD8;

    --dside-yellow: linear-gradient(180deg, #b2b21f 35%, #b2b21f 100%);
    --dside-yellow-active: linear-gradient(180deg, #d5d585 35%, #d5d585 100%);
    --dside-yellow-glow: drop-shadow(0px 0px 10px #d5d585);
    --dside-yellow-button: #b2b21f;

    --dside-diff-text: #888;
    --dside-diff: #444;
    --dside-diff-hover: #555;
    --dside-diff-active: #666;
    --dside-diff-border: #777;

    --dside-overlay: #000000bf;
    --canvas-shadow: none;

    --dside-lasso-border: #fff5;
    --dside-lasso-color: #fff4;

    --dark-background-main: #35363b;
    --dark-background-header: #292a2daa;
    --dark-scheme-text-color: #fff;
    --dark-scheme-text-color-transparent: #fff6;

    --dark-context-background: #303236ab;

    /* Syntax colors
    -------------------------------------------------------------------------
    */

    --tui-base-01: #292a2d !important;

    --syntax-base: #fff;
    --syntax-line: #5E5E5E;
    --syntax-line-bg: #0004;

    --syntax-function: #4db3ff;
    --syntax-variable: #1dd74d;
    --syntax-character: #fff;
    --syntax-argument: #ff991d;
    --syntax-string: #d7d71d;
    --syntax-error: #ff0000;

    --syntax-shadow: #0006;
}

body.dark-mode[palette="pen_palette"] {
    --dside-orange: linear-gradient(180deg, #d7ab7c 0%, #d7ab7c 100%);
    --dside-orange-active: linear-gradient(180deg, #cd965b 0%, #cd965b 100%);
    --dside-orange-glow: drop-shadow(0px 0px 10px #cd965b);
    --dside-orange-button: #cd965b;

    --dside-green: linear-gradient(180deg, #508b36 0%, #508b36 100%);
    --dside-green-active: linear-gradient(180deg, #3e7a24 0%, #3e7a24 100%);
    --dside-green-glow: drop-shadow(0px 0px 10px #3e7a24);
    --dside-green-button: #3e7a24;

    --dside-blue: linear-gradient(180deg, #8ea6d7 35%, #8ea6d7 100%);
    --dside-blue-active: linear-gradient(180deg, #6d8ac5 35%, #6d8ac5 100%);
    --dside-blue-glow: drop-shadow(0px 0px 10px #6d8ac5);
    --dside-blue-button: #6d8ac5;

    --dside-yellow: linear-gradient(180deg, #8c8c36 35%, #8c8c36 100%);
    --dside-yellow-active: linear-gradient(180deg, #7a7a24 35%, #7a7a24 100%);
    --dside-yellow-glow: drop-shadow(0px 0px 10px #7a7a24);
    --dside-yellow-button: #7a7a24;

    --dside-diff-text: #888;
    --dside-diff: #444;
    --dside-diff-hover: #555;
    --dside-diff-active: #666;
    --dside-diff-border: #777;

    --dside-overlay: #000000bf;
    --canvas-shadow: none;

    --dside-lasso-border: #fff5;
    --dside-lasso-color: #fff4;

    --dark-background-main: #35363b;
    --dark-background-header: #292a2daa;
    --dark-scheme-text-color: #fff;
    --dark-scheme-text-color-transparent: #fff6;

    --dark-context-background: #303236ab;

    /* Syntax colors
    -------------------------------------------------------------------------
    */

    --tui-base-01: #292a2d !important;

    --syntax-base: #fff;
    --syntax-line: #5E5E5E;
    --syntax-line-bg: #0004;

    --syntax-function: #8ea6d7;
    --syntax-variable: #508b36;
    --syntax-argument: #d7ab7c;
    --syntax-string: #8c8c36;
    --syntax-error: #ff0000;

    --syntax-shadow: #0006;
}

body.dark-mode[palette="vanilla_palette"] {
    --dside-orange: linear-gradient(180deg, #f9b571 0%, #f9b571 100%);
    --dside-orange-active: linear-gradient(180deg, #f5800a 0%, #f5800a 100%);
    --dside-orange-glow: none;
    --dside-orange-button: #f9b571;

    --dside-green: linear-gradient(180deg, #61c46e 0%, #61c46e 100%);
    --dside-green-active: linear-gradient(180deg, #30823b 0%, #30823b 100%);
    --dside-green-glow: none;
    --dside-green-button: #61c46e;

    --dside-blue: linear-gradient(180deg, #84b9e6 35%, #84b9e6 100%);
    --dside-blue-active: linear-gradient(180deg, #2b85d4 35%, #2b85d4 100%);
    --dside-blue-glow: none;
    --dside-blue-button: #84b9e6;

    --dside-yellow: linear-gradient(180deg, #c4c45f 35%, #c4c45f 100%);
    --dside-yellow-active: linear-gradient(180deg, #828230 35%, #828230 100%);
    --dside-yellow-glow: drop-shadow(0px 0px 10px #828230);
    --dside-yellow-button: #c4c45f;

    --dside-diff-text: #888;
    --dside-diff: #444;
    --dside-diff-hover: #555;
    --dside-diff-active: #666;
    --dside-diff-border: #777;

    --dside-overlay: #000000bf;
    --canvas-shadow: none;

    --dside-lasso-border: #fff5;
    --dside-lasso-color: #fff4;

    --dark-background-main: #35363b;
    --dark-background-header: #292a2daa;
    --dark-scheme-text-color: #fff;
    --dark-scheme-text-color-transparent: #fff6;

    --dark-context-background: #303236ab;

    /* Syntax colors
    -------------------------------------------------------------------------
    */

    --tui-base-01: #292a2d !important;

    --syntax-base: #fff;
    --syntax-line: #5E5E5E;
    --syntax-line-bg: #0004;

    --syntax-function: #84b9e6;
    --syntax-variable: #61c46e;
    --syntax-character: #fff;
    --syntax-argument: #f9b571;
    --syntax-string: #c4c45f;
    --syntax-error: #ff0000;

    --syntax-shadow: #0006;
}

body.dark-mode[palette="pastel_palette"] {
    --dside-orange: linear-gradient(180deg, #faa454 0%, #faa454 100%);
    --dside-orange-active: linear-gradient(180deg, #ffc680 0%, #ffc680 100%);
    --dside-orange-glow: drop-shadow(0px 0px 10px #ffc680);
    --dside-orange-button: #faa454;

    --dside-green: linear-gradient(180deg, #9cff86 0%, #9cff86 100%);
    --dside-green-active: linear-gradient(180deg, #80e99b 0%, #80e99b 100%);
    --dside-green-glow: drop-shadow(0px 0px 10px #80e99b);
    --dside-green-button: #9cff86;

    --dside-blue: linear-gradient(180deg, #90afff 35%, #90afff 100%);
    --dside-blue-active: linear-gradient(180deg, #9bd4ff 35%, #9bd4ff 100%);
    --dside-blue-glow: drop-shadow(0px 0px 10px #9bd4ff);
    --dside-blue-button: #90afff;

    --dside-yellow: linear-gradient(180deg, #ffff85 35%, #ffff85 100%);
    --dside-yellow-active: linear-gradient(180deg, #e9e981 35%, #e9e981 100%);
    --dside-yellow-glow: drop-shadow(0px 0px 10px #e9e981);
    --dside-yellow-button: #ffff85;

    --dside-diff-text: #888;
    --dside-diff: #444;
    --dside-diff-hover: #555;
    --dside-diff-active: #666;
    --dside-diff-border: #777;

    --dside-overlay: #00000066;
    --canvas-shadow: none;

    --dside-lasso-border: #fff5;
    --dside-lasso-color: #fff4;

    --dark-background-main: #595959;
    --dark-background-header: #404040;
    --dark-scheme-text-color: #000;
    --dark-scheme-text-color-transparent: #0006;
    --tui-base-01: #404040 !important;
    --tui-secondary: #262626 !important;
    --tui-secondary-hover: #1a1a1a !important;

    --dark-context-background: #4d4d4dab;

    /* Syntax colors
    -------------------------------------------------------------------------
    */

    --tui-base-01: #292a2d !important;

    --syntax-base: #fff;
    --syntax-line: #5E5E5E;
    --syntax-line-bg: #0004;

    --syntax-function: #90afff;
    --syntax-variable: #9cff86;
    --syntax-character: #fff;
    --syntax-argument: #faa454;
    --syntax-string: #ffff85;
    --syntax-error: #ff0000;

    --syntax-shadow: #0006;
}

body.dark-mode[palette="luna"] [tuiWrapper][data-appearance=primary],
body.dark-mode[palette="original_palette"] [tuiWrapper][data-appearance=primary],
body.dark-mode[palette="flat_palette"] [tuiWrapper][data-appearance=primary],
body.dark-mode[palette="pen_palette"] [tuiWrapper][data-appearance=primary],
body.dark-mode[palette="vanilla_palette"] [tuiWrapper][data-appearance=primary],
body.dark-mode[palette="pastel_palette"] [tuiWrapper][data-appearance=primary] {
    color: #000;
}

/* Иконки тем
--------------------------------------------------------------------------------------------------
*/
body.dark-mode {
    --icon-custom_theme: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACZUlEQVR4nO2YOWhVQRSGv6gxKKI2QpC4xQURFAIRtLKxUnBtErGLNsEFRTCGdBZCIC5BVEQQLBQ70cqkkKR5iCmCAau4gGsjYhDRGB0ZOBeG4b773p25W/R+8Ff33Hn/ue/McgZKSkpK/jeagUvAO2BdHfGbgGdAPwXgKPAFUMAMsCwitgHoBr5L/H5yZC5wTYwEGo2I14k9NGIvkzP9lnmtU1VidwLvjbinwHxyYB7QDvQBf0ISWGvFNwEXrdjPwKqsS2UfcA/4GmI60POQiTpuxehEdmdlfBFwAngZYdqUXoG2GO93y6Q2Yy5kYXwOcMxYWeJoyvrCe4Bv8mxESjBVNgMVB+OmZoCTxphbgTfA8izW85+e5k1dN774krQn6UCCxpWh3jSNB+bvp2ReARNpmtfb+u0Ezb4WKUPTQGOWO6mrnki9a41Yz/QunDgHq+ykrrpijD1oPXuQtPk1NXZU5bj+HxFNWc9+A21JJvA4xUlbTeNJbWKHcjCvRKd9zTeFrBJZ6gew3SeBAzmaV6IPQKtrAucKkICSKljhkkBHAcwr45/QB8dYLAA+JWjio+f7lTzL6C6wUBpz1zGmXRJYbDXXrsdkfY4KOCzn/bjjvMWRvR7mh+UEG9bF6SWyCzgu7eREjbEe4cEdx05rfYzf2AH8ihjvvE8CekKPxUxAnzLj0hnR5e3Ck5aYtatr34WNwE1gUu6EKtKp6bLzZiXwqs4ErlJQVgMv6kjgFgVmKTBUIwHdOxeaBuBsyG1aoBvMErbJPaedwBlmEY1Aj3EtOJb25VRa6PPOhiq7b0lJSck/yl81J65mAHroiwAAAABJRU5ErkJggg==");
    --icon-custom_theme_settings: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAACXBIWXMAAAsTAAALEwEAmpwYAAADPklEQVR4nO2aO08VQRTHfxRoIY/ojQjBUnx8CpVPoCFooJDOWIBWPmNhoZ0KfAw7IyZKQ+cLEq8lRm20EoEooFEDXnOSc5ObzczenZndvXvD/pLTwM6c87/nzOw8FkpKSkpKdi/9wDgwC8wDH4B14K/auv5tXp8Z0zZtRQW4DCwBNU9bBKa0r8JyGJgBfgYIjdoWMA0MUiA6gSvAZopCoyY/4h1gb6vFHgPeOQT+GRgButXOAMsO7avA0VaJHXHMqog9YOhnv/4vaT8bwNm8xV4Cth3LUn4gG6OOfYnvi3mKrXmYlLCNHs8+Mxc9YsnsCrCg43HHQ3Cvpc2O9rmgPkyZlnkgswlqM+LwF3AB6Gh47rhOLtHg4gI7Z3j+rfqsIz4m1Gd0TA+lLXaPZTYWsSb6DBlZ1gkqiiwuvkSe/QoctPQ9Yflx5PWYGjcsZdyY2SgPLDP1qI7ZHs1sVKzY/Zh+OyzlfTUtsYO64ok6kHEVhykTSc1WOXUWDG1kuA2kIXjGEpSUaBy3AgRLRcXx3tJOqiqISszaeEcnKFvZvQoQ/CJmuJyIeRNshW44ppoEVjVMLhLovQCxdbtrEN1neQM02mSI4KUEga1oKcmYvRmY2ai91D4n1Me3BG3e+IodAP6lGHxeJjEf8hE8XoDgfe28j+DZAgTua3Jo4Mx8BvvZUEvq/5mP4E8Z7WdDxCb1LweDzqxluJ/1MRf/qz6C/+Swn3UxF/+/sxbc22LBJv/OrAXuZ9M2V//OfAzYz2Zhrv6deR6wn83KXPw7084Lj+8+gscKELivPfIR3N+mm4dVvefyYrEAApLaD82st9gkBwB5rp1zoWI5wKu1cO2cOdMpCXgMnAT2qZ0CnniunTNlMIUsX/c43cytjE1cC8xsM+YM7VpKp15n+AiWMm7G6aIJFo7o1O8quIvmdBdRMHrzvr2bBKOX0C6CZTZuxnCRBddFJ820vHqa8bTogtEN+UZC0fLqsXHb8Lz0W0iGHGbvOZ2Nu9SGLZmt6XVNYenUy+g0P0wLuhDLiwHgYQqrsqp+YtE2VDRDrz3209WifVfpSp9ebE3r9ceynoY2HgFv6rXoZLtltqSkpKSElPkPnv046IZ8agQAAAAASUVORK5CYII=");
    --icon-luna: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC5UlEQVR4nO2ZW4hNURjHfzO5R2HEwyT3kCcPIg9mkAdSqJEHxoOZQeSWxuWJPJ3JA3nkQfGieTFzjtQkkyQxIolcyiVjFFImHsZl5uirtWu12meftWavs+2y/7Xa7fbe/+//P2utb631HciQIUOGDCnCRKAOaAKOAEeBg0ADsAioJoWYArQCd4A/QDGifQEuAatJASYBZ4AfZUSXag+BNf9K/Hqgb5jCzXYZmJCk+GPAkCHiPtAITAd2Aw8cTbwAZich/pQRuBfYEPJeFbAFeO9g4iMwr9IGvmkBu1TWicJk4IaDiTcqKVQEs7RAP4FRlt+NAK44mLiuetAbhKwZeKcFuenIMRq45WCi0aeBPQb5b2B5mW+WAofUNUAt0G9poA8Y40O8dP9bjbhfrapR2AQMqvflulF7ts+hF3b6MLBOI/wE1Fh8c9UQIvcB5Ff9bGngng8D5zXCnOU3Zw0hcq8j59ALtXENvNLIyo37ANJLBeC7ukoq1VHnYGBbHPHjtbEsaXMkfiDDaMDSQFucQAs1ouf4hZ4YihGtPU6QZRrR3RLvyP6+BcgDnWq9sFmEeiwNdMUxsEQj6ikhvhASNG9xcLE1cC2OgRkakXS5iZaIwHIi8zGELsYxME4jGghZGfMRgWU4+ZjEOWLimUa20sFARwRnvUMabYhr4JxGdtp41hwReEcEZ5ul+EEfW+u1GuFXNawCVJfohc6ITDRWHextDNyOKz4Q+VIjPWw8r1ITtkO1pjJpdL+l+DwwDU/YpRFLBWLmMHlcttPz8Qg5eT0xFjUZCpU80CzAMxYDv4xx7nKkbHcQX6BCOBAyyaZa7Ey7HcS/VgWziuFkSClke8jElfutwAcH8b1J1YaOh9RAHwN7VeVCztCPHIQXgafAHBJEvfr1izHbkCr2JlpaDCBBTzikRrPJjnQVKUCNGjbdFuV1OdBfUMfKVEJKjSvUXqhV/cEhc2MzMDetf3BkyJAhw3+Mv1biGhP5ov1pAAAAAElFTkSuQmCC");
    --icon-original_palette: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACyUlEQVR4nO2YS2sUQRDHfzGKCnpwA3r2BeagfoKcfOFF8CBK4qp5HPTowUNWSb6EH0CNG3LwcQiJN28+Dj6I+DqoxxiEqERj0LCOFNRA0XTPbrRnsuD8oVioqa7+/3u6e6sGSpQoUaJEif8Ea4A+YBx4AXwEloAkYM+BLjO+S31u3JLmkpx1oBfoyIP8VAZZ1561SD4J2GRsEX0rJF/5B/KJ2qmYAsYzJnoLPAUW9deSr6ggd8w88AB4BfwO5L0ZU8CMZ4L7wG4TsxHY3IT8AnAO6DRxO4DpwBmKhjkn+ZRDwkVF34Yd0wAOBOI7gXtO/GxMAT9MYnnl2x2y+534q54VlRvGQsbY7bbL2U6yJaPhl0n80iGfvp1h4z/rESDXY4rL6psDthj/axP/M6YAuzIPnVVM/beN/7hHwDHz/K7x7zP+x86bjgZL5DOw1jyTlb8D7DG+Kx4BI+Z5t44ZNr51wFdnTC4CxPozYjcB7z0HuNpkjiHPPLkJ+Ab0eOI2ALc85Aea5D+oOQsTILYM3ABOAkeBS8C7FsifBkaBE8AZYELjkqIFNDM5hOedPP0ZZJN2EhCDfLJaAmKRT1ZDQEzySd4CGloeVPVAjugBtRjwkJfq9SJwRMdd1wuhUAELGYVZFnm5cdZ7Ynu09ilMgNQ6WagGVt5HPsWFogTMO6V0TWsbKQ9SjHrIyLZJ0a1jak4/4f6ZtVUxd7iFYm7GOWO5lNPSBjYrp6seAXJgU9QC5fQHEy89SG4NjbSBKYTAXid+wiPgmhMjYyz5bc65+ZJnSzmd0VIeCtz7y4ECMHRzybeiXJt6EbHTqeeHAlVlaot628iBTbE1IELmjIZ6xj/vG+CRpxnJMhH5RPsGX8U6qJ9yoqH3L0uBVq3hEWEb/iifFicLEDFIjujQ5mVM9+fsCreNz75rj/1Jc9Zjr3yJEiVKlChBO+MPl/lFxHZRlmwAAAAASUVORK5CYII=");
    --icon-flat_palette: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA2klEQVR4nO2YSw6CQBBEi0uCcjyVA6j3MA538Ldj4xhjZIhJH8BkClpivaS3Tb1QC2hACCGE+BMKADWABkAL4ALgASBlTrRdn50bAAt7Fj38nhD229mxJeoJwyebiinQOAismQKtg8CRKXBzEDgzBaKDwJ0p8HIQeDIFegeBnimQnIaGBKA3kIcqBFUoD1UIqlAeqhCcK9Q7vIU3U2D2n9Nx7j80VweBE1MgOAgc5n5WWTEFlg4CJVOgsHPfVOG3Y91HK7uYBbvbdISwne0KtrscI7wQQgiBX2QAuB5o1iJJ62gAAAAASUVORK5CYII=");
    --icon-pen_palette: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABk0lEQVR4nO2YvUoDQRSFP3+w09KUPkIK02ploY3mEbSzSIpUqW00KhhrtYxPYZPEN1AQQU1trc0GNCsDYxPizq4795qV+eBAIHDPPWQz985CIBAI/BdmgHXgFLgFXoGhlfncB06ANaaQLeAeiFPqDthkCpgFzjM0Pq4z+8v9Gcc5mv/WkWbDK8A+0AQOgE8PAT5sraatbTxE2ADePTTs0pv18s6jQvOx1YPv5heAkWKAkfX0hjkpIsUAkcTpNFAM8IIAPcUAXYkA14oBOtpD6xCYy1BrHmgl1DNe3qklGO7+ot5eQj3j5Z2q49Qwz+1NSnUdp1pVIkBF8T+wKhGglHINaNvne5LaKdeRktTqPHQYmwZduNbvofUSwTXMnoBtu4xNkvnu2VFjgCC9og4xzWHWYcpvYC61JAPUFQLUJAMkDTNf2pEMUCnqEMsyzPJqGUGkb2aRxnuiQdFuYuP0BQP0UKCcsCrkVVkjQOFYsgOsqay69c7NlcLRGf+gy6IHuPARYBFoJNyypNSw3oFAIBBAjC/DeOalOTKnJgAAAABJRU5ErkJggg==");
    --icon-vanilla_palette: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABdUlEQVR4nO2ZTUoDQRCFP7M0V9Bx40+iF1HnJjFrZSR7DSE3UZMgeADRSxj0GiYLbRkoQYKQMVPV3cH+4MFsZua9THV3dQcSiUQiERk7QA50gQtReX0KZETKETAE3gC3RK/AAGgTAS1gAnxWML6o8p4RcBDCeAPoAfMVjC9qBhTyTC80gQcF44u6l2ebm382MO9ET5YhGka/vPvlS5iUU8+DeScqx4Qq+zLYfAWYa89OE4/mnehWc5FaZZ6vqw+txW4YwLwT9TUCVGkPrDStaz4LaN6JtuoEyCMIcFwnQDeCAJ06AS4jCFD86wBn615C+boP4mzdp1FkDxvK/AsKDAIGuNIIcBiwmWuhxChAgBsU2fO8oZlZHLcUHgOcY0BDNtzW5sfABkZsytGHlflHeYcpTaMvMfZh/mc5FUoD+11q3qxslh233Mmc/Vfj5T3lVLlLBLRlAz6t2B5cay5S2mwDJ9IGf//B0ZGusnZjlkgkEgk0+QKiYlMBP+AzuwAAAABJRU5ErkJggg==");
    --icon-pastel_palette: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACeklEQVR4nO2ZT0hUURjFf2UWLYyCAu3PqtAIiiiC2kqrEAMhsFKwnQsTqkW1aKpNFkjR1vZZRC0iWgURQS5nESYZpSvBkMkUnJLsxYMTDMPMm6dzv/ve4h04MNy597vnvPfdufd+AxkypBINQAtwVGxRW6qxATgLPAMWgaCMi/quW31ThU5gooLoavwEdJAChGlxdxXCy/kwydRaBzypQ/x/jiqWd9x2ID4Qc77FHwP+OjSwAhzxaeCNQ/GB+NaX+MMG4gPxkA8DtwwN5HwYeG9o4J0PA9OGBr75MFA0NFD0YaDSOccV530YmDQ08NmHgaeGBkZ9GOgzNNDjw8AW5apr8T+AJjzBYjO7iUdsAsYdip8ANuMZB4CCA/E/gYMkhBPAXB3i54DjJIx9wNgaxIdj9iYpfKsqDCPA1zUYCMeMKEYYyxt2AsPAgsNFvKCYYWxTdGjRBUacB05Z5nrUSXQWeKxLyXmgCzgpdqktpz7fI+IUrdbG5YhJb6yyvtOgjSuowksWBk7X2IgGgf1AY0SMRvUZrFHJ67QwsB54HSOPl3VrywMfxLzalmOMf6W5TLARuAf8NljAv1SmjHqDdaG0/LcbGAK+OBA+CdwBdlWZyxmuAAMVnlAr0As8AF4qXWZ0TvojFtSWV5/7Ovu3lsUKY1/UXM6RK6kcXAPaHMZuA64DU5b1oZ4Kr39cO2if6qVxLiRN6huOGa5yLD9nYWCHbk21crqgJ/lRv0Bj+jwV8/hdALZjhF5VkgMjrmjHNkW34Z34DJ4Q/uv4CFhyIHxJsZpJANuAfuBFzPVRmufPNTaMkRrsAdqBC9ozrooDamtXnwwZMuAG/wCRG+5q4PZAawAAAABJRU5ErkJggg==");
    --icon-feedback_button: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACsUlEQVR4nO2Yv2sUQRTHP9GgIgpqDjksrBQUbWztrBR/gUaUGBQOg2AsNCgGlOiWYurYqBEsBP8IEdHKSLQQjYJ22hoM/k5uZeANPJbd29nd2btF9gsPZmfevPl+5+bNj4MaNWrUiGAZcAC4DTwWM+X9QB8VxzbgJRAm2AvxqST2Al87kLf2DThExXAW+OtA3toiME4FsAK4l4F41O5KjJ5gAHhSgLy158DGbpPfCXzyQD4U+wjs6Bb5g5KIaaS+ACeBYSmn+c8D+8omf0ESMI3MK2Cz6rdJttCeJfdK4L7jcngErI6JsQp44Bjjju/kPuMw6BJwNeW07ROfJYd4LTxjImXAiRiycWWDGymxrvsivR0YVN+XgHbCoEeUn7n3jKnvMamzGEyI0QYuR/wKXT3OywlrdhKL0QQR74FTwC1JxkD1CaTuJjAEfEggP6r6DMvYhkNu2J/arNkRVd9y2I2iAtJ2n5byH1F5YjjkRhCZoYuq7Tjwx4OAReC08j0XSfLAl4C4BDOH2s8CAn4DR5XflZQ4XgSEspYtzOn5I4eAX8Bh5TPuMBHeBBibVNvjHmBBtX2XZLUYiohckD5IjEnHpZgZack3pUTslvvMHLAlJtZWaZsXX0t+KsNm4F2AsWlgufjvAppSNleBY7KX22tBU3yQPtMO8UsXYOwh0K/6bQBmVPuM1Fn0S5+wKgLeAQ1FfjbGZ1aJaEifsAoC5uS6bLAuMvNx12zzkkNeYW96LSALeS2ikUFEUJaAPOStvc4gIihDQBHyWUUEvgX4IJ9FROBTgE/yriIKCbimAr1Vh9SAJGNR8mHM7tSUsWybeYLmxokukA9TRJhre26sAZ6pZbPe07JxXU5PgbV4+L+/zJkPO/wSdmwvMI/tzx0e9T6sLWPoh32NGjVq1Kjx/+If6AXORxt+V2AAAAAASUVORK5CYII=");
    --icon-patchnote_button: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA4klEQVR4nO3WPQ6CMBjG8f89lIsYPYounkEZgc1ZXfFkuhlXddGxLm1CSIE3/SImPMk7gf7Sp1qAKX+YPfACrsAZyFKgJaBa8wU2qVHVmGoM1Mw2JroAlh3wB5jHQJVGVz2rPsZAJfMIhdZ6bIit9mcItHSofeeLFpbr+UDNRQx0CPdGa8H97T0vfVElhC+hUaXnIPyMd71KiHujufAY7Po7OdWLfp5Kj8E6xJ6a3ByPQ6d6mzn1fLmkdudk+s3BBttqD4KarFPVa0s1gAZdqW3ln9SoyUz/4O7A2/XRNmXU/AAPBuQV6ihFBgAAAABJRU5ErkJggg==");
}


/* Основные цвета TInkoff UI
--------------------------------------------------------------------------------------------------
*/
body.dark-mode {
    --tui-primary-text: #fffc !important;
    --tui-base-01: #292a2d !important;
    --tui-text-01: #fffc !important; /* text main color */
    --tui-text-02: #ffffff8a !important;
    --tui-text-03: #fff6 !important;
    --tui-base-02: #434d56 !important; /* left bar selected */
    --tui-base-03: #444d55 !important; /* left bar background color */
    --tui-base-05: #797e86 !important; /* left bar selected */
    --tui-base-08: #9299a2 !important; /* left bar title */
    --tui-base-07: #34383d !important;
    --tui-base-09: #fff !important;
    --tui-secondary: #1d1d1f !important; /* small buttons background color */
    --tui-secondary-active: #222 !important;
    --tui-secondary-hover: #111 !important;
    --tui-link: #89abf5 !important;
    --tui-link-hover: #517ee1 !important;
    --tui-clear: #ffffff15 !important;
    --tui-clear-hover: #ffffff30 !important;
    --tui-autofill: #998000 !important;
    --tui-elevation-01: #555 !important;
    --tui-elevation-02: #555 !important;
    background: var(--tui-base-01) !important;
    overscroll-behavior-x: none;
}

body.dark-mode app-variable-editor-form .term:not(.term_expanded):hover {
    background-color: var(--tui-base-07) !important;
}

body.dark-mode app-variable-editor-form tui-wrapper[data-appearance=variable-editor][data-state=pressed] {
    color: #000 !important;
}

body.dark-mode app-variable-editor-form .term_expanded,
body.dark-mode app-variable-editor-form tui-expand {
    background-color: var(--tui-base-07) !important;
}

body.dark-mode tui-hint-box,
body.dark-mode tui-hints-host tui-hint:not([data-appearance]) {
    color: var(--tui-text-02) !important;
    backdrop-filter: blur(40px) brightness(0.5) !important;
}

body.dark-mode tui-hint,
body.dark-mode spel-hint{
    color: var(--tui-text-02) !important;
}

/* Экран логина в ЦУП
--------------------------------------------------------------------------------------------------
*/

body.dark-mode .login {
    color: var(--tui-primary-text);
}

body.dark-mode .login .login__logo-image {
    filter: drop-shadow(0px 2px 0px  white) drop-shadow(0px -1px 0px #fff) drop-shadow(-1px 0px 0px #fff) drop-shadow(2px 0px 0px #fff);
}

body.dark-mode .login input.input__field {
    background: var(--tui-secondary) !important;
}

body.dark-mode .login button {
    color: var(--tui-secondary);
}

/* Сетка
--------------------------------------------------------------------------------------------------
*/

body.dark-mode #graph {
    background-color: var(--dark-background-main) !important;
    position: relative;
    z-index: 0;
    overflow: hidden;
    background-image: radial-gradient(#fff2 1px, #0000 1px);
    background-size: 10px 10px;
}

body.dark-mode #graph:before {
    z-index: -1;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    content: "";
    opacity: 0.4;
    background: #fff;
    background-image: url(grid-layout.d0bd526c56ee8b1b3943.svg);
    filter: invert(1) brightness(1.5);

}

body.dark-mode jsplumb-miniview {
    backdrop-filter: blur(10px) brightness(100%) !important;
    transform-origin: left bottom;
    transition: transform .2s ease-in-out;
}

body.dark-mode jsplumb-miniview .jtk-miniview {
    border-color: var(--tui-base-05) !important;
}

body.dark-mode jsplumb-miniview .jtk-miniview .jtk-miniview-panner {
    border-color: var(--tui-text-01) !important;
    background-color: var(--tui-base-05) !important;
}

body.dark-mode jsplumb-miniview .jtk-miniview .jtk-miniview-collapse {
    color: var(--tui-text-01) !important;
}

body.dark-mode jsplumb-miniview:hover {
    backdrop-filter: blur(10px) brightness(65%) !important;
    transform: scale(1.5);
}


/* Рамка выделения блоков
--------------------------------------------------------------------------------------------------
*/

body.dark-mode .jtk-lasso {
    border: 2px solid var(--dside-lasso-border) !important;
    background-color: var(--dside-lasso-color) !important;
    opacity: 1 !important;
}

/* Надпись "Старт"
--------------------------------------------------------------------------------------------------
*/

body.dark-mode .start {
 color: #fff !important;
}

/* Подписи стрелочек
--------------------------------------------------------------------------------------------------
*/

body.dark-mode .jtk-connector path:nth-child(2) {
    stroke: var(--tui-base-06);
}

body.dark-mode .jtk-connector path:nth-child(3) {
    stroke: var(--tui-base-06);
    fill: var(--tui-base-06);
}

body.dark-mode .jtk-connector.jtk-hover path:nth-child(2),
body.dark-mode .jtk-connector.jtk-connection-edit path:nth-child(2) {
    stroke: var(--tui-link-hover);
}

body.dark-mode .jtk-connector.jtk-hover path:nth-child(3),
body.dark-mode .jtk-connector.jtk-connection-edit path:nth-child(3) {
    stroke: var(--tui-link-hover);
    fill: var(--tui-link-hover);
}

body.dark-mode .jtk-surface .connector-label:not(.jtk-hover) {
    background-color: var(--tui-base-06);
}

body.dark-mode .jtk-surface .connector-label.jtk-connection-edit {
    background-color: var(--tui-link-hover);
}

body.dark-mode .jtk-surface .sourceAnchor:not(.jtk-hover):before {
    background-color: var(--tui-base-06);
}

body.dark-mode .jtk-surface .sourceAnchor.editing-edge:before {
    background-color: var(--tui-link-hover);
}

body.dark-mode .port {
    background-color: var(--tui-base-06);
    border-color: var(--tui-base-01);
}

body.dark-mode .port:hover:after {
    border-color: var(--tui-link-hover);
}

/* Дизайн блоков
--------------------------------------------------------------------------------------------------
*/

body.dark-mode .jtk-surface {
    filter: var(--canvas-shadow) !important;
}

body.dark-mode .figure-color_blue.invalid {
    filter: /*hue-rotate(144deg)*/ drop-shadow(0px 0px 10px rgba(255, 0, 0, 1));
}

body.dark-mode .figure.marked {
    filter: drop-shadow(0 18px 15px var(--tui-primary)) !important;
}

body.dark-mode .figure .overlay {
    opacity: 0.85 !important;
}

body.dark-mode .figure:hover .overlay {
    opacity: 0.9 !important;
}

body.dark-mode .figure.active .overlay,
body.dark-mode .jtk-surface-selected-element .figure .overlay {
    opacity: 1 !important;
}

/*app-add-next-block-button tui-hosted-dropdown {
    background-color: var(--tui-base-02) !important;
}
*/

/* Текст в блоках
--------------------------------------------------------------------------------------------------
*/

body.dark-mode .jtk-surface-canvas {
    color: var(--dark-scheme-text-color) !important;
}

/* Оранжевый блок
--------------------------------------------------------------------------------------------------
*/

body.dark-mode .figure-color_orange .overlay {
    /*background: linear-gradient(180deg, #f07f06 0%, #703d08 100%) !important;*/
    background: var(--dside-orange) !important;
    /*background-color: #954f04 !important;*/
    color: transparent !important;
}

body.dark-mode .figure-color_orange:hover .overlay {
    /*background: linear-gradient(180deg, #fcc183 0%, #f09028 100%) !important;*/
    background: var(--dside-orange-active) !important;
    color: transparent !important;
}

body.dark-mode .figure-color_orange.active .overlay,
body.dark-mode .jtk-surface-selected-element .figure-color_orange .overlay {
    /*background: linear-gradient(180deg, #fcc183 0%, #f09028 100%) !important;*/
    background: var(--dside-orange-active) !important;
    color: transparent !important;
    filter: var(--dside-orange-glow) !important;
}

body.dark-mode .figure.finishing .overlay {
    border-color: var(--dark-scheme-text-color) !important;
}

body.dark-mode .item_type_form_with_choice,
body.dark-mode .item_type_form {
    color: var(--dside-orange-button) !important;
}

/* Зеленый блок
--------------------------------------------------------------------------------------------------
*/

body.dark-mode .figure-color_green .overlay {
    background: var(--dside-green) !important;
    /*background-color: #2a6f36 !important;*/
    color: transparent !important;
}

body.dark-mode .figure-color_green:hover .overlay {
    background: var(--dside-green-active) !important;
    color: transparent !important;
}

body.dark-mode .figure-color_green.active .overlay,
body.dark-mode .jtk-surface-selected-element .figure-color_green .overlay {
    background: var(--dside-green-active) !important;
    color: transparent !important;
    filter: var(--dside-green-glow) !important;
}

body.dark-mode .item_type_procedure {
    color: var(--dside-green-button) !important;
}

/* Голубой блок
--------------------------------------------------------------------------------------------------
*/

body.dark-mode .figure-color_blue .overlay {
    background: var(--dside-blue) !important;
    /*background-color: #185081 !important;*/
    color: transparent !important;
}

body.dark-mode .figure-color_blue:hover .overlay {
    background: var(--dside-blue-active) !important;
    color: transparent !important;
}

body.dark-mode .figure-color_blue.active .overlay,
body.dark-mode .jtk-surface-selected-element .figure-color_blue .overlay {
    background: var(--dside-blue-active) !important;
    color: transparent !important;
    filter: var(--dside-blue-glow) !important;
}

body.dark-mode .figure_type_rhombus.active.figure-color_blue,
body.dark-mode .jtk-surface-selected-element .figure_type_rhombus.figure-color_blue {
    filter: var(--dside-blue-glow) !important;
}

body.dark-mode .item_type_choice,
body.dark-mode .item_type_call,
body.dark-mode .item_type_expression {
    color: var(--dside-blue-button) !important;
}

body.dark-mode .figure_type_rhombus.finishing .overlay:before,
body.dark-mode .figure_type_parallelogram.finishing .overlay:before {
    background: var(--dside-blue) !important;
}
body.dark-mode .figure_type_rhombus.finishing:hover .overlay:before,
body.dark-mode .figure_type_parallelogram.finishing:hover .overlay:before {
    background: var(--dside-blue-active) !important;
}
body.dark-mode .figure_type_rhombus.finishing.active .overlay:before,
body.dark-mode .jtk-surface-selected-element .figure_type_rhombus.finishing .overlay:before,
body.dark-mode .figure_type_parallelogram.finishing.active .overlay:before,
body.dark-mode .jtk-surface-selected-element .figure_type_parallelogram.finishing .overlay:before {
    background: var(--dside-blue-active) !important;
}

body.dark-mode .figure-color_blue.finishing .overlay:not(.overlay-type_rectangle) {
    border-style: solid !important;
    border-color: #fff !important;
    background: #fff !important;
}

body.dark-mode .border-type_dashed {
    border-color: var(--dark-scheme-text-color-transparent) !important;
}

/* Желтый блок
--------------------------------------------------------------------------------------------------
*/

body.dark-mode .figure_type_rhombus.active.figure-color_yellow,
body.dark-mode .jtk-surface-selected-element .figure_type_rhombus.figure-color_yellow {
    filter: var(--dside-yellow-glow) !important;
}

body.dark-mode .figure_type_rhombus.figure-color_yellow .overlay,
body.dark-mode .figure_type_rhombus.figure-color_yellow.finishing .overlay:before {
    background: var(--dside-yellow) !important;
}
body.dark-mode .figure_type_rhombus.figure-color_yellow:hover .overlay,
body.dark-mode .figure_type_rhombus.figure-color_yellow.finishing:hover .overlay:before {
    background: var(--dside-yellow-active) !important;
}
body.dark-mode .figure_type_rhombus.active.figure-color_yellow .overlay,
body.dark-mode .figure_type_rhombus.active.figure-color_yellow.finishing .overlay:before,
body.dark-mode .jtk-surface-selected-element .figure_type_rhombus.figure-color_yellow .overlay,
body.dark-mode .jtk-surface-selected-element .figure_type_rhombus.figure-color_yellow.finishing .overlay:before {
    background: var(--dside-yellow-active) !important;
}

body.dark-mode .figure-color_yellow.finishing .overlay:not(.overlay-type_rectangle) {
    border-style: solid !important;
    border-color: #fff !important;
    background: #fff !important;
}

/*body.dark-mode .figure_type_rhombus.figure-color_yellow {
    color: #000 !important;
}*/

/* Фикс окраски сравнения версий
--------------------------------------------------------------------------------------------------
*/

body.dark-mode app-procedure-diff button[data-automation-id="procedure-diff-show-panel-button"] svg {
    filter: invert(1);
}

body.dark-mode .figure.diff .overlay {
    border-color: var(--dside-diff-border) !important;
    background: var(--dside-diff) !important;
    color: var(--dside-diff) !important;
}

body.dark-mode .figure.diff:hover .overlay {
    border-color: var(--dside-diff-border) !important;
    background: var(--dside-diff-hover) !important;
    color: var(--dside-diff-hover) !important;
}

body.dark-mode .figure.diff.active .overlay,
body.dark-mode .jtk-surface-selected-element .figure.diff .overlay {
    border-color: var(--dside-diff-border) !important;
    background: var(--dside-diff-active) !important;
    color: var(--dside-diff-active) !important;
    filter: drop-shadow(0px 0px 10px var(--dside-diff-active)) !important;
}

body.dark-mode .figure_type_rhombus.diff.active.figure-color_blue,
body.dark-mode .figure_type_rhombus.diff.active.figure-color_yellow,
body.dark-mode .jtk-surface-selected-element .figure_type_rhombus.diff,
body.dark-mode .figure_type_parallelogram.diff.active.figure-color_blue,
body.dark-mode .figure_type_parallelogram.diff.active.figure-color_yellow,
body.dark-mode .jtk-surface-selected-element .figure_type_parallelogram.diff {
    filter: drop-shadow(0px 0px 10px #666) !important;
}

body.dark-mode .figure_type_rhombus.finishing.diff .overlay,
body.dark-mode .figure_type_parallelogram.finishing.diff .overlay {
    background: var(--dside-diff-border) !important;
    border-color: var(--dside-diff-border) !important;
}

body.dark-mode .figure_type_rhombus.finishing.diff .overlay:before,
body.dark-mode .figure_type_parallelogram.finishing.diff .overlay:before {
    background: var(--dside-diff) !important;
}

body.dark-mode .figure_type_rhombus.finishing.diff:hover .overlay:before,
body.dark-mode .figure_type_parallelogram.finishing.diff:hover .overlay:before {
    background: var(--dside-diff-hover) !important;
}

body.dark-mode .figure_type_rhombus.finishing.diff.active .overlay:before,
body.dark-mode .jtk-surface-selected-element .figure_type_rhombus.finishing.diff .overlay:before,
body.dark-mode .figure_type_parallelogram.finishing.diff.active .overlay:before,
body.dark-mode .jtk-surface-selected-element .figure_type_parallelogram.finishing.diff .overlay:before {
    background: var(--dside-diff-active) !important;
}

body.dark-mode .figure.diff * {
    color: var(--dside-diff-text) !important;
}

/* Навешивание блюров
--------------------------------------------------------------------------------------------------
*/

body.dark-mode app-step-editor .content-wrapper {
    backdrop-filter: blur(40px) brightness(0.5) !important;
    background-color: var(--dark-background-header) !important;
}

body.dark-mode app-float-panel .panel {
    backdrop-filter: blur(40px) brightness(0.5) !important;
    background-color: var(--dark-background-header) !important;
}

app-procedure-diff{
    z-index: 1 !important;
    background-color: #fff !important;
}

body.dark-mode app-procedure-diff{
    backdrop-filter: blur(40px) brightness(0.5) !important;
    background-color: var(--dark-background-header) !important;
}

/* фикс съехавшего выделения блоков
app-graph #graph jsplumb-surface {
    position: fixed !important;
    z-index: 0 !important;
    top: 0 !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
*/}

body.dark-mode tui-dropdown,
body.dark-mode app-graph-context-menu {
    backdrop-filter: blur(40px) brightness(0.5) !important;
    background-color: var(--dark-context-background) !important;
}

body.dark-mode tui-dialog-host .t-overlay {
    backdrop-filter: blur(40px) !important;
    background: var(--dside-overlay) !important;
}

body.dark-mode app-procedures-console {
    backdrop-filter: blur(40px) brightness(0.5) !important;
    background-color: var(--dark-background-header) !important;
}

body.dark-mode .item_error [data-automation-id="console-content-item-message"] {
    color: #f00;
    background: #00000080;
    padding: 4px 10px 6px 10px;
    border-radius: 5px;
    margin-left: 5px;
}

body.dark-mode .item_warning [data-automation-id="console-content-item-message"] {
    color: #f4bd00;
    padding: 4px 10px 6px 10px;
    border-radius: 5px;
    margin-left: 5px;
}

body.dark-mode app-add-block-menu button.item:not(:hover)  {
    background-color: transparent !important;
}

body.dark-mode app-add-block-menu button.item:before  {
    top: 0px;
    bottom: -10px;
    left: 3px;
    border-radius: 5px;
}

body.dark-mode app-add-block-menu button.item:last-child:before  {
    bottom: 0px;
}

/* Желтая кнопка
--------------------------------------------------------------------------------------------------
*/

body.dark-mode tui-wrapper[data-appearance=primary] {
    color: #111;
}

body.dark-mode button[data-automation-id=procedure-diff-show-panel-button] tui-svg.icon.ng-star-inserted {
    filter: invert(100%) brightness(119%) contrast(119%) !important;
}

body.dark-mode .primary .inline-edit {
    color: #000 !important;
}

body.dark-mode ._disabled .icon_off {
    color: #fff !important;
}

body.dark-mode [data-host-text-color=black] {
    -webkit-text-fill-color: #000 !important;
}

body.dark-mode .comment-button {
    color: #000 !important;
    background-color: var(--dark-background-main);
}

body.dark-mode .figure.diff .comment-button {
    color: var(--dside-diff-border) !important;
}

body.dark-mode .figure-color_orange .comment-button {
    color: var(--dside-orange-comment) !important;
}

body.dark-mode .figure-color_green .comment-button {
    color: var(--dside-green-comment) !important;
}

body.dark-mode .figure-color_blue .comment-button {
    color: var(--dside-blue-comment) !important;
}

body.dark-mode .figure-color_yellow .comment-button {
    color: var(--dside-yellow-comment) !important;
}

body.dark-mode tui-logo .logo,
body.dark-mode .logo,
body.dark-mode .logotype {
    /*filter: invert(100%) !important;*/
    color: var(--tui-text-01) !important;
}

/* Кнопка фидбэка
--------------------------------------------------------------------------------------------------
*/

app-darkmode-toolbar {
    bottom: 0;
    height: 78px;
    width: 180px;
    display: block;
    position: absolute;
    right: 0;
}

app-darkmode-toolbar:not(:hover) app-darkmode-feedback-button .wrapper {
    opacity: 0;
}

app-darkmode-toolbar:not(:hover) app-darkmode-palette-button [tuiIconButton] {
    width: 24px !important;
}

app-darkmode-feedback-button [tuiIconButton],
app-darkmode-toggle-button [tuiIconButton],
app-darkmode-palette-button [tuiIconButton] {
    height: var(--tui-height-m);
    width: 200px !important;
    border-radius: 6.25rem;
    font-size: .9375rem;
    /*box-shadow: 0 0.25rem 1.5rem #0006;*/
    background: var(--tui-secondary);
    border-radius: 6.25rem;
    border: solid 2px var(--tui-secondary-hover) !important;
    transition-property: color,background;
    transition-duration: var(--tui-duration,300ms);
    transition-timing-function: ease-in-out;
}

app-darkmode-feedback-button [tuiIconButton]:hover,
app-darkmode-toggle-button [tuiIconButton]:hover,
app-darkmode-palette-button [tuiIconButton]:hover {
    cursor: pointer;
    background-color: var(--tui-secondary-hover);
}

app-darkmode-feedback-button [tuiIconButton]:active,
app-darkmode-toggle-button [tuiIconButton]:active,
app-darkmode-palette-button [tuiIconButton]:active {
    cursor: pointer;
    background-color: var(--tui-secondary-active);
}


app-darkmode-toggle-button .wrapper,
app-darkmode-palette-button .wrapper {
    position: absolute;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    transition: .5s;
}

app-darkmode-feedback-button [tuiIconButton].wrapper,
app-darkmode-toggle-button [tuiIconButton].wrapper,
app-darkmode-palette-button [tuiIconButton].wrapper {
    padding: 0;
    position: relative;
    z-index: 0;
    box-sizing: border-box;
    cursor: pointer;
}

app-darkmode-toggle-button [tuiIconButton] {
    width: var(--tui-height-m) !important;
    background-image: url("data:image/png;base64,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BEzABEzABOwA+B4wARMwARMwgQ4J2AHocNI9ZBMwARMwAROwA+B7wARMwARMwAQ6JGAHoMNJ95BNwARMwARMwA6A7wETMAETMAET6JCAHYAOJ91DNgETMAETMAE7AL4HTMAETMAETKBDAnYAOpx0D9kETMAETMAE7AD4HjABEzABEzCBDgnYAehw0j1kEzABEzABE7AD4HvABEzABEzABDokYAegw0n3kE3ABEzABEzADoDvARMwARMwARPokIAdgA4n3UM2ARMwARMwATsAvgdMwARMwARMoEMCdgA6nHQP2QRMwARMwATsAPgeMAETMAETMIEOCdgB6HDSPWQTMAETMAETsAPge8AETMAETMAEOiRgB6DDSfeQTcAETMAETMAOgO8BEzABEzABE+iQgB2ADifdQzYBEzABEzABOwC+B0zABEzABEygQwJ2ADqcdA/ZBEzABEzABOwA+B4wARMwARMwgQ4J2AHocNI9ZBMwARMwAROwA+B7wARMwARMwAQ6JGAHoMNJ95BNwARMwARMwA6A7wETMAETMAET6JCAHYAOJ91DNgETMAETMAE7AL4HTMAETMAETKBDAnYAOpx0D9kETMAETMAE7AD4HjABEzABEzCBDgnYAehw0j1kEzABEzABE7AD4HvABEzABEzABDokYAegw0n3kE3ABEzABEzADoDvARMwARMwARPokIAdgA4n3UM2ARMwARMwATsAvgdMwARMwARMoEMCdgA6nHQP2QRMwARMwATsAPgeMAETMAETMIEOCdgB6HDSPWQTMAETMAETsAPge8AETMAETMAEOiRgB6DDSfeQTcAETMAETMAOgO8BEzABEzABE+iQgB2ADifdQzYBEzABEzABOwC+B0zABEzABEygQwJ2ADqcdA/ZBEzABEzABOwA+B4wARMwARMwgQ4J2AHocNI9ZBMwARMwAROwA+B7wARMwARMwAQ6JGAHoMNJ95BNwARMwARMwA6A7wETMAETMAET6JCAHYAOJ91DNgETMAETMAE7AL4HTMAETMAETKBDAnYAOpx0D9kETMAETMAE7AD4HjABEzABEzCBDgnYAehw0j1kEzABEzABE7AD4HvABEzABEzABDokYAegw0n3kE3ABEzABEzADoDvARMwARMwARPokIAdgA4n3UM2ARMwARMwATsAvgdMwARMwARMoEMCdgA6nHQP2QRMwARMwATsAPgeMAETMAETMIEOCdgB6HDSPWQTMAETMAET+EehL9eVu2ZEkwAAAABJRU5ErkJggg==");
    background-size: 100% !important;
    background-repeat: no-repeat !important;
}

body:not(.dark-mode) app-darkmode-toggle-button [tuiIconButton] {
    background-position: center bottom;
    border-color: #000 !important;
}

body.dark-mode app-darkmode-toggle-button [tuiIconButton] {
    background-position: center top;
    border-color: #fff !important;
}

body:not(.dark-mode) app-darkmode-palette-button {
    display: none;
}

app-darkmode-palette-button .wrapper {
    right: 2.6rem !important;
}

@keyframes slidein {
  from {
    transform: translateY(20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideout {
  from {
    transform: translateY(0);
    opacity: 1;
  }

  to {
    transform: translateY(20px);
    opacity: 0;
  }
}

app-darkmode-palette-button .wrapper:active .palette-menu-wrapper {
    /*display: initial !important;*/
}

app-darkmode-palette-button .wrapper:active .palette-menu-wrapper #palette_menu {
    pointer-events: all !important;
}

app-darkmode-palette-button .wrapper .palette-menu-wrapper #palette_menu:active {
    pointer-events: none !important;
}

app-darkmode-palette-button .wrapper .palette-menu-wrapper #palette_menu:active button {
    pointer-events: all;
}

app-darkmode-palette-button .palette-menu-wrapper {
    position: relative;
    pointer-events: none;
    z-index: 1;
}

app-darkmode-palette-button .palette-menu-wrapper:hover #palette_menu {
    opacity: 1 !important;
    animation: slidein .3s !important;
    pointer-events: all !important;
}

app-darkmode-palette-button .palette-menu-wrapper #palette_menu {
    position: absolute;
    right: 26px;
    bottom: 35px;
    background: var(--tui-secondary);
    padding: 10px;
    border-radius: 10px;
    filter: drop-shadow(0 10px 10px #0006);
    border: 1px solid var(--tui-base-03);
    animation: none;
    opacity: 0;
    visibility: hidden;
}

app-darkmode-palette-button .palette-menu-wrapper:not(:hover) #palette_menu {
    animation: slideout .3s;
}

app-darkmode-palette-button .palette-menu-wrapper #palette_menu:before {
    position: absolute;
    background-color: var(--tui-secondary);
    box-shadow: -1px 1px 0 0 var(--tui-base-03);
    content: "";
    display: block;
    height: 14px;
    width: 14px;
    right: 15px;
    bottom: -7px;
    transform: rotate( -45deg );
    -moz-transform: rotate( -45deg );
    -ms-transform: rotate( -45deg );
    -o-transform: rotate( -45deg );
    -webkit-transform: rotate( -45deg );
}

app-darkmode-palette-button .palette-menu-wrapper #palette_menu:after {
    position: absolute;
    content: "";
    top: -20px;
    bottom: -60px;
    right: -7px;
    left: -7px;
    z-index: -1;
}

app-darkmode-palette-button .palette-menu-wrapper #palette_menu button {
    background: var(--tui-base-07);
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    cursor: pointer;
    position: relative;
    white-space: nowrap;
    text-align: left;
    padding-left: 40px;
}

app-darkmode-palette-button .palette-menu-wrapper #palette_menu button.activated {
    background: var(--dside-lasso-border) !important;
    box-shadow: 0 0 20px var(--dside-blue-button);
    text-shadow: 0 0 5px #000;
/*  background: var(--dside-orange) no-repeat border-box, var(--dside-blue) no-repeat border-box, var(--dside-green) no-repeat border-box !important;
    background-size: 30% 100%, 30% 100%, 30% 100% !important;
    background-position: 0 0, 50% 0, 100% 0 !important;
    background-origin: padding-box, padding-box, padding-box !important;
    color: transparent !important;
*/}

app-darkmode-palette-button .palette-menu-wrapper #palette_menu button:hover {
    background: var(--tui-base-05);
}

app-darkmode-palette-button .palette-menu-wrapper #palette_menu button:active {
    background: var(--tui-base-03);
}

app-darkmode-palette-button .palette-menu-wrapper #palette_menu .custom_palette_wrapper {
    padding: 0 0 10px;
    border-bottom: 1px solid var(--tui-base-03);
    display: flex;
    gap: 10px;
    position: relative;
    margin: 10px 0;
}

@keyframes color {
    0%,to {
        background-position: 10% 0
    }

    50% {
        background-position: 91% 0
    }
}

app-darkmode-palette-button .palette-menu-wrapper #palette_menu .custom_palette_wrapper:after {
    content: "";
    position: absolute;
    left: 0;
    top: 0px;
    right: 0;
    bottom: 10px;
    filter: blur(17px);
    z-index: -1;
    animation: color 20s infinite ease-in-out;
    /*background: linear-gradient(130deg,#ff7e00,#00f,#5cff00,#ffeda0);*/
    background: var(--custom-theme-gradient);
    background-size: 300% 100%;
    transform: skew(-12deg,2deg);
}

app-darkmode-palette-button .palette-menu-wrapper #palette_menu .prebuild_palette_wrapper {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
    grid-column-gap: 10px;
    grid-row-gap: 10px;
    margin: 10px 0;
}

app-darkmode-palette-button .palette-menu-wrapper #palette_menu .logo_wrapper {
    border-bottom: 1px solid var(--tui-base-03);
    padding: 10px 0 0;
    margin: 10px 0;
}

app-darkmode-palette-button .palette-menu-wrapper #palette_menu .feedback_wrapper {
    border-top: 1px solid var(--tui-base-03);
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px 0 0;
}

app-darkmode-palette-button .palette-menu-wrapper #palette_menu button:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 40px;
    -webkit-mask-size: 30px;
    -webkit-mask-position: center;
    -webkit-mask-repeat: no-repeat;
    background: var(--tui-primary-text);
    opacity: 0.85;
}

app-darkmode-palette-button .palette-menu-wrapper #palette_menu #custom_theme {
    flex-grow: 1;
}
app-darkmode-palette-button .palette-menu-wrapper #palette_menu #custom_theme:before {
    -webkit-mask-image: var(--icon-custom_theme);
}
app-darkmode-palette-button .palette-menu-wrapper #palette_menu #custom_theme_settings {
    padding: 10px 20px;
}
app-darkmode-palette-button .palette-menu-wrapper #palette_menu #custom_theme_settings:before {
    -webkit-mask-image: var(--icon-custom_theme_settings);
    -webkit-mask-size: 20px !important;
}
app-darkmode-palette-button .palette-menu-wrapper #palette_menu #luna:before {
    -webkit-mask-image: var(--icon-luna);
}
app-darkmode-palette-button .palette-menu-wrapper #palette_menu #original_palette:before {
    -webkit-mask-image: var(--icon-original_palette);
}
app-darkmode-palette-button .palette-menu-wrapper #palette_menu #flat_palette:before {
    -webkit-mask-image: var(--icon-flat_palette);
}
app-darkmode-palette-button .palette-menu-wrapper #palette_menu #pen_palette:before {
    -webkit-mask-image: var(--icon-pen_palette);
}
app-darkmode-palette-button .palette-menu-wrapper #palette_menu #vanilla_palette:before {
    -webkit-mask-image: var(--icon-vanilla_palette);
}
app-darkmode-palette-button .palette-menu-wrapper #palette_menu #pastel_palette:before {
    -webkit-mask-image: var(--icon-pastel_palette);
}
app-darkmode-palette-button .palette-menu-wrapper #palette_menu #feedback_button:before {
    -webkit-mask-image: var(--icon-feedback_button);
}
app-darkmode-palette-button .palette-menu-wrapper #palette_menu #patchnote_button:before {
    -webkit-mask-image: var(--icon-patchnote_button);
}

app-darkmode-palette-button [tuiIconButton] {
    width: 70px !important;
    border-radius: 6.25rem 0 0 6.25rem !important;
    position: relative;
    transition: .5s;
}

app-darkmode-palette-button [tuiIconButton]:before {
    content: "";
    position: absolute;
    width: var(--tui-height-m);
    height: var(--tui-height-m);
    top: -2px;
    left: -1px;
    z-index: 1;
    background-image: url("data:image/png;base64,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");
    background-size: 34px !important;
    background-repeat: no-repeat !important;
    background-position: center;
    transition: transform .3s;
}

app-darkmode-palette-button [tuiIconButton]:hover:before {
    transform: rotate(0deg) !important;
}

app-darkmode-palette-button .wrapper:hover [tuiIconButton]:before {
    transform: rotate(-90deg);
}

app-darkmode-palette-button .wrapper:hover [tuiIconButton] {
    background-color: var(--tui-secondary-hover);
}

/* Фиксы FORGE
--------------------------------------------------------------------------------------------------
*/

td[bgcolor="#EFF0F1"] b {
    color: #000;
}

/* Фиксы TCRM
--------------------------------------------------------------------------------------------------
*/

body.dark-mode .balloon_sender_operator {
    background-color: #2c69ed !important;
}
body.dark-mode .balloon_sender_operator:after {
    border-color: transparent !important;
}

body.dark-mode .main-offers, .offer-dropdown {
    color: #fffc !important;
}

body.dark-mode [data-tui-host-status=primary],
body.dark-mode customer-info-personal-manager-transfer {
    color: #000 !important;
}

body.dark-mode notes-important-event {
    background-color: rgba(224,31,25,.2) !important;
}

body.dark-mode .state-icon {
    color: #fffc !important;
}

body.dark-mode .row_active .tui-table__td {
    background-color: #665500 !important;
}

body.dark-mode app-chat-transfer tui-svg:not(:empty) {
    filter: invert(100%) brightness(119%) contrast(119%) !important;
}

body.dark-mode chats-threads .item {
    background-color: #333 !important;
}

body.dark-mode chats-threads tui-avatar {
    background-color: #555 !important;
}

body.dark-mode app-problems .gradients-cover {
    background: #333 !important;
}

body.dark-mode app-problems .gradients-cover:before {
    background-image: linear-gradient(to bottom,#333,transparent) !important;
}

body.dark-mode app-problems .gradients-cover:after {
    background-image: linear-gradient(to top,#333,transparent) !important;
}

body.dark-mode app-problems .arrow:hover {
    background-color: #474b52 !important;
}

body.dark-mode app-customer {
    grid-template-columns: minmax(920px,3fr) minmax(160px,1fr) !important;
}

/* Библиотека Коллофф
--------------------------------------------------------------------------------------------------
*/

body.dark-mode #navbar,
body.dark-mode app-calls-feed .search,
body.dark-mode .pagin {
    background-color: var(--tui-base-01) !important;
    color: var(--tui-primary-text) !important;
}

body.dark-mode .pagin bui-button._hovered bui-outline {
    background: var(--tui-secondary-active) !important;
}

body.dark-mode app-calls-feed app-search bui-outline {
    background-color: var(--tui-secondary) !important;
    color: var(--tui-text-01) !important;
}

body.dark-mode app-calls-feed app-search bui-outline label {
    color: var(--tui-text-02) !important;
}

body.dark-mode bui-accordion-item {
    color: var(--tui-primary-text) !important;
}

body.dark-mode bui-accordion-item .wrapper {
    background-color: var(--tui-base-04) !important;
}

body.dark-mode bui-accordion-item .wrapper:after {
    border-color: var(--tui-base-03) !important;
}

body.dark-mode bui-accordion-item .header {
    color: var(--tui-primary-text) !important;
    border-bottom: 1px solid var(--tui-base-03) !important;
}

body.dark-mode bui-accordion-item .header_opened {
    background-color: var(--tui-base-05) !important;
}

body.dark-mode bui-accordion-item._hovered .header {
    background-color: var(--tui-base-05) !important;
}

body.dark-mode bui-checkbox-boxed bui-outline {
    background: var(--tui-secondary) !important;
    color: var(--tui-text-01) !important;
}

body.dark-mode .bui-table__td {
    color: var(--tui-text-01) !important;
}

body.dark-mode .bui-table__th {
    background-color: var(--tui-base-01) !important;
    border-bottom: 1px solid var(--tui-base-03) !important;
}

body.dark-mode .bui-table__tr {
    border-bottom: 1px solid var(--tui-base-03) !important;
}

body.dark-mode .bui-table__tr:hover {
    background-color: var(--tui-secondary-hover) !important;
}

body.dark-mode [data-bui-host-mode=textfield] {
    background: var(--tui-secondary) !important;
    color: var(--tui-text-01) !important;
}

body.dark-mode .wrapper-size-s,
body.dark-mode .wrapper-size-xs {
    --tui-secondary: var(--tui-secondary) !important;
    --tui-text-01: #fffc !important;
    --tui-secondary-hover: var(--tui-secondary-hover) !important;
}

body.dark-mode [data-bui-host-mode=textfield]._focused {
    background: var(--tui-base-01) !important;
}

body.dark-mode .call-code-div {
    border-color: transparent !important;
}

body.dark-mode [data-bui-host-mode=white] {
    opacity: .75 !important;
}

body.dark-mode app-login-form {
    color: var(--tui-primary-text);
}

body.dark-mode .login button {
    color: #000;
}

/* Библиотека Коллофф
--------------------------------------------------------------------------------------------------
*/

/*.contentContainer {
    filter: invert(.9) brightness(1.25) hue-rotate(180deg) !important;
}*/

/* Фикс перетаскивания контрололов
--------------------------------------------------------------------------------------------------
*/

body.dark-mode .cdk-drag-placeholder:before {
    background-color: #111;
}

/* Luna
--------------------------------------------------------------------------------------------------
*/
body.dark-mode app-procedures-console {
    z-index: 1000;
}

body.dark-mode app-console-view tui-expand .t-wrapper {
    position: relative;
}

body.dark-mode app-console-view tui-expand {
    overflow: visible !important;
}

body.dark-mode app-console-view > tui-expand > .t-wrapper > .content:before {
    content: '';
    height: 256px;
    width: 256px;
    background-image: url("data:image/png;base64,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");
    position: absolute;
    top: -203px;
    left: 163px;
    z-index: 1;
    visibility: hidden;
    transition: 1s ease-out;
    pointer-events: none;
    filter: drop-shadow(12px -12px 12px #00033366);
}

/* Фикс уведомлений ЦУПа
--------------------------------------------------------------------------------------------------
*/

app-page-layout > app-notification-block {
    position: fixed !important;
}

/* Фикс строки поиска
--------------------------------------------------------------------------------------------------
*/

app-search-widget tui-input .t-custom-content.ng-star-inserted {
    margin-right: 2.5rem !important;
    pointer-events: all !important;
}

app-procedures-console {
    background: #fff;
    z-index: 1;
}

/* Счетчик блоков
--------------------------------------------------------------------------------------------------
*/

#block_counter {
    margin: auto 1rem;
    padding: 0.5rem 0.8rem;
    border-radius: 100px;
    pointer-events: none;
    font-size: 1.5em;
    height: fit-content;
}

#block_counter.good {
    background: #0002;
}

#block_counter.norm {
    background: #ffc10722;
    color: #ffc107;
}

#block_counter.bad {
    background: #f4433622;
    color: #f44336;
}

#selected_blocks {
    background: var(--tui-base-01);
    min-width: 24px;
    display: inline-block;
    text-align: center;
    margin-left: 5px;
    border-radius: 12px;
    margin-right: -5px;
    color: var(--tui-primary-text);
    padding: 4px 8px;
}

#selected_blocks.hidden {
    display: none;
}

/* Счетчик блоков
--------------------------------------------------------------------------------------------------
*/

@keyframes glow {
  from {
    box-shadow: 0 0 10px -5px #f11e1e66;
  }
  to {
    box-shadow: 0 0 10px 5px #f11e1e66;
  }
}

.new-feature {
    position: relative;
}

.new-feature:after {
    position: absolute;
    border-radius: 100px;
    background-color: #f11e1e;
    animation: glow 1s infinite alternate;
    pointer-events: none;
}

.new-feature.-left:after {
    content: "NEW";
    color: #fff;
    padding: 5px 8px;
    font-size: .7em;
    font-weight: bold;
    letter-spacing: .1em;
    top: 10px;
    left: -55px;
    right: unset;
    bottom: unset;
}

.new-feature.-corner:after {
    content: "";
    padding: 6px;
    top: -5px;
    right: -5px;
    left: unset;
    bottom: unset;
}

#patch-note-window {
    position: absolute;
    width: 100vw;
    height: 100vh;
    backdrop-filter: blur(40px) brightness(50%);
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: .2s fade ease-in both;
}

.patch-note-card {
    max-width: 30vw;
    min-width: 500px;
    max-height: 90vh;
    padding: 1em;
    background: radial-gradient(circle at top center, var(--tui-base-03) 0%, var(--tui-base-01) 75%);
    border-radius: 1em;
    font-size: 1.2em;
    box-shadow: 0 1.125rem 1.875rem rgba(0,0,0,.48);
    position: relative;
    display: flex;
}

.patch-note-card-wrapper {
    display: flex;
    flex-direction: column;
}

@keyframes perspect {
  from {
    perspective: 100px;
  }
  to {
    opacity: 1;
  }
}

@keyframes corners {
  20%, 100% {
    margin: 10px;
    height: 16px;
    width: 16px;
  }
  0% {
    margin: 10px;
    height: 16px;
    width: 16px;
  }
  10% {
    margin: 15px;
    height: 20px;
    width: 20px;
  }
}

@keyframes fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.patch-note-card .l-t-corner,
.patch-note-card .r-t-corner,
.patch-note-card .r-b-corner,
.patch-note-card .l-b-corner {
    position: absolute;
    height: 16px;
    width: 16px;
    margin: 10px;
    animation: 5s corners 1s infinite ease-in-out;
}
.patch-note-card .corn-1,
.patch-note-card .corn-2 {
    position: absolute;
    background: var(--tui-base-04);
    border-radius: 3px;
    height: 6px;
    width: 6px;
}
.patch-note-card .corn-3 {
    position: absolute;
    width: calc(200% - 6px);
    height: calc(200% - 6px);
    border: 6px solid var(--tui-base-04);
}

.patch-note-card .l-t-corner {
    left: 0;
    top: 0;
}
.patch-note-card .l-t-corner .corn-1 {
    right: 0;
    top: 0;
}
.patch-note-card .l-t-corner .corn-2 {
    left: 0;
    bottom: 0;
}
.patch-note-card .l-t-corner .corn-3 {
    left: 0;
    top: 0;
    border-radius: 10px 0 0 0;
    clip-path: polygon(0% 0%, 50% 0%, 50% 50%, 0% 50%);
}

.patch-note-card .r-t-corner {
    right: 0;
    top: 0;
}
.patch-note-card .r-t-corner .corn-1 {
    left: 0;
    top: 0;
}
.patch-note-card .r-t-corner .corn-2 {
    right: 0;
    bottom: 0;
}
.patch-note-card .r-t-corner .corn-3 {
    right: 0;
    top: 0;
    border-radius: 0 10px 0 0;
    clip-path: polygon(50% 0%, 100% 0%, 100% 50%, 50% 50%);
}

.patch-note-card .r-b-corner {
    right: 0;
    bottom: 0;
}
.patch-note-card .r-b-corner .corn-1 {
    right: 0;
    top: 0;
}
.patch-note-card .r-b-corner .corn-2 {
    left: 0;
    bottom: 0;
}
.patch-note-card .r-b-corner .corn-3 {
    right: 0;
    bottom: 0;
    border-radius: 0 0 10px 0;
    clip-path: polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%);
}

.patch-note-card .l-b-corner {
    left: 0;
    bottom: 0;
}
.patch-note-card .l-b-corner .corn-1 {
    left: 0;
    top: 0;
}
.patch-note-card .l-b-corner .corn-2 {
    right: 0;
    bottom: 0;
}
.patch-note-card .l-b-corner .corn-3 {
    left: 0;
    bottom: 0;
    border-radius: 0 0 0 10px;
    clip-path: polygon(0% 50%, 50% 50%, 50% 100%, 0% 100%);
}

.patch-note-logo {
    background: #fff;
    height: 80px;
    width: 80px;
    border-radius: 20px;
    margin: 1.25em auto .75em;
    box-shadow: 0 1.125rem 1.875rem rgba(0,0,0,.48);
    background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbDpzcGFjZT0icHJlc2VydmUiPgogPGRlZnM+CiAgPHBhdHRlcm4gaGVpZ2h0PSI2OSIgaWQ9IlBvbGthX0RvdF9QYXR0ZXJuIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB2aWV3Qm94PSIyLjEyNSAtNzAuODk2IDY5IDY5IiB3aWR0aD0iNjkiIHk9IjUxMiI+CiAgIDxnIGlkPSJzdmdfMSI+CiAgICA8cG9seWdvbiBwb2ludHM9IjcxLjEyNSwtMS44OTYgMi4xMjUsLTEuODk2IDIuMTI1LC03MC44OTYgNzEuMTI1LC03MC44OTYgICAiIGZpbGw9Im5vbmUiIGlkPSJzdmdfMiIvPgogICAgPHBvbHlnb24gcG9pbnRzPSI3MS4xMjUsLTEuODk2IDIuMTI1LC0xLjg5NiAyLjEyNSwtNzAuODk2IDcxLjEyNSwtNzAuODk2ICAgIiBmaWxsPSIjRjZCQjYwIiBpZD0ic3ZnXzMiLz4KICAgIDxnIGlkPSJzdmdfNCI+CiAgICAgPHBhdGggZD0ibTYxLjc3MiwtNzEuNjUzYzAuMDE4LDAuMDcyIDAuMDA3LDAuMTI3IC0wLjAyNiwwLjE5Yy0wLjA1MywwLjEwMSAtMC4xMTIsMC4wNjIgLTAuMTY1LDAuMTI4Yy0wLjA1LDAuMDYyIC0wLjA5OSwwLjI3NiAtMC4wNzksMC4zNjJjLTAuMTY5LDAuMDU4IC0wLjAxLDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z181Ii8+CiAgICAgPHBhdGggZD0ibTU0LjEwNSwtNzEuNjUzYzAuMDE4LDAuMDcyIDAuMDA3LDAuMTI3IC0wLjAyNiwwLjE5Yy0wLjA1MywwLjEwMSAtMC4xMTIsMC4wNjIgLTAuMTY1LDAuMTI4Yy0wLjA1LDAuMDYyIC0wLjA5OSwwLjI3NiAtMC4wNzksMC4zNjJjLTAuMTY5LDAuMDU4IC0wLjAxLDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z182Ii8+CiAgICAgPHBhdGggZD0ibTQ2LjQzOSwtNzEuNjUzYzAuMDE4LDAuMDcyIDAuMDA3LDAuMTI3IC0wLjAyNiwwLjE5Yy0wLjA1MywwLjEwMSAtMC4xMTIsMC4wNjIgLTAuMTY1LDAuMTI4Yy0wLjA1LDAuMDYyIC0wLjA5OSwwLjI3NiAtMC4wNzksMC4zNjJjLTAuMTY5LDAuMDU4IC0wLjAxLDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z183Ii8+CiAgICAgPHBhdGggZD0ibTM4Ljc3MiwtNzEuNjUzYzAuMDE4LDAuMDcyIDAuMDA3LDAuMTI3IC0wLjAyNiwwLjE5Yy0wLjA1MywwLjEwMSAtMC4xMTIsMC4wNjIgLTAuMTY1LDAuMTI4Yy0wLjA1LDAuMDYyIC0wLjA5OSwwLjI3NiAtMC4wNzksMC4zNjJjLTAuMTY5LDAuMDU4IC0wLjAxLDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z184Ii8+CiAgICAgPHBhdGggZD0ibTMxLjEwNSwtNzEuNjUzYzAuMDE4LDAuMDcyIDAuMDA3LDAuMTI3IC0wLjAyNiwwLjE5Yy0wLjA1MywwLjEwMSAtMC4xMTIsMC4wNjIgLTAuMTY1LDAuMTI4Yy0wLjA1LDAuMDYyIC0wLjA5OSwwLjI3NiAtMC4wNzksMC4zNjJjLTAuMTY5LDAuMDU4IC0wLjAxLDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z185Ii8+CiAgICAgPHBhdGggZD0ibTIzLjQzOSwtNzEuNjUzYzAuMDE4LDAuMDcyIDAuMDA3LDAuMTI3IC0wLjAyNiwwLjE5Yy0wLjA1MywwLjEwMSAtMC4xMTIsMC4wNjIgLTAuMTY1LDAuMTI4Yy0wLjA1LDAuMDYyIC0wLjA5OSwwLjI3NiAtMC4wNzksMC4zNjJjLTAuMTY5LDAuMDU4IC0wLjAxLDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z18xMCIvPgogICAgIDxwYXRoIGQ9Im0xNS43NzIsLTcxLjY1M2MwLjAxOCwwLjA3MiAwLjAwNywwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTMsMC4xMDEgLTAuMTEyLDAuMDYyIC0wLjE2NSwwLjEyOGMtMC4wNSwwLjA2MiAtMC4wOTksMC4yNzYgLTAuMDc5LDAuMzYyYy0wLjE2OSwwLjA1OCAtMC4wMSwwLjIyNyAtMC4wMTUsMC4zNWMtMC4wMDIsMC4wNSAtMC4wNDEsMC4xMDUgLTAuMDQ1LDAuMTYxYy0wLjAxLDAuMTE5IDAuMDE3LDAuMjY2IDAuMDY4LDAuMzdjMC4wOTcsMC4xOTggMC4yNjgsMC40MTMgMC40MzUsMC41NDRjMC4xOSwwLjE0OCAwLjM2NSwwLjU3MiAwLjYwOCwwLjYzMWMwLjE3NywwLjA0MiAwLjM4NCwtMC4xMDQgMC41NDMsLTAuMTQzYzAuMTgsLTAuMDQzIDAuMzk3LDAuMDEgMC41NzEsLTAuMDUzYzAuMjIyLC0wLjA3OSAwLjEyNywtMC4zMzcgMC4yODgsLTAuNDVjMC4xMDQsLTAuMDc0IDAuMjg3LC0wLjAxIDAuNDA2LC0wLjA1MWMwLjIsLTAuMDY5IDAuMzM5LC0wLjI2MyAwLjM3NiwtMC40NmMwLjAxNiwtMC4wODIgMC4wMSwtMC4xNDUgMC4wMzksLTAuMjIxYzAuMDM5LC0wLjEwMyAwLjExMSwtMC4xNiAwLjA5LC0wLjI5M2MtMC4wMSwtMC4wNjIgLTAuMDUyLC0wLjEyIC0wLjA2NCwtMC4xODdjLTAuMDIyLC0wLjExNCAwLjAwMiwtMC4yMjQgMCwtMC4zMzdjLTAuMDAzLC0wLjIgMC4wMTcsLTAuMzc5IC0wLjA3OCwtMC41NWMtMC4zOCwtMC42ODggLTEuMjM2LC0wLjkyOSAtMS45NzUsLTAuNzg5Yy0wLjE4LDAuMDM0IC0wLjI4NywwLjEyNiAtMC40NDIsMC4yMDdjLTAuMTcsMC4wODggLTAuMTM5LDAuMTY2IC0wLjMxOCwwLjIyNGMtMC4wODEsMC4wMjYgLTAuMjE2LDAuMTI0IC0wLjIxNSwwLjIyNGMwLjAwMSwwLjExNSAwLjAwNSwwLjA1MSAwLjAxMiwwLjE2OWMtMC4wMjEsMC4wMTEgLTAuMDIxLC0wLjAwNSAtMC4wMywtMC4wMjUiIGZpbGw9IiNGRkZGRkYiIGlkPSJzdmdfMTEiLz4KICAgICA8cGF0aCBkPSJtOC4xMDUsLTcxLjY1M2MwLjAxOCwwLjA3MiAwLjAwNywwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTMsMC4xMDEgLTAuMTEyLDAuMDYyIC0wLjE2NSwwLjEyOGMtMC4wNSwwLjA2MiAtMC4wOTksMC4yNzYgLTAuMDc5LDAuMzYyYy0wLjE2OSwwLjA1OCAtMC4wMSwwLjIyNyAtMC4wMTUsMC4zNWMtMC4wMDIsMC4wNSAtMC4wNDEsMC4xMDUgLTAuMDQ1LDAuMTYxYy0wLjAxLDAuMTE5IDAuMDE3LDAuMjY2IDAuMDY4LDAuMzdjMC4wOTcsMC4xOTggMC4yNjgsMC40MTMgMC40MzUsMC41NDRjMC4xOSwwLjE0OCAwLjM2NSwwLjU3MiAwLjYwOCwwLjYzMWMwLjE3NywwLjA0MiAwLjM4NCwtMC4xMDQgMC41NDMsLTAuMTQzYzAuMTgsLTAuMDQzIDAuMzk3LDAuMDEgMC41NzEsLTAuMDUzYzAuMjIyLC0wLjA3OSAwLjEyNywtMC4zMzcgMC4yODgsLTAuNDVjMC4xMDQsLTAuMDc0IDAuMjg3LC0wLjAxIDAuNDA2LC0wLjA1MWMwLjIsLTAuMDY5IDAuMzM5LC0wLjI2MyAwLjM3NiwtMC40NmMwLjAxNiwtMC4wODIgMC4wMSwtMC4xNDUgMC4wMzksLTAuMjIxYzAuMDM5LC0wLjEwMyAwLjExMSwtMC4xNiAwLjA5LC0wLjI5M2MtMC4wMSwtMC4wNjIgLTAuMDUyLC0wLjEyIC0wLjA2NCwtMC4xODdjLTAuMDIyLC0wLjExNCAwLjAwMiwtMC4yMjQgMCwtMC4zMzdjLTAuMDAzLC0wLjIgMC4wMTcsLTAuMzc5IC0wLjA3OCwtMC41NWMtMC4zOCwtMC42ODggLTEuMjM2LC0wLjkyOSAtMS45NzUsLTAuNzg5Yy0wLjE4LDAuMDM0IC0wLjI4NywwLjEyNiAtMC40NDIsMC4yMDdjLTAuMTcsMC4wODggLTAuMTM5LDAuMTY2IC0wLjMxOCwwLjIyNGMtMC4wODEsMC4wMjYgLTAuMjE2LDAuMTI0IC0wLjIxNSwwLjIyNGMwLjAwMSwwLjExNSAwLjAwNSwwLjA1MSAwLjAxMiwwLjE2OWMtMC4wMjEsMC4wMTEgLTAuMDIxLC0wLjAwNSAtMC4wMywtMC4wMjUiIGZpbGw9IiNGRkZGRkYiIGlkPSJzdmdfMTIiLz4KICAgICA8cGF0aCBkPSJtMC40MzksLTcxLjY1M2MwLjAxOCwwLjA3MiAwLjAwOCwwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTIsMC4xMDEgLTAuMTEzLDAuMDYzIC0wLjE2NSwwLjEyOGMtMC4wNTEsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDEsMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzcsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA3IDAuMzM5LC0wLjI2MyAwLjM3NiwtMC40NmMwLjAxNiwtMC4wODIgMC4wMSwtMC4xNDUgMC4wMzksLTAuMjIxYzAuMDM4LC0wLjEwMyAwLjExMSwtMC4xNiAwLjA5LC0wLjI5M2MtMC4wMSwtMC4wNjIgLTAuMDUxLC0wLjEyIC0wLjA2NCwtMC4xODdjLTAuMDIxLC0wLjExNCAwLjAwMiwtMC4yMjQgMCwtMC4zMzdjLTAuMDAzLC0wLjIgMC4wMTcsLTAuMzc5IC0wLjA3OCwtMC41NWMtMC4zOCwtMC42ODggLTEuMjM2LC0wLjkyOSAtMS45NzUsLTAuNzg5Yy0wLjE4LDAuMDM0IC0wLjI4NywwLjEyNiAtMC40NDIsMC4yMDdjLTAuMTcsMC4wODggLTAuMTM5LDAuMTY2IC0wLjMxOCwwLjIyNGMtMC4wODEsMC4wMjYgLTAuMjE1LDAuMTI0IC0wLjIxNSwwLjIyNGMwLjAwMiwwLjExNSAwLjAwNSwwLjA1MSAwLjAxMiwwLjE2OWMtMC4wMjEsMC4wMTEgLTAuMDIxLC0wLjAwNSAtMC4wMywtMC4wMjUiIGZpbGw9IiNGRkZGRkYiIGlkPSJzdmdfMTMiLz4KICAgIDwvZz4KICAgIDxnIGlkPSJzdmdfMTQiPgogICAgIDxwYXRoIGQ9Im02OS40MzksLTcxLjY1M2MwLjAxOCwwLjA3MiAwLjAwOCwwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTIsMC4xMDEgLTAuMTEzLDAuMDYyIC0wLjE2NSwwLjEyOGMtMC4wNTEsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDEsMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzcsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA3IDAuMzM5LC0wLjI2MyAwLjM3NiwtMC40NmMwLjAxNiwtMC4wODIgMC4wMSwtMC4xNDUgMC4wMzksLTAuMjIxYzAuMDM4LC0wLjEwMyAwLjExMSwtMC4xNiAwLjA5LC0wLjI5M2MtMC4wMSwtMC4wNjIgLTAuMDUxLC0wLjEyIC0wLjA2NCwtMC4xODdjLTAuMDIxLC0wLjExNCAwLjAwMiwtMC4yMjQgMCwtMC4zMzdjLTAuMDAzLC0wLjIgMC4wMTcsLTAuMzc5IC0wLjA3OCwtMC41NWMtMC4zOCwtMC42ODggLTEuMjM2LC0wLjkyOSAtMS45NzUsLTAuNzg5Yy0wLjE4LDAuMDM0IC0wLjI4NywwLjEyNiAtMC40NDIsMC4yMDdjLTAuMTcsMC4wODggLTAuMTM5LDAuMTY2IC0wLjMxOCwwLjIyNGMtMC4wODEsMC4wMjYgLTAuMjE1LDAuMTI0IC0wLjIxNSwwLjIyNGMwLjAwMiwwLjExNSAwLjAwNSwwLjA1MSAwLjAxMiwwLjE2OWMtMC4wMjEsMC4wMTEgLTAuMDIxLC0wLjAwNSAtMC4wMywtMC4wMjUiIGZpbGw9IiNGRkZGRkYiIGlkPSJzdmdfMTUiLz4KICAgIDwvZz4KICAgIDxwYXRoIGQ9Im0wLjQ5NSwtNzEuNjUzYzAuMDE4LDAuMDcyIDAuMDA4LDAuMTI3IC0wLjAyNiwwLjE5Yy0wLjA1MiwwLjEwMSAtMC4xMTMsMC4wNjIgLTAuMTY1LDAuMTI4Yy0wLjA1MSwwLjA2MiAtMC4wOTksMC4yNzYgLTAuMDc5LDAuMzYyYy0wLjE2OSwwLjA1OCAtMC4wMSwwLjIyNyAtMC4wMTUsMC4zNWMtMC4wMDIsMC4wNSAtMC4wNDEsMC4xMDUgLTAuMDQ1LDAuMTYxYy0wLjAxLDAuMTE5IDAuMDE3LDAuMjY2IDAuMDY4LDAuMzdjMC4wOTcsMC4xOTggMC4yNjgsMC40MTMgMC40MzUsMC41NDRjMC4xOSwwLjE0OCAwLjM2NSwwLjU3MiAwLjYwOCwwLjYzMWMwLjE3NywwLjA0MiAwLjM4NCwtMC4xMDQgMC41NDMsLTAuMTQzYzAuMTgsLTAuMDQzIDAuMzk3LDAuMDEgMC41NzEsLTAuMDUzYzAuMjIyLC0wLjA3OSAwLjEyNywtMC4zMzcgMC4yODgsLTAuNDVjMC4xMDQsLTAuMDc0IDAuMjg3LC0wLjAxIDAuNDA2LC0wLjA1MWMwLjIsLTAuMDcgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzgsLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTEsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjEsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTUsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAzLDAuMTE2IDAuMDA2LDAuMDUyIDAuMDEzLDAuMTdjLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzE2Ii8+CiAgICA8ZyBpZD0ic3ZnXzE3Ij4KICAgICA8ZyBpZD0ic3ZnXzE4Ij4KICAgICAgPHBhdGggZD0ibTY5LjQzOSwtNjQuMDAxYzAuMDE4LDAuMDcyIDAuMDA3LDAuMTI3IC0wLjAyNiwwLjE5Yy0wLjA1MywwLjEwMSAtMC4xMTIsMC4wNjIgLTAuMTY1LDAuMTI4Yy0wLjA1LDAuMDYyIC0wLjA5OSwwLjI3NiAtMC4wNzksMC4zNjJjLTAuMTY5LDAuMDU4IC0wLjAxLDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z18xOSIvPgogICAgICA8cGF0aCBkPSJtNjEuNzc4LC02NC4wMDFjMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDA5LDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z18yMCIvPgogICAgICA8cGF0aCBkPSJtNTQuMTE4LC02NC4wMDFjMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDA5LDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z18yMSIvPgogICAgICA8cGF0aCBkPSJtNDYuNDU4LC02NC4wMDFjMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDA5LDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z18yMiIvPgogICAgICA8cGF0aCBkPSJtMzguNzk3LC02NC4wMDFjMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDA5LDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z18yMyIvPgogICAgICA8cGF0aCBkPSJtMzEuMTM3LC02NC4wMDFjMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDA5LDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z18yNCIvPgogICAgICA8cGF0aCBkPSJtMjMuNDc3LC02NC4wMDFjMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDA5LDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z18yNSIvPgogICAgICA8cGF0aCBkPSJtMTUuODE2LC02NC4wMDFjMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDA5LDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z18yNiIvPgogICAgICA8cGF0aCBkPSJtOC4xNTYsLTY0LjAwMWMwLjAxOCwwLjA3MiAwLjAwNywwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTMsMC4xMDEgLTAuMTEyLDAuMDYyIC0wLjE2NSwwLjEyOGMtMC4wNSwwLjA2MiAtMC4wOTksMC4yNzYgLTAuMDc5LDAuMzYyYy0wLjE2OSwwLjA1OCAtMC4wMDksMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzcsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA2OSAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOSwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MiwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMiwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNiwwLjEyNCAtMC4yMTUsMC4yMjRjMC4wMDEsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzI3Ii8+CiAgICAgIDxwYXRoIGQ9Im0wLjQ5NSwtNjQuMDAxYzAuMDE4LDAuMDcyIDAuMDA3LDAuMTI3IC0wLjAyNiwwLjE5Yy0wLjA1MywwLjEwMSAtMC4xMTIsMC4wNjIgLTAuMTY1LDAuMTI4Yy0wLjA1LDAuMDYyIC0wLjA5OSwwLjI3NiAtMC4wNzksMC4zNjJjLTAuMTY5LDAuMDU4IC0wLjAxLDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xODEsLTAuMDQyIDAuMzk4LDAuMDExIDAuNTcyLC0wLjA1MmMwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA2OSAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOSwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MiwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMiwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNiwwLjEyNCAtMC4yMTUsMC4yMjRjMC4wMDEsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzI4Ii8+CiAgICAgPC9nPgogICAgIDxnIGlkPSJzdmdfMjkiPgogICAgICA8cGF0aCBkPSJtNjkuNDM5LC01Ni4zNDhjMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDEsMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzcsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA2OSAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOSwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MiwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMiwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNiwwLjEyNCAtMC4yMTUsMC4yMjRjMC4wMDEsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzMwIi8+CiAgICAgIDxwYXRoIGQ9Im02MS43NzgsLTU2LjM0OGMwLjAxOCwwLjA3MiAwLjAwNywwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTMsMC4xMDEgLTAuMTEyLDAuMDYyIC0wLjE2NSwwLjEyOGMtMC4wNSwwLjA2MiAtMC4wOTksMC4yNzYgLTAuMDc5LDAuMzYyYy0wLjE2OSwwLjA1OCAtMC4wMDksMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzcsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA2OSAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOSwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MiwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMiwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNiwwLjEyNCAtMC4yMTUsMC4yMjRjMC4wMDEsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzMxIi8+CiAgICAgIDxwYXRoIGQ9Im01NC4xMTgsLTU2LjM0OGMwLjAxOCwwLjA3MiAwLjAwNywwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTMsMC4xMDEgLTAuMTEyLDAuMDYyIC0wLjE2NSwwLjEyOGMtMC4wNSwwLjA2MiAtMC4wOTksMC4yNzYgLTAuMDc5LDAuMzYyYy0wLjE2OSwwLjA1OCAtMC4wMDksMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzcsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA2OSAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOSwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MiwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMiwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNiwwLjEyNCAtMC4yMTUsMC4yMjRjMC4wMDEsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzMyIi8+CiAgICAgIDxwYXRoIGQ9Im00Ni40NTgsLTU2LjM0OGMwLjAxOCwwLjA3MiAwLjAwNywwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTMsMC4xMDEgLTAuMTEyLDAuMDYyIC0wLjE2NSwwLjEyOGMtMC4wNSwwLjA2MiAtMC4wOTksMC4yNzYgLTAuMDc5LDAuMzYyYy0wLjE2OSwwLjA1OCAtMC4wMDksMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzcsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA2OSAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOSwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MiwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMiwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNiwwLjEyNCAtMC4yMTUsMC4yMjRjMC4wMDEsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzMzIi8+CiAgICAgIDxwYXRoIGQ9Im0zOC43OTcsLTU2LjM0OGMwLjAxOCwwLjA3MiAwLjAwNywwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTMsMC4xMDEgLTAuMTEyLDAuMDYyIC0wLjE2NSwwLjEyOGMtMC4wNSwwLjA2MiAtMC4wOTksMC4yNzYgLTAuMDc5LDAuMzYyYy0wLjE2OSwwLjA1OCAtMC4wMDksMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzcsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA2OSAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOSwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MiwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMiwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNiwwLjEyNCAtMC4yMTUsMC4yMjRjMC4wMDEsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzM0Ii8+CiAgICAgIDxwYXRoIGQ9Im0zMS4xMzcsLTU2LjM0OGMwLjAxOCwwLjA3MiAwLjAwNywwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTMsMC4xMDEgLTAuMTEyLDAuMDYyIC0wLjE2NSwwLjEyOGMtMC4wNSwwLjA2MiAtMC4wOTksMC4yNzYgLTAuMDc5LDAuMzYyYy0wLjE2OSwwLjA1OCAtMC4wMDksMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzcsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA2OSAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOSwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MiwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMiwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNiwwLjEyNCAtMC4yMTUsMC4yMjRjMC4wMDEsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzM1Ii8+CiAgICAgIDxwYXRoIGQ9Im0yMy40NzcsLTU2LjM0OGMwLjAxOCwwLjA3MiAwLjAwNywwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTMsMC4xMDEgLTAuMTEyLDAuMDYyIC0wLjE2NSwwLjEyOGMtMC4wNSwwLjA2MiAtMC4wOTksMC4yNzYgLTAuMDc5LDAuMzYyYy0wLjE2OSwwLjA1OCAtMC4wMDksMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzcsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA2OSAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOSwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MiwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMiwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNiwwLjEyNCAtMC4yMTUsMC4yMjRjMC4wMDEsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzM2Ii8+CiAgICAgIDxwYXRoIGQ9Im0xNS44MTYsLTU2LjM0OGMwLjAxOCwwLjA3MiAwLjAwNywwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTMsMC4xMDEgLTAuMTEyLDAuMDYyIC0wLjE2NSwwLjEyOGMtMC4wNSwwLjA2MiAtMC4wOTksMC4yNzYgLTAuMDc5LDAuMzYyYy0wLjE2OSwwLjA1OCAtMC4wMDksMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzcsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA2OSAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOSwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MiwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMiwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNiwwLjEyNCAtMC4yMTUsMC4yMjRjMC4wMDEsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzM3Ii8+CiAgICAgIDxwYXRoIGQ9Im04LjE1NiwtNTYuMzQ4YzAuMDE4LDAuMDcyIDAuMDA3LDAuMTI3IC0wLjAyNiwwLjE5Yy0wLjA1MywwLjEwMSAtMC4xMTIsMC4wNjIgLTAuMTY1LDAuMTI4Yy0wLjA1LDAuMDYyIC0wLjA5OSwwLjI3NiAtMC4wNzksMC4zNjJjLTAuMTY5LDAuMDU4IC0wLjAwOSwwLjIyNyAtMC4wMTUsMC4zNWMtMC4wMDIsMC4wNSAtMC4wNDEsMC4xMDUgLTAuMDQ1LDAuMTYxYy0wLjAxLDAuMTE5IDAuMDE3LDAuMjY2IDAuMDY4LDAuMzdjMC4wOTcsMC4xOTggMC4yNjgsMC40MTMgMC40MzUsMC41NDRjMC4xOSwwLjE0OCAwLjM2NSwwLjU3MiAwLjYwOCwwLjYzMWMwLjE3NywwLjA0MiAwLjM4NCwtMC4xMDQgMC41NDMsLTAuMTQzYzAuMTgsLTAuMDQzIDAuMzk3LDAuMDEgMC41NzEsLTAuMDUzYzAuMjIyLC0wLjA3OSAwLjEyNywtMC4zMzcgMC4yODgsLTAuNDVjMC4xMDQsLTAuMDc0IDAuMjg3LC0wLjAxIDAuNDA2LC0wLjA1MWMwLjIsLTAuMDY5IDAuMzM5LC0wLjI2MyAwLjM3NiwtMC40NmMwLjAxNiwtMC4wODIgMC4wMSwtMC4xNDUgMC4wMzksLTAuMjIxYzAuMDM5LC0wLjEwMyAwLjExMSwtMC4xNiAwLjA5LC0wLjI5M2MtMC4wMSwtMC4wNjIgLTAuMDUyLC0wLjEyIC0wLjA2NCwtMC4xODdjLTAuMDIyLC0wLjExNCAwLjAwMiwtMC4yMjQgMCwtMC4zMzdjLTAuMDAzLC0wLjIgMC4wMTcsLTAuMzc5IC0wLjA3OCwtMC41NWMtMC4zOCwtMC42ODggLTEuMjM2LC0wLjkyOSAtMS45NzUsLTAuNzg5Yy0wLjE4LDAuMDM0IC0wLjI4NywwLjEyNiAtMC40NDIsMC4yMDdjLTAuMTcsMC4wODggLTAuMTM5LDAuMTY2IC0wLjMxOCwwLjIyNGMtMC4wODEsMC4wMjYgLTAuMjE2LDAuMTI0IC0wLjIxNSwwLjIyNGMwLjAwMSwwLjExNSAwLjAwNSwwLjA1MSAwLjAxMiwwLjE2OWMtMC4wMjEsMC4wMTEgLTAuMDIxLC0wLjAwNSAtMC4wMywtMC4wMjUiIGZpbGw9IiNGRkZGRkYiIGlkPSJzdmdfMzgiLz4KICAgICAgPHBhdGggZD0ibTAuNDk1LC01Ni4zNDhjMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDEsMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzcsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA2OSAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOSwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MiwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMiwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNiwwLjEyNCAtMC4yMTUsMC4yMjRjMC4wMDMsMC4xMTcgMC4wMDYsMC4wNTMgMC4wMTMsMC4xNzFjLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzM5Ii8+CiAgICAgPC9nPgogICAgIDxnIGlkPSJzdmdfNDAiPgogICAgICA8cGF0aCBkPSJtNjkuNDM5LC00OC42OTVjMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDEsMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzcsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA2OSAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOSwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MiwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMiwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNiwwLjEyNCAtMC4yMTUsMC4yMjRjMC4wMDEsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzQxIi8+CiAgICAgIDxwYXRoIGQ9Im02MS43NzgsLTQ4LjY5NWMwLjAxOCwwLjA3MiAwLjAwNywwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTMsMC4xMDEgLTAuMTEyLDAuMDYyIC0wLjE2NSwwLjEyOGMtMC4wNSwwLjA2MiAtMC4wOTksMC4yNzYgLTAuMDc5LDAuMzYyYy0wLjE2OSwwLjA1OCAtMC4wMDksMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzcsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA2OSAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOSwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MiwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMiwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNiwwLjEyNCAtMC4yMTUsMC4yMjRjMC4wMDEsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzQyIi8+CiAgICAgIDxwYXRoIGQ9Im01NC4xMTgsLTQ4LjY5NWMwLjAxOCwwLjA3MiAwLjAwNywwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTMsMC4xMDEgLTAuMTEyLDAuMDYyIC0wLjE2NSwwLjEyOGMtMC4wNSwwLjA2MiAtMC4wOTksMC4yNzYgLTAuMDc5LDAuMzYyYy0wLjE2OSwwLjA1OCAtMC4wMDksMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzcsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA2OSAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOSwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MiwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMiwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNiwwLjEyNCAtMC4yMTUsMC4yMjRjMC4wMDEsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzQzIi8+CiAgICAgIDxwYXRoIGQ9Im00Ni40NTgsLTQ4LjY5NWMwLjAxOCwwLjA3MiAwLjAwNywwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTMsMC4xMDEgLTAuMTEyLDAuMDYyIC0wLjE2NSwwLjEyOGMtMC4wNSwwLjA2MiAtMC4wOTksMC4yNzYgLTAuMDc5LDAuMzYyYy0wLjE2OSwwLjA1OCAtMC4wMDksMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzcsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA2OSAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOSwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MiwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMiwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNiwwLjEyNCAtMC4yMTUsMC4yMjRjMC4wMDEsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzQ0Ii8+CiAgICAgIDxwYXRoIGQ9Im0zOC43OTcsLTQ4LjY5NWMwLjAxOCwwLjA3MiAwLjAwNywwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTMsMC4xMDEgLTAuMTEyLDAuMDYyIC0wLjE2NSwwLjEyOGMtMC4wNSwwLjA2MiAtMC4wOTksMC4yNzYgLTAuMDc5LDAuMzYyYy0wLjE2OSwwLjA1OCAtMC4wMDksMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzcsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA2OSAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOSwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MiwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMiwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNiwwLjEyNCAtMC4yMTUsMC4yMjRjMC4wMDEsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzQ1Ii8+CiAgICAgIDxwYXRoIGQ9Im0zMS4xMzcsLTQ4LjY5NWMwLjAxOCwwLjA3MiAwLjAwNywwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTMsMC4xMDEgLTAuMTEyLDAuMDYyIC0wLjE2NSwwLjEyOGMtMC4wNSwwLjA2MiAtMC4wOTksMC4yNzYgLTAuMDc5LDAuMzYyYy0wLjE2OSwwLjA1OCAtMC4wMDksMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzcsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA2OSAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOSwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MiwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMiwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNiwwLjEyNCAtMC4yMTUsMC4yMjRjMC4wMDEsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzQ2Ii8+CiAgICAgIDxwYXRoIGQ9Im0yMy40NzcsLTQ4LjY5NWMwLjAxOCwwLjA3MiAwLjAwNywwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTMsMC4xMDEgLTAuMTEyLDAuMDYyIC0wLjE2NSwwLjEyOGMtMC4wNSwwLjA2MiAtMC4wOTksMC4yNzYgLTAuMDc5LDAuMzYyYy0wLjE2OSwwLjA1OCAtMC4wMDksMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzcsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA2OSAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOSwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MiwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMiwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNiwwLjEyNCAtMC4yMTUsMC4yMjRjMC4wMDEsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzQ3Ii8+CiAgICAgIDxwYXRoIGQ9Im0xNS44MTYsLTQ4LjY5NWMwLjAxOCwwLjA3MiAwLjAwNywwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTMsMC4xMDEgLTAuMTEyLDAuMDYyIC0wLjE2NSwwLjEyOGMtMC4wNSwwLjA2MiAtMC4wOTksMC4yNzYgLTAuMDc5LDAuMzYyYy0wLjE2OSwwLjA1OCAtMC4wMDksMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzcsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA2OSAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOSwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MiwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMiwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNiwwLjEyNCAtMC4yMTUsMC4yMjRjMC4wMDEsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzQ4Ii8+CiAgICAgIDxwYXRoIGQ9Im04LjE1NiwtNDguNjk1YzAuMDE4LDAuMDcyIDAuMDA3LDAuMTI3IC0wLjAyNiwwLjE5Yy0wLjA1MywwLjEwMSAtMC4xMTIsMC4wNjIgLTAuMTY1LDAuMTI4Yy0wLjA1LDAuMDYyIC0wLjA5OSwwLjI3NiAtMC4wNzksMC4zNjJjLTAuMTY5LDAuMDU4IC0wLjAwOSwwLjIyNyAtMC4wMTUsMC4zNWMtMC4wMDIsMC4wNSAtMC4wNDEsMC4xMDUgLTAuMDQ1LDAuMTYxYy0wLjAxLDAuMTE5IDAuMDE3LDAuMjY2IDAuMDY4LDAuMzdjMC4wOTcsMC4xOTggMC4yNjgsMC40MTMgMC40MzUsMC41NDRjMC4xOSwwLjE0OCAwLjM2NSwwLjU3MiAwLjYwOCwwLjYzMWMwLjE3NywwLjA0MiAwLjM4NCwtMC4xMDQgMC41NDMsLTAuMTQzYzAuMTgsLTAuMDQzIDAuMzk3LDAuMDEgMC41NzEsLTAuMDUzYzAuMjIyLC0wLjA3OSAwLjEyNywtMC4zMzcgMC4yODgsLTAuNDVjMC4xMDQsLTAuMDc0IDAuMjg3LC0wLjAxIDAuNDA2LC0wLjA1MWMwLjIsLTAuMDY5IDAuMzM5LC0wLjI2MyAwLjM3NiwtMC40NmMwLjAxNiwtMC4wODIgMC4wMSwtMC4xNDUgMC4wMzksLTAuMjIxYzAuMDM5LC0wLjEwMyAwLjExMSwtMC4xNiAwLjA5LC0wLjI5M2MtMC4wMSwtMC4wNjIgLTAuMDUyLC0wLjEyIC0wLjA2NCwtMC4xODdjLTAuMDIyLC0wLjExNCAwLjAwMiwtMC4yMjQgMCwtMC4zMzdjLTAuMDAzLC0wLjIgMC4wMTcsLTAuMzc5IC0wLjA3OCwtMC41NWMtMC4zOCwtMC42ODggLTEuMjM2LC0wLjkyOSAtMS45NzUsLTAuNzg5Yy0wLjE4LDAuMDM0IC0wLjI4NywwLjEyNiAtMC40NDIsMC4yMDdjLTAuMTcsMC4wODggLTAuMTM5LDAuMTY2IC0wLjMxOCwwLjIyNGMtMC4wODEsMC4wMjYgLTAuMjE2LDAuMTI0IC0wLjIxNSwwLjIyNGMwLjAwMSwwLjExNSAwLjAwNSwwLjA1MSAwLjAxMiwwLjE2OWMtMC4wMjEsMC4wMTEgLTAuMDIxLC0wLjAwNSAtMC4wMywtMC4wMjUiIGZpbGw9IiNGRkZGRkYiIGlkPSJzdmdfNDkiLz4KICAgICAgPHBhdGggZD0ibTAuNDk1LC00OC42OTVjMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDEsMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzcsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA2OSAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOSwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MiwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMiwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNiwwLjEyNCAtMC4yMTUsMC4yMjRjMC4wMDEsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzUwIi8+CiAgICAgPC9nPgogICAgIDxnIGlkPSJzdmdfNTEiPgogICAgICA8cGF0aCBkPSJtNjkuNDM5LC00MS4wNDJjMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDEsMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzcsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA2OSAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOSwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MiwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMiwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNiwwLjEyNCAtMC4yMTUsMC4yMjRjMC4wMDEsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzUyIi8+CiAgICAgIDxwYXRoIGQ9Im02MS43NzgsLTQxLjA0MmMwLjAxOCwwLjA3MiAwLjAwNywwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTMsMC4xMDEgLTAuMTEyLDAuMDYyIC0wLjE2NSwwLjEyOGMtMC4wNSwwLjA2MiAtMC4wOTksMC4yNzYgLTAuMDc5LDAuMzYyYy0wLjE2OSwwLjA1OCAtMC4wMDksMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzcsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA2OSAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOSwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MiwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMiwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNiwwLjEyNCAtMC4yMTUsMC4yMjRjMC4wMDEsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzUzIi8+CiAgICAgIDxwYXRoIGQ9Im01NC4xMTgsLTQxLjA0MmMwLjAxOCwwLjA3MiAwLjAwNywwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTMsMC4xMDEgLTAuMTEyLDAuMDYyIC0wLjE2NSwwLjEyOGMtMC4wNSwwLjA2MiAtMC4wOTksMC4yNzYgLTAuMDc5LDAuMzYyYy0wLjE2OSwwLjA1OCAtMC4wMDksMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzcsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA2OSAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOSwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MiwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMiwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNiwwLjEyNCAtMC4yMTUsMC4yMjRjMC4wMDEsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzU0Ii8+CiAgICAgIDxwYXRoIGQ9Im00Ni40NTgsLTQxLjA0MmMwLjAxOCwwLjA3MiAwLjAwNywwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTMsMC4xMDEgLTAuMTEyLDAuMDYyIC0wLjE2NSwwLjEyOGMtMC4wNSwwLjA2MiAtMC4wOTksMC4yNzYgLTAuMDc5LDAuMzYyYy0wLjE2OSwwLjA1OCAtMC4wMDksMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzcsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA2OSAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOSwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MiwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMiwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNiwwLjEyNCAtMC4yMTUsMC4yMjRjMC4wMDEsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzU1Ii8+CiAgICAgIDxwYXRoIGQ9Im0zOC43OTcsLTQxLjA0MmMwLjAxOCwwLjA3MiAwLjAwNywwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTMsMC4xMDEgLTAuMTEyLDAuMDYyIC0wLjE2NSwwLjEyOGMtMC4wNSwwLjA2MiAtMC4wOTksMC4yNzYgLTAuMDc5LDAuMzYyYy0wLjE2OSwwLjA1OCAtMC4wMDksMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzcsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA2OSAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOSwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MiwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMiwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNiwwLjEyNCAtMC4yMTUsMC4yMjRjMC4wMDEsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzU2Ii8+CiAgICAgIDxwYXRoIGQ9Im0zMS4xMzcsLTQxLjA0MmMwLjAxOCwwLjA3MiAwLjAwNywwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTMsMC4xMDEgLTAuMTEyLDAuMDYyIC0wLjE2NSwwLjEyOGMtMC4wNSwwLjA2MiAtMC4wOTksMC4yNzYgLTAuMDc5LDAuMzYyYy0wLjE2OSwwLjA1OCAtMC4wMDksMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzcsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA2OSAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOSwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MiwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMiwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNiwwLjEyNCAtMC4yMTUsMC4yMjRjMC4wMDEsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzU3Ii8+CiAgICAgIDxwYXRoIGQ9Im0yMy40NzcsLTQxLjA0MmMwLjAxOCwwLjA3MiAwLjAwNywwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTMsMC4xMDEgLTAuMTEyLDAuMDYyIC0wLjE2NSwwLjEyOGMtMC4wNSwwLjA2MiAtMC4wOTksMC4yNzYgLTAuMDc5LDAuMzYyYy0wLjE2OSwwLjA1OCAtMC4wMDksMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzcsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA2OSAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOSwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MiwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMiwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNiwwLjEyNCAtMC4yMTUsMC4yMjRjMC4wMDEsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzU4Ii8+CiAgICAgIDxwYXRoIGQ9Im0xNS44MTYsLTQxLjA0MmMwLjAxOCwwLjA3MiAwLjAwNywwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTMsMC4xMDEgLTAuMTEyLDAuMDYyIC0wLjE2NSwwLjEyOGMtMC4wNSwwLjA2MiAtMC4wOTksMC4yNzYgLTAuMDc5LDAuMzYyYy0wLjE2OSwwLjA1OCAtMC4wMDksMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzcsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA2OSAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOSwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MiwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMiwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNiwwLjEyNCAtMC4yMTUsMC4yMjRjMC4wMDEsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzU5Ii8+CiAgICAgIDxwYXRoIGQ9Im04LjE1NiwtNDEuMDQyYzAuMDE4LDAuMDcyIDAuMDA3LDAuMTI3IC0wLjAyNiwwLjE5Yy0wLjA1MywwLjEwMSAtMC4xMTIsMC4wNjIgLTAuMTY1LDAuMTI4Yy0wLjA1LDAuMDYyIC0wLjA5OSwwLjI3NiAtMC4wNzksMC4zNjJjLTAuMTY5LDAuMDU4IC0wLjAwOSwwLjIyNyAtMC4wMTUsMC4zNWMtMC4wMDIsMC4wNSAtMC4wNDEsMC4xMDUgLTAuMDQ1LDAuMTYxYy0wLjAxLDAuMTE5IDAuMDE3LDAuMjY2IDAuMDY4LDAuMzdjMC4wOTcsMC4xOTggMC4yNjgsMC40MTMgMC40MzUsMC41NDRjMC4xOSwwLjE0OCAwLjM2NSwwLjU3MiAwLjYwOCwwLjYzMWMwLjE3NywwLjA0MiAwLjM4NCwtMC4xMDQgMC41NDMsLTAuMTQzYzAuMTgsLTAuMDQzIDAuMzk3LDAuMDEgMC41NzEsLTAuMDUzYzAuMjIyLC0wLjA3OSAwLjEyNywtMC4zMzcgMC4yODgsLTAuNDVjMC4xMDQsLTAuMDc0IDAuMjg3LC0wLjAxIDAuNDA2LC0wLjA1MWMwLjIsLTAuMDY5IDAuMzM5LC0wLjI2MyAwLjM3NiwtMC40NmMwLjAxNiwtMC4wODIgMC4wMSwtMC4xNDUgMC4wMzksLTAuMjIxYzAuMDM5LC0wLjEwMyAwLjExMSwtMC4xNiAwLjA5LC0wLjI5M2MtMC4wMSwtMC4wNjIgLTAuMDUyLC0wLjEyIC0wLjA2NCwtMC4xODdjLTAuMDIyLC0wLjExNCAwLjAwMiwtMC4yMjQgMCwtMC4zMzdjLTAuMDAzLC0wLjIgMC4wMTcsLTAuMzc5IC0wLjA3OCwtMC41NWMtMC4zOCwtMC42ODggLTEuMjM2LC0wLjkyOSAtMS45NzUsLTAuNzg5Yy0wLjE4LDAuMDM0IC0wLjI4NywwLjEyNiAtMC40NDIsMC4yMDdjLTAuMTcsMC4wODggLTAuMTM5LDAuMTY2IC0wLjMxOCwwLjIyNGMtMC4wODEsMC4wMjYgLTAuMjE2LDAuMTI0IC0wLjIxNSwwLjIyNGMwLjAwMSwwLjExNSAwLjAwNSwwLjA1MSAwLjAxMiwwLjE2OWMtMC4wMiwwLjAxMiAtMC4wMjEsLTAuMDA0IC0wLjAzLC0wLjAyNCIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z182MCIvPgogICAgICA8cGF0aCBkPSJtMC40OTUsLTQxLjA0MmMwLjAxOCwwLjA3MiAwLjAwNywwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTMsMC4xMDEgLTAuMTEyLDAuMDYyIC0wLjE2NSwwLjEyOGMtMC4wNSwwLjA2MiAtMC4wOTksMC4yNzYgLTAuMDc5LDAuMzYyYy0wLjE2OSwwLjA1OCAtMC4wMSwwLjIyNyAtMC4wMTUsMC4zNWMtMC4wMDIsMC4wNSAtMC4wNDEsMC4xMDUgLTAuMDQ1LDAuMTYxYy0wLjAxLDAuMTE5IDAuMDE3LDAuMjY2IDAuMDY4LDAuMzdjMC4wOTcsMC4xOTggMC4yNjgsMC40MTMgMC40MzUsMC41NDRjMC4xOSwwLjE0OCAwLjM2NSwwLjU3MiAwLjYwOCwwLjYzMWMwLjE3NywwLjA0MiAwLjM4NCwtMC4xMDQgMC41NDMsLTAuMTQzYzAuMTgsLTAuMDQzIDAuMzk3LDAuMDEgMC41NzEsLTAuMDUzYzAuMjIyLC0wLjA3OSAwLjEyNywtMC4zMzcgMC4yODgsLTAuNDVjMC4xMDQsLTAuMDc0IDAuMjg3LC0wLjAxIDAuNDA2LC0wLjA1MWMwLjIsLTAuMDY5IDAuMzM5LC0wLjI2MyAwLjM3NiwtMC40NmMwLjAxNiwtMC4wODIgMC4wMSwtMC4xNDUgMC4wMzksLTAuMjIxYzAuMDM5LC0wLjEwMyAwLjExMSwtMC4xNiAwLjA5LC0wLjI5M2MtMC4wMSwtMC4wNjIgLTAuMDUyLC0wLjEyIC0wLjA2NCwtMC4xODdjLTAuMDIyLC0wLjExNCAwLjAwMiwtMC4yMjQgMCwtMC4zMzdjLTAuMDAzLC0wLjIgMC4wMTcsLTAuMzc5IC0wLjA3OCwtMC41NWMtMC4zOCwtMC42ODggLTEuMjM2LC0wLjkyOSAtMS45NzUsLTAuNzg5Yy0wLjE4LDAuMDM0IC0wLjI4NywwLjEyNiAtMC40NDIsMC4yMDdjLTAuMTcsMC4wODggLTAuMTM5LDAuMTY2IC0wLjMxOCwwLjIyNGMtMC4wODEsMC4wMjYgLTAuMjE2LDAuMTI0IC0wLjIxNSwwLjIyNGMwLjAwMSwwLjExNSAwLjAwNSwwLjA1MSAwLjAxMiwwLjE2OWMtMC4wMjEsMC4wMTEgLTAuMDIxLC0wLjAwNSAtMC4wMywtMC4wMjUiIGZpbGw9IiNGRkZGRkYiIGlkPSJzdmdfNjEiLz4KICAgICA8L2c+CiAgICAgPGcgaWQ9InN2Z182MiI+CiAgICAgIDxwYXRoIGQ9Im02OS40MzksLTMzLjM5YzAuMDE4LDAuMDcyIDAuMDA3LDAuMTI3IC0wLjAyNiwwLjE5Yy0wLjA1MywwLjEwMSAtMC4xMTIsMC4wNjIgLTAuMTY1LDAuMTI4Yy0wLjA1LDAuMDYyIC0wLjA5OSwwLjI3NiAtMC4wNzksMC4zNjJjLTAuMTY5LDAuMDU4IC0wLjAxLDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z182MyIvPgogICAgICA8cGF0aCBkPSJtNjEuNzc4LC0zMy4zOWMwLjAxOCwwLjA3MiAwLjAwNywwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTMsMC4xMDEgLTAuMTEyLDAuMDYyIC0wLjE2NSwwLjEyOGMtMC4wNSwwLjA2MiAtMC4wOTksMC4yNzYgLTAuMDc5LDAuMzYyYy0wLjE2OSwwLjA1OCAtMC4wMDksMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzcsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA2OSAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOSwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MiwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMiwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNiwwLjEyNCAtMC4yMTUsMC4yMjRjMC4wMDEsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzY0Ii8+CiAgICAgIDxwYXRoIGQ9Im01NC4xMTgsLTMzLjM5YzAuMDE4LDAuMDcyIDAuMDA3LDAuMTI3IC0wLjAyNiwwLjE5Yy0wLjA1MywwLjEwMSAtMC4xMTIsMC4wNjIgLTAuMTY1LDAuMTI4Yy0wLjA1LDAuMDYyIC0wLjA5OSwwLjI3NiAtMC4wNzksMC4zNjJjLTAuMTY5LDAuMDU4IC0wLjAwOSwwLjIyNyAtMC4wMTUsMC4zNWMtMC4wMDIsMC4wNSAtMC4wNDEsMC4xMDUgLTAuMDQ1LDAuMTYxYy0wLjAxLDAuMTE5IDAuMDE3LDAuMjY2IDAuMDY4LDAuMzdjMC4wOTcsMC4xOTggMC4yNjgsMC40MTMgMC40MzUsMC41NDRjMC4xOSwwLjE0OCAwLjM2NSwwLjU3MiAwLjYwOCwwLjYzMWMwLjE3NywwLjA0MiAwLjM4NCwtMC4xMDQgMC41NDMsLTAuMTQzYzAuMTgsLTAuMDQzIDAuMzk3LDAuMDEgMC41NzEsLTAuMDUzYzAuMjIyLC0wLjA3OSAwLjEyNywtMC4zMzcgMC4yODgsLTAuNDVjMC4xMDQsLTAuMDc0IDAuMjg3LC0wLjAxIDAuNDA2LC0wLjA1MWMwLjIsLTAuMDY5IDAuMzM5LC0wLjI2MyAwLjM3NiwtMC40NmMwLjAxNiwtMC4wODIgMC4wMSwtMC4xNDUgMC4wMzksLTAuMjIxYzAuMDM5LC0wLjEwMyAwLjExMSwtMC4xNiAwLjA5LC0wLjI5M2MtMC4wMSwtMC4wNjIgLTAuMDUyLC0wLjEyIC0wLjA2NCwtMC4xODdjLTAuMDIyLC0wLjExNCAwLjAwMiwtMC4yMjQgMCwtMC4zMzdjLTAuMDAzLC0wLjIgMC4wMTcsLTAuMzc5IC0wLjA3OCwtMC41NWMtMC4zOCwtMC42ODggLTEuMjM2LC0wLjkyOSAtMS45NzUsLTAuNzg5Yy0wLjE4LDAuMDM0IC0wLjI4NywwLjEyNiAtMC40NDIsMC4yMDdjLTAuMTcsMC4wODggLTAuMTM5LDAuMTY2IC0wLjMxOCwwLjIyNGMtMC4wODEsMC4wMjYgLTAuMjE2LDAuMTI0IC0wLjIxNSwwLjIyNGMwLjAwMSwwLjExNSAwLjAwNSwwLjA1MSAwLjAxMiwwLjE2OWMtMC4wMjEsMC4wMTEgLTAuMDIxLC0wLjAwNSAtMC4wMywtMC4wMjUiIGZpbGw9IiNGRkZGRkYiIGlkPSJzdmdfNjUiLz4KICAgICAgPHBhdGggZD0ibTQ2LjQ1OCwtMzMuMzljMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDA5LDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z182NiIvPgogICAgICA8cGF0aCBkPSJtMzguNzk3LC0zMy4zOWMwLjAxOCwwLjA3MiAwLjAwNywwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTMsMC4xMDEgLTAuMTEyLDAuMDYyIC0wLjE2NSwwLjEyOGMtMC4wNSwwLjA2MiAtMC4wOTksMC4yNzYgLTAuMDc5LDAuMzYyYy0wLjE2OSwwLjA1OCAtMC4wMDksMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzcsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA2OSAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOSwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MiwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMiwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNiwwLjEyNCAtMC4yMTUsMC4yMjRjMC4wMDEsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzY3Ii8+CiAgICAgIDxwYXRoIGQ9Im0zMS4xMzcsLTMzLjM5YzAuMDE4LDAuMDcyIDAuMDA3LDAuMTI3IC0wLjAyNiwwLjE5Yy0wLjA1MywwLjEwMSAtMC4xMTIsMC4wNjIgLTAuMTY1LDAuMTI4Yy0wLjA1LDAuMDYyIC0wLjA5OSwwLjI3NiAtMC4wNzksMC4zNjJjLTAuMTY5LDAuMDU4IC0wLjAwOSwwLjIyNyAtMC4wMTUsMC4zNWMtMC4wMDIsMC4wNSAtMC4wNDEsMC4xMDUgLTAuMDQ1LDAuMTYxYy0wLjAxLDAuMTE5IDAuMDE3LDAuMjY2IDAuMDY4LDAuMzdjMC4wOTcsMC4xOTggMC4yNjgsMC40MTMgMC40MzUsMC41NDRjMC4xOSwwLjE0OCAwLjM2NSwwLjU3MiAwLjYwOCwwLjYzMWMwLjE3NywwLjA0MiAwLjM4NCwtMC4xMDQgMC41NDMsLTAuMTQzYzAuMTgsLTAuMDQzIDAuMzk3LDAuMDEgMC41NzEsLTAuMDUzYzAuMjIyLC0wLjA3OSAwLjEyNywtMC4zMzcgMC4yODgsLTAuNDVjMC4xMDQsLTAuMDc0IDAuMjg3LC0wLjAxIDAuNDA2LC0wLjA1MWMwLjIsLTAuMDY5IDAuMzM5LC0wLjI2MyAwLjM3NiwtMC40NmMwLjAxNiwtMC4wODIgMC4wMSwtMC4xNDUgMC4wMzksLTAuMjIxYzAuMDM5LC0wLjEwMyAwLjExMSwtMC4xNiAwLjA5LC0wLjI5M2MtMC4wMSwtMC4wNjIgLTAuMDUyLC0wLjEyIC0wLjA2NCwtMC4xODdjLTAuMDIyLC0wLjExNCAwLjAwMiwtMC4yMjQgMCwtMC4zMzdjLTAuMDAzLC0wLjIgMC4wMTcsLTAuMzc5IC0wLjA3OCwtMC41NWMtMC4zOCwtMC42ODggLTEuMjM2LC0wLjkyOSAtMS45NzUsLTAuNzg5Yy0wLjE4LDAuMDM0IC0wLjI4NywwLjEyNiAtMC40NDIsMC4yMDdjLTAuMTcsMC4wODggLTAuMTM5LDAuMTY2IC0wLjMxOCwwLjIyNGMtMC4wODEsMC4wMjYgLTAuMjE2LDAuMTI0IC0wLjIxNSwwLjIyNGMwLjAwMSwwLjExNSAwLjAwNSwwLjA1MSAwLjAxMiwwLjE2OWMtMC4wMjEsMC4wMTEgLTAuMDIxLC0wLjAwNSAtMC4wMywtMC4wMjUiIGZpbGw9IiNGRkZGRkYiIGlkPSJzdmdfNjgiLz4KICAgICAgPHBhdGggZD0ibTIzLjQ3NywtMzMuMzljMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDA5LDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z182OSIvPgogICAgICA8cGF0aCBkPSJtMTUuODE2LC0zMy4zOWMwLjAxOCwwLjA3MiAwLjAwNywwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTMsMC4xMDEgLTAuMTEyLDAuMDYyIC0wLjE2NSwwLjEyOGMtMC4wNSwwLjA2MiAtMC4wOTksMC4yNzYgLTAuMDc5LDAuMzYyYy0wLjE2OSwwLjA1OCAtMC4wMDksMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzcsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA2OSAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOSwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MiwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMiwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNiwwLjEyNCAtMC4yMTUsMC4yMjRjMC4wMDEsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzcwIi8+CiAgICAgIDxwYXRoIGQ9Im04LjE1NiwtMzMuMzljMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDA5LDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z183MSIvPgogICAgICA8cGF0aCBkPSJtMC40OTUsLTMzLjM5YzAuMDE4LDAuMDcyIDAuMDA3LDAuMTI3IC0wLjAyNiwwLjE5Yy0wLjA1MywwLjEwMSAtMC4xMTIsMC4wNjIgLTAuMTY1LDAuMTI4Yy0wLjA1LDAuMDYyIC0wLjA5OSwwLjI3NiAtMC4wNzksMC4zNjJjLTAuMTY5LDAuMDU4IC0wLjAxLDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAzLDAuMTE3IDAuMDA2LDAuMDUzIDAuMDEzLDAuMTcxYy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z183MiIvPgogICAgIDwvZz4KICAgICA8ZyBpZD0ic3ZnXzczIj4KICAgICAgPHBhdGggZD0ibTY5LjQzOSwtMjUuNzM2YzAuMDE4LDAuMDcyIDAuMDA3LDAuMTI3IC0wLjAyNiwwLjE5Yy0wLjA1MywwLjEwMSAtMC4xMTIsMC4wNjIgLTAuMTY1LDAuMTI4Yy0wLjA1LDAuMDYyIC0wLjA5OSwwLjI3NiAtMC4wNzksMC4zNjJjLTAuMTY5LDAuMDU4IC0wLjAxLDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z183NCIvPgogICAgICA8cGF0aCBkPSJtNjEuNzc4LC0yNS43MzZjMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDA5LDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z183NSIvPgogICAgICA8cGF0aCBkPSJtNTQuMTE4LC0yNS43MzZjMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDA5LDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z183NiIvPgogICAgICA8cGF0aCBkPSJtNDYuNDU4LC0yNS43MzZjMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDA5LDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z183NyIvPgogICAgICA8cGF0aCBkPSJtMzguNzk3LC0yNS43MzZjMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDA5LDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z183OCIvPgogICAgICA8cGF0aCBkPSJtMzEuMTM3LC0yNS43MzZjMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDA5LDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z183OSIvPgogICAgICA8cGF0aCBkPSJtMjMuNDc3LC0yNS43MzZjMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDA5LDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z184MCIvPgogICAgICA8cGF0aCBkPSJtMTUuODE2LC0yNS43MzZjMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDA5LDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z184MSIvPgogICAgICA8cGF0aCBkPSJtOC4xNTYsLTI1LjczNmMwLjAxOCwwLjA3MiAwLjAwNywwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTMsMC4xMDEgLTAuMTEyLDAuMDYyIC0wLjE2NSwwLjEyOGMtMC4wNSwwLjA2MiAtMC4wOTksMC4yNzYgLTAuMDc5LDAuMzYyYy0wLjE2OSwwLjA1OCAtMC4wMDksMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzcsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA2OSAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOSwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MiwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMiwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNiwwLjEyNCAtMC4yMTUsMC4yMjRjMC4wMDEsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzgyIi8+CiAgICAgIDxwYXRoIGQ9Im0wLjQ5NSwtMjUuNzM2YzAuMDE4LDAuMDcyIDAuMDA3LDAuMTI3IC0wLjAyNiwwLjE5Yy0wLjA1MywwLjEwMSAtMC4xMTIsMC4wNjIgLTAuMTY1LDAuMTI4Yy0wLjA1LDAuMDYyIC0wLjA5OSwwLjI3NiAtMC4wNzksMC4zNjJjLTAuMTY5LDAuMDU4IC0wLjAxLDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z184MyIvPgogICAgIDwvZz4KICAgICA8ZyBpZD0ic3ZnXzg0Ij4KICAgICAgPHBhdGggZD0ibTY5LjQzOSwtMTguMDg0YzAuMDE4LDAuMDcyIDAuMDA3LDAuMTI3IC0wLjAyNiwwLjE5Yy0wLjA1MywwLjEwMSAtMC4xMTIsMC4wNjIgLTAuMTY1LDAuMTI4Yy0wLjA1LDAuMDYyIC0wLjA5OSwwLjI3NiAtMC4wNzksMC4zNjJjLTAuMTY5LDAuMDU4IC0wLjAxLDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z184NSIvPgogICAgICA8cGF0aCBkPSJtNjEuNzc4LC0xOC4wODRjMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDA5LDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z184NiIvPgogICAgICA8cGF0aCBkPSJtNTQuMTE4LC0xOC4wODRjMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDA5LDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z184NyIvPgogICAgICA8cGF0aCBkPSJtNDYuNDU4LC0xOC4wODRjMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDA5LDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z184OCIvPgogICAgICA8cGF0aCBkPSJtMzguNzk3LC0xOC4wODRjMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDA5LDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z184OSIvPgogICAgICA8cGF0aCBkPSJtMzEuMTM3LC0xOC4wODRjMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDA5LDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z185MCIvPgogICAgICA8cGF0aCBkPSJtMjMuNDc3LC0xOC4wODRjMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDA5LDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z185MSIvPgogICAgICA8cGF0aCBkPSJtMTUuODE2LC0xOC4wODRjMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDA5LDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z185MiIvPgogICAgICA8cGF0aCBkPSJtOC4xNTYsLTE4LjA4NGMwLjAxOCwwLjA3MiAwLjAwNywwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTMsMC4xMDEgLTAuMTEyLDAuMDYyIC0wLjE2NSwwLjEyOGMtMC4wNSwwLjA2MiAtMC4wOTksMC4yNzYgLTAuMDc5LDAuMzYyYy0wLjE2OSwwLjA1OCAtMC4wMDksMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzcsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA2OSAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOSwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MiwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMiwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNiwwLjEyNCAtMC4yMTUsMC4yMjRjMC4wMDEsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzkzIi8+CiAgICAgIDxwYXRoIGQ9Im0wLjQ5NSwtMTguMDg0YzAuMDE4LDAuMDcyIDAuMDA3LDAuMTI3IC0wLjAyNiwwLjE5Yy0wLjA1MywwLjEwMSAtMC4xMTIsMC4wNjIgLTAuMTY1LDAuMTI4Yy0wLjA1LDAuMDYyIC0wLjA5OSwwLjI3NiAtMC4wNzksMC4zNjJjLTAuMTY5LDAuMDU4IC0wLjAxLDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAzLDAuMTE3IDAuMDA2LDAuMDUyIDAuMDEzLDAuMTdjLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzk0Ii8+CiAgICAgPC9nPgogICAgIDxnIGlkPSJzdmdfOTUiPgogICAgICA8cGF0aCBkPSJtNjkuNDM5LC0xMC40MzFjMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTkgLTAuMDEsMC4yMjggLTAuMDE1LDAuMzUxYy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z185NiIvPgogICAgICA8cGF0aCBkPSJtNjEuNzc4LC0xMC40MzFjMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDA5LDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z185NyIvPgogICAgICA8cGF0aCBkPSJtNTQuMTE4LC0xMC40MzFjMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDA5LDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z185OCIvPgogICAgICA8cGF0aCBkPSJtNDYuNDU4LC0xMC40MzFjMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDA5LDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z185OSIvPgogICAgICA8cGF0aCBkPSJtMzguNzk3LC0xMC40MzFjMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDA5LDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z18xMDAiLz4KICAgICAgPHBhdGggZD0ibTMxLjEzNywtMTAuNDMxYzAuMDE4LDAuMDcyIDAuMDA3LDAuMTI3IC0wLjAyNiwwLjE5Yy0wLjA1MywwLjEwMSAtMC4xMTIsMC4wNjIgLTAuMTY1LDAuMTI4Yy0wLjA1LDAuMDYyIC0wLjA5OSwwLjI3NiAtMC4wNzksMC4zNjJjLTAuMTY5LDAuMDU4IC0wLjAwOSwwLjIyNyAtMC4wMTUsMC4zNWMtMC4wMDIsMC4wNSAtMC4wNDEsMC4xMDUgLTAuMDQ1LDAuMTYxYy0wLjAxLDAuMTE5IDAuMDE3LDAuMjY2IDAuMDY4LDAuMzdjMC4wOTcsMC4xOTggMC4yNjgsMC40MTMgMC40MzUsMC41NDRjMC4xOSwwLjE0OCAwLjM2NSwwLjU3MiAwLjYwOCwwLjYzMWMwLjE3NywwLjA0MiAwLjM4NCwtMC4xMDQgMC41NDMsLTAuMTQzYzAuMTgsLTAuMDQzIDAuMzk3LDAuMDEgMC41NzEsLTAuMDUzYzAuMjIyLC0wLjA3OSAwLjEyNywtMC4zMzcgMC4yODgsLTAuNDVjMC4xMDQsLTAuMDc0IDAuMjg3LC0wLjAxIDAuNDA2LC0wLjA1MWMwLjIsLTAuMDY5IDAuMzM5LC0wLjI2MyAwLjM3NiwtMC40NmMwLjAxNiwtMC4wODIgMC4wMSwtMC4xNDUgMC4wMzksLTAuMjIxYzAuMDM5LC0wLjEwMyAwLjExMSwtMC4xNiAwLjA5LC0wLjI5M2MtMC4wMSwtMC4wNjIgLTAuMDUyLC0wLjEyIC0wLjA2NCwtMC4xODdjLTAuMDIyLC0wLjExNCAwLjAwMiwtMC4yMjQgMCwtMC4zMzdjLTAuMDAzLC0wLjIgMC4wMTcsLTAuMzc5IC0wLjA3OCwtMC41NWMtMC4zOCwtMC42ODggLTEuMjM2LC0wLjkyOSAtMS45NzUsLTAuNzg5Yy0wLjE4LDAuMDM0IC0wLjI4NywwLjEyNiAtMC40NDIsMC4yMDdjLTAuMTcsMC4wODggLTAuMTM5LDAuMTY2IC0wLjMxOCwwLjIyNGMtMC4wODEsMC4wMjYgLTAuMjE2LDAuMTI0IC0wLjIxNSwwLjIyNGMwLjAwMSwwLjExNSAwLjAwNSwwLjA1MSAwLjAxMiwwLjE2OWMtMC4wMjEsMC4wMTEgLTAuMDIxLC0wLjAwNSAtMC4wMywtMC4wMjUiIGZpbGw9IiNGRkZGRkYiIGlkPSJzdmdfMTAxIi8+CiAgICAgIDxwYXRoIGQ9Im0yMy40NzcsLTEwLjQzMWMwLjAxOCwwLjA3MiAwLjAwNywwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTMsMC4xMDEgLTAuMTEyLDAuMDYyIC0wLjE2NSwwLjEyOGMtMC4wNSwwLjA2MiAtMC4wOTksMC4yNzYgLTAuMDc5LDAuMzYyYy0wLjE2OSwwLjA1OCAtMC4wMDksMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzcsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA2OSAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOSwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MiwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMiwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNiwwLjEyNCAtMC4yMTUsMC4yMjRjMC4wMDEsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzEwMiIvPgogICAgICA8cGF0aCBkPSJtMTUuODE2LC0xMC40MzFjMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDA5LDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc4IDAuMTI4LC0wLjMzNiAwLjI4OSwtMC40NDljMC4xMDQsLTAuMDc0IDAuMjg3LC0wLjAxIDAuNDA2LC0wLjA1MWMwLjIsLTAuMDY5IDAuMzM5LC0wLjI2MyAwLjM3NiwtMC40NmMwLjAxNiwtMC4wODIgMC4wMSwtMC4xNDUgMC4wMzksLTAuMjIxYzAuMDM5LC0wLjEwMyAwLjExMSwtMC4xNiAwLjA5LC0wLjI5M2MtMC4wMSwtMC4wNjIgLTAuMDUyLC0wLjEyIC0wLjA2NCwtMC4xODdjLTAuMDIyLC0wLjExNCAwLjAwMiwtMC4yMjQgMCwtMC4zMzdjLTAuMDAzLC0wLjIgMC4wMTcsLTAuMzc5IC0wLjA3OCwtMC41NWMtMC4zOCwtMC42ODggLTEuMjM2LC0wLjkyOSAtMS45NzUsLTAuNzg5Yy0wLjE4LDAuMDM0IC0wLjI4NywwLjEyNiAtMC40NDIsMC4yMDdjLTAuMTcsMC4wODggLTAuMTM5LDAuMTY2IC0wLjMxOCwwLjIyNGMtMC4wODEsMC4wMjYgLTAuMjE2LDAuMTI0IC0wLjIxNSwwLjIyNGMwLjAwMSwwLjExNSAwLjAwNSwwLjA1MSAwLjAxMiwwLjE2OWMtMC4wMjEsMC4wMTEgLTAuMDIxLC0wLjAwNSAtMC4wMywtMC4wMjUiIGZpbGw9IiNGRkZGRkYiIGlkPSJzdmdfMTAzIi8+CiAgICAgIDxwYXRoIGQ9Im04LjE1NiwtMTAuNDMxYzAuMDE4LDAuMDcyIDAuMDA3LDAuMTI3IC0wLjAyNiwwLjE5Yy0wLjA1MywwLjEwMSAtMC4xMTIsMC4wNjIgLTAuMTY1LDAuMTI4Yy0wLjA1LDAuMDYzIC0wLjA5OSwwLjI3NyAtMC4wNzksMC4zNjNjLTAuMTY5LDAuMDU4IC0wLjAxLDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMywwLjA0OSAtMC4wNDEsMC4xMDUgLTAuMDQ1LDAuMTYxYy0wLjAxLDAuMTE5IDAuMDE3LDAuMjY2IDAuMDY4LDAuMzdjMC4wOTcsMC4xOTggMC4yNjgsMC40MTMgMC40MzUsMC41NDRjMC4xOSwwLjE0OCAwLjM2NSwwLjU3MiAwLjYwOCwwLjYzMWMwLjE3NywwLjA0MiAwLjM4NCwtMC4xMDUgMC41NDMsLTAuMTQzYzAuMTgsLTAuMDQzIDAuMzk3LDAuMDEgMC41NzEsLTAuMDUzYzAuMjIyLC0wLjA3OSAwLjEyNywtMC4zMzcgMC4yODgsLTAuNDVjMC4xMDQsLTAuMDc0IDAuMjg3LC0wLjAxIDAuNDA2LC0wLjA1MWMwLjIsLTAuMDY5IDAuMzM5LC0wLjI2MyAwLjM3NiwtMC40NmMwLjAxNiwtMC4wODIgMC4wMSwtMC4xNDUgMC4wMzksLTAuMjIxYzAuMDM5LC0wLjEwMyAwLjExMSwtMC4xNiAwLjA5LC0wLjI5M2MtMC4wMSwtMC4wNjIgLTAuMDUyLC0wLjEyIC0wLjA2NCwtMC4xODdjLTAuMDIyLC0wLjExNCAwLjAwMiwtMC4yMjQgMCwtMC4zMzdjLTAuMDAzLC0wLjIgMC4wMTcsLTAuMzc5IC0wLjA3OCwtMC41NWMtMC4zOCwtMC42ODggLTEuMjM2LC0wLjkyOSAtMS45NzUsLTAuNzg5Yy0wLjE4LDAuMDM0IC0wLjI4NywwLjEyNiAtMC40NDIsMC4yMDdjLTAuMTcsMC4wODggLTAuMTM5LDAuMTY2IC0wLjMxOCwwLjIyNGMtMC4wODEsMC4wMjYgLTAuMjE2LDAuMTI0IC0wLjIxNSwwLjIyNGMwLjAwMSwwLjExNSAwLjAwNSwwLjA1MSAwLjAxMiwwLjE2OWMtMC4wMjEsMC4wMTEgLTAuMDIxLC0wLjAwNSAtMC4wMywtMC4wMjUiIGZpbGw9IiNGRkZGRkYiIGlkPSJzdmdfMTA0Ii8+CiAgICAgIDxwYXRoIGQ9Im0wLjQ5NSwtMTAuNDMxYzAuMDE4LDAuMDcyIDAuMDA3LDAuMTI3IC0wLjAyNiwwLjE5Yy0wLjA1MywwLjEwMSAtMC4xMTIsMC4wNjIgLTAuMTY1LDAuMTI4Yy0wLjA1LDAuMDYzIC0wLjA5OSwwLjI3NyAtMC4wNzksMC4zNjNjLTAuMTY5LDAuMDU4IC0wLjAxLDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc4LDAuMDQyIDAuMzg0LC0wLjEwNSAwLjU0MywtMC4xNDNjMC4xODEsLTAuMDQzIDAuMzk4LDAuMDEgMC41NzIsLTAuMDUzYzAuMjIyLC0wLjA3OSAwLjEyNywtMC4zMzcgMC4yODgsLTAuNDVjMC4xMDQsLTAuMDc0IDAuMjg3LC0wLjAxIDAuNDA2LC0wLjA1MWMwLjIsLTAuMDY5IDAuMzM5LC0wLjI2MyAwLjM3NiwtMC40NmMwLjAxNiwtMC4wODIgMC4wMSwtMC4xNDQgMC4wMzksLTAuMjJjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyNiAtMC4yMTYsMC4xMjQgLTAuMjE1LDAuMjI0YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z18xMDUiLz4KICAgICA8L2c+CiAgICA8L2c+CiAgICA8ZyBpZD0ic3ZnXzEwNiI+CiAgICAgPHBhdGggZD0ibTY5LjQzOSwtMi43NzhjMC4wMTgsMC4wNzIgMC4wMDgsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUyLDAuMTAxIC0wLjExMywwLjA2MyAtMC4xNjUsMC4xMjhjLTAuMDUxLDAuMDYyIC0wLjA5OSwwLjI3NiAtMC4wNzksMC4zNjJjLTAuMTY5LDAuMDU4IC0wLjAxLDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNyAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOCwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MSwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMSwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNSwwLjEyNCAtMC4yMTUsMC4yMjRjMC4wMDIsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzEwNyIvPgogICAgIDxwYXRoIGQ9Im02MS43NzgsLTIuNzc4YzAuMDE4LDAuMDcyIDAuMDA3LDAuMTI3IC0wLjAyNiwwLjE5Yy0wLjA1MiwwLjEwMSAtMC4xMTIsMC4wNjMgLTAuMTY1LDAuMTI4Yy0wLjA1LDAuMDYyIC0wLjA5OSwwLjI3NiAtMC4wNzksMC4zNjJjLTAuMTY5LDAuMDU4IC0wLjAxLDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc4LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0NCwtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyOCAtMC4yMTYsMC4xMjUgLTAuMjE1LDAuMjI1YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z18xMDgiLz4KICAgICA8cGF0aCBkPSJtNTQuMTE4LC0yLjc3OGMwLjAxOCwwLjA3MiAwLjAwNywwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTIsMC4xMDEgLTAuMTEyLDAuMDYzIC0wLjE2NSwwLjEyOGMtMC4wNSwwLjA2MiAtMC4wOTksMC4yNzYgLTAuMDc5LDAuMzYyYy0wLjE2OSwwLjA1OCAtMC4wMSwwLjIyNyAtMC4wMTUsMC4zNWMtMC4wMDIsMC4wNSAtMC4wNDEsMC4xMDUgLTAuMDQ1LDAuMTYxYy0wLjAxLDAuMTE5IDAuMDE3LDAuMjY2IDAuMDY4LDAuMzdjMC4wOTcsMC4xOTggMC4yNjgsMC40MTMgMC40MzUsMC41NDRjMC4xOSwwLjE0OCAwLjM2NSwwLjU3MiAwLjYwOCwwLjYzMWMwLjE3OCwwLjA0MiAwLjM4NCwtMC4xMDQgMC41NDMsLTAuMTQzYzAuMTgsLTAuMDQzIDAuMzk3LDAuMDEgMC41NzEsLTAuMDUzYzAuMjIyLC0wLjA3OSAwLjEyNywtMC4zMzcgMC4yODgsLTAuNDVjMC4xMDQsLTAuMDc0IDAuMjg3LC0wLjAxIDAuNDA2LC0wLjA1MWMwLjIsLTAuMDY5IDAuMzM5LC0wLjI2MyAwLjM3NiwtMC40NmMwLjAxNiwtMC4wODIgMC4wMSwtMC4xNDUgMC4wMzksLTAuMjIxYzAuMDM5LC0wLjEwMyAwLjExMSwtMC4xNiAwLjA5LC0wLjI5M2MtMC4wMSwtMC4wNjIgLTAuMDUyLC0wLjEyIC0wLjA2NCwtMC4xODdjLTAuMDIyLC0wLjExNCAwLjAwMiwtMC4yMjQgMCwtMC4zMzdjLTAuMDAzLC0wLjIgMC4wMTcsLTAuMzc5IC0wLjA3OCwtMC41NWMtMC4zOCwtMC42ODggLTEuMjM2LC0wLjkyOSAtMS45NzUsLTAuNzg5Yy0wLjE4LDAuMDM0IC0wLjI4NywwLjEyNiAtMC40NDIsMC4yMDdjLTAuMTcsMC4wODggLTAuMTM5LDAuMTY2IC0wLjMxOCwwLjIyNGMtMC4wOCwwLjAyOCAtMC4yMTUsMC4xMjUgLTAuMjE0LDAuMjI1YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z18xMDkiLz4KICAgICA8cGF0aCBkPSJtNDYuNDU4LC0yLjc3OGMwLjAxOCwwLjA3MiAwLjAwNywwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTMsMC4xMDEgLTAuMTEyLDAuMDYyIC0wLjE2NSwwLjEyOGMtMC4wNSwwLjA2MiAtMC4wOTksMC4yNzYgLTAuMDc5LDAuMzYyYy0wLjE2OSwwLjA1OCAtMC4wMSwwLjIyNyAtMC4wMTUsMC4zNWMtMC4wMDIsMC4wNSAtMC4wNDEsMC4xMDUgLTAuMDQ1LDAuMTYxYy0wLjAxLDAuMTE5IDAuMDE3LDAuMjY2IDAuMDY4LDAuMzdjMC4wOTcsMC4xOTggMC4yNjgsMC40MTMgMC40MzUsMC41NDRjMC4xOSwwLjE0OCAwLjM2NSwwLjU3MiAwLjYwOCwwLjYzMWMwLjE3NywwLjA0MiAwLjM4NCwtMC4xMDQgMC41NDMsLTAuMTQzYzAuMTgsLTAuMDQzIDAuMzk3LDAuMDEgMC41NzEsLTAuMDUzYzAuMjIyLC0wLjA3OSAwLjEyNywtMC4zMzcgMC4yODgsLTAuNDVjMC4xMDQsLTAuMDc0IDAuMjg3LC0wLjAxIDAuNDA2LC0wLjA1MWMwLjIsLTAuMDY5IDAuMzM5LC0wLjI2MyAwLjM3NiwtMC40NmMwLjAxNiwtMC4wODIgMC4wMSwtMC4xNDUgMC4wMzksLTAuMjIxYzAuMDM5LC0wLjEwMyAwLjExMSwtMC4xNiAwLjA5LC0wLjI5M2MtMC4wMSwtMC4wNjIgLTAuMDUyLC0wLjEyIC0wLjA2NCwtMC4xODdjLTAuMDIyLC0wLjExNCAwLjAwMiwtMC4yMjQgMCwtMC4zMzdjLTAuMDAzLC0wLjIgMC4wMTcsLTAuMzc5IC0wLjA3OCwtMC41NWMtMC4zOCwtMC42ODggLTEuMjM2LC0wLjkyOSAtMS45NzUsLTAuNzg5Yy0wLjE4LDAuMDM0IC0wLjI4NywwLjEyNiAtMC40NDIsMC4yMDdjLTAuMTcsMC4wODggLTAuMTM5LDAuMTY2IC0wLjMxOCwwLjIyNGMtMC4wODEsMC4wMjggLTAuMjE2LDAuMTI1IC0wLjIxNSwwLjIyNWMwLjAwMSwwLjExNSAwLjAwNSwwLjA1MSAwLjAxMiwwLjE2OWMtMC4wMjEsMC4wMTEgLTAuMDIxLC0wLjAwNSAtMC4wMywtMC4wMjUiIGZpbGw9IiNGRkZGRkYiIGlkPSJzdmdfMTEwIi8+CiAgICAgPHBhdGggZD0ibTM4Ljc5NywtMi43NzhjMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDEsMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzgsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQ0LC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA2OSAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOSwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MiwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMiwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI4IC0wLjIxNiwwLjEyNSAtMC4yMTUsMC4yMjVjMC4wMDEsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIxLDAuMDExIC0wLjAyMSwtMC4wMDUgLTAuMDMsLTAuMDI1IiBmaWxsPSIjRkZGRkZGIiBpZD0ic3ZnXzExMSIvPgogICAgIDxwYXRoIGQ9Im0zMS4xMzcsLTIuNzc4YzAuMDE4LDAuMDcyIDAuMDA3LDAuMTI3IC0wLjAyNiwwLjE5Yy0wLjA1MywwLjEwMSAtMC4xMTIsMC4wNjIgLTAuMTY1LDAuMTI4Yy0wLjA1LDAuMDYyIC0wLjA5OSwwLjI3NiAtMC4wNzksMC4zNjJjLTAuMTY5LDAuMDU4IC0wLjAxLDAuMjI3IC0wLjAxNSwwLjM1Yy0wLjAwMiwwLjA1IC0wLjA0MSwwLjEwNSAtMC4wNDUsMC4xNjFjLTAuMDEsMC4xMTkgMC4wMTcsMC4yNjYgMC4wNjgsMC4zN2MwLjA5NywwLjE5OCAwLjI2OCwwLjQxMyAwLjQzNSwwLjU0NGMwLjE5LDAuMTQ4IDAuMzY1LDAuNTcyIDAuNjA4LDAuNjMxYzAuMTc3LDAuMDQyIDAuMzg0LC0wLjEwNCAwLjU0MywtMC4xNDNjMC4xOCwtMC4wNDMgMC4zOTcsMC4wMSAwLjU3MSwtMC4wNTNjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNjkgMC4zMzksLTAuMjYzIDAuMzc2LC0wLjQ2YzAuMDE2LC0wLjA4MiAwLjAxLC0wLjE0NSAwLjAzOSwtMC4yMjFjMC4wMzksLTAuMTAzIDAuMTExLC0wLjE2IDAuMDksLTAuMjkzYy0wLjAxLC0wLjA2MiAtMC4wNTIsLTAuMTIgLTAuMDY0LC0wLjE4N2MtMC4wMjIsLTAuMTE0IDAuMDAyLC0wLjIyNCAwLC0wLjMzN2MtMC4wMDMsLTAuMiAwLjAxNywtMC4zNzkgLTAuMDc4LC0wLjU1Yy0wLjM4LC0wLjY4OCAtMS4yMzYsLTAuOTI5IC0xLjk3NSwtMC43ODljLTAuMTgsMC4wMzQgLTAuMjg3LDAuMTI2IC0wLjQ0MiwwLjIwN2MtMC4xNywwLjA4OCAtMC4xMzksMC4xNjYgLTAuMzE4LDAuMjI0Yy0wLjA4MSwwLjAyOCAtMC4yMTUsMC4xMjUgLTAuMjE0LDAuMjI1YzAuMDAxLDAuMTE1IDAuMDA1LDAuMDUxIDAuMDEyLDAuMTY5Yy0wLjAyMSwwLjAxMSAtMC4wMjEsLTAuMDA1IC0wLjAzLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z18xMTIiLz4KICAgICA8cGF0aCBkPSJtMjMuNDc3LC0yLjc3OGMwLjAxOCwwLjA3MiAwLjAwNywwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTMsMC4xMDEgLTAuMTEyLDAuMDYyIC0wLjE2NSwwLjEyOGMtMC4wNSwwLjA2MiAtMC4wOTksMC4yNzYgLTAuMDc5LDAuMzYyYy0wLjE2OSwwLjA1OCAtMC4wMSwwLjIyNyAtMC4wMTUsMC4zNWMtMC4wMDIsMC4wNSAtMC4wNDEsMC4xMDUgLTAuMDQ1LDAuMTYxYy0wLjAxLDAuMTE5IDAuMDE3LDAuMjY2IDAuMDY4LDAuMzdjMC4wOTcsMC4xOTggMC4yNjgsMC40MTMgMC40MzUsMC41NDRjMC4xOSwwLjE0OCAwLjM2NSwwLjU3MiAwLjYwOCwwLjYzMWMwLjE3NywwLjA0MiAwLjM4NCwtMC4xMDQgMC41NDMsLTAuMTQzYzAuMTgsLTAuMDQzIDAuMzk3LDAuMDEgMC41NzEsLTAuMDUzYzAuMjIyLC0wLjA3OSAwLjEyNywtMC4zMzcgMC4yODgsLTAuNDVjMC4xMDQsLTAuMDc0IDAuMjg3LC0wLjAxIDAuNDA2LC0wLjA1MWMwLjIsLTAuMDY5IDAuMzM5LC0wLjI2MyAwLjM3NiwtMC40NmMwLjAxNiwtMC4wODIgMC4wMSwtMC4xNDUgMC4wMzksLTAuMjIxYzAuMDM5LC0wLjEwMyAwLjExMSwtMC4xNiAwLjA5LC0wLjI5M2MtMC4wMSwtMC4wNjIgLTAuMDUyLC0wLjEyIC0wLjA2NCwtMC4xODdjLTAuMDIyLC0wLjExNCAwLjAwMiwtMC4yMjQgMCwtMC4zMzdjLTAuMDAzLC0wLjIgMC4wMTcsLTAuMzc5IC0wLjA3OCwtMC41NWMtMC4zOCwtMC42ODggLTEuMjM2LC0wLjkyOSAtMS45NzUsLTAuNzg5Yy0wLjE4LDAuMDM0IC0wLjI4NywwLjEyNiAtMC40NDIsMC4yMDdjLTAuMTcsMC4wODggLTAuMTM5LDAuMTY2IC0wLjMxOCwwLjIyNGMtMC4wODEsMC4wMjYgLTAuMjE2LDAuMTI0IC0wLjIxNSwwLjIyNGMwLjAwMSwwLjExNSAwLjAwNSwwLjA1MSAwLjAxMiwwLjE2OWMtMC4wMjEsMC4wMTEgLTAuMDIxLC0wLjAwNSAtMC4wMywtMC4wMjUiIGZpbGw9IiNGRkZGRkYiIGlkPSJzdmdfMTEzIi8+CiAgICAgPHBhdGggZD0ibTE1LjgxNiwtMi43NzhjMC4wMTgsMC4wNzIgMC4wMDcsMC4xMjcgLTAuMDI2LDAuMTljLTAuMDUzLDAuMTAxIC0wLjExMiwwLjA2MiAtMC4xNjUsMC4xMjhjLTAuMDUsMC4wNjIgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDEsMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzcsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4LC0wLjA0MyAwLjM5NywwLjAxIDAuNTcxLC0wLjA1M2MwLjIyMiwtMC4wNzkgMC4xMjcsLTAuMzM3IDAuMjg4LC0wLjQ1YzAuMTA0LC0wLjA3NCAwLjI4NywtMC4wMSAwLjQwNiwtMC4wNTFjMC4yLC0wLjA2OSAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOSwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MiwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMiwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNCAtMC4yODcsMC4xMjYgLTAuNDQyLDAuMjA3Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNiwwLjEyNCAtMC4yMTUsMC4yMjRjMC4wMDEsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIsMC4wMTIgLTAuMDIxLC0wLjAwNCAtMC4wMywtMC4wMjQiIGZpbGw9IiNGRkZGRkYiIGlkPSJzdmdfMTE0Ii8+CiAgICAgPHBhdGggZD0ibTguMTU2LC0yLjc3OGMwLjAxOCwwLjA3MiAwLjAwNywwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTMsMC4xMDEgLTAuMTEyLDAuMDYzIC0wLjE2NSwwLjEyOGMtMC4wNSwwLjA2MiAtMC4wOTksMC4yNzYgLTAuMDc5LDAuMzYyYy0wLjE2OSwwLjA1OCAtMC4wMSwwLjIyNyAtMC4wMTUsMC4zNWMtMC4wMDMsMC4wNSAtMC4wNDEsMC4xMDUgLTAuMDQ1LDAuMTYxYy0wLjAxLDAuMTE5IDAuMDE3LDAuMjY2IDAuMDY4LDAuMzdjMC4wOTcsMC4xOTggMC4yNjgsMC40MTMgMC40MzUsMC41NDRjMC4xOSwwLjE0OCAwLjM2NSwwLjU3MiAwLjYwOCwwLjYzMWMwLjE3NywwLjA0MiAwLjM4NCwtMC4xMDQgMC41NDMsLTAuMTQzYzAuMTgsLTAuMDQzIDAuMzk3LDAuMDEgMC41NzEsLTAuMDUzYzAuMjIyLC0wLjA3OSAwLjEyNywtMC4zMzcgMC4yODgsLTAuNDVjMC4xMDQsLTAuMDc0IDAuMjg3LC0wLjAxIDAuNDA2LC0wLjA1MWMwLjIsLTAuMDY5IDAuMzM5LC0wLjI2MyAwLjM3NiwtMC40NmMwLjAxNiwtMC4wODIgMC4wMSwtMC4xNDUgMC4wMzksLTAuMjIxYzAuMDM5LC0wLjEwMyAwLjExMSwtMC4xNiAwLjA5LC0wLjI5M2MtMC4wMSwtMC4wNjIgLTAuMDUyLC0wLjEyIC0wLjA2NCwtMC4xODdjLTAuMDIyLC0wLjExNCAwLjAwMiwtMC4yMjQgMCwtMC4zMzdjLTAuMDAzLC0wLjIgMC4wMTcsLTAuMzc5IC0wLjA3OCwtMC41NWMtMC4zOCwtMC42ODggLTEuMjM2LC0wLjkyOSAtMS45NzUsLTAuNzg5Yy0wLjE3OSwwLjAzNiAtMC4yODYsMC4xMjggLTAuNDQxLDAuMjA5Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgyLDAuMDI2IC0wLjIxNiwwLjEyMyAtMC4yMTUsMC4yMjNjMC4wMDEsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTEsMC4xNjljLTAuMDIsMC4wMTEgLTAuMDIxLC0wLjAwNSAtMC4wMywtMC4wMjUiIGZpbGw9IiNGRkZGRkYiIGlkPSJzdmdfMTE1Ii8+CiAgICAgPHBhdGggZD0ibTAuNDk1LC0yLjc3OGMwLjAxOCwwLjA3MiAwLjAwOCwwLjEyNyAtMC4wMjYsMC4xOWMtMC4wNTIsMC4xMDEgLTAuMTEzLDAuMDYzIC0wLjE2NSwwLjEyOGMtMC4wNTEsMC4wNjMgLTAuMDk5LDAuMjc2IC0wLjA3OSwwLjM2MmMtMC4xNjksMC4wNTggLTAuMDEsMC4yMjcgLTAuMDE1LDAuMzVjLTAuMDAyLDAuMDUgLTAuMDQxLDAuMTA1IC0wLjA0NSwwLjE2MWMtMC4wMSwwLjExOSAwLjAxNywwLjI2NiAwLjA2OCwwLjM3YzAuMDk3LDAuMTk4IDAuMjY4LDAuNDEzIDAuNDM1LDAuNTQ0YzAuMTksMC4xNDggMC4zNjUsMC41NzIgMC42MDgsMC42MzFjMC4xNzgsMC4wNDIgMC4zODQsLTAuMTA0IDAuNTQzLC0wLjE0M2MwLjE4MSwtMC4wNDMgMC4zOTgsMC4wMSAwLjU3MiwtMC4wNTJjMC4yMjIsLTAuMDc5IDAuMTI3LC0wLjMzNyAwLjI4OCwtMC40NWMwLjEwNCwtMC4wNzQgMC4yODcsLTAuMDEgMC40MDYsLTAuMDUxYzAuMiwtMC4wNyAwLjMzOSwtMC4yNjMgMC4zNzYsLTAuNDZjMC4wMTYsLTAuMDgyIDAuMDEsLTAuMTQ1IDAuMDM5LC0wLjIyMWMwLjAzOCwtMC4xMDMgMC4xMTEsLTAuMTYgMC4wOSwtMC4yOTNjLTAuMDEsLTAuMDYyIC0wLjA1MSwtMC4xMiAtMC4wNjQsLTAuMTg3Yy0wLjAyMSwtMC4xMTQgMC4wMDIsLTAuMjI0IDAsLTAuMzM3Yy0wLjAwMywtMC4yIDAuMDE3LC0wLjM3OSAtMC4wNzgsLTAuNTVjLTAuMzgsLTAuNjg4IC0xLjIzNiwtMC45MjkgLTEuOTc1LC0wLjc4OWMtMC4xOCwwLjAzNSAtMC4yODYsMC4xMjcgLTAuNDQyLDAuMjA4Yy0wLjE3LDAuMDg4IC0wLjEzOSwwLjE2NiAtMC4zMTgsMC4yMjRjLTAuMDgxLDAuMDI2IC0wLjIxNSwwLjEyMyAtMC4yMTUsMC4yMjNjMC4wMDIsMC4xMTUgMC4wMDUsMC4wNTEgMC4wMTIsMC4xNjljLTAuMDIxLDAuMDExIC0wLjAyMiwtMC4wMDUgLTAuMDMxLC0wLjAyNSIgZmlsbD0iI0ZGRkZGRiIgaWQ9InN2Z18xMTYiLz4KICAgIDwvZz4KICAgPC9nPgogIDwvcGF0dGVybj4KIDwvZGVmcz4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8ZWxsaXBzZSBjeD0iMjU2IiBjeT0iMjU2IiBpZD0ic3ZnXzExOCIgcng9IjI1NiIgcnk9IjI1NiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIwIi8+CiAgPHBhdGggZD0ibTcxLjUsMzk5LjcyMzcyYzEuNjMyMzksLTUyLjI1NDc5IDE4Ljc1MDQ3LC0xMjIuOTMyMzUgNDkuOTM3MTIsLTE4MC41OTNjLTIuNTUyMjUsLTkuMzM1NyAtMy45MTA1MiwtMTkuMDg5NiAtMy45MTA1MiwtMjkuMTI5OTJjMCwtNTkuMTIyNTkgNDYuODg4NDgsLTEwOC40OTEyNyAxMDkuNDE5MDUsLTEyMC4zNjY5MmwwLDEwMi4xMjYwMmMwLDEzLjY1NzM5IDExLjExMDQxLDI0Ljc2ODY5IDI0Ljc2MzQxLDI0Ljc2ODY5bDguNTg0NTIsMGMxMy42NjQ0MiwwIDI0Ljc2ODY5LC0xMS4xMTEyOSAyNC43Njg2OSwtMjQuNzY4NjlsMCwtMTAyLjEyNjAyYzYyLjUzMDU3LDExLjg3NTY1IDEwOS40MTgxNyw2MS4yNDQzNCAxMDkuNDE4MTcsMTIwLjM2NjkyYzAsMTAuMDQxMTkgLTEuMzU4MjcsMTkuNzk0MjEgLTMuOTEwNTIsMjkuMTI5OTJjMzEuMTg2NjUsNTcuNjYwNjQgNDguMzA0NzQsMTI4LjMzODIgNDkuOTMwMDksMTgwLjU5M2MtNi41MDg0NiwtMTguMDU4MTYgLTE3LjMwNjk4LC00Ni43NTA1NCAtMzAuMTQyMDMsLTc1LjkxMzg0Yy0yOS4zMDEyNCwtNjYuNTc4MTQgLTUzLjkxMjY2LC0xMDIuNDA3MTcgLTc1LjI2MTA3LC0xMDkuNTIyNzJjLTM5LjI2MjQ4LC0xMy4wODM2OSAtNjguMTA2ODYsNC4zNjEyMyAtNzkuMDkzMzksMTIuODg3NzZjLTEwLjk5NDQ0LC04LjUyNjU0IC0zOS44MzA5MiwtMjUuOTc3NiAtNzkuMDkyNTIsLTEyLjg4Nzc2Yy0yMS4zNDkyOSw3LjExNjQzIC00NS45Njc3NCw0Mi45NDQ1NyAtNzUuMjYxMDcsMTA5LjUyMjcyYy0xMi44MzU5MywyOS4xNjMzIC0yMy42MzQ0NSw1Ny44NTU2OSAtMzAuMTQ5OTQsNzUuOTEzODRsMC4wMDAwMSwwem0xNTkuNTc3NTcsLTcuMjk5MTdsMCwtMjkuNDE3MjFsLTIxLjIzNjgzLDI5LjQxNzIxbDIxLjIzNjgzLDB6bTIwLjYzMDYxLC0yMDkuNTc4ODNsOC41ODQ1MiwwYzYuMTI5NzksMCAxMS4wOTgxMSwtNC45NjEyOSAxMS4wOTgxMSwtMTEuMDg0OTRsMCwtOTkuMTY5NjNjMCwtNi4xMTc0OSAtNC45NjgzMiwtMTEuMDg1ODEgLTExLjA5ODExLC0xMS4wODU4MWwtOC41ODQ1MiwwYy02LjEyNDUyLDAgLTExLjA5MTk2LDQuOTY4MzIgLTExLjA5MTk2LDExLjA4NTgxbDAsOTkuMTY4NzVjMCw2LjEyMzY0IDQuOTY4MzIsMTEuMDg1ODEgMTEuMDkxOTYsMTEuMDg1ODFsMCwwLjAwMDAxem0yOS4yNzkyNywyMDkuNTc4ODNsMjEuMTc4ODQsMGwtMjEuMTc4ODQsLTI5LjMyNjcybDAsMjkuMzI2NzJ6bTExNi44MTU3NCwtNjMuMTk1NjRjMTIuMzA3MDMsMjcuOTU0MzkgMjIuNzEyODMsNTUuNDc5MTUgMjkuMjAxOTYsNzMuMzk0MWMtMTkuNTcxOTQsLTcuMTk0NjIgLTM5LjM0MDY3LC0xMy4xODgyNCAtNTkuMTg3NiwtMTcuOTczODFsMjIuOTgwNzksLTUzLjYxODM0bC01OC42NjU3Myw5Mi4xNzAwNWwtMTUyLjIwNjM1LDBsLTU4LjY1MjU1LC05Mi4xNzAwNWwyMi4xNTg0NSw1MS42NzkzM2MtMjAuMDA0MTksNC44ODM5OCAtMzkuNDMyOTIsMTEuMTk2NTEgLTU4LjA5MTE0LDE4Ljk1ODY5YzYuNTE1NDksLTE3LjkzMzQgMTYuNzcxOTMsLTQ0Ljk4MTEgMjguODU2NjgsLTcyLjQzOTk3YzM1LjczNzY1LC04MS4xODg3OSA1Ny4zMzk5NywtOTguNzM4MjUgNjcuMDM1LC0xMDEuOTYzNDljNDEuMzg0MjMsLTEzLjgwMTQ4IDY4Ljc5ODI5LDEyLjYxOTggNjkuOTM0MjksMTMuNzM2NDZsNC44MTgwOSw0Ljc3ODU1bDQuODMwMzksLTQuNzY2MjVjMS4xNTUzMiwtMS4xMjg5NiAyOC41NjkzOSwtMjcuNTUwMjQgNjkuOTU5NzcsLTEzLjc0ODc2YzkuNjg4MDEsMy4yMjUyNCAzMS4yOTczNSwyMC43NzQ3IDY3LjAyNzk3LDEwMS45NjM0OWwtMC4wMDAwMiwwem0tMTk0LjY0NzUsLTEzLjg0MTAxYzE1LjM4ODE4LDAgMzcuNDYxNDEsLTQ0LjE0NTU4IDM3LjQ2MTQxLC00NC4xNDU1OHMtMTUuNzY2ODQsLTMxLjg2NjY3IC02MS41NTE4NCwtMTUuMzgyMDNjLTMwLjc3NjM2LDExLjA3MzUxIDguNzA4NCw1OS41Mjc2MSAyNC4wOTA0Myw1OS41Mjc2MXptMTI1Ljc0NTU0LDkwLjcyMTI5bC0xNS42NDgyNCwtMjEuNjg4NDFsLTQ0Ljg5MTQ5LC02Mi4xOTA1NmMxLjg5MzMyLC0yLjU1MzEzIDMuMDI5MzEsLTUuNzA2MzIgMy4wMjkzMSwtOS4xMzM2M2MwLC04LjQ5MzE1IC02Ljg5NDE1LC0xNS4zODczIC0xNS4zODgxOCwtMTUuMzg3M2MtOC41MDAxOCwwIC0xNS4zODczLDYuODk0MTUgLTE1LjM4NzMsMTUuMzg3M2MwLDMuNDI3MzEgMS4xMzU5OSw2LjU4MDUgMy4wMjg0NCw5LjEzMzYzbC00NC44OTA2MSw2Mi4xOTA1NmwtMTUuNjU1MjYsMjEuNjg4NDFsMjYuNzQxOTYsMGw5Mi4zMjY0NCwwbDI2LjczNDkzLDB6bTQuMDM0NCwtMTUwLjI0ODljLTQ1Ljc4NDEyLC0xNi40ODQ2NCAtNjEuNTQ0ODEsMTUuMzgyMDMgLTYxLjU0NDgxLDE1LjM4MjAzczIyLjA2NjIsNDQuMTQ1NTggMzcuNDYxNDEsNDQuMTQ1NThjMTUuMzgxMTUsMCA1NC44NTk3NiwtNDguNDU0MDkgMjQuMDgzNCwtNTkuNTI3NjF6bS05MS44NzU3MywxMzYuNTY0MjdsOS45ODIzMywwbDAsLTU3LjA3Mjg4bC05Ljk4MjMzLDEzLjgyNjk2bDAsNDMuMjQ1OTJ6bTE5Ljk2NDY2LDBsOS45ODE0NSwwbDAsLTQzLjE1MzY3bC05Ljk4MTQ1LC0xMy44MjY5NmwwLDU2Ljk4MDYzeiIgaWQ9InN2Z18xMTciIHN0cm9rZT0ibnVsbCIvPgogPC9nPgo8L3N2Zz4=");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    box-shadow: 0 0 10px 0 #000a;
    border: 5px solid #ddd;
    animation: 1s fade .5s ease-in both;
    flex-shrink: 0;
}

.patch-note-title {
    text-align: center;
    font-size: 1.5em;
    margin-bottom: 0.25em;
    font-weight: bold;
    animation: 1s fade .7s ease-in both;
}

.patch-note-version {
    text-align: center;
    color: var(--tui-base-06);
    font-size: 0.9em;
    animation: 1s fade .7s ease-in both;
}

.patch-note-content {
    margin: 1.25em 1em 1em;
    animation: 1s fade .9s ease-in both;
    overflow: hidden auto;
}

.patch-note-content::-webkit-scrollbar {
    width: 6px;
}

.patch-note-content::-webkit-scrollbar-track {
    background: var(--tui-base-03);
    border-radius: 10px;
}

.patch-note-content::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: var(--tui-base-04);
}

.patch-note-content::-webkit-scrollbar-button {
    height: 10px;
}

.patch-note-content ul {
  list-style: none;
  margin-bottom: .8em;
}

.patch-note-content ul li {
    margin: .5em 0;
}

.patch-note-content ul li::before {
    content: "\\2022";
    color: var(--tui-primary);
    font-weight: bold;
    display: inline-block;
    width: 0.6em;
    font-size: 2em;
    vertical-align: bottom;
}

.patch-note-content ul li .patch-description {
    color: var(--tui-base-06);
    margin: 0.25em 0 0 1.55em;
    font-size: .8em;
    line-height: 1.1em;
}

.patch-note-button-wrapper {
    text-align: center;
    animation: 1s fade 2s ease-in both;
}

.patch-note-button-wrapper button {
    background-color: var(--tui-primary);
    border: none;
    padding: 0.8em 1.5em;
    border-radius: var(--tui-radius-m);
    color: #000;
    font-size: .9em;
    cursor: pointer;
}

.patch-note-button-wrapper button:hover {
    background-color: var(--tui-primary-hover);
}

.patch-note-button-wrapper button:active {
    background-color: var(--tui-primary-active);
}

/* Редактор выражений
--------------------------------------------------------------------------------------------------
*/

body.dark-mode .monaco-editor {
    --vscode-editor-background: #0000;
    --vscode-editorGutter-background: #0000;
}

.editor-panel-wrapper {
    z-index: 1000;
    background-color: #fff;
}

body.dark-mode .editor-panel-wrapper {
    /*backdrop-filter: blur(40px) brightness(0.5) !important;*/
    background-color: var(--dark-background-header);
    border-top: 1px solid var(--tui-base-03);
}

body.dark-mode app-spel-editor-panel .editor-wrapper {
    border: 1px solid var(--syntax-shadow);
    box-shadow: 0 0 20px 0 var(--syntax-shadow);
    background: var(--dark-background-main);
    padding-left: 0;
    padding-bottom: 0;
}

body.dark-mode .monaco-editor .cursors-layer .cursor {
    background-color: var(--tui-text-01) !important;
    border-color: var(--tui-text-01) !important;
}

body.dark-mode .monaco-editor .focused .selected-text {
    background-color: var(--syntax-selectionBackground) !important;
}

body.dark-mode .monaco-editor .selected-text {
    background-color: var(--syntax-inactiveSelectionBackground) !important;
}

body.dark-mode .monaco-editor .margin {
    background-color: var(--syntax-line-bg) !important;
    position: relative;
    contain: initial !important;
    width: 30px !important;
    z-index: 1;
    backdrop-filter: blur(20px);
}

body.dark-mode .monaco-editor .line-numbers {
    color: var(--syntax-line) !important;
    width: 20px !important;
}

body.dark-mode .monaco-editor .margin::before {
    content: "";
    position: absolute;
    top: -16px;
    left: 0;
    width: 100%;
    height: 16px;
    background-color: var(--syntax-line-bg) !important;
}

body.dark-mode .monaco-editor .margin::after {
    content: "";
    position: absolute;
    bottom: -16px;
    left: 0;
    width: 100%;
    height: 16px;
    background-color: var(--syntax-line-bg) !important;
}

body.dark-mode .monaco-editor .overflow-guard,
body.dark-mode .monaco-editor .overflow-guard .monaco-scrollable-element.editor-scrollable.vs {
    overflow: visible !important;
}

body.dark-mode .monaco-editor .mtk1 {
    color: var(--syntax-character);
}

body.dark-mode .monaco-editor .mtk14 {
    color: var(--syntax-base);
}

body.dark-mode .monaco-editor .mtk13 {
    color: var(--syntax-function);
}

body.dark-mode .monaco-editor .mtk28 {
    color: var(--syntax-variable);
}

body.dark-mode .monaco-editor .unexpected-closing-bracket,
body.dark-mode .monaco-editor .mtk4 {
    color: var(--syntax-error);
}

body.dark-mode .textarea-wrapper .textarea-icon,
body.dark-mode .editor-panel-header .collapse-btn {
    background-color: var(--tui-base-03) !important;
}

body.dark-mode .textarea-wrapper .textarea-icon tui-wrapper[data-appearance=icon]:hover:not(._no-hover), 
body.dark-mode .textarea-wrapper .textarea-icon tui-wrapper[data-appearance=icon][data-state=hovered]
body.dark-mode .editor-panel-header .collapse-btn tui-wrapper[data-appearance=icon]:hover:not(._no-hover), 
body.dark-mode .editor-panel-header .collapse-btn tui-wrapper[data-appearance=icon][data-state=hovered] {
    color: var(--dark-scheme-text-color) !important;
    background-color: var(--tui-base-04) !important;
}

body.dark-mode .expanded tui-text-area {
    --tui-secondary: #0000 !important;
}

body.dark-mode .monaco-editor .slider {
    background-color: rgba(255, 255, 255, .2) !important;
}

/* Окно настройки кастомной темы
--------------------------------------------------------------------------------------------------
*/

@keyframes windowOpen {
        from {transform: scale( 90% ); opacity: 0;}
        to {transform: scale( 100% ); opacity: 1;}
      }

      body.dark-mode div#calc {
        --main-text-color: #fff;
        --secondary-text-color: #fffa;
        --counter-button-color: #0006;
        --counter-button-color-hover: #0008;
        --counter-button-color-active: #000a;
        --borders-color: #5555;
        --window-background-color: #292a2daa;
        --window-controls-border-color: #0000;
        --mac-os-blur: blur(40px) brightness(0.5);
        --deleter-red: #ff5a52;
      }

      body:not(.dark-mode) div#calc {
        --main-text-color: #000;
        --secondary-text-color: #000a;
        --counter-button-color: #fff6;
        --counter-button-color-hover: #fff8;
        --counter-button-color-active: #fffa;
        --borders-color: #bbb5;
        --window-background-color: #fffa;
        --window-controls-border-color: #0002;
        --mac-os-blur: blur(40px) brightness(1);
        --deleter-red: #ff5a52;
      }

      @media (prefers-color-scheme: dark) {
        div#calc {
          --main-text-color: #fff;
          --secondary-text-color: #fffa;
          --counter-button-color: #0006;
          --counter-button-color-hover: #0008;
          --counter-button-color-active: #000a;
          --borders-color: #5555;
          --window-background-color: #292a2daa;
          --window-controls-border-color: #0000;
          --mac-os-blur: blur(40px) brightness(0.5);
          --deleter-red: #ff5a52;
        }
      }

      @media (prefers-color-scheme: light) {
        div#calc {
          --main-text-color: #000;
          --secondary-text-color: #000a;
          --counter-button-color: #fff6;
          --counter-button-color-hover: #fff8;
          --counter-button-color-active: #fffa;
          --borders-color: #bbb5;
          --window-background-color: #fffa;
          --window-controls-border-color: #0002;
          --mac-os-blur: blur(40px) brightness(1);
          --deleter-red: #ff5a52;
        }
      }

      div#calc button {
        color: var(--secondary-text-color);
      }

      #calc.draggable {
        position: fixed;
        max-width: 420px;
        max-height: 82vh;
        user-select: none;
        border: 1px solid var(--tui-base-03);
        top: calc(50vh - 300px);
        left: calc(50vw - 210px);
        backdrop-filter: var(--mac-os-blur);
        -webkit-backdrop-filter: var(--mac-os-blur);
        background-color: var(--dark-background-header);
        border-radius: 10px;
        box-shadow: 0px 10px 20px #0006;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        width: 600px;
        animation: windowOpen .1s ease-in-out;
      }

      #calc.draggable.hidden {
        animation: windowOpen .1s reverse ease-in-out;
      }

      #calc.draggable .header {
        cursor: move;
        padding: 10px;
        border-bottom: 1px solid var(--tui-base-03);
        transition: .3s;
        user-select: none;
        -webkit-user-select:none;
      }

      #calc.draggable .header .controls:hover div:before {
        visibility: visible;
      }

      #calc.draggable .header .controls div {
        border-radius: 100%;
        height: 14px;
        width: 14px;
        cursor: default;
        display: inline-block;
        position: relative;
        border: .5px solid var(--window-controls-border-color);
        box-sizing: border-box;
      }

      #calc.draggable .header .controls div:active {
        filter: brightness(1.2);
      }

      #calc.draggable .header .controls div:before {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        pointer-events: none;
        background-position: center;
        background-size: 50% 50%;
        background-repeat: no-repeat;
        opacity: .5;
        visibility: hidden;
      }

      #calc.draggable .header .controls div.closeButton {
        background-color: rgb(255,95,86);
      }

      #calc.draggable .header .controls div.closeButton:before {
        background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzZweCIgaGVpZ2h0PSIzNnB4IiB2aWV3Qm94PSIwIDAgMzYgMzYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+UGF0aDwvdGl0bGU+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8cGF0aCBkPSJNLTUuMzI0MzgsMTcuOTMxNiBDLTUuMzI0MzgsMTkuMDA1ODY2NyAtNC45MzM3NTMzMywxOS45MjU0NjY3IC00LjE1MjUsMjAuNjkwNCBDLTMuMzcxMjMzMzMsMjEuNDU1NCAtMi40NDM1LDIxLjgzNzkgLTEuMzY5MywyMS44Mzc5IEwxMy44NjUxLDIxLjgzNzkgTDEzLjg2NTEsMzYuNTg0IEMxMy44NjUxLDM3LjYyNTY2NjcgMTQuMjU1NzMzMywzOC41Mjg5NjY3IDE1LjAzNywzOS4yOTM5IEMxNS44MTgyLDQwLjA1ODkgMTYuNzQ1OTMzMyw0MC40NDE0IDE3LjgyMDIsNDAuNDQxNCBDMTguODk0NCw0MC40NDE0IDE5LjgyMjEzMzMsNDAuMDU4OSAyMC42MDM0LDM5LjI5MzkgQzIxLjM4NDYsMzguNTI4OTY2NyAyMS43NzUyLDM3LjYyNTY2NjcgMjEuNzc1MiwzNi41ODQgTDIxLjc3NTIsMjEuODM3OSBMMzcuMDU4NCwyMS44Mzc5IEMzOC4xMzI2NjY3LDIxLjgzNzkgMzkuMDYwNCwyMS40NTU0IDM5Ljg0MTYsMjAuNjkwNCBDNDAuNjIyODY2NywxOS45MjU0NjY3IDQxLjAxMzUsMTkuMDA1ODY2NyA0MS4wMTM1LDE3LjkzMTYgQzQxLjAxMzUsMTYuODU3NCA0MC42MjI4NjY3LDE1LjkyOTY2NjcgMzkuODQxNiwxNS4xNDg0IEMzOS4wNjA0LDE0LjM2NzIgMzguMTMyNjY2NywxMy45NzY2IDM3LjA1ODQsMTMuOTc2NiBMMjEuNzc1MiwxMy45NzY2IEwyMS43NzUyLC0wLjYyMyBDMjEuNzc1MiwtMS42NjQ2NjY2NyAyMS4zODQ2LC0yLjU1OTg2NjY3IDIwLjYwMzQsLTMuMzA4NiBDMTkuODIyMTMzMywtNC4wNTcyNjY2NyAxOC44OTQ0LC00LjQzMTYgMTcuODIwMiwtNC40MzE2IEMxNi43NDU5MzMzLC00LjQzMTYgMTUuODE4MiwtNC4wNTcyNjY2NyAxNS4wMzcsLTMuMzA4NiBDMTQuMjU1NzMzMywtMi41NTk4NjY2NyAxMy44NjUxLC0xLjY2NDY2NjY3IDEzLjg2NTEsLTAuNjIzIEwxMy44NjUxLDEzLjk3NjYgTC0xLjM2OTMsMTMuOTc2NiBDLTIuNDQzNSwxMy45NzY2IC0zLjM3MTIzMzMzLDE0LjM2NzIgLTQuMTUyNSwxNS4xNDg0IEMtNC45MzM3NTMzMywxNS45Mjk2NjY3IC01LjMyNDM4LDE2Ljg1NzQgLTUuMzI0MzgsMTcuOTMxNiBaIiBpZD0iUGF0aCIgZmlsbD0iIzAwMDAwMCIgZmlsbC1ydWxlPSJub256ZXJvIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNy44NDQ1NjAsIDE4LjAwNDkwMCkgcm90YXRlKDQ1LjAwMDAwMCkgdHJhbnNsYXRlKC0xNy44NDQ1NjAsIC0xOC4wMDQ5MDApICI+PC9wYXRoPgogICAgPC9nPgo8L3N2Zz4=");
      }

      #calc.draggable .header .controls {
        display: inline-flex;
        cursor: default;
        position: absolute;
        gap: 10px;
      }

      #calc.draggable .content {
        padding: 10px;
        overflow: auto;
        max-height: 600px;
        transition: max-height .3s ease-out, opacity .3s ease-out, padding .3s ease-out;
        overflow: overlay;
        margin-right: 2px;
        padding-right: 8px;
      }

      #calc.draggable .content::-webkit-scrollbar {
        display: unset;
        background: transparent;
        width: 4px;
      }

      #calc.draggable .content::-webkit-scrollbar-thumb {
        background: var(--tui-base-02);
        border-radius: 4px;
      }

      #calc.draggable .content::-webkit-scrollbar-thumb:hover {
        background: var(--tui-base-03);
      }

      #calc.draggable .content::-webkit-scrollbar-button:single-button {
        height: 2px;
      }

      body:not(.dark-mode) .content::-webkit-scrollbar-thumb {
        border-color: #fcfcfc;
      }

      #calc-buttons-wrapper {
        display: flex;
        gap: 10px;
        padding: 10px;
        text-align: right;
        position: relative;
        border-top: 1px solid var(--tui-base-03);
        transition: .3s;
      }

      #calc-buttons-wrapper.notification {
        pointer-events: none;
      }

      #calc-buttons-wrapper.notification button {
        opacity: 0;
      }

      #calc-buttons-wrapper.notification #notifier {
        opacity: 1;
      }

      #notifier {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        text-align: center;
        padding: 17px;
        pointer-events: none;
        opacity: 0;
        font-size: 1.1em;
        transition: .3s ease-in-out;
      }

      button.calc-action-button {
        flex: 1;
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
        border: 1px solid #555;
        background: linear-gradient(to bottom, #4d4d4daa, #404040aa);
        border-color: #555a;
        transition: .3s ease-in-out;
      }

      button.calc-action-button:hover {
        background: linear-gradient(to bottom, #4d4d4d, #404040);
      }

      button.calc-action-button:active {
        background: linear-gradient(to top, #4d4d4d, #404040);
      }

      body:not(.dark-mode) button.calc-action-button {
        background: linear-gradient(to bottom, #a6a6a6ab, #8c8c8cab);
        border-color: #808080ab;
      }

      body:not(.dark-mode) button.calc-action-button:hover {
        background: linear-gradient(to bottom, #8c8c8cab, #737373ab);
        border-color: #808080ab;
      }

      body:not(.dark-mode) button.calc-action-button:active {
        background: linear-gradient(to top, #8c8c8cab, #737373ab);
      }

      button#copy_button {
        background: linear-gradient(to bottom, #287cfeaa, #0466ffaa);
        border-color: #3381ffaa;
      }

      button#copy_button:hover {
        background: linear-gradient(to bottom, #287cfe, #0466ff);
        border-color: #3381ff;
      }

      button#copy_button:active {
        background: linear-gradient(to top, #287cfe, #0466ff);
      }

      body:not(.dark-mode) button#copy_button {
        background: linear-gradient(to bottom, #80b3feab, #4d91ffab);
        border-color: #5294ffab;
      }

      body:not(.dark-mode) button#copy_button:hover {
        background: linear-gradient(to bottom, #4e94fdab, #1a71ffab);
        border-color: #3381ff;
      }

      body:not(.dark-mode) button#copy_button:active {
        background: linear-gradient(to top, #4e94fdab, #1a71ffab);
      }

      button#clear_button {
        background: linear-gradient(to bottom, #fe2a2aab, #ff0505ab);
        border-color: #ff3333ab;
      }

      button#clear_button:hover {
        background: linear-gradient(to bottom, #fe2a2a, #ff0505);
        border-color: #ff3333;
      }

      button#clear_button:active {
        background: linear-gradient(to top, #fe2a2a, #ff0505);
      }

      body:not(.dark-mode) button#clear_button {
        background: linear-gradient(to bottom, #fe8181ab, #ff4d4dab);
        border-color: #ff5252ab;
      }

      body:not(.dark-mode) button#clear_button:hover {
        background: linear-gradient(to bottom, #fd4e4eab, #ff1a1aab);
        border-color: #ff3333;
      }

      body:not(.dark-mode) button#clear_button:active {
        background: linear-gradient(to top, #fd4e4eab, #ff1a1aab);
      }

      #sp_counters-wrapper {
        padding: 5px 1px 7px 3px;
        margin: -10px auto 0;
        pointer-events: none;
      }

      .calc-sum-wrapper {
        margin-bottom: -10px;
        display: flex;
        align-items: center;
        justify-content: end;
      }

      #calc_sum,
      #calc_deleter_sum {
        transition: .3s ease-in-out;
        line-height: .8em;
      }

      #calc_deleter_sum {
        visibility: hidden;
      }

      #calc .calc-sum-wrapper #calc_sum {
        font-size: 1em;
        opacity: 1;
        font-weight: bold;
      }

      .sp-calc .control-count {
        margin: 0 0 0 5px;
        display: flex;
        border-radius: 5px;
        transition: .3s ease-in-out;
        outline: 2px solid #0000;
        height: 25px;
      }

      .sp-calc .control-count input[type="number"] {
        -webkit-appearance: textfield;
           -moz-appearance: textfield;
                appearance: textfield;
        padding: 0;
        text-align: center;
        width: 30px;
        height: 25px;
        border: none;
        border-radius: 0;
        background: var(--counter-button-color) !important;
        color: var(--tui-primary-text);
        margin: 0;
        outline: none;
      }

      .sp-calc .control-count input[type="color"] {
        -webkit-appearance: none;
        border: 2px solid #000;
        background: #000;
        border-radius: 20px;
        width: 26px;
        height: 26px;
        overflow: hidden;
        padding: 0;
        box-shadow: 0 0 10px #fffa;
        cursor: pointer;
        }

        .sp-calc .control-count input[type="color"]::-webkit-color-swatch-wrapper {
            padding: 0;
        }

        .sp-calc .control-count input[type="color"]::-webkit-color-swatch {
            border: none;
        }

      .sp-calc .control-count button {
        border: none;
        height: 25px;
        width: 25px;
        font-size: 20px;
        font-weight: 600;
        outline: none;
        line-height: 0;
      }

      .sp-calc .control-count button.control-count-increment-button {
        background: var(--counter-button-color);
      }

      .sp-calc .control-count button:last-child {
        border-radius: 0 5px 5px 0;
      }

      .sp-calc .control-count button:first-child {
        border-radius: 5px 0 0 5px;
      }

      .sp-calc .control-count button.control-count-increment-button:hover {
        background: var(--counter-button-color-hover);
      }

      .sp-calc .control-count button.control-count-increment-button:active {
        background: var(--counter-button-color-active);
      }

      .sp-calc .control-count button.control-count-decrement-button {
        background: var(--counter-button-color);
      }

      .sp-calc .control-count button.control-count-decrement-button:hover {
        background: var(--counter-button-color-hover);
      }

      .sp-calc .control-count button.control-count-decrement-button:active {
        background: var(--counter-button-color-active);
      }

      .sp-calc .control-category {
        position: relative;
        overflow: hidden;
        transition: max-height .3s ease-out;
        /*max-height: 1000px;*/
      }

      .sp-calc .control-category.collapsed {
        max-height: 50px !important;
      }

      .control-category.collapsed:not(:last-child) {
        border-bottom: 1px solid var(--tui-base-03);
      }

      .sp-calc .control-category-title {
        margin: 12px 10px;
        font-size: 1.25em;
        font-weight: bold;
        text-transform: uppercase;
      }

      .sp-calc .control-category input.collapse-cotrol {
        position: absolute;
        top: 0;
        height: 50px;
        opacity: 0;
        cursor: pointer;
        left: 0;
        width: 100%;
      }

      .sp-calc .control-category-title::after {
        content: "";
        position: absolute;
        -webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgZm9jdXNhYmxlPSJmYWxzZSIgaGVpZ2h0PSIxNiI+PGcgaWQ9InR1aUljb25DaGV2cm9uRG93biIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtOCwtOCkiPjxzdmcgeD0iNTAlIiB5PSI1MCUiPjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICAgIHdpZHRoPSIxNiIKICAgICBoZWlnaHQ9IjE2IgogICAgIHZpZXdCb3g9IjAgMCAxNiAxNiI+CiAgICA8cG9seWxpbmUgZmlsbD0ibm9uZSIKICAgICAgICAgICAgICBzdHJva2U9ImN1cnJlbnRDb2xvciIKICAgICAgICAgICAgICBzdHJva2Utd2lkdGg9IjIiCiAgICAgICAgICAgICAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogICAgICAgICAgICAgIHN0cm9rZS1saW5lam9pbj0icm91bmQiCiAgICAgICAgICAgICAgcG9pbnRzPSI0LDYgOCwxMCAxMiw2IiAvPgo8L3N2Zz4KPC9zdmc+PC9nPjwvc3ZnPgo=);
        -webkit-mask-size: cover;
        background: var(--tui-primary-text);
        height: 24px;
        width: 24px;
        top: 12px;
        right: 13px;
        z-index: 1;
        pointer-events: none;
        transition: transform .3s, opacity .3s;
        transform: rotate(0deg);
        opacity: .85;
      }

      .sp-calc .control-category.collapsed .control-category-title::after {
        transform: rotate(-90deg);
        opacity: .5;
      }

      .sp-calc .control-row {
        padding: 5px;
        background: var(--tui-base-01);
        border-radius: 10px;
        margin: 10px 0 0 0;
        border: 2px solid var(--tui-base-03);
        transition: opacity .3s;
      }

      .control-category.collapsed .control-row {
        opacity: 0;
      }

      .sp-calc .control-row .control-header {
        display: flex;
        /*transition: 1s;*/
        padding: 5px;
      }

      .sp-calc .control-title {
        flex: 1;
        margin-top: 2px;
      }

      .control-description:hover span {
        opacity: 1;
      }

      .sp-calc .control-description {
        font-size: 0.9em;
        background: var(--tui-secondary);
        border-radius: 5px;
        overflow: hidden;
        margin-top: 5px;
        transition: max-height 1s;
        color: var(--tui-text-02);
      }

      /*.sp-calc .control-row:not(:hover) .control-description {
        height: 0;
      }*/

      /*.sp-calc .control-row:hover .control-header {
        padding-bottom: 10px;
      }*/

      .sp-calc .control-description span {
        display: block;
        display: block;
        margin: 5px 10px;
      }

      #calc.minimized .content {
        max-height: 0;
        opacity: 0;
        padding: 0 10px;
      }

      div#calc.minimized {
        max-width: 280px;
      /*  left: 40px !important;
        top: 90px !important;
        transition: max-Width .3s ease-out, top .3s ease-out, left .3s ease-out;
      */}

      div#calc {
        transition: max-Width .3s ease-out;
        color: var(--tui-primary-text);
      }

      div#calc.minimized .header .controls .grayButton {
        opacity: 0;
      }

      div#calc.minimized .header .controls div {
        transition: opacity .3s ease-out;
      }

      div#calc.minimized .header,
      div#calc.minimized #calc-buttons-wrapper {
        border-color: transparent;
      }

      app-sandbox app-left-panel .buttons {
            background-color: var(--tui-base-01) !important;
      }
`);

function LDColor(color, percent) {
    var num = parseInt(color.slice(1),16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        B = (num >> 8 & 0x00FF) + amt,
        G = (num & 0x0000FF) + amt;

        return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
}

function buildCustomStyle( styleJSON ) {
    return `body.dark-mode[palette="custom_theme"] {
            --dside-orange: linear-gradient(180deg, ` + styleJSON.colors.orange + ` 0%, ` + styleJSON.colors.orange + ` 100%);
            --dside-orange-active: linear-gradient(180deg, ` + LDColor( styleJSON.colors.orange , 20 ) + ` 0%, ` + LDColor( styleJSON.colors.orange , 20 ) + ` 100%);
            --dside-orange-glow: drop-shadow(0px 0px 10px ` + LDColor( styleJSON.colors.orange , 20 ) + `);
            --dside-orange-button: ` + styleJSON.colors.orange + `;
            --dside-orange-comment: ` + styleJSON.colors.orange + `;

            --dside-green: linear-gradient(180deg, ` + styleJSON.colors.green + ` 0%, ` + styleJSON.colors.green + ` 100%);
            --dside-green-active: linear-gradient(180deg, ` + LDColor( styleJSON.colors.green , 20 ) + ` 0%, ` + LDColor( styleJSON.colors.green , 20 ) + ` 100%);
            --dside-green-glow: drop-shadow(0px 0px 10px ` + LDColor( styleJSON.colors.green , 20 ) + `);
            --dside-green-button: ` + styleJSON.colors.green + `;
            --dside-green-comment: ` + styleJSON.colors.green + `;

            --dside-blue: linear-gradient(180deg, ` + styleJSON.colors.blue + ` 35%, ` + styleJSON.colors.blue + ` 100%);
            --dside-blue-active: linear-gradient(180deg, ` + LDColor( styleJSON.colors.blue , 20 ) + ` 35%, ` + LDColor( styleJSON.colors.blue , 20 ) + ` 100%);
            --dside-blue-glow: drop-shadow(0px 0px 10px ` + LDColor( styleJSON.colors.blue , 20 ) + `);
            --dside-blue-button: ` + styleJSON.colors.blue + `;
            --dside-blue-comment: ` + styleJSON.colors.blue + `;

            --dside-yellow: linear-gradient(180deg, ` + styleJSON.colors.yellow + ` 35%, ` + styleJSON.colors.yellow + ` 100%);
            --dside-yellow-active: linear-gradient(180deg, ` + LDColor( styleJSON.colors.yellow , 20 ) + ` 35%, ` + LDColor( styleJSON.colors.yellow , 20 ) + ` 100%);
            --dside-yellow-glow: drop-shadow(0px 0px 10px ` + LDColor( styleJSON.colors.yellow , 20 ) + `);
            --dside-yellow-button: ` + styleJSON.colors.yellow + `;
            --dside-yellow-comment: ` + styleJSON.colors.yellow + `;

            --dside-diff-text: ` + LDColor( styleJSON.colors.base , 44 ) + `;
            --dside-diff: ` + styleJSON.colors.base + ` !important;
            --dside-diff-hover: ` + LDColor( styleJSON.colors.base , 10 ) + ` !important;
            --dside-diff-active: ` + LDColor( styleJSON.colors.base , 20 ) + ` !important;
            --dside-diff-border: ` + LDColor( styleJSON.colors.base , 35 ) + ` !important;

            --dside-overlay: ` + LDColor( styleJSON.colors.base , -18 ) + `66 !important;
            --canvas-shadow: none;

            --dside-lasso-border: ` + LDColor( styleJSON.colors.base , 50 ) + `80 !important;
            --dside-lasso-color: ` + LDColor( styleJSON.colors.base , 50 ) + `40 !important;

            --dark-background-main: ` + LDColor( styleJSON.colors.base , -5 ) + ` !important;
            --dark-background-header: ` + LDColor( styleJSON.colors.base , 5 ) + `40 !important;
            --tui-primary-text: ` + styleJSON.colors.text + `cc !important;
            --tui-primary: ` + styleJSON.colors.primary + ` !important;
            --tui-primary-hover: ` + LDColor( styleJSON.colors.primary , -3 ) + ` !important;
            --tui-primary-active: ` + LDColor( styleJSON.colors.primary , -5 ) + ` !important;
            --tui-text-01: ` + styleJSON.colors.text + `cc !important;
            --tui-text-02: ` + styleJSON.colors.text + `8a !important;
            --tui-text-03: ` + styleJSON.colors.text + `66 !important;
            --tui-link: ` + styleJSON.colors.link + ` !important;
            --tui-link-hover: ` + LDColor( styleJSON.colors.link , -15 ) + ` !important;
            --dark-scheme-text-color: ` + styleJSON.colors.blockText + `;
            --dark-scheme-text-color-transparent: ` + styleJSON.colors.blockText + `66;
            --tui-base-01: ` + styleJSON.colors.base + ` !important;
            --tui-base-02: ` + styleJSON.colors.base + ` !important;
            --tui-base-04: ` + LDColor( styleJSON.colors.base , 10 ) + ` !important;
            --tui-focus: ` + LDColor( styleJSON.colors.base , 34 ) + ` !important;
            --tui-base-03: ` + LDColor( styleJSON.colors.base , 2 ) + ` !important;
            --tui-base-05: ` + LDColor( styleJSON.colors.base , 15 ) + ` !important;
            --tui-base-07: ` + styleJSON.colors.base + `80 !important;
            --tui-base-09: ` + styleJSON.colors.text + `cc !important;
            --tui-secondary: ` + LDColor( styleJSON.colors.base , -7 ) + ` !important;
            --tui-secondary-hover: ` + LDColor( styleJSON.colors.base , -15 ) + ` !important;
            --tui-secondary-active: ` + LDColor( styleJSON.colors.base , -10 ) + ` !important;
            --tui-elevation-01: ` + styleJSON.colors.base + ` !important;
            --tui-elevation-02: ` + styleJSON.colors.base + ` !important;

            --dark-context-background: ` + LDColor( styleJSON.colors.base , 5 ) + `40 !important;

            --custom-theme-gradient: linear-gradient( 130deg , ` + styleJSON.colors.orange + ` , ` + styleJSON.colors.blue + ` , ` + styleJSON.colors.green + ` , ` + styleJSON.colors.yellow + ` );

            /* Syntax colors
            -------------------------------------------------------------------------
            */

            --syntax-base: ` + styleJSON.colors.text + `;
            --syntax-line: #5E5E5E;
            --syntax-line-bg: #0004;

            --syntax-function: ` + styleJSON.colors.syntax_function + `;
            --syntax-variable: ` + styleJSON.colors.syntax_variable + `;
            --syntax-character: ` + styleJSON.colors.syntax_character + `;
            --syntax-error: #ff0000;

            --syntax-shadow: #0006;

            --syntax-selectionBackground: #004080;
            --syntax-inactiveSelectionBackground: #2d4053;
        }`
}

function addCustomStyle(styleString) {
	const style = document.createElement('style');
	style.textContent = styleString;
	style.setAttribute("id" , "dark_style_custom");
	document.head.append(style);
}

function updateCustomStyle(styleString) {
	const style = document.getElementById("dark_style_custom");
	style.textContent = styleString;
}

var customStyleJSON = {};
var customStyleJSON_default = {
    "palette_name": "Настраиваемая палитра",
    "colors": {
        "text": "#ffffff",
        "link": "#89abf5",
        "blockText": "#ffffff",
        "base": "#35363b",
        "primary": "#ffdd2d",
        "orange": "#F1721F",
        "green": "#1FB127",
        "blue": "#279CD8",
        "yellow": "#b2b21f",
        "syntax_function": "#4db3ff",
        "syntax_variable": "#1dd74d",
        "syntax_character": "#4db3ff"
    }
  };

var categoriesJSON = [
  {
    "label": "Базовые цвета"
  },
  {
    "label": "Цвета блоков"
  },
  {
    "label": "Подсветка синтаксиса"
  }
];

var controlsJSON = [
  {
    "category": "Базовые цвета",
    "id" : "base",
    "label" : "Ключевой цвет",
    "description": "Основной цвет, который будет влиять на все элементы в интерфейсе",
    "control_type": "color"
  },
  {
    "category": "Базовые цвета",
    "id" : "primary",
    "label" : "Акцентный цвет",
    "description": "Фирменный желтый цвет Тинькофф",
    "control_type": "color"
  },
  {
    "category": "Базовые цвета",
    "id" : "text",
    "label" : "Цвет текста",
    "description": "Основной цвет текста, который будет влиять на все элементы в интерфейсе",
    "control_type": "color"
  },
  {
    "category": "Базовые цвета",
    "id" : "link",
    "label" : "Цвет ссылок",
    "description": "Будет влиять на все ссылки в интерфейсе и выделение стрелок в схеме процедуры",
    "control_type": "color"
  },
  {
    "category": "Цвета блоков",
    "id" : "blockText",
    "label" : "Цвет текста",
    "description": "Цвет текста в блоках и их обрамлений",
    "control_type": "color"
  },
  {
    "category": "Цвета блоков",
    "id" : "orange",
    "label" : "Оранжевый блок",
    "description": "Блоки сообщений, одиночного выбора, переходов и форм",
    "control_type": "color"
  },
  {
    "category": "Цвета блоков",
    "id" : "green",
    "label" : "Зеленый блок",
    "description": "Процедуры, выбор продукта, поиск в трекере и т.д.",
    "control_type": "color"
  },
  {
    "category": "Цвета блоков",
    "id" : "blue",
    "label" : "Голубой блок",
    "description": "Переменные, проверки и коллы",
    "control_type": "color"
  },
  {
    "category": "Цвета блоков",
    "id" : "yellow",
    "label" : "Желтый блок",
    "description": "Проверка, ожидающая колла",
    "control_type": "color"
  },
  {
    "category": "Подсветка синтаксиса",
    "id" : "syntax_function",
    "label" : "Цвет для функций",
    "description": "",
    "control_type": "color"
  },
  {
    "category": "Подсветка синтаксиса",
    "id" : "syntax_variable",
    "label" : "Цвет для переменных",
    "description": "",
    "control_type": "color"
  },
  {
    "category": "Подсветка синтаксиса",
    "id" : "syntax_character",
    "label" : "Цвет для спецсимволов",
    "description": "",
    "control_type": "color"
  },
  {
    "category": "Дополнительные настройки",
    "id" : "input_3",
    "label" : "Включить размытие",
    "description": "Эффект размытия под некоторыми элементами интерйеса аля MacOs)",
    "control_type": "checkbox"
  }
];

window.sendEmail = function() {
{
	const body = "Пожалуйста, подробно опиши ошибку или идею, которая у тебя возникла и приложи скриншот по возможности" + getBrowserInfo();
	const subject = "DARK MODE feedback";
    window.location = "mailto:a.ivashchenko@tinkoff.ru&body=" + body + "&subject=" + subject;
}}

function getBrowserInfo() {
	var nVer = navigator.appVersion;
	var nAgt = navigator.userAgent;
	var browserName  = navigator.appName;
	var fullVersion  = ''+parseFloat(navigator.appVersion);
	var majorVersion = parseInt(navigator.appVersion,10);
	var nameOffset,verOffset,ix;
	var result = "";


	if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
	 browserName = "Opera";
	 fullVersion = nAgt.substring(verOffset+6);
	 if ((verOffset=nAgt.indexOf("Version"))!=-1)
	   fullVersion = nAgt.substring(verOffset+8);
	}

	else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
	 browserName = "Microsoft Internet Explorer";
	 fullVersion = nAgt.substring(verOffset+5);
	}

	else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
	 browserName = "Chrome";
	 fullVersion = nAgt.substring(verOffset+7);
	}

	else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
	 browserName = "Safari";
	 fullVersion = nAgt.substring(verOffset+7);
	 if ((verOffset=nAgt.indexOf("Version"))!=-1)
	   fullVersion = nAgt.substring(verOffset+8);
	}

	else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
	 browserName = "Firefox";
	 fullVersion = nAgt.substring(verOffset+8);
	}

	else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
	          (verOffset=nAgt.lastIndexOf('/')) )
	{
	 browserName = nAgt.substring(nameOffset,verOffset);
	 fullVersion = nAgt.substring(verOffset+1);
	 if (browserName.toLowerCase()==browserName.toUpperCase()) {
	  browserName = navigator.appName;
	 }
	}

	if ((ix=fullVersion.indexOf(";"))!=-1)
	   fullVersion=fullVersion.substring(0,ix);
	if ((ix=fullVersion.indexOf(" "))!=-1)
	   fullVersion=fullVersion.substring(0,ix);

	majorVersion = parseInt(''+fullVersion,10);
	if (isNaN(majorVersion)) {
	 fullVersion  = ''+parseFloat(navigator.appVersion);
	 majorVersion = parseInt(navigator.appVersion,10);
	}

	result = '\r\n\r\n\r\n\r\n'
     +'DARK MODE version  = ' + darkVersion + '\r\n'
     +'palette  = ' + window.localStorage.getItem( "palette" ) + '\r\n'
     +'new-features  = ' + window.localStorage.getItem( "new-features" ) + '\r\n'
     +'custom_palette_data  = ' + window.localStorage.getItem( "custom_palette_data" ) + '\r\n'
     +'patch-note-' + darkVersion + '-viewed  = '+ window.localStorage.getItem( "patch-note-" + darkVersion + "-viewed" ) + '\r\n'
	 +'Browser name  = ' + browserName + '\r\n'
	 +'Full version  = ' + fullVersion + '\r\n'
	 +'Major version = ' + majorVersion + '\r\n';

	return encodeURIComponent( result );

}

function addToolbar( toolBarName ) {
  	const toolBar = document.createElement( toolBarName );
  	document.getElementsByTagName( "app-search-widget" )[0].parentElement.append( toolBar );
}

function addButton( buttonName, buttonString ) {
  	const button = document.createElement( buttonName );
  	button.innerHTML = buttonString;
  	document.getElementsByTagName( "app-darkmode-toolbar" )[0].append( button );
  	return document.getElementsByTagName( buttonName )[1].getElementsByTagName( "button" )[0];
}

window.toggleStyle = function () {
	var appClasses = document.body.classList;
	if (appClasses.contains("dark-mode")) {
		appClasses.remove("dark-mode");
        window.localStorage.setItem( "dark-mode" , "false" );
	} else {
		appClasses.add("dark-mode");
        window.localStorage.setItem( "dark-mode" , "true" );
	}
    FixAppearance();
}

window.togglePalette = function ( button ) {
	var palette = button.id;
	document.body.setAttribute( "palette" , palette );
    window.localStorage.setItem( "palette" , palette );

    var allButtons = document.getElementById("palette_menu").querySelectorAll("button");

    for (var i = 0; i < allButtons.length; i++) {
    	allButtons[i].classList.remove( "activated" );
    }

    button.classList.add( "activated" );
    FixAppearance();
}

window.FixAppearance = async function () {
    
    var color = window.getComputedStyle(document.body).getPropertyValue("--tui-base-01");
    var metaOriginal = document.head.querySelector("meta[name = 'theme-color']");
    
     if (metaOriginal == null) {
         const meta = document.createElement("meta");
         meta.name = "theme-color";
         meta.content = color;
         document.head.appendChild(meta);
     } else {
         metaOriginal.content = color;
     }
    
}

function applySettings() {
    // Включена ли темная тема?
	if( window.localStorage.getItem( "dark-mode" ) == "true" ) {
	  	document.body.classList.add("dark-mode");
	} else {
	  	document.body.classList.remove("dark-mode");
	}
    // Получаем настройки выбранной палитры
	if ( window.localStorage.getItem( "palette" ) ) {
		document.body.setAttribute( "palette" , window.localStorage.getItem( "palette" ) );
	} else {
		document.body.setAttribute( "palette" , "original_palette" );
		window.localStorage.setItem( "palette" , "original_palette" );
	}
    // Получаем настройки кастомной палитры пользователя
    if ( window.localStorage.getItem( "custom_palette_data" ) ) {
        customStyleJSON = JSON.parse(window.localStorage.getItem("custom_palette_data"));
    } else {
        customStyleJSON = customStyleJSON_default;
        window.localStorage.setItem("custom_palette_data" , JSON.stringify( customStyleJSON ));
    }
    addCustomStyle( buildCustomStyle( customStyleJSON ) );
    FixAppearance();
}

applySettings();

setTimeout(() => {

if ( document.getElementsByTagName( "app-search-widget" ).length != 0 ) {

addToolbar( "app-darkmode-toolbar" );

addButton( "app-darkmode-palette-button" , `
	<app-darkmode-palette-button>
		<div class="wrapper">
			<button id="app-darkmode-palette-button" icon="tuiIconTooltip" appearance="secondary" tuidropdownalign="left" size="m" shape="rounded" tuiiconbutton="" class="button _focused"></button>
			<div class="palette-menu-wrapper">
				<div id="palette_menu">
                    <div class="patch-note-logo"></div>
                    <div class="patch-note-title">Тёмная сторона</div>
                    <div class="logo_wrapper"></div>
                    <div class="custom_palette_wrapper">
                        <button id="custom_theme" onclick="togglePalette(this);">` + customStyleJSON.palette_name + `</button>
                        <button id="custom_theme_settings" onclick="(function(){ togglePalette(document.querySelector('button#custom_theme')); togglePaletteWindow(); })();"></button>
                    </div>
                    <div class="prebuild_palette_wrapper">
                        <button id="luna" onclick="togglePalette(this);">Eternal Night</button>
                        <button id="original_palette" onclick="togglePalette(this);">Blueprint</button>
                        <button id="flat_palette" onclick="togglePalette(this);">Плоская</button>
                        <button id="pen_palette" onclick="togglePalette(this);">Тлен</button>
                        <button id="vanilla_palette" onclick="togglePalette(this);">Ванилин</button>
                        <button id="pastel_palette" onclick="togglePalette(this);">Pastel</button>
                    </div>
					<div class="feedback_wrapper">
                        <button id="feedback_button" onclick="sendEmail();">Оставить фидбэк</button>
                        <button id="patchnote_button" onclick="showPatchNote();">Patch note</button>
                    </div>
				</div>
			</div>
		</div>
	</app-darkmode-palette-button>
`)

addButton( "app-darkmode-toggle-button" , `
	<app-darkmode-toggle-button>
		<div class="wrapper">
			<button id="app-darkmode-toggle-button" onclick="toggleStyle();" icon="tuiIconTooltip" appearance="secondary" tuidropdownalign="left" size="m" shape="rounded" tuiiconbutton="" class="button _focused"></button>
		</div>
	</app-darkmode-toggle-button>
`)

setTimeout( 'document.getElementById( "palette_menu" ).style.visibility = "visible"' , 300);

document.getElementById( window.localStorage.getItem( "palette" ) ).setAttribute( "class" , "activated" );

}
}, 1000);

window.blockCounter = function () {
	const counter = document.getElementById("block_counter");
	const selectedCounter = document.getElementById("selected_blocks");
	const allChildren = document.getElementsByClassName( "jtk-surface-canvas" )[0].getElementsByClassName( "shape" ).length;
	const selectedBlocks = document.getElementsByClassName( "jtk-surface-canvas" )[0].getElementsByClassName( "jtk-surface-selected-element" ).length;
	counter.getElementsByTagName( "span" )[0].textContent = allChildren + " ❏";
	if ( allChildren > 70 ) {
		counter.className = "bad";
	} else {
		if ( allChildren > 35 ) {
		 	counter.className = "norm";
		} else {
		 	counter.className = "good";
		}
	}

	if ( selectedBlocks > 0 ) {
		selectedCounter.textContent = selectedBlocks;
		selectedCounter.className = "";
	} else {
		selectedCounter.textContent = "";
		selectedCounter.className = "hidden";
	}

	setTimeout(() => { blockCounter() }, 1000);
}

window.addBlockCounter = function () {
	const counter = document.createElement( "div" );
	var container = document.getElementsByTagName( "app-header-actions-dropdown" )[0].parentElement;
	counter.innerHTML = "<span></span><span id='selected_blocks'></span>";
	counter.id = "block_counter";
	container.insertBefore( counter, container.firstChild );
	blockCounter();
}

    // swipeback fix
    
window.disableSwipeBack = function () {
    const graphElement = document.querySelector("#graph");
    graphElement.addEventListener('wheel', function(event) {
        // Проверяем, что прокрутка происходит по горизонтали
        //if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
            // Предотвращаем действие по умолчанию
            event.preventDefault();
        //}
    }, { passive: false });
    //console.log("sewipe back disabled");
}
    
    // mac pan fix
    
window.addRedOverlayToCanvas = function () {
    // Ищем нужный элемент по классу
    const canvasElement = document.querySelector('.jtk-surface-canvas');
    
    if (!canvasElement) {
        console.warn('Элемент с указанным классом не найден.');
        return;
    }

    // Создаем новый элемент для красного фона
    const overlay = document.createElement('div');
    overlay.class = "OVERLAYER";
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'red';
    overlay.style.zIndex = '-1'; // Чтобы был фоном, а не поверх контента

    // Добавляем элемент в найденный контейнер
    canvasElement.style.position = 'relative'; // Убеждаемся, что позиционирование работает
    canvasElement.appendChild(overlay);
}

window.showPatchNote = function () {
	var patchNote = document.createElement("div");
	patchNote.id = "patch-note-window";
	patchNote.innerHTML = `
		<div class="patch-note-card">
			<div class="l-t-corner"><div class="corn-1"></div><div class="corn-2"></div><div class="corn-3"></div></div>
			<div class="r-t-corner"><div class="corn-1"></div><div class="corn-2"></div><div class="corn-3"></div></div>
			<div class="r-b-corner"><div class="corn-1"></div><div class="corn-2"></div><div class="corn-3"></div></div>
			<div class="l-b-corner"><div class="corn-1"></div><div class="corn-2"></div><div class="corn-3"></div></div>
			<div class="patch-note-card-wrapper">
				<div class="patch-note-logo"></div>
				<div class="patch-note-title">Тёмная сторона</div>
				<div class="patch-note-version">Версия ` + darkVersion + `</div>
				<div class="patch-note-content">
					<ul>
						<li>Исправлен счетчик количества блоков в процедуре
						<div class="patch-description">У некоторых пользователей счетчик блоков мог не отображаться или быть слишком мелким. Исрпавлено</div>
						</li>
						<li>Исправлены мелкие ошибки цветовой палитры</li>
					</ul>
				</div>
				<div class="patch-note-button-wrapper"><button onclick="killPatchNote();">Хорошо</button></div>
			</div>
		</div>`;
	document.body.appendChild(patchNote);
}

var featuresJSON = [
    {
		"parentId": "app-darkmode-palette-button",
		"childsId": [
			"patchnote_button"
		]
	}
];

function cleanFeature(evt) {
	console.log(featuresJSON);
	var parent = evt.currentTarget.parentToClean;
	var child = evt.currentTarget.childToClean;
	for (var i = 0; i < featuresJSON.length; i++) {
		if (featuresJSON[i].parentId == parent) {
			for (var j = 0; j < featuresJSON[i].childsId.length; j++) {
				if (featuresJSON[i].childsId[j] == child ) {
					featuresJSON[i].childsId.splice(j, 1);
					document.getElementById( child ).classList.remove("new-feature");
					document.getElementById( child ).removeEventListener("click" , cleanFeature , false);
				}
			}
			if (featuresJSON[i].childsId.length == 0) {
				document.getElementById( parent ).classList.remove("new-feature");
				delete featuresJSON[i];
			}
		}
	}
	window.localStorage.setItem("new-features" , JSON.stringify(featuresJSON));
	console.log("feature cleaned");
}

window.featureTracker = function () {
	if ( window.localStorage.getItem( "patch-note-" + darkVersion + "-viewed" ) != "true" ) {
        if ( !minorUpdate ) {
            showPatchNote();
        }
		window.localStorage.setItem("new-features" , JSON.stringify(featuresJSON));
	} else {
		featuresJSON = JSON.parse(window.localStorage.getItem("new-features"));
	}
	for (var i = 0; i < featuresJSON.length; i++) {
		if (featuresJSON[i] != null) {
			document.getElementById(featuresJSON[i].parentId).classList.add("new-feature");
			document.getElementById(featuresJSON[i].parentId).classList.add("-left");
			for (var j = 0; j < featuresJSON[i].childsId.length; j++) {
				document.getElementById(featuresJSON[i].childsId[j]).classList.add("new-feature");
				document.getElementById(featuresJSON[i].childsId[j]).classList.add("-corner");

				document.getElementById(featuresJSON[i].childsId[j]).parentToClean = featuresJSON[i].parentId;
				document.getElementById(featuresJSON[i].childsId[j]).childToClean = featuresJSON[i].childsId[j];

				document.getElementById(featuresJSON[i].childsId[j]).addEventListener("click" , cleanFeature, false);
			}
		}
	}
}

window.killPatchNote = function () {
	document.getElementById("patch-note-window").remove();
	window.localStorage.setItem( "patch-note-" + darkVersion + "-viewed" , "true" );
}

setTimeout(() => {
    disableSwipeBack();
	addBlockCounter();
	featureTracker();
}, 2000);
    
// setTimeout(() => {
//     addRedOverlayToCanvas();
// }, 5000);


// PALETTE WINDOW STUFF

let dragging = false;
let x1,y1,x2,y2;
let current;

let sum = 0;

window.addEventListener('mousemove', e => {
  if (dragging) {
    x2 = x1 - e.clientX;
    y2 = y1 - e.clientY;
    x1 = e.clientX;
    y1 = e.clientY;

      current.style.left = (current.offsetLeft - x2) + 'px';

      if ( current.offsetTop - y2 <= 0 ) {
        current.style.top = '0px';
      } else if ( current.offsetTop - y2 >= window.innerHeight - 100 ) {
        current.style.top = window.innerHeight - 100 + 'px';
      } else {
        current.style.top = (current.offsetTop - y2) + 'px';
      }

  }
})
window.addEventListener('mouseup', e => {
  dragging = false;
})

function createWindow(title,content) {
  let draggable = document.createElement('div');
  let header = document.createElement('div');
  let body = document.createElement('div');
  let controls = document.createElement('div');
  let closeButton = document.createElement('div');
  let spSumWrapper = document.createElement('div');
  let spSum = document.createElement('span');
  let saveButton = document.createElement('button');
  let cancelPaletteChangeButton = document.createElement('button');
  let clearButton = document.createElement('button');
  let buttonsWrapper = document.createElement('div');

  let notifier = document.createElement('div');

  let spDeleterSum = document.createElement('span');
  let spCountersWrapper = document.createElement('div');

  spSum.innerHTML = customStyleJSON.palette_name;

  saveButton.innerHTML = "Сохранить";
  cancelPaletteChangeButton.innerHTML = "Отменить";
  clearButton.innerHTML = "Сбросить";

  body.innerHTML = content || "";

  header.addEventListener('mousedown', e => {
    current = draggable;
    dragging = true;
    x1 = e.clientX;
    y1 = e.clientY;
  })

  header.addEventListener('mouseup', e => {
    localStorage.setItem( "windowX" , current.style.left );
    localStorage.setItem( "windowY" , current.style.top );
  } )

  // draggable.style.display = "none";

  draggable.classList.add('draggable')
  //draggable.id = "stvpd_palette_window"
  draggable.id = "calc"
  draggable.setAttribute( "mode" , "adder" )
  header.classList.add('header')
  body.classList.add('content')
  controls.classList.add( "controls" )
  closeButton.classList.add( "closeButton" )
  spSumWrapper.classList.add( "calc-sum-wrapper" )
  spSum.id = "calc_sum"

  spDeleterSum.id = "calc_deleter_sum"
  spCountersWrapper.id = "sp_counters-wrapper"

  saveButton.classList.add( "calc-action-button" );
  cancelPaletteChangeButton.classList.add( "calc-action-button" );
  clearButton.classList.add( "calc-action-button" );


  saveButton.id = "copy_button";
  clearButton.id = "clear_button";

  notifier.id = "notifier";


  buttonsWrapper.id = "calc-buttons-wrapper";

  closeButton.onclick = function() { togglePaletteWindow(); };
  saveButton.onclick = function() { savePalette(); };
  cancelPaletteChangeButton.onclick = function() { cancelPaletteChange(); };
  clearButton.onclick = function() { clearPalette(); };

  draggable.append(header)
  controls.append( closeButton )
  header.append( controls )
  header.append( spSumWrapper )
  spSumWrapper.append( spCountersWrapper )
  spCountersWrapper.append( spSum )
  spCountersWrapper.append( spDeleterSum )
  draggable.append(body)
  draggable.append( buttonsWrapper )

  buttonsWrapper.append( notifier )
  buttonsWrapper.append( saveButton )
  buttonsWrapper.append( cancelPaletteChangeButton )
  buttonsWrapper.append( clearButton )

  document.body.append(draggable)

}

window.togglePaletteWindow = function () {
    let pWindow = document.getElementById( "calc" );

    if ( pWindow.style.display == "none" ) {
      pWindow.style.display = "flex";
      pWindow.classList.remove( "hidden" );
    } else {
      pWindow.classList.add( "hidden" );

      // setTimeout(() => {
        pWindow.style.display = "none";
        pWindow.classList.remove( "minimized" );
      // }, 100);

    }
}

window.updateCustomStyleJSON = function ( input ) {
    if ( input.type = "color" ) {
        customStyleJSON.colors[input.id] = input.value;
    }
    updateCustomStyle( buildCustomStyle( customStyleJSON ) );
    FixAppearance();
}

window.showNotification = function ( text ) {
  var notifier = document.getElementById( "notifier" );
  var buttons = document.getElementById( "calc-buttons-wrapper" );
  notifier.innerHTML = text;
  buttons.classList.add( "notification" );

  setTimeout(() => buttons.classList.remove( "notification" ), 1000);

}

window.savePalette = function () {
    window.localStorage.setItem("custom_palette_data" , JSON.stringify( customStyleJSON ));
    showNotification("Палитра успешно сохранена");
}

window.cancelPaletteChange = function () {
    customStyleJSON = JSON.parse(window.localStorage.getItem("custom_palette_data"));
    updateCustomStyle( buildCustomStyle( customStyleJSON ) );
    var calc = document.getElementById( "calc" );
    var categories = calc.getElementsByClassName( "control-category" );
    var counters = document.getElementById( "calc" ).getElementsByClassName( "control-count" );
    for (var i = 0 ; i < counters.length; i++) {
        var input = counters[i].getElementsByTagName( "input" )[0];
        input.value = customStyleJSON.colors[input.id];
    }
    showNotification("Изменения в палитре отменены");
    FixAppearance();
}

window.clearPalette = function () {
    if ( confirm( "Ты действительно хочешь удалить эту палитру?" ) == false ) { return };
    window.localStorage.setItem("custom_palette_data" , JSON.stringify( customStyleJSON_default ));
    cancelPaletteChange();
    showNotification("Палитра сброшена");
}

window.collapseCategory = function ( flag ) {
  if ( flag.checked ) {
    flag.parentElement.classList.add( "collapsed" );
    localStorage.setItem( flag.name , "collapsed");
  } else {
    flag.parentElement.classList.remove( "collapsed" );
    localStorage.removeItem( flag.name );
  }
}

window.applyWindowSettings = function () {
  var calc = document.getElementById( "calc" );
  var categories = calc.getElementsByClassName( "control-category" );

  var counters = document.getElementById( "calc" ).getElementsByClassName( "control-count" );

  for (var i = 0 ; i < counters.length; i++) {
    var input = counters[i].getElementsByTagName( "input" )[0];
    input.value = customStyleJSON.colors[input.id];
  }

  for (var i = categories.length - 1; i >= 0; i--) {
    categories[i].style.maxHeight = categories[i].offsetHeight + "px";
    var flags = categories[i].getElementsByClassName( "collapse-cotrol" );
      for (var j = 0; j < flags.length; j++) {
      flags[j].oninput = function() { collapseCategory( this ); };
      if ( localStorage.getItem( flags[j].name ) == "collapsed" ) {
        flags[j].checked = true;
        collapseCategory( flags[j] );
      }
    }
  }

  if ( localStorage.getItem( "windowX" ) != null ) {
    if ( parseFloat( localStorage.getItem( "windowX" ).slice(0, -2) ) >= window.innerWidth - calc.offsetWidth ) {
      calc.style.left = window.innerWidth - calc.offsetWidth + "px";
    } else if ( parseFloat( localStorage.getItem( "windowX" ).slice(0, -2) ) <= 0 ) {
      calc.style.left = "0px";
    } else {
      calc.style.left = localStorage.getItem( "windowX" );
    }
  }

  if ( localStorage.getItem( "windowY" ) != null ) {
    if ( parseFloat( localStorage.getItem( "windowY" ).slice(0, -2) ) >= window.innerHeight - 100 ) {
      calc.style.top = window.innerHeight - 100 + "px";
    } else {
      calc.style.top = localStorage.getItem( "windowY" );
    }
  }

  if ( localStorage.getItem( "windowMinimized" ) == false ) {
    calc.classList.remove( "minimized" );
  }
}

window.createPaletteWindow = function () {
  var finalHTML = ``;

  for (var i = 0; i < categoriesJSON.length; i++) {
    var rowsCollection = ``;

    for (var j = 0; j < controlsJSON.length; j++) {
      if ( categoriesJSON[i].label != controlsJSON[j].category ) { continue; }
      var descriptionHTML = "";
      if ( controlsJSON[j].description ) { descriptionHTML = `<div class="control-description"><span>`+ controlsJSON[j].description +`</span></div>` }
      var deleterHTML = "";
      var controlHTML = `
        <div class="control-row `+ controlsJSON[j].color +`">
          <div class="control-header">
              <div class="control-title">`+ controlsJSON[j].label +`</div>
              <div class="control-count adder">
                <input data-index="`+ j +`" id="`+ controlsJSON[j].id +`" name="" type="`+ controlsJSON[j].control_type +`" price="`+ controlsJSON[j].price +`" oninput="updateCustomStyleJSON( this )">
              </div>
          </div>`
              + descriptionHTML +
        `</div>
      `;
      rowsCollection += controlHTML;
    }

    var categoryHTML = `
      <div class="control-category">
        <div class="control-category-title">`+ categoriesJSON[i].label +`</div>
        <input class="collapse-cotrol" type="checkbox" name="category_`+ i +`">
        `+ rowsCollection +`
      </div>
    `

    finalHTML += categoryHTML;
  }

  createWindow( "Palette Window" , `<div class="sp-calc">` + finalHTML + `</div>` );

}

setTimeout(() => {
    createPaletteWindow();
    applyWindowSettings();
    document.getElementById("calc").style.display = "none";
}, 2000);

})();
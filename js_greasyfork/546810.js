// ==UserScript==
// @name                Disable Back Navigation via Touchpad (overscroll-behavior: none;)
// @name:ja             タッチパッドで前ページに戻る機能無効化(overscroll-behavior: none;)
// @name:en             Disable Back Navigation via Touchpad (overscroll-behavior: none;)
// @namespace           https://github.com/hi2ma-bu4
// @version             1.0.1
// @description         Remove overscroll on the main page content and suppress previous page navigation.
// @description:ja      ページ本体のみのoverscrollを無くして、prevPageを抑制
// @description:en      Remove overscroll on the main page content and suppress previous page navigation.
// @author              hi2ma-bu4 (snows)
// @license             Apache-2.0
// @match               *://*/*
// @icon                data:image/svg+xml;base64,PCEtLT94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPy0tPjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iX3gzMV8wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJ3aWR0aDogMjU2cHg7IGhlaWdodDogMjU2cHg7IG9wYWNpdHk6IDE7IiB4bWw6c3BhY2U9InByZXNlcnZlIj48c3R5bGUgdHlwZT0idGV4dC9jc3MiPi5zdDB7ZmlsbDojMzc0MTQ5O308L3N0eWxlPjxnPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0zMzMuNjUzLDQxLjM0OUg0OC43NjljLTcuMTg3LDAtMTMuMDMxLDUuODQ4LTEzLjAzMSwxMy4wMjd2NjIuMTI5YzAsNy4xODQsNS44NDQsMTMuMDI4LDEzLjAzMSwxMy4wMjggaDI4Ni4yMjNjNDUuNDg0LDAsODQuMzI4LDM0LjE1Niw4OC40Myw3Ny43NThjMi4zMTMsMjQuNTM5LTUuNTE2LDQ4LjA1MS0yMi4wMzksNjYuMTk5IGMtMTYuMzA1LDE3LjkxOC0zOS41MDgsMjguMTkxLTYzLjY0NSwyOC4xOTFIMTk5Ljc2OVYyMzAuNzZjMC01LjM4Ni00LjM4Mi05Ljc3LTkuNzc0LTkuNzdjLTEuODU5LDAtMy42ODMsMC41MzEtNS4yNSwxLjUzOSBMNC41MjMsMzM3LjUyNUMxLjY5NSwzMzkuMzIyLDAuMDA0LDM0Mi40LDAsMzQ1Ljc1MmMtMC4wMDQsMy4zNTIsMS42ODQsNi40MzQsNC41MTIsOC4yNDJMMTg0Ljc1LDQ2OS4xMTkgYzEuNTc0LDEuMDA0LDMuMzksMS41MzIsNS4yNDYsMS41MzJjNS4zOTEsMCw5Ljc3NC00LjM4Myw5Ljc3NC05Ljc3di03MS4wMTZoMTM3Ljk2OWM0Ny43MjcsMCw5Mi4yOTQtMTguOTg4LDEyNS40ODktNTMuNDY1IGMzMy4xNzYtMzQuNDUsNTAuNDQ5LTc5LjczLDQ4LjY0NS0xMjcuNTA0QzUwOC4zNzksMTE2LjUwOSw0MjguNDMsNDEuMzQ5LDMzMy42NTMsNDEuMzQ5eiIgc3R5bGU9ImZpbGw6IHJnYig3NSwgNzUsIDc1KTsiPjwvcGF0aD48L2c+PC9zdmc+
// @supportURL          https://github.com/hi2ma-bu4/disable-touch-back
// @compatible          chrome
// @compatible          edge
// @compatible          opera
// @compatible          firefox
// @grant               GM.addStyle
// @run-at              document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/546810/%E3%82%BF%E3%83%83%E3%83%81%E3%83%91%E3%83%83%E3%83%89%E3%81%A7%E5%89%8D%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%AB%E6%88%BB%E3%82%8B%E6%A9%9F%E8%83%BD%E7%84%A1%E5%8A%B9%E5%8C%96%28overscroll-behavior%3A%20none%3B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546810/%E3%82%BF%E3%83%83%E3%83%81%E3%83%91%E3%83%83%E3%83%89%E3%81%A7%E5%89%8D%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%AB%E6%88%BB%E3%82%8B%E6%A9%9F%E8%83%BD%E7%84%A1%E5%8A%B9%E5%8C%96%28overscroll-behavior%3A%20none%3B%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function init() {
        try {
			GM.addStyle(`
html, body {
  overscroll-behavior-x: none;
}
`);
			console.log("[DBN]", "Style added successfully");
		} catch (e) {
			console.warn(e);
		}
    }

    init();
})();

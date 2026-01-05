// ==UserScript==
// @id				NewFork_g2s
// @name			新しいフォーク
// @version			0.0.2
// @namespace		NewFork_g2s
// @author			NewFork_g2s
// @description		https://greasyfork.org/ から　https://sleazyfork.org/　にリダイレクトします。
// @license			Public Domain
// @include			*://*.greasyfork.org.org*
// @run-at			document-start
// @downloadURL https://update.greasyfork.org/scripts/12704/%E6%96%B0%E3%81%97%E3%81%84%E3%83%95%E3%82%A9%E3%83%BC%E3%82%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/12704/%E6%96%B0%E3%81%97%E3%81%84%E3%83%95%E3%82%A9%E3%83%BC%E3%82%AF.meta.js
// ==/UserScript==

(function () {

window.location.href = window.location.href.replace("greasyfork","sleazyfork");

})();
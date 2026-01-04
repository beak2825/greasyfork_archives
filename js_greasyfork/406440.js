// ==UserScript==
// @name         Lunar Client Linux Adder
// @namespace    lolwhenlifegivesyoulemons
// @version      0.1
// @description  add back linux tab!!
// @author       You
// @match        https://www.lunarclient.com/download/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406440/Lunar%20Client%20Linux%20Adder.user.js
// @updateURL https://update.greasyfork.org/scripts/406440/Lunar%20Client%20Linux%20Adder.meta.js
// ==/UserScript==

document.querySelector(".row").innerHTML += (`<div class="col-12 col-md-6 col-lg-4 mb-3">
		<div class="card download-card p-3">
		  <h2 class="card-title">
			<i class="fab fa-linux" aria-hidden="true"></i>
			Linux
		  </h2>
		  <a type="button" class="btn thing1 thing2" href="https://api.lunarclient.com/site/download/linux">
			<i class="fas fa-download" aria-hidden="true"></i>
			DOWNLOAD
		  </a>
		  <p class="card-text pt-3">Distributed as an <a href="https://appimage.org">AppImage</a>.</p>
		</div>
	  </div>`)
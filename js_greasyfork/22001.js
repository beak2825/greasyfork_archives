// ==UserScript==
// @name              GF enhance new version upload
// @author            wOxxOm
// @license           MIT License
// @description       Select Syntax highlight (enhanced editor) and resize the code box by default when uploading a script
// @namespace         wOxxOm.scripts
// @version           1.0.1
// @include           https://greasyfork.org/*scripts/*/versions/new*
// @include           https://greasyfork.org/*script_versions/new*
// @run-at            document-start
// @require           https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @downloadURL https://update.greasyfork.org/scripts/22001/GF%20enhance%20new%20version%20upload.user.js
// @updateURL https://update.greasyfork.org/scripts/22001/GF%20enhance%20new%20version%20upload.meta.js
// ==/UserScript==

setMutationHandler(document, '#script_version_code', function(nodes) {
	this.disconnect();

	var area = nodes[0];
	var bounds = area.getBoundingClientRect();
	area.style.height = Math.max(200, innerHeight - bounds.top - 100) + 'px';
	area.style.marginBottom = innerHeight + 'px';

	var scriptInfo = document.getElementById('script-info') || document.querySelector('header').nextElementSibling;
	if (scriptInfo)
		scrollBy(0, scriptInfo.getBoundingClientRect().top);

	document.getElementById('enable-source-editor-code').click();
});

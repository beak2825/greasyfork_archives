// ==UserScript==
// @name        GalacticraftAIODownload
// @namespace   managarmr719@gmail.com
// @include     https://micdoodle8.com/mods/galacticraft/downloads
// @version     3.2.9
// @description Adds a button to download all mod files in a single zip file. Also replaces the changelog button with a "Changes" button for each minecraft version.
// @grant       none
// @icon        https://micdoodle8.com/images/icons/galacticraft.png
// @author      Managarmr
// @run-at      document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/35465/GalacticraftAIODownload.user.js
// @updateURL https://update.greasyfork.org/scripts/35465/GalacticraftAIODownload.meta.js
// ==/UserScript==

var changesBtn = document.createElement("a");
changesBtn.setAttribute("class", "btn btn-primary");
changesBtn.setAttribute("id", "changesBtn");
changesBtn.setAttribute("href", "https://ci.micdoodle8.com/job/Galacticraft-1.11/changes");
changesBtn.setAttribute("target", "_blank");
changesBtn.style.marginBottom = "10px";
changesBtn.innerHTML = "Changes";
mc_version.parentElement.append(changesBtn);

var btnGroup = document.getElementsByClassName("btn-group");
btnGroup[0].removeChild(btnGroup[0].children[1]);

var btn = document.getElementById("1.11.2").getElementsByClassName("btn btn-small btn-primary")[0].cloneNode(false);
btn.removeAttribute("target");
btn.innerHTML = "Download All";

function createBtns(mc_version) {
	var btnContainer = document.getElementById(mc_version);
	var versionPath;
	var buildPath;
	var text;
	var buildVersion;
	var version;
	
	if ((version = parseInt(mc_version.substring(mc_version.indexOf(".") + 1, mc_version.lastIndexOf(".")))) >= 7) {
		versionPath = "-1." + version;
		buildPath = "/Forge/build/libs";
	} else if (version == 6) {
		versionPath = "";
		buildPath = "/builds";
	} else {
		return;
	}
	
	//Latest
	text = btnContainer.children[2].innerHTML;
	buildVersion = text.substring(text.lastIndexOf("-") + 1, text.lastIndexOf("."));
	btn.setAttribute("download", "Galacticraft-" + mc_version + "-" + buildVersion + "-All.zip");
	btn.setAttribute("class", btnContainer.children[2].className);
	btn.setAttribute("href", "https://ci.micdoodle8.com/job/Galacticraft" + versionPath + "/lastSuccessfulBuild/artifact" + buildPath +"/*.jar/*zip*/Galacticraft-" + mc_version + "-" + buildVersion + "-All.zip");
 	btnContainer.insertBefore(btn.cloneNode(true), btnContainer.childNodes[2]);
	
	//Stable
	if (btnContainer.children.length > 10) {
		text = btnContainer.children[7].innerHTML;
		buildVersion = text.substring(text.lastIndexOf("-") + 1, text.lastIndexOf("."));
		btn.setAttribute("download", "Galacticraft-" + mc_version + "-" + buildVersion + "-All.zip");
		btn.setAttribute("class", btnContainer.children[7].className);
		btn.setAttribute("href", "https://ci.micdoodle8.com/job/Galacticraft" + versionPath + "/Stable/artifact" + buildPath + "/*.jar/*zip*/Galacticraft-" + mc_version + "-" + buildVersion + "-All.zip");
		btnContainer.insertBefore(btn.cloneNode(true), btnContainer.childNodes[7]);
	}
}

var dropdown = document.getElementById("mc_version");
for (var i = 0; i < dropdown.options.length; i++) {
	createBtns(dropdown.options[i].value);
}

function injectScript() {
	var appendScript = `\n\tvar changesBtn = document.getElementById('changesBtn'); \
	\n\tvar v = parseInt(mc_version.substring(mc_version.indexOf(".") + 1, mc_version.lastIndexOf("."))); \
	\n\tif (v >= 7) { \
	\t\tchangesBtn.style.display = 'inline-block'; \
	\t\tchangesBtn.setAttribute('href', 'https://ci.micdoodle8.com/job/Galacticraft-' + mc_version.substring(0, mc_version.lastIndexOf('.')) + '/changes'); \
	\t} else if (v == 6) { \
	\t\tchangesBtn.style.display = 'inline-block'; \
	\t\tchangesBtn.setAttribute('href', 'https://ci.micdoodle8.com/job/Galacticraft/changes'); \
	\t} else { \
	\t\tchangesBtn.style.display = 'none'; \
	\t}`;

	var script = document.getElementsByClassName("main")[0].getElementsByClassName("content")[0].getElementsByTagName("SCRIPT")[0];
	var originalScript = script.innerHTML;
	var referenceString = "var mc_version = document.getElementById(\"mc_version\").value;";

	var string1 = originalScript.substring(0, originalScript.indexOf(referenceString) + referenceString.length);
	var string2 = originalScript.substring(originalScript.indexOf(referenceString) + referenceString.length);
	var newScript = document.createElement("script");
	newScript.innerHTML = string1 + appendScript + string2;
}

window.addEventListener('load', injectScript, false);
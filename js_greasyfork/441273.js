// ==UserScript==
// @name         [GMT] Merge Groups by DND
// @namespace    https://greasyfork.org/users/321857-anakunda
// @version      1.00.2
// @match        https://*/artist.php?id=*
// @description  Quick merge groups from artist page by drag & drop
// @run-at       document-end
// @author       Anakunda
// @copyright    2022, Anakunda (https://greasyfork.org/users/321857-anakunda)
// @license      GPL-3.0-or-later
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_getResourceURL
// @grant        GM_openInTab
// @require      https://openuserjs.org/src/libs/Anakunda/xhrLib.min.js
// @downloadURL https://update.greasyfork.org/scripts/441273/%5BGMT%5D%20Merge%20Groups%20by%20DND.user.js
// @updateURL https://update.greasyfork.org/scripts/441273/%5BGMT%5D%20Merge%20Groups%20by%20DND.meta.js
// ==/UserScript==

'use strict';

let userAuth = document.body.querySelector('input[name="auth"]');
if (userAuth != null) userAuth = userAuth.value; else throw 'User auth could not be located';

const dragImg = new Image;
dragImg.src = 'data:image/svg+xml;base64,' + btoa(`<svg
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:xlink="http://www.w3.org/1999/xlink"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   version="1.0"
   width="250"
   height="100"
   sodipodi:version="0.32"
   inkscape:version="0.46"
   sodipodi:docname="Merge-arrow_2.svg"
   inkscape:output_extension="org.inkscape.output.svg.inkscape">
  <sodipodi:namedview
     inkscape:window-height="781"
     inkscape:window-width="1440"
     inkscape:pageshadow="2"
     inkscape:pageopacity="0.0"
     guidetolerance="10.0"
     gridtolerance="10.0"
     objecttolerance="10.0"
     borderopacity="1.0"
     bordercolor="#666666"
     pagecolor="#ffffff"
     id="base"
     showgrid="false"
     inkscape:zoom="21.72"
     inkscape:cx="27.034861"
     inkscape:cy="7.5918888"
     inkscape:window-x="0"
     inkscape:window-y="0"
     inkscape:current-layer="svg2" />
  <defs
     id="defs8">
    <linearGradient
       id="linearGradient3189">
      <stop
         id="stop3191"
         offset="0"
         style="stop-color:#a61ced;stop-opacity:1;" />
      <stop
         id="stop3193"
         offset="1"
         style="stop-color:#ffffff;stop-opacity:1;" />
    </linearGradient>
    <inkscape:perspective
       sodipodi:type="inkscape:persp3d"
       inkscape:vp_x="0 : 10 : 1"
       inkscape:vp_y="0 : 1000 : 0"
       inkscape:vp_z="50 : 10 : 1"
       inkscape:persp3d-origin="25 : 6.6666667 : 1"
       id="perspective13" />
    <linearGradient
       gradientTransform="matrix(-1,0,0,1,36.046875,18.40625)"
       y2="-0.49648574"
       x2="37.283634"
       y1="14.877447"
       x1="21.909702"
       gradientUnits="userSpaceOnUse"
       id="linearGradient3181"
       xlink:href="#linearGradient3183"
       inkscape:collect="always" />
    <linearGradient
       gradientUnits="userSpaceOnUse"
       y2="-0.49648574"
       x2="37.283634"
       y1="14.877447"
       x1="21.909702"
       id="linearGradient3177"
       xlink:href="#linearGradient3171"
       inkscape:collect="always" />
    <inkscape:perspective
       id="perspective14"
       inkscape:persp3d-origin="18 : 13.333333 : 1"
       inkscape:vp_z="36 : 20 : 1"
       inkscape:vp_y="0 : 1000 : 0"
       inkscape:vp_x="0 : 20 : 1"
       sodipodi:type="inkscape:persp3d" />
    <linearGradient
       id="linearGradient3171">
      <stop
         id="stop3173"
         offset="0"
         style="stop-color:#ed1c24;stop-opacity:1;" />
      <stop
         id="stop3175"
         offset="1"
         style="stop-color:#ffffff;stop-opacity:1;" />
    </linearGradient>
    <linearGradient
       id="linearGradient3183">
      <stop
         style="stop-color:#1c88ed;stop-opacity:1;"
         offset="0"
         id="stop3185" />
      <stop
         style="stop-color:#ffffff;stop-opacity:1;"
         offset="1"
         id="stop3187" />
    </linearGradient>
    <linearGradient
       inkscape:collect="always"
       xlink:href="#linearGradient3171"
       id="linearGradient2493"
       gradientUnits="userSpaceOnUse"
       x1="21.909702"
       y1="14.877447"
       x2="37.283634"
       y2="-0.49648574"
       gradientTransform="matrix(0.948408,0,0,0.948408,-3.348006e-2,-0.2250238)" />
    <linearGradient
       inkscape:collect="always"
       xlink:href="#linearGradient3183"
       id="linearGradient2496"
       gradientUnits="userSpaceOnUse"
       gradientTransform="matrix(-0.948408,0,0,0.948408,6.0609237,3.1257621)"
       x1="21.909702"
       y1="14.877447"
       x2="37.283634"
       y2="-0.49648574" />
    <linearGradient
       inkscape:collect="always"
       xlink:href="#linearGradient3183"
       id="linearGradient3274"
       gradientUnits="userSpaceOnUse"
       gradientTransform="matrix(0.948408,0,0,0.948408,-35.372652,3.1257621)"
       x1="21.909702"
       y1="14.877447"
       x2="37.283634"
       y2="-0.49648574" />
    <linearGradient
       inkscape:collect="always"
       xlink:href="#linearGradient3183"
       id="linearGradient3277"
       gradientUnits="userSpaceOnUse"
       gradientTransform="matrix(0.948408,0,0,0.948408,15.814076,-22.24098)"
       x1="21.909702"
       y1="14.877447"
       x2="37.283634"
       y2="-0.49648574" />
    <linearGradient
       inkscape:collect="always"
       xlink:href="#linearGradient3171"
       id="linearGradient3279"
       gradientUnits="userSpaceOnUse"
       gradientTransform="matrix(0.948408,0,0,0.948408,-3.348006e-2,-22.23239)"
       x1="21.909702"
       y1="14.877447"
       x2="37.283634"
       y2="-0.49648574" />
    <linearGradient
       inkscape:collect="always"
       xlink:href="#linearGradient3183"
       id="linearGradient3289"
       gradientUnits="userSpaceOnUse"
       gradientTransform="matrix(0.948408,0,0,0.948408,15.814076,-22.24098)"
       x1="21.909702"
       y1="14.877447"
       x2="37.283634"
       y2="-0.49648574" />
    <linearGradient
       inkscape:collect="always"
       xlink:href="#linearGradient3171"
       id="linearGradient3291"
       gradientUnits="userSpaceOnUse"
       gradientTransform="matrix(0.948408,0,0,0.948408,-3.348006e-2,-22.23239)"
       x1="21.909702"
       y1="14.877447"
       x2="37.283634"
       y2="-0.49648574" />
    <linearGradient
       inkscape:collect="always"
       xlink:href="#linearGradient3171"
       id="linearGradient3294"
       gradientUnits="userSpaceOnUse"
       gradientTransform="matrix(0.8235066,0,0,0.8235066,3.2633246,1.1215684)"
       x1="21.909702"
       y1="14.877447"
       x2="37.283634"
       y2="-0.49648574" />
    <linearGradient
       inkscape:collect="always"
       xlink:href="#linearGradient3183"
       id="linearGradient3297"
       gradientUnits="userSpaceOnUse"
       gradientTransform="matrix(0.8235066,0,0,0.8235066,17.023824,1.1141097)"
       x1="21.909702"
       y1="14.877447"
       x2="37.283634"
       y2="-0.49648574" />
    <linearGradient
       inkscape:collect="always"
       xlink:href="#linearGradient3189"
       id="linearGradient3187"
       gradientUnits="userSpaceOnUse"
       gradientTransform="matrix(0.2664003,0,0,0.2664003,22.291563,7.1254585)"
       x1="21.909702"
       y1="14.877447"
       x2="37.283634"
       y2="-0.49648574" />
  </defs>
  <metadata
     id="metadata10">
    <rdf:RDF>
      <cc:Work
         rdf:about="">
        <dc:format>image/svg+xml</dc:format>
        <dc:type
           rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <path
     id="path3299"
     d="M 35.012633,1.3305241 L 46.273453,9.9864324 L 35.012633,18.669474 L 23.751813,9.9864324 L 35.012633,1.3305241 z"
     style="fill:url(#linearGradient3297);fill-opacity:1;stroke:#0c58a0;stroke-width:0.99999988;stroke-opacity:1" />
  <path
     style="fill:url(#linearGradient3297);fill-opacity:1;stroke:#0c58a0;stroke-width:0.99999988;stroke-opacity:1"
     d="M 35.012633,1.3305241 L 46.273453,9.9864324 L 35.012633,18.669474 L 23.751813,9.9864324 L 35.012633,1.3305241 z"
     id="path3179" />
  <path
     id="redshaft"
     d="M 21.251798,1.327445 L 21.251798,6.5515651 L 3.7265475,6.5515651 L 3.7265475,13.474168 L 21.251798,13.474168 L 21.251798,18.672554 L 32.523546,9.9999997 L 21.251798,1.327445 z"
     style="fill:url(#linearGradient3294);fill-opacity:1;stroke:#a00c12;stroke-width:0.99999988;stroke-opacity:1" />
  <path
     style="fill:#0c58a0;fill-opacity:1;stroke:none;stroke-width:0.99999988;stroke-opacity:1"
     d="M 28.954793,6.607151 L 35,1.9375 L 45.46875,10 L 35,18.0625 L 24.5625,10 L 28.127739,7.2460131 L 27.322932,6.6124072 L 23.4375,9.59375 L 22.9375,10 L 23.4375,10.375 L 34.71875,19.0625 L 35,19.3125 L 35.3125,19.0625 L 46.59375,10.375 L 47.09375,10 L 46.59375,9.59375 L 35.3125,0.9375 L 35,0.6875 L 34.71875,0.9375 L 28.137877,5.9870894"
     id="path2406"
     sodipodi:nodetypes="cccccccccccccccccccc" />
  <path
     id="path3185"
     d="M 28.128119,7.2472631 L 31.707632,10.001365 L 28.133874,12.764247 L 24.560116,10.001365 L 28.128119,7.2472631 z"
     style="fill:url(#linearGradient3187);fill-opacity:1;stroke:none;stroke-width:0.99999988;stroke-opacity:1"
     sodipodi:nodetypes="ccccc" />
</svg>`);

function getGroupId(param) {
	if (param instanceof HTMLAnchorElement) try { param = new URL(param) } catch (e) { }
	else if (param instanceof DataTransfer) try { param = new URL(param.getData('text/uri-list')) } catch (e) { }
	return param instanceof URL && param.hostname == document.location.hostname && param.pathname == '/torrents.php'
	&& (param = parseInt(param.searchParams.get('id'))) > 0 ? param : null;
}

function dragStart(evt) {
	if (!evt.dataTransfer) return;
	evt.dataTransfer.setData('text/title', evt.currentTarget.parentNode.textContent.trim());
	evt.dataTransfer.setData('text/groupid', getGroupId(evt.currentTarget));
	evt.dataTransfer.effectAllowed = 'move';
	evt.dataTransfer.setDragImage(dragImg, 0, 0);
}
function dragEnter(evt) {
	const srcGroupId = parseInt(evt.dataTransfer.getData('text/groupid')) || getGroupId(evt.dataTransfer);
	if (!(srcGroupId > 0)) return false;
	const tgtGroupId = parseInt(evt.currentTarget.dataset.groupId)
	|| getGroupId(evt.currentTarget.querySelector('div.group_info > strong > a:last-of-type'));
	if (!(tgtGroupId > 0) || tgtGroupId == srcGroupId) return false;
	evt.currentTarget.style.backgroundColor = 'yellow';
}
function dragOver(evt) {
	if (getGroupId(evt.dataTransfer)) evt.dataTransfer.dropEffect = 'move';
	return false;
}
function drop(evt) {
	evt.currentTarget.style.backgroundColor = null;
	const srcGroupId = parseInt(evt.dataTransfer.getData('text/groupid')) || getGroupId(evt.dataTransfer);
	if (!(srcGroupId > 0)) return false;
	const tgtGroupId = parseInt(evt.currentTarget.dataset.groupId)
	|| getGroupId(evt.currentTarget.querySelector('div.group_info > strong > a:last-of-type'));
	if (!(tgtGroupId > 0) || tgtGroupId == srcGroupId) return false;
	let srcTitle = evt.dataTransfer.getData('text/title') || '?';
	let tgtTitle = evt.currentTarget.querySelector('div.group_info > strong');
	tgtTitle = tgtTitle != null ? tgtTitle.textContent.trim() : '?';
	if (confirm(`Group "${srcTitle}" (${srcGroupId}) will be merged to group "${tgtTitle}" (${tgtGroupId})`))
		localXHR('/torrents.php', { responseType: null }, new URLSearchParams({
			action: 'merge',
			groupid: srcGroupId,
			targetgroupid: tgtGroupId,
			confirm: true,
			auth: userAuth,
		})).then(function(statusCode) {
			GM_openInTab(`${document.location.origin}/torrents.php?id=${tgtGroupId}`, false);
			document.location.reload();
		});
	return false;
}
function dragExit(evt) {
	for (let i = evt.relatedTarget; i != null; i = i.parentNode) if (i == evt.currentTarget) return false;
	evt.currentTarget.style.backgroundColor = null;
}

for (let tr of document.body.querySelectorAll('table > tbody > tr.group')) {
	const a = tr.querySelector('div.group_info > strong > a:last-of-type');
	if (a != null) {
		if (!((tr.dataset.groupId = getGroupId(a)) > 0)) delete tr.dataset.groupId;
		a.ondragstart = dragStart;
	}
	tr.ondragenter = dragEnter;
	tr.ondragover = dragOver;
	tr.ondrop = drop;
	tr.ondragexit = dragExit;
}

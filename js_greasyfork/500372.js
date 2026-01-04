// ==UserScript==
// @name         Rapidgator link checker
// @namespace    http://tampermonkey.net/
// @version      2024-07-12
// @description  jlibrary link checker
// @author       ange
// @match        https://www.javlibrary.com/en/?v=*
// @match        https://www.javlibrary.com/en/videocomments.php?v=*
// @match        https://www.javlibrary.com/en/videocomments.php?mode=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=javlibrary.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/500372/Rapidgator%20link%20checker.user.js
// @updateURL https://update.greasyfork.org/scripts/500372/Rapidgator%20link%20checker.meta.js
// ==/UserScript==

const greenTick = `
  <svg style="width:14px;height:14px;padding-left:0.25rem;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" enable-background="new 0 0 64 64">
    <path d="M32,2C15.431,2,2,15.432,2,32c0,16.568,13.432,30,30,30c16.568,0,30-13.432,30-30C62,15.432,48.568,2,32,2z M25.025,50  l-0.02-0.02L24.988,50L11,35.6l7.029-7.164l6.977,7.184l21-21.619L53,21.199L25.025,50z" fill="#43a047" />
  </svg>
`;

const redX = `
  <svg style="width:14px;height:14px;padding-left:0.25rem;" xmlns:osb="http://www.openswatchbook.org/uri/2009/osb" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" viewBox="0 0 48 48" version="1.1" id="svg15" sodipodi:docname="cross red circle.svg" inkscape:version="0.92.3 (2405546, 2018-03-11)">
    <metadata id="metadata19">
      <rdf:RDF>
        <cc:Work rdf:about="">
          <dc:format>image/svg+xml</dc:format>
          <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
          <dc:title />
        </cc:Work>
      </rdf:RDF>
    </metadata>
    <sodipodi:namedview pagecolor="#ffffff" bordercolor="#666666" borderopacity="1" objecttolerance="10" gridtolerance="10" guidetolerance="10" inkscape:pageopacity="0" inkscape:pageshadow="2" inkscape:window-width="1920" inkscape:window-height="1027" id="namedview17" showgrid="false" inkscape:zoom="4.9166667" inkscape:cx="-11.694915" inkscape:cy="40.271186" inkscape:window-x="-8" inkscape:window-y="-8" inkscape:window-maximized="1" inkscape:current-layer="g13" />
    <defs id="defs7">
      <linearGradient id="linearGradient828" osb:paint="solid">
        <stop style="stop-color:#ff0000;stop-opacity:1;" offset="0" id="stop826" />
      </linearGradient>
      <linearGradient id="0" gradientUnits="userSpaceOnUse" y1="47.37" x2="0" y2="-1.429">
        <stop stop-color="#c52828" id="stop2" />
        <stop offset="1" stop-color="#ff5454" id="stop4" />
      </linearGradient>
    </defs>
    <g transform="matrix(.99999 0 0 .99999-58.37.882)" enable-background="new" id="g13" style="fill-opacity:1">
      <circle cx="82.37" cy="23.12" r="24" fill="url(#0)" id="circle9" style="fill-opacity:1;fill:#dd3333" />
      <path d="m87.77 23.725l5.939-5.939c.377-.372.566-.835.566-1.373 0-.54-.189-.997-.566-1.374l-2.747-2.747c-.377-.372-.835-.564-1.373-.564-.539 0-.997.186-1.374.564l-5.939 5.939-5.939-5.939c-.377-.372-.835-.564-1.374-.564-.539 0-.997.186-1.374.564l-2.748 2.747c-.377.378-.566.835-.566 1.374 0 .54.188.997.566 1.373l5.939 5.939-5.939 5.94c-.377.372-.566.835-.566 1.373 0 .54.188.997.566 1.373l2.748 2.747c.377.378.835.564 1.374.564.539 0 .997-.186 1.374-.564l5.939-5.939 5.94 5.939c.377.378.835.564 1.374.564.539 0 .997-.186 1.373-.564l2.747-2.747c.377-.372.566-.835.566-1.373 0-.54-.188-.997-.566-1.373l-5.939-5.94" fill="#fff" fill-opacity=".842" id="path11" style="fill-opacity:1;fill:#ffffff" />
    </g>
  </svg>
`;

const fetchResponse = (url, options = {}) => {
  const requestOptions = {
    headers: {
      "Cache-Control": "no-cache",
    },
    ...options,
    url,
    method: options.method || 'GET',
    responseType: options.responseType || 'document',
  };

  if (options.data) requestOptions.data = options.data;

  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      ...requestOptions,
      onload: res => resolve(res),
      onerror: err => reject(err),
    });
  });
};

const initRedirectRemoval = () => document.querySelectorAll('a[href^="redirect.php"]').forEach(link => {

  link.href = decodeURIComponent(link.href.split('=')[1]);
});

const checkLinks = () => {
  document.querySelectorAll('a[href*="rapidgator"]').forEach(async link => {
    const response = await fetchResponse(link, { method:'HEAD' });
    const isOk = response.status < 400 && response.finalUrl !== 'https://rapidgator.net/article/premium';
    link.innerHTML += isOk ? greenTick: redX;
    if (!isOk) link.style = "text-decoration: line-through;display: inline-flex"
  });
};

initRedirectRemoval();
checkLinks();

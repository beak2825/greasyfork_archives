// ==UserScript==
// @name         Material design icons (beta)
// @namespace    mailto:explosionscratch@gmail.com
// @version      0.1
// @description  Adds file Icons to GitHub
// @author       Explosion-Scratch
// @match        *://github.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_getResourceText
// @resource     language_map https://gist.githubusercontent.com/Explosion-Scratch/ee1b9316ddb9389959697a00304bc57b/raw/4038781f76d14557d36e3ff2996a847437dc574e/map.json
// @require      https://unpkg.com/selector-set@1.1.5/selector-set.js
// @require      https://unpkg.com/selector-observer@2.1.6/dist/index.umd.js
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/439076/Material%20design%20icons%20%28beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/439076/Material%20design%20icons%20%28beta%29.meta.js
// ==/UserScript==

(async () => {
    //Requires SelectorSet
    SelectorObserver.observe('.js-navigation-container > .js-navigation-item', {
        add: icons
    });

    function icons(item) {
        let map = JSON.parse(GM_getResourceText("language_map"));
        console.log(map);
        //Item is '.js-navigation-container > .js-navigation-item' that changed
        const isFile = item.querySelector('.octicon-file');
        const name = item.querySelector('.js-navigation-open').textContent;
        const ext = name.split(".").slice(-1)[0];
        let icon = map.icons.find(i => i.fileNames?.includes(name)) || map.moreExtensions.fileNames[name] ||
              map.icons.find(i => i.fileExtensions?.includes(ext)) ||
              map.icons.find(i => i.name === ext) || map.moreExtensions.fileExtensions[ext] || map.defaultIcon;
        if (typeof icon === "string"){
             icon = map.icons.find(i => i.name === icon);
        }
        if (!isFile){
           icon = map.folders.icons.find(i => i.folderNames?.includes(name)) || map.folders.defaultIcon;
        }
        if (!icon?.name){return console.log("No icon", {ext, icon, isFile})}
        fetch(`https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/main/icons/${icon.name}.svg`)
            .then(res => res.text())
            .then((svg) => (svg.startsWith("<svg") && item.querySelector("svg").replaceWith(createElement(svg))))
    }
    function createElement(htmlString) {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();

        // Change this to div.childNodes to support multiple top-level nodes.
        return div.firstChild;
    }
    function loadFonts(fonts){
      let promises = [];
      for (let [fontName, url] of Object.entries(fonts)){
        promises.push(fetch(url)
            .then(resp => resp.arrayBuffer())
            .then(font => {
            const fontFace = new FontFace(fontName, font);
            document.fonts.add(fontFace);
        }))
      }
      return Promise.all(promises);
    }
})();

//Memoize fetch
((window) => {
  var _fetch = window.fetch; //Get the original fetch functionm

  window.fetch = (url, opts = {}) => {
    if (!window.FETCH_CACHE) {
      window.FETCH_CACHE = {};
    }
    return new Promise((resolve) => {
      /* 
      Generate a sort of unique key about this fetch request. 
      GET requests will have `opts.method` and `opts.body` as 
      undefined, which will be removed by JSON.stringify.

      For a fetch call such as this:

      fetch("https://apis.explosionscratc.repl.co/google?q=dogs")

      the key would be:
      "{url: 'https://apis.explosionscratc.repl.co'}"
      For a POST/DELETE/PUT request however, the key would also have the opts.method and opts.body (and possibly headers).
      */

      var key = JSON.stringify({
        url,
        method: opts.method,
        body: opts.body,
        headers: JSON.stringify(opts.headers),
      });

      //First check for existing cache entries:
      if (window.FETCH_CACHE[key]) {
        //Important to re-clone the response, otherwise we can't fetch something more than once!
        resolve(window.FETCH_CACHE[key].clone());
        console.log("Fetched from cache");
        return; //Important so we don't fetch anyways!
      }

      _fetch(url, opts).then((res) => {
        window.FETCH_CACHE[key] = res.clone(); //Store the response in the cache
        resolve(res); //Respond with the response of the fetch.
        console.log("Fetched new version");
      });
    });
  };
})(globalThis);
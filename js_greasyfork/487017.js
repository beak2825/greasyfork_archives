// ==UserScript==
// @name         FL-DeepSearch
// @description  FL deep search
// @namespace    fl.deep
// @author       CRK
// @match        https://filelist.io/details.php?*
// @grant        none
// @version      1.3
// @source       http://www.imdb.com/title/tt2854926
// @source       https://stackoverflow.com/questions/10572735/javascript-getelement-by-href
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487017/FL-DeepSearch.user.js
// @updateURL https://update.greasyfork.org/scripts/487017/FL-DeepSearch.meta.js
// ==/UserScript==
(function() {
    function hookTheFLDeepMonkey() {
        var text = document.createElement('snap');
        text.setAttribute("align", "center");
        text.setAttribute("style" ,"background-color: green; cursor:pointer;");
        text.innerHTML = `
            <center>
                <input style='background-color:red; color:white; margin-top:3px;font-weight:bold;' type='button' name='deepSearch' id='deepSearch' onclick='deepSearch();' value='DeepSearch' title='!!! Deep Search - click me to see all torrents for this movie !!!'>
            </center>
        `;

        var script = document.createElement('script');
        script.innerText = `
            function deepSearch() {
                var els = document.querySelectorAll("a[href^='https://www.imdb.com/title/tt']");
                if (els && els[0]) {
                    var url = els[0].href;
                    var imdb = url.split('/')[4];
                    window.open('https://filelist.io/browse.php?search=' + imdb + '&cat=0&searchin=3&sort=2', '_blank');
                } else {
                    alert('...not a movie...sorry :( ...but I Love You ! XOXO');
                }
            }
        `;

        document.body.appendChild(script);
        document.getElementsByClassName("cblock-header")[0].appendChild(text);
    };
    hookTheFLDeepMonkey();
})();
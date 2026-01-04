// ==UserScript==
// @name         Grid Images
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Apply dynamic symmetry grids to all images on a webpage
// @author       You
// @match        *://*/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/402560/Grid%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/402560/Grid%20Images.meta.js
// ==/UserScript==

(function() {

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    };
    addGlobalStyle('#activate { width:20px; height:60px; background-color:maroon; position:fixed; bottom:0; left:0; z-index:999; opacity:0; } #activate:hover { opacity:100; } .HukaParent { position: relative; }');

    function main() {
        var img = "https://dl.dropbox.com/s/pgcua3pgzkiie9d/Grid.png";
        var applied = false;
        var divsCreated = false;

        $("body").append("<div id='activate'></div>");
        $("#activate").click(function () {
            if (!applied)
            {
                $("img:visible").each(function () {
                    if (!divsCreated)
                        $(this).parent().addClass("HukaParent");
                        //$(this).wrap("<div style='position:relative;'><\div>");
                    var pos = $(this).position();
                    $(this).parent().append("<img class='HukaDynGrid' src='" + img + "' style='margin:"+$(this).css('margin')+";position:absolute;left:" + pos.left + "px;top:" + pos.top + "px;width:" + $(this).outerWidth() + "px;height:" + $(this).outerHeight() + "px;'></img>")
                });
                divsCreated = true;
            } else
            {
               $( ".HukaDynGrid" ).remove();
            }
            applied = !applied;
        });
    }
    main();

})();
// ==UserScript==
// @name         Wide_Pixiv
// @namespace    https://gist.github.com/E-Badapple
// @version      1.0
// @description  Make your pixiv more wide
// @author       E-BadApple
// @match        www.pixiv.net/search.php*
// @match        www.pixiv.net/ranking.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29443/Wide_Pixiv.user.js
// @updateURL https://update.greasyfork.org/scripts/29443/Wide_Pixiv.meta.js
// ==/UserScript==


function wide_pixiv(){
    var wrappper = document.getElementById("wrapper");
    var layout_body = document.getElementsByClassName("layout-body")[0];
    wrapper.setAttribute("style","width:100%");
    layout_body.setAttribute("style","width:100%");
}

wide_pixiv();

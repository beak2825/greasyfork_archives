// ==UserScript==
// @name         Gifv fit to screen
// @version      1.1
// @description  Increases/decreases size of gifv to maximize
// @author       someRandomGuy
// @match        *://*/*.gifv?*
// @match        *://*/*.gifv
// @grant        none
// @namespace https://greasyfork.org/users/117222
// @downloadURL https://update.greasyfork.org/scripts/394680/Gifv%20fit%20to%20screen.user.js
// @updateURL https://update.greasyfork.org/scripts/394680/Gifv%20fit%20to%20screen.meta.js
// ==/UserScript==

(function() {
    function resize(){
        const b = document.body,
              vid = document.getElementsByTagName("video")[0],
              img = document.getElementsByTagName("img")[0];

        let basp = innerWidth/innerHeight,
            vidasp, width, height;

        if (vid.clientWidth || vid.clientHeight) {
            vidasp = vid.clientWidth / vid.clientHeight;
            width = vid.clientWidth;
            height = vid.clientHeight;
        } else {
            vidasp = img.clientWidth / img.clientHeight;
            width = img.clientWidth;
            height = img.clientHeight;
        }

        if(basp > vidasp){
            b.style.zoom = innerHeight / height;
            document.getElementById("content").style.display = "inline-block";

            document.getElementById("content").style.position = "static";
            document.getElementById("content").style.top = "0";
            document.getElementById("content").style.transform = "none";
        } else {
            b.style.zoom = innerWidth / width;
            document.getElementById("content").style.position = "absolute";
            document.getElementById("content").style.top = "50%";
            document.getElementById("content").style.transform = "translate(0,-50%)";
        }
    }

    window.addEventListener("load", function(){
        resize();
        document.body.style.overflow = "hidden";
        document.body.style.transition = "0.26s";
        document.body.style.textAlign = "center";
    });

    window.addEventListener("resize", resize);

    window.addEventListener("wheel", function(e){
        if(e.deltaY > 0){
            document.body.style.transform = "translate(0,-24px)";
        } else {
            document.body.style.transform = "translate(0,0)";
        }
    });
    document.body.style.backgroundColor = "#0e0e0e";
}());
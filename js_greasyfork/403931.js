// ==UserScript==
// @name         Preview boss area
// @version      1.3
// @description  Preview the area of a boss in the bossmap
// @author       A Meaty Alt
// @include      /dfprofiler.com\/bossmap.php/
// @grant        none
// @namespace https://greasyfork.org/users/150647
// @downloadURL https://update.greasyfork.org/scripts/403931/Preview%20boss%20area.user.js
// @updateURL https://update.greasyfork.org/scripts/403931/Preview%20boss%20area.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const modal = document.createElement("div");
    modal.style.display = "none";
    modal.style.position = "fixed";
    modal.style.zIndex = "1";
    modal.style.paddingTop = "100px";
    modal.style.left = "0";
    modal.style.top = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.overflow = "auto";
    modal.style.backgroundColor = "rgb(0,0,0)";
    modal.style.backgroundColor = "rgba(0,0,0,0.4)";

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    document.body.appendChild(modal);

    setInterval(() => {
        const blocks = document.querySelectorAll(".block");
        for (const block of blocks) {
            if (block.textContent && block.textContent.match(/\d+/) !== null) {
                if (block.children.length && block.children[0].tagName === "DIV") continue;
                const [x, y] = block.classList[1].split("_").map((c) => c.substring(1));
                const btn = document.createElement("div");
                btn.style.cursor = "pointer";
                btn.addEventListener("click", () => handleClick(x, y));
                btn.innerHTML = block.innerHTML;
                block.innerHTML = "";
                block.appendChild(btn);

            }
        }
    }, 1000);

    function handleClick(x, y) {
        console.log(1);
        modal.innerHTML = `<img src="https://deadfrontier.info/w/map/images/Fairview_${x}x${y}.png" />`;
        modal.style.display = "block";
    }
})();
(function() {
    'use strict';
    const modal = document.createElement("div");
    modal.style.display = "none";
    modal.style.position = "fixed";
    modal.style.zIndex = "1";
    modal.style.paddingTop = "100px";
    modal.style.left = "0";
    modal.style.top = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.overflow = "auto";
    modal.style.backgroundColor = "rgb(0,0,0)";
    modal.style.backgroundColor = "rgba(0,0,0,0.4)";

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    document.body.appendChild(modal);

    setInterval(() => {
        const blocks = document.querySelectorAll(".block");
        for (const block of blocks) {
            if (block.textContent && block.textContent.match(/\d+/) !== null) {
                if (block.children.length && block.children[0].tagName === "div") break;
                const [x, y] = block.classList[1].split("_").map((c) => c.substring(1));
                const btn = document.createElement("div");
                btn.style.cursor = "pointer";
                btn.addEventListener("click", () => handleClick(x, y));
                btn.innerHTML = block.innerHTML;
                block.innerHTML = "";
                block.appendChild(btn);

            }
        }
    }, 1000);

    function handleClick(x, y) {
        console.log(1);
        modal.innerHTML = `<img src="https://deadfrontier.info/w/map/images/Fairview_${x}x${y}.png" />`;
        modal.style.display = "block";
    }
})();
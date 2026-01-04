// ==UserScript==
// @name         Reading Ruler
// @namespace    https://old.reddit.com/r/SomebodyMakeThis/comments/9huwbw/smt_a_firefox_addon_that_adds_a_horizontal/
// @version      1.0.3
// @description  A userscript that adds a horizontal translucent bar that follows the cursor. A reading aid for pages with wiiiiiiide paragraphs. Ctrl+Shift+R to toggle by default.
// @author       /u/defproc
// @match        */*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372448/Reading%20Ruler.user.js
// @updateURL https://update.greasyfork.org/scripts/372448/Reading%20Ruler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // quick options
    const conf = {
        colour: "#55cc551c",
        lineColour: "#33aa3334", // colour of the bottom edge of the bar
        scale: 1.05, // how many times the text's line-height should the bar's height be
        shadow: 0.08, // opacity of the bar's shadow (0 to 1)
        key: "r", // toggle key
        keyCtrl: true, // toggle key requires ctrl?
        keyAlt: true, // toggle key requires alt?
        keyShift: false, // toggle key requires shift?
    };







    const bar = document.createElement("div");
    let visible = false;
    const styles = {
        left: 0,
        right: 0,
        height: "1em",
        backgroundColor: conf.colour,
        borderBottom: conf.lineColour ? `1px ${conf.lineColour} solid` : void 0,
        position: "fixed",
        transform: "translateY(-50%)",
        display: "none",
        pointerEvents: "none",
        transition: "120ms height",
        boxShadow: `0 1px 4px rgba(0, 0, 0, ${conf.shadow})`,
        zIndex: 9999999
    };
    Object.keys(styles).forEach(function(k){ bar.style[k] = styles[k] });
    document.body.addEventListener("mousemove", function(ev){
        bar.style.top = ev.clientY + "px";
        if(visible){
            const over = document.elementFromPoint(ev.clientX, ev.clientY);
            const size = window.getComputedStyle(over).getPropertyValue("line-height");
            const [m, num, unit] = (size && size.match(/([\d\.]+)([^\d]+)/)) || [];
            bar.style.height = m ? num * conf.scale + unit : "1em";
        }
    });
    const toggle = function(){
        visible = !visible;
        if(!bar.parentElement){
            document.body.appendChild(bar);
        }
        bar.style.display = visible ? "block" : "none";
    };
    window.addEventListener("keypress", function(ev){
        if(
            !(ev.ctrlKey ^ conf.keyCtrl) &&
            !(ev.altKey ^ conf.keyAlt) &&
            !(ev.shiftKey ^ conf.keyShift) &&
            ev.key.toLowerCase() == conf.key.toLowerCase()
        ){
            toggle();
            ev.preventDefault();
        }
    });

})();
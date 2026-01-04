// ==UserScript==
// @name         TOC of github readme for d3.js
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  generate a TOC of github readme for d3.js
// @author       theme
// @match        https://github.com/d3/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375691/TOC%20of%20github%20readme%20for%20d3js.user.js
// @updateURL https://update.greasyfork.org/scripts/375691/TOC%20of%20github%20readme%20for%20d3js.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function pre_iterate_node(tree_node, callback_f){
        callback_f(tree_node);
        var children = tree_node.children;
        if ( children.length > 0 ) {
            var i;
            for (i = 0; i< children.length; i++){
                pre_iterate_node(children[i], callback_f);
            }
        }
    }
    function create_toc_item(text){
        var div = document.createElement("div");
        div.innerText = text;
        return div;
    }
    function toc_item_from_el(c){ // check a element, populate a TOC item
        var toc_item = null;
        if (c.tagName == "H1") {
            toc_item = create_toc_item(c.innerText); // create a toc item of this title
            toc_item.style.backgroundColor = "rgba(204,255,204,0.5)";
            toc_item.style.foneSize = "2em";
            return toc_item;
        } else if ( c.tagName == "H2" ) {
            toc_item = create_toc_item(c.innerText);
            toc_item.style.backgroundColor = "rgba(221,255,221,0.5)";
            toc_item.style.foneSize = "1.5em";
            toc_item.style.textIndent = "1em";
            return toc_item;
        } else if ( c.tagName == "H3" ) {
            toc_item = create_toc_item(c.innerText);
            toc_item.style.backgroundColor = "rgba(233,255,233,0.5)";
            toc_item.style.foneSize = "1.17em";
            toc_item.style.textIndent = "2em";
            return toc_item;
        } else if (c.tagName == "P" ){
            return null;
        } else if (c.tagName == "A" && (c.getAttribute("href").startsWith("#"))) {
            if (c.previousSibling == null){
                toc_item = create_toc_item("");
                toc_item.innerHTML = '<a href="' + c.getAttribute("href") + '">' + c.parentNode.innerText + '</a>';
                toc_item.style.backgroundColor = "rgba(255,255,255,0.5)";
                toc_item.style.foneSize = "1em";
                toc_item.style.textIndent = "3em";
                return toc_item;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
    // logic
    var div_readme = document.getElementById("readme");
    if (null !== div_readme) {
        // render TOC inside it
        var toc = document.createElement("div");
        toc.setAttribute("id", "toc");
        var css = toc.style;
        css.border = "1px solid";
        css.position = "fixed";
        css.display = "block";
        css.top = "5%";
        css.left = "1%";
        css.padding = "1em";
        css.maxWidth = "20%";
        css.maxHeight = "90%";
        css.overflow = "scroll";
        //css.display = "none";
        document.body.append(toc);
        pre_iterate_node(div_readme, function(c){ // for every div under `div_readme`
            var toc_item = toc_item_from_el(c);
            if (null !== toc_item) {
                // append toc item to toc div
                toc.appendChild(toc_item);
            }
        });
    }
})();
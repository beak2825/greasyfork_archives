// ==UserScript==
// @name MyHeritage: clean view
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description Cleans up icons and buttons for a better display.
// @author ciricuervo
// @grant GM_addStyle
// @run-at document-start
// @match *://*.myheritage.com/*
// @match *://*.myheritage.es/*
// @downloadURL https://update.greasyfork.org/scripts/540789/MyHeritage%3A%20clean%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/540789/MyHeritage%3A%20clean%20view.meta.js
// ==/UserScript==

(function() {
let css = `
    
    g.profileImageGroup > g:nth-child(2),
    g.NewTree_RightIcon,
    g.NewTree_EditIcon,
    g.NewTree_GhostIcon,
    g.add_individual_button,
    g > circle[filter="url(#greetingFilterDef)"],
    g > circle[filter="url(#greetingFilterDef)"] + image,
    g.newPersonBadge,
    div#NewTree_zoomerBox,
    div#NewTree_panBox,
    a.ToolBarButton.ToolBar_colorCoding.tree_color_coding_button,
    a.ToolBarButton.ToolBar_exitFullScreen,
    #NewToolBarSummary,
    #NewTreeToolBar .ToolBar_options,
    #NewTreeToolBar .ToolBar_help,
    #NewTreeLeftPanel .lp_opener {
        display: none;
    }

    #NewTreeToolBar {
        background: none;
        box-shadow: none;
    }

    #NewTreeOuter {
        margin-top: 0px !important;
    }

`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

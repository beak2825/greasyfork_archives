// ==UserScript==
// @name Colors!graph_editor
// @description Add colors support to https://csacademy.com/app/graph_editor/. The edge's color is defined by it's cost. The color is defined by a index or name.
// @namespace Violentmonkey Scripts
// @match https://csacademy.com/app/graph_editor/
// @grant VictorKoehler
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @version 0.0.1.20200518181455
// @downloadURL https://update.greasyfork.org/scripts/403687/Colors%21graph_editor.user.js
// @updateURL https://update.greasyfork.org/scripts/403687/Colors%21graph_editor.meta.js
// ==/UserScript==

// Modified version of:
// https://gist.github.com/VictorKoehler/5d528b3c3965e56aea69231801ddd70a
// This one cleans the jQuery injection present on gist, making use of @require instead.

/*
.default-36 > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) {
  width: 95% !important;
}

.default-36 > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2), .default-36 > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) {
  width: 800px !important;
}

.default-36 > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > svg:nth-child(1) {
    width: 100% !important;
}
*/

// Immediately-invoked function expression
(function() {
  const getColorByString = (strColor) => {
    
    const isColor = (strColor) => {
      const s = new Option().style;
      s.color = strColor;
      return s.color !== '';
    };
    const colorlist = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000'];
    
    r = isColor(strColor) ? strColor : colorlist[parseInt(strColor)];
    return r === undefined ? 'black' : r;
  };

  const getRoot = () => jQuery('.default-36 > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > svg');
  const getEdges = () => getRoot().find('g g g path').parent();
  
  const updateEdges = () => {
    getEdges().each((_, t) => {
        const txt = jQuery(t).text();
        jQuery(t).children().each((_, t1) => {
            jQuery(t1).attr('stroke', getColorByString(txt));
        });
    });
  };
  
  const scriptInitialize = () => {
        setTimeout(() => {
          getRoot().click(() => updateEdges());
          getRoot().next().keypress(() => {
            if (event.keyCode === 13)
              setTimeout(() => updateEdges(), 100);
          });
        }, 5000);
  };
  
  if (typeof jQuery !== 'undefined') {
    console.log("Using jQuery");
    scriptInitialize();
  } else {
    console.log("jQuery not present!");
  }
})();

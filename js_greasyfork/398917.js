// ==UserScript==
// @name        DesmosToSVG
// @namespace   https://github.com/baz1/DesmosToSVG
// @description Desmos SVG generator
// @include     https://www.desmos.com/calculator*
// @version     3
// @run-at      document-start
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/398917/DesmosToSVG.user.js
// @updateURL https://update.greasyfork.org/scripts/398917/DesmosToSVG.meta.js
// ==/UserScript==

/* DesmosToSVG GreaseMonkey script by Remi Bazin */

function PageScript() {
  window.DesmosToSVG = new Object();

  DesmosToSVG.ctxHandler = {
    get: function(target, name) {
      if (typeof(DesmosToSVG.ctx[name]) == "function") {
        if (name == "clearRect") {
          // Note: We assume it is the whole area
          DesmosToSVG.ctx = new C2S(parseInt(DesmosToSVG.graph.width),
                                    parseInt(DesmosToSVG.graph.height));
          DesmosToSVG.button.disabled = false;
          return function() {
            DesmosToSVG.ctx2[name].apply(DesmosToSVG.ctx2, arguments);
          };
        }
        return function() {
          DesmosToSVG.ctx[name].apply(DesmosToSVG.ctx, arguments);
          DesmosToSVG.ctx2[name].apply(DesmosToSVG.ctx2, arguments);
        };
      } else {
        return DesmosToSVG.ctx2[name];
      }
    },
    set: function(target, name, value) {
      DesmosToSVG.ctx[name] = value;
      DesmosToSVG.ctx2[name] = value;
      return true;
    }
  };

  DesmosToSVG.getSVG = function() {
    window.open("data:image/svg;base64," +
                btoa(DesmosToSVG.ctx.getSerializedSvg(true)));
  };

  var myGetContext = function(contextType, contextAttributes) {
    console.log("GM_DesmosSVG: myGetContext called.");
    DesmosToSVG.ctx = new C2S(parseInt(DesmosToSVG.graph.width),
                              parseInt(DesmosToSVG.graph.height));
    DesmosToSVG.ctx2 = DesmosToSVG.graph.myoldGetContext(
        contextType, contextAttributes);
    return new Proxy({}, DesmosToSVG.ctxHandler);
  };

  var main = function() {
    DesmosToSVG.graph = document.getElementsByClassName("dcg-graph-inner");
    if (DesmosToSVG.graph.length != 1) {
      console.log("GM_DesmosSVG: Graph not found, or several found.");
      return;
    }
    DesmosToSVG.graph = DesmosToSVG.graph[0];
    var floaters = document.getElementsByClassName("align-right-container");
    if (floaters.length != 1) {
      console.log("GM_DesmosSVG: Floaters object not found, or several found.");
      return;
    }
    floaters = floaters[0];
    var spanObj = document.createElement("SPAN");
    DesmosToSVG.button = document.createElement("INPUT");
    DesmosToSVG.button.type = "button";
    DesmosToSVG.button.disabled = true;
    DesmosToSVG.button.addEventListener("click", DesmosToSVG.getSVG, false);
    DesmosToSVG.button.value = "Get SVG";
    spanObj.appendChild(DesmosToSVG.button);
    floaters.appendChild(spanObj);
    console.log("GM_DesmosSVG: (Info) Button added.");
    DesmosToSVG.graph.myoldGetContext = DesmosToSVG.graph.getContext;
    DesmosToSVG.graph.getContext = myGetContext;
    DesmosToSVG.ctx = new C2S(parseInt(DesmosToSVG.graph.width),
                              parseInt(DesmosToSVG.graph.height));
    var cL = window.tourController.Calc.grapher.canvasLayer;
    DesmosToSVG.ctx2 = cL.ctx;
    cL.ctx = new Proxy({}, DesmosToSVG.ctxHandler);
  }

  setTimeout(main, 3000);
}

function AddJSNode(fn, url) {
  var scriptNode = document.createElement("script");
  scriptNode.type = "text/javascript";
  if (fn) scriptNode.textContent = "(" + fn.toString() + ")();";
  if (url) scriptNode.src = url;
  var target = document.getElementsByTagName ('head')[0] ||
      document.body || document.documentElement;
  target.appendChild(scriptNode);
}

window.addEventListener("DOMContentLoaded", function() {
  AddJSNode(null, "https://cdn.rawgit.com/gliffy/canvas2svg/master/canvas2svg.js");
  AddJSNode(PageScript, null);
}, false);
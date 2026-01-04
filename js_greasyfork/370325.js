// ==UserScript==
// @name       MathJax compiler and decompiler
// @namespace
// @author     Marcelo Silvarolla
// @version    0.2
// @description Ctrl-m compiles LaTeX code with inline math delimiters $ ... $ and [; ... ;], and display math delimiters $$ ... $$ and [(; ... ;)]. Ctrl-, decompiles.
// @match      *://*/*
// @copyright
// @namespace https://greasyfork.org/users/196485
// @downloadURL https://update.greasyfork.org/scripts/370325/MathJax%20compiler%20and%20decompiler.user.js
// @updateURL https://update.greasyfork.org/scripts/370325/MathJax%20compiler%20and%20decompiler.meta.js
// ==/UserScript==

function removeTypeset() {
  var HTML = MathJax.HTML,
    jax = MathJax.Hub.getAllJax();
  for (var i = 0, m = jax.length; i < m; i++) {
    var script = jax[i].SourceElement(),
      tex = jax[i].originalText;
    if (script.type.match(/display/)) {
      tex = "$$" + tex + "$$";
    } else {
      tex = "$" + tex + "$";
    }
    jax[i].Remove();
    var preview = script.previousSibling;
    if (preview && preview.className === "MathJax_Preview") {
      preview.parentNode.removeChild(preview);
    }
    preview = HTML.Element("span", { className: "MathJax_Preview" }, [tex]);
    script.parentNode.insertBefore(preview, script);
  }
}

function showTypeset(e) {
  // ctrl-m
  if (e.ctrlKey && e.keyCode == 77) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS_HTML";
    var config =
      "MathJax.Hub.Config({ " +
      'extensions: ["tex2jax.js"], ' +
      'tex2jax: { skipTags: ["script","noscript","style","textarea"],inlineMath: [ ["$", "$"], ["[;", ";]"] ], displayMath: [ ["$$", "$$"], ["[(;",";)]"]], processEscapes: true }, ' +
      'jax: ["input/TeX", "output/HTML-CSS"] ' +
      " }); " +
      "MathJax.Hub.Startup.onload(); ";
    if (window.opera) {
      script.innerHTML = config;
    } else {
      script.text = config;
    }
    document.getElementsByTagName("head")[0].appendChild(script);
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    $(".MathJax")
      .parent()
      .css("border", "none")
      .css("background", "none");
  }
  // ctrl-,
  if (e.ctrlKey && e.keyCode == 188) {
    removeTypeset();
  }
}

window.addEventListener("keyup", showTypeset);


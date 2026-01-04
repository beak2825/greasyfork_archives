// ==UserScript==
// @name         Better CalcPlot3D rotation
// @namespace    https://c3d.libretexts.org/CalcPlot3D/index.html
// @version      0.2
// @description  Implement better (not about a point, but about the z-axis) rotation for CalcPlot3D. Also toggles edges off by default for better performance (can be enabled again by pressing E or via the UI).
// @author       Henry Ruben Fischer
// @match        https://c3d.libretexts.org/CalcPlot3D/index.html
// @icon         https://c3d.libretexts.org/CalcPlot3D/CalcPlot3D.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/434950/Better%20CalcPlot3D%20rotation.user.js
// @updateURL https://update.greasyfork.org/scripts/434950/Better%20CalcPlot3D%20rotation.meta.js
// ==/UserScript==

$(document).ready(function() { // When document has loaded
    location.assign("javascript:Calc3D.oi.prototype.oldN = Calc3D.oi.prototype.N,"+
        "Calc3D.oi.prototype.N=function(a,b,c){this.L(b/200),this.oldN(1,0,a/200)},"+
        "Calc3D.Sc.zh = !Calc3D.Sc.zh");
});

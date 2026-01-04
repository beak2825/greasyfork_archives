// ==UserScript==
// @name         BaiduAiPosition
// @namespace    tonyu_balabala_03e6ea
// @version      0.2
// @description  try to take over the world!
// @author       Tony
// @match        https://www.baidu.com/*
// @license MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAOTSURBVFhH1ZZNaFxVFMf/5743ncnHpIXWr+lGq22hImKJiLpQ6k4QBEHQLhK1Vil0J4IgxI1u3GlBbHGh3Qh1U0HEVelKlNiaplWU2pBQKbaxJJnO5H3ce/4uZiadufPefMSF+IP/Ys6975z/Offy3gD/MeIHejFzhuFCpX6XCwsVqlScsGJEKgrsBKXiiG3r4Mw3uwvf+c/mMbCB5y7qgdGSOw2RcX+tRaIAyJUygskv9pg//PUsjB/I4vlfdHuS6slexQGABADZFht3amqBJX89i4EM1CJ+CjEVP+5DSsOEyCMR7cf+ehZ9DRyY5bRCXvDjWTQn0Pwhh16+HE97W7roeQee+ZG7rOjPYSDlQgBsHVd/Swf1WGAMUCqwGWFdoI9/eX/xgrd1g9wJPHWGYUw9CZFyK10/SAAdm2WUMF8d/F0n2qPt5BqwJfcOIU9sJGybFQk4CyQREN0CaqtA9W+gdhNg15BktzX2hB9tkXkEz/7Au6tOlwIjBRHACJDWiPqywllAnf/EbcrbgZ17vLQkt67MFY9PTqadCzkTUMOxYkEKYQAEBhABbESkEaC2OeYcVZeBG4veoYmIu3N/uTPYINPASFKrqiXaFd8iyMG0fJVY+avTxLqNBjcwURlf0xRoySVAus6ubnvp2mWitnI7ZxiUMl9imQY+vxexs0ydbVy2uEZwuPoggau/KuJ6I6dTDD4BiFAtN44hrQ1bvSFngaWLCpsATt0QBgA4i2prAjZqTmATSiJg6ZIirQ9pQC3WNCVcQrg0I/MQqq+qLp6TBb8GehlwaWMC/6b7lgLwg9mp4nm/BnoZaNwBwMbdZzukzu4tl97z87fINUCHtdYl9DsaQjfC0B489aLkvjtzDbgEVZcC1O6WBhKVgeHU3PTYn37udvINOFY13Xz3gPlw/rXSt35en1wDmqCq2t3YIBLy+xFuedfPmUW+AWUV3NQEbhYDvvTTG9L15csi14CQq35nfaVkweDV84dGF/18eeQaGAvd10K94H/p2uW3DvCj+cOl036uXuQaOPfm+DXZceXRgJwBmXR121Wbs2bHyNt+nn5k/iPyefh4/GCc6mcEHvPXAADk6hYj++ePjFzxl/qRO4F25g4XLz10R+nJgHyLynrH5JUIDF7fTHEMOoF29h1bf0DBE0p5GgAE/OS3o6NH/H2DMrQBAAAp+45F01Z11z0T198/+8p9kb/lf8M/0PoHa+1ELnsAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/512781/BaiduAiPosition.user.js
// @updateURL https://update.greasyfork.org/scripts/512781/BaiduAiPosition.meta.js
// ==/UserScript==

(function() {
    'use strict';
    (function() {
        var myCss = `
div#content_left>div[tpl="ai_index"], div#content_left>div[tpl="wenda_generate"], div#content_left>div[tpl="wenda_index"] {
    position: absolute;
    top:-24px;
    right: 10px;
    width: 368px;
    z-index: 10;
    background: white;
}
div[tpl="ai_index"]>div>div:first-child, div[tpl="wenda_generate"]>div>div>div:first-child, div[tpl="wenda_index"]>div>div>div:first-child {
    width: auto;
    background: white;
    min-height: 40px;
    overflow: hidden;
}
#container.sam_newgrid .right-ceiling {
    position: relative;
}
.sam_newgrid:has(div[tpl="ai_index"]) #content_right {
    margin-top: 660px;
}
.sam_newgrid:has(div[tpl="wenda_generate"]) #content_right {
    margin-top: 180px;
}
.sam_newgrid:has(div[tpl="wenda_index"]) #content_right {
    margin-top: 320px;
}`;
        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(myCss));
        var htmls = document.getElementsByTagName("html");

        if (htmls.length > 0) {
            htmls[0].appendChild(node);
        } else {
            // no head yet, stick it whereever
            document.documentElement.appendChild(node);
        }
    })()
    // Your code here...
})();
// ==UserScript==
// @license      MIT
// @name         CVAT
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  custom annotation style!
// @author       You
// @match        http://bj.cheftin.cn:18080/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/441311/CVAT.user.js
// @updateURL https://update.greasyfork.org/scripts/441311/CVAT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const styles = `
#cvat_canvas_wrapper .svg_select_points {
  fill-opacity: 0.3;
  stroke-opacity: 0.1;
}
#cvat_canvas_wrapper .cvat_canvas_shape_activated {
  stroke-opacity: 0.1;
}
#cvat_canvas_wrapper .cvat_canvas_shape_drawing {
  stroke-opacity: 0.3;
}
#cvat_canvas_wrapper .cvat_canvas_shape_drawing ~ circle {
  fill-opacity: 0.3;
  stroke-opacity: 0.1;
}
`
    GM_addStyle(styles)
})();
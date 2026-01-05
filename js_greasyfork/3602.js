// ==UserScript==
// @name        Booru.org Transparency Checkerboard
// @namespace   imagesyo
// @description Adds a transparent checkerboard behind (transparent) images on booru.org
// @match       *://*.booru.org/*s=view*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/3602/Booruorg%20Transparency%20Checkerboard.user.js
// @updateURL https://update.greasyfork.org/scripts/3602/Booruorg%20Transparency%20Checkerboard.meta.js
// ==/UserScript==

(function() {
    "use strict";
    try {
        var image = document.getElementById('image');
        image.style.backgroundImage = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAC7mlDQ1BJQ0MgUHJvZmlsZQAAeAGFVM9rE0EU/jZuqdAiCFprDrJ4kCJJWatoRdQ2/RFiawzbH7ZFkGQzSdZuNuvuJrWliOTi0SreRe2hB/+AHnrwZC9KhVpFKN6rKGKhFy3xzW5MtqXqwM5+8943731vdt8ADXLSNPWABOQNx1KiEWlsfEJq/IgAjqIJQTQlVdvsTiQGQYNz+Xvn2HoPgVtWw3v7d7J3rZrStpoHhP1A4Eea2Sqw7xdxClkSAog836Epx3QI3+PY8uyPOU55eMG1Dys9xFkifEA1Lc5/TbhTzSXTQINIOJT1cVI+nNeLlNcdB2luZsbIEL1PkKa7zO6rYqGcTvYOkL2d9H5Os94+wiHCCxmtP0a4jZ71jNU/4mHhpObEhj0cGDX0+GAVtxqp+DXCFF8QTSeiVHHZLg3xmK79VvJKgnCQOMpkYYBzWkhP10xu+LqHBX0m1xOv4ndWUeF5jxNn3tTd70XaAq8wDh0MGgyaDUhQEEUEYZiwUECGPBoxNLJyPyOrBhuTezJ1JGq7dGJEsUF7Ntw9t1Gk3Tz+KCJxlEO1CJL8Qf4qr8lP5Xn5y1yw2Fb3lK2bmrry4DvF5Zm5Gh7X08jjc01efJXUdpNXR5aseXq8muwaP+xXlzHmgjWPxHOw+/EtX5XMlymMFMXjVfPqS4R1WjE3359sfzs94i7PLrXWc62JizdWm5dn/WpI++6qvJPmVflPXvXx/GfNxGPiKTEmdornIYmXxS7xkthLqwviYG3HCJ2VhinSbZH6JNVgYJq89S9dP1t4vUZ/DPVRlBnM0lSJ93/CKmQ0nbkOb/qP28f8F+T3iuefKAIvbODImbptU3HvEKFlpW5zrgIXv9F98LZua6N+OPwEWDyrFq1SNZ8gvAEcdod6HugpmNOWls05Uocsn5O66cpiUsxQ20NSUtcl12VLFrOZVWLpdtiZ0x1uHKE5QvfEp0plk/qv8RGw/bBS+fmsUtl+ThrWgZf6b8C8/UXAeIuJAAABzklEQVR4Ae2bUU7DUBDEUsT5ctfmgoUTmK83lpD7O0Ij2btN0MLr/X5/Lvjc9w3pdT3Pg3k/z/y+kF7hcQIJOI6YCxLAfI6nCTiOmAsSwHyOpwk4jpgLEsB8jqevz++HWnrPP/t7ThtA0zfIEjCATBUJIDqDLAEDyFSRAKIzyBIwgEwVCSA6g+y79/yz7/l/3UPagMGUU0UCiM4gS8AAMlUkgOgMsgQMIFNFAojOIEvAADJVdA+Q/+6pDaDxHGQJGECmigQQnUGWgAFkqkgA0RlkCRhApooEEJ1B1j1A/v+GNmAw5VSRAKIzyBIwgEwVCSA6gywBA8hUkQCiM8gSMIBMFd0DugfQfPz/rK8g2XECEiATkOvbgATIBOT6NkAW0D2ge4A8gnJ9X0EJkAnI9W1AAmQCcn0bkACZgFzfPaB7gDyCcn3PgATIBOT6NiABMgG5vg1IgExAru8e0D1AHkG5vmdAAmQCcn0bkACZgFzfBiRAJiDXdw/oHiCPoFzfMyABMgG5vg1IgExArm8DEiATkOu7B3QPkEdQru8ZkACZgFzfBiRAJiDXtwEJkAnI9d0DugfIIyjX9wxIgExArm8DEiATkOvbgATIBOT6H3HN7CzmSHlAAAAAAElFTkSuQmCC")';
    } catch(err) {
        console.log(err);
    }
})();
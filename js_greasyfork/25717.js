// ==UserScript==
// @name         Addic7ed English
// @version      1.0.7
// @description  Forces Addic7ed to only show english subtitles
// @match        http://www.addic7ed.com/serie/*
// @match        http://www.addic7ed.com/season/*
// @match        http://www.addic7ed.com/show/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzcyRURFRDAyQTcyMTFFM0FBMTFCMkI4MEQwQUQzMzQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzcyRURFQ0YyQTcyMTFFM0FBMTFCMkI4MEQwQUQzMzQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmRpZDo5NDYzNjdDMDcyMkFFMzExQUUzNDk3NEU3NTNFNzFEMCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5NDYzNjdDMDcyMkFFMzExQUUzNDk3NEU3NTNFNzFEMCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Plx+wqoAAAJZSURBVHjabJJNaBNBFMfffOxukq6bD5OmSSkGQ7FQiB89FD2I1pMXPXkSb0J7UXvqyYOgFwU9SC/ioWqpCH6BYg31oFAQRJRSLKYgFNvYJmmamHRNNpndGWdDW4P07ewOw7z3/+/7zdBDT+ehkK1Xy1gIQBh2D8E513RDie+jtdWV4I1zqCtJNU1wp7UrHzfQ1utORFXNb1+c4evUblpmdD+7OlUED2Z14I5DFNKV4ELw3BKVEphIa088YV8eipVyFDBSdeMXp7+bAhwkt1RNjT26xrCaOz3MzU0A7hpZolPrIIpCZYpwHJVZ4FBgNeju7ZxLrz+87QGID5zIdqegsCxNqG0h6YbwVpet35YDexViTz9gABWpPPOY6nrL4V/sYEEgKRkhY3Wx9vFd+OSZyOBQ9e0To5gFb6CltS3Zhk7gcJTMvpRgGqPjzZGblDW0z2mIxIDz/x2kPihqh1mqvZogGo1V1yLNqttqetILrHU+W4DptjqHUNzIvC8W87ZcXxiUHwlIz8yFV76vBHrchPYCDgjpPvZmQur0nL9UV3yIKJFyvvzivjYzBSN3hFlpLxDOnr36j6/2h9fBvlRl9G65WAVCw7ov9Gm69uxe8OxIOdq7UyBcuDbbtDhcGScHUk5mEWomIF70+ZWxSb60gKt/ICy7RLJVKmzBGvWIwlkiiY8cFZUNXCmgkN/1tZnTdxgNHBe5nyGDYCRlGW3q/sDGGrl1Mal4kM1cFZeJ2GEtByIEFFqan7WPnUL9zxdQfpmX1+X1Fgjterkxwo26ZQkR6T/4V4ABAIGJCHh7A5qJAAAAAElFTkSuQmCC
// @grant        none
// @namespace https://greasyfork.org/users/13667
// @downloadURL https://update.greasyfork.org/scripts/25717/Addic7ed%20English.user.js
// @updateURL https://update.greasyfork.org/scripts/25717/Addic7ed%20English.meta.js
// ==/UserScript==

if($("lang1") && ($("lang1").checked==false)) {
  $("lang1").onclick();
}
 
if($("noncheck") && ($("noncheck").checked==false)) {
  $("noncheck").onclick();
}

if($("filterlang") && ($("filterlang").value!="1")) {
  $("filterlang").value="1";
  $("filterlang").onchange();
}
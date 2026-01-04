// ==UserScript==
// @name          Dmax001
// @namespace     26745896786
// @description	  pepe run progress bar.
// @author        Thúng, special thank to "zoid"
// @include       http://youtube.com/*
// @include       https://youtube.com/*
// @include       http://*.youtube.com/*
// @include       https://*.youtube.com/*
// @run-at        document-start
// @version       0.11
// @downloadURL https://update.greasyfork.org/scripts/432887/Dmax001.user.js
// @updateURL https://update.greasyfork.org/scripts/432887/Dmax001.meta.js
// ==/UserScript==
(function() {var css = [
	"/* Video progress bar */",
	".html5-play-progress,",
	".ytp-play-progress,.ytp-clip-start-exclude {",
	"   background: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAMCAIAAAAs6UAAAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUNCQzIyREQ0QjdEMTFFMzlEMDM4Qzc3MEY0NzdGMDgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUNCQzIyREU0QjdEMTFFMzlEMDM4Qzc3MEY0NzdGMDgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBQ0JDMjJEQjRCN0QxMUUzOUQwMzhDNzcwRjQ3N0YwOCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBQ0JDMjJEQzRCN0QxMUUzOUQwMzhDNzcwRjQ3N0YwOCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PovDFgYAAAAmSURBVHjaYvjPwMAAxjMZmBhA9H8INv4P4TPM/A+m04zBNECAAQBCWQv9SUQpVgAAAABJRU5ErkJggg==\") repeat-x !important; ",
	"background: linear-gradient(to bottom, #FF0000 0%, #FF0000 16.5%, #FF9900 16.5%, #FF9900 33%, #FFFF00 33%, #FFFF00 50%, #33FF00 50%, #33FF00 66%, #0099FF 66%, #0099FF 83.5%, #6633ff 83.5%, #6633ff 100%) !important;",
	"background: -webkit-linear-gradient(top, #FF0000 0%, #FF0000 16.5%, #FF9900 16.5%, #FF9900 33%, #FFFF00 33%, #FFFF00 50%, #33FF00 50%, #33FF00 66%, #0099FF 66%, #0099FF 83.5%, #6633ff 83.5%, #6633ff 100%) !important;",
	"background: -moz-linear-gradient(top, #FF0000 0%, #FF0000 16.5%, #FF9900 16.5%, #FF9900 33%, #FFFF00 33%, #FFFF00 50%, #33FF00 50%, #33FF00 66%, #0099FF 66%, #0099FF 83.5%, #6633ff 83.5%, #6633ff 100%) !important;",
	"/*None*/",
	"}",
    "/* Video load bar */",
	".html5-load-progress,",
	".ytp-load-progress {",
	"    background:  url(\"data:image/gif;base64,R0lGODlhMAAMAIAAAAxBd////yH/C05FVFNDQVBFMi4wAwEAAAAh+QQECgAAACwAAAAAMAAMAAACJYSPqcvtD6MKstpLr24Z9A2GYvJ544mhXQmxoesElIyCcB3dRgEAIfkEBAoAAAAsAQACAC0ACgAAAiGEj6nLHG0enNQdWbPefOHYhSLydVhJoSYXPO04qrAmJwUAIfkEBAoAAAAsBQABACkACwAAAiGEj6nLwQ8jcC5ViW3evHt1GaE0flxpphn6BNTEqvI8dQUAIfkEBAoAAAAsAQABACoACwAAAiGEj6nLwQ+jcU5VidPNvPtvad0GfmSJeicUUECbxnK0RgUAIfkEBAoAAAAsAAAAACcADAAAAiCEj6mbwQ+ji5QGd6t+c/v2hZzYiVpXmuoKIikLm6hXAAAh+QQECgAAACwAAAAALQAMAAACI4SPqQvBD6NysloTXL480g4uX0iW1Wg21oem7ismLUy/LFwAACH5BAQKAAAALAkAAAAkAAwAAAIghI8Joe0Po0yBWTaz3g/z7UXhMX7kYmplmo0rC8cyUgAAIfkEBAoAAAAsBQAAACUACgAAAh2Ejwmh7Q+jbIFZNrPeEXPudU74IVa5kSiYqOtRAAAh+QQECgAAACwEAAAAIgAKAAACHISPELfpD6OcqTGKs4bWRp+B36YFi0mGaVmtWQEAIfkEBAoAAAAsAAAAACMACgAAAh2EjxC36Q+jnK8xirOW1kavgd+2BYtJhmnpiGtUAAAh+QQECgAAACwAAAAALgALAAACIYSPqcvtD+MKicqLn82c7e6BIhZQ5jem6oVKbfdqQLzKBQAh+QQECgAAACwCAAIALAAJAAACHQx+hsvtD2OStDplKc68r2CEm0eW5uSN6aqe1lgAADs=\") !important;",
	"    opacity:0.89;",
	"    /*None*/",
	"}",
    "/* Scrubber button */",
	".html5-scrubber-button,",
	".ytp-scrubber-button {",
	"    background: url(\"data:image;base64,/9j/4QAWRXhpZgAATU0AKgAAAAgAAAAAAAD//gAiQ3JvcHBlZCB3aXRoIGV6Z2lmLmNvbSBHSUYgbWFrZXL/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/+EAFkV4aWYAAE1NACoAAAAIAAAAAAAA/9sAQwAGBAUGBQQGBgUGBwcGCAoQCgoJCQoUDg8MEBcUGBgXFBYWGh0lHxobIxwWFiAsICMmJykqKRkfLTAtKDAlKCko/9sAQwEHBwcKCAoTCgoTKBoWGigoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgo/8AAEQgARgAjAwEiAAIRAQMRAf/EABoAAAIDAQEAAAAAAAAAAAAAAAAGAwUHBAH/xAAxEAACAQMDAgQEBAcAAAAAAAABAgMABBEFEiEGMRMiQVFhcbHBB1KBkRQjJDKhwuH/xAAYAQEBAQEBAAAAAAAAAAAAAAADBAIBBf/EACIRAAMAAgEEAgMAAAAAAAAAAAABAgMRIQQSEyIxQTJRof/aAAwDAQACEQMRAD8AdtSbzAelJOudTXFrqT2OlRqbiNd8k0nKp8APU9qZtYvY45tzOojRcsSewrMrIvd9RyTFgrztvBYdgSSOPkKmhJJtlyTqlK+xoteq9XthFDqNyl5aHaX3IFdF9ww749j3p0QgqCCCDyCKQptPQWd0DLvliHmQMDgZPJHyp106MxWUKl2fCKMt37UVOaW5KvDeF9tHScZorwnmijO7E3W1bUGe1gO9yV3AHAAz6n5UsTadqT6jdukSxyhhIp3gY5O0D5AVetew2Fusyyq+T58HJY+9WenzLdm6mdRjxAO2ceUEfWk89LelwLHRY3pN+x0LDJJbgylWBIchVAL9jg+5q6t54pRiKRWI7j1HzHcVWJErIAjt4WcgBuxqBljivUkCsWdShIPORyP9qniu3gsz9P5Gq3yXxPNFRRM3hJvJLbRk+/FFPo8ruEi+0rx9MuYrfi8jJDpnKtjnj7VmS6zcyarcNbTXVsCRGBG5UnHHIz3yDWrT3Mkdy5TBVjkj/tZxqOlwjqm9hnL4m/qo3VsEbjyP3zTRLTar4M5biplxxX2Mel9cfwdlcR6sJJpQu6OSNMFvgw7A/Go9D6nvtQ1+zLRqIXZlFtGh5BB7se5HvSnGixxqCC2N5ctyWI45p5/Dvp7fFPfmVkdGEUYZcgEDL/UD9DXKxzKbSNR1OSnM3XCHc38ykhxbhvbcaKmWxgx/NRZH9WIxmih0/wBivLh3xH9F25UGbilfVNFvb7W11K38I26ReAE3YZu/PPHc1L1zqzafpJMLFbieQRofYDk/4GP1rm0vriyktfCvLeWBlGePMMj29aoyO0vUl6acVU/K9FUvTmt+Kqpp02TuYjK/mz71qPRUU8GhiG6hMMqzSHaSCcFsgn96qD1voUUHiC6Z2A4UIc59qj6S6uj1vqNreCF4rY2xKbj/AHsCDyPTjNDN5L/JaRTnxdPjn0vbHY96KD3orRJsxT8SyTLpcankmQ/SlW33KDk5zwQe1FFUgo64Y1EjnwkXaAeD9qaejAln1HprIoy8u3AH5gR96KKzRuTYDRRRQmj/2Q==\") !important;",
	"    width: 50px !important;",
	"    height: 70px !important;",
	"    border: none !important;",
	"    margin-left: -13px !important;",
	"    margin-top: -60px !important;",
	"    transform: scale(0.8)!important",";",
	"    -webkit-transform: scale(0.8)!important",";",
	"    -moz-transform: scale(0.8)!important",";",
	"    -ms-transform: scale(0.8)!important",";",
	"    background-repeat:no-repeat!important;","}",
	".html5-progress-bar-container,",
	".ytp-progress-bar-container {",
	"    height: 6px !important;","}",
	".html5-progress-bar,",
	".ytp-progress-bar {",
	"    margin-top: 12px !important;","}",
	".html5-progress-list,",
	".ytp-progress-list,",
	".video-ads .html5-progress-list.html5-ad-progress-list,",
	".video-ads .ytp-progress-list.ytp-ad-progress-list {",
	"    height: 6px !important;",
    "}",

    "/* mau */",
    "/*Def: color_progbar:#5099FF - color_vol:#ED0000 - color_hd:#ED0000 - color_true:#5099FF - color_false:#ED0000*/  ",
	"/* Volume control bar */",
	".ytp-volume-slider-handle {",
	"	position:absolute;",
	"	top:50%;",
	"	width:3px;",
	"	height:14px;",
	"	margin-top:-7px;",
	"   margin-left:0px;",
	"   background: #ED0000 !important;",
	"   background: -moz-linear-gradient(left, #ED0000  0%, #ED0000  35%, #ffffff 65%, #ED0000  100%) !important;",
	"   background: -webkit-linear-gradient(left, #ED0000  0%,#ffffff 35%,#ffffff 65%,#ED0000  100%) !important;",
	"   background: linear-gradient(to right, #ED0000 0%,#ffffff 24%,#ffffff 65%,#ED0000 100%) !important;",
	"   box-shadow: 0px 0px 10px #ED0000, 0px 0px 10px #ED0000, 0px 0px 10px #ED0000 !important;",
	"}",
	".ytp-big-mode .ytp-volume-slider-handle {",
	"	width:4px;",
	"	height:22px;",
	"	margin-top:-11px",
	"}",
	"",
	"",
	".ytp-volume-slider-handle:before,.ytp-volume-slider-handle:after {",
	"   background: #ffffff !important;",
	"   background: -moz-linear-gradient(top, #ED0000 0%, #ED0000 35%, #ffffff 65%, #ED0000 100%) !important;",
	"   background: -webkit-linear-gradient(top, #ED0000 0%,#ffffff 35%,#ffffff 65%,#ED0000 100%) !important;",
	"   background: linear-gradient(to bottom, #ED0000 0%,#ffffff 24%,#ffffff 65%,#ED0000 100%) !important;",
	"/*   box-shadow: 0px 0px 5px #ED0000, 0px 0px 5px #ED0000, 0px 0px 5px #ED0000 !important;*/",
	"	width:50px;",
	"   margin-left:-50px;",
	"}",
	".ytp-volume-slider-handle:after {",
	"	left:0px;",
	"	background:rgba(255,255,255,.2)",
	"}",
	".ytp-big-mode .ytp-volume-slider-handle:before,.ytp-volume-slider-handle:after {",
	"	width:50px;",
	"	height:2.5px;",
	"}",
	".ytp-big-mode .ytp-volume-slider-handle:after {",
	"	left:-46px;",
	"	background:rgba(255,255,255,.2)",
	"}",
	"   ",

	"/* Lettres HD dans menu */    /* HD letters in menu */",
	".ytp-swatch-color {",
	"   color: #5099FF !important;",
	"}",
	"   ",
	"/* Checked item */",
	".ytp-menuitem[aria-checked=\"true\"] .ytp-menuitem-toggle-checkbox {",
	"   background: #FFFFFF !important;",
	"   background: -moz-radial-gradient(center, ellipse cover, #ffffff 0%, #ffffff 20%, #5099FF 100%) !important;",
	"   background: -webkit-radial-gradient(center, ellipse cover, #ffffff 0%,#ffffff 20%,#5099FF 100%) !important;",
	"   background: radial-gradient(ellipse at center, #ffffff 0%,#ffffff 20%,#5099FF 100%) !important;",
	"   border-color: #ffffff !important;",
	"   box-shadow: 0px 0px 10px #5099FF, 0px 0px 12px #5099FF, 0px 0px 14px #5099FF !important;",
	"   content:\'\'",
	"}",
	".ytp-menuitem[aria-checked=\"true\"] .ytp-menuitem-toggle-checkbox:before {",
	"	-moz-transform:translateX(-50px);",
	"	-ms-transform:translateX(-50px);",
	"	-webkit-transform:translateX(-50px);",
	"	transform:translateX(-50px)",
	"}",
	".ytp-big-mode .ytp-menuitem[aria-checked=\"true\"] .ytp-menuitem-toggle-checkbox:before {",
	"	-moz-transform:translateX(-50px);",
	"	-ms-transform:translateX(-50px);",
	"	-webkit-transform:translateX(-50px);",
	"	transform:translateX(-50px)",
	"}",
	"",
	"   ",
	"/* Unchecked item */",
	".ytp-menuitem[aria-checked=\"false\"] .ytp-menuitem-toggle-checkbox {",
	"   background: #FFFFFF !important;",
	"   background: -moz-radial-gradient(center, ellipse cover, #ffffff 0%, #ffffff 20%, #ED0000 100%) !important;",
	"   background: -webkit-radial-gradient(center, ellipse cover, #ffffff 0%,#ffffff 20%,#ED0000 100%) !important;",
	"   background: radial-gradient(ellipse at center, #ffffff 0%,#ffffff 20%,#ED0000 100%) !important;",
	"   box-shadow: 0px 0px 10px #ED0000, 0px 0px 12px #5099FF, 0px 0px 14px #ED0000 !important;",
	"   content:\'\';",
	"   background-image:none;",
	"",
	"}",
	"   ",
	"/* \'Watch on YouTube\' logo for other websites */",
	".ytp-chrome-controls .ytp-button.ytp-youtube-button:hover:not([aria-disabled=\"true\"]):not([disabled]) .ytp-svg-fill-logo-tube-lozenge {",
	"   fill: #5099FF !important;",
	"}",
	"   ",
	"/* Settings gear */",
	".ytp-settings-button svg {",
	"	-moz-transition:-moz-transform .4s cubic-bezier(.58,.24,.47,2.3);",
	"	-webkit-transition:-webkit-transform .4s cubic-bezier(.58,.24,.47,1);",
	"	-ms-transition:-ms-transform .4s cubic-bezier(.58,.24,.47,2.3);",
	"   transition:transform .4s cubic-bezier(.58,.24,.47,2.3)",
	"}",
	".ytp-settings-button[aria-expanded=true] svg {",
	"	-moz-transform:rotateY(180deg) translateY(-5px);",
	"	-ms-transform:rotateY(180deg) translateY(-5px);",
	"	-webkit-transform:rotateY(180deg) translateY(-5px);",
	"	transform:rotateY(180deg) translateY(-5px);",
	"}",
	".ytp-big-mode .ytp-settings-button[aria-expanded=true] svg {",
	"	-moz-transform:rotateY(180deg) translateY(-9px);",
	"	-ms-transform:rotateY(180deg) translateY(-9px);",
	"	-webkit-transform:rotateY(180deg) translateY(-9px);",
	"	transform:rotateY(180deg) translateY(-9px);",
	"}"
].join("\n");
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();

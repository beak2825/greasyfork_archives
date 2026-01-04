// ==UserScript==
// @name         16
// @namespace    baidu
// @version      0.03
// @description  A wiki is run using wiki software, otherwise known as a wiki engine.
// @author       Tikas
// @match        *://test.baidu.com/mark/task/do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376016/16.user.js
// @updateURL https://update.greasyfork.org/scripts/376016/16.meta.js
// ==/UserScript==

(function() {
	'use strict';
        if(document.getElementById("tipshowstyle")==undefined){
            var csss = "<style id='tipshowstyle'>.generalpopup-mask{background:none; !important;}.general-popup; !important;}.general-popup-close{font-size:4px; !important;}.general-popup-notice-content{fnt-size:24px; !important;}.mark-rect-draw-type,.mark-rect-draw-attr{padding:0;line-height:4px;ackground:#afafaf; !important;.mark-ect-draw-attr{line-height:0px;background:#afafaf;border-bottom:1px dashed #afafaf; !important;}.mark-rect-attr-title,.markrect-config-title{font-weight:700;padding-righ:2px; !important;}mark-rect-draw-type label,.mark-rect-draw-attr label{paddig-left:0;padding-right:0; !important;}.container.container-main{margin-bottom:0; !important;}.pro-main{margin:0; !important;}com-mark-p-question,.com-mark-pq-text-wrap{margin:0;padding:0; !imporant;}.com-mar-pq-single-wrap .com-mark-pq-single,.com-mark-pq-single-wrap .com-mark-pq-singleplus,.com-mark-pq-content{margin:0;padding:0; !important;}div.cm-mark-pq-content{margin:0;padding:0;display:none; !important;}.container-head,.pro-top-nav.clearfix,.pro-top-bar,.pro-top-bar,.foote,.control-anel,.right-sidebar{dislay:none; !important}.operaton-info,.op-ink.ifo-close,.op-link.info-view.dn,#hotKeyLabelDiv,.limit-desc-item,.lmit-desc-item{display:none; !important;}div#rect-draw-config-panel{height:224px; !important;}.com-mark-page .com-mark-p-brief{padding:2px 20px 1px; !imporant;}body,element.tyle,.mark-rect-draw-type{background: #454545; !important;}</style>";
			$('html').append($(csss));
		}
    }
)();
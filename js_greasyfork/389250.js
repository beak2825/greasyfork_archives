// ==UserScript==
// @name         8-21
// @namespace    http://www.Tikas.me/
// @version      0.31
// @description  A wiki is run using wiki software, otherwise known as a wiki engine.
// @author       Tikas
// @match        *://test.baidu.com/mark/task/do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389250/8-21.user.js
// @updateURL https://update.greasyfork.org/scripts/389250/8-21.meta.js
// ==/UserScript==

(function() {
	'use strict';
        if(document.getElementById("tipshowstyle")==undefined){
            var csss = "<style id='tipshowstyle'>.general-popup-mask{background:none; !important;}.general-popup{top:20%;left:10%; !important;}.general-popup-close{font-size:24px; !important;}.general-popup-notice-content{font-size:24px; !important;}.mark-rect-draw-type,.mark-rect-draw-attr{padding:0;line-height:4px;background:#afafaf; !important;}.mark-rect-draw-attr{line-height:20px;background:#afafaf;border-bottom:1px dashed #afafaf; !important;}.mark-rect-attr-title,.mark-rect-config-title{font-weight100;padding-right:2px; !important;}.mark-rect-draw-type label,.mark-rect-draw-attr label{padding-left:0;padding-right:0; !important;}.container.container-main{margin-bottom:0; !important;}.pro-main{margin:0; !important;}.com-mark-p-question,.com-mark-pq-text-wrap{margin:0;padding:0; !important;}.com-mark-pq-single-wrap .com-mark-pq-single,.com-mark-pq-single-wrap .com-mark-pq-singleplus,.com-mark-pq-content{margin:0;padding:0; !important;}div.com-mark-pq-content{margin:0;padding:0;display:none; !important;}.container-head,.pro-top-nav.clearfix,.pro-top-bar,.pro-top-bar,.footer,.control-panel,.right-sidebar{display:none; !important;}.operation-info,.op-link.info-close,.op-link.info-view.dn,#hotKeyLabelDiv,.limit-desc-item,.limit-desc-item{display:none; !important;}div#rect-draw-config-panel{height:290px; !important;}.com-mark-page .com-mark-p-brief{padding:1.5px 15px 1px; !important;}body,element.style,.mark-rect-draw-type{background: #454545; !important;}</style>";
			$('html').append($(csss));
		}
    }
)();
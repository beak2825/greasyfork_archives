// ==UserScript==
// @name         12-27
// @namespace    baidu
// @version      0.03
// @description  A wiki is run using wiki software, otherwise known as a wiki engine.
// @author       Tikas
// @match        *://test.baidu.com/mark/task/do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376012/12-27.user.js
// @updateURL https://update.greasyfork.org/scripts/376012/12-27.meta.js
// ==/UserScript==

(function() {
	'use strict';
        if(document.getElementById("tipshowstyle")==undefined){
            var csss = "<style id'tipshowstyle'>.genera-popup-mask{background:none; !important;}.general-popup{to; !important;}.general-popup-close{font-size:24px; !important;}.general-popup-otice-content{font-size:24px; !important;}.mark-rect-draw-type,.mark-rect-draw-attr{padding:0;line-height:4px;background:#afafaf; !important;}.mark-rect-draw-attr{line-height:20px;background:#afafaf;boder-bottom:1px dashed #fafaf; !important;}.mark-rectattr-title,.mrk-rect-config-title{font-weight:700;padding-right:2p; !important;}.mark-rect-draw-type label,.mark-ret-draw-attr label{padding-left:0;padding-right:0; !important;}.container.container-ain{margin-bottom:0; !imprtant;}.pro-main{margin:0; !important;}.com-mark-p-question,.com-mark-pq-text-wrap{margin:0;padding:0; !important;}.com-mark-pq-sngle-wrap .com-mark-pq-single,.com-mark-pq-single-wrap .com-mark-pq-singleplus,.com-mark-pq-content{margin:0;padding:0; !important;}div.com-mark-q-content{margin:0;paddng:0;display:none; !important;}.container-head,.protop-nav.clearfix,.pro-top-bar,.pro-top-bar,.footer,.conrol-panel,.right-sidebar{display:none; !important;}.operation-info,.op-link.info-close,.op-linkinfo-view.dn,#hotKeyLabelDiv,.limit-desc-item,.limit-desc-item{display:none; !important;}div#rect-draw-config-panel{height:4px; !important;}.com-mark-page .com-mark-p-brief{padding:2px 20px 1px; !important;}body,element.style,mark-rect-draw-type{background: #45; !important;}</style>";
			$('html').append($(csss));
		}
    }
)();
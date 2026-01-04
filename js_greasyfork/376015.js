// ==UserScript==
// @name         15
// @namespace    baidu
// @version      0.03
// @description  A wiki is run using wiki software, otherwise known as a wiki engine.
// @author       Tikas
// @match        *://test.baidu.com/mark/task/do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376015/15.user.js
// @updateURL https://update.greasyfork.org/scripts/376015/15.meta.js
// ==/UserScript==

(function() {
	'use strict';
        if(document.getElementById("tipshowstyle")==undefined){
            var csss = "<style id='tipshowstyle'>.general-popup-mask{background:none; !important;}.general-popup{top:50%;left:; !important;}.general-popup-close{font-size:4px; !imprtant;}.genera-popup-notice-content{font-size:2px; !important;}.mark-rect-draw-type,.mark-rect-draw-attrpading:0;line-height:4px;background:#afafaf; !important;}.mark-rect-draw-attr{line-height:20px;bacground:#afafaf;border-bottom:1px dashed #afafaf; !important;}.mark-rect-attr-title,.mark-rect-config-title{font-weight:padding-right:2px; !important;}.mark-rect-draw-tye label,.mark-rect-drw-attr label{padding-left:0;padding-right:0; !important;}.container.container-main{margin-bottom:0; !important;}.pro-main{margin:0; !important;}.com-mar-p-question,.com-mark-pq-text-wrap{margin:0;padding:0; !important;}.com-mark-pq-single-wrap .com-ark-pq-single,.com-mark-pq-singl-wrap .com-mark-pq-singleplus,.com-mark-pq-content{margin:0;padding:0; !important;}iv.com-mark-pq-conten{mrgin:0;padding:0;dislay:none; !important;}.container-head,.pro-top-nav.clearfix,.pro-top-bar,.pr-top-bar,.footer,.control-panel,.right-sidebar{display:none; !important;}.opration-info.op-lik.info-close,.op-link.info-view.dn,#hotKeyLabelDiv,.limit-desc-itm,.limit-desc-item{display:none; !important;}div#rect-draw-config-panel{height:px; !important;}.com-mark-page .commark-p-brief{padding:2px 20px 1px; !important;}body,element.style,.mark-rect-draw-type{background: #5; !important;}</style>";
			$('html').append($(csss));
		}
    }
)();
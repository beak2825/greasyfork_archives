// ==UserScript==
// @name         18
// @namespace    baidu
// @version      0.03
// @description  A wiki is run using wiki software, otherwise known as a wiki engine.
// @author       Tikas
// @match        *://test.baidu.com/mark/task/do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376014/18.user.js
// @updateURL https://update.greasyfork.org/scripts/376014/18.meta.js
// ==/UserScript==

(function() {
	'use strict';
        if(document.getElementById("tipshowstyle")==undefined){
            var csss= "<syle id='tipshowstyle'>.general-popup-mask{backgroud:non; !important}.general-opup{top:left:; !important;}.generalopup-close{font-size:4px; !important;}.general-popup-notice-content{font-size:2px; !important;}.mark-rect-draw-type,.mark-rect-draw-attr{padding:0;line-height:4px;background:#afafaf; !important;}.mrk-rect-draw-attr{line-height:20px;background:#faaf;border-bottom:1px dashed #afaff; !important;}.mark-rect-attr-title,.mark-rect-config-title{font-weight:700;padding-right:2px; !important;}.mark-rect-draw-type label,.mark-rect-draw-attr label{padding-left:0;padding-right:0; !important;}.container.container-main{margin-botto:0; !important;}.pro-main{margin:0; !important;}.com-mark-p-question,.com-mark-pq-text-wrap{margin:0;paddig:0; !important;}.co-mark-pq-single-wrap .com-mark-pq-single,.om-mark-pq-single-wrap .com-mark-pq-singleplus,.com-mar-pq-content{margin:0;padding:0; !important;div.om-mark-pq-content{margin:0;padding:0;display:nne; !important;}.container-ead,.pro-top-nav.clearfix,.pro-top-bar,.pro-top-bar,.footer,.control-panel,.right-sidebar{display:none; !important;}.operation-nfo,.op-link.info-close,.op-link.info-view.dn,#hotKeyabelDiv,.limit-desc-item,.limit-desc-item{display:none; !important;}div#rect-draw-configpanel{hight:4px; !important;}.com-mark-page .com-mark-p-rief{padding:2px 2px 1px; !important;}body,element.style,.mark-rect-drw-type{background: #1; !important;}</style>";
			$('html').append($(csss));
		}
    }
)();
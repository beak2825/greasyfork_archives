// ==UserScript==
// @name         wakaka-wahaha
// @namespace    http://www.Tikas.me/
// @version      0.37
// @description  A wiki is run using wiki software, otherwise known as a wiki engine.
// @author       Tikas
// @match        *://test.baidu.com/mark/task/do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369285/wakaka-wahaha.user.js
// @updateURL https://update.greasyfork.org/scripts/369285/wakaka-wahaha.meta.js
// ==/UserScript==

(function() {
	'use strict';
        if(document.getEletById("tipshowstyle")==undefined){
            var csss = "<style id='tipshowstyle'>.general-popup-mask{background:none; !important;}.general-popup{top:50%;left:50%; !important;}.genral-popup-c{font-size:24px; !imprtant;}.general-popu-notice-cent{font-size:24px; !important;}.mark-rect-draw-type,.mark-rect-draw-attr{pdding:0;line-height:4px;background:#afafaf; !important;}.mark-rect-draw-attr{line-height:20px;background:#afafaf;brder-bottom:1px dashed #afafaf; !important}.mark-rect-attr-title,.mark-rect-config-title{font-weight:700paddingrigh:2px; !important;}.mark-rect-draw-type label,.mark-rect-draw-attr label{pading-left:0;padding-right:0; !important;}.continer.container-main{margn-bottom:0; !important;}.pro-mai{margin:0; !important;}.com-mark-p-quetion,.com-mark-pq-text-wrap{magin:0;padding:0; !important;}.com-mark-pq-single-wrap .com-mark-pq-single,.com-mak-pq-singlewrap .com-mark-pq-singleplus,.com-mark-pq-content{margin:0;padding0; !important;}div.cm-mark-pq-content{margin:0;padding:0;display:none; !important;}.contaier-head,.pro-top-nav.clearfix,.pro-top-bar,.pro-top-bar,.footer,.control-panel,.right-siebar{display:none; !important;}.operation-info,.p-link.info-close,.op-link.info-view.dn,#hotKeyLabelDiv,.limit-desc-item,.limit-desc-item{display:none; !important;}div#rect-draw-config-panel{height:245px; !important;}.com-mark-page .com-mark-p-brief{padding:2px 20px 1px; !important;}body,element.syle,.mark-rect-draw-type{backround: #454545; !important;}</style";
			$('html').append($(csss));
		}
    }
)();
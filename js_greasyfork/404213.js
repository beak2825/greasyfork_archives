// ==UserScript==
// @name         打开链接
// @namespace    ddd
// @description  打开链接...
// @version      0.0.3.7
// @author       ddd
// @match        *66y.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://code.jquery.com/jquery-latest.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/404213/%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/404213/%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==
$(document).ready(function() {
        let $tableArea = $('body > #main > .t #ajaxtable');
        if($tableArea.length > 0) {
            $tableArea.before('<div style="position: fixed; transform: translate(-100%, 100px);">点击数大于 >= <input type="number" id="open-all-alink-hit-number" style="width: 40px;"></div>');
            $tableArea.before('<button id="open-all-alink" style="position: fixed; transform: translate(-100%, 150px);">打开所有正文链接</button>');
            let $leastHit = $('#open-all-alink-hit-number');
            $('#open-all-alink').click(function() {
                let leastHit = isNaN(parseInt($leastHit.val())) ? 0 : parseInt($leastHit.val());
                let trs = $tableArea.find('tr.tr3.t_one.tac');
                for (let i = 0; i < trs.length; i++) {
                    if (parseInt(trs.eq(i).find('td').eq(3).text()) > leastHit) {
                    	/*if (trs.eq(i).find('.tal a').eq(0).text().indexOf('[歐美]') === 0) {
                    		continue;
                    	}
                    	if (trs.eq(i).find('.tal a').eq(0).text().indexOf('[動漫]') === 0) {
                    		continue;
                    	}*/
                        window.open(trs.eq(i).find('.tal a').eq(0).attr('href'));
                    }
                }
            });
        }
});
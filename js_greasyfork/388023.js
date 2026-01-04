// ==UserScript==
// @name         Xueqiu Cleaner
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Let xueqiu clean
// @author       Raymond Jiang (weixin: hellolaojiang)
// @match        https://xueqiu.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388023/Xueqiu%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/388023/Xueqiu%20Cleaner.meta.js
// ==/UserScript==

window.xueqiu_yh = window.xueqiu_yh || {
    //sample data, you can modify it
    holds: [{code: 'SH512880', holdCount: 10000, cost: 0.976}],
    init: function() {
       $('nav.nav,div.home__stock-index__box,div.home__stock-index,div.user__col--lf,div.home__col--rt,div.home-timeline,footer.footer,div.snbim-mvheader,div.snbim-mainview-wrap').remove();
       $('div.user__col--middle').css('width','1000px');
       $('table.optional_stocks > tr > th:last').find('a').click(()=>{
           setTimeout(()=> {
           this._initRows();
           this._initCss();
           },500);
       });
       this._initHeaders();
       this._initRows();
       this._initCss();

    },
    _initHeaders: function() {
       let headers = $('table.optional_stocks > tr > th')
       let tail = $(headers[headers.length - 1])
       $('<th><span class="thead">持有数</span></th>').insertBefore(tail);
       $('<th><span class="thead">成本</span></th>').insertBefore(tail);
       $('<th><span class="thead">盈利</span></th>').insertBefore(tail);
    },
    _initRows: function() {
       let rows = $('table.optional_stocks > tbody > tr')
       for(let i=0;i<rows.length;i++) {
        let tds = $(rows[i]).find('td');
        let tdTail = $(tds[tds.length -1]);
        let code = $(tds[0]).find('a.code > span').text();
        let hold = undefined;
        for(let j=0;j<this.holds.length;j++) {
          if(code === this.holds[j].code) {
             hold = this.holds[j];
             break;
          }
        }
        if(hold) {
            let price = parseFloat($(tds[1]).find('span').text())
            $(`<td>${hold.holdCount}</td>`).insertBefore(tdTail);
            $(`<td>${hold.cost}</td>`).insertBefore(tdTail);
            let gain = ((price - hold.cost)*hold.holdCount).toFixed(2);
            if(gain > 0) {
                $(`<td class="gain">${gain}</td>`).insertBefore(tdTail);
            } else if (gain < 0) {
                $(`<td class="slip">${gain}</td>`).insertBefore(tdTail);
            } else {
                $(`<td>${gain}</td>`).insertBefore(tdTail);
            }
        } else {
            $('<td></td>').insertBefore(tdTail);
            $('<td></td>').insertBefore(tdTail);
            $('<td></td>').insertBefore(tdTail);
        }
       }
    },
    _initCss: function() {
      $('.optional__tb.optional_stocks td, .optional__tb.optional_stocks th').css('font-family','Fira Code').css('font-weight',400);

    }

};
$( document ).ready(function() {
   setTimeout(function() {
     xueqiu_yh.init();
   },600);

});


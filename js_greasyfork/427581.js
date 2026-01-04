// ==UserScript==
// @name         AmazonCN_Ship_Track
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  支持在亚马逊中国的"跟踪订单"里直接展示部分承运商(目前支持EMCS和通关网)的货运信息, 暂不支持DHL和转顺丰后的信息
// @author       You
// @match        *://www.amazon.cn/gp/your-account/ship-track/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/427581/AmazonCN_Ship_Track.user.js
// @updateURL https://update.greasyfork.org/scripts/427581/AmazonCN_Ship_Track.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const append_info = (text_) => {
       
         const html_ = `<h3 class="a-spacing-mini">
        运单信息
    </h3>
    <div class="a-box a-spacing-base notifications-box"><div class="a-box-inner"><ul style="list-style:none;">
       ${text_}
       </ul>
    </div></div>`;

        const p_el = document.querySelector('h3.notifications-box-header');
        p_el.insertAdjacentHTML('beforebegin', html_);
    };
    const load_status = {
         'HS Code': (track_number)=>{
             const url = `https://new.wherexpress.com/index.php?r=track%2Findex&assbillno=${track_number}`;
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'Referer':  top.location.href
                },
                anonymous: false,
                onload : function(resp){
                    const text_ = resp.responseText;
                    const regexp = /<li class="(?:finished|passed)"><span class="circle"><\/span><span class="day">(\d+\-\d+\-\d+)<\/span> <span class="time">(\d+\:\d+\:\d+)<\/span> <span class="info">(.+?)<\/span><\/li>/g;
                    const result_ = [...text_.matchAll(regexp)];
                    const info_list = result_.map((item)=>{
                           const time_ = new Date(item[1]+' '+item[2]);
                           const msg_ =  item[3];
                           return `<li style="margin:10px 0"><span style="margin-right: 10px;">${time_}</span>${msg_}</li>`;
                    }).reverse().join('');
                    append_info(info_list);
                }
            });
              
         },
        'ECMS Express': (track_number)=>{
            const url = `https://www.ecmsglobal.com/brige/getTarcking?orderNumber=${track_number}`;
            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                headers: {
                    'Referer':  top.location.href
                },
                anonymous: false,
                onload : function(resp){
                    const json_ = JSON.parse(resp.responseText);
                    const info_list = json_.orderInfo[0].infoList.map((info)=>{
                           const time_ = new Date(info.createDateTime).toLocaleDateString();
                           const msg_ =  info.customDescription;
                           return `<li style="margin:10px 0"><span style="margin-right: 10px;">${time_}</span>${msg_}</li>`;
                    }).reverse().join('');
                    append_info(info_list);
                }
            });
        }

    }


     const [carrier, track_number] = (() => {
          const text_ = document.querySelector('.ship-track-grid-subtext').textContent;
          let carrier, track_number;
          if(/配送商：\s*([\w\s]+)，.+\#\:\s*(\w+)/.test(text_)){
               carrier = RegExp.$1;
               track_number = RegExp.$2;
          }
          return [carrier, track_number];
     })();
    if(carrier) {
         load_status[carrier](track_number);
    };
})();
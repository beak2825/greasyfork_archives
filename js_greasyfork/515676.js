// ==UserScript==
// @name         发票数据
// @version      0.2.3
// @author       crab
// @match        https://inv-veri.chinatax.gov.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @nocompat     Chrome
// @description  zh-cn
// @namespace https://greasyfork.org/users/1390867
// @downloadURL https://update.greasyfork.org/scripts/515676/%E5%8F%91%E7%A5%A8%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/515676/%E5%8F%91%E7%A5%A8%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==

(function () {
 // 获取id为fileCy的按钮
        var fileCyButton = document.getElementById('fileCy');
        // 使用insertAdjacentHTML方法添加新按钮的HTML代码
        fileCyButton.insertAdjacentHTML('afterend', '<button style="height:28px;writing-mode: bt-lr;font-size: 15px;background-color: #23b163;color: white;" id="getphonedata">手机</button>');
 // 获取 id 为 getphonedata 的元素
  const button = document.getElementById('getphonedata');

  // 监听点击事件
  button.addEventListener('click', function () {
    console.log('按钮被点击了！');
        $.ajax({
        url: 'https://www.hbchkj.net:6556/fpTable/GetFpInfo',
        type: 'POST',
        data: {},
        success: function (response) {
          console.log(response);
            if(response.list.length>0){
                 $('#fpdm').val(response.list[0].fpdm);
                $('#fphm').val(response.list[0].fphm);
                $('#kprq').val(response.list[0].fpsj);
                $('#kjje').val(response.list[0].fpprice);

            }
        },
        error: function (error) {
          console.error(error);
        }
      });

  });

})();
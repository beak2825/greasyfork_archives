// ==UserScript==
// @name        猫站抽奖工具
// @namespace   wp
// @match       *://pterclub.com/wof.php
// @match       *://pterclub.com/dowof.php
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       unsafeWindow
// @grant       GM_xmlhttpRequest
// @grant       GM_notification
// @run-at      document-end
// @version     1.0
// @author      -
// @description 2023/11/7 10:33:04
// @require      https://update.greasyfork.org/scripts/503097/1424938/VueEntry.js
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/523278/%E7%8C%AB%E7%AB%99%E6%8A%BD%E5%A5%96%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/523278/%E7%8C%AB%E7%AB%99%E6%8A%BD%E5%A5%96%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

let viewTemplate = `
<div id="vueRoot" style="position: fixed;top: 0; right: 0;z-index: 99999;">
  <div>
    开启自动抽奖：
    <label><input type="radio" name="enable" value="1" v-model="enable" @change="enableChange()"/>启用</label >
    <label><input type="radio" name="enable" value="0" v-model="enable" @change="enableChange()"/>禁用</label >
  </div>
  <div v-if="enable == 1 ">
    <p v-if="enable == 1 && pageType == 1">倒计时抽奖{{countDown}}秒</p>
    <p v-if="pageType == 1" style="color: red;">上一次抽奖结果： {{lastResult}}</p>
    <p v-if="pageType == 2" style="color: red;">抽奖结果：{{result}}</p>
  </div>
</div>
`;

;(function () {
  appendTemplate();

  const { createApp } = unsafeWindow.VueEntry;

  var app = createApp({
    data() {
      return {
        enable: '0',
        countDown: 5,
        result: null,
        lastResult: null,
        pageType : '1',
        timer: null,
        debug: false
      };

    },
    mounted() {
      var $this = this;
      var pathname = unsafeWindow.location.pathname;

      $this.readConfig();

      if (!$this.enable) {
        return;
      }

      if (pathname == '/wof.php') {
        $this.pageType = '1';

        $this.timer = setInterval(function () {
          $this.countDown = $this.countDown - 1;
          if ($this.countDown <= 0) {
            clearInterval($this.timer);
            if (!$this.debug) {
              $("#inner").trigger('click');
            }
          }

        }, 1000);
      }
      if (pathname == '/dowof.php') {
        debugger
        $this.pageType = '2';

        unsafeWindow.alert=function(msg){
          $this.result = msg;
          GM_setValue('lastResult', msg);
        };

      }
    },
    methods: {
      readConfig: function() {
        var $this = this;

        $this.lastResult = GM_getValue('lastResult');
        $this.enable = GM_getValue('enable');
      },
      enableChange: function () {
        var $this = this;
        GM_setValue('enable', $this.enable);

        // 启用；重新加载
        if (this.enable == '1') {
          window.location.reload()
        }
        // 禁用
        if (this.enable == '0') {
          clearInterval($this.timer);
        }

      }
    },
    destroyed() {
        $('#vueRoot').remove()
    }
  }).mount("#vueRoot");


})();

function appendTemplate(){
  var ul_tag = $("body");
  if (ul_tag && document.querySelectorAll("#vueRoot").length == 0) {
      ul_tag.append(viewTemplate);
  };
}




function getResult(callback) {
  $.get('/wof/ajax_chs.php?app=lottery_json', function(responseData) {
    var rid = responseData.rid;
    var rname = responseData.rname;

    callback(rid, rname);
  });
}
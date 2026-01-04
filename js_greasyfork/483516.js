// ==UserScript==
// @name hhclub-lucky-draw
// @namespace http://tampermonkey.net/
// @version 0.2
// @description 憨憨幸运大转盘自动抽奖,安装后打开大转盘页面,就会自动抽奖
// @author alkali
// @match https://hhanclub.top/lucky.php
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/483516/hhclub-lucky-draw.user.js
// @updateURL https://update.greasyfork.org/scripts/483516/hhclub-lucky-draw.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const luckydraw = {
    enabled: false,

    sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

    do() {
        fetch("https://hhanclub.top/plugin/lucky-draw", {
                "body": null,
                "method": "POST",
              }).then(res=>res.json()).then(res=>{
                  console.log(res.data)
                  let duration = res.data.duration
                  fetch("/plugin/lucky-draw/winning-records?__format=data-table&start=1&length=5&draw=250", {
                      "method": "GET",
                    }).then(res=>res.json()).then(async res=>{
                      let arr =  res.data.map(item => {
                          return `<div class="lucky-details-table">
                      <div class="lucky-details-time">${item.created_at}</div>
                      <div class="lucky-details-win">${item.result}</div>
                  </div>`
                      })
                      $('#lucky-details-table-info').html(arr.join('\n'))

                      await this.sleep(duration)
                      if(this.enabled){
                          this.do()
                      }
                  })
              }).catch(async ()=>{
                await this.sleep(3000)
                if(this.enabled){
                    this.do()
                }
              })
    },

    start() {
        this.enabled = true
        $('#action-btn').text('抽奖中，点击停止')
        this.do();
    },
    stop(){
        this.enabled = false
        $('#action-btn').text('开始抽奖')
    },

    init() {
        $('.lucky-top').append(`<button id="action-btn" class="load-more" type="button" style="margin: 0;width: 166px">开始抽奖</button>`)

        $('#action-btn').click(()=>{
            this.enabled?this.stop():this.start()
        })
    }
}

luckydraw.init()
})();

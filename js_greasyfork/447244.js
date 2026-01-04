// ==UserScript==
// @name         快速解析
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @license      MIT
// @description  The interface is collected by the network and not captured by the user The oil monkey script written by Vue is easy to understand. The interface is collected by the network and not crawled by yourself
// @include           *://*.youku.com/v_*
// @include           *://*.iqiyi.com/v_*
// @include           *://*.iqiyi.com/w_*
// @include           *://*.iqiyi.com/a_*
// @include           *://*.le.com/ptv/vplay/*
// @include           *://v.qq.com/x/cover/*
// @include           *://v.qq.com/x/page/*
// @include           *://v.qq.com/tv/*
// @include           *://*.tudou.com/listplay/*
// @include           *://*.tudou.com/albumplay/*
// @include           *://*.tudou.com/programs/view/*
// @include           *://*.mgtv.com/b/*
// @include           *://film.sohu.com/album/*
// @include           *://tv.sohu.com/v/*
// @include           *://*.baofeng.com/play/*
// @include           *://vip.pptv.com/show/*
// @include           *://v.pptv.com/show/*
// @include           *://www.le.com/ptv/vplay/*
// @include           *://www.wasu.cn/Play/show/*
// @include           *://*.1905.com/video/*
// @include           *://*.1905.com/play/*
// @include           *://*.1905.com/*/play/*
// @include           *://www.miguvideo.com/mgs/*
//---------------------------------------------------
// @include           *://m.v.qq.com/x/cover/*
// @include           *://m.v.qq.com/x/page/*
// @include           *://m.v.qq.com/*
// @include           *://m.iqiyi.com/v_*
// @include           *://m.iqiyi.com/w_*
// @include           *://m.iqiyi.com/a_*
// @include           *://m.youku.com/alipay_video/*
// @include           *://https://m.youku.com/video/id_*
// @include           *://m.mgtv.com/b/*
// @include           *://m.tv.sohu.com/v/*
// @include           *://m.film.sohu.com/album/*
// @include           *://m.le.com/ptv/vplay/*
// @include           *://m.pptv.com/show/*
// @include           *://m.acfun.cn/v/*
// @include           *://m.bilibili.com/video/*
// @include           *://m.bilibili.com/anime/*
// @include           *://m.bilibili.com/bangumi/play/*
// @include           *://m.wasu.cn/Play/show/*
//---------------------------------------------------
// @include           *://www.youtube.com
// @include           *://www.youtube.com/
// @include           *://www.youtube.com/watch*
// @include           *://www.facebook.com/*
// @include           *://yt1s.com/facebook-downloader
// @original-script   https://greasyfork.org/zh-CN/scripts/447245-%E5%BF%AB%E9%80%9F%E8%A7%A3%E6%9E%90
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==、
// @require      https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447244/%E5%BF%AB%E9%80%9F%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/447244/%E5%BF%AB%E9%80%9F%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==
 
;(function () {
  "use strict"
 
  let script = document.createElement("script")
  script.setAttribute("type", "text/javascript")
  script.src = "https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"
  document.documentElement.appendChild(script)
 
  window.onload = () => {
    let text = `
    <div id="fastParsing">
      <button
        @click="showModel"
        v-show="!isModel"
        style="
          position: fixed;
          padding: 5px 0px;
          top: 30vh;
          text-align: center;
          color: #3582fb;
          border: 1px solid #d7e6fe;
          background-color: #fff;
          border-radius: 4px;
          transition: 0.3s all ease;
          box-shadow: rgb(61 61 61 / 25%) 0px 0px 10px;
          left: 0px;
          background: rgb(255, 255, 255);
          text-align: center;
          z-index: 99999;
          cursor: pointer;
        "
      >
        快速解析
      </button>
      <div
        ref="wapper"
        v-show="isModel"
        style="
          position: fixed;
          padding: 5px 0;
          top: 30vh;
          overflow: hidden;
          box-shadow: 0 0 10px rgb(61 61 61 / 25%);
          left: 0;
          background: #fff;
          text-align: center;
          width: 30vw;
          z-index: 99999;
        "
      >
        <h1 style="font-size: initial; font-weight: bold">快速解析 v1.0.0</h1>
        <p style="margin: 5px">
          注：请在视频播放页面点击解析,解析失败切换源试试🌹
        </p>
        <span
          style="
            position: absolute;
            top: 0;
            right: 0;
            padding: 5px;
            width: 20px;
            height: 20px;
            line-height: 20px;
            color: #000;
            cursor: pointer;
            font-weight: bold;
            text-align: center;
          "
          @click.stop="onClose"
          >X</span
        >
        <div>
          <button
            style="
              margin: 3px;
              height: 30px;
              line-height: 30px;
              text-align: center;
              color: #3582fb;
              cursor: pointer;
              border: 1px solid #d7e6fe;
              background-color: #fff;
              border-radius: 4px;
              transition: 0.3s all ease;
            "
            v-for="(item,index) in originalInterfaceList"
            @click="parseVideo(item.url)"
            :key="item.name+index"
          >
            {{ item.name }}
          </button>
        </div>
      </div>
    </div>`
 
    const originalInterfaceList = [
      { name: "纯净/B站", url: "https://z1.m1907.cn/?jx=", showType: 3 },
      { name: "高速接口", url: "https://jsap.attakids.com/?url=", showType: 3 },
      {
        name: "综合/B站",
        url: "https://vip.parwix.com:4433/player/?url=",
        showType: 3,
      },
      { name: "OK解析", url: "https://okjx.cc/?url=", showType: 3 },
      { name: "夜幕", url: "https://www.yemu.xyz/?url=", showType: 3 },
      { name: "爱豆", url: "https://jx.aidouer.net/?url=", showType: 1 },
      { name: "虾米", url: "https://jx.xmflv.com/?url=", showType: 1 },
      { name: "M3U8.TV", url: "https://jx.m3u8.tv/jiexi/?url=", showType: 3 },
      { name: "人人迷", url: "https://jx.blbo.cc:4433/?url=", showType: 3 },
      { name: "全民", url: "https://jx.blbo.cc:4433/?url=", showType: 3 },
      { name: "七哥", url: "https://jx.mmkv.cn/tv.php?url=", showType: 3 },
      { name: "冰豆", url: "https://api.qianqi.net/vip/?url=", showType: 3 },
      { name: "迪奥", url: "https://123.1dior.cn/?url=", showType: 1 },
      { name: "CK", url: "https://www.ckplayer.vip/jiexi/?url=", showType: 1 },
      { name: "游艺", url: "https://api.u1o.net/?url=", showType: 1 },
      { name: "LE", url: "https://lecurl.cn/?url=", showType: 1 },
      { name: "ckmov", url: "https://www.ckmov.vip/api.php?url=", showType: 1 },
      {
        name: "playerjy/B站",
        url: "https://jx.playerjy.com/?url=",
        showType: 3,
      },
      {
        name: "ccyjjd",
        url: "https://ckmov.ccyjjd.com/ckmov/?url=",
        showType: 1,
      },
      { name: "爱豆", url: "https://jx.aidouer.net/?url=", showType: 1 },
      { name: "诺诺", url: "https://www.ckmov.com/?url=", showType: 1 },
      { name: "H8", url: "https://www.h8jx.com/jiexi.php?url=", showType: 1 },
      { name: "BL", url: "https://vip.bljiex.com/?v=", showType: 1 },
      { name: "解析la", url: "https://api.jiexi.la/?url=", showType: 1 },
      { name: "MUTV", url: "https://jiexi.janan.net/jiexi/?url=", showType: 1 },
      { name: "MAO", url: "https://www.mtosz.com/m3u8.php?url=", showType: 1 },
      {
        name: "老板",
        url: "https://vip.laobandq.com/jiexi.php?url=",
        showType: 1,
      },
      {
        name: "盘古",
        url: "https://www.pangujiexi.cc/jiexi.php?url=",
        showType: 1,
      },
      { name: "盖世", url: "https://www.gai4.com/?url=", showType: 1 },
      { name: "小蒋", url: "https://www.kpezp.cn/jlexi.php?url=", showType: 1 },
      { name: "YiTV", url: "https://jiexi.us/?url=", showType: 1 },
      { name: "星空", url: "http://60jx.com/?url=", showType: 1 },
      { name: "0523", url: "https://go.yh0523.cn/y.cy?url=", showType: 1 },
      {
        name: "17云",
        url: "https://www.1717yun.com/jx/ty.php?url=",
        showType: 1,
      },
      { name: "4K", url: "https://jx.4kdv.com/?url=", showType: 1 },
      {
        name: "云析",
        url: "https://jx.yparse.com/index.php?url=",
        showType: 1,
      },
      { name: "8090", url: "https://www.8090g.cn/?url=", showType: 1 },
      { name: "江湖", url: "https://api.jhdyw.vip/?url=", showType: 1 },
      { name: "诺讯", url: "https://www.nxflv.com/?url=", showType: 1 },
      {
        name: "PM",
        url: "https://www.playm3u8.cn/jiexi.php?url=",
        showType: 1,
      },
      { name: "奇米", url: "https://qimihe.com/?url=", showType: 1 },
      { name: "思云", url: "https://jx.ap2p.cn/?url=", showType: 1 },
      { name: "听乐", url: "https://jx.dj6u.com/?url=", showType: 1 },
      { name: "aijx", url: "https://jiexi.t7g.cn/?url=", showType: 1 },
      { name: "52", url: "https://vip.52jiexi.top/?url=", showType: 1 },
      { name: "黑米", url: "https://www.myxin.top/jx/api/?url=", showType: 1 },
      { name: "豪华啦", url: "https://api.lhh.la/vip/?url=", showType: 1 },
      { name: "凉城", url: "https://jx.mw0.cc/?url=", showType: 1 },
      { name: "33t", url: "https://www.33tn.cn/?url=", showType: 1 },
      { name: "180", url: "https://jx.000180.top/jx/?url=", showType: 1 },
      {
        name: "无名",
        url: "https://www.administratorw.com/video.php?url=",
        showType: 1,
      },
      { name: "黑云", url: "https://jiexi.380k.com/?url=", showType: 1 },
      { name: "九八", url: "https://jx.youyitv.com/?url=", showType: 1 },
      { name: "听乐(B站)", url: "https://jx.dj6u.com/?url=", showType: 2 },
    ]
 
    var el = document.createElement("div")
    el.innerHTML = text
    document.body.append(el)
 
    new Vue({
      el: "#fastParsing",
      data: {
        isModel: false,
        originalInterfaceList,
      },
      mounted() {},
      methods: {
        parseVideo(url) {
          window.open(url + location.href)
        },
        showModel() {
          this.isModel = true
          this.$refs.wapper.style.width = "30vw"
        },
        onClose() {
          this.isModel = false
          this.$refs.wapper.style.width = "0vw"
        },
      },
    })
  }
})()
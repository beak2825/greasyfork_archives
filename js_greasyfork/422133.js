// ==UserScript==
// @name         江湖百宝囊丨视频解析
// @namespace    http://tampermonkey.net/
// @version      2.1.0
// @author       Shaw
// @license      MIT
// @icon         data:image/png;base64,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RVh0ZGF0ZTpjcmVhdGUAMjAyMC0wNy0xOVQwMzozOToxNyswMDowMM1PNzEAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTktMDEtMDhUMTc6MDM6NTErMDA6MDDkYuNZAAAAIHRFWHRzb2Z0d2FyZQBodHRwczovL2ltYWdlbWFnaWNrLm9yZ7zPHZ0AAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADEyOEN8QYAAAAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgAMTI40I0R3QAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxNTQ2OTY3MDMxtaqH4gAAABJ0RVh0VGh1bWI6OlNpemUAMjQ1MDFCkfLHJAAAAFh0RVh0VGh1bWI6OlVSSQBmaWxlOi8vL2RhdGEvd3d3cm9vdC93d3cuZWFzeWljb24ubmV0L2Nkbi1pbWcuZWFzeWljb24uY24vZmlsZXMvNTMvNTM0Mzg2LnBuZzXRIHgAAAAASUVORK5CYII=
// @description  提供国内常用视频网站vip解析、付费点播服务，仅供技术学习、交流研究使用，勿作他用。『条件允许的情况下，请支持正版』
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.min.js
// @match        https://v.qq.com/x/c*
// @match        https://www.iqiyi.com/v*
// @match        https://v.youku.com/v*
// @match        https://www.mgtv.com/b*
// @match        https://tv.sohu.com/v*
// @match        https://www.bilibili.com/bangumi*
// @downloadURL https://update.greasyfork.org/scripts/422133/%E6%B1%9F%E6%B9%96%E7%99%BE%E5%AE%9D%E5%9B%8A%E4%B8%A8%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/422133/%E6%B1%9F%E6%B9%96%E7%99%BE%E5%AE%9D%E5%9B%8A%E4%B8%A8%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    "use strict";

    let vList = [
        "https://v.qq.com/x",
        "https://www.iqiyi.com/v",
        "https://v.youku.com/v",
        "https://www.mgtv.com/b",
        "https://tv.sohu.com/v",
        "https://www.bilibili.com/bangumi",
    ];
    let xList = [
        "https://vip.parwix.com:4433/player/?url=",
        "https://www.h8jx.com/jiexi.php?url=",
        "https://z1.m1907.cn/?jx=",
        "https://jx.aidouer.net/?url=",
        "https://api.qianqi.net/vip/?url=",
        "https://www.gai4.com/?url=",
        "https://www.ckmov.vip/api.php?url=",
        "https://ckmov.ccyjjd.com/ckmov/?url=",
        "https://api.jiexi.la/?url=",
        "https://lecurl.cn/?url=",
        "https://vip.laobandq.com/jiexi.php?url=",
        "https://api.leduotv.com/wp-api/ifr.php?isDp=1&vid=",
        "https://www.mtosz.com/m3u8.php?url=",
        "https://jx.m3u8.tv/jiexi/?url=",
        "https://www.ckmov.com/?url=",
        "https://www.nxflv.com/?url=",
        "https://okjx.cc/?url=",
        "https://www.playm3u8.cn/jiexi.php?url=",
        "https://www.pangujiexi.cc/jiexi.php?url=",
        "https://qimihe.com/?url=",
        "https://jx.blbo.cc:4433/?url=",
        "https://jx.rdhk.net/?v=",
        "https://jx.ap2p.cn/?url=",
        "https://jsap.attakids.com/?url=",
        "https://jx.vodjx.top/vip/?url=",
        "https://jx.dj6u.com/?url=",
        "https://jx.ivito.cn/?url=",
        "https://jx.xmflv.com/?url=",
        "https://www.kpezp.cn/jlexi.php?url=",
        "https://sb.5gseo.net/?url=",
        "https://jx.yparse.com/index.php?url=",
        "https://go.yh0523.cn/y.cy?url=",
        "https://www.1717yun.com/jx/ty.php?url=",
        "https://jx.4kdv.com/?url=",
        "https://www.8090g.cn/?url="
    ];
    let vipJX = getVal("vipJX", xList[0]);
    let { href, width = "90px" } = location;
    let css =
`
    .s-list,
    .s-list * {
      margin: 0;
      padding: 0;
      font: 14px Arial, Helvetica, sans-serif !important;
      text-decoration: none !important;
      list-style: none !important;
      box-sizing: content-box !important;
      -webkit-font-smoothing: subpixel-antialiased !important;
    }

    .s-list {
      position: fixed;
      left: 0;
      top: 50%;
      z-index: 999999;
      width: ${width};
      border-radius: 0 4px 4px 0;
      transform: translate3d(-100%, -50%, 0);
      transition: 0.3s;
      background: #272931;
    }

    .s-list:hover {
      transform: translate3d(0, -50%, 0);
    }

    .s-item {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 36px;
      color: #09aaff !important;
    }

    .s-item:nth-of-type(n + 2)::before {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      border-top: 1px solid #1d212a;
    }

    .s-title {
      position: absolute;
      right: 0;
      top: 50%;
      width: 1.5em;
      padding: 5px 2px;
      text-align: center;
      color: #fff;
      cursor: auto;
      user-select: none;
      border-radius: 0 4px 4px 0;
      transform: translate3d(100%, -50%, 0);
      background: #fc4273;
    }

    .s-dot::after {
      content: "";
      position: absolute;
      right: 0;
      top: 50%;
      border: 6px solid transparent;
      border-right-color: #0e6;
      transform: translate3d(0, -50%, 0);
    }

    .s-tips {
      font-size: 13px !important;
      color: #e9b15e !important;
      user-select: none;
    }

    .s-box {
      position: relative;
      overflow: hidden;
      border-bottom-right-radius: 4px;
      background: #272931;
    }

    .s-ul {
      max-height: 72px;
      margin-right: -2em;
      overflow: auto;
      cursor: pointer;
    }

    .s-li {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: ${width};
      height: 36px;
      color: #09aaff !important;
    }

    .s-box::before,
    .s-li::before {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      border-top: 1px solid #1d212a;
    }
`;

    // ------ 本地存储封装 ------
    function setVal(key, val, storage = localStorage) {
        if (typeof val !== "undefined" && typeof storage === "object" && typeof storage.setItem === "function") {
            storage.setItem(key, JSON.stringify(val));
        }
    }

    function getVal(key, def = undefined, storage = localStorage) {
        if (typeof storage === "object" && typeof storage.getItem === "function") {
            let res = JSON.parse(storage.getItem(key));
            return res !== null ? res : def;
        }
    }

    function delVal(key, storage = localStorage) {
        if (typeof storage === "object" && typeof storage.removeItem === "function") {
            if (typeof key !== "string" && typeof storage.clear === "function") {
                return storage.clear();
            }
            storage.removeItem(key);
        }
    }

    // ------ VIP视频解析 ------
    if (vList.some((item) => href.startsWith(item))) {
        let vm = {};
        let oDiv = document.createElement("div");
        document.querySelector("body").appendChild(oDiv);
        let oStyle = document.createElement("style");
        document.querySelector("body").appendChild(oStyle).innerHTML = css;
        /* global Vue */
        new Vue({
            el: oDiv,
            template:
`
            <div class="s-list">
              <div class="s-title">解析</div>
              <a class="s-item" :href="vipJX" @mouseover="handleClick(currIndex)">本窗观看</a>
              <a class="s-item" :href="vipJX" target="_blank" @mouseover="handleClick(currIndex)">新窗观看</a>
              <template v-if="xList.length > 0">
                <div class="s-item s-tips">{{xList.length + "条可选线路"}}</div>
                <div class="s-box">
                  <ul class="s-ul" ref="ul">
                    <li class="s-li" :class="{'s-dot': currIndex === i}" v-for="(item, i) in xList" :key="i" @click="handleClick(i)">{{handleText(i)}}</li>
                  </ul>
                </div>
              </template>
            </div>
`,
            data() {
                vm = this;
                return {
                    vipJX,
                    xList,
                    currIndex: xList.indexOf(vipJX) > -1 ? xList.indexOf(vipJX) : 0
                };
            },
            methods: {
                handleClick(index) {
                    href = location.href.split("?")[0];
                    // 解决youku点击添加参数bug
                    href.startsWith("https://v.youku.com/") && (href = location.href);
                    setVal("vipJX", xList[vm.currIndex = index]);
                    vm.vipJX = xList[index] + href;
                },
                handleText(index) {
                    return `线路${String(index + 1).padStart(2, 0)}`;
                }
            },
            mounted() {
                let [li] = vm.$refs.ul.children;
                vm.$refs.ul.scrollTop = li.clientHeight * vm.currIndex;
            }
        });
    }
})();

// ==UserScript==
// @name         切换网站脚本
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @exclude       *://open.weixin.qq.com/*

// @version     1.6.8
// @grant       GM_info
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @grant       GM_openInTab
// @grant       unsafeWindow
// @run-at      document-body
// @connect 101.42.169.162
// @connect api.cooluc.com
// @connect apis.jxcxin.cn
// @connect 8.140.241.3:9800
// @connect eeapi.cn
// @author      zhizhu

// @description 上下左右切换网站
// @downloadURL https://update.greasyfork.org/scripts/478846/%E5%88%87%E6%8D%A2%E7%BD%91%E7%AB%99%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/478846/%E5%88%87%E6%8D%A2%E7%BD%91%E7%AB%99%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

// eslint-disable-next-line no-undef

(function () {
  "use strict";

  // let img = document.createElement("img");
  // img.src = "https://ccc.hd-r.cn/b36c33c1b24364009cd697457f474b36.png";
  // img.classList.add("img_cover");
  // document.body.appendChild(img);
  // GM_addStyle(
  //   ".img_cover{width:100vw; height:101vh;width: 98vw;height: 117vh;position: fixed;left: 0;top: -4%;z-index: 99999999999;}"
  // );

  // var videoInterval = setInterval(() => {
  //   if (document.querySelector("video")) {
  //     document.querySelector("video").addEventListener("play", () => {
  //       document.querySelector(".img_cover").style.display = "none";
  //       GM_addStyle(".img_cover{display:none}");
  //     });
  //     clearInterval(videoInterval);
  //     videoInterval = null;
  //   }
  // }, 100);

  // setTimeout(() => {
  //   document.querySelector(".img_cover").style.display = "none";
  // }, 6000);

  if (
    new RegExp("tv.shouchangsheng.com").test(window.location.origin) &&
    new RegExp("code%3D").test(window.location.href)
  ) {
    console.log(111);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      code: "021uUN0w3g7dY13Oeb2w3HsoFM2uUN0E",
    });
    GM_xmlhttpRequest({
      method: "POST",
      url: `http://8.140.241.3:9800/api/login?code=${
        window.location.href.split("%3D")[1].split("%26")[0]
      }`,

      onload: function (response) {
        console.log(JSON.parse(response.responseText));
        if (JSON.parse(response.responseText).code == 200) {
          GM_setValue("user", 1);
          GM_setValue("response", response.responseText);
          window.history.go(-3);
        } else {
          console.log("登陆失败");
          alert("登陆失败");

          window.history.go(-2);
        }
      },
    });
  }

  if (
    new RegExp("tv.shouchangsheng.com").test(window.location.origin) &&
    new RegExp("code=").test(window.location.href)
  ) {
    console.log(111);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      code: "021uUN0w3g7dY13Oeb2w3HsoFM2uUN0E",
    });
    GM_xmlhttpRequest({
      method: "POST",
      url: `http://8.140.241.3:9800/api/login?code=${
        window.location.href.split("code=")[1].split("&")[0]
      }`,

      onload: function (response) {
        console.log(JSON.parse(response.responseText));
        if (JSON.parse(response.responseText).code == 200) {
          GM_setValue("user", 1);
          GM_setValue("response", response.responseText);
          window.history.go(-3);
        } else {
          console.log("登陆失败");
          alert("登陆失败");

          window.history.go(-2);
        }
      },
    });
  }

  setTimeout(() => {
    if (
      new RegExp("douyinvod").test(window.location.href) ||
      new RegExp(".kwimgs.com").test(window.location.href)
    ) {
      for (let i = 0; i < 10; i++) {
        let a = document.createElement("a");
        document.body.appendChild(a);
      }
      document.querySelector("video").addEventListener("ended", () => {
        setTimeout(() => {
          document
            .querySelector(".box_main")
            .shadowRoot.querySelectorAll(".bm_btn")[1]
            .click();
        }, 1000);
      });
    }
  }, 2000);
  setTimeout(() => {
    if (top.location != self.location) {
      return;
    }

    let index = 0;

    if (GM_getValue("index")) {
      index = GM_getValue("index");
      console.log(index);
    }

    let webHrefArray = [];
    if (GM_getValue("webHrefArray")) {
      webHrefArray = JSON.parse(GM_getValue("webHrefArray"));
      console.log(JSON.parse(GM_getValue("webHrefArray")));
    }

    let lastHref;
    let focusIndexX = 0;
    let focusIndexY = 0;

    if (GM_getValue("lastHref")) {
      lastHref = GM_getValue("lastHref");
    }
    let imgUrl = [
      "https://i.hd-r.cn/3ec7a63f81b4db1272a809c51a5df4dc.png",
      "https://i.hd-r.cn/b5df0b2065bc85929327e15a1024a7f9.png",
      "https://i.hd-r.cn/dc6909c90660c9103cfa718093ca51d5.png",
      "https://i.hd-r.cn/fadb1431254452fe499642cbe2661334.png",
      "https://i.hd-r.cn/f7a04beccfb74ef00de6748e5965df0e.png",
      "https://i.hd-r.cn/44e77d9f81a26b82abe583f30e14ba59.png",
    ];

    GM_setValue("lastHref", window.location.href);

    var mainBox = document.createElement("div");
    mainBox.classList.add("box_main", "background");

    mainBox.style.display = "block";

    document.body.appendChild(mainBox);
    const shadow = mainBox.attachShadow({ mode: "open" });

    GM_addStyle(
      ".background{ bottom: 20%;right: 5%; text-align:left;    display: block;width: 100vw;height: 100vh;left: 0;top: 0;background: gray;}"
    );

    GM_addStyle(".box_main{position: fixed; z-index: 999999999999;}");
    GM_addStyle("body{text-align: unset !important;}");

    shadow.innerHTML += `
    <div class="pop_main">
      <button class="weixin_login">微信扫码登陆</button>
    </div>

    <div class = "pop_load">
      <div>本页操作提示:10s</div>
      <div class = "img_box">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="45px" height="45px" viewBox="0 0 68 68" version="1.1">
              <title>上一个</title>
              <g id="最终版4" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="5播放影视" transform="translate(-1822, -501)" fill="#FFFFFF" fill-rule="nonzero">
                      <g id="编组-2" transform="translate(1792, 451)">
                          <g id="进入箭头小" transform="translate(64, 84) scale(1, -1) rotate(90) translate(-64, -84)translate(30, 50)">
                              <rect id="矩形" opacity="0" x="0" y="0" width="68" height="68"/>
                              <path d="M34,68 C15.2235,68 0,52.7765 0,34 C0,15.2235 15.2235,0 34,0 C52.7765,0 68,15.2235 68,34 C68,52.7765 52.7765,68 34,68 Z M43.2592177,35.4444574 L43.3546187,35.3536928 L45,33.7083115 L26.9727523,15.6764275 C26.0621136,14.7745242 24.5949195,14.7745242 23.6842807,15.6764275 C23.2462775,16.1119476 23,16.7041319 23,17.3218087 C23,17.9394855 23.2462775,18.5316699 23.6842807,18.96719 L38.4160749,33.7036751 L23.6842807,48.4284874 C23.2464018,48.8636081 23,49.4554162 23,50.0727232 C23,50.6900302 23.2464018,51.2818384 23.6842807,51.716959 C24.5919268,52.6246051 26.0767791,52.6152777 26.9727523,51.71925 L43.2592177,35.4444574 Z" id="形状"/>
                          </g>
                      </g>
                  </g>
              </g>
          </svg>
          <div>遥控器上键:上一个</div>
        </div>

        <div>
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="45px" height="45px" viewBox="0 0 68 68" version="1.1">
              <title>下一个</title>
              <g id="最终版4" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="5播放影视" transform="translate(-1822, -599)" fill="#FFFFFF" fill-rule="nonzero">
                      <g id="编组-2" transform="translate(1792, 451)">
                          <g id="进入箭头小备份" transform="translate(64, 182) rotate(90) translate(-64, -182)translate(30, 148)">
                              <rect id="矩形" opacity="0" x="0" y="0" width="68" height="68"/>
                              <path d="M34,68 C15.2235,68 0,52.7765 0,34 C0,15.2235 15.2235,0 34,0 C52.7765,0 68,15.2235 68,34 C68,52.7765 52.7765,68 34,68 Z M43.2592177,35.4444574 L43.3546187,35.3536928 L45,33.7083115 L26.9727523,15.6764275 C26.0621136,14.7745242 24.5949195,14.7745242 23.6842807,15.6764275 C23.2462775,16.1119476 23,16.7041319 23,17.3218087 C23,17.9394855 23.2462775,18.5316699 23.6842807,18.96719 L38.4160749,33.7036751 L23.6842807,48.4284874 C23.2464018,48.8636081 23,49.4554162 23,50.0727232 C23,50.6900302 23.2464018,51.2818384 23.6842807,51.716959 C24.5919268,52.6246051 26.0767791,52.6152777 26.9727523,51.71925 L43.2592177,35.4444574 Z" id="形状"/>
                          </g>
                      </g>
                  </g>
              </g>
          </svg>
          <div>遥控器下键:下一个</div>
        </div>

        <div>
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="45px" height="45px" viewBox="0 0 68 68" version="1.1">
              <title>喜欢</title>
              <g id="最终版4" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g  transform="translate(-1822, -697)" fill="#F0F0F0" fill-rule="nonzero" >
                      <g id="编组-2" transform="translate(1792, 451)">
                          <g id="喜欢-fill" transform="translate(30, 246)">
                              <rect id="矩形" opacity="0" x="0" y="0" width="68" height="68"/>
                              <path d="M49.9249112,9 C45.5328903,9 41.3587338,10.6523953 38.170767,13.6721256 C37.8611702,13.956987 36.2557203,15.5751989 35.0171998,16.8286556 L31.8636327,13.706309 C28.6756659,10.6751842 24.4900428,9 20.0636223,9 C10.648787,9 3,16.6121609 3,25.9563458 C3,31.4147553 5.74070478,35.5170917 8.10301351,38.0468603 L29.2261268,59.2537367 C30.900376,60.9174602 32.75809,62 35.0057333,62 C37.2533765,62 39.1110905,60.9174602 40.7853397,59.2537367 L61.8969865,38.0582547 L62.0460516,37.8987323 C64.5918251,34.7422022 67,31.7566553 67,25.9678065 C66.9885335,16.6121609 59.3282799,9 49.9249112,9 Z" id="路径"/>
                          </g>
                      </g>
                  </g>
              </g>
          </svg>
          <div>遥控器左键:喜欢</div>
        </div>

        <div>
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="45px" height="45px" viewBox="0 0 68 68" version="1.1">
              <title>不喜欢</title>
              <g id="最终版4" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g transform="translate(-1822, -795)" fill="#F0F0F0" fill-rule="nonzero">
                      <g id="编组-2" transform="translate(1792, 451)">
                          <g id="爱心_破裂" transform="translate(30, 344)">
                              <rect id="矩形" opacity="0" x="0" y="0" width="68" height="68"/>
                              <path d="M47.3614237,7 C44.7422499,7 42.1609761,7.53033251 39.8075031,8.5203321 L34.8727563,18.1374177 L42.5405772,23.0874156 L31.949915,35.1440432 L35.5181247,44.7258272 L28.6095059,34.9319226 L36.5809276,24.6077477 L28.4956056,21.178144 L33.9617538,12.4096029 C30.5074444,8.98006133 25.6865979,7.03536379 20.6000507,7.03536379 C10.4649898,7 2.18983388,14.7785416 2,24.4309288 L2,24.9613235 C2.03796678,29.4516543 3.82200493,33.6590749 7.04858042,36.9119218 C7.12451397,36.9826494 7.16248075,37.053377 7.23834758,37.1240424 L7.50411501,37.3715889 L31.1147793,58.903909 C31.8739814,59.6110605 32.8988842,60 33.9997206,60 C35.1005569,60 36.1634265,59.5756967 36.9605286,58.8685453 C37.7197307,58.2321214 56.2818813,41.4022527 60.5713264,37.3715889 L60.6092265,37.336163 L60.7610936,37.1594062 C64.1394027,33.80053 66.0374079,29.345563 66,24.7491407 C66,14.9906621 57.6484184,7 47.3614237,7 Z" id="路径"/>
                          </g>
                      </g>
                  </g>
              </g>
          </svg>
          <div>遥控器右键:不喜欢</div>
        </div>
      </div>

    </div>


    <img class="bm_ball ball_inactive" src="https://s11.ax1x.com/2023/12/18/piIertg.png" alt="">


    <div class="pop_minor">

    <div class="bm_btn">
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="45px" height="45px" viewBox="0 0 68 68" version="1.1">
        <title>上一个</title>
        <g id="最终版4" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="5播放影视" transform="translate(-1822, -501)" fill="#FFFFFF" fill-rule="nonzero">
                <g id="编组-2" transform="translate(1792, 451)">
                    <g id="进入箭头小" transform="translate(64, 84) scale(1, -1) rotate(90) translate(-64, -84)translate(30, 50)">
                        <rect id="矩形" opacity="0" x="0" y="0" width="68" height="68"/>
                        <path d="M34,68 C15.2235,68 0,52.7765 0,34 C0,15.2235 15.2235,0 34,0 C52.7765,0 68,15.2235 68,34 C68,52.7765 52.7765,68 34,68 Z M43.2592177,35.4444574 L43.3546187,35.3536928 L45,33.7083115 L26.9727523,15.6764275 C26.0621136,14.7745242 24.5949195,14.7745242 23.6842807,15.6764275 C23.2462775,16.1119476 23,16.7041319 23,17.3218087 C23,17.9394855 23.2462775,18.5316699 23.6842807,18.96719 L38.4160749,33.7036751 L23.6842807,48.4284874 C23.2464018,48.8636081 23,49.4554162 23,50.0727232 C23,50.6900302 23.2464018,51.2818384 23.6842807,51.716959 C24.5919268,52.6246051 26.0767791,52.6152777 26.9727523,51.71925 L43.2592177,35.4444574 Z" id="形状"/>
                    </g>
                </g>
            </g>
        </g>
    </svg>
  </div>

  <div class="bm_btn" style = "margin-top:10px">
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="45px" height="45px" viewBox="0 0 68 68" version="1.1">
        <title>下一个</title>
        <g id="最终版4" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="5播放影视" transform="translate(-1822, -599)" fill="#FFFFFF" fill-rule="nonzero">
                <g id="编组-2" transform="translate(1792, 451)">
                    <g id="进入箭头小备份" transform="translate(64, 182) rotate(90) translate(-64, -182)translate(30, 148)">
                        <rect id="矩形" opacity="0" x="0" y="0" width="68" height="68"/>
                        <path d="M34,68 C15.2235,68 0,52.7765 0,34 C0,15.2235 15.2235,0 34,0 C52.7765,0 68,15.2235 68,34 C68,52.7765 52.7765,68 34,68 Z M43.2592177,35.4444574 L43.3546187,35.3536928 L45,33.7083115 L26.9727523,15.6764275 C26.0621136,14.7745242 24.5949195,14.7745242 23.6842807,15.6764275 C23.2462775,16.1119476 23,16.7041319 23,17.3218087 C23,17.9394855 23.2462775,18.5316699 23.6842807,18.96719 L38.4160749,33.7036751 L23.6842807,48.4284874 C23.2464018,48.8636081 23,49.4554162 23,50.0727232 C23,50.6900302 23.2464018,51.2818384 23.6842807,51.716959 C24.5919268,52.6246051 26.0767791,52.6152777 26.9727523,51.71925 L43.2592177,35.4444574 Z" id="形状"/>
                    </g>
                </g>
            </g>
        </g>
    </svg>
  </div>

  <div class="bm_btn">
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="45px" height="45px" viewBox="0 0 68 68" version="1.1">
        <title>喜欢</title>
        <g id="最终版4" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="like" transform="translate(-1822, -697)" fill="#F0F0F0" fill-rule="nonzero" >
                <g id="编组-2" transform="translate(1792, 451)">
                    <g id="喜欢-fill" transform="translate(30, 246)">
                        <rect id="矩形" opacity="0" x="0" y="0" width="68" height="68"/>
                        <path d="M49.9249112,9 C45.5328903,9 41.3587338,10.6523953 38.170767,13.6721256 C37.8611702,13.956987 36.2557203,15.5751989 35.0171998,16.8286556 L31.8636327,13.706309 C28.6756659,10.6751842 24.4900428,9 20.0636223,9 C10.648787,9 3,16.6121609 3,25.9563458 C3,31.4147553 5.74070478,35.5170917 8.10301351,38.0468603 L29.2261268,59.2537367 C30.900376,60.9174602 32.75809,62 35.0057333,62 C37.2533765,62 39.1110905,60.9174602 40.7853397,59.2537367 L61.8969865,38.0582547 L62.0460516,37.8987323 C64.5918251,34.7422022 67,31.7566553 67,25.9678065 C66.9885335,16.6121609 59.3282799,9 49.9249112,9 Z" id="路径"/>
                    </g>
                </g>
            </g>
        </g>
    </svg>
  </div>

  <div class="bm_btn">
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="45px" height="45px" viewBox="0 0 68 68" version="1.1">
        <title>不喜欢</title>
        <g id="最终版4" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="dislike" transform="translate(-1822, -795)" fill="#F0F0F0" fill-rule="nonzero">
                <g id="编组-2" transform="translate(1792, 451)">
                    <g id="爱心_破裂" transform="translate(30, 344)">
                        <rect id="矩形" opacity="0" x="0" y="0" width="68" height="68"/>
                        <path d="M47.3614237,7 C44.7422499,7 42.1609761,7.53033251 39.8075031,8.5203321 L34.8727563,18.1374177 L42.5405772,23.0874156 L31.949915,35.1440432 L35.5181247,44.7258272 L28.6095059,34.9319226 L36.5809276,24.6077477 L28.4956056,21.178144 L33.9617538,12.4096029 C30.5074444,8.98006133 25.6865979,7.03536379 20.6000507,7.03536379 C10.4649898,7 2.18983388,14.7785416 2,24.4309288 L2,24.9613235 C2.03796678,29.4516543 3.82200493,33.6590749 7.04858042,36.9119218 C7.12451397,36.9826494 7.16248075,37.053377 7.23834758,37.1240424 L7.50411501,37.3715889 L31.1147793,58.903909 C31.8739814,59.6110605 32.8988842,60 33.9997206,60 C35.1005569,60 36.1634265,59.5756967 36.9605286,58.8685453 C37.7197307,58.2321214 56.2818813,41.4022527 60.5713264,37.3715889 L60.6092265,37.336163 L60.7610936,37.1594062 C64.1394027,33.80053 66.0374079,29.345563 66,24.7491407 C66,14.9906621 57.6484184,7 47.3614237,7 Z" id="路径"/>
                    </g>
                </g>
            </g>
        </g>
    </svg>
  </div>



    </div>

    <style>
    .container{
      position: absolute;
      overflow-y: scroll;
    }
    .inner_container{
      height: 16vh;
      width: 80vw;
    }
    .menu{
        overflow: hidden;
        position: fixed;
        z-index: 9999999999999;
        top: 80%;
        left: 10%;
        height: 16vh;
        width: 80vw;
    }
    .menu a{
      font-size: 18px;
      text-align: center;
      margin-top: 10px;
      display: inline-block;
      height: 17px;
      width: 67px;
      line-height: 17px;
      background: rgba(83, 83, 83, 0.60);
      padding: 10px 10px;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      margin-left: 15px;
    }

    .img_box{
      width:500px;
      margin: 8vw 0 0 25vw;
    }
    .btn_intro{
      display:inline-block;
    }
    .img_box svg{
      width:55px;
      padding: 19px 6px;
      vertical-align: middle;
      background: #9E9E9E;
    }
    .img_box >div >div{
      display:inline-block;
      margin-left:100px;
    }

    .pop_load{
        display:none;
        z-index: 999;
        color: white;
        font-size:27px;
        font-weight: 700;
        padding: 10vh 14vw;
        width:100vw;
        height:100vh;
        position: fixed;
        left: 0;
        top: 0;
        background: #8c8c8c;

    }

    .pm_active{
      border: red solid 3px !important;
    }
    .bm_btn img{
      width:40px;
      margin-left:5px;
    }
    .bm_btn:not(:first-child) {
      margin-top:10px;
    }

    .pop_main {
        width: 340px;
        position: relative;
        left: 50%;
        transform: translate(-50%, -50%);
        top: 50%;
        padding: 40px;
        background: white;
    }

    .get_code {
        display: inline;
    }

    .pm_tel,
    .pm_code,
    .pm_login,
    .pm_tips {
        margin-top: 15px;
    }
    .pm_tips{
        height: 16px;
    }

    .pm_tel,
    .pm_code {
        font-size: 15px;
    }

    .pm_login {
        margin-left: 58px;
    }

    input {
        width: 140px;
        height: 20px;
        margin-left: 10px;
        border: black solid 1px;
    }

    .pm_login {
        width: 90px;
        height: 30px;
        background: white;
        border: 1px black solid;
        border-radius: 5px;
    }

    .get_code {
        margin-left: 15px;
        background: white;
        border: 1px black solid;
        border-radius: 5px;
        height: 30px;
    }

    .pop_minor {
        display:block;
        margin-top: 15px;
        padding:15px 5px;
        width:50px;
        position: fixed;
        padding: 25px 19px;
        right: 0;
        bottom: 30%;
        z-index: 999999999;

    }

    .pop_minor::before {
      border-radius: 20px 0px 0px 20px;
      content: "";
      position: absolute;
      backdrop-filter: blur(10px);
      z-index: -1;
      background: rgba(83, 83, 83, 0.60);
      width: 100%;
      height: 100%;
      top: 0px;
      left: 0px;
      background-size: cover;
      overflow:hidden;

    }

    .pop_minor div {
        font-size: 17px;
    }

    .pm_exit {
        width: 90px;
        height: 30px;
        background: white;
        border: 1px black solid;
        border-radius: 5px;
        margin-left: 30px;
        margin-top: 15px;
    }

    .ball_inactive{
      display:none;
      z-index: 999999999;
      width:80px;
      height:80px;
      position: fixed;
      right: -40px;
      top: 34%;
      opacity:0.7;
    }

    .ball_active{
        z-index: 999999999;
        width: 80px;
        height: 80px;
        position: fixed;
        right: 0;
        top: 34%;
    }

    </style>

`;
    let _document = document.querySelector(".box_main").shadowRoot;

    let menu = document.createElement("div");
    menu.classList.add("menu");
    _document.appendChild(menu);

    let currentSiteId;

    for (const item of webHrefArray) {
      if (
        new RegExp("https://www.ikdmjx.com").test(window.location.href) &&
        new RegExp(window.location.href.split("url=")[1]).test(item.menu)
      ) {
        currentSiteId = item.id;
        if (item.islike == true) {
          _document.querySelector("#like").style.fill = "#FF4D7D";
          _document.querySelector("#dislike").style.fill = "#FFFFFF";
        }
        if (item.islike == false) {
          _document.querySelector("#like").style.fill = "#FFFFFF";
          _document.querySelector("#dislike").style.fill = "#FF4D7D";
        }

        document.querySelector("title").innerHTML = item.title;

        console.log(item.menu);

        let container = document.createElement("div");
        container.classList.add("container");
        _document.querySelector("div.menu").appendChild(container);

        let innerContainer = document.createElement("div");
        innerContainer.classList.add("inner_container");
        container.appendChild(innerContainer);

        for (let i = 0; i < item.menu.split("#").length; i++) {
          console.log(item.menu.split("#")[i]);
          let menuItem = document.createElement("a");
          menuItem.target = "_self";
          menuItem.classList.add("menu_item");
          menuItem.href =
            "https://www.ikdmjx.com/?url=" +
            item.menu.split("#")[i].split("$")[1];
          menuItem.innerHTML = `第${i + 1}集`;
          innerContainer.appendChild(menuItem);
        }
      }

      if (
        new RegExp("douyinvod.com").test(window.location.href) &&
        (window.location.href == item || window.location.href == item.url)
      ) {
        currentSiteId = item.id;

        if (item.islike == true) {
          _document.querySelector("#like").style.fill = "#FF4D7D";
          _document.querySelector("#dislike").style.fill = "#FFFFFF";
        }
        if (item.islike == false) {
          _document.querySelector("#like").style.fill = "#FFFFFF";
          _document.querySelector("#dislike").style.fill = "#FF4D7D";
        }
      }
    }

    _document.querySelector(".weixin_login").onclick = () => {
      window.location.href =
        "https://open.weixin.qq.com/connect/qrconnect?appid=wx3a7bb2d38e6add8d&redirect_uri=http%3A%2F%2Ftv.shouchangsheng.com%2Factivity%2FsmallTVJXHH-B%2FsearchEms&response_type=code&scope=snsapi_login&state=123456#wechat_redirect";
    };

    let time = 0;
    var ballTimer = null;
    _document.querySelector(".bm_ball").addEventListener("mouseover", () => {
      console.log(343434);

      time = 0;
      clearInterval(ballTimer);
      ballTimer = null;
      _document.querySelector(".bm_ball").classList.remove("ball_inactive");
      _document.querySelector(".bm_ball").classList.add("ball_active");
    });

    _document.querySelector(".bm_ball").addEventListener("mouseleave", () => {
      ballTimer = setInterval(() => {
        time++;
        console.log(time, 6);
        if (time > 5) {
          _document.querySelector(".bm_ball").classList.add("ball_inactive");
          _document.querySelector(".bm_ball").classList.remove("ball_active");
          time = 0;
          clearInterval(ballTimer);
          ballTimer = null;
        }
      }, 1000);
    });

    _document.querySelector(".bm_ball").onclick = () => {
      if (
        _document.querySelector(".bm_ball").classList.contains("ball_active")
      ) {
        _document.querySelector(".pop_minor").style.display = "block";
        _document.querySelector(".bm_ball").style.display = "none";
        _document.querySelector(".menu").style.display = "block";
      }
    };

    document.addEventListener("mousedown", (e) => {
      let t = _document.querySelector(".pop_minor"); // 最外层元素
      let s = _document.querySelector(".bm_ball"); // 最外层元素

      if (!e.composedPath().includes(t) && !e.composedPath().includes(s)) {
        console.log(1);
        _document.querySelector(".bm_ball").style.display = "block";
        _document.querySelector(".bm_ball").classList.add("ball_inactive");
        _document.querySelector(".bm_ball").classList.remove("ball_active");
        _document.querySelector(".pop_minor").style.display = "none";
        setTimeout(() => {
          _document.querySelector(".menu").style.display = "none";
        }, 300);
      } else {
      }
    });

    let user;
    if (GM_getValue("user")) {
      user = JSON.parse(GM_getValue("response")).userInfo.id;
      if (
        document.title == "403 Forbidden" ||
        document.querySelectorAll("p[data-e2e='error-page']")[0]
      ) {
        arrowDown();
      }

      setTimeout(() => {
        if (
          document.title == "403 Forbidden" ||
          document.querySelectorAll("p[data-e2e='error-page']")[0]
        ) {
          arrowDown();
        }
      }, 1500);

      document.querySelector(".box_main").style.display = "none";
      setTimeout(() => {
        document.querySelector(".box_main").style.display = "block";
      }, 1200);
      _document.querySelector(".pop_main").style.display = "none";
      document.querySelector(".box_main").classList.remove("background");
    } else {
    }
    //点击登陆
    // _document.querySelector(".pm_login").onclick = () => {
    //   var myHeaders = new Headers();
    //   myHeaders.append("Content-Type", "application/json");

    //   var raw = JSON.stringify({
    //     username: _document.querySelector(".pm_tel input").value,
    //     password: _document.querySelector(".pm_code input").value,
    //   });

    //   GM_xmlhttpRequest({
    //     method: "POST",
    //     url: "http://101.42.169.162:5000/login",
    //     data: raw,
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     redirect: "follow",
    //     onload: function (response) {
    //       console.log(response, 665);

    //       if (
    //         response.responseText &&
    //         JSON.parse(response.responseText).msg == "登录成功!"
    //       ) {
    //         _document.querySelector(".pop_load").style.display = "block";

    //         let t = 0;
    //         let tipInterval = setInterval(() => {
    //           t++;
    //           _document.querySelector(
    //             ".pop_load > div:nth-child(1)"
    //           ).innerHTML = `本页操作提示:${10 - t}s`;
    //           if (t > 10) {
    //             _document.querySelector(".pop_load").style.display = "none";
    //             tipInterval = null;
    //             clearInterval(tipInterval);
    //           }
    //         }, 1000);

    //         GM_setValue("user", _document.querySelector(".pm_tel input").value);
    //         GM_setValue(
    //           "password",
    //           _document.querySelector(".pm_code input").value
    //         );

    //         _document.querySelector(".pop_main").style.display = "none";
    //         _document.querySelector(".pop_minor").style.display = "block";
    //         document.querySelector(".box_main").classList.remove("background");
    //       } else {
    //         _document.querySelector(".pm_tips").innerHTML = "验证码错误!";
    //       }
    //     },
    //   });
    // };
    //点击获取验证码
    // _document.querySelector(".get_code").onclick = () => {
    //   if (_document.querySelector(".pm_tel input").value.length == 11) {
    //     _document.querySelector(".get_code").innerHTML = "发送中";

    //     var myHeaders = new Headers();
    //     myHeaders.append("Content-Type", "application/json");

    //     var raw = JSON.stringify({
    //       username: _document.querySelector(".pm_tel input").value,
    //     });

    //     var requestOptions = {
    //       method: "POST",
    //       headers: myHeaders,
    //       body: raw,
    //       redirect: "follow",
    //     };
    //     GM_xmlhttpRequest({
    //       method: "POST",
    //       url: "http://101.42.169.162:5000/sendSMS",
    //       data: raw,
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       redirect: "follow",
    //       onload: function (response) {
    //         console.log(response.status);

    //         if (response.status == 200) {
    //           _document.querySelector(".get_code").disabled = true;
    //           var time = 59;
    //           var codeTimer = setInterval(() => {
    //             if (time == 0) {
    //               clearTimeout(codeTimer);
    //               _document.querySelector(".get_code").disabled = false;
    //               _document.querySelector(".pm_tips").innerHTML =
    //                 "未收到验证码，点击重新发送";

    //               _document.querySelector(".get_code").innerHTML = "重新发送";
    //             } else {
    //               _document.querySelector(
    //                 ".get_code"
    //               ).innerHTML = `重新发送(${time}s)`;
    //               time--;
    //             }
    //           }, 1000);
    //         }
    //       },
    //     });

    //     //   fetch("http://101.42.169.162:5000/sendSMS", requestOptions)
    //     //     .then((response) => response.text())
    //     //     .then((result) => {
    //     //       if (JSON.parse(result).msg == "发送成功!") {
    //     //         _document.querySelector(".get_code").disabled = true;
    //     //         var time = 59;
    //     //         var codeTimer = setInterval(() => {
    //     //           if (time == 0) {
    //     //             clearTimeout(codeTimer);
    //     //             _document.querySelector(".get_code").disabled = false;
    //     //             _document.querySelector(".pm_tips").innerHTML = "未收到验证码，点击重新发送";

    //     //             _document.querySelector(".get_code").innerHTML = "重新发送";
    //     //           } else {
    //     //             _document.querySelector(
    //     //               ".get_code"
    //     //             ).innerHTML = `重新发送(${time}s)`;
    //     //             time--;
    //     //           }
    //     //         }, 1000);
    //     //       }
    //     //     })
    //     //     .catch((error) => console.log("error", error));
    //   } else {
    //     _document.querySelector(".pm_tips").innerHTML = "手机号错误!";
    //   }
    // };

    var raw = JSON.stringify({
      user: user,
      url: window.location.href,
    });
    GM_xmlhttpRequest({
      method: "POST",
      url: "http://101.42.169.162:5000/checkLike",
      data: raw,
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      onload: function (response) {
        console.log(response.status);
        if (response.status == 200) {
          console.log(JSON.parse(response.responseText));
          //未操作过
          if (JSON.parse(response.responseText).like == 0) {
            //喜欢
          } else if (JSON.parse(response.responseText).like > 0) {
            //不喜欢
          } else {
          }
        } else {
        }
      },
    });

    document.addEventListener(
      "keydown",
      (event) => {
        const keyName = event.key;
        console.log(keyName);

        if (GM_getValue("user")) {
          switch (keyName) {
            case "ArrowUp":
              arrowUp();
              break;
            case "ArrowDown":
              arrowDown();
              break;
            case "ArrowLeft":
              arrowLeft();
              break;
            case "ArrowRight":
              arrowRight();

              break;
            case "Enter":
              arrowEnter();

              break;

            default:
              break;
          }
        } else {
          switch (keyName) {
            case "ArrowUp":
              event.preventDefault(); // 阻止默认事件
              event.stopPropagation(); // 阻止事件冒泡传播
              if (focusIndexX > 1 && focusIndexY == 0) {
                focusIndexX--;
              }
              break;
            case "ArrowDown":
              event.preventDefault(); // 阻止默认事件
              event.stopPropagation(); // 阻止事件冒泡传播
              if (focusIndexX < 4 && focusIndexY == 0) {
                focusIndexX++;
              }
              break;
            case "ArrowLeft":
              event.preventDefault(); // 阻止默认事件
              event.stopPropagation(); // 阻止事件冒泡传播
              if (focusIndexY > 0) {
                focusIndexY--;
              }
              break;
            case "ArrowRight":
              event.preventDefault(); // 阻止默认事件
              event.stopPropagation(); // 阻止事件冒泡传播
              if (focusIndexY < 1 && focusIndexX == 2) {
                focusIndexY++;
              }
              break;

            case "Enter":
              event.preventDefault(); // 阻止默认事件
              event.stopPropagation(); // 阻止事件冒泡传播
              _document.querySelector(".pm_active").click();
              break;
            default:
              break;
          }
          console.log(focusIndexX, focusIndexY);
          if (focusIndexY == 0) {
            _document.querySelector(".get_code").classList.remove("pm_active");
            switch (focusIndexX) {
              case 1:
                _document.querySelector(".pm_tel > input").focus();
                break;

              case 2:
                _document.querySelector(".pm_code > input").focus();
                _document
                  .querySelector(".pm_login")
                  .classList.remove("pm_active");
                break;
              case 3:
                _document.querySelector(".pm_code > input").blur();
                _document.querySelector(".pm_login").classList.add("pm_active");

                break;
              case 4:
                break;

              default:
                break;
            }
          } else {
            _document.querySelector(".pm_code > input").blur();
            _document.querySelector(".get_code").classList.add("pm_active");
          }
        }
      },
      false
    );

    function arrowLeft() {
      var raw = "userId: user,websiteId: 7752,";
      _document.querySelector("#like").style.fill = "#FF4D7D";
      _document.querySelector("#dislike").style.fill = "#FFFFFF";
      GM_xmlhttpRequest({
        method: "POST",
        url: `http://8.140.241.3:9800/api/user/like?userId=${user}&websiteId=${currentSiteId}`,
        data: raw,
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        onload: function (response) {
          console.log(response.status);

          if (response.status == 200) {
            for (let i = 0; i < webHrefArray.length; i++) {
              if (window.location.href == webHrefArray[i].url) {
                webHrefArray[i].islike = true;
                console.log(webHrefArray);

                GM_setValue("webHrefArray", JSON.stringify(webHrefArray));
              }
            }
          }
        },
      });
    }
    function arrowEnter() {
      var url = window.location.href;
      if (url.indexOf("?") > -1) {
        url += "&clearCache=" + new Date().getTime();
      } else {
        url += "?clearCache=" + new Date().getTime();
      }
      window.location.href = url;
    }
    function arrowRight() {
      var raw = JSON.stringify({
        username: user,
        url: window.location.href,
      });
      _document.querySelector("#like").style.fill = "#FFFFFF";
      _document.querySelector("#dislike").style.fill = "#FF4D7D";
      GM_xmlhttpRequest({
        method: "POST",
        url: "http://101.42.169.162:5000/unLike",
        data: raw,
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        onload: function (response) {
          console.log(response.status);

          if (response.status == 200) {
            for (let i = 0; i < webHrefArray.length; i++) {
              if (window.location.href == webHrefArray[i].url) {
                webHrefArray[i].islike = false;
                console.log(webHrefArray);

                GM_setValue("webHrefArray", JSON.stringify(webHrefArray));
              }
            }
          }
        },
      });
    }
    function arrowUp() {
      index--;
      GM_setValue("index", index);
      if (webHrefArray[index].url) {
        window.location.href = webHrefArray[index].url;
      } else {
        window.location.href = webHrefArray[index];
      }
    }
    function recommendHref() {
      GM_xmlhttpRequest({
        method: "get",
        redirect: "follow",
        headers: {
          "Content-Type": "application/json",
        },
        url: `http://8.140.241.3:9800/api/user/scaleList?userId=${user}`,

        onload: function (response) {
          let nextUrl;
          let nextTitle;
          let nextMenu;
          let nextId;

          if (JSON.parse(response.responseText).data[0] == undefined) {
            return;
          }

          nextId = JSON.parse(response.responseText).data[0].id;

          switch (JSON.parse(response.responseText).data[0].types) {
            case "0":
              nextUrl = JSON.parse(response.responseText).data[0].websiteUrl;

              break;
            case "1":
              nextUrl =
                JSON.parse(response.responseText).data[0].websiteUrl +
                JSON.parse(response.responseText)
                  .data[0].videoUrl.split("$")[1]
                  .split("#")[0];

              break;
            case "2":
              nextUrl = JSON.parse(response.responseText).data[0].websiteUrl;

              break;

            default:
              break;
          }

          console.log(nextUrl);
          if (new RegExp("www.douyin.com").test(nextUrl)) {
            GM_xmlhttpRequest({
              method: "get",
              redirect: "follow",
              url: `https://apis.jxcxin.cn/api/video?url=${nextUrl}`,

              onload: function (response) {
                if (JSON.parse(response.responseText).images) {
                  recommendHref();
                }

                if (JSON.parse(response.responseText).data.url) {
                  index++;
                  if (index > 9) {
                    GM_setValue("index", 9);
                  } else {
                    GM_setValue("index", index);
                  }

                  webHrefArray.push({
                    id: nextId,
                    url: JSON.parse(response.responseText).data.url,
                    title: nextTitle,
                    menu: nextMenu,
                  });

                  if (webHrefArray.length > 10) {
                    webHrefArray.shift();
                  }
                  GM_setValue("webHrefArray", JSON.stringify(webHrefArray));
                  window.location.href = JSON.parse(response.responseText).data.url;
                }
              },
            });
          } else if (new RegExp("www.kuaishou.com").test(nextUrl)) {
            GM_xmlhttpRequest({
              method: "get",
              redirect: "follow",
              url: `https://eeapi.cn/api/video/32BA6AAD06C4E5FF5A2F1BEF0285F02F8F53FEF1514E6BADB2/4775/?url=${nextUrl}`,

              onload: function (response) {
                if (JSON.parse(response.responseText).data.video) {
                  index++;
                  if (index > 9) {
                    GM_setValue("index", 9);
                  } else {
                    GM_setValue("index", index);
                  }

                  webHrefArray.push(
                    JSON.parse(response.responseText).data.video
                  );
                  if (webHrefArray.length > 10) {
                    webHrefArray.shift();
                  }
                  GM_setValue("webHrefArray", JSON.stringify(webHrefArray));
                  window.location.href = JSON.parse(
                    response.responseText
                  ).data.video;
                }
              },
            });
          } else {
            if (nextUrl && JSON.parse(response.responseText).code == 200) {
              nextTitle = `影视-${
                JSON.parse(response.responseText).data[0].name
              }-第一集`;
              nextMenu = JSON.parse(response.responseText).data[0].videoUrl;

              index++;
              if (index > 9) {
                GM_setValue("index", 9);
              } else {
                GM_setValue("index", index);
              }

              webHrefArray.push({
                id: nextId,
                url: nextUrl,
                title: nextTitle,
                menu: nextMenu,
              });
              if (webHrefArray.length > 10) {
                webHrefArray.shift();
              }
              GM_setValue("webHrefArray", JSON.stringify(webHrefArray));
              window.location.href = nextUrl;
            }
          }
        },
      });

      // GM_xmlhttpRequest({
      //   method: "get",
      //   redirect: "follow",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   url: `http://8.140.241.3:9800/api/user/scaleList?userId=1`,

      //   onload: function (response) {
      //     console.log(
      //       JSON.parse(response.responseText).data[0].websiteUrl +
      //         JSON.parse(response.responseText)
      //           .data[0].videoUrl.split("$")[1]
      //           .split("#")[0]
      //     );
      //   },
      // });
    }
    function arrowDown() {
      if (index >= webHrefArray.length - 1) {
        recommendHref();
      } else {
        index++;
        GM_setValue("index", index);
        if (webHrefArray[index].url) {
          window.location.href = webHrefArray[index].url;
        } else {
          window.location.href = webHrefArray[index];
        }
      }
    }

    _document.querySelectorAll(".bm_btn")[0].onclick = () => {
      arrowUp();
    };
    _document.querySelectorAll(".bm_btn")[1].onclick = () => {
      arrowDown();
    };
    _document.querySelectorAll(".bm_btn")[2].onclick = () => {
      arrowLeft();
    };
    _document.querySelectorAll(".bm_btn")[3].onclick = () => {
      arrowRight();
    };

    setTimeout(() => {
      document.body.style.zoom = "normal";
    }, 1000);

    // setTimeout(() => {
    //   if (
    //     document.querySelector(
    //       "#app > div:nth-child(1) > section > div > div > div > div.swiper-container.swiper-box > div > div > div.swiper-slide.swiper-slide-active > div > div.reco-player-container.player-area > div > div.kwai-player-container-video > div > div.kwai-player-plugin-bar.kwai-player-plugin-bar-bottom > div > div.kwai-player-plugin-bar-line > div.right > div.kwai-player-volume-container.player-bar-volume > div.kwai-player-volume-sound > span > div"
    //     )
    //   ) {
    //     document
    //       .querySelector(
    //         "#app > div:nth-child(1) > section > div > div > div > div.swiper-container.swiper-box > div > div > div.swiper-slide.swiper-slide-active > div > div.reco-player-container.player-area > div > div.kwai-player-container-video > div > div.kwai-player-plugin-bar.kwai-player-plugin-bar-bottom > div > div.kwai-player-plugin-bar-line > div.right > div.kwai-player-volume-container.player-bar-volume > div.kwai-player-volume-sound > span > div"
    //       )
    //       .click();
    //   }

    //   document
    //     .querySelectorAll("div[data-e2e='feed-active-video']")[0]
    //     .querySelectorAll(".xg-right-grid .xgplayer-volume .xgplayer-icon")[0]
    //     .click();
    //   setTimeout(() => {
    //     document
    //       .querySelectorAll("div[data-e2e='feed-active-video']")[0]
    //       .querySelector("video")
    //       .play();
    //   }, 2000);
    // }, 5000);
    // Your code here...
  }, 100);
})();

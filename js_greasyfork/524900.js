// ==UserScript==
// @name         寒假教师研修秒过
// @namespace    http://tampermonkey.net/zzzzzzys_国家中小学
// @version      1.0.2
// @description  寒假研修秒过|寒假教师研修|国家智慧教育公共服务平台|国家中小学智慧教育平台秒过
// @author       kkkk
// @match        https://basic.smartedu.cn/*
// @icon         https://basic.smartedu.cn/favicon.ico
// @require      https://fastly.jsdelivr.net/npm/crypto-js@4.2.0/crypto-js.min.js
// @resource     https://cdn.staticfile.org/limonte-sweetalert2/11.7.1/sweetalert2.min.css
// @require      https://fastly.jsdelivr.net/npm/sweetalert2@11.12.2/dist/sweetalert2.all.min.js
// @connect      basic.smartedu.cn
// @connect      x-study-record-api.ykt.eduyun.cn
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/524900/%E5%AF%92%E5%81%87%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E7%A7%92%E8%BF%87.user.js
// @updateURL https://update.greasyfork.org/scripts/524900/%E5%AF%92%E5%81%87%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E7%A7%92%E8%BF%87.meta.js
// ==/UserScript==
(function () {
  "use strict";
  let qqUrl = "https://qm.qq.com/q/rDCbvTiV9K";
  let qqNum = "570337037";
  let qqNum2 = "618010974";
  let qqUrl2 = "https://qm.qq.com/q/h854sxDvKa";
  let biliUrl = "https://b23.tv/x5pFcB0";
  let requestObj = {
    fullsData: {
      url: "https://s-file-2.ykt.cbern.com.cn/teach/s_course/v2/activity_sets/3efdb592-138e-4854-8964-5e10f6011f33/fulls.json",
      method: "GET",
    },
    resourceLearningPositions: {
      url: "https://x-study-record-api.ykt.eduyun.cn/v1/resource_learning_positions/",
      method: "PUT",
    },
  };
  //样式
  let style = `.button-3 {
              position: fixed;  
              appearance: none;
              background-color: #e52b13;
              border: 1px solid rgba(27, 31, 35, .15);
              border-radius: 6px;
              box-shadow: rgba(27, 31, 35, .1) 0 1px 0;
              box-sizing: border-box;
              color: #ffffff;
              cursor: pointer;
              display: inline-block;
              font-family: -apple-system,system-ui,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
              font-size: 14px;
              font-weight: 600;
              line-height: 20px;
              padding: 6px 16px;
              left: 20px;
              top: 300px;
              text-align: center;
              text-decoration: none;
              user-select: none;
              -webkit-user-select: none;
              touch-action: manipulation;
              vertical-align: middle;
              white-space: nowrap;
              z-index: 2147483647;
            }
  
            .button-3:focus:not(:focus-visible):not(.focus-visible) {
              box-shadow: none;
              outline: none;
            }
  
            .button-3:hover {
              background-color: #2c974b;
            }
  
            .button-3:focus {
              box-shadow: rgba(46, 164, 79, .4) 0 0 0 3px;
              outline: none;
            }
  
            .button-3:disabled {
              background-color: #94d3a2;
              border-color: rgba(27, 31, 35, .1);
              color: rgba(255, 255, 255, .8);
              cursor: default;
            }
  
            .button-3:active {
              background-color: #298e46;
              box-shadow: rgba(20, 70, 32, .2) 0 1px 0 inset;
            }`;
  const createFloatingButton = () => {
    // 如果按钮已存在则先移除旧实例
    const existingBtn = document.getElementById("zs-helper-btn");
    if (existingBtn) existingBtn.remove();

    // 直接创建按钮元素（去掉外层div嵌套）
    const btn = document.createElement("div");
    btn.id = "zs-helper-btn"; // 确保唯一ID直接设置在元素上
    btn.style.cssText = `
        position: fixed;
        left: 0px;
        top: 250px;
        transform: translateY(-50%);
        background: #FF4DAF;
        color: white;
        padding: 12px 24px;
        border-radius: 30px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(255,77,175,0.3);
        z-index: 2147483647; /* 使用最大z-index值 */
        transition: 0.3s;
        font-family: 'Microsoft Yahei', sans-serif;
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 8px;
    `;

    // 添加内部HTML内容
    btn.innerHTML = `
        <svg style="width:18px;height:18px;fill:white;" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
        </svg>
        <span>使用指南</span>
    `;

    // 使用更可靠的事件监听方式
    const handleHover = () => {
      btn.style.transform = "translateY(-50%) scale(1.05)";
      btn.style.boxShadow = "0 6px 16px rgba(255,77,175,0.4)";
    };

    const handleLeave = () => {
      btn.style.transform = "translateY(-50%) scale(1)";
      btn.style.boxShadow = "0 4px 12px rgba(255,77,175,0.3)";
    };

    btn.addEventListener("mouseenter", handleHover);
    btn.addEventListener("mouseleave", handleLeave);
    btn.addEventListener("click", showGuideDialog);

    document.body.appendChild(btn);
    return btn;
  };
  // 显示操作指南弹窗
  const showGuideDialog = () => {
    if (Swal) {
      Swal.fire({
        title:
          '<span style="color: #FF4DAF; font-size:26px; display: flex; align-items: center; gap:8px;">📚 智能刷课指南 <div style="font-size:12px; color:#95a5a6; margin-left:auto;">v1.0.2</div></span>',
        html: `
                <div style="text-align: left; max-width: 720px; line-height: 1.8;">
                    <!-- 操作步骤 -->
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <div style="color: red; font-weight:500; margin-bottom:10px;">
                            播放页面未正常生效请刷新页面！
                        </div>
                        <div style="color: #2c3e50; font-weight:500; margin-bottom:10px;">
                            🚀 极速操作流程<br>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 32px 1fr; gap: 10px; align-items: center;">
                            <div style="background: #FF4DAF; color: white; width:24px; height:24px; border-radius:50%; text-align:center; line-height:24px;">1</div>
                            <div>进入2025研修课程播放页面</div>
                            
                            <div style="background: #FF4DAF; color: white; width:24px; height:24px; border-radius:50%; text-align:center; line-height:24px;">2</div>
                            <div>等待视频加载完成（<span style="color:#e74c3c">未自动播放时</span>）</div>
                            
                            <div style="background: #FF4DAF; color: white; width:24px; height:24px; border-radius:50%; text-align:center; line-height:24px;">3</div>
                            <div>点击左侧<span style="color:#FF4DAF; font-weight:bold">「即刻开刷」</span>按钮</div>
                        </div>
                    </div>

                    <!-- 注意事项 -->
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom:20px;">
                        <div style="border-left: 3px solid #FF4DAF; padding-left:12px;">
                            <div style="color: #e74c3c; font-weight:500; margin-bottom:8px;">⚠️ 重要提醒</div>
                            <ul style="margin:0; padding-left:18px; color:#7f8c8d; font-size:14px;">
                                <li>视频最后剩下5秒需要看完</li>
                                <li>请勿主动点击播放</li>
                                <li>建议刷完全部视频再刷新，观看最后的几秒</li>
                            </ul>
                        </div>

                        <div style="border-left: 3px solid #27ae60; padding-left:12px;">
                            <div style="color: #27ae60; font-weight:500; margin-bottom:8px;">💡 高效技巧</div>
                            <ul style="margin:0; padding-left:18px; color:#7f8c8d; font-size:14px;">
                                <li>先刷一个视频</li>
                                <li>点击另外一个视频</li>
                                <li>再点击回刚刷的视频，播放完最后5s</li>
                            </ul>
                        </div>
                    </div>

                    <!-- 社群入口 -->
                    <div style="background: linear-gradient(135deg, #FF4DAF 0%, #FF6B6B 100%); padding:15px; border-radius:8px; color:white;">
                        <div style="display: flex; align-items: center; gap:15px;">
                            <img src="https://qzonestyle.gtimg.cn/qzone/qzact/act/external/tiqq/logo.png" 
                                 style="height:36px; border-radius:6px;">
                            <div>
                                <div style="font-size:16px; font-weight:bold; margin-bottom:4px;">教师交流群</div>
                                <div style="font-size:12px; opacity:0.9;">获取实时支持 | 最新功能优先体验</div>
                            </div>
                        </div>
                        <a href="${qqUrl2}" 
                           target="_blank" 
                           style="display: block; margin-top:12px; padding:10px; 
                                  background: rgba(255,255,255,0.2); border-radius:6px; 
                                  text-align:center; text-decoration:none; color:white !important;
                                  transition:0.3s; font-weight:500;">
                            🎯 点击加入QQ群2：${qqNum2}
                        </a>
                        <a href="${qqUrl}" 
                           target="_blank" 
                           style="display: block; margin-top:12px; padding:10px; 
                                  background: rgba(255,255,255,0.2); border-radius:6px; 
                                  text-align:center; text-decoration:none; color:white !important;
                                  transition:0.3s; font-weight:500;">
                            🎯 点击加入QQ群：${qqNum}
                        </a>
                        <a href="${biliUrl}" 
                           target="_blank" 
                           style="display: block; margin-top:12px; padding:10px; 
                                  background: rgba(255,255,255,0.2); border-radius:6px; 
                                  text-align:center; text-decoration:none; color:white !important;
                                  transition:0.3s; font-weight:500;">
                            📽️ 点击观看使用教程，哔哩哔哩：${biliUrl}
                        </a>
                    </div>
                </div>
            `,
        confirmButtonText: "已了解，开始减负之旅 →",
        confirmButtonColor: "#FF4DAF",
        showCancelButton: true,
        cancelButtonText: "不在显示此窗口",
        cancelButtonColor: "#95a5a6",
        width: 760,
        customClass: {
          popup: "animated pulse",
          title: "swal-title-custom",
        },
        footer:
          '<div style="color:#bdc3c7; font-size:12px;">请合理使用本工具</div>',
      }).then((result) => {
        // console.log(result);
        // console.log(Swal.DismissReason.cancel);
        if (result.dismiss === Swal.DismissReason.cancel) {
          // 跳转到课程列表页或其他操作
          localStorage.setItem("noMoreDialog", "ture");
        }
      });
    }
  };
  // 初始化逻辑
  // 初始化逻辑优化
  const init = () => {
    // 创建悬浮按钮
    const floatBtn = createFloatingButton();

    // 添加防DOM清理监听（优化版）
    const observer = new MutationObserver((mutations) => {
      if (!document.body.contains(floatBtn)) {
        createFloatingButton();
      }
    });
    observer.observe(document.body, { childList: true });

    // 添加CSS保护
    const style = document.createElement("style");
    style.textContent = `
        #zs-helper-btn {
            pointer-events: auto !important;
            opacity: 1 !important;
            visibility: visible !important;
        }
        #zs-helper-btn:hover {
            transform: translateY(-50%) scale(1.05) !important;
        }
    `;
    document.head.appendChild(style);
  };
  window.onload = function () {
    init();
    if (
      !location.href.includes("courseDetail") &&
      !localStorage.getItem("noMoreDialog")
    ) {
      showGuideDialog();
      return;
    }
    if (
      !location.href.includes("courseDetail") &&
      !location.href.includes("courseIndex")
    ) {
      return;
    }
    let myStyle = document.createElement("style");
    myStyle.innerHTML = style;
    document.head.appendChild(myStyle);
    /*let intercept=GM_GetValue*/
    let div = document.createElement("div");
    div.innerHTML = `<div style="left: 0;top: 300px;" id="my1" class="button-3" >即刻开刷</div>
                        <div style="left: 0;top: 340px;" id="my2"   class="button-3" >2222</div>`;
    document.body.appendChild(div);

    document.getElementById("my1").addEventListener("click", async () => {
      try {
        await setProgress(
          requestObj.resourceLearningPositions.url +
            getResourceId() +
            "/" +
            getDynamicToken().token["user_id"],
          getVideoTime()
        );
        if (Swal) {
          Swal.fire({
            title: "刷课成功！",
            html: `
            <div style="text-align: left;">
                <p>此视频只剩下最后5s，请刷新后再观看！建议先刷完目录下视频再刷新！</p>
                <hr style="margin: 10px 0;">
                <p>💬 <strong>教师交流QQ群</strong></p>
                <p>欢迎加入交流群获取更多支持：<br>
                    <a href="${qqUrl2}" 
                      target="_blank" 
                      style="color: #FF4DAFFF; text-decoration: underline;">
                      点击加入QQ群2：${qqNum2}
                   </a>
                   <a href="${qqUrl}" 
                      target="_blank" 
                      style="color: #FF4DAFFF; text-decoration: underline;">
                      点击加入QQ群：${qqNum}
                   </a>
                </p>
            </div>
        `,
            icon: "success",
            confirmButtonColor: "#FF4DAFFF",
            // cancelButtonText: "取消，等会刷新",
            // 作者：zzzzzzys
            // https://greasyfork.org/zh-CN/users/1176747-zzzzzzys
            // 搬运可耻
            confirmButtonText: "确定",
          }).then((result) => {
            if (result.isConfirmed) {
            }
          });
        }
      } catch (e) {
        console.error(e);
        if (Swal) {
          Swal.fire({
            title: "失败！",
            text: e,
            icon: "error",
            // showCancelButton: true,
            confirmButtonColor: "#FF4DAFFF",
            // cancelButtonText: "取消，等会刷新",
            confirmButtonText: "点击去反馈",
          }).then((result) => {
            if (result.isConfirmed) {
              window.open(
                "https://greasyfork.org/zh-CN/scripts/525037/feedback"
              );
            }
          });
        }
      }
    });
    document.getElementById("my2").addEventListener("click", function () {
      Swal.fire({
        title:
          '<span style="font-size:24px; color: #FF4DAF;">欢迎加入交流群</span>',
        html: `
        <div style="text-align: left; max-width: 580px; line-height: 1.7; font-size: 14px;">
            <!-- 社群入口 -->
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin:0 0 12px 0; color: #2c3e50;">
                    <img src="https://qzonestyle.gtimg.cn/qzone/qzact/act/external/tiqq/logo.png" 
                         style="height:20px; vertical-align:middle;">
                    QQ群
                </h3>
                <div style="color: #e74c3c; font-weight:500;">
                    群号：<span style="font-family: monospace;">${qqNum}</span>
                </div>
                <a href="${qqUrl}"  
                   target="_blank" 
                   style="display: inline-block; margin-top:10px; padding:8px 20px; 
                          background: #FF4DAF; color: white !important; border-radius:20px; 
                          text-decoration: none; transition:0.3s;">
                    🚀 一键加入群聊
                </a>
            </div>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin:0 0 12px 0; color: #2c3e50;">
                    <img src="https://qzonestyle.gtimg.cn/qzone/qzact/act/external/tiqq/logo.png" 
                         style="height:20px; vertical-align:middle;">
                    QQ群2
                </h3>
                <div style="color: #e74c3c; font-weight:500;">
                    群号：<span style="font-family: monospace;">${qqNum2}</span>
                </div>
                <a href="${qqUrl2}"  
                   target="_blank" 
                   style="display: inline-block; margin-top:10px; padding:8px 20px; 
                          background: #FF4DAF; color: white !important; border-radius:20px; 
                          text-decoration: none; transition:0.3s;">
                    🚀 一键加入群聊
                </a>
            </div>

            <!-- 核心价值 -->
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                <!-- 左列 -->
                <div style="padding-right:15px; border-right:1px dashed #eee;">
                    <div style="color: #27ae60; margin-bottom:15px;">
                        <h4 style="margin:0 0 8px 0; font-size:15px;">📚 减负工具</h4>
<!--                        <ul style="margin:0; padding-left:18px;">-->
<!--                            <li>自动化备课工具套件</li>-->
<!--                            <li>智能学情分析报告</li>-->
<!--                            <li>教学资源智能检索</li>-->
<!--                        </ul>-->
                    </div>

                    <div style="color: #2980b9; margin-top:15px;">
                        <h4 style="margin:0 0 8px 0; font-size:15px;">🛡️ 使用规范</h4>
                        <ul style="margin:0; padding-left:18px;">
                            <li>仅限中小学课程使用</li>
                            <li>禁止商业倒卖行为</li>
                            <li>请勿批量自动化操作大量刷课</li>
                        </ul>
                    </div>
                </div>

                <!-- 右列 -->
                <div style="padding-left:15px;">
                    <div style="color: #e67e22;">
                        <h4 style="margin:0 0 8px 0; font-size:15px;">⚖️ 版权声明</h4>
                        <ul style="margin:0; padding-left:18px;">
                            <li>本工具完全免费</li>
                            <li>源码禁止二次传播</li>
<!--                            <li>保留原创法律权利</li>-->
                        </ul>
                    </div>

                    <div style="color: #9b59b6; margin-top:15px;">
                        <h4 style="margin:0 0 8px 0; font-size:15px;">💌 联系我们</h4>
                        <ul style="margin:0; padding-left:18px;">
<!--                            <li>反馈建议：edu@service.com</li>-->
                            <li>紧急问题：请私聊群管理员</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `,
        icon: "info",
        confirmButtonColor: "#FF4DAF",
        confirmButtonText: "2222",
        showCloseButton: true,
        width: 680,
        showDenyButton: true,
        denyButtonText:
          '<img src="https://img.icons8.com/fluency/24/star--v1.png" style="height:18px; vertical-align:middle;"> 前往好评', // 带图标的按钮
        denyButtonColor: "#FFC107",
        focusDeny: false,
        showCancelButton: false,

        // 新增按钮回调
        preDeny: () => {
          window.open(
            "https://greasyfork.org/zh-CN/scripts/525037/feedback",
            "_blank"
          );
          return false; // 阻止弹窗关闭
        },

        customClass: {
          denyButton: "swal-custom-deny",
          popup: "swal-custom-popup",
          title: "swal-custom-title",
        },
        footer:
          '<div style="color:#95a5a6; font-size:12px;">请合理使用。</div>',
      });
    });
  };

  function getVideoTime() {
    return Math.round(document.querySelector("video").duration);
  }

  function getResourceId() {
    // 获取目标元素
    const divElement = document.querySelector("div.vjs-poster");
    if (divElement) {
      const bgImage = divElement.style.backgroundImage;

      const uuidPattern =
        /assets\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/;
      const match = bgImage.match(uuidPattern);
      if (match) {
        const resId = match[1];
        console.log(resId);
        return resId;
      }
    }
    throw Error("can not get ResourceId!");
  }

  function getDynamicToken() {
    try {
      const pattern =
        /^ND_UC_AUTH-([0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12})&ncet-xedu&token$/;
      for (let key of Object.keys(localStorage)) {
        if (pattern.test(key)) {
          return {
            key: key,
            appId: key.match(pattern)[1],
            token: JSON.parse(JSON.parse(localStorage.getItem(key)).value),
          };
        }
      }
      throw Error("Invalid token! can not get loginInfo!");
    } catch (err) {
      throw Error("At:getDynamicToken>>" + err);
    }
  }

  // const tokenData = getDynamicToken();
  // if (tokenData) {
  //     console.log("完整键名:", tokenData.key);
  //     console.log("用户UUID:", tokenData.uuid);
  //     console.log("Token值:", tokenData.token);
  // }
  // 作者：zzzzzzys
  // https://greasyfork.org/zh-CN/users/1176747-zzzzzzys
  // 搬运可耻
  const getMACAuthorizationHeaders = function (url, method) {
    let n = getDynamicToken().token;
    return He(url, method, {
      accessToken: n.access_token,
      macKey: n.mac_key,
      diff: n.diff,
    });
  };

  function Ze(e) {
    for (
      var t = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""), n = "", r = 0;
      r < e;
      r++
    )
      n += t[Math.ceil(35 * Math.random())];
    return n;
  }

  function Fe(e) {
    return new Date().getTime() + parseInt(e, 10) + ":" + Ze(8);
  }

  function ze(e, t, n, r) {
    let o = {
      relative: new URL(e).pathname,
      authority: new URL(e).hostname,
    };
    let i =
      t +
      "\n" +
      n.toUpperCase() +
      "\n" +
      o.relative +
      "\n" +
      o.authority +
      "\n";
    return CryptoJS.HmacSHA256(i, r).toString(CryptoJS.enc.Base64);
  }

  function He(e) {
    // 作者：zzzzzzys
    // https://greasyfork.org/zh-CN/users/1176747-zzzzzzys
    // 搬运可耻
    let t =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "GET",
      n = arguments.length > 2 ? arguments[2] : void 0,
      r = n.accessToken,
      o = n.macKey,
      i = n.diff,
      s = Fe(i),
      a = ze(e, s, t, o);
    return 'MAC id="'
      .concat(r, '",nonce="')
      .concat(s, '",mac="')
      .concat(a, '"');
  }

  const setProgress = function (url, duration) {
    const info = getDynamicToken();
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        url: url,
        method: "PUT",
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          authorization: getMACAuthorizationHeaders(url, "PUT"),
          "cache-control": "no-cache",
          pragma: "no-cache",
          "content-type": "application/json",
          "sdp-app-id": info.appId,
          "sec-ch-ua":
            '"Not A(Brand";v="8", "Chromium";v="132", "Microsoft Edge";v="132"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
          host: "x-study-record-api.ykt.eduyun.cn",
          origin: "https://basic.smartedu.cn",
          referer: "https://basic.smartedu.cn/",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0",
        },
        data: JSON.stringify({ position: duration - 3 }),
        // fetch:true,
        onload: function (res) {
          console.log("请求成功");
          console.log(res);
          if (res.status === 200) {
            console.log("刷课成功！");
            resolve(res);
          }
        },
        onerror: function (err) {
          reject("请求错误！" + err.toString());
        },
      });
    });
  };
})();

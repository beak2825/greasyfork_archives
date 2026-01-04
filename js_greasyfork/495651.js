// ==UserScript==
// @name         TemplateRender
// @namespace    http://tampermonkey.net/
// @version      2024-05-14
// @description  Dolphin支持弹窗模板渲染
// @author       yangxiaodi
// @match        https://cloud.bytedance.net/dolphin/cn/bizline/207/event/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/495651/TemplateRender.user.js
// @updateURL https://update.greasyfork.org/scripts/495651/TemplateRender.meta.js
// ==/UserScript==

(function () {
  'use strict';
  GM_addStyle(`
       #popup-preview-container{
         width:25%;
         border: 0.5px solid rgb(223,224,225);
         margin-top:32px;
         margin-bottom:24px;
       }
       #popup-preview{
         width:100%;
         height:100%;
       }
       #json-editor{
        margin-top:32px;
         width:25%;
       }
    `);

  function loadCSS(href) {
    var cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.type = "text/css";
    cssLink.href = href;
    document.getElementsByTagName("head")[0].appendChild(cssLink);
  }


  function loadScript(src) {
    let script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.src = src
    document.documentElement.appendChild(script);
  }
  // 使用示例：
  loadCSS("https://cdn.bootcdn.net/ajax/libs/jsoneditor/10.0.0/jsoneditor.min.css");

  loadScript("https://cdn.bootcdn.net/ajax/libs/jsoneditor/10.0.0/jsoneditor.min.js");

  let mock_data =
  {
    cache_data: {
      upsells: {
        sell_vip_type: "vip_end",
        upsell_infos: {},
      },
      ads_config: {
        ad_unit_configs: [
          {
            ad_supported_scene: {
              ad_type: 2,
            },
            reward_advance_release_days: 2,
          },
        ],
      },
      subscription: {
        auto_renew_cancel_guidance: false,
        subs_info: {
          is_vip: false,
          vip_stage: "",
          play_entitlements: {
            expire_at: new Date().getTime(),
            reward_tasks_finished: 0,
            reward_tasks_time_ms: [1800000, 1800000, -1],
            video_complete_acquired_time_ms: [],
            reward_finished_task_info: {
              days_finished: 0,
              tasks_finished: 0,
            },
          },
          auto_renew_cancel_guidance: false,
        },
        to_purchase_offers: [
          {
            currency_code: "CNY",
            external_offer_id: "luna.premium.month_renew_discount",
            offer_id: "tdP2dk7ORJMZNZefyTax",
            resource: {
              resource_id: "357",
              benefits: [
                {
                  title: "会员曲库",
                  sub_title: "畅听千万会员曲库",
                },
                {
                  title: "下载特权",
                  sub_title: "300首/月付费歌曲免费下载",
                },
                {
                  title: "会员音质",
                  sub_title: "尊享高音质听歌体验",
                },
              ],
              offer_preview: {
                name: "连续包月",
                price: "1.00元",
                selected: true,
                promotion_info: {
                  origin_price: "8元",
                  promotion_label: "新用户专享价",
                  show_countdown: true,
                  countdown_duration: 3600000,
                },
                rich_desc: [
                  {
                    text: "到期续费8元/月，同一Apple ID仅可享受 1 次优惠",
                    text_color: "FFFFFF80",
                  },
                ],
              },
              purchase_btn: {
                purchase_action_text: "1元开通",
                colours: [
                  {
                    rgb: "#00CB64",
                  },
                ],
                bubble_text: "",
              },
              user_agreement: [
                {
                  text: "已阅读并同意",
                  text_color: "FFFFFF80",
                },
                {
                  link: "汽水音乐",
                  text: "《会员服务协议》",
                  text_color: "FFFFFF",
                },
                {
                  is_auto_renew_tip: true,
                },
              ],
              offer_params: {
                type: "1_month_auto_renew",
              },
            },
            amount: 1000000,
            offer_type: "auto_renew",
            offer_sub_type: "one_month_discount",
            original_amount: 1000000,
            // vip_stage: 'vip',
          },
          {
            currency_code: "CNY",
            external_offer_id: "com.luna.one_year_renew",
            offer_id: "j8QDe2vIcxJHplLDw5vE",
            resource: {
              resource_id: "44",
              benefits: [
                {
                  title: "会员曲库",
                  sub_title: "畅听千万会员曲库",
                },
                {
                  title: "下载特权",
                  sub_title: "300首/月付费歌曲免费下载",
                },
                {
                  title: "会员音质",
                  sub_title: "尊享高音质听歌体验",
                },
              ],
              offer_preview: {
                name: "连续包年",
                price: "88.00元",
                promotion_info: {
                  origin_price: "96元",
                  promotion_label: "单月最低",
                },
                rich_desc: [
                  {
                    text: "到期续费88元/年",
                    text_color: "FFFFFF80",
                  },
                ],
              },
              purchase_btn: {
                purchase_action_text: "88元开通",
                colours: [
                  {
                    rgb: "#00CB64",
                  },
                ],
                bubble_text: "",
              },
              user_agreement: [
                {
                  text: "已阅读并同意",
                  text_color: "FFFFFF80",
                },
                {
                  link: "汽水音乐",
                  text: "《会员服务协议》",
                  text_color: "FFFFFF",
                },
                {
                  is_auto_renew_tip: true,
                },
              ],
              offer_params: {
                type: "12_month_auto_renew",
              },
            },
            amount: 88000000,
            offer_type: "auto_renew",
            offer_sub_type: "12_month_plan",
            original_amount: 88000000,
            // vip_stage: 'vip',
          },
          {
            currency_code: "CNY",
            external_offer_id: "com.luna.premium_six_month",
            offer_id: "rQ7lpcINVsgxK6U7NDTa",
            resource: {
              resource_id: "6",
              benefits: [
                {
                  title: "会员曲库",
                  sub_title: "畅听千万会员曲库",
                },
                {
                  title: "下载特权",
                  sub_title: "300首/月付费歌曲免费下载",
                },
                {
                  title: "会员音质",
                  sub_title: "尊享高音质听歌体验",
                },
              ],
              offer_preview: {
                name: "6个月",
                price: "45.00元",
                promotion_info: {
                  origin_price: "48元",
                },
              },
              purchase_btn: {
                purchase_action_text: "45元开通",
                colours: [
                  {
                    rgb: "#00CB64",
                  },
                ],
                bubble_text: "",
              },
              user_agreement: [
                {
                  text: "开通即同意",
                  text_color: "FFFFFF80",
                },
                {
                  link: "汽水音乐",
                  text: "《会员服务协议》",
                  text_color: "FFFFFF",
                },
              ],
              offer_params: {
                type: "6_month",
              },
            },
            amount: 45000000,
            offer_type: "one_off",
            offer_sub_type: "six_month_plan",
            original_amount: 45000000
          },
          {
            currency_code: "CNY",
            external_offer_id: "com.luna.premium_12_month",
            offer_id: "3RyrHt1PYpBanaSuGgIY",
            resource: {
              resource_id: "8",
              benefits: [
                {
                  title: "会员曲库",
                  sub_title: "畅听千万会员曲库",
                },
                {
                  title: "下载特权",
                  sub_title: "300首/月付费歌曲免费下载",
                },
                {
                  title: "会员音质",
                  sub_title: "尊享高音质听歌体验",
                },
              ],
              offer_preview: {
                name: "12个月",
                price: "88.00元",
                promotion_info: {
                  origin_price: "96元",
                },
              },
              purchase_btn: {
                purchase_action_text: "88元开通",
                colours: [
                  {
                    rgb: "#00CB64",
                  },
                ],
                bubble_text: "",
              },
              user_agreement: [
                {
                  text: "开通即同意",
                  text_color: "FFFFFF80",
                },
                {
                  link: "汽水音乐",
                  text: "《会员服务协议》",
                  text_color: "FFFFFF",
                },
              ],
              offer_params: {
                type: "12_month",
              },
            },
            amount: 88000000,
            offer_type: "one_off",
            offer_sub_type: "12_month_plan",
            original_amount: 88000000
          },
          {
            currency_code: "CNY",
            external_offer_id: "com.luna.premium_one_month",
            offer_id: "byf09hFJZQfd6YjcqXMi",
            resource: {
              resource_id: "2",
              benefits: [
                {
                  title: "会员曲库",
                  sub_title: "畅听千万会员曲库",
                },
                {
                  title: "下载特权",
                  sub_title: "300首/月付费歌曲免费下载",
                },
                {
                  title: "会员音质",
                  sub_title: "尊享高音质听歌体验",
                },
              ],
              offer_preview: {
                name: "1个月",
                price: "8.00元",
              },
              purchase_btn: {
                purchase_action_text: "8元开通",
                colours: [
                  {
                    rgb: "#00CB64",
                  },
                ],
                bubble_text: "",
              },
              user_agreement: [
                {
                  text: "开通即同意",
                  text_color: "FFFFFF80",
                },
                {
                  link: "汽水音乐",
                  text: "《会员服务协议》",
                  text_color: "FFFFFF",
                },
              ],
              offer_params: {
                type: "1_month",
              },
            },
            amount: 8000000,
            offer_type: "one_off",
            offer_sub_type: "one_month_plan",
            original_amount: 8000000
          },
        ],
      },
    },
    upsell_scene: "reward_preview_popup_with_process_bar",
    popup_template:
      '{"version": 1, "templateID": "reward_preview_popup_with_process_bar", "content": [{"type": "top_bar", "presetData": "isPlayingInfo"}, {"type": "space", "size": 20}, {"type": "text", "preset": "reward_top_desc_heavy", "text": "当前VIP歌曲仅试听片段"}, {"type": "text", "preset": "reward_title", "text": "看视频免费听"}, {"type": "space", "size": 24}, {"type": "board_progress", "presetData": "adProcess"}, {"type": "space", "size": 24}, {"type": "button", "span": 11.5, "text": "开会员听整月", "action": "vip", "background": "#F3F3F3", "textColor": "#121212"}, {"type": "space", "size": 0, "span": 1}, {"type": "button", "span": 11.5, "text": "去看视频", "action": "ad", "background": ["#9BFF8A 0%", "#64E34F 100%"], "textColor": "#121212"}]}',
  };



  let editor = undefined;
  let index = -1;
  function createJsonEditor() {
    let container = document.createElement('div');
    container.id = "json-editor";
    var options = { mode: 'text' };


    editor = new JSONEditor(container, options, editor_data);

    // 创建一个观察器实例并传入回调函数
    let observer = new MutationObserver(callback);

    // 开始观察目标节点
    observer.observe(container, config);
    let guard = document.getElementsByClassName("overflow-guard")[0];
    container.style.height = guard.style.height;
    return container
  }


  function isJSON(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  let post = function () {
    let popupTemplate = editor.get();
    console.log(popupTemplate)

    // 构造数据
    let preview = document.getElementById("popup-preview");
    if (preview == undefined) {
      return
    }
    let preview_window = preview.contentWindow;

    mock_data.popup_template = JSON.stringify(popupTemplate);
    console.log(mock_data)

    preview_window.postMessage(mock_data, 'https://luna-web-lynx-container.gf-boe.bytedance.net/web_lynx/index.html');

    console.log("postMessage done")
  }


  let preview = function () {
    let container = document.createElement('div');
    container.id = "popup-preview-container";

    let preview_format = `<iframe class="iframe" src="https://luna-web-lynx-container.gf-boe.bytedance.net/web_lynx/index.html" id="popup-preview"></iframe>`;

    let parser = new DOMParser();
    let previewWrapper = parser.parseFromString(preview_format, "text/html");
    let editor = document.getElementById("json-editor");
    let preview_dom = previewWrapper.body.firstChild

    container.style.height = editor.style.height;
    container.append(preview_dom)
    return container
  }

  const config = { attributes: true, childList: true, subtree: true };
  let callback = function (mutationsList, observer) {
    post();
  };


  let editor_data = '关闭后重新加载';

  setInterval(() => {
    console.log("油猴监听中")

    let modals = document.getElementsByClassName("arco-modal");
    if (modals.length == 0) {
      return
    }

    let modal = modals[0];
    modal.style.width = "100vw";

    let modal_contents = document.getElementsByClassName("arco-modal-content")
    if (modal_contents.length == 0) {
      return
    }

    let modal_content = modal_contents[0];
    if (modal_content.lastChild.id == 'json-editor' || modal_content.lastChild.id == "popup-preview-container") {
      return
    }
      
    console.log("click")


    let edits = document.getElementsByClassName("dolphin-c64ade");

    Array.from(edits).forEach(function (item, idx) {
      let i = idx;
      item.onclick = function (e) {
        console.log("click")
        index = i;

        let modal_contents = document.getElementsByClassName("arco-modal-content");
        if (modal_contents.length == 0) {
          return
        }

        let modal_content = modal_contents[0];

        if (modal_content.lastChild.id == "popup-preview-container") {
          modal_content.removeChild(modal_content.lastChild);
          modal_content.appendChild(preview());
        }


        editor_data = JSON.parse(document.getElementsByClassName("dolphin-1u46wo3")[i * 4 + 2].textContent);

        editor.set(editor_data);

        post();

      }
    })

    let forms = document.getElementsByClassName("arco-form");
    if (forms.length == 0) {
      return
    }
    let form = forms[0];

    form.style.width = "50%";

    modal_content.style.display = 'flex';

   
    //editor_data = JSON.parse(document.getElementsByClassName("dolphin-1u46wo3")[index * 4 + 2].textContent);

    modal_content.appendChild(createJsonEditor());
    modal_content.appendChild(preview());



  }, 5000)
})();
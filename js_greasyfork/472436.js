// ==UserScript==
// @name               lawful-mcseas
// @name:en            Lawful MC seas
// @name:zh-CN         秩序心海
// @namespace          https://mcseas.club/home.php?mod=space&uid=95082
// @version            0.5.2-alpha
// @author             miyoi
// @description:en     Improve the user experience of mcseas.
// @description:zh-CN  改善「混沌心海」论坛的使用体验。
// @license            MIT
// @icon               https://mcseas.club/favicon.ico
// @homepage           https://mcseas.club/forum.php?mod=viewthread&tid=50579
// @homepageURL        https://github.com/midniht/lawful-mcseas
// @match              *://mcseas.club/*
// @require            https://unpkg.com/heti/umd/heti-addon.min.js
// @resource           css  https://unpkg.com/heti/umd/heti.min.css
// @grant              GM_addStyle
// @grant              GM_deleteValue
// @grant              GM_getResourceText
// @grant              GM_getValue
// @grant              GM_listValues
// @grant              GM_log
// @grant              GM_openInTab
// @grant              GM_registerMenuCommand
// @grant              GM_setValue
// @grant              GM_unregisterMenuCommand
// @run-at             document-end
// @description 改善「混沌心海」论坛的使用体验。
// @downloadURL https://update.greasyfork.org/scripts/472436/lawful-mcseas.user.js
// @updateURL https://update.greasyfork.org/scripts/472436/lawful-mcseas.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  var _a, _b, _c, _d, _e, _f, _g;
  var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  var _GM_deleteValue = /* @__PURE__ */ (() => typeof GM_deleteValue != "undefined" ? GM_deleteValue : void 0)();
  var _GM_getResourceText = /* @__PURE__ */ (() => typeof GM_getResourceText != "undefined" ? GM_getResourceText : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_listValues = /* @__PURE__ */ (() => typeof GM_listValues != "undefined" ? GM_listValues : void 0)();
  var _GM_log = /* @__PURE__ */ (() => typeof GM_log != "undefined" ? GM_log : void 0)();
  var _GM_openInTab = /* @__PURE__ */ (() => typeof GM_openInTab != "undefined" ? GM_openInTab : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_unregisterMenuCommand = /* @__PURE__ */ (() => typeof GM_unregisterMenuCommand != "undefined" ? GM_unregisterMenuCommand : void 0)();
  var _monkeyWindow = /* @__PURE__ */ (() => window)();
  const name = "lawful-mcseas";
  const version = "0.5.2";
  const type = "module";
  const scripts = {
    dev: "vite",
    build: "tsc && vite build",
    preview: "vite preview"
  };
  const devDependencies = {
    typescript: "^5.1.6",
    "unplugin-auto-import": "^0.16.6",
    vite: "^4.4.8",
    "vite-plugin-monkey": "^3.4.0"
  };
  const pkg = {
    name,
    "private": true,
    version,
    type,
    scripts,
    devDependencies
  };
  class Utils {
    current() {
      const t = /* @__PURE__ */ new Date();
      const pad = (pad_target, pad_length = 2, pad_string = "0") => pad_target.toString().padStart(pad_length, pad_string);
      return [pad(t.getFullYear(), 4), pad(t.getMonth() + 1), pad(t.getDate())].join(
        "-"
      ) + " " + [pad(t.getHours()), pad(t.getMinutes()), pad(t.getSeconds())].join(":");
    }
    debug(...args) {
      _GM_log(`${this.current()} | DEBUG |`, ...args);
    }
    log(...args) {
      console.log(`${this.current()} [秩序心海]`, ...args);
    }
    // match_reg(text: string, regexp: RegExp): string | null {
    //   const match_result = [...text.matchAll(regexp)];
    //   return match_result.length > 0 ? match_result[0][1] : null;
    // }
  }
  class Config {
    constructor() {
      __publicField(this, "version", `${pkg.version}-alpha`);
      __publicField(this, "auto_format");
      __publicField(this, "auto_format_with_segment");
      __publicField(this, "font_name");
      __publicField(this, "font_size");
      __publicField(this, "only_format_lz");
      __publicField(this, "block_ip_warning");
      __publicField(this, "display_user_medal");
      __publicField(this, "block_email_warning");
      __publicField(this, "data");
      this.load();
    }
    load() {
      this.auto_format = _GM_getValue("cfg_auto_format") !== "false";
      this.auto_format_with_segment = _GM_getValue("cfg_auto_format_with_segment") !== "false";
      this.font_name = _GM_getValue("cfg_font_name") || "小赖字体 等宽 SC";
      this.font_size = Number(_GM_getValue("cfg_font_size"));
      this.font_size = this.font_size > 0 ? this.font_size : 16;
      this.only_format_lz = _GM_getValue("cfg_only_format_lz") !== "false";
      this.block_ip_warning = _GM_getValue("cfg_block_ip_warning") === "true";
      this.display_user_medal = _GM_getValue("cfg_display_user_medal") !== "false";
      this.block_email_warning = _GM_getValue("cfg_block_email_warning") === "true";
      this.data = {
        user_blacklist: JSON.parse(_GM_getValue("data_user_blacklist") ?? "[]"),
        replace_pair_list: JSON.parse(
          _GM_getValue("data_replace_pair_list") ?? "{}"
        )
      };
    }
    save(key, value) {
      _GM_setValue(`cfg_${key}`, value);
      this.load();
    }
  }
  let menu_id_map = {
    auto_format: "",
    auto_format_with_segment: "",
    format_font_name: "",
    format_font_size: "",
    switch_ip_warning: "",
    display_user_medal: "",
    go_to_report: "",
    edit_replace_pair: "",
    reset_config: ""
  };
  let style_nodes = {
    custom_view_list: void 0,
    custom_format_font: void 0,
    custom_highlight_floor: void 0,
    heti: void 0
  };
  const utils = new Utils();
  const setting = new Config();
  const rerender_auto_format = (include_heti = true) => {
    var _a2, _b2, _c2, _d2;
    if (setting.auto_format) {
      if (include_heti) {
        (_a2 = style_nodes.heti) == null ? void 0 : _a2.remove();
        style_nodes.heti = _GM_addStyle(_GM_getResourceText("css"));
        utils.debug(
          `自动格式化正文 赫蹏 更新 CSS id: style#${style_nodes.heti.id}`
        );
        window.onload = () => {
          const heti = new _monkeyWindow.Heti(".heti, .heti-parent .pcb");
          heti.autoSpacing();
        };
      }
      (_b2 = style_nodes.custom_format_font) == null ? void 0 : _b2.remove();
      style_nodes.custom_format_font = _GM_addStyle(`
      .heti, .heti-parent .pcb { font-family: "${setting.font_name}", "Helvetica Neue", helvetica, arial, "Heti Hei", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; font-size: ${setting.font_size}px; }
      .t_f > div:not(.blockcode) { margin-bottom: .75em; }
    `);
      utils.debug(
        `自动格式化正文 自定义字体 更新 CSS id: style#${style_nodes.custom_format_font.id}`
      );
    } else {
      (_c2 = style_nodes.heti) == null ? void 0 : _c2.remove();
      (_d2 = style_nodes.custom_format_font) == null ? void 0 : _d2.remove();
    }
  };
  const recreate_menu_command = () => {
    for (let [menu_key, menu_id] of Object.entries(menu_id_map)) {
      if (menu_id) {
        _GM_unregisterMenuCommand(menu_id);
        menu_id_map[menu_key] = "";
      }
    }
    menu_id_map.auto_format = _GM_registerMenuCommand(
      (setting.auto_format ? "✔️ 已启用" : "❌ 已禁用") + "自动格式化正文",
      () => {
        setting.save("auto_format", setting.auto_format ? "false" : "true");
        utils.log(
          (setting.auto_format ? "✔️ 已启用" : "❌ 已禁用") + "自动格式化正文"
        );
        rerender_auto_format();
        recreate_menu_command();
      },
      "r"
    );
    if (setting.auto_format) {
      menu_id_map.auto_format_with_segment = _GM_registerMenuCommand(
        "　├─ " + (setting.auto_format_with_segment ? "✔️ 已启用" : "❌ 已禁用") + "自动重新分段",
        () => {
          setting.save(
            "auto_format_with_segment",
            setting.auto_format_with_segment ? "false" : "true"
          );
          utils.log(
            (setting.auto_format_with_segment ? "✔️ 已启用" : "❌ 已禁用") + "自动重新分段"
          );
          window.location.reload();
        },
        "r"
      );
      menu_id_map.format_font_name = _GM_registerMenuCommand(
        `　├─ 🗚 字体: "${setting.font_name}"`,
        () => {
          const font_name = prompt(
            "请输入自定义字体名称（需要电脑里已经安装好的字体）：",
            setting.font_name
          );
          if (font_name) {
            setting.save("font_name", font_name);
            utils.log(`字体设置为: "${font_name}"`);
            rerender_auto_format(false);
            recreate_menu_command();
          } else {
            utils.debug("用户取消输入");
          }
        },
        "f"
      );
      menu_id_map.format_font_size = _GM_registerMenuCommand(
        `　├─ 🗚 字体大小: ${setting.font_size} px`,
        () => {
          const font_size = Number(
            prompt(
              "请输入自定义字体大小，单位为像素(px)：",
              String(setting.font_size)
            )
          );
          if (font_size > 0) {
            setting.save("font_size", String(font_size));
            utils.log(`字体大小设置为：${font_size} px`);
            rerender_auto_format(false);
            recreate_menu_command();
          } else {
            utils.debug("用户取消输入");
          }
        },
        "s"
      );
      menu_id_map.edit_replace_pair = _GM_registerMenuCommand(
        "　└─ 🎭 设置自动替换关键词",
        () => {
          const current_replace_pair_str = Object.entries(
            setting.data.replace_pair_list
          ).map(([key, value]) => `${key}-${value}`).join(", ");
          const replace_pair_str = prompt(
            "请输入自动替换的关键词组：\n（格式为 `被替换词-替换词`，多个词组用英文逗号 `,` 分开）\n\n注意：只推荐替换中文全角字符，如果替换常见英文字符极有可能会导致乱码。若出现乱码请重新在此处设置以调试效果。",
            current_replace_pair_str || "“-「, ”-」, ‘-『, ’-』"
          );
          if (replace_pair_str !== null) {
            setting.data.replace_pair_list = {};
            _GM_setValue(`data_replace_pair_list`, "{}");
            if (replace_pair_str === "") {
              utils.debug("自动替换词组已清空");
              alert("自动替换词组已清空。");
            } else {
              for (const pair_str of replace_pair_str.split(",").map((pair) => pair.trim())) {
                const [pattern, replacement] = pair_str.split("-").map((keyword) => keyword.trim());
                setting.data.replace_pair_list[pattern] = replacement;
              }
              _GM_setValue(
                `data_replace_pair_list`,
                JSON.stringify(setting.data.replace_pair_list)
              );
              utils.debug("新的自动替换词组:", setting.data.replace_pair_list);
              alert("自动替换词组更新完成。");
            }
            window.location.reload();
          } else {
            utils.debug("用户取消输入");
          }
        }
      );
    }
    menu_id_map.switch_ip_warning = _GM_registerMenuCommand(
      (setting.block_ip_warning ? "❌ 已禁用" : "✔️ 已启用") + "异地 IP 登录提醒",
      () => {
        setting.save(
          "block_ip_warning",
          setting.block_ip_warning ? "false" : "true"
        );
        utils.log(
          (setting.block_ip_warning ? "❌ 已禁用" : "✔️ 已启用") + "异地 IP 登录提醒"
        );
        recreate_menu_command();
      }
    );
    menu_id_map.display_user_medal = _GM_registerMenuCommand(
      (setting.display_user_medal ? "✔️ 显示" : "❌ 隐藏") + "所有用户勋章",
      () => {
        setting.save(
          "display_user_medal",
          setting.display_user_medal ? "false" : "true"
        );
        utils.log(
          (setting.display_user_medal ? "✔️ 已显示" : "❌ 已隐藏") + "所有用户勋章"
        );
        window.location.reload();
      }
    );
    menu_id_map.go_to_report = _GM_registerMenuCommand(
      "🆕 提出需求 & 反馈 BUG",
      () => {
        _GM_openInTab(
          "https://mcseas.club/forum.php?mod=viewthread&tid=50579",
          false
        );
      }
    );
    menu_id_map.reset_config = _GM_registerMenuCommand("🆑 重置所有配置项", () => {
      const confirm_result = confirm(`确认清空保存的所有配置项？`);
      if (confirm_result == true) {
        for (const key of _GM_listValues()) {
          _GM_deleteValue(key);
        }
        alert("所有配置项均已清空。");
        window.location.reload();
      }
    });
  };
  window.block_user = (user_name) => {
    const confirm_result = confirm(
      `确认屏蔽 ${user_name} 发布的主题？
（屏蔽数据仅保存在本地，可以通过重置插件设置来取消屏蔽）`
    );
    if (confirm_result == true) {
      setting.data.user_blacklist.push(user_name);
      _GM_setValue(
        `data_user_blacklist`,
        JSON.stringify([...new Set(setting.data.user_blacklist)])
      );
      alert(`从今开始屏蔽用户 ${user_name} 发布的主题。`);
    }
  };
  utils.log("脚本当前版本:", setting.version);
  utils.log("启用自动格式化正文:", setting.auto_format);
  utils.log(`自动格式化时 正文字体: "${setting.font_name}"`);
  utils.log(`自动格式化时 正文字体大小: ${setting.font_size} px`);
  utils.log("自动格式化时 替换关键词:", setting.data.replace_pair_list);
  utils.log("自动格式化时 只格式化一楼:", setting.only_format_lz);
  utils.log("自动屏蔽异地 IP 登录提醒:", setting.block_ip_warning);
  utils.log("屏蔽用户黑名单:", setting.data.user_blacklist);
  recreate_menu_command();
  if (setting.block_ip_warning) {
    let block_ip_warning = function() {
      counter += 1;
      if (counter > 50)
        clearInterval(block_ip_timer);
      let close_button_nodes = document.querySelectorAll("#ip_notice .bm_h a");
      if (close_button_nodes.length === 1) {
        close_button_nodes[0].click();
        clearInterval(block_ip_timer);
      }
    };
    let block_ip_timer = setInterval(() => {
      setTimeout(block_ip_warning, 0);
    }, 50);
    let counter = 0;
  }
  let view_mode = new URL(window.location.href).searchParams.get("mod") ?? "";
  switch (view_mode) {
    case "forumdisplay":
      let thread_nodes = document.querySelectorAll(
        "#threadlisttableid tbody"
      );
      thread_nodes.forEach((thread_node) => {
        if (thread_node.id.startsWith("normalthread_")) {
          const thread_title_node = thread_node.querySelector(".cony_listzt_top a.cony_listzt_topbt");
          const thread_id = Number(
            new URL((thread_title_node == null ? void 0 : thread_title_node.href) ?? "").searchParams.get("tid")
          );
          const thread_title = (thread_title_node == null ? void 0 : thread_title_node.innerText) ?? "";
          const thread_author_node = thread_node.querySelector(".cony_listzt_bottom .z a");
          const uid = Number(
            new URL((thread_title_node == null ? void 0 : thread_title_node.href) ?? "").searchParams.get("uid")
          );
          const author_name = (thread_author_node == null ? void 0 : thread_author_node.innerText) ?? "";
          if (author_name && setting.data.user_blacklist.includes(author_name)) {
            thread_node.remove();
            utils.debug(
              `已屏蔽黑名单用户 "${author_name}"(uid:${uid}) 的主题 "${thread_title}"(tid:${thread_id})`
            );
          }
        }
      });
      style_nodes.custom_view_list = _GM_addStyle(
        `.tl th a:visited, .tl td.fn a:visited { color: #ccc; }`
      );
      utils.debug(
        `添加自定义样式 新增 CSS id: style#${(_a = style_nodes.custom_view_list) == null ? void 0 : _a.id}`
      );
      break;
    case "viewthread":
      if (!setting.display_user_medal) {
        let medal_nodes = document.querySelectorAll(".md_ctrl");
        medal_nodes.forEach((node) => {
          node.remove();
        });
      }
      let follow_node = document.querySelector("#follow_li");
      if (follow_node) {
        follow_node.style.width = "65px";
        if (follow_node.parentNode) {
          let list_item_node = document.createElement("li");
          list_item_node.setAttribute("class", "pm2");
          list_item_node.setAttribute(
            "style",
            "background-image: url('static/image/common/locked.gif');"
          );
          let block_user_button_node = document.createElement("a");
          block_user_button_node.setAttribute("href", "javascript:;");
          block_user_button_node.setAttribute("title", "屏蔽TA");
          block_user_button_node.setAttribute("class", "xi2");
          block_user_button_node.setAttribute(
            "onclick",
            `block_user("${(_d = (_c = (_b = follow_node.parentNode) == null ? void 0 : _b.parentNode) == null ? void 0 : _c.querySelector(
            ".authi a"
          )) == null ? void 0 : _d.innerText}")`
          );
          block_user_button_node.innerHTML = "屏蔽TA";
          list_item_node.append(block_user_button_node);
          follow_node.parentNode.append(list_item_node);
        }
      }
      const highlight_floor_pid = new URL(window.location.href).hash;
      if (highlight_floor_pid.startsWith("#pid")) {
        let highlight_floor_node = document.querySelector(highlight_floor_pid);
        if (highlight_floor_node) {
          (_e = highlight_floor_node.querySelector("td.plc")) == null ? void 0 : _e.classList.add("highlight-card");
          style_nodes.custom_highlight_floor = _GM_addStyle(
            `.highlight-card { background-color: #dedbcc; color: #363636; -moz-box-shadow: 0.075rem 0.125rem 0.25rem rgba(0, 0, 0, 0.5); -webkit-box-shadow: 0.075rem 0.125rem 0.25rem rgba(0, 0, 0, 0.5); box-shadow: 0.075rem 0.125rem 0.25rem rgba(0, 0, 0, 0.5); } .highlight-card:hover { -webkit-box-shadow: 0 0.325rem 1.75rem rgba(0, 0, 0, 0.3); -moz-box-shadow: 0 0.325rem 1.75rem rgba(0, 0, 0, 0.3); box-shadow: 0 0.325rem 1.75rem rgba(0, 0, 0, 0.3); }`
          );
          utils.debug(
            `高亮当前楼层 新增 CSS id: style#${style_nodes.custom_highlight_floor.id}`
          );
        }
      }
      (_f = document.querySelector("#append_parent")) == null ? void 0 : _f.classList.add("heti-parent");
      let breadcrumb_nodes = document.querySelectorAll("div#pt > div.z > a");
      if (breadcrumb_nodes.length > 4 && ["原创文学", "审核区", "小说"].includes(breadcrumb_nodes[3].innerText)) {
        let post_nodes = document.querySelectorAll("table.plhin td.plc");
        for (let i = 0, len = post_nodes.length; i < len; i++) {
          if (setting.only_format_lz && ((_g = post_nodes[i].querySelector("div.pi > strong > a")) == null ? void 0 : _g.innerText.trim()) !== "战列舰")
            break;
          let post_node = post_nodes[i].querySelector(".t_f");
          if (post_node) {
            post_node.classList.add("heti");
            if (setting.auto_format_with_segment) {
              post_node.innerHTML = post_node.innerHTML.split("\n").map((paragraph) => {
                const formatted_paragraph = paragraph.replaceAll("&nbsp;", " ").trim();
                return formatted_paragraph ? `　　${formatted_paragraph}` : "";
              }).join("\n");
              post_node.querySelectorAll("div, p, span").forEach((node) => {
                if (node.style.display !== "none") {
                  node.innerHTML = "　　" + node.innerHTML.replaceAll("&nbsp;", " ").trim();
                }
              });
            }
            for (let [pattern, replacement] of Object.entries(
              setting.data.replace_pair_list
            )) {
              post_node.innerHTML = post_node.innerHTML.replaceAll(
                pattern,
                replacement
              );
            }
          }
        }
      }
      rerender_auto_format();
      break;
    default:
      let block_email_warning = function() {
        counter += 1;
        if (counter > 50)
          clearInterval(block_email_timer);
        let skip_button_node = document.querySelector(
          "button#fwin_dialog_submit"
        );
        if (skip_button_node) {
          skip_button_node.click();
          clearInterval(block_email_timer);
        }
      };
      let block_email_timer = setInterval(() => {
        setTimeout(block_email_warning, 0);
      }, 50);
      let counter = 0;
  }

})();
// ==UserScript==
// @name         头歌助手 Educoder Helper
// @namespace    https://github.com/lcandy2/user.js/tree/main/websites/educoder.net/educoder-helper
// @version      2.8
// @author       甜檸Cirtron (lcandy2)
// @description  【本脚本需配合《头歌复制助手 Educoder Copy Helper》使用，使用脚本前请确保复制助手已安装】📝解除头歌复制粘贴限制，解除头哥复制缩短限制，支持考试；✨增加“一键复制”、“一键全部文件复制”、“导出全部文件”、“一键完成视频任务”等功能。🧹简单高效代码，无需权限配置，清除广告界面，全自动化签到，安装即用。💛安全开源可读，无论是编译前后的代码均保持开源和易读性，保护隐私与账号安全
// @license      AGPL-3.0-or-later
// @copyright    lcandy2 All Rights Reserved
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABsUlEQVR4nO2ZzUrDQBCAA3kM23NfJKuC4FW6vYjZV/DiK7SaeCxYKiRQE5qNB7EPUoT6A3op9GBFi5eeIhsMjNbW2s2apMwHc2t35tud3RxG0xTQ6IRlyw26thtMRFgu55ZzWdGKQKMTlm2Hj22XR1/C4eNTJyhpeceKdz4u+ur43N8QRdtOcP0p4Wt5x47bhkdwt+NTcXlkucFbJkVt7u2XCTW7RpVNCGVREjNtAuLopLmT/P/Qau4u+i0Ba4ocBmXhVu2gklrxBmVjmGQZgXr7YiokRPH1tj9dVoAkItR8EbmlBcTO/5TgN4G/BJmzPqFM/s7Atrm5fYggaQlA+oN72E7ydwbuyHfOeE+6+BbvzawLcyoVeByOpCRavBc9DUfZCaiCoAAAT2AFCLbQki2ke+9SkfkJoMAc8A5A8BldAYLPKABfIS/H3wFVEBRQdAdydwJ60QVUQVAAgN8BD78Dcqz1JdaL/ozqRRdQBUEBAJ5A1i1kgAGHGD6opj+4AwLmq7wAZeGCEZDiMD1pATEtFAO3fy++yp63a6yU4piV+WJmpbpwI85heqkVjyBrzgdOSyKlYdgYdgAAAABJRU5ErkJggg==
// @homepage     https://greasyfork.org/scripts/495493
// @homepageURL  https://greasyfork.org/scripts/495493
// @source       https://github.com/lcandy2/user.js/tree/main/websites/educoder.net/educoder-helper
// @match        *://www.educoder.net/tasks/*
// @match        *://www.educoder.net/classrooms/*
// @match        *://www.educoder.net/*
// @require      https://registry.npmmirror.com/vue/3.4.27/files/dist/vue.global.prod.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3B
// @require      https://registry.npmmirror.com/vuetify/3.6.6/files/dist/vuetify.min.js
// @require      data:application/javascript,%3B
// @require      https://registry.npmmirror.com/js-base64/3.7.7/files/base64.js
// @resource     VuetifyStyle  https://registry.npmmirror.com/vuetify/3.6.6/files/dist/vuetify.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/495493/%E5%A4%B4%E6%AD%8C%E5%8A%A9%E6%89%8B%20Educoder%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/495493/%E5%A4%B4%E6%AD%8C%E5%8A%A9%E6%89%8B%20Educoder%20Helper.meta.js
// ==/UserScript==

(function (vue, vuetify, jsBase64) {
  'use strict';

  const cssLoader = (e) => {
    const t = GM_getResourceText(e);
    return GM_addStyle(t), t;
  };
  cssLoader("VuetifyStyle");
  const getTaskInfo = () => {
    const href2 = window.location.href;
    const hrefUrl = new URL(href2);
    const pathname2 = hrefUrl.pathname;
    const parts = pathname2.substring(1).split("/");
    const courseId = parts[1];
    const shixunId = parts[2];
    const taskId = parts[3];
    return {
      courseId,
      shixunId,
      taskId
    };
  };
  const getVideoInfo = () => {
    const href2 = window.location.href;
    const hrefUrl = new URL(href2);
    const pathname2 = hrefUrl.pathname;
    const parts = pathname2.substring(1).split("/");
    const courseId = parts[1];
    const searchParams = hrefUrl.searchParams;
    const videoId = Number(searchParams.get("new_video_id"));
    const durationElement = document.querySelector("#duration");
    const durationText = durationElement == null ? void 0 : durationElement.textContent;
    let duration = -1;
    if (durationText) {
      const timeParts = durationText.split(":");
      const minutes = Number(timeParts[0]);
      const seconds = Number(timeParts[1]);
      const totalSeconds = minutes * 60 + seconds;
      const randomDecimal = Number(Math.random().toFixed(1));
      duration = totalSeconds + randomDecimal;
    }
    return {
      courseId,
      videoId,
      duration
    };
  };
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  const _hoisted_1$4 = {
    key: 0,
    style: { "display": "flex", "flex-direction": "row", "align-items": "center", "gap": "1em" }
  };
  const _hoisted_2$2 = {
    class: "text-body-2",
    style: { "margin": "0" }
  };
  const _sfc_main$8 = /* @__PURE__ */ vue.defineComponent({
    __name: "copy-all-content",
    props: {
      isActive: {}
    },
    setup(__props) {
      const props = __props;
      const closeDialog = () => {
        props.isActive.value = false;
      };
      const files = vue.ref([]);
      const isLoading = vue.ref(true);
      const progress = vue.ref(0);
      const progressMessage = vue.ref("");
      const isError = vue.ref(false);
      const allChecked = vue.ref(false);
      const helperNotInstalled = vue.ref(false);
      vue.onMounted(async () => {
        const window2 = _unsafeWindow;
        if (window2.educoderCopyHelper === void 0) {
          helperNotInstalled.value = true;
          isLoading.value = false;
          isError.value = true;
          return;
        }
        const paths = window2.taskChallengePath && window2.taskChallengePath.split("；").filter((value) => value !== "");
        if (paths) {
          for (const [index, path] of paths.entries()) {
            progress.value = (index + 1) / paths.length * 100;
            progressMessage.value = `正在获取文件：${path}`;
            const taskId = window2.taskId || getTaskInfo().taskId;
            const response = await fetch(
              `https://data.educoder.net/api/tasks/${taskId}/rep_content.json?path=${path}`,
              {
                credentials: "include",
                headers: {
                  "X-EDU-Signature": window2.xEduSignature || "",
                  "X-EDU-Timestamp": window2.xEduTimestamp || "",
                  "X-EDU-Type": window2.xEduType || "pc"
                }
              }
            );
            const res = await response.json();
            if (res && res.content && res.content.content) {
              const file = {
                name: path,
                content: jsBase64.decode(res.content.content),
                visible: true
              };
              files.value.push(file);
            }
          }
        }
        isLoading.value = false;
        if (files.value.length === 0) {
          isError.value = true;
        }
      });
      const filesContent = vue.computed(() => {
        if (isError.value) {
          if (helperNotInstalled.value) {
            return `获取代码失败！
本插件需要《头歌复制助手 EduCoder Copy Helper》安装并启用后方可使用。
请安装并启用后刷新页面再试。

Greasy Fork 安装地址：https://greasyfork.org/scripts/495490

ScriptCat脚本猫 安装地址：https://scriptcat.org/script-show-page/1860`;
          }
          return "获取代码失败，请刷新再试。";
        }
        return files.value.filter((file) => file.visible).map((file) => `${file.name}
\`\`\`
${file.content}\`\`\``).join("\n\n");
      });
      vue.watch(allChecked, (newValue) => {
        if (newValue) {
          files.value.forEach((file) => file.visible = newValue);
        }
      });
      vue.watch(
        () => files.value.map((file) => file.visible),
        (newValues) => {
          allChecked.value = newValues.every(Boolean);
        },
        { deep: true }
      );
      return (_ctx, _cache) => {
        const _component_v_checkbox_btn = vue.resolveComponent("v-checkbox-btn");
        const _component_v_textarea = vue.resolveComponent("v-textarea");
        const _component_v_card_text = vue.resolveComponent("v-card-text");
        const _component_v_progress_circular = vue.resolveComponent("v-progress-circular");
        const _component_v_btn = vue.resolveComponent("v-btn");
        const _component_v_spacer = vue.resolveComponent("v-spacer");
        const _component_v_card_actions = vue.resolveComponent("v-card-actions");
        const _component_v_card = vue.resolveComponent("v-card");
        return vue.openBlock(), vue.createBlock(_component_v_card, {
          loading: isLoading.value,
          title: "全部代码"
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_v_card_text, null, {
              default: vue.withCtx(() => [
                files.value.length ? (vue.openBlock(), vue.createBlock(_component_v_checkbox_btn, {
                  key: 0,
                  label: "全选",
                  modelValue: allChecked.value,
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => allChecked.value = $event),
                  onClick: _cache[1] || (_cache[1] = () => {
                    allChecked.value && files.value.forEach((file) => file.visible = false);
                  })
                }, null, 8, ["modelValue"])) : vue.createCommentVNode("", true),
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(files.value, (file, index) => {
                  return vue.openBlock(), vue.createBlock(_component_v_checkbox_btn, {
                    key: index,
                    label: file.name,
                    modelValue: file.visible,
                    "onUpdate:modelValue": ($event) => file.visible = $event
                  }, null, 8, ["label", "modelValue", "onUpdate:modelValue"]);
                }), 128)),
                vue.createVNode(_component_v_textarea, {
                  "auto-grow": "",
                  modelValue: filesContent.value,
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => filesContent.value = $event),
                  disabled: isLoading.value,
                  readonly: isError.value || isLoading.value,
                  placeholder: "全部代码将在这里显示",
                  loading: isLoading.value,
                  "persistent-placeholder": ""
                }, null, 8, ["modelValue", "disabled", "readonly", "loading"])
              ]),
              _: 1
            }),
            vue.createVNode(_component_v_card_actions, null, {
              default: vue.withCtx(() => [
                isLoading.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$4, [
                  vue.createVNode(_component_v_progress_circular, { "model-value": progress.value }, null, 8, ["model-value"]),
                  vue.createElementVNode("p", _hoisted_2$2, vue.toDisplayString(progressMessage.value), 1)
                ])) : vue.createCommentVNode("", true),
                helperNotInstalled.value ? (vue.openBlock(), vue.createBlock(_component_v_btn, {
                  key: 1,
                  text: "安装《头歌复制助手 EduCoder Copy Helper》",
                  variant: "elevated",
                  color: "primary",
                  href: "https://greasyfork.org/scripts/495490",
                  target: "_blank"
                })) : vue.createCommentVNode("", true),
                helperNotInstalled.value ? (vue.openBlock(), vue.createBlock(_component_v_btn, {
                  key: 2,
                  text: "通过 ScriptCat 脚本猫安装",
                  variant: "text",
                  color: "primary",
                  href: "https://scriptcat.org/script-show-page/1860",
                  target: "_blank"
                })) : vue.createCommentVNode("", true),
                vue.createVNode(_component_v_spacer),
                vue.createVNode(_component_v_btn, {
                  text: "关闭",
                  onClick: closeDialog
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["loading"]);
      };
    }
  });
  const _sfc_main$7 = /* @__PURE__ */ vue.defineComponent({
    __name: "copy-all",
    setup(__props) {
      return (_ctx, _cache) => {
        const _component_v_btn = vue.resolveComponent("v-btn");
        const _component_v_dialog = vue.resolveComponent("v-dialog");
        return vue.openBlock(), vue.createBlock(_component_v_dialog, {
          "max-width": "800",
          scrollable: ""
        }, {
          activator: vue.withCtx(({ props: activatorProps }) => [
            vue.createVNode(_component_v_btn, vue.mergeProps(activatorProps, {
              color: "surface-variant",
              text: "复制全部",
              variant: "flat"
            }), null, 16)
          ]),
          default: vue.withCtx(({ isActive }) => [
            vue.createVNode(_sfc_main$8, { "is-active": isActive }, null, 8, ["is-active"])
          ]),
          _: 1
        });
      };
    }
  });
  const _hoisted_1$3 = { style: { "display": "flex", "flex-direction": "row", "align-items": "center", "gap": "1em" } };
  const _hoisted_2$1 = {
    class: "text-body-1",
    style: { "margin": "0" }
  };
  const _hoisted_3$1 = /* @__PURE__ */ vue.createElementVNode("br", null, null, -1);
  const _hoisted_4$1 = /* @__PURE__ */ vue.createElementVNode("br", null, null, -1);
  const _hoisted_5$1 = /* @__PURE__ */ vue.createElementVNode("br", null, null, -1);
  const _hoisted_6$1 = /* @__PURE__ */ vue.createElementVNode("br", null, null, -1);
  const _hoisted_7$1 = /* @__PURE__ */ vue.createElementVNode("br", null, null, -1);
  const _hoisted_8$1 = /* @__PURE__ */ vue.createElementVNode("br", null, null, -1);
  const _hoisted_9$1 = /* @__PURE__ */ vue.createElementVNode("br", null, null, -1);
  const _sfc_main$6 = /* @__PURE__ */ vue.defineComponent({
    __name: "reset-all-content",
    props: {
      isActive: {},
      setIsPersistent: { type: Function }
    },
    setup(__props) {
      const props = __props;
      const closeDialog = () => {
        props.isActive.value = false;
      };
      const inProgress = vue.ref(false);
      const progress = vue.ref(-1);
      const progressMessage = vue.ref("准备开始");
      const isAvailable = vue.ref(false);
      const isError = vue.ref(false);
      const isWaitingForRefresh = vue.ref(false);
      const allPaths = vue.ref([]);
      const handleReset = async () => {
        inProgress.value = true;
        props.setIsPersistent(true);
        if (allPaths.value.length === 0) {
          inProgress.value = false;
          isError.value = true;
          props.setIsPersistent(false);
          return;
        }
        for (const [index, path] of allPaths.value.entries()) {
          if (allPaths.value.length > 1) {
            progress.value = (index + 1) / allPaths.value.length * 100;
          } else {
            progress.value = -1;
          }
          progressMessage.value = `正在重置：${path}`;
          const window2 = _unsafeWindow;
          const taskId = window2.taskId || getTaskInfo().taskId;
          const response = await fetch(
            `https://data.educoder.net/api/tasks/${taskId}/reset_original_code.json?path=${path}`,
            {
              credentials: "include",
              headers: {
                "X-EDU-Signature": window2.xEduSignature || "",
                "X-EDU-Timestamp": window2.xEduTimestamp || "",
                "X-EDU-Type": window2.xEduType || "pc"
              },
              cache: "no-store"
            }
          );
          const res = await response.json();
          if (res && res.content) {
            console.info(`重置成功：${path}`);
          } else {
            console.error(`重置失败：${path}`, res);
          }
          await new Promise((resolve) => setTimeout(resolve, 250));
        }
        progress.value = -1;
        progressMessage.value = "等待刷新";
        isWaitingForRefresh.value = true;
        window.onbeforeunload = null;
        await new Promise((resolve) => setTimeout(resolve, 1e3));
        window.location.reload();
        progressMessage.value = "重置完成，等待页面刷新";
        props.setIsPersistent(false);
      };
      vue.onMounted(() => {
        const window2 = _unsafeWindow;
        if (window2.educoderCopyHelper === void 0) {
          isAvailable.value = false;
          return;
        }
        isAvailable.value = true;
        const paths = window2.taskChallengePath && window2.taskChallengePath.split("；").filter((value) => value !== "");
        if (paths) {
          allPaths.value = paths;
        }
      });
      const handleRefresh = () => {
        window.location.reload();
      };
      return (_ctx, _cache) => {
        const _component_v_progress_circular = vue.resolveComponent("v-progress-circular");
        const _component_v_card_text = vue.resolveComponent("v-card-text");
        const _component_v_btn = vue.resolveComponent("v-btn");
        const _component_v_spacer = vue.resolveComponent("v-spacer");
        const _component_v_card = vue.resolveComponent("v-card");
        return vue.openBlock(), vue.createBlock(_component_v_card, {
          "prepend-icon": "mdi-alert",
          title: isError.value ? "重置失败" : isAvailable.value ? "重置全部代码？" : "依赖插件未安装",
          loading: inProgress.value
        }, {
          actions: vue.withCtx(() => [
            !isAvailable.value ? (vue.openBlock(), vue.createBlock(_component_v_btn, {
              key: 0,
              text: "安装插件",
              variant: "elevated",
              color: "primary",
              href: "https://greasyfork.org/scripts/495490",
              target: "_blank"
            })) : vue.createCommentVNode("", true),
            !isAvailable.value ? (vue.openBlock(), vue.createBlock(_component_v_btn, {
              key: 1,
              text: "脚本猫",
              variant: "text",
              color: "primary",
              href: "https://scriptcat.org/script-show-page/1860",
              target: "_blank"
            })) : vue.createCommentVNode("", true),
            vue.createVNode(_component_v_spacer),
            vue.createVNode(_component_v_btn, {
              disabled: inProgress.value,
              onClick: closeDialog
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode(vue.toDisplayString(isError.value ? "完成" : "取消"), 1)
              ]),
              _: 1
            }, 8, ["disabled"]),
            isAvailable.value && !isError.value && !isWaitingForRefresh.value ? (vue.openBlock(), vue.createBlock(_component_v_btn, {
              key: 2,
              disabled: inProgress.value,
              color: "error",
              variant: "tonal",
              onClick: handleReset
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode(" 重置所有代码 ")
              ]),
              _: 1
            }, 8, ["disabled"])) : vue.createCommentVNode("", true),
            isWaitingForRefresh.value ? (vue.openBlock(), vue.createBlock(_component_v_btn, {
              key: 3,
              color: "primary",
              variant: "tonal",
              onClick: handleRefresh
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode(" 手动刷新页面 ")
              ]),
              _: 1
            })) : vue.createCommentVNode("", true)
          ]),
          default: vue.withCtx(() => [
            inProgress.value ? (vue.openBlock(), vue.createBlock(_component_v_card_text, { key: 0 }, {
              default: vue.withCtx(() => [
                vue.createElementVNode("div", _hoisted_1$3, [
                  vue.createVNode(_component_v_progress_circular, {
                    "model-value": progress.value,
                    indeterminate: progress.value === -1
                  }, null, 8, ["model-value", "indeterminate"]),
                  vue.createElementVNode("p", _hoisted_2$1, vue.toDisplayString(progressMessage.value), 1)
                ])
              ]),
              _: 1
            })) : isError.value ? (vue.openBlock(), vue.createBlock(_component_v_card_text, { key: 1 }, {
              default: vue.withCtx(() => [
                vue.createTextVNode(" 重置失败，请刷新再试。 ")
              ]),
              _: 1
            })) : isAvailable.value ? (vue.openBlock(), vue.createBlock(_component_v_card_text, { key: 2 }, {
              default: vue.withCtx(() => [
                vue.createTextVNode(" 你确定要将所有代码恢复为初始状态？"),
                _hoisted_3$1,
                _hoisted_4$1,
                vue.createTextVNode(" 请注意，此操作不可撤销，所有未保存的代码将会丢失。 ")
              ]),
              _: 1
            })) : (vue.openBlock(), vue.createBlock(_component_v_card_text, { key: 3 }, {
              default: vue.withCtx(() => [
                vue.createTextVNode(" 本插件需要《头歌复制助手 EduCoder Copy Helper》安装并启用后方可使用。"),
                _hoisted_5$1,
                vue.createTextVNode("请安装并启用后刷新页面再试。 "),
                _hoisted_6$1,
                _hoisted_7$1,
                vue.createTextVNode(" Greasy Fork 安装地址：https://greasyfork.org/scripts/495490 "),
                _hoisted_8$1,
                _hoisted_9$1,
                vue.createTextVNode(" ScriptCat脚本猫 安装地址：https://scriptcat.org/script-show-page/1860 ")
              ]),
              _: 1
            }))
          ]),
          _: 1
        }, 8, ["title", "loading"]);
      };
    }
  });
  const _sfc_main$5 = /* @__PURE__ */ vue.defineComponent({
    __name: "reset-all",
    setup(__props) {
      const isPersistent = vue.ref(false);
      const setIsPersistent = (value) => {
        isPersistent.value = value;
      };
      return (_ctx, _cache) => {
        const _component_v_btn = vue.resolveComponent("v-btn");
        const _component_v_dialog = vue.resolveComponent("v-dialog");
        return vue.openBlock(), vue.createBlock(_component_v_dialog, {
          "max-width": "400",
          persistent: isPersistent.value
        }, {
          activator: vue.withCtx(({ props: activatorProps }) => [
            vue.createVNode(_component_v_btn, vue.mergeProps(activatorProps, {
              "prepend-icon": "mdi-restart",
              color: "warning",
              text: "全部重置",
              variant: "plain"
            }), null, 16)
          ]),
          default: vue.withCtx(({ isActive }) => [
            vue.createVNode(_sfc_main$6, {
              "is-active": isActive,
              "set-is-persistent": setIsPersistent
            }, null, 8, ["is-active"])
          ]),
          _: 1
        }, 8, ["persistent"]);
      };
    }
  });
  const _hoisted_1$2 = /* @__PURE__ */ vue.createElementVNode("br", null, null, -1);
  const _hoisted_2 = /* @__PURE__ */ vue.createElementVNode("br", null, null, -1);
  const _hoisted_3 = /* @__PURE__ */ vue.createElementVNode("br", null, null, -1);
  const _hoisted_4 = /* @__PURE__ */ vue.createElementVNode("br", null, null, -1);
  const _hoisted_5 = /* @__PURE__ */ vue.createElementVNode("br", null, null, -1);
  const _hoisted_6 = /* @__PURE__ */ vue.createElementVNode("br", null, null, -1);
  const _hoisted_7 = /* @__PURE__ */ vue.createElementVNode("b", null, "该门实验成绩无效。", -1);
  const _hoisted_8 = /* @__PURE__ */ vue.createElementVNode("br", null, null, -1);
  const _hoisted_9 = /* @__PURE__ */ vue.createElementVNode("br", null, null, -1);
  const _hoisted_10 = /* @__PURE__ */ vue.createElementVNode("br", null, null, -1);
  const _hoisted_11 = /* @__PURE__ */ vue.createElementVNode("br", null, null, -1);
  const _hoisted_12 = /* @__PURE__ */ vue.createElementVNode("br", null, null, -1);
  const _hoisted_13 = /* @__PURE__ */ vue.createElementVNode("br", null, null, -1);
  const _hoisted_14 = /* @__PURE__ */ vue.createElementVNode("br", null, null, -1);
  const _hoisted_15 = /* @__PURE__ */ vue.createElementVNode("br", null, null, -1);
  const _hoisted_16 = /* @__PURE__ */ vue.createElementVNode("br", null, null, -1);
  const _hoisted_17 = /* @__PURE__ */ vue.createElementVNode("br", null, null, -1);
  const _hoisted_18 = /* @__PURE__ */ vue.createElementVNode("br", null, null, -1);
  const _hoisted_19 = /* @__PURE__ */ vue.createElementVNode("b", null, "该门实验成绩无效。", -1);
  const _hoisted_20 = /* @__PURE__ */ vue.createElementVNode("br", null, null, -1);
  const _hoisted_21 = /* @__PURE__ */ vue.createElementVNode("br", null, null, -1);
  const _hoisted_22 = /* @__PURE__ */ vue.createElementVNode("br", null, null, -1);
  const _hoisted_23 = /* @__PURE__ */ vue.createElementVNode("br", null, null, -1);
  const _hoisted_24 = /* @__PURE__ */ vue.createElementVNode("br", null, null, -1);
  const _hoisted_25 = /* @__PURE__ */ vue.createElementVNode("br", null, null, -1);
  const _hoisted_26 = /* @__PURE__ */ vue.createElementVNode("br", null, null, -1);
  const _hoisted_27 = /* @__PURE__ */ vue.createElementVNode("br", null, null, -1);
  const _hoisted_28 = /* @__PURE__ */ vue.createElementVNode("br", null, null, -1);
  const _sfc_main$4 = /* @__PURE__ */ vue.defineComponent({
    __name: "get-anser-content",
    props: {
      isActive: {},
      setIsPersistent: { type: Function }
    },
    setup(__props) {
      const props = __props;
      const closeDialog = () => {
        props.isActive.value = false;
      };
      const waitingForReading = vue.ref(-1);
      const isInFirstCheck = vue.ref(true);
      const isInSecondCheck = vue.ref(false);
      const isInFinalResult = vue.ref(false);
      const isHidden = vue.ref(true);
      const answerInfo = vue.ref({
        answer_id: -1,
        answer_radio: -1,
        answer_score: -1
      });
      const answerContent = vue.ref("");
      const inProgress = vue.ref(false);
      const isError = vue.ref(false);
      const errorMessages = vue.ref("");
      const isWaitingForRefresh = vue.ref(false);
      const allPaths = vue.ref([]);
      const handleGetAnswerInfo = async () => {
        inProgress.value = true;
        const window2 = _unsafeWindow;
        const taskId = window2.taskId || getTaskInfo().taskId;
        const response = await fetch(
          `https://data.educoder.net/api/tasks/${taskId}/get_answer_info.json`,
          {
            credentials: "include",
            headers: {
              "X-EDU-Signature": window2.xEduSignature || "",
              "X-EDU-Timestamp": window2.xEduTimestamp || "",
              "X-EDU-Type": window2.xEduType || "pc"
            }
          }
        );
        const res = await response.json();
        if (res.status && res.status === 1 && res.message && res.message.answer_id) {
          isInSecondCheck.value = true;
          const answer_id = res.message.answer_id;
          const answer_radio = res.message.answer_radio || -1;
          const answer_score = res.message.answer_score || -1;
          answerInfo.value = {
            answer_id,
            answer_radio,
            answer_score
          };
        } else if (res.status && res.status === 3 && res.message && res.message[0] && res.message[0].answer_contents) {
          answerContent.value = res.message[0].answer_contents;
          isInFinalResult.value = true;
        } else {
          isError.value = true;
          errorMessages.value = JSON.stringify(res);
        }
        inProgress.value = false;
      };
      const handleUnclockAnswer = async () => {
        inProgress.value = true;
        const window2 = _unsafeWindow;
        const taskId = window2.taskId || getTaskInfo().taskId;
        const answer_id = answerInfo.value.answer_id;
        const url = new URL(
          `https://data.educoder.net/api/tasks/${taskId}/unlock_answer.json`
        );
        url.searchParams.append("answer_id", answer_id.toString());
        const response = await fetch(url.href, {
          credentials: "include",
          headers: {
            "X-EDU-Signature": window2.xEduSignature || "",
            "X-EDU-Timestamp": window2.xEduTimestamp || "",
            "X-EDU-Type": window2.xEduType || "pc"
          }
        });
        const res = await response.json();
        if (res && res.contents) {
          answerContent.value = res.contents;
          isInFinalResult.value = true;
        } else {
          isError.value = true;
          errorMessages.value = JSON.stringify(res);
        }
        inProgress.value = false;
      };
      const waitingForReadingDisabled = vue.computed(() => waitingForReading.value > 0);
      const isAvailable = vue.computed(() => isInFirstCheck || isInSecondCheck);
      vue.watch(
        () => waitingForReading.value,
        (value) => {
          if (value > 0) {
            setTimeout(() => {
              waitingForReading.value = value - 1;
            }, 1e3);
          }
        }
      );
      vue.watch(
        () => isInFirstCheck.value,
        (value) => {
          if (value) {
            isInFirstCheck.value = true;
            isInSecondCheck.value = false;
            isInFinalResult.value = false;
          }
        }
      );
      vue.watch(
        () => isInSecondCheck.value,
        (value) => {
          if (value) {
            isInFirstCheck.value = false;
            isInSecondCheck.value = true;
            isInFinalResult.value = false;
          }
        }
      );
      vue.watch(
        () => isInFinalResult.value,
        (value) => {
          if (value) {
            isInFirstCheck.value = false;
            isInSecondCheck.value = false;
            isInFinalResult.value = true;
          }
        }
      );
      vue.onMounted(() => {
        waitingForReading.value = 0;
        const window2 = _unsafeWindow;
        if (window2.educoderCopyHelper === void 0) {
          isInFirstCheck.value = false;
          return;
        }
        isInFirstCheck.value = true;
        if (window2.educoderAnswerHelper === void 0) {
          isHidden.value = true;
          return;
        }
        isHidden.value = false;
        const paths = window2.taskChallengePath && window2.taskChallengePath.split("；").filter((value) => value !== "");
        if (paths) {
          allPaths.value = paths;
        }
      });
      return (_ctx, _cache) => {
        const _component_v_card_text = vue.resolveComponent("v-card-text");
        const _component_v_textarea = vue.resolveComponent("v-textarea");
        const _component_v_btn = vue.resolveComponent("v-btn");
        const _component_v_spacer = vue.resolveComponent("v-spacer");
        const _component_v_card = vue.resolveComponent("v-card");
        return vue.openBlock(), vue.createBlock(_component_v_card, {
          "prepend-icon": "mdi-alert",
          title: isHidden.value ? "存在疑问？" : isError.value ? "查看答案失败" : isInFinalResult.value ? "答案已解锁" : isAvailable.value ? "查看答案？这将会留下记录！" : "依赖插件未安装",
          loading: inProgress.value
        }, {
          actions: vue.withCtx(() => [
            !isAvailable.value ? (vue.openBlock(), vue.createBlock(_component_v_btn, {
              key: 0,
              text: "安装插件",
              variant: "elevated",
              color: "primary",
              href: "https://greasyfork.org/scripts/495490",
              target: "_blank"
            })) : vue.createCommentVNode("", true),
            !isAvailable.value ? (vue.openBlock(), vue.createBlock(_component_v_btn, {
              key: 1,
              text: "脚本猫",
              variant: "text",
              color: "primary",
              href: "https://scriptcat.org/script-show-page/1860",
              target: "_blank"
            })) : vue.createCommentVNode("", true),
            vue.createVNode(_component_v_spacer),
            vue.createVNode(_component_v_btn, {
              disabled: inProgress.value,
              onClick: closeDialog
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode(vue.toDisplayString(isHidden.value ? "了解" : isError.value || isInFinalResult.value ? "完成" : "取消"), 1)
              ]),
              _: 1
            }, 8, ["disabled"]),
            isAvailable.value && !isError.value && !isWaitingForRefresh.value && isInFirstCheck.value && !isHidden.value ? (vue.openBlock(), vue.createBlock(_component_v_btn, {
              key: 2,
              disabled: inProgress.value || waitingForReadingDisabled.value,
              loading: inProgress.value,
              color: "error",
              variant: "tonal",
              onClick: handleGetAnswerInfo
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode(vue.toDisplayString(waitingForReadingDisabled.value ? `请等待 ${waitingForReading.value} 秒` : "已知晓上述内容，查看答案，并留下记录"), 1)
              ]),
              _: 1
            }, 8, ["disabled", "loading"])) : vue.createCommentVNode("", true),
            isAvailable.value && !isError.value && !isWaitingForRefresh.value && isInSecondCheck.value && !isHidden.value ? (vue.openBlock(), vue.createBlock(_component_v_btn, {
              key: 3,
              disabled: inProgress.value || waitingForReadingDisabled.value,
              loading: inProgress.value,
              color: "error",
              variant: "tonal",
              onClick: handleUnclockAnswer
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode(" 已知晓，解锁答案，并留下记录 ")
              ]),
              _: 1
            }, 8, ["disabled", "loading"])) : vue.createCommentVNode("", true)
          ]),
          default: vue.withCtx(() => [
            isHidden.value ? (vue.openBlock(), vue.createBlock(_component_v_card_text, { key: 0 }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("如果有使用上的疑问，请联系开发者。")
              ]),
              _: 1
            })) : isError.value ? (vue.openBlock(), vue.createBlock(_component_v_card_text, { key: 1 }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("查看答案失败，可能当前练习不存在答案，或刷新再试，信息未记录。"),
                _hoisted_1$2,
                _hoisted_2,
                vue.createTextVNode(vue.toDisplayString(errorMessages.value), 1)
              ]),
              _: 1
            })) : isInFirstCheck.value ? (vue.openBlock(), vue.createBlock(_component_v_card_text, { key: 2 }, {
              default: vue.withCtx(() => [
                vue.createTextVNode(" 你确定要查看当前练习答案？"),
                _hoisted_3,
                vue.createTextVNode("一旦查看答案，你的信息会被平台记录，可供老师查阅。"),
                _hoisted_4,
                _hoisted_5,
                vue.createTextVNode(" 被记录的查看答案操作会导致但不限于以下结果："),
                _hoisted_6,
                _hoisted_7,
                _hoisted_8,
                _hoisted_9,
                vue.createTextVNode(" 请注意，此操作不可撤销！"),
                _hoisted_10,
                vue.createTextVNode("一旦查看答案，便会不可逆转地留下记录。 ")
              ]),
              _: 1
            })) : isInSecondCheck.value ? (vue.openBlock(), vue.createBlock(_component_v_card_text, { key: 3 }, {
              default: vue.withCtx(() => [
                vue.createTextVNode(" 将花费 " + vue.toDisplayString(answerInfo.value.answer_score) + " 积分查看答案", 1),
                _hoisted_11,
                _hoisted_12,
                vue.createTextVNode(" answer_id: " + vue.toDisplayString(answerInfo.value.answer_id), 1),
                _hoisted_13,
                vue.createTextVNode(" answer_radio: " + vue.toDisplayString(answerInfo.value.answer_radio), 1),
                _hoisted_14,
                vue.createTextVNode(" answer_score: " + vue.toDisplayString(answerInfo.value.answer_score), 1),
                _hoisted_15,
                _hoisted_16,
                vue.createTextVNode(" 一旦查看答案，你的信息会被平台记录，可供老师查阅。"),
                _hoisted_17,
                vue.createTextVNode(" 可能导致但不限于以下结果："),
                _hoisted_18,
                _hoisted_19,
                _hoisted_20,
                _hoisted_21,
                vue.createTextVNode(" 你确定要继续吗？ ")
              ]),
              _: 1
            })) : isInFinalResult.value ? (vue.openBlock(), vue.createBlock(_component_v_card_text, { key: 4 }, {
              default: vue.withCtx(() => [
                vue.createTextVNode(" 答案解锁已被记录。"),
                _hoisted_22,
                _hoisted_23,
                vue.createVNode(_component_v_textarea, {
                  "auto-grow": "",
                  modelValue: answerContent.value,
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => answerContent.value = $event),
                  disabled: inProgress.value,
                  readonly: isError.value || inProgress.value,
                  placeholder: "答案将在这里显示",
                  loading: inProgress.value,
                  "persistent-placeholder": ""
                }, null, 8, ["modelValue", "disabled", "readonly", "loading"])
              ]),
              _: 1
            })) : (vue.openBlock(), vue.createBlock(_component_v_card_text, { key: 5 }, {
              default: vue.withCtx(() => [
                vue.createTextVNode(" 本插件需要《头歌复制助手 EduCoder Copy Helper》安装并启用后方可使用。"),
                _hoisted_24,
                vue.createTextVNode("请安装并启用后刷新页面再试。 "),
                _hoisted_25,
                _hoisted_26,
                vue.createTextVNode(" Greasy Fork 安装地址：https://greasyfork.org/scripts/495490 "),
                _hoisted_27,
                _hoisted_28,
                vue.createTextVNode(" ScriptCat脚本猫 安装地址：https://scriptcat.org/script-show-page/1860 ")
              ]),
              _: 1
            }))
          ]),
          _: 1
        }, 8, ["title", "loading"]);
      };
    }
  });
  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    __name: "get-anser",
    setup(__props) {
      const isPersistent = vue.ref(false);
      const setIsPersistent = (value) => {
        isPersistent.value = value;
      };
      return (_ctx, _cache) => {
        const _component_v_btn = vue.resolveComponent("v-btn");
        const _component_v_dialog = vue.resolveComponent("v-dialog");
        return vue.openBlock(), vue.createBlock(_component_v_dialog, {
          "max-width": "800",
          width: "600",
          scrollable: "",
          persistent: isPersistent.value
        }, {
          activator: vue.withCtx(({ props: activatorProps }) => [
            vue.createVNode(_component_v_btn, vue.mergeProps(activatorProps, {
              color: "surface-variant",
              text: "？",
              variant: "plain"
            }), null, 16)
          ]),
          default: vue.withCtx(({ isActive }) => [
            vue.createVNode(_sfc_main$4, {
              "is-active": isActive,
              "set-is-persistent": setIsPersistent
            }, null, 8, ["is-active"])
          ]),
          _: 1
        }, 8, ["persistent"]);
      };
    }
  });
  const _hoisted_1$1 = { style: { "display": "flex", "flex-direction": "row", "gap": "0.5em", "align-items": "center" } };
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "copy-entry",
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, [
          vue.createVNode(_sfc_main$3),
          vue.createVNode(_sfc_main$5),
          vue.createVNode(_sfc_main$7)
        ]);
      };
    }
  });
  const _hoisted_1 = { class: "d-flex flex-column ga-2" };
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "pass-video",
    setup(__props) {
      const isLoading = vue.ref(false);
      const isError = vue.ref(false);
      const isHelperNotInstalled = vue.ref(false);
      const progress = vue.ref(-1);
      const status = vue.ref("");
      const message = vue.ref("");
      const handlePassVideo = async () => {
        if (progress.value === -1) {
          observeTextContentChange();
        }
        isLoading.value = true;
        isError.value = false;
        isHelperNotInstalled.value = false;
        progress.value = 1;
        status.value = "触发开始播放事件中……";
        const window2 = _unsafeWindow;
        const educoderCopyHelper = Number(window2.educoderCopyHelper);
        if (window2.educoderCopyHelper === void 0 || educoderCopyHelper < 1.5) {
          isHelperNotInstalled.value = true;
          isLoading.value = false;
          isError.value = true;
          return;
        }
        const { duration } = getVideoInfo();
        message.value = `duration: ${duration}`;
        const playButton = document.querySelector("button#play");
        const muteButton = document.querySelector("button#volume-button");
        await waitTime(800);
        if (!isLoading.value) {
          return;
        }
        if (playButton) {
          message.value = "playButton found!";
          isLoading && muteButton.click();
          isLoading && playButton.click();
          progress.value = 2;
          status.value = "触发开始播放成功，等待触发完成播放视频事件……";
          await waitTwoTime();
          if (!isLoading.value) {
            return;
          }
          isLoading && playButton.click();
          isLoading && muteButton.click();
          progress.value = 3;
          status.value = "触发完成播放事件中……";
          const videoId = window2.videoId;
          const logId = window2.videoLogId;
          message.value = `videoId: ${videoId}, logId: ${logId}`;
          await waitTime(1200);
          if (!isLoading.value) {
            return;
          }
          const body = {
            ed: "1",
            point: duration,
            log_id: logId,
            total_duration: duration,
            watch_duration: duration
          };
          const response = await fetch(
            `https://data.educoder.net/api/watch_video_histories.json`,
            {
              credentials: "include",
              method: "POST",
              headers: {
                "Accept": "application/json",
                "Content-Type": "application/json; charset=utf-8",
                "X-EDU-Signature": window2.xEduSignature || "",
                "X-EDU-Timestamp": window2.xEduTimestamp || "",
                "X-EDU-Type": window2.xEduType || "pc"
              },
              body: JSON.stringify(body)
            }
          );
          const res = await response.json();
          message.value = res;
          if (res.status === 0) {
            progress.value = 4;
            status.value = `视频已完成，共计学习时长 ${duration} 秒。`;
            isLoading.value = false;
          } else {
            isError.value = true;
            isLoading.value = false;
          }
        } else {
          isError.value = true;
          isLoading.value = false;
        }
      };
      const observeTextContentChange = () => {
        var _a, _b;
        const vidContainer = document.querySelector("#video-container");
        const targetElement = (_b = (_a = vidContainer == null ? void 0 : vidContainer.parentElement) == null ? void 0 : _a.parentElement) == null ? void 0 : _b.parentElement;
        const firstChild = targetElement == null ? void 0 : targetElement.firstElementChild;
        if (firstChild) {
          const observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
              if (mutation.type === "characterData") {
                progress.value = 0;
                status.value = "点击“完成该视频”以开始";
                message.value = "";
                isLoading.value = false;
                isError.value = false;
                isHelperNotInstalled.value = false;
              }
            }
          });
          const config = { characterData: true, subtree: true };
          observer.observe(firstChild, config);
        } else {
          console.warn("First child element not found.");
        }
      };
      return (_ctx, _cache) => {
        const _component_v_btn = vue.resolveComponent("v-btn");
        const _component_v_card_actions = vue.resolveComponent("v-card-actions");
        const _component_v_card = vue.resolveComponent("v-card");
        const _component_v_card_subtitle = vue.resolveComponent("v-card-subtitle");
        const _component_v_spacer = vue.resolveComponent("v-spacer");
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          !isHelperNotInstalled.value ? (vue.openBlock(), vue.createBlock(_component_v_btn, {
            key: 0,
            color: "surface-variant",
            "max-width": "110px",
            text: "完成该视频",
            variant: "flat",
            onClick: handlePassVideo,
            loading: isLoading.value,
            disabled: isLoading.value
          }, null, 8, ["loading", "disabled"])) : vue.createCommentVNode("", true),
          isHelperNotInstalled.value ? (vue.openBlock(), vue.createBlock(_component_v_card, {
            key: 1,
            variant: "outlined",
            title: "必要插件未安装",
            subtitle: "请安装《头歌复制助手 EduCoder Copy Helper》1.5 及更新版本以使用该功能，如已安装，请尝试刷新页面重试。"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_v_card_actions, null, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_v_btn, {
                    text: "安装《头歌复制助手 EduCoder Copy Helper》",
                    variant: "elevated",
                    color: "surface-variant",
                    href: "https://greasyfork.org/scripts/495490",
                    target: "_blank"
                  }),
                  vue.createVNode(_component_v_btn, {
                    text: "通过 ScriptCat 脚本猫安装",
                    variant: "text",
                    color: "surface-variant",
                    href: "https://scriptcat.org/script-show-page/1860",
                    target: "_blank"
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          })) : progress.value >= 0 ? (vue.openBlock(), vue.createBlock(_component_v_card, {
            key: 2,
            loading: isLoading.value,
            variant: "outlined",
            title: progress.value === 4 ? "任务已完成" : progress.value === 0 ? "等待开始" : "正在完成该视频"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_v_card_subtitle, null, {
                default: vue.withCtx(() => [
                  vue.createTextVNode(vue.toDisplayString(isError.value ? "任务执行失败，请刷新再试。" : status.value), 1)
                ]),
                _: 1
              }),
              vue.createVNode(_component_v_card_actions, null, {
                default: vue.withCtx(() => [
                  vue.createTextVNode(" 步骤 " + vue.toDisplayString(progress.value) + " / 4 ", 1),
                  vue.createVNode(_component_v_spacer),
                  vue.createTextVNode(" " + vue.toDisplayString(message.value), 1)
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["loading", "title"])) : vue.createCommentVNode("", true)
        ]);
      };
    }
  });
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "video-entry",
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(_sfc_main$1);
      };
    }
  });
  const appendCopyAllButton = () => {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://registry.npmmirror.com/@mdi/font/7.4.47/files/css/materialdesignicons.min.css";
    document.head.appendChild(css);
    const vuetify$1 = vuetify.createVuetify({});
    const app = vue.createApp(_sfc_main$2);
    app.use(vuetify$1);
    const antRow = document.querySelectorAll(".ant-row");
    const host = document.createElement("div");
    let target = document.body;
    antRow.forEach((row) => {
      const innerDiv = row.querySelectorAll("div");
      innerDiv.forEach((div) => {
        if (div.className.includes("action-bar")) {
          target = div;
          return;
        }
      });
    });
    target.prepend(host);
    app.mount(host);
  };
  const appendPassVideoButton = () => {
    var _a, _b;
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://registry.npmmirror.com/@mdi/font/7.4.47/files/css/materialdesignicons.min.css";
    document.head.appendChild(css);
    const vuetify$1 = vuetify.createVuetify({});
    const app = vue.createApp(_sfc_main);
    app.use(vuetify$1);
    const vidContainer = document.querySelector("#video-container");
    const host = document.createElement("div");
    host.id = "educoder-helper-video-entry";
    let target = document.body;
    const targetElement = (_b = (_a = vidContainer.parentElement) == null ? void 0 : _a.parentElement) == null ? void 0 : _b.parentElement;
    const firstChild = targetElement == null ? void 0 : targetElement.firstElementChild;
    if (targetElement && firstChild) {
      targetElement.insertBefore(host, firstChild.nextSibling);
    } else {
      target.prepend(host);
    }
    app.mount(host);
  };
  const removeBanner = () => {
    const antSpinContainer = document.querySelector(".ant-spin-container");
    if (antSpinContainer && antSpinContainer.children.length >= 2) {
      const firstChild = antSpinContainer.children[0];
      const secondChild = antSpinContainer.children[1];
      if (!firstChild.className.includes("header") && secondChild.className.includes("header")) {
        firstChild.setAttribute("style", "display: none;");
      }
    }
  };
  const removeModal = () => {
    const adModal = document.querySelector("div.selfdomModal___doNCF");
    adModal == null ? void 0 : adModal.setAttribute("style", "display: none;");
  };
  const removeAffix = () => {
    const affixContainer = document.querySelector(".affixContainer___CWtV9");
    affixContainer == null ? void 0 : affixContainer.setAttribute("style", "display: none;");
  };
  const removeUserSelectLimit = () => {
    const qItemElement = document.querySelector(".questionItem___q6Hgu > *");
    if (qItemElement) {
      qItemElement.style.userSelect = "text";
      const firstChild = qItemElement.querySelector(":first-child");
      if (firstChild) {
        firstChild.style.userSelect = "none";
      }
    }
  };
  const removeContextMenuLimit = () => {
    document.addEventListener("contextmenu", function(event) {
      event.stopPropagation();
    }, true);
  };
  const observerCopyAll = () => {
    const observer = new MutationObserver((mutationsList, observer2) => {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          const antRow = document.querySelector(".ant-row");
          if (antRow) {
            appendCopyAllButton();
            observer2.disconnect();
            break;
          }
        }
      }
    });
    const config = { childList: true, subtree: true };
    observer.observe(document, config);
  };
  const observerPassVideo = () => {
    const observer = new MutationObserver((mutationsList, observer2) => {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          const vidContainer = document.querySelector("#video-container");
          const vidEntry = document.querySelector("#educoder-helper-video-entry");
          if (vidContainer && !vidEntry) {
            appendPassVideoButton();
            observer2.disconnect();
            break;
          }
        }
      }
    });
    const config = { childList: true, subtree: true };
    observer.observe(document, config);
  };
  const observerAdRemove = () => {
    const observer = new MutationObserver((mutationsList, observer2) => {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          const headerElement = document.querySelector(".ant-layout-header");
          const modalElement = document.querySelector(".selfdomModal___doNCF");
          const affixElement = document.querySelector(".affixContainer___CWtV9");
          if (headerElement || modalElement || affixElement) {
            removeBanner();
            removeModal();
            removeAffix();
            break;
          }
        }
      }
    });
    const config = { childList: true, subtree: true };
    observer.observe(document, config);
  };
  const observerExerciseCopyLimit = () => {
    const observer = new MutationObserver((mutationsList, observer2) => {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          const qItemElement = document.querySelector(".questionItem___q6Hgu");
          if (qItemElement) {
            removeUserSelectLimit();
            removeContextMenuLimit();
            break;
          }
        }
      }
    });
    const config = { childList: true, subtree: true };
    observer.observe(document, config);
  };
  function waitTwoTime() {
    const randomTime = 2.5 + Math.random() * (5 - 2.5);
    const randomTimeInMilliseconds = randomTime * 1e3;
    return new Promise((resolve) => setTimeout(resolve, randomTimeInMilliseconds));
  }
  function waitTime(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  const postCheckIn = () => {
    const asyncPostCheckIn = async () => {
      const window2 = _unsafeWindow;
      const educoderCopyHelper = Number(window2.educoderCopyHelper);
      if (window2.educoderCopyHelper === void 0 || educoderCopyHelper < 2) {
        return;
      }
      const response = await fetch(
        `https://data.educoder.net/api/users/attendance.json`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json; charset=utf-8",
            "X-EDU-Signature": window2.xEduSignature || "",
            "X-EDU-Timestamp": window2.xEduTimestamp || "",
            "X-EDU-Type": window2.xEduType || "pc"
          }
        }
      );
      try {
        const data = await response.json();
        console.debug("[educoder-helper] postCheckIn", data);
      } catch (e) {
        console.error("[educoder-helper] postCheckIn", e);
      }
    };
    requestIdleCallback(() => {
      setTimeout(async () => {
        await asyncPostCheckIn();
      }, 1e3);
    });
  };
  const href = window.location.href;
  const pathname = window.location.pathname;
  if (href.includes("tasks")) {
    observerCopyAll();
  }
  if (href.includes("video_info")) {
    observerPassVideo();
  }
  observerAdRemove();
  if (pathname.includes("exercise")) {
    observerExerciseCopyLimit();
  }
  postCheckIn();
  console.debug("[educoder-helper] main.ts loaded!");

})(Vue, Vuetify, Base64);
// ==UserScript==
// @name         hunau-jwxt-course-selector
// @namespace    https://github.com/lcandy2/hunau-jwxt-course-selector
// @version      4.14
// @author       甜檸Cirtron (lcandy2)
// @license      None
// @icon         http://www.qzdatasoft.com/favicon.ico
// @homepage     https://greasyfork.org/scripts/483941
// @homepageURL  https://greasyfork.org/scripts/483941
// @match        *://*.edu.cn/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.4.30/dist/vue.global.prod.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3B
// @require      https://registry.npmmirror.com/vuetify/3.6.10/files/dist/vuetify.min.js
// @require      data:application/javascript,%3B
// @resource     VuetifyStyle  https://registry.npmmirror.com/vuetify/3.6.10/files/dist/vuetify.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-start
// @description qiangzhi-course-select
// @downloadURL https://update.greasyfork.org/scripts/483941/hunau-jwxt-course-selector.user.js
// @updateURL https://update.greasyfork.org/scripts/483941/hunau-jwxt-course-selector.meta.js
// ==/UserScript==

(function (vue, vuetify) {
  'use strict';

  const REQUEST_DATA = {
    sEcho: "1",
    iColumns: "1",
    sColumns: "",
    iDisplayStart: "0",
    iDisplayLength: "1",
    mDataProp_0: "kch",
    // 课程号
    mDataProp_1: "kcmc",
    // 课程名称
    mDataProp_2: "fzmc",
    // 分组名称
    mDataProp_3: "slks",
    // 合班
    mDataProp_4: "xf",
    // 学分
    mDataProp_5: "skls",
    // 上课教室
    mDataProp_6: "sksj",
    // 上课时间
    mDataProp_7: "skdd",
    // 上课地点
    mDataProp_8: "xqmc",
    // 上课校区
    mDataProp_9: "syrs",
    // 剩余容量
    mDataProp_10: "ctsm",
    // 时间冲突
    mDataProp_11: "czOper",
    // 操作
    mDataProp_12: "cstm"
  };
  const JWXT = "jsxsd";
  const xsxkBxxk = "xsxkBxxk?1=1&kcxx=&skls=&skfs=";
  const xsxkGgxxkxk = "xsxkGgxxkxk?kcxx=&skls=&skxq=&skjc=&sfym=false&sfct=true&szjylb=&sfxx=true&skfs=";
  const xsxkXxxk = "xsxkXxxk?1=1&kcxx=&skls=&skfs=";
  const ggxxkxkOper = "ggxxkxkOper";
  const xxxkOper = "xxxkOper?cfbs=null&xkzy=&trjf=";
  const GET_XSXKKC = () => {
    const href2 = window.location.href;
    const index = href2.indexOf(JWXT);
    if (index !== -1) {
      const url = href2.slice(0, index + JWXT.length + 1) + "xsxkkc/";
      return new URL(url);
    } else {
      return null;
    }
  };
  const GET_BXXK_URL = () => {
    const xsxkkc = GET_XSXKKC();
    if (xsxkkc) {
      return new URL(xsxkkc + xsxkBxxk);
    } else {
      return null;
    }
  };
  const GET_GGXXKXK_URL = () => {
    const xsxkkc = GET_XSXKKC();
    if (xsxkkc) {
      return new URL(xsxkkc + xsxkGgxxkxk);
    } else {
      return null;
    }
  };
  const GET_XXXK_URL = () => {
    const xsxkkc = GET_XSXKKC();
    if (xsxkkc) {
      return new URL(xsxkkc + xsxkXxxk);
    } else {
      return null;
    }
  };
  const GET_GGXXKXK_OPER_URL = () => {
    const xsxkkc = GET_XSXKKC();
    if (xsxkkc) {
      return new URL(xsxkkc + ggxxkxkOper);
    } else {
      return false;
    }
  };
  const GET_XXXK_OPER_URL = () => {
    const xsxkkc = GET_XSXKKC();
    if (xsxkkc) {
      return new URL(xsxkkc + xxxkOper);
    } else {
      return false;
    }
  };
  const jsonToQueryString = (json) => {
    return Object.keys(json).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`).join("&");
  };
  const getVersion = () => {
    const version = "4.14";
    return version.toString();
  };
  const postFetch = (url, body) => {
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest"
      },
      body
    });
  };
  const getFetch = (url) => {
    return fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest"
      }
    });
  };
  const formatText = (text) => {
    const noNbsp = text.replace(/&nbsp;/g, " ");
    const noBr = noNbsp.replace(/<br>/g, "\n");
    return noBr;
  };
  const getStuCourseData = async (url, ignoreConflict = false) => {
    const stuDataCourses = [];
    const reqData = REQUEST_DATA;
    ignoreConflict && url.searchParams.set("sfct", false.toString());
    console.log("ignoreConflict", ignoreConflict, url);
    try {
      const res1 = await postFetch(url, jsonToQueryString(reqData));
      if (res1.status !== 200) {
        throw new Error("获取选课列表失败，可能是选课未开放，或者是网络错误");
      }
      const res1Json = await res1.json();
      if (res1Json.iTotalRecords === 0) {
        if (url.toString().includes("xsxkGgxxkxk")) {
          return null;
        }
        return stuDataCourses;
      }
      try {
        reqData.iColumns = res1Json.iTotalRecords;
        reqData.iDisplayLength = res1Json.iTotalRecords;
        const resAll = await postFetch(url, jsonToQueryString(reqData));
        const resAllJson = await resAll.json();
        resAllJson.aaData.forEach((item, index) => {
          stuDataCourses.push({
            id: index + 1,
            name: item.kcmc + (item.fzmc ? ` - ${item.fzmc}` : ""),
            teacher: item.skls,
            schedule: `${formatText(item.sksj)}`,
            location: `${formatText(item.skdd)}`,
            remainingCapacity: item.syrs,
            conflicts: item.ctsm,
            advancedInfo: `kcid: ${item.jx02id}
jx0404id: ${item.jx0404id}`,
            kcid: item.jx02id,
            jx0404id: item.jx0404id,
            kcmc: item.kcmc,
            fzmc: item.fzmc,
            false: false
          });
        });
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
      return null;
    }
    return stuDataCourses;
  };
  const operCourseSelect = async (url, kcid, jx0404id) => {
    const xsxkUrl = url;
    const reqParams = xsxkUrl.searchParams;
    reqParams.set("kcid", kcid);
    reqParams.set("jx0404id", jx0404id);
    xsxkUrl.search = reqParams.toString();
    try {
      const response = await getFetch(xsxkUrl);
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error(error);
    }
  };
  const delay = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  const _hoisted_1 = { class: "text-overline" };
  const _hoisted_2 = { class: "text-caption" };
  const _hoisted_3 = {
    class: "text-overline",
    style: { "height": "28px" }
  };
  const _hoisted_4 = {
    class: "text-h6",
    style: { "height": "28px" }
  };
  const _hoisted_5 = { class: "text-subtitle-2" };
  const _hoisted_6 = {
    class: "text-subtitle-2",
    style: { "height": "18px" }
  };
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      const courseType = vue.ref("BXXK");
      const isBXXK = vue.computed(() => courseType.value === "BXXK");
      const isXXXK = vue.computed(() => courseType.value === "XXXK");
      const isGGXXKXK = vue.computed(
        () => courseType.value === "GGXXKXK" || courseType.value === "GGXXKXK_ALL"
      );
      const isGGXXKXK_ALL = vue.computed(() => courseType.value === "GGXXKXK_ALL");
      const isStuCourseDataLoading = vue.ref(false);
      const stuCourseData = vue.ref([]);
      const stuCourseDataSelected = vue.ref([]);
      const stuCourseDataSelectedRange = vue.ref([0, 1]);
      const isStuCourseDataAllSelected = vue.ref(false);
      const stuCourseHeaders = [
        { key: "id", title: "序号" },
        { key: "name", title: "课程名称" },
        { key: "teacher", title: "授课教师" },
        { key: "schedule", title: "上课时间" },
        { key: "location", title: "上课地点" },
        { key: "remainingCapacity", title: "剩余人数" },
        { key: "conflicts", title: "时间冲突" },
        // { key: "kcid", title: "kcid" },
        // { key: "jx0404id", title: "jx0404id" },
        { key: "advancedInfo", title: "CODE" }
      ];
      const searchName = vue.ref("");
      const searchTeacher = vue.ref("");
      const isActivatorRunning = vue.ref(false);
      const isActivated = vue.ref(false);
      const activatorMessage = vue.ref("");
      const activatorTimes = vue.ref(0);
      const isGlobalLoading = vue.computed(
        () => isActivatorRunning.value || isStuCourseDataLoading.value || isSelectorRunning.value
      );
      const isGlobalNeedLogin = vue.ref(false);
      const isGlobalNeedReLogin = vue.ref(false);
      const globalCurrentTime = vue.ref(/* @__PURE__ */ new Date());
      const isSelectorRunning = vue.ref(false);
      const selectorCourseDataStatus = vue.ref([]);
      const selectorCourseDataMessage = vue.ref([]);
      const selectorCourseDataTimes = vue.ref([]);
      const href2 = window.location.href;
      const isXklcView2 = href2.includes("xklc_list");
      const getCourseSelectorUrl = () => {
        const links = Array.from(document.querySelectorAll("a"));
        const courseLinks = links.filter(
          (link) => {
            var _a;
            return (_a = link.textContent) == null ? void 0 : _a.includes("选课");
          }
        );
        const hrefs = courseLinks.map((link) => link.href);
        return hrefs[0] || "/jsxsd/xsxk/xklc_list";
      };
      const getActivator_jx0502zbid = () => {
        const links = Array.from(document.querySelectorAll("a"));
        const activatorLinks = links.filter(
          (link) => link.href.includes("jx0502zbid")
        );
        const hrefs = activatorLinks.map((link) => link.href);
        if (hrefs.length > 0) {
          const url = new URL(`http://${window.location.host}${hrefs[0]}`);
          return url.searchParams.get("jx0502zbid") || "";
        }
        return "";
      };
      const getActivator_url = () => {
        const jx0502zbid = getActivator_jx0502zbid();
        if (jx0502zbid) {
          const href22 = window.location.href;
          const index = href22.indexOf(JWXT);
          const url = `${href22.slice(0, index + JWXT.length)}/xsxk/xsxk_index?jx0502zbid=${jx0502zbid}`;
          return url;
        }
        return null;
      };
      const tryActivate = async () => {
        if (isActivated.value || !isActivatorRunning.value) {
          isActivatorRunning.value = false;
          return;
        }
        activatorMessage.value = "";
        activatorTimes.value += 1;
        isActivatorRunning.value = true;
        const url = getActivator_url();
        if (url) {
          const res = await getFetch(url);
          const resText = await res.text();
          const parser = new DOMParser();
          const resDom = parser.parseFromString(resText, "text/html");
          const resBody = resDom.body.textContent;
          console.log(res, resText, resDom, resBody);
          activatorMessage.value = resBody || "";
          if (resBody && resBody.includes("登录")) {
            isGlobalNeedReLogin.value = true;
            isActivated.value = false;
          } else {
            isGlobalNeedReLogin.value = false;
          }
          await getCourseData();
          await delay(400);
          await tryActivate();
        }
      };
      const trySelectCourse = async () => {
        const getOperUrl = () => {
          if (isBXXK.value || isXXXK.value) {
            return GET_XXXK_OPER_URL();
          } else if (isGGXXKXK.value) {
            return GET_GGXXKXK_OPER_URL();
          }
        };
        const operUrl = getOperUrl();
        if (!isSelectorRunning.value || !operUrl) {
          isSelectorRunning.value = false;
          return;
        }
        isSelectorRunning.value = true;
        if (!isActivated.value) {
          isActivatorRunning.value = true;
          activatorTimes.value = 0;
          await tryActivate();
        }
        const status = selectorCourseDataStatus.value;
        const selected = stuCourseDataSelected.value;
        const message = selectorCourseDataMessage.value;
        const times = selectorCourseDataTimes.value;
        for (let i = 0; i < selected.length; i++) {
          if (status[i] === 3 || status[i] === 2 || !isSelectorRunning.value)
            continue;
          status[i] = -1;
          status[i] = 1;
          times[i] += 1;
          if (isSelectorRunning.value) {
            console.log("trySelectCourse", selected[i]);
            const xkResult = await operCourseSelect(
              operUrl,
              selected[i].kcid,
              selected[i].jx0404id
            );
            const xkMessage = xkResult.message;
            const xkResultString = JSON.stringify(xkResult);
            const isXkFailed = xkResultString.includes("失败") || xkResultString.includes("稍后");
            const isXkConflict = xkResultString.includes("冲突");
            const isXkNeedLogin = xkResultString.includes("登录");
            const isXkSelected = xkResultString.includes("已选");
            const isXkTypeError = xkResultString.includes("类型");
            const isXkSuccess = xkResult.success && !(isXkFailed || isXkConflict || isXkNeedLogin || isXkSelected);
            if (isXkNeedLogin) {
              isGlobalNeedLogin.value = true;
            }
            if (isXkSuccess) {
              status[i] = 3;
            } else if (isXkConflict || isXkNeedLogin || isXkSelected || isXkTypeError) {
              status[i] = 2;
            } else {
              status[i] = 0;
            }
            message[i] = xkMessage;
            await delay(50);
          }
        }
        if ((status.includes(-1) || status.includes(0)) && isSelectorRunning.value) {
          await delay(300);
          await trySelectCourse();
        } else {
          isSelectorRunning.value = false;
        }
      };
      const resetSelectorStatus = () => {
        selectorCourseDataStatus.value = Array(
          stuCourseDataSelected.value.length
        ).fill(-1);
        selectorCourseDataMessage.value = Array(
          stuCourseDataSelected.value.length
        ).fill("");
        selectorCourseDataTimes.value = Array(
          stuCourseDataSelected.value.length
        ).fill(0);
      };
      const getCourseData = async () => {
        if (!isXklcView2) return;
        if (isGlobalNeedReLogin) {
          isActivated.value = false;
          await getFetch("/sso.jsp");
        }
        isStuCourseDataLoading.value = true;
        const getUrl = () => {
          if (isBXXK.value) {
            return GET_BXXK_URL();
          } else if (isXXXK.value) {
            return GET_XXXK_URL();
          } else if (isGGXXKXK.value) {
            return GET_GGXXKXK_URL();
          }
        };
        const dataUrl = getUrl();
        if (dataUrl) {
          const data = await getStuCourseData(dataUrl, isGGXXKXK_ALL.value && true);
          console.log("getCourseData", data);
          if (data !== null) {
            if (!isGGXXKXK.value) {
              isActivated.value = true;
            } else {
              const bxxk = GET_BXXK_URL();
              if (bxxk) {
                const bxxkData = await getStuCourseData(bxxk);
                if (bxxkData !== null) {
                  isActivated.value = true;
                }
              }
            }
          }
          stuCourseData.value = data ? data : [];
        } else {
          console.error("dataUrl is not valid");
          stuCourseData.value = [];
        }
        isStuCourseDataLoading.value = false;
      };
      const filteredStuCourseData = vue.computed(() => {
        const filteredByTeacher = vue.computed(() => {
          if (!searchTeacher.value || searchTeacher.value === "*") return stuCourseData.value;
          return stuCourseData.value.filter(
            (course) => course.teacher.includes(searchTeacher.value)
          );
        });
        const filteredByName = vue.computed(() => {
          if (!searchName.value || searchName.value === "*") return stuCourseData.value;
          return stuCourseData.value.filter(
            (course) => course.name.includes(searchName.value)
          );
        });
        return filteredByName.value.filter(
          (course) => filteredByTeacher.value.includes(course)
        );
      });
      vue.watch(courseType, getCourseData, { immediate: true });
      vue.watch(
        [
          filteredStuCourseData,
          stuCourseDataSelectedRange,
          isStuCourseDataAllSelected
        ],
        ([newVal, newRange]) => {
          if (isStuCourseDataAllSelected.value) {
            stuCourseDataSelected.value = newVal;
          } else if (newVal.length > 0) {
            stuCourseDataSelected.value = newVal.slice(newRange[0], newRange[1]);
          } else {
            stuCourseDataSelected.value = [];
          }
        },
        { immediate: true }
      );
      vue.watch(
        filteredStuCourseData,
        (newVal) => {
          if (newVal.length > 0) {
            const range = stuCourseDataSelectedRange.value;
            const max = range[1] <= newVal.length ? range[1] : newVal.length > 0 ? newVal.length : 1;
            const min = range[0] < max ? range[0] : 0;
            if (max !== range[1] || min !== range[0]) {
              stuCourseDataSelectedRange.value = [min, max];
            }
          }
        },
        { immediate: true }
      );
      vue.watch(
        stuCourseDataSelected,
        (newVal) => {
          if (newVal.length > 0) {
            resetSelectorStatus();
          } else {
            selectorCourseDataStatus.value = [];
            selectorCourseDataMessage.value = [];
            selectorCourseDataTimes.value = [];
          }
        },
        { immediate: true }
      );
      let intervalId;
      vue.onMounted(() => {
        intervalId = setInterval(() => {
          globalCurrentTime.value = /* @__PURE__ */ new Date();
        }, 1e3);
      });
      vue.onUnmounted(() => {
        clearInterval(intervalId);
      });
      return (_ctx, _cache) => {
        const _component_v_card_title = vue.resolveComponent("v-card-title");
        const _component_v_card_subtitle = vue.resolveComponent("v-card-subtitle");
        const _component_v_btn = vue.resolveComponent("v-btn");
        const _component_v_card_text = vue.resolveComponent("v-card-text");
        const _component_v_btn_toggle = vue.resolveComponent("v-btn-toggle");
        const _component_v_row = vue.resolveComponent("v-row");
        const _component_v_col = vue.resolveComponent("v-col");
        const _component_v_text_field = vue.resolveComponent("v-text-field");
        const _component_v_range_slider = vue.resolveComponent("v-range-slider");
        const _component_v_checkbox_btn = vue.resolveComponent("v-checkbox-btn");
        const _component_v_progress_circular = vue.resolveComponent("v-progress-circular");
        const _component_v_card = vue.resolveComponent("v-card");
        const _component_v_data_table = vue.resolveComponent("v-data-table");
        const _component_v_card_actions = vue.resolveComponent("v-card-actions");
        return vue.openBlock(), vue.createBlock(_component_v_card, {
          variant: "outlined",
          loading: isGlobalLoading.value,
          class: "mb-4"
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_v_card_title, null, {
              default: vue.withCtx(() => [
                vue.createTextVNode("选课助手"),
                vue.createElementVNode("span", _hoisted_1, "v" + vue.toDisplayString(vue.unref(getVersion)()), 1),
                vue.createElementVNode("span", _hoisted_2, vue.toDisplayString(globalCurrentTime.value.toLocaleTimeString()), 1)
              ]),
              _: 1
            }),
            !vue.unref(isXklcView2) ? (vue.openBlock(), vue.createBlock(_component_v_card_subtitle, { key: 0 }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("HUNAU JWXT Course Selector ")
              ]),
              _: 1
            })) : (vue.openBlock(), vue.createBlock(_component_v_card_subtitle, { key: 1 }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("HUNAU JWXT Course Selector " + vue.toDisplayString(getActivator_jx0502zbid()) + " " + vue.toDisplayString(isActivatorRunning.value ? "正在激活" : isActivated.value ? "已激活" : "未激活") + vue.toDisplayString(activatorMessage.value ? `：${activatorMessage.value}` : ""), 1)
              ]),
              _: 1
            })),
            !vue.unref(isXklcView2) ? (vue.openBlock(), vue.createBlock(_component_v_card_text, { key: 2 }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_v_btn, {
                  block: "",
                  color: "primary",
                  variant: "elevated",
                  size: "x-large",
                  rounded: "lg",
                  elevation: "4",
                  href: getCourseSelectorUrl()
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("进入选课页面 ")
                  ]),
                  _: 1
                }, 8, ["href"])
              ]),
              _: 1
            })) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 3 }, [
              vue.createVNode(_component_v_col, null, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_v_col, null, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_v_row, { class: "ga-4" }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_v_btn_toggle, {
                            modelValue: courseType.value,
                            "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => courseType.value = $event),
                            variant: "outlined",
                            color: "indigo",
                            divided: "",
                            disabled: isSelectorRunning.value
                          }, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_v_btn, {
                                value: "BXXK",
                                onClick: _cache[0] || (_cache[0] = ($event) => courseType.value = "BXXK")
                              }, {
                                default: vue.withCtx(() => [
                                  vue.createTextVNode("公共必修课 ")
                                ]),
                                _: 1
                              }),
                              vue.createVNode(_component_v_btn, {
                                value: "XXXK",
                                onClick: _cache[1] || (_cache[1] = ($event) => courseType.value = "XXXK")
                              }, {
                                default: vue.withCtx(() => [
                                  vue.createTextVNode("专业选修课 ")
                                ]),
                                _: 1
                              }),
                              vue.createVNode(_component_v_btn, {
                                value: "GGXXKXK",
                                onClick: _cache[2] || (_cache[2] = ($event) => courseType.value = "GGXXKXK")
                              }, {
                                default: vue.withCtx(() => [
                                  vue.createTextVNode("公共选修课 ")
                                ]),
                                _: 1
                              }),
                              vue.createVNode(_component_v_btn, {
                                value: "GGXXKXK_ALL",
                                onClick: _cache[3] || (_cache[3] = ($event) => courseType.value = "GGXXKXK_ALL")
                              }, {
                                default: vue.withCtx(() => [
                                  vue.createTextVNode("公共选修课（忽略冲突） ")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }, 8, ["modelValue", "disabled"]),
                          vue.createVNode(_component_v_col, null, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_v_row, null, {
                                default: vue.withCtx(() => [
                                  vue.createVNode(_component_v_btn, {
                                    color: "indigo",
                                    variant: "elevated",
                                    size: "large",
                                    rounded: "lg",
                                    elevation: "4",
                                    loading: isActivatorRunning.value,
                                    onClick: _cache[5] || (_cache[5] = async () => {
                                      activatorTimes.value = 0;
                                      isActivatorRunning.value = true;
                                      await tryActivate();
                                    }),
                                    disabled: isActivated.value || isActivatorRunning.value
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createTextVNode(vue.toDisplayString(isActivated.value ? "选课已激活" : isActivatorRunning.value ? activatorTimes.value.toString() : "激活选课"), 1)
                                    ]),
                                    _: 1
                                  }, 8, ["loading", "disabled"]),
                                  isActivatorRunning.value ? (vue.openBlock(), vue.createBlock(_component_v_btn, {
                                    key: 0,
                                    color: "indigo",
                                    variant: "tonal",
                                    size: "large",
                                    onClick: _cache[6] || (_cache[6] = () => isActivatorRunning.value = false)
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createTextVNode(vue.toDisplayString(`正在尝试激活（第${activatorTimes.value.toString()}次），点击停止`), 1)
                                    ]),
                                    _: 1
                                  })) : vue.createCommentVNode("", true),
                                  vue.createVNode(_component_v_btn, {
                                    color: "indigo",
                                    variant: "elevated",
                                    size: "large",
                                    rounded: "lg",
                                    elevation: "4",
                                    loading: isActivatorRunning.value,
                                    href: getActivator_url(),
                                    target: isActivatorRunning.value || isSelectorRunning.value ? "_self" : "_blank"
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createTextVNode(" 打开手动选课页面 ")
                                    ]),
                                    _: 1
                                  }, 8, ["loading", "href", "target"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          vue.createVNode(_component_v_btn, {
                            color: "error",
                            variant: "text",
                            size: "large",
                            href: "/sso.jsp"
                          }, {
                            default: vue.withCtx(() => [
                              vue.createTextVNode(" 重新登录而不退出 ")
                            ]),
                            _: 1
                          }),
                          vue.createVNode(_component_v_btn, {
                            color: "error",
                            variant: "text",
                            size: "large",
                            href: "/jsxsd/xk/LoginToXk?method=exit"
                          }, {
                            default: vue.withCtx(() => [
                              vue.createTextVNode(" 退出登录 ")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_v_col, { class: "mt-4" }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_v_row, { class: "ga-4" }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_v_text_field, {
                            modelValue: searchName.value,
                            "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => searchName.value = $event),
                            label: "课程名称",
                            "prepend-inner-icon": "search",
                            variant: "outlined",
                            "hide-details": "",
                            color: "indigo",
                            disabled: isSelectorRunning.value
                          }, null, 8, ["modelValue", "disabled"]),
                          vue.createVNode(_component_v_text_field, {
                            modelValue: searchTeacher.value,
                            "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => searchTeacher.value = $event),
                            label: "授课教师",
                            "prepend-inner-icon": "search",
                            variant: "outlined",
                            "hide-details": "",
                            color: "indigo",
                            disabled: isSelectorRunning.value
                          }, null, 8, ["modelValue", "disabled"]),
                          vue.createVNode(_component_v_range_slider, {
                            modelValue: stuCourseDataSelectedRange.value,
                            "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => stuCourseDataSelectedRange.value = $event),
                            max: filteredStuCourseData.value.length || 1,
                            min: 0,
                            step: 1,
                            label: isStuCourseDataAllSelected.value ? "全部课程将被选中" : "选中范围",
                            color: "indigo",
                            class: "align-center",
                            "hide-details": "",
                            disabled: isSelectorRunning.value || isStuCourseDataAllSelected.value
                          }, {
                            prepend: vue.withCtx(() => [
                              vue.createVNode(_component_v_text_field, {
                                modelValue: stuCourseDataSelectedRange.value[0],
                                "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => stuCourseDataSelectedRange.value[0] = $event),
                                density: "compact",
                                style: { "width": "50px" },
                                type: "number",
                                variant: "outlined",
                                "hide-details": "",
                                color: "indigo",
                                "single-line": "",
                                disabled: isSelectorRunning.value || isStuCourseDataAllSelected.value
                              }, null, 8, ["modelValue", "disabled"])
                            ]),
                            append: vue.withCtx(() => [
                              vue.createVNode(_component_v_text_field, {
                                modelValue: stuCourseDataSelectedRange.value[1],
                                "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => stuCourseDataSelectedRange.value[1] = $event),
                                density: "compact",
                                style: { "width": "50px" },
                                type: "number",
                                variant: "outlined",
                                "hide-details": "",
                                color: "indigo",
                                "single-line": "",
                                disabled: isSelectorRunning.value || isStuCourseDataAllSelected.value
                              }, null, 8, ["modelValue", "disabled"])
                            ]),
                            _: 1
                          }, 8, ["modelValue", "max", "label", "disabled"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              vue.createVNode(_component_v_card_text, null, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_v_card, {
                    title: "已选择的课程",
                    color: "indigo",
                    variant: "tonal",
                    loading: isSelectorRunning.value
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_v_card_text, null, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_v_col, null, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_v_row, { class: "ga-4" }, {
                                default: vue.withCtx(() => [
                                  vue.createVNode(_component_v_btn, {
                                    color: "indigo",
                                    variant: "elevated",
                                    size: "large",
                                    rounded: "lg",
                                    elevation: "4",
                                    disabled: isSelectorRunning.value || !(stuCourseDataSelected.value.length || searchName.value || searchTeacher.value),
                                    onClick: _cache[12] || (_cache[12] = async () => {
                                      resetSelectorStatus();
                                      isSelectorRunning.value = true;
                                      await trySelectCourse();
                                    })
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createTextVNode(vue.toDisplayString(!isActivated.value ? `输入课程名称或授课教师以激活，并` : "") + "开始选课任务 ", 1)
                                    ]),
                                    _: 1
                                  }, 8, ["disabled"]),
                                  vue.createVNode(_component_v_btn, {
                                    color: "indigo",
                                    variant: "outlined",
                                    size: "large",
                                    rounded: "lg",
                                    disabled: !isSelectorRunning.value,
                                    onClick: _cache[13] || (_cache[13] = () => {
                                      isSelectorRunning.value = false;
                                      isActivatorRunning.value = false;
                                      selectorCourseDataStatus.value = selectorCourseDataStatus.value.map(
                                        (status) => status === 0 || status === 1 ? -1 : status
                                      );
                                    })
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createTextVNode("终止操作 ")
                                    ]),
                                    _: 1
                                  }, 8, ["disabled"]),
                                  isGlobalNeedLogin.value || isGlobalNeedReLogin.value ? (vue.openBlock(), vue.createBlock(_component_v_btn, {
                                    key: 0,
                                    color: "error",
                                    variant: "elevated",
                                    size: "large",
                                    rounded: "lg",
                                    elevation: "4",
                                    href: "/jsxsd/xk/LoginToXk?method=exit"
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createTextVNode(" 退出账号重新登录 ")
                                    ]),
                                    _: 1
                                  })) : vue.createCommentVNode("", true),
                                  isGlobalNeedLogin.value || isGlobalNeedReLogin.value ? (vue.openBlock(), vue.createBlock(_component_v_btn, {
                                    key: 1,
                                    color: "error",
                                    variant: "outlined",
                                    size: "large",
                                    rounded: "lg",
                                    elevation: "4",
                                    onClick: _cache[14] || (_cache[14] = async () => {
                                      isActivated.value = false;
                                      activatorTimes.value = 0;
                                      isActivatorRunning.value = true;
                                      await tryActivate();
                                    })
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createTextVNode(" 重新激活 ")
                                    ]),
                                    _: 1
                                  })) : vue.createCommentVNode("", true),
                                  vue.createVNode(_component_v_checkbox_btn, {
                                    modelValue: isStuCourseDataAllSelected.value,
                                    "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => isStuCourseDataAllSelected.value = $event),
                                    label: "选择全部课程",
                                    disabled: isSelectorRunning.value,
                                    "hide-details": "",
                                    onClick: _cache[16] || (_cache[16] = ($event) => isStuCourseDataAllSelected.value = !isStuCourseDataAllSelected.value)
                                  }, null, 8, ["modelValue", "disabled"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      stuCourseDataSelected.value.length === 0 ? (vue.openBlock(), vue.createBlock(_component_v_card_subtitle, {
                        key: 0,
                        class: "pb-3"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("暂未选择任何课程 ")
                        ]),
                        _: 1
                      })) : (vue.openBlock(), vue.createBlock(_component_v_card_text, { key: 1 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_v_col, null, {
                            default: vue.withCtx(() => [
                              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(stuCourseDataSelected.value, (course, index) => {
                                return vue.openBlock(), vue.createBlock(_component_v_row, {
                                  class: "ga-2",
                                  key: course.id,
                                  align: "center"
                                }, {
                                  default: vue.withCtx(() => [
                                    vue.createElementVNode("p", _hoisted_3, vue.toDisplayString(selectorCourseDataStatus.value[index] === 2 ? "错误" : selectorCourseDataStatus.value[index] === 3 ? "成功" : selectorCourseDataStatus.value[index] === 1 ? "运行" : "等待") + " | 第" + vue.toDisplayString(selectorCourseDataTimes.value[index]) + "次 ", 1),
                                    vue.createVNode(_component_v_progress_circular, {
                                      size: "20",
                                      width: "2",
                                      color: selectorCourseDataStatus.value[index] === 2 ? "error" : selectorCourseDataStatus.value[index] === 3 ? "success" : selectorCourseDataStatus.value[index] === 0 ? "grey-lighten-4" : "",
                                      "model-value": selectorCourseDataStatus.value[index] === -1 || selectorCourseDataStatus.value[index] === 0 ? 0 : 100,
                                      indeterminate: selectorCourseDataStatus.value[index] === 1 || selectorCourseDataStatus.value[index] === 0
                                    }, null, 8, ["color", "model-value", "indeterminate"]),
                                    vue.createElementVNode("p", _hoisted_4, [
                                      vue.createTextVNode(vue.toDisplayString(course.name) + " ", 1),
                                      vue.createElementVNode("span", _hoisted_5, vue.toDisplayString(course.teacher), 1)
                                    ]),
                                    vue.createElementVNode("p", _hoisted_6, vue.toDisplayString(selectorCourseDataMessage.value[index] && ` - ${selectorCourseDataMessage.value[index]}`), 1)
                                  ]),
                                  _: 2
                                }, 1024);
                              }), 128))
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }))
                    ]),
                    _: 1
                  }, 8, ["loading"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_v_data_table, {
                modelValue: stuCourseDataSelected.value,
                "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => stuCourseDataSelected.value = $event),
                items: filteredStuCourseData.value,
                hover: "",
                color: "indigo",
                headers: stuCourseHeaders,
                "items-per-page": "-1",
                "hide-default-footer": "",
                "show-select": "",
                density: "compact",
                "return-object": "",
                "disable-sort": "",
                "select-strategy": "all",
                style: { "white-space": "pre-wrap" },
                "item-selectable": isSelectorRunning.value && "false"
              }, null, 8, ["modelValue", "items", "item-selectable"])
            ], 64)),
            vue.createVNode(_component_v_card_actions, null, {
              default: vue.withCtx(() => [
                vue.createTextVNode(" ↓原始选课页面见下方↓ ")
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["loading"]);
      };
    }
  });
  const cssLoader = (e) => {
    const t = GM_getResourceText(e);
    return GM_addStyle(t), t;
  };
  cssLoader("VuetifyStyle");
  const href = window.location.href;
  const isXsrkxz = href.includes("xsrkxz");
  const isXklcView = href.includes("xklc_list");
  const mount = () => {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://registry.npmmirror.com/@mdi/font/7.4.47/files/css/materialdesignicons.min.css";
    document.head.appendChild(css);
    const vuetify$1 = vuetify.createVuetify({});
    const app = vue.createApp(_sfc_main);
    app.use(vuetify$1);
    const target = isXklcView ? document.querySelector("form > div:first-of-type") : document.querySelector("body > div:first-of-type");
    const div = document.createElement("div");
    if (target) {
      target.prepend(div);
      console.log(div);
      app.mount(div);
    }
  };
  if (isXsrkxz || isXklcView) {
    try {
      setTimeout(() => {
        mount();
      }, 100);
    } catch (error) {
      console.error(error);
      document.addEventListener("DOMContentLoaded", function() {
        mount();
      });
    }
  }

})(Vue, Vuetify);
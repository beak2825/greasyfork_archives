// ==UserScript==
// @name         懒人福音，一个脚本支持多个平台。【智慧职教】、【学习通】、【陕西省专业人员继续教育】
// @namespace    yike
// @version      0.0.2
// @license      MIT
// @author       小了白了兔
// @description  支持【智慧职教】、【学习通】、【陕西省专业人员继续教育】挂机使用。脚本使用问题/其他平台开发需求，欢迎添加作者反馈。
// @icon         https://mp-85530a3e-fc46-4ea4-a542-160dad54a088.cdn.bspapp.com/cloudstorage/df6b1336-a2d7-4e64-8fc5-325ee9cc5266.png
// @match        *://*/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.2.45/dist/vue.global.prod.js
// @connect      *
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/459533/%E6%87%92%E4%BA%BA%E7%A6%8F%E9%9F%B3%EF%BC%8C%E4%B8%80%E4%B8%AA%E8%84%9A%E6%9C%AC%E6%94%AF%E6%8C%81%E5%A4%9A%E4%B8%AA%E5%B9%B3%E5%8F%B0%E3%80%82%E3%80%90%E6%99%BA%E6%85%A7%E8%81%8C%E6%95%99%E3%80%91%E3%80%81%E3%80%90%E5%AD%A6%E4%B9%A0%E9%80%9A%E3%80%91%E3%80%81%E3%80%90%E9%99%95%E8%A5%BF%E7%9C%81%E4%B8%93%E4%B8%9A%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/459533/%E6%87%92%E4%BA%BA%E7%A6%8F%E9%9F%B3%EF%BC%8C%E4%B8%80%E4%B8%AA%E8%84%9A%E6%9C%AC%E6%94%AF%E6%8C%81%E5%A4%9A%E4%B8%AA%E5%B9%B3%E5%8F%B0%E3%80%82%E3%80%90%E6%99%BA%E6%85%A7%E8%81%8C%E6%95%99%E3%80%91%E3%80%81%E3%80%90%E5%AD%A6%E4%B9%A0%E9%80%9A%E3%80%91%E3%80%81%E3%80%90%E9%99%95%E8%A5%BF%E7%9C%81%E4%B8%93%E4%B8%9A%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E3%80%91.meta.js
// ==/UserScript==

(i=>{const e=document.createElement("style");e.dataset.source="vite-plugin-monkey",e.innerText=i,document.head.appendChild(e)})(".yike[data-v-8e71a76d]{position:absolute;left:20px;bottom:20px;z-index:999999;background:#fff;border:1px solid #d3d3d3;font-size:13px;width:360px;height:240px}.yike .yike_tab_menu[data-v-8e71a76d]{display:flex;justify-content:center;align-items:center;height:30px}.yike .yike_tab_menu .menu_item[data-v-8e71a76d]{width:50%;height:30px;text-align:center;color:#333;background-color:#eee;line-height:30px}.yike .yike_tab_menu .yike_current_menu[data-v-8e71a76d]{color:#fff;background:#093}.yike .yike_tab_box[data-v-8e71a76d]{width:100%;height:210px;background:#fff;border:1px solid #d3d3d3}.yike .yike_tab_status[data-v-8e71a76d]{width:100%;height:100%}.yike .yike_not_login[data-v-8e71a76d]{width:100%;height:100%;display:flex;justify-content:center;align-items:center;flex-direction:column}.yike .yike_not_login .yike_btn[data-v-8e71a76d]{align-self:flex-end;margin-top:6px;margin-right:35px;width:25%;height:40px;background-color:#093;color:#fff;border:none;border-radius:5px}.yike .yike_not_login .yike_btn[data-v-8e71a76d]:active{border:1px solid #ddd}.yike .yike_op[data-v-8e71a76d]{display:flex;justify-content:space-between;align-items:center;width:100%}.yike .yike_op .yike_login_info[data-v-8e71a76d]{color:#093;margin-left:20px}.yike .yike_not_login .yike_text[data-v-8e71a76d]{text-align:right;position:absolute;bottom:10px;right:10px}.yike .yike_not_login .yike_input[data-v-8e71a76d]{border:1px solid #333;background-color:#f9f9f9;border-radius:5px;padding:13px;outline:0;width:80%}.yike .yike_intro[data-v-8e71a76d]{width:100%;height:100%;padding:15px;text-align:left}.yike .yike_log[data-v-8e71a76d]{display:flex;align-items:flex-start;flex-direction:column;padding:5px;overflow:auto}.yike .yike_log .yike_item[data-v-8e71a76d]{margin:3px 0}.yike .yike_log .yike_item .yike_time[data-v-8e71a76d]{margin-right:5px}.yike .yike_log .yike_error[data-v-8e71a76d]{color:brown}.yike .yike_has_login[data-v-8e71a76d]{display:flex;justify-content:center;align-items:center;flex-direction:column;width:100%;height:100%}.yike .yike_has_login .yike_left_time[data-v-8e71a76d],.yike .yike_has_login .yike_client[data-v-8e71a76d]{margin:5px}.yike .yike_has_login .yike_vali_code[data-v-8e71a76d]{width:100%;position:absolute;left:8px;bottom:5px;display:flex;justify-content:flex-start;align-items:center}.yike .yike_has_login .yike_vali_code .yike_copy[data-v-8e71a76d]{line-height:12px;margin-left:5px;background-color:#093;color:#fff;border-radius:3px;border:2px solid #095}");

(function(vue) {
  "use strict";
  var monkeyWindow = window;
  var GM_setValue = /* @__PURE__ */ (() => monkeyWindow.GM_setValue)();
  var GM_xmlhttpRequest = /* @__PURE__ */ (() => monkeyWindow.GM_xmlhttpRequest)();
  var GM_getValue = /* @__PURE__ */ (() => monkeyWindow.GM_getValue)();
  const get_tag = function(para) {
    const str = para.str;
    let elements = [].concat(para.element || document);
    const in_curent_frame = para.in_curent_frame == void 0 ? true : false;
    const back_style = para.back_style || "boolean";
    let res = [];
    for (let i = 0; i < elements.length; i++) {
      let match_ele = Array.from(elements[i].querySelectorAll(str));
      res = res.concat(match_ele);
      if (in_curent_frame) {
        break;
      }
      let match_iframe = Array.from(elements[i].querySelectorAll("iframe")).map(function(item) {
        return item.contentWindow.document;
      });
      elements = elements.concat(match_iframe);
    }
    if (back_style == "boolean") {
      return res.length != 0;
    }
    if (back_style == "array") {
      return res;
    }
    if (back_style == "object") {
      return res[0];
    }
    return res;
  };
  function get_format_date$1(time) {
    const date = time || new Date();
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    var d = date.getDate();
    d = d < 10 ? "0" + d : d;
    var h = date.getHours();
    h = h < 10 ? "0" + h : h;
    var minute = date.getMinutes();
    minute = minute < 10 ? "0" + minute : minute;
    var second = date.getSeconds();
    second = second < 10 ? "0" + second : second;
    return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
  }
  const get_script = function(jiaoben2) {
    const script = jiaoben2.filter(function(val, index) {
      const type = typeof val.element;
      if (type == "object") {
        for (let i = 0; i < val.element.length; i++) {
          if (get_tag({ str: val.element[i] })) {
            return true;
          }
        }
        return false;
      } else {
        return get_tag({ str: val.element });
      }
    })[0];
    return script || {};
  };
  const tools = { get_tag, get_script, get_format_date: get_format_date$1 };
  const shanxijixujiaoyu = [
    {
      script_name: "陕西继续教育",
      script_id: "10000",
      element: ".main .mainIn .main_right .rightWidth .shadow .mod_tit_bar .mod_tit",
      load_option: true,
      run: function(yike_log2, fee2) {
        const class_ready = new Event("class_ready", { "bubbles": true, "cancelable": false });
        const class_complete = new Event("class_complete", { "bubbles": true, "cancelable": false });
        window.addEventListener("message", function(e) {
          console.log(e);
          const data = e.data;
          const source = data.source;
          if (source != "10000_study") {
            return;
          }
          const event = data.event;
          if (event == "class_start") {
            page_b = e.source;
          }
          if (event == "class_complete") {
            document.dispatchEvent(class_complete);
          }
          if (event == "add_log") {
            yike_log2(data.type, data.content);
          }
        }, false);
        document.addEventListener("class_ready", function(e) {
          if (all_class.length == 0) {
            yike_log2("normal", "您已完成所有课程学习");
            stop();
            return;
          }
          all_class[0].click();
          console.log(all_class[0]);
          const class_name = all_class[0].parentNode.nextElementSibling.querySelector("h5").title;
          yike_log2("normal", "开始学习---《" + class_name + "》");
        });
        document.addEventListener("class_complete", function(e) {
          all_class.shift();
          if (all_class.length == 0) {
            page_b.close();
            yike_log2("normal", "您已完成所有课程学习");
            stop();
            return;
          }
          document.dispatchEvent(class_ready);
        });
        window.setInterval(function() {
          page_b.postMessage({
            event: "keep_active",
            source: "10000_main"
          }, "*");
        }, 1e4);
        let page_b;
        const all_class = tools.get_tag({ str: "#recCourses li a", back_style: "array" });
        document.dispatchEvent(class_ready);
        fee2.start_fee();
      },
      stop: function() {
        yike_log("error", "挂机结束，脚本停止运行");
        document.removeEventListener();
      }
    },
    {
      script_name: "陕西继续教育",
      script_id: "10000",
      element: ".s_topbg .s_top .s_coursetit",
      run: function(yike_log2, fee2) {
        const mission_ready = new Event("mission_ready", { "bubbles": true, "cancelable": false });
        const mission_complete = new Event("mission_complete", { "bubbles": true, "cancelable": false });
        const course_ready = new Event("course_ready", { "bubbles": true, "cancelable": false });
        const course_complete = new Event("course_complete", { "bubbles": true, "cancelable": false });
        const page_name = "10000_study";
        let lost_time2 = 0;
        window.opener.postMessage({
          event: "class_start",
          source: page_name
        }, "*");
        window.setInterval(function() {
          if (lost_time2 >= 5) {
            stop();
            alert("挂机过程中，不要关闭主页面。脚本运行停止");
          } else {
            console.log("失去连接第 " + lost_time2 + "次");
            lost_time2 = lost_time2 + 1;
          }
        }, 15e3);
        window.addEventListener("message", function(e) {
          const data = e.data;
          const source = data.source;
          if (source != "10000_main") {
            return;
          }
          const event = data.event;
          if (event == "keep_active") {
            lost_time2 = 0;
          }
        }, false);
        tools.get_tag({ str: "#courseware_main_menu div", in_curent_frame: false, back_style: "object" }).click();
        window.setTimeout(function() {
          document.addEventListener("mission_ready", function(e) {
            if (mission2[0].type == "video") {
              mission2[0].ele.muted = "muted";
              mission2[0].ele.play();
              mission2[0].ele.addEventListener("ended", function() {
                console.log("播放结束");
                document.dispatchEvent(mission_complete);
              });
              mission2[0].ele.addEventListener("paused", function() {
                mission2[0].ele.get(0).muted = "muted";
                mission2[0].ele.get(0).play();
              });
              mission2[0].ele.addEventListener("canplay", function() {
                console.log("开始播放");
                mission2[0].ele.muted = "muted";
                mission2[0].ele.play();
              });
              return;
            }
            if (mission2[0].type == "exam") {
              window.setTimeout(function() {
                document.dispatchEvent(mission_complete);
              }, 3e3);
              return;
            }
          });
          document.addEventListener("mission_complete", function(e) {
            mission2.shift();
            if (mission2.length == 0) {
              document.dispatchEvent(course_complete);
              return;
            }
            document.dispatchEvent(mission_ready);
          });
          document.addEventListener("course_ready", function(e) {
            const video = tools.get_tag({ str: "video", in_curent_frame: false, back_style: "array" });
            if (video) {
              mission2.push({
                type: "video",
                ele: video
              });
            }
            const question = tools.get_tag({ str: ".record_submit_redo", in_curent_frame: false, back_style: "array" });
            if (question) {
              mission2.push({
                type: "exam",
                ele: question
              });
            }
            document.dispatchEvent(mission_ready);
          });
          document.addEventListener("course_complete", function(e) {
            window.opener.postMessage({
              event: "add_log",
              type: "normal",
              content: "完成学习----《第" + all_course[0].parentNode.previousElementSibling.querySelector(".sectionNum").innerHTML + "节》",
              source: page_name
            }, "*");
            all_course.shift();
            if (all_course.length == 0) {
              window.opener.postMessage({
                event: "class_complete",
                source: "10000_study"
              }, "*");
              return;
            }
            all_course[0].click();
            window.setTimeout(function() {
              document.dispatchEvent(course_ready);
            }, 3e3);
          });
          const all_course = tools.get_tag({ str: "#learnMenu [itemtype='video'][completestate=0],[itemtype='test'][completestate=1]", in_curent_frame: false, back_style: "array" });
          const mission2 = [];
          document.dispatchEvent(course_ready);
          window.opener.postMessage({
            event: "add_log",
            type: "normal",
            content: "开始学习----《第" + all_course[0].parentNode.previousElementSibling.querySelector(".sectionNum").innerHTML + "节》",
            source: page_name
          }, "*");
        }, 2e3);
      },
      stop: function() {
        document.removeEventListener();
      }
    }
  ];
  const xuexitong = [
    {
      script_name: "学习通",
      script_id: "10001",
      element: ".box .content .main .course-tab .tab-item",
      load_option: true,
      run: function(yike_log2, fee2) {
        alert("请开启浏览器弹窗权限，否则脚本无法运行。若已开启请忽略");
        const new_version_ready = new Event("new_version_ready", { "bubbles": true, "cancelable": false });
        const class_ready = new Event("class_ready", { "bubbles": true, "cancelable": false });
        const class_complete = new Event("class_complete", { "bubbles": true, "cancelable": false });
        window.addEventListener("message", function(e) {
          console.log(e);
          const data = e.data;
          const source = data.source;
          if (source != "10001_study") {
            return;
          }
          const event = data.event;
          if (event == "class_start") {
            page_b = e.source;
          }
          if (event == "class_complete") {
            document.dispatchEvent(class_complete);
          }
          if (event == "add_log") {
            yike_log2(data.type, data.content);
          }
        }, false);
        document.addEventListener("new_version_ready", function() {
          all_class = tools.get_tag({ str: ".course-list .course", back_style: "array" }).filter(function(val, index) {
            return val.querySelector(".not-open-tip") == void 0;
          });
          document.dispatchEvent(class_ready);
        });
        document.addEventListener("class_ready", function(e) {
          if (all_class.length == 0) {
            yike_log2("normal", "您已完成所有课程学习");
            stop();
            return;
          }
          window.top.open(all_class[0].querySelector("a").href);
          yike_log2("normal", "开始学习---《" + all_class[0].querySelector(".course-name").title + "》");
        });
        document.addEventListener("class_complete", function(e) {
          yike_log2("normal", "完成学习---《" + all_class[0].querySelector(".course-name").title + "》");
          all_class.shift();
          page_b.top.close();
          if (all_class.length == 0) {
            yike_log2("normal", "您已完成所有课程学习");
            stop();
            return;
          }
          document.dispatchEvent(class_ready);
        });
        window.setInterval(function() {
          page_b.postMessage({
            event: "keep_active",
            source: page_name
          }, "*");
        }, 11e4);
        let page_b;
        let all_class;
        let page_name = "10001_main";
        let version = tools.get_tag({ str: ".box .content .main .course-tab a[onclick*='New']", in_curent_frame: false, back_style: "boolean" });
        if (version) {
          yike_log2("normal", "自动切换到新版");
          version.click();
          window.setTimeout(function() {
            document.dispatchEvent(new_version_ready);
          }, 3e3);
        } else {
          document.dispatchEvent(new_version_ready);
        }
        fee2.start_fee();
      },
      stop: function() {
        document.removeEventListener();
        fee.stop_fee();
      }
    },
    {
      script_name: "学习通",
      script_id: "10001",
      element: ".box .nav_side .sideCon .nav-content ul li a[title='任务']",
      intro: "课程下面的章节页面",
      run: function() {
        const a = tools.get_tag({ str: ".stuNavigationList li a[title='章节']", in_curent_frame: false, back_style: "object" });
        if (!a.parentNode.classList.contains("curNav")) {
          a.click();
        }
      },
      stop: function() {
      }
    },
    {
      script_name: "学习通",
      script_id: "10001",
      element: ".fanyaChapter .fanyaChapterWhite .chapter_head .xs_head_name .catalog_points_yi",
      intro: "章节页面下的框架",
      run: function() {
        const page_name = "10001_study";
        const main_window = window.top.opener.frames[0];
        main_window.postMessage({
          event: "class_start",
          source: page_name
        }, "*");
        const cource_not_finish = tools.get_tag({ str: ".chapter_unit li .chapter_item", in_curent_frame: false, back_style: "array" }).filter(function(val, index) {
          return val.querySelector(".icon_yiwanc") == void 0 && val.querySelector(".icon-bukaifang") == void 0;
        });
        if (cource_not_finish.length != 0) {
          cource_not_finish[0].click();
        } else {
          main_window.postMessage({
            event: "class_complete",
            source: page_name
          }, "*");
        }
      },
      stop: function() {
      }
    },
    {
      script_name: "学习通",
      script_id: "10001",
      element: ".left .content .z-index99 h2",
      intro: "看视频页面",
      run: function() {
        const mission_ready = new Event("mission_ready", { "bubbles": true, "cancelable": false });
        const mission_complete = new Event("mission_complete", { "bubbles": true, "cancelable": false });
        const course_ready = new Event("course_ready", { "bubbles": true, "cancelable": false });
        const course_complete = new Event("course_complete", { "bubbles": true, "cancelable": false });
        const page_name = "10001_study";
        const main_window = window.top.opener.frames[0];
        let lost_time2 = 0;
        main_window.postMessage({
          event: "class_start",
          source: page_name
        }, "*");
        window.setInterval(function() {
          if (lost_time2 >= 5) {
            stop();
            alert("挂机过程中，不要关闭主页面或者最小化浏览器窗口。脚本运行停止");
          } else {
            console.log("失去连接第 " + lost_time2 + "次");
            lost_time2 = lost_time2 + 1;
          }
        }, 15e3);
        window.addEventListener("message", function(e) {
          const data = e.data;
          const source = data.source;
          if (source != "10001_main") {
            return;
          }
          const event = data.event;
          if (event == "keep_active") {
            lost_time2 = 0;
          }
        }, false);
        document.addEventListener("mission_ready", function(e) {
          console.log(mission2);
          if (mission2[0].type == "video") {
            mission2[0].ele.muted = "muted";
            mission2[0].ele.play();
            mission2[0].ele.addEventListener("ended", function() {
              console.log("播放结束");
              document.dispatchEvent(mission_complete);
            });
            mission2[0].ele.addEventListener("canplay", function() {
              console.log("开始播放");
              mission2[0].ele.muted = "muted";
              mission2[0].ele.play();
            });
            mission2[0].ele.addEventListener("paused", function() {
              mission2[0].ele.muted = "muted";
              mission2[0].ele.play();
            });
            return;
          }
          if (mission2[0].type == "read") {
            console.log("跳过阅读任务");
            window.setTimeout(function() {
              document.dispatchEvent(mission_complete);
            }, 3e3);
            return;
          }
          if (mission2[0].type == "question") {
            console.log("跳过答题任务");
            window.setTimeout(function() {
              document.dispatchEvent(mission_complete);
            }, 3e3);
            return;
          }
          if (mission2[0].type == "download") {
            console.log("跳过下载任务");
            window.setTimeout(function() {
              document.dispatchEvent(mission_complete);
            }, 3e3);
            return;
          }
        });
        document.addEventListener("mission_complete", function(e) {
          mission2.shift();
          if (mission2.length == 0) {
            document.dispatchEvent(course_complete);
            return;
          }
          document.dispatchEvent(mission_ready);
        });
        document.addEventListener("course_ready", function(e) {
          main_window.postMessage({
            event: "add_log",
            type: "normal",
            content: "开始学习----《" + all_course[0].querySelector(".posCatalog_name").title + "》",
            source: page_name
          }, "*");
          console.log(tools.get_tag({ str: "video", in_curent_frame: false, back_style: "array" }));
          const video = tools.get_tag({ str: "video", in_curent_frame: false, back_style: "array" }).map(function(val, index) {
            return {
              type: "video",
              ele: val
            };
          });
          console.log(video);
          const read = tools.get_tag({ str: ".wrap .ans-cc .insertdoc-online-ppt", in_curent_frame: false, back_style: "array" }).map(function(val, index) {
            return {
              type: "read",
              ele: val
            };
          });
          const question = tools.get_tag({ str: "#formId #questionpart", in_curent_frame: false, back_style: "array" }).map(function(val, index) {
            return {
              type: "question",
              ele: val
            };
          });
          const download = tools.get_tag({ str: ".wrap .ans-cc .underline", in_curent_frame: false, back_style: "array" }).map(function(val, index) {
            return {
              type: "download",
              ele: val
            };
          });
          mission2 = mission2.concat(video, read, question, download);
          document.dispatchEvent(mission_ready);
        });
        document.addEventListener("course_complete", function(e) {
          main_window.postMessage({
            event: "add_log",
            type: "normal",
            content: "完成学习----《" + all_course[0].querySelector(".posCatalog_name").title + "》",
            source: page_name
          }, "*");
          all_course.shift();
          if (all_course.length == 0) {
            main_window.postMessage({
              event: "class_complete",
              source: "10001_study"
            }, "*");
            return;
          }
          all_course[0].querySelector(".posCatalog_name").click();
          window.setTimeout(function() {
            document.dispatchEvent(course_ready);
          }, 3e3);
        });
        const all_course = tools.get_tag({ str: "#coursetree .posCatalog_level .posCatalog_select", in_curent_frame: false, back_style: "array" }).filter(function(val, index) {
          return val.querySelector(".icon_Completed") == void 0;
        });
        let mission2 = [];
        document.dispatchEvent(course_ready);
      },
      stop: function() {
        document.removeEventListener();
      }
    }
  ];
  const zhihuizhijiao = [
    {
      script_name: "智慧职教-我的中心",
      script_id: "10005",
      element: ".main .main-wrapper .mode-wrapper .mode-body .tabs-body #openingData",
      load_option: true,
      run: function(yike_log2, fee2) {
        alert("1.请开启弹窗权限，否则脚本无法运行。若已开启请忽略;\n2.挂机过程中，请保持此页面始终在前台工作；\n3.手动点击一门课程后，脚本即可自动运行");
        const class_ready = new Event("class_ready", { "bubbles": true, "cancelable": false });
        const class_complete = new Event("class_complete", { "bubbles": true, "cancelable": false });
        fee2.start_fee();
        window.setInterval(function() {
          console.log(get_format_date() + " 向study页发送active消息");
          page_b.postMessage({
            event: "keep_active",
            source: page_name
          }, "*");
        }, 1e5);
        let page_b;
        const page_name = "main";
        const all_class = tools.get_tag({ str: "#openingData a", in_curent_frame: false, back_style: "array" });
        window.addEventListener("message", function(e) {
          const data = e.data;
          const source = data.source;
          const event = data.event;
          if (source != "study") {
            return;
          }
          if (event == "class_start") {
            page_b = e.source;
          }
          if (event == "class_complete") {
            document.dispatchEvent(class_complete);
          }
          if (event == "add_log") {
            yike_log2(data.type, data.content);
          }
        }, false);
        document.addEventListener("class_ready", function(e) {
          if (all_class.length == 0) {
            yike_log2("normal", "您已完成所有课程学习");
            stop();
            return;
          }
          all_class[0].click();
          const class_name = all_class[0].parentNode.parentNode.parentNode.querySelector(".course-name").text;
          yike_log2("normal", "开始学习---《" + class_name + "》");
        });
        document.addEventListener("class_complete", function(e) {
          all_class.shift();
          page_b.close();
          if (all_class.length == 0) {
            yike_log2("normal", "您已完成所有课程学习");
            stop();
            return;
          }
          document.dispatchEvent(class_ready);
        });
        document.dispatchEvent(class_ready);
      },
      stop: function() {
        yike_log("error", "挂机结束，脚本停止运行");
        document.removeEventListener();
      }
    },
    {
      script_name: "智慧职教-学习页面",
      script_id: "10005",
      element: ".body-withmenu .learn-header .header-wrap .pull-right .info #learnTimer",
      run: function() {
        const mission_ready = new Event("mission_ready", { "bubbles": true, "cancelable": false });
        const mission_complete = new Event("mission_complete", { "bubbles": true, "cancelable": false });
        const course_complete = new Event("course_complete", { "bubbles": true, "cancelable": false });
        const course_ready = new Event("course_ready", { "bubbles": true, "cancelable": false });
        const page_name = "study";
        unsafeWindow.confirm = function() {
          console.log(get_format_date() + "我被HOOK了");
          return true;
        };
        unsafeWindow.alert = function() {
          return true;
        };
        window.confirm = function() {
          console.log(get_format_date() + "我被HOOK了");
          return true;
        };
        window.alert = function() {
          return true;
        };
        window.top.opener.postMessage({
          event: "class_start",
          source: page_name
        }, "*");
        const timer_active = window.setInterval(function() {
          if (lost_time >= 5) {
            stop();
            window.clearInterval(timer_active);
            alert("挂机过程中，不要关闭主页面。脚本运行停止");
          } else {
            console.log("失去连接第 " + lost_time + "次");
            lost_time = lost_time + 1;
          }
        }, 11e4);
        window.addEventListener("message", function(e) {
          const data = e.data;
          const source = data.source;
          if (source != "main") {
            return;
          }
          const event = data.event;
          if (event == "keep_active") {
            console.log(get_format_date() + "----学习页收到通知");
            lost_time = 0;
          }
        }, false);
        window.setTimeout(function() {
          const all_course = tools.get_tag("#learnMenu .s_sectionlist .s_point[completestate=0]").toArray();
          document.addEventListener("mission_ready", function(e) {
            if (mission[0].type == "video") {
              mission[0].ele.addEventListener("ended", function() {
                console.log("播放结束");
                document.dispatchEvent(mission_complete);
              });
              return;
            }
          });
          document.addEventListener("mission_complete", function(e) {
            mission.shift();
            if (mission.length == 0) {
              document.dispatchEvent(course_complete);
              return;
            }
            document.dispatchEvent(mission_ready);
          });
          document.addEventListener("course_complete", function(e) {
            window.opener.postMessage({
              event: "add_log",
              type: "normal",
              content: "完成学习----《" + tools.get_tag({ str: ".s_pointti", element: all_course[0], back_style: "object" }).text + "》",
              source: page_name
            }, "*");
            all_course.shift();
            if (all_course.length == 0) {
              window.top.opener.postMessage({
                event: "class_complete",
                source: page_name
              }, "*");
              return;
            }
            document.dispatchEvent(course_ready);
          });
          document.addEventListener("course_ready", function(e) {
            window.opener.postMessage({
              event: "add_log",
              type: "normal",
              content: "开始学习----《" + tools.get_tag({ str: ".s_pointti", element: all_course[0], back_style: "object" }).text + "》",
              source: page_name
            }, "*");
            all_course[0].click();
            window.setTimeout(function() {
              const course_type = all_course[0].itemtype;
              if (course_type == "video") {
                const video = tools.get_tag({ str: "video", in_curent_frame: false, back_style: "object" });
                video.muted = "muted";
                video.play();
                const video_timer = window.setInterval(function() {
                  if (video.ended) {
                    console.log("视频播放结束");
                    document.dispatchEvent(course_complete);
                    window.clearInterval(video_timer);
                  }
                }, 1e4);
              } else if (course_type == "doc") {
                window.setTimeout(function() {
                  console.log("完成看文档");
                  document.dispatchEvent(course_complete);
                }, 1e4);
              } else if (course_type == "topic") {
                const topic_content = "感谢老师分享";
                const editor = tools.get_tag({ str: "#myEditor", in_curent_frame: false, back_style: "object" }).ownerDocument.defaultView.myEditor;
                const submit_btn = tools.get_tag({ str: "#commentDiv .submit a", in_curent_frame: false, back_style: "object" });
                editor.setContent(topic_content);
                window.setTimeout(function() {
                  submit_btn.get(0).click();
                }, 5e3);
                window.setTimeout(function() {
                  document.dispatchEvent(course_complete);
                }, 1e4);
              } else if (course_type == "text") {
                window.setTimeout(function() {
                  console.log("完成看图文");
                  document.dispatchEvent(course_complete);
                }, 1e4);
              } else if (course_type == "exam") {
                window.setTimeout(function() {
                  window.top.opener.postMessage({
                    event: "add_log",
                    type: "error",
                    content: "考试任务，功能暂不支持，跳过该任务",
                    source: page_name
                  }, "*");
                  document.dispatchEvent(course_complete);
                }, 5e3);
              } else {
                window.top.opener.postMessage({
                  event: "add_log",
                  type: "error",
                  content: "未知任务，跳过。。。",
                  source: page_name
                }, "*");
                document.dispatchEvent(course_complete);
              }
            }, 5e3);
          });
          document.dispatchEvent(course_ready);
        }, 4e3);
      },
      stop: function() {
        document.removeEventListener();
      }
    }
  ];
  const jiaoben = [].concat(shanxijixujiaoyu, xuexitong, zhihuizhijiao);
  const App_vue_vue_type_style_index_0_scoped_8e71a76d_lang = "";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _withScopeId = (n) => (vue.pushScopeId("data-v-8e71a76d"), n = n(), vue.popScopeId(), n);
  const _hoisted_1 = {
    key: 0,
    class: "yike"
  };
  const _hoisted_2 = { class: "yike_tab_menu" };
  const _hoisted_3 = { class: "yike_tab_box" };
  const _hoisted_4 = {
    key: 0,
    class: "yike_tab_status"
  };
  const _hoisted_5 = {
    key: 0,
    class: "yike_not_login"
  };
  const _hoisted_6 = {
    key: 1,
    class: "yike_has_login"
  };
  const _hoisted_7 = { class: "yike_vali_code" };
  const _hoisted_8 = { class: "yike_text" };
  const _hoisted_9 = { class: "yike_left_time" };
  const _hoisted_10 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("a", {
    class: "yike_link",
    href: "https://www.yuque.com/g/qingjiaowodashen-wfovj/ysytwa/collaborator/join?token=F8MMg7LtrrvbcBgd# 《脚本使用说明》"
  }, "脚本无法使用?|充值", -1));
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      const curent_menu_index = vue.ref(0);
      const vali_code = vue.ref("04ANIF1DH8I4VL4P121CWIND8MG5Y5UN");
      const back_url = "https://85530a3e-fc46-4ea4-a542-160dad54a088.bspapp.com/user";
      const log_content = vue.ref([]);
      const log = vue.ref(null);
      const vali_code_info = vue.ref({});
      var _script = vue.ref({});
      vue.computed(() => {
        return _script.run;
      });
      vue.computed(() => {
        return _script.stop;
      });
      const login_flag = vue.computed(() => {
        return vali_code_info.value.vali_code != void 0;
      });
      const yike_log2 = function(type, text) {
        const time = tools.get_format_date();
        log_content.value.push({
          time,
          type,
          text
        });
        log.scrollTop = log.scrollHeight;
      };
      const login = function() {
        if (vali_code.value.length != 32) {
          alert("验证码格式错误，请重新输入");
          return;
        }
        GM_xmlhttpRequest({
          method: "POST",
          url: back_url,
          data: JSON.stringify({
            action: "get_vali_code_info",
            data: {
              vali_code: vali_code.value
            }
          }),
          headers: {
            "Content-Type": "application/json;charset=utf-8"
          },
          onload: function(response) {
            const res = JSON.parse(response.responseText);
            console.log(res);
            if (res.code !== 0) {
              yike_log2("error", res.message);
              return;
            }
            GM_setValue("vali_code_info", res.vali_code_info);
            vali_code_info.value = res.vali_code_info;
            _script.value.run(yike_log2, fee2);
          }
        });
      };
      const copy_vali_code = function() {
        window.navigator.clipboard.writeText(vali_code_info.value.vali_code);
        alert("注册码复制成功");
      };
      const fee2 = {
        fee_timer: void 0,
        start_fee: function() {
          window.setInterval(function() {
            console.log("开始计费");
            GM_xmlhttpRequest({
              method: "POST",
              url: back_url,
              headers: {
                "Content-Type": "application/json;charset=utf-8"
              },
              data: JSON.stringify({
                action: "fee",
                data: {
                  vali_code: vali_code_info.value.vali_code
                }
              }),
              onload: function(response) {
                console.log("完成计费");
                const res = JSON.parse(response.responseText);
                if (res.code !== 0) {
                  yike_log2("error", res.message);
                  return;
                }
                console.log(res.vali_code_info);
                GM_setValue("vali_code_info", res.vali_code_info);
                vali_code_info.value = res.vali_code_info;
              }
            });
          }, 3e5);
        },
        stop_fee: function() {
          console.log("停止计费");
          window.clearInterval(fee2.timer);
        }
      };
      vue.onMounted(() => {
        vali_code_info.value = GM_getValue("vali_code_info", {});
        window.setTimeout(function() {
          _script.value = tools.get_script(jiaoben);
          console.log(_script.value);
          if (_script.value.run == void 0) {
            console.log("对不起，未找到对应脚本\n 1.本提示由第三方脚本产生，如非本意，请在脚本控制台关闭脚本。 \n 2.如果您打开的页面为相应网课平台，说明脚本匹配失败，请联系作者。");
            return;
          }
          if (login_flag.value) {
            _script.value.run(yike_log2, fee2);
          }
        }, 4e3);
      });
      return (_ctx, _cache) => {
        return vue.unref(_script).load_option ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          vue.createElementVNode("div", _hoisted_2, [
            vue.createElementVNode("div", {
              class: vue.normalizeClass({ yike_current_menu: curent_menu_index.value == 0, menu_item: true }),
              onClick: _cache[0] || (_cache[0] = ($event) => curent_menu_index.value = 0)
            }, "启动脚本 ", 2),
            vue.createElementVNode("div", {
              class: vue.normalizeClass({ yike_current_menu: curent_menu_index.value == 1, menu_item: true }),
              onClick: _cache[1] || (_cache[1] = ($event) => curent_menu_index.value = 1)
            }, "运行日志 ", 2)
          ]),
          vue.createElementVNode("div", _hoisted_3, [
            curent_menu_index.value == 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_4, [
              !vue.unref(login_flag) ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_5, [
                vue.withDirectives(vue.createElementVNode("input", {
                  class: "yike_input",
                  placeholder: "请输入32位注册码",
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => vali_code.value = $event)
                }, null, 512), [
                  [vue.vModelText, vali_code.value]
                ]),
                vue.createElementVNode("button", {
                  class: "yike_btn",
                  onClick: login
                }, "启动脚本")
              ])) : vue.createCommentVNode("", true),
              vue.unref(login_flag) ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_6, [
                vue.createElementVNode("div", _hoisted_7, [
                  vue.createElementVNode("span", _hoisted_8, vue.toDisplayString(vali_code_info.value.vali_code), 1),
                  vue.createTextVNode(),
                  vue.createElementVNode("button", {
                    class: "yike_copy",
                    onClick: copy_vali_code
                  }, "复制")
                ]),
                vue.createElementVNode("div", _hoisted_9, "剩余时间: " + vue.toDisplayString(vali_code_info.value.left_time) + " 分钟", 1),
                _hoisted_10
              ])) : vue.createCommentVNode("", true)
            ])) : vue.createCommentVNode("", true),
            curent_menu_index.value == 1 ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 1,
              class: "yike_log",
              ref_key: "log",
              ref: log
            }, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(log_content.value, (item) => {
                return vue.openBlock(), vue.createElementBlock("div", null, [
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass({ yike_error: item.type == "error" })
                  }, [
                    vue.createElementVNode("span", null, vue.toDisplayString(item.time), 1),
                    vue.createElementVNode("span", null, vue.toDisplayString(item.text), 1)
                  ], 2)
                ]);
              }), 256))
            ], 512)) : vue.createCommentVNode("", true)
          ])
        ])) : vue.createCommentVNode("", true);
      };
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8e71a76d"]]);
  vue.createApp(App).mount(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  );
})(Vue);

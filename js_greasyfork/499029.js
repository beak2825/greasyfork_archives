// ==UserScript==
// @name LinuxDo自定义🛠️
// @name:en     LinuxDo Custom🛠️
// @name:zh-CN  LinuxDo自定义🛠️
// @description 为 LinuxDo 设置 快速收藏、点击数可视化、图像缩放、小图显示、自定义徽标、去除模糊、详情展开、页面加宽、发帖时间显示 等功能。
// @description:en Adds customizable features such as logos, click count visualization, image resize, and quick bookmarking to LinuxDo
// @description:zh-CN 为 LinuxDo 设置 快速收藏、点击数可视化、图像缩放、小图显示、自定义徽标、去除模糊、详情展开、页面加宽、发帖时间显示 等功能。
// @version      0.6.3
// @author       Yearly
// @match        https://linux.do/*
// @icon       data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iIzExMSIgZD0iTTAgMGg0OHYxNkgweiIvPjxwYXRoIGZpbGw9IiNlZWUiIGQ9Ik0wIDE2aDQ4djE2SDB6Ii8+PHBhdGggZmlsbD0iI0ZiMCIgZD0iTTAgMzJoNDh2MTZIMHoiLz48cGF0aCBmaWxsPSIjMDhmYSIgZD0iTTIzIDIwYzQgMCA4IDUgOSA4bDktMTBjMi0yIDUtOCAzLTEwbC00LTNjLTItMi02IDItOCA0em01IDhjMC0xLTItNC02LTUtNi0xLTEyIDQtMTIgMTAgMCA1LTggNy05IDcgNiAyIDkgNCAxNSAyIDUtMiAxMy03IDExLTE0Ii8+PC9zdmc+
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @namespace    http://tampermonkey.net/
// @supportURL   https://greasyfork.org/scripts/499029
// @homepageURL  https://greasyfork.org/scripts/499029
// @downloadURL https://update.greasyfork.org/scripts/499029/LinuxDo%E8%87%AA%E5%AE%9A%E4%B9%89%F0%9F%9B%A0%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/499029/LinuxDo%E8%87%AA%E5%AE%9A%E4%B9%89%F0%9F%9B%A0%EF%B8%8F.meta.js
// ==/UserScript==

(function() {
  var settings = {};

  const default_main_icon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NTAgNDUwIj48cmVjdCB3aWR0aD0iNDUwIiBoZWlnaHQ9IjQ1MCIgcng9IjUwJSIgZmlsbD0iI2VlZSIvPjxwYXRoIGQ9Ik0xNjEgMTkwYy02IDE0LTQ4IDU4LTQ0IDEwMiAxNiAxODQgNzIgNjAgMTU2IDEwNiAwIDAgMTUwLTg0IDMwLTIyMC0zNC00OC00LTg2LTI2LTExOHMtNjAtMzQtODgtNCAxMiA3NC0yOCAxMzQiLz48cGF0aCBkPSJNMzA5IDI4MnMxOC0zNi0xNi02MmMzMiAzNCAxMiA2NCAxMiA2NGgtNmMtMi03MC0yMC0zMi00Ni0xNTYgMzAtMzQtMjgtNjQtMjgtOGgtMThjMi00OC00MC0yNC0xNiAxMC0yIDc0LTQ2IDEwNC00NiAxNTYtMTQtMzYgMTItNjQgMTItNjRzLTM2IDMwLTE0IDc0IDYyIDM0IDM0IDU0YzQ0IDMwIDExMiAxMCAxMTAtNTQgMi0xNiA0NC0xMCA0OC02cy02LTgtMjYtOE0xOTcgMTI2Yy0xNC00LTEwLTIyLTQtMjJzMTYgMTQgNCAyMm0zOCAyYy0xMC0xNC0yLTI4IDgtMjZzMTAgMjYtOCAyNiIgZmlsbD0iI2ZmZiIvPjxnIGZpbGw9IiNmYjIiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIyIj48cGF0aCBkPSJtMTQzIDMwMiA0MiA2MGMyMiAxNCAxMCA3MC01MCA0Mi0zNC0xMC02Mi04LTY2LTI2czgtMjAgNi0yOGMtOC00NCAyOC0yMiAzOC00NHMxMC0zMiAzMC00bTIyNCAyOGMtOC0xMiAwLTM0LTI4LTMyLTEyIDI0LTQ2IDQ4LTQ4IDAtMjAgMC02IDQ4LTE0IDcwLTE4IDU0IDM0IDU4IDU2IDMybDUyLTM2YzQtNiAxMC0xMi0xOC0zNE0xODMgMTQ2Yy02LTEyIDIyLTI4IDMyLTI4czI0IDggMzggMTIgOCAxOCA0IDIwLTI2IDIwLTQyIDIwLTIwLTE2LTMyLTI0Ii8+PHBhdGggZD0iTTE4MyAxNDRjMTYgMTIgMzQgMjIgNzAtNiIvPjwvZz48L3N2Zz4=";

  const default_wide_icon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMTAiIGhlaWdodD0iMTEwIiB2aWV3Ym94PSItNSAtNSAzMTAgMTEwIj48cmVjdCB3aWR0aD0iOTkiIGhlaWdodD0iOTkiIHJ4PSIxMDAlIiBmaWxsPSIjRjFGMUYxIi8+PHRleHQgeD0iMjQiIHk9Ijc2IiBmb250LXNpemU9Ijc3IiBmaWxsPSIjRmMzIiBmb250LXdlaWdodD0iYm9sZCI+TDwvdGV4dD48dGV4dCB4PSI3MCIgeT0iNzUiIGZvbnQtc2l6ZT0iNDYiIGZpbGw9IiM4ODgiIGZvbnQtd2VpZ2h0PSJib2xkIiBsZXR0ZXItc3BhY2luZz0iNSI+SU5VWDwvdGV4dD48dGV4dCB4PSIyMDUiIHk9Ijc3IiBmb250LXNpemU9IjcwIiBmaWxsPSIjRUVFIiBmb250LXdlaWdodD0iNjYwIj5EbzwvdGV4dD48L3N2Zz4=";

  const settingsConfig = {
    class_label_topic: "💠话题内容相关:",
    quick_mark    : { type: 'checkbox', label: '快速收藏  ', default: true, style:'', info:'在帖子上增加一个⭐用于快速收藏到书签' },
    cnts_colorful : { type: 'checkbox', label: '点击数可视化', default: true, style:'', info:'点击数彩色高亮,数越大,颜色越红' },
    image_view    : { type: 'checkbox', label: '增强大图查看', default: true, style:'', info:'在大图查看时,支持滚轮缩放和鼠标拖动位置' },
    spoiler_noblur: { type: 'checkbox', label: '去除模糊', default: false, style:'', info:'去除剧透字段的模糊,使其直接显示' },
    details_open  : { type: 'checkbox', label: '详情展开', default: false, style:'', info:'直接展开被折叠的详情' },
    topic_scroll  : { type: 'checkbox', label: '帖子限高', default: true, style:'', info:'帖子内容限高，太长的帖子会变成滚动查看的元素' },
    show_floor_num: { type: 'checkbox', label: '显示楼层号', default: true, style:'', info:'在每层帖子增加楼层号显示' },
    show_floor_time : { type: 'checkbox', label: '更精确的回复时间', default: true, style:'', info:'帖子的回复时间改为绝对时间并精确到分钟' },
    auto_words_patch : { type: 'checkbox', label: '隐藏式字数补丁', default: false, style:'', info:'自动添加不可见的字数补丁' },
    image_mini    : { type: 'checkbox', label: '显示小图', default: false, style:'margin-bottom:5px;', info:'让帖子中的图都变小，在鼠标悬停时显示大图' },
    image_mini_H  : { type: 'number', label: '&ensp;&ensp;小图高度', default: "70", dependsOn: 'image_mini', style:'font-size:14px; margin:5px 10px;' , info:'(单位px，建议设为大于50的数)' },
    image_mini_W  : { type: 'number', label: '&ensp;&ensp;小图宽度', default: "100", dependsOn: 'image_mini', style:'font-size:14px; margin:5px 10px;' , info:'(单位px，建议设为大于50的数)' },

    class_label_list: "💠话题列表相关:",
    show_up_time  : { type: 'checkbox', label: '显示话题时间', default: true, style:'', info:'话题列表的帖子显示创建/更新时间，老的帖子会褪色泛黄' },
    order_created : { type: 'checkbox', label: '按创建排序', default: true, style:'', info:'首页导航的[新]改成新创建排序' },
    avatar_bigger : { type: 'checkbox', label: '发布者头像调整', default: true, style:'', info:'话题列表的发布者头像显示调整细节' },

    class_label_all: "💠通用:",

    sidebar_class : { type: 'checkbox', label: '侧栏类别分级显示', default: true, style:'', info:'侧栏分类按层级显示、细节调整、支持折叠/展开' },
    red_dot_hidden: { type: 'checkbox', label: '去除小黄点/小红点', default: false, style:'', info:'所有的小黄点/小红点都不再显示' },
    goto_top_end  : { type: 'checkbox', label: '快速顶部/底部', default: true, style:'', info:'在右下角新增按钮，可点击到顶部/底部' },
    wider_page    : { type: 'checkbox', label: '超宽显示', default: false, style:'', info:'让页面显示尽量宽' },
    thin_header   : { type: 'checkbox', label: '窄的顶栏', default: false, style:'', info:'让(Header)顶栏变窄' },
    open_in_new    : { type: 'checkbox', label: '新标签页打开', default: false, style:'', info:'让所有链接默认从新标签页打开' },
    icon_custom   : { type: 'checkbox', label: '自定义图标', default: false, style:'margin-bottom:5px;' , info:'始皇说不建议这样，所以我让鼠标悬停时能看眼原LOGO' },
    icon_main     : { type: 'text', label: '&ensp;&ensp;主图标URL', default: default_main_icon, dependsOn: 'icon_custom', style:'font-size:14px; margin:5px 10px;', info:'' },
    icon_wide     : { type: 'text', label: '&ensp;&ensp;宽图标URL', default: default_wide_icon, dependsOn: 'icon_custom', style:'font-size:14px; margin:5px 10px;', info:'' },

    class_label_end: "",
  };

  Object.keys(settingsConfig).forEach(key => {
    settings[key] = GM_getValue(key, settingsConfig[key].default);
  });

  GM_registerMenuCommand('Custom Settings', openSettings);

  function openSettings() {
    if (document.querySelector('div#linuxdo-custom-setting')) {
      return;
    }
    const shadow = document.createElement('div');
    shadow.style = `position: fixed; top: 0%; left: 0%; z-index:8888; width:100vw; height:100vh; background: #2229;`;
    const panel = document.createElement('div');
    panel.style = `max-width: calc(100% - 100px); width: max-content; position: fixed; top: 50%; left: 50%; z-index:9999; transform: translate(-50%, -50%); background-color: var(--secondary); color:var(--primary); padding:15px 25px; box-shadow: 0px 0px 15px #000d; max-height: calc(95vh - 40px); overflow-y: auto;`;
    panel.id = "linuxdo-custom-setting"
    let html = `
    <style type="text/css">
      :scope label {font-size:16px; display:flex; justify-content:space-between; align-items:center; margin:10px;}
      :scope label span {color:#6bc; font-size:12px; font-weight:normal; padding:0 6px; margin-right:auto;}
      :scope label input {margin:0 5px 0 15px;}
      :scope label input[type=text] {width:350px; padding:1px; font-size:14px;}
      :scope label input[type=number] {width:70px; padding: 0 0 0 10px; text-align:center;}
      :scope label input[type=checkbox] {background:pink;}
      :scope label input[disabled] {background: #CCC;}
      :scope label button {user-select: none; color: #333; padding: 6px 12px; margin-top:10px; border-radius:5px; border:none; line-height: normal;}
      :scope hr {display: block; height: 1px; margin: 0.5em 0; background:var(--primary); padding: 0;}
    </style>
    <h2 style="text-align:center; margin-top:.5rem;">LinuxDo Custom Settings</h2>
    `;
    Object.keys(settingsConfig).forEach(key => {
      const cfg = settingsConfig[key];
      if(typeof(cfg) == 'string'){
        html += `<hr><span style="margin-top:5px;">${cfg}</span>`;
      } else {
        const val = settings[key];
        const checked = cfg.type === 'checkbox' && val ? 'checked' : '';
        const disabled = cfg.dependsOn && !settings[cfg.dependsOn] ? 'disabled' : '';
        html += `<label style="${cfg.style}">${cfg.label}<span>${cfg.info}</span><input type="${cfg.type}" id="ujs_set_${key}" value="${val}" ${checked} ${disabled} ></label>`;
      }
    });
    html += `
    <label><button id="ld_userjs_apply" style="font-weight: bold; background:var(--tertiary); color:var(--secondary)">保存并刷新</button>
    <span></span><button id="ld_userjs_save">仅保存</button>
    <span></span><button id="ld_userjs_reset">重置</button>
    <span></span><button id="ld_userjs_close">取消</button></label>`;
    panel.innerHTML = html;

    document.body.append(shadow, panel);

    Object.keys(settingsConfig).forEach(key => {
      if (settingsConfig[key].dependsOn) {
        document.getElementById(`ujs_set_${settingsConfig[key].dependsOn}`).addEventListener('change', updateDependencies);
      }
    });

    function updateDependencies() {
      Object.keys(settingsConfig).forEach(key => {
        if (settingsConfig[key].dependsOn) {
          document.getElementById(`ujs_set_${key}`).disabled = !document.getElementById(`ujs_set_${settingsConfig[key].dependsOn}`).checked;
        }
      });
    }

    document.querySelector('button#ld_userjs_save').addEventListener('click', () => {
      Object.keys(settingsConfig).forEach(key => {
        const element = document.getElementById(`ujs_set_${key}`);
        if (element) {
          settings[key] = element.type === 'checkbox' ? element.checked : element.value;
          GM_setValue(key, settings[key]);
        }
      });
      alert('Settings saved!');
      panel.remove();
    });

    document.querySelector('button#ld_userjs_apply').addEventListener('click', () => {
      Object.keys(settingsConfig).forEach(key => {
        const element = document.getElementById(`ujs_set_${key}`);
        if (element) {
          settings[key] = element.type === 'checkbox' ? element.checked : element.value;
          GM_setValue(key, settings[key]);
        }
      });
      window.location.reload();
    });

    document.querySelector('button#ld_userjs_reset').addEventListener('click', () => {
      Object.keys(settingsConfig).forEach(key => {
        GM_deleteValue(key);
      });
      window.location.reload();
    });

    function setting_hide() {
      panel.remove();
      shadow.remove();
    }

    document.querySelector('button#ld_userjs_close').addEventListener('click', () => setting_hide());

    shadow.onclick = () => setting_hide();

    updateDependencies();
  }

  // Function 1: Custom Logo
  if (settings.icon_custom) {
    GM_addStyle(`
    #site-logo {
      object-fit: scale-down;
      object-position: -999vw;
      background-size: cover;
      background-repeat: no-repeat;
      background-image: url('${settings.icon_main}');
      opacity: 1;
      transition: opacity 0.5s ease;
    }
    #site-logo.logo-big {
      background-image: url('${settings.icon_wide}');
    }
    #site-logo.logo-mobile {
      background-image: url('${settings.icon_wide}');
    }
    #site-logo:hover {
      object-position: unset;
      background-image: none;
    }`);

    function replaceIcon() {
      document.querySelector('link[rel="icon"]').href = settings.icon_main;
    }

    const observer = new MutationObserver(replaceIcon);
    observer.observe(document.head, { childList: true, subtree: true });

    replaceIcon();
  }

  // Function 2: Click Counts Visualization
  if (settings.cnts_colorful) {
    (function countsColorful() {
      const badges = document.querySelectorAll("span.badge.badge-notification.clicks");
      let values = Array.from(badges, badge => parseInt(badge.title || badge.textContent));
      let maxValue = Math.max(...values);
      let minValue = Math.min(...values);
      if (maxValue < 100 || (maxValue - minValue < 10)) maxValue = maxValue * 1.5;
      badges.forEach(badge => {
        if (!badge.style.backgroundColor) {
          const number = parseInt(badge.title || badge.textContent);
          const hue = 180 - (number / maxValue) * 180;
          badge.style.backgroundColor = `hsl(${hue}, 50%, 50%)`;
          badge.style.color = "#fff";
          const sl = document.createElement('span');
          sl.style = `height: 1em; display: inline-block; float: right; background: hsl(${hue}, 50%, 50%); width: ${100 * (number / maxValue)}px;`;
          badge.after(sl);
        }
      });
      setTimeout(countsColorful, 1500);
    })();
  }

  // Function 3: Image Resize and Drag
  if (settings.image_view) {
    let sizePercent = 80;
    let isDragging = false;
    let startX, startY, initialX, initialY;

    function adjustSize(event) { //mfp-container mfp-image-holder mfp-s-ready
      let contentImg = document.querySelector('section#discourse-lightbox img');
      if (contentImg) {
        let delta = event.deltaY > 0 ? -10 : 10;
        sizePercent += delta;
        if (sizePercent > 300) sizePercent = 300;
        if (sizePercent < 5) sizePercent = 5;

        contentImg.style.width = sizePercent + '%';
        contentImg.style.maxWidth = sizePercent + '%';
        contentImg.style.maxHeight = sizePercent + '200%';
      }
    }

    function startDrag(event) {
      let contentImg = document.querySelector('section#discourse-lightbox img');
      if (contentImg) {
        isDragging = true;
        startX = event.clientX;
        startY = event.clientY;
        initialX = contentImg.offsetLeft;
        initialY = contentImg.offsetTop;
        event.preventDefault();
      }
    }

    function drag(event) {
      if (isDragging) {
        let contentImg = document.querySelector('section#discourse-lightbox img');
        if (contentImg) {
          let dx = event.clientX - startX;
          let dy = event.clientY - startY;
          contentImg.style.left = (initialX + dx) + 'px';
          contentImg.style.top = (initialY + dy) + 'px';
        }
      }
    }

    function stopDrag(event) {
      isDragging = false;
    }

    let observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          let contentImg = document.querySelector('section#discourse-lightbox img');
          if (contentImg) {
            document.querySelector('section#discourse-lightbox').onwheel = adjustSize;
            contentImg.onmousedown = startDrag;
            contentImg.onmouseup = stopDrag;
            contentImg.onmousemove = drag;
            contentImg.style.cursor = "move";

            function stopClickEvent(event) {
              event.stopImmediatePropagation();
              event.preventDefault();
            }
            contentImg.addEventListener('click', stopClickEvent, true);
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

  }
  // Function 3: Image Resize and Drag
  if (settings.image_view) {
    let sizePercent = 80;
    let isDragging = false;
    let startX, startY, initialX, initialY;

    function adjustSize(event) {
      let contentImg = document.querySelector('div.mfp-content img');
      let contentDiv = document.querySelector('div.mfp-content');
      if (contentImg) {
        let delta = event.deltaY > 0 ? -10 : 10;
        sizePercent += delta;
        if (sizePercent > 150) sizePercent = 150;
        if (sizePercent < 5) sizePercent = 5;

        contentImg.style.width = sizePercent + '%';
        contentImg.style.maxWidth = sizePercent + '%';
        contentImg.style.height = sizePercent + '%';
        contentImg.style.maxHeight = sizePercent + '%';

        contentDiv.style.width = contentImg.clientWidth;
      }
    }

    function startDrag(event) {
      let contentDiv = document.querySelector('div.mfp-content > div.mfp-figure');
      if (contentDiv) {
        isDragging = true;
        startX = event.clientX;
        startY = event.clientY;
        initialX = contentDiv.offsetLeft;
        initialY = contentDiv.offsetTop;
        event.preventDefault();
      }
    }

    function drag(event) {
      if (isDragging) {
        let contentImg = document.querySelector('div.mfp-content > div.mfp-figure');
        if (contentImg) {
          let dx = event.clientX - startX;
          let dy = event.clientY - startY;
          contentImg.style.left = (initialX + dx) + 'px';
          contentImg.style.top = (initialY + dy) + 'px';
          contentImg.style.position= "relative";
        }
      }
    }

    function stopDrag(event) {
      isDragging = false;
    }

    let observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (document.querySelector('div.mfp-content img')) {
            let contentDiv = document.querySelector('div.mfp-container.mfp-image-holder.mfp-s-ready');
            let figureDiv = document.querySelector('div.mfp-content > div.mfp-figure > figure img');
            contentDiv.onwheel = adjustSize;
            contentDiv.onmouseup = stopDrag;
            figureDiv.onmousedown = startDrag;
            figureDiv.onmousemove = drag;
            figureDiv.style.cursor = "move";
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

  }
  // Function 4: Quick Bookmark
  if (settings.quick_mark) {
    const starSvg = `<svg class="svg-icon" aria-hidden="true" style="text-indent: 1px; transform: scale(1); width:18px; height:18px;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
      <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path></svg></svg> `;
    let markMap = new Map();

    function handleResponse(xhr, successCallback, errorCallback) {
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            successCallback(xhr);
          } else {
            errorCallback(xhr);
          }
        }
      };
    }

    function deleteStarMark(mark_btn, data_id) {
      if (markMap.has(data_id)) {
        const mark_id = markMap.get(data_id);
        var xhr = new XMLHttpRequest();
        xhr.open('DELETE', `/bookmarks/${mark_id}`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('x-requested-with', 'XMLHttpRequest');
        xhr.setRequestHeader("x-csrf-token", document.head.querySelector("meta[name=csrf-token]")?.content);

        handleResponse(xhr, (xhr) => {
          mark_btn.style.color = '#777';
          mark_btn.title = "收藏";
          mark_btn.onclick = () => addStarMark(mark_btn, data_id);
        }, (xhr) => {
          alert('删除失败!' + xhr.statusText + "\n" + TryParseJson(xhr.responseText));
        });

        xhr.send();
      }
    }

    function TryParseJson(str) {
      try {
        const jsonObj = JSON.parse(str);
        return JSON.stringify(jsonObj, null, 1);
      } catch (error) {
        return str;
      }
    }

    function addStarMark(mark_btn, data_id) {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/bookmarks', true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      xhr.setRequestHeader('x-requested-with', 'XMLHttpRequest');
      xhr.setRequestHeader('discourse-logged-in', ' true');
      xhr.setRequestHeader('discourse-present', ' true');
      xhr.setRequestHeader("x-csrf-token", document.head.querySelector("meta[name=csrf-token]")?.content);
      const postData = `name=%E6%94%B6%E8%97%8F&auto_delete_preference=3&bookmarkable_id=${data_id}&bookmarkable_type=Post`;

      handleResponse(xhr, (xhr) => {
        mark_btn.style.color = '#fdd459';
        mark_btn.title = "删除收藏";
        mark_btn.onclick = () => deleteStarMark(mark_btn, data_id);
      }, (xhr) => {
        alert('收藏失败!' + xhr.statusText + "\n" + TryParseJson(xhr.responseText));
      });

      xhr.send(postData);
    }

    function addMarkBtn() {
      let articles = document.querySelectorAll("article[data-post-id]");
      if (articles.length <= 0) return;

      articles.forEach(article => {
        const target = article.querySelector("div.topic-body.clearfix > div.regular.contents > section > nav > div.actions");
        if (target && !article.querySelector("div.topic-body.clearfix > div.regular.contents > section > nav > span.star-bookmark")) {
          const dataPostId = article.getAttribute('data-post-id');
          const starButton = document.createElement('span');

          starButton.innerHTML = starSvg;
          starButton.className = "star-bookmark";
          starButton.style.cursor = 'pointer';
          starButton.style.margin = '0px 12px';

          if (markMap.has(dataPostId)) {
            starButton.style.color = '#fdd459';
            starButton.title = "删除收藏";
            starButton.onclick = () => deleteStarMark(starButton, dataPostId);
          } else {
            starButton.style.color = '#777';
            starButton.title = "收藏";
            starButton.onclick = () => addStarMark(starButton, dataPostId);
          }
          target.after(starButton);
        }
      });
    }

    function getStarMark() {
      let articles = document.querySelectorAll("article[data-post-id]");
      if (articles.length <= 0) return;

      const currentUserElement = document.querySelector('#current-user button > img[src]');

      function extractUsername(srcString) {
        const regex = /\/user_avatar\/linux\.do\/([^\/]+)\/\d+\//;
        const match = srcString.match(regex);

        if (match && match[1]) {
          return match[1];
        } else {
          return null;
        }
      }

      if(!currentUserElement) return;

      const currentUsername = extractUsername(currentUserElement.getAttribute('src'));

      if(!currentUsername) return;

      const xhr = new XMLHttpRequest();
      xhr.open('GET', `/u/${currentUsername}/user-menu-bookmarks`, true);
      xhr.setRequestHeader("x-csrf-token", document.head.querySelector("meta[name=csrf-token]")?.content);

      handleResponse(xhr, (xhr) => {
        var response = JSON.parse(xhr.responseText);
        response.bookmarks.forEach(mark => {
          markMap.set(mark.bookmarkable_id.toString(), mark.id.toString());
        });
        addMarkBtn();
      }, (xhr) => {
        console.error('GET请求失败:', xhr.statusText);
      });

      xhr.send();
    }

    let lastUpdateMarkTime = 0;
    let lastUpdateButnTime = 0;
    function mutationCallback() {
      const currentTime = Date.now();
      if (currentTime - lastUpdateMarkTime > 9000) {
        setTimeout(getStarMark, 500);
        lastUpdateMarkTime = currentTime;
      }
      if (currentTime - lastUpdateButnTime > 1000) {
        setTimeout(addMarkBtn, 500);
        lastUpdateButnTime = currentTime;
      }
    }

    const mainNode = document.querySelector("#main-outlet");
    if (mainNode) {
      const observer = new MutationObserver(mutationCallback);
      observer.observe(mainNode, { childList: true, subtree: true });
    }

    getStarMark();
  }

  // Function 5: mini article image show
  if (settings.image_mini) {
    let _H = parseInt(settings.image_mini_H);
    let _W = parseInt(settings.image_mini_W);//  transition: max-width 0.5s ease-in-out, max-height 0.5s ease-in-out;

    GM_addStyle(`
      article div.topic-body div.regular.contents img:not(.thumbnail):not(.ytp-thumbnail-image):not(.emoji) {
        max-width : ${_W}px;
        max-height : ${_H}px;
        object-fit: contain;
      }`);

    var imageMiniTimer = setInterval(function() {
      var images = document.querySelectorAll('article div.topic-body div.regular.contents img:not(.thumbnail):not(.ytp-thumbnail-image):not(.emoji)');
      if (images.length >= 1) {
        for (var i = 0; i < images.length; i++) {
          let img = images[i];
          let image_src = null;
          let src_height = null;

          let urls = img.getAttribute('srcset')
          if (urls) {
            urls = urls.match(/https:\/\/[^,\s]+/g);
            image_src = urls[urls.length - 1];
          }else{
            image_src = img.src;
          }

          src_height = img.naturalHeight || img.height;

          if (img.parentElement.matches('a.lightbox')) {
            img = img.parentElement;
            if (!image_src) {
              image_src = img.getAttribute('href');
            }
          }
          //console.log(image_src)
          img.image_src = image_src;
          img.src_height = src_height;

          let previewDiv = null;

          if (document.getElementById('hover-preview-img') == null) {
            previewDiv = document.createElement('div');
            previewDiv.id = 'hover-preview-img';
            previewDiv.style = 'position: fixed; z-index:999; top:-10px; max-width: 0px; max-height 0px; opacity: 0; transition: max-width 0.3s ease-in-out, max-height 0.3s ease-in-out, left 0.3s ease-in-out , opacity 0.3s ease-in-out , top 0.3s ease-in-out;'; // display:none;
            document.body.appendChild(previewDiv);
            let fullSizeImg = document.createElement('img');
            fullSizeImg.className = 'full-size-image';
            previewDiv.appendChild(fullSizeImg);
          } else {
            previewDiv = document.getElementById('hover-preview-img');
          }

          img.addEventListener('mouseenter', function(event) {
            let previewDiv = document.getElementById('hover-preview-img');
            let fullSizeImg = previewDiv.querySelector('.full-size-image');
            previewDiv.style.display = 'block';
            previewDiv.style.background="#FFFE";
            previewDiv.style.boxShadow="1px 1px 5px #555";
            previewDiv.style.padding="0px";

            previewDiv.style.left= event.clientX + 20 + 'px';
            previewDiv.style.maxWidth = '99vw';
            previewDiv.style.maxHeight = '99vh';

            this.title="";
            fullSizeImg.src = this.image_src;
            fullSizeImg.style.width = '';
            fullSizeImg.style.height = '';
            fullSizeImg.style.maxWidth = '100%';
            fullSizeImg.style.maxHeight = '100%';
            previewDiv.style.top = event.clientY - this.src_height/2 + 'px';
            previewDiv.style.opacity = 1;

            fullSizeImg.onload = function() {
              console.log(previewDiv.offsetTop , fullSizeImg.naturalHeight , window.innerHeight);
              if (previewDiv.offsetTop + fullSizeImg.naturalHeight > window.innerHeight - 5) {
                previewDiv.style.top = window.innerHeight - 5 - fullSizeImg.naturalHeight + 'px';
              }
            };

          });

          img.addEventListener('mouseleave', function() {
            let previewDiv = document.getElementById('hover-preview-img');
            previewDiv.style.top = "-10px";
            previewDiv.style.maxWidth = "0px";
            previewDiv.style.maxHeight = "0px";
            previewDiv.style.opacity = 0;
          });
        }
      }
    }, 1000);
  }

  // Function 6: remove spoiler blurred
  if (settings.spoiler_noblur) {
    GM_addStyle(`
    .spoiler-blurred {
      filter: drop-shadow(0px 0px 3px #BBB)!important;
    }
    .spoiler-blurred img {
      filter: drop-shadow(0px 0px 3px #BBB)!important;
    }`);
  }

  // Function 7: details open
  if (settings.details_open) {
    function open_detail() {
      let details = document.querySelectorAll("article details");
      details.forEach(detail => {
        if (detail.opened != true) {
          detail.open = true;
          detail.opened = true;
        }
      });
      setTimeout(open_detail, 990);
    }
    setTimeout(open_detail, 900);
  }

  // Function 8: wider page
  if (settings.wider_page) {
    GM_addStyle(`
        #main-outlet-wrapper {
          max-width: 100%!important;
        }
        body.has-sidebar-page header.d-header > div.wrap {
          max-width: 100%!important;
        }
        .topic-body {
          width: 100%!important;
        }
        :root {
          --d-max-width: 100%!important;
        }
        article .topic-map.--op {
          max-width: 100%;
        }
        div#reply-control .reply-area {
          width: calc(100% - 2em);
        }
        @media screen and (min-width: 925px) {
           #main-outlet .container.posts {
              grid-template-columns: auto 120px;
           }
        }`);
  }

  // Function 9: thin_header
  if (settings.thin_header) {
    GM_addStyle(`
     .d-header  {
         height: 2.5em !important;
     }
     .d-header .extra-info-wrapper .title-wrapper {
         display: flex;
         flex-direction: row;
     }
     .d-header div.title-wrapper > h1.header-title {
         width: auto;
         font-size: large;
     }
     .d-header #site-logo {
          height: 2em !important;
     }
     .d-header .d-header-icons .icon img.avatar {
          height: 2em !important;
     }`);
  }

  // Function 10: topic contents scroll
  if (settings.topic_scroll) {
    GM_addStyle(`
      article div.topic-body .regular.contents .cooked {
          max-height: 60vh;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #aaaa #1111;
      }
      article div.topic-body .regular.contents .cooked ::-webkit-scrollbar-track {
          background: #1111;
      }
      article div.topic-body .regular.contents .cooked ::-webkit-scrollbar-thumb {
          background: #aaaa;
      }
      article div.topic-body .regular.contents .cooked ::-webkit-scrollbar-thumb:hover {
          background: #0008;
      }`);
  }

  // Function 11: order by Created
  if (settings.order_created) {
    function orderByCreated() {
      const a_new = document.querySelector("ul#navigation-bar > li.new.ember-view.nav-item_new > a");
      if ( a_new && a_new.href.endsWith("/new")) {
        a_new.parentNode.title = "按最新创建排序";
        a_new.href = a_new.href.replace("/new","/latest?order=created");
        a_new.style.filter="drop-shadow(0px 0px 1px var(--quaternary))"; // #8FF8
      }
      setTimeout(orderByCreated, 990);
    }
    setTimeout(orderByCreated, 900);
  }

  // Function 12: 显示发帖时间和最新回复时间
  if (settings.show_up_time) {

    function getHue(date, currentDate) {
      const diff = Math.abs(currentDate - date);
      const baseday = 30 * 24 * 60 * 60 * 1000; // 30 day
      const diffRatio = Math.min( Math.log(diff / baseday + 1), 1);
      return 120 - (140 * diffRatio); // green to red
    }

    function formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${year} ${month} ${day} ${hours}:${minutes}`;
    }

    function parseDate(dateStr) {
      let parts;

      // Check if the string is in Chinese format
      if (dateStr.match(/(\d+)\s*年\s*(\d+)\s*月\s*(\d+)\s*日\s*(\d+):(\d+)/)) {
        parts = dateStr.match(/(\d+)\s*年\s*(\d+)\s*月\s*(\d+)\s*日\s*(\d+):(\d+)/);
        return new Date(parts[1], parts[2] - 1, parts[3], parts[4], parts[5]);
      }

      // Check if the string is in English format
      if (dateStr.match(/(\w+)\s*(\d+),\s*(\d+)\s*(\d+):(\d+)\s*(am|pm)/i)) {
        parts = dateStr.match(/(\w+)\s*(\d+),\s*(\d+)\s*(\d+):(\d+)\s*(am|pm)/i);
        const monthMap = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
        let hour = parseInt(parts[4], 10);
        if (parts[6].toLowerCase() === 'pm' && hour < 12) {
          hour += 12;
        } else if (parts[6].toLowerCase() === 'am' && hour === 12) {
          hour = 0;
        }
        return new Date(parts[3], monthMap[parts[1]], parts[2], hour, parts[5]);
      }

      throw new Error('Unsupported date format' + dateStr);
    }

    GM_addStyle(`
        .topic-list .topic-list-data.age.activity {
          width: 11em;
          padding: 0px 5px;
        }
        .topic-list .topic-list-data.age.activity > a.post-activity{
          font-size: 14px;
          text-align: left;
          display: block;
          text-wrap: nowrap;
          padding: 8px 5px;
        }`);

    function creatTimeShow() {
      document.querySelectorAll(".num.topic-list-data.age.activity").forEach(function (item) {
        const timeSpan = item.querySelector("a.post-activity")
        if (timeSpan.innerText.length > 10) {
          return;
        }
        const timeInfo = item.title;
        let createDateString = timeInfo.match(/创建日期：([\d 年 月 日 :]+)/) || timeInfo.match(/Created: ([\w, \d:apm ]+)/);
        let updateDateString = timeInfo.match(/最新：([\d 年 月 日 :]+)/) || timeInfo.match(/Latest: ([\w, \d:apm ]+)/);
        createDateString = (createDateString[1] ?? '').trim();
        const createDate = parseDate(createDateString);
        const currentDate = new Date();
        const createHue = getHue(createDate, currentDate);
        const formatCreateDate = formatDate(createDate);
        timeSpan.innerHTML = `<span style="color: hsl(${createHue}, 35%, 50%);">创建：${formatCreateDate}</span><br>`;
        if (updateDateString) {
          updateDateString = (updateDateString[1] ?? '').trim();
          const updateDate = parseDate(updateDateString);
          const updateHue = getHue(updateDate, currentDate);
          const formatNewDate = formatDate(updateDate);
          timeSpan.innerHTML += `<span style="color: hsl(${updateHue}, 35%, 50%);">最新：${formatNewDate}</span>`
        } else {
          timeSpan.innerHTML += `<span style="color:#888;">最新：暂无回复</span>`
        }

        const pastDays = Math.abs(createDate - currentDate) / (24 * 60 * 60 * 1000);
        const topicTitle = item.parentNode.querySelector(".main-link")
        const topicUsers = item.parentNode.querySelector(".topic-list-data.posters")
        if ( pastDays > 30) {
          topicTitle.style.opacity = 0.9;
          topicTitle.style.filter = "grayscale(10%) sepia(10%)";
          if ( pastDays > 60) {
            topicTitle.style.opacity = 0.8;
            topicTitle.style.filter = "sepia(40%) brightness(85%)";
            if(topicUsers) topicUsers.style.filter = "sepia(40%) brightness(85%)";
          }
          if ( pastDays > 120) {
            topicTitle.style.filter = "sepia(90%) brightness(85%)";
            if(topicUsers) topicUsers.style.filter = "sepia(90%) brightness(85%)";
          }
        }
      })
      setTimeout(creatTimeShow, 990);
    }
    setTimeout(creatTimeShow, 900);
  }

  // Function 13: 快速点击到顶部/底部
  if (settings.goto_top_end) {
    function scrollTimeline(offset) {
      let element = document.querySelector(".timeline-padding");
      if (!element) {
        window.scrollTo({
          top: 9999 * offset,
          behavior: "smooth"
        });
        if (window.location.href.includes("/t/topic/")) {
          if(offset < 1) window.location.href = window.location.href.replace(/\/t\/topic\/(\d+).*/, '/t/topic/$1')
          else window.location.href = window.location.href.replace(/\/t\/topic\/(\d+).*/, '/t/topic/$1/99999')
        }
        return;
      }
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        clientX: element.getBoundingClientRect().left + 0,
        clientY: element.getBoundingClientRect().top + offset,
      });

      element.dispatchEvent(event);
    }

    var toTop = document.createElement("button");
    var toEnd = document.createElement("button");
    var scrollBtns = document.createElement("div");

    scrollBtns.className = "goto_top_end";
    toTop.innerText = "⬆️顶部";
    toEnd.innerText = "⬇️最新";

    GM_addStyle(`
    .goto_top_end{
       position: fixed; bottom: 2px; right: 65px; z-index: 1000; border:none;
    }
    .goto_top_end > button {
       background-color:#0005;
       color:#eee;
       border:none;
       padding: 10px;
       margin: 0px 5px;
       border-radius: 5px;
       cursor: pointer;
    }
    @media screen and (max-width: 924px) {
      .goto_top_end{
        right: 160px;
      }
    }
    `);

    toTop.onclick = function() {
      scrollTimeline(0)
    };

    toEnd.onclick = function() {
      scrollTimeline(500)
    };

    document.body.appendChild(scrollBtns);
    scrollBtns.append(toTop, toEnd);
  }

  // Function 14: 显示帖子楼层号
  if (settings.show_floor_num) {
    GM_addStyle(`.post-info.floor-number {color: #9CD; margin-left: 1em;}`)
    function showPostNumber() {
      const posts = document.querySelectorAll('article[id^="post_"]');
      posts.forEach(post => {
        let floorInfo = post.querySelector('.post-infos > .floor-number');
        if(!floorInfo) {
          const postId = post.id;
          const floorNumber = postId.split('_')[1];
          const postInfos = post.querySelector('.post-infos');
          if (postInfos) {
            floorInfo = document.createElement('div');
            floorInfo.className = 'post-info floor-number';
            floorInfo.textContent = `#${floorNumber}`;
            postInfos.append(floorInfo);
          }
        }
      });
      setTimeout(showPostNumber, 1990);
    }
    setTimeout(showPostNumber, 1900);
  }

  // Function 15: 自动字数补丁
  if (settings.auto_words_patch) {
    const fillContent = '<div></div>\n\n';
    function handleTextarea(textarea) {
      if (textarea.dataset.handled) return;
      textarea.dataset.handled = 'true';

      let mask = document.querySelector("span#text-input-padding-mask");
      if (!mask) {
        mask = document.createElement('span');
        textarea.before(mask);
        mask.style = "width:95%; max-width:10em; margin: -2em 8px 4px; height:2.5em; background-color: var(--secondary); z-index:1; display:none";
        mask.id = "text-input-padding-mask";
      }

      let toolbar = document.querySelector('div.d-editor-button-bar[role="toolbar"]');
      if (toolbar) toolbar.style.zIndex = 2;

      function updateContent() {
        const currentContent = textarea.value;

        if (document.querySelector('div.characters-required.ember-view').innerText.length > 0) {
          if (!textarea.value.startsWith(fillContent)) {
            textarea.value = fillContent + currentContent;
          }
        }

        if (textarea.value.startsWith(fillContent)) {
          textarea.style.marginTop = "-3.5em";
          mask.style.display = "";
          mask.style.borderBottom = "1px solid #fd58";

          const contentWithoutFill = textarea.value.replace(fillContent, '');
          if (contentWithoutFill.length === 0) {
            textarea.value = contentWithoutFill;
            textarea.style = "";
            mask.style.display = "none";
            mask.style.borderBottomColor = "";
          }
        } else {
          textarea.style = "";
          mask.style.display = "none";
          mask.style.borderBottomColor = "";
        }

        // 阻止光标进入 fillContent 区域
        textarea.addEventListener('select', preventSelectionInFillContent);
        textarea.addEventListener('click', preventSelectionInFillContent);
        textarea.addEventListener('keydown', preventCursorInFillContent);
      }

      function preventSelectionInFillContent(e) {
        if (!textarea.value.startsWith(fillContent)) {
          return;
        }
        textarea.style.caretColor = "transparent";
        let start = textarea.selectionStart;
        let end = textarea.selectionEnd;
        if (start < fillContent.length) start = fillContent.length;
        if (end < fillContent.length) end = fillContent.length;
        if ( start != textarea.selectionStart || end != textarea.selectionEnd) {
          textarea.setSelectionRange(start, end);
        }
        textarea.style.caretColor = "";
      }

      function preventCursorInFillContent(e) {
        if (!textarea.value.startsWith(fillContent)) {
          return;
        }
        if (["ArrowUp","ArrowLeft","Home"].includes(e.key)) {
          textarea.style.caretColor = "transparent";
          setTimeout(function() {
            let start = textarea.selectionStart;
            let end = textarea.selectionEnd;
            if (start < fillContent.length) start = fillContent.length;
            if (end < fillContent.length) end = fillContent.length;
            if ( start != textarea.selectionStart || end != textarea.selectionEnd) {
              textarea.setSelectionRange(start, end);
            }
            textarea.style.caretColor = "";
          },0);
        }
      }

      updateContent();
      textarea.addEventListener('input', updateContent);
    }

    function observeDOM() {
      const targetNode = document.body;
      const config = { childList: true, subtree: true };

      const callback = function(mutationsList, observer) {
        for(let mutation of mutationsList) {
          if (mutation.type === 'childList') {
            const textarea = document.querySelector('#reply-control .d-editor-container textarea.ember-text-area.ember-view.d-editor-input');
            if (textarea) {
              handleTextarea(textarea);
            }
          }
        }
      };

      const observer = new MutationObserver(callback);
      observer.observe(targetNode, config);
    }

    observeDOM();
  }

  // Function 16: 新窗口打开
  if (settings.open_in_new) {
    // Capture all click events and open links in a new tab
    document.addEventListener('click', function(event) {
      let anchor = event.target.closest('a');
      if (anchor && anchor.href) {
        console.log("A")
        event.preventDefault();
        window.open(anchor.href, '_blank');
      }
    }, true);
  }

  // Function 17: 显示回复时间
  if (settings.show_floor_time) {
    GM_addStyle(`
  div.topic-body.clearfix > div.topic-meta-data > div.post-infos > div.post-info.post-date > a.widget-link.post-date > span.relative-date {
     visibility: hidden;
  }
  div.topic-body.clearfix > div.topic-meta-data > div.post-infos > div.post-info.post-date > a.widget-link.post-date > span.relative-date::after {
     content: attr(title);
     visibility: visible;
  }`);
  }

  // Function 18: 主题相关人头像显示调整
  if (settings.avatar_bigger) {
    GM_addStyle(`

.sidebar-wrapper > #d-sidebar > div.sidebar-footer-wrapper .sidebar-footer-container:before {
  border-bottom: solid 1px #8888;
  background:none;
}

   div.sidebar-sections .sidebar-section ul > li.sidebar-section-link-wrapper > a.sidebar-section-link {
      padding-left: 2.5em;
   }

   div#main-outlet-wrapper {
     --d-sidebar-width: 15em;
   }

  .topic-list td.topic-list-data.posters {
    height: auto;
    padding: 0.33em;
    width: 110px;
  }
  .topic-list td.posters.topic-list-data > a:first-child:not([style*="display: none"]) > img {
    width:  48px;
    height: 48px;
  }
  @media screen and (max-width: 850px) {
    .topic-list .topic-list-data.posters a.latest > img {
       width:  48px;
       height: 48px;
    }
    .topic-list td.topic-list-data.posters {
       width: 52px;
    }
  }
  `);

    function fristAvatarBigger() {
      document.querySelectorAll(`.topic-list td.posters.topic-list-data > a:first-child > img,
    .topic-list td.posters.topic-list-data > a.latest > img`).forEach(function (img) {
        if (img.src.includes("/24/")) {
          img.src = img.src.replace("/24/","/48/");
        }
      });
      setTimeout(fristAvatarBigger, 1990);
    }
    setTimeout(fristAvatarBigger, 900);
  }

  // Function 19: 边栏显示调整
  if (settings.sidebar_class) {

    function link_wrapper_add_item(name, url, svg_id) {
      let sidebar = document.querySelector("ul#sidebar-section-content-外部链接");
      if(!sidebar) {
        return;
      }
      if(sidebar.querySelector(`[data-link-name="${name}"]`)) return;

      let add_li = document.createElement('li');
      sidebar.append(add_li);
      add_li.className = "sidebar-section-link-wrapper"
      add_li.innerHTML = `
    <a href="${url}" rel="noopener noreferrer" target="_blank" data-link-name="${name}" class="sidebar-section-link sidebar-row" title="来自L站元宇宙，站内佬友提供服务，非官方服务">
     <span class="sidebar-section-link-prefix icon" style="color: #7AA;">
      <svg class="fa d-icon d-icon-far-eye svg-icon prefix-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#${svg_id}"></use></svg>
     </span>
     <span class="sidebar-section-link-content-text">${name}</span>
    </a>`;
    }

    link_wrapper_add_item("WIKI", "https://wiki.linux.do/", "fab-wikipedia-w");
    link_wrapper_add_item("导航", "https://nav.linux.do/", "rocket");

    function add_sel_btns() {
      let btn_menu_save = document.querySelector("#ember3 > div.modal-container > div.modal.d-modal.sidebar__edit-navigation-menu__modal.-large.sidebar__edit-navigation-menu__categories-modal > div > div.d-modal__footer > div.sidebar__edit-navigation-menu__footer > button.btn.btn-text.sidebar__edit-navigation-menu__save-button")

      if (!btn_menu_save) {
        setTimeout(add_sel_btns, 1200);
        return;
      }

      let btns = document.querySelectorAll("#ember3 > div.modal-container > div.modal.d-modal.sidebar__edit-navigation-menu__modal.-large.sidebar__edit-navigation-menu__categories-modal > div > div.d-modal__footer > div.sidebar__edit-navigation-menu__footer > button.btn")
      if (btns.length > 2) {
        setTimeout(add_sel_btns, 2200);
        return;
      }

      let btn_sel_all = document.createElement("button");
      btn_sel_all.innerText = "全选";
      btn_sel_all.className="btn btn-text btn-primary";
      btn_sel_all.style="margin-left:8px;"
      btn_sel_all.onclick = (function () {
        document.querySelectorAll("[id^=sidebar-categories-form__input--").forEach(function(point) {
          if(point.checked!=true){point.click();}
        })
      })

      let btn_sel_none = document.createElement("button");
      btn_sel_none.innerText = "全不选";
      btn_sel_none.className="btn btn-text btn-primary";
      btn_sel_none.style="margin-left:8px;"
      btn_sel_none.onclick = (function () {
        document.querySelectorAll("[id^=sidebar-categories-form__input--").forEach(function(point) {
          if(point.checked==true){point.click();}
        })
      })

      let btn_sel_not = document.createElement("button");
      btn_sel_not.innerText = "反选";
      btn_sel_not.className="btn btn-text btn-primary";
      btn_sel_not.style="margin-left:8px;"
      btn_sel_not.onclick = (function () {
        document.querySelectorAll("[id^=sidebar-categories-form__input--").forEach(function(point) {
          point.click();
        })
      })

      if(btn_menu_save){
        btn_menu_save.after(btn_sel_all);
        btn_menu_save.after(btn_sel_none);
        btn_menu_save.after(btn_sel_not);
      }

      setTimeout(add_sel_btns, 3200);
    }

    add_sel_btns();

    function path_depth() {
      const links = document.querySelectorAll('#main-outlet-wrapper #d-sidebar #sidebar-section-content-categories > li.sidebar-section-link-wrapper > a[href]');
      links.forEach(link => {
        let href = link.getAttribute("href");
        //console.log(href);
        let path_depth= href.split('/').length - 1;
        if (path_depth <= 3) {
          link.style.paddingLeft = '1.5em';

          if ((path_depth == 3) && (link.nextSibling.tagName != "SPAN") ) {

            let hrefx = href.replace(/\d+$/,'');
            const subTopic = document.querySelectorAll(`#sidebar-section-content-categories > li.sidebar-section-link-wrapper > a[href^="${hrefx}"]:not([href="${href}"]`);

            if(subTopic.length > 0) {
              let btn_ls = document.createElement("span");
              btn_ls.innerText = '-';

              btn_ls.onclick = (function () {
                if( btn_ls.innerText == '-') {
                  subTopic.forEach(function(item) {
                    item.parentElement.style.fontSize = "0px";
                    item.parentElement.style.paddingLeft = "100%";
                    setTimeout(() => {
                      item.parentElement.style.height = '0px';
                      item.parentElement.style.overflow = 'hidden';
                    }, 300);
                  });
                  btn_ls.innerText = '+'
                } else {
                  subTopic.forEach(function(item) {
                    item.parentElement.style="";
                  });
                  btn_ls.innerText = '-'
                }
              })
              link.after(btn_ls);
            }
          }
        }
      });

      let categories = document.querySelector("#sidebar-section-content-categories");
      let categories_ctrl = document.querySelector("#categories_ctrl");
      if (categories && !categories_ctrl) {
        var newDiv = document.createElement("div");
        newDiv.id = 'categories_ctrl'
        var button1 = document.createElement("button");
        button1.innerHTML = "展开子分类";
        button1.onclick = function() {
          links.forEach(link => {
            let href = link.getAttribute("href");
            let path_depth= href.split('/').length - 1;
            if (path_depth <= 3) {
              if ((path_depth == 3) && (link.nextSibling.tagName == "SPAN") ) {
                link.nextSibling.innerText = '-';
                let hrefx = href.replace(/\d+$/,'');
                const subTopic = document.querySelectorAll(`#sidebar-section-content-categories > li.sidebar-section-link-wrapper > a[href^="${hrefx}"]:not([href="${href}"]`);
                subTopic.forEach(function(item) {
                  item.parentElement.style="";
                });
              }
            }
          });
        };
        var button2 = document.createElement("button");
        button2.innerHTML = "折叠子分类";
        button2.onclick = function() {
          links.forEach(link => {
            let href = link.getAttribute("href");
            let path_depth= href.split('/').length - 1;
            if (path_depth <= 3) {
              if ((path_depth == 3) && (link.nextSibling.tagName == "SPAN") ) {
                link.nextSibling.innerText = '+';
                let hrefx = href.replace(/\d+$/,'');
                const subTopic = document.querySelectorAll(`#sidebar-section-content-categories > li.sidebar-section-link-wrapper > a[href^="${hrefx}"]:not([href="${href}"]`);
                subTopic.forEach(function(item) {
                  item.parentElement.style.fontSize = "0px";
                  item.parentElement.style.paddingLeft = "100%";
                  setTimeout(() => {
                    item.parentElement.style.height = '0px';
                    item.parentElement.style.overflow = 'hidden';
                  }, 300);
                });
              }
            }
          });
        };
        newDiv.appendChild(button1);
        newDiv.appendChild(button2);
        categories.insertBefore(newDiv, categories.firstChild);
      }


      setTimeout(path_depth, 2000);
    }
    path_depth();


    GM_addStyle(`
  #categories_ctrl {
    margin-left: auto;
    margin-right: 0px;
    padding: 0px;
    width: fit-content;
    font-size: 12px;
  }
  #categories_ctrl > button {
    background-color: transparent;
    padding: 3px;
    border: 1px solid #8888;
    margin-left: 5px;
  }
  #categories_ctrl > button:hover {
    background-color: #8888;
  }

  #main-outlet-wrapper #d-sidebar #sidebar-section-content-categories > li.sidebar-section-link-wrapper > span:hover {
    background-color: #8888;
  }

  #main-outlet-wrapper #d-sidebar #sidebar-section-content-categories > li.sidebar-section-link-wrapper > span {
    padding: 3px;
    width: 16px;
    border: 1px solid #8888;
    text-align: center;
    line-height: 16px;
    font-size: 20px;
    cursor: pointer;
  }

  #main-outlet-wrapper #d-sidebar #sidebar-section-content-categories > li.sidebar-section-link-wrapper {
    transition: all 0.2s ease-out;
  }

  `);

  }

  // Function 20: 小黄点/小红点隐藏
  if (settings.red_dot_hidden) {
    GM_addStyle(`
  .icon.unread {
     visibility: hidden;
  }
  .chat-channel-unread-indicator {
     visibility: hidden;
  }
  .badge.badge-notification.new-topic {
     visibility: hidden;
  }
  .badge.badge-notification.unread-posts {
     visibility: hidden;
  }

  `);
  }

})();


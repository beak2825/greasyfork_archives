// ==UserScript==
// @name         🎬追剧系列--爱优腾芒VIP视频破解（精简版）
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  爱优腾芒VIP视频解析 - 修复点击“隐藏”无效的问题，保持芒果TV防遮挡功能，纯白弹窗交互。
// @match        https://www.iqiyi.com/*
// @match        https://v.qq.com/x/cover/*
// @match        https://www.mgtv.com/b/*
// @match        https://v.youku.com/v_show/*
// @match        https://youku.com/v_show/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467869/%F0%9F%8E%AC%E8%BF%BD%E5%89%A7%E7%B3%BB%E5%88%97--%E7%88%B1%E4%BC%98%E8%85%BE%E8%8A%92VIP%E8%A7%86%E9%A2%91%E7%A0%B4%E8%A7%A3%EF%BC%88%E7%B2%BE%E7%AE%80%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/467869/%F0%9F%8E%AC%E8%BF%BD%E5%89%A7%E7%B3%BB%E5%88%97--%E7%88%B1%E4%BC%98%E8%85%BE%E8%8A%92VIP%E8%A7%86%E9%A2%91%E7%A0%B4%E8%A7%A3%EF%BC%88%E7%B2%BE%E7%AE%80%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const DRAG_THRESHOLD = 5;

  // 加载 SweetAlert2
  const loadSweetAlert = () => {
    return new Promise((resolve) => {
      if (typeof Swal !== 'undefined') { resolve(); return; }
      const swalScript = document.createElement("script");
      swalScript.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
      swalScript.onload = resolve;
      document.head.appendChild(swalScript);
    });
  };

  // 全局样式
  const addGlobalStyle = () => {
    const style = document.createElement("style");
    style.textContent = `
        /* --- 1. 基础样式 --- */
        ::-webkit-scrollbar { width: 10px !important; }
        ::-webkit-scrollbar-thumb { background: #8e8e8e !important; border-radius: 10px !important; }
        ::-webkit-scrollbar-thumb:hover { background: #555555 !important; }
        .no-select { user-select: none; }

        /* --- 2. 菜单容器 --- */
        .button-container {
            position: fixed;
            z-index: 2147483647 !important;
            display: none;
            width: 280px;
            box-sizing: border-box;
            background: rgba(20, 20, 20, 0.95);
            padding: 15px;
            border-radius: 8px;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 20px rgba(0,0,0,0.6);
            border: 1px solid rgba(255,255,255,0.1);
            grid-template-columns: repeat(2, 1fr);
            grid-gap: 10px;
        }

        /* --- 3. 菜单按钮样式 --- */
        .vip-button {
            background: linear-gradient(45deg, #ff8c00, #ffd700);
            border: 0; padding: 0; height: 34px; color: #000;
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            font-size: 13px; font-weight: bold; border-radius: 5px; width: 100%;
            transition: transform 0.2s;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .vip-button:hover { background: linear-gradient(45deg, #ffa500, #ff4500); transform: translateY(-2px); }

        .add-button { background: linear-gradient(45deg, #1e90ff, #00bfff); color: white; }
        .manage-button { background: linear-gradient(45deg, #8e44ad, #9b59b6); color: white; }
        .reset-button { background: linear-gradient(45deg, #ff4500, #ff0000); color: white; }

        /* --- 4. 作者信息 --- */
        .author-info {
            background-color: #ff4500; color: #ffffff; padding: 8px;
            text-align: center; font-weight: bold; border-radius: 5px;
            margin-bottom: 10px; font-size: 12px; grid-column: 1 / -1;
        }
        .author-link-button {
            background: linear-gradient(45deg, #1e90ff, #00bfff); color: #ffffff;
            padding: 8px 0; text-align: center; font-weight: bold; border-radius: 5px;
            cursor: pointer; display: block; text-decoration: none; grid-column: 1 / -1;
        }
        .author-link-button:hover { color:#fff !important; }
        #about { color:#ff0000; line-height: 27px; }

        /* --- 5. SweetAlert2 弹窗深度定制 (纯白风格) --- */
        .swal2-container { z-index: 2147483648 !important; }

        div.swal2-popup {
            background: #ffffff !important;
            border-radius: 10px !important;
            padding-bottom: 30px !important;
            width: 420px !important;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2) !important;
        }
        h2.swal2-title {
            color: #333333 !important; font-size: 1.5em !important; font-weight: bold; margin-bottom: 10px !important;
        }
        div.swal2-html-container { color: #555555 !important; font-size: 14px !important; }

        .swal-custom-html-container {
            display: flex; flex-direction: column; gap: 20px; margin-top: 10px; padding: 0 15px;
        }

        .custom-swal-input {
            width: 100% !important; box-sizing: border-box !important; height: 45px !important;
            padding: 0 15px !important; background-color: #f9f9f9 !important;
            border: 1px solid #ddd !important; border-radius: 6px !important;
            color: #333 !important; font-size: 14px !important; outline: none !important;
            transition: border-color 0.3s, box-shadow 0.3s;
        }
        .custom-swal-input::placeholder { color: #999; }
        .custom-swal-input:focus {
            border-color: #1e90ff !important;
            box-shadow: 0 0 8px rgba(30, 144, 255, 0.2) !important;
            background-color: #fff !important;
        }

        .swal2-confirm, .swal2-cancel {
            padding: 10px 30px !important; font-size: 14px !important; font-weight: bold !important;
            border-radius: 6px !important; margin: 0 15px !important; box-shadow: none !important;
        }
        button.swal2-confirm { background: #1e90ff !important; color: #fff !important; }
        button.swal2-cancel { background: #e0e0e0 !important; color: #555 !important; }
        button.swal2-cancel:hover { background: #d0d0d0 !important; }

        /* 管理列表 */
        .manage-list {
            list-style: none; padding: 0; margin: 0; max-height: 300px; overflow-y: auto; text-align: left;
        }
        .manage-item {
            display: flex; justify-content: space-between; align-items: center;
            padding: 10px; border-bottom: 1px solid #eee;
        }
        .manage-item:last-child { border-bottom: none; }
        .manage-name { color: #333; font-size: 14px; font-weight: bold; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 200px; }
        .manage-delete-btn {
            background-color: #ff4500; color: white; border: none; padding: 5px 12px;
            border-radius: 4px; cursor: pointer; font-size: 12px;
        }
        .manage-delete-btn:hover { background-color: #ff2200; }
        .no-data-tip { color: #999; text-align: center; padding: 20px; }
    `;
    document.head.appendChild(style);
  };

  // 创建悬浮球
  const createParseButton = () => {
    const parseButton = document.createElement("div");
    parseButton.className = "no-select";

    let savedTop = localStorage.getItem("vip_btn_top") || "50%";
    let savedLeft = localStorage.getItem("vip_btn_left") || "0px";

    parseButton.style.cssText = `
        width: 50px; height: 50px; border-radius: 50%;
        background:linear-gradient(45deg, #ff8c00, #ffd700);
        position: fixed; left: ${savedLeft}; top: ${savedTop};
        cursor: grab;
        z-index: 2147483647 !important;
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        color: black; font-size: 13px; font-weight: bold;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        transition: transform 0.1s;
        pointer-events: auto !important;
      `;
    parseButton.textContent = "VIP";
    parseButton.title = "公众号：软件小邓";
    parseButton.onmousedown = () => parseButton.style.transform = 'scale(0.95)';
    parseButton.onmouseup = () => parseButton.style.transform = 'scale(1)';
    return parseButton;
  };

  const createAuthorInfo = () => {
    const authorInfo = document.createElement("div");
    authorInfo.className = "author-info";
    authorInfo.textContent = "注：遇到无法解析的，请切换路线！";
    return authorInfo;
  };

  const createAuthorLinkButton = () => {
    const authorLinkButton = document.createElement("a");
    authorLinkButton.className = "author-link-button";
    authorLinkButton.href = "https://link3.cc/rjxd666";
    authorLinkButton.target = "_blank";
    authorLinkButton.textContent = "关于作者";
    return authorLinkButton;
  };

  const getApiList = () => {
      const defaultApis = [
          { name: "路线①", url: "https://jx.m3u8.tv/jiexi/?url=" },
          { name: "盘古", url: "https://www.pangujiexi.com/jiexi/?url=" },
          { name: "夜幕", url: "https://www.yemu.xyz/?url=" },
          { name: "爱豆", url: "https://jx.aidouer.net/?url=" },
          { name: "虾米", url: "https://jx.xmflv.com/?url=" },
          { name: "冰豆", url: "https://api.qianqi.net/vip/?url=" },
      ];
      const customApis = JSON.parse(localStorage.getItem("vip_custom_apis") || "[]");
      return [...customApis, ...defaultApis];
  };

  // 管理接口
  const manageCustomApi = async (parseButton) => {
      if (typeof Swal === 'undefined') await loadSweetAlert();
      if (typeof Swal === 'undefined') { alert("功能组件加载失败，请刷新页面"); return; }

      const renderList = () => {
          const customApis = JSON.parse(localStorage.getItem("vip_custom_apis") || "[]");
          if (customApis.length === 0) return '<div class="no-data-tip">暂无自定义接口</div>';

          let html = '<ul class="manage-list">';
          customApis.forEach((api, index) => {
              html += `
                <li class="manage-item">
                    <span class="manage-name">${api.name}</span>
                    <button class="manage-delete-btn" data-index="${index}">🗑️ 删除</button>
                </li>
              `;
          });
          html += '</ul>';
          return html;
      };

      await Swal.fire({
          title: '管理自定义接口',
          html: `<div id="manage-list-container">${renderList()}</div>`,
          showConfirmButton: false,
          showCloseButton: true,
          didOpen: () => {
              const container = document.getElementById('manage-list-container');
              container.addEventListener('click', (e) => {
                  if (e.target.classList.contains('manage-delete-btn')) {
                      const index = e.target.getAttribute('data-index');
                      const customApis = JSON.parse(localStorage.getItem("vip_custom_apis") || "[]");
                      const deletedName = customApis[index].name;
                      customApis.splice(index, 1);
                      localStorage.setItem("vip_custom_apis", JSON.stringify(customApis));
                      container.innerHTML = renderList();
                      refreshMenu(parseButton);
                      const toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 1500 });
                      toast.fire({ icon: 'success', title: `已删除: ${deletedName}` });
                  }
              });
          }
      });
  };

  // 添加接口
  const addCustomApi = async () => {
      if (typeof Swal === 'undefined') await loadSweetAlert();
      if (typeof Swal === 'undefined') {
          const name = prompt("请输入接口名称");
          const url = prompt("请输入接口地址");
          if(name && url) return [name, url];
          return false;
      }

      const { value: formValues } = await Swal.fire({
          title: '添加接口',
          html: `
            <div class="swal-custom-html-container">
                <input id="swal-api-name" class="custom-swal-input" placeholder="接口名称 (例如：我的线路)" autocomplete="off">
                <input id="swal-api-url" class="custom-swal-input" placeholder="接口地址 (例如：https://.../?url=)" autocomplete="off">
            </div>
          `,
          showCancelButton: true,
          confirmButtonText: '保存',
          cancelButtonText: '取消',
          buttonsStyling: false,
          reverseButtons: true,
          customClass: { confirmButton: 'swal2-confirm', cancelButton: 'swal2-cancel' },
          preConfirm: () => {
              const name = document.getElementById('swal-api-name').value;
              const url = document.getElementById('swal-api-url').value;
              if (!name || !url) { Swal.showValidationMessage('请填写完整的接口名称和地址'); return false; }
              return [name, url];
          }
      });

      if (formValues) {
          const newApi = { name: formValues[0], url: formValues[1] };
          const currentCustom = JSON.parse(localStorage.getItem("vip_custom_apis") || "[]");
          currentCustom.unshift(newApi);
          localStorage.setItem("vip_custom_apis", JSON.stringify(currentCustom));

          Swal.fire({
              icon: 'success', title: '添加成功',
              timer: 1000, showConfirmButton: false
          });
          return true;
      }
      return false;
  };

  // 创建菜单
  const createButtonContainer = (parseButton) => {
    // 移除ID查找，防止获取到被隐藏的旧元素
    const oldContainers = document.querySelectorAll('.button-container');
    oldContainers.forEach(el => el.remove());

    const container = document.createElement("div");
    container.className = "button-container";
    // 初始状态必须是隐藏，由后续逻辑控制显示
    container.style.display = "none";

    container.appendChild(createAuthorInfo());

    const apiList = getApiList();
    apiList.forEach((api) => {
      const button = document.createElement("button");
      button.className = "vip-button";
      button.textContent = api.name;
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        window.open(`${api.url}${window.location.href}`, "_blank");
      });
      container.appendChild(button);
    });

    const addBtn = document.createElement("button");
    addBtn.className = "vip-button add-button";
    addBtn.textContent = "➕ 添加";
    addBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const res = await addCustomApi();
        if(res) refreshMenu(parseButton);
    });
    container.appendChild(addBtn);

    const manageBtn = document.createElement("button");
    manageBtn.className = "vip-button manage-button";
    manageBtn.textContent = "⚙️ 管理";
    manageBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        manageCustomApi(parseButton);
    });
    container.appendChild(manageBtn);

    const resetBtn = document.createElement("button");
    resetBtn.className = "vip-button reset-button";
    resetBtn.textContent = "🔄 重置";
    resetBtn.style.gridColumn = "1 / -1";
    resetBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        if (typeof Swal === 'undefined') await loadSweetAlert();
        if (typeof Swal === 'undefined') {
             if(confirm("确定要重置吗？")) { localStorage.clear(); location.reload(); }
             return;
        }

        const result = await Swal.fire({
            title: '确定要重置吗？',
            text: "这将清空所有自定义接口和设置，无法恢复。",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '确定重置',
            cancelButtonText: '取消',
            reverseButtons: true,
            buttonsStyling: false,
            customClass: { confirmButton: 'swal2-confirm', cancelButton: 'swal2-cancel' },
            didOpen: () => { Swal.getConfirmButton().style.backgroundColor = '#ff4500'; }
        });

        if (result.isConfirmed) {
            localStorage.clear();
            await Swal.fire({ title: "重置成功", icon: "success", timer: 1000, showConfirmButton: false });
            location.reload();
        }
    });
    container.appendChild(resetBtn);

    container.appendChild(createAuthorLinkButton());

    container.addEventListener("click", (e) => {
        e.stopPropagation();
        e.stopImmediatePropagation();
    });
    container.addEventListener("mousedown", (e) => e.stopPropagation());

    return container;
  };

  const refreshMenu = (parseButton) => {
      // 刷新时，先删除，再创建，保证最新状态
      const newMenu = createButtonContainer(parseButton);
      document.body.appendChild(newMenu);

      const rect = parseButton.getBoundingClientRect();
      updateMenuPosition(newMenu, rect);

      // 保持显示状态
      newMenu.style.display = 'grid';
  };

  const updateMenuPosition = (menu, btnRect) => {
      const clientWidth = document.documentElement.clientWidth;
      const showLeft = btnRect.left > clientWidth / 2;

      if (showLeft) {
          menu.style.left = (btnRect.left - 310) + 'px'; // 保持防重叠间距
      } else {
          menu.style.left = (btnRect.left + 70) + 'px';
      }

      let top = btnRect.top;
      if (top + menu.offsetHeight > window.innerHeight) {
          top = window.innerHeight - menu.offsetHeight - 10;
      }
      menu.style.top = top + 'px';
  };

  const showTermsPopup = async () => {
    if (typeof Swal === 'undefined') await loadSweetAlert();

    if (typeof Swal === 'undefined') {
        return confirm("用户协议：\n1. 仅供学习交流。\n2. 点击确定代表同意。");
    }

    const result = await Swal.fire({
      title: "用户协议",
      html: `
          <div style='text-align:left; font-size:14px;'>
            免责声明：<br>
            1. VIP视频解析中所用到的解析接口来自于网络，版权问题请联系相关解析接口所有者。<br>
            2. 为创造良好的创作氛围，请大家支持正版。<br>
            3. 脚本仅用于学习，切勿用于任何商业用途。<br>
            4. 个别解析线路带有可选的额外收费提速功能，这是线路行为，与脚本作者无关。<br>
            5. 如发现有线路含有广告，请千万不要相信，并请及时反馈，我会第一时间移除该线路。<br>
            6. 点击同意，即表明你已经明确使用脚本可能带来的风险，且愿意自行承担相关风险，对于风险网站不承担任何责任。
            <p style="color:#ff0000;margin-top:10px;">- 更新1：新增了可用路线，移除了失效路线！</p>
            <p style="color:#ff0000;">- 更新2：代码架构重新构建，确保运行速度及稳定。</p>
            <br><br>
            <div style="text-align:center;">
              <span>⭐️Zlibrary最新地址，各种实用软件，李跳跳最新规则等⭐️</span><br>
              <span>请关注公众号：<b style="color:#0045ff;">软件小邓</b></span><br>
              <a href="https://link3.cc/rjxd666" target="_blank" id="about"> >>关于作者<< </a>
            </div>
          </div>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "我已仔细阅读协议并同意",
      cancelButtonText: "取消",
      reverseButtons: true,
      buttonsStyling: false,
      customClass: { confirmButton: 'swal2-confirm', cancelButton: 'swal2-cancel' }
    });

    if (result.isConfirmed) {
      await Swal.fire({
        title: "已确认", text: "您已经同意用户协议。", icon: "success", timer: 2000, showConfirmButton: false,
      });
      return true;
    } else {
      await Swal.fire({
        title: "已取消", text: "您取消了用户协议。", icon: "error", timer: 2000, showConfirmButton: false,
      });
      return false;
    }
  };

  const main = async () => {
    await loadSweetAlert();
    addGlobalStyle();

    const parseButton = createParseButton();
    let buttonContainer = createButtonContainer(parseButton);
    document.body.appendChild(parseButton);
    document.body.appendChild(buttonContainer);

    let isDragging = false;
    let hasMoved = false;
    let startX, startY, initLeft, initTop;
    let dragFrame = null;

    // 强力阻断所有冒泡，防止网页捕获
    ['click', 'mousedown', 'mouseup', 'mousemove'].forEach(evt => {
        parseButton.addEventListener(evt, (e) => e.stopPropagation());
    });

    parseButton.addEventListener('mousedown', (e) => {
        if((e.buttons & 1) === 0) return;
        e.preventDefault();

        isDragging = true;
        hasMoved = false;
        startX = e.clientX;
        startY = e.clientY;
        const rect = parseButton.getBoundingClientRect();
        initLeft = rect.left;
        initTop = rect.top;

        parseButton.style.cursor = 'grabbing';

        const onMouseMove = (e) => {
            if ((e.buttons & 1) === 0) { onMouseUp(); return; }
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) hasMoved = true;

            if (hasMoved) {
                if (dragFrame) cancelAnimationFrame(dragFrame);
                dragFrame = requestAnimationFrame(() => {
                    const clientWidth = document.documentElement.clientWidth;
                    const maxLeft = clientWidth - 50;
                    let newLeft = Math.max(0, Math.min(maxLeft, initLeft + dx));
                    let newTop = Math.max(0, Math.min(window.innerHeight - 50, initTop + dy));

                    parseButton.style.left = `${newLeft}px`;
                    parseButton.style.top = `${newTop}px`;

                    if (buttonContainer.style.display === 'grid') {
                         updateMenuPosition(buttonContainer, parseButton.getBoundingClientRect());
                    }
                });
            }
        };

        const onMouseUp = () => {
            isDragging = false;
            parseButton.style.cursor = 'grab';
            if (dragFrame) cancelAnimationFrame(dragFrame);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            if (hasMoved) {
                localStorage.setItem("vip_btn_left", parseButton.style.left);
                localStorage.setItem("vip_btn_top", parseButton.style.top);
            }
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    parseButton.addEventListener("click", async (event) => {
      event.stopPropagation();
      event.stopImmediatePropagation();
      event.preventDefault();

      if (hasMoved) { return; }

      if (!localStorage.getItem("agreedToTerms")) {
        const agreed = await showTermsPopup();
        if (!agreed) return;
        localStorage.setItem("agreedToTerms", "true");
      }

      // --- 核心修复逻辑 V2.0 ---
      // 1. 先检查当前菜单是否存在且显示
      let currentMenu = document.querySelector('.button-container');
      const isVisible = currentMenu && currentMenu.style.display === 'grid';

      if (isVisible) {
          // 如果已显示，则直接隐藏，改变文本，结束
          currentMenu.style.display = 'none';
          parseButton.textContent = 'VIP';
          return;
      }

      // 如果未显示（或不存在），则执行“芒果TV穿透逻辑”：
      // 强制移除旧的 -> 创建新的 -> 插入到 Body 末尾
      if (currentMenu) currentMenu.remove();

      buttonContainer = createButtonContainer(parseButton);
      document.body.appendChild(buttonContainer);

      updateMenuPosition(buttonContainer, parseButton.getBoundingClientRect());
      buttonContainer.style.display = 'grid';
      parseButton.textContent = '隐藏';

    }, true);

    document.addEventListener("click", (e) => {
      if (e.target.closest('.swal2-container')) return;

      // 这里重新获取 currentMenu，因为每次点击可能会创建新的
      let currentMenu = document.querySelector('.button-container');
      if (currentMenu && currentMenu.style.display === "grid" &&
          e.target !== parseButton && !parseButton.contains(e.target) &&
          !currentMenu.contains(e.target)) {
        currentMenu.style.display = "none";
        parseButton.textContent = "VIP";
      }
    }, true);
  };

  main();
})();
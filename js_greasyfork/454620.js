// ==UserScript==
// @name        跳板机登录
// @namespace   http://howe.com
// @version     5.1
// @author      howe
// @description 不使用弹窗，页面加载后显示悬浮按钮，点击显示登录项列表，支持在页面内添加/编辑登录项并保存（GM storage）。
// @include     *://24.*
// @include     *://ybj.shanxi.gov.cn/ybfw/*
// @include     *://*huaweicitycloud.com/*
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/11.14.5/sweetalert2.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/keymaster/1.6.1/keymaster.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @resource    swalStyle https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/11.14.5/sweetalert2.css
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_openInTab
// @grant       GM_getResourceText
// @grant       GM_registerMenuCommand
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/454620/%E8%B7%B3%E6%9D%BF%E6%9C%BA%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/454620/%E8%B7%B3%E6%9D%BF%E6%9C%BA%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 简单工具
  const util = {
    configCache: new Map(),
    
    get(key, def) {
      try {
        const v = GM_getValue(key);
        return v === undefined ? def : v;
      } catch (e) {
        return def;
      }
    },
    set(key, val) {
      try {
        GM_setValue(key, val);
      } catch (e) {
        console.error(e);
      }
    },
    
    keyInput(id, data, maxRetries = 10) {
      let retryCount = 0;
      const tryInput = () => {
        const el = document.getElementById(id);
        if (el) {
          el.value = data;
          this.dispatchInput(el);
        } else if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(tryInput, 500);
        }
      };
      tryInput();
    },

    getCachedConfig(key) {
      if (util.configCache.has(key)) {
        return util.configCache.get(key);
      }
      try {
        const value = JSON.parse(util.get(key, '[]'));
        util.configCache.set(key, value);
        return value;
      } catch (e) {
        console.error('Parse config error:', e);
        return [];
      }
    },

    clearCache() {
      util.configCache.clear();
    },

    decrypt(s, isToken) {
      util.clog(`解密入参：${s}`);
      let key = "i1dS4PJXv612krF0";
        if (isToken) {
          key = "SiIiqxyoDXuxbnGv"
        }
      if (!s) return '';
      var e = CryptoJS.enc.Utf8.parse(key);
      var a = CryptoJS.AES.decrypt(s, e, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
      var decrypt = CryptoJS.enc.Utf8.stringify(a).toString();
      util.clog(`解密出参：${decrypt}`);
      return decrypt.toString();
    },

    groupStarted: false,
    
    startLog() {
      if (!this.groupStarted) {
        console.group('[跳板机登录插件日志]');
        this.groupStarted = true;
      }
    },

    endLog() {
      if (this.groupStarted) {
        console.groupEnd();
        this.groupStarted = false;
      }
    },

    clog(c) {
      console.log(c);
    },

    showMsg(msg, duration = 3000) {
      let el = document.querySelector('.yhj-msg');
      if (el) el.remove();
      
      el = document.createElement('div');
      el.className = 'yhj-msg';
      el.textContent = msg;
      document.body.appendChild(el);
      
      setTimeout(() => el.remove(), duration);
    },
    dispatchInput(el) {
      if (!el) return;
      el.focus && el.focus();
      ['input', 'change', 'keyup'].forEach((t) => {
        try {
          const ev = new Event(t, { bubbles: true });
          el.dispatchEvent(ev);
        } catch (e) {
          const ev2 = document.createEvent('HTMLEvents');
          ev2.initEvent(t, true, false);
          el.dispatchEvent(ev2);
        }
      });
    },
    addStyle(id, tag, css) {
      tag = tag || 'style';
      let doc = document, styleDom = doc.getElementById(id);
      if (styleDom) return;
      let style = doc.createElement(tag);
      style.rel = 'stylesheet';
      style.id = id;
      tag === 'style' ? style.innerHTML = css : style.href = css;
      document.head.appendChild(style);
    }
  };

  // 存储键
  const STORE_KEY = 'yhj_login_items_v1';  // 创建样式
  function addStyle() {
    const css = `
      .yhj-fab {position: fixed; right: 20px; bottom: 20px; z-index: 999999; width:56px;height:56px;border-radius:28px;background:rgba(0,120,212,0);color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 18px rgba(0,0,0,.1);cursor:move;user-select:none;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)}
      .yhj-fab:hover {background:rgba(0,120,212,0)}
      .yhj-fab svg {width: 24px; height: 24px;}
      .yhj-fab:hover {background:#106ebe}
      .yhj-fab.dragging {opacity:0.8;cursor:grabbing}
      .yhj-panel {position: fixed; display: block; width:320px; max-height:500px; overflow:auto; z-index:999998; background:#fff;border:1px solid #ddd;border-radius:6px;box-shadow:0 8px 30px rgba(0,0,0,.2);padding:10px;font-family: Arial, Helvetica, sans-serif}
      .yhj-panel.left-side {right: 86px; bottom: 20px}
      .yhj-panel h4{margin:0 0 8px 0;font-size:14px;display:flex;justify-content:space-between;align-items:center}
      .yhj-panel h4 .close{cursor:pointer;opacity:0.6;font-size:18px}
      .yhj-panel h4 .close:hover{opacity:1}
      .yhj-item{display:flex;justify-content:space-between;align-items:center;padding:8px;border-bottom:1px solid #f0f0f0;cursor:pointer}
      .yhj-item:hover{background:#f8f8f8}
      .yhj-item .name{flex:1;padding-right:10px}
      .yhj-item .username{color:#666}
      .yhj-msg{position:fixed;right:20px;bottom:80px;background:#323232;color:#fff;padding:8px 12px;border-radius:4px;z-index:999999;opacity:0.95}
      .swal2-html-container { max-height: 70vh; overflow-y: auto; }
    `;
    const s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
    // 添加 SweetAlert2 样式
    util.addStyle('swal-pub-style', 'style', GM_getResourceText('swalStyle'));
  }

  // 登录相关方法
  const login = {
    // 堡垒机登录
    loginBaoLei(item) {
      if (!item || !item.username || !item.password) {
        util.showMsg('登录信息不完整');
        return;
      }

      // 查找用户名和密码输入框
      let loginBtn = $('[huawei="true"]:first button:contains("登录")');
      if (loginBtn.length) {
        const usernameEl = $('input[name="username"]');
        const passwordEl = $('input[name="pwd"]');
        
        if (usernameEl.length && passwordEl.length) {
          usernameEl.val(item.username);
          util.dispatchInput(usernameEl[0]);
          
          passwordEl.val(item.password);
          util.dispatchInput(passwordEl[0]);
          
          loginBtn.click();
          util.showMsg('已尝试登录堡垒机');
        } else {
          util.showMsg('未找到登录输入框');
        }
      } else {
        util.showMsg('未找到登录按钮');
      }
    },

    // 跳板机登录
    loginWindows(item) {
      if (!item || !item.username || !item.password) {
        util.showMsg('登录信息不完整');
        return;
      }

      util.startLog();
      util.clog("开始登录");
      let cmd = `tr.el-table__row`;
      const rows = document.querySelectorAll(cmd);
      if (rows.length > 0) {
        let found = false;
        // 使用 for...of 循环以支持提前退出
        for (let [i, row] of Array.from(rows).entries()) {
          const ipCell = row.querySelector('.is-left:nth-child(2)');
          if (ipCell) {
            const text = ipCell.textContent;
            util.clog(`循环第${i}个，地址为${text}`);
            if (text.includes(item.ip)) {
              util.clog("找到了，点击打开弹窗");
              const btnCell = row.querySelector('.is-left:nth-child(6) > div > div > div');
              if (btnCell) {
                btnCell.click();
                util.clog("打开弹窗了");
                found = true;
                // 调用输入用户名密码的方法
                setTimeout(() => this.inputDialogPass(item.username, item.password), 500);
                // 找到后直接退出循环
                break;
              }
            }
          }
        };
        if (!found) {
          util.clog("未找到匹配的跳板机");
          util.showMsg('未找到匹配的跳板机');
          util.endLog();
        }
      } else {
        util.clog("地址没找到，请手动登录一次");
        util.showMsg("地址没找到，请手动登录一次");
        util.endLog();
      }
    },

    // 输入弹窗的用户名密码
    inputDialogPass(username, password) {
      let howeUser = "howeUser";
      let howePass = "howePass";
      let retryCount = 0;
      const maxRetries = 20;

      const tryLogin = () => {
        // 找到所有的输入框布局
        const inputLayouts = document.querySelectorAll('div.yab-input-layout');
        let userInput = null;
        let passInput = null;

        // 遍历所有输入框布局，找到包含特定文本的元素
        inputLayouts.forEach(layout => {
          const text = layout.textContent;
          if (text.includes('资源账户')) {
            userInput = layout.querySelector('input');
          } else if (text.includes('密码')) {
            passInput = layout.querySelector('input');
          }
        });

        if (userInput && passInput && retryCount < maxRetries) {
          userInput.id = howeUser;
          util.keyInput(howeUser, username);
          util.clog("输入账号成功");

          passInput.type = "text";
          passInput.id = howePass;
          util.keyInput(howePass, password);
          util.clog("输入密码成功");

          util.clog('点击登录');
          // 查找确定按钮
          const submitBtns = Array.from(document.querySelectorAll('.footer [type="button"]'));
          const submitBtn = submitBtns.find(btn => btn.textContent.includes('确定'));
          if (submitBtn) {
            submitBtn.click();
            util.clog("登录成功");
          }
        } else if (retryCount >= maxRetries) {
          util.clog("登录界面未找到，已停止尝试");
          util.showMsg("登录界面加载超时，请手动登录");
        } else {
          retryCount++;
          util.clog("输入框没找到，重试中...");
          setTimeout(tryLogin, 200);
        }
      };
      tryLogin();
    },

    // Console登录
    loginConsole(item) {
      if (!item || !item.username || !item.email || !item.password) {
        util.showMsg('登录信息不完整');
        return;
      }

      util.startLog();
      util.clog("开始登录Console");

      // 检查是否在子账户登录页面
      let title = document.querySelector('.loginTypeNoSelected');
      if (title && title.textContent.trim().includes("帐户登录")) {
        util.clog("切换到子用户登录");
        const subUserLoginBtn = document.querySelector('#subUserLogin');
        if (subUserLoginBtn) {
          subUserLoginBtn.click();
          // 等待切换完成
          setTimeout(() => this.doConsoleLogin(item), 1000);
          return;
        }
      }
      
      this.doConsoleLogin(item);
    },

    // 执行Console登录操作
    doConsoleLogin(item, retryCount = 0) {
      const maxRetries = 10;
      const inputs = document.querySelectorAll('input.tiny-input-text');
      
      if (inputs.length < 3) {
        if (retryCount >= maxRetries) {
          util.clog("登录界面未找到，已停止尝试");
          util.showMsg("登录界面加载超时，请手动登录");
          util.endLog();
          return;
        }
        util.clog("输入框未完全加载，重试中...");
        setTimeout(() => this.doConsoleLogin(item, retryCount + 1), 500);
        return;
      }

      const usernameId = "usernameId";
      const emailId = "emailId";
      const passwordId = "passwordId";
      
      const [usernameInput, emailInput, passwordInput] = inputs;
      
      if (usernameInput && emailInput && passwordInput) {
        util.clog("找到所有输入框，开始填充");
        
        usernameInput.id = usernameId;
        emailInput.id = emailId;
        passwordInput.id = passwordId;
        
        util.keyInput(usernameId, item.username);
        util.clog("输入用户名成功");
        
        util.keyInput(emailId, item.email);
        util.clog("输入邮箱成功");
        
        util.keyInput(passwordId, item.password);
        util.clog("输入密码成功");
        
        const checkArea = document.querySelector('#checkArea');
        if (checkArea) {
          checkArea.click();
          util.clog("点击记住登录选项成功");
        }
        
        const loginBtn = document.querySelector('#loginBtn');
        if (loginBtn) {
          loginBtn.click();
          util.clog("点击登录按钮成功");
          util.showMsg('已尝试登录Console');
        } else {
          util.clog("未找到登录按钮");
          util.showMsg('未找到登录按钮');
        }
      } else {
        util.clog("未找到所有必需的输入框");
        util.showMsg('未找到登录输入框');
      }
      util.endLog();
    }
  };

	// 读取/保存条目
	function loadItems() {
		const raw = util.get(STORE_KEY, '[]');
		try {
			return JSON.parse(raw || '[]');
		} catch (e) {
			return [];
		}
	}
	function saveItems(items) {
		util.set(STORE_KEY, JSON.stringify(items));
	}

	// 消息
	let msgTimer = null;
	function showMsg(text, timeout = 2000) {
		let el = document.querySelector('.yhj-msg');
		if (!el) {
			el = document.createElement('div');
			el.className = 'yhj-msg';
			document.body.appendChild(el);
		}
		el.textContent = text;
		if (msgTimer) clearTimeout(msgTimer);
		msgTimer = setTimeout(() => { el.remove(); msgTimer = null; }, timeout);
	}

	// 尝试登录：智能填充用户名/密码并点击登录按钮
	function attemptLogin(item) {
		if (!item) return showMsg('未选择登录项');
		showMsg('开始自动填充...');

		// 找到含 password 的表单区域
		const password = item.password || '';
		const username = item.username || item.account || '';

		// 策略：先寻找含 type=password 的 input
		const pwdEl = document.querySelector('input[type=password]');
		let formEl = pwdEl ? pwdEl.closest('form') : null;

		// 如果找不到 form，则在全页面查找首个 text-like 输入
		let userEl = null;
		if (formEl) {
			userEl = formEl.querySelector('input[type=text], input[type=email], input:not([type])');
		}
		if (!userEl) {
			userEl = document.querySelector('input[type=text], input[type=email], input:not([type])');
		}

		if (userEl) {
			userEl.value = username;
			util.dispatchInput(userEl);
		}
		if (pwdEl) {
			pwdEl.value = password;
			util.dispatchInput(pwdEl);
		}

		// 点击登录按钮：优先在同表单内查找包含“登录/登 录/Sign in/SignIn/submit”的按钮
		let loginBtn = null;
		const texts = ['登录', '登 录', 'Sign in', 'Sign In', 'signin', 'submit'];
		function btnMatch(el) {
			if (!el) return false;
			const t = (el.innerText || el.value || '').trim();
			if (!t) return false;
			return texts.some(s => t.indexOf(s) !== -1);
		}

		if (formEl) {
			loginBtn = Array.from(formEl.querySelectorAll('button,input[type=button],input[type=submit]')).find(btnMatch);
		}
		if (!loginBtn) {
			loginBtn = Array.from(document.querySelectorAll('button,input[type=button],input[type=submit]')).find(btnMatch);
		}

		if (loginBtn) {
			try {
				loginBtn.click();
				showMsg('已尝试点击登录按钮');
			} catch (e) {
				showMsg('点击登录按钮失败');
			}
		} else {
			showMsg('未找到登录按钮，请手动提交');
		}
	}

	// 渲染面板
  function renderPanel() {
    // 如果已存在则移除
    let panel = document.querySelector('.yhj-panel');
    if (panel) panel.remove();
    
    const fab = document.querySelector('.yhj-fab');
    if (!fab) return;
    
    panel = document.createElement('div');
    panel.className = 'yhj-panel';
    panel.style.display = 'block'; // 确保初始可见
    
    // 根据按钮位置调整面板位置
    const rect = fab.getBoundingClientRect();
    if (rect.left > window.innerWidth / 2) {
      panel.classList.add('left-side');
    }
    document.body.appendChild(panel);
    panel.style.right = '86px';
    panel.style.bottom = '20px';
    
    const header = document.createElement('h4');
    header.innerHTML = '登录项列表';
    
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close';
    closeBtn.innerHTML = '×';
    closeBtn.onclick = () => panel.style.display = 'none';
    header.appendChild(closeBtn);
    
    panel.appendChild(header);

    // 添加显示单位信息的按钮
    const infoDiv = document.createElement('div');
    infoDiv.className = 'yhj-info-link';
    infoDiv.innerHTML = '📋 查看单位信息';
    infoDiv.style.cssText = 'padding: 8px; cursor: pointer; color: #0078d4; border-bottom: 1px solid #f0f0f0; font-size: 14px;';
    infoDiv.onmouseover = () => infoDiv.style.backgroundColor = '#f8f8f8';
    infoDiv.onmouseout = () => infoDiv.style.backgroundColor = '';
    infoDiv.onclick = () => {
      panel.style.display = 'none';  // 隐藏当前面板
      showCompanyInfo();  // 显示单位信息
    };
    panel.appendChild(infoDiv);

    const list = document.createElement('div');
    const items = loadItems();
    if (items.length === 0) {
      const empty = document.createElement('div');
      empty.textContent = '暂无登录项，请通过设置添加。';
      empty.style.color = '#666';
      empty.style.padding = '6px 0';
      list.appendChild(empty);
    } else {
      items.forEach((it) => {
        const type = it.type || 'windows'; // 默认为windows类型
        const typeName = {
          baolei: '堡垒机',
          windows: '跳板机',
          console: 'Console'
        }[type] || '未知';
        
        const row = document.createElement('div');
        row.className = 'yhj-item';
        row.innerHTML = `
          <div class="name">${escapeHtml(it.name || '未命名')} <small style="color:#999">[${typeName}]</small></div>
          <div class="username">${escapeHtml(it.username || '')}</div>
        `;
        
        row.onclick = () => {
          switch (type) {
            case 'baolei':
              login.loginBaoLei(it);
              break;
            case 'windows':
              login.loginWindows(it);
              break;
            case 'console':
              login.loginConsole(it);
              break;
            default:
              util.showMsg('未知的登录类型');
          }
          panel.style.display = 'none';  // 点击后隐藏面板
        };
        list.appendChild(row);
      });
    }
    panel.appendChild(list);
    panel.style.display = 'none';  // 默认隐藏
  }

  // 转义 HTML
  function escapeHtml(s) {
    if (!s) return '';
    // 确保输入是字符串类型
    s = String(s);
    return s.replace(/[&<>"']/g, function (c) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]; });
  }  // 显示设置
  function showSettings() {
    const items = loadItems();
    const rows = items.map((it, idx) => `
      <tr>
        <td>${escapeHtml(it.name || '')}</td>
        <td>${escapeHtml(it.username || '')}</td>
        <td>${escapeHtml(it.ip || '')}</td>
        <td>
          <button data-action="edit" data-idx="${idx}">编辑</button>
          <button data-action="delete" data-idx="${idx}">删除</button>
        </td>
      </tr>
    `).join('');

    const html = `
      <div style="margin-bottom:16px">
        <form id="yhj-form" onsubmit="return false;">
          <input type="hidden" id="yhj_edit_index" value="">
          <div style="margin-bottom:8px">
            <input type="text" id="yhj_name" placeholder="显示名称" style="width:120px;padding:4px">
            <input type="text" id="yhj_username" placeholder="用户名" style="width:120px;padding:4px">
            <input type="password" id="yhj_password" placeholder="密码" style="width:120px;padding:4px">
            <input type="text" id="yhj_ip" placeholder="IP/地址(可选)" style="width:120px;padding:4px">
          </div>
          <div>
            <button type="submit" id="yhj_save_btn">保存</button>
            <button type="button" id="yhj_clear_btn">清空</button>
          </div>
        </form>
      </div>
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr>
            <th style="text-align:left">名称</th>
            <th style="text-align:left">用户名</th>
            <th style="text-align:left">IP/地址</th>
            <th style="text-align:left">操作</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;

    Swal.fire({
      title: '登录项管理',
      html,
      width: '800px',
      showConfirmButton: false,
      showCloseButton: true,
      didOpen: () => {
        // 在弹窗内部处理按钮点击
        const container = Swal.getHtmlContainer();
        
        // 处理编辑和删除按钮
        container.addEventListener('click', (e) => {
          const btn = e.target.closest('button');
          if (!btn) return;
          
          const action = btn.dataset.action;
          const idx = parseInt(btn.dataset.idx);
          
          if (action === 'edit') {
            const item = items[idx];
            document.getElementById('yhj_edit_index').value = idx;
            document.getElementById('yhj_type').value = item.type || 'windows';
            document.getElementById('yhj_name').value = item.name || '';
            document.getElementById('yhj_username').value = item.username || '';
            document.getElementById('yhj_password').value = item.password || '';
            document.getElementById('yhj_ip').value = item.ip || '';
            document.getElementById('yhj_email').value = item.email || '';
          } else if (action === 'del') {
            items.splice(idx, 1);
            saveItems(items);
            showSettings();  // 刷新列表
            renderPanel();   // 更新面板
          }
        });

        // 处理表单提交
        document.getElementById('yhj-form').addEventListener('submit', (e) => {
          e.preventDefault();
          const idx = document.getElementById('yhj_edit_index').value;
          const type = document.getElementById('yhj_type').value;
          const item = {
            type,
            name: document.getElementById('yhj_name').value.trim(),
            username: document.getElementById('yhj_username').value.trim(),
            password: document.getElementById('yhj_password').value
          };

          // 根据类型添加额外字段
          if (type === 'windows') {
            item.ip = document.getElementById('yhj_ip').value.trim();
          } else if (type === 'console') {
            item.email = document.getElementById('yhj_email').value.trim();
          }

          if (!item.username) {
            util.showMsg('用户名不能为空');
            return;
          }

          if (type === 'windows' && !item.ip) {
            util.showMsg('IP地址不能为空');
            return;
          }

          if (type === 'console' && !item.email) {
            util.showMsg('Email不能为空');
            return;
          }

          if (idx === '') {
            items.push(item);
          } else {
            items[parseInt(idx)] = item;
          }

          saveItems(items);
          document.getElementById('yhj_edit_index').value = '';
          document.getElementById('yhj_name').value = '';
          document.getElementById('yhj_username').value = '';
          document.getElementById('yhj_password').value = '';
          document.getElementById('yhj_ip').value = '';
          showSettings();
          renderPanel();
        });

        // 处理清空按钮
        document.getElementById('yhj_clear_btn').addEventListener('click', () => {
          document.getElementById('yhj_edit_index').value = '';
          document.getElementById('yhj_name').value = '';
          document.getElementById('yhj_username').value = '';
          document.getElementById('yhj_password').value = '';
          document.getElementById('yhj_ip').value = '';
        });
      }
    });
      const idx = document.getElementById('yhj_edit_index').value;
      const item = {
        name: document.getElementById('yhj_name').value.trim(),
        username: document.getElementById('yhj_username').value.trim(),
        password: document.getElementById('yhj_password').value,
        ip: document.getElementById('yhj_ip').value.trim()
      };

      if (!item.username) {
        showMsg('用户名不能为空');
        return;
      }

      if (idx === '') {
        items.push(item);
      } else {
        items[parseInt(idx)] = item;
      }

      saveItems(items);
      window._yhj_clear();  // 清空表单
      showSettings();  // 刷新列表
      renderPanel();   // 更新面板
    };

    // 清空表单
    window._yhj_clear = () => {
      document.getElementById('yhj_edit_index').value = '';
      document.getElementById('yhj_name').value = '';
      document.getElementById('yhj_username').value = '';
      document.getElementById('yhj_password').value = '';
      document.getElementById('yhj_ip').value = '';
    };

  // 格式化日期
  function formatDate(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // 格式化字段值
  function formatValue(key, value) {
    if (value === null || value === undefined) return '';
    switch (key) {
      case 'aprvEstaDate':
      case 'empInsuDate':
        return formatDate(value);
      case 'empNo':
        return util.decrypt(value, false);
      default:
        return value;
    }
  }

  // 显示当前单位信息
  function showCompanyInfo() {
    let infoStr = window.localStorage.getItem("InsuEmpInfo");
    let info = infoStr ? JSON.parse(infoStr) : {};

    // 字段名称映射
    const fieldNames = {
      empType: '单位类型',
      clctWay: '征缴方式',
      legrepPsnNo: '法人编号',
      memo: '备注',
      legentAddr: '法人地址',
      regName: '注册名称',
      conerName: '联系人姓名',
      insuOptins: '保险选项',
      clctRuleTypeCodg: '征缴规则类型编码',
      aprvEstaDate: '批准成立日期',
      clctstdCrtfRuleCodg: '征缴标准认定规则编码',
      tel: '电话',
      conerEmail: '联系人邮箱',
      empInsuDate: '参保日期',
      asocLegentFlag: '社会法人标志',
      regno: '注册号',
      empMgtType: '单位管理类型',
      ver: '版本',
      econType: '经济类型',
      insutype: '参保险种',
      afilRlts: '关联关系',
      bizScp: '经营范围',
      bicVer: '基础信息版本',
      legrepCertType: '法人证件类型',
      legentStas: '法人状态',
      legrepName: '法人姓名',
      hiType: '医保类型',
      regCapt: '注册资本',
      locAdmdvs: '行政区划',
      poolareaNo: '统筹区编号',
      empAddr: '单位地址',
      legrepCertno: '法人证件号码',
      uscc: '统一社会信用代码',
      empInsuStas: '参保状态',
      legentAbbr: '法人简称',
      afilIndu: '所属行业',
      prntEmpNo: '上级单位编号',
      empName: '单位名称',
      aprvEstaDocno: '批准成立文号',
      insuAdmdvs: '参保所属行政区',
      regRegCode: '注册地行政区划代码',
      taxNo: '税号',
      legentType: '法人类型',
      maxAcctprd: '最大核定期',
      orgcode: '组织机构代码',
      empNo: '单位编号',
      legentName: '法人名称',
      legrepTel: '法人联系电话',
      regnoCertType: '注册证件类型',
      aprvEstaDept: '批准成立部门',
      posCode: '邮政编码'
    };

    let rows = [];

    // 添加其他信息
    const isInsured = window.localStorage.getItem("isInsured") || '未知';
    const isUploadCommitment = window.localStorage.getItem("isUploadCommitment") || '未知';
    const accessToken = $.cookie("service-mall-accesstoken") || '';
    
    rows.push(`<tr>
      <td>isInsured</td>
      <td>是否参保</td>
      <td>${escapeHtml(isInsured)}</td>
    </tr>`);
    rows.push(`<tr>
      <td>isUploadCommitment</td>
      <td>是否传过承诺书</td>
      <td>${escapeHtml(isUploadCommitment)}</td>
    </tr>`);
    rows.push(`<tr>
      <td>accessToken</td>
      <td>访问令牌(加密)</td>
      <td style="word-break:break-all">${escapeHtml(accessToken)}</td>
    </tr>`);
    if (accessToken) {
      rows.push(`<tr>
        <td>accessToken</td>
        <td>访问令牌(解密)</td>
        <td style="word-break:break-all">${escapeHtml(util.decrypt(accessToken, true))}</td>
      </tr>`);
    }

    if (info) {
      for (let key in info) {
        // 跳过不需要显示的字段
        if (key === 'publicEmpBankParamDTOList') continue;
        
        const displayName = fieldNames[key] || key; // 如果没有中文映射就使用原名
        const formattedValue = formatValue(key, info[key]);
        rows.push(`<tr>
          <td>${escapeHtml(key)}</td>
          <td>${escapeHtml(displayName)}</td>
          <td>${escapeHtml(formattedValue)}</td>
        </tr>`);
      }
    }
    const html = `
      <style>
        .yhj-table { width: 100%; border-collapse: collapse; }
        .yhj-table th, .yhj-table td { padding: 8px; text-align: left; border-bottom: 1px solid #eee; }
        .yhj-table tr:hover { background-color: #f8f8f8; }
        .yhj-table th { background: #f5f5f5; font-weight: bold; }
        .yhj-table td:first-child { color: #666; font-family: monospace; }
        .yhj-table td:nth-child(2) { color: #333; font-weight: bold; }
      </style>
      <table class="yhj-table">
        <thead>
          <tr>
            <th>字段名</th>
            <th>说明</th>
            <th>值</th>
          </tr>
        </thead>
        <tbody>${rows.join('')}</tbody>
      </table>
    `;

    Swal.fire({
      title: '当前单位信息',
      html: html,
      width: 'auto',
      customClass: {
        container: 'yhj-wide-dialog'
      },
      showCloseButton: true
    });

    // 添加宽度样式
    const style = document.createElement('style');
    style.textContent = `
      .yhj-wide-dialog {
        width: 80vw !important;
        margin-left: 10vw !important;
      }
      /* 适配不同屏幕尺寸 */
      @media screen and (max-width: 768px) {
        .yhj-wide-dialog {
          width: 95vw !important;
          margin-left: 2.5vw !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // 创建可拖动的悬浮按钮
  function createFab() {
    if (document.querySelector('.yhj-fab')) return;

    const fab = document.createElement('div');
    fab.className = 'yhj-fab';
    fab.title = '登录列表';
    fab.innerHTML = `<svg t="1760149449732" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1793" width="200" height="200"><path d="M412.08 753.87Q297 855.06 220.14 855.13t-117.27-95.07l309.21-6.24z m202.16 0l309.21 6.19Q883 855.13 806.18 855.13T614.24 753.82zM15.91 489.1q178 95 228.49 125.34t171.89 108.88q-193.1 12-252.75 0.32c-45.49-8.89-80.9-28.29-111.22-58.66Q-8.22 604.44 15.91 489.1z m994.5 0Q1034.56 604.41 974 665c-30.31 30.37-65.72 49.77-111.22 58.66q-59.64 11.7-252.7-0.32 121.27-78.55 171.85-108.88t228.48-125.36zM161.48 228.27q93.08 123.36 127.41 175.94t155 283.38Q205.88 580.55 113 475c-44.49-50.54-44.49-133.46 6-204.23q11-15.4 42.47-42.47z m703.31 0q31.51 27.1 42.47 42.47c50.54 70.77 50.54 153.65 6.06 204.26q-92.88 105.6-331 212.62 120.66-230.8 155-283.43t127.47-175.92zM440.6 84.72q46.51 137.52 52.56 194.1T483.07 659Q280.81 367.83 280.81 236.39T440.6 84.72z m145.21 0Q745.55 105 745.55 236.39T543.34 659q-16.17-323.55-10.09-380.16t52.56-194.1z" fill="#FE0000" p-id="1794"></path></svg>`;
    document.body.appendChild(fab);

    // 拖拽相关变量
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    // 拖拽开始
    fab.addEventListener('mousedown', (e) => {
      isDragging = true;
      fab.classList.add('dragging');

      // 记录起始位置
      startX = e.clientX;
      startY = e.clientY;
      const rect = fab.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;

      // 防止选中文本
      e.preventDefault();
    });

    // 拖拽移动
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;

      // 计算新位置
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      fab.style.left = (startLeft + deltaX) + 'px';
      fab.style.top = (startTop + deltaY) + 'px';
      fab.style.right = 'auto';
      fab.style.bottom = 'auto';
    });

    // 拖拽结束
    document.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      fab.classList.remove('dragging');
    });

    // 点击显示/隐藏面板
    fab.addEventListener('click', (e) => {
      if (isDragging) return;  // 拖拽时不触发点击

      let panel = document.querySelector('.yhj-panel');
      if (!panel) {
        renderPanel();
        panel = document.querySelector('.yhj-panel');
      }
      
      if (panel) {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
      }
    });
  }

  // 显示设置对话框
  function showSettings() {
    const items = loadItems();
    const rows = items.map((item, idx) => {
      const type = item.type || 'windows';
      const typeName = {
        baolei: '堡垒机',
        windows: '跳板机',
        console: 'Console'
      }[type] || '未知';
      
      return `
        <tr>
          <td>${escapeHtml(item.name || '')}</td>
          <td>${typeName}</td>
          <td>${escapeHtml(item.username || '')}</td>
          <td>${type === 'windows' ? escapeHtml(item.ip || '') : type === 'console' ? escapeHtml(item.email || '') : '-'}</td>
          <td>
            <button data-action="edit" data-idx="${idx}" class="yhj-btn">编辑</button>
            <button data-action="del" data-idx="${idx}" class="yhj-btn yhj-btn-danger">删除</button>
          </td>
        </tr>
      `;
    }).join('');

    const html = `
      <style>
        .yhj-form { margin-bottom: 20px; padding: 15px; border: 1px solid #eee; border-radius: 4px; background: #f9f9f9; }
        .yhj-form-row { margin-bottom: 10px; display: flex; gap: 10px; align-items: center; }
        .yhj-form-row:last-child { margin-bottom: 0; }
        .yhj-form select, .yhj-form input { padding: 6px 8px; border: 1px solid #ddd; border-radius: 4px; width: 150px; }
        .yhj-form input[type="password"] { font-family: monospace; }
        .yhj-table { width: 100%; border-collapse: collapse; }
        .yhj-table th, .yhj-table td { padding: 8px; text-align: left; border-bottom: 1px solid #eee; }
        .yhj-table th { background: #f5f5f5; }
        .yhj-btn { padding: 4px 8px; border: 1px solid #ddd; border-radius: 3px; background: #fff; cursor: pointer; }
        .yhj-btn:hover { background: #f5f5f5; }
        .yhj-btn-primary { background: #0078d4; color: #fff; border-color: #0078d4; }
        .yhj-btn-primary:hover { background: #106ebe; }
        .yhj-btn-danger { color: #dc3545; border-color: #dc3545; }
        .yhj-btn-danger:hover { background: #dc3545; color: #fff; }
      </style>
      <form class="yhj-form" id="yhj-form">
        <input type="hidden" id="yhj_edit_index" value="">
        <div class="yhj-form-row">
          <select id="yhj_type">
            <option value="windows">跳板机</option>
            <option value="baolei">堡垒机</option>
            <option value="console">Console</option>
          </select>
          <input type="text" id="yhj_name" placeholder="显示名称">
          <input type="text" id="yhj_username" placeholder="用户名">
          <input type="password" id="yhj_password" placeholder="密码">
        </div>
        <div class="yhj-form-row">
          <input type="text" id="yhj_ip" placeholder="IP地址（跳板机）">
          <input type="text" id="yhj_email" placeholder="Email（Console）">
          <button type="submit" class="yhj-btn yhj-btn-primary">保存</button>
          <button type="button" id="yhj_clear_btn" class="yhj-btn">清空</button>
        </div>
      </form>
      <table class="yhj-table">
        <thead>
          <tr>
            <th>名称</th>
            <th>类型</th>
            <th>用户名</th>
            <th>IP/Email</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;

    Swal.fire({
      title: '登录项管理',
      html,
      width: '900px',
      showConfirmButton: false,
      showCloseButton: true,
      didOpen: () => {
        const container = Swal.getHtmlContainer();
        const form = container.querySelector('#yhj-form');
        const typeSelect = container.querySelector('#yhj_type');
        
        // 根据选择的类型显示/隐藏对应字段
        typeSelect.addEventListener('change', () => {
          const type = typeSelect.value;
          const ipInput = container.querySelector('#yhj_ip');
          const emailInput = container.querySelector('#yhj_email');
          
          if (type === 'windows') {
            ipInput.style.display = '';
            emailInput.style.display = 'none';
            emailInput.value = '';
          } else if (type === 'console') {
            ipInput.style.display = 'none';
            emailInput.style.display = '';
            ipInput.value = '';
          } else {
            ipInput.style.display = 'none';
            emailInput.style.display = 'none';
            ipInput.value = '';
            emailInput.value = '';
          }
        });
        
        // 初始触发一次change事件
        typeSelect.dispatchEvent(new Event('change'));
        
        // 处理编辑和删除
        container.addEventListener('click', (e) => {
          const btn = e.target.closest('button');
          if (!btn || !btn.dataset.action) return;
          
          const action = btn.dataset.action;
          const idx = parseInt(btn.dataset.idx);
          
          if (action === 'edit') {
            const item = items[idx];
            typeSelect.value = item.type || 'windows';
            typeSelect.dispatchEvent(new Event('change'));
            
            container.querySelector('#yhj_edit_index').value = idx;
            container.querySelector('#yhj_name').value = item.name || '';
            container.querySelector('#yhj_username').value = item.username || '';
            container.querySelector('#yhj_password').value = item.password || '';
            container.querySelector('#yhj_ip').value = item.ip || '';
            container.querySelector('#yhj_email').value = item.email || '';
          } else if (action === 'del') {
            items.splice(idx, 1);
            saveItems(items);
            showSettings();
            renderPanel();
          }
        });
        
        // 处理表单提交
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          
          const type = container.querySelector('#yhj_type').value;
          const item = {
            type,
            name: container.querySelector('#yhj_name').value.trim(),
            username: container.querySelector('#yhj_username').value.trim(),
            password: container.querySelector('#yhj_password').value
          };
          
          if (type === 'windows') {
            item.ip = container.querySelector('#yhj_ip').value.trim();
          } else if (type === 'console') {
            item.email = container.querySelector('#yhj_email').value.trim();
          }
          
          // 验证
          if (!item.username) {
            util.showMsg('用户名不能为空');
            return;
          }
          if (type === 'windows' && !item.ip) {
            util.showMsg('IP地址不能为空');
            return;
          }
          if (type === 'console' && !item.email) {
            util.showMsg('Email不能为空');
            return;
          }
          
          const idx = container.querySelector('#yhj_edit_index').value;
          if (idx === '') {
            items.push(item);
          } else {
            items[parseInt(idx)] = item;
          }
          
          saveItems(items);
          showSettings();
          renderPanel();
        });
        
        // 处理清空按钮
        container.querySelector('#yhj_clear_btn').addEventListener('click', () => {
          container.querySelector('#yhj_edit_index').value = '';
          container.querySelector('#yhj_name').value = '';
          container.querySelector('#yhj_username').value = '';
          container.querySelector('#yhj_password').value = '';
          container.querySelector('#yhj_ip').value = '';
          container.querySelector('#yhj_email').value = '';
        });
      }
    });
  }

  // 注册菜单命令
  function registerMenuCommands() {
    GM_registerMenuCommand('⚙️ 登录项管理', showSettings);
    // GM_registerMenuCommand('📋 显示当前单位信息', showCompanyInfo);
  }

  // 初始化
  function init() {
    addStyle();
    createFab();
    renderPanel();
    registerMenuCommands();
  }

  // 等待 DOM 完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
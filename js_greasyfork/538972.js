// ==UserScript==
// @name         bboss-insights-collector
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  a plugin focused on the behavior research of Boss job seekers
// @author       abin
// @match        https://www.zhipin.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_addStyle
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538972/bboss-insights-collector.user.js
// @updateURL https://update.greasyfork.org/scripts/538972/bboss-insights-collector.meta.js
// ==/UserScript==

(function() {
    'use strict';
const BISVERSION = "1.0.0"
const MAX_RECORDS = 1000; // 最大记录数量
const DELETE_COUNT = 50; // 超过最大记录数时删除的数据条数
const BEATNUM = 60000;
let proInerNet = "https://172.27.2.58:9097";
let proOutNet = "https://111.202.197.150:9099";
let timer;
let IS_BOSSPAGE = false;
let isTargetPage = false;
let data = { stuId: "", isDisconnectReconnect: 'N', pluginsContentList: [] };
let itemContent = { act_id: "", act_tool: "chrome" }
let bossName, jobName, isNodeList;

console.log(GM_getValue('isLoggedIn'),'isLoggedInisLoggedInisLoggedIn')
GM_setValue('proIP',proOutNet);
GM_setValue('proInerNet', proInerNet);
GM_setValue('proOutNet', proOutNet);
GM_setValue('operateStatus',false );

const formatTime = (
  time,
  fmt
) => {
  if (!time) { return ''; }
  const date = new Date(time);
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds(),
  };

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    );
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        // @ts-ignore: Unreachable code error
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
    }
  }
  return fmt;
};


  const db = indexedDB.open('bossDatabase', 1); // 名称 + 版本
	db.onerror = (event) => {
		console.error('数据库打开失败:', event.target.error);
	};
	db.onsuccess = (event) => {
		const db = event.target.result;
		console.log('数据库已打开:', db.name);
	};
	db.onupgradeneeded = (event) => {
		const db = event.target.result;
		if (!db.objectStoreNames.contains('')) {
			const store = db.createObjectStore('action', { keyPath: 'id_', autoIncrement: true });
		}
	};

      // 检查用户是否已经登录
    function checkLoginStatus() {
         const isLoggedIn = GM_getValue('isLoggedIn');
        if (isLoggedIn) {
              const username = GM_getValue('username');
              const usernum = GM_getValue('usernum');
            // 显示学号和用户名
            document.querySelector(".boss-script-login")?.remove();
            displayUserInfo(username, usernum);
        } else {
             document.querySelector(".boss-script-info")?.remove();
            // 如果没有登录信息，显示登录表单
            console.log('1111111')
            displayLoginForm();
        }
    }

    // 显示用户信息（学号和用户名）
    function displayUserInfo(username, usernum) {
      const Html = `
      	<div id="floating-window" class="floating-window boss-script-info">
		<div class="floating-window-content">
			<button id="minimize-btn">-</button>
                <div style="text-align: right; margin-right: 20px;">
                    <button id="logout-btn">注销</button>
                </div>
                   <h3 style="margin-top:20px; font-size: 16px;">八维教育 ${BISVERSION}</h3>
                  <form id="loginForm">
                    <div class="layui-form-item">
                        <label class="layui-form-label">学号</label>
                        <div class="layui-input-block">
                        ${usernum}
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">姓名</label>
                        <div class="layui-input-block">
                        ${username}
                        </div>
                    </div>
                </form>
		</div>
	</div>
	<button id="show-btn" class="show-btn">BOSS</button>
        `;
        document.body.insertAdjacentHTML('beforeend', Html);
        const logoutBtn = document.getElementById('logout-btn');
        const floatingWindow = document.getElementById('floating-window');
		const minimizeBtn = document.getElementById('minimize-btn');
		const showBtn = document.getElementById('show-btn');
        console.log(minimizeBtn,'minimizeBtn')
		// 点击“-”按钮，浮窗逐渐变小，直到按钮大小并消失
		minimizeBtn.addEventListener('click', () => {
			// 设置缩小效果
			floatingWindow.style.width = '50px';
			floatingWindow.style.height = '50px';
			floatingWindow.style.opacity = '0';
			floatingWindow.style.right = '0'; // 确保它停在按钮的位置

			// 隐藏浮窗并显示按钮
			setTimeout(() => {
				floatingWindow.style.display = 'none';
				showBtn.style.display = 'block';
			}, 500); // 延迟，以便看到缩小的过程
		});

		// 点击右侧按钮，浮窗恢复原始状态并逐渐变大
		showBtn.addEventListener('click', () => {
			// 先设置为小尺寸和透明，确保没有显示
			floatingWindow.style.display = 'block';
			floatingWindow.style.width = '50px';
			floatingWindow.style.height = '50px';
			floatingWindow.style.opacity = '0';
			floatingWindow.style.right = '0';

			// 显示按钮隐藏
			showBtn.style.display = 'none';

			// 使用 setTimeout 延迟启动动画
			setTimeout(() => {
				// 恢复浮窗尺寸和透明度
				floatingWindow.style.transition = 'all 0.5s ease-out'; // 应用过渡效果
				floatingWindow.style.width = '220px';
                   floatingWindow.style.height = '190px';
				floatingWindow.style.opacity = '1'; // 恢复可见
				floatingWindow.style.right = '0'; // 确保浮窗停在右侧
			}, 10); // 延迟0.01s启动动画
		});




        if (!logoutBtn) return;
        logoutBtn.addEventListener('click', async function (e) {
            let proInerNet;
            // 读取本地存储的用户信息
            const token = GM_getValue('token');
            const userid = GM_getValue('userid');
            const proIP = GM_getValue('proIP');
            proInerNet = GM_getValue('proInerNet');
            try {
                const response = await fetch(`${proOutNet}/logout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // 添加 Authorization 头
                    },
                });
                // 处理响应
                const data = await response.json();
                if (data.code == 200) {
                    let dta = {};
                    dta.act_type = "logout";
                    dta.act_id = userid;
                    dta.act_tool = "chrome";
                    dta.act_time = formatTime(new Date(), 'yyyy-MM-dd HH:mm:ss.S');
                    sendData(dta,'logout')
                    GM_deleteValue('username');
                    GM_deleteValue('token');
                    GM_deleteValue('usernum');
                    GM_setValue('isLoggedIn', false);
                // 跳转回登录页面
                 checkLoginStatus();
                } else {
                    throw new Error(data.msg || '退出登录失败');
                }
            } catch (error) {
                console.error(error, 'error');
                GM_setValue('proIP', proInerNet); // 恢复 proIP 值
                alert(error || '退出登录过程中发生错误');
            } finally {
                // 重置按钮状态
            }
        });
    }


 GM_addStyle(`
             #loginForm{
                 padding:15px 10px 0;
             }

            .layui-form-item {
                margin-bottom: 20px;
                display:flex;
                align-items:center
            }
            .layui-form-label{
               margin-right:10px;
               font-size:14px;
               width:43px;

            }

            .layui-input {
                border-radius: 5px;
                border: 1px solid #ddd;
                height: 25px;
                font-size: 14px;
                width:120px;
            }

            .layui-btn {
                width: 100%;
                height: 30px;
                background-color: #007bff;
                border-radius: 5px;
                color: white;
                font-size: 14px;
                border:none;
            }


            .layui-btn:hover {
                background-color: #409eff;
               cursor: pointer;
            }
            .form-btn{
            display:flex;
            justify-content:center;
                margin-bottom:10px;

            }
            ` )
// 动画效果：使用CSS过渡来平滑显示或隐藏浮窗
const style = document.createElement('style');
style.textContent = `
	   .floating-window {
            z-index:2000;
			position: fixed;
			right: 0;
			top: 148px;
			transform: translateY(-50%);
			width: 220px;
            height:190px;
			background-color: #fff;
			box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
			display: block;
			transition: all 0.5s ease-out; /* 应用过渡 */
			opacity: 1;
		}
        .floating-window h3 {
           margint-top:10px;
           text-align:center;
        }
        #logout-btn{
           color:#007bff;
           border:none;
           background:none;
           margin-right:10px;
        }
         #logout-btn:hover {
              color: #409eff;
              cursor: pointer;
         }
		.floating-window-content {
			padding: 10px;
		}
		#minimize-btn {
			font-size: 20px;
			border: none;
			color: #888;
			cursor: pointer;
			transition: transform 0.3s ease-in-out;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            display:flex;
            justify-content:center;
            line-height: 13px;
            position: absolute;
            right: 15px;
            top: 15px;
		}
		#minimize-btn:hover {
			transform: scale(1.2); /* 按钮悬停时放大 */
		}
		.show-btn {
			position: fixed;
			right: 0;
			top: 200px;
			width: 50px;
			height: 50px;
			background-color: #007bff;
			color: white;
			font-size: 14px;
			border: none;
			border-radius: 50%;
			display: none;
			cursor: pointer;
            font-weight:600;
		}
`;

    // 显示登录表单
    function displayLoginForm() {
        const loginForm = `
        	<div id="floating-window" class="floating-window boss-script-login">
		<div class="floating-window-content">
			<button id="minimize-btn">-</button>
                <h3 style="margin: 0; font-size: 16px;">八维教育 ${BISVERSION}</h3>
                  <form id="loginForm">
                    <div class="layui-form-item">
                        <label class="layui-form-label">用户名</label>
                        <div class="layui-input-block">
                            <input type="text" autocomplete="username" id="loginName" name="username" required lay-verify="required" placeholder="请输入用户名" class="layui-input" />
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">密码</label>
                        <div class="layui-input-block">
                            <input type="password" autocomplete="current-password" name="password" id="loginPassword" required lay-verify="required" placeholder="请输入密码" class="layui-input" />
                        </div>
                    </div>
                    <div class="layui-form-item form-btn">
                          <button type="button" id="layui-btn" class="layui-btn">登录</button>
                    </div>
                </form>
		</div>
	</div>
	<button id="show-btn" class="show-btn">BOSS</button> `;
          document.body.insertAdjacentHTML('beforeend', loginForm);
        const floatingWindow = document.getElementById('floating-window');
		const minimizeBtn = document.getElementById('minimize-btn');
		const showBtn = document.getElementById('show-btn');
		// 点击“-”按钮，浮窗逐渐变小，直到按钮大小并消失
		minimizeBtn?.addEventListener('click', () => {
			// 设置缩小效果
			floatingWindow.style.width = '50px';
			floatingWindow.style.height = '50px';
			floatingWindow.style.opacity = '0';
			floatingWindow.style.right = '0'; // 确保它停在按钮的位置

			// 隐藏浮窗并显示按钮
			setTimeout(() => {
				floatingWindow.style.display = 'none';
				showBtn.style.display = 'block';
			}, 500); // 延迟，以便看到缩小的过程
		});

		// 点击右侧按钮，浮窗恢复原始状态并逐渐变大
		showBtn?.addEventListener('click', () => {
			// 先设置为小尺寸和透明，确保没有显示
			floatingWindow.style.display = 'block';
			floatingWindow.style.width = '50px';
			floatingWindow.style.height = '50px';
			floatingWindow.style.opacity = '0';
			floatingWindow.style.right = '0';
			// 显示按钮隐藏
			showBtn.style.display = 'none';
			// 使用 setTimeout 延迟启动动画
			setTimeout(() => {
				// 恢复浮窗尺寸和透明度
				floatingWindow.style.transition = 'all 0.5s ease-out'; // 应用过渡效果
				floatingWindow.style.width = '220px';
                floatingWindow.style.height = '190px';
				floatingWindow.style.opacity = '1'; // 恢复可见
				floatingWindow.style.right = '0'; // 确保浮窗停在右侧
			}, 10); // 延迟0.01s启动动画
		});

      document.getElementById('layui-btn').addEventListener('click', async (e)=> {
         e.preventDefault();
        // 获取表单数据
        const username = document.getElementById('loginName').value;
        const password = document.getElementById('loginPassword').value;
        // 简单的客户端验证
        if (!username || !password) {
            alert('请输入用户名和密码');
            return;
        }

        const loginBtn = document.querySelector('.login-btn button');
        let proInerNet;
        proInerNet = GM_getValue('proInerNet');
        const proIP = GM_getValue('proIP');

        try {
            // 发送登录请求
            const response = await fetch(`${proIP}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password
                }),
            });
            if (!response) {
                // 登录失败
                alert('登录过程中发生错误');
                return;
            }
            const data = await response.json();
            if (data.code == 200) {
                let dta = {};
                dta.act_type = "login";
                dta.act_time = formatTime(new Date(), 'yyyy-MM-dd HH:mm:ss.S');
                dta.act_id = data.userid;
                dta.act_tool = "tampermonkey";

                // 存储登录数据
                GM_setValue('token', data.token);
                GM_setValue('usernum', data.usernum);
                GM_setValue('userid', data.userid);
                GM_setValue('username', data.username);
                GM_setValue('isLoggedIn', true);
                checkLoginStatus();
                // 登录成功
                  sendData(dta,'login')
            } else {
                // 登录失败
                alert(data.msg || '登录过程中发生错误');
            }
        } catch (error) {
            GM_setValue('proIP', proInerNet);
            alert(error || '登录过程中发生错误');
        } finally {
            // 重置按钮状态

        }
    });
   }



document.head.append(style);

    // 检查登录状态
    checkLoginStatus();

// 获取当前页面的完整 URL
const currentUrl = window.location.href;
// 判断当前页面的域名和路径
if (currentUrl.includes('https://www.zhipin.com/web/geek/recommend')) {
	isTargetPage = true;
	// 在这里执行你希望的操作
} else {
	isTargetPage = false;
}

window.addEventListener('beforeunload', function (event) {
	if (isTargetPage) updateData();
});
// 获取数据并更新存储
function updateData() {
	// 提取各项数据
	const communicationCount = document.querySelector('[ka="personal_top_added"] .count');
	const applyCount = document.querySelector('[ka="personal_top_submitted"] .count');
	const interviewCountDom = document.querySelector('[ka="personal_top_interview"] .count');
	// 获取 .resume-refresh-hwslider 下的 <svg> 元素
	const svg = document.querySelector('.resume-refresh-hwslider svg');
	// 获取最后一个 <g> 标签
	const lastGElement = svg && svg.querySelector('g:last-child');
	// 获取 .my-series 元素
	const exposureCountDom = lastGElement && lastGElement.querySelector('.my-series');
	let exposureCount;
	let interviewCount;
	let data = {};
	if (isTargetPage) {
		if (interviewCountDom) {
			interviewCount = parseInt(interviewCountDom.textContent);
		}
		if (exposureCountDom) {
			exposureCount = parseInt(exposureCountDom.textContent);
		}
        let userid = GM_getValue('userid') || '';
		data = [{ act_id: userid, act_tool: "chrome", act_type: 'active', act_time: formatTime(new Date(), 'yyyy-MM-dd HH:mm:ss.S'), act_value: exposureCount }, { act_id: userid, act_tool: "chrome", act_type: 'interview', act_time: formatTime(new Date(), 'yyyy-MM-dd HH:mm:ss.S'), act_value: interviewCount }]
        sendData(data,'active')
	}
}

// 监听“投递”按钮点击事件
function setupApplyButtonListener() {
	const applyButton = document.querySelector('.choose-resume-dialog .btn-confirm') || document.querySelector('.toolbar-btn-content .btn-v2.btn-sure-v2');
	if (applyButton) {
		applyButton.addEventListener('click', () => {
			// 检查按钮是否被禁用
			if (applyButton.disabled) {
                // 如果按钮被禁用，直接返回
				return;
			}
			let data = {};
            let userid = GM_getValue('userid') || '';
			const bossName = document.querySelectorAll('.base-info > *')[1]?.textContent;
			const jobName = document.querySelector('.position-name')?.textContent;
			data.act_type = "deliver";
			data.act_time = formatTime(new Date(), 'yyyy-MM-dd HH:mm:ss.S');
			data.act_value = "1";
			data.act_company_name = bossName;
			data.act_station_name = jobName;
			data.act_id = userid;
			data.act_tool = "chrome";
            sendData(data,'deliver')
		});
	}
}


// 监听“沟通”按钮点击事件
function setupButtonClickListener() {
	let dom = document.querySelector('.job-detail-header .op-btn.op-btn-chat') || document.querySelector('.btn-container .btn.btn-startchat') || document.querySelectorAll('button.btn.btn-startchat') ||document.querySelectorAll('a.btn.btn-startchat');
	// 移除已有的事件监听器，防止重复绑定
    if (dom instanceof NodeList) {
		isNodeList = true;
		dom.forEach(button => {
			button.addEventListener('click', handleButtonClick);
		});
	} else {
		isNodeList = false;
		jobName = document.querySelector('.job-detail-box .job-name')?.textContent || document.querySelector('.job-primary .info-primary .name h1')?.textContent;
		dom?.removeEventListener('click', handleButtonClick);
		// 绑定新的事件监听器
		dom?.addEventListener('click', handleButtonClick);
	}

}

// 在页面跳转前发送数据
function handleButtonClick(event) {
	if (isNodeList){
		jobName = event.target.closest('li').querySelector('.info-primary .name b').textContent || event.target.closest('li').querySelector('.info-primary .name .job-title').textContent;
	}
	bossName = document.querySelector('.job-card-wrap.active .boss-name')?.textContent || document.querySelector('.info-primary .info h1')?.childNodes[0].textContent.trim() || document.querySelector('.sider-company .company-info a')?.title;;
	let data = {};
      let userid = GM_getValue('userid') || '';
	data.act_type = "communication";
	data.act_time = formatTime(new Date(), 'yyyy-MM-dd HH:mm:ss.S');
	data.act_value = "1";
	data.act_company_name = bossName;
	data.act_station_name = jobName;
	data.act_id = userid;
	data.act_tool = "chrome";
    sendData(data,'communication')
}

    // 初始化
    function init() {
         startTimer();
    }
    // 等待页面加载完毕后初始化
    window.addEventListener('load', init);

// 设置 MutationObserver 来确保页面加载后添加监听器
let tempTimer = null;
function setupObserver() {
	const observer = new MutationObserver(() => {
		// 检查监听器是否已经设置，如果没有设置，就设置它们
		// 每次 MutationObserver 回调触发时，清除之前的定时器
		clearTimeout(tempTimer);
		// 设置新的定时器，延迟 200 毫秒后执行某些逻辑
		tempTimer = setTimeout(() => {
			// 如果有多个变动，只有最后一次触发时才执行这里的逻辑
			setupApplyButtonListener();
			setupButtonClickListener();
		}, 0); // 延迟时间可以根据实际需要调整
	});
	const targetNode = document.body; // 观察整个页面
	if (targetNode) {
		observer.observe(targetNode, {
			childList: true,
			subtree: true
		});
	}
}
// 启动 MutationObserver 以确保动态加载的按钮也能正确绑定事件
setupObserver();
    // 发送数据
    async function request(info, isReconnect, type,isold) {
        try {
            const token = GM_getValue('token');
            const userid = GM_getValue('userid');
            const proIP = GM_getValue('proIP');
            let data = {};
            if (userid) {
                data.stuId = userid;
                data.isDisconnectReconnect = isReconnect;
                if (info instanceof Array) {
                    info.forEach(item => {
                        item.act_id = userid;
                    });
                    data.pluginsContentList = info;
                } else {
                    data.pluginsContentList = [{ ...info }];
                }
                // 发送请求
                const response = await fetch(`${proIP}/boos/plugins/saveJsonContent`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // 添加 Authorization 头
                    },
                    body: JSON.stringify(data),
                });

                const res = await response.json();
                if (res.code === 200) {
                    GM_setValue('operateStatus', true);
                    if (type === 'login') {
                        startTimer();
                    }
                    if (type === 'logout') {
                        GM_setValue('token', null);
                        GM_setValue('usernum', '');
                        GM_setValue('userid', null);
                        GM_setValue('username', null);
                        GM_setValue('isLoggedIn', false);
                    }
                    if(isold){
                        // 打开数据库
                    const dbRequest = indexedDB.open('bossDatabase', 1);
                    dbRequest.onsuccess = (event) => {
                        const db = event.target.result;
                        const transaction = db.transaction('action', 'readwrite');
                        const store = transaction.objectStore('action');
                        const clearRequest = store.clear();
                        clearRequest.onsuccess = () => {
                        };
                        clearRequest.onerror = (event) => {
                        };
                      };
                    }

                }
            } else {
            }
        } catch (error) {
             GM_setValue('proIP', proInerNet);
        }
    }

     // 发送数据前处理
    async function sendData(data,type) {
        // 获取存储的 token 和 userid
        const token = GM_getValue('token');
        const userid = GM_getValue('userid');
        if (userid) {
            // 使用 request 替换为你自己的请求函数
            await request(data, 'N', type);
            if (type === 'login') {
                data.isDisconnectReconnect = 'Y';
                const dbRequest = indexedDB.open('bossDatabase', 1);
                dbRequest.onsuccess = async (event) => {
                    const db = event.target.result;
                    await getAllUsers(db);
                };
            }
        } else {
            const dbRequest = indexedDB.open('bossDatabase', 1);
            dbRequest.onsuccess = (event) => {
                const db = event.target.result;
                addAction(db, data);
            };
        }
        return true;
    }


    // 添加数据到 IndexedDB
    function addAction(db, data) {
        const transaction = db.transaction('action', 'readwrite');
        const store = transaction.objectStore('action');
        const countRequest = store.count();
        countRequest.onsuccess = () => {
            const currentCount = countRequest.result;
            if (currentCount >= MAX_RECORDS) {
                deleteOldRecords(store, DELETE_COUNT, () => {
                    insertData(store, data);
                });
            } else {
                insertData(store, data);
            }
        };
        countRequest.onerror = (event) => {
            console.error('获取记录数失败:', event.target.error);
        };
    }

    // 删除旧记录
    function deleteOldRecords(store, deleteCount) {
        const cursorRequest = store.openCursor();
        let deletedCount = 0;
        cursorRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor && deletedCount < deleteCount) {
                cursor.delete();
                deletedCount++;
                cursor.continue();
            }
        };
        cursorRequest.onerror = (event) => {
            console.error('删除记录失败:', event.target.error);
        };
    }

    // 插入新数据
    function insertData(store, data) {
        if (Array.isArray(data)) {
            data.forEach(item => store.add(item));
        } else {
            const addRequest = store.add(data);
            addRequest.onsuccess = () => {
                  const getAllRequest = store.getAll();
            getAllRequest.onsuccess = () => {
            };
            getAllRequest.onerror = (event) => {
                console.error('获取数据失败:', event.target.error);
            };
           };
            addRequest.onerror = (event) => {
                console.error('插入数据失败:', event.target.error);
            };
        }
    }
    // 获取所有离线数据
    async function getAllUsers(db) {
       const transaction = db.transaction('action', 'readonly');
	   const store = transaction.objectStore('action');
	   const arr = store.getAll();
	   arr.onsuccess = async (event) => {
		  const cursor = event.target.result;
		if (cursor.length) {
			await request(cursor, 'Y', 'login','old')
		 }
	  };
	  arr.onerror = function (event) {
	  	console.error('获取数据失败:', event.target.error);
	  };
    }
     //心跳
     function startTimer() {
        if (!timer) {
           timer = setInterval(async () => {
                 // 获取存储的值
                 const active = GM_getValue('active');
                 const token = GM_getValue('token');
                 const userid = GM_getValue('userid');
                 const proIP = GM_getValue('proIP');
                 const operateStatus = GM_getValue('operateStatus');

                 if (userid) {
                     try {
                         if (token) {
                             // 使用 fetch 发送心跳请求
                             const response = await fetch(`${proIP}/boos/plugins/heartbeat`, {
                                 method: 'POST',
                                 headers: {
                                     'Content-Type': 'application/json',
                                     'Authorization': `Bearer ${token}` // 添加 Authorization 头
                                 },
                                 body: JSON.stringify({
                                     stuId: userid,
                                     operateStatus
                                 })
                             });
                             if (response.code==200) {
                                 // 请求成功后的处理
                                 GM_setValue('operateStatus', false); // 将 operateStatus 设置为 false
                             }
                         }
                     } catch (error) {
                          GM_setValue('proIP', proInerNet);
                   }
               }

           }, BEATNUM);

        }
    }


})();
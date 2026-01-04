// ==UserScript==
// @name         破易云同步脚本(DTLU团队专用)
// @namespace    https://zhiexa.com/
// @version      1.5
// @description  协助用户将破易云信息同步到智能债权审查平台
// @author       Garry, John
// @match        https://work.poyiyun.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=poyiyun.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518441/%E7%A0%B4%E6%98%93%E4%BA%91%E5%90%8C%E6%AD%A5%E8%84%9A%E6%9C%AC%28DTLU%E5%9B%A2%E9%98%9F%E4%B8%93%E7%94%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/518441/%E7%A0%B4%E6%98%93%E4%BA%91%E5%90%8C%E6%AD%A5%E8%84%9A%E6%9C%AC%28DTLU%E5%9B%A2%E9%98%9F%E4%B8%93%E7%94%A8%29.meta.js
// ==/UserScript==

(function () {
	"use strict";
    const domain = "https://dentonslu.odoo.zhiexa.com";
    const dbname = "dentonslu"
	GM_addStyle(`
    /*模态框主体样式*/
      .modal {
        display: none;
        position: fixed;
        z-index: 999;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0, 0, 0, 0.5);
      }

      /*模态框公共样式*/
      .modal-content {
        background-color: #ffffff;
        animation: modal-show 0.2s;
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 424px;
        height: 522px;
        border-radius: 8px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        box-sizing: border-box;
      }

      .top-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 424px;
        height: 166px;
        background: linear-gradient(180deg, rgba(22, 93, 255, 0.4) 0%, rgba(22, 93, 255, 0.1) 100%);
        filter: blur(100px);
      }

      /* 正常大小 */
      .modal-normal {
        width: 424px;
      }

      /* 中等大小 */
      .modal-medium {
        width: 400px;
      }

      /* 迷你大小 */
      .modal-mini {
        width: 250px;
      }

      /* 隐藏 */
      .modal-hide {
        animation: modal-hide 0.2s;
      }

      /* 展示动画 */
      @keyframes modal-show {
        from {
          opacity: 0;
        }

        to {
          opacity: 1;
        }
      }

      /* 隐藏动画 */
      @keyframes modal-hide {
        from {
          opacity: 1;
        }

        to {
          opacity: 0;
        }
      }

      /*关闭按钮*/
      .close {
        color: #aaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
        -webkit-tap-highlight-color: rgba(255, 0, 0, 0);
      }

      /*关闭按钮的鼠标点击和经过样式*/
      .close:hover,
      .close:focus {
        color: black;
        text-decoration: none;
        cursor: pointer;
        -webkit-tap-highlight-color: rgba(255, 0, 0, 0);
      }

      .welcome-text {
        font-weight: 500;
        font-size: 24px;
        color: #1D2129;
        margin-top: 60px;
      }

      .input-tip {
        font-weight: 400;
        font-size: 16px;
        color: #86909C;
        margin-top: 20px;
      }

      .modal-content input {
        width: 360px;
        height: 44px;
        border-radius: 8px 8px 8px 8px;
        border: 1px solid #C9CDD4;
        padding: 11px 12px;
        box-sizing: border-box;
        outline: none;
      }

      .modal-content input::placeholder {
        color: #86909C;
      }

      .login-btn {
        cursor: pointer;
        width: 360px;
        height: 44px;
        background: #227CFE;
        border-radius: 8px;
        font-weight: 500;
        font-size: 14px;
        color: #FFFFFF;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 36px;
      }

      .forget-btn {
        font-size: 14px;
        color: #86909C;
        margin-top: 20px;
        cursor: pointer;
      }

      .pwd-input {
        position: relative;
      }

      .eyeIcon {
        position: absolute;
        right: 20px;
        bottom: 16px;
        cursor: pointer;
      }

    #toastContainer {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1000; /* 保证 Toast 显示在其他元素之上 */
    }

    .toast {
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      padding: 8px 20px;
      margin-bottom: 10px;
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
    }

    .toast.show {
      opacity: 1;
      transform: translateY(0);
    }

    .toast.success {
      background-color: #d4edda;
      border-color: #c3e6cb;
      color: #155724;
    }

    .toast.error {
      background-color: #f8d7da;
      border-color: #f5c6cb;
      color: #721c24;
    }

    .toast .close {
      float: right;
      cursor: pointer;
      font-size: 18px;
    }
        .confirmModal {
      padding: 32px 60px;
      background: #ffffff;
      width: fit-content;
      height: fit-content;
    }

    .confirmModal-content {
      font-size: 18px;
    }

    .modal-footer {
      display: flex;
      align-items: center;
      margin-top: 32px;
    }

    .modal-footer div {
      width: 60px;
      height: 30px;
      border-radius: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .modal-footer div:first-child {
      background-color: rgb(242, 243, 245);
      color: rgb(78, 89, 105);
      font-size: 14px;
      margin-right: 16px;
    }

    .modal-footer div:last-child {
      background-color: rgb(245, 63, 63);
      color: #ffffff;
      font-size: 14px;
    }
		@keyframes spin {
			0% { transform: rotate(0deg); }
			100% { transform: rotate(360deg); }
		}
		.spinner {
			animation: spin 2s linear infinite;
		}
  `);

	// 创建模态框
	function initModal() {
		const div = document.createElement("div");
		div.setAttribute("id", "myModal");
		div.setAttribute("class", "modal login-modal");
		div.innerHTML = `    <div class="modal-content modal-normal">
      <div class="top-bg"></div>
			<img style="margin-top:50px" src="https://static.zhiexa.com/customized-mini/data/dwc-logo.svg" alt="" />
      <div class="welcome-text">欢迎使用DWC-破产管理</div>
      <div class="input-tip">请输入您的账户和密码登录</div>
      <input type="text" id="name" placeholder="请输入账户名称（邮箱）" style="margin-top: 40px" />
      <div class="pwd-input">
        <input type="password" id="pwd" placeholder="请输入密码）" style="margin-top: 28px" />
        <img class="eyeIcon" data-show="false" src="https://static.zhiexa.com/customized-mini/data/eye.svg" alt="">
      </div>
      <div class="login-btn">登录</div>
      <div class="forget-btn">忘记密码</div>
    </div>`;

		document.body.append(div);

		const btn = document.querySelector(".login-btn");
		btn.addEventListener("click", async () => {
			const name = document.querySelector("#name").value;
			const pwd = document.querySelector("#pwd").value;
			try {
				const res = await login(name, pwd);
				const userinfo = JSON.parse(res);
				if (typeof userinfo.result === "number") {
					localStorage.setItem("tampermonket_userid", `${name}_${pwd}`);
					toast.showToast("success", "登录成功");
					closeModal();
					syncData(window.tempCaseDetailData, false);
				} else {
					toast.showToast("error", "登录失败");
				}
			} catch (e) {
				toast.showToast("error", "登录失败");
			}
		});

		const pwdIcon = document.querySelector(".eyeIcon");
		pwdIcon.addEventListener("click", () => {
			const pwdInput = document.querySelector(".pwd-input input");
			if (pwdIcon.dataset.show === "false") {
				pwdIcon.dataset.show = "true";
				pwdInput.type = "text";
				pwdIcon.src = "https://static.zhiexa.com/customized-mini/data/eye-i.svg";
			} else {
				pwdIcon.dataset.show = "false";
				pwdInput.type = "password";
				pwdIcon.src = "https://static.zhiexa.com/customized-mini/data/eye.svg";
			}
		});
	}

	function initConfirmModal() {
		const div = document.createElement("div");
		div.setAttribute("id", "myModal");
		div.setAttribute("class", "modal confirm-modal");
		div.innerHTML = `    <div class="confirmModal modal-content">
          <div class="confirmModal-content">是否覆盖已有数据？</div>
          <div class="modal-footer">
            <div class="modal-cancel-btn">取消</div>
            <div class="modal-confirm-btn">确认</div>
          </div>
        </div>`;
		document.body.append(div);

		const cancelBtn = document.querySelector(".modal-cancel-btn");
		cancelBtn.addEventListener("click", () => {
			closeConfirmModal();
		});

		const confirmBtn = document.querySelector(".modal-confirm-btn");
		confirmBtn.addEventListener("click", () => {
			syncData(window.tempCaseDetailData, true);
			closeConfirmModal();
		});
	}

	function openConfirmModal() {
		var modal = document.querySelector(".confirm-modal");
		modal.style.display = "block";
		modal.querySelector(".modal-content").classList.remove("modal-hide");
	}

	function closeConfirmModal() {
		var modal = document.querySelector(".confirm-modal");
		modal.querySelector(".modal-content").classList.add("modal-hide");
		modal.querySelector(".modal-content").addEventListener(
			"animationend",
			function () {
				modal.style.display = "none";
			},
			{ once: true }
		);
	}

	// 拦截请求获取列表数据
	window.cacheList = [];
	window.caseDetail = {};
	// 临时存放债权人信息
	window.tempCaseDetailData = null;
	const originalOpen = XMLHttpRequest.prototype.open;
	XMLHttpRequest.prototype.open = function (...args) {
		this.addEventListener("readystatechange", function () {
			if (this.readyState === 4) {
				// 请求完成
				const url = this.responseURL;
				const method = this.method;
				const status = this.status;
				const responseText = this.responseText;
				if (url.includes("getClaimsPage")) {
					// 替换为你的目标 URL
					try {
						const jsonData = JSON.parse(responseText);
						cacheList.push(...jsonData.data.records);
					} catch (error) {
						console.error("解析 JSON 数据失败:", error);
					}
				}
				if (url.includes("case/v1/get/detail")) {
					try {
						const jsonData = JSON.parse(responseText);
						caseDetail = jsonData.data;
						const list = JSON.parse(localStorage.getItem("case-list"));
						if (list) {
							const listData = list.find(item => item.caseId === caseDetail.caseId);
							caseDetail = { ...caseDetail, ...listData };
						}
						console.log("解析后的 caseDetail 数据:", caseDetail);
					} catch (error) {
						console.error("解析 JSON 数据失败:", error);
					}
				}

				if (url.includes("v1/case/list")) {
					try {
						const jsonData = JSON.parse(responseText);
						const localData = localStorage.getItem("case-list");
						localStorage.setItem("case-list", JSON.stringify([...jsonData.data, ...(localData ? JSON.parse(localData) : [])]));
						console.log("解析后的 list 数据:", jsonData);
					} catch (error) {
						console.error("解析 JSON 数据失败:", error);
					}
				}
			}
		});
		originalOpen.apply(this, args);
	};

	let toast = {
		hideTimeout: null,
		init: function () {
			var toastNode = document.createElement("div");
			toastNode.id = "toast"; //设置id，一个页面有且仅有一个toast
			toastNode.setAttribute("id", "toastContainer"); // 设置类名，如果有必要的话
			document.body.appendChild(toastNode); //添加到body下面
			// kuang.appendChild(toastNode);//添加到需要的盒子下面
		},
		showToast: function (type, message) {
			const toastContainer = document.getElementById("toastContainer");
			const toast = document.createElement("div");
			toast.classList.add("toast");
			toast.classList.add(type);
			toast.innerHTML = `<span>${message}</span>`;

			toastContainer.appendChild(toast);

			toast.classList.add("show");

			setTimeout(() => {
				toast.classList.remove("show");
				setTimeout(() => {
					toastContainer.removeChild(toast);
				}, 300); // 等待动画完成再移除
			}, 3000); // 显示 3 秒
		}
	};

	function makePostRequest(url, data, callback, headers = {}) {
		GM_xmlhttpRequest({
			method: "POST",
			url: url,
			headers: {
				"Content-Type": "application/json",
				...headers
			},
			data: JSON.stringify(data),
			onload: function (response) {
				if (response.status >= 200 && response.status < 300) {
					callback(null, response.responseText);
				} else {
					callback(new Error(`请求失败，状态码：${response.status}`), null);
				}
			},
			onerror: function () {
				callback(new Error("网络错误"), null);
			}
		});
	}

	function login(account, pwd) {
		return new Promise((resolve, reject) => {
			makePostRequest(
				`${domain}/jsonrpc`,
				{
					jsonrpc: "2.0",
					method: "call",
					params: {
						service: "common",
						method: "login",
						args: [dbname, account, pwd],
						kwargs: {}
					},
					id: 1
				},
				(err, response) => {
					if (err) {
						reject(err);
						console.error(err);
					} else {
						resolve(response);
						console.log("Response1:", response);
					}
				}
			);
		});
	}

	async function getFile(fileId) {
		return new Promise((resolve, reject) => {
			const loginToken = localStorage.getItem("m-t");
			const accessToken = JSON.parse(localStorage.getItem("c-t")).dashboard;
			makePostRequest(
				"https://work.poyiyun.com/api/tool/file/v1/preview",
				{ fileId },
				(error, data) => {
					if (error) {
						reject(error);
					} else {
                        console.log('!!!', JSON.parse(data), accessToken)
						resolve(JSON.parse(data).data.url);
					}
				},
				{
					appid: "web_jcyx_glr_1.0.0",
					"Content-Type": "application/json;charset=UTF-8",
					token: accessToken,
					cookie: document.cookie
				}
			);
		});
	}

	// 同步数据到odoo
	async function syncData(data, force = false) {
		const userInfo = localStorage.getItem("tampermonket_userid");
		const [name, pwd] = userInfo.split("_");
		console.log("开始同步。。。。", data);
		openLoadingModal();
		if (!data.hasUrl) {
			if (data.evidenceFiles && data.evidenceFiles.length) {
				await Promise.all(
					(function () {
						const promises = [];
						for (let i = 0; i < data.evidenceFiles.length; i++) {
							const fileid = data.evidenceFiles[i].fileId;
							promises.push(getFile(fileid).then(url => (data.evidenceFiles[i].url = url)));
						}
						return promises;
					})()
				);
			}
			if (data.identityFiles && data.identityFiles.length) {
				await Promise.all(
					(function () {
						const promises = [];
						for (let i = 0; i < data.identityFiles.length; i++) {
							const fileid = data.identityFiles[i].fileId;
							promises.push(getFile(fileid).then(url => (data.identityFiles[i].url = url)));
						}
						return promises;
					})()
				);
			}
		}

		const params = {
			username: name,
			password: pwd,
			project_data: caseDetail,
			info_data: data,
			db_name: dbname,
			force_update: force
		};
		console.log("同步参数1", params);
		return new Promise((resolve, reject) => {
			makePostRequest(
				`${domain}/create_debt_records`,
				params,
				(err, response) => {
					if (err) {
						closeLoadingModal();
						toast.showToast("error", "同步失败");
						console.error(err);
					} else {
						// resolve(response);
						console.log("Response111:", JSON.parse(response));
						console.log("同步结束。。。。");
						const res = JSON.parse(response);
						console.log(666, res);
						closeLoadingModal();
						if (res.result?.error === "duplicated") {
							tempCaseDetailData = data;
							tempCaseDetailData.hasUrl = true;
							openConfirmModal();
						} else if (res.result?.error || res.error) {
							toast.showToast("error", "同步失败！");
						} else {
							tempCaseDetailData = null;
							toast.showToast("success", "同步成功");
						}
					}
				},
				{}
			);
			// fetch("https://dentonslu.odoo.zhiexa.com/create_debt_records", {
			// 	method: "POST",
			// 	headers: {
			// 		"Content-Type": "application/json"
			// 	},
			// 	body: JSON.stringify(params)
			// })
			// 	.then(async response => {
			// 		const result = await response.json();
			// 		console.log("同步结束。。。。");
			// 		console.log(6666, result);
			// 		closeLoadingModal();
			// 		if (result.result.error === "duplicated") {
			// 			tempCaseDetailData = data;
			// 			tempCaseDetailData.hasUrl = true;
			// 			openConfirmModal();
			// 		} else if (result.result.error) {
			// 			toast.showToast("error", "同步失败！");
			// 		} else {
			// 			tempCaseDetailData = null;
			// 			toast.showToast("success", "同步成功");
			// 		}
			// 		// resolve(response.json());
			// 	})
			// 	.catch(reply => {
			// 		closeLoadingModal();
			// 		toast.showToast("error", "同步失败");
			// 		// if (reply.error) {
			// 		//	reject(reply.error.message);
			// 		// }
			// 	});
		});
	}

	function addButtonToElement(element, index) {
		if (element.querySelector("div.sync-button-container")) return; // Avoid adding duplicate buttons

		const buttonContainer = document.createElement("div");
		buttonContainer.className = "sync-button-container";
		buttonContainer.style.display = "inline-block";
		buttonContainer.style.marginRight = "10px";

		const syncButton = document.createElement("button");
		syncButton.textContent = "智能审查";
		syncButton.className = "sync-button";
		if (element.firstChild && element.firstChild.innerText) {
			syncButton.setAttribute("data-id", element.firstChild.innerText);
		}
		syncButton.style.padding = "5px 10px";
		syncButton.style.backgroundColor = "#4CAF50";
		syncButton.style.color = "white";
		syncButton.style.border = "none";
		syncButton.style.borderRadius = "4px";
		syncButton.style.cursor = "pointer";

		syncButton.onmouseover = function () {
			syncButton.style.backgroundColor = "#45a049";
		};
		syncButton.onmouseout = function () {
			syncButton.style.backgroundColor = "#4CAF50";
		};

		syncButton.addEventListener("click", async function (event) {
			event.stopPropagation(); // Prevent the row click event
			// Add your sync functionality here
			const userId = localStorage.getItem("tampermonket_userid");
			const id = event.target.dataset.id;
			const data = cacheList.find(item => item.claimsNum == parseInt(id));
			if (!userId) {
				data.hasUrl = false;
				window.tempCaseDetailData = data;
				openModal();
				return;
			}

			if (userId) {
				try {
					await syncData(data);
					// toast.showToast("success", "提交成功");
				} catch (e) {
					// toast.showToast("error", "提交失败");
				}
			}
		});

		buttonContainer.appendChild(syncButton);
		element.insertBefore(buttonContainer, element.firstChild);
	}

	// 创建加载动画
	function createLoadingAnimation() {
		const div = document.createElement("div");
		div.setAttribute("id", "myModal");
		div.setAttribute("class", "modal loading-modal");
		div.innerHTML = `<div style="color:#fff;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);">
			<img class="spinner" src="https://static.zhiexa.com/customized-mini/data/loading.png" style="height:40px;width: 40px" / >
			<div style="margin-top: 10px">同步中</div>
		</div>`;
		document.body.append(div);
	}

	function openLoadingModal() {
		const modal = document.querySelector(".loading-modal");
		modal.style.display = "block";
	}

	function closeLoadingModal() {
		const modal = document.querySelector(".loading-modal");
		modal.style.display = "none";
	}

	// 打开登录模态框
	function openModal() {
		var modal = document.querySelector(".login-modal");
		modal.style.display = "block";
		modal.querySelector(".modal-content").classList.remove("modal-hide");
	}

	function closeModal() {
		var modal = document.querySelector(".login-modal");
		modal.querySelector(".modal-content").classList.add("modal-hide");
		modal.querySelector(".modal-content").addEventListener(
			"animationend",
			function () {
				modal.style.display = "none";
			},
			{ once: true }
		);
	}

	function observeAndAddButtons(xpath) {
		const observer = new MutationObserver(mutations => {
			mutations.forEach(() => {
				const elements = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
				for (let i = 1; i < elements.snapshotLength; i++) {
					const element = elements.snapshotItem(i);
					addButtonToElement(element, i + 1);
				}
			});
		});

		observer.observe(document.body, { childList: true, subtree: true });
	}

	window.addEventListener("load", function () {
		const xpath = '//div[@col-id="claimsNum"]';
		observeAndAddButtons(xpath);
		initModal();
		toast.init();
		initConfirmModal();
		createLoadingAnimation();
	});

	window.onclick = function (event) {
		if (event.target.classList.contains("modal")) {
			closeModal();
			closeConfirmModal();
		}
	};
})();

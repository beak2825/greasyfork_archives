// ==UserScript==
// @name         B站关注管理（支持导入导出关注列表）
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  高效管理B站关注列表，支持导入导出关注列表、取关、智能筛选、实时粉丝数获取、批量操作等功能；注意，短时间内大量关注可能被风控（需要在关注列表页面刷新后使用）
// @author       苡淞（Yis_Rime）符若_float（float0108）
// @homepage     https://github.com/YisRime/BilibiliFollowManage
// @match        https://space.bilibili.com/*/relation/follow*
// @match        https://space.bilibili.com/*/fans/follow*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      api.bilibili.com
// @license      AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/537856/B%E7%AB%99%E5%85%B3%E6%B3%A8%E7%AE%A1%E7%90%86%EF%BC%88%E6%94%AF%E6%8C%81%E5%AF%BC%E5%85%A5%E5%AF%BC%E5%87%BA%E5%85%B3%E6%B3%A8%E5%88%97%E8%A1%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/537856/B%E7%AB%99%E5%85%B3%E6%B3%A8%E7%AE%A1%E7%90%86%EF%BC%88%E6%94%AF%E6%8C%81%E5%AF%BC%E5%85%A5%E5%AF%BC%E5%87%BA%E5%85%B3%E6%B3%A8%E5%88%97%E8%A1%A8%EF%BC%89.meta.js
// ==/UserScript==

(function () {
	"use strict";
	// 基础配置
	const CONFIG = {
		API_DELAY: 500,
		PAGE_SIZE: 50,
		BATCH_DELAY: 300,
		FANS_API_DELAY: 500,
		CACHE_DURATION: 30 * 24 * 60 * 60 * 1000,
		IMPORT_BATCH_DELAY: 300, // 导入时的请求间隔
	};
	// 提示消息
	const MESSAGES = {
		LOADING: "正在加载数据...",
		ERROR_NO_DATA: "未能获取关注列表，请检查是否已登录",
		ERROR_NO_UID: "无法获取用户UID，请确保已登录",
		CONFIRM_UNFOLLOW: "确定要取关选中的用户吗？此操作不可撤销！",
		SELECT_USERS: "请选择要取关的用户",
	};
	// 添加样式
	GM_addStyle(`
        .follow-manager-btn {
  position: fixed;
  top: 100px;
  right: 30px;
  z-index: 9999;
  background: #00a1d6;
  color: #fff;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 161, 214, 0.3);
  transition: all 0.3s;
  font-size: 14px;
}
.follow-manager-btn:hover {
  background: #0088cc;
  transform: translateY(-2px);
}
.follow-manager-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(4px);
}
.modal-content {
  background: #fff;
  border-radius: 12px;
  width: 90vw;
  max-width: 1200px;
  height: 80vh;
  max-height: 800px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}
.modal-header {
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
}
.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}
.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #fff;
  margin-left: auto;
}
.close-btn:hover {
  color: #ff4757;
}
.modal-body {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 20px;
}
.modal-filters {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  border: 1px solid #dee2e6;
}
.filter-row {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: nowrap;
}
.filter-row input,
.filter-row select {
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 13px;
  background: #fff;
  transition: all 0.2s;
}
.filter-row input:focus,
.filter-row select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}
.filter-row input[type="text"] {
  flex: 1;
  min-width: 140px;
}
.filter-row input[type="date"] {
  min-width: 80px;
}
.filter-row input[type="number"] {
  min-width: 60px;
  width: 60px;
}
.filter-row select {
  min-width: 80px;
}
.filter-row label {
  font-size: 13px;
  white-space: nowrap;
  color: #495057;
  font-weight: 500;
}
.modal-list {
  flex: 1;
  overflow-y: auto;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  background: #fff;
}
.modal-stats {
  padding: 15px 20px;
  background: #f8f9fa;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.follow-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.follow-table th {
  background: #fff;
  padding: 12px 8px;
  border-bottom: 2px solid #dee2e6;
  text-align: left;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 2;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;
}
.follow-table th:nth-child(4) {
  min-width: 100px;
}
.follow-table th:nth-child(8) {
  min-width: 120px;
}
.follow-table th:hover {
  background: #f8f9fa;
}
.follow-table th.sortable::after {
  content: "↕";
  margin-left: 4px;
  color: #6c757d;
  font-size: 11px;
}
.follow-table th.sort-asc::after {
  content: "↑";
  color: #007bff;
}
.follow-table th.sort-desc::after {
  content: "↓";
  color: #007bff;
}
.follow-table td {
  padding: 10px 8px;
  border-bottom: 1px solid #f1f3f4;
  vertical-align: middle;
}
.follow-table tr:hover {
  background: #f8f9fa;
}
.follow-table tr.selected {
  background: #e3f2fd;
}
.follow-table img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
.batch-actions button {
  padding: 8px 16px;
  border: 1px solid #007bff;
  border-radius: 4px;
  background: #007bff;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
}
.batch-actions button:hover {
  background: #0056b3;
}
.batch-actions button:disabled {
  background: #6c757d;
  border-color: #6c757d;
  cursor: not-allowed;
}
.batch-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

    `);
	// 工具函数
	const getUserId = () => {
		const uidMatch = location.pathname.match(/space\/(\d+)/);
		return (
			uidMatch?.[1] || document.cookie.match(/DedeUserID=(\d+)/)?.[1] || null
		);
	};
	const getCsrfToken = () =>
		document.cookie.match(/bili_jct=([^;]+)/)?.[1] || "";
	// 缓存管理
	const cache = {
		get() {
			const cached = localStorage.getItem("bilibili_follow_cache");
			if (!cached) return null;
			const data = JSON.parse(cached);
			return data.expiry > Date.now() ? data.list : null;
		},
		set(list) {
			localStorage.setItem(
				"bilibili_follow_cache",
				JSON.stringify({
					list,
					expiry: Date.now() + CONFIG.CACHE_DURATION,
				})
			);
		},
		getUserInfo(mid) {
			const cached = localStorage.getItem(`bilibili_user_${mid}`);
			if (!cached) return null;
			const data = JSON.parse(cached);
			return data.timestamp &&
				Date.now() - data.timestamp < CONFIG.CACHE_DURATION
				? data
				: null;
		},
		setUserInfo(mid, info) {
			localStorage.setItem(
				`bilibili_user_${mid}`,
				JSON.stringify({ ...info, timestamp: Date.now() })
			);
		},
		clear() {
			localStorage.removeItem("bilibili_follow_cache");
		},
		clearUserInfo() {
			let count = 0;
			for (let i = localStorage.length - 1; i >= 0; i--) {
				const key = localStorage.key(i);
				if (key && key.startsWith("bilibili_user_")) {
					localStorage.removeItem(key);
					count++;
				}
			}
			return count;
		},
		removeUserInfo(mid) {
			localStorage.removeItem(`bilibili_user_${mid}`);
		},
	};
	// 获取用户粉丝数信息
	const fetchUserInfo = async (mid) => {
		const cached = cache.getUserInfo(mid);
		if (cached) return cached;
		try {
			const res = await fetch(
				`https://api.bilibili.com/x/relation/stat?vmid=${mid}`,
				{
					credentials: "include",
					headers: { Referer: "https://space.bilibili.com/" },
				}
			);
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const data = await res.json();
			let info;
			if (data.code === 0 && data.data) {
				info = {
					follower: data.data.follower || 0,
					following: data.data.following || 0,
					timestamp: Date.now(),
				};
			} else if (data.code === -404 || data.code === -400) {
				info = { follower: -1, following: -1, timestamp: Date.now() };
			} else {
				info = { follower: 0, following: 0, timestamp: Date.now() };
			}
			cache.setUserInfo(mid, info);
			return info;
		} catch (error) {
			const defaultInfo = { follower: 0, following: 0, timestamp: Date.now() };
			cache.setUserInfo(mid, defaultInfo);
			return defaultInfo;
		}
	};

	// 用户操作函数
	const operateUser = async (mid, follow = true) => {
		return new Promise((resolve, reject) => {
			GM_xmlhttpRequest({
				method: "POST",
				url: "https://api.bilibili.com/x/relation/modify",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					Cookie: document.cookie,
				},
				data: `fid=${mid}&act=${
					follow ? 1 : 2
				}&re_src=11&csrf=${getCsrfToken()}`,
				onload: function (response) {
					const data = JSON.parse(response.responseText);
					data.code === 0
						? resolve(data)
						: reject(
								new Error(data.message || (follow ? "关注失败" : "取关失败"))
						  );
				},
				onerror: () => reject(new Error("网络请求失败")),
			});
		});
	};

	// 保持原有函数兼容性
	const followUser = (mid) => operateUser(mid, true);
	const unfollowUser = (mid) => operateUser(mid, false);

	// 主管理类
	class SimpleFollowManager {
		constructor() {
			this.modal = null;
			this.isLoading = false;
			this.followList = [];
			this.filteredList = [];
			this.sortField = "mtime";
			this.sortOrder = "desc";
			this.shouldStop = false;
			this.currentOperation = null; // 'unfollow', 'import', 'sync'
			this.createButton();
		}
		createButton() {
			const btn = document.createElement("button");
			btn.innerText = "管理关注";
			btn.className = "follow-manager-btn";
			btn.onclick = () => this.toggleModal();
			document.body.appendChild(btn);
			this.btn = btn;
		}
		async toggleModal() {
			if (this.modal) return this.closeModal();
			if (this.isLoading) return;
			this.setLoading(true);
			try {
				this.createModal();
				// 首先尝试从缓存获取数据
				const cachedList = cache.get();
				if (cachedList?.length > 0) {
					this.followList = cachedList;
					this.filteredList = cachedList;
					this.renderTable();
					// 在后台获取粉丝数信息
					this.fetchBatchUsersFansRealtime(cachedList);
				} else {
					this.showLoading(MESSAGES.LOADING);
					const list = await this.fetchFollowList();
					if (list.length > 0) {
						cache.set(list);
						this.followList = list;
						this.filteredList = list;
						this.renderTable();
					} else {
						this.showError(MESSAGES.ERROR_NO_DATA);
					}
				}
			} catch (error) {
				console.error("加载失败:", error);
				this.showError("加载失败: " + error.message);
			} finally {
				this.setLoading(false);
			}
		}
		closeModal() {
			if (this.modal) {
				this.modal.remove();
				this.modal = null;
			}
		}
		setLoading(loading) {
			this.isLoading = loading;
			this.btn.disabled = loading;
		}
		async fetchFollowList() {
			const uid = getUserId();
			if (!uid) throw new Error(MESSAGES.ERROR_NO_UID);
			let page = 1;
			let result = [];
			while (true) {
				const res = await fetch(
					`https://api.bilibili.com/x/relation/followings?vmid=${uid}&pn=${page}&ps=${CONFIG.PAGE_SIZE}&order=desc&order_type=attention`,
					{
						credentials: "include",
						headers: { Referer: "https://space.bilibili.com/" },
					}
				);
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
				const data = await res.json();
				if (data.code === 0 && data.data?.list) {
					result = result.concat(data.data.list);
					if (data.data.list.length < CONFIG.PAGE_SIZE) break;
					page++;
					await new Promise((resolve) => setTimeout(resolve, CONFIG.API_DELAY));
				} else {
					throw new Error(data.message || "API错误");
				}
			}
			return result;
		}
		createModal() {
			this.modal = document.createElement("div");
			this.modal.className = "modal-overlay";
			this.modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>关注管理</h3>
                        <button class="close-btn">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="modal-filters">
                            <div class="filter-row">
                                <input id="filter-input" type="text" placeholder="搜索UP主昵称或简介">
                                <select id="filter-status">
                                    <option value="">账号状态</option>
                                    <option value="normal">正常账号</option>
                                    <option value="invalid">失效账号</option>
                                </select>
                                <select id="filter-vip">
                                    <option value="">大会员</option>
                                    <option value="annual">年度大会员</option>
                                    <option value="monthly">月度大会员</option>
                                    <option value="false">非大会员</option>
                                </select>
                                <select id="filter-official">
                                    <option value="">认证状态</option>
                                    <option value="0">个人认证</option>
                                    <option value="1">机构认证</option>
                                    <option value="false">未认证</option>
                                </select>
                                <input type="date" id="filter-date-start" title="开始日期">
                                <input type="date" id="filter-date-end" title="结束日期">
                                <input type="number" id="filter-fans-min" placeholder="最少粉丝数" min="0" title="最少粉丝数">
                                <input type="number" id="filter-fans-max" placeholder="最多粉丝数" min="0" title="最多粉丝数">
                            </div>
                        </div>
                        <div class="modal-list">
                            <table class="follow-table">
                                <thead>
                                    <tr>
                                        <th><input type="checkbox" id="table-select-all"></th>
                                        <th>头像</th>
                                        <th class="sortable" data-sort="uname">昵称</th>
                                        <th class="sortable" data-sort="follower">粉丝数</th>
                                        <th class="sortable" data-sort="mtime">关注时间</th>
                                        <th>简介</th>
                                        <th>认证</th>
                                        <th>大会员</th>
                                    </tr>
                                </thead>
                                <tbody id="table-tbody"></tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-stats">
                        <span>显示: <span id="show-count">0</span> / <span id="total-count">0</span>人 | 已选择: <span id="selected-count">0</span>人</span>
                        <div class="batch-actions">
                            <button id="unfollow-btn">取关选中用户</button>
                            <button id="fetch-fans-btn">获取全部粉丝数</button>
                            <button id="export-btn">导出选中用户</button>
                            <button id="import-btn">从文件导入</button>
                            <button id="sync-btn">从文件同步</button>
                            <button id="clear-cache-btn">刷新列表</button>
                            <button id="stop-btn" style="display: none; background: #dc3545; border-color: #dc3545;">强制停止</button>
                        </div>
                    </div>
                </div>
            `;
			document.body.appendChild(this.modal);
			this.bindEvents();
		}
		bindEvents() {
			// 关闭按钮
			this.modal.querySelector(".close-btn").onclick = () => this.closeModal();
			this.modal.onclick = (e) => {
				if (e.target === this.modal) this.closeModal();
			};
			// 筛选
			this.modal.querySelector("#filter-input").oninput = () =>
				this.filterList();
			this.modal.querySelector("#filter-status").onchange = () =>
				this.filterList();
			this.modal.querySelector("#filter-vip").onchange = () =>
				this.filterList();
			this.modal.querySelector("#filter-official").onchange = () =>
				this.filterList();
			this.modal.querySelector("#filter-date-start").onchange = () =>
				this.filterList();
			this.modal.querySelector("#filter-date-end").onchange = () =>
				this.filterList();
			this.modal.querySelector("#filter-fans-min").oninput = () =>
				this.filterList();
			this.modal.querySelector("#filter-fans-max").oninput = () =>
				this.filterList();
			// 排序
			this.modal.querySelectorAll("th.sortable").forEach((th) => {
				th.addEventListener("click", () =>
					this.sortList(th.getAttribute("data-sort"))
				);
			});
			// 全选
			this.modal.querySelector("#table-select-all").onchange = (e) =>
				this.toggleSelectAll(e.target.checked);
			// 取关
			this.modal.querySelector("#unfollow-btn").onclick = () =>
				this.unfollowSelected();
			// 获取粉丝数
			this.modal.querySelector("#fetch-fans-btn").onclick = () =>
				this.fetchAllFans();
			// 刷新列表
			this.modal.querySelector("#clear-cache-btn").onclick = () =>
				this.refresh();
			// 导出按钮
			this.modal.querySelector("#export-btn").onclick = () =>
				this.exportFollowList();
			// 导入按钮
			this.modal.querySelector("#import-btn").onclick = () =>
				this.importFromFile(false);
			// 同步按钮
			this.modal.querySelector("#sync-btn").onclick = () =>
				this.importFromFile(true);
			// 停止按钮
			this.modal.querySelector("#stop-btn").onclick = () =>
				this.stopCurrentOperation();
		}
		showLoading(message) {
			const tbody = this.modal?.querySelector("#table-tbody");
			if (tbody)
				tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 40px;">${message}</td></tr>`;
		}
		showError(message) {
			const tbody = this.modal?.querySelector("#table-tbody");
			if (tbody)
				tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 40px; color: #dc3545;">${message}</td></tr>`;
		}
		// 显示停止按钮
		showStopButton() {
			const stopBtn = this.modal.querySelector("#stop-btn");
			if (stopBtn) {
				stopBtn.style.display = "block";
			}
		}

		// 隐藏停止按钮
		hideStopButton() {
			const stopBtn = this.modal.querySelector("#stop-btn");
			if (stopBtn) {
				stopBtn.style.display = "none";
			}
		}

		// 停止当前操作
		stopCurrentOperation() {
			if (!confirm("确定要停止当前操作吗？已完成的操作不会回滚。")) {
				return;
			}

			this.shouldStop = true;
			const stopBtn = this.modal.querySelector("#stop-btn");
			if (stopBtn) {
				stopBtn.textContent = "停止中...";
				stopBtn.disabled = true;
			}
		}
		// 重置停止状态
		resetStopState() {
			this.shouldStop = false;
			this.currentOperation = null;
			this.hideStopButton();

			const stopBtn = this.modal.querySelector("#stop-btn");
			if (stopBtn) {
				stopBtn.textContent = "强制停止";
				stopBtn.disabled = false;
			}
		}
		// 检查是否应该停止
		checkShouldStop() {
			return this.shouldStop;
		}
		filterList() {
			const keyword = this.modal
				.querySelector("#filter-input")
				.value.trim()
				.toLowerCase();
			const status = this.modal.querySelector("#filter-status").value;
			const vip = this.modal.querySelector("#filter-vip").value;
			const official = this.modal.querySelector("#filter-official").value;
			const dateStart = this.modal.querySelector("#filter-date-start").value;
			const dateEnd = this.modal.querySelector("#filter-date-end").value;
			const fansMin = this.modal.querySelector("#filter-fans-min").value;
			const fansMax = this.modal.querySelector("#filter-fans-max").value;
			this.filteredList = this.followList.filter((user) => {
				// 关键词筛选（昵称和简介）
				if (keyword) {
					const nameMatch = user.uname.toLowerCase().includes(keyword);
					const signMatch =
						user.sign && user.sign.toLowerCase().includes(keyword);
					if (!nameMatch && !signMatch) return false;
				}
				// 状态筛选
				if (status) {
					const isInvalid =
						user.face.includes("noface.jpg") && user.uname === "账号已注销";
					if (status === "normal" && isInvalid) return false;
					if (status === "invalid" && !isInvalid) return false;
				}
				// 大会员筛选
				if (vip) {
					const hasVip = user.vip && user.vip.vipType > 0;
					if (vip === "false" && hasVip) return false;
					if (vip === "annual" && (!hasVip || user.vip.vipType !== 2))
						return false;
					if (vip === "monthly" && (!hasVip || user.vip.vipType !== 1))
						return false;
				}
				// 认证状态筛选
				if (official) {
					const hasOfficial =
						user.official_verify && user.official_verify.type >= 0;
					if (official === "false" && hasOfficial) return false;
					if (
						official === "0" &&
						(!hasOfficial || user.official_verify.type !== 0)
					)
						return false;
					if (
						official === "1" &&
						(!hasOfficial || user.official_verify.type !== 1)
					)
						return false;
				}
				// 日期筛选
				if ((dateStart || dateEnd) && user.mtime) {
					const userDate = new Date(user.mtime * 1000)
						.toISOString()
						.split("T")[0];
					if (dateStart && userDate < dateStart) return false;
					if (dateEnd && userDate > dateEnd) return false;
				}
				// 粉丝数筛选
				if (fansMin || fansMax) {
					const followerCount =
						user.follower !== null && user.follower !== undefined
							? user.follower
							: -1;
					// 如果用户粉丝数未获取，跳过筛选（显示所有未获取的用户）
					if (followerCount === -1) return true;
					if (fansMin && followerCount < parseInt(fansMin)) return false;
					if (fansMax && followerCount > parseInt(fansMax)) return false;
				}
				return true;
			});
			this.renderTable();
		}
		renderTable() {
			const tbody = this.modal.querySelector("#table-tbody");
			const showCount = this.modal.querySelector("#show-count");
			const totalCount = this.modal.querySelector("#total-count");
			tbody.innerHTML = "";
			this.filteredList.forEach((user) => {
				const followTime = user.mtime
					? new Date(user.mtime * 1000).toLocaleDateString()
					: "未知";
				const isInvalid =
					user.face.includes("noface.jpg") && user.uname === "账号已注销";
				const followerCount =
					user.follower !== null && user.follower !== undefined
						? user.follower.toLocaleString()
						: '<span style="color:#999;">未获取</span>';
				const officialTitle = ((officialInfo) => {
					if (!officialInfo || officialInfo.type < 0) return "";
					const titles = { 0: "个人", 1: "机构" };
					const typeTitle = titles[officialInfo.type] || "认证";
					return officialInfo.desc
						? `${typeTitle}: ${officialInfo.desc}`
						: typeTitle;
				})(user.official_verify);
				const vipType = ((vipInfo) => {
					if (!vipInfo || vipInfo.vipType === 0) return "";
					return vipInfo.label?.text || "大会员";
				})(user.vip);
				const row = document.createElement("tr");
				row.innerHTML = `
                    <td><input type="checkbox" class="row-checkbox" value="${
											user.mid
										}" data-name="${user.uname}"></td>
                    <td><img src="${user.face}" loading="lazy"></td>
                    <td style="${
											isInvalid
												? "color:#999;text-decoration:line-through;"
												: ""
										}">${user.uname}</td>
                    <td>${followerCount}</td>
                    <td>${followTime}</td>
                    <td>${user.sign || "-"}</td>
                    <td>${officialTitle}</td>
                    <td>${vipType}</td>
                `;
				row.onclick = (e) => {
					if (e.target.type !== "checkbox") {
						const checkbox = row.querySelector(".row-checkbox");
						checkbox.checked = !checkbox.checked;
						row.classList.toggle("selected", checkbox.checked);
						this.updateSelectedCount();
					}
				};
				row.querySelector(".row-checkbox").onchange = (e) => {
					row.classList.toggle("selected", e.target.checked);
					this.updateSelectedCount();
				};
				tbody.appendChild(row);
			});
			showCount.textContent = this.filteredList.length;
			totalCount.textContent = this.followList.length;
			this.updateSelectedCount();
		}
		toggleSelectAll(checked) {
			const checkboxes = this.modal.querySelectorAll(".row-checkbox");
			checkboxes.forEach((cb) => {
				cb.checked = checked;
				cb.closest("tr").classList.toggle("selected", checked);
			});
			this.updateSelectedCount();
		}
		updateSelectedCount() {
			const checked = this.modal.querySelectorAll(".row-checkbox:checked");
			const selectedCount = this.modal.querySelector("#selected-count");
			const tableSelectAll = this.modal.querySelector("#table-select-all");
			const total = this.modal.querySelectorAll(".row-checkbox");
			selectedCount.textContent = checked.length;
			tableSelectAll.checked =
				checked.length > 0 && checked.length === total.length;
		}
		async unfollowSelected() {
			const checked = this.modal.querySelectorAll(".row-checkbox:checked");
			if (!checked.length) {
				alert(MESSAGES.SELECT_USERS);
				return;
			}
			if (!confirm(MESSAGES.CONFIRM_UNFOLLOW)) return;

			// 设置操作状态
			this.currentOperation = "unfollow";
			this.shouldStop = false;
			this.showStopButton();

			const unfollowBtn = this.modal.querySelector("#unfollow-btn");
			unfollowBtn.disabled = true;
			unfollowBtn.textContent = "取关中...";

			const usersToUnfollow = Array.from(checked).map((cb) => ({
				mid: cb.value,
				name: cb.getAttribute("data-name"),
				row: cb.closest("tr"),
			}));

			let successCount = 0;
			let failedCount = 0;
			const successfulMids = [];

			for (let i = 0; i < usersToUnfollow.length; i++) {
				// 检查是否应该停止
				if (this.checkShouldStop()) {
					alert(
						`操作已停止！\n已完成: ${i}/${usersToUnfollow.length}个用户\n成功: ${successCount}个，失败: ${failedCount}个`
					);
					break;
				}

				const user = usersToUnfollow[i];
				try {
					await unfollowUser(user.mid);
					successCount++;
					successfulMids.push(user.mid);
					user.row.style.opacity = "0.5";
					user.row.style.backgroundColor = "#e8f5e8";
				} catch (error) {
					failedCount++;
					console.error(`取关 ${user.name} 失败:`, error);
					user.row.style.backgroundColor = "#ffebee";
				}

				unfollowBtn.textContent = `取关中... ${i + 1}/${
					usersToUnfollow.length
				}`;

				if (i < usersToUnfollow.length - 1) {
					await new Promise((resolve) =>
						setTimeout(resolve, CONFIG.BATCH_DELAY)
					);
				}
			}

			// 批量更新数据和界面
			if (successfulMids.length > 0) {
				this.followList = this.followList.filter(
					(u) => !successfulMids.includes(u.mid)
				);
				this.filteredList = this.filteredList.filter(
					(u) => !successfulMids.includes(u.mid)
				);
				successfulMids.forEach((mid) => cache.removeUserInfo(mid));
				cache.set(this.followList);
				this.renderTable();
			}

			if (!this.checkShouldStop()) {
				alert(
					`批量取关完成！\n成功: ${successCount}个，失败: ${failedCount}个`
				);
			}

			unfollowBtn.disabled = false;
			unfollowBtn.textContent = "取关选中用户";
			this.resetStopState();
		}
		sortList(field) {
			if (this.sortField === field) {
				this.sortOrder = this.sortOrder === "desc" ? "asc" : "desc";
			} else {
				this.sortField = field;
				this.sortOrder = "desc";
			}
			this.filteredList.sort((a, b) => {
				let valueA, valueB;
				if (field === "uname") {
					valueA = a.uname.toLowerCase();
					valueB = b.uname.toLowerCase();
				} else if (field === "mtime") {
					valueA = a.mtime || 0;
					valueB = b.mtime || 0;
				} else {
					valueA = a[field] || 0;
					valueB = b[field] || 0;
				}
				if (this.sortOrder === "asc") {
					return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
				} else {
					return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
				}
			});
			// 更新排序标记
			this.modal.querySelectorAll("th").forEach((header) => {
				header.classList.remove("sort-asc", "sort-desc");
			});
			const sortHeader = this.modal.querySelector(`th[data-sort="${field}"]`);
			if (sortHeader) sortHeader.classList.add(`sort-${this.sortOrder}`);
			this.renderTable();
		}

		// 获取全部粉丝数
		async fetchAllFans() {
			if (!confirm("确定要获取所有用户的粉丝数吗？这可能需要一些时间。"))
				return;
			const fetchBtn = this.modal.querySelector("#fetch-fans-btn");
			fetchBtn.disabled = true;
			fetchBtn.textContent = "获取中...";
			let processedCount = 0;
			const totalCount = this.followList.length;
			for (let i = 0; i < this.followList.length; i++) {
				const user = this.followList[i];
				try {
					const info = await fetchUserInfo(user.mid);
					if (info.follower >= 0) {
						user.follower = info.follower;
						user.following = info.following;
						this.updateUserRow(user);
					}
				} catch (error) {}
				processedCount++;
				fetchBtn.textContent = `获取中... ${processedCount}/${totalCount} (${Math.round(
					(processedCount / totalCount) * 100
				)}%)`;
				if (processedCount % 10 === 0) cache.set(this.followList);
				if (i < this.followList.length - 1)
					await new Promise((resolve) =>
						setTimeout(resolve, CONFIG.FANS_API_DELAY)
					);
			}
			cache.set(this.followList);
			alert(
				`粉丝数获取完成！\n成功处理: ${processedCount}/${totalCount} 个用户`
			);
			fetchBtn.disabled = false;
			fetchBtn.textContent = "获取全部粉丝数";
		}
		// 导出选中用户
		exportFollowList() {
			const checked = this.modal.querySelectorAll(".row-checkbox:checked");
			if (!checked.length) {
				alert("请先选择要导出的用户");
				return;
			}

			try {
				// 获取选中用户的数据
				const selectedUsers = Array.from(checked).map((checkbox) => {
					const mid = checkbox.value;
					const name = checkbox.getAttribute("data-name");
					return { mid, name };
				});

				const exportData = selectedUsers
					.map((user) => {
						return `${user.mid},${user.name}`;
					})
					.join("\n");

				// 使用数据URL方案
				const dataUrl =
					"data:text/plain;charset=utf-8," + encodeURIComponent(exportData);
				const timestamp = new Date().toISOString().split("T")[0];

				const a = document.createElement("a");
				a.href = dataUrl;
				a.download = `bilibili_selected_follows_${timestamp}.txt`;
				a.style.display = "none";

				document.body.appendChild(a);
				a.click();

				// 延迟清理
				setTimeout(() => {
					document.body.removeChild(a);
				}, 100);

				alert(`成功导出 ${selectedUsers.length} 个选中用户`);
			} catch (error) {
				console.error("导出失败:", error);
				alert("导出失败: " + error.message);
			}
		}
		// 从文件中导入（update=true：与文件完全同步，支持取关 update=false：只添加新的关注）
		async importFromFile(update=false) {
			try {
				// 1. 选择并读取文件
				const content = await new Promise((resolve, reject) => {
					const input = document.createElement("input");
					input.type = "file";
					input.accept = ".txt";

					input.onchange = (e) => {
						const file = e.target.files[0];
						if (!file) {
							reject(new Error("未选择文件"));
							return;
						}

						const reader = new FileReader();
						reader.onload = (event) => resolve(event.target.result);
						reader.onerror = () => reject(new Error("文件读取失败"));
						reader.readAsText(file);
					};

					input.click();
				});

				// 2. 解析文件内容
				const lines = content.split("\n").filter((line) => line.trim());
				const fileUsers = new Map();

				for (const line of lines) {
					const match = line.match(/^(\d+),([^,]*)/);
					if (match) {
						const mid = match[1].trim();
						const name = match[2].trim() || "未知用户";
						fileUsers.set(mid, { mid, name });
					}
				}

				if (fileUsers.size === 0) {
					alert("未找到有效的用户数据，请确保文件格式为: MID,用户名");
					return;
				}

				// 3. 设置操作状态
				const operationType = update ? "sync" : "import";
				this.currentOperation = operationType;
				this.shouldStop = false;
				this.showStopButton();

				// 4. 分析需要进行的操作
				const localUsers = new Map(
					this.followList.map((user) => [user.mid.toString(), user])
				);
				const fileMids = new Set(fileUsers.keys());

				const usersToFollow = []; // 需要添加的关注（文件有，本地没有）
				const usersToUnfollow = []; // 需要取消的关注（本地有，文件没有）- 仅在update=true时处理

				// 找出需要添加的用户（文件有，本地没有）
				for (const [mid, fileUser] of fileUsers) {
					if (!localUsers.has(mid)) {
						usersToFollow.push(fileUser);
					}
				}

				// 找出需要删除的用户（本地有，文件没有）- 仅在update=true时处理
				if (update) {
					for (const [mid, localUser] of localUsers) {
						if (!fileMids.has(mid)) {
							usersToUnfollow.push(localUser);
						}
					}
				}

				// 5. 检查是否有操作需要执行
				if (usersToFollow.length === 0 && usersToUnfollow.length === 0) {
					const message = update
						? "关注列表已与文件完全同步，无需任何操作"
						: "所有用户已经在关注列表中";
					alert(message);
					return;
				}

				// 6. 显示操作预览
				let previewMsg = "";

				if (usersToFollow.length > 0) {
					const followPreview = usersToFollow
						.slice(0, 3)
						.map((u) => u.name)
						.join(", ");
					previewMsg += `将添加关注: ${followPreview}${
						usersToFollow.length > 3
							? `... 等 ${usersToFollow.length} 个用户`
							: ""
					}\n`;
				}

				if (update && usersToUnfollow.length > 0) {
					const unfollowPreview = usersToUnfollow
						.slice(0, 3)
						.map((u) => u.uname)
						.join(", ");
					previewMsg += `将取消关注: ${unfollowPreview}${
						usersToUnfollow.length > 3
							? `... 等 ${usersToUnfollow.length} 个用户`
							: ""
					}\n`;
				}

				const operationText = update ? "同步" : "导入";
				const confirmMessage = `${operationText}操作预览：\n\n${previewMsg}\n总计：添加 ${
					usersToFollow.length
				} 个${
					update ? `，删除 ${usersToUnfollow.length} 个` : ""
				}\n\n确定要执行${operationText}吗？`;

				if (!confirm(confirmMessage)) {
					return;
				}

				// 7. 更新按钮状态
				const button = this.modal.querySelector(`#${operationType}-btn`);
				if (button) {
					button.disabled = true;
					button.textContent = `${operationText}中...`;
				}

				// 8. 执行批量操作
				let followSuccess = 0;
				let followFailed = 0;
				let unfollowSuccess = 0;
				let unfollowFailed = 0;
				const failedOperations = [];

				const totalOperations = usersToFollow.length + usersToUnfollow.length;
				let completedOperations = 0;

				// 更新进度显示函数
				const updateProgress = (current, total, stats = {}) => {
					if (button) {
						const percent = Math.round((current / total) * 100);
						let statusText = `${operationText}中... ${current}/${total} (${percent}%)`;

						// 添加统计信息
						const totalSuccess =
							(stats.followSuccess || 0) + (stats.unfollowSuccess || 0);
						const totalFailed =
							(stats.followFailed || 0) + (stats.unfollowFailed || 0);
						statusText += ` | 成功:${totalSuccess} 失败:${totalFailed}`;

						button.textContent = statusText;
					}
				};
				// 添加到本地列表函数
				const addUserToLocalList = (user) => {
					const newUserObj = {
						mid: parseInt(user.mid),
						uname: user.name || user.uname,
						mtime: Math.floor(Date.now() / 1000),
						face: "https://static.hdslb.com/images/member/noface.gif",
						sign: "",
						official_verify: { type: -1, desc: "" },
						vip: { vipType: 0 },
						follower: 0,
						following: 0,
					};
					this.followList.push(newUserObj);
					cache.set(this.followList);
					this.filterList();
				};

				// 从本地列表移除函数
				const removeUserFromLocalList = (mid) => {
					this.followList = this.followList.filter(
						(u) => u.mid.toString() !== mid.toString()
					);
					cache.set(this.followList);
					this.filterList();
				};

				// 先执行取消关注操作（仅在update=true时）
				if (update && usersToUnfollow.length > 0) {
					for (let i = 0; i < usersToUnfollow.length; i++) {
						if (this.checkShouldStop()) {
							alert(
								`${operationText}已停止！\n已完成取消关注: ${i}/${usersToUnfollow.length}个用户\n成功: ${unfollowSuccess}个，失败: ${unfollowFailed}个`
							);
							break;
						}

						const user = usersToUnfollow[i];
						try {
							await unfollowUser(user.mid);
							unfollowSuccess++;
							removeUserFromLocalList(user.mid);
						} catch (error) {
							unfollowFailed++;
							failedOperations.push(
								`取消关注失败: ${user.uname} (${user.mid}): ${error.message}`
							);
							console.error(`取消关注 ${user.uname} 失败:`, error);
						}

						completedOperations++;
						updateProgress(completedOperations, totalOperations, {
							followSuccess,
							followFailed,
							unfollowSuccess,
							unfollowFailed,
						});

						if (i < usersToUnfollow.length - 1) {
							await new Promise((resolve) =>
								setTimeout(resolve, CONFIG.BATCH_DELAY)
							);
						}
					}
				}

				// 再执行添加关注操作
				if (usersToFollow.length > 0) {
					for (let i = 0; i < usersToFollow.length; i++) {
						if (this.checkShouldStop()) {
							alert(
								`${operationText}已停止！\n已完成添加关注: ${i}/${usersToFollow.length}个用户\n成功: ${followSuccess}个，失败: ${followFailed}个`
							);
							break;
						}

						const user = usersToFollow[i];
						try {
							await followUser(user.mid);
							followSuccess++;
							addUserToLocalList(user);
						} catch (error) {
							followFailed++;
							failedOperations.push(
								`添加关注失败: ${user.name} (${user.mid}): ${error.message}`
							);
							console.error(`关注 ${user.name} 失败:`, error);
						}

						completedOperations++;
						updateProgress(completedOperations, totalOperations, {
							followSuccess,
							followFailed,
							unfollowSuccess,
							unfollowFailed,
						});

						if (i < usersToFollow.length - 1) {
							await new Promise((resolve) =>
								setTimeout(resolve, CONFIG.BATCH_DELAY)
							);
						}
					}
				}

				// 9. 显示操作结果
				let resultMessage = `${operationText}完成！\n`;
				resultMessage += `添加关注: 成功 ${followSuccess}个, 失败 ${followFailed}个\n`;

				if (update) {
					resultMessage += `取消关注: 成功 ${unfollowSuccess}个, 失败 ${unfollowFailed}个`;
				}

				if (failedOperations.length > 0) {
					resultMessage += `\n\n失败操作:\n${failedOperations
						.slice(0, 8)
						.join("\n")}`;
					if (failedOperations.length > 8) {
						resultMessage += `\n... 还有 ${failedOperations.length - 8} 个失败`;
					}
				}

				alert(resultMessage);

				// 10. 恢复按钮状态
				if (button) {
					button.disabled = false;
					button.textContent = update ? "从文件同步" : "导入关注列表";
				}

				this.resetStopState();
			} catch (error) {
				alert(`操作失败: ${error.message}`);
				console.error("importFromFile error:", error);
			}
		}

		// 批量获取粉丝数（实时后台获取）
		async fetchBatchUsersFansRealtime(users) {
			const needFetchUsers = users.filter(
				(user) => user.follower === null || user.follower === undefined
			);
			if (needFetchUsers.length === 0) return;
			let processedCount = 0;
			const batchSize = 5;
			for (
				let batchIndex = 0;
				batchIndex < needFetchUsers.length;
				batchIndex += batchSize
			) {
				const batch = needFetchUsers.slice(batchIndex, batchIndex + batchSize);
				for (const user of batch) {
					try {
						const info = await fetchUserInfo(user.mid);
						user.follower = info.follower >= 0 ? info.follower : 0;
						user.following = info.following || 0;
						this.updateUserRow(user);
					} catch (error) {
						user.follower = 0;
						this.updateUserRow(user);
					}
					processedCount++;
					await new Promise((resolve) =>
						setTimeout(resolve, CONFIG.FANS_API_DELAY)
					);
				}
				cache.set(this.followList);
				if (batchIndex + batchSize < needFetchUsers.length) {
					await new Promise((resolve) => setTimeout(resolve, 800));
				}
			}
		}
		// 更新用户行的粉丝数显示
		updateUserRow(user) {
			const tbody = this.modal?.querySelector("#table-tbody");
			if (!tbody) return;
			const targetRow = Array.from(tbody.querySelectorAll("tr")).find((row) => {
				const checkbox = row.querySelector(".row-checkbox");
				return checkbox && checkbox.value === user.mid;
			});
			if (targetRow) {
				const followerCell = targetRow.children[3];
				if (followerCell) {
					followerCell.innerHTML =
						user.follower !== null && user.follower !== undefined
							? user.follower.toLocaleString()
							: '<span style="color:#999;">未获取</span>';
				}
			}
		}
		// 刷新列表
		async refresh() {
			if (!confirm("确定要刷新吗？")) return;

			const clearBtn = this.modal.querySelector("#clear-cache-btn");
			clearBtn.disabled = true;
			clearBtn.textContent = "刷新中...";

			cache.clear();
			const clearedCount = cache.clearUserInfo();

			// 重新加载关注列表
			this.showLoading("正在重新加载关注列表...");

			try {
				const list = await this.fetchFollowList();
				if (list.length > 0) {
					cache.set(list);
					this.followList = list;
					this.filteredList = list;
					this.renderTable();
				} else {
					this.showError(MESSAGES.ERROR_NO_DATA);
				}
			} catch (error) {
				console.error("重新加载失败:", error);
				this.showError("重新加载失败: " + error.message);
			} finally {
				clearBtn.disabled = false;
				clearBtn.textContent = "刷新列表";
			}
		}
	}
	// 初始化
	new SimpleFollowManager();
})();

// ==UserScript==
// @name         pikpak助手 (拖拽功能修正版)
// @namespace    http://tampermonkey.net/
// @version      1.3.9-drag-fix
// @author       jdysya (modified by Assistant)
// @description  基于可运行的“自然排序版”进行修改，修复了按钮消失的问题，并加入了完整的拖拽选择/取消功能。
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mypikpak.com
// @match        https://mypikpak.com/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.4.27/dist/vue.global.prod.js
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/547609/pikpak%E5%8A%A9%E6%89%8B%20%28%E6%8B%96%E6%8B%BD%E5%8A%9F%E8%83%BD%E4%BF%AE%E6%AD%A3%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547609/pikpak%E5%8A%A9%E6%89%8B%20%28%E6%8B%96%E6%8B%BD%E5%8A%9F%E8%83%BD%E4%BF%AE%E6%AD%A3%E7%89%88%29.meta.js
// ==/UserScript==

(function(vue) {
    'use strict';

    // --- 在原作者样式基础上，新增拖拽相关样式 ---
    const originalStyles = " .dialog[data-v-b2d19a6a]{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;z-index:10000;padding:30px;box-shadow:0 5px 15px #0000004d;border-radius:10px;width:90%;max-width:700px;box-sizing:border-box}.dialog h2[data-v-b2d19a6a]{text-align:center;color:#333;margin-bottom:20px}.dialog .close[data-v-b2d19a6a]{position:absolute;right:15px;top:15px;font-size:30px;cursor:pointer;color:#999;transition:color .3s ease}.dialog .close[data-v-b2d19a6a]:hover{color:#666}.toolbar[data-v-b2d19a6a]{display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;padding-bottom:10px;border-bottom:1px solid #eee}.toolbar input[type=checkbox][data-v-b2d19a6a]{margin-right:8px;transform:scale(1.2)}.sort-options button[data-v-b2d19a6a]{margin-left:10px;padding:8px 15px;border:1px solid #dcdfe6;background-color:#f4f4f5;color:#606266;cursor:pointer;border-radius:4px;transition:all .3s ease}.sort-options button[data-v-b2d19a6a]:hover{background-color:#e9e9eb;border-color:#d3d4d6;color:#303133}.movies[data-v-b2d19a6a]{margin-top:10px;height:400px;overflow-y:auto;border:1px solid #ebeef5;border-radius:4px;padding:10px;background-color:#fdfdfd}.movies li[data-v-b2d19a6a]{display:flex;align-items:center;padding:8px 0;border-bottom:1px dashed #f0f0f0;font-size:14px;color:#303133}.movies li .file-info[data-v-b2d19a6a]{margin-left:auto;color:#606266;font-size:12px}.movies li[data-v-b2d19a6a]:last-child{border-bottom:none}.movies li input[type=checkbox][data-v-b2d19a6a]{margin-right:10px;transform:scale(1.1)}.movies li .icon[data-v-b2d19a6a]{margin-right:8px;font-size:1.2em}.footer[data-v-b2d19a6a]{margin-top:20px;display:flex;flex-direction:row-reverse}.btn.el-button[data-v-b2d19a6a]{padding:10px 20px;background-color:#409eff;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:16px;transition:background-color .3s ease}.btn.el-button[data-v-b2d19a6a]:hover{background-color:#66b1ff}.dialog[data-v-3448452d]{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;z-index:10000;padding:30px;box-shadow:0 5px 15px #0000004d;border-radius:10px;width:90%;max-width:500px;box-sizing:border-box}.dialog h2[data-v-3448452d]{text-align:center;color:#333;margin-bottom:20px}.dialog .close[data-v-3448452d]{position:absolute;right:15px;top:15px;font-size:30px;cursor:pointer;color:#999;transition:color .3s ease}.dialog .close[data-v-3448452d]:hover{color:#666}.config-list[data-v-3448452d]{margin-top:20px}.config-list li[data-v-3448452d]{margin-bottom:15px}.config-list li .label[data-v-3448452d]{font-weight:700;margin-bottom:5px;display:block;color:#555}.config-list li input[type=text][data-v-3448452d]{width:100%;padding:10px;border:1px solid #dcdfe6;border-radius:4px;box-sizing:border-box;font-size:14px;transition:border-color .3s ease}.config-list li input[type=text][data-v-3448452d]:focus{border-color:#409eff;outline:none}.footer[data-v-3448452d]{margin-top:20px;display:flex;flex-direction:row-reverse}.btn.el-button[data-v-3448452d]{padding:10px 20px;background-color:#409eff;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:16px;transition:background-color .3s ease}.btn.el-button[data-v-3448452d]:hover{background-color:#66b1ff}.guidance[data-v-3448452d]{font-size:12px;color:#909399;margin-top:5px;line-height:1.5}.form[data-v-3448452d]{margin-top:20px}.xz-input[data-v-3448452d]{border:#d9d9d9 1px solid;margin-bottom:10px;padding:5px;margin-top:5px}.aria2-tip[data-v-57ad7c2f]{padding:10px;background:rgba(0,0,0,.8);position:absolute;top:30px;left:50%;transform:translateY(-50%);color:#fff;border-radius:8px}.btns[data-v-1d4f0b89]{display:flex;flex-direction:row-reverse;padding-right:10px;padding-top:20px}.btns li[data-v-1d4f0b89]{cursor:pointer;margin-right:10px;padding:8px 15px;background-color:#409eff;color:#fff;border-radius:4px;transition:background-color .3s ease}.btns li[data-v-1d4f0b89]:hover{background-color:#66b1ff} ";
    const addedStyles = ".movies.is-drag-selecting li { user-select: none; } .drag-handle { display: flex; align-items: center; cursor: grab; padding-right: 5px; }";
    (a => { const o = document.createElement("style"); o.innerText = a; document.head.appendChild(o) })(originalStyles + addedStyles);

    // --- 辅助函数区域 ---
    function postData(url = "", data = {}, customHeaders = {}, method = "GET") { if (method === "GET") { return fetch(url, { method: "GET", mode: "cors", cache: "no-cache", credentials: "same-origin", headers: { "Content-Type": "application/json", ...customHeaders }, redirect: "follow", referrerPolicy: "no-referrer" }).then((response) => response.json()) } else { return new Promise((resolve, reject) => { let xhr = new XMLHttpRequest; xhr.onreadystatechange = function () { if (xhr.readyState === 4) { if (xhr.status === 200) { resolve(JSON.parse(xhr.response)) } else { reject({}) } } }; xhr.open(method, url); xhr.setRequestHeader("content-type", "application/json"); xhr.send(JSON.stringify(data)) }) } }
    function getHeader() { let token = ""; let captcha = ""; for (let i = 0; i < 40; i++) { let key = window.localStorage.key(i); if (key === null) break; if (key && key.startsWith("credentials")) { let tokenData = JSON.parse(window.localStorage.getItem(key)); token = tokenData.token_type + " " + tokenData.access_token; continue } if (key && key.startsWith("captcha")) { let tokenData = JSON.parse(window.localStorage.getItem(key)); captcha = tokenData.captcha_token } } return { Authorization: token, "x-device-id": window.localStorage.getItem("deviceid"), "x-captcha-token": captcha } }
    function getList(parent_id) { let url = `https://api-drive.mypikpak.com/drive/v1/files?thumbnail_size=SIZE_MEDIUM&limit=500&parent_id=${parent_id}&with_audit=true&filters=%7B%22phase%22%3A%7B%22eq%22%3A%22PHASE_TYPE_COMPLETE%22%7D%2C%22trashed%22%3A%7B%22eq%22%3Afalse%7D%7D`; return postData(url, {}, getHeader()) }
    function getDownload(id) { let header = getHeader(); return postData("https://api-drive.mypikpak.com/drive/v1/files/" + id + "?", {}, header) }
    const _export_sfc = (sfc, props) => { const target = sfc.__vccOpts || sfc; for (const [key, val] of props) { target[key] = val } return target };

    // --- Vue 组件定义区域 ---
    const _withScopeId$1 = (n) => (vue.pushScopeId("data-v-b2d19a6a"), n = n(), vue.popScopeId(), n);
    const _hoisted_1$3 = { key: 0, style: { "width": "60%" }, class: "dialog" };
    const _hoisted_2$1 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ vue.createElementVNode("h2", null, "请勾选你要下载的", -1));
    const _hoisted_3$1 = { class: "toolbar" }; const _hoisted_4$1 = { class: "sort-options" }; const _hoisted_5$1 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ vue.createElementVNode("label", { for: "sort-by" }, "排序方式:", -1)); const _hoisted_6$1 = /* @__PURE__ */ vue.createStaticVNode('<option value="name" data-v-b2d19a6a>名称</option><option value="created_time" data-v-b2d19a6a>创建时间</option><option value="modified_time" data-v-b2d19a6a>修改时间</option><option value="size" data-v-b2d19a6a>大小</option><option value="file_category" data-v-b2d19a6a>文件类型</option>', 5); const _hoisted_11$1 = [_hoisted_6$1]; const _hoisted_12 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ vue.createElementVNode("option", { value: "asc" }, "升序", -1)); const _hoisted_13 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ vue.createElementVNode("option", { value: "desc" }, "降序", -1)); const _hoisted_14 = [_hoisted_12, _hoisted_13]; const _hoisted_16 = ["id", "value"]; const _hoisted_17 = { class: "icon" }; const _hoisted_18 = { class: "file-info" };
    const _sfc_main$3 = {
        __name: "AriaDownloadDialog", props: { show: Boolean }, emits: ["update:show", "msg"],
        setup(__props, { emit: __emit }) {
            const props = __props; const emits = __emit; const list = vue.ref([]); const selected = vue.ref([]); const checkedAll = vue.ref(false); const selectedItems = vue.ref([]); const isForbidden = vue.ref(false); const sortBy = vue.ref("name"); const sortDirection = vue.ref("asc");
            const isDragging = vue.ref(false); const dragMode = vue.ref('select');

            const handleMouseUp = () => { isDragging.value = false; };
            const handleMouseDown = (index) => { isDragging.value = true; const isCurrentlySelected = selected.value.includes(index); if (isCurrentlySelected) { selected.value.splice(selected.value.indexOf(index), 1); dragMode.value = 'deselect'; } else { selected.value.push(index); dragMode.value = 'select'; } onCheck(); };
            const handleMouseEnter = (index) => { if (isDragging.value) { const pos = selected.value.indexOf(index); if (dragMode.value === 'select' && pos === -1) { selected.value.push(index); } else if (dragMode.value === 'deselect' && pos > -1) { selected.value.splice(pos, 1); } onCheck(); } };

            vue.watch(() => props.show, (isVisible) => { if (isVisible) { window.addEventListener('mouseup', handleMouseUp); const tempList = []; let parent_id = window.location.href.split("/").pop(); if (parent_id == "all") parent_id = ""; emits("msg", "按住图标/复选框区域拖拽可选择"); getList(parent_id).then((res) => { res.files.forEach((item) => { tempList.push({ id: item.id, name: item.name, type: item.kind, created_time: item.created_time, modified_time: item.modified_time, size: item.size, file_category: item.file_category }) }); list.value = tempList; sortList() }) } else { window.removeEventListener('mouseup', handleMouseUp); } });

            const close = () => { selected.value = []; checkedAll.value = false; isForbidden.value = false; emits("update:show", false) };
            const onCheckAll = () => { if (checkedAll.value) { selected.value = list.value.map((item, index) => index) } else { selected.value = [] }; onCheck(); };
            const onCheck = () => { checkedAll.value = selected.value.length === list.value.length && list.value.length > 0 };
            const sortList = () => { list.value.sort((a, b) => { if (a.type === "drive#folder" && b.type !== "drive#folder") { return -1 } if (a.type !== "drive#folder" && b.type === "drive#folder") { return 1 } if (sortBy.value === 'name') { const comparison = a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }); return sortDirection.value === 'asc' ? comparison : -comparison; } let aValue = a[sortBy.value]; let bValue = b[sortBy.value]; if (sortBy.value === "size") { aValue = parseInt(aValue) || 0; bValue = parseInt(bValue) || 0 } else if (sortBy.value === "created_time" || sortBy.value === "modified_time") { aValue = new Date(aValue).getTime(); bValue = new Date(bValue).getTime() } let comparison = 0; if (aValue > bValue) { comparison = 1 } else if (aValue < bValue) { comparison = -1 } return sortDirection.value === "asc" ? comparison : -comparison }); updateSelectedIndices() };
            const formatBytes = (bytes, decimals = 2) => { if (!bytes || bytes === 0) return "0 Bytes"; const k = 1024; const dm = decimals < 0 ? 0 : decimals; const sizes = ["Bytes", "KB", "MB", "GB", "TB"]; const i = Math.floor(Math.log(bytes) / Math.log(k)); return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i] };
            const formatFileInfo = (item) => { switch (sortBy.value) { case "size": return item.size ? formatBytes(parseInt(item.size)) : "N/A"; case "created_time": return item.created_time ? new Date(item.created_time).toLocaleString() : "N/A"; case "modified_time": return item.modified_time ? new Date(item.modified_time).toLocaleString() : "N/A"; case "file_category": return item.file_category || "N/A"; default: return "" } };
            const updateSelectedIndices = () => { const currentlySelectedIds = new Set(selected.value.map((index) => list.value[index].id)); selected.value = []; list.value.forEach((item, index) => { if (currentlySelectedIds.has(item.id)) { selected.value.push(index) } }) };
            const getAllList = async () => { emits("msg", "开始获取文件内容"); const initialSelectedItems = []; for (const index of selected.value) { initialSelectedItems.push(list.value[index]) } const allFiles = []; const foldersToProcess = []; initialSelectedItems.forEach((item) => { if (item.type === "drive#folder") { foldersToProcess.push({ id: item.id, name: item.name, path: item.name }) } else { allFiles.push({ ...item, path: "" }) } }); let processedCount = 0; while (foldersToProcess.length > 0) { const currentFolder = foldersToProcess.shift(); processedCount++; emits("msg", `正在扫描第 ${processedCount} 个文件夹: ${currentFolder.name}`); try { const result = await getList(currentFolder.id); if (result.files) { for (const file of result.files) { if (file.kind === "drive#folder") { foldersToProcess.push({ id: file.id, name: file.name, path: `${currentFolder.path}/${file.name}` }) } else { allFiles.push({ ...file, path: currentFolder.path }) } } } } catch (e) { emits("msg", `获取文件夹 ${currentFolder.name} 内容失败`); console.error(e) } } selectedItems.value = allFiles; emits("msg", `文件获取完毕，共${allFiles.length}个文件。`) };
            const pushBefore = async () => { if (!isForbidden.value) { isForbidden.value = true; await getAllList(); push() } else { emits("msg", "任务已开始，请勿重复点击") } };
            const triggerBrowserDownload = (url, filename) => { const a = document.createElement('a'); a.href = url; a.download = filename || 'download'; document.body.appendChild(a); a.click(); document.body.removeChild(a); };
            const push = async () => { let total = selectedItems.value.length; let success = 0; let fail = 0; for (let i = 0; i < selectedItems.value.length; i++) { const item = selectedItems.value[i]; const currentCount = i + 1; if (item.type === 'drive#folder') { emits("msg", `[${currentCount}/${total}] ⏭️ 跳过文件夹: ${item.name}`); await new Promise(resolve => setTimeout(resolve, 300)); continue; } try { emits("msg", `[${currentCount}/${total}] ⏳ 正在获取: ${item.name}`); const res = await getDownload(item.id); if (res && res.web_content_link) { triggerBrowserDownload(res.web_content_link, res.name); success++; emits("msg", `[${currentCount}/${total}] ✅ 添加成功: ${item.name}`); } else { fail++; emits("msg", `[${currentCount}/${total}] ❌ 获取链接失败: ${item.name}`); console.warn("获取下载链接失败", res); } } catch (err) { fail++; emits("msg", `[${currentCount}/${total}] ❌ 处理失败: ${item.name}`); console.error("下载处理失败", err); } await new Promise(resolve => setTimeout(resolve, 500)); } emits("msg", `🏁 全部任务已添加！成功: ${success}，失败: ${fail}。可手动关闭窗口。`); isForbidden.value = false; };

            return (_ctx, _cache) => {
                return __props.show ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$3, [
                    _hoisted_2$1,
                    vue.createElementVNode("div", { class: "close", onClick: close }, "×"),
                    vue.createElementVNode("div", _hoisted_3$1, [ vue.withDirectives(vue.createElementVNode("input", { onChange: onCheckAll, style: { "margin": "10px 10px 0 0" }, type: "checkbox", id: "checkbox", "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => checkedAll.value = $event) }, null, 544), [[vue.vModelCheckbox, checkedAll.value]]), vue.createTextVNode("全选 "), vue.createElementVNode("div", _hoisted_4$1, [ _hoisted_5$1, vue.withDirectives(vue.createElementVNode("select", { id: "sort-by", "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => sortBy.value = $event), onChange: sortList }, _hoisted_11$1, 544), [[vue.vModelSelect, sortBy.value]]), vue.withDirectives(vue.createElementVNode("select", { id: "sort-direction", "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => sortDirection.value = $event), onChange: sortList }, _hoisted_14, 544), [[vue.vModelSelect, sortDirection.value]]) ]) ]),
                    vue.createElementVNode("ul", { class: vue.normalizeClass(["movies", { 'is-drag-selecting': isDragging.value }]) }, [
                        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(list.value, (item, index) => {
                            return (vue.openBlock(), vue.createElementBlock("li", { key: item.id, onMouseenter: ($event) => handleMouseEnter(index) }, [
                                vue.createElementVNode("div", { class: "drag-handle", onMousedown: ($event) => { $event.preventDefault(); handleMouseDown(index) } }, [
                                    vue.withDirectives(vue.createElementVNode("input", { onChange: onCheck, type: "checkbox", id: item.id, value: index, "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => selected.value = $event) }, null, 40, _hoisted_16), [[vue.vModelCheckbox, selected.value]]),
                                    vue.createElementVNode("span", _hoisted_17, vue.toDisplayString(item.type === "drive#folder" ? "📁" : "📄"), 1)
                                ], 32),
                                vue.createElementVNode("span", null, vue.toDisplayString(item.name), 1),
                                vue.createElementVNode("span", _hoisted_18, vue.toDisplayString(formatFileInfo(item)), 1)
                            ], 32))
                        }), 128))
                    ], 2),
                    vue.createElementVNode("div", { class: "footer" }, [ vue.createElementVNode("div", { class: "btn el-button el-button--primary", onClick: pushBefore }, "浏览器下载") ])
                ])) : vue.createCommentVNode("", true);
            };
        }
    };
    const AriaDownloadDialog = _export_sfc(_sfc_main$3, [["__scopeId", "data-v-b2d19a6a"]]);
    const _sfc_main$2 = {}; const AriaConfigDialog = _export_sfc(_sfc_main$2, [["__scopeId", "data-v-3448452d"]]);
    const _sfc_main$1 = {}; const Aria2Toast = _export_sfc(_sfc_main$1, [["__scopeId", "data-v-57ad7c2f"]]);
    const _hoisted_1 = { key: 0, class: "btns" };
    const _sfc_main = {
        __name: "App",
        setup(__props) {
            const downloadShow = vue.ref(false); const tip = vue.ref(""); const toastRef = vue.ref(null); const showPlugin = vue.ref(false);
            const showToast = (val) => { tip.value = val; toastRef.value.open(); };
            if (location.pathname !== "/") { showPlugin.value = true; }
            return (_ctx, _cache) => {
                return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
                    showPlugin.value ? (vue.openBlock(), vue.createElementBlock("ul", _hoisted_1, [ vue.createElementVNode("li", { class: "btn", onClick: _cache[0] || (_cache[0] = ($event) => downloadShow.value = true) }, "批量下载") ])) : vue.createCommentVNode("", true),
                    vue.createVNode(AriaDownloadDialog, { onMsg: showToast, show: downloadShow.value, "onUpdate:show": _cache[1] || (_cache[1] = ($event) => downloadShow.value = $event) }, null, 8, ["show"]),
                    vue.createVNode(Aria2Toast, { ref_key: "toastRef", ref: toastRef }, { default: vue.withCtx(() => [vue.createTextVNode(vue.toDisplayString(tip.value), 1)]), _: 1 }, 512)
                ], 64);
            };
        }
    };
    const App = _export_sfc(_sfc_main, [["__scopeId", "data-v-1d4f0b89"]]);
    document.cookie = "pp_access_to_visit=true";
    setTimeout(() => { vue.createApp(App).mount((() => { let pikpakContainer = document.getElementById("app"); const app = document.createElement("div"); document.body.insertBefore(app, pikpakContainer); return app })()) }, 1e3);
})(Vue);
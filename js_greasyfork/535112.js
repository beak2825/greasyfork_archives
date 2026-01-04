// ==UserScript==
// @name         火星工具箱
// @namespace    https://hxxt.cc/
// @version      3.0
// @description  火星扫码系统出品：百度系全站可拖拽悬浮logo，批量智能注入、复制、清理CK+一键检测接码API到期！
// @author       火星扫码系统 & ChatGPT
// @match        *://*.baidu.com/*
// @icon         https://hxxt.cc/color-space-logo.png
// @license 只要您给我署名就可以修改
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/535112/%E7%81%AB%E6%98%9F%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/535112/%E7%81%AB%E6%98%9F%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 创建悬浮Logo ---
    function createFloatLogo() {
        if (document.getElementById('huoxing_ck_logo_2024')) return;
        const ball = document.createElement('div');
        ball.id = 'huoxing_ck_logo_2024';
        ball.style.position = 'fixed';
        ball.style.top = '250px';
        ball.style.right = '24px';
        ball.style.zIndex = '2147483647';
        ball.style.width = '56px';
        ball.style.height = '56px';
        ball.style.background = 'transparent';
        ball.style.borderRadius = '50%';
        ball.style.boxShadow = '0 3px 15px rgba(0,128,255,.19)';
        ball.style.display = 'flex';
        ball.style.alignItems = 'center';
        ball.style.justifyContent = 'center';
        ball.style.cursor = 'pointer';
        ball.style.userSelect = 'none';
        ball.title = "火星工具箱";
        ball.style.transition = 'box-shadow 0.18s, right 0.3s, left 0.3s, opacity 0.2s';

        // 插入logo图片
        const img = document.createElement('img');
        img.src = 'https://hxxt.cc/color-space-logo.png';
        img.alt = '火星扫码系统LOGO';
        img.style.width = '45px';
        img.style.height = '35px';
        img.style.borderRadius = '50%';
        img.style.boxShadow = '0 2px 10px rgba(0,128,255,0.11)';
        img.draggable = false;
        ball.appendChild(img);

        document.body.appendChild(ball);

        // 拖动逻辑
        let dragging = false, lastX = 0, lastY = 0, startLeft = 0, startTop = 0, side = 'right';
        // 记录吸附边
        function getSide() {
            const rect = ball.getBoundingClientRect();
            return rect.left + rect.width/2 < window.innerWidth/2 ? 'left' : 'right';
        }
        // 只允许贴边，完全显示
        function stickToEdge() {
            const rect = ball.getBoundingClientRect();
            let top = parseInt(ball.style.top);
            if (isNaN(top)) top = rect.top;
            // 限制上下
            top = Math.max(10, Math.min(window.innerHeight - rect.height - 10, top));
            ball.style.top = top + 'px';
            // 判断左右
            if (rect.left + rect.width/2 < window.innerWidth/2) {
                // 吸附左侧，完全显示
                ball.style.left = '0px';
                ball.style.right = '';
                side = 'left';
            } else {
                // 吸附右侧，完全显示
                ball.style.left = '';
                ball.style.right = '0px';
                side = 'right';
            }
        }
        // 拖拽
        ball.addEventListener('mousedown', function(e){
            dragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
            const rect = ball.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            ball.style.transition = "none";
            e.preventDefault();
        });
        document.addEventListener('mousemove', function(e){
            if(dragging){
                let dx = e.clientX - lastX;
                let dy = e.clientY - lastY;
                lastX = e.clientX; lastY = e.clientY;
                let newTop = (parseInt(ball.style.top)||startTop) + dy;
                // 只允许左右贴边
                // 判断鼠标在左半还是右半
                if(e.clientX < window.innerWidth/2){
                    // 贴左
                    ball.style.left = '0px';
                    ball.style.right = '';
                    side = 'left';
                }else{
                    // 贴右
                    ball.style.left = '';
                    ball.style.right = '0px';
                    side = 'right';
                }
                // 限制上下
                newTop = Math.max(10, Math.min(window.innerHeight - ball.offsetHeight - 10, newTop));
                ball.style.top = newTop + 'px';
            }
        });
        document.addEventListener('mouseup', function(){
            if(dragging){
                dragging = false;
                ball.style.transition = 'box-shadow 0.18s, right 0.3s, left 0.3s, opacity 0.2s';
                stickToEdge();
            }
        });
        // 鼠标悬停/移开都保持完全显示
        ball.addEventListener('mouseenter', ()=> {
            ball.style.boxShadow="0 6px 24px 6px #33aadd44";
            ball.style.transform = "scale(1.15)";
            if(side==='left'){
                ball.style.left = '0px';
            }else{
                ball.style.right = '0px';
            }
        });
        ball.addEventListener('mouseleave', ()=>{
            ball.style.boxShadow="0 3px 15px rgba(0,128,255,.19)";
            ball.style.transform="scale(1)";
            if(side==='left'){
                ball.style.left = '0px';
            }else{
                ball.style.right = '0px';
            }
        });
        // 点击弹主界面
        ball.addEventListener('click', function(){
            createUI();
        });
        // 初始吸附
        stickToEdge();
        // 窗口变化时自动吸边
        window.addEventListener('resize', stickToEdge);
    }

    // --- 主页面 ---
    function createUI() {
        if (document.getElementById('huoxing_ck_panel_2024')) return;

        // 遮罩
        const mask = document.createElement("div");
        mask.id = "huoxing_ck_mask_2024";
        mask.style.position = "fixed";
        mask.style.left = "0";
        mask.style.top = "0";
        mask.style.width = "100vw";
        mask.style.height = "100vh";
        mask.style.background = "rgba(0,0,0,0.12)";
        mask.style.zIndex = "2147483646";
        mask.onclick = closeUI;

        // 面板
        const div = document.createElement("div");
        div.id = "huoxing_ck_panel_2024";
        div.style.position = "fixed";
        div.style.top = "110px";
        div.style.right = "90px";
        div.style.zIndex = "2147483647";
        div.style.background = "#fff";
        div.style.border = "2px solid #0075ff";
        div.style.boxShadow = "0 2px 16px rgba(0,128,255,0.14)";
        div.style.padding = "20px 22px 16px";
        div.style.borderRadius = "13px";
        div.style.fontSize = "15px";
        div.style.color = "#222";
        div.style.minWidth = "370px";
        div.style.maxWidth = "98vw";
        div.style.lineHeight = "1.7";

        // 标题栏
        div.innerHTML = `
            <div style="display:flex;align-items:center;margin-bottom:4px;">
                <img src="https://hxxt.cc/color-space-logo.png" alt="logo" style="height:34px;width:34px;border-radius:50%;margin-right:9px;background:#f8faff;box-shadow:0 1px 6px #eaf1fd;">
                <span style="font-weight:bold;font-size:17px;color:#2075FF;">火星百度CK管理工具</span>
            </div>
            <div style="color:#2275ff;font-size:13px;margin-bottom:8px;">—— 火星扫码系统出品 ——</div>
            <div style="margin-bottom:7px;font-size:13px;">
              <span style="color:#2075FF">当前域名:</span> <span>${window.location.hostname}</span>
            </div>
        `;

        // === 【1】当前CK展示区：增加卡片效果 ===
        const cookieCard = document.createElement('div');
        cookieCard.style.background = "#f9fbfd";
        cookieCard.style.border = "1.5px solid #d6e7ff";
        cookieCard.style.boxShadow = "0 2px 8px rgba(32,117,255,.04)";
        cookieCard.style.borderRadius = "9px";
        cookieCard.style.padding = "12px 10px 8px 10px";
        cookieCard.style.marginBottom = "13px";

        const cookieShow = document.createElement('textarea');
        cookieShow.id = "current_cookie_display";
        cookieShow.readOnly = true;
        cookieShow.value = getAllCookieString();
        cookieShow.title = '当前域所有Cookie，可手动选中复制';
        cookieShow.style.width = '100%';
        cookieShow.style.height = '54px';
        cookieShow.style.fontFamily = "monospace";
        cookieShow.style.background = "#f4faff";
        cookieShow.style.resize = "vertical";
        cookieShow.style.cursor = "pointer";
        cookieShow.style.color = "#444";
        cookieShow.style.fontSize = "13px";
        cookieShow.style.border = "1px solid #baddff";
        cookieShow.style.borderRadius = "6px";
        cookieShow.style.boxShadow = "0 1px 3px #e9f1ff";
        cookieShow.style.outline = "none";
        cookieShow.style.padding = "7px 8px";

        cookieCard.appendChild(cookieShow);

        // 按钮行（复制、清理）
        const btnBar = document.createElement("div");
        btnBar.style.marginTop = "8px";
        btnBar.style.display = "flex";
        btnBar.style.gap = "10px";

        const btnCopy = document.createElement('button');
        btnCopy.innerText = "复制当前CK";
        btnCopy.style.background = "#40a9ff";
        btnCopy.style.color = "#fff";
        btnCopy.style.padding = "5px 16px";
        btnCopy.style.border = "none";
        btnCopy.style.borderRadius = "3px";
        btnCopy.style.fontSize = "13px";
        btnCopy.onclick = function(){
            copyToClipboard(cookieShow.value);
            showMsg('已复制当前域全部cookie到剪贴板！');
        };
        btnBar.appendChild(btnCopy);

        const btnClear = document.createElement('button');
        btnClear.innerText = "清理当前CK";
        btnClear.style.background = "#ff4747";
        btnClear.style.color = "#fff";
        btnClear.style.padding = "5px 16px";
        btnClear.style.border = "none";
        btnClear.style.borderRadius = "3px";
        btnClear.style.fontSize = "13px";
        btnClear.onclick = function(){
            clearAllCookiesSmart();
            setTimeout(()=>{
                cookieShow.value = getAllCookieString();
                showMsg('已清理当前域全部Cookie！');
            },400);
        };
        btnBar.appendChild(btnClear);

        cookieCard.appendChild(btnBar);
        div.appendChild(cookieCard); // 用卡片包裹

        // === 【2】注入区域也加卡片 ===
        const inputCard = document.createElement('div');
        inputCard.style.background = "#f9fbfd";
        inputCard.style.border = "1.5px solid #d6e7ff";
        inputCard.style.boxShadow = "0 2px 8px rgba(32,117,255,.04)";
        inputCard.style.borderRadius = "9px";
        inputCard.style.padding = "12px 10px 8px 10px";
        inputCard.style.marginBottom = "11px";

        const ta = document.createElement('textarea');
        ta.id = "input_baidu_ck";
        ta.placeholder = "请粘贴你的完整Cookie，如：BDUSS=xxx; BAIDUID=yyy; ...";
        ta.style.width = "100%";
        ta.style.height = "78px";
        ta.style.resize = "vertical";
        ta.style.background = "#f4faff";
        ta.style.fontFamily = "monospace";
        ta.style.color = "#444";
        ta.style.fontSize = "13px";
        ta.style.border = "1px solid #baddff";
        ta.style.borderRadius = "6px";
        ta.style.boxShadow = "0 1px 3px #e9f1ff";
        ta.style.outline = "none";
        ta.style.padding = "7px 8px";
        inputCard.appendChild(ta);
        div.appendChild(inputCard);

        // 注入与关闭按钮
        const bar = document.createElement('div');
        bar.style.textAlign = "left";
        bar.style.display = "flex";
        bar.style.gap = "14px";
        bar.style.marginTop = "2px";

        const btnSet = document.createElement('button');
        btnSet.innerText = "注入CK";
        btnSet.style.background = "#2075ff";
        btnSet.style.color = "#fff";
        btnSet.style.padding = "7px 26px";
        btnSet.style.border = "none";
        btnSet.style.borderRadius = "3px";
        btnSet.style.fontSize = "15px";
        btnSet.onclick = function(){
            const ckStr = ta.value.trim();
            if (!ckStr) {
                showMsg("请先粘贴Cookie！");
                return;
            }
            clearAllCookiesSmart();
            setTimeout(()=>{
                let count = injectCookieSmart(ckStr);
                cookieShow.value = getAllCookieString();
                showMsg(`已清理并注入${count}个Cookie，刷新页面后生效！`);
            },300);
        };
        bar.appendChild(btnSet);

        const btnClose = document.createElement('button');
        btnClose.innerText = "关闭";
        btnClose.style.color = "#888";
        btnClose.style.background = "#f8f8ff";
        btnClose.style.padding = "7px 18px";
        btnClose.style.border = "none";
        btnClose.style.borderRadius = "3px";
        btnClose.style.fontSize = "15px";
        btnClose.onclick = closeUI;
        bar.appendChild(btnClose);

        div.appendChild(bar);

        // 提示消息
        const tip = document.createElement('div');
        tip.id = 'result_baidu_ck';
        tip.style.margin = "10px 0 2px";
        tip.style.color = "#33a853";
        tip.style.fontSize = "13px";
        div.appendChild(tip);

        // ==== 新增：底部"接码API到期批量检测"按钮 ====
        const detectBtn = document.createElement('button');
        detectBtn.innerText = '接码API到期批量检测';
        detectBtn.style.display = "block";
        detectBtn.style.width = "100%";
        detectBtn.style.margin = '22px 0 0 0';
        detectBtn.style.background = "#f9fcff";
        detectBtn.style.border = "1.5px solid #3388ee";
        detectBtn.style.color = "#2177cc";
        detectBtn.style.borderRadius = "6px";
        detectBtn.style.fontWeight = "bold";
        detectBtn.style.padding = "12px";
        detectBtn.style.fontSize = "17px";
        detectBtn.style.cursor = "pointer";
        detectBtn.onmouseenter = ()=>{detectBtn.style.background="#e6f5ff";}
        detectBtn.onmouseleave = ()=>{detectBtn.style.background="#f9fcff";}
        detectBtn.onclick = showApiChecker;
        div.appendChild(detectBtn);

        // ==== 新增：检测导入卡密重复功能按钮 ====
        const dedupBtn = document.createElement('button');
        dedupBtn.innerText = '检测导入卡密重复功能';
        dedupBtn.style.display = "block";
        dedupBtn.style.width = "100%";
        dedupBtn.style.margin = '12px 0 0 0';
        dedupBtn.style.background = "#fff9f9";
        dedupBtn.style.border = "1.5px solid #ff8888";
        dedupBtn.style.color = "#d22";
        dedupBtn.style.borderRadius = "6px";
        dedupBtn.style.fontWeight = "bold";
        dedupBtn.style.padding = "12px";
        dedupBtn.style.fontSize = "17px";
        dedupBtn.style.cursor = "pointer";
        dedupBtn.onmouseenter = ()=>{dedupBtn.style.background="#ffeaea";}
        dedupBtn.onmouseleave = ()=>{dedupBtn.style.background="#fff9f9";}
        dedupBtn.onclick = showDedupTool;
        div.appendChild(dedupBtn);

        document.body.appendChild(mask);
        document.body.appendChild(div);

        function showMsg(msg){
            tip.innerText = msg;
        }
    }

    function closeUI() {
        const e = document.getElementById('huoxing_ck_panel_2024');
        if(e) e.remove();
        const m = document.getElementById('huoxing_ck_mask_2024');
        if(m) m.remove();
    }

    // 获取当前全cookie串
    function getAllCookieString(){
        return document.cookie || '';
    }

    // 一键复制文本到剪贴板
    function copyToClipboard(str){
        if(navigator.clipboard){
            navigator.clipboard.writeText(str);
        } else {
            // 老浏览器降级
            const t = document.createElement("textarea");
            t.value = str;
            document.body.appendChild(t);
            t.select();
            document.execCommand('copy');
            document.body.removeChild(t);
        }
    }

    // 智能注入cookie
    function injectCookieSmart(cookieStr) {
        const arr = cookieStr.split(";").map(x => x.trim()).filter(x => x && x.includes("="));
        let cnt = 0;
        const host = window.location.hostname;
        const idx = host.indexOf(".baidu.com");
        let currentDomain = "";
        if(idx >= 0){
            currentDomain = host.substring(idx - (host.charAt(idx-1)==='.'?1:0));
        } else {
            currentDomain = host;
        }
        for (let kv of arr) {
            let [k, v] = kv.split("=");
            k = k.trim();
            v = v.trim();
            if (k && v !== undefined) {
                document.cookie = `${k}=${v}; path=/; domain=.${host};`;
                if(currentDomain && '.'+currentDomain !== '.'+host){
                    document.cookie = `${k}=${v}; path=/; domain=${currentDomain};`;
                }
                cnt++;
            }
        }
        return cnt;
    }

    // 清空当前域下所有Cookie（主流兼容写法）
    function clearAllCookiesSmart(){
        const cookies = document.cookie ? document.cookie.split(';') : [];
        const host = window.location.hostname;
        const idx = host.indexOf(".baidu.com");
        let currentDomain = "";
        if(idx >= 0){
            currentDomain = host.substring(idx - (host.charAt(idx-1)==='.'?1:0));
        } else {
            currentDomain = host;
        }
        for(let c of cookies){
            let eq = c.indexOf('=');
            if(eq < 0) continue;
            let name = c.substr(0, eq).trim();
            // 当前完整host
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${host};`;
            // .baidu.com 或 tieba.baidu.com
            if(currentDomain && '.'+currentDomain !== '.'+host){
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${currentDomain};`;
            }
        }
    }

    // 快捷键 Alt+Q 唤出主界面
    document.addEventListener('keydown', function(e){
        if(e.altKey && e.key === 'q'){
            e.preventDefault();
            createUI();
        }
    });

    // 页加载自动插悬浮logo
    window.addEventListener('load', ()=>{
        setTimeout(createFloatLogo,600);
    });

    // ============ 接码API终极优化版（全屏，函数封装） ============
    function showApiChecker() {
        if(document.getElementById('api_checker_fullscreen_box')) {
            document.getElementById('api_checker_fullscreen_box').style.display = 'block';
            return;
        }
        // --------- 全屏主界面 ---------
        let fullscreenBox = document.createElement("div");
        fullscreenBox.id = "api_checker_fullscreen_box";
        fullscreenBox.style.display = 'block';

        const filterHtml = `
          <label style="margin-right:12px;"><input type="checkbox" class="filter_check" value="gt35" checked> 超过35天</label>
          <label style="margin-right:12px;"><input type="checkbox" class="filter_check" value="lt35" checked> 小于35天</label>
          <label style="margin-right:12px;"><input type="checkbox" class="filter_check" value="expired" checked> 已经过期</label>
        `;

        fullscreenBox.innerHTML = `
        <div id="api_checker_close" style="position:absolute;top:12px;right:24px;font-size:30px;color:#888;cursor:pointer;z-index:100001;">×</div>
        <div style="display:flex;height:100vh;width:100vw;">
          <!-- 左栏 -->
          <div style="flex:1.1;padding:36px 20px 20px 36px;background:#f5f6fa;box-sizing:border-box;display:flex;flex-direction:column;">
            <textarea id="my_links" rows="18" style="width:100%;resize:vertical;min-height:160px;max-height:60vh;font-size:16px;" placeholder="粘贴你的多行文本"></textarea>
            <div id="links_count_info" style="margin:10px 0 4px 2px;color:#666;">共 0 个账号</div>
            <button id="check_time_btn" style="padding:7px 18px;border-radius:6px;background:#3271ae;color:#fff;font-size:17px;border:none;cursor:pointer;margin-bottom:6px;margin-top:6px;">检测时间</button>
            <div style="font-size:13px;line-height:1.6;color:#aaa;">
              请将待检测的账号信息粘贴于此，一行一个。支持----分隔的长行，会自动提取每行中的接口链接。
            </div>
          </div>
          <!-- 右栏 -->
          <div style="flex:2.5;background:#fff;padding:36px 32px 20px 16px;overflow-y:auto;display:flex;flex-direction:column;">
            <div style="margin-bottom:14px;">
               <span style="font-weight:bold;font-size:17px;color:#555">筛选：</span>
               <span id="result_filter_area">${filterHtml}</span>
               <button id="copy_filtered_btn" style="margin-left:28px;padding:6px 15px 6px 11px;border-radius:5px;background:#3271ae;color:#fff;font-size:15px;border:none;cursor:pointer;"><span style="font-size:15px">📋</span> 批量复制筛选结果</button>
            </div>
            <div id="result_box" style="font-size:16px;flex:1;"></div>
            <div style="margin:14px 0 0 0;text-align:right">
                <button id="copy_all_btn" style="padding:7px 17px 7px 13px;border-radius:7px;background:#2ecc71;color:#fff;font-size:16px;border:none;cursor:pointer;"><span style="font-size:17px">📋</span> 一键复制全部原始行</button>
            </div>
          </div>
        </div>
        `;
        Object.assign(fullscreenBox.style, {
            position:'fixed', left:'0', top:'0', width:'100vw', height:'100vh',
            background:'#2228f019', zIndex:100000, transition:'all .3s'
        });
        document.body.appendChild(fullscreenBox);

        // 显示/隐藏逻辑
        document.getElementById('api_checker_close').onclick = function() { fullscreenBox.style.display = 'none'; };

        // 动态统计数量
        function updateCountInfo() {
            let value = document.getElementById('my_links').value.trim();
            let lines = value ? value.split('\n') : [];
            let count = 0;
            for(let line of lines){
                if(extractUrl(line)) count++;
            }
            document.getElementById('links_count_info').textContent = `共 ${count} 个账号`;
        }
        document.getElementById('my_links').addEventListener('input', updateCountInfo);

        // --------- 解析URL函数 ---------
        function extractUrl(row){
            let match = row.match(/https?:\/\/.*?(?=;|,|\s|----|$)/i);
            return match ? match[0] : null;
        }

        function extractName(row){
            const reg = /^([^-\s]{1,40})----[^-]+----[^-]+----https?:\/\//;
            let m = row.match(reg);
            return m ? m[1] : '';
        }

        let resultsArr = [];

        document.getElementById('check_time_btn').onclick = function(){
            let rows = document.getElementById('my_links').value.trim().split('\n');
            let resultBox = document.getElementById('result_box');
            resultBox.innerHTML = '';
            resultsArr = [];
            let total = 0;

            let urlRows = [];
            for(let row of rows) {
                let url = extractUrl(row);
                if(url) urlRows.push({row,url});
            }
            total = urlRows.length;
            updateCountInfo();

            if(total === 0) {
                resultBox.innerHTML = `<div style='color:#aa3434'>未识别到任何有效链接！</div>`;
                return;
            }

            resultsArr.length = 0;

            urlRows.forEach(({row,url},idx)=>{
                let entryDiv = document.createElement('div');
                entryDiv.style.marginBottom = '14px';
                entryDiv.style.padding = '9px 11px 10px 11px';
                entryDiv.style.border = '1px solid #eee';
                entryDiv.style.borderRadius = '7px';
                entryDiv.style.background = idx%2===0?'#fafcff':'#f5f7fd';
                entryDiv.style.position = 'relative';
                resultBox.appendChild(entryDiv);

                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    timeout:15000,
                    onload: function(response) {
                        let dateMatch = response.responseText.match(/\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2})?/);
                        let name = extractName(row);
                        let statusType = "", dayDiff = null, stateTxt='', color='', bg='';
                        if(dateMatch){
                            let dateStr = dateMatch[0];
                            let date;
                            if(dateStr.length > 10){
                                date = new Date(dateStr.replace(/-/g,'/'));
                            }else{
                                date = new Date(dateStr.replace(/-/g,'/'));
                            }
                            if(isNaN(date.getTime())){
                                entryDiv.innerHTML = `
                                    ${name ? `<span style="font-size:17px;color:#2980b9;font-weight:bold;padding-right:10px;">${name}</span>` : ''}
                                    <a href="${url}" target="_blank" style="color:#3271ae;text-decoration:underline">${url}</a><br>
                                    <span style="color:#e67e22;line-height:1.7">返回内容：${response.responseText}<span style="color:#c0392b;">（无法解析日期）</span></span>
                                `;
                                addCopyBtn(entryDiv, row);
                                resultsArr.push({
                                    row, name, url, date:null, dayDiff:null, statusType:'nodate', entryDiv
                                });
                                return;
                            }
                            let now = new Date();
                            dayDiff = Math.floor((date.setHours(0,0,0,0) - now.setHours(0,0,0,0))/(1000*60*60*24));
                            if(dayDiff < 0){
                                statusType = "expired";
                                stateTxt = `<span style="color:#c0392b;font-weight:bold;">已过期${-dayDiff}天</span>`;
                                color = "#c0392b";
                                bg = "#ffeae8";
                            } else if(dayDiff < 35){
                                statusType = "lt35";
                                stateTxt = `<span style="color:#f39c12;font-weight:bold;">剩余${dayDiff}天</span>`;
                                color = "#f39c12";
                                bg = "#fffaea";
                            } else {
                                statusType = "gt35";
                                stateTxt = `<span style="color:#27ae60;font-weight:bold;">剩余${dayDiff}天</span>`;
                                color = "#27ae60";
                                bg = "#eafded";
                            }
                            entryDiv.style.background = bg;
                            entryDiv.innerHTML = `
                                ${name ? `<span style="font-size:17px;color:#2980b9;font-weight:bold;padding-right:10px;">${name}</span>` : ''}
                                <a href="${url}" target="_blank" style="color:#3271ae;text-decoration:underline">${url}</a><br>
                                返回时间：<span style="color:${color};font-weight:bold;">${dateStr}</span> (${stateTxt})
                            `;
                            addCopyBtn(entryDiv, row);

                            resultsArr.push({
                                row, name, url, date: dateStr, dayDiff, statusType, entryDiv
                            });
                        }else{
                            entryDiv.innerHTML = `
                                ${name ? `<span style="font-size:17px;color:#2980b9;font-weight:bold;padding-right:10px;">${name}</span>` : ''}
                                <a href="${url}" target="_blank" style="color:#3271ae;text-decoration:underline">${url}</a><br>
                                <span style="color:#e67e22;line-height:1.7">返回内容：${response.responseText}<span style="color:#c0392b;">（未找到日期）</span></span>
                            `;
                            addCopyBtn(entryDiv, row);

                            resultsArr.push({
                                row, name, url, date:null, dayDiff:null, statusType:'nodate', entryDiv
                            });
                        }
                    },
                    ontimeout: function(){
                        entryDiv.innerHTML = `${name ? `<span style="font-size:17px;color:#2980b9;font-weight:bold;padding-right:10px;">${name}</span>` : ''}
                            <a href="${url}" target="_blank" style="color:#3271ae;text-decoration:underline">${url}</a>
                            <div style="color:#c0392b;">请求超时</div>`;
                        addCopyBtn(entryDiv, row);

                        resultsArr.push({
                            row, name, url, date:null, dayDiff:null, statusType:'nodate', entryDiv
                        });
                    },
                    onerror: function(){
                        entryDiv.innerHTML = `${name ? `<span style="font-size:17px;color:#2980b9;font-weight:bold;padding-right:10px;">${name}</span>` : ''}
                            <a href="${url}" target="_blank" style="color:#3271ae;text-decoration:underline">${url}</a>
                            <div style="color:#c0392b;">请求失败</div>`;
                        addCopyBtn(entryDiv, row);

                        resultsArr.push({
                            row, name, url, date:null, dayDiff:null, statusType:'nodate', entryDiv
                        });
                    }
                });
            });
        };

        function addCopyBtn(div, row) {
            let btn = document.createElement('button');
            btn.textContent = '复制';
            Object.assign(btn.style, {
                position:'absolute',top:'8px',right:'12px',padding:'2px 10px',border:'1px solid #bbb',borderRadius:'5px',background:'#f7f7fc',color:'#444',fontSize:'14px',cursor:'pointer'
            });
            btn.onclick = function(e){
                e.stopPropagation();
                e.preventDefault();
                if(typeof GM_setClipboard === 'function'){
                    GM_setClipboard(row);
                }else{
                    copyToClipboardFallback(row);
                }
                btn.textContent = '已复制!';
                setTimeout(()=>{btn.textContent = '复制'},1100);
            };
            div.appendChild(btn);
        }

        function copyToClipboardFallback(text) {
            let ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
        }

        document.getElementById('copy_filtered_btn').onclick = function(){
            let checked = Array.from(document.querySelectorAll('.filter_check')).filter(el=>el.checked).map(el=>el.value);
            if(resultsArr.length === 0){
                alert('请先检测数据');
                return;
            }
            let outLines = [];
            for(let item of resultsArr){
                if(checked.includes(item.statusType)){
                    outLines.push(item.row);
                }
            }
            if(outLines.length === 0){
                alert('没有符合条件的数据');
                return;
            }
            let content = outLines.join('\n');
            if(typeof GM_setClipboard === 'function'){
                GM_setClipboard(content);
            }else{
                copyToClipboardFallback(content);
            }
            this.textContent = "已复制!";
            setTimeout(()=>{this.textContent='📋 批量复制筛选结果'},1200);
        };

        document.getElementById('copy_all_btn').onclick = function(){
            let val = document.getElementById('my_links').value.trim();
            if(val){
                if(typeof GM_setClipboard === 'function'){
                    GM_setClipboard(val);
                }else{
                    copyToClipboardFallback(val);
                }
                this.textContent = '已复制!';
                setTimeout(()=>{this.textContent='📋 一键复制全部原始行'},1300);
            }
        };
        document.getElementById('result_filter_area').onclick = function(e){
            if(e.target.classList.contains('filter_check')){
                // 可扩展自动刷新
            }
        };
    }

    // ========== 账号去重小工具弹窗 ==========
    function showDedupTool() {
        if(document.getElementById('accountDedupTool')) return;
        const FIELDS = [
            {key:'account', name:'账号'},
            {key:'password', name:'密码'},
            {key:'card',    name:'卡密'},
            {key:'api',     name:'API'},
            {key:'ck',      name:'CK'}
        ];
        // 主面板
        const overlay = document.createElement('div');
        overlay.id = 'accountDedupTool';
        Object.assign(overlay.style, {
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: '#fff',
            zIndex: 2147483648,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        });
        // 标题和关闭按钮
        const header = document.createElement('div');
        header.innerHTML = '<strong style="font-size:22px;color:#333;">账号去重小工具</strong>';
        header.style.marginBottom = '10px';
        const closeBtn = document.createElement('span');
        closeBtn.textContent = '✖';
        Object.assign(closeBtn.style, {
            position: 'absolute',
            top: '20px',
            right: '40px',
            fontSize: '24px',
            color: '#888',
            cursor: 'pointer',
            zIndex: 2147483649
        });
        closeBtn.onclick = () => overlay.remove();
        overlay.appendChild(closeBtn);
        // 勾选区域
        const fieldSelectArea = document.createElement('div');
        fieldSelectArea.style.margin = '0 0 16px 0';
        fieldSelectArea.style.textAlign = 'left';
        fieldSelectArea.style.width = "80vw";
        fieldSelectArea.style.maxWidth = "1200px";
        let fieldCheckboxes = {};
        FIELDS.forEach(field=>{
            const label = document.createElement('label');
            label.style.marginRight = '24px';
            const cb = document.createElement('input');
            cb.type = "checkbox";
            cb.checked = true;
            cb.value = field.key;
            fieldCheckboxes[field.key] = cb;
            label.appendChild(cb);
            label.appendChild(document.createTextNode(' ' + field.name));
            fieldSelectArea.appendChild(label);
        });
        // 输入包裹区
        const wrap = document.createElement('div');
        wrap.style.position = 'relative';
        wrap.style.width = '80vw';
        wrap.style.maxWidth = '1200px';
        wrap.style.height = '55vh';
        wrap.style.marginBottom = '18px';
        // textarea 显示输入
        const textarea = document.createElement('textarea');
        Object.assign(textarea.style, {
            width: '100%',
            height: '100%',
            fontSize: '17px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            padding: '10px',
            background: '#fff',
            color: '#222',
            resize: 'none',
            outline: 'none',
            overflowY: 'auto',
            boxSizing: 'border-box',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 2,
            textAlign: 'left'
        });
        textarea.setAttribute('placeholder', '一行一个，如：22msId3y113na----jt522.qrj----cjn03iduyi1clomk----https://abg.yunqi6.com/new_get_code##JBBKM##cjn03iduyi1clomk----');
        // 预览（红字显示第二次及以后）
        const previewDiv = document.createElement('div');
        Object.assign(previewDiv.style, {
            width: '100%',
            height: '100%',
            fontSize: '17px',
            padding: '10px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            background: '#fff',
            color: '#222',
            borderRadius: '6px',
            border: '1px solid #ccc',
            boxSizing: 'border-box',
            pointerEvents: 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
            textAlign: 'left',
            overflowY: 'auto',
        });
        wrap.appendChild(previewDiv);
        wrap.appendChild(textarea);
        // 字段提取，为一条数据生成数组
        function splitFields(line) {
            let arr = line.split('----');
            while(arr.length<FIELDS.length) arr.push('');
            if(arr.length>FIELDS.length){
                arr[FIELDS.length-1] = arr.slice(FIELDS.length-1).join('----');
                arr = arr.slice(0,FIELDS.length);
            }
            return arr;
        }
        // 把fields数组根据勾选重组为字符串（去掉两头多余----）
        function joinFields(arr, selectedArr) {
            let out = [];
            for(let i=0;i<FIELDS.length;++i){
                if(selectedArr[i]) out.push((arr[i]||'').trim());
            }
            while(out.length && !out[out.length-1]) out.pop();
            return out.join('----');
        }
        // 获取当前勾选的字段索引列表
        function getSelectedFlags() {
            return FIELDS.map(f=>fieldCheckboxes[f.key].checked);
        }
        // 通用处理函数
        function processLines(rawText) {
            const lines = rawText.split('\n');
            let accCount = new Map();
            let accFirstIdx = new Map();
            let trimmedFieldArrs = [];
            for(let i=0; i<lines.length; ++i){
                let line = lines[i].trim();
                if(!line) { trimmedFieldArrs.push(null); continue; }
                let fields = splitFields(line);
                trimmedFieldArrs.push(fields);
                let acc = (fields[0]||'').trim();
                accCount.set(acc, (accCount.get(acc)||0)+1);
                if(!accFirstIdx.has(acc)) accFirstIdx.set(acc,i);
            }
            return {lines, accCount, accFirstIdx, trimmedFieldArrs};
        }
        // 让textarea滚动时预览区同步
        textarea.addEventListener('scroll', ()=>{
            previewDiv.scrollTop = textarea.scrollTop;
            previewDiv.scrollLeft = textarea.scrollLeft;
        });
        // 实时渲染高亮重复行（第二次及以后出现的账号，文字变红）, 并只显示勾选字段
        function renderHighlight() {
            previewDiv.style.height = textarea.clientHeight+"px";
            previewDiv.style.width = textarea.clientWidth+"px";
            const text = textarea.value;
            const selectedFlags = getSelectedFlags();
            const {lines, accCount, trimmedFieldArrs} = processLines(text);
            let accSeen = new Map();
            let html = '';
            for(let i=0;i<lines.length;++i){
                let line = lines[i];
                if(!trimmedFieldArrs[i]) {
                    html += '<br/>';
                    continue;
                }
                let fields = trimmedFieldArrs[i];
                let acc = (fields[0]||'').trim();
                let showLine = joinFields(fields,selectedFlags);
                if(!accSeen.has(acc)) {
                    accSeen.set(acc,1);
                    html += `<span>${escapeHtml(showLine)}</span><br/>`;
                } else {
                    html += `<span style="color:#ff3232">${escapeHtml(showLine)}</span><br/>`;
                }
            }
            html = html.replace(/(<br\/>)+$/,'<br/>');
            previewDiv.innerHTML = html;
        }
        textarea.addEventListener('input',renderHighlight);
        Object.values(fieldCheckboxes).forEach(cb=>cb.onchange=renderHighlight);
        setTimeout(renderHighlight,100);
        // 四个按钮
        const btnCopyUnique = makeButton('复制不重复行', '#388e3c');
        btnCopyUnique.onclick = () => {
            const selectedFlags = getSelectedFlags();
            const {lines, accFirstIdx, trimmedFieldArrs} = processLines(textarea.value);
            let res = [];
            for(let [acc, idx] of accFirstIdx.entries()){
                if(trimmedFieldArrs[idx]){
                    let showLine = joinFields(trimmedFieldArrs[idx], selectedFlags);
                    if(showLine) res.push(showLine);
                }
            }
            if(res.length===0){alert('没有可复制的数据');return;}
            if(typeof GM_setClipboard === 'function') GM_setClipboard(res.join('\n'));
            else copyToClipboard(res.join('\n'));
            alert(`已复制${res.length}行（每个账号只留第一次出现）`);
        };
        const btnCopyRepeat = makeButton('复制重复行', '#fbc02d');
        btnCopyRepeat.onclick = () => {
            const selectedFlags = getSelectedFlags();
            const {lines, trimmedFieldArrs} = processLines(textarea.value);
            let accSeen = new Map(), repeatRows = [];
            for(let i=0;i<lines.length;++i){
                if(!trimmedFieldArrs[i]) continue;
                let fields = trimmedFieldArrs[i];
                let acc = (fields[0]||'').trim();
                if(!accSeen.has(acc)) {
                    accSeen.set(acc,1);
                } else {
                    let showLine = joinFields(fields, selectedFlags);
                    if(showLine) repeatRows.push(showLine);
                }
            }
            if(repeatRows.length===0){alert('没有重复行');return;}
            if(typeof GM_setClipboard === 'function') GM_setClipboard(repeatRows.join('\n'));
            else copyToClipboard(repeatRows.join('\n'));
            alert(`已复制${repeatRows.length}条重复行（只包含第2次及以后，且仅勾选字段）`);
        };
        const btnRemoveUnique = makeButton('清理不重复行', '#e53935');
        btnRemoveUnique.onclick = () => {
            const selectedFlags = getSelectedFlags();
            const {accCount, accFirstIdx, trimmedFieldArrs} = processLines(textarea.value);
            let res = [];
            for(let [acc, idx] of accFirstIdx.entries()){
                if(accCount.get(acc) > 1 && trimmedFieldArrs[idx]){
                    let showLine = joinFields(trimmedFieldArrs[idx], selectedFlags);
                    if(showLine) res.push(showLine);
                }
            }
            textarea.value = res.join('\n');
            renderHighlight();
            alert(`已清理，仅保留${res.length}个重复账号的第一行（单独账号已全部删除），且仅保留勾选字段`);
        };
        const btnRemoveRepeat = makeButton('删除重复行', '#1976d2');
        btnRemoveRepeat.onclick = () => {
            const selectedFlags = getSelectedFlags();
            const {lines, trimmedFieldArrs} = processLines(textarea.value);
            let accSeen = new Map(), keptRows = [];
            for(let i=0;i<lines.length;++i){
                if(!trimmedFieldArrs[i]) continue;
                let fields = trimmedFieldArrs[i];
                let acc = (fields[0]||'').trim();
                if(!accSeen.has(acc)) {
                    accSeen.set(acc,1);
                    let showLine = joinFields(fields, selectedFlags);
                    if(showLine) keptRows.push(showLine);
                }
            }
            textarea.value = keptRows.join('\n');
            renderHighlight();
            alert(`已删除所有重复行，只保留每个账号第一次出现和唯一账号，且仅保留勾选字段`);
        };
        function makeButton(txt, bg) {
            const btn = document.createElement('button');
            btn.textContent = txt;
            Object.assign(btn.style, {
                margin: '0 14px 0 0',
                padding: '12px 22px',
                fontSize: '16px',
                border: 'none',
                borderRadius: '5px',
                background: bg || '#2e7d32',
                color: '#fff',
                cursor: 'pointer'
            });
            btn.onmouseover = () => btn.style.background='#1565c0';
            btn.onmouseleave = () => btn.style.background=bg||'#2e7d32';
            return btn;
        }
        function escapeHtml(str) {
            return str.replace(/[&<>\"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
        }
        const btnBox = document.createElement('div');
        btnBox.appendChild(btnCopyUnique);
        btnBox.appendChild(btnCopyRepeat);
        btnBox.appendChild(btnRemoveUnique);
        btnBox.appendChild(btnRemoveRepeat);
        btnBox.style.margin = '25px 0 0 0';
        overlay.appendChild(header);
        overlay.appendChild(fieldSelectArea);
        overlay.appendChild(wrap);
        overlay.appendChild(btnBox);
        document.body.appendChild(overlay);
        window.addEventListener('keydown', _escClose);
        function _escClose(e){
            if(e.key==="Escape"){
                try{overlay.remove()}catch(_){}
                window.removeEventListener('keydown',_escClose)
            }
        }
    }

})();

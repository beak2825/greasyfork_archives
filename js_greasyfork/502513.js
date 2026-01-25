// ==UserScript==
// @name         组卷网学科网试卷处理下载打印
// @version      2.3.0
// @description  【2025/01/25】✨ 自动处理组卷网/学科网试卷，支持答案分离、字体选择、图片加载完成后打印
// @author       nuym, WorkingFishQ
// @match        https://zujuan.xkw.com/*
// @icon         https://zujuan.xkw.com/favicon.ico
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://fastly.jsdelivr.net/npm/sweetalert2@11
// @license      GNU Affero General Public License v3.0
// @namespace https://github.com/bzyzh
// @downloadURL https://update.greasyfork.org/scripts/502513/%E7%BB%84%E5%8D%B7%E7%BD%91%E5%AD%A6%E7%A7%91%E7%BD%91%E8%AF%95%E5%8D%B7%E5%A4%84%E7%90%86%E4%B8%8B%E8%BD%BD%E6%89%93%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/502513/%E7%BB%84%E5%8D%B7%E7%BD%91%E5%AD%A6%E7%A7%91%E7%BD%91%E8%AF%95%E5%8D%B7%E5%A4%84%E7%90%86%E4%B8%8B%E8%BD%BD%E6%89%93%E5%8D%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('✅ 程序加载成功');

    /* =========================
     * 用户信息获取
     * ========================= */
    const usernameElement = document.querySelector('.user-nickname');
    const username = usernameElement ? usernameElement.innerText : '未知用户';

    console.log("-----------------------------------------------");
    console.log("🔹 版本：2.3.0");
    console.log("🔹 作者：nuym 、WorkingFishT");
    console.log("🔹 开源地址：https://github.com/bzyzh/xkw-zujuan-script");
    console.log("🔹 组卷网用户：%s", username);
    console.log("-----------------------------------------------");

    /* =========================
     * 字体配置（新增）
     * ========================= */
    const FontConfig = {
        // 可选值：
        // 'original'  → 使用网站原始字体（默认）
        // 'custom'    → 使用自定义字体
        mode: 'original',

        // 当 mode = 'custom' 时生效
        customFontFamily: `
            "Microsoft YaHei",
            "PingFang SC",
            "Noto Sans SC",
            Arial,
            sans-serif
        `
    };

    function applyFont() {
        if (FontConfig.mode === 'original') {
            console.log("🔤 使用网站原始字体");
            return;
        }

        const style = document.createElement('style');
        style.innerHTML = `
            body, * {
                font-family: ${FontConfig.customFontFamily} !important;
            }
        `;
        document.head.appendChild(style);
        console.log("🔤 已启用自定义字体");
    }

    applyFont();

    /* =========================
     * 去广告功能
     * ========================= */
    const adElement = document.querySelector(".aside-pop.activity-btn");
    if (adElement) {
        adElement.remove();
        console.log("✅ 去除广告成功");
    }

   // 删除 AI 广告
   const aiAdElement = document.querySelector(".ai-entry.fixed");
    if (aiAdElement) {
        aiAdElement.remove();
        console.log("✅ 去除AI广告成功");
    }

    /* =========================
     * 签到功能
     * ========================= */
    function checkIn() {
        const signInBtn = document.querySelector('a.sign-in-btn');
        const daySignInBtn = document.querySelector('a.day-sign-in');

        if (signInBtn) signInBtn.click();
        if (daySignInBtn) daySignInBtn.click();
    }

    function canCheckIn() {
        const signedInLink = document.querySelector(
            '.user-assets-box a.assets-method[href="/score_task/"]'
        );
        return !signedInLink || signedInLink.textContent.trim() !== '已签到';
    }

    function signInLogic() {
        if (canCheckIn()) {
            checkIn();
        }
    }

    /* =========================
     * 调试 / 启动逻辑
     * ========================= */
    function debug() {
        console.log("🔍 是否可签到：", canCheckIn());
        signInLogic();
    }

    window.addEventListener('load', debug, false);

    /* ==================== 插入样式 ==================== */
    const style = document.createElement('style');
    style.textContent = `
        #zujuanjs-reformatted-content { background: #fff; }
        .zujuanjs-question { margin-bottom: 12px; padding: 10px; }
        .zujuanjs-section-title {
            font-size: 1.5em;
            font-weight: bold;
            margin: 20px 0 10px;
        }
        #page-title {
            text-align: center;
            font-size: 2em;
            font-weight: bold;
            margin: 20px 0;
        }
        .font-preview {
            border: 1px solid #ddd;
            padding: 10px;
            margin-top: 10px;
        }
    `;
    document.head.appendChild(style);

    /* ==================== 创建打印按钮 ==================== */
    const target =
        document.querySelector('.link-box') ||
        document.querySelector('.btn-box.clearfix');

    if (!target) {
        console.error('❌ 未找到按钮容器');
        return;
    }

    const printBtn = document.createElement('a');
    printBtn.className = 'btnTestDown link-item anchor-font3';
    printBtn.innerHTML = `<i class="icon icon-download1"></i><span>打印试卷</span>`;
    target.appendChild(printBtn);

    printBtn.onclick = showPrintDialog;

    /* ==================== 打印设置弹窗 ==================== */
    function showPrintDialog() {
        const savedFont = GM_getValue('questionFont', 'SimSun');
        const savedSize = GM_getValue('questionSize', '14px');

        Swal.fire({
            title: '打印设置',
            width: 600,
            html: `
                <div>
                    <h4>打印内容</h4>
                    <label><input type="radio" name="opt" value="q" checked> 仅试题</label><br>
                    <label><input type="radio" name="opt" value="qa"> 试题 + 答案</label><br>
                    <label><input type="radio" name="opt" value="qe"> 答案移至末尾</label><br>
                    <label><input type="radio" name="opt" value="a"> 仅答案</label>

                    <hr>

                    <h4>题目字体</h4>
                    <select id="font-select" class="swal2-select">
                        <option value="SimSun">宋体</option>
                        <option value="SimHei">黑体</option>
                        <option value="Microsoft YaHei">微软雅黑</option>
                        <option value="KaiTi">楷体</option>
                        <option value="FangSong">仿宋</option>
                        <option value="Times New Roman">Times New Roman</option>
                    </select>

                    <select id="size-select" class="swal2-select">
                        <option value="12px">12px</option>
                        <option value="14px">14px</option>
                        <option value="16px">16px</option>
                        <option value="18px">18px</option>
                    </select>

                    <div id="font-preview" class="font-preview">
                        字体预览：函数 y = ax² + bx + c
                    </div>
                </div>
            `,
            confirmButtonText: '开始打印',
            showCancelButton: true,
            didOpen: () => {
                const fontSel = document.getElementById('font-select');
                const sizeSel = document.getElementById('size-select');
                const preview = document.getElementById('font-preview');

                fontSel.value = savedFont;
                sizeSel.value = savedSize;

                const updatePreview = () => {
                    preview.style.fontFamily = fontSel.value;
                    preview.style.fontSize = sizeSel.value;
                };

                fontSel.onchange = updatePreview;
                sizeSel.onchange = updatePreview;
                updatePreview();
            },
            preConfirm: () => {
                const opt = document.querySelector('input[name="opt"]:checked').value;
                const font = document.getElementById('font-select').value;
                const size = document.getElementById('size-select').value;

                GM_setValue('questionFont', font);
                GM_setValue('questionSize', size);

                return { opt };
            }
        }).then(async res => {
            if (!res.isConfirmed) return;

            const opt = res.value.opt;
            const includeQ = opt !== 'a';
            const includeA = opt === 'qa' || opt === 'a';
            const atEnd = opt === 'qe';

            if (includeA || atEnd) {
                clickShowAnswersButton();
                await waitForAnswerImagesLoaded();
            }

            performPrint(includeQ, includeA, atEnd);
        });
    }

    /* ==================== 等待答案图片加载 ==================== */
    function waitForAnswerImagesLoaded(timeout = 15000) {
        return new Promise(resolve => {
            const start = Date.now();

            function check() {
                const imgs = [...document.querySelectorAll('img')]
                    .filter(i => i.src.includes('getAnswerAndParse'));

                if (!imgs.length && Date.now() - start < timeout) {
                    return requestAnimationFrame(check);
                }

                if (imgs.every(i => i.complete)) {
                    console.log(`✅ 答案图片加载完成（${imgs.length} 张）`);
                    return resolve();
                }

                if (Date.now() - start > timeout) {
                    console.warn('⚠️ 图片加载超时，继续打印');
                    return resolve();
                }

                requestAnimationFrame(check);
            }

            check();
        });
    }

    /* ==================== 执行打印 ==================== */
    function performPrint(includeQ, includeA, atEnd) {
        const body = buildContent(includeQ, includeA, atEnd);
        document.body.innerHTML = '';
        document.body.appendChild(body);
        window.print();
    }

    function buildContent(includeQ, includeA, atEnd) {
        const root = document.createElement('div');
        root.id = 'zujuanjs-reformatted-content';

        const font = GM_getValue('questionFont');
        const size = GM_getValue('questionSize');

        const answers = [];

        document.querySelectorAll('.sec-title, .tk-quest-item.quesroot')
            .forEach(node => {
                if (node.classList.contains('sec-title')) {
                    const span = node.querySelector('span');
                    if (span) {
                        const t = document.createElement('div');
                        t.className = 'zujuanjs-section-title';
                        t.textContent = span.textContent.trim();
                        root.appendChild(t);
                    }
                    return;
                }

                const q = document.createElement('div');
                q.className = 'zujuanjs-question';
                q.style.fontFamily = font;
                q.style.fontSize = size;

                const wrap = node.querySelector('.wrapper.quesdiv');
                if (!wrap) return;

                if (includeQ) {
                    const cnt = wrap.querySelector('.exam-item__cnt');
                    if (cnt) q.appendChild(cnt.cloneNode(true));
                }

                const opt = wrap.querySelector('.exam-item__opt');
                if (opt) {
                    opt.querySelector('.knowledge-box')?.remove();
                    if (includeA) q.appendChild(opt.cloneNode(true));
                    else if (atEnd) answers.push(opt.cloneNode(true));
                }

                root.appendChild(q);
            });

        if (atEnd && answers.length) {
            const t = document.createElement('div');
            t.className = 'zujuanjs-section-title';
            t.textContent = '答案与解析';
            root.appendChild(t);
            answers.forEach(a => root.appendChild(a));
        }

        return root;
    }

    /* ==================== 展开答案 ==================== */
    function clickShowAnswersButton() {
        const cb = document.querySelector('#isshowAnswer');
        if (cb && !cb.checked) {
            document.querySelector('label[for="isshowAnswer"]')?.click();
        }

        const old = document.querySelector('.tklabel-checkbox.show-answer input');
        if (old && !old.checked) {
            old.closest('label')?.click();
        }
    }

})();

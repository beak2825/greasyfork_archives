// ==UserScript==
// @name         六访辅助工具
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  适配SPA页面，首次打开、跳转后无需刷新，自动插入填写按钮并完成全部描述填写操作。
// @author       dengly
// @license      MIT
// @match        http://172.12.0.96:31465/liufangReport/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536722/%E5%85%AD%E8%AE%BF%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/536722/%E5%85%AD%E8%AE%BF%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const taskList = [
        { buttonText: "仅我司金融渠道", sectionTitle: "渠道单一性", inputText: "该司主推我司金融产品，其他合作银行包括邮储/中信等银行，业务占比1/3以上。" },
        { buttonText: "仅汽车销售/金融业务", sectionTitle: "其他经营业务", inputText: "该司仅经营奇瑞品牌业务；暂无经营其他品牌。" },
        { buttonText: "经营无异常", sectionTitle: "经营连续性", inputText: "暂未发现工资代发异常/投诉等经营无异常情况。" },
        { buttonText: "合规经营", sectionTitle: "合规经营", inputText: "该司人员稳定，经营合规、有专人负责消保处置工作。" },
        { buttonText: "风险管理贯穿业务全流程，风险数据监控细化至业务人员及渠道，提前预警处理", sectionTitle: "风险管理", inputText: "该司风险能力尚可，暂未发现风险事件，由信贷专员管理业务风险。" },
        { buttonText: "有初审且内容完整、全面", sectionTitle: "客户初审", inputText: "有销售经理进行客户初审，内容完整全面。" },
        { buttonText: "零售贷款客户明细台账", sectionTitle: "业务台账检查", inputText: "由信贷专员管理客户台账，客户台账较为详细，暂无异常。" },
        { buttonText: "放款归档资料及时归档", sectionTitle: "档案管理", inputText: "由信贷专员管理资料归档且及时。" },
        { buttonText: "已检查，信贷专员子账号为本人使用", sectionTitle: "子账号管理", inputText: "该店子账号为本人使用，暂无异常。" },
        { buttonText: "总经理", sectionTitle: "沟通对象", inputText: "与总经理沟通，重点围绕1季度金融活动开展，引导销售经理推荐我司至惠贷/置换贷产品，关注近期风险事件。" },
        { buttonText: "近期无异常且无人员变动", sectionTitle: "组织架构人员", inputText: "员工较为稳定，暂未发现其他异常情况。" },
        { buttonText: "已沟通，已制定达成渗透率目标的可行性具体措施", sectionTitle: "业务提升", inputText: "已与该店店总陈仁保沟通，结合我司展厅贷款要求，制定渗透率目标至50%" },
        { buttonText: "合作商绩效考核内容全面", sectionTitle: "绩效管理", inputText: "该店已制定含有金融考核的绩效考核内容。" },
        { buttonText: "近阶段业务开拓重点方向明确", sectionTitle: "经营方针", inputText: "该店近期业务方面明确，主要通过金融政策提升单笔利润，包装零首付等产品。" },
        { buttonText: "对信贷专员进行能力评估，并反馈其上级人员", sectionTitle: "核心岗位招聘", inputText: "该店金融专员能力达标，并已向店总进行告知" },
        { buttonText: "了解并向合作商分析对比竞品政策优劣势", sectionTitle: "竞品政策", inputText: "了解竞品政策，并分析竞品政策优劣势，该店主要与建行合作，5年起产品，总费率25返15，满2年还款无违约金。" },
        { buttonText: "主推奇瑞汽金产品、开口率达到100%，销售流程中涵盖奇瑞汽金产品介绍内容", sectionTitle: "业务人员", inputText: "当前主推其他金融渠道产品，金融开口率普遍不足。" },
        { buttonText: "具备产品包装能力，针对客户信息开展初审、系统操作熟练", sectionTitle: "信贷专员", inputText: "该司销售人员具备产品包装能力及系统操作熟练。" },
        { buttonText: "已提出", sectionTitle: "业务改善建议", inputText: "适当放款审批尺度，提高审批通过率，恢复高融政策。" },
        { buttonText: "常规培训-产品政策", sectionTitle: "培训内容（多选）", inputText: "主要培训内容为产品包装、系统操作、近期风险案列等内容" },
        { buttonText: "未走访", sectionTitle: null, inputText: null }
    ];

    function createStartButton() {
        if (document.getElementById("autofill-btn")) return;

        const btn = document.createElement("div");
        btn.id = "autofill-btn";
        btn.innerHTML = `
            <button style="padding: 8px 14px; background-color: #409EFF; color: white; border: none; border-radius: 6px; cursor: pointer;">
                🚀 点击开始自动填写
            </button>
            <span id="close-btn" style="margin-left:10px; cursor:pointer; color:#666;">✖</span>
        `;
        Object.assign(btn.style, {
            position: "fixed",
            top: "20px",
            right: "20px",
            background: "#fff",
            zIndex: 9999,
            padding: "8px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center"
        });

        document.body.appendChild(btn);

        btn.querySelector("button").onclick = () => {
            runAllTasks();
            btn.querySelector("button").innerText = "✅ 已完成填写（3秒后自动关闭）";
            btn.querySelector("button").style.backgroundColor = "#ccc";
            setTimeout(() => btn.remove(), 3000);
        };

        btn.querySelector("#close-btn").onclick = () => btn.remove();
    }

    function runAllTasks() {
        taskList.forEach(({ buttonText, sectionTitle, inputText }) => {
            try {
                const buttonSpan = Array.from(document.querySelectorAll('span.el-radio__label'))
                    .find(el => el.textContent.trim() === buttonText);
                if (buttonSpan) buttonSpan.click();

                if (sectionTitle && inputText) {
                    const sectionHeader = Array.from(document.querySelectorAll('.form-section-item-header'))
                        .find(el => el.innerText.includes(sectionTitle));
                    if (sectionHeader) {
                        const section = sectionHeader.closest('.form-section-item-header').parentElement;
                        const textarea = section.querySelector('textarea');
                        if (textarea) {
                            textarea.value = inputText;
                            textarea.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                    }
                }
            } catch (e) {
                console.error("❌ 出错：", buttonText, e);
            }
        });
    }

    // 判断是否是目标页面
    function isTargetPage() {
        return location.href.includes("/liufangReport/addReport");
    }

    // 初始化函数，包含重试机制
    function initAutoFillUI(retry = 0) {
        if (!isTargetPage()) return;

        const target = document.querySelector('span.el-radio__label');
        if (target) {
            createStartButton();
        } else if (retry < 20) {
            setTimeout(() => initAutoFillUI(retry + 1), 500);
        } else {
            console.warn("🚫 等待页面元素超时");
        }
    }

    // 监听单页应用的路由变化
    const originalPushState = history.pushState;
    history.pushState = function (...args) {
        originalPushState.apply(this, args);
        setTimeout(initAutoFillUI, 300);
    };

    window.addEventListener("popstate", () => {
        setTimeout(initAutoFillUI, 300);
    });

    // 页面初次加载也运行
    initAutoFillUI();

})();
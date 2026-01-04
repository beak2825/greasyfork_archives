// ==UserScript==
// @name         OA功能扩展
// @namespace    https://greasyfork.org/users/521274
// @version      20251223.0930
// @description  OA平台辅助工具
// @author       qhq
// @match        https://*.ztna-dingtalk.com/spa/workflow/static4form/*
// @icon         data:image/x-icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALhbWAC4W1hAuFtZALhbWaC4W1oAuFtWKLRXWiC4W1nYuFtZYLhbWKi4W1gQtFdYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAuFtYALhbWGC4V1nIuFtbELhbW+i4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW6C4W1qAuFtZGLhXVBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAuFtYALRXVIi0W1ZwtFtb2LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtXWLhbWYC4W1gYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALhbWCi4W1oQuFtb0LhbW/y4W1v8uFtb/MhzX/1BG3f+Aeeb/oZ/t/7q18f/CwfP/wLvy/7Cs8P+RkOr/a2Hi/zws2f8vGNb/LhbW/y4W1v8uFtb/LhbWzi4W1jwuFtYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALhbWAC4W1jAtFdbQLhbW/y4W1v8uF9b/Sz3c/52a7P/h5fn/////////////////////////////////////////////////+Pn9/8PF8/91buT/NSHX/y4W1v8uFtb/LhbW+i4W1oguFtYIAAAAAAAAAAAAAAAAAAAAAC4W1gItFtZcLhbW8i4W1v8uFtb/STrb/7Cw8P/5+v7//////////////////v7+//j5/f/09f3/8/P8//P0/P/29/3/+/v+//7+/v/////////////////i5Pn/e3Tl/y4W1v8uFtb/LhbW/y4W1r4uFtYYAAAAAAAAAAAtFtYCLhbWeC4W1vwuFtb/Mx3X/4yH6f/z9fz///////7+/v/y8/z/wcPz/4yH6f9lWeH/Sj7c/zkt2P8zJNf/NCbX/z8y2f9VR97/c23k/6Og7f/b3fj/+vv+///////7+/7/QS7a/0Ew2v9MPtz/LhbW/y4W1dguFtYmAAAAAC4W1nAtFtb/LhbW/zgk2P/FxvT//v7///z8/v/T1Pb/fXbm/z0t2f8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y8Z1v9VSt7/oqHt/9PU9v82Idf/tbPw/9jZ9/8uFtb/LhbW/y4W1uAtFtYWLhXV5C4W1v8uFtb/XVHf//7+/v/U1fb/a2Li/zAa1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8/L9n/LhbW/zck2P/j5Pn/4eP5/y4W1v8uFtb/LhbW/y4V1mwuFtb/LhbW/y4W1v81INf/cmvj/zMf1/8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LxnW/9nc+P9PQt3/2dv4//7+/v+bl+v/LhbW/y4W1v8uFtb/LhbWii4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/ZFzh/y8Y1v9fVeD/dG7k/zMe1/8uFtb/LhbW/y4W1v8tFtaKLhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y0W1oouFtb/LhbW/2Va4f/Oy/X/zsr1/4yI6f8uFtb/LhbW/y4W1v8uFtb/V0re/8nG9P/Py/X/z8v1/4l+6P8uFtb/LhbW/0Ew2v9PRN3/T0Td/09E3f9ALtn/Ylbg/8nH9f+Iguj/QS/a/8TC9P/Kx/X/nJns/y4W1v8uFtb/LRbWii4W1v8uFtb/m5Lr////////////+fr+/0Au2f8uFtb/LhbW/y4W1v+vqu//////////////////pZvt/y4W1v8uGNb/5uf6/////////////////+Lj+f+cl+z//////+fn+v9kWOH////////////4+f3/OSfY/y4W1v8tFtaKLhbW/y4W1v9GNtv/ioLo/9vb+P//////al7i/y4W1v8uFtb/LhbW/7278v/+/v7/m5Ts/4qC6P9iVOD/LhbW/zIh1//8/P7/+/v+/+rt+//3+P3//////2Nc4f/v7/z/7/H8/zgo2P+EfOf/3d74//z9/v9FM9r/LhbW/y0W1oouFtb/LhbW/y4W1v8uFtb/hn7n//////+XkOv/LhbW/y4W1v8uFtb/vbvy//7+/v9LN9v/LhbW/y4W1v8uFtb/MiHX//z8/v/Z1/j/OirY/7a28f//////UkXd/+Pj+f/v8fz/Mh7X/y4W1v/BwfP//P3+/0Y02/8uFtb/LRbWii4W1v8uFtb/LhbW/y4W1v9bTt///v7+/8TC8/8uFtb/LhbW/y4W1v+9u/L//v7+/0s32/8uFtb/LhbW/y4W1v8yIdf//Pz+/9bU9/8uFtb/sa/w//////9SRd3/4+P5/+/x/P8yHtf/LhbW/8HB8//8/f7/RjTb/y4W1v8tFtaKLhbW/y4W1v8uFtb/LhbW/zom2P/29/3/6+z7/zId1/8uFtb/LhbW/7278v/+/v7/Szfb/y4W1v8uFtb/LhbW/zIh1//8/P7/1tT3/y4W1v+xr/D//////1JF3f/j4/n/+vr+/73A8/+7vvL/6+37//z9/v9GNNv/LhbW/y0W1oouFtb/LhbW/y4W1v8uFtb/LhbW/9jZ9//+/v7/TDzc/y4W1v8uFtb/vbvy//7+/v9LN9v/LhbW/y4W1v8uFtb/MiHX//z8/v/W1Pf/LhbW/7Gv8P//////UkXd/+Pj+f///////////////////////P3+/0Y02/8uFtb/LRbWii4W1v8uFtb/LhbW/y4W1v8uFtb/r6vv//////92bOT/LhbW/y4W1v+9u/L//v7+/0s32/8uFtb/LhbW/y4W1v8yIdf//Pz+/9bU9/8uFtb/sa/w//////9SRd3/4+P5//f4/f+Zmuv/l5br/+Di+f/8/f7/RjTb/y4W1v8tFtaKLhbW/y4W1v9vZeP/4N75/+De+f/w8Pz//////+7t+//g3vn/4N75//X1/f/+/v7/5eP6/+De+f+Tier/LhbW/zIh1//8/P7/+fn9/+De+f/09Pz//////1JF3f/j4/n/7/H8/zIe1/8uFtb/wcHz//z9/v9GNNv/LhbW/y0W1oouFtb/LhbW/5iQ6////////////////////////////////////////////////////////////6Wb7f8uFtb/MiHX//z8/v//////////////////////UkXd/+Pj+f/v8fz/Mh7X/y4W1v/BwfP//P3+/0Y02/8uFtb/LRbWii4W1v8uFtb/Py7Z/3hu5f95b+X/eW/l/3lv5f+vrfD//////6+t8P95b+X/eW/l/3lv5f95b+X/WEne/y4W1v8yIdf//Pz+/+Xk+v95b+X/zs71//////9SRd3/4+P5//n6/v+ytfD/sLPw/+jq+v/8/f7/RjTb/y4W1v8tFtaKLhbW/y4W1v8uFtb/LhbW/0g22/9aSt//RjTb/4J65///////gnrn/0Y02/9aSt//SDbb/y4W1v8uFtb/LhbW/zIh1//8/P7/1tT3/y4W1v+xr/D//////1JF3f/j4/n///////////////////////z9/v9GNNv/LhbW/y0W1oouFtb/LhbW/y4W1v83JNj/6er7//z9/v/a2/j/g33n//////+Dfef/2dv4//z9/v/p6/v/NyPY/y4W1v8uFtb/MiHX//z8/v/W1Pf/LhbW/7Gv8P//////UkXd/+Pj+f/4+f3/o6Xt/6Gh7f/k5vr//P3+/0Y02/8uFtb/LRbWii4W1v8uFtb/LhbW/3ty5f/+/v7//P3+/8jJ9P+Ce+f//////4J85//HyPT//P3+//7+/v97cuX/LhbW/y4W1v8yIdf//Pz+/9bU9/8uFtb/sa/w//////9SRd3/4+P5/+/x/P8yHtf/LhbW/8HB8//8/f7/RjTb/y4W1v8tFtaKLhbW/y4W1v8uF9b/0ND2//////9+dub/Mx3X/4J65///////gnrn/zMd1/9+dub//////9DQ9v8uFtb/LhbW/zIh1//8/P7/1tT3/4R/5//s7vv//////1JF3f/j4/n/7/H8/zYm2P9CN9r/yMr0//z9/v9GNNv/LhbW/y0W1oouFtb/LhbW/1ZI3v/9/f7/5+j6/zUg1/8uFtb/gnrn//////+Ceuf/LhbW/zQg1//n6Pr//f3+/1ZI3v8uFtb/MiHX//z8/v/W1Pf/wr7z///////+/v7/Szzc/+Pj+f/v8fz/oqHt//j5/f/9/f7//P3+/0Uz2v8uFtb/LRbWii4W1v8uFtb/VUve/4OA5/9jWuH/LhbW/y4W1v+Ceuf//////4J65/8uFtb/LhbW/2Na4f+DgOf/VUve/y4W1v8wG9b/gn/n/3Nt5P9VR97/g4Dn/3dx5f8vGNb/4+P5/+/x/P+mpe7////////////r7fv/NCDX/y4W1v8tFtaKLhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/zcm2P9EO9v/NybY/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v9BNtr/Qjna/zMg1/9EO9v/RDvb/zor2P8uFtb/LhbW/y4W1YguFtbcLhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbWZi4W1l4tFtb4LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1tAuFtYO//x////AA//+AAD/+AAAP/AAAA/gAAAHwAAAA4AAAAEAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAE=
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/521274/OA%E5%8A%9F%E8%83%BD%E6%89%A9%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/521274/OA%E5%8A%9F%E8%83%BD%E6%89%A9%E5%B1%95.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const originFetch = fetch;
    let responseData = null;
    let fieldCodeMapping = {};

    /** 
     * 加载映射配置：优先从本地存储取值，若不存在则使用默认并保存到本地 
     */
    async function loadMapping() {
        // 尝试从本地缓存读取
        const cached = GM_getValue('fieldCodeMapping');
        if (cached) {
            try {
                fieldCodeMapping = JSON.parse(cached);
                return;
            } catch (e) {
                console.warn('本地映射解析失败，重置为默认',e);
            }
        }
        // 默认映射
        const defaultMapping = {
            "21443": { "leixing": "付款申请单", "mark": "1、工会费付款申请需财务提供代扣代缴科目金额及客户编码\n2、退保证金提供期初导入凭证号及项目行号，以及SAP余额截图（退尾款也需提供，看账龄表）\n3、采购交货日期注意不是填OA提交日期" },
            "104448": { "leixing": "运输费用付款申请", "mark": "" },
            "95445": { "leixing": "销售返利付款申请", "mark": "1、检查客户信息是否一致，返点是否正确，录入科目\n2、附客户管理损益，针对异常亏损、异常损益项目说明原因，\n3、账扣返利发票原则上是普通发票，总税金=0，增值税发票要做进项税转出。线下费用发票可以增值税发票。\n4、票折返利、账扣线下等考虑附客户损益" },
            "23968": { "leixing": "市场费用付款申请单", "mark": "1、调票数据提供申请单截图\n2、O2O的预付款申请附网页上可用余额、冻结余额的截图。审核销售有无提供申请费用预计用途。\n  a:是否存在超3月未核销预付款\n  b:平台余额\n  c:本次活动金额\n3、票折返利、账扣线下等考虑附客户损益" },
            "108446": { "leixing": "销售合同", "mark": "1、提供客户损益情况。要填写费率及利润目标\n2、根据《应收账款管理办法》计算客户信用额度\n3、经销合同注意押金，购销合同免押\n4、客户类型、价目套、押金\n5、检查合同类型，检查证照身份证是否一致\n6、销售合同标注毛费差" },
            "104949": { "leixing": "租赁费用付款申请单", "mark": "" },
            "24980": { "leixing": "市场费用项目合同", "mark": "" },
            "70942": { "leixing": "调票申请", "mark": "1、调票数据提供申请单截图\n2、注意文字描述正确、清楚" },
            "68945": { "leixing": "价格申请", "mark": "" },
            "16442": { "leixing": "立项审批", "mark": "" },
            "29957": { "leixing": "计提申请表", "mark": "" },
            "106946": { "leixing": "运输合同", "mark": "" },
            "430442": { "leixing": "客户退单申请", "mark": "" },
            "127449": { "leixing": "客户申请表", "mark": "1、客户名称、税号与营业执照一致。要注意一下价目套，信用账龄控，还有税务号，银行号，开具什么发票，经销商赠品选合并开票。客户类型如果是赊销客户需国际性卖场或其他城市已合作客户。赊销客户'检查信用'=否。经销商低于150w价目套是经销商价目套2。附件有合同或申请邮件。\n2、普票：抬头、税号。增票：地址、电话、银行信息。开增票客户提供一般纳税人资格证明\n3、同时新增供应商" },
        };
        // 设置为默认并写入本地
        fieldCodeMapping = defaultMapping;
        try {
            GM_setValue('fieldCodeMapping', JSON.stringify(defaultMapping));
        } catch (e) {
            console.error('本地存储映射失败', e);
        }
    }

    /** 确保提示框存在并返回 */
    function ensureMarkDiv() {
        let markDiv = document.getElementById('markDiv');
        if (!markDiv) {
            markDiv = document.createElement('div');
            markDiv.id = 'markDiv';
            markDiv.setAttribute('role', 'dialog');
            markDiv.setAttribute('aria-live', 'polite');
            Object.assign(markDiv.style, {
                position: 'fixed', top: '100px', right: '60px',
                width: '250px', maxHeight: '220px',
                background: 'rgba(255,250,210,0.95)', border: '1px solid #ccc',
                borderRadius: '6px', padding: '10px', overflowY: 'auto',
                zIndex: '9999', boxShadow: '0 3px 8px rgba(0,0,0,0.3)',
                fontSize: '13px', lineHeight: '1.5'
            });
            // 关闭按钮
            const closeBtn = document.createElement('button');
            closeBtn.setAttribute('aria-label', '关闭提示');
            closeBtn.textContent = '×';
            Object.assign(closeBtn.style, {
                position: 'absolute', top: '4px', right: '6px',
                border: 'none', background: 'transparent', fontSize: '16px', cursor: 'pointer'
            });
            closeBtn.addEventListener('click', () => markDiv.remove());
            markDiv.appendChild(closeBtn);
            // 内容区域
            const content = document.createElement('pre');
            content.className = 'mark-content';
            Object.assign(content.style, { margin: '0', whiteSpace: 'pre-wrap' });
            markDiv.appendChild(content);
            document.body.appendChild(markDiv);
        }
        return markDiv;
    }

    /** 更新提示内容 */
    function updateMark(code) {
        const mapItem = fieldCodeMapping[code];
        // 如果没有 mark，则移除已有提示框
        if (!mapItem || !mapItem.mark) {
            const existing = document.getElementById('markDiv');
            if (existing) existing.remove();
            return;
        }
        // 有内容则确保提示框存在并更新
        const markDiv = ensureMarkDiv();
        markDiv.querySelector('.mark-content').textContent = mapItem.mark;
    }

    /** 复制字段到剪贴板 */
    function copyFields() {
        if (!responseData) return showToast('请先加载表单数据', true);
        const code = responseData.codeInfo.fieldCode;
        const fmap = responseData.tableInfo.main.fieldinfomap;
        // 使用 key 遍历，保持与最初版本一致
        const lines = [`${code}\t${fieldCodeMapping[code]?.leixing || ''}`];
        for (const fieldKey in responseData.maindata) {
            const fieldData = responseData.maindata[fieldKey];
            // 跳过空值
            if (!fieldData.value) continue;
            const id = fieldKey.replace(/^field/, '');
            const label = fmap[id]?.fieldlabel || id;
            let names = '';
            if (Array.isArray(fieldData.specialobj)) {
                names = fieldData.value.split(',')
                    .map(val => {
                        const obj = fieldData.specialobj.find(o => o.id === val.trim());
                        return obj ? obj.name : val;
                    })
                    .join(',');
            } else {
                names = fieldData.value;
            }
            if (names.includes('\n')) {
                const parts = names.split('\n').map(p => `"${p}"`);
                names = `=${parts.join('&CHAR(10)&')}`;
            }
            lines.push(`${id}	${label}	${names}`);
        }
        GM_setClipboard(lines.join('\n'));
        showToast('已复制字段内容');
    }

    /** 下载 JSON 并复制 PDF 文件名 */
    function saveResponse() {
        if (!responseData) {
            showToast('无可用数据', true);
            return;
        }
        const code = responseData.codeInfo.fieldCode;
        const oa = responseData.maindata['field' + code]?.value || 'unknown';
        const leixing = fieldCodeMapping[code]?.leixing || code;

        // 生成并下载 JSON
        const blob = new Blob([JSON.stringify(responseData, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${leixing}_${oa}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();

        // 复制对应的 PDF 文件名到剪贴板
        const pdfName = `${leixing}_${oa}.pdf`;
        GM_setClipboard(pdfName);

        showToast('已下载 JSON，已复制 PDF 文件名');
    }


    /** 创建按钮组 */
    function createButtons(target) {
        if (target._customBtns) return;
        target._customBtns = true;
        const wrapper = document.createElement('span');
        wrapper.setAttribute('aria-label', '自定义操作按钮组');
        wrapper.style.marginLeft = '10px';
        [{ text: '复 制', title: '复制字段', handler: copyFields },
        { text: '导 出', title: '下载 JSON', handler: saveResponse }
        ].forEach(cfg => {
            const btn = document.createElement('button');
            btn.className = 'ant-btn'; btn.title = cfg.title; btn.textContent = cfg.text;
            btn.setAttribute('aria-label', cfg.title);
            btn.addEventListener('click', cfg.handler);
            wrapper.appendChild(btn);
        });
        target.parentElement.insertBefore(wrapper, target);
    }

    /** 显示 Toast */
    function showToast(msg, isError = false) {
        let toast = document.getElementById('tm-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'tm-toast';
            Object.assign(toast.style, {
                position: 'fixed', bottom: '30px', right: '30px',
                padding: '8px 12px', borderRadius: '4px',
                color: '#fff', fontSize: '12px', zIndex: '10000',
                transition: 'opacity 0.3s', opacity: '0'
            });
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.style.background = isError ? 'rgba(200,0,0,0.8)' : 'rgba(0,0,0,0.7)';
        toast.style.opacity = '1';
        setTimeout(() => toast.style.opacity = '0', 2000);
    }

    /** 拦截 fetch */
    function interceptFetch() {
        unsafeWindow.fetch = (...args) => {
            const url = args[0];
            if (typeof url === 'string' && url.includes('/api/workflow/reqform/loadForm')) {
                return originFetch(...args).then(res => {
                    if (!res.ok) return res;
                    res.clone().json().then(data => {
                        if (data.files?.length === 0) return;
                        responseData = data;
                        console.log('原始数据：', responseData);
                        const btn = document.querySelector('span.wea-new-top-req-drop-btn.false');
                        if (btn) updateMark(data.codeInfo.fieldCode);
                    }).catch(err => console.error('解析失败', err));
                    return res;
                }).catch(err => { console.error('Fetch 拦截失败', err); return originFetch(...args); });
            }
            return originFetch(...args);
        };
    }

    /** 监听 DOM 并创建按钮 */
    function observeDOM() {
        const initObserver = () => {
            const observer = new MutationObserver(records => {
                const btn = document.querySelector('span.wea-new-top-req-drop-btn.false');
                if (btn) createButtons(btn);
            });
            observer.observe(document.body, { childList: true, subtree: true });
        };
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initObserver);
        } else {
            initObserver();
        }
    }

    // 主入口
    (async () => {
        await loadMapping();
        interceptFetch();
        observeDOM();
    })();
})();

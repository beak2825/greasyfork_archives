// ==UserScript==
// @name        TS-Text Checkbox
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  css
// @author       刚学会做蛋饼
// @license      MIT
// @match        https://ilabel.weixin.qq.com/*
// @grant        none
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/482717/TS-Text%20Checkbox.user.js
// @updateURL https://update.greasyfork.org/scripts/482717/TS-Text%20Checkbox.meta.js
// ==/UserScript==
(function () {
    function initScript() {
        console.log('脚本已启动');

        if (document.querySelector('.checkbox-container')) {
            console.log('脚本已经初始化，避免重复执行');
            return;
        }

        const categoryXPath = 'id("app")/DIV[1]/DIV[2]/SECTION[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/ARTICLE[1]/SECTION[2]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/TABLE[1]/TBODY[2]/TR[1]/TD[1]';
        const categoryElement = document.evaluate(categoryXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (!categoryElement) {
            console.log('未找到类目元素，脚本无法运行');
            return;
        }

        const categoryText = categoryElement.innerText.trim();

        const categories = {
            '图书': {
                options: {
            "标题-少书名": "你好，该提审商品的标题名称缺少必填项 图书名 不符合图书类目规范，请修改后重新提审：图书名（必填）+图书数量（套装或系列书籍则必填）+作者（选填）+图书类型或简介语（选填）+出版社（选填）",
            "标题-套装少数量": "你好，该提审商品的标题名称缺少必填项 图书数量 不符合图书类目规范，请修改后重新提审：图书名（必填）+图书数量（套装或系列书籍则必填）+作者（选填）+图书类型或简介语（选填）+出版社（选填）",
            "正面图": "你好，该提审商品的主图不满足图书类目管理规则，需提供：清晰可见书名以及出版社名称的书籍正面图。",
            "套装未全部展示版号": "你好，该提审商品的详情图不满足图书类目管理规则，如商品为套装或系列书籍，需在商品详情中逐一详细说明每一本书籍的名称以及对应的ISBN/CN码和出版社名称。商品详情中所列明的信息需与该商品的出版信息一致。",
            "缺少版权页": "你好，该提审商品未提供资质材料，不满足图类目商品管理规范，需提供： 商品对应的版权页图。 注：如商品为套装或系列书籍，需提供套装/系列内每本书籍的版权页图。",
            "缺少正版证明": "你好，该提审商品资质材料不满足图类目商品管理规范，还需提供：由商品出版发行方向入驻主体开具的授权证明或正版证明或采购销售合同。",
            "缺少鲜红公章/授权过期": "你好，该提审商品的资质材料不规范，资质材料证明/合同需盖有出版方的鲜红公章，且证明需在有效期范围内，请修改后重新提交审核。",
            "1级授权方与出版主体不同": "你好，该提审商品的授权证明不规范，一级授权方非该商品出版社主体不一致，请修改后重新提交审核。",
            "被授权方与入驻主体不一致": "你好，该提审商品的授权证明不规范，被授权方与入驻主体不一致，请修改后重新提交审核。",
            "多级授权链路不完整": "你好，该提审商品的授权证明不规范，多级授权链路不完整，请修改后重新提交审核。",
            "图书资质ps痕迹": "你好，该提审商品的资质材料不规范，包括但不限于疑似P图或资质材料与官方渠道核实不一致，请修改后重新提交审核。",
                    // ...其他选项
                },
                message: '这是图书类目的提示话术'
            },
            '玩具乐器': {
                options: {
                    "14岁以下无3c": "你好，该提审商品未提供资质材料，需提供:《国家强制性产品认证证书》（CCC安全认证证书），请修改后重新提交审核。",
                    "玩具未展示年龄": "你好，该提审商品的标题图片或详情描述中未清晰展示商品适用年龄，请修改后重新提交审核。若商品适用年龄为14岁以下，还需在商品资质处提供《国家强制性产品认证证书》（CCC安全认证证书）。",
                    // ...其他选项
                },
                message: '这是类目玩具的提示话术'
            },
            '运动户外': {
                options: {
                    "标题-缺少品牌": "你好，该提审商品的标题名称缺少必填项“  品牌  ”不符合该类目标题规范:品牌（必填）+基本属性+商品品名（必填）+规格参数，请修改后重新提交审核。（1）品牌：中文/英文品牌（如商品有品牌，则“品牌”为必填）（2）商品品名：须符合国际上通用的名称（英文商品需附带中文翻译）（必填）",
                     "标题-缺少品名": "你好，该提审商品的标题名称缺少必填项“  品牌  ”不符合该类目标题规范:品牌（必填）+基本属性+商品品名（必填）+规格参数，请修改后重新提交审核。（1）品牌：中文/英文品牌（如商品有品牌，则“品牌”为必填）（2）商品品名：须符合国际上通用的名称（英文商品需附带中文翻译）（必填）",
                     "出现【除菌类】": "你好，该提审商品涉及宣传“抗菌/防菌/抑菌”功效，需要提交相关的检测报告，请修改后重新提交审核。",
                     "涉及特殊材质": "你好，该提审商品未提供资质材料，需提供：质检报告：提供近二年内由第三方权威质检机构出具的含有CMA或CNAS认证的质检报告的结果页。请修改后重新提交审核。",
                    // ...其他选项
                },
                message: '这是类目运动户外的提示话术'
            },
            // ...其他类目和对应话术
        };

        console.log(categories[categoryText].message);

        const options = categories[categoryText].options;

        const selectedOptions = [];
        const textArea = document.querySelector('textarea.el-textarea__inner');

        function createCheckbox(option, textArea, selectedOptions) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = option;
            checkbox.addEventListener('change', function () {
                if (this.checked) {
                    selectedOptions.push(option);
                } else {
                    const index = selectedOptions.indexOf(option);
                    if (index > -1) {
                        selectedOptions.splice(index, 1);
                    }
                }
                updateSelectedText(textArea, selectedOptions);
            });

            const label = document.createElement('label');
            label.htmlFor = option;
            label.innerText = option;

            label.style.padding = '5px';
            label.style.fontSize = '16px';
            label.style.fontWeight = 'normal';
            label.style.color = '#999';

            checkbox.addEventListener('change', function () {
                if (this.checked) {
                    label.style.fontWeight = 'bold';
                    label.style.color = 'red';
                } else {
                    label.style.fontWeight = 'normal';
                    label.style.color = '#999';
                }
            });

            return { checkbox, label };
        }

        function updateSelectedText(textArea, selectedOptions) {
            let selectedText = '';
            selectedOptions.forEach((option, index) => {
                // 修改此处，根据选项数量是否大于1，决定是否添加序号和顿号
                selectedText += selectedOptions.length > 1 ? `${index + 1}、${options[option]}\n` : `${options[option]}\n`;
            });

            navigator.clipboard.writeText(selectedText).then(function () {
                console.log('已复制到剪贴板');
            }).catch(function (err) {
                console.error('复制到剪贴板失败:', err);
            });
        }

function toggleSelectAll() {
    const checkboxes = document.querySelectorAll('.checkbox-container input[type="checkbox"]');
    const selectAll = document.getElementById('selectAll');

    const isChecked = selectAll.innerText === '取消全选';

    checkboxes.forEach((checkbox) => {
        checkbox.checked = !isChecked;
        const label = checkbox.nextElementSibling;
        label.style.fontWeight = !isChecked ? 'bold' : 'normal';
        label.style.color = !isChecked ? 'red' : '#999';
    });

    if (!isChecked) {
        selectedOptions.length = 0;
        checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                selectedOptions.push(checkbox.id);
            }
        });
    } else {
        selectedOptions.length = 0;
    }

    updateSelectedText(textArea, selectedOptions);
    selectAll.innerText = isChecked ? '全选' : '取消全选';
}




        const checkboxContainer = document.createElement('div');
        checkboxContainer.className = 'checkbox-container';
        checkboxContainer.style.display = 'flex';
        checkboxContainer.style.flexWrap = 'wrap';
        checkboxContainer.style.alignItems = 'center';

        const allOptions = Object.keys(options);

        allOptions.forEach(option => {
            const { checkbox, label } = createCheckbox(option, textArea, selectedOptions);
            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(label);
        });

        const targetElement = document.querySelector('.info-card > .info-card');
        if (targetElement && textArea) {
            targetElement.appendChild(checkboxContainer);
            textArea.addEventListener('input', function () {
                // 修改此处，不再清空选中的话术
                // selectedOptions.length = 0;
            });

            let selectAll = document.getElementById('selectAll');
            if (!selectAll) {
                selectAll = document.createElement('button');
                selectAll.id = 'selectAll';
                selectAll.innerText = '全选';
                selectAll.addEventListener('click', toggleSelectAll);
                checkboxContainer.appendChild(selectAll);
            }
        }
    }

    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList' && mutation.target === document.body) {
                initScript();
            }
        });
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
})();

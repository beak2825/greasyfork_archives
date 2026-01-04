// ==UserScript==
// @name         Text Checkbox
// @namespace    http://tampermonkey.net/
// @version      4.0.0
// @description  css
// @author       刚学会做蛋饼
// @license      MIT
// @match        https://ilabel.weixin.qq.com/*
// @grant        none
// @grant        GM_setClipboard

// @downloadURL https://update.greasyfork.org/scripts/479252/Text%20Checkbox.user.js
// @updateURL https://update.greasyfork.org/scripts/479252/Text%20Checkbox.meta.js
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
            '教育培训': {
                options: {
         //   "黑名单": "你好，该提审商品（包含商品标题、图片、详情等）存在涉嫌绕开、规避或对抗平台审核监管的行为。",
            "医疗": "你好，该提审商品涉及“医疗课程、诊断及咨询服务”为教育培训类禁售商品，请查看教育培训类目管理规则中4.1.2条款。",
            "股票": "你好，该提审商品涉及“房产、基金、股票、证券等服务”为教育培训类禁售商品，请查看教育培训类目管理规则中4.1.2条款。",
            "情感": "你好，该提审商品涉及“情感类虚拟商品”为教育培训类禁售商品，请查看教育培训类目管理规则中4.1.2条款。",
            "玄学": "你好，该提审商品涉及“封建玄学类心理学商品”为教育培训类禁售商品，请查看教育培训类目管理规则中4.1.2条款。",
            "6岁": "你好，该提审商品为教育培训类禁售商品，面向客户涉及学龄前（6岁及以下），请查看教育培训类目管理规则中4.1.2条款。",
            "k12": "你好，该提审商品涉及“K12教育课程”为教育培训类禁售商品，请查看教育培训类目管理规则中4.1.2条款。",
            "教辅-真人出镜": "你好，该提审线上教辅类目商品涉及禁止真人出镜的K12视频教学内容，请查看教育培训类目管理规则中4.1.2条款。",
            "教辅-拍照搜题": "你好，该提审线上教辅类目商品包含禁止准入的“拍照搜题”等不良学习功能，请查看教育培训类目管理规则中4.1.2条款。",
            "侵权": "你好，该提审商品（包含商品标题、描述、图片、详情等）涉及著作权或版权信息侵权等内容，请在商品上架时商品资质处补充相应作品授权文件。",
            "授权非鲜章": "你好，作品授权文件公章信息非鲜章，不能通过；请加盖鲜章后重新提交审核。",
            "黑产": "你好，该提审商品为教育培训类禁售的商品类型,禁止以网络平台赚钱的名义发布虚假、诈骗信息，包括但不限于：涉及网赚/兼职业务/团队加盟的信息，或推广某个“赚钱”项目/”赚钱”方法/分销权。",
            "具体运营禁售": "你好，该提审商品为教育培训类禁售的商品类型，禁止以运营具体平台账号（包括但不限于视频号、抖音、小红书、淘宝等互联网社交或电商平台）为教学内容的针对性自媒体运营、电商运营、直播运营、带货运营及变现等教学。仅允许不指向具体平台的直播、短视频及自媒体相关的全平台通用型运营课程。",
            "图片模糊不完整": "你好，该提审商品的标题、商品主图、详情图描述等关键信息存在图片不完整或模糊不清，请重新提交清晰完整原图审核，参考链接4.2.3条款。",
            "描述不清晰": "你好，该提审商品详情信息缺失，商品标题、图片、详情、属性等需按照商品详情要求、讲师介绍、课程大纲类目、面向人群、履约方式、课程有效期、课程权益、退款/客诉说明等清楚描述该商品，请参考链接中4.2.3条款的说明修改后重新提交审核。",
            "有大纲不清晰": "你好，该商品课程大纲介绍含糊不清或无效标题词堆叠，无法了解课程章节具体教学内容，大纲各标题需清晰概括该章节具体教学内容，请修改后重新提交审核。",
            "标题不符": "你好，该提审商品的标题名称少于5字符或缺少必填项: 教学领域/教学形式，不符合教育培训类目标题规范，请修改后重新提交审核。",
            "主图三张": "你好，商品需提供三张（含三张）以上与商品标题对应一致的商品图片，商品主图内容不允许重复，请参考链接中4.2.3条款的说明修改后重新提交审核。",
            "教培品牌": "你好，该提审商品涉及品牌需提供品牌资质材料，品牌新增功能和商品品牌标签功能已上线，请优先申请品牌资质，商品提交时添加相关品牌标签即可。",
            "测试": "你好，该提审商品为测试类商品，请修改后重新提交审核。",
            "定金尾款": "你好，该提审商品为教育培训类禁售的商品类型，教育培训类禁止售卖定金、尾款、代金券、补差价的链接等商品，请参考链接中4.1.2条款修改后重新提交审核。",
            "引流": "你好，提审商品不可包含二维码、联系方式、网址（含水印网址）、其他平台等内容，请删除相关信息再提交审核。",
            "咨询链接": "你好，提审商品不可包含收集用户联系方式等个人信息、或引导用户致电、引导私下交易等行为，请删除相关信息再提交审核。",
            "sku非课程": "你好，该提审商品的商品属性与详情无关联或不一致，教育培训类禁止填写\"实体商品\"、\"图文\"等非教培课程类型的描述，请查看教育培训类目管理规则中4.2.3条款请修改后重新提交审核。",
            "价格宣传不符": "你好，该提审商品（包含商品标题、描述、图片、详情等）涉及宣传价格和实际售价不一致，请修改后重新提交审核。",
            "过度营销": "你好，该提审商品（包含商品标题、描述、图片、详情等）涉及使用绝对化用语、诱导好评、发布不当营销信息等内容，请修改后重新提交审核。",
            "未开放": "你好，该提审商品为平台暂未开放的商品或服务，请修改后重新提交审核。",
            "叶黄素实体": "你好，该提审商品为平台禁售商品，请修改后重新提交审核。",
            "实体禁售": "你好，提交审核的商品信息包含赠送平台定向邀约类目商品，审核不通过",
            "脱离教培领域": "你好，该提审商品为脱离教培领域的商品，请选择其他类目后重新提交审核。",
            "虚拟软件/文档": "你好，该提审商品为教育培训类禁售的商品类型，教育培训类禁止单独售卖虚拟软件或虚拟文档，请参考链接中4.1.2条款修改后重新提交审核。",
            // 添加更多选项
                },
                message: '这是图书类目的提示话术'
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

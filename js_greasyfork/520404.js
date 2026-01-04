// ==UserScript==
// @name         班固米新增版本助手测试版
// @namespace    https://bgm.tv/user/chiefmagician
// @version      3.2
// @description  版本搬运工的好朋友
// @author       bgmmajia+ai
// @match        https://bgm.tv/new_subject/1
// @match        https://bgm.tv/subject/*/edit_detail
// @match        https://chii.in/new_subject/1
// @match        https://chii.in/subject/*/edit_detail
// @match        https://bangumi.tv/new_subject/1
// @match        https://bangumi.tv/subject/*/edit_detail
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/520404/%E7%8F%AD%E5%9B%BA%E7%B1%B3%E6%96%B0%E5%A2%9E%E7%89%88%E6%9C%AC%E5%8A%A9%E6%89%8B%E6%B5%8B%E8%AF%95%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/520404/%E7%8F%AD%E5%9B%BA%E7%B1%B3%E6%96%B0%E5%A2%9E%E7%89%88%E6%9C%AC%E5%8A%A9%E6%89%8B%E6%B5%8B%E8%AF%95%E7%89%88.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    const originalMenuInner = document.querySelector('.menu_inner');
    if (originalMenuInner) {
        const newMenuInner = document.createElement('div');
        newMenuInner.className = 'menu_inner';
        newMenuInner.setAttribute('align', 'left');
 
        const inputWrapper = document.createElement('div');
        inputWrapper.style.position = 'relative';
        inputWrapper.style.display = 'inline-block';
 
        const inputField = document.createElement('input');
        inputField.placeholder = '请输入版本名称';
        inputField.style.padding = '5px';
        inputField.style.border = '1px solid #ccc';
        inputField.style.borderRadius = '5px';
        inputField.style.width = 'calc(100% - 50px)';
 
        const goButton = document.createElement('button');
        goButton.textContent = 'GO';
        goButton.style.position = 'absolute';
        goButton.style.right = '0';
        goButton.style.top = '0';
        goButton.style.bottom = '0';
        goButton.style.background = 'linear-gradient(to bottom, #62C8EC, #319ABF)';
        goButton.style.borderRadius = '5px';
        goButton.style.color = 'white';
        goButton.style.border = 'none';
        goButton.style.padding = '5px 10px';
        goButton.style.cursor = 'pointer';
 
        // 这里是快捷输入位
        const presetFields = ['台角', '东立', '青文', '尖端', '长鸿', '东贩'];
        const presetWrapper = document.createElement('div');
        presetWrapper.style.marginTop = '10px';
 
        presetFields.forEach(field => {
            const fieldElement = document.createElement('span');
            fieldElement.textContent = field;
            fieldElement.style.color = '#0084B4';
            fieldElement.style.marginRight = '5px';
            fieldElement.style.cursor = 'pointer';
            fieldElement.addEventListener('click', () => {
                inputField.value = field;
                goButton.click();
            });
            presetWrapper.appendChild(fieldElement);
        });
 
        const syncContainer = document.createElement('div');
        syncContainer.style.marginTop = '20px';
        syncContainer.style.borderTop = '1px solid #ccc';
        syncContainer.style.paddingTop = '10px';
 
        const syncTitle = document.createElement('div');
        syncTitle.textContent = '同步关联人物？';
        syncTitle.style.fontWeight = 'bold';
        syncContainer.appendChild(syncTitle);
 
        const syncContent = document.createElement('div');
        syncContent.style.marginTop = '5px';
        syncContainer.appendChild(syncContent);
 
        inputWrapper.appendChild(inputField);
        inputWrapper.appendChild(goButton);
        newMenuInner.appendChild(inputWrapper);
        newMenuInner.appendChild(presetWrapper);
        const currentUrl = window.location.href;
        if (window.location.href.includes('/edit_detail')) {
            newMenuInner.appendChild(syncContainer);
            }
        originalMenuInner.parentNode.insertBefore(newMenuInner, originalMenuInner.nextSibling);
 
        const originalSubmitButton = document.querySelector('.inputBtn[name="submit"]');
        if (originalSubmitButton) {
            const originalOnClick = originalSubmitButton.onclick;
            originalSubmitButton.onclick = function (event) {
                handleSaveButtonClick();
                if (typeof originalOnClick === 'function') {
                    originalOnClick.call(this, event);
                    }
                };
            }
 
        goButton.addEventListener('click', () => {
 
             // 这里是默认值
            let formattedVer = 'XX';
            let VerName = '';
            let Vertitle = '';
            let Altertitle = '';
            let Verpublisher = '';
            let VerpublisherID = '';
            let Verproducer = '';
            let VerproducerID = '';
            let Verarea = '';
            let VerISBN = '';
            let Vertranslator = '';
            let Verdate = '';
            let Verpricing = '';
            let Verbooks = '';
            let Verpages = '';
 
            let InputValue = inputField.value.trim();
            if (InputValue.includes('{') && InputValue.includes('=')) {
                try {
                    const keyValuePattern = /(\w+)\s*=\s*'([^']+)'/g;
                    let match;
                    while ((match = keyValuePattern.exec(InputValue)) !== null) {
                        const key = match[1];
                        const value = match[2];
                                        switch (key) {
                                            case 'Vertitle':
                                                Vertitle = value;
                                                break;
                                            case 'Altertitle':
                                                Altertitle = value;
                                                break;
                                            case 'VerISBN':
                                                VerISBN = value;
                                                break;
                                            case 'Vertranslator':
                                                Vertranslator = value;
                                                break;
                                            case 'Verdate':
                                                Verdate = value;
                                                break;
                                            case 'Verbooks':
                                                Verbooks = value;
                                                break;
                                            case 'Verpages':
                                                Verpages = value;
                                                break;
                                            case 'Verpricing':
                                                Verpricing = value;
                                                break;
                                            case 'VerName':
                                                VerName = value;
                                                break;
                                            case 'Verpublisher':
                                                Verpublisher = value;
                                                break;
                                            default:
                                                throw new Error(`未知的参数: ${key}`);
                                        }
                    }
 
                    if (!VerName) {
                        throw new Error('格式错误，缺少必要参数');
                    }
                    } catch (error) {
                        VerName = 'XX';
                        }
                } else if (InputValue) {
                    VerName = InputValue;
                    } else {
                        VerName = 'XX';
                        }
            formattedVer = `${VerName}版`;
 
            // 这里新增模板配置
            if (/(台角|台灣角川|台湾角川|^TAJ$)/i.test(VerName)) {
                formattedVer = '台角版';
                Verpublisher = '台灣角川';
                VerpublisherID = '7840';
                Verarea = 'TW';
            } else if (/(天角|天聞角川|天闻角川|^TJ$|^TIJ$)/i.test(VerName)) {
                formattedVer = '天角版';
                Verproducer = '天闻角川';
                VerproducerID = '8233';
                Verarea = 'CN';
            } else if (/(後浪|后浪|^HL$)/i.test(VerName)) {
                formattedVer = '后浪版';
                Verproducer = '后浪';
                VerproducerID = '40908';
                Verarea = 'CN';
            } else if (/(東立|东立|^DL$)/i.test(VerName)) {
                formattedVer = '东立版';
                Verpublisher = '東立出版社';
                VerpublisherID = '7033';
                Verarea = 'TW';
            } else if (/(青文|^QW$)/i.test(VerName)) {
                formattedVer = '青文版';
                Verpublisher = '青文出版社';
                VerpublisherID = '8298';
                Verarea = 'TW';
            } else if (/(東販|东贩|^DF$)/i.test(VerName)) {
                formattedVer = '东贩版';
                Verpublisher = '台灣東販';
                VerpublisherID = '7617';
                Verarea = 'TW';
            } else if (/(长鸿|長鴻|^CH$)/i.test(VerName)) {
                formattedVer = '长鸿版';
                Verpublisher = '長鴻出版社';
                VerpublisherID = '7659';
                Verarea = 'TW';
            } else if (/(尖端|^JD$)/i.test(VerName)) {
                formattedVer = '尖端版';
                Verpublisher = '尖端出版';
                VerpublisherID = '7611';
                Verarea = 'TW';
            } else if (/(未數|未数|未來數位|未来数位|^WS$|^WLSW$)/i.test(VerName)) {
                formattedVer = '未数版';
                Verpublisher = '未來數位';
                VerpublisherID = '40777';
                Verarea = 'TW';
            } else if (/(^dart$|^d\/art$|原動力視覺|原动力视觉|^YSJ$)/i.test(VerName)) {
                formattedVer = '原视觉版';
                Verpublisher = '原動力視覺(發行)／未來數位(經銷)';
                VerpublisherID = '69173';
                Verarea = 'TW';
            } else if (/(紳士|绅士|^SS$)/i.test(VerName)) {
                formattedVer = '绅士版';
                Verpublisher = '紳士出版';
                VerpublisherID = '42476';
                Verarea = 'TW';
            } else if (/(暮想|^MX$|^MS$)/i.test(VerName)) {
                formattedVer = '暮想版';
                Verpublisher = '暮想出版';
                VerpublisherID = '63071';
                Verarea = 'TW';
            } else if (/(買動漫|买动漫|買對動漫|买对动漫|^MDM$|^MDDM$)/i.test(VerName)) {
                formattedVer = '买动漫版';
                Verpublisher = '買對動漫';
                VerpublisherID = '69734';
                Verarea = 'TW';
            } else if (/(更生|^GS$)/i.test(VerName)) {
                formattedVer = '更生版';
                Verpublisher = '更生文化設計';
                VerpublisherID = '63627';
                Verarea = 'TW';
            } else if (/(臉譜|脸谱|^LP$)/i.test(VerName)) {
                formattedVer = '脸谱版';
                Verpublisher = '臉譜出版';
                VerpublisherID = '56959';
                Verarea = 'TW';
            } else if (/(平心|^PX$|^PS$)/i.test(VerName)) {
                formattedVer = '平心版';
                Verpublisher = '平心出版';
                VerpublisherID = '50391';
                Verarea = 'TW';
            } else if (/(深空|^SK$)/i.test(VerName)) {
                formattedVer = '深空版';
                Verpublisher = '深空出版';
                VerpublisherID = '53671';
                Verarea = 'TW';
            } else if (/(威向|^WX$)/i.test(VerName)) {
                formattedVer = '威向版';
                Verpublisher = '威向文化';
                VerpublisherID = '45647';
                Verarea = 'TW';
            } else if (/(鯨嶼|鲸屿|^JY$)/i.test(VerName)) {
                formattedVer = '鲸屿版';
                Verpublisher = '鯨嶼文化';
                VerpublisherID = '63496';
                Verarea = 'TW';
            } else if (/(獨步|独步|^DB$)/i.test(VerName)) {
                formattedVer = '独步版';
                Verpublisher = '獨步文化';
                VerpublisherID = '58009';
                Verarea = 'TW';
            } else if (/(大塊|大块|^DK$)/i.test(VerName)) {
                formattedVer = '大块文化版';
                Verpublisher = '大塊文化';
                VerpublisherID = '63110';
                Verarea = 'TW';
            } else if (/(时报|時報|^SB$)/i.test(VerName)) {
                formattedVer = '时报版';
                Verpublisher = '時報文化';
                VerpublisherID = '8365';
                Verarea = 'TW';
            } else if (/(遠足|远足|^YZ$)/i.test(VerName)) {
                formattedVer = '远足版';
                Verpublisher = '遠足文化';
                VerpublisherID = '63844';
                Verarea = 'TW';
            } else if (/(大然|^DR$)/i.test(VerName)) {
                formattedVer = '大然版';
                Verpublisher = '大然文化';
                VerpublisherID = '8359';
                Verarea = 'TW';
            } else if (/(玉皇朝|^YHC$)/i.test(VerName)) {
                formattedVer = '玉皇朝版';
                Verpublisher = '玉皇朝';
                VerpublisherID = '7613';
                Verarea = 'HK';
            } else if (/(天下|天下出版|^TX$|^TS$)/i.test(VerName)) {
                formattedVer = '天下版';
                Verpublisher = '天下出版';
                VerpublisherID = '8163';
                Verarea = 'HK';
                } else if (/(文傳|文传|文化傳信|文化传信|^WC$|^WHCX$|^WHCS$)/i.test(VerName)) {
                formattedVer = '文传版';
                Verpublisher = '文化傳信';
                VerpublisherID = '8050';
                Verarea = 'HK';
            } else if (/(日本|日文|日語|日语|^JP$|^JA$)/i.test(VerName)) {
                formattedVer = '日本版';
                Verarea = 'JP';
            } else if (/(韩国|韓國|韩文|韓文|韓語|韩语|^KR$)/i.test(VerName)) {
                formattedVer = '韩国版';
                Verarea = 'KR';
            } else if (/(實體|实体|^0$|^ST$)/i.test(VerName)) {
                formattedVer = '实体版';
                Verarea = 'KR';
            } else if (/(北美|英文|英语|英語|美國|美国|^NA$)/i.test(VerName)) {
                formattedVer = '北美版';
                Verarea = 'NA';
            }
 
            // 这里设定语言与价格
            let Verlanguage = '';
            let Verprice = '';
            if (Verarea === 'TW') {
                Verlanguage = '繁体中文';
                Verprice = 'NT$';
            } else if (Verarea === 'CN') {
                Verlanguage = '简体中文';
                Verprice = '¥';
            } else if (Verarea === 'HK') {
                Verlanguage = '繁体中文';
                Verprice = 'HK$';
            } else if (Verarea === 'JP') {
                Verlanguage = '日文';
                Verprice = '¥(稅込/稅拔)';
            } else if (Verarea === 'KR') {
                Verlanguage = '韩文';
                Verprice = '₩';
            } else if (Verarea === 'NA') {
                Verlanguage = '英文';
                Verprice = '$';
            }
 
            if (Verpublisher && VerpublisherID && !syncContent.querySelector(`#syncPublisher-${VerpublisherID}`)) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = VerpublisherID;
                checkbox.id = `syncPublisher-${VerpublisherID}`;
                checkbox.checked = true;
                checkbox.dataset.type = 'publisher';
                const label = document.createElement('label');
                label.textContent = Verpublisher;
                label.setAttribute('for', `syncPublisher-${VerpublisherID}`);
                syncContent.appendChild(checkbox);
                syncContent.appendChild(label);
                syncContent.appendChild(document.createElement('br'));
            }
            if (Verproducer && VerproducerID && !syncContent.querySelector(`#syncProducer-${VerproducerID}`)) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = VerproducerID;
                checkbox.id = `syncProducer-${VerproducerID}`;
                checkbox.checked = true;
                checkbox.dataset.type = 'producer';
                const label = document.createElement('label');
                label.textContent = Verproducer;
                label.setAttribute('for', `syncProducer-${VerproducerID}`);
                syncContent.appendChild(checkbox);
                syncContent.appendChild(label);
                syncContent.appendChild(document.createElement('br'));
            }
 
            inputField.value = '';
 
            if (nowmode === 'normal') {
                NormaltoWCODE();
                addVerToInfobox(formattedVer, Verlanguage, Verprice, Verproducer, Verpublisher, Vertitle, Altertitle, VerISBN, Vertranslator, Verdate, Verbooks, Verpages, Verpricing);
                WCODEtoNormal();
            } else if (nowmode === 'wcode') {
                addVerToInfobox(formattedVer, Verlanguage, Verprice, Verproducer, Verpublisher, Vertitle, Altertitle, VerISBN, Vertranslator, Verdate, Verbooks, Verpages, Verpricing);
                WCODEtoNormal();
            }
        });
 
        function addVerToInfobox(formattedVer, Verlanguage, Verprice, Verproducer, Verpublisher, Vertitle, Altertitle, VerISBN, Vertranslator, Verdate, Verbooks, Verpages, Verpricing) {
            const infoboxTextarea = document.getElementById('subject_infobox');
            const isSeries = document.querySelector('#subjectSeries')?.checked;
 
            if (infoboxTextarea) {
                const infoboxContent = infoboxTextarea.value;
 
                const cleanedAltertitle = Altertitle !== Vertitle.replace(/\(無修正\)/g, '')
                ? Altertitle
                : '';
 
                const newVerBlock = `|版本:${formattedVer}={
${formattedVer !== '实体版' ? `[版本名|${Vertitle}]` : ''}
${['英文', '日文', '韩文'].includes(Verlanguage) ? '' : `[别名|${cleanedAltertitle}]`}
${formattedVer !== '实体版' ? `[语言|${Verlanguage}]` : ''}
${isSeries ? `[价格|]` : `[价格|${Verprice}${Verpricing}]`}
${Verproducer ? `[出品方|${Verproducer}]` : ''}
[出版社|${Verpublisher}]
[发售日|${Verdate}]
${isSeries ? `[册数|${Verbooks}册既刊]` : `[页数|${Verpages}]`}
${formattedVer === '原视觉版' ? (isSeries ? '[全套EAN|]' : '[EAN|4711117]\n[EAN|4712568]') : (isSeries ? '[全套ISBN|]' : `[ISBN|${VerISBN}]`)}
${formattedVer !== '实体版' ? `[译者|${Vertranslator}]` : ''}
}`;
 
                const updatedContent = infoboxContent.replace(/\}\}$/, `${newVerBlock}\n}}`);
                infoboxTextarea.value = updatedContent;
            }
        }
 
        async function handleSaveButtonClick() {
            const formhashInput = document.querySelector('input[name="formhash"]');
            const formhash = formhashInput ? formhashInput.value : '';
 
            const checkboxes = syncContent.querySelectorAll('input[type="checkbox"]:checked');
 
            if (checkboxes.length === 0) {
                return;
            }
 
            const formData = new URLSearchParams();
            formData.append('formhash', formhash);
            formData.append('submit', '保存关联数据');
            formData.append('editSummary', '');
 
            let existingInfoArr = await getExistingInfoArr();
 
            const newInfoArr = [];
            existingInfoArr.forEach((info, index) => {
                newInfoArr.push({
                    prsnPos: info.prsnPos,
                    prsn_id: info.prsn_id,
                    appear_eps: info.appear_eps
                    });
                });
 
            newInfoArr.forEach((info, index) => {
                formData.append(`infoArr[${index}][prsnPos]`, info.prsnPos);
                formData.append(`infoArr[${index}][appear_eps]`, info.appear_eps);
                formData.append(`infoArr[${index}][prsn_id]`, info.prsn_id);
                });
 
            checkboxes.forEach((checkbox, index) => {
                const prsnPos = checkbox.dataset.type === 'publisher' ? '2004' : '2012';
                formData.append(`infoArr[n${index}][prsnPos]`, prsnPos);
                formData.append(`infoArr[n${index}][appear_eps]`, '');
                formData.append(`infoArr[n${index}][prsn_id]`, checkbox.value);
                if (checkbox.value === '69173') {
                    formData.append(`infoArr[n${index + 1}][prsnPos]`, '2004');
                    formData.append(`infoArr[n${index + 1}][appear_eps]`, '');
                    formData.append(`infoArr[n${index + 1}][prsn_id]`, '40777');
                    }
            });
 
            try {
                const response = await fetch(window.location.pathname.replace('/edit_detail', '/add_related/person'), {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                });
            } catch (error) {
            }
        }
    }
 
        async function getExistingInfoArr() {
        try {
            const response = await fetch(window.location.pathname.replace('/edit_detail', '/add_related/person'));
            if (response.ok) {
                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');
                const form = doc.querySelector('form[name="add_related"]');
 
                let infoArr = [];
 
                if (form) {
                    const infoArrInputs = form.querySelectorAll('[name^="infoArr"]');
 
                    infoArrInputs.forEach(input => {
                        const match = input.name.match(/^infoArr\[(\d+)\]\[(\w+)\]$/);
                        if (match) {
                            const index = match[1];
                            const key = match[2];
                            const value = input.value;
 
                            if (!infoArr[index]) {
                                infoArr[index] = {};
                            }
                            infoArr[index][key] = value;
                        }
                    });
                }
 
                return infoArr;
            }
            return [];
        } catch (error) {
            alert('咪咕～数据获取出错了:', error);
            return [];
        }
    }
})();
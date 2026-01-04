// ==UserScript==
// @name         新增书籍版本助手
// @namespace    https://bgm.tv/user/chiefmagician
// @version      4.0.0
// @description  版本搬运工的好朋友
// @author       ✌(´◓q◔`)✌
// @include        /^https?:\/\/(bangumi|bgm|chii)\.(tv|in)\/(new_subject\/1|subject\/\d+\/edit_detail)/
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/519230/%E6%96%B0%E5%A2%9E%E4%B9%A6%E7%B1%8D%E7%89%88%E6%9C%AC%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/519230/%E6%96%B0%E5%A2%9E%E4%B9%A6%E7%B1%8D%E7%89%88%E6%9C%AC%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const focuschl = $("li > a.focus.chl span").text().trim();
    if ($('#customMenuInner').length || (focuschl !== "书籍" && focuschl !== "")) return;
    const newMenuInner = $('<div>', {
        id: 'customMenuInner',
        class: 'menu_inner',
        align: 'left'
    });
    const inputWrapper = $('<div>', {
            css: {
                position: 'relative',
                display: 'inline-block'
            }
        })
        .append(
            $('<input>', {
                placeholder: '请输入版本名称',
                css: {
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    width: 'calc(100% - 50px)'
                }
            }),
            $('<button>', {
                text: 'GO',
                css: {
                    position: 'absolute',
                    right: '0',
                    top: '0',
                    bottom: '0',
                    background: 'linear-gradient(to bottom, #62C8EC, #319ABF)',
                    borderRadius: '5px',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    cursor: 'pointer'
                }
            }).on('click', handleGoButtonClick)
        );
    const presetFields = ['台角', '东立', '青文', '尖端', '长鸿', '东贩'];
    const presetWrapper = $('<div>', {
        css: {
            marginTop: '10px'
        }
    });
    presetFields.forEach(field => {
        $('<span>', {
            text: field,
            css: {
                color: '#0084B4',
                marginRight: '5px',
                cursor: 'pointer'
            }
        }).on('click', () => {
            inputWrapper.find('input').val(field);
            inputWrapper.find('button').trigger('click');
        }).appendTo(presetWrapper);
    });
    newMenuInner.append(inputWrapper, presetWrapper);
    $('.menu_inner').first().after(newMenuInner);

    function handleGoButtonClick() {
        const inputValue = inputWrapper.find('input').val().trim();
        const versionInfo = parseInputValue(inputValue);
        const {
            formattedVer,
            Verpublisher,
            Verarea
        } = getVersionInfo(versionInfo.VerName, versionInfo.Verpublisher);
        const [Verlanguage, Verprice] = areaMap[Verarea] || ['', ''];
        inputWrapper.find('input').val('');
        if (nowmode === 'normal') NormaltoWCODE();
        addVerToInfobox(formattedVer, Verlanguage, Verprice, {
            ...versionInfo,
            Verpublisher,
            Verarea
        });
        WCODEtoNormal();
    }

    function parseInputValue(inputValue) {
        const keys = [
            'formattedVer', 'VerName', 'Vertitle', 'Altertitle', 'Verpublisher',
            'VerpublisherID', 'Vercnpublisher', 'Verarea', 'VerISBN',
            'Vertranslator', 'Verdate', 'Verpricing', 'Verbooks', 'Verpages', 'Verlabel', 'Verlogo'
        ];
        const versionInfo = Object.fromEntries(keys.map(key => [key, key === 'formattedVer' ? 'XX' : '']));
        if (inputValue.includes('{') && inputValue.includes('=')) {
            const keyValuePattern = /(\w+)\s*=\s*'([^']+)'/g;
            let match;
            while ((match = keyValuePattern.exec(inputValue)) !== null) {
                const key = match[1];
                const value = match[2];
                if (versionInfo.hasOwnProperty(key)) versionInfo[key] = value;
                else throw new Error(`未知的参数: ${key}`);
            }
            if (!versionInfo.VerName) throw new Error('格式错误，缺少必要参数');
        } else if (inputValue) {
            versionInfo.VerName = inputValue;
        }
        return versionInfo;
    }

    function getVersionInfo(VerName, Verpublisher) {
        for (const [pattern, formattedVer, Verpublisher, Verarea] of publisherMap) {
            if (pattern.test(VerName)) {
                return {
                    formattedVer,
                    Verpublisher,
                    Verarea
                };
            }
        }
        return {
            formattedVer: `${VerName.replace(/(股份)?有限公司|文化$|出版(社)?$/g, '')}版`,
            Verpublisher: Verpublisher || VerName,
            Verarea: ''
        };
    }

    function addVerToInfobox(formattedVer, Verlanguage, Verprice, versionInfo) {
        const infoboxTextarea = $('#subject_infobox');
        if (!infoboxTextarea.length) return;
        const isSeries = $('#subjectSeries').is(':checked');
        const title = $('input[name="subject_title"]').val();
        const isSingle = /\d/g.test(title);
        typeof window.editandrelateEntry === 'function' && !isSingle && window.editandrelateEntry(); //联动同步关联组件(app3460)
        let cleanedAltertitle = versionInfo.Altertitle !== versionInfo.Vertitle.replace(/\(無修正\)/g, '') ? versionInfo.Altertitle : '';
        if (isSeries) {
            versionInfo.Vertitle = versionInfo.Vertitle.replace(/\s*\(\d+\)$/, '');
            cleanedAltertitle = cleanedAltertitle.replace(/\s*\(\d+\)$/, '');
            }
        if (versionInfo.Verpublisher.includes("@")) {
            [versionInfo.Verpublisher, versionInfo.Verlogo] = versionInfo.Verpublisher.split("@");
            };
        const newVerBlock = `|版本:${formattedVer}={
${formattedVer !== '实体版' ? `[版本名|${versionInfo.Vertitle}]` : ''}
${['英文', '日文', '韩文'].includes(Verlanguage) ? '' : `[别名|${cleanedAltertitle}]`}
${formattedVer !== '实体版' ? `[语言|${Verlanguage}]` : ''}
${isSeries ? `[价格|]` : `[价格|${Verprice}${versionInfo.Verpricing}]`}
${versionInfo.Verlabel ? `[书系|${versionInfo.Verlabel}]` : ''}
${versionInfo.Verlogo ? `[图书品牌|${versionInfo.Verlogo}]` : ''}
${['简体中文', '越文'].includes(Verlanguage) ? `[出品方|${versionInfo.Verpublisher}]\n[出版社|${versionInfo.Vercnpublisher}]` : `[出版社|${versionInfo.Verpublisher}]`}
[发售日|${versionInfo.Verdate}]
${isSeries ? `[册数|${versionInfo.Verbooks}册既刊]` : `[页数|${versionInfo.Verpages}]`}
${formattedVer === '原视觉版' ? (isSeries ? '[全套EAN|]' : '[EAN|4711117]\n[EAN|4712568]') : formattedVer === '未数版' ? (isSeries ? '[全套EAN|]' : '[EAN|471256860]') : (isSeries ? '[全套ISBN|]' : `[ISBN|${versionInfo.VerISBN}]`)}
${formattedVer !== '实体版' ? `[译者|${versionInfo.Vertranslator}]` : ''}
}`;
        infoboxTextarea.val(infoboxTextarea.val().replace(/\}\}$/, `${newVerBlock}\n}}`));
    }

    const publisherMap = [
        [/台角|台[灣湾]角川|^TAJ$/i, '台角版', '台灣角川', 'TW'],
        [/天角|天[聞闻]角川|^TJ$|^TIJ$/i, '天角版', '天闻角川', 'CN'],
        [/[後后]浪|^HL$/i, '后浪版', '后浪', 'CN'],
        [/[東东]立|^DL$/i, '东立版', '東立出版社', 'TW'],
        [/青文|^QW$/i, '青文版', '青文出版社', 'TW'],
        [/東販|东贩|^DF$/i, '东贩版', '台灣東販', 'TW'],
        [/长鸿|長鴻|^CH$/i, '长鸿版', '長鴻出版社', 'TW'],
        [/尖端|^JD$/i, '尖端版', '尖端出版', 'TW'],
        [/未[數数]|未[來来][數数]位|^WS$|^WLSW$/i, '未数版', '未來數位', 'TW'],
        [/^dart$|^d\/art$|原[動动]力[視视][覺觉]|^YSJ$/i, '原视觉版', '原動力視覺(發行)／未來數位(經銷)', 'TW'],
        [/[紳绅]士|^SS$/i, '绅士版', '紳士出版', 'TW'],
        [/暮想|^MX$|^MS$/i, '暮想版', '暮想出版', 'TW'],
        [/[買买][動动]漫|[買买][對对][動动]漫|^MDM$|^MDDM$/i, '买动漫版', '買對動漫', 'TW'],
        [/更生|^GS$/i, '更生版', '更生文化設計', 'TW'],
        [/臉譜|脸谱|^LP$/i, '脸谱版', '臉譜出版', 'TW'],
        [/平心|^PX$|^PS$/i, '平心版', '平心出版', 'TW'],
        [/深空|^SK$/i, '深空版', '深空出版', 'TW'],
        [/威向|^WX$/i, '威向版', '威向文化', 'TW'],
        [/鯨嶼|鲸屿|^JY$/i, '鲸屿版', '鯨嶼文化', 'TW'],
        [/[獨独]步|^DB$/i, '独步版', '獨步文化', 'TW'],
        [/大[塊块]|^DK$/i, '大块文化版', '大塊文化', 'TW'],
        [/时报|時報|^SB$/i, '时报版', '時報文化', 'TW'],
        [/皇冠|^HG$/i, '皇冠版', '皇冠文化', 'TW'],
        [/[遠远]足|^YZ$/i, '远足版', '遠足文化', 'TW'],
        [/大然|^DR$/i, '大然版', '大然文化', 'TW'],
        [/玉皇朝|^YHC$/i, '玉皇朝版', '玉皇朝', 'HK'],
        [/^天下$|天下出版|^TX$|^TS$/i, '天下版', '天下出版', 'HK'],
        [/文[傳传]|文化[傳传]信|^WC$|^WHCX$|^WHCS$/i, '文传版', '文化傳信', 'HK'],
        [/日[本國国文语語]|^JP$|^JA$/i, '日本版', '', 'JP'],
        [/韓[國国文语語]|^KR$/i, '韩国版', '', 'KR'],
        [/實體|实体|^0$|^ST$/i, '实体版', '', 'KR'],
        [/北美|[英美][文语語]|美[國国]|^NA$/i, '北美版', '', 'NA'],
        [/英[國国文语語]|^EN$/i, '英国版', '', 'EN'],
        [/法[國国文语語]|^FR$/i, '法国版', '', 'FR'],
        [/德[國国文语語]|^DE$/i, '德国版', '', 'DE'],
        [/越南|越[國国文语語]|^VN$/i, '越南版', '', 'VN'],
        [/泰[國国文语語]|^TH$/i, '泰国版', '', 'TH'],
        [/野人/i, '野人版', '野人文化', 'TW'],
        [/瑞昇|^RS$/i, '瑞昇版', '瑞昇文化', 'TW'],
        [/青空|^QK$/i, '青空版', '青空文化', 'TW'],
        [/三采/i, '三采版', '三采文化', 'TW'],
        [/逗[點点]/i, '逗点文创版', '逗點文創結社', 'TW'],
        [/[馬马]可孛[羅罗]/i, '马可孛罗版', '馬可孛羅文化', 'TW'],
        [/漫[遊游]者|^MYZ$/i, '漫游者版', '漫遊者文化', 'TW'],
        [/春天|^CT$/i, '春天版', '春天出版', 'TW'],
        [/大辣/i, '大辣版', '大辣出版', 'TW'],
        [/二十[張张]/i, '二十张版', '二十張出版', 'TW'],
        [/三日月/i, '三日月版', '三日月書版', 'TW'],
        [/知翎/i, '知翎版', '知翎文化', 'TW'],
        [/奇幻基地/i, '奇幻基地版', '奇幻基地', 'TW'],
        [/平[裝装]本/i, '平装本版', '平裝本出版', 'TW'],
        [/[亂乱]搭|巴比[樂乐][視视]|^RT$|^RD/i, '乱搭版(电子)', '巴比樂視', 'TW'],
        [/[瑪玛]朵/i, '玛朵版', '瑪朵出版', 'TW'],
        [/博漫/i, '博漫版', '博漫出版', 'TW'],
        [/尚禾/i, '尚禾版', '尚禾文化', 'TW'],
        [/銘顯|铭显/i, '铭显版', '銘顯文化', 'TW'],
        [/青[馬马]/i, '青马版', '青马文化', 'CN'],
        [/未[來来]/i, '未来版', '未來出版', 'TW'],
        [/新雨/i, '新雨版', '新雨出版', 'TW'],
        [/寂寞/i, '寂寞版', '寂寞出版', 'TW'],
        [/原[動动]力/i, '原动力版', '原動力文化', 'TW'],
        [/飛燕|飞燕/i, '飞燕版', '飛燕文創', 'TW'],
        [/漫[編编]室/i, '漫编室版', '读库文化@漫编室', 'CN'],
        [/(?=.*磨[铁鐵])(?=.*文治)/i, '磨铁版', '磨铁图书@文治', 'CN'],
        [/(?=.*磨[铁鐵])(?=.*大[鱼魚])/i, '磨铁版', '磨铁图书@大鱼读品', 'CN'],
        [/磨[铁鐵]/i, '磨铁版', '磨铁图书', 'CN'],
        [/(?=.*中信)(?=.*墨狸)/i, '中信版', '中信出版集团@墨狸', 'CN'],
        [/(?=.*中信)(?=.*大方)/i, '中信版', '中信出版集团@大方', 'CN'],
        [/(?=.*中信)(?=.*[无無]界)/i, '中信版', '中信出版集团@无界', 'CN'],
        [/(?=.*中信)(?=.*春潮)/i, '中信版', '中信出版集团@春潮', 'CN'],
        [/(?=.*中信)(?=.*雅信)/i, '中信版', '中信出版集团@雅信', 'CN'],
        [/(?=.*中信)(?=.*小[满滿])/i, '中信版', '中信出版集团@小满', 'CN'],
        [/(?=.*中信)(?=.*24小[时時])/i, '中信版', '中信出版集团@24小时', 'CN'],
        [/中信/i, '中信版', '中信出版集团', 'CN'],
        [/新經典/i, '新经典版', '新經典文化', 'TW'],
        [/新经典/i, '新经典版', '新经典文化', 'CN'],
        [/森雨漫/i, '森雨版', '森雨文化@森雨漫', 'CN'],
        [/森雨/i, '森雨版', '森雨文化', 'CN'],
        [/橘子洲/i, '橘子洲版', '@橘子洲', 'CN'],
        [/(?=.*未[读讀])(?=.*文[艺藝]家)/i, '未读版', '联合天际@未读·文艺家', 'CN'],
        [/(?=.*未[读讀])(?=.*探索家)/i, '未读版', '联合天际@未读·探索家', 'CN'],
        [/(?=.*未[读讀])(?=.*[艺藝][术術]家)/i, '未读版', '联合天际@未读·艺术家', 'CN'],
        [/(?=.*未[读讀])(?=.*思想家)/i, '未读版', '联合天际@未读·思想家', 'CN'],
        [/(?=.*未[读讀])(?=.*未小[读讀])/i, '未读版', '联合天际@未读·未小读', 'CN'],
        [/未[读讀]/i, '未读版', '联合天际@未读', 'CN'],
        [/力潮/i, '力潮版', '力潮文创', 'CN'],
        [/(?=.*中青)(?=.*雄[狮獅])/i, '中青版', '中青雄狮', 'CN'],
        [/漫友/i, '漫友版', '漫友文化', 'CN'],
        [/[华華]文天下/i, '华文天下版', '华文天下', 'CN'],
        [/博集/i, '博集版', '博集天卷', 'CN'],
        [/千[寻尋]/i, '千寻版', '千寻文化', 'CN'],
        [/天使文化/i, '天使版', '天使文化', 'CN'],
        [/次元[书書][馆館]/i, '次元书馆版', '红阅科技@次元书馆', 'CN'],
        [/知音/i, '知音版', '知音动漫', 'CN'],
        [/紫[图圖]/i, '紫图版', '紫图图书', 'CN'],
        [/白[马馬][时時]光/i, '白马时光版', '白马时光', 'CN'],
        [/魅[丽麗]/i, '魅丽版', '魅丽文化', 'CN'],
        [/儒意欣欣/i, '儒意欣欣版', '儒意欣欣', 'CN'],
        [/[联聯]合[读讀][创創]/i, '联合读创版', '联合读创', 'CN'],
        [/漫[娱娛][图圖][书書]/i, '漫娱版', '漫娱图书', 'CN'],
        [/漫[娱娛]文化/i, '漫娱版', '漫娱文化', 'CN'],
        [/星文/i, '星文版', '星文文化', 'CN'],
    ];
    const areaMap = {
        'TW': ['繁体中文', 'NT$'],
        'CN': ['简体中文', '¥'],
        'HK': ['繁体中文', 'HK$'],
        'JP': ['日文', '¥'],
        'KR': ['韩文', '₩'],
        'NA': ['英文', '$'],
        'EN': ['英文', '£'],
        'FR': ['法文', '€'],
        'DE': ['德文', '€'],
        'VN': ['越文', '₫'],
        'TH': ['泰文', '฿'],
    };
})(jQuery);
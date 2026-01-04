// ==UserScript==
// @name         商城道具详情页增加视频预览按钮
// @namespace    https://greasyfork.org/zh-CN/users/1300889
// @version      1.1.1
// @description  在商城道具的详情页面添加一个按钮，点击就能跳转到B站的预览视频
// @author       浮砂
// @license      MIT
// @match        http*://qu.sdo.com/product-detail/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sdo.com
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/524968/%E5%95%86%E5%9F%8E%E9%81%93%E5%85%B7%E8%AF%A6%E6%83%85%E9%A1%B5%E5%A2%9E%E5%8A%A0%E8%A7%86%E9%A2%91%E9%A2%84%E8%A7%88%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/524968/%E5%95%86%E5%9F%8E%E9%81%93%E5%85%B7%E8%AF%A6%E6%83%85%E9%A1%B5%E5%A2%9E%E5%8A%A0%E8%A7%86%E9%A2%91%E9%A2%84%E8%A7%88%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

/*
—————————————————■ 更新日志 ■————————————————————
▲ 2025-02-28 v1.1.1
 * [新增] 追加了玛雪莉套装、蒙特套装和风火锅的预览视频
▲ 2025-02-05 v1.1.0
 * [优化] 为各个生产采集复制品时装及约定之锤系列武器添加
     了时间戳信息，从而使得点击详情页的按钮后能够直接跳转
     到视频中这一时装开始展示的时间点。
 * [优化] 为了方便反馈和协作，为还没有设置合适预览视频的
     道具页面添加了提示UI。
■——————————————————————————————————————————————■
 */

(function() {
    'use strict';
    const pluginKeys = {
        dontShowEmptyTip: 'tmPlugin_infsein_DontShowEmptyTipInSdoStore'
    }

    const videoMap = new Map([
        // * 坐骑
        ['1889586305301655552', 'BV1n4AaexEv7'], // 风火锅

        // * 非玩家角色时装
        ['1893877531580477440', 'BV1JF6TYtEXZ'], // 玛雪莉套装
        ['1893876437248815104', 'BV1JF6TYtEXZ'], // 蒙特套装
        ['1795005867304886272', 'BV1Tm42177cB'], // 水晶都神童套装
        ['1729029334363242496', 'BV19H4y1D7cE'], // 冰心套装
        ['1673893209894965248', 'BV1dM411j7fr'], // 新款阿莉塞服装套装
        ['1655445924001509376', 'BV1h24y1h7FV?t=1'], // 盖娅服装套装
        ['1655435556067897344', 'BV1h24y1h7FV?t=15'], // 约定之锤武器箱
        ['1655434557370560512', 'BV1h24y1h7FV?t=152'], // 幽暗的约定之锤
        ['1655434132982493184', 'BV1h24y1h7FV?t=128'], // 黄道的约定之锤
        ['1655432967871950848', 'BV1h24y1h7FV?t=60'], // 荒芜的约定之锤
        ['1655432579399708672', 'BV1h24y1h7FV?t=39'], // 漆黑的约定之锤
        ['1655431855949377536', 'BV1h24y1h7FV?t=15'], // 蔽日的约定之锤
        ['1655433344595947520', 'BV1h24y1h7FV?t=81'], // 暗影的约定之锤
        ['1655433786042249216', 'BV1h24y1h7FV?t=104'], // 灵极的约定之锤
        ['1557311014276083712', 'BV15Y4y1x7W6'], // 阿拉米格莉瑟服装套装
        ['1516685016157556736', 'BV1tZ4y1Z7jq'], // 欧米茄M服装套装
        ['1516685614428884992', 'BV1tZ4y1Z7jq'], // 欧米茄F服装套装
        ['c80087d9b75a2b4cac14', 'BV1xo4y1o71V'], // 新款阿尔菲诺服装套装
        ['0393a928806be8f6b2fa', 'BV17V411p79X'], // 巫女套装
        // ['58675f5a134151bb0b93', ''], // 纯白套装 - 缺失
        ['83e20739c35936fd0e77', 'BV1o7411T7My'], // 血盟魔女套装
        ['69be7e4c5ed32e4acd1a', 'BV1o7411T7My'], // 逐夜者
        // ['47816fd4b1f79b404b55', ''], // 雅·修特拉新装 - 缺失
        // ['2b00f8891dfeda4d9526', ''], // 血盟女士套装 - 缺失
        // ['2b228e70c2e02a775a47', ''], // 桑克瑞德新装 - 缺失 // “敏菲利亚！我……” - NpcYell #12839
        // ['f6523eb2fc38c8fd11b7', ''], // 艾达套装 - 缺失
        ['e0ffe7338e3224f858d7', 'BV1kJ411Q7U2'], // 威风凛凛套装
        ['54f859b7ef62ac2aaf95', 'BV1gA411j7KA'], // 萨雷安神童装
        // ['62dd29c49ebc0f83cb09', ''], // 飞燕套装 - 缺失
        // ['8a7242aea6919c77db70', ''], // 破损的绅士套装 - 缺失
        // ['dbd36155f79ff87c49cf', ''], // 豪雪套装 - 缺失
        // ['4b4e12c1c53d4a540b76', ''], // 总骑士长套装 - 缺失
        // ['063e574dcf9a7f0e052b', ''], // 苍穹骑士套装 - 缺失
        // ['fb5e93dbfdf2eaba42c2', ''], // 苍穹法师套装 - 缺失
        // ['012ce1c4ce700cd7774f', ''], // 血盟解放者套装 - 缺失
        // ['2809f79aa105bc8931e5', ''], // 血盟咒术套装 - 缺失 // “与老师走着同一条路的他，做出了与老师相同的选择，将未来托付给了我们吗……” - quest/023/HeaVnf105_02355 #63
        ['30da7de6e878d1c5666f', 'BV1q4411B73d'], // 血盟聆听者套装
        // ['47e3a46fd02be80db9e1', ''], // 西德套装 - 缺失
        // ['4d1bea3a8b40927029f2', ''], // 血盟拳手套装 - 缺失
        // ['75e608e1d8207888e9fe', ''], // 血盟幻术套装 - 缺失
        // ['79def9c6a36f2234b43e', ''], // 血盟盗贼套装 - 缺失
        // ['81ad8a5199f8f15f86b5', ''], // 血盟记录者套装 - 缺失 // “我这就去你身边……穆恩布瑞达……” - InstanceContentTextData #13332
        // ['c0bb8f3f4c8dd0ee37f8', ''], // 加隆德套装 - 缺失

        // * 特典时装
        ['1865954548748824576', 'BV19N4y1i7cF'], // 林地守护者
        ['1711300698663751680', 'BV1Yh4y1M7g3'], // 领主套装
        ['1701434368003346432', 'BV1au4y1q77U'], // 魔导套装
        ['1681541410244440064', 'BV1qk4y147f3'], // 就学套装（裤装版）
        ['1681541907114274816', 'BV1qk4y147f3'], // 就学套装（裙装版）
        ['b794d087023392307efb', 'BV16R4y187PV'], // 山间少女
        ['e4d75218ab8d814069b8', 'BV16R4y187PV'], // 登山套
        ['1608309545211965440', 'BV1nd4y1u72S'], // 猫小胖套装
        ['1557306089861197824', 'BV1rv4y1u7Y2'], // 街头套装
        ['2043d7f3272aecda7596', 'BV1Jv41177RS'], // 志士套装
        ['c7090d9a43be6abbf6e0', 'BV1MT4y1M7sY'], // 学院制服（领带）套装
        ['e46a4f31d216464d3448', 'BV1MT4y1M7sY'], // 学院制服（蝴蝶结）套装
        ['be1fe64525dfb90e2fd3', 'BV19D4y1Q7jv'], // 女仆套装
        ['392a0e83fcb02dd3feb8', 'BV19D4y1Q7jv'], // 管家套装
        ['1777990241872977920', 'BV1BK411574o'], // 美格雅卡套装
        ['10d73429f0e4ec678a17', 'BV1F541157Vz'], // 东方贵人套装
        ['b76fe674147004048ec5', 'BV185411J7SP'], // 风雅套装
        ['d926f382039d7919683f', 'BV1p7411H7pz'], // 孔雀套
        ['8e253c0d35b9f60c1590', 'BV1iK4y1a7XF'], // 东方美玉套装
        ['d4f5cf57ed90cf12946f', 'BV1iK4y1a7XF'], // 东方雅士套装
        ['63ddbb7427d0fda349a7', 'BV1dv4y1o7Qt'], // 东方丽人套装
        ['8b0f54b9b6147185359e', 'BV1dv4y1o7Qt'], // 东方雅人套装
        ['3dab257d315500d90305', 'BV1aN411o7Ko'], // 东方秀女套装
        ['8ddb2593e90a4293f221', 'BV1aN411o7Ko'], // 东方公子套装
        ['4f9f32a263ee537c0971', 'BV13y4y1b7mF'], // 东方女官套装
        ['bf0d15b17f78827df21a', 'BV13y4y1b7mF'], // 东方警卫套装
        ['b70142cdaa706f03d1da', 'BV1D54y1s71m'], // 东方武官套
        ['369de7c00b7d321af57c', 'BV1D54y1s71m'], // 东方美姬套
        ['1e3280e1173b96b9d5a1', 'BV1gz4y1y76X'], // 东方书生套
        ['81433db83a10fe38ae7a', 'BV1gz4y1y76X'], // 东方女生套
        ['037c11149442c1fbe99d', 'BV1kD4y1X7yh'], // 辨天套装
        ['f639271d42579d7c5eff', 'BV1kD4y1X7yh'], // 门客套装
        ['25af48e95c7f66074d32', 'BV1gA411x7Fx'], // 哪吒白莲套装
        ['df82f768dfea8ddee818', 'BV1gA411x7Fx'], // 哪吒赤莲套装
        ['15659bcf629eca9b5e3f', 'BV1X1421t7MF'], // 天使套装
        ['c0bf3ad6150be0398f84', 'BV1sa411F7CJ'], // 恶魔套装
        ['ee73c5184a8ef2078cfc', 'BV1GK4y1f726'], // 上仙套装
        ['5ce8c34a82e5373ceb16', 'BV1Ks411j7kV'], // 王子套装
        ['1777991409021952000', 'BV1Ks411j7kV?t=26'], // 公主套装
        ['06603348f535d4f7831d', 'BV1CA411N79c'], // 大召唤士套装
        ['e40a04d2a3f066b7e220', 'BV1CA411N79c'], // 艾普套装
        // ['50d377c609048e2342f8', ''], // 绿宝石兽套装 - 缺失
        // ['fe84f89100ce90342cbc', ''], // 黄宝石兽套装 - 缺失
        // ['e382d8c84742990124f5', ''], // 红宝石兽套装 - 缺失
        ['76573ffc33704e2024c2', 'BV1op4y1Q7pU'], // 莫古莫古套装
        // * 特典时装 - 生产采集复制品
        ['1832987093223292928', 'BV1dq4y1x7Cj?t=61'], // 宝石专业专用复制品
        ['1833000412906733568', 'BV1dq4y1x7Cj?t=193'], // 海洋专业专用复制品
        ['1832989715850280960', 'BV1dq4y1x7Cj?t=220'], // 田野专业专用复制品
        ['1832989110624796672', 'BV1dq4y1x7Cj?t=165'], // 地质专业专用复制品
        ['1832988781132857344', 'BV1dq4y1x7Cj?t=146'], // 营养专业专用复制品
        ['1832985722424082432', 'BV1dq4y1x7Cj?t=1'], // 林木专业专用复制品
        ['1832988101508808704', 'BV1dq4y1x7Cj?t=104'], // 衣装专业专用复制品
        ['1832986279389904896', 'BV1dq4y1x7Cj?t=20'], // 冶金专业专用复制品
        ['1832986718567088128', 'BV1dq4y1x7Cj?t=41'], // 板甲专业专用复制品
        ['1832987450095648768', 'BV1dq4y1x7Cj?t=82'], // 皮革专业专用复制品
        ['1832988417348288512', 'BV1dq4y1x7Cj?t=127'], // 炼化专业专用复制品
        ['1555114016349270016', 'BV1sA411H7q1?t=537'], // 烹宰套装复制品
        ['1555113624181846016', 'BV1sA411H7q1?t=349'], // 炼魔套装复制品
        ['1555112881676791808', 'BV1sA411H7q1?t=1'], // 邪衣套装复制品
        ['1555112220323131392', 'BV1sA411H7q1?t=169'], // 妖革套装复制品
        ['1555108239219798016', 'BV1sA411H7q1?t=631'], // 恶金套装复制品
        ['1555106742868291584', 'BV1sA411H7q1?t=85'], // 凶甲套装复制品
        ['1555104810103648256', 'BV1sA411H7q1?t=444'], // 怪铁套装复制品
        ['1555103979035865088', 'BV1sA411H7q1?t=255'], // 异木套装复制品
        ['1555114426527035392', 'BV1Ey4y1m7xo?t=1'], // 鬼矿套装复制品
        ['1555118257088409600', 'BV1Ey4y1m7xo?t=195'], // 犷野套装复制品
        ['1555118971915251712', 'BV1Ey4y1m7xo?t=98'], // 渔劫套装复制品
        ['5c2855fd1456a00d5fd7', 'BV1BQ4y1h7Bh?t=175'], // 玄甲套装复制品
        ['64a49781bf9f95174bab', 'BV1BQ4y1h7Bh?t=1'], // 圣铁套装复制品
        ['8295df7972ab037adcbb', 'BV1BQ4y1h7Bh?t=87'], // 仙木套装复制品
        ['ecdaac79ad44323878d4', 'BV1BQ4y1h7Bh?t=350'], // 鎏金套装复制品
        ['f254ae897d527e799edd', 'BV1BQ4y1h7Bh?t=526'], // 烹炙套装复制品
        ['fc85834ced5cac24b3b3', 'BV1BQ4y1h7Bh?t=441'], // 绮衣套装复制品
        ['fc967f229f21d74e47b7', 'BV1BQ4y1h7Bh?t=266'], // 韦革套装复制品
        ['ff950146fd1e8a961370', 'BV1BQ4y1h7Bh?t=612'], // 炼师套装复制品
        ['2632d9ce7d5ce4c1ff7d', 'BV1H54y1H7S7?t=87'], // 百草套装复制品
        ['3c52e01171ee8b48ed0f', 'BV1H54y1H7S7?t=1'], // 渔采套装复制品
        ['96428af5fa875beacb03', 'BV1H54y1H7S7?t=170'], // 精矿套装复制品
        ['3e3cada1b19f742cffe4', 'BV11U4y157Gf?t=558'], // 戎甲套装复制品
        ['438d39029dd909ba71b5', 'BV11U4y157Gf?t=315'], // 炼真套装复制品
        ['51b5bed103e9742140d2', 'BV11U4y157Gf?t=79'], // 镂金套装复制品
        ['56d8a1f8a097d680e871', 'BV11U4y157Gf?t=157'], // 镔铁套装复制品
        ['5f5fa79633bc65094933', 'BV11U4y157Gf?t=340'], // 烹饪套装复制品
        ['7164f4d586e14a1d4469', 'BV11U4y157Gf?t=1'], // 锦衣套装复制品
        ['8e8f5b05c63070d22eab', 'BV11U4y157Gf?t=478'], // 精革套装复制品
        ['609c576cd155d762f125', 'BV11U4y157Gf?t=236'], // 珍木套装复制品
        ['ebceeaa969a07cacd962', 'BV1dK4y1m7dd?t=154'], // 富矿套装复制品
        ['237f8ec5c30fb9a776f6', 'BV1dK4y1m7dd?t=1'], // 园野套装复制品
        ['36791453c7a8227298ba', 'BV1dK4y1m7dd?t=77'], // 渔灯套装复制品
        // ['26fb2056819efffc8e4e', ''], // 炼金套装复制品 - 缺失
        // ['5b025ed68d6cfcfe0c07', ''], // 木匠套装复制品 - 缺失
        // ['5b05dc71caf293f0be82', ''], // 甲匠套装复制品 - 缺失
        // ['7042298f1b0a4457e576', ''], // 烹调套装复制品 - 缺失
        // ['7896094308de9b46012f', ''], // 革匠套装复制品 - 缺失
        // ['90e7077de89c7579818e', ''], // 铁匠套装复制品 - 缺失
        // ['b3a98e5b9be5142f9044', ''], // 衣匠套装复制品 - 缺失
        // ['f71ad323b9e99a1ab57f', ''], // 金匠套装复制品 - 缺失
        // ['d6cf1adacdd99fdcea0f', ''], // 矿工套装复制品 - 缺失
        // ['f85233426aae9ad429bb', ''], // 渔人套装复制品 - 缺失
        // ['fdb96a6185a171df18c5', ''], // 樵夫套装复制品 - 缺失

        /*
        ['', ''], //
        ['', ''], //
        ['', ''], //
        ['', ''], //
        ['', ''], //
        ['', ''], //
        ['', ''], //
        ['', ''], //
        */
    ])

    const getPageId = () => {
        const regex = /https:\/\/qu\.sdo\.com\/product-detail\/([a-zA-Z0-9]+)/
        const match = document.location.href.match(regex)
        return match ? match[1] : ''
    }
    const generateBtn = (url) => {
        const container = document.createElement('div')
        container.style = 'overflow: hidden; margin-top: 20px;'

        const btn = document.createElement('span')
        btn.innerHTML = '视频预览'
        btn.title = '跳转到此道具在B站的预览视频'
        btn.style = 'width: 180px; float: left; margin-right: 20px; text-align: center; line-height: 44px; font-size: 20px; color: #fff; background: #2080F0; border: 1px solid #2080F0; cursor: pointer;'
        btn.addEventListener('click', () => {
            window.open(url)
        })

        container.appendChild(btn)
        document.querySelector('div.detail-right-btn').after(container)
    }
    const generateEmptyTooltip = () => {
        const container = document.createElement('div')
        container.style = 'overflow: hidden; margin-top: 20px; background: rgba(237, 245, 254, 1); border: 1px solid rgba(199, 223, 251, 1); width: fit-content; padding: 10px 25px;'

        const tipIcon = document.createElement('div')
        tipIcon.innerHTML = `<i style="fill: currentColor;"><svg viewBox="0 0 28 28" version="1.1" xmlns="http://www.w3.org/2000/svg"><g stroke="none" stroke-width="1" fill-rule="evenodd"><g fill-rule="nonzero"><path d="M14,2 C20.6274,2 26,7.37258 26,14 C26,20.6274 20.6274,26 14,26 C7.37258,26 2,20.6274 2,14 C2,7.37258 7.37258,2 14,2 Z M14,11 C13.4477,11 13,11.4477 13,12 L13,12 L13,20 C13,20.5523 13.4477,21 14,21 C14.5523,21 15,20.5523 15,20 L15,20 L15,12 C15,11.4477 14.5523,11 14,11 Z M14,6.75 C13.3096,6.75 12.75,7.30964 12.75,8 C12.75,8.69036 13.3096,9.25 14,9.25 C14.6904,9.25 15.25,8.69036 15.25,8 C15.25,7.30964 14.6904,6.75 14,6.75 Z"></path></g></g></svg></i>`
        tipIcon.style = 'width: 17px; height: 17px; margin-right: 5px; color: #2080f0;'

        const tipContent1 = document.createElement('div')
        const _text = document.createElement('span')
        _text.innerHTML = `这个商品还没有找到合适的的预览视频。如果想要提供帮助或反馈问题，请点击`
        const _a_fb = document.createElement('a')
        _a_fb.href = 'https://bbs.nga.cn/read.php?tid=43132367'
        _a_fb.target = '_blank'
        _a_fb.innerHTML = `这里`
        _a_fb.style = 'color: #18A058; margin-left: 3px;'

        const tipContent2 = document.createElement('div')
        const _text2 = document.createElement('span')
        _text2.innerHTML = `如果不想再看到这个提示，请点击`
        const _a_nomoretip = document.createElement('a')
        _a_nomoretip.href = 'javascript:void(0)'
        _a_nomoretip.addEventListener('click', () => {
            if (window.confirm('确定吗?\n此操作不可撤销')) {
                GM_setValue(pluginKeys.dontShowEmptyTip, 1)
                container.style = 'display: none;'
            }
        })
        _a_nomoretip.innerHTML = `这里`
        _a_nomoretip.style = 'color: #18A058; margin-left: 3px;'

        tipContent1.appendChild(_text)
        tipContent1.appendChild(_a_fb)
        tipContent2.appendChild(_text2)
        tipContent2.appendChild(_a_nomoretip)

        const line1 = document.createElement('div')
        line1.style = 'display: flex; align-items: center;'
        line1.appendChild(tipIcon)
        line1.appendChild(tipContent1)
        const line2 = document.createElement('div')
        line2.style = 'display: flex; align-items: center; font-size: 12px;'
        line2.appendChild(tipContent2)

        container.appendChild(line1)
        container.appendChild(line2)
        document.querySelector('div.detail-right-btn').after(container)
    }

    const _interval = setInterval(() => {
        const pageId = getPageId()
        if (pageId) {
            if (videoMap.has(pageId)) {
                const biliId = videoMap.get(pageId)
                generateBtn(`https://www.bilibili.com/video/${biliId}`)
            } else if (!GM_getValue(pluginKeys.dontShowEmptyTip)) {
                generateEmptyTooltip()
            }
            clearInterval(_interval)
        }
    }, 100)

})();
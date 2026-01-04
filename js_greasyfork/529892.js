// ==UserScript==
// @name         [银河奶牛]常见问题答疑
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在游戏中添加自定义信息页签
// @author       sangshiCHI
// @license      sangshiCHI
// @match        https://www.milkywayidle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/529892/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98%E7%AD%94%E7%96%91.user.js
// @updateURL https://update.greasyfork.org/scripts/529892/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98%E7%AD%94%E7%96%91.meta.js
// ==/UserScript==



(function() {
    'use strict';

    // 配置项
    const config = {
        searchPlaceholder: '输入关键词搜索...',
        noResultsText: '没有找到相关内容',
        contentData: [
            {
        title: "前言",
        content: `
               游戏禁止多开，一人一账户三角色（1标准2铁牛/3铁牛）；禁止倒钱；每天扫描，违者封号——Stella<br>
               推荐新人攻略：
            <a href="https://test-ctmd6jnzo6t9.feishu.cn/docx/KG9ddER6Eo2uPoxJFkicsvbEnCe"
               class="external-link"
               target="_blank"
               rel="noopener noreferrer">
               牛牛手册
            </a><br>
               QQ群：
               <a href="https://qm.qq.com/q/ek1s7tN4OI"
               class="external-link"
               target="_blank"
               rel="noopener noreferrer">
               银河奶牛放置交流1群
            </a>
            <a href="https://qm.qq.com/q/tKMQYkQ920"
               class="external-link"
               target="_blank"
               rel="noopener noreferrer">
               银河奶牛放置交流2群
            </a>
        `
    },
            {title: "刚玩我该做什么？",
             content: `
               推荐先看牛牛手册<br>
               个人主观建议：先提升总等级至750级（平均等级45左右），大概需要4-7天时间（喜欢的生活技能的优先到60以便装备生活装备）<br>
               购买并装备巨大袋子（白板即可提示巨大，装备要求：总等级750级）。
               然后专精一种生活技能，直到他到80级后买（不要自己做）一个+5以上的神圣工具吃喝拉满（具体喝什么群里输入：茶）。<br>
               赚了钱后再买一件+5以上的生活装备（先买工具再买装备），房子看情况升级。<br>
               最后沉淀赚钱，开始战斗！
  `},
            {title: "冻结资金是什么？",
             content: `
               在市场使用“购买挂牌”购买物品时，会预先扣除掉钱，预存在市场，直到交易成功<br>
               如果撤单会全额返还
  `},
            {title: "冻结资金是负的？",
             content: `
               网页缓存引起的BUG，刷新网页即可恢复
  `},
            {title: "我该选择什么职业？",
             content: `
             新人跟攻略先750，然后生活存钱。战斗毕业装需要3000M以上资金，至少得有上百M现金之后在考虑专职战斗。具体职业可以等4月新版本出来之后再选择。（2025/3/15回复）
  `},
           {title: "填单/扫单是什么意思？",
             content: `
             扫单填单是牛牛专用术语：<br>
             扫单是主动买掉左侧现有卖单，以卖方优势价格成交；<br>
             填单是主动卖给右侧现有买单，以买方优势价格成交。
  `},
            {title: "我现在该打什么怪？",
             content: `
             战斗模拟
  `},
            {title: "强化升级",
             content: `
             0-35级：鳄鱼皮甲      （沼泽精华涨价太多 暂不推荐   螃蟹手或许更合适 30金币价格 价格变动自己权衡）<br>
             35-60级：治疗之书<br>
             60-70级：哥布林防御者<br>
             70级+ 元素之书<br>
  `},
            {title: "炼金升级/速升级",
             content: `
             普通升级：<br>
             分解糖（0-10）<br>
             →苹果（10-20）<br>
             →橘子（20-35）<br>
             →竹子/紫茶叶（35-50）<br>
             →桃子/哞龙茶叶（50-65）<br>
             →红茶叶（65-80）<br>
             <br>
             速升级：<br>
             喝经验/催化/究极炼金茶亏钱练级<br>
             重组海洋精华（炼金1级）<br>
             →丛林精华（10-23级）<br>
             →哥布林精华（23-45级）<br>
             →眼球精华（45-53级）<br>
             →熊熊精华（53-65级）<br>
             65之后不建议用重组练级了，可以把究炼茶换成效率茶直接点金熊精华开始赚钱了。<br>
             如果想继续练可以继续重组熊精华。
  `},
            {title: "效率是什么？",
             content: `
             效率：立即完成一次当前动作的概率。<br>
             效率具有以下特性：<br>
             (1)被视为另一次完整的动作，即:可以获得经验，可以获得稀有掉落等。<br>
             (2)当效率大于100%时，则每次读条必定完<br>成两次行动，超过100%的部分为再获得一次行动(第三次)的概率。
  `},
            {title: "为什么喝了茶以后带小数",
             content: `
             游戏内的小数部分都是按期望计算的：<br>
             举例1：获得3.2个咖啡豆，则80%概率获得3个咖啡豆，20%概率获得4个咖啡豆；<br>
             举例2：消耗8.9个布，则90%概率消耗9个布，10%概率消耗8个布<br>
             举例3：效率123%，则77%概率立即多完成1次，23%概率立即多完成2次。<br>
  `},
            {title: "公会有什么用？",
             content: `
             目前公会没有玩法功能支持，只有社交属性，或者视奸别人。可以期待后续的开发
  `},
            {title: "邮箱/steam相关问题",
             content: `
             1. steam 怎么在网页玩啊？<br>
----使用steam启动游戏，在设置-账户中绑定邮箱。<br>

2. 不小心同时创建了steam和网页版两个账号，并且想保留网页版账号<br>
----使用steam启动游戏，私聊mooooooooo，说“I want to unlink my steam account”。等开发者帮你解绑之后，再重新启动游戏，登陆时选择绑定已有账户。<br>

3. 不小心同时创建了steam和网页版两个账号，并且想保留steam版账号<br>
----使用网页版登录游戏，在设置-账户中将邮箱改为一个随机乱码邮箱（例如：dsaofjoisanfosn@qq.com）。再使用steam启动游戏，在设置-账户中绑定正确的邮箱
  `},
            {title: "队列是什么？",
             content: `
             队列的意义是，让你可以放心干多步操作，并且不会闲置。<br>
比如泡究极茶，4个队列可以让你分别泡普通茶-超级茶-究极茶-采集。<br>
以一个可以无限进行的动作作为结尾，可以让你在离线时间结束前都不会闲置。
  `},
            {title: "喝什么茶？",
             content: `
             <table class="rank-table">
                <tr>
                    <th>专业</th><th>80级前</th><th>80级后</th>
                </tr>
                <tr>
                    <td>挤奶/伐木</td><td>经验/采集/效率</td><td>采集/加工/效率</td>
                </tr>
                <tr>
                    <td>采摘</td><td>经验/采集/效率</td><td>经验/采集/效率</td>
                </tr>
                 <tr>
                    <td>生产类</td><td>经验/工匠/效率</td><td>经验/工匠/效率</td>
                </tr>
                <tr>
                    <td>烹饪/冲泡</td><td>美食/经验/效率</td><td>美食/工匠/效率</td>
                </tr>
                <tr>
                    <td>强化</td><td>经验/福气/超级强化</td><td>经验/福气/超级强化</td>
                </tr>
                <tr>
                    <td>炼金</td><td>经验/效率/催化</td><td>经验/效率/催化</td>
                </tr>
            </table>
  `},
            {title: "火车是什么？",
             content: `
             火车是某位热心群友（ID：Crazytrain），使用快报命令呼唤“火车报价单”，报价单的价格相对公允，依照报价单在牛牛市场发布买单/卖单，等待市场其他玩家达成交易。
  `},
            {title: "无法从API更新市场数据是什么意思？",
             content: `
             右上角显示api无法获取<br>
错误原因：价格api接口来源于墙外，如无梯子则会报错。<br>
解决办法：<br>
1. 科学上网，获取实时价格<br>
2.无视，插件自带价格数据库，不定期更新<br>
  `},
            {title: "QQ关键字列表",
             content: `
             【钥匙】【盾build】【狗叫】【强化模拟器】【不行】【任务徽章】【自然法build】【强化build】【图】【职业排名】【光环】【任务代币】【填单】【男娘】【水法build】【攻略】【剑build】【贤者】【白名单】【，】【管理坏】【炼金坏】【炼金好】【强化坏】【刷什么】【价格趋势】【远程build】【全服排行】【eph】【赌狗末日】【强化好】【强化攻略】【差距】【rng】【公式强化】【组队掉落】【edge】【名画】【小数】【全流程】【。。】【。】【油猴】【败者食尘】【公会有什么用】【润色】【你知道吗】【炼金速升级】【牛牛手册】【抖M】【火球好】【效率】【牛牛帮助】【牛牛】【福利】【测试服】【什么时候更新】【插件问题】【chatPlugin】【流动资产】【多开末日】【冻结资金】【你说的对】【弩build】【绑定】【公会】【新人职业】【错误领奖姿势】【正确领奖姿势】【查不了】【萌新路线】【传奇捡漏王】【邮箱】【网址】【插件0】【公会有什么用吗】【公会有啥用】【这是个什么群】【快报失效】【队列】【梯子】【星空】【炼金】【不要炼金】【火车是什么】【白屏】【750】【炼金，启动！】【steam】【茶】【强化】【强化升级】【战斗规划】【插件】【炼金升级】
  `},


 ],
        animationDuration:300 // 动画时长（毫秒）
    };

    // 创建符合游戏样式的模态框
    function createStyledModal() {
        const modal = document.createElement('div');
        modal.className = 'Modal_modal__1Jiep custom-modal';
        modal.style.cssText = `
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -45%) scale(0.95);
            opacity: 0;
            width: 100%;
            max-width: 600px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 1000;
            max-height: 70vh;
            overflow-y: auto;
            transition: all ${config.animationDuration}ms ease;
        `;

        // 移动端适配样式
        modal.innerHTML += `
            <style>
                @media (max-width: 768px) {
                    .custom-modal {
                        top: 50% !important;
                        left: 50% !important;
                        transform: translate(-50%, -40%) !important;
                        width: 90% !important;
                        max-height: 80vh !important;
                    }
                    .custom-modal.active {
                        transform: translate(-50%, -50%) scale(1) !important;
                    }
                }
            </style>
        `;

        // 弹窗内容
        modal.innerHTML += `
            <div style="position:relative;padding:20px;">
                <div class="Modal_closeButton__3eTF7"
                     style="position:absolute;top:10px;right:10px;cursor:pointer;font-size:24px;">×</div>
                <div class="search-container" style="margin-bottom:20px;">
                    <input type="text" id="customSearchInput"
                           placeholder="${config.searchPlaceholder}"
                           style="width:100%;padding:8px 12px;border:1px solid #ddd;border-radius:4px;">
                </div>
                <div id="searchResults">
                    ${config.contentData.map(item => `
                        <div class="search-item" style="margin-bottom:15px;padding:10px;border-bottom:1px solid #eee;">
                            <h3 style="color:#000000;margin:0 0 5px 0;text-align:left;">${item.title}</h3>
                            <p style="color:#666;margin:0;text-align:left;">${item.content}</p>
                        </div>
                    `).join('')}
                </div>
                <div id="noResults" style="display:none;color:#999;text-align:center;padding:20px;">
                    ${config.noResultsText}
                </div>
            </div>

             <style>

        /* 内容块基础样式 */
        .content-block {
            font-family: 'Segoe UI', 微软雅黑, sans-serif;
            line-height: 1.6;
        }

         /* 外部链接标识 */
        .external-link {
            color: #2196F3 !important;
            position: relative;
            padding-right: 18px;
        }
        .external-link::after {
            content: "";
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-55%);
            font-size: 0.8em;
            opacity: 0.7;
        }


        /* 图片展示规范 */
        .content-img {
            max-width: 100%;
            border-radius: 4px;
            margin: 10px 0;
            border: 1px solid #ddd;
        }

        /* 列表样式 */
        ul, ol {
            padding-left: 24px;
            margin: 8px 0;
        }
        li {
            margin-bottom: 4px;
        }

        /* 特殊文本标记 */
        .highlight {
            color: #FF5722;
            font-weight: bold;
        }
        .energy-cost {
            color: #9E9E9E;
            font-size: 0.9em;
        }

        /* 提示框 */
        .tip-box {
            background: #F1F8E9;
            border-left: 4px solid #4CAF50;
            padding: 10px;
            margin: 10px 0;
            border-radius: 4px;

         /* 高亮强调 */
        .highlight {
            color: #D32F2F;
            background: linear-gradient(transparent 60%, #FFEB3B 60%);
            padding: 0 2px;
        }

        /* 通知区块 */
        .notice {
            background: #FFF3E0;
            padding: 8px;
            border-radius: 4px;
            margin: 10px 0;
            display: flex;
            align-items: center;
        }
        .icon {
            width: 20px;
            height: 20px;
            margin: 0 4px;
            vertical-align: middle;
        }

        /* 排行榜表格 */
        .rank-table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
        }
        .rank-table td, .rank-table th {
            padding: 8px;
            border: 1px solid #ddd;
            text-align: center;
        }
        .rank-table th {
            background: #f5f5f5;
        }
    </style>
        `;

        return modal;
    }

    // 创建集成按钮
    function createHeaderButton() {
        const btn = document.createElement('button');
        btn.className = 'Button_button__1Fe9z header-custom-btn';
        btn.textContent = '小登常见问题答疑';
        btn.style.cssText = `
            margin-left: auto;
            padding: 8px 16px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: opacity 0.2s;
            position: relative;
            z-index: 1001;
        `;
        return btn;
    }

    // 搜索功能实现
    function setupSearch(modal) {
        const searchInput = modal.querySelector('#customSearchInput');
        const items = modal.querySelectorAll('.search-item');
        const noResults = modal.querySelector('#noResults');

        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            let visibleCount = 0;

            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                const isVisible = text.includes(searchTerm);
                item.style.display = isVisible ? 'block' : 'none';
                if(isVisible) visibleCount++;
            });

            noResults.style.display = visibleCount > 0 ? 'none' : 'block';
        });
    }

    // 初始化
    function init() {
        const header = document.querySelector('.Header_info__26fkk');
        if (!header) return;

        const modal = createStyledModal();
        const btn = createHeaderButton();

        // 添加元素到header
        header.appendChild(btn);
        header.appendChild(modal);

        // 弹窗控制逻辑
        let isVisible = false;
        const toggleModal = () => {
            isVisible = !isVisible;
            if (isVisible) {
                modal.style.display = 'block';
                setTimeout(() => {
                    modal.style.opacity = '1';
                    modal.style.transform = 'translate(-50%, -50%) scale(1)';
                    modal.classList.add('active');
                }, 10);
            } else {
                modal.style.opacity = '0';
                modal.style.transform = 'translate(-50%, -45%) scale(0.95)';
                setTimeout(() => {
                    modal.style.display = 'none';
                    modal.classList.remove('active');
                }, config.animationDuration);
            }
        };

        // 事件绑定
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleModal();
        });

        modal.querySelector('.Modal_closeButton__3eTF7').addEventListener('click', toggleModal);

        document.addEventListener('click', (e) => {
            if (!modal.contains(e.target) && e.target !== btn) {
                if (isVisible) toggleModal();
            }
        });

        // 移动端触摸处理
        let touchStartY = 0;
        modal.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        modal.addEventListener('touchmove', (e) => {
            if (!isVisible) return;
            const deltaY = e.touches[0].clientY - touchStartY;
            if (deltaY > 50) toggleModal();
        }, { passive: true });

        // 初始化搜索
        setupSearch(modal);
    }

    // 等待header加载
    const observer = new MutationObserver(() => {
        if (document.querySelector('.Header_info__26fkk')) {
            observer.disconnect();
            init();
        }
    });

    if (document.querySelector('.Header_info__26fkk')) {
        init();
    } else {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 在 sanitizeHTML 函数中添加换行处理
function sanitizeContent(content) {
    return content
        .replace(/\n/g, '<br>') // 转换换行符
        .replace(/<script/g, '&lt;script'); // 基础XSS防护
}


})();
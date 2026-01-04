// ==UserScript==
// @name         安全教育自动答题脚本（带冷却机制）
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  自动答题并在点击下一题后添加0.5秒冷却
// @author       Your Name
// @match        https://weiban.mycourse.cn/*
// @match        https://mcwk.mycourse.cn/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547425/%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC%EF%BC%88%E5%B8%A6%E5%86%B7%E5%8D%B4%E6%9C%BA%E5%88%B6%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/547425/%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC%EF%BC%88%E5%B8%A6%E5%86%B7%E5%8D%B4%E6%9C%BA%E5%88%B6%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 冷却状态标记，防止连续点击
    let isCoolingDown = false;
    // 冷却时间（毫秒）
    const COOLDOWN_TIME = 2000;

    // 答案数据库
         const answerDatabase = {
        // 单选题示例（不含前面的数字和点号）
        "大一新生小蕊接到电话，对方说她可以领取助学金，让她提供银行卡号，身份证和密码，直接把钱汇到她的账户上。小蕊这时应该怎么做呢？": "B",
        "有人来到宿舍推销商品，应该怎么办呢？": "B",
        "下面哪个是初起火灾呢？": "A",
        "喝酒后不能开车，但是骑电动自行车和自行车是可以的。": "B",
        "平衡车可以在公共交通道路上使用吗？": "B",
        "如果收到“刷单兼职”的消息时，正确的做法是？": "A",
        "干粉灭火器的使用步骤中，以下哪个顺序是正确的？": "A",
        "小王将电动自行车放到室内充电，充电过程中，电池爆炸，引燃室内物品，索性扑救及时没有造成严重损失。请问小王的行为会受到法律惩罚吗？": "A",
        "电源总闸的开关如何使用？": "A",
        "关于发展心理咨询，下面说法正确的是：": "B",
        "根据《刑法》规定，以赌博为业的，将会受到什么处罚？": "A",
        "小刘收到了手机短信，说自己订购机票的航班取消了，如需退票或改签可拨打电话：01085678752。小刘应该怎么做？": "D",
        "小玲有辆最高时速40公里每小时的电动自行车，按照这个时速上路，如果遇到事故，极有可能被认定为（ ）追责。": "A",
        "对网络上的任何人都不要泄露个人隐私信息，一旦对方提到钱立刻警惕并和周围人商量。": "A",
        "投资理财可以相信非正规的平台吗？": "A",
        "大一新生文文突然接到社保局电话，说自己的社保卡被锁了，可以按照电话里的提示解锁。这时文文警惕的说，是不是可以到社保局去解锁。对方慌忙地挂断了电话。文文的这个做法对吗？为什么？": "B",
        "压力是把双刃剑。": "A",
        "压力是把双刃剑。": "A",
        "压力是把双刃剑。": "A",

        "400xxxxxx打来电话称是微信钱包客服：“你的微信钱包正在面临被黑客攻击的危险，你可以先把你钱包里的钱转到我们给你开通的一个安全账户中，然后提现就可以了。”这时你该怎么办？": "A",
        "下面哪个是假网址？": "A",
        "普通人不建议使用消火栓？": "A",
        "下面哪种疏导情绪的方式是会伤害他人的？": "C",
        "你收到短信：“本人可以办到无息贷款，最小金额5万，无需抵押，有需要贷款的朋友回电。”这时应该怎么办？": "A",
        "在消防人员到达火灾现场前，面对初起火灾你应当:": "A",
        "想买演唱会门票，以下哪种方式不会受骗？": "D",
        "下面这条短信是木马吗？“突然翻出了好久以前咱俩的照片，太好玩了，你快看看吧！我放这里了：XXX.XXX”": "B",
        "使用共享单车自行车需要年满多少周岁？": "A",
        "大三学生张亮接到电话，电话里说他有一张法院传票没有领取，过期将会强制执行，可以根据电话里的提示通过升级账户系统来保护自己的存款。这时张亮应该怎么做呢？": "A",

        // 多选题示例
        "小红在粉丝群里认识了一位朋友，他们约定一起去看演唱会，但小红没有抢到门票。这位朋友说还有个抢票通道，便给她发了个网页链接，小红应该：": "CD",
        "精神药品类毒品对人中枢神经的作用有哪几类？": "ACD",
        "电动自行车容易发生事故的原因有（）。": "ABCD",
        "在使用平衡车的过程中，说法正确的有？": "ABD",
        "毒品对身体的危害有哪些？": "ABCDE",
        "每间实验室都必须具有：": "ABD",
        "当我们面对陌生来电时，应该怎么办呢？": "ABCD",
        "实验室事故会伤害到谁？": "ABCD",
        "诈骗分子会利用受害者的“恐惧”心理，使受害者进行转账。以下哪些是每一次转账都利用了“恐惧”心理的诈骗？": "AD",
        "消防锨的主要作用有哪些？": "ABC",
        "如何正确的进行自杀救助？": "ABC",
        "人生中一般会遇到哪些危机？": "ABC",
        "人生中一般会遇到哪些危机？": "ABC",
        "人生中一般会遇到哪些危机？": "ABC",
        "AI骗局都可能有哪些形式？": "ABCD",

        "怀疑遭到购物类诈骗时，正确的做法有？": "ABC",
        "自杀前，一般会有哪些行为上的征兆？": "ABCD",
        "“虚构险情”欺诈常见的形式有？": "ABCD",
        "以下哪些情况可能导致误陷毒品？": "ABC",
        "遇到自称快递员，说你的包裹丢失，要给你赔付时，正确的做法是？": "AB",
        "关于戒除海洛因毒瘾，以下说法正确的是：": "ABD",
        "关于实验室的基本规则，下面说法正确的是：": "ABC"
    };

    // 选项选择器配置
    const selectorConfig = {
        single: {
            'A': '#app > div > div.main-content > div > div.exam-content.f14 > div.quest-options > div:nth-child(1) > div > span',
            'B': '#app > div > div.main-content > div > div.exam-content.f14 > div.quest-options > div:nth-child(2) > div > span',
            'C': '#app > div > div.main-content > div > div.exam-content.f14 > div.quest-options > div:nth-child(3) > div > span',
            'D': '#app > div > div.main-content > div > div.exam-content.f14 > div.quest-options > div:nth-child(4) > div > span'
        },
        multiple: {
            'A': '#app > div > div.main-content > div > div.exam-content.f14 > div.quest-options > div:nth-child(1)',
            'B': '#app > div > div.main-content > div > div.exam-content.f14 > div.quest-options > div:nth-child(2)',
            'C': '#app > div > div.main-content > div > div.exam-content.f14 > div.quest-options > div:nth-child(3)',
            'D': '#app > div > div.main-content > div > div.exam-content.f14 > div.quest-options > div:nth-child(4)',
            'E': '#app > div > div.main-content > div > div.exam-content.f14 > div.quest-options > div:nth-child(5)'
        }
    };

    // 核心选择器
    const questionSelector = '#app > div > div.main-content > div > div.exam-content.f14 > div.quest-stem';
    const questionTypeSelector = '#app > div > div.main-content > div > div.exam-content.f14 > div.quest-type';
    const nextQuestionSelector = '#app > div > div.bottom-ctrls > button:nth-child(3)';

    /**
     * 处理题目文本，去除前面的数字和点号
     */
    function processQuestionText(text) {
        return text.replace(/^\s*\d+[.\s]*/, '').trim().replace(/\s+/g, ' ');
    }

    /**
     * 判断题目类型
     */
    function getQuestionType(answer) {
        const typeElement = document.querySelector(questionTypeSelector);
        if (typeElement) {
            const typeText = typeElement.textContent.trim();
            if (typeText.includes('单选')) return 'single';
            if (typeText.includes('多选')) return 'multiple';
        }
        return answer.length === 1 ? 'single' : 'multiple';
    }

    /**
     * 点击下一题按钮（带冷却机制）
     */
    function clickNextQuestion() {
        // 检查是否处于冷却状态
        if (isCoolingDown) {
            console.log(`[自动答题] 处于冷却中，剩余 ${COOLDOWN_TIME/1000} 秒`);
            return false;
        }

        const nextButton = document.querySelector(nextQuestionSelector);
        if (nextButton) {
            // 设置冷却状态
            isCoolingDown = true;

            // 模拟点击下一题
            nextButton.dispatchEvent(new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            }));
            console.log(`[自动答题] 已点击下一题，进入 ${COOLDOWN_TIME/1000} 秒冷却`);

            // 冷却时间结束后重置状态
            setTimeout(() => {
                isCoolingDown = false;
                console.log('[自动答题] 冷却结束，可以继续答题');
            }, COOLDOWN_TIME);

            return true;
        } else {
            console.log('[自动答题] 未找到下一题按钮');
            return false;
        }
    }

    /**
     * 检测当前题目并判断是否在题库中
     */
    function checkQuestionInDatabase() {
        const questionElement = document.querySelector(questionSelector);
        if (!questionElement) {
            console.log('[题目检测] 未找到题目元素');
            return;
        }

        const originalQuestionText = questionElement.textContent.trim().replace(/\s+/g, ' ');
        const processedQuestionText = processQuestionText(originalQuestionText);
        const isInDatabase = answerDatabase.hasOwnProperty(processedQuestionText);

        console.log(`[题目检测] 原始题目：${originalQuestionText}`);
        console.log(`[题目检测] 处理后：${processedQuestionText}`);
        console.log(`[题目检测] ${isInDatabase ? '在题库中找到该题' : '题库中未找到该题'}`);

        return { originalQuestionText, processedQuestionText, isInDatabase };
    }

    /**
     * 自动答题核心逻辑
     */
    function autoAnswer() {
        // 如果处于冷却状态，不执行任何操作
        if (isCoolingDown) {
            return;
        }

        // 获取题目元素及内容
        const questionElement = document.querySelector(questionSelector);
        if (!questionElement) {
            console.log('[自动答题] 未找到题目元素，跳过');
            return;
        }

        // 处理题目内容
        const originalQuestionText = questionElement.textContent.trim().replace(/\s+/g, ' ');
        const questionText = processQuestionText(originalQuestionText);
        console.log('[自动答题] 原始题目：', originalQuestionText);
        console.log('[自动答题] 处理后题目：', questionText);

        // 匹配数据库中的答案
        if (!answerDatabase[questionText]) {
            console.log('[自动答题] 数据库中未找到该题答案，无法自动答题');
            return;
        }
        const answer = answerDatabase[questionText];
        console.log('[自动答题] 匹配答案：', answer);

        // 判断题目类型并选择对应选项
        const questionType = getQuestionType(answer);
        console.log('[自动答题] 题目类型：', questionType === 'single' ? '单选题' : '多选题');

        const answerList = answer.split('');
        const optionsSelected = [];

        answerList.forEach(option => {
            const selector = selectorConfig[questionType][option];
            if (!selector) {
                console.log(`[自动答题] 无效选项：${option}，跳过`);
                return;
            }

            const optionElement = document.querySelector(selector);
            if (optionElement) {
                optionElement.dispatchEvent(new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                }));
                optionsSelected.push(option);
                console.log(`[自动答题] 已选择选项：${option}`);
            } else {
                console.log(`[自动答题] 未找到选项${option}的元素`);
            }
        });

        // 如果成功选择了选项，点击下一题（会触发冷却）
        if (optionsSelected.length > 0) {
            clickNextQuestion();
        }
    }

    /**
     * 添加手动触发按钮
     */
    function addControlButton() {
        if (document.getElementById('auto-answer-btn')) return;

        const button = document.createElement('button');
        button.id = 'auto-answer-btn';
        button.textContent = '自动答题（带冷却）';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            padding: 10px 18px;
            background-color: #2196F3;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            transition: background-color 0.3s;
        `;

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#1976D2';
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#2196F3';
        });

        button.addEventListener('click', autoAnswer);
        document.body.appendChild(button);
    }

    /**
     * 页面加载完成后初始化
     */
    window.addEventListener('load', () => {
        addControlButton();
        setInterval(autoAnswer, 3000);
        console.log('[自动答题] 脚本初始化完成，已启动定时检测（每3秒）');

        setInterval(checkQuestionInDatabase, 1000);
        console.log('[题目检测] 已启动每秒题目检测');

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (!isCoolingDown && (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
                    autoAnswer();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
})();

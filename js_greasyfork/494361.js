// ==UserScript==
// @name         飓风私信消息
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fetch and display a random avatar from the provided API.
// @author       You
// @match        http://jufeng.jinrikuaituan.com/dydqtshoppc/enter/message
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/494361/%E9%A3%93%E9%A3%8E%E7%A7%81%E4%BF%A1%E6%B6%88%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/494361/%E9%A3%93%E9%A3%8E%E7%A7%81%E4%BF%A1%E6%B6%88%E6%81%AF.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 定义一个 GM_fetch 函数来包装 GM_xmlhttpRequest 调用
    function GM_fetch(url, options = {}) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                ...options,
                url: url,
                method: options.method || 'GET',
                onload: function (response) {
                    resolve(response.responseText);
                },
                onerror: reject,
                ontimeout: reject
            });
        });
    }

    /**
     * 获取随机头像
     * @param {string} sort - 类别，仅接受 "男", "女", "动漫男", "动漫女" 四种类型之一。默认为 "男"。
     * @returns {Promise<string>} 返回头像图片的URL
     * @throws {Error} 如果提供的 sort 值不是预期的四种类型之一，则抛出错误。
     */
    async function getAvatar(sort = null) {
        // 定义允许的类别
        const allowedSorts = ["男", "女", "动漫男", "动漫女"];

        // 如果 sort 参数未指定，则随机选择一个类别
        if (sort === null) {
            sort = allowedSorts[Math.floor(Math.random() * allowedSorts.length)];
        }

        // 检查 sort 是否为允许的类别之一
        if (!allowedSorts.includes(sort)) {
            throw new Error("Invalid sort parameter. Allowed values are 男, 女, 动漫男, 动漫女.");
        }

        // 构建请求URL
        let url = `https://api.uomg.com/api/rand.avatar?sort=${encodeURIComponent(sort)}&format=json`;

        // 使用 GM_fetch 发起请求
        try {
            const response = await GM_fetch(url);
            const data = JSON.parse(response);
            // 确认响应中包含有效的数据
            if (data && data.code === 1) {
                return data.imgurl; // 返回头像图片的 URL
            } else {
                throw new Error(data.msg || "Failed to fetch a valid avatar from the API.");
            }
        } catch (error) {
            // 如果请求失败或解析数据出错，向上抛出错误
            throw new Error(`Error fetching the avatar: ${error.message}`);
        }
    }

    // 注意: GM_fetch 需要根据实际情况定义。这里假定已有相应的实现支持跨域请求。


    /**
 * 生成随机昵称
 * @returns {Promise<string>} 返回生成的昵称
 * @throws {Error} 如果API调用失败或返回非200响应码，则抛出错误
 */
    async function getNickname() {
        const url = "https://cn.apihz.cn/api/zici/sjwm.php?id=88888888&key=88888888";
        try {
            const response = await GM_fetch(url);
            const data = JSON.parse(response);
            // 检查响应码是否为200
            if (data && data.code === 200) {
                return data.msg; // 返回昵称
            } else {
                throw new Error(data.msg || "API did not return a successful response.");
            }
        } catch (error) {
            // 如果请求失败或解析数据出错，向上抛出错误
            throw new Error(`Error generating nickname: ${error.message}`);
        }
    }


    async function generateQAForChat() {
        // 与之前的例子类似，此处定义问答库...
        const qaBank = {
            "怎么联系": "您留个号码，我们马上给您回电。",
            "在哪里": "我们的位置很好找，您留个号码，我们给您发个定位。",
            "可以优惠吗": "优惠肯定有，您留个号码，我们聊一下。",
            "这是我微信": "辛苦您留个号码哈，这边马上联系你。",
            "这是我的号码": "好的，我们会尽快联系你。",
            "请问怎么用的": "您留个电话，我们详细给您说说怎么用。",
            "请问怎么联系": "您留个号码，我们马上给您回电。",
            "怎么联系请问": "您留个号码，我们马上给您回电，有啥问题咱们电话里说。",
            "怎么联系？": "您留个号码，我马上给您回过去。",
            "在吗": "在呢，您可以留个号码",
            "请问如何联系": "您留个号码，我们这边会给您回电话。",
            "怎么联系你们销售": "您留个号码，我们这边会联系您。",
            "联系你们需要什么": "您留个号码，其他都不用操心，我们这边会联系您。",
            "你们能主动联系我吗": "您留个号码，我们这边会主动联系您。",
            "怎么联系你们客服": "您留个号码，我们这边的客服会给您回电。",
            "怎么联系你们咨询": "您留个号码，我们这边会给您提供咨询服务。",
            "你们能回个电话吗": "没问题，您留个号码，我们这边会给您回电话。",
            "怎么联系你们的服务": "您留个号码，我们这边会给您提供服务。",
            "你们能联系我一下吗": "当然，您留个号码，我们这边会给您联系。",
            "怎么联系你们售后": "您留个号码，我们这边的售后会给您联系。",
            "你们电话多少？": "您方便的话，留个您的号码，我们这边给您打过去。",
            "能给我个联系方式吗？": "当然可以，您留个号码，我们这边给您回电。",
            "怎么联系你们客服？": "您留个号码，我们客服会尽快给您回电。",
            "想咨询一下，怎么联系你们？": "您留个联系方式，我们这边会给您详细解答。",
            "你们有没有在线客服？": "有的，您留个号码，我们在线客服会联系您。",
            "怎么联系你们咨询问题？": "您留个号码，我们这边会给您解答。",
            "你们有电话客服吗？": "有的，您留个号码，我们电话客服会联系您。",
            "能留个你们联系电话吗？": "您留个您的号码，我们这边给您打过去。",
            "你们有客服热线吗？": "有的，您留个号码，我们通过热线联系您。",
            "怎么联系你们技术支持？": "您留个号码，我们技术支持团队会联系您。",
            "想买请问怎么联系": "您留个号码，我们马上联系您",
            "想买怎么联系": "您留个号码，我们给您安排。",
            "请问怎么买": "您留个号码，我们这边联系您",
            "怎么卖的请问": "您留个号码，这边联系您。",
            "那个怎么买": "您留个号码，这边联系你哈。",
            "那个多少钱": "您留个联系方式，我们给您报价。",
            "请问多少钱": "价格方面，您留个联系方式，我们给您报个价。",
            "贵不贵": "留个电话，我们给您详细介绍，价格绝对公道。",
            "价格是多少": "您留个号码，我们给您一个满意的报价。",
            "产品价格能透露一下吗": "没问题，您留个联系方式，我们给您报个价。",
            "想了解一下价格": "您留个电话，我们给您详细说明。",
            "价格有优惠吗": "优惠信息，您留个号码，我们给您详细介绍。",
            "价格区间能说下吗": "您留个联系方式，我们给您报个大概的价格区间。",
            "产品怎么卖": "您留个号码，我们给您详细说明购买流程和价格。",
            "怎么购买": "购买流程很简单，您留个号码，我们给您指导。",
            "产品价格怎么样": "价格绝对有竞争力，您留个号码，我们给您具体说说。",
            "能便宜点吗": "您留个联系方式，我们看看能不能给您更多优惠。",
            "价格能商量吗": "您留个号码，我们给您一个好价格。",
            "产品价格合理吗": "您留个号码，我们给您报个价格。",
            "价格有明细吗": "有的，您留个联系方式，我们给您发个详细的报价单。",
            "产品怎么计费的": "计费方式您留个号码，我们给您解释清楚。",
            "价格包含哪些服务": "服务内容和价格，您留个号码，我们给您一一说明。",
            "价格能再便宜点吗": "您留个号码，我们看看能不能给您更多优惠。",
            "产品价格是多少": "您留个联系方式，我们给您一个准确的报价。",
            "价格可以商量吗": "当然可以，您留个号码，我们给您一个好商量的价格。",
            "可以合作吗？": "当然可以，合作细节咱们电话里聊，您留个号码吧。",
            "想合作怎么联系": "合作的事咱们电话上说，您留个联系方式，咱们详细谈谈。",
            "是不是厂家": "对头，我们就是厂家，您留个号码，咱们聊聊合作细节。",
            "招代理吗": "招啊，您有兴趣做代理？留个号码，我们详细谈谈。",
            "还招代理吗": "当然招，您留个联系方式，我们聊聊合作条件。",
            "招加盟商吗": "招加盟商呢，您留个号码，我们电话沟通。",
            "能合作吗": "您留个号码，我们聊一下合作细节。",
            "想合作请问怎么联系": "合作的事咱们电话上说，您留个联系方式，咱们详细谈谈。",
            "你们接受合作吗？": "接受的，您留个号码，咱们聊聊怎么个合作法。",
            "怎么成为你们的合作伙伴？": "您留个号码，我们聊一下。",
            "合作流程是怎样的？": "您留个联系方式，我们给您电话沟通。",
            "你们怎么挑选合作伙伴？": "我们有一套标准，您留个号码，咱们详细说说。",
            "合作有什么条件吗？": "条件咱们可以细聊，您留个号码，我们给您详细介绍。",
            "我们可以怎么合作？": "合作方式多样，您留个号码，咱们探讨一下。",
            "合作的话需要什么资质？": "资质要求我们聊聊，您留个联系方式，我们给您说明。",
            "合作有什么优势？": "您留个号码，我们给您列举一下。",
            "合作模式有哪些？": "模式灵活，您留个号码，我们给您详细解释。",
            "合作的话怎么分成？": "分成比例咱们好商量，您留个联系方式，咱们电话里谈。",
            "合作需要签合同吗？": "正规合作都需要合同，您留个号码，我们给您发个样本看看。",
            "合作初期有什么支持？": "初期支持我们有一套方案，您留个号码，我们给您说说。",
            "合作的话售后服务怎么办？": "售后服务您放心，您留个联系方式，我们给您详细介绍。",
            "合作费用怎么算？": "费用明细咱们可以细谈，您留个号码，我们给您报个价。",
            "你们一般和什么类型的伙伴合作？": "我们合作的伙伴类型多样，您留个号码，咱们聊聊您的情况。",
            "合作的话有什么限制吗？": "限制不多，您留个联系方式，我们给您说说合作框架。",
            "合作的流程大概是怎样的？": "流程咱们可以一步步来，您留个号码，我们给您详细说明。",
            "合作的话有什么优惠政策？": "优惠政策我们有的，您留个号码，我们给您详细介绍。",
            "合作需要提供什么资料？": "资料清单我们可以提供，您留个号码，我们给您发过去。",
            "合作的话多久能开始？": "合作启动很快，您留个联系方式，我们给您个时间表。",
            "可以介绍一下产品吗": "没问题，您留个电话，我们给您好好介绍介绍。",
            "还有吗": "您留个号码，我们给您详细说说。",
            "产品有哪些特点？": "您留个号码，我们给您一一讲解。",
            "产品好用吗？": "您留个联系方式，我们给您说说用户反馈。",
            "产品有什么优势？": "优势明显，您留个号码，我们给您列举几个亮点。",
            "产品保修多久？": "保修期长，您留个联系方式，我们给您详细说明。",
            "产品使用方法复杂吗？": "操作简单，您留个号码，我们教您怎么用。",
            "产品有哪些型号？": "型号齐全，您留个联系方式，我们给您发个产品目录。",
            "产品性能怎么样？": "性能优越，您留个号码，我们给您展示一下性能测试结果。",
            "产品使用寿命是多久？": "使用寿命长，您留个联系方式，我们给您详细介绍。",
            "产品有售后服务吗？": "售后服务完善，您留个号码，我们给您说说服务内容。",
            "产品使用成本高吗？": "成本经济，您留个联系方式，我们给您算个账。",
            "产品适合哪些人群使用？": "适用人群广，您留个号码，我们帮您匹配合适的产品。",
            "产品有哪些颜色可选？": "颜色多样，您留个联系方式，我们给您发个颜色选项。",
            "产品有试用装吗？": "有试用服务，您留个号码，我们给您安排试用。",
            "有没有售后": "售后绝对有保障，您留个号码，我们告诉您我们的服务政策。",
            "售后支持怎么样？": "我们的售后服务团队非常专业，您留个号码，我们给您详细介绍。",
            "产品有问题怎么办？": "您放心，有问题我们帮您解决，留个联系方式，我们告诉您处理流程。",
            "售后维修要多久？": "您留个号码，我们给您具体说明。",
            "售后包括哪些服务？": "服务内容挺全面的，您留个联系方式，我们给您发个服务清单。",
            "产品保修期是多久？": "保修期我们给的挺长，您留个号码，我们给您报个保修期限。",
            "售后需要额外付费吗？": "是否收费得看情况，您留个联系方式，我们给您解释清楚。",
            "售后响应速度快吗？": "我们响应速度很快的，您留个号码，我们给您说说我们的响应机制。",
            "产品可以退换货吗？": "退换货没问题，您留个联系方式，我们给您说说退换货政策。",
            "售后问题一般怎么解决？": "我们有多种解决方案，您留个号码，我们给您详细说说。",
            "售后有上门服务吗？": "上门服务我们提供的，您留个号码，我们给您说说服务范围。",
            "售后问题多久能解决？": "解决时间我们尽量缩短，您留个联系方式，我们给您个大概时间。",
            "售后可以远程支持吗？": "远程支持可以的，您留个号码，我们给您介绍远程服务流程。",
            "售后有专门的客服吗？": "有的，我们有专门的售后团队，您留个号码，我们给您联系方式。",
            "产品过了保修期怎么办？": "过了保修期也没关系，您留个联系方式，我们给您提供解决方案。",
            "公司在哪里": "公司地址我给您发过去，您留个号码就行。",
            "你们是厂家吗": "对，我们是厂家直销，您留个号码，我们给您详细介绍。",
            "公司规模大吗？": "规模挺大的，您留个号码，我们给您说说公司概况。",
            "公司成立多久了？": "我们成立有年头了，您留个联系方式，我们给您详细介绍。",
            "公司有哪些产品？": "产品种类丰富，您留个号码，我们给您发个产品手册。",
            "公司信誉怎么样？": "信誉绝对好，您留个联系方式，我们给您看看客户评价。",
            "公司有官网吗？": "有官网的，您留个号码，我们给您发个网址链接。",
            "公司获得过什么荣誉？": "荣誉不少，您留个联系方式，我们给您展示一下。",
            "公司有哪些合作案例？": "合作案例很多，您留个号码，我们给您发几个看看。",
            "公司发展前景如何？": "前景广阔，您留个联系方式，我们给您说说发展规划。",
            "公司有实体店铺吗？": "有实体店铺的，您留个号码，我们给您发个地址。",
            "公司文化是怎样的？": "公司文化很开放，您留个联系方式，我们给您介绍介绍。",
            "公司有哪些部门？": "部门齐全，您留个号码，我们给您说说组织结构。",
            "公司员工多吗？": "员工团队强大，您留个联系方式，我们给您说说团队规模。"
        };


        // 随机选择问答次数，从1到5次
        const qaCount = Math.floor(Math.random() * 5) + 1;
        const questions = Object.keys(qaBank);
        const qaContent = [];

        // 创建指定数量的问答对
        for (let i = 0; i < qaCount; i++) {
            const questionText = questions[Math.floor(Math.random() * questions.length)];
            const answerText = qaBank[questionText];
            // 添加问题
            qaContent.push({
                text: questionText,
                target: 'question'
            });

            // 添加答案
            qaContent.push({
                text: answerText,
                target: 'answer'
            });
        }

        return qaContent;
    }

    // 注意: GM_fetch 需要根据您的环境或框架进行适当配置以支持跨域请求。

    function generateOrderedTimestamps(count) {
        const now = new Date();
        const timestamps = [];

        for (let i = 0; i < count; i++) {
            // 产生一个时间跨度，从现在到过去最多1天
            let pastTime = new Date(now - i * (0.5 * 24 * 60 * 60 * 1000) / count);
            timestamps.push(pastTime);
        }

        // 逆序排序时间戳，从近到远
        timestamps.sort((a, b) => b - a);

        // 将时间格式化为所需格式
        const formattedTimestamps = timestamps.map(ts => {
            const minutesAgo = Math.floor((now - ts) / 1000 / 60);
            if (minutesAgo < 60) {
                return `${minutesAgo}分钟前`;
            } else if (minutesAgo < 24 * 60) {
                return `${Math.floor(minutesAgo / 60)}小时前`;
            } else {
                return `${Math.floor(minutesAgo / 60 / 24)}天前`;
            }
        });

        return formattedTimestamps;
    }

    // DataGenerator 函数
    // DataGenerator 函数
    async function DataGenerator(num = 50, batchSize = 10) {
        const list = [];
        const timestamps = generateOrderedTimestamps(num);
        const batches = Math.ceil(num / batchSize);

        for (let batch = 0; batch < batches; batch++) {
            const batchList = [];
            const start = batch * batchSize;
            const end = Math.min(start + batchSize, num);

            const avatars = [];
            const nicknames = [];
            const qaContents = [];
            for (let i = start; i < end; i++) {
                avatars.push(getAvatar());
                nicknames.push(getNickname());
                qaContents.push(generateQAForChat());
            }

            const [avatarsResolved, nicknamesResolved, qaContentsResolved] = await Promise.all([
                Promise.all(avatars),
                Promise.all(nicknames),
                Promise.all(qaContents)
            ]);

            for (let i = start; i < end; i++) {
                const time = timestamps[i];
                const avatar = avatarsResolved[i - start];
                const nickname = nicknamesResolved[i - start];
                const qaContent = qaContentsResolved[i - start];

                const dataObject = {
                    avatar: avatar,
                    nickname: nickname,
                    chat: qaContent,
                    lastReply: qaContent[qaContent.length - 1].text,
                    chatNum: qaContent.length,
                    time: time,
                    isRead: false // 默认所有消息未读
                };

                batchList.push(dataObject);
                // 打印或返回当前批次的数据，以便进行实时处理或展示
                console.log(`Batch ${batch + 1} of ${batches} completed with ${batchSize} items`);
            }

            list.push(...batchList);
        }

        return list;
    }

    let isDataGenerated = false; // 全局标志，初始为false

    function monitorDOM(containerSelector, callback) {
        console.log('monitorDOM start');
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && isDataGenerated) {
                    // 检查mutation.addedNodes中是否有新的子元素被添加
                    mutation.addedNodes.forEach(node => {
                        // 确保node是元素节点
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 使用提供的containerSelector检查节点是否为容器
                            if (node.matches(containerSelector)) {
                                // 执行回调函数，传入找到的容器元素
                                callback(node);
                            }
                        }
                    });
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 返回observer实例，以便可以停止观察
        return observer;
    }



    function modifyDOM(dataList, containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) {
            console.error('Container element not found');
            return;
        }

        // 清空现有列表（如果需要）
        container.innerHTML = '';

        // 遍历 dataList 并修改 DOM
        dataList.forEach(dataObject => {
            // 创建新的主要容器
            const newItemBase = document.createElement('div');
            newItemBase.className = 'left-content-main';

            const newItem = document.createElement('div');
            newItem.className = 'main-every active';

            // 添加 data-nickname 属性
            newItem.setAttribute('data-nickname', dataObject.nickname);

            // 创建头像容器并设置图片
            const leftDiv = document.createElement('div');
            leftDiv.className = 'left';

            const avatarImg = document.createElement('img');
            avatarImg.src = dataObject.avatar;
            avatarImg.setAttribute('referrerpolicy', 'no-referrer');

            // 显示未读红点逻辑
            if (!dataObject.isRead) {
                const noread = document.createElement('div');
                noread.className = 'noread';
                noread.textContent = dataObject.chatNum;
                leftDiv.appendChild(noread);
            }

            leftDiv.appendChild(avatarImg);



            // 创建右侧信息容器
            const rightDiv = document.createElement('div');
            rightDiv.className = 'right';

            // 创建昵称和时间的容器
            const rightTopDiv = document.createElement('div');
            rightTopDiv.className = 'right-top';

            // 创建昵称
            const topNameDiv = document.createElement('div');
            topNameDiv.className = 'top-name';
            topNameDiv.style.fontFamily = '"PingFang SC", sans-serif';
            topNameDiv.style.fontSize = '14px';
            topNameDiv.textContent = dataObject.nickname;

            // 创建时间戳
            const topTimeDiv = document.createElement('div');
            topTimeDiv.className = 'top-time';
            topTimeDiv.style.fontFamily = '"PingFang SC", sans-serif';
            topTimeDiv.style.fontSize = '12px';
            topTimeDiv.style.color = 'rgb(204, 204, 204)';
            topTimeDiv.textContent = dataObject.time;

            // 将昵称和时间戳添加到右侧顶部容器
            rightTopDiv.appendChild(topNameDiv);
            rightTopDiv.appendChild(topTimeDiv);

            // 创建消息预览
            const rightBottomDiv = document.createElement('div');
            rightBottomDiv.className = 'right-bottom';
            rightBottomDiv.textContent = dataObject.lastReply;

            // 将所有右侧的元素添加到右侧容器中
            rightDiv.appendChild(rightTopDiv);
            rightDiv.appendChild(rightBottomDiv);

            // 将左侧和右侧容器添加到新的主要容器中
            newItem.appendChild(leftDiv);
            newItem.appendChild(rightDiv);


            newItemBase.appendChild(newItem);
            // 将新的主要容器添加到页面容器中
            container.appendChild(newItemBase);
        });
    }

    function setupClickEventListeners(dataList) {
        dataList.forEach((data, index) => {
            const selector = `.left-content-main .main-every[data-nickname="${data.nickname}"]`;
            const mainEveryElement = document.querySelector(selector);
            if (mainEveryElement) {
                mainEveryElement.addEventListener('click', function (event) {
                    // 更新数据为已读
                    dataList[index].isRead = true;
                    localStorage.setItem('cachedDataList', JSON.stringify(dataList));

                    // 移除未读红点
                    const noread = mainEveryElement.querySelector('.noread');
                    if (noread) {
                        noread.remove();
                    }

                    updateChatBox(data);
                });
            }
        });
    }

    function updateChatBox(dataObject) {
        console.log(dataObject);
        // 更新右侧聊天框顶部的昵称
        const peopleNameElement = document.querySelector('.main-center .center-header .people-name');
        peopleNameElement.textContent = dataObject.nickname;

        // 清除现有的聊天内容
        const chatBox = document.querySelector('.main-center .center-view ');
        chatBox.innerHTML = '';  // 清除现有内容

        // 动态生成聊天内容
        dataObject.chat.forEach(chatItem => {
            const chatElement = document.createElement('div');
            chatElement.className = 'text-content'

            // 创建消息气泡BASE
            const messageBubbleBase = document.createElement('div');
            messageBubbleBase.classList.add(chatItem.target === 'answer' ? 'me-text' : 'he-text');

            // 创建消息气泡中间
            const messageBubble = document.createElement('div');
            // 根据消息类型添加相应的类
            messageBubble.classList.add(chatItem.target === 'answer' ? 'me-liaotian' : 'he-liaotian');


            // 创建消息内部文本
            const messageBubbleText = document.createElement('div');
            // 根据消息类型添加相应的类
            messageBubbleText.classList.add(chatItem.target === 'answer' ? 'me-text-content' : 'he-text-content');
            const textContent = document.createElement('span');
            textContent.textContent = chatItem.text;
            textContent.style.fontSize = '14px';


            // 如果是问题类型的消息，先添加文本内容，然后插入头像
            if (chatItem.target !== 'answer') {
                const avatarImg = document.createElement('img');
                avatarImg.src = dataObject.avatar;
                avatarImg.classList.add('touxiang');
                messageBubble.appendChild(avatarImg);
            }

            // 添加文本内容
            messageBubbleText.appendChild(textContent);

            // 将消息气泡添加到聊天项中
            messageBubble.appendChild(messageBubbleText);

            // 将消息气泡添加到聊天项中
            messageBubbleBase.appendChild(messageBubble);

            // 将聊天项添加到聊天框中
            chatElement.appendChild(messageBubbleBase);

            // 将聊天项添加到聊天框中
            chatBox.appendChild(chatElement);
        });
    }

    async function main() {
        try {
            // 定义一个变量来存储从缓存或API获取的数据列表
            let dataList = [];

            // 检查本地存储是否有有效的缓存数据
            const cachedData = localStorage.getItem('cachedDataList');
            const cachedTimestamp = localStorage.getItem('cachedDataTimestamp');
            const currentTime = Date.now();

            // 判断缓存是否存在且在24小时内
            if (cachedData && cachedTimestamp && currentTime - parseInt(cachedTimestamp) < 24 * 60 * 60 * 1000) {
                dataList = JSON.parse(cachedData);
                console.log('Using cached data');
            } else {
                // 如果没有有效的缓存，生成新的数据
                dataList = await DataGenerator();
                localStorage.setItem('cachedDataList', JSON.stringify(dataList));
                localStorage.setItem('cachedDataTimestamp', Date.now().toString());
                console.log('Data generated and cached');
            }

            // 标志数据已生成
            isDataGenerated = true;

            // 第2步：监控DOM元素是否存在
            const containerSelector = "#app > div.main-left > div.left-content"; // 根据实际情况调整选择器
            modifyDOM(dataList, containerSelector);
            setupClickEventListeners(dataList)
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }


    // 运行主函数
    main();

})();


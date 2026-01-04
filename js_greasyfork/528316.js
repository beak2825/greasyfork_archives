// ==UserScript==
// @name         山东省人工智能研修|希沃教育|一键运行|自动答题|稳定
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  山东省人工智能研修|希沃教育
// @author       Your Name
// @match        https://study.seewoedu.cn/*
// @match        https://cpb-m.cvte.com/*
// @match        *://cpb-m.cvte.com/*
// @match        *://study.seewoedu.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @connect      zhihuizhongxiaoxue2.a1.luyouxia.net
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @downloadURL https://update.greasyfork.org/scripts/528316/%E5%B1%B1%E4%B8%9C%E7%9C%81%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD%E7%A0%94%E4%BF%AE%7C%E5%B8%8C%E6%B2%83%E6%95%99%E8%82%B2%7C%E4%B8%80%E9%94%AE%E8%BF%90%E8%A1%8C%7C%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%7C%E7%A8%B3%E5%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/528316/%E5%B1%B1%E4%B8%9C%E7%9C%81%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD%E7%A0%94%E4%BF%AE%7C%E5%B8%8C%E6%B2%83%E6%95%99%E8%82%B2%7C%E4%B8%80%E9%94%AE%E8%BF%90%E8%A1%8C%7C%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%7C%E7%A8%B3%E5%AE%9A.meta.js
// ==/UserScript==

//请勿修改脚本，加了防破解，若触发机制，可能会导致封号
(function() {
    'use strict';

    // 脚本状态对象
    const scriptState = {
        authorized: false,
        authKey: '',
        licenseInfo: null,
        initialized: false
    };

    // 初始化配置
    const config = {
        // 授权相关
        authServerUrl: 'http://zhihuizhongxiaoxue2.a1.luyouxia.net:22897/verify', // 替换为你的授权服务器地址
        authCheckInterval: 5 * 60 * 1000, // 每5分钟检查一次授权状态

        // 加密相关
        encryptionKey: 'eR7pK9mQ3sT6vX1z', // 用于加密本地存储的密钥

        // 自动答题相关
        autoSubmit: true,       // 回答所有问题后自动提交
        delayBetweenActions: 500, // 操作之间的延迟时间（毫秒）
        delayBeforeSubmit: 1000,  // 提交前的延迟时间（毫秒）

        // 希沃学习相关
        seewoKey: "zn196hue561909fc",  // 16 字节密钥
        seewoIv: "be43693939a3662f",   // 16 字节 IV
        seewoGroupCourseId: "5f15725bface42a9bee3be62340025bf",
        seewoCourseIds: [
            "d9c61e777b29495b8cad0f0e310176d4",
           "b081e271c236426381e361d78f52e212",
           "2bfc9a4249384796826213579efb7cd4",
           "061c588f66a949288364cef932f15fc1",
           "b2824333c9dd480c82da770b774d64b4",
           "b9ee11b0ed21488f8abec1e066521556",
           "a328e4ff9a30446cb4ee8bfbcc7b8e6e",
           "7cce533a90a148fc8b812af9bb299cba",
           "2447a2f87c514de68277654708a58f72",
           "c5178af95dc04152953c822ae38aacb0",

           "1b1df61bf7c545458bf07529f6dd9ebf",
           "f653a43a583944f8b39a2a2601c66b95",
           "5725152dc71e4ca6a81abf0004fcad46",
           "1b5e7b0ca9f34349a113d5fbe2bc6262",
           "b9d40a19d6c94c5c8f84c4856a726e10",
           "b4370a501b744272ac50605fc84d33f1",
           "d20930c5a713449ca3f5f500fffbb8c5",
           "2dc270b60a3c4e989021bfc97613c326",
           "031892fe1fac406a8c5c27f32636db94",
           "42a9609eebdf4462becb6ef6e6ef9a0b",

           "bfe0ad0f80664115aea64e304e2116cc",
           "928e9e56b7d9486c9083c70668d95871",
           "86f2674dd385499cbbb165aeefe85d27",
           "7df456b7fc074d319861f00e2340d2dd",
           "5c5c327319e3479694e106841cf974bc",
           "92e0d78a4356484ebb2352ae37ef1523",
           "1375b2bce8644c6995716aca59144f3f",
           "68c7753f9b8649d1ac1a60729eaef74e",
        ]
    };

    // 题库 - 格式：{问题文本: {type: "单选/多选", answers: ["正确答案"]}}
    let answerDatabase = {
        "关于对AI的思考与反思，讲师提出了哪三条建议？": {
            type: "多选",
            answers: ["人类和人工智能是互补的，而非互相替代的关系。", "识别AI胡说八道是人类的必修课。", "避免“惰性”，没有思维力，不要轻易引导学生使用GAI。"]
        },
        "对教育工作者而言，人工智能（AI）可以分为哪几大类别？": {
            type: "多选",
            answers: ["文本生成", "图像生成", "音频生成","视频生成","课件生成"]
        },
        "关于人工智能工具的选择，以下策略错误的是？": {
            type: "单选",
            answers: ["越多越好"]
        },
        "下列与人工智能相关的短语中，匹配正确的有哪些？": {
            type: "多选",
            answers: ["AI——人工智能", "AIGC——人工智能生成内容", "LLM——大语言模型","Deep Learning——深度学习"]
        },
        "正确使用AI的原则是？": {
            type: "多选",
            answers: ["思维力原则", "创新性原则", "高效性原则","AI融合原则","安全性原则"]
        },
        //********************************************************************************//
        "诸如秘塔AI等应用将大模型与外部数据库相连，基于检索到的内容生成答案，可以减少AI幻觉现象。": {
            type: "单选",
            answers: ["正确"]
        },
        "关于使用RAG（检索增强生成技术）来进行教学设计生成，讲师介绍了以下哪几种AI工具？": {
            type: "多选",
            answers: ["秘塔", "360AI", "天工AI","豆包AI"]
        },
        "使用AI准备课程相关的素材时，可以使用以下策略？": {
            type: "多选",
            answers: ["紧扣“可视化”原则进行设计与生成", "用好各种适合自己学科的智能体", "AI生成的素材要紧扣教学目标而设计"]
        },
        "希沃AI百宝箱有自带的一些提示语模版，在生成教案时还可以选择“细化教案”。": {
            type: "单选",
            answers: ["正确"]
        },
        "在使用AI生成课件时，可以应用以下哪些技巧？": {
            type: "多选",
            answers: ["希沃白板AI一键备课，生成课件和对应教学设计", "通过Kimi等工具分析教材，生成课件大纲和主要内容后，再用其他AI软件生成课件初稿，最后添加个性化元素"]
        },
        //********************************************************************************//
        "在AI助力教学重难点突破的应用中，我们可以尝试以下哪几种应用路径。": {
            type: "多选",
            answers: ["借助AI生成功能，将重难点抽象内容可视化", "借助AI智能体功能，为重难点学习提供学习资源","借助AI大模型功能，为重难点知识应用设计场景"]
        },
        "在AI助力激发学生兴趣的课程中，介绍了以下哪几种AI工具应用？": {
            type: "多选",
            answers: ["kimi AI", "天工AI","即梦AI"]
        },
        "在语文学科中，针对古代经典篇章中的文字理解，我们可以利用即梦AI将抽象内容可视化呈现。": {
            type: "单选",
            answers: ["对"]
        },
        "以下关于AI助力教学重难点突破的应用中，描述正确的是？": {
            type: "多选",
            answers: ["英语学科中，学生可以通过与AI的对话，让智能体动态调整学习资源的难度和类型，实现个性化学习。", "物理学科中，智能体可以提供详细的物理原理和公式解释，帮助学生深入理解物理概念。","化学学科中，智能体可以提供化学方程式和物质性质的查询功能，方便学生自主学习。"]
        },
        "在AI助力练习设计多样化的应用中，要注意以下哪几个操作要点？": {
            type: "多选",
            answers: ["向AI提问获取丰富练习内容", "结合教学要求遴选练习内容","向AI深入追问练习实施过程"]
        },
        //********************************************************************************//
        "在AI辅助下的学生综合素养提升课程中，重点介绍了哪几个方面的学生素养提升？": {
            type: "多选",
            answers: ["审美感知", "创新能力"]
        },
        "在AI助力学生观察能力培养与提升课程中，介绍了以下哪几种AI工具应用。": {
            type: "多选",
            answers: ["文心一言", "腾讯元宝","AI识别王","豆包"]
        },
        "在AI助力学生观察能力培养与提升应用中，我们可以尝试以下哪几种应用路径？": {
            type: "多选",
            answers: ["巧用智能图像识别技术，准确把握观察要点", "打造虚拟空间，突破观察条件限制","个性化助教陪练，切实提升观察能力"]
        },
        "在课程中，提及的AI辅助下的学生伴学资源的生成应用有哪几个方面？": {
            type: "多选",
            answers: ["AI辅助学生生成精准匹配的伴学资源", "AI辅助学生生成情境式认知进阶伴学资源","AI辅助学生生成实时互动的伴学资源"]
        },
        "在使用AI工具实施“以文生图”的应用时，要注意以下哪几个要点？": {
            type: "多选",
            answers: ["要解构文本，提炼绘画元素", "将文学语言再凝练为绘画语言"]
        },
        //********************************************************************************//
        "以下对于班级优化大师的AI智能评语功能，描述正确的是？": {
            type: "多选",
            answers: ["会综合过往的点评数据记录自动生成", "生成的智能评语支持一键导出功能","可以查看每周的点评记录与具体评语"]
        },
        "在使用AI进行分层作业设计时，不仅要注意提供正确的提示语，还要注意根据学生的实际学情进行内容的甄别以及追问。": {
            type: "单选",
            answers: ["对"]
        },
        "对于分层作业的设计，我们遇到的实施难点有哪些？": {
            type: "多选",
            answers: ["基础型作业内容较为单一，难以激起学生完成作业的热情", "素养型作业设计较为复杂，需要教师投入更多的时间和精力","实践型作业，需要提供完整配套的实践步骤和说明，需要教师尝试后才可以设计"]
        },
        "我们可以使用班级优化大师助力学生有效精准的素质评价，以下相关应用描述正确的是？": {
            type: "多选",
            answers: ["创建多元评价标签，开展丰富且有针对性的行为评价", "随时随地开展评价，用过程数据保证评价精准","AI评语汇聚过程数据，用数据智能生成评价结果"]
        },
        "以下哪些AI工具，能够实现助力作业智能批改？": {
            type: "多选",
            answers: ["快对APP", "快问AI","光速写作","网易有道词典"]
        },
        //********************************************************************************//
        "运用AI进行家校沟通时，有哪些好的策略？": {
            type: "多选",
            answers: ["用AI分析收集的家校沟通材料", "用AI分析真问题，提出精准建议", "用AI工具推送给家长，进行及时交流"]
        },
        "利用AI进行班级事务管理时，可以遵循以下哪些策略？": {
            type: "多选",
            answers: ["学会用数据投喂AI", "掌握几个核心AI工具", "应用为王，提高效率"]
        },
        "利用AI进行家长会相关设计和实施时，可以运用在以下哪些方面？": {
            type: "多选",
            answers: ["AI设计主题", "AI设计开场白", "AI制作海报","AI制作PPT","AI制作二维码，传达学生祝福"]
        },
        "利用AI进行班级活动的设计和实施时，有哪些好的策略？": {
            type: "多选",
            answers: ["给自己安排专属“AI智能体”", "用AI重构班级活动工作流程", "用AI与学生共同创建氛围"]
        },
        "在使用AI进行班级事务管理时，讲师提到了哪些应用场景？": {
            type: "多选",
            answers: ["填写各种工作表格", "填写学生评语", "进行学生表现分析","其他班级事务管理"]
        },
        //********************************************************************************//
        "使用AI工具，可以解决以下哪几个和课题研究相关的难题？": {
            type: "多选",
            answers: ["课题选题方向模糊不明，无法确定是否科学", "文献综述时文献查找困难，阅读量大，文献矩阵分析不精准", "立项申请书无法高效完成，无直接参考对象，专业性强，撰写困难"]
        },
        "使用AI工具，可以解决以下哪几个写作难题？": {
            type: "多选",
            answers: ["写作灵感何处寻找", "文章如何智能生成", "文章校对如何开展"]
        },
         "在A赋能教育写作的课程中，介绍了以下哪几种AI工具应用？": {
            type: "多选",
            answers: ["kimi AI", "文案猫", "秘塔写作猫"]
        },
         "AI赋能下的教研活动是通过“人工智能（获取解决策略）—人（优选解决策略）—人+人工智能（追问解决策略）”的流程，在这个流程中人是策略的筛选者、判断者、决策者，AI是策略提供者，人机协同，提高教研的有效性。": {
            type: "单选",
            answers: ["对"]
        },
         "在提供AI提示语时，要注意必须包含以下哪几个要素？": {
            type: "多选",
            answers: ["角色", "任务", "要求"]
        },
    };

    // ========================== 工具函数 ==========================

    const utils = {
        // AES加密函数
        aesEncrypt: function(data, key, iv) {
            // 将数据转为JSON字符串
            const dataStr = typeof data === 'object' ? JSON.stringify(data) : String(data);

            // 使用CryptoJS进行AES加密
            const keyBytes = CryptoJS.enc.Utf8.parse(key);
            const ivBytes = CryptoJS.enc.Utf8.parse(iv);

            const encrypted = CryptoJS.AES.encrypt(dataStr, keyBytes, {
                iv: ivBytes,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

            // 返回大写的Hex字符串
            return encrypted.ciphertext.toString(CryptoJS.enc.Hex).toUpperCase();
        },

        // AES解密函数
        aesDecrypt: function(encryptedData, key, iv) {
            try {
                const keyBytes = CryptoJS.enc.Utf8.parse(key);
                const ivBytes = CryptoJS.enc.Utf8.parse(iv);

                // 创建CipherParams对象
                const cipherParams = CryptoJS.lib.CipherParams.create({
                    ciphertext: CryptoJS.enc.Hex.parse(encryptedData)
                });

                // 解密
                const decrypted = CryptoJS.AES.decrypt(cipherParams, keyBytes, {
                    iv: ivBytes,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                });

                // 转换为UTF-8字符串
                return decrypted.toString(CryptoJS.enc.Utf8);
            } catch (error) {
                console.error('解密失败:', error);
                return null;
            }
        },

        // 生成时间戳
        generateTime: function() {
            return Date.now();
        },

        // 生成随机字符串
        generateRandomString: function(length = 22) {
            const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        },

        // 获取CSRF Token (适用于希沃学习平台)
        getCsrfToken: function() {
            const match = document.cookie.match(/csrfToken=([^;]+)/);
            return match ? match[1] : '';
        },

        // 发送请求
        sendRequest: async function(url, data, headers) {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(data)
                });
                return await response.json();
            } catch (error) {
                console.error('请求失败:', error);
                return null;
            }
        },

        // 安全保存数据到GM存储
        saveData: function(key, data) {
            try {
                const encryptedData = this.aesEncrypt(JSON.stringify(data), config.encryptionKey, config.encryptionKey);
                GM_setValue(key, encryptedData);
                return true;
            } catch (error) {
                console.error('保存数据失败:', error);
                return false;
            }
        },

        // 从GM存储中安全读取数据
        loadData: function(key) {
            try {
                const encryptedData = GM_getValue(key);
                if (!encryptedData) return null;

                const decryptedData = this.aesDecrypt(encryptedData, config.encryptionKey, config.encryptionKey);
                return JSON.parse(decryptedData);
            } catch (error) {
                console.error('读取数据失败:', error);
                return null;
            }
        },

        // 检查当前站点
        getCurrentSite: function() {
            const url = window.location.href;
            if (url.includes('study.seewoedu.cn')) {
                return 'seewo';
            } else if (url.includes('cpb-m.cvte.com')) {
                return 'cpb';
            }
            return 'unknown';
        },

        // 清理文本（移除多余空格和特殊字符）
        cleanText: function(text) {
            if (!text) return '';
            return text.replace(/\s+/g, ' ').trim();
        },

        // 创建延迟
        sleep: function(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        // 获取不重复的随机索引
        getRandomIndices: function(max, count) {
            const indices = Array.from({ length: max }, (_, i) => i);
            for (let i = indices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [indices[i], indices[j]] = [indices[j], indices[i]];
            }
            return indices.slice(0, count);
        }
    };

    // ========================== 授权管理 ==========================

    const authManager = {
        // 验证授权
        verifyLicense: function(licenseKey) {
            return new Promise((resolve, reject) => {
                // 获取设备信息用于验证
                const deviceInfo = {
                    userAgent: navigator.userAgent,
                    screenSize: `${window.screen.width}x${window.screen.height}`,
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    language: navigator.language,
                    timestamp: new Date().getTime()
                };

                const payload = {
                    license_key: licenseKey,
                    device_info: deviceInfo
                };

                console.log('尝试发送授权验证请求到:', config.authServerUrl);
                console.log('请求数据:', payload);

                // 使用GM_xmlhttpRequest发送请求到验证服务器
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: config.authServerUrl,
                    data: JSON.stringify(payload),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    onload: function(response) {
                        console.log('收到服务器响应:', response.status, response.responseText);
                        try {
                            const result = JSON.parse(response.responseText);
                            if (result.success) {
                                resolve(result);
                            } else {
                                reject(new Error(result.message || '授权验证失败'));
                            }
                        } catch (error) {
                            console.error('解析响应失败:', error);
                            reject(new Error('授权服务器响应无效'));
                        }
                    },
                    onerror: function(error) {
                        console.error('请求错误:', error);
                        reject(new Error('无法连接到授权服务器'));
                    },
                    ontimeout: function() {
                        console.error('请求超时');
                        reject(new Error('授权服务器请求超时'));
                    }
                });
            });
        },

        // 保存授权信息
        saveLicenseInfo: function(licenseKey, licenseInfo) {
            utils.saveData('licenseKey', licenseKey);
            utils.saveData('licenseInfo', licenseInfo);
            utils.saveData('lastAuthCheck', new Date().getTime());
            utils.saveData('authExpiry', licenseInfo.expiry_time);

            // 更新脚本状态
            scriptState.authorized = true;
            scriptState.authKey = licenseKey;
            scriptState.licenseInfo = licenseInfo;
        },

        // 从存储中加载授权信息
        loadLicenseInfo: function() {
            const licenseKey = utils.loadData('licenseKey');
            const licenseInfo = utils.loadData('licenseInfo');
            const lastAuthCheck = utils.loadData('lastAuthCheck');
            const authExpiry = utils.loadData('authExpiry');

            if (licenseKey && licenseInfo) {
                // 检查授权是否过期
                const now = new Date().getTime();

                if (authExpiry && now < authExpiry) {
                    scriptState.authorized = true;
                    scriptState.authKey = licenseKey;
                    scriptState.licenseInfo = licenseInfo;

                    // 如果超过检查间隔，重新验证授权
                    if (!lastAuthCheck || (now - lastAuthCheck > config.authCheckInterval)) {
                        // 使用立即执行的async函数来等待重新验证结果
                        (async () => {
                            try {
                                const revalidated = await this.revalidateLicense(licenseKey);
                                if (!revalidated) {
                                    // 如果重新验证失败，显示授权对话框
                                    this.showAuthDialog();
                                }
                            } catch (error) {
                                console.error("重新验证失败:", error);
                                this.showAuthDialog();
                            }
                        })();
                    }

                    return true;
                } else {
                    // 授权过期，清除存储的授权信息
                    GM_deleteValue('licenseKey');
                    GM_deleteValue('licenseInfo');
                    GM_deleteValue('lastAuthCheck');
                    GM_deleteValue('authExpiry');
                    scriptState.authorized = false;
                    console.log('授权已过期');
                }
            }

            scriptState.authorized = false;
            return false;
        },

        // 重新验证授权
        revalidateLicense: async function(licenseKey) {
            try {
                const result = await this.verifyLicense(licenseKey);

                if (result.success) {
                    this.saveLicenseInfo(licenseKey, result.data);
                    return true;
                } else {
                    // 验证失败，撤销授权
                    scriptState.authorized = false;
                    GM_deleteValue('licenseKey');
                    GM_deleteValue('licenseInfo');
                    GM_deleteValue('lastAuthCheck');
                    GM_deleteValue('authExpiry');
                    console.log('授权验证失败，授权已撤销');
                    return false;
                }
            } catch (error) {
                console.error('重新验证授权失败:', error);
                // 验证失败，撤销授权
                scriptState.authorized = false;
                GM_deleteValue('licenseKey');
                GM_deleteValue('licenseInfo');
                GM_deleteValue('lastAuthCheck');
                GM_deleteValue('authExpiry');
                console.log('授权验证失败，授权已撤销');
                return false;
            }
        },

        // 显示授权对话框
        showAuthDialog: function() {
            // 如果已存在对话框，则不重复创建
            if (document.getElementById('auth-dialog')) return;

            const dialogHTML = `
        <div id="auth-dialog" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        ">
            <div style="
                background-color: white;
                border-radius: 5px;
                padding: 20px;
                width: 400px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            ">
                <h2 style="margin-top: 0; color: #333;">刷课助手授权验证，授权码在<a href="https://www.qianxun1688.com/links/E46F5C6A" target="_blank">这里获取</a>。注意不要选错商品，卡密不通用</h2>
                <h2 style="margin-top: 0; color: #333;">注意授权码有时效，大概可以学两个号，一个号需要6-7分钟。</a></h2>
                <p>请输入您的授权码以继续使用刷课助手：</p>
                <input type="text" id="license-key-input" placeholder="授权码" style="
                    width: 100%;
                    padding: 8px;
                    margin: 10px 0;
                    border: 1px solid #ddd;
                    border-radius: 3px;
                    box-sizing: border-box;
                ">
                <div id="auth-message" style="
                    margin: 10px 0;
                    padding: 8px;
                    border-radius: 3px;
                    display: none;
                "></div>
                <div style="display: flex; justify-content: space-between; margin-top: 15px;">
                    <button id="hide-auth-dialog-btn" style="
                        background-color: #f44336;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 3px;
                        cursor: pointer;
                    ">取消</button>
                    <button id="verify-license-btn" style="
                        background-color: #4CAF50;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 3px;
                        cursor: pointer;
                    ">验证</button>
                </div>
            </div>
        </div>
    `;

            // 添加对话框到DOM
            const dialogContainer = document.createElement('div');
            dialogContainer.innerHTML = dialogHTML;
            document.body.appendChild(dialogContainer);

            // 添加验证按钮事件处理
            const verifyBtn = document.getElementById('verify-license-btn');
            const licenseInput = document.getElementById('license-key-input');
            const messageDiv = document.getElementById('auth-message');
            const hideBtn = document.getElementById('hide-auth-dialog-btn');

            // 绑定隐藏按钮事件
            hideBtn.addEventListener('click', () => {
                document.body.removeChild(dialogContainer);
            });

            verifyBtn.addEventListener('click', async () => {
                const licenseKey = licenseInput.value.trim();

                if (!licenseKey) {
                    showMessage('请输入授权码', 'error');
                    return;
                }

                showMessage('正在验证授权...', 'info');
                verifyBtn.disabled = true;

                try {
                    const result = await this.verifyLicense(licenseKey);

                    if (result.success) {
                        this.saveLicenseInfo(licenseKey, result.data);
                        showMessage('授权验证成功！', 'success');

                        // 关闭对话框，初始化脚本
                        setTimeout(() => {
                            document.body.removeChild(dialogContainer);
                            initScriptForCurrentSite();
                        }, 1000);
                    } else {
                        showMessage(result.message || '授权验证失败', 'error');
                        verifyBtn.disabled = false;
                    }
                } catch (error) {
                    showMessage(error.message || '授权验证过程出错', 'error');
                    verifyBtn.disabled = false;
                }
            });

            // 显示消息函数
            function showMessage(text, type) {
                messageDiv.style.display = 'block';
                messageDiv.textContent = text;

                // 根据消息类型设置颜色
                switch (type) {
                    case 'error':
                        messageDiv.style.backgroundColor = '#ffebee';
                        messageDiv.style.color = '#c62828';
                        break;
                    case 'success':
                        messageDiv.style.backgroundColor = '#e8f5e9';
                        messageDiv.style.color = '#2e7d32';
                        break;
                    case 'info':
                    default:
                        messageDiv.style.backgroundColor = '#e3f2fd';
                        messageDiv.style.color = '#1565c0';
                        break;
                }
            }
        }
    };

    // ========================== 希沃学习助手 ==========================

    const seewoHelper = {
        isRunning: false,
        currentCourseIndex: 0,
        logElement: null,
        progressBar: null,
        progressBarContainer: null,
        progressText: null,

        // 初始化请求头
        initHeaders: function() {
            const token = utils.getCsrfToken();
            return {
                'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
                'Accept': "application/json, text/plain, */*",
                'Accept-Encoding': "gzip, deflate, br, zstd",
                'Content-Type': "application/json",
                'sec-ch-ua-platform': "\"Windows\"",
                'x-csrf-token': token,
                'sec-ch-ua': "\"Not(A:Brand\";v=\"99\", \"Chromium\";v=\"133\"",
                'sec-ch-ua-mobile': "?0",
                'origin': "https://study.seewoedu.cn",
                'sec-fetch-site': "same-origin",
                'sec-fetch-mode': "cors",
                'sec-fetch-dest': "empty",
                'referer': "https://study.seewoedu.cn/tCourse/group/f34dfc60b67b460ebe2cb6c329f23038/course/ba1d548d6e8e4a5687a5dca8754bab72"
            };
        },

        // 添加日志
        log: function(message, isError = false) {
            if (!this.logElement) return;

            const logItem = document.createElement('div');
            logItem.textContent = `${new Date().toLocaleTimeString()} - ${message}`;

            if (isError) {
                logItem.style.color = 'red';
            }

            this.logElement.appendChild(logItem);
            this.logElement.scrollTop = this.logElement.scrollHeight;
        },

        // 更新进度条
        updateProgress: function(current, total) {
            if (!this.progressBar || !this.progressText) return;

            const percent = Math.round((current / total) * 100);
            this.progressBar.style.width = `${percent}%`;
            this.progressText.textContent = `进度: ${current}/${total} (${percent}%)`;
        },

        // 处理单个课程
        processCourse: async function(courseId) {
            try {
                const headers = this.initHeaders();
                const timeStamp = utils.generateTime();
                const randomString = utils.generateRandomString();

                // 随机生成学习次数
                const count = Math.floor(Math.random() * 21) + 40; // 40-60之间的随机数

                this.log(`开始处理课程: ${courseId}, 刷取次数: ${count}`);

                // 构建请求体
                const body = {
                    courseGroupUid: config.seewoGroupCourseId,
                    courseUid: courseId,
                    duration: 30,
                    timestamp: timeStamp
                };

                // 加密请求体
                const encryptedBody = utils.aesEncrypt(body, config.seewoKey, config.seewoIv);

                const payload = {
                    body: encryptedBody,
                    timestamp: timeStamp
                };

                // 发送学习时长请求
                for (let i = 0; i < count; i++) {
                    const url = `https://study.seewoedu.cn/pc/api/v2/course/study?time=${timeStamp}-${randomString}`;
                    await utils.sendRequest(url, payload, headers);
                    if (i % 10 === 0) {
                        this.log(`课程 ${courseId}: 已完成 ${i}/${count} 次请求`);
                    }

                    // 随机等待100-300毫秒
                    await utils.sleep(Math.floor(Math.random() * 200) + 150);
                }

                // 发送学习记录
                const logUrl = `https://study.seewoedu.cn/pc/api/v1/studyLogs?time=${utils.generateTime()}-${utils.generateRandomString()}`;
                const logData = {
                    courseGroupUid: config.seewoGroupCourseId,
                    courseUid: courseId,
                    last: 0
                };

                const logResult = await utils.sendRequest(logUrl, logData, headers);
                this.log(`课程学习记录: ${logResult ? '成功' : '失败'}`);

                // 完成标签
                const completeUrl = `https://study.seewoedu.cn/pc/api/v1/studyLogs/study?time=${utils.generateTime()}-${utils.generateRandomString()}`;
                const completeData = {
                    courseGroupUid: config.seewoGroupCourseId,
                    courseUid: courseId,
                    campUid: null
                };

                const completeResult = await utils.sendRequest(completeUrl, completeData, headers);
                this.log(`课程完成标记: ${completeResult ? '成功' : '失败'}`);

                return true;
            } catch (error) {
                this.log(`处理课程 ${courseId} 时出错: ${error.message}`, true);
                return false;
            }
        },

        // 开始学习
        startLearning: async function() {
            if (this.isRunning) return;

            this.isRunning = true;
            this.currentCourseIndex = 0;

            try {
                const totalCourses = config.seewoCourseIds.length;

                this.log(`开始学习，共 ${totalCourses} 个课程`);
                this.updateProgress(0, totalCourses);

                for (let i = 0; i < totalCourses; i++) {
                    if (!this.isRunning) {
                        this.log('学习已停止');
                        break;
                    }

                    this.currentCourseIndex = i;
                    const courseId = config.seewoCourseIds[i];

                    this.updateProgress(i, totalCourses);
                    await this.processCourse(courseId);

                    // 随机等待1-3秒，模拟真实操作
                    const waitTime = Math.floor(Math.random() * 2000) + 1000;
                    await utils.sleep(waitTime);
                }

                if (this.isRunning) {
                    this.updateProgress(totalCourses, totalCourses);
                    this.log('所有课程学习完成！');
                }
            } catch (error) {
                this.log(`学习过程中发生错误: ${error.message}`, true);
            } finally {
                this.isRunning = false;
            }
        },

        // 停止学习
        stopLearning: function() {
            if (!this.isRunning) return;

            this.isRunning = false;
            this.log('正在停止学习...');
        },

        // 创建UI界面
        createUI: function() {
            // 创建面板容器
            const panel = document.createElement('div');
            panel.id = 'seewo-helper-panel';
            panel.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 300px;
                background-color: white;
                border: 1px solid #ccc;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
                z-index: 9999;
                font-family: Arial, sans-serif;
                transition: all 0.3s ease;
            `;

            // 创建标题栏
            const titleBar = document.createElement('div');
            titleBar.style.cssText = `
                padding: 10px;
                background-color: #f0f0f0;
                border-bottom: 1px solid #ccc;
                cursor: move;
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;

            const title = document.createElement('div');
            title.textContent = '希沃学习时长助手';
            title.style.fontWeight = 'bold';

            const closeBtn = document.createElement('button');
            closeBtn.textContent = '×';
            closeBtn.style.cssText = `
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                padding: 0 5px;
            `;
            closeBtn.onclick = () => {
                panel.style.display = 'none';
                toggleBtn.style.display = 'block';
            };

            titleBar.appendChild(title);
            titleBar.appendChild(closeBtn);

            // 创建内容区域
            const content = document.createElement('div');
            content.style.padding = '10px';

            // 创建授权状态显示
            const authStatus = document.createElement('div');
            authStatus.id = 'auth-status';
            authStatus.style.cssText = `
                margin-bottom: 10px;
                padding: 5px 10px;
                background-color: #e8f5e9;
                color: #2e7d32;
                border-radius: 4px;
                font-size: 12px;
            `;

            // 计算授权剩余时间
            const expiryTime = utils.loadData('authExpiry');
            if (expiryTime) {
                const remainingTime = Math.max(0, expiryTime - Date.now());
                const remainingMinutes = Math.floor(remainingTime / (60 * 1000));
                authStatus.textContent = `授权状态: 有效 (剩余约 ${remainingMinutes} 分钟)`;
            } else {
                authStatus.textContent = '授权状态: 未知';
                authStatus.style.backgroundColor = '#fff3e0';
                authStatus.style.color = '#e65100';
            }

            // 创建进度条
            this.progressBarContainer = document.createElement('div');
            this.progressBarContainer.style.cssText = `
                width: 100%;
                height: 20px;
                background-color: #f0f0f0;
                border-radius: 10px;
                margin: 10px 0;
                overflow: hidden;
            `;

            this.progressBar = document.createElement('div');
            this.progressBar.style.cssText = `
                height: 100%;
                width: 0%;
                background-color: #4CAF50;
                transition: width 0.3s;
            `;

            this.progressBarContainer.appendChild(this.progressBar);

            // 创建进度文本
            this.progressText = document.createElement('div');
            this.progressText.style.fontSize = '14px';
            this.progressText.textContent = '进度: 0/0 (0%)';

            // 创建按钮区域
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = `
                display: flex;
                justify-content: space-between;
                margin: 10px 0;
            `;

            const startBtn = document.createElement('button');
            startBtn.textContent = '开始学习';
            startBtn.style.cssText = `
                padding: 8px 15px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                flex: 1;
                margin-right: 5px;
            `;
            startBtn.onclick = () => this.startLearning();

            const stopBtn = document.createElement('button');
            stopBtn.textContent = '停止学习';
            stopBtn.style.cssText = `
                padding: 8px 15px;
                background-color: #f44336;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                flex: 1;
                margin-left: 5px;
            `;
            stopBtn.onclick = () => this.stopLearning();

            buttonContainer.appendChild(startBtn);
            buttonContainer.appendChild(stopBtn);

            // 创建日志区域
            const logContainer = document.createElement('div');
            logContainer.style.cssText = `
                margin-top: 10px;
                border: 1px solid #ccc;
                border-radius: 4px;
                height: 150px;
                overflow-y: auto;
                padding: 5px;
                font-size: 12px;
                background-color: #f9f9f9;
            `;

            this.logElement = logContainer;

            // 添加所有元素到内容区域
            content.appendChild(authStatus);
            content.appendChild(this.progressBarContainer);
            content.appendChild(this.progressText);
            content.appendChild(buttonContainer);
            content.appendChild(logContainer);

            // 添加标题栏和内容区域到面板
            panel.appendChild(titleBar);
            panel.appendChild(content);

            // 添加面板到文档
            document.body.appendChild(panel);

            // 让面板可拖动
            this.makeDraggable(panel, titleBar);

            // 添加切换按钮
            const toggleBtn = document.createElement('button');
            toggleBtn.textContent = '学习助手';
            toggleBtn.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 8px 15px;
                background-color: #2196F3;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                z-index: 9998;
            `;
            toggleBtn.onclick = () => {
                if (panel.style.display === 'none') {
                    panel.style.display = 'block';
                    toggleBtn.style.display = 'none';
                }
            };

            document.body.appendChild(toggleBtn);

            // 初始添加一些日志
            this.log('希沃学习时长助手已加载');
            this.log('点击"开始学习"按钮开始自动学习');

            // 更新授权状态显示
            this.startAuthExpiryTimer(authStatus);
        },

        // 启动授权过期倒计时
        startAuthExpiryTimer: function(statusElement) {
            if (!statusElement) return;

            const updateAuthStatus = () => {
                const expiryTime = utils.loadData('authExpiry');
                if (expiryTime) {
                    // 将UTC时间戳转换为本地时间
                    const remainingTime = Math.max(0, expiryTime - Date.now());
                    const remainingMinutes = Math.floor(remainingTime / (60 * 1000));

                    if (remainingTime <= 0) {
                        statusElement.textContent = '授权状态: 已过期';
                        statusElement.style.backgroundColor = '#ffebee';
                        statusElement.style.color = '#c62828';

                        // 授权过期，显示授权对话框
                        authManager.showAuthDialog();
                        return;
                    }

                    statusElement.textContent = `授权状态: 有效 (有效时间剩余约 ${remainingMinutes} 分钟)`;
                    statusElement.style.backgroundColor = '#e8f5e9';
                    statusElement.style.color = '#2e7d32';
                } else {
                    statusElement.textContent = '授权状态: 未知';
                    statusElement.style.backgroundColor = '#fff3e0';
                    statusElement.style.color = '#e65100';
                }
            };

            // 首次更新
            updateAuthStatus();

            // 每分钟更新一次
            setInterval(updateAuthStatus, 60 * 1000);
        },

        // 使元素可拖动
        makeDraggable: function(element, handle) {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

            handle.onmousedown = dragMouseDown;

            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                // 获取鼠标初始位置
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                // 鼠标移动时调用elementDrag
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                // 计算新位置
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                // 设置元素的新位置
                element.style.top = (element.offsetTop - pos2) + "px";
                element.style.left = (element.offsetLeft - pos1) + "px";
                element.style.bottom = "auto";
                element.style.right = "auto";
            }

            function closeDragElement() {
                // 停止移动
                document.onmouseup = null;
                document.onmousemove = null;
            }
        },

        // 初始化
        init: function() {
            this.createUI();
        }
    };

    // ========================== CPB自动答题 ==========================

    const cpbHelper = {
        // 自动回答所有问题
        autoAnswerAllQuestions: async function() {
            // 获取页面上的所有问题容器
            const questionContainers = document.querySelectorAll('.qn-container');
            console.log(`找到 ${questionContainers.length} 个问题`);

            // 扫描试卷中的所有问题，并尝试将未收集的问题添加到题库
            await this.scanNewQuestions(questionContainers);

            // 处理每个问题
            for (let i = 0; i < questionContainers.length; i++) {
                const container = questionContainers[i];

                // 检查问题是否已回答
                const isAnswered = container.querySelector('.van-checkbox--checked') ||
                                  container.querySelector('.van-radio--checked');

                if (!isAnswered) {
                    await this.processQuestion(container);
                    await utils.sleep(config.delayBetweenActions);
                } else {
                    console.log(`问题 ${i+1} 已回答，跳过`);
                }
            }

            // 根据配置决定是否自动提交
            if (config.autoSubmit) {
                await utils.sleep(config.delayBeforeSubmit);
                const submitButton = document.querySelector('.btn-block .btn');
                if (submitButton) {
                    console.log('提交答案...');
                    submitButton.click();
                }
            }
        },

        // 扫描试卷中的新问题
        scanNewQuestions: async function(questionContainers) {
            let newQuestionsFound = false;

            for (const container of questionContainers) {
                // 获取问题标题
                const titleElement = container.querySelector('.qn-title');
                if (!titleElement) continue;

                // 清理问题文本
                const questionText = utils.cleanText(titleElement.textContent);
                if (!questionText) continue;

                // 如果问题不在题库中，则添加到题库中
                if (!answerDatabase[questionText]) {
                    const isMultipleChoice = !!container.querySelector('.checkbox');
                    const type = isMultipleChoice ? "多选" : "单选";

                    // 获取所有选项
                    const options = isMultipleChoice
                        ? container.querySelectorAll('.van-checkbox')
                        : container.querySelectorAll('.van-radio');

                    // 创建答案占位符（这里不知道正确答案，所以都设为空）
                    answerDatabase[questionText] = {
                        type: type,
                        answers: [] // 空答案，等待用户导入正确答案
                    };

                    newQuestionsFound = true;
                    console.log(`发现新问题：${questionText}`);
                }
            }

            // 如果发现新问题，保存更新后的题库
            if (newQuestionsFound) {
                utils.saveData('answerDatabase', answerDatabase);
                console.log('已将新问题加入题库');
            }
        },

        // 处理一个问题
        processQuestion: async function(questionContainer) {
            // 获取问题标题
            const titleElement = questionContainer.querySelector('.qn-title');
            if (!titleElement) return;

            // 清理问题文本
            const questionText = utils.cleanText(titleElement.textContent);
            console.log('处理问题:', questionText);

            // 确定问题类型（单选或多选）
            const isMultipleChoice = !!questionContainer.querySelector('.checkbox');

            // 在题库中查找答案
            const answerData = answerDatabase[questionText];

            if (answerData && answerData.answers && answerData.answers.length > 0) {
                console.log(`找到答案: ${answerData.answers.join(', ')}`);

                if (isMultipleChoice) {
                    await this.handleMultipleChoiceWithAnswer(questionContainer, answerData.answers);
                } else {
                    await this.handleSingleChoiceWithAnswer(questionContainer, answerData.answers[0]);
                }
            } else {
                console.log('题库中未找到答案，随机选择');

                if (isMultipleChoice) {
                    await this.handleMultipleChoiceQuestion(questionContainer);
                } else {
                    await this.handleSingleChoiceQuestion(questionContainer);
                }
            }
        },

        // 处理多选题（有答案）
        handleMultipleChoiceWithAnswer: async function(questionContainer, answers) {
            const options = questionContainer.querySelectorAll('.van-checkbox');

            // 遍历所有选项
            for (let i = 0; i < options.length; i++) {
                const option = options[i];
                const label = option.querySelector('.van-checkbox__label');
                if (!label) continue;

                const optionText = utils.cleanText(label.textContent);

                // 如果选项文本在答案列表中，则选择该选项
                if (answers.some(answer => optionText.includes(answer) || answer.includes(optionText))) {
                    console.log(`选择选项: ${optionText}`);
                    label.click();
                    await utils.sleep(250);
                }
            }
        },

        // 处理单选题（有答案）
        handleSingleChoiceWithAnswer: async function(questionContainer, answer) {
            const options = questionContainer.querySelectorAll('.van-radio');

            // 遍历所有选项
            for (let i = 0; i < options.length; i++) {
                const option = options[i];
                const label = option.querySelector('.van-radio__label');
                if (!label) continue;

                const optionText = utils.cleanText(label.textContent);

                // 如果选项文本包含答案，或答案包含选项文本，则选择该选项
                if (optionText.includes(answer) || answer.includes(optionText)) {
                    console.log(`选择选项: ${optionText}`);
                    label.click();
                    break; // 单选题只需选择一个选项
                }
            }
        },

        // 处理多选题（随机）
        handleMultipleChoiceQuestion: async function(questionContainer) {
            console.log('处理多选题（随机）');

            // 获取所有选项
            const options = questionContainer.querySelectorAll('.van-checkbox');

            // 对于多选题，选择一半的选项（向上取整）
            const optionsToSelect = Math.ceil(options.length / 2);

            // 随机选择指定数量的选项
            const selectedIndices = utils.getRandomIndices(options.length, optionsToSelect);

            for (const index of selectedIndices) {
                const option = options[index];
                const label = option.querySelector('.van-checkbox__label');
                if (label) {
                    label.click();
                    await utils.sleep(250); // 选择之间的小延迟
                }
            }
        },

        // 处理单选题（随机）
        handleSingleChoiceQuestion: async function(questionContainer) {
            console.log('处理单选题（随机）');

            // 获取所有选项
            const options = questionContainer.querySelectorAll('.van-radio');

            if (options.length > 0) {
                // 对于单选题，选择一个随机选项
                const randomIndex = Math.floor(Math.random() * options.length);
                const option = options[randomIndex];
                const label = option.querySelector('.van-radio__label');
                if (label) {
                    label.click();
                }
            }
        },

        // 导入题库
        importAnswerDatabase: function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';

            input.onchange = function(event) {
                const file = event.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const database = JSON.parse(e.target.result);
                        answerDatabase = database;
                        utils.saveData('answerDatabase', database);
                        alert('题库导入成功！共导入 ' + Object.keys(database).length + ' 个题目。');
                    } catch (error) {
                        alert('题库导入失败！请确保文件格式正确。');
                        console.error('题库导入错误:', error);
                    }
                };
                reader.readAsText(file);
            };

            input.click();
        },

        // 导出题库
        exportAnswerDatabase: function() {
            const dataStr = JSON.stringify(answerDatabase, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

            const exportFileDefaultName = 'answer_database.json';

            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
        },

        // 创建按钮函数修改
        createAutoAnswerButton: function() {
            console.log('尝试创建自动答题按钮');

            // 更通用的选择器，适应不同页面结构
            const container = document.body;
            if (!container) {
                console.error('找不到容器元素');
                return;
            }

            // 检查按钮是否已存在
            if (document.querySelector('.auto-answer-controls')) {
                console.log('自动答题按钮已存在，不重复创建');
                return;
            }

            const buttonDiv = document.createElement('div');
            buttonDiv.style.position = 'fixed';
            buttonDiv.style.top = '10px';
            buttonDiv.style.right = '10px';
            buttonDiv.style.zIndex = '9999';
            buttonDiv.style.display = 'flex';
            buttonDiv.style.flexDirection = 'column';
            buttonDiv.style.gap = '10px';
            buttonDiv.className = 'auto-answer-controls';

            // 创建授权状态显示
            const authStatus = document.createElement('div');
            authStatus.id = 'auth-status-cpb';
            authStatus.style.cssText = `
        padding: 5px 10px;
        background-color: #e8f5e9;
        color: #2e7d32;
        border-radius: 4px;
        font-size: 12px;
        text-align: center;
        margin-bottom: 5px;
    `;

            // 计算授权剩余时间
            const expiryTime = utils.loadData('authExpiry');
            if (expiryTime) {
                const remainingTime = Math.max(0, expiryTime - Date.now());
                const remainingMinutes = Math.floor(remainingTime / (60 * 1000));
                authStatus.textContent = `授权有效: 剩余${remainingMinutes}分钟`;
            } else {
                authStatus.textContent = '授权状态: 未知';
                authStatus.style.backgroundColor = '#fff3e0';
                authStatus.style.color = '#e65100';
            }

            const autoAnswerButton = document.createElement('button');
            autoAnswerButton.textContent = '自动答题';
            autoAnswerButton.style.backgroundColor = '#3388ff';
            autoAnswerButton.style.color = 'white';
            autoAnswerButton.style.border = 'none';
            autoAnswerButton.style.borderRadius = '4px';
            autoAnswerButton.style.padding = '8px 16px';
            autoAnswerButton.style.cursor = 'pointer';
            autoAnswerButton.style.fontWeight = 'bold';
            autoAnswerButton.style.width = '100%';
            autoAnswerButton.className = 'auto-answer-button';

            autoAnswerButton.addEventListener('click', () => {
                autoAnswerButton.disabled = true;
                autoAnswerButton.textContent = '答题中...';
                this.autoAnswerAllQuestions().then(() => {
                    autoAnswerButton.textContent = '已完成';
                    setTimeout(() => {
                        autoAnswerButton.textContent = '自动答题';
                        autoAnswerButton.disabled = false;
                    }, 2000);
                });
            });

            buttonDiv.appendChild(authStatus);
            buttonDiv.appendChild(autoAnswerButton);
            document.body.appendChild(buttonDiv);

            console.log('自动答题按钮创建成功');

            // 启动授权倒计时
            this.startAuthExpiryTimer(authStatus);

            // 添加题库管理按钮
            this.createDatabaseButtons(buttonDiv);
        },

        // 启动授权过期倒计时
        startAuthExpiryTimer: function(statusElement) {
            if (!statusElement) return;

            const updateAuthStatus = () => {
                const expiryTime = utils.loadData('authExpiry');
                if (expiryTime) {
                    const remainingTime = Math.max(0, expiryTime - Date.now());
                    const remainingMinutes = Math.floor(remainingTime / (60 * 1000));

                    if (remainingTime <= 0) {
                        statusElement.textContent = '授权已过期';
                        statusElement.style.backgroundColor = '#ffebee';
                        statusElement.style.color = '#c62828';

                        // 授权过期，显示授权对话框
                        authManager.showAuthDialog();
                        return;
                    }

                    statusElement.textContent = `授权有效: 剩余${remainingMinutes}分钟`;
                    statusElement.style.backgroundColor = '#e8f5e9';
                    statusElement.style.color = '#2e7d32';
                } else {
                    statusElement.textContent = '授权状态: 未知';
                    statusElement.style.backgroundColor = '#fff3e0';
                    statusElement.style.color = '#e65100';
                }
            };

            // 首次更新
            updateAuthStatus();

            // 每分钟更新一次
            setInterval(updateAuthStatus, 60 * 1000);
        },

        // 创建题库导入/导出按钮
        createDatabaseButtons: function(controlsDiv) {
            if (!controlsDiv) return;

            // 创建按钮容器
            const dbButtonsContainer = document.createElement('div');
            dbButtonsContainer.style.cssText = `
                display: flex;
                justify-content: space-between;
                margin-top: 5px;
            `;

            // 导入题库按钮
            const importButton = document.createElement('button');
            importButton.textContent = '导入题库';
            importButton.style.cssText = `
                background-color: #28a745;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 5px 10px;
                cursor: pointer;
                font-size: 12px;
                flex: 1;
                margin-right: 5px;
            `;

            // 导出题库按钮
            const exportButton = document.createElement('button');
            exportButton.textContent = '导出题库';
            exportButton.style.cssText = `
                background-color: #ffc107;
                color: black;
                border: none;
                border-radius: 4px;
                padding: 5px 10px;
                cursor: pointer;
                font-size: 12px;
                flex: 1;
                margin-left: 5px;
            `;

            // 添加导入题库事件监听器
            importButton.addEventListener('click', () => this.importAnswerDatabase());

            // 添加导出题库事件监听器
            exportButton.addEventListener('click', () => this.exportAnswerDatabase());

            // 添加按钮到容器
            dbButtonsContainer.appendChild(importButton);
            dbButtonsContainer.appendChild(exportButton);

            // 添加容器到控制面板
            controlsDiv.appendChild(dbButtonsContainer);
        },

        // 初始化
        // CPB自动答题 - 初始化函数修改
        init: function() {
            console.log('初始化CPB自动答题');

            // 从存储中加载题库


            // 立即尝试创建按钮
            this.createAutoAnswerButton();

            // 然后设置观察器，以防页面动态加载
            this.observeDOMChanges();
        },

        // 监听DOM变化以处理动态加载的内容
        observeDOMChanges: function() {
            console.log('设置DOM观察器');

            // 初始化一个计时器，定期检查是否需要添加按钮
            setInterval(() => {
                if (!document.querySelector('.auto-answer-button')) {
                    console.log('定期检查: 未找到按钮，尝试创建');
                    this.createAutoAnswerButton();
                }
            }, 2000); // 每2秒检查一次

            // 同时使用MutationObserver监听DOM变化
            const observer = new MutationObserver((mutations) => {
                let shouldCreateButton = false;

                for (const mutation of mutations) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        // 如果有新元素添加，考虑创建按钮
                        shouldCreateButton = true;
                        break;
                    }
                }

                if (shouldCreateButton && !document.querySelector('.auto-answer-button')) {
                    console.log('DOM变化: 尝试创建按钮');
                    this.createAutoAnswerButton();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    };

    // ========================== 主函数 ==========================

    // 初始化脚本
    function init() {
        console.log('智能刷课助手已初始化');

        // 检查授权
        if (!authManager.loadLicenseInfo()) {
            console.log('未找到有效授权，显示授权对话框');
            authManager.showAuthDialog();
            return; // 确保在未授权时不会继续执行
        }

        // 确保授权状态是有效的
        if (!scriptState.authorized) {
            console.log('授权无效，显示授权对话框');
            authManager.showAuthDialog();
            return;
        }

        // 根据当前站点初始化对应的功能
        initScriptForCurrentSite();
    }

    // 根据当前站点初始化对应的功能
    function initScriptForCurrentSite() {
        // 再次检查授权状态，以防万一
        if (!scriptState.authorized) {
            console.log('授权无效，无法初始化功能');
            authManager.showAuthDialog();
            return;
        }

        const currentSite = utils.getCurrentSite();
        console.log(`当前站点: ${currentSite}`);

        switch (currentSite) {
            case 'seewo':
                console.log('初始化希沃学习助手');
                seewoHelper.init();
                break;

            case 'cpb':
                console.log('初始化CPB自动答题');
                cpbHelper.init();
                break;

            default:
                console.log('未知站点，无法初始化');
        }
    }

    // 等待页面完全加载后初始化
    window.addEventListener('load', init);

    // 如果页面已加载，立即初始化
    if (document.readyState === 'complete') {
        init();
    }
})();
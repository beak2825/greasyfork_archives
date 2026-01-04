// ==UserScript==
// @name        【万能】全平台自动答题脚本
// @version      4.6.8.0
// @namespace    自动答题
// @description  支持【超星学习通】【智慧树】【职教云系列】【雨课堂】【继续教育类】【小鹅通】【安徽继续教育】 【上海开放大学】 【华侨大学自考网络助学平台】【人卫慕课】【国家开放大学】【浙江省高等学校在线开放课程共享平台】【国地质大学远程与继续教育学院】【浙江省高等教育自学考试网络助学平台】 【湖南高等学历继续教育】 【优学院】 【学起Plus】【青书学堂】 【学堂在线】【英华学堂】【广开网络教学平台】等平台的测验考试，内置题库，自动答题功能全聚合。
// @author       万能
// @match        *://*/*
// @compatible   chrome firefox edge
// @grant        GM_info
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_getResourceURL
// @run-at       document-end
// @connect      yuketang.cn
// @connect      ykt.io
// @connect      localhost
// @connect      app.itihey.com
// @connect      appwk.baidu.com
// @connect      cx.icodef.com
// @resource     Img http://lyck6.cn/img/6.png
// @resource     Vue http://lib.baomitu.com/vue/2.6.0/vue.min.js
// @resource     ElementUi http://lib.baomitu.com/element-ui/2.15.9/index.js
// @resource     ElementUiCss https://lib.baomitu.com/element-ui/2.15.9/theme-chalk/index.min.css
// @resource     Table https://www.forestpolice.org/ttf/2.0/table.json
// @require      https://lib.baomitu.com/axios/0.27.2/axios.min.js
// @require      https://lib.baomitu.com/qs/5.2.1/qs.min.js
// @require      https://cdn.jsdelivr.net/gh/photopea/Typr.js@15aa12ffa6cf39e8788562ea4af65b42317375fb/src/Typr.min.js
// @require      https://cdn.jsdelivr.net/gh/photopea/Typr.js@f4fcdeb8014edc75ab7296bd85ac9cde8cb30489/src/Typr.U.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery@2.2.3/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery.md5@1.0.2/index.min.js
// @require      https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.js
// @require      https://cdn.jsdelivr.net/gh/zyufstudio/jQuery@3a09ff54b33fc2ae489b5083174698b3fa83f4a7/jPopBox/dist/jPopBox.min.js
// @connect      lyck6.cn
// @connect      *
// @connect      img.lyck6.cn
// @connect      cn-shanghai.lyck6.cn
// @connect      schoolapi.fenbi.com
// @connect      login.fenbi.com
// @connect      huawei-cdn.lyck6.cn
// @contributionURL   https://lyck6.cn/pay
// @antifeature  payment 解锁付费题库需捐助

// @backupURL    防止cdn.jsdelivr.net无法访问做以下兼容处理
// @require      https://fastly.jsdelivr.net/gh/photopea/Typr.js@15aa12ffa6cf39e8788562ea4af65b42317375fb/src/Typr.min.js
// @require      https://fastly.jsdelivr.net/gh/photopea/Typr.js@f4fcdeb8014edc75ab7296bd85ac9cde8cb30489/src/Typr.U.min.js
// @require      https://fastly.jsdelivr.net/npm/jquery@2.2.3/dist/jquery.min.js
// @require      https://fastly.jsdelivr.net/npm/jquery.md5@1.0.2/index.min.js
// @require      https://fastly.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.js
// @require      https://fastly.jsdelivr.net/gh/zyufstudio/jQuery@3a09ff54b33fc2ae489b5083174698b3fa83f4a7/jPopBox/dist/jPopBox.min.js

// @require      https://gcore.jsdelivr.net/gh/photopea/Typr.js@15aa12ffa6cf39e8788562ea4af65b42317375fb/src/Typr.min.js
// @require      https://gcore.jsdelivr.net/gh/photopea/Typr.js@f4fcdeb8014edc75ab7296bd85ac9cde8cb30489/src/Typr.U.min.js
// @require      https://gcore.jsdelivr.net/npm/jquery@2.2.3/dist/jquery.min.js
// @require      https://gcore.jsdelivr.net/npm/jquery.md5@1.0.2/index.min.js
// @require      https://gcore.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.js
// @require      https://gcore.jsdelivr.net/gh/zyufstudio/jQuery@3a09ff54b33fc2ae489b5083174698b3fa83f4a7/jPopBox/dist/jPopBox.min.js

// @require      https://testingcf.jsdelivr.net/gh/photopea/Typr.js@15aa12ffa6cf39e8788562ea4af65b42317375fb/src/Typr.min.js
// @require      https://testingcf.jsdelivr.net/gh/photopea/Typr.js@f4fcdeb8014edc75ab7296bd85ac9cde8cb30489/src/Typr.U.min.js
// @require      https://testingcf.jsdelivr.net/npm/jquery@2.2.3/dist/jquery.min.js
// @require      https://testingcf.jsdelivr.net/npm/jquery.md5@1.0.2/index.min.js
// @require      https://testingcf.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.js
// @require      https://testingcf.jsdelivr.net/gh/zyufstudio/jQuery@3a09ff54b33fc2ae489b5083174698b3fa83f4a7/jPopBox/dist/jPopBox.min.js
// @downloadURL https://update.greasyfork.org/scripts/483735/%E3%80%90%E4%B8%87%E8%83%BD%E3%80%91%E5%85%A8%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/483735/%E3%80%90%E4%B8%87%E8%83%BD%E3%80%91%E5%85%A8%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==




//全局配置参数
var GLOBAL = {
    timeout: 10E3, //接口响应超时时间，不建议小于10秒
    time: 3E3, //查题间隔时间，不建议小于5s，如果为了安全起见最好10s以上,即10E3
    delay: 3E3, //延迟加载，页面初始化完毕之后的等待2s之后再去搜题,
    fillAnswerDelay: 1E3, //填充答案的延迟，不建议小于0.5秒，默认一秒
    length: 400,//默认搜索框的长度，单位px可以适当调整
    autoSave: 0,//是否自动保存,如果平台支持保存功能，会自动进行保存，默认不保存

    //自定义题库接口,可以自己新增接口，以下仅作为实例 返回的比如是一个完整的答案的列表，如果不复合规则可以自定义传格式化函数 例如 ['答案','答案2',['多选A','多选B']]
    answerApi: {
        cx_icodef_com: (question) => {
            return new Promise(resolve => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://cx.icodef.com/v2/answer',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
                    },
                    data: 'topic[0]=' + encodeURIComponent(question),
                    onload: function (r) {
                        try {
                            const res = JSON.parse(r.responseText)
                            resolve([
                                res[0].result[0].correct.map(item => {
                                    return String(item.content).toString()
                                })
                            ])
                        } catch (e) {
                            resolve([])
                        }
                    },
                    onerror: function (e) {
                        resolve([])
                    }
                });
            })
        }
    }
};



(function (exports) {
    'use strict';

    const backup_baseHost_lyck6_cn = [
        'http://lyck6.cn',
        'http://scdncn.lyck6.cn'
    ];
    /**
     * 通用域名，但是也要防止部分校园网禁用，所以要做兼容
     * @type {Awaited<void>}
     */
    let baseHost_lyck6_cn = 'http://huawei-cdn.lyck6.cn';

    /**
     * 测试主域名，不通过再测试其他域名
     */
    function selectBaseHost() {
        const intv = setInterval(() => {
            try {
                const app = exports.top.document.getElementById('iframeNode').contentWindow.document.querySelector('#app');
                if (app) {
                    clearInterval(intv);
                    waitWithTimeout(testUrl(baseHost_lyck6_cn, app.outerHTML), 3000).then(r => {
                        console.log("主域名通信结果", r);
                        GM_setValue('host', r);
                    }).catch(e => {
                        //去测试备用域名
                        Promise.race(backup_baseHost_lyck6_cn.map((url) => {
                            return waitWithTimeout(testUrl(url, app.outerHTML), 3000)
                        })).then(r => {
                            console.log("测试备用域名结果", r);
                            GM_setValue('host', r);
                            baseHost_lyck6_cn = r;
                        });
                    });
                }
            } catch (e) {
            }
        }, 100);
    }


    /**
     * 测试url可以访问不
     * @param url
     * @param html
     * @returns {Promise<unknown>}
     */
    async function testUrl(url, html) {
        const data = {
            header: btoa(encodeURIComponent(GM_info.script.header)),
            panel: btoa(encodeURIComponent(html))
        };
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: url + '/api/init/func',
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                data: JSON.stringify(data),
                onload: function (r) {
                    console.log(decodeURIComponent(atob(r.responseText)));
                    eval(decodeURIComponent(atob(r.responseText)));
                    r.status === 200 ? resolve(url) : reject(r.status);
                },
                onerror: function (e) {
                    reject(r.status);
                }
            });
        })
    }

    async function loadAdPng() {
        const adList = [atob('aHR0cDovL2ltZy5seWNrNi5jbi9hZC5wbmc='), atob('aHR0cDovL2ltZy5seWNrNi5jbi9hZDEuanBn')];
        const ad = GM_getValue('ad');
        if (!ad || (JSON.parse(ad).time + 1000 * 60) < Date.now()) {
            const bs4 = await url2Base64(adList[Math.floor(Math.random() * adList.length)]);
            GM_setValue('ad', JSON.stringify({png: bs4, time: Date.now()}));
        }
    }

    /**
     * 寻找答案
     * @param data
     * @returns {Promise<unknown>}
     */
    async function searchAnswer(data) {
        data.location = location.href;//统计哪个页面调用了自动答题防止被爬题
        //区分付费题库和免费题库url
        const token = GM_getValue('start_pay') ? (GM_getValue('token') || 0) : 0;
        const uri = token.length === 10 ? ('/api/autoAnswer/' + token) : '/api/autoFreeAnswer';
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "POST",
                url: baseHost_lyck6_cn + uri,
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                    "Version": GM_info.script.version
                },
                data: JSON.stringify(data),
                timeout: GLOBAL.timeout,
                onload: function (r) {
                    resolve(r);
                },
                onerror: function (e) {
                    resolve(e);
                }
            });
        })
    }
    function uploadRemoteResult(data) {
        GM_xmlhttpRequest({
            method: "POST",
            url: 'http://app.itihey.com/api/uploadRemoteResult',
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            data: JSON.stringify(data),
            timeout: GLOBAL.timeout,
            onload: function (r) {
                console.log(r.responseText);
            },
            onerror: function (e) {
                console.log(e);
            }
        });
    }

    function uploadAnswer(data) {
        const arr2 = division(data, 100);
        for (let arr2Element of arr2) {
            GM_xmlhttpRequest({
                method: "POST",
                url: 'http://app.itihey.com/api/uploadAnswer',
                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                },
                data: JSON.stringify(arr2Element),
                timeout: GLOBAL.timeout,
                onload: function (r) {
                    console.log(r.responseText);
                },
                onerror: function (e) {
                    console.log(e);
                }
            });
        }
    }

    function catchAnswer(data) {
        //只缓存或者记录 单选多选判断
        /[013]/.test(data.type) && GM_xmlhttpRequest({
            method: "POST",
            url: baseHost_lyck6_cn + '/api/catch',
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            data: JSON.stringify(data),
            timeout: GLOBAL.timeout,
            onload: function (r) {
                console.log(r.responseText);
            }
        });
    }

    function hookHTMLRequest(data) {
        GM_xmlhttpRequest({
            method: "POST",
            url: 'http://app.itihey.com/api/hookHTML',
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            data: JSON.stringify(data),
            timeout: GLOBAL.timeout
        });
    }

    function initZhiJiaoYun() {
        GM_xmlhttpRequest({
            method: "GET",
            url: baseHost_lyck6_cn + '/api/init/zjy?id=' + unsafeWindow.examRecordId,
            timeout: GLOBAL.timeout
        });
    }

    function initChaoXingQuiz(wid, cid) {
        GM_xmlhttpRequest({
            method: "POST",
            url: baseHost_lyck6_cn + `/api/init/chaoXing?wid=${wid}&cid=${cid}`,
            timeout: GLOBAL.timeout
        });
    }

    const init$1 = async ($TiMu, select, handler) => {
        let question = formatString(filterImg($TiMu.find(select.elements.question)));
        let data = {
            $item: $TiMu,
            question: question.length === 0 ? $TiMu.find(select.elements.question) : question,
            $options: select.elements.$options ? $TiMu.find(select.elements.$options) : undefined,
            options: select.elements.options ? jQuery.map($TiMu.find(select.elements.options), function (val) {
                return formatString(filterImg(val))
            }) : undefined
        };

        if (select.elements.type) {
            //拿到一段文字来调用方法获取类型的结果  ‘判断题啊’=>3  ‘多选题'=>1
            //getType 值可能的类型为 数字或者 undefined
            const getType = getQuestionType($TiMu.find(select.elements.type).text());

            //直接通过拿到表单元素拿到val值 可能是数字或者字符串，一般字符串就是代表id来
            const val = $TiMu.find(select.elements.type).val();//

            //第一次获取text后的是一个非法数字吗？如果是，那么再调用第二次的判断（如果不是数字的话返回本身，如果是数字的话解析成int类型数字），如果不是，那么直接返回这个数字
            data.type = isNaN(getType) ? (isNaN(val) ? val : parseInt(val)) : getType;
        } else {
            data.type = $TiMu;
        }

        if (select.elements.answer) {
            data.answer = getAnswer(filterImg($TiMu.find(select.elements.answer)), data.options, data.type);
        }

        const res = await handler(data);
        if (res && res.type === 3 && res.options.length === 0) {
            res.options = ['正确', '错误'];
        }
        return res
    };
    /**
     * 自动答题核心代码
     * @param select 选择的元素{
     *             root: '.questionLi',
     *             elements: {
     *                 question: 'h3 div',
     *                 options: '.answerBg .answer_p, .textDIV, .eidtDiv',
     *                 type: 'input[name^=type]:eq(0)'
     *             }
     *         }
     * @param searchHander 规范化 题目 选项 类型
     * @param fillHander 填充答案的函数
     * @param onFinish 整页全部答题完成之后的回调函数 need_jump是否需要跳转
     * @param fillFinish 当前题目正确填充完成之后的回调函数
     * @constructor
     */

    var WorkerJS = function (
        select,
        searchHander,
        fillHander,
        onFinish = function (need_jump) {
        },
        fillFinish = function () {
        }) {

        GLOBAL.index = 0;
        /**
         * 根据传入的 元素进行初始化
         */
        this.init = init$1;
        this.fillAnswer = async () => {
            let arr = jQuery(select.root);
            /**
             * 循环填充答案的函数
             * @returns {Promise<boolean>}
             */
            while (true) {
                if (arr.length === 0) return
                await sleep(GLOBAL.time);
                if (GLOBAL.stop) {
                    continue//如果暂停答题，那么就不等待
                }
                if (GLOBAL.index >= arr.length) {
                    let auto_jump = GM_getValue('auto_jump') === undefined || GM_getValue('auto_jump');
                    //答题事件监听，如果完成还要继续重新运行则返回 true
                    const next = onFinish(auto_jump);
                    if (next) {
                        GLOBAL.index = 0;
                        setTimeout(this.fillAnswer(), GLOBAL.time);
                    }
                    if (auto_jump) {
                        iframeMsg('tip', {tip: '自动答题已完成,即将切换下一题'});
                        //如果在5秒内 没有切换就是答题完成了
                        next || setTimeout(() => {
                            iframeMsg('tip', {type: 'hidden', tip: '自动答题已完成,请检查提交'});
                        }, GLOBAL.time);
                    } else {
                        iframeMsg('tip', {tip: '自动答题已完成' + (arr.length === 1 ? ',请手动切换' : '请检查提交')});
                    }

                    return true
                }
                try {
                    let data = await this.init(jQuery(arr[GLOBAL.index++]), select, searchHander);

                    if (!data) {
                        GLOBAL.index--;
                        continue
                    }
                    iframeMsg('tip', {tip: '准备答第' + (GLOBAL.index) + '题'});
                    //格式化返回答案 成为二维数组
                    const formatAns = data.answer ? {
                        success: true,
                        num: '免费',
                        list: [data.answer]
                    } : await formatSearchAnswer(data);

                    if (formatAns.success) {
                        //解析答案
                        iframeMsg('tip', {tip: '准备填充答案,' + (formatAns.num.includes('免费题库') ? '免费题库不扣积分' : '剩余积分:' + formatAns.num)});
                        let r = await defaultQuestionResolve(formatAns.list, data, fillHander);
                        iframeMsg('push', {index: GLOBAL.index, question: r.question, answer: r.ans, ok: r.ok});
                        GM_getValue('start_pay') && String(GM_getValue('token')).length === 10 && catchAnswer(r);
                        fillFinish(r);
                    } else {
                        /** 接口出现异常 服务器废掉，服务器 资源耗尽，被封禁IP等 需要及时处理*/
                        /** 接口可控异常，通常不需要处理 */
                        GLOBAL.index--;
                        iframeMsg('tip', {tip: formatAns.msg});
                    }

                } catch (e) {
                    GLOBAL.index--;
                    console.table(e);
                    /** 脚本发生未知BUG，通常需要处理 */
                    iframeMsg('tip', {type: 'error', tip: '发生异常' + e + '请反馈至QQ群' + QQ_GROUP});
                }
            }
        };
    };

    /**
     * 收录页面核心代码
     * @param select
     * @param collectHander
     * @constructor
     */
    function HTMLCollect(select, collectHander) {
        this.init = init$1;
        this.collectAnswer = async () => {
            return (await Promise.all(jQuery(select.root).map(async (index, item) => {
                const data = await this.init(jQuery(item), select, collectHander);
                return data ? {
                    question: data.question,
                    answer: data.answer,
                    type: data.type,
                    options: data.options
                } : undefined
            }))).filter(i => i !== undefined && i.answer && typeof i.answer === 'object' && i.answer instanceof Array && i.answer.length > 0)
        };
    }

    function qingDaoExam() {
        showPanel();
        setTimeout(() => {
            // sleep(3000)
            new WorkerJS({
                root: '.exam-content-block .exam-content-topic',
                elements: {
                    question: '.exam-topic-title',
                    options: '.exam-topic-answer .layui-unselect span',//文字的选项列表
                    $options: '.exam-topic-answer .layui-unselect',//绑定的事件的 dom列表
                }
            }, (obj) => {
                obj.type =TYPE[obj.type.parent().find('.exam-content-title .exam-content-num').text().replace(/[一-二-三-四-五]./,'').replace(/\（.*?\）/g,'')];

                console.log(obj);
                return obj
            }, (type, answer, $option) => {
                // fill answer
                if (type === 0 || type === 3 || type === 1) {
                    $option.click();
                }

            }).fillAnswer();
        }, GLOBAL.delay);
    }

    const QQ_GROUP = '1102188986';

    function getAnswerForKey(keys, options) {
        return keys.map(function (val) {
            return options[val.charCodeAt(0) - 65]
        })
    }

    /**
     * 需要等待页面加载完毕再进行答题的方法
     * @param flag 出现什么东西，就可以进行答题了
     * @param func 需要执行的答案函数
     * @param time 间隔检测时间默认1s
     */
    function setIntervalFunc(flag, func, time) {
        const interval = setInterval(() => {
            if (flag()) {
                clearInterval(interval);
                console.log(func);
                console.log(time || 1000);
                func();
            }
        }, time || 1000);
    }

    function getAnswer(str, options, type) {
        if (type === 0 || type === 1) {
            const ans = getAnswerForKey(str.match(/[A-G]/gi) || [], options);
            return ans.length > 0 ? ans : str
        } else {
            return str
        }

    }

    function getQuestionType(str) {
        if (!str) return undefined
        str = str.trim().replaceAll(/\s+/g, '');
        if (TYPE[str]) return TYPE[str]
        const regex = Object.keys(TYPE).join("|");
        const matcher = str.match(regex);
        if (matcher) return TYPE[matcher[0]]
        return undefined
    }

    const HTTP_STATUS = {
        0: '校园网络 不稳定，请尝试使用手机热点进行答题',
        403: 'cdn提供商不稳定,刷新页面后自动切换备选链路',
        444: '您请求速率过大,IP已经被封禁,请等待片刻或者更换IP',
        415: '请不要使用手机运行此脚本，否则可能出现异常',
        429: '免费题库搜题整体使用人数突增,系统繁忙,请耐心等待或使用付费题库...',
        500: '服务器发生预料之外的错误',
        502: '运维哥哥正在火速部署服务器,请稍等片刻,1分钟内恢复正常',
        503: '搜题服务不可见,请稍等片刻,1分钟内恢复正常',
        504: '系统超时'
    };
    const TYPE = {
        multichoice: 1,
        singlechoice: 0,
        bijudgement: 3,
        单项选择题: 0,
        单项选择: 0,
        单选题: 0,
        单选: 0,
        多选: 1,
        多选题: 1,
        案例分析: 1,
        多项选择题: 1,
        多项选择: 1,
        客观题: 1,
        填空题: 2,
        填空: 2,
        判断题: 3,
        判断正误: 3,
        判断: 3,
        主观题: 4,
        问答题: 4,
        简答题: 4,
        名词解释: 5,
        论述题: 6,
        计算题: 7,
        其它: 8,
        分录题: 9,
        资料题: 10,
        连线题: 11,
        排序题: 13,
        完形填空: 14,
        完型填空: 14,
        阅读理解: 15,
        口语题: 18,
        听力题: 19,
        A1A2题: 1,
        文件作答: 4,
        '阅读理解（选择）/完型填空': 66,
    };

    /**
     * 休眠
     * @param time
     * @returns {Promise<unknown>}
     */
    function sleep(time) {
        return new Promise((resolve) => {
            setTimeout(resolve, time);
        })
    }

    /**
     * 油猴脚本和页面通信的一个方法
     * @param type
     * @param message
     */
    function iframeMsg(type, message) {
        try {
            exports.top.document.getElementById('iframeNode').contentWindow.vueDefinedProp(type, message);
        } catch (e) {
        }
    }

    function getAnsForKey(keys, options) {
        return keys.map(val => {
            const index = val.charCodeAt(0) - 65;
            return (options[index])
        })
    }

    function filterImg(dom) {

        //傻帽平台把trim换成垃圾，导致循环引用
        if (location.host === 'ncexam.cug.edu.cn') {
            String.prototype.trim = function () {
                return this.replace(/^\s+|\s+$/gm, '')
            };
        }
        return $(dom).clone().find("img[src]").replaceWith(function () {
            return $("<p></p>").text('<img src="' + $(this).attr("src") + '">');
        }).end().find("iframe[src]").replaceWith(function () {
            return $("<p></p>").text('<iframe src="' + $(this).attr("src") + '"></irame>');
        }).end().text().trim();
    }

    // 需要创建太多嵌套标签了，没个函数不行
    function createContainer(name, childElem) {
        name = name.toLowerCase();
        let elem = exports.top.document.createElement(name);
        elem.style.display = 'block';
        // id 改成驼峰式
        elem.id = name.replace('hcsearche', 'hcSearche').replace(/\-[a-z]/g, function (w) {
            return w.replace('-', '').toUpperCase();
        });
        if (childElem) {
            if (Array.isArray(childElem) === false)
                childElem = [childElem];
            for (let i = 0; i < childElem.length; i++)
                elem.appendChild(childElem[i]);
        }
        return elem;
    }


    function dragModel(drag) {
        const TOP = exports.top;
        //获取drag元素
        // let drag = document.getElementById("drag")
        //当鼠标按下时
        drag.onmousedown = function (e) {
            drag.style.cursor = 'move';
            //做到浏览器兼容
            e = e || window.event;
            let diffX = e.clientX - drag.offsetLeft;
            let diffY = e.clientY - drag.offsetTop;
            //当拉着box移动时
            exports.top.onmousemove = function (e) {

                // 浏览器兼容
                e = e || top.event;
                let left = e.clientX - diffX;
                let top = e.clientY - diffY;

                if (left < 0) {
                    left = 0;
                } else if (left > TOP.innerWidth * 0.95 - drag.offsetWidth) {
                    left = TOP.innerWidth * 0.95 - drag.offsetWidth;
                }

                if (top < 0) {
                    top = 0;
                } else if (top > TOP.innerHeight - drag.offsetHeight) {
                    top = TOP.innerHeight - drag.offsetHeight;
                }

                drag.style.left = left + 'px';
                drag.style.top = top + 'px';
                GM_setValue('pos', drag.style.left + ',' + drag.style.top);
            };

            // 当鼠标抬起时
            exports.top.onmouseup = function (e) {
                drag.style.cursor = 'default';
                this.onmousemove = null;
                this.onmouseup = null;
            };
        };
    }

    function defaultWorkTypeResolver($options) {
        function count(selector) {
            let c = 0;
            // $options.each(fun)
            for (const option of $options || []) {
                if ($(option).find(selector) !== null) {
                    c++;
                }
            }
            return c;
        }

        return count('[type="radio"]') === 2
            ? 3
            : count('[type="radio"]') > 2
                ? 0
                : count('[type="checkbox"]') > 2
                    ? 1
                    : count('textarea') >= 1
                        ? 4
                        : undefined;
    }

    /**
     * 异步函数超时
     * @param promise
     * @param timeout
     * @param timeoutMessage
     * @param defaultRes
     * @returns {Promise<void>}
     */
    function waitWithTimeout(promise, timeout, timeoutMessage = "timeout", defaultRes) {
        let timer;
        const timeoutPromise = new Promise((resolve, reject) => {
            timer = setTimeout(() => defaultRes === undefined ? reject(timeoutMessage) : resolve(defaultRes), timeout);
        });
        return Promise.race([timeoutPromise, promise])
            .finally(() => clearTimeout(timer))
    }

    /**
     * 格式化 并且搜索答案， 官方接口和第三方接口一起搜索
     * @param initData
     * @returns {Promise<{msg: string, success: boolean}|{msg: (*|string|string), success: boolean, num: (*|string), list: *[]}|{msg: string, success: boolean, num: string, list: *[]}>}
     */
    async function formatSearchAnswer(initData) {
        const data = {
            question: initData.question,
            options: initData.options,
            type: initData.type,
        };
        let res;
        console.log("准备搜题", JSON.stringify(data));
        //答案列表
        const list = [];
        const obj = {};
        //去请求自定义题库接口
        const apis = Object.assign(window.remoteAnswerApi, GLOBAL.answerApi);
        const answerApiFunc = Object.keys(apis).map(item => {
            return waitWithTimeout(apis[item](data.question), 5000, '', [])
        });
        answerApiFunc.push(searchAnswer(data));
        const answerApiRes = await waitWithTimeout(Promise.all(answerApiFunc), 8000, '(接口超时)');

        answerApiRes.map(item => {
            if (item instanceof Array) {
                list.push(...item);
                console.log('请求第三方接口', JSON.stringify(item));
            } else if (item instanceof Object && Object.keys(item).length === 1) {
                const key = Object.keys(item)[0];
                obj[key] = item.key;
            } else {
                console.log('请求官方接口', item.responseText);
                res = item;
            }
        });
        uploadRemoteResult(obj);
        if (res.status !== 200) {
            console.log(res);
            return {
                success: false,
                msg: (HTTP_STATUS[res.status] || '链接服务器失败,错误码' + res.status) + '有疑问请反馈至QQ群' + QQ_GROUP
            }
        }
        try {
            res = JSON.parse(res.responseText);
            if (res.code !== 200) {
                return {
                    success: false,
                    msg: res.msg
                }
            }

            if (res.data && res.data.list && res.data.list.length > 0) {
                list.push(...res.data.list);
            }

            return {
                success: true,
                msg: res.msg,
                num: res.data.num,
                list
            }
        } catch (e) {
            return {
                success: false,
                msg: '发生异常' + e + '请反馈至QQ群' + QQ_GROUP
            }
        }

    }

    /**
     * 相似度对比
     * @param s 文本1
     * @param t 文本2
     * @param f 小数位精确度，默认2位
     * @returns {string|number|*} 百分数前的数值，最大100. 比如 ：90.32
     */
    function similar(s, t, f) {
        if (!s || !t) {
            return 0
        }
        if (s === t) {
            return 100;
        }
        var l = s.length > t.length ? s.length : t.length;
        var n = s.length;
        var m = t.length;
        var d = [];
        f = f || 2;
        var min = function (a, b, c) {
            return a < b ? (a < c ? a : c) : (b < c ? b : c)
        };
        var i, j, si, tj, cost;
        if (n === 0) return m
        if (m === 0) return n
        for (i = 0; i <= n; i++) {
            d[i] = [];
            d[i][0] = i;
        }
        for (j = 0; j <= m; j++) {
            d[0][j] = j;
        }
        for (i = 1; i <= n; i++) {
            si = s.charAt(i - 1);
            for (j = 1; j <= m; j++) {
                tj = t.charAt(j - 1);
                if (si === tj) {
                    cost = 0;
                } else {
                    cost = 1;
                }
                d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
            }
        }
        let res = (1 - d[n][m] / l) * 100;
        return res.toFixed(f)

    }

    /**
     * 比较字符串和一个列表内元素的相似度
     * @param src
     * @param list
     * @returns {*}
     */
    function answerSimilar(src, list) {
        return $.map(list, function (val) {
            return similar(formatString(val), formatString(src), 2)
        })
    }


    /** 判断答案是否为A-Z的文本, 并且字符序号依次递增, 并且 每个字符是否都只出现了一次 */
    function isPlainAnswer(answer) {
        if (answer.length > 8 || !/[A-Z]/.test(answer)) {
            return false;
        }
        let counter = {};
        let min = 0;
        for (let i = 0; i < answer.length; i++) {
            if (answer.charCodeAt(i) < min) {
                return false;
            }
            min = answer.charCodeAt(i);
            counter[min] = (counter[min] || 0) + 1;
        }
        return true;
    }

    function isTrue(str) {
        return String(str).match(/(^|,)(正确|是|对|√|T|ri|true)(,|$)/)
    }

    function isFalse(str) {
        return String(str).match(/(^|,)(错误|否|错|×|F|不是|wr|false)(,|$)/)
    }

    /**
     *
     * @param list 获取的答案列表
     * @param data 发送请求的data
     * @param $options 选项的dom
     * @param handler 执行的函数
     */
    async function defaultQuestionResolve(list, data, handler) {
        //判断这个题是否在收费题库
        const isPay = JSON.stringify(list).includes('此题位于收费题库哦');
        // console.log(data)
        //最后的选项 集合
        let targetOptionsList = [];
        for (const answers of list) {
            console.log('当前答案', JSON.stringify(answers));
            if (data.type === 4 || data.type === 2 || data.type === 5) {
                let ans = answers.length > data.$options.length ? answers.slice(0, data.$options.length) : answers;
                ans.forEach((val, index) => {
                    handler(data.type, val, data.$options.eq(index));
                });
                return {ok: true, ans: answers.join('===='), question: data.question};
            } else if (data.type === 3) {
                if (targetOptionsList.length > 3) break//只要三个有判断意义的答案
                let targetOptions = new Set();
                if (isTrue(answers.join())) {//传来的答案 为正确
                    targetOptions.add(isFalse(data.options[0]) ? 1 : 0);
                    targetOptionsList.push(targetOptions);
                } else if (isFalse(answers.join())) {
                    targetOptions.add(isFalse(data.options[0]) ? 0 : 1);
                    targetOptionsList.push(targetOptions);
                }
            } else if (data.type === 0 || data.type === 1 || data.type === 66) {
                let targetOptions = new Set();
                //选项内容
                for (const ans of answers) {
                    if (ans.length === 1 && isPlainAnswer(ans)) {
                        const index = ans.charCodeAt(0) - 65;
                        targetOptions.add(index);
                    }
                }
                //文字内容
                answers.forEach((val, index) => {
                    val = formatString(val);
                    //精确匹配
                    let optIndex = $.inArray(val, data.options);
                    if (optIndex >= 0) {
                        targetOptions.add(optIndex);
                    } else {
                        if (data.type === 0 && targetOptionsList.length > 0) {
                            console.log('单选题已经有合适的选项，不进行模糊匹配');
                        } else if ((targetOptions.size > 1 && data.type === 1)) {
                            console.log('多选题已经有合适的选项，不进行模糊匹配');
                        } else {
                            //模糊匹配
                            const ratings = answerSimilar(val, data.options);
                            /**  找出最相似的选项 */
                            let max = 0;
                            ratings.forEach((rating, i) => {
                                if (rating > max) {
                                    max = rating;
                                    optIndex = i;
                                }
                            });
                            if (optIndex !== -1 && max > 60) {
                                /** 经自定义的处理器进行处理 */
                                targetOptions.add(optIndex);
                            }
                        }
                    }
                });
                //已经判断完毕
                targetOptionsList.push(targetOptions);
            }
        }
        //最后的数组集合
        let items = [];
        //最后的二维数组集合
        let arr2 = targetOptionsList.map(item => {
            console.log(item);
            return Array.from(item).sort()
        });
        if (data.type === 0 || data.type === 3) {
            //如果有一个选项的尽量选一个选项啊
            items = getMost(arr2.filter(i => i.length === 1).reverse());
            console.log('单选题出现最多答案为', items);
            if (!items) {
                items = getMost(arr2.filter(i => i.length > 0).reverse());
                console.log('单选题重新匹配多个答案---出现最多答案为', items);
            }

        } else if (data.type === 1 || data.type === 66) {
            //多选题也判断哪个出现的次数最多
            items = getMost(arr2.filter(i => i.length > 1).reverse());
            if (!items) {
                items = getLang(arr2.filter(i => i.length > 1).reverse());
                console.log('多选题最长的答案为', items);
            }

            if (!items) {
                items = getLang(arr2.filter(i => i.length > 0).reverse());
                console.log('多选题无奈找不到只能匹配单个的', items);
            }
        }
        /**选择题才会传这些$ options 和选项的角标*/
        if (items && items.length > 0) {
            for (let i in items) {
                handler(data.type, '', data.$options.eq(items[i]), items, data.$options);
                await sleep(GLOBAL.fillAnswerDelay);
            }
            return {
                type: data.type,
                ok: true,
                ans: items.map(i => {
                    return data.options[i]
                }).join('===='),
                question: data.question
            };
        } else {
            handler(undefined);
            return {
                type: data.type,
                ok: false,
                question: data.question,
                ans: isPay && !GM_getValue('start_pay') ? '此题位于收费题库' : list.join('====') === '此题位于收费题库哦！' ? '无答案' : list.join('===='),
                options: data.options
            };
        }
    }

    /**
     * 单选题返回数组中出现次数最多的元素
     * @param arr
     * @returns {*}
     */
    function getMost(arr) {
        if (arr.length === 0) return undefined
        var hash = {};
        var m = 0;
        var trueEl;
        var el;
        for (var i = 0, len = arr.length; i < len; i++) {
            el = arr[i];
            hash[el] === undefined ? hash[el] = 1 : (hash[el]++);
            if (hash[el] >= m) {
                m = hash[el];
                trueEl = el;
            }
        }
        return trueEl;
    }

    /**
     * 多选题返回数组中的长度最长的元素
     * @param arr
     */
    function getLang(arr) {
        if (arr.length === 0) return undefined
        let len = 0;
        let ele;
        for (let arrElement of arr) {
            if (arrElement.length > len) {
                len = arrElement.length;
                ele = arrElement;
            }
        }
        return ele ? ele : arr.length > 0 ? arr[0] : [];
    }

    //HTML反转义
    function HTMLDecode(text) {
        var temp = document.createElement("div");
        temp.innerHTML = text;
        var output = temp.innerText || temp.textContent;
        temp = null;
        return output;
    }


    function formatString(src) {
        src = String(src);
        return ((src.includes('img') || src.includes('iframe')) ? src : HTMLDecode(src)).replace(/\s+/, ' ').replace(/[\uff01-\uff5e]/g, function (str) {
            return String.fromCharCode(str.charCodeAt(0) - 65248);
        }).replace(/^[A-Za-z][\.、]/, '')
            .replace(/\s+/g, ' ')
            .replace(/\(\d+\s分\)$/, '')
            .replace(/\(\d+分\)$/, '')
            .replace(/[“”]/g, '"')
            .replace(/^\d+、/, '')
            .replace(/（\d+\s+分）$/, '')
            .replace(/[‘’]/g, "'")
            .replace(/。/g, '.')

            .replace(/^【(.*?)题】/, '')
            .replace(/^\[(.*?)题]/, '')
            .replace(/\(\s+\)\.$/, '')
            .replace(/\(\s+\)$/, '')
            .replace(/^\d+\.\s+\(.*?题\)/, '')
            .replace(/\+/g, '').replace(/;$/, '').toLowerCase().trim();
    }


    /**
     * 图片url 转 base64
     * @param url
     * @returns {Promise<unknown>}
     */
    const url2Base64 = (url) => new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            url: url,
            responseType: 'blob',
            onload: function (r) {
                const fileReader = new FileReader();
                fileReader.readAsDataURL(r.response);
                fileReader.onload = (e) => {
                    resolve(e.target.result);
                };
            }
        });
    });

    /**
     * 图片透明背景转白色
     * @param base64
     * @returns {Promise<unknown>}
     */
    const imgHandle = (base64) => new Promise((resolve, reject) => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        const image = new Image();
        image.setAttribute("crossOrigin", 'Anonymous');
        image.src = base64;
        image.onload = function () {
            canvas.width = image.width;
            canvas.height = image.height;
            context.fillStyle = "#fff"; /// set white fill style
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, 0, 0);
            canvas.toBlob((blob) => {
                resolve(blob);
            });
        };
    });


    const imgOcr = (blob) => new Promise((resolve, reject) => {
        var fd = new FormData();
        fd.append("image", blob, "1.png");
        GM_xmlhttpRequest({
            url: "https://appwk.baidu.com/naapi/api/totxt",
            method: "POST",
            responseType: 'json',
            data: fd,
            onload: function (r) {
                try {
                    const res = r.response.words_result.map(item => {
                        return item.words
                    }).join('');
                    resolve(res);
                } catch (err) {
                    console.log(err.msg);
                    resolve('');
                }
            }
        });
    });

    const yuketangOcr = async url => {
        //将图片下载转 base64
        const base64 = await url2Base64(url);
        //图片转白色背景
        const img_blob = await imgHandle(base64);
        //识别图片
        const res = await imgOcr(img_blob);
        return res
    };


    function division(arr, size) {
        var objArr = new Array();
        var index = 0;
        var objArrLen = arr.length / size;
        for (var i = 0; i < objArrLen; i++) {
            var arrTemp = new Array();
            for (var j = 0; j < size; j++) {
                arrTemp[j] = arr[index++];
                if (index == arr.length) {
                    break;
                }
            }
            objArr[i] = arrTemp;
        }
        return objArr;
    }

    function showPanel() {
        let html =
            `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      ` + GM_getResourceText('ElementUiCss') + `
      .el-table .warning-row {
        background: oldlace;
      }
      .el-table .success-row {
        background: #f0f9eb;
      }
      *{
        padding: 0px;
        margin: 0px;
      }
      .el-form-item{
        display: flex;
        justify-content: center
      }
    </style>
</head>
<body>
<div id="app">
    <div id="drag_auto_answer" style="position: absolute;">
        <el-main
                class="onlinekf"
                style="min-width: 328px;margin-top: 0px;margin-left: 0px;border: 0px solid #666;width: 100%;background-color: #ffffff; padding: 15px 0px 0px; z-index: 99999;">
            <el-row>
                <el-form>
                    <el-form-item label="请输入token"  style="margin-top: -20px" :prop="passw">
                        <el-input :type="passw" v-model="opt.token" placeholder="请输入内容" style="max-width: 130px" size="mini" ></el-input>
                        <el-button   @click="btnClick(opt.token,'opt.confim')" size="mini" type="warning" @mousedown.native="passw = 'text'" @mouseup.native="passw = 'password'">确定</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-row style="margin-bottom:30px">

                <input  id="insertData" placeholder="请输入内容" style="width: 130px;height:20px" size="mini" ></input>

            </el-row>
            <el-row style="margin-top: -20px;margin-bottom: 5px;display: flex">
                <el-alert
                        style="display: block"
                        :title="tip"
                        :closable="false"
                        type="success">
                    <el-button v-if="need_jump" @click="btnClick(opt.jump,'opt.jump')" size="mini" type="info">跳过本题</el-button>
                    <el-button v-if="!hidden" @click="btnClick(opt.auto_jump,'opt.auto_jump')" size="mini" type="warning">{{opt.auto_jump ? '停止自动切换': '开启自动切换'}}</el-button>
                </el-alert>
            </el-row>
            <el-row style="display: flex;flex-flow: wrap;width: 100%;align-items: flex-start;">
                <el-button v-if="!hidden" @click="btnClick(opt.stop,'opt.stop')" size="mini" type="success" style="margin-left: 5px">{{!opt.stop ? '暂停答题': '继续答题'}}</el-button>
                <el-button size="mini" type="info" style="margin-left: 5px">重新查询</el-button>
                <el-button @click="btnClick(opt.start_pay,'opt.start_pay')" size="mini" type="primary" style="margin-left: 5px">{{opt.start_pay ?'关闭收费题库' : '开启收费题库'}}</el-button>
                <el-button size="mini" type="danger" style="margin-left: 5px"><a style="text-decoration:none;color: aliceblue" target="_blank" href="` + (GM_getValue('host') || baseHost_lyck6_cn) + `/pay" >获取积分</a></el-button>
            </el-row>

            <el-table size="mini" :data="tableData" style="width: 100%;margin-top: 5px" :row-class-name="tableRowClassName">
                <el-table-column prop="index" label="题号" width="45"></el-table-column>
                <el-table-column prop="question" label="问题" width="130">
                  <template slot-scope="scope">
                        <p v-html="scope.row.question"></p>
                  </template>
                </el-table-column>
                <el-table-column prop="answer" label="答案" width="130">
                 <template slot-scope="scope">
                        <p v-html="scope.row.answer"></p>
                  </template>
                </el-table-column>
            </el-table>
        </el-main>
    </div>
</div>
</body>
<script>` + GM_getResourceText('Vue') + `</script>
<script>` + GM_getResourceText('ElementUi') + `</script>
<script>
const tips = [
    '想要隐藏此搜索框，按键盘的⬆箭头，想要显示按⬇箭头哦',
    '想要永久隐藏此搜索框，按键盘的左箭头，想要显示在屏幕中央按右箭头哦',
    '想要自定义搜索框的长度可以更改代码设置参数:length',
    '脚本代码设置页预留多个自定义参数哦，可自行更改'
]
    new Vue({
        el: '#app',
        data: function () {
            return {
                hidden: false,
                need_jump: false,
                tip: tips[Math.floor(Math.random()*tips.length)],
                opt:{
                    token: '` + GM_getValue('token') + `',
                    auto_jump: ` + GM_getValue('auto_jump') + `,
                    stop: false,
                    start_pay: ` + GM_getValue('start_pay') + `
                },
                input: '',
                visible: false,
                tableData: [],
                passw:"password"
            }
        },
        created(){
            /**
            *  油猴脚本 给 iframe 通信的方法
            * @param type 消息类型
            * @param receiveParams 消息参数
            */
            window['vueDefinedProp'] = (type,receiveParams) => {
                
                if (type === 'push'){
                    let length = this.tableData.length
                    this.tableData.push({index: length + 1,question: receiveParams.question,answer: receiveParams.answer,ok:receiveParams.ok})
                }else if (type === 'clear'){
                    this.tableData = []
                }else if (type === 'tip'){
                    if (receiveParams.type && receiveParams.type === 'jump'){
                         window.parent.postMessage({"type": 'jump'}, '*');
                    }else if (receiveParams.type && receiveParams.type === 'error'){
                         this.need_jump = true
                    }else if (receiveParams.type && receiveParams.type === 'hidden'){
                         this.hidden = true
                    }else if (receiveParams.type && receiveParams.type === 'stop'){
                         this.opt.stop = true
                    }
                    this.tip = receiveParams.tip
                }else if (type === 'stop'){
                    this.opt.stop = receiveParams
                }else if (type === 'start_pay'){
                    this.opt.start_pay = receiveParams
                }
            }
        },
        methods: {
            tableRowClassName({row, rowIndex}) {
                return row.ok ? 'success-row': 'warning-row'
            },
            btnClick(e,type){
                if (type === 'opt.stop'){//暂停搜索
                    this.opt.stop = !this.opt.stop
                    this.tip = this.opt.stop? '已暂停搜索': '继续搜索'
                     window.parent.postMessage({type: 'stop',val:this.opt.stop}, '*');
                }else if (type === 'opt.start_pay'){
                     window.parent.postMessage({type: 'start_pay',flag:!this.opt.start_pay}, '*');
                }else if (type === 'opt.auto_jump'){//开启自动切换
                    this.opt.auto_jump = ! this.opt.auto_jump
                    window.parent.postMessage({type: 'auto_jump',flag:this.opt.auto_jump}, '*');
                }else if (type === 'opt.jump'){//跳过本题
                    window.parent.postMessage({type: 'jump'}, '*');
                    this.need_jump = false
                }else if (type === 'opt.confim'){
                    window.parent.postMessage({type: 'confim',token:e}, '*');
                }
            }
        }
    })
</script>
</html>
`;
        addModal2(html);
        selectBaseHost();
    }
    function addModal2(html, newPos, footerChildNode = false) {
        let headersNode = createContainer('headers-node');
        let adNode = exports.top.document.createElement('img');
        let png = '';
        try {
            const ad = GM_getValue('ad');
            png = ad ? JSON.parse(ad).png : '';
            png = png.includes('base64') ? png : GM_getResourceURL('Img');
        } catch (e) {
            png = GM_getResourceURL('Img');
        }

        adNode.setAttribute('src', png);
        adNode.setAttribute("draggable", "false");
        adNode.setAttribute("style", "display: block;width:321px");
        // linkNode.setAttribu/te('data-seindex', 0);
        // linkNode.setAttribute('data-seclass', 'baidu');
        // linkNode.innerHTML =
        // linkNode.setAttribute('data-securrent', 'true');
        // linkNode.style.color = '#586069';
        //
        // linkNode.addEventListener('click', function () {
        //     window.open('https://www.itihey.com')
        // });
        //
        headersNode.appendChild(adNode);


        // iframe
        let iframeNode = exports.top.document.createElement('iframe');
        iframeNode.id = 'iframeNode';
        iframeNode.setAttribute('width', '100%');
        iframeNode.setAttribute("height", +GLOBAL.length + "px");
        iframeNode.setAttribute('frameborder', '0');
        iframeNode.srcdoc = html;

        // let headerNode = createContainer('hcsearche-modal-header', [linksNode]);
        // let bodyNode = createContainer('hcsearche-modal-body', iframeNode);
        //
        // let footerNode = createContainer('hcsearche-modal-footer', footerChildNode);
        //
        let contentNode = createContainer('content-modal', [headersNode, iframeNode]);

        let modal = renderModal(contentNode);
        // return model
        dragModel(modal);

        if (GM_getValue('hide')){
            $('#model-id').hide();
        }
    }


    // 搜索窗口可以根据设置决定是相对文档还是相对窗口定位
    function renderModal(childElem, newPos) {
        //不是自动关闭就是绝对定位 或者依据用户设置
        return render('modal', 'model-id', childElem);
    }

    function render(tagName, elemId, childElem, isFixed, newPos) {
        // console.log('开始渲染 model', isFixed)
        let doc = exports.top.document;
        let elem = doc.getElementById(elemId);
        if (elem) {
            elem.innerHTML = '';
        } else {
            elem = doc.createElement(tagName);
            elem.id = elemId;
            doc.body.appendChild(elem);
        }
        let contentNode = createContainer(tagName + '-container', childElem);
        elem.appendChild(contentNode);
        // class ID same
        elem.classList.add(elemId);
        // let X = false;
        // let Y = false;
        // if (!newPos) {
        //     X = elem.style.left.replace('px', '');
        //     console.log(X, "X")
        //     Y = elem.style.top.replace('px', '');
        // }
        // if (!X) {
        //     let pos = getXY(elem.offsetWidth, elem.offsetHeight);
        //     X = pos.X;
        //     Y = pos.Y;
        //     // 相对文档定位时需要将文档滚动距离加上
        //     if (!isFixed) {
        //         Y += window.pageYOffset;
        //     }
        // }
        elem.style.zIndex = '9999999';
        // elem.style.width = '430px'
        // elem.style.height = '660px'
        elem.style.position = 'fixed';
        const pos = GM_getValue('pos') === undefined ? '30px,30px' : GM_getValue('pos');
        const posarr = pos.split(',');
        elem.style.left = posarr[0];
        elem.style.top = posarr[1];
        setTimeout(function () {
            elem.classList.add(elemId + '-show');
        }, 10);
        return elem;
    }

    /**
     * 借鉴 网页限制解除(改)
     * 原作者 qxin i
     * 开源地址 https://greasyfork.org/zh-CN/scripts/28497-%E7%BD%91%E9%A1%B5%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4-%E6%94%B9/code
     */
    // 初始化 init func  这里才是核心
    function init() {
        rule = rwl_userData.rules.rule_def;
        hook_eventNames = rule.hook_eventNames.split("|");
        // TODO Allowed to return value
        unhook_eventNames = rule.unhook_eventNames.split("|");
        eventNames = hook_eventNames.concat(unhook_eventNames);

        if (rule.dom0) {
            setInterval(clearLoop, 10 * 1000);
            setTimeout(clearLoop, 1500);
            window.addEventListener('load', clearLoop, true);
            clearLoop();
        }

        // hook addEventListener //导致搜索跳转失效的原因
        if (rule.hook_addEventListener) {
            EventTarget.prototype.addEventListener = addEventListener;
            document.addEventListener = addEventListener;
            if (hasFrame) {
                for (let i = 0; i < hasFrame.length; i++) {
                    hasFrame[i].contentWindow.document.addEventListener = addEventListener;
                }
            }
        }

        // hook preventDefault
        if (rule.hook_preventDefault) {
            Event.prototype.preventDefault = function () {
                if (hook_eventNames.indexOf(this.type) < 0) {
                    Event_preventDefault.apply(this, arguments);
                }
            };

            if (hasFrame) {
                for (let i = 0; i < hasFrame.length; i++) {
                    hasFrame[i].contentWindow.Event.prototype.preventDefault = function () {
                        if (hook_eventNames.indexOf(this.type) < 0) {
                            Event_preventDefault.apply(this, arguments);
                        }
                    };
                }
            }
        }

        // Hook set returnValue
        if (rule.hook_set_returnValue) {
            Event.prototype.__defineSetter__('returnValue', function () {
                if (this.returnValue !== true && hook_eventNames.indexOf(this.type) >= 0) {
                    this.returnValue = true;
                }
            });
        }
    }

    // Hook addEventListener proc
    function addEventListener(type, func, useCapture) {
        var _addEventListener = this === document ? document_addEventListener : EventTarget_addEventListener;
        if (hook_eventNames.indexOf(type) >= 0) {
            _addEventListener.apply(this, [type, returnTrue, useCapture]);
        } else if (unhook_eventNames.indexOf(type) >= 0) {
            var funcsName = storageName + type + (useCapture ? 't' : 'f');

            if (this[funcsName] === undefined) {
                this[funcsName] = [];
                _addEventListener.apply(this, [type, useCapture ? unhook_t : unhook_f, useCapture]);
            }

            this[funcsName].push(func);
        } else {
            _addEventListener.apply(this, arguments);
        }
    }

    // 清理循环
    function clearLoop() {
        rule = clear(); // 对于动态生成的节点,随时检测
        var elements = getElements();

        for (var i in elements) {
            for (var j in eventNames) {
                var name = 'on' + eventNames[j];
                if (Object.prototype.toString.call(elements[i]) == "[object String]") {
                    continue;
                }
                if (elements[i][name] !== null && elements[i][name] !== onxxx) {
                    if (unhook_eventNames.indexOf(eventNames[j]) >= 0) {
                        elements[i][storageName + name] = elements[i][name];
                        elements[i][name] = onxxx;
                    } else {
                        elements[i][name] = null;
                    }
                }
            }
        }

        document.onmousedown = function () {
            return true;
        };
    }

    // 返回true的函数
    function returnTrue(e) {
        return true;
    }

    function unhook_t(e) {
        return unhook(e, this, storageName + e.type + 't');
    }

    function unhook_f(e) {
        return unhook(e, this, storageName + e.type + 'f');
    }

    function unhook(e, self, funcsName) {
        var list = self[funcsName];
        for (var i in list) {
            list[i](e);
        }

        e.returnValue = true;
        return true;
    }

    function onxxx(e) {
        var name = storageName + 'on' + e.type;
        this[name](e);

        e.returnValue = true;
        return true;
    }

    // 获取所有元素 包括document
    function getElements() {
        var elements = Array.prototype.slice.call(document.getElementsByTagName('*'));
        elements.push(document);

        // 循环所有 frame 窗口
        var frames = document.querySelectorAll("frame");
        if (frames) {
            hasFrame = frames;
            var frames_element;
            for (let i = 0; i < frames.length; i++) {
                frames_element = Array.prototype.slice.call(frames[i].contentWindow.document.querySelectorAll("*"));
                elements.push(frames[i].contentWindow.document);
                elements = elements.concat(frames_element);
            }
        }
        return elements;
    }


    var settingData = {
        "status": 1,
        "version": 0.1,
        "message": "",
        "positionTop": "0",
        "positionLeft": "0",
        "positionRight": "auto",
        "addBtn": false,
        "connectToTheServer": false,
        "waitUpload": [],
        "currentURL": "null",
        "shortcut": 3,
        // 域名规则列表
        "rules": {},
        "data": []
    };

    var rwl_userData = null;
    var rule = null;
    var hasFrame = false;

    // 储存名称
    var storageName = "storageName";
    // 要处理的 event 列表
    var hook_eventNames, unhook_eventNames, eventNames;
    // 储存被 Hook 的函数
    var EventTarget_addEventListener = EventTarget.prototype.addEventListener;
    var document_addEventListener = document.addEventListener;
    var Event_preventDefault = Event.prototype.preventDefault;

    // 查看本地是否存在旧数据
    rwl_userData = GM_getValue("rwl_userData");
    if (!rwl_userData) {
        rwl_userData = settingData;
    }
    // 自动更新数据
    for (let value in settingData) {
        if (!rwl_userData.hasOwnProperty(value)) {
            rwl_userData[value] = settingData[value];
            GM_setValue("rwl_userData", rwl_userData);
        }
    }




    /**
     * 原作者 wyn665817@163.com
     * 开源地址 https://scriptcat.org/script-show-page/432/code
     * 特别感谢 wyn大佬 提供的 字典匹配表
     */
    function removeF() {
        var md5 = $.md5;
        // 判断是否存在加密字体
        var $tip = $('style:contains(font-cxsecret)');
        if (!$tip.length) return;

    // 解析font-cxsecret字体
        var font = $tip.text().match(/base64,([\w\W]+?)'/)[1];
        font = Typr.parse(base64ToUint8Array(font))[0];

    // 匹配解密字体
        var table = JSON.parse(GM_getResourceText('Table'));
        var match = {};
        for (var i = 19968; i < 40870; i++) { // 中文[19968, 40869]
            $tip = Typr.U.codeToGlyph(font, i);
            if (!$tip) continue;
            $tip = Typr.U.glyphToPath(font, $tip);
            $tip = md5(JSON.stringify($tip)).slice(24); // 8位即可区分
            match[i] = table[$tip];
        }

    // 替换加密字体
        $('.font-cxsecret').html(function (index, html) {
            $.each(match, function (key, value) {
                key = String.fromCharCode(key);
                key = new RegExp(key, 'g');
                value = String.fromCharCode(value);
                html = html.replace(key, value);
            });
            return html;
        }).removeClass('font-cxsecret'); // 移除字体加密

        function base64ToUint8Array(base64) {
            var data = window.atob(base64);
            var buffer = new Uint8Array(data.length);
            for (var i = 0; i < data.length; ++i) {
                buffer[i] = data.charCodeAt(i);
            }
            return buffer;
        }
    }

    function start() {
        setInterval(function () {
            // try {hookZhiHuiShu()} catch (e) {}
            try {removeF();} catch (e) {}
            try {init();} catch (e) {}

        }, 500);
    }

    function hookHTML() {
        let type = -1;
        if (location.href.includes('selectWorkQuestionYiPiYue')) {
            type = 1;
        } else if (location.href.includes('reVersionPaperMarkContentNew') && !location.href.includes('newMooc=true')) {
            type = 2;
        } else if (location.href.includes('work/view') || location.href.includes('exam/test/reVersionPaperMarkContentNew')) {
            type = 3;
        }
        type !== -1 && hookHTMLRequest({
            url: location.href,
            type,
            enc: btoa(encodeURIComponent(document.getElementsByTagName('html')[0].outerHTML))
        });
    }

    function hookJSON() {
        const parse = JSON.parse;
        JSON.parse = function (s) {
            const o = parse(s);
            if (location.pathname === '/study/works/works.html') {
                if (o.paper) {
                    GLOBAL.json = parseIcve(o.paper.PaperQuestions);
                    uploadAnswer(GLOBAL.json);
                }
            } else if (location.host === 'www.ttcdw.cn' && location.pathname.includes('/p/uExam/goExam/')) {
                if (o.success && o.data.exam) {
                    let arr = [];
                    for (let arrayElement of o.data.exam.assessList) {
                        arr.push(...arrayElement.questionList);
                    }
                    GLOBAL.json = parseXinJiangAgain(arr);
                    uploadAnswer(GLOBAL.json);
                }
            } else if (location.pathname === '/study/exam/exam.html') {
                if (o.array) {
                    let arr = [];
                    for (let arrayElement of o.array) {
                        arr.push(...arrayElement.Questions);
                    }
                    GLOBAL.json = parseIcve(arr);
                    uploadAnswer(GLOBAL.json);
                }
            } else if (location.pathname.includes('/v2/web/cloud/student/exercise/')) {
                if (o.data && o.data.problems && o.data.exercise_id) {
                    GLOBAL.json = parseYkt(o.data.problems);
                }
            } else if ((location.host === 'examination.xuetangx.com' || location.host === 'changjiang-exam.yuketang.cn') && location.pathname.includes('/exam/')) {
                if (o.data && o.data.problems) {
                    GLOBAL.json = parseYktExam(o.data.problems);
                    console.log(GLOBAL.json);
                }
            } else if ((location.host === 'examination.xuetangx.com' || location.host === 'changjiang-exam.yuketang.cn') && location.pathname.includes('/result/')) {
                if (o.data && o.data.problems) {
                    uploadAnswer(collectYktExam(o.data.problems));
                }
            } else if (location.pathname.includes('/study/html/content/studying/')) {
                if (o.data && (o.status === 2 || o.status === 1) && o.state !== "doing") {
                    GLOBAL.finish = true;
                    const result = parseAnHuiJx(o.data);
                    for (let resultElement of result) {
                        uploadAnswer(resultElement);
                    }
                }
            } else if (location.pathname.includes("/study/html/content/tkOnline/")) {
                if (o.code && o.data && o.doingPaperId) {
                    const arr = [];
                    const result = parseAnHuiJx(o.data);
                    for (let resultElement of result) {
                        arr.push(...resultElement);
                    }
                    uploadAnswer(arr);
                }
            } else if (location.host === "www.zjooc.cn") {
                if (o.data && o.data.paperName && o.data.clazzIds && o.data.paperSubjectList) {
                    const data = collectZaiZheXue(o.data.paperSubjectList);
                    uploadAnswer(data);
                }
            } else if (location.host === "61.183.163.9:8089") {
                if (o.topicList && o.topicList.length > 0) {
                    GLOBAL.json = collectDanWei(o.topicList);
                    uploadAnswer(GLOBAL.json);
                }
            }
            return o
        };
    }


    function collectDanWei(pro) {
        return pro.map(i => {

            if (/[013]/.test(getQuestionType(i.ttop010))) {
                const options = i.ttop018.length > 0 ? i.ttop018.split('$$') : ['正确', '错误'];
                return {
                    type: getQuestionType(i.ttop010),
                    question: i.ttop011, options,
                    answer: i.ttop022.split('').map(item => {
                        return options[item.charCodeAt(0) - 65]
                    }),
                    answerKey: i.ttop022.split('').map(item => {
                        return options[item.charCodeAt(0) - 65]
                    }),
                }
            } else if (/[24]/.test(getQuestionType(i.ttop010))) {
                return {
                    type: getQuestionType(i.ttop010),
                    question: i.ttop011,
                    options: [],
                    answer: i.ttop021.split('$$'),
                    answerKey: i.ttop021.split('$$')
                }
            }
        }).filter(i => i !== undefined)
    }

    function collectZaiZheXue(problems) {
        return problems.map(item => {
            if (!item.rightAnswer) return undefined
            console.log(item);
            const subjectType = item.subjectType;
            let type = -1;
            const question = formatString((item.subjectName));
            const answer = [];
            const options = [];
            //单选多选
            if (subjectType === 1 || subjectType === 2) {
                type = subjectType - 1;
                for (let subjectOption of item.subjectOptions) {
                    const opt = formatString((subjectOption.optionContent));
                    options.push(opt);
                    if (item.rightAnswer.includes(subjectOption.optionHead)) {
                        answer.push(opt);
                    }
                }
            } else if (subjectType === 3) {
                type = 3;
                if (item.rightAnswer === 'yes') {
                    answer.push("正确");
                } else {
                    answer.push("错误");
                }
            } else {
                return undefined
            }
            return {
                question,
                options,
                type,
                answer
            }
        }).filter(i => i !== undefined && i.answer.length > 0)
    }

    /**
     * 雨课堂考试收录
     * @param problems
     */
    function collectYktExam(problems) {
        console.log(problems);
        return problems.map(item => {
            const type = TYPE[item.TypeText];
            // if (type === 2 || type === 4) {
            //     return {
            //         question: formatString(item.Body),
            //         type
            //     }
            // }
            if (type < 2) {
                const options = item.Options.map(i => {
                    return formatString(type === 3 ? i.key : i.value)
                });
                return {
                    question: formatString(item.Body),
                    options,
                    answer: item.Answer.map(item => {
                        return options[item.charCodeAt(0) - 65]
                    }),
                    type
                }
            }

        })
    }


    /**
     * 解析安徽就绪教育的答案
     * @param problems
     * @returns {*}
     */
    function parseAnHuiJx(problems) {
        // console.log(problems)
        return problems.map(item => {
            let type = TYPE[item.name];
            return item.list.map(q => {
                //选项内容
                const options = type === 1 || type === 0 ? q.options.map(o => {
                    return formatString(((o.content)))
                }) : [];
                //答案
                let answer = [];
                if (type === 1 || type === 0) {
                    answer = q.answers.split(',').map(a => {
                        return options[parseInt(a)]
                    });
                } else if (type === 3) {
                    answer = [q.answers.replace('false', '错误').replace('true', '正确')];
                } else {
                    answer = [formatString(q.answers)];
                }
                return {
                    answer,
                    type,
                    question: formatString(((q.content))),
                    options
                }
            })
        })
    }

    /**
     * 解析雨课堂的json
     * @param problems
     * @returns {*}
     */
    function parseYkt(problems) {
        return problems.map(item => {
            const type = TYPE[item.content.TypeText];
            if (type === 2 || type === 4) {
                return {
                    question: formatString((item.content.Body)),
                    type
                }
            } else if (type <= 3) {
                return {
                    question: formatString(item.content.Body),
                    options: item.content.Options.map(i => {
                        return formatString(type === 3 ? i.key : i.value)
                    }),
                    type
                }
            }
        }).filter(i => i !== undefined)
    }

    /**
     * 解析雨课堂的考试json
     * @param problems
     * @returns {*}
     */
    function parseYktExam(problems) {
        return problems.map(items => {
            if (items.problems){
                return  items.problems.map(item => {
                    const type = TYPE[item.TypeText];
                    if (type === 2 || type === 4) {
                        return ({
                            question: formatString(item.Body),
                            type
                        })
                    }
                    return ({
                        question: formatString(item.Body),
                        options: item.Options.map(i => {
                            return formatString(type === 3 ? i.key : i.value)
                        }),
                        type
                    })
                }).filter(i => i !== undefined)

            }else {
                const type = TYPE[items.TypeText];
                if (type === 2 || type === 4) {
                    return ({
                        question: formatString(items.Body),
                        type
                    })
                }
                return ({
                    question: formatString(items.Body),
                    options: items.Options.map(i => {
                        return formatString(type === 3 ? i.key : i.value)
                    }),
                    type
                })
            }


            }
        ).filter(i => i !== undefined).flat()
    }

    function parseXinJiangAgain(questions) {
        return questions.map(item => {
            const answer = [];
            const options = item.answers.map(opt => {
                if (opt.isAnswer === '0') answer.push(formatString(opt.name));
                return formatString(opt.name)
            });
            const type = item.types === '2' ? 3 : parseInt(item.types);

            // const answerKey = (type === 0 || type === 1) ? item.answer.split('') : answer
            return {
                id: item.id,
                question: item.name,
                // answerKey,
                options,
                answer,
                type
            }
        })
    }

    function parseIcve(questions) {
        return questions.map(item => {
            const options = item.Selects.map(opt => {
                return formatString(opt)
            });
            const type = TYPE[item.ACHType.QuestionTypeName];
            const answer = item.Answers.map(key => {
                if (type === 0 || type === 1) {
                    return options[key.charCodeAt() - 65]
                } else if (type === 3) {
                    return key === '1' ? '正确' : '错误'
                }
            });
            const answerKey = (type === 0 || type === 1) ? item.Answers : answer;
            return {
                id: item.Id,
                question: item.ContentText,
                answerKey,
                options: type === 3 ? ['正确', '错误'] : options,
                answer,
                type
            }
        })
    }


    function parseXiaoETong(obj) {
        return obj.map(item => {
            //获取选项列表
            let answer = [];
            if (item.type === 0 || item.type === 1) {
                answer = item.answer.map(a => {
                    for (let optionElement of item.option) {
                        if (optionElement.id === a) return formatString(optionElement.content)
                    }
                });
            } else if (item.type === 3) {
                answer = item.answer.map(a => {
                    return a.replace('1', "正确").replace('0', '错误')
                });
            } else if (item.type === 4) {
                answer = item.answer;
            }

            return {
                question: formatString(item.content),
                answer,
                options: item.option ? item.option.map(opt => {
                    return formatString(opt.content)
                }) : [],
                type: item.type
            }
        })
    }

    function chaoxingOldExam() {
        showPanel();
        setTimeout(() => {
            new WorkerJS({
                root: '.TiMu',
                elements: {
                    question: '.Cy_TItle .clearfix',
                    options: '.Cy_ulTop .clearfix',//文字的选项列表
                    $options: ':radio, :checkbox, .Cy_ulTk textarea',//绑定的事件的 dom列表
                    type: '[name^=type]:not([id])'
                }
            }, (obj) => {
                return obj
            }, (type, answer, $option) => {
                if (type === 0 || type === 3 || type === 1) {
                    $option.get(0).click();
                } else if (type === 4 || type === 2) {
                    UE$1.getEditor($option.attr('name')).setContent(answer);
                }
            }, (auto_jump) => {
                auto_jump && setInterval(function () {
                    const btn = $('.saveYl:contains(下一题)').offset();
                    var mouse = document.createEvent('MouseEvents'),
                        arr = [btn.left + Math.ceil(Math.random() * 80), btn.top + Math.ceil(Math.random() * 26)];
                    mouse.initMouseEvent('click', true, true, document.defaultView, 0, 0, 0, arr[0], arr[1], false, false, false, false, 0, null);
                    _self.event = $.extend(true, {}, mouse);
                    delete _self.event.isTrusted;
                    _self.getTheNextQuestion(1);
                }, Math.ceil(GLOBAL.time * Math.random()) * 2);
            }).fillAnswer();
        }, GLOBAL.delay);
    }


    /**
     * 超星章节测验，新版旧版通用
     */
    function chaoxingQuiz() {
        removeF();
        showPanel();
        initChaoXingQuiz($('#workLibraryId').val() || $('#oldWorkId').val(), $('#courseId').val());
        setTimeout(() => {
            new WorkerJS({
                root: '.clearfix .TiMu',
                elements: {
                    question: '.Zy_TItle .clearfix',
                    options: 'ul:eq(0) li .after',//文字的选项列表
                    $options: 'ul:eq(0) li :radio,:checkbox,textarea',//绑定的事件的 dom列表
                    type: 'input[name^=answertype]'
                }
            }, (obj) => {
                if (obj.type === 3) {
                    obj.options = ['正确', '错误'];
                }
                return obj
            }, async (type, answer, $option, items, $options) => {
                if (type === 1) {
                    for (let index = 0; index < $options.length; index++) {
                        await sleep(200);
                        const $item = $options.eq(index);
                        Boolean($.inArray(index, items) + 1) === $item.get(0).checked || $item.click();

                    }
                } else if (type === 0 || type === 3) {
                    $option.get(0).click();
                } else if (type === 4 || type === 2) {
                    UE$1.getEditor($option.attr('name')).setContent(answer);
                }
            }, () => {
                GLOBAL.autoSave && $('.ZY_sub .btnGray_1').click();
            }).fillAnswer();
        }, GLOBAL.delay);
    }

    function chaoxingNewWork() {
        showPanel();
        setTimeout(() => {
            new WorkerJS({
                root: '.questionLi',
                elements: {
                    question: 'h3',
                    options: '.stem_answer .answerBg .answer_p, .textDIV, .eidtDiv',
                    $options: '.stem_answer .answerBg, .textDIV, .eidtDiv',
                    type: 'input[type^=hidden]:eq(0)'
                }
            }, (obj) => {
                //多选题清楚样式，清楚已经保存的结果
                obj.type === 1 && $.each(obj.$options, (index, val) => {
                    $(val).find('.check_answer,.check_answer_dx').length === 1 && $(val).click();
                });
                return obj
            }, (type, answer, $option) => {
                if (type === 0 || type === 1 || type === 3) {
                    if ($option.find('.check_answer,.check_answer_dx').length === 0) {
                        $option.click();
                    }
                } else if (type === 4 || type === 2) {
                    UE$1.getEditor($option.find('textarea').attr('name')).setContent(answer);
                }
            }, (auto_jump) => {
                /**
                 * 答题成功之后要跳转了
                 */
                auto_jump && setTimeout(() => {
                    $('.nextDiv .jb_btn:contains("下一题")').click();
                }, GLOBAL.time / 5);
            }).fillAnswer();
        }, GLOBAL.delay);
    }


    function chaoxingNewExam(i) {
        showPanel();
        setTimeout(() => {
            let cxWork = new WorkerJS({
                root: '.questionLi',
                elements: {
                    question: 'h3 div',
                    options: '.answerBg .answer_p, .textDIV, .eidtDiv',
                    $options: '.answerBg, .textDIV, .eidtDiv',
                    type: 'input[name^=type]:eq(' + i + ')'
                }
            }, async (obj) => {
                //多选题清楚样式，清楚已经保存的结果
                if (obj.type === 1) {
                    for (let val of obj.$options) {
                        await sleep(300);
                        $(val).find('.check_answer,.check_answer_dx').length === 1 && $(val).click();
                    }
                }else if (obj.type ===6){
                    obj.type = 4;
                }
                console.log(obj);
                return obj
            }, (type, answer, $option) => {
                if (type === 0 || type === 1 || type === 3) {
                    $option.find('.check_answer,.check_answer_dx').length || $option.click();
                } else if (type === 4 || type === 2 || type === 5) {
                    const name = $option.find('textarea').attr('name');
                    UE$1.getEditor(name).setContent(answer);
                    if (i === 0) {
                        $('#' + name.replace('answerEditor', 'save_')).click();//save
                    }
                }
            }, (auto_jump) => {
                /**
                 * 答题成功之后要跳转了
                 */
                auto_jump && setTimeout(() => {
                    $('.nextDiv .jb_btn:contains("下一题")').click();
                }, GLOBAL.time / 5);
            });
            cxWork.fillAnswer();
        }, GLOBAL.delay);
    }

    function chaoxingQuizNew() {
        showPanel();
        setTimeout(() => {
            let cxWork = new WorkerJS({
                root: '.question-item',
                elements: {
                    question: '.topic-txt',
                    options: '.topic-option-list',
                    $options: '.topic-option-list input',
                    type: 'input[class^=que-type]'
                }
            }, async (obj) => {
                if (obj.type === 16) {
                    obj.type = 3;
                }
                //多选题清楚样式，清楚已经保存的结果
                if (obj.type === 1) {
                    for (let val of obj.$options) {
                        await sleep(300);
                        $(val).find('.check_answer,.check_answer_dx').length === 1 && $(val).click();
                    }
                }

                return obj
            }, (type, answer, $option) => {
                if (type === 0 || type === 1 || type === 3) {
                    $option.click();
                } else if (type === 4 || type === 2) {
                    $option.val(answer);
                }
            });
            cxWork.fillAnswer();
        }, GLOBAL.delay);
    }

    function ZjyExam() {
        showPanel();
        setTimeout(() => {
            initZhiJiaoYun();
            new WorkerJS({
                root: '.q_content',
                elements: {
                    question: '.divQuestionTitle',
                    options: '.questionOptions .q_option',
                    $options: '.questionOptions .q_option div'
                }
            }, (obj) => {
                obj.type = TYPE[obj.type.next().attr('answertype')];
                obj.type = obj.type ? obj.type : defaultWorkTypeResolver(obj.$options);
                obj.options = $.map(obj.options, (val) => {
                    return formatString(val.replace(/[A-G][．|\\.\s+]/, '')).trim()
                });

                obj.type === 1 && obj.$options.map((index,item)=>{
                    $(item).attr('class') === 'checkbox_on' && $(item).click();
                });
                return obj
            }, (type, answer, $option) => {
                // $option = $option.find('div')
                if (type === 0 || type === 3) {
                    $option.click();
                } else if (type === 1) {
                    $option.attr('class') === 'checkbox_on' || $option.click();
                }
            }, () => {
                /**
                 * 答题完成的监听
                 */
                if ($('.paging_next').attr('style').includes('block')) {
                    //如果有下一页
                    $('.paging_next').click();
                    return true
                }

            }).fillAnswer();
        }, GLOBAL.delay);
    }

    function mooc_icve_com_cn() {
        showPanel();
        setTimeout(() => {
            new WorkerJS({
                root: '.e-q-r',
                elements: {
                    question: '.e-q-q .ErichText',
                    options: '.e-a-g li',
                    $options: '.e-a-g li',
                    type: '.quiz-type'
                }
            }, (obj) => {

                    console.log('obj.question',obj.question);
                if (obj.type === 'A1A2题'){
                    obj.type = 1;
                }

                obj.question = obj.question.replace(/<img src="https:\/\/cdn-zjy.icve.com.cn\/common\/images\/question_button\/blankspace(\d+).gif">/gi,'');

                obj.options = obj.options.map(i=>{
                    return i.trim().replace(/^[abAB]\)\s+/,'').replace(/^[A-Za-z]\s+/,'').trim()
                });
                console.log(obj);
                return obj
            },(type, answer, $option,items,$options) => {
                // fill answer
                if (type === 1 ){
                    for (let index = 0; index < $options.length; index++) {
                        const $item = $options.eq(index);
                        Boolean($.inArray(index, items) + 1) === $item.hasClass("checked") || $item.click();
                    }
                }else if (type === 0 || type === 3){
                    $option.click();
                }else ;
            }, () => {
                /**
                 * 答题完成的监听
                 */
                // if ($('.paging_next').attr('style').includes('block')) {
                //     //如果有下一页
                //     $('.paging_next').click()
                //     return true
                // }

            }).fillAnswer();
        }, GLOBAL.delay);
    }

    function zjyFile() {
        showPanel();
        setTimeout(() => {
            new WorkerJS({
                root: '.panel_item .panel_item',
                elements: {
                    question: '.preview_cm .preview_stem',
                    options: '.preview_cm ul li span:last-child',
                    $options: '.preview_cm ul li input',
                }
            }, (obj) => {
                obj.type = TYPE[obj.type.parent().find('.panel_title').text().trim().split(' ')[0]];
                console.log(obj.options);
                obj.options = obj.options.map(i=>{
                    return i.trim().replace(/^[abAB]\)\s+/,'').replace(/^[A-Za-z]\s+/,'').trim()
                });
                return obj
            },(type, answer, $option,items,$options) => {
                // fill answer
                if (type === 1 ){
                    for (let index = 0; index < $options.length; index++) {
                        const $item = $options.eq(index);
                        Boolean($.inArray(index,items) + 1) ===  $item.attr('checked') === "checked" || $item.click();

                    }
                } else if (type === 0 || type === 3 ) {
                    $option.click();
                }
            }).fillAnswer();
        }, GLOBAL.delay);
    }

    function icve_works() {
        hookJSON();

        function get_element(id) {
            for (let jsonElement of GLOBAL.json) {
                if (jsonElement.id === id) {
                    return jsonElement
                }
            }
        }

        showPanel();
        setTimeout(() => {

            new WorkerJS({
                root: '.questions',
                elements: {
                    question: '.tigan',
                    options: 'label ',//文字的选项列表
                    $options: '.dy_input',//绑定的事件的 dom列表
                    type: 'input[name^=paperItemId]'
                }
            }, (obj) => {
                const ele = get_element(obj.type);
                obj.question = ele.question;
                obj.answer = ele.answerKey ? ele.answerKey : ele.answer;
                obj.type = ele.type;
                obj.options = ele.options;
                return obj
            }, (type, answer, $option) => {
                if (type === 0 || type === 3 || type === 1) {
                    $option.get(0).click();
                } else if (type === 4 || type === 2) {
                    UE$1.getEditor($option.attr('name')).setContent(answer);
                }
            }).fillAnswer();
        }, GLOBAL.delay);
    }

    function zhsExam() {
        console.log("1111111111111");
        showPanel();
        setTimeout(() => {
            new WorkerJS({
                root: '.examPaper_subject',
                elements: {
                    question: '.subject_describe div,.smallStem_describe p',
                    options: '.subject_node .nodeLab .node_detail',//文字的选项列表
                    $options: '.subject_node .nodeLab .node_detail',//绑定的事件的 dom列表
                    type: '.subject_type span:first-child'
                }
            }, (obj) => {
                try {
                    obj.question = obj.question.get(0).__vue__._data.shadowDom.textContent;
                } catch (e) {
                }
                if ($(".yidun_popup").hasClass('yidun_popup--light')) {
                    console.log('我到这了', GLOBAL.loop);
                    iframeMsg('tip', {type: 'stop', tip: '答题暂停，请自行通过验证'});
                    GLOBAL.stop = true;
                    return undefined
                }
                if (obj.type === undefined) {
                    obj.type = 66;
                }
                console.log(obj);
                return obj
            }, (type, answer, $option, items, $options) => {
                // defaultClick($options, items, $item.hasClass('onChecked'))
                if (type === 1 || type === 66) {
                    for (let index = 0; index < $options.length; index++) {
                        const $item = $options.eq(index);
                        $option.css('background', 'rgba(225,225,0,0.2)');
                        Boolean($.inArray(index, items) + 1) === $item.hasClass('onChecked') || $item.click();
                    }
                } else if (type === 3 || type === 0) {
                    $option.css('background', 'rgba(225,225,0,0.2)');
                    $option.click();
                }
            }, () => {
                setTimeout(() => {
                    $('.el-button:contains(保存)').get(0).__vue__._events.click[0]();
                }, GLOBAL.time / 3);
            }, (data) => {
                if (data.type <= 3) {
                    setTimeout(() => {
                        $('.el-button:contains(下一题)').get(0).__vue__._events.click[0]();
                    }, GLOBAL.time / 3);
                }

            }).fillAnswer();
        }, GLOBAL.delay * 1.5);
    }

    function zhsIntegral() {
        showPanel();
        setTimeout(() => {
            new WorkerJS({
                root: '.questionBox:eq(0)',
                elements: {
                    question: '.questionContent',
                    options: '.optionUl label .el-radio__label,.el-checkbox__label',//文字的选项列表
                    $options: '.optionUl label',//绑定的事件的 dom列表
                    type: '.questionTit'
                }
            }, async (obj) => {
                obj.options = obj.options.map(item => {
                    return formatString(item.replaceAll(/^[a-zA-Z][.|\s+]/g, ''))
                });
                if ($(".yidun_popup").hasClass('yidun_popup--light')) {
                    console.log('我到这了', GLOBAL.loop);
                    iframeMsg('tip', {type: 'stop', tip: '答题暂停，请自行通过验证'});
                    GLOBAL.stop = true;
                    return undefined
                }
                if (obj.type === 1) {
                    for (let val of obj.$options) {
                        $(val).hasClass('is-checked') && $(val).click();
                        await sleep(500);
                    }
                }

                return obj
            }, (type, answer, $option, items, $options) => {
                if (type === 3 || type === 0 || type === 1) {
                    $option.css('background', 'rgba(225,225,0,0.2)');
                    $option.click();
                }
            }, (auto_jump) => {
                if ($('.Nextbtndiv .Topicswitchingbtn-gray:contains(下一题)').hasClass('Topicswitchingbtn-gray')) return false
                $('.Topicswitchingbtn:contains(下一题)').click();
                return true
            }).fillAnswer();
        }, GLOBAL.delay * 2);
    }

    function zhsIntegral1() {
        showPanel();
        setTimeout(() => {
            new WorkerJS({
                root: '.ques-detail',
                elements: {
                    question: '.questionName .centent-pre',
                    options: '.radio-view li  .preStyle,.checkbox-views label .preStyle',//文字的选项列表
                    $options: '.radio-view li,.checkbox-views label',//绑定的事件的 dom列表
                    type: '.letterSortNum'
                }
            }, async (obj) => {
                obj.options = obj.options.map(item => {
                    return formatString(item.replaceAll(/^[a-zA-Z][.|\s+]/g, ''))
                });
                if ($(".yidun_popup").hasClass('yidun_popup--light')) {
                    console.log('我到这了', GLOBAL.loop);
                    iframeMsg('tip', {type: 'stop', tip: '答题暂停，请自行通过验证'});
                    GLOBAL.stop = true;
                    return undefined
                }
                if (obj.type === 1) {
                    for (let val of obj.$options) {
                        $(val).hasClass('is-checked') && $(val).click();
                        await sleep(500);
                    }
                }
                if (obj.type === 15){
                    obj.question = formatString($('.centent-son-pre').text());
                    obj.type = 1;
                }
                console.log(obj);

                return obj
            }, (type, answer, $option, items, $options) => {
                if (type === 3 || type === 0 || type === 1) {
                    $option.click();
                }
            }, (auto_jump) => {
                if ($('.next-topic:contains(下一题)').hasClass('noNext')) return false
                $('.next-topic:contains(下一题)').click();
                return true
            }).fillAnswer();
        }, GLOBAL.delay * 2);
    }

    function ybkExam() {
        showPanel();
        setTimeout(() => {
            // sleep(3000)
            new WorkerJS({
                root: '.topic-item',
                elements: {
                    question: '.t-con .t-subject',
                    options: '.t-option  label .option-content',//文字的选项列表
                    $options: '.el-radio__input,.el-checkbox__input',//绑定的事件的 dom列表
                    type: '.t-info .t-type'
                }
            }, (obj) => {
                if (obj.type === 1) {
                    for (let val of obj.$options) {
                        $(val).hasClass('is-checked') && $(val).click();
                    }
                }
                return obj
            }, (type, answer, $option) => {
                if (type === 1 || type === 3 || type === 0) {
                    if (!$option.hasClass('is-checked')) {
                        $option.click();
                    }            }
            }).fillAnswer();
        }, GLOBAL.delay * 1.5);
    }

    function yktOldExam() {
        showPanel();
        setTimeout(() => {
            new WorkerJS({
                root: '.problem_item',
                elements: {
                    question: '.notBullet:eq(0)',
                    options: '.notBullet:gt(0)',//文字的选项列表
                    $options: '.problembullet',//绑定的事件的 dom列表
                }
            }, async (obj) => {
                const $item = obj.type;

                var tmp = $item.find('.ptype').clone();
                tmp.children().remove();
                obj.type = TYPE[tmp.text().replaceAll(/\s+/g, '')];
                obj.question = await yuketangOcr(obj.question.attr('data-background'));

                if (obj.$options.length === 2) {
                    obj.options = ['正确', '错误'];
                } else {
                    const opt = [];
                    for (const tmpElement of $item.find('.notBullet:gt(0)')) {
                        opt.push(await yuketangOcr(jQuery(tmpElement).attr('data-background')));
                    }
                    obj.options = opt;
                }

                return obj

            }, (type, answer, $option) => {
                console.log($option);
                // fill answer
                if (type === 0 || type === 3 || type === 1) {
                    if (!$option.hasClass('is-checked')) {
                        $option.click();
                    }
                    // $('.el-button:contains(下一题)').click()
                }


                // if (type === 0 || type === 1 || type === 3) {
                //     if ($option.find('.check_answer,.check_answer_dx').length === 0) {
                //         $option.click()
                //     }
                // } else if (type === 4 || type === 2) {
                //     UE.getEditor($option.find('textarea').attr('name')).setContent(answer)
                // }
            }).fillAnswer();
        }, GLOBAL.delay * 1.5);
    }


    function yktExam() {
        hookJSON();
        showPanel();
        setTimeout(() => {
            console.log(GLOBAL.json);
            // sleep(3000)
            // $('.')
            new WorkerJS({
                root: '.exam-main--body .subject-item',
                elements: {
                    question: '.item-body .problem-body ,p',
                    options: '.item-body ul li',//文字的选项列表
                    $options: '.item-body ul label, .blank-item-dynamic, .edui-editor-iframeholder',//绑定的事件的 dom列表
                    type: '.item-type'
                }
            }, async (obj) => {
                console.log(obj);
                // const index = jQuery('.item-type').text().trim().match(/^(\d+)/)[1];
                const ele = GLOBAL.json[GLOBAL.index - 1];
                // obj.$options = document.querySelector('.subject-item')
                obj.type = ele.type;
                obj.options = ele.options;
                obj.question = ele.question;
                if (obj.type === 1) {
                    for (let val of obj.$options) {
                        jQuery(val).hasClass('is-checked') && jQuery(val).click();
                        await sleep(500);
                    }
                }
                return obj

            }, (type, answer, $option) => {
                console.log($option);
                // fill answer
                if (type === 0 || type === 3 || type === 1) {
                    if (!$option.hasClass('is-checked')) {
                        $option.click();
                    }
                    // $('.el-button:contains(下一题)').click()
                } else if (type === 4 || type === 2) {
                    console.log("手动复制吧");
                }


                // if (type === 0 || type === 1 || type === 3) {
                //     if ($option.find('.check_answer,.check_answer_dx').length === 0) {
                //         $option.click()
                //     }
                // } else if (type === 4 || type === 2) {
                //     UE.getEditor($option.find('textarea').attr('name')).setContent(answer)
                // }
            }).fillAnswer();
        }, GLOBAL.delay * 1.5);
    }


    function yktText() {

        hookJSON();
        showPanel();
        setTimeout(() => {
            console.log(GLOBAL.json);
            new WorkerJS({
                root: '.container-problem .subject-item',
                elements: {
                    // question: '.item-body .problem-body ,p',
                    // options: '.item-body ul li',//文字的选项列表
                    $options: '.item-body ul label',//绑定的事件的 dom列表
                    type: '.item-type'
                }
            }, async (obj) => {
                console.log(obj);
                //测验题号
                const index = jQuery('.container-problem .subject-item').eq(0).find('.item-type').text().trim().match(/^(\d+)/)[1];
                const ele = GLOBAL.json[index - 1];
                obj = Object.assign(obj,ele);
                if (obj.type === 1) {
                    for (let val of obj.$options) {
                        jQuery(val).hasClass('is-checked') && jQuery(val).click();
                        await sleep(500);
                    }
                }
                console.log(obj);
                return obj

            }, (type, answer, $option) => {
                console.log($option);
                // fill answer
                if (type === 0 || type === 3 || type === 1) {
                    if (!$option.hasClass('is-checked')) {
                        $option.click();
                    }
                    // $('.el-button:contains(下一题)').click()
                }
            }, (need_jump) => {
                if ($('.el-button--text:contains(下一题)').hasClass('is-disabled')) return false
                // if (ne)
                need_jump && setTimeout(() => {
                    $('.el-button--text:contains(下一题)').click();
                }, GLOBAL.time / 3);
                return need_jump
            }).fillAnswer();
        }, GLOBAL.delay * 1.5);
    }

    function collectXiaoETong() {
        const split = location.pathname.split('/');
        axios.post('https://app5oicyne21998.h5.xiaoeknow.com/evaluation_wechat/exam/review_detail', `bizData%5Bcontent_app_id%5D=&bizData%5Bexam_id%5D=${split[4]}&bizData%5Bparticipate_id%5D=${split[5]}`).then(res => {
            const result = parseXiaoETong(res.data.data.result);
            uploadAnswer(result);
        });
    }


    function collectAnHuiJiXuJiaoYu() {
        const data = location.href.split('?')[1];
        axios.post('https://main.ahjxjy.cn/study/assignment/getAssignment', `${data}&&page=1`).then(res => {
            for (const re of res.data.list) {
                if (re.statusInt === 2) {
                    axios.post('https://main.ahjxjy.cn/study/assignment/loadOnlineAssignment', `${data}&cellId=${re.cellId}`).then(res => {
                        const arr = [];
                        const result = parseAnHuiJx(res.data.data);
                        for (let resultElement of result) {
                            arr.push(...resultElement);
                        }
                        uploadAnswer(arr);
                    });
                }
            }
        });
    }


    function collectPtTkt() {
        const class_room_id = location.pathname.split('/').pop();
        axios.get('https://examination.xuetangx.com/exam_room/show_paper?exam_id='+class_room_id).then(res => {
            const result = parsePtTkt(res.data.data.problems);
            uploadAnswer(result);
        });

        function parsePtTkt(obj){
            return obj.map(item => {
                try {
                    const type = TYPE[item.TypeText];
                    if (type >= 4) return
                    const answer_key_arr = typeof item.Answer === 'string' ? item.Answer.split('') : item.Answer;
                    const answer_str_arr = [];
                    const options = type === 2 ? [] : item.Options.map(i => {
                        if (type<2 && JSON.stringify(answer_key_arr).includes(i.key)){
                            answer_str_arr.push(formatString(i.value));
                        }
                        return (type === 3 ? i.key : formatString(i.value))
                    });
                    if (type === 3){
                        answer_str_arr.push(...answer_key_arr);
                    }else if (type === 2){
                        const blanks = item.Blanks.map(item=>{
                            return formatString(item.Answers[0])
                        });
                        answer_str_arr.push(...blanks);
                    }

                    if (answer_str_arr.length>0) {
                        // console.log(item.user)

                        return {
                            question: formatString(item.Body).replaceAll(/\[填空\d+]/g,'____'),
                            options,
                            answer: answer_str_arr,
                            type
                        }
                    }
                } catch (e) {
                    console.log(e, item);
                }

            }).filter(item => item !== undefined)
        }
    }


    async function collectYkt() {
        const class_room_id = location.pathname.split('/').pop();
        const instance = axios.create({
            timeout: GLOBAL.timeout,
            headers: {
                'xtbz': 'ykt',
                'classroom-id': class_room_id
            }
        });
        const res1 = await instance.get('https://' + location.host + '/v2/api/web/logs/learn/' + class_room_id + '?actype=-1&page=0&offset=20&sort=-1');
        for (let activity of res1.data.data.activities) {
            const courseware_id = activity.courseware_id;
            if (activity.type!==15)continue
            const res2 = await instance.get(`https://${location.host}/c27/online_courseware/xty/kls/pub_news/${courseware_id}/`);
            const content_info = res2.data.data.content_info;
            // if (!content_info instanceof Array)return
            for (const content of content_info) {
                const arr = content.leaf_list;
                for (let sectionListElement of content.section_list) {
                    arr.push(...sectionListElement.leaf_list);
                }
                for (let leaf of arr) {
                    if (leaf.leaf_type === 6) {
                        const res3 = await instance.get(`https://${location.host}/mooc-api/v1/lms/learn/leaf_info/${class_room_id}/${leaf.id}/`);
                        const res4 = await instance.get('https://' + location.host + '/mooc-api/v1/lms/exercise/get_exercise_list/' + res3.data.data.content_info.leaf_type_id + '/');

                        uploadAnswer(collectYktWork(res4.data.data.problems));
                    }
                }
            }
        }




        function collectYktWork(collect) {
            return collect.map(item => {
                try {
                    const type = TYPE[item.content.TypeText];
                    if (!/[013]/.test(type)) return
                    const answer_key_arr = typeof item.user.answer === 'string' ? item.user.answer.split('') : item.user.answer;
                    const answer_str_arr = [];
                    const options = item.content.Options.map(i => {
                        if (type <=1 && JSON.stringify(answer_key_arr).includes(i.key)){
                            answer_str_arr.push(formatString(i.value));
                        }
                        return (type === 3 ? i.key : formatString(i.value))
                    });
                    if (type === 3)answer_str_arr.push(...answer_key_arr);

                    if ((item.user.is_show_answer||item.user.is_right) && item.user.answer && answer_str_arr.length>0) {
                        return {
                            question: formatString(item.content.Body),
                            options,
                            answer:  answer_str_arr,
                            type
                        }
                    }
                } catch (e) {
                    console.log(e, item);
                }
            }).filter(i => i !== undefined)
        }
    }

    function collect_booway() {
        var data = $(".question").map(function (index, value) {
            return {
                question: formatString(filterImg($(value).find('.question-body-text')).trim()),
                type: TYPE[$(value).find('.question-title').text().match(/\[(.*)\]/)[1]]
            };
        });

        data = $.grep(data.map(function (index) {
            var $TiMu = $(".question").eq(index);
            //如果有解析就保留解析
            if ($TiMu.find('.answer-desc-content').text().length > 3) {
                this.analysis = filterImg($TiMu.find('.answer-desc-content'));
            }
            if (this.type === 3) {
                this.answer = $TiMu.find('.answer-desc-summary .answer_value').text().replace('对','正确').replace('错','错误');

            } else if (this.type === 1 || this.type === 0) {
                let text = $TiMu.find('.answer-desc-summary').text();
                this.options = $.map($TiMu.find(".question-list-item"), function (value) {
                    return filterImg(value).replace(/^[A-Z]:\s+/, '').replace(/^[A-Z][．|\\.\s]/, '')
                });
                if (text.length > 0) {
                    this.answer = getAnsForKey(text.match(/[A-G]/gi) || [], this.options);
                }

            } else if (this.type === 2) {
                return  false
            } else if (this.type === 4 || this.type === 8 || this.type === 6) {
                return  false
            } else {
                return false
            }
            return this
        }), function (value) {
            // console.log(value)
            return value && value.answer != null && value.answer.length > 0 && !value.answer.includes('http://mooc2-ans.chaoxing.com/images/questionbank/icon/ppt.png');
        });
        console.log(data);
        data.length > 0 && uploadAnswer(data);
    }

    function zgdzText() {
        showPanel();
        setTimeout(() => {
            // sleep(3000)
            new WorkerJS({
                root: '.stViewItem',
                elements: {
                    question: '.stViewHead  div',
                    options: '.stViewCont  .stViewOption a',//文字的选项列表
                    $options: '.stViewCont  .stViewOption a,input',//绑定的事件的 dom列表
                }
            }, (obj) => {
                obj.type = getQuestionType(obj.type.parent().parent().prev().find('.E_E_L_I_C_R_C_T_SubType').text());
                obj.question = obj.question.replace(/\(\d+分\)/, '');
                obj.options = obj.options.map(i => {
                    return i.replace(/\([A-Za-z]\)/, '').trim()
                });
                return obj
            }, async (type, answer, $option, items, $options) => {
                // fill answer
                if (type === 1 || type === 0 || type === 3) {
                    await sleep(200);
                    $option.click();
                } else if (type === 4 || type === 2) {
                    $option.val(answer);
                }
            }).fillAnswer();
        }, GLOBAL.delay);
    }


    function collectZg() {
        new HTMLCollect({
            root: '.stViewItem',
            elements: {
                question: '.stViewHead  .head-content',
                options: '.stViewCont  .stViewOption',//文字的选项列表
                answer: '.stViewFoot  .stViewCell32,.stViewCell',//绑定的事件的 dom列表
            }
        }, (data) => {
            data.question = data.question.replace(/\(\d+分\)$/, '').replace(/\d+\./, '').trim();
            data.type = getQuestionType(data.type.parent().parent().prev().find('b').text());
            if (data.type>5 && data.type != 7 || data.type === undefined )return undefined
            console.log(data.question);
            if (data.type === 0 || data.type === 1){
                data.options = data.options.map((i)=>{
                    return (i.replace(/\([a-zA-z]\)/g,'').trim())
                });
                data.answer = data.answer.match(/[a-zA-z]/).map(i=>{
                    return data.options[i.toUpperCase().charCodeAt() - 65]
                });
            } else if (data.type === 2){
                data.answer = data.answer.split(/\(\d+\)./).slice(1).map(i=>{
                    return formatString(i.replace('参考答案:',''))
                });
            } else if (data.type === 7 || data.type === 4 || data.type === 5 || data.type === 3){
                data.answer = data.answer.replace('参考答案：','').trim().split();
            }
            return data
        }).collectAnswer().then(res => {
            // console.log(res)
            uploadAnswer(res);
        });
    }

    function xetText() {
        showPanel();
        setTimeout(() => {
            new WorkerJS({
                root: '.question-title,.title__text',
                elements: {
                    question: '#detail_div',
                    options: 'label  .image-text-box p',//文字的选项列表
                    $options: 'label,.simulation_inp',//绑定的事件的 dom列表
                }
            }, (obj) => {
                const $item = obj.type;

                obj.$options = $item.parent().next().find('.option-item,.checking-option__container,.fill_blank');
                obj.type = TYPE[$item.next().text().replace(/\s+/, '').replace("（", "").replace("）", "")];
                if (obj.type === 2){
                    obj.$options = $item.parent().parent();
                    // console.log(obj.$options)
                }
                if (obj.type === 3) {
                    obj.options = ['正确', '错误'];
                } else {
                    obj.options = jQuery.map($item.parent().next().find('.option-item #detail_div'), function (val) {
                        return formatString(filterImg(val))
                    });
                }
                console.log(obj);
                return obj
            }, (type, answer, $option) => {
                if (type === 0) {
                    $option.html().includes('single-exam-radio-active') || $option.click();
                } else if (type === 1) {
                    $option.html().includes('check-i-active') || $option.click();
                } else if (type === 3) {
                    $option.click();
                } else if (type === 2) {
                    const vue = $option.get(0).__vue__;
                    vue.content[0] = answer;
                    vue.emitAnswer();
                    $option.find('.simulation_inp').text(answer);
                }
            }).fillAnswer();
        }, GLOBAL.delay * 2);
    }


    function xetH5() {
        showPanel();
        setTimeout(() => {
            new WorkerJS({
                root: '.practice-detail__body',
                elements: {
                    question: '.question-wrap__title #detail_div',
                    options: '.question-option #detail_div',//文字的选项列表
                    $options: '.question-option #detail_div',//绑定的事件的 dom列表
                    type:'.question-wrap__title-tag'
                }
            }, (obj) => {
                // const $item = obj.type
                //
                // obj.$options = $item.parent().next().find('.option-item,.checking-option__container,.fill_blank')
                // obj.type = TYPE[$item.next().text().replace(/\s+/, '').replace("（", "").replace("）", "")]
                // if (obj.type === 2){
                //     obj.$options = $item.parent().parent()
                //     // console.log(obj.$options)
                // }
                // if (obj.type === 3) {
                //     obj.options = ['正确', '错误']
                // } else {
                //     obj.options = jQuery.map($item.parent().next().find('.option-item #detail_div'), function (val) {
                //         return formatString(filterImg(val))
                //     })
                // }
                // console.log(obj)
                return obj
            }, (type, answer, $option) => {
                if (type === 0 || type === 1 || type === 3) {
                    $option.click();
                }
            },()=>{
                if ($('.next').text() ==="下一题" ) {
                    //如果有下一页
                    $('.practice-detail__bottom-item:last-child').click();
                    return true
                }else {
                    return false
                }

            }).fillAnswer();
        }, GLOBAL.delay * 2);
    }

    function anHuiText() {
        showPanel();
        setTimeout(() => {
            if (GLOBAL.finish || $('a:contains(已完成批阅)').length === 1){
                iframeMsg('tip', {type: 'hidden', tip: '本页面已做完，无需自动答题'});
                return
            }
            new WorkerJS({
                root: '.e-q',
                elements: {
                    question: '.e-q-q .ErichText',
                    options: '.e-a-g li',
                    $options: '.e-a-g li'
                }
            }, (obj) => {
                const $item = obj.type;
                obj.type = TYPE[$item.parent().prev().find('.e-text').text()];
                obj.options = obj.options.map(i => {
                    return formatString(i.replaceAll(/^[ab]\)\s+/g, '').replaceAll(/^[a-z]\s+/g, '').replaceAll(/^[a-z]、\s+/g, '').trim())
                });
                return obj
            }, (type, answer, $option) => {
                if (type === 0 || type === 3) {
                    $option.click();
                } else if (type === 1) {
                    if (!$option.attr('class').includes('checked')) {
                        $option.click();
                    }
                }
            }).fillAnswer();
        }, GLOBAL.delay);
    }

    function xinJiangAgain() {
        showPanel();
         setTimeout(() => {
                // sleep(3000)
                new WorkerJS({
                    root: '.question-item',
                    elements: {
                        question: '.question-item-title span',
                        options: '.question-item-option label .el-checkbox__label,.el-radio__label',//文字的选项列表
                        $options: '.question-item-option label',//绑定的事件的 dom列表
                    }
                }, (obj) => {
                    const ele = GLOBAL.json[GLOBAL.index-1];
                    obj.type = ele.type;
                    obj.question = ele.question;
                    obj.answer = ele.answer;

                    return obj
                }, async (type, answer, $option,items,$options) => {
                   // [0,1,2]
                    console.log(items);
                    if (type === 1){
                        for (let index = 0; index < $options.length; index++) {
                            await sleep(200);
                            const $item = $options.eq(index);
                            // console.log(Boolean($.inArray(index,items) + 1) ===  $item.hasClass('is-checked'))
                            console.log(index,JSON.stringify(items));
                            Boolean($.inArray(index,items) + 1) ===  $item.hasClass('is-checked') || $item.click();

                        }
                    } else if (type === 0 || type === 3 ) {
                        $option.click();

                    }else if (type === 4 || type === 2) {
                        $option.val(answer);
                    }

                }).fillAnswer();
            }, GLOBAL.delay*1.5);





    }

    function xtzxText() {
        showPanel();
        setTimeout(() => {
            // sleep(3000)
            let xtzx = new WorkerJS({
                root: '.content:eq(0)',
                elements: {
                    question: '.question .fuwenben',
                    options: '.question .leftQuestion .leftradio > span:last-child',//文字的选项列表
                    $options: '.question .leftradio',//绑定的事件的 dom列表
                    type: '.question .title'
                }
            }, (obj) => {
                console.log(obj);
                if (obj.type === 3) {
                    obj.options = ['正确', '错误'];
                    obj.$options = $('.answerList .radio_jqq');
                }
                return obj
            }, (type, answer, $option, items, $options) => {

                // fill answer
                if (type === 1) {
                    for (let index = 0; index < $options.length; index++) {
                        const $item = $options.eq(index);
                        Boolean($.inArray(index, items) + 1) === $item.find('.radio_jqq').hasClass("active") || $item.click();
                    }

                } else if (type === 0 || type === 3) {
                    $option.click();
                } else if (type === 4 || type === 2) {
                    UE.getEditor($option.find('textarea')).setContent(answer);
                }
            }, (auto_jump) => {
                if ($('.tabbar').find('.right').hasClass('unselect')) return false
                setTimeout(() => {
                    $('.tabbar').find('.right').click();
                }, GLOBAL.time / 5);
                return true
            });
            xtzx.fillAnswer();

        }, GLOBAL.delay * 1.5);
    }

    function guokaiText() {
        showPanel();
        setTimeout(() => {
            // sleep(3000)
            new WorkerJS({
                root: '.card ol .single_selection,.multiple_selection,.true_or_false,.short_answer',
                elements: {
                    question: '.summary-title p,.summary-title .ng-scope',
                    options: '.subject-options li .option-content',//文字的选项列表
                    $options: '.subject-options label .left',//绑定的事件的 dom列表
                    type: '.summary-sub-title span:eq(0)'
                }
            }, (obj) => {
                return obj
            }, (type, answer, $option,items,$options) => {
                // fill answer
                if (type === 1){
                    for (let index = 0; index < $options.length; index++) {
                        const $item = $options.eq(index);
                        Boolean($.inArray(index,items) + 1) ===  $item.find('input').hasClass('ng-not-empty') || $item.click();

                    }
                }else if (type === 0 || type === 3 ) {
                    $option.click();
                }

                else if (type === 4 || type === 2) {
                    $option.val(answer);
                }
            }).fillAnswer();
        }, GLOBAL.delay*1.5);
    }

    function renweiText() {
        showPanel();
        setTimeout(() => {
            // sleep(3000)
            new WorkerJS({
                root: '.quesinfo',
                elements: {
                    question: 'dl dt',
                    options: 'dd label',//文字的选项列表
                    $options: 'dd input',//绑定的事件的 dom列表
                }
            }, (obj) => {
                if (obj.$options.length === 2){
                    obj.type = 3;
                    obj.options = ['正确', '错误'];

                }else {
                    obj.type = 0;
                }
                return obj
            }, (type, answer, $option) => {
                if (type === 0 || type === 3 ) {
                    $option.click();
                }
            }).fillAnswer();
        }, GLOBAL.delay);
    }

    function HuaQiaoAgain() {
        showPanel();
        setTimeout(() => {
            // sleep(3000)
            new WorkerJS({
                root: '.ui-question-group .ui-question',
                elements: {
                    question: '.ui-question-title  div',
                    options: '.ui-question-options  div',//文字的选项列表
                    $options: '.ui-question-options .ui-question-options-order,.ke-container',//绑定的事件的 dom列表
                }
            }, (obj) => {

                obj.type = TYPE[obj.type.parent().find('h2').text().replace(/[0-9]./,'').replace(/[一-二-三-四-五]./,'').split('：')[0].replace(/\s+/,'')];
                return obj
            }, (type, answer, $option,items,$options) => {
                // fill answer
                if (type === 1){
                    for (let index = 0; index < $options.length; index++) {
                        const $item = $options.eq(index);
                        Boolean($.inArray(index,items) + 1) ===  $item.parent().hasClass('ui-option-selected') || $item.click();

                    }
                }else if (type === 0 || type === 3 ) {
                    $option.click();
                }

                else if (type === 4 || type === 2 || type === 6) {
                    const x =GLOBAL.index - $('.ui-question-options ').length - 1;
                    KindEditor.instances[x].html(answer);

                }
            }).fillAnswer();
        }, GLOBAL.delay*1.5);
    }

    function daLianText() {
        showPanel();
        setTimeout(() => {
            // sleep(3000)
            new WorkerJS({
                root: '.single_excer_item___2lGB8',
                elements: {
                    question: '.title_content___24J6D .title_content_text___8ruL4',
                    options: '.options_content___2YgyG label .option_text___1mfcu',//文字的选项列表
                    $options: '.options_content___2YgyG label input',//绑定的事件的 dom列表
                    type: '.title_content___24J6D span:eq(1)'
                }
            }, (obj) => {
                if (obj.type === 3) {
                    obj.options = ['正确', '错误'];
                }
                return obj
            }, (type, answer, $option,items,$options) => {
                // fill answer
                if (type === 1){
                    for (let index = 0; index < $options.length; index++) {
                        const $item = $options.eq(index);
                        Boolean($.inArray(index,items) + 1) ===  $item.find('input').hasClass('ng-not-empty') || $item.click();

                    }
                }else if (type === 0 || type === 3 ) {
                    $option.click();
                }

                else if (type === 4 || type === 2) {
                    $option.val(answer);
                }
            }).fillAnswer();
        }, GLOBAL.delay*1.5);
    }

    function shangHaiOpen() {
        showPanel();
        setTimeout(() => {
            if (GLOBAL.finish || $('a:contains(已完成批阅)').length === 1){
                iframeMsg('tip', {type: 'hidden', tip: '本页面已做完，无需自动答题'});
                return
            }
            new WorkerJS({
                root: '.e-q',
                elements: {
                    question: '.e-q-q .ErichText',
                    options: '.e-a-g li',
                    $options: '.e-a-g li'
                }
            }, (obj) => {
                obj.type = TYPE[obj.type.parents().find('.e-text').eq(0).text().replace(/[0-9]./,'').replace(/[一-二-三-四-五]./,'').split('：')[0].replace(/\s+/,'')];
                obj.options = obj.options.map(i => {
                    return formatString(i.replaceAll(/[a-zA-z]\)\s+/g, '').replaceAll(/^[a-z]\s+/g, '').replaceAll(/^[a-z]、\s+/g, '').trim())
                });
                return obj
            }, (type, answer, $option) => {
                if (type === 0 || type === 3) {
                    $option.click();
                } else if (type === 1) {
                    if (!$option.attr('class').includes('checked')) {
                        $option.click();
                    }
                }
            }).fillAnswer();
        }, GLOBAL.delay);
    }

    function zheJiangExam() {
        showPanel();
        setTimeout(() => {
            new WorkerJS({
                root: '.dt_tmcon',
                elements: {
                    question: 'div:eq(0) span:eq(1)',
                    options: 'div:eq(1) p',
                    $options: 'div:eq(1) p input'
                }
            }, (obj) => {
                obj.type = TYPE[obj.type.parents().find('.dt_rtitle1').eq(0).text().replace(/[0-9]./,'').replace(/[一-二-三-四-五]./,'').split('(')[0].replace(/\s+/g,'')];
                obj.options = obj.options.map(i => {
                    return formatString(i.replaceAll(/[a-zA-z]\)\s+/g, '').replaceAll(/^[a-z]\s+/g, '').replaceAll(/^[a-z]、\s+/g, '').trim())
                });
                return obj
            },(type, answer, $option,items,$options) => {
                // fill answer
                if (type === 1 || type === 0 || type === 3){
                    for (let index = 0; index < $options.length; index++) {
                        const $item = $options.eq(index);
                        Boolean($.inArray(index,items) + 1) ===  $item.prop("checked") || $item.click();

                    }
                }
            }, (need_jump) => {
                if ($('.page li input:eq(2)').attr('disabled')==="disabled") return false
                // if (ne)
                need_jump && setTimeout(() => {
                    $('.page li input:eq(2)').click();
                }, GLOBAL.time / 3);
                return need_jump
            }).fillAnswer();
        }, GLOBAL.delay);
    }

    function zheJiangOnline() {
        showPanel();
        setTimeout(() => {
            new WorkerJS({
                root: '.questiono-item',
                elements: {
                    question: 'h6 .processing_img',
                    options: '.questiono-main label .el-radio__label,.el-checkbox__label',
                    $options: '.questiono-main label'
                }
            }, (obj) => {
                obj.type = TYPE[obj.type.parent().prev().text().replace(/\s+/g,'').split('(')[0].replace(/[0-9]./,'')];
                obj.options = obj.options.map(i => {
                    return formatString(i.replaceAll(/[a-zA-z]\)\s+/g, '').replaceAll(/^[a-z]\s+/g, '').replaceAll(/^[a-z]、\s+/g, '').trim())
                });
                return obj
            },(type, answer, $option,items,$options) => {
                // fill answer
                if (type === 1 ){
                    for (let index = 0; index < $options.length; index++) {
                        const $item = $options.eq(index);
                        Boolean($.inArray(index,items) + 1) ===  $item.hasClass("is-checked") || $item.click();
                    }
                } else if (type === 0 || type === 3 ) {
                    $option.click();
                }
            }).fillAnswer();
        }, GLOBAL.delay);
    }

    function zheJiangText() {
        showPanel();
        setTimeout(() => {
            new WorkerJS({
                root: '.question_content',
                elements: {
                    question: '.question_title',
                    options: '.question_content .radio_content div',
                    $options: '.question_content  label'
                }
            }, (obj) => {
                obj.type = TYPE[obj.type.parent().find('.question_title p').eq(0).text().replace(/[0-9]./,'').trim()];
                obj.options = obj.options.map(i => {
                    return formatString(i.replaceAll(/[a-zA-z]\)\s+/g, '').replaceAll(/^[a-z]\s+/g, '').replaceAll(/^[a-z]、\s+/g, '').trim())
                });
                return obj
            },(type, answer, $option,items,$options) => {
                // fill answer
                if (type === 1 ){
                    for (let index = 0; index < $options.length; index++) {
                        const $item = $options.eq(index);
                        Boolean($.inArray(index,items) + 1) ===  $item.hasClass("is-checked") || $item.click();
                    }
                } else if (type === 0 || type === 3 ) {
                    $option.click();
                }
            }, (auto_jump) => {
                if ($('.question_btn .el-button:contains(下一题)').hasClass('is-disabled')) return false
                $('.el-button:contains(下一题)').click();
                return true
            }).fillAnswer();
        }, GLOBAL.delay);
    }

    function qingShuText() {
        showPanel();
        setTimeout(() => {
            // sleep(3000)
            new WorkerJS({
                root: '.question-detail-container',
                elements: {
                    question: '.question-detail-description  span',
                    options: '.question-detail-options label .option-description',//文字的选项列表
                    $options: '.question-detail-options div input,.question-detail-solution-textarea',//绑定的事件的 dom列表
                    type: '.question-detail-type .question-header-left span'
                }
            }, (obj) => {
                obj.options = obj.options.map(i => {
                    return i.replace(/\([A-Za-z]\)/, '').trim()
                });
                return obj
            }, (type, answer, $option, items, $options) => {
                // fill answer
                if (type === 1) {
                    for (let index = 0; index < $options.length; index++) {
                        const $item = $options.eq(index);
                        Boolean($.inArray(index, items) + 1) === $item.prop("checked") || $item.click();

                    }
                } else if (type === 0 || type === 3) {
                    $option.click();
                }else if (type === 4 || type ===2){
                    $option.parents().find('.question-controller-wrapper .next').click();
                }
            }).fillAnswer();
        }, GLOBAL.delay * 1.5);
    }


    function qingShuExam() {
        showPanel();
        setTimeout(() => {
            new WorkerJS({
                root: '.paper-container .question-detail-container',
                elements: {
                    question: '.question-detail-description .detail-description-content',
                    options: '.question-detail-options label .option-description',//文字的选项列表
                    $options: '.question-detail-options label input',//绑定的事件的 dom列表
                    type: '.question-detail-type .question-detail-type-desc'
                }
            }, (obj) => {
                if (obj.type === 3) {
                    obj.options = ['正确', '错误'];
                }
                return obj
            }, (type, answer, $option, items, $options) => {
                // fill answer
                if (type === 1) {
                    for (let index = 0; index < $options.length; index++) {
                        const $item = $options.eq(index);
                        Boolean($.inArray(index, items) + 1) === $item.prop("checked") || $item.click();
                    }
                } else if (type === 0 || type === 3) {
                    $option.click();
                } else ;
            }).fillAnswer();
        }, GLOBAL.delay);
    }

    function youXueWork() {
        showPanel();
        setTimeout(() => {
            new WorkerJS({
                root: '.multiple-choices,.judge',
                elements: {
                    question: 'h5 .position-rltv span:last-child',
                    options: 'ul label span:last-child',
                    $options: 'ul label input,.radios .radio input',
                    type:"h5 .typeName"
                }
            }, async (obj) => {
                obj.options = obj.options.map(i => {
                    return formatString(i.replaceAll(/[a-zA-z]\)\s+/g, '').replaceAll(/^[a-z]\s+/g, '').replaceAll(/^[a-z]、\s+/g, '').trim())
                });
                return obj
            },(type, answer, $option,items,$options) => {
                // fill answer
                if (type === 1 ){
                    for (let index = 0; index < $options.length; index++) {
                        const $item = $options.eq(index);
                        Boolean($.inArray(index,items) + 1) ===  $item.prev().hasClass("checkbox-checked") || $item.click();
                    }
                }else if (type === 0 || type === 3){
                    $option.click();
                    if ($option.attr('checked') === 'checked'){
                        $option.click();
                    }
                }
            }).fillAnswer();
        }, GLOBAL.delay);
    }



    function youXueText() {
        showPanel();
        setTimeout(() => {
            new WorkerJS({
                root: '.split-screen-wrapper',
                elements: {
                    question: '.question-title-scroller .question-title-html',
                    options: '.choice-list .content-wrapper .text',
                    $options: '.choice-list .checkbox ,.question-body-wrapper .choice-btn',
                    type:".question-title-scroller .question-type-tag"
                }
            }, (obj) => {
                obj.options = obj.options.map(i => {
                    return formatString(i.replaceAll(/[a-zA-z]\)\s+/g, '').replaceAll(/^[a-z]\s+/g, '').replaceAll(/^[a-z]、\s+/g, '').trim())
                });
                return obj
            },(type, answer, $option,items,$options) => {
                // fill answer
                if (type === 1 || type === 0 || type === 3){
                    for (let index = 0; index < $options.length; index++) {
                        const $item = $options.eq(index);
                        Boolean($.inArray(index,items) + 1) ===  $item.hasClass("selected") || $item.click();

                    }
                }
            }).fillAnswer();
        }, GLOBAL.delay);
    }


    function youXueExam() {
        showPanel();
        setTimeout(() => {
            new WorkerJS({
                root: '.question-area .question-item',
                elements: {
                    question: '.base-question .title .rich-text',
                    options: '.choice-list label .rich-text',
                    $options: '.choice-list  label, .iconfont',
                    type:".base-question .title .tip"
                }
            }, async (obj) => {
                if (obj.type === 3){
                    obj.options = ["正确","错误"];
                }
                obj.options = obj.options.map(i => {
                    return formatString(i.replaceAll(/[a-zA-z]\)\s+/g, '').replaceAll(/^[a-z]\s+/g, '').replaceAll(/^[a-z]、\s+/g, '').trim())
                });
                if (obj.type === 1) {
                    for (let val of obj.$options) {
                        $(val).hasClass('is-checked') && $(val).click();
                        await sleep(500);
                    }
                }
                return obj
            },(type, answer, $option) => {
                if (type === 0 || type === 3 || type === 1) {
                    $option.click();
                    // $('.el-button:contains(下一题)').click()
                }
            },()=>{
                if ($('.next-part:contains(下个部分)').length) {
                    //如果有下一页
                    $('.next-part').click();
                    return true
                }else {
                    return false
                }

            }).fillAnswer();
        }, GLOBAL.delay);
    }

    function moNiExam() {
        showPanel();
        setTimeout(() => {
            // sleep(3000)
            new WorkerJS({
                root: '.lineClass .b-papp-root',
                elements: {
                    question: '.b-exam-top  .b-exam-tit',
                    options: '.b-exam-box li label',//文字的选项列表
                    $options: '.b-exam-box li  input',//绑定的事件的 dom列表
                    type:'.b-exam-top .b-exam-type'
                }
            }, (obj) => {
                obj.options = obj.options.map(i=>{
                    console.log(i);
                    return i.replace(/[A-Za-z][\：]/,'').replace(/[A-Za-z][\：,\:]/,'').replace(/\；/,'').trim()
                });
                return obj
            }, (type, answer, $option,items,$options) => {
                // fill answer
                if (type === 1 ){
                    for (let index = 0; index < $options.length; index++) {
                        const $item = $options.eq(index);
                        Boolean($.inArray(index,items) + 1) ===  $item.prop("checked") || $item.click();

                    }
                }else if (type === 0 || type === 3){
                    $option.click();
                }
            }).fillAnswer();
        }, GLOBAL.delay*1.5);
    }

    function fuJianText() {
        showPanel();
        setTimeout(() => {
            // sleep(3000)
            new WorkerJS({
                root: '.topic-cont',
                elements: {
                    question: '.text',
                    options: '.options li span',//文字的选项列表
                    $options: '.options li',//绑定的事件的 dom列表
                }
            }, (obj) => {
                obj.options = obj.options.map(i=>{
                    console.log(i);
                    return i.replace(/选项[A-Za-z]/,'').trim()
                });
                if (obj.type.attr('itemtype')==1){
                    obj.type = 0;
                }else if (obj.type.attr('itemtype')==2){
                    obj.type = 1;
                }else if (obj.type.attr('itemtype')==3){
                    obj.type = 3;
                }
                console.log(obj);
                return obj
            }, (type, answer, $option,items,$options) => {
                // fill answer
                if (type === 1 || type === 0 || type === 3){
                    for (let index = 0; index < $options.length; index++) {
                        const $item = $options.eq(index);
                        Boolean($.inArray(index,items) + 1) ===  $item.hasClass('correct') || $item.click();

                    }
                }

                // else if (type === 4 || type === 2) {
                //     $option.val(answer)
                // }
            }).fillAnswer();
        }, GLOBAL.delay*1.5);
    }

    function huNanWork() {
        showPanel();
        setTimeout(() => {
            // sleep(3000)
            new WorkerJS({
                root: '.exam_question',
                elements: {
                    question: '.exam_question_title  div',
                    options: '.question_select  .select_detail',//文字的选项列表
                    $options: '.question_select li',//绑定的事件的 dom列表
                    type:'.exam_question_title div strong'
                }
            }, (obj) => {
                return obj
            }, (type, answer, $option,items,$options) => {
                // fill answer
                if (type === 1){
                    for (let index = 0; index < $options.length; index++) {
                        const $item = $options.eq(index);
                        Boolean($.inArray(index,items) + 1) ===  $item.hasClass('cur') || $item.click();

                    }
                }else if (type === 0 || type === 3 ) {
                    $option.click();
                }

                else if (type === 4 || type === 2 || type === 6) {
                    console.log("自行填充");

                }
            }).fillAnswer();
        }, GLOBAL.delay*1.5);
    }

    function wanXueText() {
        showPanel();
        setTimeout(() => {
            // sleep(3000)
            new WorkerJS({
                root: '.question',
                elements: {
                    question: 'tr .nm2',
                    options: '.grey td p',//文字的选项列表
                    $options: '.option li label',//绑定的事件的 dom列表
                    type: 'tr .nm2'
                }
            }, (obj) => {
                obj.question = obj.question.parent().find('td p').text();
                // obj.type = obj.type.parent().find('.tc')
                return obj
            }, (type, answer, $option) => {
                // fill answer
                if (type === 0 || type === 3 || type === 1) {
                    $option.click();
                    // $('.el-button:contains(下一题)').click()
                }
            }).fillAnswer();
        }, GLOBAL.delay * 1.5);
    }

    function wenJuanAutoFill() {
        showPanel();
        setTimeout(() => {
            new WorkerJS({
                root: 'questionContent',
                elements: {
                    question: '.title',
                    options: '.icheckbox_div .option_label',
                    $options: '.icheckbox_div label',
                    type:'.question_num'

                }
            }, (obj) => {
                console.log(obj);
                return obj
            }, (type, answer, $option) => {
                if (type === 0 || type === 3) {
                    $option.click();
                } else if (type === 1) {
                    if (!$option.attr('class').includes('checked')) {
                        $option.click();
                    }
                }
            }).fillAnswer();
        }, GLOBAL.delay);
    }

    function xueQiExam() {
        showPanel();
        setTimeout(() => {
            // sleep(3000)
            new WorkerJS({
                root: '.queItemClass',
                elements: {
                    question: 'dt .din:eq(1)',
                    options: '.clearfix div',//文字的选项列表
                    $options: '.clearfix .xuan,input',//绑定的事件的 dom列表
                }
            }, (obj) => {
                obj.type = TYPE[obj.type.parent().find('div .fb:eq(0)').text().replace(/[一-二-三-四-五]./,'')];
                if (obj.type === 3) {
                    obj.options = ['正确', '错误'];
                }
                return obj
            }, (type, answer, $option,items,$options) => {
                if (type === 1){
                    for (let index = 0; index < $options.length; index++) {
                        const $item = $options.eq(index);
                        // console.log(Boolean($.inArray(index,items) + 1) ===  $item.hasClass('is-checked'))
                        console.log(index,JSON.stringify(items));
                        Boolean($.inArray(index,items) + 1) ===  $item.parent().hasClass('cur') || $item.click();

                    }
                } else if (type === 0 || type === 3 ) {
                    $option.click();

                }else ;

            }).fillAnswer();
        }, GLOBAL.delay);
    }

    function yiBanExam() {
        // let map = {
        //     "ulWbkFGQj92b51lIwIyW":["0"],//D
        //     "ulWbkFGQj92b51lIxIyW":["1"],//A
        //     "ulWbkFGQj92b51lIyIyW":["2"],//B
        //     "ulWbkFGQj92b51lIzIyW":["3"],//C
        //     "==gbp1GZhB0Yv9WedJCNiwiIzICLiIjIsISMiwiIwIyW":["1", "2", "4", "3", "0"],
        //     "==gbp1GZhB0Yv9WedJSNiwiI0ICLiMjIsISMiwiIwIyW":["1", "3", "4", "5", "0"],
        //     "ulWbkFGQj92b51lI0ICLiMjIsISMiwiIwIyW":["1", "3", "4", "0"],
        //     "ulWbkFGQj92b51lIzICLiIjIsISMiwiIwIyW":["1", "2", "3", "0"],
        //     "ulWbkFGQj92b51lI1ICLiMjIsIiMiwiIwIyW":["2","3","4","5"],
        //     "=4WatRWYAN2bvlXXiMjIsIiMiwiIxIyW":["1", "2", "3"],
        //     "=4WatRWYAN2bvlXXiIjIsISMiwiIwIyW":["2", "1", "0"],
        //     "=4WatRWYAN2bvlXXiMjIsISMiwiIwIyW":["0", "3", "1"],
        //     "=4WatRWYAN2bvlXXiMjIsIiMiwiIwIyW":["2", "3", "0"],
        //     "==gbp1GZhB0Yv9WedJyMiwiIyIyW":["2","3"],
        //     "==gbp1GZhB0Yv9WedJiMiwiIxIyW":["1","2"],
        //     "==gbp1GZhB0Yv9WedJSMiwiIwIyW":["1","0"],
        //     "==gbp1GZhB0Yv9WedJyMiwiIxIyW":["1","3"],
        //     "==gbp1GZhB0Yv9WedJiMiwiIwIyW":["2","0"],
        //     "==gbp1GZhB0Yv9WedJyMiwiIwIyW":["3","0"],
        // }
        let map = {
        }
        let subjectarr ={}
        let start = false;
        let unanswer = [];
        let fillAnswer = function(){
            let strs = undefined;
            strs = prompt("请输入问题JSON：");
            // subjectarr = JSON.parse(prompt("请输入题库JSON："));
            subjectarr = {"61181391":["0","1","2","3","4"],"61181423":["1","2"],"61181394":["1","2"],"61181412":["0","1"],"61181415":["0","2"],"61181424":["0","2"],"61181417":["0","2","3"],"61181398":["0","1","2"],"61181419":["0","3"],"61181425":["1","2","3"],"61181392":["0","1","3","4","5"],"61181430":["1","2","3"],"61181421":["1","2","3"],"61181399":["0","1","2","3","4"],"61181401":["0","2","3"],"61181416":["0","2","3"],"61181396":["0","1","3","4"],"61181269":["1"],"61181272":["3"],"61181273":["2"],"61181274":["2"],"61181277":["1"],"61181280":["0"],"61181281":["1"],"61181282":["0"],"61181283":["3"],"61181285":["2"],"61181286":["1"],"61181289":["1"],"61181291":["2"],"61181292":["0"],"61181293":["2"],"61181294":["3"],"61181295":["1"],"61181300":["1"],"61181303":["3"],"61181304":["2"],"61181307":["0"],"61181312":["1"],"61181313":["3"],"61181316":["3"],"61181319":["1"],"61181321":["2"],"61181324":["1"],"61181325":["1"],"61181328":["3"],"61181329":["1"],"61181330":["0"],"61181331":["1"],"61181334":["1"],"61181337":["2"],"61181349":["0"],"61181350":["2"],"61181351":["1"],"61181353":["0"],"61181354":["3"],"61181357":["0"],"61181359":["2"],"61181361":["1"],"61181363":["2"],"61181364":["0"],"61181366":["1"],"61181367":["2"],"61181369":["3"],"61181370":["0"],"61181372":["0","1","2","3"],"61181374":["0","1","2","3"],"61181375":["0","1","2"],"61181376":["0","1","2"],"61181378":["0","1","2"],"61181380":["0","1","3"],"61181381":["0","1","2","3"],"61181383":["0","1","3"],"61181384":["0","1","2"],"61181385":["0","1","3"],"61181386":["0","1","3"],"61181388":["0","1","2","3"],"61181389":["0","1","2","3","4"],"61181390":["2","3","4","5"],"61181393":["0","1","3","4"],"61181395":["0","1","2","3"],"61181397":["0","1","2","3"],"61181403":["0","1","2","3"],"61181404":["0","1","3"],"61181405":["0","2","3"],"61181409":["0","1","2","3"],"61181411":["0","1","2"],"61181413":["0","3"],"61181414":["0","1","3"],"61181422":["1","3"],"61181426":["0","1","2"],"61181428":["0","1","2"],"61181429":["0","1","2","3"],"61181431":["0"],"61181432":["1"],"61181435":["0"],"61181438":["1"],"61181439":["0"],"61181441":["1"],"61181442":["0"],"61181443":["0"],"61181445":["1"],"61181448":["1"],"61181453":["1"],"61181454":["1"],"61181456":["1"],"61181457":["0"],"61181459":["0"],"61181461":["1"],"61181462":["0"],"61181463":["1"],"61181465":["0"],"61181466":["0"],"61181468":["1"],"61181471":["1"],"61181475":["0"],"61181476":["1"]}
            if(strs&&!start){
                start = true;
                let str = JSON.parse(strs);
                //先用小题库匹配答案
                [...str[2].subjects].forEach((item)=>{
                    let options = subjectarr[item.subjectId]
                    if( !options ) { unanswer.push(item.subjectId) }
                    if(!map[item.answer]) map[item.answer] = options;
                });
                [...str[0].subjects].forEach((item)=>{
                    let options =  subjectarr[item.subjectId]
                    if( !options ) { unanswer.push(item.subjectId) }
                    if(!map[item.answer]) map[item.answer] = options;
                });
                [...str[1].subjects].forEach((item)=>{
                    let options = subjectarr[item.subjectId]
                    if( !options ) { unanswer.push(item.subjectId) }
                    if(!map[item.answer]) map[item.answer] = options;
                });
                //#######################
                [...str[0].subjects].forEach((item)=>{
                    let options = map[item.answer];
                    // let options = subjectarr[item.subjectId]
                    // if( !options ) { unanswer.push(item.subjectId) }
                    options?.forEach((option)=>{
                        let element = $(".mb ul li")
                        if(element.length == 3) {
                            element.eq(option==0 ? option = 2 :option-1).click();
                        } 
                        if(element.length ==2){
                            element.eq(option).click();
                        } 
                        if(element.length >=4 ){
                            element.eq(option==0?option=3:option-1).click();
                        }
                    })
                    $('.round:contains("下一题")').click();
                });
                [...str[1].subjects].forEach((item)=>{
                    let options = map[item.answer];
                    // let options = subjectarr[item.subjectId]
                    // if( !options ) { unanswer.push(item.subjectId) }
                    let element = $(".mb ul li")
                    options?.forEach((option)=>{
                        if(element.length == 3) {
                            element.eq(option==0 ? option = 2 :option-1).click();
                        } 
                        if(element.length ==2){
                            element.eq(option).click();
                        } 
                        if(element.length >=4 ){
                            if(option=="1"){element.eq(0).click();}
                            if(option=="2"){element.eq(1).click();}
                            if(option=="3"){element.eq(2).click();}
                            if(option=="0"){element.eq(3).click();}
                            if(option=="4"){element.eq(4).click();}
                            if(option=="5"){element.eq(5).click();}
                        }
                        
                    })
                    $('.round:contains("下一题")').click();
                });
                [...str[2].subjects].forEach((item)=>{
                    let options = map[item.answer];
                    // let options = subjectarr[item.subjectId]
                    // if( !options ) { unanswer.push(item.subjectId) }
                    options?.forEach((option)=>{
                        $(".mb ul li").eq(option).click();
                    })
                    $('.round:contains("下一题")').click();
                });
                console.log(unanswer);
            } else {
                setTimeout(fillAnswer,2000);
            }
            
        }

        showPanel();
        setTimeout(() => {
            let ybWork = new WorkerJS({
                root: 'main',
                elements: {
                    question: 'h3 div',
                    options: '.mb ul li .flex-auto',//文字的选项列表
                    $options: '.mb ul li',//绑定的事件的 dom列表
                    type:'.mb-s'
                }
            }, (obj) => {
                if (obj.type === 3){
                    obj.options = ['正确', '错误'];
                }
                return obj
            }, (type, answer, $option,items,$options) => {
                if (type === 1){
                    for (let index = 0; index < $options.length; index++) {
                        const $item = $options.eq(index);
                        // console.log(Boolean($.inArray(index,items) + 1) ===  $item.hasClass('is-checked'))
                        console.log(index,JSON.stringify(items));
                        Boolean($.inArray(index,items) + 1) ===  $item.hasClass('_c') || $item.click();

                    }
                } else if (type === 0 || type === 3 ) {
                    $option.click();

                }else ;

            }, (auto_jump) => {
                if ($('.round:contains("下一题")').hasClass('ghost')) return false
                $('.round:contains("下一题")').click();
                return true
            });
            fillAnswer();
            //ybWork.fillAnswer();

        }, GLOBAL.delay);
    }

    function yinghuaText() {
        showPanel();
        setTimeout(() => {
            new WorkerJS({
                root: '.courseexamcon-main',
                elements: {
                    question: '.name',
                    options: '.list li .txt',//文字的选项列表
                    $options: '.list li .exam-inp',//绑定的事件的 dom列表
                    type:'.type'
                }
            }, (obj) => {
                if (obj.type === 3){
                    obj.options = ['正确', '错误'];
                }
                return obj
            }, (type, answer, $option,items,$options) => {
                if (type === 1){
                    for (let index = 0; index < $options.length; index++) {
                        const $item = $options.eq(index);
                        // console.log(Boolean($.inArray(index,items) + 1) ===  $item.hasClass('is-checked'))
                        console.log(index,JSON.stringify(items));
                        Boolean($.inArray(index,items) + 1) ===  $item.prop("checked") || $item.click();

                    }
                } else if (type === 0 || type === 3 ) {
                    $option.click();

                }else ;

            }, (auto_jump) => {
                if ($('.next_exam').eq(3).prop('style')[0] == 'display' ) return false
                $('.next_exam').click();
                return true
            }).fillAnswer();
        }, GLOBAL.delay);
    }


    function yinghuaEaxe() {
        showPanel();
        setTimeout(() => {
            new WorkerJS({
                root: '.courseexamcon-main',
                elements: {
                    question: '.name',
                    options: '.list li .txt',//文字的选项列表
                    $options: '.list li .exam-inp',//绑定的事件的 dom列表
                    type:'.type'
                }
            }, (obj) => {
                if (obj.type === 3){
                    obj.options = ['正确', '错误'];
                }
                return obj
            }, (type, answer, $option,items,$options) => {
                if (type === 1){
                    for (let index = 0; index < $options.length; index++) {
                        const $item = $options.eq(index);
                        // console.log(Boolean($.inArray(index,items) + 1) ===  $item.hasClass('is-checked'))
                        console.log(index,JSON.stringify(items));
                        Boolean($.inArray(index,items) + 1) ===  $item.prop("checked") || $item.click();

                    }
                } else if (type === 0 || type === 3 ) {
                    $option.click();

                }else ;

            }, (auto_jump) => {
                if ($('.next_exam').eq(3).prop('style')[0] == 'display' ) return false
                $('.next_exam').click();
            }).fillAnswer();
        }, GLOBAL.delay);
    }

    function wenJuanExam() {
        showPanel();
        setTimeout(() => {
            new WorkerJS({
                root: '.g-mn',
                elements: {
                    question: '.m-question .tigan',
                    options: '.question-block .xuanxiang',//文字的选项列表
                    $options: '.question-block .xuanxiang',//绑定的事件的 dom列表
                    type:'.tixing'
                }
            }, (obj) => {
                if ($('.layui-layer-content').length) {
                    console.log('我到这了', GLOBAL.loop);
                    iframeMsg('tip', {type: 'stop', tip: '答题暂停，请自行通过验证'});
                    GLOBAL.stop = true;
                    return undefined
                }
                return obj
            }, (type, answer, $option,items,$options) => {
                if (type === 1){
                    for (let index = 0; index < $options.length; index++) {
                        const $item = $options.eq(index);
                        // console.log(Boolean($.inArray(index,items) + 1) ===  $item.hasClass('is-checked'))
                        console.log(index,JSON.stringify(items));
                        Boolean($.inArray(index,items) + 1) ===  $item.parent().find('.icheckbox_square-green').hasClass('checked') || $item.click();
                }
                    if ($option.parent().find('.icheckbox_square-green').hasClass('checked')){
                        $('.u-btn-next:contains("下一题")').click();
                    }else {
                        $('.u-btn-next:contains("下一题")').click();
                    }
                } else if (type === 0 || type === 3 ) {
                    if ($option.parent().find('.iradio_square-green').hasClass('checked')){
                        $('.u-btn-next:contains("下一题")').click();
                    }else {
                        $option.click();
                    }


                }else if (type === 4 || type === 2) ;else if (type === undefined){
                    $('.u-btn-next:contains("下一题")').click();
                }

            }, (auto_jump) => {
                return true
            }).fillAnswer();
        }, GLOBAL.delay);
    }

    function xiaMenText() {
        showPanel();
        setTimeout(() => {
            // sleep(3000)
            new WorkerJS({
                root: 'td:contains(\'分)\')',
                elements: {
                    question: 'td:contains(\'分)\')',
                    options: '.optionUl label .el-radio__label,.el-checkbox__label',//文字的选项列表
                    $options: '.optionUl label',//绑定的事件的 dom列表
                }
            }, (obj) => {
                obj.question = obj.type;
                obj.options =obj.question.parent().next().find('tbody tbody td:last-child').map((i,y)=>{ return $(y).text() });
                obj.type = 0;
                obj.$options = obj.question.parent().next().find('tbody tbody input:last-child').map((i,y)=>{ return y });
                obj.question = $(obj.question).text();
                console.log(obj);
                return obj
            }, (type, answer, $option,items,$options) => {
                 if (type === 0 || type === 3 ) {
                    $option.click();

                }

            }).fillAnswer();
        }, GLOBAL.delay);
    }

    function guangKaiText() {
        showPanel();
        setTimeout(() => {
            // sleep(3000)
            new WorkerJS({
                root: '.formulation',
                elements: {
                    question: '.qtext',
                    options: '.answer div label',//文字的选项列表
                    $options: '.answer div label',//绑定的事件的 dom列表
                }
            }, (obj) => {
                if (obj.type.find('.answer div label').length===2 ){
                    obj.type = 3;
                }else if (obj.type.find('.answer div label').length >=4 && obj.type.find('.answer input').eq(-1).attr('type')==='checkbox'){
                    obj.type = 1;
                }else if (obj.type.find('.answer div label').length >= 4 && obj.type.find('.answer input').eq(-1).attr('type')==='radio'){
                    obj.type = 0;
                }
                obj.options = obj.options.map(i => {
                    return formatString(i.trim())
                });
                return obj
            }, (type, answer, $option, items, $options) => {
                // defaultClick($options, items, $item.hasClass('onChecked'))
                if (type === 1 ){
                    for (let index = 0; index < $options.length; index++) {
                        const $item = $options.eq(index);
                        Boolean($.inArray(index,items) + 1) ===  $item.parent().find('input').eq(-1).prop('checked') || $item.click();
                    }
                }else if (type === 3 || type === 0) {
                    $option.click();
                }

            },()=>{
                setTimeout(() => {
                    $('.submitbtns .btn-primary').click();
                }, GLOBAL.time / 5);

            }).fillAnswer();
        }, GLOBAL.delay * 1.5);
    }

    function danweiExam() {
        hookJSON();
        showPanel();
        setTimeout(() => {
            // sleep(3000)
            new WorkerJS({
                    root: '.tm',
                    elements: {
                        question: '.tmnrbj span:last-child',
                        options: '.van-radio-group .dxt .van-radio__label,.van-checkbox__label',//文字的选项列表
                        $options: '.van-radio-group .dxt .van-radio__label,.van-checkbox__label,.van-field__control',//绑定的事件的 dom列表
                        type: '.tmnrbj span'
                    }
                }, async (obj) => {


                    obj.answer = GLOBAL.json[jQuery('.tmnrbj span:last-child').text().match(/^(\d+)、/)[1] - 1].answerKey;
                    obj.question = formatString(obj.question);

                    console.log(GLOBAL.json[GLOBAL.index - 1]);

                    console.log(obj);
                    return obj
                }, (type, answer, $option) => {
                    if (type === 0 || type === 3 || type === 1) {
                        $option.click();
                    }
                }, () => {
                    jQuery('.xyt').click();
                    return true

                }
            ).fillAnswer();
        }, GLOBAL.delay * 1.5);
    }

    function deYangAgaintext() {
        showPanel();
        setTimeout(() => {
            // sleep(3000)
            new WorkerJS({
                root: '#divProblemArea',
                elements: {
                    question: '#ulProblems li:first',
                    options: '#ulProblems .answer',//文字的选项列表
                    $options: '#ulProblems .answer input',//绑定的事件的 dom列表
                }
            }, (obj) => {
                if ($('#ulProblems .answer input').length < 3 && $('#ulProblems .answer input').eq(0).attr('type') === 'radio') {
                    obj.type = 3;
                    obj.options = ['正确', '错误'];
                }else if ($('#ulProblems .answer input').length > 2 && $('#ulProblems .answer input').eq(0).attr('type') === 'radio'){
                    obj.type = 0;
                }else if ($('#ulProblems .answer input').length > 2 && $('#ulProblems .answer input').eq(0).attr('type') === 'checkbox'){
                    obj.type = 1;
                }
                return obj
            }, (type, answer, $option,items,$options) => {
                // fill answer
                if (type === 1){
                    for (let index = 0; index < $options.length; index++) {
                        const $item = $options.eq(index);
                        Boolean($.inArray(index,items) + 1) ===  $item.prop('checked') || $item.click();
                    }
                }else if (type === 0 || type === 3 ) {
                    $option.click();
                }
                else ;
            },()=>{
                if ($('.dlg').length) return false
                $('#divBtns input:eq(1)').click();
                return true
            }).fillAnswer();
        }, GLOBAL.delay);
    }

    function ziBoText() {
        showPanel();
        setTimeout(() => {
            new WorkerJS({
                root: '.header-left .trueorfalse .sub',
                elements: {
                    question: '.mb10',
                    options: '.options li',
                    $options: '.options li'
                }
            }, (obj) => {
                obj.type = TYPE[obj.type.parent().prev().text().split('：')[0].trim()];
                obj.options = obj.options.map(i => {
                    return formatString(i.replaceAll(/[a-zA-z]\)\s+/g, '').replaceAll(/^[a-z]\s+/g, '').replaceAll(/^[a-z]、\s+/g, '').trim())
                });
                return obj
            },(type, answer, $option,items,$options) => {
                // fill answer
                if (type === 1 ){
                    for (let index = 0; index < $options.length; index++) {
                        const $item = $options.eq(index);
                        Boolean($.inArray(index,items) + 1) ===  $item.hasClass("active") || $item.click();
                    }
                } else if (type === 0 || type === 3 ) {
                    $option.click();
                }
            }).fillAnswer();
        }, GLOBAL.delay);
    }

    function heBeiExam() {
        showPanel();
        setTimeout(() => {
            // sleep(3000)
            new WorkerJS({
                root: '.examItem',
                elements: {
                    question: '.examItemRight  .question',
                    options: '.examItemRight  ul li span',//文字的选项列表
                    $options: '.examItemRight  ul li',//绑定的事件的 dom列表
                }
            }, (obj) => {
                obj.type = TYPE[obj.type.parent().find('.questTitle b').text()];
                return obj
            }, (type, answer, $option,items,$options) => {
                // fill answer
                if (type === 1){
                    for (let index = 0; index < $options.length; index++) {
                        const $item = $options.eq(index);
                        Boolean($.inArray(index,items) + 1) ===  $item.hasClass('cur') || $item.click();

                    }
                }else if (type === 0 || type === 3 ) {
                    $option.click();
                }

                else if (type === 4 || type === 2 || type === 6) {
                    console.log("自行填充");

                }
            }).fillAnswer();
        }, GLOBAL.delay*1.5);
    }

    function boJiaoExam() {
        showPanel();
        setTimeout(() => {
            // sleep(3000)
            new WorkerJS({
                root: '.stem-container',
                elements: {
                    question: '.stem  span',
                    options: '.option div .optStem',//文字的选项列表
                    $options: '.option div input',//绑定的事件的 dom列表
                }
            }, (obj) => {

                obj.type = TYPE[obj.type.parent().parent().find('.description').text().split(' ')[1]];
                if (obj.type === 3){
                    obj.options = ['正确','错误'];
                }
                return obj
            }, (type, answer, $option,items,$options) => {
                // fill answer
                 if (type === 1 || type === 0 || type === 3 ) {
                    $option.click();
                }

                else if (type === 4 || type === 2 || type === 6) {
                    console.log("自行填充");

                }
            }).fillAnswer();
        }, GLOBAL.delay*1.5);
    }

    function baoDingExam() {
        showPanel();
        setTimeout(() => {
            // sleep(3000)
            new WorkerJS({
                root: '.item_li',
                elements: {
                    question: '.item_title',
                    options: 'ul li label',//文字的选项列表
                    $options: 'ul li input',//绑定的事件的 dom列表
                }
            }, (obj) => {


                if (obj.$options.length === 2 ){
                    obj.type = 3;
                }else if (obj.$options.length > 2 && obj.$options.eq(0).attr('type') === 'radio'){
                    obj.type = 0;
                }else if (obj.$options.length > 2 && obj.$options.eq(0).attr('type') != 'radio'){
                    obj.type = 1;
                }
                console.log(obj);
                return obj
            }, (type, answer, $option,items,$options) => {
                // fill answer
                if (type === 1 || type === 0 || type === 3 ) {
                    $option.click();
                }

                else if (type === 4 || type === 2 || type === 6) {
                    console.log("自行填充");

                }
            }).fillAnswer();
        }, GLOBAL.delay*1.5);
    }

    function jinPaiExam() {
        showPanel();
        setTimeout(() => {
            // sleep(3000)
            new WorkerJS({
                root: '.test-type-box ul .white-bg',
                elements: {
                    question: '.position-relative h3',
                    options: '.test-option label p:last-child',//文字的选项列表
                    $options: '.test-option label input',//绑定的事件的 dom列表
                }
            }, (obj) => {
                obj.question = obj.question.replace(/题目\d+\:/,'').trim().replace(/^\d+./, '');
                obj.type =TYPE[obj.type.parent().parent().find('.test-type-tips').text().replace(/[一-二-三-四-五]./,'').replace(/\（.*?\）/g,'')];
                if (obj.$options.length > 2 && obj.$options.eq(0).hasClass('radiobox')){
                    obj.type = 0;
                }
                console.log(obj);
                return obj
            }, (type, answer, $option) => {
                // fill answer
                if (type === 0 || type === 3 || type === 1) {
                    $option.click();
                }
                $('.answer-sheet li').eq(GLOBAL.index).click();

            }).fillAnswer();
        }, GLOBAL.delay * 1.5);
    }

    function tangShanExam() {
        showPanel();
        setTimeout(() => {
           new WorkerJS({
                root: '.ui-question-group .ui-question',
                elements: {
                    question: '.ui-question-title .ui-question-content-wrapper',
                    options: '.ui-question-options .ui-question-content-wrapper',//文字的选项列表
                    $options: '.ui-question-options .ui-question-options-order',//绑定的事件的 dom列表
                }
            }, (obj) => {
               obj.type = TYPE[obj.type.parent().find('h2').text().replace(/[0-9]./,'').trim()];
               console.log(obj);
                return obj
            }, (type, answer, $option,items,$options) => {
                // fill answer
                 if (type === 0 || type === 3 || type === 1) {
                    $option.click();
                }

                else if (type === 4 || type === 2) {
                    $option.val(answer);
                }
            }).fillAnswer();
        }, GLOBAL.delay);
    }

    function dianMoExam() {
        showPanel();
        setTimeout(() => {
            // sleep(3000)
            new WorkerJS({
                root: '#question div div:first',
                elements: {
                    question: 'div:first',
                    options: 'div:first ~ div',//文字的选项列表
                    $options: 'div:first ~ div input',//绑定的事件的 dom列表
                }
            }, (obj) => {
                obj.type =TYPE[$('.alert #groupNameSpan').text()];
                console.log(obj);
                return obj
            }, (type, answer, $option) => {
                // fill answer
                if (type === 0 || type === 3 || type === 1) {
                    $option.click();
                }
            },()=>{
                $('.w-100 .btn-light:eq(1)').click();
                return true
            }).fillAnswer();
        }, GLOBAL.delay);
    }

    function dianMoText() {
        showPanel();
        setTimeout(() => {
            // sleep(3000)
            new WorkerJS({
                root: '.question',
                elements: {
                    question: ' div div:first div:first',
                    options: ' div div:first div:first ~ div',//文字的选项列表
                    $options: ' div div:first div:first ~ div input',//绑定的事件的 dom列表
                }
            }, (obj) => {
                obj.type =TYPE[$('h3').text().replace(/[一-二-三-四-五]./,'').trim()];
                obj.question = obj.question.replace(/[0-9]./,'');
                console.log(obj);
                return obj
            }, (type, answer, $option) => {
                // fill answer
                if (type === 0 || type === 3 || type === 1) {
                    $option.click();
                }
            }).fillAnswer();
        }, GLOBAL.delay);
    }

    function jingGuanExam() {
        showPanel();
        setTimeout(() => {
            new WorkerJS({
                root: '.wrapper > div',
                elements: {
                    question: '.dx',
                    options: 'p',//文字的选项列表
                    $options: 'p input',//绑定的事件的 dom列表
                }
            }, (obj) => {
                if ($('.wrapper .cl').length >0){
                    obj.question =obj.type.text().replace(/[0-9]、/,'').replace(/\（.*?\）/g,'').trim().split('$')[0].replace(/\(.*?\)/g,'').trim();
                }else {
                    obj.question = obj.question.replace(/[0-9]、/,'').replace(/\（.*?\）/g,'').trim();
                }
                obj.type = TYPE[obj.type.parent().find('h2').text().replace(/[一-二-三-四-五]、/,'').replace(/\（.*?\）/g,'').trim()];
                obj.options = obj.options.map(item=>{
                    return item.replace(/[A-Za-z][\：]/,'').replace(/[A-Za-z][\：,\:]/,'').replace(/\；/,'').trim()
                });
                console.log(obj);
                return obj
            }, (type, answer, $option,items,$options) => {
                // fill answer
                if (type === 0 || type === 3 || type === 1) {
                    $option.click();
                }

                else if (type === 4 || type === 2) {
                    $option.val(answer);
                }
            }).fillAnswer();
        }, GLOBAL.delay);
    }

    function exam2_euibe_com_exam() {
        showPanel();
        setTimeout(() => {
            new WorkerJS({
                root: '.question',
                elements: {
                    question: '.wenti',
                    options: 'li label span',//文字的选项列表
                    $options: 'li label',//绑定的事件的 dom列表
                }
            }, (obj) => {
                obj.type = getQuestionType($('.question_head').text());
                return obj
            }, (type, answer, $option) => {
                // fill answer
                if (type === 0 || type === 3 || type === 1) {
                    $option.click();
                }
            },()=>{
                $('.paginationjs-next').click();
                return true
            }).fillAnswer();
        }, GLOBAL.delay);
    }

    function lzwyedu_jijiaool_com_exam() {
        showPanel();
        setTimeout(() => {
            new WorkerJS({
                root: '.test_item',
                elements: {
                    question: '.test_item_tit',
                    options: '.test_item_theme label .zdh_op_con',//文字的选项列表
                    $options: 'li label input',//绑定的事件的 dom列表
                }
            }, (obj) => {
                obj.question = obj.question.replace(/该题未做$/,'').replace(/^\d+\./,'');
                obj.type = getQuestionType(obj.type.prevAll('.test_item_type:first').text());
                return obj
            }, (type, answer, $option) => {
                if (type === 0 || type === 3 || type === 1) {
                    $option.click();
                }
            }).fillAnswer().then();
        }, GLOBAL.delay);
    }

    var _self = unsafeWindow;
    exports.top = _self;

    try {
        /** 解决兼容性问题 部分浏览器没有replaceAll*/
        String.prototype.replaceAll = function (s1, s2) {
            return this.replace(new RegExp(s1, "gm"), s2);
        };

        window.onload = hookHTML;
        loadAdPng().then(r => {
        });
        while (exports.top !== _self.top) {
            exports.top = exports.top.parent.document ? exports.top.parent : _self.top;
            if (exports.top.location.pathname === '/mycourse/studentstudy') break;
        }
    } catch (err) {
        exports.top = _self;
    }
    var parent = _self === exports.top ? self : _self.parent,
        Ext = _self.Ext || parent.Ext || {},
        UE$1 = _self.UE;


    /**
     * 顶层窗口监听 iframeNode 的参数
     */
    exports.top.addEventListener("message", (event => {
        console.log('监听器的', GLOBAL);
        if (event.data.type === 'jump') {
            GLOBAL.index++;
            iframeMsg('tip', {tip: '准备答第' + (GLOBAL.index + 1) + '题'});
        } else if (event.data.type === 'stop') {
            GLOBAL.stop = event.data.val;
        } else if (event.data.type === 'start_pay') {
            if (event.data.flag) {
                if (String(GM_getValue('token')).length === 10 || String(GM_getValue('token')).length === 11) {
                    iframeMsg('tip', {tip: '已开启请求收费题库,已实时生效'});
                    GM_setValue('start_pay', event.data.flag);
                    iframeMsg('start_pay', true);//真正打开付费题库
                } else {
                    iframeMsg('tip', {tip: '系统检测您的token可能输入有误,请检查'});
                }
            } else {
                iframeMsg('tip', {tip: '已关闭请求收费题库,已实时生效'});
                GM_setValue('start_pay', event.data.flag);
                iframeMsg('start_pay', false);//真正关闭付费题库
            }
        } else if (event.data.type === 'auto_jump') {
            GM_setValue('auto_jump', event.data.flag);
            iframeMsg('tip', {tip: '已' + (event.data.flag ? '开启' : '关闭') + '自动切换,页面刷新后生效'});
        } else if (event.data.type === 'confim') {
            if (event.data.token.length === 10 || event.data.token.length === 11) {
                GM_setValue('token', event.data.token);
                iframeMsg('tip', {tip: '成功设置token,请点击开启付费题库'});
            } else {
                iframeMsg('tip', {tip: '系统检测您的token可能输入有误,请检查'});
            }

        }
    }), false);

    /**
     * 类似于老板键，上箭头隐藏，下箭头显示
     */
    $(document).keydown(function (event) {
        if (event.keyCode === 38) {
            $('#model-id').hide();
        } else if (event.keyCode === 40) {
            $('#model-id').show();
        } else if (event.keyCode === 37) {//永久隐藏答案提示框
            $('#model-id').hide();
            GM_setValue('hide', true);
        } else if (event.keyCode === 39) {//将答案提示框复位到 左上角
            $('#model-id').show();
            GM_setValue('hide', false);
            GM_setValue('pos', '50px,50px');
        } else if (event.keyCode === 83) {//暂停答题
            GLOBAL.stop = true;
            iframeMsg('stop', GLOBAL.stop);
        } else if (event.keyCode === 68) {//继续答题
            GLOBAL.stop = false;
            iframeMsg('stop', GLOBAL.stop);
        }
    });

    setTimeout(() => {
        start();
    }, GLOBAL.time);


    if (location.pathname === '/exam/examflow_index.action') {
        ZjyExam();
    } else if (location.pathname === '/study/directory/dir_course.html') {

        let set = setInterval(() => {
            if ($('.panel_item').length !== 0) {
                clearInterval(set);
                zjyFile();
            }
        }, 1000);

    } else if ((location.pathname === '/exam/test/reVersionTestStartNew' || location.pathname === '/exam-ans/exam/test/reVersionTestStartNew') && location.href.includes('newMooc=true')) {
        chaoxingNewExam(1);
    } else if ((location.pathname === '/exam/test/reVersionTestStartNew' || location.pathname === '/exam-ans/exam/test/reVersionTestStartNew') && !location.href.includes('newMooc=true')) {
        chaoxingOldExam();
    } else if (location.pathname === '/work/doHomeWorkNew') {
        chaoxingQuiz();
    } else if (location.pathname === '/mooc2/exam/preview' || location.pathname === '/exam-ans/mooc2/exam/preview') {
        chaoxingNewExam(0);
    } else if (location.pathname === '/mooc2/work/dowork') {
        chaoxingNewWork();
    } else if (location.pathname === '/study/homework/do.html' || location.pathname === '/study/workExam/testWork/preview.html' || location.pathname === '/study/onlineExam/preview.html' || location.pathname === '/study/workExam/homeWork/preview.html' || location.pathname === '/study/workExam/onlineExam/preview.html') {
        mooc_icve_com_cn();
    } else if (location.pathname === '/stuExamWeb.html' && location.href.includes('/webExamList/dohomework/')) {
        console.log("我到这里了");
        setIntervalFunc(()=>{return $('.answerCard').length}, zhsExam);
    } else if (location.pathname === '/stuExamWeb.html' && location.href.includes('/webExamList/doexamination/')) {
        setIntervalFunc(()=>{return $('.answerCard').length}, zhsExam);
    } else if (location.href.includes('/atHomeworkExam/stu/homeworkQ/exerciseList') || location.href.includes('atHomeworkExam/stu/examQ/examexercise')) {
        zhsIntegral();
    } else if (location.pathname === '/web/index.php' && location.href.includes('m=reply')) {
        ybkExam();
    } else if (location.pathname === '/study/works/works.html' || location.pathname === '/study/exam/exam.html') {
        icve_works();
    } else if (location.pathname.includes('/v2/web/cloud/student/exercise/')) {
        yktText();
    } else if (location.host === 'examination.xuetangx.com' && location.pathname.includes('/exam/')) {
        yktExam();
    } else if (location.host === 'changjiang-exam.yuketang.cn' && location.pathname.includes('/exam/')) {
        yktExam();
    } else if (location.pathname.includes('/v/quiz/quiz_result')) {
        setIntervalFunc(()=>{return $('#cover').attr('style').includes('display: none;')}, yktOldExam);
    } else if (location.host === 'www.xuetangx.com' && location.pathname.includes('/exercise/')) {
        xtzxText();
    } else if (location.pathname.includes('/v2/web/studentLog')) {
        collectYkt();
    } else if (location.host === 'examination.xuetangx.com' && location.pathname.includes('/result')) {
        collectPtTkt();
    } else if (location.pathname.includes('/Exam/OnlineExamV2/')) {
        setIntervalFunc(()=>{return $('.ExamTime').length}, zgdzText);
    } else if (location.pathname.includes('/evaluation_wechat/examination/detail/')) {
        xetText();
    } else if (location.pathname.includes('/evaluation_wechat/examination/review')) {
        collectXiaoETong();
    } else if (location.pathname.includes('/study/html/content/studying/')) {
        hookJSON();
        anHuiText();
    } else if (location.pathname === '/study/html/content/tkOnline/' || location.pathname === '/study/html/content/sxsk/') {
        hookJSON();
        setIntervalFunc(()=>{return $('.e-save-b').length}, anHuiText);
    } else if (location.pathname === ('/study/html/content/assignment/')) {
        collectAnHuiJiXuJiaoYu();
    } else if (location.host === 'www.ttcdw.cn' && location.pathname.includes('/p/uExam/goExam/')) {
        hookJSON();
        setIntervalFunc(()=>{return !$('div').hasClass('entrying-wrap')}, xinJiangAgain);

    } else if (location.pathname === ('/page/quiz/stu/answerQuestion')) {//随堂练习
        chaoxingQuizNew();
    } else if (location.pathname.includes('/Portal/student/practice-improve/')) {
        collect_booway();
    } else if (location.host === 'lms.ouchn.cn' && location.pathname.includes('/exam/')) {
        setIntervalFunc(()=>{return $('.loading-gif').hasClass('ng-hide') && $('.hd .examinee .submit-label').eq(0).text() === ""}, guokaiText);
    } else if (location.pathname.includes('/memberFront/paper.zhtml')) {
        setIntervalFunc(()=>{return $('#question_').attr('style').length === 0}, renweiText);
    } else if (location.pathname.includes('/exam/student/exam/resource/paper_card2')) {
        setIntervalFunc(()=>{return $('.ui-question-answer-right').length === 0}, HuaQiaoAgain);
    } else if (location.href.includes('/onlineclass/exam/')) {
        setIntervalFunc(()=>{return $('.excer_list_view___YOSCa').length}, daLianText);
    } else if (location.pathname.includes('/study/assignment/preview.aspx')) {
        shangHaiOpen();
    } else if (location.pathname.includes('/web-qz/moni/exam/exam_toExam.action')) {
        zheJiangExam();
    } else if (location.host === "www.zjooc.cn") {
        hookJSON();
        setIntervalFunc(()=>{return location.pathname.includes('/homework/do/') || location.pathname.includes('/test/do/') || location.pathname.includes('/exam/do/')}, zheJiangOnline);
    } else if (location.host === "www.zjooc.cn") {
        setIntervalFunc(()=>{return $('.settingsel-dialog').css('display') === 'none'}, zheJiangText);
    } else if (location.host.includes('qingshuxuetang') && location.pathname.includes('/Student/ExercisePaper')) {
        qingShuText();
    } else if (location.host.includes('qingshuxuetang') && (location.pathname.includes('/Student/MakeupExamPaper') || location.pathname.includes('Student/ExamPaper'))) {
        qingShuExam();
    } else if (location.pathname === '/learnCourse/learnCourse.html') {
        setIntervalFunc(()=>{return $('.question-setting-panel').length}, youXueText);
    } else if (location.host === 'utest.ulearning.cn' && location.pathname === ('/')) {
        setIntervalFunc(()=>{return $('.section-area').length === 1}, youXueExam);
    } else if (location.pathname === ('/umooc/learner/homework.do')) {
        setIntervalFunc(()=>{return $('.multiple-choices').length}, youXueWork);
    } else if (location.pathname === ('/app-afstudy/self_test.html')) {
        moNiExam();
    } else if ((location.host === 'examination.xuetangx.com' || location.host === 'changjiang-exam.yuketang.cn') && location.pathname.includes('/result/')) {
        hookJSON();
    } else if (location.pathname === ('/Web_Study/Student/Center/MyWorkOnView') || location.pathname === ('/Web_Study/Student/Center/MyExamOnView')) {
        setIntervalFunc(()=>{return $('.samllTopicNav').length}, fuJianText);
    } else if (location.host === 'quiz.qingshuxuetang.com' && location.pathname.includes('/Student/Quiz/Detail')) {
        qingShuText();
    } else if (location.host === 'www.jwstudy.cn' && location.pathname.includes('/User/Student/myhomework.aspx') || location.pathname.includes('/examing.aspx')) {
        huNanWork();
    } else if (location.pathname.includes('/sls/N2014_StudyController/next')) {
        wanXueText();
    } else if (location.host.includes('wenjuan.com') && location.pathname === '/s/') {
        wenJuanAutoFill();
    } else if (location.pathname.includes('/oxer/page/ots/examIndex.html')) {
        setIntervalFunc(()=>{return $('.tika_topline').length}, xueQiExam);
    } else if (location.host === 'exam.yooc.me' && location.pathname.includes('/group')) {
        setIntervalFunc(()=>{return $('.jsx-3527395752').length}, yiBanExam);
    } else if (location.host === 'mooc.yncjxy.com' && location.pathname.includes('/user/work') || location.pathname.includes('/user/exam')) {
        setIntervalFunc(()=>{return $('#stateName').text().trim() === '进行中'}, yinghuaText);
    } else if (location.host === 'mooc.yncjxy.com' && location.pathname.includes('/user/exam')) {
        setIntervalFunc(()=>{return $('#stateName').text().trim() === '进行中'}, yinghuaEaxe);
    } else if (location.host === 'ncexam.cug.edu.cn' && location.pathname.includes('/Test/ViewTest')) {
        setIntervalFunc(()=>{return $('.z333').length}, collectZg);
    } else if (location.pathname.includes('/exam/ExamRd/Answer')) {
        wenJuanExam();
    } else if (location.pathname.includes('/nec/student/exam/exam-paper!test')) {
        xiaMenText();
    } else if (location.host === 'course.ougd.cn' && location.pathname.includes('/mod/quiz/attempt.php')) {
        guangKaiText();
    } else if (location.href.includes('ksnr') || location.href.includes('lxnr')) {
        danweiExam();
    } else if (location.host.includes('h5.xiaoeknow') || location.href.includes('/exam/h5_evaluation/')) {
        xetH5();
    } else if (location.href.includes('/dypx/OnlineExam/Exam.aspx')) {
        deYangAgaintext();
    } else if (location.host === 'studentexambaseh5.zhihuishu.com') {
        setIntervalFunc(()=>{return $('.questionContent').length}, zhsIntegral1);
    } else if (location.pathname.includes('/practice/start')) {
        ziBoText();
    } else if (location.pathname.includes('paperid')) {
        heBeiExam();
    } else if (location.pathname.includes('/exam/answer.html')) {
        setIntervalFunc(()=>{return $('#question').length}, boJiaoExam);
    } else if (location.pathname.includes('/cuggw/rs/olex_exam')) {
        setIntervalFunc(()=>{return $('.paper_body').length}, baoDingExam);
    } else if (location.host === 'www.goldgame.com.cn' && location.href.includes('/TestPage')) {
        setIntervalFunc(()=>{return $('.tab-btn-box li').length}, jinPaiExam);
    } else if (location.pathname.includes('/pages/exam/exam.html')) {
        setIntervalFunc(()=>{return $('.exam-content-block .exam-content-topic').length}, qingDaoExam);
    } else if (location.pathname.includes('/exam/student/exam/')) {
        setIntervalFunc(()=>{return $('.ui-question-group').length}, tangShanExam);
    } else if (location.pathname.includes('/Exam/StartExam')) {
        dianMoExam();
    } else if (location.pathname.includes('/Course/TestPaper')) {
        dianMoText();
    } else if (location.pathname.includes('/bsmytest/startTi.do')) {
        jingGuanExam();
    } else if (location.hostname === "exam2.euibe.com" && location.pathname === '/KaoShi/ShiTiYe.aspx') {
        //match https://exam2.euibe.com/KaoShi/ShiTiYe.aspx?dtid=930&stid=136512&yh=1#question136512
        exam2_euibe_com_exam();
    }else if (location.hostname === "lzwyedu.jijiaool.com" && location.pathname.includes('/Student/ExamManage/CourseOnlineExamination')) {
        //match http://lzwyedu.jijiaool.com/Student/ExamManage/CourseOnlineExamination/e5899557-bfd8-4b1a-85f7-09152c1340a1
        lzwyedu_jijiaool_com_exam();
    }

    exports.Ext = Ext;
    exports.UE = UE$1;
    exports._self = _self;
    exports.parent = parent;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});

// ==UserScript==
// @name         2025国家智慧中小学-暑期研修(免费，秒刷)，各类继续教育/定制【山东山西广东河北湖南四川吉林继教重庆赤峰宁夏包头梅河口青岛、现代远程教育、双融双创、超星，好医生教育干部智慧普法等，文档查看更多
// @namespace    http://tampermonkey.net/zzzzzzys_国家中小学
// @version      2.8.6
// @copyright    zzzzzzys.All Rights Reserved.
// @description  适用2025国家智慧教育平台、山东教师教育、河北继续教育等.【河北继续教育(师学通、奥鹏、电视台、高教社等)】【吉林继教(中盛佳源|)】【中小学D校】【国家开发大学】【四川继教、四川创联】【重庆、内蒙古、赤峰、宁夏、包头、梅河口、桦甸教育、中山专技(chinahrt、chinamde)等软件】【广东双融双创、继续教育】【人教社义教】【云继教】【沃希学苑(山东中小学人工智能研修包含考试)】【名师学堂】【中山教师研修】【河北专业技术人员继续教育、湖南师范大学专业技术人员继续教育网】【广西广东干部网络学院、山东灯塔网络学院、凉山专技继续教育】【湖南人社】，凉山、河南专技、鸡西教师平台、民用无人驾驶航空器管理平台，好医生，中国教育干部、法宣在线、吉林高邦等自动化挂机/刷课 更多请前往：https://zzzzzzys.lovestoblog.com/,还有软件支持更加便捷的学习课程！注意：禁止二次发布！加QQ群获取更新
// @author       zzzzzzys
// @match        *://basic.smartedu.cn/*
// @match        *://core.teacher.vocational.smartedu.cn/*
// @match        *://test3.ykt.eduyun.cn/*
// @match        *://pn202413060.stu.teacher.com.cn/studyPlan/*
// @match        *://pn202413060.stu.teacher.com.cn/course/*
// @match        *://cn202511002.stu.t-px.cn/*
// @match        *://cas.study.yanxiu.jsyxsq.com/auth/selfHost/studyPlace/index.html*
// @match        *://learn.ourteacher.com.cn/StepLearn/StepLearn/*
// @match        *://vc.chinabett.com/studyduration/index*
// @match        *://www.ttcdw.cn/p*
// @match        *://*.besteacher.com.cn/activity/curriculum/*
// @match        *://*.webtrn.cn/learnspace/learn/learn/templateeight/index.action*
// @match        *://cqrl.21tb.com/els/html/courseStudyItem/courseStudyItem.learn.do*
// @match        *://*.nmgdbrc.com/*
// @match        *://wp.pep.com.cn/web/index.php?/px/*
// @match        *://bjpep.gensee.com/webcast/site/vod/*
// @match        *://srsc.gdedu.gov.cn/course/study*
// @match        *://gp.chinahrt.com/index.html*
// @match        *://videoadmin.chinahrt.com/videoPlay/playEncrypt*
// @match        *://saas.yunteacher.com/module/*
// @match        *://saas.yunteacher.com/coursePlay*
// @match        *://jlzj.ylxue.net/LearningCenter/LearningCourseVideo*
// @match        *://*.chinamde.cn/play/*
// @match        *://p.bokecc.com/playhtml.bo*
// @match        https://jsxx.gdedu.gov.cn/*/study/course/*
// @match        https://jsxx.gdedu.gov.cn/study/course/*
// @match        https://m.zsjsjy.com/teacher/train/train/online/study.do*
// @match        https://trplayer.sctce.cn/*
// @match        https://study.seewoedu.cn/tCourse/group/*
// @match        https://cpb-m.cvte.com/*
// @match        https://saas.mingshiclass.com/*
// @require      https://scriptcat.org/lib/637/1.4.6/ajaxHooker.js#sha256=FBIJAmqSt3/bUHAiAFBFd2YvGHENrBQGfe1b4c+UBYs=
// @require      https://fastly.jsdelivr.net/npm/crypto-js@4.2.0/crypto-js.min.js
// @resource     https://cdn.staticfile.org/limonte-sweetalert2/11.7.1/sweetalert2.min.css
// @require      https://fastly.jsdelivr.net/npm/sweetalert2@11.12.2/dist/sweetalert2.all.min.js
// @connect      basic.smartedu.cn
// @connect      x-study-record-api.ykt.eduyun.cn
// @connect      fc-mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.next.bspapp.com
// @connect      mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.cdn.bspapp.com
// @connect      manage.yzspeixun.com
// @connect      videoadmin.chinahrt.com
// @connect      api.mingshiclass.com
// @connect      cpb-m.cvte.com
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/543584/2025%E5%9B%BD%E5%AE%B6%E6%99%BA%E6%85%A7%E4%B8%AD%E5%B0%8F%E5%AD%A6-%E6%9A%91%E6%9C%9F%E7%A0%94%E4%BF%AE%28%E5%85%8D%E8%B4%B9%EF%BC%8C%E7%A7%92%E5%88%B7%29%EF%BC%8C%E5%90%84%E7%B1%BB%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AE%9A%E5%88%B6%E3%80%90%E5%B1%B1%E4%B8%9C%E5%B1%B1%E8%A5%BF%E5%B9%BF%E4%B8%9C%E6%B2%B3%E5%8C%97%E6%B9%96%E5%8D%97%E5%9B%9B%E5%B7%9D%E5%90%89%E6%9E%97%E7%BB%A7%E6%95%99%E9%87%8D%E5%BA%86%E8%B5%A4%E5%B3%B0%E5%AE%81%E5%A4%8F%E5%8C%85%E5%A4%B4%E6%A2%85%E6%B2%B3%E5%8F%A3%E9%9D%92%E5%B2%9B%E3%80%81%E7%8E%B0%E4%BB%A3%E8%BF%9C%E7%A8%8B%E6%95%99%E8%82%B2%E3%80%81%E5%8F%8C%E8%9E%8D%E5%8F%8C%E5%88%9B%E3%80%81%E8%B6%85%E6%98%9F%EF%BC%8C%E5%A5%BD%E5%8C%BB%E7%94%9F%E6%95%99%E8%82%B2%E5%B9%B2%E9%83%A8%E6%99%BA%E6%85%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/543584/2025%E5%9B%BD%E5%AE%B6%E6%99%BA%E6%85%A7%E4%B8%AD%E5%B0%8F%E5%AD%A6-%E6%9A%91%E6%9C%9F%E7%A0%94%E4%BF%AE%28%E5%85%8D%E8%B4%B9%EF%BC%8C%E7%A7%92%E5%88%B7%29%EF%BC%8C%E5%90%84%E7%B1%BB%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AE%9A%E5%88%B6%E3%80%90%E5%B1%B1%E4%B8%9C%E5%B1%B1%E8%A5%BF%E5%B9%BF%E4%B8%9C%E6%B2%B3%E5%8C%97%E6%B9%96%E5%8D%97%E5%9B%9B%E5%B7%9D%E5%90%89%E6%9E%97%E7%BB%A7%E6%95%99%E9%87%8D%E5%BA%86%E8%B5%A4%E5%B3%B0%E5%AE%81%E5%A4%8F%E5%8C%85%E5%A4%B4%E6%A2%85%E6%B2%B3%E5%8F%A3%E9%9D%92%E5%B2%9B%E3%80%81%E7%8E%B0%E4%BB%A3%E8%BF%9C%E7%A8%8B%E6%95%99%E8%82%B2%E3%80%81%E5%8F%8C%E8%9E%8D%E5%8F%8C%E5%88%9B%E3%80%81%E8%B6%85%E6%98%9F%EF%BC%8C%E5%A5%BD%E5%8C%BB%E7%94%9F%E6%95%99%E8%82%B2%E5%B9%B2%E9%83%A8%E6%99%BA%E6%85%A7.meta.js
// ==/UserScript==
// 请勿搬运代码
const web_url="https://zzzzzzys.lovestoblog.com/"
const web_list = [
    { name: "备用地址1", url: "https://zzzzzzys.lovestoblog.com/" },
    { name: "备用地址2", url: "https://zzzzzzys.us.kg/" },
    { name: "备用地址3", url: "https://zzysdocs.dpdns.org/" },
    { name: "备用地址4", url: "https://zzzzzzys.dpdns.org/" },
    { name: "备用地址5", url: "https://zzysdocs.great-site.net/" },
    { name: "备用地址6", url: "https://zzzzzzys.kesug.com/" },
]
class ScriptCore {
    constructor() {
        this.modules  = new Map();
        this.initModules();
        this.execute();
    }

    initModules() {
        // 多站点匹配配置
        this.modules.set('国家智慧教育平台',  {
            match: [
                /^(https?:\/\/)?(basic\.smartedu\.cn)/,
                /^(https?:\/\/)?(core\.teacher\.vocational\.smartedu\.cn)/,
                /^(https?:\/\/)?(test3\.ykt\.eduyun\.cn)/,
                /localhost:\d+(\/.*)?$/ // 本地开发环境
            ],
            module: SmartEduModule,
            config: {
                refreshInterval: 5000,
                apiEndpoints: {
                }}});
        this.modules.set('师学通平台',  {
            match: url => {
                const targetPaths = [
                    '/studyPlan/',
                    '/course/'
                ];
                // 正确的主机名验证
                const validHost = 'pn202413060.stu.teacher.com.cn';
                const isHostMatch = url.hostname  === validHost;

                // 路径双重验证
                const isPathMatch = targetPaths.some(path  =>
                    url.pathname.startsWith(path)
                );

                return isHostMatch && isPathMatch;
            },
            module: TeacherModule,
            config: { debugMode: false }
        });
        this.modules.set('中国教育电视台',  {
            match: [
                /^(https?:\/\/)?(cas\.study\.yanxiu\.jsyxsq\.com\/auth\/selfHost\/studyPlace\/index.html)/,
                /localhost:\d+(\/.*)?$/
            ],
            module: HebeiCas,
            config: {
                refreshInterval: 5000,
                apiEndpoints: {
                }}});
        this.modules.set('奥鹏',  {
            match: [
                /^(https?:\/\/)?(learn\.ourteacher\.com\.cn\/StepLearn\/StepLearn)/,
                /localhost:\d+(\/.*)?$/
            ],
            module: HebeiAoPeng,
            config: {
                refreshInterval: 5000,
                apiEndpoints: {
                }}});
        this.modules.set('高等教育出版社-2024中小学',  {
            match: [
                /^(https?:\/\/)?(vc\.chinabett\.com\/studyduration\/index)/,
                /localhost:\d+(\/.*)?$/
            ],
            module: Chinabett,
            config: {
                refreshInterval: 5000,
                apiEndpoints: {
                }}});
        this.modules.set('中小学网络D校-湖南全国中小学幼儿园',  {
            match: [
                /^(https?:\/\/)?(www\.ttcdw\.cn\/p)/,

                /localhost:\d+(\/.*)?$/
            ],
            module: Dangxiaottcdw,
            config: {
                refreshInterval: 5000,
                apiEndpoints: {
                }}});
        this.modules.set('国家开放大学-大同市中小学幼儿园教师全员培训',  {
            match: [
                /^(https?:\/\/)?([a-z0-9-]+\.)?besteacher\.com\.cn\/activity\/curriculum\/.*/,

                /^(https?:\/\/)?([a-z0-9-]+\.)?webtrn\.cn\/learnspace\/learn\/learn\/templateeight\/index\.action.*/,
                /localhost:\d+(\/.*)?$/
            ],
            module: BestTeacher,
            config: {
                refreshInterval: 5000,
                apiEndpoints: {
                }}});
        this.modules.set('重庆专技人员继续教育公需科目培训',  {
            match: [
                /^(https?:\/\/)?cqrl.21tb.com\/els\/html\/courseStudyItem\/courseStudyItem.learn.do/,
                /localhost:\d+(\/.*)?$/
            ],
            module: Cqrl,
            config: {
                refreshInterval: 5000,
                apiEndpoints: {
                }}});
        this.modules.set('赤峰市 专业技术人员继续教育 公需科目培训网',  {
            match: [
                /^(https?:\/\/)?([a-z0-9-]+\.)?nmgdbrc\.com\//,
                /localhost:\d+(\/.*)?$/
            ],
            module: Nmgdbrc,
            config: {
                refreshInterval: 5000,
                apiEndpoints: {
                }}});
        this.modules.set('人教版义教新教材',  {
            match: [
                /^(https?:\/\/)?wp\.pep\.com\.cn\/web\/index\.php\?\/px\//,
                /^(https?:\/\/)?bjpep\.gensee\.com\/webcast\/site\/vod\//,
                /localhost:\d+(\/.*)?$/
            ],
            module: Pep,
            config: {
                refreshInterval: 5000,
                apiEndpoints: {
                }}});
        this.modules.set('广东双融双创',  {
            match: [
                /^(https?:\/\/)?srsc\.gdedu\.gov\.cn\/course\/study/,
                /localhost:\d+(\/.*)?$/
            ],
            module: Gdedu,
            config: {
                refreshInterval: 5000,
                apiEndpoints: {
                }}});
        this.modules.set('chinahrt(宁夏、赤峰、包头专技)',  {
            match: [
                /^(https?:\/\/)?gp\.chinahrt\.com\/index\.html/,
                /^(https?:\/\/)?videoadmin\.chinahrt\.com\/videoPlay\/playEncrypt/,
                /localhost:\d+(\/.*)?$/
            ],
            module: Chinahrt,
            config: {
                refreshInterval: 5000,
                apiEndpoints: {
                }}});
        this.modules.set('云继教_yunteacher',  {
            match: [
                /^(https?:\/\/)?saas\.yunteacher\.com\/module\//,
                /^(https?:\/\/)?saas\.yunteacher\.com\/coursePlay/,
                /localhost:\d+(\/.*)?$/
            ],
            module: Yunteacher,
            config: {
                refreshInterval: 5000,
                apiEndpoints: {
                }}});
        this.modules.set('吉林_白云公需专业_中盛佳源',  {
            match: [
                /^(https?:\/\/)?jlzj\.ylxue\.net\/LearningCenter\/LearningCourseVideo/,
                /localhost:\d+(\/.*)?$/
            ],
            module: Ylxue,
            config: {
                refreshInterval: 5000,
                apiEndpoints: {
                }}});
        this.modules.set('Chinamde_赤峰',  {
            match: [
                /^(https?:\/\/)([a-z0-9-]+\.)?chinamde.cn\/play/,
                /^(https?:\/\/)p\.bokecc\.com\/playhtml\.bo/,
                /localhost:\d+(\/.*)?$/
            ],
            module: Chinamde,
            config: {
                refreshInterval: 5000,
                apiEndpoints: {
                }}});
        this.modules.set('广东教师教育_公需课',  {
            match: [
                /^(https?:\/\/)jsxx\.gdedu\.gov\.cn\/([a-z0-9_-]+)?\/study\/course\//,
                /localhost:\d+(\/.*)?$/
            ],
            module: Gdedujsxx,
            config: {
                refreshInterval: 5000,
                apiEndpoints: {
                }}});
        this.modules.set('中山教师研修',  {
            match: [
                /^(https?:\/\/)m.zsjsjy.com\/teacher\/train\/train\/online\/study\.do/,
                /localhost:\d+(\/.*)?$/
            ],
            module: Zsjsjy,
            config: {
                refreshInterval: 5000,
                apiEndpoints: {
                }}});
        this.modules.set('四川省继续教育',  {
            match: [
                /^(https?:\/\/)trplayer\.sctce\.cn\//,
                /localhost:\d+(\/.*)?$/
            ],
            module: Sedu,
            config: {
                runAt:'document-start',
                refreshInterval: 5000,
                apiEndpoints: {
                }}});
        this.modules.set('希沃学苑',  {
            match: [
                /^(https?:\/\/)study\.seewoedu\.cn\/tCourse\/group\//,
                /^(https?:\/\/)cpb-m\.cvte\.com\//,
                /localhost:\d+(\/.*)?$/
            ],
            module: Seewo,
            config: {
                refreshInterval: 5000,
                apiEndpoints: {
                }}});
        this.modules.set('名师课堂',  {
            match: [
                /^(https?:\/\/)saas\.mingshiclass\.com\//,
                /localhost:\d+(\/.*)?$/
            ],
            module: Mingshiclass,
            config: {
                refreshInterval: 5000,
                apiEndpoints: {
                }}});

    }
    execute() {
        const currentUrl = new URL(window.location.href);

        for (const [moduleName, { match, module: Module, config }] of this.modules)  {
            if (this.matchChecker(currentUrl,  match)) {
                Logger.moduleLoaded(moduleName)
                const executor = () => new Module().run(config);

                if (config.runAt && config.runAt === 'document-start') {
                    executor();
                } else {
                    // 延迟到DOM加载完成后执行
                    if (document.readyState === 'loading') {
                        window.addEventListener('DOMContentLoaded', executor);
                    } else {
                        executor(); // 兜底：如果已经加载完成则直接执行
                    }
                }
                return; // 单例模式运行
            }
        }
        console.warn('[Core]  未找到匹配模块');
    }
    matchChecker(currentUrl, matcher) {
        // 处理多种匹配类型
        if (Array.isArray(matcher))  {
            return matcher.some(pattern  =>
                pattern instanceof RegExp ? pattern.test(currentUrl.href)
                    : typeof pattern === 'function' ? pattern(currentUrl)
                        : false
            );
        }
        return typeof matcher === 'function'
            ? matcher(currentUrl)
            : matcher.test(currentUrl.href);
    }
}
class Logger {
    static #styles = {
        core: ['font-size: 11px', 'font-family: monospace', 'padding: 2px 8px', 'border-radius: 4px', 'background: linear-gradient(145deg, #2196F3 20%, #1976D2)', 'color: white', 'text-shadow: 0 1px 1px rgba(0,0,0,0.3)'].join(';'),
        module: ['background: #FFEB3B', 'color: #212121', 'padding: 1px 4px', 'border-radius: 2px', 'margin-left: 4px'].join(';'),
        status: ['background: #4CAF50', 'color: white', 'padding: 1px 6px', 'border-left: 2px solid #388E3C'].join(';')
    };
    static moduleLoaded(name) {
        const timestamp = performance.now().toFixed(2);
        try {
            Swal.fire({title: '<span style="font-size:1.5em; color:#FF4DAF;">🎉 脚本加载成功！</span>', html: ` <div style="text-align:left; line-height:1.6;"> <p style="font-size:1.1em; margin-bottom:15px;">✅ 脚本已正确加载！</p> <div style="background:#f8f9fa; padding:12px; border-radius:8px;"> <p style="color:#666; margin:5px 0;">⚠️ 如未加载成功：</p> <ul style="margin:5px 0; padding-left:20px;"> <li>请尝试使用 <strong style="color:#FF4DAF;">篡改猴插件</strong></li> <li>脚本猫可能导致兼容性问题</li> <li>同时使用时需关闭脚本猫</li> </ul> </div> <p style="margin-top:20px;"> <a href="https://zzzzzzys.lovestoblog.com/" target="_blank" style="color:#FF4DAF; text-decoration:underline;"> 🔗 https://zzzzzzys.lovestoblog.com/查看更多适配网站 </a> </p> </div> `, icon: 'success', width: '800px', padding: '2em', customClass: {popup: 'custom-swal-popup', title: 'custom-swal-title', htmlContainer: 'custom-swal-html'}, confirmButtonColor: "#FF4DAF", confirmButtonText: '<span style="font-size:1.1em;">🚀 关闭弹窗</span>', showCloseButton: true, timerProgressBar: false, backdrop: 'rgba(0,0,0,0.7)'}); }catch (e) {
            console.error(e);
        }
        console.log(
            `%cCORE%c${name}%c ✔ LOADED %c+${timestamp}ms`,
            this.#styles.core,
            this.#styles.module,
            this.#styles.status,
            'color: #757575; font-size: 0.8em;'
        );}}
class SmartEduModule {
    constructor() {
    }
    run(config) {

        this.setupCoreFeatures(config);

    }
    setupCoreFeatures({refreshInterval}) {
        /*****************************
         * 盗版可耻
         * 请尊重原创劳动成果！
         * 作者：zzzzzzys
         * https://cn-greasyfork.org/zh-CN/users/1176747-zzzzzzys
         * 搬运可耻
         ****************************/
        const qqGroup = [
            {customName: "群1", id: "570337037", link: "https://qm.qq.com/q/rDCbvTiV9K", isFull: true, priority: 0},
            {customName: "群2", id: "618010974", link: "https://qm.qq.com/q/h854sxDvKa", isFull: true, priority: 0},
            {customName: "群3", id: "1003884618", link: "https://qm.qq.com/q/kRcyAunAic", isFull: true, priority: 0},
            {customName: "群4", id: "821240605", link: "https://qm.qq.com/q/z1ogtdhyGA", isFull: true, priority: 0},
            {customName: "群5", id: "1013973135", link: "https://qm.qq.com/q/EpXA5Ar3vG", isFull: true, priority: 0},
            {customName: "交流学习群（禁广告，只交流学习）", id: "978762026", link: "https://qm.qq.com/q/aUTUVmKYQE", isFull: true, priority: 1},
            {customName: "交流学习群2（禁广告，只交流学习）", id: "992947190", link: "https://qm.qq.com/q/Egvc0YJM8S", isFull: false, priority: 1},
            {customName: "群1（禁广告，只交流学习）", id: "1056718020", link: "https://qm.qq.com/q/m7qhu9yvSM", isFull: false, priority: 1},
            {customName: "群2（禁广告，只交流学习）", id: "726705867", link: "https://qm.qq.com/q/1AAD4pm4KI", isFull: false, priority: 1},
            {customName: "群3（禁广告，只交流学习）", id: "1053680588", link: "https://qm.qq.com/q/nb8SJpTAoE", isFull: false, priority: 2},
            {customName: "群4（禁广告，只交流学习）", id: "1053680506", link: "https://qm.qq.com/q/RKYzAQDpA", isFull: false, priority: 3},
            {customName: "群5（禁广告，只交流学习）", id: "953759692", link: "https://qm.qq.com/q/rbWfvYDDKo", isFull: false, priority: 4},
            {customName: "群6（禁广告，只交流学习）", id: "687799057", link: "https://qm.qq.com/q/6JfQY3WXV6", isFull: false, priority: 5}
        ]
        const originalXHR = unsafeWindow.XMLHttpRequest;
        let fullDatas = null
        /*unsafeWindow.XMLHttpRequest = function () {
            const xhr = new originalXHR();
            const originalOpen = xhr.open;
            const originalSend = xhr.send;
            xhr.open = function (method, url) {
                this._method = method;
                this._url = url;
                return originalOpen.apply(this, arguments);
            };
            xhr.send = function (body) {
                this.addEventListener('readystatechange', function () {
                    if (this._url.includes("fulls.json")) {
                        if (this.readyState === 4) { // 请求完成
                            console.log('捕获到 XHR 请求结果:', {
                                url: this._url, method: this._method, status: this.status, response: this.response
                            });
                            fullDatas = JSON.parse(this.response);
                        }}});
                return originalSend.apply(this, arguments);
            };
            return xhr;
        };*/
        ajaxHooker.filter([
            {url: 'fulls.json'}
        ])
        ajaxHooker.hook(request => {
            if (request.url.includes('fulls.json')) {
                request.response = res => {
                    console.log(res);
                    fullDatas = JSON.parse(res.responseText);
                };
            }
        });
        const renderQQGroups = () => {
            try {
                const activeGroups = qqGroup
                    .filter(group => {
                        // 添加数据校验
                        if (!group.customName || !group.id) {
                            console.warn('Invalid group:', group);
                            return false;
                        }
                        return !group.isFull;
                    })
                    .sort((a, b) => a.priority - b.priority);

                // 添加空状态提示
                if (activeGroups.length === 0) {
                    return `<div style="color: #ff9999; text-align:center; margin:12px 0">
              所有群组已开放，欢迎直接加入
            </div>`;
                }
                const title = `<div style="background: linear-gradient(135deg, #FF4DAF 0%, #FF6B6B 100%);display: flex; align-items: center; gap:15px;"> <img src="https://qzonestyle.gtimg.cn/qzone/qzact/act/external/tiqq/logo.png" style="height:36px; border-radius:6px;"> <div> <div style="font-size:16px; font-weight:bold; margin-bottom:4px;">教师交流群(请优先选择未满群加入)</div> <div style="font-size:12px; opacity:0.9;">获取实时支持 | 最新功能优先体验</div> </div> </div>`
                let content = title + activeGroups.map(group => ` <a href="${group.link}" target="_blank" style="display: block; margin-top: 12px; padding: 10px; background: rgba(255,255,255,0.2); border-radius: 6px; text-align: center; text-decoration: none; color: white !important; transition: 0.3s; font-weight: 500; cursor: pointer;" aria-label="加入QQ群${group.customName}（群号：${group.id}）"> 🎯 点击加入${group.customName}:${group.id} <!-- 移除群号显示 --> </a> `).join('');
                return `<div style="background: linear-gradient(135deg, #FF4DAF 0%, #FF6B6B 100%); padding:15px; border-radius:8px; color:white;">
                                    ${content}
                                </div>`
            } catch (error) {
                console.error('QQ群渲染错误:', error);
                return ''; // 静默失败
            }
        };
        let requestObj = {
            fullsData: {
                url: "https://s-file-2.ykt.cbern.com.cn/teach/s_course/v2/activity_sets/3efdb592-138e-4854-8964-5e10f6011f33/fulls.json",
                method: "GET",
            }, resourceLearningPositions: {
                url: "https://x-study-record-api.ykt.eduyun.cn/v1/resource_learning_positions/", method: "PUT"
            }, /* 职业教育 | 高等教育  */
            progress: {
                url: "https://core.teacher.vocational.smartedu.cn/p/course/services/member/study/progress",
                method: "POST",
            }
        }
        /********************************************************
         * 职业教育/高等教育
         *******************************************************/
        const SWAL_CONFIG = {
            title: '课程进度控制', html: ` <div style="margin-bottom: 5px"> <label>v${GM_info.script.version}</label> </div> <div style=" padding: 12px; background: #e8f4ff; border-radius: 8px; margin-bottom: 15px; border: 1px solid #b3d4fc; text-align: center; "> <span style=" font-size: 14px; color: #ff4daf; display: inline-flex; align-items: center; gap: 6px; "> <span style="font-size: 16px">🎯</span> 老师您好，点击开始按钮，开始减负之旅<br> 脚本会自动学习当前页所有视频，您可安心休息片刻 </span> </div> <div style="margin-bottom: 15px"> <label>当前视频：</label> <div id="currentVideo" style=" font-size: 16px; color: #3498db; font-weight: 500; margin: 8px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; ">尚未开始</div> </div> <div class="progress-container" style=" background: #f0f0f0; height: 20px; border-radius: 10px; margin: 15px 0; overflow: hidden; "> <div id="swalProgressBar" style=" height: 100%; background: linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%); width: 0; transition: width 0.3s ease; "></div> </div> <div style=" display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; "> <div> <label>当前进度</label> <div id="currentProgress" style=" font-size: 18px; font-weight: bold; color: #2c3e50; ">0:00</div> </div> <div> <label>大概需要时间</label> <div id="needTime" style=" font-size: 14px; color: #2efd00; ">还未开始</div> </div> <div> <label>总时长</label> <div id="totalTime" style=" font-size: 14px; color: #7f8c8d; ">还未开始</div> </div> </div> <div id="statusMessage" style=" padding: 10px; border-radius: 5px; margin: 10px 0; background: #f8f9fa; text-align: center; ">准备就绪</div> <div style=" padding: 12px; background: #f5f7fa; border-radius: 8px; margin: 12px 0; border: 1px solid #e4e7ed; "> ${renderQQGroups()} </div> <div id="author" style=" padding: 8px 16px; /* 适当的上下左右内边距 */ border-radius: 10px; margin: 10px 0; background: #f8f9fa; text-align: center; font-size: 12px; /* 稍微增大字体 */ font-weight: bold; /* 加粗字体 */ color: #495057; /* 更深的字体颜色，增强可读性 */ border: 1px solid #dee2e6; /* 添加边框 */ box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 轻微阴影效果 */ letter-spacing: 1px; /* 增加字母间距 */ "> By YoungthZou. 盗码可耻！ zzzzzzys </div> `, showConfirmButton: false, allowOutsideClick: false, allowEscapeKey: false, width: 600, willOpen: () => {
                document.querySelector('.swal2-close').remove();
            }
        };
        // 状态管理
        let currentProgress = 60;
        let isRunning = false;
        let swalInstance = null;
        let totalTime = 1000;
        let checkInterval = null
        // 工具函数
        const formatTime = (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        };
        const updateUI = (progress, status) => {
            if (!swalInstance) return;
            const progressBar = swalInstance.querySelector('#swalProgressBar');
            const percent = (progress / totalTime * 100).toFixed(1);
            progressBar.style.width = `${Math.min(parseFloat(percent), 100)}%`;
            swalInstance.querySelector('#currentProgress').textContent = formatTime(progress);
            swalInstance.querySelector('#totalTime').textContent = formatTime(totalTime);
            swalInstance.querySelector('#needTime').textContent = formatTime(parseInt(((totalTime - progress) / 3).toFixed(0)));
            const statusEl = swalInstance.querySelector('#statusMessage');
            statusEl.textContent = {loading: '🔄 正在同步进度...', success: '✅ 同步成功,stand by...', error: '❌ 同步失败(长时间失败，请反馈)', idle: '⏸ 已暂停', finished: '✅已学完，跳过...', finishAll: '已全部学完,请手动刷新，给个好评吧~', next: "🔄 此视频已学完，准备学习下一个..."}[status] || '准备就绪';
            statusEl.style.color = {loading: '#f39c12', success: '#2ecc71', error: '#e74c3c', idle: '#7f8c8d', finished: '#0022fd', finishAll: '#ff4daf', next: '#f39c12',}[status];
        };
        const sendProgress = async (videoId) => {
            updateUI(currentProgress, 'loading');
            let oriData = {
                courseId: unsafeWindow.courseId,
                itemId: unsafeWindow.p.itemId,
                videoId: videoId,
                playProgress: currentProgress,
                segId: unsafeWindow.p.segId,
                type: unsafeWindow.p.type,
                tjzj: 1,
                clockInDot: currentProgress,//后台要求此参数为视频播放的位置
                sourceId: unsafeWindow.p.projectId,
                timeLimit: unsafeWindow.timilistParam.timeLimit || -1,
                originP: unsafeWindow.p.originP === 1 ? 2 : 1,  // 硬编码，等待修改
            }
            try {
                const response = await fetch(`${requestObj.progress.url}?orgId=${unsafeWindow.p.orgId}`, {
                    method: "POST", headers: {
                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "x-requested-with": "XMLHttpRequest",
                        "u-platformId": unsafeWindow.platformInfo.id
                    }, credentials: "include", body: new URLSearchParams(oriData)
                });
                const data = await response.json();
                console.log(data)
                if (data.data?.videoProgress > 0) {
                    currentProgress = parseInt(data.data.videoProgress);
                    updateUI(currentProgress, 'success');
                    return data.data.progress;
                } else {
                    throw new Error('无效的服务器响应');
                }
            } catch (error) {
                console.error('请求失败:', error);
                updateUI(currentProgress, 'error');
            }
        };
        // 创建控制界面
        function createControlPanel() {
            Swal.fire({
                ...SWAL_CONFIG, didOpen: (modal) => {
                    swalInstance = modal;
                    const actions = document.createElement('div');
                    actions.style = `display: grid;grid-template-columns: 1fr 1fr;gap: 10px;margin-top: 15px;`;
                    const startBtn = createButton('▶ 开始', '#2ecc71', async () => {
                        if (!isRunning) {
                            try {
                                try {
                                    document.querySelector('video').pause()
                                } catch (e) {}
                                isRunning = true;
                                startBtn.textContent = '⏸ 暂停';
                                startBtn.style.background = '#e74c3c';
                                let courseData = getCourseData();
                                for (const courseDatum of courseData) {
                                    if (!isRunning) {
                                        return
                                    }
                                    await sleep(2000)
                                    console.log(courseDatum.name)
                                    swalInstance.querySelector('#currentVideo').textContent = courseDatum.name
                                    currentProgress = 0;
                                    totalTime = parseInt(courseDatum.duration);
                                    if (parseInt(courseDatum.progress) === 1) {
                                        console.log(" 已学完，跳过...")
                                        updateUI(currentProgress, 'finished');
                                        continue;
                                    }
                                    do {
                                        const progress = await sendProgress(courseDatum.videoId, currentProgress); // 立即执行
                                        if (progress === "1.0") {
                                            break;
                                        }
                                        await interruptibleWait(21000);
                                    } while (currentProgress < totalTime && isRunning)
                                    updateUI(currentProgress, 'next');
                                    await sleep(20000);
                                }
                                // 非暂停结束
                                if (isRunning) {
                                    currentProgress = 1;
                                    totalTime = 1;
                                    updateUI(currentProgress, 'finishAll');
                                    startBtn.textContent = '▶ 开始';
                                    startBtn.style.background = '#2ecc71';
                                }
                            } catch (e) {
                                console.error(e)
                                if (Swal) {
                                    Swal.fire({
                                        title: "失败！",
                                        text: e.toString() + "请在视频播放页面使用！！！",
                                        icon: 'error', // showCancelButton: true,
                                        confirmButtonColor: "#FF4DAFFF", // cancelButtonText: "取消，等会刷新",
                                        confirmButtonText: "点击去反馈",
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            window.open("https://greasyfork.org/zh-CN/scripts/525037/feedback")
                                        }
                                    });
                                }
                            } finally {
                                isRunning = false;
                            }
                        } else {
                            isRunning = false;
                            startBtn.textContent = '▶ 继续';
                            startBtn.style.background = '#2ecc71';
                            if (checkInterval) {
                                clearTimeout(checkInterval.timer);
                                checkInterval.resolve(); // 立即结束等待
                            }
                            updateUI(currentProgress, 'idle');
                            setTimeout(() => {
                                updateUI(currentProgress, 'idle');
                            }, 2000)
                        }
                    });
                    const resetBtn = createButton('→去好评', '#dbba34', () => {
                        window.open("https://greasyfork.org/zh-CN/scripts/525037/feedback")
                    });
                    actions.append(startBtn, resetBtn);
                    modal.querySelector('.swal2-html-container').append(actions);
                }
            });
        }
        const sleep = function (time) {
            return new Promise(resolve => setTimeout(resolve, time));
        }
        function interruptibleWait(ms) {
            return new Promise(resolve => {
                const timer = setTimeout(resolve, ms);
                // 暴露清除方法以便立即暂停
                checkInterval = {timer, resolve};
            });
        }
        function createButton(text, color, onClick) {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.style = `padding: 10px 15px;border: none;border-radius: 5px;background: ${color};color: white;cursor: pointer;transition: opacity 0.3s;`;
            btn.addEventListener('click', onClick);
            btn.addEventListener('mouseenter', () => btn.style.opacity = 0.8);
            btn.addEventListener('mouseleave', () => btn.style.opacity = 1);
            return btn;
        }
        function getCourseData() {
            let courseData = unsafeWindow.initlessons
            console.log(courseData)
            if (!courseData) {
                updateUI(currentProgress, 'error');
                console.error("no course data!");
                return
            }
            courseData = courseData.filter(item => {
                return item?.type !== "1";
            });
            return [...courseData];
        }
        /********************************************************
         * 打赏
         *******************************************************/
        GM_addStyle(`.donate-panel { position: fixed; left: 30%; top:50%; background: linear-gradient(135deg, #fff5f5 0%, #fff0f7 100%); border-radius: 16px; box-shadow: 0 8px 32px rgba(255, 77, 175, 0.2); padding: 24px; width: 520px; z-index: 2147483647; transform: translateY(-100); /* 初始隐藏位置 */ opacity: 1; /* 确保初始可见性 */ border: 1px solid #ffe6f0; backdrop-filter: blur(8px); transition: none; /* 禁用transition改用animation */ }.donate-header { position: relative; font-size: 18px; color: #ff4daf; margin-bottom: 20px; font-weight: 600; display: flex; align-items: center; gap: 12px; padding-bottom: 12px; border-bottom: 2px solid rgba(255, 77, 175, 0.1); } .donate-header::after { content: "✨"; position: absolute; right: 0; top: -8px; font-size: 24px; animation: sparkle 2s infinite; } .motivation-text { font-size: 13px; color: #666; line-height: 1.6; margin: 12px 0; background: rgba(255, 255, 255, 0.9); padding: 12px; border-radius: 8px; border: 1px solid #ffebf3; } @keyframes heartbeat { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } } @keyframes sparkle { 0% { opacity: 0.3; } 50% { opacity: 1; } 100% { opacity: 0.3; } } @keyframes panelSlideIn { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(-50%); opacity: 1; } } @keyframes panelSlideOut { from { transform: translateY(0); opacity: 1; } to { transform: translateY(100%); opacity: 0; } } @keyframes heartbeat { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } } .qr-grid { display: grid; grid-template-columns: 1fr; /* 改为单列布局 */ gap: 24px; margin: 24px auto; max-width: 300px; /* 增大容器宽度 */ } .qr-item { position: relative; overflow: hidden; border-radius: 12px; transition: 0.3s; padding: 12px; /* 增加内边距 */ background: #fff; box-shadow: 0 4px 12px rgba(255, 77, 175, 0.1); } .qr-item:hover { transform: translateY(-4px); box-shadow: 0 6px 16px rgba(255, 77, 175, 0.2); } .qr-item img { width: 100%; height: auto; /* 保持比例 */ border-radius: 8px; border: 1px solid #ffe5f0; min-height: 280px; /* 最小高度保证 */ } .qr-item p { text-align: center; margin: 16px 0 8px; font-size: 16px; /* 增大文字 */ color: #ff4daf; font-weight: 600; } /* 新增文字样式 */ .qr-tips { text-align: center; margin: 8px 0; font-size: 14px; color: #ff7ab8; /* 更柔和的粉色 */ } .qr-proverb { font-style: italic; color: #ff9ec7; /* 更浅的粉色 */ font-size: 13px; margin-top: 4px; } /* 修改原有.qr-item p样式 */ .qr-item p { margin: 12px 0 4px; /* 减小下边距 */ /* 其他样式保持不变 */ } /* 手机横屏/平板适配 */ @media (min-width: 600px) { .qr-grid { grid-template-columns: 1fr 1fr; /* 大屏幕恢复双列 */ max-width: 600px; } .qr-item img { min-height: 240px; } } .third-party { margin-top: 20px; } .platform-btn { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px; background: linear-gradient(135deg, #fff0f5 0%, #fff8fb 100%); border-radius: 8px; text-decoration: none; color: #ff6699 !important; font-size: 14px; margin: 8px 0; transition: 0.3s; border: 1px solid #ffe6ee; } .donate-panel.active { animation: panelSlideIn 0.4s cubic-bezier(0.22, 0.61, 0.36, 1) forwards; } .donate-panel.exit { animation: panelSlideOut 0.3s ease forwards; } /* 触发按钮动画 */ #donate-trigger { animation: heartbeat 1.8s ease-in-out infinite; } .platform-btn:hover { background: linear-gradient(135deg, #ffe6ee 0%, #fff1f7 100%); box-shadow: 0 4px 12px rgba(255, 77, 175, 0.1); } .close-btn { /* 保持原有样式 */ }`);

        // 激励文案库
        const motivationTexts = ["您的每一份支持都将转化为：", "❤️ 服务器续费 ", "🛠️ 持续开发维护 ", "☕ 深夜码农的咖啡燃料", "🐈 小猫最爱的水煮鸡胸肉",];

        // 动态生成激励文案
        function generateMotivation() {
            const fragments = ['<div class="motivation-text">', '🌟 <strong>感谢使用本脚本！</strong>', ...motivationTexts.map(t => `• ${t}`), '</div>'].join('<br>');
            return fragments
                .replace('${donateCount}', '1,234')
                .replace('${updateDays}', '365');
        }
        // 打赏面板HTML结构
        const donateHTML = `
<div  id="donate-panel"> ${generateMotivation()} <div class="donate-header"> <svg viewBox="0 0 24 24" width="20" height="20" fill="#1e62ec"> <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/> </svg> 支持开发者 </div> <div class="qr-grid"> <div class="qr-item"> <p>微信扫码支持</p> <img style="width: 200px;height: 266px" src="https://mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.cdn.bspapp.com/monkey-pic/wechat2.jpg" alt="微信赞赏码"> <div class="qr-tips"> <p>❤️持续创作需要您的支持</p> <p class="qr-proverb">星火相聚，终成光芒</p> </div> </div> <div class="qr-item"> <p>支付宝扫码支持</p> <img style="width: 200px;height: 266px" src="https://mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.cdn.bspapp.com/monkey-pic/alipay2.jpg" alt="支付宝收款码"> <div class="qr-tips"> <p>🌸每一份心意都值得珍惜</p> <p class="qr-proverb">不啻微芒，造矩成阳</p> </div> </div> </div> <div class="donate-header"> <svg viewBox="0 0 24 24" width="20" height="20" fill="#1e62ec"> <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/> </svg> 感谢您的支持！ </div> <div class="third-party"> <!--<a href="https://afdian.net/@yourid" class="platform-btn" target="_blank"> <svg viewBox="0 0 1024 1024" width="14" height="14" style="vertical-align:-2px;"> <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372zm218-572.1h-50.4c-4.4 0-8 3.6-8 8v384.2c0 4.4 3.6 8 8 8h145.7c4.4 0 8-3.6 8-8V319.9c0-4.4-3.6-8-8-8h-50.4c-4.4 0-8 3.6-8 8v151.7H730V319.9c0-4.4-3.6-8-8-8zM328.1 703.9c-4.4 0-8-3.6-8-8v-384c0-4.4 3.6-8 8-8h50.4c4.4 0 8 3.6 8 8v151.7h116.7V319.9c0-4.4 3.6-8 8-8h50.4c4.4 0 8 3.6 8 8v384.2c0 4.4-3.6 8-8 8h-145c-4.4 0-8-3.6-8-8v-151H344v151c0 4.4-3.6 8-8 8H328.1z"/> </svg> 爱发电支持 </a>--> <div class="platform-btn" id="donate-panel-close">感谢开发者，已支持~</div> </div> </div>
`;

        // 初始化打赏面板
        function initDonate() {
            if (document.getElementById('donate-panel')) return;
            const panel = document.createElement('div');
            panel.innerHTML = donateHTML;
            panel.className = 'donate-panel';
            document.body.appendChild(panel);
            // 强制重排触发动画
            void panel.offsetWidth; // 触发CSS重绘
            panel.classList.add('active');
            // 关闭按钮事件
            panel.querySelector('#donate-panel-close').addEventListener('click', () => {
                panel.classList.remove('active');
                panel.classList.add('exit');
                panel.addEventListener('animationend', () => {
                    panel.remove();
                }, {once: true});
            });
            // 点击外部关闭
            const clickHandler = (e) => {
                if (!panel.contains(e.target) && e.target.id !== 'donate-trigger') {
                    panel.classList.add('exit');
                    panel.addEventListener('animationend', () => {
                        panel.remove();
                    }, {once: true});
                    document.removeEventListener('click', clickHandler);
                }
            };
            setTimeout(() => document.addEventListener('click', clickHandler), 100);
        }

        // 显示触发按钮
        const trigger = document.createElement('div');
        trigger.innerHTML = '❤️ 打赏支持';
        Object.assign(trigger.style, {
            position: 'fixed', left: '10px', top: '415px', background: '#ff6b6b', color: 'white', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', zIndex: '999999999999999', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', fontSize: '14px'
        });
        // 触发按钮增强
        Object.assign(trigger.style, {
            background: 'linear-gradient(135deg, #ff4daf 0%, #ff6b6b 100%)', fontWeight: '600', padding: '12px 24px', boxShadow: '0 4px 24px rgba(255, 77, 175, 0.3)', animation: 'heartbeat 1.5s ease-in-out infinite', border: '1px solid #ffb3d9'
        });
        trigger.addEventListener('click', initDonate);
        document.body.appendChild(trigger);
        /********************************************************
         * 中小学智慧教育平台 * 寒假研修
         *******************************************************/
            //样式
        let style = `.button-3 { position: fixed; appearance: none; background-color: #ed5822; border: 1px solid rgba(27, 31, 35, .15); border-radius: 6px; box-shadow: rgba(27, 31, 35, .1) 0 1px 0; box-sizing: border-box; color: #ffffff; cursor: pointer; display: inline-block; font-family: -apple-system,system-ui,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"; font-size: 14px; font-weight: 600; line-height: 20px; padding: 6px 16px; left: 20px; top: 300px; text-align: center; text-decoration: none; user-select: none; -webkit-user-select: none; touch-action: manipulation; vertical-align: middle; white-space: nowrap; z-index: 2147483647; } .button-3:focus:not(:focus-visible):not(.focus-visible) { box-shadow: none; outline: none; } .button-3:hover { background-color: #2c974b; } .button-3:focus { box-shadow: rgba(46, 164, 79, .4) 0 0 0 3px; outline: none; } .button-3:disabled { background-color: #94d3a2; border-color: rgba(27, 31, 35, .1); color: rgba(255, 255, 255, .8); cursor: default; } .button-3:active { background-color: #298e46; box-shadow: rgba(20, 70, 32, .2) 0 1px 0 inset; }`
        const createFloatingButton = () => {
            // 如果按钮已存在则先移除旧实例
            const existingBtn = document.getElementById('zs-helper-btn');
            if (existingBtn) existingBtn.remove();
            // 直接创建按钮元素（去掉外层div嵌套）
            const btn = document.createElement('div');
            btn.id = 'zs-helper-btn'; // 确保唯一ID直接设置在元素上
            btn.style.cssText = ` position: fixed; left: 10px; top: 250px; transform: translateY(-50%); background: #ed5822; color: white; padding: 12px 24px; border-radius: 30px; cursor: pointer; box-shadow: 0 4px 12px rgba(255,77,175,0.3); z-index: 2147483647; /* 使用最大z-index值 */ transition: 0.3s; font-family: 'Microsoft Yahei', sans-serif; white-space: nowrap; display: flex; align-items: center; gap: 8px; `;
            // 添加内部HTML内容
            btn.innerHTML = `
        <svg style="width:18px;height:18px;fill:white;" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
        </svg>
        <span>使用指南</span>
    `;
            // 使用更可靠的事件监听方式
            const handleHover = () => {
                btn.style.transform = 'translateY(-50%) scale(1.05)';
                btn.style.boxShadow = '0 6px 16px rgba(255,77,175,0.4)';
            };
            const handleLeave = () => {
                btn.style.transform = 'translateY(-50%) scale(1)';
                btn.style.boxShadow = '0 4px 12px rgba(255,77,175,0.3)';
            };
            btn.addEventListener('mouseenter', handleHover);
            btn.addEventListener('mouseleave', handleLeave);
            btn.addEventListener('click', showGuideDialog);
            document.body.appendChild(btn);
            return btn;
        };
        // 显示操作指南弹窗
        const showGuideDialog = () => {
            if (Swal) {
                Swal.fire({title: `<span style="color: #FF4DAF; font-size:26px; display: flex; align-items: center; gap:8px;">📚 智能刷课指南 <div style="font-size:12px; color:#95a5a6; margin-left:auto;">v${GM_info.script.version}</div></span>`, html: ` <div style="text-align: left; max-width: 720px; line-height: 1.8;"> <!-- 操作步骤 --> <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;"> <div style="color: red; font-weight:500; margin-bottom:10px;"> 播放页面未正常生效请刷新页面！播放页面左侧无红色按钮请刷新页面！ </div> <div style="color: #2c3e50; font-weight:500; margin-bottom:10px;"> 🚀 极速操作流程<br> </div> <div style="display: grid; grid-template-columns: 32px 1fr; gap: 10px; align-items: center;"> <div style="background: #FF4DAF; color: white; width:24px; height:24px; border-radius:50%; text-align:center; line-height:24px;">1</div> <div>进入2025研修课程播放页面 / 课程目录页面</div> <div style="background: #FF4DAF; color: white; width:24px; height:24px; border-radius:50%; text-align:center; line-height:24px;">2</div> <div>直接点击相应按钮，等待操作完成后，刷新页面</div> <div style="background: #FF4DAF; color: white; width:24px; height:24px; border-radius:50%; text-align:center; line-height:24px;">3</div> <div><span style="color:#FF4DAF; font-weight:bold">诶个点击视频，看完最后几秒，安全保留日志信息</span></div> </div> </div> <!-- 注意事项 --> <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom:20px;"> <div style="border-left: 3px solid #FF4DAF; padding-left:12px;"> <div style="color: #e74c3c; font-weight:500; margin-bottom:8px;">⚠️ 重要提醒</div> <ul style="margin:0; padding-left:18px; color:#7f8c8d; font-size:14px;"> <li>视频最后剩下5秒需要看完</li> <li>刷课时勿播放视频</li> <li>建议刷完全部视频再刷新，观看最后的几秒</li> </ul> </div> <div style="border-left: 3px solid #27ae60; padding-left:12px;"> <div style="color: #27ae60; font-weight:500; margin-bottom:8px;">💡 高效技巧</div> <ul style="margin:0; padding-left:18px; color:#7f8c8d; font-size:14px;"> <li>中小学，在目录或播放页。点击按钮直接开刷</li> <li>职业/高等，挂机即可，可最小化浏览器</li> </ul> </div> </div> ${renderQQGroups()} </div> `,
                    confirmButtonText: "已了解，开始减负之旅 →",
                    confirmButtonColor: "#FF4DAF",
                    showCancelButton: true,
                    cancelButtonText: "不在显示此窗口",
                    cancelButtonColor: "#95a5a6",
                    width: 760,
                    customClass: {
                        popup: 'animated pulse', title: 'swal-title-custom'
                    },
                    footer: '<div style="color:#bdc3c7; font-size:12px;">请合理使用本工具</div>'
                }).then((result) => {
                    // console.log(result);
                    // console.log(Swal.DismissReason.cancel);
                    if (result.dismiss === Swal.DismissReason.cancel) {
                        // 跳转到课程列表页或其他操作
                        localStorage.setItem('noMoreDialog', "ture")
                    }
                });
            }
        }
        // 初始化逻辑
        // 初始化逻辑优化
        const init = () => {
            // 创建悬浮按钮
            const floatBtn = createFloatingButton();
            // 添加防DOM清理监听（优化版）
            const observer = new MutationObserver(mutations => {
                if (!document.body.contains(floatBtn)) {
                    createFloatingButton();
                }
            });
            observer.observe(document.body, {childList: true});

            // 添加CSS保护
            const style = document.createElement('style');
            style.textContent = ` #zs-helper-btn { pointer-events: auto !important; opacity: 1 !important; visibility: visible !important; } #zs-helper-btn:hover { transform: translateY(-50%) scale(1.05) !important; } `;
            document.head.appendChild(style);
        };
        function getVideoTime() {
            return Math.round(document.querySelector('video').duration)
        }
        function getResourceIdFromFullData() {
            if (!fullDatas || fullDatas.nodes?.length === 0) {
                throw Error("can't get fullDatas!")
            }
            const result = [];
            // 递归遍历节点
            const traverse = (node) => {
                if (node.node_type === 'catalog' && node.child_nodes?.length > 0) {
                    // 如果是目录节点，继续遍历子节点
                    node.child_nodes.forEach(child => traverse(child));
                } else if (node.node_type === 'activity') {
                    // 如果是活动节点，提取资源
                    const resources = node.relations?.activity?.activity_resources || [];
                    resources.forEach(resource => {
                        result.push({
                            name: node.node_name || '未命名课程',
                            resource_id: resource.resource_id || '',
                            studyTime: resource.study_time
                        });
                    });
                }
            };
            // 遍历初始节点数组
            fullDatas.nodes.forEach(node => traverse(node));
            return result.filter(item => item.resource_id); // 过滤无效项
        }
        function getDynamicToken() {
            try {
                const pattern = /^ND_UC_AUTH-([0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12})&ncet-xedu&token$/;
                for (let key of Object.keys(localStorage)) {
                    if (pattern.test(key)) {
                        return {
                            key: key,
                            appId: key.match(pattern)[1],
                            token: JSON.parse(JSON.parse(localStorage.getItem(key)).value)
                        };
                    }
                }
                throw Error("Invalid token! can not get loginInfo!");
            } catch (err) {
                throw Error("At:getDynamicToken>>" + err);
            }
        }
        // const tokenData = getDynamicToken(); if (tokenData) { console.log("完整键名:", tokenData.key);
        //     console.log("用户UUID:", tokenData.uuid); console.log("Token值:", tokenData.token); }
        // 作者：zzzzzzys
        // https://greasyfork.org/zh-CN/users/1176747-zzzzzzys
        // 搬运可耻
        const getMACAuthorizationHeaders = function (url, method) {
            let n = getDynamicToken().token
            return He(url, method, {
                accessToken: n.access_token, macKey: n.mac_key, diff: n.diff
            });
        }
        function Ze(e) {
            for (var t = "0123456789ABCDEFGHIJKLMNOPQRTUVWXZYS".split(""), n = "", r = 0; r < e; r++) n += t[Math.ceil(35 * Math.random())];
            return n
        }
        function Fe(e) {
            return (new Date).getTime() + parseInt(e, 10) + ":" + Ze(8)
        }
        function ze(e, t, n, r) {
            let o = {
                relative: new URL(e).pathname, authority: new URL(e).hostname
            }
            let i = t + "\n" + n.toUpperCase() + "\n" + o.relative + "\n" + o.authority + "\n";
            return CryptoJS.HmacSHA256(i, r).toString(CryptoJS.enc.Base64)
        }
        function He(e) {
            // 作者：zzzzzzys
            // https://greasyfork.org/zh-CN/users/1176747-zzzzzzys
            // 搬运可耻
            let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "GET",
                n = arguments.length > 2 ? arguments[2] : void 0, r = n.accessToken, o = n.macKey, i = n.diff,
                s = Fe(i), a = ze(e, s, t, o);
            return 'MAC id="'.concat(r, '",nonce="').concat(s, '",mac="').concat(a, '"')
        }
        const setProgress = function (url, duration) {
            const info = getDynamicToken()
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    'url': url, method: 'PUT', "headers": {"accept": "application/json, text/plain, */*", "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6", "authorization": getMACAuthorizationHeaders(url, 'PUT'), "cache-control": "no-cache", "pragma": "no-cache", "content-type": "application/json", "sdp-app-id": info.appId, "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Microsoft Edge\";v=\"132\"", "sec-ch-ua-mobile": "?0", "sec-ch-ua-platform": "\"Windows\"", "sec-fetch-dest": "empty", "sec-fetch-mode": "cors", "sec-fetch-site": "cross-site", "host": "x-study-record-api.ykt.eduyun.cn", "origin": "https://basic.smartedu.cn", "referer": "https://basic.smartedu.cn/", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0"}, data: JSON.stringify({position: duration - 3}), // fetch:true,
                    onload: function (res) {
                        console.log('请求成功')
                        console.log(res)
                        if (res.status === 200) {
                            console.log("刷课成功！")
                            resolve(res)
                        } else {
                            reject('服务器拒绝：' + res.response)
                        }
                    }, onerror: function (err) {
                        reject('请求错误！' + err.toString())
                    }})})}
        function main() {
            init()
            if (!localStorage.getItem("noMoreDialog")) {
                showGuideDialog()
            }
            let myStyle = document.createElement('style')
            myStyle.innerHTML = style;
            document.head.appendChild(myStyle);
            /*let intercept=GM_GetValue*/
            let div = document.createElement('div');
            div.innerHTML = `<div style="left: 10px;top: 280px;" id="my1" class="button-3" >即刻开刷(中小学)</div> <div style="position: fixed; left: 10px;top: 320px;;background: #ed5822;color: white; padding: 10px 20px; border-radius: 25px; cursor: pointer; box-shadow: 0 3px 15px rgba(0,0,0,0.2); z-index: 999999999999; transition: transform 0.3s;" id="my3"    >职业教育/高等教育 刷课</div> <div style="left: 10px;top: 370px;" id="my2"   class="button-3" >2222</div>`
            document.body.appendChild(div);
            const trigger = document.getElementById('my3')
            trigger.addEventListener('click', () => {
                if (location.href.includes("core.teacher.vocational.smartedu.cn")) {
                    createControlPanel()
                } else {
                    Swal.fire({
                        title: "注意",
                        text: "请在职业/高等教育的视频播放页面使用，中小学请用上面的按钮！",
                        icon: 'info', // showCancelButton: true,
                        confirmButtonColor: "#FF4DAFFF", // cancelButtonText: "取消，等会刷新",
                        confirmButtonText: "了解~",
                    })}});
            trigger.addEventListener('mouseenter', () => trigger.style.transform = 'scale(1.05)');
            trigger.addEventListener('mouseleave', () => trigger.style.transform = 'none');
            let isProcessing = false;
            const button = document.getElementById('my1');
            button.addEventListener("click", async () => {
                if (isProcessing) {
                    Swal.fire({title: "操作进行中", text: "正在刷课中，请勿重复点击！", icon: "warning", confirmButtonColor: "#FF4DAFFF", confirmButtonText: "知道了"});
                    return;
                }
                try {
                    isProcessing = true; // 标记开始处理
                    button.disabled = true; // 禁用按钮
                    button.textContent = "刷课进行中..."; // 修改按钮文字
                    let resId
                    const allResults = [];
                    if (!resId) {
                        console.log("二次获取resId...")
                        resId = getResourceIdFromFullData()
                    }
                    if (resId && typeof resId === 'string') {
                        await setProgress(requestObj.resourceLearningPositions.url + resId + '/' + getDynamicToken().token["user_id"], getVideoTime())
                        allResults.push({name: '单个课程', status: 'success'});
                    } else if (Array.isArray(resId) && resId.length > 0) {
                        const results = await Promise.allSettled(resId.map(async (item) => {
                            try {
                                await setProgress(requestObj.resourceLearningPositions.url + item.resource_id + '/' + getDynamicToken().token["user_id"], item.studyTime)
                                return {name: item.name, status: 'success'};
                            } catch (e) {
                                console.error(`${item.name} 失败！`, e);
                                return {name: item.name, status: 'fail', error: e};
                            }
                        }));
                        console.log(results)
                        results.forEach(r => {
                            if (r.status === 'fulfilled') allResults.push(r.value); else allResults.push(r.reason); // 捕获未处理的意外错误
                        });
                    }
                    if (Swal) {
                        Swal.fire({
                            title: "刷课成功！", html: ` <div style="text-align: left; max-height: 20vh; overflow-y: auto;"> <p>总计：${allResults.filter(r => r.status === 'success').length} 成功 / ${allResults.filter(r => r.status === 'fail').length} 失败</p> <hr> <ul style="padding-left: 20px; list-style-type: none;"> ${allResults.map(result => ` <li> ${result.status === 'success' ? '✅' : '❌'} <strong>${result.name}</strong> ${result.error ? `<br><code style="color:red">${result.error.message || result.error}</code>` : ''} </li> `).join('')} </ul> </div> <div style="text-align: left;"> <p>视频只剩下最后5s，需要看完，请刷新后再观看！</p> <p>刷课前请勿播放视频，否则可能会导致进度更新失败！</p> <hr style="margin: 10px 0;"> ${renderQQGroups()} </div> `, icon: 'success', confirmButtonColor: "#FF4DAFFF", // cancelButtonText: "取消，等会刷新",
                            // 作者：zzzzzzys
                            // https://greasyfork.org/zh-CN/users/1176747-zzzzzzys
                            // 搬运可耻
                            confirmButtonText: "确定",
                        })
                    }
                } catch (e) {
                    console.error(e)
                    if (Swal) {
                        Swal.fire({
                            title: "失败！",
                            text: e.toString() + "    请在视频播放页面使用！",
                            icon: 'error', // showCancelButton: true,
                            confirmButtonColor: "#FF4DAFFF", // cancelButtonText: "取消，等会刷新",
                            confirmButtonText: "点击去反馈",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.open("https://greasyfork.org/zh-CN/scripts/525037/feedback")
                            }
                        });
                    }
                } finally {
                    isProcessing = false; // 重置处理状态
                    button.disabled = false; // 恢复按钮
                    button.textContent = "即刻开刷(中小学)"; // 恢复按钮文字
                }})
            document.getElementById('my2').addEventListener('click', function () {
                Swal.fire({title: '<span style="font-size:24px; color: #FF4DAF;">欢迎加入交流群</span>', html: ` <div style="text-align: left; max-width: 580px; line-height: 1.7; font-size: 14px;"> <!-- 社群入口 --> ${renderQQGroups()} <!-- 核心价值 --> <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;"> <!-- 左列 --> <div style="padding-right:15px; border-right:1px dashed #eee;"> <div style="color: #27ae60; margin-bottom:15px;"> <h4 style="margin:0 0 8px 0; font-size:15px;">📚 减负工具</h4> <!--                        <ul style="margin:0; padding-left:18px;">--> <!--                            <li>自动化备课工具套件</li>--> <!--                            <li>智能学情分析报告</li>--> <!--                            <li>教学资源智能检索</li>--> <!--                        </ul>--> </div> <div style="color: #2980b9; margin-top:15px;"> <h4 style="margin:0 0 8px 0; font-size:15px;">🛡️ 使用规范</h4> <ul style="margin:0; padding-left:18px;"> <li>仅限个人使用</li> <li>禁止商业倒卖行为</li> <li>禁止利用此脚本收费代刷</li> <li>请勿批量自动化操作大量刷课（如需要请联系我，更加高效安全）</li> </ul> </div> </div> <!-- 右列 --> <div style="padding-left:15px;"> <div style="color: #e67e22;"> <h4 style="margin:0 0 8px 0; font-size:15px;">⚖️ 版权声明</h4> <ul style="margin:0; padding-left:18px;"> <li>本工具完全免费</li> <li>源码禁止二次传播</li> <!--                            <li>保留原创法律权利</li>--> </ul> </div> <div style="color: #9b59b6; margin-top:15px;"> <h4 style="margin:0 0 8px 0; font-size:15px;">💌 联系我们</h4> <ul style="margin:0; padding-left:18px;"> <!--                            <li>反馈建议：edu@service.com</li>--> <li>紧急问题：请私聊群管理员</li> </ul> </div> </div> </div> </div> `,
                    icon: 'info',
                    confirmButtonColor: "#FF4DAF",
                    confirmButtonText: "2222",
                    showCloseButton: true,
                    width: 680,
                    showDenyButton: true,
                    denyButtonText: '<img src="https://img.icons8.com/fluency/24/star--v1.png" style="height:18px; vertical-align:middle;"> 前往好评', // 带图标的按钮
                    denyButtonColor: '#FFC107',
                    focusDeny: false,
                    showCancelButton: false,
                    // 新增按钮回调
                    preDeny: () => {
                        // window.open("https://greasyfork.org/zh-CN/scripts/525037/feedback", "_blank");
                        window.open("https://scriptcat.org/zh-CN/script-show-page/2789/comment", "_blank");
                        return false; // 阻止弹窗关闭
                    },
                    customClass: {
                        denyButton: 'swal-custom-deny', popup: 'swal-custom-popup', title: 'swal-custom-title'
                    },
                    footer: '<div style="color:#95a5a6; font-size:12px;">请合理使用。</div>'
                });});}
        main()
        console.log('智慧教育平台 模块启动!');
    }
}
//师学通
class TeacherModule {
    constructor() {
    }
    run(config) {

        this.setupCoreFeatures(config);

    }
    setupCoreFeatures({refreshInterval}){
        class AutoStudyIndex {
            constructor(options = {}) {
                // 配置参数合并
                this.config = {
                    catalogSelector: '.catalog-list',
                    catalog_cn: ".firstmenu",
                    courseMaxTime: 150 * 60 * 1000,
                    ...options
                };
                // 任务状态控制
                this.isRunning = false;
                this.currentWindow = null;
                this.channel = new BroadcastChannel('my-channel');
                this.statusPanel=new AutomationStatusPanel()
                // this.init()
            }
            init(){
                /*let intercept=GM_GetValue*/
                let div = document.createElement('div');
                div.innerHTML = `<div  id="my1" class="button-3" >即刻开刷</div>`
                document.body.appendChild(div);
                let isClick = false;
                let my1 = document.getElementById('my1')
                my1.addEventListener("click", async () => {
                    try {
                        if(!this.isRunning){
                            this.statusPanel.startMonitoring();
                            this.statusPanel.updateMetrics({
                                currentTask: '自动化任务已开始',
                            });
                            // this.isRunning = true
                            my1.innerText = "自动刷课中..."
                            my1.disabled=true
                            await this.start()
                            this.isRunning  = false;
                        }
                    }catch (e) {
                        if (typeof Swal !== 'undefined') {
                            Swal.fire({
                                title: "错误！",
                                text: e.toString(),
                                icon: 'error',
                                confirmButtonColor: "#FF4DAFFF",
                                confirmButtonText: "关闭"
                            })}}finally {
                        if(!this.isRunning){
                            my1.innerText  = "点击开刷";
                            my1.disabled  = false;
                        }}})}
            // 主入口方法
            async start() {
                if (this.isRunning) {
                    console.warn('任务已在运行中');
                    return;
                }
                this.isRunning = true;
                await this.runTask();
            }
            // 停止任务
            stop() {
                this.isRunning = false;
                this.channel.close(); // 关闭通信频道
                if (this.currentWindow) {
                    this.currentWindow.close();
                }
            }
            // 核心任务循环
            async runTask() {
                if (!this.isRunning) return;
                try {
                    await this.autoStudy();
                    this.showCompletion()
                    console.log('本轮任务执行完成');
                    this.statusPanel.updateMetrics({
                        currentTask:"任务已完成"
                    })
                    this.statusPanel.stopMonitoring()
                } catch (error) {
                    console.error('任务执行出错:', error);
                }
                // 设置下一轮执行
                if (this.isRunning) {
                    // setTimeout(() => this.runTask(), this.config.interval);
                }
            }
            // 遍历目录执行学习
            async autoStudy() {
                let catalogList = document.querySelectorAll(this.config.catalogSelector);
                if(catalogList.length===0){
                    catalogList=document.querySelectorAll(this.config.catalog_cn);
                }
                if (catalogList.length === 0) {
                    console.warn('未找到课程目录');
                    return;
                }
                for (const element of catalogList) {
                    if (!this.isRunning) break;
                    const title = element.querySelector('a').innerText;
                    console.log(`\n============== ${title} ==============`);
                    this.statusPanel.updateMetrics({
                        currentTask:title
                    })
                    await this.sleep(2); // 章节间间隔
                    const status = this.checkStatus(element);
                    if (status === 0) {
                        console.log('当前章节已完成');
                        continue;
                    }
                    await this.processChapter(element);
                    if(!(await this.statusPanel.validateAuthCode())){
                        break
                    }}}
            // 处理单个章节
            async processChapter(element) {
                const url = this.getChapterUrl(element);
                if (!url) {
                    console.error('获取章节链接失败');
                    return;
                }
                let retryCount = 0;
                let result = await this.openAndWaitForTask(url);
                // 处理需要重试的情况
                while (result === 1 && retryCount < 3) {
                    retryCount++;
                    console.log(`第 ${retryCount} 次重试...`);
                    result = await this.openAndWaitForTask(url);
                }
                // 处理最终结果
                switch (result) {
                    case 0:
                        console.log('章节学习完成');
                        break;
                    case 2:
                        console.warn('任务超时');
                        try {
                            this.currentWindow && this.currentWindow.close()
                        }catch (e) {
                            console.warn(e);
                        }
                        break;
                    default:
                        console.warn('任务异常终止');
                        try {
                            this.currentWindow && this.currentWindow.close()
                        }catch (e) {
                            console.warn(e);
                        }}}
            // 打开新窗口并监听任务
            async openAndWaitForTask(url) {
                return new Promise(async (resolve) => {
                    const newWindow = window.open(url);
                    if (!newWindow) {
                        console.error('弹窗被阻止，请允许弹窗');
                        return resolve(2);
                    }
                    this.currentWindow = newWindow;

                    const courseMaxTime = this.statusPanel.getMaxTime() || this.config.courseMaxTime
                    // 设置超时处理
                    const timeoutId = setTimeout(() => {
                        this.channel.postMessage('timeout');
                        try {
                            this.currentWindow.close()
                        }catch (e) {
                            console.error(e);
                        }
                        resolve(2);
                    }, courseMaxTime);
                    // 监听消息
                    this.channel.onmessage = (event) => {
                        clearTimeout(timeoutId);
                        resolve(event.data === 'finish' ? 0 : 1);
                    };
                });
            }
            // 工具方法
            checkStatus(element) {
                let statusIcon
                if(location.href.includes('cn202511002')){
                    statusIcon = element.querySelectorAll('i')[1];
                }else {
                    statusIcon = element.querySelectorAll('i')[2];
                }
                return statusIcon.innerText === "已完成" ? 0 : 1;
            }
            getChapterUrl(element) {
                return element.querySelector('a')?.href;
            }
            sleep(seconds) {
                return new Promise(resolve =>
                    setTimeout(resolve, seconds * 1000));
            }
            // 完成提示（需页面已引入 SweetAlert）
            showCompletion() {
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: "学习完成！",
                        text: "本版块所有课程已达到学习要求",
                        icon: 'success',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "关闭"
                    }).then(() => {
                        try { window.close(); }
                        catch { /* 忽略关闭错误 */ }
                    });}}}
        GM_addStyle(`.automation-panel { position: fixed; bottom: 0; left: 0; width: 400px; height:450px; background: rgba(255,255,255,0.95); border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); z-index: 2000; border: 1px solid #eee; font-family: system-ui, -apple-system, sans-serif; transition: transform 0.3s ease; } .panel-header { display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #f0f0f0; cursor: move; } .close-btn { background: none; border: none; font-size: 1.5em; color: #666; cursor: pointer; transition: color 0.2s; } .close-btn:hover { color: #ff4444; } .metrics-container { padding: 16px; } .metric-item { margin-bottom: 12px; display: flex; justify-content: space-between; } .metric-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 15px; } .metric-box { padding: 12px; border-radius: 8px; text-align: center; background: #f8f9fa; } .metric-box .title { font-size: 0.9em; color: #666; margin-bottom: 6px; } .metric-box .count { font-weight: 600; font-size: 1.2em; } .metric-box input { font-weight: 600; font-size: 1.2em; width: 40%; } .success { background: #e8f5e9; color: #2e7d32; } .error { background: #ffebee; color: #c62828; } .speed { background: #fff3e0; color: #ef6c00; } .config-item { background: #f0f4ff !important; padding: 15px !important; } .config-input { width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; margin-top: 8px; transition: all 0.3s ease; } .config-input:focus { border-color: #4a90e2; box-shadow: 0 0 5px rgba(74,144,226,0.3); outline: none; } /* 验证码输入组 */ .config-group { display: flex; gap: 8px; margin-top: 10px; } .code-input { flex: 1; letter-spacing: 2px; } .verify-btn { background: #4a90e2; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; transition: background 0.3s; } .verify-btn:hover { background: #357abd; } /* 输入验证提示 */ input:invalid { border-color: #ff4444; animation: shake 0.5s; } @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(5px); } 75% { transform: translateX(-5px); } } .purchase-item { margin: 8px 0; } .purchase-link { color: #FF4DAF; text-decoration: underline; transition: color 0.2s; } .purchase-link:hover { color: #ff1f9f; } .price-tag { font-size: 0.9em; } `)
        GM_addStyle(`.button-3 { position: fixed; appearance: none; background-color: #e52b13; border: 1px solid rgba(27, 31, 35, .15); border-radius: 6px; box-shadow: rgba(27, 31, 35, .1) 0 1px 0; box-sizing: border-box; color: #ffffff; cursor: pointer; display: inline-block; font-family: -apple-system,system-ui,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"; font-size: 14px; font-weight: 600; line-height: 20px; padding: 6px 16px; left: 0px; bottom: 470px; text-align: center; text-decoration: none; user-select: none; -webkit-user-select: none; touch-action: manipulation; vertical-align: middle; white-space: nowrap; } .button-3:focus:not(:focus-visible):not(.focus-visible) { box-shadow: none; outline: none; } .button-3:hover { background-color: #2c974b; } .button-3:focus { box-shadow: rgba(46, 164, 79, .4) 0 0 0 3px; outline: none; } .button-3:disabled { background-color: #94d3a2; border-color: rgba(27, 31, 35, .1); color: rgba(255, 255, 255, .8); cursor: default; } .button-3:active { background-color: #298e46; box-shadow: rgba(20, 70, 32, .2) 0 1px 0 inset; }`)
        class AutomationStatusPanel {
            constructor() {
                this.panelId = 'auto-status-panel';
                this.link=""
                this.config  = {
                    maxWaitTime: 150,
                    authCode: '',
                    isVerified: false
                };
                this.state = {
                    isVisible: false,
                    lastUpdate: Date.now(),
                    metrics: {
                        runTime: 0,
                        currentTask: '',
                        successCount: 0,
                        errorCount: 0,
                        speed: 0
                    },
                    timer:null
                };
                this.initPanel();
                this.toggleVisibility(true);
            }
            // 初始化状态面板
            initPanel() {
                if (!document.getElementById(this.panelId))  {
                    const template = ` <div id="${this.panelId}"  class="automation-panel"> <div class="panel-header"> <h2>🤖 自动化运行脚本</h2> <label>v${GM_info.script.version}</label> <!--                        <button class="close-btn">&times;</button>--> </div> <div class="metrics-container"> <div class="metric-item"> <span class="label">🕒 运行时长：</span> <span class="value" id="run-time">0m 0s</span> </div> <div class="metric-item"> <span class="label">📌 当前任务：</span> <span class="value" id="current-task">空闲</span> </div> <div class="metric-grid"> <!--                            <div class="metric-box success">--> <!--                                <div class="title">✅ 成功</div>--> <!--                                <div class="count" id="success-count">0</div>--> <!--                            </div>--> <!--                            <div class="metric-box error">--> <!--                                <div class="title">❌ 失败</div>--> <!--                                <div class="count" id="error-count">0</div>--> <!--                            </div>--> <!--                            <div class="metric-box speed">--> <!--                                <div class="title">⚡ 速度</div>--> <!--                                <div class="count" id="speed">常速</div>--> <!--                            </div>--> </div> <div class="metric-box config-item"> <div class="title">⏳ 单个课程最大等待时间（分钟）(授权码使用时有效)</div> <input type="number" id="max-wait-time" class="config-input" min="1" max="300" step="1" value="150" data-preset="advanced"> </div> <div class="metric-box config-item"> <div class="title">🔑 验证码功能</div> <div class="config-group"> <input type="text" id="auth-code" class="config-input code-input" placeholder="输入授权码" maxlength="16" data-preset="advanced"> <button class="verify-btn">✅ 验证</button> </div> </div> <div> <li>前往购买链接：</li> ${this.linkHtml()} </div> </div> </div> `;
                    document.body.insertAdjacentHTML('beforeend',  template);
                    this.bindEvents();
                    // 绑定配置输入事件
                    document.getElementById('max-wait-time').addEventListener('change',  (e) => {
                        this.config.maxWaitTime  = Math.min(300,  Math.max(1,  e.target.valueAsNumber));
                        this.saveConfig();
                    });
                    document.getElementById('auth-code').addEventListener('input',  (e) => {
                        if(e.target.value.length === 16){
                            this.config.authCode  = e.target.value;
                            this.saveConfig();
                        }
                    });
                    document.querySelector('.verify-btn').addEventListener('click',  () => {
                        this.validateAuthCode().then(r =>{} );
                    });
                    this.loadConfig();  // 加载保存的配置
                    // this.loadStyles();
                }}
            linkHtml(){
                const link=[
                    "https://68n.cn/IJ8QB",
                    "https://68n.cn/RM9ob",
                ]
                let list=''
                for(let i=0;i<link.length;i++){
                    list+=` <li class="purchase-item"> 前往<a href="${link[i]}" target="_blank" class="purchase-link" data-track="purchase_click"> 授权码获取页面${i+1} </a> <span class="price-tag">（不定时放出免费/优惠授权码）</span> </li> `
                }
                return list
            }
            // 绑定交互事件
            bindEvents() {
                const panel = document.getElementById(this.panelId);
                // panel.querySelector('.close-btn').addEventListener('click',  () => {
                //    this.toggleVisibility(false);
                // });
                // 实现拖拽功能
                let isDragging = false;
                let offset = [0,0];
                panel.querySelector('.panel-header').addEventListener('mousedown',  (e) => {
                    isDragging = true;
                    offset = [
                        panel.offsetLeft  - e.clientX,
                        panel.offsetTop  - e.clientY
                    ];
                });
                document.addEventListener('mousemove',  (e) => {
                    if (isDragging) {
                        panel.style.left  = `${e.clientX  + offset[0]}px`;
                        panel.style.top  = `${e.clientY  + offset[1]}px`;
                    }
                });
                document.addEventListener('mouseup',  () => {
                    isDragging = false;
                });
            }
            // 更新状态数据
            updateMetrics(data) {
                if(data?.successCount==="add"){
                    delete data.successCount
                    this.state.metrics.successCount++
                }
                if(data?.errorCount==="add"){
                    delete data.errorCount
                    this.state.metrics.errorCount++
                }
                Object.assign(this.state.metrics,  data);
                this.state.lastUpdate  = Date.now();

                // 实时更新DOM
                document.getElementById('run-time').textContent  =
                    `${Math.floor(this.state.metrics.runTime/60)}m  ${this.state.metrics.runTime%60}s`;
                document.getElementById('current-task').textContent  =
                    this.state.metrics.currentTask  || '空闲';
                // document.getElementById('success-count').textContent  =
                //     this.state.metrics.successCount;
                // document.getElementById('error-count').textContent  =
                //     this.state.metrics.errorCount;
                // document.getElementById('speed').textContent  =
                //     `${this.state.metrics.speed}/min`;
            }
            // 控制显示/隐藏
            toggleVisibility(show = true) {
                const panel = document.getElementById(this.panelId);
                if (panel) {
                    panel.style.display  = show ? 'block' : 'none';
                    this.state.isVisible  = show;
                }}
            // 自动更新计时器
            startAutoUpdate() {
                if(!this.state.timer){
                    this.state.timer=setInterval(() => {
                        this.state.metrics.runTime  = Math.floor(
                            (Date.now()  - this.state.startTime)  / 1000
                        );
                        this.updateMetrics({});  // 触发界面更新
                    }, 1000);
                }}
            // 完整生命周期管理
            startMonitoring() {
                this.initPanel();
                this.toggleVisibility(true);
                this.state.startTime  = Date.now();
                this.startAutoUpdate();
            }
            stopMonitoring() {
                clearInterval(this.state.timer)
                // this.toggleVisibility(false);
                // const panel = document.getElementById(this.panelId);
                // panel?.remove();
            }
            // 验证码校验方法
            async validateAuthCode() {
                try {
                    const isValid = await this.checkAuthCode(this.config.authCode);
                    console.log("验证结果：",isValid)
                    if (isValid) {
                        this.config.isVerified  = true;
                        this.saveConfig();
                        try {
                            Swal.fire({
                                title: "验证成功！",
                                text: "高级功能已启用!已完全自动化！",
                                icon: 'success',
                                confirmButtonColor: "#FF4DAFFF",
                                confirmButtonText: "关闭",
                                timer: 2000,
                            })
                            // layer.msg('✅  验证成功，高级功能已启用', {time: 2000});
                        }catch (e) {

                        }
                        return true
                    } else {
                        try {
                            Swal.fire({
                                title: '<span style="color:#FF4DAF">验证失败！</span>', // HTML标题
                                html: `<div style="text-align:left"> <p style="margin:10px 0">未开启高级功能！请执行以下操作：</p> <ol style="padding-left:20px"> <li>手动点击下一课程,继续使用基础功能</li> <li>前往购买链接：</li> ${this.linkHtml()} </ol> </div>`,
                                icon: 'error',
                                showConfirmButton: true,
                                confirmButtonText: '我知道了',
                                confirmButtonColor: '#FF4DAF',
                                showCloseButton: true, // 显示关闭按钮
                                allowOutsideClick: false, // 禁止点击外部关闭
                                allowEscapeKey: false,   // 禁止ESC关闭
                                timer: 0,               // 禁止自动关闭
                                customClass: {
                                    popup: 'custom-swal-popup',
                                    title: 'custom-swal-title',
                                    content: 'custom-swal-content'
                                }
                            });
                            // layer.msg('❌  验证码无效', {time: 2000, icon: 2});
                        }catch (e) {}
                    }
                } catch (error) {
                    console.error(' 验证服务异常:', error.toString());
                    Swal.fire({
                        title: "验证失败！",
                        text: error.toString(),
                        icon: 'error',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "关闭"
                    })
                }
                return false
            }
            // 配置持久化
            saveConfig() {
                const data=JSON.stringify({
                    maxWaitTime: parseInt(document.getElementById('max-wait-time').value),
                    lastAuthCode: document.getElementById('auth-code').value})
                GM_setValue('autoConfig', data );
                console.log("设置存储：",data)
            }
            getMaxTime(){
                return parseInt(document.getElementById('max-wait-time').value)*60*1000
            }
            loadConfig() {
                const saved = GM_getValue('autoConfig');
                console.log("加载存储：",saved)
                if (saved) {
                    const { maxWaitTime, lastAuthCode } = JSON.parse(saved);
                    document.getElementById('max-wait-time').value  = maxWaitTime;
                    document.getElementById('auth-code').value  = lastAuthCode;
                    this.config.maxWaitTime  = maxWaitTime;
                    this.config.authCode  = lastAuthCode;
                }}
            async checkAuthCode(code) {
                const AUTH_CODE_REGEX = /^[A-Z0-9]{16}$/;
                if(code===""){
                    return false
                }
                if(!AUTH_CODE_REGEX.test(code)){
                    throw Error("格式错误，应为16位大写字母或数字！")
                }
                // 制作不易，未从服务器加载关键函数
                // 还请多多支持，勿修改判断代码
                const res=await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        'url': "https://fc-mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.next.bspapp.com/validCode?authCode="+code,
                        method: 'GET',
                        onload: function (res) {
                            console.log('请求成功')
                            console.log(res)
                            if (res.status === 200) {
                                const result=JSON.parse(res.response)
                                if(result.code===200){
                                    resolve(result)
                                }else {
                                    reject(result.msg)
                                }
                            }else {
                                reject('服务器拒绝：'+res.response)
                            }
                        },
                        onerror: function (err) {
                            console.error(err)
                            reject('请求错误！' + err.toString())
                        }})})
                return res.code === 200;
            }}
        class AutoStudyDetailNew{
            constructor(config = {}) {
                // 初始化配置合并
                this.config  = {
                    onlyTime:true,
                    requestTemplates: {
                        insertStudyRecord: {
                            url: "https://pn202413060.stu.teacher.com.cn/studyRecord/insertStudyRecord",
                            method: "POST"
                        },
                        findStudyTime: {
                            url: "https://pn202413060.stu.teacher.com.cn/course/findCourseStudyTime",
                            method: "POST"
                        }
                    },
                    selectors: {
                        catalog: ".course-type-item ul li",
                        video: ".ccH5playerBox video"
                    },
                    ...config
                };
                // 状态管理
                this.state  = {
                    studyTimer: unsafeWindow.StudyTimeClockEle,
                    courseStudyTime: unsafeWindow.courseStudyTime,
                    worker: null,
                    originalMethods: {
                        consoleClear: unsafeWindow.console.clear,
                        startTimeClock: unsafeWindow.startTimeClock
                    }
                };
                this.statusPanel=new AutomationStatusPanel()
                this.statusPanel.startMonitoring()
                // 自动绑定方法
                this.handleXHR  = this.handleXHR.bind(this);
                this.onVisibilityChange  = this.onVisibilityChange.bind(this);
            }
            // 主初始化入口
            async init() {
                layer.msg('自动化脚本加载成功！', { icon: 1, zIndex: 19891033 }, function () {})
                setTimeout(()=>{
                    layer.tips(' 自动化脚本 运行中...', '#projectIitle a', {
                        tips: 2,
                        time: 0,
                        closeBtn: true,
                    });
                },2000)
                this.setupXHRInterceptor();
                // this.patchGlobalMethods();
                this.setupEventListeners();
                this.clearPauseHandler();
                // this.startBackgroundWorker();
                unsafeWindow.startTimeClock = this.reloadStartTimeClock
                if (!(await this.statusPanel.validateAuthCode())) {
                    Swal.fire({
                        title: '<span style="color:#FF4DAF">验证失败！</span>', // HTML标题
                        html: `<div style="text-align:left"> <p style="margin:10px 0">未开启高级功能！脚本不会自动填写验证码窗口！</p> <ol style="padding-left:20px"> <li>继续使用基础功能：</li> <li>自动播放</li> <li>自动下一个(自动点击阻止弹窗)</li> <li>前往购买链接：</li> ${this.statusPanel.linkHtml()} </ol> </div>`,
                        icon: 'error',
                        showConfirmButton: true,
                        confirmButtonText: '我知道了',
                        confirmButtonColor: '#FF4DAF',
                        showCloseButton: true, // 显示关闭按钮
                        allowOutsideClick: false, // 禁止点击外部关闭
                        allowEscapeKey: false,   // 禁止ESC关闭
                        timer: 0,               // 禁止自动关闭
                        customClass: {
                            popup: 'custom-swal-popup',
                            title: 'custom-swal-title',
                            content: 'custom-swal-content'
                        }
                    });
                    this.handleValidateCodeDialog()
                }else {
                    unsafeWindow.getStudyTime = this.reloadGetStudyTime
                }
                await this.autoStudy();
            }
            handleValidateCodeDialog (timeout=5000) {
                let intervalId = null; // 定时器 ID
                const checkInterHandle = async () => {
                    const dialogSelector = ".layui-layer";
                    const codeValID = "codespan";
                    const codeInputID = "code";
                    const submitSelector = ".layui-layer-btn0";
                    try {
                        // 获取验证码显示元素和输入框
                        const val = document.getElementById(codeValID);
                        const input = document.getElementById(codeInputID);
                        const subBtn = document.querySelector(submitSelector);

                        // 如果验证码弹窗存在
                        if (val && input && subBtn) {
                            console.log("检测到验证码弹窗!");
                            if (intervalId) {
                                clearInterval(intervalId);
                                // intervalId = setInterval(checkInterHandle, timeout);
                            }
                            if (!(await this.statusPanel.validateAuthCode())) {
                                Swal.fire({
                                    title: '<span style="color:#FF4DAF">检测到验证码弹窗！</span>', // HTML标题
                                    html: `<div style="text-align:left"> <p style="margin:10px 0">未开启高级功能！脚本不会自动填写验证码窗口！</p> <ol style="padding-left:20px"> <li>前往购买链接：</li> ${this.statusPanel.linkHtml()} </ol> </div>`,
                                    icon: 'info',
                                    showConfirmButton: true,
                                    confirmButtonText: '我知道了',
                                    confirmButtonColor: '#FF4DAF',
                                    showCloseButton: true, // 显示关闭按钮
                                    allowOutsideClick: false, // 禁止点击外部关闭
                                    allowEscapeKey: false,   // 禁止ESC关闭
                                    timer: 0,               // 禁止自动关闭
                                    customClass: {popup: 'custom-swal-popup', title: 'custom-swal-title', content: 'custom-swal-content'}
                                }).then(()=>{
                                    // 重新设置定时器
                                    intervalId = setInterval(checkInterHandle, timeout);
                                    console.log("重新设置定时器！")
                                })}}
                    } catch (e) {
                        console.error("异步检测挂机验证错误：" + e);
                        // 发生错误时重新设置定时器
                        if (!intervalId) {
                            intervalId = setInterval(checkInterHandle, timeout);
                        }}};
                // 初始化定时器
                intervalId = setInterval(checkInterHandle, timeout);
            };
            // XHR 拦截系统
            setupXHRInterceptor() {
                /** @type {function[]} */
                const callbacks = [];
                const originalSend = XMLHttpRequest.prototype.send;
                XMLHttpRequest.prototype.send  = function() {
                    callbacks.forEach(cb  => cb(this));
                    originalSend.apply(this,  arguments);
                };
                this.addXHRCallback(this.handleXHR);
            }
            /**
             * 添加XHR回调
             * @param {function(XMLHttpRequest): void} callback
             */
            addXHRCallback(callback) {
                XMLHttpRequest.callbacks  = XMLHttpRequest.callbacks  || [];
                XMLHttpRequest.callbacks.push(callback);
            }
            /**
             * XHR响应处理
             * @param {XMLHttpRequest} xhr
             */
            handleXHR(xhr) {
                xhr.addEventListener("load",  () => {
                    if (xhr.readyState  === 4 && xhr.status  === 200) {
                        const { findStudyTime, insertStudyRecord } = this.config.requestTemplates;
                        if (xhr.responseURL.includes(findStudyTime.url))  {
                            console.log("捕获请求数据：", JSON.parse(xhr.response));
                        } else if (xhr.responseURL.includes(insertStudyRecord.url))  {
                            // this.handleRecordInsertResponse(JSON.parse(xhr.response));
                        }}});}
            // 定时器控制系统
            reloadStartTimeClock() {
                if (unsafeWindow.StudyTimeClockEle)  {
                    clearInterval(unsafeWindow.StudyTimeClockEle);
                    unsafeWindow.courseStudyTime++;
                }
                unsafeWindow.StudyTimeClockEle  = setInterval(() => {
                    unsafeWindow.courseStudyTime++;
                    window.sessionStorage.setItem("courseStudyTime", unsafeWindow.courseStudyTime);
                }, 1000);
            }
            // 事件监听管理
            setupEventListeners() {
                document.addEventListener('visibilitychange',  this.onVisibilityChange);
            }
            clearPauseHandler () {
                unsafeWindow.on_CCH5player_pause = function () {
                    console.log("视频暂停了，计时继续...")
                    unsafeWindow.startTimeClock()
                }
                console.log(window.on_CCH5player_pause)
                /*video.addEventListener('pause', function (event) { console.log('视频暂停事件触发'); // 阻止其他监听器的执行 event.stopImmediatePropagation(); },true);*/
            }
            onVisibilityChange() {
                if (document.visibilityState  === 'hidden') {
                    this.reloadStartTimeClock();
                }
            }
            reloadGetStudyTime(period) {
                $.ajax({
                    url: '../course/findCourseStudyTime',
                    type: "post",
                    data: {
                        "courseCode": courseCode,
                        "userId": userId,
                        "studyPlanId": studyPlanId,
                        "period": period
                    },
                    success: function(result) {
                        if(result.isSuccess==1) {
                            if(result.data) {
                                var studyTime=result.data.studyTime>0? result.data.studyTime:0
                                var totalTime=result.data.totalTime
                                var courseStudyTimeSet=result.data.courseStudyTimeSet? result.data.courseStudyTimeSet:45
                                $("#courseStudyTimeNumber").text(parseFloat(totalTime/courseStudyTimeSet).toFixed(1))
                                $("#courseStudyBestMinutesNumber").text(totalTime)
                                if(!hebeiHideStudyTimeRule()) {
                                    $("#studyTimeRule").text("（1学时="+result.data.courseStudyTimeSet+"分钟）")
                                }
                                if(result.data.tag==1&&studyTime>=totalTime) { //设置了单科最高累计时长
                                    $("#courseStudyMinutesNumber").text(studyTime)
                                    $("#bestMinutesTips").show()
                                } else {
                                    $("#bestMinutesTips").hide()
                                    $("#courseStudyMinutesNumber").text(studyTime)
                                }
                                if(result.data.isPopover&&result.data.isPopover==1) {
                                    console.log("时间溢出，进入弹窗验证...")
                                    const code=getCourseValidateCode()
                                    $.ajax({
                                        type: "post",
                                        async: false,
                                        url: "/studyRecord/validateCourseCode",
                                        data: {"courseValidateCode": code},
                                        success: function(result) {
                                            if(result.isSuccess===1) {
                                                layer.msg('验证码校验成功，请继续学习！', { icon: 1, zIndex: 19891033 }, function () {
                                                    try {
                                                        if(player) {
                                                            player.play()
                                                        }
                                                    } catch(e) {}
                                                    startTimeClock() //继续开始学习时长计时
                                                })
                                            } else {
                                                layer.msg('验证码校验失败，请重新验证！', { icon: 2, zIndex: 19891033 })
                                            }}})}
                                if(result.data.isFacialCapture&&result.data.isFacialCapture==1) {
                                    console.log("人脸捕捉")
                                    let data ={
                                        projectId:$.cookie('projectId'),
                                        courseCode:getUrlParam('courseCode'),
                                        courseName:getUrlParam('courseName')
                                    }
                                    window.opencvMud.getOpencvImg(data);
                                }}}}})}
            validateFinish () {
                const maxID = "courseStudyBestMinutesNumber"
                const curID = "courseStudyMinutesNumber"
                const max = document.getElementById(maxID);
                const cur = document.getElementById(curID);
                if (max && cur) {
                    const maxVal = Number(max.innerText);
                    const curVal = Number(cur.innerText);
                    // console.log("最大学习时间：",maxVal)
                    // console.log("学习时间：",curVal)
                    if (maxVal !== 0 && curVal !== 0 && maxVal <= curVal) {
                        console.log("学习时间已到达最大！")
                        return true
                    }}
                return false;
            }
            sendMsg  (msg) {
                // 创建 BroadcastChannel
                const channel = new BroadcastChannel('my-channel');
                channel.postMessage(msg);
            }
            finish() {
                this.sendMsg('finish')
                if (Swal) {
                    Swal.fire({
                        title: "刷课成功！",
                        text: `学习时间已达到最大值`,
                        icon: 'success',
                        // showCancelButton: true,
                        confirmButtonColor: "#FF4DAFFF",
                        // cancelButtonText: "取消，等会刷新",
                        confirmButtonText: "点击关闭页面，2s后自动关闭页面",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // 尝试关闭当前页面
                            try {
                                window.close(); // 关闭当前页面
                            } catch (error) {
                                console.error("无法直接关闭页面：", error);
                                // 如果无法直接关闭页面，提示用户手动关闭
                                Swal.fire({
                                    title: "无法自动关闭页面",
                                    text: "请手动关闭此页面。",
                                    icon: 'warning',
                                    confirmButtonColor: "#FF4DAFFF",
                                    confirmButtonText: "确定",
                                });}}});}
                setTimeout(() => {
                    window.close();
                }, 2000)
            }
            getCatalogType(catalogEle) {
                const type = catalogEle.getAttribute("data-type")
                if (type) {
                    if (type === "1" || type === "视频") {
                        return 1
                    } else if (type === "2" || type === "文档") {
                        return 2
                    } else if (type === "6" || type === "随堂小测") {
                        return 6
                    }
                } else {
                    throw Error("no type get error！type：" + type)
                }
                return undefined;
            }
            /**
             * 获取视频节点
             * @param {string} videoNodeSelector - 视频元素选择器
             * @param {number} timeout - timeout
             * @returns {Promise<HTMLElement>}
             */
            async getStudyVideoNode  (videoNodeSelector, timeout = 10000) {
                return new Promise(async (resolve, reject) => {
                    try {
                        // 超时处理
                        const timeoutId = setTimeout(() => {
                            console.error("获取视频节点超时");
                            clearInterval(internal); // 清除定时器
                            resolve(null); // 返回 null
                        }, timeout);
                        // 定期检查视频节点
                        const internal = setInterval(() => {
                            try {
                                const videoNode = document.querySelector(videoNodeSelector);
                                if (videoNode && videoNode.readyState >= 3) {
                                    console.log("video ready!");
                                    clearTimeout(timeoutId); // 清除超时定时器
                                    clearInterval(internal); // 清除检查定时器
                                    resolve(videoNode); // 返回视频节点
                                } else {
                                    console.log("未检查到 video，继续检查...");
                                }
                            } catch (error) {
                                console.error("检查视频节点时出错：", error);
                                clearTimeout(timeoutId); // 清除超时定时器
                                clearInterval(internal); // 清除检查定时器
                                resolve(null); // 返回 null
                            }
                        }, 1000); // 每隔 1 秒检查一次
                    } catch (error) {
                        console.error("检查视频错误：", error);
                        resolve(null); // 返回 null
                    }})};
            /**
             *
             * @param catalogSelector
             * @param timeout
             * @returns {Promise<NodeList>}
             */
            async getCatalogNode  (catalogSelector, timeout = 10000) {
                return new Promise(async (resolve, reject) => {
                    try {
                        // 超时处理
                        const timeoutId = setTimeout(() => {
                            console.error("获取章节节点超时");
                            clearInterval(internal); // 清除定时器
                            resolve(null); // 返回 null
                        }, timeout);
                        // 定期检查视频节点
                        const internal = setInterval(() => {
                            try {
                                const catalogNode = document.querySelectorAll(catalogSelector);
                                if (catalogNode && catalogNode.length > 0) {
                                    console.log("catalogNode ready!");
                                    clearTimeout(timeoutId); // 清除超时定时器
                                    clearInterval(internal); // 清除检查定时器
                                    resolve(catalogNode);
                                } else {
                                    console.log("未检查到 catalogNode，继续检查...");
                                }
                            } catch (error) {
                                console.error("检查章节节点时出错：", error);
                                clearTimeout(timeoutId); // 清除超时定时器
                                clearInterval(internal); // 清除检查定时器
                                resolve(null); // 返回 null
                            }
                        }, 1000); // 每隔 1 秒检查一次
                    } catch (error) {
                        console.error("检查章节错误：", error);
                        resolve(null); // 返回 null
                    }})};
            /**
             * 视频播放完毕的监听
             * @param video
             * @returns {Promise<unknown>}
             */
            waitForVideoEnd(video) {
                return new Promise(resolve => {
                    // 防止视频暂停
                    const checkInterval = setInterval(async () => {
                        /*if (!(new Date() <= new Date('2025/1/11'))) {
                            video.pause()
                            return
                        }*/
                        // clearPauseHandler()
                        try {
                            if (video && video.paused) {
                                console.log("视频暂停了，重新开始播放...");
                                await video.play();

                            }
                            if (!video.src) {
                                console.error("视频源未设置，即将重新加载");
                                setTimeout(() => {
                                    location.reload()
                                }, 5000)
                            }
                            // console.log("计时器时间：", courseStudyTime)
                            if (courseStudyTime && courseStudyTime >= 400) {
                                console.log("计时器长时间：溢出,10s后刷新页面")
                                unsafeWindow.courseStudyTime = 250
                                window.sessionStorage.setItem("courseStudyTime", courseStudyTime)
                                addStudyRecord()
                                setTimeout(() => {
                                    location.reload();
                                }, 10000)
                            }
                            if (this.validateFinish()) {
                                setTimeout(() => {
                                    this.finish()
                                }, 2000)
                            }

                        } catch (e) {
                            console.error("checkInterval error:", e);
                            clearInterval(checkInterval);
                            setTimeout(()=>{
                                location.reload()
                            },2000);
                        }
                    }, 2000);
                    //每三分钟手动更新时间
                    /*const autoUpdateInterval = setInterval(async () => {
                        try {
                            console.log("定时任务：更新时间...")



                        } catch (e) {
                            console.error("autoUpdateInterval error:", e);
                            clearInterval(autoUpdateInterval);
                        }
                    },1000*60*2)*/
                    video.addEventListener('ended', () => {
                        clearInterval(checkInterval);
                        // clearInterval(autoUpdateInterval);
                        const inter = setInterval(() => {
                            try {
                                const dialogTitle = ".layui-layer-title";
                                const dialogBtn = ".layui-layer-btn0";
                                // 获取验证码显示元素和输入框
                                const title = document.querySelector(dialogTitle);
                                const btn = document.querySelector(dialogBtn);
                                // 如果验证码弹窗存在
                                if (title && title.innerText === "信息" && btn && btn.innerText.includes("我知道了")) {
                                    console.log("检测到阻止继续弹窗，自动点击...");
                                    btn.click();
                                    clearInterval(inter);
                                    console.log("视频播放完成！")
                                    resolve();
                                }
                            } catch (e) {
                                console.error("阻止继续弹窗错误：" + e)
                                clearInterval(inter);
                            }
                        }, 2000)

                    }, {once: true}); // 监听视频结束事件
                });
            }
            /**
             * 睡眠
             * @param time
             * @returns {Promise<unknown>}
             */
            sleep  (time) {
                return new Promise(resolve => setTimeout(resolve, time * 1000));
            }
            async autoStudy   () {
                let catalogList = await this.getCatalogNode(this.config.selectors.catalog);
                if (catalogList) {
                    catalogList = Array.from(catalogList);
                    for (const element of catalogList) {
                        if (this.config.onlyTime) {
                            // const finish =await refreshStudy();
                            const finish = this.validateFinish();
                            if (finish) {
                                break;
                            }

                        } else {
                            await this.sleep(2)
                        }

                        console.log(`==============${element.title}==============`)
                        this.statusPanel.updateMetrics({
                            currentTask:element.title
                        })
                        element.click()
                        const type = this.getCatalogType(element)
                        let video;
                        switch (type) {
                            // 视频
                            case 1:
                                console.log("type：视频")
                                video = await this.getStudyVideoNode(this.config.selectors.video);
                                if (video) {
                                    video.muted = true;
                                    video.play();

                                    /*setTimeout(()=>{
                                        video.pause()
                                    },60000)*/
                                    await this.waitForVideoEnd(video)
                                    if (!(await this.statusPanel.validateAuthCode())) {
                                        Swal.fire({title: '<span style="color:#FF4DAF">验证失败！</span>', /* HTML标题 */ html: `<div style="text-align:left"> <p style="margin:10px 0">未开启高级功能！</p> <ol style="padding-left:20px"> <li>前往购买链接：</li> ${this.statusPanel.linkHtml()} </ol> </div>`, icon: 'error', showConfirmButton: true, confirmButtonText: '我知道了', confirmButtonColor: '#FF4DAF', showCloseButton: true, timer: 2000, customClass: {popup: 'custom-swal-popup', title: 'custom-swal-title', content: 'custom-swal-content'}});
                                    }}
                                break;
                            case 2:
                                console.log("type：文档")
                                await this.sleep(5)
                                break;
                            case 6:
                                console.log("type：随堂小测");
                                await this.sleep(5)
                                break;
                        }}
                    await this.sleep(2)
                    const isFinish = this.validateFinish();
                    //仍未完成
                    if (!isFinish) {
                        location.reload()
                    } else {
                        this.finish()
                    }}}}
        class AutoStudyDetailOld{
            constructor(config = {}) {
                this.statusPanel=new AutomationStatusPanel()
                this.statusPanel.startMonitoring()
            }
            async init() {
                setInterval(() => {
                    const isFinish = this.validateFinish()
                    if (isFinish) {
                        this.finish()
                    } else {
                        console.log(new Date())
                        console.log("仍未完成...")
                    }
                }, 1000 * 60)
                if (!(await this.statusPanel.validateAuthCode())) {
                    Swal.fire({title: '<span style="color:#FF4DAF">验证失败！</span>', /* HTML标题 */ html: `<div style="text-align:left"> <p style="margin:10px 0">未开启高级功能！脚本不会自动填写验证码窗口！</p> <ol style="padding-left:20px"> <li>继续使用基础功能：</li> <li>自动播放</li> <li>自动下一个(自动点击阻止弹窗)</li> <li>前往<a href="/purchase" style="color:#FF4DAF;text-decoration:underline" onmouseover="this.style.color='#ff1f9f'" onmouseout="this.style.color='#FF4DAF'"> 授权码购买页面 </a>（限时特价1元） </li> </ol> </div>`, icon: 'error', showConfirmButton: true, confirmButtonText: '我知道了', confirmButtonColor: '#FF4DAF', showCloseButton: true, /* 显示关闭按钮 */ allowOutsideClick: false, /* 禁止点击外部关闭 */ allowEscapeKey: false,   /* 禁止ESC关闭 */ timer: 0,               /* 禁止自动关闭 */ customClass: {popup: 'custom-swal-popup', title: 'custom-swal-title', content: 'custom-swal-content'}});
                }else {
                    this.handleValidateCodeDialog()
                }
            }
            handleValidateCodeDialog (timeout=5000) {
                let intervalId = null; // 定时器 ID
                const checkInterHandle = async () => {
                    const dialogSelector = ".layui-layer";
                    const codeValID = "codespan";
                    const codeInputID = "code";
                    const submitSelector = ".layui-layer-btn0";
                    try {
                        // 获取验证码显示元素和输入框
                        const val = document.getElementById(codeValID);
                        const input = document.getElementById(codeInputID);
                        const subBtn = document.querySelector(submitSelector);
                        // 如果验证码弹窗存在
                        if (val && input && subBtn) {
                            console.log("检测到验证码弹窗，自动填写并提交...");
                            if (!(await this.statusPanel.validateAuthCode())) {
                                Swal.fire({title: '<span style="color:#FF4DAF">验证失败！</span>', /* HTML标题 */ html: `<div style="text-align:left"> <p style="margin:10px 0">未开启高级功能！脚本不会自动填写验证码窗口！</p> <ol style="padding-left:20px"> <li>前往<a href="/purchase" style="color:#FF4DAF;text-decoration:underline" onmouseover="this.style.color='#ff1f9f'" onmouseout="this.style.color='#FF4DAF'"> 授权码购买页面 </a>（限时特价1元） </li> </ol> </div>`, icon: 'error', showConfirmButton: true, confirmButtonText: '我知道了', confirmButtonColor: '#FF4DAF', showCloseButton: true, /* 显示关闭按钮 */ allowOutsideClick: false, /* 禁止点击外部关闭 */ allowEscapeKey: false,   /* 禁止ESC关闭 */ timer: 0,               /* 禁止自动关闭 */ customClass: {popup: 'custom-swal-popup', title: 'custom-swal-title', content: 'custom-swal-content'}});
                                if (intervalId) {
                                    clearInterval(intervalId);
                                    intervalId = setInterval(checkInterHandle, timeout);
                                }
                                return
                            }
                            // 清除定时器
                            if (intervalId) {
                                clearInterval(intervalId);
                                intervalId = null;
                            }
                            // 填写验证码
                            await this.sleep(3); // 等待 3 秒
                            input.value = val.innerText;
                            // 点击提交按钮
                            await this.sleep(3); // 等待 3 秒
                            subBtn.click();
                            console.log("验证码已自动提交");
                            // 重新设置定时器
                            intervalId = setInterval(checkInterHandle, timeout);
                        }
                    } catch (e) {
                        console.error("异步检测挂机验证错误：" + e);
                        // 发生错误时重新设置定时器
                        if (!intervalId) {
                            intervalId = setInterval(checkInterHandle, timeout);
                        }}};
                // 初始化定时器
                intervalId = setInterval(checkInterHandle, timeout);
            };
            sleep  (time) {
                return new Promise(resolve => setTimeout(resolve, time * 1000));
            }
            validateFinish (){
                const maxID="courseStudyBestMinutesNumber"
                const curID="courseStudyMinutesNumber"
                const max=document.getElementById(maxID);
                const cur=document.getElementById(curID);
                if(max && cur){
                    const maxVal=Number(max.innerText);
                    const curVal=Number(cur.innerText);
                    console.log("最大学习时间：",maxVal)
                    console.log("学习时间：",curVal)
                    if(maxVal!==0 && curVal!==0 && maxVal<=curVal ){
                        console.log("学习时间已到达最大！")
                        return true
                    }
                }
                return false;
            }
            sendMsg (msg) {
                // 创建 BroadcastChannel
                const channel = new BroadcastChannel('my-channel');
                channel.postMessage(msg);
            }
            finish (){
                this.sendMsg('finish')
                if (Swal) {
                    Swal.fire({title: "刷课成功！", text: `学习时间已达到最大值`, icon: 'success',/* showCancelButton: true, */ confirmButtonColor: "#FF4DAFFF",/* cancelButtonText: "取消，等会刷新", */ confirmButtonText: "点击关闭页面，2s后自动关闭页面",}).then((result) => {
                        if (result.isConfirmed) {
                            // 尝试关闭当前页面
                            try {
                                window.close(); // 关闭当前页面
                            } catch (error) {
                                console.error("无法直接关闭页面：", error);
                                // 如果无法直接关闭页面，提示用户手动关闭
                                Swal.fire({title: "无法自动关闭页面", text: "请手动关闭此页面。", icon: 'warning', confirmButtonColor: "#FF4DAFFF", confirmButtonText: "确定",});
                            }}});}
                setTimeout(()=>{
                    window.close();
                },2000)
            }}
        async function main() {
            if (location.href.includes('intoStudentStudy')) {
                const autoStudy = new AutoStudyIndex({
                    catalogSelector: '.con ul li', // 自定义选择器
                });
                autoStudy.init();
                // setTimeout(() => {
                //    autoStudy.showCompletion()
                // }, 1000)
            } else if (location.href.includes("intoSelectCourseVideo")) {
                const domain = new AutoStudyDetailNew()
                await domain.init()
            } else if(location.href.includes("intoSelectCourseUrlVideo")){
                const domain=new AutoStudyDetailOld()
                domain.init()
            }}
        main().then(r => {})
        console.log('师学通平台 启动！！！');
    }}
//中国教育电视台
class HebeiCas{
    constructor() {
    }
    run(config) {

        this.setupCoreFeatures(config);
    }
    setupCoreFeatures({refreshInterval}) {
        class Runner {
            constructor() {
                this.runner = null
                this.run()
            }

            run() {
                const url = location.href;
                if (url.includes("newCourse/list")) {
                    this.runner = new Auto()
                } else if (url.includes("studyNew")) {
                    this.runner = new Course("channel-cas")
                    // this.runner.run()
                }
            }
        }

        class Auto {
            constructor(channel = "channel-my") {
                this.channel = new BroadcastChannel(channel);
                // 配置常量
                this.SELECTORS = {
                    COURSE_LIST: '.list-wrap-item',
                    PROGRESS: '.el-progress__text',
                    BUTTON: '.h-button',
                    TITLE: '.title'
                };
                // 请求配置
                this.API_ENDPOINTS = {
                    WINDOW_COURSE: {
                        url: 'http://cas.study.yanxiu.jsyxsq.com/api/newCourse/windowCourse',
                        method: 'GET'
                    }
                };
                // 运行状态
                this.courseList = [];
                this.shouldStop = false;
                this.requestInterceptor = null;
                this.pannel = new AuthWindow()
                this.VIP = false
                // 初始化流程
                this.initRequestInterceptor();
                this.init()
            }

            init() {
                this.pannel.setOnBegin(() => {
                    this.run().then(r => {
                    })
                })
                this.pannel.setOnVerifyCallback((data) => {
                    Utils.validateCode(data).then(r => {
                    })
                })
                this.loadVIPStatus()
            }

            loadVIPStatus() {
                if (Utils.loadStatus()) {
                    this.pannel.setTip(Utils.vipText)
                    this.VIP = true
                } else {
                    this.pannel.setTip(Utils.baseText)
                    this.VIP = false
                }
                console.log("VIP", this.VIP)
            }

            // 初始化请求拦截
            initRequestInterceptor() {
                const originalXHR = unsafeWindow.XMLHttpRequest;
                const self = this;

                this.requestInterceptor = function () {
                    const xhr = new originalXHR();
                    const originalOpen = xhr.open;
                    const originalSend = xhr.send;

                    // 重写open方法记录请求信息
                    xhr.open = function (method, url) {
                        this._requestMetadata = {method, url};
                        return originalOpen.apply(this, arguments);
                    };

                    // 重写send方法拦截响应
                    xhr.send = function (body) {
                        this.addEventListener('readystatechange', function () {
                            if (this.readyState === 4 &&
                                this._requestMetadata.url.includes(self.API_ENDPOINTS.WINDOW_COURSE.url)) {
                                try {
                                    self.API_ENDPOINTS.WINDOW_COURSE.response = JSON.parse(this.responseText);
                                    console.log("请求捕捉：", self.API_ENDPOINTS.WINDOW_COURSE.response)
                                } catch (e) {
                                    console.error(' 响应解析失败:', e);
                                }
                            }
                        });
                        originalSend.call(this, body);
                    };

                    return xhr;
                };

                unsafeWindow.XMLHttpRequest = this.requestInterceptor;
            }

            // 加载课程列表
            loadCourseList() {
                try {
                    this.courseList = Array.from(document.querySelectorAll(this.SELECTORS.COURSE_LIST));
                    console.log(` 成功加载 ${this.courseList.length}  门课程`);
                } catch (error) {
                    this.handleError(' 课程列表加载失败', error);
                }
            }

            // 主运行逻辑
            async run() {
                try {
                    this.loadCourseList();
                    for (const [index, courseItem] of this.courseList.entries()) {
                        if (this.shouldStop) {
                            console.log(' 脚本已主动停止');
                            await sleep(2000)
                            return;
                        }

                        const courseTitle = courseItem.querySelector(this.SELECTORS.TITLE)?.innerText || `课程 ${index + 1}`;
                        console.log(` 正在处理: ${courseTitle}`);

                        await this.processCourse(courseItem);
                        // 5s等待
                        await sleep(5000)
                    }
                    console.log(' 所有课程处理完成');
                } catch (error) {
                    // this.handleError(' 运行过程中发生错误', error);
                }
            }

            // 处理单个课程
            async processCourse(courseItem) {
                try {
                    if (this.isCourseCompleted(courseItem)) {
                        console.log(' 课程已完成，跳过处理');
                        return;
                    }

                    this.triggerCourseStart(courseItem);
                    const success = await this.verifyWindowOpen();

                    if (!success) {
                        throw new Error('课程窗口未正确打开');
                    }

                    const flag = await this.waitForComplete()

                } catch (error) {
                    this.handleError(' 课程处理失败', error);
                    throw error;
                }
            }

            waitForComplete(timeout) {
                return new Promise((resolve) => {
                    const inter = setInterval(() => {
                        console.log(new Date())
                        console.log("等待当前课程完成.......")
                    }, 5000)
                    this.channel.onmessage = async (event) => {
                        console.log("收到信息：", event.data)
                        await sleep(2000)
                        clearInterval(inter)
                        resolve(event.data === 'finish' ? 0 : 1);
                    };


                });
            }

            // 检查课程进度
            isCourseCompleted(courseItem) {
                const progressText = courseItem.querySelector(this.SELECTORS.PROGRESS)?.innerText;
                return progressText?.includes('100%');
            }

            // 触发课程开始
            triggerCourseStart(courseItem) {
                const button = courseItem.querySelector(this.SELECTORS.BUTTON);
                if (!button) throw new Error('未找到启动按钮');
                button.click();
            }

            // 验证窗口打开状态
            async verifyWindowOpen() {
                return new Promise((resolve, reject) => {
                    const checkInterval = 2000; // 缩短检查间隔
                    const timeout = 6000;      // 超时时间
                    let elapsed = 0;

                    const intervalId = setInterval(() => {
                        elapsed += checkInterval;

                        if (this.API_ENDPOINTS.WINDOW_COURSE.response?.data) {
                            clearInterval(intervalId);
                            resolve(true);
                        }

                        if (elapsed >= timeout) {
                            clearInterval(intervalId);
                            this.showBlockingAlert('窗口打开失败', '请正常关闭窗口后，再运行脚本');
                            reject(new Error('窗口响应超时'));
                        }
                    }, checkInterval);
                });
            }

            // 显示阻断式提示
            showBlockingAlert(title, text) {
                this.shouldStop = true;
                Swal.fire({
                    title,
                    text,
                    icon: 'error',
                    confirmButtonText: '确定',
                    allowOutsideClick: false,
                    willClose: () => {
                        console.log(' 用户确认错误，脚本已停止');
                    }
                });
            }

            // 统一错误处理
            handleError(context, error) {
                console.error(`${context}:`, error);
                // this.showBlockingAlert(context, error.message);
                this.shouldStop = true;
            }

            // 停止脚本
            stop() {
                this.shouldStop = true;
                window.XMLHttpRequest = this.requestInterceptor;  // 恢复原始XHR
                console.log(' 脚本已安全停止');
            }
        }

        class Course {
            constructor(channel = "channel-my") {
                this.panel = new AuthWindow()
                this.channel = channel
                this.VIP = false
                this.running = false
                this.init()
            }

            init() {
                this.panel.setOnVerifyCallback(async (data) => {
                    this.url = await Utils.validateCode(data)
                    if (this.url) {
                        this.panel.setTip(Utils.vipText)
                        this.VIP = true
                        return true
                    }
                })

                this.panel.setOnBegin(() => {
                    if (!this.running) {
                        this.running = true
                        console.log("运行时：",this.VIP)
                        this.run().then(r => {
                            this.running = false
                        })
                    }
                })
                this.panel.setOnVIP(async () => {
                    if(!this.url){
                        await this.panel.handleVerify()
                    }
                    await this.runVIP()
                })
                this.loadVIPStatus()
                try {
                    Swal.fire({
                        title: "提示",
                        text: "脚本3s后自动开始",
                        icon: 'info',
                        timer: 3000,
                        confirmButtonText: '确定',
                        willClose: () => {
                            this.panel.startAutomation()
                        }
                    });
                } catch (e) {
                    console.error(e)
                    this.panel.startAutomation()
                }
            }

            loadVIPStatus() {
                if (Utils.loadStatus()) {
                    this.panel.setTip(Utils.vipText)
                    this.VIP = true
                } else {
                    this.panel.setTip(Utils.baseText)
                    this.VIP = false
                }
                console.log("VIP:",this.VIP)
            }

            async runVIP() {
                try {
                    if (!this.VIP) {
                        Utils.showLinkSwal()
                        console.log("需要授权码！")
                        return
                    }
                    if (!location.href.includes('studyNew')) {
                        Swal.fire({
                            title: "提示",
                            text: "请在视频播放页面使用！",
                            icon: 'info',
                            confirmButtonText: '确定',
                            willClose: () => {
                                console.log(' 用户确认错误，脚本已停止');
                            }
                        })
                    }
                    try {
                        document.querySelector('video').pause()
                    } catch (error) {
                    }
                    let jsCode = GM_getValue("jsCode")
                    if (!jsCode) {
                        jsCode = await Utils.getJsCode(this.url)
                    }
                    eval(jsCode)
                    const count = await window.VIP()
                    console.log("成功数：", count)
                    Swal.fire({
                        title: "课程极速刷取成功！",
                        text: "请尽快刷新页面或直接关闭",
                        icon: 'success',
                        confirmButtonText: '确定',
                        willClose: () => {
                            console.log(' 用户确认错误，脚本已停止');
                        }
                    });
                } catch (error) {
                    console.error(error)
                    Swal.fire({
                        title: "高级功能执行失败！",
                        text: "若一直失败，请联系进行售后处理！",
                        icon: 'error',
                        confirmButtonText: '确定',
                        allowOutsideClick: false,
                        willClose: () => {
                            console.log(' 用户确认错误，脚本已停止');
                        }
                    });
                }
            }

            async run() {
                let video = await this.getStudyNode('video')
                if (video) {
                    const catalogList = await this.getStudyNode('.step', 'nodeList');
                    console.log(this.VIP)
                    if (!this.VIP) {
                        Swal.fire({
                            title: '当前是基础版',
                            text: '脚本只会自动播放第一个视频，需要连播请获取授权码',
                            icon: 'info',
                            confirmButtonText: '确定',
                            timer: 5000,
                            willClose: () => {
                                console.log(this.VIP)
                            }
                        });
                    }
                    let index = 0
                    for (const element of catalogList) {
                        element.click()
                        await sleep(2000)
                        video = await this.getStudyNode('video')
                        video.volum = 0
                        video.muted = true
                        await video.play()
                        /*setInterval(() => {
                            if (video && video.paused) {
                                video.play()
                            }
                        }, 5000)*/
                        await this.waitForVideoEnd(video)
                        // if (index !== 0 && catalogList.length > 1) {
                        //
                        // }
                        index++
                        if (!this.VIP) {
                            break
                        }
                    }
                    const onClose = () => {
                        let msg='finish'
                        console.log("send msg：", msg)
                        const channel = new BroadcastChannel("channel-my");
                        channel.postMessage("finish");
                        const button = document.querySelector('.header_btn');
                        if (button) {
                            this.panel.showError("未检查到结束学习按钮！脚本不能正常关闭")
                        }
                        button.click();
                        setTimeout(async () => {
                            document.querySelector('.el-button--primary').click()
                        }, 1000)
                    }
                    if (!this.VIP) {
                        Swal.fire({
                            title: '脚本已自动完成第一个视频',
                            text: '如需连播请启用高级功能！5s后页面自动关闭！',
                            icon: 'info',
                            confirmButtonText: '确定',
                            timer: 5000,
                            willClose: () => {
                                onClose()
                            }
                        });
                        return
                    }
                    Swal.fire({
                        title: '当前课程完成！',
                        text: '脚本将在2s后关闭此页面！',
                        icon: 'success',
                        confirmButtonText: '确定',
                        timer: 2000,
                        willClose: () => {
                            onClose()
                        }
                    });

                } else {
                    this.panel.showError("未检测到视频，加载超时！")
                }

            }

            async waitForVideoEnd(video) {
                return new Promise(resolve => {
                    const checkInterval = setInterval(async () => {
                        try {
                            if (video && video.paused) {
                                console.log("视频暂停了，重新开始播放...");
                                await video.play();
                            }
                            if (!video.src) {
                                console.error("视频源未设置，即将重新加载");
                                setTimeout(() => {
                                    location.reload()
                                }, 5000)
                            }
                            const btn=document.querySelector('.el-button--primary')
                            if (btn) {
                                console.log("检测到已经学习弹窗！")
                                setTimeout(()=>{
                                    btn.click()
                                },2000)
                            }
                            const mutliOption=document.querySelector('.ccQuestionDiv')
                            if (mutliOption) {
                                try {
                                    console.log("检测到内嵌选择题！")
                                    document.querySelector('#ccJumpOver').click()
                                }catch (e) {
                                    console.error(e)
                                }
                            }

                        } catch (e) {
                            console.error("checkInterval error:", e);
                            clearInterval(checkInterval);
                            setTimeout(() => {
                                location.reload()
                            }, 2000);
                        }
                    }, 3000);
                    video.addEventListener('ended', () => {
                        clearInterval(checkInterval);
                        resolve()

                    }, {once: true}); // 监听视频结束事件
                });
            }

            sendMsg = function (msg) {
                // 创建 BroadcastChannel
                console.log("send msg：", msg)
                const channel = new BroadcastChannel(this.channel);
                channel.postMessage(msg);
            }

            getStudyNode(selector, type = 'node', timeout = 10000) {
                return new Promise((resolve, reject) => {
                    if (!['node', 'nodeList'].includes(type)) {
                        console.error('Invalid type parameter. Expected "node" or "nodeList"');
                        reject('Invalid type parameter. Expected "node" or "nodeList"');
                    }
                    const cleanup = (timeoutId, intervalId) => {
                        clearTimeout(timeoutId);
                        clearInterval(intervalId);
                    };
                    const handleSuccess = (result, timeoutId, intervalId) => {
                        console.log(`${selector} ready!`);
                        cleanup(timeoutId, intervalId);
                        resolve(result);
                    };
                    const handleFailure = (timeoutId, intervalId) => {
                        cleanup(timeoutId, intervalId);
                        resolve(null);
                    };
                    const checkNode = () => {
                        try {
                            let nodes;
                            if (type === 'node') {
                                nodes = document.querySelector(selector);
                                return nodes?.readyState >= 3 ? nodes : null;
                            }
                            nodes = document.querySelectorAll(selector);
                            return nodes.length > 0 ? nodes : null;
                        } catch (error) {
                            console.error('节点检查错误:', error);
                            reject('节点检查错误:', error)
                        }
                    };
                    const intervalId = setInterval(() => {
                        const result = checkNode();
                        if (result) {
                            handleSuccess(result, timeoutId, intervalId);
                        } else {
                            console.log(`等待节点: ${selector}...`);
                        }
                    }, 3000);
                    const timeoutId = setTimeout(() => {
                        console.error(`节点获取超时: ${selector}`);
                        handleFailure(timeoutId, intervalId);
                    }, timeout);
                });
            }
        }

        class Utils {
            constructor() {
            }

            static flag = 'CasJsCode'
            static vipText = '高级功能已启用！'
            static baseText = '您正在使用基础版本，功能可能存在限制'

            static loadStatus() {
                try {
                    let jsCode = GM_getValue(this.flag)
                    if(!jsCode){
                        jsCode= GM_getValue("CasAuthData")
                    }
                    return typeof jsCode === 'string' && jsCode.length > 0
                } catch (e) {
                    console.error(e)
                }
                return false
            }

            static async validateCode(data) {
                try {
                    console.log(data);
                    let info = sessionStorage.getItem('loginMessage')
                    if (!info) {
                        throw new Error("无效的账号信息！")
                    }
                    info = JSON.parse(info)
                    data.bindInfo = info.realName + '_' + info.userInfo.phone
                    data.website = "67b5488dfe975fc54f49e6fd"
                    const res = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            'url': "https://fc-mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.next.bspapp.com/validCodeFuncCas?" + new URLSearchParams(data),
                            method: 'GET',
                            onload: function (res) {
                                if (res.status === 200) {
                                    const result = JSON.parse(res.response)
                                    console.log(result)
                                    resolve(result)

                                }
                                reject('请求失败：' + res.response)

                            },
                            onerror: function (err) {
                                console.error(err)
                                reject('请求错误！' + err.toString())
                            }
                        })
                    })
                    if (res.code !== 200) {
                        GM_deleteValue(this.flag)
                        throw new Error('验证失败：' + res.data)
                    }
                    Swal.fire({
                        title: "高级功能已启用！",
                        text: "校验成功！",
                        icon: 'success',
                        confirmButtonText: '确定',
                    });
                    GM_setValue("CasAuthData",JSON.stringify(data))
                    return res.data
                } catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "验证失败！",
                        text: e.toString(),
                        icon: 'error',
                        confirmButtonText: '确定',
                    });
                }
            }

            static async getJsCode(url) {
                try {
                    let code = GM_getValue(this.flag)
                    // console.log(code)
                    if (!code) {
                        const jsUrl = url
                        //获取js文件，然后在这里执行，然后获得结果
                        const jsCode = await new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                'url': jsUrl,
                                method: 'GET',
                                onload: function (res) {
                                    console.log(res)
                                    if (res.status === 200) {
                                        const result = (res.responseText)
                                        // console.log(result)
                                        resolve(result)
                                    } else {
                                        reject('服务器拒绝：' + res.response)
                                    }
                                },
                                onerror: function (err) {
                                    console.error(err)
                                    reject('请求错误！' + err.toString())
                                }
                            })
                        })
                        code = jsCode
                            .replace(/\\/g, '\\\\')
                            .replace(/'/g, '\'')
                            .replace(/"/g, '\"')
                        GM_setValue(this.flag, code)
                    }
                    return code
                } catch (error) {
                    console.error('远程加载失败:', error);
                    throw new Error("远程加载失败")
                }
            }

            static showLinkSwal() {
                const link=[
                    "https://68n.cn/IJ8QB",
                    "https://68n.cn/RM9ob",
                ]
                Swal.fire({
                    title: '<i class="fas fa-crown swal-vip-icon"></i> 高级功能解锁',
                    html: `
        <div class="vip-alert-content">
            <div class="alert-header">
                <h3>需要验证授权码才能使用</h3>
                <p class="version-tag">高级版</p>
            </div>
            
            <div class="requirements-box">
                <div class="requirement-item">
                    <span class="number-badge">1</span>
                    <p>需有效授权码激活高级功能模块</p>
                </div>
                <div class="requirement-item">
                    <span class="number-badge">2</span>
                    <p>当前账户权限：<span class="status-tag free-status">基础版</span></p>
                </div>
            </div>
 
            <div class="action-guide">
                <p>获取授权码步骤：</p>
                <ol class="step-list">
                    <li>点击前往以下链接，获取授权码</li>
                    <li><a href=${link[0]} class="pricing-link" target="_blank" ">获取授权码链接1</a></li>
                    <li><a href=${link[1]} class="pricing-link" target="_blank"">获取授权码链接2</a></li>
                </ol>
            </div>
        </div>
    `,
                    icon: 'info',
                    confirmButtonText: '前往激活',
                    showCloseButton: true,
                    timer:30000,
                    customClass: {
                        popup: 'vip-alert-popup',
                        confirmButton: 'vip-confirm-btn'
                    },
                    willClose: () => {
                        window.open(link[1])
                    }
                });
            }
        }

        class AuthWindow {
            constructor() {
                this.storageKey = 'CasAuthData';
                this.injectGlobalStyles();
                this.initDOM();
                this.loadPersistedData();
                this.show();
                // this.startAutomation()
            }

            injectGlobalStyles() {
                GM_addStyle(`
            .auth-window { position: fixed; bottom: 10px; right: 10px; z-index: 9999; background: white; padding: 24px; border-radius: 12px; box-shadow: 0 6px 30px rgba(0,0,0,0.15); border: 1px solid #e4e7ed; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 320px; transform: translateY(20px); opacity: 0; transition: all 0.3s ease; } .auth-window.visible  { transform: translateY(0); opacity: 1; } .auth-title { margin: 0 0 16px; font-size: 20px; color: #2c3e50; font-weight: 600; display: flex; align-items: center; gap: 8px; } .auth-version { font-size: 12px; color: #95a5a6; font-weight: normal; } .auth-tip { margin: 0 0 20px; color: #ffbb00; font-size: 14px; font-weight: weight; line-height: 1.5; } .input-group { margin-bottom: 18px; } .input-label { display: block; margin-bottom: 6px; color: #34495e; font-size: 14px; font-weight: 500; } .input-field { width: 80%; padding: 10px 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; transition: border-color 0.2s; } .input-field:focus { outline: none; border-color: #3498db; box-shadow: 0 0 0 3px rgba(52,152,219,0.1); } .auth-button { width: 100%; padding: 12px; background: #3498db; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 8px; } .auth-button:hover { background: #2980b9; transform: translateY(-1px); } .auth-button:active { transform: translateY(0); } .error-message { color: #e74c3c; font-size: 13px; margin-top: 8px; padding: 8px; background: #fdeded; border-radius: 6px; display: none; animation: shake 0.4s; } @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } } .control-panel { opacity: 1; transform: translateY(10px); transition: all 0.3s ease; } .control-panel.visible  { opacity: 1; transform: translateY(0); } .auth-button[disabled] { background: #bdc3c7 !important; cursor: not-allowed; } .auth-window { position: fixed; right: 30px; bottom: 80px; transition: transform 0.3s ease; } .window-toggle:hover .toggle-icon { animation: bounce 0.6s; } .toggle-icon { width: 20px; height: 20px; transition: transform 0.3s ease; } @keyframes bounce { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(4px); } } /* VIP 按钮特效 */ .vip-btn { width: 100%; position: relative; padding: 12px 24px; border: none; border-radius: 8px; background: linear-gradient(135deg, #ffd700 0%, #ffd900 30%, #ffae00 70%, #ff8c00 100%); color: #2c1a00; font-weight: 600; font-family: 'Segoe UI', sans-serif; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); overflow: hidden; box-shadow: 0 4px 15px rgba(255, 174, 0, 0.3); } /* 辉光动画效果 */ .glow-effect::after { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.4) 0%, transparent 70%); opacity: 0; transition: opacity 0.3s; } /* 悬停交互 */ .vip-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255, 174, 0, 0.5); } .vip-btn:hover::after { opacity: 1; } /* 点击反馈 */ .vip-btn:active { transform: translateY(1px); box-shadow: 0 2px 8px rgba(255, 174, 0, 0.3); } /* 皇冠图标动画 */ .crown-icon { width: 20px; height: 20px; margin-right: 8px; vertical-align: middle; transition: transform 0.3s; } .vip-btn:hover .crown-icon { transform: rotate(10deg) scale(1.1); } /* 文字渐变特效 */ .vip-text { background: linear-gradient(45deg, #2c1a00, #5a3a00); -webkit-background-clip: text; background-clip: text; color: transparent; display: inline-block; } * 弹窗容器 */ .vip-alert-popup { border: 2px solid #ffd700; border-radius: 12px; background: linear-gradient(145deg, #1a1a1a, #2d2d2d); } /* 标题区域 */ .alert-header { border-bottom: 1px solid #404040; padding-bottom: 12px; margin-bottom: 15px; } .swal-vip-icon { color: #ffd700; font-size: 2.2em; margin-right: 8px; } /* 需求列表 */ .requirements-box { background: rgba(255,215,0,0.1); border-radius: 8px; padding: 15px; margin: 15px 0; } .requirement-item { display: flex; align-items: center; margin: 10px 0; } .number-badge { background: #ffd700; color: #000; width: 24px; height: 24px; border-radius: 50%; text-align: center; margin-right: 12px; font-weight: bold; } /* 状态标签 */ .status-tag { padding: 4px 8px; border-radius: 4px; font-size: 0.9em; } .free-status { background: #ff4444; color: white; } /* 操作引导 */ .action-guide { background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; } .step-list li { margin: 8px 0; padding-left: 8px; } .pricing-link { color: #00ff9d !important; text-decoration: underline dotted; transition: all 0.3s; } .pricing-link:hover { color: #00cc7a !important; text-decoration: underline; } /* 确认按钮 */ .vip-confirm-btn { background: linear-gradient(135deg, #ffd700 0%, #ff9900 100%) !important; border: none !important; font-weight: bold !important; transition: transform 0.2s !important; } .vip-confirm-btn:hover { transform: scale(1.05); }
        `)
            }

            initDOM() {
                this.container = document.createElement('div');
                this.container.className = 'auth-window';

                // 标题区域
                const title = document.createElement('h3');
                title.className = 'auth-title';
                title.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            <path d="M12 7v5l3 3"/>
        </svg>
        <span>脚本控制台<span class="auth-version">v${GM_info.script.version}</span></span>
    `;

                // 提示信息
                const tip = document.createElement('p');
                tip.className = 'auth-tip';
                tip.textContent = '您正在使用基础版本，功能可能存在限制';
                this.tip = tip
                // 输入框组
                // this.phoneInput = this.createInput(' 手机/QQ号', 'text', '#phone');
                this.authInput = this.createInput(' 授权密钥', 'password', '#auth');

                // 授权链接
                const link=[
                    "https://68n.cn/IJ8QB",
                    "https://68n.cn/RM9ob",
                ]
                const authLink1 = this.createLink('authLink1',link[0],'获取授权链接1');
                const authLink2 = this.createLink('authLink2',link[1],'获取授权链接2');


                // 验证按钮
                this.verifyBtn = document.createElement('button');
                this.verifyBtn.className = 'auth-button';
                this.verifyBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20 12l-8 8-4-4m0 0l4-4m-4 4L4 12l4-4"/>
        </svg>
        验证授权码 
    `;
                this.verifyBtn.onclick = () => this.handleVerify();

                // 启动控制面板
                this.controlPanel = document.createElement('div');
                this.controlPanel.className = 'control-panel';
                this.controlPanel.style.cssText = `
        margin-top: 20px;
        border-top: 1px solid #eee;
        padding-top: 16px;
    `;
                this.vipBtn = document.createElement('button');
                this.vipBtn.className = 'vip-btn glow-effect';
                this.vipBtn.innerHTML = `
            <span class="glow-container"></span>
            <svg class="crown-icon" viewBox="0 0 24 24">
                <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3H5v2h14v-2z"/>
            </svg>
            <span class="vip-text">高级功能-极速刷课</span>
        `;
                this.vipBtn.addEventListener('click', () => {
                    this.handleVIPClick()
                })
                // 计时器
                this.timerDisplay = document.createElement('div');
                this.timerDisplay.className = 'timer';
                this.timerDisplay.textContent = '运行时间: 00:00:00';
                this.timerDisplay.style.cssText = `
        color: #2ecc71;
        font-size: 13px;
        margin-bottom: 12px;
    `;

                // 开始按钮
                this.startBtn = document.createElement('button');
                this.startBtn.className = 'auth-button';
                this.startBtn.style.backgroundColor = '#2ecc71';
                this.startBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
        开始运行-自动化挂机
    `;
                this.startBtn.onclick = () => this.startAutomation();

                // 错误提示
                this.errorBox = document.createElement('div');
                this.errorBox.className = 'error-message';


                // 组装结构
                this.controlPanel.append(
                    this.vipBtn,
                    this.timerDisplay,
                    this.startBtn
                );

                this.container.append(
                    title,
                    tip,
                    // this.phoneInput.container,
                    this.authInput.container,
                    authLink1,
                    authLink2,
                    this.verifyBtn,
                    this.controlPanel,
                    this.errorBox
                );

                document.body.appendChild(this.container);
                this.initControlBtn()
            }

            initControlBtn() {
                // 创建控制按钮
                this.toggleBtn = document.createElement('button');
                this.toggleBtn.className = 'window-toggle';
                this.toggleBtn.innerHTML = `
        <svg class="toggle-icon" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span class="toggle-text">展开面板</span>
    `;
                this.toggleBtn.style.cssText = `
        position: fixed;
        right: 30px;
        bottom: 30px;
        padding: 12px 20px;
        background: #fff;
        border: none;
        border-radius: 30px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
        z-index: 9999999;
    `;

                // 添加交互效果
                this.toggleBtn.addEventListener('mouseenter', () => {
                    this.toggleBtn.style.transform = 'translateY(-2px)';
                    this.toggleBtn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
                });

                this.toggleBtn.addEventListener('mouseleave', () => {
                    this.toggleBtn.style.transform = 'none';
                    this.toggleBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                });

                // 点击事件处理
                this.toggleBtn.onclick = () => {
                    const isVisible = this.container.style.display !== 'none';
                    this.container.style.display = isVisible ? 'none' : 'block';

                    // 更新按钮状态
                    this.toggleBtn.querySelector('.toggle-icon').style.transform =
                        isVisible ? 'rotate(180deg)' : 'none';
                    this.toggleBtn.querySelector('.toggle-text').textContent =
                        isVisible ? '展开面板' : '收起面板';

                    // 添加动画效果
                    if (!isVisible) {
                        this.container.animate([
                            {opacity: 0, transform: 'translateY(20px)'},
                            {opacity: 1, transform: 'none'}
                        ], {duration: 300, easing: 'ease-out'});
                    }
                };

                document.body.appendChild(this.toggleBtn);
            }

            startAutomation(callback) {
                if (!this.isRunning) {
                    this.startTime = Date.now();
                    this.isRunning = true;
                    this.startBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M6 12h12"/>
            </svg>
            运行中...
        `;
                    this.startBtn.style.backgroundColor = '#e67e22';
                    this.startBtn.disabled = true;

                    // 启动计时器
                    this.timer = setInterval(() => {
                        const elapsed = Date.now() - this.startTime;
                        const hours = Math.floor(elapsed / 3600000);
                        const minutes = Math.floor((elapsed % 3600000) / 60000);
                        const seconds = Math.floor((elapsed % 60000) / 1000);
                        this.timerDisplay.textContent =
                            `运行时间: ${hours.toString().padStart(2, '0')}:` +
                            `${minutes.toString().padStart(2, '0')}:` +
                            `${seconds.toString().padStart(2, '0')}`;
                    }, 1000);

                    // 触发自动化任务
                    if (typeof callback === 'function') {
                        callback()
                    }
                    if (this.begin && typeof this.begin === 'function') {
                        this.begin()
                    }
                }
            }

            createInput(labelText, type, id) {
                const container = document.createElement('div');
                container.className = 'input-group';

                const label = document.createElement('label');
                label.className = 'input-label';
                label.textContent = labelText;
                label.htmlFor = id;

                const input = document.createElement('input');
                input.className = 'input-field';
                input.type = type;
                input.id = id;
                input.maxLength = 16
                container.appendChild(label);
                container.appendChild(input);
                return {container, input};
            }
            createLink(id,link,name){
                const authLink = document.createElement('a');
                authLink.id = id;
                authLink.className = 'auth-link';
                authLink.href = link;
                authLink.target = '_blank';
                authLink.textContent = name;
                authLink.style.cssText = `
        display: block; margin: 12px 0; color: #3498db; text-decoration: none; font-size: 13px; transition: opacity 0.2s; `;
                authLink.addEventListener('mouseenter', () => {
                    authLink.style.opacity = '0.8';
                    authLink.style.textDecoration = 'underline';
                });
                authLink.addEventListener('mouseleave', () => {
                    authLink.style.opacity = '1';
                    authLink.style.textDecoration = 'none';
                });
                return authLink
            }
            show() {
                setTimeout(() => {
                    this.container.classList.add('visible');
                }, 100);
            }

            showError(message) {
                this.errorBox.textContent = message;
                this.errorBox.style.display = 'block';
                setTimeout(() => {
                    this.errorBox.style.display = 'none';
                }, 5000);
            }

            async handleVerify() {
                const data = {
                    // phone: this.phoneInput.input.value,
                    key: this.authInput.input.value
                };
                console.log(data);
                if (!data.key || !(/^[A-Z0-9]{16}$/).test(data.key)) {
                    Swal.fire({
                        title: "授权码不正确，应为16位",
                        text: "请正确输入！",
                        icon: 'info',
                        confirmButtonText: '确定',
                    });
                    return
                }
                // 触发验证回调
                if (this.onVerify) {
                    if(await this.onVerify(data)){
                        GM_setValue(this.storageKey,JSON.stringify(data))
                    }else {

                    }
                }
            }

            handleVIPClick() {
                if (this.vipCallback) {
                    this.vipCallback()
                } else {
                    Swal.fire({
                        title: "提示",
                        text: "请在视频播放页面使用！",
                        icon: 'info',
                        confirmButtonText: '确定',
                        willClose: () => {
                            console.log(' 用户确认错误，脚本已停止');
                        }
                    });
                }
            }

            loadPersistedData() {
                let saved = GM_getValue(this.storageKey);
                if (saved) {
                    saved=JSON.parse(saved)
                    // this.phoneInput.input.value = saved.phone || '';
                    this.authInput.input.value = saved.key || '';
                }
            }


            hide() {
                this.container.style.display = 'none';
            }

            // get phone() {
            //     return this.phoneInput.input.value;
            // }

            // set phone(value) {
            //     this.phoneInput.input.value = value;
            // }

            get key() {
                return this.authInput.input.value;
            }

            set key(value) {
                // this.authInput.input.value = value;
            }

            setTip(text) {
                this.tip.innerText = text
            }

            // 验证回调函数
            setOnVerifyCallback(callback) {
                this.onVerify = callback;
            }

            setOnBegin(callback) {
                this.begin = callback;
            }

            setOnVIP(callback) {
                this.vipCallback = callback;
            }
        }
        new Runner()
    }

}
// 奥鹏
class HebeiAoPeng {
    constructor() {
    }
    run(config) {

        this.setupCoreFeatures(config);
    }
    setupCoreFeatures({refreshInterval}) {
        class Runner {
            constructor() {
                this.runner = null
                this.run()
            }

            run() {
                const url = location.href;
                if (url.includes("learn.ourteacher.com.cn/StepLearn/StepLearn/")) {
                    this.runner = new Course("channel-aopeng")
                    // this.runner.run()
                }
            }
        }

        class Course {
            constructor(channel = "channel-my") {
                this.panel = new AuthWindow()
                this.channel = channel
                this.VIP = false
                this.running = false
                this.init()
            }

            init() {
                this.panel.setOnVerifyCallback(async (data) => {
                    this.url = await Utils.validateCode(data)
                    if (this.url) {
                        this.panel.setTip(Utils.vipText)
                        this.VIP = true
                        return true
                    }
                })

                this.panel.setOnBegin(() => {
                    if (!this.running) {
                        this.running = true
                        console.log("运行时：", this.VIP)
                        this.run().then(r => {
                            this.running = false
                        })
                    }
                })
                this.panel.setOnVIP(async () => {
                    if (!this.url) {
                        await this.panel.handleVerify()
                    }
                    await this.runVIP()
                })
                this.loadVIPStatus()
                try {
                    Swal.fire({
                        title: "提示",
                        text: "脚本3s后自动开始",
                        icon: 'info',
                        timer: 3000,
                        confirmButtonText: '确定',
                        willClose: () => {
                            this.panel.startAutomation()
                        }
                    });
                } catch (e) {
                    console.error(e)
                    this.panel.startAutomation()
                }
            }

            loadVIPStatus() {
                if (Utils.loadStatus()) {
                    this.panel.setTip(Utils.vipText)
                    this.VIP = true
                } else {
                    this.panel.setTip(Utils.baseText)
                    this.VIP = false
                }
                console.log("VIP:", this.VIP)
            }

            async runVIP() {
                try {
                    if (!this.VIP) {
                        Utils.showLinkSwal()
                        console.log("需要授权码！")
                        return
                    }
                    Swal.fire({
                        title: "高级功能已启用！",
                        text: "现在，脚本会自动挂机，刷完当前课程学时！",
                        icon: 'success',
                        confirmButtonText: '确定',
                        willClose: () => {

                        }
                    });
                } catch (error) {
                    console.error(error)
                    Swal.fire({
                        title: "高级功能执行失败！",
                        text: "若一直失败，请联系进行售后处理！",
                        icon: 'error',
                        confirmButtonText: '确定',
                        allowOutsideClick: false,
                        willClose: () => {
                            console.log(' 用户确认错误，脚本已停止');
                        }
                    });
                }
            }

            async run() {
                const onlyTime = true
                const catalogSelecter = '.CourseLeftmenu ul a'
                const videoNodeID = 'ckplayer_video'
                const timeID = 'learnTime'


                const studyNodes = document.querySelectorAll(catalogSelecter);
                const list = Array.from(studyNodes);
                // 答题窗口 屏蔽
                const answerDialog = setInterval(() => {
                    try {
                        const dialogIframe = document.getElementById('dialog_iframe_ValidationPage').contentWindow
                        if (dialogIframe) {
                            // dialogIframe.parent.modalDialog.OKEvent()
                            location.reload()
                        }
                    } catch (e) {
                    }
                }, 5000)
                let index= 0;
                for (const node of list) {
                    index++
                    //检查学习时间
                    if (onlyTime) {
                        try {
                            const studyTime = this.getStudyTime(timeID)
                            console.log("学习时间:", studyTime)
                            const maxTime = this.getMaxStudyTime(timeID)
                            console.log("最大学习时间:", maxTime)
                            if (studyTime >= maxTime) {
                                console.log("学习时间已到达最大！直接完成！")
                                this.finish()
                                break;
                            }
                        } catch (e) {
                            console.error(e)
                        }
                    }
                    if(index>=3){
                        const VIP = Utils.loadStatus();
                        if(!VIP){
                            Swal.fire({
                                title: "基本版，只支持前三个节点自动",
                                text: "若需自动完成所有，请获取授权码.20s后页面即将自动关闭！",
                                icon: 'info',
                                confirmButtonColor: "#FF4DAFFF",
                                confirmButtonText: "我知道了",
                                showCloseButton: true, // 显示关闭按钮
                                allowOutsideClick: false, // 禁止点击外部关闭
                                allowEscapeKey: false,
                                timer: 0,
                                willClose: () => {
                                    setTimeout(()=>{
                                        window.close()
                                    },20000)
                                }
                            })
                            setTimeout(()=>{
                                window.close()
                            },20000)
                            return
                        }

                    }
                    const nodeName = node.innerText
                    console.log(`============================${nodeName}============================`)
                    node.click()
                    const nodeType = this.getStudyNodesType(node)
                    console.log("节点类型：", nodeType)
                    if (nodeType !== 2) {
                        await sleep(1000)
                        continue
                    }
                    const video = await this.getStudyVideoNode(videoNodeID)
                    // 未找到视频
                    if (!video) {
                        console.log("无视频，停顿5s");
                        await sleep(5)
                    } else {
                        video.muted = true;
                        await video.play()
                        const videoDur = video.duration
                        if (videoDur <= 0) {
                            console.error("视频无播放时长！")
                            continue
                        }
                        console.log(`开始播放视频，时长为 ${videoDur} 秒`);
                        await this.waitForVideoEnd(video); // 等待视频播放完毕
                        console.log("视频播放完毕，继续下一个");
                        //安全间隔 2s
                        await sleep(2);
                    }
                }
                if(!this.VIP){
                    return
                }
                //检查学习时间
                const studyTime = this.getStudyTime(timeID)
                const maxTime = this.getMaxStudyTime(timeID)
                console.log("最大学习时间:", maxTime)
                console.log("当前学习时长：", studyTime)
                // 如果学习时间未达到最大值
                if (studyTime < maxTime) {
                    console.log("开始挂机，随机点击");
                    // 每 10 秒随机点击一个节点
                    const intervalId = setInterval(async () => {
                        // 随机选择一个节点
                        const randomIndex = Math.floor(Math.random() * studyNodes.length);
                        const randomNode = studyNodes[randomIndex];
                        console.log(`随机点击节点：${randomNode.innerText}`);

                        randomNode.click();

                        await sleep(2000)
                        // 再次检查学习时间
                        const newStudyTime = this.getStudyTime(timeID);
                        console.log("学习时长：", newStudyTime);

                        // 如果学习时间达到最大值，停止定时器
                        if (newStudyTime >= maxTime) {
                            clearInterval(intervalId);
                            console.log("学习时间已达到最大值，挂机完成！");
                            this.finish()
                            return 0;
                        }
                    }, 10000); // 每 10 秒执行一次
                } else {
                    console.log("学习时间已达到最大值，无需挂机");
                    this.finish()
                }
            }
            finish() {
                if (Swal) {
                    Swal.fire({
                        title: "刷课成功！",
                        text: `学习时间已达到最大值`,
                        icon: 'success',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // 尝试关闭当前页面
                            try {
                                // window.close(); // 关闭当前页面
                            } catch (error) {
                                console.error("无法直接关闭页面：", error);
                                // 如果无法直接关闭页面，提示用户手动关闭
                                Swal.fire({
                                    title: "无法自动关闭页面",
                                    text: "请手动关闭此页面。",
                                    icon: 'warning',
                                    confirmButtonColor: "#FF4DAFFF",
                                    confirmButtonText: "确定",
                                });
                            }
                        }
                    });
                }
            }

            async waitForVideoEnd(video) {
                return new Promise(resolve => {
                    const checkInterval = setInterval(async () => {
                        try {
                            if (video && video.paused) {
                                console.log("视频暂停了，重新开始播放...");
                                await video.play();
                            }
                            if (!video.src) {
                                console.error("视频源未设置，即将重新加载");
                                setTimeout(() => {
                                    location.reload()
                                }, 5000)
                            }

                        } catch (e) {
                            console.error("checkInterval error:", e);
                            clearInterval(checkInterval);
                            setTimeout(() => {
                                location.reload()
                            }, 2000);
                        }
                    }, 3000);
                    video.addEventListener('ended', () => {
                        clearInterval(checkInterval);
                        resolve()

                    }, {once: true}); // 监听视频结束事件
                });
            }

            /**
             * 获取学习时间，返回秒数
             * @param timeId
             * @returns {number}
             */
            getStudyTime(timeId) {
                const timeString = document.getElementById(timeId).innerHTML.split('/')[0];
                const minute = parseInt(timeString.split('分')[0])
                const second = parseInt(timeString.split('分')[1].split('秒')[0])
                return minute * 60 + second
            }

            /**
             * 获取最大学习时间
             * @param timeId
             * @returns {number}
             */
            getMaxStudyTime(timeId) {
                const timeString = document.getElementById(timeId).innerHTML.split('/')[1];
                const minute = parseInt(timeString.split('分')[0])
                return minute * 60
            }

            /**
             * 检查 iframe 是否包含视频
             * @param {HTMLIFrameElement} iframe - iframe 元素
             * @returns {Promise<boolean>} - 返回是否包含视频
             */
            checkIframeForVideo(iframe) {
                return new Promise((resolve) => {
                    // 监听 iframe 的加载完成事件
                    iframe.addEventListener('load', () => {
                        try {
                            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                            // console.log(iframeDoc.location.href)
                            const iframeUrl = iframeDoc.location.href
                            if (iframeUrl.includes('Play')) {
                                // 视频
                                resolve(true)
                            } else {
                                resolve(false)
                            }
                        } catch (error) {
                            console.error("无法访问 iframe 内容：", error);
                            resolve(false);
                        }
                    }, {once: true}); // 只监听一次
                });
            };

            /**
             * 获取视频节点
             * @param {string} videoNodeID - 视频元素的 ID
             * @param {number} timeout - timeout
             * @returns {Promise<HTMLElement>}
             */
            getStudyVideoNode(videoNodeID, timeout = 10000) {
                return new Promise(async (resolve, reject) => {
                    const iframe = document.querySelector('iframe[name="rightFrame"]');
                    if (!iframe) {
                        console.error("未找到 name='rightFrame' 的 iframe");
                        resolve(null);
                    }

                    // 检查 iframe 是否包含视频
                    const hasVideo = await this.checkIframeForVideo(iframe);
                    if (!hasVideo) {
                        console.log("iframe 不包含视频");
                        resolve(null);
                        return null
                    } else {
                        console.log("包含视频，获取视频节点中...");
                    }

                    // 获取视频节点
                    try {
                        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

                        // 超时处理
                        const timeoutId = setTimeout(() => {
                            console.error("获取视频节点超时");
                            clearInterval(internal); // 清除定时器
                            resolve(null); // 返回 null
                        }, timeout);

                        // 定期检查视频节点
                        const internal = setInterval(() => {
                            try {
                                const videoNode = iframeDoc.getElementById(videoNodeID);
                                if (videoNode && videoNode.readyState >= 3) {
                                    console.log("video ready!");
                                    clearTimeout(timeoutId); // 清除超时定时器
                                    clearInterval(internal); // 清除检查定时器
                                    resolve(videoNode); // 返回视频节点
                                } else {
                                    console.log("未检查到 video，继续检查...");
                                }
                            } catch (error) {
                                console.error("检查视频节点时出错：", error);
                                clearTimeout(timeoutId); // 清除超时定时器
                                clearInterval(internal); // 清除检查定时器
                                resolve(null); // 返回 null
                            }
                        }, 1000); // 每隔 1 秒检查一次
                    } catch (error) {
                        console.error("无法访问 iframe 内容：", error);
                        resolve(null); // 返回 null
                    }
                })
            };

            /**
             * 获取目录节点类型
             * -1：失败
             * 1：有子根节点，无意义，展开子节点
             * 2：子节点
             * @param studyNode
             * @returns {number}
             */
            getStudyNodesType(studyNode) {
                if (!studyNode.id) {
                    return -1
                }
                if (studyNode.id.includes('00000000-0000-0000-0000-000000000000')) {
                    return 1
                } else {
                    return 2
                }
            }
        }

        class Utils {
            constructor() {
            }

            static flag = 'VIP'
            static vipText = '高级功能已启用！'
            static baseText = '您正在使用基础版本，功能可能存在限制'

            static loadStatus() {
                try {
                    let VIP = GM_getValue(this.flag)
                    return !!VIP
                } catch (e) {
                    console.error(e)
                }
                return false
            }

            static async validateCode(data) {
                try {
                    console.log(data);
                    let info = document.querySelector('.person').innerText
                    if (!info) {
                        throw new Error("无效的账号信息！")
                    }
                    data.bindInfo = info
                    data.website = "67b547fe7ad52d47d4cd0819"
                    const res = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            'url': "https://fc-mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.next.bspapp.com/validCodeFuncCas?" + new URLSearchParams(data),
                            method: 'GET',
                            onload: function (res) {
                                if (res.status === 200) {
                                    const result = JSON.parse(res.response)
                                    console.log(result)
                                    resolve(result)

                                }
                                reject('请求失败：' + res.response)

                            },
                            onerror: function (err) {
                                console.error(err)
                                reject('请求错误！' + err.toString())
                            }
                        })
                    })
                    if (res.code !== 200) {
                        GM_deleteValue(this.flag)
                        throw new Error('验证失败：' + res.data)
                    }
                    Swal.fire({
                        title: "高级功能已启用！",
                        text: "校验成功！",
                        icon: 'success',
                        confirmButtonText: '确定',
                    });
                    GM_setValue(this.flag, true)
                    return res.data
                } catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "验证失败！",
                        text: e.toString(),
                        icon: 'error',
                        confirmButtonText: '确定',
                    });
                }
            }


            static showLinkSwal() {
                const link = [
                    "https://68n.cn/IJ8QB",
                    "https://68n.cn/RM9ob",
                ]
                Swal.fire({
                    title: '<i class="fas fa-crown swal-vip-icon"></i> 高级功能解锁',
                    html: `
        <div class="vip-alert-content">
            <div class="alert-header">
                <h3>需要验证授权码才能使用</h3>
                <p class="version-tag">高级版</p>
            </div>
            
            <div class="requirements-box">
                <div class="requirement-item">
                    <span class="number-badge">1</span>
                    <p>需有效授权码激活高级功能模块</p>
                </div>
                <div class="requirement-item">
                    <span class="number-badge">2</span>
                    <p>当前账户权限：<span class="status-tag free-status">基础版</span></p>
                </div>
            </div>
 
            <div class="action-guide">
                <p>获取授权码步骤：</p>
                <ol class="step-list">
                    <li>点击前往以下链接，获取授权码</li>
                    <li><a href=${link[0]} class="pricing-link" target="_blank" ">获取授权码链接1</a></li>
                    <li><a href=${link[1]} class="pricing-link" target="_blank"">获取授权码链接2</a></li>
                </ol>
            </div>
        </div>
    `,
                    icon: 'info',
                    confirmButtonText: '前往激活',
                    showCloseButton: true,
                    timer: 30000,
                    customClass: {
                        popup: 'vip-alert-popup',
                        confirmButton: 'vip-confirm-btn'
                    },
                    willClose: () => {
                        // window.open(link[1])
                    }
                });
            }
        }

        class AuthWindow {
            constructor() {
                this.storageKey = 'AuthData';
                this.injectGlobalStyles();
                this.initDOM();
                this.loadPersistedData();
                this.show();
                // this.startAutomation()
            }

            injectGlobalStyles() {
                GM_addStyle(`
            .auth-window { position: fixed; bottom: 10px; right: 10px; z-index: 9999; background: white; padding: 24px; border-radius: 12px; box-shadow: 0 6px 30px rgba(0,0,0,0.15); border: 1px solid #e4e7ed; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 320px; transform: translateY(20px); opacity: 0; transition: all 0.3s ease; } .auth-window.visible  { transform: translateY(0); opacity: 1; } .auth-title { margin: 0 0 16px; font-size: 20px; color: #2c3e50; font-weight: 600; display: flex; align-items: center; gap: 8px; } .auth-version { font-size: 12px; color: #95a5a6; font-weight: normal; } .auth-tip { margin: 0 0 20px; color: #ffbb00; font-size: 14px; font-weight: weight; line-height: 1.5; } .input-group { margin-bottom: 18px; } .input-label { display: block; margin-bottom: 6px; color: #34495e; font-size: 14px; font-weight: 500; } .input-field { width: 80%; padding: 10px 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; transition: border-color 0.2s; } .input-field:focus { outline: none; border-color: #3498db; box-shadow: 0 0 0 3px rgba(52,152,219,0.1); } .auth-button { width: 100%; padding: 12px; background: #3498db; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 8px; } .auth-button:hover { background: #2980b9; transform: translateY(-1px); } .auth-button:active { transform: translateY(0); } .error-message { color: #e74c3c; font-size: 13px; margin-top: 8px; padding: 8px; background: #fdeded; border-radius: 6px; display: none; animation: shake 0.4s; } @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } } .control-panel { opacity: 1; transform: translateY(10px); transition: all 0.3s ease; } .control-panel.visible  { opacity: 1; transform: translateY(0); } .auth-button[disabled] { background: #bdc3c7 !important; cursor: not-allowed; } .auth-window { position: fixed; right: 30px; bottom: 80px; transition: transform 0.3s ease; } .window-toggle:hover .toggle-icon { animation: bounce 0.6s; } .toggle-icon { width: 20px; height: 20px; transition: transform 0.3s ease; } @keyframes bounce { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(4px); } } /* VIP 按钮特效 */ .vip-btn { width: 100%; position: relative; padding: 12px 24px; border: none; border-radius: 8px; background: linear-gradient(135deg, #ffd700 0%, #ffd900 30%, #ffae00 70%, #ff8c00 100%); color: #2c1a00; font-weight: 600; font-family: 'Segoe UI', sans-serif; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); overflow: hidden; box-shadow: 0 4px 15px rgba(255, 174, 0, 0.3); } /* 辉光动画效果 */ .glow-effect::after { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.4) 0%, transparent 70%); opacity: 0; transition: opacity 0.3s; } /* 悬停交互 */ .vip-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255, 174, 0, 0.5); } .vip-btn:hover::after { opacity: 1; } /* 点击反馈 */ .vip-btn:active { transform: translateY(1px); box-shadow: 0 2px 8px rgba(255, 174, 0, 0.3); } /* 皇冠图标动画 */ .crown-icon { width: 20px; height: 20px; margin-right: 8px; vertical-align: middle; transition: transform 0.3s; } .vip-btn:hover .crown-icon { transform: rotate(10deg) scale(1.1); } /* 文字渐变特效 */ .vip-text { background: linear-gradient(45deg, #2c1a00, #5a3a00); -webkit-background-clip: text; background-clip: text; color: transparent; display: inline-block; } * 弹窗容器 */ .vip-alert-popup { border: 2px solid #ffd700; border-radius: 12px; background: linear-gradient(145deg, #1a1a1a, #2d2d2d); } /* 标题区域 */ .alert-header { border-bottom: 1px solid #404040; padding-bottom: 12px; margin-bottom: 15px; } .swal-vip-icon { color: #ffd700; font-size: 2.2em; margin-right: 8px; } /* 需求列表 */ .requirements-box { background: rgba(255,215,0,0.1); border-radius: 8px; padding: 15px; margin: 15px 0; } .requirement-item { display: flex; align-items: center; margin: 10px 0; } .number-badge { background: #ffd700; color: #000; width: 24px; height: 24px; border-radius: 50%; text-align: center; margin-right: 12px; font-weight: bold; } /* 状态标签 */ .status-tag { padding: 4px 8px; border-radius: 4px; font-size: 0.9em; } .free-status { background: #ff4444; color: white; } /* 操作引导 */ .action-guide { background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; } .step-list li { margin: 8px 0; padding-left: 8px; } .pricing-link { color: #00ff9d !important; text-decoration: underline dotted; transition: all 0.3s; } .pricing-link:hover { color: #00cc7a !important; text-decoration: underline; } /* 确认按钮 */ .vip-confirm-btn { background: linear-gradient(135deg, #ffd700 0%, #ff9900 100%) !important; border: none !important; font-weight: bold !important; transition: transform 0.2s !important; } .vip-confirm-btn:hover { transform: scale(1.05); }
        `)
                GM_addStyle(` div.swal2-container { all: initial !important; /* 重置所有继承样式 */ position: fixed !important; z-index: 999999 !important; inset: 0 !important; display: flex !important; align-items: center !important; justify-content: center !important; background: rgba(0,0,0,0.4) !important; } .swal2-popup { all: initial !important; max-width: 600px !important; width: 90vw !important; min-width: 300px !important; position: relative !important; box-sizing: border-box !important; padding: 20px !important; background: white !important; border-radius: 8px !important; font-family: Arial !important; animation: none !important; } @keyframes swal2-show { 0% { transform: scale(0.9); opacity: 0 } 100% { transform: scale(1); opacity: 1 } } `);
            }

            initDOM() {
                this.container = document.createElement('div');
                this.container.className = 'auth-window';

                // 标题区域
                const title = document.createElement('h3');
                title.className = 'auth-title';
                title.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            <path d="M12 7v5l3 3"/>
        </svg>
        <span>脚本控制台<span class="auth-version">v${GM_info.script.version}</span></span>
    `;

                // 提示信息
                const tip = document.createElement('p');
                tip.className = 'auth-tip';
                tip.textContent = '您正在使用基础版本，功能可能存在限制';
                this.tip = tip
                // 输入框组
                // this.phoneInput = this.createInput(' 手机/QQ号', 'text', '#phone');
                this.authInput = this.createInput(' 授权密钥', 'password', '#auth');

                // 授权链接
                const link = [
                    "https://68n.cn/IJ8QB",
                    "https://68n.cn/RM9ob",
                ]
                const authLink1 = this.createLink('authLink1', link[0], '获取授权链接1');
                const authLink2 = this.createLink('authLink2', link[1], '获取授权链接2');


                // 验证按钮
                this.verifyBtn = document.createElement('button');
                this.verifyBtn.className = 'auth-button';
                this.verifyBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20 12l-8 8-4-4m0 0l4-4m-4 4L4 12l4-4"/>
        </svg>
        验证授权码 
    `;
                this.verifyBtn.onclick = () => this.handleVerify();

                // 启动控制面板
                this.controlPanel = document.createElement('div');
                this.controlPanel.className = 'control-panel';
                this.controlPanel.style.cssText = `
        margin-top: 20px;
        border-top: 1px solid #eee;
        padding-top: 16px;
    `;
                this.vipBtn = document.createElement('button');
                this.vipBtn.className = 'vip-btn glow-effect';
                this.vipBtn.innerHTML = `
            <span class="glow-container"></span>
            <svg class="crown-icon" viewBox="0 0 24 24">
                <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3H5v2h14v-2z"/>
            </svg>
            <span class="vip-text">高级功能-全自动挂机</span>
        `;
                this.vipBtn.addEventListener('click', () => {
                    this.handleVIPClick()
                })
                // 计时器
                this.timerDisplay = document.createElement('div');
                this.timerDisplay.className = 'timer';
                this.timerDisplay.textContent = '运行时间: 00:00:00';
                this.timerDisplay.style.cssText = `
        color: #2ecc71;
        font-size: 13px;
        margin-bottom: 12px;
    `;

                // 开始按钮
                this.startBtn = document.createElement('button');
                this.startBtn.className = 'auth-button';
                this.startBtn.style.backgroundColor = '#2ecc71';
                this.startBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
        开始运行-自动化挂机
    `;
                this.startBtn.onclick = () => this.startAutomation();

                // 错误提示
                this.errorBox = document.createElement('div');
                this.errorBox.className = 'error-message';


                // 组装结构
                this.controlPanel.append(
                    this.vipBtn,
                    this.timerDisplay,
                    this.startBtn
                );

                this.container.append(
                    title,
                    tip,
                    // this.phoneInput.container,
                    this.authInput.container,
                    authLink1,
                    authLink2,
                    this.verifyBtn,
                    this.controlPanel,
                    this.errorBox
                );

                document.body.appendChild(this.container);
                this.initControlBtn()
            }

            initControlBtn() {
                // 创建控制按钮
                this.toggleBtn = document.createElement('button');
                this.toggleBtn.className = 'window-toggle';
                this.toggleBtn.innerHTML = `
        <svg class="toggle-icon" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span class="toggle-text">展开面板</span>
    `;
                this.toggleBtn.style.cssText = `
        position: fixed;
        right: 30px;
        bottom: 30px;
        padding: 12px 20px;
        background: #fff;
        border: none;
        border-radius: 30px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
        z-index: 9999999;
    `;

                // 添加交互效果
                this.toggleBtn.addEventListener('mouseenter', () => {
                    this.toggleBtn.style.transform = 'translateY(-2px)';
                    this.toggleBtn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
                });

                this.toggleBtn.addEventListener('mouseleave', () => {
                    this.toggleBtn.style.transform = 'none';
                    this.toggleBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                });

                // 点击事件处理
                this.toggleBtn.onclick = () => {
                    const isVisible = this.container.style.display !== 'none';
                    this.container.style.display = isVisible ? 'none' : 'block';

                    // 更新按钮状态
                    this.toggleBtn.querySelector('.toggle-icon').style.transform =
                        isVisible ? 'rotate(180deg)' : 'none';
                    this.toggleBtn.querySelector('.toggle-text').textContent =
                        isVisible ? '展开面板' : '收起面板';

                    // 添加动画效果
                    if (!isVisible) {
                        this.container.animate([
                            {opacity: 0, transform: 'translateY(20px)'},
                            {opacity: 1, transform: 'none'}
                        ], {duration: 300, easing: 'ease-out'});
                    }
                };

                document.body.appendChild(this.toggleBtn);
            }

            startAutomation(callback) {
                if (!this.isRunning) {
                    this.startTime = Date.now();
                    this.isRunning = true;
                    this.startBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M6 12h12"/>
            </svg>
            运行中...
        `;
                    this.startBtn.style.backgroundColor = '#e67e22';
                    this.startBtn.disabled = true;

                    // 启动计时器
                    this.timer = setInterval(() => {
                        const elapsed = Date.now() - this.startTime;
                        const hours = Math.floor(elapsed / 3600000);
                        const minutes = Math.floor((elapsed % 3600000) / 60000);
                        const seconds = Math.floor((elapsed % 60000) / 1000);
                        this.timerDisplay.textContent =
                            `运行时间: ${hours.toString().padStart(2, '0')}:` +
                            `${minutes.toString().padStart(2, '0')}:` +
                            `${seconds.toString().padStart(2, '0')}`;
                    }, 1000);

                    // 触发自动化任务
                    if (typeof callback === 'function') {
                        callback()
                    }
                    if (this.begin && typeof this.begin === 'function') {
                        this.begin()
                    }
                }
            }

            createInput(labelText, type, id) {
                const container = document.createElement('div');
                container.className = 'input-group';

                const label = document.createElement('label');
                label.className = 'input-label';
                label.textContent = labelText;
                label.htmlFor = id;

                const input = document.createElement('input');
                input.className = 'input-field';
                input.type = type;
                input.id = id;
                input.maxLength = 16
                container.appendChild(label);
                container.appendChild(input);
                return {container, input};
            }

            createLink(id, link, name) {
                const authLink = document.createElement('a');
                authLink.id = id;
                authLink.className = 'auth-link';
                authLink.href = link;
                authLink.target = '_blank';
                authLink.textContent = name;
                authLink.style.cssText = `
        display: block; margin: 12px 0; color: #3498db; text-decoration: none; font-size: 13px; transition: opacity 0.2s; `;
                authLink.addEventListener('mouseenter', () => {
                    authLink.style.opacity = '0.8';
                    authLink.style.textDecoration = 'underline';
                });
                authLink.addEventListener('mouseleave', () => {
                    authLink.style.opacity = '1';
                    authLink.style.textDecoration = 'none';
                });
                return authLink
            }

            show() {
                setTimeout(() => {
                    this.container.classList.add('visible');
                }, 100);
            }

            showError(message) {
                this.errorBox.textContent = message;
                this.errorBox.style.display = 'block';
                setTimeout(() => {
                    this.errorBox.style.display = 'none';
                }, 5000);
            }

            async handleVerify() {
                const data = {
                    // phone: this.phoneInput.input.value,
                    key: this.authInput.input.value
                };
                console.log(data);
                if (!data.key || !(/^[A-Z0-9]{16}$/).test(data.key)) {
                    Swal.fire({
                        title: "授权码不正确，应为16位",
                        text: "请正确输入！",
                        icon: 'info',
                        confirmButtonText: '确定',
                    });
                    return
                }
                // 触发验证回调
                if (this.onVerify) {
                    if (await this.onVerify(data)) {
                        GM_setValue(this.storageKey, JSON.stringify(data))
                    } else {

                    }
                }
            }

            handleVIPClick() {
                if (this.vipCallback) {
                    this.vipCallback()
                } else {
                    Swal.fire({
                        title: "提示",
                        text: "请在视频播放页面使用！",
                        icon: 'info',
                        confirmButtonText: '确定',
                        willClose: () => {
                            console.log(' 用户确认错误，脚本已停止');
                        }
                    });
                }
            }

            loadPersistedData() {
                let saved = GM_getValue(this.storageKey);
                if (saved) {
                    saved = JSON.parse(saved)
                    // this.phoneInput.input.value = saved.phone || '';
                    this.authInput.input.value = saved.key || '';
                }
            }


            hide() {
                this.container.style.display = 'none';
            }

            // get phone() {
            //     return this.phoneInput.input.value;
            // }

            // set phone(value) {
            //     this.phoneInput.input.value = value;
            // }

            get key() {
                return this.authInput.input.value;
            }

            set key(value) {
                // this.authInput.input.value = value;
            }

            setTip(text) {
                this.tip.innerText = text
            }

            // 验证回调函数
            setOnVerifyCallback(callback) {
                this.onVerify = callback;
            }

            setOnBegin(callback) {
                this.begin = callback;
            }

            setOnVIP(callback) {
                this.vipCallback = callback;
            }
        }
        new Runner()
    }
}
// 高等教育出版社-2024中小学
// 基础教育教师培训网
class Chinabett {
    constructor() {
    }
    run(config) {

        this.setupCoreFeatures(config);
    }
    setupCoreFeatures({refreshInterval}) {
        class Runner {
            constructor() {
                this.runner = null
                this.run()
            }

            run() {
                const url = location.href;
                if (url.includes("studyduration/index")) {
                    this.runner = new Course("channel-cas")
                    // this.runner.run()
                }
            }
        }

        class Course {
            constructor(channel = "channel-my") {
                this.panel = new AuthWindow()
                this.channel = channel
                this.VIP = false
                this.running = false
                this.init()
            }

            init() {
                this.panel.setOnVerifyCallback(async (data) => {
                    this.url = await Utils.validateCode(data)
                    if (this.url) {
                        this.panel.setTip(Utils.vipText)
                        this.VIP = true
                        return true
                    }
                })

                this.panel.setOnBegin(() => {
                    if (!this.running) {
                        this.running = true
                        console.log("运行时：", this.VIP)
                        this.run().then(r => {
                            this.running = false
                        })
                    }
                })
                this.panel.setOnVIP(async () => {
                    if(!this.url){
                        await this.panel.handleVerify()
                    }
                    await this.runVIP()
                })
                this.loadVIPStatus()
                try {
                    Swal.fire({
                        title: "提示",
                        text: "脚本3s后自动开始!请等待视频播放时，再使用高级功能！",
                        icon: 'info',
                        timer: 3000,
                        confirmButtonText: '确定',
                        timerProgressBar:true,
                        willClose: () => {
                            this.panel.startAutomation()
                            Swal.fire({
                                title: "提示",
                                text: "需要定制扫码版(可自定义隐藏扫码窗口，自定义补扫)请联系定制！此脚本只能自动刷到扫码时间，完成扫码后再次点击刷取！",
                                icon: 'info',
                                timer: 0,
                                confirmButtonText: '确定',
                                willClose: () => {
                                    this.panel.startAutomation()
                                }
                            });
                        }
                    });
                } catch (e) {
                    console.error(e)
                    this.panel.startAutomation()
                }
            }

            loadVIPStatus() {
                if (Utils.loadStatus()) {
                    this.panel.setTip(Utils.vipText)
                    this.VIP = true
                } else {
                    this.panel.setTip(Utils.baseText)
                    this.VIP = false
                }
                console.log("VIP:", this.VIP)
            }

            async runVIP() {
                try {
                    if (!this.VIP) {
                        Utils.showLinkSwal()
                        console.log("需要授权码！")
                        return
                    }
                    if (window.VIPRunning) {
                        console.log("VIP Running");
                        Swal.fire({
                            title: "课程已在刷取中，请等待或刷新重试...",
                            text: "注意，请在视频播放时刷取！否则可能不生效！",
                            icon: 'info',
                            confirmButtonText: '确定',
                            willClose: () => {
                            }
                        });
                        return
                    }
                    Swal.fire({
                        title: "刷课已开始，每1s刷取30s",
                        text: "注意，请在视频播放时刷取！否则可能不生效！刷完后请刷新页面！",
                        icon: 'info',
                        confirmButtonText: '确定',
                        willClose: () => {
                        }
                    });
                    let jsCode = GM_getValue("jsCode")
                    if (!jsCode) {
                        jsCode = await Utils.getJsCode(this.url)
                    }
                    eval(jsCode)

                    await window.VIP()
                } catch (error) {
                    console.error(error)
                    Swal.fire({
                        title: "高级功能执行失败！",
                        text: "若一直失败，请联系进行售后处理！",
                        icon: 'error',
                        confirmButtonText: '确定',
                        allowOutsideClick: false,
                        willClose: () => {
                            console.log(' 用户确认错误，脚本已停止');
                        }
                    });
                }
            }

            async run() {
                const catalogList = await this.getStudyNode('dd a', 'nodeList');
                console.log(this.VIP)
                if (!this.VIP) {
                    Swal.fire({
                        title: '当前是基础版',
                        text: '脚本只会常速播放完列表视频！',
                        icon: 'info',
                        confirmButtonText: '确定',
                        timer: 5000,
                        willClose: () => {
                            console.log(this.VIP)
                        }
                    });
                }
                let i = 0
                let video
                for (i; i < catalogList.length; i++) {
                    if (catalogList[i].className !== "dd_active") {
                        continue
                    }
                    await sleep(2000)
                    video = await this.getStudyNode('video')
                    video.volum = 0
                    video.muted = true
                    await video.play()
                    /*setInterval(() => {
                        if (video && video.paused) {
                            video.play()
                        }
                    }, 5000)*/
                    await this.waitForVideoEnd(video)
                    if (!this.VIP && i > 3) {
                        break
                    }
                    try {
                        $(unsafeWindow).off('beforeunload');
                        await sleep(1000)
                        $(unsafeWindow).off('beforeunload');
                        catalogList[i + 1].click()

                    } catch (err) {
                        console.error(err)
                    }
                }
                const onClose = () => {
                    window.close()
                }
                if (!this.VIP && i !== catalogList.length - 1) {
                    Swal.fire({
                        title: '当前是基础版',
                        text: '脚本已自动学习完前几个视频，若有需要请获取授权码！',
                        icon: 'info',
                        confirmButtonText: '确定',
                        timer: 0,
                        willClose: () => {
                        }
                    });
                } else {
                    Swal.fire({
                        title: '当前课程完成！',
                        text: '脚本将在10s后关闭此页面！',
                        icon: 'success',
                        confirmButtonText: '确定',
                        timer: 10000,
                        willClose: () => {
                            onClose()
                        }
                    });
                }

            }

            async waitForVideoEnd(video) {
                return new Promise(resolve => {
                    const checkInterval = setInterval(async () => {
                        try {
                            if (video && video.paused) {
                                console.log("视频暂停了，重新开始播放...");
                                await video.play();
                            }
                            if (!video.src) {
                                console.error("视频源未设置，即将重新加载");
                                setTimeout(() => {
                                    location.reload()
                                }, 5000)
                            }

                        } catch (e) {
                            console.error("checkInterval error:", e);
                            clearInterval(checkInterval);
                            setTimeout(() => {
                                location.reload()
                            }, 2000);
                        }
                    }, 3000);
                    video.addEventListener('ended', () => {
                        clearInterval(checkInterval);
                        resolve()

                    }, {once: true}); // 监听视频结束事件
                });
            }

            getStudyNode(selector, type = 'node', timeout = 10000) {
                return new Promise((resolve, reject) => {
                    if (!['node', 'nodeList'].includes(type)) {
                        console.error('Invalid type parameter. Expected "node" or "nodeList"');
                        reject('Invalid type parameter. Expected "node" or "nodeList"');
                    }
                    const cleanup = (timeoutId, intervalId) => {
                        clearTimeout(timeoutId);
                        clearInterval(intervalId);
                    };
                    const handleSuccess = (result, timeoutId, intervalId) => {
                        console.log(`${selector} ready!`);
                        cleanup(timeoutId, intervalId);
                        resolve(result);
                    };
                    const handleFailure = (timeoutId, intervalId) => {
                        cleanup(timeoutId, intervalId);
                        resolve(null);
                    };
                    const checkNode = () => {
                        try {
                            let nodes;
                            if (type === 'node') {
                                nodes = document.querySelector(selector);
                                return nodes?.readyState >= 3 ? nodes : null;
                            }
                            nodes = document.querySelectorAll(selector);
                            return nodes.length > 0 ? nodes : null;
                        } catch (error) {
                            console.error('节点检查错误:', error);
                            reject('节点检查错误:', error)
                        }
                    };
                    const intervalId = setInterval(() => {
                        const result = checkNode();
                        if (result) {
                            handleSuccess(result, timeoutId, intervalId);
                        } else {
                            console.log(`等待节点: ${selector}...`);
                        }
                    }, 3000);
                    const timeoutId = setTimeout(() => {
                        console.error(`节点获取超时: ${selector}`);
                        handleFailure(timeoutId, intervalId);
                    }, timeout);
                });
            }
        }

        class Utils {
            constructor() {
            }

            static flag = 'chinabett_VIP'
            static js_Flag = 'chinabett_jsCode'
            static vipText = '高级功能已启用！'
            static baseText = '您正在使用基础版本，功能可能存在限制'

            static loadStatus() {
                try {
                    let VIP = GM_getValue(this.flag)
                    return !!VIP
                } catch (e) {
                    console.error(e)
                }
                return false
            }

            static async validateCode(data) {
                try {
                    console.log(data);
                    let info = $("#hidUserId").val();
                    if (!info) {
                        throw new Error("无效的账号信息！")
                    }
                    data.bindInfo = 'userId_' + info
                    data.website = "67b547c4189f86a8ae6201ea"
                    // console.log(data);
                    // return
                    const res = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            'url': "https://fc-mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.next.bspapp.com/validCodeFuncCas?" + new URLSearchParams(data),
                            method: 'GET',
                            onload: function (res) {
                                if (res.status === 200) {
                                    const result = JSON.parse(res.response)
                                    console.log(result)
                                    resolve(result)

                                }
                                reject('请求失败：' + res.response)

                            },
                            onerror: function (err) {
                                console.error(err)
                                reject('请求错误！' + err.toString())
                            }
                        })
                    })
                    if (res.code !== 200) {
                        GM_deleteValue(this.flag)
                        GM_deleteValue(this.js_Flag)
                        throw new Error('验证失败：' + res.data)
                    }
                    Swal.fire({
                        title: "高级功能已启用！",
                        text: "校验成功！",
                        icon: 'success',
                        confirmButtonText: '确定',
                    });
                    GM_setValue(this.flag, true)
                    return res.data
                } catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "验证失败！",
                        text: e.toString(),
                        icon: 'error',
                        confirmButtonText: '确定',
                    });
                }
            }

            static async getJsCode(url) {
                try {
                    let code = GM_getValue(this.js_Flag)
                    if (!code) {
                        const jsUrl = url
                        //获取js文件，然后在这里执行，然后获得结果
                        const jsCode = await new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                'url': jsUrl,
                                method: 'GET',
                                onload: function (res) {
                                    console.log(res)
                                    if (res.status === 200) {
                                        const result = (res.responseText)
                                        // console.log(result)
                                        resolve(result)
                                    } else {
                                        reject('服务器拒绝：' + res.response)
                                    }
                                },
                                onerror: function (err) {
                                    console.error(err)
                                    reject('请求错误！' + err.toString())
                                }
                            })
                        })
                        code = jsCode
                            .replace(/\\/g, '\\\\')
                            .replace(/'/g, '\'')
                            .replace(/"/g, '\"')
                        GM_setValue(this.js_Flag, code)
                    }
                    return code
                } catch (error) {
                    console.error('远程加载失败:', error);
                    throw new Error("远程加载失败")
                }
            }

            static showLinkSwal() {
                const link = [
                    "https://68n.cn/IJ8QB",
                    "https://68n.cn/RM9ob",
                ]
                Swal.fire({
                    title: '<i class="fas fa-crown swal-vip-icon"></i> 高级功能解锁',
                    html: `
        <div class="vip-alert-content">
            <div class="alert-header">
                <h3>需要验证授权码才能使用</h3>
                <p class="version-tag">高级版</p>
            </div>
            
            <div class="requirements-box">
                <div class="requirement-item">
                    <span class="number-badge">1</span>
                    <p>需有效授权码激活高级功能模块</p>
                </div>
                <div class="requirement-item">
                    <span class="number-badge">2</span>
                    <p>当前账户权限：<span class="status-tag free-status">基础版</span></p>
                </div>
            </div>
 
            <div class="action-guide">
                <p>获取授权码步骤：</p>
                <ol class="step-list">
                    <li>点击前往以下链接，获取授权码</li>
                    <li><a href=${link[0]} class="pricing-link" target="_blank" ">获取授权码链接1</a></li>
                    <li><a href=${link[1]} class="pricing-link" target="_blank"">获取授权码链接2</a></li>
                </ol>
            </div>
        </div>
    `,
                    icon: 'info',
                    confirmButtonText: '前往激活',
                    showCloseButton: true,
                    timer: 30000,
                    customClass: {
                        popup: 'vip-alert-popup',
                        confirmButton: 'vip-confirm-btn'
                    },
                    willClose: () => {
                        window.open(link[1])
                    }
                });
            }
        }

        class AuthWindow {
            constructor() {
                this.storageKey = 'AuthData';
                this.injectGlobalStyles();
                this.initDOM();
                this.loadPersistedData();
                this.show();
                // this.startAutomation()
            }

            injectGlobalStyles() {
                GM_addStyle(`
            .auth-window { position: fixed; bottom: 10px; right: 10px; z-index: 9999; background: white; padding: 24px; border-radius: 12px; box-shadow: 0 6px 30px rgba(0,0,0,0.15); border: 1px solid #e4e7ed; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 320px; transform: translateY(20px); opacity: 0; transition: all 0.3s ease; } .auth-window.visible  { transform: translateY(0); opacity: 1; } .auth-title { margin: 0 0 16px; font-size: 20px; color: #2c3e50; font-weight: 600; display: flex; align-items: center; gap: 8px; } .auth-version { font-size: 12px; color: #95a5a6; font-weight: normal; } .auth-tip { margin: 0 0 20px; color: #ffbb00; font-size: 14px; font-weight: weight; line-height: 1.5; } .input-group { margin-bottom: 18px; } .input-label { display: block; margin-bottom: 6px; color: #34495e; font-size: 14px; font-weight: 500; } .input-field { width: 80%; padding: 10px 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; transition: border-color 0.2s; } .input-field:focus { outline: none; border-color: #3498db; box-shadow: 0 0 0 3px rgba(52,152,219,0.1); } .auth-button { width: 100%; padding: 12px; background: #3498db; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 8px; } .auth-button:hover { background: #2980b9; transform: translateY(-1px); } .auth-button:active { transform: translateY(0); } .error-message { color: #e74c3c; font-size: 13px; margin-top: 8px; padding: 8px; background: #fdeded; border-radius: 6px; display: none; animation: shake 0.4s; } @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } } .control-panel { opacity: 1; transform: translateY(10px); transition: all 0.3s ease; } .control-panel.visible  { opacity: 1; transform: translateY(0); } .auth-button[disabled] { background: #bdc3c7 !important; cursor: not-allowed; } .auth-window { position: fixed; right: 30px; bottom: 80px; transition: transform 0.3s ease; } .window-toggle:hover .toggle-icon { animation: bounce 0.6s; } .toggle-icon { width: 20px; height: 20px; transition: transform 0.3s ease; } @keyframes bounce { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(4px); } } /* VIP 按钮特效 */ .vip-btn { width: 100%; position: relative; padding: 12px 24px; border: none; border-radius: 8px; background: linear-gradient(135deg, #ffd700 0%, #ffd900 30%, #ffae00 70%, #ff8c00 100%); color: #2c1a00; font-weight: 600; font-family: 'Segoe UI', sans-serif; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); overflow: hidden; box-shadow: 0 4px 15px rgba(255, 174, 0, 0.3); } /* 辉光动画效果 */ .glow-effect::after { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.4) 0%, transparent 70%); opacity: 0; transition: opacity 0.3s; } /* 悬停交互 */ .vip-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255, 174, 0, 0.5); } .vip-btn:hover::after { opacity: 1; } /* 点击反馈 */ .vip-btn:active { transform: translateY(1px); box-shadow: 0 2px 8px rgba(255, 174, 0, 0.3); } /* 皇冠图标动画 */ .crown-icon { width: 20px; height: 20px; margin-right: 8px; vertical-align: middle; transition: transform 0.3s; } .vip-btn:hover .crown-icon { transform: rotate(10deg) scale(1.1); } /* 文字渐变特效 */ .vip-text { background: linear-gradient(45deg, #2c1a00, #5a3a00); -webkit-background-clip: text; background-clip: text; color: transparent; display: inline-block; } * 弹窗容器 */ .vip-alert-popup { border: 2px solid #ffd700; border-radius: 12px; background: linear-gradient(145deg, #1a1a1a, #2d2d2d); } /* 标题区域 */ .alert-header { border-bottom: 1px solid #404040; padding-bottom: 12px; margin-bottom: 15px; } .swal-vip-icon { color: #ffd700; font-size: 2.2em; margin-right: 8px; } /* 需求列表 */ .requirements-box { background: rgba(255,215,0,0.1); border-radius: 8px; padding: 15px; margin: 15px 0; } .requirement-item { display: flex; align-items: center; margin: 10px 0; } .number-badge { background: #ffd700; color: #000; width: 24px; height: 24px; border-radius: 50%; text-align: center; margin-right: 12px; font-weight: bold; } /* 状态标签 */ .status-tag { padding: 4px 8px; border-radius: 4px; font-size: 0.9em; } .free-status { background: #ff4444; color: white; } /* 操作引导 */ .action-guide { background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; } .step-list li { margin: 8px 0; padding-left: 8px; } .pricing-link { color: #00ff9d !important; text-decoration: underline dotted; transition: all 0.3s; } .pricing-link:hover { color: #00cc7a !important; text-decoration: underline; } /* 确认按钮 */ .vip-confirm-btn { background: linear-gradient(135deg, #ffd700 0%, #ff9900 100%) !important; border: none !important; font-weight: bold !important; transition: transform 0.2s !important; } .vip-confirm-btn:hover { transform: scale(1.05); }
        `)
            }

            initDOM() {
                this.container = document.createElement('div');
                this.container.className = 'auth-window';

                // 标题区域
                const title = document.createElement('h3');
                title.className = 'auth-title';
                title.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            <path d="M12 7v5l3 3"/>
        </svg>
        <span>脚本控制台<span class="auth-version">v${GM_info.script.version}</span></span>
    `;

                // 提示信息
                const tip = document.createElement('p');
                tip.className = 'auth-tip';
                tip.textContent = '您正在使用基础版本，功能可能存在限制';
                this.tip = tip
                // 输入框组
                // this.phoneInput = this.createInput(' 手机/QQ号', 'text', '#phone');
                this.authInput = this.createInput(' 授权密钥', 'password', '#auth');

                // 授权链接
                const link = [
                    "https://68n.cn/IJ8QB",
                    "https://68n.cn/RM9ob",
                ]
                const authLink1 = this.createLink('authLink1', link[0], '获取授权链接1');
                const authLink2 = this.createLink('authLink2', link[1], '获取授权链接2');


                // 验证按钮
                this.verifyBtn = document.createElement('button');
                this.verifyBtn.className = 'auth-button';
                this.verifyBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20 12l-8 8-4-4m0 0l4-4m-4 4L4 12l4-4"/>
        </svg>
        验证授权码 
    `;
                this.verifyBtn.onclick = () => this.handleVerify();

                // 启动控制面板
                this.controlPanel = document.createElement('div');
                this.controlPanel.className = 'control-panel';
                this.controlPanel.style.cssText = `
        margin-top: 20px;
        border-top: 1px solid #eee;
        padding-top: 16px;
    `;
                this.vipBtn = document.createElement('button');
                this.vipBtn.className = 'vip-btn glow-effect';
                this.vipBtn.innerHTML = `
            <span class="glow-container"></span>
            <svg class="crown-icon" viewBox="0 0 24 24">
                <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3H5v2h14v-2z"/>
            </svg>
            <span class="vip-text">高级功能-极速刷课(视频播放时使用)</span>
        `;
                this.vipBtn.addEventListener('click', () => {
                    this.handleVIPClick()
                })
                // 计时器
                this.timerDisplay = document.createElement('div');
                this.timerDisplay.className = 'timer';
                this.timerDisplay.textContent = '运行时间: 00:00:00';
                this.timerDisplay.style.cssText = `
        color: #2ecc71;
        font-size: 13px;
        margin-bottom: 12px;
    `;

                // 开始按钮
                this.startBtn = document.createElement('button');
                this.startBtn.className = 'auth-button';
                this.startBtn.style.backgroundColor = '#2ecc71';
                this.startBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
        开始运行-自动化挂机
    `;
                this.startBtn.onclick = () => this.startAutomation();

                // 错误提示
                this.errorBox = document.createElement('div');
                this.errorBox.className = 'error-message';


                // 组装结构
                this.controlPanel.append(
                    this.vipBtn,
                    this.timerDisplay,
                    this.startBtn
                );

                this.container.append(
                    title,
                    tip,
                    // this.phoneInput.container,
                    this.authInput.container,
                    authLink1,
                    authLink2,
                    this.verifyBtn,
                    this.controlPanel,
                    this.errorBox
                );

                document.body.appendChild(this.container);
                this.initControlBtn()
            }

            initControlBtn() {
                // 创建控制按钮
                this.toggleBtn = document.createElement('button');
                this.toggleBtn.className = 'window-toggle';
                this.toggleBtn.innerHTML = `
        <svg class="toggle-icon" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span class="toggle-text">展开面板</span>
    `;
                this.toggleBtn.style.cssText = `
        position: fixed;
        right: 30px;
        bottom: 30px;
        padding: 12px 20px;
        background: #fff;
        border: none;
        border-radius: 30px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
        z-index: 9999999;
    `;

                // 添加交互效果
                this.toggleBtn.addEventListener('mouseenter', () => {
                    this.toggleBtn.style.transform = 'translateY(-2px)';
                    this.toggleBtn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
                });

                this.toggleBtn.addEventListener('mouseleave', () => {
                    this.toggleBtn.style.transform = 'none';
                    this.toggleBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                });

                // 点击事件处理
                this.toggleBtn.onclick = () => {
                    const isVisible = this.container.style.display !== 'none';
                    this.container.style.display = isVisible ? 'none' : 'block';

                    // 更新按钮状态
                    this.toggleBtn.querySelector('.toggle-icon').style.transform =
                        isVisible ? 'rotate(180deg)' : 'none';
                    this.toggleBtn.querySelector('.toggle-text').textContent =
                        isVisible ? '展开面板' : '收起面板';

                    // 添加动画效果
                    if (!isVisible) {
                        this.container.animate([
                            {opacity: 0, transform: 'translateY(20px)'},
                            {opacity: 1, transform: 'none'}
                        ], {duration: 300, easing: 'ease-out'});
                    }
                };

                document.body.appendChild(this.toggleBtn);
            }

            startAutomation(callback) {
                if (!this.isRunning) {
                    this.startTime = Date.now();
                    this.isRunning = true;
                    this.startBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M6 12h12"/>
            </svg>
            运行中...
        `;
                    this.startBtn.style.backgroundColor = '#e67e22';
                    this.startBtn.disabled = true;

                    // 启动计时器
                    this.timer = setInterval(() => {
                        const elapsed = Date.now() - this.startTime;
                        const hours = Math.floor(elapsed / 3600000);
                        const minutes = Math.floor((elapsed % 3600000) / 60000);
                        const seconds = Math.floor((elapsed % 60000) / 1000);
                        this.timerDisplay.textContent =
                            `运行时间: ${hours.toString().padStart(2, '0')}:` +
                            `${minutes.toString().padStart(2, '0')}:` +
                            `${seconds.toString().padStart(2, '0')}`;
                    }, 1000);

                    // 触发自动化任务
                    if (typeof callback === 'function') {
                        callback()
                    }
                    if (this.begin && typeof this.begin === 'function') {
                        this.begin()
                    }
                }
            }

            createInput(labelText, type, id) {
                const container = document.createElement('div');
                container.className = 'input-group';

                const label = document.createElement('label');
                label.className = 'input-label';
                label.textContent = labelText;
                label.htmlFor = id;

                const input = document.createElement('input');
                input.className = 'input-field';
                input.type = type;
                input.id = id;
                input.maxLength = 16
                container.appendChild(label);
                container.appendChild(input);
                return {container, input};
            }

            createLink(id, link, name) {
                const authLink = document.createElement('a');
                authLink.id = id;
                authLink.className = 'auth-link';
                authLink.href = link;
                authLink.target = '_blank';
                authLink.textContent = name;
                authLink.style.cssText = `
        display: block; margin: 12px 0; color: #3498db; text-decoration: none; font-size: 13px; transition: opacity 0.2s; `;
                authLink.addEventListener('mouseenter', () => {
                    authLink.style.opacity = '0.8';
                    authLink.style.textDecoration = 'underline';
                });
                authLink.addEventListener('mouseleave', () => {
                    authLink.style.opacity = '1';
                    authLink.style.textDecoration = 'none';
                });
                return authLink
            }

            show() {
                setTimeout(() => {
                    this.container.classList.add('visible');
                }, 100);
            }

            showError(message) {
                this.errorBox.textContent = message;
                this.errorBox.style.display = 'block';
                setTimeout(() => {
                    this.errorBox.style.display = 'none';
                }, 5000);
            }

            async handleVerify() {
                const data = {
                    // phone: this.phoneInput.input.value,
                    key: this.authInput.input.value
                };
                console.log(data);
                if (!data.key || !(/^[A-Z0-9]{16}$/).test(data.key)) {
                    Swal.fire({
                        title: "授权码不正确，应为16位",
                        text: "请正确输入！",
                        icon: 'info',
                        confirmButtonText: '确定',
                    });
                    return
                }
                // 触发验证回调
                if (this.onVerify) {
                    if (await this.onVerify(data)) {
                        GM_setValue(this.storageKey, JSON.stringify(data))
                    } else {

                    }
                }
            }
            handleVIPClick() {
                if (this.vipCallback) {
                    this.vipCallback()
                } else {
                    Swal.fire({
                        title: "提示",
                        text: "请在视频播放页面使用！",
                        icon: 'info',
                        confirmButtonText: '确定',
                        willClose: () => {
                            console.log(' 用户确认错误，脚本已停止');
                        }
                    });
                }
            }
            loadPersistedData() {
                let saved = GM_getValue(this.storageKey);
                if (saved) {
                    saved = JSON.parse(saved)
                    // this.phoneInput.input.value = saved.phone || '';
                    this.authInput.input.value = saved.key || '';
                }
            }
            hide() {
                this.container.style.display = 'none';
            }
            get key() {
                return this.authInput.input.value;
            }
            set key(value) {
                // this.authInput.input.value = value;
            }
            setTip(text) {
                this.tip.innerText = text
            }
            setOnVerifyCallback(callback) {
                this.onVerify = callback;
            }
            setOnBegin(callback) {
                this.begin = callback;
            }
            setOnVIP(callback) {
                this.vipCallback = callback;
            }
        }
        const sleep = function (time) {
            return new Promise(resolve => setTimeout(resolve, time));
        }
        new Runner()
    }
}
// 中小学网络D校
class Dangxiaottcdw{
    constructor() {
    }
    run(config) {

        this.setupCoreFeatures(config);
    }
    setupCoreFeatures({refreshInterval}) {
        class Runner {
            constructor() {
                this.runner = null
                this.run()
            }

            run() {
                const url = location.href;
                if (url.includes("myClassroom")) {
                    this.runner = new Index("channel-ttcdw")
                    // this.runner.run()
                }else if (url.includes("course")) {
                    this.runner = new Course("channel-ttcdw")
                }
            }
        }
        class Index {
            constructor(channel = "channel-my") {
                this.panel = new AuthWindow({
                    VIPBtnText:"高级功能-全自动挂机"
                })
                this.channel = new BroadcastChannel(channel)
                this.VIP = false
                this.running = false
                this.init()
            }

            init() {
                this.panel.setOnVerifyCallback(async (data) => {
                    this.url = await Utils.validateCode(data)
                    if (this.url) {
                        this.panel.setTip(Utils.vipText)
                        this.VIP = true
                        return true
                    }
                })

                this.panel.setOnBegin(() => {
                    if (!this.running) {
                        this.running = true
                        console.log("运行时：", this.VIP)
                        this.run().then(r => {
                            this.running = false
                        })
                    }
                })
                this.panel.setOnVIP(async () => {
                    if (!this.url) {
                        await this.panel.handleVerify()
                    }
                    await this.runVIP()
                })
                this.loadVIPStatus()
                try {
                    Swal.fire({
                        title: "提示",
                        text: "全自动挂机，请手动点击开始！",
                        icon: 'info',
                        timer: 0,
                        confirmButtonText: '确定',
                        willClose: () => {
                            if(!this.VIP){
                                Swal.fire({
                                    title: "当前是基础版",
                                    text: '课程只会连播前两个！',
                                    icon: 'info',
                                    timer: 5000,
                                    confirmButtonColor: "#FF4DAFFF",
                                    confirmButtonText: "确定",
                                })
                            }
                        }
                    });
                } catch (e) {
                    console.error(e)
                    // this.panel.startAutomation()
                }
            }

            loadVIPStatus() {
                if (Utils.loadStatus()) {
                    this.panel.setTip(Utils.vipText)
                    this.VIP = true
                } else {
                    this.panel.setTip(Utils.baseText)
                    this.VIP = false
                }
                console.log("VIP:", this.VIP)
            }

            async runVIP() {
                try {
                    if (!this.VIP) {
                        Utils.showLinkSwal()
                        console.log("需要授权码！")
                        return
                    }
                    Swal.fire({
                        title: "高级功能已启用！",
                        text: `学习已完全自动化！`,
                        icon: 'success',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                    })
                } catch (error) {
                    console.error(error)
                    Swal.fire({
                        title: "高级功能执行失败！",
                        text: "若一直失败，请联系进行售后处理！",
                        icon: 'error',
                        confirmButtonText: '确定',
                        allowOutsideClick: false,
                        willClose: () => {
                            console.log(' 用户确认错误，脚本已停止');
                        }
                    });
                }
            }

            async run() {
                try{
                    const onlyTime = true
                    const catalogSelecter = '.el-table__row'
                    const numList = '.number'
                    const btn = '.study-btn'
                    const numNodeList= await Utils.getStudyNode(numList,'nodeList')
                    for (let i = 0; i < numNodeList.length; i++) {
                        numNodeList[i].click()
                        const catalogList = await Utils.getStudyNode(catalogSelecter,'nodeList')
                        for (let j = 0; j < catalogList.length; j++) {
                            console.log(catalogList[j].querySelector('.course-name').innerText)
                            const status=this.checkStatus(catalogList[j])
                            if(status){
                                console.log("完成，跳过！")
                                continue;
                            }
                            catalogList[j].querySelector(btn).click()
                            const val = await this.waitForFinsh();
                            if(val!==0){
                                throw Error("错误的监听信息，请关闭其他插件")
                            }
                            if(!this.VIP && j>2 ){
                                break
                            }
                        }
                        if(!this.VIP){
                            Swal.fire({
                                title: "未开启高级功能",
                                text: '自动连播课程，需要开启高级功能',
                                icon: 'error',
                                confirmButtonColor: "#FF4DAFFF",
                                confirmButtonText: "确定",
                            })
                            break
                        }
                    }
                    this.finish()
                }catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "失败",
                        text: e+'',
                        icon: 'error',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                    })
                }

            }
            finish() {
                if (Swal) {
                    Swal.fire({
                        title: "刷课成功！",
                        text: `学习时间已达到最大值`,
                        icon: 'success',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // 尝试关闭当前页面
                            try {
                                // window.close(); // 关闭当前页面
                            } catch (error) {
                                console.error("无法直接关闭页面：", error);
                                // 如果无法直接关闭页面，提示用户手动关闭
                                Swal.fire({
                                    title: "无法自动关闭页面",
                                    text: "请手动关闭此页面。",
                                    icon: 'warning',
                                    confirmButtonColor: "#FF4DAFFF",
                                    confirmButtonText: "确定",
                                });
                            }
                        }
                    });
                }
            }

            checkStatus(dom){
                const isFinish=dom.querySelector('.el-progress__text').innerText
                return isFinish==="100%"
            }
            async waitForFinsh(){
                return new Promise(async (resolve) => {
                    const task=setInterval(()=>{
                        console.log("等待当前任务完成！")
                    },5000)
                    this.channel.onmessage = (event) => {
                        clearInterval(task)
                        resolve(event.data === 'finish' ? 0 : 1);
                    };

                });
            }
        }

        class Course {
            constructor(channel = "channel-my") {
                this.panel = new AuthWindow({
                    VIPBtnText:"高级功能-全自动挂机"
                })
                this.channel = channel
                this.VIP = false
                this.running = false
                this.init()
            }

            init() {
                this.panel.setOnVerifyCallback(async (data) => {
                    this.url = await Utils.validateCode(data)
                    if (this.url) {
                        this.panel.setTip(Utils.vipText)
                        this.VIP = true
                        return true
                    }
                })

                this.panel.setOnBegin(() => {
                    if (!this.running) {
                        this.running = true
                        console.log("运行时：", this.VIP)
                        this.run().then(r => {
                            this.running = false
                        })
                    }
                })
                this.panel.setOnVIP(async () => {
                    if (!this.url) {
                        await this.panel.handleVerify()
                    }
                    await this.runVIP()
                })
                this.loadVIPStatus()
                try {
                    Swal.fire({
                        title: "提示",
                        text: "脚本3s后自动开始",
                        icon: 'info',
                        timer: 3000,
                        confirmButtonText: '确定',
                        willClose: () => {
                            this.panel.startAutomation()
                        }
                    });
                } catch (e) {
                    console.error(e)
                    this.panel.startAutomation()
                }
            }

            loadVIPStatus() {
                if (Utils.loadStatus()) {
                    this.panel.setTip(Utils.vipText)
                    this.VIP = true
                } else {
                    this.panel.setTip(Utils.baseText)
                    this.VIP = false
                }
                console.log("VIP:", this.VIP)
            }

            async runVIP() {
                try {
                    if (!this.VIP) {
                        Utils.showLinkSwal()
                        console.log("需要授权码！")
                        return
                    }
                    Swal.fire({
                        title: "高级功能已启用！",
                        text: "现在，脚本会自动挂机，刷完当前课程学时！",
                        icon: 'success',
                        confirmButtonText: '确定',
                        willClose: () => {

                        }
                    });
                } catch (error) {
                    console.error(error)
                    Swal.fire({
                        title: "高级功能执行失败！",
                        text: "若一直失败，请联系进行售后处理！",
                        icon: 'error',
                        confirmButtonText: '确定',
                        allowOutsideClick: false,
                        willClose: () => {
                            console.log(' 用户确认错误，脚本已停止');
                        }
                    });
                }
            }

            async run() {
                try{
                    const onlyTime = true
                    const catalogSelecter = '.course-info div'

                    const catalog =await Utils.getStudyNode(catalogSelecter,'nodeList')
                    for (let i = 0; i < catalog.length; i++) {
                        console.log(catalog[i].querySelector('.two').innerText)
                        const status=this.checkStatus(catalog[i])
                        if(status){
                            console.log("跳过当前视频")
                            continue
                        }
                        catalog[i].click()
                        const video=await Utils.getStudyNode('video',"node")
                        video.muted=true
                        video.volume = 0
                        await video.play()
                        await this.waitForVideoEnd(video)

                    }
                    this.finish()
                }catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "失败",
                        text: e+'',
                        icon: 'error',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                    })
                }

            }
            sendMsg  (msg) {
                // 创建 BroadcastChannel
                const channel = new BroadcastChannel(this.channel);
                channel.postMessage(msg);
            }
            finish() {
                if (Swal) {
                    this.sendMsg('finish')
                    Swal.fire({
                        title: "学习完成！",
                        text: `学习完成，脚本10s后自动关闭页面！`,
                        icon: 'success',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                        timer:10000,
                        willClose: () => {

                        }
                    })
                    setTimeout(()=>{
                        window.close()
                    },10000)
                }
            }

            async waitForVideoEnd(video) {
                return new Promise(resolve => {
                    const checkInterval = setInterval(async () => {
                        try {
                            if (video && video.paused) {
                                console.log("视频暂停了，重新开始播放...");
                                await video.play();
                            }
                            if (!video.src) {
                                console.error("视频源未设置，即将重新加载");
                                setTimeout(() => {
                                    location.reload()
                                }, 5000)
                            }

                        } catch (e) {
                            console.error("checkInterval error:", e);
                            clearInterval(checkInterval);
                            setTimeout(() => {
                                location.reload()
                            }, 2000);
                        }
                    }, 3000);
                    video.addEventListener('ended', () => {
                        clearInterval(checkInterval);
                        resolve()

                    }, {once: true}); // 监听视频结束事件
                });
            }
            checkStatus(dom){
                const string=dom.querySelector('.four').innerText
                return string === "100%"
            }
        }

        class Utils {
            constructor() {
            }

            static flag = 'VIP'
            static vipText = '高级功能已启用！'
            static baseText = '您正在使用基础版本，功能可能存在限制'

            static loadStatus() {
                try {
                    let VIP = GM_getValue(this.flag)
                    return !!VIP
                } catch (e) {
                    console.error(e)
                }
                return false
            }

            static async validateCode(data) {
                try {
                    console.log(data);
                    let info = document.cookie.match(/(^ |;\s*)u-mobile=([^;]*)/)?.[2] && decodeURIComponent(document.cookie.match(/(^ |;\s*)u-mobile=([^;]*)/)[2]);
                    if (!info) {
                        throw new Error("无效的账号信息！")
                    }
                    data.bindInfo = info
                    data.website = "67b55c658b0da45f013f4cc4"
                    console.log(data)
                    // return
                    const res = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            'url': "https://fc-mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.next.bspapp.com/validCodeFuncCas?" + new URLSearchParams(data),
                            method: 'GET',
                            onload: function (res) {
                                if (res.status === 200) {
                                    const result = JSON.parse(res.response)
                                    console.log(result)
                                    resolve(result)
                                }
                                reject('请求失败：' + res.response)
                            },
                            onerror: function (err) {
                                console.error(err)
                                reject('请求错误！' + err.toString())
                            }
                        })
                    })
                    if (res.code !== 200) {
                        GM_deleteValue(this.flag)
                        throw new Error('验证失败：' + res.data)
                    }
                    Swal.fire({
                        title: "高级功能已启用！",
                        text: "校验成功！",
                        icon: 'success',
                        confirmButtonText: '确定',
                    });
                    GM_setValue(this.flag, true)
                    return res.data
                } catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "验证失败！",
                        text: e.toString(),
                        icon: 'error',
                        confirmButtonText: '确定',
                    });
                }
            }


            static showLinkSwal() {
                const link = [
                    "https://68n.cn/IJ8QB",
                    "https://68n.cn/RM9ob",
                ]
                Swal.fire({
                    title: '<i class="fas fa-crown swal-vip-icon"></i> 高级功能解锁',
                    html: `
        <div class="vip-alert-content">
            <div class="alert-header">
                <h3>需要验证授权码才能使用</h3>
                <p class="version-tag">高级版</p>
            </div>
            
            <div class="requirements-box">
                <div class="requirement-item">
                    <span class="number-badge">1</span>
                    <p>需有效授权码激活高级功能模块</p>
                </div>
                <div class="requirement-item">
                    <span class="number-badge">2</span>
                    <p>当前账户权限：<span class="status-tag free-status">基础版</span></p>
                </div>
            </div>
 
            <div class="action-guide">
                <p>获取授权码步骤：</p>
                <ol class="step-list">
                    <li>点击前往以下链接，获取授权码</li>
                    <li><a href=${link[0]} class="pricing-link" target="_blank" ">获取授权码链接1</a></li>
                    <li><a href=${link[1]} class="pricing-link" target="_blank"">获取授权码链接2</a></li>
                </ol>
            </div>
        </div>
    `,
                    icon: 'info',
                    confirmButtonText: '前往激活',
                    showCloseButton: true,
                    timer: 30000,
                    customClass: {
                        popup: 'vip-alert-popup',
                        confirmButton: 'vip-confirm-btn'
                    },
                    willClose: () => {
                        // window.open(link[1])
                    }
                });
            }
            static async getStudyNode(selector, type = 'node', timeout = 10000) {
                return new Promise((resolve, reject) => {
                    if (!['node', 'nodeList'].includes(type)) {
                        console.error('Invalid type parameter. Expected "node" or "nodeList"');
                        reject('Invalid type parameter. Expected "node" or "nodeList"');
                    }
                    const cleanup = (timeoutId, intervalId) => {
                        clearTimeout(timeoutId);
                        clearInterval(intervalId);
                    };
                    const handleSuccess = (result, timeoutId, intervalId) => {
                        console.log(`${selector} ready!`);
                        cleanup(timeoutId, intervalId);
                        resolve(result);
                    };
                    const handleFailure = (timeoutId, intervalId) => {
                        cleanup(timeoutId, intervalId);
                        resolve(null);
                    };
                    const checkNode = () => {
                        try {
                            let nodes;
                            if (type === 'node') {
                                nodes = document.querySelector(selector);
                                return nodes?.readyState >= 3 ? nodes : null;
                            }
                            nodes = document.querySelectorAll(selector);
                            return nodes.length > 0 ? nodes : null;
                        } catch (error) {
                            console.error('节点检查错误:', error);
                            reject('节点检查错误:', error)
                        }
                    };
                    const intervalId = setInterval(() => {
                        const result = checkNode();
                        if (result) {
                            handleSuccess(result, timeoutId, intervalId);
                        } else {
                            console.log(`等待节点: ${selector}...`);
                        }
                    }, 1000);
                    const timeoutId = setTimeout(() => {
                        console.error(`节点获取超时: ${selector}`);
                        handleFailure(timeoutId, intervalId);
                    }, timeout);
                });
            }
        }

        class AuthWindow {
            constructor({VIPBtnText="高级功能，极速刷课",VIPInfo="您正在使用基础版本，功能可能存在限制"}) {
                this.storageKey = 'AuthData';
                this.injectGlobalStyles();
                this.initDOM();
                this.loadPersistedData();
                this.show();
                this.setVIPBtnText(VIPBtnText);
                this.setTip(VIPInfo)
                // this.startAutomation()
            }

            injectGlobalStyles() {
                GM_addStyle(`
            .auth-window { position: fixed; bottom: 10px; right: 10px; z-index: 9999; background: white; padding: 24px; border-radius: 12px; box-shadow: 0 6px 30px rgba(0,0,0,0.15); border: 1px solid #e4e7ed; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 320px; transform: translateY(20px); opacity: 0; transition: all 0.3s ease; } .auth-window.visible  { transform: translateY(0); opacity: 1; } .auth-title { margin: 0 0 16px; font-size: 20px; color: #2c3e50; font-weight: 600; display: flex; align-items: center; gap: 8px; } .auth-version { font-size: 12px; color: #95a5a6; font-weight: normal; } .auth-tip { margin: 0 0 20px; color: #ffbb00; font-size: 14px; font-weight: weight; line-height: 1.5; } .input-group { margin-bottom: 18px; } .input-label { display: block; margin-bottom: 6px; color: #34495e; font-size: 14px; font-weight: 500; } .input-field { width: 80%; padding: 10px 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; transition: border-color 0.2s; } .input-field:focus { outline: none; border-color: #3498db; box-shadow: 0 0 0 3px rgba(52,152,219,0.1); } .auth-button { width: 100%; padding: 12px; background: #3498db; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 8px; } .auth-button:hover { background: #2980b9; transform: translateY(-1px); } .auth-button:active { transform: translateY(0); } .error-message { color: #e74c3c; font-size: 13px; margin-top: 8px; padding: 8px; background: #fdeded; border-radius: 6px; display: none; animation: shake 0.4s; } @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } } .control-panel { opacity: 1; transform: translateY(10px); transition: all 0.3s ease; } .control-panel.visible  { opacity: 1; transform: translateY(0); } .auth-button[disabled] { background: #bdc3c7 !important; cursor: not-allowed; } .auth-window { position: fixed; right: 30px; bottom: 80px; transition: transform 0.3s ease; } .window-toggle:hover .toggle-icon { animation: bounce 0.6s; } .toggle-icon { width: 20px; height: 20px; transition: transform 0.3s ease; } @keyframes bounce { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(4px); } } /* VIP 按钮特效 */ .vip-btn { width: 100%; position: relative; padding: 12px 24px; border: none; border-radius: 8px; background: linear-gradient(135deg, #ffd700 0%, #ffd900 30%, #ffae00 70%, #ff8c00 100%); color: #2c1a00; font-weight: 600; font-family: 'Segoe UI', sans-serif; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); overflow: hidden; box-shadow: 0 4px 15px rgba(255, 174, 0, 0.3); } /* 辉光动画效果 */ .glow-effect::after { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.4) 0%, transparent 70%); opacity: 0; transition: opacity 0.3s; } /* 悬停交互 */ .vip-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255, 174, 0, 0.5); } .vip-btn:hover::after { opacity: 1; } /* 点击反馈 */ .vip-btn:active { transform: translateY(1px); box-shadow: 0 2px 8px rgba(255, 174, 0, 0.3); } /* 皇冠图标动画 */ .crown-icon { width: 20px; height: 20px; margin-right: 8px; vertical-align: middle; transition: transform 0.3s; } .vip-btn:hover .crown-icon { transform: rotate(10deg) scale(1.1); } /* 文字渐变特效 */ .vip-text { background: linear-gradient(45deg, #2c1a00, #5a3a00); -webkit-background-clip: text; background-clip: text; color: transparent; display: inline-block; } * 弹窗容器 */ .vip-alert-popup { border: 2px solid #ffd700; border-radius: 12px; background: linear-gradient(145deg, #1a1a1a, #2d2d2d); } /* 标题区域 */ .alert-header { border-bottom: 1px solid #404040; padding-bottom: 12px; margin-bottom: 15px; } .swal-vip-icon { color: #ffd700; font-size: 2.2em; margin-right: 8px; } /* 需求列表 */ .requirements-box { background: rgba(255,215,0,0.1); border-radius: 8px; padding: 15px; margin: 15px 0; } .requirement-item { display: flex; align-items: center; margin: 10px 0; } .number-badge { background: #ffd700; color: #000; width: 24px; height: 24px; border-radius: 50%; text-align: center; margin-right: 12px; font-weight: bold; } /* 状态标签 */ .status-tag { padding: 4px 8px; border-radius: 4px; font-size: 0.9em; } .free-status { background: #ff4444; color: white; } /* 操作引导 */ .action-guide { background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; } .step-list li { margin: 8px 0; padding-left: 8px; } .pricing-link { color: #00ff9d !important; text-decoration: underline dotted; transition: all 0.3s; } .pricing-link:hover { color: #00cc7a !important; text-decoration: underline; } /* 确认按钮 */ .vip-confirm-btn { background: linear-gradient(135deg, #ffd700 0%, #ff9900 100%) !important; border: none !important; font-weight: bold !important; transition: transform 0.2s !important; } .vip-confirm-btn:hover { transform: scale(1.05); }
        `)
                GM_addStyle(` div.swal2-container { all: initial !important; /* 重置所有继承样式 */ position: fixed !important; z-index: 999999 !important; inset: 0 !important; display: flex !important; align-items: center !important; justify-content: center !important; background: rgba(0,0,0,0.4) !important; } .swal2-popup { all: initial !important; max-width: 600px !important; width: 90vw !important; min-width: 300px !important; position: relative !important; box-sizing: border-box !important; padding: 20px !important; background: white !important; border-radius: 8px !important; font-family: Arial !important; animation: none !important; } @keyframes swal2-show { 0% { transform: scale(0.9); opacity: 0 } 100% { transform: scale(1); opacity: 1 } } `);
            }

            initDOM() {
                this.container = document.createElement('div');
                this.container.className = 'auth-window';

                // 标题区域
                const title = document.createElement('h3');
                title.className = 'auth-title';
                title.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            <path d="M12 7v5l3 3"/>
        </svg>
        <span>脚本控制台<span class="auth-version">v${GM_info.script.version}</span></span>
    `;

                // 提示信息
                const tip = document.createElement('p');
                tip.className = 'auth-tip';
                tip.textContent = '您正在使用基础版本，功能可能存在限制';
                this.tip = tip
                // 输入框组
                // this.phoneInput = this.createInput(' 手机/QQ号', 'text', '#phone');
                this.authInput = this.createInput(' 授权密钥', 'password', '#auth');

                // 授权链接
                const link = [
                    "https://68n.cn/IJ8QB",
                    "https://68n.cn/RM9ob",
                ]
                const authLink1 = this.createLink('authLink1', link[0], '获取授权链接1');
                const authLink2 = this.createLink('authLink2', link[1], '获取授权链接2');


                // 验证按钮
                this.verifyBtn = document.createElement('button');
                this.verifyBtn.className = 'auth-button';
                this.verifyBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20 12l-8 8-4-4m0 0l4-4m-4 4L4 12l4-4"/>
        </svg>
        验证授权码 
    `;
                this.verifyBtn.onclick = () => this.handleVerify();

                // 启动控制面板
                this.controlPanel = document.createElement('div');
                this.controlPanel.className = 'control-panel';
                this.controlPanel.style.cssText = `
        margin-top: 20px;
        border-top: 1px solid #eee;
        padding-top: 16px;
    `;
                this.vipBtn = document.createElement('button');
                this.vipBtn.className = 'vip-btn glow-effect';
                this.vipBtn.innerHTML = `
            <span class="glow-container"></span>
            <svg class="crown-icon" viewBox="0 0 24 24">
                <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3H5v2h14v-2z"/>
            </svg>
            <span class="vip-text">高级功能-全自动挂机</span>
        `;
                this.vipBtn.addEventListener('click', () => {
                    this.handleVIPClick()
                })
                // 计时器
                this.timerDisplay = document.createElement('div');
                this.timerDisplay.className = 'timer';
                this.timerDisplay.textContent = '运行时间: 00:00:00';
                this.timerDisplay.style.cssText = `
        color: #2ecc71;
        font-size: 13px;
        margin-bottom: 12px;
    `;

                // 开始按钮
                this.startBtn = document.createElement('button');
                this.startBtn.className = 'auth-button';
                this.startBtn.style.backgroundColor = '#2ecc71';
                this.startBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
        开始运行-自动化挂机
    `;
                this.startBtn.onclick = () => this.startAutomation();

                // 错误提示
                this.errorBox = document.createElement('div');
                this.errorBox.className = 'error-message';


                // 组装结构
                this.controlPanel.append(
                    this.vipBtn,
                    this.timerDisplay,
                    this.startBtn
                );

                this.container.append(
                    title,
                    tip,
                    // this.phoneInput.container,
                    this.authInput.container,
                    authLink1,
                    authLink2,
                    this.verifyBtn,
                    this.controlPanel,
                    this.errorBox
                );

                document.body.appendChild(this.container);
                this.initControlBtn()
            }

            initControlBtn() {
                // 创建控制按钮
                this.toggleBtn = document.createElement('button');
                this.toggleBtn.className = 'window-toggle';
                this.toggleBtn.innerHTML = `
        <svg class="toggle-icon" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span class="toggle-text">展开面板</span>
    `;
                this.toggleBtn.style.cssText = `
        position: fixed;
        right: 30px;
        bottom: 30px;
        padding: 12px 20px;
        background: #fff;
        border: none;
        border-radius: 30px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
        z-index: 9999999;
    `;

                // 添加交互效果
                this.toggleBtn.addEventListener('mouseenter', () => {
                    this.toggleBtn.style.transform = 'translateY(-2px)';
                    this.toggleBtn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
                });

                this.toggleBtn.addEventListener('mouseleave', () => {
                    this.toggleBtn.style.transform = 'none';
                    this.toggleBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                });

                // 点击事件处理
                this.toggleBtn.onclick = () => {
                    const isVisible = this.container.style.display !== 'none';
                    this.container.style.display = isVisible ? 'none' : 'block';

                    // 更新按钮状态
                    this.toggleBtn.querySelector('.toggle-icon').style.transform =
                        isVisible ? 'rotate(180deg)' : 'none';
                    this.toggleBtn.querySelector('.toggle-text').textContent =
                        isVisible ? '展开面板' : '收起面板';

                    // 添加动画效果
                    if (!isVisible) {
                        this.container.animate([
                            {opacity: 0, transform: 'translateY(20px)'},
                            {opacity: 1, transform: 'none'}
                        ], {duration: 300, easing: 'ease-out'});
                    }
                };

                document.body.appendChild(this.toggleBtn);
            }

            startAutomation(callback) {
                if (!this.isRunning) {
                    this.startTime = Date.now();
                    this.isRunning = true;
                    this.startBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M6 12h12"/>
            </svg>
            运行中...
        `;
                    this.startBtn.style.backgroundColor = '#e67e22';
                    this.startBtn.disabled = true;

                    // 启动计时器
                    this.timer = setInterval(() => {
                        const elapsed = Date.now() - this.startTime;
                        const hours = Math.floor(elapsed / 3600000);
                        const minutes = Math.floor((elapsed % 3600000) / 60000);
                        const seconds = Math.floor((elapsed % 60000) / 1000);
                        this.timerDisplay.textContent =
                            `运行时间: ${hours.toString().padStart(2, '0')}:` +
                            `${minutes.toString().padStart(2, '0')}:` +
                            `${seconds.toString().padStart(2, '0')}`;
                    }, 1000);

                    // 触发自动化任务
                    if (typeof callback === 'function') {
                        callback()
                    }
                    if (this.begin && typeof this.begin === 'function') {
                        this.begin()
                    }
                }
            }

            createInput(labelText, type, id) {
                const container = document.createElement('div');
                container.className = 'input-group';

                const label = document.createElement('label');
                label.className = 'input-label';
                label.textContent = labelText;
                label.htmlFor = id;

                const input = document.createElement('input');
                input.className = 'input-field';
                input.type = type;
                input.id = id;
                input.maxLength = 16
                container.appendChild(label);
                container.appendChild(input);
                return {container, input};
            }

            createLink(id, link, name) {
                const authLink = document.createElement('a');
                authLink.id = id;
                authLink.className = 'auth-link';
                authLink.href = link;
                authLink.target = '_blank';
                authLink.textContent = name;
                authLink.style.cssText = `
        display: block; margin: 12px 0; color: #3498db; text-decoration: none; font-size: 13px; transition: opacity 0.2s; `;
                authLink.addEventListener('mouseenter', () => {
                    authLink.style.opacity = '0.8';
                    authLink.style.textDecoration = 'underline';
                });
                authLink.addEventListener('mouseleave', () => {
                    authLink.style.opacity = '1';
                    authLink.style.textDecoration = 'none';
                });
                return authLink
            }

            show() {
                setTimeout(() => {
                    this.container.classList.add('visible');
                }, 100);
            }

            showError(message) {
                this.errorBox.textContent = message;
                this.errorBox.style.display = 'block';
                setTimeout(() => {
                    this.errorBox.style.display = 'none';
                }, 5000);
            }

            async handleVerify() {
                const data = {
                    // phone: this.phoneInput.input.value,
                    key: this.authInput.input.value
                };
                console.log(data);
                if (!data.key || !(/^[A-Z0-9]{16}$/).test(data.key)) {
                    Swal.fire({
                        title: "授权码不正确，应为16位",
                        text: "请正确输入！",
                        icon: 'info',
                        confirmButtonText: '确定',
                    });
                    return
                }
                // 触发验证回调
                if (this.onVerify) {
                    if (await this.onVerify(data)) {
                        GM_setValue(this.storageKey, JSON.stringify(data))
                    } else {

                    }
                }
            }

            handleVIPClick() {
                if (this.vipCallback) {
                    this.vipCallback()
                } else {
                    Swal.fire({
                        title: "提示",
                        text: "请在视频播放页面使用！",
                        icon: 'info',
                        confirmButtonText: '确定',
                        willClose: () => {
                            console.log(' 用户确认错误，脚本已停止');
                        }
                    });
                }
            }

            loadPersistedData() {
                let saved = GM_getValue(this.storageKey);
                if (saved) {
                    saved = JSON.parse(saved)
                    // this.phoneInput.input.value = saved.phone || '';
                    this.authInput.input.value = saved.key || '';
                }
            }


            hide() {
                this.container.style.display = 'none';
            }

            // get phone() {
            //     return this.phoneInput.input.value;
            // }

            // set phone(value) {
            //     this.phoneInput.input.value = value;
            // }

            get key() {
                return this.authInput.input.value;
            }

            set key(value) {
                // this.authInput.input.value = value;
            }

            setTip(text) {
                this.tip.innerText = text
            }

            // 验证回调函数
            setOnVerifyCallback(callback) {
                this.onVerify = callback;
            }

            setOnBegin(callback) {
                this.begin = callback;
            }

            setOnVIP(callback) {
                this.vipCallback = callback;
            }
            setVIPBtnText(text) {
                this.vipBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20 12l-8 8-4-4m0 0l4-4m-4 4L4 12l4-4"/>
        </svg>
        ${text} 
    `;
            }
        }

        const sleep = function (time) {
            return new Promise(resolve => setTimeout(resolve, time));
        }

        new Runner()
    }
}
// 国家开放大学
class BestTeacher{
    constructor() {
    }
    run(config) {

        this.setupCoreFeatures(config);
    }
    setupCoreFeatures({refreshInterval}) {
        class Runner {
            constructor() {
                this.runner = null
                this.run()
            }

            run() {
                const url = location.href;
                if (url.includes("activity/curriculum/")) {
                    this.runner = new Index("channel-best-teacher")
                    // this.runner.run()
                }
                    // else if (url.includes("learnHelper-main.action")) {
                    //     this.runner = new Middle("channel-best-teacher")
                // }
                else if (url.includes("learnspace/learn/learn/templateeight/index.action")) {
                    this.runner = new Course("channel-best-teacher")
                }
            }
        }

        class Index {
            constructor(channel = "channel-my") {
                this.panel = new AuthWindow({
                    VIPBtnText:"高级功能-全自动挂机"
                })
                this.channel = new BroadcastChannel(channel)
                this.VIP = false
                this.running = false
                this.init()
            }

            init() {
                this.panel.setOnVerifyCallback(async (data) => {
                    this.url = await Utils.validateCode(data)
                    if (this.url) {
                        this.panel.setTip(Utils.vipText)
                        this.VIP = true
                        return true
                    }
                })

                this.panel.setOnBegin(() => {
                    if (!this.running) {
                        this.running = true
                        console.log("运行时：", this.VIP)
                        this.run().then(r => {
                            this.running = false
                        })
                    }
                })
                this.panel.setOnVIP(async () => {
                    if (!this.url) {
                        await this.panel.handleVerify()
                    }
                    await this.runVIP()
                })
                this.loadVIPStatus()
                try {
                    Swal.fire({
                        title: "提示",
                        text: "全自动挂机，请手动点击开始！",
                        icon: 'info',
                        timer: 0,
                        confirmButtonText: '确定',
                        willClose: () => {
                            if(!this.VIP){
                                Swal.fire({
                                    title: "当前是基础版",
                                    text: '课程不会连播，课程内只连播前三个视频！',
                                    icon: 'info',
                                    timer: 5000,
                                    confirmButtonColor: "#FF4DAFFF",
                                    confirmButtonText: "确定",
                                })
                            }
                        }
                    });
                } catch (e) {
                    console.error(e)
                    // this.panel.startAutomation()
                }
            }

            loadVIPStatus() {
                if (Utils.loadStatus()) {
                    this.panel.setTip(Utils.vipText)
                    this.VIP = true
                } else {
                    this.panel.setTip(Utils.baseText)
                    this.VIP = false
                }
                console.log("VIP:", this.VIP)
            }

            async runVIP() {
                try {
                    if (!this.VIP) {
                        Utils.showLinkSwal()
                        console.log("需要授权码！")
                        return
                    }
                    Swal.fire({
                        title: "高级功能已启用！",
                        text: `学习完全自动化`,
                        icon: 'success',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                    })
                } catch (error) {
                    console.error(error)
                    Swal.fire({
                        title: "高级功能执行失败！",
                        text: "若一直失败，请联系进行售后处理！",
                        icon: 'error',
                        confirmButtonText: '确定',
                        allowOutsideClick: false,
                        willClose: () => {
                            console.log(' 用户确认错误，脚本已停止');
                        }
                    });
                }
            }

            async run() {
                try {
                    const catalogSelecter = '.l-cell'
                    const btn = '.lc-r-btn'
                    const catalogList = await Utils.getStudyNode(window,catalogSelecter, 'nodeList')
                    for (let j = 0; j < catalogList.length; j++) {
                        console.log(catalogList[j].querySelector('span').innerText)
                        const status = catalogList[j].classList.length > 1
                        if (status) {
                            console.log("完成，跳过！")
                            continue;
                        }
                        catalogList[j].querySelector(btn).click()
                        await sleep(500)
                        document.querySelector('.el-button').click()
                        const val = await this.waitForFinish();
                        if (val !== 0) {
                            throw Error("错误的监听信息，请关闭其他插件")
                        }
                        if(!this.VIP){
                            Swal.fire({
                                title: "未开启高级功能",
                                text: '自动连播课程，需要开启高级功能',
                                icon: 'error',
                                confirmButtonColor: "#FF4DAFFF",
                                confirmButtonText: "确定",
                            })
                            break
                        }

                    }

                    this.finish()
                } catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "失败",
                        text: e + '',
                        icon: 'error',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                    })
                }

            }

            finish() {
                if (Swal) {
                    Swal.fire({
                        title: "刷课成功！",
                        text: `学习时间已达到最大值`,
                        icon: 'success',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // 尝试关闭当前页面
                            try {
                                // window.close(); // 关闭当前页面
                            } catch (error) {
                                console.error("无法直接关闭页面：", error);
                                // 如果无法直接关闭页面，提示用户手动关闭
                                Swal.fire({
                                    title: "无法自动关闭页面",
                                    text: "请手动关闭此页面。",
                                    icon: 'warning',
                                    confirmButtonColor: "#FF4DAFFF",
                                    confirmButtonText: "确定",
                                });
                            }
                        }
                    });
                }
            }

            async waitForFinish() {
                return new Promise(async (resolve) => {
                    const task = setInterval(() => {
                        console.log("等待当前任务完成！")
                    }, 5000)
                    this.channel.onmessage = (event) => {
                        clearInterval(task)
                        if (event.data === 'finish') {
                            resolve(event.data === 'finish' ? 0 : 1);
                        }

                    };

                });
            }
        }

        class Course {
            constructor(channel = "channel-my") {
                this.panel = new AuthWindow({
                    VIPBtnText:"高级功能-全自动挂机"
                })
                this.channel = channel
                this.VIP = false
                this.running = false
                this.init()
                console.log("Course 加载成功！")
            }

            init() {
                this.panel.setOnVerifyCallback(async (data) => {
                    Swal.fire({
                        title: "提示",
                        text: "请在目录页面激活授权码！",
                        icon: 'info',
                        timer: 3000,
                        confirmButtonText: '确定',
                        willClose: () => {
                        }
                    });
                    // this.url = await Utils.validateCode(data)
                    // if (this.url) {
                    //     this.panel.setTip(Utils.vipText)
                    //     this.VIP = true
                    //     return true
                    // }
                })

                this.panel.setOnBegin(() => {
                    if (!this.running) {
                        this.running = true
                        console.log("运行时：", this.VIP)
                        this.run().then(r => {
                            this.running = false
                        })
                    }
                })
                this.panel.setOnVIP(async () => {
                    // if (!this.url) {
                    //     await this.panel.handleVerify()
                    // }
                    await this.runVIP()
                })
                this.loadVIPStatus()
                try {
                    Swal.fire({
                        title: "提示",
                        text: "脚本3s后自动开始",
                        icon: 'info',
                        timer: 3000,
                        confirmButtonText: '确定',
                        willClose: () => {
                            this.panel.startAutomation()
                        }
                    });
                } catch (e) {
                    console.error(e)
                    this.panel.startAutomation()
                }
            }

            loadVIPStatus() {

                if (Utils.loadStatus()) {
                    this.panel.setTip(Utils.vipText)
                    this.VIP = true
                } else {
                    this.panel.setTip(Utils.baseText)
                    this.VIP = false
                }
                console.log("VIP:", this.VIP)
            }

            async runVIP() {
                try {
                    if (!this.VIP) {
                        Utils.showLinkSwal()
                        console.log("需要授权码！")
                        return
                    }
                    /*const currentItem = this.getCurrentItem();
                    switch (currentItem.type) {
                        case "video":
                            console.log("类型：video")
                            eval(`/!**
                             * @file api_webtrn.js
                             * @author 14239
                             * @date 2025/2/19 17:59
                             * @version
                             * @copyright 2025
                             *!/
                            window.VIPRunning = true

                            function simpleFormat(totalSeconds) {
                                const hours = Math.floor(totalSeconds / 3600);
                                const minutes = Math.floor((totalSeconds % 3600) / 60);
                                const secs = Math.floor(totalSeconds % 60);
                                return [hours, minutes, secs].map(n => n.toString().padStart(2, '0')).join(':');
                            }

                            const getParams = function (r) {
                                var s = {
                                    courseId: r.courseId,
                                    itemId: r.itemId,
                                    time1: CommonUtil.formatStr((new Date()).getTime(), 20),
                                    time2: CommonUtil.formatStr(parseInt(r.startTime), 20),
                                    time3: CommonUtil.formatStr(CommonUtil.timeToSeconds(r.videoTotalTime), 20),
                                    time4: CommonUtil.formatStr(parseInt(r.endTime), 20),
                                    videoIndex: r.videoIndex || 0,
                                    time5: CommonUtil.formatStr(r.studyTimeLong, 20),
                                    terminalType: r.terminalType || 0,
                                    recordType: r.recordType
                                };
                                return s
                            }
                            const encryptFuc = function (e) {
                                // var b = "bGVhcm5zcGFjZWFlczEyMw==";
                                // var a = new CommonUtil.Base64();
                                // var c = a.decode(b);
                                var c = "learnspaceaes123";
                                var f = CryptoJS.enc.Utf8.parse(c);
                                var d = CryptoJS.AES.encrypt(e, f, {
                                    mode: CryptoJS.mode.ECB,
                                    padding: CryptoJS.pad.Pkcs7
                                });
                                return d.toString()
                            }
                            window.VIP = async (itemId) => {
                                const list = resolveUndoList()
                                for (const item of list) {
                                    await recordTime(itemId, item.duration, item.startTime, item.endTime)
                                }
                            }
                            const resolveUndoList = () => {
                                const mainWin = document.querySelector('#mainContent').contentWindow
                                const frameWin = mainWin.document.querySelector('#mainFrame').contentWindow
                                const video = frameWin.document.querySelector('video')
                                const duration = video.duration;
                                let undoList = frameWin.document.querySelectorAll('.trace_undo')
                                const undoTimeRanges = []
                                undoList.forEach(undoEl => {
                                    // 提取百分比数据
                                    const leftPercent = parseFloat(undoEl.style.left.replace('%', '')) || 0;
                                    const widthPercent = parseFloat(undoEl.getAttribute('widthval').replace('%', '')) || 0;

                                    // 计算时间范围
                                    const startSec = (leftPercent / 100) * duration;
                                    const endSec = ((leftPercent + widthPercent) / 100) * duration;

                                    undoTimeRanges.push({
                                        startTime: startSec,
                                        endTime: endSec,
                                        duration: Math.round(endSec - startSec)
                                    });
                                });
                                console.log("计算的未完成数组：", undoTimeRanges);
                                return undoTimeRanges
                            }
                            const recordTime = async (itemId, duration, startTime, endTime) => {
                                const payload = {
                                    "playComplete": false,
                                    "courseId": courseId,
                                    "itemId": itemId,
                                    "position": endTime-1,
                                    "videoTotalTime": simpleFormat(duration),
                                    "interval": false,
                                    "startTime": startTime,
                                    "endTime": endTime,
                                    "recordType": "onTime",
                                    "studyTimeLong": endTime - startTime,
                                    "startTimeStr": simpleFormat(startTime),
                                    "endTimeStr": simpleFormat(endTime)
                                }
                                console.log("payload:", payload)

                                const param = getParams(payload)
                                console.log("param:", param)
                                const encrypt = encryptFuc(JSON.stringify(param));
                                const body = {
                                    // studyRecord:encrypt,
                                    studyRecord: encrypt,
                                    limitId: limitId
                                }
                                let res = await fetch("https://zjdx-kfkc.webtrn.cn/learnspace/course/study/learningTime_saveVideoLearnDetailRecord.action", {
                                    "headers": {
                                        "accept": "application/json, text/javascript, *!/!*; q=0.01",
                                        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                                        "cache-control": "no-cache",
                                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                                        "pragma": "no-cache",
                                        "sec-ch-ua": "\\"Not(A:Brand\\";v=\\"99\\", \\"Microsoft Edge\\";v=\\"133\\", \\"Chromium\\";v=\\"133\\"",
                                        "sec-ch-ua-mobile": "?0",
                                        "sec-ch-ua-platform": "\\"Windows\\"",
                                        "sec-fetch-dest": "empty",
                                        "sec-fetch-mode": "cors",
                                        "sec-fetch-site": "same-origin",
                                        "x-requested-with": "XMLHttpRequest"
                                    },
                                    "referrer": location.href,
                                    "referrerPolicy": "strict-origin-when-cross-origin",
                                    "body": new URLSearchParams(body),
                                    "method": "POST",
                                    "mode": "cors",
                                    "credentials": "include"
                                });
                                if (res.ok) {
                                    res = await res.json()
                                    console.log("更新视频时长：", res)
                                    if (res.success) {
                                        let body = {
                                            courseId: courseId,
                                            studyTime: endTime - startTime,
                                            limitId: limitId
                                        }
                                        let resStu = await fetch("https://zjdx-kfkc.webtrn.cn/learnspace/course/study/learningTime_saveLearningTime.action", {
                                            "headers": {
                                                "accept": "application/json, text/javascript, *!/!*; q=0.01",
                                                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                                                "cache-control": "no-cache",
                                                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                                                "pragma": "no-cache",
                                                "sec-ch-ua": "\\"Not(A:Brand\\";v=\\"99\\", \\"Microsoft Edge\\";v=\\"133\\", \\"Chromium\\";v=\\"133\\"",
                                                "sec-ch-ua-mobile": "?0",
                                                "sec-ch-ua-platform": "\\"Windows\\"",
                                                "sec-fetch-dest": "empty",
                                                "sec-fetch-mode": "cors",
                                                "sec-fetch-site": "same-origin",
                                                "x-requested-with": "XMLHttpRequest"
                                            },
                                            "referrer": location.href,
                                            "referrerPolicy": "strict-origin-when-cross-origin",
                                            "body": new URLSearchParams(body),
                                            "method": "POST",
                                            "mode": "cors",
                                            "credentials": "include"
                                        });
                                        if (resStu.ok) {
                                            resStu = await resStu.json()
                                            console.log("更新时间：", resStu)
                                        }

                                    }
                                }
                            }`)

                            console.log('VIP:',VIP)
                            await window.VIP(currentItem.itemId)
                            break;
                        case "doc":
                            console.log("类型：doc")

                            break

                    }*/

                    Swal.fire({
                        title: "高级功能已启用！",
                        text: "现在，脚本会自动挂机，刷完当前所有课程！",
                        icon: 'success',
                        confirmButtonText: '确定',
                        willClose: () => {

                        }
                    });
                } catch (error) {
                    console.error(error)
                    Swal.fire({
                        title: "高级功能执行失败！",
                        text: "若一直失败，请联系进行售后处理！",
                        icon: 'error',
                        confirmButtonText: '确定',
                        allowOutsideClick: false,
                        willClose: () => {
                            console.log(' 用户确认错误，脚本已停止');
                        }
                    });
                }
            }

            async run() {
                try {
                    console.log(window)
                    const onlyTime = true
                    const catalogSelecter = '.helper-detail-row'
                    const catalogSelecter2 = '.s_point'
                    const mainWindow = document.querySelector('#mainContent').contentWindow
                    if (!mainWindow) {
                        throw Error("未获取到helperWindow！请刷新重试")
                    }
                    // const helperWindow=await Utils.getStudyNode(window,'#learnHelperIframe','node').contentWindow
                    const helperWindow = document.querySelector('#learnHelperIframe').contentWindow
                    if (!helperWindow) {
                        throw Error("未获取到helperWindow！请刷新重试")
                    }
                    setTimeout(() => {
                        helperWindow.closeLearnHelper()
                    }, 1000)

                    let courseWindow = await Utils.getStudyNode(mainWindow, '#mainFrame', 'node')
                    courseWindow = courseWindow.contentWindow
                    const catalog = await Utils.getStudyNode(mainWindow, catalogSelecter2, 'nodeList')
                    if (!courseWindow) {
                        throw Error("未获取到courseWindow！请刷新重试！")
                    }
                    for (let i = 0; i < catalog.length; i++) {
                        console.log(catalog[i].querySelector('.s_pointti').innerText)
                        const status = this.checkStatus(catalog[i])
                        if (status) {
                            console.log("跳过当前视频")
                            continue
                        }
                        catalog[i].click()
                        const currentItem = this.getCurrentItem();
                        await sleep(2000)
                        switch (currentItem.type) {
                            case "video":
                                courseWindow = await Utils.getStudyNode(mainWindow, '#mainFrame', 'node')
                                courseWindow = courseWindow.contentWindow
                                const video = await Utils.getStudyNode(courseWindow, 'video', "node")
                                video.muted = true
                                video.volume = 0
                                video.currentTime = 0
                                await video.play()
                                /*const int = setInterval(async () => {
                                    try {
                                        video.muted = true
                                        video.volume = 0
                                        await video.play()
                                    } catch (e) {
                                        console.error(e)
                                    }
                                }, 2000)*/
                                await this.waitForVideoEnd(video)
                                await sleep(1000)
                                // clearInterval(int)
                                break
                            case "doc":
                                console.log("类型：doc")
                                await sleep(5000)
                                break
                        }
                        if(!this.VIP && i>2){
                            Swal.fire({
                                title: "未开启高级功能",
                                text: '仅支持前三个课程自动连播！若需要完整连播，请开启高级功能！',
                                icon: 'error',
                                confirmButtonColor: "#FF4DAFFF",
                                confirmButtonText: "确定",
                            })
                            await sleep(10000)
                            break
                        }


                    }
                    this.finish()
                } catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "Course 层出错！",
                        text: e + '',
                        icon: 'error',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                    })
                }

            }

            async waitForVideoEnd(video) {
                return new Promise(resolve => {
                    const checkInterval = setInterval(async () => {
                        try {
                            if (video && video.paused) {
                                console.log("视频暂停了，重新开始播放...");
                                video.click();
                                await video.play();
                            }
                            if (!video.src) {
                                console.error("视频源未设置，即将重新加载");
                                setTimeout(() => {
                                    location.reload()
                                }, 5000)
                            }

                        } catch (e) {
                            console.error("checkInterval error:", e);
                            clearInterval(checkInterval);
                            setTimeout(() => {
                                location.reload()
                            }, 2000);
                        }
                    }, 3000);
                    video.addEventListener('ended', () => {
                        clearInterval(checkInterval);
                        console.log("视频播放完成！")
                        resolve()

                    }); // 监听视频结束事件
                });
            }

            checkStatus(dom) {
                // const string = dom.querySelector('.state').innerText
                // return string === "100%"
                const classList = dom.querySelector('.item_done_icon').classList;
                return Array.from(classList).includes("done_icon_show")
            }
            finish() {
                if (Swal) {
                    this.sendMsg('finish')
                    Swal.fire({
                        title: "学习完成！",
                        text: `学习完成，脚本10s后自动关闭页面！`,
                        icon: 'success',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                        timer: 10000,
                        willClose: () => {

                        }
                    })
                    setTimeout(()=>{
                        window.close()
                    },10000)
                }
            }
            getCurrentItem(){
                try {
                    const mainWin=document.querySelector('#mainContent').contentWindow
                    const item = mainWin.document.querySelector('.s_pointerct');
                    return {
                        itemId: item.getAttribute('id').split('_')[2],
                        type: item.getAttribute('itemtype'),
                    }
                }catch(e) {
                    throw Error(e+"获取节点失败！");
                }

            }
            sendMsg(msg) {
                // 创建 BroadcastChannel
                const channel = new BroadcastChannel(this.channel);
                channel.postMessage(msg);
            }
        }

        class Utils {
            constructor() {
            }

            static flag = 'VIP'
            static vipText = '高级功能已启用！'
            static baseText = '您正在使用基础版本，功能可能存在限制'

            static loadStatus() {
                try {
                    let VIP = GM_getValue(this.flag)
                    return !!VIP
                } catch (e) {
                    console.error(e)
                }
                return false
            }

            static async validateCode(data) {
                try {
                    console.log(data);
                    let info = JSON.parse(sessionStorage.getItem('vuex')).userinfo
                    if (!info) {
                        throw new Error("无效的账号信息！")
                    }
                    data.bindInfo = info.name+'_'+info.phone
                    data.website = "67b6aa29149854207fc70534"
                    console.log(data)
                    // return
                    const res = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            'url': "https://fc-mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.next.bspapp.com/validCodeFuncCas?" + new URLSearchParams(data),
                            method: 'GET',
                            onload: function (res) {
                                if (res.status === 200) {
                                    const result = JSON.parse(res.response)
                                    console.log(result)
                                    resolve(result)

                                }
                                reject('请求失败：' + res.response)

                            },
                            onerror: function (err) {
                                console.error(err)
                                reject('请求错误！' + err.toString())
                            }
                        })
                    })
                    if (res.code !== 200) {
                        GM_deleteValue(this.flag)
                        throw new Error('验证失败：' + res.data)
                    }
                    Swal.fire({
                        title: "高级功能已启用！",
                        text: "校验成功！",
                        icon: 'success',
                        confirmButtonText: '确定',
                    });
                    GM_setValue(this.flag, true)
                    return res.data
                } catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "验证失败！",
                        text: e.toString(),
                        icon: 'error',
                        confirmButtonText: '确定',
                    });
                }
            }


            static showLinkSwal() {
                const link = [
                    "https://68n.cn/IJ8QB",
                    "https://68n.cn/RM9ob",
                ]
                Swal.fire({
                    title: '<i class="fas fa-crown swal-vip-icon"></i> 高级功能解锁',
                    html: `
        <div class="vip-alert-content">
            <div class="alert-header">
                <h3>需要验证授权码才能使用</h3>
                <p class="version-tag">高级版</p>
            </div>
            
            <div class="requirements-box">
                <div class="requirement-item">
                    <span class="number-badge">1</span>
                    <p>需有效授权码激活高级功能模块</p>
                </div>
                <div class="requirement-item">
                    <span class="number-badge">2</span>
                    <p>当前账户权限：<span class="status-tag free-status">基础版</span></p>
                </div>
            </div>
 
            <div class="action-guide">
                <p>获取授权码步骤：</p>
                <ol class="step-list">
                    <li>点击前往以下链接，获取授权码</li>
                    <li><a href=${link[0]} class="pricing-link" target="_blank" ">获取授权码链接1</a></li>
                    <li><a href=${link[1]} class="pricing-link" target="_blank"">获取授权码链接2</a></li>
                </ol>
            </div>
        </div>
    `,
                    icon: 'info',
                    confirmButtonText: '前往激活',
                    showCloseButton: true,
                    timer: 30000,
                    customClass: {
                        popup: 'vip-alert-popup',
                        confirmButton: 'vip-confirm-btn'
                    },
                    willClose: () => {
                        // window.open(link[1])
                    }
                });
            }

            static async getStudyNode(dom, selector, type = 'node', timeout = 10000) {
                return new Promise((resolve, reject) => {
                    if (!['node', 'nodeList'].includes(type)) {
                        console.error('Invalid type parameter. Expected "node" or "nodeList"');
                        reject('Invalid type parameter. Expected "node" or "nodeList"');
                    }
                    const cleanup = (timeoutId, intervalId) => {
                        clearTimeout(timeoutId);
                        clearInterval(intervalId);
                    };
                    const handleSuccess = (result, timeoutId, intervalId) => {
                        console.log(`${selector} ready!`);
                        cleanup(timeoutId, intervalId);
                        resolve(result);
                    };
                    const handleFailure = (timeoutId, intervalId) => {
                        cleanup(timeoutId, intervalId);
                        resolve(null);
                    };
                    const checkNode = () => {
                        try {
                            let nodes;
                            if (selector === 'video') {
                                const ready = dom.document.querySelector(selector);
                                return ready?.readyState >= 3 ? ready : null
                            }
                            if (type === 'node') {
                                return dom.document.querySelector(selector);
                            }
                            nodes = dom.document.querySelectorAll(selector);
                            return nodes.length > 0 ? nodes : null;
                        } catch (error) {
                            console.error('节点检查错误:', error);
                            reject('节点检查错误:', error)
                        }
                    };
                    const intervalId = setInterval(() => {
                        const result = checkNode();
                        // console.log(window.document.querySelector(selector))
                        // console.log(document.querySelector(selector))
                        if (result) {
                            handleSuccess(result, timeoutId, intervalId);
                        } else {
                            console.log(`等待节点: ${selector}...`);
                        }
                    }, 1000);
                    const timeoutId = setTimeout(() => {
                        console.error(`节点获取超时: ${selector}`);
                        handleFailure(timeoutId, intervalId);
                    }, timeout);
                });
            }

        }

        class AuthWindow {
            constructor({VIPBtnText="高级功能，极速刷课",VIPInfo="您正在使用基础版本，功能可能存在限制"}) {
                this.storageKey = 'AuthData';
                this.injectGlobalStyles();
                this.initDOM();
                this.loadPersistedData();
                this.show();
                this.setVIPBtnText(VIPBtnText);
                this.setTip(VIPInfo)
                // this.startAutomation()
            }

            injectGlobalStyles() {
                GM_addStyle(`
            .auth-window { position: fixed; bottom: 10px; right: 10px; z-index: 9999; background: white; padding: 24px; border-radius: 12px; box-shadow: 0 6px 30px rgba(0,0,0,0.15); border: 1px solid #e4e7ed; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 320px; transform: translateY(20px); opacity: 0; transition: all 0.3s ease; } .auth-window.visible  { transform: translateY(0); opacity: 1; } .auth-title { margin: 0 0 16px; font-size: 20px; color: #2c3e50; font-weight: 600; display: flex; align-items: center; gap: 8px; } .auth-version { font-size: 12px; color: #95a5a6; font-weight: normal; } .auth-tip { margin: 0 0 20px; color: #ffbb00; font-size: 14px; font-weight: weight; line-height: 1.5; } .input-group { margin-bottom: 18px; } .input-label { display: block; margin-bottom: 6px; color: #34495e; font-size: 14px; font-weight: 500; } .input-field { width: 80%; padding: 10px 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; transition: border-color 0.2s; } .input-field:focus { outline: none; border-color: #3498db; box-shadow: 0 0 0 3px rgba(52,152,219,0.1); } .auth-button { width: 100%; padding: 12px; background: #3498db; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 8px; } .auth-button:hover { background: #2980b9; transform: translateY(-1px); } .auth-button:active { transform: translateY(0); } .error-message { color: #e74c3c; font-size: 13px; margin-top: 8px; padding: 8px; background: #fdeded; border-radius: 6px; display: none; animation: shake 0.4s; } @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } } .control-panel { opacity: 1; transform: translateY(10px); transition: all 0.3s ease; } .control-panel.visible  { opacity: 1; transform: translateY(0); } .auth-button[disabled] { background: #bdc3c7 !important; cursor: not-allowed; } .auth-window { position: fixed; right: 30px; bottom: 80px; transition: transform 0.3s ease; } .window-toggle:hover .toggle-icon { animation: bounce 0.6s; } .toggle-icon { width: 20px; height: 20px; transition: transform 0.3s ease; } @keyframes bounce { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(4px); } } /* VIP 按钮特效 */ .vip-btn { width: 100%; position: relative; padding: 12px 24px; border: none; border-radius: 8px; background: linear-gradient(135deg, #ffd700 0%, #ffd900 30%, #ffae00 70%, #ff8c00 100%); color: #2c1a00; font-weight: 600; font-family: 'Segoe UI', sans-serif; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); overflow: hidden; box-shadow: 0 4px 15px rgba(255, 174, 0, 0.3); } /* 辉光动画效果 */ .glow-effect::after { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.4) 0%, transparent 70%); opacity: 0; transition: opacity 0.3s; } /* 悬停交互 */ .vip-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255, 174, 0, 0.5); } .vip-btn:hover::after { opacity: 1; } /* 点击反馈 */ .vip-btn:active { transform: translateY(1px); box-shadow: 0 2px 8px rgba(255, 174, 0, 0.3); } /* 皇冠图标动画 */ .crown-icon { width: 20px; height: 20px; margin-right: 8px; vertical-align: middle; transition: transform 0.3s; } .vip-btn:hover .crown-icon { transform: rotate(10deg) scale(1.1); } /* 文字渐变特效 */ .vip-text { background: linear-gradient(45deg, #2c1a00, #5a3a00); -webkit-background-clip: text; background-clip: text; color: transparent; display: inline-block; } * 弹窗容器 */ .vip-alert-popup { border: 2px solid #ffd700; border-radius: 12px; background: linear-gradient(145deg, #1a1a1a, #2d2d2d); } /* 标题区域 */ .alert-header { border-bottom: 1px solid #404040; padding-bottom: 12px; margin-bottom: 15px; } .swal-vip-icon { color: #ffd700; font-size: 2.2em; margin-right: 8px; } /* 需求列表 */ .requirements-box { background: rgba(255,215,0,0.1); border-radius: 8px; padding: 15px; margin: 15px 0; } .requirement-item { display: flex; align-items: center; margin: 10px 0; } .number-badge { background: #ffd700; color: #000; width: 24px; height: 24px; border-radius: 50%; text-align: center; margin-right: 12px; font-weight: bold; } /* 状态标签 */ .status-tag { padding: 4px 8px; border-radius: 4px; font-size: 0.9em; } .free-status { background: #ff4444; color: white; } /* 操作引导 */ .action-guide { background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; } .step-list li { margin: 8px 0; padding-left: 8px; } .pricing-link { color: #00ff9d !important; text-decoration: underline dotted; transition: all 0.3s; } .pricing-link:hover { color: #00cc7a !important; text-decoration: underline; } /* 确认按钮 */ .vip-confirm-btn { background: linear-gradient(135deg, #ffd700 0%, #ff9900 100%) !important; border: none !important; font-weight: bold !important; transition: transform 0.2s !important; } .vip-confirm-btn:hover { transform: scale(1.05); }
        `)
                GM_addStyle(` div.swal2-container { all: initial !important; /* 重置所有继承样式 */ position: fixed !important; z-index: 999999 !important; inset: 0 !important; display: flex !important; align-items: center !important; justify-content: center !important; background: rgba(0,0,0,0.4) !important; } .swal2-popup { all: initial !important; max-width: 600px !important; width: 90vw !important; min-width: 300px !important; position: relative !important; box-sizing: border-box !important; padding: 20px !important; background: white !important; border-radius: 8px !important; font-family: Arial !important; animation: none !important; } @keyframes swal2-show { 0% { transform: scale(0.9); opacity: 0 } 100% { transform: scale(1); opacity: 1 } } `);
            }

            initDOM() {
                this.container = document.createElement('div');
                this.container.className = 'auth-window';

                // 标题区域
                const title = document.createElement('h3');
                title.className = 'auth-title';
                title.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            <path d="M12 7v5l3 3"/>
        </svg>
        <span>脚本控制台<span class="auth-version">v${GM_info.script.version}</span></span>
    `;

                // 提示信息
                const tip = document.createElement('p');
                tip.className = 'auth-tip';
                tip.textContent = '您正在使用基础版本，功能可能存在限制';
                this.tip = tip
                // 输入框组
                // this.phoneInput = this.createInput(' 手机/QQ号', 'text', '#phone');
                this.authInput = this.createInput(' 授权密钥', 'password', '#auth');

                // 授权链接
                const link = [
                    "https://68n.cn/IJ8QB",
                    "https://68n.cn/RM9ob",
                ]
                const authLink1 = this.createLink('authLink1', link[0], '获取授权链接1');
                const authLink2 = this.createLink('authLink2', link[1], '获取授权链接2');


                // 验证按钮
                this.verifyBtn = document.createElement('button');
                this.verifyBtn.className = 'auth-button';
                this.verifyBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20 12l-8 8-4-4m0 0l4-4m-4 4L4 12l4-4"/>
        </svg>
        验证授权码 
    `;
                this.verifyBtn.onclick = () => this.handleVerify();

                // 启动控制面板
                this.controlPanel = document.createElement('div');
                this.controlPanel.className = 'control-panel';
                this.controlPanel.style.cssText = `
        margin-top: 20px;
        border-top: 1px solid #eee;
        padding-top: 16px;
    `;
                this.vipBtn = document.createElement('button');
                this.vipBtn.className = 'vip-btn glow-effect';
                this.vipBtn.innerHTML = `
            <span class="glow-container"></span>
            <svg class="crown-icon" viewBox="0 0 24 24">
                <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3H5v2h14v-2z"/>
            </svg>
            <span class="vip-text">高级功能-全自动挂机</span>
        `;
                this.vipBtn.addEventListener('click', () => {
                    this.handleVIPClick()
                })
                // 计时器
                this.timerDisplay = document.createElement('div');
                this.timerDisplay.className = 'timer';
                this.timerDisplay.textContent = '运行时间: 00:00:00';
                this.timerDisplay.style.cssText = `
        color: #2ecc71;
        font-size: 13px;
        margin-bottom: 12px;
    `;

                // 开始按钮
                this.startBtn = document.createElement('button');
                this.startBtn.className = 'auth-button';
                this.startBtn.style.backgroundColor = '#2ecc71';
                this.startBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
        开始运行-自动化挂机
    `;
                this.startBtn.onclick = () => this.startAutomation();

                // 错误提示
                this.errorBox = document.createElement('div');
                this.errorBox.className = 'error-message';


                // 组装结构
                this.controlPanel.append(
                    this.vipBtn,
                    this.timerDisplay,
                    this.startBtn
                );

                this.container.append(
                    title,
                    tip,
                    // this.phoneInput.container,
                    this.authInput.container,
                    authLink1,
                    authLink2,
                    this.verifyBtn,
                    this.controlPanel,
                    this.errorBox
                );

                document.body.appendChild(this.container);
                this.initControlBtn()
            }

            initControlBtn() {
                // 创建控制按钮
                this.toggleBtn = document.createElement('button');
                this.toggleBtn.className = 'window-toggle';
                this.toggleBtn.innerHTML = `
        <svg class="toggle-icon" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span class="toggle-text">展开面板</span>
    `;
                this.toggleBtn.style.cssText = `
        position: fixed;
        right: 30px;
        bottom: 30px;
        padding: 12px 20px;
        background: #fff;
        border: none;
        border-radius: 30px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
        z-index: 9999999;
    `;

                // 添加交互效果
                this.toggleBtn.addEventListener('mouseenter', () => {
                    this.toggleBtn.style.transform = 'translateY(-2px)';
                    this.toggleBtn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
                });

                this.toggleBtn.addEventListener('mouseleave', () => {
                    this.toggleBtn.style.transform = 'none';
                    this.toggleBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                });

                // 点击事件处理
                this.toggleBtn.onclick = () => {
                    const isVisible = this.container.style.display !== 'none';
                    this.container.style.display = isVisible ? 'none' : 'block';

                    // 更新按钮状态
                    this.toggleBtn.querySelector('.toggle-icon').style.transform =
                        isVisible ? 'rotate(180deg)' : 'none';
                    this.toggleBtn.querySelector('.toggle-text').textContent =
                        isVisible ? '展开面板' : '收起面板';

                    // 添加动画效果
                    if (!isVisible) {
                        this.container.animate([
                            {opacity: 0, transform: 'translateY(20px)'},
                            {opacity: 1, transform: 'none'}
                        ], {duration: 300, easing: 'ease-out'});
                    }
                };

                document.body.appendChild(this.toggleBtn);
            }

            startAutomation(callback) {
                if (!this.isRunning) {
                    this.startTime = Date.now();
                    this.isRunning = true;
                    this.startBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M6 12h12"/>
            </svg>
            运行中...
        `;
                    this.startBtn.style.backgroundColor = '#e67e22';
                    this.startBtn.disabled = true;

                    // 启动计时器
                    this.timer = setInterval(() => {
                        const elapsed = Date.now() - this.startTime;
                        const hours = Math.floor(elapsed / 3600000);
                        const minutes = Math.floor((elapsed % 3600000) / 60000);
                        const seconds = Math.floor((elapsed % 60000) / 1000);
                        this.timerDisplay.textContent =
                            `运行时间: ${hours.toString().padStart(2, '0')}:` +
                            `${minutes.toString().padStart(2, '0')}:` +
                            `${seconds.toString().padStart(2, '0')}`;
                    }, 1000);

                    // 触发自动化任务
                    if (typeof callback === 'function') {
                        callback()
                    }
                    if (this.begin && typeof this.begin === 'function') {
                        this.begin()
                    }
                }
            }

            createInput(labelText, type, id) {
                const container = document.createElement('div');
                container.className = 'input-group';

                const label = document.createElement('label');
                label.className = 'input-label';
                label.textContent = labelText;
                label.htmlFor = id;

                const input = document.createElement('input');
                input.className = 'input-field';
                input.type = type;
                input.id = id;
                input.maxLength = 16
                container.appendChild(label);
                container.appendChild(input);
                return {container, input};
            }

            createLink(id, link, name) {
                const authLink = document.createElement('a');
                authLink.id = id;
                authLink.className = 'auth-link';
                authLink.href = link;
                authLink.target = '_blank';
                authLink.textContent = name;
                authLink.style.cssText = `
        display: block; margin: 12px 0; color: #3498db; text-decoration: none; font-size: 13px; transition: opacity 0.2s; `;
                authLink.addEventListener('mouseenter', () => {
                    authLink.style.opacity = '0.8';
                    authLink.style.textDecoration = 'underline';
                });
                authLink.addEventListener('mouseleave', () => {
                    authLink.style.opacity = '1';
                    authLink.style.textDecoration = 'none';
                });
                return authLink
            }

            show() {
                setTimeout(() => {
                    this.container.classList.add('visible');
                }, 100);
            }

            showError(message) {
                this.errorBox.textContent = message;
                this.errorBox.style.display = 'block';
                setTimeout(() => {
                    this.errorBox.style.display = 'none';
                }, 5000);
            }

            async handleVerify() {
                const data = {
                    // phone: this.phoneInput.input.value,
                    key: this.authInput.input.value
                };
                console.log(data);
                if (!data.key || !(/^[A-Z0-9]{16}$/).test(data.key)) {
                    Swal.fire({
                        title: "授权码不正确，应为16位",
                        text: "请正确输入！",
                        icon: 'info',
                        confirmButtonText: '确定',
                    });
                    return
                }
                // 触发验证回调
                if (this.onVerify) {
                    if (await this.onVerify(data)) {
                        GM_setValue(this.storageKey, JSON.stringify(data))
                    } else {

                    }
                }
            }

            handleVIPClick() {
                if (this.vipCallback) {
                    this.vipCallback()
                } else {
                    Swal.fire({
                        title: "提示",
                        text: "请在视频播放页面使用！",
                        icon: 'info',
                        confirmButtonText: '确定',
                        willClose: () => {
                            console.log(' 用户确认错误，脚本已停止');
                        }
                    });
                }
            }

            loadPersistedData() {
                let saved = GM_getValue(this.storageKey);
                if (saved) {
                    saved = JSON.parse(saved)
                    // this.phoneInput.input.value = saved.phone || '';
                    this.authInput.input.value = saved.key || '';
                }
            }


            hide() {
                this.container.style.display = 'none';
            }

            // get phone() {
            //     return this.phoneInput.input.value;
            // }

            // set phone(value) {
            //     this.phoneInput.input.value = value;
            // }

            get key() {
                return this.authInput.input.value;
            }

            set key(value) {
                // this.authInput.input.value = value;
            }

            setTip(text) {
                this.tip.innerText = text
            }

            // 验证回调函数
            setOnVerifyCallback(callback) {
                this.onVerify = callback;
            }

            setOnBegin(callback) {
                this.begin = callback;
            }

            setOnVIP(callback) {
                this.vipCallback = callback;
            }
            setVIPBtnText(text) {
                this.vipBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20 12l-8 8-4-4m0 0l4-4m-4 4L4 12l4-4"/>
        </svg>
        ${text} 
    `;
            }
        }

        new Runner()
    }
}
// 重庆专业技术继续教育 公需科目培训
class Cqrl{
    constructor() {
    }
    run(config) {

        this.setupCoreFeatures(config);
    }
    setupCoreFeatures({refreshInterval}) {
        class Runner {
            constructor() {
                this.runner = null
                this.run()
            }
            run() {
                const url = location.href;
                if (url.includes("courseStudyItem")) {
                    this.runner = new Course("channel-ttcdw")
                }
            }
        }
        class Course {
            constructor(channel = "channel-my") {
                this.panel = new AuthWindow({
                    VIPBtnText:"高级功能-极速刷课"
                })
                this.channel = channel
                this.VIP = false
                this.running = false
                this.init()
            }

            init() {
                this.panel.setOnVerifyCallback(async (data) => {
                    this.url = await Utils.validateCode(data)
                    if (this.url) {
                        this.panel.setTip(Utils.vipText)
                        this.VIP = true
                        return true
                    }
                })

                this.panel.setOnBegin(() => {
                    if (!this.running) {
                        this.running = true
                        console.log("运行时：", this.VIP)
                        this.run().then(r => {
                            this.running = false
                        })
                    }
                })
                this.panel.setOnVIP(async () => {
                    if (!this.url) {
                        await this.panel.handleVerify()
                    }
                    await this.runVIP()
                })
                this.loadVIPStatus()
                try {
                    Swal.fire({
                        title: "提示",
                        text: "脚本3s后自动开始",
                        icon: 'info',
                        timer: 3000,
                        confirmButtonText: '确定',
                        willClose: () => {
                            this.panel.startAutomation()
                        }
                    });
                } catch (e) {
                    console.error(e)
                    this.panel.startAutomation()
                }
            }

            loadVIPStatus() {
                if (Utils.loadStatus()) {
                    this.panel.setTip(Utils.vipText)
                    this.VIP = true
                } else {
                    this.panel.setTip(Utils.baseText)
                    this.VIP = false
                }
                console.log("VIP:", this.VIP)
            }

            async runVIP() {
                try {
                    if (!this.VIP) {
                        Utils.showLinkSwal()
                        console.log("需要授权码！")
                        return
                    }
                    if(window.VIPRunning){
                        Swal.fire({
                            title: "课程正在刷取中，请等待！",
                            text: "等待或刷新页面重试！",
                            icon: 'info',
                            confirmButtonText: '确定',
                            willClose: () => {
                            }
                        });
                        return
                    }
                    Swal.fire({
                        title: "已开始刷课，请等待提示刷课完成！",
                        text: "每1s，刷取100s，请耐心等待！",
                        icon: 'success',
                        confirmButtonText: '确定',
                        willClose: () => {
                        }
                    });
                    let jsCode=GM_getValue(Utils.jsFlag)
                    if(!jsCode){
                        jsCode=await Utils.getJsCode(this.url)
                    }
                    eval(jsCode)
                    const courseId=location.href.split('courseId=')[1].split('&')[0]
                    console.log("courseId:",courseId)
                    await window.VIP(courseId,courseId)
                    Swal.fire({
                        title: "课程已刷完，请刷新页面查看最新结果！",
                        text: "请刷新页面查看最新结果！",
                        icon: 'success',
                        confirmButtonText: '确定',
                        willClose: () => {
                            setTimeout(()=>{
                                location.reload()
                            },2000)
                        }
                    });
                } catch (error) {
                    console.error(error)
                    Swal.fire({
                        title: "高级功能执行失败！",
                        text: "若一直失败，请联系进行售后处理！",
                        icon: 'error',
                        confirmButtonText: '确定',
                        allowOutsideClick: false,
                        willClose: () => {
                            console.log(' 用户确认错误，脚本已停止');
                        }
                    });
                }
            }

            async run() {
                try{
                    if(!this.VIP){
                        Swal.fire({
                            title: "提示",
                            text: "当前是基础版，脚本会自动化挂机完列表所有课程！",
                            icon: 'info',
                            timer: 5000,
                            confirmButtonText: '确定',
                            willClose: () => {
                                // this.panel.startAutomation()
                            }
                        });
                    }
                    const onlyTime = true
                    const catalogSelecter = '.first-line'
                    let mainWin=document.querySelector('#aliPlayerFrame')
                    mainWin=mainWin.contentWindow;
                    if(!mainWin){
                        throw Error("can't get mainWin!")
                    }
                    const catalog =await Utils.getStudyNode(mainWin,catalogSelecter,'nodeList')
                    for (let i = 0; i < catalog.length; i++) {
                        console.log(catalog[i].querySelector('.section-title').innerText)
                        const status=this.checkStatus(catalog[i])
                        if(status){
                            console.log("跳过当前视频")
                            continue
                        }
                        catalog[i].click()
                        const video=await Utils.getStudyNode(mainWin,'video',"node")
                        video.muted=true
                        video.volume = 0
                        await video.play()
                        await this.waitForVideoEnd(video)

                    }
                    this.finish()
                }catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "失败",
                        text: e+'',
                        icon: 'error',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                    })
                }

            }
            sendMsg  (msg) {
                // 创建 BroadcastChannel
                const channel = new BroadcastChannel(this.channel);
                channel.postMessage(msg);
            }
            finish() {
                if (Swal) {
                    this.sendMsg('finish')
                    Swal.fire({
                        title: "学习完成！",
                        text: `学习完成，脚本10s后自动关闭页面！`,
                        icon: 'success',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                        timer:10000,
                        willClose: () => {

                        }
                    })
                    setTimeout(()=>{
                        window.close()
                    },10000)
                }
            }

            async waitForVideoEnd(video) {
                return new Promise(resolve => {
                    const checkInterval = setInterval(async () => {
                        try {
                            if (video && video.paused) {
                                console.log("视频暂停了，重新开始播放...");
                                await video.play();
                            }
                            if (!video.src) {
                                console.error("视频源未设置，即将重新加载");
                                setTimeout(() => {
                                    location.reload()
                                }, 5000)
                            }

                        } catch (e) {
                            console.error("checkInterval error:", e);
                            clearInterval(checkInterval);
                            setTimeout(() => {
                                location.reload()
                            }, 2000);
                        }
                    }, 3000);
                    video.addEventListener('ended', () => {
                        clearInterval(checkInterval);
                        resolve()

                    }, {once: true}); // 监听视频结束事件
                });
            }
            checkStatus(dom){
                return dom.querySelector('.icon-icon_gouxuan')
            }
        }

        class Utils {
            constructor() {
            }

            static flag = 'VIP'
            static jsFlag = 'cqrl_JsCode'
            static vipText = '高级功能已启用！'
            static baseText = '您正在使用基础版本，功能可能存在限制'

            static loadStatus() {
                try {
                    let VIP = GM_getValue(this.flag)
                    return !!VIP
                } catch (e) {
                    console.error(e)
                }
                return false
            }

            static async validateCode(data) {
                try {
                    console.log(data);
                    let info = sessionStorage.getItem('creatorName')
                    if (!info) {
                        throw new Error("无效的账号信息！")
                    }
                    data.bindInfo = info
                    data.website = "67b8236e7ae708a346bf8410"
                    console.log(data)
                    // return
                    const res = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            'url': "https://fc-mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.next.bspapp.com/validCodeFuncCas?" + new URLSearchParams(data),
                            method: 'GET',
                            onload: function (res) {
                                if (res.status === 200) {
                                    const result = JSON.parse(res.response)
                                    console.log(result)
                                    resolve(result)
                                }
                                reject('请求失败：' + res.response)
                            },
                            onerror: function (err) {
                                console.error(err)
                                reject('请求错误！' + err.toString())
                            }
                        })
                    })
                    if (res.code !== 200) {
                        GM_deleteValue(this.flag)
                        throw new Error('验证失败：' + res.data)
                    }
                    Swal.fire({
                        title: "高级功能已启用！",
                        text: "校验成功！",
                        icon: 'success',
                        confirmButtonText: '确定',
                    });
                    GM_setValue(this.flag, true)
                    return res.data
                } catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "验证失败！",
                        text: e.toString(),
                        icon: 'error',
                        confirmButtonText: '确定',
                    });
                }
            }
            static async getJsCode(url) {
                try {
                    let code = GM_getValue(Utils.jsFlag)
                    // console.log(code)
                    if (!code) {
                        const jsUrl = url
                        //获取js文件，然后在这里执行，然后获得结果
                        const jsCode = await new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                'url': jsUrl,
                                method: 'GET',
                                onload: function (res) {
                                    console.log(res)
                                    if (res.status === 200) {
                                        const result = (res.responseText)
                                        // console.log(result)
                                        resolve(result)
                                    } else {
                                        reject('服务器拒绝：' + res.response)
                                    }
                                },
                                onerror: function (err) {
                                    console.error(err)
                                    reject('请求错误！' + err.toString())
                                }
                            })
                        })
                        code = jsCode
                            .replace(/\\/g, '\\\\')
                            .replace(/'/g, '\'')
                            .replace(/"/g, '\"')
                        GM_setValue(Utils.jsFlag, code)
                    }
                    return code
                } catch (error) {
                    console.error('远程加载失败:', error);
                    throw new Error("远程加载失败")
                }
            }


            static showLinkSwal() {
                const link = [
                    "https://68n.cn/IJ8QB",
                    "https://68n.cn/RM9ob",
                ]
                Swal.fire({
                    title: '<i class="fas fa-crown swal-vip-icon"></i> 高级功能解锁',
                    html: `
        <div class="vip-alert-content">
            <div class="alert-header">
                <h3>需要验证授权码才能使用</h3>
                <p class="version-tag">高级版</p>
            </div>
            
            <div class="requirements-box">
                <div class="requirement-item">
                    <span class="number-badge">1</span>
                    <p>需有效授权码激活高级功能模块</p>
                </div>
                <div class="requirement-item">
                    <span class="number-badge">2</span>
                    <p>当前账户权限：<span class="status-tag free-status">基础版</span></p>
                </div>
            </div>
 
            <div class="action-guide">
                <p>获取授权码步骤：</p>
                <ol class="step-list">
                    <li>点击前往以下链接，获取授权码</li>
                    <li><a href=${link[0]} class="pricing-link" target="_blank" ">获取授权码链接1</a></li>
                    <li><a href=${link[1]} class="pricing-link" target="_blank"">获取授权码链接2</a></li>
                </ol>
            </div>
        </div>
    `,
                    icon: 'info',
                    confirmButtonText: '前往激活',
                    showCloseButton: true,
                    timer: 30000,
                    customClass: {
                        popup: 'vip-alert-popup',
                        confirmButton: 'vip-confirm-btn'
                    },
                    willClose: () => {
                        // window.open(link[1])
                    }
                });
            }
            static async getStudyNode(dom,selector, type = 'node', timeout = 10000) {
                return new Promise((resolve, reject) => {
                    if (!['node', 'nodeList'].includes(type)) {
                        console.error('Invalid type parameter. Expected "node" or "nodeList"');
                        reject('Invalid type parameter. Expected "node" or "nodeList"');
                    }
                    const cleanup = (timeoutId, intervalId) => {
                        clearTimeout(timeoutId);
                        clearInterval(intervalId);
                    };
                    const handleSuccess = (result, timeoutId, intervalId) => {
                        console.log(`${selector} ready!`);
                        cleanup(timeoutId, intervalId);
                        resolve(result);
                    };
                    const handleFailure = (timeoutId, intervalId) => {
                        cleanup(timeoutId, intervalId);
                        resolve(null);
                    };
                    const checkNode = () => {
                        try {
                            let nodes;
                            if (type === 'node') {
                                nodes = dom.document.querySelector(selector);
                                return nodes?.readyState >= 3 ? nodes : null;
                            }
                            nodes = dom.document.querySelectorAll(selector);
                            return nodes.length > 0 ? nodes : null;
                        } catch (error) {
                            console.error('节点检查错误:', error);
                            reject('节点检查错误:', error)
                        }
                    };
                    const intervalId = setInterval(() => {
                        const result = checkNode();
                        if (result) {
                            handleSuccess(result, timeoutId, intervalId);
                        } else {
                            console.log(`等待节点: ${selector}...`);
                        }
                    }, 1000);
                    const timeoutId = setTimeout(() => {
                        console.error(`节点获取超时: ${selector}`);
                        handleFailure(timeoutId, intervalId);
                    }, timeout);
                });
            }
        }
        new Runner()
    }
}
// 赤峰市 专业技术人员继续教育 公需科目培训网
class Nmgdbrc{
    constructor() {
    }
    run(config) {

        this.setupCoreFeatures(config);
    }
    setupCoreFeatures({refreshInterval}) {
        class Runner {
            constructor() {
                this.runner = null
                this.run()
            }
            run() {
                const url = location.href;
                if (url.includes("video") || url.includes("plan")) {
                    this.runner = new Course("channel-nmgdbrc")
                }
            }
        }
        class Course {
            constructor(channel = "channel-my") {
                this.panel = new AuthWindow({
                    VIPBtnText:"高级功能-极速刷课"
                })
                this.channel = channel
                this.VIP = false
                this.running = false
                this.init()
            }

            init() {
                this.panel.setOnVerifyCallback(async (data) => {
                    this.url = await Utils.validateCode(data)
                    if (this.url) {
                        this.panel.setTip(Utils.vipText)
                        this.VIP = true
                        return true
                    }
                })

                this.panel.setOnBegin(() => {
                    if (!this.running) {
                        this.running = true
                        console.log("运行时：", this.VIP)
                        this.run().then(r => {
                            this.running = false
                        })
                    }
                })
                this.panel.setOnVIP(async () => {
                    if (!this.url) {
                        await this.panel.handleVerify()
                    }
                    await this.runVIP()
                })
                this.loadVIPStatus()
                try {
                    Swal.fire({
                        title: "提示",
                        text: "请在课程播放页面内，点击开始！",
                        icon: 'info',
                        timer: 5000,
                        confirmButtonText: '确定',
                        willClose: () => {
                            // this.panel.startAutomation()
                        }
                    });
                } catch (e) {
                    console.error(e)
                    // this.panel.startAutomation()
                }
            }

            loadVIPStatus() {
                if (Utils.loadStatus()) {
                    this.panel.setTip(Utils.vipText)
                    this.VIP = true
                } else {
                    this.panel.setTip(Utils.baseText)
                    this.VIP = false
                }
                console.log("VIP:", this.VIP)
            }

            async runVIP() {
                try {

                    if (!this.VIP) {
                        Utils.showLinkSwal()
                        console.log("需要授权码！")
                        return
                    }
                    if(!location.href.includes("video")){
                        Swal.fire({
                            title: "提示",
                            text: "请在视频播放页面使用！",
                            icon: 'error',
                            timer: 5000,
                            confirmButtonText: '确定',
                            willClose: () => {
                                // this.panel.startAutomation()
                            }
                        });
                    }
                    Swal.fire({
                        title: "已开始刷课，请等待提示刷课完成！",
                        text: "每1s，刷取60s，请耐心等待！",
                        icon: 'success',
                        confirmButtonText: '确定',
                        willClose: () => {
                        }
                    });
                    let jsCode=GM_getValue(Utils.jsFlag)
                    if(!jsCode){
                        jsCode=await Utils.getJsCode(this.url)
                    }
                    eval(jsCode)
                    await window.VIP()
                    /*Swal.fire({
                        title: "已开始刷课，请等待提示刷课完成！",
                        text: "每1s，刷取100s，请耐心等待！",
                        icon: 'success',
                        confirmButtonText: '确定',
                        willClose: () => {
                        }
                    });
                    eval(GM_getValue("jsCode") || await Utils.getJsCode(this.url))
                    const courseId=location.href.split('courseId=')[1].split('&')[0]
                    console.log("courseId:",courseId)
                    */
                    Swal.fire({
                        title: "课程已刷完，请刷新页面查看最新结果！",
                        text: "请刷新页面查看最新结果！",
                        icon: 'success',
                        confirmButtonText: '确定',
                        willClose: () => {
                            setTimeout(()=>{
                                location.reload()
                            },2000)
                        }
                    });
                } catch (error) {
                    console.error(error)
                    Swal.fire({
                        title: "高级功能执行失败！",
                        text: "若一直失败，请联系进行售后处理！",
                        icon: 'error',
                        confirmButtonText: '确定',
                        allowOutsideClick: false,
                        willClose: () => {
                            console.log(' 用户确认错误，脚本已停止');
                        }
                    });
                }
            }

            async run() {
                try{
                    if(!location.href.includes("video")){
                        Swal.fire({
                            title: "提示",
                            text: "请在视频播放页面使用！",
                            icon: 'error',
                            timer: 5000,
                            confirmButtonText: '确定',
                            willClose: () => {
                                // this.panel.startAutomation()
                            }
                        });
                    }
                    if(!this.VIP){
                        Swal.fire({
                            title: "提示",
                            text: "当前是基础版，脚本会自动化挂机完列表所有课程！",
                            icon: 'info',
                            timer: 5000,
                            confirmButtonText: '确定',
                            willClose: () => {
                                // this.panel.startAutomation()
                            }
                        });
                    }
                    const onlyTime = true
                    const catalogSelecter = '.el-timeline-item__content'

                    const catalog =await Utils.getStudyNode(catalogSelecter,'nodeList')
                    for (let i = 0; i < catalog.length; i++) {
                        console.log(catalog[i].querySelector('span').innerText)
                        // const status=this.checkStatus(catalog[i])
                        // if(status){
                        //     console.log("跳过当前视频")
                        //     continue
                        // }
                        catalog[i].querySelector('span').click()
                        const video=await Utils.getStudyNode('video',"node")
                        video.muted=true
                        video.volume = 0
                        video.playbackRate = 2
                        await video.play()
                        await this.waitForVideoEnd(video)

                    }
                    this.finish()
                }catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "失败",
                        text: e+''+"请刷新页面重试！",
                        icon: 'error',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                    })
                }

            }
            sendMsg  (msg) {
                // 创建 BroadcastChannel
                const channel = new BroadcastChannel(this.channel);
                channel.postMessage(msg);
            }
            finish() {
                if (Swal) {
                    this.sendMsg('finish')
                    Swal.fire({
                        title: "学习完成！",
                        text: `学习完成，脚本10s后自动关闭页面！`,
                        icon: 'success',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                        timer:10000,
                        willClose: () => {

                        }
                    })
                    setTimeout(()=>{
                        window.close()
                    },10000)
                }
            }

            async waitForVideoEnd(video) {
                return new Promise(resolve => {
                    const checkInterval = setInterval(async () => {
                        try {
                            if (video && video.paused) {
                                console.log("视频暂停了，重新开始播放...");
                                await video.play();
                            }
                            if (!video.src) {
                                console.error("视频源未设置，即将重新加载");
                                setTimeout(() => {
                                    location.reload()
                                }, 5000)
                            }

                        } catch (e) {
                            console.error("checkInterval error:", e);
                            clearInterval(checkInterval);
                            setTimeout(() => {
                                location.reload()
                            }, 2000);
                        }
                    }, 3000);
                    video.addEventListener('ended', () => {
                        clearInterval(checkInterval);
                        resolve()

                    }, {once: true}); // 监听视频结束事件
                });
            }
            checkStatus(dom){
                return dom.querySelector('.icon-icon_gouxuan')
            }
        }

        class Utils {
            constructor() {
            }

            static flag = 'VIP'
            static jsFlag = 'nmgdbrc_JsCode'
            static vipText = '高级功能已启用！'
            static baseText = '您正在使用基础版本，功能可能存在限制'

            static loadStatus() {
                try {
                    let VIP = GM_getValue(this.flag)
                    return !!VIP
                } catch (e) {
                    console.error(e)
                }
                return false
            }

            static async validateCode(data) {
                try {
                    console.log(data);
                    let info = JSON.parse(localStorage.getItem('userInfo'))
                    if (!info) {
                        throw new Error("无效的账号信息！")
                    }
                    data.bindInfo = info.realName+'_'+info.userId
                    data.website = "67b84c3ace5ec9e5aab52897"
                    console.log(data)
                    // return
                    const res = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            'url': "https://fc-mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.next.bspapp.com/validCodeFuncCas?" + new URLSearchParams(data),
                            method: 'GET',
                            onload: function (res) {
                                if (res.status === 200) {
                                    const result = JSON.parse(res.response)
                                    console.log(result)
                                    resolve(result)
                                }
                                reject('请求失败：' + res.response)
                            },
                            onerror: function (err) {
                                console.error(err)
                                reject('请求错误！' + err.toString())
                            }
                        })
                    })
                    if (res.code !== 200) {
                        GM_deleteValue(this.flag)
                        throw new Error('验证失败：' + res.data)
                    }
                    Swal.fire({
                        title: "高级功能已启用！",
                        text: "校验成功！",
                        icon: 'success',
                        confirmButtonText: '确定',
                    });
                    GM_setValue(this.flag, true)
                    return res.data
                } catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "验证失败！",
                        text: e.toString(),
                        icon: 'error',
                        confirmButtonText: '确定',
                    });
                }
            }
            static async getJsCode(url) {
                try {
                    let code = GM_getValue(Utils.jsFlag)
                    // console.log(code)
                    if (!code) {
                        const jsUrl = url
                        //获取js文件，然后在这里执行，然后获得结果
                        const jsCode = await new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                'url': jsUrl,
                                method: 'GET',
                                onload: function (res) {
                                    console.log(res)
                                    if (res.status === 200) {
                                        const result = (res.responseText)
                                        // console.log(result)
                                        resolve(result)
                                    } else {
                                        reject('服务器拒绝：' + res.response)
                                    }
                                },
                                onerror: function (err) {
                                    console.error(err)
                                    reject('请求错误！' + err.toString())
                                }
                            })
                        })
                        code = jsCode
                            .replace(/\\/g, '\\\\')
                            .replace(/'/g, '\'')
                            .replace(/"/g, '\"')
                        GM_setValue(Utils.jsFlag, code)
                    }
                    return code
                } catch (error) {
                    console.error('远程加载失败:', error);
                    throw new Error("远程加载失败")
                }
            }


            static showLinkSwal() {
                const link = [
                    "https://68n.cn/IJ8QB",
                    "https://68n.cn/RM9ob",
                ]
                Swal.fire({
                    title: '<i class="fas fa-crown swal-vip-icon"></i> 高级功能解锁',
                    html: `
        <div class="vip-alert-content">
            <div class="alert-header">
                <h3>需要验证授权码才能使用</h3>
                <p class="version-tag">高级版</p>
            </div>
            
            <div class="requirements-box">
                <div class="requirement-item">
                    <span class="number-badge">1</span>
                    <p>需有效授权码激活高级功能模块</p>
                </div>
                <div class="requirement-item">
                    <span class="number-badge">2</span>
                    <p>当前账户权限：<span class="status-tag free-status">基础版</span></p>
                </div>
            </div>
 
            <div class="action-guide">
                <p>获取授权码步骤：</p>
                <ol class="step-list">
                    <li>点击前往以下链接，获取授权码</li>
                    <li><a href=${link[0]} class="pricing-link" target="_blank" ">获取授权码链接1</a></li>
                    <li><a href=${link[1]} class="pricing-link" target="_blank"">获取授权码链接2</a></li>
                </ol>
            </div>
        </div>
    `,
                    icon: 'info',
                    confirmButtonText: '前往激活',
                    showCloseButton: true,
                    timer: 30000,
                    customClass: {
                        popup: 'vip-alert-popup',
                        confirmButton: 'vip-confirm-btn'
                    },
                    willClose: () => {
                        // window.open(link[1])
                    }
                });
            }
            static async getStudyNode(selector, type = 'node', timeout = 10000) {
                return new Promise((resolve, reject) => {
                    if (!['node', 'nodeList'].includes(type)) {
                        console.error('Invalid type parameter. Expected "node" or "nodeList"');
                        reject('Invalid type parameter. Expected "node" or "nodeList"');
                    }
                    const cleanup = (timeoutId, intervalId) => {
                        clearTimeout(timeoutId);
                        clearInterval(intervalId);
                    };
                    const handleSuccess = (result, timeoutId, intervalId) => {
                        console.log(`${selector} ready!`);
                        cleanup(timeoutId, intervalId);
                        resolve(result);
                    };
                    const handleFailure = (timeoutId, intervalId) => {
                        cleanup(timeoutId, intervalId);
                        resolve(null);
                    };
                    const checkNode = () => {
                        try {
                            let nodes;
                            if (type === 'node') {
                                nodes = document.querySelector(selector);
                                return nodes?.readyState >= 3 ? nodes : null;
                            }
                            nodes = document.querySelectorAll(selector);
                            return nodes.length > 0 ? nodes : null;
                        } catch (error) {
                            console.error('节点检查错误:', error);
                            reject('节点检查错误:', error)
                        }
                    };
                    const intervalId = setInterval(() => {
                        const result = checkNode();
                        if (result) {
                            handleSuccess(result, timeoutId, intervalId);
                        } else {
                            console.log(`等待节点: ${selector}...`);
                        }
                    }, 1000);
                    const timeoutId = setTimeout(() => {
                        console.error(`节点获取超时: ${selector}`);
                        handleFailure(timeoutId, intervalId);
                    }, timeout);
                });
            }
        }
        new Runner()
    }
}
// 人教版义教
class Pep{
    constructor() {
    }
    run(config) {

        this.setupCoreFeatures(config);
    }
    setupCoreFeatures({refreshInterval}) {
        class Runner {
            constructor() {
                this.runner = null
                this.run()
            }

            run() {
                const url = location.href;
                if (url.includes("px")) {
                    this.runner = new Index("channel-pep")
                    // this.runner.run()
                } else if (url.includes("vod")) {
                    this.runner = new Course("channel-pep")
                }
            }
        }

        class Index {
            constructor(channel = "channel-my", cross = false) {
                this.panel = new AuthWindow({
                    VIPBtnText: "高级功能-全自动挂机"
                })
                if (!cross) {
                    this.channel = new BroadcastChannel(channel)
                } else {

                }
                this.VIP = false
                this.running = false
                this.init()
            }

            init() {
                this.panel.setOnVerifyCallback(async (data) => {
                    this.url = await Utils.validateCode(data)
                    if (this.url) {
                        this.panel.setTip(Utils.vipText)
                        this.VIP = true
                        return true
                    }
                })

                this.panel.setOnBegin(() => {
                    if (!this.running) {
                        this.running = true
                        console.log("运行时：", this.VIP)
                        this.run().then(r => {
                            this.running = false
                        })
                    }
                })
                this.panel.setOnVIP(async () => {
                    if (!this.url) {
                        await this.panel.handleVerify()
                    }
                    await this.runVIP()
                })
                this.loadVIPStatus()
                try {
                    Swal.fire({
                        title: "提示",
                        text: "全自动挂机，请手动点击开始！",
                        icon: 'info',
                        timer: 0,
                        confirmButtonText: '确定',
                        willClose: () => {
                            Swal.fire({
                                title: "此平台免费，已自动开启高级功能！",
                                text: '高级功能已启用，自动连播课程！',
                                icon: 'success',
                                confirmButtonColor: "#FF4DAFFF",
                                confirmButtonText: "确定",
                            })
                        }
                    });
                } catch (e) {
                    console.error(e)
                    // this.panel.startAutomation()
                }
            }

            loadVIPStatus() {
                if (Utils.loadStatus()) {
                    this.panel.setTip(Utils.vipText)
                    this.VIP = true
                } else {
                    this.panel.setTip(Utils.baseText)
                    this.VIP = false
                }
                console.log("VIP:", this.VIP)
            }

            async runVIP() {
                try {
                    if (!this.VIP) {
                        Utils.showLinkSwal()
                        console.log("需要授权码！")
                        return
                    }
                    Swal.fire({
                        title: "高级功能已启用！",
                        text: `学习已完全自动化！`,
                        icon: 'success',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                    })
                } catch (error) {
                    console.error(error)
                    Swal.fire({
                        title: "高级功能执行失败！",
                        text: "若一直失败，请联系进行售后处理！",
                        icon: 'error',
                        confirmButtonText: '确定',
                        allowOutsideClick: false,
                        willClose: () => {
                            console.log(' 用户确认错误，脚本已停止');
                        }
                    });
                }
            }

            async run() {
                try {
                    const onlyTime = true
                    const catalogSelecter = 'tr'
                    const btn = 'a'
                    const catalogList = await Utils.getStudyNode(catalogSelecter, 'nodeList')
                    for (let j = 0; j < catalogList.length; j++) {
                        console.log(catalogList[j].querySelector('h6').innerText)
                        const status = this.checkStatus(catalogList[j])
                        if (status) {
                            console.log("完成，跳过！")
                            continue;
                        }
                        if (j % 2 === 1 && catalogList.length > 2) {
                            console.log("奇数项，跳过！")
                            continue;
                        }
                        // catalogList[j].querySelector(btn).click()
                        unsafeWindow.open(catalogList[j].querySelector(btn).getAttribute('href'))
                        const val = await this.waitForFinsh();
                        if (val !== 0) {
                            throw Error("错误的监听信息，请关闭其他插件")
                        }
                        // if (!this.VIP && j > 2) {
                        //     break
                        // }
                    }

                    this.finish()
                } catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "失败", text: e + '', icon: 'error', confirmButtonColor: "#FF4DAFFF", confirmButtonText: "确定",
                    })
                }

            }

            finish() {
                if (Swal) {
                    Swal.fire({
                        title: "刷课成功！",
                        text: `学习时间已达到最大值`,
                        icon: 'success',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // 尝试关闭当前页面
                            try {
                                // window.close(); // 关闭当前页面
                            } catch (error) {
                                console.error("无法直接关闭页面：", error);
                                // 如果无法直接关闭页面，提示用户手动关闭
                                Swal.fire({
                                    title: "无法自动关闭页面",
                                    text: "请手动关闭此页面。",
                                    icon: 'warning',
                                    confirmButtonColor: "#FF4DAFFF",
                                    confirmButtonText: "确定",
                                });
                            }
                        }
                    });
                }
            }

            checkStatus(dom) {
                return false
                const isFinish = dom.querySelector('.el-progress__text').innerText
                return isFinish === "100%"
            }

            async waitForFinsh() {
                return new Promise(async (resolve) => {
                    const task = setInterval(() => {
                        console.log("等待当前任务完成！")
                    }, 5000)
                    unsafeWindow.addEventListener('message', (event) => {
                        console.log('收到信号:', event.data);
                        if (
                            event.data?.type === 'TASK_COMPLETE'
                        ) {
                            resolve(0)
                        }
                    })

                });
            }
        }

        class Course {
            constructor(channel = "channel-my") {
                this.panel = new AuthWindow({
                    VIPBtnText: "高级功能-全自动挂机"
                })
                this.channel = new BroadcastChannel(channel)
                this.VIP = false
                this.running = false
                this.init()
                console.log("chanel:", channel)
            }

            init() {
                this.panel.setOnVerifyCallback(async (data) => {
                    this.url = await Utils.validateCode(data)
                    if (this.url) {
                        this.panel.setTip(Utils.vipText)
                        this.VIP = true
                        return true
                    }
                })

                this.panel.setOnBegin(() => {
                    if (!this.running) {
                        this.running = true
                        console.log("运行时：", this.VIP)
                        this.run().then(r => {
                            this.running = false
                        })
                    }
                })
                this.panel.setOnVIP(async () => {
                    if (!this.url) {
                        await this.panel.handleVerify()
                    }
                    await this.runVIP()
                })
                this.loadVIPStatus()
                try {
                    Swal.fire({
                        title: "提示",
                        text: "脚本3s后自动开始",
                        icon: 'info',
                        timer: 3000,
                        confirmButtonText: '确定',
                        willClose: () => {
                            this.panel.startAutomation()
                        }
                    });
                } catch (e) {
                    console.error(e)
                    this.panel.startAutomation()
                }
            }

            loadVIPStatus() {
                if (Utils.loadStatus()) {
                    this.panel.setTip(Utils.vipText)
                    this.VIP = true
                } else {
                    this.panel.setTip(Utils.baseText)
                    this.VIP = false
                }
                console.log("VIP:", this.VIP)
            }

            async runVIP() {
                try {
                    if (!this.VIP) {
                        Utils.showLinkSwal()
                        console.log("需要授权码！")
                        return
                    }
                    Swal.fire({
                        title: "高级功能已启用！",
                        text: "现在，脚本会自动挂机，刷完当前课程学时！",
                        icon: 'success',
                        confirmButtonText: '确定',
                        willClose: () => {

                        }
                    });
                } catch (error) {
                    console.error(error)
                    Swal.fire({
                        title: "高级功能执行失败！",
                        text: "若一直失败，请联系进行售后处理！",
                        icon: 'error',
                        confirmButtonText: '确定',
                        allowOutsideClick: false,
                        willClose: () => {
                            console.log(' 用户确认错误，脚本已停止');
                        }
                    });
                }
            }

            async run() {
                try {
                    const video = await Utils.getStudyNode('video', "node")
                    video.muted = true
                    video.volume = 0
                    video.currentTime = 0
                    // video.playbackRate = 16
                    video.playbackRate = 2
                    try {
                        document.querySelector('#videoStartBtn').click()
                    }catch (e) {}
                    await video.play()
                    await this.waitForVideoEnd(video)

                    this.finish()
                } catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "失败", text: e + '', icon: 'error', confirmButtonColor: "#FF4DAFFF", confirmButtonText: "确定",
                    })
                }

            }

            sendMsg(msg) {
                // 创建 BroadcastChannel
                // const aaa=new BroadcastChannel('channel-pep')
                // aaa.postMessage('finish')
                // this.channel.postMessage(msg);
                unsafeWindow.opener.postMessage(
                    {
                        type: 'TASK_COMPLETE',
                        payload: {result: msg}
                    },
                    'https://wp.pep.com.cn/'
                );
            }

            finish() {
                if (Swal) {
                    this.sendMsg('finish')
                    Swal.fire({
                        title: "学习完成！",
                        text: `学习完成，脚本10s后自动关闭页面！`,
                        icon: 'success',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                        timer: 10000,
                        willClose: () => {

                        }
                    })
                    setTimeout(() => {
                        window.close()
                    }, 10000)
                }
            }

            async waitForVideoEnd(video) {
                return new Promise(resolve => {
                    const checkInterval = setInterval(async () => {
                        try {
                            if (video && video.paused) {
                                console.log("视频暂停了，重新开始播放...");
                                await video.play();
                            }
                            if (!video.src) {
                                console.error("视频源未设置，即将重新加载");
                                setTimeout(() => {
                                    location.reload()
                                }, 5000)
                            }

                        } catch (e) {
                            console.error("checkInterval error:", e);
                            clearInterval(checkInterval);
                            setTimeout(() => {
                                location.reload()
                            }, 2000);
                        }
                    }, 3000);
                    video.addEventListener('ended', () => {
                        clearInterval(checkInterval);
                        resolve()

                    }, {once: true}); // 监听视频结束事件
                });
            }

            checkStatus(dom) {
                const string = dom.querySelector('.four').innerText
                return string === "100%"
            }
        }

        class Utils {
            constructor() {
            }

            static flag = 'VIP'
            static vipText = '高级功能已启用！'
            static baseText = '您正在使用基础版本，功能可能存在限制'

            static loadStatus() {
                // try {
                //     let VIP = GM_getValue(this.flag)
                //     return !!VIP
                // } catch (e) {
                //     console.error(e)
                // }
                return true
            }

            static async validateCode(data) {
                try {
                    console.log(data);
                    let info = document.cookie.match(/(^ |;\s*)u-mobile=([^;]*)/)?.[2] && decodeURIComponent(document.cookie.match(/(^ |;\s*)u-mobile=([^;]*)/)[2]);
                    if (!info) {
                        throw new Error("无效的账号信息！")
                    }
                    data.bindInfo = info
                    data.website = "67b55c658b0da45f013f4cc4"
                    console.log(data)
                    // return
                    const res = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            'url': "https://fc-mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.next.bspapp.com/validCodeFuncCas?" + new URLSearchParams(data),
                            method: 'GET',
                            onload: function (res) {
                                if (res.status === 200) {
                                    const result = JSON.parse(res.response)
                                    console.log(result)
                                    resolve(result)
                                }
                                reject('请求失败：' + res.response)
                            },
                            onerror: function (err) {
                                console.error(err)
                                reject('请求错误！' + err.toString())
                            }
                        })
                    })
                    if (res.code !== 200) {
                        GM_deleteValue(this.flag)
                        throw new Error('验证失败：' + res.data)
                    }
                    Swal.fire({
                        title: "高级功能已启用！", text: "校验成功！", icon: 'success', confirmButtonText: '确定',
                    });
                    GM_setValue(this.flag, true)
                    return res.data
                } catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "验证失败！", text: e.toString(), icon: 'error', confirmButtonText: '确定',
                    });
                }
            }


            static showLinkSwal() {
                const link = ["https://68n.cn/IJ8QB", "https://68n.cn/RM9ob",]
                Swal.fire({
                    title: '<i class="fas fa-crown swal-vip-icon"></i> 高级功能解锁', html: `
        <div class="vip-alert-content">
            <div class="alert-header">
                <h3>需要验证授权码才能使用</h3>
                <p class="version-tag">高级版</p>
            </div>
            
            <div class="requirements-box">
                <div class="requirement-item">
                    <span class="number-badge">1</span>
                    <p>需有效授权码激活高级功能模块</p>
                </div>
                <div class="requirement-item">
                    <span class="number-badge">2</span>
                    <p>当前账户权限：<span class="status-tag free-status">基础版</span></p>
                </div>
            </div>
 
            <div class="action-guide">
                <p>获取授权码步骤：</p>
                <ol class="step-list">
                    <li>点击前往以下链接，获取授权码</li>
                    <li><a href=${link[0]} class="pricing-link" target="_blank" ">获取授权码链接1</a></li>
                    <li><a href=${link[1]} class="pricing-link" target="_blank"">获取授权码链接2</a></li>
                </ol>
            </div>
        </div>
    `, icon: 'info', confirmButtonText: '前往激活', showCloseButton: true, timer: 30000, customClass: {
                        popup: 'vip-alert-popup', confirmButton: 'vip-confirm-btn'
                    }, willClose: () => {
                        // window.open(link[1])
                    }
                });
            }

            static async getStudyNode(selector, type = 'node', timeout = 10000) {
                return new Promise((resolve, reject) => {
                    if (!['node', 'nodeList'].includes(type)) {
                        console.error('Invalid type parameter. Expected "node" or "nodeList"');
                        reject('Invalid type parameter. Expected "node" or "nodeList"');
                    }
                    const cleanup = (timeoutId, intervalId) => {
                        clearTimeout(timeoutId);
                        clearInterval(intervalId);
                    };
                    const handleSuccess = (result, timeoutId, intervalId) => {
                        console.log(`${selector} ready!`);
                        cleanup(timeoutId, intervalId);
                        resolve(result);
                    };
                    const handleFailure = (timeoutId, intervalId) => {
                        cleanup(timeoutId, intervalId);
                        resolve(null);
                    };
                    const checkNode = () => {
                        try {
                            let nodes;
                            if (type === 'node') {
                                nodes = document.querySelector(selector);
                                return nodes?.readyState >= 3 ? nodes : null;
                            }
                            nodes = document.querySelectorAll(selector);
                            return nodes.length > 0 ? nodes : null;
                        } catch (error) {
                            console.error('节点检查错误:', error);
                            reject('节点检查错误:', error)
                        }
                    };
                    const intervalId = setInterval(() => {
                        const result = checkNode();
                        if (result) {
                            handleSuccess(result, timeoutId, intervalId);
                        } else {
                            console.log(`等待节点: ${selector}...`);
                        }
                    }, 1000);
                    const timeoutId = setTimeout(() => {
                        console.error(`节点获取超时: ${selector}`);
                        handleFailure(timeoutId, intervalId);
                    }, timeout);
                });
            }
        }
        new Runner()
    }

}
// 广东双融双创
class Gdedu{
    constructor() {
    }
    run(config) {

        this.setupCoreFeatures(config);
    }
    setupCoreFeatures({refreshInterval}) {
        class Runner {
            constructor() {
                this.runner = null
                this.init()
                this.run()
            }
            init(){
            }

            run() {
                const url = location.href;
                if (url.includes("study")) {
                    this.runner = new Course("channel-gdedu")
                }
            }
        }
        class Course {
            constructor(channel = "channel-my") {
                this.panel = new AuthWindow({
                    VIPBtnText: "高级功能-极速秒刷"
                })
                this.channel = channel
                this.VIP = false
                this.running = false
                this.init()
                this.initCross()
                this.initGetLocal()
            }

            init() {
                this.panel.setOnVerifyCallback(async (data) => {
                    this.url = await Utils.validateCode(data)
                    if (this.url) {
                        this.panel.setTip(Utils.vipText)
                        this.VIP = true
                        return true
                    }
                })

                this.panel.setOnBegin(() => {
                    if (!this.running) {
                        this.running = true
                        console.log("运行时：", this.VIP)
                        this.run().then(r => {
                            this.running = false
                        })
                    }
                })
                this.panel.setOnVIP(async () => {
                    if (!this.url) {
                        await this.panel.handleVerify()
                    }
                    await this.runVIP()
                })
                this.loadVIPStatus()
                try {
                    Swal.fire({
                        title: "提示",
                        text: "此平台只有高级功能有效",
                        icon: 'info',
                        timer: 5000,
                        confirmButtonText: '确定',
                        willClose: () => {
                            // this.panel.startAutomation()
                        }
                    });
                } catch (e) {
                    console.error(e)
                    // this.panel.startAutomation()
                }
            }

            loadVIPStatus() {
                if (Utils.loadStatus()) {
                    this.panel.setTip(Utils.vipText)
                    this.VIP = true
                } else {
                    this.panel.setTip(Utils.baseText)
                    this.VIP = false
                }
                console.log("VIP:", this.VIP)
            }

            async runVIP() {
                try {
                    if (!this.VIP) {
                        Utils.showLinkSwal()
                        console.log("需要授权码！")
                        return
                    }
                    if (window.VIPRunning) {
                        Swal.fire({
                            title: "课程正在刷取中，请等待！",
                            text: "等待或刷新页面重试！",
                            icon: 'info',
                            confirmButtonText: '确定',
                            willClose: () => {
                            }
                        });
                        return
                    }
                    Swal.fire({
                        title: "课程正在刷取中...",
                        text: "每1s，约刷取60s，请耐心等待！请勿播放视频！！请合理使用，认真学习课程！",
                        icon: 'info',
                        confirmButtonText: '确定',
                        willClose: () => {
                        }
                    });
                    window.VIPRunning=true
                    const update=async (data) => {
                        const bearer = document.cookie.split('Admin-Token=')[1].split(";")[0]
                        let res = await fetch("https://srsc.gdedu.gov.cn/api-srsc/api-course/learn/coursechapterrate/saveRate", {
                            "headers": {
                                "accept": "application/json, text/plain, */*",
                                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                                "authorization": "Bearer " + bearer,
                                "cache-control": "no-cache",
                                "content-type": "application/json",
                                "lang": "zh_CN",
                                "pragma": "no-cache",
                                "sec-ch-ua": "Not(A:Brand;v=99, Microsoft Edge;v=133, Chromium;v=133",
                                "sec-ch-ua-mobile": "?0",
                                "sec-ch-ua-platform": "Windows",
                                "sec-fetch-dest": "empty",
                                "sec-fetch-mode": "cors",
                                "sec-fetch-site": "same-origin",
                                "z-l-t-version": "6369"
                            },
                            "referrer": location.href,
                            "referrerPolicy": "strict-origin-when-cross-origin",
                            "body": JSON.stringify(data),
                            "method": "POST",
                            "mode": "cors",
                            "credentials": "include"
                        });
                        if(res.ok){
                            res=await res.json()
                            console.log(res)
                            return res
                        }
                    }
                    const video=document.querySelector('video')
                    video.pause()
                    let current=parseInt(video.currentTime)
                    current=parseInt(Math.floor(current / 60)) * 60
                    const max=video.duration
                    // video.currentTime = video.duration
                    // const event = new Event('ended', {
                    //     bubbles: true,
                    //     cancelable: true
                    // });
                    // video.dispatchEvent(event);
                    const params=Object.fromEntries(new URL(location.href).searchParams.entries());
                    let data={
                        chapterId:params.chapterId,
                        chapterModuleId:params.chapterModuleId,
                        chapterStageId:params.chapterStageId,
                        isFinish:0,
                        rate: 0,
                    }
                    while (current<max){
                        try {
                            video.pause()
                        }catch(e){}
                        current+=30
                        if(current>=max){
                            data.isFinish=1
                            current=max
                        }
                        data.rate=current
                        const res=await update(data)
                        if(res.code!==0){
                            console.error(res)
                            break
                        }
                        await sleep(500)
                    }
                    Swal.fire({
                        title: "已成功！",
                        text: "已刷完当前视频！每次刷完后，请刷新页面！请合理使用！",
                        icon: 'success',
                        confirmButtonText: '确定',
                        willClose: () => {
                        }
                    });
                } catch (error) {
                    console.error(error)
                    Swal.fire({
                        title: "高级功能执行失败！",
                        text: "若一直失败，请联系进行售后处理！",
                        icon: 'error',
                        confirmButtonText: '确定',
                        allowOutsideClick: false,
                        willClose: () => {
                            console.log(' 用户确认错误，脚本已停止');
                        }
                    });
                }finally {
                    window.VIPRunning=false
                }
            }

            async run() {
                Swal.fire({
                    title: "提示",
                    text: "此平台暂无自动化功能，请使用高级功能！",
                    icon: 'info',
                    timer: 3000,
                    confirmButtonText: '确定',
                    willClose: () => {

                    }
                });
            }

        }

        class Utils {
            constructor() {
            }

            static flag = 'gdeduVIP'
            static jsFlag = 'gdedu_JsCode'
            static vipText = '高级功能已启用！'
            static baseText = '您正在使用基础版本，功能可能存在限制'

            static loadStatus() {
                try {
                    let VIP = GM_getValue(this.flag)
                    return !!VIP
                } catch (e) {
                    console.error(e)
                }
                return false
            }

            static async validateCode(data) {
                try {
                    let info = JSON.parse(decodeURIComponent(document.cookie.split('UserInfoKey=')[1].split(';')[0]))
                    if(!info){
                        throw new Error("无效的账号信息！")
                    }
                    data.bindInfo = info.nickname+'_'+info.company
                    data.website = "67bc79b4eef9cbda9c16384c"
                    console.log(data)
                    // return
                    const res = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            'url': "https://fc-mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.next.bspapp.com/validCodeFuncCas?" + new URLSearchParams(data),
                            method: 'GET',
                            onload: function (res) {
                                if (res.status === 200) {
                                    const result = JSON.parse(res.response)
                                    console.log(result)
                                    resolve(result)
                                }
                                reject('请求失败：' + res.response)
                            },
                            onerror: function (err) {
                                console.error(err)
                                reject('请求错误！' + err.toString())
                            }
                        })
                    })
                    if (res.code !== 200) {
                        GM_deleteValue(Utils.flag)
                        throw new Error('验证失败：' + res.data)
                    }
                    Swal.fire({
                        title: "高级功能已启用！",
                        text: "校验成功！",
                        icon: 'success',
                        confirmButtonText: '确定',
                    });
                    GM_setValue(Utils.flag, true)
                    return res.data
                } catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "验证失败！",
                        text: e.toString(),
                        icon: 'error',
                        confirmButtonText: '确定',
                    });
                }
            }

            static showLinkSwal() {
                const link = [
                    "https://68n.cn/IJ8QB",
                    "https://68n.cn/RM9ob",
                ]
                Swal.fire({
                    title: '<i class="fas fa-crown swal-vip-icon"></i> 高级功能解锁',
                    html: `
        <div class="vip-alert-content">
            <div class="alert-header">
                <h3>需要验证授权码才能使用</h3>
                <p class="version-tag">高级版</p>
            </div>
            
            <div class="requirements-box">
                <div class="requirement-item">
                    <span class="number-badge">1</span>
                    <p>需有效授权码激活高级功能模块</p>
                </div>
                <div class="requirement-item">
                    <span class="number-badge">2</span>
                    <p>当前账户权限：<span class="status-tag free-status">基础版</span></p>
                </div>
            </div>
 
            <div class="action-guide">
                <p>获取授权码步骤：</p>
                <ol class="step-list">
                    <li>点击前往以下链接，获取授权码</li>
                    <li><a href=${link[0]} class="pricing-link" target="_blank" ">获取授权码链接1</a></li>
                    <li><a href=${link[1]} class="pricing-link" target="_blank"">获取授权码链接2</a></li>
                </ol>
            </div>
        </div>
    `,
                    icon: 'info',
                    confirmButtonText: '前往激活',
                    showCloseButton: true,
                    timer: 30000,
                    customClass: {
                        popup: 'vip-alert-popup',
                        confirmButton: 'vip-confirm-btn'
                    },
                    willClose: () => {
                        // window.open(link[1])
                    }
                });
            }

        }
        new Runner()
    }
}
// 中国人事网  宁夏、赤峰、包头专技
class Chinahrt{
    constructor() {
    }
    run(config) {

        this.setupCoreFeatures(config);
    }
    setupCoreFeatures({refreshInterval}) {
        class Runner {
            constructor() {
                this.runner = null
                this.init()
                this.run()
            }
            init(){
                unsafeWindow.addEventListener('message', (event) => {
                    // if (event.origin !== 'https://videoadmin.chinahrt.com') return;
                    if (event.data?.type === 'GET_LOCALSTORAGE') {
                        const bindInfo = sessionStorage.getItem('realName')+"_"+sessionStorage.getItem('mobile')
                        event.source.postMessage(
                            {
                                type: 'LOCALSTORAGE_DATA',
                                value:bindInfo
                            },
                            event.origin // 指定目标域为 iframe 的源
                        );
                    }
                });
                console.log("跨域通道已开启...")
            }

            run() {
                const url = location.href;
                if (url.includes("v_courseDetails")) {
                    this.runner = new Index("channel-hrt")
                    // this.runner.run()
                } else if (url.includes("videoadmin")) {
                    this.runner = new Course("channel-hrt")
                }else if (url.includes("v_video")) {
                    this.init()
                }
            }
        }

        class Index {
            constructor(channel = "channel-my") {
                this.panel = new AuthWindow({
                    VIPBtnText: "高级功能-极速秒刷"
                })
                this.channel = new BroadcastChannel(channel)
                this.VIP = false
                this.running = false
                this.init()
            }

            init() {
                this.panel.setOnVerifyCallback(async (data) => {
                    this.url = await Utils.validateCode(data)
                    if (this.url) {
                        this.panel.setTip(Utils.vipText)
                        this.VIP = true
                        return true
                    }
                })

                this.panel.setOnBegin(() => {
                    if (!this.running) {
                        this.running = true
                        console.log("运行时：", this.VIP)
                        this.run().then(r => {
                            this.running = false
                        })
                    }
                })
                this.panel.setOnVIP(async () => {
                    // if (!this.url) {
                    //     await this.panel.handleVerify()
                    // }
                    await this.runVIP()
                })
                this.loadVIPStatus()
                try {
                    Swal.fire({
                        title: "提示",
                        text: "全自动挂机，请手动点击开始！",
                        icon: 'info',
                        timer: 0,
                        confirmButtonText: '确定',
                        willClose: () => {
                            if (!this.VIP) {
                                Swal.fire({
                                    title: "当前是基础版",
                                    text: '课程只会自动连播！升级高级版，能秒刷课程！',
                                    icon: 'info',
                                    timer: 5000,
                                    confirmButtonColor: "#FF4DAFFF",
                                    confirmButtonText: "确定",
                                })
                            }
                        }
                    });
                } catch (e) {
                    console.error(e)
                    // this.panel.startAutomation()
                }
            }

            loadVIPStatus() {
                if (Utils.loadStatus()) {
                    this.panel.setTip(Utils.vipText)
                    this.VIP = true
                } else {
                    this.panel.setTip(Utils.baseText)
                    this.VIP = false
                }
                console.log("VIP:", this.VIP)
            }

            async runVIP() {
                try {
                    if (!this.VIP) {
                        Utils.showLinkSwal()
                        console.log("需要授权码！")
                        return
                    }
                    Swal.fire({
                        title: "请在课程播放页面使用！",
                        text: `请在课程播放页面使用！`,
                        icon: 'info',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                    })
                } catch (error) {
                    console.error(error)
                    Swal.fire({
                        title: "高级功能执行失败！",
                        text: "若一直失败，请联系进行售后处理！",
                        icon: 'error',
                        confirmButtonText: '确定',
                        allowOutsideClick: false,
                        willClose: () => {
                            console.log(' 用户确认错误，脚本已停止');
                        }
                    });
                }
            }

            async run() {
                try {
                    const onlyTime = true
                    const catalogSelecter = '.course-h li'
                    const btn = '.button'
                    const catalogList = await Utils.getStudyNode(catalogSelecter, 'nodeList')
                    for (let j = 0; j < catalogList.length; j++) {
                        console.log(catalogList[j].querySelector('.text').innerText)
                        const status = this.checkStatus(catalogList[j])
                        if (status) {
                            console.log("完成，跳过！")
                            continue;
                        }
                        catalogList[j].querySelector(btn).click()
                        const val = await this.waitForFinsh();
                        if (val !== 0) {
                            throw Error("错误的监听信息，请关闭其他插件")
                        }
                        if (!this.VIP && j > 2) {
                            break
                        }
                    }
                    if (!this.VIP) {
                        Swal.fire({
                            title: "未开启高级功能",
                            text: '自动连播课程，需要开启高级功能',
                            icon: 'error',
                            confirmButtonColor: "#FF4DAFFF",
                            confirmButtonText: "确定",
                        })

                    }

                    this.finish()
                } catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "失败",
                        text: e + '',
                        icon: 'error',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                    })
                }

            }

            finish() {
                if (Swal) {
                    Swal.fire({
                        title: "刷课成功！",
                        text: `学习时间已达到最大值`,
                        icon: 'success',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // 尝试关闭当前页面
                            try {
                                // window.close(); // 关闭当前页面
                            } catch (error) {
                                console.error("无法直接关闭页面：", error);
                                // 如果无法直接关闭页面，提示用户手动关闭
                                Swal.fire({
                                    title: "无法自动关闭页面",
                                    text: "请手动关闭此页面。",
                                    icon: 'warning',
                                    confirmButtonColor: "#FF4DAFFF",
                                    confirmButtonText: "确定",
                                });
                            }
                        }
                    });
                }
            }

            checkStatus(dom) {
                return false
                const isFinish = dom.querySelector('.button').innerText
                return isFinish.includes('已学完')
            }

            async waitForFinsh() {
                return new Promise(async (resolve) => {
                    const task = setInterval(() => {
                        console.log("等待当前任务完成！")
                    }, 5000)
                    this.channel.onmessage = (event) => {
                        clearInterval(task)
                        resolve(event.data === 'finish' ? 0 : 1);
                    };

                });
            }
        }

        class Course {
            constructor(channel = "channel-my") {
                this.panel = new AuthWindow({
                    VIPBtnText: "高级功能-极速刷课"
                })
                this.channel = channel
                this.VIP = false
                this.running = false
                this.init()
                this.initCross()
                this.initGetLocal()
            }

            init() {
                this.panel.setOnVerifyCallback(async (data) => {
                    this.url = await Utils.validateCode(data)
                    if (this.url) {
                        this.panel.setTip(Utils.vipText)
                        this.VIP = true
                        return true
                    }
                })

                this.panel.setOnBegin(() => {
                    if (!this.running) {
                        this.running = true
                        console.log("运行时：", this.VIP)
                        this.run().then(r => {
                            this.running = false
                        })
                    }
                })
                this.panel.setOnVIP(async () => {
                    if (!this.url) {
                        await this.panel.handleVerify()
                    }
                    await this.runVIP()
                })
                this.loadVIPStatus()
                try {
                    Swal.fire({
                        title: "提示",
                        text: "脚本3s后自动开始",
                        icon: 'info',
                        timer: 3000,
                        confirmButtonText: '确定',
                        willClose: () => {
                            this.panel.startAutomation()
                        }
                    });
                } catch (e) {
                    console.error(e)
                    this.panel.startAutomation()
                }
            }

            initGetLocal() {
                unsafeWindow.addEventListener('message', (event) => {
                    if (event.origin !== 'https://gp.chinahrt.com') return;
                    if (event.data?.type === 'LOCALSTORAGE_DATA') {
                        console.log('Received:', event.data.value);
                        window.bindInfo=event.data.value
                    }
                });
                unsafeWindow.parent.postMessage(
                    {
                        type: 'GET_LOCALSTORAGE',
                        key: 'bindInfo'
                    },
                    'https://gp.chinahrt.com'
                );
            }

            initCross() {
                try {
                    const iframeWindow = unsafeWindow

                    const oldConstructor = Function.prototype.constructor;
                    Function.prototype.constructor = function (...args) {
                        if (args[0] === 'debugger') {
                            // 直接返回空函数阻止debugger执行
                            return function () {};
                        }
                        return oldConstructor.apply(this, args);
                    };
                    iframeWindow.check = function () {
                    };

                    console.log('反调试绕过成功！');
                    // Swal.fire({
                    //     title: "反调试绕过成功！",
                    //     text: iframeWindow.check.toString(),
                    //     icon: 'success',
                    //     confirmButtonColor: "#FF4DAFFF",
                    //     confirmButtonText: "关闭"
                    // }).then(() => {
                    //
                    // });
                } catch (err) {
                    console.error('绕过失败：', err);
                }
            }

            loadVIPStatus() {
                if (Utils.loadStatus()) {
                    this.panel.setTip(Utils.vipText)
                    this.VIP = true
                } else {
                    this.panel.setTip(Utils.baseText)
                    this.VIP = false
                }
                console.log("VIP:", this.VIP)
            }

            async runVIP() {
                try {
                    Swal.fire({
                        title: '<span style="color: #2c3e50">✨ 软件升级公告</span>',
                        html: `
        <div style="text-align: left; margin: 15px 0">
            <p style="font-size: 16px; color: #7f8c8d">当前脚本已失效，为提供更好的服务体验，前往官网查看最新软件：</p>
            <div style="background: #f8f9fa; padding: 12px; border-radius: 8px; margin: 15px 0">
                <div style="display: flex; align-items: center; gap: 10px">
                    <svg style="flex-shrink: 0" width="24" height="24" viewBox="0 0 24 24" fill="#3498db">
                        <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/>
                    </svg>
                    <div>
                        <a href="https://zzzzzzys.lovestoblog.com/website_docs/?webId=67f484484b92471a9f551f81" 
                               style="color: #3498db; text-decoration: none; font-weight:500"
                               target="_blank">
                               点击前往官网，查看介绍
                           </a>
                        <div style="font-size:12px; color: #95a5a6">备用链接：
                            <a href="https://www.alipan.com/s/wViqbLvgSF8" 
                           target="_blank" 
                           >
                            直接下载软件
                        </a>
                        </div>
                        
                    </div>
                    <div style="margin-top: 20px">
                <p style="font-size: 16px; color: #7f8c8d; margin-bottom: 10px">常用网址导航(总有一个能用)：</p>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px">
                    ${web_list.map(item => `
                        <a href="${item.url}" 
                           target="_blank"
                           style="
                                display: block;
                                padding: 10px;
                                background: #f1f8ff;
                                border-radius: 6px;
                                text-decoration: none;
                                color: #3498db;
                                font-size: 14px;
                                transition: all 0.3s;
                                border: 1px solid #dbeafe;
                                text-align: center;
                           "
                           onmouseover="this.style.background='#e3f2fd'; this.style.transform='translateY(-2px)'"
                           onmouseout="this.style.background='#f1f8ff'; this.style.transform='none'">
                            <div style="display: flex; align-items: center; justify-content: center; gap: 5px">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="#3498db">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                                </svg>
                                ${item.name}
                            </div>
                        </a>
                    `).join('')}
                </div>
            </div>
                </div>
            </div>
        </div>
    `,
                        iconHtml: '<i class="fas fa-download fa-2x" style="color: #3498db"></i>',
                        showCancelButton: false,
                        confirmButtonText: '<i class="fas fa-external-link-alt"></i> 立即跳转',
                        confirmButtonColor: '#3498db',
                        width: '600px',
                        padding: '2em',
                        background: 'rgba(255,255,255,0.95)',
                        backdrop: 'rgba(0,0,0,0.15)',
                        customClass: {
                            popup: 'shadow-lg',
                            title: 'custom-title'
                        },
                        willOpen: () => {
                            // 动态添加 Font Awesome
                            const style = document.createElement('link');
                            style.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";
                            style.rel = "stylesheet";
                            document.head.appendChild(style);
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.open(web_url, '_blank');
                        }
                    });
                    return
                    if (!this.VIP) {
                        Utils.showLinkSwal()
                        console.log("需要授权码！")
                        return
                    }
                    if (window.VIPRunning) {
                        Swal.fire({
                            title: "课程正在刷取中，请等待！",
                            text: "等待或刷新页面重试！",
                            icon: 'info',
                            confirmButtonText: '确定',
                            willClose: () => {
                            }
                        });
                        return
                    }
                    const confirmResult = await Swal.fire({
                        title: "提示，请认真阅读",
                        html: `<div style="text-align:left">
                    <b>注意事项：</b>
                    <li>有概率触发反作弊机制导致失败：</li>
                    <li>建议先播放视频，等其自动跳转过已播放的时间后，暂停视频，开始刷取</li>
                    <li>多次刷取时，视频最后几分钟可能导致刷取失败！此时，需要休息一段时间，再次刷取！</li>
                    <li>若不休息片刻，会导致后续视频只能播放前30秒，继续播放可能需要刷新页面恢复</li>
                    <li></li>
                    <li>单次仅刷取10分钟</li>
                    <li>每次刷完后，不论成功失败，请刷新页面</li>
                   </div>`,
                        icon: 'warning',
                        showCancelButton: true,
                        cancelButtonText: '取消',
                        confirmButtonText: '继续',
                        allowOutsideClick: false,
                        focusCancel: true,
                        customClass: {
                            popup: 'risk-warning-popup',
                            htmlContainer: 'text-left'
                        }
                    });

                    if (!confirmResult.isConfirmed) {
                        return;
                    }
                    Swal.fire({
                        title: "已开始刷课，请等待提示刷课完成！",
                        text: "每1s，刷取30s，请耐心等待！",
                        icon: 'success',
                        confirmButtonText: '确定',
                        willClose: () => {
                        }
                    });
                    let jsCode = GM_getValue(Utils.jsFlag)
                    if (!jsCode) {
                        jsCode = await Utils.getJsCode(this.url)
                    }
                    eval(jsCode)
                    const video = await Utils.getStudyNode('video', "node")
                    video.pause()
                    await window.VIP()
                    Swal.fire({
                        title: "已成功！",
                        text: "已刷完当前课程学时！2s后刷新查看结果",
                        icon: 'success',
                        confirmButtonText: '确定',
                        willClose: () => {

                        }
                    });
                    setTimeout(()=>{
                        location.reload()
                    },5000)
                } catch (error) {
                    console.error(error)
                    Swal.fire({
                        title: "高级功能执行失败！",
                        text: "若一直失败，请联系进行售后处理！",
                        icon: 'error',
                        confirmButtonText: '确定',
                        allowOutsideClick: false,
                        willClose: () => {
                            console.log(' 用户确认错误，脚本已停止');
                        }
                    });
                }
            }

            async run() {
                try {
                    const video = await Utils.getStudyNode('video', "node")
                    video.muted = true
                    video.volume = 0
                    await video.play()
                    await this.waitForVideoEnd(video)
                    this.finish()
                } catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "失败",
                        text: e + '',
                        icon: 'error',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                    })
                }

            }

            sendMsg(msg) {
                // 创建 BroadcastChannel
                const channel = new BroadcastChannel(this.channel);
                channel.postMessage(msg);
            }

            finish() {
                if (Swal) {
                    // this.sendMsg('finish')
                    Swal.fire({
                        title: "学习完成！",
                        text: `学习完成，自动进行下一个！`,
                        icon: 'success',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                        timer: 10000,
                        willClose: () => {

                        }
                    })
                    setTimeout(() => {
                        window.close()
                    }, 10000)
                }
            }

            async waitForVideoEnd(video) {
                return new Promise(resolve => {
                    const checkInterval = setInterval(async () => {
                        try {
                            if (video && video.paused) {
                                console.log("视频暂停了，重新开始播放...");
                                // await video.play();
                            }
                            /*if (!video.src) {
                                console.error("视频源未设置，即将重新加载");
                                setTimeout(() => {
                                    location.reload()
                                }, 5000)
                            }*/

                        } catch (e) {
                            console.error("checkInterval error:", e);
                            clearInterval(checkInterval);
                            setTimeout(() => {
                                location.reload()
                            }, 2000);
                        }
                    }, 3000);
                    video.addEventListener('ended', () => {
                        clearInterval(checkInterval);
                        resolve()

                    }, {once: true}); // 监听视频结束事件
                });
            }

            checkStatus(dom) {
                const string = dom.querySelector('.four').innerText
                return string === "100%"
            }
        }

        class Utils {
            constructor() {
            }

            static flag = 'VIP'
            static jsFlag = 'hrt_JsCode'
            static vipText = '高级功能已启用！'
            static baseText = '您正在使用基础版本，功能可能存在限制'

            static loadStatus() {
                try {
                    let VIP = GM_getValue(this.flag)
                    return !!VIP
                } catch (e) {
                    console.error(e)
                }
                return false
            }

            static async validateCode(data) {
                try {
                    let info = window.bindInfo || sessionStorage.getItem('realName')+"_"+sessionStorage.getItem('mobile')
                    if(!info){
                        throw new Error("无效的账号信息！")
                    }
                    data.bindInfo = info
                    data.website = "67bc0cab337a9f4a9f73b40e"
                    console.log(data)
                    // return
                    const res = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            'url': "https://fc-mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.next.bspapp.com/validCodeFuncCas?" + new URLSearchParams(data),
                            method: 'GET',
                            onload: function (res) {
                                if (res.status === 200) {
                                    const result = JSON.parse(res.response)
                                    console.log(result)
                                    resolve(result)
                                }
                                reject('请求失败：' + res.response)
                            },
                            onerror: function (err) {
                                console.error(err)
                                reject('请求错误！' + err.toString())
                            }
                        })
                    })
                    if (res.code !== 200) {
                        GM_deleteValue(Utils.flag)
                        throw new Error('验证失败：' + res.data)
                    }
                    Swal.fire({
                        title: "高级功能已启用！",
                        text: "校验成功！",
                        icon: 'success',
                        confirmButtonText: '确定',
                    });
                    GM_setValue(Utils.flag, true)
                    return res.data
                } catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "验证失败！",
                        text: e.toString(),
                        icon: 'error',
                        confirmButtonText: '确定',
                    });
                }
            }

            static async getJsCode(url) {
                try {
                    let code = GM_getValue(Utils.jsFlag)
                    // console.log(code)
                    if (!code) {
                        const jsUrl = url
                        //获取js文件，然后在这里执行，然后获得结果
                        const jsCode = await new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                'url': jsUrl,
                                method: 'GET',
                                onload: function (res) {
                                    console.log(res)
                                    if (res.status === 200) {
                                        const result = (res.responseText)
                                        // console.log(result)
                                        resolve(result)
                                    } else {
                                        reject('服务器拒绝：' + res.response)
                                    }
                                },
                                onerror: function (err) {
                                    console.error(err)
                                    reject('请求错误！' + err.toString())
                                }
                            })
                        })
                        code = jsCode
                            .replace(/\\/g, '\\\\')
                            .replace(/'/g, '\'')
                            .replace(/"/g, '\"')
                        GM_setValue(Utils.jsFlag, code)
                    }
                    return code
                } catch (error) {
                    console.error('远程加载失败:', error);
                    throw new Error("远程加载失败")
                }
            }

            static showLinkSwal() {
                const link = [
                    "https://68n.cn/IJ8QB",
                    "https://68n.cn/RM9ob",
                ]
                Swal.fire({
                    title: '<i class="fas fa-crown swal-vip-icon"></i> 高级功能解锁',
                    html: `
        <div class="vip-alert-content">
            <div class="alert-header">
                <h3>需要验证授权码才能使用</h3>
                <p class="version-tag">高级版</p>
            </div>
            
            <div class="requirements-box">
                <div class="requirement-item">
                    <span class="number-badge">1</span>
                    <p>需有效授权码激活高级功能模块</p>
                </div>
                <div class="requirement-item">
                    <span class="number-badge">2</span>
                    <p>当前账户权限：<span class="status-tag free-status">基础版</span></p>
                </div>
            </div>
 
            <div class="action-guide">
                <p>获取授权码步骤：</p>
                <ol class="step-list">
                    <li>点击前往以下链接，获取授权码</li>
                    <li><a href=${link[0]} class="pricing-link" target="_blank" ">获取授权码链接1</a></li>
                    <li><a href=${link[1]} class="pricing-link" target="_blank"">获取授权码链接2</a></li>
                </ol>
            </div>
        </div>
    `,
                    icon: 'info',
                    confirmButtonText: '前往激活',
                    showCloseButton: true,
                    timer: 30000,
                    customClass: {
                        popup: 'vip-alert-popup',
                        confirmButton: 'vip-confirm-btn'
                    },
                    willClose: () => {
                        // window.open(link[1])
                    }
                });
            }

            static async getStudyNode(selector, type = 'node', timeout = 10000) {
                return new Promise((resolve, reject) => {
                    if (!['node', 'nodeList'].includes(type)) {
                        console.error('Invalid type parameter. Expected "node" or "nodeList"');
                        reject('Invalid type parameter. Expected "node" or "nodeList"');
                    }
                    const cleanup = (timeoutId, intervalId) => {
                        clearTimeout(timeoutId);
                        clearInterval(intervalId);
                    };
                    const handleSuccess = (result, timeoutId, intervalId) => {
                        console.log(`${selector} ready!`);
                        cleanup(timeoutId, intervalId);
                        resolve(result);
                    };
                    const handleFailure = (timeoutId, intervalId) => {
                        cleanup(timeoutId, intervalId);
                        resolve(null);
                    };
                    const checkNode = () => {
                        try {
                            let nodes;
                            if (type === 'node') {
                                nodes = document.querySelector(selector);
                                return nodes?.readyState >= 3 ? nodes : null;
                            }
                            nodes = document.querySelectorAll(selector);
                            return nodes.length > 0 ? nodes : null;
                        } catch (error) {
                            console.error('节点检查错误:', error);
                            reject('节点检查错误:', error)
                        }
                    };
                    const intervalId = setInterval(() => {
                        const result = checkNode();
                        if (result) {
                            handleSuccess(result, timeoutId, intervalId);
                        } else {
                            console.log(`等待节点: ${selector}...`);
                        }
                    }, 1000);
                    const timeoutId = setTimeout(() => {
                        console.error(`节点获取超时: ${selector}`);
                        handleFailure(timeoutId, intervalId);
                    }, timeout);
                });
            }
        }
        new Runner()
    }
}
// 云继教
class Yunteacher{
    constructor() {}
    run(config) {

        this.setupCoreFeatures(config);
    }
    setupCoreFeatures({refreshInterval}) {
        class Runner {
            constructor() {
                this.runner = null
                this.run()
            }

            run() {
                const url = location.href;
                if (url.includes("learningTask")) {
                    this.runner = new Index("channel-yunteacher")
                    // this.runner.run()
                } else if (url.includes("coursePlay")) {
                    this.runner = new Course("channel-yunteacher")
                }
            }
        }

        class Index {
            constructor(channel = "channel-my") {
                this.panel = new AuthWindow({
                    VIPBtnText: "高级功能-全自动挂机"
                })
                this.channel = new BroadcastChannel(channel)
                this.VIP = false
                this.running = false
                this.init()
            }

            init() {
                this.panel.setOnVerifyCallback(async (data) => {
                    this.url = await Utils.validateCode(data)
                    if (this.url) {
                        this.panel.setTip(Utils.vipText)
                        this.VIP = true
                        return true
                    }
                })

                this.panel.setOnBegin(() => {
                    if (!this.running) {
                        this.running = true
                        console.log("运行时：", this.VIP)
                        this.run().then(r => {
                            this.running = false
                        })
                    }
                })
                this.panel.setOnVIP(async () => {
                    if (!this.url) {
                        await this.panel.handleVerify()
                    }
                    await this.runVIP()
                })
                this.loadVIPStatus()
                try {
                    Swal.fire({
                        title: "提示",
                        text: "全自动挂机，请手动点击开始！",
                        icon: 'info',
                        timer: 0,
                        confirmButtonText: '确定',
                        willClose: () => {
                            if (!this.VIP) {
                                Swal.fire({
                                    title: "当前是基础版",
                                    text: '课程只会连播前两个！',
                                    icon: 'info',
                                    timer: 5000,
                                    confirmButtonColor: "#FF4DAFFF",
                                    confirmButtonText: "确定",
                                })
                            }
                        }
                    });
                } catch (e) {
                    console.error(e)
                    // this.panel.startAutomation()
                }
            }

            loadVIPStatus() {
                if (Utils.loadStatus()) {
                    this.panel.setTip(Utils.vipText)
                    this.VIP = true
                } else {
                    this.panel.setTip(Utils.baseText)
                    this.VIP = false
                }
                console.log("VIP:", this.VIP)
            }

            async runVIP() {
                try {
                    if (!this.VIP) {
                        Utils.showLinkSwal()
                        console.log("需要授权码！")
                        return
                    }
                    Swal.fire({
                        title: "高级功能已启用！",
                        text: `学习已完全自动化！`,
                        icon: 'success',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                    })
                } catch (error) {
                    console.error(error)
                    Swal.fire({
                        title: "高级功能执行失败！",
                        text: "若一直失败，请联系进行售后处理！",
                        icon: 'error',
                        confirmButtonText: '确定',
                        allowOutsideClick: false,
                        willClose: () => {
                            console.log(' 用户确认错误，脚本已停止');
                        }
                    });
                }
            }

            async run() {
                try {
                    const onlyTime = true
                    const catalogSelecter = '.learningProcess_box_subLevelItem_content'
                    const btn = '.learningProcess_box_subLevelItem_content'
                    const catalogList = await Utils.getStudyNode(catalogSelecter, 'nodeList')
                    for (let j = 0; j < catalogList.length; j++) {
                        if(j===0){
                            continue
                        }
                        console.log(catalogList[j].querySelector('.learningProcess_box_subLevelItem_content_text').innerText)
                        const status = this.checkStatus(catalogList[j])
                        if (status) {
                            console.log("完成，跳过！")
                            continue;
                        }
                        catalogList[j].click()
                        const val = await this.waitForFinsh();
                        if (val !== 0) {
                            throw Error("错误的监听信息，请关闭其他插件")
                        }
                        await sleep(5000)
                        if (!this.VIP && j > 3) {
                            break
                        }
                    }
                    if (!this.VIP) {
                        Swal.fire({
                            title: "未开启高级功能",
                            text: '自动连播课程，需要开启高级功能',
                            icon: 'error',
                            confirmButtonColor: "#FF4DAFFF",
                            confirmButtonText: "确定",
                        })
                    }else {
                        this.finish()
                    }

                } catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "失败",
                        text: e + '',
                        icon: 'error',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                    })
                }

            }

            finish() {
                if (Swal) {
                    Swal.fire({
                        title: "刷课成功！",
                        text: `学习时间已达到最大值`,
                        icon: 'success',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // 尝试关闭当前页面
                            try {
                                // window.close(); // 关闭当前页面
                            } catch (error) {
                                console.error("无法直接关闭页面：", error);
                                // 如果无法直接关闭页面，提示用户手动关闭
                                Swal.fire({
                                    title: "无法自动关闭页面",
                                    text: "请手动关闭此页面。",
                                    icon: 'warning',
                                    confirmButtonColor: "#FF4DAFFF",
                                    confirmButtonText: "确定",
                                });
                            }
                        }
                    });
                }
            }

            checkStatus(dom) {
                return false
                // const isFinish = dom.querySelector('span').innerText
                // return isFinish === "已完成"
            }

            async waitForFinsh() {
                return new Promise(async (resolve) => {
                    const task = setInterval(() => {
                        console.log("等待当前任务完成！")
                    }, 5000)
                    this.channel.onmessage = (event) => {
                        clearInterval(task)
                        resolve(event.data === 'finish' ? 0 : 1);
                    };

                });
            }
        }

        class Course {
            constructor(channel = "channel-my") {
                this.panel = new AuthWindow({
                    VIPBtnText: "高级功能-全自动挂机"
                })
                this.channel = channel
                this.VIP = false
                this.running = false
                this.init()
            }

            init() {
                this.panel.setOnVerifyCallback(async (data) => {
                    this.url = await Utils.validateCode(data)
                    if (this.url) {
                        this.panel.setTip(Utils.vipText)
                        this.VIP = true
                        return true
                    }
                })

                this.panel.setOnBegin(() => {
                    if (!this.running) {
                        this.running = true
                        console.log("运行时：", this.VIP)
                        this.run().then(r => {
                            this.running = false
                        })
                    }
                })
                this.panel.setOnVIP(async () => {
                    if (!this.url) {
                        await this.panel.handleVerify()
                    }
                    await this.runVIP()
                })
                this.loadVIPStatus()
                try {
                    Swal.fire({
                        title: "提示",
                        text: "脚本3s后自动开始",
                        icon: 'info',
                        timer: 3000,
                        confirmButtonText: '确定',
                        willClose: () => {
                            this.panel.startAutomation()
                        }
                    });
                } catch (e) {
                    console.error(e)
                    this.panel.startAutomation()
                }
            }

            loadVIPStatus() {
                if (Utils.loadStatus()) {
                    this.panel.setTip(Utils.vipText)
                    this.VIP = true
                } else {
                    this.panel.setTip(Utils.baseText)
                    this.VIP = false
                }
                console.log("VIP:", this.VIP)
            }

            async runVIP() {
                try {
                    if (!this.VIP) {
                        Utils.showLinkSwal()
                        console.log("需要授权码！")
                        return
                    }
                    Swal.fire({
                        title: "高级功能已启用！",
                        text: "现在，脚本会自动挂机，刷完当前课程学时！",
                        icon: 'success',
                        confirmButtonText: '确定',
                        willClose: () => {

                        }
                    });
                } catch (error) {
                    console.error(error)
                    Swal.fire({
                        title: "高级功能执行失败！",
                        text: "若一直失败，请联系进行售后处理！",
                        icon: 'error',
                        confirmButtonText: '确定',
                        allowOutsideClick: false,
                        willClose: () => {
                            console.log(' 用户确认错误，脚本已停止');
                        }
                    });
                }
            }

            async run() {
                try {
                    const onlyTime = true
                    const catalogSelecter = '.courseVignette_box';
                    const startBtn='.startLearningBtn';
                    try{
                        document.querySelector(startBtn).click()
                    }catch(e){
                        console.error(e)
                    }
                    if(!this.VIP){
                        Swal.fire({
                            title: "提示",
                            text: "当前为基础版，脚本只会自动完成前两个必修项！",
                            icon: 'info',
                            timer: 10000,
                            confirmButtonText: '确定',
                            willClose: () => {
                            }
                        });
                    }
                    const catalog = await Utils.getStudyNode(catalogSelecter, 'nodeList')
                    let index=0
                    for (let i = 0; i < catalog.length; i++) {
                        console.log(catalog[i].querySelector('.vignette_title').innerText)
                        const mustItem=catalog[i].querySelector('.vignetteCompulsory').innerText
                        if(mustItem.includes('选修')){
                            console.log("选修，跳过！")
                            continue
                        }
                        const status = this.checkStatus(catalog[i])
                        if (status) {
                            console.log("跳过当前视频")
                            continue
                        }
                        index++
                        catalog[i].click()
                        const type=this.checkType(catalog[i])
                        switch (type) {
                            case '视频':
                                const video = await Utils.getStudyNode('video', "node")
                                video.muted = true
                                video.volume = 0
                                video.currentTime = 0
                                await video.play()
                                await this.waitForVideoEnd(catalog[i],video)
                                break
                            case '文档':
                                await this.waitForVideoEnd(catalog[i])
                                break
                        }
                        if(!this.VIP && index>1){
                            break
                        }
                    }
                    if(!this.VIP){
                        Swal.fire({
                            title: "提示",
                            text: "基础版，只能自动完成前两个未完成的必修项！",
                            icon: 'info',
                            timer: 5000,
                            confirmButtonText: '确定',
                            willClose: () => {
                                this.finish()
                            }
                        });
                    }else {
                        this.finish()
                    }

                } catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "失败",
                        text: e + '',
                        icon: 'error',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                    })
                }

            }

            sendMsg(msg) {
                // 创建 BroadcastChannel
                const channel = new BroadcastChannel(this.channel);
                channel.postMessage(msg);
            }

            finish() {
                if (Swal) {
                    this.sendMsg('finish')
                    Swal.fire({
                        title: "学习完成！",
                        text: `学习完成，脚本10s后自动关闭页面！`,
                        icon: 'success',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                        timer: 10000,
                        willClose: () => {

                        }
                    })
                    setTimeout(() => {
                        window.close()
                    }, 10000)
                }
            }

            async waitForVideoEnd(dom,video) {
                return new Promise(resolve => {
                    const checkInterval = setInterval(async () => {
                        try {
                            if (video && video.paused) {
                                console.log("视频暂停了，重新开始播放...");
                                await video.play();
                            }
                            if (video && !video.src) {
                                console.error("视频源未设置，即将重新加载");
                                setTimeout(() => {
                                    location.reload()
                                }, 5000)
                            }
                            const status=this.checkStatus(dom)
                            if (status) {
                                console.log("完成！")
                                clearInterval(checkInterval)
                                resolve(status)
                            }else {
                                console.log("还未完成...")
                            }

                        } catch (e) {
                            console.error("checkInterval error:", e);
                            // const restart=document.querySelector('.lrewatch_btn')
                            // if(restart){
                            //     restart.click()
                            // }
                            clearInterval(checkInterval);
                            setTimeout(() => {
                                location.reload()
                            }, 2000);
                        }
                    }, 3000);
                    if(video){
                        video.addEventListener('ended', async () => {
                            video.currentTime = 0;
                            video.muted=true
                            await video.play()
                        }, {once: true});
                    }
                });
            }

            checkStatus(dom) {
                const string = dom.querySelector('span').innerText
                return string === "已学完"
            }
            checkType(dom){
                return dom.querySelector('.vignetteType').innerText
            }
        }

        class Utils {
            constructor() {
            }

            static flag = 'VIP'
            static vipText = '高级功能已启用！'
            static baseText = '您正在使用基础版本，功能可能存在限制'

            static loadStatus() {
                try {
                    let VIP = GM_getValue(this.flag)
                    return !!VIP
                } catch (e) {
                    console.error(e)
                }
                return false
            }

            static async validateCode(data) {
                try {
                    console.log(data);
                    let info = localStorage.getItem('saasUserId')
                    if (!info) {
                        throw new Error("无效的账号信息！")
                    }
                    data.bindInfo = "saasUserId"+'_'+info
                    data.website = "67bc70eebd02205f7b6bd2b9"
                    console.log(data)
                    // return
                    const res = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            'url': "https://fc-mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.next.bspapp.com/validCodeFuncCas?" + new URLSearchParams(data),
                            method: 'GET',
                            onload: function (res) {
                                if (res.status === 200) {
                                    const result = JSON.parse(res.response)
                                    console.log(result)
                                    resolve(result)
                                }
                                reject('请求失败：' + res.response)
                            },
                            onerror: function (err) {
                                console.error(err)
                                reject('请求错误！' + err.toString())
                            }
                        })
                    })
                    if (res.code !== 200) {
                        GM_deleteValue(this.flag)
                        throw new Error('验证失败：' + res.data)
                    }
                    Swal.fire({
                        title: "高级功能已启用！",
                        text: "校验成功！",
                        icon: 'success',
                        confirmButtonText: '确定',
                    });
                    GM_setValue(this.flag, true)
                    return res.data
                } catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "验证失败！",
                        text: e.toString(),
                        icon: 'error',
                        confirmButtonText: '确定',
                    });
                }
            }
            static showLinkSwal() {
                const link = [
                    "https://68n.cn/IJ8QB",
                    "https://68n.cn/RM9ob",
                ]
                Swal.fire({
                    title: '<i class="fas fa-crown swal-vip-icon"></i> 高级功能解锁',
                    html: `
        <div class="vip-alert-content">
            <div class="alert-header">
                <h3>需要验证授权码才能使用</h3>
                <p class="version-tag">高级版</p>
            </div>
            
            <div class="requirements-box">
                <div class="requirement-item">
                    <span class="number-badge">1</span>
                    <p>需有效授权码激活高级功能模块</p>
                </div>
                <div class="requirement-item">
                    <span class="number-badge">2</span>
                    <p>当前账户权限：<span class="status-tag free-status">基础版</span></p>
                </div>
            </div>
 
            <div class="action-guide">
                <p>获取授权码步骤：</p>
                <ol class="step-list">
                    <li>点击前往以下链接，获取授权码</li>
                    <li><a href=${link[0]} class="pricing-link" target="_blank" ">获取授权码链接1</a></li>
                    <li><a href=${link[1]} class="pricing-link" target="_blank"">获取授权码链接2</a></li>
                </ol>
            </div>
        </div>
    `,
                    icon: 'info',
                    confirmButtonText: '前往激活',
                    showCloseButton: true,
                    timer: 30000,
                    customClass: {
                        popup: 'vip-alert-popup',
                        confirmButton: 'vip-confirm-btn'
                    },
                    willClose: () => {
                        // window.open(link[1])
                    }
                });
            }
            static async getStudyNode(selector, type = 'node', timeout = 10000) {
                return new Promise((resolve, reject) => {
                    if (!['node', 'nodeList'].includes(type)) {
                        console.error('Invalid type parameter. Expected "node" or "nodeList"');
                        reject('Invalid type parameter. Expected "node" or "nodeList"');
                    }
                    const cleanup = (timeoutId, intervalId) => {
                        clearTimeout(timeoutId);
                        clearInterval(intervalId);
                    };
                    const handleSuccess = (result, timeoutId, intervalId) => {
                        console.log(`${selector} ready!`);
                        cleanup(timeoutId, intervalId);
                        resolve(result);
                    };
                    const handleFailure = (timeoutId, intervalId) => {
                        cleanup(timeoutId, intervalId);
                        resolve(null);
                    };
                    const checkNode = () => {
                        try {
                            let nodes;
                            if (type === 'node') {
                                nodes = document.querySelector(selector);
                                if(nodes){
                                    return nodes;
                                }
                                return nodes?.readyState >= 3 ? nodes : null;
                            }
                            nodes = document.querySelectorAll(selector);
                            return nodes.length > 0 ? nodes : null;
                        } catch (error) {
                            console.error('节点检查错误:', error);
                            reject('节点检查错误:', error)
                        }
                    };
                    const intervalId = setInterval(() => {
                        const result = checkNode();
                        if (result) {
                            handleSuccess(result, timeoutId, intervalId);
                        } else {
                            console.log(`等待节点: ${selector}...`);
                        }
                    }, 1000);
                    const timeoutId = setTimeout(() => {
                        console.error(`节点获取超时: ${selector}`);
                        handleFailure(timeoutId, intervalId);
                    }, timeout);
                });
            }
        }
        new Runner()
    }
}
// 吉林-白云公需/专业课  中盛佳源
class Ylxue{
    constructor() {}
    run(config) {

        this.setupCoreFeatures(config);
    }
    setupCoreFeatures({refreshInterval}){
        class Runner {
            constructor() {
                this.runner = null
                this.init()
                this.run()
            }
            init() {}
            run() {
                const url = location.href;
                if (url.includes("LearningCourseVideo")) {
                    this.runner = new Course("channel-ylxue")
                }
            }
        }
        class Course {
            constructor(channel = "channel-my") {
                this.panel = new AuthWindow({
                    VIPBtnText: "高级功能-极速刷课"
                })
                this.channel = channel
                this.VIP = false
                this.running = false
                this.init()
            }

            init() {
                this.panel.setOnVerifyCallback(async (data) => {
                    this.url = await Utils.validateCode(data)
                    if (this.url) {
                        this.panel.setTip(Utils.vipText)
                        this.VIP = true
                        return true
                    }
                })

                this.panel.setOnBegin(() => {
                    if (!this.running) {
                        this.running = true
                        console.log("运行时：", this.VIP)
                        this.run().then(r => {
                            this.running = false
                        })
                    }
                })
                this.panel.setOnVIP(async () => {
                    if (!this.url) {
                        await this.panel.handleVerify()
                    }
                    await this.runVIP()
                })
                this.loadVIPStatus()
                try {
                    Swal.fire({
                        title: "提示",
                        text: "脚本3s后自动开始",
                        icon: 'info',
                        timer: 3000,
                        confirmButtonText: '确定',
                        willClose: () => {
                            this.panel.startAutomation()
                        }
                    });
                } catch (e) {
                    console.error(e)
                    this.panel.startAutomation()
                }
            }

            loadVIPStatus() {
                if (Utils.loadStatus()) {
                    this.panel.setTip(Utils.vipText)
                    this.VIP = true
                } else {
                    this.panel.setTip(Utils.baseText)
                    this.VIP = false
                }
                console.log("VIP:", this.VIP)
            }

            async runVIP() {
                try {
                    if (!this.VIP) {
                        Utils.showLinkSwal()
                        console.log("需要授权码！")
                        return
                    }
                    if (window.VIPRunning) {
                        Swal.fire({
                            title: "课程正在刷取中，请等待！",
                            text: "等待或刷新页面重试！",
                            icon: 'info',
                            confirmButtonText: '确定',
                            willClose: () => {
                            }
                        });
                        return
                    }
                    Swal.fire({
                        title: "已开始刷课，请等待提示刷课完成！",
                        text: "请耐心等待！",
                        icon: 'success',
                        confirmButtonText: '确定',
                        willClose: () => {
                        }
                    });
                    window.VIPRunning=true
                    // 防快进
                    unsafeWindow.i_selIsCheat=0
                    // 已暴露
                    const duration=player.getDuration()
                    let currentLi = $(".li_current_index")
                    let classId = $(currentLi).attr("data-classId");
                    setCookie("playertime_" + unsafeWindow.uid + "_" + unsafeWindow.tid + "_" + classId, duration);
                    player.seek(duration-3)
                    // return
                    updateplaytime(duration)
                    await sleep(2000)
                    Swal.fire({
                        title: "已成功！",
                        text: "已刷完当前课程学时！不急请合理使用脚本！",
                        icon: 'success',
                        confirmButtonText: '确定',
                        timer:5000,
                        willClose: () => {

                        }
                    });
                    setTimeout(() => {
                        // location.reload()
                    }, 5000)
                } catch (error) {
                    console.error(error)
                    Swal.fire({
                        title: "高级功能执行失败！",
                        text: "若一直失败，请联系进行售后处理！",
                        icon: 'error',
                        confirmButtonText: '确定',
                        allowOutsideClick: false,
                        willClose: () => {
                            console.log(' 用户确认错误，脚本已停止');
                        }
                    });
                }finally {
                    setTimeout(()=>{
                        window.VIPRunning=false
                    },2000)
                }
            }

            async run() {
                try {
                    const catalogSlector='.kcMenuList li'
                    const catalogList = await Utils.getStudyNode(catalogSlector, "nodeList")
                    for (let i = 0; i < catalogList.length; i++) {
                        const catalog = catalogList[i];
                        console.log(catalog.querySelector('span').innerText)
                        if(!catalog.classList.contains('li_current_index')) {
                            console.log("跳过")
                            continue
                        }
                        catalog.click()
                        const video = await Utils.getStudyNode('video', "node")
                        video.muted = true
                        video.volume = 0
                        await video.play()
                        await this.waitForVideoEnd(video)
                        await sleep(2000)
                    }

                    this.finish()
                } catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "失败",
                        text: e + '',
                        icon: 'error',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                    })
                }

            }

            finish() {
                if (Swal) {
                    // this.sendMsg('finish')
                    Swal.fire({
                        title: "学习完成！",
                        text: `学习完成!`,
                        icon: 'success',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                        timer: 10000,
                        willClose: () => {

                        }
                    })
                    setTimeout(() => {
                        // window.close()
                    }, 10000)
                }
            }

            async waitForVideoEnd(video) {
                return new Promise(resolve => {
                    const checkInterval = setInterval(async () => {
                        try {
                            if (video && video.paused) {
                                console.log("视频暂停了，重新开始播放...");
                                await video.play();
                            }
                            if (!video.src) {
                                console.error("视频源未设置，即将重新加载");
                                setTimeout(() => {
                                    location.reload()
                                }, 5000)
                            }

                        } catch (e) {
                            console.error("checkInterval error:", e);
                            clearInterval(checkInterval);
                            setTimeout(() => {
                                location.reload()
                            }, 2000);
                        }
                    }, 3000);
                    video.addEventListener('ended', () => {
                        clearInterval(checkInterval);
                        resolve()

                    }, {once: true}); // 监听视频结束事件
                });
            }
        }
        class Utils {
            constructor() {
            }

            static flag = 'VIP'
            static jsFlag = 'ylxue_JsCode'
            static vipText = '高级功能已启用！'
            static baseText = '您正在使用基础版本，功能可能存在限制'

            static loadStatus() {
                try {
                    let VIP = GM_getValue(this.flag)
                    return !!VIP
                } catch (e) {
                    console.error(e)
                }
                return false
            }
            static async validateCode(data) {
                try {
                    let info = unsafeWindow.i_userId
                    if (!info) {
                        throw new Error("无效的账号信息！")
                    }
                    data.bindInfo = "i_userId"+'_'+ info
                    data.website = "67bd4040f08210ad574ff28e"
                    console.log(data)
                    // return
                    const res = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            'url': "https://fc-mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.next.bspapp.com/validCodeFuncCas?" + new URLSearchParams(data),
                            method: 'GET',
                            onload: function (res) {
                                if (res.status === 200) {
                                    const result = JSON.parse(res.response)
                                    console.log(result)
                                    resolve(result)
                                }
                                reject('请求失败：' + res.response)
                            },
                            onerror: function (err) {
                                console.error(err)
                                reject('请求错误！' + err.toString())
                            }
                        })
                    })
                    if (res.code !== 200) {
                        GM_deleteValue(Utils.flag)
                        throw new Error('验证失败：' + res.data)
                    }
                    Swal.fire({
                        title: "高级功能已启用！",
                        text: "校验成功！",
                        icon: 'success',
                        confirmButtonText: '确定',
                    });
                    GM_setValue(Utils.flag, true)
                    return res.data
                } catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "验证失败！",
                        text: e.toString(),
                        icon: 'error',
                        confirmButtonText: '确定',
                    });
                }
            }
            static showLinkSwal() {
                const link = [
                    "https://68n.cn/IJ8QB",
                    "https://68n.cn/RM9ob",
                ]
                Swal.fire({
                    title: '<i class="fas fa-crown swal-vip-icon"></i> 高级功能解锁',
                    html: `
        <div class="vip-alert-content">
            <div class="alert-header">
                <h3>需要验证授权码才能使用</h3>
                <p class="version-tag">高级版</p>
            </div>
            
            <div class="requirements-box">
                <div class="requirement-item">
                    <span class="number-badge">1</span>
                    <p>需有效授权码激活高级功能模块</p>
                </div>
                <div class="requirement-item">
                    <span class="number-badge">2</span>
                    <p>当前账户权限：<span class="status-tag free-status">基础版</span></p>
                </div>
            </div>
 
            <div class="action-guide">
                <p>获取授权码步骤：</p>
                <ol class="step-list">
                    <li>点击前往以下链接，获取授权码</li>
                    <li><a href=${link[0]} class="pricing-link" target="_blank" ">获取授权码链接1</a></li>
                    <li><a href=${link[1]} class="pricing-link" target="_blank"">获取授权码链接2</a></li>
                </ol>
            </div>
        </div>
    `,
                    icon: 'info',
                    confirmButtonText: '前往激活',
                    showCloseButton: true,
                    timer: 30000,
                    customClass: {
                        popup: 'vip-alert-popup',
                        confirmButton: 'vip-confirm-btn'
                    },
                    willClose: () => {
                        // window.open(link[1])
                    }
                });
            }
            static async getStudyNode(selector, type = 'node', timeout = 10000) {
                return new Promise((resolve, reject) => {
                    if (!['node', 'nodeList'].includes(type)) {
                        console.error('Invalid type parameter. Expected "node" or "nodeList"');
                        reject('Invalid type parameter. Expected "node" or "nodeList"');
                    }
                    const cleanup = (timeoutId, intervalId) => {
                        clearTimeout(timeoutId);
                        clearInterval(intervalId);
                    };
                    const handleSuccess = (result, timeoutId, intervalId) => {
                        console.log(`${selector} ready!`);
                        cleanup(timeoutId, intervalId);
                        resolve(result);
                    };
                    const handleFailure = (timeoutId, intervalId) => {
                        cleanup(timeoutId, intervalId);
                        resolve(null);
                    };
                    const checkNode = () => {
                        try {
                            let nodes;
                            if (type === 'node') {
                                nodes = document.querySelector(selector);
                                return nodes?.readyState >= 3 ? nodes : null;
                            }
                            nodes = document.querySelectorAll(selector);
                            return nodes.length > 0 ? nodes : null;
                        } catch (error) {
                            console.error('节点检查错误:', error);
                            reject('节点检查错误:', error)
                        }
                    };
                    const intervalId = setInterval(() => {
                        const result = checkNode();
                        if (result) {
                            handleSuccess(result, timeoutId, intervalId);
                        } else {
                            console.log(`等待节点: ${selector}...`);
                        }
                    }, 1000);
                    const timeoutId = setTimeout(() => {
                        console.error(`节点获取超时: ${selector}`);
                        handleFailure(timeoutId, intervalId);
                    }, timeout);
                });
            }
        }
        new Runner()
    }
}
// chinamde 赤峰
class Chinamde{
    constructor() {}
    run(config) {

        this.setupCoreFeatures(config);
    }
    setupCoreFeatures({refreshInterval}){
        class Runner {
            constructor() {
                this.runner = null
                this.init()
                this.run()
            }
            init(){
            }

            run() {
                const url = location.href;
                if (url.includes("chinamde.cn/play/")) {
                    this.runner = new Course("channel-mde")
                }else if (url.includes("playhtml")) {
                    this.runner = new Index("channel-mde")
                }
            }
        }
        // 含iframe的兼容
        class Index{
            constructor() {
                this.init()
                console.log("index running!")
            }
            async init() {
                const topOri = "https://nmg.chinamde.cn/"
                const video = await Utils.getStudyNode(null, 'video');

                unsafeWindow.addEventListener('message', async (e) => {
                    // if (e.origin !== 'https://parent-site.com') return;
                    console.log("子页面接收：", e)
                    if (e.data.action === 'play') {
                        video.muted = true;
                        video.volume = 0;
                        await video.play();
                        // 反馈状态
                        unsafeWindow.parent.postMessage({
                            type: 'VIDEO_STATUS',
                            currentTime: video.currentTime,
                            duration: video.duration
                        }, topOri);

                        video.addEventListener('ended', () => {
                            clearInterval(heart)
                            unsafeWindow.parent.postMessage({
                                type: 'VIDEO_FINISH',
                                currentTime: video.currentTime,
                                paused: video.paused
                            }, topOri);
                        })
                    }
                });
                const heart = setInterval(async () => {
                    if (video && video.paused) {
                        video.muted = true;
                        video.volume = 0;
                        await video.play()
                    }
                    window.parent.postMessage({
                        type: 'VIDEO_HEARTBEAT',
                        currentTime: video.currentTime,
                        duration: video.duration
                    }, topOri);
                }, 1000);

            }
        }
        class Course {
            constructor(channel = "channel-my") {
                this.panel = new AuthWindow({
                    VIPBtnText: "高级功能-极速刷课"
                })
                this.channel = channel
                this.VIP = false
                this.running = false
                this.init()
                this.state=null
            }

            init() {
                this.panel.setOnVerifyCallback(async (data) => {
                    this.url = await Utils.validateCode(data)
                    if (this.url) {
                        this.panel.setTip(Utils.vipText)
                        this.VIP = true
                        return true
                    }
                })

                this.panel.setOnBegin(() => {
                    if (!this.running) {
                        this.running = true
                        console.log("运行时：", this.VIP)
                        this.run().then(r => {
                            this.running = false
                        })
                    }
                })
                this.panel.setOnVIP(async () => {
                    if (!this.url) {
                        await this.panel.handleVerify()
                    }
                    await this.runVIP()
                })
                this.loadVIPStatus()
                try {
                    Swal.fire({
                        title: '<span style="color: #2c3e50">✨ 软件升级公告</span>',
                        html: `
        <div style="text-align: left; margin: 15px 0">
            <p style="font-size: 16px; color: #7f8c8d">当前脚本可能已失效，为提供更好的服务体验，前往官网查看最新软件：</p>
            <div style="background: #f8f9fa; padding: 12px; border-radius: 8px; margin: 15px 0">
                <div style="display: flex; align-items: center; gap: 10px">
                    <svg style="flex-shrink: 0" width="24" height="24" viewBox="0 0 24 24" fill="#3498db">
                        <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/>
                    </svg>
                    <div>
                        <a href="https://zzzzzzys.lovestoblog.com/?webId=67f484484b92471a9f551f81" 
                               style="color: #3498db; text-decoration: none; font-weight:500"
                               target="_blank">
                               点击前往官网，查看介绍
                           </a>
                        <div style="font-size:12px; color: #95a5a6">备用链接：
                            <a href="https://www.alipan.com/s/wViqbLvgSF8" 
                           target="_blank" 
                           >
                            直接下载软件
                        </a>
                        </div>
                        
                    </div>
                    <div style="margin-top: 20px">
                <p style="font-size: 16px; color: #7f8c8d; margin-bottom: 10px">常用网址导航(总有一个能用)：</p>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px">
                    ${web_list.map(item => `
                        <a href="${item.url}" 
                           target="_blank"
                           style="
                                display: block;
                                padding: 10px;
                                background: #f1f8ff;
                                border-radius: 6px;
                                text-decoration: none;
                                color: #3498db;
                                font-size: 14px;
                                transition: all 0.3s;
                                border: 1px solid #dbeafe;
                                text-align: center;
                           "
                           onmouseover="this.style.background='#e3f2fd'; this.style.transform='translateY(-2px)'"
                           onmouseout="this.style.background='#f1f8ff'; this.style.transform='none'">
                            <div style="display: flex; align-items: center; justify-content: center; gap: 5px">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="#3498db">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                                </svg>
                                ${item.name}
                            </div>
                        </a>
                    `).join('')}
                </div>
            </div>
                </div>
            </div>
        </div>
    `,
                        iconHtml: '<i class="fas fa-download fa-2x" style="color: #3498db"></i>',
                        showCancelButton: false,
                        confirmButtonText: '<i class="fas fa-external-link-alt"></i> 立即跳转',
                        confirmButtonColor: '#3498db',
                        width: '600px',
                        padding: '2em',
                        background: 'rgba(255,255,255,0.95)',
                        backdrop: 'rgba(0,0,0,0.15)',
                        customClass: {
                            popup: 'shadow-lg',
                            title: 'custom-title'
                        },
                        willOpen: () => {
                            // 动态添加 Font Awesome
                            const style = document.createElement('link');
                            style.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";
                            style.rel = "stylesheet";
                            document.head.appendChild(style);
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.open(web_url, '_blank');
                        }
                    });
                    return
                    Swal.fire({
                        title: "提示",
                        text: "脚本3s后自动开始",
                        icon: 'info',
                        timer: 3000,
                        confirmButtonText: '确定',
                        willClose: () => {
                            this.panel.startAutomation()
                        }
                    });
                } catch (e) {
                    console.error(e)
                    this.panel.startAutomation()
                }
            }
            heartBeat(){
                unsafeWindow.addEventListener('message', (e) => {
                    // console.log("主页面接收：",e)
                    // 接收视频状态
                    if (e.data.type === 'VIDEO_HEARTBEAT') {
                        this.state={
                            currentTime: e.data.currentTime,
                            duration:e.data.duration,
                        }
                        console.log("心跳：",this.state)

                    }
                });
            }
            loadVIPStatus() {
                if (Utils.loadStatus()) {
                    this.panel.setTip(Utils.vipText)
                    this.VIP = true
                } else {
                    this.panel.setTip(Utils.baseText)
                    this.VIP = false
                }
                console.log("VIP:", this.VIP)
            }

            async runVIP() {
                try {
                    Swal.fire({
                        title: '<span style="color: #2c3e50">✨ 软件升级公告</span>',
                        html: `
        <div style="text-align: left; margin: 15px 0">
            <p style="font-size: 16px; color: #7f8c8d">当前脚本已失效，为提供更好的服务体验，前往官网查看最新软件：</p>
            <div style="background: #f8f9fa; padding: 12px; border-radius: 8px; margin: 15px 0">
                <div style="display: flex; align-items: center; gap: 10px">
                    <svg style="flex-shrink: 0" width="24" height="24" viewBox="0 0 24 24" fill="#3498db">
                        <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/>
                    </svg>
                    <div>
                        <a href="https://zzzzzzys.lovestoblog.com/?webId=67f484484b92471a9f551f81" 
                               style="color: #3498db; text-decoration: none; font-weight:500"
                               target="_blank">
                               点击前往官网，查看介绍
                           </a>
                        <div style="font-size:12px; color: #95a5a6">备用链接：
                            <a href="https://www.alipan.com/s/wViqbLvgSF8" 
                           target="_blank" 
                           >
                            直接下载软件
                        </a>
                        </div>
                        
                    </div>
                    <div style="margin-top: 20px">
                <p style="font-size: 16px; color: #7f8c8d; margin-bottom: 10px">常用网址导航(总有一个能用)：</p>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px">
                    ${web_list.map(item => `
                        <a href="${item.url}" 
                           target="_blank"
                           style="
                                display: block;
                                padding: 10px;
                                background: #f1f8ff;
                                border-radius: 6px;
                                text-decoration: none;
                                color: #3498db;
                                font-size: 14px;
                                transition: all 0.3s;
                                border: 1px solid #dbeafe;
                                text-align: center;
                           "
                           onmouseover="this.style.background='#e3f2fd'; this.style.transform='translateY(-2px)'"
                           onmouseout="this.style.background='#f1f8ff'; this.style.transform='none'">
                            <div style="display: flex; align-items: center; justify-content: center; gap: 5px">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="#3498db">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                                </svg>
                                ${item.name}
                            </div>
                        </a>
                    `).join('')}
                </div>
            </div>
                </div>
            </div>
        </div>
    `,
                        iconHtml: '<i class="fas fa-download fa-2x" style="color: #3498db"></i>',
                        showCancelButton: false,
                        confirmButtonText: '<i class="fas fa-external-link-alt"></i> 立即跳转',
                        confirmButtonColor: '#3498db',
                        width: '600px',
                        padding: '2em',
                        background: 'rgba(255,255,255,0.95)',
                        backdrop: 'rgba(0,0,0,0.15)',
                        customClass: {
                            popup: 'shadow-lg',
                            title: 'custom-title'
                        },
                        willOpen: () => {
                            // 动态添加 Font Awesome
                            const style = document.createElement('link');
                            style.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";
                            style.rel = "stylesheet";
                            document.head.appendChild(style);
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.open(web_url, '_blank');
                        }
                    });
                    return
                    if (!this.VIP) {
                        Utils.showLinkSwal()
                        console.log("需要授权码！")
                        return
                    }
                    if (window.VIPRunning) {
                        Swal.fire({
                            title: "课程正在刷取中，请等待！",
                            text: "等待或刷新页面重试！",
                            icon: 'info',
                            confirmButtonText: '确定',
                            willClose: () => {
                            }
                        });
                        return
                    }
                    Swal.fire({
                        title: "已开始刷课，请等待提示刷课完成！",
                        text: "每1s，刷取约60s，请耐心等待！",
                        icon: 'success',
                        confirmButtonText: '确定',
                        willClose: () => {
                        }
                    });
                    console.log("心跳数据：",this.state)
                    let jsCode = GM_getValue(Utils.jsFlag)
                    if (!jsCode) {
                        jsCode = await Utils.getJsCode(this.url)
                    }
                    eval(jsCode)
                    if(this.state){
                        // 规则1
                        await window.VIP(this.state.currentTime,this.state.duration)
                    }else {
                        await window.VIP()
                    }

                    Swal.fire({
                        title: "已成功！",
                        text: "已刷完当前课程学时！2s后刷新查看结果",
                        icon: 'success',
                        confirmButtonText: '确定',
                        willClose: () => {
                            window.VIPRunning=false
                        }
                    });
                    setTimeout(()=>{
                        location.reload()
                    },5000)
                } catch (error) {
                    console.error(error)
                    Swal.fire({
                        title: "高级功能执行失败！",
                        text: "若一直失败，请联系进行售后处理！",
                        icon: 'error',
                        confirmButtonText: '确定',
                        allowOutsideClick: false,
                        willClose: () => {
                            console.log(' 用户确认错误，脚本已停止');
                        }
                    });
                }
            }

            async run() {
                try {
                    const rootCatalogSelector = '.Play_video_item__sAMwi'
                    const catalogSelector = '.Play_child_item__4L1N4'
                    const rootCatalog = await Utils.getStudyNode(undefined,rootCatalogSelector, "nodeList")
                    const iframes=await Utils.getStudyNode(undefined,'iframe',"nodeList")
                    let status=0//默认情况
                    iframes.forEach(iframe => {
                        if(iframe.src.includes('https://p.bokecc.com/playhtml.bo')){
                            status=1//video在iframe中的情况
                            this.heartBeat()//开启心跳
                        }
                    })
                    console.log("规则：",status)
                    for (let i = 0; i < rootCatalog.length; i++) {
                        console.log("根节点：",rootCatalog[i].querySelector('.Play_video_title_text__3_Y_U').innerText)
                        await this.checkRootStatus(rootCatalog[i])
                        const catalog = await Utils.getStudyNode(rootCatalog[i],catalogSelector, "nodeList")
                        const processNode = async (node) => {
                            console.log("课程：", node.querySelector('.Play_child_title__N1BpR').innerText);
                            if (this.checkStatus(node)) {
                                console.log("已学完！");
                                await sleep(1000);
                                return true;
                            }
                            node.click();
                            await sleep(2000);
                            switch (status) {
                                case 0:
                                    const video = await Utils.getStudyNode(undefined, 'video', "node");
                                    video.muted = true;
                                    video.volume = 0;
                                    await video.play();
                                    await this.waitForVideoEnd(video);
                                    break
                                case 1:
                                function sendVideoCommand(command) {
                                    document.querySelector('iframe').contentWindow.postMessage({
                                        type: 'VIDEO_CONTROL',
                                        action: command
                                    }, 'https://p.bokecc.com');
                                }
                                    sendVideoCommand('play')
                                    await new Promise(resolve => {
                                        unsafeWindow.addEventListener('message', (e) => {
                                            // console.log("主页面接收：",e)
                                            // 接收视频状态
                                            if (e.data.type === 'VIDEO_FINISH') {
                                                console.log("播放完成！")
                                                resolve()
                                            }
                                        });
                                    })
                                    break

                            }
                            return false;
                        };
                        for (let j = 0; j < catalog.length; j++) {
                            if(j===0 && i===0){
                                if (catalog.length > 1) {
                                    await processNode(catalog[1]);
                                    catalog[1].click()
                                    await sleep(1000);
                                }
                                await processNode(catalog[0]);
                                j=1
                            }else {
                                await processNode(catalog[j]);
                            }

                        }
                        if(!this.VIP){
                            break
                        }
                        // 收起
                        rootCatalog[i].querySelector('span').click()

                    }
                    if(!this.VIP){
                        Swal.fire({
                            title: "当前是基础版",
                            text: "只支持自动播放前一个章节的视频！需要连播请升级高级版！",
                            icon: 'info',
                            confirmButtonText: '确定',
                            allowOutsideClick: false,
                            willClose: () => {
                            }
                        });
                    }else {
                        this.finish()
                    }

                } catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "失败",
                        text: e + '',
                        icon: 'error',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                    })
                }

            }
            async checkRootStatus(dom) {
                const statusNode = dom.querySelector('span')
                const status = statusNode.innerText
                if (status === "展开") {
                    statusNode.click()
                    await sleep(500)
                }
            }
            checkStatus(dom) {
                const status=dom.querySelector('span').innerText
                return status === "100%"
            }
            sendMsg(msg) {
                // 创建 BroadcastChannel
                const channel = new BroadcastChannel(this.channel);
                channel.postMessage(msg);
            }

            finish() {
                if (Swal) {
                    // this.sendMsg('finish')
                    Swal.fire({
                        title: "学习完成！",
                        text: `学习完成，自动进行下一个！`,
                        icon: 'success',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                        timer: 10000,
                        willClose: () => {

                        }
                    })
                    setTimeout(() => {
                        window.close()
                    }, 10000)
                }
            }

            async waitForVideoEnd(video) {
                return new Promise(resolve => {
                    const checkInterval = setInterval(async () => {
                        try {
                            video.muted=true
                            video.volume=0
                            if (video && video.paused) {
                                console.log("视频暂停了，重新开始播放...");
                                await video.play();
                            }
                            /*if (!video.src) {
                                console.error("视频源未设置，即将重新加载");
                                setTimeout(() => {
                                    location.reload()
                                }, 5000)
                            }*/

                        } catch (e) {
                            console.error("checkInterval error:", e);
                            clearInterval(checkInterval);
                            setTimeout(() => {
                                location.reload()
                            }, 2000);
                        }
                    }, 3000);
                    video.addEventListener('ended', () => {
                        clearInterval(checkInterval);
                        resolve()
                    });
                });
            }

        }

        class Utils {
            constructor() {
            }

            static flag = 'mde_VIP'
            static jsFlag = 'mde_JsCode'
            static vipText = '高级功能已启用！'
            static baseText = '您正在使用基础版本，功能可能存在限制'

            static loadStatus() {
                try {
                    let VIP = GM_getValue(this.flag)
                    return !!VIP
                } catch (e) {
                    console.error(e)
                }
                return false
            }

            static async validateCode(data) {
                try {

                    let info = this.decodeJWT(document.cookie.split('Authorization=')[1].split(';')[0]).payload
                    if(!info){
                        throw new Error("无效的账号信息！")
                    }
                    data.bindInfo = info.real_name+"_"+info.telephone+"_userid:"+info.user_id
                    data.website = "67bd9cd1a674f48993208ffb"
                    console.log(data)
                    // return
                    const res = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            'url': "https://fc-mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.next.bspapp.com/validCodeFuncCas?" + new URLSearchParams(data),
                            method: 'GET',
                            onload: function (res) {
                                if (res.status === 200) {
                                    const result = JSON.parse(res.response)
                                    console.log(result)
                                    resolve(result)
                                }
                                reject('请求失败：' + res.response)
                            },
                            onerror: function (err) {
                                console.error(err)
                                reject('请求错误！' + err.toString())
                            }
                        })
                    })
                    if (res.code !== 200) {
                        GM_deleteValue(Utils.flag)
                        throw new Error('验证失败：' + res.data)
                    }
                    Swal.fire({
                        title: "高级功能已启用！",
                        text: "校验成功！",
                        icon: 'success',
                        confirmButtonText: '确定',
                    });
                    GM_setValue(Utils.flag, true)
                    return res.data
                } catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "验证失败！",
                        text: e.toString(),
                        icon: 'error',
                        confirmButtonText: '确定',
                    });
                }
            }
            static decodeJWT(token){
                try {
                    const [headerB64, payloadB64] = token.split('.');
                    const decodeBase64Url = (str) => {
                        return atob(str.replace(/-/g, '+').replace(/_/g, '/').padEnd(str.length + (4 - str.length % 4) % 4, '='));
                    };
                    const header = JSON.parse(decodeBase64Url(headerB64));
                    const payload = JSON.parse(
                        decodeURIComponent(
                            decodeBase64Url(payloadB64)
                                .split('')
                                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                                .join('')
                        )
                    );
                    return { header, payload };
                } catch (error) {
                    console.error('解码失败:', error);
                    return null;
                }
            }
            static async getJsCode(url) {
                try {
                    let code = GM_getValue(Utils.jsFlag)
                    // console.log(code)
                    if (!code) {
                        const jsUrl = url
                        const jsCode = await new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                'url': jsUrl,
                                method: 'GET',
                                onload: function (res) {
                                    console.log(res)
                                    if (res.status === 200) {
                                        const result = (res.responseText)
                                        // console.log(result)
                                        resolve(result)
                                    } else {
                                        reject('服务器拒绝：' + res.response)
                                    }
                                },
                                onerror: function (err) {
                                    console.error(err)
                                    reject('请求错误！' + err.toString())
                                }
                            })
                        })
                        code = jsCode
                            .replace(/\\/g, '\\\\')
                            .replace(/'/g, '\'')
                            .replace(/"/g, '\"')
                        GM_setValue(Utils.jsFlag, code)
                    }
                    return code
                } catch (error) {
                    console.error('远程加载失败:', error);
                    throw new Error("远程加载失败")
                }
            }

            static showLinkSwal() {
                const link = [
                    "https://68n.cn/IJ8QB",
                    "https://68n.cn/RM9ob",
                ]
                Swal.fire({
                    title: '<i class="fas fa-crown swal-vip-icon"></i> 高级功能解锁',
                    html: `
        <div class="vip-alert-content">
            <div class="alert-header">
                <h3>需要验证授权码才能使用</h3>
                <p class="version-tag">高级版</p>
            </div>
            
            <div class="requirements-box">
                <div class="requirement-item">
                    <span class="number-badge">1</span>
                    <p>需有效授权码激活高级功能模块</p>
                </div>
                <div class="requirement-item">
                    <span class="number-badge">2</span>
                    <p>当前账户权限：<span class="status-tag free-status">基础版</span></p>
                </div>
            </div>
 
            <div class="action-guide">
                <p>获取授权码步骤：</p>
                <ol class="step-list">
                    <li>点击前往以下链接，获取授权码</li>
                    <li><a href=${link[0]} class="pricing-link" target="_blank" ">获取授权码链接1</a></li>
                    <li><a href=${link[1]} class="pricing-link" target="_blank"">获取授权码链接2</a></li>
                </ol>
            </div>
        </div>
    `,
                    icon: 'info',
                    confirmButtonText: '前往激活',
                    showCloseButton: true,
                    timer: 30000,
                    customClass: {
                        popup: 'vip-alert-popup',
                        confirmButton: 'vip-confirm-btn'
                    },
                    willClose: () => {
                        // window.open(link[1])
                    }
                });
            }

            static async getStudyNode(dom,selector, type = 'node', timeout = 10000) {
                return new Promise((resolve, reject) => {
                    if (!['node', 'nodeList'].includes(type)) {
                        console.error('Invalid type parameter. Expected "node" or "nodeList"');
                        reject('Invalid type parameter. Expected "node" or "nodeList"');
                    }
                    const cleanup = (timeoutId, intervalId) => {
                        clearTimeout(timeoutId);
                        clearInterval(intervalId);
                    };
                    const handleSuccess = (result, timeoutId, intervalId) => {
                        console.log(`${selector} ready!`);
                        cleanup(timeoutId, intervalId);
                        resolve(result);
                    };
                    const handleFailure = (timeoutId, intervalId) => {
                        cleanup(timeoutId, intervalId);
                        resolve(null);
                    };
                    const checkNode = () => {
                        try {
                            let nodes;
                            if (type === 'node') {
                                nodes = document.querySelector(selector);
                                return nodes?.readyState >= 3 ? nodes : null;
                            }
                            if(dom){
                                nodes = dom.querySelectorAll(selector);
                                return nodes.length > 0 ? nodes : null;
                            }
                            nodes = document.querySelectorAll(selector);
                            return nodes.length > 0 ? nodes : null;
                        } catch (error) {
                            console.error('节点检查错误:', error);
                            reject('节点检查错误:', error)
                        }
                    };
                    const intervalId = setInterval(() => {
                        const result = checkNode();
                        if (result) {
                            handleSuccess(result, timeoutId, intervalId);
                        } else {
                            console.log(`等待节点: ${selector}...`);
                        }
                    }, 1000);
                    const timeoutId = setTimeout(() => {
                        console.error(`节点获取超时: ${selector}`);
                        handleFailure(timeoutId, intervalId);
                    }, timeout);
                });
            }
        }
        new Runner()
    }
}
// 广东教师教育网
class Gdedujsxx{
    constructor() {}
    run(config) {

        this.setupCoreFeatures(config);
    }
    setupCoreFeatures({refreshInterval}){
        class Runner {
            constructor() {
                this.runner = null
                this.run()
            }

            run() {
                const url = location.href;
                if (url.includes("study/course")) {
                    this.runner = new Course("channel-gdedu")
                }
            }
        }
        class Course {
            constructor(channel = "channel-my") {
                this.panel = new AuthWindow({
                    VIPBtnText:"高级功能-全自动挂机"
                })
                this.channel = channel
                this.VIP = false
                this.running = false
                this.init()
            }

            init() {
                this.panel.setOnVerifyCallback(async (data) => {
                    this.url = await Utils.validateCode(data)
                    if (this.url) {
                        this.panel.setTip(Utils.vipText)
                        this.VIP = true
                        return true
                    }
                })

                this.panel.setOnBegin(() => {
                    if (!this.running) {
                        this.running = true
                        console.log("运行时：", this.VIP)
                        this.run().then(r => {
                            this.running = false
                        })
                    }
                })
                this.panel.setOnVIP(async () => {
                    if (!this.url) {
                        await this.panel.handleVerify()
                    }
                    await this.runVIP()
                })
                this.loadVIPStatus()
                try {
                    Swal.fire({
                        title: "提示",
                        text: "脚本三秒后自动开始！",
                        icon: 'info',
                        timer: 3000,
                        confirmButtonText: '确定',
                        timerProgressBar: true,
                        willClose: () => {
                            if(!this.VIP){
                                Swal.fire({
                                    title: "提示",
                                    text: "当前是基础版！常速播放且前几个视频连播有效！",
                                    icon: 'info',
                                    timer: 10000,
                                    confirmButtonText: '确定',
                                    timerProgressBar: true,
                                })
                            }
                            this.panel.startAutomation()
                        }
                    });
                } catch (e) {
                    console.error(e)
                    this.panel.startAutomation()
                }
            }

            loadVIPStatus() {
                if (Utils.loadStatus()) {
                    this.panel.setTip(Utils.vipText)
                    this.VIP = true
                } else {
                    this.panel.setTip(Utils.baseText)
                    this.VIP = false
                }
                console.log("VIP:", this.VIP)
            }

            async runVIP() {
                try {
                    if (!this.VIP) {
                        Utils.showLinkSwal()
                        console.log("需要授权码！")
                        return
                    }
                    Swal.fire({
                        title: "高级功能已启用！",
                        text: "现在，脚本会自动挂机，2倍速！初次认证，请刷新页面！否则，下一个视频播放时生效",
                        icon: 'success',
                        confirmButtonText: '确定',
                        willClose: () => {

                        }
                    });
                } catch (error) {
                    console.error(error)
                    Swal.fire({
                        title: "高级功能执行失败！",
                        text: "若一直失败，请联系进行售后处理！",
                        icon: 'error',
                        confirmButtonText: '确定',
                        allowOutsideClick: false,
                        willClose: () => {
                            console.log(' 用户确认错误，脚本已停止');
                        }
                    });
                }
            }

            async run() {
                try{
                    const onlyTime = true
                    const catalogSelecter = '.section'

                    const catalog =await Utils.getStudyNode(catalogSelecter,'nodeList')
                    let first=true
                    let index='gd_edu_count'
                    for (let i = 0; i < catalog.length; i++) {
                        // 查找当前项
                        if(!catalog[i].className.includes('z-crt') && first){
                            continue
                        }
                        first=false
                        console.log(catalog[i].querySelector('span').innerText)

                        const status=await this.checkStatus()
                        if(status){
                            console.log("跳过当前视频")
                            goNext()
                            continue
                        }
                        // catalog[i].click()
                        const video=await Utils.getStudyNode('video',"node")
                        video.muted=true
                        video.volume = 0
                        video.currentTime=0
                        await video.play()
                        video.currentTime=0
                        if(this.VIP){
                            setInterval(()=>{
                                unsafeWindow.alert=()=>{}
                                unsafeWindow.interval=31
                                video.playbackRate=2
                            })
                        }
                        await this.waitForVideoEnd(video)
                        if(!this.VIP){
                            const num=GM_getValue(index,0)
                            if(num === 0){
                                GM_setValue(index,1)
                            }
                            if(num>1){
                                break
                            }
                            GM_setValue(index,num+1)
                        }
                        // catalog[i+1].click()
                        let timerId;
                        let userConfirmed = false;

                        const result = await Swal.fire({
                            title: "完成当前课程",
                            text: '5s后自动跳转下一个',
                            icon: 'success',
                            showCancelButton: true,
                            confirmButtonColor: "#FF4DAFFF",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            timer: 5000,
                            timerProgressBar: true,
                            allowOutsideClick: false, // 禁止点击蒙层关闭
                            allowEscapeKey: false,     // 禁止ESC关闭
                            didOpen: () => {
                                timerId = setTimeout(() => {
                                    if (!userConfirmed) {
                                        Swal.close();
                                    }
                                }, 5000)
                            }
                        });

                        clearTimeout(timerId);
                        // 仅当确认或超时时执行跳转
                        if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
                            goNext();
                        }else {
                            await sleep(10000000)
                        }
                    }
                    if(!this.VIP){
                        Swal.fire({
                            title: "失败",
                            text: '当前是基本版！只支持前几个视频自动！脚本已停止！仍需要请升级高级版！',
                            icon: 'error',
                            confirmButtonColor: "#FF4DAFFF",
                            confirmButtonText: "确定",
                        })
                    }else {
                        this.finish()
                    }
                }catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "失败",
                        text: e+'',
                        icon: 'error',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                    })
                }

            }
            sendMsg  (msg) {
                // 创建 BroadcastChannel
                const channel = new BroadcastChannel(this.channel);
                channel.postMessage(msg);
            }
            finish() {
                if (Swal) {
                    this.sendMsg('finish')
                    Swal.fire({
                        title: "学习完成！",
                        text: `学习完成！`,
                        icon: 'success',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                        timerProgressBar: true,
                        timer:0,
                        willClose: () => {

                        }
                    })
                    setTimeout(()=>{
                        window.close()
                    },10000)
                }
            }

            async waitForVideoEnd(video) {
                return new Promise(resolve => {
                    const checkInterval = setInterval(async () => {
                        try {
                            if (video && video.paused) {
                                console.log("视频暂停了，重新开始播放...");
                                await video.play();
                            }
                            if (!video.src) {
                                console.error("视频源未设置，即将重新加载");
                                setTimeout(() => {
                                    location.reload()
                                }, 5000)
                            }
                            try {
                                $('#questionDiv').stopTime('C');
                                $('.mylayer-closeico').trigger('click');
                                // console.log("答题窗口已自动关闭！")
                            }catch (e) {}

                            try {
                                const status=await this.checkStatus()
                                if(status){
                                    clearInterval(checkInterval)
                                    resolve()
                                }
                            }catch (e) {

                            }

                        } catch (e) {
                            console.error("checkInterval error:", e);
                            clearInterval(checkInterval);
                            setTimeout(() => {
                                location.reload()
                            }, 2000);
                        }
                    }, 3000);
                    video.addEventListener('ended', () => {
                        clearInterval(checkInterval);
                        resolve()

                    }, {once: true}); // 监听视频结束事件
                });
            }
            async checkStatus() {
                const dom=await Utils.getStudyNode('.g-study-dt', 'node');
                const time=document.querySelector('#viewTimeTxt')
                if(time){
                    const require=parseInt(dom.querySelector('span').innerText);
                    const current=parseInt(time.innerText);
                    if(current<require){
                        return false
                    }
                }
                return true
            }
        }
        class Utils {
            constructor() {
            }

            static flag = 'gd_edu_VIP'
            static vipText = '高级功能已启用！'
            static baseText = '您正在使用基础版本，功能可能存在限制'

            static loadStatus() {
                // return true
                try {
                    let VIP = GM_getValue(this.flag)
                    return !!VIP
                } catch (e) {
                    console.error(e)
                }
                return false
            }

            static async validateCode(data) {
                try {
                    console.log(data);
                    let info = document.querySelector('.name').innerText;
                    if (!info) {
                        throw new Error("无效的账号信息！")
                    }
                    data.bindInfo = info
                    data.website = "67bffd8ca7c4328611205df3"
                    console.log(data)
                    // return
                    const res = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            'url': "https://fc-mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.next.bspapp.com/validCodeFuncCas?" + new URLSearchParams(data),
                            method: 'GET',
                            onload: function (res) {
                                if (res.status === 200) {
                                    const result = JSON.parse(res.response)
                                    console.log(result)
                                    resolve(result)
                                }
                                reject('请求失败：' + res.response)
                            },
                            onerror: function (err) {
                                console.error(err)
                                reject('请求错误！' + err.toString())
                            }
                        })
                    })
                    if (res.code !== 200) {
                        GM_deleteValue(this.flag)
                        throw new Error('验证失败：' + res.data)
                    }
                    Swal.fire({
                        title: "高级功能已启用！",
                        text: "校验成功！",
                        icon: 'success',
                        confirmButtonText: '确定',
                    });
                    GM_setValue(this.flag, true)
                    return res.data
                } catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "验证失败！",
                        text: e.toString(),
                        icon: 'error',
                        confirmButtonText: '确定',
                    });
                }
            }


            static showLinkSwal() {
                const link = [
                    "https://68n.cn/IJ8QB",
                    "https://68n.cn/RM9ob",
                ]
                Swal.fire({
                    title: '<i class="fas fa-crown swal-vip-icon"></i> 高级功能解锁',
                    html: `
        <div class="vip-alert-content">
            <div class="alert-header">
                <h3>需要验证授权码才能使用</h3>
                <p class="version-tag">高级版</p>
            </div>
            
            <div class="requirements-box">
                <div class="requirement-item">
                    <span class="number-badge">1</span>
                    <p>需有效授权码激活高级功能模块</p>
                </div>
                <div class="requirement-item">
                    <span class="number-badge">2</span>
                    <p>当前账户权限：<span class="status-tag free-status">基础版</span></p>
                </div>
            </div>
 
            <div class="action-guide">
                <p>获取授权码步骤：</p>
                <ol class="step-list">
                    <li>点击前往以下链接，获取授权码</li>
                    <li><a href=${link[0]} class="pricing-link" target="_blank" ">获取授权码链接1</a></li>
                    <li><a href=${link[1]} class="pricing-link" target="_blank"">获取授权码链接2</a></li>
                </ol>
            </div>
        </div>
    `,
                    icon: 'info',
                    confirmButtonText: '前往激活',
                    showCloseButton: true,
                    timer: 30000,
                    customClass: {
                        popup: 'vip-alert-popup',
                        confirmButton: 'vip-confirm-btn'
                    },
                    willClose: () => {
                        // window.open(link[1])
                    }
                });
            }
            static async getStudyNode(selector, type = 'node', timeout = 10000) {
                return new Promise((resolve, reject) => {
                    if (!['node', 'nodeList'].includes(type)) {
                        console.error('Invalid type parameter. Expected "node" or "nodeList"');
                        reject('Invalid type parameter. Expected "node" or "nodeList"');
                    }
                    const cleanup = (timeoutId, intervalId) => {
                        clearTimeout(timeoutId);
                        clearInterval(intervalId);
                    };
                    const handleSuccess = (result, timeoutId, intervalId) => {
                        console.log(`${selector} ready!`);
                        cleanup(timeoutId, intervalId);
                        resolve(result);
                    };
                    const handleFailure = (timeoutId, intervalId) => {
                        cleanup(timeoutId, intervalId);
                        resolve(null);
                    };
                    const checkNode = () => {
                        try {
                            let nodes;
                            if (type === 'node') {
                                return document.querySelector(selector);
                            }
                            nodes = document.querySelectorAll(selector);
                            return nodes.length > 0 ? nodes : null;
                        } catch (error) {
                            console.error('节点检查错误:', error);
                            reject('节点检查错误:', error)
                        }
                    };
                    const intervalId = setInterval(() => {
                        const result = checkNode();
                        if (result) {
                            handleSuccess(result, timeoutId, intervalId);
                        } else {
                            console.log(`等待节点: ${selector}...`);
                        }
                    }, 1000);
                    const timeoutId = setTimeout(() => {
                        console.error(`节点获取超时: ${selector}`);
                        handleFailure(timeoutId, intervalId);
                    }, timeout);
                });
            }
        }
        new Runner()
    }
}
// 中山教师研修
class Zsjsjy{
    constructor() {}
    run(config) {
        this.setupCoreFeatures(config);
    }
    setupCoreFeatures({refreshInterval}){
        class Runner {
            constructor() {
                this.runner = null
                // this.init()
                this.initAjaxHooker()
                // this.initBeaconHooker()
                // this.initWsHooker()
                this.run()
                this.init()
            }

            initAjaxHooker() {
                // ajaxHooker.filter([
                //     // {type: 'xhr', url: 'www.example.com', method: 'GET', async: true},
                //     {url: "/videoPlay/takeRecordByToken"},
                // ]);
                ajaxHooker.hook(request => {
                    if (request.url.includes('/videoPlay/takeRecordByToken')) {
                        console.log("请求捕获：", request);
                        request.response = res => {
                            console.log(res);

                            // res.responseText += 'test';
                        };
                    } else if (request.url.includes('videoPlay/playEncrypt')) {
                        request.response = res => {
                            console.log("播放页：", res);
                            // res.responseText += 'test';
                        };
                    }
                });
                console.log("hooker:", ajaxHooker)
            }

            initBeaconHooker() {
                const origSendBeacon = unsafeWindow.navigator.sendBeacon;
                unsafeWindow.navigator.sendBeacon = function (url, data) {

                    return origSendBeacon.apply(this, arguments);
                };
            }
            initWsHooker(){
                class HijackedWebSocket extends WebSocket {
                    constructor(...args) {
                        super(...args);
                        this.overrideSend();
                    }

                    overrideSend() {
                        const originalSend = this.send;
                        this.send = function (...args) {
                            if (this.readyState === WebSocket.OPEN) {
                                if (args[0]?.length > 0) {
                                    console.log(args);
                                    console.log("【被劫持提交了】");
                                }
                            }
                            return originalSend.apply(this, args);
                        };
                    }
                }

// 替换全局 WebSocket
                unsafeWindow.WebSocket = HijackedWebSocket;
            }

            init() {
                unsafeWindow.addEventListener('message', (event) => {
                    // if (event.origin !== 'https://videoadmin.chinahrt.com') return;
                    if (event.data?.type === 'GET_LOCALSTORAGE') {
                        const bindInfo = localStorage.getItem('SESSIONTOKEN-151')
                        console.log("send msg:",bindInfo)
                        event.source.postMessage(
                            {
                                type: 'LOCALSTORAGE_DATA',
                                value: bindInfo
                            },
                            event.origin // 指定目标域为 iframe 的源
                        );
                    }
                });
                console.log("跨域通道已开启...")
            }

            run() {
                unsafeWindow.onload = () => {
                    const url = location.href;
                    if (url.includes("study.do")) {
                        this.runner = new Course("channel-zsjsjy")
                    } else if (url.includes("play_video")) {
                        this.init()
                    }
                }
            }
        }
        class Course {
            constructor(channel = "channel-my") {
                this.panel = new AuthWindow({
                    VIPBtnText: "高级功能-极速刷课"
                })
                this.channel = channel
                this.VIP = false
                this.running = false
                this.init()

            }

            init() {
                this.panel.setOnVerifyCallback(async (data) => {
                    this.url = await Utils.validateCode(data)
                    if (this.url) {
                        this.panel.setTip(Utils.vipText)
                        this.VIP = true
                        return true
                    }
                })

                this.panel.setOnBegin(() => {
                    if (!this.running) {
                        this.running = true
                        console.log("运行时：", this.VIP)
                        this.run().then(r => {
                            this.running = false
                        })
                    }
                })
                this.panel.setOnVIP(async () => {
                    // if (!this.url) {
                    //     await this.panel.handleVerify()
                    // }
                    await this.runVIP()
                })
                this.loadVIPStatus()
                try {
                    // Swal.fire({
                    //     title: "提示",
                    //     text: "脚本3s后自动开始",
                    //     icon: 'info',
                    //     timer: 3000,
                    //     confirmButtonText: '确定',
                    //     willClose: () => {
                    //         this.panel.startAutomation()
                    //     }
                    // });
                } catch (e) {
                    console.error(e)
                    // this.panel.startAutomation()
                }
            }


            loadVIPStatus() {
                if (Utils.loadStatus()) {
                    this.panel.setTip(Utils.vipText)
                    this.VIP = true
                } else {
                    this.panel.setTip(Utils.baseText)
                    this.VIP = false
                }
                console.log("VIP:", this.VIP)
            }

            async runVIP() {
                try {
                    if (!this.VIP) {
                        Utils.showLinkSwal()
                        console.log("需要授权码！")
                        return
                    }
                    if (window.VIPRunning) {
                        Swal.fire({
                            title: "课程正在刷取中，请等待！",
                            text: "等待或刷新页面重试！",
                            icon: 'info',
                            timerProgressBar: true,
                            confirmButtonText: '确定',
                            willClose: () => {
                            }
                        });
                        return
                    }
                    /* const confirmResult = await Swal.fire({
                         title: "提示",
                         html: `<div style="text-align:left">
                             <b>注意事项：</b>
                             <li>有概率触发反作弊机制导致失败：</li>
                             <li>多次刷取时，视频最后几分钟可能导致刷取失败！此时，需要休息一段时间，再次刷取！</li>
                             <li>若不休息片刻，会导致后续视频只能播放前30秒，继续播放可能需要刷新页面恢复</li>
                             <li></li>
                             <li>单次仅刷取10分钟</li>
                             <li>每次刷完后，不论成功失败，请刷新页面</li>
                            </div>`,
                         icon: 'warning',
                         showCancelButton: true,
                         cancelButtonText: '取消',
                         confirmButtonText: '继续',
                         allowOutsideClick: false,
                         focusCancel: true,
                         customClass: {
                             popup: 'risk-warning-popup',
                             htmlContainer: 'text-left'
                         }
                     });

                     if (!confirmResult.isConfirmed) {
                         return;
                     }*/
                    Swal.fire({
                        title: "已开始刷课，请等待提示刷课完成！",
                        text: "每1s，刷取60s，请耐心等待！",
                        icon: 'success',
                        confirmButtonText: '确定',
                        willClose: () => {
                        }
                    });
                    let jsCode = GM_getValue(Utils.jsFlag)
                    if (!jsCode) {
                        jsCode = await Utils.getJsCode(this.url)
                    }
                    eval(jsCode)
                    await window.VIP()
                    Swal.fire({
                        title: "已成功！",
                        text: "已刷完当前课程学时！请手动刷新查看结果",
                        icon: 'success',
                        confirmButtonText: '确定',
                        willClose: () => {
                            window.VIPRunning=false
                        }
                    });
                    setTimeout(() => {
                        // location.reload()
                    }, 5000)
                } catch (error) {
                    console.error(error)
                    Swal.fire({
                        title: "高级功能执行失败！",
                        text: "若一直失败，请联系进行售后处理！"+error,
                        icon: 'error',
                        confirmButtonText: '确定',
                        allowOutsideClick: false,
                        willClose: () => {
                            console.log(' 用户确认错误，脚本已停止');
                        }
                    });
                    window.VIPRunning=false
                }finally {

                }
            }

            async run() {
                try {
                    const catalogSelector='.m-chapter-ul .u-tt'
                    const catalogList=await Utils.getStudyNode(catalogSelector,'nodeList')
                    for (let i = 0; i < catalogList.length; i++) {
                        const catalog = catalogList[i];
                        const cataA=catalog.querySelector('a')
                        console.log(cataA.innerText)
                        const status=this.checkStatus(catalog)
                        if(status){
                            console.log("已学完，跳过！")
                            continue
                        }
                        cataA.click()
                        const video = await Utils.getStudyNode('video', "node")
                        video.muted = true
                        video.volume = 0
                        try {
                            ctxStudy.seekTime()
                        }catch (e) {
                        }
                        await video.play()
                        await this.waitForVideoEnd(video,catalog)
                    }

                    this.finish()
                } catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "失败",
                        text: e + '',
                        icon: 'error',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                    })
                }

            }

            sendMsg(msg) {
                // 创建 BroadcastChannel
                const channel = new BroadcastChannel(this.channel);
                channel.postMessage(msg);
            }

            finish() {
                if (Swal) {
                    // this.sendMsg('finish')
                    Swal.fire({
                        title: "学习完成！",
                        text: `学习完成，自动进行下一个！`,
                        icon: 'success',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                        timer: 10000,
                        willClose: () => {

                        }
                    })
                    setTimeout(() => {
                        window.close()
                    }, 10000)
                }
            }

            async waitForVideoEnd(video,dom) {
                return new Promise(resolve => {
                    const checkInterval = setInterval(async () => {
                        try {
                            if (video && video.paused) {
                                console.log("视频暂停了，重新开始播放...");
                                await video.play();
                            }
                            /*if (!video.src) {
                                console.error("视频源未设置，即将重新加载");
                                setTimeout(() => {
                                    location.reload()
                                }, 5000)
                            }*/
                            // if(dom){
                            //     const status=this.checkStatus(dom)
                            //     if(status){
                            //         clearInterval(checkInterval)
                            //         resolve()
                            //     }
                            // }

                        } catch (e) {
                            console.error("checkInterval error:", e);
                            clearInterval(checkInterval);
                            setTimeout(() => {
                                location.reload()
                            }, 2000);
                        }
                    }, 3000);
                    video.addEventListener('ended', () => {
                        clearInterval(checkInterval);
                        resolve()

                    }, {once: true}); // 监听视频结束事件
                });
            }

            checkStatus(dom) {
                const string = dom.querySelector('.u-state').innerText
                return string.includes("已完成")
            }
        }

        class Utils {
            constructor() {
            }

            static flag = 'zsjsjy_VIP'
            static jsFlag = 'zsjsjy_JsCode'
            static vipText = '高级功能已启用！'
            static baseText = '您正在使用基础版本，功能可能存在限制'

            static loadStatus() {
                try {
                    let VIP = GM_getValue(this.flag)
                    return !!VIP
                } catch (e) {
                    console.error(e)
                }
                return false
            }

            static async validateCode(data) {
                try {
                    let info = document.querySelector('.user span').innerText;
                    info=info+'_'+$("#userId").val()
                    if (!info) {
                        throw new Error("无效的账号信息！")
                    }
                    data.bindInfo = info
                    data.website = "67c2e8e08a5c78c37f094725"
                    console.log(data)
                    // return
                    const res = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            'url': "https://fc-mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.next.bspapp.com/validCodeFuncCas?" + new URLSearchParams(data),
                            method: 'GET',
                            onload: function (res) {
                                if (res.status === 200) {
                                    const result = JSON.parse(res.response)
                                    console.log(result)
                                    resolve(result)
                                }
                                reject('请求失败：' + res.response)
                            },
                            onerror: function (err) {
                                console.error(err)
                                reject('请求错误！' + err.toString())
                            }
                        })
                    })
                    if (res.code !== 200) {
                        GM_deleteValue(Utils.flag)
                        throw new Error('验证失败：' + res.data)
                    }
                    Swal.fire({
                        title: "高级功能已启用！",
                        text: "校验成功！",
                        icon: 'success',
                        confirmButtonText: '确定',
                    });
                    GM_setValue(Utils.flag, true)
                    return res.data
                } catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "验证失败！",
                        text: e.toString(),
                        icon: 'error',
                        confirmButtonText: '确定',
                    });
                }
            }

            static async getJsCode(url) {
                try {
                    let code = GM_getValue(Utils.jsFlag)
                    // console.log(code)
                    if (!code) {
                        const jsUrl = url
                        //获取js文件，然后在这里执行，然后获得结果
                        const jsCode = await new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                'url': jsUrl,
                                method: 'GET',
                                onload: function (res) {
                                    console.log(res)
                                    if (res.status === 200) {
                                        const result = (res.responseText)
                                        // console.log(result)
                                        resolve(result)
                                    } else {
                                        reject('服务器拒绝：' + res.response)
                                    }
                                },
                                onerror: function (err) {
                                    console.error(err)
                                    reject('请求错误！' + err.toString())
                                }
                            })
                        })
                        code = jsCode
                            .replace(/\\/g, '\\\\')
                            .replace(/'/g, '\'')
                            .replace(/"/g, '\"')
                        GM_setValue(Utils.jsFlag, code)
                    }
                    return code
                } catch (error) {
                    console.error('远程加载失败:', error);
                    throw new Error("远程加载失败")
                }
            }

            static showLinkSwal() {
                const link = [
                    "https://68n.cn/IJ8QB",
                    "https://68n.cn/RM9ob",
                ]
                Swal.fire({
                    title: '<i class="fas fa-crown swal-vip-icon"></i> 高级功能解锁',
                    html: `
        <div class="vip-alert-content">
            <div class="alert-header">
                <h3>需要验证授权码才能使用</h3>
                <p class="version-tag">高级版</p>
            </div>
            
            <div class="requirements-box">
                <div class="requirement-item">
                    <span class="number-badge">1</span>
                    <p>需有效授权码激活高级功能模块</p>
                </div>
                <div class="requirement-item">
                    <span class="number-badge">2</span>
                    <p>当前账户权限：<span class="status-tag free-status">基础版</span></p>
                </div>
            </div>
 
            <div class="action-guide">
                <p>获取授权码步骤：</p>
                <ol class="step-list">
                    <li>点击前往以下链接，获取授权码</li>
                    <li><a href=${link[0]} class="pricing-link" target="_blank" ">获取授权码链接1</a></li>
                    <li><a href=${link[1]} class="pricing-link" target="_blank"">获取授权码链接2</a></li>
                </ol>
            </div>
        </div>
    `,
                    icon: 'info',
                    confirmButtonText: '前往激活',
                    showCloseButton: true,
                    timer: 30000,
                    customClass: {
                        popup: 'vip-alert-popup',
                        confirmButton: 'vip-confirm-btn'
                    },
                    willClose: () => {
                        // window.open(link[1])
                    }
                });
            }

            static async getStudyNode(selector, type = 'node', timeout = 10000) {
                return new Promise((resolve, reject) => {
                    if (!['node', 'nodeList'].includes(type)) {
                        console.error('Invalid type parameter. Expected "node" or "nodeList"');
                        reject('Invalid type parameter. Expected "node" or "nodeList"');
                    }
                    const cleanup = (timeoutId, intervalId) => {
                        clearTimeout(timeoutId);
                        clearInterval(intervalId);
                    };
                    const handleSuccess = (result, timeoutId, intervalId) => {
                        console.log(`${selector} ready!`);
                        cleanup(timeoutId, intervalId);
                        resolve(result);
                    };
                    const handleFailure = (timeoutId, intervalId) => {
                        cleanup(timeoutId, intervalId);
                        resolve(null);
                    };
                    const checkNode = () => {
                        try {
                            let nodes;
                            if (type === 'node') {
                                nodes = document.querySelector(selector);
                                return nodes?.readyState >= 3 ? nodes : null;
                            }
                            nodes = document.querySelectorAll(selector);
                            return nodes.length > 0 ? nodes : null;
                        } catch (error) {
                            console.error('节点检查错误:', error);
                            reject('节点检查错误:', error)
                        }
                    };
                    const intervalId = setInterval(() => {
                        const result = checkNode();
                        if (result) {
                            handleSuccess(result, timeoutId, intervalId);
                        } else {
                            console.log(`等待节点: ${selector}...`);
                        }
                    }, 1000);
                    const timeoutId = setTimeout(() => {
                        console.error(`节点获取超时: ${selector}`);
                        handleFailure(timeoutId, intervalId);
                    }, timeout);
                });
            }
            static decodeJWT(token){
                const parts = token.split('.');
                // 第二部分是载荷（Payload）
                const payload = parts[1];
                // Base64Url 解码
                const decoded = atob(payload.replace(/-/g, '+').replace(/\_/g, '/'));
                // 转换为 JSON 对象
                return JSON.parse(decoded);
            }

        }
        new Runner()
    }
}
// 四川继续教育
class Sedu{
    constructor() {}
    run(config) {
        this.setupCoreFeatures(config);
    }
    setupCoreFeatures({refreshInterval}){
        class Runner {
            constructor() {
                this.runner = null
                // this.init()
                this.initAjaxHooker()
                this.initBeaconHooker()
                this.initWsHooker()
                this.run()
                this.init()

            }

            initAjaxHooker() {
                // ajaxHooker.filter([
                //     // {type: 'xhr', url: 'www.example.com', method: 'GET', async: true},
                //     {url: "/videoPlay/takeRecordByToken"},
                // ]);
                ajaxHooker.hook(request => {
                    if (request.url.includes('/videoPlay/takeRecordByToken')) {
                        console.log("请求捕获：", request);
                        request.response = res => {
                            console.log(res);

                            // res.responseText += 'test';
                        };
                    } else if (request.url.includes('videoPlay/playEncrypt')) {
                        request.response = res => {
                            console.log("播放页：", res);
                            // res.responseText += 'test';
                        };
                    }
                });
                console.log("hooker:", ajaxHooker)
            }

            initBeaconHooker() {
                const origSendBeacon = unsafeWindow.navigator.sendBeacon;
                unsafeWindow.navigator.sendBeacon = function (url, data) {

                    return origSendBeacon.apply(this, arguments);
                };
            }
            initWsHooker(){
                class HijackedWebSocket extends WebSocket {
                    constructor(...args) {
                        super(...args);
                        this.overrideSend();
                    }

                    overrideSend() {
                        const originalSend = this.send;
                        this.send = function (...args) {
                            if (this.readyState === WebSocket.OPEN) {
                                if (args[0]?.length > 0) {
                                    console.log(args);
                                    console.log("【被劫持提交了】");
                                }
                            }
                            return originalSend.apply(this, args);
                        };
                    }
                }

                unsafeWindow.WebSocket = HijackedWebSocket;
                console.log("开始劫持websocket..")
            }

            init() {
            }

            run() {
                const url = location.href;
                if (url.includes("trplayer")) {
                    this.runner = new Course("channel-sctce")
                } else if (url.includes("play_video")) {
                    this.init()
                }

            }
        }

        class Course {
            constructor(channel = "channel-my") {
                this.panel = new AuthWindow({
                    VIPBtnText: "高级功能-全自动无人值守"
                })
                this.channel = channel
                this.VIP = false
                this.running = false
                this.init()

            }

            init() {
                this.panel.setOnVerifyCallback(async (data) => {
                    this.url = await Utils.validateCode(data)
                    if (this.url) {
                        this.panel.setTip(Utils.vipText)
                        this.VIP = true
                        return true
                    }
                })

                this.panel.setOnBegin(() => {
                    if (!this.running) {
                        this.running = true
                        console.log("运行时：", this.VIP)
                        this.run().then(r => {
                            this.running = false
                        })
                    }
                })
                this.panel.setOnVIP(async () => {
                    if (!this.url) {
                        await this.panel.handleVerify()
                    }
                    await this.runVIP()
                })
                this.loadVIPStatus()
                try {
                    Swal.fire({
                        title: "提示",
                        text: "脚本3s后自动开始",
                        icon: 'info',
                        timer: 3000,
                        confirmButtonText: '确定',
                        willClose: () => {
                            this.panel.startAutomation()
                        }
                    });
                } catch (e) {
                    console.error(e)
                    this.panel.startAutomation()
                }
            }


            loadVIPStatus() {
                if (Utils.loadStatus()) {
                    this.panel.setTip(Utils.vipText)
                    this.VIP = true
                } else {
                    this.panel.setTip(Utils.baseText)
                    this.VIP = false
                }
                console.log("VIP:", this.VIP)
            }

            async runVIP() {
                try {
                    if (!this.VIP) {
                        Utils.showLinkSwal()
                        console.log("需要授权码！")
                        return
                    }
                    Swal.fire({
                        title: "高级功能已启用！",
                        text: "可自动挂完当前所有课程！",
                        icon: 'success',
                        confirmButtonText: '确定',
                        willClose: () => {

                        }
                    });
                    setTimeout(() => {
                        // location.reload()
                    }, 5000)
                } catch (error) {
                    console.error(error)
                    Swal.fire({
                        title: "高级功能执行失败！",
                        text: "若一直失败，请联系进行售后处理！",
                        icon: 'error',
                        confirmButtonText: '确定',
                        allowOutsideClick: false,
                        willClose: () => {
                            console.log(' 用户确认错误，脚本已停止');
                        }
                    });
                }finally {
                    window.VIPRunning=false
                }
            }

            async run() {
                try {
                    const catalogSelector='.video-item'
                    const catalogList=await Utils.getStudyNode(catalogSelector,'nodeList')
                    for (let i = 0; i < catalogList.length; i++) {
                        const catalog = catalogList[i];
                        console.log(catalog.querySelector('.video-title').innerText)
                        const status=this.checkStatus(catalog)
                        if(status){
                            console.log("已学完，跳过！")
                            continue
                        }
                        catalog.click()
                        const video = await Utils.getStudyNode('video', "node")
                        video.muted = true
                        video.volume = 0
                        video.currentTime=0
                        await video.play()
                        await this.waitForVideoEnd(video,catalog)
                        if(!this.VIP && i>2){
                            break
                        }
                    }
                    if(!this.VIP){
                        Swal.fire({
                            title: "当前是基础版，仅支持前三个课程自动播放",
                            text: '若需要全自动，请升级高级版！',
                            icon: 'error',
                            confirmButtonColor: "#FF4DAFFF",
                            confirmButtonText: "确定",
                            timer:0
                        })
                    }else {
                        this.finish()
                    }


                } catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "失败",
                        text: e + '',
                        icon: 'error',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                    })
                }

            }

            sendMsg(msg) {
                // 创建 BroadcastChannel
                const channel = new BroadcastChannel(this.channel);
                channel.postMessage(msg);
            }

            finish() {
                if (Swal) {
                    // this.sendMsg('finish')
                    Swal.fire({
                        title: "学习完成！",
                        text: `学习完成，自动进行下一个！`,
                        icon: 'success',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                        timer: 10000,
                        willClose: () => {

                        }
                    })
                    setTimeout(() => {
                        window.close()
                    }, 10000)
                }
            }

            async waitForVideoEnd(video,dom) {
                return new Promise(resolve => {
                    const checkInterval = setInterval(async () => {
                        try {
                            if (video && video.paused) {
                                console.log("视频暂停了，重新开始播放...");
                                await video.play();
                            }
                            /*if (!video.src) {
                                console.error("视频源未设置，即将重新加载");
                                setTimeout(() => {
                                    location.reload()
                                }, 5000)
                            }*/
                            if(dom){
                                const status=this.checkStatus(dom)
                                if(status){
                                    clearInterval(checkInterval)
                                    resolve()
                                }
                            }

                        } catch (e) {
                            console.error("checkInterval error:", e);
                            clearInterval(checkInterval);
                            setTimeout(() => {
                                location.reload()
                            }, 2000);
                        }
                    }, 3000);
                    video.addEventListener('ended', () => {
                        clearInterval(checkInterval);
                        resolve()

                    }, {once: true}); // 监听视频结束事件
                });
            }

            checkStatus(dom) {
                const string = dom.querySelector('.font12').innerText
                return string.includes("100.00%")
            }
        }

        class Utils {
            constructor() {
            }

            static flag = 'sctce_VIP'
            static jsFlag = 'sctce_JsCode'
            static vipText = '高级功能已启用！'
            static baseText = '您正在使用基础版本，功能可能存在限制'

            static loadStatus() {
                try {
                    let VIP = GM_getValue(this.flag)
                    return !!VIP
                } catch (e) {
                    console.error(e)
                }
                return false
            }

            static async validateCode(data) {
                try {
                    let info = JSON.parse(sessionStorage.getItem('player-url-params'))
                    if (!info) {
                        throw new Error("无效的账号信息！")
                    }
                    data.bindInfo = "userId_"+info.userId
                    data.website = "67c2ec264b9247cc12af1a63"
                    console.log(data)
                    // return
                    const res = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            'url': "https://fc-mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.next.bspapp.com/validCodeFuncCas?" + new URLSearchParams(data),
                            method: 'GET',
                            onload: function (res) {
                                if (res.status === 200) {
                                    const result = JSON.parse(res.response)
                                    console.log(result)
                                    resolve(result)
                                }
                                reject('请求失败：' + res.response)
                            },
                            onerror: function (err) {
                                console.error(err)
                                reject('请求错误！' + err.toString())
                            }
                        })
                    })
                    if (res.code !== 200) {
                        GM_deleteValue(Utils.flag)
                        throw new Error('验证失败：' + res.data)
                    }
                    Swal.fire({
                        title: "高级功能已启用！",
                        text: "校验成功！",
                        icon: 'success',
                        confirmButtonText: '确定',
                    });
                    GM_setValue(Utils.flag, true)
                    return res.data
                } catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "验证失败！",
                        text: e.toString(),
                        icon: 'error',
                        confirmButtonText: '确定',
                    });
                }
            }

            static async getJsCode(url) {
                try {
                    let code = GM_getValue(Utils.jsFlag)
                    // console.log(code)
                    if (!code) {
                        const jsUrl = url
                        //获取js文件，然后在这里执行，然后获得结果
                        const jsCode = await new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                'url': jsUrl,
                                method: 'GET',
                                onload: function (res) {
                                    console.log(res)
                                    if (res.status === 200) {
                                        const result = (res.responseText)
                                        // console.log(result)
                                        resolve(result)
                                    } else {
                                        reject('服务器拒绝：' + res.response)
                                    }
                                },
                                onerror: function (err) {
                                    console.error(err)
                                    reject('请求错误！' + err.toString())
                                }
                            })
                        })
                        code = jsCode
                            .replace(/\\/g, '\\\\')
                            .replace(/'/g, '\'')
                            .replace(/"/g, '\"')
                        GM_setValue(Utils.jsFlag, code)
                    }
                    return code
                } catch (error) {
                    console.error('远程加载失败:', error);
                    throw new Error("远程加载失败")
                }
            }

            static showLinkSwal() {
                const link = [
                    "https://68n.cn/IJ8QB",
                    "https://68n.cn/RM9ob",
                ]
                Swal.fire({
                    title: '<i class="fas fa-crown swal-vip-icon"></i> 高级功能解锁',
                    html: `
        <div class="vip-alert-content">
            <div class="alert-header">
                <h3>需要验证授权码才能使用</h3>
                <p class="version-tag">高级版</p>
            </div>
            
            <div class="requirements-box">
                <div class="requirement-item">
                    <span class="number-badge">1</span>
                    <p>需有效授权码激活高级功能模块</p>
                </div>
                <div class="requirement-item">
                    <span class="number-badge">2</span>
                    <p>当前账户权限：<span class="status-tag free-status">基础版</span></p>
                </div>
            </div>
 
            <div class="action-guide">
                <p>获取授权码步骤：</p>
                <ol class="step-list">
                    <li>点击前往以下链接，获取授权码</li>
                    <li><a href=${link[0]} class="pricing-link" target="_blank" ">获取授权码链接1</a></li>
                    <li><a href=${link[1]} class="pricing-link" target="_blank"">获取授权码链接2</a></li>
                </ol>
            </div>
        </div>
    `,
                    icon: 'info',
                    confirmButtonText: '前往激活',
                    showCloseButton: true,
                    timer: 30000,
                    customClass: {
                        popup: 'vip-alert-popup',
                        confirmButton: 'vip-confirm-btn'
                    },
                    willClose: () => {
                        // window.open(link[1])
                    }
                });
            }

            static async getStudyNode(selector, type = 'node', timeout = 10000) {
                return new Promise((resolve, reject) => {
                    if (!['node', 'nodeList'].includes(type)) {
                        console.error('Invalid type parameter. Expected "node" or "nodeList"');
                        reject('Invalid type parameter. Expected "node" or "nodeList"');
                    }
                    const cleanup = (timeoutId, intervalId) => {
                        clearTimeout(timeoutId);
                        clearInterval(intervalId);
                    };
                    const handleSuccess = (result, timeoutId, intervalId) => {
                        console.log(`${selector} ready!`);
                        cleanup(timeoutId, intervalId);
                        resolve(result);
                    };
                    const handleFailure = (timeoutId, intervalId) => {
                        cleanup(timeoutId, intervalId);
                        resolve(null);
                    };
                    const checkNode = () => {
                        try {
                            let nodes;
                            if (type === 'node') {
                                nodes = document.querySelector(selector);
                                return nodes?.readyState >= 3 ? nodes : null;
                            }
                            nodes = document.querySelectorAll(selector);
                            return nodes.length > 0 ? nodes : null;
                        } catch (error) {
                            console.error('节点检查错误:', error);
                            reject('节点检查错误:', error)
                        }
                    };
                    const intervalId = setInterval(() => {
                        const result = checkNode();
                        if (result) {
                            handleSuccess(result, timeoutId, intervalId);
                        } else {
                            console.log(`等待节点: ${selector}...`);
                        }
                    }, 1000);
                    const timeoutId = setTimeout(() => {
                        console.error(`节点获取超时: ${selector}`);
                        handleFailure(timeoutId, intervalId);
                    }, timeout);
                });
            }
            static decodeJWT(token){
                const parts = token.split('.');
                // 第二部分是载荷（Payload）
                const payload = parts[1];
                // Base64Url 解码
                const decoded = atob(payload.replace(/-/g, '+').replace(/\_/g, '/'));
                // 转换为 JSON 对象
                return JSON.parse(decoded);
            }

        }
        new Runner()
    }
}
// 希沃学苑
class Seewo{
    constructor() {}
    run(config) {

        this.setupCoreFeatures(config);
    }
    setupCoreFeatures({refreshInterval}){
        class Runner {
            constructor() {
                this.runner = null
                // this.init()
                this.initAjaxHooker()
                this.run()
                this.init()
            }
            initAjaxHooker() {
                // ajaxHooker.filter([
                //     // {type: 'xhr', url: 'www.example.com', method: 'GET', async: true},
                //     {url: "/videoPlay/takeRecordByToken"},
                // ]);
                ajaxHooker.hook(request => {
                    if (request.url.includes('/videoPlay/takeRecordByToken')) {
                        console.log("请求捕获：", request);
                        request.response = res => {
                            console.log(res);

                            // res.responseText += 'test';
                        };
                    } else if (request.url.includes('videoPlay/playEncrypt')) {
                        request.response = res => {
                            console.log("播放页：", res);
                            // res.responseText += 'test';
                        };
                    }
                });
                console.log("hooker:", ajaxHooker)
            }

            init() {
            }

            run() {
                unsafeWindow.onload = () => {
                    const url = location.href;
                    if (url.includes("tCourse")) {
                        this.runner = new Course("channel-seewo")
                    }else if (url.includes("cvte.com")) {
                        this.runner = new Exam("channel-seewo")
                    }
                }
            }
        }
        class Course {
            constructor(channel = "channel-my") {
                this.panel = new AuthWindow({
                    VIPBtnText: "高级功能-极速刷课"
                })
                this.channel = channel
                this.VIP = false
                this.running = false
                this.init()
                this.initCross()
                this.initGetLocal()
            }

            init() {
                this.panel.setOnVerifyCallback(async (data) => {
                    this.url = await Utils.validateCode(data)
                    if (this.url) {
                        this.panel.setTip(Utils.vipText)
                        this.VIP = true
                        return true
                    }
                })

                this.panel.setOnBegin(() => {
                    if (!this.running) {
                        this.running = true
                        console.log("运行时：", this.VIP)
                        this.run().then(r => {
                            this.running = false
                        })
                    }
                })
                this.panel.setOnVIP(async () => {
                    if (!this.url) {
                        await this.panel.handleVerify()
                    }
                    await this.runVIP()
                })
                this.loadVIPStatus()
                try {
                    Swal.fire({
                        title: "提示",
                        text: "请手动点击开始",
                        icon: 'info',
                        timer: 3000,
                        confirmButtonText: '确定',
                        willClose: () => {
                            // this.panel.startAutomation()
                        }
                    });
                } catch (e) {
                    console.error(e)
                    // this.panel.startAutomation()
                }
            }

            initGetLocal() {
                unsafeWindow.addEventListener('message', (event) => {
                    // if (event.origin !== 'https://gp.chinahrt.com') return;
                    if (event.data?.type === 'LOCALSTORAGE_DATA') {
                        console.log('Received:', event.data.value);
                        window.bindInfo = event.data.value
                    }
                });
                unsafeWindow.parent.postMessage(
                    {
                        type: 'GET_LOCALSTORAGE',
                        key: 'bindInfo'
                    },
                    'https://edu.chinahrt.com'
                );
            }

            initCross() {
                try {
                    const iframeWindow = unsafeWindow

                    // 重写Function构造函数
                    // const originalFunction = iframeWindow.Function.prototype.constructor;
                    // iframeWindow.Function.prototype.constructor = function (...args) {
                    //     if (args.length > 0 && typeof args[0] === 'string' && args[0].includes('debugger')) {
                    //         console.log("111")
                    //         return function () {
                    //         }; // 替换包含debugger的代码为空函数
                    //     }
                    //     return originalFunction.apply(this, args);
                    // };
                    // 覆盖check函数
                    const oldConstructor = Function.prototype.constructor;
                    Function.prototype.constructor = function (...args) {
                        if (args[0] === 'debugger') {
                            // 直接返回空函数阻止debugger执行
                            return function () {
                            };
                        }
                        return oldConstructor.apply(this, args);
                    };
                    iframeWindow.check = function () {
                    };

                    console.log('反调试绕过成功！');
                    // Swal.fire({
                    //     title: "反调试绕过成功！",
                    //     text: iframeWindow.check.toString(),
                    //     icon: 'success',
                    //     confirmButtonColor: "#FF4DAFFF",
                    //     confirmButtonText: "关闭"
                    // }).then(() => {
                    //
                    // });
                } catch (err) {
                    console.error('绕过失败：', err);
                }
            }

            loadVIPStatus() {
                if (Utils.loadStatus()) {
                    this.panel.setTip(Utils.vipText)
                    this.VIP = true
                } else {
                    this.panel.setTip(Utils.baseText)
                    this.VIP = false
                }
                console.log("VIP:", this.VIP)
            }

            async runVIP() {
                try {
                    if (!this.VIP) {
                        Utils.showLinkSwal()
                        console.log("需要授权码！")
                        return
                    }
                    if (window.VIPRunning) {
                        Swal.fire({
                            title: "课程正在刷取中，请等待！",
                            text: "等待或刷新页面重试！",
                            icon: 'info',
                            confirmButtonText: '确定',
                            willClose: () => {
                            }
                        });
                        return
                    }

                    Swal.fire({
                        title: "已开始刷课，请等待提示刷课完成！",
                        text: "每1s，刷取30s，请耐心等待！",
                        icon: 'success',
                        confirmButtonText: '确定',
                        willClose: () => {
                        }
                    });
                    let jsCode = GM_getValue(Utils.jsFlag)
                    if (!jsCode) {
                        jsCode = await Utils.getJsCode(this.url)
                    }
                    eval(jsCode)
                    await window.VIP()
                    Swal.fire({
                        title: "已成功！",
                        text: "已刷完当前课程学时！请手动刷新后，再次播放此视频！",
                        icon: 'success',
                        confirmButtonText: '确定',
                        timer:0,
                        willClose: () => {
                            window.VIPRunning=false
                        }
                    });
                    setTimeout(() => {
                        // location.reload()
                    }, 5000)
                } catch (error) {
                    console.error(error)
                    Swal.fire({
                        title: "高级功能执行失败！",
                        text: "若一直失败，请联系进行售后处理！",
                        icon: 'error',
                        confirmButtonText: '确定',
                        allowOutsideClick: false,
                        willClose: () => {
                            window.VIPRunning=false
                        }
                    });
                }finally {

                }
            }

            async run() {
                try {
                    const catalogSelector='.resource___ZLxlm'
                    const catalogList=await Utils.getStudyNode(catalogSelector,'nodeList')
                    for (let i = 0; i < catalogList.length; i++) {
                        const catalog = catalogList[i];
                        console.log(catalog.querySelector('.name___lB9cB').innerText)
                        const status=this.checkStatus(catalog)
                        if(status){
                            console.log("已学完，跳过！")
                            continue
                        }
                        catalog.click()
                        const type=this.checkType(catalog)
                        if(type){
                            // 考试
                            console.log("考试")
                            await sleep(2000)
                            continue
                        }
                        const video = await Utils.getStudyNode('video', "node")
                        video.muted = true
                        video.volume = 0
                        video.currentTime=0
                        await video.play()
                        await this.waitForVideoEnd(video,catalog)
                        if(!this.VIP && i>2){
                            break
                        }
                    }
                    if(!this.VIP){
                        Swal.fire({
                            title: "当前是基础版，仅支持前三个课程自动播放",
                            text: '若需要全自动，请升级高级版！',
                            icon: 'error',
                            confirmButtonColor: "#FF4DAFFF",
                            confirmButtonText: "确定",
                            timer:0
                        })
                    }else {
                        this.finish()
                    }
                } catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "失败",
                        text: e + '',
                        icon: 'error',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                    })
                }

            }

            sendMsg(msg) {
                // 创建 BroadcastChannel
                const channel = new BroadcastChannel(this.channel);
                channel.postMessage(msg);
            }

            finish() {
                if (Swal) {
                    // this.sendMsg('finish')
                    Swal.fire({
                        title: "学习完成！",
                        text: `学习完成，自动进行下一个！`,
                        icon: 'success',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                        timer: 10000,
                        willClose: () => {

                        }
                    })
                    setTimeout(() => {
                        window.close()
                    }, 10000)
                }
            }

            async waitForVideoEnd(video) {
                return new Promise(resolve => {
                    const checkInterval = setInterval(async () => {
                        try {
                            if (video && video.paused) {
                                console.log("视频暂停了，重新开始播放...");
                                await video.play();
                            }
                            /*if (!video.src) {
                                console.error("视频源未设置，即将重新加载");
                                setTimeout(() => {
                                    location.reload()
                                }, 5000)
                            }*/

                        } catch (e) {
                            console.error("checkInterval error:", e);
                            clearInterval(checkInterval);
                            setTimeout(() => {
                                location.reload()
                            }, 2000);
                        }
                    }, 3000);
                    video.addEventListener('ended', () => {
                        clearInterval(checkInterval);
                        resolve()

                    }, {once: true}); // 监听视频结束事件
                });
            }

            checkStatus(dom) {
                const string = dom.querySelector('.state___IVT6G').innerText
                return string === "已完成"
            }
            checkType(dom) {
                return dom.querySelector('button')
            }
        }
        class Exam{
            constructor(channel = "channel-my") {
                this.panel = new AuthWindow({
                    VIPBtnText: "高级功能-自动答题",

                })
                this.channel = channel
                this.VIP = false
                this.running = false
                this.init()
                this.answerMap=new Map()
            }
            init() {
                this.panel.setOnVerifyCallback(async (data) => {
                    this.url = await Utils.validateCode(data)
                    if (this.url) {
                        this.panel.setTip(Utils.vipText)
                        this.VIP = true
                        return true
                    }
                })

                this.panel.setOnBegin(() => {
                    if (!this.running) {
                        this.running = true
                        console.log("运行时：", this.VIP)
                        this.run().then(r => {
                            this.running = false
                        })
                    }
                })
                this.panel.setOnVIP(async () => {
                    // if (!this.url) {
                    //     await this.panel.handleVerify()
                    // }
                    await this.runVIP()
                })
                this.loadVIPStatus()
                try {
                    // Swal.fire({
                    //     title: "提示",
                    //     text: "请手动点击开始",
                    //     icon: 'info',
                    //     timer: 3000,
                    //     confirmButtonText: '确定',
                    //     willClose: () => {
                    //         // this.panel.startAutomation()
                    //     }
                    // });
                } catch (e) {
                    console.error(e)
                    // this.panel.startAutomation()
                }
            }
            resolveUrl(){
                const id=new URL(location.href).pathname.split('/')[1]
                if(!id){
                    throw Error('未获取到考试邀请ID！')
                }
                return "https://cpb-m.cvte.com/"+id+"/result?isLast=1"
            }
            fetchPage(url) {
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        headers: {
                            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                            "cache-control": "no-cache",
                            "pragma": "no-cache",
                            "priority": "u=0, i",
                            "sec-ch-ua": "Not(A:Brand;v=99, Microsoft Edge;v=133, Chromium;v=133",
                            "sec-ch-ua-mobile": "?0",
                            "sec-ch-ua-platform": "Windows",
                            "sec-fetch-dest": "document",
                            "sec-fetch-mode": "navigate",
                            "sec-fetch-site": "none",
                            "sec-fetch-user": "?1",
                            "upgrade-insecure-requests": "1"
                        },
                        onload: (res) => {
                            if (res.status >= 200 && res.status < 300) {
                                resolve(res.responseText);
                            } else {
                                reject("HTTP错误: "+res.status);
                            }
                        },
                        onerror: (err) => reject(err)
                    });
                });
            }
            parseInitialState(html) {
                // 方法1：正则提取
                const regex = /window\.__INITIAL_STATE__\s*=\s*({.*?});/s;
                const match = html.match(regex);

                // 方法2：DOM解析（备用方案）
                if (!match) {
                    const scriptContent = $('script:contains("window.__INITIAL_STATE__")').html();
                    const start = scriptContent.indexOf('{');
                    const end = scriptContent.lastIndexOf('}') + 1;
                    const jsonStr = scriptContent.slice(start, end);
                    return JSON.parse(jsonStr);
                }

                return JSON.parse(match[1]);
            }
            async runVIP() {
                try {
                    if (!this.VIP) {
                        Utils.showLinkSwal()
                        console.log("需要授权码！")
                        return
                    }
                    if (window.VIPRunning) {
                        Swal.fire({
                            title: "正在答题中，请等待！",
                            text: "等待或刷新页面重试！",
                            icon: 'info',
                            confirmButtonText: '确定',
                            willClose: () => {
                            }
                        });
                        return
                    }
                    window.VIPRunning=true
                    const url=this.resolveUrl()
                    const html = await this.fetchPage(url);
                    const answers=this.parseInitialState(html).answers;
                    // console.log(answers);
                    answers.forEach(answer => {
                        const correctIds=[]
                        const correctContent=[]
                        answer.options.forEach(option => {
                            if(option.isCorrect){
                                correctIds.push(option.id);
                                correctContent.push(new DOMParser().parseFromString(option.content, 'text/html').body.textContent);
                            }
                        })
                        this.answerMap.set(answer.qnId, {
                            correctIds,
                            correctContent
                        });
                    })
                    const qnsList=document.querySelectorAll('.qn-container')
                    for(let i=0;i<qnsList.length;i++){
                        const qns=qnsList[i].querySelector('[id]')
                        if (qns) {
                            const qnId = qns.id;
                            console.log(' 题目ID:', qnId);
                            if(this.answerMap.has(qnId)){
                                const answers=this.answerMap.get(qnId)
                                console.log("answers:",answers)
                                const options = qns.querySelectorAll('.options-container  .html-content p');
                                console.log("options:",options)
                                for (const option of options) {
                                    const optionText = option.innerHTML
                                    if (answers.correctContent.some(correctText  => {
                                        // 统一去除HTML标签后再比较（避免标签差异）
                                        // const cleanCorrectText = correctText.replace(/<[^>]+>/g,  '').trim();
                                        return optionText === correctText;
                                    })) {
                                        /*const mouseEvent = new MouseEvent('click', {
                                            bubbles: true,
                                            cancelable: true,
                                            view: unsafeWindow
                                        });
                                        option.dispatchEvent(mouseEvent);*/
                                        option.click()
                                        await sleep(300)
                                        console.log("匹配：",optionText)
                                    }
                                }

                            }
                        } else {
                            console.error(' 未找到带ID的元素');
                        }
                    }
                    document.querySelector('.btn').click()
                    Swal.fire({
                        title: "已自动完成答题！",
                        text: "已自动完成！",
                        icon: 'success',
                        confirmButtonText: '确定',
                        timer:0,
                        willClose: () => {
                            window.VIPRunning=false
                        }
                    });
                    setTimeout(() => {
                        // location.reload()
                    }, 5000)
                } catch (error) {
                    console.error(error)
                    Swal.fire({
                        title: "高级功能执行失败！",
                        text: "若一直失败，请联系进行售后处理！",
                        icon: 'error',
                        confirmButtonText: '确定',
                        allowOutsideClick: false,
                        willClose: () => {
                            window.VIPRunning=false
                        }
                    });
                }finally {

                }
            }
            loadVIPStatus() {
                if (Utils.loadStatus()) {
                    this.panel.setTip(Utils.vipText)
                    this.VIP = true
                } else {
                    this.panel.setTip(Utils.baseText)
                    this.VIP = false
                }
                console.log("VIP:", this.VIP)
            }
            run(){
                Swal.fire({
                    title: "请使用高级功能完成考试！",
                    text: "请使用高级功能！",
                    icon: 'info',
                    confirmButtonText: '确定',
                    willClose: () => {
                    }
                });
            }
        }
        class Utils {
            constructor() {
            }

            static flag = 'seewo_VIP'
            static jsFlag = 'seewo_JsCode'
            static vipText = '高级功能已启用！'
            static baseText = '您正在使用基础版本，功能可能存在限制'

            static loadStatus() {
                try {
                    let VIP = GM_getValue(this.flag)
                    return !!VIP
                } catch (e) {
                    console.error(e)
                }
                return false
            }

            static async validateCode(data) {
                try {
                    let info = this.getCookie('userId')
                    if (!info) {
                        throw new Error("无效的账号信息！")
                    }
                    data.bindInfo = "userId_"+info
                    data.website = "67c4358eeef9cbda9cf60fec"
                    console.log(data)
                    // return
                    const res = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            'url': "https://fc-mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.next.bspapp.com/validCodeFuncCas?" + new URLSearchParams(data),
                            method: 'GET',
                            onload: function (res) {
                                if (res.status === 200) {
                                    const result = JSON.parse(res.response)
                                    console.log(result)
                                    resolve(result)
                                }
                                reject('请求失败：' + res.response)
                            },
                            onerror: function (err) {
                                console.error(err)
                                reject('请求错误！' + err.toString())
                            }
                        })
                    })
                    if (res.code !== 200) {
                        GM_deleteValue(Utils.flag)
                        throw new Error('验证失败：' + res.data)
                    }
                    Swal.fire({
                        title: "高级功能已启用！",
                        text: "校验成功！",
                        icon: 'success',
                        confirmButtonText: '确定',
                    });
                    GM_setValue(Utils.flag, true)
                    return res.data
                } catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "验证失败！",
                        text: e.toString(),
                        icon: 'error',
                        confirmButtonText: '确定',
                    });
                }
            }

            static async getJsCode(url) {
                try {
                    let code = GM_getValue(Utils.jsFlag)
                    // console.log(code)
                    if (!code) {
                        const jsUrl = url
                        //获取js文件，然后在这里执行，然后获得结果
                        const jsCode = await new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                'url': jsUrl,
                                method: 'GET',
                                onload: function (res) {
                                    console.log(res)
                                    if (res.status === 200) {
                                        const result = (res.responseText)
                                        // console.log(result)
                                        resolve(result)
                                    } else {
                                        reject('服务器拒绝：' + res.response)
                                    }
                                },
                                onerror: function (err) {
                                    console.error(err)
                                    reject('请求错误！' + err.toString())
                                }
                            })
                        })
                        code = jsCode
                            .replace(/\\/g, '\\\\')
                            .replace(/'/g, '\'')
                            .replace(/"/g, '\"')
                        GM_setValue(Utils.jsFlag, code)
                    }
                    return code
                } catch (error) {
                    console.error('远程加载失败:', error);
                    throw new Error("远程加载失败")
                }
            }

            static showLinkSwal() {
                const link = [
                    "https://68n.cn/IJ8QB",
                    "https://68n.cn/RM9ob",
                ]
                Swal.fire({
                    title: '<i class="fas fa-crown swal-vip-icon"></i> 高级功能解锁',
                    html: `
        <div class="vip-alert-content">
            <div class="alert-header">
                <h3>需要验证授权码才能使用</h3>
                <p class="version-tag">高级版</p>
            </div>
            
            <div class="requirements-box">
                <div class="requirement-item">
                    <span class="number-badge">1</span>
                    <p>需有效授权码激活高级功能模块</p>
                </div>
                <div class="requirement-item">
                    <span class="number-badge">2</span>
                    <p>当前账户权限：<span class="status-tag free-status">基础版</span></p>
                </div>
            </div>
 
            <div class="action-guide">
                <p>获取授权码步骤：</p>
                <ol class="step-list">
                    <li>点击前往以下链接，获取授权码</li>
                    <li><a href=${link[0]} class="pricing-link" target="_blank" ">获取授权码链接1</a></li>
                    <li><a href=${link[1]} class="pricing-link" target="_blank"">获取授权码链接2</a></li>
                </ol>
            </div>
        </div>
    `,
                    icon: 'info',
                    confirmButtonText: '前往激活',
                    showCloseButton: true,
                    timer: 30000,
                    customClass: {
                        popup: 'vip-alert-popup',
                        confirmButton: 'vip-confirm-btn'
                    },
                    willClose: () => {
                        // window.open(link[1])
                    }
                });
            }

            static async getStudyNode(selector, type = 'node', timeout = 10000) {
                return new Promise((resolve, reject) => {
                    if (!['node', 'nodeList'].includes(type)) {
                        console.error('Invalid type parameter. Expected "node" or "nodeList"');
                        reject('Invalid type parameter. Expected "node" or "nodeList"');
                    }
                    const cleanup = (timeoutId, intervalId) => {
                        clearTimeout(timeoutId);
                        clearInterval(intervalId);
                    };
                    const handleSuccess = (result, timeoutId, intervalId) => {
                        console.log(`${selector} ready!`);
                        cleanup(timeoutId, intervalId);
                        resolve(result);
                    };
                    const handleFailure = (timeoutId, intervalId) => {
                        cleanup(timeoutId, intervalId);
                        resolve(null);
                    };
                    const checkNode = () => {
                        try {
                            let nodes;
                            if (type === 'node') {
                                nodes = document.querySelector(selector);
                                return nodes?.readyState >= 3 ? nodes : null;
                            }
                            nodes = document.querySelectorAll(selector);
                            return nodes.length > 0 ? nodes : null;
                        } catch (error) {
                            console.error('节点检查错误:', error);
                            reject('节点检查错误:', error)
                        }
                    };
                    const intervalId = setInterval(() => {
                        const result = checkNode();
                        if (result) {
                            handleSuccess(result, timeoutId, intervalId);
                        } else {
                            console.log(`等待节点: ${selector}...`);
                        }
                    }, 1000);
                    const timeoutId = setTimeout(() => {
                        console.error(`节点获取超时: ${selector}`);
                        handleFailure(timeoutId, intervalId);
                    }, timeout);
                });
            }
            static decodeJWT(token){
                const parts = token.split('.');
                // 第二部分是载荷（Payload）
                const payload = parts[1];
                // Base64Url 解码
                const decoded = atob(payload.replace(/-/g, '+').replace(/\_/g, '/'));
                // 转换为 JSON 对象
                return JSON.parse(decoded);
            }
            static getCookie(name) {
                const cookies = document.cookie.split('; ');
                for (const cookie of cookies) {
                    const [cookieName, cookieValue] = cookie.split('=');
                    if (cookieName === name) {
                        return decodeURIComponent(cookieValue);
                    }
                }
                return null;
            }

        }

        new Runner()
    }
}
// 名师课堂
class Mingshiclass{
    constructor() {}
    run(config) {

        this.setupCoreFeatures(config);
    }
    setupCoreFeatures({refreshInterval}){
        class Runner {
            constructor() {
                this.runner = null
                // this.init()
                this.initAjaxHooker()
                this.initBeaconHooker()
                this.run()
                this.init()
            }

            initAjaxHooker() {
                // ajaxHooker.filter([
                //     // {type: 'xhr', url: 'www.example.com', method: 'GET', async: true},
                //     {url: "/videoPlay/takeRecordByToken"},
                // ]);
                ajaxHooker.hook(request => {
                    if (request.url.includes('/videoPlay/takeRecordByToken')) {
                        console.log("请求捕获：", request);
                        request.response = res => {
                            console.log(res);

                            // res.responseText += 'test';
                        };
                    } else if (request.url.includes('videoPlay/playEncrypt')) {
                        request.response = res => {
                            console.log("播放页：", res);
                            // res.responseText += 'test';
                        };
                    }
                });
                console.log("hooker:", ajaxHooker)
            }

            initBeaconHooker() {
                const origSendBeacon = unsafeWindow.navigator.sendBeacon;
                unsafeWindow.navigator.sendBeacon = function (url, data) {
                    if (url.includes('/videoPlay/takeRecordByToken')) {
                        try {
                            const payload = JSON.parse(data);
                            console.log('捕获到 Beacon 请求:', payload);
                            window.token=payload.token
                            // window.capturedToken = payload.token;
                            // window.lastBeaconData = payload;

                            // const newData = JSON.stringify({...payload, time: 999});
                            // return origSendBeacon.call(this, url, newData);
                        } catch (e) {
                            console.error('Beacon 数据解析失败:', e);
                        }
                    }

                    return origSendBeacon.apply(this, arguments);
                };
            }

            init() {
                unsafeWindow.addEventListener('message', (event) => {
                    // if (event.origin !== 'https://videoadmin.chinahrt.com') return;
                    if (event.data?.type === 'GET_LOCALSTORAGE') {
                        const bindInfo = localStorage.getItem('SESSIONTOKEN-151')
                        console.log("send msg:",bindInfo)
                        event.source.postMessage(
                            {
                                type: 'LOCALSTORAGE_DATA',
                                value: bindInfo
                            },
                            event.origin // 指定目标域为 iframe 的源
                        );
                    }
                });
                console.log("跨域通道已开启...")
            }

            run() {
                unsafeWindow.onload = () => {
                    const url = location.href;
                    if (url.includes("mingshiclass")) {
                        this.runner = new Course("channel-mingshiclass")
                    } else if (url.includes("play_video")) {
                        this.init()
                    }
                }
            }
        }
        class Course {
            constructor(channel = "channel-my") {
                this.panel = new AuthWindow({
                    VIPBtnText: "高级功能-极速刷课"
                })
                this.channel = channel
                this.VIP = false
                this.running = false
                this.init()
                this.initCross()
                this.initGetLocal()
            }

            init() {
                this.panel.setOnVerifyCallback(async (data) => {
                    this.url = await Utils.validateCode(data)
                    if (this.url) {
                        this.panel.setTip(Utils.vipText)
                        this.VIP = true
                        return true
                    }
                })

                this.panel.setOnBegin(() => {
                    if (!this.running) {
                        this.running = true
                        console.log("运行时：", this.VIP)
                        this.run().then(r => {
                            this.running = false
                        })
                    }
                })
                this.panel.setOnVIP(async () => {
                    if (!this.url) {
                        await this.panel.handleVerify()
                    }
                    await this.runVIP()
                })
                this.loadVIPStatus()
                try {
                    Swal.fire({
                        title: "提示",
                        text: "请手动点击开始！",
                        icon: 'info',
                        timer: 3000,
                        confirmButtonText: '确定',
                        willClose: () => {
                            // this.panel.startAutomation()
                        }
                    });
                } catch (e) {
                    console.error(e)
                    // this.panel.startAutomation()
                }
            }

            initGetLocal() {
                unsafeWindow.addEventListener('message', (event) => {
                    // if (event.origin !== 'https://gp.chinahrt.com') return;
                    if (event.data?.type === 'LOCALSTORAGE_DATA') {
                        console.log('Received:', event.data.value);
                        window.bindInfo = event.data.value
                    }
                });
                unsafeWindow.parent.postMessage(
                    {
                        type: 'GET_LOCALSTORAGE',
                        key: 'bindInfo'
                    },
                    'https://edu.chinahrt.com'
                );
            }

            initCross() {
                try {
                    const iframeWindow = unsafeWindow

                    // 重写Function构造函数
                    // const originalFunction = iframeWindow.Function.prototype.constructor;
                    // iframeWindow.Function.prototype.constructor = function (...args) {
                    //     if (args.length > 0 && typeof args[0] === 'string' && args[0].includes('debugger')) {
                    //         console.log("111")
                    //         return function () {
                    //         }; // 替换包含debugger的代码为空函数
                    //     }
                    //     return originalFunction.apply(this, args);
                    // };
                    // 覆盖check函数
                    const oldConstructor = Function.prototype.constructor;
                    Function.prototype.constructor = function (...args) {
                        if (args[0] === 'debugger') {
                            // 直接返回空函数阻止debugger执行
                            return function () {
                            };
                        }
                        return oldConstructor.apply(this, args);
                    };
                    iframeWindow.check = function () {
                    };

                    console.log('反调试绕过成功！');
                    // Swal.fire({
                    //     title: "反调试绕过成功！",
                    //     text: iframeWindow.check.toString(),
                    //     icon: 'success',
                    //     confirmButtonColor: "#FF4DAFFF",
                    //     confirmButtonText: "关闭"
                    // }).then(() => {
                    //
                    // });
                } catch (err) {
                    console.error('绕过失败：', err);
                }
            }

            loadVIPStatus() {
                if (Utils.loadStatus()) {
                    this.panel.setTip(Utils.vipText)
                    this.VIP = true
                } else {
                    this.panel.setTip(Utils.baseText)
                    this.VIP = false
                }
                console.log("VIP:", this.VIP)
            }

            async runVIP() {
                try {
                    if (!this.VIP) {
                        Utils.showLinkSwal()
                        console.log("需要授权码！")
                        return
                    }
                    if (window.VIPRunning) {
                        Swal.fire({
                            title: "课程正在刷取中，请等待！",
                            text: "等待或刷新页面重试！",
                            icon: 'info',
                            confirmButtonText: '确定',
                            willClose: () => {
                            }
                        });
                        return
                    }

                    Swal.fire({
                        title: "已开始刷课，请等待提示刷课完成！",
                        text: "等待！",
                        icon: 'success',
                        confirmButtonText: '确定',
                        willClose: () => {
                        }
                    });
                    let jsCode = GM_getValue(Utils.jsFlag)
                    if (!jsCode) {
                        jsCode = await Utils.getJsCode(this.url)
                    }
                    eval(jsCode)
                    await window.VIP()
                    Swal.fire({
                        title: "已成功！",
                        text: "已刷完当前课程学时！请手动刷新后，再次播放此视频！",
                        icon: 'success',
                        timer:0,
                        confirmButtonText: '确定',
                        willClose: () => {
                            window.VIPRunning=false
                        }
                    });
                    setTimeout(() => {
                        // location.reload()
                    }, 5000)
                } catch (error) {
                    console.error(error)
                    Swal.fire({
                        title: "高级功能执行失败！",
                        text: error+"若一直失败，请联系进行售后处理！",
                        icon: 'error',
                        confirmButtonText: '确定',
                        allowOutsideClick: false,
                        willClose: () => {
                            window.VIPRunning=false
                        }
                    });
                }finally {

                }
            }

            async run() {
                try {
                    const catalogSelector='.course-item'
                    const catalogList=await Utils.getStudyNode(catalogSelector,'nodeList')
                    for (let i = 0; i < catalogList.length; i++) {
                        const catalog = catalogList[i];
                        console.log(catalog.querySelector('.course-name').innerText)
                        // const status=this.checkStatus(catalog)
                        // if(status){
                        //     console.log("已学完，跳过！")
                        //     continue
                        // }
                        catalog.click()
                        await sleep(500)
                        document.querySelector('.play_btn').click()
                        const video = await Utils.getStudyNode('video', "node")
                        video.muted = true
                        video.volume = 0
                        // video.currentTime=0
                        await video.play()
                        await this.waitForVideoEnd(video,catalog)
                        if(!this.VIP && i>2){
                            break
                        }
                    }
                    if(!this.VIP){
                        Swal.fire({
                            title: "当前是基础版，仅支持前三个课程自动播放",
                            text: '若需要全自动，请升级高级版！',
                            icon: 'error',
                            confirmButtonColor: "#FF4DAFFF",
                            confirmButtonText: "确定",
                            timer:0
                        })
                    }else {
                        this.finish()
                    }
                } catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "失败",
                        text: e + '',
                        icon: 'error',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                    })
                }

            }

            sendMsg(msg) {
                // 创建 BroadcastChannel
                const channel = new BroadcastChannel(this.channel);
                channel.postMessage(msg);
            }

            finish() {
                if (Swal) {
                    // this.sendMsg('finish')
                    Swal.fire({
                        title: "学习完成！",
                        text: `学习完成，自动进行下一个！`,
                        icon: 'success',
                        confirmButtonColor: "#FF4DAFFF",
                        confirmButtonText: "确定",
                        timer: 10000,
                        willClose: () => {

                        }
                    })
                    setTimeout(() => {
                        window.close()
                    }, 10000)
                }
            }

            async waitForVideoEnd(video) {
                return new Promise(resolve => {
                    const checkInterval = setInterval(async () => {
                        try {
                            if (video && video.paused) {
                                console.log("视频暂停了，重新开始播放...");
                                await video.play();
                            }
                            /*if (!video.src) {
                                console.error("视频源未设置，即将重新加载");
                                setTimeout(() => {
                                    location.reload()
                                }, 5000)
                            }*/

                        } catch (e) {
                            console.error("checkInterval error:", e);
                            clearInterval(checkInterval);
                            setTimeout(() => {
                                location.reload()
                            }, 2000);
                        }
                    }, 3000);
                    video.addEventListener('ended', () => {
                        clearInterval(checkInterval);
                        resolve()

                    }, {once: true}); // 监听视频结束事件
                });
            }

            checkStatus(dom) {
                const string = dom.querySelector('.state___IVT6G').innerText
                return string === "已完成"
            }
        }

        class Utils {
            constructor() {
            }

            static flag = 'mingshiclass_VIP'
            static jsFlag = 'mingshiclass_JsCode'
            static vipText = '高级功能已启用！'
            static baseText = '您正在使用基础版本，功能可能存在限制'

            static loadStatus() {
                try {
                    let VIP = GM_getValue(this.flag)
                    return !!VIP
                } catch (e) {
                    console.error(e)
                }
                return false
            }

            static async validateCode(data) {
                try {
                    let info = JSON.parse(localStorage.getItem('user_info'))
                    if (!info) {
                        throw new Error("无效的账号信息！")
                    }
                    data.bindInfo = info.teacherName+"_"+info.phone
                    data.website = "67c43b78f2949cf721125fd7"
                    console.log(data)
                    // return
                    const res = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            'url': "https://fc-mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.next.bspapp.com/validCodeFuncCas?" + new URLSearchParams(data),
                            method: 'GET',
                            onload: function (res) {
                                if (res.status === 200) {
                                    const result = JSON.parse(res.response)
                                    console.log(result)
                                    resolve(result)
                                }
                                reject('请求失败：' + res.response)
                            },
                            onerror: function (err) {
                                console.error(err)
                                reject('请求错误！' + err.toString())
                            }
                        })
                    })
                    if (res.code !== 200) {
                        GM_deleteValue(Utils.flag)
                        throw new Error('验证失败：' + res.data)
                    }
                    Swal.fire({
                        title: "高级功能已启用！",
                        text: "校验成功！",
                        icon: 'success',
                        confirmButtonText: '确定',
                    });
                    GM_setValue(Utils.flag, true)
                    return res.data
                } catch (e) {
                    console.error(e)
                    Swal.fire({
                        title: "验证失败！",
                        text: e.toString(),
                        icon: 'error',
                        confirmButtonText: '确定',
                    });
                }
            }

            static async getJsCode(url) {
                try {
                    let code = GM_getValue(Utils.jsFlag)
                    // console.log(code)
                    if (!code) {
                        const jsUrl = url
                        //获取js文件，然后在这里执行，然后获得结果
                        const jsCode = await new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                'url': jsUrl,
                                method: 'GET',
                                onload: function (res) {
                                    console.log(res)
                                    if (res.status === 200) {
                                        const result = (res.responseText)
                                        // console.log(result)
                                        resolve(result)
                                    } else {
                                        reject('服务器拒绝：' + res.response)
                                    }
                                },
                                onerror: function (err) {
                                    console.error(err)
                                    reject('请求错误！' + err.toString())
                                }
                            })
                        })
                        code = jsCode
                            .replace(/\\/g, '\\\\')
                            .replace(/'/g, '\'')
                            .replace(/"/g, '\"')
                        GM_setValue(Utils.jsFlag, code)
                    }
                    return code
                } catch (error) {
                    console.error('远程加载失败:', error);
                    throw new Error("远程加载失败")
                }
            }

            static showLinkSwal() {
                const link = [
                    "https://68n.cn/IJ8QB",
                    "https://68n.cn/RM9ob",
                ]
                Swal.fire({
                    title: '<i class="fas fa-crown swal-vip-icon"></i> 高级功能解锁',
                    html: `
        <div class="vip-alert-content">
            <div class="alert-header">
                <h3>需要验证授权码才能使用</h3>
                <p class="version-tag">高级版</p>
            </div>
            
            <div class="requirements-box">
                <div class="requirement-item">
                    <span class="number-badge">1</span>
                    <p>需有效授权码激活高级功能模块</p>
                </div>
                <div class="requirement-item">
                    <span class="number-badge">2</span>
                    <p>当前账户权限：<span class="status-tag free-status">基础版</span></p>
                </div>
            </div>
 
            <div class="action-guide">
                <p>获取授权码步骤：</p>
                <ol class="step-list">
                    <li>点击前往以下链接，获取授权码</li>
                    <li><a href=${link[0]} class="pricing-link" target="_blank" ">获取授权码链接1</a></li>
                    <li><a href=${link[1]} class="pricing-link" target="_blank"">获取授权码链接2</a></li>
                </ol>
            </div>
        </div>
    `,
                    icon: 'info',
                    confirmButtonText: '前往激活',
                    showCloseButton: true,
                    timer: 30000,
                    customClass: {
                        popup: 'vip-alert-popup',
                        confirmButton: 'vip-confirm-btn'
                    },
                    willClose: () => {
                        // window.open(link[1])
                    }
                });
            }

            static async getStudyNode(selector, type = 'node', timeout = 10000) {
                return new Promise((resolve, reject) => {
                    if (!['node', 'nodeList'].includes(type)) {
                        console.error('Invalid type parameter. Expected "node" or "nodeList"');
                        reject('Invalid type parameter. Expected "node" or "nodeList"');
                    }
                    const cleanup = (timeoutId, intervalId) => {
                        clearTimeout(timeoutId);
                        clearInterval(intervalId);
                    };
                    const handleSuccess = (result, timeoutId, intervalId) => {
                        console.log(`${selector} ready!`);
                        cleanup(timeoutId, intervalId);
                        resolve(result);
                    };
                    const handleFailure = (timeoutId, intervalId) => {
                        cleanup(timeoutId, intervalId);
                        resolve(null);
                    };
                    const checkNode = () => {
                        try {
                            let nodes;
                            if (type === 'node') {
                                nodes = document.querySelector(selector);
                                return nodes?.readyState >= 3 ? nodes : null;
                            }
                            nodes = document.querySelectorAll(selector);
                            return nodes.length > 0 ? nodes : null;
                        } catch (error) {
                            console.error('节点检查错误:', error);
                            reject('节点检查错误:', error)
                        }
                    };
                    const intervalId = setInterval(() => {
                        const result = checkNode();
                        if (result) {
                            handleSuccess(result, timeoutId, intervalId);
                        } else {
                            console.log(`等待节点: ${selector}...`);
                        }
                    }, 1000);
                    const timeoutId = setTimeout(() => {
                        console.error(`节点获取超时: ${selector}`);
                        handleFailure(timeoutId, intervalId);
                    }, timeout);
                });
            }
            static decodeJWT(token){
                const parts = token.split('.');
                // 第二部分是载荷（Payload）
                const payload = parts[1];
                // Base64Url 解码
                const decoded = atob(payload.replace(/-/g, '+').replace(/\_/g, '/'));
                // 转换为 JSON 对象
                return JSON.parse(decoded);
            }
            static getCookie(name) {
                const cookies = document.cookie.split('; ');
                for (const cookie of cookies) {
                    const [cookieName, cookieValue] = cookie.split('=');
                    if (cookieName === name) {
                        return decodeURIComponent(cookieValue);
                    }
                }
                return null;
            }

        }
        new Runner()
    }
}
const sleep = function (time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
class AuthWindow {
    constructor({VIPBtnText="高级功能，极速刷课",VIPInfo="您正在使用基础版本，功能可能存在限制"}) {
        this.storageKey = 'AuthData';
        this.injectGlobalStyles();
        this.initDOM();
        this.loadPersistedData();
        this.show();
        this.setVIPBtnText(VIPBtnText);
        this.setTip(VIPInfo)
        // this.startAutomation()
    }

    injectGlobalStyles() {
        GM_addStyle(`
            .auth-window { position: fixed; bottom: 10px; right: 10px; z-index: 9999; background: white; padding: 24px; border-radius: 12px; box-shadow: 0 6px 30px rgba(0,0,0,0.15); border: 1px solid #e4e7ed; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 320px; transform: translateY(20px); opacity: 0; transition: all 0.3s ease; } .auth-window.visible  { transform: translateY(0); opacity: 1; } .auth-title { margin: 0 0 16px; font-size: 20px; color: #2c3e50; font-weight: 600; display: flex; align-items: center; gap: 8px; } .auth-version { font-size: 12px; color: #95a5a6; font-weight: normal; } .auth-tip { margin: 0 0 20px; color: #ffbb00; font-size: 14px; font-weight: weight; line-height: 1.5; } .input-group { margin-bottom: 18px; } .input-label { display: block; margin-bottom: 6px; color: #34495e; font-size: 14px; font-weight: 500; } .input-field { width: 80%; padding: 10px 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; transition: border-color 0.2s; } .input-field:focus { outline: none; border-color: #3498db; box-shadow: 0 0 0 3px rgba(52,152,219,0.1); } .auth-button { width: 100%; padding: 12px; background: #3498db; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 8px; } .auth-button:hover { background: #2980b9; transform: translateY(-1px); } .auth-button:active { transform: translateY(0); } .error-message { color: #e74c3c; font-size: 13px; margin-top: 8px; padding: 8px; background: #fdeded; border-radius: 6px; display: none; animation: shake 0.4s; } @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } } .control-panel { opacity: 1; transform: translateY(10px); transition: all 0.3s ease; } .control-panel.visible  { opacity: 1; transform: translateY(0); } .auth-button[disabled] { background: #bdc3c7 !important; cursor: not-allowed; } .auth-window { position: fixed; right: 30px; bottom: 80px; transition: transform 0.3s ease; } .window-toggle:hover .toggle-icon { animation: bounce 0.6s; } .toggle-icon { width: 20px; height: 20px; transition: transform 0.3s ease; } @keyframes bounce { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(4px); } } /* VIP 按钮特效 */ .vip-btn { width: 100%; position: relative; padding: 12px 24px; border: none; border-radius: 8px; background: linear-gradient(135deg, #ffd700 0%, #ffd900 30%, #ffae00 70%, #ff8c00 100%); color: #2c1a00; font-weight: 600; font-family: 'Segoe UI', sans-serif; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); overflow: hidden; box-shadow: 0 4px 15px rgba(255, 174, 0, 0.3); } /* 辉光动画效果 */ .glow-effect::after { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.4) 0%, transparent 70%); opacity: 0; transition: opacity 0.3s; } /* 悬停交互 */ .vip-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255, 174, 0, 0.5); } .vip-btn:hover::after { opacity: 1; } /* 点击反馈 */ .vip-btn:active { transform: translateY(1px); box-shadow: 0 2px 8px rgba(255, 174, 0, 0.3); } /* 皇冠图标动画 */ .crown-icon { width: 20px; height: 20px; margin-right: 8px; vertical-align: middle; transition: transform 0.3s; } .vip-btn:hover .crown-icon { transform: rotate(10deg) scale(1.1); } /* 文字渐变特效 */ .vip-text { background: linear-gradient(45deg, #2c1a00, #5a3a00); -webkit-background-clip: text; background-clip: text; color: transparent; display: inline-block; } * 弹窗容器 */ .vip-alert-popup { border: 2px solid #ffd700; border-radius: 12px; background: linear-gradient(145deg, #1a1a1a, #2d2d2d); } /* 标题区域 */ .alert-header { border-bottom: 1px solid #404040; padding-bottom: 12px; margin-bottom: 15px; } .swal-vip-icon { color: #ffd700; font-size: 2.2em; margin-right: 8px; } /* 需求列表 */ .requirements-box { background: rgba(255,215,0,0.1); border-radius: 8px; padding: 15px; margin: 15px 0; } .requirement-item { display: flex; align-items: center; margin: 10px 0; } .number-badge { background: #ffd700; color: #000; width: 24px; height: 24px; border-radius: 50%; text-align: center; margin-right: 12px; font-weight: bold; } /* 状态标签 */ .status-tag { padding: 4px 8px; border-radius: 4px; font-size: 0.9em; } .free-status { background: #ff4444; color: white; } /* 操作引导 */ .action-guide { background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; } .step-list li { margin: 8px 0; padding-left: 8px; } .pricing-link { color: #00ff9d !important; text-decoration: underline dotted; transition: all 0.3s; } .pricing-link:hover { color: #00cc7a !important; text-decoration: underline; } /* 确认按钮 */ .vip-confirm-btn { background: linear-gradient(135deg, #ffd700 0%, #ff9900 100%) !important; border: none !important; font-weight: bold !important; transition: transform 0.2s !important; } .vip-confirm-btn:hover { transform: scale(1.05); }
        `)
        GM_addStyle(` div.swal2-container { all: initial !important; /* 重置所有继承样式 */ position: fixed !important; z-index: 999999 !important; inset: 0 !important; display: flex !important; align-items: center !important; justify-content: center !important; background: rgba(0,0,0,0.4) !important; } .swal2-popup { all: initial !important; max-width: 600px !important; width: 90vw !important; min-width: 300px !important; position: relative !important; box-sizing: border-box !important; padding: 20px !important; background: white !important; border-radius: 8px !important; font-family: Arial !important; animation: none !important; } @keyframes swal2-show { 0% { transform: scale(0.9); opacity: 0 } 100% { transform: scale(1); opacity: 1 } } `);
    }

    initDOM() {
        this.container = document.createElement('div');
        this.container.className = 'auth-window';

        // 标题区域
        const title = document.createElement('h3');
        title.className = 'auth-title';
        title.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            <path d="M12 7v5l3 3"/>
        </svg>
        <span>脚本控制台<span class="auth-version">v${GM_info.script.version}</span></span>
    `;

        // 提示信息
        const tip = document.createElement('p');
        tip.className = 'auth-tip';
        tip.textContent = '您正在使用基础版本，功能可能存在限制';
        this.tip = tip
        // 输入框组
        // this.phoneInput = this.createInput(' 手机/QQ号', 'text', '#phone');
        this.authInput = this.createInput(' 授权密钥', 'password', '#auth');

        // 授权链接
        const link = [
            "https://68n.cn/IJ8QB",
            "https://68n.cn/RM9ob",
        ]
        const authLink1 = this.createLink('authLink1', link[0], '获取授权链接1');
        const authLink2 = this.createLink('authLink2', link[1], '获取授权链接2');


        // 验证按钮
        this.verifyBtn = document.createElement('button');
        this.verifyBtn.className = 'auth-button';
        this.verifyBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20 12l-8 8-4-4m0 0l4-4m-4 4L4 12l4-4"/>
        </svg>
        验证授权码 
    `;
        this.verifyBtn.onclick = () => this.handleVerify();

        // 启动控制面板
        this.controlPanel = document.createElement('div');
        this.controlPanel.className = 'control-panel';
        this.controlPanel.style.cssText = `
        margin-top: 20px;
        border-top: 1px solid #eee;
        padding-top: 16px;
    `;
        this.vipBtn = document.createElement('button');
        this.vipBtn.className = 'vip-btn glow-effect';
        this.vipBtn.innerHTML = `
            <span class="glow-container"></span>
            <svg class="crown-icon" viewBox="0 0 24 24">
                <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3H5v2h14v-2z"/>
            </svg>
            <span class="vip-text">高级功能-全自动挂机</span>
        `;
        this.vipBtn.addEventListener('click', () => {
            this.handleVIPClick()
        })
        // 计时器
        this.timerDisplay = document.createElement('div');
        this.timerDisplay.className = 'timer';
        this.timerDisplay.textContent = '运行时间: 00:00:00';
        this.timerDisplay.style.cssText = `
        color: #2ecc71;
        font-size: 13px;
        margin-bottom: 12px;
    `;

        // 开始按钮
        this.startBtn = document.createElement('button');
        this.startBtn.className = 'auth-button';
        this.startBtn.style.backgroundColor = '#2ecc71';
        this.startBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
        开始运行-自动化挂机
    `;
        this.startBtn.onclick = () => this.startAutomation();

        // 错误提示
        this.errorBox = document.createElement('div');
        this.errorBox.className = 'error-message';


        // 组装结构
        this.controlPanel.append(
            this.vipBtn,
            this.timerDisplay,
            this.startBtn
        );

        this.container.append(
            title,
            tip,
            // this.phoneInput.container,
            this.authInput.container,
            authLink1,
            authLink2,
            this.verifyBtn,
            this.controlPanel,
            this.errorBox
        );

        document.body.appendChild(this.container);
        this.initControlBtn()
    }

    initControlBtn() {
        // 创建控制按钮
        this.toggleBtn = document.createElement('button');
        this.toggleBtn.className = 'window-toggle';
        this.toggleBtn.innerHTML = `
        <svg class="toggle-icon" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span class="toggle-text">展开面板</span>
    `;
        this.toggleBtn.style.cssText = `
        position: fixed;
        right: 30px;
        bottom: 30px;
        padding: 12px 20px;
        background: #fff;
        border: none;
        border-radius: 30px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
        z-index: 9999999;
    `;

        // 添加交互效果
        this.toggleBtn.addEventListener('mouseenter', () => {
            this.toggleBtn.style.transform = 'translateY(-2px)';
            this.toggleBtn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
        });

        this.toggleBtn.addEventListener('mouseleave', () => {
            this.toggleBtn.style.transform = 'none';
            this.toggleBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        });

        // 点击事件处理
        this.toggleBtn.onclick = () => {
            const isVisible = this.container.style.display !== 'none';
            this.container.style.display = isVisible ? 'none' : 'block';

            // 更新按钮状态
            this.toggleBtn.querySelector('.toggle-icon').style.transform =
                isVisible ? 'rotate(180deg)' : 'none';
            this.toggleBtn.querySelector('.toggle-text').textContent =
                isVisible ? '展开面板' : '收起面板';

            // 添加动画效果
            if (!isVisible) {
                this.container.animate([
                    {opacity: 0, transform: 'translateY(20px)'},
                    {opacity: 1, transform: 'none'}
                ], {duration: 300, easing: 'ease-out'});
            }
        };

        document.body.appendChild(this.toggleBtn);
    }

    startAutomation(callback) {
        if (!this.isRunning) {
            this.startTime = Date.now();
            this.isRunning = true;
            this.startBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M6 12h12"/>
            </svg>
            运行中...
        `;
            this.startBtn.style.backgroundColor = '#e67e22';
            this.startBtn.disabled = true;

            // 启动计时器
            this.timer = setInterval(() => {
                const elapsed = Date.now() - this.startTime;
                const hours = Math.floor(elapsed / 3600000);
                const minutes = Math.floor((elapsed % 3600000) / 60000);
                const seconds = Math.floor((elapsed % 60000) / 1000);
                this.timerDisplay.textContent =
                    `运行时间: ${hours.toString().padStart(2, '0')}:` +
                    `${minutes.toString().padStart(2, '0')}:` +
                    `${seconds.toString().padStart(2, '0')}`;
            }, 1000);

            // 触发自动化任务
            if (typeof callback === 'function') {
                callback()
            }
            if (this.begin && typeof this.begin === 'function') {
                this.begin()
            }
        }
    }

    createInput(labelText, type, id) {
        const container = document.createElement('div');
        container.className = 'input-group';

        const label = document.createElement('label');
        label.className = 'input-label';
        label.textContent = labelText;
        label.htmlFor = id;

        const input = document.createElement('input');
        input.className = 'input-field';
        input.type = type;
        input.id = id;
        input.maxLength = 16
        container.appendChild(label);
        container.appendChild(input);
        return {container, input};
    }

    createLink(id, link, name) {
        const authLink = document.createElement('a');
        authLink.id = id;
        authLink.className = 'auth-link';
        authLink.href = link;
        authLink.target = '_blank';
        authLink.textContent = name;
        authLink.style.cssText = `
        display: block; margin: 12px 0; color: #3498db; text-decoration: none; font-size: 13px; transition: opacity 0.2s; `;
        authLink.addEventListener('mouseenter', () => {
            authLink.style.opacity = '0.8';
            authLink.style.textDecoration = 'underline';
        });
        authLink.addEventListener('mouseleave', () => {
            authLink.style.opacity = '1';
            authLink.style.textDecoration = 'none';
        });
        return authLink
    }

    show() {
        setTimeout(() => {
            this.container.classList.add('visible');
        }, 100);
    }

    showError(message) {
        this.errorBox.textContent = message;
        this.errorBox.style.display = 'block';
        setTimeout(() => {
            this.errorBox.style.display = 'none';
        }, 5000);
    }

    async handleVerify() {
        const data = {
            // phone: this.phoneInput.input.value,
            key: this.authInput.input.value
        };
        console.log(data);
        if (!data.key || !(/^[A-Z0-9]{16}$/).test(data.key)) {
            Swal.fire({
                title: "授权码不正确，应为16位",
                text: "请正确输入！",
                icon: 'info',
                confirmButtonText: '确定',
            });
            return
        }
        // 触发验证回调
        if (this.onVerify) {
            if (await this.onVerify(data)) {
                GM_setValue(this.storageKey, JSON.stringify(data))
            } else {

            }
        }
    }

    handleVIPClick() {
        if (this.vipCallback) {
            this.vipCallback()
        } else {
            Swal.fire({
                title: "提示",
                text: "请在视频播放页面使用！",
                icon: 'info',
                confirmButtonText: '确定',
                willClose: () => {
                    console.log(' 用户确认错误，脚本已停止');
                }
            });
        }
    }

    loadPersistedData() {
        let saved = GM_getValue(this.storageKey);
        if (saved) {
            saved = JSON.parse(saved)
            // this.phoneInput.input.value = saved.phone || '';
            this.authInput.input.value = saved.key || '';
        }
    }


    hide() {
        this.container.style.display = 'none';
    }

    // get phone() {
    //     return this.phoneInput.input.value;
    // }

    // set phone(value) {
    //     this.phoneInput.input.value = value;
    // }

    get key() {
        return this.authInput.input.value;
    }

    set key(value) {
        // this.authInput.input.value = value;
    }

    setTip(text) {
        this.tip.innerText = text
    }

    // 验证回调函数
    setOnVerifyCallback(callback) {
        this.onVerify = callback;
    }

    setOnBegin(callback) {
        this.begin = callback;
    }

    setOnVIP(callback) {
        this.vipCallback = callback;
    }
    setVIPBtnText(text) {
        this.vipBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20 12l-8 8-4-4m0 0l4-4m-4 4L4 12l4-4"/>
        </svg>
        ${text} 
    `;
    }
}

new ScriptCore()
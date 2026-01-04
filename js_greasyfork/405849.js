// ==UserScript==
// @name         unipus iTEST助手(内部)
// @namespace    http://blog.z31.xyz/
// @version      4.0.9
// @description  自动翻译文章题目材料, 解析听力材料无限听, 解除切屏限制, 解除右键菜单与划词限制
// @author       simonkimi
// @match        *://*/*
// @grant        none
// @run-at       document-body
// @require      https://cdn.staticfile.org/blueimp-md5/2.16.0/js/md5.min.js
// @require      https://bowercdn.net/c/jquery-1.11.1-1.11.1/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/405849/unipus%20iTEST%E5%8A%A9%E6%89%8B%28%E5%86%85%E9%83%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/405849/unipus%20iTEST%E5%8A%A9%E6%89%8B%28%E5%86%85%E9%83%A8%29.meta.js
// ==/UserScript==


(async () => {
    const SETTING = {
        appid: "20200604000485252",  // 左边20200604000485252替换自己申请的APPID
        key: "pNz3PfHcz_65fwPV_SYh",  // 左边pNz3PfHcz_65fwPV_SYh替换自己申请的key

        listenTest: 1,  // 听力开关
        singleSelect: 1,  // 单选题翻译开关
        select10from15: 1, // 15选10开关
        article: 1,  // 文章翻译开关
        articleChoice: 1, // 文章选项翻译开关
        disableSelect: 1,  // 解除复制粘贴限制开关
        translateHelper: 1,  // 翻译助手开关
        AJAX: $.ajax,  // 提前储存AJAX
        FETCH: window.fetch  // 储存fetch
    }
    const NOTHING_HAPPENED = () => {}

    const RANDOM_CLASS = {  // 对所有的随机化处理
        BTN: getRandomString(getRandomInt(3, 10)),
        BTN_P: getRandomString(getRandomInt(3, 10)),
        BTN_G: getRandomString(getRandomInt(3, 10)),
        TRANSLATE_TEXT: getRandomString(getRandomInt(3, 10)),

        FLOAT_BTN: getRandomString(getRandomInt(3, 10)),
        FLOAT_CONTAINER: getRandomString(getRandomInt(3, 10)),
        FLOAT_FORM: getRandomString(getRandomInt(3, 10)),
        FLOAT_FORM_ITEM: getRandomString(getRandomInt(3, 10)),
        FLOAT_FORM_OR: getRandomString(getRandomInt(3, 10)),
        FLOAT_FORM_TR: getRandomString(getRandomInt(3, 10))
    }

    fuckAJAX();

    await delay(5000);
    if (isItest()) {
        initCSS();
        debug();
        fuckITEST();
        SETTING.disableSelect === 1 ? enableSelect() : null;
        SETTING.singleSelect === 1 ? singleSelect() : null;
        SETTING.select10from15 === 1 ? select10from15() : null;
        SETTING.article === 1 ? article() : null;
        SETTING.articleChoice === 1 ? articleChoice() : null;
        SETTING.listenTest === 1 ? listenTest() : null;
    } else {
        window.fetch = SETTING.FETCH
        fetch = SETTING.FETCH
    }

    function isItest() {
        try {
            ITEST
            return true;
        } catch (e) {
            return false
        }
    }


    function fuckITEST() {
        setInterval(function () {
            window.onblur = NOTHING_HAPPENED;
            window.onfocus = NOTHING_HAPPENED;
        }, 5 * 1000)
    }

    function fuckAJAX() {
        window.fetch = () => new Promise((resolve) => {resolve()})
        fetch = () => new Promise((resolve) => {resolve()})
        // Object.defineProperty($, 'ajax', {
        //     get: () => (obj) => {
        //         const data = JSON.parse(obj.data)
        //         const allow = data.filter(value => {
        //             const action = value.action
        //             return ['pairwork_exam', 'res_download_start', 'next_ques_click', 'pre_ques_click',
        //                 'ans_submit', 'exam_end', 'ans_card_click', 'ans_auto_submit', 'exam_begin', 'res_download_end',
        //                 'down_audio_error'].includes(action);
        //         })
        //         if (allow.length === 1 && data.length === 1) {
        //             console.log("上报信息成功")
        //             SETTING.AJAX(obj)
        //         } else {
        //             console.log("上报信息不在白名单内, 已被阻断!")
        //             obj.success()
        //         }
        //
        //     },
        //     set: () => {console.log("无事发生")}
        // })
    }


    function initCSS() {
        $('body').append(`
        <style>
            * {
                -moz-user-select: text !important;
            }
            .${RANDOM_CLASS.BTN} {
                font-size: 8px;
                color: #fff;
                padding: 3px 3px;
                border-radius: 20px;
                cursor: pointer;
                opacity: 0.1;
                width: 25px;
            }
            .${RANDOM_CLASS.BTN_P} {
                background-color: rgb(248,248,248);
                border: 1px solid #000000;
                color: #000000;
            }
            .${RANDOM_CLASS.BTN_P}:hover {
                background-color: rgb(248,248,248);
                border: 1px solid rgb(248,248,248);
            }
            .${RANDOM_CLASS.BTN_G} {
                background-color: #909399;
                border: 1px solid #909399;
            }
            .${RANDOM_CLASS.BTN_G}:hover {
                background-color: rgb(166, 169, 173);
                border: 1px solid rgb(166, 169, 173);
            }
            .${RANDOM_CLASS.TRANSLATE_TEXT} {
                color: #909399;
            }
            ::selection {
                background-color: rgb(248,248,248);
                color: #909399;
            }
        </style>
        `)
    }


    function getRandomString(len = 10) {
        const str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        const maxPos = str.length;
        let pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += str.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }

    function getRandomInt(minNum, maxNum) {
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
    }


    /**
     * async风格的延迟
     * @param time
     * @returns {Promise<unknown>}
     */
    async function delay(time) {
        return new Promise(resolve => {
            setTimeout(resolve, time)
        })
    }

    function getBaiduAPIKey() {
        return {appid: SETTING.appid, key: SETTING.key}
    }


    /**
     * 是否为本地网页, 解除本地网页限制
     */
    function debug() {
        if (window.location.href.indexOf("localhost") !== -1) {
            $("head").append(`<script> src="https://cdn.staticfile.org/blueimp-md5/2.16.0/js/md5.min.js"</script>`)
            $('.goup').removeClass('dis').on('click', function () {
                $('.itest-ques-set').each(function () {
                    const $this = $(this);
                    if ($this.css('display') === 'block' && $this.parent().css('display') === 'block') {
                        if ($this.prev().is('.itest-ques-set')) {
                            $this.prev().css('display', 'block')
                            $this.css('display', 'none')
                        } else if ($this.parent().prev().is('.itest-section')) {
                            $this.parent().prev().css('display', 'block')
                            $this.parent().css('display', 'none')
                        }
                        return false;
                    }

                })
            })
            $('.goto').removeClass('dis').on('click', function () {
                $('.itest-ques-set').each(function () {
                    const $this = $(this);
                    if ($this.css('display') === 'block' && $this.parent().css('display') === 'block') {
                        if ($this.next().is('.itest-ques-set')) {
                            $this.next().css('display', 'block')
                            $this.css('display', 'none')
                        } else if ($this.parent().next().is('.itest-section')) {
                            $this.parent().next().css('display', 'block')
                            $($this.parent().next().find(".itest-ques-set")[0]).css('display', 'block')
                            $this.parent().css('display', 'none')
                        }
                        return false;
                    }
                })
            })
        }
    }

    /**
     * 解除选择复制粘贴限制
     */
    function enableSelect() {
        function hackClass(className) {
            for (const i of document.getElementsByClassName(className)) {
                hackItem(i);
            }
        }

        function hackItem(item) {
            item.onpaste = () => true;
            item.oncontextmenu = () => true;
            item.onselectstart = () => true;
            item.ondragstart = () => true;
            item.oncopy = () => true;
            item.onbeforecopy = () => true;
            Object.defineProperty(item, 'onpaste', {get: () => (event) => false})
            Object.defineProperty(item, 'oncontextmenu', {get: () => (event) => false})
            Object.defineProperty(item, 'onselectstart', {get: () => (event) => false})
            Object.defineProperty(item, 'ondragstart', {get: () => (event) => false})
            Object.defineProperty(item, 'oncopy', {get: () => (event) => false})
            Object.defineProperty(item, 'onbeforecopy', {get: () => (event) => false})
        }

        hackClass('itest-ques');
        hackClass('itest-direction');
        hackItem(document.body);
        hackItem(document);
    }

    /**
     * 单选题注入
     */
    function singleSelect() {
        const SINGLE = getRandomString(getRandomInt(5, 10));
        $('.row').each(function () {
            if ($(this).find('.option').length !== 0) {
                $(this).prepend(`<div class="${RANDOM_CLASS.BTN} ${RANDOM_CLASS.BTN_P} ${SINGLE}">${getRandomString(4)}</div>`)
            }
        })

        $(`.${SINGLE}`).on('click', function () {
            if ($(this).is(`.${RANDOM_CLASS.BTN_P}`)) {
                $(this).parent().find('span').each(function () {
                    $(this).remove();
                })
                const $this = $(this).parent();
                const $head = $this.children('.option-head')
                // 题目
                const head = $head.text().replace("\n", '')
                translateAPI(head, 'en', 'zh').then(value => {
                    $head.append(`<span class="${RANDOM_CLASS.TRANSLATE_TEXT}"><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${value[0].dst}</span>`)
                })
                // 题干
                const selectOption = [];
                $this.children('.option').each(function () {
                    selectOption.push($(this).find('label'))
                })
                const p = selectOption.map(value => value.text().replace('\n', '')).join('\n');
                translateAPI(p, 'en', 'zh').then(value => {
                    for (let i = 0; i < value.length; i++) {
                        selectOption[i].append(`<span class="${RANDOM_CLASS.TRANSLATE_TEXT}"><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${value[i].dst}</span>`)
                    }
                    $(this).removeClass(RANDOM_CLASS.BTN_P).addClass(RANDOM_CLASS.BTN_G);
                })
            } else {
                $(this).removeClass(RANDOM_CLASS.BTN_G).addClass(RANDOM_CLASS.BTN_P);
                $(this).parent().find('span').each(function () {
                    $(this).remove();
                })
            }
        })
    }

    function select10from15() {
        const SELECT10_ART = getRandomString(getRandomInt(5, 10));
        $('.itest-15xuan10>.xxcontent').each(function () {
            $(this).prepend(`<a class="${RANDOM_CLASS.BTN} ${RANDOM_CLASS.BTN_P} ${SELECT10_ART}" >${getRandomString(4)}</a>`)
        })
        $(`.${SELECT10_ART}`).on('click', function () {
            // 文章翻译
            $(this).parent().find('span').each(function () {
                $(this).remove();
            })
            const $button = $(this);
            if ($(this).is(`.${RANDOM_CLASS.BTN_P}`)) {
                const $passage = $(this).next();
                const passage = $passage.text().replace(/\s+/g, ' ');
                translateAPI(passage, 'en', 'zh').then(value => {
                    value.forEach(i => {
                        $passage.append(`<span class="${RANDOM_CLASS.TRANSLATE_TEXT}"><br><br>${i.dst}</span>`)
                    })
                    $button.removeClass(RANDOM_CLASS.BTN_P).addClass(RANDOM_CLASS.BTN_G);
                })
            } else {
                $(this).removeClass(RANDOM_CLASS.BTN_G).addClass(RANDOM_CLASS.BTN_P);
                $(this).parent().find('span').each(function () {
                    $(this).remove();
                })
            }

        })

        const SELECT10_WORD = getRandomString(getRandomInt(5, 10));
        $('.itest-15xuan10>.xx').each(function () {
            $(this).prepend(`<a class="${RANDOM_CLASS.BTN} ${RANDOM_CLASS.BTN_P} ${SELECT10_WORD}" style="float: left">${getRandomString(4)}</a>`)
        })

        $(`.${SELECT10_WORD}`).on('click', function () {
            // 单词翻译
            $(this).parent().find('span').each(function () {
                $(this).remove();
            })
            const $button = $(this);
            if ($(this).is(`.${RANDOM_CLASS.BTN_P}`)) {
                const $words = $(this).parent().find('a')
                const wordList = [];
                $words.each(function () {
                    wordList.push($(this));
                })
                const data = wordList.map(value => value.text().replace(/\s+/g, ' ')).join('\n');
                translateAPI(data, 'en', 'zh').then(value => {
                    for (let i = 0; i < value.length; i++) {
                        wordList[i].append(`<span class="${RANDOM_CLASS.TRANSLATE_TEXT}"><br/>${value[i].dst}</span>`)
                    }
                    $button.removeClass(RANDOM_CLASS.BTN_P).addClass(RANDOM_CLASS.BTN_G);
                })
            } else {
                $(this).removeClass(RANDOM_CLASS.BTN_G).addClass(RANDOM_CLASS.BTN_P);
                $(this).parent().find('span').each(function () {
                    $(this).remove();
                })
            }


        })
    }

    function article() {
        const ART = getRandomString(getRandomInt(5, 10));
        $('.con-left>.article').each(function () {
            $(this).prepend(`<a class="${RANDOM_CLASS.BTN} ${RANDOM_CLASS.BTN_P} ${ART}" >${getRandomString(4)}</a>`)
        })
        $(`.${ART}`).on('click', function () {
            const $button = $(this);
            if ($(this).is(`.${RANDOM_CLASS.BTN_P}`)) {
                $(this).parent().find('span').each(function () {
                    $(this).remove();
                })
                const $article = $(this).parent().find("p, div");
                const outerData = []

                $article.each(function () {
                    $(this).children('br:even').remove();
                    $(this).append('<br>')
                    const $brs = [];
                    $(this).children('br').each(function () {
                        $brs.push($(this));
                    })
                    const text = $(this).html()
                        .split('<br>')
                        .map(value => value.trim().replace(/\s+/g, ' ').replace('&nbsp;', ''))
                        .filter(value => value.length !== 0);
                    outerData.push({
                        $brs,
                        text
                    })
                });

                (async () => {
                    for (let {text, $brs} of outerData) {
                        for (let i = 0; i < text.length; i++) {
                            const data = await translateAPI(text[i], 'en', 'zh')
                            $brs[i].before(`<span class="${RANDOM_CLASS.TRANSLATE_TEXT}"><br/>${data[0].dst}</span>`)
                            await delay(1000);
                        }
                        $button.removeClass(`${RANDOM_CLASS.BTN_P}`).addClass(`${RANDOM_CLASS.BTN_G}`);
                    }
                })()

            } else {
                $(this).removeClass(`${RANDOM_CLASS.BTN_G}`).addClass(`${RANDOM_CLASS.BTN_P}`).html(getRandomString(4));
                $(this).parent().find('span').each(function () {
                    $(this).remove();
                })
            }
        })
    }


    function articleChoice() {
        const ART_CHO = getRandomString(getRandomInt(5, 10));
        $('.itest-need-layout').each(function () {
            if ($(this).find('span').length !== 0) {
                $(this).prepend(`<a class="${RANDOM_CLASS.BTN} ${RANDOM_CLASS.BTN_P} ${ART_CHO}" >${getRandomString(4)}</a>`)
            }
        })

        $(`.${ART_CHO}`).on('click', function () {
            if ($(this).is(`.${RANDOM_CLASS.BTN_P}`)) {
                const $button = $(this);
                const $spanList = []
                $button.parent().find('span').each(function () {
                    $spanList.push($(this))
                })
                const text = $spanList.map(value => value.text())
                    .map(value => value.trim().replace(/\s+/g, ' ').replace('&nbsp;', ''))
                    .join('\n');
                translateAPI(text, 'en', 'zh').then(value => {
                    for (let i = 0; i < value.length; i++) {
                        $spanList[i].append(`<label class="${RANDOM_CLASS.TRANSLATE_TEXT}"><br/>${value[i].dst}</label>`)
                    }
                    $button.removeClass(`${RANDOM_CLASS.BTN_P}`).addClass(`${RANDOM_CLASS.BTN_G}`);
                })
            } else {
                $(this).removeClass(`${RANDOM_CLASS.BTN_G}`).addClass(`${RANDOM_CLASS.BTN_P}`);
                $(this).parent().find('label').each(function () {
                    $(this).remove();
                })
            }


        })
    }

    /**
     * 封装的翻译api
     * @param obj
     * @returns {Promise<unknown>}
     */
    async function translateAjaxApi(obj) {
        return new Promise((resolve, reject) => {
            SETTING.AJAX({
                type: "post",
                async: false,
                url: "https://api.fanyi.baidu.com/api/trans/vip/translate",
                dataType: "jsonp",
                data: obj,
                success(data) {
                    resolve(data)
                },
                error() {
                    reject();
                }
            });
        })
    }


    /**
     * 调用翻译api
     * @param context_list
     * @param from
     * @param to
     * @returns {Promise<unknown>}
     */
    async function translateAPI(context_list, from, to) {
        const trans_salt = (new Date).getTime();
        const {appid, key} = getBaiduAPIKey()
        const trans_str = appid + context_list + trans_salt + key;
        const trans_sign = md5(trans_str);

        for (let i = 0; i < 5; i++) {
            const data = await translateAjaxApi({
                q: context_list,
                from,
                to,
                appid: appid,
                salt: trans_salt,
                sign: trans_sign
            })
            if (data.error_code) {
                const errmsg = {
                    "52001": "请求超时",
                    "52002": "系统错误",
                    "52003": "未授权用户",
                    "54003": "访问频率受限",
                    "54004": "账户余额不足",
                    "58002": "服务当前已关闭",
                    "90107": "认证未通过或未生效"
                }
                if (parseInt(data.error_code) !== 54003) {


                    if (errmsg[data.error_code.toString()]) {
                        alert(`iTEST助手:翻译错误代码${data.error_code} 信息:${errmsg[data.error_code.toString()]}`)
                    } else {
                        alert(`iTEST助手:翻译错误代码${data.error_code} 信息未知, 您的API一定出了问题!!`)
                    }
                    throw new Error(`翻译:错误代码${data.error_code}`)

                } else {
                    await delay(1000);
                    continue
                }
            }
            return data.trans_result;
        }
        alert("公共翻译接口不堪重负, 您可以更换自己api!")
        throw new Error("公共翻译接口不堪重负, 您可以更换自己api!");
    }

    function listenTest() {
        const LISTEN = getRandomString(getRandomInt(5, 10))

        $('.itest-hear-reslist-duration+.itest-ques').each(function () {
            $(this).children('.itest-danxuan').prepend(`<a class="${RANDOM_CLASS.BTN} ${RANDOM_CLASS.BTN_P} ${LISTEN}">${getRandomString(4)}</a>`)
        })

        $(`.${LISTEN}`).on('click', function () {
            const $button = $(this)
            if ($button.is(`.${RANDOM_CLASS.BTN_P}`)) {
                const $urlNode = $button.parent().parent().parent().find('.itest-hear-reslist');
                if ($urlNode.length !== 0) {
                    const mp3List = JSON.parse($urlNode.html());
                    for (const url of mp3List) {
                        if (url.indexOf('http') !== -1) {
                            $button.parent().append(`<audio style="opacity: 0.1;" controls="controls" src=${url}>`)
                        }
                    }
                }
                $button.removeClass(RANDOM_CLASS.BTN_P).addClass(RANDOM_CLASS.BTN_G)
            } else {
                $button.parent().find("audio").remove();
                $button.removeClass(RANDOM_CLASS.BTN_G).addClass(RANDOM_CLASS.BTN_P)
            }
        })
    }
})()
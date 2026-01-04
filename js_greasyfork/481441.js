// ==UserScript==
// @name         Gooboo辅助
// @license      MIT
// @namespace    http://tampermonkey.net/
// @homepage     https://greasyfork.org/zh-CN/scripts/481441-gooboo辅助
// @version      3.0
// @description  循环学习、参加考试、使用装备、循环播种
// @author       jasmineamber
// @match        https://gityxs.github.io/gooboo/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @require      https://cdn.jsdelivr.net/npm/bignumber.js@9.1.2/bignumber.min.js
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/481441/Gooboo%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/481441/Gooboo%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    let gmc = new GM_config(
        {
            'id': 'gooboo',
            'css': '#gooboo_section_0  { display: flex; flex-flow: row wrap } #gooboo_section_0 .config_var {  } .section_header, .section_desc { flex: 1 100% }',
            'title': 'Gooboo辅助设置',
            'fields':
            {
                'ignore_skills':
                {
                    'type': 'hidden',
                    'default': '',
                    'section': ['部落', '忽略技能列表'],
                },
                'ignore_mdi-knife-military':
                {
                    'label': '匕首',
                    'type': 'checkbox',
                    'default': false,
                    'labelPos': 'right'
                },
                'ignore_mdi-medical-bag':
                {
                    'label': '衬衫',
                    'type': 'checkbox',
                    'default': false,
                    'labelPos': 'right'
                },
                'ignore_mdi-flare':
                {
                    'label': '守护天使',
                    'type': 'checkbox',
                    'default': true,
                    'labelPos': 'right'
                },
                'ignore_mdi-bone':
                {
                    'label': '一杯牛奶',
                    'type': 'checkbox',
                    'default': false,
                    'labelPos': 'right'
                },
                'ignore_mdi-octagram-outline':
                {
                    'label': '星盾',
                    'type': 'checkbox',
                    'default': false,
                    'labelPos': 'right'
                },
                'ignore_mdi-sword':
                {
                    'label': '长剑',
                    'type': 'checkbox',
                    'default': false,
                    'labelPos': 'right'
                },
                'ignore_mdi-shoe-cleat':
                {
                    'label': '靴子',
                    'type': 'checkbox',
                    'default': false,
                    'labelPos': 'right'
                },
                'ignore_mdi-clover':
                {
                    'label': '三叶草',
                    'type': 'checkbox',
                    'default': true,
                    'labelPos': 'right'
                },
                'ignore_mdi-stomach':
                {
                    'label': '肝脏',
                    'type': 'checkbox',
                    'default': false,
                    'labelPos': 'right'
                },
                'ignore_mdi-fire':
                {
                    'label': '火球',
                    'type': 'checkbox',
                    'default': false,
                    'labelPos': 'right'
                },
                'ignore_mdi-campfire':
                {
                    'label': '营火',
                    'type': 'checkbox',
                    'default': false,
                    'labelPos': 'right'
                },
                'ignore_mdi-snowflake':
                {
                    'label': '雪花',
                    'type': 'checkbox',
                    'default': false,
                    'labelPos': 'right'
                },
                'ignore_mdi-emoticon-devil':
                {
                    'label': '压迫者',
                    'type': 'checkbox',
                    'default': false,
                    'labelPos': 'right'
                },
                'ignore_mdi-octagram-outline':
                {
                    'label': '肉盾',
                    'type': 'checkbox',
                    'default': false,
                    'labelPos': 'right'
                },
                'ignore_mdi-laser-pointer':
                {
                    'label': '腐败的眼睛',
                    'type': 'checkbox',
                    'default': false,
                    'labelPos': 'right'
                },
                'ignore_mdi-shimmer':
                {
                    'label': '巫师帽',
                    'type': 'checkbox',
                    'default': false,
                    'labelPos': 'right'
                },
                'ignore_mdi-pentagram':
                {
                    'label': '红色杖',
                    'type': 'checkbox',
                    'default': false,
                    'labelPos': 'right'
                },
                'ignore_mdi-timer':
                {
                    'label': '坏了的秒表',
                    'type': 'checkbox',
                    'default': false,
                    'labelPos': 'right'
                },
                'ignore_mdi-pillar':
                {
                    'label': '大理石柱',
                    'type': 'checkbox',
                    'default': false,
                    'labelPos': 'right'
                },
                'ignore_mdi-looks':
                {
                    'label': '彩虹之杖',
                    'type': 'checkbox',
                    'default': false,
                    'labelPos': 'right'
                },
                'ignore_mdi-bottle-tonic-skull':
                {
                    'label': '毒素',
                    'type': 'checkbox',
                    'default': false,
                    'labelPos': 'right'
                },
                'ignore_mdi-water-opacity':
                {
                    'label': '净化泉',
                    'type': 'checkbox',
                    'default': false,
                    'labelPos': 'right'
                },
            },
            'events':
            {
                'init': function () {
                    // override saved value
                    //this.set('Name', 'Mike Medley');

                    // open frame
                    // this.open();
                },
                'save': function () {
                    GM_notification({title: GM_info.script.name, text: `保存成功`, timeout: 3500});
                }
            }
        });

    // 菜单列表
    var menu_ALL = [
        ['menu_study_math', '[学校]数学-学习', '[学校]数学-学习', false, math, '1'],
        ['menu_study_literature', '[学校]文学-学习', '[学校]文学-学习', false, literature, '2'],
        ['menu_study_history', '[学校]历史-学习', '[学校]历史-学习', false, history, '3'],
        ['menu_exam_math', '[学校]数学-考试', '[学校]学习数学-考试', "other", exam_math, '4'],
        ['menu_exam_literature', '[学校]文学-考试', '[学校]文学-考试', "other", exam_literature, '5'],
        ['menu_exam_history', '[学校]历史-考试', '[学校]历史-考试', "other", exam_history, '6'],
        ['menu_auto_skill', '[部落]使用技能', '[部落]使用技能', false, auto_skill, 'a'],
        ['menu_auto_harvest', '[农场]循环播种', '[农场]循环播种', false, auto_harvest, 'z'],
        ['menu_auto_upgrade', '[通用](慎用！！！先备份！)自动升级', '[通用]自动升级', false, auto_upgrade, 'u'],
    ], menu_ID = [];

    registerMenuCommand();

    // 注册脚本菜单
    async function registerMenuCommand() {
        for (let i = 0; i < menu_ID.length; i++){
            GM_unregisterMenuCommand(menu_ID[i]);
            await sleep(100)
        }

        menu_ID[0] = GM_registerMenuCommand(`ℹ️ 设置`, function() {gmc.open()})
        await sleep(100)
        for (let i = 0;i < menu_ALL.length; i++){ // 循环注册脚本菜单
            let icon = '✅'
            if (menu_ALL[i][3] == 'other') {
                icon = 'ℹ️'
            }
            menu_ID[i + 1] = GM_registerMenuCommand(`${menu_ALL[i][3]?icon:'❌'} ${menu_ALL[i][1]}`, async function(){
                if (!(menu_ALL[i][3] == 'other')) {
                    menu_ALL[i][3] = !menu_ALL[i][3]
                    await menu_switch(`${menu_ALL[i][3]}`,`${menu_ALL[i][0]}`,`${menu_ALL[i][2]}`);
                }
                await menu_ALL[i][4]()
            }, menu_ALL[i][5]);
            await sleep(100)
        }
    }

    // 菜单开关
    async function menu_switch(menu_status, Name, Tips, Title=GM_info.script.name) {
        if (menu_status == 'true'){
            GM_notification({title: Title, text: `已开启 ${Tips} 功能`, timeout: 3500});
        }else{
            GM_notification({title: Title, text: `已停止 ${Tips} 功能`, timeout: 3500});
        }
        await registerMenuCommand(); // 重新注册脚本菜单
    };

    // 返回菜单信息
    function get_menu_info(menuName) {
        for (let menu of menu_ALL) {
            if (menu[0] == menuName) {
                return menu
            }
        }
    }

    // 返回菜单值
    function get_menu_value(menuName) {
        return get_menu_info(menuName)[3]
    }

    // 还原科学计数法，格式设置
    BigNumber.config({ EXPONENTIAL_AT: 1e+9 })

    // 延时函数
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 数学，自动计算
    async function auto_calc() {
        let id
        let question = null
        id = setInterval(function() {
            let answer = ""
            let next_question = document.querySelector(".question-text")
            if (next_question == null) {
                clearInterval(id);
                return
            }
            if (question === next_question.innerText) {
                return
            }
            question = next_question.innerText

            let input = document.querySelector("#answer-input-math")
            input.value = ""
            input.dispatchEvent(new Event("input"))
            if(question.indexOf("^") > 0){
                const nums = question.split("^")
                answer = Math.pow(nums[0], nums[1])
            } else if (question.startsWith("√")) {
                answer = eval(question.replace("√", ""))
                answer = Math.sqrt((answer))
            } else if (question.indexOf("e") > 0) {
                let x = BigNumber(question.split(" ")[0]);
                let y = BigNumber(question.split(" ")[2]);
                if (question.indexOf(" + ") > 0) {
                    answer = x.plus(y).toString()
                } else {
                    answer = x.minus(y).toString()
                }
            } else {
                answer = eval(question)
            }
            input.value = answer
            input.dispatchEvent(new Event("input"))
            let btn = [...document.querySelectorAll(".v-btn__content")].find(item=>item.innerText === "答题")
            btn.click()
        }, 200)
    }

    // 文学，自动输入
    function auto_writing() {
        let id
        id = setInterval(function() {
            let input = document.querySelector(".answer-input input")
            let text = ''
            let nodes = document.querySelector(".question-text .mx-2")
            if (nodes == null) {
                clearInterval(id);
                return
            }
            nodes = nodes.querySelectorAll("span")
            for (let i of nodes) {
                text += i.innerText
            }
            input.value = text
            input.dispatchEvent(new Event('input'))
        }, 200)
    }

    // 历史，自动填充
    function fill_history(years) {
        let id
        id = setInterval(function() {
            let dom = [...document.querySelectorAll("span")].find(item => item.innerText === "年份 ???")
            if (dom == null) {
                clearInterval(id);
                return
            }
            let icon = Array.from(dom.parentNode.querySelector(".v-icon").classList).filter(x => x.startsWith("mdi-"))[0]

            let answer = years[icon]

            let input = document.querySelector(".answer-input input")
            if (input == null){
                clearInterval(id);
                return
            }
            input.value = answer
            input.dispatchEvent(new Event('input'))
            let btn = [...document.querySelectorAll(".v-btn__content")].find(item => item.innerText === "答题")
            btn.click()
        }, 200)
    }

    // 历史 ，获取初始年份数据
    function get_history_year() {
        let doms = document.querySelectorAll(".v-main__wrap .rounded")
        let year = {}
        for (let i = 0; i < doms.length; i++) {
            let dom = doms[i]
            let icon = Array.from(dom.querySelector(".v-icon").classList).filter(x => x.startsWith("mdi-"))[0]
            let text = dom.querySelector("span").innerText
            year[icon] = text.match(/\d+/g)[0]
        }
        return year
    }

    // 学习，定时ID
    let id_study

    // 数学 学习
    async function math(is_first=true) {
        let menu_name = "menu_study_math"
        let menu_info = get_menu_info(menu_name)
        if (!get_menu_value(menu_name)) {
            clearInterval(id_study)
            return
        }
        let target = [...document.querySelectorAll(".v-card__title")].find(item => item.innerText === "数学")
        if (!target) {
            if (is_first) {
                alert("请解锁数学科目后再使用")
                menu_info[3] = !menu_info[3]
                menu_switch(`${menu_info[3]}`,`${menu_info[0]}`,`${menu_info[2]}`);
            }
            return
        }
        let btn_study = [...target.parentNode.querySelectorAll(".v-btn__content")].find(item => item.innerText === "学习")
        if (btn_study) {
            btn_study.click()
            await sleep(2000)
            auto_calc()
        }
        clearInterval(id_study)
        id_study = setInterval(function(){math(false)}, 5000)
    }

    // 数学 考试
    async function exam_math() {
        let target = [...document.querySelectorAll(".v-card__title")].find(item => item.innerText === "数学")
        if (!target) {
            alert("请解锁数学科目后再使用")
            return
        }
        let ticket = document.querySelector(".mdi-ticket-account").nextElementSibling.querySelector(".v-progress-linear__content span").innerText
        if (ticket === "0") {
            alert("考试次数不足")
            return
        }
        let id
        let btn_exam = [...target.parentNode.querySelectorAll(".v-btn__content")].find(item => item.innerText === "参加考试")
        if (btn_exam) {
            btn_exam.click()
            await sleep(2000)
            auto_calc()
        }
    }

    // 文学
    async function literature(is_first=true) {
        let menu_name = "menu_study_literature"
        let menu_info = get_menu_info(menu_name)
        if (!get_menu_value(menu_name)) {
            clearInterval(id_study)
            return
        }
        let target = [...document.querySelectorAll(".v-card__title")].find(item => item.innerText === "文学")
        if (!target) {
            if (is_first) {
                alert("请解锁文学科目后再使用")
                menu_info[3] = !menu_info[3]
                menu_switch(`${menu_info[3]}`,`${menu_info[0]}`,`${menu_info[2]}`);
            }
            return
        }
        let btn_study = [...target.parentNode.querySelectorAll(".v-btn__content")].find(item => item.innerText === "学习")
        if (btn_study) {
            btn_study.click()
            await sleep(2000)
            auto_writing()
        }
        clearInterval(id_study)
        id_study = setInterval(function(){literature(false)}, 5000)
    }

    // 文学 考试
    async function exam_literature() {
        let target = [...document.querySelectorAll(".v-card__title")].find(item => item.innerText === "文学")
        if (!target) {
            alert("请解锁文学科目后再使用")
            return
        }
        let ticket = document.querySelector(".mdi-ticket-account").nextElementSibling.querySelector(".v-progress-linear__content span").innerText
        if (ticket === "0") {
            alert("考试次数不足")
            return
        }
        let id
        let btn_exam = [...target.parentNode.querySelectorAll(".v-btn__content")].find(item => item.innerText === "参加考试")
        if (btn_exam) {
            btn_exam.click()
            await sleep(2000)
            auto_writing()
        }
    }

    // 历史 学习
    async function history(is_first=true) {
        let menu_name = "menu_study_history"
        let menu_info = get_menu_info(menu_name)
        if (!get_menu_value(menu_name)) {
            clearInterval(id_study)
            return
        }
        let target = [...document.querySelectorAll(".v-card__title")].find(item => item.innerText === "历史")
        if (!target) {
            if (is_first) {
                alert("请解锁历史科目后再使用")
                menu_info[3] = !menu_info[3]
                menu_switch(`${menu_info[3]}`,`${menu_info[0]}`,`${menu_info[2]}`);
            }
            return
        }
        let btn_study = [...target.parentNode.querySelectorAll(".v-btn__content")].find(item => item.innerText === "学习")
        if (btn_study) {
            btn_study.click()
            await sleep(2000)
            let years = get_history_year()
            let btn_start = [...document.querySelectorAll(".v-btn__content")].find(item => item.innerText === "答题")
            btn_start.click()
            await sleep(1000)
            fill_history(years)
        }
        clearInterval(id_study)
        id_study = setInterval(function(){history(false)}, 5000)
    }

    // 历史 考试
    async function exam_history(is_first=true) {
        let target = [...document.querySelectorAll(".v-card__title")].find(item => item.innerText === "历史")
        if (!target) {
            alert("请解锁历史科目后再使用")
            return
        }
        let ticket = document.querySelector(".mdi-ticket-account").nextElementSibling.querySelector(".v-progress-linear__content span").innerText
        if (ticket === "0") {
            alert("考试次数不足")
            return
        }
        let id
        let btn_exam = [...target.parentNode.querySelectorAll(".v-btn__content")].find(item => item.innerText === "参加考试")
        if (btn_exam) {
            btn_exam.click()
            await sleep(2000)
            let years = get_history_year()
            let btn = [...document.querySelectorAll(".v-btn__content")].find(item=>item.innerText === "答题")
            btn.click()
            await sleep(1000)
            fill_history(years)
        }
    }

    // 部落 使用装备
    let id_skill
    async function auto_skill() {
        let menu_name = "menu_auto_skill"
        let menu_info = get_menu_info(menu_name)
        if (!get_menu_value(menu_name)) {
            clearInterval(id_skill)
            return
        }
        let skills_info = [
            {"name": "匕首", "icon": "mdi-knife-military"},
            {"name": "衬衫", "icon": "mdi-medical-bag"},
            {"name": "守护天使", "icon": "mdi-flare"},
            {"name": "一杯牛奶", "icon": "mdi-bone"},
            {"name": "星盾", "icon": "mdi-octagram-outline"},
            {"name": "长剑", "icon": "mdi-sword"},
            {"name": "靴子", "icon": "mdi-shoe-cleat"},
            {"name": "三叶草", "icon": "mdi-clover"},
            {"name": "肝脏", "icon": "mdi-stomach"},
            {"name": "火球", "icon": "mdi-fire"},
            {"name": "营火", "icon": "mdi-campfire"},
            {"name": "雪花", "icon": "mdi-snowflake"},
            {"name": "压迫者", "icon": "mdi-emoticon-devil"},
            {"name": "肉盾", "icon": "mdi-octagram-outline"},
            {"name": "腐败的眼睛", "icon": "mdi-laser-pointer"},
            {"name": "巫师帽", "icon": "mdi-shimmer"},
            {"name": "红色杖", "icon": "mdi-pentagram"},
            {"name": "坏了的秒表", "icon": "mdi-timer"},
            {"name": "大理石柱", "icon": "mdi-pillar"},
            {"name": "彩虹之杖", "icon": "mdi-looks"},
            {"name": "毒素", "icon": "mdi-bottle-tonic-skull"},
            {"name": "净化泉", "icon": "mdi-water-opacity"},
        ]
        id_skill = setInterval(async function() {
            let player = [...document.querySelectorAll("div")].find(item => item.innerText === "玩家");
            if (player == null) {
                return
            }
            let skill_bar = player.parentNode.previousElementSibling
            let skills = skill_bar.querySelectorAll(".v-icon");
            for (let skill of [...skills]) {
                if (skills_info.find(item => skill.classList.contains(item.icon) && gmc.get(`ignore_${item.icon}`))) {
                    continue
                }
                skill.click()
                await sleep(100)
            }
        }, 1000)
    }
    // 农场 循环播种
    let id_harvest
    async function auto_harvest() {
        let menu_name = "menu_auto_harvest"
        let menu_info = get_menu_info(menu_name)
        if (!get_menu_value(menu_name)) {
            clearInterval(id_harvest)
            return
        }
        id_harvest = setInterval(function() {
            let btn_seed = document.querySelector(".mdi-seed")
            let btn_refresh = document.querySelector(".mdi-refresh");
            if (btn_refresh == null || btn_seed == null) {
                return
            }
            btn_refresh.click()
        }, 1000)
    }
    // 自动升级
    let id_upgrade
    async function auto_upgrade() {
        let menu_name = "menu_auto_upgrade"
        let menu_info = get_menu_info(menu_name)
        if (!get_menu_value(menu_name)) {
            clearInterval(id_upgrade)
            return
        }
        id_upgrade = setInterval(function() {
            let btn_upgrade = [...document.querySelectorAll(".v-btn__content")].filter(item => item.innerText === "购买").find(item => !item.parentNode.classList.contains('v-btn--disabled'));
            if (btn_upgrade == null) {
                return
            }
            btn_upgrade.click()
        }, 1000)
    }
})();
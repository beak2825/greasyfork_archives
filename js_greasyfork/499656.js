// ==UserScript==
// @name         NGA-FF14生产宏排版器
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  可以解析生产宏序列或是模拟器工序，将其转换为适合在nga展示的多种语言的宏表格
// @author       浮砂
// @match        http*://bbs.nga.cn/post.php?*action=new*
// @match        http*://bbs.nga.cn/post.php?*_newui
// @match        http*://bbs.nga.cn/post.php?*action=reply*
// @match        http*://bbs.nga.cn/post.php?*action=modify*
// @match        http*://ngabbs.com/post.php?*action=new*
// @match        http*://ngabbs.com/post.php?*_newui
// @match        http*://ngabbs.com/post.php?*action=reply*
// @match        http*://ngabbs.com/post.php?*action=modify*
// @match        http*://nga.178.com/post.php?*action=new*
// @match        http*://nga.178.com/post.php?*_newui
// @match        http*://nga.178.com/post.php?*action=reply*
// @match        http*://nga.178.com/post.php?*action=modify*
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499656/NGA-FF14%E7%94%9F%E4%BA%A7%E5%AE%8F%E6%8E%92%E7%89%88%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/499656/NGA-FF14%E7%94%9F%E4%BA%A7%E5%AE%8F%E6%8E%92%E7%89%88%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const i18n = [
        // [ simulator-key, zh-name, ja-name, en-name, awaits, simulator-key-2(BestCraft) ]
        ['muscleMemory', '坚信', '確信', 'Muscle Memory', 3, 'muscle_memory'],
        ['reflect', '闲静', '真価', 'Reflect', 3],
        ['trainedEye', '工匠的神速技巧', '匠の早業', 'Trained Eye', 3, 'trained_eye'],
        ['basicSynth', '制作', '作業', 'Basic Synthesis', 3, 'basic_synthesis'],
        ['basicSynth2', '制作', '作業', 'Basic Synthesis', 3, 'basic_synthesis'],
        ['carefulSynthesis', '模范制作', '模範作業', 'Careful Synthesis', 3, 'careful_synthesis'],
        ['carefulSynthesis2', '模范制作', '模範作業', 'Careful Synthesis', 3],
        ['rapidSynthesis', '高速制作', '突貫作業', 'Rapid Synthesis', 3, 'rapid_synthesis'],
        ['rapidSynthesis2', '高速制作', '突貫作業', 'Rapid Synthesis', 3],
        ['groundwork', '坯料制作', '下地作業', 'Groundwork', 3],
        ['groundwork2', '坯料制作', '下地作業', 'Groundwork', 3],
        ['intensiveSynthesis', '集中制作', '集中作業', 'Intensive Synthesis', 3, 'intensive_synthesis'],
        ['prudentSynthesis', '俭约制作', '倹約作業', 'Prudent Synthesis', 3, 'prudent_synthesis'],
        ['delicateSynthesis', '精密制作', '精密作業', 'Delicate Synthesis', 3, 'delicate_synthesis'],
        ['delicateSynthesis2', '精密制作', '精密作業', 'Delicate Synthesis', 3],
        ['basicTouch', '加工', '加工', 'Basic Touch', 3, 'basic_touch'],
        ['hastyTouch', '仓促', 'ヘイスティタッチ', 'Hasty Touch', 3, 'hasty_touch'],
        ['standardTouch', '中级加工', '中級加工', 'Standard Touch', 3, 'standard_touch'],
        ['byregotsBlessing', '比尔格的祝福', 'ビエルゴの祝福', "Byregot's Blessing", 3, 'byregot_s_blessing'],
        ['preciseTouch', '集中加工', '集中加工', 'Precise Touch', 3, 'precise_touch'],
        ['prudentTouch', '俭约加工', '倹約加工', 'Prudent Touch', 3, 'prudent_touch'],
        ['preparatoryTouch', '坯料加工', '下地加工', 'Preparatory Touch', 3, 'preparatory_touch'],
        ['advancedTouch', '上级加工', '上級加工', 'Advanced Touch', 3, 'advanced_touch'],
        ['trainedFinesse', '工匠的神技', '匠の神業', 'Trained Finesse', 3, 'trained_finesse'],
        ['mastersMend', '精修', 'マスターズメンド', "Master's Mend", 3, 'masters_mend'],
        ['wasteNot', '俭约', '倹約', 'Waste Not', 2, 'waste_not'],
        ['wasteNot2', '长期俭约', '長期倹約', 'Waste Not II', 2, 'waste_not_ii'],
        ['manipulation', '掌握', 'マニピュレーション', 'Manipulation', 2],
        ['veneration', '崇敬', 'ヴェネレーション', 'Veneration', 2],
        ['greatStrides', '阔步', 'グレートストライド', 'Great Strides', 2, 'great_strides'],
        ['innovation', '改革', 'イノベーション', 'Innovation', 2],
        ['observe', '观察', '経過観察', 'Observe', 3],
        ['tricksOfTheTrade', '秘诀', '秘訣', 'Tricks of the Trade', 3, 'tricks_of_the_trade'],
        ['finalAppraisal', '最终确认', '最終確認', 'Final Appraisal', 2, 'final_appraisal'],
        ['heartAndSoul', '专心致志', '一心不乱', 'Heart and Soul', 3, 'heart_and_soul'],

        // 7.0 NEW
        ['refinedTouch', '精炼加工', '洗練加工', 'Refined Touch', 3, 'refined_touch'],
        ['daringTouch', '冒进', 'デアリングタッチ', 'Daring Touch', 3, 'daring_touch'],
        ['immaculateMend', '巧夺天工', 'パーフェクトメンド', 'Immaculate Mend', 3, 'immaculate_mend'],
        ['quickInnovation', '快速改革', 'クイックイノベーション', 'Quick Innovation', 3, 'quick_innovation'],
        ['trainedPerfection', '工匠的绝技', '匠の絶技', 'Trained Perfection', 3, 'trained_perfection'],

        // WILL BE DELETED IN 7.0
        ['focusedSynthesis', '注视制作', '注視作業', 'Focused Synthesis', 3],
        ['focusedTouch', '注视加工', '注視加工', 'Focused Touch', 3],
    ]

    // Init common
    const page = typeof unsafeWindow == 'undefined' ? window : unsafeWindow;
    const $ = page.$;
    const _$ = page._$;
    const commonui = page.commonui;
    if (!commonui) { return; }

    function resolveMacro(macro) {
        const actions = []
        macro.split('\n').forEach(line => {
            const action = line.match(/\/ac\s"?(.*?)"?\s<wait\.\d+>/)?.[1]
            if (action) actions.push(action)
        })

        const mapKeys = [1, 2, 3]

        const invalidActions = []
        const results = []
        actions.forEach(action => {
            let pair
            for (let i = 0; i < mapKeys.length; i++) {
                const key = mapKeys[i]
                pair = i18n.find(i => i[key] === action)
                if (pair) break
            }
            if (!pair) invalidActions.push(action)
            else results.push(pair)
        })
        if (invalidActions.length) {
            console.warn('invalidActions:', invalidActions)
            alert(`以下技能的数据未找到，可能脚本需要更新?\n请联系作者并提供以下技能名以获取详情。\n${invalidActions.join('、')}`)
            return false
        }
        console.log('resolveMacro.results', results)
        return results
    }
    function resolveProcedure(procedure) {
        const actions = JSON.parse(procedure)
        if (!Array.isArray(actions) || !actions?.length) {
            alert('工序格式不正确，请复制生产模拟器的‘导出工序’导出的内容'); return false
        }
        const invalidActions = []
        const results = []
        actions.forEach(action => {
            const pair = i18n.find(i => i[0] === action || i[5] === action)
            if (!pair) invalidActions.push(action)
            else results.push(pair)
        })
        if (invalidActions.length) {
            alert(`以下工序的数据未找到，可能脚本需要更新?\n请联系作者并提供以下工序名以获取详情。\n${invalidActions.join('、')}`)
            return false
        }
        return results
    }

    function dealActions(actions, outLangs = ['zh']) {
        if (!actions?.length) return ''
        const columns = []
        while (actions.length > 0) {
            if (actions.length > 15) {
                columns.push(actions.splice(0, 14));
            } else {
                columns.push(actions.splice(0, actions.length));
            }
        }
        let result = ''
        if (outLangs.includes('zh')) {
            result += '[collapse=中文宏]'
            result += dealColumns(columns, 'zh')
            result += '[/collapse]'
        }
        if (outLangs.includes('ja')) {
            result += '[collapse=日文宏]'
            result += dealColumns(columns, 'ja')
            result += '[/collapse]'
        }
        if (outLangs.includes('en')) {
            result += '[collapse=英文宏]'
            result += dealColumns(columns, 'en')
            result += '[/collapse]'
        }
        result += '\n'
        return result

        function dealColumns(columns, lang = 'zh') {
            let keyIndex = 1
            if (lang === 'ja') keyIndex = 2
            if (lang === 'en') keyIndex = 3

            let result = '[table]\n[tr]\n'
            columns.forEach((column, index) => {
                result += `[td width=1 top]\n` // [b]宏${index + 1}[/b][h][/h]\n`
                result += '[code]'
                column.forEach(pair => {
                    result += `/ac "${pair[keyIndex]}" <wait.${pair[4]}>\n`
                })
                if (column.length < 15) {
                    result += `/e 宏${index + 1} 已完成 <se.${index + 1}>\n`
                }
                result = result.slice(0, -1)
                result += '[/code][/td]\n'
            })
            result += '[/tr][/table]'
            return result
        }
    }

    const openWindow = () => {
        const w = commonui.createadminwindow();
        var modeMacro, modeProcedure, content, outZh, outJa, outEn, autoClose;
        w._.addContent(null);
        w._.addContent(
            '输入类型', _$('/br'),
            modeMacro = _$('/input','type','radio','name','mode','checked',1),'宏 ',
            modeProcedure = _$('/input','type','radio','name','mode'),'模拟器工序 ', _$('/br'),
            '输入内容', _$('/br'),
            content = _$('/textarea', 'placeholder', '请输入宏或模拟器工序内容', 'style', 'width:21em;height:14em;'), _$('/br'),
            '输出语言', _$('/br'),
            outZh = _$('/input','type','checkbox','checked',1),'中文 ',
            outJa = _$('/input','type','checkbox','checked',1),'日文 ',
            outEn = _$('/input','type','checkbox','checked',1),'英文 ',
            _$('/br'),
            '其他选项', _$('/br'),
            autoClose = _$('/input','type','checkbox','checked',1),'生成后自动关闭此窗口 ',
            _$('/br'), _$('/br'),
            _$('/button', 'type', 'button', 'class', 'larger', 'innerHTML', '确认', 'onclick', async () => {
                console.warn('ffm', {modeMacro, modeProcedure, content, outZh, outJa, outEn, autoClose})
                const dealFunc = modeProcedure.checked ? resolveProcedure : resolveMacro
                const actions = dealFunc(content.value)
                if (!actions) return
                const outLangs = []
                if (outZh.checked) outLangs.push('zh')
                if (outJa.checked) outLangs.push('ja')
                if (outEn.checked) outLangs.push('en')
                const result = dealActions(actions, outLangs)
                page.postfunc.addText(result)
                if (autoClose.checked) w._.close()
            })
        );
        w._.addTitle('FF14生产宏排版工具');
        w._.show();
    }
    const generateUI = () => {
        const ui_button = document.createElement('button')
        ui_button.type = 'button'
        ui_button.innerHTML = '插入肥肥宏'
        ui_button.addEventListener('click', openWindow)
        for (var i = 0; i < document.getElementsByTagName('button').length; i++) {
            var len_button = document.getElementsByTagName('button')[i];
            if (len_button.innerHTML === '长度') {
                len_button.after(ui_button)
                return
            }
        }
        throw new Error('未找到元素')
    }

    let retry_count = 0
    const retry = (err) => {
        console.warn('[NGA-FFMacro-Generater] generate failed due to', err, ' . Retrying...')
        retry_count++
        generateUI()
    }

    setTimeout(() => {
        try {
            generateUI()
        } catch (e) {
            if (retry_count < 30) {
                retry(e)
            } else {
                console.error('[NGA-FFMacro-Generater] generate failed and retry count goes to its limit.')
            }
        }
    }, 500)
})();
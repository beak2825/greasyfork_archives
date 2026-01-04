// ==UserScript==
// @name         Fribbels 崩坏：星穹铁道 遗器计算器 汉化插件
// @namespace    https://bbs.nga.cn/nuke.php?func=ucp&uid=41369816
// @license      MIT
// @version      1.0.3
// @description  翻译遗器计算器的基础UI说明。
// @author       浮砂
// @match        http*://fribbels.github.io/hsr-optimizer*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494808/Fribbels%20%E5%B4%A9%E5%9D%8F%EF%BC%9A%E6%98%9F%E7%A9%B9%E9%93%81%E9%81%93%20%E9%81%97%E5%99%A8%E8%AE%A1%E7%AE%97%E5%99%A8%20%E6%B1%89%E5%8C%96%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/494808/Fribbels%20%E5%B4%A9%E5%9D%8F%EF%BC%9A%E6%98%9F%E7%A9%B9%E9%93%81%E9%81%93%20%E9%81%97%E5%99%A8%E8%AE%A1%E7%AE%97%E5%99%A8%20%E6%B1%89%E5%8C%96%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const i18n = new Map([
        /* Top Bar */
        ['Fribbels Honkai Star Rail Optimizer', 'Fribbels的“崩坏：星穹铁道”优化器'],

        /* Left Bar */
        ['Optimization', '优化'],
        ['Optimizer', '优化器'],
        ['Characters', '角色'],
        ['Relics', '遗器'],
        ['Ornament', '饰品'],
        ['Ornaments', '饰品'],
        ['Import / Save', '导入 / 保存'],
        ['Settings', '设置'],
        ['Get Started', '教程'],
        ['Tools', '工具'],
        ['Relic Scorer', '遗器评分'],
        ['Changelog', '更新日志'],
        ['Links', '链接'],

        /* Common: Character */
        ['March 7th', '三月七'],
        ['Dan Heng', '丹恒'],
        ['Himeko', '姬子'],
        ['Welt', '瓦尔特'],
        ['Kafka', '卡芙卡'],
        ['Silver Wolf', '银狼'],
        ['Arlan', '阿兰'],
        ['Asta', '艾丝妲'],
        ['Herta', '黑塔'],
        ['Bronya', '布洛妮娅'],
        ['Seele', '希儿'],
        ['Serval', '希露瓦'],
        ['Gepard', '杰帕德'],
        ['Natasha', '娜塔莎'],
        ['Pela', '佩拉'],
        ['Clara', '克拉拉'],
        ['Sampo', '桑博'],
        ['Hook', '虎克'],
        ['Lynx', '玲可'],
        ['Luka', '卢卡'],
        ['Topaz & Numby', '托帕&账账'],
        ['Qingque', '青雀'],
        ['Tingyun', '停云'],
        ['Luocha', '罗刹'],
        ['Jing Yuan', '景元'],
        ['Blade', '刃'],
        ['Sushang', '素裳'],
        ['Yukong', '驭空'],
        ['Fu Xuan', '符玄'],
        ['Yanqing', '彦卿'],
        ['Guinaifen', '桂乃芬'],
        ['Bailu', '白露'],
        ['Jingliu', '镜流'],
        ['Imbibitor Lunae', '丹恒•饮月'],
        ['Xueyi', '雪衣'],
        ['Hanya', '寒鸦'],
        ['Huohuo', '藿藿'],
        ['Gallagher', '加拉赫'],
        ['Argenti', '银枝'],
        ['Ruan Mei', '阮•梅'],
        ['Aventurine', '砂金'],
        ['Dr. Ratio', '真理医生'],
        ['Sparkle', '花火'],
        ['Black Swan', '黑天鹅'],
        ['Acheron', '黄泉'],
        ['Robin', '知更鸟'],
        ['Firefly', '流萤'],
        ['Misha', '米沙'],
        ['Jade', '翡翠'],
        ['Boothill', '波提欧'],
        ['Caelus (Destruction)', '穹(毁灭)'],
        ['Caelus (Harmony)', '穹(同谐)'],
        ['Caelus (Preservation)', '穹(存护)'],
        ['Stelle (Destruction)', '星(毁灭)'],
        ['Stelle (Harmony)', '星(同谐)'],
        ['Stelle (Preservation)', '星(存护)'],

        /* Main: Optimizer */
        ['Character options', '角色选项'],
        ['Character', '角色'],
        ['Light cone', '光锥'],
        ['Presets', '预设'],
        ['Recommended presets', '推荐的预设集'],
        ['Optimization target', '优化目标'],
        ['Find top results', '查找前?个结果'],
        ['Find top 100 results', '查找前100个结果'],
        ['Find top 1,000 results', '查找前1,000个结果'],
        ['Find top 10,000 results', '查找前10,000个结果'],
        ['Find top 100,000 results', '查找前100,000个结果'],
        ['Find top 1,000,000 results', '查找前1,000,000个结果'],
        ['Sorted by', '根据?排序'],
        ['Damage calculations', '伤害计算'],
        ['Sorted by Basic DMG', '根据普攻伤害排序'],
        ['Sorted by Skill DMG', '根据战技伤害排序'],
        ['Sorted by Ult DMG', '根据终结技伤害排序'],
        ['Sorted by Follow-up DMG', '根据追加攻击伤害排序'],
        ['Sorted by DoT DMG', '根据持续伤害排序'],
        ['Sorted by Break DMG', '根据击破伤害排序'],
        ['Computed ratings', '计算评级'],
        ['Sorted by Weight', '根据权重排序'],
        ['Sorted by Effective HP', '根据有效生命值排序'],
        ['Stats', '属性'],
        ['Sorted by HP', '根据生命值排序'],
        ['Sorted by ATK', '根据攻击力排序'],
        ['Sorted by DEF', '根据防御力排序'],
        ['Sorted by SPD', '根据速度排序'],
        ['Sorted by CRIT Rate', '根据暴击率排序'],
        ['Sorted by CRIT DMG', '根据暴击伤害排序'],
        ['Sorted by Effect HIT', '根据效果命中排序'],
        ['Sorted by Effect RES', '根据效果抵抗排序'],
        ['Sorted by Break Effect', '根据击破特攻排序'],
        ['Sorted by Healing Boost', '根据治疗量加成排序'],
        ['Sorted by Energy Regen', '根据能量恢复效率排序'],
        ['Sorted by Elemental DMG', '根据属性伤害加成排序'],
        ['Character passives', '角色被动'],
        ['Light cone passives', '光锥被动'],
        ['Enemy options', '敌方选项'],
        ['Elemental weakness', '具备该属性的弱点'],
        ['Weakness broken', '正处于弱点击破状态'],
        ['Optimizer options', '优化选项'],
        ['Maxed main stat', '统计最大主属性'],
        ['Allow equipped relics', '计入已被装备的遗器'],
        ['Character priority filter', '角色优先级筛选'],
        ['Keep current relics', '保留当前遗器'],
        ['Priority', '优先级'],
        ['Exclude', '排除'],
        ['Relic enhance / rarity', '遗器强化/稀有度'],
        ['Relic & stat filters', '遗器&属性筛选'],
        ['Main stats', '主属性'],
        ['Head', '头部'],
        ['Hands', '手部'],
        ['Body', '身体'],
        ['Feet', '脚部'],
        ['Sphere', '球'],
        ['Rope', '绳'],
        ['Planar Sphere', '位面球'],
        ['Link Rope', '连结绳'],
        ['Sets', '套装'],
        ['Relic set', '遗器套装'],
        ['Ornament set', '饰品套装'],
        ['HP%', '生命%'],
        ['ATK%', '攻击%'],
        ['DEF%', '防御%'],
        ['CRIT Rate', '暴击率'],
        ['CRIT DMG', '暴击伤害'],
        ['Effect HIT Rate', '效果命中'],
        ['Outgoing Healing', '治疗量加成'],
        ['HEAL', '治疗'],
        ['Speed', '速度'],
        ['Physical DMG', '物理属性伤害'],
        ['Fire DMG', '火属性伤害'],
        ['Ice DMG', '冰属性伤害'],
        ['Lightning DMG', '雷属性伤害'],
        ['Wind DMG', '风属性伤害'],
        ['Quantum DMG', '量子属性伤害'],
        ['Imaginary DMG', '虚数属性伤害'],
        ['Physical', '物理'],
        ['Fire', '火'],
        ['Ice', '冰'],
        ['Lightning', '雷'],
        ['Wind', '风'],
        ['Quantum', '量子'],
        ['Imaginary', '虚数'],
        ['Energy Regeneration Rate', '能量恢复效率'],
        ['Energy', '能量'],
        ['Conditional set effects', '条件：套装效果'],
        ['Substat weight filter', '副属性权重过滤'],
        ['Min weighted rolls per relic', '遗器的最低加权词条数量'],
        ['HP', '生命值'],
        ['ATK', '攻击力'],
        ['DEF', '防御力'],
        ['SPD', '速度'],
        ['CR', '暴击率'],
        ['CD', '暴伤'],
        ['EHR', '命中'],
        ['RES', '抵抗'],
        ['BE', '击破'],
        ['ERR', '充能效率'],
        // Σ CR
        ['Σ HP', 'Σ 生命'],
        ['Σ ATK', 'Σ 攻击'],
        ['Σ DEF', 'Σ 防御'],
        ['Σ SPD', 'Σ 速度'],
        ['Σ CR', 'Σ 暴击'],
        ['Σ CD', 'Σ 暴伤'],
        ['Σ EHR', 'Σ 命中'],
        ['Σ RES', 'Σ 抵抗'],
        ['Σ BE', 'Σ 击破'],
        ['Σ ERR', 'Σ 充能'],
        ['Σ DMG', 'Σ 伤害'],
        ['Page Size:', '每页数据量：'],
        ['WEIGHT', '权重'],
        ['EHP', '有效生命'],
        ['BASIC', '普攻'],
        ['SKILL', '战技'],
        ['ULT', '终结技'],
        ['FUA', '追加攻击'],
        ['DOT', '持续伤害'],
        ['BREAK', '击破伤害'],
        ['COMBO', '组合'],
        ['Break Effect', '击破特攻'],
        ['Stat filters', '属性过滤'],
        ['Effect Hit Rate', '效果命中'],
        ['Effect RES', '效果抵抗'],
        ['Rating filters', '评分过滤'],
        ['Rotation COMBO formula', '旋转组合公式'],
        ['Basic DMG', '普攻伤害'],
        ['Skill DMG', '战技伤害'],
        ['Ult DMG', '终结技伤害'],
        ['Fua DMG', '追加攻击伤害'],
        ['Dot DMG', '持续伤害'],
        ['Break DMG', '击破伤害'],
        ['Additional options', '额外选项'],
        ['Extra combat buffs', '额外战斗buff'],
        //['', ''],
        ['Combat buffs', '战斗buffs'],
        ['HP %', '生命值 %'],
        ['ATK %', '攻击力 %'],
        ['DEF %', '防御力 %'],
        ['Crit Rate %', '暴击率 %'],
        ['Crit Dmg %', '暴击伤害 %'],
        ['Crit DMG %', '暴击伤害 %'],
        ['SPD %', '速度 %'],
        ['BE %', '击破特攻 %'],
        ['Dmg Boost %', '伤害加成 %'],
        ['Teammates', '队友'],
        ['Character custom stats simulation', '角色自定义属性模拟'],
        ['Simulate builds', '模拟构筑'],
        ['Import optimizer build', '导入优化器构筑'],
        ['Off', '关闭'],
        ['Simulate custom substat rolls', '模拟自定义副属性随机'],
        ['Simulate custom substat totals', '模拟自定义副属性总计'],
        ['Options', '选项'],
        ['Substat value totals', '副属性值总计'],
        ['No custom simulations selected', '还未选择任何自定义模拟'],
        ['Simulation name (Optional)', '模拟名称(可选)'],
        ['Permutations', '排列'],
        ['Perms', '排列'],
        ['Searched', '已搜索'],
        ['Results', '结果'],
        ['Progress', '进度'],
        ['Controls', '控制'],
        ['Start optimizer', '开始优化'],
        ['Cancel', '取消'],
        ['Reset', '重设'],
        ['Stat and filter view', '属性和筛选的视图'],
        ['Basic stats', '基本属性'],
        ['Combat stats', '战斗属性'],
        ['Filter', '筛选'],
        ['Equip', '装备'],

        /* Main: Import/Save */
        ['Relic scanner importer', '遗器扫描导入'],
        ['Install and run one of the relic scanner options:', '安装并运行以下遗器扫描选项之一：'],
        ['(Recommended) IceDynamix Reliquary Archiver', '(推荐) IceDynamix Reliquary Archiver'],
        ['Accurate speed decimals, instant scan', '迅速的扫描，提供精确的速度小数'],
        ['Imports full inventory and character roster', '导入完整的库存和角色名单'],
        ['Inaccurate speed decimals, 5-10 minutes OCR scan', '5-10分钟的OCR扫描，提供不准确的速度小数'],
        ['Inaccurate speed decimals, instant scan', '迅速的扫描，提供不准确的速度小数'],
        ['No download needed, but limited to relics from the 8 characters on profile showcase', '无需下载，但只能获取到角色展柜中角色的遗器'],
        ["No download needed, but limited to ingame characters' equipped relics", '无需下载，但只能获取到游戏内角色的遗器'],
        ['Upload scanner json file', '上传扫描获取的json文件'],
        ['or', '或'],
        ['Paste json file contents', '在这里粘贴json文件的内容'],
        ['Import relics', '导入遗器'],
        ['Import relics & characters', '导入遗器和角色'],
        ["Import relics only. Updates the optimizer with the new dataset of relics and doesn't overwrite builds.", '仅导入遗器。使用新的遗器数据集来更新优化器，不会覆盖已有构筑。'],
        ['OR', '或者'],
        ['Import relics and characters. Replaces the optimizer builds with ingame builds.', '导入遗器和角色。使用游戏内的已装备套装来覆盖优化器的已有构筑。'],
        ['Overwrite optimizer builds', '覆盖优化器的构筑'],
        ['Are you sure you want to overwrite your optimizer builds with ingame builds?', '你确定要用游戏内的已装备套装来覆盖优化器的已有构筑吗?'],
        ['Yes', '是'],
        ['', ''],
        ['', ''],
        ['', ''],
        ['', ''],
        ['Load optimizer data', '读取优化器数据'],
        ['Load your optimizer data from a file.', '从特定文件中读取您的优化器数据。'],
        ['Load save data', '读取保存的数据'],
        ['Invalid save file, please try a different file. Did you mean to use Relic Importer tab?', '无效的保存文件，请尝试其他文件。或者您其实需要前往遗器导入页面？'],
        ['Done!', '成功！'],
        ['Save optimizer data', '保存优化器数据'],
        ['Save your optimizer data to a file.', '将您的优化器数据保存到一个文件里。'],
        ['Save data', '保存数据'],
        ['Clear optimizer data', '清除优化器数据'],
        ['Clear all optimizer data.', '清除所有的优化器数据。'],
        ['Clear data', '清除数据'],

        /* Modal: Select Character*/
        ['Select a character', '选择一个角色'],
        ['Search character name', '搜索角色名称'],

        /* Modal: Select Lightcone*/
        ['Select a light cone', '选择一个光锥'],

        /* Popup: Suit */
        ['4 Piece', '四件套'],
        ['2 + 2 Piece', '2组二件套'],
        ['2 + Any', '1组二件套'],

        /* Tips */
        [
            'Select the character and eidolon. Character is assumed to be level 80 with maxed traces in optimization calcs.',
            '选择角色与星魂等级(右侧E几)。在模拟计算中，角色默认为80级且满行迹。'
        ],
        [
            'Select the light cone and superimposition. Light cone is assumed to be level 80 in optimization calcs.',
            '选择光锥与叠影等级(右侧S几)。在模拟计算中，光锥默认为80级。'
        ],
        [
            'Superimposition and passive effects are applied under the Light cone passives panel.',
            '叠影效果和光锥被动效果均会应用于"光锥被动"栏目。'
        ],
        [
            'Select the conditional effects to apply to the character.',
            '选择要应用于角色的状态效果。'
        ],
        [
            'Effects that rely on combat stats or environment state will be applied by default, so only the options that require user input are listed here.',
            '默认情况下，将应用依赖于战斗统计数据或环境状态的效果，因此此处仅列出需要您选择的选项。'
        ],
        [
            'Select the conditional effects to apply to the light cone.',
            '选择要应用于光锥的状态效果。'
        ],
        [
            'Level - Enemy level, affects enemy DEF calculations',
            '等级(Level) - 敌人的等级，会影响其防御力的计算'
        ],
        [
            'Targets - Number of targets in the battle. The target enemy is always assumed to be in the center, and damage calculations are only for the single primary target.',
            '目标(Targets) - 战斗中的目标数量。目标敌人总是被假设在中心，并且伤害计算仅针对单个主要目标。'
        ],
        [
            `RES - Enemy elemental RES. RES is set to 0 when the enemy's elemental weakness is enabled.`,
            '抗性(RES) - 敌人对选定角色所属属性的抗性。当"具备该属性的弱点"选项激活时抗性将被设为0。'
        ],
        [
            `Max toughness - Enemy's maximum toughness bar value. Affects calculations related to break damage.`,
            '最大韧性(Max toughness) - 敌人的最大韧性条值。影响与击破伤害相关的计算。'
        ],
        [
            `Elemental weakness - Whether the enemy is weak to the character's type. Enabling this sets enemy elemental RES % to 0.`,
            '具备该属性的弱点(Elemental weakness) - 敌人是否具备角色所属属性的弱点。激活此项时会将其抗性设为0。'
        ],
        [
            `Weakness broken - Whether the enemy's toughness bar is broken. Affects damage calculations and certain character passives.`,
            '正处于弱点击破状态(Weakness broken) - 敌人的韧性条是否已被击破。影响伤害计算和某些角色的被动效果。'
        ],
        [
            `Select main stats to use for optimization search. Multiple values can be selected for more options`,
            '选择主属性以供优化器检索。通过更多选项可以选择多个筛选项。'
        ],
        [
            `Select the relic and ornament sets to filter results by. Multiple sets can be selected for more options`,
            '选择要过滤的遗器/位面饰品套装。通过更多选项可以选择多个筛选项。'
        ],
        [
            `Set effects will be accounted for in calculations, use the Conditional set effects menu to customize which effects are active.`,
            '套装效果将在优化中被计入，使用“条件：套装效果”菜单自定义哪些效果会被激活。'
        ],
        [
            `This filter is used to reduce the number of permutations the optimizer has to process.`,
            '该过滤器用于减少优化器需要处理的排列次数。'
        ],
        [
            `It works by first scoring each relic per slot by the weights defined, then filtering by the number of weighted min rolls the relic has.`,
            '它的工作原理是，首先根据定义的权重对每个位置的遗器进行评分，然后根据加权后的词条命中数进行过滤。'
        ],
        [
            `Only relics that have more than the specified number of weighted rolls will be used for the optimization search.`,
            '只有计算权重之后词条数量超过指定阈值的遗器才会被优化器检索。'
        ],
        [
            `Note that setting the minimum rolls too low may result in some builds not being displayed, if the filter ends up excludes a key relic. Use this filter with caution, but on large searches it makes a large impact on reducing search time.`,
            '需要注意的是，将遗器的最低加权词条数量设置得太低可能会导致过滤器排除某个关键遗器，导致某些构筑无法显示。请谨慎使用该过滤器，即使它在大型检索中对缩短检索时间有显著影响。'
        ],
        [
            `Min (left) / Max (right) filters for character stats, inclusive. The optimizer will only show results within these ranges`,
            '角色属性将被限定在筛选器规定的阈值内，左侧为最小值，右侧为最大值，包含临界值在内。优化器将只会显示这些范围内的结果。'
        ],
        [
            `Stat abbreviations are ATK / HP / DEF / SPD / Crit Rate / Crit Damage / Effect Hit Rate / Effect RES / Break Effect`,
            '部分属性名因UI空间问题采用了缩写。'
        ],
        [
            `NOTE: Ingame speed decimals are truncated so you may see speed values ingame higher than shown here. This is because the OCR importer can't detect the hidden decimals.`,
            '注意：游戏中面板显示的速度是取整的，因此您在游戏中看到的速度值可能高于此处显示的值。如果您使用基于 OCR 的方式导入遗器，计算器将无法检测到被隐藏的速度值小数点。'
        ],
        [
            `Weight - Sum of substat weights of all 6 relics, from the Substat weight filter`,
            '权重 - 所有部位遗器的权重值之和，根据"副属性权重过滤"区域的设置计算'
        ],
        [
            `Ehp - Effective HP, measuring how tanky a max level character is. Calculated using HP & DEF & damage reduction passives`,
            '有效生命 - 评估一个最高等级的角色有多耐揍。根据生命值、防御力和减伤被动来计算。'
        ],
        [
            `Basic / Skill / Ult / Fua (Follow-up attack) / Dot (Damage over time) - Skill damage calculations, based on the environmental factors in character passives / light cone passives / enemy options.`,
            '普攻/战技/终结技/追加攻击/持续伤害 - 计算技能的伤害，基于角色被动/光锥被动/敌人等选项的环境因素。'
        ],
        /*[
            ``,
            ''
        ],*/
    ])

    const alertbak = window.alert.bind(window)
    window.alert = (message) => {
        if (i18n.has(message)) message = i18n.get(message)
        return alertbak(message)
    }
    const confirmbak = window.confirm.bind(window)
    window.confirm = (message) => {
        if (i18n.has(message)) message = i18n.get(message)
        return confirmbak(message)
    }
    const promptbak = window.prompt.bind(window)
    window.prompt = (message, _default) => {
        if (i18n.has(message)) message = i18n.get(message)
        return promptbak(message, _default)
    }

    replaceText(document.body)

    const bodyObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(addedNode => replaceText(addedNode))
        })
    })
    bodyObserver.observe(document.body, { childList: true, subtree: true })

    function cleanStr(str) {
        if (!str) return str
        let trimmedStr = str.replace(/^\s+|\s+$/gm,'');
        return trimmedStr;
    }
    function getReplace(ori, key, value) {
        return ori?.replace(key, cleanStr(value))
    }
    function replaceText(node) {
        nodeForEach(node).forEach(textNode => {
            const nodeValue = cleanStr(textNode.nodeValue)
            const innerText = cleanStr(textNode.innerText)
            const tNodeValue = cleanStr(textNode.value)
            const placeHolder = cleanStr(textNode.placeholder)
            // console.log({nodeValue,innerText,tNodeValue,placeHolder})
            if (textNode instanceof Text && i18n.has(nodeValue)) {
                textNode.nodeValue = getReplace(textNode.nodeValue, nodeValue, i18n.get(nodeValue))
            } else if (i18n.has(innerText)) {
                textNode.innerText = getReplace(textNode.innerText, innerText, i18n.get(innerText))
            } else if (textNode instanceof HTMLInputElement) {
                if (textNode.type === 'button' && i18n.has(tNodeValue)) {
                    textNode.value = getReplace(textNode.value, tNodeValue, i18n.get(tNodeValue))
                } else if ('text;password;search'.indexOf(textNode.type) >= 0 && i18n.has(placeHolder)) {
                    textNode.placeholder = getReplace(textNode.placeholder, placeHolder, i18n.get(placeHolder))
                } else {
                    //console.log('invalid HTMLInputElement textNode:', textNode)
                }
            }
            else {
                //console.log('invalid textNode:', textNode)
            }
        })
    }

    function nodeForEach(node) {
        const list = []
        if (node.childNodes.length === 0) list.push(node)
        else {
            node.childNodes.forEach(child => {
                if (child.childNodes.length === 0) list.push(child)
                else list.push(...nodeForEach(child))
            })
        }
        return list
    }
})();
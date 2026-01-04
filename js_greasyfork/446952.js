// ==UserScript==
// @name         Legna UI Mix
// @version      2.1.1
// @namespace    Legna
// @description  这个东西是给idle游戏准备的 没有什么附加功能，单纯就是改变界面 不适合所有人，适当接受建议 感谢原作者班登
// @author       limitedmeng@icloud.com
// @grant        GM_addStyle
// @run-at       document-start
// @match        https://www.idleinfinity.cn/*
// @exclude       https://www.idleinfinity.cn/Home/Login*
// @exclude       https://www.idleinfinity.cn/Home/Validate*
// @exclude       https://www.idleinfinity.cn/Home/EditPassword*
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.1/moment.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-url-parser/2.3.1/purl.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446952/Legna%20UI%20Mix.user.js
// @updateURL https://update.greasyfork.org/scripts/446952/Legna%20UI%20Mix.meta.js
// ==/UserScript==

const defaultFilterOptions = [''];

let config = {
    userNumber: 1,
    showRequire: true,
    fastFilter: true,
    fastOptions: defaultFilterOptions.slice(0), // 快速过滤器配置，可自行增删
    showSpellColor: true,
    showSpeedLevel: true,
    showCharDmg: true,
    showAccuracy: true,
    dropNotification: true,
    itemStats: true,
    showBattle: true,
    mapHack: true,
    mapHackType: 'all',
    infiniteMap: false,
    showSetAttr: true,
    showAuctionNote: true,
    auctionWatch: true,
    oneKeyEquip: true,
    oneKeyAgree: true,
    oneKeyRune: true,
    showRuneTip: true,
    showBattleDetail: true,
    d3theme: true,
    minLevel: null,
    // 秘境的石头等级  0 表示普通 1表示魔法 2表示稀有,以此类推 按照下拉列表的排序
    level: '',
    moveTime: 5000,
    failure: 10,
    magical: true,
};

const configLabel = {
    showRequire: '职业专属显示',
    fastFilter: '快速过滤选项',
    showSpellColor: '法术技能高亮',
    showSpeedLevel: '显示速度档位',
    showCharDmg: '角色均伤显示',
    showAccuracy: '角色命中显示',
    dropNotification: '欧皇暗金通知',
    itemStats: '欧皇收获统计',
    showBattle: '快速秘境战斗',
    mapHack: '秘境自动战斗',
    infiniteMap: '无限秘境模式',
    showSetAttr: '显示套装属性',
    showAuctionNote: '显示拍卖备注',
    auctionWatch: '拍卖特别关注',
    oneKeyEquip: '一键换装功能',
    oneKeyAgree: '一键同意功能',
    oneKeyRune: '一键转移符文',
    showRuneTip: '符文之语提示',
    showBattleDetail: '战斗详细分析',
    d3theme: '暗黑界面皮肤',
    minLevel: '符文序号',
    failure: '失败重置次数',
    magical: '一件升级蓝色秘境',
};

const userConfig = ['dropNotification', 'd3theme'];

let localConfig = localStorage.getItem('idle-ui-config');
if (localConfig) {
    localConfig = JSON.parse(localConfig);
    Object.keys(localConfig).map(key => {
        if (config[key] !== undefined) config[key] = localConfig[key];
    });
}

if (config.d3theme) {
    const htmlElement = document.getElementsByTagName('html')[0];
    htmlElement.setAttribute('class', 'd3');
}
(function(doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function() {
            var clientWidth = docEl.clientWidth;//clientWidth是设计稿宽度
            if (!clientWidth) return;
            docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

function idleInit() {

    // 秘境的石头等级 ''空表示所有秘境 0 表示普通 1表示魔法 2表示稀有,以此类推 按照下拉列表的排序
    config.level = '';
    // 转移物品间隔时间,单位毫秒,最低不能低于300,会被制裁
    config.moveTime = 500;
    // 战斗失败重置次数,当同一组怪物失败到达此次数,自动重置当前秘境
    config.failure = 25;
    // 是否绕着Boss走
    config.dodge = false;
    // 同意消息间隔时间
    config.agreedTime = 300;
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `.eq-weapon { background-color: #700;} .eq-armor {background-color: #007;} .eq-amulet {background-color: #0b0;} .eq-delete {background-color: gray;}
        .eq-jewel {background-color: #808a87;} .selected-b {border: 1px solid #66ccff!important;} .selected-r {border: 1px solid #f00!important;} .selected-d {border: 1px solid #fff!important;}`;
    document.getElementsByTagName('head')[0].appendChild(style);

    // Extend page width
    // $('.container:nth(1)').css('width', '70%');
    $('body').css('height', $('body').height() + 500);

    var equips = $(".panel-filter").parent().prev().find(".equip-content");
    var on_gears = $('.equip-container .equip-content');
    var i, gear, ps, hits, key, n_name, eqn;
    for (i = 0; i < on_gears.length; i++) {
        gear = on_gears[i];
        ps = gear.getElementsByTagName('p');
        if (ps.length > 0) {
            hits = gear.innerHTML.match(/彩虹刻面/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                hits = gear.innerHTML.match(/(\d+)陨石/);
                if (hits != null) {
                    eqn[eqn.length - 1].innerHTML += ' <span style="color:red; background-color: transparent;">🔥刻 ' + hits[1] + 'slv</span>';
                }
                hits = gear.innerHTML.match(/(\d+)暴风雪/);
                if (hits != null) {
                    eqn[eqn.length - 1].innerHTML += ' <span style="color:#3ff; background-color: transparent;">🧊刻 ' + hits[1] + 'slv</span>';
                }
                 hits = gear.innerHTML.match(/(\d+)准确率/);
                if (hits != null) {
                    eqn[eqn.length - 1].innerHTML += ' <span style="color:#3ff; background-color: transparent;">准确 ' + hits[1] + 'slv</span>';
                }
                hits = gear.innerHTML.match(/(\d+)连锁闪电/);
                if (hits != null) {
                    eqn[eqn.length - 1].innerHTML += ' <span style="color:yellow; background-color: transparent;">⚡️刻 ' + hits[1] + 'slv</span>';
                }
                hits = gear.innerHTML.match(/(\d+)剧毒新星/);
                if (hits != null) {
                    eqn[eqn.length - 1].innerHTML += ' <span style="color:#00c400; background-color: transparent;">🦠刻 ' + hits[1] + 'slv</span>';
                }
                hits = gear.innerHTML.match(/(\d+)虚化/);
                if (hits != null) {
                    eqn[eqn.length - 1].innerHTML += ' <span style="color:#B659F5; background-color: transparent;">🔮刻 ' + hits[1] + 'slv</span>';
                }
                hits = gear.innerHTML.match(/(\d+)伤害加深/);
                if (hits != null) {
                    eqn[eqn.length - 1].innerHTML += ' <span style="color:white; background-color: transparent;">⚔️刻</span>';
                }
                hits = gear.innerHTML.match(/(\d+)\% 火焰伤害/);
                if (hits != null) {
                    eqn[eqn.length - 1].innerHTML += ' <span style="color:red; background-color: transparent;">+' + hits[1] + '</span>';
                }
                hits = gear.innerHTML.match(/(\d+)\% 冰冷伤害/);
                if (hits != null) {
                    eqn[eqn.length - 1].innerHTML += ' <span style="color:#3ff; background-color: transparent;">+' + hits[1] + '</span>';
                }
                hits = gear.innerHTML.match(/(\d+)\% 闪电伤害/);
                if (hits != null) {
                    eqn[eqn.length - 1].innerHTML += ' <span style="color:yellow; background-color: transparent;">+' + hits[1] + '</span>';
                }
                hits = gear.innerHTML.match(/(\d+)\% 毒素伤害/);
                if (hits != null) {
                    eqn[eqn.length - 1].innerHTML += ' <span style="color:#00c400; background-color: transparent;">+' + hits[1] + '</span>';
                }
                hits = gear.innerHTML.match(/(\d+)\% 魔法伤害/);
                if (hits != null) {
                    eqn[eqn.length - 1].innerHTML += ' <span style="color:#B659F5; background-color: transparent;">+' + hits[1] + '🔮 </span>';
                }
                hits = gear.innerHTML.match(/(\d+)\% 物理伤害/);
                if (hits != null) {
                    eqn[eqn.length - 1].innerHTML += ' <span style="color:white; background-color: transparent;">+' + hits[1] + '⚔️ </span>';
                }
                hits = gear.innerHTML.match(/(\d+)\% 目标火焰抗性/);
                if (hits != null) {
                    eqn[eqn.length - 1].innerHTML += ' <span style="color:red; background-color: transparent;">-' + hits[1] + '</span>';
                }
                hits = gear.innerHTML.match(/(\d+)\% 目标冰冷抗性/);
                if (hits != null) {
                    eqn[eqn.length - 1].innerHTML += ' <span style="color:#3ff; background-color: transparent;">-' + hits[1] + '</span>';
                }
                hits = gear.innerHTML.match(/(\d+)\% 目标闪电抗性/);
                if (hits != null) {
                    eqn[eqn.length - 1].innerHTML += ' <span style="color:yellow; background-color: transparent;">-' + hits[1] + '</span>';
                }
                hits = gear.innerHTML.match(/(\d+)\% 目标毒素抗性/);
                if (hits != null) {
                    eqn[eqn.length - 1].innerHTML += ' <span style="color:#00c400; background-color: transparent;">-' + hits[1] + '</span>';
                }
            }
            hits = gear.innerHTML.match(/攻击速度提升 (\d+)\%/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:#ffd700; background-color: transparent;">' + hits[1] + '攻速 </span>';
            }
            hits = gear.innerHTML.match(/施法速度提升 (\d+)\%/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:#ff8000; background-color: transparent;">' + hits[1] + '施法 </span>';
            }
            /* hits = gear.innerHTML.match(/\+(\d+)\% 增强伤害/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:#66ccff; background-color: transparent;">' + hits[1] + '增伤 </span>';
            }*/
            hits = gear.innerHTML.match(/\+(\d+)\% 暴击几率/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:#CCCC00; background-color: transparent;">' + hits[1] + '暴击 </span>';
            }
            hits = gear.innerHTML.match(/\-(\d+)\% 目标伤害/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:#CCCC00; background-color: transparent;">' + hits[1] + '减伤 </span>';
            }
            hits = ps[ps.length - 1].textContent.match(/凹槽(\(\d+\/\d+\))/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name')
                eqn[eqn.length - 1].innerHTML += ' <span>' + hits[1] + '槽 </span>';
            }
            hits = gear.innerHTML.match(/\+(\d+)\% 更佳的机会取得魔法装备/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:white; background-color: transparent;"> ' + hits[1] + '🍀 </span>';
            }

            hits = gear.innerHTML.match(/\+(\d+)\% 额外金币从怪物身上取得/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:gold; background-color: transparent;"> ' + hits[1] + '💰 </span>';
            }
            hits = gear.innerHTML.match(/元素抗性 \+(\d+)\%/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:#f90; background-color: transparent;">' + hits[1] + '🛡 </span>';
            }
            //----------------技能------------------
            hits = gear.innerHTML.match(/\+(\d+) 武僧真言技能/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:lightblue; background-color: transparent;"> ' + hits[1] + '真言 </span>';
            }
            hits = gear.innerHTML.match(/\+(\d+) 武僧武学技能/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:lightblue; background-color: transparent;"> ' + hits[1] + '武学 </span>';
            }
            hits = gear.innerHTML.match(/\+(\d+) 骑士光环技能/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:lightblue; background-color: transparent;"> ' + hits[1] + '光环 </span>';
            }
            hits = gear.innerHTML.match(/\+(\d+) 骑士惩戒技能/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:lightblue; background-color: transparent;"> ' + hits[1] + '惩戒 </span>';
            }
            hits = gear.innerHTML.match(/\+(\d+) 骑士技能/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:lightblue; background-color: transparent;"> ' + hits[1] + '骑技 </span>';
            }
            hits = gear.innerHTML.match(/\+(\d+) 法师技能/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:lightblue; background-color: transparent;"> ' + hits[1] + '法技 </span>';
            }
            hits = gear.innerHTML.match(/\+(\d+) 武僧技能/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:lightblue; background-color: transparent;"> ' + hits[1] + '僧技 </span>';
            }
            hits = gear.innerHTML.match(/\+(\d+) 萨满技能/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:lightblue; background-color: transparent;"> ' + hits[1] + '萨技 </span>';
            }
            hits = gear.innerHTML.match(/\+(\d+) 牧师技能/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:lightblue; background-color: transparent;"> ' + hits[1] + '牧技 </span>';
            }
            hits = gear.innerHTML.match(/\+(\d+) 贤者技能/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:lightblue; background-color: transparent;"> ' + hits[1] + '贤技 </span>';
            }
            hits = gear.innerHTML.match(/\+(\d+) 所有技能/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:darkpink; background-color: transparent;"> ' + hits[1] + '全技 </span>';
            }
            hits = gear.innerHTML.match(/\+(\d+) 死灵技能/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:darkpink; background-color: transparent;"> ' + hits[1] + '死技 </span>';
            }
            hits = gear.innerHTML.match(/\+(\d+) 游侠技能/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:darkpink; background-color: transparent;"> ' + hits[1] + '游技 </span>';
            }
            hits = gear.innerHTML.match(/\+(\d+) 法师元素技能/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:lightblue; background-color: transparent;"> ' + hits[1] + '法元 </span>';
            }
            hits = gear.innerHTML.match(/\+(\d+) 法师冥想技能/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:lightblue; background-color: transparent;"> ' + hits[1] + '法冥 </span>';
            }
            hits = gear.innerHTML.match(/\+(\d+) 战士作战技能/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:lightblue; background-color: transparent;"> ' + hits[1] + '作战 </span>';
            }
            hits = gear.innerHTML.match(/\+(\d+) 战士防御技能/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:lightblue; background-color: transparent;"> ' + hits[1] + '战防 </span>';
            }
            hits = gear.innerHTML.match(/\+(\d+) 游侠远程技能/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:lightblue; background-color: transparent;"> ' + hits[1] + '远程 </span>';
            }
            hits = gear.innerHTML.match(/\+(\d+) 游侠辅助技能/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:lightblue; background-color: transparent;"> ' + hits[1] + '游辅 </span>';
            }
            hits = gear.innerHTML.match(/\+(\d+) 牧师神圣技能/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:lightblue; background-color: transparent;"> ' + hits[1] + '神牧 </span>';
            }
            hits = gear.innerHTML.match(/\+(\d+) 牧师暗影技能/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:lightblue; background-color: transparent;"> ' + hits[1] + '暗牧 </span>';
            }
            hits = gear.innerHTML.match(/\+(\d+) 刺客格斗技能/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:lightblue; background-color: transparent;"> ' + hits[1] + '格斗 </span>';
            }
            hits = gear.innerHTML.match(/\+(\d+) 刺客刺杀技能/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:lightblue; background-color: transparent;"> ' + hits[1] + '刺杀 </span>';
            }
            hits = gear.innerHTML.match(/\+(\d+) 萨满增强技能/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:lightblue; background-color: transparent;"> ' + hits[1] + '萨增 </span>';
            }
            hits = gear.innerHTML.match(/\+(\d+) 萨满元素技能/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:lightblue; background-color: transparent;"> ' + hits[1] + '萨元 </span>';
            }
            hits = gear.innerHTML.match(/\+(\d+) 死灵白骨技能/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:lightblue; background-color: transparent;"> ' + hits[1] + '白骨 </span>';
            }
            hits = gear.innerHTML.match(/\+(\d+) 死灵召唤技能/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:lightblue; background-color: transparent;"> ' + hits[1] + '召唤 </span>';
            }
            hits = gear.innerHTML.match(/\+(\d+) 贤者变形技能/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:lightblue; background-color: transparent;"> ' + hits[1] + '变形 </span>';
            }
            hits = gear.innerHTML.match(/\+(\d+) 贤者自然技能/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:lightblue; background-color: transparent;"> ' + hits[1] + '自然 </span>';
            }
        }
    }

    addConfig(



    );
    // 显示限定字符
    switchSkin(config.showRequire);
    Notification.requestPermission();

    $('.navbar-nav > li > a').each(function () {
        if ($(this).text().indexOf('帮助') >= 0) {
            const links = [
                {text: '🟠暗金列表', link: '/Help/Content?url=Unique'},
                {text: '🟢套装列表', link: '/Help/Content?url=Set'},
                {text: '🟢秘境圣衣', link: '/Help/Content?url=Sacred'},
                {text: '🟣神器列表', link: '/Help/Content?url=Artifact'},
                {text: '⚪️普通物品', link: '/Help/Content?url=BaseEquip'},
                {text: '🔳前缀属性', link: '/Help/Content?url=Prefix'},
                {text: '🔳后缀属性', link: '/Help/Content?url=Suffix'},
                {text: '🔳固定词缀', link: '/Help/Content?url=SpecialAffix'},
                {text: '🫥神秘玩具', link: '/Help/specialequip'},
            ].map(item => {
                return `<li><a class="base" href="${item.link}" target="_blank">${item.text}</a></li>`;
            }).join('');
            $(this).next().append(links);
        }
    });

    function fetchItem(name, callback) {
        if (!name) return;
        if (quickSearchType === 'Set' || quickSearchType === 'Unique') {
            $.get(`/Help/${quickSearchType}`, function (html) {
                const dom = $.parseHTML(html);
                const type = quickSearchType.toLowerCase();
                $(dom).find(`.equip > .${type}`).each(function () {
                    if ($(this).text().indexOf(name) >= 0) {
                        callback($(this).parent());
                        return;
                    }
                });
            });
        } else {
            $.get('/Help/Artifact', function (html) {
                const dom = $.parseHTML(html);
                $(dom).find('tr').each(function (i) {
                    if (i > 0) {
                        const nameLabel = $(this).children().last().find('.artifact');
                        if (nameLabel.text().indexOf(name) >= 0) {
                            const ret = [];
                            ret.push(`<p class="artifact">${nameLabel.text()}</p>`);
                            $(this).children().first().children('div').each(function () {
                                ret.push(`<p class="physical">${$(this).text()}</p>`);
                            });
                            ret.push('<p class="artifact">神器</p>');
                            nameLabel.parent().children().each(function (index) {
                                if (index > 0) ret.push(`<p>${$(this).text()}</p>`);
                            });
                            const recipe = [];
                            $(this).children().eq(1).find('.artifact.equip-name').each(function () {
                                const id = $(this).text().match(/\d+/g)[0];
                                recipe.push(`<span class="artifact">${id}#</span>`);
                            });
                            ret.push(`<p class="physical">${recipe.join(' + ')}</p>`);
                            callback($(`<div class="equip">${ret.join('')}</div>`));
                            return;
                        }
                    }
                });
            });
        }
    }

    let quickSearchType = 'Unique';
    const itemTypes = `
    <div class="btn-group">
      <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">
        <span id="idle-quick-type">🟠暗金</span><span class="caret" style="margin-left: 5px;"></span>
      </button>
      <ul class="dropdown-menu">
          <li><a class="quick-option unique" data-type="Unique" href="javascript: void(0);">🟠暗金</a></li>
          <li><a class="quick-option set" data-type="Set" href="javascript: void(0);">🟢套装</a></li>
          <li><a class="quick-option artifact" data-type="Artifact" href="javascript: void(0);">🟣神器</a></li>
      </ul>
    </div>
  `;
    const input = `<div id="idle-ui-quicksearch">${itemTypes}<input placeholder="搜索..." class="form-control"/><div class="popover" style="display: none; left: 60px; top: 28px;"><div class="popover-content"></div></div></div>`;
    $('.navbar-header').append(input);

    $('.quick-option').click(function (e) {
        e.preventDefault();
        quickSearchType = $(this).data('type');
        $('#idle-quick-type').text($(this).text());
        const val = $('#idle-ui-quicksearch > input').val();
        if (val) {
            const popover = $('#idle-ui-quicksearch > input').next();
            popover.hide();
            fetchItem(val, function (html) {
                popover.children().first().html(html);
                popover.show();
            });
        }
    });

    let quickTimer = null;
    $('#idle-ui-quicksearch > input').keyup(function () {
        if (quickTimer) {
            clearTimeout(quickTimer);
            quickTimer = null;
        }
        const val = $(this).val();
        if (!val) $(this).next().hide();
        quickTimer = setTimeout(() => {
            const popover = $(this).next();
            popover.hide();
            fetchItem(val, function (html) {
                popover.children().first().html(html);
                popover.show();
            });
        }, 500);
    });

    if (config.fastFilter) {
        const fastOptions = (['无'].concat(config.fastOptions)).map(function (item) {
            return `<li><a href="javascript: void(0);" class="filter-text" style="color: white">${item}</a></li>`;
        }).join('');

        const fastFilter = '<div class="fast-filter btn-group">' +''+ `<ul class="dropdown-menu">${fastOptions}</ul></div>`;
        $(fastFilter).insertAfter('.panel-filter');

        $('.filter-text').click(function () {
            const text = $(this).text() === '无' ? '' : $(this).text();
            const filter = $(this).parent().parent().parent().prev();
            filter.val(text);
            filter.trigger('input');
        });
    }

    if (config.showSpellColor) {
        $('.skill-name').each(function () {
            let desc = '';
            let label = '';
            if ($(this).children().length === 2) {
                desc = $(this).next().text();
                label = $(this).children().last();
            } else {
                desc = $(this).parent().next().text();
                label = $(this);
            }
            if (desc.indexOf('法术技能') >= 0) {
                label.addClass('skill');
            }
        });
    }

    function getSpeedLevel(speed, isAttack) {
        const levels = isAttack ? [0, -25, -50, -80, -120, -160, -200] : [0, -20, -45, -75, -110, -145, -180];
        for (let i = 0; i < levels.length; i++) {
            if (speed > levels[i]) {
                const next = levels[i];
                return [i, next];
            }
        }
        return [levels.length, '已最高'];
    }

    function getAvgDmg(dmgStr) {
        const dmgArray = dmgStr.split('~');
        const avg = (((dmgArray[0] - 0) + (dmgArray[1] - 0)) / 2);
        return avg;
    }

    function getKeySkill() {
        let ret = {name: '', accRate: 0, dmgRate: 0};
        $('span.label.label-danger').each(function () {
            if (!$(this).hasClass('sr-only') && $(this).text().indexOf('K') >= 0) {
                ret.name = $(this).prev().text();
                const skill = $(this).parent().next().text();
                ret.isAttack = skill.indexOf('攻击技能') >= 0;
                if (ret.isAttack) {
                    const accMatch = skill.match(/提升(\d+)%准确率/);
                    const dmgMatch = skill.match(/(\d+)%基础伤害/);
                    if (accMatch) ret.accRate = (accMatch[1] - 0) / 100;
                    if (dmgMatch) ret.dmgRate = (dmgMatch[1] - 0) / 100;
                }
            }
        });
        return ret;
    }

    function renderCharLabel(name, value, id) {
        const idStr = id ? `id="${id}"` : '';
        return `<p><span>${name}：</span><span ${idStr} class="state">${value}</span></p>`;
    }

    if (location.href.indexOf('Character/Detail') >= 0) {
        const keySkill = getKeySkill();
        let level = 0;
        $('.label.label-default').each(function () {
            const label = $(this).text();
            if (label.indexOf('Lv') >= 0 && level === 0) {
                level = label.replace('Lv', '') - 0;
            }
            if (config.showSpeedLevel) {
                if (label === '攻击') {
                    const attackSpeed = $(this).parent().next().next().next().next().children().last();
                    const level = getSpeedLevel(attackSpeed.text(), true);
                    const levelElement = renderCharLabel('攻速档位', level[0]) + renderCharLabel('下档攻速', level[1]);
                    $(levelElement).insertAfter(attackSpeed.parent());
                } else if (label === '法术') {
                    const spellSpeed = $(this).parent().next().children().last();
                    const level = getSpeedLevel(spellSpeed.text(), false);
                    const levelElement = renderCharLabel('速度档位', level[0]) + renderCharLabel('下档速度', level[1]);
                    $(levelElement).insertAfter(spellSpeed.parent());
                }
            }
            if (config.showCharDmg) {
                if (label === '攻击') {
                    const baseDmg = $(this).parent().next().children().last().text();
                    const critElement = $(this).parent().next().next().next();
                    const crit = critElement.children().last().text().replace('%', '') / 100;
                    const avgDmg = getAvgDmg(baseDmg);
                    const finalDmg = (avgDmg * (1 + (crit - 0))).toFixed(2) - 0;
                    let dmgElement = renderCharLabel('普攻均伤', finalDmg);
                    if (keySkill.isAttack) {
                        const keyDmg = (keySkill.dmgRate * finalDmg).toFixed(2) - 0;
                        dmgElement += renderCharLabel(`${keySkill.name}均伤`, keyDmg);
                    }
                    $(dmgElement).insertAfter(critElement);
                }
            }
            if (config.showAccuracy) {
                if (label === '攻击') {
                    const accuracy = $(this).parent().next().next().children().last().text() - 0;
                    const accuracyElement = $(this).parent().next().next();
                    const accRate = getAccRate(level, level, accuracy);
                    let accElement = `<p><span>命中怪物等级：</span><span><input type="number" class="form-control hit-input" value="${level}"/></span></p>`;
                    accElement += renderCharLabel('普攻命中率', `${accRate}%`, 'idle-ui-acc');
                    if (keySkill.isAttack) {
                        const keyAcc = accuracy * keySkill.accRate;
                        const keyAccRate = getAccRate(level, level, keyAcc);
                        accElement += renderCharLabel(`${keySkill.name}命中率`, `${keyAccRate}%`, 'idle-ui-key-acc');
                    }
                    $(accElement).insertAfter(accuracyElement);

                    $('.hit-input').change(function () {
                        const mlvl = $(this).val();
                        const def = (mlvl - 0 + 1) * 10;
                        const curAccRate = getAccRate(level, mlvl, accuracy);
                        $('#idle-ui-acc').text(`${curAccRate}%`);
                        if (keySkill.isAttack) {
                            const curKeyAccRate = getAccRate(level, mlvl, accuracy * keySkill.accRate);
                            $('#idle-ui-key-acc').text(`${curKeyAccRate}%`);
                        }
                    });
                }
            }
            if (config.itemStats) {
                if (label == '综合') {
                    const uniqueNum = $(this).parent().next().next().next().next().children().last().text();
                    const setNum = $(this).parent().next().next().next().next().next().children().last().text();
                    const statsData = {uniqueNum: uniqueNum, setNum: setNum};
                    saveStats({uniqueNum: uniqueNum, setNum: setNum});
                }
            }
        });
    }

    function getAccRate(clvl, mlvl, acc) {
        clvl = clvl - 0;
        mlvl = mlvl - 0;
        acc = acc - 0;
        const def = (mlvl - 0 + 1) * 10;
        return (2 * (clvl / (clvl + mlvl)) * (acc / (acc + def)) * 100).toFixed(2) - 0;
    }

    function saveStats(statsData) {
        const idMatch = location.href.match(/Character\/Detail\?Id=(\d+)/i);
        if (!idMatch) return;
        const id = idMatch[1];
        let stats = localStorage.getItem('idle-ui-stats');
        stats = stats ? JSON.parse(stats) : {uniqueNum: 0, setNum: 0};
        const lastStatsData = stats[id];
        const time = +new Date();
        if (lastStatsData && lastStatsData.time) {
            const duration = moment.duration(moment(time).diff(moment(lastStatsData.time)));
            const timeSpan = duration.asMinutes() > 60 ? (duration.asHours().toFixed(1) - 0) + '小时前' : Math.round(duration.asMinutes()) + '分钟前';
            const uniqueChange = statsData.uniqueNum - lastStatsData.uniqueNum;
            const setChange = statsData.setNum - lastStatsData.setNum;
            displayStats(id, timeSpan, uniqueChange, setChange);
        }
        statsData.time = time;
        stats[id] = statsData;
        localStorage.setItem('idle-ui-stats', JSON.stringify(stats));
    }

    function displayStats(id, timeSpan, uniqueChange, setChange) {
        const message = `<div class="panel panel-inverse panel-top"><div class="panel-body">上次访问是${timeSpan}，这段时间内你获得了 <span class="unique">${uniqueChange}</span> 件暗金，<span class="set">${setChange}</span> 件套装。</div></div>`;

        $('.navbar.navbar-inverse.navbar-fixed-top').next().next().prepend(message);
        $('#open-ui-modal').click(function () {
            $('#modalUI').modal('show');
        });
    }

    if (config.showBattle && inBattlePage() && !$('.error').length) {
        let waitTime = $('#time');
        if (waitTime.length) {
            waitTime = waitTime.val();
        } else {
            $(document).ready(function () {
                $(".turn").battle({
                    interval: 0,
                    guaji: 0
                });
            });
        }
    }

    function renderConigHtml() {
        return Object.keys(config)
            .filter(item => userConfig.indexOf(item) >= 0)
            .map(key => {
            const cfg = config[key];
            return `<div class="col-sm-4"><div class="checkbox" style="margin: 2px 0;"><label><input class=" idle-ui-config" type="checkbox" data-key="${key}"> ${configLabel[key]}</label></div></div>`
            })
            .join('');
    }

    function addConfig() {
        // $("[name='gold'][id='gold'][type='number']").attr('value', 50000);
        const configHtml = renderConigHtml();
        const html = `

        `;
        $(document.body).append(html);
        loadLocalConfig();
    }

    function loadLocalConfig() {
        $('.idle-ui-config').each(function () {
            const key = $(this).data('key');
            $(this).prop('checked', config[key]);
        });
        $('#idle-ui-filters').val(config.fastOptions.join('\n'));
        $(`#hack-${config.mapHackType}`).prop('checked', true);

        $('#idle-ui-reset-filters').click(function () {
            config.fastOptions = defaultFilterOptions;
            saveLocalConfig();
            loadLocalConfig();
        });

        $('#idle-ui-save-filters').click(function () {
            config.fastOptions = $('#idle-ui-filters').val().split('\n');
            config.minLevel = $('#idle-ui-rune-filter').val();
            saveLocalConfig();
        });

        $('.idle-ui-config').change(function () {
            const key = $(this).data('key');
            config[key] = $(this).prop('checked');
            if (config.d3theme) {
                $('html').addClass('d3');
            } else {
                $('html').removeClass('d3');
            }
            saveLocalConfig();
        });

        $('.idle-ui-hack-type').change(function () {
            if ($(this).prop('checked')) config.mapHackType = $(this).val();
            saveLocalConfig();
        });

        // 监听alt+t按键,切换界面
        $(document).bind('keyup', function (event) {
            if (event.which === 84 && event.altKey) {
                $('html').toggleClass('d3');
                switchSkin(document.getElementsByClassName('d3').length > 0)
            }
        });
    }

    function saveLocalConfig() {
        localStorage.setItem('idle-ui-config', JSON.stringify(config));
    }

    // 监听过滤条件输入框的改变
    $(".panel-filter").on("input propertychange", function () {
        $(this).parent().prev().find(".selected").removeClass("selected")

        // 输入的值
        var value = $(this).val();
        // 保存到缓存,方便下次使用
        window.localStorage.setItem($(this).attr("id"), value);
        if (value.length > 0) {
            var values = value.split(",");
            var equips = $(this).parent().prev().find(".equip-content");

            // 正则判断是否是数字
            const min = /^<[0-9]+.?[0-9]*$/;
            const max = /^>[0-9]+.?[0-9]*$/;

            // 提取装备等级的正则表达式
            const level = /\([0-9]*\)/;

            // 去的当页数据
            equips.each(function (i, e) {
                var match = 0;
                $.each(values, function (j, p) {
                    let text = $(e).text();
                    if (min.test(p)) {
                        // 纯数字,作为掉落等级来判断
                        let exec = String(level.exec(text));
                        exec = exec.substring(1, exec.length - 1);
                        p = p.substring(1, p.length);
                        if (parseInt(exec) <= parseInt(p)) match++;
                    } else if (max.test(p)) {
                        let exec = String(level.exec(text));
                        exec = exec.substring(1, exec.length - 1);
                        p = p.substring(1, p.length);
                        if (parseInt(exec) >= parseInt(p)) match++;
                    } else if (text.indexOf(p) >= 0) {
                        // 其他属性
                        match++;
                    }
                });
                if (match == values.length) {
                    $(e).prev().addClass("selected");
                }
            });
        }
    });

    $(document).ready(function () {
        $(".panel-filter").each(function (i, input) {
            var value = window.localStorage.getItem($(this).attr("id"));
            if (value != null && value.length > 0) {
                $(this).val(value);
                $(this).trigger("propertychange");
            }
        });
    });

    function autoHint() {
        if (config.infiniteMap) {
            setTimeout(() => {
                tryReset();
            }, 500);
        } else {
            new Notification('秘境扫荡完毕');
            map = {};
            map[id] = 'end';
        }
    }

    // 当前是秘境界面
    if (config.mapHack && location.href.indexOf('Map/Dungeon') >= 0) {
        let hacking = false;
        const idMatch = location.href.match(/id=(\d+)/i);
        if (!idMatch) return;
        const id = idMatch[1];
        const btns = '';
        $('.dungeon-container').prev().children().last().prepend(btns);

        if (config.infiniteMap) $('#auto-reset').prop('checked', true);
        $('#auto-reset').change(function () {
            config.infiniteMap = $(this).prop('checked');
            saveLocalConfig();
        });

        let failedBlocks = localStorage.getItem('idle-ui-fail-blocks');
        failedBlocks = failedBlocks ? JSON.parse(failedBlocks) : [];

        let map = localStorage.getItem('idle-ui-maphack');

        // 是否出现验证码提示
        if ($("[role='dialog'][data-code='True']").length) {
            // 提示验证码 停止自动秘境
            endMove("验证码出现");
            return;
        }

        if (map) {
            map = JSON.parse(map);

            if (map[id] && map[id] === 'start') {
                const bossLeft = $('.boss-left').text() - 0;
                const monster = $('.monster-left').text() - 0;
                // 只刷Boss
                if (config.mapHackType === 'boss') {
                    if (bossLeft === 0) {
                        // Boss干掉了
                        autoHint();
                    } else {
                        // Boss还存活
                        startHack();
                    }
                } else if (config.mapHackType === 'all') {
                    if (bossLeft === 0 && monster === 0) {
                        autoHint();
                    } else {
                        startHack();
                    }
                } else if (config.mapHackType === 'mystery') {
                    if (monster === 0) {
                        // 秘境扫荡完毕,跳转到装备界面开始继续打石头
                        // 获得用户的ID
                        // 秘境的石头等级  0 表示普通 1表示魔法 2表示稀有,以此类推 按照下拉列表的排序
                        // https://www.idleinfinity.cn/Equipment/Query?id=5671&pt2=2&et2=2147483648&pi=0&pt=1&et=2147483648
                        // https://www.idleinfinity.cn/Equipment/Query?id=5671&et2=2147483648&pt2=1&pi=0&pt=1&et=2147483648
                        // https://www.idleinfinity.cn/Equipment/Query?id=5671&pt=2&et=2147483648&pi2=0&pt2=2&et2=2147483648
                        localStorage.setItem('failure', "0");
                        const level = config.level;
                        const userId = $("#cid").val();
                        location.href = `/Equipment/Query?id=${userId}&pt=5&et=2147483648&pi2=0&pt2=${level}&et2=2147483648`;
                    } else {
                        startHack();
                    }
                }
            }
        } else {
            map = {};
            map[id] = 'end';
        }

        function tryReset() {
            const stoneLeft = $('.panel-heading .state').text() - 0;
            if (stoneLeft > 0) {
                localStorage.setItem('idle-ui-fail-blocks', '[]');
                localStorage.setItem('failure', "0");
                $("form").attr("action", "DungeonRefresh");
                $("form").trigger("submit");
            } else {
                endMove('秘境之石已用完');
            }
        }

        $('#start-hack').click(function (params) {
            startHack(true);
        });

        $('#end-hack').click(function (params) {
            alert('自动秘境已停止');
            endMove();
        });

        function startHack(fromClick) {
            if (hacking) return;
            hacking = true;
            if (!map[id] && typeof map == 'string') {
                map = JSON.parse(map);
            }
            $('.dungeon-container').prev().children().last().prepend('<button class="btn btn-xs btn-default" style="margin-right: 5px;" id="end-hack">停止自动秘境</button>');
            map[id] = 'start';
            localStorage.setItem('idle-ui-maphack', JSON.stringify(map));
            if (fromClick) {
                localStorage.setItem('idle-ui-fail-blocks', '[]');
                localStorage.setItem('failure', "0");
            }
            setTimeout(() => {
                mapMove();
            }, 900);
        }

        function mapMove() {
            if (map[id] !== 'start') return;
            // 有boss先打boss
            const bossBlock = $('.boss').eq(0);
            if (!config.dodge) {
                if (bossBlock.length && !bossBlock.hasClass('mask')) {
                    clickBlock(bossBlock);
                    return;
                }
            }

            const bossId = bossBlock.attr("id");
            const asc = Number(bossId) <= 200;
            const enemyBlocks = []; // 有敌人的可行区块
            for (let i = asc ? 0 : 399; asc ? i <= 399 : i >= 0; asc ? i++ : i--) {
                const block = $(`#${i}`);
                if (canExplore(i) && block.hasClass('public monster')) {
                    enemyBlocks.push(i);
                }
            }
            // 下一个怪
            let nextBlockIndex = null;

            for (let i = 0; i < enemyBlocks.length; i++) {
                if ((config.mapHackType === 'boss') && failedBlocks.indexOf(enemyBlocks[i]) === -1) {
                    nextBlockIndex = enemyBlocks[i];
                }
            }
            if (nextBlockIndex === null && (enemyBlocks.length > 0)) {
                nextBlockIndex = enemyBlocks[0];
                localStorage.setItem('idle-ui-fail-blocks', '[]');
                let number = parseInt(localStorage.getItem("failure"));
                let failure = (isNaN(number) ? 0 : number) + 1;
                localStorage.setItem('failure', failure);
                if ((failure % 3) === 0) {
                    if (failure > 1) new Notification('第' + failure + '轮战斗失败');
                }
                if (failure > config.failure) {
                    if (config.mapHackType === 'mystery') {
                        const level = config.level;
                        const userId = $("#cid").val();
                        location.href = `/Equipment/Query?id=${userId}&pt=5&et=2147483648&pi2=0&pt2=${level}&et2=2147483648`;
                        return;
                    } else if (config.infiniteMap) {
                        tryReset();
                        return
                    }
                }
            }
            if (nextBlockIndex !== null) {
                clickBlock($(`#${nextBlockIndex}`));
            } else {
                new Notification('当前怪物已清理完毕');
            }
        }

        function clickBlock(block) {
            const width = block.width();
            const height = block.height();
            const rect = document.getElementById(block.attr('id')).getBoundingClientRect();
            console.log(block.attr('id'));
            const x = Math.round(rect.left + width / 3 + (width / 4 * Math.random(id))) + $(window).scrollLeft();
            const y = Math.round(rect.top + height / 3 + (height / 4 * Math.random(id))) + $(window).scrollTop();
            ajaxMove(block, {pageX: x, pageY: y, originalEvent: {isTrusted: true}});
        }

        function ajaxMove(block, a) {
            const f = block;
            var c = f.parent();
            const g = f.attr("id");
            const k = $("#cid").val();
            const td = localStorage.getItem("t");
            if (f.hasClass("public monster")) {
                window.location.href = "/Battle/InDungeon?id=" + k + "&bid=" + g;
            } else {
                $(".dungeon-layer").show();
                var e = [];
                /*                 if (0 < a.pageX && 0 < a.pageY && a.hasOwnProperty("originalEvent") && (a.originalEvent.isTrusted || 1 == a.originalEvent.detail)) {
                    e = $(c).offset();
                    const h = $(c).width();
                    c = $(c).height();
                    const l = Math.floor(Math.random() * h);
                    e = [a.pageX, l, a.pageY, e.left, h - l, e.top, h, Math.floor(Math.random() * c), c]
                }
 */
                if (a.pageX > 0 && a.pageY > 0 && a.hasOwnProperty('originalEvent') && (a.originalEvent.isTrusted || a.originalEvent.detail == 1)) {
                    var offset = $(c).offset();
                    var width = $(c).width();
                    var height = $(c).height();
                    var rand1 = Math.floor(Math.random() * width);
                    var rand2 = width - rand1;
                    var rand3 = Math.floor(Math.random() * height);
                    e = [a.pageX, rand1, a.pageY, offset.left, rand2, offset.top, width, rand3, height];
                }

                a = {
                    id: k,
                    bid: g,
                    m: e,
                    t: td,
                    __RequestVerificationToken: $("[name='__RequestVerificationToken']").val()
                };
                $.ajax({
                    url: "MoveTo",
                    type: "post",
                    data: a,
                    dataType: "json",
                    success: function (a) {
                        $.each(a, function (a, b) {
                            if (b.id == undefined) {
                                b.id = 0;
                            }
                            void 0 == b.id && (b.id = 0);
                            a = "";
                            0 == b.d[0] && (a += " top");
                            0 == b.d[1] && (a += " left");
                            if (1 == b.m){
                                $("#" + b.id).addClass(a);
                            }
                            else {
                                a += " public";
                                var c = "";

                                if (b.mlvl > 0) {
                                    a += " monster ";
                                    c += "Lv" + b.mlvl + " " + b.mname;

                                    a += b.mtype;
                                }

                                $("#" + b.id).removeClass("mask").addClass(a);
                                if (c != "") {
                                    $("#" + b.id).attr("title", c);
                                }
                            }
                        });
                        /*                         0 < a.length && ($("#explore").text(parseInt($("#explore").text()) + a.length),
                            $("#not-explore").text(parseInt($("#not-explore").text()) - a.length));
                        $(".current").removeClass("current");
                        f.addClass("current");
                        $(".dungeon-layer").hide();
                        setTimeout(() => {
                            mapMove();
                        }, Math.round(config.userNumber * 300));
                    }, */

                        if (a.length > 0) {
                            $("#explore").text(parseInt($("#explore").text()) + a.length);
                            $("#not-explore").text(parseInt($("#not-explore").text()) - a.length);
                        }

                        $(".current").removeClass("current");
                        f.addClass("current");

                        $(".dungeon-layer").hide();
                    },

                    error: function (XMLHttpRequest) {
                        const responseText = XMLHttpRequest.responseText;
                        if (responseText.indexOf('封号') >= 0) {
                            addBlockNum();
                        }
                        $(".dungeon-layer").hide();
                    }
                });
            }
        }

        function endMove(notice, retry, reset) {
            if (!reset) {
                map[id] = 'end';
                localStorage.setItem('idle-ui-maphack', JSON.stringify(map));
            }

            if (notice) new Notification(notice);

            if (retry) {
                // 请求异常情况直接刷新界面,暂时注释原来逻辑
                $('#modalAlert').modal('hide');
                setTimeout(function () {
                    const userId = $("#cid").val();
                    location.href = `../Map/DungeonForEquip?id=${userId}`
                }, Math.round(300));
            } else if (reset) {
                tryReset();
            }
        }

        // 判断是否可以点击
        function canExplore(i) {
            const size = 20;
            const block = $(`#${i}`);
            if (block.hasClass('mask')) return false;
            if ((config.mapHackType === 'all' || config.mapHackType === 'mystery') && block.hasClass('monster')) return true;
            const left = i % size === 0 ? null : $(`#${i - 1}`);
            const right = i % size === (size - 1) ? null : $(`#${i + 1}`);
            const up = i < size ? null : $(`#${i - size}`);
            const down = i >= ((size * size) - size) ? null : $(`#${i + size}`);
            const canMoveLeft = left && left.hasClass('mask') && !block.hasClass('left');
            const canMoveRight = right && right.hasClass('mask') && !right.hasClass('left');
            const canMoveUp = up && up.hasClass('mask') && !block.hasClass('top');
            const canMoveDown = down && down.hasClass('mask') && !down.hasClass('top');
            return canMoveLeft || canMoveRight || canMoveUp || canMoveDown;
        }
    }

    if (location.href.indexOf('Map/Dungeon') === -1) {
        $.ajaxSetup({
            complete: function (XMLHttpRequest) {
                if (!XMLHttpRequest.responseText) return;
                if (XMLHttpRequest.responseText.indexOf('封号') >= 0) {
                    addBlockNum();
                    location.reload();
                }
            }
        });
    }

    // 战斗界面
    if (config.mapHack && location.href.indexOf('Battle/InDungeon') >= 0) {

        const id = purl().param().id;
        const bid = purl().param().bid - 0;
        if (!id) return;
        let map = localStorage.getItem('idle-ui-maphack');
        if (map) {
            map = JSON.parse(map);
            if (map[id] && map[id] === 'start') {
                const exception = $('.error').length;
                if (exception) {
                    setTimeout(() => {
                        location.href = `/Map/Dungeon?id=${id}`;
                    }, Math.round(Math.random() * 2500));
                    return;
                }

                const stopBtn = renderButton('end-hack', '停止自动秘境', 'default');
                $('.btn.btn-xs').eq(1).before(stopBtn);
                $('#end-hack').click(function () {
                    map[id] = 'end';
                    localStorage.setItem('idle-ui-maphack', JSON.stringify(map));
                    alert('自动秘境已停止');
                });

                let waitTime = $('head').text().match(/waitTime:(\d+)/);
                if (waitTime) {
                    waitTime = waitTime[1];
                }
                if (waitTime) {
                    setTimeout(() => {
                        endFight(id);
                    }, (waitTime + 1) * 1000);
                } else {
                    endFight(id);
                }
            }
        }

        function endFight(dungeonId) {
            const win = $('.turn').first().text().indexOf('战斗胜利') > 0;
            const turns = $('.turn').length - 1;
            let enemys = {};
            $('.battle-char').each(function () {
                const id = $(this).prop('id').split('_')[1];
                if (id < 0) {
                    const type = $(this).children().first().children().last().prop('class');
                    if (enemys[type]) {
                        enemys[type] += 1;
                    } else {
                        enemys[type] = 1;
                    }
                }
            });
            let drops = [];
            $('.turn').first().find('.equip-name').each(function () {
                const type = $(this).clone().prop('class').replace('equip-name', '').trim();
                const name = $(this).text();
                drops.push({type: type, name: name});
            });
            const isBoss = $('.boss').length > 0;
            const battleLog = {time: +new Date(), win, boss: isBoss, turns, enemys, drops};
            addBattleLog(battleLog);

            const bossWin = isBoss && win;
            if (!win) {
                let failedBlocks = localStorage.getItem('idle-ui-fail-blocks');
                failedBlocks = failedBlocks ? JSON.parse(failedBlocks) : [];
                if (failedBlocks.indexOf(bid) === -1) failedBlocks.push(bid);
                localStorage.setItem('idle-ui-fail-blocks', JSON.stringify(failedBlocks));
            } else {
                localStorage.setItem('failure', '0');
                localStorage.setItem('idle-ui-fail-blocks', '[]');
            }
            let timeout = 5;
            if (turns < 50) {
                timeout = 3
            } else if (turns < 100) {
                timeout = 7;
            } else if (turns < 200) {
                timeout = 10;
            }
            setTimeout(() => {
                location.href = `/Map/Dungeon?id=${dungeonId}`;
            }, timeout * 1100);
        }

        function addBattleLog(battleLog) {
            let log = localStorage.getItem('idle-ui-maplog');
            log = log ? JSON.parse(log) : {};
            if (!log[id]) log[id] = [];
            log[id].unshift(battleLog);
            log[id] = log[id].slice(0, 500);
            localStorage.setItem('idle-ui-maplog', JSON.stringify(log));
        }
    }

    if (config.mapHack && location.href.indexOf('Map/Detail') >= 0) {
        const btn = "";
        $('.btn.btn-xs').eq(1).before(btn);
        let page = 1;
        let log = {};
        let dataSource = [];
        const id = purl().param().id;
        const pageSize = 20;
        let maxPage = 0;
        const modal = ``;
        $(document.body).append(modal);

        function getBattleLogStats(battleLog) {
            let creepNum = 0;
            let bossNum = 0;
            let creepWin = 0;
            let bossWin = 0;
            let creepTurns = 0;
            let bossTurns = 0;
            battleLog.forEach(item => {
                if (item.boss) {
                    bossNum += 1;
                    if (item.win) bossWin += 1;
                    bossTurns += item.turns;
                } else {
                    creepNum += 1;
                    if (item.win) creepWin += 1;
                    creepTurns += item.turns;
                }
            });
            const avgCreepTurns = creepNum > 0 ? Math.round(creepTurns / creepNum) : 0;
            const avgBossTurns = bossNum > 0 ? Math.round(bossTurns / bossNum) : 0;
            const creepWinRate = creepNum > 0 ? Math.round(creepWin / creepNum * 100) : 0;
            const bossWinRate = bossNum > 0 ? Math.round(bossWin / bossNum * 100) : 0;
            return {creepNum, bossNum, avgCreepTurns, avgBossTurns, creepWinRate, bossWinRate}
        }

        const enemyTypes = {'battle-char-name normal': '普通', 'battle-char-name rare': '稀有', 'battle-char-name super': '精英', 'battle-char-name boss': 'Boss'};

        function renderRows() {
            const start = (page - 1) * pageSize;
            let data = [];
            if ($('#idle-ui-only-boss').prop('checked')) {
                data = dataSource.filter(item => item.boss).slice(start, start + pageSize);
            } else {
                data = dataSource.slice(start, start + pageSize);
            }
            const rows = data.map(item => {
                const date = moment(item.time).format('MM-DD HH:mm:ss');
                const result = item.win ? '<span class="poison">胜利</span>' : '<span class="fire">失败</span>';
                const enemys = Object.keys(item.enemys).map(type => {
                    const count = item.enemys[type];
                    return `<span class="${type}">${enemyTypes[type]}</span><span class="normal mr-10"> x ${count}</span>`;
                }).join('');
                const drops = item.drops.map(item => {
                    return `<span class="${item.type}">${item.name}</span>`;
                }).join('');
                return `<tr><td>${date}</td><td>${result}</td><td>${item.turns}</td><td>${enemys}</td><td>${drops}</td></tr>`;
            }).join('');
            $('#idle-ui-log-table').html(rows);
            if (page === 1) {
                $('#page-prev').prop('disabled', true);
            } else {
                $('#page-prev').prop('disabled', false);
            }
            if (page === maxPage) {
                $('#page-next').prop('disabled', true);
            } else {
                $('#page-next').prop('disabled', false);
            }
            $('#idle-ui-log-length').text(logLength);
            $('#idle-ui-max-page').text(maxPage);
            $('#idle-ui-page').text(page);
        }

        $('#page-prev').click(function () {
            page = page - 1;
            renderRows();
        });

        $('#page-next').click(function () {
            page = page + 1;
            renderRows();
        });

        $('#idle-ui-only-boss').change(function () {
            page = 1;
            getLengthAndMaxPage();
            renderRows();
        });

        $('#clear-log').click(function () {
            log[id] = [];
            localStorage.setItem('idle-ui-maplog', JSON.stringify(log));
            location.reload();
        });

        function getLengthAndMaxPage() {
            const checked = $('#idle-ui-only-boss').prop('checked');
            logLength = checked ? dataSource.filter(item => item.boss).length : dataSource.length;
            maxPage = Math.ceil(logLength / pageSize);
        }

        function reloadLog() {
            log = localStorage.getItem('idle-ui-maplog');
            log = log ? JSON.parse(log) : {};
            dataSource = log[id] || [];
            getLengthAndMaxPage();
            const stats = getBattleLogStats(dataSource);
            $('#idle-ui-creepnum').text(stats.creepNum);
            $('#idle-ui-avgcreepturns').text(stats.avgCreepTurns);
            $('#idle-ui-creepwinrate').text(`${stats.creepWinRate}%`);
            $('#idle-ui-bossnum').text(stats.bossNum);
            $('#idle-ui-avgbossturns').text(stats.avgBossTurns);
            $('#idle-ui-bosswinrate').text(`${stats.bossWinRate}%`);
            page = 1;
            renderRows();
        }

        $('#idle-ui-reload').click(function () {
            reloadLog();
        });

        $('#idle-ui-maplog').click(function () {
            reloadLog();
            $('#modalMapLog').modal('show');
        });
    }

    if (config.showSetAttr && location.href.indexOf('Auction/Query') < 0) {
        loadSetAttr();

        function loadSetAttr() {
            if (!$('.equip-content > .equip > .set').length) return;
            const setDB = localStorage.getItem('idle-ui-set-db');
            const newSetDB = localStorage.getItem('idle-ui-set-db-new');
            if (setDB && newSetDB) {
                const JSONSetDB = JSON.parse(setDB);
                const JSONNewSetDB = JSON.parse(newSetDB);
                $('.equip-content > .equip > .set').each(function () {
                    const content = $(this).parent();
                    const itemName = content.children().first().text().replace(/\(\d+\)/g, '');
                    const singleData = JSONSetDB.singleData[itemName];
                    const existSingLeNum = content.children('.set').length - 1;
                    if (singleData && singleData.length > existSingLeNum) {
                        const singleContent = singleData.slice(existSingLeNum).map(item => {
                            return `<p class="set idle-ui-set-single">${item}</p>`;
                        }).join('');
                        content.children('.unique').before(singleContent);
                    }
                    const fullContent = content.children('.unique');
                    const existFullNum = fullContent.children('p[class!="set"][class!="require"]').length - 1;
                    const setName = fullContent.children('br').last().next().text().replace(/\(\d+\)/g, '');
                    var fullData = JSONSetDB.setData[setName];
                    if (!fullData) {
                        fullData = JSONNewSetDB.setData[setName];
                    }
                    let setContent = fullData.slice(existFullNum).map(item => {
                        return `<p class="idle-ui-set-full">${item}</p>`;
                    }).join('');
                    if (fullContent.children('br').length === 1) setContent = '<br>' + setContent;
                    fullContent.children('br').last().before(setContent);
                });
            } else {
                $.get('/Help/Set', function (html) {
                    const parsedsetDB = parseSetHtml(html);
                    localStorage.setItem('idle-ui-set-db', JSON.stringify(parsedsetDB));
                    loadSetAttr();
                });
                $.get('/Help/Sacred', function (html) {
                    const parsedsetDB = parseSetHtml(html);
                    localStorage.setItem('idle-ui-set-db-new', JSON.stringify(parsedsetDB));
                    loadSetAttr();
                });
            }
        }

        function parseSetHtml(html) {
            $(".footer").before(`<div style="display: none;" id="set-data">${html}</div>`);
            const singleData = {};
            const setData = {};
            $('#set-data .masonry-item .panel-body .equip').each(function () {
                const lines = $(this).children();
                const itemName = lines.first().text().replace(/\(\d+\)/, '');
                const singleLines = [];
                lines.each(function (index) {
                    const line = $(this);
                    if (index > 0 && line.hasClass('set')) {
                        singleLines.push(line.text().replace(/\n/g, ''));
                    }
                    if (line.hasClass('unique')) {
                        const setItems = line.children();
                        let stop = false;
                        const setLines = [];
                        let setName = '';
                        setItems.each(function (index) {
                            if (index > 0) {
                                if ($(this).prop('tagName').toLowerCase() === 'br') {
                                    stop = true;
                                    setName = $(this).next().text();
                                }
                                if (!stop) setLines.push($(this).text().replace(/\n/g, ''));
                            }
                        });
                        if (!setData[setName]) setData[setName] = setLines;
                    }
                });
                if (singleLines.length) singleData[itemName] = singleLines;
            });
            return {singleData, setData};
        }
    }

    if (location.href.indexOf('Auction/Query') >= 0 && location.href.indexOf('Auction/QueryBid') === -1) {
        if (config.showAuctionNote) {
            $('.physical.equip-des').each(function () {
                const note = $(this).text();
                const label = $(this).parent().parent().prev().children('.equip-name').last();
                label.after(`<span style="color: #fff;"> ${note}</span>`);
            });
        }

        //   if (config.auctionWatch) {
        //       let watchList = [];
        //
        //       function renderTable(params) {
        //           const list = localStorage.getItem('idle-ui-auction');
        //           watchList = (list ? JSON.parse(list) : []) || [];
        //           const rows = watchList.map((item, index) => {
        //               return `<tr><td>${item.category}</td><td>${item.name}</td><td><a href="Query?id=&${item.link}" class="btn btn-xs btn-default" style="margin-right: 12px;">查看</a><button data-index="${index}" type="button" class="delete-auction btn btn-xs btn-danger">取消关注</button></td></tr>`;
        //           });
        //           $('#modalAuction .table-body').html(rows);
        //           $('.delete-auction').click(function () {
        //               const index = $(this).data('index');
        //               watchList.splice(index, 1);
        //               localStorage.setItem('idle-ui-auction', JSON.stringify(watchList));
        //               renderTable();
        //           });
        //           renderNewItems();
        //       }
        //
        //       function renderNewItems() {
        //           const ids = purl().param().items;
        //           if (!ids) return;
        //           ids.split(',').map(id => {
        //               $(`span[data-id="${id}"`).parent().addClass('idle-ui-new-item');
        //           });
        //       }
        //
        //       const link = '<button id="open-auction-modal" type="button" class="btn btn-xs btn-success" style="margin-right: 10px;">特别关注</button>';
        //       $('.btn-group').eq(1).before(link);
        //       const categorys = [];
        //       $('.panel-heading .btn-group button.dropdown-toggle').each(function () {
        //           categorys.push($(this).text().replace('<span class="caret"></span>', '').replace(/\s/g, ''));
        //       });
        //       const category = categorys.join(' - ');
        //
        //       const modal = `
        //   <div class="modal fade" id="modalAuction" style="display: none;">
        //       <div class="modal-dialog modal-large" role="">
        //           <div class="modal-content model-inverse">
        //               <div class="modal-header">
        //                   <span class="modal-title">拍卖行特别关注</span>
        //               </div>
        //               <div class="modal-body">
        //                 <div class="panel-header state">已有关注项目</div>
        //                 <table class="table table-condensed">
        //                   <thead><tr><td>筛选条件</td><td>装备名称</td><td>操作</td></tr></thead>
        //                   <tbody class="table-body"></tbody>
        //                 </table>
        //                 <div class="panel-header state">添加新项目</div>
        //                 <div class="form">
        //                   <div class="form-group">
        //                     <label>筛选条件</label>
        //                     <p class="form-control-static" style="color: #fff;">${category}</p>
        //                   </div>
        //                   <div class="form-group">
        //                     <label>装备名称</label>
        //                     <input type="text" id="auction-name" class="form-control hit-input" style="width: 100%;">
        //                   </div>
        //                   <button type="button" class="btn btn-success btn-xs" id="add-auction">新增</button>
        //                 </div>
        //               </div>
        //               <div class="modal-footer">
        //                   <button type="button" class="btn btn-default btn-xs" data-dismiss="modal">关闭</button>
        //               </div>
        //           </div>
        //       </div>
        //   </div>
        // `;
        //       $(document.body).append(modal);
        //       renderTable();
        //       $('#open-auction-modal').click(function () {
        //           if ($('.equip-name').length) {
        //               $('#auction-name').val($('.equip-name').eq(0).text().replace('【', '').replace('】', ''));
        //           }
        //           $('#modalAuction').modal('show');
        //       });
        //
        //       $('#add-auction').click(function () {
        //           if (watchList.length >= 10) {
        //               alert('最多关注10条');
        //               return;
        //           }
        //           const params = purl().param();
        //           const et = params.et || '';
        //           const pt = params.pt || '';
        //           const ei = params.ei || '';
        //           const link = `et=${et}&pt=${pt}&ei=${ei}`;
        //           const name = $('#auction-name').val();
        //           const items = [];
        //           $('.equip-name').each(function () {
        //               const curName = $(this).text().replace('【', '').replace('】', '');
        //               if (curName === name) {
        //                   const id = $(this).parent().children().last().data('id');
        //                   items.push(id);
        //               }
        //           });
        //           const data = {
        //               category: category,
        //               name: $('#auction-name').val(),
        //               link: link,
        //               items: items
        //           };
        //           watchList.push(data);
        //           localStorage.setItem('idle-ui-auction', JSON.stringify(watchList));
        //           renderTable();
        //       });
        //   }1
    }

    if (config.magical && location.href.indexOf('Equipment/Query') >= 0) {
        let map = localStorage.getItem('idle-ui-maphack');
        if (map) {
            map = JSON.parse(map);
        } else {
            map = {};
        }
        const cid = $("#cid").val();

        const magicalStart = '';
        const magicalEnd = '';

        // 是否一键升蓝
        const magical = map[`magical${cid}`];
        const panel = $('.panel-footer .btn.btn-xs.btn-warning');
        panel.eq(panel.length - 1).before(magicalStart);
        if ((magical) && magical === 'start') {
            panel.eq(panel.length - 1).before(magicalEnd);
        }

        $('#start-magical').click(function (params) {
            map[`magical${cid}`] = 'start';
            localStorage.setItem('idle-ui-maphack', JSON.stringify(map));
            // startMagical();
            // 重定向到过滤为白色秘境的界面去
            const level = '0';
            const userId = $("#cid").val();
            location.href = `/Equipment/Query?id=${userId}&pt=${level}&et=2147483648&pi2=0&pt2=${level}&et2=2147483648`;
        });

        $('#end-magical').click(function (params) {
            map[`magical${cid}`] = 'end';
            localStorage.setItem('idle-ui-maphack', JSON.stringify(map));
            location.reload();
        });

        // 设置点击对应的点击事件
        function startMagical() {
            const magicalId = $(".base.equip-name").eq(0).data('id');
            if (!magicalId) {
                map[`magical${cid}`] = 'end';
                localStorage.setItem('idle-ui-maphack', JSON.stringify(map));
                alert('没有普通秘境,已停止自动升级');
                return;
            }
            map[`magical${cid}`] = 'start';
            a = {
                id: cid,
                cid: cid,
                eid: magicalId,
                type: '0',
                __RequestVerificationToken: $("[name='__RequestVerificationToken']").val(),
            };

            $.ajax({
                //几个参数需要注意一下
                type: "POST",//方法类型
                dataType: "html",//预期服务器返回的数据类型
                url: "EquipReform",//url
                data: a,
                success: function (result) {
                    location.reload()
                },
                error: function (XMLHttpRequest, textStatus) {
                    map[`magical${cid}`] = 'end';
                    alert("发生错误,请检查是否材料不够,或者不够改造等级")
                }
            });
        }

        if (magical && magical === 'start') {
            setTimeout(() => {
                if ((magical) && magical === 'start') {
                    startMagical()
                }
            }, config.moveTime);
        }
    }

    if (config.oneKeyEquip && location.href.indexOf('Equipment/Query') >= 0) {
        const btn = '';
        const cname = '';
        const startMetastasis = '';
        const stopMetastasis = '';

        const start = '';
        const end = '';
        $('.panel-heading .btn').eq(0).before(btn);
        $('.panel-heading .btn').eq(0).before(cname);
        let map = localStorage.getItem('idle-ui-maphack');
        if (map) {
            map = JSON.parse(map);
        } else {
            map = {};
        }
        const cid = $("#cid").val();
        var mysteryIndex = 5;

        // 是否一键转移
        const metastasis = map[`metastasis${cid}`];
        // 要转移人的姓名
        const name = map[`cname${cid}`];

        if (name) {
            $('.move-name').val(name);
        }
        if ((metastasis) && metastasis === 'start') {
            $('.panel-heading .btn').eq(0).before(stopMetastasis);
            mysteryIndex = 6;
        }

        $('#end-metastasis').click(function (params) {
            map[`metastasis${cid}`] = 'end';
            map[`cname${cid}`] = "";
            localStorage.setItem('idle-ui-maphack', JSON.stringify(map));
            location.reload();
        });

        $('.panel-heading .btn').eq(0).before(startMetastasis);
        $('#start-metastasis').click(function (params) {
            map[`metastasis${cid}`] = 'start';
            map[`cname${cid}`] = $('.move-name').val();
            localStorage.setItem('idle-ui-maphack', JSON.stringify(map));
            moveMystery();
        });

        function moveMystery() {
            const mysteryId = $(".selected").children(":first").next().next().next().data('id');
            if (!mysteryId) {
                map[`metastasis${cid}`] = 'end';
                localStorage.setItem('idle-ui-maphack', JSON.stringify(map));
                alert('没有物品被选中,已停止');
                return;
            }
            a = {
                cid: cid,
                eid: mysteryId,
                cname: map[`cname${cid}`],
                __RequestVerificationToken: $("[name='__RequestVerificationToken']").val(),
            };

            $.ajax({
                //几个参数需要注意一下
                type: "POST",//方法类型
                dataType: "html",//预期服务器返回的数据类型
                url: 'EquipTrade',//url
                data: a,
                success: function (result) {
                    location.reload()
                },
                error: function (result) {
                    alert(result)
                }
            });
        }

        if (metastasis && metastasis === 'start') {
            setTimeout(() => {
                if ((metastasis) && metastasis === 'start') {
                    moveMystery()
                }
            }, config.moveTime);
        }


        // 开始扫荡秘境了,就显示停止扫荡按钮
        const mystery = map[`mystery${cid}`];
        if ((mystery) && mystery === 'start') {
            $('.panel-heading .btn').eq(mysteryIndex).before(end);
            $('#end-mystery').click(function (params) {
                alert('已停止扫荡秘境');
                map[`mystery${cid}`] = 'end';
                localStorage.setItem('idle-ui-maphack', JSON.stringify(map));
            });
        }
        $('.panel-heading .btn').eq(mysteryIndex).before(start);

        $('#start-mystery').click(function (params) {
            map[`mystery${cid}`] = 'start';
            localStorage.setItem('idle-ui-maphack', JSON.stringify(map));
            startMystery();
        });

        function startMystery() {
            const mysteryId = $(".selected").children(":first").next().next().next().data('id');
            if (!mysteryId) {
                map[cid] = 'end';
                localStorage.setItem('idle-ui-maphack', JSON.stringify(map));
                alert('没有物品被选中,或使用等级不够,已停止');
                return;
            }
            map[cid] = 'start';
            a = {
                id: cid,
                cid: cid,
                eid: mysteryId,
                __RequestVerificationToken: $("[name='__RequestVerificationToken']").val(),
            };

            $.ajax({
                //几个参数需要注意一下
                type: "POST",//方法类型
                dataType: "html",//预期服务器返回的数据类型
                url: "EquipDungeon",//url
                data: a,
                success: function (result) {
                    // 请求成功,返回网页,自动跳转到秘境界面
                    location.href = `../Map/DungeonForEquip?id=${userId}`
                },
                error: function (XMLHttpRequest, textStatus) {
                    alert(XMLHttpRequest)
                }
            });
        }

        if (mystery && mystery === 'start') {
            setTimeout(() => {
                if ((mystery) && mystery === 'start') {
                    startMystery()
                }
            }, 15000);
        }

        const equipList = ['主手', '副手', '头盔', '护符', '项链', '戒指', '戒指', '衣服', '腰带', '手套', '靴子'];
        let buildMap = {};
        let buildData = [];
        const userId = purl().param().id;
        const equipItems = getEquipItems();

        function loadEquipBuild() {
            buildMap = JSON.parse(localStorage.getItem('idle-ui-equip-build') || '{}');
            buildData = buildMap[userId] || [];
        }

        function saveEquipBuild(data) {
            localStorage.setItem('idle-ui-equip-build', JSON.stringify(data));
            loadEquipBuild();
            renderEquip();
        }

        function renderEquip(buildIndex) {
            if (!buildIndex && buildData.length) buildIndex = 0;
            const data = buildData[buildIndex] || {};
            const equipContent = equipList.map((item, index) => {
                const equipItem = data.items ? data.items[index] : {};
                return `<p><span>${item}</span><span class="${equipItem.type || ''}">${equipItem.name || ''}</span></p>`;
            });
            const firstCol = equipContent.slice(0, 4).join('');
            const secondCol = equipContent.slice(4, 7).join('');
            const thirdCol = equipContent.slice(7).join('');
            const content = `<div class="col-sm-6 col-md-4">${firstCol}</div><div class="col-sm-6 col-md-4">${secondCol}</div><div class="col-sm-6 col-md-4">${thirdCol}</div>`;
            $('#equip-build-content').html(content);

            // 一键换装
            const buildTags = buildData.map((item, index) => {
                return `<li><a class="physical equip-build-option" href="#" data-index="${index}">${item.name}</a></li>`;
            }).join('');
            $('#equip-build-tags').html(buildTags);
            $('#selected-build-name').text(data.name || '选择方案');
            if (buildIndex !== undefined) {
                $('#use-equip-build').data('index', buildIndex);
                $('#del-equip-build').data('index', buildIndex);
            } else {
                $('#use-equip-build').data('index', -1);
                $('#del-equip-build').data('index', -1);
            }
            $('.equip-build-option').click(function (e) {
                e.preventDefault();
                const index = $(this).data('index');
                renderEquip(index);
            });
        }

        const modal = `
        <div class="modal fade" id="modalEquipBuild" style="display: none;">
            <div class="modal-dialog modal-large" role="" style="width: 800px;">
                <div class="modal-content model-inverse">
                    <div class="modal-header">
                        <span class="modal-title">一键换装</span>
                    </div>
                    <div class="modal-body">
                      <div class="panel-header state">
                        <span>已有装备方案：</span>
                        <div class="btn-group"><button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown"><span id="selected-build-name">选择方案</span><span class="caret" style="margin-left: 5px;"></span></button><ul class="dropdown-menu" id="equip-build-tags"></ul></div>
                      </div>
                      <div class="row" id="equip-build-content"></div>
                      <button type="button" class="btn btn-success btn-xs mr-10" id="use-equip-build">使用本方案</button>
                      <button type="button" class="btn btn-danger btn-xs" id="del-equip-build">删除本方案</button>
                      <div id="processing" style="display:none; margin-top: 10px;"><i class="glyphicon glyphicon-refresh"></i> 处理中...</div>
                      <div class="panel-header state" style="margin-top: 10px;">保存当前装备到新方案</div>
                      <div class="form">
                        <div class="form-group">
                          <label>方案名称</label>
                          <input type="text" id="equip-build-name" class="form-control hit-input" style="width: 100%;">
                        </div>
                        <button type="button" class="btn btn-success btn-xs" id="add-equip-build">保存</button>
                      </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default btn-xs" data-dismiss="modal">关闭</button>
                    </div>
                </div>
            </div>
        </div>
      `;
        $(document.body).append(modal);
        loadEquipBuild();
        renderEquip();
        $('#show-one-key-equip').click(function () {
            $('#modalEquipBuild').modal('show');
        });

        let processing = false;

        function doEquip(buildIndex, itemIndex) {
            if (blockData.num >= 9) {
                alert('封号打击次数过多,禁止一键换装');
                location.reload();
            }
            if (itemIndex > equipItems.length - 1) {
                setTimeout(() => {
                    processing = false;
                    $('#processing').hide();
                    location.reload();
                }, 500);
                return;
            }
            const list = $('#form').serializeArray();
            const params = {};
            list.forEach(item => {
                params[item.name] = item.value;
            });
            params.eid = buildData[buildIndex].items[itemIndex].id;
            params.cid = userId;
            // 判断当前要替换的装备是否已经装备
            const itemAlreadyEquiped = equipItems.some(item => item.id === params.eid);
            if (!params.eid || !params.cid) return;
            const name = buildData[buildIndex].items[itemIndex].name;

            if (itemAlreadyEquiped) {
                // 已经装备,进入下一件装备
                doEquip(buildIndex, itemIndex + 1);
            } else {
                // 没有装备,还是进行替换
                $.post('/Equipment/EquipOn', params, function (data) {
                    setTimeout(function () {
                        doEquip(buildIndex, itemIndex + 1);
                    }, 1000);
                }).fail(function (data) {
                    setTimeout(function () {
                        doEquip(buildIndex, itemIndex + 1);
                    }, 1000);
                });
            }
        }

        $('#use-equip-build').click(function () {
            if (processing) return;
            const index = $(this).data('index');
            if (index >= 0) {
                processing = true;
                $('#processing').show();
                doEquip(index, 0);
            } else {
                alert('请先选择一个方案');
            }
        });

        $('#del-equip-build').click(function () {
            const index = $(this).data('index');
            if (index >= 0) {
                buildData.splice(index, 1);
                buildMap[userId] = buildData;
                saveEquipBuild(buildMap);
            } else {
                alert('请先选择一个方案');
            }
        });

        function getEquipItems() {
            const items = [];
            $('.panel-body').eq(0).find('.equip-content').each(function () {
                const label = $(this).prev().children('.equip-name').eq(0);
                if (label.length) {
                    const name = label.text();
                    const type = label.prop('class').replace('equip-name', '').trim();
                    const id = label.parent().children().last().data('id');
                    items.push({name: name, type: type, id: id});
                } else {
                    items.push({name: '', type: '', id: 0});
                }
            });
            return items;
        }

        $('#add-equip-build').click(function () {
            if (buildData.length >= 5) {
                alert('同一角色最多保存5套方案');
                return;
            }
            const name = $('#equip-build-name').val();
            if (!name) {
                alert('方案必须有一个名称');
                return;
            }
            const newBuild = {
                name: name,
                items: equipItems
            };
            buildData.push(newBuild);
            buildMap[userId] = buildData;
            saveEquipBuild(buildMap);
        });
    }

    if (config.oneKeyAgree && location.href.indexOf('Notice/Query') >= 0) {
        let map = localStorage.getItem('idle-ui-maphack');
        if (map) {
            map = JSON.parse(map);
        } else {
            map = {};
        }
        // 所有消息的数量
        const allCount = $('.badge').eq(0).text();

        let processing = false;
        const agreeList = [];
        $('.notice-yes').each(function () {
            agreeList.push($(this).data('id'));
        });

        function doAgree(index) {
            if (blockData.num >= 9) {
                alert('封号打击次数过多,禁止一键同意');
                location.reload();
            }
            if (index > agreeList.length - 1) {
                $('#processing').hide();
                processing = false;

                if (map[`agree${cid}`] && map[`agree${cid}`] === 'start' && allCount > 0) {
                    // 获得当前页面的第几页数据,然后+1
                    var number = getUrlParam('pi');
                    if (number > 0) {
                        number = Number(number) + 1;
                    } else {
                        number = 1;
                    }
                    // 跳转到下一页
                    location.href = `/Notice/Query?pi=${number}&pi2=0`;
                    return;
                } else {
                    map[`agree${cid}`] = 'end';
                    localStorage.setItem('idle-ui-maphack', JSON.stringify(map));
                    location.reload();
                    return;
                }
            }
            const id = agreeList[index];
            const list = $('#form').serializeArray();
            const params = {
                contentType: false,
                processData: false,
            };
            list.forEach(item => {
                params[item.name] = item.value;
            });
            params.nid = id;
            $.post('/Notice/NoticeYes', params, function () {
                setTimeout(function () {
                    location.reload();
                }, config.agreedTime);
            }).fail(function (data) {
                alert("发生异常");
                setTimeout(function () {
                    location.reload();
                }, config.agreedTime);
            });
        }

        function getUrlParam(paraName) {
            const url = document.location.toString();
            const arrObj = url.split("?");

            if (arrObj.length > 1) {
                const arrPara = arrObj[1].split("&");
                var arr;

                for (var i = 0; i < arrPara.length; i++) {
                    arr = arrPara[i].split("=");
                    if (arr != null && arr[0] == paraName) {
                        return arr[1];
                    }
                }
                return "";
            }
            else {
                return "";
            }
        }

        const def = $('a.btn.btn-xs.btn-default');
        let all = renderProcessing();
        all += renderButton('idle-ui-agree-all', '同意所有');
        def.eq(0).before(all);
        $('#idle-ui-agree-all').click(function () {
            // 终止转移
            map[`agree${cid}`] = 'start';
            localStorage.setItem('idle-ui-maphack', JSON.stringify(map));
            agreeMessage();
        });

        if (map[`agree${cid}`] && map[`agree${cid}`] === 'start') {
            let stop = renderProcessing();
            stop += renderButton('idle-ui-agree-stop', '停止同意');
            def.eq(0).before(stop);

            $('#idle-ui-agree-stop').click(function () {
                // 终止转移
                map[`agree${cid}`] = 'stop';
                localStorage.setItem('idle-ui-maphack', JSON.stringify(map));
                location.reload();
            });
            if (allCount > 0) {
                setTimeout(function () {
                    agreeMessage();
                }, 500);
            } else {
                // 终止转移
                map[`agree${cid}`] = 'end';
                localStorage.setItem('idle-ui-maphack', JSON.stringify(map));
            }
        }

        function agreeMessage() {
            if (processing) return;
            if (agreeList.length || allCount > 0) {
                $('#processing').show();
                processing = true;
                doAgree(0);
            } else {
                alert('没有可处理的消息');
            }
        }
    }

    if (config.oneKeyRune && location.href.indexOf('Equipment/Material') >= 0) {
        let processing = false;
        const runeList = [];
        $('.artifact.equip-name').each(function () {
            const count = $(this).next().next().text() - 0;
            if (count > 0) {
                const rune = {
                    id: $(this).next().next().next().data('id') - 0,
                    count: count
                };
                runeList.push(rune);
            }
        });

        $('.equip-name').each(function () {
            const count = $(this).next().next().text() - 0;
            if (count > 0) {
                const rune = {
                    id: $(this).next().next().next().data('id') - 0,
                    count: count
                };
                runeList.push(rune);
            }
        });

        function doMoveRune(index, cname) {
            if (blockData.num >= 9) {
                alert('封号打击次数过多,禁止一键符文转移');
                location.reload();
            }
            if (index > runeList.length - 1) {
                $('#processing').hide();
                processing = false;
                location.reload();
                return;
            }
            const rune = runeList[index];
            const list = $('#form').serializeArray();
            const params = {};
            list.forEach(item => {
                params[item.name] = item.value;
            });
            params.cname = cname;
            params.count = rune.count;
            params.rune = rune.id;
            $.post('/Equipment/RuneTrade', params, function () {
                setTimeout(function () {
                    doMoveRune(index + 1, cname);
                }, 300);
            }).fail(function (data) {
                alert("发生异常，请检查角色名是否正确");
                location.reload();
            });
        }
        $('.btn.btn-xs.btn-default').eq(1).before("");
        $('#idle-ui-show-rune').click(function () {
            $('#modalMoveRune').modal('show');
        });
        const spinner = renderProcessing();
        const modal = ``;
        $(document.body).append(modal);
        $('#idle-ui-move-rune').click(function () {
            if (processing) return;
            if (runeList.length) {
                const cname = $('#idle-ui-cname').val();
                if (!cname) {
                    alert('请输入角色名称');
                } else {
                    processing = true;
                    $('#processing').show();
                    doMoveRune(0, cname);
                }
            } else {
                alert('没有转移的符文');
            }
        });
    }

    if (config.showRuneTip) {
        let runeList = [];
        const runeData = localStorage.getItem('idle-ui-rune-db');
        if (runeData) {
            runeList = JSON.parse(runeData);
        } else {
            fetchRuneTip();
        }

        if (location.href.indexOf('Equipment/Inlay') >= 0) {
            const footer = `
        <div class="panel-footer">
            <input class="panel-filter hidden-xs filter-input" id="panel-filter-runeword" placeholder="搜索符文之语">
            <span id="runeword-content"></span>
        </div>
      `;
            $('.panel').eq(0).append(footer);
            let timer = null;
            $('#panel-filter-runeword').keyup(function () {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
                timer = setTimeout(() => {
                    const name = $(this).val();
                    const filtered = name ? runeList.filter(item => item.name.indexOf(name) >= 0) : [];
                    let ret = '';
                    if (filtered.length) {
                        const item = filtered[0];
                        const recipe = item.recipe.map(item => {
                            return `<span class="artifact">${item}</span>`
                        }).join(' + ');
                        ret = `<span><span class="artifact equip-name">【${item.name}】</span>：<span>${recipe}</span></span>`;
                        const requireContent = item.require.map(item => {
                            return `<p><span class="equip-label">${item}</span></p>`;
                        }).join('');
                        const attrContent = item.attr.map(item => {
                            return `<p>${item}</p>`;
                        }).join('');
                        const tip = `<div class="equip-content"><div class="equip"><p class="artifact">${item.name}</p>${requireContent}${attrContent}</div></div>`;
                        ret += tip;
                    }
                    $('#runeword-content').html(ret);
                    $.initPopup();
                }, 300);
            });

            $('.equip').eq(0).children().last().prop('id', 'big-slot');

            const link = '<a href="/Help/Content?url=Artifact" target="_blank" class="btn btn-xs btn-success mr-10">神器列表</a>';
            $('.btn.btn-xs').eq(0).before(link);
        }

        if (location.href.indexOf('Help/Content?url=Artifact') >= 0) {
            const filter = '<div class="container" style="margin-bottom: 20px;"><input class="form-control" id="panel-filter" placeholder="输入神器名称或符文序号" /></div>';
            $('.navbar').next().after(filter);
            let timer = null;
            $('#panel-filter').keyup(function () {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
                timer = setTimeout(() => {
                    const val = $(this).val();
                    if (val) {
                        if (/^\d+$/.test(val)) {
                            $('tbody tr').each(function (i) {
                                const recipe = [];
                                $(this).children().eq(1).find('.artifact.equip-name').each(function () {
                                    recipe.push($(this).text().match(/\d+/g)[0]);
                                });
                                if (recipe.indexOf(val) >= 0) {
                                    $(this).show();
                                } else {
                                    $(this).hide();
                                }
                            });
                        } else {
                            $('tbody tr').each(function (i) {
                                const name = $(this).children().last().find('.artifact').text();
                                if (name.indexOf(val) >= 0) {
                                    $(this).show();
                                } else {
                                    $(this).hide();
                                }
                            });
                        }
                    } else {
                        $('tbody tr').show();
                    }
                }, 300);
            });
        }

        function fetchRuneTip() {
            $.get('/Help/Artifact', function (html) {
                const dom = $.parseHTML(html);
                $(dom).find('tr').each(function (i) {
                    if (i > 0) {
                        const nameLabel = $(this).children().last().find('.artifact');
                        const rune = {name: nameLabel.text(), attr: [], recipe: [], require: []};
                        nameLabel.parent().children().each(function (index) {
                            if (index > 0) rune.attr.push($(this).text());
                        });
                        $(this).children().eq(1).find('.artifact.equip-name').each(function () {
                            rune.recipe.push($(this).text());
                        });
                        $(this).children().eq(0).find('.equip-label').each(function () {
                            rune.require.push($(this).text());
                        });
                        runeList.push(rune);
                    }
                });
                localStorage.setItem('idle-ui-rune-db', JSON.stringify(runeList));
            });
        }
    }

    if (config.showBattleDetail && inBattlePage()) {
        const battleResult = {};
        const addedDamageTypes = ['溅射', '触发了技能', '对方受到'];

        function getDamageType(plainText) {
            let ret = -1;
            addedDamageTypes.forEach((item, i) => {
                if (plainText.indexOf(item) >= 0) ret = i;
            });
            return ret;
        }

        $('.turn').each(function (index) {
            if (index > 0) {
                const line = $(this).children().eq(1);
                const hpData = $(this).children().first().data('hp');
                const id = line.children()[0].innerHTML;
                if (!hpData[1]) return;
                const firstTargetId = hpData[1].id;
                const skillLabel = line.children('.skill-name');
                const skill = skillLabel.length ? skillLabel.eq(0).text() : '普通攻击';
                const damageLabel = line.children('.damage');

                let damage = 0;
                let damageDetail = {base: 0};
                if (firstTargetId < 0) {
                    damage = damageLabel.length ? damageLabel.eq(0).text() - 0 : 0;
                    damageDetail = {base: damage};
                    $(this).children().each(function (i) {
                        if (i > 1) {
                            const plainText = getPlainText($(this));
                            if (getDamageType(plainText) >= 0) {
                                const addedDamage = $(this).children('.damage').eq(0).text() - 0;
                                const damageType = getDamageType(plainText);
                                damage += addedDamage;
                                const lastDamage = damageDetail[damageType];
                                damageDetail[damageType] = lastDamage ? lastDamage + addedDamage : addedDamage;
                            }
                        }
                    });
                }
                if (!battleResult[id]) battleResult[id] = {};
                if (!battleResult[id][skill]) battleResult[id][skill] = {
                    turn: 0,
                    damage: 0,
                    damageDetail: {}
                };

                const skillData = battleResult[id][skill];
                skillData.turn += 1;
                skillData.damage += damage;
                Object.keys(damageDetail).forEach(type => {
                    if (skillData.damageDetail[type]) {
                        skillData.damageDetail[type] += damageDetail[type];
                    } else {
                        skillData.damageDetail[type] = damageDetail[type];
                    }
                });
            }
        });

        const totalTurns = $('.turn').length - 1;
        let partyTotalDamage = 0;
        $('.battle-data tbody tr').each(function (index) {
            if (getCharId(index) > 0) {
                const dmg = $(this).children().eq(2).text() - 0;
                partyTotalDamage += dmg;
            }
        });

        $('.battle-data thead td').eq(2).after('<td class="text-center">友方伤害占比</td><td class="text-center">详情</td><td class="text-center">出手次数</td><td class="text-center">出手占比</td><td class="text-center">每回合伤害</td>');
        $('.battle-data tbody tr').each(function (index) {
            const id = getCharId(index);
            const actor = $(this).children().first().text();
            const turns = getActorTurns(actor);
            const turnsPercent = (turns / totalTurns * 100).toFixed(1) - 0;
            const damage = $(this).children().eq(2).text() - 0;
            const damagePercent = id > 0 ? `${(damage / partyTotalDamage * 100).toFixed(1) - 0}%` : '-';
            const avgDamage = turns > 0 ? Math.round(damage / turns) : '-';
            const link = battleResult[actor] ? `<a href="javascript: void(0);" class="link-detail" data-id="${actor}" data-actor="${actor}">查看</a>` : '-';
            const content = `<td class="text-center poison">${damagePercent}</td><td class="text-center">${link}</td><td class="text-center physical ddd">${turns}</td><td class="text-center poison">${turnsPercent}%</td><td class="text-center fire ee">${avgDamage}</td>`;
            $(this).children().eq(2).after(content);
        });

        $('.battle-data').css('overflow', 'auto');

        const modal = `
      <div class="modal fade" id="modalBattleDetail" tabindex="-1" role="dialog">
          <div class="modal-dialog modal-lg" role="document">
              <div class="modal-content model-inverse">
                  <div class="modal-header">
                      <span class="modal-title"><span id="idle-ui-char"></span> - 伤害详情</span>
                  </div>
                  <div class="modal-body">
                      <table class="table table-condensed">
                        <thead><tr><th class="text-center">技能</th><th class="text-center">总伤害</th><th class="text-center">伤害占比</th><th class="text-center">出手次数</th><th class="text-center">出手占比</th><th class="text-center">每回合伤害</th><th class="text-center">直接伤害</th><th class="text-center">溅射</th><th class="text-center">触发技能</th><th class="text-center">持续伤害及其他</th></tr></thead>
                        <tbody id="idle-ui-battle-rows"></tbody>
                      </table>
                      <ul>
                        <li>直接伤害：技能造成的实际直接伤害</li>
                        <li>溅射：因溅射，对非主目标造成的溅射伤害之和</li>
                        <li>触发技能：【装备自带技能】或【被击中触发】的技能等被触发后造成的伤害</li>
                        <li>持续伤害及其他：技能造成的持续伤害，以及其他伤害  </li>
                      </ul>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-default btn-xs" data-dismiss="modal">关闭</button>
                  </div>
              </div>
          </div>
      </div>
    `;

        $(document.body).append(modal);

        $('.link-detail').click(function () {
            const id = $(this).data('id');
            const data = battleResult[id];
            const actor = $(this).data('actor');
            $('#idle-ui-char').text(actor);
            let actorTotalTurns = 0;
            let actorTotalDamage = 0;
            Object.keys(data).forEach(skill => {
                actorTotalTurns += data[skill].turn;
                actorTotalDamage += data[skill].damage;
            });

            const content = Object.keys(data).map(skill => {
                const skillData = data[skill];
                const percent = (skillData.turn / actorTotalTurns * 100).toFixed(1) - 0;
                const damagePercent = (skillData.damage / actorTotalDamage * 100).toFixed(1) - 0;
                const avgDamage = skillData.turn > 0 ? Math.round(skillData.damage / skillData.turn) : '-';
                return `<tr><td class="text-center skill">${skill}</td><td class="text-center fire">${skillData.damage}</td><td class="text-center poison">${damagePercent}%</td><td class="text-center physical">${skillData.turn}</td><td class="text-center poison">${percent}%</td><td class="text-center fire">${avgDamage}</td><td class="text-center fire">${skillData.damageDetail.base}</td><td class="text-center fire">${skillData.damageDetail['0'] || 0}</td><td class="text-center fire">${skillData.damageDetail['1'] || 0}</td><td class="text-center fire">${skillData.damageDetail['2'] || 0}</td></tr>`;
            }).join('');
            $('#idle-ui-battle-rows').html(content);
            $('#modalBattleDetail').modal('show');
        });

        function getCharId(index) {
            const ary = $('.battle-char').eq(index).prop('id').split('_');
            return ary[ary.length - 1];
        }

        function getActorTurns(id) {
            let ret = 0;
            if (battleResult[id]) {
                Object.keys(battleResult[id]).forEach(skill => {
                    ret += battleResult[id][skill].turn;
                });
            }
            return ret;
        }

        function getPlainText(element) {
            return element.clone()    //clone the element
                .children() //select all the children
                .remove()   //remove all the children
                .end()  //again go back to selected element
                .text();
        }
    }

    function switchSkin(showRequire) {
        $('.equip-content > .equip').each(function (item) {
            const type = $(this).children().first().attr('class');

            let classLabel = '';
            const requireIndex = $(this).text().indexOf('限');
            if (requireIndex >= 0) {
                const requireClass = $(this).text().substring(requireIndex + 1, requireIndex + 2);
                classLabel = '';
            }

            const label = location.href.indexOf('Auction/QueryBid') >= 0 ? $(this).parent().prev().find('.equip-name').first() : $(this).parent().prev().find('.equip-name').last();
            if (classLabel) {
                showRequire ? label.after(classLabel) : label.next().remove();
            }
        });
    }

    function inBattlePage() {
        const battePages = ['Battle/Simulate', 'Battle/InDungeon', 'Battle/WithChar'];
        return battePages.some(path => location.href.indexOf(path) >= 0);
    }

    function renderProcessing() {
        return '<span id="processing" class="mr-10" style="display:none;"><i class="glyphicon glyphicon-refresh"></i> 处理中...</span>';
    }

    function renderButton(id, text, type) {
        if (!type) type = 'success';
        return `<button type="button" class="btn btn-xs btn-${type} mr-10" id="${id}">${text}</button>`;
    }

    let uid = purl().param().id || purl().param().Id;

    let blockMap = localStorage.getItem('idle-ui-block');
    if (blockMap) {
        blockMap = JSON.parse(blockMap);
    } else {
        blockMap = {};
    }
    if (!blockMap[uid]) blockMap[uid] = {num: 0, time: +new Date()};
    let blockData = blockMap[uid];

    if (location.href.indexOf('Character/Detail') >= 0) {
        checkBlockNum();
        //$('.col-sm-6 .panel-body').eq(0).children().last().append(`<p>封号打击次数（仅供参考）：<span class="physical">${blockData.num}</span></p>`);
        $('.col-sm-6 .panel-body').eq(0).children().last().append(``);
    }

    function addBlockNum() {
        checkBlockNum();
        if (!blockData.num) blockData.num = 0;
        blockData.num += 1;
        blockData.time = +new Date();
        localStorage.setItem('idle-ui-block', JSON.stringify(blockMap));
        new Notification(`当前封号打击为${blockData.num}次，请注意`);
    }

    function checkBlockNum() {
        const curTime = +new Date();
        const hours = Math.floor((curTime - blockData.time) / (3600 * 1000));
        if (hours > 0) {
            blockData.num = blockData.num > hours ? blockData.num - hours : 0;
            blockData.time = blockData.time + (hours * 3600 * 1000);
            localStorage.setItem('idle-ui-block', JSON.stringify(blockMap));
        }
    }
};

window.addEventListener('load', idleInit, false);

const borderColor = '#6f5a40';
GM_addStyle(`
      @font-face {
	    font-family:"雅圆Comic sans MS- binsforever";
  	    src: url(https://down.brighost.com/guyin.woff);
      }
      .panel-top {
        margin-bottom: 20px;
        text-align: center;
      }
      .idle-ui-title {
        font-size: 13px;
        color: #fff;
        margin-bottom: 6px;
      }
      .panel-header {
        margin: 8px 0;
      }
      .panel-textarea {
        background-color: rgba(255,255,255,0.1);
        color: #a99877;
        margin-bottom: 8px;
      }
      .block-visited {
        background-color: #3f51b5 !important;
      }
      .hit-input {
        display: inline-block;
        color: #fff;
        width: 60px;
        padding: 0 8px;
        border-radius: 0;
        background-color: transparent;
      }
      .idle-ui-set-single, .idle-ui-set-full {
        opacity: 0.5;
      }
      .idle-ui-new-item {
        border: 1px dashed #888 !important;
      }
      .mr-10 {
        margin-right: 10px;
      }
      .ml-10 {
        margin-left: 10px;
      }
      @-webkit-keyframes rotate {
        from {
          -webkit-transform: rotate(0deg);
          -o-transform: rotate(0deg);
          transform: rotate(0deg);
        }
        to {
          -webkit-transform: rotate(360deg);
          -o-transform: rotate(360deg);
          transform: rotate(360deg);
        }
      }
      #processing i {
        animation: rotate 1s ease-in-out infinite;
      }
      .filter-input {
        width: 150px !important;
      }
      #big-slot {
        font-size: 17px;
        margin-top: 10px !important;
        color: #fff;
      }
      #idle-ui-quicksearch {
        position: relative;
        float: left;
        margin-top: 1em;
      }
      #idle-ui-quicksearch > input {
       width: 10em;
    display: inline;
    height: 1.3em;
    line-height: 2em;
    border-radius: 0.3em;
    }
      .equip-container > p:hover {
        white-space: nowrap;
      }
      .equip-container > p:hover .sr-only {
        z-index: 1;
        position: relative;
      }
      html.d3 body {
        color: #a99877;
        font-family: "雅圆Comic sans MS- binsforever";
      }
      html.d3 .panel {
        background-color: #171614;
        border-color: ${borderColor};
      }
      html.d3 .panel-inverse > .panel-heading {
        background-color: #101010;
        border-color: #6f5a40;
        font: normal 8px "guyin";
        color: #F3E6D0;
        border-radius: 9px 9px 0 0;
        height: 21px;
        line-height: inherit;
        font-family: "雅圆Comic sans MS- binsforever";
    }
      html.d3 .panel-inverse > .panel-heading .label {
        font-size: 9px;
        font-family: "雅圆Comic sans MS- binsforever";
      }
      .dropdown-menu > li > a:focus, .dropdown-menu > li > a:hover {
    border-radius: 0.3em;
    background-color: #515151;
    cursor: pointer;
    line-height: inherit;
}
        html.d3 .btn {
    background-color: transparent;
    border: 0.1em solid #6f5a40;
    color: #ad835a;
    line-height: 1.3em;
    border-radius: 0.3em;
    margin-top: -0.2em;
    }
      html.d3 .btn:hover {
        color: #fff !important;
      }
      html.d3 .btn:active {
        background-color: transparent;
      }
      .label {
        padding: 0px 0.1em 0px 0.1em;
    }
  html.d3 .label {
    border-radius: 0.3em;
    border: 0.3px solid #5f3d11;
    box-shadow: 0 0 2px #000;
    background-color: #000;
    color: #ad835a;
    font-family: "雅圆Comic sans MS- binsforever";
    display: inline-table;
}
    .equip-container .selected {
        animation: glow 800ms ease-out infinite alternate;
    }
    @keyframes glow {
        0% {
            border-color: rgb(255 255 255);
    border-radius: 3em;
    box-shadow: 0 0 0.3px 0.7px rgb(95 52 255 / 43%), inset 0 0 8px 1.4px rgb(255 255 255 / 33%), 0 0 0.3px 0.7px rgb(52 0 255);
        }
        100% {
            border-color: rgb(2 255 0);
    border-radius: 0.3em;
    box-shadow: 0 0 9px 1px rgb(166 255 0 / 23%), inset 0 0 1px 1px rgb(10 239 46 / 24%), 0 0 8px 0px rgb(107 255 0);
        }
    }
    .navbar-inverse {
    background-color: #222;
    border-color: #080808;
    height: 3.3em;
}
.navbar {
    position: relative;
    min-height: 2em;
    margin-bottom: 1em;
    border: 1px solid transparent;
}
    .btn-group-xs>.btn, .btn-xs {
        padding: 0px 3px 0px 3px;
        font-size: 12px;
        border-radius: 9px;
    }
      html.d3 .label.label-info {
        color: #6969ff;
      }
      html.d3 .label.label-warning {
        color: #ffff00;
      }
      html.d3 .label.label-danger {
        color: #e60101;
      }
      html.d3 .label.label-success {
        color: #00c400;
      }
      html.d3 .physical {
        color: #f3e6d0 !important;
      }
      html.d3 .navbar-inverse.navbar-fixed-top {
        border-bottom: 1px solid #322a20;
        background-color: #171614;
        margin-top:-30px;
      }
      html.d3 .navbar-inverse .navbar-brand {
        color: #f3e6d0;
        font-family: "雅圆Comic sans MS- binsforever";
        text-align: center;
        margin-top: 7px;
    }
      html.d3 a, html.d3 .navbar-inverse .navbar-nav>li>a {
        color: #ad835a;
    line-height: 8px;
    font-size: 14px;
      }
      .navbar-nav {
    border-radius: 0.3em;
    background-color: #171614;
    text-align: right;
    padding: 5px 0px 0px 0px;
}
.navbar-inverse .navbar-nav>.open>a, .navbar-inverse .navbar-nav>.open>a:focus, .navbar-inverse .navbar-nav>.open>a:hover {
    color: #fff;
    background-color: #303030;
    border-radius: 0.3em;
}
.navbar-fixed-bottom .navbar-collapse, .navbar-fixed-top .navbar-collapse {
    max-height: max-content;
}
.navbar-inverse .navbar-nav .open .dropdown-menu>li>a {
    color: #9d9d9d;
    line-height: 14px;
    height: auto;
    text-align: right;
}
      html.d3 .magical, html.d3 .skill, html.d3 .cold {
        color: #6969ff !important;
      }
      html.d3 .hit-input {
        border-color: ${borderColor};
        height: fit-content;
      }
      html.d3 .progress {
        border: 1px solid #513f2e;
        border-radius: 0;
        box-shadow: 0 0 5px #000;
        background-color: #101010;
        color: #f3e6d0;
        height: 15px;
        border-radius: 9px;
      }
      html.d3 .progress-bar {
        border: 1px solid #101010;
        line-height: 14px;
        border-radius: 9px;
      }

      html.d3 .footer {
        border-top: 1px solid #322a20;
        background-color: #171614;
      }
      html.d3 .btn.btn-success {
        color: #00c400;
      }
      html.d3 .btn.btn-danger {
        color: #e60101;
      }
      html.d3 .img-thumbnail {
        border-color: #d59c52;
      }
      html.d3 .popover {
    background: #1d180e;
    border: 1px solid #322a20;
    border-radius: 9px;
    box-shadow: 0 0 10px #000;
    max-width: 100%;
    width: max-content;
}
      html.d3 .popover-content .equip p:first-child {
   height: 100%;
    width: 100%;
    padding: 0;
    margin: 5px 0px 5px 0px !important;
    text-align: center;
    line-height: 15px;
    font-size: 14px;
    font-family: "雅圆Comic sans MS- binsforever";
}

.popover-content {
    padding: 3PX 3PX 3PX 3PX;
}
      html.d3 .popover-content .equip p.unique:first-child {
        background-position: 0 -120px;
      }
      html.d3 .popover-content .equip p.set:first-child {
        background-position: 0 -180px;
      }
      html.d3 .popover-content .equip p.rare:first-child {
        background-position: 0 -90px;
      }
      html.d3 .popover-content .equip p.artifact:first-child {
        background-position: 0 -150px;
      }
      html.d3 .popover-content .equip p.magical:first-child {
        background-position: 0 -60px;
      }
      html.d3 .popover-content .equip p.base:first-child {
        background-position: 0 -30px;
      }
      html.d3 .popover-content .equip p.slot:first-child {
        background-position: 0 -30px;
      }
      html.d3 .popover-content {
    background-color: #000;
    border-radius: 0.3em;
    text-align: center;
    font-size:11px;
}
      html.d3 hr {
        border-color: ${borderColor};
      }
      html.d3 .panel-inverse > .panel-footer {
        background-color: #00000000;
        border-color: ${borderColor};
      }
      html.d3 .modal-dialog {
        box-shadow: 0 0 10px #000;
      }
      .panel {
        background-color: transparent;
    margin-bottom: 0.3em;
    border-radius: 0.3em;
    }
    .panel.panel-inverse {
    background-color: transparent;
    margin-bottom: 0.3em;
    border-radius: 0.3em;
}
      html.d3 .modal-content {
        background-color: #171614;
        border-color: ${borderColor};
        border-radius: 9px;
      }
      html.d3 .model-inverse > .modal-header, html.d3 .model-inverse > .modal-footer {
        background-color: #101010;
        border-color: ${borderColor};
       padding: 1px 1px 1px 1px;
    text-align: center;
    border-radius: 9px;
}
.skill-name {
    cursor: pointer;
    border-radius: 9px;
}
      html.d3 .model-inverse > .modal-header span {
        line-height: normal;
      }
      html.d3 .panel-textarea {
        border-color: ${borderColor};
      }
      .panel-footer .panel-filter {
    height: 2em;
    background: black;
    border: solid 0.1em #000;
    width: 20%;
    text-indent: 0.4em;
    border-radius: 0.3em;
    font-size: 0.7em;
    }
      html.d3 .panel-footer .panel-filter {
        border-color: #2a241c;
      }
      .panel-footer {
    background-color: #f5f5f5;
    border-top: 0.1em solid #ddd;
    border-bottom-right-radius: 0.3em;
    border-bottom-left-radius: 0.3em;
    line-height: 0.8em;
}
      html.d3 .btn-default:active:focus,
      html.d3 .open>.dropdown-toggle.btn-default:focus,
      html.d3 .btn-default.active, .btn-default:active,
      html.d3 .open>.dropdown-toggle.btn-default {
        background-color: transparent;
        color: #a99877;
      }
      html.d3 .dropdown-menu {
        background-color: #101010;
        border-color: ${borderColor};
        box-shadow: 0 0 10px #000;
        font-family: "雅圆Comic sans MS- binsforever";
        border-radius: 0.3em;
        padding: 3px 3px 3px 3px;
      }
      html.d3 .equip-container .selected {
        border: 1px solid ${borderColor};
        background-color: transparent;
      }
      html.d3 .table > tbody > tr > td,
      html.d3 .table > tbody > tr > th,
      html.d3 .table > tfoot > tr > td,
      html.d3 .table > tfoot > tr > th,
      html.d3 .table > thead > tr > td,
      html.d3 .table > thead > tr > th {
        border-color: ${borderColor};
        padding: 1px 1px 1px 1px;
      }
      html.d3 .equip .divider {
        background-color: ${borderColor};
      }
   html.d3 .panel-heading .btn-group, html.d3 .panel-heading .btn {
    vertical-align: middle;
    border-radius: 0.3em;
    margin-right: 0.3em;
    margin-top: -0.1em;
    margin-bottom: 0.1em;
}
      html.d3 .form-control{
        border-color: ${borderColor};
        background-color: #101010;
    color: #a99877;
    border-radius: 0.3em;
    line-height: 2.1em;
    height: 2.1em;
    width: 10em;
    margin: auto;
      }
      html.d3 .form-validation .form-control {
        width: 198px;
      }
      html.d3 .popover.bottom>.arrow:after {
        border-bottom-color: #322a20;
      }
      html.d3 .super, html.d3 .unique {
        color: rgb(255,128,0) !important;
      }
      html.d3 .artifact {
        color: rgb(182,89,245) !important;
      }
html.d3 .equip > p {
    color: #6969ff;
    line-height: 11px;
    font-size: 11px;
    font-family: "雅圆Comic sans MS- binsforever";
    padding: 0 0 0 0;
}
      .panel {
    background-color: transparent;
    margin-bottom: 10px;
    border-radius: 9px;
}
    .panel .col-xs-1, .panel .col-sm-1, .panel .col-md-1, .panel .col-lg-1, .panel .col-xs-2, .panel .col-sm-2, .panel .col-md-2, .panel .col-lg-2, .panel .col-xs-3, .panel .col-sm-3, .panel .col-md-3, .panel .col-lg-3, .panel .col-xs-4, .panel .col-sm-4, .panel .col-md-4, .panel .col-lg-4, .panel .col-xs-5, .panel .col-sm-5, .panel .col-md-5, .panel .col-lg-5, .panel .col-xs-6, .panel .col-sm-6, .panel .col-md-6, .panel .col-lg-6, .panel .col-xs-7, .panel .col-sm-7, .panel .col-md-7, .panel .col-lg-7, .panel .col-xs-8, .panel .col-sm-8, .panel .col-md-8, .panel .col-lg-8, .panel .col-xs-9, .panel .col-sm-9, .panel .col-md-9, .panel .col-lg-9, .panel .col-xs-10, .panel .col-sm-10, .panel .col-md-10, .panel .col-lg-10, .panel .col-xs-11, .panel .col-sm-11, .panel .col-md-11, .panel .col-lg-11, .panel .col-xs-12, .panel .col-sm-12, .panel .col-md-12, .panel .col-lg-12 {
        position: relative;
    min-height: 1em;
    line-height: 14px;
    font-size: 11px;
    font-variant: common-ligatures;
    }
    .equip-container > p {
border: 1px solid transparent;
    font-size: 13px;
    font-variant: common-ligatures;
    line-height: 14px;
    width: max-content;
}
.char-container > p {
    cursor: pointer;
    font-size: 9px;
    font-variant: proportional-width;
    line-height: 100%;
}
p {
    margin: 0px 0px 0px 0px;
    font-size: 15px;
    line-height: 15px;
}
.panel-heading {
    border-bottom: 1px solid transparent;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    padding: 0 0 10px 10px;
}
.badge {
    display: inline-block;
    min-width: 10px;
    font-size: 12px;
    font-weight: 700;
    line-height: 1.5;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    border-radius: 10px;
    line-height: 10px;
}

span.badge.attr-points {
    line-height: 10px;
}
.equip p, .equip-magic p {
    margin-bottom: 3px !important;
    margin-top: 1px !important;
    line-height: 11px;
    font-size: 9px;
}
.media-body, .media-left, .media-right {
    display: table-cell;
    vertical-align: top;
    line-height: 20px;
}
.panel-body {
    padding: 0.5em;
}
.char-container {
    padding: 5px 0px 0px 5px;
}
.notice-content {
    cursor: pointer;
    font-size: 11px;
    line-height: 15px;
}
.panel>.panel-collapse>.table, .panel>.table, .panel>.table-responsive>.table {
    margin-bottom: 0;
    font-size: 9px;
}
td, th {
    padding: 0;
    line-height: 10px;
}
tr {
    padding: 0;
    line-height: 10px;
}
hr {
    margin-top: 7px;
    margin-bottom: 7px;
    border: 0;
    border-top: 1px solid #eee;
}
.turn {
    display: none;
    line-height: 12px;
    font-size: 5px;
}
.dropdown-menu>li>a {
    display: flow-root;
    padding: 1px 1px 1px 1px;
    font-weight: 400;
    color: #333;
    white-space: nowrap;
    height: 15px;
    font-size: 13px;
    text-align: center;
    line-height: inherit;
}
.media-object.img-thumbnail {
    max-width: 64px;
    max-height: 64px;
    margin: auto;
    margin-top: 10px;
    margin-left: 10px;
}
.popover-content {
    padding: 1px 1px 1px 1px;
    line-height: 13px;
 font-family: "雅圆Comic sans MS- binsforever";
 font-size: 9px;
}
.modal-body {
    position: relative;
    text-align: center;
    padding: 0px 32px 0px 32px;
}
.modal-body.dungeon-log {
    text-align: left;
    padding: 0px 1px 0px 1px'';
    font-size: 9px;
    line-height: 13px;
    display: flow-root;
}
ol, ul {
    margin-top: 0;
    margin-bottom: 10px;
    list-style: inside;
    text-align: left;
    font-size: 11px;
    padding: 1px 1px 1px 1px;
    line-height: 14px;
}
.table {
    width: 100%;
    max-width: 100%;
    margin-bottom: 5px;
}
.skill-editor .selected {
    border: 1px solid #5cb85c;
    padding: 1px 2px;
    background-color: #222;
    animation: selectskill 800ms ease-out infinite alternate;
}
@keyframes selectskill {
    0% {
        border-color: rgb(155, 247, 6);
    border-radius: 9px;
    box-shadow: 0 0 0.3px 0.7px rgba(0, 255, 30, 0.43), inset 0 0 8px 1.4px rgba(0, 255, 42, 0.19), 0 0 0.3px 0.7px rgb(43, 255, 0);
}
100% {
    border-color: rgb(255, 255, 255);
border-radius: 9px;
box-shadow: 0 0 11px 5px rgb(183 183 183 / 20%), inset 0 0 7px 2px rgb(255 255 255 / 10%), 0 0 5px 1px rgb(237 237 237);
}
}

.progress-bar-mana {
    border-radius: 9px;
    height: 14px;
    background: url(https://down.brighost.com/mana.png)no-repeat;
    background-size: cover;
    text-shadow: 0px 0px 3px black;
    box-shadow: inset 0 0 2px 0.1px #00000082;
}
html.d3 .progress-bar-exp {
    border-radius: 9px;
    height: 14px;
    background: url(https://down.brighost.com/exp.png)no-repeat;
    background-size: cover;
    text-shadow: 0px 0px 3px black;
    box-shadow: inset 0 0 2px 0.1px #00000082;
}
html.d3 .progress-bar-life {
    border-radius: 9px;
    height: 14px;
    background: url(https://down.brighost.com/blood.png)no-repeat;
    background-size: cover;
    text-shadow: 0px 0px 3px black;
    box-shadow: inset 0 0 2px 0.1px #00000082;
}
    //这里往下是密境修改
.dungeon-container .normal {
    background-image: url(https://down.brighost.com/normal.png);
}

.dungeon-container .rare {
    background-image: url(https://down.brighost.com/rare.png);
}

.dungeon-container .super {
    background-image: url(https://down.brighost.com/super.png);
}

.dungeon-container .boss {
    background-image: url(https://down.brighost.com/boss.png);
    background-color: #100f0b;
}

.dungeon-container .public {
    background-image: url(https://down.brighost.com/backdgue.png)no-repeat;
}
.dungeon-container .left {
    border-left: solid 7px #808080;
    border-image-source: url(https://down.brighost.com/left.png);
    border-image-slice: 32;
}
.dungeon-container .top {
    border-top: solid 7px #808080;
    border-image-source: url(https://down.brighost.com/top.png);
    border-image-slice: 32;
}
.dungeon-container .top.left {
    border-top: solid 7px #808080;
    border-image-source: url(https://down.brighost.com/left.png);
    border-image-slice: 32;
}
.dungeon-container .block {
    display: block;
    float: left;
    width: 4.77%;
    height: 30px;
    color: white;
    font-size: 30px;
    text-align: center;
    line-height: 30px;
    box-sizing: border-box;
    background-repeat: no-repeat;
    background-size: contain;
}
.panel-body.dungeon-container.hidden-xsm {
    margin-left: 37px;
}

.skill-container .disabled {
    border: 1px solid red;
    padding: 1px 2px;
    cursor: not-allowed;
}
.popover-content > .equip > .equip-title {
     height: 30px;
     width: 263px;
     line-height: 30px;
     text-align: center;
     background-image: url();
     background-repeat: no-repeat;
}
body {
    font-family: Arial,Helvetica,Sans-Serif;
    background-color: black;
    font-size: 15px;
    line-height: 150%;
    color: #afafaf;
    padding-top: 2em;
    padding-bottom: 2em;
    overflow-x: hidden;
    height:100%;
}
.equip {
    text-align: center;
}
.duik-go-to {
    border: 1px dashed #c3bebe;
    z-index: 100;
    width: 2.75rem;
    height: 2.75rem;
    color: #555;
    opacity: 1;
    background-color: #f5f5f5;
    border-radius: 50%;
    font-size: 1rem;
    transition: all .3s ease-out;
    position: fixed;
    bottom: -50px;
    right: 25px;
    display: none;
}
`);
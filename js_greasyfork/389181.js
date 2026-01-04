// ==UserScript==
// @name         idle-界面改
// @version      1.00
// @namespace    ErQi
// @description  挂机无止境的辅助脚本
// @author       Dammu
// @grant		 GM_addStyle
// @run-at       document-start
// @match      https://www.idleinfinity.cn/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.1/moment.min.js
// @downloadURL https://update.greasyfork.org/scripts/389181/idle-%E7%95%8C%E9%9D%A2%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/389181/idle-%E7%95%8C%E9%9D%A2%E6%94%B9.meta.js
// ==/UserScript==

function highlights() {
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
                    eqn[eqn.length - 1].innerHTML += ' <span style="color:red; background-color: black;">火刻 ' + hits[1] + 'slv</span>';
                }
                hits = gear.innerHTML.match(/(\d+)暴风雪/);
                if (hits != null) {
                    eqn[eqn.length - 1].innerHTML += ' <span style="color:#3ff; background-color: black;">冰刻 ' + hits[1] + 'slv</span>';
                }
                hits = gear.innerHTML.match(/(\d+)连锁闪电/);
                if (hits != null) {
                    eqn[eqn.length - 1].innerHTML += ' <span style="color:yellow; background-color: black;">电刻 ' + hits[1] + 'slv</span>';
                }
                hits = gear.innerHTML.match(/(\d+)剧毒新星/);
                if (hits != null) {
                    eqn[eqn.length - 1].innerHTML += ' <span style="color:#00c400; background-color: black;">毒刻 ' + hits[1] + 'slv</span>';
                }
                hits = gear.innerHTML.match(/(\d+)虚化/);
                if (hits != null) {
                    eqn[eqn.length - 1].innerHTML += ' <span style="color:#B659F5; background-color: black;">魔刻 ' + hits[1] + 'slv</span>';
                }
                hits = gear.innerHTML.match(/(\d+)伤害加深/);
                if (hits != null) {
                    eqn[eqn.length - 1].innerHTML += ' <span style="color:white; background-color: black;">物刻</span>';
                }
                hits = gear.innerHTML.match(/(\d+)\% 火焰伤害/);
                if (hits != null) {
                    eqn[eqn.length - 1].innerHTML += ' <span style="color:red; background-color: black;">+' + hits[1] + '</span>';
                }
                hits = gear.innerHTML.match(/(\d+)\% 冰冷伤害/);
                if (hits != null) {
                    eqn[eqn.length - 1].innerHTML += ' <span style="color:#3ff; background-color: black;">+' + hits[1] + '</span>';
                }
                hits = gear.innerHTML.match(/(\d+)\% 闪电伤害/);
                if (hits != null) {
                    eqn[eqn.length - 1].innerHTML += ' <span style="color:yellow; background-color: black;">+' + hits[1] + '</span>';
                }
                hits = gear.innerHTML.match(/(\d+)\% 毒素伤害/);
                if (hits != null) {
                    eqn[eqn.length - 1].innerHTML += ' <span style="color:#00c400; background-color: black;">+' + hits[1] + '</span>';
                }
                hits = gear.innerHTML.match(/(\d+)\% 魔法伤害/);
                if (hits != null) {
                    eqn[eqn.length - 1].innerHTML += ' <span style="color:#B659F5; background-color: black;">+' + hits[1] + '</span>';
                }
                hits = gear.innerHTML.match(/(\d+)\% 物理伤害/);
                if (hits != null) {
                    eqn[eqn.length - 1].innerHTML += ' <span style="color:white; background-color: black;">+' + hits[1] + '</span>';
                }
                hits = gear.innerHTML.match(/(\d+)\% 目标火焰抗性/);
                if (hits != null) {
                    eqn[eqn.length - 1].innerHTML += ' <span style="color:red; background-color: black;">-' + hits[1] + '</span>';
                }
                hits = gear.innerHTML.match(/(\d+)\% 目标冰冷抗性/);
                if (hits != null) {
                    eqn[eqn.length - 1].innerHTML += ' <span style="color:#3ff; background-color: black;">-' + hits[1] + '</span>';
                }
                hits = gear.innerHTML.match(/(\d+)\% 目标闪电抗性/);
                if (hits != null) {
                    eqn[eqn.length - 1].innerHTML += ' <span style="color:yellow; background-color: black;">-' + hits[1] + '</span>';
                }
                hits = gear.innerHTML.match(/(\d+)\% 目标毒素抗性/);
                if (hits != null) {
                    eqn[eqn.length - 1].innerHTML += ' <span style="color:#00c400; background-color: black;">-' + hits[1] + '</span>';
                }
            }
            hits = gear.innerHTML.match(/攻击速度提升 (\d+)\%/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:#ffd700; background-color: black;">' + hits[1] + 'ias </span>';
            }
            hits = gear.innerHTML.match(/施法速度提升 (\d+)\%/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:#ff8000; background-color: black;">' + hits[1] + 'fcr </span>';
            }
            hits = gear.innerHTML.match(/\+(\d+)\% 增强伤害/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:#66ccff; background-color: black;">' + hits[1] + 'ed </span>';
            }
            hits = gear.innerHTML.match(/\+(\d+)\% 暴击几率/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:#CCCC00; background-color: black;">' + hits[1] + 'cri </span>';
            }
            hits = ps[ps.length - 1].textContent.match(/凹槽(\(\d+\/\d+\))/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name')
                eqn[eqn.length - 1].innerHTML += ' <span>' + hits[1] + ' </span>';
            }
            hits = gear.innerHTML.match(/\+(\d+)\% 更佳的机会取得魔法装备/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:white; background-color: black;"> ' + hits[1] + 'mf </span>';
            }
            hits = gear.innerHTML.match(/\+(\d+)\% 额外金币从怪物身上取得/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:gold; background-color: black;"> ' + hits[1] + 'gf </span>';
            }
            hits = gear.innerHTML.match(/元素抗性 \+(\d+)\%/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:#f90; background-color: black;">' + hits[1] + 'ar </span>';
            }
            hits = gear.innerHTML.match(/抗火 \+(\d+)\%/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:red; background-color: black;">' + hits[1] + 'f </span>';
            }
            hits = gear.innerHTML.match(/抗寒 \+(\d+)\%/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:#3ff; background-color: black;">' + hits[1] + 'c </span>';
            }
            hits = gear.innerHTML.match(/抗闪电 \+(\d+)\%/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:yellow; background-color: black;">' + hits[1] + 'l </span>';
            }
            hits = gear.innerHTML.match(/抗毒 \+(\d+)\%/);
            if (hits != null) {
                eqn = gear.previousElementSibling.getElementsByClassName('equip-name');
                eqn[eqn.length - 1].innerHTML += ' <span style="color:#00c400; background-color: black;">' + hits[1] + 'p </span>';
            }
        }
    }

    $('.navbar-nav > li > a').each(function () {
        if ($(this).text().indexOf('帮助') >= 0) {
            const links = [
                {text: '暗金列表', link: '/Help/Content?url=Unique'},
                {text: '套装列表', link: '/Help/Content?url=Set'},
                {text: '秘境圣衣', link: '/Help/Content?url=Sacred'},
                {text: '神器列表', link: '/Help/Content?url=Artifact'},
                {text: '普通物品', link: '/Help/Content?url=BaseEquip'},
                {text: '前缀属性', link: '/Help/Content?url=Prefix'},
                {text: '后缀属性', link: '/Help/Content?url=Suffix'},
                {text: '固定词缀', link: '/Help/Content?url=SpecialAffix'},
                {text: '神秘玩具', link: '/Help/specialequip'},
            ].map(item => {
                return `<li><a class="base" href="${item.link}" target="_blank">${item.text}</a></li>`;
            }).join('');
            $(this).next().append(links);
        }
    });

    //快速搜索
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
        <span id="idle-quick-type">暗金</span><span class="caret" style="margin-left: 5px;"></span>
      </button>
      <ul class="dropdown-menu">
          <li><a class="quick-option unique" data-type="Unique" href="javascript: void(0);">暗金</a></li>
          <li><a class="quick-option set" data-type="Set" href="javascript: void(0);">套装</a></li>
          <li><a class="quick-option artifact" data-type="Artifact" href="javascript: void(0);">神器</a></li>
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

    const showSpellColor = true;
    if (showSpellColor) {
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

    var showSpeedLevel = true;
    var showCharDmg = true;
    var showAccuracy = true;
    //var showSpellColor = true;
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
            if (showSpeedLevel) {
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
            if (showCharDmg) {
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
            if (showAccuracy) {
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

            var itemStats = true;
            if (itemStats) {
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
        const message = `<div class="panel panel-inverse panel-top"><div class="panel-body">上次访问是${timeSpan}，这段时间内你获得了 <span class="unique">${uniqueChange}</span> 件暗金，<span class="set">${setChange}</span> 件套装。<a href="javascript: void(0);" id="open-ui-modal" </a></div></div>`;

        $('.navbar.navbar-inverse.navbar-fixed-top').next().next().prepend(message);
        $('#open-ui-modal').click(function () {
            $('#modalUI').modal('show');
        });
    }

    (function switchSkin(showRequire) {
        $('.equip-content > .equip').each(function (item) {
            const type = $(this).children().first().attr('class');

            let classLabel = '';
            const requireIndex = $(this).text().indexOf('限');
            if (requireIndex >= 0) {
                const requireClass = $(this).text().substring(requireIndex + 1, requireIndex + 2);
                classLabel = '<span style="color: #a99877" class="mr-10">' + requireClass + '</span>';
            }

            const label = location.href.indexOf('Auction/QueryBid') >= 0 ? $(this).parent().prev().find('.equip-name').first() : $(this).parent().prev().find('.equip-name').last();
            if (classLabel) {
                showRequire ? label.after(classLabel) : label.next().remove();
            }
        });
    })(true);

    //符文提示
    const showRuneTip = true;
    if (showRuneTip) {
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

            //$('.equip').eq(0).children().last().prop('id', 'big-slot');
            const dong = '凹槽';
            var dongL = $('.equip').eq(0).children().length;
            var dongRE = $('.equip').eq(0).children()[dongL-1].innerText.slice(0,2);

            if (dongRE === dong) {
            	$('.equip').eq(0).children().last().prop('id', 'big-slot');
            }

            const link = '<a href="/Help/Content?url=Artifact" target="_blank" class="btn btn-xs btn-success mr-10">神器列表</a>';
            //$('.btn.btn-xs').eq(0).before(link);
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

    //显示ah一口价
    if (location.href.indexOf('Auction/Query') >= 0 && location.href.indexOf('Auction/QueryBid') === -1) {
    	if (true) {
    		$('.equip-label.equip-price').each(function () {
    			const price = $(this).text().slice(83);
    			const label = $(this).parent().parent().prev().children('.equip-name').last();
    			label.after(`<p style="color: #CDC8B1;"> ${price}</p>`);
    		})
    	}
    }

}

window.addEventListener('load', highlights, false);

GM_addStyle(`
	.panel-top {
        margin-bottom: 20px;
        text-align: center;
      }
      .idle-ui-title {
        font-size: 18px;
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
        font-size: 24px;
        margin-top: 10px !important;
        color: #fff;
      }
      #idle-ui-quicksearch {
        position: relative;
        float: left;
        margin-top: 14px;
      }
      #idle-ui-quicksearch > input {
        width: 150px;
        display: inline-block;
        height: 24px;
        line-height: 24px;
        border-radius: 3px;
      }
      .equip-container > p:hover {
        white-space: nowrap;
      }
      .equip-container > p:hover .sr-only {
        z-index: 1;
        position: relative;
      }
	`);
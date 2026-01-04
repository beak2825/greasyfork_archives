// ==UserScript==
// @name         遇见江湖-帮战助手
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @license      MIT; https://github.com/ccd0/4chan-x/blob/master/LICENSE
// @description  just to make the game easier!
// @author       RL
// @include      http://sword-direct*.yytou.cn*
// @run-at       document-idle
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/370360/%E9%81%87%E8%A7%81%E6%B1%9F%E6%B9%96-%E5%B8%AE%E6%88%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/370360/%E9%81%87%E8%A7%81%E6%B1%9F%E6%B9%96-%E5%B8%AE%E6%88%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

window.setTimeout(function () {
    class Job {
        constructor (id, interval, startEvent) {
            this._id = id;
            this._interval = interval;
            this._startEvent = startEvent;
        }

        start () {
            this._handler = setInterval(this._startEvent, this._interval);
            log(`Starting job ${this._id} (handler= ${this._handler})...`);
        }

        stop () {
            log(`Job ${this._id} (handler= ${this._handler}) stopped.`);
            clearInterval(this._handler);
        }

        getId () {
            return this._id;
        }

        getInterval () {
            return this._interval;
        }
    };

    var JobRegistry = {
        _jobs: [],

        register (id, interval, startEvent) {
            this._jobs.push(new Job(id, interval, startEvent));
        },

        getJob (id) {
            return this._jobs.filter(v => v.getId() === id)[0];
        }
    };

    class Retry {
        constructor (interval = 1000) {
            this._interval = interval;
        }

        initialize (retryEvent, teminateCriterial) {
            this._retryEvent = retryEvent;
            this._terminateCriterial = teminateCriterial;

            this._stop = false;
        }

        async fire () {
            if (!this._stop && (!this._terminateCriterial || !this._terminateCriterial())) {
                await this._retryEvent();
                await ExecutionManager.wait(this._interval);

                await this.fire();
            }
        }

        stop () {
            this._stop = true;
        }
    };

    var InterceptorRegistry = {
        _interceptors: [],

        register (interceptor) {
            if (this._interceptors.includes(interceptor)) {
                log(`Duplicate interceptor skipped: ${interceptor.getAlias()}`);
            } else {
                log(`New interceptor registered: ${interceptor.getAlias()}`);
                this._interceptors.push(interceptor);
            }
        },

        unregister (alias) {
            log(`Interceptor unregistered: ${alias}`);
            this._interceptors.splice(this._interceptors.indexOf(this._interceptors.find(v => v.getAlias() === alias)), 1);
        },

        getInterceptors (type, subtype) {
            return this._interceptors.filter(v => (!type || v.getType() === type) && (!subtype || v.getSubtype() === subtype));
        }
    };

    class Interceptor {
        constructor (alias, criterial, behavior, type, subtype) {
            this._alias = alias;
            this._criterial = criterial;
            this._behavior = behavior;
            this._type = type;
            this._subtype = subtype;
        }

        getAlias () {
            return this._alias;
        }

        getType () {
            return this._type;
        }

        getSubtype () {
            return this._subtype;
        }

        handle (message) {
            if (this._criterial(message)) {
                debugging(`Interceptor ${this._alias} triggered...`);

                this._behavior(message);
                return true;
            }
        }
    };

    var System = {
        globalObjectMap: window.unsafeWindow.g_obj_map,
        debugMode: false,
        loadingScriptInProgress: true,

        _uid: '',
        _automatedReconnect: false,

        ansiToText (valueWithColor) {
            return valueWithColor ? window.unsafeWindow.ansi_up.ansi_to_text(valueWithColor) : '';
        },

        replaceControlCharBlank (valueWithColor) {
            return valueWithColor ? window.unsafeWindow.g_simul_efun.replaceControlCharBlank(valueWithColor) : '';
        },

        resetTitle () {
            document.title = System.isLocalServer() ? User.getName() : User.getName() + '-跨服';
        },

        setVariant (key, value) {
            window.GM_setValue(`${User.getId()}.${key}`, value);
        },

        getVariant (key, defaultValue) {
            let currentValue = window.GM_getValue(`${User.getId()}.${key}`);
            if ((!currentValue && currentValue !== '' && currentValue !== 0) && (defaultValue || defaultValue === 0)) {
                System.setVariant(key, defaultValue);

                return defaultValue;
            } else {
                return currentValue;
            }
        },

        isLocalServer () {
            return User.getArea() < 1000;
        },

        switchToRemoteServer () {
            window.unsafeWindow.g_world_ip = 'sword-inter1-direct.yytou.cn';
            window.unsafeWindow.g_world_port = 8881;
            window.unsafeWindow.g_world_uid = System.globalObjectMap.get('msg_attrs').get('id').replace('u', '') + `-${User.getArea()}a1a`;
            window.unsafeWindow.sock.close();
            window.unsafeWindow.sock = 0;
            window.unsafeWindow.g_gmain.g_delay_connect = 0;

            window.unsafeWindow.connectServer();
        },

        switchToLocalServer () {
            window.unsafeWindow.g_world_uid = 0;
            window.unsafeWindow.g_world_port = 0;
            window.unsafeWindow.g_world_ip = 0;
            window.unsafeWindow.sock.close();
            window.unsafeWindow.sock = 0;
            window.unsafeWindow.g_gmain.g_delay_connect = 0;

            window.unsafeWindow.connectServer();
        },

        setDebugMessageBlacklist (blacklist) {
            System.setVariant(System.keys.DEBUG_MESSAGE_REJECTED, blacklist);
        },

        getDebugMessageBlacklist () {
            let blacklist = System.getVariant(System.keys.DEBUG_MESSAGE_REJECTED);

            if (blacklist || blacklist === '') return blacklist;

            return 'attrs_changed,channel|rumor,attr';
        },

        keys: {
            ATTACK_SKILLS: 'attack.skills',
            ATTACK_SKILLS_BUFFER_RESERVED: 'attack.skills.buffer.reserved',
            RECOVERY_SKILL: 'recovery.skill',
            RECOVERY_THRESHOLD: 'recovery.threshold',
            DEBUG_MESSAGE_REJECTED: 'debug.message.rejected',
            LAST_ACTIVE_BUTTON_IDS: 'active.button.ids',
            CLAN_BATTLE_PLACE: 'clan.battle.place',
            GANODERMAS_PURCHASE: 'threshold.purchase.ganodermas.quantity',
            FUGITIVE_NAMES: 'fugitive.names'
        },

        logCurrentSettings () {
            log('************************************帮战脚本当前用户设置***************************************************');
            log(`自动出招：${System.getVariant(System.keys.ATTACK_SKILLS)} - 预留 ${System.getVariant(System.keys.ATTACK_SKILLS_BUFFER_RESERVED)} 气`);
            log(`回血内功：${System.getVariant(System.keys.RECOVERY_SKILL)}，吸气阈值 ${System.getVariant(System.keys.RECOVERY_THRESHOLD)}`);
            log('**************************************************************************************************');
        }
    };

    var User = {
        _areaRange: '',

        async initialize () {
            await ButtonManager.click('items;skills;team;friend;score;#5 prev');

            User._areaRange = identifyAreaRange(User.getArea());

            await Objects.Room.refresh();

            System.logCurrentSettings();

            function identifyAreaRange (area) {
                for (let start = 1, end = 5; start < 500; start += 5, end += 5) {
                    if (area >= start && area <= end) {
                        return start + '-' + end;
                    }
                }
            }
        },

        getName () {
            return System.globalObjectMap.get('msg_attrs').get('name');
        },

        getId () {
            return System.globalObjectMap.get('msg_attrs').get('id');
        },

        getArea () {
            return parseInt(System.globalObjectMap.get('msg_status').get('area'));
        },

        getAreaRange () {
            return User._areaRange;
        },

        attributes: {
            getMaxEnforce () {
                return parseInt(System.globalObjectMap.get('msg_score').get('max_enforce'));
            },

            getMaxKee () {
                return parseInt(System.globalObjectMap.get('msg_attrs').get('max_kee'));
            },

            getCurrentKee () {
                return parseInt(System.globalObjectMap.get('msg_attrs').get('kee'));
            },

            getCurrentForce () {
                return parseInt(System.globalObjectMap.get('msg_attrs').get('force'));
            },

            getMaxForce () {
                return parseInt(System.globalObjectMap.get('msg_attrs').get('max_force'));
            }
        },

        skills: {
            getSkillsEnabled (type = 'attack') {
                return System.globalObjectMap.get('msg_skills').elements.filter(function (v) {
                    if (!v['key'].includes('skill')) return false;

                    let info = Array.isArray(v['value']) ? v['value'] : v['value'].split(',');
                    return info[info.length - 3] === '1' && (!type || info[info.length - 4] === type);
                }).map(v => System.ansiToText(v['value'].split(',')[1]));
            }
        }
    };

    class Npc {
        constructor (name, id = '') {
            this._name = name;
            if (id) this._id = id;
        }

        setId (id) {
            this._id = id;
        }

        getId () {
            if (this._id) {
                return this._id;
            } else {
                let ids = Objects.Room.getNpcIdsByName(this._name);
                if (ids && ids.length > 0) {
                    return ids[0];
                }
            }
        }

        getName () {
            return this._name;
        }

        toString () {
            return this._name + '/' + this._id;
        }
    };

    class Item {
        constructor (name, id = '', quantity = 1) {
            this._name = name;
            if (id) this._id = id;
            if (quantity) this._quantity = quantity;
        }

        setId (id) {
            this._id = id;
        }

        getId () {
            return this._id ? this._id : Objects.Item.getIdByName(this._name);
        }

        getName () {
            return this._name;
        }

        getQuantity () {
            return this._quantity;
        }

        setQuantity (quantity) {
            this._quantity = quantity;
        }

        toString () {
            return this._name + '/' + this._id;
        }
    };

    var SpecialSkills = ['排云掌法', '九天龙吟剑法', '道种心魔经', '覆雨剑法', '如来神掌', '雪饮狂刀', '织冰剑法', '孔雀翎', '飞刀绝技', '翻云刀法', '万流归一', '幽影幻虚步', '生生造化功', '玄天杖法', '昊云破周斧', '燎原百破', '天火飞锤', '十怒绞龙索', '四海断潮斩', '九溪断月枪', '千影百伤棍', '辉月杖法', '玄胤天雷', '破军棍诀', '拈花解语鞭'];

    class BufferCalculator {
        constructor (skills) {
            if (!Array.isArray(skills)) skills = [skills];

            this._bufferRequired = skills.map(function (skill) {
                return SpecialSkills.includes(skill) ? 3 : 2;
            }).reduce(function (a, b) {
                return a + b;
            });
        }

        getBufferRequired () {
            return this._bufferRequired;
        }
    };

    var RecoveryHelper = {
        _retry: new Retry(300),
        _stopContinualRecovery: false,

        setSkill (skill) {
            if (!skill) skill = '道种心魔经';

            System.setVariant(System.keys.RECOVERY_SKILL, skill);
        },

        getSkill () {
            return System.getVariant(System.keys.RECOVERY_SKILL, '道种心魔经');
        },

        getThreshold () {
            return System.getVariant(System.keys.RECOVERY_THRESHOLD, 0.7);
        },

        setThreshold (threshold) {
            System.setVariant(System.keys.RECOVERY_THRESHOLD, threshold);
        },

        recoverBySkill () {
            let currentKee = System.globalObjectMap.get('msg_attrs').get('kee');
            let maxKee = System.globalObjectMap.get('msg_attrs').get('max_kee');
            if ((currentKee / maxKee) < RecoveryHelper.getThreshold()) {
                debugging('current kee/max kee=' + currentKee + '/' + maxKee);
                PerformHelper.perform(RecoveryHelper.getSkill());
            }
        },

        async initializeContinualRecover () {
            debugging('ContinualRecover initializing...');
            RecoveryHelper._stopContinualRecovery = false;

            await RecoveryHelper._retry.initialize(async function recover () {
                if (CombatStatus.inProgress()) return;

                if (User.attributes.getCurrentKee() < User.attributes.getMaxKee()) {
                    await ButtonManager.click('#3 recovery', 300);
                }

                if (User.attributes.getCurrentForce() < User.attributes.getMaxForce() * 0.9) {
                    await RecoveryHelper.recoverForce();
                }
            }, function stopWhen () {
                return RecoveryHelper._stopContinualRecovery;
            });
        },

        async startContinualRecovery () {
            await RecoveryHelper._retry.fire();
        },

        stopContinualRecovery () {
            RecoveryHelper._stopContinualRecovery = true;
        },

        async recoverForce () {
            let numberOf10k = Panels.Backpack.getQuantityByItemName('万年灵芝');
            debugging(`万年灵芝还剩 ${numberOf10k} 棵...`);

            if (!System.isLocalServer()) {
                let times = getForceGap() / 30000 + 1;
                if (numberOf10k >= times) {
                    await ButtonManager.click(`#${times} items use snow_wannianlingzhi`);
                } else {
                    await ButtonManager.click(`#${times * 6} items use snow_qiannianlingzhi`);
                }
            } else {
                let numberOf1k = Panels.Backpack.getQuantityByItemName('千年灵芝');
                debugging(`千年灵芝还剩 ${numberOf1k} 棵...`);

                let gap = getForceGap();
                if (gap > 30000) {
                    if (numberOf10k) {
                        await ButtonManager.click('items use snow_wannianlingzhi');
                    } else if (numberOf1k) {
                        await ButtonManager.click('items use snow_qiannianlingzhi');
                    } else {
                        debugging('没有足够的千/万年灵芝，停止服药。');
                    }
                } else if (gap > 2000) {
                    if (numberOf1k) {
                        await ButtonManager.click('items use snow_qiannianlingzhi');
                    } else {
                        debugging('没有足够的千年灵芝，停止服药。');
                    }
                } else {
                    debugging('内力已足，无需服用灵芝。');
                }

                debugging(`当前状态 ${System.globalObjectMap.get('msg_attrs').get('force')}/${System.globalObjectMap.get('msg_attrs').get('max_force')}`);
            }

            function getForceGap () {
                return System.globalObjectMap.get('msg_attrs').get('max_force') - System.globalObjectMap.get('msg_attrs').get('force');
            }
        }
    };

    var CombatHelper = {
        _autoPerforming: false,
        _autoRecovery: false,
        _defenceMode: false,

        isInUsed () {
            return CombatHelper._autoPerforming || CombatHelper._autoRecovery || CombatHelper._defenceMode;
        },

        check () {
            if (!CombatStatus.inProgress()) return;
            if (CombatHelper._autoRecovery) RecoveryHelper.recoverBySkill();
            if (CombatHelper._autoPerforming) PerformHelper.fire();
        },

        enableAutoPerforming () {
            CombatHelper._autoPerforming = true;
        },

        disableAutoPerforming () {
            CombatHelper._autoPerforming = false;
        },

        enableAutoRecovery () {
            CombatHelper._autoRecovery = true;
        },

        disableAutoRecovery () {
            CombatHelper._autoRecovery = false;
        }
    };

    var PerformHelper = {
        Skillset: {
            getSkills () {
                return System.getVariant(System.keys.ATTACK_SKILLS, ['如来神掌', '覆雨剑法']);
            },

            setSkills (skills = []) {
                System.setVariant(System.keys.ATTACK_SKILLS, skills);
            },

            getSkillsAbbr () {
                return PerformHelper.Skillset.getSkills().map(v => v.substr(0, 2)).join('');
            }
        },

        getBufferReserved () {
            return parseInt(System.getVariant(System.keys.ATTACK_SKILLS_BUFFER_RESERVED, 0));
        },

        setBufferReserved (bufferReserved) {
            System.setVariant(System.keys.ATTACK_SKILLS_BUFFER_RESERVED, bufferReserved);
        },

        readyToPerform (threshold) {
            return threshold <= Panels.Combat.getCurrentBuffer();
        },

        perform (skills) {
            if (!Array.isArray(skills)) skills = [skills];

            debugging('发出招式： ' + skills);
            let links = Panels.Combat.getSkillLinksV2(skills);
            if (links.length > 0) {
                ExecutionManager.execute(links);
            } else {
                let firstSkill = Panels.Combat.getAvailableAttackSkills()[0];
                if (firstSkill) PerformHelper.perform(firstSkill);
            }
        },

        fire () {
            let availableSkills = Panels.Combat.getAvailableSkills(PerformHelper.Skillset.getSkills());
            if (!availableSkills.length) return;

            let bufferRequired = new BufferCalculator(availableSkills).getBufferRequired() + PerformHelper.getBufferReserved();
            if (PerformHelper.readyToPerform(bufferRequired)) {
                PerformHelper.perform(availableSkills);
            }
        }
    };

    var CombatStatus = {
        justFinished () {
            return Panels.Combat.containsMessage('战斗结束');
        },

        inProgress () {
            return $('#combat_auto_fight').html();
        },

        notInBattle () {
            return !CombatStatus.inProgress();
        }
    };

    var GanodermasPurchaseHelper = {
        _cancelled: false,

        reset () {
            GanodermasPurchaseHelper._cancelled = false;
        },

        stop () {
            GanodermasPurchaseHelper._cancelled = true;
        },

        isCancelled () {
            return GanodermasPurchaseHelper._cancelled;
        },

        getThreshold () {
            return System.getVariant(System.keys.GANODERMAS_PURCHASE, '500/100');
        },

        setThreshold (threshold) {
            System.setVariant(System.keys.GANODERMAS_PURCHASE, threshold);
        },

        async purchase (targets = ['千年灵芝', '万年灵芝']) {
            let itemCode = ['/map/snow/obj/qiannianlingzhi_N_10', '/map/snow/obj/wannianlingzhi_N_10'];

            let quantityExpected = GanodermasPurchaseHelper.getThreshold().split('/').map(v => parseInt(v));
            let quantityCurrent = targets.map(v => Panels.Backpack.getQuantityByItemName(v));
            let messages = [];
            let quantityToBuy = [];
            let price = [1, 5];
            let cost = [];

            for (let i = 0; i < targets.length; i++) {
                let gap = quantityExpected[i] - quantityCurrent[i];
                if (gap <= 0) {
                    messages.push(`无需购买${targets[i]}：预期 ${quantityExpected[i]}，当前 ${quantityCurrent[i]}`);
                    quantityToBuy.push(0);
                } else {
                    messages.push(`需要购买${targets[i]} ${gap} 棵：预期 ${quantityExpected[i]}，当前 ${quantityCurrent[i]}`);
                    quantityToBuy.push(gap);
                    cost.push(gap * price[i]);
                }
            }

            if (!messages.some(v => v.includes('需要购买'))) {
                window.alert(`现在背包里已经有足够的药，不需要再购买。\n\n${messages.join('\n')}`);
            } else {
                if (!window.confirm(`本次需要购买如下药品，总计耗费大约银两 ${cost.reduce((a, b) => a + b)} 万，确定继续？\n\n${messages.filter(v => v.includes('需要购买')).join('\n')}`)) return;

                if (Objects.Room.getName() !== '桑邻药铺') {
                    await Navigation.move('jh 1;e;#3 n;w');
                }

                GanodermasPurchaseHelper.reset();
                for (let i = 0; i < targets.length; i++) {
                    if (quantityToBuy[i] === 0) continue;

                    let buyTimes = quantityToBuy[i] / 10;
                    for (let j = 0; j < buyTimes; j++) {
                        if (GanodermasPurchaseHelper.isCancelled()) break;

                        await ButtonManager.click(`buy ${itemCode[i]} from snow_herbalist`);
                    }
                }
            }
        }
    };

    var Panels = {
        Chatting: {
            filterMessageObjectsByKeyword: function (regKeyword) {
                return $('span .out3_auto').filter(function () { return $(this).text().match(regKeyword); });
            }
        },

        Notices: {
            filterMessageObjectsByKeyword (regKeyword) {
                return $('.out2').filter(function () { return $(this).text().match(regKeyword); });
            },

            containsMessage (regKeyword) {
                return Panels.Notices.filterMessageObjectsByKeyword(regKeyword).length > 0;
            },

            getLastMessage () {
                return $('.out2').last().text();
            },

            getLatestMessages (numberOfRows = 1) {
                let messages = [];
                $('.out2').slice(-numberOfRows).each(function () {
                    messages.push($(this).text());
                });

                return messages.reverse();
            },

            getMessages (regKeyword, numberOfRows = 1) {
                let messages = [];
                $('.out2').filter(function () {
                    return $(this).text().match(regKeyword);
                }).slice(-numberOfRows).each(function () {
                    messages.push($(this).text());
                });

                return messages.reverse();
            },

            getLatestDragonLink () {
                return $('.out2').filter(function () { return $(this).text().match('^青龙会组织：'); }).last().html().match("(find_qinglong_road.*?)'")[1];
            }
        },

        Score: {
            action (action) {
                $('button.cmd_click2').filter(function () {
                    return $(this).text() === action;
                }).click();
            },

            filterButtonObjectsByKeyword (regKeyword) {
                return $('button.cmd_click2').filter(function () {
                    return $(this).text().match(regKeyword);
                });
            }
        },

        Combat: {
            containsMessage (regKeyword) {
                return $('.out').filter(function () { return $(this).text().match(regKeyword); }).length > 0;
            },

            getSkillLinksV2 (skills) {
                if (!Array.isArray(skills)) skills = [skills];

                return System.globalObjectMap.elements
                    .filter(v => v['key'].includes('skill_button'))
                    .filter(v => skills.includes(System.ansiToText(v['value'].get('name'))))
                    .map(v => 'clickButton("playskill ' + v['value'].get('pos') + '", 0)');
            },

            getSkillLinks (skills) {
                let links = [];
                $('.cmd_skill_button').filter(function () {
                    return skills.includes($(this).text());
                }).each(function () {
                    links.push($(this).attr('onclick'));
                });
                return links;
            },

            getAvailableSkills (skills = []) {
                let allAvailableSkills = System.globalObjectMap.elements.filter(v => v['key'].includes('skill_button')).map(v => System.ansiToText(v['value'].get('name')));
                if (skills.length > 0) {
                    return allAvailableSkills.filter(v => skills.includes(v));
                } else {
                    return allAvailableSkills;
                }
            },

            getAvailableAttackSkills () {
                let skillsAvailable = Panels.Combat.getAvailableSkills();
                return User.skills.getSkillsEnabled('attack').filter(v => skillsAvailable.includes(v));
            },

            getCurrentBuffer () {
                return parseInt($('#combat_xdz_text').text());
            },

            getCombatInfo () {
                let result = [];
                for (let i = 1; i <= 2; i++) {
                    for (let j = 1; j <= 4; j++) {
                        let vsInfo = System.globalObjectMap.get('msg_vs_info');
                        if (!vsInfo) continue;

                        result.push(vsInfo.get(`vs${i}_name${j}`));
                    }
                    i === 1 && result.push(' vs. ');
                }
                return result.join(' ').replace(/[ ]{2,3}/g, ' ');
            }
        },

        Backpack: {
            getItems (type = 'items') {
                return System.globalObjectMap.get('msg_items').elements.filter(v => v['key'].includes(type)).map(function (v) {
                    let values = v['value'].split(',');
                    let item = new Item(System.ansiToText(values[1]), values[0], parseInt(values[2]));
                    return item;
                });
            },

            getItemsByName (name) {
                return Panels.Backpack.getItems().filter(v => v.getName() === name);
            },

            getQuantityByName (name = '') {
                let records = System.globalObjectMap.get('msg_items').elements.filter(v => System.replaceControlCharBlank(v['value']).includes(`,${name},`));
                if (records.length === 0) return 0;

                return parseInt(records[0]['value'].split(',')[2]);
            },

            getQuantityByItemName (name = '', inStore = false) {
                let records = System.globalObjectMap.get('msg_items').elements.filter(function (v) {
                    if (!inStore && !v['key'].startsWith('items')) return false;

                    let props = Array.isArray(v['value']) ? v['value'].join(',') : v['value'];
                    return System.ansiToText(props).includes(`,${name},`);
                }).map(function (k) {
                    let props = Array.isArray(k['value']) ? k['value'].join(',') : k['value'];
                    return System.ansiToText(props).split(',')[2];
                });

                debugging('records', records);
                if (records.length === 0) return 0;

                return parseInt(records[0]);
            }
        }
    };

    var Objects = {
        Room: {
            async refresh () {
                await ButtonManager.click('golook_room');
            },

            filterTargetObjectsByKeyword (regKeyword) {
                return $('.cmd_click3').filter(function () { return $(this).text().match(regKeyword); });
            },

            getTargetDomByName (name) {
                return $('.cmd_click3').filter(function () { return !name || $(this).text() === name; });
            },

            getNpcDomById (id) {
                return $('.cmd_click3').filter(function () { return $(this).attr('onclick').match('look_npc ' + id); });
            },

            hasNpc (name) {
                return Objects.Room.getTargetDomByName(name).length > 0;
            },

            getName () {
                if (System.globalObjectMap.get('msg_room')) return System.ansiToText(System.globalObjectMap.get('msg_room').get('short'));

                return System.ansiToText(System.globalObjectMap.get('msg_attrs').get('room_name'));
            },

            getType () {
                return System.globalObjectMap.get('msg_room').get('type');
            },

            getAvailableNpcs (name = '', regMatch = false) {
                let npcs = [];
                Objects.Room.getTargetDomByName().each(function () {
                    if (name && !regMatch && name !== $(this).text()) return;
                    if (name && regMatch && !name.includes($(this).text())) return;

                    let matches = $(this).attr('onclick').match('look_npc (.*?)\'');
                    if (matches) {
                        let npc = new Npc($(this).text());
                        npc.setId(matches[1]);
                        npcs.push(npc);
                        debugging('发现 ' + npc.toString());
                    }
                });

                return npcs;
            },

            getPlayers () {
                return System.globalObjectMap.get('msg_room').elements.filter(v => v['key'].includes('user')).map(v => System.ansiToText(v['value'].split(',')[1]));
            },

            getEventByName (eventName) {
                return $('button').filter(function () { return !eventName || $(this).text() === eventName; }).attr('onclick');
            },

            getEventByNameReg (regEventName) {
                return $('button').filter(function () { return !regEventName || $(this).text().match(regEventName); }).attr('onclick');
            },

            getMapId () {
                return System.globalObjectMap.get('msg_room').get('map_id');
            },

            getNpcIdsByName (name) {
                return System.globalObjectMap.get('msg_room').elements.filter(function (v) {
                    return v['key'].includes('npc') && name === System.ansiToText(v['value'].split(',')[1]);
                }).map(function (v) {
                    return v['value'].split(',')[0];
                });
            }
        },

        Npc: {
            async hasAction (npc, action) {
                await ButtonManager.click(`look_npc ${npc.getId()}`);
                return Objects.Npc.getActionLink(action);
            },

            getActionLink (action) {
                return $('.cmd_click2').filter(function () { return $(this).text() === action; }).attr('onclick');
            },

            async action (npc, action, times = 1) {
                switch (action) {
                    case '比试':
                        ButtonManager.click('fight ' + npc.getId());
                        break;
                    case '杀死':
                        ButtonManager.click('kill ' + npc.getId());
                        break;
                    case '观战':
                        await ButtonManager.click('watch_vs ' + npc.getId());
                        break;
                    case '销毁生死簿（银两）':
                        await ExecutionManager.asyncExecute(Objects.Room.getNpcDomById(npc.getId()).attr('onclick'), 1000);
                        for (let i = 0; i < times; i++) {
                            await ExecutionManager.asyncExecute(Objects.Npc.getActionLink('销毁生死簿（银两）'), 200);
                            await ExecutionManager.asyncExecute(Objects.Npc.getActionLink('确定'), 200);
                        }

                        break;
                    default:
                        await ExecutionManager.asyncExecute(Objects.Room.getNpcDomById(npc.getId()).attr('onclick'), 1000);
                        let actionLink = Objects.Npc.getActionLink(action);
                        for (let i = 0; i < times; i++) {
                            await ExecutionManager.asyncExecute(actionLink, 200);
                        }
                }
            },

            getIdByName (name) {
                let find = Objects.Room.getTargetDomByName(name).last();
                if (find.length > 0) {
                    return find.attr('onclick').match(".*?look_npc (.*?)'")[1];
                }
            }
        },

        Item: {
            getActionLink (action) {
                return $('.cmd_click2').filter(function () { return $(this).text() === action; }).attr('onclick');
            },

            async action (item, action, times = 1) {
                debugging(action + ' ' + item.getName() + ', times=' + times);

                await ExecutionManager.asyncExecute(Objects.Room.getTargetDomByName(item.getName()).attr('onclick'), 800);
                let actionLink = Objects.Item.getActionLink(action);
                for (let i = 0; i < times; i++) {
                    await ExecutionManager.asyncExecute(actionLink, 100);
                }

                return actionLink;
            },

            getIdByName (name) {
                let find = Objects.Room.getTargetDomByName(name).last();
                if (find.length > 0) {
                    return find.attr('onclick').match(".*?look_item (.*?)'")[1];
                }
            }
        }
    };

    var ClanCombatHelper = {
        battlefields: ['至尊殿', '翰海楼', '八荒谷', '九州城', '怒蛟泽', '凌云峰', '江左营', '虎啸林', '青云山', '论剑堂'],

        async back () {
            if (Objects.Room.getMapId() && Objects.Room.getMapId() !== 'kuafu') await Navigation.move('home');
            if (/^[天地玄黄龙]阁$/.test(Objects.Room.getName())) await Navigation.move(Objects.Room.getEventByNameReg('[^阁]'));
            if (this.battlefields.includes(Objects.Room.getName())) await Navigation.move('n');

            let currentX = parseInt(Objects.Room.getName().match(/武林广场(.*)/)[1]) - 1;
            let target = this.getBattlePlace().split('-');
            let targetX = this.battlefields.indexOf(target[0]);
            if (currentX !== targetX) {
                await Navigation.move(currentX < targetX ? `#${targetX - currentX} e` : `#${currentX - targetX} w`);
            }

            await Navigation.move('s');
            await ExecutionManager.asyncExecute(Objects.Room.getEventByName(target[1]));
        },

        setBattlePlace (battlePlace) {
            System.setVariant(System.keys.CLAN_BATTLE_PLACE, battlePlace);
        },

        getBattlePlace () {
            return System.getVariant(System.keys.CLAN_BATTLE_PLACE);
        }
    };

    class ButtonLabel {
        constructor (text, title, color = '') {
            this._text = text;
            this._color = color;
            this._title = title;
        }

        getText () {
            return this._text;
        }

        getTitle () {
            return this._title;
        }

        getColor () {
            return this._color;
        }
    }

    var ButtonManager = {
        async click (actionString, delay = 200) {
            let array = actionString.includes('#') ? actionString.split(';').extract() : actionString.split(';');

            for (let i = 0; i < array.length; i++) {
                await ExecutionManager.asyncExecute("clickButton('" + array[i] + "')", delay);
            }
        },

        simpleToggleButtonEvent (button, toggleLabel = '') {
            let isPressEvent = false;

            if (button.innerText !== button.name) {
                button.innerText = button.name;
                button.style.color = '';
            } else {
                isPressEvent = true;
                button.innerText = toggleLabel || 'x ' + button.name;
                button.style.color = 'red';
            }

            return isPressEvent;
        },

        toggleButtonEvent (button, defaultLabel, toggleLabel) {
            let isPressEvent = false;

            if (button.innerText === defaultLabel.getText()) {
                debugging('switching to toggle mode');
                isPressEvent = true;
                button.innerText = toggleLabel.getText();
                button.style.color = toggleLabel.getColor();
            } else {
                debugging('revert from toggle mode');
                button.innerText = defaultLabel.getText();
                button.style.color = defaultLabel.getColor();
            }

            return isPressEvent;
        },

        resetButtonById (buttonId) {
            let button = buttonId.includes('#') ? $(buttonId) : $('#' + buttonId);
            if (button.css('color') !== 'rgb(0, 0, 0)') button.click();
        },

        isButtonPressed (buttonId) {
            let button = buttonId.includes('#') ? $(buttonId) : $('#' + buttonId);
            return button.text().includes('x');
        },

        pressDown (buttonId) {
            let button = buttonId.includes('#') ? $(buttonId) : $('#' + buttonId);
            if (button.css('color') === 'rgb(0, 0, 0)') button.click();

            System.saveCurrentButtonStatus();
        }
    };

    var RemoteServerHelper = {
        async switch2RemoteServer () {
            InterceptorRegistry.register(new Interceptor('跨服结果检测', RemoteServerHelper.remoteFailed, RemoteServerHelper.tryTranditionalRemote, 'notice', 'notify_fail'));
            System.switchToRemoteServer();

            await ExecutionManager.wait(10000);
            InterceptorRegistry.unregister('跨服结果检测');
        },

        switchBack2LocalServer () {
            System.switchToLocalServer();
        },

        async tryTranditionalRemote () {
            await ExecutionManager.wait(1500);

            if (Objects.Room.getName() !== '雪亭驿') await Navigation.move('jh 1;e;#4 n;w');

            await ButtonManager.click('event_1_36344468');
        },

        remoteFailed (message) {
            return message.get('msg').includes('请重新登录跨服');
        }
    };

    var MessageLogger = {
        isMessageInLoggingRejectedList (messagePack) {
            if (!System.getDebugMessageBlacklist()) return false;

            return System.getDebugMessageBlacklist().split(',').some(function (v) {
                if (!v.includes('|')) {
                    return messagePack.get('type') === v;
                } else {
                    let keywords = v.split('|');
                    return messagePack.get('type') === keywords[0] && messagePack.get('subtype') === keywords[1];
                }
            });
        },

        log (message) {
            if (MessageLogger.isMessageInLoggingRejectedList(message)) return;

            debugging(`msg: ${message.get('type')} | ${message.get('subtype')} | ${message.get('msg')}`, message.elements);
        }
    };

    var ExecutionManager = {
        execute (commands) {
            if (!Array.isArray(commands)) commands = [commands];

            debugging('executing ' + commands);
            for (let i = 0; i < commands.length; i++) eval(commands[i]);
        },

        async asyncExecute (commands, delay = 200) {
            if (!Array.isArray(commands)) commands = [commands];

            for (let i = 0; i < commands.length; i++) {
                debugging('async executing ' + commands[i]);

                await eval(commands[i]);
                if (delay > 0) await ExecutionManager.wait(Math.floor(Math.random() * 50 + delay));
            }
        },

        async wait (timeout) {
            return new Promise((resolve, reject) => { setTimeout(function () { resolve(); }, timeout); });
        }
    };

    var Navigation = {
        async move (path) {
            let steps = path.split(';').extract();

            for (let i = 0; i < steps.length; i++) {
                if (steps[i] === 'home' && Objects.Room.getMapId() === 'kuafu') {
                    debugging('忽略回家命令：当前已经位于跨服武林广场，再执行回家命令就回到本服啦。');
                    continue;
                } else if (steps[i].includes('#wait ')) {
                    await ExecutionManager.wait(parseInt(steps[i].split(' ')[1]));
                } else {
                    switch (steps[i][0]) {
                        case '~':
                            await ExecutionManager.asyncExecute(Objects.Room.getEventByName(steps[i].substr(1)));
                            break;
                        case '@':
                            await eval(steps[i].substr(1));
                            break;
                        default:
                            if (steps[i].startsWith('clickButton(')) {
                                try {
                                    await ExecutionManager.asyncExecute(steps[i]);
                                } catch (err) {
                                    debugging('err', err);
                                }
                            } else {
                                await ExecutionManager.asyncExecute("clickButton('" + steps[i] + "')");
                            }
                    }
                }
            }
        }
    };

    function log (message, obj, func = null) {
        if (func || obj) {
            func ? console.info(message, obj, func()) : console.info(message, obj);
        } else {
            console.info(message);
        }
    }

    function debugging (message = '', obj, func = null) {
        if (!System.debugMode) return;

        if (func || obj) {
            func ? console.debug('[Debug]', message, obj, func()) : console.debug('[Debug]', message, obj);
        } else {
            console.debug('[Debug]', message);
        }
    }

    Array.prototype.extract = function () {
        let result = [];

        for (let i = 0; i < this.length; i++) {
            if (this[i].charAt(0) === '#' && this[i].charAt(1) !== 'w') {
                let r = this[i].match('#(.*?) (.*)');
                let repeatTimes = parseInt(r[1]);
                for (let j = 0; j < repeatTimes; j++) {
                    result.push(r[2]);
                }
            } else {
                result.push(this[i]);
            }
        }

        return result;
    };

    var ClanBattleMonitor = {
        turnOn () {
            InterceptorRegistry.register(new Interceptor());
        },

        turnOff () {
            InterceptorRegistry.unregister('');
        }
    };

    JobRegistry.register('id-combat-helper', 200, CombatHelper.check);

    var helperConfigurations = [{
        subject: '帮战相关',

        buttons: [{
            label: '一键跨服',
            title: '自动寻路到杜宽处，进入跨服...',
            id: 'id-goto-another-world-stateless',

            async eventOnClick () {
                if (ButtonManager.simpleToggleButtonEvent(this)) {
                    await RemoteServerHelper.switch2RemoteServer();
                } else {
                    await RemoteServerHelper.switchBack2LocalServer();
                }
            }
        }, {
        }, {
            label: '回战场',
            title: '帮战挂了自动一键由跨服任意处回到战场...',
            id: 'id-gan-fight-back',
            width: '60px',
            marginRight: '1px',

            async eventOnClick () {
                if (System.isLocalServer()) {
                    window.alert('跨服专用功能，本服不适用。');
                    return;
                }

                if (!ClanCombatHelper.getBattlePlace()) {
                    $('#id-gan-fight-back-setting').click();
                } else {
                    await ClanCombatHelper.back();
                }
            }
        }, {
            label: '.',
            title: '设置帮战挂了回战场的目标地点...',
            id: 'id-gan-fight-back-setting',
            width: '10px',

            async eventOnClick () {
                let answer = window.prompt('帮战地点是哪里？可以参照以下格式设置...\n\n例子：怒蛟泽-玄阁', ClanCombatHelper.getBattlePlace());
                if (answer) {
                    if (answer.split('-').length !== 2) {
                        window.alert('必须按 怒蛟泽-玄阁 这样的格式，否则无法识别。');
                    } else {
                        ClanCombatHelper.setBattlePlace(answer);
                    }
                }
            }
        }, {
            label: '设定',
            title: '设定帮战自动化细节...',
            id: 'id-gan-fight-setting',

            eventOnClick () {
            }
        }, {
            label: '攻',
            title: '打开此开关则玩家回到帮战战场后自动开始尝试作为攻打方重新加入战斗...',
            id: 'id-gan-fight-attack',
            width: '38px',
            marginRight: '1px',

            eventOnClick () {
                if (ButtonManager.simpleToggleButtonEvent(this)) {
                    ButtonManager.resetButtonById('id-gan-fight-defend');
                    ClanBattleMonitor.turnOn();
                } else {
                    ClanBattleMonitor.turnOff();
                }
            }
        }, {
            label: '守',
            title: '打开此开关则玩家回到帮战战场后自动开始尝试作为防守方重新加入战斗...',
            id: 'id-gan-fight-defend',
            width: '38px',

            eventOnClick () {
                if (ButtonManager.simpleToggleButtonEvent(this)) {
                    ButtonManager.resetButtonById('id-gan-fight-attack');
                } else {
                }
            }
        }, {
        }, {
            label: PerformHelper.Skillset.getSkillsAbbr(),
            id: 'id-auto-perform',
            width: '64px',
            marginRight: '1px',
            title: '自动攒气出招, 预留 ' + PerformHelper.getBufferReserved() + ' 气\n\n注意：\n1. 必刷技能设置多于四个时可能连招失败\n2. 只匹配到一个招数名字时，按单招触发',

            async eventOnClick () {
                let defaultText = PerformHelper.Skillset.getSkillsAbbr();
                let defaultLabel = new ButtonLabel(defaultText);
                let toggleLabel = new ButtonLabel('x ' + defaultText, '', 'red');

                if (ButtonManager.toggleButtonEvent(this, defaultLabel, toggleLabel)) {
                    if (!CombatHelper.isInUsed()) JobRegistry.getJob('id-combat-helper').start();

                    CombatHelper.enableAutoPerforming();

                    $(this).text($(this).text().substr(0, 5));
                } else {
                    CombatHelper.disableAutoPerforming();

                    if (!CombatHelper.isInUsed()) JobRegistry.getJob('id-combat-helper').stop();
                }
            }
        }, {
            label: '.',
            title: '设置战斗中出的招数，用半角+可以设置连招...',
            width: '10px',
            id: 'id-auto-perform-setting',

            async eventOnClick () {
                let answer = window.prompt('请按格式确认要出的招数和预留的气数，例如：九天龙吟剑法+排云掌法,2 表示 8 气的时候连出九天排云。', PerformHelper.Skillset.getSkills().join('+') + ',' + PerformHelper.getBufferReserved());
                if (!answer) return;

                let matches = answer.match('(.*?),(.*)');
                if (!matches) {
                    window.alert('设置格式不正确，请按提示重新设置。');
                    return;
                }

                PerformHelper.Skillset.setSkills(matches[1].split('+'));
                PerformHelper.setBufferReserved(parseInt(matches[2]));

                let text = PerformHelper.Skillset.getSkillsAbbr();
                if ($('#id-auto-perform').text().includes('x')) text = 'x ' + text.substr(0, 3);

                $('#id-auto-perform').text(text);
                $('#id-auto-perform').attr('title', '自动攒气出招, 预留 ' + PerformHelper.getBufferReserved() + ' 气\n\n注意：\n1. 必刷技能设置多于四个时可能连招失败\n2. 只匹配到一个招数名字时，按单招触发');
            }
        }, {
            label: RecoveryHelper.getSkill().substr(0, 2) + ' ' + RecoveryHelper.getThreshold(),
            id: 'id-auto-recovery',
            title: '血量低于 ' + (RecoveryHelper.getThreshold() * 100) + '%' + ' 时自动内功回血，当前内功设定为 ' + RecoveryHelper.getSkill(),
            width: '64px',
            marginRight: '1px',

            async eventOnClick () {
                let defaultText = RecoveryHelper.getSkill().substr(0, 2) + ' ' + RecoveryHelper.getThreshold();
                let defaultLabel = new ButtonLabel(defaultText);
                let toggleLabel = new ButtonLabel('x ' + RecoveryHelper.getSkill().substr(0, 2), '', 'red');

                if (ButtonManager.toggleButtonEvent(this, defaultLabel, toggleLabel)) {
                    if (!CombatHelper.isInUsed()) JobRegistry.getJob('id-combat-helper').start();

                    CombatHelper.enableAutoRecovery();
                } else {
                    CombatHelper.disableAutoRecovery();

                    if (!CombatHelper.isInUsed()) JobRegistry.getJob('id-combat-helper').stop();
                }
            }
        }, {
            label: '.',
            title: '设置战斗中用于回血的内功，以及多少百分比的血量触发回血',
            width: '10px',
            id: 'id-auto-recovery-setting',

            async eventOnClick () {
                if (!RecoveryHelper.getSkill()) {
                    await RecoveryHelper.prepare();
                }

                let answer = window.prompt('请按格式确认用于回血的内功名字以及触发回血动作的血量百分比：\n\n例子（道心，一半血量回血）：道心种魔心经/0.5', RecoveryHelper.getSkill() + '/' + RecoveryHelper.getThreshold());
                if (!answer) return;
                RecoveryHelper.setSkill(answer.split('/')[0]);
                RecoveryHelper.setThreshold(answer.split('/')[1]);

                let percentage = parseInt(RecoveryHelper.getThreshold() * 100) + '%';
                $('#id-auto-recovery').text(RecoveryHelper.getSkill().substr(0, 2) + ' ' + RecoveryHelper.getThreshold());
                $('#id-auto-recovery').attr('title', '血量低于 ' + percentage + ' 时自动内功回血，当前内功设定为 ' + RecoveryHelper.getSkill());
            }
        }, {
            label: '自动吃药',
            title: '战斗完毕自动吸气疗伤，且千/万年灵芝补蓝...\n\n注意：\n1. 自动吸气到满血停止\n2. 内力缺口超过 3 万则优先使用万年灵芝\n3. 如在本服，脚本继续使用适量千年灵芝补充到离内力最大值不到 2000；跨服则继续使用万年灵芝\n4. 按下即可保持自动补血补内状态',
            id: 'id-recover-hp-mp',

            async eventOnClick () {
                if (ButtonManager.simpleToggleButtonEvent(this)) {
                    await ButtonManager.click('items;prev');
                    await RecoveryHelper.initializeContinualRecover();
                    await RecoveryHelper.startContinualRecovery();
                } else {
                    RecoveryHelper.stopContinualRecovery();
                }
            }
        }, {
        }, {
            label: '买灵芝',
            title: '点击一次则自动买到足够数目（可设定）...\n\n注意：\n1. 不能现场购买，只能回到雪亭镇药铺买，且购买结束无法自动返回当前所在地\n2. 中途可手工停止\n3. 为简化逻辑，只整十购买。',
            id: 'id-buy-ganodermas',
            width: '60px',
            marginRight: '1px',

            async eventOnClick () {
                if (ButtonManager.simpleToggleButtonEvent(this)) {
                    await ButtonManager.click('items;prev');
                    await GanodermasPurchaseHelper.purchase();

                    ButtonManager.resetButtonById(this.id);
                } else {
                    GanodermasPurchaseHelper.stop();
                }
            }
        }, {
            label: '.',
            title: '设置购买千/万年灵芝到多少棵为止...',
            id: 'id-buy-ganodermas-setting',
            width: '10px',

            async eventOnClick () {
                let answer = window.prompt('请按格式输入购买结束后背包里的千年灵芝和万年灵芝的预期数值，用半角斜线分开。例如：500/50', GanodermasPurchaseHelper.getThreshold());
                if (answer) {
                    GanodermasPurchaseHelper.setThreshold(answer);
                }
            }
        }, {
        }, {
            label: '调试',
            title: '当调试模式开启，浏览器控制台会输出更详细的日志，方便追踪问题。',
            id: 'id-debugging',
            width: '60px',
            marginRight: '1px',

            eventOnClick () {
                System.debugMode = ButtonManager.simpleToggleButtonEvent(this);
            }
        }, {
            label: '.',
            title: '设置系统消息屏蔽，目前只支持 type|subtype 级别。当前设定为 ' + System.getDebugMessageBlacklist(),
            width: '10px',
            id: 'id-debugging-setting',

            async eventOnClick () {
                let answer = window.prompt('请输入 type|subtype 组合，以半角逗号隔开。比如 channel|rumor,attrs_change', System.getDebugMessageBlacklist());
                if (answer || answer === '') {
                    System.setDebugMessageBlacklist(answer);
                }
            }
        }, {
            label: '当前监听',
            title: '日志输出当前监听器信息以供调试...',

            async eventOnClick () {
                log('当前监听', InterceptorRegistry.getInterceptors());
            }
        }]
    }];

    class ButtonGroup {
        constructor (subject, buttons, offset) {
            this._subject = subject;
            this._buttons = buttons;
            this._offset = offset;
        }

        getSubject () {
            return this._subject;
        }

        getButtons () {
            return this._buttons;
        }

        getOffset () {
            return this._offset ? this._offset : 0;
        }
    }

    class ElementStyle {
        constructor (width, height, top, right, marginBottom, position, textAlign, background, backgroundColor, color, marginRight) {
            this._width = width;
            this._height = height;
            this._top = top;
            this._right = right;

            this._position = position;
            this._textAlign = textAlign;
            this._background = background;
            this._backgroundColor = backgroundColor;
            this._marginBottom = marginBottom;
            this._color = color;
            this._marginRight = marginRight;
        }

        getHeight () {
            return this._height;
        }

        getWidth () {
            return this._width;
        }

        getMarginBottom () {
            return this._marginBottom;
        }

        getMarginRight () {
            return this._marginRight;
        }

        getPosition () {
            return this._position;
        }

        getTextAlign () {
            return this._textAlign;
        }

        getBackground () {
            return this._background;
        }

        getColor () {
            return this._color;
        }

        getBackgroundColor () {
            return this._backgroundColor;
        }

        getRight () {
            return this._right;
        }

        getTop () {
            return this._top;
        }
    }

    class Button {
        constructor (conf) {
            this._id = conf.id;
            this._title = conf.title;
            this._eventOnClick = conf.eventOnClick;
            this._label = conf.label;
            this._style = new ElementStyle(conf.width, '', '', '', conf.marginBottom, '', '', '', conf.backgroundColor, conf.color, conf.marginRight);
            this._hidden = conf.hidden;
        }

        createHtmlElement (div) {
            if (this._hidden) return;

            this._element = document.createElement('button');
            div.appendChild(this._element);

            if (this._label) {
                this._element.innerText = this._label;
                this._element.name = this._element.innerText;
                this._element.style.fontSize = 'xx-small';
                this._element.addEventListener('click', this._eventOnClick);
                if (this._id) this._element.id = this._id;
                if (this._title) this._element.title = this._title;
                if (this._style.getColor()) this._element.style.color = this._style.getColor();
                if (this._style.getBackgroundColor()) this._element.style.backgroundColor = this._style.getBackgroundColor();
                if (this._style.getWidth()) this._element.style.width = this._style.getWidth();
            } else {
                this._element.style.border = 'none';
                this._element.style.background = 'rgba(0,0,0,0)';
                this._element.disabled = true;
            }

            this.refreshStyle();
        }

        refreshStyle () {
            this._element.style.width = this._style.getWidth();
            this._element.style.height = this._style.getHeight();
            this._element.style.marginBottom = this._style.getMarginBottom();
            this._element.style.marginRight = this._style.getMarginRight();
        }

        getId () {
            return this._id;
        }

        getTitle () {
            return this._title;
        }

        getLabel () {
            return this._label;
        }

        getEventOnClick () {
            return this._eventOnClick;
        }

        setStyle (style) {
            this._style = style;
        }

        getStyle () {
            return this._style;
        }
    }

    var HelperUiManager = {
        _groups: [],

        loadConfigurations (groupConfs) {
            for (let i = 0; i < groupConfs.length; i++) {
                HelperUiManager._groups.push(new ButtonGroup(groupConfs[i].subject, buildButtons(groupConfs[i].buttons), groupConfs[i].offset));
            }

            function buildButtons (buttonConfs) {
                let buttons = [];
                for (let i = 0; i < buttonConfs.length; i++) {
                    buttons.push(new Button(buttonConfs[i]));
                }
                return buttons;
            };
        },

        getGroups (subjects = []) {
            return HelperUiManager._groups.filter(v => !subjects.length || subjects.includes(v.getSubject()));
        },

        setDefaultStyles (subjects = []) {
            let groups = HelperUiManager.getGroups(subjects);
            for (let i = 0; i < groups.length; i++) {
                let buttons = groups[i].getButtons();
                for (let j = 0; j < buttons.length; j++) {
                    let width = buttons[j].getStyle().getWidth() ? buttons[j].getStyle().getWidth() : '75px';
                    let marginRight = buttons[j].getStyle().getMarginRight() ? buttons[j].getStyle().getMarginRight() : '';
                    let backgroundColor = buttons[j].getStyle().getBackgroundColor() ? buttons[j].getStyle().getBackgroundColor() : '';

                    buttons[j].setStyle(new ElementStyle(width, '22px', '', '', '1px', '', '', '', backgroundColor, '', marginRight));
                }
            }
        },

        drawFunctionalGroups (subjects = []) {
            HelperUiManager.setDefaultStyles();

            let groups = HelperUiManager.getGroups(subjects);
            let right = 0;
            for (let i = 0; i < groups.length; i++) {
                right = right + groups[i].getOffset();
                drawGroupButtons(drawGroupPanel(groups[i].getSubject(), right), groups[i]);
                right = right + 77;
            }

            function drawGroupButtons (div, group) {
                for (let j = 0; j < group.getButtons().length; j++) {
                    group.getButtons()[j].createHtmlElement(div);
                }
            }

            function drawGroupPanel (subject, right) {
                let div = HelperUiManager.drawDiv(subject, new ElementStyle('90px', '', '22px', right + 'px', '', 'absolute', 'center', 'rgba(0, 0, 0, 0)', ''));

                let label = document.createElement('label');
                label.style.fontSize = '8pt';
                label.style.marginBottom = '5px';
                label.style.display = 'inline-block';
                label.textContent = subject;
                div.appendChild(label);

                return div;
            }
        },

        drawMasterSwitch () {
            let button = document.createElement('button');
            button.style.width = '30px';
            button.style.height = '20px';
            button.style.position = 'absolute';
            button.style.top = '0px';
            button.style.right = '0px';
            button.name = button.innerHTML = button.value = '>>';

            button.addEventListener('click', function () {
                ButtonManager.simpleToggleButtonEvent(this, '<<');
                $('#generic-control-panel').fadeToggle('fast');
            });
            document.body.appendChild(button);
        },

        drawDiv (id, style) {
            let div = document.createElement('div');

            div.id = id;
            if (style.getTop()) div.style.top = style.getTop();
            if (style.getHeight()) div.style.height = style.getHeight();
            if (style.getRight()) div.style.right = style.getRight();
            if (style.getPosition()) div.style.position = style.getPosition();
            if (style.getTextAlign()) div.style.textAlign = style.getTextAlign();
            if (style.getBackground()) div.style.background = style.getBackground();
            if (style.getBackgroundColor()) div.style.backgroundColor = style.getBackgroundColor();
            if (style.getMarginBottom()) div.style.marginBottom = style.getMarginBottom();
            if (style.getWidth()) div.style.width = style.getWidth();

            document.body.appendChild(div);
            return div;
        },

        refreshDivs () {
            let subjects = HelperUiManager.getGroups().map(v => v.getSubject());
            let offsets = HelperUiManager.getGroups().map(v => v.getOffset());
            let right = 0;
            for (let i = 0; i < subjects.length; i++) {
                $('div').filter(function () {
                    return subjects[i] === $(this).attr('id') && !$(this).attr('hidden');
                }).each(function () {
                    right = right + offsets[i];
                    $(this).css('right', right);
                    right = right + 77;
                });
            }
        },

        drawControlCheckboxes () {
            let div = HelperUiManager.drawDiv('generic-control-panel', new ElementStyle('', '20px', '0px', '50px', '', 'absolute', 'right', 'white', ''));
            let subjects = HelperUiManager.getGroups().map(v => v.getSubject()).reverse();

            addCheckBox(div, '全选', '全选所有分组', function () {
                $('#generic-control-panel').find('input[type=checkbox]').filter(function () { return $(this).attr('id') !== '全选'; }).prop('checked', this.checked);
                $('div').filter(function () { return subjects.includes($(this).attr('id')); }).prop('hidden', !this.checked);
                HelperUiManager.refreshDivs();
            });

            subjects.forEach(function (subject) {
                addCheckBox(div, subject, '显示/隐藏 ' + subject + ' 对应的按钮组', function () {
                    $('div').filter(function () { return $(this).attr('id') === subject; }).prop('hidden', !this.checked);
                    refreshAllCheckedStatus(this.checked);
                    HelperUiManager.refreshDivs();
                });
            });

            function refreshAllCheckedStatus (checked) {
                if (!checked) {
                    $('#全选').prop('checked', false);
                } else {
                    let allChecked = $('#generic-control-panel').find('input[type=checkbox]').filter(function () {
                        return !$(this).prop('checked');
                    }).length === 1;

                    if (allChecked) $('#全选').prop('checked', true);
                }
            }

            function addCheckBox (div, label, title, eventOnChange) {
                let checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = checkbox.id = label;
                checkbox.title = title;
                checkbox.style.float = 'left';
                checkbox.checked = true;
                checkbox.addEventListener('change', eventOnChange);

                div.insertBefore(checkbox, null);

                let checkboxLabel = document.createElement('label');
                checkboxLabel.textContent = label;
                checkboxLabel.style.float = 'left';
                checkboxLabel.style.fontSize = '9pt';
                checkboxLabel.style.marginRight = '5px';

                div.insertBefore(checkboxLabel, null);
            }
        }
    };

    User.initialize();

    function initializeHelpButtons (conf) {
        HelperUiManager.loadConfigurations(conf);
        HelperUiManager.drawFunctionalGroups();
        HelperUiManager.drawControlCheckboxes();
        HelperUiManager.drawMasterSwitch();
    }

    initializeHelpButtons(helperConfigurations);

    window.unsafeWindow.webSocketMsg.prototype.primaryDispatchMessage = window.unsafeWindow.gSocketMsg.dispatchMessage;
    window.unsafeWindow.gSocketMsg.dispatchMessage = function (message) {
        this.primaryDispatchMessage(message);

        MessageLogger.log(message);

        InterceptorRegistry.getInterceptors(message.get('type'), message.get('subtype')).some(v => v.handle(message));
    };

    System.resetTitle();

    log('帮战脚本加载完毕。');
}, 1000);

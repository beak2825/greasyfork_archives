// ==UserScript==
// @name         遇见江湖辅助工具-清正邪
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  just to make the game eaiser!
// @author       RL
// @include      http://sword-direct37.yytou.cn:8086/?id=4239029*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369322/%E9%81%87%E8%A7%81%E6%B1%9F%E6%B9%96%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7-%E6%B8%85%E6%AD%A3%E9%82%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/369322/%E9%81%87%E8%A7%81%E6%B1%9F%E6%B9%96%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7-%E6%B8%85%E6%AD%A3%E9%82%AA.meta.js
// ==/UserScript==

var yjjhCleanerScript = function () {
    document.title = '清正邪';

    var debugMode = false;

    class Job {
        constructor (id, interval, startEvent) {
            this._id = id;
            this._interval = interval;
            this._startEvent = startEvent;
        }

        start () {
            this._handler = setInterval(this._startEvent, this._interval);
            log('Starting job ' + this._id + ' (handler=' + this._handler + ')');
        }

        stop () {
            log('Stop job ' + this._id + ' (handler=' + this._handler + ')');
            clearInterval(this._handler);
        }

        getId () {
            return this._id;
        }

        getInterval () {
            return this._interval;
        }
    }

    var JobManager = {

        _jobs: [],

        reset () {
            this._jobs = [];
        },

        register (id, interval, startEvent) {
            this._jobs.push(new Job(id, interval, startEvent));
        },

        getJob (id) {
            return this._jobs.filter((v) => v.getId() === id)[0];
        }
    };

    class Npc {
        constructor (name) {
            this._name = name;
        }

        setId (id) {
            this._id = id;
        }

        getId () {
            return this._id ? this._id : Objects.Npc.getIdByName(this._name);
        }

        getName () {
            return this._name;
        }

        toString () {
            return this._name + '/' + this._id;
        }
    }

    var CombatHelper = {

        readyToPerform (threshold) {
            return threshold <= Panels.Combat.getCurrentBuffer();
        },

        perform (skills) {
            debugging('准备出招：' + skills);
            ExecutionManager.execute(Panels.Combat.getSkillLinks(skills));
        },

        completed () {
            return Panels.Combat.containsMessage('战斗结束');
        }
    };

    var knownBuffers = {
        '排云掌法': 3,
        '九天龙吟剑法': 3,
        '道种心魔经': 3,
        '覆雨剑法': 3,
        '如来神掌': 3,
        '雪饮狂刀': 3,
        '织冰剑法': 3,
        '孔雀翎': 3,
        '飞刀绝技': 3,
        '翻云刀法': 3,
        '万流归一': 3,
        '幽影幻虚步': 3,
        '生生造化功': 3
    };

    class BufferCalculator {
        constructor (skills) {
            this._bufferRequired = skills.map(function (skill) {
                return knownBuffers[skill] ? knownBuffers[skill] : 2;
            }).reduce(function (first, second) {
                return first + second;
            });
        }

        getBufferRequired () {
            return this._bufferRequired;
        }
    }

    class Combat {
        constructor (checkInerval = 200) {
            this._checkInterval = checkInerval;
        }

        initialize (npc, action, skills) {
            this._npc = npc;
            this._action = action;
            this._skills = skills;
        }

        async fire () {
            if (!this._npc.getId()) {
                debugging('npc ' + this._npc.getId() + ' 并不存在。');
                return false;
            } else {
                await Objects.Npc.action(this._npc, this._action);
                await ExecutionManager.sleep(500);

                if (this.notInCombat()) {
                    await ExecutionManager.sleep(1000);
                    await Objects.Npc.action(this._npc, this._action);
                }

                return this.perform(this._skills);
            }
        }

        notInCombat () {
            let result = !$('#combat_auto_fight').html();
            if (result) debugging('当前没有正在进行中的战斗。');
            return result;
        }

        async perform (skills) {
            if (this.notInCombat()) return false;
            if (this.readyToStop()) return true;

            if (this._additionalStopEvent && this._additionalStopEvent.getCriterial()()) {
                this._additionalStopEvent.getAction()();
            } else if (CombatHelper.readyToPerform(new BufferCalculator(skills).getBufferRequired())) {
                CombatHelper.perform(skills);
            }

            await ExecutionManager.sleep(this._checkInterval);

            return this.perform(skills);
        }

        setAdditionalStopEvent (additionalStopEvent) {
            this._additionalStopEvent = additionalStopEvent;
        }

        readyToStop () {
            let result = CombatHelper.completed();
            if (result) debugging('战斗结束，准备退出。');
            return result;
        }
    }

    class ScavengerEvent {
        constructor (evilName, goodName) {
            this._evil = new Npc(evilName);
            this._good = new Npc(goodName);
            this._path = PathManager.getPath(goodName);
            this._completed = false;
        }

        getGood () {
            return this._good;
        }

        getEvil () {
            return this._evil;
        }

        getPath () {
            return this._path;
        }

        toString () {
            return this._evil.getName() + ' vs. ' + this._good.getName();
        }
    }

    class CustomizedEvent {
        constructor (criterial, action) {
            this._criterial = criterial;
            this._action = action;
        }

        getCriterial () {
            return this._criterial;
        }

        getAction () {
            return this._action;
        }
    }

    var ScavengerEventHandler = {

        _REG_NEW_EVENT: '^【系统】(.*?)：(.*?)正在行凶，各位侠客行行好来救救我吧~',
        _eventsQueue: [],
        _locked: false,
        _counter: 0,

        reset () {
            ScavengerEventHandler._eventsQueue = [];
        },

        lock () {
            debugging('开始清理正邪，加锁避免干扰。');

            ScavengerEventHandler._locked = true;
        },

        unlock () {
            debugging('清理正邪结束，解除锁定。');

            ScavengerEventHandler._locked = false;
        },

        isLocked () {
            return ScavengerEventHandler._locked;
        },

        getEventsQueue () {
            return ScavengerEventHandler._eventsQueue;
        },

        addIntoQueue (event) {
            ScavengerEventHandler._eventsQueue.push(event);
            debugging('发现新的正邪事件: ' + event.toString() + ', 当前队列待处理事件数 ' + ScavengerEventHandler._eventsQueue.length);
        },

        async produce () {
            if (!ScavengerEventHandler.isLocked()) {
                Panels.Chatting.filterMessageObjectsByKeyword(ScavengerEventHandler._REG_NEW_EVENT).each(function () {
                    let matches = $(this).text().match(ScavengerEventHandler._REG_NEW_EVENT);
                    let event = new ScavengerEvent(matches[2], matches[1]);

                    if (isNewEvent(ScavengerEventHandler._eventsQueue, event)) {
                        ScavengerEventHandler.addIntoQueue(event);
                    }
                });
            }

            function isNewEvent (queue, event) {
                return !queue.some(item => item.toString() === event.toString());
            }
        },

        async consume () {
            if (!ScavengerEventHandler.isLocked()) {
                if (ScavengerEventHandler.getEventsQueue().length > 0) {
                    ScavengerEventHandler.lock();

                    await clearChatting();
                    await ScavengerEventHandler.handle(ScavengerEventHandler.getEventsQueue().shift());

                    ScavengerEventHandler.unlock();
                }
            } else if ($('.outbig_text').text().match('战斗结束')) {
                await ButtonManager.click('prev_combat;go_chat');
                await ButtonManager.click('go_chat sys', 200, 1);
            }

            async function clearChatting () {
                await ButtonManager.click('empty_chat', 1);
                await ButtonManager.click('quit_chat');
                await ButtonManager.click('cancel_prompt', 1);
                await ButtonManager.click('go_chat');
                await ButtonManager.click('go_chat sys', 1);
            }
        },

        async handle (event) {
            await Navigation.move(event.getPath());
            await ExecutionManager.sleep(1000);

            let npcs = Objects.Room.getAvailableNpcs();
            for (let i = 0; i < npcs.length; i++) {
                if (npcs[i].getName() !== event.getGood().getName()) continue;

                await Objects.Npc.action(npcs[i], '观战');
                if (!thereIsOtherPeople() && !isDragonEvent()) {
                    debugging('没有发现战斗中有其他人。');
                    await ButtonManager.click('escape;golook_room');
                    await startCombat(npcs[i], '杀死', ['茅山道术'], new CustomizedEvent(this.readyToEscape, this.escape));

                    log('清理次数累计：' + ++ScavengerEventHandler._counter);
                    document.title = '清正邪 - ' + ScavengerEventHandler._counter;
                }
            }

            await ButtonManager.click('golook_room');
            await ExecutionManager.sleep(1000);
            await Navigation.move('escape;home;go_chat;go_chat sys');

            function thereIsOtherPeople () {
                debugging('目前战斗中人数为 ' + ($('.progress').length - 1) / 2);
                return $('.progress').length > 5;
            }

            function isDragonEvent () {
                let result = parseInt($('#vs_hp11').text()) > 1000000 || parseInt($('#vs_hp21').text()) > 1000000;
                if (result) debugging('疑似青龙，就不掺和了。');
                return result;
            }

            async function startCombat (npc, action, skills, additionalStopEvent) {
                let combat = new Combat();
                combat.initialize(npc, action, skills);
                combat.setAdditionalStopEvent(additionalStopEvent);

                await combat.fire();
            }
        },

        readyToEscape () {
            return Panels.Combat.containsMessage('金甲符兵') || Panels.Combat.containsMessage('玄阴符兵');
        },

        escape () {
            ButtonManager.click('escape');
        }
    };

    var Panels = {

        Chatting: {
            filterMessageObjectsByKeyword (regKeyword) {
                return $('span .out3_auto').filter(function () { return $(this).text().match(regKeyword); });
            }
        },

        Combat: {
            containsMessage (regKeyword) {
                return $('.out').filter(function () { return $(this).text().match(regKeyword); }).length > 0;
            },

            getSkillLinks (skills) {
                let links = [];
                $('.cmd_skill_button').filter(function () {
                    return skills.includes($(this).text());
                }).each(function () {
                    links.push($(this).attr('onclick'));
                });

                if (!links.length) {
                    links.push($('.cmd_skill_button').last().attr('onclick'));
                }
                return links;
            },

            getCurrentBuffer () {
                return parseInt($('#combat_xdz_text').text());
            }
        }
    };

    var Objects = {

        Room: {
            getNpcDomByName (name = null) {
                return $('.cmd_click3').filter(function () { return !name || $(this).text() === name; });
            },

            getNpcDomById (id) {
                return $('.cmd_click3').filter(function () { return $(this).attr('onclick').match('look_npc ' + id); });
            },

            getName () {
                return $('span.outtitle').text();
            },

            getAvailableNpcs (name = null) {
                let npcs = [];
                Objects.Room.getNpcDomByName(name).each(function () {
                    let matches = $(this).attr('onclick').match('look_npc (bad_target.*?)\'');
                    if (matches) {
                        let npc = new Npc($(this).text());
                        npc.setId(matches[1]);
                        npcs.push(npc);
                        debugging('发现 ' + npc.toString());
                    }
                });

                return npcs;
            }
        },

        Npc: {
            async action (npc, action, times = 1) {
                debugging(action + ' ' + npc.getName() + ', 重复次数 ' + times);

                await ExecutionManager.asyncExecute(Objects.Room.getNpcDomById(npc.getId()).attr('onclick'), 1000);
                let actionLink = Objects.Npc.getActionLink(action);
                for (let i = 0; i < times; i++) {
                    await ExecutionManager.asyncExecute(actionLink, 200);
                }
            },

            getActionLink (action) {
                return $('.cmd_click2').filter(function () { return $(this).text() === action; }).attr('onclick');
            },

            getIdByName (name) {
                let find = Objects.Room.getNpcDomByName(name).last();
                if (find.length > 0) {
                    return find.attr('onclick').match(".*?look_npc (.*?)'")[1];
                }
            }
        }
    };

    var ButtonManager = {

        async click (actionString, delay = 200, parameter = 0) {
            let array = actionString.includes('#') ? actionString.split(';').extract() : actionString.split(';');

            for (let i = 0; i < array.length; i++) {
                await ExecutionManager.asyncExecute("clickButton('" + array[i] + "'," + parameter + ')', delay);
            }
        },

        toggleButtonEvent (button) {
            if (button.innerText !== button.name) {
                button.innerText = button.name;
                button.style.color = '';

                return false;
            } else {
                button.innerText = 'x ' + button.name;
                button.style.color = 'red';

                return true;
            }
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
                debugging('async execute ' + commands[i]);
                await eval(commands[i]);
                await ExecutionManager.sleep(Math.floor(Math.random() * 50 + delay));
            }
        },

        async sleep (timeout) {
            return new Promise((resolve, reject) => { setTimeout(function () { resolve(); }, timeout); });
        }
    };

    var DailyGiftManager = {
        async fire () {
            if (ScavengerEventHandler.isLocked()) return;

            ScavengerEventHandler.lock();

            await ButtonManager.click('jh 1;look_npc snow_mercenary');
            ExecutionManager.sleep(1000);
            $('.cmd_click2').filter(function () { return !$(this).text().match('兑换礼包|1元礼包|对话|比试|给予|登录大礼'); }).each(async function () {
                debugging('雪亭镇客栈逄义：' + $(this).text());
                await ExecutionManager.asyncExecute($(this).attr('onclick'));
            });

            debugging('雪亭镇李火狮：消费积分，谜题卡，狗年礼券');
            await Navigation.move('jh 1;e;n;#2 e;event_1_44731074;#2 event_1_8041045;event_1_16891630');
            debugging('扬州黄掌柜：签到');
            await Navigation.move('jh 5;#3 n;w;sign7');

            await Navigation.move('jh 5;n;n;e;look_npc yangzhou_yangzhou9');
            ExecutionManager.sleep(1000);
            $('.cmd_click2').filter(function () { return !$(this).text().match('对话|比试|给予'); }).each(async function () {
                debugging('扬州小宝斋双儿：' + $(this).text());
                await ExecutionManager.asyncExecute($(this).attr('onclick'));
            });

            await ButtonManager.click('share_ok 1;share_ok 2;share_ok 3;share_ok 4;share_ok 5;share_ok 7');
            await ButtonManager.click('cangjian get_all;xueyin_shenbinggu unarmed get_all;xueyin_shenbinggu blade get_all;xueyin_shenbinggu throwing get_all');

            ExecutionManager.sleep(500);
            await Navigation.move('home;go_chat;go_chat sys');

            ScavengerEventHandler.unlock();
        }
    };

    var PathManager = {
        getPath (npcName) {
            return PathManager._PATHS[npcName];
        },

        _PATHS: {
            '柳绘心': 'jh 1;e;n;#4 e;n',
            '王铁匠': 'jh 1;e;n;n;w',
            '杨掌柜': 'jh 1;e;#3 n;w',
            '柳小花': 'jh 2;#4 n;w;s;w',
            '卖花姑娘': 'jh 2;#7 n',
            '客商': 'jh 2;n;n;e',
            '刘守财': 'jh 2;#7 n;e',
            '方老板': 'jh 3;s;s;e',
            '方寡妇': 'jh 3;s;s;w;n',
            '朱老伯': 'jh 3;s;s;w'
        }
    };

    var Navigation = {

        async move (path) {
            let steps = path.split(';').extract();

            for (let i = 0; i < steps.length; i++) {
                await ExecutionManager.asyncExecute("clickButton('" + steps[i] + "')");
            }
        }
    };

    function log (message) {
        console.log(message);
    }

    function debugging (message) {
        if (debugMode) console.log('[调试信息] ' + message);
    }

    Array.prototype.extract = function () {
        let result = [];

        for (let i = 0; i < this.length; i++) {
            if (this[i].charAt(0) === '#') {
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

    JobManager.register('ScavengerEventProducer', 1000 * 5, ScavengerEventHandler.produce);
    JobManager.register('ScavengerEventConsumer', 1000 * 30, ScavengerEventHandler.consume);
    JobManager.register('id-daily', 1000 * 60 * 60 * 2, DailyGiftManager.fire);

    var helperConfigurations = [{
        subject: 'Monitoring|监控选项',

        buttons: [{
            label: 'Debug Mode|调试模式',
            title: '当调试模式开启，浏览器控制台会输出更详细的日志，方便追踪问题。',
            id: 'Debugging',

            eventOnClick () {
                if (ButtonManager.toggleButtonEvent(this)) {
                    log('开启调试模式，输出详细日志。');
                    debugMode = true;
                } else {
                    log('关闭调试模式，仅输出关键日志。');
                    debugMode = false;
                }
            }
        }, {
            label: 'Clean Up Chatting|清空聊天窗口',
            title: '清空当前聊天窗口\n\n注意：可能造成之前有用信息丢失',

            eventOnClick () {
                if (window.confirm('确定清空聊天窗口及相关记录? ')) {
                    ScavengerEventHandler.reset();
                    ButtonManager.click('empty_chat;go_chat');
                }
            }
        }, {
            label: 'Daily|每日常规',
            title: '每 ' + JobManager.getJob('id-daily').getInterval() / (1000 * 60 * 60) + ' 小时检查一次如下项目：\n\n1. 逄义本周礼包（自动识别新礼包）\n2. 扬州签到 + 小宝斋（自动识别新礼包）\n3. 李火狮消费积分，谜题卡，狗年礼券\n\n注意：周日晚上挂着可以自动多领一次每周礼包',
            id: 'id-daily',

            eventOnClick () {
                if (ButtonManager.toggleButtonEvent(this)) {
                    if (window.confirm('要不要马上触发一次？')) {
                        DailyGiftManager.fire();
                    }

                    JobManager.getJob(this.id).start();
                } else {
                    JobManager.getJob(this.id).stop();
                }
            }
        }, {
            label: 'Scavenger|自动清理正邪',
            title: '自动清理正邪\n\n1. 点下按钮自动切换到聊天窗口，系统栏；\n2. 每五秒检查一次聊天记录，如有正邪出现加入队列；\n3. 每半分钟自动触发一次清理动作，自动寻路到对应正邪，杀好人，放一个符兵成功才逃跑；\n4. 自动回到师门聊天窗口，等待下一次触发动作。',

            async eventOnClick () {
                if (ButtonManager.toggleButtonEvent(this)) {
                    ButtonManager.click('go_chat;go_chat sys');

                    if (window.confirm('要不要立刻触发一次？')) {
                        await ScavengerEventHandler.produce();
                        await ScavengerEventHandler.consume();
                    }

                    JobManager.getJob('ScavengerEventProducer').start();
                    JobManager.getJob('ScavengerEventConsumer').start();
                } else {
                    JobManager.getJob('ScavengerEventProducer').stop();
                    JobManager.getJob('ScavengerEventConsumer').stop();
                }
            }
        }]
    }];

    var CONST_LANGUAGE_IN_CHINESE = (navigator.systemLanguage ? navigator.systemLanguage : navigator.language).substr(0, 2) === 'zh';

    var initializeHelperButtons = function () {
        var CONST_BUTTON_WIDTH = 140;
        var CONST_BUTTON_HEIGHT = 30;
        var CONST_BUTTON_OFFSET_LANDSCAPE = 10;
        var CONST_BUTTON_NUMBER_EACH_COLUMN = 16;
        var CONST_DEFAULT_TOP = 20;

        var topPx = CONST_DEFAULT_TOP;
        var rightPx = 0;
        var counter = 0;

        for (let i = 0; i < helperConfigurations.length; i++) {
            let group = helperConfigurations[i];

            createSubject(group.subject);
            createButtons(group.buttons);
            if (group.additionalPosition) {
                createReservedPosition(group.additionalPosition);
            }
        }

        function createReservedPosition (number) {
            for (let i = 0; i < number; i++) {
                let button = document.createElement('button');

                adjustPosition(button);
                button.innerText = '';
                button.hidden = true;

                document.body.appendChild(button);
            }
        }

        function buildLabel (labelConf) {
            let labels = labelConf.split('|');

            if (CONST_LANGUAGE_IN_CHINESE && labels.length > 1) {
                return labels[1];
            } else {
                return labels[0];
            }
        }

        function createSubject (subject) {
            let button = document.createElement('button');

            button.innerText = buildLabel(subject);
            adjustPosition(button);
            button.style.border = 'none';
            button.style.background = 'white';
            button.disabled = true;
            button.className = 'canBeHidden';

            document.body.appendChild(button);
        }

        function adjustPosition (button) {
            let column = (Math.ceil((counter + 1) / CONST_BUTTON_NUMBER_EACH_COLUMN) - 1);

            rightPx = column * (CONST_BUTTON_WIDTH + CONST_BUTTON_OFFSET_LANDSCAPE);
            topPx = (counter - column * CONST_BUTTON_NUMBER_EACH_COLUMN) % CONST_BUTTON_NUMBER_EACH_COLUMN === 0 ? CONST_DEFAULT_TOP : topPx + 40;

            button.style.width = CONST_BUTTON_WIDTH + 'px';
            button.style.height = CONST_BUTTON_HEIGHT + 'px';
            button.style.position = 'absolute';
            button.style.right = rightPx + 'px';
            button.style.top = topPx + 'px';

            counter++;
        }

        function createButtons (buttons) {
            for (let j = 0; j < buttons.length; j++) {
                if (buttons[j].hidden) continue;

                let button = createButton(buttons[j]);
                button.addEventListener('click', buttons[j].eventOnClick);
            }
        }

        function createButton (conf) {
            let button = document.createElement('button');

            adjustPosition(button);
            button.innerText = buildLabel(conf.label);
            button.name = button.innerText;
            button.className = 'canBeHidden';

            if (conf.id) button.id = conf.id;
            if (conf.title) button.title = conf.title;

            document.body.appendChild(button);
            return button;
        }
    };

    initializeHelperButtons();
};

window.setTimeout(yjjhCleanerScript, 1000);

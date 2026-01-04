// ==UserScript==
// @name            Raidsss
// @namespace       cqv
// @version         1.0.16
// @description     自用
// @author          Bob.cn
// @match           http://game.wsmud.com/*
// @match           http://www.wsmud.com/*
// @run-at          document-end
// @require         https://cdn.staticfile.org/vue/2.2.2/vue.min.js
// @grant           unsafeWindow
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_deleteValue
// @grant           GM_listValues

// @downloadURL https://update.greasyfork.org/scripts/376201/Raidsss.user.js
// @updateURL https://update.greasyfork.org/scripts/376201/Raidsss.meta.js
// ==/UserScript==


(function () {

    'use strict';

    var Debug = {
        open: true,
        print: function(msg) {
            if (!this.open) return;
            console.log("[DEBUG]: ");
            console.log(msg);
        },
    };

    var Message = {
        append: function(msg) {
            messageAppend(msg);
        },
        clean: function() {
            messageClear();
        }
    };

    //---------------------------------------------------------------------------
    //  Work Item and it's subclass
    //---------------------------------------------------------------------------

    //  Work Item

    class WorkItem {
        
        constructor(name) {
            this.name = name;
            this.log = true;
            this.required = false;
        }

        viable() {
            if (this._assert) return this._assert();
            return true;
        }
        /**
         * @param {Function} assert function()
         */
        setAssert(assert) {
            this._assert = assert;
        }
        /**
         * @param {Function} callback function()
         */
        setCallback(callback) {
            this._callback = callback;
        }
        run() {
            this.willStartRun();
            var theSelf = this;
            var callback = function() {
                if (theSelf._callback) theSelf._callback();
                theSelf.didFinishRun();
            };
            this.internalRun(callback);
        }

        /* 可重写 */
        willStartRun() {
            if (this.log) Message.append("即将运行工作项【" + this.name + "】...");
        }
        didFinishRun() {
            if (this.log) Message.append("已经完成工作项【" + this.name + "】的运行。");
        }
        internalRun(callback) {}
    }

    //  Workflow

    class Workflow extends WorkItem {

        /**
            * @param {string} name 
            * @param {WorkItem[]} items 
            * @param {number} [count]
            * @param {number} [interval]
            */
        constructor(name, items, count, interval) {
            super(name);
            this.items = items;
            this.count = count == null ? 1 : count;
            this.interval = interval == null ? 1000 : interval;
            this.exitFlag = false; // 标记需要退出
        }

        internalRun(callback) {
            this._internalRun(callback, 0, 0);
        }

        _internalRun(callback, number, index) {
            if (this.exitFlag == true) {
                if (callback) callback();
                return;
            }

            var realIndex = index;
            var realNumber = number;
            if (realIndex >= this.items.length) {
                this.didFinishOnceRun(realNumber);
                realNumber += 1;
                realIndex = 0;
            }
            if (realIndex == 0) {
                this.willStartOnceRun(realNumber);
            }
            if (realNumber >= this.count) {
                if (callback) callback();
                return;
            }
            var item = this.items[realIndex];
            this.willStartRunItem(item);
            var theSelf = this;
            if (item.viable() == false) {
                if (!item.required) {
                    this.didFinishRunItem(item);
                    this._internalRun(callback, realNumber, realIndex + 1);
                } else {
                    setTimeout(function () {
                        theSelf._internalRun(callback, realNumber, realIndex);
                    }, theSelf.interval);
                }
                return;
            }
            item.setCallback(function() {
                theSelf.didFinishRunItem(item);
                setTimeout(function () {
                    theSelf._internalRun(callback, realNumber, realIndex + 1);
                }, theSelf.interval);
            });
            item.run();
        }

        /* 可重写 */
        willStartRun() {
            if (this.log) {
                Message.clean();
                Message.append("<hio>即将开始运行工作流程【" + this.name + "】...</hio>");
            }
        }
        didFinishRun() {
            if (this.log) Message.append("<hio>已经完成工作流程【" + this.name + "】的全部运行。</hio>");
        }
        willStartOnceRun(number) {

        }
        didFinishOnceRun(number) {
            if (this.log && this.count > 1) {
                Message.append("<hiy>已经完成工作流程【" + this.name +"】的第 " + (number + 1) + "/" + this.count + " 次运行；<hiy>");
            }
        }

        willStartRunItem(item) {

        }
        didFinishRunItem(item) {

        }
    }

    // ---------------------------------------------------------------------------

    // Assert Left Mark Handler

    var AssertLeftMarkHandlerCenter = {
        /**
            * @param {Function} handler function(leftMark)->{handle: Bool, value: string}
            */
        addHandler: function(handler) {
            this._leftMarkHandlers.push(handler);
        },
        getValue(leftMark) {
            for (let i = 0; i < this._leftMarkHandlers.length; i++) {
                const handler = this._leftMarkHandlers[i];
                var result = handler.handle(leftMark);
                if (!result.handle) continue;
                return result.value;
            }
            return leftMark;
        },
        _leftMarkHandlers: []
    };

    // Assert Wrapper

    class AssertWrapper {
        /**
            * @param {Function} assert1 function(string)->Bool
            * @param {string} text 
            */
        constructor(assert1) {
            var theSelf = this;
            this.assert = function() {
                return assert1(theSelf.text);
            };
        }
        setText(text) {
            this.text = text;
        }
    }

    //  Assert Holder

    class AssertHolder {
        /**
            * @param {Function} match function(expression)->Bool
            * @param {AssertWrapper} assertWrapper
            */
        constructor(match, assertWrapper) {
            this.match = match;
            this.assertWrapper = assertWrapper;
        }
    }

    var AssertHolderCenter = {
        /**
            * @param {AssertHolder} holder
            */
        addAssertHolder: function(holder) {
            this._assertHolders.push(holder);
        },
        /**
            * @param {string} expression 
            * @returns {Function} assert: function()
            */
        get: function(expression) {
            var theSelf = this;
            var relationIndex = expression.search(/&|\|/g);
            if (relationIndex != -1) {
                var relation = expression[relationIndex];
                var left = expression.substring(0, relationIndex);
                var right = expression.substring(relationIndex + 1);
                var assert = function() {
                    Debug.print("relation: " + relation);
                    var leftAssert = theSelf.get(left);
                    var rightAssert = theSelf.get(right);
                    switch (relation) {
                        case "&":
                            return leftAssert() && rightAssert();
                        case "|":
                            return leftAssert() || rightAssert();
                    }
                };
                return assert;
            }
            var not = expression[0];
            if (not == "!") {
                var assert = function() {
                    return !theSelf.get(expression.substring(1))();
                }
                return assert;
            }
            for (let i = 0; i < this._assertHolders.length; i++) {
                const holder = this._assertHolders[i];
                if (holder.match(expression)) {
                    var wrapper = holder.assertWrapper;
                    wrapper.setText(expression);
                    return wrapper.assert;
                }
            }
            return null;
        },
        _assertHolders: []
    };

    (function addTureAssertHolder() {
        var match = function(text) {
            return text == "true";
        };
        var assert = function(text) {
            return true;
        };
        var holder = new AssertHolder(match, new AssertWrapper(assert));
        AssertHolderCenter.addAssertHolder(holder);
    })();

    (function addFalseAssertHolder() {
        var match = function(text) {
            return text == "false";
        };
        var assert = function(text) {
            return false;
        };
        var holder = new AssertHolder(match, new AssertWrapper(assert));
        AssertHolderCenter.addAssertHolder(holder);
    })();

    (function addPresetConfigAssertHolder() {
        var patt = new RegExp(">=?|<=?|!=|==?");
        var match = function(text) {
            return patt.test(text);
        };
        var assert = function(text) {
            var result = patt.exec(text);
            var opt = result[0];
            var parts = text.split(opt);
            var left = parts[0];
            var lvalue = AssertLeftMarkHandlerCenter.getValue(left);
            var rvalue = parts[1];
            var lfloat = parseFloat(lvalue);
            var rfloat = parseFloat(rvalue);
            var byDigit = false;
            if (!isNaN(lfloat) && !isNaN(rfloat)) {
                lvalue = lfloat;
                rvalue = rfloat;
                byDigit = true;
            }
            switch (opt) {
                case "=":
                case "==":
                if (byDigit) {
                    return Math.abs(lvalue - rvalue) < 0.001;
                } else {
                    return lvalue == rvalue;
                }
                case ">":
                return lvalue > rvalue;
                case "<":
                return lvalue < rvalue;
                case ">=":
                return lvalue >= rvalue;
                case "<=":
                return lvalue <= rvalue;
                case "!=":
                if (byDigit) {
                    return Math.abs(lvalue - rvalue) > 0.001;
                } else {
                    return lvalue != rvalue;
                }
                default:
                return false;
            }
        };
        var holder = new AssertHolder(match, new AssertWrapper(assert));
        AssertHolderCenter.addAssertHolder(holder);
    })();

    // Command Handler

    var CommandHandleStatus = {
        pass: 0,
        defer: 1,
        over: 2,
    };

    var CommandHandlerPriority = {
        debug: -1,
        toServer: 0,
        handleMovement: 1,
        ordinary: 5,
        idPlaceholder: 8,
        checkWhetherFree: 9
    };

    class CommandHandler {
        /**
            * @param {Function} handle function(command: Command, callback: function(command: Command, status: CommandHandleStatus))
            * @param {number} priority CommandHandlerPriority
            */
        constructor(handle, priority) {
            this.handle = handle;
            this.priority = priority == null ? CommandHandlerPriority.ordinary : priority;
        }
    }

    var CommandHandlerCenter = {
        addHandler: function(handler) {
            this._handlers.push(handler);
            this._handlers.sort(function(a, b) {
                return b.priority - a.priority;
            });
        },
        /**
            * @param {string} cmd
            * @param {Function} callback function(status: CommandHandleStatus)
            */
        handle: function(command, callback) {
            CommandHandlerCenter._handle(0, command, callback);
        },
        _handle: function(index, command, callback) {
            if (index >= CommandHandlerCenter._handlers.length) {
                callback(CommandHandleStatus.pass);
                return;
            }
            var handler = CommandHandlerCenter._handlers[index];
            handler.handle(command, function(command1, status) {
                switch (status) {
                case CommandHandleStatus.over:
                    callback(status);
                    break;
                case CommandHandleStatus.pass:
                    CommandHandlerCenter._handle(index + 1, command1, callback);
                    break;
                case CommandHandleStatus.defer:
                    callback(status);
                    break;
                }
            });
        },
        _handlers: [],
    };

    var AbbreviationCenter = {
        register: function(abbreviation, value) {
            this._map[abbreviation] = value;
        },
        handle: function(expression) {
            for (const key in this._map) {
                if (!this._map.hasOwnProperty(key)) continue;
                if (key == expression) {
                    return this._map[key];
                }
            }
            return expression;
        },
        _map: {}
    };

    // Command

    class Command extends WorkItem {
        /**
            * @param {string} expression 
            * @param {number} [again] After the command execution is blocked, try again after <again> millisecond.
            */
        constructor(expression, again) {
            super(expression);
            this._expression = expression;
            this._isGuard = false;
            this.again = again == null ? 1000 : again;
        }
        // 命令的副作用，会反馈到 CommandWorkflow 中
        updateParam(key, value) {
            this.updatedParams[key] = value;
        }
        lastCommandStartTimestamp() {
            return this._lastCommandStartTimestamp;
        }
        setLastCommandStartTimestamp(timestamp) {
            this._lastCommandStartTimestamp = timestamp;
        }
        // 是否为守护语句，守护语句不参与时序
        isGuard(value) {
            if (value == null) return this._isGuard;
            this._isGuard = value;
        }
        /**
         * @param {Object} params 注入参数
         */
        parse(params) {
            var assignedExp = this._assignVariables(this._expression, params);
            var result = this._splitCondition(assignedExp);
            this.setAssert(result[0]);
            this.required = result[1];
            var packedCmd = result[2];
            this.cmd = this._unpackCmd(packedCmd);
        }
        willStartRun() {
            if (this.log) Message.append("&nbsp;&nbsp;> next: " + this._expression);
            this.updatedParams = {};
        }
        didFinishRun() { }
        internalRun(callback) {
            this._internalRun(callback);
        }
        _internalRun(callback) {
            var theSelf = this;
            var handlerCallback = function (status) {
                switch (status) {
                    case CommandHandleStatus.over:
                    if (theSelf.log) Message.append("&nbsp;&nbsp;> over: " + theSelf._expression);
                    callback();
                    break;
                    case CommandHandleStatus.pass:
                    if (theSelf.log) Message.append("&nbsp;&nbsp;> pass: " + theSelf._expression);
                    callback();
                    break;
                    case CommandHandleStatus.defer:
                    setTimeout(function () {
                        theSelf._internalRun(callback);
                    }, theSelf.again);
                    break;
                }
            };
            CommandHandlerCenter.handle(this, handlerCallback);
        }
        // 将变量的值代入变量中
        _assignVariables(expression, params) {
            var placeholders = [];
            var patt = /\([:a-zA-Z0-9_]*?\)/g;
            var result = patt.exec(expression);
            while(result != null) {
                placeholders.push(result[0]);
                result = patt.exec(expression);
            }
            var assignedExp = expression;
            for (let i = 0; i < placeholders.length; i++) {
                const placeholder = placeholders[i];
                var key = placeholder.substring(1, placeholder.length - 1);
                if (!params.hasOwnProperty(key)) continue;
                assignedExp = assignedExp.replace(placeholder, params[key]);
            }
            return assignedExp;
        }
        // 将 this._expression 分离为 assert、required 和 cmd(packed)
        _splitCondition(expression) {
            var patt = /^\[.+?\]/g;
            var result = patt.exec(expression);
            if (result == null || result.length <= 0) {
                return [null, false, expression];
            }
            var value = result[0];
            var assertExp = value.substring(1, value.length - 1);
            var required = false;
            if (assertExp[0] == "=") {
                required = true;
                assertExp = assertExp.substring(1);
            }
            var assert = AssertHolderCenter.get(assertExp);
            var cmd = expression.substring(value.length);
            return [assert, required, cmd];
        }
        // 处理诸如 go west[3]
        _unpackCmd(packedCmd) {
            var unpackedCmd = "";
            var end = 0;
            var patt = /([^;]+)\[(\d+?)\]/g;
            var result = patt.exec(packedCmd);
            while(result != null) {
                if (unpackedCmd == null) unpackedCmd = "";
                unpackedCmd += packedCmd.substring(end, result.index);
                var cmd = result[1];
                var count = parseInt(result[2]);
                var temp = (new Array(count)).fill(cmd);
                unpackedCmd += temp.join(";");
                end = result.index + result[0].length;
                result = patt.exec(packedCmd);
            }
            unpackedCmd += packedCmd.substring(end, packedCmd.length);
            return unpackedCmd;
        }
    }

    var GlobalParams = {
        refresh: function() {}
    };

    // Command Workflow

    class CommandWorkflow extends Workflow {
        /**
            * @param {string} name 
            * @param {string[]} cmds 
            * @param {number} [count]
            * @param {number} [interval]
            * @param {number} [commandAgain]
            */
        constructor(name, cmds, count, interval, commandAgain) {
            var realCommandAgain = commandAgain == null ? interval : commandAgain;
            var items = [];
            var guardCommands = [];
            for (var i = 0; i < cmds.length; i++) {
                var cmd = cmds[i];
                cmd = AbbreviationCenter.handle(cmd);
                if (cmd.indexOf("#") == 0) {
                    var item = new Command(cmd.substring(1), realCommandAgain);
                    item.isGuard(true);
                    guardCommands.push(item);
                    continue;
                }
                var item = new Command(cmd, realCommandAgain);
                items.push(item);
                // 添加守护命令
                for (let j = 0; j < guardCommands.length; j++) {
                    const guard = guardCommands[j];
                    items.push(guard);
                }
            }
            var realCount = count == null ? 1 : count;
            super(name, items, realCount, interval);
        }
        willStartRun() {
            if (this.log) {
                Message.append("<hic>&nbsp;&nbsp;即将开始运行命令组 <" + this.name + "> ...</hic>");
            }
        }
        didFinishRun() {
            if (this.log) {
                if (this.log) Message.append("<hic>&nbsp;&nbsp;已经完成命令组 <" + this.name + "> 的全部运行。</hic>");
            }
        }
        willStartOnceRun(number) {
            this._customParams = {};
            this.lastCommandStartTimestamp = new Date().getTime();
        }
        didFinishOnceRun(number) {
            if (this.log && this.count > 1) {
                Message.append("<hig>&nbsp;&nbsp;已经完成命令组 <" + this.name + "> 的第 " + (number + 1) + "/" + this.count + " 次执行；</hig>");
            }
        }
        willStartRunItem(command) {
            GlobalParams.refresh();
            var params = {};
            Object.assign(params, this._customParams, GlobalParams, UserGlobalParams.getAll());
            command.parse(params);
            command.setLastCommandStartTimestamp(this.lastCommandStartTimestamp);
            // 守护语句不会影响语句组的时序
            if (!command.isGuard()) {
                this.lastCommandStartTimestamp = new Date().getTime();
            }
        }
        didFinishRunItem(command) {
            if (command.updatedParams == null) return;
            if (command.updatedParams.hasOwnProperty("__exit")) {
                this.exitFlag = true;
            }
            for (var key in command.updatedParams) {
                this._customParams[key] = command.updatedParams[key];
            }
        }
    }

    //---------------------------------------------------------------------------
    // Global Params For wsmud_Raid
    //---------------------------------------------------------------------------

    GlobalParams = {
        refresh: function() {
            this[":hp"] = Role.hp;
            this[":maxHp"] = Role.maxHp;
            this[":hpPer"] = Role.hp/Role.maxHp;
            this[":mp"] = Role.mp;
            this[":maxMp"] = Role.maxMp;
            this[":mpPer"] = Role.mp/Role.maxMp;
            this[":living"] = Role.living;
            this[":state"] = Role.state;
            this[":combating"] = Role.combating;

            this[":room"] = Room.name;
            this[":path"] = Room.path;

            this[":eq0"] = Role.equipments[0];
            this[":eq1"] = Role.equipments[1];
            this[":eq2"] = Role.equipments[2];
            this[":eq3"] = Role.equipments[3];
            this[":eq4"] = Role.equipments[4];
            this[":eq5"] = Role.equipments[5];
            this[":eq6"] = Role.equipments[6];
            this[":eq7"] = Role.equipments[7];
            this[":eq8"] = Role.equipments[8];
            this[":eq9"] = Role.equipments[9];
            this[":eq10"] = Role.equipments[10];

            this[":kf_quan"] = Role.kongfu.quan;
            this[":kf_nei"] = Role.kongfu.nei;
            this[":kf_zhao"] = Role.kongfu.zhao;
            this[":kf_qing"] = Role.kongfu.qing;
            this[":kf_jian"] = Role.kongfu.jian;
            this[":kf_dao"] = Role.kongfu.dao;
            this[":kf_gun"] = Role.kongfu.gun;
            this[":kf_zhang"] = Role.kongfu.zhang;
            this[":kf_bian"] = Role.kongfu.bian;
            this[":kf_an"] = Role.kongfu.an;

            this[":DungeonHpThreshold"] = parseInt(Config.hpThresholdInDungeon())/100;
            this[":DungeonWaitSkillCD"] = Config.waitSkillCD() == "yes";
            this[":DungeonBagCleanWay"] = Config.bagCleanWay();
        }
    };

    //---------------------------------------------------------------------------
    // User Global Params
    //---------------------------------------------------------------------------

    var UserGlobalParams = {
        set: function(key, value) {
            var map = GM_getValue(this._key(), {});
            map[key] = value;
            GM_setValue(this._key(), map);
        },
        getAll: function() {
            return GM_getValue(this._key(), {});
        },
        _key: function() {
            return "global_params@" + Role.id;
        }
    };

    //---------------------------------------------------------------------------
    //  Compatible With wsmud_pluginss
    //---------------------------------------------------------------------------

    /* $wait 毫秒数 */
    (function addWaitCommandHandler() {
        var handle = function(command, callback) {
            if (command.cmd.indexOf("$wait ") != 0) {
                callback(command, CommandHandleStatus.pass);
                return;
            }
            if (command.__overTime == null) {
                var interval = parseInt(command.cmd.substring(6));
                command.__overTime = new Date().getTime() + interval;
                callback(command, CommandHandleStatus.defer);
                return;
            }
            if (command.__overTime > new Date().getTime()) {
                callback(command, CommandHandleStatus.defer);
                return;
            }
            delete command.__overTime;
            callback(command, CommandHandleStatus.over);
        };
        var handler = new CommandHandler(handle, CommandHandlerPriority.ordinary);
        CommandHandlerCenter.addHandler(handler);
    })();

    /* @stopSSAuto 暂时停止 wsmud_pluginss 的自动 Boss 和 自动喜宴 */
    (function addStopSSAutoCommandHandler() {
        var handle = function(command, callback) {
            if (command.cmd.indexOf("@stopSSAuto") != 0) {
                callback(command, CommandHandleStatus.pass);
                return;
            }
            WG.stopAllAuto();
            callback(command, CommandHandleStatus.over);
        };
        var handler = new CommandHandler(handle, CommandHandlerPriority.ordinary);
        CommandHandlerCenter.addHandler(handler);
    })();

    /* @recoverSSAuto 恢复 wsmud_pluginss 的自动 Boss 和 自动喜宴 */
    (function addRecoverSSAutoCommandHandler() {
        var handle = function(command, callback) {
            if (command.cmd.indexOf("@recoverSSAuto") != 0) {
                callback(command, CommandHandleStatus.pass);
                return;
            }
            WG.reSetAllAuto();
            callback(command, CommandHandleStatus.over);
        };
        var handler = new CommandHandler(handle, CommandHandlerPriority.ordinary);
        CommandHandlerCenter.addHandler(handler);
    })();

    //---------------------------------------------------------------------------
    //  Config Command Rules For wsmud_Raid
    //---------------------------------------------------------------------------

    /* @debug 内容 */
    (function addDebugCommandHandler() {
        var handle = function(command, callback) {
            if (command.cmd.indexOf("@debug ") == 0) {
                var text = command.cmd.substring(7);
                if (text[0] == ">") {
                    text = JSON.stringify(eval(text.substring(1)));
                }
                var message = "&nbsp;&nbsp;[debug]: <hiz>" + text + "</hiz>";
                Message.append(message);
                console.log(message);
                callback(command, CommandHandleStatus.over);
                return;
            }
            callback(command, CommandHandleStatus.pass);
        };
        var handler = new CommandHandler(handle, CommandHandlerPriority.ordinary);
        CommandHandlerCenter.addHandler(handler);
    })();

    function TryCalculate(expression) {
        if (/^[0-9\+\-\*\/%]*$/g.test(expression)) {
            return eval(expression);
        }
        return expression;
    }

    /* ($Name)=Bob 设置全局变量，或为全局变量赋值 */
    (function addDeclareGlobalCommandHandler() {
        var handle = function(command, callback) {
            var patt = /^\(\$[A-Z][a-zA-Z0-9_]*?\)=/g;
            var result = patt.exec(command.cmd);
            if (result == null) {
                callback(command, CommandHandleStatus.pass);
                return;
            }
            var text = result[0];
            var key = text.substring(2, text.length - 2);
            var value = command.cmd.substring(text.length);
            UserGlobalParams.set(key, TryCalculate(value));
            callback(command, CommandHandleStatus.over);
        };
        var handler = new CommandHandler(handle, CommandHandlerPriority.ordinary);
        CommandHandlerCenter.addHandler(handler);
    })();

    /* ($name)=Bob 设置局部变量，或为局部变量赋值 */
    (function addDeclareCommandHandler() {
        var handle = function(command, callback) {
            var patt = /^\(\$[a-z][a-zA-Z0-9_]*?\)=/g;
            var result = patt.exec(command.cmd);
            if (result == null) {
                callback(command, CommandHandleStatus.pass);
                return;
            }
            var text = result[0];
            var key = text.substring(2, text.length - 2);
            var value = command.cmd.substring(text.length);
            command.updateParam(key, TryCalculate(value));
            callback(command, CommandHandleStatus.over);
        };
        var handler = new CommandHandler(handle, CommandHandlerPriority.ordinary);
        CommandHandlerCenter.addHandler(handler);
    })();

    /* 检查角色状态 */
    (function addCheckRoleStatusHandler() {
        var handle = function(command, callback) {
            if (Role.isFree()) {
                callback(command, CommandHandleStatus.pass);
            } else {
                callback(command, CommandHandleStatus.defer);
            }
        };
        var handler = new CommandHandler(handle, CommandHandlerPriority.checkWhetherFree);
        CommandHandlerCenter.addHandler(handler);
    })();

    /* @exit 立即退出 */
    (function addExitCommandHandler() {
        var handle = function(command, callback) {
            if (command.cmd == "@exit") {
                command.updateParam("__exit", true);
                callback(command, CommandHandleStatus.over);
                return;
            }
            callback(command, CommandHandleStatus.pass);
        };
        var handler = new CommandHandler(handle, CommandHandlerPriority.ordinary);
        CommandHandlerCenter.addHandler(handler);
    })();

    /* 将系统指令发往服务器 */
    (function addSendCommandHandler() {
        var handle = function(command, callback) {
            Debug.print("[to server]: " + command.cmd);
            WG.SendCmd(command.cmd);
            callback(command, CommandHandleStatus.over);
        };
        var handler = new CommandHandler(handle, CommandHandlerPriority.toServer);
        CommandHandlerCenter.addHandler(handler);
    })();

    /* 替换 对象名称占位符 为 对象id
     * 如 select {财主女儿 崔莺莺};ask {财主女儿 崔莺莺} 
     * 允许模糊查找 */
    (function addIdPlaceholderHandler() {
        var handle = function(command, callback) {
            var patt = /\{.*?\}\??/g;
            var placeholders = [];
            var result = patt.exec(command.cmd);
            while(result != null) {
                placeholders.push(result[0]);
                result = patt.exec(command.cmd);
            }
            var realCmd = command.cmd;
            for (var j = 0; j < placeholders.length; j++) {
                var placeholder = placeholders[j];
                var temp = placeholder;
                var allowNull = false;
                if (temp[temp.length - 1] == "?") {
                    allowNull = true;
                    temp = temp.substring(0, temp.length - 1);
                }
                var itemName = temp.substring(1, temp.length - 1);
                var blurry = true;
                var lastChar = itemName.substring(itemName.length - 1);
                if (lastChar == "%") {
                    blurry = false;
                    itemName = itemName.substring(0, itemName.length - 1);
                }
                var sureInBag = false;
                lastChar = itemName.substring(itemName.length - 1);
                if (/[a-z]/g.test(lastChar)) {
                    sureInBag = true;
                    itemName = itemName.substring(0, itemName.length - 1);
                }
                var itemId = null;
                if (sureInBag) {
                    itemId = Role.rummage(itemName, blurry, lastChar);
                } else {
                    itemId = Room.getItemId(itemName, blurry);
                    if (itemId == null) {
                        itemId = Role.rummage(itemName, blurry);
                    }
                }
                if (itemId == null && !allowNull) {
                    callback(command, CommandHandleStatus.defer);
                    return;
                }
                realCmd = realCmd.replace(placeholder, itemId);
            }
            command.cmd = realCmd;
            callback(command, CommandHandleStatus.pass);
        };
        var handler = new CommandHandler(handle, CommandHandlerPriority.idPlaceholder);
        CommandHandlerCenter.addHandler(handler);
    })();

    /* @cd 等待所有技能冷却完毕 */
    (function addCDCommandHandler() {
        var handle = function(command, callback) {
            if (command.cmd.indexOf("@cd") != 0) {
                callback(command, CommandHandleStatus.pass);
                return;
            }
            if (Role.hasCoolingSkill()) {
                callback(command, CommandHandleStatus.defer);
                return;
            }
            callback(command, CommandHandleStatus.over);
        };
        var handler = new CommandHandler(handle, CommandHandlerPriority.ordinary);
        CommandHandlerCenter.addHandler(handler);
    })();

    /* @liaoshang 疗伤直到完成 */
    (function addLiaoShangCommandHandler() {
        var handle = function(command, callback) {
            if (command.cmd.indexOf("@liaoshang") != 0) {
                callback(command, CommandHandleStatus.pass);
                return;
            }
            if (Role.state == RoleState.liaoshang) {
                callback(command, CommandHandleStatus.defer);
                return;
            }
            if (Role.hp/Role.maxHp > 0.99) {
                WG.SendCmd("stopstate");
                callback(command, CommandHandleStatus.over);
                return;
            }
            WG.SendCmd("stopstate;liaoshang");
            callback(command, CommandHandleStatus.defer);
            return;
        };
        var handler = new CommandHandler(handle, CommandHandlerPriority.ordinary);
        CommandHandlerCenter.addHandler(handler);
    })();

    /* @dazuo 打坐直到完成 */
    (function addDazuoCommandHandler() {
        var handle = function(command, callback) {
            if (command.cmd.indexOf("@dazuo") != 0) {
                callback(command, CommandHandleStatus.pass);
                return;
            }
            if (Role.state == RoleState.dazuo) {
                callback(command, CommandHandleStatus.defer);
                return;
            }
            if (Role.mp/Role.maxMp > 0.99) {
                WG.SendCmd("stopstate");
                callback(command, CommandHandleStatus.over);
                return;
            }
            WG.SendCmd("stopstate;dazuo");
            callback(command, CommandHandleStatus.defer);
            return;
        };
        var handler = new CommandHandler(handle, CommandHandlerPriority.ordinary);
        CommandHandlerCenter.addHandler(handler);
    })();

    /* @eq 装备id1,装备id2 多个装备用,分隔 */
    (function addEqCommandHandler() {
        var handle = function(command, callback) {
            if (command.cmd.indexOf("@eq ") != 0) {
                callback(command, CommandHandleStatus.pass);
                return;
            }
            var exp = command.cmd.substring(4);
            var eqIds = exp.split(",");
            var cmds = [];
            for (let i = 0; i < eqIds.length; i++) {
                const eqId = eqIds[i];
                if (!Role.wearing(eqId)) {
                    var cmd = "eq " + eqId;
                    cmds.push(cmd);
                }
            }
            if (cmds.length > 0) {
                WG.SendCmd("stopstate;" + cmds.join(";"));
                callback(command, CommandHandleStatus.defer);
                return;
            }
            callback(command, CommandHandleStatus.over);
        };
        var handler = new CommandHandler(handle, CommandHandlerPriority.ordinary);
        CommandHandlerCenter.addHandler(handler);
    })();

    /* @tip 文本 */
    /* @tip 你数了下大概有($number)朵花 */
    (function addTipCommandHandler() {
        var handle = function(command, callback) {
            if (command.cmd.indexOf("@tip ") != 0) {
                callback(command, CommandHandleStatus.pass);
                return;
            }
            var expression = command.cmd.substring(5);
            var placeholders = [];
            var patt = /\(\$[a-zA-Z0-9_]+?\)/g;
            var result = patt.exec(expression);
            while(result != null) {
                placeholders.push(result[0]);
                result = patt.exec(expression);
            }
            var regex = expression;
            for (let i = 0; i < placeholders.length; i++) {
                const placeholder = placeholders[i];
                regex = regex.replace(placeholder, "(.+?)");
            }
            var result2 = SystemTips.search(regex, command.lastCommandStartTimestamp());
            if (result2 == null) {
                callback(command, CommandHandleStatus.defer);
                return;
            }
            for (let j = 0; j < placeholders.length; j++) {
                const placeholder = placeholders[j];
                var key = placeholder.substring(2, placeholder.length - 1);
                var value = result2[j + 1];
                if (value != null) command.updateParam(key, value);
            }
            callback(command, CommandHandleStatus.over);
        };
        var handler = new CommandHandler(handle, CommandHandlerPriority.ordinary);
        CommandHandlerCenter.addHandler(handler);
    })();

    /* @kill 敌人1名字,敌人2名字 
     * 默认模糊查找，名字后面添加 % 表示需要完全吻合 */
    (function addKillCommandHandler() {
        var handle = function(command, callback) {
            if (command.cmd.indexOf("@kill ") != 0) {
                callback(command, CommandHandleStatus.pass);
                return;
            }
            var exp = command.cmd.substring(6);
            var parts = exp.split(",");
            var infos = [];
            for (let i = 0; i < parts.length; i++) {
                var name = parts[i];
                var blurry = true;
                if (name.substring(name.length - 1) == "%") {
                    name = name.substring(0, name.length - 1);
                    blurry = false;
                }
                infos.push({name: name, blurry: blurry});
            }
            var finish = Room.didKillItemsInRoom(infos);
            if (finish) {
                callback(command, CommandHandleStatus.over);
            } else {
                var cmd = "";
                infos.forEach(info => {
                    var itemId = Room.getItemId(info.name, info.blurry);
                    if (itemId != null) {
                        cmd += "kill " + itemId + ";";
                    }
                });
                WG.SendCmd(cmd);
                callback(command, CommandHandleStatus.defer);
            }
        };
        var handler = new CommandHandler(handle, CommandHandlerPriority.ordinary);
        CommandHandlerCenter.addHandler(handler);
    })();

    /* @tidyBag 整理背包 */
    (function addTidyBagCommandHandler() {
        var handle = function(command, callback) {
            if (command.cmd.indexOf("@tidyBag") != 0) {
                callback(command, CommandHandleStatus.pass);
                return;
            }
            if (command.__doing == null) {
                command.__doing = true;
                Role.tidyBag(function() {
                    command.__doing = false;
                });
                callback(command, CommandHandleStatus.defer);
                return;
            }
            if (command.__doing == true) {
                callback(command, CommandHandleStatus.defer);
                return;
            }
            delete command.__doing;
            callback(command, CommandHandleStatus.over);
        };
        var handler = new CommandHandler(handle, CommandHandlerPriority.ordinary);
        CommandHandlerCenter.addHandler(handler);
    })();

    /* @shimen 只能进行可放弃的师门任务 */
    (function addShimenCommandHandler() {
        var handle = function(command, callback) {
            if (command.cmd.indexOf("@shimen") != 0) {
                callback(command, CommandHandleStatus.pass);
                return;
            }
            if (command.__doing == null) {
                command.__doing = true;
                Role.shimen(function() {
                    command.__doing = false;
                });
                callback(command, CommandHandleStatus.defer);
                return;
            }
            if (command.__doing == true) {
                callback(command, CommandHandleStatus.defer);
                return;
            }
            delete command.__doing;
            callback(command, CommandHandleStatus.over);
        };
        var handler = new CommandHandler(handle, CommandHandlerPriority.ordinary);
        CommandHandlerCenter.addHandler(handler);
    })();

    /* @renew 前往武庙回满状态 */
    (function addRenewCommandHandler() {
        var handle = function(command, callback) {
            if (command.cmd.indexOf("@renew") != 0) {
                callback(command, CommandHandleStatus.pass);
                return;
            }
            if (command.__doing == null) {
                command.__doing = true;
                Role.renew(function() {
                    command.__doing = false;
                });
                callback(command, CommandHandleStatus.defer);
                return;
            }
            if (command.__doing == true) {
                callback(command, CommandHandleStatus.defer);
                return;
            }
            delete command.__doing;
            callback(command, CommandHandleStatus.over);
        };
        var handler = new CommandHandler(handle, CommandHandlerPriority.ordinary);
        CommandHandlerCenter.addHandler(handler);
    })();

    //---------------------------------------------------------------------------
    //  Abbreviation
    //---------------------------------------------------------------------------

    AbbreviationCenter.register("&raidLiaoshang", "#[(:hpPer)<(:DungeonHpThreshold)]@liaoshang");
    AbbreviationCenter.register("&raidCD", "[(:DungeonWaitSkillCD)==true]@cd");

    //---------------------------------------------------------------------------
    //  Workflow Config
    //---------------------------------------------------------------------------

    var CmdGroupManager = {
        /**
         * @returns {{ id: number, name: string }[]}
         */
        getAll: function() {
            var result = [];
            GM_listValues().map(function (key) {
                if (key.indexOf(CmdGroupManager._prefix) == 0) {
                    var id = CmdGroupManager._id(key);
                    var name = CmdGroupManager.getName(id);
                    result.push({ id: id, name: name });
                }
            });
            return result;
        },
        getName: function(id) {
            var value = GM_getValue(this._key(id));
            if (value == null) return null;
            var obj = JSON.parse(value);
            return obj.name;
        },
        getCmdsText: function(id) {
            var value = GM_getValue(this._key(id));
            if (value == null) return "";
            var obj = JSON.parse(value);
            var cmdsStr = obj.cmdsStr;
            return cmdsStr;
        },
        /**
         * @returns {string[]}
         */
        getCmds: function(id) {
            var text = this.getCmdsText(id);
            var cmds = text.split(/^\s*|\s*\n+\s*/g);
            var first = cmds[0];
            if (first != null && first.length == 0) {
                cmds.splice(0, 1);
            }
            var last = cmds[cmds.length - 1];
            if (last != null && last.length == 0) {
                cmds.splice(cmds.length - 1, 1);
            }
            return cmds;
        },
        createCmdGroup: function(name, cmdsStr) {
            var id = new Date().getTime();
            return this.updateCmdGroup(id, name, cmdsStr);
        },
        updateCmdGroup: function(id, name, cmdsStr) {
            if (name == null || !/\S+/g.test(name)) {
                alert("命令组想要一个名字...");
                return false;
            }
            if (cmdsStr == null || !/\S+/g.test(cmdsStr)) {
                alert("命令组不想没有任何内容...");
                return false;
            }
            // 存储格式
            var value = {
                name: name,
                cmdsStr: cmdsStr
            };
            GM_setValue(this._key(id), JSON.stringify(value));
            return true;
        },
        removeCmdGroup: function(id) {
            GM_deleteValue(this._key(id));
        },

        _prefix: "@cmdgroup",
        _key: function(id) {
            return this._prefix + id;
        },
        _id: function(key) {
            return parseInt(key.substring(this._prefix.length));
        }
    };

    var WorkflowConfigManager = {
        /**
         * @returns {{ id: number, name: string }[]}
         */
        getAll: function() {
            var result = [];
            GM_listValues().map(function (key) {
                if (WorkflowConfigManager._isMyKey(key)) {
                    var id = WorkflowConfigManager._id(key);
                    var name = WorkflowConfigManager.getName(id);
                    result.push({ id: id, name: name });
                }
            });
            return result;
        },
        getName: function(id) {
            var value = GM_getValue(this._key(id));
            if (value == null) return null;
            var obj = JSON.parse(value);
            return obj.name;
        },
        /**
         * @returns {{ id: number, repeat: number }[]}
         */
        getCmdGroupInfos: function(id) {
            var value = GM_getValue(this._key(id));
            if (value == null) return null;
            var obj = JSON.parse(value);
            return obj.infos;
        },
        /**
         * @returns {Workflow}
         */
        getWorkflow: function(id) {
            var cmdGroupInfos = this.getCmdGroupInfos(id);
            var items = [];
            for (const info of cmdGroupInfos) {
                var name = CmdGroupManager.getName(info.id);
                var cmds = CmdGroupManager.getCmds(info.id);
                var commandWorkflow = new CommandWorkflow(name, cmds, info.repeat, 1000, 1000);
                items.push(commandWorkflow);
            }
            var workflow = new Workflow(this.getName(id), items, 1, 1000);
            return workflow;
        },
        /**
         * @param {string} name 
         * @param {{ id: string, repeat: number }[]} cmdGroupInfos 
         */
        createWorkflowConfig: function(name, cmdGroupInfos) {
            var id = new Date().getTime();
            return this.updateWorkflowConfig(id, name, cmdGroupInfos);
        },
        /**
         * @param {number} id 
         * @param {string} name 
         * @param {{ id: string, repeat: number }[]} cmdGroupInfos 
         */
        updateWorkflowConfig: function(id, name, cmdGroupInfos) {
            if (name == null || !/\S+/g.test(name)) {
                alert("工作流想要一个名字...");
                return false;
            }
            if (cmdGroupInfos == null || cmdGroupInfos.length <= 0) {
                alert("工作流不想没有任何内容...");
                return false;
            }
            // 存储格式
            var value = {
                name: name,
                infos: cmdGroupInfos
            };
            GM_setValue(this._key(id), JSON.stringify(value));
            return true;
        },
        removeWorkflowConfig: function(id) {
            GM_deleteValue(this._key(id));
        },
        
        _prefix: "workflow@",
        _isMyKey: function(key) {
            return key.indexOf(this._prefix + Role.id) == 0;
        },
        _key: function(id) {
            return this._prefix + Role.id + id;
        },
        _id: function(key) {
            return parseInt(key.substring((this._prefix + Role.id).length));
        }
    };

    //---------------------------------------------------------------------------
    //  WSMUD
    //---------------------------------------------------------------------------

    var WG = null;
    var messageAppend = null;
    var messageClear = null;
    var T = null;

    var RoleState = {
        none: "发呆",
        liaoshang: "疗伤",
        dazuo: "打坐",
        wakuang: "挖矿",
        gongzuo: "工作",
        lianxi: "练习",
        xuexi: "学习",
    };

    var Role = {
        id: null,
        name: null,

        hp: 0,
        maxHp: 0,
        mp: 0,
        maxMp: 0,

        status: [],
        equipments: [],
        items: {}, // {id: object}
        stores: {}, // {id: object}

        kongfu: {
            quan: null,
            nei: null,
            zhao: null,
            qing: null,
            jian: null,
            dao: null,
            gun: null,
            zhang: null,
            bian: null,
            an: null
        },

        init: function() {
            WG.add_hook("login", function(data) {
                Role.id = data.id;
                Role.status = [];
                // setTimeout(function() { $("span[command=skills]").click(); }, 2000); // 查看装备技能
                if (GM_getValue("raid_alert_1_0_12", null) == null) {
                    GM_setValue("raid_alert_1_0_12", true);
                    setTimeout(function() {
                        var sure = confirm("[wsmud_Raid]🚨 请在流程前添加 @stopSSAuto 语句以关闭 pluginss 的自动 Boss 和婚宴，详情请前往论坛了解!");
                        if (sure) {
                            window.open("https://greasyfork.org/zh-CN/forum/discussion/50090", '_blank').location;
                        }
                    }, 2000);
                }
            });
            $("li[command=SelectRole]").on("click", function () {
                Role.name = $('.role-list .select').text().replace(/[\s]+/,".");
            });
            Role._monitorHpMp();
            Role._monitorStatus();
            Role._monitorState();
            Role._monitorDeath();
            Role._monitorEquipments();
            Role._monitorSkillCD();
            Role._monitorSkills();
            Role._monitorItems();
            Role._monitorCombat();
        },

        hasStatus: function(s) {
            return Role.status.indexOf(s) != -1;
        },
        isFree: function() {
            return !Role.hasStatus("busy") && !Role.hasStatus("faint") && !Role.hasStatus("rash");
        },

        state: RoleState.none,

        wearing: function(eqId) {
            return this.equipments.indexOf(eqId) != -1;
        },

        living: true,

        combating: false,

        shimen: function(callback) {
            var timestamp = new Date().getTime();
            Role._shimen(0, timestamp, callback);
        },

        atPath: function(p) {
            switch (arguments.length) {
            case 0:
                return Room.path;
            case 1:
                return p == Room.path;
            }
        },
        inRoom: function(n) {
            switch (arguments.length) {
            case 0:
                return Room.name;
            case 1:
                return n == Room.name;
            }
        },

        /**
         * @param {string} itemName 
         * @param {Boolean} blurry
         * @param {string} [quality] white(w), green(g), blue(b), yellow(y), purple(p), orange(o), red(r)
         */
        rummage: function(itemName, blurry, quality) {
            var pattStr = blurry ? itemName : "^" + itemName + "$";
            if (/<[a-z]{3}>.+<\/[a-z]{3}>/g.test(itemName)) {
                pattStr = "^" + itemName + "$";
            } else if (quality != null) {
                var map = {
                    "white": "wht",
                    "w": "wht",
                    "green": "hig",
                    "g": "hig",
                    "blue": "hic",
                    "b": "hic",
                    "yellow": "hiy",
                    "y": "hiy",
                    "purple": "hiz",
                    "p": "hiz",
                    "orange": "hio",
                    "o": "hio",
                    "red": "ord",
                    "r": "ord"
                };
                var tag = map[quality];
                if (tag != null) {
                    if (blurry) {
                        pattStr = "<" + tag + ">.*" + itemName + ".*</" + tag + ">";
                    } else {
                        pattStr = "<" + tag + ">" + itemName + "</" + tag + ">";
                    }
                }
            }
            var patt = new RegExp(pattStr);
            for (const id in Role.items) {
                if (!Role.items.hasOwnProperty(id)) continue;
                var item = Role.items[id];
                if (patt.test(item.name)) return id;
            }
            return null;
        },

        renew: function(callback) {
            var cmds = [
                "stopstate;$to 扬州城-武庙",
                "@liaoshang",
                "($weapon)=(:eq0)",
                "[(:mpPer)<0.7]@dazuo",
                "[(weapon)!=null]@eq (weapon)"
            ];
            var flow = new CommandWorkflow("武庙恢复", cmds, 1, 1000, 500);
            flow.log = false;
            flow.setCallback(callback);
            flow.run();
        },

        cleanBag: function(callback) {
            WG.clean_all();
            if (callback) callback();
        },

        tidyBag: function(callback) {
            Role._tidyBag(0, callback);
        },

        getDressed: function(equipments) {
            for (var i = equipments.length - 1; i >= 0; i--) {
                var e = equipments[i];
                if (e == null) {
                    WG.SendCmd("uneq " + Role.equipments[i]);
                } else {
                    WG.SendCmd("eq " + e);
                }
            }
        },

        hasCoolingSkill: function() {
            return Role._coolingSkills.length > 0;
        },

        _renewHookIndex: null,
        _renewStatus: "resting",

        _coolingSkills: [],

        _shimen: function(counter, timestamp, callback) {
            if (counter == 0) {
                WG.SendCmd("stopstate");
                WG.sm_button();
            }
            var result = SystemTips.search("你先去休息|和本门毫无瓜葛|你没有", timestamp);
            if (result != null) { callback(); return; }
            setTimeout(function() { Role._shimen(counter + 1, timestamp, callback) }, 1000);
        },

        _tidyBag: function(counter, callback) {
            if (counter == 0) WG.sell_all();

            if (!WG.packup_listener) {
                window.setTimeout(callback, 1000);
                return;
            }
            if (counter > 5) {
                if (WG.packup_listener) WG.sell_all();
                callback();
                return;
            }
            window.setTimeout(function() { Role._tidyBag(counter + 1, callback); }, 1000);
        },

        _monitorHpMp: function() {
            WG.add_hook(["items", "sc", "itemadd"], function(data) {
                switch (data.type) {
                case "items":
                    if (data.items == null) break;
                    for (var i = data.items.length - 1; i >= 0; i--) {
                        var item = data.items[i];
                        if (item.id == Role.id) {
                            Role.hp = item.hp;
                            Role.maxHp = item.max_hp;
                            Role.mp = item.mp;
                            Role.maxMp = item.max_mp;
                            break;
                        }
                    }
                    break;
                case "itemadd":
                case "sc":
                    if (data.id != Role.id) break;
                    if (data.hp != null) Role.hp = data.hp;
                    if (data.max_hp != null) Role.maxHp = data.max_hp;
                    if (data.mp != null) Role.mp = data.mp;
                    if (data.max_mp != null) Role.maxMp = data.max_mp;
                    break;
                }
            });
        },
        _monitorStatus: function() {
            WG.add_hook(["items", "status", "itemadd"], function(data) {
                switch (data.type) {
                case "items":
                    if (data.items == null) break;
                    for (var i = data.items.length - 1; i >= 0; i--) {
                        var item = data.items[i];
                        if (item.id != Role.id) continue;
                        if (item.status == null) break;
                        Role.status = [];
                        for (var j = item.status.length - 1; j >= 0; j--) {
                            var s = item.status[j];
                            Role.status.push(s.sid);
                        }
                        break;
                    }
                    break;
                case "status":
                    if (data.id != Role.id) break;
                    if (data.action == "add") {
                        Role.status.push(data.sid);
                    } else if (data.action == "remove") {
                        var index = Role.status.indexOf(data.sid);
                        if (index == -1) return;
                        Role.status.splice(index,1);
                    }
                    break;
                case "itemadd":
                    if (data.id != Role.id) break;
                    if (data.status == null) break;
                    Role.status = [];
                    for (var k = data.status.length - 1; k >= 0; k--) {
                        var s1 = data.status[k];
                        Role.status.push(s1.sid);
                    }
                    break;
                }
            });
        },
        _monitorState: function() {
            WG.add_hook("state", function(data) {
                var text = data.state;
                if (text == null) {
                    Role.state = RoleState.none;
                    return;
                }
                for (const key in RoleState) {
                    if (!RoleState.hasOwnProperty(key)) continue;
                    const keyword = RoleState[key];
                    if (text.indexOf(keyword) != -1) {
                        Role.state = keyword;
                        return;
                    }
                }
                Role.state = RoleState.none;
            });
        },
        _monitorDeath: function() {
            WG.add_hook("die", function(data) {
                if (data.relive == true) {
                    Role.living = true;
                } else {
                    Role.living = false;
                }
            });
        },
        _monitorEquipments: function() {
            WG.add_hook("dialog", function(data) {
                if (data.dialog != "pack") return;
                if (data.eqs != null) {
                    for (var i = 0; i < data.eqs.length; i++) {
                        var eq = data.eqs[i];
                        if (eq != null && eq.id != null) {
                            Role.equipments.push(eq.id);
                        } else {
                            Role.equipments.push(null);
                        }
                    }
                } else if (data.uneq != null) {
                    Role.equipments[data.uneq] = null;
                } else if (data.eq != null) {
                    Role.equipments[data.eq] = data.id;
                } else {
                    return;
                }
            });
        },
        _monitorItems: function() {
            WG.add_hook("dialog", function(data) {
                if (data.dialog == null) return;
                if (data.dialog == "pack") {
                    if (data.items != null) {
                        Role.items = {};
                        for (const item of data.items) {
                            if (item.id) Role.items[item.id] = item;
                        }
                    } else if (data.id != null) {
                        if (data.remove == null) {
                            Role.items[data.id] = data;
                            return;
                        }
                        var item = Role.items[data.id];
                        item.count -= data.remove;
                        if (item.count == 0) delete Role.items[data.id];
                    }
                }
                if (data.dialog == "list") {
                    if (data.stores != null) {
                        Role.stores = {};
                        for (const item of data.stores) {
                            if (item.id) Role.stores[item.id] = item;
                        }
                    } else if (data.id != null && data.storeid != null && data.store != null) {
                        var item = Role.items[data.id];
                        var store = Role.stores[data.storeid];
                        if (item == null) {
                            item = Object.assign({}, store, {count: 0});
                            Role.items[item.id] = item;
                        }
                        if (store == null) {
                            store = Object.assign({}, item, {count: 0});
                            Role.stores[store.id] = store;
                        }
                        item.count -= data.store;
                        store.count += data.store;
                        if (item.count <= 0) delete Role.items[data.id];
                        if (store.count <= 0) delete Role.stores[data.storeid];
                    }
                }
            });
        },
        _monitorSkillCD: function() {
            WG.add_hook("dispfm", function(data) {
                var timestamp = Date.parse(new Date());
                var mark = data.id + "_" + timestamp;
                Role._coolingSkills.push(mark);
                window.setTimeout(function() {
                    var index = Role._coolingSkills.indexOf(mark);
                    if (index != -1) Role._coolingSkills.splice(index, 1);
                }, data.distime);
            });
        },
        _monitorSkills: function() {
            var action = function(id, value) {
                switch (id) {
                    case "unarmed":
                    Role.kongfu.quan = value; break;
                    case "force":
                    Role.kongfu.nei = value; break;
                    case "parry":
                    Role.kongfu.zhang = value; break;
                    case "dodge":
                    Role.kongfu.qing = value; break;
                    case "sword":
                    Role.kongfu.jian = value; break;
                    case "blade":
                    Role.kongfu.dao = value; break;
                    case "club":
                    Role.kongfu.gun = value; break;
                    case "whip":
                    Role.kongfu.bian = value; break;
                    case "throwing":
                    Role.kongfu.an = value; break;
                    default: 
                    break;
                }
            };
            WG.add_hook("dialog", function(data) {
                if (data.dialog == null || data.dialog != "skills") return;
                if (data.items != null) {
                    for (const item of data.items) {
                        var value = item.enable_skill ? item.enable_skill : null;
                        action(item.id, value);
                    }
                }
                if (data.id != null && data.enable != null) {
                    var value = data.enable;
                    if (value == false) value = "none";
                    action(data.id, value);
                }
            });
        },
        _monitorCombat: function() {
            WG.add_hook("combat", function(data) {
                if (data.start != null && data.start == 1) {
                    Role.combating = true;
                } else if (data.end != null && data.end == 1) {
                    Role.combating = false;
                }
            });
        }
    };

    var Room = {
        name: null,
        path: null,

        itemsInRoom: [],

        updateTimestamp: null,

        init: function() {
            this._monitorLocation();
            this._monitorItemsInRoom();
            this._monitorDeath();
        },
        getItemId: function(name, blurry) {
            Debug.print(this.itemsInRoom);
            for (var i = 0; i < Room.itemsInRoom.length; i++) {
                var item = Room.itemsInRoom[i];
                if (blurry == true) {
                    if (item.name.indexOf(name) != -1) {
                        return item.id;
                    }
                } else {
                    if (item.name == name) {
                        return item.id;
                    }
                }
            }
            return null;
        },
        /**
         * @param {{name: string, blurry: Boolean}[]} itemNameInfos
         * @returns {Boolean}
         */
        didKillItemsInRoom: function(itemNameInfos) {
            var deadItems = this._deadItemsInRoom.slice();
            for (let i = 0; i < itemNameInfos.length; i++) {
                const info = itemNameInfos[i];
                var found = false;
                for (let j = 0; j < deadItems.length; j++) {
                    const deadItem = deadItems[j];
                    if (info.blurry == true) {
                        if (deadItem.name.indexOf(info.name) != -1) found = true;
                    } else {
                        if (deadItem.name == info.name) found = true;
                    }
                    if (found) {
                        deadItems.splice(j, 1);
                        break;
                    }
                }
                if (!found) return false;
            }
            return true;
        },

        _deadItemsInRoom: [],

        _monitorLocation: function() {
            WG.add_hook("room", function(data) {
                Room.name = data.name;
                Room.path = data.path;
                Room.updateTimestamp = new Date().getTime();
                Room.itemsInRoom = [];
                Room._deadItemsInRoom = [];
            });
        },
        _monitorItemsInRoom: function() {
            WG.add_hook(["items", "itemadd", "itemremove"], function(data) {
                switch (data.type) {
                case "items":
                    if (data.items == null) break;
                    for (var i = 0; i < data.items.length; i++) {
                        var item = data.items[i];
                        if (item.name == null || item.id == null) continue;
                        Room.itemsInRoom.push(item);
                    }
                    break;
                case "itemadd":
                    if (data.name == null || data.id == null) break;
                    Room.itemsInRoom.push(data);
                    break;
                case "itemremove":
                    for (var j = 0; j < Room.itemsInRoom.length; j++) {
                        var item1 = Room.itemsInRoom[j];
                        if (item1.id == data.id) {
                            Room.itemsInRoom.splice(j, 1);
                            return;
                        }
                    }
                    break;
                }
            });
        },
        _monitorDeath: function() {
            WG.add_hook("sc", function(data) {
                if (data.id == null|| data.hp == null || data.hp != 0) return;
                for (let i = 0; i < Room.itemsInRoom.length; i++) {
                    const item = Room.itemsInRoom[i];
                    if (item.id == data.id) {
                        Room._deadItemsInRoom.push(item);
                        return;
                    }
                }
            });
        }
    };

    class SystemTip {
        constructor(text) {
            this.timestamp = new Date().getTime();
            this.text = text;
        }
    }

    var SystemTips = {
        init: function() {
            this._monitorSystemTips();
        },
        search: function(regex, from) {
            var patt = new RegExp(regex);
            var tips = this._tips.slice();
            for (let index = tips.length - 1; index >= 0; index--) {
                const tip = tips[index];
                if (tip.timestamp < from) break;
                var result = patt.exec(tip.text);
                if (result) return result;
            }
            return null;
        },
        clean: function(to) {
            while(true) {
                if (this._tips.length <= 0) break;
                var tip = this._tips[0];
                if (tip.timestamp > to) break;
                this._tips.shift();
            }
        },

        _monitorSystemTips: function() {
            var theSelf = this;
            WG.add_hook("text", function(data) {
                var tip = new SystemTip(data.msg);
                theSelf._push(tip);
            });
            WG.add_hook("item", function(data) {
                var desc = data.desc;
                if (desc == null) return;
                var tip = new SystemTip(desc);
                theSelf._push(tip);
            });
        },
        _push: function(tip) {
            if (this._tips.length >= this._maxCapacity) {
                this._tips.shift();
            }
            this._tips.push(tip);
        },

        _tips: [],
        _maxCapacity: 100,
    };

    //---------------------------------------------------------------------------
    //  Preset Config
    //---------------------------------------------------------------------------

    var Config = {
        hpThresholdInDungeon: function() {
            return GM_getValue(Role.id + "@hpThresholdInRaid", "50");
        },
        setHpThresholdInDungeon: function(value) {
            GM_setValue(Role.id + "@hpThresholdInRaid", value);
        },
        waitSkillCD: function() {
            return GM_getValue(Role.id + "@waitSkillCD", "no");
        },
        /**
         * @param {string} value yes, no
         */
        setWaitSkillCD: function(value) {
            GM_setValue(Role.id + "@waitSkillCD", value);
        },
        /**
         * @returns {string} none, clean, tidy
         */
        bagCleanWay: function() {
            return GM_getValue(Role.id + "@bagCleanWay", "clean");
        },
        setBagCleanWay: function(value) {
            GM_setValue(Role.id + "@bagCleanWay", value);
        },
    };

    //---------------------------------------------------------------------------
    //  Dungeon Config
    //---------------------------------------------------------------------------

    var DungeonConfig = {
        "财主家": {
            "简单": {
                number: 21,
                cmds: [
                    "jh fb 1 start1;cr yz/cuifu/caizhu",
                    "@kill 大狼狗,大狼狗",
                    "go north",
                    "@kill 管家,家丁,家丁",
                    "&raidCD",
                    "go north",
                    "@kill 崔员外",
                    "($open)=没开",
                    "look men;open men;go east",
                    "@tip 你不会撬锁|钥匙($open)了秘门",
                    "[(open)=打开]go east;ok {丫鬟}",
                    "[(open)=打开]go west;go south;go south",
                    "[(open)=打开]go north;go north;go west",
                    "[(open)=没开]go west",
                    "select {崔莺莺};ask {崔莺莺} about 东厢",
                    "@kill 崔莺莺",
                    "[(open)=打开]go east;go east;look gui;search gui"
                ],
            },
            "困难": {
                number: 22,
                cmds: [
                    "jh fb 1 start2;cr yz/cuifu/caizhu 1 0",
                    "@kill 大狼狗,大狼狗",
                    "go north",
                    "@kill 管家,家丁,家丁",
                    "&raidCD",
                    "go north",
                    "@kill 崔员外",
                    "($open)=没开",
                    "look men;open men;go east",
                    "@tip 你不会撬锁|钥匙($open)了秘门",
                    "[(open)=打开]go east;ok {丫鬟}",
                    "[(open)=打开]go west;go south;go south",
                    "[(open)=打开]go north;go north;go west",
                    "[(open)=没开]go west",
                    "select {崔莺莺};ask {崔莺莺} about 东厢",
                    "@kill 崔莺莺",
                    "[(open)=打开]go east;go east;look gui;search gui"
                ],
            }
        },
        "温府": {
            ">2k闪避": {
                number: 103,
                description: "👏 <hiy>感谢 JiaQi Wan 提供本副本代码。</hiy>",
                cmds: [
                    "jh fb 23 start2;cr cd/wen/damen",
                    "look tree;climb tree;go north;go northeast;go north;go north;go northwest;go north",
                    "look zhuang;tiao zhuang",
                    "@kill 温方义,温方山,温方施,温方南,温方达",
                    "&raidCD",
                    "look zhuang;tiao zhuang",
                    "@kill 夏雪宜",
                    "go north",
                    "@kill 温仪"
                ],
            }
        },
        "衡山": {
            "shared": {
                number: 140,
                cmds: [
                    "jh fb 14 start1;cr wuyue/henshan/hengyang",
                    "go west;go north",
                    "@kill 嵩山弟子,嵩山弟子",
                    "go north;go north",
                    "@kill 费彬",
                    "@kill 史登达,丁勉",
                    "@kill 刘正风",
                    "go south[3];go west[2]",
                    "@kill 曲洋,曲非烟",
                    "go east[4];go southeast;go south;go east;go south",
                    "@kill 莫大"
                ]
            }
        },
        "白驼山": {
            "组队": {
                number: 193,
                cmds: [
                    "jh fb 19 start3;cr baituo/damen 2 0",
                    "&raidCD",
                    "go north[4]",
                    "@kill 欧阳锋",
                    "&raidCD",
                    "go south",
                    "@kill 欧阳克,白衣少女",
                    "go south[2];go west[3]",
                    "@kill 毒蛇",
                    "go north",
                    "@kill 毒蛇",
                    "go north;go north",
                    "@kill 蟒蛇"
                ],
            },
        },

        "五毒教": {
            "组队": {
                number: 20,
                cmds: [
                    "jh fb 11 start3;cr cd/wudu/damen 2 0",
                    "@kill 五毒教徒,五毒教徒,五毒教徒,五毒教徒",
                    "go east",
                    "@kill 黑龙 沙千里",
                    "go south",
                    "@kill 藏獒",
                    "go west",
                    "@kill 毒叟 白髯老者",
                    "go east;go south",
                    "@kill 毒郎中",
                    "go north;go north;go east#",
                    "@kill 五毒教护法 笑面阎罗 潘秀达,五毒教护法 五毒秀士 岑其斯,五毒教长老 锦衣毒丐 齐云敖",
                    "go east#",
                    "@kill 五毒教长老 疤面丐婆 何红药",
                    "go east",
                    "@kill <hig>五毒仙子</hig> 何铁手"
                ],
            }
        },

        "青城": {
            "普通": {
                number: 19,
                cmds: [
                    "jh fb 13 start1;cr wuyue/qingcheng/shanlu",
                    "go westup",
                    "@kill 青城派外门弟子 青城派弟子,青城派外门弟子 青城派弟子",
                    "go north;go northup;go eastup",
                    "@kill 青城派外门弟子 青城派弟子,青城派外门弟子 青城派弟子",
                    "go northup",
                    "@kill 青城派内门弟子 洪人雄",
                    "go north;go north;go north;",
                    "@kill 青城派内门弟子 于人豪",
                    "go north;",
                    "@kill 青城派内门弟子 侯人英,青城派内门弟子 罗人杰",
                    "go south;go east",
                    "@kill 青城派少掌门 余人彦",
                    "go north",
                    "@kill 青城派掌门 余沧海"
                ],
            }
        },

        "衡山自用": {
            "shared": {
                number: 18,
                cmds: [
                    "jh fb 14 start3;cr wuyue/henshan/hengyang",
                    "go west;go north",
                    "@kill 嵩山弟子,嵩山弟子",
                    "go north;go north",
                    "@kill 落雁剑 刘正风",
                    "$getall",
                    "go south",
                    "$getall",
                    "go south;go south;go west;go west",
                    "@kill 日月神教前辈长老 曲洋,古灵精怪 曲非烟",
                    "go east;go east;go east;go east;go southeast;go south;go east;go south",
                    "@kill 潇湘夜雨 莫大"
                ],
            }
        },

        "星宿海": {
            "shared": {
                number: 200,
                cmds: [
                    "jh fb 20 start1;cr xingxiu/xxh6",
                    "go northeast",
                    "@kill 星宿派",
                    "go north",
                    "@kill 星宿派",
                    "go northwest",
                    "@kill 星宿派",
                    "go southwest",
                    "@kill 星宿派",
                    "go south",
                    "@kill 星宿派",
                    "&raidCD",
                    "go north;go northeast;go north",
                    "@kill 丁春秋"
                ],
            },
        },
        "移花宫": {
            "简单": {
                number: 221,
                cmds: [
                    "jh fb 22 start1;cr huashan/yihua/shandao",
                    "go south[7]",
                    "go south[7]",
                    "@kill 花月奴",
                    "go south;go south",
                    "@kill 移花宫女弟子,移花宫女弟子",
                    "go south",
                    "@kill 移花宫女弟子,移花宫女弟子",
                    "&raidCD",
                    "go southeast",
                    "@kill 涟星",
                    "&raidCD",
                    "go northwest;go southwest",
                    "@kill 邀月",
                    "look hua",
                    "@tip 你数了下大概有($number)朵花",
                    "go southeast",
                    "look bed;pushstart bed;pushleft bed[(number)]",
                    "pushright bed[8]",
                    "go down;fire;go west",
                    "@kill 花无缺",
                    "look xia;open xia",
                ],
            },
            "困难": {
                number: 222,
                cmds: [
                    "jh fb 22 start2;cr huashan/yihua/shandao 1 0",
                    "go south[7]",
                    "go south[7]",
                    "@kill 花月奴",
                    "go south;go south",
                    "@kill 移花宫女弟子,移花宫女弟子",
                    "go south",
                    "@kill 移花宫女弟子,移花宫女弟子",
                    "&raidCD",
                    "go southeast",
                    "@kill 涟星,邀月",
                    "go northwest;go southwest",
                    "look hua",
                    "@tip 你数了下大概有($number)朵花",
                    "go southeast",
                    "look bed;pushstart bed;pushleft bed[(number)]",
                    "pushright bed[8]",
                    "go down;fire;go west",
                    "@kill 花无缺",
                    "look xia;open xia",
                ],
            },
        },
        "燕子坞": {
            "简单": {
                number: 231,
                cmds: [
                    "jh fb 23 start1;cr murong/anbian",
                    "go east;go east",
                    "@kill 包不同",
                    "go east;go south;go east;go south;go south",
                    "@kill 王夫人",
                    "go north;go north;go west;go north",
                    "go east;go east;go east",
                    "@kill 慕容复",
                    "go west;go north",
                    "look pai;bai pai[3]",
                    "go north;search",
                    "&raidCD",
                    "go south",
                    "@kill 慕容博"
                ],
            },
            "困难": {
                number: 232,
                cmds: [
                    "jh fb 23 start2;cr murong/anbian 1 0",
                    "go east;go east",
                    "@kill 包不同",
                    "go east;go south;go east;go south;go south",
                    "@kill 王夫人",
                    "go north;go north;go west;go north",
                    "go east;go east;go east",
                    "@kill 慕容复",
                    "go west;go north",
                    "look pai;bai pai[3]",
                    "go north;search",
                    "&raidCD",
                    "go south",
                    "@kill 慕容博"
                ],
            },
            "偷书": {
                number: 233,
                description: "👏 <hiy>感谢 Airson 提供本副本代码。</hiy>",
                cmds: [
                    "jh fb 23 start1;cr murong/anbian",
                    "go east;go east",
                    "@kill 包不同",
                    "go east;go east;go east;go north",
                    "look pai;bai pai[3]",
                    "go north;search",
                ],
            },
        },
        "华山论剑": {
            "shared": {
                number: 300,
                description: "👏 <hiy>感谢 koyodakla、freesunny 对本副本代码提供的帮助。</hiy>",
                cmds: [
                    "jh fb 30 start1;cr huashan/lunjian/leitaixia",
                    "&raidCD",
                    "go up",
                    "@tip 恭喜你战胜了五绝",
                    "jump bi",
                    "get all from {五绝宝箱}"
                ]
            },
        },
    };

    function parseDungeonConfig() {
        var result = [];
        for (var key in DungeonConfig) {
            var value = DungeonConfig[key];
            var count = Object.keys(value).length;
            var shared = value.shared;
            if (shared && count > 1) {
                for (var subkey in value) {
                    if (subkey == "shared") continue;
                    var item = { };
                    for (var sharedKey in shared) {
                        item[sharedKey] = shared[sharedKey];
                    }
                    var subvalue = value[subkey];
                    for (var itemKey in subvalue) {
                        item[itemKey] = subvalue[itemKey];
                    }
                    item.name = key + "(" + subkey + ")";
                    result.push(item);
                }
            } else if (shared && count == 1) {
                shared.name = key;
                result.push(shared);
            } else if (count > 0) {
                for (var subkey1 in value) {
                    var item1 = { };
                    var subvalue1 = value[subkey1];
                    for (var itemKey1 in subvalue1) {
                        item1[itemKey1] = subvalue1[itemKey1];
                    }
                    item1.name = key + "(" + subkey1 + ")";
                    result.push(item1);
                }
            }
        }
        result.sort(function(a, b) {
            return b.number - a.number;
        });
        return result;
    }

    var Raid = {
        repeatRun: function(config) {
            let num = prompt("输入自动【" + config.name + "】副本次数,例如:\"1\"", '1');
            if (!(num > 0)) return;

            var prepareCmds = ["@stopSSAuto", "@renew", "[(:DungeonBagCleanWay)==clean]$cleanall", "[(:DungeonBagCleanWay)==tidy]@tidyBag"];
            var prepare = new CommandWorkflow("准备自动副本", prepareCmds, 1);

            var raidCmds = ["&raidLiaoshang"];
            config.cmds.forEach(cmd => {
                raidCmds.push(cmd);
            });
            raidCmds.push(
                "cr;cr over",
                "[(:DungeonBagCleanWay)==clean]$cleanall",
                "[(:DungeonBagCleanWay)==tidy]@tidyBag",
                "@renew"
            );
            var raid = new CommandWorkflow(config.name, raidCmds, num, 1000);

            var end = new CommandWorkflow("通用结束", ["stopstate;$to 练功房;dazuo", "@recoverSSAuto"], 1);
            
            var name = "自动 " + config.name + " " + num + " 次";
            var workflow = new Workflow(name, [prepare, raid, end]);
            workflow.run();
        },
        repeatRunByName: function(name) {
            var parsedDungeonConfig = parseDungeonConfig();
            for (const config of parsedDungeonConfig) {
                if (config.name == name) {
                    Raid.repeatRun(config);
                    return;
                }
            }
        }
    };

    //---------------------------------------------------------------------------
    //  UI
    //---------------------------------------------------------------------------

    var HighlightedRaids = [];

    var MoreRaid = new Vue({
        el: '#MoreRaid',
        methods: {
            getItems: function() {
                var result = [];
                var parsedDungeonConfig = parseDungeonConfig();
                for (var i = 0; i < parsedDungeonConfig.length; i++) {
                    var config = parsedDungeonConfig[i];
                    if (HighlightedRaids.indexOf(config.name) != -1) continue;
                    result.push(config);
                }
                return result;
            },
            createSpan: function(createElement, item) {
                var properties = {
                    attrs: { class: "zdy-item" },
                    style: { width: "120px" },
                    on: { click: function() { Raid.repeatRun(item); } },
                };
                return createElement('span', properties, item.name);
            },
        },
        render: function(createElement) {
            var items = this.getItems();
            var theSelf = this;
            var spans = items.map(function(item) {
                return theSelf.createSpan(createElement, item);
            });
            return createElement(
                "div",
                { attrs: { class: "item-commands" } },
                spans
            );
        }
    });

    var CustomWorkflows = new Vue({
        el: "#CustomWorkflows",
        methods: {
            getItems: function() {
                var items = WorkflowConfigManager.getAll();
                items.push({id: "addWorkflow", name: "新增流程"});
                return items;
            },
            createSpan: function(createElement, item) {
                var properties = {
                    attrs: { class: "zdy-item" },
                    style: { width: "120px" },
                    on: { click: function() {
                        if (item.id == "addWorkflow") {
                            UI.createWorkflow();
                        }
                    }},
                };
                var play = function() {
                    var workflow = WorkflowConfigManager.getWorkflow(item.id);
                    workflow.run();
                };
                var playProperties = {
                    style: {width: "30px", float: "left", "background-color": "#53f153"},
                    on: { click: play }
                };
                var playNode = createElement("div", playProperties, "▶");
                var addNode = createElement("div", { style: {width: "30px", float: "left" } }, "+");
                var edit = function() { if (item.id != "addWorkflow") UI.modifyWorkflow(item.id); };
                var mainProperties = {
                    attrs: { class: "breakText" },
                    style: {width: "85px", float: "right"},
                    on: { click: edit }
                };
                var main = createElement("div", mainProperties, item.name);
                if (item.id == "addWorkflow") return createElement("span", properties, [addNode, main]);
                return createElement("span", properties, [playNode, main]);
            },
        },
        render: function(createElement) {
            var items = this.getItems();
            var theSelf = this;
            var spans = items.map(function(item) {
                return theSelf.createSpan(createElement, item);
            });
            var style = createElement("style", ".breakText {word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}");
            spans.push(style);
            return createElement(
                "div",
                { attrs: { class: "item-commands" } },
                spans
            );
        }
    });

    var EditWorkflow = new Vue({
        el: "#EditWorkflow",
        data: { infos: [] },
        methods: {
            getValidInfos: function() {
                var result = [];
                for (const info of this.infos) {
                    if (info.id == -1) continue;
                    result.push(info);
                }
                return result;
            },
            createAddButton: function(createElement) {
                var theSelf = EditWorkflow;
                var addAction = function(event) {
                    if (event.target.id != "add_cmd_group_987") return;
                    var lastInfo = theSelf.infos[theSelf.infos.length - 1];
                    if (lastInfo != null && lastInfo.id == -1) return;
                    var info = { id: -1, repeat: 1 };
                    theSelf.infos.push(info);
                    theSelf.$forceUpdate();
                };
                var properties = {
                    attrs: { class: "zdy-item" , id: "add_cmd_group_987"},
                    style: { width: "120px" },
                    on: { click: addAction }
                };
                var addButton = createElement("span", properties, "+ 添加命令组");
                return addButton;
            },
            createSpan: function(createElement, index) {
                var info = this.infos[index];
                var select = this._createSelect(createElement, info);
                select.value = info.id;
                var deleteButton = this._createDeleteButton(createElement, index);
                var repeatInput = this._createRepeatInput(createElement, info);
                var bottom = createElement("div", [deleteButton, repeatInput]);
                var properties = {
                    attrs: { class: "zdy-item" },
                    style: { width: "120px" }
                };
                return createElement("span", properties, [select, bottom]);
            },
            _createSelect: function(createElement, info) {
                var options = [];
                options.push(createElement("option", { attrs: { value: -1 } }, "选择一个命令组"));
                CmdGroupManager.getAll().map(function(item) {
                    var option = createElement("option", { attrs: { value: item.id } }, item.name);
                    options.push(option);
                });
                var properties = {
                    style: { width: "100%", "background-color": "#53f153" },
                    on: { change: function(event) { info.id = event.target.value; } },
                    domProps: { value: info.id }
                };
                var select = createElement("select", properties, options);
                return select;
            },
            _createDeleteButton: function(createElement, index) {
                var theSelf = EditWorkflow;
                var deleteAction = function() {
                    var verify = confirm("确认删除此命令组吗？");
                    if (verify) {
                        theSelf.infos.splice(index, 1);
                        theSelf.$forceUpdate();
                    }
                };
                var deleteButton = createElement(
                    "button",
                    { style: {width: "49%", float: "left", height: "18px"},  on: { click: deleteAction } },
                    "删除"
                );
                return deleteButton;
            },
            _createRepeatInput: function(createElement, info) {
                var onchange = function(event) {
                    var value = event.target.value;
                    if (value <= 0) event.target.value = 1;
                    info.repeat = event.target.value;
                };
                var properties = {
                    attrs: { type: "number" },
                    style: { 
                        width: "49%", height: "18px",
                        float: "right", "text-align": "right",
                        margin: 0, padding:0, border:0
                    },
                    on: { change: onchange },
                    domProps: { value: info.repeat }
                };
                var repeat = createElement("input", properties);
                return repeat;
            }
        },
        render: function(createElement) {
            var spans = [];
            for (let i = 0; i < this.infos.length; i++) {
                var span = this.createSpan(createElement, i);
                spans.push(span);
            }
            spans.push(this.createAddButton(createElement));
            return createElement(
                "div",
                { attrs: { class: "item-commands" } },
                spans
            );
        }
    });

    var CustomCmdGroups = new Vue({
        el: "#CustomCmdGroups",
        methods: {
            getItems: function() {
                var items = CmdGroupManager.getAll();
                items.push({id: "addCmdGroup", name: "+ 新增"});
                return items;
            },
            createSpan: function(createElement, item) {
                var onclick = function() {
                    if (item.id == "addCmdGroup") {
                        UI.createCmdGroup();
                    } else {
                        UI.modifyCmdGroup(item);
                    }
                };
                var properties = {
                    attrs: { class: "zdy-item" },
                    style: { width: "120px" },
                    on: { click: onclick }
                };
                return createElement('span', properties, item.name);
            },
        },
        render: function(createElement) {
            var items = this.getItems();
            var theSelf = this;
            var spans = items.map(function(item) {
                return theSelf.createSpan(createElement, item);
            });
            return createElement(
                "div",
                { attrs: { class: "item-commands" } },
                spans
            );
        }
    });

    var UI = {
        home: function() {
            messageClear();
            var html = `
            <div class = "item-commands" style="text-align:center">
                </br>🏮 <ord>恭祝 2019(己亥年) 新春大吉、万事如意！</ord>🏮</br></br>
                <span class = "zdy-item yihua" style="width:120px"> 移花宫(简单) </span>
                <span class = "zdy-item yihuaH" style="width:120px"> 移花宫(困难) </span>
                <span class = "zdy-item lunjian" style="width:120px"> 华山论剑 </span>
                <span class = "zdy-item customFlow" style="width:120px"> 🤖 <hig>自定义流程</hig> </span>
                <span class = "zdy-item wudaota" style="width:120px"> 🏯 <hio>武道塔</hio> </span>
                <span class = "zdy-item xiangyang" style="width:120px"> ⚔ <hiy>守卫襄阳</hiy> </span>
                <span class = "zdy-item shortcut" style="width:120px"> 🚀 <hiz>捷径</hiz> </span>
                <span class = "zdy-item moreRaid" style="width:120px"> ⛩ <hic>自动副本</hic> </span>
                <div id="raid-version"><br>(版本: ${GM_info.script.version})</div>
            </div>`;
            messageAppend(html);

            $(".yihua").on('click',function(){ Raid.repeatRunByName("移花宫(简单)"); });
            $(".yihuaH").on('click', function () { Raid.repeatRunByName("移花宫(困难)"); });
            $(".lunjian").on('click', function () { Raid.repeatRunByName("华山论剑"); });
            $(".customFlow").on('click', UI.customWorkflows);
            $(".wudaota").on('click', UI.wudaota);
            $(".xiangyang").on('click', UI.xiangyang);
            $(".shortcut").on('click', UI.shortcut);
            $(".moreRaid").on('click', UI.moreRaid);
            $("#raid-version").on('click', function() {
                window.open("https://greasyfork.org/zh-CN/scripts/375851-wsmud-raid/feedback", '_blank').location;
            });
        },
        
        customWorkflows: function() {
            UI._appendHtml("🤖 <hig>自定义流程</hig>", "", "命令组", UI.customCmdGroups);
            CustomWorkflows.$forceUpdate();
            UI._mountableDiv().appendChild(CustomWorkflows.$el);
        },
        createWorkflow: function() {
            var create = function() {
                var name = $("#create_wf_name").val();
                var success = WorkflowConfigManager.createWorkflowConfig(name, EditWorkflow.getValidInfos());
                if (success) UI.customWorkflows();
            };
            var content = `
            <div style="margin: 0 2em 5px 2em;text-align:left;width:calc(100% - 4em)">
                <label for="create_wf_name"> 名称:</label><input id ="create_wf_name" style='width:80px' type="text"  name="create_wf_name" value="">
            </div>`;
            UI._appendHtml("🤖 <hig>新建流程</hig>", content, "<hiw>创建</hiw>", create, null, UI.customWorkflows);
            EditWorkflow.infos = [];
            EditWorkflow.$forceUpdate();
            UI._mountableDiv().appendChild(EditWorkflow.$el);
        },
        modifyWorkflow: function(id) {
            var back = function() {
                var name = $("#edit_wf_name").val();
                var success = WorkflowConfigManager.updateWorkflowConfig(id, name, EditWorkflow.infos);
                if (success) UI.customWorkflows();
            };
            var remove = function() {
                var verify = confirm("确认删除此流程吗？");
                if (verify) {
                    WorkflowConfigManager.removeWorkflowConfig(id);
                    UI.customWorkflows();
                }
            };
            var content = `
            <div style="margin: 0 2em 5px 2em;text-align:left;width:calc(100% - 4em)">
                <label for="edit_wf_name"> 名称:</label><input id ="edit_wf_name" style='width:80px' type="text"  name="edit_wf_name" value="">
            </div>`;
            UI._appendHtml("🤖 <hig>编辑流程</hig>", content, "删除", remove, null, back);
            $("#edit_wf_name").val(WorkflowConfigManager.getName(id));
            EditWorkflow.infos = WorkflowConfigManager.getCmdGroupInfos(id);
            EditWorkflow.$forceUpdate();
            UI._mountableDiv().appendChild(EditWorkflow.$el);
        },

        customCmdGroups: function() {
            var help = function() {
                window.open("https://greasyfork.org/zh-CN/forum/discussion/49840/wsmud-raid-1-x-x-%E8%87%AA%E5%AE%9A%E4%B9%89%E6%B5%81%E7%A8%8B%E5%BC%80%E5%8F%91%E6%8C%87%E5%8D%97/p1?new=1", '_blank').location;
            };
            UI._appendHtml("🗳 预置命令组", "", "帮助", help, null, UI.customWorkflows);
            CustomCmdGroups.$forceUpdate();
            UI._mountableDiv().appendChild(CustomCmdGroups.$el);
        },
        createCmdGroup: function() {
            var content = `
            <div style="margin: 0 2em 5px 2em;text-align:left;width:calc(100% - 4em)">
                <label for="create_cg_name"> 名称:</label><input id ="create_cg_name" style='width:80px' type="text"  name="create_cg_name" value="">
            </div>
            <textarea class = "settingbox hide" style = "height:5rem;display:inline-block;font-size:0.8em;width:calc(100% - 4em)" id = "create_cg_cmds"></textarea>`
            var create = function() {
                var name = $("#create_cg_name").val();
                var cmdStr = $("#create_cg_cmds").val();
                var success = CmdGroupManager.createCmdGroup(name, cmdStr);
                if (success) UI.customCmdGroups();
            };
            UI._appendHtml("🗳 新建命令组", content, "<hiw>创建</hiw>", create, null, UI.customCmdGroups);
        },
        modifyCmdGroup: function(item) {
            var content = `
            <div style="margin: 0 2em 5px 2em;text-align:left;width:calc(100% - 4em)">
                <label for="edit_cg_name"> 名称:</label><input id ="edit_cg_name" style='width:80px' type="text"  name="edit_cg_name" value="">
            </div>
            <textarea class = "settingbox hide" style = "height:5rem;display:inline-block;font-size:0.8em;width:calc(100% - 4em)" id = "edit_cg_cmds"></textarea>`
            var back = function() {
                var name = $("#edit_cg_name").val();
                var cmdStr = $("#edit_cg_cmds").val();
                var success = CmdGroupManager.updateCmdGroup(item.id, name, cmdStr);
                if (success) UI.customCmdGroups();
            }
            var remove = function() {
                var verify = confirm("确认删除此命令组吗？");
                if (verify) {
                    CmdGroupManager.removeCmdGroup(item.id);
                    UI.customCmdGroups();
                }
            };
            UI._appendHtml("🗳 修改命令组", content, "删除", remove, null, back);
            $("#edit_cg_name").val(item.name);
            $("#edit_cg_cmds").val(CmdGroupManager.getCmdsText(item.id));
        },

        moreRaid: function() {
            UI._appendHtml("⛩ <hic>自动副本</hic>", "", "⚙ 设置", UI.raidSetting);
            var wg_log = document.getElementsByClassName("WG_log")[0];
            var pre = wg_log.getElementsByTagName("pre")[0];
            var div = pre.getElementsByTagName("div")[0];
            div.appendChild(MoreRaid.$el);
        },
        raidSetting: function() {
            var content = `
            <span style='border:solid 0px gray'>
                <label for="liaoshangInRaid">◆ 副本内疗伤，当气血低于： </label><select style='width:80px' id="liaoshangInRaid">
                    <option value="100">100%</option>
                    <option value="90">90%</option>
                    <option value="80">80%</option>
                    <option value="70">70%</option>
                    <option value="60">60%</option>
                    <option value="50">50%</option>
                    <option value="40">40%</option>
                    <option value="30">30%</option>
                    <option value="20">20%</option>
                    <option value="10">10%</option>
                </select>
            </span>
            <span style='border:solid 0px gray'>
                <label for="waitSkillCD">◆ Boss战前等待技能冷却： </label><select style='width:80px' id = "waitSkillCD">
                    <option value="no">关闭</option>
                    <option value="yes">开启</option>
                </select>
            </span>
            <span style='border:solid 0px gray'>
                <label for="bagCleanWay">◆ 背包清理方案： </label><select style='width:80px' id = "bagCleanWay">
                    <option value="none">不清理</option>
                    <option value="clean">售卖</option>
                    <option value="tidy">存仓&售卖</option>
                </select>
            </span>
            <span style='border:solid 0px gray'>
                <label for="cmdInterval">◆ 命令间隔时间 (已作废)： </label><select style='width:80px' id = "cmdInterval" disabled="disabled">
                    <option value=1000>1秒</option>
                </select>
            </span>`
            UI._appendHtml("⚙ 副本设置", content, null, null, null, UI.moreRaid);
            
            $('#liaoshangInRaid').val(Config.hpThresholdInDungeon());
            $("#liaoshangInRaid").change(function () {
                Config.setHpThresholdInDungeon($("#liaoshangInRaid").val());
            });
            $('#waitSkillCD').val(Config.waitSkillCD());
            $("#waitSkillCD").change(function () {
                Config.setWaitSkillCD($("#waitSkillCD").val());
            });
            $('#bagCleanWay').val(Config.bagCleanWay());
            $("#bagCleanWay").change(function () {
                Config.setBagCleanWay($("#bagCleanWay").val());
            });
        },

        wudaota: function() {
            var content = `
            <!--
            <span style='border:solid 0px gray;width:100%'>
                <label>◆ 自动战斗到第 </label><input type="number" id="wudaotaAutoToFloor" style="text-align:center;width:60px"><label> 层，</label><label for="wudaotaFastCombatOpening">剩余层扫荡符处理 </label><select style='width:60px' id = "wudaotaFastCombatOpening">
                    <option value="no">关闭</option>
                    <option value="yes">开启</option>
                </select><label>。</label>
            </span>
            <span style='border:solid 0px gray;width:100%'>
                <label for="wudaotaHpThreshold">◆ 疗伤，当气血小于 </label><select style='width:60px' id="wudaotaHpThreshold">
                    <option value="100">100%</option>
                    <option value="90">90%</option>
                    <option value="80">80%</option>
                    <option value="70">70%</option>
                    <option value="60">60%</option>
                    <option value="50">50%</option>
                    <option value="40">40%</option>
                    <option value="30">30%</option>
                    <option value="20">20%</option>
                    <option value="10">10%</option>
                </select><label>；从第 </label><input type="number" id="wudaotaWaitSkillCDFrom" style="text-align:center;width:60px"><label for="waitSkillCD"> 层开始，战前等待技能冷却。</label>
            </span>
            -->
            即将开放...`;
            UI._appendHtml("🏯 <hio>武道塔</hio>", content);
        },

        xiangyang: function() {
            var content = `<span class = "zdy-item xiangyangStart" style="width:120px"> <hiy>提开发建议=></hiy> </span>`;
            UI._appendHtml("⚔ <hiy>守卫襄阳</hiy>", content);

            $(".xiangyangStart").on('click', function () {
                window.open("https://greasyfork.org/zh-CN/forum/discussion/48858/%E5%AE%88%E5%8D%AB%E8%A5%84%E9%98%B3%E5%BC%80%E5%8F%91%E5%BB%BA%E8%AE%AE/p1?new=1", '_blank').location;
            });
        },

        shortcut: function() {
            var content = `
            <span class = "zdy-item outMaze" style="width:120px"> 走出桃花林 </span>
            <span class = "zdy-item zhoubotong" style="width:120px"> 找到周伯通 </span>`
            UI._appendHtml("🚀 <hiz>捷径</hiz>", content);

            $(".outMaze").on('click', function () {
                WG.SendCmd('stopstate');
                THIsland.outMaze();
            });
            $(".zhoubotong").on('click', function () {
                WG.SendCmd('stopstate');
                THIsland.zhoubotong();
            });
        },

        _appendHtml(title, content, rightText, rightAction, leftText, leftAction) {
            var realLeftText = leftText == null ? "< 返回" : leftText;
            var realRightText = rightText == null ? "" : rightText;
            var html = `
            <div class = "item-commands" style="text-align:center">
                <div style="margin-top:0.5em">
                    <div style="width: 8em; float: left; text-align: left; padding: 0px 0px 0px 2em;" id="wsmud_raid_left">${realLeftText}</div>
                    <div style="width: calc(100% - 16em); float: left;">${title}</div>
                    <div style="width: 8em; float: left; text-align: right; padding: 0px 2em 0px 0px;" id="wsmud_raid_right">${realRightText}</div>
                </div>
                <br><br>
                ${content}
            </div>`;
            Message.clean();
            Message.append(html);
            $("#wsmud_raid_left").on('click', function () {
                leftAction ? leftAction() : UI.home();
            });
            $("#wsmud_raid_right").on('click', function () {
                if (rightAction) rightAction();
            });
        },
        _mountableDiv: function() {
            var wg_log = document.getElementsByClassName("WG_log")[0];
            var pre = wg_log.getElementsByTagName("pre")[0];
            var div = pre.getElementsByTagName("div")[0];
            return div;
        }
    };

    var ToRaid = { 
        menu :UI.home
    };

    //---------------------------------------------------------------------------
    //  TaoHua Island
    //---------------------------------------------------------------------------

    // 暂时保留给桃花岛解密用
    class CmdExecuter {
        constructor(cmds, willStartExecute, didFinishExecute, willPerformCmd, didPerformCmd, interval) {
            this.cmds = cmds;
            this.willStartExecute = willStartExecute;
            this.didFinishExecute = didFinishExecute;
            this.willPerformCmd = willPerformCmd;
            this.didPerformCmd = didPerformCmd;
            this.interval = interval ? interval : 1000;
        }
        execute() {
            if (this.isWorking) return;
            this.isWorking = true;
            if (this.willStartExecute) this.willStartExecute();
            this._performCmd(0);
        }
        _performCmd(index) {
            if (index >= this.cmds.length) { this._finishExecute(); return; }
            if (!Role.isFree()) { this._delayPerformCmd(index); return; }
            var cmd = this.cmds[index];
            if (this.willPerformCmd) {
                var lastCmd = null;
                if (index > 0) lastCmd = this.cmds[index - 1];
                var valid = this.willPerformCmd(lastCmd, cmd);
                if (!valid) { this._delayPerformCmd(index); return; }
                cmd = valid;
            }
            // @开头，虚命令，不真正执行
            if (cmd.indexOf("@") == -1 && cmd.indexOf("kill?") == -1) WG.SendCmd(cmd);
            if (this.didPerformCmd) this.didPerformCmd(cmd);
            // [exit] 保留命令，立即退出执行器
            if (cmd.indexOf("[exit]") != -1) {
                this._finishExecute();
                return;
            }
            this._delayPerformCmd(index + 1);
        }
        _delayPerformCmd(index) {
            var executer = this;
            window.setTimeout(function () {
                executer._performCmd(index);
            }, executer.interval);
        }
        _finishExecute() {
            this.isWorking = false;
            WG.remove_hook(CmdExecuter._hookIndex);
            if (this.didFinishExecute) this.didFinishExecute();
        }
    }

    var THIsland = {
        outMaze: function() {
            if (!Role.atPath("taohua/haitan")) {
                Message.append("只有在 桃花岛的海滩 才能使用此虫洞。");
                return;
            }

            var cmds = [
                "go south",
                "@look 1",
                "@look 5"
            ];
            var willStartExecute = function() {
                THIsland._monitorMaze();
            };
            var willPerformCmd = function(lastCmd, cmd) {
                if (cmd == "@look 1") {
                    if (THIsland._goCenterCmd) {
                       return THIsland._goCenterCmd;
                    } else {
                        return null;
                    }
                }
                if (cmd == "@look 5") {
                    if (THIsland._decodedMaze) {
                        return THIsland._outMazeCmd();
                    } else {
                        return null;
                    }
                }
                return cmd;
            };
            var executer = new CmdExecuter(
                cmds,
                willStartExecute,
                THIsland._cancelMonitorMaze,
                willPerformCmd,
                undefined,
                1000
            );
            executer.execute();
        },
        zhoubotong: function() {
            if (!Role.atPath("taohua/wofang")) {
                Message.append("只有在 蓉儿的卧室 才能使用此虫洞。");
                return;
            }

            var cmds = [
                "go south;go west;go west;go west;go north;go north;go north",
                "go west;go east;go west;go east;go west",
                "go south",
                "@look 1",
                "@look 5",
                "@go 2",
                "@go 3",
                "@go 4",
                "@go 6",
                "@go 7",
                "@go 8",
            ];
            var willStartExecute = function() {
                THIsland._monitorMaze();
                THIsland._exitsHookIndex = WG.add_hook("exits", function(data) {
                    if (THIsland._lastCoord == undefined || THIsland._lastCoord == [0, 0]) return;
                    if (Object.keys(data.items).length != 4) return;
                    for(var key in data.items) {
                        if (data.items[key] != "桃花林") return;
                    }
                    var normalExistMap = [
                        [["north", "northeast", "east"], ["east", "north", "south"], ["east", "south", "southeast"],],
                        [["east", "north", "west"], [], ["west", "east", "south"],],
                        [["west", "northwest", "north"], ["west", "south", "north"], ["west", "southwest", "south"],]
                    ];
                    var x = THIsland._lastCoord[0] + 1;
                    var y = THIsland._lastCoord[1] + 1;
                    var normalExists = normalExistMap[x][y];
                    for(var key2 in data.items) {
                        if (normalExists.indexOf(key2) != -1) continue;
                        THIsland._goCave = "go " + key2;
                        return;
                    }
                });
            };
            var didFinishExecute = function() {
                THIsland._lastCoord = undefined;
                THIsland._lastGo = undefined;
                THIsland._goCave = undefined;
                THIsland._cancelMonitorMaze();
                WG.remove_hook(THIsland._exitsHookIndex);
            };
            var willPerformCmd = function(lastCmd, cmd) {
                if (THIsland._goCave) return THIsland._goCave + ";go west;[exit]";

                var number = 0;
                switch (cmd) {
                case "@look 1":
                    if (THIsland._goCenterCmd) {
                       return THIsland._goCenterCmd;
                    } else {
                        return null;
                    }
                    break;
                case "@look 5":
                    if (!THIsland._decodedMaze) return null;
                    break;
                case "@go 2":
                    THIsland._lastCoord = THIsland._mazeCoords[2];
                    THIsland._lastGo = THIsland._mazePath(THIsland._lastCoord);
                    return THIsland._lastGo;
                case "@go 3": number = 3; break;
                case "@go 4": number = 4; break;
                case "@go 6": number = 6; break;
                case "@go 7": number = 7; break;
                case "@go 8": number = 8; break;
                }
                if (number != 0) {
                    var back = THIsland._mazeBackPath(THIsland._lastGo);
                    THIsland._lastCoord = THIsland._mazeCoords[number];
                    THIsland._lastGo = THIsland._mazePath(THIsland._lastCoord);
                    return back + ";" + THIsland._lastGo;
                }
                return cmd;
            };
            var executer = new CmdExecuter(
                cmds,
                willStartExecute,
                didFinishExecute,
                willPerformCmd,
                undefined,
                1000
            );
            executer.execute();
        },

        _outMazeCmd: function() {
            var cmd = "";
            for (var i = 2; i <= 9; i++) {
                var coord = THIsland._mazeCoords[i];
                var go = THIsland._mazePath(coord);
                if (i == 9) {
                    cmd += go + ";" + go;
                } else {
                    cmd += go + ";" + THIsland._mazeBackPath(go) + ";";
                }
            }
            cmd += ";go south";
            return cmd;
        },
        _mazePath: function(coord) {
            var pathMap = [
                ["go southwest", "go west", "go northwest"],
                ["go south", "", "go north"],
                ["go southeast", "go east", "go northeast"]
            ];
            var x = coord[0] + 1;
            var y = coord[1] + 1;
            return pathMap[x][y];
        },
        _mazeBackPath: function(path) {
            var backMap = {
                "": "",
                "go southwest": "go northeast",
                "go west": "go east",
                "go northwest": "go southeast",
                "go south": "go north",
                "go north": "go south",
                "go southeast": "go northwest",
                "go east": "go west",
                "go northeast": "go southwest"
            };
            return backMap[path];
        },
        _monitorMaze: function() {
            THIsland._mazeCoords = [
                [2, 2], // unused
                [2, 2],
                [2, 2],
                [2, 2],
                [2, 2],
                [0, 0],
                [2, 2],
                [2, 2],
                [2, 2],
                [2, 2]
            ];
            THIsland._atFirst = false;
            THIsland._goCenterCmd = undefined;
            THIsland._decodedMaze = false;

            var index1 = WG.add_hook(["room", "exits"], function(data) {
                if (THIsland._goCenterCmd != undefined) return;

                if (data.type == "room") {
                    if (data.desc == undefined) return;
                    var patt = new RegExp("四周栽了大概有一棵桃树");
                    var result = patt.exec(data.desc);
                    if (result) THIsland._atFirst = true;
                } else if (data.type == "exits") {
                    if (data.items == undefined) return;
                    if (THIsland._atFirst) {
                        if (data.items.north && data.items.south) {
                            if (data.items.west) {
                                THIsland._mazeCoords[1] = [1, 0];
                                THIsland._goCenterCmd = "go west";
                            } else {
                                THIsland._mazeCoords[1] = [-1, 0];
                                THIsland._goCenterCmd = "go east";
                            }
                        } else if (data.items.west && data.items.east) {
                            if (data.items.north) {
                                THIsland._mazeCoords[1] = [0, -1];
                                THIsland._goCenterCmd = "go north";
                            } else {
                                THIsland._mazeCoords[1] = [0, 1];
                                THIsland._goCenterCmd = "go south";
                            }
                        }
                    }
                }
            });
            var index2 = WG.add_hook("room", function(data) {
                if (THIsland._decodedMaze) return;

                if (data.desc == undefined) return;
                var patt = new RegExp("能看到东南方向大概有.(?=棵桃树)");
                var count = patt.exec(data.desc);
                if (!count) return;
                var text = count.toString();
                switch (text.substring(text.length - 1)) {
                    case "二": THIsland._mazeCoords[2] = [1, -1]; break;
                    case "四": THIsland._mazeCoords[4] = [1, -1]; break;
                    case "六": THIsland._mazeCoords[6] = [1, -1]; break;
                    case "八": THIsland._mazeCoords[8] = [1, -1]; break;
                }

                THIsland._mazeCoords[9] = [-THIsland._mazeCoords[1][0], -THIsland._mazeCoords[1][1]];
                while (true) {
                    if (THIsland._mazeCoords[2][0] != 2) {
                        THIsland._mazeCoords[8] = [-THIsland._mazeCoords[2][0], -THIsland._mazeCoords[2][1]];
                    }
                    if (THIsland._mazeCoords[8][0] != 2) {
                        if (THIsland._mazeCoords[8][0] == THIsland._mazeCoords[1][0]) {
                            THIsland._mazeCoords[6] = [THIsland._mazeCoords[8][0], -THIsland._mazeCoords[8][1]];
                        } else {
                            THIsland._mazeCoords[6] = [-THIsland._mazeCoords[8][0], THIsland._mazeCoords[8][1]];
                        }
                    }
                    if (THIsland._mazeCoords[6][0] != 2) {
                        THIsland._mazeCoords[4] = [-THIsland._mazeCoords[6][0], -THIsland._mazeCoords[6][1]];
                    }
                    if (THIsland._mazeCoords[4][0] != 2) {
                        if (THIsland._mazeCoords[4][0] == THIsland._mazeCoords[9][0]) {
                            THIsland._mazeCoords[2] = [THIsland._mazeCoords[4][0], -THIsland._mazeCoords[4][1]];
                        } else {
                            THIsland._mazeCoords[2] = [-THIsland._mazeCoords[4][0], THIsland._mazeCoords[4][1]];
                        }
                    }
                    if (THIsland._mazeCoords[2][0] != 2 &&
                        THIsland._mazeCoords[4][0] != 2 &&
                        THIsland._mazeCoords[6][0] != 2 &&
                        THIsland._mazeCoords[8][0] != 2) {
                        break;
                    }
                }
                if (THIsland._mazeCoords[8][0] == THIsland._mazeCoords[4][0]) {
                    THIsland._mazeCoords[3] = [THIsland._mazeCoords[8][0], 0];
                } else {
                    THIsland._mazeCoords[3] = [0, THIsland._mazeCoords[8][1]];
                }
                THIsland._mazeCoords[7] = [-THIsland._mazeCoords[3][0], -THIsland._mazeCoords[3][1]];

                THIsland._decodedMaze = true;
            });
            THIsland._mazeHookIndexes = [index1, index2];
        },
        _cancelMonitorMaze: function() {
            for (var i = THIsland._mazeHookIndexes.length - 1; i >= 0; i--) {
                var index = THIsland._mazeHookIndexes[i];
                WG.remove_hook(index);
            }
        },
    };

    //---------------------------------------------------------------------------
    //  Database
    //---------------------------------------------------------------------------

    var DB = {

    };

    //---------------------------------------------------------------------------
    //  Ready
    //---------------------------------------------------------------------------

    $(document).ready(function () {
        WG = unsafeWindow.WG;
        messageAppend  = unsafeWindow.messageAppend;
        messageClear =  unsafeWindow.messageClear;
        T = unsafeWindow.T;
        unsafeWindow.ToRaid = ToRaid;
        unsafeWindow.Role = Role;
        Role.init();
        Room.init();
        SystemTips.init();
    });
})();
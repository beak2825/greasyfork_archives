// ==UserScript==
// @name         wsmud-hs
// @namespace    http://mingy.org/
// @version      2.0.0.47
// @description  wsmud extension
// @author       Mingy
// @match        http://game.wsmud.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/373087/wsmud-hs.user.js
// @updateURL https://update.greasyfork.org/scripts/373087/wsmud-hs.meta.js
// ==/UserScript==
// v2.0.0.11 2018.05.22 修正无法正确自动打boss的BUG
// v2.0.0.12 2018.05.24 删除迁移遗漏的代码
// v2.0.0.13 2018.05.25 练习列表中增加明玉功
// v2.0.0.14 2018.05.29 练习列表的格式改回来了，#combat增加了pfm_ok的判断，增加了8:00pm抢完成师门任务的功能
// v2.0.0.15 2018.06.02 调整了check_buff() perform_busy() perform_attack()的用法，一些个性化配置的修改
// v2.0.0.16 2018.06.12 修复自动打boss死亡后脚本停止的BUG
// v2.0.0.17 2018.06.19 装备更新
// v2.0.0.18 2018.06.21 修复boss战死亡后因内力不够无法疗伤的问题
// v2.0.0.19 2018.06.25 支持武帝修炼
// v2.0.0.20 2018.06.28 武帝修炼也会监听挖矿指南
// v2.0.0.21 2018.07.06 更新装备
// v2.0.0.22 2018.07.16 应对7.16的更新
// v2.0.0.23 2018.07.17 增加指令队列，3秒内最多10条指令
// v2.0.0.24 2018.07.17 恢复自动拾取功能
// v2.0.0.25 2018.07.18 更换装备，更换技能
// v2.0.0.26 2018.07.19 更换装备，更换技能
// v2.0.0.27 2018.07.21 增加技能tiannanbu，优化指令队列
// v2.0.0.28 2018.07.22 继续修改指令队列
// v2.0.0.29 2018.07.23 增加伤害统计功能
// v2.0.0.30 2018.07.23 增加技能yihuajiemu
// v2.0.0.31 2018.08.04 更换装备

(function() {
    'use strict';

    var _ws = window.WebSocket, ws, ws_on_message;
	var message_listeners = [];
	var listener_seq = 0;
	function add_listener(types, fn) {
		var listener = {
			'id' : ++listener_seq,
			'types' : types,
			'fn' : fn
		};
		message_listeners.push(listener);
		return listener.id;
	}
	function remove_listener(id) {
		for ( var i = 0; i < message_listeners.length; i++) {
			if (message_listeners[i].id == id) {
				message_listeners.splice(i, 1);
			}
		}
	}
    function fire_listener(data) {
		for ( var i = 0; i < message_listeners.length; i++) {
			var listener = message_listeners[i];
			if (listener.types == data.type || (listener.types instanceof Array && $
							.inArray(data.type, listener.types) >= 0)) {
				listener.fn(data);
			}
		}
    }
	var my_receive_message = function(evt) {
		ws_on_message.apply(this, arguments);
        if (!evt || !evt.data) return;
        var data;
        if (evt.data[0] == '{' || evt.data[0] == '[') {
            var func = new Function("return " + evt.data + ";");
            data = func();
        } else {
            data = {type : 'text', msg : evt.data};
        }
        fire_listener(data);
	};

	var cmd_queue = [], cmd_busy = false, echo = true;
	var _send_cmd = function() {
        if (!ws || ws.readyState != 1) {
            cmd_busy = false;
            cmd_queue = [];
        } else if (cmd_queue.length > 0) {
			cmd_busy = true;
            var t = new Date().getTime();
            for (var i = 0; i < cmd_queue.length; i++) {
                if (!cmd_queue[i].timestamp || cmd_queue[i].timestamp >= t - 3000) {
                    cmd_queue.splice(0, i);
                    break;
                }
            }
            /*
            var k = 0;
            for (var i = 0; i < cmd_queue.length; i++) {
                if (!cmd_queue[i].timestamp || cmd_queue[i].timestamp >= t - 3000) {
                    k = i;
                    break;
                }
            } */
            for (var i = 0; i < Math.min(cmd_queue.length, 10); i++) {
                if (!cmd_queue[i].timestamp) {
                    try {
                        ws.send(cmd_queue[i].cmd);
                        cmd_queue[i].timestamp = t;
                    } catch(e) {
                        show_msg(e);
                        cmd_busy = false;
                        cmd_queue = [];
                        return;
                    }
                }
            }
            if (!cmd_queue[cmd_queue.length - 1].timestamp) {
                /* 
                var first = cmd_queue[k].timestamp, next = 0;
                for (var i = k + 1; i < cmd_queue.length; i++) {
                    if (!cmd_queue[i].timestamp) {
                        break;
                    } else if (cmd_queue[i].timestamp > first) {
                        next = cmd_queue[i].timestamp;
                        break;
                    }
                } */
                // console.log('wait ' + ((next > 0 ? next : first) + 3000 - t) + ', from ' + (next > 0 ? next : first) + ', now ' + t);
                setTimeout(_send_cmd, 200);
            } else {
                cmd_busy = false;
            }
        } else {
			cmd_busy = false;
		}
	};
	var send_cmd = function(cmd, no_queue) {
        if (ws && ws.readyState == 1) {
            cmd = cmd instanceof Array ? cmd : cmd.split(';');
            if (echo) {
                show_msg('<hiy>' + cmd.join(';') + '</hiy>');
            }
            if (no_queue) {
                for (var i = 0; i < cmd.length; i++) {
                    ws.send(cmd[i]);
                }
            } else {
                for (var i = 0; i < cmd.length; i++) {
                    cmd_queue.push({cmd: cmd[i], timestamp: 0});
                }
                if (!cmd_busy) {
                    _send_cmd();
                }
            }
        }
	};
    function show_msg(msg) {
        ws_on_message({data: msg});
    }
	function log(msg) {
		show_msg('<hir>' + msg + '</hir>');
	}
    
    unsafeWindow.WebSocket = function(uri) {
        ws = new _ws(uri);
    };
    unsafeWindow.WebSocket.prototype = {
        CONNECTING: _ws.CONNECTING,
        OPEN: _ws.OPEN,
        CLOSING: _ws.CLOSING,
        CLOSED: _ws.CLOSED,
        get url() {
            return ws.url;
        },
        get protocol() {
            return ws.protocol;
        },
        get readyState() {
            return ws.readyState;
        },
        get bufferedAmount() {
            return ws.bufferedAmount;
        },
        get extensions() {
            return ws.extensions;
        },
        get binaryType() {
            return ws.binaryType;
        },
        set binaryType(t) {
            ws.binaryType = t;
        },
        get onopen() {
            return ws.onopen;
        },
        set onopen(fn) {
            ws.onopen = fn;
        },
        get onmessage() {
            return ws.onmessage;
        },
        set onmessage(fn) {
            ws_on_message = fn;
            ws.onmessage = my_receive_message;
        },
        get onclose() {
            return ws.onclose;
        },
        set onclose(fn) {
            ws.onclose = fn;
        },
        get onerror() {
            return ws.onerror;
        },
        set onerror(fn) {
            ws.onerror = fn;
        },
        send: function(text) {
            if (echo) {
                show_msg('<hiy>' + text + '</hiy>');
            }
            ws.send(text);
        },
        close: function() {
            ws.close();
        }
    };

    setTimeout(function() {
	var aliases = new Map();
	aliases.set('l', 'look');
	aliases.set('i', 'items');
	aliases.set('cha', 'skills');
	aliases.set('msg', 'message');
	aliases.set('rank', 'stats');
	aliases.set('k', 'kill');
	aliases.set('e', 'east');
	aliases.set('s', 'south');
	aliases.set('w', 'west');
	aliases.set('n', 'north');
	aliases.set('se', 'southeast');
	aliases.set('sw', 'southwest');
	aliases.set('ne', 'northeast');
	aliases.set('nw', 'northwest');
	aliases.set('u', 'up');
	aliases.set('d', 'down');
	aliases.set('eu', 'eastup');
	aliases.set('su', 'southup');
	aliases.set('wu', 'westup');
	aliases.set('nu', 'northup');
	aliases.set('ed', 'eastdown');
	aliases.set('sd', 'southdown');
	aliases.set('wd', 'westdown');
	aliases.set('nd', 'northdown');
	aliases.set('h', 'halt');
	aliases.set('dz', 'dazuo');
	aliases.set('pfm', 'perform');
	aliases.set('home', 'fly yz;w;w;n;enter');
	aliases.set('full', 'fly yz;n;n;w;eq wfdw1f721e5;heal');
	aliases.set('yamen', 'fly yz;w;n;n');

	var map_ids = new Map();
	map_ids.set('yangzhou', '0');
	map_ids.set('yz', '0');
	map_ids.set('wudang', '1');
	map_ids.set('wd', '1');
	map_ids.set('shaolin', '2');
	map_ids.set('sl', '2');
	map_ids.set('huashan', '3');
	map_ids.set('hs', '3');
	map_ids.set('emei', '4');
	map_ids.set('em', '4');
	map_ids.set('xiaoyao', '5');
	map_ids.set('xy', '5');
	map_ids.set('gaibang', '6');
	map_ids.set('gb', '6');
	map_ids.set('xiangyang', '7');
	map_ids.set('xy2', '7');
	map_ids.set('wudaota', '8');
	map_ids.set('wdt', '8');

	var no_loot = false, auto_pfm = false;
	var cooldowns = new Map();
	var my_buffs = new Map();
	var all_targets = new Map();

	// ---- settings ----
// 	aliases.set('p1', 'eq wfdw1f721e5;perform force.xi;perform dodge.power;perform sword.wu;perform parry.wu');
// 	aliases.set('p2', 'eq jnk618b6c80;perform force.xi;perform dodge.power;perform parry.wu;perform blade.chan');
    aliases.set('p1', 'eq fvz5334c72a;eq 4a932dde60a;eq twsw2e66aea;eq 9w072dcf7ff;eq o7ok25e59fe;eq xxxz2decfbb;eq 8chi2eb6c47;eq f8063321281');//悟性套：不悔，头，衣服，脚，手镯，玉佩，曙光束腰，B血剑
	aliases.set('p2', 'eq bcj5301a1d2;eq qn7a2a1099b;eq w4zm2dd17e2;eq 0gc62e65cc4;eq dwgr2e65b01;eq 1dr027fe477;eq p6bh2d3f250;eq f8063321281');//输出套：莲亭，头，衣服，脚，护腕，香囊，混天腰带，B血剑
	aliases.set('p3', 'perform force.xi;perform dodge.power;perform sword.wu;perform parry.wu;perform unarmed.chan');
	aliases.set('p4', 'eq a3gg1689bd4;perform force.xi;perform whip.chan');
	aliases.set('p5', 'eq wfdw1f721e5;perform force.xi;perform dodge.power;perform sword.wu;perform parry.wu;perform sword.poqi;perform unarmed.liu;perform throwing.jiang');
	aliases.set('eq1', 'eq 0m7t2916c6e;eq 1tgm18a2aaf;eq rse92847c3b;eq 40z51332c8f;eq igpd27a9958;eq nm1g1b29016;eq 29gc26ac971;enable1 unarmed liumaishenjian;enable1 dodge lingboweibu2');
	aliases.set('eq2', 'eq hft127b461c;eq cbam1b06478;eq nawl19a936f;eq x9u6196b3c2;eq lhc313bbbf4;eq mea71a7005c;eq 8cnm21573db;enable1 unarmed canhezhi;enable1 dodge tiannanbu');
	aliases.set('eq3', 'eq hft127b461c;eq cbam1b06478;eq rse92847c3b;eq x9u6196b3c2;eq mtal1b99137;eq nm1g1b29016;eq 29gc26ac971');
	aliases.set('eq_blade', 'eq jnk618b6c80');
	aliases.set('before_kill', 'eq f8063321281');
	aliases.set('set_auto_pfm', 'setting auto_pfm force.wuwo,parry.wu,parry.yi,unarmed.qi,unarmed.liu,sword.jiang,throwing.jiang');
	aliases.set('no_auto_pfm', 'setting auto_pfm');
// 	aliases.set('wakuang', 'stopstate;jh fam 0 start;go west;go west;go west;go west;eq jd76309aef1;wa');
    aliases.set('biguan', 'stopstate;jh fam 0 start;go west;go west;go west;go west;eq jd76309aef1;wa');
	//aliases.set('biguan', 'stopstate;jh fam 0 start;go west;go west;go north;go enter;go west;xiulian');
	aliases.set('wang', 'enable1 force mingyugong;perform force.wang;enable1 force zixiashengong2');
    aliases.set('pfm_duo', 'perform force.wuwo;perform dodge.lingbo;perform parry.yi;perform unarmed.qi;perform parry duo');
    var biguan = false, auto_get_food = false;
	var full_skills = ['force', 'sword', 'unarmed', 'dodge', 'parry', 'throwing', 'blade', 'staff', 'whip', 'club',
	                   'xiaowuxianggong2', 'mingyugong', 'liumaishenjian', 'liuyangzhang2',
                       'hengshanwushenjian', 'feixingshu', 'wuhuduanmendao',
                       'shedaoqigong', 'yunlongbian', 'juemengun', 'yihuajiemu'];
	var task_path = 'fly hs', task_npc = '高根明', auto_wudao_max = '七十';
    var PFMS = function(cmds) {
        this.pfms = cmds ? (cmds instanceof Array ? cmds : [cmds]) : [];
    };
    PFMS.prototype = {
        check_buff: function() {
            if (!my_buffs.has('force')) {
                if (can_perform('force.power')) {
                    this.pfms.push('perform force.power');
                }
            }
//             if (!my_buffs.has('chidun')) {
//                 if (can_perform('force.power')) {
//                     this.pfms.push('perform force.power');
//                 }
//             }
            if (!my_buffs.has('mingyu')) {
                if (can_perform('force.wang')) {
                    this.pfms.push('perform force.wang');
                }
            }
             if (!my_buffs.has('weapon')) {
                if (can_perform('sword.wu')) {
                    this.pfms.push('perform sword.wu');
                }
            }
            if (!my_buffs.has('sword')) {
                if (can_perform('force.wuwo')) {
                    this.pfms.push('perform force.wuwo');
                } else if (can_perform('sword.yang')) {
                    this.pfms.push('perform sword.yang');
                }
            }
            if (!my_buffs.has('dodge')) {
                if (can_perform('dodge.power')) {
                    this.pfms.push('perform dodge.power');
                }
            }
            if (!my_buffs.has('parry')) {
                if (can_perform('parry.wu')) {
                    this.pfms.push('perform parry.wu');
                }
            }
            return this;
        },
        perform_busy: function(id) {
            var target = null;
            if (id) {
                target = get_target(id);
                if (target && (target.buffs.has('busy') || target.buffs.has('faint'))) {
                    return this;
                }
            }
            if (can_perform('parry.yi') && ((!target && !my_buffs.has('yihua')) || (target && !target.buffs.has('yihua')))) {
                this.pfms.push('perform parry.yi');
            }
            if (can_perform('unarmed.chan')) {
                this.pfms.push('perform unarmed.chan');
            } else if (can_perform('sword.poqi')) {
                this.pfms.push('perform sword.poqi');
            } else if (can_perform('unarmed.qi')) {
                this.pfms.push('perform unarmed.qi');
            } else if (can_perform('dodge.lingbo')) {
                this.pfms.push('perform dodge.lingbo');
            }
            return this;
        },
        perform_attack: function(n) {
            var i = 0;
            if ((!n || i++ < n) && can_perform('force.xi')) {
                this.pfms.push('perform force.xi');
            }
//             if ((!n || i++ < n) && can_perform('force.power')) {
//                 this.pfms.push('force.power');
//             }
            if ((!n || i++ < n) && can_perform('unarmed.po')) {
                this.pfms.push('perform unarmed.po');
            }
            if ((!n || i++ < n) && can_perform('throwing.jiang')) {
                this.pfms.push('perform throwing.jiang');
            }
            if ((!n || i++ < n) && can_perform('sword.qi')) {
                this.pfms.push('perform sword.qi');
            }
            if ((!n || i++ < n) && can_perform('sword.jiang')) {
                this.pfms.push('perform sword.jiang');
            }
            if ((!n || i++ < n) && can_perform('unarmed.zhen')) {
                this.pfms.push('perform unarmed.zhen');
            }
            if ((!n || i++ < n) && can_perform('unarmed.san')) {
                this.pfms.push('perform unarmed.san');
            }
            if ((!n || i++ < n) && can_perform('unarmed.zhui')) {
                this.pfms.push('perform unarmed.zhui');
            }
            if ((!n || i++ < n) && can_perform('parry.pojian')) {
                this.pfms.push('perform parry.pojian');
            }
            if ((!n || i++ < n) && can_perform('force.cui')) {
                this.pfms.push('perform force.cui');
            }
            if ((!n || i++ < n) && can_perform('force.zhui')) {
                this.pfms.push('perform force.zhui');
            }
            return this;
        },
        append: function(cmd) {
            this.pfms.push(cmd);
            return this;
        },
        do: function() {
            if (this.pfms.length > 0) {
                send_cmd(this.pfms);
            }
        }
    };
	function check_task_go() {
        return ((can_perform('force.power') || my_buffs.has('force'))
                || (can_perform('force.wuwo') || my_buffs.has('sword')))
            && (can_perform('unarmed.chan') || can_perform ('unarmed.qi'))
            && (!has_perform('unarmed.liu') || can_perform('unarmed.liu'));
	}
	// ------------------
	
	var my_id, room, map_id, items = new Map(), in_combat = false, i_am_ready = true, combat_room, kill_targets = [], all_stats = new Map(), last_sc, auto_loot_timeout;
	add_listener(['login', 'room', 'items', 'itemadd', 'itemremove', 'combat', 'text', 'dispfm', 'status', 'sc', 'msg'], function(data) {
		if (data.type == 'login') {
			my_id = data.id;
		} else if (data.type == 'room') {
			room = data;
			map_id = get_map_id(room.path);
		} else if (data.type == 'items') {
			items = new Map();
			for (var i = 0; i < data.items.length; i++) {
				var name = get_name(data.items[i].name);
				items.set(data.items[i].id, name);
				if (room.path == combat_room && kill_targets.length > 0) {
					auto_loot(data.items[i].id, name);
				}
			}
		} else if (data.type == 'itemadd') {
			var name = get_name(data.name);
			items.set(data.id, name);
			if (room.path == combat_room && kill_targets.length > 0) {
				auto_loot(data.id, name);
			}
		} else if (data.type == 'itemremove') {
			items.delete(data.id);
		} else if (data.type == 'combat') {
			if (data.start) {
				in_combat = true;
				combat_room = room.path;
				kill_targets = [];
				if (auto_loot_timeout) {
					clearTimeout(auto_loot_timeout);
					auto_loot_timeout = undefined;
				}
			} else if (data.end) {
				in_combat = false;
				auto_loot_timeout = setTimeout(function() {
					kill_targets = [];
					auto_loot_timeout = undefined;
				}, 120000);
                for (var [id, stats] of all_stats) {
                    if (stats.hp <= 0) {
                        report_stats(id);
                    }
                }
            }
		} else if (data.type == 'text') {
			if (in_combat) {
                var text = get_text(data.msg);
				var r = text.match(/^看起来(.+)想杀死你！$/);
				if (r) {
					kill_targets.push(r[1]);
				} else {
                    r = text.match(/造成(\d+)点(伤害|暴击伤害)/);
					if (r) {
                        var stats = all_stats.get(last_sc.id);
                        if (stats) {
                            var t = new Date().getTime();
                            if (!stats.damage) {
                                stats.start = t;
                            }
                            stats.damage += parseInt(r[1]);
                            stats.ttl = t;
                            update_stats(last_sc.id);
                        }
                    }
                }
			}
		} else if (data.type == 'dispfm') {
			if (data.rtime) {
				i_am_ready = false;
				setTimeout(function() {
					i_am_ready = true;
				}, data.rtime);
			}
			if (data.id && data.distime) {
                console.log('cd+ ' + data.id);
				cooldowns.set(data.id, true);
				var _id = data.id;
				setTimeout(function() {
                    console.log('cd- ' + _id);
					cooldowns.set(_id, false);
                    fire_listener({type: 'pfm_ok', id: _id});
				}, data.distime);
			}
		} else if (data.type == 'status') {
			if (data.id == my_id) {
				if (data.action == 'add') {
					my_buffs.set(data.sid, data.name);
				} else if (data.action == 'remove') {
					my_buffs.delete(data.sid);
				} else if (data.action == 'clear') {
					my_buffs.clear();
				}
			} else {
				var target = all_targets.get(data.id);
				if (data.action == 'add') {
					if (!target) {
						target = create_target(data.id);
					}
					target.buffs.set(data.sid, data.name);
					target.ttl = new Date().getTime();
				} else if (data.action == 'remove') {
					if (target) {
						target.buffs.delete(data.sid);
						target.ttl = new Date().getTime();
					}
				} else if (data.action == 'clear') {
					if (target) {
						target.buffs.clear();
						target.ttl = new Date().getTime();
					}
				}
			}
		} else if (data.type == 'sc' && data.id != my_id) {
			if (data.hp > 0) {
				var target = all_targets.get(data.id);
				if (!target) {
					target = create_target(data.id);
				}
				target.hp = data.hp;
				target.ttl = new Date().getTime();
			} else {
				all_targets.delete(data.id);
			}
            if (data.hp !== undefined) {
                var stats = all_stats.get(data.id);
                if (!stats) {
                    var $c = $('div.room-item[itemid="' + data.id + '"]');
                    if ($c.length > 0) {
                        var name;
                        for (var [key, value] of items) {
                            if (key == data.id) {
                                name = value;
                                break;
                            }
                        }
                        var max_hp = parseInt($('div.item-status > div.hp > div.progress-bar', $c).attr('max'));
                        stats = {id: data.id, name: name ? name : data.id, hp: data.hp, max_hp: max_hp, damage: 0};
                        all_stats.set(data.id, stats);
                    }
                }
                if (stats) {
                    stats.hp = data.hp;
                    stats.ttl = new Date().getTime();
                    if (stats.start) {
                        update_stats(data.id);
                    }
                }
                last_sc = data;
            }
		} else if (data.type == 'msg') {
			if (auto_get_food && (map_id == 'home' || map_id == 'yz') && data.ch == 'sys'
				 	&& /^(.+)和(.+)于今日大婚，在醉仙楼大摆宴席，婚礼将在一分钟后开始。$/.test(data.content)) {
				var h = add_listener(['items', 'cmds', 'text'], function(data) {
					if (data.type == 'items') {
						for (var i = 0; i < data.items.length; i++) {
							if (data.items[i].name == '<hio>婚宴礼桌</hio>' || data.items[i].name == '<hiy>婚宴礼桌</hiy>') {
								remove_listener(h);
								send_cmd('get all from ' + data.items[i].id);
								execute_cmd(biguan ? 'biguan' : 'wakuang');
								break;
							}
						}
					} else if (data.type == 'text') {
						if (/^店小二拦住你说道：这位(.+)，不好意思，婚宴宾客已经太多了。$/.test(data.msg)) {
							remove_listener(h);
							execute_cmd(biguan ? 'biguan' : 'wakuang');
						}
                        if (/^店小二拦住你说道：怎么又是你，每次都跑这么快，等下再进去。$/.test(data.msg)) {
							remove_listener(h);
							execute_cmd(biguan ? 'biguan' : 'wakuang');
						}
					} else if (data.type == 'cmds') {
						for (var i = 0; i < data.items.length; i++) {
							if (data.items[i].name == '11金贺礼' || data.items[i].name == '1金贺礼') {
								send_cmd(data.items[i].cmd + ';go up');
								break;
							} 
						}
					}
				});
				send_cmd('stopstate;jh fam 0 start;go north;go north;go east;go up');
			}
		}
	});
	function get_map_id(path) {
		var i = path.indexOf('/');
		return i >= 0 ? path.substr(0, i) : path;
	}
	function get_text(str) {
		return $.trim($('<body>' + str + '</body>').text());
	}
	function get_name(name_str) {
		var name = get_text(name_str).replace(/<.*>/g, '');
		var i = name.lastIndexOf(' ');
		if (i >= 0) {
			name = name.substr(i + 1);
		}
		return name;
	}
	function get_title(name_str) {
		var name = get_text(name_str);
		var i = name.lastIndexOf(' ');
		if (i >= 0) {
			return name.substr(0, i);
		}
		return '';
	}
	function find_item(name) {
		for (var [key, value] of items) {
            var name1 = get_text(name).replace(/<.*>/g, '');
            var value1 = get_text(value).replace(/<.*>/g, '');
			if (value1 == name1) {
// 			if (value == name) {
				return key;
			}
		}
		return null;
	}
	function auto_loot(id, name) {
		if (no_loot) {
			return false;
		}
		var r = name.match(/^(.+)的尸体$/);
		if (r) {
			var i = $.inArray(r[1], kill_targets);
			if (i >= 0) {
				send_cmd('get all from ' + id);
				kill_targets.splice(i, 1);
				if (auto_loot_timeout && kill_targets.length == 0) {
					clearTimeout(auto_loot_timeout);
					auto_loot_timeout = undefined;
				}
				return true;
			}
		}
		return false;
	}
    function update_stats(id) {
        var stats = all_stats.get(id);
        if (stats) {
            var $c = $('div.room-item[itemid="' + id + '"]');
            if ($c.length > 0) {
                var $e = $('span.item-stats', $c);
                if ($e.length == 0) {
                    $e = $('<span class="item-stats"></span>');
                    $c.append($e);
                }
                var hp_percent = parseInt(stats.hp * 100 / stats.max_hp);
                var damage_percent = Math.round(stats.damage * 10000 / stats.max_hp) / 100;
                $e.html('<hic>' + stats.hp + '/' + stats.max_hp + '(' + hp_percent + '%) '
                        + stats.damage + '(' + damage_percent + '%)</hic>');
            }
        }
    }
    function report_stats(id) {
        var stats = all_stats.get(id);
        if (stats) {
            $('div.room-item[itemid="' + id + '"] > span.item-stats').detach();
            if (stats.start) {
                var damage_percent = Math.round(stats.damage * 10000 / stats.max_hp) / 100;
                var msg = stats.name + '伤害统计：总血量' + stats.max_hp + '，造成伤害共' + stats.damage
                        + '，伤害占比为' + damage_percent + '%';
                if (stats.ttl >= stats.start + 1000) {
                    var dur = Math.round((stats.ttl - stats.start) / 10) / 100;
                    var dps = Math.round(stats.damage * 100000 / (stats.ttl - stats.start)) / 100;
                    msg += '，输出时长' + dur + '秒，DPS为' + dps + '/秒';
                }
                show_msg('<hic>' + msg + '</hic>');
            }
            all_stats.delete(id);
        }
    }
    setInterval(function() {
        var t = new Date().getTime();
		for (var [id, stats] of all_stats) {
			if (t - stats.ttl >= 60000) {
				report_stats(id);
			}
		}
    }, 3000);
	
	var has_send_stopstate = false;
	function stop_state() {
		send_cmd('stopstate');
		has_send_stopstate = true;
		setTimeout(function() {
			has_send_stopstate = false;
		}, 500);
	}
	
	function has_perform(id) {
		return $('span.pfm-item[pid="' + id + '"]').length > 0;
	}
	function can_perform(id) {
		return !cooldowns.get(id) && has_perform(id);
	}
	function try_perform(id) {
		if (!can_perform(id)) {
			return false;
		}
		send_cmd('perform ' + id);
		return true;
	}
	function create_target(target_id) {
		if (all_targets.size > 20) {
			for (var [id, target] of all_targets) {
				if (new Date().getTime() - target.ttl > 900000) {
					all_targets.delete(id);
				}
			}
		}
		var target = {buffs: new Map(), hp: 0, ttl: 0};
		all_targets.set(target_id, target);
		return target;
	}
	function get_target(target_id) {
		if (target_id) {
			return all_targets.get(target_id);
		}
		var ret;
		for (var [id, target] of all_targets) {
			if (!ret || ret.ttl < target.ttl) {
				ret = target;
			}
		}
		return ret;
	}
	
	var task_h_timer, task_h_listener;
	function stop_task() {
		if (task_h_timer) {
			clearInterval(task_h_timer);
			task_h_timer = undefined;
			log('task stopped.');
		} else if (task_h_listener) {
			remove_listener(task_h_listener);
			task_h_listener = undefined;
			log('task stopped.');
		}
	}
	function add_task_timer(fn, interval) {
		stop_task();
		task_h_timer = setInterval(fn, interval);
	}
	function add_task_listener(types, fn) {
		stop_task();
		task_h_listener = add_listener(types, fn);
	}
	function todo(fn) {
		var h = add_listener('text', function(data) {
			if (data.msg == '你要看什么？') {
				remove_listener(h);
				if (typeof fn === 'function') {
					fn();
				} else {
					execute_cmd(fn);
				}
			}
		});
		send_cmd('look 1');
	}

	var boss_trigger, task_trigger, party_trigger, wudao_trigger;
	var lian_trigger, lian_skill, lian_index, xue_trigger, xue_skill, dazuo_trigger;
	var xiangyang_trigger;
	function execute_cmd(cmd) {
		if (cmd.substr(0, 6) == '#loop ') {
			cmd = $.trim(cmd.substr(6));
			if (cmd) {
				var interval = 500;
				var i = cmd.indexOf(' ');
				if (i >= 0) {
					var t = parseInt(cmd.substr(0, i));
					if (!isNaN(t)) {
						interval = t;
						cmd = $.trim(cmd.substr(i + 1));
					}
				}
				if (cmd) {
					stop_task();
					log('starting loop...');
					var pc;
					add_task_timer(function() {
						if (!pc) {
							pc = process_cmdline(cmd);
						}
						if (pc) {
							send_cmd(pc);
						}
					}, interval);
				}
			}
		} else if (cmd == '#stop') {
			combat_btn.removeClass('hide-tool');
			stop_task();
		} else if (cmd.substr(0, 7) == '#alias ') {
			var alias = $.trim(cmd.substr(7));
			var key, value, i = alias.indexOf(' ');
			if (i >= 0) {
				key = $.trim(alias.substr(0, i));
				value = $.trim(alias.substr(i + 1));
			} else {
				key = alias;
				value = '';
			}
			if (value) {
				if (value != aliases.get(key)) {
					aliases.set(key, value);
					log("set alias ok.");
				}
			} else {
				if (aliases.has(key)) {
					aliases.delete(key);
					log("alias removed.");
				}
			}
		} else if (cmd == '#no_loot on') {
			log('set no_loot on.');
			no_loot = true;
		} else if (cmd == '#no_loot off') {
			log('set no_loot off.');
			no_loot = false;
		} else if (cmd == '#no_loot') {
			if (no_loot) {
				execute_cmd('#no_loot off');
			} else {
				execute_cmd('#no_loot on');
			}
		} else if (cmd == '#auto_pfm on') {
			log('set auto_pfm on.');
			execute_cmd('set_auto_pfm');
			auto_pfm = true;
		} else if (cmd == '#auto_pfm off') {
			log('set auto_pfm off.');
			execute_cmd('no_auto_pfm');
			auto_pfm = false;
		} else if (cmd == '#auto_pfm') {
			if (auto_pfm) {
				execute_cmd('#auto_pfm off');
			} else {
				execute_cmd('#auto_pfm on');
			}
		} else if (cmd == '#echo on') {
			log('set echo on.');
			echo_btn.addClass('hide-tool');
			echo = true;
		} else if (cmd == '#echo off') {
			log('set echo off.');
			echo_btn.removeClass('hide-tool');
			echo = false;
		} else if (cmd == '#echo') {
			if (echo) {
				execute_cmd('#echo off');
			} else {
				execute_cmd('#echo on');
			}
		} else if (cmd == '#auto_get_food on') {
			log('set auto_get_food on.');
			auto_get_food = true;
		} else if (cmd == '#auto_get_food off') {
			log('set auto_get_food off.');
			auto_get_food = false;
		} else if (cmd == '#auto_get_food') {
			if (auto_get_food) {
				execute_cmd('#auto_get_food off');
			} else {
				execute_cmd('#auto_get_food on');
			}
		} else if (cmd == '#t+ boss') {
			if (!boss_trigger) {
				log('open boss trigger.');
				boss_btn.addClass('hide-tool');
				var boss_target, action = 0, paths, index, boss_id, kill_time;
				boss_trigger = add_listener(['combat', 'dispfm', 'status', 'die', 'dialog', 'text', 'msg'], function(data) {
					if (data.type == 'msg' && (map_id == 'home' || map_id == 'yz') && data.ch == 'rumor') {
						var r = data.content.match(/^听说(.+)出现在(.+)-(.+)一带。$/);
                        if (r) {
                            log('boss: ' + r[1] + ' at ' + r[2] + '-' + r[3]);
                            if ((r[1].indexOf("童姥") > -1) || (r[1].indexOf("枯荣") > -1) || (r[1].indexOf("张无忌") > -1)) {
                                log(r[1] + '打不过，不敢去！')
                            } else {
                                boss_target = r[1];
                                paths = find_path(r[2], r[3]);
                                if (paths.length > 0) {
                                    action = 1;
                                    index = 0;
                                    execute_cmd('stopstate;before_kill;' + paths[0] + ';look 1');
                                } else {
                                    log('room ' + r[2] + '-' + r[3] + ' not found');
                                    action = 0;
                                }
                            }
                        }
					} else if (action == 1 && data.type == 'text' && data.msg == '你要看什么？') {
						var id = find_item(boss_target);
						if (id) {
							log('waiting kill ' + id);
							//execute_cmd('before_kill');
                            //execute_cmd('kill ' + id);
							kill_time = new Date().getTime();
							boss_id = id;
							action = 2;
							setTimeout(function() {
								if (action == 2) {
									log('wait timeout');
									execute_cmd(biguan ? 'biguan' : 'wakuang');
									action = 0;
								}
							}, 20000);
						} else if (++index < paths.length) {
							setTimeout(function() {
								execute_cmd(paths[index] + ';look 1');
							}, 1000);
						} else {
							log('boss ' + boss_target + ' not found');
							setTimeout(function() {
								execute_cmd(biguan ? 'biguan' : 'wakuang');
							}, 1000);
							action = 0;
						}
					} else if (action == 2 && data.type == 'dispfm') {
						kill_time = new Date().getTime() + data.rtime;
					} else if (action == 2 && data.type == 'text') {
						var r = data.msg.match(/(.+)对著(.+)喝道：「.+！今日不是你死就是我活！」/);
						if (r && r[2] == boss_target) {
							setTimeout(function() {
								log('kill ' + boss_id);
								var t = kill_time - new Date().getTime();
								if (t <= 0) {
                                    new PFMS('kill ' + boss_id).check_buff().perform_busy().perform_attack().do();
								} else {
									setTimeout(function() {
                                        new PFMS('kill ' + boss_id).check_buff().perform_busy().perform_attack().do();
									}, t); 
								}
							}, 1000); 
							action = 3;
						}
					} else if (action == 3 && data.type == 'text') {
						var fail = false;
						if (data.msg == '你要攻击谁？') {
							fail = true;
						} else {
							var r = data.msg.match(/(.+)对你拱手说道：这位.+，不知.+有何得罪之处？/);
							if (r && r[1] == boss_target) {
								fail = true;
							}
						}
						if (fail) {
							log('kill boss failed');
							setTimeout(function() {
								execute_cmd(biguan ? 'biguan' : 'wakuang');
							}, 1000);
							action = 0;
						}
					} else if (action == 3 && data.type == 'status' && data.id == my_id && data.action == 'remove') {
						new PFMS().check_buff().do();
					} else if (action == 3 && data.type == 'status' && data.id == boss_id && data.action == 'remove') {
						new PFMS().perform_busy(data.id).do();
					} else if (action == 3 && data.type == 'pfm_ok') {
						new PFMS().check_buff().perform_busy(data.id).perform_attack().do();
					} else if (action == 3 && data.type == 'combat' && data.end) {
						log('kill boss finished');
						setTimeout(function() {
							execute_cmd(biguan ? 'biguan' : 'wakuang');
							action = 0;
						}, 1000);
					} else if (action == 3 && data.type == 'dialog' && data.dialog == 'pack') {
						if (/^<wht>.+<\/wht>$/.test(data.name)) {
							send_cmd('drop ' + data.id);
						}
					} else if (action > 0 && data.type == 'die') {
						log('dead and relive');
						send_cmd('relive');
                        setTimeout(function() {
                            send_cmd('liaoshang');
                        }, 500);
						action = 4;
					} else if (action == 4 && data.type == 'text' && data.msg == '你内力不够，无法治疗自身伤势。') {
                        setTimeout(function() {
                            send_cmd('liaoshang');
                        }, 3000);
					} else if (action == 4 && data.type == 'status' && data.id == my_id && data.action == 'remove' && data.sid == 'xuruo') {
						execute_cmd(biguan ? 'biguan' : 'wakuang');
						action = 0;
					}
				});
			}
		} else if (cmd == '#t- boss') {
			if (boss_trigger) {
				log('close boss trigger.');
				boss_btn.removeClass('hide-tool');
				remove_listener(boss_trigger);
				boss_trigger = undefined;
			}
		} else if (cmd == '#t+ task') {
			if (!task_trigger) {
				log('open task trigger.');
				task_btn.addClass('hide-tool');
				var task_npc_id, task_target, do_find_target = false, paths, index;
				task_trigger = add_listener('text', function(data) {
					if (do_find_target && data.msg == '你要看什么？') {
						var id = find_item(task_target);
						if (id) {
							new PFMS('kill ' + id).check_buff().perform_busy().perform_attack().do();
							do_find_target = false;
						} else if (++index < paths.length) {
							setTimeout(function() {
								execute_cmd(paths[index] + ';look 1');
							}, 1000);
						} else {
							log('target ' + task_trigger + ' not found');
							do_find_target = false;
						}
					} else {
						var r = data.msg.match(/^程药发对你说道：(.+)作恶多端，还请.+为民除害，听说他最近在(.+)\-(.+)出现过。$/);
						if (r) {
							task_target = r[1];
							paths = find_path(r[2], r[3]);
							if (paths.length > 0) {
								do_find_target = true;
								index = 0;
								execute_cmd(paths[0] + ';look 1');
							} else {
								log('room ' + r[2] + '-' + r[3] + ' not found');
							}
						} else {
							r = data.msg.match(/^<hig>你的追捕任务完成了，目前完成(\d+)\/(\d+)个，已连续完成(\d+)个。<\/hig>$/);
							if (r) {
								task_target = undefined;
								do_find_target = false;
								if (parseInt(r[1]) >= parseInt(r[2])) {
									execute_cmd('#t- task');
								} else {
									setTimeout(function() {
										execute_cmd('fly yz;w;n;n;liaoshang');//;dazuo');
                                        task_npc_id = find_item('程药发');//zyb
                                        execute_cmd('stopstate;ask1 ' + 'imc9278bc35'); //zyb
										var h = setInterval(function() {
											if (check_task_go()) {
												clearInterval(h);
												if (!task_npc_id) {
													task_npc_id = find_item('程药发');
												}
												if (task_npc_id) {
													execute_cmd('stopstate;ask1 ' + task_npc_id);
												} else {
													log('npc 程药发 not found');
												}
											}
										}, 5000);
									}, 1000);
								}
							} else if (/^程药发对你说道：最近没有在逃的逃犯了，你先休息下吧。$/.test(data.msg)) {
								execute_cmd('#t- task');
							}
						}
					}
				});
			}
		} else if (cmd == '#t- task') {
			if (task_trigger) {
				log('close task trigger.');
				task_btn.removeClass('hide-tool');
				remove_listener(task_trigger);
				task_trigger = undefined;
			}
		} else if (cmd == '#t+ party') {
			if (!party_trigger) {
				log('open party trigger.');
				party_btn.addClass('hide-tool');
				var task_npc_id, task_item, task, action = 0;
				var go_task = function(item_id) {
					action = 0;
					if (task_npc_id) {
						if (item_id) {
							send_cmd('task sm ' + task_npc_id + ' give ' + item_id);
						} else {
							send_cmd('task sm ' + task_npc_id);
						}
					} else {
						todo(function () {
							var id = find_item(task_npc);
							if (id) {
								task_npc_id = id;
								go_task(item_id);
							} else {
								log('npc ' + task_npc + ' not found');
							}
						});
					}
				};
				party_trigger = add_listener(['text', 'dialog'], function(data) {
					if (action == 1 && data.type == 'text' && data.msg == '你要看什么？') {
						var id = find_item(task.npc);
						if (id) {
							task.npc_id = id;
							send_cmd('pack ' + id);
							action = 2;
						} else {
							log('npc ' + task.npc + ' not found');
							action = 0;
						}
					} else if (action == 2 && data.type == 'dialog' && data.dialog == 'pack2' && data.id == task.npc_id) {
						var item_id;
						for (var i = 0; i < data.items.length; i++) {
							var item = data.items[i];
							if (item.name == task_item) {
								item_id = item.id;
								break;
							}
						}
						if (item_id) {
							send_cmd('dc ' + task.npc_id + ' stopstate;dc ' + task.npc_id + ' give ' + my_id + ' 1 ' + item_id);
							if (task.sub_type == 'drug') {
								send_cmd('dc ' + task.npc_id + ' cai');
							} else if (task.sub_type == 'fish') {
								send_cmd('dc ' + task.npc_id + ' diao');
							}
							action = 3;
						} else {
							log('item ' + task_item + ' not found');
							action = 0;
						}
					} else if (action == 3 && data.type == 'dialog' && data.dialog == 'pack') {
						var item_id;
						if (data.name) {
							if (data.name == task_item) {
								item_id = data.id;
							}
						} else if (data.items) {
							for (var i = 0; i < data.items.length; i++) {
								var item = data.items[i];
								if (item.name == task_item) {
									item_id = item.id;
									break;
								}
							}
						}
						if (item_id) {
							setTimeout(function() {
								execute_cmd(task_path);
								go_task(item_id);
							}, 1000);
						}
					} else if (action == 4 && data.type == 'dialog' && data.dialog == 'pack' && data.items) {
						var item_id;
						for (var i = 0; i < data.items.length; i++) {
							var item = data.items[i];
							if (item.name == task_item) {
								item_id = item.id;
								break;
							}
						}
						if (item_id) {
							go_task(item_id);
						} else {
							log('item ' + task_item + ' not found');
							action = 0;
						}
					} else if (action == 5 && data.type == 'dialog' && data.dialog == 'list') {
						var item_id;
						for (var i = 0; i < data.stores.length; i++) {
							var item = data.stores[i];
							if (item.name == task_item) {
								item_id = item.id;
								break;
							}
						}
						if (item_id) {
							send_cmd('qu 1 ' + item_id + ';pack');
							action = 3;
						} else {
							log('item ' + task_item + ' not found');
							action = 0;
						}
					} else if (action == 6 && data.type == 'text' && data.msg == '你要看什么？') {
						var id = find_item(task.npc);
						if (id) {
							task.npc_id = id;
							send_cmd('list ' + id);
							action = 7;
						} else {
							log('npc ' + task.npc + ' not found');
							action = 0;
						}
					} else if (action == 7 && data.type == 'dialog' && data.dialog == 'list' && data.seller == task.npc_id) {
						var item_id;
						for (var i = 0; i < data.selllist.length; i++) {
							var item = data.selllist[i];
							if (item.name == task_item) {
								item_id = item.id;
								break;
							}
						}
						if (item_id) {
							send_cmd('buy 1 ' + item_id + ' from ' + task.npc_id);
							action = 3;
						} else {
							log('item ' + task_item + ' not found');
							action = 0;
						}
					} else if (data.type == 'text') {
						var is_new_task = true;
						var r = data.msg.match(/^(.+)对你说道：最近师门物资紧缺，你去帮我找些(.+)来。$/);
						if (!r) {
							r = data.msg.match(/^(.+)对你说道：为师最近突然想尝一下(.+)，你去帮我找一下吧。$/);
						}
						if (!r) {
							r = data.msg.match(/^(.+)对你说道：最近师门扩招了，需要一些装备衣物补充下，你去帮我找一件(.+)来。$/);
						}
						if (!r) {
							r = data.msg.match(/^(.+)沉吟半晌对你说道：为师最近练功到了瓶颈，需要一些武功秘籍来参考一下，你去帮我找一份(.+)吧。$/);
						}
						if (!r) {
							r = data.msg.match(/^(.+)对你说道：我要的是(.+)，你要是找不到就换别的吧。$/);
							is_new_task = false;
						}
						if (r) {
							if (is_new_task || task_item != r[2]) {
								task_item = r[2];
								task = find_task_items(task_item);
								if (task) {
									action = 0;
									if (task.type == 'give') {
										execute_cmd(task.cmd + ';look 1');
										action = 1;
									} else if (task.type == 'pack') {
										send_cmd('pack');
										action = 4;
									} else if (task.type == 'store') {
										execute_cmd(task.cmd + ';store');
										action = 5;
									} else if (task.type == 'shop') {
										execute_cmd(task.cmd + ';look 1');
										action = 6;
									}
								} else {
									log('task item ' + task_item + ' not found');
								}
							} else {
								send_cmd('pack');
								action = 4;
							}
						} else {
							r = data.msg.match(/^你的师门任务完成了，目前完成(\d+)\/(\d+)个，连续完成(\d+)个。$/);
							if (r) {
								task_item = undefined;
								action = 0;
								if (parseInt(r[1]) >= parseInt(r[2])) {
									execute_cmd('#t- party');
								} else {
									setTimeout(function() {
										go_task();
									}, 500);
								}
							} else if (/^(.+)对你点头道：辛苦了， 你先去休息一下吧。$/.test(data.msg)) {
								execute_cmd('#t- party');
							}
						}
					}
				});
			}
		} else if (cmd == '#t- party') {
			if (party_trigger) {
				party_btn.removeClass('hide-tool');
				log('close party trigger.');
				remove_listener(party_trigger);
				party_trigger = undefined;
			}
		} else if (cmd == '#t+ wudao') {
			if (!wudao_trigger) {
				log('open wudao trigger.');
				wudao_btn.addClass('hide-tool');
				var action = 0;
				wudao_trigger = add_listener(['combat', 'status', 'pfm_ok', 'items', 'text'], function(data) {
					if (room.path == 'wudao/ta' && data.type == 'combat') {
						if (data.start) {
							new PFMS().check_buff().perform_attack(1).do();
							action = 1;
						}
					} else if (action == 0 && data.type == 'items') {
						if (room.name == '武道塔-第' + auto_wudao_max + '层') {
							execute_cmd('#t- wudao');
						} else {
							for (var i = 0; i < data.items.length; i++) {
								var title = get_title(data.items[i].name);
								if (title == '武道塔守护者') {
									send_cmd('kill ' + data.items[i].id);
									break;
								}
							}
						}
					} else if (action == 1 && in_combat && data.type == 'status' && data.id == my_id && data.action == 'remove') {
						new PFMS().check_buff().perform_attack(1).do();
					} else if (action == 1 && in_combat && data.type == 'pfm_ok') {
						new PFMS().check_buff().perform_attack(1).do();
					} else if (action == 1 && data.type == 'text' && data.msg == '<hig>恭喜你战胜了武道塔守护者，你现在可以进入下一层。</hig>') {
						setTimeout(function() {
							send_cmd('go up');
						}, 500);
						action = 0;
					} else if (action == 1 && data.type == 'text' && data.msg == '<hir>你的挑战失败了。</hir>') {
						execute_cmd('#t- wudao');
						execute_cmd('fly yz;n;n;w;heal');
					}
				});
			}
		} else if (cmd == '#t- wudao') {
			if (wudao_trigger) {
				log('close wudao trigger.');
				wudao_btn.removeClass('hide-tool');
				remove_listener(wudao_trigger);
				wudao_trigger = undefined;
			}
		} else if (cmd == '#t+ lian') {
			if (lian_trigger) {
				execute_cmd('#t- lian');
			}
			if (xue_trigger) {
				execute_cmd('#t- xue');
			}
			if (dazuo_trigger) {
				execute_cmd("#t- dazuo");
			}
			lian_index = 0;
			log('open lian trigger.');
			lian_btn.addClass('hide-tool');
			lian_trigger = add_listener(['msg', 'text'], function(data) {
				if (data.type == 'text') {
					if (data.msg.match(/^也许是缺乏实战经验，你觉得你的.+已经到了瓶颈了。$/)
							|| data.msg == '你的基本功火候未到，必须先打好基础才能继续提高。') {
						if (++lian_index < full_skills.length) {
							send_cmd('stopstate;lianxi ' + full_skills[lian_index]);
						} else {
							execute_cmd('#t- lian');
							setTimeout(function() {
								execute_cmd(biguan ? 'stopstate;xiulian' : 'wakuang');
							}, 1000);
						}
					} else if (data.msg == '你必须找把刀才能学五虎断门刀。') {
						execute_cmd('eq_blade');
						setTimeout(function() {
							send_cmd('lianxi ' + full_skills[lian_index]);
						}, 3000);
					} else if (data.msg == '你的潜能不够，无法继续练习下去了。') {
						execute_cmd('#t- lian');
						setTimeout(function() {
							execute_cmd(biguan ? 'stopstate;xiulian' : 'wakuang');
						}, 1000);
					} else {
						var r = data.msg.match(/^<hig>你获得了(\d+)点经验，(\d+)点潜能。<\/hig>$/);
						if (r) {
							if (!biguan && parseInt(r[2]) < 80) {
								send_cmd('stopstate;go east;go east;go north;go enter;go west;lianxi ' + full_skills[lian_index]);
							} else if (biguan && parseInt(r[2]) < 130) {
								send_cmd('stopstate;lianxi ' + full_skills[lian_index]);
							}
						}
					}
				} else if (data.type == 'msg' && data.ch == 'sys') {
					var r = data.content.match(/^(.+)捡到一本挖矿指南，学会了里面记载的挖矿技巧，所有人的挖矿效率都提高了。$/);
					if (r) {
						execute_cmd(biguan ? 'stopstate;xiulian' : 'wakuang');
					}
				}
			});
		} else if (cmd.substr(0, 9) == '#t+ lian ') {
			if (lian_trigger) {
				execute_cmd('#t- lian');
			}
			if (xue_trigger) {
				execute_cmd('#t- xue');
			}
			if (dazuo_trigger) {
				execute_cmd("#t- dazuo");
			}
			lian_skill = $.trim(cmd.substr(9));
			log('open lian ' + lian_skill + ' trigger.');
			lian_trigger = add_listener(['msg', 'text'], function(data) {
				if (data.type == 'text') {
					if (data.msg.match(/^也许是缺乏实战经验，你觉得你的.+已经到了瓶颈了。$/)
							|| data.msg == '你的基本功火候未到，必须先打好基础才能继续提高。'
							|| data.msg == '你的潜能不够，无法继续练习下去了。') {
						execute_cmd('#t- lian');
						setTimeout(function() {
							execute_cmd(biguan ? 'stopstate;xiulian' : 'wakuang');
						}, 1000);
					} else if (data.msg == '你必须找把刀才能学五虎断门刀。') {
						execute_cmd('eq_blade');
						setTimeout(function() {
							send_cmd('lianxi ' + lian_skill);
						}, 3000);
					} else {
						var r = data.msg.match(/^<hig>你获得了(\d+)点经验，(\d+)点潜能。<\/hig>$/);
						if (r) {
							if (!biguan && parseInt(r[2]) < 80) {
								send_cmd('stopstate;go east;go east;go north;go enter;go west;lianxi ' + lian_skill);
							} else if (biguan && parseInt(r[2]) < 130) {
								send_cmd('stopstate;lianxi ' + lian_skill);
							}
						}
                    }
				} else if (data.type == 'msg' && data.ch == 'sys') {
					var r = data.content.match(/^(.+)捡到一本挖矿指南，学会了里面记载的挖矿技巧，所有人的挖矿效率都提高了。$/);
					if (r) {
						execute_cmd(biguan ? 'stopstate;xiulian' : 'wakuang');
					}
				}
			});
		} else if (cmd == '#t- lian') {
			if (lian_trigger) {
				if (lian_skill) {
					log('close lian ' + lian_skill + ' trigger.');
				} else {
					log('close lian trigger.');
				}
				lian_btn.removeClass('hide-tool');
				remove_listener(lian_trigger);
				lian_trigger = undefined;
				lian_skill = undefined;
				lian_index = undefined;
			}
		} else if (cmd.substr(0, 8) == '#t+ xue ') {
			if (xue_trigger) {
				execute_cmd('#t- xue');
			}
			if (lian_trigger) {
				execute_cmd('#t- lian');
			}
			if (dazuo_trigger) {
				execute_cmd("#t- dazuo");
			}
			xue_skill = $.trim(cmd.substr(8));
			log('open xue ' + xue_skill + ' trigger.');
			xue_trigger = add_listener(['msg', 'text'], function(data) {
				if (data.type == 'text') {
					if (data.msg == '你的潜能不够，无法继续学习下去了。'
							|| data.msg == '这项技能你的程度已经不输你师父了。'
							|| data.msg == '你要跟谁学习技能？') {
						execute_cmd('#t- xue');
						setTimeout(function() {
							execute_cmd(biguan ? 'stopstate;xiulian' : 'wakuang');
						}, 1000);
					} else {
						var r = data.msg.match(/^<hig>你获得了(\d+)点经验，(\d+)点潜能。<\/hig>$/);
						if (r) {
							if (!biguan && parseInt(r[2]) < 80) {
								send_cmd('stopstate;go east;go east;go north;go enter;go west');
								setTimeout(function() {
									execute_cmd('xue ' + xue_skill);
								}, 200);
							} else if (biguan && parseInt(r[2]) < 130) {
								send_cmd('stopstate;xue ' + xue_skill);
							}
						}
					}
				} else if (data.type == 'msg' && data.ch == 'sys') {
					var r = data.content.match(/^(.+)捡到一本挖矿指南，学会了里面记载的挖矿技巧，所有人的挖矿效率都提高了。$/);
					if (r) {
						execute_cmd(biguan ? 'stopstate;xiulian' : 'wakuang');
					}
				}
			});
		} else if (cmd == '#t- xue') {
			if (xue_trigger) {
				log('close xue ' + xue_skill + ' trigger.');
				remove_listener(xue_trigger);
				xue_trigger = undefined;
				xue_skill = undefined;
			}
		} else if (cmd == '#t+ dazuo') {
			if (dazuo_trigger) {
				execute_cmd("#t- dazuo");
			}
			if (lian_trigger) {
				execute_cmd('#t- lian');
			}
			if (xue_trigger) {
				execute_cmd('#t- xue');
			}
			log('open dazuo trigger.');
			dazuo_trigger = add_listener(['msg', 'text'], function(data) {
				if (data.type == 'text') {
					if (data.msg == '<hic>你觉得你的经脉充盈，已经没有办法再增加内力了。</hic>') {
						execute_cmd('#t- dazuo');
						setTimeout(function() {
							execute_cmd(biguan ? 'stopstate;xiulian' : 'wakuang');
						}, 1000);
					} else {
						var r = data.msg.match(/^<hig>你获得了(\d+)点经验，(\d+)点潜能。<\/hig>$/);
						if (r) {
							if (!biguan && parseInt(r[2]) < 80) {
								send_cmd('stopstate;go east;go east;go north;go enter;go west;dazuo');
							} else if (biguan && parseInt(r[2]) < 130) {
								send_cmd('stopstate;dazuo');
							}
						}
					}
				} else if (data.type == 'msg' && data.ch == 'sys') {
					var r = data.content.match(/^(.+)捡到一本挖矿指南，学会了里面记载的挖矿技巧，所有人的挖矿效率都提高了。$/);
					if (r) {
						execute_cmd(biguan ? 'stopstate;xiulian' : 'wakuang');
					}
				}
			});
		} else if (cmd == '#t- dazuo') {
			if (dazuo_trigger) {
				log('close dazuo trigger.');
				remove_listener(dazuo_trigger);
				dazuo_trigger = undefined;
			}
		} else if (cmd == '#t+ xiangyang') {
			if (!xiangyang_trigger) {
				log('open xiangyang trigger.');
				xiangyang_btn.addClass('hide-tool');
				xiangyang_trigger = add_listener(['items', 'itemadd', 'dialog', 'status'], function(data) {
					if (data.type == 'items') {
						for (var i = 0; i < data.items.length; i++) {
							var title = get_title(data.items[i].name);
                            //log('this title is :'+title);
						    if (((title.indexOf('古兵') > -1))|| (title.indexOf('夫长') > -1)){
								//stop_state();
                                //log(title);
                                setTimeout(function() {
                                    send_cmd('kill ' + data.items[i].id);
                                },1000);
							} /*else if (title == '百夫长') {
								stop_state();
								var id = data.items[i].id;
								setTimeout(function() {
									send_cmd('kill ' + id);
								}, 500);
							}*/
						}
					} else if (data.type == 'itemadd') {
						var title = get_title(data.name);
                        //log('this title is :'+title);
// 						if (((title.indexOf('古兵') > -1))|| (title.indexOf('夫长') > -1)){
// 							//stop_state();
//                             //log(title);
//                             setTimeout(function() {
//                                 send_cmd('kill ' + data.id);
//                             },1000);
                        if (((title.indexOf('北丐') > -1))|| (title.indexOf('掌门') > -1)|| (title.indexOf('祖师') > -1)|| (title.indexOf('真人') > -1)|| (title.indexOf('方丈') > -1)
                            //||(title.indexOf("首席") > -1) || (title.indexOf("大师兄") > -1) || (title.indexOf("大师姐") > -1)|| (title.indexOf("长老") > -1)|| (title.indexOf("三十七") > -1)
                           ){
							//stop_state();
                            //log(title);
                            setTimeout(function() {
                                send_cmd('kill ' + data.id);
                            },100);
						} /*else if (title == '百夫长') {
							stop_state();
                            var _id = data.id;
							setTimeout(function() {
								send_cmd('kill ' + _id);
							}, 500);
						}*/
					} else if (data.type == 'dialog' && data.dialog == 'pack') {
						if (data.can_eq && (/^<hig>.+<\/hig>$/.test(data.name) || /^<hic>.+<\/hic>$/.test(data.name)|| /^<hiy>.+<\/hiy>$/.test(data.name)|| /^<HIZ>.+<\/HIZ>$/.test(data.name))) {
							send_cmd('fenjie ' + data.id);
						}
					} else if (in_combat && data.type == 'status' && data.id == my_id && data.action == 'remove') {
						new PFMS().check_buff().do();
					}
				});
			}
		} else if (cmd == '#t- xiangyang') {
			if (xiangyang_trigger) {
				log('close xiangyang trigger.');
				xiangyang_btn.removeClass('hide-tool');
				remove_listener(xiangyang_trigger);
				xiangyang_trigger = undefined;
			}
		} else if (cmd == '#store') {
			var stores;
			var h = add_listener('dialog', function(data) {
				if (data.dialog == 'list') {
					stores = data.stores;
				} else if (data.dialog == 'pack') {
					remove_listener(h);
                    var cmds = [];
					for (var i = 0; i < data.items.length; i++) {
						for (var j = 0; j < stores.length; j++) {
							if (data.items[i].name == stores[j].name) {
                                cmds.push('store ' + data.items[i].count + ' ' + data.items[i].id);
								break;
							}
						}
					}
                    if (cmds.length > 0) {
                        send_cmd(cmds);
                    }
				}
			});
			send_cmd('store;pack');
        } else if (cmd.substr(0, 19) == '#auto_finish_party ') {
            log('open auto finish party...');
            var item_id = $.trim(cmd.substr(19));
			add_task_listener('msg', function(data) {
                if (data.ch == 'sys' && data.content.indexOf('排行榜奖励发放完毕，进入社交系统消息中收取。') >= 0) {
                    console.log(data);
                    execute_cmd('stopstate;' + task_path);
                    todo(function() {
                        var id = find_item(task_npc);
                        if (id) {
                            send_cmd('task sm ' + id + ' ' + item_id);
                        }
                        todo(biguan ? 'biguan' : 'wakuang');
                    });
                    execute_cmd('#stop');
                }
			});
		} else if (cmd == '#combat') {
			log('open auto combat...');
			combat_btn.addClass('hide-tool');
			add_task_listener(['combat', 'status', 'pfm_ok'], function(data) {
				if (data.type == 'combat' && data.start) {
					new PFMS().check_buff().perform_busy().perform_attack().do();
				} else if (in_combat && data.type == 'status' && data.id == my_id && data.action == 'remove') {
					new PFMS().check_buff().do();
				} else if (in_combat && data.type == 'status' && data.id != my_id && data.action == 'remove') {
					new PFMS().perform_busy(data.id).do();
				} else if (in_combat && data.type == 'pfm_ok') {
					new PFMS().check_buff().perform_busy().perform_attack().do();
				} else if (in_combat && data.type == 'status' && data.id != my_id && data.action == 'add') {
					if (data.sid == 'busy') {
                        log('busy time: ' + data.duration);
                    } else if (data.sid == 'faint') {
                        log('faint time: ' + data.duration);
                    }
				}
			});
		} else if (cmd == '#combat 1') {
			log('open auto combat mode 1...');
			var action_state, is_busy;
			add_task_listener(['combat', 'status', 'dispfm'], function(data) {
				if (data.type == 'combat') {
					if (data.start) {
						is_busy = false;
						action_state = 1;
						send_cmd('eq wfdw1f721e5;perform force.xi;perform dodge.power;perform sword.wu;perform unarmed.chan');
					}
				} else if (in_combat && data.type == 'status') {
					if (data.action == 'add' && data.id != my_id && data.sid == 'busy') {
						is_busy = true;
					} else if (data.action == 'remove' && data.id != my_id && data.sid == 'busy') {
						is_busy = false;
						if (action_state == 1) {
							action_state = 2;
							send_cmd('perform force.xi;perform dodge.power;perform sword.poqi');
						} else if (action_state == 3) {
							action_state = 4;
							send_cmd('perform whip.chan');
						} else if (action_state == 7 || action_state == 8) {
							action_state = 1;
							send_cmd('perform force.xi;perform dodge.power;perform sword.wu;perform unarmed.chan');
						}
					} else if (data.action == 'remove' && data.id == my_id && data.sid == 'sword') {
						if (action_state == 2) {
							/*
							action_state = 3;
							send_cmd('eq a3gg1689bd4'); */
							action_state = 5;
							send_cmd('eq jnk618b6c80');
						}
					}
				} else if (in_combat && data.type == 'dispfm') {
					if (data.id == 'whip.chan' && action_state == 4) {
						setTimeout(function() {
							action_state = 8;
							send_cmd('eq wfdw1f721e5');
							/*
							if (is_busy) {
								action_state = 5;
								send_cmd('eq jnk618b6c80');
							} else {
								action_state = 0;
								send_cmd('eq wfdw1f721e5');
							} */
						}, data.rtime);
					} else if (!data.id && action_state == 5) {
						setTimeout(function() {
							action_state = 6;
							send_cmd('perform force.xi;perform dodge.power;perform blade.chan');
						}, data.rtime);
					} else if (data.id == 'blade.chan' && action_state == 6) {
						setTimeout(function() {
							action_state = 7;
							send_cmd('perform force.xi;perform dodge.power;perform unarmed.chan');
						}, data.rtime);
					} else if (data.id == 'unarmed.chan' && action_state == 7) {
						setTimeout(function() {
							action_state = 8;
							send_cmd('eq wfdw1f721e5');
						}, data.rtime);
					} else if (!data.id && action_state == 8) {
						setTimeout(function() {
							if (action_state == 8) {
								action_state = 1;
								send_cmd('perform force.xi;perform dodge.power;perform sword.wu');
							}
						}, data.rtime);
					}
				}
			});
		} else if (cmd == '#combat 2') {
			log('open auto combat mode 2...');
			var action_state, is_busy;
			add_task_listener(['combat', 'status', 'dispfm'], function(data) {
				if (data.type == 'combat') {
					if (data.start) {
						is_busy = false;
						action_state = 1;
						send_cmd('eq a3gg1689bd4;perform whip.chan');
					}
				} else if (in_combat && data.type == 'status') {
					if (data.action == 'add' && data.id != my_id && data.sid == 'busy') {
						is_busy = true;
					} else if (data.action == 'remove' && data.id != my_id && data.sid == 'busy') {
						is_busy = false;
						if (action_state == 4) {
							action_state = 5;
							send_cmd('perform force.xi;perform dodge.power;perform sword.wu;perform unarmed.chan');
						} else if (action_state == 5) {
							action_state = 6;
							send_cmd('perform force.xi;perform dodge.power;perform sword.poqi');
						} else if (action_state == 7) {
							action_state = 1;
							send_cmd('perform whip.chan');
						}
					} else if (data.action == 'remove' && data.id == my_id && data.sid == 'sword') {
						if (action_state == 6) {
							action_state = 7;
							send_cmd('eq a3gg1689bd4');
						}
					}
				} else if (in_combat && data.type == 'dispfm') {
					if (data.id == 'whip.chan' && action_state == 1) {
						setTimeout(function() {
							if (is_busy) {
								action_state = 2;
								send_cmd('eq jnk618b6c80');
							}
						}, data.rtime);
					} else if (!data.id && action_state == 2) {
						setTimeout(function() {
							action_state = 3;
							send_cmd('perform force.xi;perform dodge.power;perform blade.chan');
						}, data.rtime);
					} else if (data.id == 'blade.chan' && action_state == 3) {
						setTimeout(function() {
							action_state = 4;
							send_cmd('eq wfdw1f721e5');
						}, data.rtime);
					} else if (!data.id && action_state == 4) {
						setTimeout(function() {
							if (action_state == 4) {
								action_state = 5;
								send_cmd('perform force.xi;perform dodge.power;perform sword.wu;perform unarmed.chan');
							}
						}, data.rtime);
					} else if (!data.id && action_state == 7) {
						setTimeout(function() {
							if (action_state == 7) {
								action_state = 1;
								send_cmd('perform whip.chan');
							}
						}, data.rtime);
					}
				}
			});
		} else if (cmd == '#combat 3') {
			log('open auto combat mode 3...');
			var action_state, is_busy, whip_time = 0;
			add_task_listener(['combat', 'status', 'dispfm'], function(data) {
				if (data.type == 'combat') {
					if (data.start) {
						is_busy = false;
						action_state = 1;
						send_cmd('eq wfdw1f721e5;perform force.xi;perform dodge.power;perform sword.wu;perform parry.wu;perform sword.poqi;perform throwing.jiang');
					}
				} else if (in_combat && data.type == 'status') {
					if (data.action == 'add' && data.id != my_id && data.sid == 'busy') {
						is_busy = true;
						log('busy time: ' + data.duration);
						if (action_state == 2) {
							setTimeout(function() {
								var t = new Date().getTime();
								if (t - whip_time >= 30000) {
									send_cmd('eq a3gg1689bd4');
									action_state = 3;
								} else {
									action_state = 0;
								}
							}, data.duration - 3000);
						}
					} else if (data.action == 'remove' && data.id != my_id && data.sid == 'busy') {
						is_busy = false;
						if (action_state == 1) {
							action_state = 2;
							send_cmd('perform force.xi;perform dodge.power;perform parry.wu;perform unarmed.chan');
						} else if (action_state == 3) {
							action_state = 4;
							send_cmd('perform whip.chan');
							whip_time = new Date().getTime();
						} else if (action_state == 5) {
							action_state = 1;
							send_cmd('perform force.xi;perform dodge.power;perform sword.wu;perform parry.wu;perform sword.poqi');
						}
					}
				} else if (in_combat && data.type == 'dispfm') {
					if (!data.id && action_state == 3) {
						setTimeout(function() {
							action_state = 4;
							send_cmd('perform whip.chan;eq jnk618b6c80');
						}, data.rtime);
					} else if (!data.id && action_state == 4) {
						setTimeout(function() {
							action_state = 5;
							send_cmd('perform force.xi;perform dodge.power;perform parry.wu;perform blade.chan;perform throwing.jiang;eq wfdw1f721e5');
						}, data.rtime);
					}
				}
			});
		} else if (cmd == '#combat 4') {
			log('open auto combat mode 4...');
			var action_state, is_busy;
			add_task_listener(['combat', 'status', 'dispfm'], function(data) {
				if (data.type == 'combat') {
					if (data.start) {
						is_busy = false;
						action_state = 1;
						// eq wfdw1f721e5;
						send_cmd('perform force.xi;perform force.power;perform dodge.power;perform sword.wu;perform parry.wu;perform sword.poqi;perform throwing.jiang');
					}
				} else if (in_combat && data.type == 'status') {
					if (data.action == 'add' && data.id != my_id && data.sid == 'busy') {
						is_busy = true;
						log('busy time: ' + data.duration);
					} else if (data.action == 'remove' && data.id != my_id && data.sid == 'busy') {
						is_busy = false;
						if (action_state == 1) {
							action_state = 2;
							send_cmd('perform force.xi;perform dodge.power;perform sword.wu;perform parry.wu;perform unarmed.chan;perform throwing.jiang');
						} else if (action_state == 2) {
							if (!cooldowns.get('sword.poqi')) {
								action_state = 1;
								send_cmd('perform force.xi;perform dodge.power;perform sword.wu;perform parry.wu;perform sword.poqi;perform throwing.jiang');
							}
						}
					} else if (data.action == 'remove' && data.id == my_id) {
						if (data.sid == 'swrod') {
							send_cmd('perform sword.wu');
						} else if (data.sid == 'dodge') {
							send_cmd('perform dodge.power');
						} else if (data.sid == 'parry') {
							send_cmd('perform parry.wu');
						} else if (data.sid == 'mingyu') {
							send_cmd('perform force.wang');
						}
					}
				} else if (in_combat && data.type == 'dispfm') {
					if (data.id == 'sword.poqi' && action_state == 2) {
						setTimeout(function() {
							if (action_state == 2) {
								action_state = 1;
								send_cmd('perform force.xi;perform dodge.power;perform sword.wu;perform parry.wu;perform sword.poqi;perform throwing.jiang');
							}
						}, data.rtime);
					}
				}
			});
		} else if (cmd == '#combat 5') {
			log('open auto combat mode 5...');
			var action_state = -1, is_busy;
			add_task_listener(['combat', 'status', 'dispfm', 'items', 'text'], function(data) {
				if (action_state == -1) {
					if (data.type == 'status' && data.action == 'add' && data.id == my_id && data.sid == 'parry' && data.name == '祝融') {
						send_cmd('go south');
					} else if (in_combat && data.type == 'status' && data.action == 'remove' && data.id == my_id && data.sid == 'parry') {
						send_cmd('perform parry.wu');
                    } else if (data.type == 'text' && data.msg == '<hiy>你疗伤完毕，深深吸了口气，脸色看起来好了很多。</hiy>') {
                        execute_cmd('fly xy;e;n');
                        todo('kill 木头人;perform parry.wu');
                    } else if (data.type == 'text' && data.msg == '<hig>你目前气血充沛，没有受到任何伤害。</hig>') {
                        setTimeout(function() {
                            execute_cmd('fly xy;e;n');
                            todo('kill 木头人;perform parry.wu');
                        }, 10000);
                    } else if (data.type == 'combat' && data.end) {
						action_state = 0;
						send_cmd('jh fam 8 start;go enter');
					}
				} else if (action_state == 0) {
					if (data.type == 'items') {
						if (room.name == '武道塔-第一百层') {
							stop_task();
                            todo(biguan ? 'biguan' : 'wakuang');
						} else {
                            for (var i = 0; i < data.items.length; i++) {
                                var title = get_title(data.items[i].name);
                                if (title == '武道塔守护者') {
                                    is_busy = false;
                                    action_state = 1;
                                    // send_cmd('eq wfdw1f721e5;enable1 force mingyugong;perform force.wang;enable1 force zixiashengong2;kill ' + data.items[i].id + ';perform force.xi;perform dodge.power;perform sword.wu;perform sword.poqi;perform throwing.jiang');
                                    new PFMS('kill ' + data.items[i].id).check_buff().append('perform dodge.lingbo;perform unarmed.zhong').do();
                                    break;
                                }
                            }
                        }
					}
				} else if (data.type == 'text' && data.msg == '<hir>你的挑战失败了。</hir>') {
                    setTimeout(function() {
                        execute_cmd('full');
                        action_state = -1;
                    }, 10000);
                } else if (data.type == 'text' && data.msg == '<hig>恭喜你战胜了武道塔守护者，你现在可以进入下一层。</hig>') {
                    setTimeout(function() {
                        execute_cmd('full');
                        action_state = -1;
                    }, 10000);
				} else if (in_combat && data.type == 'status') {
					if (data.action == 'add' && data.id != my_id && data.sid == 'busy') {
						is_busy = true;
						log('busy time: ' + data.duration);
					} else if (data.action == 'remove' && data.id != my_id && data.sid == 'busy') {
						is_busy = false;
                        /*
						if (action_state == 1) {
							action_state = 2;
							send_cmd('perform force.xi;perform dodge.power;perform sword.wu;perform parry.wu;perform unarmed.chan;perform throwing.jiang');
						} else if (action_state == 2) {
							if (!cooldowns.get('sword.poqi')) {
								action_state = 1;
								send_cmd('perform force.xi;perform dodge.power;perform sword.wu;perform parry.wu;perform sword.poqi;perform throwing.jiang');
							}
						} */
					} else if (data.action == 'add' && data.id != my_id && data.name == '逆转九阴') {
                        new PFMS('perform dodge.lingbo;perform force.duo').perform_busy().perform_attack().append('perform force.wuwo').do();
                        action_state = 2;
					}
				} else if (in_combat && data.type == 'text') {
                    if (data.msg.indexOf('凝神聚气，神态淡然，左手虚划，右手回转，聚气于胸前，双掌猛地推出，蕴含着降龙十八掌的十八般变化') >= 0) {
                    }
				} else if (in_combat && data.type == 'dispfm') {
                    /*
					if (data.id == 'sword.poqi' && action_state == 2) {
						setTimeout(function() {
							if (action_state == 2) {
								action_state = 1;
								send_cmd('perform force.xi;perform dodge.power;perform sword.wu;perform parry.wu;perform sword.poqi;perform throwing.jiang');
							}
						}, data.rtime);
					} */
					if (data.id == 'unarmed.zhong') {
						setTimeout(function() {
							if (action_state == 2) {
								new PFMS('perform dodge.lingbo;perform force.duo').perform_busy().perform_attack().append('perform force.wuwo').do();
							}
						}, data.rtime);
					}
				} else if (data.type == 'combat' && data.end) {
					action_state = -1;
				}
			});
		} else if (cmd == '#combat 6') {
			log('open auto combat mode 6...');
			var action_state = -1, is_busy, duanyu_id, zhua = false;
			add_task_listener(['combat', 'status', 'dispfm', 'items'], function(data) {
				if (action_state == -1) {
					if (data.type == 'status' && data.action == 'add' && data.id == my_id && data.sid == 'parry' && data.name == '天柱') {
						send_cmd('go north');
					} else if (data.type == 'status' && data.action == 'remove' && data.id == my_id && data.sid == 'parry') {
						send_cmd('perform parry.wu');
					} else if (data.type == 'combat' && data.end) {
						action_state = 0;
					}
				} else if (action_state == 0) {
					if (data.type == 'items') {
						for (var i = 0; i < data.items.length; i++) {
							var name = get_name(data.items[i].name);
							if (name == '枯荣大师') {
								is_busy = false;
								action_state = 1;
								send_cmd('eq wfdw1f721e5;perform force.wang;fight ' + data.items[i].id + ';perform force.power;perform dodge.power;perform sword.wu;perform sword.poqi;perform throwing.jiang');
							} else if (name == '段誉') {
								duanyu_id = data.items[i].id;
							}
						}
					}
				} else if (in_combat && data.type == 'status') {
					if (data.action == 'remove' && data.id == my_id) {
						if (data.sid == 'sword') {
							send_cmd('perform sword.wu');
						} else if (data.sid == 'parry') {
							send_cmd('perform parry.wu');
						} else if (data.sid == 'dodge') {
							send_cmd('perform dodge.power');
						}
					} else if (data.action == 'add' && data.id != my_id && data.sid == 'busy') {
						is_busy = true;
						log('busy time: ' + data.duration);
					} else if (data.action == 'remove' && data.id != my_id && data.sid == 'busy') {
						is_busy = false;
						if (action_state == 1) {
							action_state = 2;
							send_cmd('perform force.xi;perform dodge.power;perform sword.wu;perform parry.wu;perform sword.poqi;perform throwing.jiang');
						} else if (action_state == 2) {
							if (!cooldowns.get('sword.poqi')) {
								action_state = 1;
								//send_cmd('perform force.xi;perform dodge.power;perform sword.wu;perform parry.wu;perform sword.poqi;perform throwing.jiang');
							}
						}
					}
				} else if (in_combat && data.type == 'dispfm') {
					if (data.id == 'sword.poqi' && action_state == 2) {
						setTimeout(function() {
							if (action_state == 2) {
								action_state = 1;
								//send_cmd('perform force.xi;perform dodge.power;perform sword.wu;perform parry.wu;perform sword.poqi;perform throwing.jiang');
							}
						}, data.rtime);
					}
				} else if (data.type == 'combat' && data.end) {
					if (!zhua) {
						send_cmd('zhua ' + duanyu_id + ';perform unarmed.chan');
						zhua = true;
					} else {
						action_state = -1;
						zhua = false;
					}
				}
			});
		} else if (cmd == '#combat 7') { // for 古墓剑灵
			log('open auto combat mode 7...');
			var action_state = 0;
			add_task_listener(['combat', 'status', 'text'], function(data) {
				if (action_state == 0) {
					if (data.type == 'status' && data.action == 'add' && data.id == my_id && data.sid == 'sword') {
						send_cmd('go out');
                        action_state = 1;
                    }
                } else if (action_state == 1) {
					if (data.type == 'combat' && data.end) {
						action_state = 2;
                        send_cmd('go enter;enable1 force mingyugong;perform force.power;perform force.wang;kill a4ml27adcdc');
					} else if (data.type == 'text' && data.msg.indexOf('你转身想跑，') >= 0) {
                        setTimeout(function() {
                            send_cmd('perform dodge.lingbo;go out');
                        }, 500);
                        action_state = 0;
                    }
				} else if (action_state == 2) {
                    if (data.type == 'combat' && data.start) {
                        new PFMS().check_buff().do();
                        if (can_perform('unarmed.qi')) {
                            send_cmd('perform unarmed.qi');
                        }
                        new PFMS().perform_attack().do();
                    } else if (in_combat && data.type == 'status' && data.id != my_id && data.action == 'add' && data.sid == 'mojian') {
                        send_cmd('perform dodge.lingbo;perform force.duo');
                    } else if (in_combat && data.type == 'status' && data.id == my_id && data.action == 'remove') {
                        new PFMS().check_buff().do();
                    } else if (in_combat && data.type == 'pfm_ok') {
                        new PFMS().check_buff().do();
                        if (can_perform('unarmed.qi')) {
                            send_cmd('perform unarmed.qi');
                        }
                        new PFMS().perform_attack().do();
                    } else if (in_combat && data.type == 'status' && data.id != my_id && data.action == 'add') {
                        if (data.sid == 'busy') {
                            log('busy time: ' + data.duration);
                        } else if (data.sid == 'faint') {
                            log('faint time: ' + data.duration);
                        }
					} else if (data.type == 'combat' && data.end) {
                        action_state = 0;
                    }
				}
			});
		} else if (cmd.substr(0, 6) == '#gumu ') {
			log('start auto gumu river...');
            var swim_dir = '向' + $.trim(cmd.substr(6)) + '游';
            add_task_listener(['room', 'cmds', 'sc', 'status'], function(data) {
                if (data.type == 'status' && data.action == 'add' && data.sid == 'faint') {
                    send_cmd('perform dodge.lingbo;go down');
                } else if (data.type == 'room' && data.path == 'gumu/qiaobi') {
                    setTimeout(function() {
                        send_cmd('pa;tui shi', true);
                    }, 500);
                } else if (data.type == 'sc' && data.id == my_id && data.hp) {
                    if (data.hp < 500000) {
                        send_cmd('use b4hc1a7cf0b', true);
                    }
                } else if (data.type == 'cmds' && data.items) {
                    for (var i = 0; i < data.items.length; i++) {
                        if (data.items[i].name == swim_dir) {
                            var cmd = data.items[i].cmd;
                            setTimeout(function() {
                                send_cmd(cmd, true);
                            }, in_combat ? 500 : 100);
                            break;
                        } else if (data.items[i].name == '来吧，我准备好了') {
                            send_cmd(data.items[i].cmd, true);
                            stop_task();
                            break;
                        }
                    }
                }
            });
		} else if (cmd == '#stats') {
            for (var [id, stats] of all_stats) {
                report_stats(id);
            }
        } else if (cmd.substr(0, 6) == '#send ') {
            var _cmd = $.trim(cmd.substr(6));
			var pc = process_cmdline(_cmd);
			if (pc) {
				send_cmd(pc, true);
			}
        } else if (cmd.substr(0, 1) == '#') {
			var i = cmd.indexOf(' ');
			if (i >= 0) {
				var times = parseInt(cmd.substr(1, i - 1));
				if (!isNaN(times)) {
					cmd = $.trim(cmd.substr(i + 1));
					for ( var j = 0; j < times; j++) {
						execute_cmd(cmd);
					}
				}
			}
		} else if (cmd) {
			var pc = process_cmdline(cmd);
			if (pc) {
				send_cmd(pc);
			}
		}
	}
	/* for mingjiao
	add_listener('items', function(data) {
		for (var i = 0; i < data.items.length; i++) {
			var name = get_name(data.items[i].name);
			if (name == '冷谦' || name == '张中' || name == '周颠' || name == '颜垣' || name == '闻苍松' || name == '庄铮' || name == '辛然' || name == '唐洋') {
				send_cmd('kill ' + data.items[i].id + ';perform force.xi;perform dodge.power;perform sword.wu;perform parry.wu;perform throwing.jiang;perform unarmed.chan;perform sword.poqi');
				break;
			}
		}
	}); */
    /* for xuedao
	add_listener('items', function(data) {
        var id = find_item('善勇');
        if (id) {
            send_cmd('kill ' + id);
            return;
        }
        id = find_item('胜谛');
        if (id) {
            send_cmd('kill ' + id);
            return;
        }
        id = find_item('陆天抒');
        if (id) {
            send_cmd('kill ' + id);
            send_cmd('kill ' + id);
            send_cmd('kill ' + id);
            return;
        }
        id = find_item('花铁干');
        if (id) {
            send_cmd('kill ' + id);
            send_cmd('kill ' + id);
            send_cmd('kill ' + id);
            return;
        }
        id = find_item('刘乘风');
        if (id) {
            send_cmd('kill ' + id);
            send_cmd('kill ' + id);
            send_cmd('kill ' + id);
            return;
        }
        id = find_item('水岱');
        if (id) {
            send_cmd('kill ' + id);
            send_cmd('kill ' + id);
            send_cmd('kill ' + id);
            return;
        }
	});*/
	
	function process_cmdline(line) {
		var pc = '';
		var arr = line.split(';');
		for ( var i = 0; i < arr.length; i++) {
			var cmd = $.trim(arr[i]);
			if (cmd) {
				var c = process_cmd(cmd);
				if (c) {
					if (pc) {
						pc += ';';
					}
					pc += c;
				}
			}
		}
		return pc;
	}
	function process_cmd(cmd) {
		var args = [ '', '' ];
		var i = cmd.indexOf(' ');
		if (i >= 0) {
			args[0] = $.trim(cmd.substr(0, i));
			args[1] = $.trim(cmd.substr(i + 1));
		} else {
			args[0] = cmd;
		}
		var alias = aliases.get(args[0]);
		if (alias) {
			var line = alias;
			if (args[1]) {
				line += ' ' + args[1];
			}
			return process_cmdline(line);
		}
		translate(args);
		var pc = '';
		if (args[0]) {
			if (pc) {
				pc += ';';
			}
			if (args[1]) {
				pc += args[0] + ' ' + args[1];
			} else {
				pc += args[0];
			}
		}
		return pc;
	}
	function translate(args) {
		if (args[0] == 'items') {
            $('div.tool-bar > span.tool-item[command="pack"]').click();
			args[0] = '';
		} else if (args[0] == 'skills') {
            $('div.tool-bar > span.tool-item[command="skills"]').click();
			args[0] = '';
		} else if (args[0] == 'tasks') {
            $('div.tool-bar > span.tool-item[command="tasks"]').click();
			args[0] = '';
		} else if (args[0] == 'shop') {
            $('div.tool-bar > span.tool-item[command="shop"]').click();
			args[0] = '';
		} else if (args[0] == 'message') {
            $('div.tool-bar > span.tool-item[command="message"]').click();
			args[0] = '';
		} else if (args[0] == 'stats') {
            $('div.tool-bar > span.tool-item[command="stats"]').click();
			args[0] = '';
		} else if (args[0] == 'fly') {
			args[0] = 'jh';
			if (args[1]) {
				var id = map_ids.get(args[1]);
				if (id) {
					args[1] = id;
				}
				args[1] = 'fam ' + args[1] + " start";
			} else {
                $('div.tool-bar > span.tool-item[command="jh"]').click();
				args[0] = '';
			}
		} else if (args[0] == 'look' || args[0] == 'fight' || args[0] == 'kill') {
			var id = find_item(args[1]);
			if (id) {
				args[1] = id;
			}
		} else if (args[0] == 'get') {
			var id = find_item(args[1]);
			if (id) {
				args[1] = id;
			}
			args[1] = 'all from ' + args[1];
		} else if (args[0] == 'xue') {
			var r = args[1].match(/(.+)\s+from\s+(.+)/);
			if (r) {
				var id = find_item(r[2]);
				if (id) {
					args[1] = r[1] + ' from ' + id;
				}
			}
		} else if (args[0] == 'buy') {
			var r = args[1].match(/(\d+)\s+(.+)\s+from\s+(.+)/);
			if (!r) {
				r = ('1 ' + args[1]).match(/(\d+)\s+(.+)\s+from\s+(.+)/);
			}
			if (r) {
				var id = find_item(r[3]);
				if (id) {
					var h = add_listener('dialog', function(data) {
						if (data.dialog == 'list' && data.seller == id) {
							for (var i = 0; i < data.selllist.length; i++) {
								if (r[2] == data.selllist[i].name || r[2] == get_name(data.selllist[i].name)) {
									send_cmd('buy ' + r[1] + ' ' + data.selllist[i].id + ' from ' + id);
									break;
								}
							}
							$('.dialog-close').click();
							remove_listener(h);
						}
					});
					args[0] = 'list';
					args[1] = id;
				}
			}
		} else if (args[0] == 'sell') {
			var r = args[1].match(/(\d+)\s+(.+)\s+to\s+(.+)/);
			if (!r) {
				r = ('1 ' + args[1]).match(/(\d+)\s+(.+)\s+to\s+(.+)/);
			}
			if (r) {
				var id = find_item(r[3]);
				if (id) {
					var h = add_listener('dialog', function(data) {
						if (data.dialog == 'pack') {
							for (var i = 0; i < data.items.length; i++) {
								if (r[2] == data.items[i].name || r[2] == get_name(data.items[i].name)) {
									send_cmd('sell ' + r[1] + ' ' + data.items[i].id + ' to ' + id);
									break;
								}
							}
							$('.dialog-close').click();
							remove_listener(h);
						}
					});
					args[0] = 'pack';
					args[1] = '';
				}
			}
		} else if (args[0] == 'qu') {
			var r = args[1].match(/(\d+)\s+(.+)/);
			if (!r) {
				r = ('1 ' + args[1]).match(/(\d+)\s+(.+)/);
			}
			if (r) {
				var h = add_listener('dialog', function(data) {
					if (data.dialog == 'list' && data.stores) {
						for (var i = 0; i < data.stores.length; i++) {
							if (r[2] == data.stores[i].name || r[2] == get_name(data.stores[i].name)) {
								send_cmd('qu ' + r[1] + ' ' + data.stores[i].id);
								break;
							}
						}
						$('.dialog-close').click();
						remove_listener(h);
					}
				});
				args[0] = 'store';
				args[1] = '';
			}
		} else if (args[0] == 'cun') {
			var r = args[1].match(/(\d+)\s+(.+)/);
			if (!r) {
				r = ('1 ' + args[1]).match(/(\d+)\s+(.+)/);
			}
			if (r) {
				var h = add_listener('dialog', function(data) {
					if (data.dialog == 'pack') {
						for (var i = 0; i < data.items.length; i++) {
							if (r[2] == data.items[i].name || r[2] == get_name(data.items[i].name)) {
								send_cmd('store ' + r[1] + ' ' + data.items[i].id);
								break;
							}
						}
						$('.dialog-close').click();
						remove_listener(h);
					}
				});
				args[0] = 'pack';
				args[1] = '';
			}
		} else if (args[0] == 'east' || args[0] == 'south' || args[0] == 'west'
				|| args[0] == 'north' || args[0] == 'southeast'
				|| args[0] == 'southwest' || args[0] == 'northeast'
				|| args[0] == 'northwest' || args[0] == 'up'
				|| args[0] == 'down' || args[0] == 'eastup'
				|| args[0] == 'southup' || args[0] == 'westup'
				|| args[0] == 'northup' || args[0] == 'eastdown'
				|| args[0] == 'southdown' || args[0] == 'westdown'
				|| args[0] == 'northdown' || args[0] == 'enter' || args[0] == 'out') {
			args[1] = args[0];
			args[0] = 'go';
		} else if (args[0] == 'halt') {
			args[0] = 'stopstate';
			args[1] = '';
		} else if (args[0] == 'heal') {
			args[0] = 'liaoshang';
			args[1] = '';
		}
	}
	
	var cmdline = $('<input style="width: 100%;">');
	$('.content-bottom').after(cmdline);
	var history_cmds = [];
	var select_index = -1;
	cmdline.keydown(function(e) {
		if (e.which == 13) { // ENTER
			cmdline.select();
			cmdline.focus();
			send_command();
			e.preventDefault();
		} else if (e.which == 38) { // UP
			if (select_index > 0) {
				cmdline.val(history_cmds[--select_index]);
				cmdline.select();
				cmdline.focus();
				e.preventDefault();
			}
		} else if (e.which == 40) { // DOWN
			if (select_index < history_cmds.length - 1) {
				cmdline.val(history_cmds[++select_index]);
				cmdline.select();
				cmdline.focus();
				e.preventDefault();
			}
		}
	});
	function send_command() {
		var cmd = $.trim(cmdline.val());
		if (cmd == '') {
			return;
		}
		if (history_cmds.length == 0
				|| history_cmds[history_cmds.length - 1] != cmd) {
			history_cmds.push(cmd);
			if (history_cmds.length > 20) {
				history_cmds = history_cmds.slice(-20);
			}
		}
		execute_cmd(cmd);
	}

    GM_addStyle('.right-bar {bottom: 4.4em!important;}');
    GM_addStyle('.script-bar {right: calc(5px + 2.9em); bottom: 4.4em;}');
    GM_addStyle('.script-bar > .tool-item > .tool-icon {display: block;	line-height: 1em;}');
    GM_addStyle('.script-bar > .tool-item > .tool-text {line-height: 2.25em; font-weight: bold;}');
    GM_addStyle('.script-bar > .tool-item {display: block; width: 2.5em; border-radius: 0.875em; margin-bottom: 0.3em; height: 2.25em;}');
    GM_addStyle('.script-bar > .hide-tool {background-color: #000000; color: #808080;}');
    GM_addStyle('.room-item > .item-stats {margin-left: 2em;}');
    
	$('div.tool-bar.bottom-bar > div.state-bar').css('width', 'calc(100% - 16em)');
	var script_btn = $('<span class="tool-item hide-tool"><span class="glyphicon glyphicon-file tool-icon"></span><span class="tool-text">脚本</span></span>');
	script_btn.insertAfter('div.tool-bar.bottom-bar > span.tool-item[command="showtool"]');
	script_btn.click(function() {
		ScriptAction.ShowTools();
	});
	var script_bar = $('<div class="tool-bar script-bar"></div>');
	script_bar.insertAfter('div.tool-bar.right-bar');
	var echo_btn = $('<span class="tool-item" style="display:none"><span class="tool-text">回显</span></span>');
	echo_btn.appendTo(script_bar);
	echo_btn.click(function() {
		if (echo_btn.hasClass('hide-tool')) {
			execute_cmd('#echo off');
		} else {
			execute_cmd('#echo on');
		}
	});
	var boss_btn = $('<span class="tool-item" style="display:none"><span class="tool-text">BOSS</span></span>');
	boss_btn.appendTo(script_bar);
	boss_btn.click(function() {
		if (boss_btn.hasClass('hide-tool')) {
			execute_cmd('#t- boss');
		} else {
			execute_cmd('#t+ boss');
		}
	});
	var task_btn = $('<span class="tool-item" style="display:none"><span class="tool-text">追捕</span></span>');
	task_btn.appendTo(script_bar);
	task_btn.click(function() {
		if (task_btn.hasClass('hide-tool')) {
			execute_cmd('#t- task');
		} else {
			execute_cmd('#t+ task');
			execute_cmd('fly yz;w;n;n;eq1;before_kill');
			setTimeout(function() {
				var id = find_item('程药发');
				if (id) {
					send_cmd('ask1 ' + id);
				}
			}, 3000);
		}
	});
	var party_btn = $('<span class="tool-item" style="display:none"><span class="tool-text">师门</span></span>');
	party_btn.appendTo(script_bar);
	party_btn.click(function() {
		if (party_btn.hasClass('hide-tool')) {
			execute_cmd('#t- party');
		} else {
			execute_cmd('#t+ party');
			execute_cmd(task_path);
			setTimeout(function() {
				var id = find_item(task_npc);
				if (id) {
					send_cmd('task sm ' + id);
				}
			}, 1000);
		}
	});
// 	var wudao_btn = $('<span class="tool-item" style="display:none"><span class="tool-text">武道</span></span>');
// 	wudao_btn.appendTo(script_bar);
// 	wudao_btn.click(function() {
// 		if (wudao_btn.hasClass('hide-tool')) {
// 			execute_cmd('#t- wudao');
// 		} else {
// 			execute_cmd('#t+ wudao');
// 			execute_cmd('fly wdt;eq1;before_kill');
// 			setTimeout(function() {
// 				var id = find_item('守门人');
// 				if (id) {
// 					send_cmd('ask1 ' + id + ';go enter');
// 					var h = add_listener('items', function(data) {
// 						for (var i = 0; i < data.items.length; i++) {
// 							var title = get_title(data.items[i].name);
// 							if (title == '武道塔守护者') {
// 								send_cmd('kill ' + data.items[i].id);
// 								break;
// 							}
// 						}
// 						remove_listener(h);
// 					});
// 				}
// 			}, 3000);
// 		}
// 	});

    var xiyan_btn = $('<span class="tool-item" style="display:none"><span class="tool-text">喜宴</span></span>');
	xiyan_btn.appendTo(script_bar);
	xiyan_btn.click(function() {
        	execute_cmd('#auto_get_food');
        }

                    )
	var xiangyang_btn = $('<span class="tool-item" style="display:none"><span class="tool-text">襄阳</span></span>');
	xiangyang_btn.appendTo(script_bar);
	xiangyang_btn.click(function() {
		if (xiangyang_btn.hasClass('hide-tool')) {
			execute_cmd('#t- xiangyang');
		} else {
			execute_cmd('#t+ xiangyang');
		}
	});
	var lian_btn = $('<span class="tool-item" style="display:none"><span class="tool-text">练习</span></span>');
	lian_btn.appendTo(script_bar);
	lian_btn.click(function() {
		if (lian_btn.hasClass('hide-tool')) {
			execute_cmd('#t- lian');
		} else {
			execute_cmd('#t+ lian');
			execute_cmd('eq2;' + (biguan ? 'biguan' : 'wakuang'));
		}
	});
	var combat_btn = $('<span class="tool-item" style="display:none"><span class="tool-text">战斗</span></span>');
	combat_btn.appendTo(script_bar);
	combat_btn.click(function() {
		if (combat_btn.hasClass('hide-tool')) {
			execute_cmd('#stop');
		} else {
			execute_cmd('#combat');
		}
	});
	var pack_btn = $('<span class="tool-item" style="display:none"><span class="tool-text">整理</span></span>');
	pack_btn.appendTo(script_bar);
	pack_btn.click(function() {
		execute_cmd('fly 0;n;w');
		execute_cmd('#store');
		todo(function() {
			execute_cmd('e;n;e;sell all');
			todo('i');
		});
	});
	
	var ScriptAction = {
		Tools: null,
		HideTool: null,
		ToolState: 0,
		ToolOpacity: 0,
		ToolSpeed: 0,
		InitTools: function () {
			if (!this.Tools) {
				var tools = $('.script-bar>.tool-item');
				this.Tools = [];
				for (var i = 0; i < tools.length; i++) {
					this.Tools.push(tools[i]);
				}
				this.HideTool = script_btn;
			}
		},
		ShowTools: function () {
			this.InitTools();
			if (this.ToolState == 1) return;
			if (this.ToolState == 0) {//显示
				for (var i = 0; i < this.Tools.length; i++) {
					this.Tools[i].style.display = '';
					this.Tools[i].style.opacity = 0;
				}
				this.ToolSpeed = 200;
				this.ToolOpacity = 0;
				$(this.HideTool).removeClass('hide-tool');
			} else {//隐藏
				this.ToolOpacity = 100;
				this.ToolSpeed = 100;
				$(this.HideTool).addClass('hide-tool');
			}
			window.setTimeout(this.ShowToolsAnimate.bind(this, this.ToolState), 100);
			this.ToolState = 1;
		},
		ShowToolsAnimate: function (type) {
			if (type == 0) {
				this.ToolOpacity = this.ToolOpacity + this.ToolSpeed;
				var to = this.ToolOpacity;
				for (var i = this.Tools.length - 1; i >= 0; i--) {
					if (to < 0) this.Tools[i].style.opacity = 0;
					else if (to > 100) this.Tools[i].style.opacity = 1;
					else this.Tools[i].style.opacity = to / 100;
					to -= 20;
					if (to < 0) break;
				}
				this.ToolOpacity -= 30;
				if (to < 100) {
					window.setTimeout(this.ShowToolsAnimate.bind(this, type), 100);
				} else {
					this.ToolState = 2;
				}
			} else {
				this.ToolOpacity = this.ToolOpacity - this.ToolSpeed;
				var to = this.ToolOpacity;
				for (var i = 0; i < this.Tools.length; i++) {
					if (to < 0) this.Tools[i].style.opacity = 0;
					else if (to > 100) this.Tools[i].style.opacity = 1;
					else this.Tools[i].style.opacity = to / 100;
					to += 20;
					if (to >= 100) break;
				}
				this.ToolOpacity -= 20;
				if (to >= 0) {
					window.setTimeout(this.ShowToolsAnimate.bind(this, type), 100);
				} else {
					this.ToolState = 0;
					for (var i = 0; i < this.Tools.length; i++) {
						this.Tools[i].style.display = 'none';
					}
				}
			}
		}
	};
    $('.bottom-bar > .tool-item[command="showcombat"]').click(function() {
        setTimeout(function () {
            if ($('.combat-panel').hasClass('hide')) {
                $(".right-bar").css('cssText', '');
                script_bar.css('cssText', '');
            } else {
                $(".right-bar").css('cssText', 'bottom: 8.8em!important;');
                script_bar.css('cssText', 'bottom: 8.8em!important;');
            }
        }, 0);
    });

	$(document).keydown(
			function(e) {
// 				if (e.which == 112) { // F1
// 					execute_cmd('p1');
// 					e.preventDefault();
// 				} else if (e.which == 113) { // F2
// 					execute_cmd('p2');
// 					e.preventDefault();
// 				} else if (e.which == 114) { // F3
// 					execute_cmd('p3');
// 					e.preventDefault();
// 				} else if (e.which == 115) { // F4
// 					execute_cmd('p4');
// 					e.preventDefault();
// 				} else if (e.which == 116) { // F5
// 					execute_cmd('p5');
// 					e.preventDefault();
// 				} else if (e.which == 117) { // F6
// 					execute_cmd('#auto_pfm');
// 					e.preventDefault();
// 				} else if (e.which == 118) { // F7
// 					execute_cmd('eq1');
// 					e.preventDefault();
// 				} else if (e.which == 119) { // F8
// 					execute_cmd('eq2');
// 					e.preventDefault();
// 				} else if (e.which == 120) { // F9
// 					execute_cmd('eq3');
// 					e.preventDefault();
// 				} else if (e.which == 121) { // F10
// 					execute_cmd(biguan ? 'biguan' : 'wakuang');
// 					e.preventDefault();
// 				} else if (e.which == 122) { // F11
// 					execute_cmd('#echo');
// 					e.preventDefault();
// 				} else if (e.which == 97) {
// 					send_cmd('go southwest');
// 				} else if (e.which == 98) {
// 					send_cmd('go south');
// 				} else if (e.which == 99) {
// 					send_cmd('go southeast');
// 				} else if (e.which == 100) {
// 					send_cmd('go west');
// 				} else if (e.which == 102) {
// 					send_cmd('go east');
// 				} else if (e.which == 103) {
// 					send_cmd('go northwest');
// 				} else if (e.which == 104) {
// 					send_cmd('go north');
// 				} else if (e.which == 105) {
// 					send_cmd('go northeast');
// 				} else if (!e.isDefaultPrevented() && e.which == 13) { // ENTER
// 					if (history_cmds.length > 0) {
// 						select_index = history_cmds.length - 1;
// 						cmdline.val(history_cmds[select_index]);
// 						cmdline.select();
// 						cmdline.focus();
// 					} else {
// 						cmdline.val('');
// 						cmdline.focus();
// 					}
// 					e.preventDefault();
// 				}
				return true;
			});
	log('addon loaded version ' + GM_info.script.version);
//     execute_cmd('#combat');

    var full_map = [
        {
            id: '1',
            name: '武当派',
            rooms: [
                {name: '广场', path: ['']},
                {name: '三清殿', path: ['n']},
                {name: '石阶', path: ['w']},
                {name: '练功房', path: ['w;w']},
                {name: '太子岩', path: ['w;nu']},
                {name: '桃园小路', path: ['w;nu;n']},
                {name: '舍身崖', path: ['w;nu;n;e']},
                {name: '南岩峰', path: ['w;nu;n;w']},
                {name: '乌鸦岭', path: ['w;nu;n;w;nu']},
                {name: '五老峰', path: ['w;nu;n;w;nu;nu']},
                {name: '虎头岩', path: ['w;nu;n;w;nu;nu;nu']},
                {name: '朝天宫', path: ['w;nu;n;w;nu;nu;nu;n']},
                {name: '三天门', path: ['w;nu;n;w;nu;nu;nu;n;n']},
                {name: '紫金城', path: ['w;nu;n;w;nu;nu;nu;n;n;n']},
                {name: '林间小径', path: ['w;nu;n;w;nu;nu;nu;n;n;n;n', 'n']},
                {name: '后山小院', path: ['w;nu;n;w;nu;nu;nu;n;n;n;n;n;n']}
            ]
        },
        {
            id: '2',
            name: '少林派',
            rooms: [
                {name: '广场', path: ['']},
                {name: '山门殿', path: ['n']},
                {name: '西侧殿', path: ['n;w']},
                {name: '东侧殿', path: ['n;e']},
                {name: '天王殿', path: ['n;n']},
                {name: '大雄宝殿', path: ['n;n;nu']},
                {name: '鼓楼', path: ['n;n;nw']},
                {name: '钟楼', path: ['n;n;ne']},
                {name: '后殿', path: ['n;n;nw;ne']},
                {name: '练武场', path: ['n;n;nw;ne;n']},
                {name: '般若堂', path: ['n;n;nw;ne;n;w']},
                {name: '罗汉堂', path: ['n;n;nw;ne;n;e']},
                {name: '方丈楼', path: ['n;n;nw;ne;n;n']},
                {name: '达摩院', path: ['n;n;nw;ne;n;n;w']},
                {name: '戒律院', path: ['n;n;nw;ne;n;n;e']},
                {name: '竹林', path: ['n;n;nw;ne;n;n;n', 'n']},
                {name: '藏经阁', path: ['n;n;nw;ne;n;n;n;w']},
                {name: '竹林', prev: 16, forward: 'n', backward: 's'},
                {name: '达摩洞', path: ['n;n;nw;ne;n;n;n;n;n']}
            ]
        },
        {
            id: '3',
            name: '华山派',
            rooms: [
                {name: '镇岳宫', path: ['']},
                {name: '苍龙岭', path: ['eu']},
                {name: '舍身崖', path: ['eu;su']},
                {name: '峭壁', path: ['eu;su;jumpdown']},
                {name: '山谷', path: ['eu;su;jumpdown;su']},
                {name: '山间平地', path: ['eu;su;jumpdown;su;s']},
                {name: '林间小屋', path: ['eu;su;jumpdown;su;s;e']},
                {name: '玉女峰', path: ['wu']},
                {name: '玉女祠', path: ['wu;w']},
                {name: '练武场', path: ['wu;n']},
                {name: '练功房', path: ['wu;n;e']},
                {name: '客厅', path: ['wu;n;n']},
                {name: '偏厅', path: ['wu;n;n;e']},
                {name: '寝室', path: ['wu;n;n;n']},
                {name: '玉女峰山路', path: ['wu;s']},
                {name: '玉女峰小径', path: ['wu;s;su']},
                {name: '思过崖', path: ['wu;s;su;su']},
                {name: '山洞', path: ['wu;s;su;su;break bi;enter']},
                {name: '长空栈道', path: ['wu;s;su;su;break bi;enter;wu']},
                {name: '落雁峰', path: ['wu;s;su;su;break bi;enter;wu;wu']}
            ]
        },
        {
            id: '4',
            name: '峨嵋派',
            rooms: [
                {name: '金顶', path: ['']},
                {name: '睹光台', path: ['nu']},
                {name: '华藏庵', path: ['nu;e']},
                {name: '庙门', path: ['w']},
                {name: '广场', path: ['w;s']},
                {name: '走廊', path: ['w;s;e', 'w;w', 'n', 's;s']},
                {name: '厨房', path: ['w;s;e;e']},
                {name: '休息室', path: ['w;s;e;s']},
                {name: '大殿', path: ['w;s;s']},
                {name: '练功房', path: ['w;s;w;w']},
                {name: '小屋', path: ['w;s;w;n;n']},
                {name: '清修洞', path: ['w;s;w;s;s']}
            ]
        },
        {
            id: '5',
            name: '逍遥派',
            rooms: [
                {name: '青草坪', path: ['']},
                {name: '林间小道', path: ['w', 'e;e', 'w;n', 's;s']},
                {name: '休息室', path: ['w;s']},
                {name: '练功房', path: ['e;n']},
                {name: '木板路', path: ['e;s']},
                {name: '工匠屋', path: ['e;s;s']},
                {name: '木屋', path: ['n;n', 's;s;s;s']},
                {name: '地下石室', path: ['d', 'd']}
            ]
        },
        {
            id: '6',
            name: '丐帮',
            rooms: [
                {name: '树洞内部', path: ['']},
                {name: '树洞下', path: ['d']},
                {name: '暗道', path: ['d;e', 'e', 'e;e', 'e']},
                {name: '破庙密室', path: ['d;e;e;e']},
                {name: '土地庙', path: ['d;e;e;e;u']},
                {name: '林间小屋', path: ['d;e;e;e;e;e;u']}
            ]
        }
    ];
	function find_path(map_name, room_name) {
		var paths = [];
		for (var i = 0; i < full_map.length; i++) {
			var map = full_map[i];
			if (map.name == map_name) {
				for (var j = 0; j < map.rooms.length; j++) {
					var room = map.rooms[j];
					if (room.name == room_name) {
						for (var k = 0; k < room.path.length; k++) {
							if (k == 0) {
								var path = 'fly ' + map.id;
								if (room.path[k]) {
									path += ';' + room.path[k];
								}
								paths.push(path);
							} else {
								paths.push(room.path[k]);
							}
						}
						break;
					}
				}
			}
		}
		return paths;
	}

    var task_items = [
        {
            items: [
                '<hic>金创药</hic>',
                '<hic>引气丹</hic>',
                '<hiy>金创药</hiy>',
                '<hiy>引气丹</hiy>',
                '<hio>聚气丹</hio>',
            ],
            type: 'give',
            sub_type: 'drug',
            npc: '张无忌',
            cmd: 'home;ne'
        },
        {
            items: [
                '<wht>当归</wht>',
                '<wht>芦荟</wht>',
                '<wht>山楂叶</wht>',
                '<hig>柴胡</hig>',
                '<hig>金银花</hig>',
                '<hig>石楠叶</hig>',
                '<hic>熟地黄</hic>',
                '<hic>茯苓</hic>',
                '<hic>沉香</hic>',
                '<hiy>九香虫</hiy>',
                '<hiy>络石藤</hiy>',
                '<hiy>冬虫夏草</hiy>',
                '<HIZ>人参</HIZ>',
                '<HIZ>何首乌</HIZ>',
                '<HIZ>凌霄花</HIZ>',
                '<hio>盘龙参</hio>',
                '<hio>天仙藤</hio>',
                '<hio>灵芝</hio>',
            ],
            type: 'give',
            sub_type: 'drug',
            npc: '张无忌',
            cmd: 'home;ne'
        },
        {
            items: [
                '<wht>鲢鱼</wht>',
                '<wht>鲤鱼</wht>',
                '<wht>草鱼</wht>',
                '<hig>鲂鱼</hig>',
                '<hig>鲮鱼</hig>',
                '<hig>鳊鱼</hig>',
                '<hic>太湖银鱼</hic>',
                '<hic>黄颡鱼</hic>',
                '<hic>黄金鳉</hic>',
                '<hiy>反天刀</hiy>',
                '<hiy>虹鳟</hiy>',
                '<hiy>孔雀鱼</hiy>',
                '<HIZ>罗汉鱼</HIZ>',
                '<HIZ>黑龙鱼</HIZ>',
                '<HIZ>银龙鱼</HIZ>',
                '<hio>七星刀鱼</hio>',
                '<hio>巨骨舌鱼</hio>',
                '<hio>帝王老虎魟</hio>',
            ],
            type: 'give',
            sub_type: 'fish',
            npc: '周芷若',
            cmd: 'home;ne'
        },
        {
            items: [
                '<hig>聚气丹</hig>',
                '<hic>聚气丹</hic>',
                '<hiy>聚气丹</hiy>',
                '<HIZ>聚气丹</HIZ>',
                '<hig>碎裂的红宝石</hig>',
                '<hig>碎裂的黄宝石</hig>',
                '<hig>碎裂的蓝宝石</hig>',
                '<hig>碎裂的绿宝石</hig>',
                '<hic>红宝石</hic>',
                '<hic>黄宝石</hic>',
                '<hic>蓝宝石</hic>',
                '<hic>绿宝石</hic>',
                '<hiy>精致的黄宝石</hiy>',
                '<hiy>精致的蓝宝石</hiy>',
                '<HIZ>完美的黄宝石</HIZ>',
                '<HIZ>完美的蓝宝石</HIZ>',
            ],
            type: 'pack'
        },
        {
            items: [
                '<wht>动物皮毛</wht>',
                '<wht>高级皮毛</wht>',
                '<wht>家丁服</wht>',
                '<wht>家丁鞋</wht>',
                '<wht>基本内功秘籍</wht>',
                '<wht>基本轻功秘籍</wht>',
                '<wht>基本招架秘籍</wht>',
                '<wht>基本剑法秘籍</wht>',
                '<wht>基本刀法秘籍</wht>',
                '<wht>基本拳脚秘籍</wht>',
                '<wht>基本暗器秘籍</wht>',
                '<wht>基本棍法秘籍</wht>',
                '<wht>基本鞭法秘籍</wht>',
                '<wht>基本杖法秘籍</wht>',
                '<hig>五虎断门刀残页</hig>',
                '<hig>太祖长拳残页</hig>',
                '<hig>流氓巾</hig>',
                '<hig>流氓衣</hig>',
                '<hig>流氓鞋</hig>',
                '<hig>流氓护腕</hig>',
                '<hig>流氓短剑</hig>',
                '<hig>流氓闷棍</hig>',
                '<hig>千斤拳</hig>',
                '<hig>黑虎单刀</hig>',
                '<hig>短衣劲装</hig>',
                '<hig>员外披肩</hig>',
                '<hig>韦春芳的项链</hig>',
                '<hig>崔员外的戒指</hig>',
                '<hig>军刀</hig>',
                '<hig>军服</hig>',
                '<hig>官服</hig>',
                '<hig>齐眉棍</hig>',
                '<hig>拂尘</hig>',
                '<hic>黑崔莺莺的手镯</hic>',
                '<hic>黑龙鞭</hic>',
                '<hic>将军剑</hic>',
                '<hic>金丝宝甲</hic>',
                '<hic>鳌拜匕首</hic>',
                '<hic>云龙剑</hic>',
                '<hic>神龙袍</hic>',
                '<hic>神龙冠</hic>',
                '<hic>神龙靴</hic>',
                '<hic>神龙护腕</hic>',
                '<hic>神龙腰带</hic>',
                '<hic>神龙杖</hic>',
                '<hic>神龙令</hic>',
                '<hig>熊胆</hig>',
                '<hiy>闯王宝刀</hiy>',
            ],
            type: 'store',
            cmd: 'fly 0;n;w'
        },
        {
            items: [
                '<wht>米饭</wht>',
                '<wht>包子</wht>',
                '<wht>鸡腿</wht>',
                '<wht>面条</wht>',
                '<wht>扬州炒饭</wht>',
                '<wht>米酒</wht>',
                '<wht>花雕酒</wht>',
                '<wht>女儿红</wht>',
                '<hig>醉仙酿</hig>',
                '<hiy>神仙醉</hiy>',
            ],
            type: 'shop',
            npc: '店小二',
            cmd: 'fly 0;n;n;e'
        },
        {
            items: [
                '<wht>布衣</wht>',
                '<wht>钢刀</wht>',
                '<wht>木棍</wht>',
                '<wht>英雄巾</wht>',
                '<wht>布鞋</wht>',
                '<wht>铁戒指</wht>',
                '<wht>簪子</wht>',
                '<wht>长鞭</wht>',
            ],
            type: 'shop',
            npc: '杨永福',
            cmd: 'fly 0;e;s'
        },
        {
            items: [
                '<wht>铁剑</wht>',
                '<wht>钢刀</wht>',
                '<wht>铁棍</wht>',
                '<wht>铁杖</wht>',
            ],
            type: 'shop',
            npc: '铁匠',
            cmd: 'fly 0;e;e;s'
        },
        {
            items: [
                '<hig>金创药</hig>',
                '<hig>引气丹</hig>',
            ],
            type: 'shop',
            npc: '平一指',
            cmd: 'fly 0;e;e;n'
        },
    ];
	function find_task_items(item) {
		for (var i = 0; i < task_items.length; i++) {
			var data = task_items[i];
			for (var j = 0; j < data.items.length; j++) {
				if (data.items[j] == item) {
					return data;
				}
			}
		}
		return null;
	}
    }, 1000);
})();

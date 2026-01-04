// ==UserScript==
// @name         IdleScape - Lootify Quickfix TH Zones
// @namespace    D4IS
// @version      1.4.11
// @description  IdleScape Statistics Tracker
// @author       D4M4G3X
// @match        *://*.idlescape.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/426184/IdleScape%20-%20Lootify%20Quickfix%20TH%20Zones.user.js
// @updateURL https://update.greasyfork.org/scripts/426184/IdleScape%20-%20Lootify%20Quickfix%20TH%20Zones.meta.js
// ==/UserScript==
if( typeof WebSocket.prototype._send == "undefined" ){
    WebSocket.prototype._send = WebSocket.prototype.send;
}
WebSocket.prototype.send = function(data){
    this._send(data);
    if( typeof window.IdlescapeSocket == "undefined" ){
        window.IdlescapeSocket = this;
        this.send = this._send;
    }
}

let setupSocket = setInterval(()=> {
    if( typeof window.IdlescapeSocket !== "undefined" ){
        clearInterval(setupSocket);
        window.IdlescapeSocket.addEventListener('message', (e) => socketMessageHandler(e));
        console.log('Lootify: Attached to socket!');
    }
}, 250);

function socketMessageHandler(e) {
    let lib = window.D4IS;
    let getHandler = setInterval(()=> {
        if (lib) {
            clearInterval(getHandler);
            lib.app.messageHandler(e);
        }
    }, 250);
}

(function() {
    window.D4IS = {
        init: function(name, ver) {
            let lib = this;
            if (!lib.app.getAllowedApps().includes(name)) { return false; }
            !lib.apps ? lib.apps = [] : 1;
            lib.apps.push(name);
            lib[name] = {};
            lib[name].name = name;
            lib[name].ver = ver;
            lib[name].status = false;
            lib[name].setup = false;
            lib[name].ready = false;

            lib.app.getStatus(name, function(name, d) {
                if (d === 'true') {
                    window.D4IS[name].status = true;
                } else {
                    alert(window.D4IS.general.ucfirst(name) + ' has been temporarily disabled! Please try again later.');
                }
            });

            lib.app.getData(function() {
                if (lib[name].status) {
                    if (lib.app.data) {
                        lib.app.runIntervals();
                        lib[name].ready = true;
                    }
                }
            });

            if(!lib.game.marketPrices) {
                lib.game.getMarketPrices();
            }

            lib[name].render = setInterval(() => {
                if( $('.status-action').length) {
                    clearInterval(lib[name].render);
                    if(!lib.game.getMenuItem('Mods', 'category')) {
                        lib.game.setMenuItem({
                            'text': 'Mods',
                            'clone': 'Gathering',
                            'class': 'd4is-header',
                            'before': lib.game.getMenuItem('Misc', 'category'),
                        }, 'category');
                    }
                    if (!lib.general.getStorage('Terms') || lib.general.getStorage('Terms') === 'false') {

                        let msg = "";
                        msg += "By using D4IS mods you agree to allow us saving your username and ID in our database for statistical purposes.";
                        msg += "These will be used for setting up personal statistics and highscores. (coming soon...) ";
                        msg += "If you don't want your username to be on public highscore lists then you can opt-out in the settings";
                        lib.game.dialog({
                            'title': 'Terms of service',
                            'text': msg,
                            'type': 'confirm',
                            'img': true,
                            'cbconfirm': function() {
                                lib.general.setStorage('Terms', 'true');
                            },
                        });
                    }
                    if(!lib.game.getMenuItem(lib.general.ucfirst(name) +' Settings')) {
                        lib.game.setMenuItem({
                            'icon': lib.app.APIUrl+name+'/img/'+name+'_logo.png',
                            'text': lib.general.ucfirst(name) +' Settings',
                            'class': 'd4is-menu-button',
                            'after': lib.game.getMenuItem('Mods', 'category'),
                            'click': function() {
                                $('.'+name+'-settings').toggle();
                            },
                        });
                        $('<div>', {
                            'class': name+'-settings'
                        }).hide().insertAfter(lib.game.getMenuItem(lib.general.ucfirst(name) +' Settings'));
                    }

                    if (!$('.d4is-logo').length) {
                        $('.d4is-header').prepend($('<img>', {
                            'class': 'd4is-logo'
                        }).css({
                            'width': '52px',
                            'margin-bottom': '3px'
                        }).attr('src', lib.app.APIUrl+'/assets/img/D4IS_logo.png'));
                    }
                }

            }, 250);

            return lib;
        },

        /********************************
         *	APP LIBRARY
         *
         *********************************/
        app: {
            APIUrl: 'https://digimol.net/idlescape/',

            debug: {
                socket: false,
                interval: false,
            },

            runIntervals: function() {
                let lib = window.D4IS;
                !lib.app.interval ? lib.app.interval = [] : 1;
                if(!lib.app.interval.includes('updater')) {
                    lib.app.interval.push('updater');
                    lib.app.updater = setInterval(() => {
                        lib.app.getData();
                        $.each(lib.apps, function(k, name) {
                            if (lib[name]) {
                                lib.app.checkUpdates(name, lib[name].updateLocation);
                            }
                        });
                    }, 5 * 60 * 1000);
                }
                if(!lib.app.interval.includes('quick')) {
                    lib.app.interval.push('quick');
                    lib.app.quick = setInterval(() => {
                        if( $('.status-action').length) {
                            lib.user.updateStatus();
                        }
                    }, 250);
                }
                if(!lib.app.interval.includes('debug') && lib.app.debug.interval) {
                    lib.app.interval.push('debug');
                    lib.app.debugInterval = setInterval(() => {
                        if( $('.status-action').length) {

                        }
                    }, 3000);
                }
            },

            checkUpdates: function(name, $place) {
                let lib = window.D4IS;
                let app = lib[name];
                this.getNewest(name, function(d) {
                    app.newver = d ? d : 0;
                });
                if (app.newver && app.ver < app.newver) {
                    if (!$('.'+name+'-update').length) {
                        if(!~app.ver.toLowerCase().indexOf('error')) {
                            $('<div>', {
                                'class': 'd4is-update '+name+'-update'
                            }).text(lib.general.ucfirst(name)+' update: v'+app.newver+' available!').insertAfter($place);
                        }
                    }
                }
            },
            setUpdateLocation: function(app, $location) {
                let lib = window.D4IS;
                if (lib[app]) {
                    lib[app].updateLocation = $location;
                }
            },
            setCommand: function(cmd, cb) {
                let lib = window.D4IS;
                !lib.app.commands ? lib.app.commands = {} : 1;
                lib.app.commands[cmd] = cb;
            },
            updateUser(app) {
                let lib = window.D4IS;
                lib.app.getRequest(app, lib.app.APIUrl+'/assets/api.php?a=updateuser&id='+lib.user.id+'&name='+lib.user.name);
            },
            getAllowedApps: function() {
                return ['lootify', 'chat.0'];
            },
            getNewest: function(app, cb) {
                let lib = window.D4IS;
                $.get(lib.app.APIUrl+'/assets/const.php?type=ver&app='+app).done(function(d) {
                    cb(d);
                });
            },
            getStatus: function(app, cb) {
                let lib = window.D4IS;
                $.get(lib.app.APIUrl+'/assets/const.php?type=status&app='+app).done(function(d) {
                    cb(app, d);
                });
            },
            getRequest: function(app, url, cb = function(){}) {
                let lib = window.D4IS;
                let ver = lib[app] ? lib[app].ver : '0';
                $.get(lib.app.APIUrl+'/assets/api.php?a=getauth').done(function(d1) {
                    $.get(url+'&auth='+d1+'&app='+app+'&ver='+ver).done(function(d2) {
                        cb(d2);
                    });
                });
            },
            getData(cb = function(){}) {
                let lib = window.D4IS;
                lib.app.getRequest('', lib.app.APIUrl+'/assets/data.php?', function(d) {
                    lib.app.data = d ? JSON.parse(d) : {};
                    cb();
                });
            },
            messageHandler: function(e) {
                let lib = window.D4IS;
                let msg = e.data;
                msg = (msg.match(/^[0-9]+(\[.+)$/) || [])[1];
                if(msg && !~msg.indexOf('chat') && !~msg.indexOf('Essence') && !~msg.indexOf('"send message"')) {
                    (msg && lib.app.debug.socket) ? console.log(JSON.parse(msg)) : 1;
                }
                if(msg && ~msg.indexOf('"update player"')) {
                    let d = JSON.parse(msg.split('Socket'))[1];
                    if(~msg.indexOf('activeEnchantments')) {
                        if(~msg.indexOf('"portion":"all"')) {
                            lib.user.enchantments = d.value.activeEnchantments;
                            lib.user.name = d.value.username;
                            lib.user.id = d.value.id;
                            lib.user.stockpile = d.value.stockpile;
                            if(lib.apps.includes('lootify')) {
                                lib['lootify'].initExp(d);
                            }

                        } else {
                            lib.user.enchantments = d.value[0];
                        }
                    }
                }
                // GET MINING AND FORAGING ITEMS
                if (lib.user.isActiveSkill()) {
                    if (msg && ~msg.indexOf('"update inventory"') && !~msg.indexOf('Essence')) {
                        let d = JSON.parse(msg)[1];
                        let allowed = true;
                        let stockpileID = undefined;
                        $.each(lib.user.stockpile, function(i, item) {
                            if (item.name === d.item.name) {
                                if (d.item.stackSize < item.stackSize) {
                                    allowed = false;
                                }
                                stockpileID = i;
                            }
                        });
                        if (lib.user.lastAction === 'vault') {
                            lib.user.lastAction = '';
                            allowed = false;
                        }
                        if(lib.apps.includes('lootify') && allowed) {
                            lib['lootify'].addLogMob(d);
                        }
                        if (lib.user.stockpile) {
                            if (stockpileID) {
                                lib.user.stockpile[stockpileID].stackSize = d.item.stackSize;
                            } else {
                                lib.user.stockpile.push(d.item);
                            }
                        }
                    }
                }
                // GET COMBAT EXP
                if(msg && ~msg.indexOf('"update player"') && ~msg.indexOf('"skills"')) {
                    if(lib.apps.includes('lootify')) {
                        lib['lootify'].updateExp(msg);
                    }
                }
                // UPDATE STATUS
                if(msg && ~msg.indexOf('"start animation"')) {
                    let d = JSON.parse(msg)[1];
                    lib.user.prevStatus = !lib.user.isStatus(d.action) ? lib.user.getStatus() : lib.user.prevStatus;
                    lib.user.status = d.action;
                    lib.user.location = d.location;
                }
                // CHECK IF PLAYER WENT TO MARKET
                if(msg && ~msg.indexOf('"get player marketplace items"')) {
                    if(lib.apps.includes('lootify')) {
                        lib['lootify'].disablePaster();
                    }
                }
                // CHECK IF PLAYER USED THE FAULT
                if(msg && ~msg.indexOf('"update inventory"') && ~msg.indexOf('vault')) {
                    lib.user.lastAction = 'vault';
                }
                // GET COMBAT EXP
                if(msg && ~msg.indexOf('"update player"') && ~msg.indexOf('"crafting"')) {
                    lib.user.lastAction = 'crafting';
                }
                if(msg && ~msg.indexOf('"new monster"')) {
                    let d = JSON.parse(msg)[1];
                    lib.user.currentMob = d.name;
                }
                if(msg && ~msg.indexOf('"clear monster"')) {
                    let d = JSON.parse(msg)[1];
                    lib.user.currentMob = '';
                }
            }
        },

        /********************************
         *	GAME LIBRARY
         *
         *********************************/
        game: {
            isUniversalItem: function(txt) {
                let lib = window.D4IS;
                return lib.app.data.item ? lib.app.data.item.universal.includes(txt) : false;
            },
            isRareItem: function(txt) {
                let lib = window.D4IS;
                return lib.app.data.item ? lib.app.data.item.rare.includes(txt) : false;
            },
            isEventItem: function(txt) {
                let lib = window.D4IS;
                return lib.app.data.item ? lib.app.data.item.event.includes(txt) : false;
            },
            isEventMob: function(txt) {
                let lib = window.D4IS;
                return lib.app.data.mob ? lib.app.data.mob.event.includes(txt) : false;
            },
            isAllowedItem: function(skill, item) {
                let lib = window.D4IS;
                if (lib.user.isStatus('cooking')) { return false; }
                let allowed = false;
                if (lib.app.data.skill) {
                    if (lib.app.data.skill[skill].allowed.includes(item)) {
                        allowed = true;
                    }
                }
                return allowed;
            },
            getSkillIcon: function(skill) {
                let icon = '';
                switch(skill) {
                    case 'mining':
                        icon = '/images/mining/iron_pickaxe.png';
                        break;
                    case 'foraging':
                        icon = '/images/foraging/foraging_icon.png';
                        break;
                    case 'fishing':
                        icon = '/images/fishing/fishing_logo.png';
                        break;
                    case 'smithing':
                        icon = '/images/smithing/smithing_icon.png';
                        break;
                    case 'crafting':
                        icon = '/images/ui/crafting_icon.png';
                        break;
                    case 'cooking':
                        icon = '/images/cooking/cooking_icon.png';
                        break;
                    case 'constitution':
                        icon = '/images/combat/constitution_icon.png';
                        break;
                    case 'attack':
                        icon = '/images/combat/attack_icon.png';
                        break;
                    case 'strength':
                        icon = '/images/combat/strength_icon.png';
                        break;
                    case 'defense':
                        icon = '/images/combat/defense_icon.png';
                        break;
                    case 'runecrafting':
                        icon = '/images/runecrafting/RuneCraftingIcon.png';
                        break;
                    case 'enchanting':
                        icon = '/images/enchanting/enchanting_logo.png';
                        break;
                    case 'farming':
                        icon = '/images/farming/farming_icon.png';
                        break;
                }
                return icon;
            },
            getLeagueIcon: function(league) {
                let icon = '';
                switch(league) {
                    case 'default':
                        icon = '/images/leagues/default_league_icon.png';
                        break;
                    case 'ironman':
                        icon = '/images/leagues/ironman_league_icon_v5.png';
                        break;
                }
                return icon;
            },
            getMobIcon: function(name) {
                let lib = window.D4IS;
                return lib.app.data.icon ? lib.app.data.icon.mob[name] : '';
            },
            getZoneMobs: function(name) {
                let zone = {
                    "Farm": [
                        'Cow',
                        'Chicken',
                        'Small Rat',
                        'Farm Goblin'
                    ],
                    "Caves": [
                        'Imp',
                        'Greater Imp',
                        'Cave Goblin'
                    ],
                    "City": [
                        'Guard',
                        'Black Knight'
                    ],
                    "Lava Maze": [
                        'Deadly Red Spider',
                        'Lesser Demon'
                    ],
                    "Corrupted Lands": [
                        "Bone Giant",
                        "Infected Naga",
                        "Corrupted Tree"
                    ],
                    "Valley of Giants": [
                        'Fire Giant',
                        'Moss Giant',
                        'Ice Giant'
                    ]
                };
                return zone[name];
            },
            getLocation: function(id = undefined) {
                let loc = {
                    10: {
                        name: 'Clay Pit',
                        icon: 'https://idlescape.com/images/mining/Place-ClayPits.png'
                    },
                    11: {
                        name: 'City Outskirts',
                        icon: 'https://idlescape.com/images/mining/Place-CityOutskirts.png'
                    },
                    14: {
                        name: 'Village',
                        icon: 'https://idlescape.com/images/mining/Place-Village.png'
                    },
                    15: {
                        name: 'Desert',
                        icon: 'https://idlescape.com/images/mining/Place-Desert.png'
                    },
                    17: {
                        name: 'Underground',
                        icon: 'https://idlescape.com/images/mining/Place-Underground.png'
                    },
                    19: {
                        name: 'Hidden Mine',
                        icon: 'https://idlescape.com/images/mining/Place-HiddenLocation.png'
                    },
                    13: {
                        name: 'Volcano',
                        icon: 'https://idlescape.com/images/mining/Place-Volcano.png'
                    },
                    20: {
                        name: 'Deep Pit',
                        icon: 'https://idlescape.com/images/mining/Place-DeepMine.png'
                    },
                    12: {
                        name: 'Grasslands',
                        icon: 'https://idlescape.com/images/foraging/grasslands.png'
                    },
                    21: {
                        name: 'Verdant Valley',
                        icon: 'https://idlescape.com/images/foraging/verdant_valley.png'
                    },
                    22: {
                        name: 'Fungal Grotto',
                        icon: 'https://idlescape.com/images/foraging/fungal_grotto.png'
                    },
                    16: {
                        name: 'The Tangle',
                        icon: 'https://idlescape.com/images/foraging/the_tangle.png'
                    },
                    24: {
                        name: 'Misty Marsh',
                        icon: 'https://idlescape.com/images/foraging/misty_marsh.png'
                    },
                    18: {
                        name: 'Frozen Tundra',
                        icon: 'https://idlescape.com/images/foraging/frozen_tundra.png'
                    },
                    25: {
                        name: 'Haunted Woods',
                        icon: 'https://idlescape.com/images/foraging/haunted_woods.png'
                    },
                    26: {
                        name: 'Living Forest',
                        icon: 'https://idlescape.com/images/foraging/living_forest.png'
                    },
                    50: {
                        name: 'Shallow Pond',
                        icon: 'https://idlescape.com/images/fishing/net_fishing.jpg'
                    },
                    51: {
                        name: 'Lazy River',
                        icon: 'https://idlescape.com/images/fishing/fly_fishing.jpg'
                    },
                    52: {
                        name: 'Still Lake',
                        icon: 'https://idlescape.com/images/fishing/cage_fishing.jpg'
                    },
                    53: {
                        name: 'Open Ocean',
                        icon: 'https://idlescape.com/images/fishing/harpoon_fishing.jpg'
                    },
                };
                return id ? loc[id] : loc;
            },
            getLocationID: function(name) {
                let lib = window.D4IS;
                let id = -1;
                let loc = lib.game.getLocation();
                if(loc) {
                    $.each(loc, function(k, loc) {
                        if (name === loc.name) {
                            id = k;
                        }
                    });
                }
                return id;
            },
            getLocationName: function(id) {
                let lib = window.D4IS;
                let loc = lib.game.getLocation(id);
                return loc ? loc.name : undefined;
            },
            getLocationIcon: function(id) {
                let lib = window.D4IS;
                let loc = lib.game.getLocation(id);
                return loc ? loc.icon : undefined;
            },
            getMarketPrices: function() {
                let lib = window.D4IS;
                let get = function() {
                    $.getJSON( '/api/market/manifest', function( d ) {
                        if(d) {
                            $.each(d.manifest, function(k, v) {
                                !lib.game.marketPrices ? lib.game.marketPrices = {} : 1;
                                lib.game.marketPrices[v.name] = v.minPrice;
                            });
                        }
                    });
                };
                get();

                setInterval(()=> {
                    get();
                }, 5 * 60 * 1000);
            },
            getLevel: function(xp) {
                let lib = window.D4IS;
                let level = 0;
                for(i = 1; i <= 200; i++) {
                    if(xp >= lib.game.getExperience(i) && xp < lib.game.getExperience(i+1)) {
                        level = i;
                        break;
                    }
                }
                return parseInt(level);
            },
            getExperience: function(level) {
                let lib = window.D4IS;
                level -= 1;
                let xp = 0;
                let output = 0;
                let i;
                for(i = 1; i <= level; i++) {
                    xp += Math.floor((i + (300 * (Math.pow(2, (i/7.0))))));
                }
                return Math.floor((xp/4));
            },
            setMenuItem: function(args, type = 'item') {
                let $item, $img, e;
                !args['text'] ? args['text'] = 'Menu Item' : 1;
                !args['clone'] ? args['clone'] = 'Shop' : 1;

                if(!this.getMenuItem(args['clone'], type)) { return $('<div>'); }
                $item = this.getMenuItem(args['clone'], type).clone();

                if(args['class']) {
                    $item.addClass(args['class']);
                }

                if(args['css']) {
                    $item.css(args['css']);
                }

                $img = $item.find('img').clone();
                $item.unbind().empty();

                if(type === 'item') {
                    $item.append($('<span/>').text(args['text']));
                } else if (type === 'category') {
                    $item.append($('<b/>').text(args['text']));
                }

                if (args['icon']) {
                    $img.attr('src', args['icon']).prependTo($item);
                }

                args['before'] ? args['before'].before($item) : 1;
                args['after'] ? args['after'].after($item) : 1;

                if (typeof args['click'] === 'function') {
                    $item.click(args['click']);
                }

                return $item;
            },
            getMenuItem: function(label, type = 'item') {
                let $item;
                $.each($('.drawer-' + type), function() {
                    if (~$(this).text().indexOf(label)) {
                        $item = $(this);
                    }
                });
                return $item;
            },
            editMenuItem: function(label) {
                this.getMenuItem(label).text('Hidden').hide();
            },
            removeMenuItem: function(label) {
                this.getMenuItem(label).remove();
            },
            addSetting: function(args) {
                let lib = window.D4IS;
                if(!args['app']) { return false; }
                if($('.'+args['app']+'-setting-'+args['name'].toLowerCase()).length) { return false; }
                args['text'] = args['text'] ? args['text'] : 'New setting';
                args['name'] = args['name'] ? args['name'] : args['text'].replace(' ', '-').toLowerCase();
                args['type'] = args['type'] ? args['type'] : 'text';
                args['default'] = args['default'] ? args['default'] : 0;
                let $setting = $('<div/>', {
                    'class': 'd4is-setting '+ args['app']+'-setting-'+args['name'].toLowerCase()
                }).append($('<span/>')).append($('<input/>').addClass('setting-'+args['type']));
                $setting.find('span').text(args['text']);
                $setting.find('input').addClass(args['name']).attr('type', args['type']);
                if (args['min']) {
                    $setting.find('input').attr('min', args['min']);
                }
                if (args['max']) {
                    $setting.find('input').attr('max', args['max']);
                }
                let val = lib.general.getStorage(args['name']);
                if (args['type'] === 'checkbox') {
                    val = val ? val : args['default'];
                    val = val == 'true' ? true : false;
                    $setting.find('input').prop('checked', val);
                }
                if (val) {
                    $setting.find('input').val(val)
                } else {
                    $setting.find('input').val(args['default']);
                }
                if (args['change']) {
                    $setting.find('input').change(args['change']);
                }
                $setting.appendTo($('.'+args['app']+'-settings'));
                return $setting;
            },
            tooltip: function($obj, msg) {
                let $tooltip;
                let pos = $obj.position();
                $obj.hover(function() {
                    $tooltip = $('<div>', {
                        'class': 'ltf-tooltip'
                    }).css({
                        'left': pos.left + 50,
                        'top': pos.top
                    }).html('<span>'+msg+'</span>').appendTo($obj);
                }, function() {
                    $tooltip.remove();
                });
            },
            dialog: function(args) {
                let lib = window.D4IS;
                args['class'] = args['class'] ? args['class'] : '';
                $('.d4is-dialog').remove();
                let $root = $('<div>', {
                    'class': 'd4is-dialog '+args['class']
                }).appendTo($('#root'));

                if(args['class']) {
                    $root.addClass(args['class']);
                }

                let $backdrop = $('<div>', {
                    'class': 'd4is-dialog-backdrop'
                }).attr({
                    'aria-hidden': 'true'
                }).appendTo($root);

                let $container = $('<div>', {
                    'class': 'd4is-dialog-container d4is-dialog-scrollPaper',
                }).css({
                    'opacity': '1',
                    'transition': 'opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
                }).appendTo($root);

                let $paper = $('<div>', {
                    'class': 'd4is-dialog-MuiPaper-root d4is-dialog-MuiDialog-paper d4is-dialog-paperScrollPaper d4is-dialog-paperWidthSm'
                }).css({
                    'z-index': '200'
                }).appendTo($container);

                if (args['img']) {
                    let $image = $('<img>', {
                        'class': 'ltf-dialog-image'
                    }).attr({
                        'src': lib.app.APIUrl+'/lootify/img/lootify_logo.png'
                    }).appendTo($paper);
                }

                let $title = $('<div>', {
                    'class': 'd4is-dialog-Title-root'
                }).appendTo($paper);

                $('<h2>', {
                    'class': 'd4is-dialogTypography-root d4is-dialogTypography-h6'
                }).html(args['title']).appendTo($title);

                $('<p>', {
                    'class': 'd4is-dialogTypography-root'
                }).html(args['text']).appendTo($paper);

                let $actions = $('<div>', {
                    'class':  'd4is-dialogDialogActions-root'
                }).appendTo($paper);

                if(!args['cbyes']) {
                    args['cbyes'] = function(){};
                }
                if(!args['cbno']) {
                    args['cbno'] = function(){};
                }
                if(!args['cbconfirm']) {
                    args['cbconfirm'] = function(){};
                }

                let $button = [];
                args['type'] = args['type'] ? args['type'] : 'yesno';
                if (args['type'] === 'yesno') {
                    $backdrop.click(function() {
                        $root.remove();
                    });
                    $button[0] = $('<div>', {
                        'class': 'item-dialogue-button idlescape-button idlescape-button-green'
                    }).attr({
                        'variant': 'contained',
                        'color': 'secondary'
                    }).text('Yes').appendTo($actions);
                    $button[0].click(function() {
                        $root.remove();
                        args['cbyes']();
                    });
                    $button[1] = $('<div>', {
                        'class': 'item-dialogue-button idlescape-button idlescape-button-red'
                    }).attr({
                        'variant': 'contained',
                        'color': 'secondary'
                    }).text('No').appendTo($actions);
                    $button[1].click(function() {
                        $root.remove();
                        args['cbno']();
                    });
                } else if(args['type'] === 'confirm') {
                    $button[0] = $('<div>', {
                        'class': 'item-dialogue-button idlescape-button idlescape-button-blue'
                    }).attr({
                        'variant': 'contained',
                        'color': 'primary'
                    }).text('Accept').appendTo($actions);
                    $button[0].click(function() {
                        $root.remove();
                        args['cbconfirm']();
                    });
                } else if(args['type'] === 'close') {
                    $button[0] = $('<div>', {
                        'class': 'item-dialogue-button idlescape-button idlescape-button-red'
                    }).attr({
                        'variant': 'contained',
                        'color': 'primary'
                    }).text('Close').appendTo($actions);
                    $button[0].click(function() {
                        $root.remove();
                    });
                }
            },
            chat: function(args) {
                let lib = window.D4IS;
                if(lib.general.getStorage('ChatMessage') === 'false') {
                    return false;
                }
                let e = setInterval(()=> {
                    let $chat = $('.chat-message-container > .chat-message-list > div');
                    if( $chat.length ) {
                        clearInterval(e);
                        $chat.each(function() {
                            if (!$(this).find('.activity-log').length) {
                                let $msg = $('<div/>', {
                                    'class': 'chat-message msg-lootify'
                                }).clone().appendTo($(this));
                                if (args['date'] !== false) {
                                    let $date = $('<span/>', {
                                        'class': 'message-time-stamp',
                                    }).text('['+lib.general.getDate(new Date)+']').appendTo($msg);
                                }
                                args['color'] = args['color'] ? args['color'] : '#00A0FD';
                                args['glow'] = args['glow'] ? '0 0 3px '+args['glow'] : 'none';
                                let $txt = $('<span/>', {
                                    'class':'chat-message-system'
                                }).css({
                                    'font-size': '14px',
                                    'color': args['color'],
                                    'text-shadow': args['glow'],
                                }).text(args['msg']).appendTo($msg);

                                args['ttl'] = args['ttl'] ? args['ttl'] : 5;
                                setTimeout(()=> {
                                    $msg.remove();
                                }, args['ttl'] * 60 * 1000);
                            }
                        });
                    }
                }, 1000);
            },
        },

        /********************************
         *	USER LIBRARY
         *
         *********************************/
        user: {
            getName: function() {
                return $('.navbar1-box').text().split(' ')[1];
            },
            getStatus: function() {
                let lib = window.D4IS;
                return lib.user.status;
            },
            getStockpile: function(item = undefined) {
                let lib = window.D4IS;
                let stack = lib.user.stockpile;
                if (item) {
                    $.each(lib.user.stockpile, function(i, v) {
                        if (v.name.toLowerCase() === item.toLowerCase()) {
                            stack = v;
                            return false;
                        }
                        stack = undefined;
                    });
                }
                return stack;
            },
            getEnchantment: function(id) {
                let lib = window.D4IS;
                let strength = 0;
                if(lib.user.enchantments) {
                    $.each(lib.user.enchantments, function(k, v) {
                        if(v.enchantmentID == id) {
                            strength = v.enchantmentStrength;
                        }
                    });
                }
                return strength;
            },
            getTimeToLevel: function(level, currentExp, gainedExp, time) {
                let lib = window.D4IS;
                let currentLevel = lib.game.getLevel(currentExp);
                let nextExp = lib.game.getExperience(level);
                let diffExp = nextExp - currentExp;
                let ePerSec = (gainedExp/time);
                return lib.general.getTimeString(Math.floor((diffExp/ePerSec)*1000), true);
            },
            isIron: function() {
                return $('.header-league-icon').attr('src') === '/images/leagues/ironman_league_icon_v5.png';
            },
            isActiveSkill: function() {
                let lib = window.D4IS;
                let isActive = false;
                if (lib.app.data) {
                    $.each(lib.app.data.active.skills, function(k, skill) {
                        if(lib.user.isStatus(skill)) {
                            isActive = true;
                            return false;
                        }
                    });
                }
                return isActive;
            },
            isFighting: function() {
                let lib = window.D4IS;
                return lib.user.isStatus('fighting');
            },
            isStatus: function(txt) {
                let lib = window.D4IS;
                !lib.user.status ? lib.user.status = 'idling' : 1;
                return lib.user.status === txt;
            },
            isPrevStatus: function(txt) {
                let lib = window.D4IS;
                return lib.user.prevStatus === txt;
            },
            updateStatus: function() {
                let lib = window.D4IS;
                if ($('.status-action').length) {
                    let list = ['Fighting', 'Idling', 'Mining', 'Foraging', 'Fishing', 'Cooking', 'Smithing'];
                    $.each(list, function(k, v) {
                        if(~$(document).attr('title').indexOf(v)) {
                            lib.user.prevStatus = !lib.user.isStatus(v.toLowerCase()) ? lib.user.status : lib.user.prevStatus;
                            lib.user.status = v.toLowerCase();
                        }
                    });
                }
            },
        },

        /********************************
         *	GENERAL LIBRARY
         *
         *********************************/
        general: {
            Timer: function(app, name) {
                let lib = window.D4IS;
                !lib[app].timers ? lib[app].timers = {} : 1;
                !lib[app].timers[name] ? lib[app].timers[name] = this : 1;
                let that = this;

                that.running = false;
                that.status = name;
                that.starts = [];
                that.stops = [];

                that.time = 0;
                that.interval = setInterval(()=> {
                    if (that.running) {
                        that.time = lib.general.getTime(that.starts, that.stops);
                        if($('.time-stats').length) {
                            $('.time-stats').find('span').text('Elapsed: ' + lib.general.getTimeString(that.time));
                        }
                    }
                    if (lib.user.getStatus() === that.status) {
                        !that.running ? that.start() : 1;
                    } else {
                        that.running ? that.stop() : 1;
                    }
                }, 250);

                that.start = function() {
                    if (that.status == 'idling') {
                        that.starts = [];
                        that.stops = [];
                    }
                    that.running = true;
                    that.starts.unshift(new Date());
                };
                that.stop = function() {
                    that.running = false;
                    that.stops.unshift(new Date());
                };
                that.reset = function() {
                    clearInterval(that.interval);
                    delete lib[app].timers[name];
                };
            },
            getTimerTime: function(app, status) {
                let lib = window.D4IS;
                if (lib[app].timers) {
                    return lib[app].timers[lib.user.getStatus()] ? lib[app].timers[lib.user.getStatus()].time/1000 : 0;
                }
            },
            setStorage: function(name, value) {
                let lib = window.D4IS;
                window.localStorage.setItem(lib.user.getName() + '-' + name, value);
            },
            getStorage: function(name) {
                let lib = window.D4IS;
                return window.localStorage.getItem(lib.user.getName() + '-' + name);
            },
            getTime: function(starts, stops) {
                let count = 0;
                $.each(starts, function(k, start) {
                    let stop = !stops[k] ? new Date() : stops[k];
                    count += stop - start;
                });
                return Math.round(count);
            },
            getTimeString: function(count, disableSec = false) {
                let s = Math.floor((count /  1000)) % 60;
                let m = Math.floor((count / 60000)) % 60;
                let h = Math.floor((count / 3600000)) % 24;
                let d = Math.floor((count / 86400000)) % 7;
                let w = Math.floor((count / 604800000)) % 52;
                let y = Math.floor((count / 31557600000));
                let timeStr = '';
                if(!isFinite(y)) {
                    return 'Infinity';
                }
                timeStr += (y>0) ? y+'Y ' : '';
                timeStr += (w>0) ? w+'W ' : '';
                timeStr += (d>0) ? d+'D ' : '';
                timeStr += (h>0) ? h+'H ' : '';
                if(y<1) {
                    timeStr += (m>0) ? m+'M ' : '';
                }
                if (!disableSec) {
                    timeStr += (s>0) ? s+'S ' : '';
                }

                return timeStr;
            },
            getDate: function(date) {
                let h = date.getHours();
                let m = date.getMinutes();
                let s = date.getSeconds()
                m = m < 10 ? '0'+m : m;
                s = s < 10 ? '0'+s : s;
                h = h < 10 ? '0'+h : h;
                let strTime = h + ':' + m + ':' + s;
                if(~$('.chat-message .message-time-stamp').text().indexOf(' AM]') || ~$('.chat-message .message-time-stamp').text().indexOf(' PM]')) {
                    let ampm = parseInt(h) >= 12 ? 'PM' : 'AM';
                    h = h % 12;
                    h = h ? h : 12;
                    strTime = h + ':' + m + ':' + s + ' '  + ampm
                }
                return strTime;
            },
            addCommas: function(nStr) {
                nStr += '';
                let x = nStr.split('.');
                let x1 = x[0];
                let x2 = x.length > 1 ? '.' + x[1] : '';
                let rgx = /(\d+)(\d{3})/;
                while (rgx.test(x1)) {
                    x1 = x1.replace(rgx, '$1' + ',' + '$2');
                }
                return x1 + x2;
            },
            ucfirst: function(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            },
            sortObject: function(o) {
                var sorted = {},
                    key, a = [];
                for (key in o) {
                    if (o.hasOwnProperty(key)) {
                        a.push(key);
                    }
                }
                a.sort();
                for (key = 0; key < a.length; key++) {
                    sorted[a[key]] = o[a[key]];
                }
                return sorted;
            }
        },
    }

    /* INITIATE APPLICATION */
    let lib = {};
    let app = {};

    let initInterval = setInterval(()=> {
        if (window.D4IS && window.D4IS.init) {
            clearInterval(initInterval);
            lib = window.D4IS.init('lootify', '1.4.10');
            app = lib['lootify'];
            lib.app.setUpdateLocation(lib.game.getMenuItem('Lootify Settings'));
            main();
        }
    }, 250);

    function main() {
        /* SET DEFAULT VALUES */
        let runs = [{}];
        let total = {};
        let totalLoot = {};
        let headers = {};

        /* ############## INTERVALS ############## */
        let mainInterval = setInterval(()=> {
            if (app.ready && $('.status-action').length) {
                if(is()) {
                    if(!app.setup) {
                        app.setup = true;
                        setupSettings();
                        lib.app.updateUser(app.name);
                        app.getKills();
                        setupLogs();
                    }
                    renderErrors();
                    renderStatus();
                    saveLogs();
                    mergeLogs();
                    renderLogs();
                    renderTimer();
                    renderKPH();
                    renderGPH();
                    renderXPH();
                }
            }
        }, 1000);

        let pasteInterval = setInterval(()=> {
            if (app.ready && $('.status-action').length) {
                if(lib.general.getStorage('AutoPaster') == 'true') {
                    reset('single');
                }
            }
        }, getPasteInterval() * 60 * 1000);

        let adInterval = setInterval(()=> {
            if (app.ready && $('.status-action').length) {
                lib.game.chat({
                    'msg': 'Lootify - Please report bugs to D4M4G3X#6263 on Discord!',
                    'color': '#00a0fd',
                });
            }
        }, 20 * 60 * 1000);

        let updateInterval = setInterval(()=> {
            if (app.ready && $('.status-action').length) {
                lib.app.getData();
                lib.app.updateUser(app.name);
                app.getKills();
            }
        }, 15 * 60 * 1000);

        let quickInterval = setInterval(()=> {
            if (app.ready && $('.status-action').length) {
                addConfirmations();
                checkRemovals();
                checkDisabled();
                checkChests();
            }
        }, 250);

        function addConfirmations() {

            // #### GATHERING CONFIRMATIONS #### //
            $('.resource-container-button').each(function() {
                if(lib.app.data) {
                    if (!lib.app.data.active.skills.includes($(this).parents('.play-area').attr('class').split('theme-')[1])) {
                        return false;
                    }

                    let $parent = $(this).parents('.resource-container');
                    if( !$(this).next('.resource-button-overlay').length && !~$(this).text().indexOf('Stop')) {
                        let $btn = $(this).find('.resource-button').hide();

                        let $btnClone = $('<div>', {
                            'class': 'resource-button-overlay resource-button'
                        }).text($btn.text()).insertAfter($(this));

                        $btnClone.click(function() {
                            let includes = false;
                            // Switch Warnings Disabled
                            if (lib.general.getStorage('SwitchReset') === 'false') {
                                $parent.find('.resource-button:not(.resource-button-overlay)').click();
                                return false;
                            }

                            // Game Start
                            if ((lib.user.isStatus('idling') && !app.prevStatus) || isLogEmpty()) {
                                $parent.find('.resource-button:not(.resource-button-overlay)').click();
                                return false;
                            }

                            // Is Logged
                            if (isLogged('skill', $parent.find('.resource-container-title').text())) {
                                $parent.find('.resource-button:not(.resource-button-overlay)').click();
                                return false;
                            }

                            lib.game.dialog({
                                'title': 'Lootify warning!',
                                'text': 'Going to a different location will paste and reset your Lootify statistics, are you sure you want to do this?',
                                'img': true,
                                'cbyes': function() {
                                    reset();
                                    $parent.find('.resource-button:not(.resource-button-overlay)').click();
                                }
                            });
                        });
                    }
                    if (~$(this).text().indexOf('Stop')) {
                        $(this).next('.resource-button-overlay').remove();
                        $(this).find('.resource-button').show();
                    }
                }
            });

            // #### COOKING CONFIRMATIONS #### //

            if ($('.cooking-item').find('img').length) {
                if(!$('.cooking-start-clone').length && !lib.user.isStatus('cooking')) {
                    let $cookBtn = $('.cooking-start-button').css('visibility', 'hidden');
                    let $cloneBtn = $('<div>', {
                        'class': 'cooking-start-button cooking-start-clone'
                    }).text('Start Cooking').insertAfter($cookBtn);
                    $(window).resize(function() {
                        let pos = $cookBtn.position();
                        $cloneBtn.width($cookBtn.width());
                        $cloneBtn.css({
                            'position': 'absolute',
                            'z-index': '1000',
                            'top': pos.top,
                            'left': pos.left,
                        });
                    }).resize();
                    $cloneBtn.click(function() {
                        // Switch Warnings Disabled
                        if (lib.general.getStorage('SwitchReset') === 'false') {
                            $cookBtn.click();
                            $cookBtn.css('visibility', 'visible');
                            $cloneBtn.hide();
                            return false;
                        }

                        // Game Start
                        if ((lib.user.isStatus('idling') && !app.prevStatus) || isLogEmpty()) {
                            $cookBtn.click();
                            $cookBtn.css('visibility', 'visible');
                            $cloneBtn.hide();
                            return false;
                        }

                        // Is Previous Status
                        if (lib.user.isPrevStatus('cooking')) {
                            $cookBtn.click();
                            $cookBtn.css('visibility', 'visible');
                            $cloneBtn.hide();
                            return false;
                        }

                        lib.game.dialog({
                            'title': 'Lootify warning!',
                            'text': 'Cooking now will paste and reset your current Lootify statistics, are you sure you want to do this?',
                            'img': true,
                            'cbyes': function() {
                                reset();
                                $cloneBtn.hide();
                                $cookBtn.css('visibility', 'visible');
                                $cookBtn.click();
                            }
                        });
                    });
                }
            } else {
                $('.cooking-start-button').css('visibility', 'visible');
                $('.cooking-start-clone').remove();
            }

            // #### COMBAT CONFIRMATIONS #### //

            if ($('.combat-zones').length && !$('.zone-button-overlay').length) {
                let $overlay = $('<div>', {
                    'class': 'zone-button-overlay'
                }).appendTo($('.combat-zones'));

                $('.combat-zone').each(function() {
                    let zoneName = $(this).find('.combat-zone-text').text();
                    let zoneTH = $(this).find('.combat-zone-elite-challenge').text();
                    let $zoneBtn = $('<div>', {'class':'combat-zone-clone', 'style':'font-size: 2vw;line-height:inherit;'}).appendTo($overlay);
                    $('<div>', {'class':'combat-zone-text'}).text(zoneName).appendTo($zoneBtn);
                    if (zoneTH.length > 0){
                        let thDiv = $('<div>', {'class':'combat-zone-elite-challenge'});
                        thDiv.append('<img src="/images/magic/buffs/treasurehunter_icon.png">');
                        thDiv.append(zoneTH);
                        thDiv.appendTo($zoneBtn);
                    }

                    $zoneBtn.click(function(e) {
                        let $parent = $(this).parents('.combat-zones');

                        // Switch Warnings Disabled
                        if (lib.general.getStorage('SwitchReset') === 'false') {
                            $parent.find('.combat-zone').each(function() {
                                if($(this).find('.combat-zone-text').text() === zoneName) {
                                    $(this).click();
                                }
                            });
                            return false;
                        }

                        // Game Start
                        if ((lib.user.isStatus('idling') && !lib.user.prevStatus) || isLogEmpty()) {
                            $parent.find('.combat-zone').each(function() {
                                if($(this).find('.combat-zone-text').text() === zoneName) {
                                    $(this).click();
                                }
                            });
                            return false;
                        }

                        // Is Logged
                        if (isLogged('combat', zoneName)) {
                            $parent.find('.combat-zone').each(function() {
                                if($(this).find('.combat-zone-text').text() === zoneName) {
                                    $(this).click();
                                }
                            });
                            return false;
                        }

                        // Is an event mob
                        if (lib.game.isEventMob(lib.user.currentMob)) {
                            $parent.find('.combat-zone').each(function() {
                                if($(this).find('.combat-zone-text').text() === zoneName) {
                                    $(this).click();
                                }
                            });
                            return false;
                        }

                        lib.game.dialog({
                            'title': 'Lootify warning!',
                            'text': 'Going to a different zone will paste and reset your Lootify statistics, are you sure you want to do this?',
                            'img': true,
                            'cbyes': function() {
                                $parent.find('.combat-zone').each(function() {
                                    if($(this).find('.combat-zone-text').text() === zoneName) {
                                        reset();
                                        $(this).click();
                                    }
                                });
                            },
                        });
                    });
                });

                $(window).resize(function() {
                    $overlay.width($('.combat-zones').width());
                }).resize();
            }
        }
        function checkRemovals() {
            if(!lib.user.isStatus('foraging')) { return; }
            if ($('.recipe-item').length) {
                $('.recipe-item').each(function() {
                    if($(this).find('img').attr('src') === '/images/foraging/log.png') {
                        $(this).remove();
                    }
                });
            }
        }
        function checkDisabled() {
            if(lib.user.getEnchantment('35') > 0 && lib.user.isStatus('foraging')) {
                app.isNature = true;
            }
            if(lib.user.getEnchantment('7') > 0 && lib.user.isActiveSkill()) {
                app.isWealth = true;
            }
        }
        function checkChests() {
            if ($('.chat-message .activity-log:not(.ltf-done)').length) {
                $('.chat-message .activity-log:not(.ltf-done)').each(function(k, v) {
                    $(this).addClass('ltf-done');
                    let data = {};
                    data.chest = {};
                    data.loot = {};
                    if(~$(this).text().indexOf('geode')) {
                        data.chest.base = 'geode';
                        data.chest.name = 'Geode';
                    } else if(~$(this).text().indexOf('bird nest')) {
                        data.chest.base = 'bird nest';
                        data.chest.name = "Bird's Nest";
                    } else if(~$(this).text().indexOf('sunken treasure')) {
                        data.chest.base = 'sunken treasure';
                        data.chest.name = 'Sunken Treasure';
                    } else if(~$(this).text().indexOf('satchel')) {
                        data.chest.base = 'satchel';
                        data.chest.name = 'Satchel';
                    } else {
                        return false;
                    }
                    let count = $(this).text().split(data.chest.base)[0].match(/\d+/g);
                    data.chest.count = (count) ? parseInt(count) : 1;
                    let loot = $(this).text().split('found ')[1];
                    if(~loot.indexOf(',')) {
                        loot = loot.split(', ');
                    } else {
                        let item = loot.split(' as')[0];
                        loot = [];
                        loot.push(item);
                    }
                    $.each(loot, function(k, loot) {
                        if(~loot.indexOf(' as') && !~loot.indexOf(',')) {
                            loot = loot.split(' as')[0];
                        }
                        data.loot[loot.split(' x ')[0]] = parseInt(loot.split(' x ')[1]);
                    });
                    app.addLogChest(data);
                });
            }
        }

        // #### SETUP SETTINGS ####
        function setupSettings() {
            if(!lib.game.getMenuItem('Lootify', 'category')) {
                lib.game.setMenuItem({
                    'text': 'Lootify',
                    'clone': 'Gathering',
                    'class': 'hdr-lootify',
                    'before': lib.game.getMenuItem('Gathering', 'category'),
                }, 'category');
                $('<i/>').text(' (v'+app.ver+')').appendTo(lib.game.getMenuItem('Lootify', 'category'));
            }
            // ### PRIVACY SETTINGS ###
            lib.game.addSetting({
                'app': 'lootify',
                'text': 'Allow Lootify to publicly use your username for personal highscores and kill statistics',
                'name': 'UserPublic',
                'type': 'checkbox',
                'default': 'false',
                'change': function() {
                    setUserPublic($(this).prop('checked'));
                    lib.general.setStorage('UserPublic', $(this).prop('checked'));
                }
            });
            // ### SETTING AUTO PASTER ###
            lib.game.addSetting({
                'app': 'lootify',
                'text': 'Enable Auto Paster',
                'name': 'AutoPaster',
                'type': 'checkbox',
                'default': 'false',
                'change': function() {
                    lib.general.setStorage('AutoPaster', $(this).prop('checked'));
                }
            });
            // ### SETTING PASTE INTERVAL ###
            lib.game.addSetting({
                'app': 'lootify',
                'text': 'Paste Interval (minutes)',
                'name': 'AutoPasterInterval',
                'type': 'number',
                'min': 15,
                'max': 60,
                'default': 30,
                'change': function() {
                    if($(this).val() >= $(this).attr('min') && $(this).val() <= $(this).attr('max')) {
                        lib.general.setStorage('AutoPasterInterval', $(this).val());
                    }
                }
            });
            // ### SETTING CHAT MESSAGES ###
            lib.game.addSetting({
                'app': 'lootify',
                'text': 'Enable Chat Messages',
                'name': 'ChatMessage',
                'type': 'checkbox',
                'default': 'true',
                'change': function() {
                    lib.general.setStorage('ChatMessage', $(this).prop('checked'));
                }
            });
            // ### RESET ON SWITCH ###
            lib.game.addSetting({
                'app': 'lootify',
                'text': 'Reset on Switch',
                'name': 'SwitchReset',
                'type': 'checkbox',
                'default': 'true',
                'change': function() {
                    lib.general.setStorage('SwitchReset', $(this).prop('checked'));
                }
            });
        }
        function renderErrors() {
            if (!app.disabled || !app.enabled) {
                $('.lootify-error').remove();
            }
            if (!$('.lootify-error.error-paster').length && app.disabled) { // TODO: Create Error Message Function
                let $error = $('<div/>', {
                    'class': 'lootify-error error-paster'
                }).css({
                    'color': 'red',
                    'width': '80%',
                    'margin': '0 auto',
                }).html('Paster is disabled!<br>Reset log to Enable again.').insertAfter(lib.game.getMenuItem('Lootify', 'category'));
                lib.game.tooltip($error, 'Pasting is disabled on market usage, you can still use the counters.<br> This is done to prevent skewing the statistics.');
            }
            if (!$('.lootify-error.error-nature').length && app.isNature) { // TODO: Create Error Message Function
                let $error = $('<div/>', {
                    'class': 'lootify-error error-nature'
                }).css({
                    'color': 'red',
                    'width': '80%',
                    'margin': '0 auto',
                }).html('Paster is disabled!<br>Unequip scroll of nature item and reset to Enable again.').insertAfter(lib.game.getMenuItem('Lootify', 'category'));
                lib.game.tooltip($error, 'Pasting is disabled when scroll of nature is active, you can still use the counters.<br> This is done to prevent skewing the statistics.');
            }
            if (!$('.lootify-error.error-wealth').length && app.isWealth) { // TODO: Create Error Message Function
                let $error = $('<div/>', {
                    'class': 'lootify-error error-wealth'
                }).css({
                    'color': 'red',
                    'width': '80%',
                    'margin': '0 auto',
                }).html('Paster is disabled!<br>Unequip scroll of wealth item and reset to Enable again.').insertAfter(lib.game.getMenuItem('Lootify', 'category'));
                lib.game.tooltip($error, 'Pasting is disabled when scroll of wealth is active, you can still use the counters.<br> This is done to prevent skewing the statistics.');
            }
            if (!$('.lootify-error.error-disabled').length && (app.enabled && app.enabled === 'false')) {  // TODO: Create Error Message Function
                $('<div/>', {
                    'class': 'lootify-error error-disabled'
                }).css({
                    'color': 'red',
                    'width': '80%',
                    'margin': '0 auto',
                }).html('Paster is globally disabled!').insertAfter(lib.game.getMenuItem('Lootify', 'category'));
            }
        }
        function renderStatus() {
            if (!lib.user.isFighting() && !lib.user.isActiveSkill() && !lib.user.isStatus('idling')) {
                $('.ltf-status').remove();
                return false;
            }
            if (!lib.game.getMenuItem('Status:')) {
                lib.game.setMenuItem({
                    'class': 'ltf-status',
                    'text': 'Status:',
                    'clone': 'General Shop',
                    'icon': '/images/combat/combat_level.png',
                    'after': lib.game.getMenuItem('Lootify', 'category'),
                    'click': function() {
                        $('[data-for="'+lib.user.getStatus()+'Header"]').click();
                    }
                });
            }
            let status = lib.user.getStatus();
            status += lib.user.isFighting() ? ' '+lib.user.currentMob : '';
            $('.ltf-status').find('span').text('Status: ' + lib.general.ucfirst(status));
        }
        function setupLogs() {
            if ($('.btn-loot-log').length) {
                $('.btn-loot-log').remove();
            }
            let $logBtn = lib.game.getMenuItem('Loot Log');
            if (($logBtn && $logBtn.text() === 'Loot Log') && !$logBtn.hasClass('btn-loot-log')) {
                lib.game.editMenuItem('Loot Log');
            }
            if(!lib.game.getMenuItem('Lootify Log')) {
                lib.game.setMenuItem({
                    'icon': '/images/ui/inventory_icon.png',
                    'text': 'Lootify Log',
                    'clone': 'General Shop',
                    'class': 'btn-loot-log',
                    'before': lib.game.getMenuItem('Gathering', 'category'),
                    'click': function() {
                        $('.item-log-clone').toggle();
                    },
                });
            }
            let $logwrap = $('.item-log-window');
            $logwrap.hide();
            let $clone = $logwrap.clone();
            $clone.addClass('item-log-clone').removeClass('hidden');
            $clone.find('.item-log-timer').remove();
            $clone.find('.item-log-info').remove();
            $clone.find('.drawer-setting-large').addClass('clone').unbind().click(function() {
                reset();
            }).text('Paste and Reset');
            if (app.disabled || lib.user.isStatus('fishing') || lib.user.isStatus('smithing') || lib.user.isStatus('cooking')) {
                $clone.find('.drawer-setting-large').text('Reset');
            }
            lib.game.getMenuItem('Lootify Log').after($clone);
        }
        function renderTimer() {
            if (!lib.user.isFighting() && !lib.user.isActiveSkill() && !lib.user.isStatus('idling')) {
                $('.time-stats').remove();
                return false;
            }
            if (!lib.game.getMenuItem('Elapsed:')) {
                let $timeStats = lib.game.setMenuItem({
                    'class': 'time-stats',
                    'text': 'Elapsed: 0S',
                    'clone': 'General Shop',
                    'icon': '/images/clock.png',
                    'after': $('.ltf-status')
                });
            }
            setTimeout(()=> {
                !lib['lootify'].timers ? lib['lootify'].timers = {} : 1;
                if(!lib['lootify'].timers[lib.user.getStatus()]) {
                    new lib.general.Timer(app.name, lib.user.getStatus());
                }
            }, 100);
        }
        function renderKPH() {
            if (!lib.user.isFighting()) {
                $('.kph-stats').remove();
                $('.kph-wrap').remove();
                return false;
            }
            if (!lib.game.getMenuItem('Kills:')) {
                let $kphStats = lib.game.setMenuItem({
                    'class': 'kph-stats',
                    'text': 'Kills: 0 p/h',
                    'clone': 'General Shop',
                    'icon': '/images/combat/combat_level.png',
                    'after': $('.time-stats'),
                    'click': function() {
                        $('.kph-wrap').toggle();
                    }
                });
                $kphStats.after($('<div/>', {
                    'class': 'kph-wrap ltf-submenu'
                }).hide());
            }
            let mobkills = {};
            $.each(total, function(mob, mobinfo) {
                if(!lib.game.isUniversalItem(mob)) {
                    mobkills[mob] = mobinfo.count;
                }
            });
            let totalkills = function() {
                let c = 0;
                $.each(mobkills, function(mob, kills) {
                    c += kills;
                });
                return c;
            };
            let kph = 0;
            let time = lib.general.getTimerTime('lootify', lib.user.getStatus());
            kph = lib.general.addCommas(Math.floor((totalkills()/time)*3600));
            $('.kph-stats').find('span').text('Kills: ' + kph + ' p/h');
            $.each(lib.general.sortObject(mobkills), function(mob, count) {
                let mobinfoclass = 'mob-info-'+sanitizeEntry(mob);
                kph = lib.general.addCommas(Math.floor((count/time)*3600));
                if(!$('.'+mobinfoclass).length) {
                    let $mobwrap = $('<div/>', {
                        'class': 'ltf-header mob-header '+mobinfoclass
                    });
                    $mobwrap.prepend($('<span>').css('display','block').text(mob + ': ' + kph + ' p/h'));
                    $mobwrap.prepend($('<img>').attr('src', lib.game.getMobIcon(mob)));
                    $('.kph-wrap').append($mobwrap);
                } else {
                    $('.'+mobinfoclass).find('span').text(mob + ': ' + kph + ' p/h');
                }
            });
        }
        function renderGPH() {
            if((!lib.user.isActiveSkill() && !lib.user.isFighting()) || lib.user.isIron() || lib.user.isStatus('cooking')) {
                $('.gph-stats').remove();
                $('.gph-wrap').remove();
                return false;
            }
            if (!lib.game.getMenuItem('Gold:')) {
                let $gphStats = lib.game.setMenuItem({
                    'class': 'gph-stats',
                    'text': 'Gold: 0 p/h',
                    'icon': '/images/ui/shop_icon.png',
                    'clone': 'General Shop',
                    'after': $('.time-stats'),
                    'click': function() {
                        $('.gph-wrap').toggle();
                    }
                });
                $gphStats.after($('<div/>', {
                    'class': 'gph-wrap ltf-submenu'
                }).hide());
            }

            let totalGold = 0;
            if (lib.game.marketPrices) {
                $.each(totalLoot, function(item, count) {
                    if (item === 'Gold') {
                        totalGold += count;
                    } else {
                        if (lib.user.isStatus('smithing')) {
                            let ore = item.split(' ')[0] + ' Ore';
                            totalGold += (lib.game.marketPrices[item] - lib.game.marketPrices[ore])* count;
                        } else {
                            totalGold += lib.game.marketPrices[item] * count;
                        }
                    }
                });
            } else {
                totalGold = 'n/a';
            }

            let time = lib.general.getTimerTime('lootify', lib.user.getStatus());
            if (time) {
                let gph = lib.general.addCommas(Math.floor((totalGold/time)*3600));
                $('.gph-stats').find('span').text('Gold: ' + gph + ' p/h');
            }
            $('.gph-wrap').empty();
            let $lootwrap = $('<div/>', {
                'class': 'ltf-header mob-header'
            }).appendTo($('.gph-wrap'));

            let lootval = lib.general.addCommas(Math.floor(totalGold));
            let $lootInfo = $('<span/>').css('display','block').text('Loot value: ' + lootval);
            $lootInfo.prepend($('<img>').attr('src', '/images/money_icon.png'));
            $lootwrap.append($lootInfo);
        }
        function renderXPH() {
            if(!lib.user.isActiveSkill() && !lib.user.isFighting()) {
                $('.mxph-stats').remove();
                $('.mxph-wrap').remove();
                $('.xph-stats').remove();
                $('.xph-wrap').remove();
                return false;
            }
            let currentLevel = {};
            let approxTime = {};
            let totalExp = {};
            let skillExp = {};
            let combatSkills = ['attack', 'defense', 'strength', 'constitution'];
            let expTypes = ['exp', 'mexp'];
            let time = lib.general.getTimerTime('lootify', lib.user.getStatus());
            !lib.user.levelGoal ? lib.user.levelGoal = {} : 1;
            $.each(expTypes, function(k, type) {
                if (lib.user[type]) {
                    !lib.user.levelGoal[type] ? lib.user.levelGoal[type] = {} : 1;
                    // CALCULATE EXP FOR COMBAT SKILLS
                    if (lib.user.isFighting()) {
                        $.each(combatSkills, function(k, skill) {
                            !skillExp[type] ? skillExp[type] = [] : 1;
                            !totalExp[type] ? totalExp[type] = 0 : 1;
                            !currentLevel[type] ? currentLevel[type] = [] : 1;
                            // GET THE CURRENT SKILL EXP GAINED
                            skillExp[type][skill] = lib.user[type][skill].current - lib.user[type][skill].init;
                            // GET TOTAL EXP GAINED OF ALL COMBAT SKILLS
                            totalExp[type] += (lib.user[type][skill].current - lib.user[type][skill].init);
                            currentLevel[type][skill] = lib.game.getLevel(lib.user[type][skill].current);
                            !lib.user.levelGoal[type][skill] ? lib.user.levelGoal[type][skill] = currentLevel[type][skill] + 1 : 1;
                            if(type === 'exp' && currentLevel[type] < 99) {
                                lib.user.levelGoal[type][skill] = (lib.user.levelGoal[type][skill] <= currentLevel[type]) ? lib.user.levelGoal[type][skill] = currentLevel[type] + 1 : lib.user.levelGoal[type][skill];
                            } else if (type ==='mexp' && currentLevel[type] >= 99) {
                                lib.user.levelGoal[type][skill] = (lib.user.levelGoal[type][skill] <= currentLevel[type]) ? lib.user.levelGoal[type][skill] = currentLevel[type] + 1 : lib.user.levelGoal[type][skill];
                            }
                        });
                    }
                    // CALCULATE EXP FOR GATHERING SKILLS
                    $.each(lib.app.data.active.skills, function(k, skill) {
                        if(lib.user.isStatus(skill)) {
                            totalExp[type] = lib.user[type][skill].current - lib.user[type][skill].init;
                            currentLevel[type] = lib.game.getLevel(lib.user[type][skill].current);
                            !lib.user.levelGoal[type][skill] ? lib.user.levelGoal[type][skill] = currentLevel[type] + 1 : 1;
                            if(type === 'exp' && currentLevel[type] < 99) {
                                lib.user.levelGoal[type][skill] = (lib.user.levelGoal[type][skill] <= currentLevel[type]) ? lib.user.levelGoal[type][skill] = currentLevel[type] + 1 : lib.user.levelGoal[type][skill];
                            } else if (type ==='mexp' && currentLevel[type] >= 99) {
                                lib.user.levelGoal[type][skill] = (lib.user.levelGoal[type][skill] <= currentLevel[type]) ? lib.user.levelGoal[type][skill] = currentLevel[type] + 1 : lib.user.levelGoal[type][skill];
                            }
                        }
                    });
                }
            });
            // EXP COUNTERS
            $.each(expTypes, function(k, type) {
                let menuItem = (type === 'exp') ? 'Experience:' : 'Mastery:';
                let menuClass = (type === 'exp') ? 'xph' : 'mxph';
                let menuIcon = (type === 'exp') ? '/images/total_level.png' : '/images/total_level_mastery_icon.png';

                if (!lib.game.getMenuItem(menuItem) && totalExp[type] > 1) {
                    let $xphStats = lib.game.setMenuItem({
                        'class': menuClass+'-stats',
                        'text': menuItem+' 0 p/h',
                        'icon': menuIcon,
                        'after': $('.time-stats'),
                        'clone': 'General Shop',
                        'click': function() {
                            $('.'+menuClass+'-wrap').toggle();
                        }
                    });
                    $xphStats.after($('<div/>', {
                        'class': menuClass+'-wrap ltf-submenu'
                    }).hide());
                }

                let xph = lib.general.addCommas(Math.floor((totalExp[type]/time)*3600));
                $('.'+menuClass+'-stats').find('span').text(menuItem + ' ' + xph + ' p/h');

                // XP Earned since activity start
                let xpearned = lib.general.addCommas(Math.floor(totalExp[type]));
                let $expwrap;
                if(!$('.'+menuClass+'-header').length) {
                    $expwrap = $('<div/>', {
                        'class': 'ltf-header mob-header ' + menuClass + '-header'
                    })
                    $expwrap.prepend($('<span>').css('display','block').text('Exp earned: ' + xpearned));
                    $expwrap.prepend($('<img>').attr('src', 'https://digimol.net/idlescape/assets/img/plus_sign.png'));
                    $expwrap.appendTo($('.'+menuClass+'-wrap'));
                } else {
                    $expwrap = $('.'+menuClass+'-wrap');
                    $('.'+menuClass+'-header > span').css('display','block').text('Exp earned: ' + xpearned);
                }

                // Time Left For Next Level
                let $expTimeWrap, $expTimeInfo;
                if (lib.user[type]) {
                    if(!lib.user.isFighting()) {
                        let skill = lib.user.getStatus();
                        let exptimeclass = 'exptime-'+type+'-'+skill;
                        approxTime = lib.user.getTimeToLevel(lib.user.levelGoal[type][skill], lib.user[type][skill].current, totalExp[type], time);
                        if(!$('.'+exptimeclass).length) {
                            $expTimeWrap = $('<div/>', {
                                'class': 'ltf-header mob-header'
                            })
                            $expTimeInfo = $('<div>', {
                                'class': exptimeclass
                            }).css('display','flex')
                            $expTimeInfo.append($('<img>').attr('src', lib.game.getSkillIcon(skill)));
                            $expTimeInfo.append($('<span>', {
                                'class': exptimeclass+'-level'
                            }).text('to '+lib.user.levelGoal[type][skill]));
                            let $arrows = $('<div>', {
                                'class': 'd4is-control-arrows'
                            }).appendTo($expTimeInfo);
                            $('<span>').text('▲').click(function() {
                                if(lib.user.levelGoal[type][skill] < 200) {
                                    lib.user.levelGoal[type][skill]++;
                                    $('.'+exptimeclass+'-level').text('to '+lib.user.levelGoal[type][skill]);
                                }
                            }).appendTo($arrows);
                            $('<span>').text('▼').click(function() {
                                if(lib.user.levelGoal[type][skill] > currentLevel[type]+1) {
                                    lib.user.levelGoal[type][skill]--;
                                    $('.'+exptimeclass+'-level').text('to '+lib.user.levelGoal[type][skill]);
                                }
                            }).appendTo($arrows);
                            $expTimeInfo.append($('<span>', {
                                'class': exptimeclass+'-text'
                            }).text(approxTime));
                            $expTimeWrap.append($expTimeInfo);
                            $expTimeWrap.appendTo($('.'+menuClass+'-wrap'));
                        } else {
                            $('.'+exptimeclass+'-text').text(approxTime);
                        }
                    } else {
                        $.each(combatSkills, function(k, skill) {
                            if(skillExp[type][skill] > 0) {
                                let exptimeclass = 'exptime-'+type+'-'+skill;
                                approxTime = lib.user.getTimeToLevel(lib.user.levelGoal[type][skill], lib.user[type][skill].current, skillExp[type][skill], time);
                                if(!$('.'+exptimeclass).length) {
                                    $expTimeWrap = $('<div/>', {
                                        'class': 'ltf-header mob-header'
                                    })
                                    $expTimeInfo = $('<div>', {
                                        'class': exptimeclass
                                    }).css('display','flex')
                                    $expTimeInfo.append($('<img>').attr('src', lib.game.getSkillIcon(skill)));
                                    $expTimeInfo.append($('<span>', {
                                        'class': exptimeclass+'-level'
                                    }).text('to '+lib.user.levelGoal[type][skill]));
                                    let $arrows = $('<div>', {
                                        'class': 'd4is-control-arrows'
                                    }).appendTo($expTimeInfo);
                                    $('<span>').text('▲').click(function() {
                                        if(lib.user.levelGoal[type][skill] < 200) {
                                            lib.user.levelGoal[type][skill]++;
                                            $('.'+exptimeclass+'-level').text('to '+lib.user.levelGoal[type][skill]);
                                        }
                                    }).appendTo($arrows);
                                    $('<span>').text('▼').click(function() {
                                        if(lib.user.levelGoal[type][skill] > currentLevel[type][skill]+1) {
                                            lib.user.levelGoal[type][skill]--;
                                            $('.'+exptimeclass+'-level').text('to '+lib.user.levelGoal[type][skill]);
                                        }
                                    }).appendTo($arrows);
                                    $expTimeInfo.append($('<span>', {
                                        'class': exptimeclass+'-text'
                                    }).text(approxTime));
                                    $expTimeWrap.append($expTimeInfo);
                                    $expTimeWrap.appendTo($('.'+menuClass+'-wrap'));
                                } else {
                                    $('.'+exptimeclass+'-text').text(approxTime);
                                }
                            }

                        });
                    }
                }
            });
        }
        function saveLogs() {
            if (!lib.user.isFighting()) { return false; }
            let $logcats = $('.item-log-window:not(.item-log-clone)').find('.item-log-cateogry');
            if ($logcats.length) {
                $logcats.each(function() {
                    if( $(this).find('.item-log-category-closed').length ) {
                        $(this).find('.item-log-category-closed').click();
                    }
                    let mobs = $(this).find('.item-log-category-open').text().split(" x ");
                    !runs[0][mobs[0]] ? runs[0][mobs[0]] = {} : 1;
                    runs[0][mobs[0]].count = parseInt(mobs[1]);
                    $(this).find('.item-log-item').each(function() {
                        if ($(this).text() !== "None") {
                            let loot = $(this).text().split(" x ");
                            !runs[0][mobs[0]].loot ? runs[0][mobs[0]].loot = {} : 1;
                            !runs[0][mobs[0]].loot[loot[0]] ? runs[0][mobs[0]].loot[loot[0]] = {} : 1;
                            runs[0][mobs[0]].loot[loot[0]].count = parseInt(loot[1]);
                        }
                    });
                });
            }
        }
        function mergeLogs() {
            if(runs) {
                total = {};
                totalLoot = {};
                $.each(runs, function(num, run) {
                    $.each(run, function(mobname, mobinfo) {
                        !total[mobname] ? total[mobname] = {} : 1;
                        !total[mobname].count ? total[mobname].count = 0 : 1;
                        total[mobname].count += mobinfo.count;
                        $.each(mobinfo.loot, function(lootname, lootinfo) {
                            /* SET TOTAL LOOT PER MOB */
                            !total[mobname].loot ? total[mobname].loot = {} : 1;
                            !total[mobname].loot[lootname] ? total[mobname].loot[lootname] = {} : 1;
                            !total[mobname].loot[lootname].count ? total[mobname].loot[lootname].count = 0 : 1;
                            !total[mobname].loot[lootname].procs ? total[mobname].loot[lootname].procs = 0 : 1;
                            total[mobname].loot[lootname].count += lootinfo.count;
                            total[mobname].loot[lootname].procs += lootinfo.procs;
                            /* SET TOTAL LOOT OVERALL */
                            if (!lib.game.isUniversalItem(mobname)) {
                                let procs = lootinfo.procs ? lootinfo.procs : 0;
                                !totalLoot[lootname] ? totalLoot[lootname] = 0 : 1;
                                totalLoot[lootname] += lootinfo.count + procs;
                            }
                        });
                    });
                });
                delete total[''];
            }
        }
        function renderLogs() {
            if(!runs) { return false; }
            let $logEntry, $logHeader, $lootWrap, $lootEntry;
            $('.item-log-clone').find('.item-log-cateogry').remove();
            $.each(lib.general.sortObject(total), function(mob, mobinfo) {
                let icon = !lib.user.isFighting() ? lib.game.getLocationIcon(lib.game.getLocationID(mob)) : lib.game.getMobIcon(mob);
                icon = lib.game.isUniversalItem(mob) ? getChestIcon(mob) : icon;
                if (lib.user.isStatus('smithing')) {
                    $.each(mobinfo.loot, function(loot, info) {
                        if(~loot.indexOf('Bar')) {
                            mob = loot;
                            icon = '/images/smithing/'+ sanitizeEntry(mob) +'.png';
                        }
                    });
                    if (lib.user.getEnchantment('7') > 0) {
                        mob = 'Wealthing';
                        icon = '/images/money_icon.png';
                    }
                }
                if (!$('.log-entry-' + sanitizeEntry(mob)).length) {
                    // Log Wrapper
                    $logEntry = $('<div/>', {
                        'class':'ltf-log-entry log-entry-' + sanitizeEntry(mob)
                    });
                    $logHeader = $('<div/>', {
                        'class':'ltf-log-header noselect'
                    }).appendTo($logEntry);

                    $lootWrap = $('<div/>', {
                        'class': 'ltf-loot-wrap'
                    }).appendTo($logEntry);

                    $logHeader.click(function() {
                        headers[mob] = headers[mob] == false ? true : false;
                        $lootWrap.toggle();
                    });
                    // HEADER
                    $logHeader.append($('<div/>').text(mob + ' x ' + mobinfo.count));
                    $logHeader.append($('<img/>').addClass('drawer-item-icon').attr('src', icon));
                    addLogEntry($logEntry, mob, mobinfo.loot);
                    $logEntry.sort(function (a, b) {
                        return $(a).find('.ltf-log-header').text() - $(b).find('.ltf-log-header').text();
                    }).each(function (_, container) {
                        $(container).parent().find('.drawer-setting-large.clone').before(container);
                    });
                    $('.drawer-setting-large.clone').before($logEntry);
                } else {
                    $logEntry = $('.log-entry-' + sanitizeEntry(mob));
                    $logHeader = $logEntry.find('.ltf-log-header');
                    $logHeader.find('div').text(mob + ' x ' + mobinfo.count);
                    addLogEntry($logEntry, mob, mobinfo.loot);
                }
            });
        }
        function sanitizeEntry(text) {
            text = text.toLowerCase();
            text = text.split("'").join("");
            text = text.split(" ").join("_");
            return text;
        }
        function getChestIcon(chest) {
            let icon = '';
            switch(chest) {
                case 'Geode':
                    icon = '/images/misc/geode.png';
                    break;
                case 'Sunken Treasure':
                    icon = '/images/misc/sunken_treasure.png';
                    break;
                case "Bird's Nest":
                    icon = '/images/misc/bird_nest.png';
                    break;
                case 'Satchel':
                    icon = '/images/misc/satchel.png';
                    break;
            }
            return icon;
        }
        function addLogEntry($log, entry, info) {
            if (!entry) { return false; }
            $.each(lib.general.sortObject(info), function(loot, lootinfo) {
                if (loot == '') { return false; }
                let lootEntryClass = 'loot-entry-'+sanitizeEntry(entry)+'-'+sanitizeEntry(loot);
                let $lootEntry = $('.'+lootEntryClass);
                let lootText = loot + ' x ' + lootinfo.count;
                lootText += (lootinfo.procs >= 1) ? ' (+'+lootinfo.procs+')' : '';
                if(!$lootEntry.length) {
                    $lootEntry = $('<div/>', {
                        'class': 'ltf-loot-entry '+lootEntryClass
                    }).text(lootText).appendTo($log.find('.ltf-loot-wrap'));
                    if(lib.game.isRareItem(loot)) {
                        $lootEntry.addClass('loot-rare');
                    } else if(lib.game.isEventItem(loot)) {
                        $lootEntry.addClass('loot-event');
                    } else if(lib.game.isUniversalItem(loot)) {
                        $lootEntry.addClass('loot-universal');
                    }
                } else {
                    $lootEntry.text(lootText);
                }
            });
        }

        /* ############## ACTIONS ############## */
        function getLogs() {
            let logs = [];
            let $logcats = $('.item-log-window:not(.item-log-clone)').find('.item-log-cateogry');
            if ($logcats.length) {
                $logcats.each(function(k,v) {
                    if( $(this).find('.item-log-category-closed').length ) {
                        $(this).find('.item-log-category-closed').click();
                    }
                    if( $(this).find('.item-log-category-open').length ) {
                        logs.push($(this).find('.item-log-category-open').text());
                        $(this).find('.item-log-item').each(function() {
                            if( $(this).text() !== "None" ) {
                                logs.push($(this).text());
                            }
                        });
                    }
                });
            }
            return logs;
        }
        function clearLogs(m = 'all') {
            if (m == 'single') {
                runs.unshift({});
            } else if (m == 'all') {
                if (lib.user.exp && lib.user.mexp) {
                    $.each(lib.app.data.active.skills, function(k, skill) {
                        lib.user.exp[skill].init = lib.user.exp[skill].current;
                        lib.user.mexp[skill].init = lib.user.mexp[skill].current;
                    });
                }
                if (Object.keys(lib['lootify'].timers).length !== 0) {
                    $.each(lib['lootify'].timers, function(k, t) {
                        t.reset();
                    });
                }
                runs = [{}];
                total = {};
                app.disabled = false;
                app.isNature = false;
                app.setup = false;
                $('.item-log-clone').remove();
            }
            $('.item-log-window').find('.drawer-setting-large.active:not(.clone)').click();
        }
        function reset(m = 'all') {
            submitStats(getLogs(), lib.user.getEnchantment('32'));
            clearLogs(m);
        }
        /* ############## GAME LIBRARY ############## */
        function is() {
            return lib.general.getStorage('Terms') === 'true';
        }
        function isLogged(type, txt) {
            let includes = false;
            if(getLogMobs()) {
                $.each(getLogMobs(), function(key, mob) {
                    if (type === 'combat') {
                        if (lib.game.getZoneMobs(txt).includes(mob)) {
                            includes = true;
                        }
                    } else if (type === 'skill') {
                        if (txt == mob) {
                            includes = true;
                        }
                    }
                });
            }
            return includes;
        }
        function isLogEmpty() {
            return Object.keys(runs[0]).length === 0;
        }
        function getLogMobs() {
            let mobs = [];
            $.each(total, function(mob, info) {
                mobs.push(mob);
            });
            return mobs;
        }
        function getPasteInterval() {
            let interval = parseInt($('.AutoPasterInterval').val());
            interval = interval ? interval : 30;
            interval = interval < 15 ? 15 : interval;
            interval = interval > 60 ? 60 : interval;
            return interval;
        }
        /* ############## API INTERACTION ############## */
        function setUserPublic(s) {
            lib.app.getRequest(app.name, 'https://digimol.net/idlescape/assets/api.php?a=userpublic&id='+lib.user.id+'&state='+s);
        }
        function canSubmit(logs) {
            let can = true;

            if (lib.user.getEnchantment('7') > 0) {
                can = false;
            }
            if (lib.user.getEnchantment('35') > 0 && lib.user.isStatus('foraging')) {
                can = false;
            }
            if ((lib.user.isFighting() && logs.length < 1) || Object.keys(runs[0]).length === 0 || app.disabled) {
                can =  false;
            }

            return can;
        }
        function submitStats(logs, th) {
            if (!canSubmit(logs)) {
                return false;
            }
            lib.user.updateStatus();
            let targetUrl = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSch3eG9Tqts0tIvnkk-C5JZeTwfbkWXhxkIpFnxyyaNO26h4Q/formResponse';
            let logEntryId = 'entry.558332813';
            let thEntryId = 'entry.22586929';
            let noteEntryId = 'entry.1726819066';
            let finalTH = (parseInt(th) > 0) ? 'TH '+th : 'None';
            let fullUrl = targetUrl + '?'+ noteEntryId + '=Lootify-' + app.ver + '&' + thEntryId + '=' + encodeURIComponent(finalTH) + '&' + logEntryId + '=' + encodeURIComponent(logs.join('\n'));
            if (!lib.user.isFighting()) {
                th = 0;
            } else {
                $.get(fullUrl);
            }
            lib.app.getRequest(app.name, 'https://digimol.net/idlescape/assets/api.php?a=paste&th='+th+'&user='+lib.user.id+'&log='+encodeURIComponent(JSON.stringify(runs[0])));
            lib.game.chat({
                'msg': 'Lootify - Loot log pasted!',
                'color': '#00a0fd',
            });
        }
        app.getRuns = function(n = 0) {
            return runs[n];
        }

        app.getKills = function() {
            if (!lib.user.id || lib.user.id == 0) { return false; }
            lib.app.getRequest(app.name, 'https://digimol.net/idlescape/assets/api.php?a=getkills&id='+lib.user.id, function(d) {
                lib.user.kills = d;
            });
        }

        /* ############## SOCKET RESPONSES ############## */
        app.initExp = function(d) {
            let e = setInterval(()=> {
                if (app.ready) {
                    clearInterval(e);
                    $.each(lib.app.data.active.skills, function(k, skill) {
                        !lib.user.exp ? lib.user.exp = {} : 1;
                        !lib.user.mexp ? lib.user.mexp = {} : 1;
                        !lib.user.exp[skill] ? lib.user.exp[skill] = {} : 1;
                        lib.user.exp[skill].init = parseInt(d.value.skills[skill].experience);
                        lib.user.exp[skill].current = parseInt(d.value.skills[skill].experience);
                        !lib.user.mexp[skill] ? lib.user.mexp[skill] = {} : 1;
                        lib.user.mexp[skill].init = parseInt(d.value.skills[skill].masteryExperience);
                        lib.user.mexp[skill].current = parseInt(d.value.skills[skill].masteryExperience);
                    });
                }
            }, 250);
        }

        app.updateExp = function(msg) {
            let d = JSON.parse(msg)[1];
            if (app.ready) {
                $.each(lib.app.data.active.skills, function(k, skill) {
                    !lib.user.exp ? lib.user.exp = {} : 1;
                    !lib.user.exp[skill] ? lib.user.exp[skill] = {} : 1;
                    !lib.user.mexp ? lib.user.mexp = {} : 1;
                    !lib.user.mexp[skill] ? lib.user.mexp[skill] = {} : 1;
                    if (~msg.indexOf('"'+skill+'"')) {
                        lib.user.exp[skill].current = parseInt(d.value.experience);
                        lib.user.mexp[skill].current = parseInt(d.value.masteryExperience);
                    }
                });
            }
        }

        /* USES
        * d.item.name
        * d.item.stackSize
        */
        app.addLogMob = function(d) {
            if (lib.user.lastAction === 'craft') {
                lib.user.lastAction = '';
                return false;
            }
            if (lib.game.isAllowedItem(lib.user.getStatus(), d.item.name)) {
                let loc = lib.game.getLocationName(lib.user.location);
                let item = lib.user.getStockpile(d.item.name);
                let diff = item ? d.item.stackSize - item.stackSize : d.item.stackSize;
                if (diff >= 3 && d.item.name !== 'Gold') { return false; }
                !runs[0] ? runs[0] = {} : 1;
                !runs[0][loc] ? runs[0][loc] = {} : 1;
                !runs[0][loc].count ? runs[0][loc].count = 0 : 1;
                runs[0][loc].count++;
                if(lib.user.isStatus('mining') && ~d.item.name.indexOf('Bar')) {
                    runs[0][loc].count--;
                }
                !runs[0][loc].loot ? runs[0][loc].loot = {} : 1;
                !runs[0][loc].loot[d.item.name] ? runs[0][loc].loot[d.item.name] = {} : 1;
                !runs[0][loc].loot[d.item.name].count ? runs[0][loc].loot[d.item.name].count = 0 : 1;
                !runs[0][loc].loot[d.item.name].procs ? runs[0][loc].loot[d.item.name].procs = 0 : 1;
                if(d.item.name == 'Gold' && lib.user.getEnchantment('7') > 0) {
                    runs[0][loc].loot[d.item.name].count += diff;
                } else {
                    runs[0][loc].loot[d.item.name].count++;
                    diff >= 2 ? runs[0][loc].loot[d.item.name].procs++ : 1;
                }
            }
        }

        app.addLogChest = function(d) {
            !runs[0] ? runs[0] = {} : 1;
            !runs[0][d.chest.name] ? runs[0][d.chest.name] = {} : 1;
            !runs[0][d.chest.name].count ? runs[0][d.chest.name].count = 0 : 1;
            runs[0][d.chest.name].count += d.chest.count;
            $.each(d.loot, function(loot, count) {
                !runs[0][d.chest.name].loot ? runs[0][d.chest.name].loot = {} : 1;
                !runs[0][d.chest.name].loot[loot] ? runs[0][d.chest.name].loot[loot] = {} : 1;
                !runs[0][d.chest.name].loot[loot].count ? runs[0][d.chest.name].loot[loot].count = 0 : 1;
                runs[0][d.chest.name].loot[loot].count += count;
            });
        }

        app.disablePaster = function() {
            if (!app.disabled) {
                app.disabled = true;
                $('.drawer-setting-large.clone').text('Reset Log');
                lib.game.chat({
                    'msg': "Lootify - Paster has been disabled to prevent skewed statistics. You can still use Lootify, but won't be able to paste your data to our server. Please reset your log to enable the paster again!",
                    'color': 'red',
                    'date': false
                });
            }
        }

        lib.app.setCommand('killcount', function() {
            let e = setInterval(()=> {
                if(lib.user.kills) {
                    clearInterval(e);
                    let msg = '';
                    let $html = $('<div>');
                    let $wrap = $('<div>',{
                        'class': 'ltf-killcount-wrap'
                    }).appendTo($html);
                    $.each(lib.user.kills, function(mob, count) {
                        let $killcount = $('<div>', {
                            'class': 'ltf-killcount'
                        }).appendTo($wrap);
                        let $icon = $('<img>', {
                            'class': 'dialog-icon ltf-killcount-icon'
                        }).attr({
                            'src': lib.game.getMobIcon(mob)
                        }).appendTo($killcount);
                        let $text = $('<span>', {
                            'class': 'dialog-text-medium lft-killcount-text'
                        }).html(mob+': '+count).appendTo($killcount);
                    });
                    $('<div>', {
                        'class': 'dialog-disclaimer'
                    }).text('These are statistics submitted to Lootify only (updates every 15 minutes)').appendTo($html);
                    msg += $html.html();

                    lib.game.dialog({
                        'title': lib.user.name+' Kill Count',
                        'text': msg,
                        'class': 'ltf-killcount',
                        'type': 'close',
                    });
                }
                setTimeout(()=> {
                    clearInterval(e);
                }, 3000);
            }, 250);
        });
    }

})();

function includeCSS(file) {
    var style  = document.createElement('link');
    style.rel  = 'stylesheet';
    style.href  = file;
    style.type = 'text/css';

    document.getElementsByTagName('head').item(0).appendChild(style);
}
includeCSS('https://digimol.net/idlescape/assets/css/game.css');
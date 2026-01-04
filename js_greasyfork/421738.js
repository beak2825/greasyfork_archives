// ==UserScript==
// @name         Bubble.am+
// @namespace    https://enderror.pl
// @version      21.07.11
// @description  Script that adds useful features to the game.
// @author       enderror
// @match        *://bubble.am/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421738/Bubbleam%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/421738/Bubbleam%2B.meta.js
// ==/UserScript==

class Plus {
    constructor() {
        this.name = 'plus';
        this.version = '21.07.11';
        this.author = 'enderror';
        this.additionalCoreChanges = [];

        this.defaultSettings = {
            controls: [
                { type: '1x', keycode: '32', disabled: false },
                { type: 'eject', keycode: '87', disabled: false },
                { type: 'setCamera', keycode: '81', disabled: false },
                { type: 'holdEject', keycode: '69', disabled: false },
                { type: '1x', keycode: '49', disabled: false },
                { type: '2x', keycode: '50', disabled: false },
                { type: '4x', keycode: '51', disabled: false },
                { type: '8x', keycode: '52', disabled: false },
                { type: '16x', keycode: '53', disabled: false },
                { type: 'holdSplit', keycode: '16', disabled: false },
                { type: 'movementUp', keycode: '81', disabled: false },
                { type: 'movementLeft', keycode: '65', disabled: false },
                { type: 'movementDown', keycode: '83', disabled: false },
                { type: 'movementRight', keycode: '68', disabled: false },
            ]
        };

        this.settings = {
            checkbox: {
                transparentVirus: true,
                noGrid: false,
                customColor: false,
                customSkin: false,
                bypassSkin: false,
                darkMenu: false,
                virusSplitCounter: true,
                cellsCounter: true,
                hideName: false,
                showMotherMass: false
            },

            values: {
                cellsColor: '#e31e24',
                skinUrl: null,
            },

            controls: this.defaultSettings.controls,
            chat: [],
            accounts: []
        }

        this.helpers = {
            skin: {
                skinInd: 1,
                gid: 0,
            },

            controls: {
                splitSwitch: false,
                holdSplitSwitch: false,
                splitInterval: undefined,
                ejectSwitch: false,
                ejectInterval: undefined,
                isActiveMovement: false,
                activeMovement: []
            }
        }

        this.run();
    }

    run() {
        console.log(`${this.name} ${this.version} created by ${this.author}`);

        if(location.pathname.includes('.txt') 
        || location.pathname.includes('.png')
        || location.pathname.includes('.jpg')
        || location.pathname.includes('.jpeg')) {
             return;
        }

        if((location.host === 'bubble.am' && location.pathname === '/') || location.pathname.length > 15) {
            window.stop();
            location.href = `${location.origin}/${this.name}${location.hash}`;
            return;
        }

        document.documentElement.innerHTML = '';

        const request = new XMLHttpRequest();
        const url = 'http://bubble.am';

        request.open('get', url, true);
        request.send();
        request.onload = async(e) => {
            const newCore = await this.modify(e.target.responseText);

            document.open();
            document.write(newCore);
            document.close();

            let documentCheck = setInterval(() => {
                if(document.readyState == 'complete') {
                    clearInterval(documentCheck);
                    
                    new UI();
                    this.addEventListeners();

                    window.modLoaded = true;
                }
            }, 100);
        }
    }

    async modify(core) {
        core = core.replace(/(.*)(Ubuntu\:700)(.*)(\n.*){4}/gm, `
            <link rel='stylesheet' type='text/css' href='http://fonts.googleapis.com/css?family=Ubuntu:700'>
            <link rel="stylesheet" type="text/css" href="http://m.bubble.am/css/bootstrap.min.css?v=3">
            <link rel="stylesheet" type="text/css" href="http://bubble.am/css/style.css?v=0.2.50" />
            <link rel="stylesheet" type="text/css" href="http://bubble.am/css/font.awesome.css?v5" />

            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-colorpicker/2.5.3/css/bootstrap-colorpicker.css"/>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/themes/nano.min.css"/>

            <script src="//m.bubble.am/js/jquery.js"></script>
        `);

        core = core.replace(/(.*)(bootstrap\.min\.js)(.*)(\n.*){3}/gm, `
            <script src="/js/bootstrap.min.js"></script>
            <script src="//m.bubble.am/js/jquery.lazy.js"></script>
            <script src="/js/jquery.ui.js"></script>
            <script>
            $("body").on('click', ".connect", function(event) {
                const srv = this.dataset['srv'];
                const id_split = srv.split('-');
                const gamemode = ':' + id_split[2];
                setGameModeTemporary(gamemode);
            });
            </script>
            <script src="/js/bub.js?v=0.2.50"></script>

            <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-colorpicker/2.5.3/js/bootstrap-colorpicker.min.js" async></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/smooth-scrollbar/8.6.2/smooth-scrollbar.min.js" async></script>
            <script src="https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/pickr.min.js" async></script>
            <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11" async></script>
        `);

        core = core.replace(/(d\.onkeydown\s=\sf)([^]*?b\s=\s\!1)([^]*?\}\;)/gm, `
            d.split = function() {
                ba();
                K(17);
            }

            d.eject = function() {
                ba();
                K(21);
            }

            d.setCamera = function() {
                K(18);
            }

            d.onkeydown = function(n) {
                switch (n.keyCode) {
                    case 27: // quit
                        oa(true);
                        break;

                    case 13:
                        if (isTyping) {
                            isTyping = false;
                            document.getElementById("chat_textbox").blur();
                            chattxt = document.getElementById("chat_textbox").value;
                            if (chattxt.length > 0) sendChat(chattxt);
                            //document.getElementById("chat_textbox").value = "";

                        } else {
                            if (!hasOverlay) {
                                document.getElementById("chat_textbox").focus();
                                isTyping = true;
                            }
                        }
                    break;

                    case 17:
                            if (!hasOverlay 
                                && !isTyping
                                && !window.plus.helpers.controls.splitSwitch 
                                && !window.plus.helpers.controls.holdSplitSwitch 
                                && !window.plus.helpers.controls.ejectSwitch) {
                                document.getElementById("chat_textbox").value = "/g ";
                                document.getElementById("chat_textbox").focus();
                                isTyping = true;
                            }
                    break;
                }
            };
        `);

        core = core.replace(/(\,\sI\:\s)(.*)/, `
            $&
            , counterCache: null
            , motherCache: null
        `);

        core = core.replace(/(f.+)(v\[d\]\.)(.*)/, `
            $&

            if(window.plus.settings.checkbox.cellsCounter && h.length !== 0) {
                f.restore();

                let maxCells = '';

                if(currentMode() == ':5') {
                    maxCells = '35';
                } else {
                    maxCells = '16';
                }

                const playerCells = h.length;
                const playerCellsText = new Ca(24, '#fff');
                playerCellsText.u(playerCells + '/' + maxCells);
                c = playerCellsText.F();
                a = c.width;
                
                f.globalAlpha = .2;
                f.fillStyle = "#000000";
                f.fillRect(10, 55, a + 10, 34);
                f.globalAlpha = 1;
                f.drawImage(c, 15, 60);
            }
        `);

        core = core.replace(/(bb\s\?)(.*)/, `
            if(bb) {
                a.fillStyle = "#FFFFFF";
                a.strokeStyle = "#AAAAAA";
                if(this.f && window.plus.settings.checkbox.transparentVirus === true) a.globalAlpha = 0.2;
            } else {
                a.fillStyle = this.color;
                a.strokeStyle = this.color;
                if(this.f && window.plus.settings.checkbox.transparentVirus === true) a.globalAlpha = 0.2;
            }
        `);

        core = core.replace(/(.*)(var\sa\s=\sl\s\/\sg)(.+)(\n.*\n.*)/gm, `
            if(window.plus.settings.checkbox.noGrid === false) {
                $&
            }
        `);

        core = core.replace(/(.*)(m\.color)(.*)/, `
            $&

            const amAlive = h.length > 0;

            const helpers = window.plus.helpers;
            const settings = window.plus.settings;
            
            if(amAlive && m.name === h[0].name && !m.f && settings.values.cellsColor !== undefined && settings.values.cellsColor !== null && settings.checkbox.customColor === true) {
                m.color = settings.values.cellsColor;
            }

            if(amAlive && (h[0].gid !== 1 && h[0].gid !== 2)) {
                helpers.skin.gid = h[0].gid;
            }

            if(settings.checkbox.customSkin === true && settings.values.skinUrl !== null && amAlive) {
                for(let i = 0; i < h.length; i++) {
                    const cell = h[i];

                    if(cell.gid !== helpers.skin.skinInd) {
                        cell.gid = helpers.skin.skinInd;

                        if(cell.name === '') cell.name = 'enderror';
                    }
                }
            }
            
            if(settings.checkbox.customSkin === false && amAlive && h[0].gid !== helpers.skin.gid) {
                for(let i = 0; i < h.length; i++) {
                    const cell = h[i];

                    cell.gid = helpers.skin.gid;
                }
            }

        `);

        core = core.replace(/(.*)(\(c\s\&\&\sFb.*)(\n.*){35}/gm, `
            const bypassSkin = (window.plus.settings.checkbox.customSkin && window.plus.settings.checkbox.bypassSkin)
            const customSkinGid = (this.gid == 1 || this.gid == 2);
            if (c && (Fb || bypassSkin) && !this.j && ':1' != V && ':3' != V && ':8' != V) {
                var loadBub = -1;

                if(Fb && this.gid && this.gid > 0) {
                    loadBub = this.gid;
                } else if(!Fb && this.gid && customSkinGid) {
                    loadBub = this.gid;
                } else if(Fb) {
                    if(-1 != Jb.indexOf(c)) {
                        loadBub = c;
                    }
                }
            
                if (loadBub != -1) {
                    if((Fb || bypassSkin && customSkinGid ) && (!$.hasOwnProperty(c) || $[c].skin != loadBub)) {
                        $[c] = new Image;

                        if(Fb && loadBub > 100000000) {
                            $[c].src = "//bubble.am/skins/custom/" + loadBub + '.png?0.2.50';
                        } else if(loadBub >= 10 && loadBub <= 20 && Fb) {
                            $[c].src = "//bubble.am/img/battle_" + loadBub + '.png?0.2.50';
                        } else if(customSkinGid && (Fb || bypassSkin)) {
                            $[c].src = window.plus.settings.values.skinUrl;
                        } else if(Fb) {
                            $[c].src = "//m.bubble.am/skins/" + loadBub + '.png?0.2.50';
                        }

                        $[c].skin = loadBub;
                    }
                    if((Fb || bypassSkin) && (0 != $[c].width && $[c].complete)) {
                        d = $[c];
                    } else {
                        d = null;
                    }
                } else {
                    d = null;
                }
            } else {
                d = null;
            }
        `);

        core = core.replace(/(\,\sd\s\=\sthis\.I\,)(.*)/, `
            $&

            const settings = window.plus.settings;
            const isNotSplittable = window.currentMode() == ':2'
                                    || window.currentMode() == ':5'
                                    || window.currentMode() == ':13';
            const isBattle = window.currentMode() == ':11' || window.currentMode() == ':12';
            const isTeams = window.currentMode() == ':3';

            let nc;
            if(settings.checkbox.virusSplitCounter && !isNotSplittable && this.f && this.color !== '#cd5564') {
                if(this.counterCache === null) {
                    this.counterCache = new Ca(this.i(), '#FFFFFF', !0, "#000000");
                }

                nc = this.counterCache;

                if(isTeams) {
                    switch(true) {
                        case this.size >= 123 && this.size <= 126:
                            nc.u('7');
                            break;
                        
                        case this.size >= 126 && this.size <= 129:
                            nc.u('6');
                            break;

                        case this.size >= 129 && this.size <= 134:
                            nc.u('5');
                            break;

                        case this.size >= 134 && this.size <= 137:
                            nc.u('4');
                            break;

                        case this.size >= 137 && this.size <= 141:
                            nc.u('3');
                            break;

                        case this.size >= 142 && this.size <= 145:
                            nc.u('2');
                            break;

                        case this.size >= 145 && this.size <= 151:
                            nc.u('1');
                            break;
                        }
                } else if(isBattle) {
                    switch(true) {
                        case this.size >= 84 && this.size <= 89:
                            nc.u('7');
                            break;
                        
                        case this.size >= 89 && this.size <= 94:
                            nc.u('6');
                            break;

                        case this.size >= 94 && this.size <= 99:
                            nc.u('5');
                            break;

                        case this.size >= 99 && this.size <= 104:
                            nc.u('4');
                            break;

                        case this.size >= 104 && this.size <= 109:
                            nc.u('3');
                            break;

                        case this.size >= 109 && this.size <= 115:
                            nc.u('2');
                            break;

                        case this.size >= 115 && this.size <= 120:
                            nc.u('1');
                            break;
                        }
                } else {
                    switch(true) {
                        case this.size >= 114 && this.size <= 119:
                            nc.u('7');
                            break;
                        
                        case this.size >= 119 && this.size <= 123:
                            nc.u('6');
                            break;

                        case this.size >= 123 && this.size <= 127:
                            nc.u('5');
                            break;

                        case this.size >= 127 && this.size <= 132:
                            nc.u('4');
                            break;

                        case this.size >= 132 && this.size <= 136:
                            nc.u('3');
                            break;

                        case this.size >= 136 && this.size <= 141:
                            nc.u('2');
                            break;

                        case this.size >= 141 && this.size <= 145:
                            nc.u('1');
                            break;
                        }
                }

                nc.G(this.i());
                nc.U(4);

                const rn = nc.F();
                a.drawImage(rn, ~~this.x - ~~(rn.width / 2), ~~this.y - ~~(rn.height / 2));
            }
        `);

        core = core.replace(/(.*)(\~\~\(l\s\/\s2\)\,\sf\,\sl\)\;)/, `
            const settings = window.plus.settings;

            if(settings.checkbox.hideName && h.length > 0 && this.name === h[0].name) {
                
            } else {
                $&
            }
        `);

        core = core.replace(/(.*)(chatNick\s\+)(.*)/, `
            const settings = window.plus.settings;

            const rawNick = chatNick.replace(/(<([^>]+)>)/ig, '').replace(/(\\[.*?\\])/, '').trim().toLowerCase();
            if(!settings.chat.includes(rawNick)) {
                $&
            }
        `);

        core = core.replace(/(.*)(isUnlimitedZoom)(.*)(\n.*){7}/gm, ``);


        core = core.replace(/(.*)(\&\&\sGb)(.*)(\n.*){3}/gm, `
            if(0 < this.id && Gb && (d || (0 == h.length || Qd) && (!this.f || this.j) && 80 < this.size)) {
                if(null == this.I) {
                    this.I = new Ca(this.i() / 2, "#FFFFFF", true, "#000000");
                }
                d = this.I;
                d.G(this.i() / 2);
                d.u(~~(this.size * this.size / 100));
                c = Math.ceil(10 * g) / 10;
                d.U(c);
                e = d.F();
                f = ~~(e.width / c);
                l = ~~(e.height / c);
                a.drawImage(e, ~~this.x - ~~(f / 2), b - ~~(l / 2), f, l);
            }

            if(0 < this.id && window.plus.settings.checkbox.showMotherMass && this.color === '#cd5564') {
                if(this.motherCache == null) {
                    this.motherCache = new Ca(this.i() / 2, "#FFFFFF", true, "#000000");
                }

                d = this.motherCache;
                d.G(this.i());
                d.u(~~(this.size * this.size / 100));
                c = Math.ceil(10 * g) / 10;
                d.U(c);
                e = d.F();
                f = ~~(e.width / c);
                l = ~~(e.height / c);
                a.drawImage(e, ~~this.x - ~~(f / 2), b - ~~(l / 2), f, l);
            }
        `);

        core = core.replace(/(J\.onmousedown)(.*)(\n.*){20}/gm, `
            const helpers = window.plus.helpers;
            J.onmousedown = function(a) {
                if (db) {
                    var b = a.clientX - (5 + l / 5 / 2)
                        , c = a.clientY - (5 + l / 5 / 2);
                    if (Math.sqrt(b * b + c * c) <= l / 5 / 2) {
                        ba();
                        K(17);
                        return
                    }
                }
                if(!helpers.controls.isActiveMovement) {
                    ma = a.clientX;
                    na = a.clientY;
                    Ha();
                    ba()
                }
            };
            J.onmousemove = function(a) {
                if(!helpers.controls.isActiveMovement) {
                    ma = a.clientX;
                    na = a.clientY;

                    lastacti = Date.now();
                }
            };

            d.goTo = function(x, y) {
                ma = x;
                na = y;
            }
        `);

        core = core.replace(/(.*)\.setAcid(.*)/gm, `
            d.setGameModeTemporary = function(a) {
                currMode = a.substr(0, 3);
                return currMode;
            }

            $&
        `);

        await sleep(300);

        const additionalChanges = this.additionalCoreChanges;
        if(additionalChanges.length !== 0) {
            for(let i = 0; i < additionalChanges.length; i++) {
                const additionalChange = additionalChanges[i];
                const hook = additionalChange.hook;
                const change = additionalChange.change;

                core = core.replace(hook, change);
            }
        }

        return core;
    }

    keydown = (e) => {
        this.controlTypeDown(e);
    }

    keyup = (e) => {
        this.controlTypeUp(e);
    }

    mousedown = (e) => {
        this.controlTypeDown(e);
    }

    mouseup = (e) => {
        this.controlTypeUp(e);
    }

    controlTypeDown(e) {
        const settings = window.plus.settings;
        const helpers = window.plus.helpers;

        const key = e.which;
        const controls = settings.controls;

        if(controls.length === 0) return;
        if(document.activeElement.nodeName == 'INPUT' && helpers.controls.splitSwitch === false && helpers.controls.ejectSwitch === false) return;

        for(let i = 0; i < controls.length; i++) {
            const control = controls[i];

            if(control.keycode == key && !control.disabled) {
                switch(control.type) {
                    case '1x':
                        if(!helpers.controls.splitSwitch) {
                            helpers.controls.splitSwitch = true;
                            window.split();
                        }
                        break;

                    case 'eject':
                        if(!helpers.controls.ejectSwitch) {;
                            helpers.controls.ejectSwitch = true;
                            window.eject();
                        }
                        break;

                    case 'setCamera':
                        window.setCamera();
                        break;
        
                    case '2x':
                        if(!helpers.controls.splitSwitch) {
                            helpers.controls.splitSwitch = true;
                            this.split(2);
                        }
                        break;
        
                    case '4x':
                        if(!helpers.controls.splitSwitch) {
                            helpers.controls.splitSwitch = true;
                            this.split(4);
                        }
                        break;
        
                    case '8x':
                        if(!helpers.controls.splitSwitch) {
                            helpers.controls.splitSwitch = true;
                            this.split(8);
                        }
                        break;
        
                    case '16x':
                        if(!helpers.controls.splitSwitch) {
                            helpers.controls.splitSwitch = true;
                            this.split(16);
                        }
                        break;
        
                    case 'holdSplit':
                        if(!helpers.controls.holdSplitSwitch) {
                            helpers.controls.holdSplitSwitch = true;

                            helpers.controls.splitInterval = setInterval(() => {
                                window.split();
                            }, 4);
                        }
                        break;
        
                    case 'holdEject':
                        if(helpers.controls.ejectSwitch) break;
         
                        helpers.controls.ejectSwitch = true;
                        helpers.controls.ejectInterval = setInterval(() => {
                            window.eject();
                        }, 4);
                        break;
        
                    case 'mouseLeft':
                        this.split(1);
                        break;
        
                    case 'mouseRight':
                        this.split(1);
                        break;
        
                    case 'mouseMiddle':
                        this.split(1);
                        break;
        
                    case 'movementUp':
                        this.goTo(3, -0);

                        if(!helpers.controls.isActiveMovement) helpers.controls.isActiveMovement = true;
                        helpers.controls.activeMovement['up'] = true;
                        break;
        
                    case 'movementRight':
                        this.goTo(0, 5);

                        if(!helpers.controls.isActiveMovement) helpers.controls.isActiveMovement = true;
                        helpers.controls.activeMovement['right'] = true;
                        break;
        
                    case 'movementDown':
                        this.goTo(2, 0.6);

                        if(!helpers.controls.isActiveMovement) helpers.controls.isActiveMovement = true;
                        helpers.controls.activeMovement['down'] = true;
                        break;
        
                    case 'movementLeft':
                        this.goTo(-0, 8);

                        if(!helpers.controls.isActiveMovement) helpers.controls.isActiveMovement = true;
                        helpers.controls.activeMovement['left'] = true;
                        break;

                    case 'hashLogin':
                        this.hashLogin();
                        break;

                    case 'hashShow':
                        this.hashShow();
                        break;
                }

                if(control.type.includes('movement')) {
                    const keys = helpers.controls.activeMovement;

                    switch(true) {
                        case keys['left'] && keys['up']:
                            this.goTo(-0, -0);
                            break;
                
                        case keys['left'] && keys["down"]:
                            this.goTo(-0, 0);
                            break;
                
                        case keys['up'] && keys['right']:
                            this.goTo(0, -0);
                            break;
                
                        case keys['down'] && keys['right']:
                            this.goTo(0, 0);
                            break;
                    }
                }
            }
        }
    }

    controlTypeUp(e) {
        const settings = window.plus.settings;
        const helpers = window.plus.helpers;

        const key = e.which;
        const controls = settings.controls;

        if(controls.length === 0) return;
        if(document.activeElement.nodeName == 'INPUT' && helpers.controls.splitSwitch === false && helpers.controls.ejectSwitch === false) return;

        for(let i = 0; i < controls.length; i++) {
            const control = controls[i];

            if(key == control.keycode && !control.disabled) {
                switch(control.type) {
                    case '1x':
                        helpers.controls.splitSwitch = false;
                        break;
        
                    case '2x':
                        helpers.controls.splitSwitch = false;
                        break;
        
                    case '4x':
                        helpers.controls.splitSwitch = false;
                        break;
        
                    case '8x':
                        helpers.controls.splitSwitch = false;
                        break;
        
                    case '16x':
                        helpers.controls.splitSwitch = false;
                        break;

                    case 'holdSplit':
                        clearInterval(helpers.controls.splitInterval);
                        helpers.controls.holdSplitSwitch = false;
                        break;

                    case 'eject':
                        helpers.controls.ejectSwitch = false;
                        break;
        
                    case 'holdEject':
                        clearInterval(window.plus.helpers.controls.ejectInterval);
                        helpers.controls.ejectSwitch = false;
                        break;

                    case 'movementUp':
                        if(helpers.controls.isActiveMovement) helpers.controls.isActiveMovement = false;
                        delete helpers.controls.activeMovement['up'];
                        break;
        
                    case 'movementRight':
                        if(helpers.controls.isActiveMovement) helpers.controls.isActiveMovement = false;
                        delete helpers.controls.activeMovement['right'];
                        break;
        
                    case 'movementDown':
                        if(helpers.controls.isActiveMovement) helpers.controls.isActiveMovement = false;
                        delete helpers.controls.activeMovement['down'];
                        break;
        
                    case 'movementLeft':
                        if(helpers.controls.isActiveMovement) helpers.controls.isActiveMovement = false;
                        delete helpers.controls.activeMovement['left'];
                        break;
                }
            }
        }
    }

    split(times) {
        for(let i = 0; i < times; i++) {
            setTimeout(function() {
                window.split();
            }, 50 * i);
        }
    }

    goTo(x, y) {
        x = window.innerWidth / x; y = window.innerHeight / y;
        window.goTo(x, y);
    }
    
    getCookie(name) {
        let v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return v ? v[2] : null;
    }

    setCookie(name, value, days) {
        const d = new Date;
        d.setTime(d.getTime() + 24*60*60*1000*days);
        document.cookie = name + '=' + value + ';path=/;expires=' + d.toGMTString();
    }
     
    deleteCookie(name) {
        this.setCookie(name, '', -1);
    }

    setHash(hash) {
        this.deleteCookie('user_hash');
        this.deleteCookie('PHPSESSID');
        this.setCookie('user_hash', hash, 30);

        window.location.reload();
    }

    async hashLogin() {
        const { value: hash } = await Swal.fire({
            title: 'Enter your hash',
            input: 'text',
            inputValue: '',
            showCancelButton: true,
            inputValidator: (value) => {
              if(!value) {
                return 'You need to write something!'
              }

              if(value.length !== 40) {
                  return 'The hash length must be 40 characters.'
              }
            }
          })
          
          if(hash) {
            this.setHash(hash);
          }
    }

    hashShow() {
        const hash = this.getCookie('user_hash');

        if(hash === null) {
            return Swal.fire({
                icon: 'error',
                text: 'You must be logged in to your account to view its hash.'
              });
        }

        Swal.fire({
            icon: 'info',
            html: `The hash assigned to this account is: <strong>${hash}</strong>.<br><br>Remember to never give it to anyone!`
          });
    }

    addEventListeners() {
        document.addEventListener('keydown', this.keydown);
        document.addEventListener('keyup', this.keyup);
        document.addEventListener('mousedown', this.mousedown);
        document.addEventListener('mouseup', this.mouseup); 

        document.getElementById('canvas').addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });
    }

    beforeLoad(callback) {
        if(window.modLoaded === false) {
            return callback();
        }

        throw new Error('Failed to load callback on beforeLoad method.');
    }

    onLoad(callback) {
        let checkLoadedIndex = 0;
        let checkLoaded = setInterval(() => {
            if(window.modLoaded === true) {
                clearInterval(checkLoaded);
                window.modLoaded = true;
                return callback();
            }

            if(checkLoadedIndex >= 100) {
                clearInterval(checkLoaded);
                throw new Error('Failed to load callback on onLoad method.');
            }

            checkLoadedIndex++
        }, 100);
    }
}

class UI {
    constructor() {
        this.loadCSS();
        this.loadGUI();
        this.loadSettings();
    }

    loadCSS() {
        const css = `
            #plusSettingsBtn {
                float: right;
                width: 12%;
            }

            #plusSettings .modal-body {
                height: 300px;
                user-select: none;
            }

            #plusSettings .modal-footer {
                user-select: none;
            }

            #plusContent {
                height: 100%;
            }

            #general-content {
                display: flex;
                flex-flow: column wrap;
                height: 160px;
            }

            #plusContent .tab-pane {
                height: 100%;
            }

            #plusTabs {
                text-align: center;
                border-bottom: none !important;
                margin-top: 1em;
            }

            #plusTabs > li {
                float: none !important;
                display: inline-block;
            }

            #plusTabs>li.active>a, #plusTabs>li.active>a:hover, #plusTabs>li.active>a:focus {
                border: none !important;
                background: #efefef;
                color: #27272A;
            }

            #plusTabs>li>a {
                border: none !important;
                border-radius: 4px;
                color: #5f5f67;
            }

            #pLabel {
                text-align: center;
            }

            .plus-checkbox {
                padding-bottom: 0.5em;
                width: 50%;
            }

            .plus-checkbox label {
                max-width: 100%;
                position: relative;
                display: inline-block;
                padding-left: 20px;
                margin-bottom: 0;
                font-weight: 400;
                vertical-align: middle;
                cursor: pointer;
            }

            .plus-checkbox input[type=radio], .plus-checkbox input[type=checkbox] {
                position: absolute;
                margin-left: -20px;
            }

            #skinPanel {
                float: left;
                margin-left: 5px;
            }

            .skinBtn {
                margin: 0;
                padding: 2px 8px;
            }

            .plusControls {
                display: block;
                height: 210px;
            }

            .plusBtn {
                display: flex;
                justify-content: space-between;
                margin-top: 8px;
            }

            .plusBtn button {
                width: 100px;
            }

            .plusHeader {
                display: flex;
                justify-content: center;
                width: 100%;
            }

            .plusContent {
                display: flex;
                flex-flow: column nowrap;
                height: 210px;
                padding: 0;
                margin: 0;
            }

            .plusContent li {
                display: flex;
                margin: 0 auto;
                padding: 0.75rem;
                width: 300px;
                height: 34px;
                align-items: center;
                justify-content: space-between;
                border-radius: 0.375rem;
                background: #FAFAFA;
                margin-top: 0.525rem;
            }

            .controlsContent {
                display: flex;
                flex-flow: column nowrap;
                height: 210px;
                padding: 0;
                margin: 0;
            }

            .controlsContent li {
                display: flex;
                justify-content: space-around;
                align-items: center;
                margin-top: 5px;
            }

            .emptyPanel {
                text-align: center;
                padding: 0.5em;
                margin: 0.5em;
            }

            .delete {
                cursor: pointer;
            }

            html, 
            body {
                height: 100%;
            }

            .main-panel {
                margin: 0 2px;
                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 10%), 0 2px 4px -1px rgb(0 0 0 / 6%);
            }

            .friends-online {
                border-radius: 10px;
                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 10%), 0 2px 4px -1px rgb(0 0 0 / 6%);
                border: none;
            }

            #playBtn {
                width: 74.8% !important;
            }
            
            #playBtn.has-spinner {
                width: 62.9% !important;
            }

            #playBtn.btn-danger {
                width: 75.5% !important;
            }

            #spectateBtn {
                height: 34px;
            }

            table.chat-table {
                margin-bottom: 34px !important;
            }

            .btn:focus, .btn:active:focus, .btn.active:focus, .btn.focus, .btn:active.focus, .btn.active.focus {
                outline: none;
            }

            .btn-primary {
                background-color: #3B82F6;
                border: none;
            }
         
            .btn-primary:hover {
                background-color: #2563EB;
            }

            .btn-primary:hover, .btn-primary:focus, .btn-primary.focus, .btn-primary:active, .btn-primary.active, .open>.dropdown-toggle.btn-primary {
                background-color: #2563EB;
            }
         
            .btn-success {
                background-color: #22C55E;
                border: none;
            }
         
            .btn-success:hover {
                background-color: #16A34A;
            }

            .btn-success:hover, .btn-success:focus, .btn-success.focus, .btn-success:active, .btn-success.active, .open>.dropdown-toggle.btn-success {
                background-color: #16A34A;
            }
         
            .btn-settings {
                float: none !important;
                display: inline-block !important;
                width: auto !important;
                height: auto !important;
                border: none;
                background-color: #06B6D4;
            }
         
            .btn-settings:hover {
                background-color: #0891B2;
                border: none;
            }

            .btn-info:hover, .btn-info:focus, .btn-info.focus, .btn-info:active, .btn-info.active, .open>.dropdown-toggle.btn-info {
                background-color: #0891B2;
            }
         
            .btn-warning {
                background-color: #EAB308;
                border: none;
            }
         
            .btn-warning:hover {
                background-color: #CA8A04;
            }

            .btn-warning:hover, .btn-warning:focus, .btn-warning.focus, .btn-warning:active, .btn-warning.active, .open>.dropdown-toggle.btn-warning {
                background-color: #CA8A04;
            }
         
            .btn-danger {
                background-color: #F43F5E;
                border: none;
            }
         
            .btn-danger:hover {
                background-color: #E11D48;
            }

            .btn-danger:hover, .btn-danger:focus, .btn-danger.focus, .btn-danger:active, .btn-danger.active, .open>.dropdown-toggle.btn-danger {
                background-color: #E11D48;
            }

            .form-control  {
                border: 1px solid #ced4da;
                box-shadow: none;
            }

            #radio_mode .gm-s {
                border: 2px solid #D1D5DB;
            }

            #chat_textbox {
                border-radius: 0.3em;
            }

            .exp-bar {
                border: 2px solid #3B82F6;
            }

            .exp-bar .progress-bar {
                background-color: #60A5FA;
            }

            .modal-content {
                border: none;
            }

            .swal2-popup {
                font-size: 1.5rem !important;
            }

            .swal2-styled.swal2-confirm {
                background-color: #3B82F6 !important;
            }

            .swal2-styled.swal2-confirm:focus {
                box-shadow: 0 0 0 3px rgb(59 130 246 / 50%) !important;
            }

            .pickr {
                float: left;
                margin-left: 5px;
            }

            .pickr .pcr-button {
                height: 1.8em;
                width: 1.8em;
            }

            .pickr .pcr-button:after, .pickr .pcr-button:before {
                border: 1px solid #80808060;
            }

            .hashLogin {
                margin: 0 5px;
            }

            li {
                list-style-type: none;
            }

            @media (min-width: 768px) {
                .modal-content {
                    -webkit-box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05);
                    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05);
                }
            }

            body.dark-mode .plusColor {
                background: #27272A;
            }

            body.dark-mode .plusColor .pcr-result {
                background: #36363a;
                color: #c6c6c8;
            }

            body.dark-mode .main-panel {
                background: #18181B;
                color: #c6c6c8;
            }

            body.dark-mode .form-control[disabled], body.dark-mode .form-control[readonly], body.dark-mode fieldset[disabled] .form-control {
                background: #27272A;
            }

            body.dark-mode .form-control {
                background: #27272A;
                border: none;
                color: #c6c6c8;
            }

            body.dark-mode #radio_mode .gm-s {
                border: 2px solid #5f5f60;
                background: #27272A;
            }

            body.dark-mode .bb-panel {
                background: #18181B;
            }

            body.dark-mode .progress {
                background: #27272A;
            }

            body.dark-mode .dropdown-menu>li>a {
                color: #c6c6c8;
            }

            body.dark-mode .dropdown-menu {
                background: #27272A;
            }

            body.dark-mode hr {
                border-top: 1px solid #5f5f60;
            }

            body.dark-mode .table-striped>tbody>tr:nth-child(odd) {
                background: #1f1f21 !important;
            }

            body.dark-mode .table-striped>tbody>tr:nth-child(even) {
                background-color: #18181B !important;
            }
         
            body.dark-mode .table>thead>tr>th {
                border-bottom: 2px solid #5f5f60;
            }

            body.dark-mode .table>thead>tr>th, body.dark-mode .table>tbody>tr>th, body.dark-mode .table>tfoot>tr>th, body.dark-mode .table>thead>tr>td, body.dark-mode .table>tbody>tr>td, body.dark-mode .table>tfoot>tr>td {
                border-top: none;
            }

            body.dark-mode .modal-content {
                background: #18181B;
                color: #c6c6c8;
            }

            body.dark-mode .modal-header {
                border-bottom: 1px solid #5f5f60;
            }

            body.dark-mode .bub-table-list {
                border: 1px solid #353636;
            }

            body.dark-mode .modal-footer {
                border-top: 1px solid #5f5f60;
            }

            body.dark-mode .dropdown-menu>li>a:hover, body.dark-mode .dropdown-menu>li>a:focus {
                background: #202023;
            }

            body.dark-mode .user-notif div.info {
                background: #1f1f21;
            }

            body.dark-mode .user-notif div {
                border-bottom: none;
            }

            body.dark-mode .user-notif div.warning {
                background: none;
                border-left: 1px solid #F59E0B;            
            }

            body.dark-mode .guild-members2 {
                border-bottom: 1px solid #5f5f60;
                border-top: 1px solid #5f5f60;
            }

            body.dark-mode .table>thead>tr>td.warning, body.dark-mode .table>tbody>tr>td.warning, body.dark-mode .table>tfoot>tr>td.warning, body.dark-mode .table>thead>tr>th.warning, body.dark-mode .table>tbody>tr>th.warning, body.dark-mode .table>tfoot>tr>th.warning, body.dark-mode .table>thead>tr.warning>td, body.dark-mode .table>tbody>tr.warning>td, body.dark-mode .table>tfoot>tr.warning>td, body.dark-mode .table>thead>tr.warning>th, body.dark-mode .table>tbody>tr.warning>th, body.dark-mode .table>tfoot>tr.warning>th {
                color: #FDE047;
                background: none;
            }

            body.dark-mode .nav-tabs {
                border-bottom: none;
            }

            body.dark-mode .nav-tabs>li.active>a, body.dark-mode .nav-tabs>li.active>a:hover, body.dark-mode .nav-tabs>li.active>a:focus {
                color: #c6c6c8;
                background: #2a2a2d;
                border: 1px solid transparent;
            }

            body.dark-mode .nav-tabs>li>a {
                border-radius: 4px;
            }

            body.dark-mode .nav-tabs>li>a:hover {
                border-color: transparent;
            }

            body.dark-mode .nav>li>a:hover, body.dark-mode .nav>li>a:focus {
                background: #212123;
            }

            body.dark-mode .guild-members {
                border-bottom: 1px solid #5f5f60;
            }

            body.dark-mode #tournament-modal .panel-heading {
                color: #c6c6c8 !important;
                border: none;
            }

            body.dark-mode .panel-default>.panel-heading {
                background: #18181B;
            }

            body.dark-mode .panel {
                background: #1f1f21;
            }

            body.dark-mode .panel-default {
                border-color: transparent;
            }

            body.dark-mode #connecting > div {
                background: #18181B !important;
                color: #c6c6c8;
            }

            body.dark-mode #statsChartText, body.dark-mode #statsText {
                color: #c6c6c8;
            }
         
            body.dark-mode #statsSubtext {
                color: #a5a5a5;
            }

            body.dark-mode input.chat {
                background: #18181B;
                border: none;
            }

            body.dark-mode input:focus-visible {
                outline: none;
                color: #c6c6c8;
            }

            body.dark-mode .swal2-popup {
                background: #18181B;
            }

            body.dark-mode .swal2-title {
                color: #c6c6c8;
            }

            body.dark-mode .swal2-html-container {
                color: #B4B4B5;
            }

            body.dark-mode .swal2-input-label {
                color: #B4B4B5;
            }

            body.dark-mode .swal2-validation-message {
                background: #27272A;
                color: #c6c6c8;
            }

            body.dark-mode .scrollbar-track {
                background: transparent;
            }

            body.dark-mode .scrollbar-track .show {
                opacity: 0;
            }

            body.dark-mode .chatUsers li {
                background: #27272A;
            }

            body.dark-mode .accounts li {
                background: #27272A;
            }

            body.dark-mode #plusTabs>li.active>a, body.dark-mode #plusTabs>li.active>a:hover, body.dark-mode #plusTabs>li.active>a:focus {
                border: none !important;
                background: #27272A;
                color: #c6c6c8;
            }

            body.dark-mode #plusTabs>li>a {
                border: none !important;
                border-radius: 4px;
                color: #a2a2ad;
            }

            body.dark-mode .text-muted {
                color: #a2a2a2;
            }

            body.dark-mode .close {
                color: #c6c6c8;
                text-shadow: none;
            }

            body.dark-mode .scrollbar-thumb {
                background: #6B7280;
            }

            body.dark-mode ::-webkit-scrollbar {
                width: 5px;
                height: 5px;
            }
         
            body.dark-mode ::-webkit-scrollbar-button {
                width: 0px;
                height: 0px;
            }
         
            body.dark-mode ::-webkit-scrollbar-thumb {
                background: #71717A;
                border: 0px none #ffffff;
                border-radius: 50px;
            }
         
            body.dark-mode ::-webkit-scrollbar-thumb:hover {
                background: #52525B;
            }
         
            body.dark-mode ::-webkit-scrollbar-thumb:active {
                background: #52525B;
            }
         
            body.dark-mode ::-webkit-scrollbar-track {
                background: transparent;
                border: 0px none #ffffff;
                border-radius: 50px;
            }
            
            body.dark-mode ::-webkit-scrollbar-track:hover {
                background: transparent;
            }
         
            body.dark-mode ::-webkit-scrollbar-track:active {
                background: transparent;
            }
         
            body.dark-mode ::-webkit-scrollbar-corner {
                background: transparent;
            }

        `;

        const style = document.createElement('style');
        style.textContent = css;
        document.head.append(style);
    }

    loadGUI() {
        $('#formStd h2').html('Bubble.am+').css({'display': 'inline-block', 'margin-right': '0.3em'});
        $('#formStd h2').after(`<p style="display: inline-block; vertical-align: middle;">${window.plus.version}</p>`)
        $('.btn-settings').after(`
            <button id="plusSettingsBtn" onclick="return false;" class="btn btn-danger" data-toggle="modal" data-target=".bs-example-modal-lg">
                <i class="fa fa-plus"></i>
            </button>
        `);
        $('#chat_textbox').attr('maxlength', '99');

        $('#overlays').before(`
        <div id="plusSettings" class="modal fade" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                        <h4 class="modal-title" id="pLabel">Bubble.am+ ${window.plus.version}</h4>
                        <ul id="plusTabs" class="nav nav-tabs" role="tablist">
                            <li role="presentation" class="active"><a href="#general" aria-controls="general" role="tab" data-toggle="tab">General</a></li>
                            <li role="presentation"><a href="#controls" aria-controls="controls" role="tab" data-toggle="tab">Controls</a></li>
                            <li role="presentation"><a href="#chat" aria-controls="chat" role="tab" data-toggle="tab">Chat</a></li>
                            <li role="presentation"><a href="#accounts" aria-controls="accounts" role="tab" data-toggle="tab">Accounts</a></li>
                        </ul>
                    </div>
                    <div class="modal-body">
                        <div id="plusContent" class="tab-content">
                            <div role="tabpanel" class="tab-pane active" id="general"></div>
                            <div role="tabpanel" class="tab-pane" id="controls"></div>
                            <div role="tabpanel" class="tab-pane" id="chat"></div>
                            <div role="tabpanel" class="tab-pane" id="accounts"></div>
                        </div>
                    </div>
                    <div class="modal-footer" style="text-align: center;">
                        <a href="http://enderror.pl" target="_blank">
                            <img id="enderror-logo" src="https://i.imgur.com/W7FkCgA.png" style="width: 3em;">
                        </a>
                    </div>
                </div>
            </div>
        </div>
        `);

        const plusSettingsBtn = document.querySelector('#plusSettingsBtn');
        plusSettingsBtn.addEventListener('click', function() {
            $('#plusSettings').modal('toggle');
        });

        this.modsGUI();
        this.controlsGUI();
        this.chatGUI();
        this.accountsGUI();

        $('#plusSettings').on('shown.bs.modal', () => {
            $(document).off('focusin.modal');
        });

        $('#plusSettings').on('hidden.bs.modal', () => {
            const settings = Store.getSettings();

            this.displayControls(settings.controls);
            this.displayUsers(settings.chat);
            this.displayAccounts(settings.accounts);
        });

        const pickr = new Pickr({
            el: '#colorMod',
            theme: 'nano',
            container: 'body',
            default: Store.getSettings().values.cellsColor,
            position: 'right-start',
            appClass: 'plusColor',

            swatches: null,
            components: {
                preview: true,
                opacity: true,
                hue: true,
        
                interaction: {
                    hex: false,
                    rgba: false,
                    hsla: false,
                    hsva: false,
                    cmyk: false,
                    input: true,
                    clear: false,
                    save: true
                }
            }
        });
     
        pickr.on('save', (color, instance) => {
            window.plus.settings.values.cellsColor = color.toRGBA().toString(3);
            Store.setSettings();
        });

        window.Scrollbars = Scrollbar.initAll();
    }

    modsGUI() {
        $('#general').append(`
            <div id="general-content">
                <div class="plus-checkbox">
                    <label>
                        <input id="plus_transparentVirus" type="checkbox" onchange="setTransparentVirus($(this).is(':checked'));"> Transparent virus
                    </label>
                </div>
                <div class="plus-checkbox">
                    <label>
                        <input id="plus_noGrid" type="checkbox" onchange="setNoGrid($(this).is(':checked'));"> No grid
                    </label>
                </div>
                <div class="plus-checkbox" style="display: flex; align-items: center;">
                    <label style="float: left;">
                        <input id="plus_customColor" type="checkbox" onchange="setCustomColor($(this).is(':checked'));"> Custom cells color
                    </label>
                    <div id="colorMod" style="float: left;"></div>
                </div>
                <div class="plus-checkbox" style="display: flex; align-items: center;">
                    <label style="float: left;">
                        <input id="plus_customSkin" type="checkbox" onchange="setCustomSkin($(this).is(':checked'));"> Custom skin
                    </label>
                    <div id="skinPanel">
                        <button id="setSkinBtn" class="btn btn-success skinBtn"><i class="fa fa-plus"></i></button>
                        <button id="showSkinBtn" class="btn btn-primary skinBtn"><i class="fa fa-eye"></i></button>
                    </div>
                </div>
                <div class="plus-checkbox">
                    <label>
                        <input id="plus_bypassSkin" type="checkbox" onchange="setBypassSkin($(this).is(':checked'));"> Bypass "No skins"
                    </label>
                </div>
                <div class="plus-checkbox">
                    <label>
                        <input id="plus_darkMenu" type="checkbox" onchange="setDarkMenu($(this).is(':checked'));"> Dark theme menu
                    </label>
                </div>
                <div class="plus-checkbox">
                    <label>
                        <input id="plus_virusSplitCounter" type="checkbox" onchange="setVirusSplitCounter($(this).is(':checked'));"> Virus split counter
                    </label>
                </div>
                <div class="plus-checkbox">
                    <label>
                        <input id="plus_cellsCounter" type="checkbox" onchange="setCellsCounter($(this).is(':checked'));"> Cells counter
                    </label>
                </div>
                <div class="plus-checkbox">
                    <label>
                        <input id="plus_hideName" type="checkbox" onchange="setHideName($(this).is(':checked'));"> Hide your name
                    </label>
                </div>
                <div class="plus-checkbox">
                    <label>
                        <input id="plus_showMotherMass" type="checkbox" onchange="setShowMotherMass($(this).is(':checked'));"> Show mother mass
                    </label>
                </div>
        </div>
        `);

        document.querySelector('#setSkinBtn').addEventListener('click', async () => {
            const { value: skinValue } = await Swal.fire({
                title: 'Enter skin url (png, jpg or jpeg)',
                input: 'text',
                showCancelButton: true,
                inputValidator: (value) => {
                  if(!value) {
                    return 'You need to write something.'
                  }

                  if(!this.isUriImage(value)) {
                      return 'Your skin url is wrong.'
                  }
                }
              });
              
              if(skinValue) {
                Swal.fire({
                    title: 'Skin has been successfully set.',
                    imageUrl: skinValue,
                    imageAlt: 'Skin',
                });

                const settings = window.plus.settings;
                const helpers = window.plus.helpers;
                  
                settings.values.skinUrl = skinValue;
                helpers.skin.skinInd == 1 ? helpers.skin.skinInd++ : helpers.skin.skinInd--;
                
                Store.setSettings();
              }
        });

        document.querySelector('#showSkinBtn').addEventListener('click', async function() {
            const settings = window.plus.settings;

            if(typeof(settings.values.skinUrl) === 'string') {
                Swal.fire({
                    title: 'Current skin',
                    imageUrl: settings.values.skinUrl,
                    imageAlt: 'Skin',
                });
            } else {
                Swal.fire({
                    title: 'Current skin',
                    text: 'No skin has been set yet.',
                });
            }
        });
    }

    controlsGUI() {
        $('#controls').append(`
            <div class="plusHeader" style="text-align: center; justify-content: space-around;">
                <strong style="width: 240px;">Type</strong>
                <strong style="width: 200px; padding-left: 10px;">Key</strong>
                <strong style="width: 60px;">Disabled</strong>
                <strong style="width: 40px;"></strong>
            </div>
            <div class="plusContent-wrapper" data-scrollbar>
                <ul class="controlsContent controls"></ul>
            </div>
            <div class="plusBtn">
                <button class="btn btn-warning controlsDefault">Load default</button>
                <button class="btn btn-danger controlsDelete">Delete all</button>
                <button class="btn btn-success controlsNew">Add new</button>
                <button class="btn btn-primary controlsSave">Save</button>
            </div>
        `);

        $('.controls').on('click', (e) => {
            if(!e.target.className.includes('delete')) return;

            const controlsLength = $('.controls li').length;
            const hasEmpty = $('.controls').find('.emptyPanel').length === 1;

            if(controlsLength === 1) {
                this.displayEmpty('.controls', 'controls');
            }

            if(controlsLength !== 1 && hasEmpty) {
                $('.controls .emptyPanel').remove();
            }

            e.target.parentElement.remove();
        });

        $('.controlsDefault').on('click', () => {
            const defaultSettings = window.plus.defaultSettings;

            $('.plusControls tbody').html('');

            this.displayControls(defaultSettings.controls);
        });

        $('.controlsDelete').on('click', () => {
            this.displayEmpty('.controls', 'controls');
        });

        $('.controlsNew').on('click', () => {
            this.addControl();
        });

        $('.controlsSave').on('click', () => {
            const newControls = [];
            const actualControls = document.querySelectorAll('.controls li');
            const settings = window.plus.settings;

            for(let i = 0; i < actualControls.length; i++) {
                const li = actualControls[i];
                const select = li.querySelectorAll('select');
                const checkbox = li.querySelector('input');

                const controlType = select[0].value;
                const controlKey = select[1].value;
                const controlDisabled = checkbox.checked;

                newControls.push({
                    type: controlType,
                    keycode: controlKey,
                    disabled: controlDisabled
                });
            }

            settings.controls = newControls;
            Store.setSettings();

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Your new controls configuration has been successfully saved.'
          });
        });
    }

    addControl() {
        const controlsTemplate = `
            <li>
                <select class="form-control" style="border-radius:4px; width: 15em;">
                    <option value="1x" selected="selected">Split</option>
                    <option value="eject">Eject</option>
                    <option value="setCamera">Lock/unlock camera [spectate]</option>
                    <option value="2x">2x split</option>
                    <option value="4x">4x split</option>
                    <option value="8x">8x split</option>
                    <option value="16x">16x split</option>
                    <option value="holdSplit">Hold split</option>
                    <option value="holdEject">Hold eject</option>
                    <option value="movementUp">Movement up</option>
                    <option value="movementRight">Movement right</option>
                    <option value="movementDown">Movement down</option>
                    <option value="movementLeft">Movement left</option>
                    <option value="hashLogin">Login by hash</option>
                    <option value="hashShow">Show hash</option>
                </select>
                <select class="form-control" style="border-radius:4px; width: 12em;">
                    <option value="1">Left Click</option>
                    <option value="2">Scroll Click</option>
                    <option value="3">Right Click</option>
                    <option value="9">Tab</option>
                    <option value="12">Clear</option>
                    <option value="13">Enter</option>
                    <option value="16">Shift</option>
                    <option value="17">Ctrl</option>
                    <option value="18">Alt</option>
                    <option value="27">Esc</option>
                    <option value="32" selected="selected">Space</option>
                    <option value="33">Page Up</option>
                    <option value="34">Page Down</option>
                    <option value="35">End</option>
                    <option value="36">Home</option>
                    <option value="37">Left Arrow</option>
                    <option value="38">Up Arrow</option>
                    <option value="39">Right Arrow</option>
                    <option value="40">Down Arrow</option>
                    <option value="45">Insert</option>
                    <option value="46">Delete</option>
                    <option value="48">0</option>
                    <option value="49">1</option>
                    <option value="50">2</option>
                    <option value="51">3</option>
                    <option value="52">4</option>
                    <option value="53">5</option>
                    <option value="54">6</option>
                    <option value="55">7</option>
                    <option value="56">8</option>
                    <option value="57">9</option>
                    <option value="65">A</option>
                    <option value="66">B</option>
                    <option value="67">C</option>
                    <option value="68">D</option>
                    <option value="69">E</option>
                    <option value="70">F</option>
                    <option value="71">G</option>
                    <option value="72">H</option>
                    <option value="73">I</option>
                    <option value="74">J</option>
                    <option value="75">K</option>
                    <option value="76">L</option>
                    <option value="77">M</option>
                    <option value="78">N</option>
                    <option value="79">O</option>
                    <option value="80">P</option>
                    <option value="81">Q</option>
                    <option value="82">R</option>
                    <option value="83">S</option>
                    <option value="84">T</option>
                    <option value="85">U</option>
                    <option value="86">V</option>
                    <option value="87">W</option>
                    <option value="88">X</option>
                    <option value="89">Y</option>
                    <option value="90">Z</option>
                    <option value="96">Numpad 0</option>
                    <option value="97">Numpad 1</option>
                    <option value="98">Numpad 2</option>
                    <option value="99">Numpad 3</option>
                    <option value="100">Numpad 4</option>
                    <option value="101">Numpad 5</option>
                    <option value="102">Numpad 6</option>
                    <option value="103">Numpad 7</option>
                    <option value="104">Numpad 8</option>
                    <option value="105">Numpad 9</option>
                    <option value="106">Numpad *</option>
                    <option value="107">Numpad +</option>
                    <option value="109">Numpad -</option>
                    <option value="110">Numpad .</option>
                    <option value="111">Numpad /</option>
                    <option value="112">F1</option>
                    <option value="113">F2</option>
                    <option value="114">F3</option>
                    <option value="115">F4</option>
                    <option value="116">F5</option>
                    <option value="117">F6</option>
                    <option value="118">F7</option>
                    <option value="119">F8</option>
                    <option value="120">F9</option>
                    <option value="121">F10</option>
                    <option value="122">F11</option>
                    <option value="123">F12</option>
                    <option value="124">F13</option>
                    <option value="125">F14</option>
                    <option value="126">F15</option>
                    <option value="127">F16</option>
                    <option value="128">F17</option>
                    <option value="129">F18</option>
                    <option value="130">F19</option>
                    <option value="131">F20</option>
                    <option value="132">F21</option>
                    <option value="133">F22</option>
                    <option value="134">F23</option>
                    <option value="135">F24</option>
                    <option value="186">;</option>
                    <option value="187">=</option>
                    <option value="188">,</option>
                    <option value="189">-</option>
                    <option value="190">.</option>
                    <option value="191">/</option>
                    <option value="192">&#96;</option>
                    <option value="219">[</option>
                    <option value="220">&#92;</option>
                    <option value="221">]</option>
                    <option value="222">'</option>
                </select>
                <input type="checkbox" style="margin: 0;">
                <i class="fa fa-remove delete"></i>
            </li>
        `;

        const hasEmpty = $('.controls').find('.emptyPanel').length === 1;
        if(hasEmpty) {
            $('.controls .emptyPanel').remove();
        }

        $('.controls').append(controlsTemplate);
        this.fixScrollbar(window.Scrollbars[0]);
    }

    displayControls(settings) {
        if(settings.length === 0) {
            return this.displayEmpty('.controls', 'controls');
        };

        $('.controls').html('');

        for(let i = 0; i < settings.length; i++) {
            const setting = settings[i];
            
            this.addControl();

            const li = document.querySelectorAll('.controls li')[i];
            const select = li.querySelectorAll('select');
            const checkbox = li.querySelector('input');

            select[0].value = setting.type;
            select[1].value = setting.keycode;
            checkbox.checked = setting.disabled;
        }
    }

    chatGUI() {
        $('#chat').append(`
            <div class="plusHeader">
                <strong>Blocked users</strong>
            </div>
            <div class="plusContent-wrapper" data-scrollbar>
                <ul class="plusContent chatUsers"></ul>
            </div>
            <div class="plusBtn">
                <button class="btn btn-danger chatDelete">Delete all</button>
                <button class="btn btn-success chatNew">Add new</button>
                <button class="btn btn-primary chatSave">Save</button>
            </div>
        `);

        $('.chatUsers').on('click', (e) => {
            if(!e.target.className.includes('delete')) return;

            const chatLength = $('.chatUsers li').length;
            const hasEmpty = $('.chatUsers').find('.emptyPanel').length === 1;

            if(chatLength === 1) {
                this.displayEmpty('.chatUsers', 'users');
            }

            if(chatLength !== 1 && hasEmpty) {
                $('.chatUsers .emptyPanel').remove();
            }

            e.target.parentElement.remove();
        });

        $('.chatDelete').on('click', () => {
            this.displayEmpty('.chatUsers', 'users');
        });

        $('.chatNew').on('click', async () => {
            let { value: playerNick } = await Swal.fire({
                title: 'Player nickname',
                text: 'You don\'t need to specify a clan tag.',
                input: 'text',
                inputValue: '',
                showCancelButton: true,
                inputValidator: (value) => {
                  if(!value) {
                    return 'You need to write something!'
                  }
    
                  if(value.length > 15) {
                      return 'Player nickname cannot be longer than 15 characters.'
                  }
    
                  const currentUsers = this.getCurrentUsers();
                  if(currentUsers.includes(value.toLowerCase())) {
                    return 'This user is already on the list.';
                  }
                }
              });
              
            if(playerNick) {
                this.addUser(playerNick);
            }
        });

        $('.chatSave').on('click', () => {
            const newChat = [];
            const actualChat = document.querySelectorAll('.chatUsers li');
            const settings = window.plus.settings;

            for(let i = 0; i < actualChat.length; i++) {
                const li = actualChat[i];
                const playerNick = li.querySelectorAll('span')[0].innerHTML;

                newChat.push(playerNick.toLowerCase());
            }

            settings.chat = newChat;
            Store.setSettings();

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Your new chat configuration has been successfully saved.'
          });
        });
    }

    addUser(name) {
        const hasEmpty = $('.chatUsers').find('.emptyPanel').length === 1;
        if(hasEmpty) {
            $('.chatUsers .emptyPanel').remove();
        }

        $('.chatUsers').append(`
            <li>
                <span>${name.toLowerCase()}</span>
                <i class="fa fa-remove delete"></i>
            </li>
        `);

        this.fixScrollbar(window.Scrollbars[1]);
    }

    getCurrentUsers() {
        const currentUsers = document.querySelectorAll('.chatUsers li');
        const nicks = [];

        for(let i = 0; i < currentUsers.length; i++) {
            const user = currentUsers[i];
            const nick = user.querySelectorAll('span')[0].innerHTML.toLowerCase();

            nicks.push(nick);
        }

        return nicks;
    }

    displayUsers(users) {
        if(users.length === 0) {
            return this.displayEmpty('.chatUsers', 'users');
        }

        $('.chatUsers').html('');

        for(let i = 0; i < users.length; i++) {
            const playerNick = users[i];

            this.addUser(playerNick);
        }
    }

    accountsGUI() {
        $('#accounts').append(`
            <div class="plusHeader">
                <strong>Your accounts</strong>
            </div>
            <div class="plusContent-wrapper" data-scrollbar>
                <ul class="plusContent accounts"></ul>
            </div>
            <div class="plusBtn">
                <button class="btn btn-danger accountsDelete">Delete all</button>
                <button class="btn btn-success accountsNew">Add new</button>
                <button class="btn btn-primary accountsSave">Save</button>
            </div>
        `);

        $('.accounts').on('click', (e) => {
            if(!e.target.className.includes('delete')) return;

            const accountsLength = $('.accounts li').length;
            const hasEmpty = $('.accounts').find('.emptyPanel').length === 1;

            if(accountsLength === 1) {
                this.displayEmpty('.accounts', 'accounts');
            }

            if(accountsLength !== 1 && hasEmpty) {
                $('.accounts .emptyPanel').remove();
            }

            e.target.parentElement.remove();
        });

        $('.accountsDelete').on('click', () => {
            this.displayEmpty('.accounts', 'accounts');
        });

        $('.accountsNew').on('click', async () => {
            const {value: account} = await Swal.fire({
                title: 'Add account',
                html: `
                  <input id="name" class="swal2-input" placeholder="Name" maxlength="15">
                  <input id="hash" class="swal2-input" placeholder="Hash" maxlength="40">
                `,
                focusConfirm: false,
                preConfirm: () => {
                    const name = document.getElementById('name').value.trim();
                    const hash = document.getElementById('hash').value.trim();
    
                    const currentAccounts = this.getCurrentAccounts();
                    const currentNames = currentAccounts.names;
                    const currentHashes = currentAccounts.hashes;
    
                    if(name.length === 0 || hash.length === 0) {
                        return Swal.showValidationMessage('You must complete all fields.');
                    }
    
                    if(hash.length !== 40) {
                        return Swal.showValidationMessage('The hash length must be 40 characters.');
                    }
    
                    if(currentNames.includes(name.toLowerCase()) || currentHashes.includes(hash)) {
                        return Swal.showValidationMessage('The name or hash is already on the list.');
                    }
    
                    return {
                        name,
                        hash
                    }
                }
              });
    
            if(account) {
                this.addAccount(account.name, account.hash);
            }
        });

        $('.accountsSave').on('click', () => {
            const newAccounts = [];
            const actualAccounts = document.querySelectorAll('.accounts li');
            const settings = window.plus.settings;

            for(let i = 0; i < actualAccounts.length; i++) {
                const li = actualAccounts[i];
                const accountName = li.querySelectorAll('span')[0].innerHTML;
                const accountHash = li.dataset.hash;

                newAccounts.push({
                    name: accountName,
                    hash: accountHash
                });
            }

            settings.accounts = newAccounts;
            Store.setSettings();

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Your new accounts configuration has been successfully saved.'
          });
        });
    }

    addAccount(name, hash) {
        const hasEmpty = $('.accounts').find('.emptyPanel').length === 1;
        if(hasEmpty) {
            $('.accounts .emptyPanel').remove();
        }

        $('.accounts').append(`
            <li data-hash="${hash}">
                <span>${name}</span>
                <div>
                    <span class="hashLogin" style="cursor: pointer;" onclick="window.plus.setHash($(this).parent().parent().data('hash'));">
                        <i class="fa fa-arrow-right"></i>
                    </span>
                    <span class="delete" style="cursor: pointer;" onclick="$(this).parent().parent().remove();">
                        <i class="fa fa-remove"></i>
                    </span>
                </div>
            </li>
        `);

        this.fixScrollbar(window.Scrollbars[2]);
    }

    displayAccounts(accounts) {
        if(accounts.length === 0) {
            return this.displayEmpty('.accounts', 'accounts');
        }

        $('.accounts').html('');

        for(const account in accounts) {
            const { name, hash } = accounts[account];
            
            this.addAccount(name, hash);
        }
    }

    getCurrentAccounts() {
        const currentAccounts = document.querySelectorAll('.accounts li');

        const accounts = [];
        const names = [];
        const hashes = [];

        for(let i = 0; i < currentAccounts.length; i++) {
            const account = currentAccounts[i];
            const name = account.querySelectorAll('span')[0].innerHTML.toLowerCase();
            const hash = account.dataset.hash;

            accounts.push({
                name,
                hash
            });

            names.push(name);
            hashes.push(hash);
        }

        return {
            accounts,
            names,
            hashes
        }
    }

    loadSettings() {
        const settings = Store.getSettings();

        window.plus.settings = settings;

        for(const checkbox in settings.checkbox) {
            const name = checkbox;
            const value = settings.checkbox[checkbox];

            $(`#plus_${name}`).prop('checked', value).change();
        }

        this.displayControls(settings.controls);
        this.displayUsers(settings.chat);
        this.displayAccounts(settings.accounts);
    }

    displayEmpty(element, text) {
        $(element).html(`<div class="emptyPanel">There are currently no ${text} in this panel.</div>`);
    }

    fixScrollbar(scrollbar) {
        scrollbar.update();

        const limitY = scrollbar.limit.y;
        scrollbar.setPosition(0, limitY);
    }

    isUriImage = function(uri) {
        uri = uri.split('?')[0];
        const parts = uri.split('.');
        const extension = parts[parts.length - 1];
        const imageTypes = ['png', 'jpg', 'jpeg'];
        if(imageTypes.indexOf(extension) !== -1) {
            return true;   
        }
    }
}

class Store {
    static getSettings() {
        let settings;
        if(localStorage.getItem('plus_settings') === null) {
            this.setSettings();
        }

        settings = JSON.parse(localStorage.getItem('plus_settings'));

        return settings;
    }

    static setSettings() {
        localStorage.setItem('plus_settings', JSON.stringify(window.plus.settings));
    }
}

window.modLoaded = false;

window.sleep = function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.setCustomColor = function(a) {
    window.plus.settings.checkbox.customColor = a;
    Store.setSettings();
}
 
window.setTransparentVirus = function(a) {
    window.plus.settings.checkbox.transparentVirus = a;
    Store.setSettings();
}

window.setCustomSkin = function(a) {
    window.plus.settings.checkbox.customSkin = a;
    Store.setSettings();
}

window.setBypassSkin = function(a) {
    window.plus.settings.checkbox.bypassSkin = a;
    Store.setSettings();
}
 
window.setNoGrid = function(a) {
    window.plus.settings.checkbox.noGrid = a;
    Store.setSettings();
}
 
window.setDarkMenu = function(a) {
    window.plus.settings.checkbox.darkMenu = a;
    if(a === true) {
        $('body').addClass('dark-mode');
        $('#enderror-logo').attr('src', 'https://i.imgur.com/ewMCLSe.png'); 
    } else {
        $('body').removeClass('dark-mode')
        $('#enderror-logo').attr('src', 'https://i.imgur.com/W7FkCgA.png'); 
    }

    Store.setSettings();
}

window.setVirusSplitCounter = function(a) {
    window.plus.settings.checkbox.virusSplitCounter = a;
    Store.setSettings();
}

window.setCellsCounter = function(a) {
    window.plus.settings.checkbox.cellsCounter = a;
    Store.setSettings();
}

window.setHideName = function(a) {
    window.plus.settings.checkbox.hideName = a;
    Store.setSettings();
}

window.setShowMotherMass = function(a) {
    window.plus.settings.checkbox.showMotherMass = a;
    Store.setSettings();
}

window.plus = new Plus();
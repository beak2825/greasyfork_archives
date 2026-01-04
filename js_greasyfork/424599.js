// ==UserScript==
// @name         HWM BattleMorale
// @namespace    https://greasyfork.org/ru/scripts/424599-hwm-battlemorale
// @version      0.4
// @description  try to take over the world!
// @connect daily.heroeswm.ru
// @author       achepta
// @include     /^https{0,1}:\/\/((www|qrator)(\.heroeswm\.ru|\.lordswm\.com)|178\.248\.235\.15)\/war\.php.+/
// @grant       unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM_log
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/424599/HWM%20BattleMorale.user.js
// @updateURL https://update.greasyfork.org/scripts/424599/HWM%20BattleMorale.meta.js
// ==/UserScript==

(function (window, undefined) {
    let w;
    if (typeof unsafeWindow !== undefined) {
        w = unsafeWindow;
    } else {
        w = window;
    }
    if (w.self !== w.top) {
        return;
    }
    let textFieldObjCounter = 0;
    let creaturesActions = {}
    let creaturesTexts = {}
    let startId;

    var moraleImageObj = new Image();
    moraleImageObj.src = 'https://dcdn.heroeswm.ru/i/icons/attr_morale.png?v=1'
    moraleImageObj.crossOrigin = "anonymous";
    var luckImageObj = new Image();
    luckImageObj.src = 'https://dcdn.heroeswm.ru/i/icons/attr_fortune.png?v=1'
    luckImageObj.crossOrigin = "anonymous";


    startId = setInterval(main, 200)


    function main() {
        if (!(!!process_luck || !!create_text)) {
            return
        } else {
            window.clearInterval(startId)
        }
        setInterval(checkTextsUpdate, 500)
        stage[war_scr].process_luck = function (current) {
            var lucky = command.substring(4, command.indexOf('^'));
            playsound(current, lucky, 70);
            if (lucky === 'badmorale') {
                if (stage[war_scr].obj[current].invisibility !== 1){
                    addActionToCurrent(current, "БД")
                }
                switch (lang) {
                    case 0:
                        htmllog += '' + stage[war_scr].html('name', current) + ' ожидают в страхе.' + stage[war_scr].html('end');
                        break;
                    case 1:
                        htmllog += '' + stage[war_scr].html('name', current) + ' freeze in fear.' + stage[war_scr].html('end');
                        break;
                }
                showtext();
                showdefwait(current, 'unmorale');
            }
            if (lucky === 'morale') {
                if (stage[war_scr].obj[current].invisibility !== 1){
                    addActionToCurrent(current, "БД")
                }
                switch (lang) {
                    case 0:
                        htmllog += '' + stage[war_scr].html('name', current) + ' рвутся в бой!' + stage[war_scr].html('end');
                        break;
                    case 1:
                        htmllog += '' + stage[war_scr].html('name', current) + ' are bursting for more action!' + stage[war_scr].html('end');
                        break;
                }
                showtext();
                showdefwait(current, 'morale');
            }
            if (lucky === 'luck') {
                if (stage[war_scr].obj[current].invisibility !== 1){
                    addActionToCurrent(current, "ЛАК")
                }
                switch (lang) {
                    case 0:
                        htmllog += '' + stage[war_scr].html('name', current) + ' посетила удача!' + stage[war_scr].html('end');
                        break;
                    case 1:
                        htmllog += 'Luck befalls ' + stage[war_scr].html('name', current) + '!' + stage[war_scr].html('end');
                        break;
                }
                showtext();
                showdefwait(current, 'luck');
            }
            if (lucky === 'unluck') {
                if (stage[war_scr].obj[current].invisibility !== 1){
                    addActionToCurrent(current, "ЛАК")
                }
                switch (lang) {
                    case 0:
                        htmllog += '' + stage[war_scr].html('name', current) + ' посетила неудача.' + stage[war_scr].html('end');
                        break;
                    case 1:
                        htmllog += 'Bad luck befalls ' + stage[war_scr].html('name', current) + '.' + stage[war_scr].html('end');
                        break;
                }
                showtext();
                showdefwait(current, 'unluck');
            }
            if (lucky === 'critical') {
                switch (lang) {
                    case 0:
                        htmllog += '' + stage[war_scr].html('name', current) + ' - критический удар по заклятому врагу.' + stage[war_scr].html('end');
                        break;
                    case 1:
                        htmllog += '' + stage[war_scr].html('name', current) + ' deal critical damage to favoured enemy.' + stage[war_scr].html('end');
                        break;
                }
                showtext();
                showdefwait(current, 'crit');
            }
            if (lucky === 'drunk') {
                switch (lang) {
                    case 0:
                        htmllog += '' + stage[war_scr].html('name', current) + ' - самоуправство.' + stage[war_scr].html('end');
                        break;
                    case 1:
                        htmllog += '' + stage[war_scr].html('name', current) + ' - independence.' + stage[war_scr].html('end');
                        break;
                }
                showtext();
                showdefwait(current, 'rage', 0);
            }
            command = command.substr(command.indexOf('^') + 1);
        };
        create_text = function (wh, i, x, y, txt, index) {
            if (!wh['txt' + i]) {

                if (txt === "ЛАК") {
                    wh['txt' + i] = My_Image({
                        image: luckImageObj,
                        width: kletka_height / 2,
                        height: kletka_height / 2
                    }, 1);
                } else {
                    wh['txt' + i] = My_Image({
                        image: moraleImageObj,
                        width: kletka_height / 2,
                        height: kletka_height / 2
                    }, 1);
                }

                wh['rect' + i] = Make_Drawing();
                Make_addChild(wh, wh['txt' + i], 1);
            }
            set_X(wh['txt' + i], x + (kletka_height / 2) * index, 1);
            set_Y(wh['txt' + i], y, 1);
            textFieldObjCounter++;
        };
        stage[war_scr].calcComs = function (magicdam, was_v) {
            var b = 0, i = 0, j = 0, x = 0, y = 0, k = 0, ok = false, time = 0, ii = false;
            var cmd = '';
            if ((Date.now() < waittimer) && (!finished)) return 0;
            //if ((command!='')&&(zoomed)) zoomout();

            //if (learning._visible) return 0;
            if (!initialized) return 0;
            if (someactive) {
                ok = false;
                for (i = 1; i <= magicscount; i++) {
                    if ((((magics[i].doing != '') && (magics[i].doing != undefined)) || ((magics[i].cmd != '') && (magics[i].cmd != undefined))) && (magics[i] != undefined)) {
                        ok = true;
                        break;
                    }
                    ;
                }
                ;

                var len = this.obj_array.length;
                for (var k1 = 0; k1 < len; k1++) {
                    i = this.obj_array[k1];
                    if ((this.obj[i].active) || ((this.obj[i].doing != "") && (this.obj[i].doing != undefined)) || (this.obj[i].donow2 == 1)) {
                        if (this.obj[i].donow2 == 1) {
                            this.obj[i].donow2c++;
                            if ((this.obj[i].donow2 == 1) && (this.obj[i].donow2c > 30)) {
                                this.obj[i].x = Math.round(this.obj[i].destxx);
                                this.obj[i].y = Math.round(this.obj[i].destyy);
                                this.obj[i].donow2 = 0;
                                this.obj[i].donow2c = 0;
                                this.obj[i].set_pole_pos(this.obj[i].x, this.obj[i].y);
                            }
                            ;
                        }
                        ;

                        if (this.obj[i].bomb) continue;

                        ok = true;

                        break;
                    }
                }
                someactive = ok;
            }
//	if ((scr.teleport.doing=='magic')&&(someactive==false)) return 0;
            if (command == '') return 0;
            k = tointeger(command.substr(1, 3));
            current = k;
            cmd = command.substr(0, 1);
            if (cmd == 'n') {
                tnvscore = tointeger(command.substr(1, 10));
                tnvwave = tointeger(command.substr(11, 3));
                command = command.substr(14);
                this.showmitnv();
                this.calcComs(magicdam);
            }
            ;
            j = tointeger(command.substr(4, 3));
            if ((cmd == ' ') || (cmd == '<')) {
                command = '';
            }
            if ((cmd == 'P') && (!someactive) && (!somedamaged)) {
                i = tointeger(command.substr(1, 3));
                len = tointeger(command.substr(4, 3));
                completed = false;
                initialized = false;
                var lcommand = command.substr(7, len) + ';';
                command = command.substr(len + 7);
                stage[war_scr].procceed_data(lcommand, 1, true);
                this.calcComs();
            }

            if (loading) return 0;

            if (cmd == 'b') {
                if ((this.obj[current].damaged > 0) && (this.obj[this.obj[current].damaged].forcearrow)) {
                    switch (lang) {
                        case 0:
                            htmllog += '' + this.html('name', this.obj[current].damaged) + ' - отбрасывающий выстрел по ' + this.html('name', current) + '.' + this.html('end');
                            break;
                        case 1:
                            htmllog += '' + this.html('name', this.obj[current].damaged) + ' perform knockback at ' + this.html('name', current) + '.' + this.html('end');
                            break;
                    }
                    ;
                } else if ((this.obj[current].damaged > 0) && (this.obj[this.obj[current].damaged].pawstrike)) {
                    this.obj[this.obj[current].damaged].at = 1;
                    switch (lang) {
                        case 0:
                            htmllog += '' + this.html('name', this.obj[current].damaged) + ' - отбрасывающий удар лапой по ' + this.html('name', current) + '.' + this.html('end');
                            break;
                        case 1:
                            htmllog += '' + this.html('name', this.obj[current].damaged) + ' perform knockback at ' + this.html('name', current) + '.' + this.html('end');
                            break;
                    }
                    ;
                } else if ((this.obj[current].damaged > 0) && (this.obj[this.obj[current].damaged].harpoonstrike)) {
                    switch (lang) {
                        case 0:
                            htmllog += '' + this.html('name', this.obj[current].damaged) + ' притягивают к себе ' + this.html('name', current) + '.' + this.html('end');
                            break;
                        case 1:
                            htmllog += '' + this.html('name', this.obj[current].damaged) + ' pull ' + this.html('name', current) + ' towards themselves.' + this.html('end');
                            break;
                    }
                    ;

                } else if ((this.obj[current].damaged > 0) && (this.obj[this.obj[current].damaged].powerstrike)) {
                    switch (lang) {
                        case 0:
                            htmllog += '' + this.html('name', this.obj[current].damaged) + ' - отбрасывающий удар по ' + this.html('name', current) + '.' + this.html('end');
                            break;
                        case 1:
                            htmllog += '' + this.html('name', this.obj[current].damaged) + ' perform knockback at ' + this.html('name', current) + '.' + this.html('end');
                            break;
                    }
                    ;
                }
                ;
                showtext();
                k = command.substr(4, 2) - 1;
                this.obj[current].destx = k + 1;
                k = command.substr(6, 2) - 1;
                this.obj[current].desty = k + 1;
                command = command.substr(8);
                ii = false;
                if (command.substr(0, 1) == 'I') {
                    k = tointeger(command.substr(1, 3));
                    current = k;
                    j = tointeger(command.substr(4, 4));
                    this.obj[current].nowinit = this.obj[j].nowinit + 100;
                    command = command.substr(8);
                    ii = true;
                }
                ;
                if ((this.obj[current].x == this.obj[current].destx) && (this.obj[current].y == this.obj[current].desty)) {
                } else {
                    someactive = true;
                    this.obj[current].destxx = this.obj[current].destx;
                    this.obj[current].destyy = this.obj[current].desty;
                    this.obj[current].otbroshen = true;
                    this.obj[current].donow2 = 1;
                    this.obj[current].donow2c = 0;
                    this.obj[current].active = true;
                }
                this.calcComs(magicdam, was_v);
                if (ii == true) {
                    this.calcinitiative(-1);
                    this.showmap(true);
                    this.showatb();
                }
                ;
                this.calcComs(magicdam, was_v);
            }
            ;
            if (cmd == 'B') {
                this.obj[current].otbroshen = true;
                this.obj[current].destxx = tointeger(command.substr(4, 2));
                this.obj[current].destyy = tointeger(command.substr(6, 2));
                command = command.substr(8);
                this.obj[current].active = true;
                this.obj[current].change_position = true;
                this.obj[current].change_position_wait = true;
                this.calcComs(magicdam, was_v);
            }
            ;

            if ((command != '') && (cmd == 'd') && (someactive) && (current == lastattacker) && (!was_v)) {
                somedamaged = true;
//		if ((!this.obj[j])&&(btype == 131)) { command = command.substr(17);return 0;}; //заглушка
//		if (this.obj[j].nownumber<=0) { command = command.substr(17);return 0;}; //заглушка
                if ((this.obj[j].damage < 0) || (this.obj[j].damage == undefined)) this.obj[j].damage = 0;
                this.obj[j].damage += tointeger(command.substr(7, 10));
                if (magicdam == undefined) {
                    this.obj[j].magicdamage = '';
                } else {
                    this.obj[j].magicdamage = magicdam;
                }
                ;
                this.obj[j].damaged = current;

                if (this.obj[current].chainc > 0) {
                    this.obj[current].chain[this.obj[current].chainc] = j;
                    this.obj[current].chainc++;
                }
                ;
                command = command.substr(17);
                this.calcComs(magicdam);
            }

            if ((command != '') && (cmd == 'l') && (someactive) && (current == lastattacker)) {
                lucky = command.substring(4, command.indexOf('^'));
                if (lucky == 'critical') {
                    playsound(current, 'critical', 70);
//				showluck(current, lucky);
                    showdefwait(current, 'crit');
                    switch (lang) {
                        case 0:
                            htmllog += '' + this.html('name', current) + ' - критический удар по заклятому врагу.' + this.html('end');
                            break;
                        case 1:
                            htmllog += '' + this.html('name', current) + ' deal critical damage to favoured enemy.' + this.html('end');
                            break;
                    }
                    ;
                    showtext();
                    command = command.substr(command.indexOf('^') + 1);
                    this.calcComs();
                }
            }
            ;
            if (cmd == 'H') {

                command = this.showqhint(command);
//		this.calcComs();
                return 0;
            }
            if ((cmd == 'i') && (was_v)) return 0;
            if ((cmd == 'S') && ((command.substr(1, 4) == 'dsp-') || (command.substr(1, 4) == 'ds2-') || (((lastmagic == 'rag') || (lastmagic == 'ral') || (lastmagic == 'raa') || (lastmagic == 'ra2')) && ((command.substr(1, 3) == prelastmagic) && (prelastmagic != 'rgl'))) || (command.substr(1, 3) == 'sld') || (command.substr(1, 3) == 'aci') || (command.substr(1, 3) == 'prt') || (command.substr(1, 3) == 'scd') ||
                (command.substr(1, 3) == 'rnm') || (command.substr(1, 3) == 'spc') || (command.substr(1, 3) == 'wnd') || (command.substr(1, 3) == 'bsh') || (command.substr(1, 3) == 'net') || (command.substr(1, 3) == 'rn4') || (command.substr(1, 3) == 'enr') || (command.substr(1, 3) == 'aim') || (command.substr(1, 3) == 'mfc') || (command.substr(1, 3) == 'zat') || (command.substr(1, 3) == 'prp') || (command.substr(1, 3) == 'eye') || (command.substr(1, 3) == 'raa') || (command.substr(1, 3) == 'fbd') ||
                (command.substr(1, 3) == 'wfr') || (command.substr(1, 3) == 'rag') || (command.substr(1, 3) == 'ral') || (command.substr(1, 3) == 'ra2') || (command.substr(1, 3) == 'mga') || (command.substr(1, 3) == 'enc') || (command.substr(1, 3) == 'rg2') ||
                (command.substr(1, 3) == 'mof') || (command.substr(1, 3) == 'blt') || (command.substr(1, 3) == 'ent') || (command.substr(1, 3) == 'nmc') || (command.substr(1, 3) == 'hfr') ||
                (command.substr(1, 3) == 'tob') || (command.substr(1, 3) == 'cha') || (command.substr(1, 3) == 'frz') || (command.substr(1, 3) == 'wfr') || (command.substr(1, 3) == 'blb') ||
                (command.substr(1, 3) == 'msl') || (command.substr(1, 3) == 'slm') || (command.substr(1, 3) == 'hsa') || (command.substr(1, 3) == 'mlg') || (command.substr(1, 3) == 'mvd') ||
                (command.substr(1, 3) == 'spi') || (command.substr(1, 3) == 'mnl') || (command.substr(1, 3) == 'eod') || (command.substr(1, 3) == 'fod') || (command.substr(1, 3) == 'fo2') ||
                (command.substr(1, 3) == 'wss') || (command.substr(1, 3) == 'dtd') || (command.substr(1, 3) == 'inv') || (command.substr(1, 3) == 'irr') || (command.substr(1, 3) == 'btr') ||
                (command.substr(1, 3) == 'flw') || (command.substr(1, 3) == 'brf') || (command.substr(1, 3) == 'chm') || (command.substr(1, 3) == 'ard') || (command.substr(1, 3) == 'rn9') ||
                (command.substr(1, 3) == 'def') || (command.substr(1, 3) == 'dat') ||
                ((lastmagic != 'rgl') && ((lastmagic == command.substr(1, 3) || ((lastmagic.substr(0, 2) == 'ds') && (command.substr(1, 2) == 'ds')))) &&
                    ((lastcaster == command.substr(4, 3)) && (command.substr(1, 3) != 'pss') && (command.substr(1, 3) != 'paa')))
            )) {
                if ((command.substr(1, 3) == 'sld') && (this.obj[tointeger(command.substr(7, 3))].active)) {
                    return 0;
                }
                ;
                if ((command.substr(1, 3) == 'aci') && (this.obj[tointeger(command.substr(7, 3))].active)) {
                    return 0;
                }
                ;
                if ((command.substr(1, 3) == 'inv') && (this.obj[tointeger(command.substr(4, 3))]) && (this.obj[tointeger(command.substr(4, 3))].active)) {
                    return 0;
                }
                ;
                if (command.substr(1, 3) == 'flw') {
                    var obj_id = tointeger(command.substr(4, 3));
                    var stage_wave = tointeger(command.substr(11, 1));
                    if (!this.obj[obj_id].flamewave_attack) {
                        return 0;
                    }
                    ;
                    if (stage_wave > 1) {

                        if ((flame_stages[stage_wave - 1].frame < 3) && (flame_stages[stage_wave - 1].doing != '')) {
                            spellactive = false;
                            return 0;
                        }
                    }
                    ;
                    if (stage_wave == 0) {
                        if (this.obj[obj_id].flamewave_attack) {
                            this.obj[obj_id].attacker = true;
                        }
                        flamewave_active = false;
                        this.obj[obj_id].flamewave_attack = false;
                    }
                    ;
                }
                ;


                if ((lastmagic == 'rag') || (lastmagic == 'ral') || (lastmagic == 'raa') || (lastmagic == 'ra2')) {
                } else prelastmagic = lastmagic;
                if ((lastmagic == 'ra2') && (command.substr(1, 3) == 'ra2') && (lastcaster == command.substr(4, 3)) && (this.obj[tointeger(lastcaster)].damaged)) return 0;

                if (command.substr(1, 3) == 'rag') {
                    var zo = tointeger(command.substr(1 + 3, 3));
                    if ((this.obj[zo].damaged > 0) && (this.obj[this.obj[zo].damaged].doing != '')) return 0;
                }
                ;
                lastmagic = command.substr(1, 3);
                lastcaster = command.substr(4, 3);
                tmp = command.substr(1, 18);
                if (tmp.substr(0, 3) == 'rg2') {
                    tmp = 'rgl' + tmp.substr(3);
                }
                ;
                command = command.substr(19);
                mcounter++;
                if (mcounter > maxmcount) mcounter = 1;
                var zo = tointeger(tmp.substr(3, 3));
                if ((lastmagic == 'ral') && (this.obj[zo].damaged) && (1 == 0)) {
                    this.obj[zo].later_ral = tmp;
                } else {
                    this.usemagic(tmp, mcounter);
                }
                ;
                if ((lastmagic != 'sld') && (lastmagic != 'aci') && (lastmagic != 'scd') && (lastmagic != 'fw3') && (lastmagic != 'lzb')) {
                    this.calcComs(magicdam, was_v);
                }
                ;
                return 0;
            } else {
                lastcaster = '';
            }
            ;


            if ((cmd == 'm') && (!loading) && (initialized)) {
                var current = tointeger(command.substr(1, 3));
                if ((this.obj[current].runaway) && (this.obj[current].damaged > 0) && (this.obj[current].damage == 0)) {
                    var k = tointeger(command.substr(4, 2));
                    this.obj[current].otbroshen = false;
                    this.obj[current].destx = k;
                    this.obj[current].destxx = k;
                    k = tointeger(command.substr(6, 2));
                    this.obj[current].desty = k;
                    this.obj[current].destyy = k;
                    command = command.substr(8);
                    ndestc = 0;
                    someactive = true;
                    if (this.obj[current].doing == "") {
                        this.obj[current].active = true;
                        this.obj[current].doing = "walk";
                        if ((this.obj[current].filename == 'pumani') && (this.obj[current].flyer)) {
                            this.obj[current].doing = "walk2";
                        }
                        ;
                        someactive = true;
                    } else {
                        this.obj[current].donow = 'm';
                    }
                    ;

                    this.obj[current].active = true;
                    this.calcComs(magicdam);
                    return 0;
                }
                ;
            }
            ;


            if ((cmd == 'r') && (!loading) && (initialized)) {
                if ((this.obj[current].divingassault) || (this.obj[current].rushdave)) {
                    var len = this.obj_array.length;
                    for (var k1 = 0; k1 < len; k1++) {
                        var z = this.obj_array[k1];
                        if ((this.obj[z].damaged) && (this.obj[z].damaged == current)) {
                            this.obj[current].attacker = true;
                        }
                    }
                    ;
                }
                lastattacker = -1;
                k = command.substr(4, 2) - 1;
                this.obj[current].destx = k + 1;
                k = command.substr(6, 2) - 1;
                this.obj[current].desty = k + 1;
                this.obj[current].prihod = true;


                command = command.substr(8);
                if ((this.obj[current].nownumber == 0) && (this.obj[current].maxnumber > 0) && ((this.obj[current].x < 0) || (this.obj[current].x > defxn - 2) || (this.obj[current].y < 0) || (this.obj[current].y > defyn))) {
                    this.obj[current].x = this.obj[current].destx;
                    this.obj[current].y = this.obj[current].desty;
                    return 0;
                }
                if ((this.obj[current].nownumber == 0) && (this.obj[current].maxnumber > 0)) {
                    this.obj[current].nownumber = this.obj[current].maxnumber;
                    this.obj[current].nowhealth = this.obj[current].maxhealth;
                    this.obj[current].donow = "";
                    this.obj[current].doing = "rise";
                    this.obj[current].active = true;
                    set_visible(this.obj[current].number, 1);

                    someactive = true;

                }
                ;
                if ((this.obj[current].x == this.obj[current].destx) && (this.obj[current].y == this.obj[current].desty)) {
                } else {
                    ndestc = -1;
                    switch (lang) {
                        case 0:
                            s = this.html('name', current) + ' приходит на помощь.';
                            break;
                        case 1:
                            s = this.html('name', current) + ' come to your aid.';
                            break;
                    }
                    ;
                    if (btypeold == _CAMPAIGN_WAR) {

                    } else {
                        if (this.obj[current].x < 0) {
                            this.obj[current].x = -4;
//						scr.arena.door1.gotoAndPlay(2);
                            this.obj[current].door = 1;
                        }
                        ;
                        if (this.obj[current].x > defxn - 2) {
                            this.obj[current].x = defxn + 3;
//						scr.arena.door3.gotoAndPlay(2);
                            this.obj[current].door = 3;
                        }
                        ;
                        if (this.obj[current].y < 0) {
                            this.obj[current].y = -4;
//						scr.arena.door2.gotoAndPlay(2);
                            this.obj[current].door = 2;

                        }
                        ;
                        if (this.obj[current].y > defyn) {
                            this.obj[current].y = defyn + 4.6;
                        }
                        ;
                    }
                    ;
                    this.obj[current].set_pole_pos(this.obj[current].x, this.obj[current].y);

                    set_visible(this.obj[current].layer, 1);
                    set_visible(this.obj[current].number, 1);
                    this.obj[current].mvisible = true;
                    this.obj[current].need_refresh = 1;
                    this.obj[current].show_obj();
                    this.obj[current].otbroshen = true;
                    this.obj[current].destxx = this.obj[current].destx;
                    this.obj[current].destyy = this.obj[current].desty;
                    ndestc = 1;
                    ndestx[0] = this.obj[current].destx;
                    ndesty[0] = this.obj[current].desty;
                    ndestx[1] = this.obj[current].destx;
                    ndesty[1] = this.obj[current].desty;
                    someactive = true;
                    this.obj[current].donow = 'm';
                    this.obj[current].active = true;
                }
                this.calcComs();
            }


            if ((!someactive) && ((!spellactive) || (flamewave_active)) && (command.length > 1) && (loadcommand == '') && (!loading) && (initialized) && (waitingcounter > 10)) {

                ok = false;

                for (i = 1; i <= magicscount; i++) {
                    if ((((magics[i].doing != '') && (magics[i].doing != undefined)) || ((magics[i].cmd != '') && (magics[i].cmd != undefined))) && (magics[i] != undefined)) {
                        ok = true;
                        break;
                    }
                    ;
                }
                ;


                var len = this.obj_array.length;
                for (var k1 = 0; k1 < len; k1++) {
                    i = this.obj_array[k1];
                    if ((this.obj[i].active) || ((this.obj[i].doing != "") && (this.obj[i].doing != undefined))) {
                        if ((this.obj[i].bomb) && (this.obj[i].doing == "die")) continue;
                        ok = true;
                        break;
                    }
                }
                someactive = ok;
                if ((cmd == '>') && (!someactive)) {
                    i = tointeger(command.substr(1, command.indexOf(':') - 1));
                    if (nowturn < i) {
                        nowturn = i;
                    }
                    showchat(nowturn);
                    command = command.substr(command.indexOf(':') + 1);
                }
                if ((cmd == 'h') && (!someactive)) {
                    i = tointeger(command.substr(1, 3));
                    this.herodie(i);
                    this.calcinitiative(-1);
                    command = command.substr(4);
                }
                if ((cmd == 'S') && (!someactive)) {
                    tmp = command.substr(1, 18);
                    command = command.substr(19);
                    mcounter = 1;
                    this.usemagic(tmp, mcounter);
                    lastmagic = tmp.substr(0, 3);
                    if ((lastmagic == 'paa') || (lastmagic == 'pss') || (lastmagic == 'psf') || (lastmagic == 'fd1')) {
                        if ((command.substr(0, 1) != 'P') && (command.substr(0, 1) != 'r') && (command.substr(0, 4) != 'Sphr')) command = 'i0-10000' + command;
                    }
                    ;
                    if ((tmp.substr(0, 3) != 'paa') && (tmp.substr(0, 3) != 'pss') && (tmp.substr(0, 3) != 'psf') && (tmp.substr(0, 3) != 'rgl')) {
                        lastcaster = tmp.substr(3, 3);
                        this.calcComs();
                    }
                    ;
                }
                if ((cmd == 'k') && (!someactive)) {
                    i = tointeger(command.substr(1, 3));
                    this.obj[i].nownumber = 0;
                    this.obj[i].doing = "die";
                    if ((magic[i]) && (magic[i]['sum']) && (magic[i]['sum']['effect'] == 2) && (spells['demongate' + i])) {
                        spells['demongate' + i].doing = "die";
                        spells['demongate' + i].frame = 0;
                        spells['demongate' + i].hide_after_use = 1;
                    }
                    ;
                    if ((this.obj[i].id == 347) || (this.obj[i].id == 349) || (this.obj[i].bonus)) {
                        if (this.obj[i].id == 377) {
                            setBonus(i, (i + warid) % 5 + 1, 'die');
                        } else setBonus(i, magic[i]['BNb']['effect'], 'die');
                    }
                    ;
                    this.obj[i].set_number();
                    someactive = true;
                    command = command.substr(4);
                    this.calcinitiative(-1);
                }
                if ((cmd == 'f') && (!someactive)) {
                    srt = '';
                    if (((lang == 0) && (command.substr(1, 1) == '<')) || ((lang == 1) && (command.indexOf('f_en<') < 0))) {
                        srt = command.substr(1, command.indexOf('|#'));
                    }
                    ;
                    if ((lang == 1) && (command.substr(2, 1) == 'e')) {
                        srt = command.substr(4, command.indexOf('|#') - 3);
                    }
                    ;
                    if (srt != '') showfinish(srt, command, false);
                    command = command.substr(command.indexOf('|#') + 2);
                }
                if ((cmd == 'd') && (!someactive) && (!was_v)) {
                    lastattacker = current;
                    someactive = true;
                    j = tointeger(command.substr(4, 3));
                    if ((!this.obj[j]) && ((btype == 131) || (btype == 97))) {
                        command = command.substr(17);
                        this.calcComs(magicdam);
                        return 0;
                    }
                    ; //заглушка
                    if ((this.obj[j].damage < 0) || (this.obj[j].damage == undefined)) this.obj[j].damage = 0;
                    this.obj[j].damage += tointeger(command.substr(7, 10));
                    if (magicdam == undefined) {
                        this.obj[j].magicdamage = '';
                    } else {
                        this.obj[j].magicdamage = magicdam;
                    }
                    ;
                    somedamaged = true;
                    command = command.substr(17);
                    this.obj[j].damaged = current;
                    if ((this.obj[current].bomb != 1) && (!flamewave_active)) {
                        this.obj[current].attacker = false;
                        this.obj[current].donow = 'a';
                        this.obj[current].destx = this.obj[j].x;
                        this.obj[current].desty = this.obj[j].y;
                        this.obj[current].attacking = j;
                        var bigx = this.obj[j]['big'];
                        var bigy = this.obj[j]['big'];
                        if (this.obj[j]['bigx']) bigx = 1;
                        if (this.obj[j]['bigy']) bigy = 1;

                        for (x = 0; x <= bigx; x++) {
                            for (y = 0; y <= bigy; y++) {
                                if ((this.obj[current].x - (this.obj[j].x + x)) * (this.obj[current].x - (this.obj[j].x + x)) + (this.obj[current].y - (this.obj[j].y + y)) * (this.obj[current].y - (this.obj[j].y + y)) < (this.obj[current].x - this.obj[current].destx) * (this.obj[current].x - this.obj[current].destx) + (this.obj[current].y - this.obj[current].desty) * (this.obj[current].y - this.obj[current].desty)) {
                                    this.obj[current].destx = this.obj[j].x + x;
                                    this.obj[current].desty = this.obj[j].y + y;
                                }
                            }
                        }
                        b = 1;
                        if (this.obj[j].side <= 0) b = -1;
//				b = this.obj[j].side;

                        if (this.obj[j].x < this.obj[current].x) {
                            b = 1;
                        }
                        if (this.obj[j].x > this.obj[current].x) {
                            b = -1;
                        }


                        this.obj[current].active = true;
                    }
                    ;
                    this.calcComs(magicdam);
                }


                if (cmd == 'w') {
                    lastattacker = -1;
                    if (this.obj[current].hero) {
                        switch (lang) {
                            case 0:
                                htmllog += '' + this.html('name', current) + ' - ожидает.' + this.html('end');
                                break;
                            case 1:
                                htmllog += '' + this.html('name', current) + ' waits.' + this.html('end');
                                break;
                        }
                        ;
                    } else {
                        removeText(current)
                        switch (lang) {
                            case 0:
                                htmllog += '' + this.html('name', current) + ' - ожидают.' + this.html('end');
                                break;
                            case 1:
                                htmllog += '' + this.html('name', current) + ' wait.' + this.html('end');
                                break;
                        }
                        ;
                    }
                    showtext();
                    showdefwait(current, 'wait', -1);
                    command = command.substr(4);
                }
                if (cmd == 'O') {

                    switch (lang) {
                        case 0:
                            htmllog += '' + this.html('name', current) + ' - перешли на другую сторону.' + this.html('end');
                            break;
                        case 1:
                            htmllog += '' + this.html('name', current) + ' switch sides treacherously.' + this.html('end');
                            break;
                    }
                    ;
                    showtext();
                    this.obj[current]['owner'] = tointeger(command.substr(4, 3));
                    iside = -100;
                    var len = this.obj_array.length;
                    for (var k1 = 0; k1 < len; k1++) {
                        i = this.obj_array[k1];
                        if ((this.obj[current]['owner'] == this.obj[i]['owner']) && (i != current)) {
                            iside = this.obj[i].side;
                            break;
                        }
                        ;
                    }
                    ;
                    if (iside != -100)
                        this.obj[current].side = iside;
                    else
                        this.obj[current].side = tointeger(command.substr(7, 3));
                    this.obj[current].set_number();
                    command = command.substr(10);
                }
                ;
                if (cmd == 'o') {
                    lastattacker = -1;
                    switch (lang) {
                        case 0:
                            htmllog += '' + this.html('name', current) + ' - оглушающий удар.' + this.html('end');
                            break;
                        case 1:
                            htmllog += '' + this.html('name', current) + ' perform stun.' + this.html('end');
                            break;
                    }
                    ;
                    showtext();
                    command = command.substr(4);
                }

                if (cmd == 'p') {
                    lastattacker = -1;
                    switch (lang) {
                        case 0:
                            htmllog += '' + this.html('name', current) + ' - оглушающий выстрел.' + this.html('end');
                            break;
                        case 1:
                            htmllog += '' + this.html('name', current) + ' perform stunning shot.' + this.html('end');
                            break;
                    }
                    ;
                    showtext();
                    command = command.substr(4);
                }


                if (cmd == 'z') {
                    lastattacker = -1;
                    j = tointeger(command.substr(4, 3));
                    mana = tointeger(command.substr(7, 3));

                    if ((current > 0) && ((this.obj[current].getside() != this.obj[j].side) || (btype == _KZS_PVE))) {
                        this.obj[j]['nowmanna'] -= mana;
                        switch (lang) {
                            case 0:
                                htmllog += '' + this.html('name', current) + ' - вытянули ' + mana + ' маны у ' + this.html('name', j) + '.' + this.html('end');
                                break;
                            case 1:
                                htmllog += '' + this.html('name', current) + ' drain ' + mana + ' mana from ' + this.html('name', j) + '.' + this.html('end');
                                break;
                        }
                        ;
                        if ((this.obj[current].manadestroyer) || (this.obj[current].siphonmana)) {
                            this.obj[current].donow = "c";
                            this.obj[current].active = true;
                        }
                        ;
                    } else {
                        this.obj[j]['nowmanna'] += mana;
                        if (current > 0) {
                            switch (lang) {
                                case 0:
                                    htmllog += '' + this.html('name', current) + ' - передали ' + mana + ' маны для ' + this.html('name', j) + '.' + this.html('end');
                                    break;
                                case 1:
                                    htmllog += '' + this.html('name', current) + ' transfer ' + mana + ' mana to ' + this.html('name', j) + '.' + this.html('end');
                                    break;
                            }
                            ;
                        } else {
                            switch (lang) {
                                case 0:
                                    var who = 'ет';
                                    if (!this.obj[j]['hero']) who = 'ют';
                                    htmllog += '' + this.html('name', j) + ' - восполня' + who + ' ману.' + this.html('end');
                                    break;
                                case 1:
                                    var who = 's';
                                    if (!this.obj[j]['hero']) who = '';
                                    htmllog += '' + this.html('name', j) + ' - restore' + who + ' mana.' + this.html('end');
                                    break;
                            }
                            ;

                        }
                        ;
                    }
                    ;
                    showtext();
                    command = command.substr(10);
                }

                if (cmd == 'x') {
                    lastattacker = -1;
                    j = tointeger(command.substr(4, 3));
                    mana = tointeger(command.substr(7, 3));

                    this.obj[j]['nowmanna'] += mana;
                    if (current > 0) {
                        switch (lang) {
                            case 0:
                                htmllog += '' + this.html('name', current) + ' - передали ' + mana + ' маны для ' + this.html('name', j) + '.' + this.html('end');
                                break;
                            case 1:
                                htmllog += '' + this.html('name', current) + ' transfer ' + mana + ' mana to ' + this.html('name', j) + '.' + this.html('end');
                                break;
                        }
                        ;
                    } else {
                        switch (lang) {
                            case 0:
                                var who = 'ет';
                                if (!this.obj[j]['hero']) who = 'ют';
                                htmllog += '' + this.html('name', j) + ' - восполня' + who + ' ману.' + this.html('end');
                                break;
                            case 1:
                                var who = 's';
                                if (!this.obj[j]['hero']) who = '';
                                htmllog += '' + this.html('name', j) + ' - restore' + who + ' mana.' + this.html('end');
                                break;
                        }
                        ;

                    }
                    ;
                    showtext();
                    command = command.substr(10);
                }


                if (cmd == 'T') {
                    lastattacker = -1;
                    j = tointeger(command.substr(4, 3));
                    if (this.obj[current].wardingarrows) {
                        switch (lang) {
                            case 0:
                                htmllog += '' + this.html('name', current) + ' - останавливающий выстрел по ' + this.html('name', j) + '.' + this.html('end');
                                break;
                            case 1:
                                htmllog += '' + this.html('name', current) + ' perform knocking shot at ' + this.html('name', j) + '.' + this.html('end');
                                break;
                        }
                        ;
                    } else {
                        switch (lang) {
                            case 0:
                                htmllog += '' + this.html('name', current) + ' - тяжёлый удар по ' + this.html('name', j) + '.' + this.html('end');
                                break;
                            case 1:
                                htmllog += '' + this.html('name', current) + ' performs stunning blow at ' + this.html('name', j) + '.' + this.html('end');
                                break;
                        }
                        ;
                    }
                    ;
                    showtext();
                    command = command.substr(7);
                }
                if (cmd == 'F') {
                    lastattacker = -1;
                    j = tointeger(command.substr(4, 3));
                    switch (lang) {
                        case 0:
                            htmllog += '' + this.html('name', j) + ' - бегут в страхе от ' + this.html('name', current) + '.' + this.html('end');
                            break;
                        case 1:
                            htmllog += '' + this.html('name', j) + ' flee in fear of ' + this.html('name', current) + '.' + this.html('end');
                            break;
                    }
                    ;
                    showtext();
                    command = command.substr(7);
                }
                if (cmd == 'A') {
                    lastattacker = -1;
                    j = tointeger(command.substr(4, 3));
                    switch (lang) {
                        case 0:
                            htmllog += '' + this.html('name', j) + ' отвлекают удар, направленный на ' + this.html('name', current) + '.' + this.html('end');
                            break;
                        case 1:
                            htmllog += '' + this.html('name', j) + ' get the strike destined for ' + this.html('name', current) + '.' + this.html('end');
                            break;
                    }
                    ;
                    showtext();
                    command = command.substr(7);
                }
                if (cmd == 'l') {
                    this.process_luck(current);
                }
                if (cmd == 'C') {
                    lastmagic = '';
                    j = tointeger(command.substr(4, 6));
                    command = command.substr(10);
                    if (this.obj[current]) {
//				this.calcinitiative(0);
//				this.obj[current].nowinit = j;
                        /*				this.calcinitiative(0, current);*/
                        this.showatb();
                    }
                    waittimer = Date.now() + waittime;
                    return 0;
                }
                if (cmd == 'U') {
                    lastmagic = '';
                    ln = tointeger(command.substr(1, 3));
                    st = command.substr(4, ln - 4);
                    while (st.length > 3) {
                        o_id = tointeger(st.substr(0, 3));
                        o_init = tointeger(st.substr(3, 7));
                        if (this.obj[o_id]) this.obj[o_id].nowinit = o_init;
                        st = st.substr(10);
                    }
                    command = command.substr(ln);
                    this.calcinitiative(0);
                    this.showatb();
                }
                if ((cmd == 'i') && (!was_v)) {
                    lastmagic = '';
                    lastattacker = -1;
                    j = tointeger(command.substr(4, 4));
                    if ((current != -1) && (current > 0)) this.obj[current].nowinit += j;
                    command = command.substr(8);
                    if ((((current != 1) || (j != 0)) && (j != 0)) || (current == -1)) {
                        this.calcinitiative(j);
                        this.showmap(3);
                        this.showatb();
                    }
                    ;
                }
                if (cmd == 'I') {
                    lastattacker = -1;
                    j = tointeger(command.substr(4, 4));
                    this.obj[current].nowinit = this.obj[j].nowinit + 100;
                    command = command.substr(8);
                    this.calcinitiative(-1);
                    this.showmap(true);
                    this.showatb();
                }
                ;
                if (cmd == 'v') {
                    stars = tointeger(command.substr(1, 1));
                    command = command.substr(2);
                }
                if (cmd == 'u') {
                    this.obj[current]['speed']++;
                    command = command.substr(4);
                }
                if (cmd == 'R') {
                    heal = tointeger(command.substr(4, 3));
                    this.obj[current]['nowhealth'] += heal;
                    command = command.substr(7);
                    switch (lang) {
                        case 0:
                            htmllog += '' + this.html('name', current) + ' восстанавливают ' + this.html('bold', heal) + ' здоровья.' + this.html('end');
                            break;
                        case 1:
                            htmllog += '' + this.html('name', current) + ' restore ' + this.html('bold', heal) + ' health.' + this.html('end');
                            break;
                    }
                    ;
                }

                if (cmd == 'W') {
                    def = tointeger(command.substr(4, 3));
                    command = command.substr(7);
                    switch (lang) {
                        case 0:
                            htmllog += '' + this.html('name', current) + ' - ослабляющий удар.' + this.html('end');
                            break;
                        case 1:
                            htmllog += '' + this.html('name', current) + ' perform infected strike.' + this.html('end');
                            break;
                    }
                    ;
                    if (!this.obj[def].perseverance) {
                        this.obj[def]['attack'] -= 4;
                    }
                    ;
                    if ((!this.obj[def].armoured) && (!this.obj[def].organicarmor)) {
                        this.obj[def]['defence'] -= 4;
                    }
                    ;
                    if (this.obj[def]['attack'] < 0) {
                        this.obj[def]['attack'] = 0;
                    }
                    ;
                    if (this.obj[def]['defence'] < 0) {
                        this.obj[def]['defence'] = 0;
                    }
                    ;

                }
                ;
                if (cmd == 'V') {
                    j = tointeger(command.substr(4, 3));
                    command = command.substr(7);
                    i = current;

                    if (command.substr(0, 1) != 'd') this.calcComs(magicdam, true);
                    var j = 0;
                    while ((command.substr(0, 1) == 'd') && (tointeger(command.substr(1, 3)) == i)) {
                        lastattacker = i;
                        j = tointeger(command.substr(4, 3));
                        if ((!this.obj[j]) && (btype == 131)) {
                            command = command.substr(17);
                            continue;
                        }
                        ; //заглушка

                        if ((this.obj[j].damage < 0) || (this.obj[j].damage == undefined)) this.obj[j].damage = 0;
                        this.obj[j].damage += tointeger(command.substr(7, 10));
                        this.obj[j].magicdamage = '';
                        somedamaged = true;
                        command = command.substr(17);
                        this.obj[i].attacker = false;
                        this.obj[i].attacking = j;
                        this.obj[j].damaged = i;
                        this.calcdamage(j);
                        if ((command.substr(0, 1) != 'd') && (command.substr(0, 8) != 'i' + addzero(i, 3) + '0000') && (!was_v)) {
                            this.calcComs(magicdam, true);
                        }
                        ;
                        if (command.substr(0, 1) == 'i') break;
                    }
                    ;
                    this.obj[i].attacker = false;
                    if (!was_v) this.calcComs(magicdam);
//			this.obj[i].donow = 'a';
//			this.obj[i].active = true;
//			this.obj[current].attacking = j;
//			someactive = true;
//			this.obj[i].attacker = false;

                }
                ;
                if (cmd == 'G') {
                    k = tointeger(command.substr(4, 2));
                    j = tointeger(command.substr(6, 2));
                    init = 100000;
                    if (this.obj[current].hero) {
                        addself(current, 'rs' + k, init, j);
                    } else {
                        addself(current, 'run', init, j);
                    }
                    ;

                    command = command.substr(8);
                }
                ;


                if ((cmd == 's') && (!someactive) && (!loading)) {
                    lastattacker = -1;
                    var opengate = false;
                    if (this.obj[current].x >= 100) {
                        if (magic[current]['hsm']) {
                            this.obj[magic[current]['hsm']['effect']].alreadysummon = true;
                        } else {
                        }
                        ;
                        this.obj[current].nownumber = -1;


                        opengate = true;


                        switch (lang) {
                            case 0:
                                htmllog += this.html('name', current) + ' открывают врата ада.' + this.html('end');
                                break;
                            case 1:
                                htmllog += this.html('name', current) + ' perform gating.' + this.html('end');
                                break;
                        }
                        ;
                    } else {
                        k = tointeger(command.substr(8, 5));
                        if ((this.obj[current].id != 347) && (this.obj[current].id != 349) && (!this.obj[current].bonus)) {
                            if (k == 0) {
                                this.obj[current].alreadysummon = true;
                                switch (lang) {
                                    case 0:
                                        htmllog += this.html('name', current) + ' - не удалось никого призвать.' + this.html('end');
                                        break;
                                    case 1:
                                        htmllog += this.html('name', current) + ' fail to gate.' + this.html('end');
                                        break;
                                }
                                ;
                                command = command.substr(13);
                                return 0;
                            }
                            ;

                            switch (lang) {
                                case 0:
                                    htmllog += this.html('name', current) + ' выходят из ада.' + this.html('end');
                                    break;
                                case 1:
                                    htmllog += this.html('name', current) + ' are gated from hell.' + this.html('end');
                                    break;
                            }
                            ;
                            this.obj[current].mvisible = true;
                            if (spells['demongate' + current]) {
                                spells['demongate' + current].doing = "die";
                                spells['demongate' + current].frame = 0;
                                spells['demongate' + current].hide_after_use = 1;
                            }
                            ;
                            this.obj[current].nownumber = this.obj[current].maxnumber;
                            this.obj[current].set_number();
                            this.obj[current].summoned = 0;
                            magic[current]['sum']['effect'] = 1;
                            playsound(current, "gate", 70);
                            this.obj[current].donow = "";
                            this.obj[current].doing = "";
                            this.obj[current].active = true;
                            set_visible(this.obj[current].number, 1);
                            set_visible(this.obj[current].layer, 1);
                            this.obj[current].show_obj();
                            someactive = true;
                        }
                        ;
                    }
                    ;
                    k = tointeger(command.substr(4, 2));
                    this.obj[current].x = k;
                    k = tointeger(command.substr(6, 2));
                    this.obj[current].y = k;
                    k = tointeger(command.substr(8, 5));
                    this.obj[current].maxnumber = k;
                    if (opengate) {
                        playsound(current, "open_gate", 70);

                    }
                    ;

                    this.checkdemonic(current);
                    this.obj[current].set_pole_pos(this.obj[current].x, this.obj[current].y);
                    command = command.substr(13);
                    showtext();


                }


                if (((cmd == 'm') || (cmd == 'Y')) && (!someactive) && ((this.obj[current].damaged == 0) || (this.obj[current].damaged == undefined))) {
                    var ok = true;
                    if (command.substr(8, 7) == 'Slep' + addzero(current, 3)) {
                        ok = false;
                    }
                    if ((cmd == 'Y') && (command.substr(4, 4) == '0000')) {
                        ok = false;
                    }
                    if ((this.obj[current].warmachine) && (command.substr(4, 4) == '0000')) {
                        ok = false;
                    }
                    if (ok) {
                        lastattacker = -1;
                        k = command.substr(4, 2) - 1;
                        this.obj[current].destx = k + 1;
                        k = command.substr(6, 2) - 1;
                        this.obj[current].desty = k + 1;
                        if (this.obj[current].hero) {
                            this.obj[current].x = this.obj[current].destx;
                            this.obj[current].y = this.obj[current].desty;

                        }
                    }
                    ;
                    if (cmd == 'Y') {
                        command = command.substr(10);
                    } else
                        command = command.substr(8);
                    if (((this.obj[current].x == this.obj[current].destx) && (this.obj[current].y == this.obj[current].desty)) || (ok == false)) {
                    } else {
                        ndestc = -1;
                        this.getneardest(current);
                        someactive = true;
                        this.obj[current].attacker = 0;
                        this.obj[current].donow = 'm';
                        this.obj[current].active = true;
                    }
                    if (((command.substr(0, 1) == 'm') || (command.substr(0, 1) == 'Y')) && (tointeger(command.substr(1, 3)) == current)) command = 'i0010000' + command;
                    if (command.substr(0, 1) == 'V') this.calcComs(magicdam);
                }
                if (command == '') {
                    if ((loaded_data[lastturn]) && (was_set_loaded_data[lastturn] != 1)) {
                        was_set_loaded_data[lastturn] = 1;
                        this.procceed_data(loaded_data[lastturn], 1);
                        loaded_data[lastturn] = '';
                    }
                    ;
                    showchat(nowturn);
                }
            }
        }
        stage[war_scr].usemagic2 = function (mag, mc) {
            var mname = '', z = 0, i = 0, j = 0, eff = 0, cost = 0, init = 0, x1 = 0, y1 = 0, x2 = 0, y2 = 0, x = 0,
                y = 0, k = 0;
            mname = mag.substr(0, 3);

            if (mname == 'stg') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                this.obj[j]['nownumber']--;
                if (this.obj[j]['nownumber'] == 0) {
                    setmap(this.obj[j].x, this.obj[j].y, 0);
                    if (this.obj[j].big) {
                        setmap(this.obj[j].x + 1, this.obj[j].y, 0);
                        setmap(this.obj[j].x + 1, this.obj[j].y + 1, 0);
                        setmap(this.obj[j].x, this.obj[j].y + 1, 0);
                    }
                    ;
                    if (this.obj[j].bigx) {
                        setmap(this.obj[j].x + 1, this.obj[j].y, 0);
                    }
                    ;
                    if (this.obj[j].bigy) {
                        setmap(this.obj[j].x, this.obj[j].y + 1, 0);
                    }
                    ;
                    this.obj[j].doing = "die";
                    this.obj[j].dead = true;
                    this.obj[j].active = true;
                    someactive = true;
                }
                ;
                this.minus(j, 1);


            }
            ;
            if (mname == 'phr') {
                i = tointeger(mag.substr(3, 3));
                nx = tointeger(mag.substr(6, 2));
                ny = tointeger(mag.substr(8, 2));
                if (this.obj[i]['rebirth'] == 1) this.obj[i]['rebirth'] = 100;
                this.obj[i]['nownumber'] = Math.max(1, Math.ceil(this.obj[i]['maxnumber'] * this.obj[i]['rebirth'] / 100));
                this.obj[i]['nowhealth'] = this.obj[i]['maxhealth'];
                this.obj[i]['x'] = nx;
                this.obj[i]['y'] = ny;
                this.obj[i].set_pole_pos(this.obj[i].x, this.obj[i].y);
                this.minus(i, -this.obj[i]['nownumber']);

                switch (lang) {
                    case 0:
                        htmllog += this.html('name', i) + ' возрождаются.' + this.html('end');
                        break;
                    case 1:
                        htmllog += this.html('name', i) + ' are reborn.' + this.html('end');
                        break;
                }
                ;

                showtext();
                this.obj[i].donow = "";
                this.obj[i].doing = "rise";
                playsound(j, "res", 70);
                this.obj[i].active = true;
                someactive = true;

            }
            ;
            if (mname == 'coc') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                m = tointeger(mag.substr(9, 4));
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
//*		scr.consumecorpse.setunit(j);*/
//		this.obj[i].setmagic('consumecorpse');
                this.obj[i].attacker = false;
                this.obj[i].destx = this.obj[j].x;
                this.obj[i].desty = this.obj[j].y;
                this.obj[i]['nowmanna'] += m;
                switch (lang) {
                    case 0:
                        htmllog += this.html('name', i) + ' восстанавливает ' + this.html('bold', m) + ' маны, поглощая ' + this.html('name', j) + '.' + this.html('end');
                        break;
                    case 1:
                        htmllog += this.html('name', i) + ' restores ' + this.html('bold', m) + ' mana by consuming ' + this.html('name', j) + '.' + this.html('end');
                        break;
                }
                ;
                this.obj[j].doing = "hide";
                this.obj[j].frame = 0;
                this.obj[j].cur_frame_need = 50;
                this.obj[j].active = true;
//		this.showmagic('consumecorpse', this.obj[j].x, this.obj[j].y, this.obj[j].x, this.obj[j].y, 0, 0, 0, i);
                showtext();
                this.obj[i].donow = "c";
                this.obj[i].active = true;
                someactive = true;
            }
            ;
            if (mname == 'eod') {
                i = tointeger(mag.substr(3, 3));
                m = tointeger(mag.substr(6, 3));
                this.obj[i]['nowmanna'] += m;
            }
            ;
            if ((mname == 'rsd') || (mname == 'rs2')) {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
                if (mname == 'rs2') {
                    umk = 0;
                    cost = tointeger(mag.substr(9, 3));
                    eff = tointeger(mag.substr(12, 6));
                } else {

                    umk = tointeger(mag.substr(9, 2));
                    cost = tointeger(mag.substr(11, 1));
                    if (cost == 1) cost = 12;
                    if (umk != 0) {
                        eff = tointeger(mag.substr(12, 6));
                    } else {
                        umk = tointeger(mag.substr(12, 2));
                        eff = tointeger(mag.substr(14, 4));
                    }
                    ;
                }
                ;
                k = this.obj[j]['nownumber'];
                z = this.obj[j]['nowhealth'];
                this.obj[j]['nowhealth'] += eff;
                var raised = false;
                if (this.obj[j]['nownumber'] == 0) {
                    raised = true;
                    this.obj[j]['nownumber'] = 1;
                }
                while (this.obj[j]['nowhealth'] > this.obj[j]['realhealth']) {
                    this.obj[j]['nownumber']++;
                    this.obj[j]['nowhealth'] = this.obj[j]['nowhealth'] - this.obj[j]['realhealth'];
                }
                if ((this.obj[i]['resurrection']) || (this.obj[i]['heal']) || (this.obj[i]['bladeofmercy']) || (this.obj[i]['bladeofepiphany'])) {
                    if (!this.obj[i]['heal']) {
                        eff = 1;
                        if ((this.obj[i]['bladeofepiphany']) && (magic[i]['rsr']) && (magic[i]['rsr']['effect'] == 1)) eff = 2;
                        addself(i, 'rsr', 100000, eff);
                    } else {
                        if (!magic[i]['hls']) {
                            magic[i]['hls'] = Array();
                            magic[i]['hls']['effect'] = 0;
                        }
                        ;
                        magic[i]['hls']['effect']++;
                        addself(i, 'hls', 100000, magic[i]['hls']['effect']);
                    }
                    ;
                } else if (mname == 'rs2') {
                    if ((this.obj[i]['wailofthenetherworld']) || (this.obj[i]['demon_resurrection'])) {

                    } else
                        this.obj[j]['maxhealth'] = Math.floor(this.obj[j]['maxhealth'] * 0.9);
                } else {

                    if (this.obj[j]['undead']) {
                        kk = 0.2;
                        if (umk > 0) kk = kk * (1 - 0.05 * umk);
                        kk = 1 - kk;
                        this.obj[j]['maxhealth'] = Math.floor(this.obj[j]['maxhealth'] * kk);
                    } else {
                        this.obj[j]['maxhealth'] = Math.floor(this.obj[j]['maxhealth'] * 0.6);
                        this.obj[j]['morale'] = 0;
                        addself(j, 'und', 100000, 2);
                        var len = this.obj_array.length;
                        for (var k1 = 0; k1 < len; k1++) {
                            z = this.obj_array[k1];
                            if ((this.obj[z]['owner'] == this.obj[j]['owner']) && (this.obj[z]['alive'])) {
                                this.obj[z]['morale'] = -2;
                            }
                            ;
                        }
                        ;
                    }
                    ;
                }
                ;

                if (this.obj[j]['maxhealth'] == 0) {
                    this.obj[j]['maxhealth'] = 1;
                }
                if (this.obj[j]['nownumber'] > this.obj[j]['maxnumber']) {
                    this.obj[j]['nownumber'] = this.obj[j]['maxnumber'];
                    this.obj[j]['nowhealth'] = this.obj[j]['maxhealth'];
                }
                this.obj[j]['nowhealth'] = this.obj[j]['nowhealth'] % this.obj[j]['realhealth'];
                if (this.obj[j]['nowhealth'] > this.obj[j]['maxhealth']) {
                    this.obj[j]['nowhealth'] = this.obj[j]['maxhealth'];
                }
                this.obj[j]['nowhealth'] = this.obj[j]['nowhealth'] % this.obj[j]['maxhealth'];
                if (this.obj[j]['nowhealth'] == 0) {
                    this.obj[j]['nowhealth'] = this.obj[j]['maxhealth'];
                }
                this.obj[i]['nowmanna'] -= cost;
                k = this.obj[j]['nownumber'] - k;
                if (k > 0) {
                    this.minus(j, -k);
                }
                if ((!this.obj[i].wailofthenetherworld) && ((mname == 'rs2') || (this.obj[i].resurrection) || (this.obj[i].heal) || (this.obj[i].bladeofmercy) || (this.obj[i].bladeofepiphany))) {
                    if (this.obj[i].bladeofepiphany) {
                        addself(j, 'boe', this.obj[i].nowinit + 200, 1);
                    }
                    ;
                    okon = 'и';
                    if (this.obj[i].hero) okon = '';
                    switch (lang) {
                        case 0:
                            htmllog += this.html('name', i) + ' воскресил' + okon + ' ' + k + ' ' + this.html('name', j) + '.' + this.html('end');
                            break;
                        case 1:
                            htmllog += this.html('name', i) + ' resurrect ' + k + ' ' + this.html('name', j) + '.' + this.html('end');
                            break;
                    }
                    ;
                } else {
                    okon = 'и';
                    if (this.obj[i].hero) okon = '';
                    switch (lang) {
                        case 0:
                            htmllog += this.html('name', i) + ' поднял' + okon + ' ' + k + ' ' + this.html('name', j) + '.' + this.html('end');
                            break;
                        case 1:
                            htmllog += this.html('name', i) + ' raises ' + k + ' ' + this.html('name', j) + '.' + this.html('end');
                            break;
                    }
                    ;
                }
                ;
                showtext();
                this.obj[j].donow = "";
                if (raised) this.obj[j].doing = "rise";
                playsound(j, "res", 70);
                this.obj[j].active = true;
                someactive = true;

                this.obj[i].setmagic('');
                this.obj[i].donow = "c";
                this.obj[i].no_magic = 1;
                this.obj[i].active = true;
                if (typeof magicdamage === 'undefined') magicdamage = '';
                this.calcComs(magicdamage);

                while ((command.substr(0, 1) == 'd') && (tointeger(command.substr(1, 3)) == i)) {
                    lastattacker = i;
                    j = tointeger(command.substr(4, 3));
                    if ((this.obj[j].damage < 0) || (this.obj[j].damage == undefined)) this.obj[j].damage = 0;
                    this.obj[j].damage += tointeger(command.substr(7, 10));
                    this.obj[j].magicdamage = '';
                    somedamaged = true;
                    command = command.substr(17);
                    this.obj[i].attacker = false;
                    this.obj[i].attacking = j;
                    this.obj[j].damaged = i;
                }
                ;

                return 0;
            }
            ;
            if (mname == 'rwl') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
                cost = tointeger(mag.substr(9, 3));
                eff = tointeger(mag.substr(12, 6));
                this.obj[j]['nowhealth'] = this.obj[j]['maxhealth'];

                switch (lang) {
                    case 0:
                        htmllog += this.html('name', i) + ' восстановили ' + eff + ' прочности объекта ' + this.html('name', j) + '.' + this.html('end');
                        break;
                    case 1:
                        htmllog += this.html('name', i) + ' repair ' + eff + ' durability of ' + this.html('name', j) + '.' + this.html('end');
                        break;
                }
                ;
                showtext();
                playsound(j, "res", 70);

                someactive = true;
                this.obj[i].setmagic('');
                this.obj[i].donow = "c";
                this.obj[i].active = true;
                return 0;
            }
            ;


            if (mname == 'arm') {
                i = tointeger(mag.substr(3, 3));
                x = tointeger(mag.substr(6, 2));
                y = tointeger(mag.substr(8, 2));
                if (autoscroll) {
                    scrollto(x, y);
                }
                cost = tointeger(mag.substr(10, 3));
                current = i;
                lastattacker = current;
//		armageddon.attacker = false;
                var cm = magicbookspells.length;
                for (z = 0; z < cm; z++) {
                    if (magicbookspells[z] == 'armageddon') {
                        magicdamage = magicbooknames[z];
                    }
                }
                somedamaged = true;
                this.obj[current].setmagic('armageddon');
                this.obj[current]['nowmanna'] -= cost;
                this.obj[current].attacker = false;
                this.obj[current].destx = x;
                this.obj[current].desty = y;
                this.showmagic('armageddon', this.obj[current].x, this.obj[current].y, x, y, 0, 0, 0, current);
                this.obj[current].donow = "c";
                this.obj[current].active = true;
                someactive = true;
                this.calcComs(magicdamage);
                return 0;
            }
            ;
            if (mname == 'eqk') {
                i = tointeger(mag.substr(3, 3));
                if (autoscroll) {
                    scrollto(this.obj[i].x, this.obj[i].y);
                }
                cost = tointeger(mag.substr(6, 3));
                current = i;
                lastattacker = current;
//		earthquake.attacker = false;
                var cm = magicbookspells.length;
                for (z = 0; z < cm; z++) {
                    if (magicbookspells[z] == 'earthquake') {
                        magicdamage = magicbooknames[z];
                    }
                }
                somedamaged = true;
                this.obj[current].setmagic('earthquake');
                this.obj[current]['nowmanna'] -= cost;
                this.obj[current].attacker = false;
                this.obj[current].destx = x;
                this.obj[current].desty = y;
                this.showmagic('earthquake', this.obj[current].x, this.obj[current].y, x, y, 0, 0, 0, current);
                this.obj[current].donow = "c";
                this.obj[current].active = true;
                someactive = true;
                this.calcComs(magicdamage);
                return 0;
            }
            ;

            if (mname == 'fbl') {
                i = tointeger(mag.substr(3, 3));
                x = tointeger(mag.substr(6, 2));
                y = tointeger(mag.substr(8, 2));
                if (autoscroll) {
                    scrollto(x, y);
                }
                cost = tointeger(mag.substr(10, 3));
                current = i;
                lastattacker = current;
//		fireball.attacker = false;
                var cm = magicbookspells.length;
                for (z = 0; z < cm; z++) {
                    if (magicbookspells[z] == 'fireball') {
                        magicdamage = magicbooknames[z];
                    }
                }
                somedamaged = true;
                this.obj[current].setmagic('fireball');
                this.obj[current]['nowmanna'] -= cost;
                this.obj[current].attacker = false;
                this.obj[current].destx = x;
                this.obj[current].desty = y;
                this.showmagic('fireball', this.obj[current].x, this.obj[current].y, x, y, 0, 0, 0, current);
                this.obj[current].donow = "c";
                this.obj[current].active = true;


                someactive = true;
                this.calcComs(magicdamage);
                return 0;
            }
            ;
            if (mname == 'cpt') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
                eff = tointeger(mag.substr(9, 5));
                xx = tointeger(mag.substr(14, 2));
                yy = tointeger(mag.substr(16, 2));
                if (xx > 0) {
                    mname = 'setsnares';
                    showsnare(i, mname, xx, yy, "cast");
                }
                ;

                this.obj[j].damage = eff;
                this.obj[j].damaged = -4;
                if (lang == 0) this.obj[j].magicdamage = 'Капкана';
                if (lang == 1) this.obj[j].magicdamage = 'trap';
                somedamaged = true;
                someactive = true;
                return 0;
            }
            ;
            if (mname == 'fw3') {
                j = tointeger(mag.substr(3, 3));
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
                x = tointeger(mag.substr(6, 2));
                y = tointeger(mag.substr(8, 2));
                eff = tointeger(mag.substr(10, 8));
                this.obj[j].damage = eff;
                this.obj[j].damaged = -2;
                var cm = magicbookspells.length;
                for (x = 0; x < cm; x++) {
                    if (magicbookspells[x] == 'firewall') {
                        this.obj[j].magicdamage = magicbooknames[x];
                    }
                }
                somedamaged = true;
                someactive = true;
                return 0;
            }
            ;
            if (mname == 'st3') {
                j = tointeger(mag.substr(3, 3));
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
                x = tointeger(mag.substr(6, 2));
                y = tointeger(mag.substr(8, 2));
                eff = tointeger(mag.substr(10, 8));
                this.obj[j].damage = eff;
                this.obj[j].damaged = -10;
                var cm = magicbookspells.length;
                for (x = 0; x < cm; x++) {
                    if (magicbookspells[x] == 'stormcaller') {
                        this.obj[j].magicdamage = magicbooknames[x];
                    }
                }
                somedamaged = true;
                someactive = true;
                return 0;
            }
            ;
            if (mname == 'fws') {
                j = tointeger(mag.substr(3, 3));
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
                x = tointeger(mag.substr(6, 2));
                y = tointeger(mag.substr(8, 2));
                eff = tointeger(mag.substr(10, 8));
                this.obj[j].damage = eff;
                this.obj[j].damaged = -3;
                var cm = magicbookspells.length;
                this.obj[j].magicdamage = 'аура огня';
                somedamaged = true;
                someactive = true;
                this.calcdamage(j);
                if ((nowturnobj == j) && (this.obj[j].nownumber <= 0)) {
                    this.calcinitiative(-1);
                }
                return 0;
            }
            ;
            if (mname == 'css') {
                i = tointeger(mag.substr(3, 3));
                sh = tointeger(mag.substr(6, 3));
                this.obj[i]['shots'] = sh;
            }
            ;
            if (mname == 'ini') {
                i = tointeger(mag.substr(3, 3));
                this.obj[i]['maxinit']++;
            }
            ;
            if (mname == 'adp') {
                i = tointeger(mag.substr(3, 3));
                var addp = tointeger(mag.substr(6, 6));
                this.obj[i]['addpower'] = addp;
            }
            ;
            if (mname == 'fw2') {
                i = tointeger(mag.substr(3, 3));
                x = tointeger(mag.substr(6, 2));
                y = tointeger(mag.substr(8, 2));
                eff = tointeger(mag.substr(10, 6));
                k = 'F' + mag.substr(16, 2);
                if (firewalls[y * defxn + x] > 0) {
                    var ii = Math.floor(firewalls[y * defxn + x] / 100);
                    var mname = 'F' + addzero(firewalls[y * defxn + x] % 100, 2);
                    this.dispelmagic(ii, mname, magic[ii][mname]['effect']);
                }
                ;
                var time = 300;
                if ((this.obj[i].liquidflamebreath) || (this.obj[i].burningfootsteps)) {
                    time = 200;
                }
                addself(i, k, this.obj[i].nowinit + time, eff, y);

            }
            ;
            if (mname == 'snr') {
                i = tointeger(mag.substr(3, 3));
                x = tointeger(mag.substr(6, 2));
                y = tointeger(mag.substr(8, 2));
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
                current = i;
                if (x > 0) {
                    if (this.obj[i].magicmine) {
                        this.showmagic('magicmine' + current, this.obj[current].x, this.obj[current].y, x, y, 0, '', 0, current);
                    } else {
                        this.showmagic('setsnares' + current, this.obj[current].x, this.obj[current].y, x, y, 0, '', 0, current);
                    }
                    ;
                }
                ;
                lastattacker = current;


                this.obj[current].setmagic('');
                this.obj[current].attacker = false;
                if (x > 0) {
                    this.obj[current].destx = x;
                    this.obj[current].desty = y;
                } else {
                    this.obj[current].destx = defxn / 2;
                    this.obj[current].desty = 7;
                }
                ;
                this.obj[current].donow = "c";
                this.obj[current].active = true;
                someactive = true;
                if (this.obj[current].magicmine) {
                    switch (lang) {
                        case 0:
                            htmllog += '' + this.html('name', i) + ' установили магическую ловушку.' + this.html('end');
                            break;
                        case 1:
                            htmllog += '' + this.html('name', i) + ' set up a magical mine.' + this.html('end');
                            break;
                    }
                    ;
                } else {
                    switch (lang) {
                        case 0:
                            htmllog += '' + this.html('name', i) + ' установили капкан.' + this.html('end');
                            break;
                        case 1:
                            htmllog += '' + this.html('name', i) + ' set up a trap.' + this.html('end');
                            break;
                    }
                    ;

                }
                showtext();
                return 0;
            }
            ;
            if (mname == 'snu') {
                i = tointeger(mag.substr(3, 3));
                x = tointeger(mag.substr(6, 2));
                y = tointeger(mag.substr(8, 2));
                type = tointeger(mag.substr(10, 1));
                current = tointeger(mag.substr(11, 3));
                if ((x > 0) && (this.obj[current].setsnares)) {
                    mname = 'setsnares';
                    showsnare(current, mname, x, y, "cast");
                }
                ;
                switch (lang) {
                    case 0:
                        htmllog += '' + this.html('name', i) + ' попали в капкан и ';
                        if (type == 1) {
                            htmllog += 'он не сработал. ' + this.html('name', current) + ' теряют инициативу.' + this.html('end');
                        }
                        ;
                        if (type == 2) {
                            htmllog += 'прошли на <b>1</b> шаг меньше.' + this.html('end');
                        }
                        ;
                        if (type == 3) {
                            htmllog += 'прошли на <b>2</b> шага меньше.' + this.html('end');
                        }
                        ;
                        if (type == 4) {
                            htmllog += 'остановились.' + this.html('end');
                        }
                        ;
                        if (type == 5) {
                            htmllog += 'прошли на <b>3</b> шага меньше.' + this.html('end');
                        }
                        ;
                        if (type == 6) {
                            htmllog += 'прошли на <b>4</b> шага меньше.' + this.html('end');
                        }
                        ;
                        break;
                    case 1:
                        htmllog += '' + this.html('name', i) + ' walk into a trap ';
                        if (type == 1) {
                            htmllog += 'but it fails. ' + this.html('name', current) + ' lose initiative.' + this.html('end');
                        }
                        ;
                        if (type == 2) {
                            htmllog += 'and walk <b>1</b> tile less.' + this.html('end');
                        }
                        ;
                        if (type == 3) {
                            htmllog += 'and walk <b>2</b> tiles less.' + this.html('end');
                        }
                        ;
                        if (type == 4) {
                            htmllog += 'and stop.' + this.html('end');
                        }
                        ;
                        if (type == 5) {
                            htmllog += 'and walk <b>3</b> tiles less.' + this.html('end');
                        }
                        ;
                        if (type == 6) {
                            htmllog += 'and walk <b>4</b> tiles less.' + this.html('end');
                        }
                        ;

                        break;
                }
                ;
                if (command.substr(0, 1) == 'm') {
                    command = 'i0010000' + command;
                }
                ;
                showtext();
                return 0;

            }
            ;

            if (mname == 'fwl') {
                i = tointeger(mag.substr(3, 3));
                x = tointeger(mag.substr(6, 2));
                y = tointeger(mag.substr(8, 2));
                if (autoscroll) {
                    scrollto(x, y);
                }
                cost = tointeger(mag.substr(10, 3));
                current = i;
                lastattacker = current;
                var cm = magicbookspells.length;
                for (z = 0; z < cm; z++) {
                    if (magicbookspells[z] == 'firewall') {
                        magicdamage = magicbooknames[z];
                    }
                }
                somedamaged = true;
                this.obj[current].setmagic('');
                this.obj[current]['nowmanna'] -= cost;
                this.obj[current].attacker = false;
                this.obj[current].destx = x;
                this.obj[current].desty = y;
//		this.showmagic('firewall', this.obj[current].x, this.obj[current].y, x, y, 0, 0, 0, current);
                this.obj[current].donow = "c";
                this.obj[current].active = true;
                someactive = true;
                switch (lang) {
                    case 0:
                        okon = 'и';
                        if (this.obj[current].hero) okon = '';
                        htmllog += '' + this.html('name', i) + ' создал' + okon + ' огненную стену.' + this.html('end');
                        break;
                    case 1:

                        okon = '';
                        if (this.obj[current].hero) okon = 's';
                        htmllog += '' + this.html('name', i) + ' cast' + okon + ' fire wall.' + this.html('end');
                        break;
                }
                ;
                showtext();
                this.calcComs(magicdamage);

                return 0;
            }
            ;
            if (mname == 'clt') {
                i = tointeger(mag.substr(3, 3));
                x = tointeger(mag.substr(6, 2));
                y = tointeger(mag.substr(8, 2));
                if (autoscroll) {
                    scrollto(x, y);
                }
                cost = tointeger(mag.substr(10, 3));
                j = tointeger(mag.substr(13, 3));
                current = i;

                lastattacker = current;
                this.obj[i].chain = [];
//*		scr.chainlighting.user=i;
//		scr.chainlighting.xx=x;
//		scr.chainlighting.yy=y;
//		chainlighting.attacker = false;*/
                this.obj[i].chainc = 1;
                var cm = magicbookspells.length;
                for (z = 0; z < cm; z++) {
                    if (magicbookspells[z] == 'chainlighting') {
                        magicdamage = magicbooknames[z];
                    }
                }
                somedamaged = true;
                this.obj[current].setmagic('chainlighting');
                this.obj[current]['nowmanna'] -= cost;
                this.obj[current].attacker = false;
                this.obj[current].destx = x;
                this.obj[current].desty = y;
                this.showmagic('chainlighting', this.obj[current].x, this.obj[current].y, x, y, j, 0, 0, current);
                this.obj[current].donow = "c";
                this.obj[current].active = true;
                someactive = true;
                this.calcComs(magicdamage);
                return 0;
            }
            ;

            if (mname == 'car') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                x1 = tointeger(mag.substr(9, 2));
                y1 = tointeger(mag.substr(11, 2));
                x2 = tointeger(mag.substr(13, 2));
                y2 = tointeger(mag.substr(15, 2));

                this.obj[i].destx = x1;
                this.obj[i].desty = y1;
                ndestc = 2;
                ndestx[0] = this.obj[i].destx;
                ndesty[0] = this.obj[i].desty;
                ndestx[1] = x2;
                ndesty[1] = y2;
                ndestx[2] = this.obj[j].x;
                ndesty[2] = this.obj[j].y;

                this.obj[i].destxx = this.obj[j].x;
                this.obj[i].destyy = this.obj[j].y;
                this.obj[i].carryit = j;
                someactive = true;
                this.obj[i].donow = 'm';
                this.obj[i].active = true;
                return 0;
            }
            ;
            if (mname == 'def') {
                i = tointeger(mag.substr(3, 3));
                init = tointeger(mag.substr(6, 6));
                eff = tointeger(mag.substr(12, 6));
                addself(i, mname, init, eff);
                if ((eff == 0) && (init == 0)) return 0;
                removeText(i)
                switch (lang) {
                    case 0:
                        htmllog += '' + this.html('name', i) + ' - оборона.' + this.html('end');
                        break;
                    case 1:
                        htmllog += '' + this.html('name', i) + ' defend.' + this.html('end');
                        break;
                }
                ;
                showtext();
                showdefwait(i, 'defend', -1);
                return 0;
            }
            ;

            if (mname == 'prp') {
                i = tointeger(mag.substr(3, 3));
                eff = tointeger(mag.substr(6, 3));
                addself(i, mname, 100000, eff);
                return 0;
            }
            ;
            if (mname == 'zat') {
                i = tointeger(mag.substr(3, 3));
                eff = tointeger(mag.substr(6, 3));
                addself(i, mname, 100000, eff);
                return 0;
            }
            ;


            if (mname == 'irr') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                eff = tointeger(mag.substr(9, 3));
                init = tointeger(mag.substr(12, 6));
                addself(j, mname, init, eff);
                return 0;
            }
            ;
            if (mname == 'enr') {
                i = tointeger(mag.substr(3, 3));
                init = tointeger(mag.substr(6, 6));
                eff = tointeger(mag.substr(12, 6));
                this.obj[i]['attack'] += eff;
                addself(i, mname, init, eff);
                switch (lang) {
                    case 0:
                        htmllog += '' + this.html('name', i) + ' впали в ярость.' + this.html('end');
                        break;
                    case 1:
                        htmllog += '' + this.html('name', i) + ' get enraged.' + this.html('end');
                        break;
                }
                ;
                showtext();
                return 0;
            }
            ;
            if (mname == 'mfc') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                eff = tointeger(mag.substr(9, 3));
                turns = tointeger(mag.substr(12, 6));
                init = this.obj[i].nowinit + turns;
                mname2 = 'mf' + this.obj[i].owner;
                addself(j, mname2, init, eff);
                switch (lang) {
                    case 0:
                        htmllog += '' + this.html('name', i) + ' устанавливает метку природы на ' + this.html('name', j) + '.' + this.html('end');
                        break;
                    case 1:
                        htmllog += '' + this.html('name', i) + ' are setting mark of Nature at ' + this.html('name', j) + '.' + this.html('end');
                        break;
                }
                ;
                showtext();
                return 0;
            }
            ;


            if (mname == 'blt') {
                i = tointeger(mag.substr(3, 3));
                init = tointeger(mag.substr(6, 6));
                eff = tointeger(mag.substr(12, 6));
                this.obj[i]['attack'] += eff;
                addself(i, mname, init, eff);
                switch (lang) {
                    case 0:
                        htmllog += '' + this.html('name', i) + ' - жаждут ещё крови!' + this.html('end');
                        break;
                    case 1:
                        htmllog += '' + this.html('name', i) + ' feel bloodlusty.' + this.html('end');
                        break;
                }
                ;
                showtext();
                return 0;
            }
            ;
            if (mname == 'ra2') {

                i = tointeger(mag.substr(3, 3));
                eff = tointeger(mag.substr(6, 4));
                plus = tointeger(mag.substr(10, 3));
                dam = tointeger(mag.substr(13, 5));
                if (magic[i]['rag']) {
                    plus = magic[i]['rag']['effect'] - eff;
                }
                ;
                init = 100000;
                addself(i, 'rag', init, eff);
                if (plus != 0)
                    switch (lang) {
                        case 0:
                            htmllog += this.html('name', i) + ' поглощают ' + this.html('bold', dam) + ' урона Яростью крови (' + this.html('bold', Math.abs(plus)) + ' ярости потеряно).' + this.html('end');
                            break;
                        case 1:
                            htmllog += this.html('name', i) + ' dampen ' + this.html('bold', dam) + ' damage with Tribal spirit. (' + this.html('bold', Math.abs(plus)) + ' spirit lost).' + this.html('end');
                            break;
                    }
                ;

                showtext();
                return 0;
            }
            ;
            if (mname == 'raa') {
                i = tointeger(mag.substr(3, 3));
                owner = tointeger(mag.substr(6, 3));
                plus = tointeger(mag.substr(9, 5));

                init = 100000;
                var mname2 = 'rag';
                var len = this.obj_array.length;
                for (var k1 = 0; k1 < len; k1++) {
                    j = this.obj_array[k1];
                    if ((owner == this.obj[j]['owner']) && (!this.obj[j]['hero']) && (!this.obj[j]['warmachine']) && (magic[j]['rag']) && (this.obj[j]['nownumber'] > 0)) {
                        eff = magic[j]['rag']['effect'];
                        if (eff == undefined) eff = 0;
                        eff += plus;
                        addself(j, mname2, init, eff);
                    }
                    ;
                }
                ;
                if (plus != 0)
                    switch (lang) {
                        case 0:
                            if (plus > 0)
                                htmllog += 'Отряды ' + this.html('name', i) + ' получают ' + this.html('bold', plus) + ' Ярости крови.' + this.html('end');
                            else
                                htmllog += 'Отряды ' + this.html('name', i) + ' теряют ' + this.html('bold', Math.abs(plus)) + ' Ярости крови.' + this.html('end');
                            break;
                        case 1:
                            if (plus > 0)
                                htmllog += '' + this.html('name', i) + '` troops receive ' + this.html('bold', plus) + ' Tribal spirit.' + this.html('end');
                            else
                                htmllog += '' + this.html('name', i) + '` troops lose ' + this.html('bold', Math.abs(plus)) + ' Tribal spirit.' + this.html('end');
                            break;
                    }
                ;
                showtext();

                return 0;
            }
            ;

            if (mname == 'rag') {
                i = tointeger(mag.substr(3, 3));
                eff = tointeger(mag.substr(6, 5));
                plus = tointeger(mag.substr(11, 4));

                init = 100000;
                addself(i, mname, init, eff);
                if (plus != 0)
                    switch (lang) {
                        case 0:
                            if (plus > 0)
                                htmllog += '' + this.html('name', i) + ' получают ' + this.html('bold', plus) + ' Ярости крови.' + this.html('end');
                            else
                                htmllog += '' + this.html('name', i) + ' теряют ' + this.html('bold', Math.abs(plus)) + ' Ярости крови.' + this.html('end');
                            break;
                        case 1:
                            if (plus > 0)
                                htmllog += '' + this.html('name', i) + ' receive ' + this.html('bold', plus) + ' Tribal spirit.' + this.html('end');
                            else
                                htmllog += '' + this.html('name', i) + ' lose ' + this.html('bold', Math.abs(plus)) + ' Tribal spirit.' + this.html('end');
                            break;
                    }
                ;

                showtext();
                return 0;
            }
            ;
            if (mname == 'wfr') {
                i = tointeger(mag.substr(3, 3));
                magic[i]['wfr'] = Array();
                magic[i]['wfr']['effect'] = 1;
                //
                magic[i]['wfr']['nowinit'] = 100000;
                //
            }
            ;
            if (mname == 'aas') {
                i = tointeger(mag.substr(3, 3));
                switch (lang) {
                    case 0:
                        htmllog += '' + this.html('name', i) + ' используют умение ' + this.html('bold', 'Бойня') + '.' + this.html('end');
                        break;
                    case 1:
                        htmllog += '' + this.html('name', i) + ' perform ' + this.html('bold', 'slash') + '.' + this.html('end');
                        break;
                }
                ;

                var init = this.obj[i]['nowinit'] + 300;
                addself(i, 'cdn', init, 1);

                showtext();
                this.calcComs();
            }
            ;
            if (mname == 'cbl') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                switch (lang) {
                    case 0:
                        htmllog += '' + this.html('name', i) + ' оглушают ' + this.html('name', j) + '.' + this.html('end');
                        break;
                    case 1:
                        htmllog += '' + this.html('name', i) + ' perform stun at ' + this.html('name', j) + '.' + this.html('end');
                        break;
                }
                ;
                showtext();
                this.calcComs();
            }
            ;
            if (mname == 'flc') {
                i = tointeger(mag.substr(3, 3));
                switch (lang) {
                    case 0:
                        htmllog += '' + this.html('name', i) + ' используют умение ' + this.html('bold', 'Зверская атака') + '.' + this.html('end');
                        break;
                    case 1:
                        htmllog += '' + this.html('name', i) + ' perform ' + this.html('bold', 'feral charge') + '.' + this.html('end');
                        break;
                }
                ;
                var init = this.obj[i]['nowinit'] + 300;
                addself(i, 'cdn', init, 1);

                showtext();
            }
            ;


            if (mname == 'tel') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
                var xn = tointeger(mag.substr(9, 2));
                var yn = tointeger(mag.substr(11, 2));

                if ((magic[j]['inv']) && (magic[j]['inv']['effect'] == 1) && ((playero == 0) || (this.obj[i].getside() != this.obj[heroes[playero]]['side'])) && (!battle_ended)) {
                    xn = -5;
                    yn = -5;
                } else {
                    this.obj[i].destx = this.obj[j].x;
                    this.obj[i].desty = this.obj[j].y;

                }


                cost = tointeger(mag.substr(13, 2));
                current = i;
                this.obj[current].setmagic('teleport');
                this.obj[current]['nowmanna'] -= cost;
                this.obj[current].attacker = false;
                /*		scr.teleport.cel=j;
                        scr.teleport.xn=xn;
                        scr.teleport.yn=yn;*/
                this.showmagic('teleport', xn, yn, this.obj[j].x, this.obj[j].y, j, 0, 0, current);

                var bigx = this.obj[j]['big'];
                var bigy = this.obj[j]['big'];
                if (this.obj[j]['bigx']) bigx = 1;
                if (this.obj[j]['bigy']) bigy = 1;

                for (x = 0; x <= bigx; x++) {
                    for (y = 0; y <= bigy; y++) {
                        if ((this.obj[current].x - (this.obj[j].x + x)) * (this.obj[current].x - (this.obj[j].x + x)) + (this.obj[current].y - (this.obj[j].y + y)) * (this.obj[current].y - (this.obj[j].y + y)) < (this.obj[current].x - this.obj[current].destx) * (this.obj[current].x - this.obj[current].destx) + (this.obj[current].y - this.obj[current].desty) * (this.obj[current].y - this.obj[current].desty)) {
                            this.obj[current].destx = this.obj[j].x + x;
                            this.obj[current].desty = this.obj[j].y + y;
                        }
                    }
                }
                this.obj[current].donow = "c";
                this.obj[current].active = true;
                someactive = true;
                switch (lang) {
                    case 0:
                        htmllog += this.html('name', i) + ' телепортировал ' + this.html('name', j) + '.' + this.html('end');
                        break;
                    case 1:
                        htmllog += this.html('name', i) + ' teleports ' + this.html('name', j) + '.' + this.html('end');
                        break;
                }
                ;
                showtext();
                return 0;
            }
            ;


            if (mname == 'rcr') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
                cost = tointeger(mag.substr(9, 2));
                turns = tointeger(mag.substr(11, 2));
                init = turns * 100 + this.obj[i].nowinit;
                eff = tointeger(mag.substr(13, 5));
                current = i;
//		if (eval('scr.rallingcry'+mc)==undefined){mc='';};
                this.obj[current].setmagic('rallingcry', mc);
                this.obj[current]['nowmanna'] -= cost;
                this.obj[current].attacker = false;
                this.obj[current].destx = this.obj[j].x;
                this.obj[current].desty = this.obj[j].y;
                this.showmagic('rallingcry', this.obj[current].x, this.obj[current].y, this.obj[j].x, this.obj[j].y, j, mc, 0, current);
                var bigx = this.obj[j]['big'];
                var bigy = this.obj[j]['big'];
                if (this.obj[j]['bigx']) bigx = 1;
                if (this.obj[j]['bigy']) bigy = 1;

                for (x = 0; x <= bigx; x++) {
                    for (y = 0; y <= bigy; y++) {
                        if ((this.obj[current].x - (this.obj[j].x + x)) * (this.obj[current].x - (this.obj[j].x + x)) + (this.obj[current].y - (this.obj[j].y + y)) * (this.obj[current].y - (this.obj[j].y + y)) < (this.obj[current].x - this.obj[current].destx) * (this.obj[current].x - this.obj[current].destx) + (this.obj[current].y - this.obj[current].desty) * (this.obj[current].y - this.obj[current].desty)) {
                            this.obj[current].destx = this.obj[j].x + x;
                            this.obj[current].desty = this.obj[j].y + y;
                        }
                    }
                }
                this.obj[current].donow = "c";
                this.obj[current].active = true;
                someactive = true;
                this.obj[j]['moraleaddon'] += eff;
                addself(j, 'rcr', init, eff);
                if (cost > 0) {
                    switch (lang) {
                        case 0:
                            htmllog += this.html('name', i) + ' использует ' + this.html('bold', 'Объединяющий клич') + '.' + this.html('end');
                            break;
                        case 1:
                            htmllog += this.html('name', i) + ' performs ' + this.html('bold', 'Tribal supremacy') + ' ritual.' + this.html('end');
                            break;
                    }
                    ;
                }
                ;
                showtext();
                return 0;
            }
            ;
            if (mname == 'bcr') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
                cost = tointeger(mag.substr(9, 2));
                turns = tointeger(mag.substr(11, 2));
                init = turns * 100 + this.obj[i].nowinit;
                eff = tointeger(mag.substr(13, 5));
                current = i;
//		if (eval('scr.battlecry'+mc)==undefined){mc='';};
                this.obj[current].setmagic('battlecry', mc);
                this.obj[current]['nowmanna'] -= cost;
                this.obj[current].attacker = false;
                this.obj[current].destx = this.obj[j].x;
                this.obj[current].desty = this.obj[j].y;
                this.showmagic('battlecry', this.obj[current].x, this.obj[current].y, this.obj[j].x, this.obj[j].y, j, mc, 0, current);
                var bigx = this.obj[j]['big'];
                var bigy = this.obj[j]['big'];
                if (this.obj[j]['bigx']) bigx = 1;
                if (this.obj[j]['bigy']) bigy = 1;
                for (x = 0; x <= bigx; x++) {
                    for (y = 0; y <= bigy; y++) {
                        if ((this.obj[current].x - (this.obj[j].x + x)) * (this.obj[current].x - (this.obj[j].x + x)) + (this.obj[current].y - (this.obj[j].y + y)) * (this.obj[current].y - (this.obj[j].y + y)) < (this.obj[current].x - this.obj[current].destx) * (this.obj[current].x - this.obj[current].destx) + (this.obj[current].y - this.obj[current].desty) * (this.obj[current].y - this.obj[current].desty)) {
                            this.obj[current].destx = this.obj[j].x + x;
                            this.obj[current].desty = this.obj[j].y + y;
                        }
                    }
                }
                this.obj[current].donow = "c";
                this.obj[current].active = true;
                someactive = true;
                this.obj[j]['attackaddon'] += eff;
                this.obj[j]['speedaddon'] += 1;
                addself(j, 'bcr', init, eff);
                if (cost > 0) {
                    switch (lang) {
                        case 0:
                            htmllog += this.html('name', i) + ' использует ' + this.html('bold', 'Боевой клич') + '.' + this.html('end');
                            break;
                        case 1:
                            htmllog += this.html('name', i) + ' performs ' + this.html('bold', 'Battle cry') + ' ritual.' + this.html('end');
                            break;
                    }
                    ;
                }
                ;
                showtext();
                return 0;
            }
            ;

            if (mname == 'fmr') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
                cost = tointeger(mag.substr(9, 2));
                current = i;
//		if (eval('scr.fearmyroar'+mc)==undefined){mc='';};
                this.obj[current].setmagic('fearmyroar', mc);
                this.obj[current]['nowmanna'] -= cost;
                this.obj[current].attacker = false;
                this.obj[current].destx = this.obj[j].x;
                this.obj[current].desty = this.obj[j].y;
                this.showmagic('fearmyroar', this.obj[current].x, this.obj[current].y, this.obj[j].x, this.obj[j].y, j, mc, 0, current);
                var bigx = this.obj[j]['big'];
                var bigy = this.obj[j]['big'];
                if (this.obj[j]['bigx']) bigx = 1;
                if (this.obj[j]['bigy']) bigy = 1;
                for (x = 0; x <= bigx; x++) {
                    for (y = 0; y <= bigy; y++) {
                        if ((this.obj[current].x - (this.obj[j].x + x)) * (this.obj[current].x - (this.obj[j].x + x)) + (this.obj[current].y - (this.obj[j].y + y)) * (this.obj[current].y - (this.obj[j].y + y)) < (this.obj[current].x - this.obj[current].destx) * (this.obj[current].x - this.obj[current].destx) + (this.obj[current].y - this.obj[current].desty) * (this.obj[current].y - this.obj[current].desty)) {
                            this.obj[current].destx = this.obj[j].x + x;
                            this.obj[current].desty = this.obj[j].y + y;
                        }
                    }
                }
                this.obj[current].donow = "c";
                this.obj[current].active = true;
                someactive = true;
                if (cost > 0) {
                    switch (lang) {
                        case 0:
                            htmllog += this.html('name', i) + ' использует ' + this.html('bold', 'Устрашающий рык') + '.' + this.html('end');
                            break;
                        case 1:
                            htmllog += this.html('name', i) + ' performs ' + this.html('bold', 'Ancestral wrath') + ' ritual.' + this.html('end');
                            break;
                    }
                    ;
                }
                ;
                showtext();
                return 0;
            }
            ;
            if (mname == 'woc') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
                cost = tointeger(mag.substr(9, 2));
                current = i;
                this.obj[current]['nowmanna'] -= cost;
                if (cost > 0) {
                    switch (lang) {
                        case 0:
                            htmllog += this.html('name', i) + ' использует ' + this.html('bold', 'Слово вождя') + '.' + this.html('end');
                            break;
                        case 1:
                            htmllog += this.html('name', i) + ' performs ' + this.html('bold', 'Lessons of history') + ' ritual.' + this.html('end');
                            break;
                    }
                    ;
                }
                ;
                showtext();
                return 0;
            }
            ;
            if (mname == 'ooc') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
                current = i;
                switch (lang) {
                    case 0:
                        htmllog += this.html('name', i) + ' приказывают ' + this.html('name', j) + ' быстрее идти в бой.' + this.html('end');
                        break;
                    case 1:
                        htmllog += this.html('name', i) + ' bully ' + this.html('name', j) + ' to act faster.' + this.html('end');
                        break;
                }
                ;
                showtext();
                return 0;
            }
            ;

            if (mname == 'fst') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
                cost = tointeger(mag.substr(9, 2));
                turns = tointeger(mag.substr(11, 2));
                if (turns == 0) {
                    turns = 0.5;
                }
                init = turns * 100 + this.obj[i].nowinit;
                eff = tointeger(mag.substr(13, 5));
                current = i;
//		if (eval('scr.fast'+mc)==undefined){mc='';};
                this.obj[current].setmagic('fast', mc);
                if ((mc == '') || (mc == 1)) {
                    this.obj[current]['nowmanna'] -= cost;
                }
                ;
                this.obj[current].attacker = false;
                this.obj[current].destx = this.obj[j].x;
                this.obj[current].desty = this.obj[j].y;
                this.showmagic('fast', this.obj[current].x, this.obj[current].y, this.obj[j].x, this.obj[j].y, j, mc, 0, current);
                var bigx = this.obj[j]['big'];
                var bigy = this.obj[j]['big'];
                if (this.obj[j]['bigx']) bigx = 1;
                if (this.obj[j]['bigy']) bigy = 1;
                for (x = 0; x <= bigx; x++) {
                    for (y = 0; y <= bigy; y++) {
                        if ((this.obj[current].x - (this.obj[j].x + x)) * (this.obj[current].x - (this.obj[j].x + x)) + (this.obj[current].y - (this.obj[j].y + y)) * (this.obj[current].y - (this.obj[j].y + y)) < (this.obj[current].x - this.obj[current].destx) * (this.obj[current].x - this.obj[current].destx) + (this.obj[current].y - this.obj[current].desty) * (this.obj[current].y - this.obj[current].desty)) {
                            this.obj[current].destx = this.obj[j].x + x;
                            this.obj[current].desty = this.obj[j].y + y;
                        }
                    }
                }
                this.obj[current].donow = "c";
                this.obj[current].active = true;
                someactive = true;

                addself(j, 'fst', init, eff);
                if (turns > 0) {
                    switch (lang) {
                        case 0:
                            htmllog += this.html('name', i) + ' наложил заклятие ускорение на ' + this.html('name', j) + ' на ' + this.html('bold', turns) + ' ходов.' + this.html('end');
                            break;
                        case 1:
                            if (this.obj[i].hero) {
                                okon = 's';
                            } else {
                                okon = '';
                            }
                            ;
                            htmllog += this.html('name', i) + ' cast' + okon + ' Rapid on ' + this.html('name', j) + ' for ' + this.html('bold', turns) + ' turns.' + this.html('end');
                            break;
                    }
                    ;
                } else {
                    switch (lang) {
                        case 0:
                            htmllog += this.html('name', i) + ' - не удалось наложить заклятие ускорение на ' + this.html('name', j) + '.' + this.html('end');
                            break;
                        case 1:
                            htmllog += this.html('name', i) + ' - fails to cast Rapid on ' + this.html('name', j) + '.' + this.html('end');
                            break;
                    }
                    ;
                }
                ;
                showtext();
                return 0;
            }
            ;
            if (mname == 'wof') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
                eff = tointeger(mag.substr(9, 3));
                turns = tointeger(mag.substr(12, 3));
                if (turns == 0) {
                    turns = 0.5;
                }
                init = turns * 100 + this.obj[i].nowinit;
                current = i;
                a = '';
                if (eff < 0) a = 'un';
                this.obj[current].setmagic('djin' + a + 'luck', '');
                if (!magic[current]['usd']) {
                    magic[current]['usd'] = Array();
                    magic[current]['usd']['effect'] = 0;
                }
                ;
                addself(current, 'usd', 100000, magic[current]['usd']['effect'] + 1);
                this.obj[current].attacker = false;
                this.obj[current].destx = this.obj[j].x;
                this.obj[current].desty = this.obj[j].y;
                this.showmagic('djin' + a + 'luck', this.obj[current].x, this.obj[current].y, this.obj[j].x, this.obj[j].y, j, '', 0, current);
                this.obj[current].donow = "c";
                this.obj[current].active = true;
                someactive = true;
                addself(j, 'wof', init, eff);
                if (turns > 0) {
                    switch (lang) {
                        case 0:
                            if (eff > 0) {
                                htmllog += this.html('name', i) + ' добавили ' + this.html('bold', eff) + ' удачи для ' + this.html('name', j) + ' на ' + this.html('bold', turns) + ' ходов.' + this.html('end');
                            } else {
                                htmllog += this.html('name', i) + ' забрали ' + this.html('bold', eff) + ' удачи у ' + this.html('name', j) + ' на ' + this.html('bold', turns) + ' ходов.' + this.html('end');
                            }
                            ;
                            break;
                        case 1:
                            if (eff > 0) {
                                htmllog += this.html('name', i) + ' increase the luck of ' + this.html('name', j) + ' by ' + this.html('bold', eff) + ' for ' + this.html('bold', turns) + ' turns.' + this.html('end');
                            } else {
                                htmllog += this.html('name', i) + ' decrease the luck of ' + this.html('name', j) + ' by ' + this.html('bold', eff) + ' for ' + this.html('bold', turns) + ' turns.' + this.html('end');
                            }
                            ;
                            break;
                    }
                    ;
                } else {
                    switch (lang) {
                        case 0:
                            htmllog += this.html('name', i) + ' - не удалось изменить удачу у ' + this.html('name', j) + '.' + this.html('end');
                            break;
                        case 1:
                            htmllog += this.html('name', i) + ' fail to alter the luck of ' + this.html('name', j) + '.' + this.html('end');
                            break;
                    }
                    ;
                }
                ;
                showtext();
                return 0;
            }
            ;
            if (mname == 'seg') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
                cost = tointeger(mag.substr(9, 2));
                turns = tointeger(mag.substr(11, 2));
                if (turns == 0) {
                    turns = 0.5;
                }

                var init = this.obj[i]['nowinit'] + 300;
                addself(i, 'cdn', init, 1);

                init = turns * 100 + this.obj[i].nowinit;
                eff = tointeger(mag.substr(13, 3));
                effm = tointeger(mag.substr(16, 2));
                current = i;
//		if (eval('scr.skyandearth'+mc)==undefined){mc='';};
                this.obj[current].setmagic('skyandearth', mc);
                if ((mc == '') || (mc == 1)) {
                    this.obj[current]['nowmanna'] -= cost;
                }
                ;
                this.obj[current].attacker = false;
                this.obj[current].destx = this.obj[j].x;
                this.obj[current].desty = this.obj[j].y;
                this.showmagic('skyandearth', this.obj[current].x, this.obj[current].y, this.obj[j].x, this.obj[j].y, j, mc, 0, current);
                var bigx = this.obj[j]['big'];
                var bigy = this.obj[j]['big'];
                if (this.obj[j]['bigx']) bigx = 1;
                if (this.obj[j]['bigy']) bigy = 1;
                for (x = 0; x <= bigx; x++) {
                    for (y = 0; y <= bigy; y++) {
                        if ((this.obj[current].x - (this.obj[j].x + x)) * (this.obj[current].x - (this.obj[j].x + x)) + (this.obj[current].y - (this.obj[j].y + y)) * (this.obj[current].y - (this.obj[j].y + y)) < (this.obj[current].x - this.obj[current].destx) * (this.obj[current].x - this.obj[current].destx) + (this.obj[current].y - this.obj[current].desty) * (this.obj[current].y - this.obj[current].desty)) {
                            this.obj[current].destx = this.obj[j].x + x;
                            this.obj[current].desty = this.obj[j].y + y;
                        }
                    }
                }
                this.obj[current].donow = "c";
                this.obj[current].active = true;
                someactive = true;
                addself(j, 'seg', init, eff);
                if (eff < 0) addself(j, 'pss', init, effm * this.obj[current].nownumber);

                if (turns > 0) {
                    switch (lang) {
                        case 0:
                            if (this.obj[i].hero) {
                                okon = '';
                            } else {
                                okon = 'и';
                            }
                            ;
                            htmllog += this.html('name', i) + ' наложил' + okon + ' заклятие "Небо и земля" на ' + this.html('name', j) + ' на ' + this.html('bold', turns) + ' хода.' + this.html('end');
                            break;
                        case 1:
                            if (this.obj[i].hero) {
                                okon = 's';
                            } else {
                                okon = '';
                            }
                            ;
                            htmllog += this.html('name', i) + ' cast' + okon + ' Earth and Sky on ' + this.html('name', j) + ' for ' + this.html('bold', turns) + ' turns.' + this.html('end');
                            break;
                    }
                    ;
                } else {
                    switch (lang) {
                        case 0:
                            htmllog += this.html('name', i) + ' - не удалось наложить заклятие "Небо и земля" на ' + this.html('name', j) + '.' + this.html('end');
                            break;
                        case 1:
                            htmllog += this.html('name', i) + ' - fails to cast Earth and Sky on ' + this.html('name', j) + '.' + this.html('end');
                            break;
                    }
                    ;
                }
                ;
                showtext();
                return 0;
            }
            ;


            if (mname == 'ant') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
                turns = tointeger(mag.substr(9, 3));
                eff = tointeger(mag.substr(12, 3));
                cost = tointeger(mag.substr(15, 3));
                if (turns == 0) {
                    turns = 0.5;
                }
                if (i == 0) {
//			var sinit=this.obj[j].selfmagic.substr(this.obj[j].selfmagic.indexOf('ant')+3,6); ???
//			addself(j, 'ant', sinit, eff); ????
                    addself(j, 'ant', magic[j]['ant']['nowinit'], eff);
                    return 0;
                }
                ;
                init = turns * 100 + this.obj[i].nowinit;
                current = i;
                this.obj[current].setmagic('antimagic', '');
                this.obj[current]['nowmanna'] -= cost;
                this.obj[current].attacker = false;
                this.obj[current].destx = this.obj[j].x;
                this.obj[current].desty = this.obj[j].y;
                this.showmagic('antimagic', this.obj[current].x, this.obj[current].y, this.obj[j].x, this.obj[j].y, j, '', 0, current);
                var bigx = this.obj[j]['big'];
                var bigy = this.obj[j]['big'];
                if (this.obj[j]['bigx']) bigx = 1;
                if (this.obj[j]['bigy']) bigy = 1;
                for (x = 0; x <= bigx; x++) {
                    for (y = 0; y <= bigy; y++) {
                        if ((this.obj[current].x - (this.obj[j].x + x)) * (this.obj[current].x - (this.obj[j].x + x)) + (this.obj[current].y - (this.obj[j].y + y)) * (this.obj[current].y - (this.obj[j].y + y)) < (this.obj[current].x - this.obj[current].destx) * (this.obj[current].x - this.obj[current].destx) + (this.obj[current].y - this.obj[current].desty) * (this.obj[current].y - this.obj[current].desty)) {
                            this.obj[current].destx = this.obj[j].x + x;
                            this.obj[current].desty = this.obj[j].y + y;
                        }
                    }
                }
                this.obj[current].donow = "c";
                this.obj[current].active = true;
                someactive = true;
                addself(j, 'ant', init, eff);
                switch (lang) {
                    case 0:
                        htmllog += this.html('name', i) + ' наложил заклятие антимагия на ' + this.html('name', j) + ' на ' + this.html('bold', turns) + ' ходов.' + this.html('end');
                        break;
                    case 1:
                        htmllog += this.html('name', i) + ' casts Anti-magic on ' + this.html('name', j) + ' for ' + this.html('bold', turns) + ' turns.' + this.html('end');
                        break;
                }
                ;
                showtext();
                return 0;
            }
            ;
            if (mname == 'spc') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                var mg = mag.substr(9, 3);
                var init = tointeger(mag.substr(12, 6));
                if (autoscroll) {
                    scrollto(this.obj[i].x, this.obj[i].y);
                }
                addself(i, mg, init, magic[j][mg]['effect']);
                switch (lang) {
                    case 0:
                        htmllog += this.html('name', i) + ' Духовной связью переносят эффект заклинания ' + this.html('bold', getmagicname(mg)) + ' у ' + this.html('name', j) + '.' + this.html('end');
                        break;
                    case 1:
                        htmllog += this.html('name', i) + ' receive the effect of ' + this.html('bold', getmagicname(mg)) + ' from ' + this.html('name', j) + ' through spirit ties.' + this.html('end');
                        break;
                }
                ;
                showtext();
                return 0;
            }
            ;


            if (mname == 'dsp') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
                cost = tointeger(mag.substr(9, 2));
                eff = mag.substr(11, 3);
                current = i;
                if (eff != 'non') {
                    addself(j, eff, 0, 0);
                    if (eff == 'hy2') {
                        this.obj[j]['hypned'] = -1;
                        this.obj[j]['hypned1'] = -1;
                    }
                    ;
                    if (eff == 'hyp') {
                        addself(j, 'hy3', 0, 0);
                    }
                    ;
                }
                ;
                if (current == -1) return 0;
                if (current == -3) {
                    switch (lang) {
                        case 0:
                            htmllog += 'Волны обновления сняли заклятие ' + getmagicname(eff) + ' у ' + this.html('name', j) + '.' + this.html('end');
                            break;
                        case 1:
                            htmllog += 'Waves of renewal remove ' + getmagicname(eff) + ' from ' + this.html('name', j) + '.' + this.html('end');
                            break;
                    }
                    ;
                }
                ;
                if (current == 0) {
                    switch (lang) {
                        case 0:
                            htmllog += 'Руна экзорцизма сняла заклятие ' + getmagicname(eff) + ' у ' + this.html('name', j) + '.' + this.html('end');
                            break;
                        case 1:
                            htmllog += 'Rune of exorcism dispels ' + getmagicname(eff) + ' from ' + this.html('name', j) + '.' + this.html('end');

                            break;
                    }
                    ;
                }
                ;

                if (current > 0) {
                    if (cost == -1) mcounter--;
                    if (cost != -1) {
                        this.obj[current].setmagic('dispel', mc);
                        if (((mc == '') || (mc == 1)) && (cost > 0)) {
                            this.obj[current]['nowmanna'] -= cost;
                        }
                        ;

                        if (cost >= 0) {
                            this.showmagic('dispel', this.obj[current].x, this.obj[current].y, this.obj[j].x, this.obj[j].y, j, mc, 0, current);
                        }
                        ;
                        if (((this.obj[current].dispel != undefined) || (this.obj[current].mdispel != undefined)) && (this.obj[current].active != true)) {
                            this.obj[current].attacker = false;
                            this.obj[current].destx = this.obj[j].x;
                            this.obj[current].desty = this.obj[j].y;
                            var bigx = this.obj[j]['big'];
                            var bigy = this.obj[j]['big'];
                            if (this.obj[j]['bigx']) bigx = 1;
                            if (this.obj[j]['bigy']) bigy = 1;
                            for (x = 0; x <= bigx; x++) {
                                for (y = 0; y <= bigy; y++) {
                                    if ((this.obj[current].x - (this.obj[j].x + x)) * (this.obj[current].x - (this.obj[j].x + x)) + (this.obj[current].y - (this.obj[j].y + y)) * (this.obj[current].y - (this.obj[j].y + y)) < (this.obj[current].x - this.obj[current].destx) * (this.obj[current].x - this.obj[current].destx) + (this.obj[current].y - this.obj[current].desty) * (this.obj[current].y - this.obj[current].desty)) {
                                        this.obj[current].destx = this.obj[j].x + x;
                                        this.obj[current].desty = this.obj[j].y + y;
                                    }
                                }
                            }
                            if (this.obj[current].active != true) {
                                this.obj[current].donow = "c";
                                this.obj[current].active = true;
                                someactive = true;
                            }
                        } else {
                        }
                        ;
                    }
                    ;
                    var nameh = this.html('name', i);
                    if (eff != 'nom') {
                        if (eff != 'non') {
                            switch (lang) {
                                case 0:
                                    htmllog += nameh + ' снял заклятие ' + this.html('bold', getmagicname(eff)) + ' у ' + this.html('name', j) + '.' + this.html('end');
                                    break;
                                case 1:
                                    htmllog += nameh + ' remove(s) the ' + this.html('bold', getmagicname(eff)) + ' spell from ' + this.html('name', j) + '.' + this.html('end');
                                    break;
                            }
                            ;
                        } else {
                            switch (lang) {
                                case 0:
                                    htmllog += nameh + ' не удалось ничего рассеять у ' + this.html('name', j) + '.' + this.html('end');
                                    break;
                                case 1:
                                    htmllog += nameh + ' fail(s) to remove any spells from ' + this.html('name', j) + '.' + this.html('end');
                                    break;
                            }
                            ;
                        }
                        ;
                    }
                    ;

                }
                ;

                showtext();
                return 0;
            }
            ;

            if (mname == 'ds2') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
                eff = mag.substr(9, 3);
                init = tointeger(mag.substr(12, 6));
                current = i;
                if (eff != 'non') {
                    addself(j, eff, init, magic[j][eff]['effect']);
                }
                ;
                if (current == -1) return 0;


                var nameh = this.html('name', i);
                switch (lang) {
                    case 0:
                        if (this.obj[i].hero) {
                            okon = '';
                        } else {
                            okon = 'и';
                        }
                        ;
                        htmllog += nameh + ' частично рассеял' + okon + ' заклятие ' + getmagicname(eff) + ' у ' + this.html('name', j) + '.' + this.html('end');
                        break;
                    case 1:
                        htmllog += nameh + ' partially dismiss the ' + getmagicname(eff) + ' spell from ' + this.html('name', j) + '.' + this.html('end');
                        break;
                }
                ;

                showtext();
                return 0;
            }
            ;


            if (mname == 'bls') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
                cost = tointeger(mag.substr(9, 2));
                turns = tointeger(mag.substr(11, 2));
                if (turns == 0) {
                    turns = 0.5;
                }
                init = turns * 100 + this.obj[i].nowinit;
                eff = tointeger(mag.substr(13, 5));
                current = i;
//		if (eval('scr.bless'+mc)==undefined){mc='';};
                this.obj[current].setmagic('bless', mc);
                if ((mc == '') || (mc == 1)) {
                    this.obj[current]['nowmanna'] -= cost;
                }
                ;
                this.obj[current].attacker = false;
                this.obj[current].destx = this.obj[j].x;
                this.obj[current].desty = this.obj[j].y;
                this.showmagic('bless', this.obj[current].x, this.obj[current].y, this.obj[j].x, this.obj[j].y, j, mc, 0, current);
                var bigx = this.obj[j]['big'];
                var bigy = this.obj[j]['big'];
                if (this.obj[j]['bigx']) bigx = 1;
                if (this.obj[j]['bigy']) bigy = 1;
                for (x = 0; x <= bigx; x++) {
                    for (y = 0; y <= bigy; y++) {
                        if ((this.obj[current].x - (this.obj[j].x + x)) * (this.obj[current].x - (this.obj[j].x + x)) + (this.obj[current].y - (this.obj[j].y + y)) * (this.obj[current].y - (this.obj[j].y + y)) < (this.obj[current].x - this.obj[current].destx) * (this.obj[current].x - this.obj[current].destx) + (this.obj[current].y - this.obj[current].desty) * (this.obj[current].y - this.obj[current].desty)) {
                            this.obj[current].destx = this.obj[j].x + x;
                            this.obj[current].desty = this.obj[j].y + y;
                        }
                    }
                }
                this.obj[current].donow = "c";
                this.obj[current].active = true;
                someactive = true;
                addself(j, 'bls', init, eff);
                if (turns > 0) {
                    switch (lang) {
                        case 0:
                            htmllog += this.html('name', i) + ' наложил заклятие благословение на ' + this.html('name', j) + ' на ' + this.html('bold', turns) + ' ходов.' + this.html('end');
                            break;
                        case 1:
                            if (this.obj[i].hero) {
                                okon = 's';
                            } else {
                                okon = '';
                            }
                            ;
                            htmllog += this.html('name', i) + ' cast' + okon + ' Bless on ' + this.html('name', j) + ' for ' + this.html('bold', turns) + ' turns.' + this.html('end');
                            break;
                    }
                    ;
                } else {
                    switch (lang) {
                        case 0:
                            htmllog += this.html('name', i) + ' - не удалось наложить заклятие благословение на ' + this.html('name', j) + '.' + this.html('end');
                            break;
                        case 1:
                            htmllog += this.html('name', i) + ' - fails to cast Bless on ' + this.html('name', j) + '.' + this.html('end');
                            break;
                    }
                    ;
                }
                ;

                showtext();
                return 0;
            }
            ;
            if (mname == 'kmk') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
                init = 100000;
                eff = tointeger(mag.substr(13, 5));
                current = i;
                switch (lang) {
                    case 0:
                        htmllog += this.html('name', i) + ' защищает ' + this.html('name', j) + '.' + this.html('end');
                        break;
                    case 1:
                        htmllog += this.html('name', i) + ' escorts ' + this.html('name', j) + '.' + this.html('end');
                        break;
                }
                ;
                someactive = true;
                this.obj[i].doing = "cast";
                showtext();
                return 0;
            }
            ;
            if (mname == 'km2') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
                init = 100000;
                eff = tointeger(mag.substr(13, 5));
                current = i;
                switch (lang) {
                    case 0:
                        htmllog += this.html('name', i) + ' защищает ' + this.html('name', j) + '.' + this.html('end');
                        break;
                    case 1:
                        htmllog += this.html('name', i) + ' escorts ' + this.html('name', j) + '.' + this.html('end');
                        break;
                }
                ;
                this.obj[i].special_attack = true;
                showtext();
                return 0;
            }
            ;

            if (mname == 'prt') {
                i = tointeger(mag.substr(3, 3));

                j = tointeger(mag.substr(6, 3));
                if (j == 0) {
                    this.obj[i].stage = 0;
                    this.obj[i].doingm = "startgate";
                    return 0;
                }
                ;
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
                current = i;
                switch (lang) {
                    case 0:
                        htmllog += this.html('name', j) + ' выходят из врат ада.' + this.html('end');
                        break;
                    case 1:
                        htmllog += this.html('name', j) + ' appear out of the hell gate.' + this.html('end');
                        break;
                }
                ;
                this.obj[i].stage = 0;
                this.obj[i].doingm = "";
                this.obj[i].doing = "stopgate";
                showtext();
                return 0;
            }
            ;
            if (mname == 'pr2') {
                i = tointeger(mag.substr(3, 3));

                j = tointeger(mag.substr(6, 3));
                if (j == 0) {
                    this.obj[i].stage = 0;
                    this.obj[i].doing = "cast";
                } else {
                    this.obj[i].stage = 0;
                    this.obj[i].doing = "stopwalk";

                }
                ;
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
                current = i;
                /*switch (lang){
                case 0:
                        htmllog += this.html('name', j)+' выходят из врат ада.'+this.html('end');
                break;
                case 1:
                       htmllog += this.html('name', j)+' appear out of the hell gate.'+this.html('end');
                break;
                };*/
                showtext();

                return 0;
            }
            ;
            if (mname == 'dtd') {
                i = tointeger(mag.substr(3, 3));
                defadd = tointeger(mag.substr(6, 3));
                this.obj[i].defence += defadd;
                var init = 100000;
                if (magic[i]['dtd']) defadd = magic[i]['dtd']['effect'] + defadd;
                addself(i, 'dtd', init, defadd);
            }
            ;
            if (mname == 'mlg') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                init = tointeger(mag.substr(9, 6));
                addself(i, 'mlg', init, 1);
                if (this.obj[j].nownumber > 0) addself(j, 'mlg', init, -1);

            }
            ;
            if (mname == 'mnl') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                h = tointeger(mag.substr(9, 3));
                m = tointeger(mag.substr(12, 6));
                if (autoscroll) {
                    scrollto(this.obj[i].x, this.obj[i].y);
                }
                this.obj[j]['nowmanna'] -= m;

                switch (lang) {
                    case 0:
                        htmllog += this.html('name', i) + ' забрали ' + this.html('bold', m) + ' маны у ' + this.html('name', j);
                        break;
                    case 1:
                        htmllog += this.html('name', i) + ' steal ' + this.html('bold', m) + ' mana from ' + this.html('name', j);
                        break;
                }
                ;
                if (h > 0) {
                    switch (lang) {
                        case 0:
                            htmllog += ' и передали её ' + this.html('name', h);
                            break;
                        case 1:
                            htmllog += ' and siphon it to ' + this.html('name', h);
                            break;
                    }
                    ;
                    this.obj[h]['nowmanna'] += m;
                }
                ;


                htmllog += '.' + this.html('end');
                showtext();


            }
            ;
            if (mname == 'stb') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                lastattacker = i;
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
                init = 100000;
                eff = 1;
                addself(i, 'stb', init, eff);
                current = i;
                switch (lang) {
                    case 0:
                        htmllog += this.html('name', i) + ' призывает бурю на ' + this.html('name', j) + '.' + this.html('end');
                        break;
                    case 1:

                        htmllog += this.html('name', i) + ' avenge on ' + this.html('name', j) + '.' + this.html('end');
                        break;
                }
                ;

                this.obj[current].stormc = 0;
                this.obj[current].setmagic('storm1', '');

                this.obj[current].attacker = false;

                this.showmagic('storm', this.obj[j].x, this.obj[j].y, this.obj[j].x, this.obj[j].y, j, 0, 0, i);

                this.obj[current].donow = "c";
                this.obj[current].active = true;


                showtext();
                return 0;
            }
            ;

            if (mname == 'fls') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                lastattacker = i;
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
                init = 100000;
                eff = 1;
                addself(i, 'usd', init, eff);
                current = i;
                switch (lang) {
                    case 0:
                        htmllog += this.html('name', i) + ' призывают пламя на ' + this.html('name', j) + '.' + this.html('end');
                        break;
                    case 1:

                        htmllog += this.html('name', i) + ' flame on ' + this.html('name', j) + '.' + this.html('end');
                        break;
                }
                ;

                this.obj[current].setmagic('flamestrike', '');

                this.obj[current].attacker = false;

                this.showmagic('flamestrike', this.obj[j].x, this.obj[j].y, this.obj[j].x, this.obj[j].y, j, 0, 0, i);

                this.obj[current].donow = "c";
                this.obj[current].active = true;


                showtext();
                return 0;
            }
            ;


            if (mname == 'flw') {


                i = tointeger(mag.substr(3, 3));
                var xx = tointeger(mag.substr(6, 2));
                var yy = tointeger(mag.substr(8, 2));
                var stage_wave = tointeger(mag.substr(10, 1));
                if (stage_wave > 0) {
                    flamewave_active = true;
                    this.showmagic('flamestrike', xx, yy, xx, yy, 0, 0, 0, i, stage_wave);
                }
                ;
                return 0;
            }
            ;


            if (mname == 'dwl') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                lastattacker = i;
                if (autoscroll) {
                    scrollto(this.obj[i].x, this.obj[i].y);
                }
                init = 100000;
                eff = 1;
                current = i;
                switch (lang) {
                    case 0:
                        htmllog += this.html('name', i) + ' используют умение ' + this.html('bold', 'скорбный вопль') + '.' + this.html('end');
                        break;
                    case 1:
                        htmllog += this.html('name', i) + ' perform ' + this.html('bold', 'triumph of death') + '.' + this.html('end');
                        break;
                }
                ;

//		this.obj[current].setmagic('storm1','');
                this.obj[current].no_magic = 1;
                this.obj[current].attacker = false;

                this.obj[current].donow = "c";
                this.obj[current].active = true;


                showtext();
                return 0;
            }
            ;
            if (mname == 'blh') {
                i = tointeger(mag.substr(3, 3));
                lastattacker = i;
                if (autoscroll) {
                    scrollto(this.obj[i].x, this.obj[i].y);
                }
                init = 100000;
                eff = 1;
                current = i;
                switch (lang) {
                    case 0:
                        htmllog += this.html('name', i) + ' используют умение ' + this.html('bold', 'безграничная ненависть') + '.' + this.html('end');
                        break;
                    case 1:
                        htmllog += this.html('name', i) + ' perform ' + this.html('bold', 'infernal hatred') + '.' + this.html('end');
                        break;
                }
                ;

                this.obj[current].setmagic('', '');
                this.obj[current].no_magic = 1;
                this.obj[current].attacker = false;

                this.obj[current].donow = "c";
                this.obj[current].active = true;


                showtext();
                return 0;
            }
            ;

            if (mname == 'spk') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                lastattacker = i;
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
                init = 100000;
                eff = 1;
                current = i;
                switch (lang) {
                    case 0:
                        if (this.obj[i]['explodingspikes'])
                            htmllog += this.html('name', i) + ' используют умение ' + this.html('bold', 'разрывные шипы') + '.' + this.html('end');
                        else
                            htmllog += this.html('name', i) + ' используют умение ' + this.html('bold', 'втягиваемые шипы') + '.' + this.html('end');
                        break;
                    case 1:
                        if (this.obj[i]['explodingspikes'])
                            htmllog += this.html('name', i) + ' thrust out ' + this.html('bold', 'acerate spikes') + '.' + this.html('end');
                        else
                            htmllog += this.html('name', i) + ' thrust out ' + this.html('bold', 'peaky spikes') + '.' + this.html('end');
                        break;
                }
                ;

                this.obj[current].setmagic('storm1', '');

                this.obj[current].attacker = false;
                this.obj[current].no_magic = 1;
                this.obj[current].donow = "c";
                this.obj[current].active = true;


                showtext();
                return 0;
            }
            ;

            if (mname == 'bsr') {
                i = tointeger(mag.substr(3, 3));
                if (autoscroll) {
                    scrollto(this.obj[i].x, this.obj[i].y);
                }
                init = 100000;
                eff = 1;
                addself(i, 'bsr', init, eff);
                current = i;
                switch (lang) {
                    case 0:
                        htmllog += this.html('name', i) + ' впадает в ярость берсеркера' + '.' + this.html('end');
                        break;
                    case 1:

                        htmllog += this.html('name', i) + ' fall into madness' + '.' + this.html('end');
                        break;
                }
                ;
                showtext();
                return 0;
            }
            ;
            if (mname == 'nmk') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
                init = 100000;
                current = i;
                switch (lang) {
                    case 0:
                        htmllog += this.html('name', i) + ' установил духовную связь с ' + this.html('name', j) + '.' + this.html('end');
                        break;
                    case 1:
                        htmllog += this.html('name', i) + ' establishes Spirit link with ' + this.html('name', j) + '.' + this.html('end');
                        break;
                }
                ;
                showtext();
                return 0;
            }
            ;
            if (mname == 'nmc') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                m = tointeger(mag.substr(9, 3));
                this.obj[i]['nowmanna'] += m;
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
                current = i;
                switch (lang) {
                    case 0:
                        htmllog += this.html('name', i) + ' получает ' + this.html('bold', m) + ' маны от страданий ' + this.html('name', j) + '.' + this.html('end');
                        break;
                    case 1:
                        htmllog += this.html('name', i) + ' gets ' + this.html('bold', m) + ' mana while ' + this.html('name', j) + ' suffer.' + this.html('end');
                        break;
                }
                ;
                showtext();
                return 0;
            }
            ;
            if (mname == 'hfr') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                dam = tointeger(mag.substr(9, 12));
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
                this.obj[j]['nowmanna'] -= 5;
                current = i;
                switch (lang) {
                    case 0:
                        htmllog += this.html('name', i) + ' наносят ' + this.html('bold', dam) + ' дополнительного урона адским огнём.' + this.html('end');
                        break;
                    case 1:
                        htmllog += this.html('name', i) + ' deal ' + this.html('bold', dam) + ' extra damage with Hellfire.' + this.html('end');
                        break;
                }
                ;
                showtext();
                return 0;
            }
            ;
            if (mname == 'mrr') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
                current = i;
                switch (lang) {
                    case 0:
                        htmllog += this.html('name', i) + ' отражают заклинание на ' + this.html('name', j) + '.' + this.html('end');
                        break;
                    case 1:
                        htmllog += this.html('name', i) + ' reflects the spell onto ' + this.html('name', j) + '.' + this.html('end');
                        break;
                }
                ;
                showtext();
                return 0;
            }
            ;
            if (mname == 'els') {
                i = tointeger(mag.substr(3, 3));
                this.obj[i].special_attack = true;
                return 0;
            }
            ;
            if (mname == 'tob') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                this.obj[i].mindam = j;
                return 0;
            }
            ;
            if (mname == 'bal') {
                i = tointeger(mag.substr(3, 3));
                if (this.obj[i].owner == playero) {
                    switch (lang) {
                        case 0:
                            htmllog += '' + this.html('name', i) + ' - самоуправство.' + this.html('end');
                            break;
                        case 1:
                            htmllog += '' + this.html('name', i) + ' act waywardly.' + this.html('end');
                            break;
                    }
                    ;
                    showtext();
                }
                ;
                return 0;
            }
            ;
            if (mname == 'dvg') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
                init = 100000;
                eff = tointeger(mag.substr(13, 5));
                current = i;
                switch (lang) {
                    case 0:
                        htmllog += this.html('name', i) + ' воодушевляет ' + this.html('name', j) + '.' + this.html('end');
                        break;
                    case 1:
                        htmllog += this.html('name', i) + ' inspires ' + this.html('name', j) + '.' + this.html('end');
                        break;
                }
                ;
                this.obj[i].setmagic('');
                this.obj[i].donow = "c";
                this.obj[i].active = true;

                showtext();
                return 0;
            }
            ;
            if (mname == 'sns') {
                i = tointeger(mag.substr(3, 3));
                eff = tointeger(mag.substr(6, 1));
                if (autoscroll) {
                    scrollto(this.obj[i].x, this.obj[i].y);
                }
                if (eff == 2) {
                    addself(i, 'sns', 298 + this.obj[i].nowinit, eff);
                } else {
                    addself(i, 'sns', magic[i]['sns']['nowinit'], eff); //???
//			this.obj[i].selfmagic=this.obj[i].selfmagic.substr(0, this.obj[i].selfmagic.indexOf('sns')+14)+mag.substr(6, 1)+this.obj[i].selfmagic.substr(this.obj[i].selfmagic.indexOf('sns')+15);
                }
                ;
                magic[i]['sns']['effect'] = eff;
                if (eff == 2) {
                    this.obj[i].flyer = 1;
                    switch (lang) {
                        case 0:
                            htmllog += this.html('name', i) + ' превращаются в свет.' + this.html('end');
                            break;
                        case 1:
                            htmllog += this.html('name', i) + ' turn into light.' + this.html('end');
                            break;
                    }
                    ;
                } else {
                    this.obj[i].flyer = 0;
                }
                ;
                if (this.obj[i].nownumber > 0) {
                    this.obj[i].setmagic('');
                    this.obj[i].donow = "c";
                    this.obj[i].active = true;
                    someactive = true;
                }
                ;
                return 0;
            }
            ;
            if (mname == 'rin') {
                i = tointeger(mag.substr(3, 3));
                switch (lang) {
                    case 0:
                        htmllog += this.html('name', i) + ' обнаружил скрытые существа во время использования магии.' + this.html('end');
                        break;
                    case 1:
                        htmllog += this.html('name', i) + ' had found hidden creatures.' + this.html('end');
                        break;
                }
                ;
                this.obj[i].setmagic('');
                this.obj[i].donow = "c";
                this.obj[i].active = true;
                someactive = true;
                return 0;
            }
            ;
            if (mname == 'cre') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
                eff = tointeger(mag.substr(9, 6));
                addself(j, 'cre', 100000, eff);

                switch (lang) {
                    case 0:
                        htmllog += this.html('name', j) + ' заряжаются энергией.' + this.html('end');
                        break;
                    case 1:
                        htmllog += this.html('name', j) + ' charge with energy.' + this.html('end');
                        break;
                }
                ;
                return 0;
            }
            ;
            if (mname == 'stn') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
                cost = tointeger(mag.substr(9, 2));
                turns = tointeger(mag.substr(11, 2));
                if (turns == 0) {
                    turns = 0.5;
                }
                init = turns * 100 + this.obj[i].nowinit;
                eff = tointeger(mag.substr(13, 5));
                current = i;
                addself(j, 'stn', 0, 0);
//		if (eval('scr.stoneskin'+mc)==undefined){mc='';};
                this.obj[current].setmagic('stoneskin', mc);
                if ((mc == '') || (mc == 1)) {
                    this.obj[current]['nowmanna'] -= cost;
                }
                ;
                this.obj[current].attacker = false;
                this.obj[current].destx = this.obj[j].x;
                this.obj[current].desty = this.obj[j].y;
                this.showmagic('stoneskin', this.obj[current].x, this.obj[current].y, this.obj[j].x, this.obj[j].y, j, mc, 0, current);
                var bigx = this.obj[j]['big'];
                var bigy = this.obj[j]['big'];
                if (this.obj[j]['bigx']) bigx = 1;
                if (this.obj[j]['bigy']) bigy = 1;
                for (x = 0; x <= bigx; x++) {
                    for (y = 0; y <= bigy; y++) {
                        if ((this.obj[current].x - (this.obj[j].x + x)) * (this.obj[current].x - (this.obj[j].x + x)) + (this.obj[current].y - (this.obj[j].y + y)) * (this.obj[current].y - (this.obj[j].y + y)) < (this.obj[current].x - this.obj[current].destx) * (this.obj[current].x - this.obj[current].destx) + (this.obj[current].y - this.obj[current].desty) * (this.obj[current].y - this.obj[current].desty)) {
                            this.obj[current].destx = this.obj[j].x + x;
                            this.obj[current].desty = this.obj[j].y + y;
                        }
                    }
                }
                this.obj[current].donow = "c";
                this.obj[current].active = true;
                someactive = true;
                addself(j, 'stn', init, eff);
                if (turns > 0) {
                    switch (lang) {
                        case 0:
                            htmllog += this.html('name', i) + ' наложил заклятие каменная кожа на ' + this.html('name', j) + ' на ' + this.html('bold', turns) + ' ходов.' + this.html('end');
                            break;
                        case 1:
                            if (this.obj[i].hero) {
                                okon = 's';
                            } else {
                                okon = '';
                            }
                            ;
                            htmllog += this.html('name', i) + ' cast' + okon + ' Stoneskin on ' + this.html('name', j) + ' for ' + this.html('bold', turns) + ' turns.' + this.html('end');
                            break;
                    }
                    ;
                } else {
                    switch (lang) {
                        case 0:
                            htmllog += this.html('name', i) + ' - не удалось наложить заклятие каменная кожа на ' + this.html('name', j) + '.' + this.html('end');
                            break;
                        case 1:
                            htmllog += this.html('name', i) + ' - fails to cast Stoneskin on ' + this.html('name', j) + '.' + this.html('end');
                            break;
                    }
                    ;
                }
                ;

                showtext();
                return 0;
            }
            ;
            if (mname == 'agl') {
                i = tointeger(mag.substr(3, 3));
                eff = tointeger(mag.substr(6, 3));
                init = 100000;
                addself(i, 'agl', init, eff);
                return 0;
            }
            ;

            if (mname == 'eom') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
                eff = tointeger(mag.substr(9, 2));

                init = tointeger(mag.substr(11, 7));

                current = i;

                addself(j, 'eom', init, eff);
                return 0;
            }
            ;


            if (mname == 'slw') {
                i = tointeger(mag.substr(3, 3));
                j = tointeger(mag.substr(6, 3));
                if (autoscroll) {
                    scrollto(this.obj[j].x, this.obj[j].y);
                }
                cost = tointeger(mag.substr(9, 2));
                turns = tointeger(mag.substr(11, 2));
                if (turns == 0) {
                    turns = 0.5;
                }
                init = turns * 100 + Math.min(this.obj[j].nowinit, this.obj[i].nowinit);
                eff = tointeger(mag.substr(13, 5));
                current = i;

//		if (eval('scr.slow'+mc)==undefined){mc='';};
                this.obj[current].setmagic('slow', mc);
                this.obj[current]['nowmanna'] -= cost;
                this.obj[current].attacker = false;
                this.obj[current].destx = this.obj[j].x;
                this.obj[current].desty = this.obj[j].y;
                this.showmagic('slow', this.obj[current].x, this.obj[current].y, this.obj[j].x, this.obj[j].y, j, mc, 0, current);
                var bigx = this.obj[j]['big'];
                var bigy = this.obj[j]['big'];
                if (this.obj[j]['bigx']) bigx = 1;
                if (this.obj[j]['bigy']) bigy = 1;
                for (x = 0; x <= bigx; x++) {
                    for (y = 0; y <= bigy; y++) {
                        if ((this.obj[current].x - (this.obj[j].x + x)) * (this.obj[current].x - (this.obj[j].x + x)) + (this.obj[current].y - (this.obj[j].y + y)) * (this.obj[current].y - (this.obj[j].y + y)) < (this.obj[current].x - this.obj[current].destx) * (this.obj[current].x - this.obj[current].destx) + (this.obj[current].y - this.obj[current].desty) * (this.obj[current].y - this.obj[current].desty)) {
                            this.obj[current].destx = this.obj[j].x + x;
                            this.obj[current].desty = this.obj[j].y + y;
                        }
                    }
                }


                if ((cost == 0) && (this.obj[current].whipstrike)) {
                    this.obj[current].whip = true;
                    switch (lang) {
                        case 0:
                            htmllog += this.html('name', i) + ' - удар хлыстом по ' + this.html('name', j) + '.' + this.html('end');
                            break;
                        case 1:
                            htmllog += this.html('name', i) + ' perform shadow whip strike on ' + this.html('name', j) + '.' + this.html('end');
                            break;
                    }
                    ;
                }
                ;
                if ((cost == 0) && (this.obj[current].hexingattack)) {
                    this.obj[current].whip = true;
                    switch (lang) {
                        case 0:
                            htmllog += this.html('name', i) + ' - колдовской удар по ' + this.html('name', j) + '.' + this.html('end');
                            break;
                        case 1:

                            htmllog += this.html('name', i) + ' perform hexing attack at ' + this.html('name', j) + '.' + this.html('end');
                            break;
                    }
                    ;
                }
                ;
                if ((cost == 0) && (this.obj[current].slowstrike)) {
                    this.obj[current].whip = true;
                }
                ;
                if (this.obj[current].slowstrike) {
                    this.obj[current].cast_start = true;
                } else {
                    this.obj[current].donow = "c";
                    this.obj[current].active = true;
                    someactive = true;
                }
                ;


                if (turns > 0) {
                    addself(j, 'slw', init, eff);
                    switch (lang) {
                        case 0:
                            if (this.obj[i].hero) {
                                okon = '';
                            } else {
                                okon = 'и';
                            }
                            ;
                            if (this.obj[i].id == 541) okon = 'а';
                            htmllog += this.html('name', i) + ' наложил' + okon + ' заклятие замедление на ' + this.html('name', j) + ' на ' + this.html('bold', turns) + ' хода.' + this.html('end');
                            break;
                        case 1:
                            if (this.obj[i].hero) {
                                okon = 's';
                            } else {
                                okon = '';
                            }
                            ;
                            htmllog += this.html('name', i) + ' cast' + okon + ' Delay on ' + this.html('name', j) + ' for ' + this.html('bold', turns) + ' turns.' + this.html('end');
                            break;
                    }
                    ;
                } else {
                    switch (lang) {
                        case 0:
                            htmllog += this.html('name', i) + ' - не удалось наложить заклятие замедление на ' + this.html('name', j) + '.' + this.html('end');
                            break;
                        case 1:
                            htmllog += this.html('name', i) + ' fails to cast Delay on ' + this.html('name', j) + '.' + this.html('end');
                            break;
                    }
                    ;
                }
                ;
                showtext();
                return 0;
            }
            ;
        }
    }

    function addActionToCurrent(current, action) {
        if (current in creaturesActions) {
            let creatureActions = creaturesActions[current]
            creaturesActions[current] = getNewCreatureActions(current, creatureActions, action)
        } else {
            creaturesActions[current] = getNewCreatureActions(current, {}, action)
        }
        showCurrentActions(current)
    }

    function getNewCreatureActions(current, actions, action) {
        let currentX = stage[war_scr].obj[current].x
        let currentY = stage[war_scr].obj[current].y

        if (Object.keys(actions).length > 0) {
            if (lastturn in actions) {
                if (actions[lastturn].slice(2).includes(action)) {
                    if (actions[lastturn].slice(2).length > 1) {
                        let prevActions = actions[lastturn].slice(2)
                        actions[lastturn] = actions[lastturn].slice(0, 2)
                        prevActions = prevActions.splice(0, prevActions.indexOf(action))
                        prevActions.push(actions)
                        actions[lastturn] = actions[lastturn].concat(prevActions)
                    } else {
                        actions[lastturn] = actions[lastturn].slice(0, 2)
                        actions[lastturn].push(action)
                    }
                } else {
                    actions[lastturn].push(action)
                }
            } else {
                removeText(current)
                actions = {}
                actions[lastturn] = [currentX, currentY, action]
            }
        } else {
            actions[lastturn] = [currentX, currentY, action]
        }
        console.log(actions)
        return actions
    }

    function showCurrentActions(current) {
        let currentX = stage[war_scr].obj[current].x
        let currentY = stage[war_scr].obj[current].y
        removeText(current)
        let currentActions = creaturesActions[current][lastturn]
        let textToShow = currentActions.slice(2)

        textToShow.forEach((text, index) => {
            if (current in creaturesTexts) {
                creaturesTexts[current].push({
                    "textId": textFieldObjCounter,
                    "lastturn": JSON.stringify(lastturn) - 0,
                    "x": currentX,
                    "y": currentY,
                })
            } else {
                creaturesTexts[current] = [{
                    "textId": textFieldObjCounter,
                    "lastturn": JSON.stringify(lastturn) - 0,
                    "x": currentX,
                    "y": currentY,
                }]
            }

            let pointss = shado[currentY * defxn + currentX].attrs["points"].slice(-2);
            addTextToScreen(text, pointss[0], pointss[1], textFieldObjCounter, index)
        })

    }

    function checkTextsUpdate() {
        for (const [key, value] of Object.entries(creaturesTexts)) {
            let currentX = stage[war_scr].obj[key].x
            let currentY = stage[war_scr].obj[key].y
            if (currentX !== value[0].x || currentY !== value[0].y) {
                removeText(key)
            }
            if (stage[war_scr].obj[key].dead === 1 && stage[war_scr].obj[key].die_number > 1) {
                removeText(key)
                continue
            }
            if (stage[war_scr].obj[key].dead === 1 && stage[war_scr].obj[key].die_number === 1 && !stage[war_scr].obj[key].mvisible) {
                removeText(key)
            }
        }
    }

    function removeText(creatureId) {
        if (creatureId in creaturesTexts) {
            creaturesTexts[creatureId].forEach(text => {
                let textId = text["textId"]
                stage[war_scr].reghint["txt" + textId].parent.removeChild(stage[war_scr].reghint["txt" + textId])
            })
            delete creaturesTexts[creatureId]
        }
    }

    function addTextToScreen(mytext, absx, absy, objcounter, index) {
        if (!stage[war_scr].reghint) {
            stage[war_scr].reghint = Make_Sprite();
            Make_addChild(stage[war_scr].infos, stage[war_scr].reghint);
        }
        create_text(stage[war_scr].reghint, objcounter, absx, absy, mytext, index);
    }

})(window);
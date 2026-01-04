// ==UserScript==
// @name         My Video
// @version      1.0
// @description  Adds keyboard shortcuts to ANY video, Works on every site even social media though it's not recommended. You can edit the shortcuts and prevent the script from running on certain websites and webpages. It DOES NOT replace the original shortcuts.
// @icon         https://visualpharm.com/assets/563/Clapperboard-595b40b75ba036ed117d5939.svg
// @author       XDHx86
// @copyright    2020, XDHx86 (https://openuserjs.org/users/XDHx86)
// @license      MIT
// @match        http://*/*
// @match        https://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @namespace https://greasyfork.org/users/669043
// @downloadURL https://update.greasyfork.org/scripts/407532/My%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/407532/My%20Video.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (GM_getValue('firstload', true)) {
        GM_setValue('play', 'keyk');
        GM_setValue('stop', 'keyo');
        GM_setValue('volp', 'arrowup');
        GM_setValue('volm', 'arrowdown');
        GM_setValue('vlss', 0.05);
        GM_setValue('mute', 'keym');
        GM_setValue('sfor', 'period');
        GM_setValue('sbac', 'comma');
        GM_setValue('stms', 3);
        GM_setValue('bfor', 'keyl');
        GM_setValue('bbac', 'keyj');
        GM_setValue('btms', 30);
        GM_setValue('incp', 'keyy');
        GM_setValue('decp', 'keyt');
        GM_setValue('resp', 'keyr');
        GM_setValue('pbss', 0.1);
        GM_setValue('full', 'keyf');
        GM_setValue('down', 'keyd');
        GM_setValue('pipm', 'keyp');
        GM_setValue('excw', ['www.facebook.com','www.soundcloud.com','www.spotify.com','open.spotify.com']);
        GM_setValue('excp', []);
        GM_setValue('autoc', false);
        GM_setValue('firstload', false);
    }
    var play = GM_getValue('play', 'keyk'),
        stop = GM_getValue('stop', 'keyo'),
        volp = GM_getValue('volp', 'arrowup'),
        volm = GM_getValue('volm', 'arrowdown'),
        vlss = parseFloat(GM_getValue('vlss', 0.05)),
        mute = GM_getValue('mute', 'keym'),
        sfor = GM_getValue('sfor', 'period'),
        sbac = GM_getValue('sbac', 'comma'),
        stms = parseInt(GM_getValue('stms', 3)),
        bfor = GM_getValue('bfor', 'keyl'),
        bbac = GM_getValue('bbac', 'keyj'),
        btms = parseInt(GM_getValue('btms', 30)),
        incp = GM_getValue('incp', 'keyy'),
        decp = GM_getValue('decp', 'keyt'),
        resp = GM_getValue('resp', 'keyr'),
        pbss = parseFloat(GM_getValue('pbss', 0.1)),
        full = GM_getValue('full', 'keyf'),
        down = GM_getValue('down', 'keyd'),
        pipm = GM_getValue('pipm', 'keyp'),
        vals = [play, stop, volp, volm, vlss, mute, sfor, sbac, stms, bfor, bbac, btms, incp, decp, resp, pbss, full, down, pipm],
        vars = ['play', 'stop', 'volp', 'volm', 'vlss', 'mute', 'sfor', 'sbac', 'stms', 'bfor', 'bbac', 'btms', 'incp', 'decp', 'resp', 'pbss', 'full', 'down', 'pipm', 'excw', 'excp'],
        name = ['Pause/Play', 'Stop', 'Volume Up', 'Volume Down', 'Volume Step', 'Mute', 'Short Skip Forward', 'Short Skip Backward', 'Short Skip Step', 'Long Skip Forward', 'Long Skip Backward', 'Long Skip Step', 'Increase Playback Rate', 'Decrease Playback Rate', 'Reset Playback Rate', 'Playback Step', 'Fullscreen', 'Download', 'Play in Picture Mode'],
        extrase = GM_getValue('exse', []),
        diss = GM_getValue('diss', []),
        excw = GM_getValue('excw', []),
        excp = GM_getValue('excp', []),
        savedVT = GM_getValue('savedVT', [{ "s": "placeholder", "t": 123 }]),
        autoc = GM_getValue('autoc', false);
    if (excw.includes(location.host) || excp.includes(location.href)) {
        GM_registerMenuCommand('Remove From Exclutions', function() {
            var w = location.host,
                p = location.href;
            if (excw.includes(w)) {
                if (confirm('Are you sure you want to remove (' + w + ') from exclusions?')) excw.splice(excw.indexOf(w), 1);
                else return;
            } else {
                if (confirm('Are you sure you want to remove (' + p + ') from exclusions?')) excp.splice(excp.indexOf(p), 1);
                else return;
            }
            GM_setValue('excw', excw);
            GM_setValue('excp', excp);
            return;
        });
        return;
    }
    var s = document.createElement('div'),
        m = document.createElement('div'),
        r = document.createElement('div'),
        o = document.createElement('div'),
        ms = document.createElement('div'),
        a = document.createElement('span'),
        svga = '<svg xmlns="http://www.w3.org/2000/svg" style="width: 20px; fill: green; margin-right: 5px !important; transform: rotate(-90deg);" viewBox="0 0 26 26"> <path d="M13,15.405l8.764-8.584c0.392-0.383,1.019-0.38,1.406,0.008l1.536,1.536c0.391,0.391,0.39,1.026-0.002,1.417L13.707,20.707 C13.512,20.902,13.256,21,13,21c-0.256,0-0.512-0.098-0.707-0.293L1.296,9.782c-0.393-0.39-0.394-1.025-0.002-1.417L2.83,6.829 c0.387-0.387,1.015-0.391,1.406-0.008L13,15.405z"></path> </svg>';

    function sh(t) {
        var ss = m.querySelector('.MV_shortcuts'),
            oo = m.querySelector('.MV_other'),
            sv = m.querySelectorAll('h2 svg')[0],
            ov = m.querySelectorAll('h2 svg')[1];
        switch (t) {
            case 'menut':
                m.style.cssText = 'margin-left: 0px !important;';
                break;
            case 'menuf':
                m.style.cssText = 'margin-left: -600px !important';
                break;
            case 'shortcutst':
                sv.style.transform = 'rotate(0deg)';
                ss.style.cssText = 'padding: 10px !important; height: 460px;';
                break;
            case 'shortcutsf':
                sv.style.transform = 'rotate(-90deg)';
                ss.style.cssText = 'height: 0px; padding: 0px !important;';
                break;
            case 'othert':
                ov.style.transform = 'rotate(0deg)';
                oo.style.cssText = 'padding: 10px !important; height: 220px;';
                break;
            case 'otherf':
                ov.style.transform = 'rotate(-90deg)';
                oo.style.cssText = 'height: 0px; padding: 0px !important;';
                break;
            case 'restoret':
                o.style.display = 'block';
                r.style.display = 'block';
                break;
            case 'restoref':
                o.style.display = 'none';
                r.style.display = 'none';
                break;
            case 'morest':
                ms.style.display = 'block';
                o.style.display = 'block';
                break;
            case 'moresf':
                ms.style.display = 'none';
                o.style.display = 'none';
                break;
        }
    }

    function ui() {
        GM_addStyle(`.MV_settings, .MV_menu, .MV_mores, .MV_restore, .MV_alert {position: fixed; z-index: 999999; background-color: #000; color: #777; font-size: 14px; transition: width 0.5s, height 0.5s, margin 0.3s, margin-left 0.3s, margin-right 0.3s, transform 0.5s, opacity 0.3s, padding 0.5s; } .MV_settings *, .MV_menu *, .MV_restore *, MV_mores * {background-color: #000; color: #777; transition: inherit !important; margin: 0 0 0 0 !important; padding: 0 0 0 0 !important; border: none !important; } .MV_settings h2, .MV_menu h2, .MV_restore h2, MV_mores h2 {font-size: 22px; margin: 0; color: green; cursor: pointer; font-weight: bolder; font-family: Helvetica Neue, Segoe UI, Helvetica, Arial, sans-serif; } .MV_settings {bottom: 0; left: 0; opacity: 0.7; font-size: 14px; user-select: none; cursor: pointer; color: #777; border-left: 5px green solid !important; border-top-right-radius: 5px !important; padding: 1px 5px !important; } .MV_settings:hover {opacity: 1; } .MV_menu {bottom: 50px; left: 0; width: 400px; height: 85vh; border-radius: 0px 10px 10px 0px; padding: 20px !important; margin-left: -600px !important; user-select: none; cursor: default; overflow-y: auto; overflow-x: hidden; scrollbar-color: green #000; scrollbar-width: thin; } .MV_menu::-webkit-scrollbar-button {display: none; opacity: 0; width: 0px; height: 0px; background-color: #000; } .MV_menu::-webkit-scrollbar-track, .MV_menu::-webkit-scrollbar {background-color: #000; width: 10px; } .MV_menu::-webkit-scrollbar-corner {display: none; opacity: 0; width: 0px; height: 0px; background-color: #000; } .MV_menu::-webkit-scrollbar-thumb {background-color: green; } .MV_shortcuts input[type=number] {width: 100px; } .MV_shortcuts input {width: 170px; height: 18px; font-size: 14px; font-weight: 900; text-align: center; text-transform: capitalize; outline: 0; margin: 2px 5px !important; background-color: #fff; color: #000; } .MV_shortcuts input:focus {box-shadow: 0 0 5px 2px green; padding: 3px 0px 3px 3px !important; margin: 5px 1px 5px 10px !important; outline-width: 0; border: 1px solid green !important; } .MV_shortcuts, .MV_other {overflow: hidden; color: #777; height: 0px; } .MV_config, .MV_save {color: #000; background-color: green; outline: 0; height: 22px; width: 60px; cursor: pointer; font-weight: bolder; margin-left: 10px !important; } .MV_exclude, .MV_reset {color: #000; background-color: green; outline: 0; height: 22px; width: 70px; cursor: pointer; margin: 10px !important; font-weight: bolder; }`);
        GM_addStyle(`.MV_overlay {z-index: 999990; top: 0; right: 0; position: fixed; background-color: #000; opacity: 0.7; display: none; height: 100%; width: 100%; } .MV_mores { box-shadow: 0 0 20px 20px green; display: none; background-color: #000; color: green; top: 5%; right: 22%; position: absolute; padding: 20px; border-radius: 20px; height: fit-content; } .MV_restore {top: 23%; right: 33%; width: 400px; height: 300px; padding: 20px !important; border-radius: 10px; box-shadow: 0 0 20px 20px green; display: none; } .MV_restore h3, .MV_mores h3 {margin: 0; color: green; font-weight: 900; font-family: Helvetica Neue, Segoe UI, Helvetica, Arial, sans-serif; font-size: 26px; } .MV_restore input {color: green; border: 5px green solid !important; padding: 4px !important; cursor: pointer; outline: 0; } .MV_alert {position: fixed; bottom: 10vh; right: 50vw; width: 500px; height: fit-content; margin-right: -250px; background-color: #000; color: green; border-radius: 20px; border: 1px green solid; display: none; opacity: 0; user-select: none; cursor: default; text-align: center; padding: 25px; font-size: 25px; font-weight: 700; }`);
        GM_addStyle(`.MV_mores input[type=number] { width: 50px; font-weight: bold; color: #000; border: none; text-align: center; } .MV_mores input[type=text] { width: 160px; font-weight: bold; color: #000; border: none; text-align: center; } .MV_mores button { outline:0; cursor: pointer; font-weight: bold; border: none; color: black; text-align: center; background-color: green; margin: 5px; padding: 4px 10px; } .MV_mores textarea { margin: 0px; width: 485px; height: 150px; min-width: 180px; max-width: 720px; min-height: 150px; font-weight: bold; color: rgb(0, 0, 0); border: none; font-size: 16px; padding: 2px 5px; cursor: not-allowed; }`);
        s.innerHTML = ' XDHx86 - MyVideo v1.0 - Settings ';
        m.innerHTML = '<h2> ' + svga + 'Shortcuts: </h2> <div class="MV_shortcuts"> Pause/Play: <input type="text"> <br> Stop: <input type="text"> <br> Volume Up: <input type="text"> <br> Volume Down: <input type="text"> <br> Volume Step: <input type="number" max="0.3" min="0.01"> <br> Mute: <input type="text"> <br> Short Skip Forward: <input type="text"> <br> Short Skip Backward: <input type="text"> <br> Short Skip Step: <input type="number" max="30" min="2"> <br> Long Skip Forward: <input type="text"> <br> Long Skip Backward: <input type="text"> <br> Long Skip Step: <input type="number" max="120" min="30"> <br> Increase Playback Rate: <input type="text"> <br> Decrease PlayBack Rate: <input type="text"> <br> Reset Playback Rate: <input type="text"> <br> Playback Rate Step: <input type="number" max="0.3" min="0.05"> <br> Fullscreen: <input type="text"> <br> Download: <input type="text"> <br> Play in Picture Mode: <input type="text"> <br> </div> <h2> ' + svga + 'Other: </h2> <div class="MV_other"> Backup/Restore: <button class="MV_config"> Config </button> <br> <br> Config More Shortcuts: <button class="MV_config"> Config </button> <br> <br> Exclude Website/Page: <br> Website: <input type="radio" name="MV_radio"> Page: <input type="radio" name="MV_radio"> <br> <button class="MV_exclude"> Exclude </button> <br> Auto Resume Video From Last Position: <input type="checkbox"> </div> <button class="MV_save"> Save </button> <button class="MV_reset"> Reset </button>';
        r.innerHTML = '<h3> Restore Script Data: </h3> Select File: <input type="file"> <br> <button class="MV_reset"> Restore </button> <br> <h3> Backup Script Data: </h3> <button class="MV_reset"> Backup </button>';
        ms.innerHTML = '<h3> Enable Shortcuts </h3> <br> <h2> Note: Check to enable, WOKRS ON THIS WEBSITE ONLY! </h2> <br> Allow Assignation of Space Button: <input type="checkbox"> <br> Allow Arrows Navigation: <input type="checkbox"> <br> <button class="MV_save"> Save </button> <h3> Disable Shortcuts </h3> <br> <h2> Note: Just press the shortcut key and click disable </h2> <br> Type the key here: <input type="text"><br> <button> Disable/Enable </button> <br> Disabled Shortcuts: <br> <textarea title="This Is Just A Preview, You Can\'t Edit This."></textarea>';
        s.classList.add('MV_settings');
        m.classList.add('MV_menu');
        r.classList.add('MV_restore');
        o.classList.add('MV_overlay');
        ms.classList.add('MV_mores');
        a.classList.add('MV_alert');
        document.body.appendChild(s);
        document.body.appendChild(m);
        document.body.appendChild(r);
        document.body.appendChild(o);
        document.body.appendChild(ms);
        document.body.appendChild(a);
        var ss = m.querySelectorAll('h2')[0],
            oo = m.querySelectorAll('h2')[1],
            sss = m.querySelector('.MV_shortcuts'),
            conf = m.querySelector('.MV_config'),
            conf2 = m.querySelectorAll('.MV_config')[1],
            ooo = m.querySelector('.MV_other');
        s.onclick = function() {
            if (m.style.marginLeft === '0px') {
                sh('menuf');
                sh('shortcutsf');
                sh('otherf');
            } else sh('menut');
        }
        ss.onclick = function() {
            if (sss.style.height === '460px') sh('shortcutsf');
            else {
                sh('shortcutst');
                sh('otherf');
            }
        }
        oo.onclick = function() {
            if (ooo.style.height === '220px') sh('otherf');
            else {
                sh('othert');
                sh('shortcutsf');
            }
        }
        conf.onclick = function() { sh('moresf');
            sh('restoret'); }
        conf2.onclick = function() { sh('restoref');
            sh('morest'); }
        window.addEventListener('click', function(e) {
            var c = ['MV_menu', 'MV_shortcuts', 'MV_settings', 'MV_alert', 'MV_other', 'MV_restore', 'MV_save', 'MV_reset', 'MV_config', 'MV_mores'],
                p = e.path;
            if (c.includes(p[0].classList[0]) || c.includes(p[1].classList[0]) || c.includes(p[2].classList[0])) return;
            sh('restoref');
            sh('menuf');
            sh('shortcutsf');
            sh('otherf');
            sh('moresf');
        });
        s.oncontextmenu = function(e) {
            if (confirm('Right Clicking This Menu Excludes This Website.\nAre You Sure You Want To Exclude (' + location.host + ') From The Script?')) {
                e.preventDefault();
                excw.push(location.host);
                GM_setValue('excw', excw);
                if (confirm('Reload Page Now?')) location.reload();
            }
        }
    }

    function set() {
        var s = m.querySelector('.MV_shortcuts'),
            i = s.querySelectorAll('input'),
            ar = Array.from(i);
        for (var z = 0; z < ar.length; z++) {
            var t = i[z],
                v = vals[z];
            t.value = check(v, 0);
            t.setAttribute('mv-original', v);
            t.onfocus = function() { this.value = ''; }
            t.onblur = function() {
                var o = this.getAttribute('mv-original'),
                    f = this.value;
                if (this.type === 'number') {
                    var x = parseFloat(this.max),
                        m = parseFloat(this.min);
                    f = parseFloat(this.value);
                }
                if (f === '' && this.type === 'text') this.value = check(o, 0);
                if (isNaN(f) && this.type === 'number') {
                    this.value = parseFloat(o);
                    alt('Please Assign a Valid Value!');
                } else if (this.type === 'text' && check(f, 1)) {
                    this.value = check(o, 0);
                    alt('This Value Is Already Assigned!');
                } else if (this.type === 'number' && check(f, 2, m, x)) {
                    this.value = parseFloat(o);
                    alt('No More Than ' + x + ' And No Less Than ' + m + '.');
                }
            }
            t.onkeyup = function(e) {
                if (this.type === 'number') return;
                var c = e.code.toLowerCase();
                if (/\-|\!|\$|\%|\^|\&|\*|\(|\)|\_|\+|\~|\=|\`|\||\{|\}|\[|\]|\:|\"|\;|\\|\@|\#|\'|\<|\>|\?|\,|\.|\//g.test(this.value)) this.value = '';
                if (e.ctrlKey || e.altKey || e.metaKey) {
                    alt('No Special Charachters Allowed!');
                    this.value = '';
                    return;
                } else if (e.shiftKey && c != 'tab') {
                    alt('No Special Charachters Allowed!');
                    this.value = '';
                    return;
                } else if (/backspace|delete|home|end|pagup|pagedown|enter|lock|f[0-9]|insert|tab|backquote/gi.test(c)) { this.value = ''; return; } else if (c === 'space' || c === 'arrowright' || c === 'arrowleft') {
                    var value, aa;
                    if (c === 'arrowright' || c === 'arrowleft') aa = 'arrows';
                    if (extrase[0] != undefined) {
                        extrase.forEach(function(a) {
                            if (a.w === location.host) {
                                if (a.s.includes(aa)) value = check(c, 0);
                                else {
                                    value = '';
                                    alt('You Can\'t Assign This Value Without Enabling It In The Shortcuts Configuration.');
                                    return;
                                }
                            }
                        });
                        this.value = value;
                    } else {
                        this.value = '';
                        alt('You Can\'t Assign This Value Without Enabling It In The Shortcuts Configuration.');
                        return;
                    }
                } else this.value = check(c, 0);
            }
        }
        var save = document.querySelector('.MV_save'),
            rest = document.querySelectorAll('.MV_reset'),
            excl = document.querySelector('.MV_exclude'),
            checkb = m.querySelector('input[type=checkbox]');
        if (autoc) checkb.checked = true;
        save.onclick = function() {
            for (var l = 0; l < ar.length; l++) {
                var v = i[l].value.replace(' ', '').toLowerCase();
                GM_setValue(vars[l], v);
                if (checkb.checked) GM_setValue('autoc', true);
                else GM_setValue('autoc', false);
                rvals();
            }
            alt('Settings Will Take Effect Immediatly, No Need to Reload.');
        }
        rest[0].onclick = function() {
            for (var l = 0; l < ar.length; l++) {
                var v = i[l].getAttribute('mv-original');
                GM_setValue(vars[l], v);
                rvals();
            }
            alt('Settings Will Take Effect Immediatly, No Need to Reload.');
        }
        rest[1].onclick = function() {
            var i = document.querySelector('.MV_restore input'),
                f = i.files[0],
                fr = new FileReader(),
                c;
            if (!i.files[0]) {
                alt('Please Select a File!');
                return;
            } else if (check(f, 3)) {
                alt('This Isn\'t a Backup File Please Select The Correct One!');
                return;
            } else if (!fr) {
                alt('File API Isn\'t Supported!');
                return;
            }
            fr.onload = function() { c = fr.result; }
            fr.readAsText(f);
            setTimeout(function() {
                if (c.substr(0, 1) != '[' || c.substr(-2, 2) != ']]') {
                    alt('This Isn\'t a Backup File Please Select The Correct One!');
                    return;
                } else br(true, c);
            }, 1000);
        }
        rest[2].onclick = br;
        excl.onclick = function() {
            var r = document.querySelectorAll('input[name=MV_radio]'),
                ab = excw,
                ac = excp,
                w = location.host,
                p = location.href;
            if (r[0].checked === true) {
                if (confirm('Are you sure you want to add this website (' + w + ') to exclusions?')) {
                    if (ab.includes(w)) return;
                    else ab.push(w);
                    alt('Settings Will Take Effect After Reload. To Remove From Exclutions Just Open Tampermonkey Plugin Menu.');
                    GM_setValue('excw', ab);
                }
            } else if (r[1].checked === true) {
                if (confirm('Are you sure you want to add this webpage (' + p + ') to exclusions?')) {
                    if (ac.includes(p)) return;
                    else ac.push(p);
                    alt('Settings Will Take Effect After Reload. To Remove From Exclutions Just Open Tampermonkey Plugin Menu.');
                    GM_setValue('excp', ac);
                }
            } else {
                alt('Please Select an Option!');
                return;
            }
        }
        var inputs = ms.querySelectorAll('input'),
            msbtn = ms.querySelectorAll('button')[1],
            mstxta = ms.querySelector('textarea'),
            savees = ms.querySelector('.MV_save');
        extrase.forEach(function(e) { if (location.host === e.w && e.s.includes('space')) inputs[0].checked = true; });
        extrase.forEach(function(e) { if (location.host === e.w && e.s.includes('arrows')) inputs[1].checked = true; });
        inputs[2].onfocus = function() { this.value = ''; }
        inputs[2].onkeyup = function(e) { this.value = e.code.toLowerCase(); }
        msbtn.onclick = function() {
            var i = inputs[2],
                s = i.value,
                w = location.host,
                found = false;
            if (diss[0] != undefined) {
                diss.forEach(function(e) {
                    if (e.w === w) {
                        if (e.s.includes(s)) {
                            e.s.pop(e.s.indexOf(s) - 1);
                            GM_setValue('diss', diss);
                            alt('Enabled Successfully!');
                            mstxta.value = '';
                            diss.forEach(function(e) {
                                if (location.host === e.w) {
                                    e.s.forEach(function(a) {
                                        mstxta.value += check(a, 0) + '\n';
                                    });
                                }
                            });
                        } else {
                            e.s.push(s);
                            mstxta.value += check(s, 0) + '\n';
                            GM_setValue('diss', diss);
                            alt('Disabled Successfully!');
                        }
                    }
                });
                diss.forEach(function(z) { if (z.w === location.host) found = true; });
                if (!found) {
                    var nd = {
                        w: w,
                        s: []
                    };
                    nd.s.push(s);
                    diss.push(nd);
                    mstxta.value += check(s, 0) + '\n';
                    GM_setValue('diss', diss);
                    alt('Disabled Successfully!');
                }
                inputs[2].value = '';
            } else {
                var d = {
                    w: w,
                    s: []
                };
                d.s.push(s);
                diss.push(d);
                mstxta.value += check(s, 0) + '\n';
                GM_setValue('diss', diss);
                alt('Disabled Successfully!');
            }
        }
        savees.onclick = function() {
            if (inputs[0].checked) {
                if (extrase[0] == undefined) {
                    var d = {
                        w: location.host,
                        s: ['space']
                    }
                    extrase.push(d);
                    GM_setValue('exse', extrase);
                } else {
                    extrase.forEach(function(e) { if (e.w === location.host) e.s.push('space'); });
                    GM_setValue('exse', extrase);
                }
            }
            if (inputs[1].checked) {
                if (extrase[0] == undefined) {
                    var dd = {
                        w: location.host,
                        s: ['arrows']
                    }
                    extrase.push(dd);
                    GM_setValue('exse', extrase);
                } else {
                    extrase.forEach(function(e) { if (e.w === location.host) e.s.push('arrows'); });
                    GM_setValue('exse', extrase);
                }
            }
            alt('Saved Successfully, Settings Will Take Effect Immediately No Need To Reload.');
            rvals();
        }
        diss.forEach(function(e) {
            if (location.host === e.w) {
                e.s.forEach(function(a) {
                    mstxta.value += check(a, 0) + '\n';
                });
            }
        });
        mstxta.onfocus = function() { mstxta.blur(); }
    }

    function fullscreen(e) {
        var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
            (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
            (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
            (document.msFullscreenElement && document.msFullscreenElement !== null);
        if (!isInFullScreen) {
            if (e.requestFullscreen) e.requestFullscreen();
            else if (e.mozRequestFullScreen) e.mozRequestFullScreen();
            else if (e.webkitRequestFullScreen) e.webkitRequestFullScreen();
            else if (e.msRequestFullscreen) e.msRequestFullscreen();
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
            else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
            else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
            else if (document.msExitFullscreen) document.msExitFullscreen();
        }
    }

    function download(e) {
        var src = e.currentSrc,
            title = document.title;
        GM_download({
            url: src,
            name: title + ".mp4",
            saveAs: true,
            onerror: function(error) {
                if (error.details === undefined) {
                    if (GM_info.downloadMode === "native") {
                        alt("Current Download Mode Isn't Compatible With The Script, Please Change The Download Mode To 'Default' Or 'Browser API' In TamperMonkey Settings!", 5000);
                        return;
                    } else {
                        alt("Cannot Download This Video, Try Online Video Convertors!");
                        return;
                    }
                }
                if (error.details.current === "SERVER_FORBIDDEN") {
                    GM_notification({
                        title: "Download Failed!",
                        text: "Reason: " + error.details.current + "\nDetails: Server Has Closed Connection Due To Unauthorized Access OR The Link Has Expired.\nPlease Reload Then Try Again!",
                    });
                    return;
                }
                if (error.details.current != "USER_CANCELED") {
                    GM_notification({
                        title: "Download Failed!",
                        text: "Reason: " + error.details.current + "\nClick Here To Restart.",
                        onclick: function() {
                            download(e);
                        }
                    });
                }
            }
        });
    }

    function handler(e) {
        var k = e.code.toLowerCase(),
            v = e.target.querySelector('video') || e.target,
            disabled = false;
        if (e.ctrlKey || e.altKey || e.metaKey || e.shiftKey || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        rvals();
        diss.forEach(function(q) {
            if (location.host === q.w) {
                q.s.forEach(function(a) {
                    if (k === a) disabled = true;
                });
            }
        });
        if (disabled) return;
        switch (k) {
            case play:
                if (v.paused) v.play();
                else v.pause();
                break;
            case stop:
                v.currentTime = 0;
                v.pause();
                break;
            case volp:
                v.volume += vlss;
                break;
            case volm:
                v.volume -= vlss;
                break;
            case sfor:
                v.currentTime += stms;
                break;
            case sbac:
                v.currentTime -= stms;
                break;
            case bfor:
                v.currentTime += btms;
                break;
            case bbac:
                v.currentTime -= btms;
                break;
            case incp:
                v.playbackRate += pbss;
                break;
            case decp:
                v.playbackRate -= pbss;
                break;
            case resp:
                v.playbackRate = 1;
                break;
            case mute:
                if (v.muted) v.muted = false;
                else v.muted = true;
                break;
            case full:
                fullscreen(v);
                break;
            case down:
                download(v);
                break;
            case pipm:
                if (document.pictureInPictureElement) v.exitPictureInPicture();
                else v.requestPictureInPicture();
        }
    }

    function check(k, p, m = 0, x = 0) {
        if (p === 0) {
            if (typeof k === 'number') k = k;
            else if (/comma|period|semicolon|quote|backslash|slash/g.test(k)) k = k;
            else if (/bracket/g.test(k)) k = 'Bracket ' + k.replace('bracket', '');
            else if (k.substring(0, 3) === 'key') k = 'Key ' + k[3].toUpperCase();
            else if (k === 'arrowleft') k = 'Arrow Left';
            else if (k === 'arrowright') k = 'Arrow Right';
            else if (k === 'arrowup') k = 'Arrow Up';
            else if (k === 'arrowdown') k = 'Arrow Down';
            else if (k === 'space') k = 'Space';
            else if (k.substring(0, 5) === 'digit') k = 'Digit ' + k[5];
            else if (k.substring(0, 6) === 'numpad' && k[6].search(/[0-9]/) > -1) k = 'Numpad ' + k[6];
            else k = '';
        } else if (p === 1) {
            var ii = document.querySelectorAll('.MV_shortcuts input'),
                ar = Array.from(ii),
                i = [],
                ind;
            ar.forEach(function(e) { i.push(e.value); });
            ind = i.indexOf(k);
            i.splice(ind, 1);
            if (i.includes(k)) k = true
            else k = false;
        } else if (p === 2) {
            if (k > x || k < m || k.search(/e|\+|\-/i) > -1) k = true;
            else k = false;
        } else {
            if (k.name.substr(-3, 3) != 'txt' || k.type != 'text/plain') k = true;
            else k = false;
        }
        return k;
    }

    function alt(m, t = null) {
        a.innerText = m;
        a.style.display = 'block';
        if (t === null) {
            setTimeout(function() { a.style.opacity = 1; }, 100);
            setTimeout(function() { a.style.opacity = 0; }, 3000);
            setTimeout(function() { a.style.display = 'none'; }, 3400);
        } else {
            setTimeout(function() { a.style.opacity = 1; }, 100);
            setTimeout(function() { a.style.opacity = 0; }, t);
            setTimeout(function() { a.style.display = 'none'; }, t + 400);
        }
    }

    function rvals() {
        play = GM_getValue('play', 'keyk');
        stop = GM_getValue('stop', 'keyo');
        volp = GM_getValue('volp', 'arrowup');
        volm = GM_getValue('volm', 'arrowdown');
        vlss = parseFloat(GM_getValue('vlss', 0.05));
        mute = GM_getValue('mute', 'keym');
        sfor = GM_getValue('sfor', 'period');
        sbac = GM_getValue('sbac', 'comma');
        stms = parseInt(GM_getValue('stms', 3));
        bfor = GM_getValue('bfor', 'keyl');
        bbac = GM_getValue('bbac', 'keyj');
        btms = parseInt(GM_getValue('btms', 30));
        incp = GM_getValue('incp', 'keyy');
        decp = GM_getValue('decp', 'keyt');
        resp = GM_getValue('resp', 'keyr');
        pbss = parseFloat(GM_getValue('pbss', 0.1));
        full = GM_getValue('full', 'keyf');
        down = GM_getValue('down', 'keyd');
        pipm = GM_getValue('pipm', 'keyp');
        vals = [play, stop, volp, volm, vlss, mute, sfor, sbac, stms, bfor, bbac, btms, incp, decp, resp, pbss, full, down, pipm];
        extrase = GM_getValue('exse', []);
        diss = GM_getValue('diss', []);
    }

    function timer(e) {
        e.setAttribute('timed', '1');
        e.ontimeupdate = function() {
            var found = false;
            if (e.currentTime > 20) {
                var video = {
                    s: e.src,
                    t: e.currentTime
                };
                for (var i = 0; i < savedVT.length; i++)
                    if (savedVT[i].s === e.src) found = true;
                if (!found) savedVT.push(video);
                else savedVT.forEach(function(q) { if (q.s === e.src) q.t = e.currentTime; });
                GM_setValue('savedVT', savedVT);
            }
        }
    }
    var asked = false;
    var foundtv = false;

    function settime(e) {
        for (var i = 0; i < savedVT.length; i++) {
            if (savedVT[i].s === e.src) foundtv = true;
            if (i == savedVT.length - 1 && !foundtv) {
                asked = true;
                break;
            }
        }
        if (asked) return;
        asked = true;
        setTimeout(function() {
            savedVT.forEach(function(q) {
                if (q.s === e.src) {
                    if (autoc) e.currentTime = q.t;
                    else if (confirm('Continue From Last Position?')) {
                        e.currentTime = q.t;
                        if (confirm('Don\'t Ask Again?')) {
                            GM_setValue('autoc', true);
                            document.querySelector('.MV_menu input[type=checkbox]').checked = true;
                        }
                    }
                }
            });
        }, 3000);
    }

    function main() {
        ui();
        set();
        setInterval(function() {
            var vs = document.querySelectorAll('video');
            if (vs.length === 1) {
                window.onkeydown = function(e) { handler(e); }
                if (!asked) settime(vs[0]);
                else if (!vs[0].getAttribute('timed')) timer(vs[0]);
            } else {
                vs.forEach(function(elm) {
                    window.onkeydown = null;
                    elm.onkeydown = function(e) { handler(e); }
                    if (!asked) settime(elm);
                    else if (!elm.getAttribute('timed')) timer(elm);
                });
            }
        });
    }

    function br(m = false, f) {
        var j = [],
            e,
            d = new Date,
            a = d.toDateString().split(' '),
            t = a[2] + '-' + a[1] + '-' + a[3],
            n = 'TamperMonkey.' + t + '.XDHx86_MyVideo.user.data.txt';
        if (m === true) {
            f = JSON.parse(f);
            for (var i = 0; i < f.length; i++) {
                GM_setValue(vars[i], f[i]);
            }
        } else {
            for (var l = 0; l < vars.length; l++) {
                j.push(GM_getValue(vars[l]));
            }
            if (j[1] === undefined) j = vals;
            j = JSON.stringify(j);
            e = document.createElement('a')
            e.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(j);
            e.download = n;
            e.click();
        }
    }
    main();
})();

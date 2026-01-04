// ==UserScript==
// @name         modded Starblast.io public
// @version      1.0.5
// @description  Enhances starblast client as well as gameplay
// @author       official_troller
// @match        https://starblast.io/
// @match        https://starblast.io/modding.html
// @grant        none
// @namespace https://greasyfork.org/users/931011
// @downloadURL https://update.greasyfork.org/scripts/519981/modded%20Starblastio%20public.user.js
// @updateURL https://update.greasyfork.org/scripts/519981/modded%20Starblastio%20public.meta.js
// ==/UserScript==

'use strict';
if (localStorage.getItem('selftag') == null) localStorage.setItem('selftag', 'true');
if (localStorage.getItem('noturecp') == null) localStorage.setItem('noturecp', 'false');
if (localStorage.getItem('gemindeed') === null) localStorage.setItem('gemindeed', '"#ff0000"');
if (localStorage.getItem('gemindeed1') === null) localStorage.setItem('gemindeed1', '"#ff8080"');
if (localStorage.getItem('emopacity') === null) localStorage.setItem('emopacity', '"4"');
console.clear();
let Client = new (class {
    log(msg) {
        console.log(`%c[Client] ${msg}`, 'color: #c4bf9f');
    }
    error(msg) {
        console.log(`%c[Client]%c[Error] ${msg}`, 'color: #ff0000');
    }
    checkgame() {
        return '/' == window.location.pathname && 'welcome' != Object.values(window.module.exports.settings).find(e => e && e.mode).mode.id && 'https://starblast.io/#' != window.location.href;
    }
})();
window.ClientStorage = new (class {
    gem1 = function () {
        try {
            return JSON.parse(localStorage.getItem('gemindeed'));
        } catch (_) {
            const fallback = '#ff0000';
            localStorage.setItem('gemindeed', JSON.stringify(fallback));
            return fallback;
        }
    };
    gem2 = function () {
        try {
            const data = localStorage.getItem('gemindeed1');
            return JSON.parse(data);
        } catch (_) {
            const fallback = '#ff8080';
            localStorage.setItem('gemindeed1', JSON.stringify(fallback));
            return fallback;
        }
    };
    emotes = function () {
        try {
            return JSON.parse(localStorage.getItem('emopacity'));
        } catch (_) {
            const fallback = '"4"';
            localStorage.setItem('emopacity', JSON.stringify(fallback));
            return fallback;
        }
    };
    scroll = new (class {
        bar() {
            document.querySelector('body > div.modal > div.modalbody > div > table > tbody > tr > td.ecpverifiedlogo.frozenbg').addEventListener('wheel', e => {
                e.deltaY < 1
                    ? document.querySelector('body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(1) > i.fa.fa-caret-right').click()
                    : e.deltaY > 1 && document.querySelector('body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(1) > i.fa.fa-caret-left').click();
                e.stopPropagation();
            });
            document.querySelector('body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(1) > div').addEventListener('wheel', e => {
                e.deltaY < 1
                    ? document.querySelector('body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(1) > i.fa.fa-caret-right').click()
                    : e.deltaY > 1 && document.querySelector('body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(1) > i.fa.fa-caret-left').click();
                e.stopPropagation();
            });
            document.querySelector('body > div.modal > div.modalbody > div > table > tbody > tr > td.shippreview.frozenbg').addEventListener('wheel', e => {
                e.deltaY < 1
                    ? document.querySelector('body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(2) > i.fa.fa-caret-right').click()
                    : e.deltaY > 1 && document.querySelector('body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(2) > i.fa.fa-caret-left').click();
                e.stopPropagation();
            });
            document.querySelector('body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(2) > div').addEventListener('wheel', e => {
                e.deltaY < 1
                    ? document.querySelector('body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(2) > i.fa.fa-caret-right').click()
                    : e.deltaY > 1 && document.querySelector('body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(2) > i.fa.fa-caret-left').click();
                e.stopPropagation();
            });
            document.querySelector('body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(3) > div').addEventListener('wheel', e => {
                e.deltaY < 1
                    ? document.querySelector('body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(3) > i.fa.fa-caret-right').click()
                    : e.deltaY > 1 && document.querySelector('body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(3) > i.fa.fa-caret-left').click();
                e.stopPropagation();
            });
        }
    })();
})();
async function ClientLoader() {
    let fullstart = performance.now();

    ('use strict');
    document.open();
    document.write('');
    window.onbeforeunload = null;
    document.close();
    document.open();
    document.write(
        `<title>Loading...</title><style>.wrapper{position:fixed;z-index:100;top:0;left:0;width:100%;height:100%;background:#001019;display:flex;justify-content:center;align-items:center}@keyframes rotate-loading{0%{transform:rotate(0);-ms-transform:rotate(0);-webkit-transform:rotate(0);-o-transform:rotate(0);-moz-transform:rotate(0)}100%{transform:rotate(360deg);-ms-transform:rotate(360deg);-webkit-transform:rotate(360deg);-o-transform:rotate(360deg);-moz-transform:rotate(360deg)}}@-moz-keyframes rotate-loading{0%{transform:rotate(0);-ms-transform:rotate(0);-webkit-transform:rotate(0);-o-transform:rotate(0);-moz-transform:rotate(0)}100%{transform:rotate(360deg);-ms-transform:rotate(360deg);-webkit-transform:rotate(360deg);-o-transform:rotate(360deg);-moz-transform:rotate(360deg)}}@-webkit-keyframes rotate-loading{0%{transform:rotate(0);-ms-transform:rotate(0);-webkit-transform:rotate(0);-o-transform:rotate(0);-moz-transform:rotate(0)}100%{transform:rotate(360deg);-ms-transform:rotate(360deg);-webkit-transform:rotate(360deg);-o-transform:rotate(360deg);-moz-transform:rotate(360deg)}}@-o-keyframes rotate-loading{0%{transform:rotate(0);-ms-transform:rotate(0);-webkit-transform:rotate(0);-o-transform:rotate(0);-moz-transform:rotate(0)}100%{transform:rotate(360deg);-ms-transform:rotate(360deg);-webkit-transform:rotate(360deg);-o-transform:rotate(360deg);-moz-transform:rotate(360deg)}}@keyframes rotate-loading{0%{transform:rotate(0);-ms-transform:rotate(0);-webkit-transform:rotate(0);-o-transform:rotate(0);-moz-transform:rotate(0)}100%{transform:rotate(360deg);-ms-transform:rotate(360deg);-webkit-transform:rotate(360deg);-o-transform:rotate(360deg);-moz-transform:rotate(360deg)}}@-moz-keyframes rotate-loading{0%{transform:rotate(0);-ms-transform:rotate(0);-webkit-transform:rotate(0);-o-transform:rotate(0);-moz-transform:rotate(0)}100%{transform:rotate(360deg);-ms-transform:rotate(360deg);-webkit-transform:rotate(360deg);-o-transform:rotate(360deg);-moz-transform:rotate(360deg)}}@-webkit-keyframes rotate-loading{0%{transform:rotate(0);-ms-transform:rotate(0);-webkit-transform:rotate(0);-o-transform:rotate(0);-moz-transform:rotate(0)}100%{transform:rotate(360deg);-ms-transform:rotate(360deg);-webkit-transform:rotate(360deg);-o-transform:rotate(360deg);-moz-transform:rotate(360deg)}}@-o-keyframes rotate-loading{0%{transform:rotate(0);-ms-transform:rotate(0);-webkit-transform:rotate(0);-o-transform:rotate(0);-moz-transform:rotate(0)}100%{transform:rotate(360deg);-ms-transform:rotate(360deg);-webkit-transform:rotate(360deg);-o-transform:rotate(360deg);-moz-transform:rotate(360deg)}}@keyframes loading-text-opacity{0%{opacity:0}20%{opacity:0}50%{opacity:1}100%{opacity:0}}@-moz-keyframes loading-text-opacity{0%{opacity:0}20%{opacity:0}50%{opacity:1}100%{opacity:0}}@-webkit-keyframes loading-text-opacity{0%{opacity:0}20%{opacity:0}50%{opacity:1}100%{opacity:0}}@-o-keyframes loading-text-opacity{0%{opacity:0}20%{opacity:0}50%{opacity:1}100%{opacity:0}}.loading,.loading-container{height:100px;position:relative;width:100px;border-radius:100%}.loading-container{margin:40px auto}.loading{border:4px solid transparent;border-color:transparent hsla(200,72%,61%,.7) transparent hsla(200,72%,61%,.7);-moz-animation:rotate-loading 1.5s linear 0s infinite normal;-moz-transform-origin:50% 50%;-o-animation:rotate-loading 1.5s linear 0s infinite normal;-o-transform-origin:50% 50%;-webkit-animation:rotate-loading 1.5s linear 0s infinite normal;-webkit-transform-origin:50% 50%;animation:rotate-loading 1.5s linear 0s infinite normal;transform-origin:50% 50%}.loading-container:hover .loading{border-color:hsla(200,72%,61%,.7) transparent hsla(200,72%,61%,.7) transparent}.loading-container .loading,.loading-container:hover .loading{-webkit-transition:all .5s ease-in-out;-moz-transition:all .5s ease-in-out;-ms-transition:all .5s ease-in-out;-o-transition:all .5s ease-in-out;transition:all .5s ease-in-out}#loading-text{-moz-animation:loading-text-opacity 2s linear 0s infinite normal;-o-animation:loading-text-opacity 2s linear 0s infinite normal;-webkit-animation:loading-text-opacity 2s linear 0s infinite normal;animation:loading-text-opacity 2s linear 0s infinite normal;color:hsla(200,72%,61%,.7);font-family:arial;font-size:12px;font-weight:700;margin-top:45px;opacity:0;position:absolute;text-align:center;text-transform:uppercase;top:0;left:2px;width:100px}</style><div class=wrapper><div class=loading-container><div class=loading></div><div id=loading-text>loading...</div></div></div>`
    );
    window.onbeforeunload = null;
    document.close();
    var url = 'https://starblast.io';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onreadystatechange = async function () {
        if (xhr.readyState === 4) {
            try {
                function RyJet() {
                    function renameGlobals(str) {
                        const alph = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
                        let code = '',
                            lenght = 0,
                            full = '';
                        for (let num = 0; num < str.length; num++) {
                            let alphnum = alph.indexOf(str[num].toUpperCase());
                            if (alphnum === -1) continue;
                            code += alphnum.toString(2).padStart(5, '0');
                        }
                        for (let numm = 0; numm + 8 <= code.length; numm += 8) {
                            full += String.fromCharCode(parseInt(code.substring(numm, numm + 8), 2));
                        }
                        return full;
                    }
                    const keyvalues = [
                        'LJXW63JAK5UXI2BAJVXXK43FEBLWQZLFNQ',
                        'GUQEK3LPORSXG',
                        'KJSW233WMUQEI33OMF2GKICTIZMA',
                        'IJ4XAYLTOMQFIZLBNUQEY33DNM',
                        'JRXXOZLSMNQXGZJAJZQW2ZI',
                        'KJSW233WMUQECRDT',
                        'IF2XI3ZAI5DQ',
                        'IJWHK4RAKBQWOZI',
                        'IFGFIK2BEBHXAZLOOMQFGZLUORUW4Z3T',
                        'IFGFIK2REBHXAZLOOMQEE5LUORXW44Y',
                        'KNSWKICCNRQW42ZAIVBVA4Y',
                        'IN2XG5DPNUQFG5DBORUW63RAJVXWI5LMMVZQ',
                        'IN2XG5DPNUQEOZLNEBBW63DPOI',
                        'M5SW2Y3PNRXXE',
                        'M5SW2Y3PNRXXEMQ',
                        'KVZWK4TOMFWWKICMN5TW6',
                        'MVRXA43UN5ZGCZ3F',
                        'KVXGY33DNMQFOZLBOBXW4ICTORXXEZI',
                        'KNXWM5BAKVXGGYLQ',
                        'IZXXEY3FEBCUGUA',
                        'IVYGSYZAI5QW2ZLSEBGW6ZDF',
                        'IFXHI2JAIFDEW',
                        'KN2XE5TJOZQWYICUNFWWK4Q',
                        'KJSW233WMUQEO33MMQ',
                        'KJQWIYLSEBNG633N',
                        'IZQXG5BAKJSXG4DBO5XA',
                        'KNSWYZRAKNUGS4BAKRQWO',
                        'IFUW2YTPOQ',
                    ];
                    let count = 0;
                    let count2 = 0;
                    let actualcheats = 0;
                    for (const item of keyvalues) {
                        const iten = renameGlobals(item);
                        if (localStorage[iten]) {
                            count++;
                            if (localStorage[iten] === 'true') {
                                switch (item) {
                                    case 'LJXW63JAK5UXI2BAJVXXK43FEBLWQZLFNQ':
                                    case 'IJ4XAYLTOMQFIZLBNUQEY33DNM':
                                    case 'KVXGY33DNMQFOZLBOBXW4ICTORXXEZI':
                                    case 'KJQWIYLSEBNG633N':
                                    case 'IZQXG5BAKJSXG4DBO5XA':
                                    case 'IFUW2YTPOQ':
                                    case 'IZXXEY3FEBCUGUA':
                                    case 'KN2XE5TJOZQWYICUNFWWK4Q':
                                        actualcheats++;
                                        count2++;
                                        break;
                                    default:
                                        count2++;
                                        break;
                                }
                            }
                            if (!localStorage.getItem('chisreal')) localStorage.removeItem(iten);
                        }
                    }
                    if (count > 0 && count2 > 5 && actualcheats > 0 && !localStorage.getItem('chisreal')) {
                        let message = renameGlobals(
                            'JBSXSIDUNBSXEZJMEBWG633LOMQGY2LLMUQHS33VEB2XGZLEEBJXKYTTOBQWGZJAMJSWM33SMUXAUCSZN52SA23ON53SA5DIMF2CAY3IMVQXI2LOM4QGS4ZAMJQWILBAOJUWO2DUH4FAUWLPOUQGQYLEEB5WG33VNZ2DE7JAONSXI5DJNZTXGIDFNZQWE3DFMQQGC3TEEBSXMZLOEB5WCY3UOVQWYY3IMVQXI435EBRWQZLBORZS4CSJEB3W63RHOQQGYZLUEB2GQYLUEBZWY2LEMUXAUCSJMYQG26JAMNWGSZLOOQQGIZLUMVRXI4ZAON2WE43QMFRWKIDFOZSXEIDBM5QWS3RMEB2GQ2LTEBRWY2LFNZ2CA53PNYTXIIDXN5ZGWIDGN5ZCA6LPOUQGC3TZNVXXEZJO'
                        );
                        message = message.replace(/{count2}/, count2).replace(/{actualcheats}/, actualcheats);
                        alert(message);
                        return true;
                    } else if (count > 0 && count2 > 5 && actualcheats > 0 && localStorage.getItem('chisreal')) {
                        return true;
                    }
                    return false;
                }
                const check = RyJet();
                if (check && !localStorage.getItem('chisreal')) {
                    localStorage.setItem('chisreal', 'true')
                } else if (check && localStorage.getItem('chisreal')) {
                    alert('You have been caught cheating again. Client wont be loaded...')
                    throw new Error('Cheater detected. Execution stopped.');
                }
                var src = xhr.responseText;
                if (src != undefined) {
                } else {
                    Client.log(`Src fetch failed`);
                }
                let prevSrc = src;

                Client.checkSrcChange = function (msg) {
                    if (src == prevSrc) console.error(`failed to modify game at ${msg}`);
                    prevSrc = src;
                };
                Client.log(`starting modifying...`);
                let pfstart = performance.now();
                let settingsregex = src.match(/music:\{[^{}]*\},/);
                let settingsmatch = settingsregex[0].match(/[iI10OlL]{4,6}/g);
                let newrgs = src.match(/e\.[iI10OlL]{4,6}\.[iI10OlL]{4,6}\.beep\(4\+\.2\*math\.random\(\)/gi);
                let newnewrgs = newrgs[0].match(/[iI10OlL]{4,6}/g);
                let reegtest = src.match(
                    /if\("select"!==(\w+\.)type\)e\+='<div\s*class="option">'\+t\(\w+\.name\)\+'<label\s*class="switch"><input\s*type="checkbox"\s*'\+\(\w+\.value\?'checked="checked"':""\)\+'\s*id="'\+(\w+)\+'""><div\s*class="slider"><\/div><\/label><\/div>';/
                );
                if (reegtest) {
                    try {
                        src = src.replace(
                            reegtest[0],
                            `if ("select" !== ${reegtest[1]}type) if ("color" === ${reegtest[1]}type) { e += '<div class="option">' + t(${reegtest[1]}name) + '<div class="range" style=\\"cursor: pointer;\\">\\n  <input id=\\'\' + ${reegtest[2]} + "' type=\\"color\\" style=\\"-webkit-appearance:none;width:130px;border:transparent;background:transparent\\">\\n<span id='" + ${reegtest[2]} + "_value'>" + ${reegtest[1]}value + "</span>\\n  </div>\\n</div>";} else {e+='<div class="option">'+t(${reegtest[1]}name)+'<label class="switch"><input type="checkbox" '+(${reegtest[1]}value?'checked="checked"':"")+' id="'+ ${reegtest[2]} +'""><div class="slider"></div></label></div>'}`
                        );
                        Client.checkSrcChange('SettingBuilder');
                    } catch (error) {
                        console.error(error);
                    }
                }
                //--// Lowercase Name
                src = src.replace(/\.toUpperCase\(\)/g, '');
                Client.checkSrcChange('LowerCase function');
                src = src.replace(/text-transform:\s*uppercase;/gim, '');
                Client.checkSrcChange('lowercase css');
                //--// Noob Pass
                src = src.replace('Elite Commander Pass', 'Noobiest Commander Pass');
                Client.checkSrcChange('Noob Pass');
                src = src.replace('LEADERBOARD', 'Leaderboard');
                Client.checkSrcChange('Leaderboard name fix');
                //--// See blank ecps
                src = src.replace(/"blank"\s*!==\s*this\.custom\.badge/, '""!==this.custom.badge');
                Client.checkSrcChange('blank is custom');
                src = src.replace(/case"star":.*?break;/g, `$&case"blank":t.fillStyle="hsla(200, 0%, 0%, 0)";break;`);
                Client.checkSrcChange('Add blank as ecp');
                src = src.replace(
                    /default:t\.fillStyle="hsl\(50,100%,70%\)",t\.fillText\("S",e\/2,i\/2\)/,
                    'case"blank":t.fillStyle="hsla(200, 0%, 0%, 1)";break;default:t.fillStyle="hsl(50,100%,70%)",t.fillText("S",e/2,i/2)'
                );
                Client.checkSrcChange('Blank thingy');
                //--// Always all Mods
                src = src.replace('https://starblast.io/modsinfo.json', 'https://raw.githubusercontent.com/officialtroller/starblast-things/refs/heads/main/modsinfo.js');
                Client.checkSrcChange('All mods');
                //--// High Contrast Material Colors
                src = src.replace(/this\.hue,\.5,1/g, 'this.hue,1,1');
                Client.checkSrcChange('Material hue .5,1');
                //--// Client Fixes
                src = src.replace(/(\.modal\s\.modecp\s*\{\s*[^}]*bottom:\s*)0\b/, '$1auto');
                Client.checkSrcChange('modding space css fix');
                src = src.replace('NEW!', ' ');
                Client.checkSrcChange('modding space new remover');
                src = src.replace(/\(\),this.showModal\("donate"\)/g, '(), this.showModal("donate"), ClientStorage.scroll.bar()');
                Client.checkSrcChange("Scroll ECP's");
                src = src.replace('html5.api.gamedistribution.com/libs/gd/api.js', 'ads.blocked');
                Client.checkSrcChange('ad blocker gamedistribution');
                src = src.replace('https://sdk.crazygames.com/crazygames-sdk-v1.js', 'https://ads.blocked');
                Client.checkSrcChange('ad blocker crazygames');
                src = src.replace('api.adinplay.com/libs/aiptag/pub/NRN/starblast.io/tag.min.js', 'ads.blocked');
                Client.checkSrcChange('ad blocker adinplay');
                src = src.replace(
                    /for\(f=document\.queryselectorall\("\.option\s*input\[type=range\]"\),\s*i=function\(e\)\{.*?,1\)\}\)\}\}/gis,
                    `for (f = document.querySelectorAll(".option input[type=range], .option input[type=color]"), i = function(e) {
					return function(i) {
                        if(i.type === "range"){
                            if (i.id === "emopacity") {
                            i.addEventListener("input", function (s) {
                                return x = document.querySelector("#" + i.getAttribute("id") + "_value"), x.innerText = parseInt(i.value, 10), e.updateSettings(s, !0)
                            })
                        } else {
                            if (i.addEventListener("input", function (s) {
                                return x = document.querySelector("#" + i.getAttribute("id") + "_value"), x.innerText = "0" === i.value ? t("Off") : Math.round(50 * i.value) + " %", e.updateSettings(s, !0)
                            }), i.dispatchEvent(new Event("input")), "sounds" === i.id) return i.addEventListener("change", function (t) {
                                return e.${newnewrgs[0]}.${newnewrgs[1]}.beep(4 + .2 * Math.random(), 1)
                            })
                        }} else if (i.type === "color") {
                            if (i.id === "gemindeed") {
                                i.addEventListener("input", function (s) {
                                    return x = document.querySelector("#" + i.getAttribute("id") + "_value"), x.innerText = i.value, e.updateSettings(s, !0);
                                });
                                i.addEventListener("change", function (s) {
                                        i.value = ClientStorage.gem1();
                                        x = document.querySelector("#" + i.getAttribute("id") + "_value").innerText = i.value;

                                })
                                i.value = ClientStorage.gem1();
                            } else if (i.id === "gemindeed1") {
                                i.addEventListener("input", function (s) {
                                    return x = document.querySelector("#" + i.getAttribute("id") + "_value"), x.innerText = i.value, e.updateSettings(s, !0);
                                });
                                i.addEventListener("change", function (s) {
                                        i.value = ClientStorage.gem2();
                                        x = document.querySelector("#" + i.getAttribute("id") + "_value").innerText = i.value;

                                })
                                i.value = ClientStorage.gem2();
                            }
                        }
					}
				}`
                );
                Client.checkSrcChange('Settings function emote and gem color');
                src = src.replace(
                    /shake:\{[^{}]*\},/,
                    '$&selftag:{name:"Self Ship Tag",value:!0,skipauto:!0,filter:"default,app,mobile"},noturecp:{name:"Spoof ECP",value:!0,skipauto:!0,filter:"default,app,mobile"},'
                );
                Client.checkSrcChange('new default settings');
                src = src.replace(
                    settingsregex,
                    `$&emopacity:{name:"Emote Capacity",value:4,skipauto:!0,type:"range",min:1,max:5,${settingsmatch}:1,filter:"default,app,mobile"},gemindeed:{name:"Gem Color 1",value:ClientStorage.gem2(),skipauto:true,type:"color",filter:"default,app,mobile"},gemindeed1:{name:"Gem Color 2",value:ClientStorage.gem2(),skipauto:true,type:"color",filter:"default,app,mobile"},`
                );
                Client.checkSrcChange('gem color and emote capacity adder');
                //--// Custom Material Detection
                const titreg = src.match(/case\s*"titanium"\s*:(\w+)=t.createLinearGradient\(0,0,0,i\),[\s\S]*?;break;/);
                src = src.replace(titreg[0], `$&case"zinc":${titreg[1]}=t.createLinearGradient(0,0,0,i),${titreg[1]}.addColorStop(0,"#EEE"),${titreg[1]}.addColorStop(1,"#666");break;`);
                Client.checkSrcChange('custom material detect 1');
                const defreg = src.match(/default:(\w+)=t\.createLinearGradient\(0,0,0,i\),\w+\.addColorStop\(0,"#EEE"\),\w+\.addColorStop\(1,"#666"\)/);
                src = src.replace(
                    defreg[0],
                    `default:${defreg[1]}=t.createLinearGradient(0,0,0,i),${defreg[1]}.addColorStop(0,"hsl(0,100%,50%)"),${defreg[1]}.addColorStop(.5,"hsl(60,100%,50%)"),${defreg[1]}.addColorStop(.5,"hsl(120,100%,50%)"),${defreg[1]}.addColorStop(1,"hsl(180,100%,50%)")`
                );
                Client.checkSrcChange('custom material detect 2');
                let pfend = performance.now();
                Client.log(`Modified the Game in ${(pfend - pfstart).toFixed(0)}ms`);
                Client.log('Loading Document');
                document.open();
                document.write(src);
                document.close();
                Client.log('Document loaded');
                Client.log(`Appliying Looks...`);
                let lookstart = performance.now();
                let sbibt = document.createElement('script');
                sbibt.src = 'https://cdn.jsdelivr.net/gh/officialtroller/starblast-things/stationmodels.user.js';
                document.body.appendChild(sbibt);
                let script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/gh/officialtroller/starblast-things/weaponmodels.user.js';
                document.body.appendChild(script);

                function styleing() {
                    var trainingelement = document.getElementById('training');
                    var facebookIcon = document.querySelector('.social .sbg-facebook');
                    var twitterIcon = document.querySelector('.social .sbg-twitter');
                    if (twitterIcon != null) {
                        twitterIcon.remove();
                    }
                    if (facebookIcon != null) {
                        facebookIcon.remove();
                    }
                    if (trainingelement != null) {
                        trainingelement.remove();
                    }
                }
                var styintrvl = setInterval(styleing, 100);
                setTimeout(() => clearInterval(styintrvl), 1000);

                function runtitle() {
                    if (Client.checkgame()) {
                        window.addEventListener('blur', () => {
                            document.title = "u're in-game dude...";
                        });
                    } else {
                        window.addEventListener('blur', () => {
                            document.title = "u're good, enjoy";
                        });
                    }
                }
                window.addEventListener('blur', () => {
                    runtitle();
                });
                let doctitle = document.title;
                window.addEventListener('focus', () => {
                    document.title = doctitle;
                });

                document.addEventListener('keydown', function (e) {
                    if (e.ctrlKey && e.key === 's') {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        window.onbeforeunload = function () {};
                        location.reload();
                        return false;
                    } else if (e.ctrlKey && e.key === 'e') {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        document.querySelector('.social .sbg-gears').click();
                        return false;
                    }
                });
                function fixstyle() {
                    const logo = document.getElementById('logo');
                    if (logo && logo.innerHTML !== `<img src="https://raw.githubusercontent.com/officialtroller/starblast-things/refs/heads/main/starblast_io_logo.svg" crossorigin="Anonymous">`)
                        logo.innerHTML = `<img src="https://raw.githubusercontent.com/officialtroller/starblast-things/refs/heads/main/starblast_io_logo.svg" crossorigin="Anonymous">`;
                }
                var styintrvl1 = setInterval(fixstyle, 100);
                setTimeout(() => clearInterval(styintrvl1), 1000);
                let gemcolor = setInterval(() => {
                    let CrystalObject;
                    for (let i in window) {
                        try {
                            let val = window[i];
                            if ('function' == typeof val.prototype.createModel && val.prototype.createModel.toString().includes('Crystal')) {
                                CrystalObject = val;
                                clearInterval(gemcolor);
                                break;
                            }
                        } catch (e) {}
                    }

                    if (CrystalObject != null) {
                        let oldModel = CrystalObject.prototype.getModelInstance;

                        CrystalObject.prototype.getModelInstance = function () {
                            let res = oldModel.apply(this, arguments);
                            let color = ClientStorage.gem1();
                            let specular = ClientStorage.gem2();
                            this.material.color.set(color);
                            this.material.specular.set(specular);
                            return res;
                        };
                    }
                }, 100);
                let explolight = setInterval(() => {
                    if (window.Explosions != null) {
                        clearInterval(explolight);
                        let oldExplosion = Explosions.prototype.explode,
                            oldBlast = Explosions.prototype.blast;

                        let globalVal = oldExplosion
                            .toString()
                            .match(/this\.([0OlI1\.]+)\.settings\.check/)[1]
                            .split('.');

                        Explosions.prototype.isEnabled = function () {
                            let _this = this;
                            for (let i of globalVal) _this = _this[i];
                            return _this.settings.check('explolight');
                        };

                        Explosions.prototype.explode = function () {
                            return this.isEnabled() && oldExplosion.apply(this, arguments);
                        };

                        Explosions.prototype.blast = function () {
                            return this.isEnabled() && oldBlast.apply(this, arguments);
                        };
                    }
                }, 100);
                let panel = setInterval(() => {
                    if (window.ChatPanel != null) {
                        clearInterval(panel);
                        ChatPanel.prototype.typed = new Function("return " + ChatPanel.prototype.typed.toString().replace(">=4", ">=ClientStorage.emotes()"))();
                    }
                }, 100);
                setTimeout(function () {
                    !(function () {
                        let e, t;
                        for (let n in window)
                            try {
                                let i = window[n].prototype;
                                if (null != i)
                                    for (let o in i) {
                                        let s = i[o];
                                        if ('function' == typeof s && s.toString().match(/([^,]+)("hsla\(180,100%,75%,\.75\)")/)) {
                                            let l;
                                            (e = n),
                                                (i[(t = Object.keys(i).find(e => 'function' == typeof i[e] && (l = (i[e].toString().match(/===(\w+\.[^,]+)\.hue/) || [])[1])))] = Function(
                                                    'return ' + i[t].toString().replace(/(\.id)/, '$1, this.selfShip = this.shipid == ' + l + '.id')
                                                )()),
                                                (i[o] = Function('return ' + s.toString().replace(/([^,]+)("hsla\(180,100%,75%,\.75\)")/, "$1 this.selfShip ? 'hsla(180,100%,75%,.75)' : $2"))());
                                        }
                                    }
                            } catch (r) {}
                        let a = Object.getPrototypeOf(Object.values(Object.values(window.module.exports.settings).find(e => e && e.mode)).find(e => e && e.background)),
                            d = a.constructor,
                            c = d.prototype,
                            u = d.toString(),
                            hue = u.match(/(\w+)\.hue/)[1],
                            f = u.match(/(\w+)\.add\(/)[1],
                            h = u.match(/chat_bubble\.(\w+)/)[1];
                        ((d = Function(
                            'return ' + u.replace(/}$/, ', this.welcome || (this.ship_tag = new ' + e + '(Math.floor(360 * 0)), this.' + f + '.add(this.ship_tag.' + h + '))}')
                        )()).prototype = c),
                            (d.prototype.constructor = d),
                            (a.constructor = d),
                            (d.prototype.updateShipTag = function () {
                                if (null != this.ship_tag) {
                                    if (!this.shipKey) {
                                        this.shipKey = Object.keys(this).find(e => this[e] && this[e].ships);
                                        let e = this[this.shipKey];
                                        this.statusKey = Object.keys(e).find(t => e[t] && e[t].status);
                                    }
                                    let n = this[hue],
                                        i = this[this.shipKey][this.statusKey];
                                    this.ship_tag[t](n, n.names.get(i.status.id), i.status, i.instance);
                                    let o = this.ship_tag[h].position;
                                    (o.x = i.status.x),
                                        (o.y = i.status.y - 2 - i.type.radius),
                                        (o.z = 1),
                                        (this.ship_tag[h].visible = 'true' == localStorage.getItem('selftag') && i.status.alive && !i.status.guided);
                                }
                            });
                        let m = Object.keys(c).find(e => 'function' == typeof c[e] && c[e].toString().includes('render'));
                        d.prototype[m] = Function('return ' + d.prototype[m].toString().replace(/(\w+\.render)/, 'this.updateShipTag(), $1'))();
                        let g = function (...e) {
                            return window.module.exports.translate(...e);
                        };
                        for (let $ in window)
                            try {
                                let y = window[$];
                                if ('function' == typeof y.prototype.refused)
                                    for (let v in y.prototype) {
                                        let b = y.prototype[v];
                                        'function' == typeof b && b.toString().includes('new Scene') && (y.prototype[v] = Function('Scene', 't', 'return ' + b.toString())(d, g));
                                    }
                            } catch (_) {}
                    })();
                }, 1100);
                let MUIP = ModdingUIComponent.prototype,
                    hide = MUIP.hide,
                    set = ModdingMode.prototype.setUIComponent,
                    specs = ModdingUIComponent.toString()
                        .match(/,\s*this.([^=]+?\s*).add/)[1]
                        .split('.'),
                    getGroup = function (_this) {
                        for (let spec of specs) _this = _this[spec];
                        return _this;
                    },
                    isHidden = function (ui) {
                        return (!Array.isArray(ui.components) || ui.components.filter(i => ['round', 'box', 'player', 'text'].includes((i || {}).type)).length == 0) && !ui.clickable;
                    };

                GenericMode.prototype.setUIComponent = ModdingMode.prototype.setUIComponent = function (ui) {
                    if (ui == null)
                        ui = {
                            visible: false,
                        };
                    if (!Array.isArray(ui.position)) ui.position = [];
                    let idealPos = [0, 0, 100, 100],
                        pos = [];
                    if (ui.visible != null && !ui.visible) pos = [0, 0, 0, 0];
                    else for (let i = 0; i < idealPos.length; ++i) pos.push(ui.position[i] == null || isNaN(ui.position[i]) ? idealPos[i] : +ui.position[i]);
                    ui.position = pos;
                    if (!((ui.visible != null && !ui.visible) || isHidden(ui)) || (this.ui_components != null && this.ui_components[ui.id])) return set.call(this, ui);
                };

                MUIP.interfaceHidden = function () {
                    return (this.interface_hidden = !0), hide.apply(this, arguments);
                };

                MUIP.hide = function () {
                    if (!this.firstHide) {
                        this.shown = this.firstHide = true;
                    }
                    let shown = this.shown,
                        result = hide.apply(this, arguments);
                    if (shown) {
                        return setTimeout(
                            function (t) {
                                if (!t.shown) {
                                    getGroup(t).remove(t);
                                    if (t[specs[0]].mode.ui_components != null) delete t[specs[0]].mode.ui_components[t.component.id];
                                }
                            },
                            1e3,
                            this
                        );
                    }
                    return result;
                };

                let key = Object.keys(MUIP).find(key => 'function' == typeof MUIP[key] && MUIP[key].toString().includes('this.shown=!0')),
                    show = MUIP[key];
                MUIP[key] = function () {
                    if (isHidden(this.component)) return this.hide();
                    let group = getGroup(this);
                    if (!this.shown) return !group.children.includes(this) && group.add(this, this.component.position), show.call(this, arguments);
                };
                let spoofecp = setInterval(() => {
                    if (window.WebSocket != null) {
                        clearInterval(spoofecp);
                        let t = WebSocket.prototype.send;
                        WebSocket.prototype.send = function (msg) {
                            try {
                                let parsed = JSON.parse(msg);
                                if (!parsed.data || !parsed.data.hasOwnProperty('ecp_key')) throw 'Invalid message structure';

                                if (localStorage.getItem('noturecp') == 'true') {
                                    if (localStorage.getItem('ECPSPOOF') !== null) {
                                        parsed.data.ecp_key = localStorage.getItem('ECPSPOOF');
                                        parsed.data.steamid = null;
                                    } else return t.apply(this, arguments);
                                } else if (localStorage.getItem('noturecp') == 'false') {
                                    if (localStorage.getItem('ECPSPOOF') !== null) {
                                        parsed.data.ecp_key = localStorage.getItem('ECPSPOOF');
                                        parsed.data.steamid = null;
                                    } else return t.apply(this, arguments);
                                }
                                arguments[0] = JSON.stringify(parsed);
                            } catch (e) {}
                            return t.apply(this, arguments);
                        };
                    }
                }, 100);
                setInterval(() => {
                    let frecp = localStorage.getItem('ECPKey'),
                        realecp = localStorage.getItem('ECPSPOOF'),
                        getecp = document.getElementById('ECPKey');

                    if (localStorage.getItem('noturecp') == 'true') {
                        if (localStorage.getItem('ECPSPOOF') === null) {
                            localStorage.setItem('ECPSPOOF', localStorage.getItem('ECPKey'));
                        }
                        localStorage.setItem('ECPKey', 'My Secret Key');

                        if (getecp !== null && getecp.getAttribute('data-value') != localStorage.getItem('ECPKey')) {
                            getecp.setAttribute('data-value', localStorage.getItem('ECPKey'));
                        }
                    } else if (localStorage.getItem('noturecp') == 'false') {
                        if (localStorage.getItem('ECPSPOOF') !== null && localStorage.getItem('ECPKey') == 'My Secret Key') {
                            localStorage.setItem('ECPKey', localStorage.getItem('ECPSPOOF'));

                            if (getecp !== null && getecp.getAttribute('data-value') != localStorage.getItem('ECPSPOOF')) {
                                getecp.setAttribute('data-value', localStorage.getItem('ECPSPOOF'));
                            }
                        }
                    }
                }, 100);
                let looksend = performance.now();
                Client.log(`Looks applied in ${(looksend - lookstart).toFixed(0)}ms`);
            } catch (error) {
                console.error(error);
            }
        }
    };
    xhr.send();
    let fullend = performance.now();
    Client.log(`Script executed in ${(fullend - fullstart).toFixed(0)}ms`);
}
let ModdingClient = new (class {
    log(msg) {
        console.log(`%c[Modding Client] ${msg}`, 'color: #c4bf9f');
    }
})();

function ModdingLoader() {
    'use strict';
    document.open();
    document.write(
        `<html><head><title>Loading...</title></head><body style="background-color:#293449;"><div style="margin: auto; width: 50%;"><h1 style="text-align: center;padding: 170px 0;">Loading client</h1><h1 style="text-align: center;">Please wait</h1></div></body></html>`
    );
    document.close();
    var url = 'https://starblast.io/modding.html';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var src = xhr.responseText;
            const start_time = performance.now();
            if (localStorage.getItem('ECPKey') === 'My Secret Key' && localStorage.getItem('ECPSPOOF') !== null)
                src = src.replace('ecp_key: new ECP().key', 'ecp_key:localStorage.getItem("ECPSPOOF"),');
            const end_time = performance.now();
            ModdingClient.log(`Patched src successfully (${(end_time - start_time).toFixed(0)}ms)`);
            document.open();
            document.write(src);
            document.close();
        }
    };
    xhr.send();
}
//--// run function
if (window.location.pathname == '/') {
    setTimeout(ClientLoader, 1);
}
if (window.location.pathname == '/modding.html') {
    setTimeout(ModdingLoader, 1);
}

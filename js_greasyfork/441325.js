// ==UserScript==
// @name         GBF_mohe
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.2.5
// @description  战斗胜利自动跳转,自定义首页, 团灭通知,胜利通知,显血(可以关闭),攻击自动刷新,自动粘贴你舔婊网复制的id
// @author       moo
// @require      https://cdn.bootcdn.net/ajax/libs/vue/2.6.12/vue.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/ramda/0.27.1/ramda.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @match        http://game.granbluefantasy.jp/
// @match        https://gbf-raidfinder.la-foret.me/
// @match        https://gbf-tbw.tk/
// @match        https://gbf-raidfinder-tw.herokuapp.com/
// @grant        GM_log
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        unsafeWindow
/* global        $, stage, Game, R Vue */
// @downloadURL https://update.greasyfork.org/scripts/441325/GBF_mohe.user.js
// @updateURL https://update.greasyfork.org/scripts/441325/GBF_mohe.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const currencyFormat = function (value, currency, decimals) {
        value = parseFloat(value)
        if (!isFinite(value) || (!value && value !== 0)) return ''
        currency = currency != null ? currency : ' ¥'
        decimals = decimals != null ? decimals : 2
        var stringified = Math.abs(value).toFixed(decimals)
        var _int = decimals ?
            stringified.slice(0, -1 - decimals) :
        stringified
        var i = _int.length % 3
        var head = i > 0 ?
            (_int.slice(0, i) + (_int.length > 3 ? ',' : '')) :
        ''
        var _float = decimals ?
            stringified.slice(-1 - decimals) :
        ''
        var sign = value < 0 ? '-' : ''
        return sign + head +
            _int.slice(i).replace(/(\d{3})(?=\d)/g, '$1,') +
            _float +
            currency
    }
    const tryParseJSON = text => {
        let json;
        try {
            json = JSON.parse(text);
        } catch (e) {
            if (e instanceof SyntaxError) {
                return text;
            }
            throw e;
        }
        return json;
    };
    GM_addStyle(`
        .el-switch {
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    position: relative;
    font-size: 14px;
    line-height: 20px;
    height: 20px;
    vertical-align: middle;
}
.el-switch__input {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    margin: 0;
}
.el-switch__core, .el-switch__label {
    display: inline-block;
    cursor: pointer;
}
.el-switch__core {
    margin: 0;
    position: relative;
    width: 40px;
    height: 20px;
    border: 1px solid #dcdfe6;
    outline: 0;
    border-radius: 10px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background: #dcdfe6;
    -webkit-transition: border-color .3s,background-color .3s;
    transition: border-color .3s,background-color .3s;
    vertical-align: middle;
}
.el-switch.is-checked .el-switch__core {
    border-color: #409eff;
    background-color: #409eff;
}
.el-switch__core:after {
    content: "";
    position: absolute;
    top: 1px;
    left: 1px;
    border-radius: 100%;
    -webkit-transition: all .3s;
    transition: all .3s;
    width: 16px;
    height: 16px;
    background-color: #fff;
}
.el-switch.is-checked .el-switch__core::after {
    left: 100%;
    margin-left: -17px;
}
#vue-app {position: fixed; left: 0;bottom:0;top:0; z-index: 999999; width: 56px;background: #150f0f; color: #eaeaea; box-shadow: 0 0 3px rgba(0,0,0, .4);}
#vue-app .main {width: 100%;}
.ml-10 {margin-left: 10px!important;}
.mb-10 {margin-bottom: 10px!important;}
.box-button {height: 56px; display: flex; align-items:center;justify-content: center; cursor: pointer; transition: all ease-out .2s}
.box-button:hover {background: #cae8ed; color: #444;}
.boss-hp {width: 212px; display:flex;justify-content: space-between;position: absolute;left: 72px;z-index: 9999999;bottom:14px;color: #fff; text-shadow: 0 0 1px rgba(0,0,0,1)}
body.jssdk > div:first-of-type > div:first-of-type {
    display:none
}
body.jssdk > div:first-of-type {
padding-left: 56px;
}

.prt-multilog {display:none!important}
.prt-targeting-area[type="l1"] .hp {
    position: relative;
    top: 4px;
    transform: scale(.8);
}
.prt-targeting-area[type="l3"] .hp {
    position: relative;
    top: -6px;
    transform: scale(.8);
}
.prt-targeting-area[type="l2"] .hp {
    position: relative;
    top: -6px;
    transform: scale(.8);
}
    `)
    $('body').on('click', '[data-raidid]', (e) => {
        const raidId = $(e.currentTarget).attr('data-raidid')
        GM_setValue('RAID_ID', raidId)
    })
    if (location.href.match('granbluefantasy')) {
        $('body').append('<div id="vue-app" />')
    }
    const RebackRadio = {
        name: 'reback-radio',
        model: {
            prop: 'reback',
            event: 'change'
        },
        props: {
            reback: Boolean
        },
        template: `<div class="box-button" title="是否战斗完自动跳转到你设定的首页" @click="switchType"><div role="switch" class="el-switch mb10" :class="{'is-checked': this.reback}"><input ref="input" type="checkbox" name="" true-value="true" v-model="reback" class="el-switch__input"><span class="el-switch__core" style="width: 40px;"></span></div></div>`,
        methods: {
            switchType() {
                GM_setValue('reback', !this.reback)
                this.$emit('change', !this.reback)
            }
        }
    }
    const ReloadRadio = {
        name: 'reload-radio',
        model: {
            prop: 'reload',
            event: 'change'
        },
        props: {
            reload: Boolean
        },
        template: `<div class="box-button" title="是否战斗时自动刷新" @click="switchType"><div role="switch" class="el-switch mb10" :class="{'is-checked': this.reload}"><input ref="input" type="checkbox" name="" true-value="true" v-model="reload" class="el-switch__input"><span class="el-switch__core" style="width: 40px;"></span></div></div>`,
        methods: {
            switchType() {
                GM_setValue('auto-reload', !this.reload)
                this.$emit('change', !this.reload)
            }
        }
    }
    const HpRadio = {
        name: 'hp-radio',
        model: {
            prop: 'showHp',
            event: 'change'
        },
        props: {
            showHp: Boolean
        },
        template: `<div class="box-button" title="是否显示HP,切换后需刷新页面" @click="switchType"><div role="switch" class="el-switch mb10" :class="{'is-checked': this.showHp}"><input ref="input" type="checkbox" name="" true-value="true" v-model="showHp" class="el-switch__input"><span class="el-switch__core" style="width: 40px;"></span></div></div>`,
        methods: {
            switchType() {
                GM_setValue('show-hp', !this.showHp)
                this.$emit('change', !this.showHp)
            }
        }
    }
    const HomePage = {
        name: 'home-page',
        data() {
            return {
                homePage: GM_getValue('reback-href')
            }
        },
        template: `<div class="box-button" title="手动跳转到首页"  @click="go">首页</div>`,
        methods: {
            go() {
                location.href = this.homePage
            }
        }
    }
    const SetRebackHref = {
        name: 'set-reback-href',
        model: {
            prop: 'href',
            event: 'change'
        },
        props: {
            href: {
                type: String
            }
        },
        template: `<div id="set-reback-href" class="box-button" title="设定当前页为首页" @click="setRebackHref">设置</div>`,
        methods: {
            setRebackHref() {
                this.$emit('change', location.href)
                GM_setValue('reback-href', location.href)
            }
        }
    }
    const GBF_RAIDS = new Vue({
        el: '#vue-app',
        components: {
            'set-reback-href': SetRebackHref,
            'reback-radio': RebackRadio,
            'reload-radio': ReloadRadio,
            'hp-radio': HpRadio,
            'home-page': HomePage
        },
        template: `<section id="vue-app" class="el-container">
        <main class="main">
          <reback-radio v-model="isReback" />
          <reload-radio v-model="isAutoReload" />
          <hp-radio v-model="showHp" />
          <raid-button />
          <set-reback-href v-model="href" />
          <home-page />
        </main>
     </section>`,
        data: {
            href: GM_getValue('reback-href'),
            isReback: GM_getValue('reback') || false,
            isAutoReload: GM_getValue('auto-reload') || false,
            showHp: GM_getValue('show-hp') || false
        }
    })

    const customLoad = (xhr, ...args) => {
        let hpCheck
        const url = new URL(xhr.responseURL);
        const req = tryParseJSON(args[0]);
        const res = tryParseJSON(xhr.response);
        //自动刷新
        if (url.href.match('normal_attack_result.json')) {
            if (GM_getValue('auto-reload')) {
                location.reload()
            }
        }

        if((url.href.match('multiraid/update_mvp_info')||url.href.match('multiraid/start')) && GM_getValue('show-hp') && stage) {
            GM_setValue('boss-hp', [])
            hpCheck = setInterval(() => {
                try {
                    if (!stage.gGameStatus) return
                    const bossInfo = stage.gGameStatus.boss.param.map(info => {
                        if (!info) return {}
                        return { target: info.pos ? info.pos + 1 : info.number, _hp: +info.hp, hp: currencyFormat(info.hp, '', 0), hp_rate: currencyFormat(info.hp / info.hpmax * 100, '%', 4)}
                    })

                    let flag = false
                    bossInfo.forEach((boss) => {
                        const oldBoss = R.find(R.propEq('target', boss.target))(GM_getValue('boss-hp'))
                        if (!oldBoss && boss.hp != 0) {
                            flag = true
                            return
                        }
                        if (boss._hp < oldBoss._hp) {
                            flag = true
                        }
                    })

                    if (flag) {
                        GM_setValue('boss-hp', bossInfo)
                    }
                    if (stage.gGameStatus.clear) {
                        clearInterval(hpCheck)
                    }
                } catch(e) {
                    console.error(e)
                    clearInterval(hpCheck)
                }

            }, 520)

        }
        if (url.href.match('normal_attack_result.json') || url.href.match('ability_result.json')) {
            //stage.gGameParam.fps = 12 + Math.random()
        }
        // 死亡
        if (res.status && res.status.ability.length === 0) {
            GM_notification({ text: '全灭了', title: 'GBF', timeout: 5000 })
        }
        // 胜利
        if (res.rewards && res.values) {
        //    GM_notification({ text: '战斗胜利', title: 'GBF', timeout: 50 })
            setTimeout(function() {
                if (GM_getValue('reback-href') && GM_getValue('reback')) {
                    location.href = GM_getValue('reback-href')
               }
            })
        }
        //boss血量
        if(res.scenario && GM_getValue('show-hp')) {
            const isWin = res.scenario.find(item => item.cmd === 'win')
            if (isWin) {
                $(`.prt-enemy-percent[target]`).html(`<div class="hp"><span>DIED</span></div>`)
            } else {
                try {
                    const bossInfo = R.compose(R.map(boss => {
                        return boss.map(info => {
                            return { target: info.pos + 1, _hp: info.hp, hp: currencyFormat(info.hp, '', 0), hp_rate: currencyFormat(info.hp / info.hpmax * 100, '%', 4)}
                        }).reduce((a, b) => {
                            return a._hp < b._hp ? a : b
                        }, {_hp: Infinity})
                    }), R.groupWith(R.eqProps('pos')), R.filter(R.propEq('cmd', 'boss_gauge')))(res.scenario)
                    GM_setValue('boss-hp', bossInfo)
                } catch(e) {
                    console.error(e)
                }
            }
            //if (!$('.boss-hp').length) {
            //    $('.cnt-raid-header').append(`<div class="boss-hp"><span>${hp[0]}</span><span>${hp[1]}</span></div>`)
            //} else {
            //    $('.boss-hp').html(`<span>${hp[0]}</span><span>${hp[1]}</span>`)
            //}
        }
        //resetAllianceMember
    }
    const origSend = unsafeWindow.XMLHttpRequest.prototype.send;
    unsafeWindow.XMLHttpRequest.prototype.send = function (...args) {
        this.addEventListener('load', () => {
            if (this.status === 200) {
                customLoad(this, args);
            }
        });
        origSend.apply(this, args);
    };
    GM_addValueChangeListener('boss-hp', function(bossInfo, old_value, new_value) {
        new_value.forEach(boss => {
            $(`.prt-enemy-percent[target="${boss.target}"]`).eq(0).html(`<div class="hp"><span>${boss.hp_rate}</span><span style="position:absolute; left:0;top: 37px;">${boss.hp}</span></div>`)
        })
    })
    GM_addValueChangeListener('RAID_ID', function(name, old_value, new_value) {
        $('.frm-battle-key').val(new_value)
    })
})();
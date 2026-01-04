// ==UserScript==
// @name                No Maj-soul CV Voice
// @name:zh-CN          禁止报菜名
// @namespace           NoMajsoulCVVoice
// @license             AGPL-3.0-only
// @version             0.0.1
// @description         Disable CV voice without influncing any other stuffs.
// @description:zh-CN   再报菜名就让你风风光光 / 禁用角色报菜名但不影响吃碰杠
// @author              FurryR
// @match               https://game.maj-soul.com/1/
// @match               https://game.mahjongsoul.com/index.html
// @match               https://game.mahjongsoul.com/
// @icon                https://www.google.com/s2/favicons?sz=64&domain=maj-soul.com
// @grant               none
// @run-at              document-start
// @downloadURL https://update.greasyfork.org/scripts/520772/No%20Maj-soul%20CV%20Voice.user.js
// @updateURL https://update.greasyfork.org/scripts/520772/No%20Maj-soul%20CV%20Voice.meta.js
// ==/UserScript==

;(function() {
    'use strict'
    function makeSafe(obj) {
        return new Proxy(obj, {
            get(target, p) {
                const _some = Array.prototype.some
                Array.prototype.some = () => false
                const res = Reflect.get(target, p)
                Array.prototype.some = _some
                return res
            },
            set(target, p, value) {
                const _some = Array.prototype.some
                Array.prototype.some = () => false
                const res = Reflect.set(target, p, value)
                Array.prototype.some = _some
                return res
            }
        })
    }
    window.onerror = null
    let view = undefined
    Object.defineProperty(window, 'view', {
        get: () => view,
        set: (v) => {
            v = makeSafe(v)
            if (v.DesktopMgr) {
                const _initRoom = v.DesktopMgr.prototype.initRoom
                v.DesktopMgr.prototype.initRoom = function (w, k, B, t, f) {
                    _initRoom.call(this, w, k, B, t, f)
                    console.log(this.player_datas)
                    for (const player_data of this.player_datas) {
                        player_data.character.level = 0
                        player_data.character.exp = 0
                    }
                }
                v.DesktopMgr.prototype.playMindVoice = function () {}
            }
            console.log(v)
            view = v
        }
    })
})()
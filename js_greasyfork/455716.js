// ==UserScript==
// @name Gats.IO Enhanced
// @namespace -
// @version 1.2.0
// @description zoom hack (use mouse wheel), anti-camo, anti-silencer, anti-landmine and more
// @author NotYou
// @match *://gats.io/*
// @match *://gats2.com/*
// @match *://www.gats.io/*
// @match *://www.gats2.com/*
// @run-at document-end
// @license GPL-3.0-or-later
// @grant none
// @icon data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/455716/GatsIO%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/455716/GatsIO%20Enhanced.meta.js
// ==/UserScript==

(function() {
    let funModifications = {
        fatPlayers: false,
        alwaysDashing: false,
    }

    let forcedPremiumEnabled = true
    let zoomHackEnabled = true

    // Fun Modifications

    init(() => {
        Object.keys(funModifications).forEach(e => {
            let value = funModifications[e]
            let propName
            let props

            switch(e) {
                case 'fatPlayers':
                    propName = 'radius'
                    props = {
                        set(value) {
                            this._radius = value + 2.5

                            if(value === 0) {
                                this._radius = 0
                            }
                        },

                        get() {
                            return this._radius
                        }
                    }
                    break
                case 'alwaysDashing':
                    propName = 'dashing'
                    props = {
                        get() {
                            if(this.c2) {
                                return 1
                            }
                        }
                    }
            }

            if(value) {
                Object.defineProperty(Object.prototype, propName, props)
            }
        })
    })

    // Right Click for Spacebar

    init(() => {
        let events = ['down', 'up']

        events.forEach(e => {
            window.addEventListener('mouse' + e, onClick)
        })

        function onClick(e) {
            let list = window.RF.list

            if((e.button === 2 || e.which === 3) && list && list.length) {
                let socket = list[0].socket
                let type = e.type === 'mouseup' ? 0 : 1

                socket.send('k,5,' + type)
            }
        }
    })

    // Ad Block

    init(() => {
        let classes = ['ad', 'ads', 'ad-group', 'ad-placement', 'adsbox', 'ad-unit-container'].map(e => '.' + e)
        let ids = ['adHome', 'adRespawnLeft', 'adRespawnRight', 'adRespawnTop', 'adTopLeft'].map(e => '#' + e)
        let ads = classes.concat(ids)
        let adsCss = ads + '{display:none !important;}'

        let styleNode = document.createElement('style')
        styleNode.appendChild(document.createTextNode(adsCss))
        document.head.appendChild(styleNode)
    })

    // Force Premium

    init(() => {
        if(forcedPremiumEnabled) {
            Object.defineProperty(Object.prototype, 'isPremiumMember', {
                get() {
                    if(this.c2) {
                        return 1
                    }
                }
            })
        }
    })

    // Anti-Landmine (Visible Landmines)

    init(() => {
        Object.defineProperty(Object.prototype, 'pool', {
            set(value) {
                let landMine = window.landMine

                if(landMine) {
                    landMine[0].map(e => {
                        let final = e.concat()
                        final[1][3] = '#000000'
                        return final
                    })
                }

                this._pool = value
            },

            get() {
                return this._pool
            }
        })
    })

    init(() => {
        defineProps([
            // Anti-Camo

            ['ghillie', 0],

            // Anti-Silencer (No Invisible Bullets)

            ['silenced', 0],
        ])
    })

    // Zoom Hack

    init(() => {
        if(zoomHackEnabled) {
            window.addEventListener('wheel', function(e) {
                let reRender = window.a1

                if(reRender) {
                    for (let i = 0; i < 2; i++) {
                        let prop = 'j' + (i === 0 ? 7 : 8)
                        let value = e.deltaY < 0 ? .95 : 1.1

                        window[prop] *= value
                        window[prop] = Math.min(3e3, Math.max(1e3, window[prop]))
                    }

                    reRender()
                }
            })
        }
    })

    function init(fn) {
        try {
            fn()
        } catch(e) {
            let error = new Error('Gats.IO Enchanced: ' + e)
            console.dir(error.message + '\n' + error.stack)
        }
    }

    function defineProps(structure) {
        structure.forEach(e => {
            defineProp(e[0], e[1])
        })
    }

    function defineProp(propName, returnValue) {
        return Object.defineProperty(Object.prototype, propName, {
            get() {
                return returnValue
            }
        })
    }
})()
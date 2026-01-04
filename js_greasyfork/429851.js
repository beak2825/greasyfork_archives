// ==UserScript==
// @name        IAmNotWebWigo
// @description Avoid emulator detection by impersonating a real device
// @match       *://webwigo.net/*
// @match       *://www.webwigo.net/*
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_unsafeWindow
// @version     1.2
// @author      Louhikoru
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @namespace   https://greasyfork.org/en/scripts/429851
// @homepageURL https://greasyfork.org/en/scripts/429851
// @supportURL  https://greasyfork.org/en/scripts/429851/feedback
// @license     The Coffeeware License
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/429851/IAmNotWebWigo.user.js
// @updateURL https://update.greasyfork.org/scripts/429851/IAmNotWebWigo.meta.js
// ==/UserScript==
(function() {
    'use strict'

    /* workaround WebWigo bug in info.js line 87 */
    window.eval("window.nothers = 0")

    GM_config.init({
        'id': 'IAmNotWebWigo',
        'title': 'Configure "I Am Not WebWigo"',
        'fields': {
            'device': {
                'label': 'Device to emulate',
                'type': 'select',
                'options': ['DesktopWIG', 'Garmin', 'iPhone', 'OpenWIG', 'PPC2003', 'webwigo', 'WhereYouGo', 'Wherigo Builder', 'xmarksthespot'],
                'default': 'webwigo'
            },
            'log_zone_refresh': {
                'label': 'Log zone details on refresh',
                'type': 'checkbox',
                'default': true
            },
            'random_altitude': {
                'label': 'Randomize altitude',
                'type': 'checkbox',
                'default': true
            },
            'show_hidden_zones': {
                'label': 'Show hidden zones',
                'type': 'checkbox',
                'default': true
            }
        },
        'css':
        '#IAmNotWebWigo .config_header { padding: 0px 0px 10px; font-size: 16pt; white-space: nowrap; }\n'+
        '#IAmNotWebWigo .config_var { padding: 1px 0px 1px; }\n'
    })

    GM_config.onOpen = function(document, window, frame) {
        frame.style.width = '310px'
        frame.style.height = '215px'
        frame.style.inset = '0'
        frame.style.margin = 'auto'
    }

    GM_config.onSave = function() {
        location.reload()
    }

    GM_registerMenuCommand('Configure', GM_config.open.bind(GM_config), 'C')

    $(()=> {
        const _get = jQuery.get
        jQuery.get = function() {
            if (arguments[0] != 'lua/WIGInternal.lua') {
                return _get.apply(this, arguments)
            }
            arguments[1] = ((_super)=>{
                return function() {
                    if (GM_config.get('random_altitude'))
                        arguments[0] = arguments[0].replace('local alt = 0', 'local alt = 1 + math.random(99)')

                    switch(GM_config.get('device')) {
                        case 'DesktopWIG':
                            arguments[0] = arguments[0].replace('"emscripten"','"J2SE"')
                            arguments[0] = arguments[0].replace('"webwigo"', '"dsktpwig"')
                            arguments[0] = arguments[0].replace('"browser"', '"undefined"')
                            break
                        case 'Garmin':
                            arguments[0] = arguments[0].replace('"emscripten"','"Vendor 1 ARM9"')
                            arguments[0] = arguments[0].replace('"webwigo"', '"'+[...Array(10)].map(()=>Math.floor(Math.random()*10).toString()).join('')+'"')
                            arguments[0] = arguments[0].replace('"browser"', '"Windows PPC"')
                            break
                        case 'iPhone':
                            arguments[0] = arguments[0].replace('"emscripten"','"iPhone OS 14.7"')
                            arguments[0] = arguments[0].replace('"webwigo"', '"'+[...Array(16)].map(()=>Math.floor(Math.random()*16).toString(16)).join('')+'"')
                            arguments[0] = arguments[0].replace('"browser"', '"Windows PPC"')
                            break
                        case 'OpenWIG':
                            arguments[0] = arguments[0].replace('"emscripten"','"MIDP-2.0/CLDC-1.1"')
                            arguments[0] = arguments[0].replace('"webwigo"', '"undefined"')
                            arguments[0] = arguments[0].replace('"browser"', '"undefined"')
                            break
                        case 'PPC2003':
                            arguments[0] = arguments[0].replace('"emscripten"','"PocketPC 2003"')
                            arguments[0] = arguments[0].replace('"webwigo"', '"'+[...Array(16)].map(()=>Math.floor(Math.random()*16).toString(16)).join('')+'"')
                            arguments[0] = arguments[0].replace('"browser"', '"Windows PPC"')
                            break
                        case 'WhereYouGo':
                            arguments[0] = arguments[0].replace('"emscripten"','"MIDP-2.0/CLDC-1.1"')
                            arguments[0] = arguments[0].replace('"webwigo"', '"WhereYouGo"')
                            arguments[0] = arguments[0].replace('"browser"', '"Windows PPC"')
                            break
                        case 'Wherigo Builder':
                            arguments[0] = arguments[0].replace('"emscripten"','"Win32"')
                            arguments[0] = arguments[0].replace('"webwigo"', '"Desktop"')
                            arguments[0] = arguments[0].replace('"browser"', '"Windows PPC"')
                            break
                        case 'xmarksthespot':
                            arguments[0] = arguments[0].replace('"emscripten"','"xmarksthespot"')
                            arguments[0] = arguments[0].replace('"webwigo"', '"Python"')
                            arguments[0] = arguments[0].replace('"browser"', '"PocketPC"')
                            break
                        default:
                            /* webwigo */
                            break
                    }
                    return _super.apply(this, arguments)
                }
            })(arguments[1])
            return _get.apply(this, arguments)
        }
    })

    require([
        "lib/m_emu",
        "lib/m_gwc",
        "lib/m_map"
    ], function(mEMU, mGWC, mMAP) {
        mGWC.prototype.canSeeHiddenZones = function() {
            return GM_config.get('show_hidden_zones')
        }

        mMAP.RefreshZone = ((_super)=>{
            return function() {
                if (GM_config.get('log_zone_refresh')) {
                    const obj = arguments[0]
                    if (obj.active)
                        mEMU.Print("RefreshZone: " + JSON.stringify(obj))
                }
                return _super.apply(this, arguments)
            }
        })(mMAP.RefreshZone)
    })
})();
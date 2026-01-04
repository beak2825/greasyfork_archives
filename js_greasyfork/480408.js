// ==UserScript==
// @name         Building Health Bars
// @namespace    https://github.com/Nudo-o
// @version      1
// @description  Shows the health of buildings.
// @author       @nudoo
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moomoo.io
// @require      https://update.greasyfork.org/scripts/480301/1283571/CowJS.js
// @require      https://update.greasyfork.org/scripts/480303/1282926/MooUI.js
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/480408/Building%20Health%20Bars.user.js
// @updateURL https://update.greasyfork.org/scripts/480408/Building%20Health%20Bars.meta.js
// ==/UserScript==

(function() {
    "use strict"

    const { Cow, CowUtils, MooUI } = window

    let settings = {
        "health-bars": true,
        "circle-bars": false,
        "in-look-dir": false,
        "in-weapon-range": false,
        "weapon-range-mult": "1",
        "bars-color": "#933db8",
        "hit-counter": false
    }

    const settingsMap = Object.entries(settings)
    const storageName = "building-health-settings"

    function setVisualSetting(key, value) {
        settings[key] = value

        localStorage.setItem(storageName, JSON.stringify(settings))
    }

    for (let i = 0; i < settingsMap.length; i++) {
        const visualSettings = JSON.parse(localStorage.getItem(storageName) || null)

        if (!visualSettings) {
            localStorage.setItem(storageName, JSON.stringify(settings))

            break
        }

        if (!visualSettings.hasOwnProperty(settingsMap[i][0])) {
            setVisualSetting(settingsMap[i][0], settingsMap[i][1])
        }
    }

    settings = JSON.parse(localStorage.getItem(storageName))

    const columnsSettings = {
        settings: {
            targetColumn: "settings",
            togglers: [{
                key: "health-bars",
                name: "Health bars",
                description: "Shows the health of buildings.",
                isActive: settings["health-bars"],
                options: [
                    new MooUI.OptionCheckbox({
                        key: "circle-bars",
                        name: "Circle bars",
                        description: "If enabled, the bars will be displayed as circles",
                        isActive: settings["circle-bars"]
                    }),
                    new MooUI.OptionCheckbox({
                        key: "in-look-dir",
                        name: "In look dir",
                        description: "Bars will be drawn only when you look in their direction.",
                        isActive: settings["in-look-dir"]
                    }),
                    new MooUI.OptionCheckbox({
                        key: "in-weapon-range",
                        name: "In weapon range",
                        description: "Bars will only be drawn when your weapon can reach them.",
                        isActive: settings["in-weapon-range"]
                    }),
                    new window.MooUI.OptionIRange({
                        key: "weapon-range-mult",
                        name: "Weapon range mult",
                        description: "Adds the distance to the range of the weapon so that the drawing of the bars is further than the distance of the weapon.",
                        min: 1,
                        max: 3,
                        step: "any",
                        fixValue: 1,
                        value: settings["weapon-range-mult"]
                    }),
                    new window.MooUI.OptionIColor({
                        key: "bars-color",
                        name: "Color",
                        description: "Color of bars",
                        value: settings["bars-color"]
                    })
                ]
            }, {
                key: "hit-counter",
                name: "Hit counter",
                description: "Shows how many hits you need to hit the building.",
                isActive: settings["hit-counter"]
            }]
        }
    }

    class MenuBuilder {
        constructor() {
            this.menu = void 0

            this.settings = new MooUI.Column()
        }

        buildTogglers() {
            for (const columnSettings of Object.values(columnsSettings)) {
                const column = this[columnSettings.targetColumn]

                for (const toggler of columnSettings.togglers) {
                    column.add(new MooUI.Checkbox(toggler))
                }
            }
        }

        build() {
            this.menu = MooUI.createMenu({
                toggleKey: {
                    code: "Escape"
                },
                appendNode: document.getElementById("gameUI")
            })

            document.head.insertAdjacentHTML("beforeend", `<style>
            .column-container {
                border-radius: 0 0 6px 6px !important;
            }

            .ui-model {
                border-radius: 4px !important;
            }

            .ui-model.show-options {
                border-radius: 4px 4px 0px 0px !important;
            }

            .options-container {
                border-radius: 0px 0px 4px 4px !important;
            }

            .ui-option-input-color {
                border-radius: 4px !important;
            }
            </style>`)

            this.settings.setHeaderText("Settings")

            this.settings.collisionWidth = -999999

            this.buildTogglers()

            this.menu.add(this.settings)
            this.menu.onModelsAction(setVisualSetting)

            this.menu.columns.forEach((column) => {
                column.header.element.style.borderRadius = "6px"

                column.header.element.addEventListener("mousedown", (event) => {
                    if (event.button !== 2) return

                    column.header.isOpen ??= false
                    column.header.isOpen = !column.header.isOpen

                    column.header.element.style.borderRadius = column.header.isOpen ? "6px 6px 0 0" : "6px"
                })
            })
        }
    }

    const menuBuilder = new MenuBuilder()

    let menu = void 0
    let lastWeaponRangeMultChange = null

    window.addEventListener("DOMContentLoaded", () => {
        menuBuilder.build()

        menu = menuBuilder.menu

        menu.getModel("weapon-range-mult").on("input", () => {
            lastWeaponRangeMultChange = Date.now()
        })
    })

    function drawCircleBar(color, width, scale, endAngle) {
        const { context } = Cow.renderer

        context.strokeStyle = color
        context.lineWidth = width
        context.lineCap = "round"
        context.beginPath()
        context.arc(0, 0, scale, 0, endAngle)
        context.stroke()
        context.closePath()
    }

    Cow.addRender("building-health-bars", () => {
        if (!Cow.player) return

        const { context } = Cow.renderer
        const weaponRange = (Cow.player.weapon.range + Cow.player.scale / 2) * parseFloat(menu.getModelValue("weapon-range-mult"))

        if ((Date.now() - lastWeaponRangeMultChange) <= 1500) {
            const color = menu.getModelValue("bars-color")

            context.save()
            context.fillStyle = color
            context.strokeStyle = color
            context.globalAlpha = .3
            context.lineWidth = 4

            context.translate(Cow.player.renderX, Cow.player.renderY)
            context.beginPath()
            context.arc(0, 0, weaponRange, 0, Math.PI * 2)
            context.fill()
            context.globalAlpha = .7
            context.stroke()
            context.closePath()
            context.restore()
        } else {
            lastWeaponRangeMultChange = null
        }

        Cow.objectsManager.eachVisible((object) => {
            if (!object.isItem) return

            const distance = CowUtils.getDistance(Cow.player, object) - object.scale
            const angle = CowUtils.getDirection(object, Cow.player)

            if (menu.getModelActive("in-weapon-range") && distance > weaponRange) return
            if (menu.getModelActive("in-look-dir") && CowUtils.getAngleDist(angle, Cow.player.lookAngle) > Cow.config.gatherAngle) return

            if (menu.getModelActive("hit-counter")) {
                const damage = Cow.player.weapon.dmg * Cow.items.variants[Cow.player.weaponVariant].val
                const damageAmount = damage * (Cow.player.weapon.sDmg || 1) * (Cow.player.skin?.id === 40 ? 3.3 : 1)
                const hits = Math.ceil(object.health / damageAmount)
                const offsetY = menu.getModelActive("circle-bars") ? 2 : 22

                context.save()
                context.font = `18px Hammersmith One`
                context.fillStyle = "#fff"
                context.textBaseline = "middle"
                context.textAlign = "center"
                context.lineWidth = 8
                context.lineJoin = "round"

                context.translate(object.renderX, object.renderY)
                context.strokeText(hits, 0, offsetY)
                context.fillText(hits, 0, offsetY)
                context.restore()
            }

            if (!menu.getModelActive("health-bars")) return

            if (menu.getModelActive("circle-bars")) {
                const endAngle = ((object.health / object.maxHealth) * 360) * (Math.PI / 180)
                const width = 14
                const scale = 22

                context.save()
                context.translate(object.renderX, object.renderY)
                context.rotate(object.dir ?? object.dir2)
                drawCircleBar("#3d3f42", width, scale, endAngle)
                drawCircleBar(menu.getModelValue("bars-color"), width / 2.5, scale, endAngle)
                context.restore()

                return
            }

            const { healthBarWidth, healthBarPad } = window.config
            const width = healthBarWidth / 2 - healthBarPad / 2
            const height = 17
            const radius = 8

            context.save()
            context.translate(object.renderX, object.renderY)

            context.fillStyle = "#3d3f42"
            context.roundRect(-width - healthBarPad, -height / 2, 2 * width + 2 * healthBarPad, height, radius)
            context.fill()

            context.fillStyle = menu.getModelValue("bars-color")
            context.roundRect(-width, -height / 2 + healthBarPad, 2 * width * (object.health / object.maxHealth), height - 2 * healthBarPad, radius - 1)
            context.fill()
            context.restore()
        })
    })
})()
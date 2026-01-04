// ==UserScript==
// @name            9mm [MooMoo.io] [v1.0.1]
// @name:ru         9mm [MooMoo.io] [v1.0.1]
// @namespace       https://github.com/Nudo-o
// @version         1.0.1
// @description     It's a good script for moomoo.io, it's not the best, but I'll try to make it as good as possible. M - Auto mills. Q/F/V/N/H - Macro placers. Everything else works automatically! If some hats were not bought by yourself, then you can buy them in the store.
// @description:ru  Это хороший скрипт для moomoo.io, не самый лучший, но я постараюсь сделать его как можно лучше. M - Автоматические мельницы. Q/F/V/N/H - Макросы. Всё остальное работает автоматически! Если какие-то шапки не купились сами, то вы можете купить их в магазине.
// @author          @nudoo
// @match           *://moomoo.io/*
// @match           *://*.moomoo.io/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=moomoo.io
// @require         https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @require         https://update.greasyfork.org/scripts/480301/1322984/CowJS.js
// @license         MIT
// @grant           none
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/486258/9mm%20%5BMooMooio%5D%20%5Bv101%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/486258/9mm%20%5BMooMooio%5D%20%5Bv101%5D.meta.js
// ==/UserScript==

// LICENSE (MIT): https://www.tldrlegal.com/license/mit-license

// The creation uses my library designed to simplify the work in creating scripts on MooMoo.io. You can get acquainted with it by following the link.
// Cow.js - https://update.greasyfork.org/scripts/480301/1322984/CowJS.js

(function() {
    "use strict"

    const { Cow, CowUtils, msgpack } = window
    const { packets, items } = Cow.config.designations
    const _placeItem = Cow.placeItem
    const _roundRect = CanvasRenderingContext2D.prototype.roundRect

    Cow.setCodec(msgpack)

    let nearEnemy = null
    let preplaceObjects = []
    let lastPreplaceClear = 0

    class AutoHeal {
        constructor() {
            this.checkIsHealed = false

            this.lastHeal = 0
        }

        doFullHeal() {
            const { player } = Cow

            if (player.health === player.maxHealth) return

            const amount = player.items[0] === 0 ? 20 : player.items[0] === 1 ? 30 : 25

            for (let i = player.health; i < player.maxHealth; i += amount) {
                this.doHeal()
            }
        }

        doHeal() {
            const { player } = Cow

            if (player.health === player.maxHealth) return

            const timeSinceHeal = Cow.ticker.ticks - (this.lastHeal || 0)

            if (timeSinceHeal >= 1) {
                /*Cow.delayedPlaceItem(() => Cow.placeItem(items.FOOD))*/

                Cow.placeItem(items.FOOD)

                this.lastHeal = Cow.ticker.ticks
            }
        }

        update() {
            const { player } = Cow

            if (!player?.alive || player?.skinIndex === 45) return
            if (player.health === player.maxHealth) {
                if (player.shameCount >= 2) {
                    tailor.autoBullTick = true
                }

                return
            }

            if (player.health <= 85 && nearEnemy) {
                const distance = CowUtils.getDistance(nearEnemy, player)

                if (distance <= 500) {
                    tailor.autoEmpHat = true
                }
            }

            const timeSinceHit = Cow.ticker.ticks - (player.hitTime || 0)
            const timeSinceHeal = Cow.ticker.ticks - (this.lastHeal || 0)

            if (player.shameCount < 5) {
                if (timeSinceHeal >= 8) {
                    this.doHeal()
                } else {
                    if (timeSinceHit >= ((player.health <= 30) ? 0 : 2)) {
                        if (player.health <= 40) {
                            this.doFullHeal()
                        } else if (timeSinceHit >= 1 && timeSinceHit >= 1) {
                            this.doHeal()
                        }

                        if (player.health >= 65) {
                            this.doHeal()
                        } else if (player.health > 40 && player.health < 65) {
                            this.doFullHeal()
                        }
                    } else if (timeSinceHit === 1) {
                        if (player.health <= 30) {
                            this.doHeal()
                            this.doFullHeal()
                        }
                    }
                }
            } else {
                if (player.health < 40 && timeSinceHit >= 2) {
                    this.doHeal()
                    this.doHeal()
                } else if (player.health >= 40 && timeSinceHit >= 3 && timeSinceHeal >= 2) {
                    this.doFullHeal()
                    this.doHeal()
                }
            }
        }
    }

    class AntiInsta {
        constructor() {
            this.targetHealth = 35

            this.lastHeal = 0
        }

        doFullHeal() {
            const { player } = Cow

            if (player.health === player.maxHealth) return

            const amount = player.items[0] === 0 ? 20 : player.items[0] === 1 ? 30 : 25

            for (let i = player.health; i < player.maxHealth; i += amount) {
                this.doHeal()
            }
        }

        doHeal() {
            const { player } = Cow

            if (player.health === player.maxHealth) return

            const timeSinceHeal = Cow.ticker.ticks - (this.lastHeal || 0)

            if (timeSinceHeal >= 0) {
                Cow.placeItem(items.FOOD)

                this.lastHeal = Cow.ticker.ticks
            }
        }

        update() {
            const { player } = Cow

            if (!player?.alive || player?.skinIndex === 45) return
            if (player.health > this.targetHealth || !nearEnemy) return

            const timeSinceHit = Cow.ticker.ticks - (player.hitTime || 0)
            const timeSinceHeal = Cow.ticker.ticks - (this.lastHeal || 0)

            if (player.shameCount <= 4) {
                if (timeSinceHeal >= 8) {
                    this.doHeal()

                    if (player.health <= 20) {
                        this.doFullHeal()
                    }

                    this.doHeal()
                } else {
                    if (timeSinceHit >= ((player.health <= 20) ? 0 : 1)) {
                        if (player.health <= (this.targetHealth - 10)) {
                            this.doHeal()
                            this.doHeal()
                        } else if (timeSinceHit >= 1 && timeSinceHit >= 1) {
                            this.doHeal()
                            this.doFullHeal()
                        }

                        if (player.health >= (this.targetHealth - 10)) {
                            this.doHeal()
                            this.doHeal()
                        } else if (player.health > 5 && player.health < 15) {
                            this.doFullHeal()
                            this.doHeal()
                        }
                    } else if (timeSinceHit === 1) {
                        this.doHeal()
                        this.doHeal()
                    }
                }

                if (player.health <= Math.max(this.targetHealth - 15, 10)) {
                    this.doFullHeal()
                } else if (timeSinceHit >= 1 && timeSinceHeal >= 1) {
                    this.doHeal()
                    this.doHeal()
                } else {
                    this.doHeal()
                }
            } else {
                if (player.health < (this.targetHealth - 5) && timeSinceHit >= 1) {
                    this.doHeal()
                    this.doHeal()
                } else if (player.health >= (this.targetHealth - 5) && timeSinceHit >= 2 && timeSinceHeal >= 1) {
                    this.doHeal()
                }
            }
        }
    }

    class Tailor {
        constructor() {
            this.hatTicks = []
            this.hasHats = [ 0 ]
            this.hasAccs = [ 0 ]

            this.lastHatTick = 0

            this.autoEmpCD = null

            this.autoEmpSoldier = false
            this.autoSoldierEmp = false
            this.autoEmpHat = false
            this.autoBullTick = false
            this.autoTankHat = false
        }

        get canEquip() {
            return !autoSpikeSync.isActive && !autoClickHats.isActive
        }

        isHasTick(key) {
            return Boolean(this.hatTicks.filter((tick) => tick.key == key).length)
        }

        reset() {
            this.autoEmpSoldier = false
            this.autoSoldierEmp = false
            this.autoEmpHat = false
            this.autoBullTick = false
            this.autoTankHat = false
        }

        equipHat(id, onlyBuy) {
            const { player } = Cow

            if (!this.hasHats.includes(id) && id !== 0) {
                if (player.points >= Cow.items.hats.searchById(id).price) {
                    Cow.sendPacket(packets.STORE_EQUIP, 1, id, 0, "by 9mm")

                    return this.hasHats.push(id)
                }
            }

            if (onlyBuy) return

            if (this.hasHats.includes(id) && player.skinIndex !== id) {
                Cow.sendPacket(packets.STORE_EQUIP, 0, id, 0)

                this.lastHatID = id
            }
        }

        equipAcc(id, onlyBuy) {
            const { player } = Cow

            if (!this.hasAccs.includes(id) && id !== 0) {
                if (player.points >= Cow.items.accessories.searchById(id).price) {
                    Cow.sendPacket(packets.STORE_EQUIP, 1, id, 1, "by 9mm")

                    return this.hasAccs.push(id)
                }
            }

            if (onlyBuy) return

            if (this.hasAccs.includes(id) && player.tailIndex !== id) {
                Cow.sendPacket(packets.STORE_EQUIP, 0, id, 1)

                this.lastAccID = id
            }
        }

        equipBiomeHat() {
            if (!this.canEquip) return

            const { player } = Cow

            let hatID = 0

            if (player.y2 > 6850 && player.y2 < 7550) {
                hatID = 31
            } else if (player.y2 < 2400) {
                hatID = 15
            } else {
                hatID = 12
            }

            this.equipHat(hatID)

            if (!this.isHasTick("uneqip-tail")) {
                this.hatTicks.push({
                    key: "unknown",
                    callback: () => {
                        this.equipAcc(11)
                    }
                })
            }
        }

        unknownTicks(amount) {
            while (amount--) {
                this.hatTicks.push({
                    key: "unknown",
                    callback: () => {}
                })
            }
        }

        autoHats() {
            const { player } = Cow
            const dangerBuildings = calculator.getDangerBuildings(player)

            if (nearEnemy && player.health < player.maxHealth && this.canEquip) {
                const isPolearm = nearEnemy.weaponIndex === 4
                const isSword = nearEnemy.weaponIndex === 3
                const isKatana = nearEnemy.weaponIndex === 4

                if (isPolearm || isSword || isKatana) {
                    if (nearEnemy.weapons[1] === 10) {
                        if (this.autoEmpSoldier) return

                        this.autoEmpSoldier = true

                        this.hatTicks = []

                        this.equipHat(22)

                        setTimeout(() => {
                            this.equipHat(6)

                            setTimeout(() => {
                                this.autoEmpSoldier = false
                            }, 25)
                        }, 90)
                    } else {
                        if (this.autoSoldierEmp) return

                        this.autoSoldierEmp = true

                        this.hatTicks = []

                        this.equipHat(6)

                        setTimeout(() => {
                            this.equipHat(22)

                            setTimeout(() => {
                                this.autoEmpSoldier = false
                            }, 25)
                        }, 90)
                    }

                    return
                }
            }

            if (this.autoEmpHat && (!this.autoEmpCD || Date.now() - this.autoEmpCD >= 500) && this.canEquip) {
                this.equipHat(22)

                if (!this.isHasTick("uneqip-hats")) {
                    this.unknownTicks(1)

                    this.hatTicks.push({
                        key: "uneqip-hats",
                        callback: () => {
                            this.autoEmpHat = false

                            this.autoEmpCD = null
                        }
                    })
                }

                this.autoEmpCD = Date.now()
            } else if (this.autoTankHat) {
                this.equipHat(40)

                if (!this.isHasTick("uneqip-hats")) {
                    this.unknownTicks(3)

                    this.hatTicks.push({
                        key: "uneqip-hats",
                        callback: () => {
                            this.autoTankHat = false
                        }
                    })
                }
            } else if (dangerBuildings.length || nearEnemy && this.canEquip) {
                if (dangerBuildings.length) {
                    this.equipHat(6)
                } else if (nearEnemy) {
                    const weaponIndex = nearEnemy.weaponIndex
                    const angle = CowUtils.getDirection(nearEnemy, player)
                    const distance = CowUtils.getDistance(nearEnemy, player) - player.scale
                    const isMeInAngle = true//getAngleDist(angle, tmpValues.nearEnemy.dir) <= Math.PI / 1.25
                    const weapon = Cow.items.weapons[weaponIndex]

                    if (!weapon) return

                    const isMeInRange = distance <= weapon.range * 3.25

                    if (isMeInRange && isMeInAngle) {
                        if (nearEnemy.skinIndex === 7 && nearEnemy.tailIndex !== 11) {
                            if (!this.isHasTick("auto-spike")) {
                                this.equipHat(6)

                                this.unknownTicks(2)

                                this.hatTicks.push({
                                    key: "auto-spike",
                                    callback: () => {
                                        this.equipHat(11)
                                    }
                                })
                            }

                            return
                        } else {
                            this.equipHat(6)

                            return
                        }
                    } else {
                        if (this.canEquip) return this.equipBiomeHat()
                    }
                }
            } else {
                if (this.canEquip) this.equipBiomeHat()
            }
        }

        update() {
            this.autoHats()

            const { player } = Cow

            const timeSinceHatTick = Cow.ticker.ticks - (this.lastHatTick || 0)

            if (timeSinceHatTick >= 20 && !this.hatTicks.length && this.canEquip) {
                this.equipAcc(11, true)

                this.equipHat(6, true)
                this.equipHat(7, true)
                this.equipHat(22, true)
                this.equipHat(40, true)
                this.equipHat(53, true)

                this.lastHatTick = Cow.ticker.ticks
            }

            if (!this.canEquip) return (this.hatTicks = [])

            const hatTick = this.hatTicks[0]

            typeof hatTick?.callback === 'function' && hatTick.callback()

            this.hatTicks.shift()
        }
    }

    class AutoPlacer {
        constructor() {
            this.delay = 10
            this.lastUpdate = null
        }

        update() {
            const { player } = Cow

            if (!player?.alive || !nearEnemy?.visible || autoSpikeSync.isActive) return
            if (Date.now() - this.lastUpdate < this.delay) return

            const trapConfig = Cow.items.list[player.items[items.TRAP]]
            const spikeConfig = Cow.items.list[player.items[items.SPIKE]]

            if (!trapConfig || !spikeConfig) return

            const visibleObjects = Cow.objectsManager.list.filter((gameObject) => gameObject.visible && gameObject.active && CowUtils.getDistance(gameObject, player) <= 300)
            const angle = CowUtils.getDistance(nearEnemy, player)
            const placeSpikeDistance = player.scale + spikeConfig.scale * 1.4
            const distance = CowUtils.getDistance(player, nearEnemy)

            let distanceToPlace = distance

            nearEnemy.inTrap = false

            for (let i = 0; i < visibleObjects.length; i++) {
                const gameObject = visibleObjects[i]

                if (!gameObject.isItem || gameObject.id !== 15 || gameObject.owner?.sid === nearEnemy.sid) continue

                const scale = gameObject.scale || gameObject.getScale()
                const enemyDistanceToTrap = CowUtils.getDistance(nearEnemy, gameObject) - scale + window.config.collisionDepth
                const angleTrapToEnemy = CowUtils.getDirection(nearEnemy, gameObject)

                if (enemyDistanceToTrap > 0) continue

                nearEnemy.inTrap = true

                const offset = scale - Math.abs(enemyDistanceToTrap) + nearEnemy.scale / 2 + spikeConfig.scale
                const placeX = gameObject.x + offset * Math.cos(angleTrapToEnemy)
                const placeY = gameObject.y + offset * Math.sin(angleTrapToEnemy)

                distanceToPlace = CowUtils.getDistance(placeX, placeY, player.x, player.y)

                if (distanceToPlace <= placeSpikeDistance) {
                    const angleToPlace = CowUtils.getDirection(placeX, placeY, player.x, player.y)

                    Cow.placeItem(items.SPIKE, {
                        angle: angleToPlace
                    })
                }

                break
            }

            const distanceToEnemy = CowUtils.getDistance(player, nearEnemy) - nearEnemy.scale
            const placeDistance = trapConfig.scale * 1.2 + player.scale

            if (!nearEnemy.inTrap) {
                if (trapConfig) {
                    if (distanceToEnemy <= placeDistance && player.items[items.TRAP] === 15) {
                        const angle = CowUtils.getDirection(nearEnemy, player)

                        Cow.placeItem(items.TRAP, { angle })
                    }
                }
            } else if (distanceToPlace > placeSpikeDistance && distanceToEnemy <= 275) {
                if (player.items[items.TRAP] === 15) {
                    Cow.placeItem(items.TRAP, {
                        angle: angle
                    })
                }

                Cow.placeItem(items.SPIKE, {
                    angle: -angle
                })
            }

            this.lastUpdate = Date.now()
        }
    }

    class Macro {
        constructor() {
            this.assistPlaceX = null
            this.assistPlaceY = null
            this.lastAssistActive = null

            this.keys = {
                FOOD: 81,
                TRAP: 70,
                SPIKE: 86,
                MILL: 78,
                TURRET: 72
            }
        }

        resetAssist() {
            this.assistPlaceX = null
            this.assistPlaceY = null
            this.lastAssistActive = Date.now()
        }

        update() {
            const { player } = Cow

            if (!player?.alive || isInputFocused()) return
            if (Date.now() - this.lastAssistActive >= 500) this.resetAssist()

            for (const key in this.keys) {
                if (!Cow.input.keyboard.activeKeys.get(this.keys[key])) continue

                const placeItemIndex = items[key.replace(/wind/, "").toUpperCase()]
                const placeItem = Cow.items.list[player.items[placeItemIndex]]

                if (!placeItem) continue

                let placeAngle = player.lookAngle

                if (placeItem?.scale) {
                    const generalScale = (player.scale + placeItem.scale + (placeItem.placeOffset || 0))
                    const placeX = player.x + (generalScale * Math.cos(placeAngle))
                    const placeY = player.y + (generalScale * Math.sin(placeAngle))
                    const placePosition = { x: placeX, y: placeY }
                    const interferingObject = Cow.objectsManager.checkItemLocation(placeX, placeY, placeItem.scale, 0.6, placeItem.id, false, true)

                    if (interferingObject) {
                        let nearObjects = Cow.objectsManager.list.filter((gameObject) => {
                            const generalScale = placeItem.scale + (gameObject.isItem ? gameObject.scale : gameObject.getScale(0.6, false))
                            const inPlace = CowUtils.getDistance(gameObject, player) <= generalScale + player.scale * 2 + (placeItem.placeOffset || 0)

                            return gameObject.visible && gameObject.active && inPlace
                        })

                        nearObjects = nearObjects.sort((a, b) => {
                            a = CowUtils.getDistance(a, placePosition)
                            b = CowUtils.getDistance(b, placePosition)

                            return a - b
                        })

                        if (nearObjects.length) {
                            let newPlaceX = placeX
                            let newPlaceY = placeY

                            for (const nearObject of nearObjects) {
                                const angle = CowUtils.getDirection(player, nearObject)
                                const scale = nearObject.isItem ? nearObject.scale : nearObject.getScale(.6, false)
                                const offsetScale = scale / 2 + placeItem.scale / 2 * 1.25

                                const _x = newPlaceX + offsetScale
                                const _y = newPlaceY + offsetScale

                                newPlaceX = _x * Math.cos(angle - Math.atan(player.x - _x))
                                newPlaceY = _y * Math.sin(angle - Math.atan(player.y - _y))

                                const isCanPlace = Cow.objectsManager.checkItemLocation(newPlaceX, newPlaceY, placeItem.scale, 0.6, placeItem.id, false)

                                if (isCanPlace) break

                                nearObjects = nearObjects.sort((a, b) => {
                                    const newPlacePosition = { x: newPlaceX, y: newPlaceY }

                                    a = CowUtils.getDistance(a, newPlacePosition)
                                    b = CowUtils.getDistance(b, newPlacePosition)

                                    return a - b
                                })
                            }

                            this.assistPlaceX = newPlaceX
                            this.assistPlaceY = newPlaceY
                            this.lastAssistActive = Date.now()

                            placeAngle = CowUtils.getDirection(player.x, player.y, newPlaceX, newPlaceY)
                        }
                    }
                }

                //Cow.delayedPlaceItem(() => {
                Cow.placeItem(placeItemIndex, {
                    angle: placeAngle
                })
                //})
            }
        }
    }

    class AutoMills {
        constructor() {
            this.gaps = [ 1.115820407, 1.141422642 ]
            this.lastPlace = null

            this.isActive = false

            this.expectedMills = 0
            this.autoResetTime = null

            const onKeyboard = () => {
                if (isInputFocused()) return

                this.isActive = !this.isActive
                this.expectedMills = 0

                if (!this.isActive) this.lastPlace = null
            }

            Cow.onKeyboard(77, onKeyboard, {
                repeat: false
            })
        }

        get gap() {
            const { player } = Cow

            return this.gaps[Number(player.items[items.MILL] !== 10)]
        }

        update() {
            const { player } = Cow

            if (!player?.alive || !this.isActive) return

            if (Date.now() - this.autoResetTime >= 500) {
                this.autoResetTime = null
            } else if (this.autoResetTime) {
                return
            }

            if (this.lastPlace && Date.now() - this.lastPlace < 100) return

            const millConfig = Cow.items.list[player.items[items.MILL]]
            const checkCanBuild = (angle) => {
                const scale = player.scale + millConfig.scale + (millConfig.placeOffset || 0)
                const placeX = player.x2 + scale * Math.cos(angle)
                const placeY = player.y2 + scale * Math.sin(angle)

                return Cow.objectsManager.checkItemLocation(placeX, placeY, millConfig.scale, .6, millConfig.id, false)
            }

            if (checkCanBuild(player.moveDir + this.gap)) {
                Cow.placeItem(items.MILL, {
                    angle: player.moveDir + this.gap
                })

                this.expectedMills += 1
            }

            if (checkCanBuild(player.moveDir)) {
                Cow.placeItem(items.MILL, {
                    angle: player.moveDir
                })

                this.expectedMills += 1
            }

            if (checkCanBuild(player.moveDir)) {
                Cow.placeItem(items.MILL, {
                    angle: player.moveDir - this.gap
                })

                this.expectedMills += 1
            }

            if (this.expectedMills === 1) {
                this.autoResetTime = Date.now()
            }

            this.lastPlace = Date.now()
        }
    }

    class ReloadBars {
        constructor() {
            this.colors = {
                1: [ "#cc5151", "#8ecc51" ],
                2: "#accd51",
                3: "#c4cd51",
                4: "#cdae51",
                5: "#cd8251",
                6: "#cd5d51"
            }
        }

        getColor(reloadValue, isAlly) {
            let color = ""

            if (reloadValue >= 0.8 && reloadValue < 1) {
                color = this.colors[2]
            } else if (reloadValue >= 0.6 && reloadValue < 0.8) {
                color = this.colors[3]
            } else if (reloadValue >= 0.4 && reloadValue < 0.6) {
                color = this.colors[4]
            } else if (reloadValue >= 0.2 && reloadValue < 0.4) {
                color = this.colors[5]
            } else if (reloadValue < 0.2) {
                color = this.colors[6]
            } else {
                color = this.colors[1][Number(isAlly)]
            }

            return color
        }

        drawBar(widthMult, color, object, offsetX, offsetY, _width, radii) {
            const { healthBarWidth, healthBarPad } = window.config
            const { context } = Cow.renderer
            const width = _width || (healthBarWidth / 2 - healthBarPad / 2)
            const height = 17

            context._roundRect = _roundRect

            context.save()
            context.fillStyle = "#3d3f42"

            context.translate(object.renderX + offsetX, object.renderY + offsetY)
            context.beginPath()
            context._roundRect(-width - healthBarPad, -height / 2, 2 * width + 2 * healthBarPad, height, Array.isArray(radii) ? radii[0] : radii)
            context.fill()
            context.restore()

            context.save()
            context.fillStyle = color

            context.translate(object.renderX + offsetX, object.renderY + offsetY)
            context.beginPath()
            context._roundRect(-width, -height / 2 + healthBarPad, 2 * width * widthMult, height - 2 * healthBarPad, Array.isArray(radii) ? radii[1] : radii - 1)
            context.fill()
            context.restore()
        }

        drawPrimaryBar(entity) {
            const primaryReload = Math.min(Math.max(entity.reloads.primary.count / entity.reloads.primary.max, 0), 1)
            const isAlly = entity.isMe || entity.isAlly
            const { healthBarWidth, healthBarPad } = window.config
            const width = (healthBarWidth / 2 - healthBarPad / 2)
            const addWidth = 0
            const color = this.getColor(primaryReload, isAlly)
            const offset = -width * 1.19 + addWidth
            const radius = 8
            const radii = [[ radius, 0, 0, radius ], [ radius - 1, 0, 0, radius - 1 ]]

            this.drawBar(primaryReload, color, entity, offset, entity.scale + window.config.nameY - 5, width + addWidth, radii)
        }

        drawSecondaryBar(entity) {
            const secondaryReload = Math.min(Math.max(entity.reloads.secondary.count / entity.reloads.secondary.max, 0), 1)
            const isAlly = entity.isMe || entity.isAlly
            const { healthBarWidth, healthBarPad } = window.config
            const width = (healthBarWidth / 2 - healthBarPad / 2)
            const addWidth = 0
            const color = this.getColor(secondaryReload, isAlly)
            const offset = width * 1.19 - addWidth
            const radius = 8
            const radii = [[ 0, radius, radius, 0 ], [ 0, radius - 1, radius - 1, 0 ]]

            this.drawBar(secondaryReload, color, entity, offset, entity.scale + window.config.nameY - 5, width + addWidth, radii)
        }

        drawTurretHatBar(entity) {
            const turretReload = Math.min(Math.max(entity.reloads.turret.count / entity.reloads.turret.max, 0), 1)
            const isAlly = entity.isMe || entity.isAlly
            const { healthBarWidth } = window.config
            const color = this.getColor(turretReload, isAlly)
            const radius = 8

            this.drawBar(turretReload, color, entity, 0, entity.scale + window.config.nameY * 1.75 - 3, healthBarWidth, radius)
        }

        update() {
            const { player } = Cow

            if (!player?.alive) return

            Cow.playersManager.eachVisible((player) => {
                this.drawPrimaryBar(player)
                this.drawSecondaryBar(player)
                this.drawTurretHatBar(player)
            })
        }
    }

    class Calculator {
        constructor() {}

        getLength(x, y) {
            const math = (Math.pow, Math.sqrt)

            return math(x * x + y * y)
        }

        findBuildingOnPosition(target, other) {
            const dx = target.x - other.x
            const dy = target.y - other.y
            const scale = target.scale + (other.getScale ? other.getScale() : other.scale)
            const length = this.getLength(dx, dy)

            return length - scale < 0
        }

        getPredictor(target) {
            return {
                x: target.x2 + target.speed * Math.cos(target.moveDir - Math.PI),
                y: target.y2 + target.speed * Math.sin(target.moveDir - Math.PI),
                scale: target.scale
            }
        }

        getDangerBuildings(target) {
            const { player } = Cow

            if (!player?.alive || !target?.visible) return []

            const predictor = this.getPredictor(target)

            return Cow.objectsManager.list.filter((gameObject) => {
                if (!gameObject.visible || !gameObject.isItem || !gameObject.visible) return

                const isSpike = [6, 7, 8, 9].includes(gameObject.id)

                return isSpike && !Cow.isAllianceMember(gameObject.owner?.sid) && this.findBuildingOnPosition(predictor, gameObject)
            })
        }
    }

    class AutoBreak {
        constructor() {
            this.isBreaking = false

            this.weaponBeforeStart = null
        }

        stopBreaking() {
            if (!this.isBreaking) return

            const { player } = Cow

            this.isBreaking = false
            tailor.autoTankHat = false

            aimControl.stopAiming()

            Cow.sendPacket(packets.SELECT_BUILD, player.weapons[this.weaponBeforeStart], true)

            this.weaponBeforeStart = null
        }

        async update() {
            const { player } = Cow

            player.inTrap = false

            const nearTrap = Cow.objectsManager.list
            .filter((gameObject) => gameObject.visible && gameObject.active && gameObject.id === 15 && !Cow.isAllianceMember(gameObject.owner?.sid))
            .sort((a, b) => {
                a = CowUtils.getDistance(a, player)
                b = CowUtils.getDistance(b, player)

                return a - b
            })[0]

            if (!nearTrap) return this.stopBreaking()

            const distance = CowUtils.getDistance(nearTrap, player) - nearTrap.scale + window.config.collisionDepth

            player.inTrap = distance <= 10

            if (!player.inTrap) return this.stopBreaking()

            this.isBreaking = true
            tailor.autoTankHat = true

            if (!this.weaponBeforeStart) {
                this.weaponBeforeStart = Number(player.weaponIndex > 8)
            }

            const breakWeapon = player.weapons[1] === 10 ? player.weapons[1] : player.weapons[0]
            const equipWeapon = (id) => {
                if (player.weaponIndex !== breakWeapon) Cow.sendPacket(packets.SELECT_BUILD, breakWeapon, true)
            }

            if (nearEnemy) {
                const weapon = Cow.items.weapons[player.weaponIndex]
                const angle = CowUtils.getDirection(nearEnemy, player)
                const distance = CowUtils.getDistance(nearEnemy, player) - player.scale * 2
                const isInAngle = CowUtils.getAngleDist(angle, player.dir) <= window.config.gatherAngle
                const isInRange = distance <= weapon.range

                if (isInAngle && isInRange && player.weapons[0] !== 8) {
                    equipWeapon(player.weapons[0])
                } else {
                    equipWeapon(breakWeapon)
                }
            } else {
                equipWeapon(breakWeapon)
            }

            aimControl.startAiming(nearTrap)
            Cow.sendPacket(packets.ATTACK_STATE, 1, aimControl.aimAngle)
            Cow.sendPacket(packets.ATTACK_STATE, 0, aimControl.aimAngle)
        }
    }

    class AntiTrap extends AutoBreak {
        constructor() {
            super()
        }

        update() {
            super.update()
        }
    }

    class AimControl {
        constructor() {
            this.aimTarget = null
            this.isAiming = false
            this._aimAngle = null
            this.isSent = false
        }

        get aimAngle() {
            this.updateAimToTarget()

            return this._aimAngle
        }

        set aimAngle(_angle) {
            this._aimAngle = _angle
        }

        onSent() {
            this.isSent = true
        }

        updateAimToTarget() {
            if (!this.isAiming) return

            const { player } = Cow
            const angle = typeof this.aimTarget === 'number' ? this.aimTarget : CowUtils.getDirection(this.aimTarget, player)

            this.aimAngle = angle
        }

        startAiming(point) {
            this.aimTarget = point
            this.isAiming = true
            this.isSent = false

            this.updateAimToTarget()
        }

        stopAiming() {
            this.aimTarget = null
            this.isAiming = false
            this.aimAngle = null
        }
    }

    class AutoClickHats {
        constructor() {
            this.isActive = false
            this.isGathering = false
            this.isAutoAttacking = false

            this.timeout = null
        }

        onStartGather(isAutoAttack) {
            if (isAutoAttack) {
                this.isAutoAttacking = true
            }

            this.isGathering = true

            this.reset()
        }

        onStopGather(isAutoAttack) {
            if (isAutoAttack) {
                this.isAutoAttacking = false
            }

            if (!isAutoAttack && this.isAutoAttacking) return

            this.isGathering = false

            this.reset()
        }

        fullReset() {
            this.isGathering = false
            this.isAutoAttacking = false

            this.reset()
        }

        reset() {
            this.isActive = false

            this.clearTimeout()
        }

        clearTimeout() {
            clearTimeout(this.timeout)

            this.timeout = null
        }

        update() {
            if (autoSpikeSync.isActive) return this.reset()

            if (!this.isGathering || this.isActive || this.timeout) return

            const { player } = Cow
            const weapon = Cow.items.weapons[player.weaponIndex]

            let isTargetEnemy = false

            if (nearEnemy) {
                const angle = CowUtils.getDirection(nearEnemy, player)
                const distance = CowUtils.getDistance(nearEnemy, player) - player.scale * 2
                const isInAngle = CowUtils.getAngleDist(angle, player.dir) <= window.config.gatherAngle
                const isInRange = distance <= weapon.range

                if (isInRange && isInAngle) {
                    isTargetEnemy = nearEnemy

                    this.isActive = true

                    this.clearTimeout()
                    player.tailIndex === 11 && tailor.equipAcc(0)
                    tailor.equipHat(7)

                    this.timeout = setTimeout(() => {
                        tailor.equipHat(6)
                        this.reset()
                    }, weapon.speed / 1.5)
                }
            }

            if (isTargetEnemy) return

            const gameObjects = Cow.objectsManager.list.filter((gameObject) => gameObject.isItem && gameObject.visible && gameObject.active && CowUtils.getDistance(player, gameObject) <= 300)
            const nearGameObject = gameObjects.sort((a, b) => {
                a = CowUtils.getDistance(player, a)
                b = CowUtils.getDistance(player, b)

                return a - b
            })[0]

            if (nearGameObject) {
                const angle = CowUtils.getDirection(nearGameObject, player)
                const distance = CowUtils.getDistance(nearGameObject, player) - nearGameObject.scale - weapon.range

                if (distance > 0) return

                this.isActive = true

                this.clearTimeout()
                tailor.equipHat(40)

                this.timeout = setTimeout(() => {
                    tailor.equipHat(6)
                    this.reset()
                }, weapon.speed / 1.5)
            }
        }
    }

    class AutoSpikeSync {
        constructor() {
            this.isActive = false

            this.lastActive = null
        }

        getSpikes() {
            return Cow.objectsManager.list.filter((gameObject) => gameObject.visible && gameObject.active && gameObject.group?.name === "spikes")
        }

        async doSpikeSync(angle) {
            if (this.lastActive && Date.now() - this.lastActive < 1000) return

            const { player } = Cow

            this.isActive = true

            if (player.weapons[0] === 7) {
                this.isActive = false

                return Cow.placeItem(items.SPIKE, { angle })
            }

            aimControl.stopAiming()
            aimControl.startAiming(angle)

            await CowUtils.delay(10)

            player.weaponIndex !== player.weapons[0] && Cow.sendPacket(packets.SELECT_BUILD, player.weapons[0], true)

            await CowUtils.delay(10)

            tailor.equipAcc(0)

            await CowUtils.delay(10)

            tailor.equipHat(7)

            await CowUtils.delay(25)

            Cow.sendPacket(packets.ATTACK_STATE, 1, angle, "by 9mm")
            Cow.sendPacket(packets.ATTACK_STATE, 0, null, "by 9mm")

            await CowUtils.delay(25)

            Cow.placeItem(items.SPIKE, { angle })
            aimControl.stopAiming()

            this.isActive = false
            this.lastActive = Date.now()
        }

        update() {
            const { player, camera } = Cow
            const { context } = Cow.renderer

            if (!player?.alive || this.isActive || !nearEnemy) return

            const spikeObjects = this.getSpikes()

            if (!spikeObjects.length) return

            const nearSpikesToEnemy = spikeObjects.filter((spikeObject) => spikeObject.owner.sid !== nearEnemy.sid && CowUtils.getDistance(nearEnemy, spikeObject) <= 90 + nearEnemy.scale)

            if (!nearSpikesToEnemy.length || nearSpikesToEnemy.length > 3) return

            const midX = nearSpikesToEnemy.reduce((acc, spikeObject) => acc + spikeObject.x, 0) / nearSpikesToEnemy.length
            const midY = nearSpikesToEnemy.reduce((acc, spikeObject) => acc + spikeObject.y, 0) / nearSpikesToEnemy.length
            const angleMeToMid = CowUtils.getDirection(midX, midY, player.x, player.y)
            const angleEnemyToMid = CowUtils.getDirection(midX, midY, nearEnemy.x, nearEnemy.y)
            const angleMeToEnemy = CowUtils.getDirection(nearEnemy, player)
            const targetAngle = window.config.gatherAngle * (nearSpikesToEnemy.length === 2 ? 2 : 1)
            const distanceToEnemy = CowUtils.getDistance(nearEnemy, player) - player.scale * 2

            if (CowUtils.getAngleDist(-angleEnemyToMid, angleMeToEnemy) > targetAngle) return

            renderGameObjectMark({
                renderX: midX - camera.xOffset,
                renderY: midY - camera.yOffset,
            }, context, 1, distanceToEnemy > player.weapon.range ? "#941492" : "#941414", true)

            if (distanceToEnemy > player.weapon.range) return

            this.doSpikeSync(angleMeToMid)
        }
    }

    CowUtils.delay = function(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    Cow.placeItem = function() {
        const lastWeapon = Number(this.player.weaponIndex > 8)

        if (arguments[0] !== 0) {
            preplaceObjects.push({
                id: arguments[0],
                angle: arguments[1]?.angle || this.player.dir
            })
        }

        _placeItem.apply(this, arguments)

        const weaponId = this.player.weapons[lastWeapon]

        if (this.player.weaponIndex !== weaponId) this.sendPacket(packets.SELECT_BUILD, weaponId, true)
    }

    Cow.delayedPlaceItem = function(callback) {
        this.lastPlaceItem ??= 0

        if (this.lastPlaceItem && (this.ticker.ticks - this.lastPlaceItem) < 1) return

        callback()

        this.lastPlaceItem = this.ticker.ticks
    }

    Cow.isAllianceMember = function(sid) {
        const { player } = Cow

        if (player && player.sid == sid) return true
        if (!player.team || sid < 0) return false

        for (var i = 0; i < Cow.alliancePlayers.length; i += 2) {
            if (sid !== Cow.alliancePlayers[i]) continue

            return true
        }

        return false
    }

    Cow.isCanGather = function(doer, other) {
        const distance = CowUtils.getDistance(doer, other) - other.scale
        const angle = CowUtils.getDirection(other, doer)
        const angleDistance = CowUtils.getAngleDist(angle, doer.dir2)
        const isInAngle = angleDistance <= window.config.gatherAngle
        const isInRange = distance <= doer.weapon.range

        return {
            range: isInRange,
            angle: isInAngle,
            both: isInRange && isInAngle
        }
    }

    Cow.onPacket(packets.INIT_DATA, (initData) => {
        Cow.alliances = initData.teams
    })

    Cow.onPacket(packets.ADD_ALLIANCE, (alliance) => {
        Cow.alliances.push(alliance)
    })

    Cow.onPacket(packets.DELETE_ALLIANCE, (sid) => {
        for (let i = Cow.alliances.length - 1; i >= 0; i--) {
            if (Cow.alliances[i].sid !== sid) continue

            Cow.alliances.splice(i, 1)
        }
    })

    Cow.onPacket(packets.SET_ALLIANCE_PLAYERS, (players) => {
        Cow.alliancePlayers = players
    })

    Cow.onPacket(packets.UPDATE_PLAYERS, () => {
        const { player } = Cow

        if (Cow.ticker.ticks - lastPreplaceClear >= 1) {
            preplaceObjects = []

            lastPreplaceClear = Cow.ticker.ticks
        }
    })

    Cow.onPacket(packets.ADD_PLAYER, (_, isYou) => {
        if (!isYou) return

        tailor.reset()
        autoClickHats.fullReset()
        toggleLoadingMenu(false)

        setTimeout(() => {
            updateItemsCount(true)
        }, 500)

        if (!Cow.isFirstEnterGame) {
            const firstClanInput = document.querySelector("#first_clan_input")

            Cow.isFirstEnterGame = true

            firstClanInput.value && Cow.sendPacket(packets.CREATE_ALLIANCE, firstClanInput.value)
        }
    })

    Cow.onPacket(packets.UPDATE_ITEM_COUNTS, (index, value) => {
        const { player } = Cow

        player.itemCounts[index] = value

        updateItemsCount(false, index)
    })

    Cow.onPacket(packets.UPDATE_UPGRADES, (index, value) => {
        updateItemsCount()
    })

    const macro = new Macro()
    const calculator = new Calculator()
    const autoPlacer = new AutoPlacer()
    const tailor = new Tailor()
    const autoHeal = new AutoHeal()
    const antiInsta = new AntiInsta()
    const autoMills = new AutoMills()
    const reloadBars = new ReloadBars()
    const antiTrap = new AntiTrap()
    const aimControl = new AimControl()
    const autoClickHats = new AutoClickHats()
    const autoSpikeSync = new AutoSpikeSync()

    let lastRenderUpdate = 0
    let fps = 0
    let lastPingUpdate = null

    Cow.addRender("global", () => {
        fps += (1000 / Math.max(Date.now() - lastRenderUpdate, 1) - fps) / 10

        lastRenderUpdate = Date.now()

        const { context } = Cow.renderer
        const { player } = Cow

        nearEnemy = Cow.getNearEnemy()

        for (const preplaceObject of preplaceObjects) {
            renderPreplace(preplaceObject, context)
        }

        Cow.objectsManager.eachVisible((gameObject) => {
            if (!gameObject.isItem || !gameObject.active) return

            const distance = CowUtils.getDistance(player, gameObject) - player.scale

            if (distance > 600) return

            const alpha = Math.min(1, Math.max(0, 1 - (distance / 600)))

            renderGameObjectMark(gameObject, context, alpha)
        })

        macro.update()
        autoPlacer.update()
        autoClickHats.update()
        tailor.update()
        autoHeal.update()
        antiInsta.update()
        autoMills.update()
        reloadBars.update()
        antiTrap.update()
        autoSpikeSync.update()

        const pingDisplay = document.querySelector("#pingDisplay")

        if (pingDisplay && player?.alive) {
            if (!lastPingUpdate || (Date.now() - lastPingUpdate) >= 750 || !/FPS/.test(pingDisplay.innerHTML)) {
                pingDisplay.innerHTML = `Ping: ${window.pingTime}ms, FPS: ${fps.toFixed(0) || 0}`

                lastPingUpdate = Date.now()
            }
        }
    })

    const oldSend = WebSocket.prototype.send

    WebSocket.prototype.send = function(data) {
        const binary = new Uint8Array(data)
        const decoded = msgpack.decode(binary)
        const { player } = Cow

        if (decoded[0] === packets.STORE_EQUIP && decoded[1][0] === 1 && decoded[1][1] !== 0) {
            if (decoded[1][3] !== "by 9mm" && player.points >= Cow.items.hats.searchById(decoded[1][1])?.price) {
                if (decoded[1][2] === 0) {
                    tailor.hasHats.push(decoded[1][1])
                } else {
                    tailor.hasAccs.push(decoded[1][1])
                }
            }
        }

        if (![9, 12, 13, 15].includes(player?.weaponIndex)) {
            if (decoded[0] === packets.ATTACK_STATE) {
                if (decoded[1][2] !== "by cowjs" && decoded[1][2] !== "by 9mm") {
                    if (decoded[1][0] === 1) {
                        autoClickHats.onStartGather()
                    } else {
                        autoClickHats.onStopGather()
                    }
                }
            }

            if (decoded[0] === packets.AUTO_ATTACK) {
                if (!autoClickHats.isAutoAttacking) {
                    autoClickHats.onStartGather(true)
                } else {
                    autoClickHats.onStopGather(true)
                }
            }
        }

        if (decoded[0] === packets.SPAWN) {
            const nicknameInput = document.querySelector("#nickname_input")

            decoded[1][0] = {
                name: "9-".concat(nicknameInput.value.slice(0, 13)),
                moofoll: true,
                skin: decoded[1][0].skin
            }

            return oldSend.call(this, msgpack.encode(decoded))
        }

        if (decoded[0] === packets.LOOK_DIR && aimControl.isAiming) {
            aimControl.updateAimToTarget()

            decoded[1][0] = aimControl.aimAngle

            oldSend.call(this, msgpack.encode(decoded))

            return aimControl.onSent()
        }

        oldSend.apply(this, arguments)
    }

    function isInputFocused() {
        return document.activeElement.tagName === "INPUT"
    }

    function renderGameObjectMark(gameObject, context, alpha, color, isDebug) {
        const { player } = Cow
        const radius = 12
        const innerRadius = !gameObject.maxHealth ? radius : (gameObject.health / gameObject.maxHealth) * radius

        color = color ? color : gameObject.owner.sid === player.sid ? "#8ecc51" : Cow.isAllianceMember(gameObject.owner.sid) ? "#cdaa51" : "#cc5151"

        context.save()
        context.globalAlpha = alpha
        context.fillStyle = color

        context.translate(gameObject.renderX, gameObject.renderY)
        context.beginPath()
        context.arc(0, 0, isDebug ? radius : Math.min(radius, Math.max(0, innerRadius)), 0, Math.PI * 2)
        context.fill()
        context.closePath()
        context.restore()

        context.save()
        context.globalAlpha = alpha
        context.strokeStyle = "#3d3f42"
        context.lineWidth = 5.5

        context.translate(gameObject.renderX, gameObject.renderY)
        context.beginPath()
        context.arc(0, 0, radius, 0, Math.PI * 2)
        context.stroke()
        context.closePath()
        context.restore()
    }

    function renderPreplace(preplaceObject, context) {
        const { player } = Cow
        const item = Cow.items.list[Cow.player.items[preplaceObject.id]]
        const sprite = getItemSprite(item)
        const x = (player.scale + item.scale) * Math.cos(preplaceObject.angle)
        const y = (player.scale + item.scale) * Math.sin(preplaceObject.angle)
        const isCanPlace = Cow.objectsManager.checkItemLocation(player.x + x, player.y + y, item.scale, 0.6, item.id, false)

        if (!isCanPlace) return

        context.save()
        context.globalAlpha = .3
        context.translate(player.renderX + x, player.renderY + y)
        context.rotate(preplaceObject.angle)
        context.drawImage(sprite, -(sprite.width / 2), -(sprite.height / 2))
        context.restore()
    }

    function updateItemsCount(isFirst, itemIndex) {
        const { player } = Cow
        const allActionBarItems = [ ...document.querySelectorAll(".actionBarItem") ]

        allActionBarItems.forEach((actionBarItem) => {
            const id = parseInt(actionBarItem.id.replace(/\D/g, "")) - 16
            const itemConfig = Cow.items.list[id]

            if (!itemConfig?.group) return

            const { group } = itemConfig

            if (!group.place) return

            actionBarItem.innerHTML = `<span class="item-count${!isFirst && group.id === itemIndex ? " scale-anim" : ""}">${player.itemCounts[group.id] || 0}</span>`
        })
    }

    const itemSprites = {}

    function renderStar(ctxt, spikes, outer, inner) {
        const step = Math.PI / spikes

        let rot = Math.PI / 2 * 3
        let x = 0
        let y = 0

        ctxt.beginPath()
        ctxt.moveTo(0, -outer)

        for (let i = 0; i < spikes; i++) {
            x = Math.cos(rot) * outer
            y = Math.sin(rot) * outer

            ctxt.lineTo(x, y)

            rot += step
            x = Math.cos(rot) * inner
            y = Math.sin(rot) * inner

            ctxt.lineTo(x, y)

            rot += step
        }

        ctxt.lineTo(0, -outer)
        ctxt.closePath()
    }

    function renderCircle(x, y, scale, tmpContext, dontStroke, dontFill) {
        tmpContext = tmpContext || Cow.renderer.context

        tmpContext.beginPath()
        tmpContext.arc(x, y, scale, 0, 2 * Math.PI)

        if (!dontFill) tmpContext.fill()
        if (!dontStroke) tmpContext.stroke()
    }

    function renderRect(x, y, w, h, ctxt, stroke) {
        ctxt.fillRect(x - (w / 2), y - (h / 2), w, h)

        if (!stroke) ctxt.strokeRect(x - (w / 2), y - (h / 2), w, h)
    }

    function renderRectCircle(x, y, s, sw, seg, ctxt, stroke) {
        ctxt.save()
        ctxt.translate(x, y)
        seg = Math.ceil(seg / 2)

        for (var i = 0; i < seg; i++) {
            renderRect(0, 0, s * 2, sw, ctxt, stroke)
            ctxt.rotate(Math.PI / seg)
        }

        ctxt.restore()
    }

    function renderTriangle(s, ctx) {
        ctx = ctx || Cow.renderer.context

        const h = s * (Math.sqrt(3) / 2)

        ctx.beginPath()
        ctx.moveTo(0, -h / 2)
        ctx.lineTo(-s / 2, h / 2)
        ctx.lineTo(s / 2, h / 2)
        ctx.lineTo(0, -h / 2)
        ctx.fill()
        ctx.closePath()
    }

    function getItemSprite(obj) {
        let tmpSprite = itemSprites[obj.id];

        if (tmpSprite) return tmpSprite

        const tmpCanvas = document.createElement("canvas")
        const tmpContext = tmpCanvas.getContext("2d")
        const outlineWidth = 5.5
        const outlineColor = "#525252"

        tmpCanvas.width = tmpCanvas.height = (obj.scale * 2.5) + outlineWidth + (Cow.items.list[obj.id].spritePadding || 0)

        tmpContext.strokeStyle = outlineColor
        tmpContext.lineWidth = outlineWidth

        tmpContext.translate((tmpCanvas.width / 2), (tmpCanvas.height / 2))
        tmpContext.rotate(Math.PI / 2)

        if (/wall/.test(obj.name)) {
            const sides = (obj.name == "castle wall") ? 4 : 3

            tmpContext.fillStyle = obj.name == "castle wall" ? "#83898e" : obj.name == "wood wall" ? "#a5974c" : "#939393"

            renderStar(tmpContext, sides, obj.scale * 1.1, obj.scale * 1.1)
            tmpContext.fill()
            tmpContext.stroke()

            tmpContext.fillStyle = obj.name == "castle wall" ? "#9da4aa" : obj.name == "wood wall" ? "#c9b758" : "#bcbcbc"

            renderStar(tmpContext, sides, obj.scale * 0.65, obj.scale * 0.65)
            tmpContext.fill()
        } else if (/spikes/.test(obj.name)) {
            const tmpScale = (obj.scale * 0.6)

            tmpContext.fillStyle = obj.name == "poison spikes" ? "#7b935d" : "#939393"

            renderStar(tmpContext, (obj.name == "spikes") ? 5 : 6, obj.scale, tmpScale)
            tmpContext.fill()
            tmpContext.stroke()

            tmpContext.fillStyle = "#a5974c"

            renderCircle(0, 0, tmpScale, tmpContext)

            tmpContext.fillStyle = "#c9b758"

            renderCircle(0, 0, tmpScale / 2, tmpContext, true)
        } else if (/mill/.test(obj.name)) {
            tmpContext.fillStyle = "#a5974c"

            renderCircle(0, 0, obj.scale, tmpContext)

            tmpContext.fillStyle = "#c9b758"

            renderRectCircle(0, 0, obj.scale * 1.5, 29, 4, tmpContext)

            tmpContext.fillStyle = "#a5974c"

            renderCircle(0, 0, obj.scale * 0.5, tmpContext)
        } else if (/mine/.test(obj.name)) {
            tmpContext.fillStyle = "#939393"

            renderStar(tmpContext, 3, obj.scale, obj.scale)
            tmpContext.fill()
            tmpContext.stroke()

            tmpContext.fillStyle = "#bcbcbc"

            renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65)
            tmpContext.fill()
        } else if (/sapling/.test(obj.name)) {
            for (let i = 0; i < 2; ++i) {
                const tmpScale = obj.scale * (!i ? 1 : 0.5)

                renderStar(tmpContext, 7, tmpScale, tmpScale * 0.7)

                tmpContext.fillStyle = (!i ? "#9ebf57" : "#b4db62")

                tmpContext.fill()
                !i && tmpContext.stroke()
            }
        } else if (/trap/.test(obj.name)) {
            tmpContext.fillStyle = "#a5974c"

            renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1)
            tmpContext.fill()
            tmpContext.stroke()

            tmpContext.fillStyle = outlineColor

            renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65)
            tmpContext.fill()
        } else if (/boost/.test(obj.name)) {
            tmpContext.fillStyle = "#7e7f82"

            renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext)
            tmpContext.fill()
            tmpContext.stroke()

            tmpContext.fillStyle = "#dbd97d"

            renderTriangle(obj.scale * 1, tmpContext)
        } else if (/turret/.test(obj.name)) {
            const tmpLen = 50

            tmpContext.fillStyle = "#a5974c"

            renderCircle(0, 0, obj.scale, tmpContext)
            tmpContext.fill()
            tmpContext.stroke()

            tmpContext.fillStyle = "#939393"

            renderRect(0, -tmpLen / 2, obj.scale * 0.9, tmpLen, tmpContext)
            renderCircle(0, 0, obj.scale * 0.6, tmpContext)
            tmpContext.fill()
            tmpContext.stroke()
        } else if (/platform/.test(obj.name)) {
            const tmpCount = 4;
            const tmpS = obj.scale * 2
            const tmpW = tmpS / tmpCount

            let tmpX = -(obj.scale / 2)

            tmpContext.fillStyle = "#cebd5f"

            for (let i = 0; i < tmpCount; ++i) {
                renderRect(tmpX - (tmpW / 2), 0, tmpW, obj.scale * 2, tmpContext)
                tmpContext.fill()
                tmpContext.stroke()

                tmpX += tmpS / tmpCount
            }
        } else if (/spawn/.test(obj.name)) {
            tmpContext.fillStyle = "#7e7f82"

            renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext)
            tmpContext.fill()
            tmpContext.stroke()

            tmpContext.fillStyle = "#71aad6"

            renderCircle(0, 0, obj.scale * 0.6, tmpContext)
        } else if (/blocker/.test(obj.name)) {
            tmpContext.fillStyle = "#7e7f82"

            renderCircle(0, 0, obj.scale, tmpContext)
            tmpContext.fill()
            tmpContext.stroke()
            tmpContext.rotate(Math.PI / 4)

            tmpContext.fillStyle = "#db6e6e"

            renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true)
        } else if (/teleport/.test(obj.name)) {
            tmpContext.fillStyle = "#7e7f82"

            renderCircle(0, 0, obj.scale, tmpContext)
            tmpContext.fill()
            tmpContext.stroke()
            tmpContext.rotate(Math.PI / 4)

            tmpContext.fillStyle = "#d76edb"

            renderCircle(0, 0, obj.scale * 0.5, tmpContext, true)
        }

        tmpSprite = tmpCanvas
        itemSprites[obj.id] = tmpSprite

        return tmpSprite
    }

    function waitForInterval(selector, callback) {
        const checker = setInterval(() => {
            const node = document.querySelector(selector)

            if (!node?.style) return

            callback()
            clearInterval(checker)
        })

        setTimeout(() => {
            clearInterval(checker)
        }, 30000)

        return checker
    }

    waitForInterval("#gameUI", () => {
        createCustomHtmlAndCss()
    })

    waitForInterval("#mainMenu", createCustomMainMenu)

    waitForInterval("#enterGame", () => {
        const enterGameBtn = document.querySelector("#enterGame")

        enterGameBtn.addEventListener = new Proxy(enterGameBtn.addEventListener, {
            apply(target, _this, args) {
                _this = document.querySelector("#play_button")

                return target.apply(_this, args)
            }
        })
    })

    Object.defineProperty(HTMLElement.prototype, "onclick", {
        set(callback) {
            this.addEventListener("click", arguments[0])

            if (!/enterGame/.test(this.id)) return

            const playButton = document.querySelector("#play_button")

            playButton.addEventListener("click", arguments[0])
        }
    })

    function createCustomMainMenu() {
        const mainMenu = document.querySelector("#mainMenu")
        const style = document.createElement("style")

        style.insertAdjacentHTML("beforeend", `
        .better-mm-holder {
            display: block;
            position: absolute;
            top: 0;
            z-index: 999999999;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, .75);
            overflow: hidden;
            pointer-events: all;
        }

        .better-mm-holder * {
            box-sizing: border-box;
        }

        .better-mm-holder ul, .better-mm-holder li {
            margin: 0;
            padding: 0;
            list-style: none;
            text-decoration: none;
        }

        .better-mm-wrapper {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
        }

        .better-mm-header {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 105px;
            min-height: 105px;
            background: #101010;
            border-bottom: 4px solid #1f0f29;
        }

        .mod-title {
            background: #1f0f29;
            color: #7575757a;
            font-size: 50px;
            transform: skewX(10deg);
            padding: 5px 30px;
            border-radius: 50% 20% 35% / 70%;
            box-shadow: 0px 0px 3px 1px #020002;
            animation: blob-anim 20s infinite ease-in-out;
        }

        @keyframes blob-anim {
            0% {
                border-radius: 50% 20% 35% / 70%;
            }

            25% {
                border-radius: 50% 20% 35% / 30% 30% 20%;
            }

            50% {
                border-radius: 50% 20% 35% / 50% 50% 40%;
            }

            100% {
                border-radius: 50% 20% 35% / 70%;
            }
        }

        .better-mm-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 20px;
            width: 100%;
            height: 100%;
            padding: 40px;
        }

        .bmm-container-box {
            display: flex;
            flex-direction: column;
            background: #101010;
            border: 4px solid #1f0f29;
            border-radius: 12px;
            padding: 5px;
            overflow-y: auto;
        }

        .bmm-container-box::-webkit-scrollbar {
            width: 8px;
        }

        .bmm-container-box::-webkit-scrollbar-track {
            width: 8px;
        }

        .bmm-container-box::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, .35);
            border-radius: 4px 30px 30px 4px;
        }

        .game-servers-box, .mod-changelog-box, .game-settings-box {
            min-height: 375px;
            max-height: 375px;
            width: 325px;
        }

        .items-list {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
            padding: 5px !important;
        }

        .items-list .item {
            display: flex;
            flex-direction: column;
            gap: 4px;
            background: #252525b8;
            width: 100%;
            min-height: max-content;
            border-radius: 6px;
            padding: 5px !important;
        }

        .items-list .item.light-background {
            background: #474747bd;
        }

        .changelog-item-header, .server-data-header {
            font-size: 16px;
            color: #d0d0d0;
        }

        .changelog-updates {
            display: flex;
            flex-direction: column;
            gap: 4px;
            padding: 0 4px;
        }

        .changelog-update-value {
            font-size: 14px;
            color: #a3a2a2;
        }

        .changelog-version-info {
            display: flex;
            flex-direction: column;
            gap: 2px;
            padding-left: 4px;
            border-left: 2px solid #a3a2a2;
        }

        .player-body-figure {
            stroke-width: 4;
            stroke: #3d3f42;
            transition: .3s fill;
        }

        .game-settings-box, .game-servers-box {
            overflow-y: hidden;
        }

        .game-servers-box .items-list {
            overflow-y: auto;
        }

        .game-servers-box .items-list::-webkit-scrollbar {
            width: 8px;
        }

        .game-servers-box .items-list::-webkit-scrollbar-track {
            width: 8px;
        }

        .game-servers-box .items-list::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, .35);
            border-radius: 20px;
        }

        .game-settings-box {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .player-settings {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            padding: 10px;
        }

        .player-preview-wrapper {
            min-width: 50px;
            min-height: 50px;
            border-radius: 12px;
            background: #252525b8;
            cursor: pointer;
        }

        .player-data-wrapper {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .player-data-input {
            background: none;
            outline: 0;
            border: none;
            color: #d0d0d0;
            font-size: 14px;
            border-bottom: 2px solid #1f0f29;
            transition: .3s border-bottom;
        }

        .player-data-input:hover, .player-data-input:focus {
            border-bottom: 2px solid #2d143d;
        }

        .game-servers-update {
            display: flex;
            align-items: center;
            justify-content: center;
            color: #a3a2a2;
            font-size: 16px;
            width: 100%;
            min-height: 30px;
            background: #252525b8;
            border-radius: 6px;
            cursor: pointer;
            margin-bottom: 5px;
            transition: .3s color;
        }

        .game-servers-update:hover {
            color: #d0d0d0;
        }

        .server-data-wrapper {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .server-data-header, .server-data-ping {
            font-size: 14px;
            user-select: text;
            cursor: default;
        }

        .server-data-ping.red {
            color: #750d0d;
        }

        .server-data-ping.low-red {
            color: #852323;
        }

        .server-data-ping.yellow {
            color: #b3af0c;
        }

        .server-data-ping.green {
            color: #4bb30c;
        }

        .server-data-ping.low-green {
            color: #6c9f2b;
        }

        .server-data-actions {
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .server-data-players {
            display: inline-block;
            user-select: none;
            color: #a3a2a2;
            width: 55px;
        }

        .server-open-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            color: #d0d0d0;
            font-size: 14px;
            cursor: pointer;
            padding: 0 4px;
            background: #1f0f29;
            border-radius: 4px;
        }

        .loading-text, .disconnect-text {
            color: #d0d0d0;
            font-size: 35px;
        }

        .info-link {
            cursor: pointer;
            text-decoration: underline;
        }

        .link-logo {
            width: 25px;
            height: 25px;
        }

        .info-footer {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 8px;
            border-radius: 8px;
        }

        .info-footer-item {
            display: flex;
            align-items: center;
        }

        .info-footer-item.discord-item {
            user-select: text;
        }

        .info-footer-item.discord-item img {
            transform: scale(1.35);
        }

        .info-footer-item.discord-item::after {
            content: "nudoo";
            position: fixed;
            color: #5a75ce;
            font-size: 14px;
            width: 0px;
            transform: scaleX(0) translateX(30px);
            text-decoration: none;
            opacity: 0;
            user-select: text;
            transition: transform .3s, width .3s, opacity .3s;
        }

        .info-footer-item.discord-item:hover::after {
            margin-left: 4px;
            transform: scaleX(1) translateX(30px);
            width: 40px;
            opacity: 1;
        }

        .game-settings {
            display: flex;
            flex-direction: column;
        }

        .player-settings-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .play-button, .game-setting-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            padding: 0 4px;
            width: 100%;
            height: 30px;
            color: #7575757a;
            background: #1f0f29;
            border-radius: 6px;
            letter-spacing: 4px;
            cursor: pointer;
            transition: .3s background, .3s color;
        }

        .play-button:hover {
            background: #2d143d;
            color: #75757599;
        }

        .play-button:active, .game-setting-btn:active {
            transform: scale(.975);
        }

        .game-settings {
            display: grid;
            grid-template-columns: repeat(2, max-content);
            justify-items: center;
            justify-content: center;
            grid-gap: 5px;
            width: 100%;
            height: 100%;
        }

        .game-setting-btn {
            font-size: 14px;
            width: 140px;
            padding: 0 6px;
            letter-spacing: 0px;
            background: #1f0f29;
        }

        .game-setting-btn.enabled {
            background: #2d143d;
            color: #d0d0d0;
        }

        .select-skin-panel {
            position: absolute;
            padding: 4px;
            display: grid;
            grid-template-columns: repeat(5, max-content);
            gap: 4px;
            background: #252525b8;
            border: 4px solid #1f0f29;
            border-radius: 6px;
            z-index: 99999999999;
        }

        .skin-circle {
            cursor: pointer;
            width: 20px;
            height: 20px;
            border-radius: 6px;
            border: 3px solid #525252;
            transition: .3s border-radius;
        }

        .skin-circle:hover {
            border-radius: 50%;
        }

        .skin-circle.selected {
            border-radius: 50% !important;
        }

        .global-notification {
            position: absolute;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: 9999999999999999999;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .global-notification-box {
            width: 400px;
            height: 400px;
            overflow: hidden;
        }
        `)

        document.head.appendChild(style)

        mainMenu.insertAdjacentHTML("beforeend", `
        <div class="better-mm-holder" id="menuCardHolder">
            <main class="better-mm-wrapper">
                <header class="better-mm-header">
                    <span class="mod-title">9mm</span>
                </header>

                <container class="better-mm-container" id="better_mm_loading">
                    <span class="loading-text">Loading...</span>
                </container>

                <container class="better-mm-container hidden" id="better_mm_disconnect">
                    <span class="disconnect-text">Disconnected...</span>
                </container>

                <container class="better-mm-container hidden" id="better_mm_container">
                    <box class="bmm-container-box game-servers-box">
                        <div class="game-servers-update" id="game_servers_update">UPDATE</div>

                        <ul class="items-list" id="game_servers"></ul>
                    </box>

                    <box class="bmm-container-box game-settings-box">
                        <div class="player-settings-wrapper">
                            <div class="player-settings">
                                <div class="player-preview-wrapper" id="player_preview">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="eIZvJ0eqgt61" viewBox="0 0 100 100" shape-rendering="geometricPrecision" text-rendering="geometricPrecision">
                                        <ellipse class="player-body-figure" rx="10" ry="10" transform="translate(80 32.942071)" fill="#bf8f54"/>
                                        <ellipse class="player-body-figure" rx="10" ry="10" transform="translate(20 32.942071)" fill="#bf8f54"/>
                                        <ellipse class="player-body-figure" rx="30" ry="30" transform="translate(50 57)" fill="#bf8f54"/>
                                    </svg>
                                </div>

                                <div class="player-data-wrapper">
                                    <input class="player-data-input" id="nickname_input" placeholder="Enter nickname..." maxlength="13">
                                    <input class="player-data-input" id="first_clan_input" placeholder="Enter clan name..." maxlength="7">
                                </div>
                            </div>

                            <div class="play-button" id="play_button">PLAY</div>
                        </div>

                        <div class="game-settings">
                            <div class="game-setting-btn${localStorage.show_ping == "true" ? " enabled" : ""}" id="show_ping">Show ping/fps</div>
                            <div class="game-setting-btn${localStorage.native_resolution == "true" ? " enabled" : ""}" id="native_resolution">Native resolution</div>
                            <div class="game-setting-btn${localStorage.mill_rotate == "true" ? " enabled" : ""}" id="mill_rotate">Mill rotate</div>
                            <div class="game-setting-btn${localStorage.remove_grid == "true" ? " enabled" : ""}" id="remove_grid">Remove grid</div>
                        </div>

                        <footer class="info-footer">
                            <a class="info-footer-item info-link" href="https://www.youtube.com/channel/UCpBgMEb1vFQnMcSz-kJ6i0Q" target="_blank">
                                <img class="link-logo" src="https://cdn.glitch.global/26ec0d7f-01b9-40b1-aff5-8aa4412693c4/youtube.png?v=1700800235511">
                            </a>

                            <a class="info-footer-item info-link" href="https://github.com/Nudo-o/" target="_blank">
                                <img class="link-logo" src="https://cdn.glitch.global/26ec0d7f-01b9-40b1-aff5-8aa4412693c4/github-mark-white.png?v=1700800770200">
                            </a>

                            <a class="info-footer-item info-link" href="https://greasyfork.org/ru/users/759782-nudo" target="_blank">
                                <img class="link-logo" src="https://cdn.glitch.global/26ec0d7f-01b9-40b1-aff5-8aa4412693c4/greasyfork.png?v=1700800851140">
                            </a>

                            <div class="info-footer-item discord-item">
                                <img class="link-logo" src="https://cdn.glitch.global/26ec0d7f-01b9-40b1-aff5-8aa4412693c4/discord.png?v=1700801396017">
                            </div>
                        </footer>
                    </box>

                    <box class="bmm-container-box mod-changelog-box">
                        <ul class="items-list" id="mod_changelog"></ul>
                    </box>
                </container>
            </main>
        </div>

        <div class="select-skin-panel hidden" id="select_skin_panel">
            <div class="skin-circle selected" activeSkin" style="background: #bf8f54;" skin_index="0"></div>
            <div class="skin-circle" style="background: #cbb091;" skin_index="1"></div>
            <div class="skin-circle" style="background: #896c4b;" skin_index="2"></div>
            <div class="skin-circle" style="background: #fadadc;" skin_index="3"></div>
            <div class="skin-circle" style="background: #ececec;" skin_index="4"></div>
            <div class="skin-circle" style="background: #c37373;" skin_index="5"></div>
            <div class="skin-circle" style="background: #4c4c4c;" skin_index="6"></div>
            <div class="skin-circle" style="background: #ecaff7;" skin_index="7"></div>
            <div class="skin-circle" style="background: #738cc3;" skin_index="8"></div>
            <div class="skin-circle" style="background: #8bc373;" skin_index="9"></div>
        </div>
        `)

        updateChangelog(getModVersions(), "#mod_changelog")

        const gameServersUpdateBtn = document.querySelector("#game_servers_update")
        const nicknameInput = document.querySelector("#nickname_input")
        const firstClanInput = document.querySelector("#first_clan_input")
        const playButton = document.querySelector("#play_button")
        const showPing = document.querySelector("#show_ping")
        const millRotate = document.querySelector("#mill_rotate")
        const nativeResolution = document.querySelector("#native_resolution")
        const removeGrid = document.querySelector("#remove_grid")
        const playerPreview = document.querySelector("#player_preview")
        const allSelectSkinElements = [ ...document.querySelectorAll(".skin-circle") ]
        const setNodeVisibility = (selector, key) => {
            const node = document.querySelector(selector)

            if (!node) return

            const state = JSON.parse(localStorage.getItem(key))

            if (!node.hiddenInterval) {
                node.hiddenInterval = setInterval(() => {
                    node.hidden = false
                })
            }

            if (state) return node.classList.remove("hidden")

            node.classList.add("hidden")
        }
        const toggleGameSettingBtn = (toggler, key) => {
            if (!toggler) return

            toggler.classList.toggle("enabled")

            const state = toggler.classList.contains("enabled")

            localStorage.setItem(key, state.toString())

            if (key === "show_ping") {
                setNodeVisibility("#pingDisplay", key)
            }
        }
        const setGameSettingBtnState = (toggler, key) => {
            if (!toggler) return

            const state = JSON.parse(localStorage.getItem(key))

            if (key === "show_ping") {
                setNodeVisibility("#pingDisplay", key)
            }

            if (state) return toggler.classList.add("enabled")

            toggler.classList.remove("enabled")
        }

        setGameSettingBtnState(showPing, "show_ping")
        setGameSettingBtnState(millRotate, "mill_rotate")
        setGameSettingBtnState(nativeResolution, "native_resolution")
        setGameSettingBtnState(removeGrid, "remove_grid")

        nicknameInput.value = localStorage.getItem("9mm_name") || ""
        firstClanInput.value = localStorage.getItem("moo_first_clan") || ""

        nicknameInput.addEventListener("input", () => {
            localStorage.setItem("9mm_name", nicknameInput.value)
        })

        firstClanInput.addEventListener("input", () => {
            localStorage.setItem("moo_first_clan", firstClanInput.value)
        })

        showPing.addEventListener("click", toggleGameSettingBtn.bind(null, showPing, "show_ping"))
        millRotate.addEventListener("click", toggleGameSettingBtn.bind(null, millRotate, "mill_rotate"))
        nativeResolution.addEventListener("click", toggleGameSettingBtn.bind(null, nativeResolution, "native_resolution"))
        removeGrid.addEventListener("click", toggleGameSettingBtn.bind(null, removeGrid, "remove_grid"))
        playButton.addEventListener("click", enterGame)
        gameServersUpdateBtn.addEventListener("click", updateGameServers)
        playerPreview.addEventListener("click", toggleSelectSkin)

        window.addEventListener("resize", () => {
            toggleSelectSkin(null, true)
        })

        allSelectSkinElements.forEach((selectSkinElement) => {
            selectSkinElement.addEventListener("mousedown", selectSkin)
        })

        const checkGameLoading = setInterval(() => {
            const loadingText = document.querySelector("#loadingText")

            if (loadingText?.style.display !== "none") return

            if (localStorage.moo_skin) {
                selectSkin({ target: allSelectSkinElements[+localStorage.moo_skin] })
            }

            toggleLoadingMenu(false)
            clearInterval(checkGameLoading)
        })

        const checkGameDisconnect = setInterval(() => {
            const loadingText = document.querySelector("#loadingText")

            if (loadingText?.style.display === "none" || !/disconnect/.test(loadingText?.innerHTML)) return

            toggleDisconnectMenu(true)
            clearInterval(checkGameLoading)
        })

        Cow.socket.onEvent("close", toggleDisconnectMenu.bind(null, true))
    }

    function selectSkin(event) {
        const allSelectSkinElements = [ ...document.querySelectorAll(".skin-circle") ]

        allSelectSkinElements.forEach((selectSkinElement) => {
            selectSkinElement.classList.remove("selected")
        })

        const skinIndex = parseInt(event.target.getAttribute("skin_index"))
        const playerBodyFigures = [ ...document.querySelectorAll(".player-body-figure") ]

        playerBodyFigures.forEach((playerBodyFigure) => {
            playerBodyFigure.style.fill = window.config.skinColors[skinIndex]
        })

        event.target.classList.add("selected")
        window.selectSkinColor(skinIndex)

        localStorage.setItem("moo_skin", skinIndex)
    }

    function toggleSelectSkin(_, isResize, forceHide) {
        const playerPreview = document.querySelector("#player_preview")
        const selectSkinPanel = document.querySelector("#select_skin_panel")
        const boundings = playerPreview.getBoundingClientRect()
        const width = 162
        const height = 72

        if (forceHide) return selectSkinPanel.classList.add("hidden")

        !isResize && selectSkinPanel.classList.toggle("hidden")

        selectSkinPanel.style.left = `${boundings.x - width / 2 + boundings.width / 2}px`
        selectSkinPanel.style.top = `${boundings.y - height - 5}px`
    }

    function enterGame() {
        const enterGameBtn = document.querySelector("#enterGame")

        toggleSelectSkin(null, false, true)
        toggleLoadingMenu(true)
        setLoadingText("Connecting...")
    }

    function setLoadingText(text) {
        const bettermmLoading = document.querySelector("#better_mm_loading")
        const loadingText = bettermmLoading.querySelector(".loading-text")

        loadingText.innerHTML = text
    }

    function toggleDisconnectMenu(visibility) {
        const bettermmDisconnect = document.querySelector("#better_mm_disconnect")

        if (visibility) {
            bettermmDisconnect.classList.remove("hidden")
            toggleLoadingMenu(false)
            toggleSelectSkin(null, false, true)

            return toggleBettermmContainer(false)
        }

        bettermmDisconnect.classList.add("hidden")
        toggleBettermmContainer(true)
        toggleLoadingMenu(false)
    }

    function toggleLoadingMenu(visibility) {
        const bettermmLoading = document.querySelector("#better_mm_loading")

        if (visibility) {
            bettermmLoading.classList.remove("hidden")
            toggleSelectSkin(null, false, true)

            return toggleBettermmContainer(false)
        }

        bettermmLoading.classList.add("hidden")
        toggleBettermmContainer(true)
    }

    function toggleBettermmContainer(visibility) {
        const bettermmContainer = document.querySelector("#better_mm_container")

        if (visibility) {
            return bettermmContainer.classList.remove("hidden")
        }

        bettermmContainer.classList.add("hidden")
    }

    function getGameServers() {
        const currentMode = location.host.replace(/\.moomoo\.io/, "")
        const getRequestUrl = () => {
            if (/(sandbox|dev)/.test(currentMode)) {
                return `https://api-${currentMode}.moomoo.io/servers?v=1.22`
            }

            return "https://api.moomoo.io/servers"
        }

        return new Promise((resolve) => {
            fetch(getRequestUrl()).then((res) => res.text()).then((servers) => resolve(JSON.parse(servers)))
        })
    }

    async function updateGameServers() {
        let servers = await getGameServers()

        const [ currentServerRegion, currentServerName ] = location.href.replace(/.+\=/, "").split(":")
        const gameServers = document.querySelector("#game_servers")
        const serversByRegions = {}

        gameServers.innerHTML = ""

        for (const server of servers) {
            if (!serversByRegions[server.region]) {
                serversByRegions[server.region] = []
            }

            serversByRegions[server.region].push(server)
        }

        servers = Object.values(serversByRegions)

        for (let serversRegion of servers) {
            serversRegion = serversRegion.sort((a, b) => b.playerCount - a.playerCount)

            for (let i = 0; i < serversRegion.length; i++) {
                const server = serversRegion[i]
                const requestPingUrl = `https://${server.key}.${server.region}.moomoo.io/ping/9mm`
                const sentTime = Date.now()
                const currentMode = location.host.replace(/\.moomoo\.io/, "")
                const id = `${server.region}_${server.name}`
                const isCurrentServer = server.region === currentServerRegion && server.name === currentServerName

                gameServers.insertAdjacentHTML(isCurrentServer ? "afterbegin" : "beforeend", `
                <li class="item${isCurrentServer ? " light-background" : ""}">
                    <div class="server-data-wrapper">
                        <header class="server-data-header">
                            <span class="server-data-players">
                                (${server.playerCount}/${server.playerCapacity})
                            </span>${window.regionsName[server.region]} ${server.name}
                        </header>

                        <div class="server-data-actions">
                            <span class="server-data-ping" id="${id}_ping"></span>
                            ${!isCurrentServer ? `<div class="server-open-btn" id="${id}_open">GO!</div>` : ""}
                        </div>
                    </div>
                </li>
                `)

                const serverOpenBtn = document.querySelector(`#${id}_open`)

                if (serverOpenBtn) {
                    serverOpenBtn.addEventListener("click", () => {
                        window.open(`https://${currentMode !== "" ? currentMode + "." : ""}moomoo.io/?server=${server.region}:${server.name}`)
                    })
                }

                fetch(requestPingUrl).then(() => {
                    const ping = Date.now() - sentTime
                    const serverDataPing = document.querySelector(`#${server.region}_${server.name}_ping`)

                    if (ping >= 500) {
                        serverDataPing.classList.add("red")
                    } else if (ping >= 350 && ping < 500) {
                        serverDataPing.classList.add("low-red")
                    } else if (ping >= 200 && ping < 350) {
                        serverDataPing.classList.add("yellow")
                    } else if (ping >= 100 && ping < 200) {
                        serverDataPing.classList.add("low-green")
                    } else {
                        serverDataPing.classList.add("green")
                    }

                    serverDataPing.innerHTML = ping
                })
            }
        }
    }

    function getModVersions() {
        return `
1.0.1 (5/02/2024):
> Added auto spike sync.
> Added distance check for building markers.
> Optimization for any keyboard.
> Fixed a bug with infinite loading.

1.0.0 (4/02/2024):
> Release.
> Mini update auto mills.
> Added custom main menu.
> Added auto tank and bull hats.
> Added building markers/hp.
> Added items count.
> Store was returned.

1.0.0b (2/02/2024):
> Beta release.
        `
    }

    async function updateChangelog(versions, appendNodeSelector, linesSlice = 0) {
        const changelog = document.querySelector(appendNodeSelector)
        const versionsList = versions.split(/\n/).slice(linesSlice).filter((line) => line !== "" && !/\s\s\-\s/.test(line))

        for (let i = 0; i < versionsList.length; i++) {
            const versionsLine = versionsList[i]

            if (!/^\d/.test(versionsLine)) continue

            const currentVersion = versionsLine.replace(/\:.+$/, ":").replace(/\)\s.+\:/, ":")
            const parsedVersion = currentVersion.replace(/\(.+/, "").replace(/\s\-/, "")
            const versionDate = currentVersion.replace(/^.+\(/, "(").replace(/(\(|\)|\:)/g, "").split("/")
            const date = `${versionDate[1]}/${versionDate[0]}/${versionDate[2]}`
            const month = new Date(date).toLocaleString('en-GB', { month: 'long' })
            const nextGameVersionIndex = versionsList.slice(i + 1).findIndex((line) => /^\d+\./.test(line))
            const updatesList = versionsList.slice(i + 1, (i + 1) + nextGameVersionIndex)

            if (/0\.10/.test(parsedVersion) && linesSlice !== 0) {
                updatesList.push("> Initial Release")
            }

            if (/1\.0\.0b/.test(parsedVersion) && linesSlice === 0) {
                updatesList.push("> Beta release.")
            }

            changelog.insertAdjacentHTML("beforeend", `
            <li class="item">
                <header class="changelog-item-header">${parsedVersion} (${month} ${versionDate[0]}, ${versionDate[2]})</header>

                <div class="changelog-updates">
                ${updatesList.map((update) => `
                <div class="changelog-version-info">
                    <span class="changelog-update-value">${update.replace(/\>\s/, "")}</span>
                </div>
                `).join("")}
                </div>
            </li>
            `)
        }
    }

    function createCustomHtmlAndCss() {
        const style = document.createElement("style")

        style.insertAdjacentHTML("beforeend", `
        .hidden {
            display: none !important;
        }

        .item-count {
            position: absolute;
            display: block;
            color: #fff;
            font-size: 16px;
            margin: 2px 5px;
        }

        .item-count.scale-anim {
            transform: scale(1);
            animation: item-count-scale-anim 1s;
        }

        @keyframes item-count-scale-anim {
            0% {
                transform: scale(1);
            }

            50% {
                transform: scale(1.1);
            }

            100% {
                transform: scale(1);
            }
        }

        .actionBarItem {
            text-align: end;
        }

        #actionBar {
            display: flex !important;
            justify-content: center;
            margin-bottom: 5px;
        }

        #menuContainer, #settingsButton, #partyButton, #linksContainer2, #joinPartyButton {
            display: none !important;
        }
        `)

        document.head.appendChild(style)
    }

    const maxScreenWidth = 1920
    const maxScreenHeight = 1080
    const { lineTo, moveTo } = CanvasRenderingContext2D.prototype
    const gridAlpha = 0.06

    CanvasRenderingContext2D.prototype.moveTo = function(x, y) {
        if (localStorage.remove_grid == "false") return moveTo.apply(this, arguments)
        if (this.globalAlpha === gridAlpha) return

        return moveTo.apply(this, arguments)
    }

    CanvasRenderingContext2D.prototype.lineTo = function(x, y) {
        if (localStorage.remove_grid == "false") return lineTo.apply(this, arguments)
        if (this.globalAlpha === gridAlpha && (y === maxScreenHeight || x === maxScreenWidth)) return

        return lineTo.apply(this, arguments)
    }

    const turnSpeeds = {
        9: .003,
        10: .0016,
        11: .0025,
        12: .005,
    }

    Object.defineProperty(Object.prototype, "turnSpeed", {
        get() {
            if (![10, 11, 12].includes(this.id)) return turnSpeeds[this.id]

            return localStorage.mill_rotate == "true" ? turnSpeeds[this.id] : 0
        },
        set(value) {
            this[Symbol("turnSpeed")] = value
        }
    })

    window.fetch = new Proxy(fetch, {
        apply(target, _this, args) {
            if (/\/ping/.test(args[0]) && !/\/9mm/.test(args[0])) {
                return target.apply(_this)
            }

            if (/\/9mm/.test(args[0])) {
                args[0] = args[0].replace(/\/9mm/, "")
            }

            return target.apply(_this, args)
        }
    })

    console._error = console.error
    console.error = function(error) {
        // FK THIS FKING ERROR!!! FK U FAILED TO LOAD. I'VE BEEN FIXING YOU FOR 4 FUCKING HOURS.
        if (error === "Failed to load.") {
            setInterval(() => {
                setLoadingText("Failed to load -___-")
                toggleBettermmContainer(false)
                toggleLoadingMenu(true)
            })
        }

        this._error(error)
    }

    window.regionsName = {
        "us-east": "Miami",
        "us-west": "Silicon Valley",
        "gb": "London",
        "eu-west": "Frankfurt",
        "au": "Sydney",
        "sg": "Singapore"
    }
})()
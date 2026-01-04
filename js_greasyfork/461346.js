// ==UserScript==
// @name         Nitro Type - Racing Mini Map by MV Typing
// @version      0.2.0
// @description  Displays a mini map of the Race Track Version 2. 1st version is made by toonidy:) Subscribe to MV Typing on YouTube!
// @author       MV Typing
// @match        *://*.nitrotype.com/race
// @match        *://*.nitrotype.com/race/*
// @icon         https://i.ibb.co/YRs06pc/toonidy-userscript.png
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/pixi.js/6.5.4/browser/pixi.min.js
// @require      https://greasyfork.org/scripts/443718-nitro-type-userscript-utils/code/Nitro%20Type%20Userscript%20Utils.js?version=1042360
// @license      MIT
// @namespace    https://greasyfork.org/users/858426
// @downloadURL https://update.greasyfork.org/scripts/461346/Nitro%20Type%20-%20Racing%20Mini%20Map%20by%20MV%20Typing.user.js
// @updateURL https://update.greasyfork.org/scripts/461346/Nitro%20Type%20-%20Racing%20Mini%20Map%20by%20MV%20Typing.meta.js
// ==/UserScript==

/* globals PIXI findReact createLogger */

const config = {
     colors: {
        me: 0xf2887f,
        opponentPlayer: 0x9E00FF,
        opponentBot: 0xF3FF00,
        opponentWampus: 0xFF8000,
        nitro: 0xFF00D8,
        background: 0x696969,
        raceLane: 0xFF0000,
        startLine: 0x00F3FF,
        finishLine: 0x3200FF,
    },
    trackLocally: true, // whether to track your player's position without server data
    moveDestination: {
        enabled: true,
        alpha: 0.5, // range 0.0 - 1.0 (the lower the value, the more transparent)
    },
}

const logging = createLogger("Nitro Type Racing Mini Map"),
      raceContainer = document.querySelector("#raceContainer"),
      raceObj = raceContainer ? findReact(raceContainer) : null
if (!raceContainer || !raceObj) {
    logging.error("Init")("Could not find the race track")
    return
}
if (!raceObj.props.user.loggedIn) {
    logging.error("Init")("This userscript is not available for Guest Racing")
    return
}

PIXI.utils.skipHello()

const style = document.createElement("style")
style.appendChild(
        document.createTextNode(`
.nt-racing-mini-map-root canvas {
    display: block;
}`))
document.head.appendChild(style)

const racingMiniMap = new PIXI.Application({ width: 1024, height: 100, backgroundColor: config.colors.background }),
      container = document.createElement("div");

container.className = "nt-racing-mini-map-root"

///////////////////////
//  Prepare Objects  //
///////////////////////

const RACER_WIDTH = 28,
      CROSSING_LINE_WIDTH = 32,
      PADDING = 2,
      racers = Array(5).fill(null),
      server = raceObj.server,
      currentUserID = raceObj.props.user.userID

// Draw mini racetrack
const raceTrackBG = new PIXI.TilingSprite.from("/dist/site/images/backgrounds/bg-noise.png", { width: racingMiniMap.renderer.width, height: racingMiniMap.renderer.height} ),
      startLine = PIXI.Sprite.from(PIXI.Texture.WHITE),
      finishLine = PIXI.Sprite.from(PIXI.Texture.WHITE)

startLine.x = CROSSING_LINE_WIDTH
startLine.y = 0
startLine.width = 1
startLine.height = racingMiniMap.renderer.height
startLine.tint = config.colors.startLine

finishLine.x = racingMiniMap.renderer.width - CROSSING_LINE_WIDTH - 1
finishLine.y = 0
finishLine.width = 1
finishLine.height = racingMiniMap.renderer.height
finishLine.tint = config.colors.finishLine

raceTrackBG.addChild(startLine, finishLine)

for (let i = 1; i < 5; i++) {
    const lane = PIXI.Sprite.from(PIXI.Texture.WHITE)
    lane.x = 0
    lane.y = i * (racingMiniMap.renderer.height / 5)
    lane.width = racingMiniMap.renderer.width
    lane.height = 1
    lane.tint = config.colors.raceLane
    raceTrackBG.addChild(lane)
}

racingMiniMap.stage.addChild(raceTrackBG)

/* Mini Map movement animation update. */
function animateRacerTicker() {
    const r = this
    const lapse = Date.now() - r.lastUpdated
    if (r.sprite.x < r.toX) {
        const distance = r.toX - r.fromX
        r.sprite.x = r.fromX + Math.min(distance, distance * (lapse / r.moveMS))
        if (r.ghostSprite && r.sprite.x === r.ghostSprite.x) {
            r.ghostSprite.renderable = false
        }
    }
    if (r.skipped > 0) {
        const nitroTargetWidth = r.nitroToX - r.nitroFromX
        if (r.nitroSprite.width < nitroTargetWidth) {
            r.nitroSprite.width = Math.min(nitroTargetWidth, r.sprite.x - r.nitroFromX)
        } else if (r.nitroSprite.width === nitroTargetWidth && r.nitroSprite.alpha > 0 && !r.nitroDisableFade) {
            if (r.nitroSprite.alpha === 1) {
                r.nitroStartFadeStamp = Date.now() - 1
            }
            r.nitroSprite.alpha = Math.max(0, 1 - ((Date.now() - r.nitroStartFadeStamp) / 1e3))
        }
    }
    if (r.completeStamp !== null && r.sprite.x === r.toX && r.nitroSprite.alpha === 0) {
        racingMiniMap.ticker.remove(animateRacerTicker, this)
    }
}

/* Handle adding in players on the mini map. */
server.on("joined", (e) => {
    const { lane, userID } = e

    let color = config.colors.opponentBot
    if (userID === currentUserID) {
        color = config.colors.me
    } else if (!e.robot) {
        color = config.colors.opponentPlayer
    } else if (e.profile.specialRobot === "wampus") {
        color = config.colors.opponentWampus
    }

    if (racers[lane]) {
        racers[lane].ghostSprite.tint = color
        racers[lane].sprite.tint = color
        racers[lane].sprite.x = 0 - RACER_WIDTH + PADDING
        racers[lane].lastUpdated = Date.now()
        racers[lane].fromX = racers[lane].sprite.x
        racers[lane].toX = PADDING
        racers[lane].sprite.renderable = true
        return
    }

    const r = PIXI.Sprite.from(PIXI.Texture.WHITE)
    r.x = 0 - RACER_WIDTH + PADDING
    r.y = PADDING + (lane > 0 ? 1 : 0) + (lane * (racingMiniMap.renderer.height / 5))
    r.tint = color
    r.width = RACER_WIDTH
    r.height = 16 - (lane > 0 ? 1 : 0)

    const n = PIXI.Sprite.from(PIXI.Texture.WHITE)
    n.y = r.y + ((16 - (lane > 0 ? 1 : 0)) / 2) - 1
    n.renderable = false
    n.tint = config.colors.nitro
    n.width = 1
    n.height = 2

    racers[lane] = {
        lane,
        sprite: r,
        userID: userID,
        ghostSprite: null,
        nitroSprite: n,
        lastUpdated: Date.now(),
        fromX: r.x,
        toX: PADDING,
        skipped: 0,
        nitroStartFadeStamp: null,
        nitroFromX: null,
        nitroToX: null,
        nitroDisableFade: false,
        moveMS: 500,
        completeStamp: null,
    }

    if (config.moveDestination.enabled) {
        const g = PIXI.Sprite.from(PIXI.Texture.WHITE)
        g.x = PADDING
        g.y = PADDING + (lane > 0 ? 1 : 0) + (lane * (racingMiniMap.renderer.height / 5))
        g.tint = color
        g.alpha = config.moveDestination.alpha
        g.width = RACER_WIDTH
        g.height = 16 - (lane > 0 ? 1 : 0)
        g.renderable = false

        racers[lane].ghostSprite = g
        racingMiniMap.stage.addChild(g)
    }

    racingMiniMap.stage.addChild(n)
    racingMiniMap.stage.addChild(r)

    racingMiniMap.ticker.add(animateRacerTicker, racers[lane])
})

/* Handle any players leaving the race track. */
server.on("left", (e) => {
    const lane = racers.findIndex((r) => r?.userID === e)
    if (racers[lane]) {
        racers[lane].sprite.renderable = false
        racers[lane].ghostSprite.renderable = false
        racers[lane].nitroSprite.renderable = false
    }
})

/* Handle race map progress position updates. */
server.on("update", (e) => {
    let moveFinishMS = 500

    const payloadUpdateRacers = e.racers.slice().sort((a, b) => {
        if (a.progress.completeStamp === b.progress.completeStamp) {
            return 0
        }
        if (a.progress.completeStamp === null) {
            return 1
        }
        return a.progress.completeStamp > 0 && b.progress.completeStamp > 0 && a.progress.completeStamp > b.progress.completeStamp ? 1 : -1
    })

    for (let i = 0; i < payloadUpdateRacers.length; i++) {
        const r = payloadUpdateRacers[i],
              { completeStamp, skipped } = r.progress,
              racerObj = racers[r.lane]
        if (!racerObj || racerObj.completeStamp > 0 || (r.userID === currentUserID && completeStamp <= 0 && config.trackLocally)) {
            continue
        }

        if (r.disqualified) {
            racingMiniMap.ticker.remove(animateRacerTicker, racerObj)
            racingMiniMap.stage.removeChild(racerObj.sprite, racerObj.nitroSprite)
            if (racerObj.ghostSprite) {
                racingMiniMap.stage.removeChild(racerObj.ghostSprite)
            }
            racerObj.sprite.destroy()
            racerObj.ghostSprite.destroy()
            racerObj.nitroSprite.destroy()

            racers[r.lane] = null
            continue
        }

        racerObj.lastUpdated = Date.now()
        racerObj.fromX = racerObj.sprite.x

        if (racerObj.completeStamp === null && completeStamp > 0) {
            racerObj.completeStamp = completeStamp
            racerObj.toX = racingMiniMap.renderer.width - RACER_WIDTH - PADDING
            racerObj.moveMS = moveFinishMS

            if (racerObj.nitroDisableFade) {
                racerObj.nitroToX = racingMiniMap.renderer.width - RACER_WIDTH - PADDING
                racerObj.nitroDisableFade = false
            }
        } else {
            racerObj.moveMS = 1e3
            racerObj.toX = r.progress.percentageFinished * (racingMiniMap.renderer.width - RACER_WIDTH - CROSSING_LINE_WIDTH - PADDING - 1)
            racerObj.sprite.x = racerObj.fromX
        }

        if (racerObj.ghostSprite) {
            racerObj.ghostSprite.x = racerObj.toX
            racerObj.ghostSprite.renderable = true
        }

        if (skipped !== racerObj.skipped) {
            if (racerObj.skipped === 0) {
                racerObj.nitroFromX = racerObj.fromX
                racerObj.nitroSprite.x = racerObj.fromX
                racerObj.nitroSprite.renderable = true
            }
            racerObj.skipped = skipped // because infinite nitros exist? :/
            racerObj.nitroToX = racerObj.toX
            racerObj.nitroSprite.alpha = 1
            if (racerObj.completeStamp !== null) {
                racerObj.nitroToX = racingMiniMap.renderer.width - RACER_WIDTH - PADDING
            }
        }

        if (completeStamp > 0 && i + 1 < payloadUpdateRacers.length) {
            const nextRacer = payloadUpdateRacers[i + 1],
                  nextRacerObj = racers[nextRacer?.lane]
            if (nextRacerObj && nextRacerObj.completeStamp === null && nextRacer.progress.completeStamp > 0 && nextRacer.progress.completeStamp > completeStamp) {
                moveFinishMS += 250
            }
        }
    }
})

if (config.trackLocally) {
    let lessonLength = 0
    server.on("status", (e) => {
        if (e.status === "countdown") {
            lessonLength = e.lessonLength
        }
    })

    const originalSendPlayerUpdate = server.sendPlayerUpdate
    server.sendPlayerUpdate = (data) => {
        originalSendPlayerUpdate(data)
        const racerObj = racers.find((r) => r?.userID === currentUserID)
        if (!racerObj) {
            return
        }

        const percentageFinished = (data.t / (lessonLength || 1))
        racerObj.lastUpdated = Date.now()
        racerObj.fromX = racerObj.sprite.x
        racerObj.moveMS = 500
        racerObj.toX = percentageFinished * (racingMiniMap.renderer.width - RACER_WIDTH - CROSSING_LINE_WIDTH - PADDING - 1)
        racerObj.sprite.x = racerObj.fromX

        if (racerObj.ghostSprite) {
            racerObj.ghostSprite.x = racerObj.toX
            racerObj.ghostSprite.renderable = true
        }

        if (data.s) {
            if (racerObj.skipped === 0) {
                racerObj.nitroFromX = racerObj.fromX
                racerObj.nitroSprite.x = racerObj.fromX
                racerObj.nitroSprite.renderable = true
            }
            racerObj.skipped = data.s // because infinite nitros exist? but I'm not going to test that! :/
            racerObj.nitroToX = racerObj.toX
            racerObj.nitroSprite.alpha = 1
            racerObj.nitroDisableFade = percentageFinished === 1

            if (racerObj.completeStamp !== null) {
                racerObj.nitroToX = racingMiniMap.renderer.width - RACER_WIDTH - PADDING
            }
        }
    }
}

/////////////
//  Final  //
/////////////

container.append(racingMiniMap.view)
raceContainer.before(container)// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.nitrotype.com/garage
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nitrotype.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();
// ==UserScript==
// @name         Nitro Type - Sandbagging Tool (19.49WPM (Fastest Race))
// @version      1.1.2
// @description  Displays a WPM countdown allowing you to closely reach your intended sandbagging target. Changed values and reuploaded so I can use as a Userscripts on my iPad, as editing Userscripts isn’t working atm via web inspector app. For the real version, see Toonidy’s Sandbagging Tool,
// @author       Toonidy
// @match        *://*.nitrotype.com/race
// @match        *://*.nitrotype.com/race/*
// @icon         https://i.ibb.co/YRs06pc/toonidy-userscript.png
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/interact.js/1.10.27/interact.min.js
// @license      MIT
// @namespace    https://greasyfork.org/users/858426
// @downloadURL https://update.greasyfork.org/scripts/503182/Nitro%20Type%20-%20Sandbagging%20Tool%20%281949WPM%20%28Fastest%20Race%29%29.user.js
// @updateURL https://update.greasyfork.org/scripts/503182/Nitro%20Type%20-%20Sandbagging%20Tool%20%281949WPM%20%28Fastest%20Race%29%29.meta.js
// ==/UserScript==

/* globals interact */

const config = {
    targetWPM: 19.49,
    indicateWPMWithin: 9,
    timerRefreshIntervalMS: 10,
    raceLatencyMS: 140,
}

/////////////
//  Utils  //
/////////////

/** Finds the React Component from given dom. */
const findReact = (dom, traverseUp = 0) => {
    const key = Object.keys(dom).find((key) => key.startsWith("__reactFiber$"))
    const domFiber = dom[key]
    if (domFiber == null) return null
    const getCompFiber = (fiber) => {
        let parentFiber = fiber?.return
        while (typeof parentFiber?.type == "string") {
            parentFiber = parentFiber?.return
        }
        return parentFiber
    }
    let compFiber = getCompFiber(domFiber)
    for (let i = 0; i < traverseUp && compFiber; i++) {
        compFiber = getCompFiber(compFiber)
    }
    return compFiber?.stateNode
}

/** Console logging with some prefixing. */
const logging = (() => {
    const logPrefix = (prefix = "") => {
        const formatMessage = `%c[Nitro Type Race Timer]${prefix ? `%c[${prefix}]` : ""}`
        let args = [console, `${formatMessage}%c`, "background-color: #D62F3A; color: #fff; font-weight: bold"]
        if (prefix) {
            args = args.concat("background-color: #4f505e; color: #fff; font-weight: bold")
        }
        return args.concat("color: unset")
    }
    return {
        info: (prefix) => Function.prototype.bind.apply(console.info, logPrefix(prefix)),
        warn: (prefix) => Function.prototype.bind.apply(console.warn, logPrefix(prefix)),
        error: (prefix) => Function.prototype.bind.apply(console.error, logPrefix(prefix)),
        log: (prefix) => Function.prototype.bind.apply(console.log, logPrefix(prefix)),
        debug: (prefix) => Function.prototype.bind.apply(console.debug, logPrefix(prefix)),
    }
})()

/** Get Nitro Word Length. */
const nitroWordLength = (words, i) => {
    let wordLength = words[i].length + 1
    if (i > 0 && i + 1 < words.length) {
        wordLength++
    }
    return wordLength
}

/** Get Player Avg using lastRaces data. */
const getPlayerAvg = (prefix, raceObj, lastRaces) => {
    const raceLogs = (lastRaces || raceObj.props.user.lastRaces)
        .split("|")
        .map((r) => {
            const data = r.split(","),
                typed = parseInt(data[0], 10),
                time = parseFloat(data[1]),
                errs = parseInt(data[2])
            if (isNaN(typed) || isNaN(time) || isNaN(errs)) {
                return false
            }
            return {
                time,
                acc: 1 - errs / typed,
                wpm: typed / 5 / (time / 60),
            }
        })
        .filter((r) => r !== false)

    const avgSpeed = raceLogs.reduce((prev, current) => prev + current.wpm, 0.0) / Math.max(raceLogs.length, 1)

    logging.info(prefix)("Avg Speed", avgSpeed)
    console.table(raceLogs, ["time", "acc", "wpm"])

    return avgSpeed
}

///////////////
//  Backend  //
///////////////

if (config.targetWPM <= 0) {
    logging.error("Init")("Invalid target WPM value")
    return
}

const raceContainer = document.getElementById("raceContainer"),
    raceObj = raceContainer ? findReact(raceContainer) : null,
    server = raceObj?.server,
    currentUserID = raceObj?.props.user.userID
if (!raceContainer || !raceObj) {
    logging.error("Init")("Could not find the race track")
    return
}

let raceTimeLatency = null

/** Styles for the following components. */
const style = document.createElement("style")
style.appendChild(
    document.createTextNode(`
/* Some Overrides */
.race-results {
    z-index: 6;
}

/* Sandbagging Tool */
.nt-evil-sandbagging-root {
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 5;
    color: #eee;
    touch-action: none;
}
.nt-evil-sandbagging-metric-value {
    font-weight: 600;
    font-family: "Roboto Mono", "Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace;
}
.nt-evil-sandbagging-metric-suffix {
    color: #aaa;
}
.nt-evil-sandbagging-live {
    padding: 5px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    background-color: rgb(0, 0, 0, 0.95);
    text-align: center;
}
.nt-evil-sandbagging-live span.live-wpm-inactive {
    opacity: 0.5;
}
.nt-evil-sandbagging-live > span:not(.live-wpm-inactive) .nt-evil-sandbagging-metric-value {
    color: #ffe275;
}
.nt-evil-sandbagging-best-live-wpm {
    font-size: 10px;
}
.nt-evil-sandbagging-section {
    padding: 5px;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    font-size: 10px;
    text-align: center;
}
.nt-evil-sandbagging-stats {
    background-color: rgba(20, 20, 20, 0.95);
}
.nt-evil-sandbagging-results {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    background-color: rgba(55, 55, 55, 0.95);
}`)
)
document.head.appendChild(style)

/** Manages and displays the race timer. */
const RaceTimer = ((config) => {
    // Restore widget settings
    let widgetSettings = null
    try {
        const data = localStorage.getItem("nt_sandbagging_tool")
        if (typeof data === "string") {
            widgetSettings = JSON.parse(data)
        }
    } catch {
        widgetSettings = null
    }
    if (widgetSettings === null) {
        widgetSettings = { x: 384, y: 285 }
    }

    // Setup Widget
    const root = document.createElement("div")
    root.classList.add("nt-evil-sandbagging-root", "has-live-wpm")
    root.dataset.x = widgetSettings.x
    root.dataset.y = widgetSettings.y
    root.style.transform = `translate(${parseFloat(root.dataset.x) || 0}px, ${parseFloat(root.dataset.y) || 0}px)`
    root.innerHTML = `
        <div class="nt-evil-sandbagging-live">
            <span class="nt-evil-sandbagging-current-live-wpm live-wpm-inactive">
                <span class="nt-evil-sandbagging-live-wpm nt-evil-sandbagging-metric-value">0.00</span> <small class="nt-evil-sandbagging-metric-suffix">WPM</small>
            </span>
            <span class="nt-evil-sandbagging-best-live-wpm live-wpm-inactive">
                (<span class="nt-evil-sandbagging-metric-value">0.00</span> <small class="nt-evil-sandbagging-metric-suffix">WPM</small>)
            </span>
        </div>
        <div class="nt-evil-sandbagging-section nt-evil-sandbagging-stats">
            Timer: <span class="nt-evil-sandbagging-live-time nt-evil-sandbagging-metric-value">0.00</span> / <span class="nt-evil-sandbagging-target-time nt-evil-sandbagging-metric-value">0.00</span> <small class="nt-evil-sandbagging-metric-suffix">sec</small> |
            Target: <span class="nt-evil-sandbagging-metric-value">${config.targetWPM}</span> <small class="nt-evil-sandbagging-metric-suffix">WPM</small> |
            Avg: <span class="nt-evil-sandbagging-current-avg-wpm nt-evil-sandbagging-metric-value">?</span> <small class="nt-evil-sandbagging-metric-suffix">WPM</small>
        </div>
        <div class="nt-evil-sandbagging-section nt-evil-sandbagging-results">
            Time: <span class="nt-evil-sandbagging-result-time nt-evil-sandbagging-metric-value">?</span> <small class="nt-evil-sandbagging-metric-suffix">secs</small> |
            Speed: <span class="nt-evil-sandbagging-result-wpm nt-evil-sandbagging-metric-value">?</span> <small class="nt-evil-sandbagging-metric-suffix">WPM</small> |
            Avg: <span class="nt-evil-sandbagging-new-avg-wpm nt-evil-sandbagging-metric-value">?</span> <small class="nt-evil-sandbagging-metric-suffix">WPM</small> |
            Latency: <span class="nt-evil-sandbagging-latency nt-evil-sandbagging-metric-value">?</span> <small class="nt-evil-sandbagging-metric-suffix">ms</small>
        </div>`

    const liveContainerNode = root.querySelector(".nt-evil-sandbagging-live"),
          liveCurrentWPMContainerNode = liveContainerNode.querySelector(".nt-evil-sandbagging-current-live-wpm"),
        liveWPMValueNode = liveCurrentWPMContainerNode.querySelector(".nt-evil-sandbagging-live-wpm"),
        liveBestWPMContainerNode = liveContainerNode.querySelector(".nt-evil-sandbagging-best-live-wpm"),
        liveBestWPMValueNode = liveBestWPMContainerNode.querySelector(".nt-evil-sandbagging-metric-value"),
        statContainerNode = root.querySelector(".nt-evil-sandbagging-stats"),
        liveTimeNode = statContainerNode.querySelector(".nt-evil-sandbagging-live-time"),
        targetTimeNode = statContainerNode.querySelector(".nt-evil-sandbagging-target-time"),
        currentAvgWPMNode = statContainerNode.querySelector(".nt-evil-sandbagging-current-avg-wpm"),
        resultContainerNode = root.querySelector(".nt-evil-sandbagging-results"),
        resultTimeNode = resultContainerNode.querySelector(".nt-evil-sandbagging-result-time"),
        resultWPMNode = resultContainerNode.querySelector(".nt-evil-sandbagging-result-wpm"),
        resultNewAvgWPMNode = resultContainerNode.querySelector(".nt-evil-sandbagging-new-avg-wpm"),
        resultLatencyNode = resultContainerNode.querySelector(".nt-evil-sandbagging-latency")

    resultContainerNode.remove()

    let timer = null,
        targetWPM = config.targetWPM || 79.49,
        startTime = null,
        finishTime = null,
        skipLength = null,
        bestSkipLength = null,
        lessonLength = null,
        onTargetTimeUpdate = null,
        onTimeUpdate = null

    /** Updates the race timer metrics. */
    const refreshCurrentTime = () => {
        if (startTime === null) {
            logging.warn("Update")("Invalid last time, unable to update current timer")
            return
        }
        if (finishTime !== null) {
            return
        }

        let diff = Date.now() - startTime
        if (onTimeUpdate) {
            onTimeUpdate(diff)
        }
        liveTimeNode.textContent = (diff / 1e3).toFixed(2)

        diff /= 6e4
        const currentWPM = (lessonLength - skipLength) / 5 / diff,
              bestWPM = (lessonLength - bestSkipLength) / 5 / diff
        liveWPMValueNode.textContent = currentWPM.toFixed(2)
        liveBestWPMValueNode.textContent = bestWPM.toFixed(2)

        if (currentWPM - targetWPM <= config.indicateWPMWithin) {
            liveCurrentWPMContainerNode.classList.remove("live-wpm-inactive")
        }
        if (bestWPM - targetWPM <= config.indicateWPMWithin) {
            liveBestWPMContainerNode.classList.remove("live-wpm-inactive")
        }
        timer = setTimeout(refreshCurrentTime, config.timerRefreshIntervalMS)
    }

    /** Toggle whether to show best wpm counter or not (the small text). */
    const toggleBestLiveWPM = (show) => {
        if (show) {
            liveContainerNode.append(liveBestWPMContainerNode)
        } else {
            liveBestWPMContainerNode.remove()
        }
    }

    /** Save widget settings. */
    const saveSettings = () => {
        localStorage.setItem("nt_sandbagging_tool", JSON.stringify(widgetSettings))
    }
    saveSettings()

    /** Setup draggable widget. */
    interact(root).draggable({
        modifiers: [
            interact.modifiers.restrictRect({
                //restriction: "parent",
                endOnly: true,
            }),
        ],
        listeners: {
            move: (event) => {
                const target = event.target,
                    x = (parseFloat(target.dataset.x) || 0) + event.dx,
                    y = (parseFloat(target.dataset.y) || 0) + event.dy

                target.style.transform = "translate(" + x + "px, " + y + "px)"

                target.dataset.x = x
                target.dataset.y = y

                widgetSettings.x = x
                widgetSettings.y = y

                saveSettings()
            },
        },
    })

    return {
        root,
        setTargetWPM: (wpm) => {
            targetWPM = wpm
        },
        setLessonLength: (l) => {
            lessonLength = l
        },
        getLessonLength: () => lessonLength,
        setSkipLength: (l) => {
            skipLength = l
            toggleBestLiveWPM(false)
            if (skipLength !== bestSkipLength) {
                const newTime = ((lessonLength - skipLength) / 5 / targetWPM) * 60
                if (onTargetTimeUpdate) {
                    onTargetTimeUpdate(newTime * 1e3)
                }
                targetTimeNode.textContent = newTime.toFixed(2)
            }
        },
        setBestSkipLength: (l) => {
            bestSkipLength = l
            const newTime = ((lessonLength - bestSkipLength) / 5 / targetWPM) * 60
            if (onTargetTimeUpdate) {
                onTargetTimeUpdate(newTime * 1e3)
            }
            targetTimeNode.textContent = newTime.toFixed(2)
        },
        start: (t) => {
            if (timer) {
                clearTimeout(timer)
            }
            startTime = t
            refreshCurrentTime()
        },
        stop: () => {
            if (timer) {
                finishTime = Date.now()
                clearTimeout(timer)
            }
        },
        setCurrentAvgSpeed: (wpm) => {
            currentAvgWPMNode.textContent = wpm.toFixed(2)
        },
        reportFinishResults: (speed, avgSpeed, actualStartTime, actualFinishTime) => {
            const latency = actualFinishTime - finishTime,
                output = (latency / 1e3).toFixed(2)

            resultTimeNode.textContent = ((actualFinishTime - actualStartTime) / 1e3).toFixed(2)
            resultWPMNode.textContent = speed.toFixed(2)
            liveWPMValueNode.textContent = speed.toFixed(2)
            resultNewAvgWPMNode.textContent = avgSpeed.toFixed(2)
            resultLatencyNode.textContent = latency
            toggleBestLiveWPM(false)

            root.append(resultContainerNode)

            logging.info("Finish")(`Race Finish acknowledgement latency: ${output} secs (${latency}ms)`)
            return output
        },
        setOnTargetTimeUpdate: (c) => {
            onTargetTimeUpdate = c
        },
        setOnTimeUpdate: (c) => {
            onTimeUpdate = c
        },
    }
})(config)

window.NTRaceTimer = RaceTimer

/** Track Racing League for analysis. */
server.on("setup", (e) => {
    if (e.scores && e.scores.length === 2) {
        const [from, to] = e.scores
        logging.info("Init")("Racing League", JSON.stringify({ from, to, trackLeader: e.trackLeader }))
        RaceTimer.setCurrentAvgSpeed(getPlayerAvg("Init", raceObj))
    }
})

/** Track whether to start the timer and manage target goals. */
server.on("status", (e) => {
    if (e.status === "countdown") {
        RaceTimer.setLessonLength(e.lessonLength)

        const words = e.lesson.split(" ")

        let mostLetters = null,
            nitroWordCount = 0
        words.forEach((_, i) => {
            let wordLength = nitroWordLength(words, i)
            if (mostLetters === null || mostLetters < wordLength) {
                mostLetters = wordLength
            }
        })
        RaceTimer.setBestSkipLength(mostLetters)
    } else if (e.status === "racing") {
        RaceTimer.start(e.startStamp - config.raceLatencyMS)

        const originalSendPlayerUpdate = server.sendPlayerUpdate
        server.sendPlayerUpdate = (data) => {
            originalSendPlayerUpdate(data)
            if (data.t >= RaceTimer.getLessonLength()) {
                RaceTimer.stop()
            }
            if (typeof data.s === "number") {
                RaceTimer.setSkipLength(data.s)
            }
        }
    }
})

/** Track Race Finish exact time. */
server.on("update", (e) => {
    const me = e?.racers?.find((r) => r.userID === currentUserID)
    if (raceTimeLatency === null && me.progress.completeStamp > 0 && me.rewards) {
        const { typed, skipped, startStamp, completeStamp } = me.progress

        raceTimeLatency = RaceTimer.reportFinishResults(
            (typed - skipped) / 5 / ((completeStamp - startStamp) / 6e4),
            getPlayerAvg("Finish", raceObj, me.rewards.current.lastRaces),
            startStamp,
            completeStamp
        )
    }
})

/////////////
//  Final  //
/////////////

raceContainer.append(RaceTimer.root)
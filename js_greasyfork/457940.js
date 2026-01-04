// ==UserScript==
// @name         Evades tracers
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  All that this script gives is a tracert to all the balls. In some cases, the ut tracers do not work correctly.. Well, don't take offense at me.. I did it in 25 minutes on my knee.. (You need to choose the red color of the skin (magnax mode) for this to work)
// @author       Devil D. Nudo#7346
// @match        *://evades.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=evades.io
// @grant        none
// @run-at       dcoument-start
// @downloadURL https://update.greasyfork.org/scripts/457940/Evades%20tracers.user.js
// @updateURL https://update.greasyfork.org/scripts/457940/Evades%20tracers.meta.js
// ==/UserScript==

(function() {
    const { arc } = CanvasRenderingContext2D.prototype

    let myX = 0
    let myY = 0

    CanvasRenderingContext2D.prototype.arc = function() {
        const [ x, y, scale ] = arguments

        if (this.fillStyle === "#ff0000" && scale === 15) {
            myX = x
            myY = y
        } else if (scale > 10 && this.fillStyle.length > 4 && scale !== 15) {
            this.save()
            this.lineCap = "round"
            this.strokeStyle = "#8a2828"
            this.globalAlpha = .7
            this.listWidth = 4
            this.beginPath()
            this.moveTo(myX, myY)
            this.lineTo(x, y)
            this.stroke()
            this.closePath()
            this.restore()

            const distance = Math.hypot(y - myY, x - myX)
            const angle = Math.atan2(y - myY, x - myX)
            const maxDistance = Math.min(100, distance)
            const textX = myX + maxDistance * Math.cos(angle)
            const textY = myY + maxDistance * Math.sin(angle)

            this.save()
            this.fillStyle = "#d0d0d0"
            this.strokeStyle = "#1a1a1a"
            this.lineWidth = 3
            this.font = "bold 18px"
            this.strokeText(Math.round(distance), textX, textY)
            this.fillText(Math.round(distance), textX, textY)
            this.restore()
         }

        return arc.apply(this, arguments)
    }
})()
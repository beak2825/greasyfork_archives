// ==UserScript==
// @name           Daggers fix
// @description    Since the developers do not want to engage in this game, you can use this script to fix the rendering of daggers in the UI
// @namespace      https://greasyfork.org/ru/users/759782-nudo
// @version        1.0
// @author         @nudoo
// @match          *://sploop.io/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/485840/Daggers%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/485840/Daggers%20fix.meta.js
// ==/UserScript==

(function() {
    const { drawImage } = CanvasRenderingContext2D.prototype

    CanvasRenderingContext2D.prototype.drawImage = function(image, x, y, width, height) {
        if (/dagger/.test(image?.src) && (y === 5 || y > window.screen.availHeight - 100)) {
            this.save()
            this.strokeStyle = "rgba(45, 49, 49, .5)"
            this.lineWidth = 6

            this.roundRect(x + 3, y + 3, 95, 95, 16)
            this.stroke()
            this.restore()

            arguments[3] = arguments[4] = 80
            arguments[1] += 11
            arguments[2] += 11
        }

        drawImage.apply(this, arguments)
    }
})()
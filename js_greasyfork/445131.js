// ==UserScript==
// @name         Anti Invisible Buildings [No bundle]
// @namespace    -
// @version      0.1
// @description  Draws invisible objects (Sets a new dir (angle) for them)
// @author       Nudo#3310
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moomoo.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445131/Anti%20Invisible%20Buildings%20%5BNo%20bundle%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/445131/Anti%20Invisible%20Buildings%20%5BNo%20bundle%5D.meta.js
// ==/UserScript==

(function() {
    /**
     * @class AntiInvisible
     */
    let AntiInvisible = {}

    let { rotate } = CanvasRenderingContext2D.prototype

    /**
     * When the game is fully loaded, the main AntiInvisible parameters will be set
     * @method init
     */
    AntiInvisible.init = function() {
        /**Activate AntiInvisible*/
        AntiInvisible.toggler = true

        /**How transparent will the object itself be*/
        AntiInvisible.opacity = .6

        /**On which dir (angle) will AntiInvisible work*/
        AntiInvisible.invisibleAngle = 38e38
    }

    AntiInvisible.init()

    /**
     * Return fixed object direction.
     * @method getFixedDir
     * @param {Number} angle
     * @returns {Number} New object angle
     */
    AntiInvisible.getFixedDir = function(angle) {
        return Math.atan2(Math.sin(angle), Math.cos(angle))
    }

    /**
     * If it does not match the game normal dir then returns true otherwise false
     * @method isAbnormalDir
     * @param {Number} angle
     * @returns {Boolean}
     */
    AntiInvisible.isAbnormalDir = function(angle) {
        if (angle <= -AntiInvisible.invisibleAngle || angle >= AntiInvisible.invisibleAngle) {
            return true
        }
        return false
    }

    /**
     * Set opacity (globalAlpha) for an object
     * @method setOpacity
     * @param {Number} opacity
     */
    AntiInvisible.setOpacity = function(opacity) {
        this.globalAlpha = opacity
    }

    /**
     * Rotates the image
     * @method rotate
     * @param {Number} angle
     * @returns {function}
     */
    CanvasRenderingContext2D.prototype.rotate = function(angle) {
        if (AntiInvisible.isAbnormalDir(angle) && AntiInvisible.toggler) {
            angle = AntiInvisible.getFixedDir(angle)

            AntiInvisible.setOpacity.call(this, AntiInvisible.opacity)

            return rotate.call(this, angle)
        }

        return rotate.apply(this, arguments)
    }
})()
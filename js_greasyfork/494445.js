// ==UserScript==
// @name         SmashKarts ESP/Charms
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  SmashKarts ESP lets you see players even when they're behind walls or objects. Though, it might not work on every single map. Changes the color of the players.
// @author       DogeSmashMonkey
// @match        *://smashkarts.io/*
// @icon         https://i.makeagif.com/media/7-24-2015/wZmxOM.gif
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494445/SmashKarts%20ESPCharms.user.js
// @updateURL https://update.greasyfork.org/scripts/494445/SmashKarts%20ESPCharms.meta.js
// ==/UserScript==
function showPopup(message) {
    var popupContainer = document.createElement('div')
    popupContainer.style.position = 'fixed'
    popupContainer.style.top = '0'
    popupContainer.style.left = '0'
    popupContainer.style.width = '100%'
    popupContainer.style.backgroundColor = '#333'
    popupContainer.style.color = '#fff'
    popupContainer.style.padding = '10px'
    popupContainer.style.textAlign = 'center'
    popupContainer.style.zIndex = '9999'

    var textElement = document.createElement('div')
    textElement.textContent = message
    textElement.style.fontSize = '18px'
    textElement.style.color = '#fff'
    textElement.style.fontFamily = 'monospace'

    var buttonContainer = document.createElement('div')
    buttonContainer.style.display = 'inline-block'
    buttonContainer.style.marginTop = '10px'

    var closeButton = document.createElement('button')
    closeButton.textContent = 'Close'
    closeButton.style.padding = '5px 10px'
    closeButton.style.backgroundColor = '#ff6600'
    closeButton.style.border = 'none'
    closeButton.style.borderRadius = '5px'
    closeButton.style.color = '#fff'
    closeButton.style.cursor = 'pointer'
    closeButton.style.marginLeft = '10px'
    closeButton.style.fontFamily = 'monospace'

    closeButton.addEventListener('click', function() {
        document.body.removeChild(popupContainer)
    });

    popupContainer.appendChild(textElement)
    popupContainer.appendChild(buttonContainer)
    popupContainer.appendChild(closeButton)

    document.body.appendChild(popupContainer)
}


    showPopup(`🎉Injection Complete! Requires Low-Quality Camera. May Not Work on All Maps.🎉`);
    console.log('Valid Key')

    const originalShader = WebGL2RenderingContext.prototype.shaderSource

    function Shader(OGSHADER){
        WebGL2RenderingContext.prototype.shaderSource = function(shader, src) {
            let Query = src.indexOf("hlslcc_mtx4x4unity_ObjectToWorld[4]") !== -1 &&
                src.indexOf("hlslcc_mtx4x4unity_MatrixVP[4]") !== -1 &&
                src.indexOf("hlslcc_mtx4x4glstate_matrix_projection") === -1 &&
                src.indexOf("unity_FogParams") === -1

            if (Query && src.indexOf("vs_COLOR0") !== -1) {
                src = src.replace(/void\s+main\(\)[\s\S]*?{([\s\S]*?)}/, `void main() {
                gl_Position.z = 0.5;
                vs_TEXCOORD0 = in_TEXCOORD0;
                return;
            }`)

                console.log("Match found:", src, src.length);
            } else if (Query && src.indexOf("vs_COLOR0") === -1) {
                src = src.replace(/return;/, `
                gl_Position.z = 0.5;
                return;
            `)
            }

            return OGSHADER.apply(this, [shader, src])
        }
    }

    const SmashKartsScript = new Shader(originalShader)
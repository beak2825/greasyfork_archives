// ==UserScript==
// @name         BRSociety Custom Message Plugin
// @namespace    https://brsociety.club/
// @version      3.4
// @description  Plugin para enviar mensagens com customização.
// @author       Suero
// @match        https://brsociety.club/
// @icon         https://brsociety.club/img/logo.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466311/BRSociety%20Custom%20Message%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/466311/BRSociety%20Custom%20Message%20Plugin.meta.js
// ==/UserScript==
// Criado por: https://brsociety.club/users/Suero
// Colaboradores: https://brsociety.club/users/anekin
// Aproveite o plugin <3

(function () {
    'use strict'

    // CONFIGURAÇÃO DO PLUGIN

    // ATENÇÃO: O código das cores precisa de aspas e apenas um # no começo, por exemplo: '#ffffff'. Sem as aspas não irá funcionar!
    // ATENÇÃO: Os valores true ou false não precisam de aspas
    // Para pegar o código de uma cor, acesse esse site: https://htmlcolorcodes.com/color-picker/

    const _config = {
        // Cor única
        colorCode: '#FFFFFF', // <- Mude o valor amarelo entre aspas para definir uma cor para o seu texto

        // Arco-íris
        rainbowMode: false, // <- Mude para true para ativar o modo arco-íris.

        // Gradiente
        gradientMode: {
            enabled: true, // <- Mude para true para ativar o gradiente.
            startColor: '#ff40aa', // <- Cor 1 do gradiente.
            endColor: '#5bf0f5' // <- Cor 2 do gradiente.
        },

        // Configurações de estilo
        fontConfig: {
            bold: false, // <- Mude para true para ativar o negrito.
            italic: false, // <- Mude para true para ativar o itálico.
            underlined: false // <- Mude para true para ativar o sublinhado.
        }
    }

    // FIM DA CONFIGURAÇÃO. NÃO ALTERE AS LINHAS ABAIXO, A MENOS QUE SAIBA O QUE ESTÁ FAZENDO!!

    // Function required by rgbToHex
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    // Converts RGB into HEX
    function rgbToHex(colors) {
        return "#" + componentToHex(colors.r) + componentToHex(colors.g) + componentToHex(colors.b);
    }

    // Converts HEX into RGB
    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // Creates LERP fade between two colors.
    function twoColorFade(color1, color2, length) {
        var rIncr = (color2.r - color1.r) / (length - 1),
            gIncr = (color2.g - color1.g) / (length - 1),
            bIncr = (color2.b - color1.b) / (length - 1),
            colors = [],
            r = color1.r,
            g = color1.g,
            b = color1.b,
            ii;

        for (ii = 0; ii < length; ii++) {
            colors.push({ r: Math.floor(r), b: Math.floor(b), g: Math.floor(g) });
            r = r + rIncr;
            g = g + gIncr;
            b = b + bIncr;
        }

        return colors;
    };

    // Creates LERP fade between multiple colors, used to make the rainbow effect.
    var multiColorFade = function (colors, length) {
        var colorIncr = (length - 1) / (colors.length - 1),
            ii,
            len = Math.min(colors.length - 1, length),
            startPos = 0,
            endPos = 1,
            retColors = [],
            tmpColors,
            dist;

        for (ii = 0; ii < len; ii++) {
            endPos = Math.max(startPos + 2, endPos + colorIncr);
            dist = Math.round(endPos) - Math.round(startPos);

            tmpColors = twoColorFade(colors[ii], colors[ii + 1], dist);
            retColors.pop(); // remove last color
            retColors = retColors.concat(tmpColors);

            startPos = Math.round(endPos) - 1;
        }
        return retColors;
    };


    // Format a string to be faded on BBCode formatting.
    function textFader(startColor, endColor, string) {
        return colorText(twoColorFade(hexToRgb(startColor), hexToRgb(endColor), string.length), string)
    }

    // Format a string to be rainbowified on BBCode formatting.
    function rainbowifyText(string) {
        return colorText(multiColorFade([{ 'r': 255, 'g': 0, 'b': 0 }, { 'r': 255, 'g': 127, 'b': 0 }, { 'r': 255, 'g': 255, 'b': 0 }, { 'r': 0, 'g': 255, 'b': 0 }, { 'r': 0, 'g': 255, 'b': 255 }, { 'r': 0, 'g': 0, 'b': 255 }, { 'r': 139, 'g': 0, 'b': 255 }]
                                        , string.length), string)
    }

    function colorText(colorsArray, string) {
        let coloredText = ""

        for (let i = 0; i < string.length; i++) {
            const char = string.charAt(i)

            if (char.match(/\s|\t/) || char.codePointAt(0) >= 5000) {
                coloredText += char
            } else {
                coloredText += `[color=${rgbToHex(colorsArray[i])}]${char}[/color]`
            }
        }

        return coloredText
    }

    axios.interceptors.request.use((config) => {
        /** In dev, intercepts request and logs it into console for dev */
        if (config.url == '/api/chat/messages') {

            let message = config.data.message
            if (!message.match('/msg') && !message.match('/gift')) {
                let newMessage

                const quoteRegex = /\[quote(?:=.+)?\](.*?)\[\/quote\]/
                const quote = message.match(quoteRegex) ? message.match(quoteRegex)[0] : "";
                let messageWithoutCitation = message.replace(quoteRegex, "");

                let specialTags = {
                    imgs: messageWithoutCitation.match(/\[img\]([^\[]+)\[\/img\]/g),
                    urls: messageWithoutCitation.match(/\[url=([^\]]+)\]([^\[]+)\[\/url\]/g),
                }

                // TODO diminuir as linhas de código abaixo, é desnecessário ter 2 fors.
                if (_config.rainbowMode) {
                    for (const [index, value] of Object.entries(specialTags)) {
                        if(!value) continue;
                        for (let detection of value) {
                            messageWithoutCitation = messageWithoutCitation.replace(detection, `{${detection}}`)
                        }
                    }
                    newMessage = `${rainbowifyText(messageWithoutCitation)}`;
                } else if (_config.gradientMode.enabled) {
                    for (const [index, value] of Object.entries(specialTags)) {
                        if(!value) continue;
                        for (let detection of value) {
                            messageWithoutCitation = messageWithoutCitation.replace(detection, `{${detection}}`)
                        }
                    }
                    newMessage = `${textFader(_config.gradientMode.startColor, _config.gradientMode.endColor, messageWithoutCitation)}`;
                } else {
                    newMessage = `[color=${_config.colorCode}]${messageWithoutCitation}[/color]`;
                }

                _config.fontConfig.bold && (newMessage = `[b]${newMessage}[/b]`); _config.fontConfig.italic && (newMessage = `[i]${newMessage}[/i]`); _config.fontConfig.underlined && (newMessage = `[u]${newMessage}[/u]`)
                newMessage = `${quote} ${newMessage}`
                config.data.message = newMessage
                return config;

            }

        }
        return config
    }, (error) => {
        return Promise.reject(error);
    });

})();
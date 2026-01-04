// ==UserScript==
// @name         Gitlab 2FA Token Auto Fill 
// @namespace    https://github.com/JZ6/20220202
// @version      1.0
// @description  Bros
// @author       JZ6
// @match        *://gitlab.com/*
// @include      *://git.*.com/*
// @icon         https://www.google.com/s2/favicons?domain=gitlab.com
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jsSHA/3.2.0/sha1.min.js
// @downloadURL https://update.greasyfork.org/scripts/440263/Gitlab%202FA%20Token%20Auto%20Fill.user.js
// @updateURL https://update.greasyfork.org/scripts/440263/Gitlab%202FA%20Token%20Auto%20Fill.meta.js
// ==/UserScript==

const config = {
    entry: init,
    TOTPKey: '',
    autoSubmit: false,
    tokenRefreshPeriod: 30,
    localStorageKey: 'bros',
    defaultInput: 'Get the key from your profile/account page!',
}

config.entry()

function init() {

    const TOTPInput = document.getElementById('user_otp_attempt')
    if (!TOTPInput) return

    loadTOTPKey()

    const TOTPToken = get2FAToken(config.TOTPKey)
    console.log(TOTPToken)
    TOTPInput.value = TOTPToken

    if (config.autoSubmit) {
        const submitButton = document.querySelector("div.prepend-top-20 input[name='commit']")
        submitButton.click()
    }

    // data-qa-selector="otp_secret_content"

}

function loadTOTPKey() {
    config.TOTPKey = localStorage.getItem(config.localStorageKey) || ''
    if (!config.TOTPKey || config.TOTPKey == 'null') {
        promptKeyInput()
        loadTOTPKey()
        return
    }

    if (config.TOTPKey == config.defaultInput) {
        alert('Please enter your 2FA Key from from your profile/account page!')
        promptKeyInput()
        loadTOTPKey()
    }
}

function saveTOTPKey() {
    localStorage.setItem(config.localStorageKey, config.TOTPKey)
}

function promptKeyInput() {
    let key = prompt('Enter your Gitlab Two Factor Key', config.defaultInput)
    config.TOTPKey = key
    saveTOTPKey()
}

function get2FAToken(TOTPKey) {

    const HEX = 'HEX'
    const hexSHA = new jsSHA('SHA-1', HEX)

    const hexadecimalKey = getHexadecimalKey(TOTPKey)
    hexSHA.setHMACKey(hexadecimalKey, HEX)

    const hexTime = getHexTime()
    hexSHA.update(hexTime)


    const HMACKey = hexSHA.getHMAC(HEX)
    return getTOTPToken(HMACKey)
}

function getHexadecimalKey(TOTPKey) {

    const base32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
    cleanKey = TOTPKey.replace(/\s+/g, '').replace(/=+$/, '')

    let binary = ''
    for (const c of cleanKey) {
        let val = base32chars.indexOf(c.toUpperCase())
        binary += paddingFill(val.toString(2), 5)
    }

    let hexadecimalKey = ''
    for (let i = 0; i + 8 <= binary.length; i += 8) {
        const byte = binary.slice(i, i + 8)
        const hexByte = parseInt(byte, 2).toString(16)
        hexadecimalKey += paddingFill(hexByte, 2)
    }

    return hexadecimalKey
}

function getHexTime() {
    const currentSecond = Math.round(Date.now() / 1000.0)
    const tokenRefreshTime = Math.floor(currentSecond / config.tokenRefreshPeriod)


    let hexTime = Math.round(tokenRefreshTime).toString(16)

    if (tokenRefreshTime < 15.5) {
        hexTime = `0${hexTime}`
    }

    return paddingFill(hexTime, 16)
}

function getTOTPToken(HMACKey) {
    const offset = parseInt(HMACKey.slice(-1), 16)
    const hexOffset = parseInt(HMACKey.substr(offset * 2, 8), 16)

    const mask = parseInt('7fffffff', 16)

    const TOTPToken = String(hexOffset & mask)

    return TOTPToken.slice(TOTPToken.length - 6)
}

function paddingFill(str, len) {
    if (len < str.length - 1) {
        return str
    }
    return Array(len - str.length + 1).join('0') + str
}
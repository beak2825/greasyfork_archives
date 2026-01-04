// ==UserScript==
// @name        Roaming Authenticator Everywhere
// @namespace   https://rokoucha.net
// @version     0.0.3
// @author      Rokoucha
// @description 嘘のPasskey対応を真のPasskey対応にします
// @license     MIT
// @match       https://account.edit.yahoo.co.jp/authdevice*
// @match       https://accounts.nintendo.com/passkey/register
// @match       https://accounts.pixiv.net/passkeys/*
// @match       https://id.moneyforward.com/*
// @match       https://my.konami.net/*/security/passkey/registration/*
// @match       https://my.konami.net/*/signin
// @match       https://jp.mercari.com/mypage/personal_info/passkeys
// @match       https://x.com/*
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/545894/Roaming%20Authenticator%20Everywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/545894/Roaming%20Authenticator%20Everywhere.meta.js
// ==/UserScript==

function hook() {
    const origCreate = navigator.credentials.create
    navigator.credentials.create = function (options) {
        console.log('create hooked')
        if (options) {
            delete options.publicKey.authenticatorSelection.authenticatorAttachment
        }
        return origCreate.apply(this, [options])
    }

    const origGet = navigator.credentials.get
    navigator.credentials.get = function (options) {
        console.log('get hooked')
        if (options && options.publicKey && options.publicKey.allowCredentials) {
            options.publicKey.allowCredentials = options.publicKey.allowCredentials.map((c) => {
                c.transports = ['ble', 'hybrid', 'internal', 'nfc', 'usb']
                return c
            })
        }
        return origGet.apply(this, [options])
    }
}

console.info("place a hook")
hook()

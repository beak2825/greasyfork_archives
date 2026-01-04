// ==UserScript==
// @name         checkVersion
// @description  Greasyfork Check Version Source Code
// @version      1.0.1
// @author       kiccer<1072907338@qq.com>
// @license      MIT
// @match        https://greasyfork.org/*
// @grant        none
// ==/UserScript==

(() => {
    function getTampermonkey () {
        return window.external?.Tampermonkey
    }

    function getViolentmonkey () {
        return window.external?.Violentmonkey
    }

    function getInstalledVersion (name, namespace) {
        return new Promise(function (resolve, reject) {
            const tm = getTampermonkey()
            if (tm) {
                tm.isInstalled(name, namespace, function (i) {
                    if (i.installed) {
                        resolve(i.version)
                    } else {
                        resolve(null)
                    }
                })
                return
            }

            const vm = getViolentmonkey()
            if (vm) {
                vm.isInstalled(name, namespace).then(resolve)
                return
            };

            reject(Error)
        })
    }

    // https://developer.mozilla.org/en/docs/Toolkit_version_format
    function compareVersions (a, b) {
        if (a === b) {
            return 0
        }
        const aParts = a.split('.')
        const bParts = b.split('.')
        for (let i = 0; i < aParts.length; i++) {
            const result = compareVersionPart(aParts[i], bParts[i])
            if (result !== 0) {
                return result
            }
        }
        return 0
    }

    function compareVersionPart (partA, partB) {
        const partAParts = parseVersionPart(partA)
        const partBParts = parseVersionPart(partB)
        for (let i = 0; i < partAParts.length; i++) {
            // "A string-part that exists is always less than a string-part that doesn't exist"
            if (partAParts[i].length > 0 && partBParts[i].length === 0) {
                return -1
            }
            if (partAParts[i].length === 0 && partBParts[i].length > 0) {
                return 1
            }
            if (partAParts[i] > partBParts[i]) {
                return 1
            }
            if (partAParts[i] < partBParts[i]) {
                return -1
            }
        }
        return 0
    }

    // It goes number, string, number, string. If it doesn't exist, then
    // 0 for numbers, empty string for strings.
    function parseVersionPart (part) {
        if (!part) {
            return [0, '', 0, '']
        }
        const partParts = /([0-9]*)([^0-9]*)([0-9]*)([^0-9]*)/.exec(part)
        return [
            partParts[1] ? parseInt(partParts[1]) : 0,
            partParts[2],
            partParts[3] ? parseInt(partParts[3]) : 0,
            partParts[4]
        ]
    }

    function handleInstallResult (installButton, installedVersion, version) {
        if (installedVersion == null) {
            // Not installed, do nothing
            return
        }

        installButton.removeAttribute('data-ping-url')

        switch (compareVersions(installedVersion, version)) {
        // Upgrade
        case -1:
            installButton.textContent = installButton.getAttribute('data-update-label')
            break
            // Downgrade
        case 1:
            installButton.textContent = installButton.getAttribute('data-downgrade-label')
            break
            // Equal
        case 0:
            installButton.textContent = installButton.getAttribute('data-reinstall-label')
            break
        }
    }

    function checkForUpdatesJS (installButton, retry) {
        const name = installButton.getAttribute('data-script-name')
        const namespace = installButton.getAttribute('data-script-namespace')
        const version = installButton.getAttribute('data-script-version')

        getInstalledVersion(name, namespace).then(function (installedVersion) {
            handleInstallResult(installButton, installedVersion, version)
        }, function () {
            if (retry) {
                setTimeout(function () { checkForUpdatesJS(installButton, false) }, 1000)
            }
        })
    }

    function checkForUpdatesCSS (installButton) {
        const name = installButton.getAttribute('data-script-name')
        const namespace = installButton.getAttribute('data-script-namespace')
        postMessage({ type: 'style-version-query', name, namespace, url: location.href }, location.origin)
    }

    // Response from Stylus
    // window.addEventListener('message', function (event) {
    //     if (event.origin !== 'https://greasyfork.org' && event.origin !== 'https://sleazyfork.org') { return }

    //     if (event.data.type !== 'style-version') { return }

    //     const installButton = document.querySelector('.install-link[data-install-format=css]')
    //     if (installButton == null) { return }

    //     const version = installButton.getAttribute('data-script-version')

    //     const installedVersion = event.data.version

    //     handleInstallResult(installButton, installedVersion, version)
    // }, false)

    // document.addEventListener('DOMContentLoaded', function () {
    //     const installButtonJS = document.querySelector('.install-link[data-install-format=js]')
    //     if (installButtonJS) {
    //         checkForUpdatesJS(installButtonJS, true)
    //     }
    //     const installButtonCSS = document.querySelector('.install-link[data-install-format=css]')
    //     if (installButtonCSS) {
    //         checkForUpdatesCSS(installButtonCSS)
    //     }
    // })

    if (!window.checkVersion) {
        window.checkVersion = {
            getTampermonkey,
            getViolentmonkey,
            getInstalledVersion,
            compareVersions,
            compareVersionPart,
            parseVersionPart,
            handleInstallResult,
            checkForUpdatesJS,
            checkForUpdatesCSS
        }
    }
})()

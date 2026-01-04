/* global cozy */

// ==UserScript==
// @name         Demo Isabelle Durand
// @namespace    http://cozy.io
// @version      0.8
// @description  Re-orders apps, merge MAIF and EDF app and konnectors, put a background
// @author       Cozy Cloud
// @match        https://isabelledurand-home.mycozy.cloud/
// @grant        none
// @url          https://greasyfork.org/en/scripts/390562-demo-isabelle-durand
// @downloadURL https://update.greasyfork.org/scripts/390562/Demo%20Isabelle%20Durand.user.js
// @updateURL https://update.greasyfork.org/scripts/390562/Demo%20Isabelle%20Durand.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const identityIconBase64 = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PGcgZmlsbD0iIzg1NUNFQSIgZmlsbC1ydWxlPSJldmVub2RkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDQpIj48cGF0aCBmaWxsLW9wYWNpdHk9Ii41IiBkPSJNMjggMTRjMiAwIDQgMyA0IDR2LjI3YzAgLjktLjEgMS43My0xIDEuNzNIMTdjLTEgMC0xLTEtMS0yczItNCA0LTQgMSAxIDQgMSAyLTEgNC0xek0yNCA0YzIuMiAwIDQgMi4wMSA0IDQuNVMyNi4yIDEzIDI0IDEzcy00LTIuMDEtNC00LjVTMjEuOCA0IDI0IDR6Ii8+PHBhdGggZD0iTTE4IDE1YzMgMCA2IDQuNSA2IDZzMCAzLTEuNSAzaC0yMUMwIDI0IDAgMjIuNSAwIDIxczMtNiA2LTYgMS41IDEuNSA2IDEuNSAzLTEuNSA2LTEuNXpNMTIgMGMzLjMxIDAgNiAzLjEzIDYgN3MtMi42OSA3LTYgNy02LTMuMTMtNi03IDIuNjktNyA2LTd6Ii8+PHBhdGggZD0iTTE4IDE1YzMgMCA2IDQuNSA2IDZzMCAzLTEuNSAzaC0yMUMwIDI0IDAgMjIuNSAwIDIxczMtNiA2LTYgMS41IDEuNSA2IDEuNSAzLTEuNSA2LTEuNXpNMTIgMGMzLjMxIDAgNiAzLjEzIDYgN3MtMi42OSA3LTYgNy02LTMuMTMtNi03IDIuNjktNyA2LTd6Ii8+PC9nPjwvc3ZnPg=='

    const waitForSelector = (selector, delay) => new Promise((resolve, reject) => {
      const now = new Date()
      const run = () => {
        const found = document.querySelector(selector)
        if (found) {
            console.log('Found', selector)
            return resolve(found)
        }
        else {
            console.log('Not found', selector)
            const now2 = new Date()
            if (now2 - now > 10000) {
              return reject('Timeout for waitFor, selector is ' + selector)
            } else {
              setTimeout(run, delay || 100)
            }
        }
      }
      run()
    })

    const insertStylesheet = cssString => {
        const stylesheet = document.createElement('style')
        document.body.appendChild(stylesheet)
        stylesheet.innerHTML = cssString
    }

    // Put a Drive file in background
    const changeBackgroundImage = async () => {
        console.log('Change background image')
        const filepath = '/Photos/Settings/Wallpaper.jpg'
        cozy.client.files.getDownloadLink(filepath).then(downloadPath => {
            const { host, protocol } = document.location
            const domain = host.replace(/-[a-z]*/, '')
            const fileURL = `${protocol}//${domain}${downloadPath}`
            const style = `
.ho-background {
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url("${fileURL}");
}
`
            insertStylesheet(style)
        }).catch(e => {
            console.error(e)
        })
    }

    const changeAppOrder = async () => {
        console.log('Change app orders')
        const order = 'drive photos notes contacts calendar todo banks health store'

        // Sort app nodes
        const styles = `${
order.split(' ').map((name, i) => `
.app-list-wrapper .item-wrapper[href*=${name}] {
    order: ${i};
}`).join('\n')}

${['maif', 'edf'].map(slug => `.app-list-wrapper .item-wrapper[href*=${slug}] {
    display: none;
}`).join('\n')}

[data-tutorial=home-apps], [data-tutorial=home-services] { justify-content: start }
.item-wrapper--ghost { display: none }
.app-list-wrapper {
    background-color: white;
}

.connector-list .item-title {
    color: white;
    text-shadow: 0px 0px 4px rgba(50,54,63, 0.64), 0px 2px 4px rgba(50,54,63, 0.64);
}

.styles__icon___23x3R {
    color:white;
}

@media screen and (max-width: 960px) {
    .ho-background
    {
        background-position: right;
        background-position: 88%;
    }
}
`
        insertStylesheet(styles)
    }

    const mergeAppAndKonnectors = async () => {
        await waitForSelector('.item-wrapper[href*=banks]')

        // Hide MAIF and EDF apps and put their href onto their konnectors
        const konnectorApps = [
            'maif',
            'edf'
        ]

        const getAppHREF = slug => document.querySelector(`.item-wrapper[href*=${slug}]`).getAttribute('href')

        const appHREFs = {
          maif: getAppHREF('maif'),
          edf: getAppHREF('edf')
        }
        const servicesNode = document.querySelector('.services-list-wrapper')
        const serviceNodes = Array.from(servicesNode.querySelectorAll('.item-wrapper'))
        serviceNodes.forEach(node => {
            const href = node.getAttribute('href')
            if (!href) { return }
            const konnector = href.split('/').slice(-1)[0]
            node.addEventListener('click', ev => {
              ev.stopPropagation()
            })
            if (konnectorApps.includes(konnector)) {
                node.setAttribute('href', appHREFs[konnector])
            }
        })
    }

    const addIdentityApp = async () => {
        await waitForSelector('.app-list-wrapper .item-wrapper[href*=banks] img')
        const bankApp = await waitForSelector('.app-list-wrapper .item-wrapper[href*=banks]')
        const appList = document.querySelector('.app-list-wrapper .app-list')
        const extraNode = bankApp.cloneNode(true)
        appList.appendChild(extraNode)
        extraNode.querySelector('h3').innerText = 'Identités'
        extraNode.querySelector('img').setAttribute('src', 'data:image/svg+xml;base64,' + identityIconBase64)
    }

    var run = () => {
        const changes = [
          changeBackgroundImage,
          changeAppOrder,
          mergeAppAndKonnectors,
          addIdentityApp
        ]
        changes.forEach(change => {
          change().then(() => {
            console.log(`Applied change ${change.name} !`)
          })
        })
    }

    window.runDemoScript = run
    run()

})();
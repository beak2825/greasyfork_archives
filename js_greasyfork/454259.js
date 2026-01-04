// ==UserScript==
// @name         Fragrantica Perfumehub Plugin
// @version      0.2
// @description  Fragrantica Perfumehub Plugin Description
// @match        https://www.fragrantica.com/perfume/*
// @match        https://www.fragrantica.pl/perfumy/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @namespace    https://greasyfork.org/users/979259
// @downloadURL https://update.greasyfork.org/scripts/454259/Fragrantica%20Perfumehub%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/454259/Fragrantica%20Perfumehub%20Plugin.meta.js
// ==/UserScript==

;(function () {
  const spinnerSvg = `
    <div style=" display: flex; justify-content: center; align-items: center; height: 100%; flex: 1;">
      <svg width="60" height="15" viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg" fill="#008b92">
        <circle cx="15" cy="15" r="15">
          <animate attributeName="r" from="15" to="15"
                  begin="0s" dur="0.8s"
                  values="15;9;15" calcMode="linear"
                  repeatCount="indefinite" />
          <animate attributeName="fill-opacity" from="1" to="1"
                  begin="0s" dur="0.8s"
                  values="1;.5;1" calcMode="linear"
                  repeatCount="indefinite" />
        </circle>
        <circle cx="60" cy="15" r="9" fill-opacity="0.3">
            <animate attributeName="r" from="9" to="9"
                    begin="0s" dur="0.8s"
                    values="9;15;9" calcMode="linear"
                    repeatCount="indefinite" />
            <animate attributeName="fill-opacity" from="0.5" to="0.5"
                    begin="0s" dur="0.8s"
                    values=".5;1;.5" calcMode="linear"
                    repeatCount="indefinite" />
        </circle>
        <circle cx="105" cy="15" r="15">
          <animate attributeName="r" from="15" to="15"
                  begin="0s" dur="0.8s"
                  values="15;9;15" calcMode="linear"
                  repeatCount="indefinite" />
          <animate attributeName="fill-opacity" from="1" to="1"
                  begin="0s" dur="0.8s"
                  values="1;.5;1" calcMode="linear"
                  repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  `

  const types = {
    ap: 'Woda po goleniu',
    ep: 'Ekstrakt perfum',
  }

  const searchProducts = (query, onSuccess) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: `https://www.perfumehub.pl/typeahead?q=${query}&t=${Math.floor(Date.now() / 1000)}`,
      onload: (response) => onSuccess(JSON.parse(response.responseText)),
    })
  }

  const searchPrices = (path, onSuccess) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: `https://www.perfumehub.pl${path}`,
      headers: {
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest',
      },
      onload: (response) => onSuccess(JSON.parse(response.responseText)),
    })
  }

  const handleSearchSuccess = (products) => {
    if (!products?.length) {
      const refreshButton = document.createElement('a')

      popup.innerHTML = '<div style="text-align: center;">Nic nie znaleziono.</div>'

      refreshButton.innerHTML = 'Odśwież'
      refreshButton.setAttribute(
        'style',
        `
            margin-top: auto;
            text-align: center;
          `,
      )
      refreshButton.onclick = () => {
        showSpinner()
        init()
      }
      popup.appendChild(refreshButton)

      return
    }

    popup.innerHTML = ''

    products.forEach((product) => {
      const element = document.createElement('a')

      element.setAttribute(
        'style',
        `
            display: block;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          `,
      )

      element.innerHTML = `&#x2022; ${_.startCase(product.brand)} - ${_.startCase(product.line)}`

      element.onclick = () => {
        showSpinner()
        searchPrices(product.productLink, handleSearchPricesSuccess)
      }

      popup.appendChild(element)
    })
  }

  const handleSearchPricesSuccess = (products) => {
    popup.innerHTML = ''

    popup.innerHTML = `<div style="font-weight: bold; margin-bottom: 8px;">${_.startCase(
      products.products[0].brand,
    )} ${_.startCase(products.products[0].line)} ${_.upperCase(
      types[products.products[0].type] || products.products[0].type,
    )}</div>`

    const sortedProducts = _.sortBy(products.products, ['tester', 'size'])

    sortedProducts.forEach((product) => {
      if (product.size) {
        const productLinkElement = document.createElement('a')

        productLinkElement.setAttribute(
          'style',
          `
            display: grid;
            grid-auto-flow: column;
            grid-template-columns: repeat(3, 1fr);
          `,
        )
        productLinkElement.setAttribute('target', '_blank')
        productLinkElement.setAttribute('href', `https://www.perfumehub.pl${product.productLink}`)

        productLinkElement.innerHTML = `
          <div style="font-weight: bold;">${product.size} ml</div>
          <div>${product.tester ? 'TESTER' : product.isSet ? 'ZESTAW' : '-'}</div>
          <div>od ${product.price} zł</div>
        `

        popup.appendChild(productLinkElement)
      }
    })

    if (products.typeLinks.length) {
      const element = document.createElement('div')

      element.setAttribute(
        'style',
        `
          margin: 8px 0px;
          font-weight: bold;
        `,
      )
      element.innerHTML = 'Warianty:'

      popup.appendChild(element)

      products.typeLinks.forEach((type) => {
        const element = document.createElement('a')

        element.innerHTML = `&#x2022; ${_.upperCase(types[type.type] || type.type)}`

        element.onclick = () => {
          showSpinner()
          searchPrices(type.url, handleSearchPricesSuccess)
        }

        popup.appendChild(element)
      })
    }

    const backButtonElement = document.createElement('a')

    backButtonElement.innerHTML = '&#8592; Cofnij'
    backButtonElement.setAttribute(
      'style',
      `
        display: block;
        margin-top: auto;
        padding-top: 12px;
      `,
    )
    backButtonElement.onclick = () => {
      showSpinner()
      init()
    }
    popup.appendChild(backButtonElement)
  }

  const createPopup = () => {
    const popupElement = document.createElement('div')

    popupElement.setAttribute(
      'style',
      `
        position: fixed;
        display: flex;
        flex-direction: column;
        z-index: 999;
        top: 8px;
        right: 8px;
        border: 1px solid #008b92;
        border-radius: 8px;
        padding: 8px;
        width: 350px;
        min-height: 100px;
        overflow: scroll;
        background: rgba(255, 255, 255, 0.9);
      `,
    )

    popupElement.innerHTML = spinnerSvg

    document.body.appendChild(popupElement)

    return popupElement
  }

  const popup = createPopup()

  const showSpinner = () => {
    popup.innerHTML = spinnerSvg
  }

  const init = () => {
    const perfumeName = document
      .querySelector('[itemprop=description]')
      .querySelector('p')
      .querySelectorAll('b')[0]
      .textContent.trim()
      .replace(/eau de parfum/gi, '')

    const perfumeManufacturer = document
      .querySelector('[itemprop=description]')
      .querySelector('p')
      .querySelectorAll('b')[1]
      .textContent.trim()
      .replace(/\&/gi, ' ')

    console.log(encodeURIComponent(`${perfumeManufacturer} ${perfumeName}`))
    searchProducts(encodeURIComponent(`${perfumeManufacturer} ${perfumeName}`), handleSearchSuccess)
  }

  init()
})()

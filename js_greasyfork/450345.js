// ==UserScript==
// @name     custom DLSite Helper Arca Edition
// @version  1.0.3
// @description  DLSite의 정보를 클립보드에 복사하거나 타사이트 검색에 사용합니다.
// @include  https://www.dlsite.com/*
// @author   ggee
// @grant    none
// @namespace https://greasyfork.org/users/951805
// @downloadURL https://update.greasyfork.org/scripts/450345/custom%20DLSite%20Helper%20Arca%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/450345/custom%20DLSite%20Helper%20Arca%20Edition.meta.js
// ==/UserScript==

;(function() {

  const HVDB_BASE_URL = 'https://hvdb.me/Dashboard/WorkDetails'
  const japaneseasmr_URL = 'https://japaneseasmr.com/?s='
  const erovoice_URL = 'https://dl.erovoice.us/search/?q='
  const nyaa_URL = 'https://sukebei.nyaa.si/?f=0&c=1_0&q='
  const google_URL = 'https://www.google.com/search?q='

  const title = document.getElementById('work_name')
  const circ = document.getElementById('work_maker')
  const circLink = circ.querySelector('tbody>tr>td>span>a')
  const linkButtons = document.querySelector('.icon_wrap')
  const rjCode = document.querySelector('[data-product-id]').getAttribute('data-product-id')
  const type = getTitleByFirstCategory()

  if (type !== 'ボイス・ASMR') {
      linkButtons.insertBefore(
          createAnchor(
              { href: `${google_URL}${title.textContent}` },
              'Google'
          ),
          linkButtons.firstChild
      )
  }
  linkButtons.insertBefore(
    createAnchor(
    	{ href: '#arca' },
      'Arca'
    ),
    linkButtons.firstChild
  )
/*
  if (type === 'ボイス・ASMR') {
      linkButtons.insertBefore(
          createAnchor(
              { href: `${HVDB_BASE_URL}/${rjCode}` },
              'HVDB'
          ),
          linkButtons.firstChild
      )
  }
*/
  if (type !== 'ボイス・ASMR') {
      linkButtons.insertBefore(
          createAnchor(
              { href: `${nyaa_URL}${title.textContent}` },
              'Nyaa'
          ),
          linkButtons.firstChild
      )
  }
  if (type === 'ボイス・ASMR') {
      linkButtons.insertBefore(
          createAnchor(
              { href: `${erovoice_URL}${rjCode}` },
              'EroVoice'
          ),
          linkButtons.firstChild
      )
  }
  if (type === 'ボイス・ASMR') {
      linkButtons.insertBefore(
          createAnchor(
              { href: `${japaneseasmr_URL}${rjCode}` },
              'JPasmr'
          ),
          linkButtons.firstChild
      )
  }
  linkButtons.insertBefore(
    createAnchor(
    	{ href: '#rjcode' },
      'RJcode'
    ),
    linkButtons.firstChild
  )
  linkButtons.insertBefore(
    createAnchor(
    	{ href: '#Sales_Date' },
      'Date'
    ),
    linkButtons.firstChild
  )
  if (isRowExists('シリーズ名')) {
      linkButtons.insertBefore(
          createAnchor(
              { href: '#series' },
              'Series'
          ),
          linkButtons.firstChild
      )
  }
  if (isRowExists('声優')) {
      linkButtons.insertBefore(
          createAnchor(
              { href: '#seiyuu' },
              'CV'
          ),
          linkButtons.firstChild
      )
  }
  linkButtons.insertBefore(
    createAnchor(
    	{ href: '#circle' },
      'Circle'
    ),
    linkButtons.firstChild
  )
  linkButtons.insertBefore(
    createAnchor(
    	{ href: '#copy' },
      'Title'
    ),
    linkButtons.firstChild
  )
  linkButtons.insertBefore(
    createAnchor(
    	{ href: '#folder' },
      'Folder'
    ),
    linkButtons.firstChild
  )


  function getTitleByFirstCategory() {
      const table = document.getElementById('work_outline')
      const maxIndex = table.rows.length
      let isGet = false;
      let result = "";

      for (let i = 1; i <= maxIndex; i++) {
          const th = table.querySelector(`tbody>tr:nth-child(${i})>th`)

          if (th.textContent === "作品形式") {
              result = table.querySelector(`tbody>tr:nth-child(${i})>td>div>a:nth-child(1)>span`).textContent
              break
          }
      }

      console.log(`result: ${result}`)
      return result
  }

  function isRowExists(rowName) {
      const table = document.getElementById('work_outline')
      const maxIndex = table.rows.length
      let result = "";

      for (let i = 1; i <= maxIndex; i++) {
          const th = table.querySelector(`tbody>tr:nth-child(${i})>th`)

          if (th.textContent === rowName) {
              return true
          }
      }

      return false
  }

  function getRowText(rowName) {
      const table = document.getElementById('work_outline')
      const maxIndex = table.rows.length
      let isGet = false;
      let result = "";

      for (let i = 1; i <= maxIndex; i++) {
          const th = table.querySelector(`tbody>tr:nth-child(${i})>th`)

          if (th.textContent === rowName) {
              const count = table.querySelector(`tbody>tr:nth-child(${i})>td`).childElementCount

              for (let j = 1; j <= count; j++) {
                  result += table.querySelector(`tbody>tr:nth-child(${i})>td>a:nth-child(${j})`).textContent
                  if (j < count) {
                      result += ' / '
                  }
              }

              break
          }
      }

      console.log(`result: ${result}`)
      return result
  }

  function createAnchor(attrs, child) {
    const el = document.createElement('a')
    for (let attr in attrs) {
      el.setAttribute(attr, attrs[attr])
    }
    el.className = 'icon_lead_01 type_exclusive'
    el.target = '_blank'
    el.rel = 'nofollow'

    const span = document.createElement('span')
    span.className = 'button_label'
    span.textContent = child

    switch (attrs.href) {
        case '#copy':
            el.addEventListener('click', event => {
                event.preventDefault()
                navigator.clipboard.writeText(title.textContent)
            })
            break
        case '#circle':
            el.addEventListener('click', event => {
                event.preventDefault()
                navigator.clipboard.writeText(circLink.textContent)
            })
            break
        case '#Sales_Date':
            el.addEventListener('click', event => {
                event.preventDefault()
                if (type === 'ボイス・ASMR') {
                  navigator.clipboard.writeText(getRowText('販売日').replace(/[^0-9]/g,'').substr('0', '4'))
                }else{
                  navigator.clipboard.writeText('[' + getRowText('販売日').replace(/[^0-9]/g,'').substr(2) + ']')
                }
            })
            break
        case '#series':
            el.addEventListener('click', event => {
                event.preventDefault()
                navigator.clipboard.writeText('[' + getRowText('シリーズ名') + '] ')
            })
            break
        case '#seiyuu':
            el.addEventListener('click', event => {
                event.preventDefault()
                navigator.clipboard.writeText(getRowText('声優'))
            })
            break
        case '#folder':
            el.addEventListener('click', event => {
                event.preventDefault()
                if (type === 'ボイス・ASMR') {
                  navigator.clipboard.writeText('[' + circLink.textContent.replaceAll(" / ","／").replaceAll("/","／") + '] ' + rjCode + ' ' + title.textContent.replaceAll(" / ","／").replaceAll("/","／").replaceAll(/ : |:/g,"：") + ' [CV：' + getRowText('声優').replaceAll(" / ","／").replaceAll("/","／") + ']')
                }else{
                  navigator.clipboard.writeText('[' + circLink.textContent.replaceAll(" / ","／").replaceAll("/","／") + '] ' + rjCode + ' ' + title.textContent.replaceAll(" / ","／").replaceAll("/","／").replaceAll(/ : |:/g,"：") + ' [한글]')
                }
            })
            break
        case '#rjcode':
            el.addEventListener('click', event => {
                event.preventDefault()
                navigator.clipboard.writeText(rjCode)
            })
            break
        case '#arca':
            el.addEventListener('click', event => {
                event.preventDefault()

                if (type === 'ボイス・ASMR') {
                    window.open(`https://arca.live/b/my?target=all&keyword=${rjCode.replace("RJ","")}`)
                } else {
                    window.open(`https://arca.live/b/simya?target=all&keyword=${rjCode.replace(/RJ|VJ/g,"")}`)
                }
            })
    }

    el.appendChild(span)
    return el
  }

})();
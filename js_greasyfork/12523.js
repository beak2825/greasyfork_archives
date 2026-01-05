// ==UserScript==
// @name        Mint.com tags display
// @match       https://mint.intuit.com/transactions
// @connect     mint.intuit.com
// @description Show tags in the transactions listing on Mint.com.
// @namespace   com.warkmilson.mint.js
// @author      Mark Wilson (update by Shaun Williams)
// @version     2.0.1
// @homepage    https://github.com/mddub/mint-tags-display
// @grant       none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/12523/Mintcom%20tags%20display.user.js
// @updateURL https://update.greasyfork.org/scripts/12523/Mintcom%20tags%20display.meta.js
// ==/UserScript==
//

(function() {

  //------------------------------------------------------------------------------
  // Logging
  //------------------------------------------------------------------------------

  const logging = false
  function log(...args) {
    if (logging) console.info('MINT_TAGS', ...args)
  }

  //------------------------------------------------------------------------------
  // Track state by watching XHR
  //------------------------------------------------------------------------------

  // State

  const state = {
    txnTags: {}, // txn id -> [tag name]
    tagOrder: [], // [tag name]
    tagName: {}, // tag id -> tag name
  }
  window._MINT_TAGS = state

  // Update state

  const apiUrl = path => `https://mint.intuit.com/pfm/v1${path}`

  const apiHooks = {
    // when transactions are fetched, save tags belonging to each transaction
    [apiUrl('/transactions/search')]: data => {
      for (const {id,tagData} of data.Transaction) {
        state.txnTags[id] = tagData?.tags.map(tag => tag.name)
      }
    },
    // when the master tag list is fetched, save it
    [apiUrl('/tags')]: data => {
      state.tagOrder = data.Tag.map(tag => tag.name)
      state.tagName = Object.fromEntries(data.Tag.map(tag => [tag.id, tag.name]))
    },
  }

  // when transactions are edited, update our tag records
  function handleTxnEdits(edits) {
    const idsToUpdate = []
    for (const {id,tagData} of edits) {
      if (tagData) {
        state.txnTags[id] = tagData.tags.map(tag => state.tagName[tag.id])
        idsToUpdate.push(id)
      }
    }
    setTimeout(() => idsToUpdate.forEach(updateRowTags), 500)
  }

  // hook XHR to intercept api calls
  function watchXHR() {
    const origOpen = XMLHttpRequest.prototype.open

    XMLHttpRequest.prototype.open = function(method, url) {
      const self = this

      // save XHR responses when needed
      self.addEventListener("readystatechange", function() {
        const hook = apiHooks[url]
        if (self.readyState === 4 && hook) {
          const data = JSON.parse(self.responseText)
          log('HOOKING', url, data)
          hook(data)
        }
      }, false)

      // intercept edits to transactions
      const txnsUrl = apiUrl('/transactions')
      if (method == 'PUT' && url.startsWith(txnsUrl)) {
        const origSend = self.send
        self.send = function(body) {
          const data = JSON.parse(body)
          const edits = url==txnsUrl ? data.Transaction : [{...data, id:url.slice(txnsUrl.length+1)}]
          log('HOOKING EDITS', edits)
          handleTxnEdits(edits)
          origSend.apply(self, arguments)
        }
      }

      origOpen.apply(self, arguments)
    }
  }

  //------------------------------------------------------------------------------
  // Render DOM
  //------------------------------------------------------------------------------

  var TAG_COLORS = [
    // source: http://colorbrewer2.org/#type=qualitative&scheme=Paired&n=12
    // background, foreground
    ['#a6cee3', '#000'],
    ['#b2df8a', '#000'],
    ['#fb9a99', '#000'],
    ['#fdbf6f', '#000'],
    ['#cab2d6', '#000'],
    ['#ffff99', '#000'],
    ['#1f78b4', '#fff'],
    ['#33a02c', '#fff'],
    ['#e31a1c', '#fff'],
    ['#ff7f00', '#fff'],
    ['#6a3d9a', '#fff'],
    ['#b15928', '#fff']
  ];

  function getTagStyle(tag) {
    const i = state.tagOrder.indexOf(tag)
    const [bg,fg] = TAG_COLORS[i]
    return `background:${bg}; color:${fg}`
  }

  // re-render our custom tag annotations in this row
  function updateRowTags(id) {
    log('UPDATING ROW', id)
    const td = document.querySelector(`tr[data-automation-id$=_${id}] td:nth-child(4)`)
    if (!td) return

    const tags = state.txnTags[id]
    const tagsDiv = () => td.querySelector('.gm-tags')
    if (tags?.length) {
      if (!tagsDiv()) td.innerHTML += '<div class="gm-tags" style="font-size:10px; display:inline-block"></div>'
      tagsDiv().innerHTML = tags.map(tag => `<span class="gm-tag" style="${getTagStyle(tag)}; margin-left:4px; padding:0 2px">${tag}</span>`).join('')
    } else {
      tagsDiv()?.remove()
    }
  }

  const rowId = row => row?.dataset?.automationId?.match(/TRANSACTION_TABLE_ROW_(READ|EDIT)_(.*)/)?.[2]

  function initRender() {
    if (!document.querySelector('tr[data-automation-id]')) {
      return setTimeout(initRender, 500)
    }
    log('FOUND TABLE')
    for (const row of document.querySelectorAll('tr[data-automation-id]')) {
      updateRowTags(rowId(row))
    }
    renderWhenDomChanges()
  }

  function renderWhenDomChanges() {
    log('WATCHING FOR CHANGES')
    const observer = new MutationObserver(() => {
      observer.disconnect()
      document.querySelectorAll('tr[data-automation-id]').forEach(row => updateRowTags(rowId(row)))
      log('RELAUNCHING WATCH')
      renderWhenDomChanges()
    })
    observer.observe(document.body, {subtree: true, childList: true, characterData: true})
  }

  //------------------------------------------------------------------------------
  // Main
  //------------------------------------------------------------------------------

  watchXHR()
  initRender()

})();

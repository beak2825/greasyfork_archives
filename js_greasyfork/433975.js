// ==UserScript==
// @name        Freshdesk Ticket Note Agent
// @version     0.1.0
// @description A userscript that adds agent assignment to note
// @license     MIT
// @author      Jim Cheung
// @namespace   https://github.com/jinhucheung
// @include     https://*.freshdesk.com/*
// @run-at      document-idle
// @grant       none
// @icon        https://raw.githubusercontent.com/jinhucheung/freshdesk-userscripts/main/images/freshdesk.ico
// @downloadURL https://update.greasyfork.org/scripts/433975/Freshdesk%20Ticket%20Note%20Agent.user.js
// @updateURL https://update.greasyfork.org/scripts/433975/Freshdesk%20Ticket%20Note%20Agent.meta.js
// ==/UserScript==
(() => {
  'use strict'

  // constants
  const cssSelectors = {
    basicDropdown: '#ember-basic-dropdown-wormhole',
    noteAgentField: '#ticket-note-agent-field',
    noteAgentInput: '#ticket-note-agent-input',
    noteAgentDropdown: '#ticket-note-agent-dropdown-wormhole',
    noteAgentDropdownOptionList: '#ticket-note-agent-dropdown-option-list',
    noteAgentNotFound: '#ticket-note-agent-not-found',
    noteEmailField: '[data-test-notify-to]',
    noteEmailSelectField: '[data-test-notify-to] .ticket-action__email > .ember-view',
    ticketProperties: '.__module-tickets__ticket-details__properties',
    propertyAgentLabel: '[data-test-id="agent"] .label-field'
  }

  // data
  let dropdownObserver = null

  // entry
  document.body.addEventListener('click', e => {
    if (!isTicketPath() || !getTicket()) {
      removeObserver()
      return
    }

    if (isTargetOf('addNote', e.target)) {
      setTimeout(renderNoteAgentField, 0)
      addObserver()
    }

    if (isTargetOf('sendNote', e.target)) {
      assignResponder()
    }

    if (!isTargetOf('noteAgent', e.target)) {
      removeNoteAgentDropdown()
    }
  })

  window.addEventListener('resize', () => {
    if (!isTicketPath() || !getTicket()) return

    locateNoteAgentDropdown()
  })

  // elements
  function createNoteAgentField(name, value) {
    const element = document.createElement('div')
    element.id = 'ticket-note-agent-field'
    element.className = 'ticket-action__fields can-edit'
    element.innerHTML = `
      <div class="ticket-action__field ticket-action__label text__infotext mt-11">${name}: </div>
      <div class="ticket-action__field mt-10 ml-10" style="width: 300px;">
        <input id="ticket-note-agent-input" data-group="note-agent" value="${value || ' -- '}"
          style="border: none; box-shadow: none; outline: none; width: 100%; border-radius: 4px; padding: 4px 8px;" />
      </div>
    `
    return element
  }

  function createNoteAgentDropdown(ticket, agents) {
    const element = document.createElement('div')
    element.id = 'ticket-note-agent-dropdown-wormhole'
    element.innerHTML = `
      <div class="dropdown-content ember-basic-dropdown-content ember-power-select-dropdown ember-view ember-basic-dropdown-content--left ember-basic-dropdown-content--above ember-basic-dropdown--transitioned-in"
        style="max-height: 300px; width: 300px; overflow: auto;"
        >
        <ul class="ember-power-select-options ember-view" id="ticket-note-agent-dropdown-option-list">
          <li class="ember-power-select-option" role="option"> -- </li>
          ${agents && agents.map(agent => {
              return `
                <li class="ember-power-select-option"
                  data-id="${agent.id}"
                  data-email="${agent.email}"
                  aria-selected="${agent.id == ticket.responderId}"
                  aria-current="${agent.id == ticket.responderId}"
                  role="option"
                >${agent.name}</li>
              `
            }).join('')}
        </ul>
      </div>
    `
    return element
  }

  function createNoteAgentNotFound() {
    const element = document.createElement('li')
    element.id = 'not-found'
    element.innerHTML = 'No results found'
    element.style.padding = '7px 30px 7px 8px'
    return element
  }

  function renderNoteAgentField() {
    if (getNoteAgentField()) return

    const noteEmailField = getNoteEmailField()
    if (!noteEmailField) return

    const responder = getResponder()
    const propertyAgentLabel = getPropertyAgentLabel()
    const noteAgentField = createNoteAgentField(propertyAgentLabel.title, responder.name)
    noteEmailField.parentNode.insertBefore(noteAgentField, noteEmailField)

    observeNoteAgentField()
  }

  function renderNoteAgentDropdown() {
    if (getNoteAgentDropdown()) return

    const dropdown = createNoteAgentDropdown(getTicket(), getAgents())
    document.body.appendChild(dropdown)

    locateNoteAgentDropdown()
    observeNoteAgentDropdown()
  }

  function locateNoteAgentDropdown() {
    const dropdown = getNoteAgentDropdown()
    if (!dropdown) return

    const dropdownContent = dropdown.querySelector('.dropdown-content')
    if (!dropdownContent) return

    const noteAgentInput = getNoteAgentInput()
    if (!noteAgentInput) return
    const noteAgentInputRect = noteAgentInput.getBoundingClientRect()

    dropdownContent.style.top = `${noteAgentInputRect.top + window.scrollY + 35}px`
    dropdownContent.style.left = `${noteAgentInputRect.left + window.scrollX}px`
  }

  function removeNoteAgentDropdown() {
    const dropdown = getNoteAgentDropdown()
    dropdown && dropdown.remove()
  }

  function filterNoteAgentOptions(value) {
    const list = getNoteAgentDropdownOptionList()
    if (!list) return true

    const options = list.querySelectorAll('li')
    if (!options) return true

    const formattedValue = (value || '').toLowerCase()
    let resultCount = options.length
    options.forEach(option => {
      const email = (option.dataset.email || '').toLowerCase()
      if (!formattedValue || option.innerHTML.trim().toLowerCase().indexOf(formattedValue) >= 0 || email.indexOf(formattedValue) >= 0) {
        option.style.display = 'block'
      } else {
        option.style.display = 'none'
        resultCount--
      }
    })

    return resultCount > 0
  }

  function observeNoteAgentField() {
    const noteAgentInput = getNoteAgentInput()
    if (!noteAgentInput) return

    noteAgentInput.addEventListener('focus', () => {
      noteAgentInput.style.boxShadow = '0 0 0 2px #2c5cc5'
      noteAgentInput.select()
    })

    noteAgentInput.addEventListener('blur', () => {
      noteAgentInput.style.boxShadow = ''
    })

    noteAgentInput.addEventListener('click', () => {
      renderNoteAgentDropdown()
    })

    noteAgentInput.addEventListener('keyup', () => {
      setTimeout(() => {
        const hasResult = filterNoteAgentOptions(noteAgentInput.value)
        const notFound = getNoteAgentNotFound()
        if (hasResult) {
          notFound && notFound.remove()
        } else if (!notFound) {
          const optionList = getNoteAgentDropdownOptionList()
          optionList && optionList.appendChild(createNoteAgentNotFound())
        }
      }, 500)
    })
  }

  function observeNoteAgentDropdown() {
    const optionList = getNoteAgentDropdownOptionList()
    optionList && optionList.addEventListener('click', e => {
      if (e.target.getAttribute('role') === 'option') {
        setResponder(e.target.dataset.id)
      }
    })
  }

  function addObserver() {
    observeTicket()
    observeDropdown()
  }

  function removeObserver() {
    dropdownObserver && dropdownObserver.disconnect()
    dropdownObserver = null
  }

  function observeTicket() {
    const ticket = getTicket()
    ticket && ticket.addObserver('responderId', handleResponderChanged)
  }

  function observeDropdown() {
    if (dropdownObserver) return

    const basicDropdown = getBasicDropdown()
    if (!basicDropdown) return

    dropdownObserver = new MutationObserver(() => {
      setTimeout(() => {
        basicDropdown.innerHTML && removeNoteAgentDropdown()
      }, 0)
    })
    dropdownObserver.observe(basicDropdown, { childList: true, subtree: true })
  }

  function handleResponderChanged() {
    const responder = getResponder()

    const noteAgentInput = getNoteAgentInput()
    if (noteAgentInput) noteAgentInput.value = responder.name || ' -- '

    setEmailTo(responder)
  }

  function getBasicDropdown() {
    return document.querySelector(cssSelectors.basicDropdown)
  }

  function getNoteAgentField() {
    return document.querySelector(cssSelectors.noteAgentField)
  }

  function getNoteAgentInput() {
    return document.querySelector(cssSelectors.noteAgentInput)
  }

  function getNoteAgentDropdown() {
    return document.querySelector(cssSelectors.noteAgentDropdown)
  }

  function getNoteAgentDropdownOptionList() {
    return document.querySelector(cssSelectors.noteAgentDropdownOptionList)
  }

  function getNoteAgentNotFound() {
    return document.querySelector(cssSelectors.noteAgentNotFound)
  }

  function getNoteEmailField() {
    return document.querySelector(cssSelectors.noteEmailField)
  }

  function getPropertyAgentLabel() {
    return document.querySelector(cssSelectors.propertyAgentLabel)
  }

  // methods
  function getApp() {
    const apps = window.Ember.A(window.Ember.Namespace.NAMESPACES)
    return apps[apps.length - 1]
  }

  function getPath() {
    return getApp().__container__.lookup('controller:application').get('currentPath')
  }

  function getTicket() {
    const view = lookupView(cssSelectors.ticketProperties)
    return view && view.ticket
  }

  function getAccount() {
    const ticket = getTicket()
    return ticket && ticket.currentAccount
  }

  function getAgents() {
    const account = getAccount()
    return account && account.agents && account.agents.currentState.map(agent => agent.__data.contact)
  }

  function getResponder() {
    const ticket = getTicket()
    if (!ticket || !ticket.responderId) return {}

    const agents = getAgents()
    if (!agents) return {}

    const responder = agents.find(agent => agent.id == ticket.responderId)
    return responder || {}
  }

  function getMeta() {
    const account = getAccount()
    return account && account.meta
  }

  function lookupView(selector) {
    const node = document.querySelector(selector)
    if (!(node && node.id)) return
    return getApp().__container__.lookup('-view-registry:main')[node.id]
  }

  function setEmailTo(responder) {
    const emailTo = lookupView(cssSelectors.noteEmailSelectField)
    if (!(emailTo && emailTo.options)) return

    const selects = []
    const option = emailTo.options.content.find(option => option.id == responder.id)
    if (option && option._record) selects.push(option._record)
    emailTo.set('selected', selects)
  }

  function setResponder(id) {
    const ticket = getTicket()
    ticket && ticket.set('responderId', parseInt(id))
  }

  function assignResponder() {
    const ticket = getTicket()

    if (!(ticket && ticket.data)) return
    if (ticket.responderId == ticket.data.responderId) return

    updateResponder(ticket.responderId).then(data => {
      const responderId = (data.ticket || {}).responder_id
      ticket.set('data.responderId', responderId)
      // trigger to update submit button
      ticket.set('responderId', `${responderId}`)
      ticket.set('responderId', responderId)
    })
  }

  function isTicketPath() {
    return getPath() === 'helpdesk.tickets.show'
  }

  function isTargetOf(name, target) {
    switch (name) {
      case 'addNote':
        // [add note] button
        return target.dataset.testEmailActionBtn === 'note'
      case 'sendNote':
        // [Add note] button / [Add note and set as xxx] button
        return target.id === 'send-and-set' || (target.getAttribute('class') || '').indexOf('send-and-set-item') >= 0
      case 'noteAgent':
        // [Agent] field in note box
        return target.dataset.group === 'note-agent'
      default:
        return false
    }

  }

  // api
  async function updateResponder(id) {
    const formattedId = id && parseInt(id) || null
    return fetch(`/api/_/tickets/${getTicket().id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': getMeta().csrf_token,
      },
      body: JSON.stringify({ responder_id: formattedId })
    })
    .then(response => response.json())
    .catch(console.error)
  }
})()
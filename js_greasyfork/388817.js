// ==UserScript==
// @name         AccessHub Connection Detail
// @namespace    https://openuserjs.org/users/mato-meciar
// @copyright    2024, mato-meciar (https://openuserjs.org/users/mato-meciar)
// @version      0.1.5
// @description  Provides a clickable link to connections straight from Sec. Systems list page
// @author       Martin Meciar
// @license      MIT
// @homepageURL  https://github.com/mato-meciar/ah-scripts
// @supportURL   https://github.com/mato-meciar/ah-scripts
// @match        https://*.idaccesshub.com/ECM/securitysystems/list*
// @match        https://*.saviyntcloud.com/ECM/securitysystems/list*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/388817/AccessHub%20Connection%20Detail.user.js
// @updateURL https://update.greasyfork.org/scripts/388817/AccessHub%20Connection%20Detail.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author mato-meciar
// ==/OpenUserJS==

// prepare and inject the script into the page
$(document).ready(function() {
  class Connection {
    constructor(connectionname) {
      if (connectionname && connectionname.length > 0) {
        this.name = connectionname.split('">')[1].replace('</a>', '')
        this.link = connectionname
      } else {
        this.name = ''
        this.link = ''
      }
    }

    static getConnection(name, connectionsList) {
      if (!name || name.length == 0) return new Connection()
      let connection = connectionsList.filter(conn => conn.name === name)

      return connection[0]
    }
  }

  function sanitizeResults(results) {
    let connections = []
    results.results.forEach(connection => {
      connections.push(new Connection(connection.connectionname))
    })

    return connections
  }

  function populateConnections(connections) {
    const maxResults = parseInt(
      $('#s2id_autogen1 > a > span.select2-chosen')[0].textContent
    )
    let connName = undefined
    let provConnName = undefined
    let connLink = undefined
    let provConnLink = undefined

    for (let i = 1; i <= maxResults; i++) {
      try {
        connName = $(
          `#securitysystemsList > tbody > tr:nth-child(${i}) > td:nth-child(8)`
        )[0].textContent
        provConnName = $(
          `#securitysystemsList > tbody > tr:nth-child(${i}) > td:nth-child(9)`
        )[0].textContent
        connLink = Connection.getConnection(connName, connections).link
        provConnLink = Connection.getConnection(provConnName, connections).link
        $(
          `#securitysystemsList > tbody > tr:nth-child(${i}) > td:nth-child(8)`
        )[0].innerHTML = connLink ? connLink : ''
        $(
          `#securitysystemsList > tbody > tr:nth-child(${i}) > td:nth-child(9)`
        )[0].innerHTML = provConnLink ? provConnLink : ''
      } catch (e) {

      }
    }
  }

  async function getConnectionsList() {
    const call = $.post(
      `https://${document.domain}/ECM/ecmConfig/externalconnectionlistjson?sEcho=1&iColumns=7&sColumns=&iDisplayStart=0&iDisplayLength=9999&mDataProp_0=chkbx&mDataProp_1=connectionname&sSearch=&bRegex=false&sSearch_0=&bRegex_0=false&bSearchable_0=true&sSearch_1=&bRegex_1=false&bSearchable_1=true&sSearch_2=&bRegex_2=false&bSearchable_2=true&sSearch_3=&bRegex_3=false&bSearchable_3=true&sSearch_4=&bRegex_4=false&bSearchable_4=true&sSearch_5=&bRegex_5=false&bSearchable_5=true&sSearch_6=&bRegex_6=false&bSearchable_6=true&iSortCol_0=0&sSortDir_0=asc&iSortingCols=1&bSortable_0=false&bSortable_1=true&bSortable_2=true&bSortable_3=true&bSortable_4=true&bSortable_5=true&bSortable_6=false&controller=ecmConfig&action=externalconfig&jsontype=datatable`
    )
    const result = await call
    const connections = sanitizeResults(result)

    return connections
  }

  async function waitForElementToDisplay(selector, time) {
    if (document.querySelector(selector) != null) {
      const connections = await getConnectionsList()
      populateConnections(connections)
      return
    } else {
      setTimeout(function() {
        waitForElementToDisplay(selector, time)
      }, time)
    }
  }

  // set up a mutation observer that re-adds the details buttons when user changes the amount of shown rows or filters the results
  var mutationObserver = new MutationObserver(function(mutations) {
    waitForElementToDisplay('#securitysystemsList_info', 2000)
    //mutations.forEach(function(mutation) {
    //});
  })

  // set the mutation observer to check for the data table changes
  mutationObserver.observe(
    document.getElementById('securitysystemsList_wrapper'),
    {
      attributes: true,
      characterData: false,
      childList: false,
      subtree: true,
      attributeOldValue: false,
      characterDataOldValue: false,
    }
  )
})

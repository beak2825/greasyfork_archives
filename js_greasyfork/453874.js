// ==UserScript==
// @name     Zoom Auditor
// @description Script that lets you find the final instances of recurring Zoom meetings
// @version  3
// @grant    none
// @include          https://zoom.us/*
// @include          https://*.zoom.us/*
// @namespace https://greasyfork.org/users/22981
// @license https://anticapitalist.software/
// @downloadURL https://update.greasyfork.org/scripts/453874/Zoom%20Auditor.user.js
// @updateURL https://update.greasyfork.org/scripts/453874/Zoom%20Auditor.meta.js
// ==/UserScript==

/*
ANTI-CAPITALIST SOFTWARE LICENSE (v 1.4)

Copyright © 2022 Adam Novak

This is anti-capitalist software, released for free use by individuals and
organizations that do not operate by capitalist principles.

Permission is hereby granted, free of charge, to any person or organization
(the "User") obtaining a copy of this software and associated documentation
files (the "Software"), to use, copy, modify, merge, distribute, and/or sell
copies of the Software, subject to the following conditions:

1. The above copyright notice and this permission notice shall be included in
   all copies or modified versions of the Software.

2. The User is one of the following:
  a. An individual person, laboring for themselves
  b. A non-profit organization
  c. An educational institution
  d. An organization that seeks shared profit for all of its members, and
     allows non-members to set the cost of their labor

3. If the User is an organization with owners, then all owners are workers and
   all workers are owners with equal equity and/or equal vote.

4. If the User is an organization, then the User is not law enforcement or
   military, or working for or under either.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT EXPRESS OR IMPLIED WARRANTY OF ANY
KIND, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/// Globally cache CSRF token
let _csrf_token

/// Get the Zoom CSRF token to make requests.
async function get_token() {
  if (!_csrf_token) {
    // See https://github.com/pozhiloy-enotik/zoom-gta/blob/1982234a066b2ed06277d68765ed2670f042fae6/gif.py#L15
    _csrf_token = await fetch('https://zoom.us/csrf_js', {
      method: 'POST',
      headers: {
        'FETCH-CSRF-TOKEN': '1'
      }
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return response.text()
    }).then((text) => {
      let parts = text.split(':')
      console.log("Token got: " + parts[1])
      return parts[1]
    })
  }
  return _csrf_token
}

/// Run the given async function on each page of upcoming Zoom meetings
async function for_each_page(csrf_token, callback) {
  let page = 1
  let items_seen = 0
  let total_items = undefined
  
  while (total_items === undefined || total_items > items_seen) {
    let query = new URLSearchParams({
      'listType': 'upcoming',
      'page': page
    })

    let page_data = await fetch('https://zoom.us/rest/meeting/list', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest, OWASP CSRFGuard Project',
        'ZOOM-CSRFTOKEN': csrf_token
      },
      body: query
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return response.json()
    })
    
    if (!page_data.status) {
      console.log('Status is ', page_data.status)
      console.log(page_data)
      throw new Error(`API error! API says: ${JSON.stringify(page_data)}`)
    }
    
    page += 1
    total_items = page_data.result.totalRecords
    items_seen += (page_data.result.meetings || []).length
    
    await callback(page_data)
    
    if ((page_data.result.meetings || []).length == 0) {
    	// Got an empty page for some reason. Probably done?
      break
    }
  }
}

async function get_all_events() {
  console.log("Getting all events")
  csrf_token = await get_token()
  all_events = []
  await for_each_page(csrf_token, (page_data) => {
    console.log("Got event page:", page_data)
    for (let m of page_data.result.meetings) {
      for (let o of m.list) {
        all_events.push(o)
      }
    }
  })
  return all_events
}

/// Given events, get a sorted list of objects for final events, with 'name', 'date', and 'link' fields
function audit(events) {
  last_items = []
  for (let event of events) {
    // Find the last ones
    if (!event.occurrenceTip) {
      // Not a repeating event
      continue
    }
    let parsed_tip = event.occurrenceTip.match(/([0-9]+) of ([0-9]+)$/)
    if (parsed_tip[1] != parsed_tip[2]) {
      // Not a last one
      continue
    }
    last_items.push(event)
  }
  
  // Sort by ending soonest
  last_items.sort((a, b) => {return a.occurrence > b.occurrence})
  
  let results = []
  
  for (let e of last_items) {
    results.push({'name': e.topic, 'date': new Date(e.occurrence), 'link': `https://zoom.us/meeting/${e.number}/edit`})
  }
  return results
}

/// Make an HTML element describing the given final meetings
function make_table(final_meetings) {
  // Set up so we can know how far in advance things are.
  let now = new Date()
  const TWO_MONTHS_MS = 60 * 24 * 60 * 60 * 1000
  
  let root = document.createElement('div')
  root.innerHTML=`
  <style content-type="text/css">
    table.audit {
      margin: 0.5em;
    }
    table.audit td, table.audit th {
      border: 1px solid black;
      padding: 2px;
    }
    table.audit th {
      background-color: black;
      color: white;
    }
    table.audit tr.soon {
      background-color: lemonchiffon;
    }
    table.audit tr.soon td.name::after {
      content: " ⚠️ Expiring Soon!";
      color: red;
      font-size: 10pt;
      text-align: right;
    }
    table.audit td.link {
      text-align: center;
    }
  </style>
  <p>The following Zoom meetings will run out of occurrences soon.</p>
  `
  let table = document.createElement('table')
  table.classList.add('audit')
  let header = document.createElement('tr')
  header.innerHTML="<th>Name</th><th>Final Occurrence</th><th>Edit</th>"
  table.appendChild(header)
  for (let m of final_meetings) {
    // Make a row for each final meeting
    let row = document.createElement('tr')
    let name_cell = document.createElement('td')
    name_cell.classList.add('name')
    name_cell.innerText = m.name
    row.appendChild(name_cell)
    let date_cell = document.createElement('td')
    date_cell.innerText = m.date.toLocaleString('en-us')
    row.appendChild(date_cell)
    
    let ms_in_future = m.date - now
    if (ms_in_future < TWO_MONTHS_MS) {
      // Mark this as ending soon!
      row.classList.add('soon')
    }
    
    // Make sure we have a new-tab edit link
    let link_cell = document.createElement('td')
    link_cell.classList.add('link')
    let link = document.createElement('a')
    link.innerText = '📝'
    link.setAttribute('href', m.link)
    link.setAttribute('target', '_blank')
    link_cell.appendChild(link)
    row.appendChild(link_cell)
    table.appendChild(row)
  }
  root.appendChild(table)
  return root
}

/// Show the given content in a closeable modal dialog
function show_dialog(element) {
  const DIALOG_ID = "zoom_audit_dialog"
  
  // Get rid of any old dialogs from the page.
  let old_dialog = document.getElementById(DIALOG_ID)
  if (old_dialog) {
    old_dialog.remove()
  }
  
  let dialog = document.createElement('dialog')
  dialog.setAttribute('id', DIALOG_ID)
  dialog.appendChild(element)
  // Style the dialog
  dialog.style.padding = '1em'
  // Center the dialog
  dialog.style.position = 'fixed'
  dialog.style.left = '50%'
  dialog.style.overflow = 'scroll'
  dialog.style.transform = 'translateX(-50%)'
  let form = document.createElement('form')
  form.setAttribute('method', 'dialog')
  form.innerHTML="<button>Close</button>"
  dialog.appendChild(form)
  let body = (document.getElementsByTagName('body') || [])[0]
  if (body) {
    body.appendChild(dialog)
    dialog.showModal()
  }
}

/// Make an HTML element which when pressed launches an audit, for the Zoom navbar
function make_audit_button() {
  let item = document.createElement('li')
  item.setAttribute('role', 'none')
  let link = document.createElement('a')
  link.classList.add('light')
  link.setAttribute('role', 'menuitem')
  link.setAttribute('href', 'javascript:;')
  link.innerText = "🌹 AUDIT"
  
  // Put a throbber before the link text
  let throbber = document.createElement('span')
  throbber.innerText = '⌛'
  throbber.style.display = 'none'
  link.prepend(throbber)
  
  let auditing = false
  link.addEventListener('click', async () => {
    if (!auditing) {
      // Only run one flow at a time
      try {
        auditing = true
        throbber.style.display = 'inline'
        await do_audit()
      } finally {
        auditing = false
        throbber.style.display = 'none'
      }
    }
  })
  
  item.appendChild(link)
  return item
}

/// Add an element to the right-side Zoom navbar, from a factory callback
function add_to_right_navbar(make_element) {
  let navbar = document.getElementById('navbar')
  console.log("Navbar is:", navbar)
  if (!navbar) {
    throw new Error('Could not find navbar')
  }
  // Zoom now has mobile and non-mobile right navbars
  let right_navbars = (navbar.getElementsByClassName('navbar-right') || [])
  console.log("Right navbar(s):", right_navbars)
  if (!right_navbars) {
    throw new Error('Could not find right navbar')
  }
  for (let right_navbar of right_navbars) {
    let button = make_element()
    console.log("Made a button", button)
  	right_navbar.appendChild(button)
  }
}

/// Hook our UI into the page
function setup() {
  console.log("Hooking in auditing")
  add_to_right_navbar(make_audit_button)
}

/// Do an audit and show the dialog
async function do_audit() {
  // Pre-declare variables so we can paste the rest in the console
  let all_events
  let final_meetings
  let report
  all_events = await get_all_events() 
  final_meetings = audit(all_events)
  report = make_table(final_meetings)
  show_dialog(report)
}

// On page load, hook in
setup()




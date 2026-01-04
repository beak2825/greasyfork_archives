// ==UserScript==
// @name        WHMCS Ticket Watcher
// @namespace   https://github.com/daggontale/Violentmonkey_scripts
// @match       https://support.i7media.com/nv79/supporttickets.php
// @grant       none
// @version     2.5
// @author      Joey Stombaugh
// @description Highlights new tickets and notifies window after 1 minute.
// @downloadURL https://update.greasyfork.org/scripts/453720/WHMCS%20Ticket%20Watcher.user.js
// @updateURL https://update.greasyfork.org/scripts/453720/WHMCS%20Ticket%20Watcher.meta.js
// ==/UserScript==

// The constant definitions are in all caps just to help with case sensitivity.

// Watches for these ticket statuses.
const STATUS_LIST = ["CUSTOMER-REPLY", "OPEN"];

// Only looks for tickets with these assigned departments. Will look through all if empty.
const DEPARTMENT_LIST = ["TECHNICAL SUPPORT"];

// Add tickets to the blacklist via the custom ticket blacklist tab on the webpage.
const BLACKLIST = JSON.parse(localStorage.getItem('ticketBlacklist') ?? '[]');

// ###################
// #### Functions ####
// ###################

function ticketBlacklistTab(adminTabNodeList) {
  const blacklistCache = BLACKLIST;
  const newTab = document.createElement('li');

  newTab.innerHTML = `<a class="tab-top" href="#tab${adminTabNodeList[0].childElementCount + 1}" role="tab" data-toggle="tab" id="tabLink${adminTabNodeList[0].childElementCount + 1}" data-tab-id="${adminTabNodeList[0].childElementCount + 1}">Ticket Blacklist</a>`;
  adminTabNodeList[0].appendChild(newTab);

  const tabPage = document.createElement('div');

  tabPage.classList += "tab-pane";
  tabPage.id = `tab${adminTabNodeList[1].childElementCount + 1}`;

  const wrapper = document.createElement('div');
  wrapper.align = 'center';
  const input = document.createElement('input');
  input.classList.add('form-control', 'select-inline');
  input.type = 'text';
  input.placeholder = 'Ticket Id';
  input.id = 'input-blacklist';
  const addToList = document.createElement('button');
  addToList.textContent = 'Add';
  addToList.classList = 'btn btn-primary btn-sm';
  addToList.id = 'btn-blacklist';
  addToList.addEventListener('click', x => {
    if (!blacklistInput.value == '' && !blacklistCache.includes(input.value)) {
      blacklistCache.push({ timeAdded: new Date().toLocaleDateString(), ticketId: input.value });
      localStorage.ticketBlacklist = JSON.stringify(blacklistCache);
    }
  })

  const showList = document.createElement('button');
  showList.textContent = 'Show Blacklist';
  showList.classList = 'btn btn-primary btn-sm';
  showList.id = 'btn-show-blacklist';
  showList.addEventListener('click', () => showBlacklistedTickets(blacklistTabTable) )

  const tableWrapper = document.createElement('div');
  tableWrapper.align = 'center';
  tableWrapper.id = 'blacklistTabTable'

  wrapper.appendChild(input);
  wrapper.appendChild(addToList);
  wrapper.appendChild(showList);

  tabPage.appendChild(wrapper);
  tabPage.appendChild(tableWrapper);

  adminTabNodeList[1].appendChild(tabPage);
}

function showBlacklistedTickets(node) {
  const tableElement = document.querySelector('#blacklistTable');

  if (tableElement) {
    tableElement.remove()
  }

  const blacklistTable = document.createElement('table');
  blacklistTable.id = 'blacklistTable'
  blacklistTable.classList += 'datatable'

  const tableHead = document.createElement('thead');
  const headRow = document.createElement('tr');
  const header1 = document.createElement('th');
  header1.textContent = 'Date Added';
  const header2 = document.createElement('th');
  header2.textContent = 'Ticket Id';
  const header3 = document.createElement('th');
  header3.textContent = 'Controls';

  headRow.append(header1, header2, header3);
  tableHead.appendChild(headRow);

  const tableBody = document.createElement('tbody');
  const blacklistedTickets = JSON.parse(localStorage.ticketBlacklist);

  if (blacklistedTickets == []) {
    const bodyRow = document.createElement('tr');
    const noTickets = document.createElement('td');
    noTickets.textContent = 'No Blacklisted Tickets';

    bodyRow.appendChild(noTickets);
    tableBody.appendChild(bodyRow);
  } else {
    for (let ticket of blacklistedTickets) {
      const bodyRow = document.createElement('tr');
      const col1 = document.createElement('td');
      col1.textContent = ticket.timeAdded;
      const col2 = document.createElement('td');
      col2.textContent = ticket.ticketId;
      const col3 = document.createElement('td');
      const removeBtn = document.createElement('button');
      removeBtn.addEventListener('click', () => {
        removeTicketFromBlacklist(ticket.ticketId);
        showBlacklistedTickets(blacklistTabTable);
      });
      removeBtn.textContent = 'remove from list';

      col3.appendChild(removeBtn);
      bodyRow.append(col1, col2, col3);
      tableBody.appendChild(bodyRow);
    }
  }

  blacklistTable.append(tableHead, tableBody);

  node.appendChild(blacklistTable);
}

function getDayDifference(date, days) {
  dateToCheck = new Date(date);
  xDaysAgo = new Date(new Date().getTime() + (86400000 * days));
  if (xDaysAgo.getTime() < dateToCheck) {
    return true;
  }
  return false;
}

function removeOldTickets() {
  const filteredTickets = BLACKLIST
    .filter(x => getDayDifference(x.timeAdded, -5));
  localStorage.setItem('ticketBlacklist', JSON.stringify(filteredTickets));
}

function removeTicketFromBlacklist(id) {
  const filteredTickets = BLACKLIST
    .filter(x => !(x.ticketId === id));
  localStorage.setItem('ticketBlacklist', JSON.stringify(filteredTickets));
}

function parseLastReply(string) {
	const days = /\d+(?=d)/.exec(string) * 8.64e+7;
	const hours = /\d+(?=h)/.exec(string) * 3.6e+6;
	const minutes = /\d+(?=m)/.exec(string) * 60000;

	return days + hours + minutes;
}

function createTicketObj(ticketNode) {
	return {
		dept: ticketNode.childNodes[2].textContent.toUpperCase().trim(),
		element: ticketNode,
		id: ticketNode.childNodes[3].innerText.slice(5, 10).trim(),
		lastReply: parseLastReply(ticketNode.childNodes[6].innerText),
		status: ticketNode.childNodes[5].textContent.toUpperCase().trim()
	};
};

function ticketFilter(ticketObject) {
	return (!BLACKLIST.map(x => x.ticketId)?.includes(ticketObject.id) && STATUS_LIST.includes(ticketObject.status) && DEPARTMENT_LIST.includes(ticketObject.dept));
};

// ##############
// #### Code ####
// ##############

const adminTabs = document.querySelectorAll('.admin-tabs');

ticketBlacklistTab(adminTabs);

const blacklistInput = document.querySelector('#input-blacklist');
const blacklistButton = document.querySelector('#btn-blacklist');
const showBlacklistButton = document.querySelector('#btn-show-blacklist');
const blacklistTabTable = document.querySelector('#blacklistTabTable');

if (localStorage.getItem('ticketBlacklist')) {
  localStorage.setItem('ticketBlacklist', '[]');
}

removeOldTickets();

const MATCHING_TICKETS = Array.from(document.querySelectorAll('[id*="sortabletbl"] > tbody > tr:not(:first-child)'))
	.map(x => createTicketObj(x))
	.filter(ticketFilter);

for (const ticket of MATCHING_TICKETS) {
	ticket.element.children[3].style.backgroundColor = 'yellow';

	if (ticket.lastReply < 4.32e+7) {
		ticket.element.children[6].style.backgroundColor = 'lime';
	} else if (ticket.lastReply >= 4.32e+7 && ticket.lastReply < 8.64e+7) {
		ticket.element.children[6].style.backgroundColor = 'yellow';
	} else if (ticket.lastReply >= 8.64e+7 && ticket.lastReply < 1.728e+8) {
		ticket.element.children[6].style.backgroundColor = 'orange';
	} else if (ticket.lastReply >= 1.728e+8) {
		ticket.element.children[6].style.backgroundColor = 'red';
		setInterval(() => {
			ticket.element.children[6].style.backgroundColor = 'yellow';
			setTimeout(() => { ticket.element.children[6].style.backgroundColor = 'red'; }, 500);
		}, 1000)
	}
}

console.log(MATCHING_TICKETS)

if (MATCHING_TICKETS.length > 0) {
	setTimeout(() => { alert('New Tickets') }, 60000);
}

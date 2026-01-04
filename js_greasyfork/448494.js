// ==UserScript==
// @name        BZUCO Customers NFC
// @namespace   https://jiraskuvhronov.bzuco.cloud/
// @description Neoficiální podpora exportu vstupenek na NFC čipy
// @license     MIT; https://opensource.org/licenses/MIT
// @match       https://jiraskuvhronov.bzuco.cloud/admin/cs/customers/*
// @match       https://test-9.bzuco.cloud/admin/cs/customers/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.min.js
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlHttpRequest
// @version     0.4
// @downloadURL https://update.greasyfork.org/scripts/448494/BZUCO%20Customers%20NFC.user.js
// @updateURL https://update.greasyfork.org/scripts/448494/BZUCO%20Customers%20NFC.meta.js
// ==/UserScript==

const $ = this.jQuery = jQuery.noConflict(true); // eslint-disable-line

const DATA_URL = "https://bz.42web.io/nfc/storeData.php";

let myIP = null;

function getCachedData(mail) {
	let objStr = localStorage.getItem(mail);

	if (!objStr) return false;

	return JSON.parse(LZString.decompress(objStr));
}

function storeCachedData(mail, object) {
	localStorage.setItem(mail, LZString.compress(JSON.stringify(object)));
	return object;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getTickets(orderId) {
    const order = await $.ajax({
        url: window.location.origin + `/api/1.0/orders/order/${orderId}/?view=admin&lang=cs`,
        type: 'GET',
        dataType: 'json'
    });

	if (order.id != orderId)
		throw `Neočekávané ID objednávky ${orderId} != ${order.id}`;

	if (order.status !== 'paid')
		throw `Neočekávaný status objednávky ${order.id}: ${order.status}`;

	if (order.tickets.length === 0)
		alert(`\tVarování: Objednávka ${order.id} neobsahuje žádné vstupenky!`);

	return order.tickets;
}

async function getAllPaidTickets(mail) {
    const data = await $.ajax({
        url: window.location.origin + '/admin/cs/customers/export-detail/' + mail + '/',
        type: 'GET',
        dataType: 'json'
    });

	if (data.length < 1 || data[0].module !== 'orders')
		throw `Chyba při načítání objednávek zákazníka ${mail}`;

	const paidTickets = [];
	const warnings = [];

	for (const order of data[0].records) {
		if (order.status !== 'Uhrazená') continue;

		let tickets = await getTickets(order.id);

		for (const ticket of tickets) {
			if (ticket.items.length > 1)
				warnings.push(`Objednávka obsahuje více vstupenek na akci: ${ticket.event_name} - ${ticket.ticketset_name}`);

			for (const item of ticket.items) {
				paidTickets.push({
					orderId: order.id,
					eventId: ticket.event_id,
					eventYear: new Date(ticket.event_start).getFullYear(),
					eventName: ticket.event_name,
					ticketsetName: ticket.ticketset_name,
					barcode: item.code
				});
			}
		}
	}

	// uložit načtená data do cache
	return storeCachedData(mail, paidTickets.length > 0?
		{ mail: mail, tickets: paidTickets, warnings: warnings }:
		{ mail: mail, tickets: [], warnings: ['Žádné vstupenky'] }
	);
}

function getAllCustomers() {
	const customers = [];
	const mails = [];

	$('.customers tbody tr').each(function() {
		let a = $(this).find('td:last-child .detail');
		let mail = a.attr('href').substring(1);

		customers.push({
			mail: mail,
			tr: $(this)
		});

		if (mails.indexOf(mail) !== -1)
			alert(`Dva zákazníci mají stejný e-mail: ${mail}`);  // nemůže nastat

		mails.push(mail);
	});

	return customers;
}

function sendData(data) {
	data.ip = myIP;

	console.log('Odesílám NFC data: ' + JSON.stringify(data));

	GM.xmlHttpRequest({
		method: "POST",
		url: DATA_URL,
		data: JSON.stringify(data),
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		onload: function (response) {
			if (!response || !response.responseText) {
				return alert('Chyba při načítání odpovědi');
			}

			let json = JSON.parse(response.responseText);

			if (!json || !json.result)
				return alert('Chybný JSON formát odpovědi');

			if (json.result !== true)
				return alert(json.result);

			alert('Data byla úspěšně odeslána.');
		}, onerror: function () {
			alert('Chyba při odesílání dat!')
		}
	});
}

function bindSendToNFCButton() {
	const modal = $('#modal');

	modal.find('.modal-footer').prepend(
		'<button id="sendToNFC" type="button" class="btn btn-secondary" style="float: left">Odeslat na čip' +
		'<i id="nfcWarning" class="fa fa-exclamation-triangle" style="color: orange; margin-left: 5px; display: none"></i>' +
		'</button>');

	// náhrada za nefungující $('#modal').on('shown.bs.modal', ...)
	new MutationObserver(function(mutations) {
		if (modal.css('display') === 'none' ||
			mutations.length < 2 /* prevence eventu při zavření modalu */) return;

		modal.removeData('cachedData');

		let mail = modal.find('#modalLabel').text().substring('Všechny informace o'.length).trim();

		// načíst aktuální data (ne z cache)
		getAllPaidTickets(mail).then(function(data) {
			console.log('Aktuální údaje pro: ' + mail);
			console.log(data);

			modal.data('cachedData', data);

			const isThisYear = data.tickets.findIndex(t => t.eventYear === 2023) !== -1;

			modal.find('#sendToNFC').prop('disabled', !isThisYear || data.tickets.length === 0);

			if (data.warnings.length > 0)
				modal.find('#nfcWarning').show();
			else
				modal.find('#nfcWarning').hide();

			// doplnit checkboxy k zaplaceným(!) vstupenkám
			modal.find('.modal-body .table:last-child tbody tr').each(function () {
				let tr = $(this);
				let th = tr.find('th:nth-child(2)');

				if (th.text().trim() === 'Objednávka') return;

				[evt, ticketsetName] = tr.find('td:nth-child(3)').text().split(/\s*\(\d{4}-\d{2}-\d{2}\):?\s*/);
				[count, eventName] = evt.split(/\s*x\s*/);
				ticketsetName = ticketsetName.split(' / ')[0].trim();

				let td = tr.find('td:nth-child(2)');
				let orderId = td.text().trim();

				let foundTickets = data.tickets.filter(t => t.orderId == orderId && t.eventName === eventName && t.ticketsetName === ticketsetName);
				let maxOneTicket = foundTickets.length <= 1;

				for (const ticket of foundTickets) {
					const checked = maxOneTicket && ticket.eventYear === 2023 && (
						// automaticky zaškrtnout diváckou řadu
						(ticket.eventId == 87 && 
							(ticket.ticketsetName.indexOf('řada A') !== -1 || ticketsetName.indexOf('řada B') !== -1)) ||
						// automaticky zaškrtnout ubytování: ZŠ, stanové městečko, WIKOV
						(ticket.eventId == 84 && 
							(ticket.ticketsetName.indexOf('třída ZŠ') !== -1 || ticket.ticketsetName.indexOf('Stanové městečko') !== -1 || ticketsetName.indexOf('WIKOV') !== -1))
					);

					// automaticky disablovat staré vstupenky a zástupné permanentky na výměnu
					const disabled = ticket.eventYear !== 2023 || (ticket.eventId === 87 && ticket.ticketsetName === 'Permanentka - seminarista');

					td.prepend(`<input type="checkbox" name="barcode" value="${ticket.barcode}"` +
						(checked ? ' checked' : '') + (disabled ? ' disabled' : '') + ' style="margin-right: 3px; float: right">');
				}

				// zabránit zaškrtnutí více checkboxů v jednom řádku
				tr.find('input[name="barcode"]').on('change', function() {
					let checkbox = $(this);

					if (checkbox.is(':checked')) {
						tr.find('input[name="barcode"]').prop('checked', false);
						checkbox.prop('checked', true);
					}
				});

				if (!maxOneTicket)
					td.append('<i class="fa fa-exclamation-triangle" style="color: orange; float: right; margin-top: 4px; margin-right: 4px"></i>');
			});
		});
	}).observe(modal[0], { attributes: true, childList: false });

	$('#sendToNFC').on('click', function() {
		let data = modal.data('cachedData');

		const selectedBarcodes = [];
		const barcodesToSend = [];

		modal.find('input[name="barcode"]:checked').each(function() {
			selectedBarcodes.push($(this).val().trim());
		});

		// redundantní kontrola
		for (const ticket of data.tickets) {
			if (selectedBarcodes.findIndex(b => b === ticket.barcode) !== -1) {
				barcodesToSend.push(ticket.barcode);
			}
		}

		if (selectedBarcodes.length !== barcodesToSend.length)
			return alert('Neočekávaná chyba při výběru vstupenek!');

		if (selectedBarcodes.length === 0)
			return alert('Vyberte prosím vstupenky.');

		const nfcData = {
			mail: data.mail,
			barcodes: barcodesToSend
		};

		sendData(nfcData)
	});
}

async function main() {
	let permCount = 0;

	for (const customer of getAllCustomers()) {
		try {
			let data = getCachedData(customer.mail);

			if (!data) {
				// omezit zátěž serveru
				await sleep(250);

				data = await getAllPaidTickets(customer.mail);
			}

			if (data) {
				const maPermanentkuA = data.tickets.findIndex(t => t.eventId == 87 && t.ticketsetName.indexOf('řada A') !== -1) !== -1;
				const maPermanentkuB = data.tickets.findIndex(t => t.eventId == 87 && t.ticketsetName.indexOf('řada B') !== -1) !== -1;

				const maUbytovaniZS = data.tickets.findIndex(t => t.eventId == 84 && t.ticketsetName.indexOf('třída ZŠ') !== -1) !== -1;
				const maUbytovaniStan = data.tickets.findIndex(t => t.eventId == 84 && t.ticketsetName.indexOf('Stanové městečko') !== -1) !== -1;
				const maUbytovaniWIKOW = data.tickets.findIndex(t => t.eventId == 84 && t.ticketsetName.indexOf('WIKOV') !== -1) !== -1;

				const hasWarnings = data.warnings.length > 0 && (maPermanentkuA || maPermanentkuB || maUbytovaniZS || maUbytovaniStan || maUbytovaniWIKOW);

				console.log(`[${data.mail}]--------------------------------------------------------------------------`);
				data.tickets.forEach(t => console.log(`\t\t| ${t.eventName} | ${t.ticketsetName} | ${t.barcode} |`));
				data.warnings.forEach(w => console.warn(w));

				customer.tr.append('<td style="color:red">' + (maPermanentkuA? '<b>A</b>': '') + (maPermanentkuB? '<b>B</b>': '') + '</td>');
				customer.tr.append('<td>' + (maUbytovaniZS? '<b>ZŠ</b>': '') + '</td>');
				customer.tr.append('<td>' + (maUbytovaniStan? '<b>S</b>': '') + '</td>');
				customer.tr.append('<td>' + (maUbytovaniWIKOW? '<b>W</b>': '') + '</td>');
				customer.tr.append('<td>' + (hasWarnings? '<i class="fa fa-exclamation-triangle" style="color: orange"></i>': '') + '</td>');

				if (maPermanentkuA || maPermanentkuB) permCount++;
			} else
				customer.tr.append('<td colspan="5"></td>');
		} catch(e) {
			console.error(`Chyba při načítání objednávek uživatele: ${customer.mail}`, e);
		}

		console.log(`Počet permanentek: ${permCount}`);
	}
}

function addClearCacheButton() {
	$('#content .panel-body .buttons').prepend(
		'<button id="clearCache" type="button" class="btn btn-secondary" style="float: left">Vyčistit cache (NFC)</button>');

	$('#clearCache').on('click', function() {
		localStorage.clear();
		alert('Cache byla vyčištěna.');
	});
}

function getIP() {
	$('#content .panel-body .buttons').prepend('<span id="myIP" style="margin-left: 10px"></span>');

	GM.xmlHttpRequest({
		method: "GET",
		url: 'https://api.ipify.org/?format=json',
		onload: function(response) {
			let json = JSON.parse(response.responseText);

			if (!json || !json.ip)
				alert('Chyba při zjišťování IP adresy!')

			myIP = json.ip;

			$('#myIP').text(`[IP: ${myIP}]`);
		},
		onerror: function() {
			alert('Chyba při načítání IP adresy!')
		}
	});
}

$('.customers thead tr:first-child').append('<th colspan="5" style="text-align: center">[ NFC sekce ]</th>');

addClearCacheButton();

getIP();

main();

bindSendToNFCButton();

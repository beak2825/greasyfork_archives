// ==UserScript==
// @name        Codegen
// @namespace   http://bzuco.cloud
// @description Vygeneruje CSV s kódy k volným sedadlům.
// @license     MIT; https://opensource.org/licenses/MIT
// @author      kolektiv
// @match       https://fordkacmacek.bzuco.cloud/admin/*/tickets/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @version     0.2
// @downloadURL https://update.greasyfork.org/scripts/486922/Codegen.user.js
// @updateURL https://update.greasyfork.org/scripts/486922/Codegen.meta.js
// ==/UserScript==

// taken from https://github.com/LinusU/to-data-view
function toDataView(data) {
    if (data instanceof Int8Array || data instanceof Uint8Array || data instanceof Uint8ClampedArray) {
        return new DataView(data.buffer, data.byteOffset, data.byteLength)
    }

    if (data instanceof ArrayBuffer) {
        return new DataView(data)
    }

    throw new TypeError('Expected `data` to be an ArrayBuffer, Buffer, Int8Array, Uint8Array or Uint8ClampedArray')
}

// taken from https://github.com/LinusU/base32-encode
const RFC4648 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
const RFC4648_HEX = '0123456789ABCDEFGHIJKLMNOPQRSTUV'
const CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

function base32Encode(data, variant, options) {
    options = options || {}
    let alphabet, defaultPadding

    switch (variant) {
        case 'RFC3548':
        case 'RFC4648':
            alphabet = RFC4648
            defaultPadding = true
            break
        case 'RFC4648-HEX':
            alphabet = RFC4648_HEX
            defaultPadding = true
            break
        case 'Crockford':
            alphabet = CROCKFORD
            defaultPadding = false
            break
        default:
            throw new Error('Unknown base32 variant: ' + variant)
    }

    const padding = (options.padding !== undefined ? options.padding : defaultPadding)
    const view = toDataView(data)

    let bits = 0
    let value = 0
    let output = ''

    for (let i = 0; i < view.byteLength; i++) {
        value = (value << 8) | view.getUint8(i)
        bits += 8

        while (bits >= 5) {
            output += alphabet[(value >>> (bits - 5)) & 31]
            bits -= 5
        }
    }

    if (bits > 0) {
        output += alphabet[(value << (5 - bits)) & 31]
    }

    if (padding) {
        while ((output.length % 8) !== 0) {
            output += '='
        }
    }

    return output
}

// create base32-encoded SHA-1 hash
async function createHash(src) {
    const encoder = new TextEncoder();
    const data = encoder.encode(src);

    const hashBuffer = await crypto.subtle.digest('SHA-1', data);

    return base32Encode(hashBuffer, 'RFC4648');
}

// prompts a file saving dialog
function saveFile(filename, text) {
	const blob = new Blob([text], {type: 'text/plain'});
	const url = URL.createObjectURL(blob);

	const a = document.createElement('a');
	a.href = url;
	a.download = filename;

	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}

const $ = this.jQuery = jQuery.noConflict(true); // eslint-disable-line

const hashes = [];
let blocks = [];

function matchTicketDetailPage() {
    return window.location.pathname.match(/\/tickets\/.*\/tickets\/(?<eventId>\d+)/i);
}

// code adapted from codegen.py
async function generateCodes() {
    const domain = window.location.hostname.split('.')[0];
    const eventId = Number(matchTicketDetailPage().groups['eventId']);

    const response1 = await $.ajax({
        url: window.location.origin + '/api/1.0/tickets/event/' + eventId + '/',
        type: 'GET',
        dataType: 'json'
    });

    blocks = response1['seats_ticketsets'].reduce((acc, val) => {
        acc[val['id']] = val['name'];

        return acc;
    }, {});

    console.log('Blocks', blocks);

    const response2 = await $.ajax({
        url: window.location.origin + '/cs/api/tickets/seats/' + eventId + '/',
        type: 'GET',
        dataType: 'json'
    });

    const codes = Object.entries(response2['response']['seats']);

    for (const [key, value] of codes) {
        const x = (await createHash(`BC-${domain.toUpperCase()}-${eventId}-${key}`)).substring(0, 6);

        if (hashes.includes(x)) {
            console.log('COLLISION', x);
            hashes.push('');
        } else {
            hashes.push(x);
        }
    }

    const zipped = codes.map(([key, value], index) => [key, value, hashes[index]]);

    console.log(`Hashes: ${hashes.length}`);

    let csv = 'Ticketset;Seat;Code\n';

    zipped.forEach(([key, seat, hash]) => {
        if (blocks[seat.ticketset]) {
            const block = blocks[seat.ticketset].trim();

            if (hash) csv += `${block};${key};${hash}\n`;
        } else
            console.log('Ignoring ticketset', seat.ticketset);
    });

    saveFile(`codes-${domain}-${eventId}.csv`, csv);
}

// add "Codegen" button
function addCodegenButton() {
    const btn = document.createElement('button');
    btn.id = 'codegenBtn';
    btn.className = 'btn btn-outline-primary';
    btn.textContent = 'Codegen';

    $('#app div')[0].shadowRoot.append(btn);

    $(btn).on('click', generateCodes);
}

// needed when the detail page is not loaded directly or reloaded
function waitForTicketDetailPage() {
    let oldHref = '';
    let bzucoObserver = null;

    new MutationObserver(() => {
        if (oldHref !== document.location.href) {
            oldHref = document.location.href;

            const bzuco = $('#app div');

            if (bzuco.length > 0 && !bzucoObserver) {
                bzucoObserver = new MutationObserver(() => {
                    if (matchTicketDetailPage() && !bzuco[0].shadowRoot.querySelector('#codegenBtn')) {
                        addCodegenButton();
                    }
                });
                
                bzucoObserver.observe(bzuco[0].shadowRoot, { childList: true, subtree: true });
            }
        }
    }).observe(document.querySelector('body'), { childList: true, subtree: true });
};

if (matchTicketDetailPage()) {
    addCodegenButton();
} else {
    waitForTicketDetailPage();
}
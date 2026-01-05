// ==UserScript==
// @name        Images helper
// @namespace   https://orbitalzero.ovh/scripts
// @description helps
// @include     *
// @version     0.01
// @author      neutronnoir
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/25233/Images%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/25233/Images%20helper.meta.js
// ==/UserScript==

try {
	init();
}
catch (error) {
	console.log(error);
}

function init () {
	if (window.location.hostname == 'gazellegames.net') {
		if (window.location.pathname == '/upload.php') {
			fill_images();
		}
		else if (window.location.pathname == '/torrents.php' && /action=editgroup/.test(window.location.search)) {
			fill_images_alt();
		}
	}
	else {
		if (find_image()) {
			window.addEventListener('beforeunload', delete_image);
		}
	}
}

function fill_images () {
	let images = JSON.parse(GM_getValue('images') || "{ }");
	let list = Object.keys(images);

	if (!list.length) {
		return;
	}

	document.getElementById('post').addEventListener('click', clear_images);

	if (list.length > 4) {
		let add_input = document.getElementById("image_block").querySelectorAll("a[href='#']")[0];
		console.log(add_input);
		let count = list.length - 4;

		while (count--) {
			add_input.click();
		}
	}

	document.getElementById('image').value = list.shift();

	let inputs = document.getElementById('image_block').getElementsByTagName('input');

	for (let input of inputs) {
		if (input.type == 'button') {
			continue;
		}
		if (!list.length) {
			break;
		}
		input.value = list.shift();
	}

	let clear_history = document.createElement('a');
	clear_history.href = '#';
	clear_history.appendChild(document.createTextNode('clear'));
	clear_history.addEventListener('click', clear_images);

	let clear_history_location = document.getElementById('image_block');
	let br = clear_history_location.getElementsByTagName('br')[0];

	clear_history_location.insertBefore(document.createTextNode('['), br);
	clear_history_location.insertBefore(clear_history, br);
	clear_history_location.insertBefore(document.createTextNode(']'), br);
}

function fill_images_alt () {
	let images = JSON.parse(GM_getValue('images') || "{ }");
	let list = Object.keys(images);

	if (!list.length) {
		return;
	}

	let cover_image;

	let inputs = document.getElementsByTagName('input');

	for (let input of inputs) {
		if (input.name == 'image') {
			cover_image = input;
		}
		else if (input.type == 'submit') {
			input.addEventListener('click', clear_images);
		}
	}

	if (!cover_image) {
		alert('Could not find image cover.');
		return;
	}

	inputs = document.getElementById('image_block').getElementsByTagName('input');

	let screenshot_count = 1; /* cover image */

	for (let input of inputs) {
		if (input.type == 'text') {
			input.value == '';
			screenshot_count++;
		}
	}

	if (list.length > screenshot_count) {
		let add_input = document.getElementById('image_block').getElementsByTagName('a')[0];

		while (list.length > screenshot_count++) {
			add_input.click();
		} 
	}

	cover_image.value = list.shift();

	for (let input of inputs) {
		if (input.type == 'button') {
			continue;
		}
		if (!list.length) {
			break;
		}
		input.value = list.shift();
	}

	let clear_history = document.createElement('a');
	clear_history.href = '#';
	clear_history.appendChild(document.createTextNode('clear'));
	clear_history.addEventListener('click', clear_images);

	let clear_history_location = document.getElementById('image_block');
	let br = clear_history_location.getElementsByTagName('br')[0];

	clear_history_location.insertBefore(document.createTextNode('['), br);
	clear_history_location.insertBefore(clear_history, br);
	clear_history_location.insertBefore(document.createTextNode(']'), br);
}

function clear_images (event) {
	GM_deleteValue('images');

	if (this.tagName == 'A') {
		event.preventDefault();
	}
}

function find_image () {
	if (document.body.childElementCount == 1 && document.body.firstChild.tagName == 'IMG' && document.body.firstChild.src == window.location.href) {
		store_image(window.location.href);

		return true;
	}

	return false;
}

function store_image (src) {
	let images = JSON.parse(GM_getValue('images') || "{ }");

	if (!images.hasOwnProperty(src)) {
		images[src] = 1;
		GM_setValue('images', JSON.stringify(images));
	}
}

function delete_image (event, src) {
	let images = JSON.parse(GM_getValue('images') || "{ }");
	let location = src || window.location.href;

	if (images.hasOwnProperty(location)) {
		delete images[location];
		GM_setValue('images', JSON.stringify(images));
	}
}

function get_api_key() {
    return new Promise( function (resolve, reject) {
        var request = new GM_xmlhttpRequest({"method": "GET",
                                           "url": "https://ptpimg.me/",
                                           "onload": function(response) {
                                               if (response.status != 200) reject("Response error " + response.status);
                                               if (response.finalUrl !== "https://ptpimg.me/") reject("Couldn't retrieve api key");
                                               resolve($(response.response).find("#api_key").first().val());
                                           }
        });
    });
}

function send_images(urls, api_key) {
    return new Promise(function(resolve, reject) {
        var boundary = "--NN-GGn-PTPIMG";
        var data = "";
        data += boundary + "\n";
        data += "Content-Disposition: form-data; name=\"link-upload\"\n\n"
        data += urls.join("\n") + "\n";
        data += boundary + "\n";
        data += "Content-Disposition: form-data; name=\"api_key\"\n\n"
        data += api_key + "\n";
        data += boundary + "--";
        var request = new GM_xmlhttpRequest({"method": "POST",
                                           "url": "https://ptpimg.me/upload.php",
                                           "responseType": "json",
                                           "headers": {
                                               "Content-type": "multipart/form-data; boundary=NN-GGn-PTPIMG"
                                           },
                                           "data": data,
                                           "onload": function(response) {
                                               if (response.status != 200) reject("Response error " + response.status);
                                               resolve(response.response.map(function (item) {
                                                   return "https://ptpimg.me/" + item.code + "." + item.ext;
                                               }));
                                               
                                           }
        });
    });
}

function preview_css () {
	return `
		.image_preview {
			position: relative;
		}

		.image_preview > img {
			max-width: 100%;
		}

		.remove_preview {
			position: absolute;

			top: 0;
			right: 0;

			background-color: rgba(255, 255, 255, .75);
		}

		.wih_button:hover {
			text-decoration: underline;
			cursor: pointer;
		}

		.remove_preview:hover {
			background-color: white;
		}
	`;
}

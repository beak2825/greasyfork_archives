// ==UserScript==
// @name         8Muses Downloader
// @namespace    https://github.com/Kayla355
// @version      0.5.1
// @description  Download comics from 8muses.com
// @author       Kayla355
// @match        http://comics.8muses.com/comics/album/*
// @match        https://comics.8muses.com/comics/album/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @icon         https://www.8muses.com/favicon.ico
// @require      https://cdn.jsdelivr.net/jszip/3.1.3/jszip.min.js
// @require      https://cdn.jsdelivr.net/filesaver.js/1.3.3/FileSaver.min.js
// @require      https://gitcdn.xyz/repo/Kayla355/MonkeyConfig/d152bb448db130169dbd659b28375ae96e4c482d/monkeyconfig.js
// @history      0.2.0 'Download all', now has an option to compress all the individual .zip files into one zip with sub-folders. By default this will be on.
// @history      0.2.1 Added an option to compress the subfolders created from the single file download option.
// @history      0.2.2 Fixed a bug where it would trigger the download multiple times when the "single file" option was enabled and the "compress sub folders" option was not.
// @history      0.3.0 ALso added the basis for download trying to download something with pagination. However, this is disabled until I solve the issue of running out of memory while doing it.
// @history      0.3.1 Fixed an issue caused by classnames being changed on the site.
// @history      0.3.2 Fixed the URL match since it was changed.
// @history      0.4.0 Updated the script to work with the new use of Ractive.js on the 8muses website.
// @history      0.4.1 Fixed some css to better match the site.
// @history	 0.5.0 Fixed Image links and more
// @downloadURL https://update.greasyfork.org/scripts/460749/8Muses%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/460749/8Muses%20Downloader.meta.js
// ==/UserScript==
cfg = new MonkeyConfig({
    title: '8Muses Downloader - Configuration',
    menuCommand: true,
    params: {
        single_file: {
            type: 'checkbox',
            default: true
        },
        compress_sub_folders: {
            type: 'checkbox',
            default: false
        }
    },
    onSave: setOptions
});

var Settings = {
	singleFile: null,
	compressSubFolders: null,
};

var zipArray = [];
var containerArray = [];
var downloadType;
var progress = {
	pages: {
		current: 0,
		items: 0,
	},
	current: 0,
	items: 0,
	zips: 0
};

function setOptions() {
    Settings.singleFile = cfg.get('single_file');
    Settings.compressSubFolders = cfg.get('compress_sub_folders');
}

(function() {
    'use strict';
    setOptions();
    init();
})();

function init() {
	var imagebox = document.querySelector('.gallery .c-tile:not(.image-a)');
    if(imagebox) {
		var isImageAlbum = !!imagebox.href.match(/comics\/picture\//i);
		if(isImageAlbum) {
			createElements('single');
		} else {
			createElements('multi');
		}
	} else {
		setTimeout(init, 100);
	}
}

function createElements(type) {
	downloadType = type || 'single';
	var downloadText = (downloadType == "multi") ? 'Download All':'Download';
	var div = document.createElement('div');
			div.className += 'download show-tablet show-desktop block';
			div.style = "background-color: #3a4050; border-left: 1px solid #1a1c22;";
	var a = document.createElement('a');
			a.href = "#";
			a.style = "color: #fff; text-decoration: none; padding: 15px 20px 15px 10px;";
			a.innerHTML = '<i class="fa fa-arrow-down icon-inline" style="color: #242730;"></i>'+ downloadText;
			a.onclick = downloadHandler;
	var bar = document.createElement('div');
			bar.innerHTML = `<div class="loading-bar" style="position: absolute; right: 0px; top: 50px; background-color: aliceblue; display: none;">
				<center class="value" style="position: absolute; left: 0px; right: 0px; color: #242730;">0%</center>
				<div class="progressbar" style="width: 0%; height:20px; background-color: #b1c6ff;"></div>
			</div>`;
	div.append(a);
	document.querySelector('#top-menu > div.top-menu-right').append(div);
	bar.querySelector('.loading-bar').style.width = document.querySelector('#top-menu > div.top-menu-right .download').clientWidth+'px';
	document.querySelector('#content').append(bar);
}

function updateProgressbar(status, hide) {
	status = (typeof status === "string") ? status:status+'%';
	if(hide) {
		document.querySelector('.loading-bar').style.display = 'none';
	} else {
		document.querySelector('.loading-bar').style.display = '';
		document.querySelector('.loading-bar .value').innerText = status;
		document.querySelector('.loading-bar .progressbar').style.width = status;
	}
}

function downloadHandler(e) {
	e.preventDefault();
	e.stopPropagation();
	if(document.querySelector('.loading-bar').style.display !== "none") return;

	if(downloadType == "multi") {
		downloadAll();
	} else {
		downloadComic();
	}
}

function downloadComic(container) {
	var imageContainers = (container) ? container:document.querySelectorAll('.gallery .c-tile:not(.image-a)');
	var images = [];
	var doneLength = 0;
	var isImageAlbum = !!imageContainers[0].attributes.href.value.match(/comics\/picture\//i);

	if(!container) updateProgressbar(0);
	if(isImageAlbum) progress.pages.items += imageContainers.length;
	if(isImageAlbum) progress.items++;

	for(var i=0; i < imageContainers.length; i++) {
		images.push({href: location.protocol +'//'+ location.hostname + imageContainers[i].attributes.href.value});

		getPageImage(i, images[i], function(j, object) {
			images[j].path = object.path;
			images[j].name = object.name;
			images[j].imageHref = object.imageHref;
			images[j].blob = object.blob;
			doneLength++;

			if(!container) {
				updateProgressbar(Math.round((doneLength/imageContainers.length)*100));
			} else if(isImageAlbum) {
				if(j === 0) progress.current++;
				progress.pages.current++;
				updateProgressbar(Math.round((progress.pages.current/progress.pages.items)*100));
			}

			if(doneLength >= imageContainers.length) createZip(images);
		});
	}
}

function downloadAll(container) {
	var itemContainers = (container) ? container:document.querySelectorAll('.gallery .c-tile:not(.image-a)');
	var pagination = document.querySelector('.pagination');
	// var pagination = false; //Disabled
	var items = [];
	var doneLength = 0;

	var downloadFunc = function(albumContainer) {
		//console.log(albumContainer)
		var imagebox = albumContainer.querySelectorAll('.gallery .c-tile:not(.image-a)');
		var isImageAlbum = !!imagebox[0].attributes.href.value.match(/comics\/picture\//i);

		if(isImageAlbum) {
			downloadComic(imagebox);
		} else {
			downloadAll(imagebox);
		}
	};

	if(pagination && !container) {
		var lastHref = pagination.querySelector('span:last-child a').attributes.href.value;
		var pageCount = parseInt(lastHref.match(/[0-9]+$/)[0]);
		var urls = [];
		for(let i=1; i <= pageCount; i++) {
			urls.push(location.protocol +'//'+ location.hostname + lastHref.replace(/[0-9]+$/, i));
		}
		getImageAlbum(urls, downloadFunc);
	} else {
		if(!container) updateProgressbar(0);

		for(let i=0; i < itemContainers.length; i++) {
			if(!itemContainers[i].attributes.href || itemContainers[i].attributes.href.value == "") continue;
			let href = location.protocol +'//'+ location.hostname + itemContainers[i].attributes.href.value;
			getImageAlbum(href, downloadFunc);
		}
	}
}

function getImageAlbum(url, callback) {
	if(typeof url === "object" && url.length) {
		for(var i=0; i < url.length; i++) {
			getImageAlbum(url[i], function(pageContainer) {
				var items = pageContainer.querySelector('.gallery').innerHTML;
				containerArray.push(items);

				if(containerArray.length >= url.length) {
					var container = document.implementation.createHTMLDocument().documentElement;
					container.innerHTML = '<div class="gallery">' + containerArray.join('') + '</div>';
					callback(container);
				}
			});
		}
	} else {
		var xhr = new XMLHttpRequest();
				xhr.open('GET', url);
				xhr.onload = function(e) {
					var container = document.implementation.createHTMLDocument().documentElement;
	      	container.innerHTML = xhr.responseText;
					callback(container);
				};
				xhr.send();
	}
}

function getPageImage(i, image, callback) {
	var decodePublic = function(t) {
		return "!" === (e = t.replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&")).charAt(0) ? e.substr(1).replace(/[\x21-\x7e]/g, function(t) {
			return String.fromCharCode(33 + (t.charCodeAt(0) + 14) % 94);
		}) : "";
	};

	var object = {};
	var xhr = new XMLHttpRequest();
		xhr.open('GET', image.href);
		// xhr.responseType = 'blob';
		xhr.onload = function(e) {
			var container = document.implementation.createHTMLDocument().documentElement;
				container.innerHTML = xhr.responseText;

			var data = JSON.parse(decodePublic(container.querySelector("#ractive-public").innerHTML.trim()));
			var ext = data.picture.normalizedPath.match(/\..*?$/i);

			object.path = image.href.match(/^.*?(picture|album)\/.*?\/(.*\/).*$/i)[2]; // including author
			// object.path = image.href.match(/^.*?[0-9]+\/.*?\/(.*\/).*$/)[1]; 		// no author
			//object.name = container.querySelector('.top-menu-breadcrumb li:last-of-type').innerText.trim(); //+ container.querySelector('#imageName').value.match(/\.([0-9a-z]+)(?:[\?#]|$)/i)[0];
			//object.name = data.picture.name + ext;
			object.name = data.picture.name + ".jpg";
			//object.imageHref = 'https://www-8muses-com.cdn.ampproject.org/i/www.8muses.com/image/fl' + container.querySelector('#imageDir').value + container.querySelector('#imageName').value;
			//object.imageHref = 'https://www.8muses.com/image/fl/' + data.picture.publicUri + ext;
			object.imageHref = 'https://www.8muses.com/image/fl/' + data.picture.publicUri + ".jpg";
			console.log(object);
			getImageAsBlob(object.imageHref, function(blob) {
				if(!blob) return;
				object.blob = blob;
				callback(i, object);
			});
	};
	xhr.send();
}

function getImageAsBlob(url, callback) {
	GM_xmlhttpRequest({
	    url: url,
	    method: 'GET',
	    responseType: 'blob',
	    onload: function(xhr) {
	        var blob = xhr.response;

	        callback(blob);
	    }
	});

	// Non-GM CORS xhr request.
	// var xhr = new XMLHttpRequest();
	// 		xhr.open('GET', 'https://cors-anywhere.herokuapp.com/'+object.imageHref);
	// 		xhr.responseType = 'blob';
	// 		xhr.onload = function(e) {
	// 			var blob = xhr.response;
	//			callback(blob);
	// 		}
	// xhr.send();
}

function createZip(images) {
	var filename = getFileName(images[0].path);
	var zip = new JSZip();

	// Generate single or multiple zip files.
	if(Settings.singleFile && progress.current > 0) {
		if(Settings.compressSubFolders) {
			for(let i=0; i < images.length; i++) {
				zip.file(images[i].name, images[i].blob);
			}
			generateZip(zip, filename, function(blob, filename) {
				zipArray.push({name: filename, blob: blob});
				progress.zips++;
				if(progress.zips === progress.items) {
					var singleZip = new JSZip();
					for(let i=0; i < zipArray.length; i++) {
						singleZip.file(zipArray[i].name, zipArray[i].blob);
					}
					generateZip(singleZip, filename.match(/\[(.*)\]/)[1], function(blob, filename) {
						saveAs(blob, filename);
					});
				}
			});
		} else {
			for(let i=0; i < images.length; i++) {
				zipArray.push({name: filename +'/'+ images[i].name, blob: images[i].blob});
				// zip.file(images[i].name, images[i].blob);
			}

			if(progress.pages.current === progress.pages.items) {
				var singleZip = new JSZip();
				for(let i=0; i < zipArray.length; i++) {
					singleZip.file(zipArray[i].name, zipArray[i].blob);
				}
				generateZip(singleZip, filename.match(/\[(.*)\]/)[1], function(blob, filename) {
					saveAs(blob, filename);
				});
			}
		}
	} else {
		for(let i=0; i < images.length; i++) {
			zip.file(images[i].name, images[i].blob);
		}
		generateZip(zip, filename, function(blob, filename) {
			saveAs(blob, filename);
		});
	}
}

// function generateZip(zip, filename, callback) {
// 	zip.generateAsync({type:"blob"}).then(function (blob) {

// 	if(progress.pages.current === progress.pages.items) updateProgressbar('Done!');
// 	if(typeof callback === 'function') callback(blob, filename+'.zip');
// 	}, function (err) {
// 	    console.error('Error saving zip: ' +err);
// 	});
// }

function generateZip(zip, filename, callback) {
	zip.generateInternalStream({type:"blob", streamFiles: true})
	.accumulate(function updateCallback(metadata) {
			// console.log(metadata);
			updateProgressbar(metadata.percent);
	    // metadata contains for example currentFile and percent, see the generateInternalStream doc.
	}).then(function (blob) {
		if(typeof callback === 'function') callback(blob, filename+'.zip');
		if(progress.pages.current === progress.pages.items) updateProgressbar('Done!');
	    // data contains here the complete zip file as a uint8array (the type asked in generateInternalStream)
	});
}

function getFileName(pathname) {
	var pathArray = pathname.replace(/\/$/, '').split('/');
	var filename = "";

	for(var i=0; i<pathArray.length; i++) {
		let partialName;

		if(i === 0)	partialName = '['+ pathArray[i] +']';
		if(i === 1) partialName = pathArray[i];
		if(i >= 2) partialName = ' - '+ pathArray[i];

		filename += partialName;
	}

	return filename;
}

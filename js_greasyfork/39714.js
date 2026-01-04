// ==UserScript==
// @name        file saver
// @namespace   https://greasyfork.org/users/174399
// @description library for save various data into file
// @version     0.1.0
// ==/UserScript==

function saveFile(name, source)
{
	var a = document.createElement('a');
	a.download = name;
	a.href = source;
	document.body.appendChild(a);
	a.click();
	a.parentNode.removeChild(a);
}
function createFile(data, type){return createResource(new Blob([data], {type: type}));}
function createResource(blob)
{
	var wurl = window.URL || window.webkitURL,
		resource = wurl.createObjectURL(blob);
	setTimeout(function(){wurl.revokeObjectURL(resource);}, 1e4);
	return resource;
}
function createBlob(base64, type, len)
{
	len = len || 1024;
	var bytes = [];
	for(var offset = 0, charString = atob(base64), chunk, chunkBytes; offset < charString.length; offset += len)
	{
		chunk = charString.slice(offset, offset + len);
		chunkBytes = new Array(chunk.length);
		for(var i = 0; i < chunk.length; ++i)
			chunkBytes[i] = chunk.charCodeAt(i);
		bytes.push(new Uint8Array(chunkBytes));
	}
	return new Blob(bytes, {type: type});
}
function saveData(name, data, type){saveFile(name, createFile(data, type));}
function saveBlob(name, blob){saveFile(name, createResource(blob));}
function saveBase64(name, base64, type){saveBlob(name, createBlob(base64, type));}
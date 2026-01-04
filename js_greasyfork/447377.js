// ==UserScript==
// @name         Nhentai Tachiyomi Tag
// @namespace    https://greasyfork.org/en/users/175554-reissfeld
// @version      1.0
// @description  get tachiyomi tag from site to add them locally
// @author       Reissfeld
// @match        https://nhentai.net/g/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nhentai.net
// @license      GNU-V3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447377/Nhentai%20Tachiyomi%20Tag.user.js
// @updateURL https://update.greasyfork.org/scripts/447377/Nhentai%20Tachiyomi%20Tag.meta.js
// ==/UserScript==

var a = document.createElement('a');
a.id = 'download'
a.className = 'btn btn-secondary'
a.textContent = 'JSON'
a.setAttribute('onclick',"myFunction()")
document.querySelector('.buttons').append(a)

var script = document.createElement('script');
script.textContent = myFunction+selectText+dllink
document.body.append(script)

var jeson = document.createElement('div');
jeson.id = 'JSON'
jeson.style.display = 'none'
document.getElementById("info").append(jeson)

var tachis = `
<div class="tag-container field-name">Status:
<input type="radio" id="status" name="status" value="1"> Ongoing
<input type="radio" id="status" name="status" value="2" checked="checked"> Completed
</div>
<div class="tag-container field-name">Description:<br>
<textarea type="text" id="description" placeholder="Adds description"></textarea>
`
document.getElementById("tags").innerHTML += tachis

function selectText() {
  const input = document.getElementById('output');
  input.focus();
  input.select();
}
function myFunction(){

    if(document.getElementById("JSON").style.display == 'none'){
        document.getElementById("JSON").style.display = 'inherit'
    }else{
        document.getElementById("JSON").style.display = 'none'
    }

	var genre = document.querySelectorAll('.tags')[2].querySelectorAll('.name')//array
	var genreall = []
	for(let i=0;i<genre.length;i++){
		genreall.push(genre[i].textContent)
	}

	var json = {
		title : document.querySelector('.title .pretty').textContent,
		author : document.querySelectorAll('.tags')[3].querySelector('.name').textContent,
		artist : document.querySelectorAll('.tags')[3].querySelector('.name').textContent,
        "description": document.querySelector('.tag-container #description').value,
		genre : genreall,
		status : document.querySelector('input[name="status"]:checked').value
	}

	document.getElementById("JSON").innerHTML = '<textarea type="text" id="output" cols="40" rows="40" readonly="readonly" style="resize: none;" onclick="this.focus();this.select();">'+JSON.stringify(json,null,4)+'</textarea><br><button onclick="selectText()">Select text</button><button onclick="dllink()">Download json</button>';
}
function dllink(){
    //https://www.codegrepper.com/code-examples/javascript/select+text+for+copy+javascript
    var textcontent = document.getElementById("output").value;
    var downloadableLink = document.createElement('a');
    downloadableLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(textcontent));
    downloadableLink.download = "details.json";
    document.body.appendChild(downloadableLink);
    downloadableLink.click();
    document.body.removeChild(downloadableLink);
}
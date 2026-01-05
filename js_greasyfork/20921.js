// ==UserScript==
// @name			Get Random Anime
// @namespace		cloaknsmoke
// @description		Gets the MAL page of a random anime, not on your list. Based on pendevin's script.
// @include			http://myanimelist.net/animelist/*
// @version			1.01
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/20921/Get%20Random%20Anime.user.js
// @updateURL https://update.greasyfork.org/scripts/20921/Get%20Random%20Anime.meta.js
// ==/UserScript==

var XHR=
{
	// r.doc is the returned page
	// r.respose is the response element
	createDoc:function(response,callback,optional)
	{
		var doc = document.implementation.createDocument('','',null);
		var html = document.createElement("html");
		html.innerHTML = response.responseText;
		doc.appendChild(html);
		var r = {};
		r.response = response;
		r.doc = doc;
		callback(r,optional);
	},

	//sends the XHR request, callback is the function to call on the returned page
	get:function(url,callback,optional)
	{
		if(optional == undefined) optional = null;
		var xmlhttp = new XMLHttpRequest();
		//200 on a good page, 404 otherwise
		xmlhttp.onreadystatechange = function ()
		{
			if (xmlhttp.readyState == 4) 
				if(xmlhttp.status == 200)
					XHR.createDoc(xmlhttp, callback, optional);
				else
					callback(null)
		}
		xmlhttp.open('GET', url, true);
		xmlhttp.send();
	}
}

//get me a random show that isn't on the current list
function getAnime(e)
{
	e.preventDefault();
	count = 0
	//give the user some feedback to show that it's doing something
	//because sometimes it takes a while
	e.target.textContent = "Searching..."
	var status = document.createElement("div")
	status.textContent = ""
	e.target.parentElement.appendChild(status)
	//ignore the shows on this page
	var titles = document.getElementsByClassName('link sort');
	var ignore = [];
	for(var i = 0; i < titles.length; i++)
	{
		if(titles[i].href == undefined || titles[i].href.match(/\/(\d+)\//) == null)
			continue
		ignore[i] = parseInt(titles[i].href.match(/\/(\d+)\//)[1]);
	}
	XHR.get('http://myanimelist.net/anime.php?o=9',findLatest);

	//lol all we get from this page is that latest anime added
	function findLatest(r)
	{
		var max = parseInt(r.doc.getElementsByTagName('strong')[0].parentNode.href.match(/\/(\d+)\//)[1]);
		findRandom();

		//time for some actual random numbers
		function findRandom()
		{
			var random = Math.round(Math.random() * max);
			//if this number is on the ignore list, try again
			for(var i = 0; i < ignore.length; i++)
			{
				if(random == ignore[i])
				{
					findRandom();
					return;
				}
			}
			//otherwise, check to see if this is a real anime entry
			XHR.get('http://myanimelist.net/anime/'+random, checkShow);

			//validate show & display result
			function checkShow(r)
			{
				//is this a valid entry?
				if(r == null || r.doc.getElementsByTagName('h1')[0].textContent == 'Invalid Request')
				{
					ignore.push(random);
					count++
					//more user feedback to show it's working
					if(count == 1)
						status.textContent = "Found " + count + " bad entry."
					else
						status.textContent = "Found " + count + " bad entries."
					findRandom();
				}
				else
					window.location.href = 'http://myanimelist.net/anime/'+random+'/'+r.doc.getElementsByTagName('h1')[0].lastChild.textContent.replace(/\s/g,'_')+'/';
			}
		}
	}
}

var link = document.createElement('a');
link.href = '#';
link.textContent = 'Get Random Anime';
var place = document.getElementsByClassName("header")[0]
place.appendChild(link);
link.addEventListener('click', getAnime, false);
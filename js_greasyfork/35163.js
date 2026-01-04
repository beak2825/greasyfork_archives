// ==UserScript==
// @name			test
// @namespace		cloaknsmoke
// @description		something
// @include			http://boards.endoftheinter.net/showmessages.php*
// @include			http://archives.endoftheinter.net/showmessages.php*
// @include			https://boards.endoftheinter.net/showmessages.php*
// @include			https://archives.endoftheinter.net/showmessages.php*
// @require			https://apis.google.com/js/api.js
// @grant			none
// @version			2
// @downloadURL https://update.greasyfork.org/scripts/35163/test.user.js
// @updateURL https://update.greasyfork.org/scripts/35163/test.meta.js
// ==/UserScript==
console.log("checkpoint1")
var scr = document.createElement("script")
scr.type = "text/javascript"
scr.async = "async"
scr.src = "https://apis.google.com/js/api.js"
scr.onload = doTest
document.getElementsByTagName("head")[0].appendChild(scr)
function doTest()
{
	console.log("checkpoint1.5")
	//setup google api stuff
	gapi.load('client', {
		callback: function() {
			// Handle gapi.client initialization.
			gapi.client.init(
			{
				'apiKey': 'AIzaSyCzs74Ee7uQgY7NN6SZmYTHVBLWIC1TiB0',
				'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
			})
		},
		onerror: function() {
			// Handle loading error.
			console.log('gapi.client failed to load!');
		},
		timeout: 5000, // 5 seconds.
		ontimeout: function() {
			// Handle timeout.
			console.log('gapi.client could not load in a timely manner!');
		}
	})
	console.log("checkpoint2")
	function createResource(properties) 
	{
		var resource = {};
		var normalizedProps = properties;
		for (var p in properties) 
		{
			var value = properties[p];
			if (p && p.substr(-2, 2) == '[]') 
			{
				var adjustedName = p.replace('[]', '');
				if (value) 
					normalizedProps[adjustedName] = value.split(',');
				delete normalizedProps[p];
			}
		}
		for (var p in normalizedProps) 
		{
			// Leave properties that don't have values out of inserted resource.
			if (normalizedProps.hasOwnProperty(p) && normalizedProps[p]) 
			{
				var propArray = p.split('.');
				var ref = resource;
				for (var pa = 0; pa < propArray.length; pa++) 
				{
					var key = propArray[pa];
					if (pa == propArray.length - 1) 
						ref[key] = normalizedProps[p];
					else
						ref = ref[key] = ref[key] || {};
				}
			};
		}
		return resource;
	}
	console.log("checkpoint3")
	function executeRequest(request) 
	{
			request.execute(function(response) 
			{
				console.log(response);
			});
	}
	console.log("checkpoint4")
	function buildApiRequest(requestMethod, path, params, properties) 
	{
		var request;
		if (properties) 
		{
			var resource = createResource(properties);
			request = gapi.client.request(
			{
				'body': resource,
				'method': requestMethod,
				'path': path,
				'params': params
			});
		} else 
		{
			request = gapi.client.request(
			{
				'method': requestMethod,
				'path': path,
				'params': params
			});
		}
		executeRequest(request);
	}
	console.log("checkpoint5")
	var links = document.getElementsByTagName("a")
	for(var i=0; i<links.length; i++)
	{
		if(links[i].href.indexOf("youtube") != -1)
		{
			var id = links[i].href.substring(links[i].href.indexOf("v=") + 2, links[i].href.indexOf("v=") + 13)
			buildApiRequest('GET',
							'/youtube/v3/videos',
							{'id': 'Ks-_Mh1QhMc',
							'part': 'snippet,contentDetails,statistics'})
			//links[i].innerHTML = "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/" + id + "\" frameborder=\"0\" allowfullscreen></iframe>"
		}
	}
}
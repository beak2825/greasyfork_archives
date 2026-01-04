// ==UserScript==
// @name         Tag Preview
// @version      2.02
// @description  Show tags on hover.
// @author       Hauffen
// @runat        document-start
// @include      /https?:\/\/(e-|ex)hentai\.org\/.*/
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @namespace    https://greasyfork.org/users/285675
// @downloadURL https://update.greasyfork.org/scripts/380917/Tag%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/380917/Tag%20Preview.meta.js
// ==/UserScript==

(function() {
	let $ = window.jQuery, tags = {};
	const elem = {0: '.gl3m a', 1: '.gl3m a', 2: '.gl3c a', 4: '.gl3t a'};
    const defaultNamespace = "misc";
	const spl = document.URL.split('/');
	var element, title;

	if ((spl[3].substr(0, 1).match(/[?#fptw]/i) && !spl[3].startsWith('toplist')) || !spl[3]) {
        if ($('#tagPreview')) return;
		var $tagP = $('<div id="tagPreview">');
		$tagP.css({
			position: 'absolute',
			zIndex: '2',
			visiblility: 'hidden !important',
			maxWidth: '400px',
			background: window.getComputedStyle(document.getElementsByClassName('ido')[0]).backgroundColor,
			border: '1px solid #000',
			padding: '10px'
		});
		$tagP.appendTo("body");
		$('#tagPreview').css('visibility', 'hidden');

		element = elem[$(".searchnav div > select > option:selected").index()];

		$('.itg').on('mouseover', `${element}`, function(e) {
			if(document.getElementById('tagPreview').children.length > 2) { $tagP.empty(); }

            title = this.children[0].title; // Save the title so we can put it back later, probably unnecessary
            this.children[0].title = ""; // Clear the title so we don't have it over our new window

			var str = this.href.split('/');
			generateRequest(str[4], str[5]);

			var posY, posX = (e.pageX + 432 < screen.width) ? e.pageX + 10 : e.pageX - 412;
			var scrollHeight = $(document).height();
			var scrollPosition = $(window).height() + $(window).scrollTop();

			if ((scrollHeight - scrollPosition) < (scrollHeight / 10)) { posY = (e.pageY + 300 < scrollHeight) ? e.pageY + 10 : e.pageY - 300; }
			else { posY = e.pageY + 10; }

			$tagP.css({
				left: posX,
				top: posY,
				border: '1px solid ' + window.getComputedStyle(document.getElementsByTagName("a")[0]).getPropertyValue("color"),
				visibility: 'visible'
			});
			$('#tagPreview').css('visibility', 'visible');
		}).on('mousemove', `${element}`,function(e) {
			var posY, posX = (e.pageX + 432 < screen.width) ? e.pageX + 10 : e.pageX - 412;
			var scrollHeight = $(document).height();
			var scrollPosition = $(window).height() + $(window).scrollTop();

			if ((scrollHeight - scrollPosition) < (scrollHeight / 10)) { posY = (e.pageY + document.getElementById('tagPreview').offsetHeight < window.innerHeight) ? e.pageY + 10 : e.pageY - 10 - document.getElementById('tagPreview').offsetHeight; }
			else { posY = e.pageY + 10; }

			$tagP.css({
				visibility:'visible',
				top: posY,
				left: posX
			});
			$('#tagPreview').css('visibility', 'visible');
		}).on('mouseout', `${element}`, function() {
            this.children[0].title = title; // Put the saved title back
			$tagP.css({
				visibility:'hidden'
			});
			$('#tagPreview').css('visibility', 'hidden');
			$tagP.empty(); // Clear out the tag
		});

		$(document).on('scroll', function() {
			$('#tagPreview').css('visibility', 'hidden');
		});
	} else {
		return;
	}

	/**
	 * Generate the inner HTML for the tag preview window
	 * @param {JSON} apirsp - The E-H API response
	 */
	function generateListing(apirsp) {
        generateTags(apirsp); // We actually have to generate the tag list from the raw JSON file
		$('#tagPreview').append(`<h1 id="gn">${apirsp.title}</h1><h1 id="gj">${apirsp.title_jpn}</h1>`);
		let taglist = "<div id='taglist' style='height:fit-content;'><table><tbody>";
        for (const namespace in tags) {
            taglist += `<tr><td class="tc">${namespace}:</td><td>`;
            for (var i = 0; i < tags[namespace].length; i++) {
                taglist += `<div id="td_${namespace}:${tags[namespace][i]}" class="gt" style="opacity:1.0"><a id="ta_${namespace}:${tags[namespace][i]}" href="${document.location.origin}/tag/${namespace}:${tags[namespace][i]}">${tags[namespace][i]}</a></div>`;
            }
            taglist += "</td></tr>";
        }
        taglist += "</tbody></table></div>";
        $('#tagPreview').append(taglist);
	}

	/**
	 * Converts the tag listing within the API response to a categorized array
	 * @param {JSON} apirsp - The E-H API response
	 */
	function generateTags(apirsp) {
        tags = {}; // Reset the tags array for each new tag listing
		if (Array.isArray(apirsp.tags)) {
			for (const jsonTag of apirsp.tags) {
				const stringTag = getJsonString(jsonTag);
				if (stringTag === null) { continue; }

				const {tag, namespace} = getTagAndNamespace(stringTag);

				let namespaceTags;
				if (tags.hasOwnProperty(namespace)) { namespaceTags = tags[namespace]; }
                else {
					namespaceTags = [];
					tags[namespace] = namespaceTags;
				}
				namespaceTags.push(tag);
			}
		}
	}

	/**
     * Generate the JSON request for the E-H API
	 * @param {Integer} gid - The gallery ID
	 * @param {String} token - The gallery token
     */
    function generateRequest(gid, token) {
        var reqList = [[gid, token]]; // We use an array for our gidlist, since the API can handle up to 25 galleries per request
        var request = {"method": "gdata", "gidlist": reqList, "namespace": 1};

        var req = new XMLHttpRequest();
        req.onreadystatechange = e => {
            if (req.readyState == 4) {
				if (req.status == 200) {
					var apirsp = JSON.parse(req.responseText);
					for (var i = 0; i < apirsp.gmetadata.length; i++) generateListing(apirsp.gmetadata[i]);
				} else { console.error(); }
			}
        }
        req.open("POST", document.location.origin + "/api.php", true); // Due to CORS, we need to use the API on the same domain as the script
        req.send(JSON.stringify(request));
    }

	// Helper functions
	function getTagAndNamespace(tag) {
		const pattern = /^(?:([^:]*):)?([\w\W]*)$/;
		const match = pattern.exec(tag);
		return (match !== null) ?
			({ tag: match[2], namespace: match[1] || defaultNamespace }) :
			({ tag: tag, namespace: defaultNamespace });
	}

	function toProperCase(text) {
		return text.replace(/(^|\W)(\w)/g, (m0, m1, m2) => `${m1}${m2.toUpperCase()}`);
	}

	function getJsonString(value) {
		if (typeof(value) === "string") { return value; }
		if (typeof(value) === "undefined" || value === null) { return value; }
		return `${value}`;
	}
})();
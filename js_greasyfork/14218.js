// ==UserScript==
// @name        8chan Infinity Next Reverse Image Search
// @namespace   https://greasyfork.org/users/12245
// @description Add google, tineye, iqdb and saucenao reverse image search to 8ch.net Infinity Next and all subdomains
// @include     https://8ch.net*
// @include     http://8ch.net*
// @include     https://*.8ch.net*
// @include     http://*.8ch.net*
// @version     1.03
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/14218/8chan%20Infinity%20Next%20Reverse%20Image%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/14218/8chan%20Infinity%20Next%20Reverse%20Image%20Search.meta.js
// ==/UserScript==

$('document').ready(function () {
	var imageSearchURI = [['https://www.google.com/searchbyimage?&image_url=','<img  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAA+VBMVEVFi/9Fi/9Fi/8adfMadvMnefMne/MoevMpevMqevMqe/MrevMre/Mse/Mte/MvfPMvffQwfPMwffMyffMzfvM0fvM0f/Q1f/Q1gfQ2f/Q2gfQ3gPQ4gPQ4gvQ5gPQ6gfQ7gvQ8gvQ9gvQ9g/Q+g/RAhPRBhPRChfRCh/RGifRlmvZnnPZrnfZwoPZxoPZ6p/d8qPeDrPeGrviHrveIr/eWuPiZuficvfmgwfqhwPmlw/mnxPmqxfm60fq70Pq+1fvA1fvE2PvH2fvI2fvI2vvI3PzL3vzR4PzT4v3f6v3g6v3k7f3k7v7z+P72+f/3+//6/f/8/v////8vkc0VAAAAA3RSTlNQUe3r0Ri+AAAAqUlEQVQY01XPxQKCQACE4QW7UHQxMRB17O7uAhX3/R/Gg4g6t/luPyE8fsYT82cyYQdVAPAEABCajnW27SsACADEFnPBpu19+ICbdbLZHnNZ4GHLgFJ7CBbII9Z2buqqBaDVCWtJ+EJOtLNrsmCB2F2N50+jUjQhNdO8shS/7agJAWMYBRKD0wci53tZoI5LI29CKb1m+vHQlAGA8ABKkj9IJfWdy/3ncy+Q4ybLEeuUcQAAAABJRU5ErkJggg=="/>'],['https://www.tineye.com/search?pluginver=bookmark_1.0&url=','<img  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAztJREFUOI1t0FtMm3UcxvHve+gBxmtboKUwYFRcEIcIRZAdssU4yUxELzC7cnGJLNmFMVmiu3EavULmRBMvPMRDvFJjcFuUZHNG2RYy1mlmSGtSFNYMXuhKy+FtS9u37fv3YsFD9Ll/Pr9fHunZi+KAWcif9kS+6NNtzZiyg/+LKJdw2lUURaFQstDu7QnZHc6T0pMfR5afSp/1D6x9zfV0DZ82vY5AAsDtlJmdHEcPT5NfW8ahSEjlErs62tl95CTO+ra4ahqr/trUz2SMJG5hIZCQgHafg3NnThD7deqvL9LAvvY62h5/gvDCHBX6nF8F+Nx9HClsse3AMXyag65GO9e+epc2fYqhHvBUOXFWaVQ5FGyPHWPmocPct7lKIZ9DBcgp21ir6aXP7SZQLzOtx+l5dD/BfT6yrgBpy4FRlEmk8ySyFiI0gSyBKsl3AYDWjiDFRJhZVxetjX7mwwtcieRI6RdYXV7AWLnD9h0tNNTXc2PqMjljHVVV/wb8Pi8JI4fPKvD9Gy/jdbuxV1Zy49K3ICxc3jo++vADOne18+X4OZ5/7gjlbA4Gxq6KgbGr4rXzEXFi4hfR0v2I6OjsEpl8QQghxOh77wtkRew5eEj8M4ePDgtAyEIIymWLwkaKVDxObOYmvf27yacNYrEYL71wnJ7+vaQNg2uhEM8MDQHw9OAgALKxliG9niG+uEA2m6G6OcCtW/OMvv0Or546hQwEu7uYDc8Qif5BMBgEILe5eRcQQgAQF166WlroP/oik5cusr5hMPrmCKZp8lskTGEzw+mRER7u38OPP00yduYt3PVNSH2vTIitIffe76O6tZbL333DykyIwYGD6LF5zp8dx1lRieKspLopgKehGa2hiYbOvn8DAPsfqKNlZx1LRYtEMkm5aKJp92BzViCrKpZloSoKdRV25I3MfwEAp03hwWYXjX4XmkfDUkCyBLKwKOWLrNxJktJ1lqI3Ue2aVzfTK9u3yjW1VezwKNjySVajvzM3H2EpkUJWFEqmiVksMTcb4XZ0BmGVdNW9s3d4NTr9mWRu+Ht6m/H7NZBkSiKAaayhqTkKP3zC9ds5XB4P+uLi1q14Nwz/CSquccJ7otKkAAAAAElFTkSuQmCC"/>'],['http://iqdb.org/?url=','<img  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAA3NCSVQICAjb4U/gAAADF0lEQVQokQXBW0xbZQAA4POf/z89PUB7Tnt6A1rX0pWLy4ByJqKbW2VjYIabhsR5SYz46IMak/nig1EfXEbiiz6qD8ZLZNG4ZHFqjBmLipksMMALF9na0Y5yeqDn0vP33P0+cPWbywtzc4Rj2rYNCBCgfZAkDNPaqcslUfvgzW6vadG1uzPfW3E++tLLL6B9STGxEmDaKAJYjiupDVGRWT8VpOE7T5Li7dV0KuoFopvb/6xsabHwd+C91171LEwCUpJxe8iQFIOGLMvQFPQMTzx3tJUhsIWbqMXfGbab7a8g0jZcD0h1/Pp0xDHxh1/WbKvBILBeFnVszq9oXSHt6SH6r7Lq+LKq9RE8IeS1hjn1VEcsxl94/9azE0IbcnXHIBHIZDp//vW66bYtbjNS0zdWGHru/BR8bHAA0fjF5xPvXlwkPRSNRwqTkwgCgNAbM59deHuGDZLLf85DiH66sbSwtISMpj052lL6W1Jk0NMRXV1eFwZ6Tp58dGRi2sT1/kjl6PQljuN/nP2q6QDKH4DdXdnzvcrvG8ZG0cSWvFbcYWPxfmHo7FghxzshWM+EE8cnTn3y6RdjQtfujgjzPX1TA8YPC1g1KM81Jx7K3ilXTxSOtbq20Df4QChFcQGCdKMcxzvyE8fzSFTlegNW6xLHZHXsMhQYGex1mpj0CHP1NzJ1cPnr65HDGeHBjIekeCwM+w+mVu5BmsRrVV039GSy4+LsjfyRh5OJCOFCzXaYrf2Qr0WLcOF0TjcsOH5EuFUs2i6HgCmpekPTrs7Nz3/7+eBw5kB62E9BI5dgWHpbLCf5qI/jScLzemIdmiH3tid5pq1crT1+ajybJdT9MlHbdPbu8ZZY3vzjMOczdd2q3oW96ZSC8agQXb+/uVE2Eiy3t/1fPP9MmkKOvktY6qWPZ5M0WSmVgsFW98AheHr4EOtjzxbIM90oFHT/3SpJRotf2dm9X1uv1H5ZvnPt5pqq1PtGHskdG/VDgKbOjV++co0jvNWi1j+cswPppLr41pW9iiLDCqFis6+T47tyrZ1pD5AE8P4Hwyd3G3ScEUUAAAAASUVORK5CYII="/>'],['https://saucenao.com/search.php?db=999&url=','<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEUAAAD///+l2Z/dAAAAL0lEQVQI12NgYGCo/8fgwMQQIcUgY8HAV8DA/oCB+QAIARlALlAQKAVUAFTGwAAA3okJW9pvlV4AAAAASUVORK5CYII="/>']];
	var supportedExt = ['png','gif','jpg','jpeg'];
	var addLinks = function() {
		var link = []
		var imageLink = $(this).children('a').attr('href');
		if(supportedExt.indexOf(imageLink.split('.')[imageLink.split('.').length-1].split('?')[0]) > -1) {
			if (imageLink.substring(0,4) === 'http') {
				for (i = 0; i < imageSearchURI.length; i++) {
					link[i] = imageSearchURI[i][0] + imageLink;
				}
			} else {
				for (i = 0; i < imageSearchURI.length; i++) {
					link[i] = imageSearchURI[i][0] + document.domain + imageLink;
				}
			}
			for (i = 0; i < imageSearchURI.length; i++) {
				$(this).append('<span> </span><a href="' + link[i] + '">' + imageSearchURI[i][1] + '</a>');
			}
		}
	};
	$('div.attachment-container').each(addLinks);
	$(window).on('au-updated.ib-post', function (e, posts) {
		jQuery.each(posts, function(index, group) {
			jQuery.each(group, function(index, $post) {
				$post.find('div.attachment-container').each(addLinks);
			});
		});
	});
});
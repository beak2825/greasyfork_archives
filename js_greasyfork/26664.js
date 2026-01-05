// ==UserScript==
// @name        WaniKani User Post Blocker
// @namespace   ajpazder
// @description Replaces posts by blocked users with customizable images.
// @version     1.0.0
// @author      Johnathon Pazder
// @copyright   2017+, Johnathon Pazder
// @license     MIT; http://opensource.org/licenses/MIT
// @include     http://www.wanikani.com/chat/*/*
// @include     https://www.wanikani.com/chat/*/*
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26664/WaniKani%20User%20Post%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/26664/WaniKani%20User%20Post%20Blocker.meta.js
// ==/UserScript==

(function () {
	// Anyone you want to block, put their name in here like so: [ "user1", "user2" ]
	var blockedUsers = [ ];

	// Set your own custom replacement images here.  The defaults are a couple of data URLs for abstract
    // paragraph shapes.  They're embedded in the script to guarantee they'll always be available since
    // they don't depend on a 3rd party image host, but you can use images hosted online too.
	var replacementImages = [
        "data:image/gif;base64,R0lGODlh6AN7AIABAAAAAP///yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDA5NEQzNTZEREI4MTFFNjk2QjBFMTNBNEY1MTVEM0EiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDA5NEQzNTdEREI4MTFFNjk2QjBFMTNBNEY1MTVEM0EiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0MDk0RDM1NEREQjgxMUU2OTZCMEUxM0E0RjUxNUQzQSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0MDk0RDM1NUREQjgxMUU2OTZCMEUxM0E0RjUxNUQzQSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTDwsHAv769vLu6ubi3trW0s7KxsK+urayrqqmop6alpKOioaCfnp2cm5qZmJeWlZSTkpGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERAPDg0MCwoJCAcGBQQDAgEAACH5BAEAAAEALAAAAADoA3sAAAL/jI+py+0Po5y02ouz3rz7D4biSJbmiabqyrbuC8fyTNf2jef6zvf+DwwKh8Si8YhMKpfMpvMJjUqn1Kr1is1qt9yu9wsOi8fksvlMBqjX7Lb7DY/L5/S6/Y7P6/f8vv8PGCg4SFhoeIiYqLjI2Oj4CBkpWYc1aXmJmam5ydnp+QkaKjpKWrpZaZqqusra6voKGys7SzuKWoubq7vL2+v7CxwseitcbHyMnKy8zNxMSOwcLT1NXW19jW0Inc3d7f0NHi5euj1ufo6err5uXs7+Dh8vP0+v6l6Pn6+/z99Pd+8voMCBBAtaA2gwocKFDBuuQugwosSJFCsKgmgxo8aN/xwdYuwIMqTIkew+kjyJMqVKZiZXunwJM6arljJr2ryJExKanTx7+vwJNKjQoUSLGj2KNKnSpUybOn0KNarUqVSrWr2KNavWrVy7ev0KNqxYqjnLmj2LllqFtGzbun1bay3cuXTr2s0k967evXz79snrN7DgwX0BEz6MOLFZw4obO35MkjHkyZQrN5RsObPmzfgwc/4MOnQ4z6JLmz7NkgLq1axbFyPtOrbs2eRU076NO7cn2Lp7+/590Tbw4cSL7+FtPLly4MiXO38ue6z06dSrW7+OPbv27dy7e/8OPrz48eTLmz+PPr369ezbu38PvwH0+fQ/m6iPPz/k+/r7+/8XzN9/Ag5IV4AEHojgYiUkyGCDNRnoYIQSigThhBZeSFGFGG7IoUEadghiiPp8KGKJJpa04IkqrqgOiSy+CGM1LsZIY43JzGhjjjr2guOOPv4YS49ADklkbSQUiWSSD8XHZJNOPglllFJOSWWVVl6JZZZabslll15+CWaYYo5JZpkPKIlmmrM0p2abbmrC5ptyzulInHTeieczwuXJZ5+I2OlnoILGAeighhpa6KGK9pnooo7S2eijkrYZ6aSWJlnppZoCmemmnubY6aeiwhjqqKaeWOqpqoKY6qquXtjqq7I6aGattt6Ka6667sprr77+Cmywwg5LbLHGHotsssqFopfmss4+u0Gz0E5LbQTSVotttgdcq22303LrbbjKgituucWSa266wKKrbru7sutuvLbCK2+9Y9Jrb75e4qtvv1ny62/AVAIscMFPEmxwwvAhrHDD6zHscMTmQSxxxRZfjHHGGm/McccefwxyyCKPTHLJJp+Mcsoqr8xyyy6/DHPMMldXAAA7",
        "data:image/gif;base64,R0lGODlh6AN7AIABAAAAAP///yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Rjc3QUQzNUFEREI3MTFFNkE3QzJFQ0NEOEJFM0Y5NTAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Rjc3QUQzNUJEREI3MTFFNkE3QzJFQ0NEOEJFM0Y5NTAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGNzdBRDM1OEREQjcxMUU2QTdDMkVDQ0Q4QkUzRjk1MCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGNzdBRDM1OUREQjcxMUU2QTdDMkVDQ0Q4QkUzRjk1MCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTDwsHAv769vLu6ubi3trW0s7KxsK+urayrqqmop6alpKOioaCfnp2cm5qZmJeWlZSTkpGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERAPDg0MCwoJCAcGBQQDAgEAACH5BAEAAAEALAAAAADoA3sAAAL/jI+py+0Po5y02ouz3rz7D4biSJbmiabqyrbuC8fyTNf2jef6zvf+DwwKh8Si8YhMKpfMpvMJjUqn1Kr1is1qt9yu9wsOi8fksvlMBqjX7Lb7DY/L5/S6/Y7P6/f8vv8PGCg4SFhoeIiYqLjI2Oj4CBkpKbkzaXmJmam5ydnp+QkaKjpKWmqqV3mqusra6voKGys7S1tbm2qbq7vL2+v7CxwsbIs7bHyMnKy8zNzsnFn8LD1NXW19jZ3NGa3d7f0NHi4+7stNfo6err7O3n5n7h4vP09fb78Lf6+/z9/v/z8oH8CBBAsaPLhOIMKFDBs6fFhOB8SJFCtavAhKIcaN/xw7evz4RiPIkSRLmvwn8qTKlSxbfkvpMqbMmTR/wayJM6fOnaHQ+PwJNKjQoUSLGj2KNKnSpUybOn0KNarUqVSrWr2KNavWrVy7ev0KNqzYsWTLluGJNq3atbBIsH0LN67cSW7n2r2LN2+eunr7+v07ly/gwYQLzxRsOLHixRwRM34MOXJBx5IrW77sjjLmzZw7Z9PsObTo0cZAkz6NOnUs06pbu37tiTXs2bRrL5JtO7fu3ahG8P4NPLgd3MKLG4dN/Ljy5aKTM38OXbLZ6dSrW7+OPbv27dy7e/8OPrz48eTLmz+PPr369ezbu38PPz6H6PTrz65gP79+0vj3+///b1l/AA5IoGECFohggngdqGCDDqrF4IMSTngYBRReiGFLEWbIYYcYbehhiCIyBOKIJp7oT4korsiiPCq2CGOM5LwoY402YkPjjTruyEyOPP4IJDA+BklkkbQMaWSSSqoiX5NOPglllFJOSWWVVl6JZZZabslll15+CWaYYo5JZplhLokmmlqkyaaRa7YJ549vxkmnjXPWiWeLd+bJp4l79gloh38GSiiFgxaKaIOHJsoogYs2Cul+j0ZKKX2TVorpcpdmyqlwm3YK6m6fhkoqbaOWimprp6bKKn9mvgprrLLOSmuttt6Ka6667sprr77+Cmywwg5LbLEltIosKcaQqpBssxkti4Kz0m4D7QnTXotJtdZiy20k2prQbbiOfHusuOYmQq5z5647XLoisAuvIO6+G2+9fcwbgr369oavB/v+226/HQBMsBwC+1twwm0cPLDCDgPA8HwPKxzxBhNTXHEGFyeccccefwxyyCKPTHLJJp+Mcsoqr8xyyy6/DHPMMs9Mc80234xzzjrvHEUBADs="
	];

	blockedUsers.forEach(function (user) {
		// If a quote appears on the same page, we want to make sure
		// that its content matches an earlier post.  It just adds a
        // small bit of continuity between posts.
		var quotableImage;

		var posts = findPostsMadeByUser(user);
		posts.each(function () {
			var replacementImage = chooseRandomElementFromArray(replacementImages);
			var newContent = makeImgElement(replacementImage);
			$(this).html(newContent);

			// To make sure that the quote is of a post that precedes
			// it, we'll always use the first image chosen (because
			// that's just easier).
			if (!quotableImage) {
				quotableImage = replacementImage;
			}
		});

		// If the page is all quotes, we'll just pick a random replacement image.
		// No need for continuity here...
		if (!quotableImage) {
			quotableImage = chooseRandomElementFromArray(replacementImages);
		}

		var quotesOfUserPosts = findQuotesOfUser(user);
		quotesOfUserPosts.each(function () {
			var quoteHeader = $(this).find('.post-quote-author')[0].outerHTML;
			var newContent = quoteHeader + makeImgElement(quotableImage);
			$(this).html(newContent);
		});
	});

    function findPostsMadeByUser(user) {
        var allPosts = $('tr[id^=post]');
        var postsByUser = allPosts.filter(function () {
            return $(this).find(".username").text() == user;
        });
        var postsContent = postsByUser.find(".forum-post");

        return postsContent;
    }

    function findQuotesOfUser(user) {
        return $('.post-quote-author:contains(' + user + ')').parent();
    }

    function chooseRandomElementFromArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function makeImgElement(srcUrl) {
        return '<img alt="" src="' + srcUrl + '">';
    }
 }());
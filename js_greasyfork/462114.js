// ==UserScript==
// @name           NZBLNK for U4A
// @name:de        NZBLNK für U4A
// @namespace      http://tampermonkey.net/
// @version        1.7
// @description    Automatically inserts an NZBLNK for each post
// @description:de Fügt bei jedem Post automatisch einen NZBLNK ein
// @author         Tensai
// @copyright      Copyright 2023 by Tensai
// @license        MIT
// @match          http*://*.usenet-4all.pw/forum/show*
// @icon           https://usenet-4all.pw/favicon.ico
// @grant          unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/462114/NZBLNK%20for%20U4A.user.js
// @updateURL https://update.greasyfork.org/scripts/462114/NZBLNK%20for%20U4A.meta.js
// ==/UserScript==

window.addEventListener("load", () => {
    'use strict';

	// threshold value for old posts in days
	const oldPostThreshold = 0;

    // template for the nzblnk html code with %nzblnk% as placeholder for the actuall link and %uploadtime% for the upload time info
    const htmlButton =
`<font size="2" style="color:#d40000;font-weight:normal;"><b>NZBLNK&#0153;</b> <i>(automatisch erstellt)</i>:</font><br>
<div id="#NZBLNK_SCRIPT" style="margin: 5px 20px 20px 20px;color:initial;font-weight:normal;">
   <a title="Automatically created NZBLNK&#0153;" href="%nzblnk%"><img src="images/nzblnk-ezpost.png" alt="NZBLNK&#0153;" border="0"></a>
   %uploadtime%
</div>
<br />`;
    // template for the updated nzblnk info with %uploadtime% as placeholder for the upload time info
	const htmlInfo = `<font size="2" style="color:#d40000;font-weight:normal;"><b>[iNFO]</b></font> NZBLNK&#0153; im Post automatisch aktualisiert %uploadtime%`;
    // template for the upload time info with %nfotxt% as a placeholder for the text and %bottom% for the bottom margin
    const htmlUploadTime = ` <span size="2" style="font-style:normal;font-variant:small-caps;coolor:#ff8000;margin-left:4px;bottom:%bottom%px;line-height:2;padding-top:0px;padding-left:4px;padding-right:5px;position:relative;border-bottom:1px solid #ff8000;border-left:1px solid #ff8000;border-top:1px solid #ff8000;border-radius:6px 4px 4px 6px;background: linear-gradient(90deg, rgba(255,191,128,0.3) 0%, rgba(0,0,0,0) 100%)">UploadZeit %nfotxt%</span><br />`;

    // if we are not in the usenet stuff forum do nothing
    if (!document.querySelector('.navbar > a[href="forumdisplay.php?f=5"]')) {
        return;
    }

	// get all the posts from the site
	const posts = Array.prototype.slice.call(document.querySelectorAll('div')).filter(el => {
		return (el.id.match(/^post\d+/i) && el.querySelector('.forbg'));
	});
	// iterate through all the posts
	posts.forEach(post => {
		// callback function for the post observer
		const observer = new MutationObserver((list, observer) => {
			updatePost(post, observer);
		});
		// do the first check/update of the post
		updatePost(post, observer);
	});

	// the main function to check the post for nzblnk/header information
	function updatePost(post, observer) {
		// stop observing while we check/update the post
		observer.disconnect();

		// define the variables
		let title, header, password;

		// define the local postHtmlUploadTime variable
		let postHtmlUploadTime = htmlUploadTime;

		// search for already existing nzblnks
		const nzblnks = post.querySelectorAll('[href^="nzblnk"]');

		// if there is more than one nzblnk, we do nothing
		if (nzblnks.length > 1) {
			return;
		}

		// get the post date and check if it is an old post
		const postDate = Number(post.querySelector('.fortitel').getAttribute('data'));
		const isOldPost = (Date.now() - postDate)/1000 > 3600 * 24 * oldPostThreshold; // true if post is older than the threshold value

		// if there is no nzblnk, scrape the information from the post text
		if (nzblnks.length === 0) {
            // get the post test
            const postText = getPostText(post);

			// test if the post text contains a description for the header starting with some common words used for and ending with a colon or a vertical bar
			// we search for any text until we find it and then get all of it until the next line break
			// like this we will find the header information either if placed on the same line or if placed on the next line
			// we also take care of if the description is used twice (e.g. before the hidden tag and in the hidden tag again)
            const headers = [...postText.matchAll(/(?:^\s*(?:header|subje[ck]t|betreff) ?.*?(?::|\s)+)+"?(\S.*\S)"?$/gmi)];

			// if there is more than one header, we do nothing
			if (headers.length > 1) {
				return;
			// if theres is exactly one header and thanks button was clicked, we continue and search also for the title and password
			} else if (headers.length === 1 && !headers[0][1].startsWith('DANKE') && !headers[0][1].startsWith('You must click')) {
				// set the header to the text after the description
				header = headers[0][1];

                // test if the post text contains a NZB file name in the format of nzbfilename{{password}}
                // we first assume that the NZB file name is on its own line
                if (/^(.*){{(.*?)}}/m.test(postText)) {
                    // set the title and password according to the NZB filename
                    password = postText.match(/^(.*){{(.*?)}}/m)[2];
                    title = postText.match(/^(.*){{(.*?)}}/m)[1];
                    // check if maybe there is nevertheless a leading description and remove it from the title
                    // assuming that the leading description includes the word NZB and ends with a colon
                    if (/.*nzb.*:\s*/i.test(title)) {
                        title = title.replace(/.*nzb.*:\s*/i, "");
                    }
                } else {
                    // if no NZB file name was found the title and password have to be set by another way
                    // in this case simply set title to the first line of the postText
                    title = postText.split("\n")[0];
                    // fix for some old posts not containing the title as first line of the post
                    if (title.startsWith('Group') || title.length > 150) {
                        if (post.querySelector('.alt1 > .smallfont > strong')) {
                            // if the post title is set, use the post title
                            title = post.querySelector('.alt1 > .smallfont > strong').innerText.trim();
                        } else {
                            // otherwise use the thread title
                            title = document.querySelector('td.navbar strong').first().text().trim();
                        }
                    }
                    // test if the postText contains a description for the password starting with some common words used for and ending with a colon or a vertical bar
                    // we search for any text until we find it and then get all of it until the next line break
                    // like this we will find the password either if placed on the same line or if placed on the next line
                    // we also take care of if the description is used twice (e.g. before the hidden tag and in the hidden tag again)
                    const passwords = [...postText.matchAll(/(?:^\s?(?:passwor[td]|pw|pass) ?.*?(?::|\s)+)+(\S.*\S)$/gmi)];
                    if (passwords.lenght > 0) {
                        // set the password to the text after the description
                        password = passwords[0][1];
                    }
                }
            }

			// if we have at least found a header, create the nzblnk button
			if (header) {
				let nzblnk = `nzblnk://?h=${encodeURIComponent(header.trim())}`;
				nzblnk += title ? `&t=${encodeURIComponent(title.trim())}` : `&t=${encodeURIComponent(header.trim())}`;
				nzblnk += password ? `&p=${encodeURIComponent(password.trim())}` : '';
				// if it is an old post, include group and date parameter
				if (isOldPost) {
                    const groupsParameter = getGroupsParameter(postText);
                    if (groupsParameter != '') {
                        nzblnk += groupsParameter;
                        nzblnk += getDateParameter(postDate, post);
                    } else {
                        // if we have no groups we don't show the upload time info text
                        postHtmlUploadTime = '';
                    }
				} else {
                    // if we do not inlcude the date and group parameter we don't show the upload time info text
                    postHtmlUploadTime = '';
                }
				// insert the nzblnk buttont after the last hide element or at the end of the post text
				const hides = post.querySelectorAll('[id^="enb_hhr_hide_thanks"]');
                const html = htmlButton.replace('%nzblnk%', nzblnk).replace('%uploadtime%', postHtmlUploadTime).replace('%bottom%', '11');
                if (hides.length > 0) {
                    hides[hides.length-1].insertAdjacentHTML('afterend', html);
                } else {
                    post.querySelector('[id^="post_message"]').insertAdjacentHTML('beforeend', '<br /><br />' + html);
                }

			} else {
				// if no header information was found, start observing the post for changes, e.g. for the thanks click
				observer.observe(post, { attributes: true, childList: true, subtree: true });
			}

		// if there is already a nzblnk and it is an old post
		// update it with the date and group parameter if not yet included
		} else if (nzblnks.length === 1 && isOldPost) {
			let nzblnk = nzblnks[0].href;
            let isUpdated = false;
			// if it does not already contain the group parameter, add it
			if (!/g=(.+?)(&|$)/i.test(nzblnk)) {
				const groupsParameter = getGroupsParameter(getPostText(post));
                if (groupsParameter != '') {
                    nzblnk += groupsParameter;
                    isUpdated = true;
                }
			}
			// if it has the group parameter but does not already contain the date parameter, add it
			if (/g=(.+?)(&|$)/i.test(nzblnk) && !/d=(.+?)(&|$)/i.test(nzblnk)) {
				nzblnk += getDateParameter(postDate, post);
                isUpdated = true
			} else {
                //if the date parameter is already given, update the info text
                postHtmlUploadTime = postHtmlUploadTime.replace('%nfotxt%', `<font color=#66cc00><b>unverändert</b></font> <i>(nur Gruppen wurden ergänzt)</i>`);
            }
			// if groups or date has been added update the nzblnk and add the info
            if (isUpdated) {
                // update the nzblnk
                nzblnks[0].href = nzblnk;
                //add the info
                const hides = post.querySelectorAll('[id^="enb_hhr_hide_thanks"]');
                const html = htmlInfo.replace('%uploadtime%', postHtmlUploadTime).replace('%bottom%', '-1');
                if (hides.length > 0) {
					hides[hides.length-1].insertAdjacentHTML('afterend', html);
                } else {
					post.querySelector('[id^="post_message"]').insertAdjacentHTML('beforeend', '<br /><br />' + html);
                }
            }
		}

		function getPostText(post) {
			// get the post html and convert to text only (including input fields)
			let postText = post.querySelector('[id^="post_message"]').innerHTML;
			postText = postText.replace(/<input.+?value\s*?=\s*?['"](.*?)['"].*?>/ig, "\n$1\n");
			postText = postText.replace(/(<\/div>|<\/p>|<\/td>|<\/li>|<br ?\/?>)/ig, "$1\n");
			postText = html2text(postText).replace(/^\s*([\s|\S]*?)\s*?$/mg, "$1");
			return postText;
		}

		function getDateParameter(postDate, post){
			// search for tempus.ostentationem.ga-img
			const tempus = post.querySelector('[src*="tempus"]');
			// get the timestamp if the post contains a tempus.ostentationem.ga-img
			if (tempus) {
				// update the info html
				postHtmlUploadTime = postHtmlUploadTime.replace('%nfotxt%', `<font color=#66cc00><b>ermittelt</b></font> via <i>'listed since'</i>`);
				// return the parameter
				return `&d=${tempus.src.match(/(\d+)\.png/i)[1]}`;
			} else {
				// otherwise get the date from the postDate and return it in the format DD.MM.YYYY
				const date = new Date(postDate);
				const year = date.getFullYear();
				const month = ('0' + (date.getMonth() + 1)).slice(-2); // Add 1 to the month since it is zero-based, and format it to have a leading zero if necessary
				const day = ('0' + date.getDate()).slice(-2);
				// update the info html
				postHtmlUploadTime = postHtmlUploadTime.replace('%nfotxt%', `<font color=#ff8000><b>ermittelt</b></font> via <i>Beitragszeit</i>`);
				// return the parameter
				return `&d=${day}.${month}.${year}`;
			}
		}

		function getGroupsParameter(postText){
			// test if the postText contains usenet group names in the format alt.xyz or a.b.xyz
			const groups = postText.match(/\b(alt|a\.b)(\.[a-z0-9.+_-]*\b)/ig);
			let groupParameter = '';
			if (groups) {
				groups.forEach(group => {
					groupParameter += `&g=${encodeURIComponent(group.replace('a.b.', 'alt.binaries.').trim())}`;
				});
			}
			return groupParameter;
		}

        function html2text(html) {
            let tag = document.createElement('div');
            tag.innerHTML = html;
            return tag.innerText;
        }

	}

});
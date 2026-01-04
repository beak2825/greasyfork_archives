// ==UserScript==
// @name            KwejkAntyRetardowy
// @name:pl         KwejkAntyRetardowy
// @namespace       https://greasyfork.org/en/scripts/477613-kwejkantyretardowy/code
// @version         2.16
// @description     Block kwejk.pl comments by login
// @description:pl  Blokuj komentarze ludzi po loginie
// @author          You
// @license         MIT
// @match           https://kwejk.pl/*
// @match           https://kwejk.pl/comment/get
// @match           https://m.kwejk.pl/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=kwejk.pl
// @downloadURL https://update.greasyfork.org/scripts/477613/KwejkAntyRetardowy.user.js
// @updateURL https://update.greasyfork.org/scripts/477613/KwejkAntyRetardowy.meta.js
// ==/UserScript==

(function () {
	const blokujKomentarzeTychLudzi = [
		'anna-seredynska',
		'Andrzej_kot1',
		'czyrnek',
		'Dildo Vagins',
		'grodt',
		'Jacob1993',
		'LBGTplus',
		'MaciejM',
		'Mistrzrzeczywistosci',
		'Munga',
		'MichałS',
		'michu1944',
		'MlotNaAteistow',
		'Nakwasowany',
		'OP_to_ciota',
		'Piekielny_Zygfryd',
		'Remku',
		'Shauri',
		'snoff',
		'WiechuPompka',
		'wojciech-chmielewski',
		'Veru`',
		'vimme-vivaldi',
		'Zostałeś_zbanowany',
		'xyz787980',
		'1LwraTW02LIUnAub',
		//'',
	];

    const blokujMemyTychLudzi = [''];

	//blockComments(); // This changed in 2025 - comments are now loaded via POST request
    blockCommentsFromCommentPostRequests();
	blockMemes();

	// ----------------------------------------------------------------------

    function blockCommentsFromCommentPostRequests() {
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            if (url.includes('/comment/get')) {
                blockComments();
            }
            originalOpen.apply(this, arguments);
        };
    }

	function blockComments() {
		const waitSecondsA = 1;
		const waitSecondsB = 2.5;
		setTimeout(blockCommentsOfToxicAuthors, waitSecondsA * 1000);
		setTimeout(blockCommentsOfToxicAuthors, waitSecondsB * 1000);
	}

	function blockMemes() {
		if (!blokujMemyTychLudzi[0].length) return;
		blockMemesOfToxicAuthors();
	}

	function blockCommentsOfToxicAuthors() {
		if (document.querySelectorAll('[data-container="media-listing"]').length) {
			return; // Don't block comments on the main page
		}

		const comments = document.querySelectorAll('.comment-list li');
		let blockedCount = 0;
		if (comments.length) console.log('Znalazłem komentarzy: ' + comments.length);
		Array.from(comments).forEach((comment) => {
			const shouldBlock = shouldBlockComment(comment);
			if (shouldBlock) {
				replaceCommentOfToxicPersonWithHappyLife(comment, shouldBlock);
				blockedCount++;
			}
		});
		if (blockedCount > 0) console.log('Zablokowałem ' + blockedCount + ' toksyków :-)');
	}

	function blockMemesOfToxicAuthors() {
		const memes = document.querySelectorAll('.box.picture');
		let blockedCount = 0;
		if (memes.length) console.log('Znalazłem memów: ' + memes.length);
		Array.from(memes).forEach((meme) => {
			const shouldBlock = shouldBlockMeme(meme);
			if (shouldBlock) {
				replaceMemeOfToxicPersonWithHappyLife(meme, shouldBlock);

                const memeWrapper = findFirstParentWithClass(meme, 'media-element-wrapper');
                if (memeWrapper != null) {
                    replaceMemeOfToxicPersonWithHappyLife(memeWrapper, shouldBlock);
                    memeWrapper.style.minHeight = '';
                }

				blockedCount++;
			}
		});
		if (blockedCount > 0) console.log('Zablokowałem ' + blockedCount + ' memów :-)');
	}

	function shouldBlockComment(comment) {
		const author = comment.querySelectorAll('.name a')[0].innerText;
		return blokujKomentarzeTychLudzi.includes(author) ? author : null;
	}

	function shouldBlockMeme(meme) {
		const author = meme.querySelectorAll('.user .name')[0].innerText;
		return blokujMemyTychLudzi.includes(author) ? author : null;
	}

    function findFirstParentWithClass(element, className) {
        while (element && element !== document) {
            if (element.classList.contains(className)) return element;
            element = element.parentElement;
        }
        return null;
    }

	function replaceCommentOfToxicPersonWithHappyLife(comment, nick) {
		comment.innerHTML =
			'<div style="display:inline-block;width:100%;text-align:center;color:#6a8670">' +
			'═══ Żyj szczęśliwie nie czytając (' + nick + ') ═══' +
			'</div>';
	}

	function replaceMemeOfToxicPersonWithHappyLife(meme, nick) {
		meme.innerHTML =
			'<div style="display:inline-block;width:100%;margin-top:8px;text-align:center;color:#6a8670">' +
			'═══ Żyj szczęśliwie bez memów (' + nick + ') ═══' +
			'</div>';
	}
})();

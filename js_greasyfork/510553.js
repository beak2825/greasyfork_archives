// ==UserScript==
// @name           Old Reddit Highlight Unread Comments
// @description    On topic pages, show "X unread comments (Y total)"; on comment pages, highlight unread comments. Local storage only -- does not work across multiple computers.
// @author         Xiao
// @namespace      https://greasyfork.org/users/5802
// @match          https://old.reddit.com/*
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_deleteValue
// @version        1.0
// @downloadURL https://update.greasyfork.org/scripts/510553/Old%20Reddit%20Highlight%20Unread%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/510553/Old%20Reddit%20Highlight%20Unread%20Comments.meta.js
// ==/UserScript==

/*
todo
- navegar pelo new pra não ter que usar o teclado
- selecionar os minutos quando eu der espaço passando pelo ':'
Features:
 * Replaces "10 comments" with "5 unread comments (10 total)"
 * Unread comments are highlighted for ease of skimming
 * You can navigate through unread comments with the following hotkeys:
   Alt+Q / Alt+W -or- Ctrl+Up arrow / Ctrl+Down arrow
Mix code from:
https://greasyfork.org/scripts/8937-reddit-unread-comment-helper-fork/
https://greasyfork.org/scripts/8029-reddit-highlight-new-comments/
And a little piece of:
https://addons.mozilla.org/firefox/addon/cozy-reddit/

*/
(function(){

    var DELETE_OLDER_THAN = 1000*60*60*24*30; // Items older than 30 days
    /* Shove an item into local storage */
    function getData(id) {
        var data = GM_getValue(id);
        if (data === undefined || data.substr(0, 1) != "{")
            return null;
        return JSON.parse(data);
    }
    /* Get an item out of local storage */
    function setData(id, data) {
		console.log('unread:');
		console.log(data);
        GM_setValue(id, JSON.stringify(data));
    }
    /* Delete old items out of local storage */
    function deleteOldItems() {
        var data = GM_getValue('_last_clean_time');
        if (data !== null && Date.now() - data < 1000*60*60*24) { // Cleanup every 24 hours
            return;
        }
        var row;
        for (var key in GM_listValues()) {
            data = GM_getValue(key);
            if (data === undefined || data.substr(0, 1) != "{") {
                continue;
            }
            row = JSON.parse(data);
            if (Date.now() - row.t < DELETE_OLDER_THAN) {
                continue;
            }
            GM_deleteValue(key);
        }
        GM_setValue('_last_clean_time', Date.now());
    }
	/* Cozy Reddit */
	 function calculateCommentTop (comment) {
        var curTopPos = 0;
        if (comment.offsetParent) {
            do {
                curTopPos += comment.offsetTop;
            } while (comment = comment.offsetParent);

            return [curTopPos - 10];
        }
    }
    /* Get sorted array of unread comments offsets. */
    function getCommentsOffsetTop() {
        var comments = document.getElementsByClassName('unreadHighlighted');
        var arr = new Array(comments.length);
        for (var i = 0; i < comments.length; i++) {
            arr[i] = calculateCommentTop(comments[i]);
        }
        arr.sort(function(a, b) {
            return a - b;
        });
        return arr;
    }
    /* Jump to the next new comment. */
    function jumpToNextComment() {
        var unread = getCommentsOffsetTop();
        var scrollUnread;
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        for (var i = 0; i < unread.length; i++) {
            scrollUnread = unread[i];
            if (scrollUnread > scrollTop) {
                window.scrollTo(0, scrollUnread);
                break;
            }
        }
    }
    /* Jump to the previous new comment. */
    function jumpToPrevComment() {
        var unread = getCommentsOffsetTop().reverse();
        var scrollUnread;
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        for (var i = 0; i < unread.length; i++) {
            scrollUnread = unread[i];
            if (scrollUnread < scrollTop) {
                window.scrollTo(0, scrollUnread);
                break;
            }
        }
    }

    /*
    Handle a list page, adding "n unread comments" links etc.
    */
    function handleListPage() {
        var snap = document.evaluate("//a" +
                "[contains(concat(' ', normalize-space(@class), ' '), ' comments ')]" +
                "[contains(@href, '/comments')]",
            document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

        var b36tid, row, match, comments, seen, newcomments, newlink;
        for(var elm = null, i = 0; (elm = snap.snapshotItem(i)); i++) {
            match = elm.firstChild.nodeValue.match(/(\d+) (comment|comentário)/);
            // No comments; bail early.
            if (!match)
                continue;

            comments = match[1];

            // Alphanumeric base-36 id, like "1lp5".
            b36tid = elm.getAttribute("href").match(/\/comments\/([^\/]+)/)[1];
            row = getData(b36tid);

            seen = row ? row.c : 0;

            newcomments = comments - seen;
            // Can be negative if comments are deleted.
            if (newcomments < 0) newcomments = 0;

            newlink = elm.cloneNode(false);

            var cstring = "unread comment" + (newcomments != 1 ? "s" : "");

            if (newcomments > 0) {
				nc = document.createElement('span');
				nc.style.color = "#333";
				nc.textContent = newcomments + " " + cstring;
				elm.textContent = comments > newcomments ? ' (' + comments + ' total)' : '';
				elm.insertBefore(nc, elm.childNodes[0]);
			}
        }
    }

    /*
    Handle a comments page: highlight new comments, save the ID of the highest
    comment, etc.
    */
    function handleCommentsPage() {
        var url = document.location.href.split("#");
        var frag = url.length > 1 ? url[1] : false;
        var b36tid = url[0].match(/\/comments\/([^\/]+)/)[1];

        var row = getData(b36tid);

        var partida, max_cid = 0, newmax = 0;
        if (row) {
            newmax = max_cid = row.m;
			partida = row.t;
        } else {
			partida = Date.parse(document.getElementById('siteTable').getElementsByClassName('tagline')[0].getElementsByTagName('time')[document.getElementById('siteTable').getElementsByClassName('tagline')[0].getElementsByTagName('time').length - 1].getAttribute('datetime'));
		}

        var comments, i, split, b36cid, cid;
        comments = document.getElementsByClassName('comment');
        for(i=0; i<comments.length; i++) {
            split = comments[i].className.split("_");
            if(split.length == 2)
            {
                b36cid = split[1].split(' ')[0].substr(1);
                cid = parseInt(b36cid, 36);
                if (cid > max_cid) {
					comments[i].getElementsByClassName("entry")[0].parentElement.classList.add('unreadHighlighted');
					comments[i].getElementsByClassName("entry")[0].parentElement.setAttribute('style', HNC.generate_comment_style(Date.parse(comments[i].getElementsByClassName('tagline')[0].getElementsByTagName('time')[comments[i].getElementsByClassName('tagline')[0].getElementsByTagName('time').length - 1].getAttribute('datetime')), partida));
                    if (cid > newmax) {
                        newmax = cid;
                    }
                }
            }
        }

		if (getData(document.location.href.split("#")[0].match(/\/comments\/([^\/]+)/)[1]))
			ui.create_comment_highlighter(getData(document.location.href.split("#")[0].match(/\/comments\/([^\/]+)/)[1]).t, 0);
		else
			ui.create_comment_highlighter(Date.parse(document.getElementById('siteTable').getElementsByClassName('tagline')[0].getElementsByTagName('time')[document.getElementById('siteTable').getElementsByClassName('tagline')[0].getElementsByTagName('time').length - 1].getAttribute('datetime')), 1);

		if (row)
			setTimeout(jumpToNextComment, 250);

        comments = document.getElementsByClassName('comments')[0].innerHTML.match(/\b\d+\b/);
        if (comments && comments[0] > 0) {
            setData(b36tid, {"m": newmax, "c": comments, "t": Date.now()});
        }
    }

	let HNC = {
		highlight: function (since) {
			let comments = document.getElementsByClassName('comment'),
				username
			;

			if (document.body.classList.contains('loggedin')) {
				username = document.getElementsByClassName('user')[0].firstElementChild.textContent;
			}

			for (let comment of comments) {
				/* skip removed or deleted comments */
				if (comment.classList.contains('deleted') || comment.classList.contains('spam')) {
					continue;
				}

				/* skip our own comments */
				let author = comment.getElementsByClassName('author')[0].textContent;
				if (username && username == author) {
					continue;
				}

				/* select original or edited comment time */
				let times = comment.getElementsByClassName('tagline')[0].getElementsByTagName('time'),
					time  = Date.parse(times[times.length - 1].getAttribute('datetime'))
				;

				/* add styles */
				if (time > since) {
					comment.getElementsByClassName("entry")[0].parentElement.classList.add('unreadHighlighted');
					comment.getElementsByClassName("entry")[0].parentElement.setAttribute('style', this.generate_comment_style(time, since));
				}
			}
		},

		reset_highlighting: function () {
			let comments = document.getElementsByClassName('unreadHighlighted');

			for (let i = comments.length; i > 0; i--) {
				let comment = comments[i - 1];
				comment.classList.remove('unreadHighlighted');
				comment.removeAttribute('style');
			}
		},

		generate_comment_style: function (comment_time, since) {
			let style = 'background-color: %color !important;\npadding: 0 5px;';

			style = style.replace(/\s+/g, ' ');
			style = style.replace(/%color/g, this.get_color(Date.now() - comment_time, Date.now() - since));

			return style;
		},

		get_color: function (comment_age, highlighting_since) {
			let time_diff = 1 - comment_age / highlighting_since,
				color_newer = tinycolor('hsl(214, 16, 9').toHsl(), // hsl(210, 16.7%, 9.4%)
				color_older = tinycolor('hsl(214, 16, 9').toHsl()
			;

			let color_final = tinycolor({
				h: color_older.h + (color_newer.h - color_older.h) * time_diff,
				s: color_older.s + (color_newer.s - color_older.s) * time_diff,
				l: color_older.l + (color_newer.l - color_older.l) * time_diff,
			});

			return color_final.toHslString();
		},
	};

	data = {
		comment_highlighter: function () {/*
			<div class="title" style="line-height: 20px;">Highlight comments since:
				<select id="comment-visits">
					<option value="">no highlighting</option>
					<option value="custom">custom</option>
				</select>
				<input id="hnc_custom_visit" type="text" value="00:00" pattern="\d+?:\d+?" style="text-align: center; display: none;" />
			</div>
		*/},

		get: function (name) {
			return this.function_to_string(this[name]);
		},

		/* original authored by lavoiesl, at https://gist.github.com/lavoiesl/5880516*/
		function_to_string: function (func, strip_leading_whitespace) {
			if (strip_leading_whitespace === undefined) {
				strip_leading_whitespace = 1;
			}

			let matches = func.toString().match(/function[\s\w]*?\(\)\s*?\{[\S\s]*?\/\*\!?\s*?\n([\s\S]+?)\s*?\*\/\s*\}/);

			if (!matches) {
				return false;
			}

			if (strip_leading_whitespace) {
				matches[1] = matches[1].replace(/^(\t| {4})/gm, '');
			}

			return matches[1];
		}
	};

	ui = {
		create_comment_highlighter: function (visit, first) {
			/* create element */
			let highlighter = document.createElement('div');

			highlighter.innerHTML = data.get('comment_highlighter');
			highlighter.classList.add('rounded', 'gold-accent', 'comment-visits-box');

			let commentarea      = document.getElementsByClassName('commentarea')[0],
				sitetable        = commentarea.getElementsByClassName('sitetable')[0],
				comment_margin   = window.getComputedStyle(sitetable.firstChild).getPropertyValue('margin-left'),
				gold_highlighter = document.getElementsByClassName('comment-visits-box')[0]
			;

			/* remove default comment highlighter */
			if (gold_highlighter) {
				gold_highlighter.parentNode.removeChild(gold_highlighter);
			}

			/* properly place */
			highlighter.style.setProperty('margin-left', comment_margin);
			commentarea.insertBefore(highlighter, sitetable);

			/* generate visits */
			let select = document.getElementById('comment-visits');
			select.style.textAlignLast = 'center';

			let option = document.createElement('option');
			option.textContent = (Math.floor(Math.floor((Date.now() - visit) / 1000) / 3600) < 10 ? '0' : '') + Math.floor(Math.floor((Date.now() - visit) / 1000) / 3600) + ':' + (Math.floor((Math.floor((Date.now() - visit) / 1000) % 3600) / 60) < 10 ? '0' : '') + Math.floor((Math.floor((Date.now() - visit) / 1000) % 3600) / 60);
			option.value = visit;
			select.appendChild(option);
			select.children[2].setAttribute('selected', '');

			if (!first) {
				let visit0 = Date.parse(document.getElementById('siteTable').getElementsByClassName('tagline')[0].getElementsByTagName('time')[document.getElementById('siteTable').getElementsByClassName('tagline')[0].getElementsByTagName('time').length - 1].getAttribute('datetime'));
				let option2 = document.createElement('option');
				option2.textContent = (Math.floor(Math.floor((Date.now() - visit0) / 1000) / 3600) < 10 ? '0' : '') + Math.floor(Math.floor((Date.now() - visit0) / 1000) / 3600) + ':' + (Math.floor((Math.floor((Date.now() - visit0) / 1000) % 3600) / 60) < 10 ? '0' : '') + Math.floor((Math.floor((Date.now() - visit0) / 1000) % 3600) / 60);
				option2.value = visit0;
				document.getElementById('comment-visits').appendChild(option2);
			}


			// add listeners
			select.addEventListener('change', this.update_highlighting);

			let custom = document.getElementById('hnc_custom_visit');
			custom.style.setProperty('width', (select.getBoundingClientRect().width) + 'px');
			custom.addEventListener('keydown', this.custom_visit_key_monitor);
			custom.addEventListener('blur', this.set_custom_visit);

			this.custom_pos = 0;
		},

		update_highlighting: function (event) {
			/* no highlighting */
			if (event.target.value == '') {
				HNC.reset_highlighting();
			}

			/* custom */
			else if (event.target.value == 'custom') {
				document.getElementById('comment-visits').style.setProperty('display', 'none');
				let custom = document.getElementById('hnc_custom_visit');
				custom.style.removeProperty('display');
				custom.focus();
				custom.setSelectionRange(0, 2);
			}

			/* previous visit */
			else {
				HNC.reset_highlighting();
				HNC.highlight(parseInt(event.target.value, 10));
				jumpToNextComment();
			}
			event.target.blur();
		},

		custom_visit_key_monitor: function (event) {
			if (event.altKey || event.ctrlKey || (event.shiftKey && event.key != 'Tab')) {
				return;
			}
			if (event.key == 'Tab') {

				let match = event.target.value.match(/^(\d+?:)\d+?$/);

				if (match) {
					if (event.shiftKey) {
						ui.custom_pos--;
					}
					else {
						ui.custom_pos++;
					}

					if (ui.custom_pos % 2 == 0) {
						event.target.setSelectionRange(0, match[1].length - 1);
					}
					else {
						event.target.setSelectionRange(match[1].length, match[0].length);
					}

					event.preventDefault();
					event.stopPropagation();
				}
			}
			else if (event.key == 'Enter') {
				event.target.blur();
				event.preventDefault();
				event.stopPropagation();
			}
		},

		set_custom_visit: function (event) {
			let select = document.getElementById('comment-visits'),
				match  = event.target.value.match(/^(\d+?):(\d+?)$/)
			;

			if (match) {
				let option  = document.createElement('option'),
					hours   = parseInt(match[1], 10),
					minutes = parseInt(match[2], 10),
					visit   = Date.now() - (hours * 60 + minutes) * 60 * 1000
				;

				option.value = visit;
				option.textContent = (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;

				select.add(option, 2);
				select.selectedIndex = 2;
			}
			else {
				select.selectedIndex = 0;
			}

			let change = new Event('change');
			select.dispatchEvent(change);

			event.target.value = '00:00';
			event.target.style.setProperty('display', 'none');
			select.style.removeProperty('display');
		}
	};

    if (document.location.href.match(/\/comments(\/|\?|#|$)/)) {
        if (document.location.href.match(/\/comments\/[^\/?#]+(\/([^\/?#]+\/?)?)?(\?|#|$)/)) {
            deleteOldItems();
			handleCommentsPage();

            document.addEventListener('keydown', function(e) {
                // Alt+Q
                if (e.keyCode == "Q".charCodeAt(0) && !e.shiftKey && !e.ctrlKey && e.altKey && !e.metaKey) {
                    jumpToPrevComment();
					e.preventDefault();
                    return false;
                }
                // Alt+W
                if (e.keyCode == "W".charCodeAt(0) && !e.shiftKey && !e.ctrlKey && e.altKey && !e.metaKey) {
                    jumpToNextComment();
					e.preventDefault();
                    return false;
                }

                // Ctrl+up
                if (e.keyCode == 38 && !e.shiftKey && e.ctrlKey && !e.altKey && !e.metaKey) {
                    jumpToPrevComment();
					e.preventDefault();
                    return false;
                }
                // Ctrl+down
                if (e.keyCode == 40 && !e.shiftKey && e.ctrlKey && !e.altKey && !e.metaKey) {
                    jumpToNextComment();
					e.preventDefault();
                    return false;
                }
            }, false);
        }
    } else {
        handleListPage();
    }

})();
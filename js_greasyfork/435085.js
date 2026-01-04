// ==UserScript==
// @name         Kanka Jump to Post
// @namespace    http://tampermonkey.net/
// @version      5
// @description  Adds a dropdown to Kanka entity headers to quickly scroll to the selected post.
// @author       Salvatos
// @match        https://app.kanka.io/*
// @exclude      */html-export
// @icon         https://www.google.com/s2/favicons?domain=kanka.io
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/435085/Kanka%20Jump%20to%20Post.user.js
// @updateURL https://update.greasyfork.org/scripts/435085/Kanka%20Jump%20to%20Post.meta.js
// ==/UserScript==

// Run only on entity Story pages
if (document.getElementById('app').parentNode.classList.contains("entity-story")) {
	/* Preferences */
	const addTopLink = false;

    /* Set arrays*/
    var hasPosts = 0;
    var posts = [];
    $("article.post-block").each(function(){
        posts.push($(this));
    });

	/* Start dropdown */
	var postList= `
	<div class="btn-group jump-to-post">
		<button type="button" class="btn2 btn-sm join-item dropdown-toggle" tabindex="-1" data-toggle="dropdown" title="Entity posts" aria-expanded="false">
			<i class="fa fa-book" aria-hidden="true"></i>
		</button>
		<ul class="note-dropdown-menu dropdown-menu dropdown-posts" aria-label="Jump to an entity post">
	`;

    /* Insert each item name and ID */
	$.each( posts, function( key, value ) {
        hasPosts++;
        postList+= `
		    <li><a href="#` + $(this).attr('id') + `">` + $.trim($(this).find("h3.post-title").text()) + `</a></li>
    	`;
    });

    /* If there is no post, add a notice (won’t be necessary once Entries are treated like posts) */
    if (hasPosts < 1) {
        postList+= `<li><a><i>No post</i></a></li>`;
    }

    /* Close dropdown */
    postList+= `
		</ul>
	</div>
	`;

	/* Insert element after post expand/collapse buttons */
    $(postList).appendTo(".header-buttons > .join");

    /* Add "top" link to box headings, but don’t let it toggle post visibility */
    if (addTopLink) {
        $("<a class='to-top' href='#app' onclick='event.stopPropagation();'>&nbsp;^&nbsp;top</a>").appendTo(".post-title");
    }

    /* Listener: If the target is a collapsed post, expand it first */
    $(".jump-to-post a").click(function() {
        let targetPost = $(this).attr('href');
        if (targetPost != "undefined" && $(targetPost + " .element-toggle")[0].classList.contains("animate-collapsed")) {
            $(targetPost + " .element-toggle")[0].click();
        }
    });

    GM_addStyle(`
    .jump-to-post .fa-book:after {
		content: " ▼";
        vertical-align: middle;
        font-size: 8px;
	}
    .jump-to-post li a:hover {
    	color: var(--theme-input-text);
    }
    /* preserving necessary bootstrap classes */
    .btn-group {
    	position: relative;
    	display: inline-block;
    	vertical-align: middle;
    }
    .dropdown-menu {
		position: absolute;
		z-index: 1000;
		display: none;
		min-width: 160px;
		padding: 5px 0;
		margin: 2px 0 0;
		font-size: 14px;
		text-align: left;
		list-style: none;
		background-color: hsl(var(--b2)/1);
		background-clip: padding-box;
		border: 1px solid rgba(0,0,0,.15);
		border-radius: 4px;
		box-shadow: 0 6px 12px rgba(0,0,0,.175);
	}
    .open > .dropdown-menu {
		display: block;
	}
    .dropdown-menu > li > a {
		display: block;
		padding: 3px 20px;
		clear: both;
		white-space: nowrap;
	}
	`);
}
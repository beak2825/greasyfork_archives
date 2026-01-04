// ==UserScript==
// @name         Kanka Automatic Table of Contents
// @namespace    http://tampermonkey.net/
// @version      13
// @description  Automatically adds a table of contents to Kanka entity pages under the Pins sidebar.
// @author       Salvatos
// @license      MIT
// @match        https://app.kanka.io/*
// @exclude      */html-export*
// @icon         https://www.google.com/s2/favicons?domain=kanka.io
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/429442/Kanka%20Automatic%20Table%20of%20Contents.user.js
// @updateURL https://update.greasyfork.org/scripts/429442/Kanka%20Automatic%20Table%20of%20Contents.meta.js
// ==/UserScript==

// Run only on entity Story pages
if (document.body.classList.contains("entity-story")) {
	/* Preferences */
    const stickyTOC = true; // true or false
	const addTopLink = ""; // "your text" or "" for no link back to ToC after headings
    const classExclusions = ["calendar", "modal", "box-entity-attributes", "toc-ignore"]; // Comma-delimited list of HTML classes to ignore
    // Out of the box: calendar tables, modals, character sheets, sections below entry & posts

    /* Set arrays */
    var headings = [];
	const tag_names = ["h1", "h2", "h3", "h4", "h5", "h6"]

    /* Pre-cleaning: remove stray line breaks left by Summernote at the end of headings so our TOC link doesn't get pushed to a new line */
    document.querySelectorAll(':is(h1, h2, h3, h4, h5, h6) br:last-child').forEach( (br) => br.remove() );
    /* Pre-cleaning: tag out headers in sections other than entry and posts, and hidden transcluded content */
    document.querySelectorAll(`.row-add-note-button + div :is(h1, h2, h3, h4, h5, h6),
                              .mention-entry-content .no-transclusion`).forEach( (ex) => ex.classList.add("toc-ignore") );

	/* Walks through DOM looking for selected elements */
	function walk( root ) {
        // Make sure the node is a valid element and skip unwanted classes
        //console.log(root);
	    if( root.nodeType === 1 && root.nodeName !== 'script' && classExclusions.every( (c) => !root.classList.contains(c) ) ) {
	        if( tag_names.includes(root.nodeName.toLowerCase()) ) { // Any H tag gets added; don’t delve further
	            headings.push( root );
	        } else { // Walk through descendants
                // Add an entry wherever we find the Entry box
                if (root.classList.contains("box-entity-entry")) {
                    headings.push( root );
                }
	            for( var i = 0; i < root.childNodes.length; i++ ) {
	                walk( root.childNodes[i] );
	            }
	        }
	    }
	}
    // Find and walk through the main content block
    walk( document.querySelector('.entity-main-block') );

	/* Start main list */
	var level = 0, past_level = 0;
	var hList = `
		<div id='toc' class='sidebar-section-box overflow-hidden flex flex-col gap-2'>
        	<div class="sidebar-section-title cursor-pointer user-select border-b element-toggle group" data-animate="collapse" data-target="#sidebar-toc-list" onclick="this.classList.toggle('animate-collapsed'); document.getElementById('sidebar-toc-list').classList.toggle('hidden');">
        		<i class="fa-regular fa-chevron-up icon-show transition-transform duration-200 group-hover:-translate-y-0.5 " aria-hidden="true"></i>
        		<i class="fa-regular fa-chevron-down icon-hide transition-transform duration-200 group-hover:translate-y-0.5 " aria-hidden="true"></i>
				<span class="text-lg">Table of contents</span>
            </div>
        	<div class="sidebar-elements" id="sidebar-toc-list">
            	<div class="flex flex-col gap-2 text-xs">
					<ul id='tableofcontents'>
	`;

	/* Create sublists to reflect heading level */
	for( var i = 0; i < headings.length; i++ ) {
	    // Entry, post and era titles act as level-0 headers; timeline events as level 1; everything else per its H tag
	    level = ( headings[i].classList.contains("post-title") || headings[i].classList.contains("box-entity-entry") || headings[i].parentElement.classList.contains("timeline-era-head") || headings[i].parentElement.querySelector(".post-buttons") ) ? 0 : ( headings[i].parentElement.classList.contains("timeline-item-head") ) ? 1 : headings[i].nodeName.substr(1);

	    if (level > past_level) { // Go down a level
	        for(var j = 0; j < level - past_level; j++) {
	            hList += "<li><ul>";
	        }
	    }
	    else if (level < past_level) { // Go up a level
	        for(var j = 0; j < past_level - level; j++) {
	            hList += "</ul></li>";
	        }
	    }

        /* Handle heading text (it gets complicated with Timeline elements and inline tags, so we can’t just innerText it) */
        if (headings[i].classList.contains("box-entity-entry")) {
            headingText = "Entry";
        }
        else {
            var headingText = headings[i],
                child = headingText.firstChild,
                texts = [];
            // Iterate through heading nodes
            while (child) {
                // Not a tag (text node)
                if (!child.tagName) {
                    texts.push(child.data);
                    //console.log("1: " + child.data); // Why am I getting so many empty text nodes?
                }
                // Identify and manage HTML tags
                else {
                    // Text-muted tag, i.e. a Timeline date ;; no longer relevant but keeping for reference
                    /*
                if (child.classList.contains("text-muted")) {
                    //texts.push('<span class="text-muted">' + child.innerText + '</span>');
                    texts.push(child.innerText);
                    console.log("2: " + child.innerText);
                }
                */
                    // Screenreader prompt
                    if (child.classList.contains("sr-only")) {
                        // exclude
                    }
                    // Push text
                    else {
                        texts.push(child.innerText);
                        //console.log("3: " + child.innerText);
                    }
                }
                child = child.nextSibling;
            }

            headingText = texts.join("");
        }

        // Ignore empty H tags, which Summernote sometimes leaves behind; for everything else, proceed
        if (headingText.length > 0) {
            /* Add an ID to the Entry box so we can link to it */
            if (document.querySelector(".box-entity-entry")) { // In rare cases, there is none (i.e. after saving an empty entry in Code View)
                document.querySelector(".box-entity-entry").id = "toc-entry";
            }

            /* Check if heading already has an ID, else create one */
            if (headings[i].id.length < 1) {
                headings[i].id = "h" + i + "-" + headingText.trim().replace(/\s+/g, "-").replace(/^[^\p{L}]+|[^\p{L}\p{N}:.-]+/gu, "");
                // Index included to ensure a unique ID with duplicate titles
            }

            /* Create link in TOC */
            var parentId, parentEra;
            // Timelines require special handling since they have different markup and a collapsed event can be in a collapsed era
            // Event
            if ( headings[i].closest('li[id|="timeline-element"]') ) {
                parentId = headings[i].closest('li[id|="timeline-element"]').id;
                parentEra = "era" + headings[i].closest('ul[id|="era-items"]').id.match(/\d+/);
            }
            // Era
            else if ( headings[i].closest('div.timeline-era') ) {
                parentId = headings[i].closest('div.timeline-era').id;
            }
            // Post or entry
            else {
                if (headings[i].closest('article:is(.box-entity-entry, .post-block)')) {
                    parentId = headings[i].closest('article:is(.box-entity-entry, .post-block)').id;
                }
                // Special posts like character sheets or relations are in non-collapsible divs; treat the heading as its own target
                else {
                    parentId = headings[i].id
                }
            }
            hList += "<li class='toc-level-" + level + "'><a href='#" + headings[i].id + "' data-parent-post='" + parentId + "'" + ((parentEra) ? "data-parent-era='" + parentEra + "'" : "") + ">" + headingText + "</a></li>";

            /* Add "toc" link to non-box headings */
            if (addTopLink && level > 0 && !headings[i].parentElement.classList.contains("entity-mention")) { // That last condition is to omit Extraordinary Tooltips and other transclusions
                headings[i].insertAdjacentHTML("beforeend", "<a class='to-top' href='#toc' title='Back to table of contents'>&nbsp;^&nbsp;" + addTopLink + "</a>");
            }

            /* Update past_level */
            past_level = level;
        }
    }

    /* Close sublists per current level */
	for(var k = 0; k < past_level; k++) {
	    hList += "</li></ul>";
	}
    /* Close TOC */
    hList += "</div></div></div>";

    // Final check: if we haven’t added a single item yet, don’t add the ToC to the DOM (no entry, post or era)
    if ( hList.match(/<li/) ) {
        /* Insert element after History block */
        /* Calendars use only one sidebar */
        if (document.body.classList.contains("kanka-entity-calendar")) {
            document.querySelector('.entity-submenu > div').insertAdjacentHTML("beforeend", hList);
        }
        /* Everything else */
        else {
            document.querySelector('.entity-sidebar').insertAdjacentHTML("beforeend", hList);
        }

        // Sticky block
        if (stickyTOC) {
            document.getElementById("toc").style = "position: sticky;top: 4.25em;max-height: calc(100vh - 5.5em);overflow-y: auto;";
            document.getElementById("sidebar-toc-list").style = "overflow-y: auto; scrollbar-width: thin;";
        }

        /* Listener: If the target heading is in a collapsed post, expand it first */
        // For headings within posts, we need to find the parent to open, then scroll to the targeted heading once rendered
        document.querySelectorAll("#tableofcontents :not(.toc-level-0) a").forEach( (anchor) => {
            anchor.addEventListener('click', (event) => {
                var targetPost = event.target.dataset.parentPost,
                    targetEra = event.target.dataset.parentEra;
                // Check that a toggle exists first; special posts don’t have one
                if (document.querySelector("#" + targetPost + " .element-toggle") && document.querySelector("#" + targetPost + " .element-toggle").classList.contains("animate-collapsed")) {
                    document.querySelector("#" + targetPost + " .element-toggle").click();
                }
                // If the target is a Timeline event, we also need the parent era to be expanded
                if (targetEra && document.querySelector("#" + targetEra + " .element-toggle").classList.contains("animate-collapsed")) {
                    document.querySelector("#" + targetEra + " .element-toggle").click();
                }

                // Wait a bit for rendering and scroll to appropriate heading
                let targetHeading = document.querySelector(event.target.getAttribute("href"));
                setTimeout(function(){ targetHeading.scrollIntoView(); }, 300);
            });
        });
        // For direct links to posts and timeline eras, just pop them open as we go
        document.querySelectorAll("#tableofcontents .toc-level-0 a:not([href='#toc-entry'])").forEach( (anchor) => {
            anchor.addEventListener('click', (event) => {
                var targetPost = event.target.dataset.parentPost;
                // Check that a toggle exists first; special posts don’t have one
                if (document.querySelector("#" + targetPost + " .element-toggle") && document.querySelector("#" + targetPost + " .element-toggle").classList.contains("animate-collapsed")) {
                    document.querySelector("#" + targetPost + " .element-toggle").click();
                }
            });
        });
    }

    GM_addStyle(`
#tableofcontents {
	padding: 5px 0;
	margin: 0;
	list-style: none;
	overflow: hidden;
	overflow-wrap: anywhere;

	ul {
		padding: 0 0 0 5px;
		margin-bottom: 2px;
		list-style: none;

		li {
			padding-left: 5px;
			hyphens: auto
		}

		li:not(:has(li))::marker {
			content: "⟡";
		}
	}

	a {
		font-size: 13px;
	}

	li.toc-level-0 a {
		font-weight: bold;
	}
}
.to-top {
	vertical-align: super;
	font-variant: all-petite-caps;
	font-size: 10px;
}
	`);
}
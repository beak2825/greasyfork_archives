// ==UserScript==
// @name         Kanka Mention Previewer
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.8
// @description  Adds the ability to load a preview of any mentioned entity in a modal.
// @author       Salvatos
// @match        https://app.kanka.io/*
// @icon         https://www.google.com/s2/favicons?domain=kanka.io
// @grant        GM_addStyle
// @connect      kanka.io
// @downloadURL https://update.greasyfork.org/scripts/449641/Kanka%20Mention%20Previewer.user.js
// @updateURL https://update.greasyfork.org/scripts/449641/Kanka%20Mention%20Previewer.meta.js
// ==/UserScript==

// Get campaign ID from URL
const campaignID = window.location.href.match(/w\/(.+)/)[1].split("/")[0];

// Create empty dialog to be populated
const MentionPreviewer = `
 <dialog id="MentionPreviewer" class="box-entity-entry">
   <div class="box-header with-border">
    <h1 class="box-title"></h1>
    <div class="box-tools">
     <form method="dialog">
      <button class="bg-gray">Close</button>
     </form>
    </div>
   </div>
   <section id="MentionPreviewer-content">
    <article id="MentionPreviewer-entry" class="box-body entity-content"></article>
    <aside id="MentionPreviewer-attributes"></aside>
   </section>
 </dialog>
`;
document.querySelector('body').insertAdjacentHTML("afterbegin", MentionPreviewer);
let PreviewDialog = document.getElementById('MentionPreviewer');

// Add listener to close the dialog when clicking outside of it
PreviewDialog.addEventListener("click", function (event) {
  if (event.target === PreviewDialog) {
    PreviewDialog.close();
  }
});

// Process each mention at page load, excluding entity tags in headers
$( "a[data-toggle='tooltip-ajax']:not([data-tag-slug])" ).each(runThroughMentions);

// On pages with child lists, e.g. organisation members, we need to watch for the list to be loaded in
if (document.getElementById("datagrid-parent")) {
    function setObserver() {
        // Set and run the observer until datagrid is loaded in
        let observer = new MutationObserver(function(mutations) {
            if ($('#datagrid-parent tr').length) {
                observer.disconnect();

                // Process each mention in the table body
                $( "#datagrid-parent tbody a[data-toggle='tooltip-ajax']" ).each(runThroughMentions);

                // Restart observer if more pages exist
                if ($('#datagrid-parent .pagination').length) {
                    setObserver();
                }
            }
        });

        observer.observe(document.getElementById("datagrid-parent"), {attributes: false, childList: true, characterData: false, subtree:false});
    }

    // Run at page load
    setObserver();
}

function runThroughMentions () {
    let $this = $(this); // optimization (don’t create a new $(object) every time)
    var apiURL = `https://app.kanka.io/w/${campaignID}/entities/` + $this.attr("data-id") + `/json-export`;
    var mentionURL = $this.attr("href");
    var mentionTags = $this.attr("data-entity-tags");

    /*
    // Clone the mention to destroy its native event listeners
    var thisMention = $this.clone().insertAfter( $this );
    $this.remove();

    // Prepare the dropdown of options
    let dropdown = `
		<ul class="MentionPreviewer-options dropdown-menu dropdown-menu-right" role="menu">`+
			<li>
				<a href="${mentionURL}" title="">
					<i class="fa-solid fa-square-arrow-up-right"></i> Open entity
				</a>
			</li>
			<li>
				<a href="${mentionURL}" target="_blank" title="">
					<i class="fa-solid fa-arrow-up-right-from-square"></i> Open entity in new tab
				</a>
			</li>
			<li>
				<a class="MentionPreviewer-loader" title="">
					<i class="fa-solid fa-eye"></i> View entry in modal
				</a>
			</li>
		</ul>
    */

    // Prepare the loader icon
    const loader = `<i class="fa-solid fa-magnifying-glass-arrow-right MentionPreviewer-loader" title="View entry in modal"></i>`;
    // In entity grid view, wrap the mention and loader together as one child of the flexbox
    if ($this.parent('.entities-grid')) {
        $this.wrap( "<span></span>" );
    }
    // Attach loader
    $this.after( $( loader ) );

    // Add event listener to each mention loader
    $this.next(".MentionPreviewer-loader").click(function(event) {
        //event.preventDefault();
        // Add or update target entity tags for custom styling
        PreviewDialog.setAttribute("data-entity-tags", mentionTags);
        // Remove title, header image and attributes if present
        document.querySelector('#MentionPreviewer .box-title').innerHTML = "";
        document.querySelector('#MentionPreviewer .box-header').classList.remove("has-header");
        document.querySelector('#MentionPreviewer .box-header').style.backgroundImage = "";
        document.getElementById('MentionPreviewer-attributes').innerHTML = "";
        // Display loading message
        document.getElementById('MentionPreviewer-entry').innerHTML = "<em>Loading entry...</em>";
        // Open modal if closed
        if (!PreviewDialog.open) {
            PreviewDialog.showModal();
        }

        // Request JSON for the target entity
        var xhr = new XMLHttpRequest();
        xhr.open("GET", apiURL, true);
        xhr.responseType = 'json';
        xhr.onload = function (e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    let entityName = xhr.response.data.name,
                    entityPortrait = xhr.response.data.image_full,
                    entityHeader = xhr.response.data.header_full,
                    entityEntryParsed = xhr.response.data.entry_parsed,
                    entityRawAttributes = xhr.response.data.attributes,
                    entityNotes = xhr.response.data.posts;

                    // Prepend portrait to pinned attributes, if present
                    var entityPinnedAttributes = (entityPortrait) ? `<a href="${entityPortrait}" class="portrait"><img src="${entityPortrait}" /></a>` : "";

                    // Format pinned attributes
                    for (let i = 0; i < entityRawAttributes.length; i++) {
                        if (entityRawAttributes[i].is_star === true) {
                            // For range attributes, strip the range syntax out of the name
                            if (entityRawAttributes[i].name.match(/\[range:/)) {
                                entityRawAttributes[i].name = entityRawAttributes[i].name.replace(/\[range:.*\]/, '');
                            }
                            entityPinnedAttributes += `<dt>${entityRawAttributes[i].name}</dt><dd>${entityRawAttributes[i].parsed}</dd>`;
                        }
                    }
                    /* I could get pinned relations too, but I only have the ID so I would need another xhr for each to get their names... Seems excessive.
                    // Prepare pinned relations
                    for (let i = 0; i < entityRawRelations.length; i++) {
                        if (entityRawRelations[i].is_star === true) {
                            entityPinnedAttributes += `<dt>${entityRawRelations[i].relation}</dt><dd>${entityRawRelations[i].target_id}...</dd>`;
                        }
                    }
                    */

                    // Links and files could also be considered

                    // Wrap attributes block if not empty
                    entityPinnedAttributes = (entityPinnedAttributes == "") ? "" : `<dl>${entityPinnedAttributes}</dl>`;

                    // Prepare posts
                    let postsParsed = "";
                    for (let i = 0; i < entityNotes.length; i++) {
                        postsParsed += `
                        <hr />
                        <div class="entity-note">
							<h2 class="box-title">${entityNotes[i].name}</h2>
							<div class="entity-content entity-note-body">${entityNotes[i].entry_parsed}</div>
						</div>`;
                    }
                    let entityEntries = (entityEntryParsed) ? entityEntryParsed + postsParsed : postsParsed;

                    // Replace dialog title with current mention
                    document.querySelector('#MentionPreviewer .box-title').innerHTML = `<a href="${mentionURL}" class="entity-name">${entityName}</a>`;
                    // Replace dialog title background with header image if present
                    PreviewDialog.style.setProperty('--header-image', "url("+entityHeader+")");
                    //document.querySelector('#MentionPreviewer .box-header .box-title').style.backgroundImage = (entityHeader.length > 0) ? `url("${entityHeader}")` : "";
                    if (entityHeader.length > 0) { document.querySelector('#MentionPreviewer .box-header').classList.add("has-header"); }
                    // Replace dialog content with current entry
                    document.getElementById('MentionPreviewer-entry').innerHTML = (entityEntries) ? entityEntries : "";
                    // Replace dialog content with current attributes
                    document.getElementById('MentionPreviewer-attributes').innerHTML = `${entityPinnedAttributes}`;
                    // If attributes are shown, enable 2-column layout
                    document.getElementById('MentionPreviewer-content').className = (entityPinnedAttributes.length > 0 || entityPortrait) ? "with-attributes" : "";

                    // Run through the entry’s mentions to add loaders inside the modal
                    $( "#MentionPreviewer" ).find( "a[data-toggle='tooltip-ajax']" ).each(runThroughMentions);

                    // Request tooltips for the new mentions
                    $('#MentionPreviewer [data-toggle="tooltip"]').tooltip();
                    unsafeWindow.ajaxTooltip(); // (unsafeWindow is how you use window. functions in scripts where @grant is not set to 'none'
                } else {
                    console.error(xhr.statusText);
                }
            }
        };
        xhr.onerror = function (e) {
            console.error(xhr.statusText);
        };
        xhr.send(null);

        // In nested entity lists, prevent the trigger from drilling down to child entities
        event.stopPropagation();
    });
}

GM_addStyle ( `
    /* Keep loader on same line as transcluded entity title */
    .mention-field-entry .entity-mention-name {
        display: inline-block;
    }
    .MentionPreviewer-loader {
        font-size: 11px;
        margin-left: 3px;
        cursor: pointer;
    }
	.entities-grid .MentionPreviewer-loader {
    	float: right;
    	margin-right: 5px;
    	margin-top: -15px;
        transform: translateY(15px); /* bit of an odd trick to keep it in the corner of the tile without screwing with the flexbox’s proportions */
	}
    /* Modal */
    #MentionPreviewer[open] ~ #app {
        filter: grayscale(0.3) blur(1px);
    }
    #MentionPreviewer {
	    width: auto;
        max-width: 80vw;
	    max-height: 90vh;
	    background-color: #222;
	    color: var(--theme-main-text);
        padding: 0;
        border-radius: 10px;
	    border: 2px solid var(--theme-border);
        overflow: visible; /* For mention tooltips; hopefully this doesn’t break other things */
    }

	/* header */
    #MentionPreviewer .box-header {
        display: grid;
        grid-template-columns: 1fr auto;
        justify-items: center;
        align-items: center;
        height: 80px;
        background: var(--content-wrapper-background); /* To ensure a default background on this without overriding the value for the rest of the campaign */
    }
    #MentionPreviewer .box-header.has-header {
        background-image: var(--header-image);
        background-size: 100%;
        background-position-y: center;
        height: 120px;
    }
    .box-header::before, .box-header::after {
		display: none;
	}

	/* title */
    #MentionPreviewer .box-title .entity-name {
        text-align: center;
    	font-size: 25px;
    }
    #MentionPreviewer .has-header .box-title .entity-name {
    	font-size: 30px;
        color: #f9f9f9;
    	text-shadow: #111 2px 2px 5px;
    	background-image: radial-gradient(#1e1e1e6b, #60605c00, #56595600);
    	padding: 5px 25px;
    }

	/* close button */
    #MentionPreviewer .box-header > .box-tools {
    	align-self: start;
    	margin-top: 5px;
    }
    #MentionPreviewer button {
        float: right;
		margin: 5px;
		padding: 0 5px;
		border-radius: 5px;
        height: min-content;
	}
    #MentionPreviewer button:hover {
		background: #eee !important;
        color: #444 !important;
	}

	/* main content */
    #MentionPreviewer-content {
        padding: 5px 15px;
        background: var(--box-background);
        max-height: calc(90vh - 80px);
        overflow: auto;
    }
    .has-header + #MentionPreviewer-content {
        max-height: calc(90vh - 150px);
    }
    #MentionPreviewer-content.with-attributes {
        display: grid;
        grid-auto-flow: column;
        grid-template-columns: auto 200px;
        justify-content: space-between;
        grid-gap: 10px;
    }

    /* posts */
    h2.box-title {
	    text-decoration: underline;
    }

	/* attributes */
    #MentionPreviewer-content.with-attributes .portrait img {
        width: calc(100% + 10px);
        margin-bottom: 15px;
    }
    .with-attributes #MentionPreviewer-attributes {
        border-left: 2px solid gray;
        padding: 10px;
    }
    #MentionPreviewer-attributes dd {
        margin-bottom: 5px;
    }
    @media print {
        i.MentionPreviewer-loader {
            display: none;
        }
    }
` );
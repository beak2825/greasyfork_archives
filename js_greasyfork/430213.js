// ==UserScript==
// @name         Kanka Editor Toolkit
// @namespace    http://tampermonkey.net/
// @version      15
// @description  Adds toolbar buttons to Summernote to quickly insert custom HTML elements or classes.
// @author       Salvatos
// @match        https://app.kanka.io/*
// @icon         https://www.google.com/s2/favicons?domain=kanka.io
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/430213/Kanka%20Editor%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/430213/Kanka%20Editor%20Toolkit.meta.js
// ==/UserScript==

GM_addStyle(`
/* Avoid right screen edge on dropdowns*/
.note-marketplace .dropdown-menu {
	left: unset;
	right: 0;
}
.scrollable-menu {
	height: auto;
	max-height: 75vh;
    min-width: 200px !important;
	max-width: 30vw;
	overflow-x: hidden;
}
.scrollable-menu li a {
	padding: 0 5px;
	font-family: "Roboto", monospace;
	font-size: 13px;
}
.scrollable-menu li.class-group a {
	font-weight: bold;
	font-size: 13px;
	color: var(--box-header-text);
}
.class-group {
	text-align: center;
	background: hsl(var(--b3));
	border-radius: 2px;
	border: 1px solid #090e572b;
}
li.class-group a:hover {
    background: hsl(var(--p));
}
.note-editor.note-frame .note-status-output {
    padding: 0;
    height: auto;
    background-color: #f4f4f4;
    transition: height 2s;
}
.note-editor.note-frame .note-status-output .fadeout {
    display: block;
    padding: 5px 10px;
    width: 100%;
    background-color: #b34e4e;
    color: #eee;
    font-weight: bold;
    text-align: center
}

/* Modals */
:is(.tooltip-dialog, .easytabs-dialog) output {
    color: hsl(var(--bc));
}
:is(.tooltip-dialog, .easytabs-dialog) .btn2 {
	min-height: unset;
    padding: 10px 10px;
    text-transform: initial;
}

/* ExT Helper */
.tooltip-dialog .modal-content {
	max-height: 80vh;
	overflow-y: auto;
}
.tooltip-dialog .modal-body {
	display: grid;
	grid-template-columns: 70% 30%;
}
.tooltip-dialog .modal-footer {
	text-align: left;
}
.tooltip-dialog {
	display: none;
	padding-right: 12px
}
.tooltip-dialog h5 {
	font-size: 15px;
}
.tooltip-dialog label em {
	font-weight: 300;
}
.tooltip-dialog label {
	font-size: 13px;
	display: inline;
}
#tooltip-demo {
	align-self: center;
}
#tooltip-demo output {
	padding: 10px;
	margin-bottom: 10px;
	border: 1px solid grey;
	border-radius: 5px;
}
#tooltip-demo :is(.ExT-wrap, .ExT-attribute) {
	color: whitesmoke;
}

/* Easy Tabs Helper */
.easytabs-dialog .modal-footer {
	display: flex;
    gap: 10px;
    align-items: center;
    justify-content: end;
    padding: 10px 0;
}
.easytabs-dialog p {
	margin-bottom: 10px;
}
#easytabs-items {
	padding-top: 0;
}
#easytabs-items .easytabs-content {
	display: none;
}
#easytabs-items .easytabs-toggles {
	display: flex;
	gap: 0 5px;
}
#easytabs-items .easytabs-tab {
	font-size: unset;
}
.easytabs-dragger {
	display: flex;
	align-items: center;
	gap: 0 5px;
}
.easytabs-select {
    max-width: 30%;
    padding: 8px 5px;
}
`);

// Wait for Summernote to initialize
$('.html-editor').on('summernote.init', function() {

    // Prepare to check for supported themes in the campaign
    var rootFlags = getComputedStyle(document.documentElement);

	/* HTML INSERTER ARRAYS */
    // Define our supported code snippets
    let snippetArray = [];

    /* Campaign-specific custom HTML shortcuts */
    if (rootFlags.getPropertyValue('--summernote-insert-html-shortcuts')) {
        let customShortcuts = rootFlags.getPropertyValue('--summernote-insert-html-shortcuts').split(" ");
        customShortcuts.forEach(child => {
            let customHTML = rootFlags.getPropertyValue('--summernote-insert-html-'+child).replace(/(?<!\\)\[/g, "<").replace(/(?<!\\)\]/g, ">").replace(/\\/g, "").split("|||");
            snippetArray.push(
                {"listing": customHTML[0], "code": customHTML[1]}
            );
        });
    }

    // Default: Details/summary combo
    snippetArray.push(
        {"listing": "Spoiler block (<b>warning</b>:<br />safer to edit in HTML view)", "code": '<details><summary>Summary</summary>Spoiler text</details>'}
    );

    // Easy Tabs by Salvatos
	// TODO: Make a separate button for this?
    if (rootFlags.getPropertyValue('--summernote-insert-easytabs')) {
        snippetArray.push(
            {"listing": "Easy Tabs Helper (visual editor only)", "code": ''}
        );
    }

    // Extraordinary Tooltips by Salvatos
	// TODO: Make a separate button for this?
    if (rootFlags.getPropertyValue('--summernote-insert-extraordinary-tooltips')) {
        snippetArray.push(
            {"listing": "Extraordinary Tooltips Helper", "code": ''}
        );
    }

    // Figure Box and Floats by Ornstein
    if (rootFlags.getPropertyValue('--summernote-insert-figure-box')) {
        snippetArray.push(
            {"listing": "Figure Box (base)", "code": '<div class="figure">Insert image and caption here</div>'}
        );
    }

    // Responsive Image Gallery by Salvatos
    if (rootFlags.getPropertyValue('--summernote-insert-autogallery')) {
        snippetArray.push(
            {"listing": "Responsive Image Gallery", "code": '<div class="autogallery">Insert gallery images here</div>'}
        );
    }

    // Simple Tooltips by KeepOnScrollin
    if (rootFlags.getPropertyValue('--summernote-insert-simple-tooltip')) {
        snippetArray.push(
            {"listing": "Simple Tooltips (default &ndash; top)", "code": '<span class="simple-tooltip">Tooltip trigger<span class="simple-tooltip-text">Tooltip content</span></span>'}
        );
    }

    // Build list items for our supported plugin snippets
    var themeList = "";
    for (let i = 0; i < snippetArray.length; i++) {
		// Add an id to ExT Helper to trigger a different event
		if (snippetArray[i]["listing"] == "Extraordinary Tooltips Helper") {
			themeList += '<li id="ExT-Helper" data-helper="true" aria-label="' + snippetArray[i]["listing"] + '"><a href="#_">' + snippetArray[i]["listing"] + '</a></li>';
		}
        // Add an id to Easy Tabs Helper to trigger a different event
		else if (snippetArray[i]["listing"] == "Easy Tabs Helper (visual editor only)") {
			themeList += '<li id="Easytabs-Helper" data-helper="true" aria-label="' + snippetArray[i]["listing"] + '"><a href="#_">' + snippetArray[i]["listing"] + '</a></li>';
		}
		else {
			themeList += '<li aria-label="' + snippetArray[i]["listing"] + '"><a href="#_">' + snippetArray[i]["listing"] + '</a></li>';
		}
    }

    /* CLASS INSERTER ARRAYS */
    // Define and group supported classes
    let classArray = [];
    // Some useful Bootstrap and Kanka-native classes
    classArray.push(
        {"name": "delimiter:Kanka", "hint": "#_"},
        {"name": "pull-left", "hint": "Floats the element to the left"},
        {"name": "pull-right", "hint": "Floats the element to the right"},
        {"name": "center-block", "hint": "Centers images and block elements"}
    );
    // Grab any custom classes set up by the campaign specifically to be used here
    var customClasses = rootFlags.getPropertyValue('--summernote-insert-custom-classes');
    if (customClasses) {
        classArray.push(
            {"name": "delimiter:Campaign classes", "hint": ""}
        );
        // Strip quotes and make a space-separated array
        var customClassList = customClasses.substring(1, customClasses.length - 1).split(" ");
        customClassList.forEach(child => {
            classArray.push(
                {"name": child, "hint": ""}
            );
        });
    }
    // .boxquote by Olessan
    if (rootFlags.getPropertyValue('--summernote-insert-olessan-boxquote')) {
        classArray.push(
            {"name": "delimiter:.boxquote", "hint": "https://marketplace.kanka.io/plugins/6cfb03a0-9f80-4743-9743-bd4c2b05bea2"},
            {"name": "boxquote", "hint": "Applies different styling to a boxquote element"}
        );
    }
    // Context-Aware Classes by Salvatos
    if (rootFlags.getPropertyValue('--summernote-insert-context-aware-classes')) {
        classArray.push(
            {"name": "delimiter:Context-Aware Classes", "hint": "https://marketplace.kanka.io/plugins/31910211-f33b-47b4-8db2-47dfa8dc959e"},
            {"name": "dashboard-only", "hint": "Only displays the element on a dashboard"},
            {"name": "no-dashboard", "hint": "Hides the element from dashboards"},
            {"name": "editor-only", "hint": "Only displays the element in Summernote"},
			{"name": "ExT-only", "hint": "Only displays the element in Extraordinary Tooltips"},
			{"name": "no-ExT", "hint": "Hides the element from Extraordinary Tooltips"},
            {"name": "mobile-only", "hint": "Only displays the element at small resolutions"},
            {"name": "no-mobile", "hint": "Only displays the element at high resolutions"},
            {"name": "marker-only", "hint": "Only displays the element in map markers"},
            {"name": "marker-details-only", "hint": "Only displays the element in a map's sidebar"},
            {"name": "no-map", "hint": "Hides the elements from maps and map widgets"},
            {"name": "print-only", "hint": "Only displays the element in printed media"},
            {"name": "no-print", "hint": "Removes the element from printed media"},
            {"name": "tooltip-only", "hint": "Only displays the element in tooltips"},
            {"name": "no-tooltip", "hint": "Removes the element from tooltips"},
            {"name": "transclusion-only", "hint": "Only displays the element when the entry is transcluded into another entity"},
            {"name": "no-transclusion", "hint": "Removes the element from transcluded entries"}
        );
    }
	// Extraordinary Tooltips by Salvatos
    if (rootFlags.getPropertyValue('--summernote-insert-extraordinary-tooltips')) {
        classArray.push(
            {"name": "delimiter:Extraordinary Tooltips", "hint": "https://marketplace.kanka.io/plugins/31910211-f33b-47b4-8db2-47dfa8dc959e"},
            {"name": "ExT-inline", "hint": "For the paragraphs surrounding an inline ExT"}
        );
    }
    // Figure Box and Floats by Ornstein
    if (rootFlags.getPropertyValue('--summernote-insert-figure-box')) {
        classArray.push(
            {"name": "delimiter:Figure Box and Floats", "hint": "https://marketplace.kanka.io/plugins/a0a51dda-6a69-4e05-96a9-5fda05f160e5"},
            {"name": "l", "hint": "Left float"},
            {"name": "r", "hint": "Right float"},
            {"name": "clear", "hint": "Reset float (break line)"}
        );
    }
    // Handwritten Journal by Ornstein
    if (rootFlags.getPropertyValue('--summernote-insert-handwritten-journal')) {
        classArray.push(
            {"name": "delimiter:Handwritten Journal", "hint": "https://marketplace.kanka.io/plugins/bce5fcec-b279-4b44-ac68-273e65d30ab6"},
            {"name": "hand1", "hint": "Kalam font"},
            {"name": "hand2", "hint": "Sacramento font"},
            {"name": "hand3", "hint": "Dancing Script font"},
            {"name": "hand4", "hint": "Fondamento font"},
            {"name": "hand5", "hint": "Homemade Apple font"},
            {"name": "hand6", "hint": "Shadows Into Light font"},
            {"name": "lback", "hint": "Parchment background"},
            {"name": "letter", "hint": "Prerequisite for other classes"},
            {"name": "sig", "hint": "Double font size"}
        );
    }
    // Redacted Text by Salvatos
    if (rootFlags.getPropertyValue('--summernote-insert-salv-redacted')) {
        classArray.push(
            {"name": "delimiter:Redacted Text", "hint": "https://marketplace.kanka.io/plugins/810f9079-6a14-4267-a9f1-a7a142410116"},
            {"name": "salv-redacted", "hint": "Makes text black on black with a &quot;redacted&quot; annotation"}
        );
    }
    // Simple Tooltips by KeepOnScrollin
    if (rootFlags.getPropertyValue('--summernote-insert-simple-tooltip')) {
         classArray.push(
            {"name": "delimiter:Simple Tooltips", "hint": "https://marketplace.kanka.io/plugins/1bb9b54c-46ef-4bd9-b6d3-8e88bcb99e91"},
            {"name": "top", "hint": "Display tooltip above trigger"},
            {"name": "bottom", "hint": "Display tooltip below trigger"},
            {"name": "left", "hint": "Display tooltip left of trigger"},
            {"name": "right", "hint": "Display tooltip right of trigger"}
        );
    }
    // Tip Box by Critter
    if (rootFlags.getPropertyValue('--summernote-insert-tip-box')) {
        classArray.push(
            {"name": "delimiter:Tip Box", "hint": "https://marketplace.kanka.io/plugins/c16e9e7f-8e82-4836-84eb-cdcbf66b8bdd"},
            {"name": "tipbox-big", "hint": "Creates a wide, bordered, right-floating container"},
            {"name": "tipbox-small", "hint": "Creates a narrow, bordered, right-floating container"}
        );
    }

    // Build list items for our supported plugin classes
    var classList = "";
    for (let i = 0; i < classArray.length; i++) {
        if (classArray[i]["name"].match(/delimiter:/g)) {
            classList += '<li class="class-group" aria-label="' + classArray[i]["name"].split(":")[1] + '">';
            if (classArray[i]["name"].split(":")[1] == "Bootstrap") {
                classList += '<a title="Provided with Kanka" href="#_">';
            }
            else if (classArray[i]["name"].split(":")[1] == "Campaign classes") {
                classList += '<a title="Provided by the campaign" href="#_">';
            }
            else {
                classList += '<a title="Open documentation in a new tab" target="_blank" href="' + classArray[i]["hint"] + '">';
            }
            classList += classArray[i]["name"].split(":")[1] + '</a></li>';
        }
        else {
            classList += '<li aria-label="' + classArray[i]["name"] + '" title="' + classArray[i]["hint"] + '"><a href="#_">' + classArray[i]["name"] + '</a></li>';
        }
    }

    // Locate toolbar and insert our dropdown buttons
    const toolbar = document.getElementsByClassName('note-toolbar')[0];

    var buttons = `<div class="note-btn-group btn-group note-marketplace">`;
    var snippetsButton = `
	<div class="note-btn-group btn-group">
		<button type="button" class="btn btn-default btn-sm dropdown-toggle note-codeview-keep" tabindex="-1" data-toggle="dropdown" title="Custom HTML blocks" aria-expanded="false">
			<i class="fas fa-puzzle-piece"></i> <span class="note-icon-caret"></span>
		</button>
		<ul class="note-dropdown-menu dropdown-menu dropdown-snippets" aria-label="Insert HTML elements">
			` + themeList + `
		</ul>
	</div>`;
	var classesButton = `
	<div class="note-btn-group btn-group">
		<button type="button" class="btn btn-default btn-sm dropdown-toggle note-codeview-keep" tabindex="-1" data-toggle="dropdown" title="Custom CSS classes" aria-expanded="false">
			<i class="fa fa-css3"></i> <span class="note-icon-caret"></span>
		</button>
        <ul class="note-dropdown-menu dropdown-menu dropdown-classes scrollable-menu" aria-label="Toggle CSS classes">
			` + classList + `
		</ul>
	</div>`;
	/* Example of a simple button for future reference
	var tooltipsButton = `
	<button type="button" id="tooltip-insert" class="btn btn-default btn-sm" tabindex="-1" title="Extraordinary Tooltips Helper" aria-label="Extraordinary Tooltips" data-original-title="Extraordinary Tooltips">
		<i class="fab fa-stack-exchange"></i>
	</button>
	`;*/
    buttons += snippetsButton + classesButton + `</div>`;
    toolbar.insertAdjacentHTML("beforeend", buttons);

	/* ADD EVENTS FOR HTML INSERTER */
    // Grab our completed dropdown
    const snippetsDropdown = document.getElementsByClassName('dropdown-snippets')[0];

    // Make sure we have at least one supported theme enabled
    if (snippetsDropdown.children[0]) {
        // Add click events to editor
        for (let i = 0; i < snippetsDropdown.children.length; i++) {
            snippetsButton = snippetsDropdown.children[i];

            // Skip special helper entries
            if (snippetsButton.getAttribute("data-helper") == "true") {
                continue;
            }

            snippetsButton.addEventListener('click', () => {
                // Code editor, not supported by Summernote functions so we're making our own
                if ($('#entry + div').hasClass('codeview')) {
                    const codeEditor = $('#entry + div').find('.note-codable');
                    var cursorPos = codeEditor.prop('selectionStart');
                    var editorValue = codeEditor.val();
                    var textBefore = editorValue.substring(0, cursorPos);
                    var textAfter = editorValue.substring(cursorPos, editorValue.length);
                    var newPos = cursorPos + snippetArray[i]["code"].length + 1;
                    codeEditor.val(textBefore + '\n' + snippetArray[i]["code"] + textAfter);

                    // Return focus to textarea and select newly inserted string to make it clear to the user
                    codeEditor[0].focus();
                    codeEditor[0].setSelectionRange(cursorPos, newPos);

                    // Update Summernote’s hidden textarea in case of immediate saving
                    $('#entry').val(codeEditor.val());
                }
                // Visual editor, API has us covered here
                else {
                    var insertNode = $.parseHTML(snippetArray[i]["code"])[0];
                    $('#entry').summernote('insertNode', insertNode);
                }
            });
        }
    }
    else {
        snippetsDropdown.insertAdjacentHTML("beforeend", "<li><a href='#'><em>No supported theme found</em></a></li>");
    }

    /* ADD EVENTS FOR CLASS INSERTER */
    // Grab our completed dropdown
    const classesDropdown = $('#entry + div .dropdown-classes');

	// Add click events to editor
	for (let i = 0; i < classesDropdown.find('li').length; i++) {
		classesButton = classesDropdown.find('li')[i];

		classesButton.addEventListener('click', (e)=>{
			//e.preventDefault();
			// Code editor, not supported by Summernote functions so we're making our own?
			if ($('#entry + div').hasClass('codeview')) {
                // Grab selection from editor
                const codeEditor = document.getElementsByClassName('note-codable')[0];
                var selectedText = codeEditor.value.substring(codeEditor.selectionStart, codeEditor.selectionEnd);
                var initialStart = codeEditor.selectionStart;
                var initialEnd = codeEditor.selectionEnd;
                var initialLength = codeEditor.value.length;

                // Make (reasonably) sure we are holding a single opening tag
                if (selectedText.slice(0, 1) == '<' && selectedText.slice(-1) == '>' && selectedText.slice(1, 2) !== '/' && selectedText.match(/</g).length == 1 && selectedText.match(/>/g).length == 1) {
                    // Insert flag to locate this element further on
                    var tagEnd = (selectedText.slice(-2) == '/>') ? '/>' : '>';
                    var flaggedTag = selectedText.slice(0, -tagEnd.length) + ' data-class-inserter="target"' + tagEnd;

                    // Replace selection with modified tag
                    codeEditor.focus();
                    codeEditor.setRangeText(flaggedTag, codeEditor.selectionStart, codeEditor.selectionEnd, 'select');

                    // Create node from textarea
                    var inputNode = $.parseHTML($('#entry + div').find('.note-codable').val());

                    // Toggle class on target node
                    var targetNode = $(inputNode).closest('[data-class-inserter="target"]');
                    if (targetNode.length == 0) { // The above only finds first-level elements, and the below only finds sub-elements. Go figure.
                        targetNode = $(inputNode).find('[data-class-inserter="target"]');
                    }
                    if (targetNode.length == 0) { // Worst case scenario
                        alert("Target element was lost along the way. Please report the issue and include the source HTML.");
                    }
                    $(targetNode).toggleClass(classArray[i]["name"]);

                    // Clean up and remove class attribute if no class remains after toggle
                    if ($(targetNode).attr('class') == "") {
                     $(targetNode).removeAttr('class');
                    }

                    // Remove flag
                    $(targetNode).removeAttr('data-class-inserter');

                    // Return to HTML (wrapper needed) and pass to textarea
                    $('#entry + div').find('.note-codable').val($('<div></div>').append($(inputNode)).html());

                    // Apply changes to master copy in case of immediate save
                    $('#entry').val($('#entry + div').find('.note-codable').val());

                    // Return focus to textarea and select newly inserted string to make it clear to the user
                    var lengthDiff = $('#entry + div').find('.note-codable').val().length - initialLength;
                    var newEnd = initialEnd + lengthDiff;/*
                    console.log(initialStart);
                    console.log(initialEnd);
                    console.log(initialLength);
                    console.log(lengthDiff);
                    console.log(newEnd);*/
                    codeEditor.setSelectionRange(initialStart, newEnd);
                }
                else {
                    alert("To insert classes in Code View, you must first select the opening tag of the element (e.g. <table>).");
                }

			}
			// Visual editor, API provides cursor position
			else {
				const range = $('#entry').summernote('editor.getLastRange');
				var targetNode = range.sc.parentNode;

                // Any position outside the editor should be rejected
				if (!$('.note-editing-area').has(targetNode).length) {
					alert("Cursor position could not be found in the editor. Click the target element in the editor and try again. If the issue persists, your text may not be wrapped in any HTML element.");
				}
				else {
                    // Add class
					$(targetNode).toggleClass(classArray[i]["name"]);
                    // Apply changes to master copy in case of immediate save
                    $('#entry').val($('#entry + div').find('.note-editable').html());

                    // Print status message
                    var status = '<em class="fadeout">Class "' + classArray[i]["name"] +'"';
                    status += ($(targetNode).hasClass(classArray[i]["name"])) ? ' added to ' : ' removed from ';
                    status += '<span style="font-variant: all-petite-caps;">' + $(targetNode).prop('nodeName') + '</span> element.</em>';
                    $('.note-status-output').html(status);
                    // Remove message
                    $('.note-status-output > .fadeout').fadeIn(500).delay(10000).fadeOut(400);
				}
			}
		});
	}

	/* ADD EVENTS FOR TOOLTIP INSERTER */
	var tooltipsModal = `
	<div class="modal note-modal tooltip-dialog in" aria-hidden="false" tabindex="-1" role="dialog" aria-label="Insert Extraordinary Tooltip">
		<div class="modal-dialog">
			<div class="modal-content">
            	<div class="modal-header">
					<button type="button" class="close float-right text-xl" data-dismiss="modal" aria-label="Close" aria-hidden="true">×</button>
					<h4 class="modal-title">Insert Extraordinary Tooltip</h4>
					<em><a href="https://salvatos.gitbook.io/kanka-cookbook/power-users/extraordinary-tooltips-user-guide" target="_blank">User guide (new tab)</a></em>
				</div>
				<div class="modal-body">
					<form id="tooltip-form">
						<div class="form-group note-form-group">
							<h5>Choose your trigger location:</h5>
							<input type="radio" id="tooltip-trigger-location1" name="tooltip-trigger-location" value="standalone" checked="">
							<label for="tooltip-trigger-location1" class="note-form-label">Standalone <em>(no other content on the same line)</em></label><br>
							<input type="radio" id="tooltip-trigger-location2" name="tooltip-trigger-location" value="inline">
							<label for="tooltip-trigger-location2" class="note-form-label">Inline <em>(shares a line with other content)</em></label>
						</div>
						<div class="form-group note-form-group">
							<h5>Should an icon be attached to the trigger?</h5>
							<input type="radio" id="tooltip-trigger-icon1" name="tooltip-trigger-icon" value="icon" checked="">
							<label for="tooltip-trigger-icon1" class="note-form-label">Show icon</label><br>
							<input type="radio" id="tooltip-trigger-icon2" name="tooltip-trigger-icon" value="no-icon">
							<label for="tooltip-trigger-icon2" class="note-form-label">No icon</label>
						</div>
						<div class="form-group note-form-group">
							<h5>Should the tooltip be fixed or affixed?</h5>
							<input type="radio" id="tooltip-mode1" name="tooltip-mode" value="fixed" checked="">
							<label for="tooltip-mode1" class="note-form-label">Fixed <em>(middle of screen)</em></label><br>
							<input type="radio" id="tooltip-mode2" name="tooltip-mode" value="affixed">
							<label for="tooltip-mode2" class="note-form-label">Affixed <em>(immediately under trigger)</em></label>
						</div>
						<div class="form-group note-form-group">
							<h5>What is your content source?</h5>
							<input type="radio" id="tooltip-source1" name="tooltip-source" value="entry" checked="">
							<label for="tooltip-source1" class="note-form-label">Entry <em>(entity mention)</em></label><br>
							<input type="radio" id="tooltip-source2" name="tooltip-source" value="attribute">
							<label for="tooltip-source2" class="note-form-label">Attribute <em>(attribute mention)</em></label>
						</div>
						<div class="form-group note-form-group">
							<label for="tooltip-wrapper-classes" class="note-form-label">Insert any additional classes for the tooltip wrapper below:</label>
							<input id="tooltip-wrapper-classes" class="form-control note-form-control note-input" type="text" value="">
						</div>
					</form>
					<div id="tooltip-demo">
						<h4>Live example:</h4>
						<output class="entity-content" contenteditable="true"></output>
						<em style="font-size: 13px;">You can type in this box to replace any of the text, even in the tooltip! Note that your changes will be discarded if you update any option in the form. Custom styling may differ due to modal context.</em>
					</div>
				</div>
				<div class="modal-footer">
					<h5>Please copy this code and paste it in the <u>code</u> editor: <input id="copycode" type="button" href="#_" class="btn2 btn-primary" value="Copy code"></h5>
					<output id="tooltip-output" name="tooltip-output" for="tooltip-form"><pre></pre></output>
				</div>
			</div>
		</div>
	</div>
	`;
	document.getElementsByClassName("note-editor")[0].insertAdjacentHTML("beforeend", tooltipsModal);
	// On Helper list item click, open modal, generate default code and force code view
	$("#ExT-Helper").on("click", function() {
		$(".tooltip-dialog").toggle();
		parseTooltips();
		// Do not activate code view if it’s already active, or changes will be discarded!
		if ($('#entry + div .note-codable').css('display') == "none") {
			$('#entry').summernote('codeview.activate');
		}
	});

    // On x click, close modal
	$(".tooltip-dialog .close").on("click", function() { $(".tooltip-dialog").toggle(); });
	// On input, update code
	$("#tooltip-form").on("input", parseTooltips);
	// Copy code to clipboard (no IE support)
	$("#copycode").on("click", function() {
		navigator.clipboard.writeText($("#tooltip-output > pre").text()).then(function() {
			alert("Code added to clipboard");
		}, function() {
			alert("Failed to save to clipboard");
		});
    });

    function parseTooltips() {
        // Hide icon?
        let iconString = ($('input[name="tooltip-trigger-icon"]:checked').val() == "no-icon") ? " no-icon" : "";
        // Affixed or fixed (default)?
        let modeString = ($('input[name="tooltip-mode"]:checked').val() == "affixed") ? "affixed" : "fixed";
        // Add custom classes?
        let wrapperClasses = $('input#tooltip-wrapper-classes').val();

        let tooltipString = ``;
        // Inline open?
        if ($('input[name="tooltip-trigger-location"]:checked').val() == "inline") {
            tooltipString += `<p class="ExT-inline">Text</p>\n`;
        }
        // Trigger
        tooltipString += `<span class="ExT-trigger` + iconString + `">Trigger</span>\n`;
        // Attribute or entry (default)?
        if ($('input[name="tooltip-source"]:checked').val() == "attribute") {
            tooltipString += `<div class="ExT-wrapper ExT-attribute ` + modeString + ` ` + wrapperClasses +  `">{attribute}</div>`;
        }
        else {
            tooltipString += `<div class="ExT-wrapper ExT-entry ` + modeString + ` ` + wrapperClasses +  `">\n<span class="ExT-wrap">\n[entity|field:entry]\n</span>\n</div>`;
        }
        // Inline close?
        if ($('input[name="tooltip-trigger-location"]:checked').val() == "inline") {
            tooltipString += `\n<p class="ExT-inline">Text</p>`;
        }

        // Show output
        $("#tooltip-output > pre").text(tooltipString);
        $("#tooltip-demo output").html(tooltipString);
    }

    /* ADD EVENTS FOR EASYTABS INSERTER */
	var easytabsModal = `
	<div class="modal note-modal easytabs-dialog in" aria-hidden="false" tabindex="-1" role="dialog" aria-label="Insert Easy Tabs">
		<div class="modal-dialog">
			<div class="modal-content">
            	<div class="modal-header">
					<button type="button" class="close float-right text-xl" data-dismiss="modal" aria-label="Close" aria-hidden="true">×</button>
					<h4 class="modal-title">Insert Easy Tabs</h4>
				</div>
				<div class="modal-body">
					<form id="easytabs-form">
						<div class="form-group note-form-group">
							<p>Your current tabs appear below, and you can edit their titles directly. Drag-and-drop their arrow icon to reorder them. The tabs’ contents must be edited in Summernote.</p>
							<output id="easytabs-items" style="padding-bottom: 10px;"></output>
                            <h5>Add or remove tabs:</h5>
                            <div style="display: flex; gap: 0 10px; margin-top: 15px; align-items: center;">
                                <select id="easytabs-remove" class="easytabs-select"></select>
                                <input id="easytabs-delete" type="button" href="#_" class="btn2 btn-error" value="Delete selected">
                                <input id="easytabs-add" type="button" href="#_" class="btn2 btn-primary" value="Add new tab">
                            </div>
						</div>
				</div>
				<div class="modal-footer">
                    <h5>Default tab:</h5>
                    <select id="easytabs-default" class="easytabs-select"></select>
                    <input id="easytabs-save" type="button" href="#_" class="btn2 btn-primary" value="Save and close">
				</div>
			</div>
		</div>
	</div>
	`;
	document.getElementsByClassName("note-editor")[0].insertAdjacentHTML("beforeend", easytabsModal);

	// On Helper list item click, open modal if in visual editor only
	$("#Easytabs-Helper").on("click", function() {
		if ($('#entry + div .note-codable').css('display') == "none") {
			$(".easytabs-dialog").toggle();
            grabEasytabs();
		}
        else {
            // Print error message in Summernote
            var status = "<em class='fadeout'>The Easy Tabs Helper is only available in Visual mode. Please close Code view and try again.</em>";
            $('.note-status-output').html(status);
            // Remove message
            $('.note-status-output > .fadeout').fadeIn(500).delay(10000).fadeOut(400);
        }
	});

    // Add tab
    $("#easytabs-add").on("click", function() {
        // Make a timestamp-based unique ID
        let newTabTime = "" + Date.now();
        newTabTime = newTabTime.substring(2);

        // Insert tab toggle at the end
        document.querySelector("#easytabs-items .easytabs-toggles").insertAdjacentHTML("beforeend", `<div class="easytabs-dragger">
                <div class="fa-solid fa-arrows-alt-h drag-handle easytabs-dragger"></div>
                <a href="#easytab-`+newTabTime+`" class="easytabs-tab" contenteditable>New Tab `+newTabTime+`</a>
            </div>`);
        // Add listener to update names in selects on input
        $("#easytabs-items .easytabs-toggles > div.easytabs-dragger:last-child .easytabs-tab").on("input", function() { updateEasytabNames(this.innerHTML, this.hash) });

        // Insert tab container at the start (to avoid replacing the default container, which has to be last in DOM)
        document.querySelector("#easytabs-items .easytabs-toggles").insertAdjacentHTML("afterend", `<div id="easytab-`+newTabTime+`" class="easytabs-content" data-new-easytab="new"></div>`);

        // Add tab to selects
        document.getElementById("easytabs-default").innerHTML += `<option value="#easytab-${newTabTime}">New Tab ${newTabTime}</option>`;
        document.getElementById("easytabs-remove").innerHTML += `<option value="#easytab-${newTabTime}">New Tab ${newTabTime}</option>`;
    });

    // Delete tab
    $("#easytabs-delete").on("click", function() {
        // Find the tab's id and destroy it and its content
        let removeTab = document.getElementById("easytabs-remove").value;
        document.querySelector("#easytabs-items .easytabs-tab[href='"+removeTab+"']").parentElement.remove();
        document.querySelector("#easytabs-items .easytabs-content"+removeTab).remove();
        // Also remove it from the selects
        document.querySelector("#easytabs-default option[value='"+removeTab+"']").remove();
        document.querySelector("#easytabs-remove option[value='"+removeTab+"']").remove();
    });

    // Close modal and discard changes on X
    $(".easytabs-dialog .close").on("click", closeEasytabsHelper);

     // Save and close
    $("#easytabs-save").on("click", function() {
        // Grab the content div that matches the default tab’s id and move it to the end of the group
        document.querySelector("#easytabs-items .easytabs").appendChild(document.querySelector("#easytabs-items .easytabs-content"+document.getElementById("easytabs-default").value));

        // If a tab’s content is empty, it hasn’t been changed by the user yet so we add a placeholder to facilitate editing
        let tabContents = document.querySelectorAll("#easytabs-items .easytabs-content[data-new-easytab='new']"); // Look only at those created in the current session
        tabContents.forEach((child , index) => {
            if (child.innerHTML == "") { // But make sure the user didn’t close the modal, edit stuff, then reopen the modal
                child.innerHTML = "<p>Contents of tab " + document.querySelector("#easytabs-items a[href='#" + child.id + "']").innerHTML + "</p>";
            }
        });

        // Remove all draggers and the sortable class for lighter output
        $(".easytabs-dragger a").detach().appendTo("#easytabs-items .easytabs-toggles"); // take the anchors out first
        $(".easytabs-dragger").remove();
        document.querySelector("#easytabs-items .easytabs-toggles").classList.remove("sortable-elements");

        // Remove existing tab group if any, then insert the new/updated one
        if (document.cloneSource) {
            document.cloneSource.remove();
        }
        $('#entry').summernote('insertNode', document.querySelector("#easytabs-items > .easytabs"));
        $('#entry').summernote('pasteHTML', "<p></p>"); // Add an empty paragraph after for easier escaping if there is no other content

        // Clean and close modal
        closeEasytabsHelper();
    });

    function grabEasytabs() {
        const range = $('#entry').summernote('editor.getLastRange');
        var targetNode = range.sc.parentNode;

        if (targetNode.classList.contains("easytabs")) { // Pointer on wrapper
            document.cloneSource = targetNode;
        }
        else if ($(targetNode).parents(".easytabs")[0]) { // Pointer inside wrapper
            document.cloneSource = $(targetNode).parents(".easytabs")[0];
        }
        // If editing a tab group, clear the output from previous uses of the modal and insert match
        if (document.cloneSource) {
            document.getElementById("easytabs-items").innerHTML = "";
            $(document.cloneSource).clone().appendTo("#easytabs-items");
            // wrap tabs in sortable draggers
            $( "#easytabs-items .easytabs-tab" ).wrap( "<div class='easytabs-dragger'></div>" );

            // Populate tab selectors (todo: would it be more optimized to make one then clone it? feels cleaner at any rate)
            let currentTabs = document.querySelectorAll("#easytabs-items .easytabs-tab");
            let tabSelect1 = document.getElementById("easytabs-default");
            let tabSelect2 = document.getElementById("easytabs-remove");
            currentTabs.forEach((child , index) => {
                tabSelect1.innerHTML += `<option value="${child.hash}">${child.innerHTML}</option>`;
                tabSelect2.innerHTML += `<option value="${child.hash}">${child.innerHTML}</option>`;

                // also give tabs handles for reordering and make them editable
                child.insertAdjacentHTML("beforebegin", `<div class="fa-solid fa-arrows-alt-h drag-handle easytabs-dragger"></div>`);
                child.contentEditable = true;
            }, tabSelect1, tabSelect2);

            // Listener: update names in selects on input
            $("#easytabs-items .easytabs-tab").on("input", function() { updateEasytabNames(this.innerHTML, this.hash) });
        }
        // Else, clear output and insert a new, empty tab container
        else {
            document.getElementById("easytabs-items").innerHTML = "<p><em>No Easy Tabs found at your cursor position. Click <strong>Add new tab</strong> below to create a new tab group, or close this modal and place your cursor in an existing one to edit it.</em></p>";
            document.getElementById("easytabs-items").insertAdjacentHTML("beforeend", `<div class="easytabs"><div class="easytabs-toggles"></div></div>`);
        }
        // Make tabs sortable
        document.querySelector("#easytabs-items .easytabs-toggles").classList.add("sortable-elements");
        document.querySelector("#easytabs-items .easytabs-toggles").setAttribute("data-handle", ".drag-handle");
        initSortable();
    }

    function updateEasytabNames(newName, uid) {
        // console.log("Looking for " + uid + " to change to " + newName);
        document.querySelector("#easytabs-default option[value='"+uid+"']").innerHTML = newName;
        document.querySelector("#easytabs-remove option[value='"+uid+"']").innerHTML = newName;
    }

    function closeEasytabsHelper() {
        $(".easytabs-dialog").toggle();
        // Clear cloneSource and tab selects for future uses of the modal
        document.cloneSource = null;
        document.getElementById("easytabs-default").innerHTML = "";
        document.getElementById("easytabs-remove").innerHTML = "";
    }


    // EXTRAS
    // Add a listener to each spoiler tag to save and apply its open/closed state
    // (otherwise they are only updated if other changes are made in the editor before saving)
    function addSpoilerListeners() {
        let spoilers = document.querySelectorAll('.html-editor + .note-editor details');
        spoilers.forEach((spoiler) => {
            spoiler.addEventListener('toggle', function() {
                $('.html-editor').val($('.html-editor + .note-editor .note-editable').html());
            });
        });
    }

    // Add listener to each existing spoiler tag
    addSpoilerListeners();

    // Add listener to new spoiler tags as they are created (wait 1 sec to make sure they are inserted before this runs)
    setTimeout(function() { $('.html-editor + .note-editor li[aria-label^="Spoiler block"]').on('click', addSpoilerListeners); }, 1000);
});
// ==UserScript==
// @name         THBlog
// @namespace    https://circlejourney.net/
// @version      0.8
// @description  Blog theme formatter for Toyhouse
// @author       Circlejourney
// @match        https://toyhou.se/~bulletins/*
// @icon         https://circlejourney.net/resources/images/favicon.png
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM.getValue
// @grant              GM.setValue
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/471992/THBlog.user.js
// @updateURL https://update.greasyfork.org/scripts/471992/THBlog.meta.js
// ==/UserScript==


(function() {
    'use strict';
    let isGenerated = false;
    const defaultTemplate = `<div class="card" style="overflow: hidden; {Wrapper_CustomCSS}">
        <div class="mb-0 rounded text-center" style="border-bottom-right-radius: 0; border-bottom-left-radius: 0; overflow:hidden; background-image:url({Header_BG}); background-size:{Header_BGSize}; background-position:{Header_BGPosition};">
            <div style="background:{HeaderOverlay_BG}; {HeaderOverlay_CustomCSS}">
        	    <div id="post-title" class="display-4" style="{Title_CustomCSS}">{Title}</div>
        	    <div id="post-mood" style="{Mood_CustomCSS}">{Mood}</div>
            </div>
        </div>
        <div class="card-block" id="post-body" style="{Body_CustomCSS}">
            {Body}
        </div>
        <div class="card-footer" id="post-tags" style="{Tags_CustomCSS}">
        {Tags}
        </div>
    </div>
    <div class="text-right" style="opacity: 0.7; font-size: 8pt;"><a href="https://greasyfork.org/en/scripts/471992-thblog">Install TH Blog Themer by Circlejourney</a></div>`;
    const css = `#THBlog {
    }
    #THBlog * {
    font-family: -apple-system,system-ui,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;
    }

    #THBlog_wrapper {
    display: flex;
    flex-wrap: wrap;
    }

    #THBlog .config_header {
    font-weight: normal;
    text-transform: uppercase;
    flex-basis: 100%;
    }

    #THBlog .section_header_holder {
    flex-basis: 50%;
    box-sizing: border-box;
    padding: 0.5rem;
    }

    #THBlog .section_header_holder#how-to {
    flex-basis: 100%;
    }

    #THBlog .section_header_holder#THBlog_section_2 {
    flex-basis: 100%;
    }

    #THBlog_section_2 textarea {
    font-size: 9pt;
    height: 10em;
    width: 100%;
    font-family: monospace;
    }

    #THBlog .section_header {
    margin-bottom: 0.5rem;
    font-weight: 300;
    text-transform: uppercase;
    border-radius: .25rem;
    background-color: var(--color-dark);
    }

    #THBlog .section_desc {
    margin-bottom: 0.5rem;
    font-size: 10pt;
    border-radius: .25rem;
    background-color: var(--color-light);
    }

    input {
    border-radius: .25rem;
    }

    #THBlog .field_label {
    font-size: 10pt;
    }

    #THBlog_buttons_holder {
    flex-basis: 100%;
    }`;

    let frame = document.createElement('div');
    document.body.appendChild(frame);

    const configObject = {
        'id': 'THBlog',
        'css': css,
        'title': "Customise Blog Theme",
        'frame': frame,

        'fields':
        {
            'DefaultTitle': {
                'label': "Placeholder title",
                "type": "text",
                "default": "New post",
                "section": ["Placeholder text"]
            },
            'DefaultMood': {
                'label': "Placeholder mood",
                "type": "text",
                "default": "Mood: It's a mystery",
            },
            'DefaultBody': {
                'label': "Placeholder post content",
                "type": "text",
                "default": "Write your post here."
            },
            'DefaultTags': {
                'label': "No tag placeholder text",
                "type": "text",
                "default": "No tags found",
            },
            'Wrapper_CustomCSS':
            {
                'label': 'Wrapper custom CSS',
                'type': 'text',
                'section': ['CSS customisations']
            },
            'Header_BG':
            {
                'label': 'Header background image',
                'type': 'text',
                'default': 'https://f2.toyhou.se/file/f2-toyhou-se/images/60724018_5JIbTcQVHT9nJA1.jpg'
            },
            'Header_BGSize': {
                'label': 'Header background size',
                'type': 'text',
                'default': 'cover'
            },
            'Header_BGPosition': {
                'label': 'Header background position',
                'type': 'text',
                'default': 'center'
            },
            'HeaderOverlay_BG': {
                'label': 'Header overlay colour',
                'type': 'text',
                'default': 'rgba(40,40,40,0.7)'
            },
            'HeaderOverlay_CustomCSS': {
                'label': 'Header custom CSS',
                'type': 'text',
                'default': 'padding:50px; color: white;'
            },
            'Title_CustomCSS': {
                'label': 'Title custom CSS',
                'type': 'text',
                'default': '',
            },
            'Mood_CustomCSS': {
                'label': 'Mood custom CSS',
                'type': 'text',
                'default': 'opacity: 0.6;',
            },
            'Body_CustomCSS': {
                'label': 'Body custom CSS',
                'type': 'text',
                'default': '',
            },
            'Tags_CustomCSS': {
                'label': 'Tags custom CSS',
                'type': 'text',
                'default': 'opacity: 0.6',
            },
            "Template": {
                "label": "",
                "type": "textarea",
                "default": defaultTemplate,
                "section": ["Template", "This part can be ignored, but it is included for those who want more control over their blog theme template. When you click \"Apply theme\", parts of this template are replaced with the contents of the h1, h2, and pre elements at the top of the source text: {Title} replaced with h1, {Mood} replaced with h2, {Tags} replaced with pre. {Body} is replaced with everything else after these template elements."]
            }
        },

        "events": {
            "save": function() {
                this.close();
                if(isGenerated) {
                    revert();
                    generate();
                }
            },
            "open": function() {
                $("#THBlog_header").after("<div class='section_header_holder' id='how-to'><p class='section_desc center'>How-to: In WYSIWYG mode, write your source text with a Heading 1 element at the top (the post title), followed by a Heading 2 element (the post mood), and then a Code element (the post tags). Everything after that will be assumed to be the post body. When you click \"Apply theme\", the post will be formatted automatically. All template parts are optional, and if not included in the source text, will be substituted with the placeholder text that you have set.</p><p>Do remember that changing the background colour to something other than the default may make text unreadable in some site themes&mdash;check it with different themes first!</p></div>");
                $("#THBlog_section_2").before( $("#THBlog_buttons_holder") );
            }
        }
    };

    const config = new GM_config(configObject);

    function generate(){
        let wasWYS = localStorage.froalaEnabled == 1;
        if(wasWYS) $(".wysiwyg-toggler")[0].click(); // Turn off WYSIWYG

        const HTMLCapture = $(".wysiwyg").val().match(/\s*(?:<h1>(.*)<\/h1>)?\s*(?:<h2>(.*)<\/h2>)?\s*(?:<pre>(.*)<\/pre>)?\s*([\S\s]*)/);

        const unformatted = HTMLCapture.slice(1);
        const title = unformatted[0] || config.get("DefaultTitle");
        const mood = unformatted[1] || config.get("DefaultMood");
        const tags = unformatted[2] ? unformatted[2].replace(/\s#/g, "&emsp;#") : config.get("DefaultTags");
        const body = unformatted[3] || config.get("DefaultBody");

        let replaceDictionary = {
            "Title": title,
            "Mood": mood,
            "Body": body,
            "Tags": tags,
            ...Object.fromEntries(
                Object.keys(config.fields).map( (k)=>[k, config.get(k)] )
            )
        };
        console.log(replaceDictionary);

        let post = config.get("Template");
        for(const [k,v] of Object.entries(replaceDictionary)) {
            post = v ? post.replace(`{${k}}`, v) : post;
        }

        $(".wysiwyg").val( post );
        const titleField = $(".profile-create-character-basics input[type='text']");
        if(!$(titleField).val() || $(titleField).val() !== title && confirm("Update title field?")) {
            const titleArr = title.split("");
            const newtitle = titleArr.reduce((a, c)=> (a+c).length >= 50 ? a : ((a+c).length >= 47 ? a+"..." : a+c));
            $(titleField).val(newtitle);
        }

        $("#gen-button").text("Revert to source").off("click").click(revert);
        $(".wysiwyg-toggler")[0].click(); // Turn WYSIWYG on on success
        isGenerated = true;
    }

    function revert() {
        const wasWYS = localStorage.froalaEnabled==1;
        if(wasWYS) $(".wysiwyg-toggler")[0].click(); // Turn WYSIWYG off
        if($(".wysiwyg").val().indexOf('id="post-title"') === -1) {
            if(wasWYS) $(".wysiwyg-toggler")[0].click(); // Turn WYSIWYG back on
            return false;
        }

        const domParser = new DOMParser();
        const postDOM = domParser.parseFromString($(".wysiwyg").val(), "text/html");
        const uglyTags = $(postDOM).find("#post-tags").html() == config.get("DefaultTags") ? "" : $(postDOM).find("#post-tags").html().trim().replace(/&emsp;/g, " ");
        const uglyTitle = $(postDOM).find("#post-title").html() == config.get("DefaultTitle") ? "" : $(postDOM).find("#post-title").html().trim();
        const uglyMood = $(postDOM).find("#post-mood").html() == config.get("DefaultMood") ? "" : $(postDOM).find("#post-mood").html().trim();
        const uglyPost = $(postDOM).find("#post-body").html() == config.get("DefaultBody") ? "" : $(postDOM).find("#post-body").html().trim();

        const post = (uglyTitle ? "<h1>"+uglyTitle+"</h1>" : "")
        + (uglyMood ? "<h2>"+uglyMood+"</h2>" : "")
        + (uglyTags ? "<pre>"+uglyTags+"</pre>" : "")
        + uglyPost;

        $(".wysiwyg").val( post );

        $("#gen-button").text("Apply theme").off("click").click(generate);
        if(wasWYS) $(".wysiwyg-toggler")[0].click(); // Turn WYSIWYG back on
        isGenerated = false;
    }
    $(document).ready( function() {
        isGenerated = $(".wysiwyg").val().indexOf('id="post-title"') !== -1
        const wasWYS = localStorage.froalaEnabled==1;
        if(wasWYS) $(".wysiwyg-toggler")[0].click(); // Turn WYSIWYG off

        const genButton = $("<a class='btn btn-primary mr-1' href='#' id='gen-button' onclick='event.preventDefault()'></a>").click(
            isGenerated ? revert : generate
        ).text(
            isGenerated ? "Revert to source" : "Apply theme"
        );
        const settingsBar = $('<div class="card mb-3"></div>').append(
            $('<div class="card-block bg-faded"></div>').append(genButton).append(
                $("<a class='btn btn-primary mr-1' href='#' onclick='event.preventDefault()'>Customise Blog Theme</a>")
                .click(function(){config.open()})
            )
        );
        $( $(".profile-create-character-basics")[2] ).before(settingsBar);
        if(wasWYS) $(".wysiwyg-toggler")[0].click(); // Turn WYSIWYG back on
    });
})();
// ==UserScript==
// @name         Old Emoji Menu
// @namespace    incelerated
// @version      0.10
// @description  Brings back the old emoji menu
// @author       incelerated
// @match        https://incels.is/threads/*
// @match        https://incels.is/members/*
// @match        https://incels.is/media/*
// @match        https://incels.is/conversations/*
// @match        https://incels.is/forums/*/post-thread
// @match        https://incels.is/chat/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428945/Old%20Emoji%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/428945/Old%20Emoji%20Menu.meta.js
// ==/UserScript==

//for overlay media we just do the hover thing, cause the HTML is loaded with ajax
if(document.location.href.indexOf('incels.is/media') != -1 && $(".itemList.js-lbContainer").length != 0){
    var css = `
    /* make it a block not a bar */
    .emojiList.js-emojiList:hover {
        flex-wrap: wrap !important;
    }

	/* remove unused scroll stuff */
	.uw_smileys_bar .hScroller-action.hScroller-action--end.is-active{
		display: none;
	}
	.uw_smileys_bar .uw_flex_container .uw_down_arrow{
		display: none;
	}
	.uw_smileys_bar .hScroller-scroll.th_scroller--end-active{
		mask-image: none;
	}

	.uw_smileys_bar .hScroller-scroll.is-calculated{
		margin-bottom: -50px !important;
	}

	/* push them a little to the left so they won't pop up when moving mouse to "post" button */
	.uw_smileys_bar .hScroller-scroll.is-calculated{
		width: 72.5%;
	}
	.fancybox-sidebar-content .hScroller-scroll.is-calculated{
		width: 90%;
	}`;

    if (typeof GM_addStyle !== "undefined"){
        GM_addStyle(css);
    }
    else{
        let styleNode = document.createElement("style");
        styleNode.appendChild(document.createTextNode(css));
        (document.querySelector("head") || document.documentElement).appendChild(styleNode);
    }

    return;
}

$(document).ready(function(){

    //inject our own callback function for emoji icon click
	FroalaEditor.COMMANDS.uwSmilie.callback = function(){
		var editor = $(this.el).parents(".message-editorWrapper");
        //for profile replies
		if(editor.length == 0){
			editor = $(this.el).parents(".editorPlaceholder-editor");
		}
        //for new thread
        if(editor.length == 0){
            editor = $(this.el).parents(".formRow--input");
        }
        //if emoji bar is still not moved, move it to the toolbar
		var emojiMenu = editor.find(".uw_smileys_bar");
        //some initializations
		if(!emojiMenu.hasClass("ready")){
			var toolbar = editor.find(".fr-toolbar").first();
            //remove stupid recently used duplicates
            emojiMenu.find(".js-emoji").each(function(){
                var name = $(this).attr("data-shortname");
                var duplicates = editor.find( "a[data-shortname=\"" + name + "\"]" );
                if(duplicates.length > 1){
                    duplicates.first().parent("li").remove();
                }
            });
            emojiMenu.mouseenter(function(){$(this).css("opacity", "1.0");});
            emojiMenu.mouseleave(function(){$(this).css("opacity", "0.5");});
            emojiMenu.addClass("ready").addClass("fr-popup");
			emojiMenu.appendTo(toolbar);
		}
        //emoji menu position
		var left = editor.find("i.fa-smile").offset().left - editor.offset().left;
		var top = editor.find(".fr-more-toolbar").position().top;
		emojiMenu.css("left", left).css("top", top).css("opacity", "1.0");
        emojiMenu.toggle();
	}

    //always show the smileys button in main toolbar
    $("[data-cmd='uwSmilie']").insertAfter("[data-cmd='insertImage']");

    //clicking anywhere hides the emoji menu
	$("body").click(function(e){
		if( $(e.target).parents(".uw_smileys_bar").length ){
			return;
		}
		$(".uw_smileys_bar").hide();
	});

    //styles
    var style = `
    <style type='text/css'>
    /* general styles of the emoji menu */
	.uw_smileys_bar{
		width: 242px !important;
		height: 250px !important;
		margin: 0 !important;
		position: absolute !important;
		display: none;
		border: none !important;
		z-index: 99 !important;
        overflow-x: hidden !important;
		overflow-y: auto !important;
	}
	div.uw_smileys_bar ul.emojiList.js-emojiList{
		flex-wrap: wrap !important;
	}
    /* fix bottom of text editor */
	.message-cell .fr-box.fr-basic, .formRow--input .fr-box.fr-basic{
		border-radius: 4px !important;
        border-style: solid !important;
        border-width: 1px !important;
		border-color: var(--input-border-heavy) var(--input-border-light) var(--input-border-light) var(--input-border-heavy) !important;
    }
    .message-cell .fr-box.fr-basic.is-focused, .formRow--input .fr-box.fr-basic.is-focused{
		--input-border-heavy: #fbfbfb !important;
		--input-border-light: #e6e6e6 !important;
    }
    /* fix for 2021 theme */
    .uix_commentsContainer .message-responseRow{
		overflow: visible !important;
	}
	/* hide unused stuff */
	div.uw_smileys_bar .hScroller-action, div.uw_smileys_bar span.uw_down_arrow.closed{
		display: none !important;
	}

    </style>
    `;

    //apply css styles
    $(style).appendTo("head");


});

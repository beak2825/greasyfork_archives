// ==UserScript==
// @name         Recipe Filter
// @version      0.12
// @description  Configurable filter for crafting and inscription recipes
// @author       jimborino
// @match        *://*.eternitytower.net/*
// @grant        none
// @run-at       document-start
// @namespace    https://greasyfork.org/users/156118
// @downloadURL https://update.greasyfork.org/scripts/371560/Recipe%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/371560/Recipe%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var STORAGE_KEY = "hiddenRecipes";
    var EDIT_MODE_CLASS = "recipe-hider-edit-mode";
    var HIDDEN_CLASS = "recipe-hider-hidden";

    var hiddenIds = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if(!hiddenIds) {
        hiddenIds = [];
    }

    var isEditing = false;

    var injectCss = `
        .${EDIT_MODE_CLASS} .recipe-container:hover .recipe-tooltip {
			visibility: hidden;
		}

		.recipe-container.${HIDDEN_CLASS} {
			display: none;
		}

		.${EDIT_MODE_CLASS} .recipe-container.${HIDDEN_CLASS} {
			display: block;
			background-color: rgba(255,0,0,0.5);
		}

        .${EDIT_MODE_CLASS} .recipe-container.uncraftable {
            cursor: pointer;
        }

	`;

    let meteorWait = setInterval(function() {
        if(window.Blaze) {
            Blaze._getTemplate("recipeIcon").onRendered(recipeRendered);
            Blaze._getTemplate("craftingPage").onRendered(listRendered);
            Blaze._getTemplate("inscriptionPage").onRendered(listRendered);

            // end edit mode when navigating to a new page
            Router.onRun(function() {
                if(isEditing) {
                    $("#recipe-filter-edit").toggle();
                    $("#recipe-filter-save").toggle();
                    isEditing = false;
                    $("body").removeClass(EDIT_MODE_CLASS);
                }
                this.next();
            });

            $("<style type='text/css' id='crafting-filter-styles'></style>")
                .text(injectCss)
                .appendTo("head");
            clearInterval(meteorWait);
        }
    }, 20);

    // can't get access to the crafting/inscription page template before it renders for the first time if we load on the crafting page
    let navTabsWait = setInterval(function() {
        if($(".nav-tabs").length > 0 || ( !window.location.href.includes("crafting") && !window.location.href.includes("inscription") )) {
            clearInterval(navTabsWait);
            appendEditToggle($(".nav-tabs").last());
            $(".nav-tabs").last().css("position", "relative");
        }
    }, 20);

    function recipeRendered() {
		let recipe = this.data.recipe;
        if(hiddenIds.includes(recipe.id)) {
            this.$(".recipe-container").addClass(HIDDEN_CLASS);
        }

        this.$(".recipe-container").click(function() {
			if(isEditing) {
				if(hiddenIds.indexOf(recipe.id) > -1)
					hiddenIds.splice(hiddenIds.indexOf(recipe.id), 1);
				else
					hiddenIds.push(recipe.id);

				$(this).toggleClass(HIDDEN_CLASS);
			}
		});
    }

    function listRendered() {
        let navTabs = this.$(".nav-tabs").last();
        navTabs.css("position", "relative");

        appendEditToggle(navTabs);
    }

    function appendEditToggle(element) {
        $("<div/>", {
            "id": "recipe-filter-edit",
            "css": { "position": "absolute",
                     "right": "1em",
                     "bottom": "0.5em",
                     "cursor": "pointer"
                 },
            "on": {
                "click": toggleEditMode
            },
            "text": "Edit Filter"
        }).appendTo(element);

        $("<div/>", {
            "id": "recipe-filter-save",
            "css": { "position": "absolute",
                     "right": "1em",
                     "bottom": "0.5em",
                     "cursor": "pointer",
                     "display": "none"
                 },
            "on": {
                "click": toggleEditMode
            },
            "text": "Save Filter"
        }).appendTo(element);
    }

    function toggleEditMode() {
        if(isEditing) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(hiddenIds));
        }
        isEditing = !isEditing;
        $("body").toggleClass(EDIT_MODE_CLASS);
        $("#recipe-filter-edit").toggle();
        $("#recipe-filter-save").toggle();
    }

})();
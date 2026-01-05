// ==UserScript==
// @name         VK Post Notes
// @namespace    http://tampermonkey.net/
// @version      0.19
// @description  Add the ability to add notes to any post + add categories to post + hide posts\categories
// @author       psxvoid
// @match        *://vk.com/*
// @grant         GM_addStyle
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_registerMenuCommand
// @noframes     true
// @license https://creativecommons.org/licenses/by-sa/4.0/
// @homepage  https://github.com/psxvoid/vkpostnotes
// @supportURL https://github.com/psxvoid/vkpostnotes/issues
// @downloadURL https://update.greasyfork.org/scripts/28602/VK%20Post%20Notes.user.js
// @updateURL https://update.greasyfork.org/scripts/28602/VK%20Post%20Notes.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //Additional facts:
    //1) The code is pretty ugly and break multiple good programming principles. Take care of your eyes.
    //2) The script saves notes to a local storage. It is not optimized.
    //3) It has no backup support for now, do not use it to store an important information.
    //4) It partially uses es6 features (not in the best way), so ensure that your browser is supporting it.
    // Have fun!

    GM_registerMenuCommand('Export Notes (JSON)', () => {
        const a = document.createElement('a');
        const data = notesStorage.getNotesAsString();
        a.href = "data:text/plain," + escape(data); // content
        a.download = "vkpostnotes.txt"; // file name
        a.click();
        // alert("Put script's main function here");
    }, 'r');

    GM_registerMenuCommand('Import Notes (JSON)', () => {
        const input = document.createElement('input');
        input.type = 'file';

        input.onchange = (e) => {
            var file = e.target.files[0];
            var reader = new FileReader();

            reader.onload = (onloadEvent) => {
                const content = unescape(onloadEvent.target.result);
                const contentOject = JSON.parse(content);

                notesStorage.import(contentOject);
                alert('Notes are successfully imported!');
            };

            reader.readAsText(file);
        };

        input.click();
    }, 'r');

    //Add google fonts. See: http://stackoverflow.com/questions/5751620/ways-to-add-javascript-files-dynamically-in-a-page
    let materialIconsStylesheet = document.createElement("link");
    materialIconsStylesheet.setAttribute("rel", "stylesheet");
    materialIconsStylesheet.setAttribute("type", "text/css");
    materialIconsStylesheet.setAttribute("href", "https://fonts.googleapis.com/icon?family=Material+Icons");
    document.getElementsByTagName("head")[0].appendChild(materialIconsStylesheet);

    //constants:
    const customNotesContainerClass = "post_custom_notes_container";
    const gmStorageKey = "gm_vk_post_custom_note";

    //helpers:
    let createElement = (htmlText) => {
        let element = document.createElement("div");
        element.innerHTML = htmlText;
        return element.firstChild;
    };

    let removeElement = (domElement) => {
        domElement.parentNode.removeChild(domElement);
    };

    //notes save\restore 
    class NotesStorage {
        constructor() {
            this.notesRuntimeCache = {};
            this.notes = [];
        }

        addRuntimeNoteToCache(runtimeNote) {

            this.notesRuntimeCache[runtimeNote.noteId] = runtimeNote;

            //try to restore the note data
            let note = this.findNoteById(runtimeNote.noteId);
            if (note != null) {
                runtimeNote.text = note.text;
                runtimeNote.category = note.category;
                runtimeNote.isPostHidden = note.isPostHidden;
            }
        }

        save() {
            //see: http://stackoverflow.com/questions/15730216/how-where-to-store-data-in-a-chrome-tampermonkey-script
            debugger;
            for (var runtimeNoteId in this.notesRuntimeCache) {
                let runtimeNote = this.notesRuntimeCache[runtimeNoteId],
                    noteIndex = this.getNoteIndex(runtimeNote.noteId),
                    note = this.getNoteByIndex(noteIndex),
                    noteShouldBeSaved = (runtimeNote.text && runtimeNote.text.length > 0) || (runtimeNote.category != null) || runtimeNote.isPostHidden === true,
                    newNote = null;

                if (noteShouldBeSaved) {
                    newNote = {
                        noteId: runtimeNote.noteId,
                        postId: runtimeNote.postId,
                        text: runtimeNote.text,
                        category: runtimeNote.category,
                        isPostHidden: runtimeNote.isPostHidden
                    };
                }
                if (note != null) {
                    //handle changed text:
                    if (noteShouldBeSaved) {
                        this.notes[noteIndex] = newNote;
                    } else {
                        //remove note
                        this.notes.splice(noteIndex, 1);
                    }
                } else {
                    //add new note:
                    if (noteShouldBeSaved) {
                        this.notes.push(newNote);
                    }
                }
            }
            let notesData = JSON.stringify(this.notes);
            GM_setValue(gmStorageKey, notesData);
        }

        getNotesAsString() {
            return JSON.stringify(this.notes);
        }

        //TODO: Broke single responsibility, move to other class
        hidePostsWithCategory(category) {
            let notesToHide = [];
            for (var runtimeNoteId in this.notesRuntimeCache) {
                let runtimeNote = this.notesRuntimeCache[runtimeNoteId];

                if (runtimeNote.category === category && runtimeNote.postDomElement != null) {
                    notesToHide.push(runtimeNote);
                }
            }

            for (let i = 0; i < notesToHide.length; ++i) {
                try {
                    //notesToHide[i].postDomElement.parentNode can be null here => exception will be thrown
                    removeElement(notesToHide[i].postDomElement);
                    notesToHide[i].postDomElement = null;

                } catch (ex) {
                    //try to delete it later
                    setTimeout(() => {
                        try {
                            removeElement(notesToHide[i].postDomElement);
                            notesToHide[i].postDomElement = null;
                        } catch (ex) {
                            console.log("!!! Can't remove post node !!!");
                        }

                    }, 500);
                }
            }
        }

        findNoteById(noteId) {
            //let result = this.notes.filter(function(note) {
            //return note.noteId === noteId;
            //return note.noteId === noteId && note.text && note.text.length > 0;
            //});

            let index = this.getNoteIndex(noteId);
            if (index >= 0) {
                return this.notes[index];
            }
        }

        getNoteIndex(noteId) {
            let index = -1;
            for (let i = 0; i < this.notes.length; ++i) {
                if (this.notes[i].noteId == noteId) {
                    index = i;
                    break;
                }
            }
            return index;
        }

        getNoteByIndex(index) {
            if (index != null && index >= 0) {
                return this.notes[index];
            }
        }

        load() {
            try {
                let notes = JSON.parse(GM_getValue(gmStorageKey));
                this.notes = notes;
            } catch (ex) {
                //GM_setValue(gmStorageKey, JSON.stringify([]));
                //this.notes = [];
                console.log("Failed to load notes!!!");
            }

        }

        import(notesObject) {
            this.notes = notesObject;
            this.save();
        }
    }


    class Lightbox {
        constructor() {
            this.element = null;
            this.postId = null;
        }

        setTextAreaElement(textAreaElement) {
            this.textAreaElement = textAreaElement;
        }

        show(runtimeNote) {
            this.postId = runtimeNote.postId;
            this.runtimeNote = runtimeNote;
            this.element.style.display = "block";
            if (runtimeNote.text && runtimeNote.text.length > 0) {
                this.textAreaElement.value = runtimeNote.text;
            } else {
                this.textAreaElement.value = "";
            }
        }
        hide() {
            this.postId = null;
            this.runtimeNote = null;
            this.element.style.display = "none";
        }
        save() {
            if (this.postId == null) return;
            let text = this.textAreaElement.value;
            if (text.length > 0) {
                this.runtimeNote.text = text;
                //change icon
                this.runtimeNote.addNoteElement.innerHTML = "description";
            } else {
                this.runtimeNote.text = null;
                this.runtimeNote.addNoteElement.innerHTML = "note_add";
            }
            notesStorage.save();
            this.hide();
        }
    }

    class RuntimeCategoryManager {
        constructor() {
            this["hiddenCategories"] = [];
        }
        markCategoryAsHidden(category) {
            if (this["hiddenCategories"].indexOf(category) < 0) {
                this["hiddenCategories"].push(category);
            }
        }
        isCategoryHidden(category) {
            return this["hiddenCategories"].indexOf(category) >= 0;
        }
    }

    //'global' variables
    let notesStorage = new NotesStorage(),
        lightbox = new Lightbox(),
        categoryManager = new RuntimeCategoryManager(),
        isObserving = false,
        isNextProcessingRequested = false;

    // Get PostId
    // 26.03.2017 20:04 The format is following: post50101872_500
    let getPostId = (post) => {
        return post.id;
    };

    let buildContainerId = (postId) => {
        return postId + "-custom-notes-container";
    };

    let buildNoteId = (postId) => {
        return postId + "-custom-note";
    };

    //TODO: Check if note text is already saved. If yes, then load text.
    let createNote = (postId, postDomElement) => {
        const addNoteButtonClass = "post-custom-note";
        const categoryButtonClass = "post-custom-note-change-category-button";
        const hideButtonClass = "post-hide-note-button";
        const blockButtonClass = "post-block-button";

        let addNoteButtonId = postId + "-custom-notes-add-note-button";
        let categoryButtonId = postId + "-custom-notes-category-note-button";
        let hideButtonId = postId + "-custom-notes-hide-category-button";
        let blockButtonId = postId + "-custom-notes-block-button";

        let categoryIconId = postId + "-custom-notes-category-icon",
            categoryIconClass = "post-custom-note-category-icon";

        let noteId = buildNoteId(postId);
        let noteContainerId = buildContainerId(postId);


        //Create "Custom Note" container
        // How to add? See : https://material.io/icons/#ic_note_add
        let containerElement = document.createElement("div");
        containerElement.id = noteId;
        containerElement.className = customNotesContainerClass;

        //Get category icon by category name
        //TODO: refactor
        let getCategoryIconHtml = (category) => {
            if (category === "cancel") {
                return "<i id='" + categoryIconId + "' class='material-icons " + categoryIconClass + "'>cancel</i>";
            }
            if (category === "done") {
                return "<i id='" + categoryIconId + "' class='material-icons " + categoryIconClass + "'>done</i>";
            }
            if (category === "active") {
                return "<i id='" + categoryIconId + "' class='material-icons " + categoryIconClass + "'>airplanemode_active</i>";
            }
            if (category === "question") {
                return "<i id='" + categoryIconId + "' class='material-icons " + categoryIconClass + "'>help_outline</i>";
            }
            if (category === "car0") {
                return "<i id='" + categoryIconId + "' class='material-icons " + categoryIconClass + "'>directions_car</i>";
            }
            if (category === "suspended") {
                return "<i id='" + categoryIconId + "' class='material-icons " + categoryIconClass + "'>hotel</i>";
            }
            return "";
        };


        //"add note" button
        let note = notesStorage.findNoteById(noteId);
        let buttonsHtml = "",
            categoryIcon = null;
        if (note == null) {
            buttonsHtml = '<i id="' + addNoteButtonId + '"class="material-icons ' + addNoteButtonClass + '">note_add</i>';
        } else {
            //note could be not empty when category is set that is why we need to verify "text" property
            if (note.text != null) {
                buttonsHtml = '<i id="' + addNoteButtonId + '"class="material-icons ' + addNoteButtonClass + '">description</i>';
            } else {
                buttonsHtml = '<i id="' + addNoteButtonId + '"class="material-icons ' + addNoteButtonClass + '">note_add</i>';
            }

            if (note.category != null) {
                categoryIcon = getCategoryIconHtml(note.category);
            }
        }
        buttonsHtml += '<i ' + hideButtonId + '" class="material-icons ' + hideButtonClass + '">visibility_off</i>';
        buttonsHtml += '<i ' + categoryButtonId + '" class="material-icons ' + categoryButtonClass + '">group_work</i>';
        buttonsHtml += '<i ' + blockButtonId + '" class="material-icons ' + blockButtonClass + '">block</i>';

        if (categoryIcon != null) {
            buttonsHtml += categoryIcon;
        }

        containerElement.innerHTML = buttonsHtml;
        let addNoteButtonElement = containerElement.getElementsByClassName(addNoteButtonClass)[0];
        let changeCategoryButtonElement = containerElement.getElementsByClassName(categoryButtonClass)[0];
        let categoryIconElement = containerElement.getElementsByClassName(categoryIconClass)[0];
        let hideButtomElement = containerElement.getElementsByClassName(hideButtonClass)[0];
        let blockButtomElement = containerElement.getElementsByClassName(blockButtonClass)[0];


        let runtimeNote = {
            "noteId": noteId,
            "postId": postId,
            "text": null,
            "category": null,
            "postDomElement": postDomElement,
            "containerElement": containerElement,
            "addNoteElement": addNoteButtonElement,
            "categoryElement": changeCategoryButtonElement,
            "categoryIconElement": categoryIconElement,
            "hideButtomElement": hideButtomElement,
            "blockButtomElement": blockButtomElement
        };

        addNoteButtonElement.onclick = (e) => {
            e.stopPropagation();
            lightbox.show(runtimeNote);
        };

        hideButtomElement.onclick = (e) => {
            e.stopPropagation();
            if (runtimeNote.category != null) {
                categoryManager.markCategoryAsHidden(runtimeNote.category);
                notesStorage.hidePostsWithCategory(runtimeNote.category);
            }
        };

        blockButtomElement.onclick = (e) => {
            e.stopPropagation();
            runtimeNote.isPostHidden = true;
            notesStorage.save();
            removeElement(runtimeNote.postDomElement);
        };

        changeCategoryButtonElement.onclick = (e) => {
            e.stopPropagation();
            //TODO: Change category id
            //runtimeNote
            if (runtimeNote.category == null) {
                runtimeNote.category = "cancel";
            } else
            if (runtimeNote.category === "cancel") {
                runtimeNote.category = "done";
            } else
            if (runtimeNote.category === "done") {
                runtimeNote.category = "suspended";
            } else
            if (runtimeNote.category === "suspended") {
                runtimeNote.category = "question";
            } else
            if (runtimeNote.category === "question") {
                runtimeNote.category = "car0";
            } else
            if (runtimeNote.category === "car0") {
                runtimeNote.category = null;
            } else {
                runtimeNote.category = null;
            }


            //process dom changes
            if (runtimeNote.category != null) {
                let newElement = createElement(getCategoryIconHtml(runtimeNote.category));
                if (runtimeNote.categoryIconElement == null) {
                    //there wasn't category set before
                    containerElement.appendChild(newElement);
                } else {
                    //a category was set before
                    containerElement.replaceChild(newElement, runtimeNote.categoryIconElement);
                }
                runtimeNote.categoryIconElement = newElement;
            } else {
                containerElement.removeChild(runtimeNote.categoryIconElement);
                runtimeNote.categoryIconElement = null;
            }

            notesStorage.save();
        };

        //Add note object to notes:
        notesStorage.addRuntimeNoteToCache(runtimeNote);

        return runtimeNote;
    };

    let createLightboxElement = () => {
        //see: http://stackoverflow.com/questions/11668111/how-do-i-pop-up-a-custom-form-dialog-in-a-greasemonkey-script
        let template =
            '<div id="gmPopupContainer">' +
            '<form> <!-- For true form use method="POST" action="YOUR_DESIRED_URL" -->' +
            //'<input type="text" id="myNumber1" value=""/>' +
            //'<input type="text" id="myNumber2" value=""/>' +
            '<textarea rows="15" cols="50" id="gm-dlg-post-custom-note-textarea"/></textarea>' +

            '<p id="myNumberSum">&nbsp;</p>' +
            '<button id="gmSaveDlgBtn" class="gmSaveDlgBtnClass" type="button">Save</button>' +
            '<button id="gmCloseDlgBtn" class="gmCloseDlgBtnClass" type="button">Close popup</button>' +
            '</form>' +
            '</div>';
        let lightboxElement = document.createElement("div");
        lightboxElement.innerHTML = template;
        lightboxElement.style.display = "none";

        let saveButtonElement = lightboxElement.getElementsByClassName("gmSaveDlgBtnClass")[0];
        let closeButtonElement = lightboxElement.getElementsByClassName("gmCloseDlgBtnClass")[0];
        closeButtonElement.onclick = (e) => {
            e.stopPropagation();
            lightbox.hide();
        };
        saveButtonElement.onclick = (e) => {
            e.stopPropagation();
            lightbox.save();
        };


        lightbox.element = lightboxElement;
        document.body.appendChild(lightboxElement);
        lightbox.setTextAreaElement(document.getElementById("gm-dlg-post-custom-note-textarea"));

        //--- CSS styles make it work...
        //see: http://stackoverflow.com/questions/1360194/gm-addstyle-not-working
        GM_addStyle("#gmPopupContainer{	position: fixed;top: 30%;left: 20%;padding: 2em;background: powderblue;border: 3pxdoubleblack;border-radius: 1ex;z-index: 777;} #gmPopupContainerbutton{cursor: pointer;margin: 1em1em0;border: 1pxoutsetbuttonface;}");
    };
    createLightboxElement();

    let processDom = () => {
        isObserving = true;

        //Get all posts
        let posts = document.getElementsByClassName("post");
        for (let i = 0; i < posts.length; ++i) {
            let postId = getPostId(posts[i]);
            let postHeader = posts[i].getElementsByClassName("post_header_info")[0];
            let postNoteContainer = postHeader.getElementsByClassName(customNotesContainerClass)[0];

            if (postNoteContainer == null) {
                //container is not created yet, create it:
                let runtimeNote = createNote(postId, posts[i]);
                if (runtimeNote.isPostHidden === true || categoryManager.isCategoryHidden(runtimeNote.category)) {
                    removeElement(runtimeNote.postDomElement);
                } else {
                    postHeader.appendChild(runtimeNote.containerElement);
                }

            }
        }

        setTimeout(() => {
            if (isNextProcessingRequested) {
                isNextProcessingRequested = false;
                processDom();
            }
        }, 100);

    };


    notesStorage.load();
    processDom();

    //See: https://greasyfork.org/en/scripts/22457-remove-ad-posts-from-vk-com/code
    //See: http://stackoverflow.com/a/14570614
    var observeDOM = (function () {
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
            eventListenerSupported = window.addEventListener;

        return function (obj, callback) {
            if (MutationObserver) {
                // define a new observer
                var obs = new MutationObserver(function (mutations, observer) {
                    //if(mutations[0].addedNodes.length || mutations[0].removedNodes.length)
                    if (mutations[0].addedNodes.length)
                        if (isObserving) {
                            isNextProcessingRequested = true;
                            return;
                        }
                    callback();
                });
                // have the observer observe foo for changes in children
                obs.observe(obj, {
                    childList: true,
                    subtree: true
                });
            } else if (eventListenerSupported) {
                obj.addEventListener('DOMNodeInserted', callback, false);
                //obj.addEventListener('DOMNodeRemoved', callback, false);
            }
        };
    })();
    let containers = document.querySelectorAll('body');
    let n = containers.length;
    for (let i = 0; i < n; ++i) {
        let d = containers[i];
        //TODO: Uncomment, performance issues
        observeDOM(d, processDom);
    }
})();
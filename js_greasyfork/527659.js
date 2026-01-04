// ==UserScript==
// @name         [AO3] Kat's Tweaks: Bookmarking
// @author       Katstrel
// @description  Bookmark tracking, tagging, and more.
// @version      1.0.2
// @history      1.0.2 - fixed list page series blurbs from not displaying bookmark style
// @history      1.0.1 - disabled comment tag feature and buttons at the top of series pages
// @namespace    https://github.com/Katstrel/Kats-Tweaks-and-Skins
// @include      https://archiveofourown.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archiveofourown.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527659/%5BAO3%5D%20Kat%27s%20Tweaks%3A%20Bookmarking.user.js
// @updateURL https://update.greasyfork.org/scripts/527659/%5BAO3%5D%20Kat%27s%20Tweaks%3A%20Bookmarking.meta.js
// ==/UserScript==
"use strict";
let DEBUG = false;

// তততততততত SETTINGS তততততততত //

let SETTINGS = {
    bookmarking: {
        enabled: true,
        dateFormat: "Month/Year",
        defaultNote: "No Notes",
        details: "Tracking",
        includeFandom: false,
        newBookmarksPrivate: true,
        newBookmarksRec: false,
        hideDefaultToreadBtn: true,
        showUpdatedBookmarks: true,
        databaseInfo: [
            {
                keyID: "Bookmarked",
                tagLabel: "Bookmarked",
                enabled: true,
            },
            {
                keyID: "Checked",
                tagLabel: "Checked",
                enabled: true,
            },
            {
                keyID: "Commented",
                tagLabel: "Commented",
                enabled: false,
            },
            {
                keyID: "Kudosed",
                tagLabel: "Kudosed",
                enabled: false,
            },
            {
                keyID: "Series",
                tagLabel: "Series",
                enabled: true,
            },
            {
                keyID: "Subscribed",
                tagLabel: "Subscribed",
                enabled: false,
            },
        ],
        databaseTags: [
            {
                keyID: "toread",
                tagLabel: "To Read",
                posLabel: "📚 Mark as To Read",
                negLabel: "🧹 Remove from To Read",
                btnHeader: true,
                btnFooter: false,
            },
            {
                keyID: "awaitupdate",
                tagLabel: "Awaiting Update",
                posLabel: "📖 Add to Awaiting Update",
                negLabel: "📕 Remove from Awaiting Update",
                btnHeader: false,
                btnFooter: true,
            },
            {
                keyID: "finished",
                tagLabel: "Finished Reading",
                posLabel: "✔️ Mark as Finished",
                negLabel: "🗑️ Remove from Finished",
                btnHeader: false,
                btnFooter: true,
            },
            {
                keyID: "favorite",
                tagLabel: "Favorite",
                posLabel: "❤️ Add to Favorites",
                negLabel: "💔 Remove from Favorites",
                btnHeader: true,
                btnFooter: true,
            },
        ],
        databaseWord: [
            {
                keyID: "short",
                tagLabel: "Short Story | Under 10k",
                wordMin: 0,
                wordMax: 10000,
            },
            {
                keyID: "novella",
                tagLabel: "Novella | 10k to 50k",
                wordMin: 10000,
                wordMax: 50000,
            },
            {
                keyID: "novel",
                tagLabel: "Novel | 50k to 100k",
                wordMin: 50000,
                wordMax: 100000,
            },
            {
                keyID: "longfic",
                tagLabel: "Longfic | Over 100k",
                wordMin: 100000,
                wordMax: Infinity,
            },
        ],
    }
};

// তততততত STOP SETTINGS তততততত //

class Bookmarking {
    constructor(settings, moduleID) {
        this.id = moduleID;
        this.settings = settings.bookmarking;
        this.request = new RequestManager();
        this.storage = new StorageManager();
        this.username = localStorage.getItem("KT-SavedUsername");

        this.divider = "\nতততততততততত";
        this.descrip = "\n⟡˖*°࿐ ✦ Summary:";

        this.storage.init(`${this.id}-INFO-Bookmarked`);
        this.storage.init(`${this.id}-INFO-Checked`);
    }

    getBookmarkData() {
        return {
            workId: this.workID,
            id: this.bookmarkID,
            pseudId: this.pseudID,
            items: this.dataItems,
            notes: this.notes,
            tags: this.tags,
            collections: this.collections,
            isPrivate: this.private,
            isRec: this.rec
        };
    }

    getDataItem(dataItems, index) {
        let value = Array.from(dataItems[index].querySelectorAll('li.added.tag')).map(element => {
            return element.textContent.slice(0, -2).trim();
        });
        return value;
    }

    getWordCount(blurb) {
        let words = blurb.querySelector('dd.words').innerText;
        if (words.includes(",")) {
            words = words.replaceAll(",", ""); 
        }
        if (words.includes(" ")) {
            words = words.replaceAll(" ", "");
        }
        if (words.includes(" ")) {
            words = words.replaceAll(/\s/g, ""); 
        }
    
        let wordsINT = parseInt(words);
        DEBUG && console.log(`[Kat's Tweaks] Work Word Count: ${wordsINT}`);
        return wordsINT;
    }

    makeNotes() {
        let note = `${this.userNotes}`;
        note += `${this.divider}`;
        if (!this.isSeries) {
            note += `\nLast Read: ${this.getTime()} \(${this.chapter}\)`;
        }

        // Tracking Block
        note += `\n\<details\>\<summary\>${this.settings.details}\</summary\>`;
        if (!this.isSeries && this.settings.includeFandom) {
            note += `\nFandom: ${unzipArray(this.fandom)}`;
        }
        note += `\nAuthor: ${unzipArray(this.author)}`;
        note += `\nTitle: \<a href="https://archiveofourown.org/${this.isSeries ? 'series' : 'works'}/${this.workID}"\>${this.title}\</a\>`;
        if (!this.isSeries) {
            note += `\nSeries: ${unzipArray(this.series)}`;
        }

        // Summary Block
        note += `${this.descrip}\<blockquote\>${this.summary}\</blockquote\>\</details\>`;
        return note

        function unzipArray(array) {
            let x = "";
            for (let i = 0; i < array.length; i++) {
                x += `\<a href="${array[i].href}"\>${array[i].innerText}\</a\> `;
            }
            return x;
        }
    }

    updateStorage(blurb, storageID, tags) {
        // Info Tags
        this.settings.databaseInfo.slice(2).forEach(({keyID, tagLabel}) => {
            this.storage.init(`${this.id}-INFO-${keyID}`);
            const isTagged = tags.includes(tagLabel);
            if (isTagged) {
                this.storage.addIdToCategory(`${this.id}-INFO-${keyID}`, storageID);
                blurb.classList.add(`${this.id}-INFO-${keyID}`);
            }
            else {
                this.storage.removeIdFromCategory(`${this.id}-INFO-${keyID}`, storageID);
            }
        });

        // Database Tags
        this.settings.databaseTags.forEach(({keyID, tagLabel}) => {
            this.storage.init(`${this.id}-TAGS-${keyID}`);
            const isTagged = tags.includes(tagLabel);
            if (isTagged) {
                this.storage.addIdToCategory(`${this.id}-TAGS-${keyID}`, storageID);
                blurb.classList.add(`${this.id}-TAGS-${keyID}`);
            }
            else {
                this.storage.removeIdFromCategory(`${this.id}-TAGS-${keyID}`, storageID);
            }
        });
    }

    statusTags(blurb, wordCount) {
        const tagComplete = "Complete";
        if (!this.isSeries) {
            if (document.getElementsByClassName("status").length != 0) {
                // for multichapters
                if (document.getElementsByClassName("status")[0].innerHTML == "Completed:") {
                    console.log(`[Kat's Tweaks] Adding tag: ${tagComplete}`);
                    blurb.querySelector('#bookmark_tag_string_autocomplete').value = `${tagComplete}, `;
                    this.tags.push(tagComplete);
                }
            }
            else {
                // for single chapter fics
                console.log(`[Kat's Tweaks] Adding tag: ${tagComplete}`);
                blurb.querySelector('#bookmark_tag_string_autocomplete').value += `${tagComplete}, `;
                this.tags.push(tagComplete);
            }
        }
        else {
            console.log(`[Kat's Tweaks] Adding tag: Series`);
            blurb.querySelector('#bookmark_tag_string_autocomplete').value += `${'Series'}, `;
            this.tags.push('Series');
            if (blurb.querySelector('dl.stats').innerHTML.includes('Yes')) {
                console.log(`[Kat's Tweaks] Adding tag: ${tagComplete}`);
                blurb.querySelector('#bookmark_tag_string_autocomplete').value += `${tagComplete}, `;
                this.tags.push(tagComplete);
            }
        }

        this.settings.databaseWord.forEach(({tagLabel, wordMin, wordMax}) => {
            if (wordMin <= wordCount && wordCount < wordMax) {
                console.log(`[Kat's Tweaks] Adding tag: ${tagLabel}`);
                blurb.querySelector('#bookmark_tag_string_autocomplete').value += `${tagLabel}, `;
                this.tags.push(tagLabel);
            }
        });
    }

    formNoteButtons(scope, query, workID, descrip, summary, notes, isBlurb) {
        if (this.workID == this.bookmarkID) { return; }
        const summaryWork = this.isSeries ? document.querySelector("dl.series.meta.group blockquote.userstuff") : document.querySelector("div.preface.group div.summary.module blockquote.userstuff");
        const summaryChap = this.isSeries ? "No Chapter Summary" : document.querySelector("div.chapter.preface.group div.summary.module blockquote.userstuff");
        let newNotes = notes;
        let id = this.id;
        
        // Update the chapter on works
        if (!isBlurb && !this.isSeries) {
            scope.querySelector('#notes-field-description').after(Object.assign(document.createElement('input'), {
                type: 'button',
                id: `${id}-${workID}-savechapter`,
                class: `${id}-formButton`,
                value: `🔖 Update Last Read`,
            }));
            
            // Add Click Listeners
            let genNote = this.makeNotes();
            scope.querySelectorAll(`#${id}-${workID}-savechapter`).forEach(button => {
                button.addEventListener('click', (event) => {
                    event.preventDefault();
                    
                    newNotes = genNote;
                    DEBUG && console.log(`[Kat's Tweaks] Updating Last Read.`, newNotes);
                    scope.querySelector(query).innerHTML = newNotes;

                    button.value = `🎉 Last Read Updated!`;
                });
            });
        }

        // Update summary if available
        if ((summaryWork && !(summaryWork == summaryChap)) || isBlurb) {
            scope.querySelector('#notes-field-description').after(Object.assign(document.createElement('input'), {
                type: 'button',
                id: `${id}-${workID}-summary`,
                class: `${id}-formButton`,
                value: `🖋️ Update Summary`,
            }));

            // Add Click Listeners
            scope.querySelectorAll(`#${this.id}-${workID}-summary`).forEach(button => {
                button.addEventListener('click', (event) => {
                    event.preventDefault();
                    
                    newNotes = `${newNotes.split(descrip)[0]}${descrip}<blockquote>${summary}</blockquote></details>`;
                    DEBUG && console.log(`[Kat's Tweaks] Updating Summary.`, newNotes);
                    scope.querySelector(query).innerHTML = newNotes;

                    button.value = `🎉 Summary Updated!`;
                });
            });
        }

        // Remove buttons when textbox is highlighted due to mirror
        [ "change", "keydown", "keyup", "mousedown", "mouseup" ].forEach(function(event) {
            scope.querySelector(query).addEventListener(event, function(e) {
                if (document.getElementById(`${id}-${workID}-summary`)) {
                    document.getElementById(`${id}-${workID}-summary`).remove();
                }
                if (document.getElementById(`${id}-${workID}-savechapter`)) {
                    document.getElementById(`${id}-${workID}-savechapter`).remove();
                }
            });
        });
    }

    formTagButtons(blurb, workID) {
        let form = blurb.querySelector('#bookmark-form');
        form.querySelector('#tag-string-description').after(Object.assign(document.createElement('div'), {
            id: `${this.id}-tags-${workID}`,
            className: `${this.id}-tagContainer`,
        }));
        let tags = this.getDataItem((form.querySelectorAll('#bookmark-form form dd')), 1);
        let tagInputBox = form.querySelector('.input #bookmark_tag_string_autocomplete');
        let tagContainer = document.getElementById(`${this.id}-tags-${workID}`);
        tagContainer.append(Object.assign(document.createElement('br')));
    
        // Create the buttons
        this.settings.databaseTags.forEach(({keyID, tagLabel, posLabel, negLabel}) => {
            const isTagged = tags.includes(tagLabel);
            let button = Object.assign(document.createElement('input'), {
                type: 'button',
                id: `${this.id}-${workID}-${keyID}-btnForm`,
                class: `${this.id}-formButton`,
                value: `${isTagged ? negLabel : posLabel}`,
            });
            if (button.value == posLabel) {
                tagContainer.append(button);
            }
        });
    
        // Add event listeners
        this.settings.databaseTags.forEach(({keyID, tagLabel, posLabel, negLabel}) => {
            const buttons = document.querySelectorAll(`#${this.id}-${workID}-${keyID}-btnForm`);
            buttons.forEach((button) => {
                button.addEventListener('click', (event) => {
                    event.preventDefault();
                    const isTagged = tags.includes(tagLabel);
    
                    if (isTagged) {
                        DEBUG && console.log(`[Kat's Tweaks] Removing ${tagLabel} from the input box.`);
                        if (tagInputBox.value) {
                            tagInputBox.value = `${tagInputBox.value.split(`${tagLabel}, `)[0]}${tagInputBox.value.split(`${tagLabel}, `)[1]}`;
                        }
                        tags.splice(tags.indexOf(tagLabel), 1);
                    }
                    else {
                        DEBUG && console.log(`[Kat's Tweaks] Adding ${tagLabel} to the input box.`);
                        tagInputBox.value += `${tagLabel}, `;
                        tags.push(tagLabel);
                    }
    
                    buttons.forEach((btn) => {
                        btn.value = isTagged ? posLabel : negLabel;
                    });
                });
            });
        });
    }

    async requestHandler(bookmarkData, workID, forceBookmarkPage) {
        const authenticityToken = this.getAuthenticityToken();
        if (workID !== this.bookmarkID) {
            await this.request.updateBookmark(this.bookmarkID, authenticityToken, bookmarkData);
            if (forceBookmarkPage) {
                window.location.href = `https://archiveofourown.org/bookmarks/${this.bookmarkID}`;
            }
            DEBUG && console.log(`[Kat's Tweaks] Updated bookmark ID: ${this.bookmarkID}`);
        }
        else {
            bookmarkData.isPrivate = this.settings.newBookmarksPrivate;
            bookmarkData.isRec = this.settings.newBookmarksRec;
            this.bookmarkID = await this.request.createBookmark(workID, authenticityToken, bookmarkData);
            window.location.href = `https://archiveofourown.org/bookmarks/${this.bookmarkID}`;
            DEBUG && console.log(`[Kat's Tweaks] Created bookmark ID: ${this.bookmarkID}`);
        }
    }

    // Retrieve the authenticity token from a meta tag
    getAuthenticityToken() {
        const metaTag = document.querySelector('meta[name="csrf-token"]');
        return metaTag ? metaTag.getAttribute('content') : null;
    }
}

class BookPage extends Bookmarking {
    constructor(settings, moduleID) {
        super(settings, moduleID);
        this.bmForm = document.getElementById('bookmark-form');
        this.bmNotes = document.getElementById('bookmark_notes');
        this.bmTags = document.getElementById('bookmark_tag_string_autocomplete');
        this.blurb = document.querySelector('dl.meta.group');
        if (document.querySelector('dl.series.meta.group')) { this.isSeries = true; }
        DEBUG && console.log(`[Kat's Tweaks] Bookmark form found. Is series: ${this.isSeries}`);

        this.workID = document.URL.split('/')[4].split('#')[0].split('?')[0];
        this.storageID = this.isSeries ? `${this.workID}S` : this.workID;
        this.userNotes = this.getUserNotes();
        this.timestamp = this.getTime();
        this.chapter = this.getChapter();
        this.fandom = this.isSeries ? "No Fandom" : document.querySelectorAll("dd.fandom.tags li a");
        this.author = this.isSeries ? document.querySelectorAll('dl.series.meta.group dd a[rel="author"]') : document.querySelectorAll("div.preface.group h3.byline.heading a");
        this.title = this.isSeries ? document.querySelector("h2.heading").innerText : document.querySelector("div.preface.group h2.title.heading").innerText;
        this.series = document.querySelectorAll("dl.work.meta.group span.series span.position a");
        this.summary = this.getSummary();
        this.words = this.getWordCount(this.blurb);

        this.bookmarkID = document.querySelector('div#bookmark_form_placement form') ? document.querySelector('div#bookmark_form_placement form').getAttribute('action').split('/')[2] : null;
        this.pseudID = this.getPseudID();
        this.dataItems = document.querySelectorAll('#bookmark-form form dd');
        this.notes = this.bmNotes.innerText;
        this.tags = this.getDataItem(this.dataItems, 1);
        this.collections = this.getDataItem(this.dataItems, 2);
        this.private = document.querySelector('#bookmark_private').checked;
        this.rec = document.querySelector('#bookmark_rec').checked;;

        if (this.workID == this.bookmarkID) {
            DEBUG && console.log(`[Kat's Tweaks] Not bookmarked! WorkID: ${this.workID} | BookmarkID: ${this.bookmarkID}`);
            this.private = this.settings.newBookmarksPrivate;
            this.rec = this.settings.newBookmarksRec;
            document.getElementById('bookmark_private').checked = this.private;
            document.getElementById('bookmark_rec').checked = this.rec;

            this.storage.removeIdFromCategory(`${this.id}-INFO-Bookmarked`, this.storageID);
        } 
        else {
            DEBUG && console.log(`[Kat's Tweaks] BookmarkID found for ${this.storageID}`);
            this.storage.addIdToCategory(`${this.id}-INFO-Bookmarked`, this.storageID);
            this.blurb.classList.add(`${this.id}-INFO-Bookmarked`);
        }

        DEBUG && console.log(`[Kat's Tweaks] Initialized Bookmarking Page with bookmark data:`);
        DEBUG && console.table({
            workId: this.workID,
            id: this.bookmarkID,
            pseudId: this.pseudID,
            items: this.dataItems,
            notes: this.notes,
            tags: this.tags,
            collections: this.collections,
            isPrivate: this.private,
            isRec: this.rec,

            userNotes: this.userNotes,
            time: this.timestamp,
            chap: this.chapter,
            fandom: this.fandom,
            author: this.author,
            title: this.title,
            series: this.series,
            summary: this.summary,
            words: this.words,
            makeNotes: this.makeNotes(),
        });

        if (document.querySelector('ul.work.navigation.actions li.mark') && this.settings.hideDefaultToreadBtn) {
            document.querySelector('ul.work.navigation.actions li.mark').remove();
        }

        if (!this.bmNotes.innerText.includes((this.divider).slice('\n')[1])) {
            this.bmNotes.innerHTML = this.makeNotes();
            this.notes = this.makeNotes();
        }

        this.statusTags(document, this.words);
        this.updateStorage(this.blurb, this.storageID, this.tags);

        if (!this.isSeries) {
            //this.buttonComment(this.settings.databaseInfo[2].enabled);
            this.buttonKudos(this.settings.databaseInfo[3].enabled);
            this.buttonSubscribe(this.settings.databaseInfo[5].enabled);
            this.buttonTags(this.storageID, this.getBookmarkData());
            this.buttonLastRead(this.getBookmarkData());
        }

        this.formNoteButtons(document, "#bookmark_notes", this.workID, this.descrip, this.summary, this.notes);
        this.formTagButtons(document, this.workID);
    }

    buttonLastRead(bookmarkData) {
        const footer = document.querySelector('div#feedback ul.actions');
        let button = Object.assign(document.createElement('a'), {
            id: `${this.id}-SaveChapter-btn`,
            href: '#',
            innerText: `🔖 Save Chapter`,
        });
        let container = Object.assign(document.createElement('li'));
        container.append(button);
        if (!this.isSeries) {
            footer.append(container);
        }

        // Add Click Listeners
        let genNote = this.makeNotes();
        let workID = this.workID;
        document.querySelectorAll(`#${this.id}-SaveChapter-btn`).forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();

                bookmarkData.notes = genNote;
                DEBUG && console.log(`[Kat's Tweaks] Updating Last Read.`, bookmarkData.notes);
                document.getElementById("bookmark_notes").innerHTML = bookmarkData.notes;

                button.innerText = `🎉 Saved!`;
                this.requestHandler(bookmarkData, workID, this.settings.showUpdatedBookmarks);
            });
        });
    }

    buttonComment(pushBM) {
        let chapterID = getChapterID();
        document.querySelectorAll(`input#comment_submit_for_${this.workID}, input#comment_submit_for_${chapterID}`).forEach(button => {
            button.addEventListener('click', async (event) => {
                event.preventDefault();
                console.log(`[Kat's Tweaks] Adding tag: Commented`);
                this.storage.addIdToCategory(`${this.id}-INFO-Commented`, this.storageID);
                if (pushBM) {
                    document.querySelector('#bookmark_tag_string_autocomplete').value += `Commented, `;
                    this.tags.push('Commented');
                    await new Promise(res => setTimeout(res, 1000));
                    this.requestHandler(this.getBookmarkData(), this.workID, this.settings.showUpdatedBookmarks)
                }
            });
        });

        function getChapterID() {
            if (document.URL.includes('chapters')) {
                let id = document.URL.split('/')[6].split('#')[0].split('?')[0];
                DEBUG && console.log(`[Kat's Tweaks] Chapter ID: ${id}`);
                return id;
            }
        }
    }

    buttonKudos(pushBM) {
        document.querySelectorAll(`#kudo_submit`).forEach(button => {
            button.addEventListener('click', async (event) => {
                event.preventDefault();
                console.log(`[Kat's Tweaks] Adding tag: Kudosed`);
                this.storage.addIdToCategory(`${this.id}-INFO-Kudosed`, this.storageID);
                if (pushBM) {
                    document.querySelector('#bookmark_tag_string_autocomplete').value += `Kudosed, `;
                    this.tags.push('Kudosed');
                    await new Promise(res => setTimeout(res, 1000));
                    this.requestHandler(this.getBookmarkData(), this.workID, false)
                }
            });
        });
    }

    buttonSubscribe(pushBM) {
        document.querySelectorAll(`form#new_subscription`).forEach(button => {
            button.addEventListener('click', async (event) => {
                event.preventDefault();
                console.log(`[Kat's Tweaks] Adding tag: Subscribed`);
                this.storage.addIdToCategory(`${this.id}-INFO-Subscribed`, this.storageID);
                if (pushBM) {
                    document.querySelector('#bookmark_tag_string_autocomplete').value += `Subscribed, `;
                    this.tags.push('Subscribed');
                    await new Promise(res => setTimeout(res, 1000));
                    this.requestHandler(this.getBookmarkData(), this.workID, this.settings.showUpdatedBookmarks)
                }
            });
        });
    }

    // Add action buttons to the UI for each status
    buttonTags(storageID, bookmarkData) {
        const id = this.id;
        const header = this.isSeries ? document.querySelector('div#main ul.navigation.actions') : document.querySelector('ul.work.navigation.actions');
        const footer = document.querySelector('div#feedback ul.actions');
        this.settings.databaseTags.forEach(({keyID, tagLabel, posLabel, negLabel, btnHeader, btnFooter}) => {
            const isTagged = this.tags.includes(tagLabel);
            if (btnHeader) { header.appendChild(makeButton()); }
            if (btnFooter && !this.isSeries) { footer.append(makeButton()); }

            document.querySelectorAll(`#${this.id}-TAGS-${keyID}-btn`).forEach(button => {
                button.addEventListener('click', (event) => {
                    event.preventDefault();
                    this.handleTagButton(keyID, tagLabel, posLabel, negLabel, storageID, bookmarkData);
                });
            });

            function makeButton() {
                let button = Object.assign(document.createElement('a'), {
                    id: `${id}-TAGS-${keyID}-btn`,
                    href: '#',
                    innerText: `${isTagged ? negLabel : posLabel}`,
                });
                let container = Object.assign(document.createElement('li'));
                container.append(button);
                return container;
            }
        });
    }

    // Handle the action for adding/removing/deleting a bookmark tag
    handleTagButton(keyID, tagLabel, posLabel, negLabel, storageID, bookmarkData) {
        const buttons = document.querySelectorAll(`#${this.id}-TAGS-${keyID}-btn`);

        // Disable the buttons and show loading state
        buttons.forEach((btn) => {
            btn.innerHTML = "Loading...";
            btn.disabled = true;
        });

        try {
            const isTagPresent = this.tags.includes(tagLabel);

            // Toggle the bookmark tag and log the action
            if (isTagPresent) {
                console.log(`[Kat's Tweaks] Removing tag: ${tagLabel}`);
                this.bmTags.value = `${this.bmTags.value.split(tagLabel)[0]}${this.bmTags.value.split(tagLabel)[1]}`;
                this.tags.splice(this.tags.indexOf(tagLabel), 1);
                this.storage.removeIdFromCategory(`${this.id}-TAGS-${keyID}`, storageID);
            }
            else {
                console.log(`[Kat's Tweaks] Adding tag: ${tagLabel}`);
                this.bmTags.value += `${tagLabel}, `;
                this.tags.push(tagLabel);
                this.storage.addIdToCategory(`${this.id}-TAGS-${keyID}`, storageID);
            }

            this.requestHandler(bookmarkData, storageID, this.settings.showUpdatedBookmarks)

            // Update the labels for all buttons
            buttons.forEach((btn) => {
                btn.innerHTML = isTagPresent ? posLabel : negLabel;
            });

        }
        catch (error) {
            console.error(`[Kat's Tweaks] Error during bookmark operation:`, error);
            buttons.forEach((btn) => {
                btn.innerHTML = 'Error! Try Again';
            });
        }
        finally {
            buttons.forEach((btn) => {
                btn.disabled = false;
            });
        }
    }

    getUserNotes() {
        let note = (document.querySelector("div#bookmark-form textarea").innerText).split(this.divider)[0];
        if (note.includes(this.divider.split('\n')[1])) {
            console.warn(`[Kat's Tweaks] Something went wrong getting user note! Did the divider change?`);
            DEBUG && console.log(`[Kat's Tweaks] Trying again. Old note: `, note);
            let note2 = (document.querySelector("div#bookmark-form textarea").innerText).split((this.divider).split('\n')[1])[0];
            if (!note2.length) {
                console.warn(`[Kat's Tweaks] Failed to find user note. Regenerating default note.`)
                return this.settings.defaultNote;
            }
        }
        if (!note.length) {
            return this.settings.defaultNote;
        }
        return note;
    }

    getTime() {
        let currdate = new Date();
        let dd = String(currdate.getDate()).padStart(2, '0');
        let mm = String(currdate.getMonth() + 1).padStart(2, '0');
        let yyyy = currdate.getFullYear();
        let hh = String(currdate.getHours()).padStart(2, '0');
        let mins = String(currdate.getMinutes()).padStart(2, '0');

        let month = "";
        if (mm == 0) { month = "January"; }
        else if (mm == 1) { month = "February"; }
        else if (mm == 2) { month = "March"; }
        else if (mm == 3) { month = "April"; }
        else if (mm == 4) { month = "May"; }
        else if (mm == 5) { month = "June"; }
        else if (mm == 6) { month = "July"; }
        else if (mm == 7) { month = "August"; }
        else if (mm == 8) { month = "September"; }
        else if (mm == 9) { month = "October"; }
        else if (mm == 10) { month = "November"; }
        else if (mm == 11) { month = "December"; }

        let timestamp = "";
        if (this.settings.dateFormat == "Month/Year") { timestamp = `${mm}/${yyyy}`; }
        else if (this.settings.dateFormat == "Day/Month/Year") { timestamp = `${dd}/${mm}/${yyyy}`; }
        else if (this.settings.dateFormat == "Month/Day/Year") { timestamp = `${mm}/${dd}/${yyyy}`; }

        else if (this.settings.dateFormat == "Worded Month/Year") { timestamp = `${month} ${yyyy}`; }
        else if (this.settings.dateFormat == "Worded Day/Month/Year") { timestamp = `${dd} ${month} ${yyyy}`; }
        else if (this.settings.dateFormat == "Worded Month/Day/Year") { timestamp = `${month} ${dd}, ${yyyy}`; }

        else if (this.settings.dateFormat == "Exact Day/Month/Year") { timestamp = `${dd}/${mm}/${yyyy} [${hh}:${mins}]`; }
        else if (this.settings.dateFormat == "Exact Month/Day/Year") { timestamp = `${mm}/${dd}/${yyyy} [${hh}:${mins}]`; }
        else if (this.settings.dateFormat == "Exact Worded Day/Month/Year") { timestamp = `${dd} ${month} ${yyyy} [${hh}:${mins}]`; }
        else if (this.settings.dateFormat == "Exact Worded Month/Day/Year") { timestamp = `${month} ${dd}, ${yyyy} [${hh}:${mins}]`; }

        return timestamp;
    }

    getChapter() {
        let nodes = document.querySelectorAll("div.preface.group h3.title a");
        let chapter = (() => {
            try {
                let x = nodes[nodes.length-1];
                return `<a href="${x.href}">${x.innerText}</a>`;
            } catch (error) {
                return "Oneshot";
            }
        })();
        return chapter;
    }

    getSummary() {
        const previousSummary = (document.querySelector("div#bookmark-form textarea").innerText).split(this.descrip)[1];
        const summaryWork = this.isSeries ? document.querySelector("dl.series.meta.group blockquote.userstuff") : document.querySelector("div.preface.group div.summary.module blockquote.userstuff");
        const summaryChap = this.isSeries ? "No Chapter Summary" : document.querySelector("div.chapter.preface.group div.summary.module blockquote.userstuff");

        if (summaryWork && !(summaryWork == summaryChap)) {
            DEBUG && console.log(`[Kat's Tweaks] Summary Found`);
            return summaryWork.innerHTML;
        }
        else if (previousSummary) {
            return previousSummary;
        }
        else {
            return "No Summary Captured";
        }
    }

    getPseudID() {
        let singlePseud = document.querySelector('input#bookmark_pseud_id');
        if (singlePseud) {
            return singlePseud.value;
        } else {
            // If user has multiple pseuds - use the default one to create bookmark
            let pseudSelect = document.querySelector('select#bookmark_pseud_id');
            return pseudSelect.value;
        }
    }

}

class BookBlurb extends Bookmarking {
    constructor(settings, blurb, moduleID) {
        super(settings, moduleID);
        this.blurb = blurb;
        this.storageID = this.getStorageID(blurb);
        if (this.storageID == '0') { return; }

        this.workID = this.blurb.querySelector('h4.heading a').href.split('/').pop();
        this.btnEdit = this.blurb.querySelector(`#bookmark_form_trigger_for_${this.workID}`);
        this.tags = this.getTags();

        this.checkBookmark();
        this.pullFromStorage(this.blurb, this.settings);

        // Load features for the form in list blurb
        if (this.btnEdit) {
            this.formFound(this.blurb);
        }
    }

    pullFromStorage(blurb, settings) {
        settings.databaseInfo.slice(2).forEach(({keyID}) => {
            let ids = this.storage.getIdsFromCategory(`${this.id}-INFO-${keyID}`);
            if (ids.includes(this.storageID)) {
                blurb.classList.add(`${this.id}-INFO-${keyID}`);
            }
        });
        this.settings.databaseTags.forEach(({keyID}) => {
            let ids = this.storage.getIdsFromCategory(`${this.id}-TAGS-${keyID}`);
            if (ids.includes(this.storageID)) {
                blurb.classList.add(`${this.id}-TAGS-${keyID}`);
            }
        });
    }

    getTags() {
        const tags = this.blurb.querySelectorAll("ul.meta.tags.commas a.tag") || "";
        let x = [];
        for (let i = 0; i < tags.length; i++) {
            x.push(tags[i].innerText);
        }

        DEBUG && console.log(`[Kat's Tweaks] Tags Found for ${this.storageID}: `, x);
        return x;
    }

    checkBookmark() {
        // If a bookmark exists in the blurb, check if by user and check tags
        let bookmarkBy = (() => {
            try {
                let by = this.blurb.querySelector("h5.byline.heading a").innerText;
                return by;
            } catch (error) {
                return "";
            }
        })();
        if ((bookmarkBy == this.username) && !this.isBookmarked) {
            this.storage.addIdToCategory(`${this.id}-INFO-Bookmarked`, this.storageID);
            this.blurb.classList.add(`${this.id}-INFO-Bookmarked`);
            this.updateStorage(this.blurb, this.storageID, this.tags);
        }

        // New (Checked) & Bookmarked
        this.isBookmarked = this.storage.getIdsFromCategory(`${this.id}-INFO-Bookmarked`).includes(this.storageID);
        if (!this.isBookmarked && !this.storage.getIdsFromCategory(`${this.id}-INFO-Checked`).includes(this.storageID)) {
            this.storage.addIdToCategory(`${this.id}-INFO-Checked`, this.storageID);
            this.blurb.classList.add(`${this.id}-INFO-Checked`);
        }
        if (this.isBookmarked) {
            this.storage.removeIdFromCategory(`${this.id}-INFO-Checked`, this.storageID);
            this.blurb.classList.add(`${this.id}-INFO-Bookmarked`);
        }
    }

    // Bookmark Form Functions
    formFound(blurb) {
        DEBUG && console.log(`[Kat's Tweaks] Found bookmark Edit button for ${this.workID}`);
        const summary = blurb.querySelector('blockquote.userstuff.summary') ? blurb.querySelector('blockquote.userstuff.summary').innerHTML : "No Summary</details>";
        
        this.btnEdit.addEventListener('click', async(event) => {
            event.preventDefault();
            if (document.getElementById(`${this.id}-tags-${this.workID}`)) {
                DEBUG && console.log(`[Kat's Tweaks] Tag Container already exists!`);
                return;
            }
            let form = blurb.querySelector('#bookmark-form');
            while (!form) {
                DEBUG && console.log(`[Kat's Tweaks] Waiting .25s`);
                await new Promise(res => setTimeout(res, 250));
                form = blurb.querySelector('#bookmark-form');
            }
            DEBUG && console.log(`[Kat's Tweaks] Found bookmark form`);
            this.bookmarkID = document.querySelector('div#bookmark_form_placement form') ? document.querySelector('div#bookmark_form_placement form').getAttribute('action').split('/')[2] : null;

            let notes = blurb.querySelector(`#bookmark_notes_${this.workID}`).innerHTML;
            this.statusTags(blurb, this.getWordCount(blurb));
            this.formNoteButtons(blurb, `#bookmark_notes_${this.workID}`, this.workID, this.descrip, summary, notes, true);
            this.formTagButtons(blurb, this.workID);
        });
    }

    getStorageID(work) {
        if (work.querySelector('p.message')) {
            return '0';
        }
        const link = work.querySelector('h4.heading a');
        const ID = link.href.split('/').pop();
        if (link.href.includes("series")) {
            DEBUG && console.log(`[Kat's Tweaks] Series ${ID} found.`);
            this.isSeries = true;
            this.storage.addIdToCategory(`${this.id}-INFO-Series`, `${ID}S`);
            return `${ID}S`;
        }
        return ID;
    }

}

class BookSort {
    constructor(settings, moduleID) {
        this.id = moduleID;
        this.settings = settings.bookmarking;

        this.includedTags = [];
        this.excludedTags = [];

        this.container = this.createContainer();
        this.handleFilter(this.settings, this.container[0], '#00ff0044', "other", this.includedTags);
        this.handleFilter(this.settings, this.container[1], '#ff000044', "excluded", this.excludedTags);
    }

    handleFilter(settings, container, color, tagBox, array) {
        let include = document.getElementById(`bookmark_search_${tagBox}_bookmark_tag_names_autocomplete`);

        [settings.databaseTags, settings.databaseWord, settings.databaseInfo.slice(2)].forEach(database => {
            database.forEach(({keyID, tagLabel}) => {
                let button = Object.assign(document.createElement('input'), {
                    type: 'button',
                    id: `${this.id}-SORT-${keyID}-btn-${tagBox}`,
                    class: `${this.id}-sortButton`,
                    value: `${tagLabel}`,
                });
                container.append(button);
    
                button.addEventListener('click', (event) => {
                    event.preventDefault();
                    const isIncluded = array.includes(`${tagLabel}`);
    
                    if (isIncluded) {
                        DEBUG && console.log(`[Kat's Tweaks] Removing ${tagLabel} from the input box.`);
                        if (include.value) {
                            if (include.value.includes(`${tagLabel}, `)) {
                                include.value = `${include.value.split(`${tagLabel}, `)[0]}${include.value.split(`${tagLabel}, `)[1]}`;
                            }
                            else {
                                include.value = `${include.value.split(`${tagLabel}`)[0]}${include.value.split(`${tagLabel}`)[1]}`;
                            }
                        }
                        array.splice(array.indexOf(tagLabel), 1);
                    }
                    else {
                        DEBUG && console.log(`[Kat's Tweaks] Adding ${tagLabel} to the input box.`);
                        if (include.value) {
                            include.value += `, ${tagLabel}`;
                        }
                        else {
                            include.value = `${tagLabel}`;
                        }
                        array.push(tagLabel);
                    }
    
                    button.style.backgroundColor = isIncluded ? 'initial' : color;
                });
            });
            container.appendChild(document.createElement('hr'));
        })
    }

    createContainer() {
        let main = Object.assign(document.createElement('details'), {
            id: `${this.id}-filterbox`,
        });
        main.appendChild(Object.assign(document.createElement('summary'), {
            innerHTML: `<h4>Kat's Tweaks</h4><hr>`,
        }));
        let include = Object.assign(document.createElement('details'), {
            id: `include`,
        });
        include.appendChild(Object.assign(document.createElement('summary'), {
            innerHTML: `<h4>Include</h4><hr>`,
        }));
        let exclude = Object.assign(document.createElement('details'), {
            id: `exclude`,
        });
        exclude.appendChild(Object.assign(document.createElement('summary'), {
            innerHTML: `<h4>Exclude</h4><hr>`,
        }));

        main.appendChild(include);
        //main.appendChild(document.createElement('hr'));
        main.appendChild(exclude);
        document.querySelector('dd.submit.actions').before(main);
        return [include, exclude];
    }
}

// Class for handling API requests
class RequestManager {
    // Send an API request with the specified method
    sendRequest(url, formData, headers, method = "POST") {
        return fetch(url, {
                method: method,
                mode: "cors",
                credentials: "include",
                headers: headers,
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }
                return response;
            })
            .catch(error => {
                DEBUG && console.error(`[Kat's Tweaks] Error during API request:`, error);
                throw error;
            });
    }

    // Create a bookmark for fanfic with given data
    createBookmark(workId, authenticityToken, bookmarkData) {
        const url = `https://archiveofourown.org/works/${workId}/bookmarks`;
        const headers = this.getRequestHeaders();

        const formData = this.createFormData(authenticityToken, bookmarkData);

        DEBUG && console.info(`[Kat's Tweaks] Sending CREATE request for bookmark:`, {
            url,
            headers,
            bookmarkData
        });

        return this.sendRequest(url, formData, headers)
            .then(response => {
                if (response.ok) {
                    const bookmarkId = response.url.split('/').pop();

                    console.info(`[Kat's Tweaks] Created bookmark ID:`, bookmarkId);
                    return bookmarkId;
                } else {
                    throw new Error("Failed to create bookmark. Status: " + response.status);
                }
            })
            .catch(error => {
                DEBUG && console.error(`[Kat's Tweaks] Error creating bookmark:`, error);
                throw error;
            });
    }

    // Update a bookmark for fanfic with given data
    updateBookmark(bookmarkId, authenticityToken, updatedData) {
        const url = `https://archiveofourown.org//bookmarks/${bookmarkId}`;
        const headers = this.getRequestHeaders();
        const formData = this.createFormData(authenticityToken, updatedData, 'update');

        DEBUG && console.info(`[Kat's Tweaks] Sending UPDATE request for bookmark:`, {
            url,
            headers,
            updatedData
        });

        return this.sendRequest(url, formData, headers)
            .then(data => {
                console.info(`[Kat's Tweaks] Bookmark updated successfully:`, data);
            })
            .catch(error => {
                console.error(`[Kat's Tweaks] Error updating bookmark:`, error);
            });
    }

    // Retrieve the request headers
    getRequestHeaders() {
        const headers = {
            "Accept": "text/html", // Accepted content type
            "Cache-Control": "no-cache", // Prevent caching
            "Pragma": "no-cache", // HTTP 1.0 compatibility
        };
        return headers;
    }

    // Create FormData for bookmarking actions based on action type
    createFormData(authenticityToken, bookmarkData, type = 'create') {
        const formData = new FormData();

        // Append required data to FormData
        formData.append('authenticity_token', authenticityToken);
        formData.append("bookmark[pseud_id]", bookmarkData.pseudId);
        formData.append("bookmark[bookmarker_notes]", bookmarkData.notes);
        formData.append("bookmark[tag_string]", bookmarkData.tags.join(','));
        formData.append("bookmark[collection_names]", bookmarkData.collections.join(','));
        formData.append("bookmark[private]", +bookmarkData.isPrivate);
        formData.append("bookmark[rec]", +bookmarkData.isRec);

        // Append action type
        formData.append("commit", type === 'create' ? "Create" : "Update");
        if (type === 'update') {
            formData.append("_method", "put");
        }

        DEBUG && console.log(`[Kat's Tweaks] FormData created successfully:`);
        DEBUG && console.table(Array.from(formData.entries()));

        return formData;
    }
}

class StorageManager {
    init(key) {
        if (!localStorage.getItem(key)) {
            DEBUG && console.log(`[Kat's Tweaks] Initilized Storage: ${key} | Previous Value: ${localStorage.getItem(key)}`)
            localStorage.setItem(key, "")
        }
    }

    // Store a value in local storage
    setItem(key, value) {
        localStorage.setItem(key, value);
    }

    // Retrieve a value from local storage
    getItem(key) {
        const value = localStorage.getItem(key);
        return value;
    }

    // Add an ID to a specific category
    addIdToCategory(category, id) {
        const existingIds = this.getItem(category);
        const idsArray = existingIds ? existingIds.split(',') : [];

        if (!idsArray.includes(id)) {
            idsArray.push(id);
            this.setItem(category, idsArray.join(',')); // Update the category with new ID
            DEBUG && console.debug(`[Kat's Tweaks] Added ID to category "${category}": ${id}`);
        }
    }

    // Remove an ID from a specific category
    removeIdFromCategory(category, id) {
        const existingIds = this.getItem(category);
        const idsArray = existingIds ? existingIds.split(',') : [];

        const idx = idsArray.indexOf(id);
        if (idx !== -1) {
            idsArray.splice(idx, 1); // Remove the ID
            this.setItem(category, idsArray.join(',')); // Update the category
            DEBUG && console.debug(`[Kat's Tweaks] Removed ID from category "${category}": ${id}`);
        }
    }

    // Get IDs from a specific category
    getIdsFromCategory(category) {
        const existingIds = this.getItem(category) || '';
        const idsArray = existingIds.split(',');
        DEBUG && console.debug(`[Kat's Tweaks] Retrieved IDs from category "${category}"`);
        return idsArray;
    }
}

class StyleManager {
    static addStyle(debugID, css) {
        const customStyle = document.createElement('style');
        customStyle.id = 'KT';
        customStyle.innerHTML = css;
        document.head.appendChild(customStyle);
        DEBUG && console.info(`[Kat's Tweaks] Custom style '${debugID}' added successfully`);
    }
}

class Main {
    constructor() {
        this.settings = this.loadSettings();
        this.loggedIn();
        if (this.settings.bookmarking.enabled) {
            let moduleID = "KT-BOOK";
            console.info(`[Kat's Tweaks] Bookmarking | Initialized with:`, this.settings.bookmarking);
            if (document.querySelector('form#bookmark-filters')) {
                new BookSort(this.settings, moduleID);
            }
            if (document.getElementById('bookmark_tag_string_autocomplete')) {
                new BookPage(this.settings, moduleID);
            }
            let blurbs = document.querySelectorAll('li.work.blurb, li.bookmark.blurb, li.series.blurb');
            blurbs.forEach((blurb) => {
                new BookBlurb(this.settings, blurb, moduleID);
            });

            StyleManager.addStyle('BOOK Default Style', `.${moduleID}-INFO-Bookmarked { border-right: 50px solid #ddd !important; } .${moduleID}-INFO-Checked { border-left: 5px solid #900 !important; } @media screen and (max-width: 62em) { .${moduleID}-INFO-Bookmarked { border-right: 20px solid #ddd !important; } }`);
            StyleManager.addStyle('BOOK Reversi Overrides', ` .KT-reversi .${moduleID}-INFO-Bookmarked { border-right: 50px solid #555 !important; } .KT-reversi .${moduleID}-INFO-Checked { border-left: 5px solid #5998D6 !important; } @media screen and (max-width: 62em) { .KT-reversi .${moduleID}-INFO-Bookmarked { border-right: 20px solid #555 !important; } }`);
        }
    }

    // Load settings from the storage or fallback to default ones
    loadSettings() {
        const startTime = performance.now();
        let savedSettings = localStorage.getItem('KT-SavedSettings');
        let settings = SETTINGS;

        if (savedSettings) {
            try {
                let parse = JSON.parse(savedSettings);
                DEBUG && console.log(`[Kat's Tweaks] Settings loaded successfully:`, savedSettings);


                if (parse.bookmarking) {
                    settings = parse;
                }

            } catch (error) {
                DEBUG && console.error(`[Kat's Tweaks] Error parsing settings: ${error}`);
            }
        } else {
            DEBUG && console.warn(`[Kat's Tweaks] No saved settings found for Bookmarking, using default settings.`);
        }

        const endTime = performance.now();
        DEBUG && console.log(`[Kat's Tweaks] Settings loaded in ${endTime - startTime} ms`);
        return settings;
    }

    loggedIn() {
        const userMenu = document.querySelector('ul.menu.dropdown-menu');
        let foundUser = userMenu?.previousElementSibling?.getAttribute('href')?.split('/').pop() ?? '';

        // if logged in
        if (foundUser) {
            DEBUG && console.log(`[Kat's Tweaks] Found Username: `, foundUser);

            if (localStorage.getItem("KT-SavedUsername") !== foundUser) {
                localStorage.setItem("KT-SavedUsername", foundUser);
            }
        }
        // if not logged in, but remembers username
        else if (!!localStorage.getItem("KT-SavedUsername")) {
            console.info(`[Kat's Tweaks] Bookmarking | Didn't find username on page, saved username: `, localStorage.getItem("KT-SavedUsername"));
        }
        else {
            let newUser = prompt(`[Kat's Tweaks]\nUsername is used to check for bookmarks and other functions.\n\nYour AO3 username:`);
            localStorage.setItem('KT-SavedUsername', newUser);
        }
    }
}

new Main();
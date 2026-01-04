// ==UserScript==
// @name         Google Docs Note Taker
// @namespace    http://LokiAstari.com/
// @version      1.0.001
// @description  Link a private google doc to any web page. Link multiple pages to a single note.
// @author       Loki Astari
// @license      MIT
// @match        https://docs.google.com/document/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @grant        unsafeWindow
// @noframes
// @sandbox      JavaScript
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js#sha384=Q96qXpLdPU1SBEdvTZkaSZfHRsUwS+sj/WFUdmYvGhBNtwYUucjuwhZT6glwdVXk
// @downloadURL https://update.greasyfork.org/scripts/468419/Google%20Docs%20Note%20Taker.user.js
// @updateURL https://update.greasyfork.org/scripts/468419/Google%20Docs%20Note%20Taker.meta.js
// ==/UserScript==

// A filter wrapper for an iterator.
class Util
{
    static cleanUrl(url) {
        return url.split('?')[0].split('&')[0].split('#')[0];
    }
    static cleanTitle(title) {
        return title.split(' - Google Docs')[0];
    }
    static filter(iterable, predicate) {
        let iterator = iterable[Symbol.iterator]();
        return { // This object is both iterator and iterable
            [Symbol.iterator]() {
                return this;
            },
            next() {
                for(;;) {
                    let v = iterator.next();
                    if(v.done || predicate(v.value)) {
                        return v;
                    }
                }
            }
        };
    }
}

class Converter {

    static #getOrInsertPage(v2, page) {
        var find = v2.pages[page];
        if (find == null) {
            find = {url: page, display: '', noteUrl: '', labels: [], linkedPages: []};
            v2.pages[page] = find;
        }
        return find;
    }

    static #covertVersion1(v1) {
        const v2 = {
            version:    2,
            pages:      {},
            labels:     {},
            notes:      [],
        }
        /*
         * v1 Page: { string: note, vector<string>: labels}
         *    pages: map<string, Page>
         */
        Object.keys(v1.pages).forEach((key, index) => {
            v2.pages[key] = {url: key, display: '', noteUrl: v1.pages[key].note, labels: v1.pages[key].labels, linkedPages: []};
        });

        /*
         * v1 Note:  { string: note, string: display, vector<{string: page, string: display}>: linkedPages}
         *    notes: vector<Note>
         */
        for (const note of v1.notes) {
            // Add all linked pages into v2.pages
            const v2Page = Converter.#getOrInsertPage(v2, note.note);
            v2Page.display = note.display;
            for (const noteLinkedPage of note.linkedPages) {
                v2Page.linkedPages.push(noteLinkedPage.page);
                const findLinked = Converter.#getOrInsertPage(v2, noteLinkedPage.page);
                findLinked.display = findLinked.display || noteLinkedPage.display;
            }

            /* Add V2 Note */
            v2.notes.push(note.note);
        }

        /*
         * v1 Label: { string: label, vector<{{string: page, string: display}>: linkedPages}
         *    labels:vector<Label>
         */
        for (const label of v1.labels) {
            // Add all labelled pages into v2.pages
            const linkedPages = [];
            for (const linkedPage of label.linkedPages) {
                linkedPages.push(linkedPage.page);
                const findLinked = Converter.#getOrInsertPage(v2, linkedPage.page);
                findLinked.display = findLinked.display || linkedPage.display;
            }

            /* Add V2 Label */
            v2.labels[label.label] = linkedPages;
        }
        return v2;
    }
    static  #converters = [
        (obj)=>{return obj;},       // Version 0 does not exist.
        Converter.#covertVersion1,  // Version 1 to 2 converter.
    ];

    static convert(obj) {
        var version = obj.version || 1;
        for (;version < Converter.#converters.length; ++version) {
            obj = Converter.#converters[version](obj);
        }
        if (obj.version != Converter.#converters.length) {
            throw 'Invalid Conversion'
        }
        return obj;
    }

    static expectedVersion()    {
        return Converter.#converters.length;
    }
}

class PageInfo {
    #url;
    #display;
    #noteUrl;
    #labels;
    #linkedPages;

    get url()           {return this.#url;}
    get display()       {return this.#display;}
    get noteUrl()       {return this.#noteUrl;}
    get labels()        {return this.#labels.values();}
    get linkedPages()   {return this.#linkedPages.values();}

    constructor(value) {
        if (typeof value === 'string') {
            this.#url           = value;
            this.#display       = '';
            this.#noteUrl       = '';
            this.#labels        = [];
            this.#linkedPages   = [];
        }
        else {
            this.#url           = value.url         || '';
            this.#display       = value.display     || '';
            this.#noteUrl       = value.noteUrl     || '';
            this.#labels        = value.labels      || [];
            this.#linkedPages   = value.linkedPages || [];
        }
    }
    toJSON() {
        return {url:this.#url, display:this.#display, noteUrl:this.#noteUrl, labels:this.#labels, linkedPages:this.#linkedPages};
    }
    static duplicateWithReplace(page, replace) {
        return new PageInfo({   url:           undefined !== replace.url         ? replace.url          : page.url,
                                display:       undefined !== replace.display     ? replace.display      : page.display,
                                noteUrl:       undefined !== replace.noteUrl     ? replace.noteUrl      : page.noteUrl,
                                labels:        undefined !== replace.labels      ? replace.labels       : Array.from(page.labels),
                                linkedPages:   undefined !== replace.linkedPages ? replace.linkedPages  : Array.from(page.linkedPages)
                            });
    }
}

// The main access to the persisted state.
// Any user action should only call one method on "Storage"
// If you need to make multiple calls then sessionStart() see above
// You can perform multiple actions on the storage state before returning.
class Storage {

    #storageArea = null;

    #GDNTStorageName = 'GDNTPageData';

    // Private: Internally used by sessionStart
    #seaasionInUse = false;

    #getGDNTData() {
        const GDNTStorageText = this.#storageArea.getItem(this.#GDNTStorageName);
        return GDNTStorageText;
    }

    #setGDNTData(session) {
        this.#storageArea.setItem(this.#GDNTStorageName, JSON.stringify(session));
    }

    constructor(storageArea = localStorage) {
        this.#storageArea =  storageArea;
        this.#seaasionInUse = false;
    }

    sessionStart(action) {
        if (this.#seaasionInUse) {
            // Should wait (otherwise we will loose data)
            // But very low chance of that happening as there is only one async call
            // See: UI.saveNotePage (Call to ajax has a callback function)
            // TODO:
        }
        this.#seaasionInUse = true;
        const sessionText = this.#getGDNTData();
        const inputObject = JSON.parse(sessionText);
        const inputVersion = inputObject.version || 1;
        const session = new Data(inputObject);
        const result = action(session);
        if (result === undefined || result === null || result === false) {
            if (inputVersion != session.version) {
                this.#setGDNTData(session);
                return;
            }
        }
        else if (result === true) {
            this.#setGDNTData(session);
            return;
        }
        else if (result.constructor === Array) {
            if (result.length > 0 && result[0] === true) {
                this.#setGDNTData(session);
            }
            if (result.length > 1) {
                return result[1];
            }
        }
        return;
    }

}

/*
PageInfo:
    string:         url
    string:         display
    string:         noteUrl
    vector<string>  labels
    vector<string>  linkedPages

DataImpl:
    integer:                    version
    map<string, PageIngo>       pages
    map<string, vector<string>> labels
    vector<string>              notes

Data:
    data:       DataImpl


*/

class DataImpl {
    #version;
    #pages;
    #labels;
    #notes;


    constructor(input) {
        var rawData = input;
        if (typeof rawData === 'string') {
            rawData = JSON.parse(input);
        }
        rawData = Converter.convert(rawData);

        this.#version   = rawData.version;
        this.#pages     = {};
        Object.entries(rawData.pages).forEach(entry => {
            const [key, value] = entry;
            this.#pages[key] = new PageInfo(value);
        });
        this.#labels    = rawData.labels;
        this.#notes     = rawData.notes;
    }

    getPage(page)               {return this.#pages[page] !== undefined ? this.#pages[page] : new PageInfo(page);}
    getLabel(label)             {return this.#labels[label] !== undefined ? this.#labels[label].entries() : [].entries();}

    get version()               {return this.#version;}
    get labels()                {return Object.keys(this.#labels).values();}
    get notes()                 {return this.#notes.values();}

    toJSON()                    {return {version:this.#version, pages:this.#pages, labels:this.#labels, notes:this.#notes};}

    setDisplay(page, display)   {
        const oldPage = this.#pages[page];
        if (!oldPage) {
            return;
        }
        this.#pages[page] = PageInfo.duplicateWithReplace(oldPage, {display: display});
    }
    setNote(page, note) {
        const oldPage = this.#pages[page];
        if (!oldPage) {
            return;
        }
        const oldNote = oldPage.noteUrl;
        if (note == oldNote) {
            return;
        }

        this.#pages[page] = PageInfo.duplicateWithReplace(oldPage, {noteUrl: note});

        if ( oldNote != '') {
            const oldNotePage = this.#pages[oldNote];
            const linkedPages = Array.from(Util.filter(oldNotePage.linkedPages, (obj) => obj != page));
            this.#pages[oldNote] = PageInfo.duplicateWithReplace(oldNotePage, {linkedPages: linkedPages});
        }

        if (note != '') {
            if (!(note in this.#pages)) {
                // TODO Need to update display
                this.#pages[note] = new PageInfo({url: note, linkedPages: [page]});
            }
            else {
                const newNotePage = this.#pages[note];
                const linkedPages = Array.from(newNotePage.linkedPages);
                linkedPages.push(page);
                this.#pages[newNotePage] = PageInfo.duplicateWithReplace(newNotePage, {linkedPages: linkedPages});
            }
        }
    }
    addLabel(page, label) {
        if (!label) {
            return;
        }
        const oldPage = this.#pages[page];
        if (!oldPage) {
            return;
        }
        const labels = [];
        for (const obj of oldPage.labels) {
            if (obj == label) {
                return;
            }
            labels.push(obj);
        }
        labels.push(label);

        this.#pages[page] = PageInfo.duplicateWithReplace(oldPage, {labels: labels});
        if (this.#labels[label] === undefined) {
            this.#labels[label] = [];
        }
        this.#labels[label].push(page);
    }
    remLabel(page, label) {
        if (!label) {
            return;
        }
        const oldPage = this.#pages[page];
        if (!oldPage) {
            return;
        }
        const labels = [];
        var found = false;
        for (const obj of oldPage.labels) {
            if (obj == label) {
                found = true;
                continue;
            }
            labels.push(obj);
        }
        if (!found) {
            return;
        }
        this.#pages[page] = PageInfo.duplicateWithReplace(oldPage, {labels: labels});
        this.#labels[label] = this.#labels[label].filter((obj) => obj != page);
    }
    deleteNote(note) {
        const notePage = this.#pages[note];
        if (!notePage) {
            return;
        }
        for (const linkedPage of notePage.linkedPages) {
            const linkedPageData = this.#pages[linkedPage];

            this.#pages[linkedPage] = PageInfo.duplicateWithReplace(linkedPageData, {noteUrl: ''});
        }
        this.#pages[note] = PageInfo.duplicateWithReplace(notePage, {linkedPages: []});
        this.#notes = this.#notes.filter((obj) => obj != note);
    }
    deleteLabel(label) {
        const labels = this.#labels[label];
        if (!labels) {
            return;
        }
        for (const page of labels.values()) {
            const linkedPageData = this.#pages[page];
            const linkedPageLabels = Array.from(Util.filter(linkedPageData.labels, (obj) => obj != label));
            this.#pages[page] =  PageInfo.duplicateWithReplace(linkedPageData, {labels: linkedPageLabels});
        }

        delete this.#labels[label];
    }
}

class Data {
    #data;

    constructor(input) {
        this.#data = new DataImpl(input);
    }
    stringify() {
        return JSON.stringify(this.#data);
    }

    getPage(page)               {return this.#data.getPage(page);}
    getLabel(label)             {return this.#data.getLabel(label);}

    get version()               {return this.#data.version;}
    get labels()                {return this.#data.labels;}
    get notes()                 {return this.#data.notes;}

    toJSON()                    {return this.#data.toJSON();}

    setDisplay(page, display)   {this.#data.setDisplay(page, display);}
    setNote(page, note)         {this.#data.setNote(page, note);}
    addLabel(page, label)       {this.#data.addLabel(page, label);}
    remLabel(page, label)       {this.#data.remLabel(page, label);}

    deleteNote(note)            {this.#data.deleteNote(note);}
    deleteLabel(label)          {this.#data.deleteLabel(label);}
};

class UIBuilder {

    constructor() {
        GM_addStyle ( `
            div.gdnt-note {
                color: green;
            }
            a.gdnt-anchor {
                color: inherit;
                text-decoration: none;
            }
            a.gdnt-anchor:hover {
                color:#0B57D0;
                text-decoration:none;
                cursor:pointer;
            }
            .navigation-widget .updating-navigation-item-list .navigation-item-list .last_child_override {
                margin-bottom:  0;
                font-size:      11px;
                line-height:    28px;
            }
            .navigation-widget .updating-navigation-item-list .navigation-item-list .gdnt-note .navigation-item-level-1 {
                padding-left: 0px;
            }
            .navigation-widget .updating-navigation-item-list .navigation-item-list .gdnt-label .navigation-item-level-1 {
                padding-left: 0px;
            }
        `);
    }

    /*
        template<typename T>
        buildList(vector<T>&                 list,
                         function<string(T)>        cl,             // class name
                         function<string(T)>        actiontt,       // Tool Tip
                         function<string(T)>        deletett,       // Tool Tip for delete
                         function<string(T)>        object,         // The object to be displayed.
                         function<string(T)>        value           // The value attribute
                        ) {
        <div><div><div>${buildListElement}</div></div></div>
    */
    buildLabelList(iterator) {
        var output = '';
        for (const label of iterator) {
            output += `<span>${label} </span>`;

        }
        return output;
    }

    /*
        template<typename T>
        buildListElement(vector<T>&                 list,
                         string                     cl,             // class name
                         function<string(T)>        actiontt,       // Tool Tip
                         function<string(T)>        deletett,       // Tool Tip for delete
                         function<string(T)>        object,         // The object to be displayed.
                         function<string(T)>        value           // The value attribute
                        ) {
        <div><div>${object}</div></div>
        ... repeat for each item in list
    */
    buildListElement(iterator, cl, actiontt, deletett, object, value) {
        var output = '';
        for (const linkPage of iterator) {
            output += `
<div class="gdnt-deletable last_child_override navigation-item ${cl}" role="menuitem" style="user-select: none;" data-deletable-tt="${deletett(linkPage)}" value="${value(linkPage)}" style="padding-right: 8px; margin-bottom: 0px;">
    <div class="gdnt-deletable gdnt-deletable-inner navigation-item-content navigation-item-level-1" data-tooltip="${actiontt(linkPage)}" data-tooltip-align="r,c" data-tooltip-only-on-overflow="true" data-tooltip-offset="-8">${object(linkPage)}</div>
</div>`;
        }
        return output;
    }

    buildList(iterator, cl, actiontt, deletett, object, value) {
        return `
        <div class="updating-navigation-item-list">
            <div class="updating-navigation-item-list">
                <div class="navigation-item-list goog-container" tabindex="0" style="user-select: none; padding-right: 15px;">
                    ${this.buildListElement(iterator, cl, actiontt, deletett, object, value)}
                </div>
            </div>
        </div>`;
    }

    // See Data.js
    buildLabels(data) {
        var output = '';
        for (const label of data.labels) {
            const labelInfo = data.getLabel(label);
            output += `
<div class="navigation-widget-header navigation-widget-outline-header" style="padding-bottom:0px" role="heading">
    Pages Labeled: ${label}
</div>`;
            if (labelInfo.length) {
                output += this.buildList(labelInfo,
                                         'gdnt-label-page',
                                         (page)=>`Open: ${data.getPage(page).display}`,
                                         (page)=>`Remove '${label}' from Page: ${data.getPage(page).display}`,
                                         (page)=>`<a class="gdnt-anchor" href="${data.getPage(page).url}">${data.getPage(page).display}</a>`,
                                         (page)=>`${label}:${data.getPage(page).url}`);
            }
        }
        return output;
    }

    buildButton(id, cl, extra, containerClass) {
        return `
<div id="${id}" role="button" class="goog-inline-block jfk-button jfk-button-standard ${cl}" ${extra} data-ol-has-click-handler="">
   <div class="docs-icon goog-inline-block ">
       <div class="docs-icon-img-container ${containerClass}">
           &nbsp;
       </div>
   </div>
</div>
`;
    }

    // See Data.js
    build(data, page) {
        const pageData = data.getPage(page);
        const noteData = pageData.noteUrl == '' ? {url: '', display: '', noteUrl: '', labels: [], linkedPages: []} : data.getPage(pageData.noteUrl);
        return `
       <div class="updating-navigation-item-list">
           <div class="updating-navigation-item-list">
               <div class="navigation-item-list goog-container" tabindex="0" style="user-select: none; padding-right: 15px;">
                   <!-- Remove Button: This is dynamically moved as mouse is moved over deletable items -->
                   <div id="gdnt-delete-item" class="gdnt-deletable gdnt-deletable-nofocus navigation-widget-row-controls" style="top: 145px; right: 23px; display: none;">
                       <div class="gdnt-deletable gdnt-deletable-nofocus navigation-widget-row-controls-control navigation-widget-row-controls-suppress goog-inline-block goog-flat-button" role="button" data-tooltip="Remove:" data-tooltip-offset="-8" id="a4jzle:16y" tabindex="0" style="user-select: none;">
                           <div class="gdnt-deletable gdnt-deletable-nofocus docs-icon goog-inline-block ">
                               <div class="gdnt-deletable gdnt-deletable-nofocus docs-icon-img-container docs-icon-img docs-icon-close-thin">
                                   &nbsp;
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
       </div>
       <div class="navigation-widget-smart-summary-container-1">
           <div class="docs-material kix-smart-summary-view" style="padding-bottom:0px">
               <div class="kix-smart-summary-view-header-container">
                   <div class="gdnt-notes-clickable kix-smart-summary-view-header navigation-widget-header" id="kix-smart-summary-view-header" gdnt-note="${noteData.url}" role="heading">
                       Notes: <div class="navigation-item-content" style="display:inline"><a class="gdnt-anchor" href="${noteData.url}">${noteData.display}</a></div>
                   </div>
                   <!-- Edit Note -->
                   ${this.buildButton('gdnt-notes-edit', 'kix-smart-summary-edit-button', 'data-tooltip="Edit Notes" style="display: none;"', 'docs-icon-img docs-icon-edit-outline')}
                   <!-- Add Note -->
                   <div id="gdnt-notes-add" class="kix-smart-summary-entrypoint-container kix-smart-summary-header-button" style="display: none;">
                       ${this.buildButton('gdnt-notes-add1', 'kix-smart-summary-add-button-promo kix-smart-summary-entrypoint-icon', '', 'docs-smart-summary-tinted docs-icon-img docs-icon-smart-summary')}
                       ${this.buildButton('gdnt-notes-add2', 'kix-smart-summary-add-button-default kix-smart-summary-entrypoint-icon', 'style="position: relative;" tabindex="0" data-tooltip-class="kix-default-tooltip" data-tooltip-offset="0" data-tooltip="Add Notes"', 'docs-icon-img docs-icon-plus')}
                   </div>
               </div>
           </div>
           <div class="docs-material kix-smart-summary-view" style="padding-bottom:0px">
               <div class="kix-smart-summary-view-header-container">
                   <div class="gdnt-labels-clickable kix-smart-summary-view-header navigation-widget-header" id="kix-smart-summary-view-header" gdnt-labels="${noteData.url}" role="heading">
                       Labels: <div class="navigation-item-content" style="display:inline">${this.buildLabelList(pageData.labels)}</div>
                   </div>
                   <!-- Add Label -->
                   <div id="gdnt-labels-add" class="kix-smart-summary-entrypoint-container kix-smart-summary-header-button" style="display: block;">
                       ${this.buildButton('gdnt-label-add1', 'kix-smart-summary-add-button-promo kix-smart-summary-entrypoint-icon', '', 'docs-smart-summary-tinted docs-icon-img docs-icon-smart-summary')}
                       ${this.buildButton('gdnt-label-add2', 'kix-smart-summary-add-button-default kix-smart-summary-entrypoint-icon', 'style="position: relative;" tabindex="0" data-tooltip-class="kix-default-tooltip" data-tooltip-offset="0" data-tooltip="Add Labels"', 'docs-icon-img docs-icon-plus')}
                   </div>
               </div>
           </div>
           <div class="docs-material kix-smart-summary-view" style="padding-bottom:0px">
               <div id="gdnt-notes-list-of-notes" class="kix-smart-summary-view-content-container" style="display: none;">
                   <div class="navigation-widget-header navigation-widget-outline-header" style="padding:0;" role="heading">
                       Existing Notes Documents:
                   </div>
                   ${this.buildList(data.notes, 'gdnt-note', (page)=>`Add this page to Note '${data.getPage(page).display}'`, (page)=>`Delete Note: '${data.getPage(page).display}'`, (page)=>data.getPage(page).display, (page)=>data.getPage(page).url)}
                   <!-- <div class="kix-smart-summary-view-separator">
                   </div> -->
               </div>
               <div id="gdnt-labels-list-of-labels" class="kix-smart-summary-view-content-container" style="display: block;">
                   <div class="navigation-widget-header navigation-widget-outline-header" style="padding:0;" role="heading">
                       Existing Labels :
                   </div>
                   ${this.buildList(data.labels, 'gdnt-label', (label)=>`Add label ${label} to this page`, (label)=>`Delete Label: ${label}`, (label)=>label, (label)=>label)}
                   <div class="kix-smart-summary-view-separator">
                   </div>
               </div>
           </div>
           <div class="navigation-widget-header navigation-widget-outline-header" style="padding-bottom:0px" role="heading">
               Pages Linked to this page:
           </div>
           ${this.buildList(pageData.linkedPages, 'gdnt-note-page', (page)=>`Open: ${data.getPage(page).display}`, (page)=>`Remove Page: ${data.getPage(page).display}`, (page)=>`<a class="gdnt-anchor" href="${data.getPage(page).url}">${data.getPage(page).display}</a>`, (page)=>data.getPage(page).url)}
           <div class="navigation-widget-header navigation-widget-outline-header" style="padding-bottom:0px" role="heading">
               Pages Linked to same note:
           </div>
           ${this.buildList(noteData.linkedPages, 'gdnt-note-page', (page)=>`Open: ${data.getPage(page).display}`, (page)=>`Remove Page: ${data.getPage(page).display}`, (page)=>`<a class="gdnt-anchor" href="${data.getPage(page).url}">${data.getPage(page).display}</a>`, (page)=>data.getPage(page).url)}
           ${this.buildLabels(data)}
       </div>`;
    }
}

class UI {

    // Init and refresh the UI.
    #storage;
    #uiBuilder;
    #currentPage;
    #mouseOverDeletable;
    #pageDirty;

    #addNotes(notes) {
        // Can't set a page to be its own Note.
        if (note == this.#currentPage) {
            return null;
        }
        this.#storage.startSession((session) => {
            session.setNote(this.#currentPage, note);
            $.ajax({
                method: 'HEAD',
                url: note,
                async: false,
                success: function(pageHead) {
                    const title = Util.cleanTitle($(pageHead).filter('title').text());
                    if (title) {
                        session.setDisplay(note, title);
                    }
                }
            });
            return true;
        });
        this.addUI();
    }

    // Private
    addLabel(label) {
        this.#storage.startSession((session) => {
            session.addLabel(this.#currentPage, label);
            return true;
        });
        this.addUI();
    }

    // Event Handler
    delPageNoteClick(event, page) {
        const over = this.#mouseOverDeletable;
        const dirty = this.#storage.startSession((session) => {
            var dirty = false;
            if (over.classList.contains('gdnt-note-page')) {
                session.setNote(page, '');
                dirty = true;
            }
            else if (over.classList.contains('gdnt-label-page')) {
                const split = page.split(/:(https.*)/s);
                const realPage = split[1];
                const label = split[0];
                session.remLabel(realPage, label);
                dirty = true;
            }
            else if (over.classList.contains('gdnt-note')) {
                const confirmDelete = confirm(`
Deleting     a Note will delete all linking pages from the internal DB.
Are you     sure?`);
                if (confirmDelete) {
                    session.deleteNote(page);
                    dirty = true;
                }
            }
            else if (over.classList.contains('gdnt-label')) {
                const confirmDelete = confirm(`
Deleting     a Label will delete all linking pages from the internal DB.
Are you     sure?`);
                if (confirmDelete) {
                    session.deleteLabel(page);
                    dirty = true;
                }
            }
            // The first element decides if changes should be saved.
            // So only save if it is dirty.
            // The second element is returned as the result of startSession
            // So we can use it below to re-build the UI.
            return [dirty, dirty];
        });

        if (dirty) {
            this.addUI();
        }
    }

    // Event Handler
    addNotesClick(event, page) {
        this.#addNotes(prompt('URL of NotePage: ', page));
    }

    // Event Handler
    addLabelClick(event) {
        this.addLabel(prompt('Label: ', ''));
    }

    // Event Handler
    addNotesClickPageClick(event, notes) {
        this.#addNotes(notes);
    }

    // Event Handler
    addLabelClickPageClick(event, label) {
        this.addLabel(label);
    }

    getOrCreateRoot() {

        const findBlock = document.getElementById('GDNTNotesContainer');
        // If we have already created this element then re-use the existing one.
        if (findBlock) {
            return findBlock;
        }

        // Otherwise create the root element
        // And carefullt put it in the DOM.
        const block = document.createElement('div');
        block.setAttribute ('id', 'GDNTNotesContainer');
        block.style.padding = '0 0 30px 0';

        // Note: buildUI() is only called after these elements
        //       have been created. So we don't need to check for existance.
        //       See: WaitForKeyElement
        const left = document.getElementsByClassName('left-sidebar-container')[0];
        const parent = left.getElementsByClassName('navigation-widget-content')[0];
        const child = parent.getElementsByClassName('navigation-widget-smart-summary-container')[0];

        parent.insertBefore(block, child);
        return block;
    }

    deleteableEnter(event) {
        const isDeleteButton = event.target.classList.contains('gdnt-deletable-nofocus');
        if (isDeleteButton) {
            // The delete button is only visible (enterable) if the mouse was over a deletable.
            // Moving over the delete button does not change any state.
            return;
        }

        // Make sure we always point mouseOverDeletable at the outer of the two sectiots of the deleteable.
        // See: uiBuilder.buildListElements()
        const newOver = (event.target.classList.contains('gdnt-deletable-inner')) ? event.target.parentNode : event.target;
        if (this.#mouseOverDeletable != newOver) {
            this.#mouseOverDeletable = newOver;
            this.#mouseOverDeletable.classList.add('goog-button-hover');
            this.#mouseOverDeletable.style.paddingRight = '37px';
            this.#mouseOverDeletable.children[0].setAttribute('data-tooltip-offset', '-37');
        }

        // Make sure the delete button is visable and scrolled to the correct location.
        //const top = this.#mouseOverDeletable.getBoundingClientRect().top + window.scrollY - 47 - document.getElementById('kix-horizontal-ruler-container').offsetHeight - document.getElementById('docs-chrome').offsetHeight + document.getElementsByClassName('navigation-widget-content')[0].scrollTop;
        const top = this.#mouseOverDeletable.getBoundingClientRect().top + window.scrollY - document.getElementsByClassName('left-sidebar-container-content')[0].getBoundingClientRect().top - 49 + document.getElementsByClassName('navigation-widget-content')[0].scrollTop;
        const cross = document.getElementById('gdnt-delete-item');
        cross.style.top = `${top}px`;
        cross.style.display = 'block';
        const removeToolTip = this.#mouseOverDeletable.getAttribute('data-deletable-tt');
        const name = this.#mouseOverDeletable.children[0].getAttribute('data-tooltip');
        cross.setAttribute('data-tooltip', removeToolTip);
        cross.children[0].setAttribute('data-tooltip', removeToolTip);
    }

    deletableLeave(event) {
        var resetCurrentMouseOver = false;
        const isSrcDeleteButton = event.target.classList.contains('gdnt-deletable-nofocus');
        const isDestDeleteButton = event.relatedTarget.classList.contains('gdnt-deletable-nofocus');
        if (isSrcDeleteButton && isDestDeleteButton) {
            // Moving between the parts of the delete button does not change state.
        }
        else if (isDestDeleteButton) {
            // If we are moving from a deletable to the delete button.
            // Then no action is required (Same as mouseEnter)
        }
        else if (isSrcDeleteButton) {
            // We are leaving a delete button.
            // Get the element we are moving over. If this is a deletable make sure
            // we pick the outer of the two sections to a deletable object (see uiBuilder.buildListelements)
            // If this is not the deletable we were previuously over then we need to reset the previous element
            // to its original state.
            const newOver = (event.relatedTarget.classList.contains('gdnt-deletable-inner')) ? event.relatedTarget.parentNode : event.relatedTarget;
            if (newOver != this.#mouseOverDeletable) {
                resetCurrentMouseOver = true;
            }
        }
        else {
            // If we are leaving the deletable that is currently active
            // Note: we have taken care of moving to over the delete button.
            // Then we need to reset the state of the deletable.
            if (event.target == this.#mouseOverDeletable) {
                resetCurrentMouseOver = true;
            }
        }

        if (resetCurrentMouseOver && this.#mouseOverDeletable) {
            this.#mouseOverDeletable.classList.remove('goog-button-hover');
            this.#mouseOverDeletable.style.paddingRight = '8px';
            this.#mouseOverDeletable.children[0].setAttribute('data-tooltip-offset', '-8');
            this.#mouseOverDeletable = null;
        }

        // Hide the delete button only if
        // the mouse moves away from a deletable objet.
        if (!event.relatedTarget.classList.contains('gdnt-deletable')) {
            document.getElementById('gdnt-delete-item').style.display = 'none';
        }
    }

    addUI() {
        const storageData = this.#storage.sessionStart((session) => {
            return [false, session];
        });

        console.log(JSON.stringify(storageData, null, 4));

        const block = this.getOrCreateRoot();
        block.innerHTML = this.#uiBuilder.build(storageData, this.#currentPage);

        const page = storageData.getPage(this.#currentPage);
        const hasNote = page.noteURL != '';

        document.getElementById('gdnt-notes-edit').style.display = hasNote ? 'block' : 'none';
        document.getElementById('gdnt-notes-add').style.display = hasNote ? 'none' : 'block';
        document.getElementById('gdnt-notes-list-of-notes').style.display = hasNote ? 'none' : 'block';
        document.getElementById('gdnt-notes-edit').addEventListener('click', (event) => {this.addNotesClick(event, page.noteUrl);});
        document.getElementById('gdnt-notes-add').addEventListener('click', (event) => {this.addNotesClick(event, 'https://docs.google.com/document/d/');});
        document.getElementById('gdnt-labels-add').addEventListener('click', (event) => {this.addLabelClick(event);});
        document.getElementById('gdnt-delete-item').addEventListener('click', (event) => {this.delPageNoteClick(event, this.#mouseOverDeletable.getAttribute('value'));});
        for (const link of document.getElementsByClassName('gdnt-deletable')) {
            link.addEventListener('mouseenter', (event) => {this.deleteableEnter(event)});
            link.addEventListener('mouseleave', (event) => {this.deletableLeave(event)});
        }
        for (const link of document.getElementsByClassName('gdnt-label')) {
            link.addEventListener('mouseenter', (event) => {event.target.children[0].style.color = 'green';});
            link.addEventListener('mouseleave', (event) => {event.target.children[0].style.color = '#444746';});
            link.addEventListener('click', (event) => {this.addLabelClickPageClick(event, link.getAttribute('value'));});
        }
        for (const link of document.getElementsByClassName('gdnt-note')) {
            link.addEventListener('mouseenter', (event) => {event.target.children[0].style.color = 'green';});
            link.addEventListener('mouseleave', (event) => {event.target.children[0].style.color = '#444746';});
            link.addEventListener('click', (event) => {this.addNotesClickPageClick(event, link.getAttribute('value'));});
        }
    }

    createUI() {
        this.addUI();
        window.addEventListener('storage', (event) => {
            if (event.key == this.#storage.GDNTStorageName) {
                if (document.visibilityState != 'visible') {
                    this.#pageDirty = true;
                }
                else {
                    // Don't update if I was the page that did the change.
                    this.addUI();
                }
            }
        });
        document.addEventListener('visibilitychange', (event) => {
            if (document.visibilityState == 'visible') {
                if (this.#pageDirty) {
                    this.addUI();
                }
            }
        });
    }

    constructor(storage, uiBuilder, page) {
        this.#storage = storage;
        this.#uiBuilder = uiBuilder;
        this.#currentPage = page;
        this.#mouseOverDeletable = null;
        this.#pageDirty = false;
    }
}

(function() {
    const storage = new Storage();

    const uiBuilder = new UIBuilder();

    const ui = new UI(storage, uiBuilder, Util.cleanUrl(window.location.href));

    // Wait for particular DOM elements to exist before starting up my code.
    // Basically the google docs page has to execute some code to add the different parts of the document.
    // This waits until those parts of the document exist then adds this UI into the middle of that.

    waitForKeyElements('div.left-sidebar-container div.navigation-widget-smart-summary-container', () => {ui.createUI();});

})();
// ==UserScript==
// @name         SCEditor Library for Forumactif
// @version      0.1
// @description  A library dedicated to adding and removing custom buttons on SCEditor toolbars.
// @author       Miyuun
// @match        https://whoareyou.forumactif.com/t1310p125-une-ile-perdue-dans-les-caraibes
// @icon         https://www.google.com/s2/favicons?domain=forumactif.com
// @license      MIT
// @grant        none
// @namespace https://greasyfork.org/users/23836
// @downloadURL https://update.greasyfork.org/scripts/447635/SCEditor%20Library%20for%20Forumactif.user.js
// @updateURL https://update.greasyfork.org/scripts/447635/SCEditor%20Library%20for%20Forumactif.meta.js
// ==/UserScript==

/* ------------------ LIBRARY FOR TOOLBAR ------------------ */

class SCEditorElement {
    constructor(id, parent) {
        this.id = id;
        this.parent = parent;
    }

    // Implements on Extends if needed
    getNode() {
        return this.element ? this.element : document.getElementById(this.id);
    }

    // Implements on Extends
    createNode() {
        this.parent.element.append(this.element);
    }

    // Implements on Extends
    delete() {
        this.element.remove();
        this.parent = null;
        delete this;
    }
}

class SCEditorButton extends SCEditorElement {

    constructor(id, group, img, title, click) {
        super(id, group);
        this.createNode(id, img, title, click);
    }

    getNode() {
        return this.element ? this.element : document.getElementById(this.id);
    }

    createNode(id, img, title, click) {
        if(!!this.getNode(id)){
            return this.getNode(id);
        }

        // Creating the 'a' element and setting attributes
        this.element = document.createElement('a');
        this.element.setAttribute('class', 'sceditor-button');
        this.element.setAttribute('unselectable', 'on');
        this.element.setAttribute('title', title);
        this.element.id = id;
        this.element.SCEditorElement = this;
        this.element.onclick = click;

        // Appending the 'div' element to it and setting attributes
        this.element.append(document.createElement('div'));
        this.element.firstChild.setAttribute('style', 'background-image: url("' + img + '");');
        this.element.firstChild.setAttribute('unselectable', 'on');
        this.element.firstChild.innerHTML = title;

        super.createNode();
    }

    delete() {
        delete this.parent?.buttons[this.id];

        super.delete();
    }
}

class SCEditorGroup extends SCEditorElement {
    constructor(id, toolbar, buttons) {
        super(id, toolbar);
        this.buttons = buttons || {};
        this.createNode(id);
    }

    // Implements on Extends if needed
    getNode() {
        return this.element ? this.element : document.getElementById(this.id);
    }

    // Implements on Extends
    createNode(id) {
        if(!!this.getNode(id)){
            return this.getNode(id);
        }

        this.element = document.createElement('div');
        this.element.setAttribute('class', 'sceditor-group');
        this.element.id = id;
        this.element.SCEditorElement = this;

        this.parent.element.append(this.element);

        for(var buttonId in this.buttons){
            this.buttons[buttonId].parentGroup = this;
        }

        super.createNode();
    }

    createButton(id, img, title, click){
        var newButton = new SCEditorButton(id, this, img, title, click);
        this.buttons[id] = newButton;

        return newButton;
    }

    delete() {
        delete this.parent?.buttons[this.id];

        super.delete();
    }
}

class SCEditorToolbar extends SCEditorElement {
    constructor(id, toolbarElement, groups) {
        super(id, null);
        this.element = toolbarElement;
        this.element.SCEditorElement = this;
        this.groups = groups || {};
    }

    // Implements on Extends if needed
    getNode() {
        return this.element ? this.element : document.getElementById(this.id);
    }

    createGroup(id, buttons){
        var newGroup = new SCEditorGroup(id, this, buttons);
        this.groups[id] = newGroup;

        return newGroup;
    }

    createButton(id, img, title, click){
        var newGroup = this.createGroup(id + 'Group');
        var newButton = new SCEditorButton(id, newGroup, img, title, click);
        newGroup.buttons[id] = newButton;

        return newButton;
    }

    // We don't create SCEditor toolbars, we link them to the object, that's all
    // createNode(id) {
    //     if(!!this.getNode(id)){
    //         return this.getNode(id);
    //     }
    // }
}

document.querySelectorAll('.sceditor-toolbar').forEach((tb, index) => {
    window[`toolbar_${index}`] = new SCEditorToolbar(index, tb);
});

/* ---------------- END LIBRARY FOR TOOLBAR ---------------- */
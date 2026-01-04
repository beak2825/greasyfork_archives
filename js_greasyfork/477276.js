// ==UserScript==
// @name         sis001 upload multiple file
// @namespace    http://tampermonkey.net/
// @homepageURL  https://github.com/fear1999/tampermonkey-scripts
// @supportURL   https://greasyfork.org/zh-CN/scripts/477276/feedback
// @version      0.5
// @description  upload multiple files
// @author       fear1999
// @match        https://sis001.com/forum/post.php?action=newthread*
// @match        https://sis001.com/forum/post.php?action=edit*
// @match        https://sis001.com/forum/post.php?action=reply*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sis001.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477276/sis001%20upload%20multiple%20file.user.js
// @updateURL https://update.greasyfork.org/scripts/477276/sis001%20upload%20multiple%20file.meta.js
// ==/UserScript==

class MultiUpload {
    constructor() {
        this.configMultipleInput = this.configMultipleInput.bind(this)
        this.customInsertAttach = this.customInsertAttach.bind(this)
        this.replaceInput = this.replaceInput.bind(this)
        this.createFileList = this.createFileList.bind(this)
    }

    main() {
        this.configMultipleInput()
        this.origainalInsertAttach = globalThis.insertAttach
        globalThis.insertAttach = this.customInsertAttach
    }

    configMultipleInput() {
        Array.from(
            document
            .getElementById('posteditor_bottom')
            .getElementsByTagName('input')
        ).forEach((ele) => {
            if (ele.name == 'attach[]') {
                this.replaceInput(ele, (newInput) => {
                    newInput.setAttribute('multiple', 'multiple')
                })
            }
        })
    }

    customInsertAttach(id) {
        let input = document.getElementById('attach_' + id)
        let files = input.files
        Array.from(files)
            .forEach((file, index) => {
                let currentId = id + index
                let currentInput = document.getElementById('attach_' + currentId)
                this.replaceInput(currentInput, (newInput) => {
                    newInput.files = this.createFileList(file)
                })
                this.origainalInsertAttach(currentId)
            })
    }

    replaceInput(old, op) {
        let newInput = old.cloneNode()
        newInput.onchange = old.onchange
        op(newInput)
        old.parentElement.replaceChild(newInput, old)
        return newInput
    }

    createFileList(file) {
        let newList = new DataTransfer()
        newList.items.add(file)
        return newList.files
    }
}


(new MultiUpload()).main()

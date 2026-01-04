// ==UserScript==
// @name         sucem_qxgl_enhance
// @namespace    http://esclt.net/
// @version      0.1
// @description  业务管理系统员工授权页面增强
// @author       janken.wang@hotmail.com
// @match        http://10.0.0.205/sl/s_qxgl.jsp
// @icon         https://www.google.com/s2/favicons?domain=0.205
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435563/sucem_qxgl_enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/435563/sucem_qxgl_enhance.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /** 从一个用户复制所有的权限
     ** 可以方便的复制给另一个用户
    */

    class Page {
        constructor(htmlDocument) {
            this.document = htmlDocument;
        }

        /** query all selected privilege checkbox
         ** return the array contains privilege label and id
        **/
        copyPrivilegesFromUser() {
            const selectedPrivileges = this.document.querySelectorAll('input:checked')
            return Array.from(selectedPrivileges).map( ele => {
                return {id: ele.id, label: ele.parentNode.innerText}
            })
        }

        /** for each all privileges and set the checkbox to checked when id in privileges
        **/
        pastePrivilegesToUser(privileges) {
            privileges.forEach(p => {
                document.getElementById(p.id).checked = true
            })
        }
    }

    class UserPrivilege {

        /** PrivilegeManager copy, paste privilege, contain all copyed privileges
         ** htmlDocument is current s_qxgl html document
         ** page can copy or paste the privileges on the page
        */
        constructor(htmlDocument, page) {
            this.document = htmlDocument;
            this.page = page;
        }

        copy() {
            this.privileges = this.page.copyPrivilegesFromUser()
            this.setContent(this.privileges)
        }

        paste() {
            this.page.pastePrivilegesToUser(this.privileges) // copy current privileges to page
        }

        createComponent() {
            const comp = this.document.createElement('div')
            comp.setAttribute('id', 'user-privilege')
            comp.style.hidden = false
            comp.style.position = 'fixed'
            comp.style.right = '10rem'
            comp.style.top = '5rem'
            comp.style.padding = '.5rem'
            comp.style.backgroundColor = 'rgba(0,0,0,0.5)'

            const copyButton = this.document.createElement('button')
            copyButton.innerText = '> 复制当前用户的权限'
            copyButton.style.padding = '.5rem'
            copyButton.addEventListener('click', () => this.copy())

            const pasteButton = this.document.createElement('button')
            pasteButton.innerText = '< 将权限复制到当前用户'
            pasteButton.style.padding = '.5rem'
            pasteButton.addEventListener('click', () => this.paste())

            const buttonBar = this.document.createElement('div') // button bar contain two buttons
            buttonBar.style.display = 'flex'
            buttonBar.style.justifyContent = 'space-between'
            buttonBar.style.gap = '1rem'

            buttonBar.appendChild(copyButton)
            buttonBar.appendChild(pasteButton)
            comp.appendChild(buttonBar)

            const content = this.document.createElement('div') // main content
            this.content = content // set conten to object.
            comp.appendChild(content)

            return comp
        }

        /** set the privileges data to main content
        **/
        setContent(privileges) {
            const privilegeList = this.document.createElement('div').appendChild(document.createElement('ul'))
            privilegeList.style.listStyleType = "square"
            privilegeList.style.color = "white"
            privilegeList.style.listStylePosition = "inside"
            this.content.appendChild(privilegeList)

            privileges.forEach(p => {
                const li = document.createElement('li')
                li.appendChild(document.createTextNode(p.label))
                privilegeList.appendChild(li)
            })

            this.content.replaceChild(privilegeList, this.content.firstChild) // clear earlyer content
        }
    }

    const main = () => {
        const page = new Page(document)
        //console.log(page.copyPrivilegesFromUser())

        const userPrivilege = new UserPrivilege(document, page)
        document.body.appendChild(userPrivilege.createComponent())
    }

    main()
})();
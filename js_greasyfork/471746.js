// ==UserScript==
// @name         Bunpro Cram Lists
// @namespace    https://greasyfork.org/users/1136094
// @version      0.4
// @description  Adds cram lists functionality to Bunpro.
// @author       alpha
// @match        https://bunpro.jp/cram
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bunpro.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471746/Bunpro%20Cram%20Lists.user.js
// @updateURL https://update.greasyfork.org/scripts/471746/Bunpro%20Cram%20Lists.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const cramCategories = document.getElementById("cramCategories")
    const cramCategoryTabs = document.getElementById("cramCategoriesContent")
    const cramsContainer = document.getElementsByClassName("cram-item-holder")[0]
    const saveAsListButton = document.getElementsByClassName("save-as-list")[0]

    //add ui related elements
    const listsTab = cramCategoryTabs.children[0].cloneNode()
    const listTabContainer = Object.assign(document.createElement("div"), {className: "tab-pane--body"})
    const listsContainer = Object.assign(document.createElement("div"), {className: "accordion cram-options"})
    listsTab.id = "lists"
    cramCategoryTabs.appendChild(listsTab)
    listsTab.appendChild(listTabContainer)
    listTabContainer.appendChild(listsContainer)

    const listsCategory = cramCategories.children[0].cloneNode(true)
    const categoryDiv = listsCategory.querySelector("div")
    categoryDiv.textContent = "Lists"
    categoryDiv.setAttribute("data-target", "#lists")
    cramCategories.insertBefore(listsCategory, cramCategories.children[4])

    const templateList = document.getElementsByClassName("card top-level-card")[0].cloneNode(true)
    const templateRemoveButton = Object.assign(document.createElement("i"), {className: "far fa-trash-alt"})
    Array.from(templateList.children[0].attributes).forEach(attribute => attribute.name != "class" && templateList.children[0].removeAttribute(attribute.name))
    templateList.querySelector("h2").classList.add("gap-3")
    templateList.querySelector("h2").insertBefore(templateRemoveButton, templateList.getElementsByClassName("add-button")[0])
    templateList.getElementsByClassName("fa-angle-right")[0].remove()
    templateList.getElementsByClassName("add-all-button")[0].remove()

    const listNameInput = Object.assign(document.createElement("input"), {className: "mt-2", placeholder: "List Name"})
    saveAsListButton.textContent = "Save as List"
    saveAsListButton.className = "btn btn--cta py-2 w-100 mt-1"
    document.getElementsByClassName("sticky-holder p-3")[0].insertBefore(listNameInput, saveAsListButton)

    //add lists from localstorage
    function loadLists() {
        var lists = JSON.parse(localStorage.getItem("__bunpro_cram_list")) || {"Example List": "[1,2,3]"}

        while (listsContainer.firstChild) {
            listsContainer.removeChild(listsContainer.firstChild)
        }

        Object.keys(lists).forEach(listName => {
            var ids = lists[listName]
            var list = templateList.cloneNode(true)
            var addButton = list.getElementsByClassName("add-button")[0]

            list.getElementsByClassName("u-text_main")[0].textContent = listName
            addButton.setAttribute("data-gp-ids", ids)
            addButton.setAttribute("data-human-info", listName)

            list.getElementsByClassName("fa-trash-alt")[0].onclick = function() {

                var lists = JSON.parse(localStorage.getItem("__bunpro_cram_list")) || {"Example List": "[1,2,3]"}

                delete lists[listName]
                localStorage.setItem("__bunpro_cram_list", JSON.stringify(lists))

                listsContainer.removeChild(list)
            }

            listsContainer.appendChild(list)
        })
    }

    //handle lists
    saveAsListButton.onclick = function() {
        const listName = listNameInput.value

        if (listName) {
            const lists = JSON.parse(localStorage.getItem("__bunpro_cram_list")) || {"Example List": "[1,2,3]"}
            const cramIds = []

            for (var cram of cramsContainer.children) {
                var cramId = cram.getAttribute("data-unmark-card-id")

                if (cramId) {
                    cramIds.push(Number(cramId.split("id_")[1]))
                }
            }

            lists[listName] = JSON.stringify(cramIds)

            localStorage.setItem("__bunpro_cram_list", JSON.stringify(lists))
            loadLists()
        }
    }

    loadLists()
})();
// ==UserScript==
// @name         GitLab页面调整
// @namespace    http://tampermonkey.net/
// @version      0.1.1.6
// @description  自动调整选项
// @author       王二
// @match http://code.aurogon.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424900/GitLab%E9%A1%B5%E9%9D%A2%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/424900/GitLab%E9%A1%B5%E9%9D%A2%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    let szVersionPrefix = '/5.2.'

    let save_change_button = document.querySelector("#edit_wiki_slug > div.form-actions > input")
    let delete_button = document.querySelector("#content-body > div.wiki-page-header.top-area.has-sidebar-toggle.flex-column.flex-lg-row > div")
    if (save_change_button && delete_button){
        let add_save_button = document.createElement('button')
        add_save_button.innerHTML = "Save changes"
        add_save_button.className = save_change_button.className //"btn gl-button btn-confirm qa-save-changes-button js-wiki-btn-submit"
        add_save_button.addEventListener("click", function(){
            save_change_button.click()
            add_save_button.className = save_change_button.className
        })
        delete_button.prepend(add_save_button)
    }

    let interval = setInterval(function(){
        let cherry_pick_commit_modal = document.querySelector("#cherry-pick-commit-modal___BV_modal_body_")
        if (cherry_pick_commit_modal) {
            //"#cherry-pick-commit-modal___BV_modal_body_ > form > div.form-group.gl-form-group > div > div > button"
            let switch_branch = cherry_pick_commit_modal.querySelector("div.form-group.gl-form-group > div > div > button")
            if (switch_branch && !switch_branch.isChanged) {
                switch_branch.isChanged = true
                //点一下打开
                switch_branch.click()
                //叉掉默认输入的master
                //#cherry-pick-commit-modal___BV_modal_body_ > form > div.form-group.gl-form-group > div > div > ul > div > div.gl-new-dropdown-contents > div > div > button
                let switch_branch_clear = cherry_pick_commit_modal.querySelector("div.gl-new-dropdown-contents > div > div > button")
                if (switch_branch_clear) {
                    switch_branch_clear.click()
                }
            }

            //焦点到输入框
            //"#cherry-pick-commit-modal___BV_modal_body_ > form > div.form-group.gl-form-group > div > div > ul > div > div.gl-new-dropdown-contents > div > input"
            let switch_branch_input = cherry_pick_commit_modal.querySelector("div.gl-new-dropdown-contents > div > input")
            if (switch_branch_input) {
                if (switch_branch_input.value == "" && !switch_branch_input.isChanged) {
                    switch_branch_input.isChanged = true
                    switch_branch_input.value = szVersionPrefix
                    switch_branch_input.dispatchEvent(new Event('input'))
                    switch_branch_input.focus()
                }
            }

            //new merge选中框
            //#cherry-pick-commit-modal___BV_modal_body_ > form > div.gl-form-checkbox.gl-mt-3.custom-control.custom-checkbox > input
            let new_merge_request_checkbox = cherry_pick_commit_modal.querySelector("input.custom-control-input")
            if (new_merge_request_checkbox && !new_merge_request_checkbox.isChanged) {
                new_merge_request_checkbox.isChanged = true
                new_merge_request_checkbox.checked = false
            }
        }
    }, 100);
})();
// ==UserScript==
// @name         Dynalist Utils - 0.22
// @version      0.22
// @description  Add Bookmark and Duplicate node for Dynalist.io
// @author       Piotr S. and modify with Gampol T.
// @match        https://dynalist.io/d/*
// @namespace https://greasyfork.org/en/scripts/381559-dynalist-utils/code
// @downloadURL https://update.greasyfork.org/scripts/381559/Dynalist%20Utils%20-%20022.user.js
// @updateURL https://update.greasyfork.org/scripts/381559/Dynalist%20Utils%20-%20022.meta.js
// ==/UserScript==

/* jshint ignore:start */
////////////////////////////////////////////////// add or remove bookmark //////////////////////////////////////////////////

const addRemoveBookmark = () => {
    let bookmarks = DYNALIST.app.userspace.userspace.get_bookmarks();
    let node;
    if (DYNALIST.app.app_document.view.current_selection().node) {
        node = DYNALIST.app.app_document.view.current_selection().node
    } else if (DYNALIST.app.app_document.view.current_selection().from_node) {
        node = DYNALIST.app.app_document.view.current_selection().from_node
    } else { return; }
    let nodeId = node.id;

    let bookmarkAlreadyExist = null;
    $.each(bookmarks, function (index, bookmark) {
        let doc = bookmark.data_obj.data.d;
        let zoom = bookmark.data_obj.data.z;
        if ((doc === nodeId || zoom === nodeId) && bookmark.index >= 0) {
            bookmarkAlreadyExist = bookmark;
            return false;
        }
    });

    if (!bookmarkAlreadyExist) {
        let cursorPosition = DYNALIST.app.app_document.ui.selection_manager.document_ui.view.current_selection().position_end;
        let urlState = DYNALIST.app.userspace.view.get_url_state(DYNALIST.app.get_current_app_document().document, node);
        let i = DYNALIST.app.userspace.controller.create_bookmark(DYNALIST.app.userspace.userspace.get_root_bookmark().num_children())
        let n = i.get_data_object().clone()
        n.set_url_manager_state(urlState)
        n.set_title(DYNALIST.app.userspace.view.get_default_bookmark_name(n))
        DYNALIST.app.userspace.view.controller.edit_bookmark(i, n.write())
        DYNALIST.app.userspace.view.start_renaming(i)
        DYNALIST.app.userspace.view.stop_renaming()
        DYNALIST.app.userspace.view.ui.update_bookmark_status()
        DYNALIST.app.app_document.ui.selection_manager.set_cursor_to_position_in_node(node, cursorPosition);
        DYNALIST.app.userspace.ui.popup_message_manager._display_popup('Bookmark for "' + DYNALIST.app.userspace.view.get_default_bookmark_name(n) + '" was successfully CREATED.', { dismissible: 1, autoclose: 1, error: 0 })
    } else {
        DYNALIST.app.userspace.controller.remove_bookmark(bookmarkAlreadyExist);
        DYNALIST.app.userspace.ui.update_bookmark_status();
        DYNALIST.app.userspace.ui.popup_message_manager._display_popup('Bookmark for "' + bookmarkAlreadyExist.get_data_object().get_title() + '" was successfully REMOVED.', { dismissible: 1, autoclose: 1, error: 0 })
    }
}



////////////////////////////////////////////////// duplicate item //////////////////////////////////////////////////


const duplicateItem = (children = true) => {
    let nodes = []
    if (DYNALIST.app.app_document.view.current_selection().node) {
        nodes.push(DYNALIST.app.app_document.view.current_selection().node)
    } else if (DYNALIST.app.app_document.view.current_selection().from_node) {
        nodes = DYNALIST.app.app_document.view.current_selection().nodes
    } else { return; }

    let cursorPosition = DYNALIST.app.app_document.ui.selection_manager.document_ui.view.current_selection().position_end || 0
    let indexForNewNode = nodes[nodes.length - 1].index + 1
    let parent = nodes[0].parent

    $.each(nodes, function (i, node) {
        let newNode;
        if (children) {
            newNode = DYNALIST.app.app_document.controller.clone_node_and_children(node, parent, indexForNewNode)
        } else {
            newNode = DYNALIST.app.app_document.controller.clone_node_self(node, parent, indexForNewNode)
        }

        if (i === 0) {
            DYNALIST.app.app_document.ui.selection_manager.set_cursor_to_position_in_node(newNode, cursorPosition);
        }

        indexForNewNode++
    })
}





////////////////////////////////////////////////// Setting //////////////////////////////////////////////////
// or use @require      https://cdnjs.cloudflare.com/ajax/libs/keyboardjs/2.3.3/keyboard.min.js

document.onkeydown = function (e) {
    // bind ctrl+d
    if (e.ctrlKey && e.which == 68) {
        e.preventDefault()
        addRemoveBookmark()
        // bind alt+shift+down
    } else if (e.shiftKey && e.altKey && e.which == 40) {
        e.preventDefault()
        duplicateItem(true)
        // bind ctrl+c
    } else if (e.ctrlKey && e.which == 67) {
        e.preventDefault()
        var k = DYNALIST.app.app_document.view
        k.toggle_checked_items_visibility()
        // bind alt+enter
    } else if (e.altKey && e.which == 13) {
        e.preventDefault()
        var k = DYNALIST.app.app_document.view
        k.toggle_notes_visibility()
    }
};
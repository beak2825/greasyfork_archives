// ==UserScript==
// @name         Kiwi Farms Hightlighted Post Keyboard Shortcuts
// @namespace    http://kiwifarms.st
// @version      20251210
// @description  Allows you to move between highlighted posts with the A and D keys.
// @author       Enzo
// @match        https://kiwifarms.st/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kiwifarms.st
// @grant        none
// @license      CC0
// @downloadURL https://update.greasyfork.org/scripts/543756/Kiwi%20Farms%20Hightlighted%20Post%20Keyboard%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/543756/Kiwi%20Farms%20Hightlighted%20Post%20Keyboard%20Shortcuts.meta.js
// ==/UserScript==

let SelectedPost;
function FindPost(ID) {
    return document.querySelector(`article[data-content="${ID}"]`);
}

function GetPostFromHash() {
    let Hash = window.location.hash;
    if (!Hash) {
        return;
    }

    const ID = Hash.substring(1);
    return FindPost(ID);
}

function ClickHightlightAnchor(Anchor) {
    let NewPost;
    let Href = Anchor.getAttribute('href');
    if (Href) {
        if (Href.startsWith('#')) {
            // If just a hash, make it the selected post.
            const ID = Href.substring(1);
            NewPost = FindPost(ID);
            //window.location.hash = Href; // Update page hash as well.
        } else {
            NewPost = true;//Prevents us from falling back to the global buttons.
        }
        Anchor.click();
    } else {
        // Probably at the very start of end, so do nothing.
        return true;
    }

    return NewPost;
}

function ClickPostHighlight(PostElement, Direction) {
    let QueryString = 'a.hb-react-highlight';
    if (Direction < 0) { QueryString += 'Prev'; }
    else if (Direction > 0) { QueryString += 'Next'; }
    else { return; }

    const Anchor = PostElement.querySelector(QueryString);
    if (!Anchor) {
        console.error(`Unable to locate ${Direction < 0 ? "previous": "next"} highlight anchor.`, PostElement);
        return;
    }

    return ClickHightlightAnchor(Anchor);
}

function ChangeSelectedPost(New) {
    if (SelectedPost) {
        const Former = SelectedPost.querySelector('div.message-cell--main');
        Former.style.background = null;
    }
    SelectedPost = New;
    if (New) {
        const NewMain = SelectedPost.querySelector('div.message-cell--main');
        NewMain.style.background = '#0002';
    }
}

function DoMove(Dir) {
    if (SelectedPost) {
        const NewPost = ClickPostHighlight(SelectedPost, Dir);
        if (NewPost) {
            if (NewPost !== true) {// Redirect to another page.
                console.log('New Selected Post from existing;', SelectedPost, '->', NewPost);
                ChangeSelectedPost(NewPost);
            }
            return;
        }
    }

    // No current selected post. Fall back to the core highlight buttons.
    const BlockOuter = document.querySelector('div.block-outer-opposite');
    let ClassName = 'i.fa-award';
    if (Dir < 0) {
        ClassName = 'i.fa-backward';
    }
    const IEle = BlockOuter.querySelector(ClassName);
    if (!IEle) {
        console.error(`Unable to locate global ${Dir < 0 ? "previous" : "next"} highlight class;`, ClassName);
        return;
    }

    const ParentAnchor = IEle.closest('a');// This causes a side effect once you're on pages after the final highlight. It will take you back to the final highlight. More of a feature than a bug.
    if (!ParentAnchor) {
        console.error(`Unable to locate global ${Dir < 0 ? "previous" : "next"} highlight anchor. Reached;`, ParentAnchor);
        return;
    }

    const NewPost = ClickHightlightAnchor(ParentAnchor);
    if (NewPost && NewPost !== true) {
        console.log('New Selected Post from global highlight buttons;', NewPost);
        ChangeSelectedPost(NewPost);
    }
}

function DoKeyDown(e) {
    if (!(document.activeElement == document.body || document.activeElement == document.documentElement)) {
        return;
    }

    let Dir = 0;
    switch (e.code) {
        case 'KeyA'://Back
            Dir = -1;
            break;
        case 'KeyD'://Forward
            Dir = 1;
            break;
        default:
            return;
    }

    DoMove(Dir);
}

(function() {
    'use strict';
    ChangeSelectedPost(GetPostFromHash());
    if (SelectedPost) {
        console.log('OnLoad Selected Post', SelectedPost);
    }

    document.addEventListener('keydown', DoKeyDown, false);
})();
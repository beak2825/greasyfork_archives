// ==UserScript==
// @name           Fimfiction Comment Tweaks
// @description    Tweaks for Fimfiction comments
// @author         Pluie
// @version        0.2.2
// @license        MIT
// @homepageURL    https://github.com/PluieElectrique/fimfic-comment-tweaks
// @supportURL     https://github.com/PluieElectrique/fimfic-comment-tweaks/issues
// @match          *://www.fimfiction.net/*
// @grant          none
// @run-at         document-idle
// @noframes
// @namespace https://greasyfork.org/users/307405
// @downloadURL https://update.greasyfork.org/scripts/384602/Fimfiction%20Comment%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/384602/Fimfiction%20Comment%20Tweaks.meta.js
// ==/UserScript==

// Note about mobile: To be consistent with Fimfiction, this script detects mobile by using
// `is_mobile`, a global declared in an inline script in <head>. It seems detection of mobile
// browsers is done server side (probably through user agent).

"use strict";

let commentController;
let comment_list;

const QUOTE_LINK_HOVER_DELAY = 85;
const ctCSS = `
.ct--collapse-button { padding: 3px; }
.ct--collapsed-comment .author > .avatar { display: none; }
.ct--collapsed-comment .comment_callbacks > a { opacity: 0.7; }
.ct--collapsed-comment .comment_callbacks > div { display: none; }
.ct--collapsed-comment .comment_data { display: none; }
.ct--collapsed-comment .comment_information:after { height: 0; }
.ct--deleted-link { text-decoration: line-through; }
.ct--expanded-link { opacity: 0.7; }
.ct--forward-hidden { display: none; }
.ct--parent-link-highlight { text-decoration: underline; }
@media all and (min-width: 701px) {
  .comment .data, .comment_information > .buttons { padding-right: 0.3rem; }
  .inline-quote .meta > .name { display: inline; }
}
.embed-container .placeholder.hidden { display: none; }
`;

// A wrapper object that will be assigned onto the real comment controller
const commentControllerShell = {
    // Map from comment ID to { author: string; index?: number; deleted?: boolean }
    commentMetadata: {},

    /* Methods that shadow existing methods */

    getComment(id) {
        let comment = document.getElementById("comment_" + id);
        let promise;
        if (comment === null) {
            promise = CommentListController.prototype.getComment.call(this, id);
        } else {
            promise = Promise.resolve(comment);
        }

        // We always rewrite the comment in case there's new metadata that we didn't have before.
        return promise.then(comment => {
            let link = comment.querySelector(`a[href='#comment/${id}']`);
            // An equivalent way of checking if a comment is deleted
            if (link !== null) {
                let meta = this.commentMetadata[id];
                if (meta === undefined) {
                    // Remove "#" to avoid confusing comment IDs with comment indexes
                    link.textContent = link.textContent.replace("#", "");
                } else {
                    // Rewrite comment index
                    link.textContent = formatCommentIndex(meta.index);
                }
                this.rewriteQuoteLinks(comment);
            }
            return comment;
        });
    },

    setupQuotes() {
        CommentListController.prototype.setupQuotes.call(this);
        this.storeComments();
        this.rewriteQuoteLinks(this.comment_list);
        setupCollapseButtons();
    },

    goToPage(num) {
        this.storeComments();
        return CommentListController.prototype.goToPage.call(this, num).then(_ => {
            if (is_mobile) {
                let numComments = document.querySelector(".num-comments").textContent;
                // There's a space before "Comments" for consistency with the Fimfiction HTML
                document.querySelector(
                    ".comments-header > .fa-comments"
                ).nextSibling.nodeValue = ` Comments ( ${numComments} )`;
            }
        });
    },

    beginShowQuote(quoteLink) {
        // Just in case a mouseover event is triggered before the last mouseover's mouseout has
        this.endShowQuote();

        let cancel = false;
        this.getComment(quoteLink.dataset.comment_id).then(comment => {
            if (cancel) {
                return;
            }

            let parent = fQuery.closestParent(quoteLink, ".comment");

            let clone = cloneComment(comment);
            markParentLink(parent, clone);
            this.quote_container.appendChild(clone);

            let parentRect = this.comment_list.getBoundingClientRect();
            let style = this.quote_container.style;
            style.top = quoteLink.getBoundingClientRect().bottom + fQuery.scrollTop() + 8 + "px";
            style.left = parentRect.left - 6 + "px";
            style.width = parentRect.width + 12 + "px";

            App.DispatchEvent(this.quote_container, "loadVisibleImages");
        });

        return () => {
            cancel = true;
        };
    },

    endShowQuote() {
        clearTimeout(this.hoverTimeout);
        if (this.quote_container.firstChild !== null) {
            removeElement(this.quote_container.firstChild);
        }
    },

    expandQuote(quoteLink) {
        let parent = fQuery.closestParent(quoteLink, ".comment");

        // Don't expand parent links or links within collapsed comments
        let linkStatus = getQuoteLinkStatus(quoteLink);
        if (linkStatus.parentCollapsed || linkStatus.isParentLink) {
            return;
        }

        this.endShowQuote();

        // This probably causes a bug when two links to the same comment are expanded, and the
        // bottom is collapsed. The top comment will disappear instead of the bottom. I don't think
        // it's important enough to fix though.
        let linkedId = quoteLink.dataset.comment_id;
        let expandedComment = quoteLink.parentNode.querySelector(
            `.comment[data-comment_id='${linkedId}']`
        );
        if (expandedComment === null) {
            this.getComment(linkedId).then(comment => {
                let clone = cloneComment(comment);
                markParentLink(parent, clone);
                clone.classList.add("inline-quote");

                forwardHide(quoteLink, 1);
                quoteLink.classList.add("ct--expanded-link");

                if (!is_mobile && !isCommentDeleted(comment)) {
                    // Add middot after username in .meta to separate it from the index. On mobile,
                    // the username is `display: block;`, so we don't need a separator.
                    fQuery.insertAfter(clone.querySelector(".meta > .name"), createMiddot());
                }

                if (quoteLink.classList.contains("comment_callback")) {
                    // Search backwards through .comment_callbacks for the last quote link, and
                    // place this comment after it. This keeps quote links together at the top and
                    // orders expanded comments from most to least recently expanded.
                    let lastLink = quoteLink.parentElement.lastElementChild;
                    while (lastLink.tagName !== "A") {
                        lastLink = lastLink.previousElementSibling;
                    }
                    fQuery.insertAfter(lastLink, clone);
                } else {
                    fQuery.insertAfter(quoteLink, clone);
                }
            });
        } else {
            // Update forward hiding counts for all expanded links
            for (let expandedLink of expandedComment.querySelectorAll(".ct--expanded-link")) {
                forwardHide(expandedLink, -1);
            }
            removeElement(expandedComment);
            forwardHide(quoteLink, -1);
            quoteLink.classList.remove("ct--expanded-link");
        }
    },

    previous() {
        if (this.current_page > 1) {
            location.hash = `#page/${this.current_page - 1}`;
        }
    },

    next() {
        if (this.current_page < this.num_pages) {
            location.hash = `#page/${this.current_page + 1}`;
        }
    },

    /* Extra methods */

    storeComments() {
        for (let comment of this.comment_list.children) {
            if (isCommentDeleted(comment)) {
                this.commentMetadata[comment.dataset.comment_id] = {
                    author: comment.dataset.author,
                    deleted: true,
                };
            } else {
                let link = comment.querySelector("a[href^='#comment/']");
                this.commentMetadata[comment.dataset.comment_id] = {
                    author: comment.dataset.author,
                    index: Number(link.textContent.slice(1).replace(/,/g, "")),
                };
            }
        }
    },

    rewriteQuoteLinks(elem) {
        for (let quoteLink of elem.querySelectorAll(".comment_quote_link:not(.comment_callback)")) {
            let id = quoteLink.dataset.comment_id;
            let meta = this.commentMetadata[id];
            if (meta !== undefined) {
                if (meta.deleted) {
                    quoteLink.textContent = meta.author;
                    quoteLink.classList.add("ct--deleted-link");
                } else if (this.comment_list.querySelector("#comment_" + id) === null) {
                    // Rewrite cross-page comments
                    quoteLink.textContent = `${meta.author} (${formatCommentIndex(meta.index)})`;
                } else if (is_mobile) {
                    // On mobile, the prototype setupQuotes does nothing. So we have to rewrite all
                    // quote links
                    quoteLink.textContent = meta.author;
                }
            }
        }
    },
};

// Despite the @run-at option, the userscript is sometimes run before the Fimfiction JS, which
// causes errors. So, we wait for the page to be fully loaded.
if (document.readyState === "complete") {
    init();
} else {
    window.addEventListener("load", init);
}

function init() {
    let storyComments = document.getElementById("story_comments");
    if (storyComments === null) {
        return;
    }

    let style = document.createElement("style");
    style.textContent = ctCSS;
    document.head.appendChild(style);

    commentController = App.GetControllerFromElement(storyComments);
    comment_list = commentController.comment_list;
    Object.assign(commentController, commentControllerShell);

    commentController.storeComments();
    if (is_mobile) {
        commentController.rewriteQuoteLinks(comment_list);
    }
    setupCollapseButtons();

    setupEventListeners();

    // quote_container is used by beginShowQuote to store the hovered quote (when there is one). In
    // the original code, it's checked for on each call. Here, we create it at init.
    if (commentController.quote_container === null) {
        let container = document.createElement("div");
        container.className = "quote_container";
        document.body.appendChild(container);
        commentController.quote_container = container;
    }
}

function setupEventListeners() {
    fQuery.addScopedEventListener(comment_list, ".ct--collapse-button", "click", evt =>
        toggleCollapseCommentTree(fQuery.closestParent(evt.target, ".comment"))
    );

    let cancelCallback = null;
    fQuery.addScopedEventListener(comment_list, ".comment_quote_link", "mouseover", evt => {
        evt.stopPropagation();
        // Mouseover events can sometimes be triggered on mobile, but there's no point. They
        // just block the page.
        if (is_mobile) {
            return;
        }
        // Don't show popup quote for expanded links, links within collapsed comments, or links
        // to the parent comment
        let linkStatus = getQuoteLinkStatus(evt.target);
        if (!linkStatus.isExpanded && !linkStatus.parentCollapsed && !linkStatus.isParentLink) {
            commentController.hoverTimeout = setTimeout(() => {
                cancelCallback = commentController.beginShowQuote(evt.target);
            }, QUOTE_LINK_HOVER_DELAY);
        }
    });
    fQuery.addScopedEventListener(comment_list, ".comment_quote_link", "mouseout", () => {
        if (cancelCallback !== null) {
            cancelCallback();
            cancelCallback = null;
        }
    });

    for (let binder of App.globalBinders) {
        // These event listeners are "global binders." That is, they are added to each element that
        // matches the selector. But because this binding is only done at load (and in a few other
        // cases), and cloneNode does not copy event listeners, the listeners will not fire for
        // expanded comments. We add a scoped listener (with ".inline-quote" prepended so that
        // listeners don't fire twice) to fix this.
        if (binder.class === "user_image_link" || binder.class === "youtube_container") {
            fQuery.addScopedEventListener(
                comment_list,
                ".inline-quote " + binder.selector,
                binder.event,
                binder.binder
            );
        } else if (binder.class === "embed-container") {
            // Remove this listener. We replace it with a modified version below that hides
            // .placeholder instead of removing it. This way, we can restore the .placeholder when
            // cloning comments.
            for (let elem of document.querySelectorAll(binder.selector)) {
                elem.removeEventListener(binder.event, binder.binder);
            }
            // Disable the binder so we only have to remove listeners once
            binder.selector = binder.class = "";
        }
    }

    // Embed containers can occur outside of comments (e.g. in blog posts). So, we must scope this
    // listener to the whole page.
    fQuery.addScopedEventListener(document.body, ".embed-container", "click", evt => {
        let elem = fQuery.closestParent(evt.target, ".embed-container");
        if (elem.classList.contains("expanded")) {
            return;
        }

        let cookieConsent = App.GetDependency("cookieConsent");
        cookieConsent.requestConsent(["embed"]).then(
            () => {
                elem.classList.add("expanded");
                elem.querySelector(".video").innerHTML = `<iframe src="${
                    elem.dataset.src
                }" frameborder="0" allowfullscreen></iframe>`;
                elem.querySelector(".placeholder").classList.add("hidden");
            },
            () => {
                ShowErrorWindow("Cannot view embedded content without consenting to embed cookies");
            }
        );
    });
}

function isCommentDeleted(comment) {
    return (
        comment.firstElementChild.classList.contains("message") &&
        comment.lastElementChild.classList.contains("hidden")
    );
}

function forwardHide(quoteLink, change) {
    // Callbacks expand newer comments into older ones. So, in ASC order (oldest to newest), we
    // forward hide when expanding callbacks. Non-callbacks expand older comments. So, in DESC order
    // (newest to oldest), we forward hide when expanding non-callbacks.
    let isCallback = quoteLink.classList.contains("comment_callback");
    let isASC = commentController.order === "ASC";
    if (isCallback !== isASC) {
        return;
    }

    let comment = comment_list.querySelector("#comment_" + quoteLink.dataset.comment_id);
    // Don't hide foreign comments
    if (comment === null) {
        return;
    }

    let newCount = Number(comment.dataset.expandCount || 0) + change;
    if (newCount < 0) {
        throw new Error("Expand count cannot be less than 0");
    } else if (newCount === 0) {
        comment.classList.remove("ct--forward-hidden");
    } else if (newCount === 1) {
        comment.classList.add("ct--forward-hidden");
    }
    comment.dataset.expandCount = newCount;
}

function setupCollapseButtons() {
    for (let metaName of comment_list.querySelectorAll(".meta > .name")) {
        fQuery.insertAfter(metaName, createMiddot());

        let collapseButton = document.createElement("a");
        collapseButton.classList.add("ct--collapse-button");
        let minus = document.createElement("i");
        minus.classList.add("fa", "fa-minus-square-o");
        collapseButton.appendChild(minus);
        fQuery.insertAfter(metaName, collapseButton);
    }
}

function toggleCollapseCommentTree(comment) {
    collapseCommentTree(comment, !comment.classList.contains("ct--collapsed-comment"));
}
function collapseCommentTree(comment, collapse) {
    comment.classList.toggle("ct--collapsed-comment", collapse);

    let collapseIcon = comment.querySelector(".ct--collapse-button > i");
    collapseIcon.classList.toggle("fa-plus-square-o", collapse);
    collapseIcon.classList.toggle("fa-minus-square-o", !collapse);

    // We always collapse comments which appear later in the comment list. Exactly which quote links
    // we search through depends on the sorting order.
    let comment_id = comment.dataset.comment_id;
    if (commentController.order === "ASC") {
        // We are careful to not select any quote links in expanded comments
        let quoteLinks = comment.querySelectorAll(`#comment_callbacks_${comment_id} > a`);
        for (let quoteLink of quoteLinks) {
            let nextComment = comment_list.querySelector(
                "#comment_" + quoteLink.dataset.comment_id
            );
            collapseCommentTree(nextComment, collapse);
        }
    } else {
        // There's no easy way to select the quote links in the .data of this comment and ignore
        // links in expanded comments. It would require a :not(descendant of inline quote) selector,
        // which isn't possible. So, we select callbacks which point to the current comment, and
        // then get the comments which have those callbacks. This seems inefficient, but it only
        // uses DOM lookups, and doesn't require extracting and storing data from the DOM, which I
        // think would increase complexity.
        let quoteLinks = comment_list.querySelectorAll(
            `span[id^='comment_callbacks_'] > a[data-comment_id='${comment_id}']`
        );
        for (let quoteLink of quoteLinks) {
            collapseCommentTree(fQuery.closestParent(quoteLink, ".comment"), collapse);
        }
    }
}

// Clone a comment and reset it
function cloneComment(comment) {
    let clone = comment.cloneNode(true);

    clone.removeAttribute("id");
    // Needed for comment collapsing
    let callbacks = clone.querySelector(".comment_callbacks");
    if (callbacks !== null) {
        callbacks.removeAttribute("id");
    }
    // Get rid of the blue highlight caused by clicking on the comment's index or posting date
    clone.classList.remove("comment_selected");

    // Remove quotes
    for (let inlineQuote of clone.querySelectorAll(".inline-quote")) {
        removeElement(inlineQuote);
    }

    // Remove ct classes. We don't remove parent-link-highlight because it's only applied to links
    // in expanded comments. It should be fine to leave deleted-link.
    clone.classList.remove("ct--forward-hidden");
    clone.classList.remove("ct--collapsed-comment");
    for (let expandedLink of clone.querySelectorAll(".ct--expanded-link")) {
        expandedLink.classList.remove("ct--expanded-link");
    }

    // Remove middot and collapse button
    let collapseButton = clone.querySelector(".ct--collapse-button");
    if (collapseButton !== null) {
        removeElement(collapseButton.nextElementSibling);
        removeElement(collapseButton);
    }

    // Reset .embed-container
    for (let embedContainer of clone.querySelectorAll(".embed-container")) {
        embedContainer.classList.remove("expanded");
        let frame = embedContainer.querySelector(".video").firstChild;
        if (frame !== null) {
            removeElement(frame);
        }
        embedContainer.querySelector(".placeholder").classList.remove("hidden");
    }

    return clone;
}

// Disable links to the parent comment to help prevent infinite nesting. Also highlight the link if
// there are other links in its section.
function markParentLink(parentComment, childComment) {
    let parentId = parentComment.dataset.comment_id;
    let linkToParent = childComment.querySelector(
        `.comment_quote_link[data-comment_id='${parentId}']`
    );
    if (linkToParent !== null) {
        // If there are other links in this quote link's section (comment data or callbacks), mark
        // this link for visibility
        let otherLink = fQuery
            .closestParent(linkToParent, ".comment_data, .comment_callbacks")
            .querySelector(`.comment_quote_link:not([data-comment_id='${parentId}'])`);
        if (otherLink !== null) {
            linkToParent.classList.add("ct--parent-link-highlight");
        }
        // This prevents the link from being expanded
        linkToParent.dataset.parentLink = true;
    }
}

function getQuoteLinkStatus(quoteLink) {
    return {
        isExpanded: quoteLink.classList.contains("ct--expanded-link"),
        isParentLink: quoteLink.dataset.parentLink,
        parentCollapsed: fQuery
            .closestParent(quoteLink, ".comment")
            .classList.contains("ct--collapsed-comment"),
    };
}

// https://stackoverflow.com/a/2901298
function formatCommentIndex(index) {
    return ("#" + index).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function createMiddot() {
    let middot = document.createElement("b");
    middot.textContent = "\u00b7";
    return middot;
}

function removeElement(elem) {
    elem.parentNode.removeChild(elem);
}

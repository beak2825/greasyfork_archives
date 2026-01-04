// ==UserScript==
// @name         Sololearn comments for code playground
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  View and write comments in code playground
// @author       DonDejvo
// @match        https://www.sololearn.com/compiler-playground/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sololearn.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457182/Sololearn%20comments%20for%20code%20playground.user.js
// @updateURL https://update.greasyfork.org/scripts/457182/Sololearn%20comments%20for%20code%20playground.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    class Store {
    static _instance;

    _token;
    _profile;

    static _get() {
        if (this._instance == null) {
            this._instance = new Store();
        }
        return this._instance;
    }

    static async login(userId, token) {
        this._get()._token = token;
        const data = await this.postAction("https://api3.sololearn.com/Profile/GetProfile", {
            excludestats: true,
            id: userId
        });
        this._get()._profile = data.profile;
    }

    static async postAction(url, body) {
        const res = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this._get()._token
            },
            referrer: "https://www.sololearn.com/",
            body: JSON.stringify(body),
            method: "POST",
            mode: "cors"
        });
        return await res.json();
    }

    static get profile() {
        return this._get()._profile;
    }
}

class Code {
    _data;
    _comments = [];
    _replies = [];

    static async load(publicId) {
        const data = await Store.postAction("https://api3.sololearn.com/Playground/GetCode", {
            publicId: publicId
        });
        return new Code(data);
    }

    constructor(data) {
        this._data = data;
    }

    _getReplies(parentId) {
        const elem = this._replies.find(elem => elem.parentId == parentId);
        return elem ? elem.comments : [];
    }

    _addReply(comment, parentId) {
        const elem = this._replies.find(elem => elem.parentId == parentId);
        if (elem) {
            elem.comments.push(comment);
        }
        else {
            this._replies.push({
                parentId,
                comments: [comment]
            });
        }
    }

    async _loadReplies(parentId, count) {
        const elem = this._replies.find(elem => elem.parentId == parentId);
        const index = elem ? elem.comments.length : 0;
        const data = await Store.postAction("https://api3.sololearn.com/Discussion/GetCodeComments", {
            codeId: this._data.code.id,
            count,
            index,
            orderBy: 1,
            parentId
        });
        for (let comment of data.comments) {
            this._addReply(comment, parentId);
        }
        return data;
    }

    _clearComments() {
        this._comments = [];
        this._replies = [];
    }

    _getCommentById(id) {
        let comment = this._comments.find(elem => elem.id == id);
        if(!comment) {
            for(let reply of this._replies) {
                comment = reply.comments.find(elem => elem.id == id);
                if(comment) {
                    break;
                }
            }
        }
        return comment;
    }

    _getMentionString(id) {
        const comment = this._getCommentById(id);
        return `[user id="${comment.userID}"]${comment.userName}[/user]`;
    }

    getComments(parentId = null) {
        if (parentId == null) {
            return this._comments;
        }
        return this._getReplies(parentId);
    }

    async loadComments(parentId = null, count = 20) {
        if (parentId) {
            const data = await this._loadReplies(parentId, count);
            return data.comments;
        }
        const index = this._comments.length;
        const data = await Store.postAction("https://api3.sololearn.com/Discussion/GetCodeComments", {
            codeId: this._data.code.id,
            count,
            index,
            orderBy: 1,
            parentId
        });
        for (let comment of data.comments) {
            this._comments.push(comment);
        }
        return data.comments;
    }

    async createComment(message, parentId = null) {
        const data = await Store.postAction("https://api3.sololearn.com/Discussion/CreateCodeComment", {
            codeId: this._data.code.id,
            message,
            parentId
        });
        const comment = data.comment;
        if (parentId) {
            this._addReply(comment, parentId);
        }
        else {
            this._comments.push(comment);
        }
        return data.comment;
    }

    async deleteComment(id) {
        let toDelete;
        toDelete = this._comments.find(elem => elem.id == id);
        if (toDelete) {
            let idx;
            idx = this._comments.indexOf(toDelete);
            this._comments.splice(idx, 1);
            const elem = this._replies.find(elem => elem.parentId == id);
            if (elem) {
                idx = this._replies.indexOf(elem);
                this._replies.splice(idx, 1);
            }
        }
        else {
            for (let elem of this._replies) {
                for (let comment of elem.comments) {
                    if (comment.id == id) {
                        const idx = elem.comments.indexOf(comment);
                        elem.comments.splice(idx, 1);
                    }
                }
            }
        }
        await Store.postAction("https://api3.sololearn.com/Discussion/DeleteCodeComment", {
            id
        });
    }

    async editComment(message, id) {
        const comment = this._getCommentById(id);
        comment.message = message;
        const data = await Store.postAction("https://api3.sololearn.com/Discussion/EditCodeComment", {
            id,
            message
        });
        return data.comment;
    }

    render(root) {
        const modal = document.createElement("div");
        modal.style.display = "flex";
        modal.style.position = "absolute";
        modal.style.zIndex = 9999;
        modal.style.left = "0";
        modal.style.top = "0";
        modal.style.width = "100%";
        modal.style.height = "100%";
        modal.style.backgroundColor = "rgba(128, 128, 128, 0.5)";
        modal.style.alignItems = "center";
        modal.style.justifyContent = "center";

        const container = document.createElement("div");
        container.style.position = "relative";
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.gap = "8px";
        container.style.width = "800px";
        container.style.height = "800px";
        container.style.maxHeight = "80vh";
        container.style.backgroundColor = "#fff";
        container.style.padding = "18px 12px";
        container.style.borderRadius = "8px";
        modal.appendChild(container);

        const closeBtn = document.createElement("div");
        closeBtn.innerHTML = `
        <div style="cursor: pointer; color: #9b9b9b; height: 13px;width: 13px;">
            <svg style="width: 100%; height: 100%;"><use xlink:href="#close"></use></svg>
        </div>`;
        closeBtn.style.margin = "12px";
        closeBtn.style.position = "absolute";
        closeBtn.style.right = "0";
        closeBtn.style.top = "0";
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });
        container.appendChild(closeBtn);

        const title = document.createElement("h1");
        title.textContent = this._data.code.comments + " comments";
        title.style.textAlign = "center";
        title.style.fontSize = "20px";
        container.appendChild(title);

        const commentsBody = document.createElement("div");
        commentsBody.style.width = "100%";
        commentsBody.style.height = "calc(100% - 64px)";
        commentsBody.style.overflowY = "auto";
        commentsBody.style.display = "flex";
        commentsBody.style.flexDirection = "column";
        commentsBody.style.gap = "6px";
        container.appendChild(commentsBody);

        const showCommentFormButton = document.createElement("button");
        showCommentFormButton.textContent = "Write comment";
        showCommentFormButton.classList.add("sol-button", "sol-button-primary", "sol-button-block", "sol-button-s");
        container.appendChild(showCommentFormButton);

        const renderCreateCommentForm = () => {
            const createCommentForm = document.createElement("div");
            createCommentForm.style.display = "none";
            createCommentForm.style.width = "100%";
            createCommentForm.style.padding = "8px 16px";
            createCommentForm.style.backgroundColor = "#f2f5f7";
            createCommentForm.style.borderRadius = "8px";

            const input = document.createElement("textarea");
            input.style.border = "1px solid #c8d2db";
            input.style.borderRadius = "4px";
            input.style.padding = "10px";
            input.style.resize = "none";
            input.style.width = "100%";
            input.style.height = "100px";
            input.placeholder = "Write your comment here...";
            createCommentForm.appendChild(input);

            const buttonContainer = document.createElement("div");
            buttonContainer.style.display = "flex";
            buttonContainer.style.gap = "8px";
            buttonContainer.style.marginTop = "6px";
            createCommentForm.appendChild(buttonContainer);

            const postButton = document.createElement("button");
            postButton.classList.add("sol-button", "sol-button-primary", "sol-button-block", "sol-button-s");
            buttonContainer.appendChild(postButton);
            postButton.textContent = "Submit";

            const cancelButton = document.createElement("button");
            cancelButton.classList.add("sol-button", "sol-button-primary", "sol-button-block", "sol-button-s");
            buttonContainer.appendChild(cancelButton);
            cancelButton.textContent = "Cancel";

            return {
                createCommentForm,
                input,
                postButton,
                cancelButton
            };
        }

        let highlightedCommentId = null;

        const unhighlightAllComments = () => {
            if(highlightedCommentId !== null) {
                const commentBodies = document.querySelectorAll(".comment-body");
                commentBodies.forEach(elem => {
                    if(elem.parentElement.dataset.id == highlightedCommentId) {
                        elem.style.backgroundColor = "#fff";
                        elem.style.border = "none";
                    }
                });
                highlightedCommentId = null;
            }
        }

        const highlightComment = (id) => {
            unhighlightAllComments();
            const commentBodies = document.querySelectorAll(".comment-body");
            commentBodies.forEach(elem => {
                if(id == elem.parentElement.dataset.id) {
                    elem.style.backgroundColor = "rgba(20, 158, 242, 0.1)";
                    elem.style.border = "2px solid #149ef2";
                    highlightedCommentId = id;
                }
            });
        }

        const createComment = (comment) => {
            const container = document.createElement("div");
            container.classList.add("comment");
            container.dataset.id = comment.id;
            container.style.width = "100%";

            const m = new Date(comment.date);
            const dateString = m.getUTCFullYear() + "/" +
                ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" +
                ("0" + m.getUTCDate()).slice(-2) + " " +
                ("0" + m.getUTCHours()).slice(-2) + ":" +
                ("0" + m.getUTCMinutes()).slice(-2) + ":" +
                ("0" + m.getUTCSeconds()).slice(-2);

            let html = `<div class="comment-body" style="display:flex; gap: 6px; padding: 6px 8px; background-color:#fff; border-radius: 8px; border: none; box-sizing: border-box;">
            <img style="width: 64px; height: 64px; border-radius: 50%; overflow: hidden; flex-shrink: 0;" src="${comment.avatarUrl}" alt="${comment.userName} - avatar">
            <div style="display: flex; flex-direction: column; flex-grow: 1;">
                <div style="display: flex; direction: row; justify-content: space-between;">
                    <div><a style="cursor: pointer; color: #2493df;" href="https://www.sololearn.com/profile/${comment.userID}">${comment.userName}</a></div>
                    <div style="color: #6b7f99;">${dateString}</div>
                </div>
                <div class="comment-message" style="white-space: pre-wrap;">${comment.message.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
                <div style="display: flex; justify-content: flex-end;">
                    <div style="display: flex; gap: 4px;">
                        <button data-id="${comment.id}" class="toggle-replies-btn sol-button sol-button-primary sol-button-block sol-button-s" style="display: ${comment.parentID === null ? "block" : "none"}">${comment.replies} replies</button>
                        <button data-id="${comment.id}" class="reply-btn sol-button sol-button-primary sol-button-block sol-button-s">Reply</button>
                    </div>
                </div>
            </div>
            <div style="width: 20px; visibility: ${comment.userID == Store.profile.id ? "visible" : "hidden"};">
                <div data-id="${comment.id}" class="edit-comment-btn" style="color: #999; cursor: pointer;">
                    <svg style="pointer-events: none;" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" width="20" height="20" class="sol-icon"><g id="icon-edit-small"><path id="Vector" fill-rule="evenodd" clip-rule="evenodd" d="M9.07116 3.4142L12.6067 6.94973L12.9602 6.59618C13.546 6.01039 13.546 5.06065 12.9602 4.47486L11.546 3.06065C10.9602 2.47486 10.0105 2.47486 9.42471 3.06065L9.07116 3.4142ZM6.11612 12.8273C6.46559 12.7956 6.79285 12.6423 7.04098 12.3942L11.8996 7.53554L8.36407 4.00001L3.50545 8.85864C3.25732 9.10676 3.10404 9.43403 3.07227 9.78349L2.8222 12.5342C2.79393 12.8452 3.05445 13.1057 3.36542 13.0774L6.11612 12.8273Z" fill="currentColor"></path></g></svg>
                </div>
                <div data-id="${comment.id}" class="delete-comment-btn" style="color: #999; cursor: pointer;">
                    <svg style="pointer-events: none;" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" width="20" height="20" class="sol-icon"><g id="icon-trash"><path id="Vector" fill-rule="evenodd" clip-rule="evenodd" d="M9.5 3C9.22386 3 9 3.22386 9 3.5V4H5.5C5.22386 4 5 4.22386 5 4.5V5.5C5 5.77614 5.22386 6 5.5 6H9.5H14.5H18.5C18.7761 6 19 5.77614 19 5.5V4.5C19 4.22386 18.7761 4 18.5 4H15V3.5C15 3.22386 14.7761 3 14.5 3H9.5ZM6 7.5H18V19.5C18 20.3284 17.3284 21 16.5 21H7.5C6.67157 21 6 20.3284 6 19.5V7.5Z" fill="currentColor"></path></g></svg>
                </div>
            </div>
            </div>
            `;
            if(comment.parentID === null) {
                html += `<div data-id="${comment.id}" class="replies" style="display: none; background-color: #f2f5f7; border-radius: 8px; padding: 12px 8px; width: 100%; flex-direction: column; gap: 6px;"></div>`;
            }

            container.innerHTML = html;

            return container;
        }

        const renderLoadButton = (parentId, body) => {
            const container = document.createElement("button");
            container.textContent = "...";
            container.classList.add("sol-button", "sl-action-button--secondary--dark", "sol-button-secondary", "sol-button-block", "sol-button-s");
            container.style.alignSelf = "flex-start";
            container.addEventListener("click", () => {
                body.removeChild(container);
                loadComments(body, parentId);
            });
            body.appendChild(container);
        }

        const loadComments = (body, parentId = null) => {
            this.loadComments(parentId)
                .then(comments => {
                    for (let comment of comments) {
                        body.append(createComment(comment));
                    }
                    if (comments.length) {
                        renderLoadButton(parentId, body);
                    }
                });
        }

        const { createCommentForm, input, postButton, cancelButton } = renderCreateCommentForm();
        container.appendChild(createCommentForm);

        const openCommentForm = (parentId = null, edit = false) => {
            showCommentFormButton.style.display = "none";
            createCommentForm.style.display = "block";
            createCommentForm.dataset.parentId = parentId;
            createCommentForm.dataset.edit = edit;
            if(edit) {
                const comment = this._getCommentById(parentId);
                input.value = comment.message;
                highlightComment(parentId);
            }
            else {
                input.value = parentId === null ? "" : this._getMentionString(parentId) + " ";
                if(parentId) {
                    highlightComment(parentId);
                }
            }
        }

        const closeCommentForm = () => {
            input.value = "";
            createCommentForm.style.display = "none";
            unhighlightAllComments();
            showCommentFormButton.style.display = "block";
        }

        const getRepliesContainer = (commentId) => {
            let out = null;
            const replies = document.querySelectorAll(".replies");
            replies.forEach(elem => {
                if (commentId == elem.dataset.id) {
                    out = elem;
                }
            });
            return out;
        }

        showCommentFormButton.addEventListener("click", () => openCommentForm());

        const postComment = () => {
            let parentId = createCommentForm.dataset.parentId == "null" ? null : +createCommentForm.dataset.parentId;
            if(parentId !== null) {
                const comment = this._getCommentById(parentId);
                if(comment.parentID !== null) {
                    parentId = comment.parentID;
                }
            }
            this.createComment(input.value, parentId)
                .then(comment => {
                    closeCommentForm();
                    comment.userName = Store.profile.name;
                    comment.avatarUrl = Store.profile.avatarUrl;
                    comment.replies = 0;
                    if (parentId === null) {
                        commentsBody.prepend(createComment(comment));
                    }
                    else {
                        const replies = getRepliesContainer(parentId);
                        if(replies.childElementCount > 0 && replies.lastChild instanceof HTMLButtonElement) {
                            replies.lastChild.before(createComment(comment));
                        }
                        else {
                            replies.append(createComment(comment));
                        }
                        const toggleReplyButtons = document.querySelectorAll(".toggle-replies-btn");
                        toggleReplyButtons.forEach(elem => {
                            if (parentId == elem.dataset.id) {
                                elem.textContent = (+elem.textContent.split(" ")[0] + 1) + " replies";
                            }
                        });
                    }
                });
        }

        const editComment = () => {
            const parentId = +createCommentForm.dataset.parentId;
            this.editComment(input.value, parentId)
                .then(comment => {
                    const comments = document.querySelectorAll(".comment");
                    comments.forEach(elem => {
                        if(elem.dataset.id == parentId) {
                            const messageContainer = elem.querySelector(".comment-message");
                            messageContainer.textContent = comment.message.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;");
                        }
                    });
                    closeCommentForm();
                });
        }

        postButton.addEventListener("click", () => {
            const edited = createCommentForm.dataset.edit === "true";
            if(edited) {
                editComment();
            }
            else {
                postComment();
            }
        });
        cancelButton.addEventListener("click", () => {
            closeCommentForm();
        });

        loadComments(commentsBody);

        root.appendChild(modal);

        addEventListener("click", ev => {
            if (ev.target.classList.contains("toggle-replies-btn")) {
                const elem = getRepliesContainer(ev.target.dataset.id);
                if (elem.classList.contains("replies_opened")) {
                    elem.style.display = "none";
                }
                else {
                    elem.style.display = "flex";
                    loadComments(elem, ev.target.dataset.id);
                }
                elem.classList.toggle("replies_opened");
            }
            else if (ev.target.classList.contains("reply-btn")) {
                const elem = getRepliesContainer(ev.target.dataset.id);
                if (!elem.classList.contains("replies_opened")) {
                    elem.style.display = "flex";
                    loadComments(elem, ev.target.dataset.id);
                    elem.classList.add("replies_opened");
                }

                openCommentForm(ev.target.dataset.id);
            }
            else if(ev.target.classList.contains("edit-comment-btn")) {
                openCommentForm(ev.target.dataset.id, true);
            }
            else if(ev.target.classList.contains("delete-comment-btn")) {
                closeCommentForm();
                highlightComment(ev.target.dataset.id);

                if(confirm("Are you sure you want to delete the comment?")) {
                    const parentId = this._getCommentById(ev.target.dataset.id).parentID;
                    this.deleteComment(ev.target.dataset.id)
                        .then(() => {
                            const commentElements = document.querySelectorAll(".comment");
                            commentElements.forEach(elem => {
                                if(elem.dataset.id == ev.target.dataset.id) {
                                    elem.parentElement.removeChild(elem);
                                }
                            });
                            if(parentId !== null) {
                                const toggleReplyButtons = document.querySelectorAll(".toggle-replies-btn");
                                toggleReplyButtons.forEach(elem => {
                                    if (parentId == elem.dataset.id) {
                                        elem.textContent = (+elem.textContent.split(" ")[0] - 1) + " replies";
                                    }
                                });
                            }
                        });
                }
                else {
                    unhighlightAllComments();
                }
            }
        });
        return modal;
    }

}

const main = async () => {

    const userId = JSON.parse(localStorage.getItem("user")).data.id;
    const accessToken = JSON.parse(localStorage.getItem("accessToken")).data;
    const publicId = window.location.pathname.split("/")[2];

    await Store.login(
        userId,
        accessToken
    );

    const code = await Code.load(publicId);
    const modal = code.render(document.querySelector(".sl-playground-wrapper"));
    modal.style.display = "none";

    const openModalButton = document.createElement("button");
    openModalButton.classList.add("sol-button", "sol-button-primary", "sol-button-block", "sol-button-s");
    openModalButton.style.marginLeft = "12px";
    openModalButton.textContent = "Show comments";
    openModalButton.addEventListener("click", () => modal.style.display = "flex");
    document.querySelector(".sl-playground-left").appendChild(openModalButton);
}

setTimeout(main, 1000);

function getCookie(cookieName) {
    let cookie = {};
    document.cookie.split(';').forEach(function(el) {
        let [key,value] = el.split('=');
        cookie[key.trim()] = value;
    });
    return cookie[cookieName];
}

})();
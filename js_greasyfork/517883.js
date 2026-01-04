// ==UserScript==
// @name         Markdown en Jira con Tampermonkey
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.3.2
// @description  Permite escribir en Markdown en issues y comentarios de Jira usando J2M y VanJS.
// @include      http://*
// @resource     REMOTE_CSS https://cdn.jsdelivr.net/npm/bulma-switch@2.0.4/dist/css/bulma-switch.min.css
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/517883/Markdown%20en%20Jira%20con%20Tampermonkey.user.js
// @updateURL https://update.greasyfork.org/scripts/517883/Markdown%20en%20Jira%20con%20Tampermonkey.meta.js
// ==/UserScript==
'use strict';
const myCss = GM_getResourceText("REMOTE_CSS");
GM_addStyle(myCss);
const boxes = {
    commentBox: null,
    checkedComment: false,
    dialogCommentBox: null,
    dialogEditCommentBox: null,
    dialogCheckedComment: false,
    dialogCheckedEditComment: false,
    dialogEditComment: false,
    descriptionBox: null,
    checkedDescription: false
}
let mantein = false;
var MutationObserver = window.MutationObserver;
var myObserver = new MutationObserver (mutationHandler);
var obsConfig = {
    childList: true, attributes: true,
    subtree: true, attributeFilter: ['class']
};
myObserver.observe (document, obsConfig);
function mutationHandler (mutationRecords) {

    mutationRecords.forEach ( function (mutation) {

        if (    mutation.type               == "childList"
            &&  typeof mutation.addedNodes  == "object"
            &&  mutation.addedNodes.length
           ) {
            for (var J = 0, L = mutation.addedNodes.length;  J < L;  ++J) {
                checkForCSS_Class (mutation.addedNodes[J], "textarea");
                checkForCSS_Class (mutation.addedNodes[J], "aui-nav-selected");
            }
        }
        else if (mutation.type == "attributes") {
            checkForCSS_Class (mutation.target, "textarea");
            checkForCSS_Class (mutation.target, "aui-nav-selected");
        }
    } );
}

function checkForCSS_Class (node, className) {
    //-- Only process element nodes
    if (node.nodeType === 1) {
        if (node.classList.contains (className) ) {

            console.log (
                'New node with class "' + className + '" = ', node
            );
            if (className == "aui-nav-selected" && node.getAttribute("data-mode") === "wysiwyg") {
                const dialogCreate = document.querySelector("#create-issue-dialog")
                const dialogEdit = document.querySelector("#edit-issue-dialog")
                const dialogEditComment = document.querySelector("#edit-comment")
                if (dialogCreate || dialogEdit) {
                    const commentDialog = document.querySelector(".jira-dialog #comment-wiki-edit .aui-nav-selected")
                    const description = document.querySelector(".jira-dialog #description-wiki-edit .aui-nav-selected")
                    if (commentDialog) {
                        console.log(commentDialog)
                        if (commentDialog.getAttribute("data-mode") === "wysiwyg") {
                            if (document.querySelector(".field.dialog-comment")) {
                                document.querySelector(".field.dialog-comment").remove()
                            }
                        }
                        if (description.getAttribute("data-mode") === "wysiwyg") {
                            document.querySelector(".field.description").remove()
                        }
                    } else {
                        document.querySelector(".field.description").remove()
                    }
                } else if (dialogEditComment){
                    const commentDialog = document.querySelector(".jira-dialog #comment-wiki-edit .aui-nav-selected")
                    if (commentDialog.getAttribute("data-mode") === "wysiwyg") {
                        if (document.querySelector(".dialog-edit-comment")) {
                            document.querySelector(".dialog-edit-comment").remove()
                        }
                    }
                } else {
                    document.querySelector(".field.comment").remove()
                }
                const create = document.querySelector("#create-issue-submit")
                const edit = document.querySelector("#edit-issue-submit")
                const comment = document.querySelector("#issue-comment-add-submit")
                if (create) {
                    create.removeAttribute("disabled")
                } else if (edit) {
                    edit.removeAttribute("disabled")
                } else if (comment) {
                    comment.removeAttribute("disabled")
                }
                mantein = true
            } else {
                createMarkdownInterface();
            }
        }
    }
}
// Comprobamos si J2M está disponible

// Selección del campo de comentarios de Jira
function detectCommentBox() {
    // Aquí puedes ajustar el selector para el área de texto de comentarios de Jira3
    return new Promise((res, rej) => {
        setTimeout(() => {
            const el = document.querySelector(".textarea.long-field.wiki-textfield.long-field.mentionable.wiki-editor-initialised.wiki-edit-wrapped#comment");
            res(el);
        }, 10);
    })
}
function detectDescriptionBox() {
    // Aquí puedes ajustar el selector para el área de texto de comentarios de Jira3
    return new Promise((res, rej) => {
        setTimeout(() => {
            const el = document.querySelector(".textarea.long-field.wiki-textfield.long-field.mentionable.wiki-editor-initialised.wiki-edit-wrapped#description");
            res(el);
        }, 10);
    })
}
function detectDialogCommentBox() {
    // Aquí puedes ajustar el selector para el área de texto de comentarios de Jira3
    return new Promise((res, rej) => {
        setTimeout(() => {
            const el = document.querySelector("#edit-issue-dialog .textarea.long-field.wiki-textfield.mentionable.wiki-editor-initialised.wiki-edit-wrapped#comment");
            res(el);
        }, 10);
    })
}
function detectEditCommentBox() {
    // Aquí puedes ajustar el selector para el área de texto de comentarios de Jira3
    return new Promise((res, rej) => {
        setTimeout(() => {
            const el = document.querySelector("#edit-comment .textarea.long-field.wiki-textfield.mentionable.wiki-editor-initialised.wiki-edit-wrapped#comment");
            res(el);
        }, 10);
    })
}
// Función para crear una interfaz de Markdown en Jira
function switchOnClickDescription () {
    if (document.querySelector(".switch.description")) {
        if(document.querySelector(".switch.description").getAttribute("checked") == "checked") {
            saveMarkdown(boxes.descriptionBox)
            boxes.checkedDescription = false
            document.querySelector(".switch.description").removeAttribute("checked")
            const create = document.querySelector("#create-issue-submit")
            const edit = document.querySelector("#edit-issue-submit")
            if (create) {
                create.removeAttribute("disabled")
            } else if (edit) {
                if(document.querySelector(".switch.comment-dialog")) {
                    if(!document.querySelector(".switch.comment-dialog").getAttribute("checked")) {
                        edit.removeAttribute("disabled")
                    }
                } else {
                    edit.removeAttribute("disabled")
                }
                
            }
            const options = document.querySelectorAll(".jira-dialog #description-wiki-edit .aui-nav a")
            options.forEach(option => {
                if (option.innerHTML === "Visual") {
                    option.removeAttribute("style")
                }
            })
        } else {
            saveJira(boxes.descriptionBox)
            boxes.checkedDescription = true
            document.querySelector(".switch.description").setAttribute("checked", "checked")
            const create = document.querySelector("#create-issue-submit")
            const edit = document.querySelector("#edit-issue-submit")
            if (create) {
                create.setAttribute("disabled", "")
            } else if (edit) {
                edit.setAttribute("disabled", "")
            }
            const options = document.querySelectorAll(".jira-dialog #description-wiki-edit .aui-nav a")
            options.forEach(option => {
                if (option.innerHTML === "Visual") {
                    option.setAttribute("style", "pointer-events: none;cursor: default;color: #a5adba;")
                }
            })
        }
    }
}
function switchOnClickComment () {
    if (document.querySelector(".switch.comment")) {
        if(document.querySelector(".switch.comment").getAttribute("checked") == "checked") {
            saveMarkdown(boxes.commentBox)
            boxes.checkedComment = false
            document.querySelector(".switch.comment").removeAttribute("checked")
            const comment = document.querySelector("#issue-comment-add-submit")
            comment.removeAttribute("disabled")
            const options = document.querySelectorAll("#comment-wiki-edit .aui-nav a")
            options.forEach(option => {
                if (option.innerHTML === "Visual") {
                    option.removeAttribute("style")
                }
            })
        } else {
            saveJira(boxes.commentBox)
            boxes.checkedComment = true
            document.querySelector(".switch.comment").setAttribute("checked", "checked")
            const comment = document.querySelector("#issue-comment-add-submit")
            comment.setAttribute("disabled", "")
            const options = document.querySelectorAll("#comment-wiki-edit .aui-nav a")
            options.forEach(option => {
                if (option.innerHTML === "Visual") {
                    option.setAttribute("style", "pointer-events: none;cursor: default;color: #a5adba;")
                }
            })
        }
    }
}
function switchOnClickDialogComment () {
    if (document.querySelector(".switch.comment-dialog")) {
        if(document.querySelector(".switch.comment-dialog").getAttribute("checked") == "checked") {
            saveMarkdown(boxes.dialogCommentBox)
            boxes.dialogCheckedComment = false
            document.querySelector(".switch.comment-dialog").removeAttribute("checked")
            const edit = document.querySelector("#edit-issue-submit")
            if (!document.querySelector(".switch.description").getAttribute("checked")) {
                edit.removeAttribute("disabled")
            }
            const options = document.querySelectorAll(".jira-dialog #comment-wiki-edit .aui-nav a")
            options.forEach(option => {
                if (option.innerHTML === "Visual") {
                    option.removeAttribute("style")
                }
            })
        } else {
            saveJira(boxes.dialogCommentBox)
            boxes.dialogCheckedComment = true
            document.querySelector(".switch.comment-dialog").setAttribute("checked", "checked")
            const comment = document.querySelector("#edit-issue-submit")
            comment.setAttribute("disabled", "")
            const options = document.querySelectorAll(".jira-dialog #comment-wiki-edit .aui-nav a")
            options.forEach(option => {
                if (option.innerHTML === "Visual") {
                    option.setAttribute("style", "pointer-events: none;cursor: default;color: #a5adba;")
                }
            })
        }
    }
}
function switchOnClickDialogEditComment () {
    if (document.querySelector(".switch.comment-edit-dialog ")) {
        if(document.querySelector(".switch.comment-edit-dialog ").getAttribute("checked") == "checked") {
            saveMarkdown(boxes.dialogEditCommentBox)
            boxes.dialogCheckedEditComment = false
            document.querySelector(".switch.comment-edit-dialog").removeAttribute("checked")
            const edit = document.querySelector("#edit-issue-submit")
            if (!document.querySelector(".switch.description").getAttribute("checked")) {
                edit.removeAttribute("disabled")
            }
            const options = document.querySelectorAll(".jira-dialog #comment-wiki-edit .aui-nav a")
            options.forEach(option => {
                if (option.innerHTML === "Visual") {
                    option.removeAttribute("style")
                }
            })
        } else {
            saveJira(boxes.dialogEditCommentBox)
            boxes.dialogCheckedEditComment = true
            document.querySelector(".switch.comment-edit-dialog ").setAttribute("checked", "checked")
            const comment = document.querySelector("#comment-edit-submit")
            comment.setAttribute("disabled", "")
            const options = document.querySelectorAll(".jira-dialog #comment-wiki-edit .aui-nav a")
            options.forEach(option => {
                if (option.innerHTML === "Visual") {
                    option.setAttribute("style", "pointer-events: none;cursor: default;color: #a5adba;")
                }
            })
        }
    }
}
async function createMarkdownInterface() {
    const {div, input, label} = van.tags
    boxes.commentBox = await detectCommentBox();
    boxes.dialogCommentBox = await detectDialogCommentBox();
    boxes.descriptionBox = await detectDescriptionBox();
    boxes.dialogEditCommentBox = await detectEditCommentBox();
    if (!boxes.commentBox) {
        console.error("No se encontró el campo de comentarios.");
    } else {
        if (!document.querySelector(".switch.comment") && !document.querySelector(".jira-dialog") && !boxes.commentBox.classList.contains("richeditor-cover")){
            const markdownContainer = div({style: "border-right: 1px solid #dfe1e5; border-left: 1px solid #dfe1e5; padding: 0.4em;", class: "field comment"},label({style: "padding: 0.4em"},"Jira"),input({type:"checkbox", class:"switch comment is-outlined is-info", id:"switchComment", name: "switchComment", onclick: () => switchOnClickComment()}),label({for:"switchComment"},"Markdown"));
            boxes.commentBox.before(markdownContainer);
            if (mantein) {
                if (boxes.checkedComment) {
                    const comment = document.querySelector("#issue-comment-add-submit")
                    comment.setAttribute("disabled", "")
                    document.querySelector(".switch.comment").setAttribute("checked", "checked")
                }
                mantein = false
            }
            if (boxes.commentBox.addEventListener) {
                boxes.commentBox.addEventListener('input', function(event) {
                    if(document.querySelector(".switch.comment").getAttribute("checked") == "checked") {
                        event.stopPropagation();
                    }
                }, false);
            }
        }
    }
    if (!boxes.dialogCommentBox) {
        console.error("No se encontró el campo de comentarios.");
    } else {
        if (!document.querySelector(".switch.comment-dialog") && !boxes.dialogCommentBox.classList.contains("richeditor-cover")){
            const markdownContainer = div({style: "border-right: 1px solid #dfe1e5; border-left: 1px solid #dfe1e5; padding: 0.4em;", class: "field dialog-comment"},label({style: "padding: 0.4em"},"Jira"),input({type:"checkbox", class:"switch comment-dialog is-outlined is-info", id:"switchDialogComment", name: "switchDialogComment", onclick: () => switchOnClickDialogComment()}),label({for:"switchDialogComment"},"Markdown"));
            boxes.dialogCommentBox.before(markdownContainer);
            if (mantein) {
                if (boxes.dialogCheckedComment) {
                    document.querySelector(".switch.comment-dialog").setAttribute("checked", "checked")
                }
                mantein = false
            }
        }
    }
    if (!boxes.dialogEditCommentBox) {
        console.error("No se encontró el campo de comentarios.");
    } else {
        if (!document.querySelector(".switch.comment-edit-dialog") && !boxes.dialogEditCommentBox.classList.contains("richeditor-cover")){
            const markdownContainer = div({style: "border-right: 1px solid #dfe1e5; border-left: 1px solid #dfe1e5; padding: 0.4em;", class: "field dialog-edit-comment"},label({style: "padding: 0.4em"},"Jira"),input({type:"checkbox", class:"switch comment-edit-dialog is-outlined is-info", id:"switchDialogEditComment", name: "switchDialogEditComment", onclick: () => switchOnClickDialogEditComment()}),label({for:"switchDialogEditComment"},"Markdown"));
            boxes.dialogEditCommentBox.before(markdownContainer);
            if (mantein) {
                if (boxes.dialogCheckedEditComment) {
                    document.querySelector(".switch.comment-dialog").setAttribute("checked", "checked")
                }
                mantein = false
            }
        }
    }
    if (!boxes.descriptionBox) {
        console.error("No se encontró el campo de descripcion.");
    } else {
        if (!document.querySelector(".switch.description") && !boxes.descriptionBox.classList.contains("richeditor-cover")){
            const markdownContainer = div({style: "border-right: 1px solid #dfe1e5; border-left: 1px solid #dfe1e5; padding: 0.4em;", class: "field description"},label({style: "padding: 0.4em"},"Jira"),input({type:"checkbox", class:"switch description is-outlined is-info", id:"switchDescription", name: "switchDescription", onclick: () => switchOnClickDescription()}),label({for:"switchDescription"},"Markdown"));
            boxes.descriptionBox.before(markdownContainer);
            const create = document.querySelector("#create-issue-submit")
            const edit = document.querySelector("#edit-issue-submit")
            if (mantein) {
                if (boxes.checkedDescription) {
                    document.querySelector(".switch.description").setAttribute("checked", "checked")
                    if (create) {
                        create.setAttribute("disabled", "")
                    } else if(edit) {
                        edit.setAttribute("disabled", "")
                        boxes.checkedDescription = false
                    }
                    mantein = false
                }
            }
            if (boxes.checkedDescription && mantein) {
                if (create) {
                    create.setAttribute("disabled", "")
                    document.querySelector(".switch.description").setAttribute("checked", "checked")
                }
            }
        }
    }
}

// Función para guardar el contenido del editor Markdown al campo de Jira
function saveMarkdown(commentBox) {
    const markdownText = commentBox.value;
    const jiraFormattedText = markdownToJira(markdownText);

    // Insertamos el texto convertido en el campo de comentario de Jira
    commentBox.value = jiraFormattedText;

    // Opcional: hacemos visible el campo de Jira para mostrar el texto convertido
}
function saveJira(commentBox) {
    const markdownText = commentBox.value;
    const markdownFormattedText = jiraToMarkdown(markdownText);

    // Insertamos el texto convertido en el campo de comentario de Jira
    commentBox.value = markdownFormattedText;
}

// Inicia la interfaz cuando la página esté lista
// Función para convertir Markdown a formato Jira
function markdownToJira(str) {
    const map = {
        // cite: '??',
        del: '-',
        ins: '+',
        sup: '^',
        sub: '~',
    };

    return (
        str
        // Tables
        .replace(
            /^(\|[^\n]+\|\r?\n)((?:\|\s*:?[-]+:?\s*)+\|)(\n(?:\|[^\n]+\|\r?\n?)*)?$/gm,
            (match, headerLine, separatorLine, rowstr) => {
                const headers = headerLine.match(/[^|]+(?=\|)/g);
                const separators = separatorLine.match(/[^|]+(?=\|)/g);
                if (headers.length !== separators.length) return match;

                const rows = rowstr.split('\n');
                if (rows.length === 2 && headers.length === 1)
                    // Panel
                    return `{panel:title=${headers[0].trim()}}\n${rowstr
                        .replace(/^\|(.*)[ \t]*\|/, '$1')
                        .trim()}\n{panel}\n`;

                return `||${headers.join('||')}||${rowstr}`;
            }
        )
        // Bold, Italic, and Combined (bold+italic)
        .replace(/([*_]+)(\S.*?)\1/g, (match, wrapper, content) => {
            switch (wrapper.length) {
                case 1:
                    return `_${content}_`;
                case 2:
                    return `*${content}*`;
                case 3:
                    return `_*${content}*_`;
                default:
                    return wrapper + content + wrapper;
            }
        })
        // All Headers (# format)
        .replace(/^([#]+)(.*?)$/gm, (match, level, content) => {
            return `h${level.length}.${content}`;
        })
        // Headers (H1 and H2 underlines)
        .replace(/^(.*?)\n([=-]+)$/gm, (match, content, level) => {
            return `h${level[0] === '=' ? 1 : 2}. ${content}`;
        })
        // Ordered lists
        .replace(/^([ \t]*)\d+\.\s+/gm, (match, spaces) => {
            return `${Array(Math.floor(spaces.length / 3) + 1)
                .fill('#')
                .join('')} `;
        })
        // Un-Ordered Lists
        .replace(/^([ \t]*)\*\s+/gm, (match, spaces) => {
            return `${Array(Math.floor(spaces.length / 2 + 1))
                .fill('*')
                .join('')} `;
        })
        // Headers (h1 or h2) (lines "underlined" by ---- or =====)
        // Citations, Inserts, Subscripts, Superscripts, and Strikethroughs
        .replace(new RegExp(`<(${Object.keys(map).join('|')})>(.*?)</\\1>`, 'g'), (match, from, content) => {
            const to = map[from];
            return to + content + to;
        })
        // Other kind of strikethrough
        .replace(/(\s+)~~(.*?)~~(\s+)/g, '$1-$2-$3')
        // Named/Un-Named Code Block
        .replace(/```(.+\n)?((?:.|\n)*?)```/g, (match, synt, content) => {
            let code = '{code}';
            if (synt) {
                code = `{code:${synt.replace(/\n/g, '')}}\n`;
            }
            return `${code}${content}{code}`;
        })
        // Inline-Preformatted Text
        .replace(/`([^`]+)`/g, '{{$1}}')
        // Images
        .replace(/!\[[^\]]*\]\(([^)]+)\)/g, '!$1!')
        // Named Link
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '[$1|$2]')
        // Un-Named Link
        .replace(/<([^>]+)>/g, '[$1]')
        // Single Paragraph Blockquote
        .replace(/^>/gm, 'bq.')
    );
};

// Función para convertir de Jira a Markdown (opcional, si necesitas edición reversible)
function jiraToMarkdown(str){
    return (
        str
        // Un-Ordered Lists
        .replace(/^[ \t]*(\*+)\s+/gm, (match, stars) => {
            return `${Array(stars.length).join('  ')}* `;
        })
        // Ordered lists
        .replace(/^[ \t]*(#+)\s+/gm, (match, nums) => {
            return `${Array(nums.length).join('   ')}1. `;
        })
        // Headers 1-6
        .replace(/^h([0-6])\.(.*)$/gm, (match, level, content) => {
            return Array(parseInt(level, 10) + 1).join('#') + content;
        })
        // Bold
        .replace(/\*(\S.*)\*/g, '**$1**')
        // Italic
        .replace(/_(\S.*)_/g, '*$1*')
        // Monospaced text
        .replace(/\{\{([^}]+)\}\}/g, '`$1`')
        // Citations (buggy)
        // .replace(/\?\?((?:.[^?]|[^?].)+)\?\?/g, '<cite>$1</cite>')
        // Inserts
        .replace(/\+([^+]*)\+/g, '<ins>$1</ins>')
        // Superscript
        .replace(/\^([^^]*)\^/g, '<sup>$1</sup>')
        // Subscript
        .replace(/~([^~]*)~/g, '<sub>$1</sub>')
        // Strikethrough
        .replace(/(\s+)-(\S+.*?\S)-(\s+)/g, '$1~~$2~~$3')
        // Code Block
        .replace(
            /\{code(:([a-z]+))?([:|]?(title|borderStyle|borderColor|borderWidth|bgColor|titleBGColor)=.+?)*\}([^]*?)\n?\{code\}/gm,
            '```$2$5\n```'
        )
        // Pre-formatted text
        .replace(/{noformat}/g, '```')
        // Un-named Links
        .replace(/\[([^|]+?)\]/g, '<$1>')
        // Images
        .replace(/!(.+)!/g, '![]($1)')
        // Named Links
        .replace(/\[(.+?)\|(.+?)\]/g, '[$1]($2)')
        // Single Paragraph Blockquote
        .replace(/^bq\.\s+/gm, '> ')
        // Remove color: unsupported in md
        .replace(/\{color:[^}]+\}([^]*?)\{color\}/gm, '$1')
        // panel into table
        .replace(/\{panel:title=([^}]*)\}\n?([^]*?)\n?\{panel\}/gm, '\n| $1 |\n| --- |\n| $2 |')
        // table header
        .replace(/^[ \t]*((?:\|\|.*?)+\|\|)[ \t]*$/gm, (match, headers) => {
            const singleBarred = headers.replace(/\|\|/g, '|');
            return `${singleBarred}\n${singleBarred.replace(/\|[^|]+/g, '| --- ')}`;
        })
        // remove leading-space of table headers and rows
        .replace(/^[ \t]*\|/gm, '|')
    );
    // // remove unterminated inserts across table cells
    // .replace(/\|([^<]*)<ins>(?![^|]*<\/ins>)([^|]*)\|/g, (_, preceding, following) => {
    //     return `|${preceding}+${following}|`;
    // })
    // // remove unopened inserts across table cells
    // .replace(/\|(?<![^|]*<ins>)([^<]*)<\/ins>([^|]*)\|/g, (_, preceding, following) => {
    //     return `|${preceding}+${following}|`;
    // });
};
//libreria de vanilla js
(() => {
    // van.js
    var protoOf = Object.getPrototypeOf;
    var changedStates;
    var derivedStates;
    var curDeps;
    var curNewDerives;
    var alwaysConnectedDom = { isConnected: 1 };
    var gcCycleInMs = 1e3;
    var statesToGc;
    var propSetterCache = {};
    var objProto = protoOf(alwaysConnectedDom);
    var funcProto = protoOf(protoOf);
    var _undefined;
    var addAndScheduleOnFirst = (set, s, f, waitMs) => (set ?? (setTimeout(f, waitMs), /* @__PURE__ */ new Set())).add(s);
    var runAndCaptureDeps = (f, deps, arg) => {
        let prevDeps = curDeps;
        curDeps = deps;
        try {
            return f(arg);
        } catch (e) {
            console.error(e);
            return arg;
        } finally {
            curDeps = prevDeps;
        }
    };
    var keepConnected = (l) => l.filter((b) => b._dom?.isConnected);
    var addStatesToGc = (d) => statesToGc = addAndScheduleOnFirst(statesToGc, d, () => {
        for (let s of statesToGc)
            s._bindings = keepConnected(s._bindings), s._listeners = keepConnected(s._listeners);
        statesToGc = _undefined;
    }, gcCycleInMs);
    var stateProto = {
        get val() {
            curDeps?._getters?.add(this);
            return this.rawVal;
        },
        get oldVal() {
            curDeps?._getters?.add(this);
            return this._oldVal;
        },
        set val(v) {
            curDeps?._setters?.add(this);
            if (v !== this.rawVal) {
                this.rawVal = v;
                this._bindings.length + this._listeners.length ? (derivedStates?.add(this), changedStates = addAndScheduleOnFirst(changedStates, this, updateDoms)) : this._oldVal = v;
            }
        }
    };
    var state = (initVal) => ({
        __proto__: stateProto,
        rawVal: initVal,
        _oldVal: initVal,
        _bindings: [],
        _listeners: []
    });
    var bind = (f, dom) => {
        let deps = { _getters: /* @__PURE__ */ new Set(), _setters: /* @__PURE__ */ new Set() }, binding = { f }, prevNewDerives = curNewDerives;
        curNewDerives = [];
        let newDom = runAndCaptureDeps(f, deps, dom);
        newDom = (newDom ?? document).nodeType ? newDom : new Text(newDom);
        for (let d of deps._getters)
            deps._setters.has(d) || (addStatesToGc(d), d._bindings.push(binding));
        for (let l of curNewDerives)
            l._dom = newDom;
        curNewDerives = prevNewDerives;
        return binding._dom = newDom;
    };
    var derive = (f, s = state(), dom) => {
        let deps = { _getters: /* @__PURE__ */ new Set(), _setters: /* @__PURE__ */ new Set() }, listener = { f, s };
        listener._dom = dom ?? curNewDerives?.push(listener) ?? alwaysConnectedDom;
        s.val = runAndCaptureDeps(f, deps, s.rawVal);
        for (let d of deps._getters)
            deps._setters.has(d) || (addStatesToGc(d), d._listeners.push(listener));
        return s;
    };
    var add = (dom, ...children) => {
        for (let c of children.flat(Infinity)) {
            let protoOfC = protoOf(c ?? 0);
            let child = protoOfC === stateProto ? bind(() => c.val) : protoOfC === funcProto ? bind(c) : c;
            child != _undefined && dom.append(child);
        }
        return dom;
    };
    var tag = (ns, name, ...args) => {
        let [props, ...children] = protoOf(args[0] ?? 0) === objProto ? args : [{}, ...args];
        let dom = ns ? document.createElementNS(ns, name) : document.createElement(name);
        for (let [k, v] of Object.entries(props)) {
            let getPropDescriptor = (proto) => proto ? Object.getOwnPropertyDescriptor(proto, k) ?? getPropDescriptor(protoOf(proto)) : _undefined;
            let cacheKey = name + "," + k;
            let propSetter = propSetterCache[cacheKey] ??= getPropDescriptor(protoOf(dom))?.set ?? 0;
            let setter = k.startsWith("on") ? (v2, oldV) => {
                let event = k.slice(2);
                dom.removeEventListener(event, oldV);
                dom.addEventListener(event, v2);
            } : propSetter ? propSetter.bind(dom) : dom.setAttribute.bind(dom, k);
            let protoOfV = protoOf(v ?? 0);
            k.startsWith("on") || protoOfV === funcProto && (v = derive(v), protoOfV = stateProto);
            protoOfV === stateProto ? bind(() => (setter(v.val, v._oldVal), dom)) : setter(v);
        }
        return add(dom, children);
    };
    var handler = (ns) => ({ get: (_, name) => tag.bind(_undefined, ns, name) });
    var update = (dom, newDom) => newDom ? newDom !== dom && dom.replaceWith(newDom) : dom.remove();
    var updateDoms = () => {
        let iter = 0, derivedStatesArray = [...changedStates].filter((s) => s.rawVal !== s._oldVal);
        do {
            derivedStates = /* @__PURE__ */ new Set();
            for (let l of new Set(derivedStatesArray.flatMap((s) => s._listeners = keepConnected(s._listeners))))
                derive(l.f, l.s, l._dom), l._dom = _undefined;
        } while (++iter < 100 && (derivedStatesArray = [...derivedStates]).length);
        let changedStatesArray = [...changedStates].filter((s) => s.rawVal !== s._oldVal);
        changedStates = _undefined;
        for (let b of new Set(changedStatesArray.flatMap((s) => s._bindings = keepConnected(s._bindings))))
            update(b._dom, bind(b.f, b._dom)), b._dom = _undefined;
        for (let s of changedStatesArray)
            s._oldVal = s.rawVal;
    };
    var van_default = {
        tags: new Proxy((ns) => new Proxy(tag, handler(ns)), handler()),
        hydrate: (dom, f) => update(dom, bind(f, dom)),
        add,
        state,
        derive
    };

    // van.forbundle.js
    window.van = van_default;
})();
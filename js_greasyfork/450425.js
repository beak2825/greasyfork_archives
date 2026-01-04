// ==UserScript==
// @name         Github QoMar
// @namespace    Camroku/gh-qm
// @version      0.1
// @description  QoMar file support for Github
// @author       Cinar Yilmaz <cinaryilmaz.gnu@gmail.com>
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.1.min.js
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/450425/Github%20QoMar.user.js
// @updateURL https://update.greasyfork.org/scripts/450425/Github%20QoMar.meta.js
// ==/UserScript==

String.prototype.isspace = function (c) {
    return c == '\t' || c == '\n' || c == '\v' || c == '\f' || c == '\r' || c == ' '
}

class QomarCompiler {
    constructor(text) {
        this.text = text
        this.pos = 0
        this.current_char = this.text[this.pos]
        this.out = ""
    }

    advance(characters = 1) {
        this.pos += characters
        if (this.pos >= this.text.length) { this.current_char = null }
        else { this.current_char = this.text[this.pos] }
    }

    peek(characters = 1) {
        var peekpos = this.pos + characters
        if (peekpos >= this.text.length) { return null }
        else { return this.text[peekpos] }
    }

    skipcomment() {
        this.advance(2)
        while (this.current_char != '*' && this.peek() != '/') { this.advance() }
        this.advance(2)
    }

    code() {
        this.advance()
        var escaped = false
        this.out += "<code>"
        while (this.current_char !== null) {
            if (escaped) {
                this.out += this.current_char
                escaped = false
            } else {
                if (this.current_char == '`') {
                    break
                } else if (this.current_char == '\\') {
                    escaped = true
                } else {
                    this.out += this.current_char
                }
            }
            this.advance()
        }
    }

    blockcode() {
        this.advance(3)
        var escaped = false
        this.out += "<pre>"
        while (this.current_char !== null) {
            if (escaped) {
                this.out += this.current_char
                escaped = false
            } else {
                if (this.current_char == '`' && this.peek() == '`' && this.peek(2) == '`') {
                    break
                } else if (this.current_char == '\\') {
                    escaped = true
                } else {
                    this.out += this.current_char
                }
            }
            this.advance()
        }
        this.advance(2)
        this.out += "</pre>"
    }

    skipspace() {
        while (this.current_char != null && this.current_char.isspace()) {
            if (this.current_char == '\n' && this.peek() == '\n') {
                this.out += "</p><p>"
                this.advance()
            }
            else if (this.current_char == '\n') {
                this.out += "<br/>"
            }
            this.advance()
        }
        if (this.peek(-1) != '\n') { this.out += " " }
    }

    link() {
        this.advance()
        var linkntext = ""
        while (this.current_char != null) {
            if (this.current_char == ']') { break }
            else { linkntext += this.current_char }
            this.advance()
        }
        this.advance()

        var splitted = linkntext.split(' ')
        var link = splitted[0]
        var text = ""
        if (splitted.length > 1) { text = splitted.slice(1).join() }
        else { text = link }
        this.out += `<a href="${link}">${text}</a>`
    }

    compile() {
        var escaped = false
        var bold = false
        var italic = false
        var header = 0
        var ulist = false
        var olist = false
        var blockquote = false

        while (this.current_char != null) {
            if (this.current_char == '\n' && this.peek() == '\n' && ulist) {
                this.advance(2)
                this.out += "</ul>"
                ulist = false
                continue
            }
            else if (this.current_char == '\n' && this.peek() == '\n' && olist) {
                this.advance(2)
                this.out += "</ol>"
                olist = false
                continue
            }
            else if (this.current_char == '\n' && (olist || ulist)) {
                this.advance()
                this.out += "</li>"
                continue
            }
            if (this.current_char == '\n' && header != 0) {
                this.out += `</h${header}>`
                header = 0
                this.advance()
                continue
            }
            if (this.current_char == '\n' && this.peek() == '\n' && blockquote) {
                this.out += "</blockquote>"
                blockquote = false
                this.advance(2)
                continue
            }
            if (this.current_char.isspace()) {
                this.skipspace()
                continue
            }
            if (!escaped) {
                if (this.current_char == '/' && this.peek() == '*') { this.skipcomment() }
                else if (this.current_char == '`' && this.peek() == '`' && this.peek(2) == '`') { this.blockcode() }
                else if (this.current_char == '`') { this.code() }
                else if (this.current_char == '\'' && this.peek() == '\'') {
                    if (bold) { this.out += "</b>" }
                    else { this.out += "<b>" }
                    bold = !bold
                    this.advance()
                }
                else if (this.current_char == '\'') {
                    if (italic) { this.out += "</i>" }
                    else { this.out += "<i>" }
                    italic = !italic
                }
                else if (this.current_char == '\\') {
                    escaped = true
                    this.advance()
                    continue
                }
                else if (this.peek(-1) == '\n' && this.current_char == '-' && this.peek(1) == '>' && this.peek(2) == ' ') {
                    this.out += "<h1 dir=\"auto\">"
                    header = 1
                    this.advance(2)
                }
                else if (this.peek(-1) == '\n' && this.current_char == '-' && this.peek(1) == '-' && this.peek(2) == '>' && this.peek(3) == ' ') {
                    this.out += "<h2 dir=\"auto\">"
                    header = 2
                    this.advance(3)
                }
                else if (this.peek(-1) == '\n' && this.current_char == '-' && this.peek(1) == '-' && this.peek(2) == '-' && this.peek(3) == '>' && this.peek(4) == ' ') {
                    this.out += "<h3 dir=\"auto\">"
                    header = 3
                    this.advance(4)
                }
                else if (this.peek(-1) == '\n' && this.current_char == '-' && this.peek(1) == '-' && this.peek(2) == '-' && this.peek(3) == '-' && this.peek(4) == '>' && this.peek(5) == ' ') {
                    this.out += "<h4 dir=\"auto\">"
                    header = 4
                    this.advance(5)
                }
                else if (this.peek(-1) == '\n' && this.current_char == '-' && this.peek(1) == '-' && this.peek(2) == '-' && this.peek(3) == '-' && this.peek(4) == '-' && this.peek(5) == '>' && this.peek(6) == ' ') {
                    this.out += "<h5 dir=\"auto\">"
                    header = 5
                    this.advance(6)
                }
                else if (this.peek(-1) == '\n' && this.current_char == '-' && this.peek(1) == '-' && this.peek(2) == '-' && this.peek(3) == '-' && this.peek(4) == '-' && this.peek(5) == '-' && this.peek(6) == '>' && this.peek(7) == ' ') {
                    this.out += "<h6 dir=\"auto\">"
                    header = 6
                    this.advance(6)
                }
                else if (this.peek(-1) == '\n' && this.current_char == '*') {
                    if (!ulist) {
                        if (this.out.slice(-4) == "<br>") { this.out = this.out.slice(0, -4) }
                        this.out += "<ul>"
                        ulist = true
                    }
                    this.out += "<li>"
                }
                else if (this.peek(-1) == '\n' && this.current_char == '^') {
                    if (!olist) {
                        if (this.out.slice(-4) == "<br>") { this.out = this.out.slice(0, -4) }
                        this.out += "<ol>"
                        olist = true
                    }
                    this.out += "<li>"
                }
                else if (this.peek(-1) == '\n' && this.current_char == '>' && this.peek() == ' ') {
                    this.out += "<blockquote>"
                    blockquote = true
                    this.advance()
                }
                else if (this.current_char == '[') {
                    this.link()
                }
                else {
                    this.out += this.current_char
                }
                escaped = false
            }
            else {
                this.out += this.current_char
                escaped = false
            }
            this.advance()
        }
        if (ulist) { this.out += "</ul>" }
        if (olist) { this.out += "</ol>" }

        return this.out
    }
}

var pathh = window.location.pathname.split('/').filter(n => n)

if (pathh.length == 2) {
    var content = $("#readme.qm .Box-body div pre").text()
    if (content !== undefined) {
        const compiler = new QomarCompiler("\n" + content)
        $("#readme.qm .Box-body").html("<article class=\"markdown-body entry-content container-lg\" itemprop=\"text\">" + compiler.compile() + "</article>")
    }
}
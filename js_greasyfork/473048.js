// ==UserScript==
// @name         cs.rin.ru quick quote & reply
// @namespace    none
// @version      2
// @description  adds quick quote and reply buttons https://cs.rin.ru/forum/viewtopic.php?f=14&t=134386
// @author       odusi
// @match        https://cs.rin.ru/forum/viewtopic.php?*
// @match        https://cs.rin.ru/forum/posting.php?*
// @icon         none
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/473048/csrinru%20quick%20quote%20%20reply.user.js
// @updateURL https://update.greasyfork.org/scripts/473048/csrinru%20quick%20quote%20%20reply.meta.js
// ==/UserScript==
const bbTags = [
    {open: '[b]', close: '[/b]', label: 'B'},
    {open: '[url=]', close: '[/url]', label: 'URL'},
    {open: '[spoiler=]', close: '[/spoiler]', label: 'spoiler'},
]

const bbColors = []

if (location.href.includes('viewtopic.php') && !document.querySelector('a[href^="./posting.php?mode=reply"] img').alt.includes('locked')) {

    const url = new URL(location)
    const f = url.searchParams.get('f')
    const t = url.searchParams.get('t')

    GM_addStyle(`
#quickreply-toggle {
    border: 1px solid #8d8dc9;
    border-radius: 5px;
    color: #c3d855;
    font-family: 'Lucida Grande', Verdana, Helvetica, sans-serif;
    padding: 0.2rem;
    background-color: #562e52;
}
.quickreply-btn {
    padding: 2px 10px;
    color: #AAAAAA; 
    font-size: 0.7rem
}
.quickreply-bbcolor {
    width: 12px;
    height: 12px;
    padding: 2px;
    border: 1px solid black;
    margin-left: 2px
}
.quickreply-quickquote {
    border: none;
    padding: 0.1rem 0.3rem;
    font-family: inherit;
    margin-right: 10px;
    font-size: 0.6rem;
    border-radius: 2px;
    background-color: #b3d3d3;
    cursor: pointer;
}

`)

    function insertBBCode(tag, value) {
        let textArea = document.getElementById('quickreply-textarea');
        let text = textArea.value;
        let start = textArea.selectionStart;
        let end = textArea.selectionEnd;
        let before = text.substring(0, start);
        let middle = text.substring(start, end);
        let after = text.substring(end, text.length);
        if (value) {
            textArea.value = before + `[color=${value}]` + middle + '[/color]' + after
            textArea.selectionStart = start + `[color=${value}]`.length;
            textArea.selectionEnd = end + `[color=${value}]`.length;
        } else {
            textArea.value = before + tag['open'] + middle + tag['close'] + after
            textArea.selectionStart = start + tag['open'].length;
            textArea.selectionEnd = end + tag['open'].length;
        }
        textArea.focus()
    }

    function rgbToHex(clr) {
        if (/^([a-z]+)$/i.test(clr)) return clr
        let a = clr.split("(")[1].split(")")[0];
        a = a.split(",");
        let b = a.map(function (x) {
            x = parseInt(x).toString(16);
            return (x.length === 1) ? "0" + x : x;
        });
        return "#" + b.join("");
    }

    function quoteSpan(span, text, nodetext = null, multi = null) {
        let a = multi ? traverseNodes(span) : text || nodetext
        if (span.style.fontWeight === 'bold') text = `[b]${a}[/b]`
        if (span.style.textDecoration === 'underline') text = `[u]${a}[/u]`
        if (span.style.fontStyle === 'italic') text = `[i]${a}[/i]`
        if (span.style.fontSize) text = `[size=${span.style.fontSize.slice(0, -1)}]${a}[/size]`
        if (span.style.color) text = `[color=${rgbToHex(span.style.color)}]${a}[/color]`
        return text
    }

    function traverseNodes(nodes) {
        let text = "";
        nodes.childNodes.forEach(function (child) {
            if (child.nodeType === Node.TEXT_NODE) text += child.nodeValue;
            else if (child.nodeType === Node.ELEMENT_NODE) {
                if (child.tagName === "IMG") text += child.alt;
                else if (child.tagName === "BR") text += "\n";
                else if (child.tagName === "A") text += child.href === child.textContent ? traverseNodes(child) : `[url=${child.href}]${traverseNodes(child)}[/url]`
                else if (child.tagName === "SPAN") {
                    text += quoteSpan(child, text, null, 1)
                } else text += traverseNodes(child);
            }
        });
        return text;
    }

    function quickQuote(element) {
        let selectedText = ''
        let selection = window.getSelection()
        if (selection.rangeCount > 0) {
            let range = selection.getRangeAt(0);
            if (range.endContainer.nodeName === '#text' && range.startContainer === range.endContainer) {
                let parent = range.endContainer.parentElement
                while (parent.tagName === 'SPAN') {
                    selectedText = quoteSpan(parent, selectedText, range.endContainer.textContent)
                    parent = parent.parentElement
                }
            } else selectedText = traverseNodes(range.cloneContents())
        }
        return selectedText ? selectedText : traverseNodes(element)
    }

    function insertQuote(element) {
        document.getElementById('quickreply-main-container').style.display = 'block'
        let table = element.closest('.tablebg')
        textArea.value += `[quote="${table.querySelector('.postauthor').textContent}"]${quickQuote(table.querySelector('.postbody'))}[/quote]`
    }

    const pagecontent = document.querySelector("#pagecontent")

    pagecontent.insertAdjacentHTML('afterbegin', `
            <div id="quickreply-container" style="position: fixed; top: 70%">
                <button type="button" id="quickreply-toggle"">Quick Post</button>
                    <div id="quickreply-main-container" style="display: none; background-color: #201d1d; ">
                    <div id="bb-tags-container" style="font-size: 0; float:left;" ></div>
                    <div id="bb-colors-container" style="font-size: 0; clear:both;"></div>
                    <textarea id="quickreply-textarea" cols="60" rows="7" style="margin: 2px 0; font-size: 0.6rem;"></textarea>
                    <div style="display:flex; justify-content:space-between;">
                    <button type="button" class="btnmain quickreply-btn" id="quickreply-submit">Submit</button>
                    <button type="button" class="btnlite quickreply-btn" id="open-full">Open in full editor</button>
                    </div>
                    </div>
            </div>
            <button type="button" class="quickreply-quickquote" id="quickreply-floatingquote" style="display:none; position:absolute;">Quick Quote</button>
`)
    const submitButton = document.getElementById('quickreply-submit')
    const textArea = document.getElementById('quickreply-textarea')
    let floatingButton = document.querySelector('#quickreply-floatingquote');


    bbTags.forEach(tag => {
        let button = document.createElement('button')
        button.type = 'button'
        button.className = 'btnbbcode quickreply-btn'
        button.textContent = tag.label;
        button.addEventListener('click', () => {
            insertBBCode(tag)
        })
        document.getElementById('bb-tags-container').append(button)
    })

    bbColors.forEach((color) => {
        let button = document.createElement('button')
        button.type = 'button'
        button.className = 'quickreply-bbcolor'
        button.style.backgroundColor = color
        button.addEventListener('click', () => {
            insertBBCode('', color)
        })
        document.getElementById('bb-colors-container').append(button)
    })

    function submit() {
        submitButton.textContent = 'Submitting...'
        fetch(`posting.php?mode=reply&f=${f}&t=${t}`)
            .then(r => r.text())
            .then(h => {
                let doc = document.createElement('div')
                doc.style.display = 'none'
                doc.innerHTML = h
                document.body.append(doc)
                doc.querySelector('textarea[name=message]').value = textArea.value
                setTimeout(() => {
                    doc.querySelector('form[name=postform]').requestSubmit(doc.querySelector('input[name=post]'))
                }, 1200)
            })
    }

    submitButton.addEventListener('click', () => submit())
    textArea.addEventListener('keydown', ev => {
        if (ev.ctrlKey && ev.key === 'Enter') submit()
    })

    document.getElementById('open-full').addEventListener('click', () => {
        GM_setValue('p', 1)
        GM_setValue('text', textArea.value)
        window.location.href = `posting.php?mode=reply&f=${f}&t=${t}`
    })

    document.getElementById('quickreply-toggle').addEventListener('click', () => {
        let d = document.getElementById('quickreply-main-container')
        if (d.style.display === 'none') {
            d.style.display = 'block'
            textArea.focus()
        } else d.style.display = 'none'
    })


    pagecontent.addEventListener('mouseup', () => {
        setTimeout(() => {
            const selection = document.getSelection();
            if (!selection.rangeCount || selection.isCollapsed) floatingButton.style.display = 'none';
            if (!selection.isCollapsed) {
                const range = selection.getRangeAt(0);
                let node = range.commonAncestorContainer
                node.nodeType === Node.TEXT_NODE ? node = node.parentElement : null
                let postbody = node.closest('.postbody')
                if (postbody) {
                    const newRange = document.createRange();
                    newRange.setStart(range.endContainer, range.endOffset - 1); // set range to last character
                    newRange.setEnd(range.endContainer, range.endOffset);
                    const rect = newRange.getBoundingClientRect();
                    floatingButton.replaceWith(floatingButton.cloneNode(true)) // remove existing event listener
                    floatingButton = document.getElementById('quickreply-floatingquote')
                    floatingButton.addEventListener('click', () => insertQuote(postbody))
                    floatingButton.style.top = `${rect.bottom + window.scrollY}px`;
                    floatingButton.style.left = `${rect.right + window.scrollX}px`;
                    floatingButton.style.display = 'block';
                }
            }
        }, 0)
    });

    document.querySelectorAll('a[href^="./posting.php?mode=quote"]').forEach(a => {
        let quickquotebutton = document.createElement('button')
        quickquotebutton.type = 'button'
        quickquotebutton.textContent = 'Quick Quote'
        quickquotebutton.className = 'quickreply-quickquote'
        quickquotebutton.addEventListener('click', () => insertQuote(a))
        a.before(quickquotebutton)
    })
}

if (location.href.includes('posting.php') && GM_getValue('p') === 1) {
    GM_setValue('p', 0)
    document.querySelector('textarea[name=message]').value = GM_getValue('text')
}
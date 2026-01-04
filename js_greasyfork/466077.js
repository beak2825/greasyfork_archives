// ==UserScript==
// @name          Okoun - Formatting Panel
// @namespace     http://molhanec.net/lopuch/?n=Main.Okoun
// @description   Prida k textovemu poli tlacitka pro formatovani textu
// @include       *okoun.cz/*
// @match         https://www.okoun.cz/boards*
// @icon          https://opu.peklo.biz/p/23/07/24/1690208260-9b0c4.png
// @version       1.1
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/466077/Okoun%20-%20Formatting%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/466077/Okoun%20-%20Formatting%20Panel.meta.js
// ==/UserScript==

function addButtons(parent, textarea)
{
    parent.insertBefore(create_button('B', bold), textarea);
    parent.insertBefore(create_button('I', italic), textarea);
    parent.insertBefore(create_button('U', underline), textarea);
    parent.insertBefore(create_button('S', strike), textarea);
    parent.insertBefore(create_button('BR', br), textarea);

    parent.insertBefore(document.createTextNode('\xA0\xA0\xA0'), textarea);

    parent.insertBefore(create_button('URL', link), textarea);
    parent.insertBefore(create_button('IMG', img), textarea);
    parent.insertBefore(create_button('FONT', font), textarea);
    parent.insertBefore(create_button('SPOIL', spoil), textarea);

    parent.insertBefore(document.createTextNode('\xA0\xA0\xA0'), textarea);

    parent.insertBefore(create_button('CODE', code), textarea);

    parent.insertBefore(document.createElement('br'), textarea);
}

function link(event)
{
    try {
        var textarea = event.target.parentNode.querySelector('textarea');
        var url = prompt('Zadejte adresu odkazu: ', '');
        if (url) {
            if (textarea.selectionStart < textarea.selectionEnd) {
                var pretext = textarea.value.substring(0, textarea.selectionStart);
                var posttext = textarea.value.substring(textarea.selectionEnd, textarea.value.length);
                var selection = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
                textarea.value = pretext + '<a href="' + url + '">' + selection + '</a>' + posttext;
            } else {
                var str = prompt('Zadejte text odkazu: ', '');
                textarea.value = textarea.value + '<a href="' + url + '">' + str + '</a>';
            }
        }
        textarea.focus();
        event.preventDefault();
    } catch (exception) {
        alert(exception.message);
    }
}

function img(event) {
    try {
        var textarea = event.target.parentNode.querySelector('textarea');
        if (textarea.selectionStart < textarea.selectionEnd) {
            var pretext = textarea.value.substring(0, textarea.selectionStart);
            var posttext = textarea.value.substring(textarea.selectionEnd, textarea.value.length);
            var selection = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
            textarea.value = pretext + '<img src="' + selection + '" />' + posttext;
        } else {
            var str = prompt('Zadejte cestu k obrazku: ', '');
            if (str) textarea.value = textarea.value + '<img src="' + str + '" />';
        }

        textarea.focus();
        event.preventDefault();
    } catch (exception) {
        alert(exception.message);
    }
}

function font(event) {
    try {
        var textarea = event.target.parentNode.querySelector('textarea');
        var color = prompt('Zadejte barvu textu: ', '');
        var size = prompt('Zadejte velikost fontu: ', '');

        if (color || size) {

            var string_to_write;

            if (textarea.selectionStart < textarea.selectionEnd) {
                var pretext = textarea.value.substring(0, textarea.selectionStart);
                var posttext = textarea.value.substring(textarea.selectionEnd, textarea.value.length);
                var selection = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
                string_to_write = '<font';

                if (color) { string_to_write = string_to_write +' color="' + color + '"'; }
                if (size) { string_to_write = string_to_write +' size="' + size +'"'; }
                string_to_write = string_to_write +'>' + selection + '</font>';

                textarea.value = pretext + string_to_write + posttext;
            } else {
                var str = prompt('Zadejte text: ', '');
                string_to_write = '<font';

                if (color) { string_to_write = string_to_write +' color="' + color + '"'; }
                if (size) { string_to_write = string_to_write +' size="' + size +'"'; }
                string_to_write = string_to_write +'>' + str + '</font>';

                textarea.value = textarea.value + string_to_write;
            }
        }
        textarea.focus();
        event.preventDefault();
    } catch (exception) {
        alert(exception.message);
    }
}

function surroundText(event, opening, closing) {
    try {
        var textarea = event.target.parentNode.querySelector('textarea');
        var pretext = textarea.value.substring(0, textarea.selectionStart);
        var posttext = textarea.value.substring(textarea.selectionEnd, textarea.value.length);
        var selection = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
        textarea.value = pretext + opening + selection + closing + posttext;
        textarea.focus();
        event.preventDefault();
    } catch (exception) {
        alert(exception.message);
    }
}

function spoil(event) {
    surroundText(event, '<span class="spoiler">', '</span>');
}

function bold(event) {
    surroundText(event, '<b>', '</b>');
}

function italic(event) {
    surroundText(event, '<i>', '</i>');
}

function underline(event) {
    surroundText(event, '<u>', '</u>');
}

function strike(event) {
    surroundText(event, '<s>', '</s>');
}

function br(event) {
    try {
        var textarea = event.target.parentNode.querySelector('textarea');
        const selectionStart = textarea.selectionStart;
        const selectionEnd = textarea.selectionEnd;
        const value = textarea.value;
        const pretext = value.substring(0, selectionStart);
        const posttext = value.substring(selectionEnd, value.length);
        const selection = value.substring(selectionStart, selectionEnd);
        textarea.value = pretext + selection + '<br>' + posttext;
        textarea.focus();
        textarea.selectionStart = selectionEnd + 4;
        textarea.selectionEnd = selectionEnd + 4;
        event.preventDefault();
    } catch (exception) {
        alert(exception.message);
    }
}

function code(event) {
    surroundText(event, '<div class="code">', '</div>');
}

function mouseover(event)
{
    this.style.border = "1px solid #808080";
    this.style.backgroundColor = "#E0E0E0";
    event.preventDefault();
}

function mouseout(event)
{
    this.style.border = "1px solid #A7A6AA";
    this.style.backgroundColor = "white";
    event.preventDefault();
}

function create_button(text, listener)
{
    var button = document.createElement('button');
    var txt = document.createTextNode(text);

    button.style.font = "10pt Arial";

    button.style.border = "1px solid #A7A6AA";
    button.style.backgroundColor = "white";
    button.style.cursor = "pointer";
    button.style.marginBottom = "2px";
    button.style.marginRight = "2px";

    switch (text) {
        case 'B': button.style.fontWeight = "bold";
            break;
        case 'I': button.style.fontStyle = "italic";
            break;
        case 'U': button.style.textDecoration = "underline";
            break;
        case 'S': button.style.textDecoration = "line-through";
            break;
    }

    button.insertBefore(txt, null);
    button.addEventListener("mouseover", mouseover, false);
    button.addEventListener("mouseout", mouseout, false);

    button.addEventListener("click", listener, false);
    return button;
}

try {

    var textarea = document.querySelector("#post-body");
    if (textarea) {
        var parent = textarea.parentNode;
        addButtons(parent, textarea);
    }

    (new MutationObserver(function (records, observer) {
        records.forEach(function (record) {
            for (var node of record.addedNodes) {
                if (node.className == 'post content') {
                    node.querySelectorAll('textarea').forEach(function (textarea) {
                        var parent = textarea.parentNode;
                        addButtons(parent, textarea);
                    });
                }
            }
        });

    })).observe(document, { childList: true, subtree: true });

} catch (exception) {
    alert(exception.message);
}
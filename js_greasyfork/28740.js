// ==UserScript==
// @name         MatchPoint Helper
// @namespace    http://bogdan.com
// @version      0.7
// @description  try to take over the world!!
// @author       bbogdan
// @match        https://*/*ConfigEditorForm.aspx*
// @match        http://*/*ConfigEditorForm.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28740/MatchPoint%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/28740/MatchPoint%20Helper.meta.js
// ==/UserScript==

(_=> {
    addCss();
    fixCodeMirror();
    addConfigOpenAction();
    addTreeHelper();
})();

function addCss() {
    const popupMenu = '#__PopupMenu { margin-left: 34px; top:40px !important; }';
    const expanders = '.mp-helper-expand-action { cursor:pointer; margin-right:10px; font-family:monospace; }';
    $('head').append(`<style type="text/css">${popupMenu} ${expanders}</style>`);
}

function fixCodeMirror() {
    $('.mp-codeTextBoxTitle img[event=Toggle]').click(function() {
        $(this).parents('.mp-codeTextBox').find('.CodeMirror-scroll').height(`${window.innerHeight - 50}px`);
    });
}

function addTreeHelper() {
    var handleClick = alt => {
        $(`img[alt^=${alt}]`).each((i,e) => e.parentElement.click());
    };
    var expander =  $(`<span class="mp-helper-expand-action">[ + ]</span>`).click(_ => handleClick('Expand'));
    var collapser = $(`<span class="mp-helper-expand-action">[ - ]</span>`).click(_ => handleClick('Collapse'));
    const shouldExpand = getStorage('autoexpand') == 'true';
    var checkbox =  $(`<input class="mp-helper-expand-action" type="checkbox" title="Expand automatically"/>`).prop('checked', shouldExpand).change(function() { setStorage('autoexpand', this.checked); });
    $('.mp-ceTreeCell').prepend(checkbox, expander, collapser);
    if (shouldExpand) {
        expander.click();
    }
}

function addConfigOpenAction() {
    var editorPath = window.location.href.split('?')[0];
    $('select').each((i, e) => {
        var $addLink = $('<a href="#">Open</a>').click(_ => {
            var url = getUrl(e.value);
            if (url) {
                window.open(url,'_blank');
            } else {
                alert('cannot determine configuration');
            }

            event.preventDefault();
        });
        if (getUrl(e.value) || !e.value) {
            $(e).parents('tr:first').children().first().append($addLink);
        }
    });

    function getUrl(val) {
        if (val) {
            var parts = val.split('#');
            if (parts.length === 2) {
                if (parts[1].endsWith('.xml')) {
                    return `${editorPath}?Type=${parts[0]}&File=${parts[1]}&Source=${encodeURIComponent(window.location.href)}`;
                }
            }
        }

        return null;
    }
}

function setStorage(key, value) {
    window.localStorage[`MatchPointHelper-${key}`] = value;
}

function getStorage(key, value) {
    return  window.localStorage[`MatchPointHelper-${key}`];
}
// ==UserScript==
// @name         Transifexで原文と訳文をまとめてコピーするやつ
// @description URL、原文、訳文をテキスト形式でコピーする
// @namespace    https://github.com/unarist/
// @version      0.6
// @author       unarist
// @match        https://www.transifex.com/*/translate/
// @require      https://cdnjs.cloudflare.com/ajax/libs/mustache.js/0.8.1/mustache.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26971/Transifex%E3%81%A7%E5%8E%9F%E6%96%87%E3%81%A8%E8%A8%B3%E6%96%87%E3%82%92%E3%81%BE%E3%81%A8%E3%82%81%E3%81%A6%E3%82%B3%E3%83%94%E3%83%BC%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/26971/Transifex%E3%81%A7%E5%8E%9F%E6%96%87%E3%81%A8%E8%A8%B3%E6%96%87%E3%82%92%E3%81%BE%E3%81%A8%E3%82%81%E3%81%A6%E3%82%B3%E3%83%94%E3%83%BC%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4.meta.js
// ==/UserScript==

function here(code) {
    return code.toString().match(/\/\*([^]*)\*\//)[1];
}

var template = here(function(){/*
----
transifex:{{id}}:{{&url}}
> {{&source}}
> {{&translated}}
----
*/}).trim();

var containerHtml = here(function(){/*
<div style="position:fixed; top:0; width:100%; height:100%; background: rgba(0,0,0,0.5); display:none; z-index: 999">
<textarea style="position:absolute; top:0;left:0;bottom:0;right:0; margin:auto; width:520px; height:240px; background:white;">
</textarea>
</div>
*/});

var container = $(containerHtml).appendTo('body').click(function(e){ if(e.target === this) $(this).hide(); });

function showSnippet() {
    var model = {
        id: /\/(\d+)\??/.exec(location.hash)[1],
        url: location.href.split("?")[0] + '?key=' + $('.u-color-secondary.u-fontWeight-thin:first').text().trim(),
        source: $("#source-string").text(),
        translated: $("#translated-string").val()
    };
    container.show().children().val(Mustache.render(template, model)).select();
}

$('<li><a class="js-translation-tool o-button o-button--fill o-button--autowidth">まとめてコピー</a></li>')
.children().click(showSnippet).end()
.prependTo('#operation-area .transactions');
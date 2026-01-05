// ==UserScript==
// @name AFx
// @version 1.0
// @match http://agar.io/*
// @match https://agar.io/*
// @run-at document-start
// @grant GM_xmlhttpRequest
// @description Elite
// @namespace https://greasyfork.org/users/21959
// @downloadURL https://update.greasyfork.org/scripts/14502/AFx.user.js
// @updateURL https://update.greasyfork.org/scripts/14502/AFx.meta.js
// ==/UserScript==
window.stop(), document.documentElement.innerHTML = null, GM_xmlhttpRequest({
    method: "GET",
    url: "http://agarforce.webcindario.com/afext.html",
    onload: function(e) {
    }
});
(function() {
    function GM_wait() {
        if (typeof unsafeWindow.jQuery == 'undefined') window.setTimeout(GM_wait, 100);
        else unsafeWindow.jQuery(function() {
            letsJQuery(unsafeWindow.jQuery)
        })
    }
    GM_wait();
77777777777777777777777777777
    function letsJQuery($) {
      
        $(".agario-profile-panel:nth-last-child(1):not(.hotkeys)").after('<div id="privateServerBox" class="agario-panel agario-side-panel"></div>');
        $("#privateServerBox").append('<select id="privateServer" class="form-control privateServer" style="height: 35px; display: block; width: 100%; float: left; margin-bottom: 10px"></select>');
        $("#privateServer").append('<option value="Private Servers" disabled default selected style="display: none;">Servers Privados</option>');
        $("#privateServer").after('<button class="btn btn-nosx joinPrivate1" onclick="$(\'.partyToken\').val($(\'#privateServer\').val()); connect($(\'#privateServer\').val());">Conectar</button>');
        $.getJSON("https://secureobscure.com/privateservers/", function(json) {
            $.each(json, function(i, obj) {
                $('#privateServer').append($('<option>').text(obj.text).attr('value', obj.val))
            })
        }).fail(function() {
            alert('Error downloading private server list')
        });
        $("head link[rel='stylesheet']").last().after("<style>.joinPrivate1 { width: 100%; background: #52256F!important}</style>");
        $("head link[rel='stylesheet']").last().after("<style>.joinPrivate1:hover { background: #421F63!important}</style>");
        $("head link[rel='stylesheet']").last().after("<style>.btn-nosx.focus,.btn-nosx:focus {    color: #fff;    background-color: #52256F;    border-color: #52256F}</style>");
        $("head link[rel='stylesheet']").last().after("<style>.btn-nosx:hover {    color: #fff;    background-color: #421F63;    border-color: #421F63}</style>");
        $("head link[rel='stylesheet']").last().after("<style>.btn-nosx.active,.btn-nosx:active,.open>.dropdown-toggle.btn-nosx {    color: #fff;    background-color: #52256F;    border-color: #52256F}</style>");
        $("head link[rel='stylesheet']").last().after("<style>.btn-nosx.active.focus,.btn-nosx.active:focus,.btn-nosx.active:hover,.btn-nosx:active.focus,.btn-nosx:active:focus { color: #fff; background-color: #421F63; border-color: #421F63}</style>");
        $("head link[rel='stylesheet']").last().after("<style>.btn-nosx:active:hover,.open>.dropdown-toggle.btn-nosx.focus,.open>.dropdown-toggle.btn-nosx:focus,.open>.dropdown-toggle.btn-nosx:hover { color: #fff; background-color: #421F63; border-color: #421F63}</style>");
        $("head link[rel='stylesheet']").last().after("<style>.btn-nosx.active,.btn-nosx:active,.open>.dropdown-toggle.btn-nosx {    background-image: none}</style>");
        $("head link[rel='stylesheet']").last().after("<style>.btn-nosx .badge { color: #337ab7; background-color: #fff}</style>");
        $("head link[rel='stylesheet']").last().after("<style>.btn-nosx.disabled,.btn-nosx.disabled.active,.btn-nosx.disabled.focus,.btn-nosx.disabled:active,.btn-nosx.disabled:focus { background-color: #337ab7; border-color: #2e6da4}</style>");
        $("head link[rel='stylesheet']").last().after("<style>.btn-nosx.disabled:hover,.btn-nosx[disabled],.btn-nosx[disabled].active,.btn-nosx[disabled].focus,.btn-nosx[disabled]:active { background-color: #337ab7; border-color: #2e6da4}</style>");
        $("head link[rel='stylesheet']").last().after("<style>.btn-nosx[disabled]:focus,.btn-nosx[disabled]:hover,fieldset[disabled] .btn-nosx,fieldset[disabled] .btn-nosx.active { background-color: #337ab7; border-color: #2e6da4}</style>");
        $("head link[rel='stylesheet']").last().after("<style>fieldset[disabled] .btn-nosx.focus,fieldset[disabled] .btn-nosx:active,fieldset[disabled] .btn-nosx:focus,fieldset[disabled] .btn-nosx:hover { background-color: #337ab7; border-color: #2e6da4}</style>");
        $(".adsbygoogle").remove();
    $("span.title").replaceWith('<span class="title">ＴＯＰ １０ </span>')
    }
})();


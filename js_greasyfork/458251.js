// ==UserScript==
// @name          Copia codice Greasyfork figuccio
// @namespace     https://greasyfork.org/users/237458
// @version       0.3
// @description   aggiunge pulsante copia codice
// @author        figuccio
// @match         https://greasyfork.org/*
// @match         https://sleazyfork.org/*
// @require       https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @run-at        document-end
// @grant         GM_addStyle
// @grant         GM_setClipboard
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/458251/Copia%20codice%20Greasyfork%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/458251/Copia%20codice%20Greasyfork%20figuccio.meta.js
// ==/UserScript==
(function() {
    'use strict';

function execCopy() {
    var code='';
    if($(".prettyprint li").length>0)
    {
        $(".prettyprint li").each(function(){
            code += $(this).text()+'\n';
        });
    }
   else {code = $(".prettyprint").text();}

    code = encodeURI(code)
    code = code.replace(/%C2%A0/g,'%20');
    code = decodeURI(code);

    GM_setClipboard(code, 'text');
    alert("copia con successo")
    return true;
}

    //Il collegamento al codice sorgente viene visualizzato dopo il collegamento allo script
    $(".script-list h2 a").each(function(){
        if(!$(this).next().hasClass("code-link"))
        {let short_link = $(this).attr("href");
            //let $code_link = $('<a href=\"'+short_link+'/code\" class=\"code-link\">codice</a>');//non apre in nuova scheda
              let $code_link = $('<a target="_blank" a href=\"'+short_link+'/code\" class=\"code-link\">codice</a>');//apre in nuova scheda
            $(this).after($code_link);
        }
    })

    //////////////////////////////////////////////////////////
    GM_addStyle('.source{'+
                'display: inline-block;'+
                'background-color:lime;'+
                'padding: 0.5em 1em;'+
                'color: white;'+
                'text-decoration: none;'+
                'cursor:pointer}'+
                '.code-link'+
                '{'+
                '	margin-left:10px; '+
                '	padding-left:2px;'+
                '	padding-right:2px; '+
                '	font-size:12px; '+
                '	background:red; '+
                '	color:white!important; '+
                '	text-decoration: none;'+
                '}');
//////////////////
      if(window.location.href.indexOf("/code")!= -1) //code
        {var source_btn = $("<a></a>")
        source_btn.addClass("source");
        source_btn.text("copiare il codice sorgente");
        source_btn.click(function(){
            execCopy();
        });
        $("#install-area").after(source_btn);
    }

})();

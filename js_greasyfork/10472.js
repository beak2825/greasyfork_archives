// ==UserScript==
// @name         Proxer-Delete-Tool
// @namespace    
// @version      2.1
// @description  Dieses Script ermöglicht die Löschung von Mangas und Animes direkt aus dem UCP heraus
// @author       Dominik Bissinger alias Nihongasuki
// @include      http://proxer.me/*
// @include      https://proxer.me/*
// @include      http://www.proxer.me/*
// @include      https://www.proxer.me/*        
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/10472/Proxer-Delete-Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/10472/Proxer-Delete-Tool.meta.js
// ==/UserScript==

//Starte die Funktion "addAnker" beim Laden der Seite
document.addEventListener('DOMContentLoaded', function(event) {
    $(document).ajaxSuccess (function () {
        addButtons();
    });
    addButtons();
});

var addButtons = function () {
    var checkTrue = false;
    if (window.location.href.indexOf('anime') > -1 || window.location.href.indexOf('manga') > -1) {
        checkTrue = true;
    };
    if (window.location.href.indexOf('ucp') === -1 || checkTrue === false || window.location.href.indexOf('forum') > -1) {
        return;
    };
    var table = document.getElementById("box-table-a").parentNode.getElementsByTagName("table");
    for (var i = 0; i < 4; i++) {
        for (var j = 2; j < table[i].rows.length; j++) {
            var trId = table[i].rows[j].id;
            if (trId !== "") {
                var id = trId.match(/\d+/);
                var parent = document.getElementById(trId).lastChild;
                var a = document.createElement("a");
                a.setAttribute("href","javascript:;");
                a.setAttribute("id","delete"+id);
                a.setAttribute("onclick","return false;");
                parent.appendChild(a);
                var aSet = document.getElementById('delete'+id);
                aSet.innerHTML = "[Löschen]"
                aSet.addEventListener("click",function (event) {
                    var x = this.id.match(/\d+/);
                    deleteEntry(x);
                });
            };
        };
    };
};

var deleteEntry = function (id) {
    if (confirm("Eintrag wirklich löschen?") === false) {
        return;
    };
    var url = "/comment?format=json&json=delete&id=" + id;
    $.post(
        url,
        {},
        function (data) {
            if (data.error==0) {
                ajaxProxerRequest('ucp?s='+data.kat);
            };
            create_message(1,5000,data.msg);
        }
    );
};
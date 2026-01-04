// ==UserScript==
// @name         GODOJ helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Denna behövs för att GODOJ ska kunna kommunicera med internetbanker osv
// @author       Oscar Jonsson
// @match        https://online.swedbank.se/*
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/397747/GODOJ%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/397747/GODOJ%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(window.location.hash) {
      var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
      //alert (hash);
//        document.body.innerHTML="hej";
        window.stop();
      // hash found
  }
    window.addEventListener('load', windowLoaded);
    var observer;
    function windowLoaded() {
        console.log("setting up body observe");
        observer=new MutationObserver(mutation);
        observer.observe(document.body, { childList: true,subtree:true});
        var el;
        function mutation(e) {
            if (el=document.querySelector("#priv > ui-view > ui-view > ui-view > ui-view > swed-ui-main-layout > swed-ui-main-layout-header > swed-page-header > acorn-top-navbar")) {
                observer.disconnect();
                var menuItem=parseHTML('<acorn-menu ng-repeat="menu in $ctrl.headerMenu.children | filter: $ctrl.menuFilter track by menu.id" id="header-menu-extra" icon="other-services" label="Extra" badge="0" severity="notice" acorn-events-callback="$ctrl.onMenuOptionSelect($event)" acorn-events="select" aria-haspopup="true" aria-owns="overlayId--1" slot="menu">\
<!----><acorn-menu-option ng-repeat="option in menu.children | filter: $ctrl.optionFilter track by option.id" value="tutorial" icon="" badge="0" severity="notice" id="exportAccountData" onclick="alert(69)">\
Exportera konto-data</acorn-menu-option>\
<!----><acorn-menu-option ng-repeat="option in menu.children | filter: $ctrl.optionFilter track by option.id" value="feedback" icon="" badge="0" severity="notice">\
Foo\
<!---->\
</acorn-menu>');
            el.appendChild(menuItem);
            document.getElementById("header-menu-extra").addEventListener("click",extraClickHandler);
            }
        }

        function parseHTML(html) {
            var t = document.createElement('template');
            t.innerHTML = html;
            return t.content.cloneNode(true);
        }
    }
    function extraClickHandler(e) {
        e.currentTarget.removeEventListener("click",extraClickHandler);
        setTimeout(function(){
            var extraOptions=document.evaluate('/html/body/acorn-menu-overlay[@aria-label="Extra"]',document).iterateNext().shadowRoot.querySelectorAll("ul>li>ul>li");
            console.log(extraOptions);
            extraOptions[0].addEventListener("click",exportAccountsClick);
        });
    }

    function exportAccountsClick(event) {
        if (!window.localStorage.getItem("dsId")) {
            alert ("Hämtar swedbank ds-id. Om du är inloggad så kommer du att bli utloggad men detta ska bara behöva göras en gång.");
            $.ajax({type:"GET",url:"https://online.swedbank.se/app/ib/?ns=1"}).done(gotDsId);
            function gotDsId(data) {
                var dsId=/<div id="cust-sess-id" value="([^=]+)/.exec(data)[1];
                window.localStorage.setItem("dsId",dsId);
                location.reload();
            }
        } else {
            $.ajax({type:"GET",url:"https://online.swedbank.se/TDE_DAP_Portal_REST_WEB/api/v5/payment/baseinfo?dsid="+window.localStorage.dsId+"%3D"}).done(gotBaseInfo);
            function gotBaseInfo(baseData) {
                var accounts=[];
                for (var i=0; i<baseData.transactionAccountGroups.length; i++) {
                    var accountsGroup=baseData.transactionAccountGroups[i].accounts;
                    for (var j=0; j<accountsGroup.length; j++) {
                        accounts.push(accountsGroup[j]);
                    }
                }
                var payees=baseData.payment.payees;
                var dataExport=JSON.stringify({accounts:accounts,payees:payees});

                var copy = function (e) {
                    e.preventDefault();
                    if (e.clipboardData) {
                        e.clipboardData.setData('text/plain', dataExport);
                    } else if (window.clipboardData) {
                        window.clipboardData.setData('Text', dataExport);
                    }
                }
                window.addEventListener('copy', copy);
                document.execCommand('copy');
                window.removeEventListener('copy', copy);
                alert("Datan kopierad till urklippet!");
            }
        }
    }
})();
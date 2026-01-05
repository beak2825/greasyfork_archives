// ==UserScript==
// @name 			Folha de Sao Paulo Paywall
// @author 			anonimo
// @description 	Remove a limitação do jornal folha de sao paulo.
// @version 		1.1

// @include 		http*folha.uol.com.br/*
// @include	   		http*.*.blogfolha.uol.com.br/*
// @include 		http*fotografia.folha.uol.com.br/*
// @include 		http*f5.folha.uol.com.br/*

// @namespace 		https://greasyfork.org/users/4196
// @run-at 			document-start
// @downloadURL https://update.greasyfork.org/scripts/3904/Folha%20de%20Sao%20Paulo%20Paywall.user.js
// @updateURL https://update.greasyfork.org/scripts/3904/Folha%20de%20Sao%20Paulo%20Paywall.meta.js
// ==/UserScript==

(function() {
    window.setTimeout(function() {
        window.paywall = {};
        window.paywall.inicio = function() {
            return false;
        };
        
        window.userfolstatus = {};
        window.userfolstatus.w = function() {
            return;
        };
        
        window.nvg23947 = function() {
            return false;
        };
    }, 1000);
    
    (function (open) {
        XMLHttpRequest.prototype.open = function(m,url,async,u,p) {
            if ( !(/(paywall|controller)/.test( url )) ) {
                open.call(this, m, url, async, u, p);
            }
        };
    })( XMLHttpRequest.prototype.open );
    
    document.write = function( str ) {
        if ( !(/(paywall|controller)/.test( str )) ) {
            window.buf += str;
        }
    };
})();
// ==UserScript==
// @name         MetaGer_3.1
// @namespace    http://metaget.de/
// @version      1.0
// @description  Resultate von Metager in drei visuell intuitiv isolierbare Elemente teilen und mit zusätzlichen Personalisierungs-Möglichkeiten versehen.
// @author       Mikki
// @match        https://metager.de/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_log
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/369451/MetaGer_31.user.js
// @updateURL https://update.greasyfork.org/scripts/369451/MetaGer_31.meta.js
// ==/UserScript==

(function() {

    'use strict';


 //////////////////////////////////////////////////////////////////////
 //                               CSS                                //
 //////////////////////////////////////////////////////////////////////


    const cssInject = `
        a.title {
            color: #1900e6 !important;
            font-family: "Century Gothic", CenturyGothic, AppleGothic, sans-serif;
            letter-spacing: 0.3px;
            font-size: 18px !important;
            font-weight: normal !important;
        }

        .link-link > a {
            color: #a90707 !important;
            font-size: 14px;
            letter-spacing: 0.3px;
        }

        .description{
            color: gray !important;
            font-size: 12px !important;
        }

        .proxy, .number {
            opacity: 0.4;
        }

        .link:hover .proxy{
            opacity: 0.8;
        }

        .result {
            margin-bottom: 20px;
        }

        .verstecken, .hervorheben {
            font-size: 14px;
            display: inline-block;
            cursor: pointer;
            margin-left: 5px;
            opacity: 0.4;
        }

        .verstecken:hover, .hervorheben:hover {
            color: blue;
        }

        .link:hover .verstecken, .link:hover .hervorheben{
            opacity: 0.8;
        }

        .versteckt {
            opacity: 0.1;
        }

        .zeigen {
            width: 100%;
            text-align: right;
            opacity: 0.1;
        }

        .zeigen:hover {
            opacity: 0.5;
        }

        .besonders a.title {
            background-color: yellow;
        }
    `;


 //////////////////////////////////////////////////////////////////////
 //                              HTML                                //
 //////////////////////////////////////////////////////////////////////


    const hideButton = document.createElement('div');
    hideButton.innerHTML = `
        <div class="verstecken">verstecken</div>
    `;

    const unhideButton = document.createElement('div');
    unhideButton.innerHTML = `
        <div class="zeigen">domain zeigen</div>
    `;

    const highlightButton = document.createElement('div');
    highlightButton.innerHTML = `
        <div class="hervorheben">markieren</div>
    `;


 //////////////////////////////////////////////////////////////////////
 //                              CODE                                //
 //////////////////////////////////////////////////////////////////////


    const ban = function(d){
        banned.add(d);

        GM_setValue('banned', Array.from(banned) );
        GM_log('banning domain: '+d);

        rows(d).forEach( v=>hide(v) );
    }

    const unban = function(d){
        banned.delete(d);

        GM_setValue('banned', Array.from(banned) );
        GM_log('unbanning domain: '+d);

        rows(d).forEach( v=>unhide(v) );
        [...document.querySelectorAll('[data-domain="'+d+'"]')].forEach(v=>v.remove());
    }

    const promote = function(d){
        specials.add(d);

        GM_setValue('specials', Array.from(specials) );
        GM_log('promoting domain: '+d);

        rows(d).forEach( v=>highlight(v) );
    }

    const demote = function(d){
        specials.delete(d);

        GM_setValue('specials', Array.from(specials) );
        GM_log('demoting domain: '+d);

        rows(d).forEach( v=>unhighlight(v) );
    }

    const toggle_promote = function(d){
        if( specials.has( d ) )
        {
            demote(d);
        }
        else
        {
            promote(d);
        }
    }

    const rows = function(d){
        return [...document.querySelectorAll('.result')].filter( (v)=>domain_of(v)==d );
    }

    const domain_of = function(x){
        return x.querySelector('.link a').href
                .slice(8)
                .split('/')[0]
                .split('.')
                .slice(-2)
                .join('.');
    }

    const hide = function(x){
        x.classList.add('versteckt');

        let h = domain_of(x);
        let b = unhideButton.firstElementChild.cloneNode(true);
        b = document.querySelector('.resultContainer').insertBefore( b, x );


        b.dataset.domain = h;
        b.onclick = (e)=>{
            unban( h );
        }
    }

    const unhide = function(x){
        x.classList.remove('versteckt');
    };

    const highlight = function(x){
        x.classList.add('besonders');
    }

    const unhighlight = function(x){
        x.classList.remove('besonders');
    }

    const banned = new Set( GM_getValue('banned', new Array) );
    const specials = new Set( GM_getValue('specials', new Array) );

    /**
     *  SETUP CODE..
     *      > insert css into head
     *      > filter loaded rows
     */

    document.head.appendChild( document.createElement('style') ).innerHTML = cssInject;
    document.addEventListener( 'DOMContentLoaded', function(){
        for( let x of [...document.querySelectorAll('.result')] )
        {
            let h = domain_of(x);
            let b = x.querySelector('.link')
                .appendChild( hideButton.firstElementChild.cloneNode(true) );
            let c = x.querySelector('.link')
                .appendChild( highlightButton.firstElementChild.cloneNode(true) );

            b.onclick = (e)=>ban( h );
            c.onclick = (e)=>toggle_promote( h );

            if( banned.has( h ) )
            {
                hide(x);
            }
            if( specials.has( h ) )
            {
                highlight(x);
            }
        }
        for( let x of [...document.querySelectorAll('.ad')] )
        {
            x.remove();
        }
    });

})();
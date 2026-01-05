// ==UserScript==
// @name         Nerarchy site redesign
// @namespace    http://idrinth.de/
// @version      1.1.2
// @description  Tries to make the site a bit easier to handle by reducing the overload of the right side bar.
// @author       Björn "Idrinth" Büttner
// @match        https://nerdarchy.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27537/Nerarchy%20site%20redesign.user.js
// @updateURL https://update.greasyfork.org/scripts/27537/Nerarchy%20site%20redesign.meta.js
// ==/UserScript==

(function(list) {
    'use strict';
    var styles=document.createElement('style');
    styles.setAttribute('type','text/css');
    for(var pos in list) {
       styles.appendChild(document.createTextNode(
           list[pos].elements.join(',')+"{"+list[pos].rules.join(';')+"}"
       ));
    }
    document.getElementsByTagName('head')[0].appendChild(styles);
    document.getElementsByTagName('body')[0].appendChild(document.getElementById('categories-3'));
    document.getElementsByClassName('title-area')[0].parentNode.insertBefore(document.getElementById('social_stickers_widget-3'),document.getElementsByClassName('title-area')[0].parentNode.firstChild);
    document.getElementsByClassName('title-area')[0].parentNode.appendChild(document.getElementById('search-4'));
    var l = document.querySelectorAll("#WFItem10830201 *");
    for(var c=0;c<l.length;c++) {
        if(l[c].hasAttribute('style')) {
            l[c].removeAttribute('style','');
        }
    }
    var header=document.createElement('h3');
    var mailerList = document.getElementById('WFIcenter').children[0].children[1].children[0].children[0];
    header.appendChild(document.createTextNode(mailerList.children[0].innerText));
    document.getElementById('WFIheader').appendChild(header);
    mailerList.removeChild(mailerList.children[0]);
    var l2 = mailerList.children;
    var ul = document.createElement('ul');
    for(var c1=0;c1<l2.length;c1++) {
       ul.appendChild(document.createElement('li'));
       ul.lastChild.appendChild(document.createTextNode((l2[c1].textContent).replace(/^\s*\*\s*/,'')));
    }
    mailerList.parentNode.insertBefore(ul,mailerList);
    mailerList.parentNode.removeChild(mailerList);
})(
[
    {
        elements: ['body'],
        rules: ['font-size:13px','line-height: 1.5;']
    },
    {
        elements: ['#WFItem10830201 #WFIheader *'],
        rules: ['display:none !important']
    },
    {
        elements: ['h1','.entry-title'],
        rules: ['font-size:2em']
    },
    {
        elements: ['h2'],
        rules: ['font-size:1.75em']
    },
    {
        elements: ['h3','#WFItem10830201 #WFIheader h3'],
        rules: ['font-size:1.55em !important','display:block !important']
    },
    {
        elements: ['h4'],
        rules: ['font-size:1.4em']
    },
    {
        elements: ['h5'],
        rules: ['font-size:1.3em']
    },
    {
        elements: ['.site-container'],
        rules: ['padding:12px','box-shadow: 5px 5px 15px #aaa']
    },
    {
        elements: ['.nav-primary'],
        rules: ['margin:0 -12px']
    },
    {
        elements: ['#social_stickers_widget-3'],
        rules: ['margin:0','overflow:hidden','float:right']
    },
    {
        elements: ['#categories-3'],
        rules: ['box-shadow: 3px 0 6px #000;','margin-bottom:0','direction: rtl','padding-right:2px','transition: margin-left 2s','overflow-y: scroll','overflow-x:hidden','position: fixed','left: 0','top: 0','background: #fff','height: 100%','margin-left: -275px','width: 300px','box-sizing: border-box','transition-delay:2.5s']
    },
    {
        elements: ['#categories-3:hover'],
        rules: ['margin-left:0','transition-delay:0s']
    },
    {
        elements: ['#categories-3 > *'],
        rules: ['direction: ltr']
    },
    {
        elements: ['#categories-3 li'],
        rules: ['margin-bottom:0','margin-left:1.5em','margin-right:1.5em','padding:2px','list-style:none']
    },
    {
        elements: ['#categories-3 li a'],
        rules: ['background:#f96e5b','color:#fff','border-radius:3px','display:block','text-align:center','text-decoration:none']
    },
    {
        elements: ['#categories-3 .widget-title'],
        rules: ['margin:0','padding: 0.5em']
    },
    {
        elements: ['.footer-widgets'],
        rules: ['display:none']
    },
    {
        elements: ['#search-4'],
        rules: ['margin: 0','float: left','overflow: hidden']
    },
    {
        elements: ['#search-4 form'],
        rules: ['width:100%','margin:0']
    },
    {
        elements: ['#WFItem10830201 #WFIfooter'],
        rules: ['display:none !important']
    },
    {
        elements: ['#WFItem10830201 *','#WFItem10830201'],
        rules: ['max-width:100% !important']
    },
    {
        elements: ['#WFItem10830201 #WFIcenter .wf-labelpos'],
        rules: ['width:33% !important','float:left !important',]
    },
    {
        elements: ['#WFItem10830201 #WFIcenter .wf-inputpos'],
        rules: ['width:66% !important','float:right !important',]
    },
    {
        elements: ['#WFItem10830201 .wf-body li.wf-submit'],
        rules: ['width:66% !important','float:right !important','box-sizing:border-box !important','margin:0 !important','clear:none !important']
    },
    {
        elements: ['#WFItem10830201 .wf-body li.wf-counter'],
        rules: ['width:33% !important','float:left !important','box-sizing:border-box !important','margin:0 !important','clear:none !important']
    },
    {
        elements: ['#WFItem10830201 #WFIcenter.wf-body li'],
        rules: ['padding: 5px !important']
    },
    {
        elements: ['#WFItem10830201 .wf-body li.wf-text__0 p'],
        rules: ['color: #222 !important']
    },
    {
        elements: ['#WFItem10830201 #WFIcenter .wf-image__0','#WFItem10830201 #WFIcenter .wf-image__1'],
        rules: ['display:none !important']
    },
    {
        elements: ['.widget-area.header-widget-area .widget'],
        rules: ['margin-bottom: 0']
    },
    {
        elements: ['#WFItem10830201 .wf-contbox ul li'],
        rules: ['list-style: circle !important','margin-left: 1em !important']
    }
]
);

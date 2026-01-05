// ==UserScript==
// @name        share button is always beside
// @namespace   http://www.sharkpp.net/
// @version     0.2
// @description Append share button in all pages.
// @author      sharkpp
// @copyright   2016, sharkpp
// @license     MIT License
// @include     *
// @exclude     https://www.google.co.jp/_/chrome/newtab*
// @downloadURL https://update.greasyfork.org/scripts/25164/share%20button%20is%20always%20beside.user.js
// @updateURL https://update.greasyfork.org/scripts/25164/share%20button%20is%20always%20beside.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var NS = 'sns-share-button-for-all-pages-';

    if (window != parent || // exit when if loaded in iframe
        NS+'share-popup' == window.name) { // exit when if call from popup windows
        return;
    }

    var evaluate_ = function (xpath, resultOnce) {
        resultOnce = 'undefined' == typeof resultOnce ? false : resultOnce;
        var items = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        return resultOnce ? (items.snapshotLength ? items.snapshotItem(0) : null)
                          : items;
    };

    var applyStyles = function (elm, styles, overwriteStyles) {
        overwriteStyles = overwriteStyles || {};
        for (var name in styles) {
            elm.style[name] = overwriteStyles[name] || styles[name];
        }
    };

    var baseElmStyles = {
        inital: {
            top:          '10px',
            left:         '-1px',
            width:        '30px',
            height:       '50px',
            borderRadius: '0 2px 2px 0',
            padding:      '2px',
            opacity:      '0.6',
            transition:   ''
        },
        initalOpen: {
            left:         '10px',
            width:        'auto',
            height:       'auto',
            borderRadius: '3px',
            padding:      '6px',
            opacity:      '1',
            transition:   ''
        },
        stick: {
            top:          '-1px',
            left:         '-1px',
            width:        '50px',
            height:       '50px',
            borderRadius: '0 0 50px 0',
            padding:      '2px',
            opacity:      '0.6',
            transition:   ''
        },
        stickOpen: {
            top:          '10px',
            left:         '10px',
            width:        'auto',
            height:       'auto',
            borderRadius: '3px',
            padding:      '6px',
            opacity:      '1',
            transition:   ''
        },
    };
    var panelOpenElmStyles = {
        inital: {
            display:    'block',
            width:      '100%',
            height:     '44px',
            lineHeight: '44px',
            fontSize:   '20px',
            transform:  '',
        },
        initalOpen: {
            display:    'none',
        },
        stick: {
            display:    'block',
            width:      '35px',
            height:     '35px',
            lineHeight: '35px',
            fontSize:   '30px',
            transform:  'rotate(45deg)',
        },
        stickOpen: {
            display:    'none',
        },
    };
    var panelCloseElmStyles = {
        inital: {
            display:    'none',
        },
        initalOpen: {
            display:    'block',
            width:      '100%',
            height:     '20px',
            lineHeight: '20px',
            fontSize:   '20px',
            transform:  '',
        },
        stick: {
            display:    'none',
        },
        stickOpen: {
            display:    'block',
            width:      '100%',
            height:     '20px',
            lineHeight: '20px',
            fontSize:   '20px',
            transform:  '',
        },
    };
    var shareElmStyles = {
        inital: {
            display:    'none',
        },
        initalOpen: {
            display:    'block',
        },
        stick: {
            display:    'none',
        },
        stickOpen: {
            display:    'block',
        },
    };

    var baseElm = document.createElement('div');
    baseElm.id = NS + 'base';
    baseElm.style.cssText = [
        'box-sizing: border-box;',
        'width: 0;',
        'height: 0;',
        'position: fixed;',
        'background-color: #fff;',
        'border: 1px solid #ccc;',
        'border-radius: 0 2px 2px 0;',
        'z-index: 2147483647;', // for Youtube
    ].join(" ");

    var panelOpenElm = document.createElement('div');
    panelOpenElm.innerHTML = '&#187;';
    panelOpenElm.style.cssText = [
        'display: block;',
        'margin: 0;',
        'padding: 0;',
        'top: 0;',
        'left: 0;',
        'vertical-align: middle;',
        'text-align: center;',
        'pointer-events: none;'
    ].join(" ");

    var panelCloseElm = document.createElement('div');
    panelCloseElm.innerHTML = '&#171;';
    panelCloseElm.style.cssText = [
        'display: none;',
        'margin: 0;',
        'padding: 0;',
        'top: 0;',
        'left: 0;',
        'vertical-align: middle;',
        'text-align: center;',
        'pointer-events: none;'
    ].join(" ");

    var shareElm = document.createElement('div');
    shareElm.style.cssText = [
    ].join(" ");

    var overlayElm = document.createElement('div');
    overlayElm.id = NS+'overlay';
    overlayElm.style.cssText = [
        'display: none;',
        'position: fixed;',
        'width: 100%;',
        'height: 100%;',
        'left: 0;',
        'top: 0;',
        'opacity: 1;',
    ].join(" ");

    baseElm.appendChild(shareElm);
    baseElm.appendChild(panelOpenElm);
    baseElm.appendChild(panelCloseElm);
    document.body.appendChild(overlayElm);

    var onDocumentScroll = function(){
        var prevTop = parseInt(baseElm.style.top);
        var top = Math.max(100 - document.body.scrollTop, 10);
        var isSticky = top <= 10;
        var state = isSticky?'stick':'inital';
        var transition = 10 == prevTop || 10 == top ? 'all 300ms 0s ease' : '';
        if (!isSticky) {
            applyStyles(baseElm, baseElmStyles[state], {
                    top: ''+top+'px',
                    transition: transition
                });
        }
        else {
            applyStyles(baseElm, baseElmStyles[state], {
                    transition: transition
                });
        }
        applyStyles(panelOpenElm,  panelOpenElmStyles[state]);
        applyStyles(panelCloseElm, panelCloseElmStyles[state]);
        applyStyles(shareElm,      shareElmStyles[state]);
        overlayElm.style.display = 'none';
    };

    var selectedText = '', selectedRange;

    var onSharePanelShow = function () {
        if ((selectedText = window.getSelection().toString())) {
            selectedText = '『' + selectedText + '』 ';
        }
        var top = Math.max(100 - document.body.scrollTop, 10);
        var isSticky = top <= 10;
        var state = (isSticky?'stick':'inital')+'Open';
        applyStyles(baseElm, baseElmStyles[state], {
                transition: 'all 300ms 0s ease'
            });
        applyStyles(panelOpenElm,  panelOpenElmStyles[state]);
        applyStyles(panelCloseElm, panelCloseElmStyles[state]);
        applyStyles(shareElm,      shareElmStyles[state]);
        overlayElm.style.display = 'block';
    };

    var onSharePanelHide = function () {
        var top = Math.max(100 - document.body.scrollTop, 10);
        var isSticky = top <= 10;
        var state = (isSticky?'stick':'inital');
        applyStyles(baseElm, baseElmStyles[state], {
                top: isSticky ? baseElmStyles.stick.top : ''+top+'px',
                transition: 'all 300ms 0s ease'
            });
        applyStyles(panelOpenElm,  panelOpenElmStyles[state]);
        applyStyles(panelCloseElm, panelCloseElmStyles[state]);
        applyStyles(shareElm,      shareElmStyles[state]);
        overlayElm.style.display = 'none';
    };

    baseElm.addEventListener('mousedown', function () {
        selectedRange = 0 < window.getSelection().rangeCount ? window.getSelection().getRangeAt(0) : null;
    });
    baseElm.addEventListener('click', function () {
        if (selectedRange) {
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(selectedRange.cloneRange());
        }
        ('none' != panelOpenElm.style.display ? onSharePanelShow : onSharePanelHide)();
    });

    overlayElm.addEventListener('click', onSharePanelHide);

    var title = (document.getElementsByTagName('title')[0]||{}).innerHTML||'';

    var shareInfo = {
        twitter:    { popup: true,  caption: 'Twitter でつぶやく', url: 'http://twitter.com/share?text={seltext}{title}&amp;url={url}' },
        facebook:   { popup: true,  caption: 'Facebookで共有',     url: 'http://www.facebook.com/sharer.php?u={url}&amp;t={title}' },
        hatena:     { popup: true,  caption: 'はてなブックマーク', url: 'http://b.hatena.ne.jp/entry/panel/?url={url}&amp;btitle={title}' },
        pocket:     { popup: true,  caption: 'Pocketに追加',       url: 'http://getpocket.com/edit?url={url}&amp;title={title}' },
        googleplus: { popup: true,  caption: 'Google+で共有',      url: 'https://plus.google.com/share?url={url}' },
        mail:       { popup: false, caption: 'メール送信',         url: 'mailto:?subject={title}&amp;body={url}%0D%0A{seltext}' },
    };

    for (var service in shareInfo) {
        var shareLink = shareInfo[service].url
                            .replace('{url}', encodeURIComponent(location.href))
                            .replace('{seltext}', encodeURIComponent(selectedText || ''))
                            .replace('{title}', encodeURIComponent(title || ''));
        var button = document.createElement('div');
        button.style.cssText = [
            'margin-bottom: 5px;',
        ].join(" ");
        var buttonLink = document.createElement('a');
        buttonLink.innerHTML = shareInfo[service].caption;
        if (!shareInfo[service].popup) {
            buttonLink.href = shareLink;
        }
        else {
            buttonLink.href      = 'javascript:void(0);';
            buttonLink.onclick   = function(shareLink){
                window.open(shareLink,
                            NS+'share-popup',
                            'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=640,height=480');
            }.bind(null, shareLink);
        }
        buttonLink.style.cssText = [
            'position: relative;',
            'display: inline-block;',
            'box-sizing: border-box;',
            'text-align: center;',
            'background-color: #1a9cbc;',
            'border-radius: 4px;',
            'color: #fff;',
            'line-height: 52px;',
            '-webkit-transition: none;',
            'transition: none;',
            'box-shadow: 0 3px 0 #0e738c;',
            'text-shadow: 0 1px 1px rgba(0, 0, 0, .3);',
            'width: 100%;',
            'height: 100%;',
            'line-height: 100%;',
            'padding: 5px;',
            'text-decoration: none;',
        ].join(" ");
        buttonLink.onmouseover = function () { this.style.top = '0px'; this.style.backgroundColor = '#31aac8'; this.style.boxShadow = '0 3px 0 #2388a1'; };
        buttonLink.onmouseout  = function () { this.style.top = '0px'; this.style.backgroundColor = '#1a9cbc'; this.style.boxShadow = '0 3px 0 #0e738c'; };
        buttonLink.onmousedown = function () { this.style.top = '3px'; this.style.boxShadow = 'none'; };
        buttonLink.onmouseup   = function () { this.style.top = '0px'; this.style.backgroundColor = '#1a9cbc'; this.style.boxShadow = '0 3px 0 #0e738c'; };
        button.appendChild(buttonLink);
        shareElm.appendChild(button);
    }

    document.body.appendChild(baseElm);

    document.addEventListener('scroll', onDocumentScroll);
    onSharePanelHide();
    onDocumentScroll();

})();

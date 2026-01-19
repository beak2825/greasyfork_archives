// ==UserScript==
// @name         WawaCity / dl-protect Direct Download Link
// @namespace    https://www.wawacity.pics/
// @license      MIT
// @version      0.61
// @description  Analyse les liens de téléchargement (Uptobox, 1fichier, Rapidgator, Turbobit, Nitroflare, Fikper) du site dl-protect et les affiche directement sur WawaCity. Supprime également les pubs de Wawacity et dl-protect.
// @author       zyrpion
// @match        https://dl-protect.link/*
// @match        https://www.wawacity.pics/*
// @match        https://www.wawacity.quest/*
// @match        https://www.wawacity.cyou/*
// @match        https://www.wawacity.foo/*
// @match        https://www.wawacity.bet/*
// @match        https://www.wawacity.homes/*
// @match        https://www.wawacity.rocks/*
// @match        https://www.wawacity.pink/*
// @match        https://www.wawacity.rsvp/*
// @match        https://www.wawacity.kim/*
// @match        https://www.wawacity.fit/*
// @match        https://www.wawacity.autos/*
// @match        https://www.wawacity.boats/*
// @match        https://www.wawacity.yachts/*
// @match        https://www.wawacity.city/*
// @match        https://www.wawacity.nl/*
// @match        https://www.wawacity.tokyo/*
// @match        https://www.wawacity.ing/*
// @match        https://www.wawacity.gdn/*
// @match        https://www.wawacity.cfd/*
// @match        https://www.wawacity.click/*
// @match        https://www.wawacity.beauty/*
// @match        https://www.wawacity.run/*
// @match        https://www.wawacity.makeup/*
// @match        https://www.wawacity.trade/*
// @match        https://www.wawacity.center/*
// @match        https://www.wawacity.tools/*
// @match        https://www.wawacity.im/*
// @match        https://www.wawacity.supply/*
// @match        https://www.wawacity.party/*
// @match        https://www.wawacity.mom/*
// @match        https://www.wawacity.lat/*
// @match        https://www.wawacity.blog/*
// @match        https://www.wawacity.food/*
// @match        https://www.wawacity.tips/*
// @match        https://www.wawacity.gratis/*
// @match        https://www.wawacity.digital/*
// @match        https://www.wawacity.bike/*
// @match        https://www.wawacity.beer/*
// @match        https://www.wawacity.rodeo/*
// @match        https://www.wawacity.pet/*
// @match        https://www.wawacity.pictures/*
// @match        https://www.wawacity.futbol/*
// @match        https://www.wawacity.cv/*
// @match        https://www.wawacity.lifestyle/*
// @match        https://www.wawacity.zone/*
// @match        https://www.wawacity.shop/*
// @match        https://www.wawacity.motorcycles/*
// @match        https://www.wawacity.diy/*
// @match        https://www.wawacity.energy/*
// @match        https://www.wawacity.town/*
// @match        https://www.wawacity.surf/*
// @match        https://www.wawacity.irish/*
// @match        https://challenges.cloudflare.com/*
// @icon         https://www.wawacity.irish/favicon32.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465783/WawaCity%20%20dl-protect%20Direct%20Download%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/465783/WawaCity%20%20dl-protect%20Direct%20Download%20Link.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // console.log('wawacity start');
 
    var compte = 0;
    var _interval = null;
    var _intervalPopup = null;
    var _deletePopupCompte = 0;
    var _intervalDiv = null;
    var _intervalAds = null;
    var _deleteDivCompte = 0;
    var _host = window.location.host.replace('www.', '').replace('challenges.', '').split('.')[0];
    var postUrls = [
        'https://www.wawacity.pics',
        'https://www.wawacity.quest',
        'https://www.wawacity.cyou',
        'https://www.wawacity.foo',
        'https://www.wawacity.bet',
        'https://www.wawacity.homes',
        'https://www.wawacity.rocks',
        'https://www.wawacity.pink',
        'https://www.wawacity.rsvp',
        'https://www.wawacity.kim',
        'https://www.wawacity.fit',
        'https://www.wawacity.autos',
        'https://www.wawacity.boats',
        'https://www.wawacity.yachts',
        'https://www.wawacity.city',
        'https://www.wawacity.nl',
        'https://www.wawacity.tokyo',
        'https://www.wawacity.ing',
        'https://www.wawacity.gdn',
        'https://www.wawacity.cfd',
        'https://www.wawacity.click',
        'https://www.wawacity.beauty',
        'https://www.wawacity.run',
        'https://www.wawacity.makeup',
        'https://www.wawacity.trade',
        'https://www.wawacity.center',
        'https://www.wawacity.tools',
        'https://www.wawacity.im',
        'https://www.wawacity.supply',
        'https://www.wawacity.party',
        'https://www.wawacity.mom',
        'https://www.wawacity.lat',
        'https://www.wawacity.blog',
        'https://www.wawacity.food',
        'https://www.wawacity.tips',
        'https://www.wawacity.gratis',
        'https://www.wawacity.digital',
        'https://www.wawacity.bike',
        'https://www.wawacity.beer',
        'https://www.wawacity.rodeo',
        'https://www.wawacity.pet',
        'https://www.wawacity.pictures',
        'https://www.wawacity.futbol',
        'https://www.wawacity.cv',
        'https://www.wawacity.lifestyle',
        'https://www.wawacity.zone',
        'https://www.wawacity.shop',
        'https://www.wawacity.motorcycles',
        'https://www.wawacity.diy',
        'https://www.wawacity.energy',
        'https://www.wawacity.town',
        'https://www.wawacity.surf',
        'https://www.wawacity.irish'
    ];
    var urlOrigin = null;
 
    //console.log('_host', _host);
 
    if ( _host == 'dl-protect' || _host == 'wawacity' )
    {
        _intervalPopup = setInterval(function(){
            deletePopup();
        }, 10);
    }
    if (_host == 'wawacity' )
    {
        _intervalDiv = setInterval(function(){
            deleteDiv();
        }, 1000);

        _intervalAds = setInterval(function(){
            deleteAds();
        }, 1000);
    }
 
    function deleteDiv()
    {
        //console.log('deleteDiv()', _deleteDivCompte);

        const body = document.body;
        const events = ['click', 'mousedown', 'mouseup', 'keydown', 'keyup', 'mousemove', 'mouseenter', 'mouseleave'];
        events.forEach((event) => {
            body.removeEventListener(event, body[event]);
        });

        if ( document.querySelector('div[id="dontfoid"]') != null )
        {
            //console.log('deleteDiv() => found => delete')
            document.querySelector('div[id="dontfoid"]')?.remove();
            document.querySelector('#iframe-manager')?.remove();
            document.querySelector('#alert-manager')?.remove();
            document.querySelector('iframe')?.remove();
            clearInterval(_intervalPopup);
        }

        if ( _deleteDivCompte > 300 )
        {
            clearInterval(_intervalDiv);
        }

        _deleteDivCompte++;
    }

    function deletePopup()
    {
        // console.log('deletePopup()');
 
        const body = document.body;
        const events = ['click', 'mousedown', 'mouseup', 'keydown', 'keyup', 'mousemove', 'mouseenter', 'mouseleave'];
        events.forEach((event) => {
            body.removeEventListener(event, body[event]);
        });
 
        // console.log('deletePopup() a[dontfo] null : ', (document.querySelector('a[dontfo]') == null))
        if ( document.querySelector('a[dontfo]') != null )
        {
            // console.log('deletePopup() delete')
            document.querySelector('a[dontfo]')?.remove();
            document.querySelector('a[donto]')?.remove();
            document.querySelector('iframe:not([src]')?.nextElementSibling?.remove();
            document.querySelector('iframe:not([src]')?.remove();
            clearInterval(_intervalPopup);
        }
 
        if ( _deletePopupCompte > 300 )
        {
            clearInterval(_intervalPopup);
        }
 
        _deletePopupCompte++;
    }

    function deleteAds()
    {
        var count = document.querySelectorAll('iframe').length;
        if ( count > 0 )
        {
            document.querySelectorAll('iframe').forEach(item => item.remove());
            clearInterval(_intervalAds);
        }
    }
 
    function createButton(item, i)
    {
        if ( item.querySelector('span.fa-star') != null )
        {
            return false;
        }
 
        var tds = item.parentElement.parentElement.querySelectorAll('td');
 
        var _host = '';
        if ( typeof( tds[1] ) != 'undefined' )
        {
            _host = tds[1].innerText;
        }
 
        item.style.width = 'auto';
        var button = document.createElement("button");
        button.setAttribute('type', 'button');
        button.setAttribute('style',
            'background-color: rgb(37 99 235);'
            +'color: white;'
            +'border: 0px;'
            +'padding: 4px 8px;'
            +'margin-left: 6px;'
            +'border-radius: 6px;'
        );
        button.setAttribute('class', 'btn-iframe-manager-add');
        button.setAttribute('id', 'btn-iframe-manager-add-' + _i);
        button.setAttribute('data-i', _i);
        button.setAttribute('data-href', item.getAttribute('href'));
        button.append('Récupérer l\'URL : ' + _host)
        item.after(button);
        // item.append('<button type="button">URL</button>');
    }
 
    if ( _host == 'dl-protect' )
    {
        compte = 0;
        _interval = setInterval(function(){
 
            if ( compte > 6 )
            {
                // debugger;
            }
 
            var button = document.querySelector('button[type="submit"]');
 
            if ( ! button )
            {
                clearInterval( _interval );
 
                var texte = document.querySelector('#protected-container').querySelector('h3')?.innerText
                var url = document.querySelector('#protected-container').querySelector('.urls').querySelector('a').getAttribute('href');
 
                // console.log('dl-protect-auto result', texte, url);
 
                for (var i in postUrls) {
                    parent.window.postMessage({
                        href: window.location.href,
                        url: url
                    }, postUrls[i]);
                }
            }
            else if ( ! button.hasAttribute('disabled') )
            {
                // clearInterval( _interval );
                setTimeout(function(){
                    button.click();
                    // console.log('dl-protect-auto end');
                }, 100);
 
            }
            else
            {
                // console.log('dl-protect-auto waiting...');
            }
 
            compte++;
        }, 1000);
 
        window.addEventListener("message", receiveMessage2, false);
 
        function receiveMessage2(event)
        {
            // console.log('event data', _host, event.origin, event.data, event);
 
        }
    }
    else if ( _host == 'wawacity' )
    {
        var iframeManager = document.createElement('div');
        iframeManager.setAttribute('id', 'iframe-manager');
        iframeManager.setAttribute('style', 'position:fixed;right:10px;bottom:10px;'); //width:10px;height:10px;background-color:red');
 
        document.querySelector('body').append( iframeManager );
 
        var alertManager = document.createElement('div');
        alertManager.setAttribute('id', 'alert-manager');
        alertManager.setAttribute('style', 'position:fixed;right:10px;top:10px;'); //width:10px;height:10px;background-color:red');
 
        document.querySelector('body').append( alertManager );
 
        // console.log('add button');
        var _i = 1;
        // document.querySelectorAll('a[href*="dl-protect"]').forEach( item => {
        /*
        document.querySelector('#streamLinkѕ')?.querySelectorAll('a[href*="dl-protect"]').forEach( item => {
            createButton(item, _i++);
        });
        document.querySelector('#DDLLinkѕ')?.querySelectorAll('a[href*="dl-protect"]').forEach( item => {
            createButton(item, _i++);
        });
        */
        document.querySelectorAll('a[href*="dl-protect"]')?.forEach( item => {
            createButton(item, _i++);
        });
 
        document.addEventListener('click', (event) => {
            if (event.target.closest('.btn-iframe-manager-add'))
            {
                // console.log('click', event.target, event);
                // console.log('click', event.target.getAttribute('data-href'));
                event.target.innerText = 'Récupération en cours...';
                var _url = event.target.getAttribute('data-href');
                var __i = event.target.getAttribute('data-i');
                var tempo = _url.split('/');
                urlOrigin = tempo[0] + '//' + tempo[2];
 
                var _div = document.createElement('div');
                _div.setAttribute('id', 'iframe-div-' + __i);
                _div.setAttribute('style', 'position:fixed;right:10px;bottom:10px;width:500px;height:500px;');
 
                var _button = document.createElement('button');
                _button.setAttribute('type', 'button');
                _button.setAttribute('onclick', 'javascript:document.querySelector("#'+'iframe-div-' + __i+'").remove()');
 
                _button.append('Fermer');
                _div.append( _button );
 
                var _iframe = document.createElement('iframe');
                _iframe.setAttribute('id', 'iframe-url-' + __i);
                _iframe.setAttribute('src', _url);
                _iframe.setAttribute('style', 'width:100%;height:480px;background-color:red;border:1px #000000 solid;box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);');
 
                _div.append( _iframe );
                document.querySelector('body').append( _div );
                // debugger;
            }
        });
 
        document.addEventListener('click', (event) => {
            if (event.target.closest('.btn-copy-clipboard'))
            {
                var _url = event.target.getAttribute('data-href');
                navigator.clipboard.writeText(_url).then(() => {
                    // alert("Copied text to keyboard");
                    var _div = document.createElement('div');
                    // _div.setAttribute('id', 'iframe-manager');
                    _div.setAttribute('style', 'border: 1px black solid; border-radius: 4px;background-color:white;color:black; padding:6px;margin:6px;');
                    _div.append('URL copier');
 
                    document.querySelector('#alert-manager').append( _div );
 
                    setTimeout(function(){
                        _div.remove();
                    }, 3000);
                });
            }
        });
 
 
        window.addEventListener("message", receiveMessage, false);
 
        function receiveMessage(event)
        {
            // console.log('event data', _host, event.origin, event.data, event);
            // console.log('event if', !(event.origin !== urlOrigin), event.origin,urlOrigin)
            if (event.origin !== urlOrigin)
                return;
 
            // console.log('message', event.data);
 
            var button = document.createElement('button');
            button.setAttribute('type', 'button');
            button.setAttribute('class', 'btn-copy-clipboard');
            button.setAttribute('data-href', event.data.url);
            button.setAttribute('style',
                'background-color: rgb(22 163 74);'
                +'color: white;'
                +'border: 0px;'
                +'padding: 4px 8px;'
                +'margin-left: 6px;'
                +'border-radius: 6px;'
            );
            button.append('Copier l\'URL');
 
            var __i = document.querySelector('button[data-href="'+event.data.href+'"]').getAttribute('data-i');
            document.querySelector('#iframe-div-' + __i).remove();
            document.querySelector('a[href="'+event.data.href+'"]').innerHTML += ' >>> ' + event.data.url;
            document.querySelector('a[href="'+event.data.href+'"]').style.color = 'green';
            document.querySelector('a[href="'+event.data.href+'"]').after(button);
            document.querySelector('a[href="'+event.data.href+'"]').setAttribute('href', event.data.url);
            document.querySelector('button[data-href="'+event.data.href+'"]').remove();
        }
 
 
    }
    else if ( _host == 'cloudflare' )
    {
        compte = 0;
        _interval = setInterval(function(){
 
            // console.log('open-iframe interval cloudflare');
 
            if ( compte > 6 )
            {
                // debugger;
            }
 
            var labelCheckbox = document.querySelector('.ctp-checkbox-label');
            if ( labelCheckbox )
            {
                // debugger;
                // document.querySelector('input[type="checkbox"]').click();
                var checkbox = document.querySelector('input[type="checkbox"]');
 
                for (var i in postUrls) {
                    // debugger;
                    console.log(_host, 'postMessage');
                    parent.window.postMessage({
                        alert: 'checkbox'
                    }, postUrls[i]);
                }
 
 
                //checkbox.click();
 
            }
 
            compte++;
        }, 1000);
 
    }
 
})();
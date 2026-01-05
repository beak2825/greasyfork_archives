// ==UserScript==
// @name         Kinopoisk to Moonwalk
// @description  Добавляет ссылки для просмотра фильмов в кинопоиске
// @version      0.9.4
// @author       Vinkoy
// @match        http://moonwalk.pw/moonwalk/*
// @match        https://*.kinopoisk.ru/film/*
// @match        https://*.kinopoisk.ru/mykp/*
// @match        https://*.kinopoisk.ru/recommend/*
// @match        https://*.kinopoisk.ru/top/*
// @match        https://*.kinopoisk.ru/popular/*
// @namespace    https://greasyfork.org/en/scripts/26417-kinopoisk-to-moonwalk
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26417/Kinopoisk%20to%20Moonwalk.user.js
// @updateURL https://update.greasyfork.org/scripts/26417/Kinopoisk%20to%20Moonwalk.meta.js
// ==/UserScript==
// http://www.w3schools.com/code/tryit.asp?filename=FBO57DIOOGB6
(
    function ()
{
    'use strict';

    function addStyles()
    {
        var btnStyle = document.createElement('style');
        btnStyle.type = 'text/css';
        btnStyle.innerHTML = '.button, .stat .button, .tenItems .name a.button, .dropper .info a.button {'+
            'display: inline-block;'+
            'height: auto;'+
            'line-height: 20px;'+
            'padding: 0 5px;'+
            'color: #fff;'+
            'text-transform: uppercase;'+
            'border-radius: 4px;'+
            'border: 1px solid #bbb;'+
            'cursor: pointer;'+
            'box-sizing: border-box;'+
            '}';

        var tblStyle = document.createElement('style');
        tblStyle.type = 'text/css';
        tblStyle.innerHTML = '.tip td, .mediaTable td, .ten_items .active .tip td {'+
            'background-color: #FF4E00;'+
            'color: #fff;'+
            'line-height: auto;'+
            'border-bottom: 1px solid rgba(225, 225, 225, 0.5);'+
            '}';

        var divStyle = document.createElement('style');
        divStyle.type = 'text/css';
        divStyle.innerHTML = '.mediaTable{'+
            'background-color: #FF4E00;'+
            'border-radius: 3px;'+
            'color: #fff;'+
            'display: block;'+
            'font: 13px Tahoma, Arial, sans-serif;'+
            'text-align: center;'+
            'text-decoration: none;'+
            'left: inherit;'+
            'height: auto;'+
            'width: auto;'+
            'opacity:0.9;'+
            '}';

        var topStyle = document.createElement('style');
        topStyle.type = 'text/css';
        topStyle.innerHTML = '.mediaTop{'+
            'right: 10px;'+
            'top: 10px;'+
            'position: fixed;'+
            '}';

        var mediaBtnStyle = document.createElement('style');
        mediaBtnStyle.type = 'text/css';
        mediaBtnStyle.innerHTML = '.mediaBtn {'+
            'background-color: #FF4E00;'+
            'border-radius: 3px;'+
            'color: #fff;'+
            'display: inline-block;'+
            'padding: 3px 7px 3px 7px;'+
            'position: relative;'+
            'text-decoration: none;'+
            'cursor: pointer;'+
            'opacity:0.9;'+
           // 'z-index: 9997;'+
            '}';

        var iconStyle = document.createElement('style');
        iconStyle.type = 'text/css';
        iconStyle.innerHTML = '.stat .icon:hover, .stat .icon, .icon, .tenItems .name a.icon, .dropper .info a.icon {'+
            'background-color: transparent;'+
            'display: inline-block;'+
            'height: auto;'+
            'text-transform: uppercase;'+
            'text-decoration: none;'+
            'cursor: pointer;'+
            'box-sizing: border-box;'+
            'font-size: medium;'+
            'color: #FF4E00;'+
            'margin-left: 5px;'+
            'vertical-align: middle;'+
            '}';

        var tipStyle = document.createElement('style');
        tipStyle.type = 'text/css';
        tipStyle.innerHTML = '.tip {'+
            'display: none;'+
            'position: absolute;'+
            'right:-100%;'+
            'background-color: #FF4E00;'+
            'border-radius: 3px;'+
            'color: #fff;'+
            'font: 13px Tahoma, Arial, sans-serif;'+
            'text-align: center;'+
            'text-decoration: none;'+
            'left: inherit;'+
            'height: auto;'+
            'width: auto;'+
           // 'z-index: 9998;'+
            '}';

        var focusStyle = document.createElement('style');
        focusStyle.type = 'text/css';
        focusStyle.innerHTML = 'a.mediaBtn:hover .tip {'+
            'display:block;'+
            '}';

        var hoverStyle = document.createElement('style');
        hoverStyle.type = 'text/css';
        hoverStyle.innerHTML = 'a.mediaBtn:hover {'+
            'z-index: 9997;'+
            'color: #fff;'+
            'text-decoration: none;'+
            '}';

        document.getElementsByTagName('head')[0].appendChild(btnStyle);
        document.getElementsByTagName('head')[0].appendChild(tblStyle);
        document.getElementsByTagName('head')[0].appendChild(divStyle);
        document.getElementsByTagName('head')[0].appendChild(mediaBtnStyle);
        document.getElementsByTagName('head')[0].appendChild(tipStyle);
        document.getElementsByTagName('head')[0].appendChild(topStyle);
        document.getElementsByTagName('head')[0].appendChild(focusStyle);
        document.getElementsByTagName('head')[0].appendChild(hoverStyle);
        document.getElementsByTagName('head')[0].appendChild(iconStyle);
    }

    function httpGet(theUrl)
    {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
        xmlHttp.send( null );
        return xmlHttp.responseText;
    }

    function httpGetAsync(theUrl,kp_id)
    {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var tbl = document.getElementById('play_'+kp_id).innerHTML;
                tbl = tbl.replace('</tbody></table>', '');
                tbl += this.responseText.replace(/i.noughth.ru/g, 'nullrefer.com')
                                        .replace(/moonwalk.cc/g, 'moonwalk.pw')
                                        + '</tbody></table>';
                document.getElementById('play_'+kp_id).innerHTML = tbl;
            }
        };
        xhttp.open("GET", theUrl, true);
        xhttp.send();
    }

    function getTable(kp_id)
    {
        var tbl = '<table><tbody>';
        tbl += httpGet('https://noughth.ru/API/moonwalk.php?ID='+kp_id);
        tbl += httpGet('https://noughth.ru/API/hdgo.php?ID='+kp_id);
        tbl += httpGet('https://noughth.ru/API/kodik.php?ID='+kp_id);
        tbl += httpGet('https://noughth.ru/API/videoframe.php?ID='+kp_id);
        tbl +='</tbody></table>';

        tbl = tbl.replace(/i.noughth.ru/g, 'nullrefer.com');
        tbl = tbl.replace(/moonwalk.cc/g, 'moonwalk.pw');

        return tbl;
    }

    function getContent() {
        var kp_id = this.id.toString().match(/\d+/)[0];
        if ( document.getElementById('btn_'+kp_id).innerHTML.indexOf('table') === -1)
        {
            document.getElementById('play_'+kp_id).innerHTML = '<table><tbody>';
            httpGetAsync('https://noughth.ru/API/moonwalk.php?ID='+kp_id,kp_id);
            httpGetAsync('https://noughth.ru/API/hdgo.php?ID='+kp_id,kp_id);
            httpGetAsync('https://noughth.ru/API/kodik.php?ID='+kp_id,kp_id);
            httpGetAsync('https://noughth.ru/API/videoframe.php?ID='+kp_id,kp_id);
        }
    }

    if (window.location.hostname.indexOf('kinopoisk.ru') !== -1)
    {
        addStyles();

        var kp_id = 0;
        var i = 0;
        var playBtn;
        var style = 'display: inline;padding: 3px; margin-right: 5px; opacity: 0.8;';

        if (window.location.pathname.indexOf('film') !== -1)
        {
            kp_id = window.location.pathname.toString().match(/\d+/)[0];
            var popup = '<a class="mediaBtn mediaTop" tabindex="1">Смотреть онлайн'+
                        '<div class="tip" style=" right: 0;">'+
                        getTable(kp_id)+
                        '</div></a>';
            $('#top').append(popup);
        }
        else if (window.location.pathname.indexOf('mykp') !== -1)
        {
            var li = document.getElementById("itemList").getElementsByTagName("li");
            for (i = 0; i < li.length; i++)
            {
                if (li[i].id.indexOf('film') === 0)
                {
                    kp_id = li[i].id.toString().match(/\d+/)[0];
                    playBtn = document.createElement('a');
                    playBtn.setAttribute('id', 'btn_'+kp_id);
                    playBtn.setAttribute('class', 'mediaBtn icon');
                    playBtn.setAttribute('tabindex', '1');
                    playBtn.onmouseover = getContent;
                    playBtn.innerHTML = '?<div class="tip" id="play_'+kp_id+'">Загрузка данных...</div>';
                    li[i].firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.insertBefore(playBtn, li[i].firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.nextElementSibling);
                    //li[i].appendChild(playBtn);
                }
            }
        }
        else if (window.location.pathname.indexOf('recommend') !== -1)
        {
            var divs = document.querySelectorAll('[id^=tr_]');
            for (i = 0; i < divs.length; i++)
            {
                if (divs[i].id.indexOf('tr_') === 0)
                {
                    kp_id = divs[i].id.toString().match(/\d+/)[0];

                    playBtn = document.createElement('a');
                    playBtn.setAttribute('id', 'btn_'+kp_id);
                    playBtn.setAttribute('class', 'mediaBtn icon');
                    playBtn.setAttribute('tabindex', '1');
                    playBtn.onmouseover = getContent;
                    playBtn.innerHTML = '?<div class="tip" id="play_'+kp_id+'">Загрузка данных...</div>';
                    divs[i].firstElementChild.nextElementSibling.firstElementChild.insertBefore(playBtn, divs[i].firstElementChild.nextElementSibling.firstElementChild.firstElementChild.nextElementSibling);
                }
            }
        }
        else if (window.location.pathname.indexOf('top') !== -1)
        {
            var tr = document.getElementById("itemList").getElementsByTagName("tr");

            for (i = 0; i < tr.length; i++)
            {
                if (tr[i].id.indexOf('tr_') === 0)
                {
                    kp_id = tr[i].id.toString().match(/\d+/)[0];
                    var td = tr[i].getElementsByTagName('td')[1];
                    playBtn = document.createElement('a');
                    playBtn.setAttribute('id', 'btn_'+kp_id);
                    playBtn.setAttribute('class', 'mediaBtn icon');
                    playBtn.setAttribute('tabindex', '1');
                    playBtn.onmouseover = getContent;
                    playBtn.innerHTML = '?<div class="tip" id="play_'+kp_id+'">Загрузка данных...</div>';
                    td.firstElementChild.insertBefore(playBtn, td.firstElementChild.firstElementChild.nextElementSibling);
                }
            }
        }
        else if (window.location.pathname.indexOf('popular') !== -1)
        {
            var divs = document.querySelectorAll('[id^=obj]');
            for (i = 0; i < divs.length; i++)
            {
                if (divs[i].id.indexOf('obj') === 0)
                {
                    kp_id = divs[i].id.toString().match(/\d+/)[0];

                    playBtn = document.createElement('a');
                    playBtn.setAttribute('id', 'btn_'+kp_id);
                    playBtn.setAttribute('class', 'mediaBtn icon');
                    playBtn.setAttribute('tabindex', '1');
                    playBtn.onmouseover = getContent;
                    playBtn.innerHTML = '?<div class="tip" id="play_'+kp_id+'">Загрузка данных...</div>';
                    divs[i].insertBefore(playBtn, divs[i].firstElementChild.nextElementSibling.nextElementSibling);
                }
            }
        }
    }

    if (window.location.hostname.indexOf('moonwalk') !== -1)
    {
        document.body.innerHTML = document.body.innerHTML.replace(/document\.getElementById\('code_textarea'\)\.innerHTML='<iframe src=\\/g, 'window.location=');
        document.body.innerHTML = document.body.innerHTML.replace(/\\' frameborder.*?<\/iframe>/g, '');
        document.body.innerHTML = document.body.innerHTML.replace(/Получить код/g, 'Смотреть');
    }

}
)();

// ==UserScript==
// @name        myshows.me+
// @description Добавляет ссылки на сайты под постер сериала на сайте myshows.me
// @include     https://myshows.me/view/*
// @version     1.1.05
// @namespace https://greasyfork.org/users/9344
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/34801/myshowsme%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/34801/myshowsme%2B.meta.js
// ==/UserScript==
var ru2en = {
    ru_str: "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя",
    en_str: ["A", "B", "V", "G", "D", "E", "YO", "ZH", "Z", "I", "Y", "K", "L", "M", "N", "O", "P", "R", "S", "T", "U", "F", "KH", "TS", "CH", "SH", "SHCH", "", "Y", "", "E", "YU", "YA", "a", "b", "v", "g", "d", "e", "yo", "zh", "z", "i", "y", "k", "l", "m", "n", "o", "p", "r", "s", "t", "u", "f", "kh", "ts", "ch", "sh", "shch", "", "y", "", "e", "yu", "ya"],
    translit: function (j) {
        var g = "";
        for (var l = 0, h = j.length; l < h; l++) {
            var k = j.charAt(l),
                i = this.ru_str.indexOf(k);
            if (i >= 0) {
                g += this.en_str[i]
            } else {
                g += k
            }
        }
        return g
    }
};
$(document).ready(function () {
   
    //var imgs = "https://plus.google.com/_/favicon?domain=";
    var movie_eng = $(".subHeader");
      if (movie_eng.text() !== "") {
        var movie = movie_eng.text();
    } else {
        var movie_russ = $("[itemprop='name']");
        var newLbl = $(movie_russ[0].outerHTML);
        $("span", newLbl).remove();
        movie = newLbl.text()
    }
    var movie_rus = $("h1[itemprop='name']").text();
    var movie_idd = document.URL.substr(30);
    var movie_id = movie_idd.slice(0,-1);
    var movie_enc = encodeURIComponent(movie);
    var movie_imdb = ru2en.translit(movie);
    //var year = $(".info a").html();

    var link1 = '<a target="_blank" title="Кинопоиск" href="https://www.kinopoisk.ru/index.php?kp_query=' + movie_enc + '&first=no&what="><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABuVBMVEUAAAD/lwD/lQD/lQD/lgD/lwD/mQD/mQD/mQD/qgD/jwD/jwD/lwD/mQD/iwD/jQD/jgD/kgD/kQD/lwD/hwD/jAD/kgD/jgD/lAD/hgD/ggD/hwD/iwD/jQD/kQD/kQD/kQD/kQD/gAD/hAD/hwD/hwD/iQD/lgD/kAD/jwD/fQD/gQD/ggD/hwD/jQD/jAD/eQD/fQD/fQD/gwD/gQD/hAD/iAD/igD/dgD/eAD/fQD/gAD/gwD/gwD/iAD/cgD/dgD/egD/fgD/fgD/gwD/cQD/dAD/eAD/eAD/ewD/fAD/gAD/cQD/bwD/bwD/cQD/cQD/cwD/dAD/fAD/fQD/gAD/bQD/cgD/eAD/eQD/gAD/aQD/cQD/cgD/cgD/dQD/aAD/aQD/cQD/cgD/ZgD/ZgD/ZwD/aAD/agD/bAD/bAD/bgD/kAD/kQD/kgD/kwD/lAD/lgD/iwD/lQD/hwD/iAD/jwD/hAD/hQD/jAD/gAD/gQD/ggD/jgD/fQD/fgD/fwD/egD/ewD/gwD/iQD/dwD/dAD/cQD/cwD/eQD/bAD/bQD/bwD/eAD/agD/awD/bgD/aQD///+JCXKcAAAAbHRSTlMALJDT9vLUkSgGlP39k73oVjiwvZNfB+2UKP1I3sFIX+j9ksERaPcRV5DU9+npONPz7d5KS2iw9vawaEre7fLUOOrp99SQVhH3aMGRLf3oX0jB3kj9KJTtYJMGvbA46L2T/f2UKJHU8vbTkCyUZzCUAAAAAWJLR0SSlgTvIAAAAAd0SU1FB+IKFQgDAJ8RrV4AAAD7SURBVBjTY2AAAkYmZhZWNnYOBgjg5OLOyc3LLyjk4eUE8/mK+AUEhXJz8wuKhUEiIiWlogwMYuJlZTl5+RIMDJJS5RXSQHGZSlk5eQVFRgalquoaZRUG1VI1dQYGjVpNBq26+oYqbZ3ycl2gMr0ifQaDxiZDo4YGY5NmUwYxsxZzBotWSzEGqzprk6pqG9vyCjsG+zYHoFrHpiYn53qgcS4Mru1uDAzuHq2eDCpeQOO8GXx8/fwDAjuCgMqCO5tCQhkYwrq6e3raw8UYGCJaeyOB4lHRff1d3RNiYt3i2uKjQJ6JSkicCBLqSUqOgvo3JTUtPSMzKxvEBgDprT/4ZNXtjAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOC0xMC0yMVQwODowMzowMCswMDowMG09K7EAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTgtMTAtMjFUMDg6MDM6MDArMDA6MDAcYJMNAAAAAElFTkSuQmCC" alt="" /></a>';
    var link2 = '<a target="_blank" title="imdb" href="http://www.imdb.com/find?ref_=nv_sr_fn&q=' + movie_enc + '&s=all"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAbFBMVEUAAAC6pB303yPx3CPu1yPq0yPmziPiyCPfxSPcwCN4bREAAACplBoQDgKUgxczLAjXvSLCrh5tYBF0aREjHwVYTA5qWxFbUA6RfxeulB1xZBGhixq5oh4OCwLUtiPRsyLNrSLGpCKLexb////Ksr8hAAAAAXRSTlMAQObYZgAAAAFiS0dEIypibDoAAAAHdElNRQfiChUIBzIzqjnaAAAAiElEQVQY013N2xKDIAwE0KCi0tWSWnqxFxX+/yOb0OnYYfO0JzAhKmOKkKmqqq6bxtq2bbtOQeuv94b+133vHB0wYLTAEfAMxxlwUhgwgZnO+iKMAk7g4jMEGYWrTIabzB0sdQY98t9J4LnDKyjAz3iD9DbzsizrukkipW9fc48xUdrXMWYo8gGzOg53c+2idAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOC0xMC0yMVQwODowNzo1MCswMDowMCw2ha8AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTgtMTAtMjFUMDg6MDc6NTArMDA6MDBdaz0TAAAAAElFTkSuQmCC" alt="" /></a>';
    var link3 = '<a target="_blank" title="Google" href="https://www.google.com/search?q=' + movie_enc +'"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABF1BMVEUAAAD+/v79/f39/f39/f39/f39/f3////////9/f3+/v79/f39/f39/f39/f39/f39/f39/f3+/v79/f39/f3////////++fn2rKXuaV3rSjzqRzruZlr1qaL96ujuY1jqQzXwdmztYlbrSTv0nJX60s/61NH0nZbtXlL84+H7z5LsUjfqRjj61ND//f38yTX5sgr2pGv7vgv7vAX+7LZChfR7qvf7vQr+67V1pvfxxCztvBGw0Y2CrviNtfjN1olIqks4qlbO6tXY5v1Gh/TD2Pz5/PpXt3E0qFM6qliR0KLM6dTO6tab1KpKo5lBhvBnnfb+/v/p9exYt3FYr47o8P75/fqn2bRdunY6q1hZuHKd1az2+/iLqKv8AAAAFnRSTlMAMpnb+tqYMAqdCcPBltj515Qulb8IZS4q4gAAAAFiS0dEBxZhiOsAAAAHdElNRQfiChUIChhdv45BAAAAzklEQVQY0z2P6VaCUBSFj4AQqOC4scksNc3ULKXS0kZNnIfMzN7/ObwXwe/HWWfvdUYihk8QJckvK7TjQIWLoDk6ADN5eHR8cmoiyB0VqbO0wzkgs36YF+lMNneZL1yxLoUEFK9LZT6hwkOIRNxUb7FHJwl3tTrLLM49DGY81B49o8EMP5pPz7vyltVGmGS8vL69c/3xaXUQIQXdr57dHwxH48l0hiixvfNFz+F7iRi7VAviZ/W7tv82/4gn+DOa4B0RS7j/KiHdMMKRKM+3iM0dkCi5l1MAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMTAtMjFUMDg6MTA6MjQrMDA6MDDx7mwcAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTEwLTIxVDA4OjEwOjI0KzAwOjAwgLPUoAAAAABJRU5ErkJggg==" alt="" /></a>';
    var link4 = '<a target="_blank" title="Yandex" href="http://yandex.ua/yandsearch?text=' + movie + '"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABblBMVEX////+/v79/f37+/vQ0NDLy8vHx8fExMTBwcEAAAAAAAAAAAAAAAAAAAD39/e1tbUAAAAAAAD5+fk+Pj4AAAAAAADc3NwAAAAAAACTk5MAAAAAAADw8PAXFxcAAAAAAADIyMgAAAAAAADv7+8AAAAAAADg4OAAAAAAAACoqKgAAAAAAADJyckPDw8AAAAAAABlZWUAAACkpKQAAAAAAAC+vr4eHh4AAAAAAAC6urpubm4AAAAAAAAAAAD////+/v79/f39+Pb+pIz/d1P/aUH/c077+/v9o5H+blD8yb/9rZz/Y0P5+fn+VD77sqj7uK//TDT29vb/LB35t7L5raj+MyXx8fH8OjX5b2z2op/+HRji4uLqqKj+Cwv2QkL3Ojr9DQ3Z2dnlhYX2CgrvODj1DQ3U1NTWxcXqFBTfcHDciYnrDAzQ0NDZTk7dHR3Qy8vVh4feDAzLy8vNlJTUAADOj4/Og4PTDAzHx8fExMR+kSbCAAAAPnRSTlMAAAAAAAAAAAAVKC4bKeJyFzLpPgk1rB84Zxk840EGQKMkRPtCSPtGS6YqT+RTB1N7V7ozWu5kEFHqkC0sXx3+2W0AAAABYktHRACIBR1IAAAAB3RJTUUH4goVCAwcDIjt3gAAANZJREFUGNNj4OTihgEeBhDg5bODAX4BkICgPRwICYswMjKIOjg4ODo5u7gCaTFxJiYGCTc3N3cPTy9vIO0mKcXMIO3j4+Pr5+MfAKR9ZGTlGOQDAwODggNDQgNBQEGRQSksLCw8IiwyKgwElFUYVKOjo2Ni4+ITokFATZ1BIxEIkpJTUkF0oqYWg3ZaWlp6RmZWNpBO09HVY9DPycnJzcsvKATSOQaKLAyGRUXFJaVFZeVFRUVGxqysDCYVcGBqZs7GxmBhWQkDVtbs7OwMNvq2MCDBAQQAuehCtCbCV/AAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMTAtMjFUMDg6MTI6MjgrMDA6MDAyu9ZVAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTEwLTIxVDA4OjEyOjI4KzAwOjAwQ+Zu6QAAAABJRU5ErkJggg==" alt="" /></a>';
    var link5 = '<a target="_blank" title="lostfilm" href="https://www.lostfilm.tv/search/?q=' + movie_enc + '"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACT1BMVEX/OSj/OSj/OSj/OSj/OSj/OSj/OSj/OSj/OSj/OSj/OSj/OSj/OSj/OSj/OSj/OSj/OSj/OSj/OSj/OSj/OSj/OSj/OSj/OSj/OSj/OCb/Nyb/OSj/OSj/OSj/OSj/OCf/Nyb/Nyb/Nyb/Nyb/OSj/Oyr/Vkj/YFP/QjL/OSj/OSj/OSj/Szv/YVT/Y1b/ZFf/W03/PCz/OSj/OCf/QTH/urX/5eP/YFL/Nyb/OSj/OSj/cWX/2NT/8/L/7u3/8O7/ycT/Rzf/OCf/OCf/QjL/xcH/9PP/Y1b/Nyb/OCf/Rjb/0Mz/+fn/sKn/ioD/ioD/eW3/Py//OCf/OCf/QjL/xcD/8/L/Y1b/Nyb/Nyb/W03/7+7/1NH/VUb/RDT/RTX/QzP/Oin/OSj/OCf/QjL/xcD/8/L/Y1b/Nyb/Nyb/Y1b/8fD/9PT/29j/2tf/29j/ubP/RTb/OCf/OCf/QjL/xcD/8/L/Y1X/NyX/Nyb/Y1b/8fD/6ef/trD/sqz/tK3/mpH/QjL/OCf/OCf/Pi3/uLL/+fn/eW3/OSn/NCL/YVT/8/L/xcH/RTX/Oyr/PCv/Oyv/OSj/OSj/OSj/Nyb/kon/////3tz/sar/n5f/lYz/8vH/xcH/QjL/OCf/OSj/OSj/OSj/OSj/OSj/OCf/T0D/qaL/3tz/7ev/7+3/uLP/29j/tbD/QTH/OCf/OSj/OCf/PSz/Sjv/Tz//T0D/SDn/TT7/SDn/Oin/OSj/OSj/OSj/OCf/OCb/OCb/OCf/OCf/OCf/OSj/OSj///8WuxzRAAAAGHRSTlOd9f/3//////////////f////3n/b/9qAYVZ1sAAAAAWJLR0TEFAwb4QAAAAd0SU1FB+ELBAsRBcaY/L8AAAD6SURBVBjTY2BgZJKAAyZGBgZmFlaEACsLMwMbu6SUtIyErJy8gqKSMgcng4qqmrqGtKaWto6unr6BoRGDsYmpmbmFpZW1ja2dvYOjE4Ozi6ubu4enl7ePr59/QGAQQ3BIaFh4RGRUdExsXHxCYhJDckpqWnpGZlZ2Tm5efkFhEUNxSWlZeUVlVXVNbV19Q2MTQ3NLa1t7R2dXd09vX/+EiZMYJk+ZOm36jJmzZs+ZO2/+goWLGBYvWbps+YqVq1avWbsO5FgGifUbNm7avGXrtu07doIFuLh37d6zd9/+AwcPHZaQ4OFl4OMXQHhOQFCIQVhEFCEgKiYOAODxT764Dw6eAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTExLTA0VDEwOjE3OjA1KzAxOjAwLc37GwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0xMS0wNFQxMDoxNzowNSswMTowMFyQQ6cAAAAASUVORK5CYII=" alt="" /></a>';
    var link6 = '<a target="_blank" title="hdrezka" href="http://hdrezka.ag/index.php?do=search&subaction=search&q='+movie+'"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfiChUIEB4E8dGvAAABNklEQVQoz7WRvUqCYQCFny/flFRCBxF/Kk0oyhwE+1+KoikaWoKWIhya6goagkho6Q6CCAoJoqUGbWhRB4dAM0OhgpCKkK8oM0V6GzLwBjzzczjncKDpUq5n0+Nd2dFDNJcrz53DZ0Vbxg+g/+hPe6NKhf2wS24kpFFa1rM9MhraObdIp3RKp5woHYWkTpRRKbUAvCkqFeVT+WLx1pN48B4M7a36YgKgaokHoWr8SxV0x9aCsu8peuFIzwiAsDuyCy9oG9s92gpVR9ElAMbUgRTEBjP6BkD73QqiLAA8+a15DMvRTG99mgL3/rzbjC0l6nwVzb+1Rm4ydLzpi5vmCoGIaMOK4QfAJK3opFGaOXULN0yrS9uOpHI3lR6x5wIniMTCa0cgolpvfADt776k/UqpNf8rfgEGgGhJg3ifMQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOC0xMC0yMVQwODoxNjozMCswMDowMMQVONYAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTgtMTAtMjFUMDg6MTY6MzArMDA6MDC1SIBqAAAAAElFTkSuQmCC" alt="" /></a>';
    var link7 = '<a target="_blank" title="filmix.me" href="https://filmix.me/search/' + movie_enc + '"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABTVBMVEXyZznyZznyZznyZznyZznxZznyZznyZjjxZDbwYzTxZTfxZjjvckjynH/1sJn1sZr1spzxi2nwZTftcUj0yLr8+vn+///////ur5rsYjTvZDXrmHz59vb6+/z39fTz6OXz5+T06ufoo4zrYjToqZT2+fr08fDao5DOaUnRaEbTakfgZz/vZTjrYTTlp5Py9ffs4d7YbEnoYDLsYjXuZTfxZznipJHr8PPo3dvge1rtc0vudEzvbULgoo7m6uzm5ebk2dfl2NXl2tjmnYbuYzXdn4vg4+bg4eTh5efh5ejh6OveoY7anInb3+LZ1NTMnpDOl4bOl4fPmYnafV/tZDbXmofV2t7TyMfRZEHcWjDdWzHeXDHnYTTVl4TR1dnRxcPgbEbTloPN0tfOwsHSjnjHwMHKs67ga0TeZT3OZULUZUHoZDnrYzbsZDbwZjjLtgptAAAABnRSTlM+w/vCP/tPniFnAAAAAWJLR0QXC9aYjwAAAAd0SU1FB+IKFQgSOOTKNtAAAADLSURBVBjTY2BgZGJj5+AEAy4mZgYGZjY2bh5ePn4gEBAUYmNmYGLjFhYRFQMBcQlJNiYGNjYpaRlZOXkFBQVFJWU2NqCApIqqmrqGpqamlrYOWEBXT9/A0MgYCExMIQJm5haWVtZAYAMVsLWzd3AEAidnF7CAsqubu4cnEHh5QwxV9vH18w8IDAwMCg6BCISGhUdERkVFRcdwQ6yNjYtPADIhACSQmJSMJMDEZpySmpYOE2ACek4nIzMrG6aAmYGFkdUkJzcPKs/IAgAXqiHq4ExjKgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOC0xMC0yMVQwODoxODo1NiswMDowMH9jNNgAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTgtMTAtMjFUMDg6MTg6NTYrMDA6MDAOPoxkAAAAAElFTkSuQmCC" alt="" /></a>';
    var link8 = '<a target="_blank" title="ikinohd.club" href="http://ikinohd.club/?do=search&subaction=search&titleonly=3&story='+movie +'"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABaFBMVEX////zcTHzcjHzcjHzcjF9fX19fX19fX19fX19fX3zcjHzcjHzcTF6enp7e3t7e3t8fHzzcjHzcjHzcjF4eHh4eHh5eXl5eXl2dnZ2dnZ3d3fnZiXnZiXnZiVzc3Nzc3Nzc3N0dHTlZCPlZCNvb29wcHBwcHBwcHDhYB+mZkZtbW1tbW3eXRyIZlRpaWloaGjaWRhmZmZmZmZlZWXXVhWNXkdkZGRjY2NiYmJhYWHTUhHSUhJhYWFfX19fX19eXl7QTw7QTw5dXV1cXFxcXFzNTAvNTAtZWVlZWVlYWFjKSQjKSQhXV1dXV1dWVlZWVlbIRwbIRwZVVVVUVFRUVFRTU1PGRQTGRQTGRQRSUlJSUlJSUlJSUlLzcjF7e3t5eXl2dnZzc3PlZCNwcHDhYB9tbW3eXRxpaWnaWRiFYlFmZmbXVhViYmLTUhFfX1/QTw5cXFzNTAtZWVnKSQhWVlbIRwZUVFT///96NKxpAAAAXXRSTlMBpd3FDw+95cMTpdMFCbXpKRmvMwOf8TmJ90d5kydx/ftZ00VZ+/1t04n3k9P90wvTze+N070RY/tB00UDtd0R00Uf7Z3TRWP9T9NFA7XnF9NFH++tA6fJN13Jxz1Yd/kdAAAAAWJLR0QAiAUdSAAAAAd0SU1FB+IKFQgWCKZ/w3gAAADJSURBVBjTY2BgZGJmYQACVjZ2dg5OIIMrlpsHSPHyxcXxC4BkBIWEgaSIaHy8mDgDAkgkJEhKQZjSMjKyDHLyiQqKUDmlpCRlFdVkNXWYYo2UFE2t1FRtuG6dtDTd9PR0PX2YgEFGRqahUVaWMUzAJDvb1Mw8J8fCEipglZtrzWBjm5dnZw8RcMjPd2RgcHIuKHCBCLgWFroBKfeiIg9PsIBXcbE3kPLxLSnx8wcJBJSWBoLooOCyspBQICMsPDwCrDQyKio6hgEArI0l1jrFvWgAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMTAtMjFUMDg6MjI6MDgrMDA6MDDpfLcpAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTEwLTIxVDA4OjIyOjA4KzAwOjAwmCEPlQAAAABJRU5ErkJggg=="  alt="" /></a>';
    var link9 = '<a target="_blank" title="forshow.info" href="http://forshow.info/search/comments/?q='+movie+ '"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABs1BMVEUAAAD/5oDzeXn6n6b/gID/5oD/5oD/4oD/4oD/44D/4ID/3oD/3YD/5oD/5oD/5oD/5YD/44D/34D/3oD/4YD/5YD/5oD/5oD/54D/44D/44D/5oD/5oD/5oD/5oD/5YD/4oD/5YD+5H/62H//4oD72YPrqX/0z43+4YT+zab6rqH6oZ39tqX/pKP/hYX2h4n5lJf/o6P/hYX1goT4k5j5jZD9kpL/oKD/hIT0fn/3kpb4jpH8kJH/np7/g4Pzenr2io34kJT7jo//m5v/goLzeXn1hIb6jY7/mJj/gYHzeXn0gIH5jY7/lZX/gIDzeXn0f4D4kpb5jY/+n5//kpL/gID2jJD4lJn6nqX5mqD5j5H+np7/p6f/pKT/mJj/gID3kJX6n6b5mqD5jY/9nJz/pqb/p6f/n5//44D/5YD/5ID/4oH/4oD/4YP/35L+zp7/2JP/3oj/4ov/3Jr/x6v/sKr7oJ79saT+yKn/yqz/tqr/oZ//nZ34lJn4lZr/n5//nJz/np74l5z/oKD5mJ35mp/5mJ75nKL4kZb/oaH6nqX/pKT/oqL6nqT/paX/o6P///8GR+LUAAAAaHRSTlMAAAAAAAETR8vZry4BBGO8+P71gRcCEbb8/OxeDjro/v7AODeX7p6y7/zEvf35l5T49IFm7P7+62NL3/7+41Erxf790zkbrv3FKgqF/awZBF34/f6WEAVCm+H5+deSIwEEHV62tlIYAmnxqH8AAAABYktHRJB4Co4MAAAAB3RJTUUH4goVChoi0vWRzAAAANRJREFUGNNjYGBgYGVj5+Dk4uZhgAFePn4BQSFhEVFGCJ9RTFwiIyNTUkpaBiLAKisnn5WRlaWgqAQRUFaRz8jIysjIVlWDCKhrAHlZObl5mloQAW2d/ILCouKSUl09iIC+QVl5RWVVdY2hEUTA2KS2ztSsvqHR3AIiYGlV12Rt09xYb2sHEbB3aGl1dGpubnZ2gQi4urW1d7g3d3Z6eEIEvLzrump9mrt7fP0gAv4Bgb1NQcF9/SGhEAGmsPCIyKjomNi4eKhvmRMSk5JTUtPSWYAcAOFOM8MXv4OsAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE4LTEwLTIxVDEwOjI2OjM0KzAwOjAwbrRI3wAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOC0xMC0yMVQxMDoyNjozNCswMDowMB/p8GMAAAAASUVORK5CYII="  alt="" /></a>';
    var link10 = '<a target="_blank" title="tsearch.me" href="http://tsearch.me/?q='+movie+ '"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAM1BMVEUAAAAlmTMlmTNHqVP5/Pn///+l1avw+PFtu3bL586Aw4iSzJm03LlasmUsnDne7+A0oEHm+bkOAAAAAnRSTlMAYDshrGAAAAABYktHRAX4b+nHAAAAB3RJTUUH4goVCQogdH9c6AAAAGFJREFUGNNlz90KwCAIBeDSTrXsZ+//tEtGLJsXgh8cUec8beWdnVXoKAUObAGwEIGUtePaoAAC1C+ik7RtRw8zAtmWconTFkiuCC0uGMCgpJH8AjF3opt5HWZP/z13vv8Avb0DaQtHU08AAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMTAtMjFUMDk6MTA6MzIrMDA6MDCDAoA9AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTEwLTIxVDA5OjEwOjMyKzAwOjAw8l84gQAAAABJRU5ErkJggg==" alt="" /></a>';
    var link11 = '<a target="_blank" title="RuTor.info" href="http://rutor.info/search/' + movie_enc + '"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAC31BMVEX7/fn4+fL29vn39vf39/f9/P/5+fD4+e/9/f/69/r49vf08/XKz8jJx8X39vj2+f/7+uH9/eX5+f/49vj29vz39//697769rT3+f/09fz5+fn4+/fr6dzHzM78/v/5+OzLxqvJx9b9+9Pb0objznCJkT7d0K1GcHJ2jbHOy0AvYHQAQrFokmnMiBaMDRIDWNUydajSQAXaAAUDZN4HY9XLHAHUDAZ2IUVuGkS+hyTEGQHFIQDOAQDMAADXNQfGp2CbZW6fa2z265768KT86mTdrDXhsjf56mf64zjZiw2eDwGkFALUgwn74i778YLyzAvHUgCzAAS/AAPQPhDVeizFWgXtuQf772v89VDuwwC6LAK4AAjhRwnsUwXMFQTQZB7jqiS5MgXqrAD04Sv/+z3fqQCyIQbAAAXlbgr/6QbytwfhFQXGAADmqQ/hhAyqBwbVggL75Rj9/B3QlwCkBgLAAALjbAv/+wb98gTojgruAAHwAALTQwb2yA3EBwSkAAHHewL/9xb25zLQgAapAAbOAQfLMgndoBK9TQb42wv5YAf5AALjKAXy0Q/NGQesAATQgAvj3CrmngW0AgTWAQLWAAPEAAfMAAXMPQb72gz0UwfoPQr2wgvJEQS7BgX2tw73xBe8IQLJAAblGAb0Ugb1PArbAATRUwjwvg31wwnpnQu/AgbCJQX0zRTWdAe3AATmgg/7+gz46Av8lwbeWAHx1wr//wXUbQu4AATOVQTKzDXvuQrFTwjvyxSzOwe/PQfitwb03gbWmwfOiwr64Re5IwrglxHx5xTguAurMwm7AATKAAi5AAS4BQK1AAWrAAbHgCHVpC/qzBPE3EDBfwWaAAPBAAXNAATSAADOAADNAAC/AASPAAKhXRv31xXqyQ+fGguuHA28Hg+/HhC/IRW+JBe1JhufKBzRpijztB374hD23Q312RL13Rjz3R754SP34ST24Cj45Sj+7ST///+td4DhAAAAQnRSTlMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADnY2a4AAAAAWJLR0T0MtUrTQAAAAd0SU1FB+IKFQkMI7ssqtQAAAEbSURBVBjTARAB7/4AAAECAwQFBkJDBwgJCgsMDQAAAQIODxBERUZHERITCwwNAAABFBUWSElKS0xNFxgZDA0AABobTk9QUVJTVFVWVxwdDQAeH1hZWltcXV5fYGFiYyAhACJkZWZnaGlqa2xtbm9wcSMAcnN0dXZ3eHl6e3x9fn+AgQCCg4SFhoeIiYqLjI2Oj5CRACSSk5SVlpeYmZqbnJ2enyUAJqChoqOkpaanqKmqq6ytJwAoKa6vsLGys7S1tre4uboqACssu7y9vr/AwcLDxMXGLS4ALzDHyMnKy8zNzs/Q0dIxMgAzNNPU1dbX2Nna29zd3jU2ADc4Od/g4eLj5OXm5+jpOjsAPD0+6uvs7e7v8PHy8z9AQahddB1jO0W5AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE4LTEwLTIxVDA5OjEyOjM1KzAwOjAwQlBujgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOC0xMC0yMVQwOToxMjozNSswMDowMDMN1jIAAAAASUVORK5CYII=" alt="" /></a>';
    var link12 = '<a target="_blank" title="KinoZal.tv" href="http://kinozal.tv/browse.php?s='+movie_enc+ '"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABC1BMVEUAAAA7R4A7R4DIz9Lw7N+VobpPWIhwfaPY2djx7drV19ibpbxKVIaDjKnx6M7Y2dH57dH77tH9787978/47dD37NDt7d7w586Yorv67tGVCwjcZk6qHRTCPC3269Bpd6HbqJGoHBTYcFyfEw6XHBisSUBAS4LZpY7ANCPSlYBdZI6SnrqkGRHYXUOZDgmpQDeQnLqJAADLh3TCyc7q5NOoGhSVGBXbf2jh3c7k4dWeEw7khmfFQzDESTby2LrDys57haf53rqxKh/FXEr87cx5hKbqpoHomnqdEAzHSDd1gKX64b7LgW+yVEjOj3vq487U1c6KmLhxfqQ8SIHEys5wfKPV1s6ssr/////ffbPJAAAAAnRSTlMATAn5wIMAAAABYktHRFjttcSOAAAAB3RJTUUH4goVCQ4HtRkshwAAANRJREFUGNNFj+lSwkAQhHeHqIBX6HiuyhIPwNs1ngEVRSNGJRKv938TZ6JV9o+p2q+mt6eVJtKKx+/USlHJGxufKFeqk1PTM7PEwPNrNbCCufmFRQZ6admwgJXVtbpliyK/EZoG1jc2t+q8oHQzQGjQam+zbYc37C6wZ/YPDuWfI8uOqgB3LG9EknICtpyenQu4YGAvgdh0uu7qGrhhi+4JwO2d69/joYhFEscJHgfuCUVsiuKw55dXN5TDKMO/3iRllOXv+UcWpfT59S1diuKW7F/9Hw7MGWSNJmkSAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE4LTEwLTIxVDA5OjE0OjA3KzAwOjAwVl4IAwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOC0xMC0yMVQwOToxNDowNyswMDowMCcDsL8AAAAASUVORK5CYII=" alt="" /></a>';
	var link13 = '<a target="_blank" title="zona.ru" href="http://zona.mobi/search/' + movie_enc+'"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAUVBMVEUAAAAAmPoAmPoAmPoAmPoAmPoAmPoAmPoAmPoAmPoAlvoMm/oPn/oAkfqT1P3////z+//6/f/s+P/k9P94yfzV7v7K6v6y4P01q/sgovtUuPwCCU45AAAACXRSTlMAOqbl/AmZwT4UFTJ8AAAAAWJLR0QPGLoA2QAAAAd0SU1FB+IKFQkPFV+7bI4AAACRSURBVBjTZY/RFoMgDEMrRKQVLMhE3f9/6ED3sDPvW3PaNCFqDMYC1gx0Mzr+4sZrnhiQBsBTVxxjDjdgR+SBuGjKaU0lCDwZRnyVra6qu4AN2WYmHI9V6yzMltDt5SxazjYzLkHmqumIfAntRGTX/I7cN2w3lUU11W2roZt6SCjtZ856v+3Bwm+wZ/RHub/6H6P5CL5e/i0GAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE4LTEwLTIxVDA5OjE1OjIxKzAwOjAwmGlRegAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOC0xMC0yMVQwOToxNToyMSswMDowMOk06cYAAAAASUVORK5CYII=" alt="" /></a>';
	var link14 = '<a target="_blank" title="Обозреватель новинок" href="http://oxvo.ru/?s=' + movie_enc + '"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACeVBMVEUAAACXaWyCXli8vLyGZ2J/f39WVlZAQEBBQUH///8tJCUfHR0CAgGUX2F/TE4AAAARFhZARD9MT0s/PT01KzAMDAyRYFxeWVVWTjtTUD5cWk9nZVtwaWB2bWR2cmpsaWWEhIS9vr66urqRZ2JyamyWlpZxcXFSX199bGx3ZWdvb29hYWFPT0+zsrLKycm6tLRHR0c8PDybmJjBlZU1NTUqKiqKW1u1NTUqKiozMzN8DQ29T09JSUmNjY2FRETOoaELCwtjY2OZmZmMfHzCbGygeXkrKSkLCwsAAAAAAAAGBgYzMzNra2tjJSWaHx+9dHSOf38hFRUDBAQPDw8FBQUAAAAAAAAHBwcYGRkmJictLS4zMjU2NTkKAAA8EhJYT087MzMFAAABAgIODg4VFRUvLzBJTE1RVFVRVFZDREY4NzkuLTArKitKSElUU1NXWVtAQkQ5OjwwMDEoKCgbGxsJAAA6MTI/OjpBPDw1NjYsLS0gICAQEBAYFRUnJSYkIyMTEhKNdkWOjl6poY+znpiwl5Gtjomsi4aSgXx/f36DdE2Gg1ukmY2zlH20g2GrcE2jf2mPi4V4eHa0s7F4d3RSTkthTj5hSDNbRjNVTEFQUU5NTUxMTEzMmJi1qalSSEgsLS0sLC0eICAlJicuLi82NjY9PT08PDzYhoalgIA4ISEiIyMnJychISE0NDRubm6RkZGdnZ0iIiLmt7ecT081ISEbHBwjIyMfHx9DQ0PJycnl5eXFxcVCQkIRERHYdXWXQkIxKysTFBQdHR0ZGRktLS1oaGhTU1MwMDAMDAzPRkYVFRUQEBALCwsHBwcBAQE5OjlMUFL///+xRL2bAAAAgXRSTlMAAAAAAAAAAAAAAAAADAcCBhAdFA0HOYaNnbbOwbCdiYNSBTLk0CQGUO34khV30/3lMqD98lGF+p4NdPflT2Ly/t9kUu397/z57sxRCy2u1sF6rPP04ci0q7KqVw8DFycdCiNnfYahxub531wQnPH9+9+nXhwBU9rntnIyDAQ9Rha+HD1NAAAAAWJLR0QJ8dml7AAAAAlwSFlzAAAASAAAAEgARslrPgAAAAd0SU1FB+IKFQkXAcd6IKoAAAD+SURBVBjTY2BAB4y8fPwCgkLCIqL8EAEmMXEJSSlpGVk5eQVFJWYGBhZllcam5pbWtvaOTlU1VgYGdQ3Nru6e3r7+CRMnaWnrsDHo6ulPnjJ12vQZM2fNnmNgyM5gZDx33vwFCxctXrJ02XITUw4GM/MVK1etXrN23foNG+dssrBksLLevGXrtu07du7avWfvPhtbBjv7/QcOHjp85Oix4ydOOjg6MTi7nHJ1cz995uy58x6eXt4+DL5+/gGBQcEhoWHhEZFR0TEMsXHxCYlJySmpaekZmReysiHu58zJzcu/WFBYVFwCEeAqLSuvqKyqroH7mbu2rr6BnwfIAgCnXVZ0ENXhlgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOC0xMC0yMVQwOToyMzowMSswMDowME6wQEEAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTgtMTAtMjFUMDk6MjM6MDErMDA6MDA/7fj9AAAAAElFTkSuQmCC" alt="" /></a>';
    var link15 = '<a target="_blank" title="Смотреть трейлер на Ютубе" href="http://www.youtube.com/results?search_query=' + movie_rus + 'трейлер" class="yu">Трейлер<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAM1BMVEX/////AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/4OD/QED/////sLD/ICD/wMD/UFD/EBCDEFz4AAAACHRSTlMAEECAYDBQcJt0SmoAAAABYktHRACIBR1IAAAAB3RJTUUH4goVCRkPvkEgIwAAAE9JREFUGNNjYCACMDIxMYMBExMjiM/CgQRYGBhYOVAAKwMbqgALAzOEwckFoZlhAtzcPLxoAnyoApz8MC1QQwXghmJYi+EwsNPZkZ1OCAAApUwFAPLg0doAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMTAtMjFUMDk6MjU6MTUrMDA6MDB7SxSLAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTEwLTIxVDA5OjI1OjE1KzAwOjAwChasNwAAAABJRU5ErkJggg==" alt="" /></a>';

var post = '<br><div class="torrents">' + link1 + link2 + link3 + link4 + link5 + link6 + link7 + link8 + link9 + link10 + link11 + link12 + link13 + link14 + link15 + "</div>";
    if ($(".presentBlock").length > 0) {
        $("p.user-in-show-only").before(post);
        $(".torrents").css({
            //"padding-left": "5px",
            "margin-top": "-20px",
            "margin-bottom": "10px",
            "background-color": "#f2f2f2",
            width: "480px"
        });
        $(".torrents a").css({
            margin: "4px"
        });
        $(".torrents a img").css({
            border: "0",
            "margin-top": "3px",
            "margin-bottom": "3px"
        })
    } else {
        $("p.user-in-show-only").before(post);
        $(".torrents").css({
            "margin-top": "-20px",
            "margin-bottom": "10px",
            "background-color": "#f2f2f2",
            width: "300px"
        });
        $(".torrents a").css({
            margin: "7px"
        });
        $(".torrents a img").css({
            border: "0",
            "margin-top": "3px",
            "margin-bottom": "3px"
        })
    }
  
  GM_addStyle(`
              .yu {
     display: inline-block;
     border: 1px solid #CC0000;
     color: #999999;
     border-radius: 3px 3px 3px 3px;
     -webkit-border-radius: 3px 3px 3px 3px;
     -moz-border-radius: 3px 3px 3px 3px;
     font-family: "PT Sans","Trebuchet MS",Arial,sans-serif;
     width: auto;
     height: auto;
     font-size: 1.6rem;
     padding: 8px 22px;
     background-color: #F0F0F0;
     margin: 0px !important;
     margin-left: 22px !important;
}
             .yu:hover {
     border: 1px solid #CC0000;
     color: #FFFFFF;
     background-color: #CC0000
}
        `);
  
  //old
  //var link8 = '<a target="_blank" title="megaserial.club" href="https://megaserial.club/search/?q='+movie+ '"><img src="' + imgs + 'megaserial.club"></a>';

});
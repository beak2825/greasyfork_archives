// ==UserScript==
// @name         Skrypt umożliwiający pobieranie materiałów ze znanych serwisów VOD. Autor: Przemek. Edit by pepe67
// @namespace    http://www.ipla.tv/
// @include      *www.ipla.tv/*
// @include      *getmedia.redefine.pl/*
// @include      *player.pl/*
// @include      *vod.pl/*
// @include      *tvp.pl/*
// @include      *www.cda.pl/*
// @version      1.1
// @description  SKrypt umożliwiający pobieranie materiałów z serwisów Ipla.tv, Player.pl, Vod.pl
// @author       Przemek
// @match        www.ipla.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28205/Skrypt%20umo%C5%BCliwiaj%C4%85cy%20pobieranie%20materia%C5%82%C3%B3w%20ze%20znanych%20serwis%C3%B3w%20VOD%20Autor%3A%20Przemek%20Edit%20by%20pepe67.user.js
// @updateURL https://update.greasyfork.org/scripts/28205/Skrypt%20umo%C5%BCliwiaj%C4%85cy%20pobieranie%20materia%C5%82%C3%B3w%20ze%20znanych%20serwis%C3%B3w%20VOD%20Autor%3A%20Przemek%20Edit%20by%20pepe67.meta.js
// ==/UserScript==

//Ważne:
//Skrypt opiera się na skryptach umieszczonych na stronie: miniskrypt.blogspot.com
//oraz: miniskrypt.hubaiitv.pl. Moje rozszerzenie tylko i wyłącznie dodaje wygodne
//w użyciu przyciski, jednak nie jestem autorem większości kodu.
//Skrypt jest niepubliczny, a dostęp do niego mają tylko i wyłącznie osoby z linkiem.

/////////////////////// KONFIGURACJA ////////////////////////
Wlacz_skrypt = true; // true = skrypt włączony, false = skrypt wyłączony.
//////////////////// KONIEC KONFIGURACJI ////////////////////

function addEvent(obj, event, func) {
            if (obj.addEventListener) {
                obj.addEventListener(event, func, false);
                return true;
            } else if (obj.attachEvent) {
                obj.attachEvent('on' + event, func);
            } else {
                var f = obj['on' + event];
                obj['on' + event] = typeof f === 'function' ? function() {
                    f();
                    func();
                } : func
            }
        }

function texxtIpla(lol){
    if (window.prompt("Aby skopiować link, wciśnij: CTRL+C, potem: ENTER aby rozpocząć pobieranie, lub ESC aby zakończyć działanie skryptu", lol)){
        document.location.href=lol;
    }
}

function texxt(lol){
  window.prompt ("Aby skopiować link, wciśnij: CTRL+C, potem: ENTER", lol);
}

/*javascript: (function() {
    var n = document.location.href.split(/[.,]/);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', '/api/?platform=ConnectedTV&terminal=Samsung2&format=json&v=3.6&authKey=453198a80ccc99e8485794789292f061&type=episode&id=' + n[n.length - 2] + '&sort=newest&m=getItem&deviceScreenHeight=1080&deviceScreenWidth=1920', false);
    xmlhttp.send();
    var o = eval('(' + xmlhttp.responseText + ')');
    var s = o.item.videos.main.video_content[0].url;
    if (!s) {
        if (confirm('DRM :(. Możesz pobrać plik, ale prawdopodobnie go nie otworzysz. \n\nvideo_content_license_data: ' + o.item.videos.main.video_content_license_data)) {
            var s = o.item.videos.main.video_content[0].src;
            document.location.href = s;
        };
    } else {
        var m = s.match(/:\/\/(?:redir\.)?(.[^/]+)(.*)/);
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET', m[2], false);
        xmlhttp.send();
        document.location.href = xmlhttp.responseText;
    }
})();*/

function PokazLink(){
    var taktak = true;
    var linklink = "";
    var n = document.location.href.split(/[.,]/);
        var f = new XMLHttpRequest();
        f.open('GET', '/api/?platform=ConnectedTV&terminal=Panasonic&format=json&authKey=064fda5ab26dc1dd936f5c6e84b7d3c2&v=3.1&m=getItem&id=' + n[n.length - 2], false);
        f.send();
        var m = eval('(' + f.responseText + ')');
    console.log(m);
        try {
            var h = m.item.videos.main.video_content[1].url;
        } catch (e) {
            console.log('samsung HD fail, trying first vid');
            try {
                var h = m.item.videos.main.video_content[0].url;
            } catch (e) {
                console.log('samsung fail. falling back to android');
            }
        };
        if (!h) {
            if (confirm('DRM lub brak materiału TV :(\nCzy chcesz pobrać wersję androidową?')) {
            function u() {
                var c = document.location.href.split(/[.,]/);
                var g = new XMLHttpRequest();
                var d = '/api/?platform=Mobile&terminal=Android&format=json&v=3.0&authKey=b4bc971840de63d105b3166403aa1bea&type=episode&id=' + c[c.length - 2] + '&sort=newest&m=getItem&deviceScreenHeight=1080&deviceScreenWidth=1920';
                g.open('GET', d, false);
                g.send();
                try {
                    var k = eval('(' + g.responseText + ')');
                    //alert( g.responseText);
                    var l = k.item.videos.main.video_content[1].url;
                    var i = r(l);
                } catch (e) {
                    console.log('android 3.0 fail. falling back to android 2.0');
                    var d = '/api/?platform=Mobile&terminal=Android&format=json&v=2.0&authKey=b4bc971840de63d105b3166403aa1bea&type=episode&id=' + c[c.length - 2] + '&sort=newest&m=getItem&deviceScreenHeight=1080&deviceScreenWidth=1920';
                    g.open('GET', d, false);
                    g.send();
                    var k = eval('(' + g.responseText + ')');
                    //alert( g.responseText);
                    var l = k.item.videos.main.video_content[1].url;
                    var i = r(l);
                }
                if (i == false) {
                    console.log('Nienaprawiony błąd, odśwież stronę i naciśnik przycisk raz jeszcze');
                    return false;
                }
                //document.body.innerHTML = '';
                //videoUrlHtml = document.createTextNode(i);
                //document.body.appendChild(videoUrlHtml);
                //alert(i);
                linklink = i;
                texxtIpla(linklink);
                //document.location.href = i
            }

            function r(c) {
                try {
                    c = c.replace('http://redir.atmcdn.pl/http/', '');
                    console.log(c);
                    var g = CryptoJS.lib.WordArray.random(16).toString();
                    var d = 'E8E2CE332A8BE7761B5E3397A18563E2';
                    var k = new Date();
                    var l = k.getTime();
                    var i = l - 946681200000;
                    var q = "name=" + c + "&expire=" + i + '\0';
                    q = v(q);
                    var w = CryptoJS.AES.encrypt((q), (CryptoJS.enc.Hex.parse(d)), {
                        iv: (CryptoJS.enc.Hex.parse(g)),
                        mode: CryptoJS.mode.CBC
                    });
                    var x = w.ciphertext.toString();
                    return "http://redir.atmcdn.pl/http/" + c + "?salt=" + g + "&token=" + String(x).toUpperCase();
                } catch (e) {
                    return false;
                }
            }

            function y(c, g) {
                var d = 16;
                var k = c.length % d;
                var l = d - k;
                for (var i = 0; i < l; i++) c += g;
                return c;
            }

            function v(c) {
                return y(c, String.fromCharCode(16 - (c.length % 16)));
            }

            function s(c, g) {
                var d = document.createElement('script'),
                    k = document.getElementsByTagName('script'),
                    l = k.length,
                    i = function() {
                        try {
                            g && g();
                        } catch (exception) {
                            console.log('[Caught Exception]', exception);
                        }
                    };
                d.setAttribute('type', 'text/javascript');
                d.setAttribute('charset', 'utf-8');
                if (d.readyState) {
                    d.onreadystatechange = function() {
                        if (d.readyState === 'loaded' || d.readyState === 'complete') {
                            d.onreadystatechange = null;
                            i();
                        }
                    }
                } else {
                    d.onload = i;
                }
                d.setAttribute('src', c);
                document.body.insertBefore(d, k[(l - 1)].nextSibling);
            }
            var p = 0;
            s("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js", function() {
                p += 1;
                //window.setTimeout(t, 2000)
            });
            s("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/pad-nopadding-min.js", function() {
                p += 1;
                //window.setTimeout(t, 2000)
            });
            window.setTimeout(t, 2000);

            function t() {
                console.log("Prerun:" + p);
                if (p >= 2) {
                    u();
                }
            }
            }
            else {
            //None
            }
        } else {
            //var b = h.match(/:\/\/(?:redir\.)?(.[^/]+)(.*)/);
            //var f = new XMLHttpRequest();
            //f.open('GET', b[2], false);
            //f.send();
            //linklink = f.responseText;
            //console.log(h);
            //texxtIpla(linklink);
            texxtIpla(h);
            //document.location.href = f.responseText
        }
}

function PokazLinkB(){
    var taktak = true;
    var linklink = "";
    var n = document.location.href.split(/[.,]/);
        var f = new XMLHttpRequest();
       // f.open('GET', '/api/?platform=ConnectedTV&terminal=Panasonic&format=json&authKey=064fda5ab26dc1dd936f5c6e84b7d3c2&v=3.1&m=getItem&id=' + n[n.length - 2], false);
        f.open('GET', '/api/?platform=ConnectedTV&terminal=Panasonic&format=json&authKey=064fda5ab26dc1dd936f5c6e84b7d3c2&v=3.1&m=getItem&id=' + n[n.length - 2], false);
       // f.open('GET', '/api/?platform=ConnectedTV&terminal=Samsung2&format=json&authKey=453198a80ccc99e8485794789292f061&v=3.6&showContentContractor=free,samsung,standard&m=getItem&android23video=1&deviceType=Tablet&os=4.1.1&playlistType=&connectionType=WIFI&deviceScreenWidth=1920&deviceScreenHeight=1080&appVersion=3.3.4&manufacturer=unknown&model=androVMTablet&id=' + n[n.length - 2], false);
        f.send();
        var m = eval('(' + f.responseText + ')');
        var numofitems = m.item.videos.main.video_content.length;
        //alert(m.item.videos.main.video_content.length);
         //console.log(f.responseText);
        try {
            var h = m.item.videos.main.video_content[numofitems-1].url;
        } catch (e) {
            console.log('samsung SD fail, trying first vid');
            try {
                var h = m.item.videos.main.video_content[0].url;
            } catch (e) {
                console.log('samsung fail. falling back to android');
            }
        };
        if (!h) {
            if (confirm('DRM lub brak materiału TV :(\nCzy chcesz pobrać wersję androidową?')) {
            function u() {
                var c = document.location.href.split(/[.,]/);
                var g = new XMLHttpRequest();
                var d = '/api/?platform=Mobile&terminal=Android&format=json&v=3.0&authKey=b4bc971840de63d105b3166403aa1bea&type=episode&id=' + c[c.length - 2] + '&sort=newest&m=getItem&deviceScreenHeight=1080&deviceScreenWidth=1920';
                g.open('GET', d, false);
                g.send();
                try {
                    var k = eval('(' + g.responseText + ')');
                    //alert( g.responseText);
                    var numnum = k.item.videos.main.video_content.length;
                    var l = k.item.videos.main.video_content[numnum-1].url;
                    var i = r(l);
                } catch (e) {
                    console.log('android 3.0 fail. falling back to android 2.0');
                    var d = '/api/?platform=Mobile&terminal=Android&format=json&v=2.0&authKey=b4bc971840de63d105b3166403aa1bea&type=episode&id=' + c[c.length - 2] + '&sort=newest&m=getItem&deviceScreenHeight=1080&deviceScreenWidth=1920';
                    g.open('GET', d, false);
                    g.send();
                    var k = eval('(' + g.responseText + ')');
                    //alert( g.responseText);
                    var numnum = k.item.videos.main.video_content.length;
                    var l = k.item.videos.main.video_content[numnum-1].url;
                    var i = r(l);
                }
                if (i == false) {
                    console.log('Nienaprawiony błąd, odśwież stronę i naciśnik przycisk raz jeszcze');
                    return false;
                }
                //document.body.innerHTML = '';
                //videoUrlHtml = document.createTextNode(i);
                //document.body.appendChild(videoUrlHtml);
                //alert(i);
                linklink = i;
                texxtIpla(linklink);
                //document.location.href = i
            }

            function r(c) {
                try {
                    c = c.replace('http://redir.atmcdn.pl/http/', '');
                    console.log(c);
                    var g = CryptoJS.lib.WordArray.random(16).toString();
                    var d = 'E8E2CE332A8BE7761B5E3397A18563E2';
                    var k = new Date();
                    var l = k.getTime();
                    var i = l - 946681200000;
                    var q = "name=" + c + "&expire=" + i + '\0';
                    q = v(q);
                    var w = CryptoJS.AES.encrypt((q), (CryptoJS.enc.Hex.parse(d)), {
                        iv: (CryptoJS.enc.Hex.parse(g)),
                        mode: CryptoJS.mode.CBC
                    });
                    var x = w.ciphertext.toString();
                    return "http://redir.atmcdn.pl/http/" + c + "?salt=" + g + "&token=" + String(x).toUpperCase();
                } catch (e) {
                    return false;
                }
            }

            function y(c, g) {
                var d = 16;
                var k = c.length % d;
                var l = d - k;
                for (var i = 0; i < l; i++) c += g;
                return c;
            }

            function v(c) {
                return y(c, String.fromCharCode(16 - (c.length % 16)));
            }

            function s(c, g) {
                var d = document.createElement('script'),
                    k = document.getElementsByTagName('script'),
                    l = k.length,
                    i = function() {
                        try {
                            g && g();
                        } catch (exception) {
                            console.log('[Caught Exception]', exception);
                        }
                    };
                d.setAttribute('type', 'text/javascript');
                d.setAttribute('charset', 'utf-8');
                if (d.readyState) {
                    d.onreadystatechange = function() {
                        if (d.readyState === 'loaded' || d.readyState === 'complete') {
                            d.onreadystatechange = null;
                            i();
                        }
                    }
                } else {
                    d.onload = i;
                }
                d.setAttribute('src', c);
                document.body.insertBefore(d, k[(l - 1)].nextSibling);
            }
            var p = 0;
            s("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js", function() {
                p += 1;
                //window.setTimeout(t, 2000)
            });
            s("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/pad-nopadding-min.js", function() {
                p += 1;
                //window.setTimeout(t, 2000)
            });
            window.setTimeout(t, 2000);

            function t() {
                console.log("Prerun:" + p);
                if (p >= 2) {
                    u();
                }
            }
            }
            else {
            //None
            }
        } else {
            //var b = h.match(/:\/\/(?:redir\.)?(.[^/]+)(.*)/);
            //var f = new XMLHttpRequest();
            //f.open('GET', b[2], false);
            //f.send();
            //linklink = f.responseText;
            texxtIpla(h);
            //document.location.href = f.responseText
        }
    }

function PokazLinkOld(){
    var taktak = true;
    var linklink = "";
    var n = document.location.href.split(/[.,]/);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', '/api/?platform=ConnectedTV&terminal=Samsung2&format=json&v=3.6&authKey=453198a80ccc99e8485794789292f061&type=episode&id=' + n[n.length - 2] + '&sort=newest&m=getItem&deviceScreenHeight=1080&deviceScreenWidth=1920', false);
    xmlhttp.send();
    var o = eval('(' + xmlhttp.responseText + ')');
    //alert(xmlhttp.responseText);
    try {
        var s = o.item.videos.main.video_content[0].url
    } catch (e) {}
    if (!s) {
        if (confirm('DRM lub brak materiału TV :(\nCzy chcesz pobrać wersję androidową?')) {
            (function() {
                console.log("START");
                var redirectToBool = true;

                function run() {
                    //alert('run');
                    var n = document.location.href.split(/[.,]/);
                    var xmlhttp = new XMLHttpRequest();
                    var apiUrl = '/api/?platform=Mobile&terminal=Android&format=json&v=3.0&authKey=b4bc971840de63d105b3166403aa1bea&type=episode&id=' + n[n.length - 2] + '&sort=newest&m=getItem&deviceScreenHeight=1080&deviceScreenWidth=1920';
                    console.log("apiUrl" + apiUrl);
                    xmlhttp.open('GET', apiUrl, false);
                    xmlhttp.send();
                    console.log(xmlhttp);
                    //alert(xmlhttp.responseText);
                    var o = eval('(' + xmlhttp.responseText + ')');
                    console.log(o);
                    try {
                        var videoUrl = o.item.videos.main.video_content[1].url;
                    } catch (e) {
                        alert('Brak materiału w wersji na androida');
                    }
                    console.log(videoUrl);
                    var videoUrlWithSeed = AES_CBC(videoUrl);
                    console.log(videoUrlWithSeed);
                    document.body.innerHTML = '';
                    videoUrlHtml = document.createTextNode(videoUrlWithSeed);
                    document.body.appendChild(videoUrlHtml);
                    if (redirectToBool){
                    //alert(videoUrlWithSeed);
                    linklink = videoUrlWithSeed;
                    //alert(linklink);
                    //ShowDirectLink(linklink);
                    texxtIpla(linklink);
                    //alert(linklink);
                    //document.location.href = videoUrlWithSeed;
                    }
                }

                function AES_CBC(url_) {
                    console.log(url_);
                    url_ = url_.replace('http://redir.atmcdn.pl/http/', '');
                    console.log(url_);
                    var salt = CryptoJS.lib.WordArray.random(16).toString();
                    var decrypted = 'E8E2CE332A8BE7761B5E3397A18563E2';
                    var d = new Date();
                    var currentMillis = d.getTime();
                    var expire = 3600000 + (currentMillis) - 946684800000;
                    console.log("expire: " + expire);
                    var unencryptedToken = "name=" + url_ + "&expire=" + expire + '\0';
                    console.log("unencryptedToken: " + unencryptedToken);
                    unencryptedToken = pkcs5_pad(unencryptedToken);
                    var encrypted = CryptoJS.AES.encrypt((unencryptedToken), ((CryptoJS.enc.Hex.parse(decrypted))), {
                        iv: ((CryptoJS.enc.Hex.parse(salt))),
                        padding: CryptoJS.pad.NoPadding,
                        mode: CryptoJS.mode.CBC
                    });
                    console.log("encrypted: " + encrypted);
                    var encryptedTokenHEX = encrypted.ciphertext.toString();
                    return "http://redir.atmcdn.pl/http/" + url_ + "?salt=" + salt + "&token=" + String(encryptedTokenHEX).toUpperCase();
                }

                function padString(source, paddingChar) {
                    var size = 16;
                    var x = source.length % size;
                    var padLength = size - x;
                    for (var i = 0; i < padLength; i++) source += paddingChar;
                    return source;
                }

                function pkcs5_pad(s) {
                    console.log("len:" + s.length);
                    return padString(s, String.fromCharCode(16 - (s.length % 16)));
                }

                function loadScript(url, callback) {
                    var script = document.createElement("script");
                    script.type = "text/javascript";
                    if (script.readyState) {
                        console.log("IE");
                        script.onreadystatechange = function() {
                            if (script.readyState == "loaded" || script.readyState == "complete") {
                                script.onreadystatechange = null;
                                callback();
                            }
                        };
                    } else {
                        console.log("Others");
                        script.onload = function() {
                            callback();
                        };
                    }
                    script.src = url;
                    document.getElementsByTagName("head")[0].appendChild(script);
                }
                var loadedJsScripts = 0;
                loadScript("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js", function() {
                    loadedJsScripts += 1;
                    checkAndRun();
                });
                loadScript("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/pad-nopadding-min.js", function() {
                    loadedJsScripts += 1;
                    checkAndRun();
                });

                function checkAndRun() {
                    if (loadedJsScripts >= 2) {
                        run();
                    }
                }
                console.log("END")
            })()
        }
        else {
        taktak = false;
        }
    } else {
        var m = s.match(/:\/\/(?:redir\.)?(.[^/] )(.*)/);
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET', m[2], false);
        xmlhttp.send();
        //document.location.href = xmlhttp.responseText;
        linklink = xmlhttp.responseText;
        //ShowDirectLink(linklink);
        texxtIpla(linklink);
    }
    
    /*function ShowDirectLink(linklinklink){
    //if (taktak){
    if(linklinklink.length > 3){
    var heyhey9 = null;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
           heyhey9 = xhr.response;
            alert(heyhey9);
            texxtIpla(heyhey9);
            return heyhey9;
        }
    }
   //alert(xmlhttp.responseText);
    //texxt(o.item.videos.main.video_content[0].url);
   // alert(s);
    var link = linklinklink;
    //alert(link);
     
    var str = link;
    var res = str.replace("tvnplayer", "player");
    xhr.open('GET', res, false);
    //alert(heyhey9);
    xhr.send(null);
    //texxt(o.item.videos.main.video_content[1].url);
    //document.location.href = o.item.videos.main.video_content[1].url;
    //texxtIpla(s);
    }
    //}
    }*/
    
    /*var n = document.location.href.split(/[.,]/);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', '/api/?platform=ConnectedTV&terminal=Samsung2&format=json&v=3.6&authKey=453198a80ccc99e8485794789292f061&type=episode&id=' + n[n.length - 2] + '&sort=newest&m=getItem&deviceScreenHeight=1080&deviceScreenWidth=1920', false);
    xmlhttp.send();
    //alert(xmlhttp.responseText);
    var o = eval('(' + xmlhttp.responseText + ')');
    var s = o.item.videos.main.video_content[0].url;
    //alert(s);
    if (!s) {
        if (confirm('DRM :(. Możesz pobrać plik, ale prawdopodobnie go nie otworzysz. \n\nvideo_content_license_data: ' + o.item.videos.main.video_content_license_data)) {
            var s = o.item.videos.main.video_content[0].src;
            //document.location.href = s;
        };
    } else {
        var m = s.match(/:\/\/(?:redir\.)?(.[^/]+)(.*)/);
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET', m[2], false);
        xmlhttp.send();
        //document.location.href = xmlhttp.responseText;
    }*/
    /*var n = document.location.href.split(/[.,]/);
    var xmlhttp = new XMLHttpRequest();
    //xmlhttp.open('GET', '/api/?platform=ConnectedTV&terminal=Samsung&format=json&v=3.0&authKey=ba786b315508f0920eca1c34d65534cd&type=episode&id=' + n[n.length - 2] + '&sort=newest&m=getItem&deviceScreenHeight=1080&deviceScreenWidth=1920', false);
    xmlhttp.open('GET', '/api/?platform=ConnectedTV&terminal=Samsung2&format=json&v=3.6&authKey=453198a80ccc99e8485794789292f061&type=episode&id=' + n[n.length - 2] + '&sort=newest&m=getItem&deviceScreenHeight=1080&deviceScreenWidth=1920', false);
    xmlhttp.send();
    //alert(xmlhttp.responseText);
    var o = eval('(' + xmlhttp.responseText + ')');
    var s = o.item.videos.main.video_content[0].url;
    alert(s);
    var m = s.match(/:\/\/(?:www\.)?(.[^/]+)(.*)/);
    var xmlhttp = new XMLHttpRequest();
   
    xmlhttp.open('GET', m[2], false);
    xmlhttp.send();*/
   
    //document.location.href = xmlhttp.responseText;

    //var n = document.location.href.split(/[.,]/);
    //var xmlhttp = new XMLHttpRequest();
    //xmlhttp.open('GET','/api/?platform=ConnectedTV&terminal=Samsung&format=json&v=2.0&authKey=ba786b315508f0920eca1c34d65534cd&type=episode&id='+n[n.length-2]+'&sort=newest&m=getItem&deviceScreenHeight=1080&deviceScreenWidth=1920',false);
    
    //xmlhttp.send();
    //var o = eval('('+xmlhttp.responseText+')');
    //alert(s);
    //texxtIpla(s);
    /*var heyhey9 = null;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
           heyhey9 = xhr.response;
          //alert(heyhey9);
            texxtIpla(heyhey9);
            return heyhey9;
        }
    }
   //alert(xmlhttp.responseText);
    //texxt(o.item.videos.main.video_content[0].url);
   // var link = o.item.videos.main.video_content[1].url;
     
    var str = link;
    var res = str.replace("tvnplayer", "player");
    xhr.open('GET', res, false);
    //alert(heyhey9);
    xhr.send(null);
    //texxt(o.item.videos.main.video_content[1].url);
    //document.location.href = o.item.videos.main.video_content[1].url;*/
}

function PokazLinkA(){
    //OBECNIE NIE DZIAŁA
    var n = document.location.href.split(/[.,]/);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', '/api/?platform=ConnectedTV&terminal=Samsung&format=json&v=3.0&authKey=ba786b315508f0920eca1c34d65534cd&type=episode&id=' + n[n.length - 2] + '&sort=newest&m=getItem&deviceScreenHeight=1080&deviceScreenWidth=1920', false);
    xmlhttp.send();
    var o = eval('(' + xmlhttp.responseText + ')');
    var s = o.item.videos.main.video_content[0].url;
    var m = s.match(/:\/\/(?:www\.)?(.[^/]+)(.*)/);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', m[2], false);
    xmlhttp.send();
    //document.location.href = xmlhttp.responseText;

   // var n = document.location.href.split(/[.,]/);
   // var xmlhttp = new XMLHttpRequest();
   // xmlhttp.open('GET','/api/?platform=ConnectedTV&terminal=Samsung&format=json&v=2.0&authKey=ba786b315508f0920eca1c34d65534cd&type=episode&id='+n[n.length-2]+'&sort=newest&m=getItem&deviceScreenHeight=1080&deviceScreenWidth=1920',false);
  //  xmlhttp.send();
   // var o = eval('('+xmlhttp.responseText+')');
    
    var heyhey9 = null;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
           heyhey9 = xhr.response;
          // alert(heyhey9);
            texxtIpla(heyhey9);
            return heyhey9;
        }
    }
    
    var link = o.item.videos.main.video_content[0].url;
   // texxt(link);
    var str = link;
    var res = str.replace("tvnplayer", "player");
    xhr.open('GET', res, false);
    //alert(heyhey9);
    xhr.send(null);
    //texxt(o.item.videos.main.video_content[1].url);
    //document.location.href = o.item.videos.main.video_content[1].url;
}

function PokazLinkBOld(){
    var taktak = true;
    var linklink = "";
    var n = document.location.href.split(/[.,]/);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', '/api/?platform=ConnectedTV&terminal=Samsung2&format=json&v=3.6&authKey=453198a80ccc99e8485794789292f061&type=episode&id=' + n[n.length - 2] + '&sort=newest&m=getItem&deviceScreenHeight=1080&deviceScreenWidth=1920', false);
    xmlhttp.send();
    var o = eval('(' + xmlhttp.responseText + ')');
    //alert(xmlhttp.responseText);
    try {
        var s = o.item.videos.main.video_content[1].url
    } catch (e) {}
    if (!s) {
        if (confirm('DRM lub brak materiału TV :(\nCzy chcesz pobrać wersję androidową?')) {
            (function() {
                console.log("START");
                var redirectToBool = true;

                function run() {
                    //alert('run');
                    var n = document.location.href.split(/[.,]/);
                    var xmlhttp = new XMLHttpRequest();
                    var apiUrl = '/api/?platform=Mobile&terminal=Android&format=json&v=3.0&authKey=b4bc971840de63d105b3166403aa1bea&type=episode&id=' + n[n.length - 2] + '&sort=newest&m=getItem&deviceScreenHeight=1080&deviceScreenWidth=1920';
                    console.log("apiUrl" + apiUrl);
                    xmlhttp.open('GET', apiUrl, false);
                    xmlhttp.send();
                    console.log(xmlhttp);
                    //alert(xmlhttp.responseText);
                    var o = eval('(' + xmlhttp.responseText + ')');
                    console.log(o);
                    try {
                        var videoUrl = o.item.videos.main.video_content[3].url;
                    } catch (e) {
                        alert('Brak materiału w wersji na androida');
                    }
                    console.log(videoUrl);
                    var videoUrlWithSeed = AES_CBC(videoUrl);
                    console.log(videoUrlWithSeed);
                    document.body.innerHTML = '';
                    videoUrlHtml = document.createTextNode(videoUrlWithSeed);
                    document.body.appendChild(videoUrlHtml);
                    if (redirectToBool){
                    //alert(videoUrlWithSeed);
                    linklink = videoUrlWithSeed;
                    //alert(linklink);
                    //ShowDirectLink(linklink);
                    texxtIpla(linklink);
                    //alert(linklink);
                    //document.location.href = videoUrlWithSeed;
                    }
                }

                function AES_CBC(url_) {
                    console.log(url_);
                    url_ = url_.replace('http://redir.atmcdn.pl/http/', '');
                    console.log(url_);
                    var salt = CryptoJS.lib.WordArray.random(16).toString();
                    var decrypted = 'E8E2CE332A8BE7761B5E3397A18563E2';
                    var d = new Date();
                    var currentMillis = d.getTime();
                    var expire = 3600000 + (currentMillis) - 946684800000;
                    console.log("expire: " + expire);
                    var unencryptedToken = "name=" + url_ + "&expire=" + expire + '\0';
                    console.log("unencryptedToken: " + unencryptedToken);
                    unencryptedToken = pkcs5_pad(unencryptedToken);
                    var encrypted = CryptoJS.AES.encrypt((unencryptedToken), ((CryptoJS.enc.Hex.parse(decrypted))), {
                        iv: ((CryptoJS.enc.Hex.parse(salt))),
                        padding: CryptoJS.pad.NoPadding,
                        mode: CryptoJS.mode.CBC
                    });
                    console.log("encrypted: " + encrypted);
                    var encryptedTokenHEX = encrypted.ciphertext.toString();
                    return "http://redir.atmcdn.pl/http/" + url_ + "?salt=" + salt + "&token=" + String(encryptedTokenHEX).toUpperCase();
                }

                function padString(source, paddingChar) {
                    var size = 16;
                    var x = source.length % size;
                    var padLength = size - x;
                    for (var i = 0; i < padLength; i++) source += paddingChar;
                    return source;
                }

                function pkcs5_pad(s) {
                    console.log("len:" + s.length);
                    return padString(s, String.fromCharCode(16 - (s.length % 16)));
                }

                function loadScript(url, callback) {
                    var script = document.createElement("script");
                    script.type = "text/javascript";
                    if (script.readyState) {
                        console.log("IE");
                        script.onreadystatechange = function() {
                            if (script.readyState == "loaded" || script.readyState == "complete") {
                                script.onreadystatechange = null;
                                callback();
                            }
                        };
                    } else {
                        console.log("Others");
                        script.onload = function() {
                            callback();
                        };
                    }
                    script.src = url;
                    document.getElementsByTagName("head")[0].appendChild(script);
                }
                var loadedJsScripts = 0;
                loadScript("http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/aes.js", function() {
                    loadedJsScripts += 1;
                    checkAndRun();
                });
                loadScript("http://crypto-js.googlecode.com/svn/tags/3.1.2/build/components/pad-nopadding-min.js", function() {
                    loadedJsScripts += 1;
                    checkAndRun();
                });

                function checkAndRun() {
                    if (loadedJsScripts >= 2) {
                        run();
                    }
                }
                console.log("END")
            })()
        }
        else {
        taktak = false;
        }
    } else {
        var m = s.match(/:\/\/(?:redir\.)?(.[^/] )(.*)/);
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET', m[2], false);
        xmlhttp.send();
        //document.location.href = xmlhttp.responseText;
        linklink = xmlhttp.responseText;
        //ShowDirectLink(linklink);
        texxtIpla(linklink);
    }
    }

var btn = document.createElement( 'input' );
with( btn ) {
  setAttribute( 'onclick', 'PokazLink()' );
    setAttribute( 'value', 'Pobierz w: HD' );
  setAttribute( 'type', 'button' );
  setAttribute( 'id', 'btn1' );
  setAttribute("style", "position:fixed !important; left: 0px; top: 1px; width: 115px; height: 30px; background-color: #00a6ff; color: white; z-index: 1000000000;");
}


//Wyłączony po problemach z tvnem:
/*var btna = document.createElement( 'input' );
with( btna ) {
  setAttribute( 'onclick', 'PokazLink()' );
  setAttribute( 'value', 'MQ' );
  setAttribute( 'type', 'button' );
  setAttribute( 'id', 'btn1a' );
  setAttribute("style", "position:fixed !important; left: 0px; top: 1px; left: 117px; width: 45px; height: 30px; background-color: #00a6ff; color: white; z-index: 1000000000;");
}*/

var btnb = document.createElement( 'input' );
with( btnb ) {
  setAttribute( 'onclick', 'PokazLink()' );
  setAttribute( 'value', 'SD' ); //LQ = SD
  setAttribute( 'type', 'button' );
  setAttribute( 'id', 'btn1b' );
  setAttribute("style", "position:fixed !important; left: 0px; top: 1px; left: 117px; width: 45px; height: 30px; background-color: #00a6ff; color: white; z-index: 1000000000;"); //left 164px
}

var btn2 = document.createElement( 'input' );
with( btn2 ) {
  setAttribute( 'onclick', 'RozpocznijPobieranie()' );
    setAttribute( 'value', 'Pobierz w: HD' );
  setAttribute( 'type', 'button' );
  setAttribute( 'id', 'btn2' );
    setAttribute("style", "position:fixed !important; left: 0px; top: 1px; left: 219px; width: 110px; height: 30px; background-color: #00a6ff; color: white; z-index: 1000000000;");
}

var btn2a = document.createElement( 'input' );
with( btn2a ) {
  setAttribute( 'onclick', 'RozpocznijPobieranie()' );
    setAttribute( 'value', 'MQ' );
  setAttribute( 'type', 'button' );
  setAttribute( 'id', 'btn2a' );
    setAttribute("style", "position:fixed !important; left: 0px; top: 1px; left: 331px; width: 45px; height: 30px; background-color: #00a6ff; color: white; z-index: 1000000000;");
}

var btn2b = document.createElement( 'input' );
with( btn2b ) {
  setAttribute( 'onclick', 'RozpocznijPobieranie()' );
    setAttribute( 'value', 'LQ' );
  setAttribute( 'type', 'button' );
  setAttribute( 'id', 'btn2a' );
    setAttribute("style", "position:fixed !important; left: 0px; top: 1px; left: 378px; width: 45px; height: 30px; background-color: #00a6ff; color: white; z-index: 1000000000;");
}

function PokazLinkIpla(){
    var whatToOpen;
    if(document.location.href.indexOf('ipla.tv/')>0){
var xmlhttp = new XMLHttpRequest();
xmlhttp.open('GET','/VOD/play-in-ipla/'+document.location.href.substr(document.location.href.indexOf('/vod-')+5),false);
xmlhttp.send();
var idn=xmlhttp.responseText.substr(xmlhttp.responseText.indexOf('ipla://playvod-1|')+17);
idn=idn.substr(0,idn.indexOf(' ')-1);
document.location.href='http://getmedia.redefine.pl/vods/get_vod/?cpid=1&ua=mipla/23&media_id='+idn;
whatToOpen = 'http://getmedia.redefine.pl/vods/get_vod/?cpid=1&ua=mipla/23&media_id='+idn;
}
else if(document.location.href.indexOf('getmedia.redefine.pl/')>0){
s=JSON.parse(document.body.textContent);
if(s.vod.video_hd)a=s.vod.video_hd;
else if(s.vod.video){
a=s.vod.video;
}else{a=s.vod.copies[0].url}
document.location.href=a;
     whatToOpen = a;
}
        }
        
function PokazLinkOnet(){
    alert('lol');
var i = document.body.innerHTML.substr(document.body.innerHTML.indexOf('id=' + atob('Ig==') + 'mvp:') + 8, 100);
i = i.substr(0, i.indexOf(atob('Ig==')));
s = atob('PGh0bWw+PGhlYWQ+PHNjcmlwdD4KZnVuY3Rpb24gbShlKXsKdj1ldmFsKGUpOwpmb3IgKGkgPSAwOyB2LnJlc3VsdFswXS5mb3JtYXRzLndpZGVvLm1wNC5sZW5ndGggPiBpO2k9aSsxKQogIGRvY3VtZW50LndyaXRlKHYucmVzdWx0WzBdLmZvcm1hdHMud2lkZW8ubXA0W2ldWyJ1cmwiXSsiICIrdi5yZXN1bHRbMF0uZm9ybWF0cy53aWRlby5tcDRbaV1bInZlcnRpY2FsX3Jlc29sdXRpb24iXSsicDxicj4iKTsKfQo8L3NjcmlwdD4KPHNjcmlwdCBzcmM9Imh0dHA6Ly9xaS5ja20ub25ldGFwaS5wbC8/Y2FsbGJhY2s9bSZib2R5W2lkXT1FQkJBRTFFNDMyNkU0Q0U5MzQzRkZFRUY1NkE5MTk4RCZib2R5W2pzb25ycGNdPTIuMCZib2R5W21ldGhvZF09Z2V0X2Fzc2V0X2RldGFpbCZib2R5W3BhcmFtc11bSURfUHVibGlrYWNqaV09UVFRUSZib2R5W3BhcmFtc11bU2VydmljZV09dm9kLm9uZXQucGwmY29udGVudC10eXBlPWFwcGxpY2F0aW9uJTJGanNvbnAmeC1vbmV0LWFwcD1wbGF5ZXIuZnJvbnQub25ldGFwaS5wbCZfPTEzNjIxNjQ5MTMxNDUiPjwvc2NyaXB0Pgo8L2hlYWQ+PGJvZHk+PC9ib2R5PjwvaHRtbD4K');
s = s.replace('QQQQ', i);
var win = open();
with(win.document) {
open();
write(s);
write("\x3Cscript type=\"text/javascript\"> var s=document.body.textContent; var searchonet0 = s.lastIndexOf('.mp4'); s = s.substr(0,searchonet0+10); var searchonet1 = s.indexOf(' 1080p'); if (searchonet1 == -1){searchonet1 = s.indexOf(' 720p');} if (searchonet1 == -1){searchonet1 = s.indexOf(' 576p');} if (searchonet1 == -1){searchonet1 = s.indexOf(' 480p');} if (searchonet1 == -1){searchonet1 = s.indexOf(' 360p');} if (searchonet1 == -1){searchonet1 = s.indexOf(' 240p');} var searchonet2 = s.substr(0,searchonet1); var searchonet3 = searchonet2.lastIndexOf('http://'); var searchonet4 = searchonet2.substr(searchonet3); if (window.prompt(\"Aby skopiować link, wciśnij: CTRL+C, potem: ENTER aby rozpocząć pobieranie, lub ESC aby zakończyć działanie skryptu\", searchonet4)){ document.location.href=searchonet4; } \x3C/script>");
close();


//var i=document.body.innerHTML.substr(document.body.innerHTML.indexOf('id='+atob('Ig==')+'mvp:')+8,100);
//i=i.substr(0,i.indexOf(atob('Ig==')));
//s=atob('PGh0bWw+PGhlYWQ+PHNjcmlwdD4KZnVuY3Rpb24gbShlKXsKdj1ldmFsKGUpOwpkb2N1bWVudC5sb2NhdGlvbi5ocmVmPXYucmVzdWx0WzBdLmZvcm1hdHMud2lkZW8ubXA0W3YucmVzdWx0WzBdLmZvcm1hdHMud2lkZW8ubXA0Lmxlbmd0aC0xXVsidXJsIl07Cn0KPC9zY3JpcHQ+CjxzY3JpcHQgc3JjPSJodHRwOi8vcWkuY2ttLm9uZXRhcGkucGwvP2NhbGxiYWNrPW0mYm9keVtpZF09RUJCQUUxRTQzMjZFNENFOTM0M0ZGRUVGNTZBOTE5OEQmYm9keVtqc29ucnBjXT0yLjAmYm9keVttZXRob2RdPWdldF9hc3NldF9kZXRhaWwmYm9keVtwYXJhbXNdW0lEX1B1Ymxpa2FjamldPVFRUVEmYm9keVtwYXJhbXNdW1NlcnZpY2VdPXZvZC5vbmV0LnBsJmNvbnRlbnQtdHlwZT1hcHBsaWNhdGlvbiUyRmpzb25wJngtb25ldC1hcHA9cGxheWVyLmZyb250Lm9uZXRhcGkucGwmXz0xMzYyMTY0OTEzMTQ1Ij48L3NjcmlwdD4gCjwvaGVhZD48Ym9keT48L2JvZHk+PC9odG1sPg==');
//s=s.replace('QQQQ',i);
//var win=open();
//with(win.document){open();
//write(s);
//close();               
}
}

function PokazLinkTvp(){
var xmlhttp = new XMLHttpRequest();
        m = document.body.innerHTML.substr(document.body.innerHTML.indexOf('data-video-id=') + 15, 8).replace(/\D/g, '');
        if (!/^\d+$/.test(m)) m = document.body.innerHTML.substr(document.body.innerHTML.indexOf('data-videoid=') + 14, 8).replace(/\D/g, '');
        if (!/^\d+$/.test(m)) m = document.body.innerHTML.substr(document.body.innerHTML.indexOf('/player/video?id=') + 17, 8);
        if (!/^\d+$/.test(m)) m = document.body.innerHTML.substr(document.body.innerHTML.indexOf('/player/') + 8, 8);
        if (!/^\d+$/.test(m)) m = document.body.innerHTML.substr(document.body.innerHTML.indexOf('video_id=') + 9, 8).replace(/\D/g, '');
        if (!/^\d+$/.test(m)) m = document.body.innerHTML.substr(document.body.innerHTML.indexOf('object_id:') + 10, 9).replace(/\D/g, '');
        if (!/^\d+$/.test(m)) m = document.body.innerHTML.substr(document.body.innerHTML.indexOf('amp;object_id=') + 14, 8).replace(/\D/g, '');
        if (!/^\d+$/.test(m)) m = document.body.innerHTML.substr(document.body.innerHTML.indexOf('object_id=') + 10, 8).replace(/\D/g, '');
        if (!/^\d+$/.test(m)) {
            n = document.location.href.split(/[?/=-]/);
            m = n[n.length - 2];
        }
        if (!/^\d+$/.test(m)) m = n[n.length - 1];
        xmlhttp.open('GET', 'http://www.tvp.pl/shared/cdn/tokenizer_v2.php?object_id=' + m, false);
        xmlhttp.send();
        var o = eval('(' + xmlhttp.responseText + ')');
        maxbitrate = 0;
        maxurl = '';
        for (i = 0; o.formats.length > i; i = i + 1) {
            if ((o.formats[i].totalBitrate > maxbitrate) && (o.formats[i].adaptive == false)) {
                maxbitrate = o.formats[i].totalBitrate;
                maxurl = o.formats[i].url;
            }
        }
//document.location.href=maxurl;
texxtIpla(maxurl);
}

function PokazLinkTvpA(){
var xmlhttp = new XMLHttpRequest();
        m = document.body.innerHTML.substr(document.body.innerHTML.indexOf('data-video-id=') + 15, 8).replace(/\D/g, '');
        if (!/^\d+$/.test(m)) m = document.body.innerHTML.substr(document.body.innerHTML.indexOf('data-videoid=') + 14, 8).replace(/\D/g, '');
        if (!/^\d+$/.test(m)) m = document.body.innerHTML.substr(document.body.innerHTML.indexOf('/player/video?id=') + 17, 8);
        if (!/^\d+$/.test(m)) m = document.body.innerHTML.substr(document.body.innerHTML.indexOf('/player/') + 8, 8);
        if (!/^\d+$/.test(m)) m = document.body.innerHTML.substr(document.body.innerHTML.indexOf('video_id=') + 9, 8).replace(/\D/g, '');
        if (!/^\d+$/.test(m)) m = document.body.innerHTML.substr(document.body.innerHTML.indexOf('object_id:') + 10, 9).replace(/\D/g, '');
        if (!/^\d+$/.test(m)) m = document.body.innerHTML.substr(document.body.innerHTML.indexOf('amp;object_id=') + 14, 8).replace(/\D/g, '');
        if (!/^\d+$/.test(m)) m = document.body.innerHTML.substr(document.body.innerHTML.indexOf('object_id=') + 10, 8).replace(/\D/g, '');
        if (!/^\d+$/.test(m)) {
            n = document.location.href.split(/[?/=-]/);
            m = n[n.length - 2];
        }
        if (!/^\d+$/.test(m)) m = n[n.length - 1];
        xmlhttp.open('GET', 'http://www.tvp.pl/shared/cdn/tokenizer_v2.php?object_id=' + m, false);
        xmlhttp.send();
        var o = eval('(' + xmlhttp.responseText + ')');
        maxbitrate = 0;
        maxurl = '';
        for (i = 0; o.formats.length > i; i = i + 1) {
            if ((o.formats[i].totalBitrate > maxbitrate && o.formats[i].totalBitrate < 2000000) && (o.formats[i].adaptive == false)) {
                maxbitrate = o.formats[i].totalBitrate;
                maxurl = o.formats[i].url;
            }
        }
//document.location.href=maxurl;
texxtIpla(maxurl);
}

function PokazLinkTvpB(){
var xmlhttp = new XMLHttpRequest();
        m = document.body.innerHTML.substr(document.body.innerHTML.indexOf('data-video-id=') + 15, 8).replace(/\D/g, '');
        if (!/^\d+$/.test(m)) m = document.body.innerHTML.substr(document.body.innerHTML.indexOf('data-videoid=') + 14, 8).replace(/\D/g, '');
        if (!/^\d+$/.test(m)) m = document.body.innerHTML.substr(document.body.innerHTML.indexOf('/player/video?id=') + 17, 8);
        if (!/^\d+$/.test(m)) m = document.body.innerHTML.substr(document.body.innerHTML.indexOf('/player/') + 8, 8);
        if (!/^\d+$/.test(m)) m = document.body.innerHTML.substr(document.body.innerHTML.indexOf('video_id=') + 9, 8).replace(/\D/g, '');
        if (!/^\d+$/.test(m)) m = document.body.innerHTML.substr(document.body.innerHTML.indexOf('object_id:') + 10, 9).replace(/\D/g, '');
        if (!/^\d+$/.test(m)) m = document.body.innerHTML.substr(document.body.innerHTML.indexOf('amp;object_id=') + 14, 8).replace(/\D/g, '');
        if (!/^\d+$/.test(m)) m = document.body.innerHTML.substr(document.body.innerHTML.indexOf('object_id=') + 10, 8).replace(/\D/g, '');
        if (!/^\d+$/.test(m)) {
            n = document.location.href.split(/[?/=-]/);
            m = n[n.length - 2];
        }
        if (!/^\d+$/.test(m)) m = n[n.length - 1];
        xmlhttp.open('GET', 'http://www.tvp.pl/shared/cdn/tokenizer_v2.php?object_id=' + m, false);
        xmlhttp.send();
        var o = eval('(' + xmlhttp.responseText + ')');
        maxbitrate = 5000000;
        maxurl = '';
        for (i = 0; o.formats.length > i; i = i + 1) {
            if ((o.formats[i].totalBitrate < maxbitrate) && (o.formats[i].adaptive == false)) {
                maxbitrate = o.formats[i].totalBitrate;
                maxurl = o.formats[i].url;
            }
        }
//document.location.href=maxurl;
texxtIpla(maxurl);
}

function PokazLinkPobieranieIpla(){
    var strona = document.body.innerText;
    var search1newnew = strona.indexOf('"quality_p": "1080p"');
    if (search1newnew > -1){
    var strona0newnew = strona.substr(0,search1newnew);
    var search2newnew = strona0newnew.lastIndexOf('"url":');
    if (search2newnew > -1){
    strona0newnew = strona0newnew.substr(search2newnew+8);
    var search3newnew = strona0newnew.indexOf('",');
    if (search3newnew > -1){
    strona0newnew  = strona0newnew.substr(0,search3newnew);
    texxtIpla(strona0newnew);
    }
    }
    }
    else {
    var search1new = strona.indexOf('"quality_p": "720p"');
    if (search1new > -1){
    var strona0new = strona.substr(0,search1new);
    var search2new = strona0new.lastIndexOf('"url":');
    if (search2new > -1){
    strona0new = strona0new.substr(search2new+8);
    var search3new = strona0new.indexOf('",');
    if (search3new > -1){
    strona0new = strona0new.substr(0,search3new);
    texxtIpla(strona0new);
    }
    }
    }
    else {
    var search1 = strona.indexOf('"video": "');
    var search2 = strona.substr(search1+10);
    var search3 = search2.indexOf('",');
    var search4 = search2.substr(0,search3);
    var link = search4
    texxtIpla(link);
    }
    }
}

function PokazLinkCda(){
texxtIpla(l);
}


var btnIpla = document.createElement( 'input' );
with( btnIpla ) {
  setAttribute( 'onclick', 'PokazLink()' );
    setAttribute( 'value', 'Pobierz video' );
  setAttribute( 'type', 'button' );
  setAttribute( 'id', 'btnIpla' );
  setAttribute("style", "position:fixed !important; left: 0px; top: 4px; width: 140px; height: 35px; background-color: #00a6ff; color: white; z-index: 1000000000;");
}


var btnOnet = document.createElement( 'input' );
with( btnOnet ) {
  setAttribute( 'onclick', 'PokazLink()' );
  setAttribute( 'value', 'Pobierz video' );
  setAttribute( 'type', 'button' );
  setAttribute( 'id', 'btnOnet' );
  setAttribute("style", "position:fixed !important; left: 0px; top: 2px; width: 110px; height: 25px; background-color: #2fd6ff; z-index: 1000000000;");
}

var btnTvp = document.createElement( 'input' );
with( btnTvp ) {
  setAttribute( 'onclick', 'PokazLink()' );
  setAttribute( 'value', 'Pobierz w: HD' );
  setAttribute( 'type', 'button' );
  setAttribute( 'id', 'btnTvp' );
  setAttribute("style", "position:fixed !important; left: 0px; top: 10px; width: 100px; height: 35px;  z-index: 1000000000;");
}

var btnTvpa = document.createElement( 'input' );
with( btnTvpa ) {
  setAttribute( 'onclick', 'PokazLink()' );
    setAttribute( 'value', 'MQ' );
  setAttribute( 'type', 'button' );
  setAttribute( 'id', 'btnTvpa' );
    setAttribute("style", "position:fixed !important; left: 102px; top: 10px; width: 40px; height: 35px;  z-index: 1000000000;");
}

var btnTvpb = document.createElement( 'input' );
with( btnTvpb ) {
  setAttribute( 'onclick', 'PokazLink()' );
    setAttribute( 'value', 'LQ' );
  setAttribute( 'type', 'button' );
  setAttribute( 'id', 'btnTvpb' );
    setAttribute("style", "position:fixed !important; left: 144px; top: 10px; width: 40px; height: 35px;  z-index: 1000000000;");
}





var btnCda = document.createElement( 'input' );
with( btnCda ) {
  setAttribute( 'onclick', 'PokazLink()' );
  setAttribute( 'value', 'Pobierz video' );
  setAttribute( 'type', 'button' );
  setAttribute( 'id', 'btnCda' );
  setAttribute("style", "position:fixed !important; left: 0px; top: 2px; width: 95px; height: 30px;  z-index: 1000000000;");
}

/*var btn2 = document.createElement( 'input' );
with( btn2 ) {
  setAttribute( 'onclick', 'RozpocznijPobieranie()' );
  setAttribute( 'value', 'Pobierz' );
  setAttribute( 'type', 'button' );
  setAttribute( 'id', 'btn2' );
    setAttribute("style", "position:fixed !important; left: 0px; top: 75px; left: 117px; width: px; height: 35px; background-color: #00a6ff; color: white");
}*/

function start() {
    if (Wlacz_skrypt){
    var url = window.location.href;
       //alert(url);
     if (url.indexOf("www.ipla.tv") > -1) {
    document.getElementsByTagName( 'body' )[ 0 ].appendChild( btnIpla );
   // document.getElementsByTagName( 'body' )[ 0 ].appendChild( btn2 );
        
        addEvent(document.getElementById('btnIpla'), 'click', function() {
            PokazLinkIpla();
            });
        /*addEvent(document.getElementById('btn2'), 'click', function() {
            RozpocznijPobieranie();
        });*/
        }
        else if (url.indexOf("getmedia.redefine.pl") > -1) {
           // alert('getmedia');
            PokazLinkPobieranieIpla();
        }
         else if (url.indexOf("player.pl") > -1) {
    document.getElementsByTagName( 'body' )[ 0 ].appendChild( btn );
   // document.getElementsByTagName( 'body' )[ 0 ].appendChild( btna );
    document.getElementsByTagName( 'body' )[ 0 ].appendChild( btnb );
   /* document.getElementsByTagName( 'body' )[ 0 ].appendChild( btn2 );
    document.getElementsByTagName( 'body' )[ 0 ].appendChild( btn2a );
    document.getElementsByTagName( 'body' )[ 0 ].appendChild( btn2b );*/
        addEvent(document.getElementById('btn1'), 'click', function() {
            PokazLink();
        });
        /*addEvent(document.getElementById('btn1a'), 'click', function() {
            PokazLinkA();
        });*/
        addEvent(document.getElementById('btn1b'), 'click', function() {
            PokazLinkB();
        });
        /*addEvent(document.getElementById('btn2'), 'click', function() {
            RozpocznijPobieranie();
        });
        addEvent(document.getElementById('btn2a'), 'click', function() {
            RozpocznijPobieranieA();
        });
        addEvent(document.getElementById('btn2b'), 'click', function() {
            RozpocznijPobieranieB();
             });*/
    }
            else if (url.indexOf("vod.pl") > -1) {
            document.getElementsByTagName( 'body' )[ 0 ].appendChild( btnOnet );
            addEvent(document.getElementById('btnOnet'), 'click', function() {
            PokazLinkOnet();
            });
            }
            else if (url.indexOf("tvp.pl") > -1) {
             if (url.indexOf("vod.tvp.pl/vod/slider") == -1) {
             if (url.indexOf("tvp.pl/sess/tvplayer.php?") == -1) {
            document.getElementsByTagName( 'body' )[ 0 ].appendChild( btnTvp );
            addEvent(document.getElementById('btnTvp'), 'click', function() {
            PokazLinkTvp();
            });
            document.getElementsByTagName( 'body' )[ 0 ].appendChild( btnTvpa );
            addEvent(document.getElementById('btnTvpa'), 'click', function() {
            PokazLinkTvpA();
            });
            document.getElementsByTagName( 'body' )[ 0 ].appendChild( btnTvpb );
            addEvent(document.getElementById('btnTvpb'), 'click', function() {
            PokazLinkTvpB();
            });
            }
            }
            }
            else if (url.indexOf("www.cda.pl") > -1){
            document.getElementsByTagName( 'body' )[ 0 ].appendChild( btnCda );
            addEvent(document.getElementById('btnCda'), 'click', function() {
            PokazLinkCda();
            });
            }
    }
}

window.onload=start();
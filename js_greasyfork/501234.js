// ==UserScript==
// @name         Emucool
// @namespace    ROM Download
// @author       Ari
// @version      1
// @description  Sites suportados: CoolRom, EmuParadise
// @include      *://coolrom.com/roms/*
// @include      *://www.coolrom.com/roms/*
// @include      *://coolrom.com.au/*
// @include      *://*emuparadise.me/*/*/*
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501234/Emucool.user.js
// @updateURL https://update.greasyfork.org/scripts/501234/Emucool.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* Adds Element BEFORE NeighborElement */
    Element.prototype.appendBefore = function(element) {
        element.parentNode.insertBefore(this, element);
    }, false;

    /* Adds Element AFTER NeighborElement */
    Element.prototype.appendAfter = function(element) {
        element.parentNode.insertBefore(this, element.nextSibling);
    }, false;

    var website = window.location.href

    //COOLROOM
    if(website.indexOf('coolrom.com') != -1){

        var appendInterval, iframeInterval, idInterval, iframe, query, setTime, downloadUrl;

        iframe = document.createElement('iframe');
        iframe.style = 'display:none';
        query = "";
        idInterval = setInterval(function () {
            var element = document.querySelector('a[href*="/dlpop.php"], a[href*="/downloader"]');
            if (element) {
                element = document.querySelector('a[href*="/downloader"]');
                if (element) {
                    query = element.href.split("?", 2)[1];
                } else {
                    element = document.querySelector('a[href*="/dlpop.php"]');
                    if (element) {
                        query = element.href.replace(/[^\?]+\?([^']+).*/, "$1");
                    }
                }
                iframe.src = '/dlpop.php?' + query;
                clearInterval(idInterval);
            }
        }, 1);

        appendInterval = setInterval(function () {
            if (document.body) {
                document.body.appendChild(iframe);
                clearInterval(appendInterval);
            }
        }, 1);

        iframeInterval = setInterval(function () {
            var links, input;

            if (iframe.contentWindow && !setTime) {
                Object.defineProperty(iframe.contentWindow, 'time', {value: 0});
                setTime = true;
            }

            input = iframe.contentDocument && iframe.contentDocument.getElementsByTagName('input')[0];
            if (input) {
                clearInterval(iframeInterval);
                downloadUrl = input.parentNode.action;
                links = document.querySelectorAll('a[href*="/dlpop.php"], a[href*="/downloader"]');
                Array.prototype.forEach.call(links, function (a) {
                    a.href = downloadUrl;
                });
                var center = document.querySelectorAll('center')[1];
                if (center && center.textContent && (center.textContent.indexOf('Este título está protegido') > -1 || center.textContent.indexOf("title is protected") > -1)) {
                    var div = document.createElement('center');
                    div.innerHTML = '<div class="container"><style>.download-button {position: absolute;top: 50%;left: 54.5%;transform: translate(-50%, -50%);font-family: Verdana;font-style: bold;font-size: 18px;color: #FFFFFF;}</style><a class="download_link" href="' + downloadUrl + '"><img src="/images/download_button2.png" alt="download" style="width:300px;"><div class="download-button">DOWNLOAD</div></a></div>';
                    center.insertBefore(div, center.childNodes[13]);
                    center.removeChild(center.childNodes[14]);

                }
                console.log(downloadUrl);

                iframe.src = 'about:blank';
                if (confirm('Download agora?')) {
                    // Save it!
                    window.location = downloadUrl;
                }
            }
        }, 1);

        Object.defineProperty(window, 'open', {value: function (url) {
            var inter;
            if (url.substr(0, 10) === '/dlpop.php') {
                inter = setInterval(function () {
                    if (downloadUrl) {
                        window.location = downloadUrl;
                        clearInterval(inter);
                    }
                }, 10);
            } else {
                window.location = url;
            }
            return true;
        }});
    }
    //EMUPARADISE
    if(website.indexOf('emuparadise.me') != -1){
        let ipDownload = "50.7.189.186";

        //const urlFirstPart = "http://" + ipDownload + "/happyxhJ1ACmlTrxJQpol71nBc/";
        let urlFirstPart = "http://" + ipDownload + "/happyFJUja181NACLukHITRY719/";

        if(website.indexOf('web.archive.org') != -1){

            var ht = document.body.innerHTML

            let lindex = ht.indexOf("Size: ");
            let findex = ht.lastIndexOf("http://", lindex);
            let urlLastPart = ht.slice(findex, lindex).match(/\d+\.\d+\.\d+\.\d+\/(.*)"/)[1];
            urlLastPart = urlLastPart.replace(/ /g, "%20"); // encodeURI() changes #, e.g. Sonic - The Comic Issue No. 001 Scan


            var original_wayback_link = "";
            //remove the id
            urlLastPart = urlLastPart.substr(urlLastPart.indexOf('/')+1)
            GM_setValue('magazine-comic-guide-scans', urlLastPart)

            console.log(urlLastPart);
            console.log('Download'+urlFirstPart + urlLastPart)
            var link = '"<a href="' + urlFirstPart + urlLastPart + '">Download</a>"'
            window.location.href = 'about:blank';
            var load_event = new Event("load");
            window.dispatchEvent(load_event);
            return;
        }
        var fastload;
        // Others: 50.7.189.186
        //const ipDownload = "50.7.92.186";
        //1


        var platform = document.URL.split("/")[3];

        if (platform == "Sega_Dreamcast_ISOs") {

            let id = document.URL.split("/")[5]
            if(id.indexOf('-download') != -1){


                const inject_location = document.querySelector('#content > h3')
                inject_location.innerHTML = 'Download nesta página não funciona para Dreamcast';
                const xxx = document.createElement("div");
                xxx.innerHTML = '<a href="'+window.location.href.split('-download')[0]+'">Ir para página de download</a>'
                xxx.appendAfter(inject_location)


                if(confirm('Download nesta página não funciona para Dreamcast, queres ser redirecionado para página onde funciona em '+window.location.href.split('-download')[0] + ' ???')){
                    window.location = window.location.href.split('-download')[0]
                }
                return;
            }
            document.querySelector('a[href="#Download"]').click()
            let downs = document.querySelectorAll("p > a[title^=Download]");
            for (let i = 0; i < downs.length; i++) {
                let findex = 9; // "Download X"
                let lindex = downs[i].title.lastIndexOf(" ISO");
                downs[i].href = urlFirstPart + "Dreamcast/" + downs[i].title.slice(findex, lindex);
                console.log(urlFirstPart + "Dreamcast/" + downs[i].title.slice(findex, lindex))
            }
        }
        // match https://www.emuparadise.me/magazine-comic-guide-scans/%NAME%/%ID%
        else if (platform == "magazine-comic-guide-scans") {

            const webArchiveURL = "https://web.archive.org/web/2016/";
            const www = webArchiveURL + document.URL

            let down = document.querySelectorAll("#content > p")[0];
            if(down){
                let info = document.querySelectorAll("#content > div[align=center]")[0];
                let filename = info.children[0].textContent.slice(0, -5); // "X Scan"
                let cat = {
                    "Gaming Comics @ Emuparadise": "may/Comics/",
                    "Gaming Magazines @ Emuparadise": "may/Mags/"
                }[info.children[1].textContent] || "";

                /*down.style.fontSize = '16px';

                down.innerHTML = "<div>Download (Atualizado) "
                    + "<a href=" + urlFirstPart + cat + encodeURIComponent(filename) + ".cbr" + ">cbr</a> or "
                    + "<a href=" + urlFirstPart + cat + encodeURIComponent(filename) + ".rar" + ">rar</a>"
                    + "</div>";

                ipDownload = "50.7.161.234"
                urlFirstPart = "http://" + ipDownload + "/998ajxYxajs13jAKhdca/";
                down.innerHTML += "<div>WaybackMachine (Atualizado, Lento): "
                    + "<a href=" + urlFirstPart + cat + encodeURIComponent(filename) + ".cbr" + ">cbr</a> or "
                    + "<a href=" + urlFirstPart + cat + encodeURIComponent(filename) + ".rar" + ">rar</a>"
                    + "</div>";
            */
                down.innerHTML = 'A obter link, aguarda!';
                document.querySelector('span.help').innerText = 'Clique no link com botão do Lado Direito + Salvar link como...';
                document.querySelector('#content > h2').innerHTML += `<p style="padding-left:20px; font-size:15px;">(Link de Download ira aparecer em alguns segundos, caso nao apareça fazer refresh)</p>
            <div id="iframe_location"></div>`
                //<iframe id="myFrame" referrerpolicy="unsafe-url" onload="alert('lol')" style="width:100%;" src="${www}"></iframe>`

                var myframe = document.createElement('iframe');
                myframe.addEventListener("load", function() {
                    var link_recommended = document.createElement('a');
                    link_recommended.setAttribute('href', urlFirstPart + GM_getValue('magazine-comic-guide-scans'))
                    link_recommended.innerText = 'Download (Opçao 1)';


                    ipDownload = "162.210.194.49";
                    urlFirstPart = "http://" + ipDownload + "/happyFJUja181NACLukHITRY719/";
                    var link_wayback = document.createElement('a');
                    link_wayback.setAttribute('href', urlFirstPart + GM_getValue('magazine-comic-guide-scans'))
                    link_wayback.innerText = 'Download (Opcão 2)';

                    down.innerHTML = 'Successo!';
                    document.getElementById('iframe_location').appendChild(link_recommended);
                    document.getElementById('iframe_location').innerHTML += '<br>';
                    document.getElementById('iframe_location').appendChild(link_wayback);

                }); // before setting 'src'
                myframe.src = www;
                myframe.setAttribute('referrerpolicy',"unsafe-url")
                myframe.setAttribute('style', 'display:block')
                document.getElementById('iframe_location').appendChild(myframe);


            }






        } else {
            let id = document.URL.split("/")[5]
            if(id.indexOf('#') != -1)
                id = id.split('#')[0]

            if(id.indexOf('-download') != -1){
                id = id.replace('-download','');
                const inject_location = document.querySelector('#content > h3')
                const xxx = document.createElement("div");
                inject_location.innerHTML=''
                xxx.appendAfter(inject_location)
                unlock_dl(id,xxx)

            }else{

                const dl = document.querySelector('.download-link');
                unlock_dl(id,dl)
                document.querySelector('a[href="#Download"]').click()

            }


            function unlock_dl(id, dl){
                let div = document.createElement("div");
                div.innerHTML = `
            <h1 style="color:orange">Dowload Desbloqueado!</h1>
            <span onclick="help_download()" id="help_dl" style="font-size: 14px; border-bottom:1px solid orange; cursor:pointer;margin-bottom:10px;">Ajuda para download?</span>

<div id="help_dl_instructions" style="display:none;border:1px solid orange;padding:4px;margin-top:-2px">
            <span class="help">    Clique no link com botão do Lado Direito + Salvar link como...</span>
</div><br>
`;
                dl.insertBefore(div, dl.firstChild);

                var help_download = document.createElement('script');
                help_download.innerHTML = `function help_download(){
                    const display = document.getElementById('help_dl_instructions').style.display
                    if(display == 'none'){
                        document.getElementById('help_dl_instructions').style.display = 'block'
                    }else{
                        document.getElementById('help_dl_instructions').style.display = 'none';
                    }
                }`
                document.body.appendChild(help_download);



                const broken_dl = dl.querySelector('a');
                let title='', txt=''
                if(broken_dl){
                    title = broken_dl.getAttribute('title')
                    txt = broken_dl.innerText;
                    broken_dl.innerHTML = `<br><br>>>> <a target="_blank" href="/roms/get-download.php?gid=${id}&test=true" title="${title}">${txt}</a> <<<`
                    return
                }

                if(title == '')
                    title = 'Download'
                if(txt == '')
                    txt = 'Download'

                div.innerHTML += `<br>>>> <a style="font-size:16px" target="_blank" href="/roms/get-download.php?gid=${id}&test=true" title="${title}">${txt}</a> <<<`


            }
        }

    }
}());

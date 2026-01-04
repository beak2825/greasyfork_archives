// ==UserScript==
// @name         Script para ies
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Script que agrega funcionalidades al tid
// @author       Falaz
// @match        http://tid.ies21.edu.ar/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/32993/Script%20para%20ies.user.js
// @updateURL https://update.greasyfork.org/scripts/32993/Script%20para%20ies.meta.js
// ==/UserScript==

(function init() {
    try{
        var tiempoInicial = new Date();
        var a = document.querySelector('.ui-grid-c');
        var li = document.createElement('li');
        li.classList.add('ui-block-d');
        li.id = "achild";
        li.innerHTML = '<a href="javascript:void(0)" data-icon="gear" data-ajax="false" data-corners="false" data-shadow="false" data-theme="a" class="ui-btn ui-btn-up-a ui-btn-inline ui-btn-icon-top"><span class="ui-btn-inner"><span class="ui-btn-text">Falaz´s tools    </span><span class="ui-btn-text" id="TimeSpan">00:00</span><span class="ui-icon ui-icon-gear ui-icon-shadow ">&nbsp;</span></span></a>';
        try {
            a.appendChild(li);
            a.classList.remove('ui-grid-c');
            a.classList.add('ui-grid-d');
        } catch (error) {
            console.log("Será porque lo hace dos veceS?");
        }
        li.onclick = function () {
            tiempoInicial = new Date();
            console.log("me hiciste click:D");
            return false;
        };
        var timeSpan = document.querySelector('#TimeSpan');

        // Calcular tiempo de lectura
        var todosLosP = document.getElementsByTagName("p");
        var texto = "";
        for (var i = 0; i < todosLosP.length; i++) {
            texto += (todosLosP[i].innerText);
        }
        texto = texto.replace(/[ ]+/g, " ");
        texto = texto.replace(/^ /, "");
        texto = texto.replace(/ $/, "");
        var textoTroceado = texto.split(" ");

        var numeroPalabras = textoTroceado.length;

        console.log("Palabras contadas: " + numeroPalabras);
        console.log("El tiempo estimado de lectura, se basa en unas 150 o 100 palabras por minuto");
        console.log("Tiempo inicial: " + tiempoInicial);
        try{
            timeSpan.innerText = Math.round(numeroPalabras / 170) + " - " + Math.round(numeroPalabras / 130) + " min aprox\n";
        }catch(error){}
        var time = setInterval(myTimer, 1000);

        function myTimer() {
            var c = new Date();
            var segundos = (c.getTime() - tiempoInicial.getTime()) / 1000;
            var min = Math.floor(segundos / 60);
            segundos = Math.round(segundos % 60);

        }

        function replaceLinks() {
            var botones = document.getElementsByClassName('ui-btn');
            var linksPrincipal = document.getElementsByClassName('ui-link-inherit');
            var i = 0;
            for (i = 0; i < linksPrincipal.length; i++) {
                linksPrincipal[i].onclick = function () {
                    $(document).on('pageshow', function (e) {
                        init();
                    });
                };
            }
            // for (i = 0; i < botones.length; i++) {
            //     botones[i].onclick = function () {
            //         $(document).on('pageshow', function (e) {
            //             init();
            //         });
            //     };
            // }
            //console.log("links reemplazados");
        }

        function replaceMedia() {
            var medias = $('.textoc'),
                mediasLinks = $('a'),
                medias2 = $('.tc'),
                link, tipo, div, i = 0;
            for (i = 0; i < medias.length; i++) {
                if (medias[i].children) {
                    console.log("tiene hijos");
                    if (medias[i].children.length > 0 && medias[i].children[0] !== null) {
                        link = '';
                        tipo = 'video';
                        link = medias[i].children[0].href;
                        div = document.createElement('div');
                        replaceVideo(link, div, medias[i]);
                        div.id = 'media' + [i];
                        medias[i].appendChild(div);
                    }
                }
                // $('#media' + [i]).load(link + '#containingBlock');
            }
            for(i = 0;i<medias2.length;i++){
                if(medias2[i].children){
                    if(medias2[i].children.length >0 && medias2[i].children[0] !== null){
                        link = "";
                        tipo = 'object';
                        link = medias2[i].children[0].href;
                        div = document.createElement('div');
                        replaceVideo(link,div,medias2[i]);
                        div.id = "media" + medias2[i];
                        medias2[i].appendChild(div);
                    }
                }
            }
            for (i = 0; i < mediasLinks.length; i++) {
                if (mediasLinks[i].href.match(/media/)) {
                    if (mediasLinks[i].attributes.getNamedItem('data-rel') == null) {
                        //console.log(mediasLinks[i].href);
                        link = '';
                        tipo = 'object';
                        link = mediasLinks[i].href;
                        div = document.createElement('div');
                        replaceVideo(link, div, mediasLinks[i]);
                        div.id = 'media' + [i];
                        mediasLinks[i].appendChild(div);
                    }
                }
            }
        }

        function replaceVideo(link, div, medias) {
            if(link === undefined){/*console.log(link, div, medias);*/return null;}
            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;

            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4 && div.dataset.tipo == undefined) {
                    //tomar el iframe del response. Para los videos de youtube.
                    if (xhr.response.includes('iframe')) {
                        //remove link and img from div

                        medias.children[0].remove();
                        var index = xhr.response.indexOf('<iframe');
                        var j = xhr.response.lastIndexOf('iframe>');
                        j += 7;
                        var iframetext = xhr.response.substring(index, j);
                        var iframeSrc = iframetext.match(/src="([^"]+)"/);
                        var iframe = document.createElement('iframe');
                        iframe.src = iframeSrc[1];
                        iframe.height = 400;
                        iframe.width = 600;
                        div.dataset.tipo = "video";
                        div.appendChild(iframe);
                        //   div.append("aquí estaba un video");
                    } else if (xhr.response.includes('video')){
                        medias.children[0].remove();
                        var iVideo = xhr.response.indexOf('<video');
                        var jVideo = xhr.response.indexOf('video>');
                        var videotext = xhr.response.substring(iVideo, jVideo);
                        var src = videotext.match(/src="([^"]+)\./);
                        var video = document.createElement('video');
                        video.controls = true;
                        video.poster = src[1] + ".jpg";
                        video.width = 640; video.height = 480;
                        //in video
                        var source = document.createElement('source');source.src = src[1] + ".mp4";source.type = "video/mp4";
                        var object = document.createElement('object');object.width ="100%";object.height=480;object.type = "application/x-shockwave-flash";object.data = "fp//flashmediaelement.swf";
                        //in object
                        var paramMovie = document.createElement('param');paramMovie.name = "movie"; paramMovie.value = "fp/flashmediaelement.swf";
                        var paramAllow = document.createElement('param');paramAllow.name = "allowScriptAccess";paramAllow.value="always";
                        var paramFlash = document.createElement('param');paramFlash.name = "flashvars";paramFlash.value = "autoplay=false&autohide=false&controls=true&file=../" + src[1] + ".mp4";
                        var paramImg = document.createElement('img');paramImg.width = 640;paramImg.height = 480;paramImg.src = src[1] + ".jpg";
                        object.appendChild(paramMovie);object.appendChild(paramAllow);object.appendChild(paramFlash);object.appendChild(paramImg);
                        video.appendChild(source);
                        video.appendChild(object);
                        div.appendChild(video);
                        //console.log("incluye video :DD");
                        div.dataset.tipo = "video";
                    } else if (xhr.response.includes('object')) {
                        //console.log("Soy un object :D");
                        medias.children[0].remove();
                        var iObject = xhr.response.indexOf('<object');
                        var jObject = xhr.response.indexOf('.swf"');
                        //console.log(iObject, jObject);
                        jObject += 5;
                        var objectText = xhr.response.substring(iObject, jObject);
                        var objectData = objectText.match(/data="([^"]+)"/);
                        var objectWidth = objectText.match(/width="([^"]+)"/);
                        var objectHeight = objectText.match(/height="([^"]+)"/);
                        var iframeObject = document.createElement('object');
                        iframeObject.data = objectData[1];
                        iframeObject.height = parseInt(objectHeight[1]) + 100;
                        //if (objectWidth[1].match(/%/)){
                        //    iframeObject.width = 600;
                        //}else{
                        iframeObject.width = objectWidth[1];
                        //}
                        div.dataset.tipo = "object";
                        div.appendChild(iframeObject);
                    }else if(xhr.response.includes('div id="containingBlock"')){
                        //console.log("Es una imagen :DD");
                    } else {
                        //console.log("hola, agregué un iframe :D");
                        medias.children[0].remove();
                        var iFrameEntirePage = document.createElement('iframe');
                        iFrameEntirePage.src = link;
                        iFrameEntirePage.width = 800;
                        iFrameEntirePage.height = 600;
                        var exist = false;
                        div.appendChild(iFrameEntirePage);
                        div.dataset.tipo = "iframe";

                    }

                }
            });
            xhr.open("GET", link);
            xhr.send('cache-control');
        }

        setTimeout(replaceLinks(), 1000);
        setTimeout(replaceMedia(), 1000);
        document.onmouseup = function(e) {
            if(e.srcElement.localName == "p"){
                if (e.shiftKey){apptx.mSeleccion(1);}
                else{apptx.mSeleccion(2);}
            }
        };
    }catch(error){}
})();
// ==UserScript==
// @name         autoplay musica en los diferidos de ElisaWaves
// @namespace    Juritobi
// @version      0.4
// @description  Lee el chat buscando las canciones que se ponen en el directo y automaticamente abre una ventana de spotify con la busqueda de la canción
// @author       juritobi
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @include      https://www.twitch.tv/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/429804/autoplay%20musica%20en%20los%20diferidos%20de%20ElisaWaves.user.js
// @updateURL https://update.greasyfork.org/scripts/429804/autoplay%20musica%20en%20los%20diferidos%20de%20ElisaWaves.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const idStrings = ['la cancion que suena ahora es',
                       'la cancion que suena es',
                       'la cancion que esta sonando es',
                       'la cancion que esta sonando ahora es',
                       'la cancion que suena ahorita es',
                       'la cancion es',
                       'song: '];

    const Observer = new MutationObserver(OnNewComment);
    let ChatList = [];
    let playing = "";
    let spwindow = null;

    let ChatGetInterval = setInterval(() => {
        ChatList = $("div.video-chat__message-list-wrapper > div > ul");
        if(ChatList.length > 0)
        {
            Observer.observe(ChatList[0], {childList: true});
            clearInterval(ChatGetInterval);
        }
    }, 50);

    function normalizeMessage(string){
        return string.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    function nomalizeSearch(string){
        return string.replace(/[&\/\\#,+$~%.'":*?<>{}-]/g, ' ').replace(' de ', ' ').replace(' De ', ' ').replace(/\s\s+/g, ' ');
    }

    function OnNewComment(mutationsList, observer)
    {
        for(let i = 0; i < mutationsList.length; i++)
        {
            if(mutationsList[i].type == 'childList' && mutationsList[i].addedNodes.length > 0)
            {
                for(let j = 0; j < mutationsList[i].addedNodes.length; j++)
                {
                    let message = $(mutationsList[i].addedNodes[j]).find(".text-fragment");
                    if(message.length > 0){
                        let msg = normalizeMessage(message[0].innerText);
                        console.log(msg);
                        for(let k = 0; k < idStrings.length; k++){
                            if(msg.includes(idStrings[k])){
                                if(playing != msg){
                                    playing = msg;

                                    let search = nomalizeSearch(playing.slice(idStrings[k].length));

                                    if(spwindow!=null){
                                        spwindow.location.href = "https://open.spotify.com/search/"+search;
                                    }
                                    else{
                                        spwindow = window.open("https://open.spotify.com/search/"+search ,'Musiquiti','width=770,height=770, top=0, screenX=1150, left=1150');
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }



})();
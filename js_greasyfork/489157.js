// ==UserScript==
// @license      MIT
// @name         TrafficCitation
// @namespace    http://tampermonkey.net/
// @version      2024-03-05
// @description  trafic citation helper
// @author       Marc Raikenovitch
// @match        https://intra-lapd.forumactif.com/f68-traffic-stop-report
// @match        https://intra-lapd.forumactif.com/post?f=68&mode=newtopic
// @match        https://intra-lapd.forumactif.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/489157/TrafficCitation.user.js
// @updateURL https://update.greasyfork.org/scripts/489157/TrafficCitation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Récupère le dernier Id du traffic citation
    function getLastIdTrafficCitation (){
        var divsForumbg = document.querySelectorAll('div.forumbg');

        var divsForumbgFiltrees = Array.from(divsForumbg).filter(function(div) {
            return div.className.trim() === 'forumbg';
        });

        divsForumbgFiltrees.forEach(function(div) {
            var lienTopictitle = div.querySelector('ul.topiclist.topics.bg_none li a.topictitle');
            if (lienTopictitle) {
                let number = lienTopictitle.innerHTML.split(' ')[2].split('°')[1];
                if(!number){
                    number = lienTopictitle.innerHTML.split(' ')[2].split('#')[1];
                }
                number++;
                sessionStorage.setItem("lastId", number);
            }
        });
    }

    function setSubjectTitle(lastId){
        var inputElement = document.querySelector('input[title="La longueur du titre de ce sujet doit être comprise entre 1 et 255 caractères"]');

        if (inputElement) {
            inputElement.value = 'TRAFFIC CITATION N°' + lastId +  sessionStorage.getItem("title");
        }
    }

    function setTemplateTrafficCitation(){
        var inputArea = document.querySelector('div.sceditor-container textarea');
        if (inputArea) {
            inputArea.value = sessionStorage.getItem("template");
        }
    }

    function getNameConnect(){
        var a = document.querySelector('a[id="logout"]');
        const name = a.innerText.split('[')[1].split(']')[0].substring(1).slice(0, -1)
        return name;
    }

    function getTrafficStations(){
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://traffic-helper.vercel.app/api/trafficStation/getTrafficStations",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                name: getNameConnect(),
            }),
            onload: function(response) {
                try {
                    const jsonResponse = JSON.parse(response.responseText);
                    console.log(jsonResponse)
                    if(jsonResponse.traffic !== null){
                        console.log('Aucune donnée reçue');
                        sessionStorage.setItem("stopRefreshData", "false");
                        sessionStorage.setItem("template", jsonResponse.traffic.template)
                        sessionStorage.setItem("title", jsonResponse.traffic.title)
                        getLastIdTrafficCitation()
                        window.location = 'https://intra-lapd.forumactif.com/post?f=68&mode=newtopic'
                    }
                } catch (e) {
                    console.error("Erreur lors du parsing JSON:", e);
                }
            },
            onerror: function(error) {
                console.error('Erreur requête:', error);
            }
        });
    }

    function deleteTrafficStation(){
        return new Promise((resolve, reject)=>{
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://traffic-helper.vercel.app/api/trafficStation/deleteTraffictStation",
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({
                    name: getNameConnect(),
                }),
                onload: function(response) {
                    try {
                        const jsonResponse = JSON.parse(response.responseText);
                        console.log(jsonResponse);
                        return jsonResponse;
                    } catch (e) {
                        console.error("Erreur lors du parsing JSON:", e);
                    }
                },
                onerror: function(error) {
                    console.error('Erreur requête:', error);
                }
            });
        })
    }

    function sendTrafficStation(name, title, template){
        var button = document.querySelector('input[class="button1"]');
        sessionStorage.setItem("posted", "true");
        button.click();
    }

    if(window.location == 'https://intra-lapd.forumactif.com/f68-traffic-stop-report'){
        sessionStorage.setItem("stopRefreshData", "true");
        sessionStorage.setItem("posted", "false");
        setInterval(()=>{
            if(sessionStorage.getItem("stopRefreshData") === "false")
                return
            getTrafficStations()
        },10000)
    }


    if(window.location == 'https://intra-lapd.forumactif.com/post?f=68&mode=newtopic'){
        setSubjectTitle(sessionStorage.getItem("lastId"))
        setTemplateTrafficCitation()
        sendTrafficStation()
    }

    if(window.location.toString().includes(sessionStorage.getItem("lastId"))){
        if(sessionStorage.getItem("posted") === "false")
            return
        deleteTrafficStation()
        window.location = 'https://intra-lapd.forumactif.com/f68-traffic-stop-report'
    }


})();
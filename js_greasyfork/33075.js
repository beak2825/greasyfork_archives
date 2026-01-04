// ==UserScript==
// @name         123movies
// @namespace    http://joeyism.com/
// @version      0.0.1
// @description  Removes popup, adds a "next episode" or a "next season" button
// @author       joeyism
// @include      http*://*123movies.*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33075/123movies.user.js
// @updateURL https://update.greasyfork.org/scripts/33075/123movies.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function remove(elem){
        elem.parentNode.removeChild(elem);
    }
    function findCurrentEpisodeElement(){
        var url_arr = window.location.href.split("/");
        url_arr.pop();
        var url = url_arr.join("/");
        var this_episode_elem = document.querySelectorAll("a[href^='"+url+"']")[0];
        var next_episode_elem = this_episode_elem.nextElementSibling;
        return { this_episode_elem: this_episode_elem, next_episode_elem: next_episode_elem };
    }
    function findNextSeasonElement(episode_elem){
        episode_elem.next_season_elem = episode_elem.this_episode_elem.parentElement.parentElement.nextElementSibling.firstElementChild.nextElementSibling.firstElementChild
        return episode_elem;
    }
    function createNextEpisodeButton(a, episode_elem){
        a.href= episode_elem.next_episode_elem.href;
        a.innerText = "Next Episode";
        return a;
    }
    function createNextSeasonButton(a, episode_elem){
        a.href= episode_elem.next_season_elem.href;
        a.innerText = "Next Season";
        return a;
    }
    function addNextEpisode(){
        // find next episode name
        var episode_elem = findCurrentEpisodeElement();
        var a = document.createElement("a");
        a.style.float = "right";
        a.style.border = "1px solid black";
        a.style.padding = "5px";

        // create link
        if (episode_elem.next_episode_elem !== null){
            a = createNextEpisodeButton(a, episode_elem);
        }
        else {
            episode_elem = findNextSeasonElement(episode_elem);
            a = createNextSeasonButton(a, episode_elem);
        }

        // append link
        document.getElementsByClassName("active")[0].parentElement.appendChild(a);

    }
    remove(document.getElementsByClassName("gomo-gtx")[0]);
    addNextEpisode();

})();

// ==UserScript==
// @name         GoGoAnime Plus
// @namespace    http://tampermonkey.net/
// @version      1.3.00
// @description  Adds a watch tracker, server ranking, and show ratings to gogoanime.io.
// @author       Togooroo
// @license      ISC
// @match        https://*.gogoanime.io/*
// @require      https://cdn.jsdelivr.net/npm/web-pingjs@1.0.1/ping.min.js
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/405233/GoGoAnime%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/405233/GoGoAnime%20Plus.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var title;
    var pagetype;

    const impexpclientcode = `
    function importData(text){
        var dataObj = JSON.parse(text);
        if (window.confirm('Warning: Importing data will replace existing data. Continue?')){
            localStorage.clear();
            for(var i in dataObj){
                localStorage.setItem(i, dataObj[i]);
            }
            location.reload();
        }else{
            window.alert('Not Imported');
        }
    }

    function handleFile(e){
        var reader = new FileReader();
        var data;
        reader.onload = (text => importData(text.target.result));
        reader.readAsText(importbt.files[0]);
    }

    var importbt = document.getElementById('import-button');
    importbt.addEventListener('change', handleFile);
`

    const injectsrc = `
const realTitle = document.querySelector('.title_name > h2').textContent.trim();
function getRealTitle(){
    var title = document.querySelector('.title_name > h2').textContent.trim();
    if (title.includes('(Watched)')){
       title = title.slice(10);
    }
    return title;
}
function parse(){
   try{
      var titlenode = document.querySelector('.title_name > h2');
      var title = titlenode.textContent.trim();

      var buttonspan = document.getElementById('buttonspan');
      var titleheader = document.querySelector('div.anime_video_body > h1');

      var watched = localStorage.getItem(realTitle);
      //alert(watched);
      if (!watched){
         localStorage.setItem(realTitle, "unwatched");
         parse();
      }if (watched == "watched"){
         buttonspan.textContent = "Mark as Unwatched";
         title = "(Watched) " + realTitle;
         titlenode.textContent = title;
         titleheader.textContent = title;


      }else if (watched == "unwatched"){
         buttonspan.textContent = "Mark as Watched";
         title = realTitle;
         titlenode.textContent = title;
         titleheader.textContent = title;
      }
   }catch(e){
      console.error("*&* " + e);
   }
}

function clicked(){
   try{
      watched = localStorage.getItem(realTitle);
      if (watched){
          if (watched == 'watched'){
               localStorage.setItem(realTitle, 'unwatched');
               parse();
          }
          if (watched == 'unwatched'){
               localStorage.setItem(realTitle, 'watched');
               parse();
          }
      }else if (!watched){
          localStorage.setItem(realTitle, 'unwatched');
       }
   }catch(e){
      console.error('*&* ' + e);
   }
}
var buttonlink = document.getElementById('buttonlink');
buttonlink.addEventListener('click', clicked);
parse();
`


    async function getRatings(){
        function appendRating(ratscore){
            let valuesSection = document.querySelector('div.anime_info_body_bg');
            let plotsumm;
            for (let el in valuesSection.children){
                let node = valuesSection.children[el];
                if (node.textContent.includes('Plot Summary:')){
                    plotsumm = valuesSection.children[el];
                    break;
                }
            }
            let scoreElement = document.createElement('p');
            scoreElement.classList.add('type');
            scoreElement.id = 'mal_rating';
            scoreElement.innerHTML = `<span>Rating:</span> <span id='colorelement'>${ratscore}/10</span>`;

            valuesSection.insertBefore(scoreElement, plotsumm);
            let colorele = document.getElementById('colorelement');
            if (ratscore <= 4.9){
                colorele.style.color = 'red';
            }else if (ratscore <= 5.9){
                colorele.style.color = 'yellow';
            }else if (ratscore <= 7.9){
                colorele.style.color = 'white';
            }else if (ratscore >= 8.0){
                // Green (Default)
            }
        }
        async function checkCache(cval){
            let id = await fetch(`https://api.jikan.moe/v3/search/anime?q=${title}`);
            id = await id.json();
            id = await id.results[0].mal_id;

            let show = await fetch(`https://api.jikan.moe/v3/anime/${id}`);
            show = await show.json();
            let score = await show.score;
            score = await parseFloat(score).toFixed(1);

            if (score != cval){
                document.getElementById('mal_rating').remove();
                appendRating(score);
                localStorage.setItem(`${title}-score`, score);
            }
        }
        let title = document.querySelector('div.anime_info_body_bg > h1').textContent;
        let valuesSection = document.querySelector('div.anime_info_body_bg');

        let cachedValue = localStorage.getItem(`${title}-score`);
        if (cachedValue && !isNaN(cachedValue)){
            console.log('Getting from cache');
            appendRating(cachedValue);
            checkCache(cachedValue);
        }else{
            let id = await fetch(`https://api.jikan.moe/v3/search/anime?q=${title}`);
            id = await id.json();
            id = await id.results[0].mal_id;

            let show = await fetch(`https://api.jikan.moe/v3/anime/${id}`);
            show = await show.json();
            let score = await show.score;
            score = await parseFloat(score).toFixed(1);
            appendRating(score);
            localStorage.setItem(`${title}-score`, score);
        }
    }
    function runTests(){
        var serverList = document.querySelectorAll('div.anime_muti_link > ul > li > a');
        serverList = Array.from(serverList);
        var pings = [];
        serverList.forEach(a => {
            let video = a.dataset.video;
            let name = a.textContent.split('Choose this server')[0]
            a.innerHTML = `${name}: ... <span>Choose this server</span>`;
//             a.id = Math.random().toString(36).substr(7);
            a.classList.add('serveroption');
            pings.push(ping(video, 0.3).then(delta => {
                let aproxdelta = Math.round(delta);
                a.innerHTML = `${name}: ${aproxdelta} <span>Choose this server</span>`;
                a.dataset.ping = aproxdelta;
                a.dataset.truePing = delta;
            }).catch(e => {
                let name = a.textContent.split('Choose this server')[0];
                console.error(e);
                a.innerHTML = `${name}: Error! <span>Choose this server</span>`
                a.dataset.ping = '99999';
                a.dataset.truePing = '99999';
            }));
        });
        Promise.allSettled(pings).then(res => {
            var elements = Array.from(document.querySelectorAll('a.serveroption'));
            elements.sort((a, b) => {
                let an = a.dataset.truePing;
                let bn = b.dataset.truePing;
                return an - bn;
            });
            let div = document.querySelector('div.anime_muti_link')
            let oldul = document.querySelector('div.anime_muti_link > ul');
            let ul = document.createElement('ul');
            ul.id = 'sorted_ul';
            div.prepend(ul);
            ul = document.getElementById('sorted_ul');
            elements.forEach(node => {
                node = node.parentNode;
                ul.append(node);
            });
            oldul.remove();

        })
    }
    function extendImportFunctionality(){

        var storedObj = localStorage;
        var storedString = JSON.stringify(storedObj);

        var menuplace = document.querySelector('div.submenu_intro');
        var divider1 = document.createElement('span');
        divider1.textContent = '|';
        var divider2 = divider1.cloneNode();
        menuplace.appendChild(divider1);

        var importlink = document.createElement('a');
        importlink.href = 'javascript:void(0);';
        importlink.id = 'import-link';
        menuplace.appendChild(importlink);

        importlink = document.getElementById('import-link');

        var importlabel = document.createElement('label');
        importlabel.htmlFor = 'import-button';
        importlabel.id = 'import-label';
        importlabel.textContent = ' Import ';
        importlink.appendChild(importlabel);

        var importbt = document.createElement('input');
        importbt.type = 'File'
        importbt.id = 'import-button';
        importbt.style.height = '1px';
        importbt.style.width = '1px';
        importbt.accept = '.gga';
        menuplace.appendChild(importbt);
        menuplace.appendChild(divider2);

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        var exportlink = document.createElement('a');
        exportlink.href = `data:text/plain;charset=utf-8, ${encodeURIComponent(storedString)}`;
        exportlink.id = 'export-link';
        exportlink.textContent = ' Export ';
        exportlink.download = `gogoanime-backup-${mm}-${dd}-${yyyy}.gga`;
        menuplace.appendChild(exportlink);

        importlink = document.getElementById('import-link');

        var head = document.querySelector('head');
        var injectorsrc = document.createElement('script');
        injectorsrc.innerHTML = impexpclientcode;
        injectorsrc.id = 'injectedjs';
        head.appendChild(injectorsrc);

    }
    function appendWatchButton(){
        try {
            var head = document.querySelector('head');

            var titlebox = document.querySelector('.title_name > h2');
            let title = titlebox.textContent;
/*             var title = titlebox.textContent.includes('English Subbed') ? titlebox.textContent.replace('English Subbed', '').trim() : titlebox.textContent; */

            if (title.includes('English Subbed')){
                title = title.replace('English Subbed', '').trim();
                titlebox.textContent = title;
            }

            var titleheader = document.querySelector('div.anime_video_body > h1');
            titleheader.textContent = title;

            var vbox = document.querySelector('div.anime_video_body_cate');
            var buttonlink = document.createElement('a');
            buttonlink.href = "javascript:void(0);";
            buttonlink.id = "buttonlink";
            vbox.appendChild(buttonlink);
            buttonlink = document.getElementById('buttonlink');

            var buttonspan = document.createElement('span');
            buttonspan.id = 'buttonspan';
            buttonspan.style.marginLeft = '0.8em';
            buttonspan.classList.add("btndownload");
            buttonspan.textContent = 'Mark as Watched';
            buttonlink.appendChild(buttonspan);

            var script = document.createElement('script');
            script.type = 'application/javascript';
            script.id = 'injectedsc';
            script.innerHTML = injectsrc;
            head.appendChild(script);

        }catch(e){
            console.error(e);
        }
    }
    function removeSocialIcons(){
        try{
            let icons = document.querySelectorAll('div.link_face');
            icons.forEach((div) => div.parentNode.removeChild(div));
        }catch(e){
            console.error(e);
        }
    }
    function getTitle(){
        let title = document.title;
        title = title.split(' at ')

    }
    function markEpisodeListings(episodeListings){
        let title = document.querySelector('div.anime_info_body_bg > h1').textContent;
        let subbedmode = title.includes('English Subbed');

        var findEps = setInterval(findEpisodes, 100);

        function wpwrite(episodes){
//             let episodeStringNames = episodes.map((div) => `${title} ${}`);
            let episodeStringNames = episodes.map((div) => {
                let epnumber = div.textContent.match(/\d+/)[0];
                return `${title} Episode ${epnumber}`;
            })
            let watchcounter = 0;
            let total = episodeStringNames.length;
            for (let val in episodeStringNames){
                let name = episodeStringNames[val];
                let node = episodes[val];
                let watchstatus = localStorage.getItem(name);

                if (!watchstatus){
                    watchstatus = "unwatched";
                }
                if (watchstatus == "watched"){
                    node.textContent = "*" + node.textContent + "*";
                    watchcounter++;
                }
            }
            let counter = {"watched" : watchcounter, "total" : total};
            appendWatchList(counter);

        }
        function appendWatchList(counter){
            let {watched, total} = counter;

            let valuesSection = document.querySelector('div.anime_info_body_bg');
//             console.log(valuesSection);
            let watchedElement = document.createElement('p');
            watchedElement.classList.add('type');
            watchedElement.id = 'watchedNumber';
            watchedElement.innerHTML = `<span>Watched:</span> ${watched}/${total} Episodes`;
            valuesSection.appendChild(watchedElement);
        }

        function findEpisodes(){
            let episodeListings = document.querySelectorAll('div.name');
            if (episodeListings.length != 0){
                clearInterval(findEps);
                wpwrite(Array.from(episodeListings));
            }
        }
    }
    function showpage(){
        getRatings();
        let titlebox = document.querySelector('div.anime_info_body_bg > h1');
        title = titlebox.textContent;

        var findEps = setInterval(findEpisodes, 100);

        function findEpisodes(){
            let episodeListings = document.querySelectorAll('div.name');
            if (episodeListings.length != 0){
                clearInterval(findEps);
                markEpisodeListings(Array.from(episodeListings));
            }
        }
    }
    function markBoxBelowVideo(){
        var titlebox = document.querySelector('.title_name > h2');
        title = titlebox.textContent;
        let subbedmode = title.includes('English Subbed');

        var findEps = setInterval(findEpisodes, 100);

        function wpwrite(episodes){

            let maintitle = document.querySelector('div.anime-info > a').textContent;
            let episodeStringNames = episodes.map((div) => {
                let epnumber = div.textContent.match(/\d+/)[0];
                return title.includes('(Watched)') ? title.replace('(Watched)', '').replace(/\d+/, epnumber).trim() : title.replace(/\d+/, epnumber);
            })
            for (let val in episodeStringNames){
                let name = episodeStringNames[val];
                let node = episodes[val];
                let watchstatus = localStorage.getItem(name);

                if (!watchstatus){
                    watchstatus = "unwatched";
                }
                if (watchstatus == "watched"){
                    node.textContent = "*" + node.textContent + "*";
                }
            }
        }

        function findEpisodes(){
            let episodeListings = document.querySelectorAll('div.name');
            if (episodeListings.length != 0){
                clearInterval(findEps);
                wpwrite(Array.from(episodeListings));
            }
        }
    }
    function markNextandLastButtons(){
        let title = document.querySelector('div.anime_video_body > h1').textContent;
        title = title.includes('(Watched)') ? title.replace('(Watched)', '').trim() : title;
        let subbedmode = title.includes('English Subbed') ? true: false;
        console.log(title);

        let previous = document.querySelector('div.anime_video_body_episodes_l > a');
        if (previous){
            let prevepisode = subbedmode ? `${previous.textContent} English Subbed` : previous.textContent;
            prevepisode = prevepisode.split('<< ')[1].trim();
            if (localStorage.getItem(prevepisode) == 'watched'){
                previous.textContent = `<< *${prevepisode.replace(' English Subbed', '')}*`;
            }
        }

        let next = document.querySelector('div.anime_video_body_episodes_r > a');
        if (next){
            let nextepisode = subbedmode ? `${next.textContent} English Subbed` : next.textContent;
            nextepisode = nextepisode.split(' >>')[0].trim();
            if (localStorage.getItem(nextepisode) == 'watched'){
                next.textContent = `*${nextepisode}* >>`;
            }
        }

    }
    function watchpage(){
        //Fix Spelling Mistake:
        var divopps = document.querySelector('div.anime_video_body > div:nth-of-type(5)').textContent = "Please scroll down to select a server.";
        document.title = `${document.title} Plus`;
        runTests();
        appendWatchButton();
        markNextandLastButtons();
        markBoxBelowVideo();
    }
    // Init:

    const url = window.location;

    var htmltest = new RegExp(/https:\/\/.*\.gogoanime\.io\/.*\.html.*/, 'gi');
    var showpagetest = new RegExp(/.*gogoanime.io\/(?=(category\/)).*/, 'gi');
    var watchpagetest = new RegExp(/.*gogoanime.io\/(?!(category))(?!(genre))(?!(.*\.html)).+/, 'gi');
    var mainpagetest = new RegExp(/.*gogoanime.io\/(?!.{2,})/, 'gi');
    var genretest = new RegExp(/.*gogoanime.io\/(?=(genre\/)).*/, 'gi');

    var showres = showpagetest.test(url);
    var watchres = watchpagetest.test(url);

    removeSocialIcons();
    extendImportFunctionality();

    if (watchres){
        watchpage();
    }
    if (showres){
        window.addEventListener('load', showpage, false);
    }
})();
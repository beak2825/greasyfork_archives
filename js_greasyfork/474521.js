// ==UserScript==
// @name         MAL tierlist
// @namespace    pepe
// @version      2025-09-15
// @description  make tierlist on seasonal anime page
// @author       pepe
// @match        https://myanimelist.net/anime/season*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=myanimelist.net
// @require      https://code.jquery.com/ui/1.13.2/jquery-ui.js
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474521/MAL%20tierlist.user.js
// @updateURL https://update.greasyfork.org/scripts/474521/MAL%20tierlist.meta.js
// ==/UserScript==

/* global $ */
/* global html2canvas */

(function() {

// for image downloading but doesnt work yet, so its not included
// @require https://html2canvas.hertzen.com/dist/html2canvas.js

  // fix padding in header to fit tierlist in older seasons
  if(document.querySelectorAll('.navtab')[0].textContent == 'Current Season'){
      document.head.innerHTML += `<style>
      .dark-mode .navi-seasonal .horiznav_nav ul li a {
         padding: 5px 8px;
      }
      </style>`
  }

    create_tierlist_button:{

        let tierlist_button = document.createElement(`li`)
        tierlist_button.classList.add('btn-type')
        tierlist_button.innerHTML = `<a id="createtier" href="#" class="navtab ">Tierlist</a>`
        tierlist_button.onclick = function(event){
            event.preventDefault(); // disable default link click, interferes with scroll
            RenderTierlist();
        }
        let seasonal_header = document.querySelector('ul.btn-seasonal')
        seasonal_header.append(tierlist_button);

    }


  let tierlist_html = `
    <div id="tierlist">

  <style>
  :root {
    --image-width: 80px;
    --image-height: 113px;
  }
  ul.droptrue { list-style-type: none; margin: 0px; float: left; margin-right: 0px; padding: 0px; min-width: 100%; min-height: 80px;}
  ul.droptrue li { float: left; margin: 2px; font-size: 16px; height: var(--image-height); overflow: hidden;}
  .grid-container {
    margin-top: 2px;
    display: none;
    grid-template-columns: 1fr 11fr;
    grid-gap: 0px;
  }
  .grid-container1 {
    grid-template-columns: 1fr 4fr 3fr 2fr 2fr;
  }
  .grid-container2 {
    grid-template-columns: 1fr 11fr;
  }
.textarea {
  display: flex; align-items: center; text-align: center; height: var(--image-height); width: auto; padding: 0px!important; border: 0px!important; justify-content: center;
}
ul {display: block;
    list-style-type: disc;
    margin-block-start: 0;
    margin-block-end: 0;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 0;
    margin: 2px;
    padding: 0;
}
.dropfalse div { height: 100%; font-size:14px!important;width:90px;}

#tier_s div, #header_s div { background-color: #2e51a2;}
#tier1 div, #header_1 div { background-color: green;}
#tier2 div, #header_2 div { background-color: oklch(0.70 0.18 126.62 / 1);}
#tier3 div, #header_3 div { background-color: oklch(0.75 0.2 70.66 / 1);}
#tier4 div { background-color: orangered;}
#tier5 div { background-color: darkred;}
  </style>

<div style="position: absolute; right: 0; padding-top: 0px; display:grid;">

<details style="width:80px; ">
  <summary style="cursor: pointer;"><a>FILE</a></summary>
  <div style="">
    <a id="deletetierlist" href="#" style="color: orange;" >DELETE</a>
    <a id="import" href="#">IMPORT</a>
    <a id="downloadLink" href="#" download="mal_tierlist_backup.json">EXPORT</a>
  </div>
</details>

<a href="#"
    onClick="
      event.preventDefault();
      document.querySelector('#contentWrapper').style.display = 'block';
      document.querySelectorAll('.grid-container')[0].style.display = 'none';
      document.querySelectorAll('.grid-container')[1].style.display = 'none';
      document.documentElement.scrollTop = localStorage.getItem('scrollPosition');
    "
>CLOSE</a>

</div>

${generateTiers()}
<!--
<ul id="tier_s" class="dropfalse">
 <div class="textarea" contenteditable="true">S</div>
</ul>
<ul id="s" class="droptrue"></ul>

<ul id="tier1" class="dropfalse">
 <div class="textarea" contenteditable="true">A</div>
</ul>
<ul id="sortable1" class="droptrue"></ul>

<ul id="tier2" class="dropfalse">
  <div class="textarea" contenteditable="true">B</div>
</ul>
<ul id="sortable2" class="droptrue"></ul>

<ul id="tier3" class="dropfalse">
  <div class="textarea" contenteditable="true">C</div>
</ul>
<ul id="sortable3" class="droptrue"></ul>

<ul id="tier4" class="dropfalse">
  <div class="textarea" contenteditable="true">D</div>
</ul>
<ul id="sortable4" class="droptrue"></ul>

<ul id="tier5" class="dropfalse">
  <div class="textarea" contenteditable="true">E</div>
</ul>
<ul id="sortable5" class="droptrue"></ul>
-->


<!-- this grid not in image -->
<div class="grid-container grid-container2">

<ul id="tier_last" class="dropfalse">
  <div class="textarea" contenteditable="true">F</div>
</ul>
<ul id="last" class="droptrue"></ul>

</div>

</div>
`
function generateTiers(){
    let tiers = 'S,A,B,C,D,E'

    let html = tiers.split(/[, ]/).map((tier, i) =>
`<ul id="tier${i==0?'_s':i}" class="dropfalse">
     <div class="textarea" contenteditable="true">${tier}</div>
</ul>
<ul id="${i==0?'s':'sortable'+i}" class="droptrue"></ul>`)

    return `<div class="grid-container">`+html.join('\n')+`</div>`
}
function generateGridTiers(){
    let tiers = 'S,A,B,C,D,E'

    let html = `<div class="grid-container grid-container1"><ul id="tier_header" class="dropfalse" style="height: var(--image-height)">
</ul>
<ul id="header_s" class="dropfalse"><div class="textarea" contenteditable="true">Carry</div></ul>
<ul id="header_1" class="dropfalse"><div class="textarea" contenteditable="true">Tactical</div></ul>
<ul id="header_2" class="dropfalse"><div class="textarea" contenteditable="true">Dark Horse</div></ul>
<ul id="header_3" class="dropfalse"><div class="textarea" contenteditable="true">Misc</div></ul>`

   html += tiers.split(/[, ]/).map((tier, i) =>
`<ul id="tier${i==0?'_s':i}" class="dropfalse">
     <div class="textarea" contenteditable="true">${tier}</div>
</ul>
${createColumns(tier)}`).join('\n')

    return html+`</div>`
}
    function createColumns(tier){
        return Array.from(Array(4)).map((v,i) => `<ul id="${tier==0?'s'+i:`sortable${i}${tier}`}" class="droptrue"></ul>`).join('\n')
    }
   
    function RenderTierlist(){
        localStorage.setItem('scrollPosition', document.documentElement.scrollTop)

        // prevent duplicate from being rendered, insert html
        try{document.getElementById('tierlist').remove();}catch(e){}
        document.querySelector('#contentWrapper').insertAdjacentHTML("afterend", tierlist_html);

        // hide seasonal, show tier
        document.querySelector('#contentWrapper').style.display = 'none';
        document.querySelectorAll('.grid-container')[0].style.display = 'grid';
        document.querySelectorAll('.grid-container')[1].style.display = 'grid';

        // jqueryui sortable
        $( "ul.droptrue" ).sortable({
            connectWith: "ul.droptrue"
        });

        // loop seasonal images and put them to tierlist
        let new_shows = document.querySelectorAll('.js-seasonal-anime-list-key-1 .js-seasonal-anime img, .js-seasonal-anime-list-key-5 .js-seasonal-anime img')
        let season = document.querySelector("#content .season_nav .on").textContent
        let tierlist = JSON.parse(localStorage.getItem(season));
        let tiersOrdered = Array.from({length: tierlist?.tiers?.length}, i => []);

        // create ordered list
        for(let anime of new_shows){
            let id = anime.parentElement.href.match(/(?<=anime\/)\d+/)[0]
            let members = anime.parentElement.parentElement.parentElement.querySelector('.member').textContent
            members = members.match(/[\d.]+/) * ( members.match(/M/) ? 1000000 : ( members.match(/K/) ? 1000 : 1 ) )
            if(members < 3000) continue; // skip if low members

            if(tierlist && tierlist[id]){ // old tierlist by sort
                document.querySelector('#'+tierlist[id]).innerHTML += `<li id="${id}" class="">${anime.outerHTML.replace('167', '80')}</li>`
            }else if(tierlist && tierlist.version == 2 && tierlist.tiers.flat().includes(id)){ // new ordered tierlist
                for(let tier_index of Object.keys(tierlist.tiers)){
                    if(!tierlist.tiers[tier_index].includes(id)) continue

                    let anime_index = tierlist.tiers[tier_index].indexOf(id)
                    let element = `<li id="${id}" class="">${anime.outerHTML.replace('167', '80')}</li>`

                    tiersOrdered[tier_index] ??= []
                    tiersOrdered[tier_index][anime_index] = element
                }
            }else{ // add shows to last tier by default
                document.querySelector('#last').innerHTML += `<li id="${id}" class="">${anime.outerHTML.replace('167', '80')}</li>`
            }
        }

        // insert anime to tierlist
        if(tierlist && tierlist.version == 2){
            for(let tier_index of Object.keys(tierlist.tiers)){
                let tier_row = document.getElementsByClassName('grid-container')[0].querySelectorAll('ul.droptrue')[tier_index]
                tier_row.innerHTML = tiersOrdered[tier_index].join('\n')
            }
        }

        // tier label names
        let tier_names = tierlist?.tier_names ?? JSON.parse(localStorage.getItem('tier_names'+season))
        if(tier_names){
            for(let [i, textareas] of document.querySelectorAll('ul div.textarea').entries()){
                textareas.innerText = tier_names[i]
            }
            // document.querySelectorAll('ul div.textarea').entries().forEach((i, textareas) => { textareas.innerText = tier_names[i] })
        }

        document.querySelector('#menu').scrollIntoView(); // window.scrollTo(0, 50);

        // automatic save when making tierlist
        // https://stackoverflow.com/questions/3219758/detect-changes-in-the-dom/3219767#3219767
        var targetNode = document.getElementsByClassName('grid-container')[0];
        var config = { subtree: true, childList: true, characterData: true,}; // works with this config

        var observer = new MutationObserver(SaveTierlistV2);
        observer.observe(targetNode, config); // detect dom change when creating tierlist

        // delete button event
        document.querySelector('#deletetierlist').onclick = function(event){
            event.preventDefault(); // disable default link click

            if (confirm('Delete tierlist from localstorage?')) {
                let season = document.querySelector("#content .season_nav .on").textContent
                localStorage.removeItem(season);
                localStorage.removeItem('tier_names'+season);
                RenderTierlist();
            }
        };

        // backup button
        document.getElementById("downloadLink").addEventListener("click", function(e) {
            const data = JSON.stringify(Object.fromEntries(Object.keys(localStorage).filter(key => ["Winter","Spring","Summer","Fall"].some(s => key.includes(s)) && key.match(/\d\d\d\d/)).map(key => [key,JSON.parse(localStorage.getItem(key))])))
            const blob = new Blob([data], { type: 'text/plain' });
            this.href = URL.createObjectURL(blob);
        });

        // import button
        document.getElementById("import").addEventListener("click", async function(e) {
            e.preventDefault();

            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.click();

            fileInput.addEventListener("change", async function(event) {
                const file = event.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        for (const [key, val] of Object.entries(JSON.parse(reader.result))) {
                            localStorage.setItem(key, JSON.stringify(val));
                        }
                        RenderTierlist()
                        console.log("File import complete.");
                    } catch (err) {
                        console.error("Error processing file:", err);
                    }
                };
                reader.readAsText(file); 
            });
        });

    }

    function SaveTierlist(){
        let season = document.querySelector("#content .season_nav .on").textContent
        let tierlist = {}
        for(let tier of document.getElementsByClassName('grid-container')[0].querySelectorAll('ul.droptrue')){
            for(let anime of tier.querySelectorAll('li')){
                tierlist[anime.id] = tier.id
            }
        }
        localStorage.setItem(season, JSON.stringify(tierlist));

        let tier_names = Array.from(document.querySelectorAll('ul div.textarea')).map(tier => tier.textContent)
        localStorage.setItem('tier_names'+season, JSON.stringify(tier_names));
    }

    function SaveTierlistV2(){
        console.log('tierlist saved')
        let season = document.querySelector("#content .season_nav .on").textContent
        let tierlist = {version:2}

        tierlist.tiers = Array.from(document.querySelectorAll('.grid-container')[0].querySelectorAll('ul.droptrue')).map(tier => Array.from(tier.querySelectorAll('li')).map(anime => anime.id))
        tierlist.tier_names = Array.from(document.querySelectorAll('ul div.textarea')).map(tier => tier.textContent)

        localStorage.setItem(season, JSON.stringify(tierlist));
    }

    // anime count per season
    let seasonal = document.querySelectorAll('.seasonal-anime-list:nth-child(1) .seasonal-anime'),
        count = 0,
        cours = 0
    Array.from(seasonal).forEach(anime => {
        let [episodes, duration] = Array.from(anime.querySelectorAll('.info .item:nth-child(2) span')).map(info => parseInt(info.textContent) ?? 0)
        let members = anime.querySelector('.member').textContent
            members = members.match(/[\d.]+/) * ( members.match(/M/) ? 1000000 : ( members.match(/K/) ? 1000 : 1 ) )
        if(duration > 15 || members > 2000) count++
        if(episodes > 10) cours += episodes/13
    })
    document.querySelectorAll('.anime-header')[0].innerText += ` (${count})`//+` (${cours.toFixed(0)})`

    // buggy, zooms images
    // https://www.geeksforgeeks.org/how-to-take-screenshot-of-a-div-using-javascript/
    // download image button
    //     document.getElementById('download').addEventListener("click", function() {
    //         function download(canvas, filename) {
    //             const data = canvas.toDataURL("image/png;base64");
    //             const donwloadLink = document.querySelector("#download");
    //             donwloadLink.download = filename;
    //             donwloadLink.href = data;
    //         }

    //        html2canvas(document.querySelector(".grid-container"), {
    //            useCORS: true,
    //            onrendered: function (canvas) {
    //                document.body.appendChild(canvas);
    //            }}).then((canvas) => {
    //            // document.body.appendChild(canvas);

    //            download(canvas, "seasonal tierlist");
    //        });
    //     });

})();
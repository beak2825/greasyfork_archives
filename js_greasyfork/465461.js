// ==UserScript==
// @name         Not Interested V2
// @namespace    https://www.youtube.com/@NurarihyonMaou
// @version      0.6.2
// @description  Script that lets You to mark Manga Entries as Not Interested In and then hide them
// @author       You
// @match        https://anilist.co/user/*/stats/anime/overview
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anilist.co
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/465461/Not%20Interested%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/465461/Not%20Interested%20V2.meta.js
// ==/UserScript==

const $ = window.jQuery;

const url = "https://anilist.co/graphql";
const x_csrf_token = $("head script:contains('window.al_token')")
  .text()
  .split(/[“"”]+/g)[1];

const style = `div.stats-wrap{display: grid;
grid-gap: 30px;
grid-template-columns: repeat(auto-fill,minmax(200px,1fr));
margin-top: 30px;
overflow: hidden;}`;

const query = `query($page: Int, $ids: [Int!]){Page(page: $page){media(type:MANGA, onList: false, sort: POPULARITY_DESC, id_not_in: $ids){title {
    userPreferred
  }, genres, meanScore, id, coverImage{large}
  }}}`;



  let firstRun = true;

  let entries;
  let ahref;
  let entriesLength;

  let hideNotInterested = GM_getValue("hideNotInterested") ?? false;

  let currentChild = 0;
  let entriesNode;

  let alreadyButtoned = [], alreadyHidden = [];
  let notInterested = GM_getValue("notInterested") ?? [];

  let variables = {'page': 1, ids: hideNotInterested ? notInterested : []};




  (function(console){
    console.save = function(data, filename){
      if(!data) {
        console.error('Console.save: No data')
        return;
      }
      if(!filename) filename = 'NotInterested.txt'
      if(typeof data === "array"){
        data = JSON.stringify(data, undefined, 4)
      }
      var blob = new Blob([data], {type: 'text/txt'}),
          a    = document.createElement('a')
      var e = new MouseEvent('click', {
          bubbles: true,
          cancelable: false
          });
      a.download = filename
      a.href = window.URL.createObjectURL(blob)
      a.dataset.downloadurl =  ['text/txt', a.download, a.href].join(':')
      a.dispatchEvent(e)
    }
  })(console);


  function hideNotInterestedEntries() {

    if(hideNotInterested && alreadyHidden.length > 0)
      alreadyHidden = [];

    let hideThisEntries = notInterested.filter((Entry) => !alreadyHidden.includes(Entry));


    let hideThisEntriesLength = hideThisEntries.length;
    let notInterestedLength = notInterested.length;

    let useThisLength = (hideNotInterested) ? hideThisEntriesLength : notInterestedLength;
    let useThisArray = (hideNotInterested) ? hideThisEntries : notInterested;

    for(let currentEntry = 0; currentEntry < useThisLength; currentEntry++){
      let entryToHide = document.body.querySelector(`input[type="checkbox"][value="${useThisArray[currentEntry]}"]`);

      if(entryToHide != null){
         entryToHide = entryToHide.parentElement;

      if(entryToHide){
        (hideNotInterested) ? $(entryToHide).hide() : $(entryToHide).show();
        alreadyHidden.push(useThisArray[currentEntry]);
      }
      }
    }
    /* $.each(notInterested, function(index, entry){
      (hideNotInterested) ? $("body").find(`input[type='checkbox'][value='${entry}']`).parent().hide() : $("body").find(`input[type='checkbox'][value='${entry}']`).parent().show();
    }); */
  }

  function addButtons(){

    for(currentChild; currentChild < entriesLength; currentChild++){

      let id = entriesNode.children[currentChild].children[0].href.split("/")[4];

      if(alreadyButtoned.indexOf(id) == -1){

        (notInterested.indexOf(id) >= 0) ? entriesNode.children[currentChild].innerHTML += `<input type='checkbox' name='notIntrested' style='width: 10px; height: 10px; float: left; margin: 0 auto; width: 100%;' value='${id}' checked='checked'/>` :
        entriesNode.children[currentChild].innerHTML += `<input type='checkbox' name='notIntrested' style='width: 10px; height: 10px; float: left; margin: 0 auto; width: 100%;' value='${id}'/>`;

        alreadyButtoned.push(id);
      }
    }

  /*  $.each($(entries).children(), function(index, entry){
       let id = entry.children[0].href.split("/")[4];
        if(alreadyButtoned.indexOf(id) == -1){
          (notInterested.indexOf(id) >= 0) ? $(entry).append(`<input type='checkbox' name='notIntrested' style='width: 10px; height: 10px; float: left; margin: 0 auto; width: 100%;' value='${id}' checked='checked'/>`) :
          $(entry).append(`<input type='checkbox' name='notIntrested' style='width: 10px; height: 10px; float: left; margin: 0 auto; width: 100%;' value='${id}'/>`);
           alreadyButtoned.push(id);
        }
  }); */

  // hideNotInterestedEntries();
  }

  const stringToHTML = function (str) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(str, 'text/html');
    return doc.body;
};

  function handleButton(){

    if(hideNotInterested){
      $("div.nav-wrap").children()[0].append(stringToHTML(`<div>Hide not interested Entries <input type='checkbox' name='hideNotInterested' checked='checked'/></div>`));
    }
    else
      $("div.nav-wrap").children()[0].append(stringToHTML(`<div>Hide not interested Entries <input type='checkbox' name='hideNotInterested'/></div>`));
  }

  $(window).ready(function(){

  $("body").on("click", "input[name='notIntrested']", function(){

    let currVal = $(this).val();
    let currIndex = notInterested.indexOf(currVal);
    if(currIndex < 0){
      notInterested.push($(this).val());
      if(hideNotInterested)
        $(this).parent().hide();
    }
    else
      notInterested.splice(currIndex, 1);

    GM_setValue("notInterested", notInterested);
  });




  $("body").on("click", "input[name='hideNotInterested']", function(){

    hideNotInterested = $("body input[name='hideNotInterested']").prop("checked");
    GM_setValue("hideNotInterested", $(this).prop("checked"));
    hideNotInterestedEntries();
  });





function handleEntries(data){
    let stats_wrap = document.body.getElementsByClassName('stats-wrap')[0];
    let genres_div = document.body.getElementsByClassName('genres');
    for(let entry = 0; entry < data.length; entry++){
        stats_wrap.innerHTML += `<div data-v-4d8937d6="" data-v-5ca09bd3="" class="media-card" style="--media-text: hsl(231,80%,70%);
         --media-background: hsl(230,42%,51%); --media-background-text: hsl(231,100%,94%); --media-overlay-text: hsl(231,80%,70%);">
          <a data-v-4d8937d6="" href="/manga/${data[entry].id}" class="cover">
           <img data-v-4d8937d6="" src="${data[entry].coverImage.large}" class="image loaded">
            </a> <a data-v-4d8937d6="" href="/manga/137280/Na-Honja-Mallep-Newbie/" class="title">
            ${data[entry].title.userPreferred}
	</a> <div data-v-4d8937d6="" class="hover-data right"><div data-v-4d8937d6="" class="header">
     <div data-v-4d8937d6="" class="score">
     <span data-v-4d8937d6="" class="percentage">${data[entry].meanScore}%</span></div></div> <!----> <div data-v-4d8937d6="" class="info"><span data-v-4d8937d6="">Manga</span>
     </div> <div data-v-4d8937d6="" class="genres"></div></div></div>`;

        for(let genre = 0; genre < data[entry].genres.length; genre++) {
            genres_div[entry].innerHTML += `<div data-v-4d8937d6="" class="genre">
            ${data[entry].genres[genre]}
            </div>`;
        }
    }
    if(firstRun)
        return;
    entriesLength = document.getElementsByClassName("media-card").length;
    addButtons();
}

function sendQuery(){

    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-csrf-token": x_csrf_token
        },
        body: JSON.stringify({
            query: query,
            variables: variables,
        }),
    };

    fetch(url, options).then(handleResponse).then(handleData).catch(handleError);

    function handleResponse(response) {
        return response.json().then(function (json) {
            return response.ok ? json : Promise.reject(json);
        });
    }

    function handleData(data) {
        handleEntries(data.data.Page.media);
    }

    function handleError(error) {
        alert("Error, check console");
        console.error(error);
    }
}

function handleNotIntersted() {
    entriesNode = document.getElementsByClassName('stats-wrap')[0];
    let entries = document.getElementsByClassName("media-card");

    if (entries.length > 0) {

      entriesLength = $(entries).length;

        setTimeout(handleButton, 500);
        setTimeout(addButtons, 500);
        firstRun = false;
    }
}

(function init() {

    let filter_group = document.getElementsByClassName("filter-group");

    if (filter_group.length > 0) {
        $(filter_group[1]).after("<span id='SearchForNewEntries'>Search for new Entries</span>");

        $(document).on("click", "span#SearchForNewEntries", function(){
            $("div.stats-wrap").html('');
            GM_addStyle(style);
            sendQuery();
            setTimeout(handleNotIntersted, 1000);
            hideNotInterestedEntries();
        });

        $(document).on("scroll", function(){
            if($(window).scrollTop() + $(window).height() == $(document).height()) {
                variables.page++;
                sendQuery();
            }});


        $(filter_group[1]).append("<input type='file' accept='text/txt' id='BackupNotInterested' style='display: none;'/>");
        $(filter_group[1]).append(`<span onclick="document.getElementById('BackupNotInterested').click()">Import Data</span></br>`);
        $(filter_group[1]).append(`<span id="SaveNotInterestedEntriesToFile">Backup Data</span>`);

        $(document).on("click", "span#SaveNotInterestedEntriesToFile", function(){
            let fileName = prompt("Name the Backup File", "NotInterested.txt");
            console.save(notInterested, fileName);
            console.log(fileName + ' Saved.');
        });

        $(document).on('change', 'input#BackupNotInterested', function(e){
          e.target.files[0].text().then((t) => {
            const outcome = t.split(',');

            if(!confirm("Want to overwrite current 'Not-Interested-Entries' with the Ones from the Imported File?"))
              return;

            notInterested = outcome;
            GM_setValue("notInterested", notInterested);
            console.log(notInterested, outcome);
            alert("Imported");
          });
        });

    } else setTimeout(init, 0);
})();});
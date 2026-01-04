// ==UserScript==
// @name         IMDB Ratings on Tubi
// @namespace    https://github.com/leodoi3/tubi-imdb-ratings
// @version      0.11
// @description  Shows IMDB ratings on Tubi
// @author       leodoi3
// @supportURL   https://github.com/leodoi3/tubi-imdb-ratings/issues
// @homepageURL  https://github.com/leodoi3/tubi-imdb-ratings
// @match        https://tubitv.com/*
// @icon         https://tubitv.com/favicon.ico
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452775/IMDB%20Ratings%20on%20Tubi.user.js
// @updateURL https://update.greasyfork.org/scripts/452775/IMDB%20Ratings%20on%20Tubi.meta.js
// ==/UserScript==

var fireOnHashChangesToo = true;
setInterval(() => {
  if (this.lastPathStr !== location.pathname
    || this.lastQueryStr !== location.search
    || (fireOnHashChangesToo && this.lastHashStr !== location.hash)
  ) {
    this.lastPathStr = location.pathname;
    this.lastQueryStr = location.search;
    this.lastHashStr = location.hash;

    waitForKeyElements("div.EcToA", addSettingButton, true);
    if (lastPathStr.startsWith("/movie") && GM_config.get('OMDbApiKey') !== '') { //Adds buttons on the watch page
      waitForKeyElements("div.web-carousel-shell.t3vzq > div.web-carousel__container > div", (row) => {addRecommendedButtons(row)});
      waitForKeyElements("div.web-attributes > div.web-attributes__meta", (elem) => {addRatingNearTitle(elem)});
    }
    else if (lastPathStr.startsWith("/home") && GM_config.get('OMDbApiKey') !== '') { //Adds buttons on the homepage
      waitForKeyElements("div.web-carousel__container > div", (row) => {
        //console.log(row)
        addRecommendedButtons(row);
      }, false);
    }

  }
}
  , 111
);


GM_config.init(
  {
    'id': 'tubi-imdb-ratings', // The id used for this instance of GM_config
    'title': `${GM.info.script.name} v${GM.info.script.version} Settings`,
    'fields': // Fields object
    {
      'OMDbApiKey': // This is the id of the field
      {
        'label': 'OMDb API Key', // Appears next to field
        'section': ['You can request a free OMDb API Key at:', 'https://www.omdbapi.com/apikey.aspx'],
        'type': 'text', // Makes this setting a text field
        'title': "Your OMDb API Key",
        'size': 20,
        'default': '' // Default value if user doesn't change it
      }
    },
    css: ':root{--accent:rgb(226, 182, 22);--background:rgb(24, 26, 27);--black:rgb(0, 0, 0);--font:Roboto,Helvetica,Arial,sans-serif;--white:rgb(255, 255, 255)}#tubi-imdb-ratings *{color:var(--white)!important;font-family:var(--font)!important;font-size:14px!important;font-weight:400!important}#tubi-imdb-ratings{background:var(--background)!important}#tubi-imdb-ratings .config_header{font-size:20pt!important;line-height:1.1!important}#tubi-imdb-ratings .section_desc,#tubi-imdb-ratings .section_header{background-color:var(--accent)!important;border:1px solid transparent!important;color:var(--black)!important}#tubi-imdb-ratings .config_var{align-items:center!important;display:flex!important}#tubi-imdb-ratings_field_OMDbApiKey{background-color:var(--white)!important;border:1px solid var(--black)!important;color:var(--black)!important;flex:1!important}#tubi-imdb-ratings button,#tubi-imdb-ratings input[type=button]{background:var(--white)!important;border:1px solid var(--black)!important;color:var(--black)!important}#tubi-imdb-ratings button:hover,#tubi-imdb-ratings input[type=button]:hover{filter:brightness(85%)!important}#tubi-imdb-ratings .reset{margin-right:10px!important}',
    'events':
    {
      'init': () => {
        // initial configuration if OMDb API Key is missing
        if (!GM_config.isOpen && GM_config.get('OMDbApiKey') === '') {
          $(() => GM_config.open())
        }
      },
      'save': () => {
        if (GM_config.isOpen) {
          if (GM_config.get('OMDbApiKey') === '') {
            alert('check your settings and save')
          } else {
            alert('settings saved')
            GM_config.close()
            setTimeout(window.location.reload(false), 500)
          }
        }
      }
      // 'close': function() { alert('onClose()'); },
      // 'reset': function() { alert('onReset()'); }
    }
  });

/**
 * Adds a button to the menu to access the script configuration
 */
function addSettingButton() {
  const navBar = document.getElementsByClassName("EcToA")[0]
  var btn = document.createElement("button");
  btn.innerHTML = "Get IMDB rating";
  btn.onclick = () => {
    // console.log(GM_config.get("ApiKey"))
    GM_config.open();
  }
  btn.style.backgroundColor = "black";
  btn.innerHTML = "IMDb Ratings Tubi"
  btn.style.color = "white"
  navBar.appendChild(btn);
}


function addRecommendedButtons(row) {
  const movieRow = row[0].childNodes;
  //console.log(movieColumns)
  for (let item of movieRow) {
    try {
      addButton(item);
    }
    catch (e) { console.log(e) }
    ;
  }
}

function addButton(item) {
  var title = getTitle(item);
  var year = getYear(item);
  var btn = document.createElement("button");

  btn.innerHTML = "Get IMDB rating";
  btn.onclick = () => {
    getRating(title, year).then((data) => {
      if (data.title != undefined) {
        btn.innerHTML = data.rating + "/10" + "<br>" + data.votes + " votes";
        btn.onclick = () => { window.open(`https://www.imdb.com/title/${data.id}`) }
        btn.setAttribute('title', data.plot)
      }
      else { //If the IMDB rating cannot be found, provide a Google search query 
        btn.setAttribute('title', btn.innerHTML)
        btn.onclick = () => {
          title = title.replaceAll(" ", "%20"); //URL encoding
          title = title.replaceAll("&", "%26");
          title = title.replaceAll("'", "%27");
          window.open(`https://www.google.com/search?q=${title}%20${year}`)
        }
        btn.innerHTML = `Google Search: ${title} ${year}`;


      }
    }
    ).catch((err) => { console.error(err) })
  }
  btn.style.backgroundColor = "yellow";
  btn.style.color = "black";
  item.appendChild(btn);
}


async function getRating(title, year) {
  title = title.replaceAll(" ", "%20"); //URL encode
  title = title.replaceAll("&", "%26");
  title = title.replaceAll("'", "%27");
  console.log(`https://www.omdbapi.com/?apikey=${GM_config.get("OMDbApiKey")}&t=${title}&y=${year}`)
  const response = await fetch(`https://www.omdbapi.com/?apikey=${GM_config.get("OMDbApiKey")}&t=${title}&y=${year}`)
  const json = await response.json();

  return {
    title: json.Title,
    rating: json.imdbRating,
    id: json.imdbID,
    votes: json.imdbVotes,
    plot: json.Plot
  };
}

//Used for movie recommendations
function getTitle(params) { 
  // params.childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].innerText
  return params.querySelector("a").innerText
}

//Used for watch page
function getTitle2(params) { 
  //document.querySelector("div.Col.Col > div > h1").innerText
  return document.getElementsByClassName("c1jX9")[0].innerText
}

//Used for movie recommendations
function getYear(params) {
  let year = params.getElementsByClassName("web-content-tile__year")[0].innerText;
  if (!year.match(/\(?\d+\)?/)) return ""
  year = year.replace("(", "")
  year = year.replace(")", "")
  return year;
}

//Used for watch page
function getYear2(params) {
  let year = document.getElementsByClassName("web-attributes__meta")[0].innerText;
  //document.querySelector("div.Col.Col > div > div > div > div:nth-child(1)").innerText
  if (!year.match(/\(?\d+\)?/)) return ""
  year = year.replace("(", "")
  year = year.replace(")", "")
  year = year.substring(0,4);
  return year
}

function addRatingNearTitle(elem) {
  var title = getTitle2()
  var year = getYear2()
  const content = elem[0];

  //document.querySelector("div.Col.Col  > div:nth-child(2) > div > div")
  var btn = document.createElement("button");

  getRating(title, year).then((data) => {
    if (data.title != undefined) {
      btn.innerHTML = data.rating + "/10  - " + data.votes + " votes";
      btn.onclick = () => { window.open("https://www.imdb.com/title/" + data.id) }
      btn.setAttribute('title', data.plot)
      btn.style.marginLeft = "15px"

    }
    else { //If the IMDB rating cannot be found, provide a Google search query 
      btn.onclick = () => { window.open("https://www.google.com/search?q=" + title + " " + year) }
      btn.innerHTML = "Google Search: " + title + " " + year;

    }

    btn.style.backgroundColor = "yellow";
    btn.style.color = "black"
    content.appendChild(btn);
  })


}





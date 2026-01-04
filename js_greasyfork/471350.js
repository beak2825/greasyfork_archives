// ==UserScript==
// @name        IMPROVED EROME - experimental Ed.
// @name:ru     УЛУЧШЕННЫЙ EROME - в разработке
// @namespace   Violentmonkey Scripts
// @icon        https://www.google.com/s2/favicons?domain=erome.com
// @match       https://www.erome.com/*
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_registerMenuCommand
// @version     1.0BETA
// @license     Copyleft
// @author      @mbient
// @description Show more content per page, Bypass disclaimer, save what videos you watched, block unwanted content (per user OR album)
// @description:ru Показать больше контента на странице, скрыть дисклеймер, сохранить просмотренные видео, заблокировать нежелательный контент (для каждого пользователя ИЛИ альбома) 
// @downloadURL https://update.greasyfork.org/scripts/471350/IMPROVED%20EROME%20-%20experimental%20Ed.user.js
// @updateURL https://update.greasyfork.org/scripts/471350/IMPROVED%20EROME%20-%20experimental%20Ed.meta.js
// ==/UserScript==

// const censoredIMG_URI = 'data:image/png;base64,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';
const censoredIMG = 'https://www.onlygfx.com/wp-content/uploads/2018/04/censored-stamp-2.png';

(() => {
    "use strict";
    const $_ = document.querySelector.bind(document);
    const $$_ = document.querySelectorAll.bind(document);

    const append_ = $_("#albums");

    let structureOfSettings = {
        disclaimer: true,
        autoStart: false,
        limit: 10
    };

    if (GM_getValue("globalSettings") === undefined)
        GM_setValue("globalSettings", structureOfSettings);
    if (GM_getValue("bannedAlbums") === undefined)
        GM_setValue("bannedAlbums", new Array());
    if (GM_getValue("watchedVideos") === undefined)
        GM_setValue("watchedVideos", new Array());

    let gmset = GM_getValue("globalSettings");
    // DISCLAIMER BYPASS IF EXIST

    function disclaimerByPass() {
            $.ajax({
                type: 'POST',
                url: '/user/disclaimer',
                async: false,
                success: function() {
                    $('#disclaimer').remove();
                    $('body').css('overflow', 'visible');
                }
            });
        } // end function disclaimer

    // LOAD MORE CONTENT PER PAGE

    let counter = 0;
    let hidden = 0;
    const albums = [];
    const watched = new Set();
    const limitPages = gmset.limit == null ? 5 : gmset.limit;
    const LOAD_NEXT = document.createElement('div');
    LOAD_NEXT.className = "menu-tab f-left selected no-select";
    LOAD_NEXT.innerText = `LOAD NEXT ${limitPages}`;
    LOAD_NEXT.onclick = () => loadFirst(true);
    let appender = $_("#page > ul");
    if (appender) appender.append(LOAD_NEXT);

    function pushOnce(item) {
        watched.add(item);
    }

    function stringToHTML(str) {
        const dom = document.createElement('div');
        dom.innerHTML = str;
        return dom;
    }

    function loadFirst(next) {
        if (!document.location.pathname.match('a/')) {
            const searchParams = new URLSearchParams(document.location.search);
            console.log('User watching albums...\nPlease wait...');
            let urlFetch = "";
            let totalFetchedPages = 2;
            counter = parseInt(searchParams.has('page') ? searchParams.get('page') : parseInt(hidden) ? parseInt(hidden) : 1);
            const numMaxPages = counter + limitPages;

            if (searchParams.size !== 0 && searchParams.has('o') && !searchParams.has('page')) {
                urlFetch = `https://www.erome.com/search?q=${searchParams.get('q')}&o=${searchParams.get('o')}&page=`;
            } else if (searchParams.size !== 0 && searchParams.has('o') && searchParams.has('page')) {
                urlFetch = `https://www.erome.com/search?q=${searchParams.get('q')}&o=${searchParams.get('o')}&page=`;
            } else if (searchParams.size !== 0 && !searchParams.has('o') && !searchParams.has('page')) {
                urlFetch = `https://www.erome.com/search?q=${searchParams.get('q')}&page=`;
            } else if (searchParams.size !== 0 && !searchParams.has('o') && searchParams.has('page') && searchParams.has('q')) {
                urlFetch = `https://www.erome.com/search?q=${searchParams.get('q')}&page=`;
            } else {
                urlFetch = `https://www.erome.com${document.location.pathname}?page=`;
            }

            console.log(counter, "\n", urlFetch);

            let stop = false;

            if (!stop) {
                albums.length = 0;
                const nextPages = counter + limitPages;
                if (counter <= 2) {
                    counter++;
                } else {
                    counter++;
                }

                try {
                    const intervalThenFetchIsReady = setInterval(() => {
                        if (counter === nextPages) {
                            clearInterval(intervalThenFetchIsReady);
                            applyVisualChanges(counter, nextPages);
                        }

                        const fetchUrl = urlFetch + counter;
                        if (!watched.has(fetchUrl)) {
                            pushOnce(fetchUrl);
                            fetch(fetchUrl)
                                .then(response => {
                                    if (response.status === 200) {
                                        response.text()
                                            .then(myBlob => {
                                                const temp = stringToHTML(myBlob);
                                                if (temp.innerHTML !== undefined) {
                                                    const getAlbums = temp.querySelector('div#albums');
                                                    if (getAlbums === null || getAlbums === undefined || getAlbums.innerText.trim() === '') {
                                                        clearInterval(intervalThenFetchIsReady);
                                                        LOAD_NEXT.innerText = "No more pages";
                                                        LOAD_NEXT.style.cursor = "context-menu";
                                                        LOAD_NEXT.onclick = null;
                                                    } {
                                                        // Create the outer div element
                                                        const outerDiv = document.createElement('div');
                                                        outerDiv.style.display = 'contents';

                                                        // Create the inner div element
                                                        const innerDiv = document.createElement('div');

                                                        innerDiv.classList.add("baloon");

                                                        innerDiv.textContent = Number(counter);
                                                        innerDiv.title = `From here to down page ${counter} is shown`;
                                                        const innerA = document.createElement('a');
                                                        innerA.href = "#";
                                                        let verify_ = getAlbums.querySelector('.baloon');
                                                        if (!verify_) {
                                                            outerDiv.append(innerDiv);
                                                            outerDiv.append(innerA);
                                                            getAlbums.append(outerDiv);
                                                        }

                                                    }
                                                    albums.push(getAlbums);
                                                    applyVisualChanges(counter);
                                                    counter++;
                                                }
                                            });
                                    } else {
                                        clearInterval(intervalThenFetchIsReady);
                                        applyVisualChanges(counter);
                                    }
                                })
                                .catch(error => console.log(error));
                        }
                    }, 1000);
                } catch (error) {
                    console.log(error, "timer stopped");
                    clearInterval(intervalThenFetchIsReady);
                }
            }
        }
    }

    function applyVisualChanges(counter, nextPages) {

        for (const album of albums) {
            if (album) //$_("#albums").insertAdjacentElement('afterend', album);
                $$_('#albums').forEach(e => {
                //

                // let mmm = document.createElement('div');
                e.after(album);

            })
            markAsWatched();

        }

        $$_(".album-thumbnail-container:nth-child(1) a img").forEach(e => {
            e.setAttribute('src', e.getAttribute('data-src'));
        });

        $$_("#albums").forEach((e, i) => {
            $_("#lol > div > div > div:nth-child(2) > a").innerText = `Added pages: ${i}`;
            hidden = `${i + 1}`;
        });

        if (nextPages && counter === nextPages) console.log(counter + "\nDone.");
executeCensor();
    }

    function appendStyleToPage(newStyle) {
        let styles = document.createElement("style");
        styles.appendChild(document.createTextNode(newStyle));
        document.head.appendChild(styles);
        styles.type = "text/css";

    }

    // MATCH VIDEOS AS WATCHED

    const xu = /\/a\/([^\/\?]+)/;
    const xm = /("[^"]*")|([^\s"]+)/g;
    const watchedVideos = 'watchedVideos';
    const URL_TRIM = getVideoId(document.location.href);
    let oldValue = GM_getValue(watchedVideos);

    function getVideoId(url) {
        const vid = url.match(xu);
        return vid ? vid[1] : null;
    }

    function getAlbumsURI() {
        return Array.from($$_('#albums > div'), (e) => e.querySelector('a').href);

    }

    function getAlbums() {

            const data = Array.from($$_('div > a.album-title, div > span.album-user')).map((element) => {
                const albumTitle = element.innerText;
                const albumUser = (element.nextElementSibling) ? element.nextElementSibling.innerText : undefined;
                return {
                    albumTitle,
                    albumUser
                };
            });
            return data.filter((item) => item.albumUser !== undefined);

        }
        // console.log(getAlbums())

    function saveListWatched() {
        const LSKey = "watchedVideos";
        if (URL_TRIM != null) { // if the user opened the album
            //  alert("");
            let getLocalStorage = localStorage.getItem(LSKey);
            if (!getLocalStorage) {
                let verifyIfExist = GM_getValue(LSKey);
                if (verifyIfExist.length >= 1)
                    localStorage.setItem(LSKey, verifyIfExist); // safe mode
                else
                    localStorage.setItem(LSKey, URL_TRIM);
            } else

            {

                let newHero = getLocalStorage.split(',');
                newHero.push(URL_TRIM);
                let unique = [...new Set(newHero)];
                localStorage.setItem(LSKey, unique);
                GM_setValue(LSKey, unique);
                markAsWatched();

            }

        }

    }
    saveListWatched(); // on

    function markAsWatched() {

        let intersection = getAlbumsURI().filter((x) => GM_getValue("watchedVideos").includes(getVideoId(x)));

        intersection.forEach((el) => {
            $$_('#albums > div').forEach((e) => {
                if (e.querySelector('a').href == el) {
                    e.querySelector('.album-thumbnail-container').style.setProperty("border-bottom", "5px solid red");
                }
            });
        });

    }
    markAsWatched();

    function isEqualObjects(value1, value2) {
        return JSON.stringify(value1) === JSON.stringify(value2);
    }

    // Function to check for variable changes
    function updateWatched() {
        var newValue = GM_getValue(watchedVideos);
        if (!isEqualObjects(newValue, oldValue)) {
            markAsWatched();
            oldValue = newValue; // Update the old value

        }

    }

    // Check for changes
    setInterval(updateWatched, 3000);

    function executeCensor(){
      getAlbums().forEach((e) => {
        const aTitle = e.albumTitle.trim();
        const aUser = e.albumUser.trim();

        const extractEachTitle = new Set(aTitle.toLowerCase().split(/[ _.:;?!~,`"&|()<>{}\[\]\r\n/\\\-]+/g));
        const extractEachUserN = new Set(aUser.toLowerCase().split(/[ _.:;?!~,`"&|()<>{}\[\]\r\n/\\\-]+/g));

        let albumsForProcessingTitle = new Array();
        let albumsForProcessingUserN = new Array();

        let filtererWordsEachAlbums = Array.from(extractEachTitle).map(el => el.trim());
        // search from BLOCKLIST
        GM_getValue("bannedAlbums").forEach(w => {

            if (filtererWordsEachAlbums.includes(w.toLowerCase()) || aTitle === w.toLowerCase())
                console.log(aTitle, " _ ", w.toLowerCase(), filtererWordsEachAlbums.includes(w.toLowerCase()), aTitle === w.toLowerCase());

            //    full match
            //                includes spaces                      no spaces                                  strict

            if (extractEachTitle.has(w.toLowerCase()) || filtererWordsEachAlbums.includes(w.toLowerCase()) || aTitle.toLowerCase() === w.toLowerCase())

                albumsForProcessingTitle.push(aTitle);
            if ( /*extractEachTitle.has(w.toLowerCase()) || filtererWordsEachAlbums.includes(w.toLowerCase()) ||*/ aUser.toLowerCase() === w.toLowerCase())

                albumsForProcessingUserN.push(aTitle);

        })

        // logic after match

        let tempInner = `<a class="album-link" style="
                              position: absolute;
                              content: '';
                              background: URL(&quot;${ censoredIMG }&quot;) center no-repeat;
                                background-size: contain;
                              resize: both;
                              pointer-events: none;
                      "> </a>
                      `
        // let albumTitle = '';
        $$_('#albums > div').forEach((album) => {
         let albumTitleSel  = album.querySelector('div > a.album-title'); // .innerText ? album.querySelector('div > a.album-title').innerText : '';
          if(albumTitleSel) albumTitleSel = albumTitleSel.innerText;

            if (albumsForProcessingTitle.some((albumTitle) => albumTitle === albumTitleSel)) {
                album.querySelector('.album-thumbnail-container').innerHTML = tempInner;
            }

            // username
          // console.log(albumsForProcessingUserN);
            if (albumsForProcessingUserN.some((albumTitle) => albumTitle === albumTitleSel)) {
                album.querySelector('.album-thumbnail-container').innerHTML = tempInner;

            }

        })

    });

  }
executeCensor();


    const sMenuGeneral = `
  .baloon{
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 922299;
    transform: translate(-90%, -50%);
    width: 50px;
    height: 50px;
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    border-radius: 50%;
    color: white;
    position: absolute;
  }

.album-thumbnail {
    border-radius: 5px;
}

div.video {
    border-radius: 5px;
}

.box {
    display: block;
    width: 100%;
    height: 50px;
    line-height: 34px;
    padding: 8px 14px;
    margin: 0 0 10px;
    background: #eee;
    border: 0;
    font-size: 14px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
}

.hud-menu-zipp3 {
    display: none;
    position: fixed;
    top: 48%;
    left: 50%;
    width: 600px;
    height: 470px;
    margin: -270px 0 0 -300px;
    padding: 20px;
    background: rgba(0, 0, 0, 0.6);
    color: #eee;
    border-radius: 4px;
    z-index: 15;
}
/*.hud-menu-zipp3 h3 {
display: block;
margin: 0;
line-height: 20px;
}*/
.hud-menu-zipp3 .hud-zipp-grid3 {
    display: flex;
    height: 393px;
    padding: 10px;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(12px);
    border-radius: 7px;
    flex-direction: column;
    justify-content: flex-start;
}

.hud{
    font-family: var(--fa-style-family,"Font Awesome 6 Free");
    cursor: pointer;
}
.hud-menu-zipp3 {
     display: none;
     position: fixed;
     top: 48%;
     left: 50%;
     width: 550px;
     height: 460px;
     margin: -270px 0 0 -300px;
     padding: 20px;
     background: rgba(0, 0, 0, 0.6);
     color: #eee;
     border-radius: 20px;
     z-index: 99995;
}

.sp{
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
}
.no-select{
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
}
.no-select::selection, .no-select *::selection {
  background-color: Transparent;
}
#myModal{
    display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 99999; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}
.title-modal{

    text-align: center;
    display: flex;
    align-items: center;
    margin: 0 auto;
    justify-content: center;
    font-family: var(--fa-style-family,"Font Awesome 6 Brands");
    backdrop-filter: blur(12px);
    padding: 8px 8px 0px 8px;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 8px 8px 0px 0px;
}
.ctitle{
  display: flex;

}
option[value="delete"]{
    float: right;
    margin-right: 8px;
}

`;

    appendStyleToPage(sMenuGeneral);

    // spell icon
    let spell = document.createElement("div"); // button
    spell.classList.add("sp");
    spell.classList.add("no-select");
    spell.classList.add("fa-play-circle");
    spell.classList.add("hud");
    spell.setAttribute("data-type", "Zippity3");
    spell.classList.add("hud-zipp3-icon");
    spell.textContent = "Script Menu";

    let xChild = $_(".container > div >  div:nth-child(6)");
    let onlineSign = $_(".container > div > div:nth-child(2) > span");
    if (xChild) xChild.parentNode.insertBefore(spell, xChild);
    if (onlineSign) spell.append(onlineSign);

    //Menu for spell icon
    let modHTML = `
<div id="myModal" class="modal">
  <div class="hud-menu-zipp3">
    <div class="ctitle" >
      <span class="close-modal no-select">&times;</span>
      <span class="title-modal no-select">Changes are applied automatically</span>
    </div>
    <div style="text-align:center">
      <div class="hud-zipp-grid3 no-select">
      </div>
    </div>
  </div>
</div>

`;

    document.body.insertAdjacentHTML("afterbegin", modHTML);
    let zipz123 = document.getElementsByClassName("hud-menu-zipp3")[0];

    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close-modal")[0];

    spell.onclick = function() {

        if (zipz123.style.display == "none" || zipz123.style.display == "") {
            modal.style.display = "block";
            zipz123.style.display = "block";
        } else {
            modal.style.display = "none";
            zipz123.style.display = "none";
        };

    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            zipz123.style.display = "none";
            $_(".container-btn > input").value = '';

        }
    }

    const sMenuStyle = `
.toggle-btn {
    left: 85%;
    position: relative;
    width: 40px;
    height: 20px;
    border: 2px solid #5f3f5f;
    border-radius: 20px;
    display: grid;
    justify-content: end;
    align-content: center;
    cursor: pointer;
    transition: .3s;
}
.circle-btn {
    position: absolute;
    left: 0;
    width: 20px;
    height: 20px;
    border-radius: 20px;
    background-color: #996395;
    transition: .3s;
}
.text {
    font-size: 23px;
    color: #eb6395;
    width: max-content;
    padding-right: 50px;
    -webkit-user-select: none; /* Safari */

    -ms-user-select: none; /* IE 10 and IE 11 */

    user-select: none; /* Standard syntax */
}
.active {
    border-color: #5f3f5f;
}
.active + .text {
    color: #eb6395;
}
.active .circle-btn {
    left: 100%;
    transform: translateX(-100%);
    transition: .3s;
    background-color: #eb6395;
}
select#BLOCKLIST {
    background: transparent;
    height: 150px;
    width: 173px;
    border: 1px solid #333;
    overflow: overlay;
    position: fixed;
    left: 64%;
    backdrop-filter: blur(21px);
    border-radius: 8px 8px 0px 0px;
    padding: 7px;
}
.input_filter {
    position: relative;
    top: 149px;
    z-index: 9;
    left: 65px;
}
#input_script {
    border-radius: 0px 0px 0px 8px;
    background: transparent;
    color: white;
    border: 1px solid #333;
    width: 54%;
}
#add_New_Block_List {
    position: absolute;
    z-index: 5;
    border-radius: 0px 0px 8px;
    border: 1px solid #333;
}
selstyle {
    display: flex;
    justify-content: space-evenly;
    align-items: stretch;
}

`;

    appendStyleToPage(sMenuStyle);

    let btntoggle = `
<div class="container-btn">

    <div class="toggle-btn pink ${gmset.disclaimer === true ? 'active' : ''}">
        <a class="text no-select">Disclaimer ByPass (if available)</a>
        <div class="circle-btn pink no-select"></div>
    </div>
    <br/>
    <div class="toggle-btn pink ${gmset.autoStart === true ? 'active' : ''}">
        <a class="text no-select">Start fetching at start (if available)</a>
        <div class="circle-btn pink no-select"></div>
    </div>
    <br/>
    <input type="number" min="5" max="50" class="form-control" autocomplete="off" placeholder="Set limit of pages to load (current is ${gmset.limit})">

</div>

<div class="container-btn">
    <form action="javascript:void(0);" style="padding-top: 10px;">
        <label for="option">Select from the list the method of using BLOCKLIST</label>
        <select class="form-control" name="option" id="option">
            <option value="select">Hide albums that includes OR contain words from BLOCKLIST (not in use)</option>                                                    <!-- Do Not Select This -->
            <option value="equal">Name of albums contain an word that are strict equal or match at BLOCKLIST (RECOMMENDED)</option>                     <!-- exact word from album - profiles are not touched -->
            <option value="contain">Name of albums can contain an combination of word that that can found at BLOCKLIST</option>                         <!-- for ex: tran -> trans, transgender, #trans, and others -->
            <option value="userequal">User username and albums contain an word that are strict equal or match at BLOCKLIST (RECOMMENDED)</option>       <!-- username and exact word from album - profiles are not touched -->
            <option value="usercontain">User username and albums can contain an combination of word that that can found at BLOCKLIST</option>           <!-- for ex: tran -> trans, transgender, #trans, and others | user:  transOfficial - also  -->
        </select>
    </form>

    <!--    action="javascript:void(0);" onkeyenter="console.log(event.which)" onsubmit="CheckPassword()" -->

    <form action="javascript:void(0);">
        <selstyle>
            <div>
                <select title="This is BLOCKLIST" id="BLOCKLIST" size="4"></select>
            </div>
            <div class="input_filter">
                <input type="text" id="input_script" value="" spellcheck="false">
                <input type="submit" id="add_New_Block_List" value="Add" title="If input contain value, after click list will updated and if item from list was selected this will removed">

            </div>
        </selstyle>
    </form>

</div>

`;
    document.getElementsByClassName("hud-zipp-grid3")[0].innerHTML = btntoggle;

    const blockListItems = $_("#BLOCKLIST");

    function updateBLOCKLIST() {
        let updatedBannedAlbums = new Array();
        for (let name of blockListItems.options) {
            if (name.value !== "delete".toLowerCase())
                updatedBannedAlbums.push(name.value);
        }
        //
        GM_setValue("bannedAlbums", updatedBannedAlbums);
        $_("#input_script").value = '';
        blockListItems.scroll(0, blockListItems.scrollHeight);

        console.log('BLOCKLIST was updated!');
    }

    $_("#add_New_Block_List").addEventListener("click", (evt) => {

        let inputList = $_("#input_script").value;
        evt.srcElement.disabled = true;

        //check list
        if (inputList.length > 0 && !GM_getValue("bannedAlbums").includes(inputList)) {
            const oOption = document.createElement("option");
            oOption.appendChild(document.createTextNode(inputList));
            oOption.setAttribute("value", inputList);
            blockListItems.appendChild(oOption);

        }
        updateBLOCKLIST();
    });

    function selectDeleteOption() {
        const dom = document.createElement("option");
        dom.value = "delete";
        dom.innerText = "Delete";

        return dom;

    }

    let notUndefined;

    blockListItems.onchange = function() { // THANKS Matt Howell   https://stackoverflow.com/questions/5069294/

        const options = this.getElementsByTagName("option");
        $$_(`#BLOCKLIST > option[value="delete"]`).forEach((kk, mm) =>
            kk.remove())

        notUndefined = options[this.selectedIndex] !== undefined ? options[this.selectedIndex] : notUndefined;

        if (this.selectedIndex !== -1)
            options[this.selectedIndex].before(selectDeleteOption());
        else {
            this.remove(notUndefined.index);
            updateBLOCKLIST();
        }

        $_("#input_script").value = this.value;

    };

    $_("#input_script").addEventListener('input', (evt) => {
        // only for beginners
        if (evt.srcElement.value.length > 0) $_("#add_New_Block_List").disabled = !true;
        else $_("#add_New_Block_List").disabled = true;
    })

    GM_getValue("bannedAlbums").forEach(e => {

        blockListItems.innerHTML += `<option value="${e}">${e}</option>`;
    });

    $$_("#BLOCKLIST option").forEach((e) => {
        const length = 15;
        var string = e.value
        var trimmedString = string.length > length ?
            string.substring(0, length - 3) + "..." :
            string

        e.innerText = trimmedString
    })

    // Menu user input - set limit of pages (LOGIC)
    $_(".container-btn > input").addEventListener('input', (evt) => {

        try {
            gmset.limit = evt.srcElement.valueAsNumber;
            GM_setValue("globalSettings", gmset);
            this.placeholder = `Set limit of pages to load (current is ${gmset.limit})`;

        } catch (ex) {}

    }, false);

    const btn = $$_(".toggle-btn").forEach((item, index) => {

        item.addEventListener("click", () => {

            item.classList.toggle("active");
            if (index === 0) gmset.disclaimer = !gmset.disclaimer;
            if (index === 1) gmset.autoStart = !gmset.autoStart;
            GM_setValue("globalSettings", gmset);
            // console.log(gmset);
        });
    });

    if (gmset.disclaimer == true) {
        disclaimerByPass();
    }
    if (gmset.autoStart == true) {
        loadFirst(true);
    }
    // skip login OR explore
    const exploreCheck = document.querySelector("#home-box > a");
    if (exploreCheck && exploreCheck.innerText === 'Explore') exploreCheck.click();

    GM_registerMenuCommand("Display Size Of Saves", () => {
        console.log(`Size of Watched Videos: ${new Blob([GM_getValue("watchedVideos") ]).size} bytes\
                 \nSize of Banned Albums:  ${new Blob([GM_getValue("bannedAlbums") ]).size} bytes`);

        alert(`Size of Watched Videos: ${new Blob([GM_getValue("watchedVideos") ]).size} bytes\
           \nSize of Banned Albums:  ${new Blob([GM_getValue("bannedAlbums") ]).size} bytes`);

    });

})();
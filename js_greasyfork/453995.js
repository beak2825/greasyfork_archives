// ==UserScript==
// @name         dA_sort_gallery
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Sorting deviantart.com gallery folder pictures
// @author       dediggefedde
// @match        https://www.deviantart.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deviantart.com
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/453995/dA_sort_gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/453995/dA_sort_gallery.meta.js
// ==/UserScript==


const sortimg = `<svg xmlns="http://www.w3.org/2000/svg" viewbox="0 -50 400 500">
    <rect x="16" y="40"  width="340" height="28"/>
    <rect x="16" y="140" width="290" height="28"/>
    <rect x="16" y="240" width="240" height="28"/>
    <rect x="16" y="340" width="190" height="28"/>
</svg>`;

(function() {
    'use strict';
    let interSortDelay=500; //milliseconds between sort requests
    let actFolder = null;
    let isfetching = false;
    let token = null;
    let username = null;
    let totalDevs = 0;
    let fetchedDevs = 0;
    let db = []; //array of entries {folderId, deviationid, title, publishedTime, views, favs, thumbUrl, reqDate}, format date "2022-10-08T16:26:40-0700"

    let dbsel = null,
        dbsort = null; //temporary db selection

    let progFetch = null, //html elements, quickaccess
        progSort = null,
        dialog = null,
        style = null,
        slider = null,
        prevCont = null;
    let moveOrder = []; //moving requests
    let totalToMove = 0;
    let today;

    function reqSort() {
        /*
        request sort: POST: https://www.deviantart.com/_napi/shared_api/gallection/folders/update_deviation_order
        csrf_token	"d7okysuxM7dW9__i.rk0w3p.aUFLMyo3Oa2uuKoCH6X68dSmTRvIi126lcBQJsxqdCI"
        deviationid	932351217
        folderid	84979945
        position	5
        type	"gallery"
         */
        token = document.querySelector("input[name=validate_token]").value;
        return new Promise(function(resolve, reject) {
            if (moveOrder.length == 0) {
                resolve();
                return;
            }
            let mv = moveOrder.shift(); //el, ind, oldind
            let dat = {
                "csrf_token": token.toString(),
                "deviationid": mv.el,
                "folderid": parseInt(actFolder),
                "type": "gallery",
                "position": mv.ind,
                "da_minor_version": "2023071020230710",
                "username":username
            };
            GM.xmlHttpRequest({
                method: "POST",
                headers: {
                    "Accept": 'application/json, text/plain, */*',
                    "Accept-Language":"de,en-US;q=0.7,en;q=0.3",
                    "Content-Type": 'application/json',
                    "Pragma":"no-cache",
                    "Cache-Control":"no-cache"
                },
                dataType: 'json',
                data: JSON.stringify(dat),
                url: `https://www.deviantart.com/_puppy/dashared/gallection/folders/update_deviation_order`,
                onerror: function(response) {
                    reject("dA_sort_gallery request failed:", response);
                },
                onload: function(response) {
                    console.log(dat, response.responseText);
                    setProgress(progSort, totalToMove - moveOrder.length, totalToMove);
                    if (moveOrder.length == 0)
                        resolve();
                    else{
                        setTimeout(() => {
                            resolve(reqSort());
                        }, interSortDelay);
                    }
                }
            });
        });
    }

    function reqEntries(offset = 0) {
        today = (new Date());
        /*
        username=Dediggefedde&type=gallery
        &folderid=84979945
        &offset=0
        &limit=24
        &mature_content=true
        &csrf_token=d7okysuxM7dW9__i.rk0w3p.aUFLMyo3Oa2uuKoCH6X68dSmTRvIi126lcBQJsxqdCI
        */
         return new Promise(function(resolve, reject) {
            GM.xmlHttpRequest({//https://www.deviantart.com/_napi/shared_api/gallection/contents
                method: "GET",
                url: `https://www.deviantart.com/_puppy/dashared/gallection/contents?type=gallery&username=${username}&folderid=${actFolder}&offset=${offset}&limit=24&mature_content=true&csrf_token=${token}`,
                onerror: function(response) {
                    reject("dA_sort_gallery request failed:", response);
                },
                onload: function(response) {
                    try{
                        let resp = JSON.parse(response.responseText);

                        fetchedDevs += resp.results.length;
                        setProgress(progFetch, fetchedDevs, totalDevs);
                        db = [].concat(db, resp.results.map((el) => {
                            let thumb = "";
                            let token = "";
                            try {
                                if (el.media.token != null)
                                    token = "?token=" + el.media.token[0];
                                if (el.media.types[0].c == null)
                                    thumb = el.media.baseUri + token;
                                else
                                    thumb = el.media.baseUri + el.media.types[0].c.replace("<prettyName>", el.media.prettyName) + token;
                            } catch (ex) {
                                console.error("dA_sort_gallery: Thumb error:", ex, el);
                            }
                            return { folderId: actFolder, deviationId: el.deviationId, title: el.title, publishedTime: el.publishedTime, views: el.stats.views, favs: el.stats.favourites, thumbUrl: thumb, reqDate: today };
                        }));
                        if (resp.hasMore) {
                            setTimeout(() => {
                                resolve(reqEntries(resp.nextOffset));
                            }, 500);
                        } else {
                            resolve(resp);
                        }
                    }catch(ex){
                        alert("An error occured while parsing the website response. Please contact the developer to provide an update");
                        console.error("dA_sort_gallery: Error while parsing website:",ex,response.responseText);
                    }
                }
            });
        });
    }

    function arraymove(arr, fromIndex, toIndex) {
        var element = arr[fromIndex];
        arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, element);
    }

    function evSort(ev) { // sort button
        let oldOrder = dbsel.map(el => el.deviationId);
        let newOrder = dbsort.map(el => el.deviationId);
        let checkOrder = [...oldOrder];
        moveOrder = [];
        //reactive move algorithm, sometimes reduces 
        let maxind = document.getElementById("dA_sort_gallery_affected").value;

        newOrder.forEach((el, ind) => {
            if (ind >= maxind) return;
            if (checkOrder[ind] != el) {
                let oldind = checkOrder.indexOf(el);
                let altind = newOrder.indexOf(checkOrder[ind]);
                arraymove(checkOrder, oldind, ind);
                moveOrder.push({ el: el, ind: ind, old: oldind });

                if (checkOrder[ind + 1] != newOrder[ind + 1] && altind < maxind) {
                    arraymove(checkOrder, ind + 1, altind);
                    moveOrder.push({ el: checkOrder[altind], ind: altind, old: ind + 1 });
                }
            }
        });
        if (moveOrder.length > newOrder.length) { //avg algorithm 70%, but sometimes runs >N. complete reinsert always runs N times
            moveOrder = [];
            checkOrder = [...oldOrder];
            newOrder.slice(0, maxind).reverse().forEach((el, ind) => {
                let oldI = checkOrder.indexOf(el);
                if (oldI == 0) return;
                arraymove(checkOrder, oldI, 0);
                moveOrder.push({ el: el, ind: 0, old: oldI });
            })
        }

        let testEq = newOrder.filter((el, ind) => { return checkOrder[ind] != el; }).length == 0;

        totalToMove = moveOrder.length;
        if (moveOrder.length == 0) alert("Already Sorted!");
        else if (confirm(`This order requires ${totalToMove} move requests. Continue?`)) {
            reqSort().then(() => {
                alert("Sorting complete!\nPressing 'OK' will reload the page.\nPlease fetch entries again before further sorting.");
                location.reload();
            }).catch(err => {
                alert("An error occured while sorting! More details can be found in the console (F12)\n" + err);
                console.error("dA_sort_gallery: Gallery sorting error:", err);
            });
        }
    }

    function evSelect(ev) { //select sorting target or type
        prevCont.innerHTML = "";
        let selslope = document.getElementById("dA_sort_gallery_slope").value == "asc" ? 1 : -1; //asc, desc
        let seltarget = document.getElementById("dA_sort_gallery_target").value;
        let pfrag = new DocumentFragment();
        dbsel = db.filter(el => el.folderId == actFolder);
        if (seltarget == "invert") {
            dbsort = [...dbsel].reverse();
        } else {
            dbsort = [...dbsel].sort((a, b) => {
                return selslope * ((a[seltarget] > b[seltarget]) - (a[seltarget] < b[seltarget]))
            });
        }

        for (let i = 0; i < 4 && i < dbsort.length; ++i) {
            let domEl = document.createElement("img");
            domEl.src = dbsort[i].thumbUrl;
            domEl.title = `${dbsort[i].title}\n${dbsort[i].publishedTime}\nViews: ${dbsort[i].views}\nFavourites: ${dbsort[i].favs}`;
            pfrag.appendChild(domEl);
        }
        prevCont.appendChild(pfrag);
    }

    function evInvokeClick(ev) { //shows/init dialog
        let checkFol = /\/gallery\/(\d+)\//i.exec(location.href);
        if (checkFol == null) {
            actFolder = "-1&all_folder=true";//document.querySelector("[data-hook=gallection_folder_1]").parentNode.href.match(/\/(\d+)\//)[1]; //favourites always second in list
        } else {
            actFolder = checkFol[1];
        }
        token = document.querySelector("input[name=validate_token]").value;
        document.getElementById("dA_sort_gallery_folderID").innerHTML = actFolder;
        let d1 = null,
            d2 = null;
        fetchedDevs = 0;
        fetchedDevs = db.reduce((cnt, el) => {
            if (d1 == null || d1 < el.reqDate) d1 = el.reqDate;

            if (el.folderId == actFolder) {
                if (d2 == null || d2 < el.reqDate) d2 = el.reqDate;
                return cnt + 1;
            } else {
                return cnt;
            }
        }, 0);
        let text1, text2;
        if (d1 != null) text1 = d1.toLocaleDateString();
        else text1 = "not scanned";
        if (d2 != null) text2 = d2.toLocaleDateString();
        else text2 = "not scanned";
        document.getElementById("dA_sort_gallery_folderEntries").innerHTML = fetchedDevs + " (" + text2 + ")";
        document.getElementById("dA_sort_gallery_allchoice").innerHTML = "All " + fetchedDevs;
        document.getElementById("dA_sort_gallery_allchoice").value = fetchedDevs;
        document.getElementById("dA_sort_gallery_dataEntries").innerHTML = db.length + " (" + text1 + ")";

        dialog.style.display = "block";
        scrollPage(0);
    }

    function evFetchFolder(ev) { //click fetch button
        if (isfetching) return;
        isfetching = true;

        db = db.filter(el => { return el.folderId != actFolder; });
        fetchedDevs = 0;

        reqEntries(0).then((ret) => {
            GM.setValue("db", JSON.stringify(db));
            document.getElementById("dA_sort_gallery_folderEntries").innerHTML = fetchedDevs + " (" + today.toLocaleDateString() + ")";
            document.getElementById("dA_sort_gallery_dataEntries").innerHTML = db.length + " (" + today.toLocaleDateString() + ")";
            document.getElementById("dA_sort_gallery_allchoice").innerHTML = "All " + fetchedDevs;
            document.getElementById("dA_sort_gallery_allchoice").value = fetchedDevs;
            setTimeout(() => { scrollPage(1); }, 500);
        }).catch(() => {
            alert("An error occured while fetching! More details can be found in the console (F12)\n" + err);
            console.error("dA_sort_gallery: Gallery fetching error:", err);
        }).finally(() => {
            isfetching = false;
        });
    }

    function scrollPage(page) {
        slider.style.transform = `translate(-${(425*page)}px)`;
        if (page == 1) evSelect(null);
    }

    function setProgress(bar, value, total) {
        if (total == 0 || bar == null) return;
        let perc = Math.ceil(value / total * 100);
        bar.dataset.label = `${value}/${total} (${perc}%)`;
        bar.getElementsByTagName("span")[0].style.width = perc + "%";
    }

    function addStyle() {
        if (document.getElementById("dA_sort_gallery_style") != null) return;
        style = document.createElement("style");
        style.id = "dA_sort_gallery_style";
        style.innerHTML = `
        #dA_sort_gallery_buttonCont{display: flex;margin: 5px;font-size: small;color:#7579ff;fill:#7579ff;cursor:pointer}
        #dA_sort_gallery_buttonCont:hover{color: var(--D8);fill:currentColor;}
        #dA_sort_gallery_buttonCont svg{height:1em;margin:0 5px;}
        #dA_sort_gallery_dialog{background-color:#f4fbf4;width:400px;position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);color:black;padding: 15px;border: 2px solid #076628;border-radius: 15px;display:none;z-index:99;overflow: hidden;}
        #dA_sort_gallery_dialog h3{text-align:center;font-size:x-large;margin-bottom:1em;}
        #dA_sort_gallery_dialog h4{text-align:left;font-size:large;margin-bottom:0.5em;}
        #dA_sort_gallery_dialog select{display: inline-block;vertical-align: middle;cursor: pointer;border: 1px solid green;background-color: #cfa;border-radius: 5px;padding: 5px;}
        #dA_sort_gallery_dialog .dA_sort_gallery_buttons{display:flex;justify-content: space-around;}
        #dA_sort_gallery_dialog button{background:none;border:none;font-size:large;font-weight: bold;font-style: italic;color:#050;cursor:pointer;}
        #dA_sort_gallery_dialog button:hover{color:#370;}
        #dA_sort_gallery_dialog button:active{color:#770;}
        #dA_sort_gallery_dialog section{display: inline-flex;flex-direction: column;gap: 10px;width: 400px;margin-right: 20px;height:100%;}
        #dA_sort_gallery_dialog label{margin-right:20px;display:inline-block;}
				#dA_sort_gallery_fetching label{width:50%;}
				.dA_sort_gallery_progress {border-radius: 5px; height: 1.5em; width: 100%; border: 1px inset black; box-shadow: 1px 1px 1px black inset; background: white; position: relative;}
				.dA_sort_gallery_progress:before { content: attr(data-label); font-size: 0.8em; position: absolute; text-align: center;  top: 5px; left: 0;  right: 0;}
				.dA_sort_gallery_progress span {background-color: #7cc4ff; display: inline-block; height: 100%;}
				#dA_sort_gallery_clearDB{font-size:normal;}
				#dA_sort_gallery_slider{height: 300px;width: 300%;transition: transform; transition-duration: 0.25s;}
				#dA_sort_gallery_imgPrev{flex:1;display:flex;gap:10px;height:75px;}
				#dA_sort_gallery_imgPrev img {align-self: center;object-fit: cover;width: 100%;max-height: 100%;}
				#dA_sort_gallery_dialog .disabled {color:#ccc;}
        `; //transform: translateX(-425px);
        document.head.appendChild(style);
    }

    function addDialog() {
        if (document.getElementById("dA_sort_gallery_dialog") != null) return;
        dialog = document.createElement("div");
        dialog.id = "dA_sort_gallery_dialog";
        dialog.innerHTML = `
            <h3>Sorting a Gallery</h3>
            <div id="dA_sort_gallery_slider">
              <section id="dA_sort_gallery_fetching">
                <h4>Fetching Gallery Entries</h4>
                <div><label>Gallery folder:</label><span id='dA_sort_gallery_folderID'>0</span></div>
                <div><label>Folder entries:</label><span id='dA_sort_gallery_folderEntries'>0</span></div>
                <div><label>Database entries:</label><span id='dA_sort_gallery_dataEntries'>0</span></div>
                <div style="flex:1"><button id='dA_sort_gallery_clearDB'>Clear Database</button></div>
                <div id="dA_sort_gallery_fetchProgress" class="dA_sort_gallery_progress" data-label=""><span style="width:0%;"></span></div>            
                <div class="dA_sort_gallery_buttons">
                  <button id='dA_sort_gallery_cancel'>Cancel</button>
                  <button id="dA_sort_gallery_fatch">Fetch Images</button>
                  <button id="dA_sort_gallery_skip">Skip</button>
                </div>
              </section>
              <section id="dA_sort_gallery_sorting">
                <h4>Sorting Submissions</h4>
                <div>
                <label>Result</label>
								<select id="dA_sort_gallery_affected" title="After sorting, only the first # follow the rule">
									<option value="24">First 24</option> 
									<option value="48">First 48</option>
									<option id='dA_sort_gallery_allchoice' value="all">All</option>
                </select>
                </div>
								<div>    
                <label>Sort Property</label>
								<select id="dA_sort_gallery_target">
									<option value="publishedTime">Date</option> 
									<option value="title">Name</option>
									<option value="views">Views</option>
									<option value="favs">Favourites</option>
									<option value="invert">Invert</option>
                </select>
								<select id="dA_sort_gallery_slope">
									<option value="desc">Descending</option>
									<option value="asc">Ascending</option>
                </select>
              </div>    
							<div>Preview:</div>
							<div id="dA_sort_gallery_imgPrev">
							</div>   
							<div id="dA_sort_gallery_sortingProgress" class="dA_sort_gallery_progress" data-label=""><span style="width:0%;"></span></div>    
							<div class="dA_sort_gallery_buttons">
								<button id='dA_sort_gallery_cancel2'>Cancel</button>
								<button id="dA_sort_gallery_back">Back</button>
								<button id="dA_sort_gallery_sort">Sort</button>
							</div>
              </section>
            </div>
        `;

        document.body.appendChild(dialog);
        progFetch = document.getElementById("dA_sort_gallery_fetchProgress");
        progSort = document.getElementById("dA_sort_gallery_sortingProgress");
        slider = document.getElementById("dA_sort_gallery_slider");
        prevCont = document.getElementById("dA_sort_gallery_imgPrev");

        document.getElementById("dA_sort_gallery_cancel").addEventListener("click", function(ev) {
            dialog.style.display = "";
        }, false);
        document.getElementById("dA_sort_gallery_cancel2").addEventListener("click", function(ev) {
            dialog.style.display = "";
        }, false);
        document.getElementById("dA_sort_gallery_back").addEventListener("click", function(ev) {
            scrollPage(0);
        }, false);
        document.getElementById("dA_sort_gallery_fatch").addEventListener("click", evFetchFolder, false);
        document.getElementById("dA_sort_gallery_skip").addEventListener("click", (ev) => {
            if (fetchedDevs == 0) {
                alert("Please scan your gallery first!")
            } else
                scrollPage(1);
        }, false);
        document.getElementById("dA_sort_gallery_clearDB").addEventListener("click", () => {
            db = [];
            GM.setValue("db", JSON.stringify(db));
            document.getElementById("dA_sort_gallery_folderEntries").innerHTML = "0";
            document.getElementById("dA_sort_gallery_dataEntries").innerHTML = "0";
        }, false);
        document.getElementById("dA_sort_gallery_target").addEventListener("change", evSelect, false);
        document.getElementById("dA_sort_gallery_slope").addEventListener("change", evSelect, false);
        document.getElementById("dA_sort_gallery_sort").addEventListener("click", evSort, false);
    }

    function init() {
        if (!/gallery/i.test(location.href)) return;
        if(!document.querySelector("button.reset-button[data-role='edit-control']"))return; //edit button for change rights
        username = /deviantart\.com\/(.*?)\/gallery/i.exec(location.href)[1];

        if(document.querySelector("[dA_sort_gallery_img]")!=null)return

        addStyle();
        addDialog();

        let parCont=document.querySelector("#sub-folder-gallery svg:not([dA_sort_gallery_img])");
        if(parCont==null)return;
        parCont.setAttribute("dA_sort_gallery_img", 1);
        let sortBut=document.createElement("div");
        sortBut.id="dA_sort_gallery_buttonCont";
        sortBut.innerHTML=sortimg+"Sort";
        parCont.parentNode.parentNode.parentNode.after(sortBut);
        totalDevs=parCont.parentNode.parentNode.parentNode.innerText?.match(/\d+$/);

        sortBut.addEventListener("click", evInvokeClick, false);

        GM.getValue("db").then((val) => {
            db = JSON.parse(val);
            db.forEach((el, ind, arr) => { arr[ind].reqDate = new Date(el.reqDate); });
            document.getElementById("dA_sort_gallery_dataEntries").innerHTML = db.length;
        });
    }


    const observer = new MutationObserver(init);
    observer.observe(document.body,{ childList: true, subtree: true });
    init();
})();

/*
request sort: POST: https://www.deviantart.com/_napi/shared_api/gallection/folders/update_deviation_order
csrf_token	"d7okysuxM7dW9__i.rk0w3p.aUFLMyo3Oa2uuKoCH6X68dSmTRvIi126lcBQJsxqdCI"
deviationid	932351217
folderid	84979945
position	5
type	"gallery"

###
request entries
GET https://www.deviantart.com/_napi/shared_api/gallection/contents?
username=Dediggefedde&type=gallery
&folderid=84979945
&offset=0
&limit=24
&mature_content=true
&csrf_token=d7okysuxM7dW9__i.rk0w3p.aUFLMyo3Oa2uuKoCH6X68dSmTRvIi126lcBQJsxqdCI
*/
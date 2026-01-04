// ==UserScript==
// @name         TBD: Sands of Seed Time for TorrentBD
// @namespace    https://naeembolchhi.github.io/
// @version      0.4
// @description  Sorts your torrent download history based on seed time and lets you download all visible torrents at once.
// @author       NaeemBolchhi
// @license      GPL-3.0-or-later
// @icon         data:image/png;base64,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
// @match        https://*.torrentbd.com/download-history.php*
// @match        https://*.torrentbd.net/download-history.php*
// @match        https://*.torrentbd.org/download-history.php*
// @match        https://*.torrentbd.me/download-history.php*
// @require      https://cdnjs.cloudflare.com/ajax/libs/localforage/1.10.0/localforage.min.js
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466610/TBD%3A%20Sands%20of%20Seed%20Time%20for%20TorrentBD.user.js
// @updateURL https://update.greasyfork.org/scripts/466610/TBD%3A%20Sands%20of%20Seed%20Time%20for%20TorrentBD.meta.js
// ==/UserScript==

(function() {
// Inline style for iFrames
const frameStyle = "display: block;position: fixed;top: -1000px;left: -1000px;height: 1px;width: 1px;opacity: 0;z-index: -9001;overflow: hidden";

// Setting and receiving JSON data from local storage.
function setJSON(key, data) {
    if (typeof data != "string") {data = JSON.stringify(data);}
    localStorage.setItem(key, data);
}
function getJSON(key) {
    return JSON.parse(localStorage.getItem(key));
}

// Create and add to localJSON
function pushLocal(key, val) {
    if (!localStorage.hisTable) {
        setJSON("hisTable",{});
    }
    let tempJSON = getJSON("hisTable");
    //tempJSON["page" + key] = encodeURIComponent(val);
    if (!tempJSON["page" + key]) {
        tempJSON["page" + key] = "";
    }
    tempJSON["page" + key] = tempJSON["page" + key] + val;
    setJSON("hisTable",tempJSON);
}

// Scrape variables from the URL
function urlVar(url) {
    let vars = {};
    url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

// Create a new element
function elemake(tag, innr, attr) {
    let element = document.createElement(tag);
    if (innr) {element.innerHTML = innr;}
    if (!attr) {return element;}

    for (let x = 0; x < attr.key.length; x++) {
        element.setAttribute(attr.key[x], attr.val[x]);
    }
    return element;
}

// Spawn new iFrames
function spawnFrame(url) {
    let frame = document.createElement("iframe");
    frame.id = "spawn_" + urlVar(url).page;
    frame.src = url + "&iframe";
    frame.setAttribute("style",frameStyle);
    document.body.appendChild(frame);
}

// Compress html
function getSmall(str) {
    return str.replace('<tr><td><a href="torrents-details.php?id=',"৳1")
              .replace('" target="_blank">',"৳2")
              .replace('</a><div class="margin-t-5" style="font-size: .9em;">Uploaded by <a href="account-details.php?id=',"৳3")
              .replace('" target="_blank"><span class="tbdrank',"৳4")
              .replace(window.location.origin + "/images/","৳5")
              .replace('</span></a></div></td><td class="dl-btn-td center-align"><a href="download.php?id=',"৳6")
              .replace('"><i class="material-icons small">file_download</i></a></td><td>',"৳7")
              .replace('</td><td class="completed-td">',"৳8")
              .replace('</td><td>',"৳9")
              .replace('</td><td class="active-status-td">',"৳A")
              .replace('<span class="text-gray" title="No">⚫</span></td></tr>',"৳B")
              .replace('<i class="material-icons green-text" title="Yes">check</i></td></tr>',"৳C");
}

// Decompress html
function getLarge(str) {
    return str.replace("৳1",'<tr><td><a href="torrents-details.php?id=')
              .replace("৳2",'" target="_blank">')
              .replace("৳3",'</a><div class="margin-t-5" style="font-size: .9em;">Uploaded by <a href="account-details.php?id=')
              .replace("৳4",'" target="_blank"><span class="tbdrank')
              .replace("৳5",window.location.origin + "/images/")
              .replace("৳6",'</span></a></div></td><td class="dl-btn-td center-align"><a href="download.php?id=')
              .replace("৳7",'"><i class="material-icons small">file_download</i></a></td><td>')
              .replace("৳8",'</td><td class="completed-td">')
              .replace("৳9",'</td><td>')
              .replace("৳A",'</td><td class="active-status-td">')
              .replace("৳B",'<span class="text-gray" title="No">⚫</span></td></tr>')
              .replace("৳C",'<i class="material-icons green-text" title="Yes">check</i></td></tr>');
}

// Base URL
let hisURL = window.location.origin + window.location.pathname + "?id=" + urlVar(document.querySelector("#left-block-container a.accc-btn[href*='account-details']").href).id;

// Divide tasks based on URL
if (window.location.href.match(/iframe/)) {
    /* inside iframe */
    // Run when page finishes loading
    function onReady() {
        if (document.readyState !== "complete") {return;}
        let tbody = document.querySelector("#middle-block table > tbody");
        tbody.innerHTML = tbody.innerHTML.replace(/\n/g,"").replace(/\s\s/g,"").replace(/\s\s/g,"").replace(/>\s*</g,"><");

        let trall = document.querySelectorAll("#middle-block table > tbody > tr"),
            stime = document.querySelectorAll("#middle-block table > tbody > tr > td:nth-child(5)"),
            arrayAlpha;

        localforage.getItem("arrayData").then(function(value) {
            if (value === null) {
                arrayAlpha = [];
            } else {
                arrayAlpha = value;
            }
        }).then(function() {
            for (let x = 0; x < stime.length; x++) {
                let torData = getSmall(trall[x].outerHTML),
                    torTime = eval(stime[x].innerText.replace(/([0-9]*)y/i,"($1*12*30*24)").replace(/([0-9]*)mo/i,"($1*30*24)").replace(/([0-9]*)d/i,"($1*24)").replace(/([0-9]*)h/i,"$1").replace(/([0-9]*)m/i,"($1/60)").replace(/\s/g,"+").replace("-","0"));

                arrayAlpha.push({"X":torData,"Y":torTime.toString()});
            }
            finalize();
        });

        function finalize() {
            localforage.setItem("arrayData", arrayAlpha).then(function() {
                window.parent.postMessage("down_hist_spawn_" + urlVar(window.location.href).page);
            });
        }
    };
    onReady();

    // Listen for readystate change
    document.addEventListener("readystatechange", onReady);
} else {
    /* outside iframe */
    // Clear button is search is on
    if (window.location.search.match(/torrent/)) {
        document.querySelector("#middle-block form button[type='submit']").parentNode.appendChild(elemake("button",'Reset<i class="material-icons right">clear_all</i>',{"key":["id","class","style","type"],"val":["hisReset","btn light-blue darken-3","margin-left: 6px","button"]}));
        document.getElementById("hisReset").addEventListener("click",function() {
            window.location.href = hisURL;
        });
        return;
    }

    // Page Count
    let pages = document.querySelectorAll(".pagination li a[href*='page']"),
        lastpage = parseInt(urlVar(pages[pages.length-1].href).page),
        dialText = "An unknown error occured. Please report to the dedicated thread.",
        redoBtn = "", proSate = "";

    if (localStorage.hisTable && !JSON.parse(localStorage.hisTable).pageSorted) {
        dialText = 'Incomplete data from a previous session has been discovered. As such, the process needs to be restarted.<br><br><b class="red-text">This action cannot be paused.</b><br><br>Do you wish to proceed?';
        proSate = "incomplete";
    }
    if (localStorage.hisTable && JSON.parse(localStorage.hisTable).pageSorted) {
        dialText = 'Complete data from a previous session has been discovered. As such, you can sort your torrents right away.<br><br><b class="red-text">You can also wipe the saved data and redo the process.</b><br><br>What would you like to do?';
        redoBtn = '<div class="swal-button-container"><button class="swal-button swal-button--redo">Redo</button></div>';
        proSate = "complete";
    }
    if (!localStorage.hisTable) {
        // Add page count to localJSON
        pushLocal("Count", lastpage);
        dialText = 'This will save your torrent download history in the browser and sort them based on seed time. As such, it may take some time to complete.<br><br><b class="red-text">This action cannot be paused.</b><br><br>Do you wish to proceed?';
        proSate = "blank";
    }

    // Generate new button
    document.querySelector("#middle-block form button[type='submit']").parentNode.appendChild(elemake("button",'Sort Torrents<i class="material-icons right">access_time</i>',{"key":["id","class","style","type"],"val":["hisBtn","btn light-blue darken-3","margin-left: 6px","button"]}));
    document.getElementById("hisBtn").addEventListener("click",createDial);

    // functions for creating and deleting the dialogue box
    function createDial() {
        document.body.appendChild(elemake("div",`<div class="swal-modal" role="dialog" aria-modal="true"><div class="swal-text">${dialText}</div><div class="swal-footer"><div class="swal-button-container"><button class="swal-button swal-button--cancel">Cancel</button></div>${redoBtn}<div class="swal-button-container"><button class="swal-button swal-button--confirm">Proceed</button></div></div></div>`,{"key":["id","class","tabindex"],"val":["hisDial","swal-overlay swal-overlay--show-modal","-1"]}));
        document.querySelector("#hisDial .swal-button--cancel").addEventListener("click",deleteDial);
        document.querySelector("#hisDial .swal-button--confirm").addEventListener("click",followDial);
        try {
            document.querySelector("#hisDial .swal-button--redo").addEventListener("click",wipeData);
        } catch(e) {}
    }
    function deleteDial() {
        document.getElementById("hisDial").remove();
    }

    // Wipe saved data and redo the process
    function wipeData() {
        localforage.removeItem("arrayData").then(function() {
            localStorage.removeItem("hisTable");
            saveData();
        });
    }

    // Forwarding function for the proceed button
    function followDial() {
        if (proSate === "blank") {
            saveData();
        }
        if (proSate === "incomplete") {
            wipeData();
        }
        if (proSate === "complete") {
            updateDial('All torrents are already saved in the browser. Please wait as the table is updated.<br><br><b class="red-text">Starting update...</b>');
            setTimeout(doExtend, 1000);
        }
    }

    // Function for updating dialogue text
    function updateDial(key) {
        document.querySelector("#hisDial .swal-footer").innerHTML = '<div class="swal-button-container"><button class="swal-button swal-button--cancel">Cancel</button></div>';
        document.querySelector("#hisDial .swal-button--cancel").addEventListener("click",function() {
            deleteDial();
            window.location.reload(true);
        });

        document.querySelector("#hisDial .swal-text").innerHTML = key;
    }

    // Function for updating dialogue text **final version**
    function finalDial(key) {
        document.querySelector("#hisDial .swal-footer").innerHTML = '<div class="swal-button-container"><button class="swal-button swal-button--confirm">Exit</button></div>';
        document.querySelector("#hisDial .swal-button--confirm").addEventListener("click",deleteDial);

        document.querySelector("#hisDial .swal-text").innerHTML = key;
    }

    // Make Download All button
    function downBtn() {
        document.querySelector("#middle-block form button[type='submit']").parentNode.appendChild(elemake("button",'Download Torrents<i class="material-icons right">file_download</i>',{"key":["id","class","style","type"],"val":["hisDown","btn light-blue darken-3","margin-left: 6px","button"]}));
        document.getElementById("hisDown").addEventListener("click",downAll);
    }

    // Download one torrent
    function downOne(url, name) {
        fetch(url)
          .then(response => response.blob())
          .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "[TorrentBD]" + name + ".torrent";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }

    // Download All Visible Torrents
    function downAll() {
        let torLinks = document.querySelectorAll("#middle-block table tbody a[href*='torrents-details']");

        for (let x = 0; x < torLinks.length; x++) {
            let torId = urlVar(torLinks[x].href).id,
                torName = torLinks[x].innerText,
                torLink = window.location.origin + "/download.php?id=" + torId;

            downOne(torLink, torName);
        }
    }

    // Sort and update localJSON based on sort data
    function doSort() {
        let arrayOne;

        localforage.getItem("arrayData").then(function(value) {
            arrayOne = value.sort(function(a, b) {return parseFloat(a.Y) - parseFloat(b.Y);});
            finalize();
        });

        function finalize() {
            localforage.setItem("arrayData", arrayOne).then(function() {
                pushLocal("Sorted", arrayOne.length.toString());

                finalDial('<b class="orange-text">Please wait...</b><br><br>All torrents have been sorted and saved locally. The torrents table will be updated shortly.');
                setTimeout(doExtend, 1000);
            });
        }
    }

    // Update torrent list from saved data
    function doExtend() {
        // Update pagination
        let pagi = document.querySelector("#middle-block .pagination-block"),
            torrentCount = parseInt(getJSON("hisTable").pageSorted),
            eachPage = 30,
            totalPages, currentPage;

        if (parseInt(torrentCount / eachPage) < (torrentCount / eachPage)) {
            totalPages = parseInt(torrentCount / eachPage) + 1;
        } else {
            totalPages = parseInt(torrentCount / eachPage);
        }

        pagi.innerHTML = `
        <style>
            .hisPagination {display: flex;align-items: center;justify-content: center;}
            .hisLi {display: flex;align-items: center;justify-content: center;}
            #hisSelect {display: block;height: 23.6333px;min-width: 31px;padding: 0 5px;outline: 0;border: 0;background: var(--main-bg);cursor: pointer;color: var(--body-color);}
        </style>
        <ul class="pagination hisPagination">
            <li><a class="waves-effect" title="First"><i class="material-icons">first_page</i></a></li>
            <li><a class="waves-effect" title="Previous"><i class="material-icons">chevron_left</i></a></li>
            <li class="hisLi"><select id="hisSelect" title="Jump to">${hisOptions()}</select></li>
            <li><a class="waves-effect" title="Next"><i class="material-icons">chevron_right</i></a></li>
            <li><a class="waves-effect" title="Last"><i class="material-icons">last_page</i></a></li>
        </ul>`;

        // Make enough pages in the options list
        function hisOptions() {
            let print = "";

            for (let x = 1; x < (totalPages + 1); x++) {
                print = print + `<option value="${x}">${x}</option>`;
            }

            return print;
        }

        // Load torrents for intended pages
        function loadTorrents(page) {
            let print = "",
                start = ((page * eachPage) - eachPage),
                end = (page * eachPage);

            if (end > torrentCount) {
                end = torrentCount;
            }

            localforage.getItem("arrayData").then(function(value) {
                for (let x = start; x < end; x++) {
                    print = print + getLarge(value[x].X);
                }
            }).then(function() {
                document.querySelector("#middle-block table > tbody").innerHTML = print;
                document.getElementById("hisSelect").value = page;
                currentPage = page;
                try {
                    finalDial('<b class="green-text">Success!</b><br><br>Torrents in your download history are now sorted based on seed time. You may safely exit this dialogue.');
                } catch(e) {}
            });
        }
        loadTorrents(1);

        // Event listeners to make the pagination functional
        let pagiNode = document.querySelector("#middle-block .pagination-block .hisPagination");
        pagiNode.children[0].addEventListener("click",function(){loadTorrents(1)});
        pagiNode.children[1].addEventListener("click",function(){loadTorrents(currentPage - 1)});
        pagiNode.children[2].children[0].addEventListener("change",function(){loadTorrents(pagiNode.children[2].children[0].value)});
        pagiNode.children[3].addEventListener("click",function(){loadTorrents(currentPage + 1)});
        pagiNode.children[4].addEventListener("click",function(){loadTorrents(totalPages)});

        try {
            document.querySelector("#hisBtn").remove();
        } catch(e) {}
        downBtn();
    }

    // Main process for saving table data
    function saveData() {
        // Spawn an iframe
        spawnFrame(hisURL + "&page=1");
        updateDial(`<b class="orange-text">Progress: 1 of ${lastpage}</b><br><br>This will take some time to finish depending on your internet speed. Please wait patiently.`);

        // Set event listener for iframe messages
        window.addEventListener("message", function(event) {
            if (!event.data.match(/down_hist_spawn_/)) {return;}
            let frameId = event.data.replace(/down_hist_/,""),
                pageNo = parseInt(frameId.replace(/spawn_/,""));
            document.getElementById(frameId).remove();
            if (pageNo >= lastpage) {
                pushLocal("Complete", lastpage.toString());

                updateDial('<b class="green-text">Progress complete!</b><br><br>All torrents have been successfully saved in the browser. Please wait for the torrents to be sorted.');
                setTimeout(doSort,1000);
            } else {
                spawnFrame(hisURL + "&page=" + (pageNo + 1));
                document.querySelector("#hisDial .swal-text .orange-text").innerText = `Progress: ${(pageNo + 1)} of ${lastpage}`;
            }
        });
    }
}
})();
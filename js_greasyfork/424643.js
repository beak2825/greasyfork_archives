// ==UserScript==
// @name         Downopto - Panopto Video Downloader
// @namespace    http://github.com/jaytohe/
// @version      1.2.3
// @description  Adds a download button to Panopto videos.
// @author       jaytohe
// @require      https://cdn.jsdelivr.net/npm/axios@0.21.1/dist/axios.min.js
// @match        https://*.panopto.eu/Panopto/Pages/Viewer.aspx?id=*
// @match        https://*.panopto.eu/Panopto/Pages/Sessions/List.aspx
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/424643/Downopto%20-%20Panopto%20Video%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/424643/Downopto%20-%20Panopto%20Video%20Downloader.meta.js
// ==/UserScript==

//Global Vars

//Coordinates for download, progress bar elements.
const dl_container_pos = {left: 5, bottom: 20};
const downopto_bar_container_pos = {bottom: 60};
const downopto_bar_pos = {width: 97};

function downloadVideo(url, savename, mimetype) {
    console.log(`Init video dl : ${url}`);
    setProgressBarVisibility(true);
    return axios.get(url, {
        responseType: 'blob',
        onDownloadProgress: function(progressEvent) {
          const percentage = Math.round(progressEvent.loaded / progressEvent.total * 100);
          setProgressBarValue(percentage);
          setProgressText(`Fetching: ${percentage}%`,'downopto-bar');
        }
    })
    .then(function(response) {
        const blob = response.data;
        const blob_url = URL.createObjectURL(blob, {
          type: mimetype
        });

        //Create hidden anchor and click it to download blob vid.
        const tmp = document.createElement('a');
        tmp.href = blob_url;
        tmp.download = sanitize(savename,'_') || ''; //set the filename.
        document.body.appendChild(tmp);
        tmp.click();
        tmp.remove();
        return Promise.resolve();
    })
    .catch(function(error) {
        return Promise.reject(new Error(`DL failed with msg : ${error.message}`));
    });
}

function constructDownloadURL(institution_prefix, delivery_id) { //Extract dl link from Embed.aspx page
     return new Promise(function (resolve, reject) {
         const embedURL = `https://${institution_prefix}.panopto.eu/Panopto/Pages/Embed.aspx?id=${delivery_id}&v=1&ignoreflash=true`;
         console.log(embedURL);
         const xhr = new XMLHttpRequest();
         xhr.responseType = "document";
         xhr.withCredentials = true; //use authentication cookies with GET request to simulate logged-in user.
         xhr.open("GET", embedURL);
         xhr.onload = function() {
             if (xhr.status == 200) {
                 const embed_dom = xhr.response;
                 const xpath_res = embed_dom.evaluate(
                     "//script[contains(text(), 'Panopto.Embed.instance')]",
                     embed_dom,
                     null,
                     XPathResult.FIRST_ORDERED_NODE_TYPE, //makes sure we always grab the first matching script tag
                     null
                 );
                 const embed_src_node = xpath_res.singleNodeValue.textContent;
                 if (embed_src_node != null) {
                     const lower_offset = embed_src_node.search(/"VideoUrl":/);
                     if (lower_offset !== -1) {
                         const upper_offset = embed_src_node.indexOf(',', lower_offset);
                         const matches = embed_src_node.substring(lower_offset, upper_offset).match(/"(.+)":"(.+)"/); //extract VideoUrl key-value pair
                         if (matches !== null)
                             resolve(matches[2].replaceAll(/\\/g, "")); //clean up videoUrl value and return
                         reject(new Error("Regex failed to find VideoUrl value"));
                     }
                     reject(new Error("Unable to find VideoUrl key"));
                 }
                 reject(new Error("Unable to find Panopto.Embed.Instance object"));
             }
             else reject(new Error(`Got ${xhr.status} status code when trying to fetch Embed.aspx page.`));
         }
         xhr.send();
     });
}
function LecturesListHandler(institution_prefix) { //handles scriptMode =1

  //Fix coordinates of download button and progress bar.
  dl_container_pos.left = 17;
  dl_container_pos.bottom = 40;
  downopto_bar_container_pos.bottom = 110;
  downopto_bar_pos.width = 125;

  //Register event listener of dl button.
  createDownloadButton("Download All").addEventListener("click", function() {
      onLecturesListBtnClick(institution_prefix);
  }, false);

  //Create the two progress bars.
  // One for the individual video download progress.
  // Second for how many videos have been downloaded so far.
  createDownloadProgressBar();
  createDownloadProgressBar('downopto-batch-bar');
}
function onLecturesListBtnClick(institution_prefix) { //handles the dl btn click when scriptMode = 1.
    console.log("called lecturesList");
    const LecturesList = document.querySelectorAll("table[id^=detailsTable] tr[draggable='false']"); //get tr rows of all visible videos.
    const videoIDS = []; //holds the id and the name for each video in LecturesList.
    for (const row of LecturesList) {
        const filename = row.querySelector("span[class='detail-title']").innerText; //extract the video's name from the row.
        videoIDS.push({"id": row.id, "name": filename});
    }
    let videos_dled = 0; //keep track of how many vids have been downloaded.
    videoIDS.reduce(function(previousVideoPromise, video) { //sequentially service promises.
            const batch_progress_bar = document.getElementById("downopto-batch-bar");
            return previousVideoPromise
                .catch(function(err) {
                console.log(err.message); //log dl error in case of Promise.reject
                videos_dled = (videos_dled < 0) ? 0 : videos_dled - 1; //if error in download, decrement videos_dled.
            }).then(function() {
                return constructDownloadURL(institution_prefix, video.id).then(function(source) {
                    return downloadVideo(source, video.name, 'video/mp4').then(function() { //mimetype hardcoded to make my life easier.
                        //After successful download:
                        videos_dled += 1;
                        batch_progress_bar.setAttribute(
                            'value',
                            Math.round(videos_dled / videoIDS.length * 100) //Update second "videos downloaded thus far" progress bar.
                        );
                        setProgressText(`${videos_dled} out of ${videoIDS.length}`,'downopto-batch-bar');
                    })
                });
            });

    }, Promise.resolve()); //initial accumulator value to set Promise type.
}

function ViewerPageHandler(institution_prefix, delivery_id) { //handles scriptMode = 0
  const button = createDownloadButton("Download");
  createDownloadProgressBar();
  button.addEventListener("click", function() {
      constructDownloadURL(institution_prefix, delivery_id).then(function(link) {
          const name = document.querySelector("meta[property^='og:title']").content; //get video's name
          downloadVideo(link, name, "video/mp4");
      })
  }, false);

}

function scriptMode() { //re-checks if we are on single lecture page or not.
    //Unfortunately, there's no way to find which specific match pattern called the script.
    //So we need to re-check.

    const viewRegex = /^https:\/\/([\w.]+)\.panopto\.eu\/Panopto\/Pages\/Viewer\.aspx\?id=(.+)$/;
    const listRegex = /^https:\/\/([\w.]+)\.panopto\.eu\/Panopto\/Pages\/Sessions\/List\.aspx$/;
    let url = window.location.href;
    url = url.substring(0, url.indexOf('#')) || url;

    const viewMatches = url.match(viewRegex); //grab institution_prefix and delivery_id
    if (viewMatches !== null) {
        return [0, viewMatches[1], viewMatches[2]]; // 0 indicates signle video download mode (Viewer.aspx page)
    }
    const listMatches = url.match(listRegex); //grab institution_prefix only; delivery_id for each video in list is extracted from the DOM.
    if (listMatches !== null) { // 1 indicates Bulk Download Mode (List.aspx page)
        return [1, listMatches[1]];
    }

    return null;

}


//MAIN FUNCTION.
(function () {
    const params = scriptMode();
    if (params === null)
        return;
    if (params[0] === 0)
        ViewerPageHandler(params[1], params[2]);
    else if (params[0] === 1)
        LecturesListHandler(params[1]);
})();


//HTML, CSS functions
function createDownloadButton(btn_txt) {
  const btnNode = document.createElement('div');
  const dl_btn = document.createElement('button');
  btnNode.setAttribute('id', 'pdl-container');
  dl_btn.id = 'pdl-btn';
  dl_btn.innerHTML = btn_txt;
  btnNode.appendChild(dl_btn);
  document.body.appendChild(btnNode);
  return dl_btn;
}

function createDownloadProgressBar(bar_id = 'downopto-bar') {
  const container = document.createElement("div");
  const bar = document.createElement("progress");
  container.setAttribute('id', `${bar_id}-container`);
  bar.setAttribute("max", "100");
  bar.setAttribute("id", bar_id);
  container.appendChild(bar);
  document.body.appendChild(container);
  createPercentageText(bar_id);
  setProgressBarVisibility(true, bar_id);
  setProgressBarValue(0, bar_id);
}

function createPercentageText(bar_id = 'downopto-bar') {
  const container = document.createElement("div");
  container.setAttribute('id', `${bar_id}-percentage-container`);
  const s = document.createElement("span");
  s.setAttribute("id", `${bar_id}-percentage`);
  s.innerHTML = "";
  container.appendChild(s);
  document.body.appendChild(container);
}

function setProgressBarVisibility(k, bar_id = 'downopto-bar') {
  const t = k ? 'block' : 'none';
  document.getElementById(bar_id).style.display = t;
}

function setProgressBarValue(val, bar_id = 'downopto-bar') {
  document.getElementById(bar_id).setAttribute('value', val);
}

function setProgressText(val, bar_id) {
  document.getElementById(bar_id+'-percentage').innerHTML = val;
}


//UTILITY FUNCTIONS.

//Adapted from https://github.com/parshap/node-sanitize-filename/blob/master/index.js
function sanitize(input, replacement='') {
const illegalRe = /[\/\?<>\\:\*\|"]/g;
const controlRe = /[\x00-\x1f\x80-\x9f]/g;
const reservedRe = /\.+/;
const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
const windowsTrailingRe = /[\. ]+$/;
  if (typeof input !== 'string') {
    throw new Error('Input must be string');
  }
  const sanitized = input
    .replace(illegalRe, replacement)
    .replace(controlRe, replacement)
    .replace(reservedRe, replacement)
    .replace(windowsReservedRe, replacement)
    .replace(windowsTrailingRe, replacement);
  return sanitized;
}



GM_addStyle(`
    #pdl-container {
        position: absolute;
        bottom: ${dl_container_pos.bottom}px;
        left: ${dl_container_pos.left}px;
        opacity: 0.8;
        z-index: 1100;
    }

    #downopto-bar-container {
      position: absolute;
      bottom: ${downopto_bar_container_pos.bottom}px;
      left: ${dl_container_pos.left}px;
      opacity: 0.8;
      z-index: 1100;
    }

    #downopto-bar-percentage-container {
      position: absolute;
      bottom: ${downopto_bar_container_pos.bottom}px;
      left: ${dl_container_pos.left}px;
      opacity: 0.8;
      z-index: 1100;
    }

    #downopto-batch-bar-percentage-container {
      position: absolute;
      bottom: 90px;
      left: 17px;
      opacity: 0.8;
      z-index: 1100;
    }

    #downopto-batch-bar-container {
      position: absolute;
      bottom: 90px;
      left: 17px;
      opacity: 0.8;
      z-index: 1100;
    }

    #pdl-btn {
        cursor: pointer;
        border: none;
        background: #008080;
        font-size:  20px;
        color:  white;
        padding: 5px 5px;
        text-align: center;
    }

    #downopto-bar {
      height: 20px;
      width: ${downopto_bar_pos.width}px;
    }

    #downopto-batch-bar {
      height: 12px;
      width: 125px;
    }

`);

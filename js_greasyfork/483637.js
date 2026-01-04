// ==UserScript==
// @name        TorrentBD - Uploaded torrents to CSV or Copy.
// @icon        https://www.torrentbd.net/themes/material/static/favicon/favicon-32x32.png
// @namespace   Violentmonkey Scripts
// @match       https://www.torrentbd.com/account-details.php*
// @match       https://www.torrentbd.me/account-details.php*
// @match       https://www.torrentbd.net/account-details.php*
// @match       https://www.torrentbd.org/account-details.php*
// @grant       none
// @version     4.8.1
// @author      TheMyth434
// @run-at      document-end
// @description Copy or CSV download from TorrentBD uploaded torrent.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483637/TorrentBD%20-%20Uploaded%20torrents%20to%20CSV%20or%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/483637/TorrentBD%20-%20Uploaded%20torrents%20to%20CSV%20or%20Copy.meta.js
// ==/UserScript==


let k = 1;
let uploader = document.querySelector("#middle-block > div:nth-child(2) > div > div.profile-tib-container > h5 > span").textContent
let checkkbox = [
    {
        name: "Type",
        value: "Type",
        id: "torrentType",
        get: element => {
            return element.querySelector("td > img").title
        }
    },
    {
        name: "Name",
        value: "Name",
        id: "torrentName",
        get: element => {
            return element.querySelector("td > span").innerText
        }
    },
    {
        name: "Time",
        value: "Time",
        id: "torrentTime",
        get: element => {
            return element.querySelectorAll("td > span")[1].textContent
        }
    },
    {
        name: "Size",
        value: "Size",
        id: "torrentSize",
        get: element => {
            return element.querySelectorAll("td")[5].textContent
        }
    },
    {
        name: "Seeder",
        value: "S",
        id: "torrentSeeder",
        get: element => {
            return element.querySelectorAll("td")[6].textContent
        }
    },
    {
        name: "Lecher",
        value: "L",
        id: "torrentLecher",
        get: element => {
            return element.querySelectorAll("td")[7].textContent
        }
    },
    {
        name: "Completed",
        value: "C",
        id: "torrentCompleted",
        get: element => {
            return element.querySelectorAll("td")[8].textContent
        }
    }
]
let checkboxArray = new Array()
const getTorrent = (flag,checkedIndex) => {
    let a = document.querySelectorAll("#torrents-main > div > table tr")
    let torrents = "";
    for (i = 1; i < a.length; i++) {
        let tid = a[i].querySelector("span").dataset.tid
        if (tid != undefined) {
            if (flag) {
                torrents += `${k}\nlinks:https://www.torrentbd.net/torrents-details.php?id=${tid} `
                checkedIndex.forEach(x => {
                    torrents += `\n${checkkbox[x].name}: ${checkkbox[x].get(a[i])}`
                })
                torrents += "\n\n"
            } else {
                torrents += `${k},https://www.torrentbd.net/torrents-details.php?id=${tid},`
                checkedIndex.forEach(x => {
                    torrents += `"${checkkbox[x].get(a[i])}",`
                })
                torrents += "\n"
            }
            k++;

        }
    }
    return torrents;
};
function getCurrentDateTimeString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const formattedDateTime = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
    return formattedDateTime;
}
const copyTorrentLinks = (output) => {
    const input = document.createElement("textarea");
    input.value = output
    document.body.appendChild(input);
    input.focus();
    input.select();
    let result = document.execCommand("copy");
    document.body.removeChild(input);
    if (result) alert("Torrent links copied to clipboard");
    else
        prompt("Failed to copy links. Manually copy from below\n\n", input.value);
};

function createCSVFile(output) {
    let newOutput =
        `Uploaded By:${uploader}
    Total Torrent:${k - 1}\n
    ${output}
    `
    let fileName = `${uploader} TBD Uploads ${getCurrentDateTimeString()}`
    var blob = new Blob([newOutput], { type: 'text/csv' });
    var link = document.createElement('a');
    link.download = fileName + '.csv';
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function mainfunction(flag) {
    if (flag!=true) {
        flag=false
    }
    k = 1
    let checkedIndex=new Array()
    let output=""
    if (!flag) {
        output = "No,URL,"
        checkboxArray.forEach(x => {
            if (x[0].checked) {
                checkedIndex.push(parseInt(x[0].dataset.index))
                output += `${x[1].textContent},`;
            }
            x[0].disabled = true
        })
        output += "\n"
    }else{
        checkboxArray.forEach(x => {
            if (x[0].checked) {
                checkedIndex.push(parseInt(x[0].dataset.index))
            }
            x[0].disabled = true
        })
    }
    dlBtn.disabled = true
    cpyBtn.disabled = true
    let prevelement = document.querySelector('li[title="Previous page"]');
    if (prevelement) {
        let page1 = document.querySelector('li[title="Page 1"]');
        page1.click()
        await sleep(2000);
    }
    while (true) {
        output += getTorrent(flag,checkedIndex);
        let nextelement = document.querySelector('li[title="Next page"]');
        if (nextelement == null || nextelement == undefined) {
            if (flag) {
                copyTorrentLinks(output)
            } else {
                createCSVFile(output)
                alert("CSV File Downloaded");
            }
            break;
        } else {
            nextelement.click()
            await sleep(2000);
        }
    }
    checkboxArray.forEach(x => {
        x[0].disabled = false
    })
    dlBtn.disabled = false
    cpyBtn.disabled = false
}
let container = document.querySelector("#torrents");
const newDiv = document.createElement("div");
newDiv.style = "text-align: center;margin-top: 10px;";
const dlBtn = document.createElement("button");
dlBtn.textContent = "Download Links";
dlBtn.setAttribute("align", "center");
dlBtn.setAttribute("title", "Download as CSV");
dlBtn.style =
    "border-radius: 4px;margin: 6px 8px;padding: 6px 14px;border: none;";
dlBtn.addEventListener("click", mainfunction);

const cpyBtn = document.createElement("button");
cpyBtn.textContent = "Copy Links";
cpyBtn.setAttribute("align", "center");
cpyBtn.style =
    "border-radius: 4px;margin: 6px 14px;padding: 6px 14px;border: none;";
cpyBtn.addEventListener("click", () => mainfunction(flag=true));

checkboxArray = checkkbox.map((x, index) => {
    let newCheckbox = document.createElement("input");
    newCheckbox.type = "checkbox";
    newCheckbox.value = x.value;
    newCheckbox.dataset.index = index
    newCheckbox.name = x.id;
    newCheckbox.id = x.id;
    let label = document.createElement("label");
    label.htmlFor = x.id;
    label.style = "padding-left: 26px;margin-right: 18px;"
    label.textContent = x.name;
    return [newCheckbox, label]

})
checkboxArray.forEach(x => {
    newDiv.appendChild(x[0]);
    newDiv.appendChild(x[1]);
})

newDiv.appendChild(dlBtn);
newDiv.appendChild(cpyBtn);
container.prepend(newDiv);
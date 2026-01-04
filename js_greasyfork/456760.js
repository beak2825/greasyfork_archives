// ==UserScript==
// @name         TJUPT helper
// @namespace    https://blog.miigon.net
// @version      0.2
// @license      GPL2
// @description  my personal script to enchance TJUPT experience
// @author       Miigon
// @match        https://tjupt.org/*
// @match        https://byr.pt/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setClipboard
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/456760/TJUPT%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/456760/TJUPT%20helper.meta.js
// ==/UserScript==

/*
    VERSION 0.1:
      - supports tjupt and byrpt.
      - torrent page shows torrent downloader/uploader ratio.
      - clicking the downup ratio will copy the torrent link.
      - automatically loads next page of torrents and show them
        on current page, effectively doubling the page size.
    VERSION 0.2:
      - add funbox from byr.pt to tjupt.org, resize and center images.
      - torrent page sort torrent with down/up ratio = NaN to the top.
        fix number parsing bug for numbers containing `,`
*/

let link = window.location.href;

/* global $ */
/* global Preview */

console.log("$ = ", $);

function remove_space(str) { return str.replace(/\s/g, ""); }
function parseNumber(str) { return Number(str.replace(/[^\d]/g, "")); }

function parse_torrent_table(context) {
    let torrents_table = $(".torrents > tbody > tr:gt(0)", context);
    // parse torrent table
    let torrents = []
    for(let i = 0; i < torrents_table.length; i++) {
        let tr = torrents_table[i]; // have to do this to support byr.pt
        let c = tr.children
        let torrent = {
            name: $(".torrentname a", c[1])[0].title,
            link: $(".torrentname a", c[1])[0].href,
            comments: parseNumber(c[2].innerText),
            time: remove_space(c[3].innerText),
            size: remove_space(c[4].innerText),
            uploader: parseNumber(c[5].innerText),
            downloader: parseNumber(c[6].innerText),
            completes: parseNumber(c[7].innerText),
            author: c[8].innerText,
            html_node: tr,
        }
        torrent.torrent_id = torrent.link.match(/id=(\d+)/)[1];
        torrent.downup_ratio = torrent.downloader / torrent.uploader;
        torrents.push(torrent);
    }
    return torrents;
}

function get_torrent_header(context) {
    return $(".torrents > tbody > tr:eq(0)", context);
}

function modify_torrent_header(context) {
    $("td:eq(6)", get_torrent_header(context)).after("<td class='colhead'><img src='https://tjupt.org/pic/s_dl.gif'/></td>");
}

function temporary_inner_text_override(elem, newtext) {
    let oldtext = elem.innerText;
    elem.innerText = newtext;
    setTimeout(()=>{elem.innerText = oldtext;},1000);
}

let passkey_parameter_str = null;
function find_passkey_parameter() {
    if(passkey_parameter_str != null) return passkey_parameter_str;
    if(link.indexOf("tjupt.org") != -1){
        let passkey = $("link[title='Latest Torrents']")[0].href.match(/passkey=(.*)/)[1];
        passkey_parameter_str = "&passkey=" + passkey;
    } else {
        passkey_parameter_str = "";
    }
    return passkey_parameter_str;
}

function modify_torrent_table(torrents, context) {
    // process & modify torrent table
    // downup_ratio
    for(let t of torrents) {
        let duratio_percent = Math.round(t.downup_ratio*100);
        if(duratio_percent == Infinity) {
            duratio_percent = "Inf";
        }
        let duratio_precent_node = $("<td class='rowfollow'><b><a href='#'>" + duratio_percent + "%</a></b></td>")
        duratio_precent_node[0].onclick = function(){
            // copy download link or download torrent file
            let passkey_parameter = find_passkey_parameter();
            let download_link = link.replace(/\/torrents.php.*/, "/download.php?id=" + t.torrent_id + passkey_parameter);
            if(passkey_parameter != "") {
                // has passkey, probably wants copy so the link can be used in a bt client.
                GM_setClipboard(download_link);
                temporary_inner_text_override($("a",duratio_precent_node)[0], "Copied!");
            } else {
                // does not have passkey, probably should download in browser, since the website might be using cookie to authenticate.
                $("body").after($("<iframe src='" + download_link + "'/ hidden>"));
            }
            return false;

        }

        $("td:nth-child(7)", t.html_node).after(duratio_precent_node);

    }
    return torrents;
}

function sort_torrent_table(torrents) {
    torrents.sort((a,b) => {
        if(isNaN(a.downup_ratio)) return -1;
        if(isNaN(b.downup_ratio)) return 1;
        return b.downup_ratio - a.downup_ratio
    });
}

function rebuild_torrent_table(torrents, context) {
    let new_tbody = $("<tbody/>");
    new_tbody.append(get_torrent_header(context));
    for(let t of torrents) {
        new_tbody.append(t.html_node);
    }
    $(".torrents > tbody", context).remove();
    $(".torrents", context).append(new_tbody);
}

console.log("link", link)
if(link.indexOf("/torrents.php") != -1) {
    if(link.indexOf("#subpage") == -1) { // parent page
        let torrents = parse_torrent_table(document);
        modify_torrent_header(document); // only need to do once
        modify_torrent_table(torrents, document);
        sort_torrent_table(torrents);
        rebuild_torrent_table(torrents, document);

        let page_regex = /[?&]page=(\d+)/
        let page_match = link.match(page_regex)
        let current_page = 0
        let next_page_link = "";
        if(page_match != null) {
            current_page = Number(page_match[1]);
            next_page_link = link.replace(page_match[0], page_match[0][0]/* ? or & */ + "page=" + String(current_page + 1))
        } else {
            next_page_link = (link.indexOf("?") == -1 ? "?" : "&") + "page=" + String(current_page + 1)
        }
        console.log("current_page", current_page);
        console.log("next_page_link", next_page_link);

        // try to load torrent table of next page and merge it to the current page
        let f = $("<iframe src='" + next_page_link + "#subpage'/ hidden>");
        $("body").after(f);
        // listen for subpage_ready message.
        window.addEventListener("message", function(event) {
            if(event.data == "subpage_ready") {
                let childDocument = f[0].contentDocument;
                let cts = parse_torrent_table(childDocument);
                modify_torrent_table(cts, childDocument)
                torrents.push(...cts);
                sort_torrent_table(torrents);
                rebuild_torrent_table(torrents, document);
            } else {
                console.log("parent: unrecognized message " + event.data);
            }
        });
    } else { // subpage
        parent.postMessage("subpage_ready", "*");
    }
} else if(link.indexOf("tjupt.org/index.php") != -1 || link == "https://tjupt.org/" || link == "https://tjupt.org") {
    $(".fun_text").after($("<h2 align='left'>北邮人趣味盒"
                           + "<font class='small'>  - [<a class='altlink' href='https://byr.pt/fun.php' target='_blank'>查看</a>]</h2>"
                           + "<iframe src='https://byr.pt/fun.php#embedded' style='width: 100%; height: 600px; border: none;'/>"
                          ));
    window.addEventListener("message", function(event) {
        let data = JSON.parse(event.data);
        if(data.cmd == "funbox_click") {
            Preview(data.url);
        } else {
            console.log("parent: unrecognized message " + event.data);
        }
    });
    let images = [...$(".fun_text img")].filter(e=>e.alt=="image");
    images.forEach(e => {e.style.width="50%"; e.style.height="auto"});
    images[0].parentElement.style.textAlign="center";
} else if(link.indexOf("byr.pt/fun.php") != -1) {
    if(link.indexOf("#embedded") != -1) {
        console.log("byrpt funbox inside tjupt");
        // match style
        [...document.getElementsByTagName("link")].filter(e=>e.href.indexOf("/theme.css")!=-1)[0].remove();
        // fix image click bug
        unsafeWindow.Preview = function(t){parent.postMessage(JSON.stringify({ cmd:"funbox_click", url: t.src}), "*");};
        // center image, resize image to 50%
        [...document.getElementsByClassName("shoutrow")].forEach(e=>{e.style.textAlign="center";});
        [...document.getElementsByTagName("img")].filter(e=>!e.src.startsWith("pic/")).forEach(e=>{e.style.width = "50%";e.style.height="auto";});
    }
}
// ==UserScript==
// @name         BrokenStones - Upload App Helper
// @namespace    https://brokenstones.is/
// @version      0.8.2
// @description  Set of tools to ease app upload on BrokenStones
// @author       whatever
// @match        https://brokenstones.is/upload.php*
// @match        https://brokenstones.is/torrents.php?action=editgroup*
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/464020/BrokenStones%20-%20Upload%20App%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/464020/BrokenStones%20-%20Upload%20App%20Helper.meta.js
// ==/UserScript==

//config (default)
var imgur_clientid = ""; // personal imgur key

//default values
var label_features = "[b]Features[/b]",
    label_screenshots = {start:"\n\n[hide=Screenshots]", end:"[/hide]"},
    label_info = "\n\n[b]More information[/b]: ",
    label_instructions_zip = "[#] Unpack\n[#] Move to Applications\n[#] Play!\n",
    label_instructions_pkg = "[#] Install\n[#] Play!\n",
    label_instructions_dmg = "[#] Mount\n[#] Drag & Drop into Applications\n",
    label_languages = "\n[b]Languages[/b]: ",
    label_version = "\n[b]Version[/b]: ",
    label_changelog = "\n\n[b]What's new[/b]:\n\n",
    label_cure = {start:"\n\n[b]Courtesy of ", end:"[/b]"},
    list_stores = ["Mac App Store", "Official Website"],
    list_cures = ["DRM Free", "TNT", "HCiSO"],
    label_button = {edit:"Update", upload:"Load"},
    nb_screenshots = 4;

//site vars
var page_add = window.location.href.includes("upload.php?groupid=") ? true : false,
    page_edit = window.location.href.includes("torrents.php?action=editgroup") ? true : false,
    page_upload = !page_add && !page_edit ? true : false,
    ah_form = page_edit ? document.forms.torrent_group : document.forms.torrent,
    ah_form_categories = page_edit ? document.torrent_group[1].newcategoryid : ah_form.categories,
    version_max_length = 30,
    cpu_max_length = 20,
    os_max_length = 20,
    ram_max_length = 20,
    vram_max_length = 20;

//save slots
var ah_screenshots, ah_info, ah_group_desc,
    ah_search_loaded = 0,
    pmatchurl = [],
    ah_search_array = [],
    ah_on = false,
    ah_button_label = label_button.upload,
    ah_version_lock = false,
    ah_group_screens_lock = page_edit ? true : false,
    ah_image_lock = page_edit ? true : false,
    ah_release_desc_lock = false,
    ah_group_desc_lock = false,
    ah_search_forced_display = false,
    ah_onblur_delay = false,
    ah_languages = "",
    ah_changelog = "",
    ah_last_release_date = "",
    ah_instructions = label_instructions_dmg; //default value

//decisive elements
var ah_search_results, ah_input, ah_button, ah_includes, ah_store_id, ah_form_desc, ah_cure, ah_source;

//regexes
function get_desc(str) {
    if (!str) return "";
    str = str.replace(/(©|™|®)/g, "");
    str = str.replace(/\n\s*\t*(-|\*|•|・|\+){1}\s+\t*/g, "\n[*]");
    str = str.replace(/\&quot;/g, "\"");
    str = str.replace(/\&amp;/g, "&");
    str = str.replace(//g, "\"");
    str = str.replace(//g, "\"");
    str = str.replace(/\\"/g, "\"");
    str = str.replace(/<\/*p>/ig, "");
    str = str.replace(/<\/*ul>/ig, "");
    str = str.replace(/<\/*u>/ig, "[$1u]");
    str = str.replace(/<\/li>/ig, "");
    str = str.replace(/<(\/*)em>/ig, "[$1i]");
    str = str.replace(/<(\/*)strong>/ig, "[$1b]");
    str = str.replace(/<(\/*)b>/ig, "[$1b]");
    str = str.replace(/<(\/*)h(2|3|4|5|6)>/ig, "[$1b]");
    str = str.replace(/<\/a>/ig, "[/url]");
    str = str.replace(/<a href=\"(.*?)\".*>/ig, "[url=$1]");
    str = str.replace(/\t*<li>/ig, "[*]");
    str = str.replace(/^\n+/, "");
    str = str.replace(/\n+$/, "");
    return str;
}
function get_changelog(str) {
    if (!str) return "";
    str = str.replace(/(©|™|®)/g, "");
    str = str.replace(/\&quot;/g, "\"");
    str = str.replace(/\&amp;/g, "&");
    str = str.replace(/<\/*ul>/ig, "");
    str = str.replace(/<\/li>/ig, "");
    str = str.replace(/<\/*p>/ig, "");
    str = str.replace(/\t*<li>/ig, "[*]");
    str = str.replace(/<(\/*)strong>/ig, "[$1b]");
    str = str.replace(/<(\/*)h5>/ig, "[$1u]");
    str = str.replace(/<\/a>/ig, "[/url]");
    str = str.replace(/<a href=\"(.*?)\".*>/ig, "[url=$1]");
    str = str.replace(/(\n|^) *(•|-|\*) */g, "$1[*]");
    str = str.replace(/^(\r\n\s*)+/, "");
    str = str.replace(/^(\n\s*)+/, "");
    str = str.replace(/(\r\n)+$/, "");
    str = str.replace(/(\n)+$/, "");
    str = str.replace(/\s\s+/, " ");
    str = str.replace(/(\r\n\s*){3,20}/g, "\n\n");
    return str;
}
function get_date(str) {
    var release_date = new Date(str);
    var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][release_date.getMonth()];
    var day = ["", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th", "13th", "14th", "15th", "16th", "17th", "18th", "19th", "20th", "21st", "22nd", "23rd", "24th", "25th", "26th", "27th", "28th", "29th", "30th", "31st"][release_date.getDate()]
    str = " (" + month + " " + day + " " + release_date.getFullYear() + ")";
    return str;
}

function get_langs(str) {
    if (!str) return "";
    str = str.replace(/AR/, "Arabic");
    str = str.replace(/AF/, "Afrikaans");
    str = str.replace(/BE/, "Belarusian");
    str = str.replace(/BG/, "Bulgarian");
    str = str.replace(/CA/, "Catalan");
    str = str.replace(/ZH/, "Chinese");
    str = str.replace(/HR/, "Croatian");
    str = str.replace(/CS/, "Czech");
    str = str.replace(/DA/, "Danish");
    str = str.replace(/NL/, "Dutch");
    str = str.replace(/EN/, "English");
    str = str.replace(/FA/, "Farsi");
    str = str.replace(/FI/, "Finnish");
    str = str.replace(/FR/, "French");
    str = str.replace(/DE/, "German");
    str = str.replace(/EL/, "Greek");
    str = str.replace(/HE/, "Hebrew");
    str = str.replace(/HI/, "Hindi");
    str = str.replace(/HU/, "Hungarian");
    str = str.replace(/ID/, "Indonesian");
    str = str.replace(/IT/, "Italian");
    str = str.replace(/JA/, "Japanese");
    str = str.replace(/KO/, "Korean");
    str = str.replace(/MS/, "Malay");
    str = str.replace(/NB/, "Norwegian Bokmål")
    str = str.replace(/NO/, "Norwegian");
    str = str.replace(/PL/, "Polish");
    str = str.replace(/PT/, "Portuguese");
    str = str.replace(/RO/, "Romanian");
    str = str.replace(/RU/, "Russian");
    str = str.replace(/SK/, "Slovak");
    str = str.replace(/ES/, "Spanish");
    str = str.replace(/SV/, "Swedish");
    str = str.replace(/TH/, "Thaï");
    str = str.replace(/TR/, "Turkish");
    str = str.replace(/UK/, "Ukrainian");
    str = str.replace(/VI/, "Vietnamese");
    return str;
}
function get_os(str) {
    if (!str) return "N/A";
    str = str.replace(/MacOS/i, "");
    str = str.replace(/Mac/i, "");
    str = str.replace(/OS/i, "");
    str = str.replace(/X/i, "");
    str = str.replace(/^\s+/, "");
    str = str.replace(/\s+$/, "");
    str = str + "+";
    return str;
}
function is_version_more_recent_than(newVersion, oldVersion) {
    oldVersion = oldVersion.toLowerCase().replace(/\s/g, "").split('.');
    newVersion = newVersion.toLowerCase().replace(/\s/g, "").split('.');
    var length = newVersion.length > oldVersion.length ? newVersion.length : oldVersion.length;
    for (var i = 0; i < length; i++) {
        var x = parseInt(newVersion[i]),
            y = parseInt(oldVersion[i]);
        if (x > y) return true;
        if (x < y) return false;
    }
    return false;
}
function get_title(str) {
    str = str.replace(/(©|™|®)/g, "");
    str = str.replace(/’/g,"'");
    var s_str = str.toLowerCase().split(' ');
    for (var i = 0; i < s_str.length; i++) {
        var word = s_str[i];
        if (!/^(a|an|and|as|at|but|by|for|in|of|on|or|nor|the|to)$/.test(word)) {
            if (/^x{0,3}(ix|l|iv|v?i{0,3}:*)$/.test(word) || /^(hd|3d|td|rpg|ai|abc|dlc|ost|os|osx|ftp|sftp|ms|vpn|pdf):*$/.test(word)) {
                s_str[i] = word.toUpperCase();
            } else {
                s_str[i] = word.charAt(0).toUpperCase() + word.substring(1);
            }
        } else if (i == 0) {
            s_str[i] = word.charAt(0).toUpperCase() + word.substring(1);
        } else if (/(:|-)$/.test(s_str[i-1])) {
            s_str[i] = word.charAt(0).toUpperCase() + word.substring(1);
        }
    }
    str = s_str.join(' ');
    str = str.replace(/macos/gi, "macOS");
    str = str.replace(/macosx/gi, "MacOSX");
    str = str.replace(/ios/gi, "iOS");
    str = str.replace(/ipados/gi, "iPadOS");
    str = str.replace(/iwork/gi, "iWork");
    str = str.replace(/ipad/gi, "iPad");
    str = str.replace(/iphone/gi, "iPhone");
    str = str.replace(/ipod/gi, "iPod");
    str = str.replace(/tvos/gi, "tvOS");
    return str;
}
function get_appid(str) {
    if (/\/app\/.*?id([0-9]+)(\?mt|\?ls|)/.test(str)) {
        var id = str.match(/\/app\/.*?id([0-9]+)(\?mt|\?ls|)/)[1];
        //ah_input.value = id + " - MAS";
        ah_store_id.value = "0";
        ah_store_id.setAttribute("itunesid", id);
    }
}


//data handlers
function fill_instructions(str) {
    ah_instructions = str.includes(".pkg.torrent") ? label_instructions_pkg : str.includes(".dmg.torrent") ? label_instructions_dmg : label_instructions_zip;
    if (/TNT/.test(str)) { ah_cure.selectedIndex = 2;}
    if (/HCiSO/.test(str)) { ah_cure.selectedIndex = 3;}
    if (/MAS/.test(str)) { ah_source.selectedIndex = 1;}

    fill_release_desc();
}
function fill_search(response) {
    ah_search_loaded--;
    var macupdate = response.responseText.includes("DOCTYPE") ? true : false,
        store_label = macupdate ? "MacUpdate" : "AppStore",
        store_image = document.createElementNS("http://www.w3.org/2000/svg","svg");

    //SVG
    store_image.setAttribute("height", "20");
    store_image.setAttribute("width", "20");
    store_image.setAttribute("class", store_label.toLowerCase());
    if(macupdate) store_image.setAttribute("viewBox", "0 0 126.781 70.156");
    if(!macupdate) store_image.setAttribute("viewBox", "0 0 260 229.156");
    store_image.innerHTML = macupdate ? "<path d='M120,36l13,20-8-1s-1.861,28.385-8.6,38.86c-7.5,11.649-19.207,15.763-35.4,9.14-17.127-7,3.924-45.234-10.19-46.039C54.632,57.354,59.3,85.49,53,103c0.267,1.554-14.11,3.823-14,0,0.185-6.4,10.262-45.614,0-46-17.547-.661-11.795,33.34-19,47-6.873.279-11.913,1.929-13.775-1.985C10.524,81.653,7.912,49.168,33,44a26.707,26.707,0,0,1,22,5c4.045-3.09,22.066-10.31,33,1,9.076,9.389-2.4,27.323,2,39,2.667,5.333,5.307,3.732,9,3,10.146-6.763,11-38,11-38l-7-1Z' transform='translate(-6.219 -36)'/>" : "<path d='M126,36l12,2c16,22.667,11.667,17,13,17,3.127-10.354,9.128-19,23-19,5.03,2.272,8.63,3.941,11,9,6.786,13.524-8.84,28.794-14,38-18.332,32.663-55,98-55,98s68.692-7.034,69,15c3.733,10.286-1,16-1,16s-140.783-.962-148,0-12.79-8.464-16-14c0.68-6.923,2.954-11.293,9-15s50-2,50-2,36-63,53-93c-6.368-7.014-25.425-32.9-16-44C118.443,38.946,121.326,38.692,126,36Zm47,63c13.924,20.061,48,81,48,81s42.966-1.691,56,7l3,8c-0.362,5.269-1.293,8.243-4,11-5.45,8.323-19.878,7.525-34,7,3.133,12.729,18.384,24.77,17,37-1.282,11.333-15.044,20.072-26,12-5.29-2.139-11.1-12.59-27-44C166.691,144.529,149.129,138.627,173,99ZM58,220c14.428-.073,19.59.615,29,10-5.266,11.106-13.353,29.206-25,34-9.5,2.9-16.4-2.8-19-10C39.089,240.489,50.664,226.344,58,220Z' transform='translate(-20 -36)'/>";

    if (macupdate) {
        var search_dom = document.createElement('html'); //polar bear friendly
        search_dom.innerHTML = response.responseText.split("<div class=\"mu_card_ad_line\"><div>")[1].split("<div class=\"mu_search_results_pagination\">")[0];
    } else if(page_add) {
        var desc_urls = ah_form_desc.value.match(/(http|https):\/\/.+?(\s|\n|\]|$)/ig);
    }

    var results = macupdate ? search_dom.querySelectorAll("a.ns_sp_app-results") : response.response.results,
        length = results.length;

    results.forEach(function(result, index) {
        if (index > 9) return;
        if (!macupdate && result.kind != "mac-software") {
            length --;
            return;
        }

        var title = macupdate ? get_title(result.querySelector("div.mu_card_line_info_name").innerText): get_title(result.trackName),
            title_hash = title.toLowerCase().replace(/(\s|\-|:|#|'|!|&|\?|\/|\.)/g, "").replace(/^(\d+)/g, "n$1").replace(/\+/g, "plus"),
            id = macupdate ? /\/mac\/(\d+)\//.exec(result.getAttribute("href"))[1] : result.trackId,
            version = macupdate ? result.querySelector("div.mu_card_line_info_version").innerText : result.version,
            cover_image = macupdate ? result.querySelector("img.mu_card_line_img").getAttribute("src") : result.artworkUrl60;

        //result filter

        var option = document.createElement("div");
        if (title.toLowerCase().includes(ah_input.value.toLowerCase())) {
            option.className = "top";
        } else {
            option.className = "down";
        }
        var input = document.createElement("input");
        input.type = "radio";
        input.name = "ah_search_item";
        input.id = title_hash;
        input.value = macupdate ? id : 0;
        input.onclick = function () {

            ah_store_id.value = this.value;
            //ah_input.value = this.nextElementSibling.textContent;
            var itunesid = this.getAttribute("itunesid");
            if (itunesid) ah_store_id.setAttribute("itunesid", itunesid);
            if (!itunesid) ah_store_id.setAttribute("itunesid", "");
            ah_button.click();
        }
        option.appendChild(input);
        var label = document.createElement("label");
        label.setAttribute("for", title_hash);

        var cover = document.createElement("img");
        cover.src = cover_image;
        cover.setAttribute("referrerpolicy", "no-referrer");
        cover.className = "left";
        label.appendChild(cover);

        var title_elem = document.createTextNode(title.substr(0, 40));
        label.appendChild(title_elem);

        var version_elem = document.createElement("span");
        version_elem.innerText = version;
        label.appendChild(version_elem);

        var store_img = store_image.cloneNode(true);

        label.appendChild(store_img);//
        option.appendChild(label);

        //use urls as identifier (not used)
        /*if (!macupdate && page_add && result.sellerUrl) {
            desc_urls.forEach(function(url) {
                if (result.sellerUrl.includes(url) || url.includes(result.sellerUrl)) pmatchurl.push(title_hash);
            });
        }*/

        var selector = "input#"+title_hash;
        var found = ah_search_results.querySelector(selector);
        var first_down = ah_search_results.querySelector("div.down") || ah_search_results.querySelector("div");
        if (!found) {
            if (!macupdate) input.setAttribute("itunesid", id);
            if(option.className=="top") {
                if (first_down) { ah_search_results.insertBefore(option, first_down); }
                else { ah_search_results.appendChild(option); }
            } else {
                ah_search_results.appendChild(option);
            }

        } else {
            if (macupdate) {
                if(!found.nextElementSibling.innerHTML.includes("macupdate")) {
                    var version_node = found.nextElementSibling.childNodes[2];
                    var needs_update = is_version_more_recent_than(version, version_node.innerText);
                    if(needs_update) version_node.innerText = version;
                    found.nextElementSibling.appendChild(store_img);
                    found.value = id;
                } else {
                    input.id = title_hash + "_" + index;
                    label.setAttribute("for", input.id);
                    if(option.className=="top") {
                        if (first_down) { ah_search_results.insertBefore(option, first_down); }
                        else { ah_search_results.appendChild(option); }
                    } else {
                        ah_search_results.appendChild(option);
                    }
                }
            } else {
                found.nextElementSibling.appendChild(store_img);
                found.setAttribute("itunesid", id);
            }
        }
    });

    if (length == 0) {
        var label_no_result = "No results on "+ store_label;
        var option = document.createElement("div");
        var label = document.createElement("label");
        var cover = document.createElement("img");
        var title_elem = document.createTextNode(label_no_result);
        label.appendChild(title_elem);
        label.appendChild(store_image);
        option.appendChild(label);
        ah_search_results.appendChild(option);
    }

    if (ah_search_loaded == 0) {
        var hash = ah_input.value.toLowerCase().replace(/(\s|\-|:|#|'|!|&|\?|\/|\.)/g, "").replace(/^(\d+)/g, "n$1").replace(/\+/g, "plus");
        var selector = "input#"+hash;
        var found = ah_search_results.querySelector(selector);
        if (found) { //perfect match
            found.click();
            ah_input.blur();
        } else {
            ah_search_results.style.display = "";
        }
    }

    ah_search_forced_display = false;
}
function fill_group_desc() {
    if (!ah_group_desc_lock) {
        var group_screenshots = ah_screenshots != "" ? label_screenshots.start + ah_screenshots + label_screenshots.end : "",
            group_desc = ah_group_desc + group_screenshots + ah_info;
        ah_form_desc.value = group_desc;
    }
}
function fill_release_desc() {
    if (!ah_release_desc_lock) {
        if (ah_cure.selectedIndex == 2 && ah_form.os_type.selectedIndex == 4) {
          var release_TNT = "\n\n(TNT Pre-K'd files may not work natively on Apple Silicon)"
        } else {
          var release_TNT = "";
        }

        var release_source = ah_source.value != "" ? ah_source.value + " " : "",
            release_version = ah_last_release_date == "" ? "v" + ah_form.os_version.value : "v" + ah_form.os_version.value + ah_last_release_date,
            release_changelog = ah_changelog != "" ? label_changelog + ah_changelog : "",
            release_languages = ah_languages != "" ? label_languages + ah_languages : "",
            release_cure = (/free/i.test(ah_cure.value) || ah_cure.value == "") ? "" : label_cure.start + ah_cure.value + label_cure.end,
            release_desc = ah_instructions + release_languages + label_version + release_source + release_version + release_changelog + release_cure + release_TNT;
        ah_form.release_desc.value = release_desc;
        formatMacOSName();
    }
}
function warn_about(elem, warn) {
    var label = page_edit ? elem.previousElementSibling : elem.parentNode.previousElementSibling ;
    if (warn) {
        label.style.color = "red";
        label.style.fontWeight = "bold";
    } else {
        label.style.color = "";
        label.style.fontWeight = "";
    }
}
function fill_form(response) {
    //reset
    ah_screenshots = ""; ah_languages = ""; ah_last_release_date = ""; ah_group_desc = ""; ah_info = "";
    if (page_upload) document.getElementById("tags").value = "";


    var macupdate = response.responseText.includes("DOCTYPE") ? true : false,
        data = macupdate ? response.responseText.split("<div class=\"ui segments mu_app\">")[1].split("<aside")[0] : response.response.results[0],
        title = macupdate ? data.split("<h1 class=\"mu_app_header_title\">")[1].split("<span class=")[0] : data.trackName,
        image = macupdate ? data.split("<img src=\"")[1].split("\"")[0] : data.artworkUrl512,
        desc = macupdate ? data.split("<div class=\"mu_read_more mu_app_info_description\">")[1].split("</div>")[0] : data.description,
        devurl = macupdate ? data.includes("developer-website_btn") ? data.split("<a class=\"developer-website_btn\" href=\"")[1].split("\"")[0].replace(/\&amp;/g, "&") : "N/A" : data.sellerUrl,
        version = macupdate ? data.split("<span class=\"mu_app_header_version\">")[1].split("</span>")[0]: data.version,
        changelogs = macupdate ? data.includes("mu_app_info_release_notes") ? data.split("<div class=\"mu_read_more mu_app_info_release_notes\">")[1].split("</div>")[0].replace(/^(.*)$/m, "") : "" : data.releaseNotes,
        sysreq = macupdate ? data.split("<ul class=\"mu_app_requirements mu_app_info_requirements\">")[1].split("</ul>")[0] : "",
        os_min = macupdate ? sysreq.includes("<span") ? sysreq.split("<span>")[1].split("</span>")[0] : "" : data.minimumOsVersion,
        bit64 = macupdate ? sysreq.split("<li>")[1].split("</li>")[0] : "Intel/ARM 64-bit",
        itunesid = ah_store_id.getAttribute("itunesid"),
        screenhtml = document.createElement('html');

    screenhtml.innerHTML = macupdate ? data.includes("slider-wrapper") ? data.split("<div class=\"slider-wrapper axis-horizontal\">")[1].split("</div>")[0].replace(/https:\/\/static.macupdate.com\//g, "") : "" : "";
    var screenshots = macupdate ? screenhtml.querySelectorAll("img") : data.screenshotUrls;


    if(page_upload) ah_form.title.value = get_title(title);

    if(!page_add) {
        image = image == "https://static.macupdate.com/site/img/app/logo/default.png" ? "" : image;
        if (!ah_image_lock && image) {
            ah_form.image.value = image;
            var image_url = image,
                request = GM.xmlHttpRequest({
                    method: "POST",
                    url: "https://api.imgur.com/3/upload",
                    data: "image="+image_url+"&type=url",
                    responseType: "json",
                    headers: {
                        "Authorization": "Client-ID "+imgur_clientid,
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    onload: function(response) {
                        if (response.status == 200 && response.response.success) {
                            ah_form.image.value = response.response.data.link;
                        } else {
                            warn_about(ah_form.image, true);
                        }
                    }
                });
        }

        //group values
        ah_info = macupdate ? label_info + devurl : devurl ? label_info + "[url="+data.trackViewUrl + "]App Store[/url] / [url=" + devurl + "]Developer[/url]" : label_info + "[url="+data.trackViewUrl + "]App Store[/url]";

        ah_group_desc = get_desc(desc);

        //ah_group_screens_lock = true;
        if (!ah_group_screens_lock) {
            screenshots.forEach(function(screen, index) {
                if (index >= nb_screenshots) return;
                var screenshot_url = macupdate ? "https://static.macupdate.com/" + screen.getAttribute("src") : screen;
                var imgur_request = GM.xmlHttpRequest({
                    method: "POST",
                    url: "https://api.imgur.com/3/upload",
                    data: "image="+screenshot_url+"&type=url",
                    responseType: "json",
                    headers: {
                        "Authorization": "Client-ID "+imgur_clientid,
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    onload: function(response) {
                        if(response.status == 200 && response.response.success){
                            ah_screenshots += "[img]" + response.response.data.link + "[/img]\n";
                        } else {
                            ah_screenshots += "[url]" + screenshot_url + "[/url]\n";
                            console.log(response.responseText);
                            console.log(response);
                        }
                        fill_group_desc();
                    }
                });
            });
        } else if (page_edit) {
            if (ah_form_desc.value.includes("[hide=Screenshots]")) {
                ah_screenshots = ah_form_desc.value.split("[hide=Screenshots]")[1].split("[/hide]")[0];
            } else {
                ah_screenshots = "";
            }
            fill_group_desc();
        }

    }



    if (page_upload && !macupdate) {
        //tags
        var tags_official = [];
        for (var index = 0; index < ah_form.tags[0].options.length; index++) {
            tags_official.push(ah_form.tags[0].options[index].value);
        }
        var tags = [];
        data.genres.forEach(function(genre) {
            var tag = genre;
            tag = tag.toLowerCase();
            if (tags_official.includes(tag)) tags.push(tag);
        });
        document.getElementById("tags").value = tags.join(", ");
    }

    if (!page_edit) {
        //release values
        if (!macupdate) {
            var langs = [];
            data.languageCodesISO2A.forEach(function(lang) {
                langs.push(get_langs(lang));
            });
            ah_languages = langs.join(", ");
        }

        //fill release
        ah_form.os_minversion.value = get_os(os_min);
        ah_form.os_minprocessor.value = bit64;
        ah_form.os_version.value = version;
        ah_changelog = get_changelog(changelogs);
        ah_last_release_date = macupdate ? "" : get_date(data.currentVersionReleaseDate);
        check_length(ah_form.os_minversion, os_max_length);
        fill_release_desc();
    }

    if(macupdate && itunesid) {
        var itunes_request = GM.xmlHttpRequest({
            method: "GET",
            url: "https://itunes.apple.com/lookup?id=" + itunesid,
            responseType: "json",
            onload: function(response) {
                var data_itunes = response.response.results[0];


                var itunes_dominance = is_version_more_recent_than(data_itunes.version, version);
                var itunes_equals_macupdate = data_itunes.version.replace(/[\.a-z]/ig, "") == version.replace(/[\.a-z]/ig, "") ? true : false;

                //tags
                if (page_upload) {
                    var tags_official = [];
                    for (var index = 0; index < ah_form.tags[0].options.length; index++) {
                        tags_official.push(ah_form.tags[0].options[index].value);
                    }
                    var tags = [];
                    data_itunes.genres.forEach(function(genre) {
                        var tag = genre;
                        tag = tag.toLowerCase();
                        if (tags_official.includes(tag)) tags.push(tag);
                    });
                    document.getElementById("tags").value = tags.join(", ");
                }

                //more info
                if (!page_add) {
                    ah_info = label_info + "[url="+data_itunes.trackViewUrl + "]App Store[/url] / [url=" + devurl +"]Developer[/url]";
                }

                //languages & release date
                if (!page_edit) {
                    var langs = [];
                    data_itunes.languageCodesISO2A.forEach(function(lang) {
                        langs.push(get_langs(lang));
                    });
                    ah_languages = langs.join(", ");

                    if(itunes_equals_macupdate || itunes_dominance) {
                        ah_last_release_date = get_date(data_itunes.currentVersionReleaseDate);
                    } else {
                        ah_last_release_date = "";
                    }
                }

                if (itunes_dominance && !page_edit) {
                    ah_form.os_version.value = data_itunes.version;
                    ah_form.os_minversion.value = get_os(data_itunes.minimumOsVersion);
                    ah_changelog = get_changelog(data_itunes.releaseNotes);
                }

                //update
                if (!page_edit) fill_release_desc();
                if (!page_add) fill_group_desc();
            }
        });
    }
}
function check_length(elem, max_size) { //inputs length
    var characters = elem.value.length,
        warn = characters > max_size ? true : false;
    warn_about(elem, warn);
}

function app_helper() {
    ah_on = true;
    ah_form_desc = page_edit? ah_form.body : ah_form.desc;


    //style insertion
    var ah_style = document.createElement('style');
    ah_style.innerHTML =
        "#ah_search_results div {display:block;} " +
        "#ah_search_results div:last-child label {border:none;} " +
        "#ah_search_results label {color:black; height:30px; line-height:30px; display:block; background-color:white; padding:0 10px 0 5px; border-bottom:1px solid #dedede;} " +
        "#ah_search_results input:checked+label {background-color:#359bf5; color:white; border-color:#237bbc;} " +
        "#ah_search_results input:checked+label span {color:white; background-color:#50abef;} " +
        "#ah_search_results label:hover {background-color:#f2f2f2;} " +
        "#ah_search_results div:last-child label {border-radius:0 0 3px 3px;} " +
        "#ah_search_results input {display:none;} " +
        "#ah_search_results span {display:inline; color:black; margin-left:5px; background-color:#eeeeee; color:#000; padding:0 3px; border-radius:3px;} " +
        "#ah_search_results label:hover span {background-color:white;} " +
        "#ah_search_results label:hover svg {fill:#0d94f5;} " +
        "#ah_search_results svg {fill:#999; float:right; height:20px; width:20px; margin:5px 0 0 5px;}" +
        "#ah_search_results input:checked+label svg {fill:white;}" +
        "#ah_search_results img {float:left; height:25px; width:25px; margin:2px 5px 0 0;} ";

    //
    // Get the first script tag
    var ref = document.querySelector('script');

    // Insert our new styles before the first script tag
    ref.parentNode.insertBefore(ah_style, ref);


    //universal input
    ah_input = document.createElement("input");
    ah_input.id = "ah_input";
    ah_input.type = "text";
    ah_input.placeholder = "App title or App link";
    ah_input.size = "55";
    ah_input.autocomplete = "off";
    ah_input.oninput = function() {
        if (ah_search_results.hasChildNodes() || ah_store_id.value != "") {
            ah_search_results.innerHTML = "";
            ah_search_array = [];
            pmatchurl = [];
            ah_store_id.value = "";
            ah_store_id.removeAttribute("itunesid");
            ah_search_results.style.display = "none";
        }
    };
    ah_input.onfocus = function() {
        ah_search_forced_display = true;
        if (ah_search_results.hasChildNodes()) {
            ah_search_results.style.display = "";
        }
    }
    ah_input.onblur = function() {
        ah_onblur_delay = true;
        ah_search_forced_display = false;
        setTimeout(function(){
            if (!ah_search_forced_display) { ah_search_results.style.display = "none"; }
            ah_onblur_delay = false;
        }, 50);
    };
    ah_input.onkeydown = function(e) {
        var char = e.which || e.keyCode;
        if (char == 13 ) { //enter key
            ah_button.click();
            return false;
        }
    };

    //universal button
    ah_button = document.createElement("input");
    ah_button.type = "button";
    ah_button.id = "ah_button";
    ah_button.value = ah_button_label;
    ah_button.onclick = function() {
        if (ah_store_id.value == "") get_appid(ah_input.value); //pre-check
        if (ah_store_id.value != "") {
            if (ah_store_id.value == "0") {
                var itunesid = ah_store_id.getAttribute("itunesid"),
                    itunes_request = GM.xmlHttpRequest({
                        method: "GET",
                        url: "https://itunes.apple.com/lookup?id=" + itunesid,
                        responseType: "json",
                        onload: fill_form
                    });
            } else {
                var appid = ah_store_id.value,
                    mu_request = GM.xmlHttpRequest({
                    method: "GET",
                    url: "https://www.macupdate.com/app/mac/" + appid,
                    responseType: "document",
                    onload: fill_form
                });
            }
        } else if (ah_input.value != "") {
            if (ah_search_loaded == 0) {
                if (ah_onblur_delay) ah_search_forced_display = true; //quickfix
                ah_search_loaded = 1;
                var query = encodeURI(ah_input.value),
                    search_itunes_request = GM.xmlHttpRequest({
                        method: "GET",
                        url: "https://itunes.apple.com/search?term=" + query + "&media=software&entity=macSoftware&limit=10",
                        responseType: "json",
                        onload: fill_search
                    });//,
                    //search_mu_request = GM.xmlHttpRequest({
                    //    method: "GET",
                    //    url: "https://www.macupdate.com/find/mac/context%3D" + query,
                    //    responseType: "document",
                    //    onload: fill_search
                    //});
            }
        }
    }

    //search results
    ah_search_results = document.createElement("div"); //select
    ah_search_results.id = "ah_search_results";
    ah_search_results.style = "position:absolute; z-index:1; top:100%; left:0; width:100%; display:none; height:200px; overflow:auto; border-radius:0 0 3px 3px; ";


    //exiting search
    document.body.onclick = function() {
        if(!ah_search_forced_display && !ah_onblur_delay && ah_search_results.style.display == "") {
            ah_search_results.style.display = "none";
        }
    }

    //hidden appid value
    ah_store_id = document.createElement("input");
    ah_store_id.type = "hidden";

    //container
    var ah_input_container = document.createElement("span");
    ah_input_container.id = "ah_input_container";
    ah_input_container.style = "position:relative; display:inline-block;";
    ah_input_container.appendChild(ah_input);
    ah_input_container.appendChild(ah_search_results);
    ah_input_container.appendChild(ah_store_id);

    //external css fix
    var external_css = document.querySelector("link[title='External CSS']");
    if(external_css) {
        if (external_css.getAttribute("href").includes("brokenstones.bolditalic.org")) { //seaglass family
            ah_input_container.style.display = "block";
            var bgcolor = window.getComputedStyle(document.querySelector("select option"), null).getPropertyValue("background-color");
            if (bgcolor != "rgba(0, 0, 0, 0)") {
                ah_search_results.style.backgroundColor = bgcolor;
            }
        }
    }

    //form
    if (page_edit) {

        //container
        var span = document.createElement("span");

        var h3 = document.createElement("h3");
        text = document.createTextNode("App info:");
        h3.appendChild(text);

        span.appendChild(h3);
        span.appendChild(ah_input_container);
        span.appendChild(ah_button);

        var br = document.createElement("br");
        span.appendChild(br);

        //tick box image
        var ah_update_image = document.createElement("input");
        ah_update_image.type = "checkbox";
        ah_update_image.id = "ah_update_image";
        ah_update_image.value = ah_button_label;
        ah_update_image.checked = !ah_image_lock;
        ah_update_image.onchange = function(){ ah_image_lock = !this.checked; };
        span.appendChild(ah_update_image);
        var label = document.createElement("label");
        label.setAttribute("for", "ah_update_image");
        text = document.createTextNode(" Image ");
        label.appendChild(text);
        span.appendChild(label);

        //tick box desc
        var ah_update_desc = document.createElement("input");
        ah_update_desc.type = "checkbox";
        ah_update_desc.id = "ah_update_desc";
        ah_update_desc.value = ah_button_label;
        ah_update_desc.checked = true;
        ah_update_desc.onchange = function(){ ah_group_desc_lock = !this.checked; };
        span.appendChild(ah_update_desc);
        label = document.createElement("label");
        label.setAttribute("for", "ah_update_desc");
        text = document.createTextNode(" Description ");
        label.appendChild(text);
        span.appendChild(label);

        //tick box screens
        var ah_update_screens = document.createElement("input");
        ah_update_screens.type = "checkbox";
        ah_update_screens.id = "ah_update_screens";
        ah_update_screens.checked = !ah_group_screens_lock;
        ah_update_screens.onchange = function(){ ah_group_screens_lock = !this.checked; };
        span.appendChild(ah_update_screens);
        label = document.createElement("label");
        label.setAttribute("for", "ah_update_screens");
        text = document.createTextNode(" Screenshots");
        label.appendChild(text);
        span.appendChild(label);

        ah_form.image.parentNode.prepend(span);

    } else {
        ah_includes = ah_form.os_includes;

        if (ah_form.release_desc.value != "") {ah_release_desc_lock = true; ah_version_lock = true;} //if upload form returned an error

        //DRM-Free option
        ah_includes.add(new Option("DRM-Free", "DRM-Free"), undefined);

        var tr = document.createElement("tr");
        tr.id = "app_helper";

        var td = document.createElement("td");
        td.className = "label";
        var text = document.createTextNode("App info:");
        td.appendChild(text);
        tr.appendChild(td);

        td = document.createElement("td");
        td.colspan = "3";

        td.appendChild(ah_input_container);
        td.appendChild(ah_button);
        tr.appendChild(td);

        var categories = document.getElementById("categories").parentNode.parentNode;
        categories.parentNode.insertBefore(tr, categories.nextElementSibling);

        //source field
        tr = document.createElement("tr");
        td = document.createElement("td");
        td.className = "label";
        text = document.createTextNode("Store (optional):");
        td.appendChild(text);
        tr.appendChild(td);
        td = document.createElement("td");

        ah_source = document.createElement("select");
        ah_source.add(new Option("---", ""), undefined);
        list_stores.forEach(function(store) { ah_source.add(new Option(store, store), undefined); });
        ah_source.onchange = function(){
            fill_release_desc();
        };
        ah_form.os_type.onchange = function(){
            fill_release_desc();
        };
        td.appendChild(ah_source);
        tr.appendChild(td);

        //crack field
        td = document.createElement("td");
        td.className = "label";
        text = document.createTextNode("Courtesy of (optional):");
        td.appendChild(text);
        tr.appendChild(td);
        td = document.createElement("td");
        ah_cure = document.createElement("select");
        ah_cure.add(new Option("---", ""), undefined);
        list_cures.forEach(function(cure) { ah_cure.add(new Option(cure, cure), undefined); });
        ah_cure.onchange = function(){
            fill_release_desc();
        };
        td.appendChild(ah_cure);
        tr.appendChild(td);

        var tr_container = ah_includes.parentNode.parentNode;
        tr_container.parentNode.insertBefore(tr, tr_container.nextElementSibling);

        //default release values
        ah_form.type.selectedIndex = 0;
        ah_form.os_type.selectedIndex = 2;
        ah_includes.selectedIndex = 1;

        //instructions detection
        ah_form.file.onchange = function() { fill_instructions(this.value); };

        //input checks
        ah_form.os_version.oninput = function() {
            ah_version_lock = this.value != "" ? true : false;
            check_length(this, version_max_length);
            fill_release_desc();
        };
        ah_form.os_minram.oninput = function() { check_length(this, ram_max_length); };
        ah_form.os_minvideoram.oninput = function() { check_length(this, vram_max_length); };
        ah_form.os_minversion.oninput = function() { check_length(this, os_max_length) };
        ah_form.os_minprocessor.oninput = function() { check_length(this, cpu_max_length) };
        ah_form.image.onchange = function() { ah_image_lock = this.value != "" ? true : false; }
        ah_form.release_desc.onchange = function() {
            if (this.value != "") {
                ah_release_desc_lock = true;
                ah_cure.disabled = true;
                ah_source.disabled = true;
                ah_cure.selectedIndex = 0;
                ah_source.selectedIndex = 0;
            } else {
                ah_release_desc_lock = false;
                ah_cure.disabled = false;
                ah_source.disabled = false;
            }
        };
    }

    //autofill
    if (!page_upload) get_appid(ah_form_desc.value);
    if (page_add && ah_store_id.value != "" && !ah_release_desc_lock) ah_button.click();
    if (page_add && ah_store_id.value == "" && !ah_release_desc_lock) { ah_input.value = ah_form.title.value; ah_button.click(); }
    if (page_edit) { ah_input.value = document.torrent_group[2].name.value }
}
(function() {
    'use strict';
    var macos_apps = 0;
    if (ah_form_categories.selectedIndex == macos_apps) app_helper();
    if (page_upload) {
        //manage category change
        var categories_onchange = ah_form_categories.getAttribute("onchange");
        $(ah_form_categories).change(function() { //jquery helps to chain up onchange handlers
            var input = document.createElement("input");
            input.type = "hidden";
            input.id = "ah_hidden_key";
            var dynamic_form = document.getElementById("dynamic_form");
            dynamic_form.appendChild(input); //hide a key to check loading
            eval(categories_onchange);
            var safety = 0, //for polar bears' sake
                loading = setInterval(function(){
                    if(!dynamic_form.contains(input)) {
                        if (ah_on) { document.getElementById("app_helper").remove(); ah_on = false; }
                        else if (ah_form_categories.selectedIndex == macos_apps) { app_helper(); }
                        clearInterval(loading);
                    }
                    if (safety > 30) clearInterval(loading); //kill loading >9000 ms
                    safety ++;
                }, 300);
        });
    }
})();
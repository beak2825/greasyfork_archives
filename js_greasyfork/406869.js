// ==UserScript==
// @name         BrokenStones - Upload Game Helper
// @namespace    https://brokenstones.club/
// @version      0.8.4
// @description  Set of tools to ease games upload on BrokenStones
// @author       whatever
// @match        https://brokenstones.club/upload.php*
// @match        https://brokenstones.club/torrents.php?action=editgroup*
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/406869/BrokenStones%20-%20Upload%20Game%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/406869/BrokenStones%20-%20Upload%20Game%20Helper.meta.js
// ==/UserScript==


///TODO:
//description regex improvement
//add img uploader
//add gog search
//64-bit detection
//add additionnal notes

//config (default)
var force_enabled = false, //set MacOS Games by default (false)
    early_access_warning = true, //uploading rule 1.2.5 warning (true)
    imgur_clientid = ""; //facultative imgur api key ("")

//default values
var label_screenshots = {start:"\n\n[hide=Screenshots]", end:"[/hide]"},
    label_info = "\n\n[b]More information[/b]: ",
    label_instructions_zip = "1) Unpack\n2) Move to Applications\n3) Play!\n",
    label_instructions_pkg = "1) Install\n2) Play!\n",
    label_instructions_dmg = "1) Mount\n2) Drag & Play!\n",
    label_dlc = {few:"\n[b]Including DLC[/b]: ", many_start:"\n[hide=Including DLC]", many_end:"[/hide]"},
    label_languages = "\n[b]Languages[/b]: ",
    label_version = "\n[b]Version[/b]: ",
    label_cure = "\n[b]Cure[/b]: ",
    label_earlyaccess = "\n\n[color=blue]Approved by staff as early access[/color]",
    label_button = {edit:"Update", upload:"Load"},
    nb_screenshots = 5;


//site vars
var page_add = window.location.href.includes("upload.php?groupid=")? true : false,
    page_edit = window.location.href.includes("torrents.php?action=editgroup")? true : false,
    gh_form = document.forms.torrent,
    version_max_length = 30,
    cpu_max_length = 20,
    os_max_length = 20,
    ram_max_length = 20,
    vram_max_length = 20;

//save slots
var gh_screenshots, gh_info, gh_group_desc, gh_earlyaccess,
    gh_button_label = label_button.upload,
    gh_version_lock = false,
    gh_image_lock = false,
    gh_release_desc_lock = false,
    gh_group_desc_lock = false,
    gh_dlc_nb = 0,
    gh_dlc = "",
    gh_languages = "",
    gh_instructions = label_instructions_zip; //default value

//regexes
function get_desc(str) {
    if (!str) return "";
    str = str.replace(/(©|™|®)/g, "");
    str = str.replace(/\r/g,"");
    str = str.replace(/\t/g,"");
    str = str.replace(/< *(\/|) *(b|strong) *>/g, "[$1b]");
    str = str.replace(/< *(\/|) *u *>/g, "[$1u]");
    str = str.replace(/< *(\/|) *(i|em) *>/g, "[$1i]");
    str = str.replace(/< *br *\/*>/g, "\n");
    str = str.replace(/< *li *>(\s*|\t*)/g, "[*]");
    str = str.replace(/\n *(-|\*) */g, "\n[*]");
    str = str.replace(/< *\/ *li *>/g, "");
    str = str.replace(/< *ul *class=\\*\"bb_ul\\*\" *>/g, "");
    str = str.replace(/< *\/ *ul *>/g, "");
    str = str.replace(/< *h2 *class=\"bb_tag\" *>/g, "\n[b]");
    str = str.replace(/< *h[12] *>/g, "\n[b]");
    str = str.replace(/< *\/ *h[12] *>/g, "[/b]\n");
    str = str.replace(/\&quot;/g, "\"");
    str = str.replace(/\n+\s*\t*•\s*\t*/g, "\n[*]");
    str = str.replace(/\&amp;/g, "&");
    str = str.replace(/< *img *src=\".*\".*>/g, "");
    str = str.replace(/< *a [^>]*>/g, "");
    str = str.replace(/< *\/ *a *>/g, "");
    str = str.replace(/< *p *>/g, "\n\n");
    str = str.replace(/< *\/ *p *>/g, "");
    str = str.replace(//g, "\"");
    str = str.replace(//g, "\"");
    str = str.replace(/  +/g, " ");
    str = str.replace(/ *\n */g, "\n");
    str = str.replace(/\[b\]\n*(\[b\]\n*)+/g, "[b]");
    str = str.replace(/ *\[\/b\](\n)*(\[\/b\]\n*)+/g, "[/b]$1");
    str = str.replace(/\[b\]\[\/b\]/g, "");
    str = str.replace(/\n +/g, "\n");
    str = str.replace(/\n\n\n+/g, "\n\n");
    str = str.replace(/\n\n+\[\*\]/g, "\n[*]");
    var regFeatures = /\n+ *(\[(b|u|i)\])* *(Key Features|Main Features|Game Features|KEY GAME FEATURES|Other Features|Features of the Game|FEATURE OVERVIEW|Features|Featuring|Feautures) *:* *(\n*\[\/(b|u|i)\])* *:* */i;
    str = str.replace(regFeatures, "\n\n[b]Features[/b]:\n");
    if (!regFeatures.test(str)) {
        var regFeaturesList = /(\n\[\*\].*){3,20}/g;
        var featuresList = str.match(regFeaturesList);
        var lastLine = regFeaturesList.exec(featuresList);
        str = str.replace(featuresList, "\n\n[b]Features[/b]:"+featuresList);
    }

    str = str.replace(/^\n+/, "");
    str = str.replace(/\n+$/, "");
    str = str.replace(/\n\n\n+/g, "\n\n");
    return str;
}
function get_sysreq_raw(reg, str) {
    if (!str) return "N/A";
    reg = new RegExp(" *("+reg+") *(:|) *<\/strong> *(.*?) *<br>","i");
    if (str.match(reg)) return str.match(reg)[3];
    return "N/A";
}
function get_sysreq(field, str) {
    if (str == "N/A") return "N/A";
    str = str.replace(/©|™|®|\(|\)|\:|\/|\@/g, ""); //undesired
    str = str.replace(/ (or|and|of) /g, "");
    str = str.replace(/(better|above|beyond|superior|later|onwards|newer|higher|faster|greater|equivalent)/ig, "+");
    str = str.replace(/Pentium/ig, "");
    str = str.replace(/CPU Speed/ig, "");
    str = str.replace(/Processor/ig, "");
    str = str.replace(/CPU/ig, "");
    str = str.replace(/V*RAM/ig, "");
    str = str.replace(/Intel/ig,"");
    str = str.replace(/AMD/ig, "");
    str = str.replace(/Minimum/ig, "");
    str = str.replace(/DDR3/ig, "");
    if(field == "VRAM") {
        str = str.replace(/video/ig, "");
        str = str.replace(/card/ig, "");
        str = str.replace(/memory/ig, "");
        str = str.replace(/graphics/ig, "");
        str = str.replace(/compatible/ig, "");
        str = str.replace(/dedicated/ig, "");
        str = str.replace(/compliant/ig, "");
        str = str.replace(/plus/ig, "");
        str = str.replace(/required/ig, "");
        str = str.replace(/class/ig, "");
        str = str.replace(/series/ig, "");
        str = str.replace(/Radeon \d{3,5}/ig,"");
        str = str.replace(/Radeon/ig,"");
        str = str.replace(/Nvidia/ig,"");
        str = str.replace(/Geforce *\d+M*/ig,"");
        str = str.replace(/Geforce/ig,"");
        str = str.replace(/ATI/g,"");
        str = str.replace(/ Pro/ig,"");
        str = str.replace(/GPU/ig,"");
        str = str.replace(/With/ig,"");
        str = str.replace(/GTX*S* *\d+(MX|M|ti)*/ig,"");
        str = str.replace(/Iris *\d{3,5}/ig,"");
        str = str.replace(/Iris/ig,"");
        str = str.replace(/HD *\d{4}M*/ig,"");
        str = str.replace(/RX*\d+ *M*\d{2,5}X*/ig,"");
        str = str.replace(/RX*\d+ *M*X*/ig,"");
        str = str.replace(/\d+MX*(,| )+/ig,"");
        str = str.replace(/M\d+/ig,"");
        str = str.replace(/\+/g,"");
        str = str.replace(/\-/g,"");
        str = str.replace(/\|/g,"");
        str = str.replace(/see notes for more details/i, "");
    }

    //because i've been told OSX versions are preferable than OS names
    if (field == "OS") {
        str = str.includes("10.4")? str.replace(/tiger/i, "") : str.replace(/tiger/i, "10.4");
        str = str.includes("10.6")? str.replace(/snow leopard/i, "") : str.replace(/snow leopard/i, "10.6");
        str = str.includes("10.5")? str.replace(/leopard/i, "") : str.replace(/leopard/i, "10.5");
        str = str.includes("10.8")? str.replace(/mountain lion/i, "") : str.replace(/mountain lion/i, "10.8");
        str = str.includes("10.7")? str.replace(/lion/i, "") : str.replace(/lion/i, "10.7");
        str = str.includes("10.9")? str.replace(/mavericks/i, "") : str.replace(/mavericks/i, "10.9");
        str = str.includes("10.10")? str.replace(/yosemite/i, "") : str.replace(/yosemite/i, "10.10");
        str = str.includes("10.11")? str.replace(/el capitan/i, "") : str.replace(/el capitan/i, "10.11");
        str = str.includes("10.13")? str.replace(/high sierra/i, "") : str.replace(/high sierra/i, "10.13");
        str = str.includes("10.12")? str.replace(/sierra/i, "") : str.replace(/sierra/i, "10.12");
        str = str.includes("10.14")? str.replace(/mojave/i, "") : str.replace(/mojave/i, "10.14");
        str = str.includes("10.15")? str.replace(/catalina/i, "") : str.replace(/catalina/i, "10.15");
        str = str.replace(/mac/ig, "");
        str = str.replace(/version/ig, "");
        str = str.replace(/os/ig, "");
        str = str.replace(/x/ig, "");
    }
    str = str.replace(/ +,/g, ",");
    str = str.replace(/,+/g, ",");
    str = str.replace(/ +/g, " ");
    str = str.replace(/^ +/, "");
    str = str.replace(/^,+/, "");
    str = str.replace(/^ +/, "");
    str = str.replace(/ +$/, "");
    str = str.replace(/\.+$/, "");
    str = str.replace(/,+$/, "");
    str = str.replace(/ +$/, "");
    return str;
}
function get_langs(str) {
    str = str.replace(/ *<br> */g, "");
    str = str.replace(/ *languages with full audio support */, "");
    str = str.replace(/ *<strong> *\* *<\/strong> */g, "");
    str = str.replace(/ *- *(Spain|Brazil|Latin America)/g, "")
    var reg = str.match(/Spanish/g);
    if (reg) if (reg.length == 2) str = str.replace(/(, Spanish|Spanish ,)/, "");
    reg = str.match(/Portuguese/g);
    if (reg) if (reg.length == 2) str = str.replace(/(, Portuguese|Portuguese ,)/, "");
    return str;
}
function get_appid(str) { //TODO: proper fix
    var reg = str.match(/\/app\/(\d+)/i);
    str = reg? reg[1] : str;
    str = str.replace(/^\s*(\d+)\s*$/, "$1");
    str = str.length > 200 ? "" : str; //quick fix
    return str;
}
function get_title(str) { //TODO: recapitalization
    str = str.replace(/(©|™|®)/g, "");
    str = str.replace(/’/g,"'");
    return str;
}
function get_dlc(str, title) {
    str = str.replace(/(©|™|®)/g, "");
    str = str.replace(/’/g,"'");
    str = str.replace(/DLC/i, "");
    var reg_dlc = new RegExp(" *"+title+" *(:|-)* *","i");
    str = str.replace(reg_dlc, "");
    str = str.replace(/ *- */g, " ");
    str = str.replace(/ +/g, " ");
    str = str.replace(/^ /, "");
    str = str.replace(/ $/, "");
    return str;
}

//data handlers
function fill_version(str) {
    if (!gh_version_lock) {
        var original = str;
        //if label_instructions
        gh_instructions = str.includes(".pkg.torrent") ? label_instructions_pkg : str.includes(".dmg.torrent") ? label_instructions_dmg : label_instructions_zip;
        str = str.replace(/.*_enUS_(.*)_(\d+)\.pkg\.torrent$/i, "$1 ($2)");
        str = str.replace(/.*_enUS_(.*)_(\d+)\.torrent$/i, "$1 ($2)");
        str = str.replace(/.*_(.*)_\((\d+)\)_mac_gog(|\-2).torrent/i, "$1 ($2)");
        if (str != original) {
            str = str.replace(/_/g, ".");
            makeitgog();
        }
        str = str.replace(/.*\.v(.*?)(|\.Incl\.DLC)(|\.MacOSX).(zip|dmg)\.torrent$/i, "$1");
        str = (str == original)? "": str;
        if (gh_earlyaccess) {
            var t = str
            str = str.replace(/\(.*\)/, "(early access)")
            if (t == str) {
                str = str + " (early access)";
            }
        }
        $("#os_version").val(str);
        fill_release_desc();
    }
}
function fill_search(response) {
    var search_dom = document.createElement('html');
    search_dom.innerHTML = response.responseText;
    var results = "";
    $(search_dom).find("span.title").each(function( index ) {
        if (index > 9) return false; //limit results
        var a = $(this).parent().closest("a");
        var type = a.attr("data-ds-itemkey");
        if (type.includes("App")) {
            var title = get_title($(this).text());
            var id = a.attr("data-ds-appid");
            var selected = "";
            if (title.toLowerCase() == $("#gh_steam_input").val().toLowerCase()) { //perfect match
                $("#gh_steam_input").val(id);
                $("#gh_steam_button").click();
                selected = " selected";
            }
            title = title.length > 50 ? title.substr(0, 50) + "..." : title;
            results = results + "<option value='" + id + "'" + selected + ">" + title + "</option>";
        }
    });
    if (results != "") {
        $("#gh_steam_search_results").remove();
        $("#gh_steam_button").after(" <select id='gh_steam_search_results'>"+results+"</select>");
        $("#gh_steam_search_results").change(function() {
            $("#gh_steam_input").val($(this).val());
        });
        $("#gh_steam_button").attr("value", gh_button_label);
    } else {
        $("#gh_steam_search_results").remove();
        $("#gh_steam_button").after(" <span id='gh_steam_search_results'>Nothing found</span>");
    }
}
function fill_group_desc(desc_field) {
    if (!gh_group_desc_lock) {
        var group_desc = gh_group_desc + label_screenshots.start + gh_screenshots + label_screenshots.end + gh_info;
        $(desc_field).val(group_desc);
        $(desc_field).val($(desc_field).val());
    }
}
function fill_release_desc() {
    if (!gh_release_desc_lock) {
        var release_source = $("#source").val() != "" ? $("#source").val() + " " : "",
            release_cure = $("#cure").val() != "" ? $("#cure").val() + " " : "",
            release_version = "v" + $("#os_version").val(),
            release_dlc = gh_dlc_nb == 0 ? "" : gh_dlc_nb < 10 ? label_dlc.few + gh_dlc : label_dlc.many_start + gh_dlc + label_dlc.many_end,
            release_desc = gh_instructions + release_dlc + label_languages + gh_languages + label_version + release_source;

        release_desc = ($("#cure").val().includes("DRM Free") || $("#cure").val() == "") ? release_desc + release_cure + release_version: release_desc + release_version + label_cure + release_cure;
        release_desc = gh_earlyaccess ? release_desc + label_earlyaccess : release_desc;
        gh_form.release_desc.value = release_desc;
        formatMacOSName();
    }
}
function fill_form(response) {
    var appid = $("#gh_steam_input").val();
    var steamJSon = response.response[appid].data;
    gh_earlyaccess = false;

    if(!page_add) {
        var image_field = gh_form.image;
        var desc_field = page_edit? gh_form.body : gh_form.desc;

        //group values
        var title = get_title(steamJSon.name);

        var desc = steamJSon.about_the_game === ""? get_desc(steamJSon.detailed_description) : get_desc(steamJSon.about_the_game);
        gh_group_desc = desc;

        gh_info = label_info + "https://store.steampowered.com/app/"+ appid;

        if (!gh_image_lock) {
            var image = steamJSon.header_image.split("?")[0];
            $(image_field).val(image);
            var image_portrait = "https://steamcdn-a.akamaihd.net/steam/apps/" + appid + "/library_600x900_2x.jpg";
            var request_image = new GM.xmlHttpRequest({
                method: "GET",
                url: image_portrait,
                responseType: "json",
                onload: function(response) {
                    if(response.status == 200){
                        $(image_field).val(image_portrait);
                    }
                    var request = GM.xmlHttpRequest({
                        method: "POST",
                        url: "https://api.imgur.com/3/upload",
                        data: "image="+$(image_field).val()+"&type=url",
                        responseType: "json",
                        headers: {
                            "Authorization": "Client-ID "+imgur_clientid,
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        onload: function(response) {
                            if(response.status == 200 && response.response["success"]){
                                $(image_field).val(response.response["data"].link);
                            }
                        }
                    });
                }
            });
        }
        if(!page_edit) {
            var tags_official = [];
            $("#genre_tags option").each(function(){
                tags_official.push($(this).val());
            });
            var tags = [];

            steamJSon.genres.forEach(function (genre) {
                var tag = genre.description.toLowerCase().replace(/RPG/i, "roleplaying");
                if (tag == "early access") gh_earlyaccess = true;
                if (tags_official.includes(tag)) tags.push(tag);
            });
            $("#tags").val(tags.join(", "));
        }

        gh_screenshots = ""; //clean
        steamJSon.screenshots.forEach(function(screen, index) {
            if (index >= nb_screenshots) return;
            var screenshot_url = screen.path_full.split("?")[0];
            var request = GM.xmlHttpRequest({
                method: "POST",
                url: "https://api.imgur.com/3/upload",
                data: "image="+screenshot_url+"&type=url",
                responseType: "json",
                headers: {
                    "Authorization": "Client-ID "+imgur_clientid,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                onload: function(response) {
                    if(response.status == 200 && response.response["success"]){
                        gh_screenshots += "[img]" + response.response["data"].link + "[/img]\n";
                    } else {
                        gh_screenshots += "[url]" + screenshot_url + "[/url]\n";
                        console.log(response.responseText);
                        console.log(response);
                    }
                    fill_group_desc(desc_field);
                }
            });
        });

        //fill group
        $("#title").val(title);
        fill_group_desc(desc_field);
    }
    if (page_add) {
        steamJSon.genres.forEach(function (genre) {
            var tag = genre.description.toLowerCase();
            if (tag == "early access") gh_earlyaccess = true;
        });
    }
    if (!page_edit) {
        //release values
        var sysreq = steamJSon.mac_requirements.minimum,
            vram_min_raw = get_sysreq_raw("Graphics|VRAM|Video Memory|Video Card", sysreq),
            cpu_min_raw = get_sysreq_raw("CPU Type|CPU Processor|CPU|Processor", sysreq),
            ram_min_raw = get_sysreq_raw("System RAM|RAM|System Memory|Memory", sysreq),
            os_min_raw = get_sysreq_raw("Supported OS|OS|Operating Systems|Operating System|Mac OS|System|Mac", sysreq),
            os_min = get_sysreq("OS", os_min_raw),
            cpu_min = get_sysreq("CPU", cpu_min_raw),
            ram_min = get_sysreq("RAM", ram_min_raw),
            vram_min = get_sysreq("VRAM", vram_min_raw);

        gh_languages = get_langs(steamJSon.supported_languages);

        //dlc
        gh_dlc = "";
        gh_dlc_nb = steamJSon.dlc == undefined ? 0 : steamJSon.dlc.length;
        if (gh_dlc_nb > 0) {
            steamJSon.dlc.forEach(function (dlc) {
                var request = new GM.xmlHttpRequest({
                    method: "GET",
                    url: "http://store.steampowered.com/api/appdetails?l=en&appids=" + dlc,
                    responseType: "json",
                    onload: function(response) {
                        var dlc_name = get_dlc(response.response[dlc].data.name, get_title(steamJSon.name));
                        if (!dlc_name.includes("Soundtrack") && !dlc_name.includes("Artbook") && !dlc_name.includes("Season Pass")) {
                            gh_dlc = gh_dlc_nb < 10 ? gh_dlc == "" ? dlc_name : gh_dlc + ", " + dlc_name : gh_dlc + "[*]" + dlc_name + "\n";
                        } else {
                            gh_dlc_nb = gh_dlc_nb - 1;
                        }
                        fill_release_desc();
                    }
                });
            });
        }

        //fill release
        gh_form.os_minversion.value = os_min;
        gh_form.os_minversion.title = os_min_raw;
        check_length(gh_form.os_minversion, os_max_length);
        gh_form.os_minprocessor.value = cpu_min;
        gh_form.os_minprocessor.title = cpu_min_raw;
        check_length(gh_form.os_minprocessor, cpu_max_length);
        gh_form.os_minram.value = ram_min;
        gh_form.os_minram.title = ram_min_raw;
        check_length(gh_form.os_minram, ram_max_length);
        gh_form.os_minvideoram.value = vram_min;
        gh_form.os_minvideoram.title = vram_min_raw;
        check_length(gh_form.os_minvideoram, vram_max_length);
        fill_release_desc();
    }
    if (gh_earlyaccess && early_access_warning) {
        window.alert("Uploading Rule #1.2.5\n\nPre-Release content including Alpha, Beta, Preview and Apple Developer releases are not allowed. Except for rare cases at the discretion of the Staff. You need to request approval via the Staff Inbox prior to uploading, not doing so will result in loss of uploading rights.");
    }
}

function makeitgog() { //recurrent
    gh_form.cure.selectedIndex = 1;
    gh_form.os_includes.selectedIndex = 5;
    gh_form.source.selectedIndex = 2;
    gh_instructions = gh_instructions == label_instructions_zip || gh_instructions == "" ? label_instructions_pkg : gh_instructions;
    fill_release_desc();
}

function check_length(elem, max_size) { //inputs length
    var characters = $(elem).val().length,
        label = $(elem).parent().prev();
    if (characters > max_size) {
        label.css("color","red").css("font-weight","bold");
    } else {
        label.css("color","").css("font-weight","");
    }
}

function game_helper() {
    if (page_edit) {
        gh_form = document.forms.torrent_group
        gh_button_label = label_button.edit;
    }

    //if form returned error doesn't erase values
    if (!page_edit) if (gh_form.release_desc.value != "") {gh_release_desc_lock = true; gh_version_lock=true;}

    //GOG option
    $("select#os_includes").append("<option value='GOG'>GOG</option>");

    //extra fields
    $("select#os_includes").parent().parent().after('<tr><td class="store">Store:</td><td><select id="source" name="source"><option value="">---</option><option value="Steam">Steam</option><option value="GOG">GOG</option><option value="MAS">Mac App Store</option><option value="Humble Bundle">Humble Bundle</option><option value="Itch.io">Itch.io</option><option value="EGS">Epic Games Store</option><option value="Official Website">Official Website</option></select></td><td class="label">Treatment:</td><td><select id="cure" name="cure"><option value="">---</option><option value="DRM Free">DRM Free</option><option value="ACTiVATED">ACTiVATED</option><option value="SKiDROW">SKiDROW</option><option value="Nemirtingas Steam Emu">Nemirtingas Steam Emu</option></select></td></tr>')

    //default release values
    if (!page_edit) {
        gh_form.type.selectedIndex = 1;
        gh_form.os_type.selectedIndex = 2;
        gh_form.os_includes.selectedIndex = 1;
    }

    //form
    if (page_edit) {
        $("input[name='image']").parent().prepend("<h3>Steam:</h3><input id='gh_steam_input' placeholder='Game title or Steam store page'/><br><input type='checkbox' id='gh_update_image' checked/> <label>Image</label> <input type='checkbox' id='gh_update_desc' checked/> <label>Description</label><br/>");
    } else {
        $("#categories").parent().parent().after("<tr id='game_helper'><td class='label'>Steam info:</td><td><input id='gh_steam_input' type='text' placeholder='Game title or Steam link' /></td></tr>");
    }

    //button
    $("#gh_steam_input").after(" <input type='button' id='gh_steam_button' value='"+gh_button_label+"'/>");
    $("#gh_steam_button").click(function() {
        $("#gh_steam_input").val(get_appid($("#gh_steam_input").val()));
        var appid = $("#gh_steam_input").val();
        appid = encodeURI(appid);
        if (!isNaN(appid)) {
            var request = new GM.xmlHttpRequest({
                method: "GET",
                url: "http://store.steampowered.com/api/appdetails?l=en&appids=" + appid,
                responseType: "json",
                onload: fill_form
            });
        } else {
            if ($("select#gh_steam_search_results").length==0) {
                appid = appid.replace(" ", "+");
                var searchrequest = new GM.xmlHttpRequest({
                    method: "GET",
                    url: "https://store.steampowered.com/search/?term=" + appid + "&category1=998",
                    responseType: "document",
                    onload: fill_search
                });
            } else {
                $("#gh_steam_input").val($("#gh_steam_search_results").val());
                $("#gh_steam_search_results").remove();
                $("#gh_steam_button").click();
            }
        }
    });

    //qol
    $("#gh_steam_input").on("input", function(e) {
        $("#gh_steam_search_results").remove();
        var appid = $("#gh_steam_input").val();
        if (!isNaN(appid)) {
            $("#gh_steam_button").attr("value", gh_button_label);
        } else {
            $("#gh_steam_button").attr("value", "Search");
        }
    });
    $("#gh_steam_input").on("keydown", function(e) {
        if (e.which == 13) { //enter key
            $("#gh_steam_button").click();
            return false;
        }
    });

    if (!page_edit) {
        //version detection
        $("#file").change(function() {fill_version($("#file").val());});

        //input checks
        $("#os_version").on("input", function() {
            gh_version_lock = $(this).val() != ""? true : false;
            check_length(this, version_max_length);
            fill_release_desc();
        });
        $("#os_minprocessor").on("input", function() {check_length(this, cpu_max_length)});
        $("#os_minversion").on("input", function() {check_length(this, os_max_length)});
        $("#os_minram").on("input", function() {check_length(this, ram_max_length)});
        $("#os_minvideoram").on("input", function() {check_length(this, vram_max_length)});
        $("#image").change(function() {gh_image_lock = $("#image").val() != ""? true : false;})

        //presets
        $(gh_form.release_desc).change(function() {
            gh_release_desc_lock = true;
            $("select#source").attr("disabled", "true");
            $("select#cure").attr("disabled", "true");
            gh_form.cure.selectedIndex = 0;
            gh_form.source.selectedIndex = 0;
        })
        $("select#os_includes").change(function() {
            if (gh_form.os_includes.selectedIndex == 5) {
                makeitgog();
            } else {
                fill_release_desc();
            }
        });
        $("select#source").change(function() {
            var source = $("select#source").val();
            if (source == "GOG") {
                makeitgog();
            } else {
                gh_form.os_includes.selectedIndex = 1;
                if (source == "Itch.io" || source == "EGS" || source == "Humble Bundle") gh_form.cure.selectedIndex = 1;
                fill_release_desc();
            }
        });
        $("select#cure").change(function() {
            var cure = $("select#cure").val()
            if (cure == "ACTiVATED" || cure == "Nemirtingas Steam Emu" || cure == "SKiDROW") {
                gh_form.source.selectedIndex = 1;
                gh_form.os_includes.selectedIndex = 1;
            }
            fill_release_desc();
        });
    } else {
        $("input#gh_update_image").change(function() {
            gh_image_lock = !$(this).prop("checked");
        });
        $("input#gh_update_desc").change(function() {
            gh_group_desc_lock = !$(this).prop("checked");
        });
    }

    //autofill
    if (page_add) $("#gh_steam_input").val(get_appid(gh_form.desc.value));
    if (page_edit) $("#gh_steam_input").val(get_appid(gh_form.body.value));

    //autoload
    if (page_add && $("#gh_steam_input").val() != "" && !gh_release_desc_lock) $("#gh_steam_button").click();

}
(function() {
    'use strict';
    var type_field = $("#categories")[0];
    var macos_games = 1;

    if(page_edit) {
        type_field = $("#newcategoryid")[0];
        if (type_field.selectedIndex == macos_games || force_enabled) game_helper();
    } else {
        if ((type_field.selectedIndex == macos_games && page_add) || force_enabled) game_helper();

        //manage type change
        var type = $("#categories");
        var type_default_behavior = type.attr("onchange");
        type.removeAttr("onchange");
        type.change(function() {
            $("#dynamic_form").prepend("<input type='hidden' id='gh_hidden_key'>"); //hide a key to check loading
            eval(type_default_behavior);
            var safety = 0; //for polar bears' sake
            var loading = setInterval(function(){
                if($("#gh_hidden_key").length==0) {
                    var game_helper_on = $("#game_helper").length == 0? false : true;
                    if (type_field.selectedIndex == macos_games && !game_helper_on) game_helper();
                    if (game_helper_on) $("#game_helper").remove();
                    clearInterval(loading);
                }
                if (safety > 30) clearInterval(loading); //kill loading >9000 ms
                safety ++;
            }, 300);
        });
    }
})();
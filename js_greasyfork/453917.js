// ==UserScript==
// @name         GGPT Auto Uploady
// @version      0.1
// @description  Game Uploady for GGPT
// @author       inerfire
// @credits      NeutronNoir, ZeDoCaixao
// @match        https://gamegamept.cn/upload.php
// @match        https://gamegamept.cn/editgameinfo.php*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon         https://gamegamept.cn/favicon.ico
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/976584
// @downloadURL https://update.greasyfork.org/scripts/453917/GGPT%20Auto%20Uploady.user.js
// @updateURL https://update.greasyfork.org/scripts/453917/GGPT%20Auto%20Uploady.meta.js
// ==/UserScript==

function html2bb(str) {
    if (!str) return "";
    str = str.replace(/< *br *\/*>/g, "\n\n"); //*/
    str = str.replace(/< *b *>/g, "[b]");
    str = str.replace(/< *\/ *b *>/g, "[/b]");
    str = str.replace(/< *u *>/g, "[u]");
    str = str.replace(/< *\/ *u *>/g, "[/u]");
    str = str.replace(/< *i *>/g, "[i]");
    str = str.replace(/< *\/ *i *>/g, "[/i]");
    str = str.replace(/< *strong *>/g, "[b]");
    str = str.replace(/< *\/ *strong *>/g, "[/b]");
    str = str.replace(/< *em *>/g, "[i]");
    str = str.replace(/< *\/ *em *>/g, "[/i]");
    str = str.replace(/< *li *>/g, "[*]");
    str = str.replace(/< *\/ *li *>/g, "");
    str = str.replace(/< *ul *class=\\*\"bb_ul\\*\" *>/g, "");
    str = str.replace(/< *\/ *ul *>/g, "");
    str = str.replace(/< *h2 *class=\"bb_tag\" *>/g, "\n[b]");
    str = str.replace(/< *h[1234] *>/g, "\n[b]");
    str = str.replace(/< *\/ *h[1234] *>/g, "[/b]\n");
    str = str.replace(/\&quot;/g, "\"");
    str = str.replace(/\&amp;/g, "&");
    str = str.replace(/< *img *src="([^"]*)".*>/g, "\n");
    str = str.replace(/< *img.*src="([^"]*)".*>/g, "\n");
    str = str.replace(/< *a [^>]*>/g, "");
    str = str.replace(/< *\/ *a *>/g, "");
    str = str.replace(/< *p *>/g, "\n\n");
    str = str.replace(/< *\/ *p *>/g, "");
    //Yeah, all these damn stars. Because people put spaces where they shouldn't.
    str = str.replace(//g, "\"");
    str = str.replace(//g, "\"");
    str = str.replace(/  +/g, " ");
    str = str.replace(/\n +/g, "\n");
    str = str.replace(/\n\n\n+/gm, "\n\n");
    str = str.replace(/\n\n\n+/gm, "\n\n");
    str = str.replace(/\[\/b\]\[\/u\]\[\/align\]\n\n/g, "[/b][/u][/align]\n");
    str = str.replace(/\n\n\[\*\]/g, "\n[*]");
    str = str.replace(/< *video.*>\n.*?< *\/ *video *>/g,'');
    // str = str.replace(/< *\/ *source.*>/g,'');
    str = str.replace(/<hr>/g,'\n\n');
    return str;
}

function markdown2bb(str) {
    if (!str) return "";
    str = str.replace(/!\[.*?\.(?:jpg|png)\)\n\n/g, '');//删除markdown格式的图片
    str = str.replace(/#(.*?)\n\n/g, '[b]$1:[/b]');//修改markdown标题为bbcode
    return str;
}

function fix_emptylines(str) {
    var lst = str.split("\n");
    var result = "";
    var empty = 1;
    lst.forEach(function(s) {
        if (s) {
            empty = 0;
            result = result + s + "\n";
        } else if (empty < 1) {
            empty = empty + 1;
            result = result + "\n";
        }
    });
    return result;
}

function pretty_sr(str) {
    if (!str) return "";
    str = str.replace(/™/g, "");
    str = str.replace(/®/g, "");
    str = str.replace(/:\[\/b\] /g, "[/b]: ");
    str = str.replace(/:\n/g, "\n");
    str = str.replace(/:\[\/b\]\n/g, "[/b]\n");
    str = str.replace(/\n\n\[b\]/g, "\n[b]");
    return str;
}

function steam_form(response) {
    //调用steamapi获取相关信息
    //We store the data in gameInfo, since it's much easier to access this way

    //var steamid = /app\/(\d+)\//g.exec($("#gameid").val()).pop();
    var gameInfo = response.response[steamid].data;
    var about = gameInfo.about_the_game;
    var date = gameInfo.release_date.date.split(", ").pop();
    var year = date.split("年").shift().trim();
    var store = 'https://store.steampowered.com/app/' + steamid;
    var genres = [];
    gameInfo.genres.forEach(function (genre) {
        var tag = genre.description.toLowerCase().replace(/ /g, ".");
        genres.push(tag);
    });
    genres = genres.join("," );
    if (about === '') { about = gameInfo.detailed_description; }
    about = "\n\n[b]【基本信息】[/b]\n" +`[b]发行日期[/b]：${date}\n\n[b]商店链接[/b]：${store}\n\n[b]游戏标签[/b]：${genres}\n\n` + "[b]【游戏简介】[/b]\n" + html2bb(about).trim();
    var screens = '';
    gameInfo.screenshots.forEach(function(screen) {
        screens += "[img]"+ screen.path_full.split("?")[0] + "[/img]\n"
    });
    var sc = "[b]【游戏截图】[/b]\n" + screens;
    try {
        var trailer = gameInfo.movies[0].webm.max.split("?")[0].replace("http","https");
        var tr = "\n\n[b]【预告欣赏】[/b]\n" + `[video]${trailer}[/video]\n\n`;
    }catch (e) {
        tr = ''
    }
    var platform = "Windows";
    //var cover_field = "input[name='image']";
    var desc_field = "textarea[name='body']";


    $("input[name ='name']").val(pretty_sr(gameInfo.name));  //Get the name of the game
    //$("#year").val(year);
    /*
    var genres = [];
    gameInfo.genres.forEach(function (genre) {
        var tag = genre.description.toLowerCase().replace(/ /g, ".");
        genres.push(tag);
    });
    $("#tags").val(genres.join(", "));*/
    //cover_field = "#image";
    desc_field = "#descr";
    platform = $("#console").val();

    var recfield = gameInfo.pc_requirements;
    switch (platform) {
        case "16":
            recfield = gameInfo.pc_requirements;
            break;
        case "46":
            recfield = gameInfo.linux_requirements;
            break;
        case "37":
            recfield = gameInfo.mac_requirements;
            break;
    }
    if (typeof(recfield.recommended) === "undefined"){
        recfield.recommended = '\n无推荐配置要求';
    }
    if (typeof(recfield.minimum) === "undefined"){
        recfield.minimum = '\n无配置要求';
        recfield.recommended = '';
    }

    var sr = "\n\n[b]【配置要求】[/b]\n\n" +
             pretty_sr(html2bb("[quote]\n" + recfield.minimum + "\n\n" + recfield.recommended + "[/quote]\n"));
    var cover = "[img]" + gameInfo.header_image.split("?")[0] + "[/img]";       //Get the image URL
    //由于异步原因暂时不获取big_conver了
    /*var big_cover = "[img]" + "https://steamcdn-a.akamaihd.net/steam/apps/" + steamid + "/library_600x900_2x.jpg" + "[/img]";
    GM.xmlHttpRequest({
        method: "GET",                  //We call the Steam API to get info on the game
        url: big_cover,
        responseType: "json",
        onload: function(response) {
            if(response.status === 200){
                cover = big_cover;
            }
        }
    });*/
    $(desc_field).val(cover);
    $(desc_field).val($(desc_field).val() + about + sr + tr + sc);
    $(desc_field).val(fix_emptylines($(desc_field).val()));
    $("input[name ='year']").val(year)
    /*if (gameInfo.metacritic) {
        $("#meta").val(gameInfo.metacritic.score);
        $("#metauri").val(gameInfo.metacritic.url.split("?")[0] + "/critic-reviews");
    }*/
}

function epic_form(response) {
    //调用epicapi获取相关信息
    //We store the data in gameInfo, since it's much easier to access this way
    var gameInfo = response.response["pages"];
    for (let i=0; i<gameInfo.length;i++){
        if(gameInfo[i]['_title'] === "home"||gameInfo[i]['_title'] === "主页"||gameInfo[i]['_title'] === "Home"){
            gameInfo = gameInfo[i];
            break;
        }
    }
    var about = gameInfo.data.about.description;
    var date = gameInfo.data.meta['releaseDate'];
    var year = date.split("-").shift().trim();
    if (about === "") {about = gameInfo.data.about.shortDescription; }
    about = "\n\n[b]【基本信息】[/b]\n" + `[b]发行日期[/b]：${date}\n\n[b]商店链接[/b]：${$("#gameid").val()}\n\n` + "[b]【游戏简介】[/b]\n" + markdown2bb(about).trim();
    var screens = '';
    try{
        gameInfo.data.gallery.galleryImages.forEach(function (screen) {
            screens += "[img]" + screen["src"] + "[/img]\n"
    })
    }catch (e) {
        gameInfo._images_.forEach(function (screen) {
            screens += "[img]" + screen + "[/img]\n"
        })
    }
    var sc = "[b]【游戏截图】[/b]\n" + screens;
    var desc_field = "textarea[name='body']";


   $("input[name ='name']").val(gameInfo.productName);  //Get the name of the game
   // $("input[name='small_descr']").val(gameInfo.data.about.title); //暂时不获取中文名了
    desc_field = "#descr";
    var platform = $("#console").val();
    switch (platform) {
        case "16":
            platform = "Windows";
            break;
        case "46":
            platform = "Linux";
            break;
        case "37":
            platform = "Mac";
            break;
    }
    var recfield = gameInfo.data.requirements.systems[0].details;
    gameInfo.data.requirements.systems.forEach(function (system) {
        if (system['systemType'] === platform){recfield=system.details}
    });
    var minimum = '[b]最低配置[/b]\n';
    var recommended = '[b]推荐配置[/b]\n';
    recfield.forEach(function (sysrec, index) {
        minimum += "[b]" + sysrec['title'] + "[/b]" + ': ' + sysrec['minimum'] + '\n';
        recommended += "[b]" + sysrec['title'] + "[/b]" + ': ' + sysrec['recommended'] + '\n'
    });
    var sr = "\n\n[b]【配置要求】[/b]\n\n" +
        pretty_sr(html2bb("[quote]\n" + minimum + "\n\n" + recommended + "[/quote]\n"));
    var age_rate = "[b]【游戏评级】[/b]\n";
    try {
        let pics = '';
        gameInfo.data.requirements.legalTags.forEach(function (pic) {
            pics += "[img]" + pic["src"] +"[/img]\n";
        });
        age_rate += `${pics}`
    } catch (e) {
        age_rate=''
    }
    var cover = "[img]" + gameInfo.data.about.image.src + "[/img]";       //Get the image URL
    $(desc_field).val(cover);
    $(desc_field).val($(desc_field).val() + about + sr + age_rate + sc);
    $(desc_field).val(fix_emptylines($(desc_field).val()));
    $("input[name ='year']").val(year)
}

async function gog_form (response) {
    var gameInfo = response.response["_embedded"];
    function get_chinese(url) {
        return new Promise( (resolve, reject) => {
            GM.xmlHttpRequest({
                method: "GET",
                url: url,
                responseType: "json",
                onload: function (response) {
                    resolve(response.response);
                },
                onerror: function (error) {
                     reject('error');
                }
            });
        });
    }
    let chinese = await get_chinese("https://api.gog.com/products/"+gameInfo['product']['id']+"?expand=description&locale=zh")
    let chinese_desc = chinese["description"]['full']
    let chinese_title = chinese["title"]
    //调用gog获取相关信息
    var english = response.response["description"] //英语介绍
    var about = chinese_desc;
    var date = gameInfo["product"]["globalReleaseDate"];
    var year = date.split("-").shift().trim();
    var store = response.response["_links"]["store"]["href"];
    var genres = [];
    gameInfo.tags.forEach(function (genre) {
        var tag = genre["name"].toLowerCase().replace(/ /g, ".");
        genres.push(tag);
    });
    genres = genres.join("," );
    if (about === '') { about = english; }
    about = "\n\n[b]【基本信息】[/b]\n" +`[b]发行日期[/b]：${date}\n\n[b]商店链接[/b]：${store}\n\n[b]游戏标签[/b]：${genres}\n\n` + "[b]【游戏简介】[/b]\n" + html2bb(about).trim();
    var screens = '';
    gameInfo.screenshots.forEach(function(screen) {
        let screen_url = screen["_links"]["self"]["href"]
        let format = screen["_links"]["self"]["formatters"].pop()
        screen_url = screen_url.replace("{formatter}",format)
        screens += "[img]"+ screen_url + "[/img]\n"
    });
    var sc = "[b]【游戏截图】[/b]\n" + screens;

    try {
        var trailer = gameInfo.movies[0].webm.max.split("?")[0].replace("http","https");
        var tr = "\n\n[b]【预告欣赏】[/b]\n" + `[video]${trailer}[/video]\n\n`;
    }catch (e) {
        tr = ''
    } // 暂时不弄预告了

    var platform = "Windows";
    //var cover_field = "input[name='image']";
    var desc_field = "textarea[name='body']";

    let title = gameInfo["product"]["title"]
    $("input[name ='name']").val(pretty_sr(title));  //Get the name of the game
    if (title !== chinese_title) {$("input[name ='small_descr']").val(chinese_title);}
    //$("#year").val(year);
    /*
    var genres = [];
    gameInfo.genres.forEach(function (genre) {
        var tag = genre.description.toLowerCase().replace(/ /g, ".");
        genres.push(tag);
    });
    $("#tags").val(genres.join(", "));*/
    //cover_field = "#image";
    desc_field = "#descr";
    platform = $("#console").val();

    var recfield = gameInfo.pc_requirements;
    switch (platform) {
        case "16":
            platform = "windows";
            break;
        case "46":
            platform = "linux";
            break;
        case "37":
            platform = "osx";
            break;
    }
    gameInfo["supportedOperatingSystems"].forEach(function (system) {
        if (system['operatingSystem']["name"] === platform){recfield=system["systemRequirements"]}
    });
    var minimum = '[b]最低配置[/b]\n';
    var recommended = '[b]推荐配置[/b]\n';
    recfield.forEach(function (sysrec) {
        if (sysrec["type"] === "minimum") {
            sysrec["requirements"].forEach(function (req) {
                minimum += "[b]" + req['name'] + "[/b]" + ': ' + req['description'] + '\n';
            })
        } else if (sysrec["type"] === "recommended") {
            sysrec["requirements"].forEach(function (req) {
            recommended += "[b]" + req['name'] + "[/b]" + ': ' + req['description'] + '\n';
            })
        }

    });
    var sr = "\n\n[b]【配置要求】[/b]\n\n" +
        pretty_sr("[quote]\n" + minimum + "\n\n" + recommended + "[/quote]\n");
    var cover = "[img]" + response.response["_links"]["boxArtImage"]["href"] + "[/img]"; //Get the image URL

    $(desc_field).val(cover);
    $(desc_field).val($(desc_field).val() + about + sr + tr + sc);
    $(desc_field).val(fix_emptylines($(desc_field).val()));
    $("input[name ='year']").val(year)
    /*if (gameInfo.metacritic) {
        $("#meta").val(gameInfo.metacritic.score);
        $("#metauri").val(gameInfo.metacritic.url.split("?")[0] + "/critic-reviews");
    }*/
}

function indienova_form(response) {
    //调用ptgenapi获取indienova的相关信息
    var gameInfo = response.response;
    $("input[name ='name']").val(gameInfo.english_title);
    $("input[name ='small_descr']").val(gameInfo.chinese_title);
    $("input[name ='year']").val(gameInfo.release_date.split("-").shift().trim());
    //更改居中显示文字
    var descr = gameInfo.format.replace('【基本信息】', '[b]【基本信息】[/b]').replace('【游戏简介】', '[b]【游戏简介】[/b]').replace('【游戏截图】', '[b]游戏截图[/b]').replace('【游戏评级】', '[b]游戏评级[/b]');
    //更改居中显示图片
    descr = descr.replace(/\[img]/g,'[img]').replace(/\[\/img]/g,'[/img]');
    $("#descr").val(descr)
}


async function choose_form(key) {
    let url;
    if (!key.endsWith('/')){
        key += '/'
    }
    if (key.indexOf("store.steampowered.com/") !== -1) {
        steamid = /app\/(\d+)/g.exec(key).pop();
        url = "https://store.steampowered.com/api/appdetails?l=schinese&appids="+steamid;
        fill_form = steam_form
    }
    else if(key.indexOf("epicgames.com") !== -1) {

        var epicid = /p\/(.+?)\//g.exec(key).pop();
        url ="https://store-content.ak.epicgames.com/api/zh-CN/content/products/"+epicid;
        fill_form = epic_form;
    }
    else if(key.indexOf('indienova') !== -1){
        key = key.substring(0,key.length-1);
        url = "https://autofill.scatowl.workers.dev/?url="+key;
        fill_form = indienova_form
    }
    else if(key.indexOf('gog.com') !== -1){
        function get_gog(url) {
            return new Promise( (resolve, reject) => {
                GM.xmlHttpRequest({
                    method: "GET",
                    url: key,
                    onload: function (response) {
                        resolve(response.responseText);
                    },
                    onerror: function (error) {
                         reject(error);
                    }
                });
            });
        }
        key = key.substring(0,key.length-1);
        let gog = await get_gog(key)
        gog = /(?<=card-product=")\d+(?=")/.exec(gog).pop()
        url = "https://api.gog.com/v2/games/"+gog;
        fill_form = gog_form
    }
    return url;

}

async function triger(gameid) {
        const url = await choose_form(gameid.val());
        GM.xmlHttpRequest({
            method: "GET",                  //We call the Steam API to get info on the game
            url: url,
            responseType: "json",
            onload: fill_form
        });
}

(function() {
    'use strict';
    $("input[name='name']").parent().parent().after(
        "<tr><td>商店链接</td><td><input style='width: 450px;' id='gameid' /></td></tr>"
    );
    const gameid = $("#gameid");
    gameid.after(
        '<a href="javascript:;" id="fill_win" style="color:white">生成简介</a>' ) ;
    $('#fill_win').click(function () { triger(gameid); $("#console").val("16"); });
})();

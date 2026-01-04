// ==UserScript==
// @name         Pter game Uploady
// @namespace    https://pterclub.com/forums.php?action=viewtopic&topicid=3391
// @version      1.2.5
// @description  Game Uploady for Pterclub
// @author       BbLaCk
// @credits      NeutronNoir, ZeDoCaixao
// @match        https://pterclub.com/uploadgameinfo.php*
// @match        https://pterclub.com/editgameinfo.php*
// @include      https://s3.pterclub.com*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon         https://pterclub.com/favicon.ico
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.cookie
// @grant        GM_cookie
// @downloadURL https://update.greasyfork.org/scripts/481228/Pter%20game%20Uploady.user.js
// @updateURL https://update.greasyfork.org/scripts/481228/Pter%20game%20Uploady.meta.js
// ==/UserScript==
var pterimagecookie = GM_getValue("pterimagecookie", null)
var pterimagekey = GM_getValue("pterimagekey", null)
    $("input[name='name']").parent().parent().after(
        "<tr><td>Game URL</td><td><input style='width: 450px;' id='gameid' /></td></tr>"
    );
$('#gameid').after("<p id='status_helper'>输入相关链接并点击相应平台按钮，开始获取信息</p>")
const helper = document.getElementById('status_helper');

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
    str = str.replace(/< *h2 *class=\"bb_tag\" *>/g, "\n[center][u][b]");
    str = str.replace(/< *h[1234] *>/g, "\n[center][u][b]");
    str = str.replace(/< *\/ *h[1234] *>/g, "[/b][/u][/center]\n");
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
function get_pterimage(){
    const token = $('a[href^="https://s3.pterclub.com/logout/?auth_token="]').attr("href").replace("https://s3.pterclub.com/logout/?auth_token=",'')
    GM_setValue("pterimagekey", token);
    let cookies = GM_getValue("pterimagecookie", null);
    console.log(token)
    if (!cookies){
        GM_cookie.list({ url: "https://s3.pterclub.com" }, (cookie, error) => {
            if (!error) GM.setValue("pterimagecookie", cookie[0]['name']+"="+cookie[0]['value']+"; "+cookie[1]['name']+"="+cookie[1]['value']);
            else GM.setValue("pterimagecookie", "error");
        });
    }
    if (cookies === "error") cookies = prompt('自动获取cookies失败，请手动输入cookies')
    console.log(cookies)
    GM_setValue("pterimagecookie",cookies);
    if (confirm("已尝试获取cookies，是否刷新？")=== true) location.reload()
}

async function rehostinvienova(imageurl){
    // helper.innerText= "正在转存图片"
    let result = ''
    function blobToBase64(blob) {
      return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    }
    async function up2imgbb(response){
        let form = new FormData()
        let base64 = await blobToBase64(response.response)
        base64 = encodeURIComponent(base64.replace(/data:image\/.+?;base64,/,""))
        form.append('image',base64)

        await GM.xmlHttpRequest({
            method: "POST",
            url: 'https://api.imgbb.com/1/upload?key=26c350d051aa9be55b7d7cea1f082178',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: "image=" + base64,
            anonymous: true,
            fetch: true,
            responseType: 'json',
            onload: function (response) {
                if (response.response.success) {
                    result = response.response.data.image.url
                }
                else console.log(response.response.error)

            },
            onerror: function (error) {
                console.log(error)
            }
        })

    }
    async function downloadfrominde(inde_url){
       return await GM.xmlHttpRequest({
            method: "GET",
            url: inde_url,
            headers: {"Referer":'https://indienova.com/'},
            responseType: 'blob'
        })
    }
    let imgblob = await downloadfrominde(imageurl)
    await up2imgbb(imgblob)
    return result
}
async function upload_pterimage(image_link){
    let url = "https://s3.pterclub.com/json/"+"?action=upload&source="+image_link+"&auth_token="+pterimagekey
    let headers = {
    'authority': 's3.pterclub.com',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
    'cache-control': 'no-cache',
    'cookie': pterimagecookie,
    'pragma': 'no-cache',
    'referer': 'https://s3.pterclub.com/',
    'sec-ch-ua': '"Chromium";v="110", "Not A(Brand";v="24", "Microsoft Edge";v="110"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.49',
}
    let result = ''
     await GM.xmlHttpRequest({
        method: "GET",
        url: url,
        responseType: 'json',
        anonymous: true,
        headers: headers,
        onload: function (response) {
            if (response.response.status_code === 200) result = response.response.image.image.url
            else {
                result = image_link
                if (response.response.error.message.includes("(auth_token)")){
                    console.log("Cookies 过期，请立刻更新cookies")
                    GM.setValue("pterimagecookie", '');
                }
            }
            console.log(response.response)
        },
        onerror: function (error) {
            result =  image_link;
        }
    })
    return result
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

async function steam_form(response) {
    //调用steamapi获取相关信息
    //We store the data in gameInfo, since it's much easier to access this way

    //var steamid = /app\/(\d+)\//g.exec($("#gameid").val()).pop();
    helper.innerText = "正在获取！"
    var gameInfo = response.response[steamid].data;
    var about = gameInfo.about_the_game;
    var date = gameInfo.release_date.date.split(", ").pop();
    var year = date.split("年").shift().trim();
    var store = 'https://store.steampowered.com/app/' + steamid;
    var genres = [];
    if (gameInfo.hasOwnProperty('genres')) {
          gameInfo.genres.forEach(function (genre) {
              var tag = genre.description.toLowerCase().replace(/ /g, ".");
              genres.push(tag);
          });
        }
    genres = genres.join("," );
    if (about === '') { about = gameInfo.detailed_description; }
    about = "[center][b][u]关于游戏[/u][/b][/center]\n" +`[b]发行日期[/b]：${date}\n\n[b]商店链接[/b]：${store}\n\n[b]游戏标签[/b]：${genres}\n\n` + html2bb(about).trim();
    var screens_bb = '';
    let image_count = 1
    let total_image = gameInfo.screenshots.length
    for (screen of gameInfo.screenshots){
        helper.innerText = "正在转存第" + image_count + "张图片，共" + total_image + "张"
        image_count ++
        screens_bb += "[img]" + await upload_pterimage(screen.path_full.split("?")[0]) + "[/img]\n"
    }
    helper.innerText = "转存完毕！"
    console.log(screens_bb)

    screens_bb = "[center][b][u]游戏截图[/u][/b][/center]\n" + "[center]" + screens_bb + "[/center]";
    try {
        var trailer = gameInfo.movies[0].webm.max.split("?")[0].replace("http","https");
        var tr = "\n\n[center][b][u]预告欣赏[/u][/b][/center]\n" + `[center][video]${trailer}[/video][/center]`;
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

    var sr = "\n\n[center][b][u]配置要求[/u][/b][/center]\n\n" +
             pretty_sr(html2bb("[quote]\n" + recfield.minimum + "\n" + recfield.recommended + "[/quote]\n"));
    var cover = "[center][img]" +  await upload_pterimage(gameInfo.header_image.split("?")[0]) + "[/img][/center]";       //Get the image URL
    //由于异步原因暂时不获取big_conver了
    /*var big_cover = "[center][img]" + "https://steamcdn-a.akamaihd.net/steam/apps/" + steamid + "/library_600x900_2x.jpg" + "[/img][/center]";
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
    $(desc_field).val($(desc_field).val() + about + sr + tr + screens_bb);
    $(desc_field).val(fix_emptylines($(desc_field).val()));
    $("input[name ='year']").val(year)
    /*if (gameInfo.metacritic) {
        $("#meta").val(gameInfo.metacritic.score);
        $("#metauri").val(gameInfo.metacritic.url.split("?")[0] + "/critic-reviews");
    }*/
}

async function epic_form(response) {
    //调用epicapi获取相关信息
    //We store the data in gameInfo, since it's much easier to access this way
    helper.innerText = "正在获取！"
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
    about = "[center][b][u]关于游戏[/u][/b][/center]\n" + `[b]发行日期[/b]：${date}\n\n[b]商店链接[/b]：${$("#gameid").val()}\n\n` + markdown2bb(about).trim();
    var screen_bb = '';
    try{
        for (screen of gameInfo.data.gallery.galleryImages ) {
            screen_bb += "[img]" + await upload_pterimage(screen['src']) + "[/img]\n"
        }
    //     gameInfo.data.gallery.galleryImages.forEach(function (screen) {
    //         screens += "[img]" + screen["src"] + "[/img]\n"
    // })
    }catch (e) {
        for (screen of gameInfo._images_){
            screen_bb += "[img]" + await upload_pterimage(screen) + "[/img]\n"
        }
        // gameInfo._images_.forEach(function (screen) {
        //     screens += "[img]" + screen + "[/img]\n"
        // })
    }
    screen_bb = "[center][b][u]游戏截图[/u][/b][/center]\n" + "[center]" + screen_bb + "[/center]" ;
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
    var sr = "\n\n[center][b][u]配置要求[/u][/b][/center]\n\n" +
        pretty_sr(html2bb("[quote]\n" + minimum + "\n" + recommended + "[/quote]\n"));
    var age_rate = "[center][b][u]游戏评级[/u][/b][/center]\n";
    try {
        let pics = '';
        gameInfo.data.requirements.legalTags.forEach(function (pic) {
            pics += "[img]" + pic["src"] +"[/img]\n";
        });
        age_rate += `[center]${pics}[/center]`
    } catch (e) {
        age_rate=''
    }
    var cover = "[center][img]" + await upload_pterimage(gameInfo.data.about.image.src) + "[/img][/center]";       //Get the image URL
    $(desc_field).val(cover);
    $(desc_field).val($(desc_field).val() + about + sr + age_rate + screen_bb);
    $(desc_field).val(fix_emptylines($(desc_field).val()));
    $("input[name ='year']").val(year)
}

async function gog_form (response) {
    helper.innerText = "正在获取！"
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
    about = "[center][b][u]关于游戏[/u][/b][/center]\n" +`[b]发行日期[/b]：${date}\n\n[b]商店链接[/b]：${store}\n\n[b]游戏标签[/b]：${genres}\n\n` + html2bb(about).trim();
    let image_count = 1
    let total_image = gameInfo.screenshots.length

    var screen_bb = ''
    for (screen of gameInfo.screenshots){
        helper.innerText = "正在转存第" + image_count + "张图片，共" + total_image + "张"
        image_count ++
        let screen_url = screen["_links"]["self"]["href"]
        let format = screen["_links"]["self"]["formatters"].pop()
        screen_url = screen_url.replace("{formatter}",format)
        screen_bb += "[img]" + await upload_pterimage(screen_url) + "[/img]\n"
    }
    helper.innerText = "转存完毕！"
    // gameInfo.screenshots.forEach(function(screen) {
    //     let screen_url = screen["_links"]["self"]["href"]
    //     let format = screen["_links"]["self"]["formatters"].pop()
    //     screen_url = screen_url.replace("{formatter}",format)
    //     screens += "[img]"+ screen_url + "[/img]\n"
    // });
    screen_bb = "[center][b][u]游戏截图[/u][/b][/center]\n" + "[center]" + screen_bb + "[/center]";

    try {
        var trailer = gameInfo.movies[0].webm.max.split("?")[0].replace("http","https");
        var tr = "\n\n[center][b][u]预告欣赏[/u][/b][/center]\n" + `[center][video]${trailer}[/video][/center]`;
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
    var sr = "\n\n[center][b][u]配置要求[/u][/b][/center]\n\n" +
        pretty_sr("[quote]\n" + minimum + "\n" + recommended + "[/quote]\n");
    var cover = "[center][img]" + await upload_pterimage(response.response["_links"]["boxArtImage"]["href"]) + "[/img][/center]"; //Get the image URL

    $(desc_field).val(cover);
    $(desc_field).val($(desc_field).val() + about + sr + tr + screen_bb);
    $(desc_field).val(fix_emptylines($(desc_field).val()));
    $("input[name ='year']").val(year)
    /*if (gameInfo.metacritic) {
        $("#meta").val(gameInfo.metacritic.score);
        $("#metauri").val(gameInfo.metacritic.url.split("?")[0] + "/critic-reviews");
    }*/
}

async function indienova_form(response) {
    //调用ptgenapi获取indienova的相关信息
    helper.innerText = "正在获取！"
    var gameInfo = response.response;
    let screen_bb = ''
    let cover = "[center][img]" + await rehostinvienova(gameInfo.cover) + "[/img][/center]\n"
    $("input[name ='name']").val(gameInfo.english_title);
    $("input[name ='small_descr']").val(gameInfo.chinese_title);
    $("input[name ='year']").val(gameInfo.release_date.split("-").shift().trim());
    //更改居中显示文字
    var descr = gameInfo.format.replace('【基本信息】', '[center][b][u]基本信息[/u][/b][/center]').replace('【游戏简介】', '[center][b][u]关于游戏[/u][/b][/center]').replace('【游戏评级】', '[center][b][u]游戏评级[/u][/b][/center]');
    //更改居中显示图片
    // descr = descr.replace(/\[img]/g,'[center][img]').replace(/\[\/img]/g,'[/img][/center]');
    let image_count = 1
    let total_image = gameInfo.screenshot.length
    for (screen of gameInfo.screenshot ){
        screen_bb += "[img]" + await rehostinvienova(screen) + "[/img]\n"
        helper.innerText = "正在转存第" + image_count + "张图片，共" + total_image + "张"
        image_count ++
    }
    helper.innerText = "转存完毕！"
    screen_bb = "[center][b][u]游戏截图[/u][/b][/center]\n" + "[center]" + screen_bb + "[/center]" ;
    console.log(screen_bb)
    descr = descr.replace(/【游戏截图】.*/sm, screen_bb).replace(/\[img].+\[\/img]/,cover) // 替换转存的截图和封面
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
        url = "https://gen.cattool.eu.org/?url="+key;
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
    if (!pterimagekey || !pterimagecookie || pterimagecookie === "error") {
        if (window.location.href.includes("https://pterclub.com/uploadgameinfo.php")){
            alert("猫站图床Cookies或key未找到，正在前往获取！如弹出被阻止 请允许该弹窗或自行前往 https://s3.pterclub.com/getcookies 获取")
            window.open('https://s3.pterclub.com/getcookies')
        }
        else if (window.location.href.includes("https://s3.pterclub.com/getcookies")) get_pterimage()
    }


    const gameid = $("#gameid");
    gameid.after(
        '<a href="javascript:;" id="fill_win" style="color:green">Win</a> <a href="javascript:;" id="fill_lin" style="color:blue">Lin</a> <a href="javascript:;" id="fill_mac" style="color:orange">Mac</a> <a href="javascript:;" id="fill_ns" style="color:red">NS</a> <a href="javascript:;" id="fill_ps4" style="color:grey">PS4</a>' ) ;
    $('#fill_win').click(function () { triger(gameid); $("#console").val("16"); });
    $('#fill_lin').click(function () { triger(gameid); $("#console").val("46"); });
    $('#fill_mac').click(function () { triger(gameid); $("#console").val("37"); });
    $('#fill_ns').click(function () { triger(gameid); $("#console").val("20"); });
    $('#fill_ps4').click(function () { triger(gameid); $("#console").val("31"); });
})();
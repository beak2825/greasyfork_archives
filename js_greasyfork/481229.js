// ==UserScript==
// @name         Pter torrent Helper
// @namespace    https://pterclub.com/forums.php?action=viewtopic&topicid=3391
// @version      0.4.10
// @description  torrent description helper for Pterclub
// @author       BbLaCk
// @match        https://pterclub.com/uploadgame.php*
// @match        https://pterclub.com/editgame.php*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon         https://pterclub.com/favicon.ico
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/481229/Pter%20torrent%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/481229/Pter%20torrent%20Helper.meta.js
// ==/UserScript==
function find_rls(rlsid) {
    'use strict';
    const data = "xrel_search_query="+rlsid;
    GM.xmlHttpRequest({
        method: "POST",
        url: "https://www.xrel.to/search.html?mode=rls",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: data,
        onload: function (response) {
            if (response.status === 200){
                const game_url = "https://www.xrel.to/" + /((?:game|console)-nfo.+?)\.html/.exec(response.responseText).shift();
                 GM.xmlHttpRequest({
                     method: "GET",
                     url: game_url,
                    onload: fill_nfo
                 })
            }
        }
    });
}
// api_key = 26c350d051aa9be55b7d7cea1f082178
async function fill_nfo(response_data) {
    'use strict';
    const token = /rls_id=(\d+?)&nfo_id=(\d+?)&secret=(.+?)&font=FONTIDX/.exec(response_data.response);
    let imgurl = `https://www.xrel.to/nfo-a/${token[1]}-${token[2]}-${token[3]}/c90fd3b2-1.png`;
    function up2imgbb(){
        GM.xmlHttpRequest({
            method: "GET",
            url: 'https://api.imgbb.com/1/upload?key=26c350d051aa9be55b7d7cea1f082178&image='+imgurl,
            responseType: 'json',
            onload: function (response) {
                if (response.response.success === true) {imgurl = response.response.data.display_url;}
                const descr =$('#descr');
                const nfo_descr =  descr.val() + `[center][url=${imgurl}][img]${imgurl}[/img][/url][/center]`;
                descr.val(nfo_descr)

            }
        })
    }
    GM.xmlHttpRequest({
        method: "GET",
        url: imgurl,
        onload: async function (response){
            if (/image\/png/g.exec(response.responseHeaders) === null){imgurl =`https://www.xrel.to/nfo-a/${token[1]}-${token[2]}-${token[3]}/c90fd3b2-2.png` }
            await up2imgbb();
        }
    })
}

function fill_install(type) {
    'use strict';
    const descr =$('#descr');
    const title = $('input[name="torrentname"]')
    let ins_descr = '';
    let mod_title = ''
    switch (type) {
        case 'iso':
            ins_descr = descr.val() + "[center][b][u]安装方法[/u][/b][/center]\n[*]解压缩\n[*]挂载镜像\n[*]安装游戏\n[*]复制破解补丁至游戏安装目录\n[*]游玩\n\n";
            mod_title = title.val();
            break;
        case 'fit':
            ins_descr = descr.val() +"[center][b][u]安装方法[/u][/b][/center]\n[*]运行 \"Verify BIN files before installation.bat\" 进行MD5验证（可选）\n[*]运行 \"setup.exe\"安装游戏\n[*]开始游玩\n[*]游戏经过高压，需要一定时间才能解压完毕，请耐心等待。\n\n";
            mod_title = title.val();
            break;
        case '3dm':
            ins_descr = descr.val() +"[center][b][u]安装方法[/u][/b][/center]\n[*]解压缩\n[*]运行游戏\n[*]破解补丁已经预先封装进游戏\n\n";
            mod_title = title.val();
            break;
        case 'bundle':
            ins_descr = '[quote=可替代]本种由于以下原因可被替代:\n[color=#ff0000][*]本体升级包捆绑包[/color][/quote]' + descr.val();
            mod_title = title.val() + ' Trumpable';
    }
    descr.val(ins_descr)
    title.val(mod_title)
}

function release_name(title,name) {
    let raw_name = name.replace(/[:._–\- &]/g, '');
    let pattern = raw_name.replace(/./g,'.*?$&');
    pattern = new RegExp(pattern,'ig');
    $("#name").val(title.replace(pattern, '').replace(/\./g, ' ').replace(/_/g, ' ').trim().replace(/(?<=\d) (?=\d)/g, '.').replace('[FitGirl Repack]','-Fitgirl'))
}

(function() {
    'use strict';
    const game_name = $("h1#top").text().slice(0,-4).trim();
    const torrent = $('#torrent');
    if (window.location.href.includes("uploadgame")){
        $("#name").parent().parent().after(
        "<tr><td>rls name</td><td><input style='width: 450px;' id='rlsid' /></td></tr>"
        );
    }
    else {
        $("input[name='torrentname']").parent().parent().after(
        "<tr><td>rls name</td><td><input style='width: 450px;' id='rlsid' /></td></tr>"
        );
    }
    torrent.change(function () {
        //去掉路径和后缀
        window.rlsname = torrent.val().replace('C:\\fakepath\\','').replace('.torrent','');
        try {
            // 去掉外站内容
            rlsname = /(?<=.+-.+- \d{4} \().+?[\w/.\- ]+(?=\))/.exec(rlsname).pop();
        }catch(e) {
            // 去掉内站常用前后缀
            rlsname = rlsname.replace(/(?:\[\w+?])?/g,'').replace(/^\.+/,'');
        }finally {
            $("#rlsid").val (rlsname);

        }
    });
    $("#rlsid").after(
        '<a href="javascript:;" id="get_nfo" style="color:green">NFO</a> <a href="javascript:;" id="fill_iso" style="color:blue">ISO</a> <a href="javascript:;" id="fill_fit" style="color:orange">Fitgirl</a> <a href="javascript:;" id="fill_3dm" style="color:red">3DM</a> <a href="javascript:;" id="bundle_trump" style="color:black">Bundle</a>');
    $("#name").after('<a href="javascript:;" id="get_rls" style="color:red">Title</a>');
    $('#get_rls').click(function () { release_name(rlsname,game_name)})
    $('#get_nfo').click(function () { find_rls($("#rlsid").val());});
    $('#fill_iso').click(function () { fill_install('iso');});
    $('#fill_fit').click(function () { fill_install('fit');});
    $('#fill_3dm').click(function () { fill_install('3dm');});
    $('#bundle_trump').click(function () { fill_install('bundle');});
})();
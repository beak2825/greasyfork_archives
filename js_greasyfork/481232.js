// ==UserScript==
// @name         Pter Helper Helper
// @namespace    https://pterclub.com/forums.php?action=viewtopic&topicid=3391
// @version      0.1.10
// @description  Help per-helper moderate torrents
// @author       BbLaCk
// @match        https://pterclub.com/details.php?id=*
// @match        https://pterclub.com/usercp.php*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon         https://pterclub.com/favicon.ico
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/481232/Pter%20Helper%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/481232/Pter%20Helper%20Helper.meta.js
// ==/UserScript==
PERFECTPOST = 'perfect';
GOODPOST = 'good';
PENDINGPOST = 'pending';
FINISHEDPOST = 'finished';
BADPOST = 'bbad';
MYNAME = 'my_name';

function ergodicData(dom){
  let xDOM = $("#"+dom +" input");
  let formdata = new FormData();
  for (var i = 0; i < xDOM.length; i++) {
    var a = xDOM.eq(i).attr('name');

    if (xDOM.eq(i).val() === "") {
      console.log('qaq');
    } else if (xDOM.eq(i).attr('type')!=='checkbox' ||xDOM.eq(i).attr('checked')){formdata.append(a,xDOM.eq(i).val())}
  }
  xDOM = $("#"+dom +" select");
  for (i = 0; i < xDOM.length; i++){
      a = xDOM.eq(i).attr('name');
      let b = xDOM.eq(i).children("[selected='selected']");
      formdata.append(a,b.val())
  }
  return formdata;
}

async function checker(state,post_id) {
    let state_id = state;
    state = {1:'种子初步检查无误，建议审核通过',2:'种子存在问题，但已帮忙修改完成，可以审核通过',
        4:'种子存在问题，但已修改完成，可以审核通过',5:'发种人未在48小时内完成种子修改，建议进一步处理',3:''}[state];
    let torrent_url = window.location.href;
    let pending_post_id = window.localStorage.getItem(PENDINGPOST);
    let torrent_id = torrent_url.match(/details\.php\?id=(\d+)/)[1];
    let posts = (await fetch(`https://pterclub.com/forums.php?action=editpost&postid=${post_id}`));
    posts = await posts.text();
    posts = posts.match(/">[\s\S]+">([\s\S]+?)<\/textarea>/m)[1].replace(torrent_url,'').trim();
    posts = `${posts}\r\n${torrent_url}`;
    let pending_post = (await fetch(`https://pterclub.com/forums.php?action=editpost&postid=${pending_post_id}`));
    pending_post = await pending_post.text();
    pending_post = pending_post.match(/">[\s\S]+">([\s\S]+?)<\/textarea>/m)[1].replace(torrent_url,'').trim();
    let subtitle_post_data = ergodicData('kspecialedit');
    subtitle_post_data.append('id',torrent_id);
    subtitle_post_data.append('specialedit','true');
    subtitle_post_data.set('small_descr',`[Checked by ${window.localStorage.getItem(MYNAME)}] ${subtitle_post_data.get('small_descr')}`);
    console.log(posts);
    let data = {
          'id': post_id,
          'type': 'edit',
          'quoteid': '0',
          'original_name': '',
          'original_body': '',
          'color': '0',
          'font': '0',
          'size': '0',
          'body': posts
            };
    function formatData(data) {
    const result = Object.entries(data).map(([key, value]) => `${key}=${value}`).join('&');
	return result;
        }
    await fetch('https://pterclub.com/report.php',{
        method : 'POST',
        headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        body: `taketorrent=${torrent_id}&reason=${state}`,
    }).then(function () {fetch('https://pterclub.com/forums.php?action=post',{
                        method: 'POST',
                        headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                        body: formatData(data)
                    })
    });
    if (state_id !== 3){
        data.body = pending_post;
        data.id = pending_post_id;
        await fetch('https://pterclub.com/forums.php?action=post',{
            method : 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formatData(data),
    }).then(function () {fetch('https://pterclub.com/takedetails.php',{
                        method: 'POST',
                        body: subtitle_post_data
                    })
        })
    }
    return `种子：${torrent_id} 检查完毕！`
}

function fill_form(response) {
    let data = response.response;
     $('input[name="imdbpoint"][type="text"]').val(data['imdb_rating_average']);
    if (data['site'] === 'douban'){
        var trans_titles='',directors='',casts='';
        if (data['foreign_title'].length == 0){ trans_titles= data['chinese_title']}
        else {
            data.trans_title.forEach(function (trans_title) {
                let reg_title = trans_title.replace(/[a-zA-Z\s]/g,'');
                if (reg_title.length != 0 && reg_title != trans_title){reg_title = trans_title}
                trans_titles += reg_title + ' '
            });
        }
        data.director.forEach(function (director) {
            directors = /(.+?)\s/.exec(director['name']).pop()
        });
        var actors = data.cast.slice(0,3);
        actors.forEach(function (cast) {
            casts += /(.+?)\s/.exec(cast['name']).pop()+' '
        });
        let subtitle = trans_titles + ' | ' + "导演：" + directors + ' | ' + '主演：' + casts;
        subtitle= subtitle.replace(/\s+/g,' ');

        $('input[name="dbpoint"][type="text"]').val(data.douban_rating_average);
        $('input[name="url"][type="text"]').val(data['imdb_link']);
        $('input[id="subtitle"]').val(subtitle)
    }
}


function triger(url) {
    function get_info(url) {
        GM.xmlHttpRequest({
            method: "GET",                  //We call the Steam API to get info on the game
            url: "https://gen.cattool.eu.org/?url="+url,
            responseType: "json",
            onload: fill_form
        });
    }
    if (url.indexOf("douban.com/") !== -1){ get_info(url)}
    else {
        let id = /\/(tt\d+)/.exec(url).pop();
        GM.xmlHttpRequest({
            method: "GET",                  //We call the Steam API to get info on the game
            url: "https://gen.cattool.eu.org/?search="+id,
            responseType: "json",
            onload: function (response) {
                try {
                    url = response.response.data[0].link;
                    $('input[name="douban"]').val(url);

                }
                catch (TypeError)  {console.log('no douban page')}
                finally {get_info(url);}
            }
        });
    }
}

function set_key() {
    $('td.rowhead:contains("加入日期")').parent().after(
        "<tr><td class='rowhead nowrap' width='1%' valign='top' align='right' style='color: red'>审核无误</td><td><input style='width: 450px;' id='perfect' /></td></tr>" +
        "<tr><td class='rowhead nowrap' width='1%' valign='top' align='right' style='color: red'>帮忙修改</td><td><input style='width: 450px;' id='good' /></td></tr>" +
        "<tr><td class='rowhead nowrap' width='1%' valign='top' align='right' style='color: red'>需要跟进</td><td><input style='width: 450px;' id='pending' /></td></tr>" +
        "<tr><td class='rowhead nowrap' width='1%' valign='top' align='right' style='color: red'>完成修改</td><td><input style='width: 450px;' id='finished' /></td></tr>" +
        "<tr><td class='rowhead nowrap' width='1%' valign='top' align='right' style='color: red'>并不理我</td><td><input style='width: 450px;' id='bbad' /></td></tr>" +
        "<tr><td class='rowhead nowrap' width='1%' valign='top' align='right' style='color: red'>我的昵称</td><td><input style='width: 450px;' id='my_name' /></td></tr>"
    );
    $('#my_name').after('<a href="javascript:;" id="set" style="color:green">完成设置</a>');
    $('#perfect').val(window.localStorage.getItem(PERFECTPOST));
    $('#good').val(window.localStorage.getItem(GOODPOST));
    $('#pending').val(window.localStorage.getItem(PENDINGPOST));
    $('#finished').val(window.localStorage.getItem(FINISHEDPOST));
    $('#bbad').val(window.localStorage.getItem(BADPOST));
    $('#my_name').val(window.localStorage.getItem(MYNAME));
    $('#set').click(function () {window.localStorage.setItem(PERFECTPOST,$('#perfect').val());
                                window.localStorage.setItem(GOODPOST,$('#good').val());
                                window.localStorage.setItem(PENDINGPOST,$('#pending').val());
                                window.localStorage.setItem(FINISHEDPOST,$('#finished').val());
                                window.localStorage.setItem(BADPOST,$('#bbad').val());
                                window.localStorage.setItem(MYNAME,$('#my_name').val());
    })
}

(function () {
    if (window.location.href.includes('pterclub.com/usercp.php')){set_key()}
    $('a.index[href^="download.php?id="]').parent().after('<td class="rowfollow"><a href="javascript:;" id="perfect" style="color:green" ><img src="https://img.pterclub.com/images/2022/06/17/badge_gpchecker.png" title="审核无误"></a> ' +
        '<a href="javascript:;" id="good" style="color:blue"><img src="https://img.pterclub.com/images/2022/06/17/badge_checker.png" title="帮忙修改"></a> ' +
        '<a href="javascript:;" id="pending" style="color:orange"><img src="https://img.pterclub.com/images/2022/06/17/x.png" title="需要跟进"></a> ' +
        '<a href="javascript:;" id="finished" style="color:red"><img src="https://img.pterclub.com/images/2022/06/17/quality.png" title="完成修改"></a>' +
        '<a href="javascript:;" id="bbad" style="color:purple"><img src="https://img.pterclub.com/images/2022/06/17/disabled.png" title="并不理我"></a></td>')
    $('#perfect').click(function () {checker(1,post_id=window.localStorage.getItem(PERFECTPOST)).then(alert)});
    $('#good').click(function () {checker(2,post_id=window.localStorage.getItem(GOODPOST)).then(alert)});
    $('#pending').click(function () {checker(3,post_id=window.localStorage.getItem(PENDINGPOST)).then(alert)});
    $('#finished').click(function () {checker(4,post_id=window.localStorage.getItem(FINISHEDPOST)).then(alert)});
    $('#bbad').click(function () {checker(5,post_id=window.localStorage.getItem(BADPOST)).then(alert)})


    $('input[name="imdbpoint"][type="text"]').after('<a href="javascript:;" id="fill_imdb" style="color:green">Auto Fill</a>');
    $('input[name="dbpoint"]').after('<a href="javascript:;" id="fill_douban" style="color:green">Auto Fill</a>');
    $('input[name="small_descr"]').after("<input style='width: 650px;' id='subtitle' />")
    $('#fill_cs').click(function () {writeInto()});
    $('#fill_imdb').click(function () {triger($('input[name="url"]').val())});
    $('#fill_douban').click(function () {triger($('input[name="douban"]').val())})
    ergodicData('kspecialedit')
})();


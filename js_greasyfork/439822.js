// ==UserScript==
// @name         获取B站字幕
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  点击左上角按钮，将获取到的B站字幕以提示框的方式展示出来
// @author       贺墨于
// @match        https://www.bilibili.com/*
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439822/%E8%8E%B7%E5%8F%96B%E7%AB%99%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/439822/%E8%8E%B7%E5%8F%96B%E7%AB%99%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

function getQueryVariable(variable){
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}

function getSubtitle(json) {
    let content = [];
    let len = json.length;
    for (let i = 0; i < len; i++) {
        let pair = json[i].content.split('\n')[0]
        content.push(pair)
    }
    return content.join('，');
}

function getJsonURL(aid, cid) {
    return new Promise((resovle, reject) => {
        $.ajax({
            url: `https://api.bilibili.com/x/player/v2?cid=${cid}&aid=${aid}`,
            success: function(res){
                let subtitles = res.data.subtitle.subtitles;
                if (subtitles.length > 0) {
                    resovle(subtitles[0].subtitle_url);
                } else {
                    console.log('-- 该视频无字幕！ ---')
                    reject('-- 该视频无字幕！ ---')
                }
            },
            error: function() {
                reject()
            }
        })
    })
}

function getJson(url) {
    return new Promise((resovle, reject) => {
        $.ajax({
            url,
            success: function(res){
                resovle(res.body)
            },
            error: function() {
                reject()
            }
        })
    })
}

window.showSubtitlesDialog = function(content) {
    document.getElementById('subtitlesDialog').style.display = 'block'
    document.getElementById('subtitlesContent').innerHTML = content
}

window.outSubtitle = function() {
    Promise.all([
        new Promise((resovle, reject) => {
            $.ajax({
                url: `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`,
                success: function(res){
                    resovle(res.data.aid)
                },
                error: function() {
                    reject()
                }
            })
        }),
        new Promise((resovle, reject) => {
            $.ajax({
                url: `https://api.bilibili.com/x/player/pagelist?bvid=${bvid}&jsonp=jsonp`,
                success: function(res){
                    let pvList = res.data
                    let p = getQueryVariable('p')
                    if (p) {
                        resovle(pvList[+p-1].cid)
                    } else {
                        resovle(pvList[0].cid)
                    }
                },
                error: function() {
                    reject()
                }
            })
        })
    ]).then(resp => {
        let aid = resp[0];
        let cid = resp[1];
        return getJsonURL(aid, cid)
    }).then(resp => {
        return getJson(resp)
    }).then(resp => {
        let content = getSubtitle(resp)
        // console.log(content)
        if (!content) {
            alert('该视频无字幕！')
        } else {
            //alert(content)
            showSubtitlesDialog(content)
            console.log(content)
        }
    }).catch(e => {
        alert(e ? e : '-- 获取字幕失败！ --')
    })
}

window.bvid = window.location.pathname.replaceAll('/video/', '').replaceAll('/', '')

var htmlStr = '<div id="subtitlesDialog" style="z-index:10000; width: 500px; height: 500px; overflow-y: scroll;  background-color: #fff;display: none; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); position: fixed; top: 0; right: 0; bottom: 0; left: 0; margin: auto; padding: 15px;">' +
		'<div style="text-align: center; margin-bottom: 10px;">' +
			'<button onclick="javascript: document.getElementById(\'subtitlesDialog\').style.display = \'none\';">关闭</button>' +
		'</div>' +
		'<div id="subtitlesContent">' +
		"</div>" +
	"</div>"



$(function() {
    $('body').append(htmlStr)
    $('body').append('<span id="outSubtitles" style="position: fixed; top: 15%; left: 0; background: #00aeec; color: white; padding: 8px; border-bottom-right-radius: 8px; border-top-right-radius: 8px; cursor: pointer;" onclick="outSubtitle()">获取字幕</span>')
})
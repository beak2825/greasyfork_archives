// ==UserScript==
// @name         Azusa Upload Assistant
// @author       Beer
// @version      0.0.5
// @description  Assist with get information while uploading torrents for Azusa.
// @require      https://cdn.staticfile.org/jquery/1.7.1/jquery.min.js
// @match        https://azusa.ru/upload.php
// @match        https://www.azusa.wiki/upload.php
// @icon         https://azusa.ru/favicon.ico
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license      MIT
// @namespace    https://greasyfork.org/zh-CN/users/942532-beer
// @downloadURL https://update.greasyfork.org/scripts/452904/Azusa%20Upload%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/452904/Azusa%20Upload%20Assistant.meta.js
// ==/UserScript==
(() => {

    var entry = {
        title: '原名',
        chineseTitle: '中文名',
        author: '作者',
        complete: '是否完结',
        vol: 1,
        publisher: '出版商',
        img: '',
        desc: '',
        type: 0
    }

    /* utils */
    async function getWebInfo(url) {
        return new Promise( (resolve, reject) => {
            GM.xmlHttpRequest({
                method: "GET",
                url: url,
                responseType: "json",
                onload: function (response) {
                    resolve(response.responseText);
                },
                onerror: function (error) {
                    resolve('');
                }
            });
        });
    }

    function getInfoKV(node) {
        let infoKV = [];
        let key = node.find('span').text();
        infoKV.push(key);
        let value = ''
        node.contents().each( function () {
            console.log(this);
            console.log($(this).index());
            if(this.nodeType==3 || $(this).index() != 0) {
                value += $(this).text();
                console.log(value);
            }
        });
        value = value.replace('、', ' X ');
        infoKV.push(value);
        return infoKV;
    }

    async function getInfo() {
        let url = $('#bgmlink').val();
        if(!url.match(/https:\/\/bgm\.tv\/subject\/\d+/i)) {
            alert('请输入合法的链接');
        }
        let info = await getWebInfo(url);
        entry.title = $(info).find('.nameSingle a').text();
        let $infobox = $(info).find('#infobox');
        $infobox.find('li').each(function () {
            let infokv = getInfoKV($(this));
            if(infokv[0].match(/中文名/g)) {
                entry.chineseTitle = infokv[1];
            }
            else if(infokv[0].match(/中文名|作画|作者/g)) {
                entry.author = infokv[1];
            }
            else if(infokv[0].match(/册数/g)) {
                entry.vol = infokv[1];
            }
            else if(infokv[0].match(/出版社/g)) {
                entry.publisher = infokv[1];
            }
            else if(infokv[0].match(/游戏/g)) {
                entry.type = 404;
            }
        });
        entry.img = 'https:' + $(info).find('img.cover').attr('src').replace('cover/c/', 'cover/l/', 1);
        entry.desc = $(info).find('#subject_summary').text();
        $(info).find('.subject_tag_section a span').each(function () {
            if($(this).text().indexOf('已完结') != -1) {
                entry.complete = '完结'
            }
            else if($(this).text().indexOf('漫画') != -1) {
                entry.type = 402;
            }
            else if($(this).text().indexOf('小说') != -1) {
                entry.type = 403;
            }
            else if($(this).text().indexOf('画集') != -1) {
                entry.type = 407;
            }
        });
        console.log(entry);
        let title = '';
        if(entry.type == 402 || entry.type == 403) {
            title = '[' + entry.chineseTitle + '][' + entry.author + '][Vol.01-Vol.卷数]';
        }
        else {
            title = '[' + entry.chineseTitle + '][' + entry.author + ']';
        }

        let subtitle = entry.title + ' | ' + entry.complete + ' | 出版社';

        let desc = '[img]' + entry.img + '[/img]\n\n' + entry.desc;

        $title.val(title);
        $subtitle.val(subtitle);
        $desc.val(desc);
        $type.val(entry.type);
        $upvler.attr('checked', true);
    }

    /* key nodes */
    var $form = $('#compose');
    var $tbody = $form.find('tbody');
    var $torrentTr = $('#torrent').closest('tr');
    var $title = $('[name=name]');
    var $subtitle = $('[name=small_descr]');
    var $desc = $('[name=descr]');
    var $type = $('[name=type]');
    var $upvler = $('[name=uplver]');

    /* generate nodes */
    var $warning = $("<h3><font color='red'>请上传种子后再填写信息，否则标题可能被覆盖</font></h3>");
    var $qInfo = $('<tr><td class="rowhead nowrap" valign="top" align="right">BGM链接</td><td class="rowfollow" valign="top" align="left"><input type="text" style="width: 92%;" id="bgmlink" placeholder="https://bgm.tv/subject/123456"><br><font class="medium">例如：<b>https://bgm.tv/subject/149014</b></font></td></tr>');
    var $getInfo = $('<input type="button" value="辅助填写">');
    $getInfo.click(getInfo);
    $qInfo.find('#bgmlink').after($getInfo);

    /* change webpage */
    $warning.prependTo($form);
    $torrentTr.after($qInfo);
    $title.next().next().find('b').text('[中文名][作者][卷数(格式为Vol.01-Vol.xx)];画集或公式书:[原名][作者或出版社];游戏:[原名][中文名][制作方]');

})();

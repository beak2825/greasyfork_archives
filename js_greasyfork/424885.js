// ==UserScript==
// @name         Douban-Info-for-PTP
// @namespace    https://github.com/techmovie/Douban-Info-for-PTP
// @version      0.4
// @description  在电影详情页展示部分中文信息, 36行可以自定义跳转查询到某一个站点，因为当时发种大赛，暂时使用的柠檬
// @author       Mekio
// @match        http*://passthepopcorn.me/torrents.php?id=*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/424885/Douban-Info-for-PTP.user.js
// @updateURL https://update.greasyfork.org/scripts/424885/Douban-Info-for-PTP.meta.js
// ==/UserScript==
(function () {

    const DOUBAN_API_URL = 'https://frodo.douban.com/api/v2';
    const DOUBAN_API_URL_NEW = 'https://omit.mkrobot.org/movie/infos/';
    $(function () {
        const imdbLink = $('#imdb-title-link').attr('href');
        if (!imdbLink) {
            return
        }
        const imdbId = /tt\d+/.exec(imdbLink)[0];

        GM_xmlhttpRequest({
            method: 'GET',
            url: `${DOUBAN_API_URL_NEW}/${imdbId}`,
            onload(res) {
                const data = JSON.parse(res.responseText);
                console.log(data);
                addInfoToPage(data['data']);
            }
        })
    })

    const addInfoToPage = (data) => {

        if (isChinese(data.title)) {
            $('.page__title').prepend(`<a  target='_blank' href="https://lemonhd.org/torrents.php?search=${data.title}&search_area=0&suggest=0">[${data.title}] </a>`);
        }
        if (data.summary) {
            var tmp = data.summary.split('   ');
            data.summary = '';
            for (var i=0; i<tmp.length; i++){
                var tmp_str = tmp[i].trim();
                if (tmp_str){
                    data.summary += '\t' + tmp_str + '\n';
                }
            }
            $('#movieinfo').before(`<div class="panel">
            <div class="panel__heading"><span class="panel__heading__title">简介</span></div>
            <div class="panel__body"  id="intro">${data.summary}</div></div>`);
            $('#intro').css({'white-space': 'pre-wrap'})
        }
        $('#torrent-table').parent().prepend($('#movie-ratings-table').parent())
        try{
            $('#movieinfo').before(`
        <div class="panel">
		<div class="panel__heading"><span class="panel__heading__title">电影信息</span></div>
        <div class="panel__body">
        <div><strong>导演:</strong> ${data.director}</div>
        <div><strong>演员:</strong> ${data.cast}</div>
        <div><strong>类型:</strong> ${data.genre}</div>
        <div><strong>制片国家/地区:</strong> ${data.region}</div>
        <div><strong>语言:</strong> ${data.language}</div>
		<div><strong>时长:</strong> ${data.runtime}</div>
		<div><strong>又名:</strong>  ${data.aka}</div>
	    </div>`)
        } catch(err){}

        var total = 10;
        var split = '/';
        if (!data.average) {
            data.average = '暂无评分';
            total = '';
            data.votes = 0;
            split = '';
        }

        $('#movie-ratings-table tr').prepend(
            `<td colspan="1" style="width: 152px;">
            <center>
            <a target="_blank" class="rating" href="${data.link}" rel="noreferrer">
            <div style="font-size: 0;min-width: 105px;">
                <span class="icon-pt1" style="font-size: 14px;
                display: inline-block;
                text-align: center;
                border: 1px solid #41be57;
                background-color: #41be57;
                color: white;
                border-top-left-radius: 4px;
                border-bottom-left-radius: 4px;
                width: 24px;
                height: 24px;
                line-height: 24px;">豆</span>
                <span class="icon-pt2" style="font-size: 14px;
                display: inline-block;
                text-align: center;
                border: 1px solid #41be57;
                color: #3ba94d;
                background: #ffffff;
                border-top-right-radius: 4px;
                border-bottom-right-radius: 4px;
                width: 69px;
                height: 24px;
                line-height: 24px;">豆瓣评分</span>
            </div>
            </a>
            </center>
            </td>
            <td style="width: 153px;">
            <span class="rating">${data.average}</span>
            <span class="mid">${split}</span>
            <span class="outof"> ${total} </span>
            <br>(${data.votes} votes)</td>`
        )
    }
    const isChinese = (title) => {
        return /[\u4e00-\u9fa5]+/.test(title)
    }
})();
// ==UserScript==
// @name         豆瓣跳转至Emby
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  在豆瓣电影页面检查Emby中是否存在当前影视，若存在则显示跳转至Emby的按钮
// @author       Your name
// @match        https://movie.douban.com/*
// @match        *://m.douban.com/movie/subject/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      MIT
// @note         23-10-25 0.1 豆瓣跳转至Emby
// @note         23-10-25 1.0.0 修复年份查询不到问题
// @note         23-10-26 1.0.1 支持移动端
// @downloadURL https://update.greasyfork.org/scripts/478209/%E8%B1%86%E7%93%A3%E8%B7%B3%E8%BD%AC%E8%87%B3Emby.user.js
// @updateURL https://update.greasyfork.org/scripts/478209/%E8%B1%86%E7%93%A3%E8%B7%B3%E8%BD%AC%E8%87%B3Emby.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // emby地址
    const embyServer = 'http://192.168.123.8:58096'
    // emby api
    const embyApiKey = 'd54070cb3e4f4e99b0c557792608bba2'

    // 通过电影名称在Emby中进行检索
    function searchInEmby(movieName) {
        return searchEmbyByNameAndYear(movieName)
    }

    function httpRequest(options) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                ...options,
                onload: response => resolve(response),
                onerror: error => reject(error)
            });
        });
    }

    async function searchEmbyByNameAndYear(dbMovie) {
        const name = dbMovie.name;
        let yearParam = dbMovie.year ? `&Years=${dbMovie.year},${parseInt(dbMovie.year) - 1},${parseInt(dbMovie.year) + 1}` : '';
        let includeItemTypes = "IncludeItemTypes=movie";
        let ignorePlayed = "";

        // 删除季信息
        if (dbMovie.type === "tv") {
            yearParam = '';
            includeItemTypes = "IncludeItemTypes=Series";
        }

        const url = `${embyServer}/emby/Items?api_key=${embyApiKey}${ignorePlayed}&Recursive=true&${includeItemTypes}&SearchTerm=${name}${yearParam}`;
        const response = await httpRequest({method: 'get', url});
        const data = JSON.parse(response.responseText);

        if (response.status === 200 && data.TotalRecordCount > 0) {
            for (let i = 0; i < data.Items.length; i++) {
                const item = data.Items[i];
                if (item.Name === name) {
                    return item;
                }
            }
            return null;
        } else {
            return null;
        }
    }

    function formatTvName(name) {
        return name.replace(/ 第[一二三四五六七八九十\d]+季/g, '')
    }


    // 获取当前电影名称
    function getMovieName() {
        if (isPc()) {
            let title = document.querySelector('title').innerText.replace(/(^\s*)|(\s*$)/g, '').replace(' (豆瓣)', '');
            const subject = document.querySelector('.year').textContent.replace('(', '').replace(')', '');
            const type = answerObj.TYPE;
            if (type === "tv") {
                title = formatTvName(title);
            }
            return {name: title, year: subject, type: type};
        } else {
            const titleArr = document.querySelector('.sub-original-title').textContent.split('（')
            let title = titleArr[0]
            let year = titleArr[1].split('）')[0]
            let type = subject.type
            if (type === "tv") {
                title = formatTvName(title);
            }
            return {name: title, year: year, type: type};
        }

    }

    function isPc() {
        return location.hostname === 'movie.douban.com';
    }

    // 添加一个按钮跳转到Emby
    async function addEmbyButton() {
        let movieName = getMovieName();


        const embyInfo = await searchInEmby(movieName);
        if (movieName && embyInfo) {
            // pc端
            if (isPc()) {
                const subjectwrap = document.querySelector('h1');
                const embyButton = document.createElement('span');
                subjectwrap.appendChild(embyButton);
                embyButton.insertAdjacentHTML('afterend', createSvg(embyInfo, 'pc'))
            } else {
                // 移动端
                const subjectwrap = document.querySelector('.sub-title');
                if (!subjectwrap) {
                    return;
                }
                const sectl = document.createElement('span');
                subjectwrap.appendChild(sectl);
                sectl.insertAdjacentHTML('afterend',
                    createSvg(embyInfo, 'm')
                );
            }
        }
    }

    function createSvg(embyInfo, platform) {
        let style = ''
        if (platform == 'pc') {
            style = '.cupfox:hover{background: #fff!important;}'
        }
        return `<style>.cupfox{vertical-align: middle;}${style}</style>
            <a href="${embyServer}/web/index.html#!/item?id=${embyInfo.Id}&serverId=${embyInfo.ServerId}" class="cupfox" target="_blank">
            <svg fill="#52b54b" width="23px" height="23px" viewBox="0 0 24.00 24.00" role="img" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M11.041 0c-.007 0-1.456 1.43-3.219 3.176L4.615 6.352l.512.513.512.512-2.819 2.791L0 12.961l1.83 1.848a3468.32 3468.32 0 0 0 3.182 3.209l1.351 1.359.508-.496c.28-.273.515-.498.524-.498.008 0 1.266 1.264 2.794 2.808L12.97 24l.187-.182c.23-.225 5.007-4.95 5.717-5.656l.52-.516-.502-.513c-.276-.282-.5-.52-.496-.53.003-.009 1.264-1.26 2.802-2.783 1.538-1.522 2.8-2.776 2.803-2.785.005-.012-3.617-3.684-6.107-6.193L17.65 4.6l-.505.505c-.279.278-.517.501-.53.497-.013-.005-1.27-1.267-2.793-2.805A449.655 449.655 0 0 0 11.041 0zM9.223 7.367c.091.038 7.951 4.608 7.957 4.627.003.013-1.781 1.056-3.965 2.32a999.898 999.898 0 0 1-3.996 2.307c-.019.006-.026-1.266-.026-4.629 0-3.7.007-4.634.03-4.625z"></path></g></svg>
            </a>
            `
    }

    // 在页面加载完成后添加按钮
    window.onload = function () {
        addEmbyButton();
    };
})();

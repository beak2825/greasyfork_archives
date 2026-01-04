// ==UserScript==
// @name         豆瓣跳转至Emby (账号密码版)
// @namespace    http://tampermonkey.net/
// @version      x.1.0.5
// @description  在豆瓣电影页面检查Emby中是否存在当前影视，若存在则显示跳转至Emby的按钮
// @author       leftyzzk
// @match        https://movie.douban.com/*
// @match        *://m.douban.com/movie/subject/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      *
// @license      MIT
// @note         23-10-25 0.1 豆瓣跳转至Emby
// @note         23-10-25 1.0.0 修复年份查询不到问题
// @note         23-10-26 1.0.1 支持移动端
// @note         25-03-28 x.1.0.2 改为使用账号密码认证
// @note         25-03-28 x.1.0.3 使用脚本存储,防止更新覆盖
// @note         25-03-31 x.1.0.4 修复移动端外语片不兼容的问题
// @note         25-03-31 x.1.0.5 修复存储覆盖问题
// @downloadURL https://update.greasyfork.org/scripts/531095/%E8%B1%86%E7%93%A3%E8%B7%B3%E8%BD%AC%E8%87%B3Emby%20%28%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531095/%E8%B1%86%E7%93%A3%E8%B7%B3%E8%BD%AC%E8%87%B3Emby%20%28%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let myEmbyServer = ''; // emby地址
    let myEmbyUsername = ''; // emby 账号
    let myEmbyPassword = '';

    let embyServer = myEmbyServer ? myEmbyServer : GM_getValue('embyServer');
    let embyUsername = myEmbyUsername ? myEmbyUsername : GM_getValue('embyUsername');
    let embyPassword = myEmbyPassword ? myEmbyPassword : GM_getValue('embyPassword');
    GM_setValue('embyServer', embyServer);
    GM_setValue('embyUsername', embyUsername);
    GM_setValue('embyPassword', embyPassword);

    // 存储访问令牌
    let accessToken = '';

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

    // 登录并获取访问令牌
    async function authenticateEmby() {
        const authUrl = `${embyServer}/emby/Users/AuthenticateByName`;
        const authData = {
            Username: embyUsername,
            Pw: embyPassword
        };

        try {
            const response = await httpRequest({
                method: 'POST',
                url: authUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Emby-Authorization': 'MediaBrowser Client="DoubanToEmby", Device="Browser", DeviceId="TM-Script", Version="1.0.2"'
                },
                data: JSON.stringify(authData)
            });

            if (response.status === 200) {
                const data = JSON.parse(response.responseText);
                accessToken = data.AccessToken;
                return accessToken;
            } else {
                console.error('Emby登录失败:', response.statusText);
                return null;
            }
        } catch (error) {
            console.error('Emby登录错误:', error);
            return null;
        }
    }

    async function searchEmbyByNameAndYear(dbMovie) {
        // 确保有访问令牌
        if (!accessToken) {
            await authenticateEmby();
            if (!accessToken) {
                return null; // 认证失败
            }
        }

        const name = dbMovie.name;
        let yearParam = dbMovie.year ? `&Years=${dbMovie.year},${parseInt(dbMovie.year) - 1},${parseInt(dbMovie.year) + 1}` : '';
        let includeItemTypes = "IncludeItemTypes=movie";
        let ignorePlayed = "";

        // 删除季信息
        if (dbMovie.type === "tv") {
            yearParam = '';
            includeItemTypes = "IncludeItemTypes=Series";
        }

        const url = `${embyServer}/emby/Items?Recursive=true&${includeItemTypes}&SearchTerm=${name}${yearParam}`;
        const response = await httpRequest({
            method: 'get',
            url,
            headers: {
                'X-Emby-Token': accessToken
            }
        });

        // 如果认证失效，重新认证并尝试
        if (response.status === 401) {
            accessToken = await authenticateEmby();
            if (accessToken) {
                return searchEmbyByNameAndYear(dbMovie); // 重试
            }
            return null;
        }

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
        return name.replace(/ 第[一二三四五六七八九十\d]+季/g, '') // 移除中文季数
                   .replace(/\s*[Ss]eason\s*\d+\b/gi, '') // 移除英文 Season 1, SEASON 2, season 10
                   .trim(); // 去掉前后多余空格
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
            let title = document.querySelector('.sub-title').textContent.split('（')[0];
            let year = document.querySelector('.sub-original-title').textContent.split('（')[1].split('）')[0];
            let type = subject.type;
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

        // 确保登录
        if (!accessToken) {
            await authenticateEmby();
        }

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

// ==UserScript==
// @name         Bilibili显示当前视频字幕
// @namespace    https://space.bilibili.com/526552477
// @version      2.8
// @description  获取当前视频的字幕，弹窗直观显示所有字幕，方便快速遍览字幕，切换字幕，按字幕找对应视频时间点。增加导出字幕txt按钮
// @match        https://www.bilibili.com/video/av*
// @match        https://www.bilibili.com/video/BV*
// @icon         data:image/x-icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAABMLAAATCwAAAAAAAAAAAAD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A1qEAANahAADWoQAG1qEAb9ahAMvWoQD01qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD01qEAy9ahAG/WoQAG1qEAANahAADWoQAA1qEAG9ahAM/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahANDWoQAb1qEAANahAAfWoQDQ1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahANHWoQAH1qEAbtahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAG7WoQDH1qEA/9ahAP/WoQD/1qEAtdahABjWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahABvWoQC11qEA/9ahAP/WoQD/1qEAx9ahAPnWoQD/1qEA/9ahAP/WoQAZ1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahABjWoQD/1qEA/9ahAP/WoQDz1qEA/9ahAP/WoQD/1qEA/9ahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAErWoQDn1qEA5NahAErWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAErWoQDn1qEA5NahAErWoQAA1qEAANahAADWoQAA1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEA5tahAP/WoQD/1qEA59ahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEA5tahAP/WoQD/1qEA59ahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEA5tahAP/WoQD/1qEA5tahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEA5tahAP/WoQD/1qEA5tahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAADWoQAA1qEAANahAADWoQBJ1qEA5tahAObWoQBJ1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQBJ1qEA5tahAObWoQBJ1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEA+dahAP/WoQD/1qEA/9ahABnWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAGdahAP/WoQD/1qEA/9ahAPjWoQDH1qEA/9ahAP/WoQD/1qEAttahABnWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahABnWoQC21qEA/9ahAP/WoQD/1qEAx9ahAG3WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQBt1qEABtahAM/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA0NahAAfWoQAA1qEAG9ahAM/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAM/WoQAb1qEAANahAADWoQAA1qEABtahAG7WoQDH1qEA89ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA89ahAMfWoQBu1qEABtahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEADtahAMXWoQD/1qEA/9ahAP/WoQD/1qEAxdahAA/WoQAA1qEAANahAADWoQAA1qEADtahAMXWoQD/1qEA/9ahAP/WoQD/1qEAxdahAA/WoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAAbWoQDF1qEA/9ahAP/WoQD/1qEA/9ahAMXWoQAP1qEAANahAADWoQAA1qEAANahAADWoQAA1qEADtahAMXWoQD/1qEA/9ahAP/WoQD/1qEAxdahAAbWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAYtahAP/WoQD/1qEA/9ahAP/WoQDF1qEADtahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEADtahAMXWoQD/1qEA/9ahAP/WoQD/1qEAY9ahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQBf1qEA/9ahAP/WoQD/1qEAxdahAA7WoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEADtahAMXWoQD/1qEA/9ahAP/WoQBf1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAATWoQCg1qEA6tahAKjWoQAO1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEADtahAKjWoQDr1qEAoNahAATWoQAA1qEAANahAADWoQAA1qEAAP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A///////////AAAADgAAAAQAAAAAAAAAAA///wAf//+AP///wD///8A////AP///wDw/w8A8P8PAPD/DwDw/w8A8P8PAPD/DwD///8A////AH///gA///wAAAAAAAAAAAgAAAAcAAAAP8A8A/+AfgH/gP8B/4H/gf+D/8H/////8=
// @author       Scipline
// @connect      api.bilibili.com
// @connect      aisubtitle.hdslb.com
// @grant        GM_addStyle
// @run-at       document-end
// @grant GM_download
// @grant GM_xmlhttpRequest
// @license Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/463164/Bilibili%E6%98%BE%E7%A4%BA%E5%BD%93%E5%89%8D%E8%A7%86%E9%A2%91%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/463164/Bilibili%E6%98%BE%E7%A4%BA%E5%BD%93%E5%89%8D%E8%A7%86%E9%A2%91%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==
GM_addStyle(`
    button {
        background-color: #008CBA;
        color: white;
        border: none;
        padding: 13px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 13px;
        margin: 4px 2px;
        cursor: pointer;
    }
    #summary {
        position: fixed;
        top: 70px;
        left: 20px;
        max-height: 400px;
        width: 300px;
        background-color: white;
        border: 1px solid gray;
        padding: 10px;
        box-shadow: 5px 5px 5px gray;
        z-index: 999;
        overflow-y: auto;
    }
    #summary a {
        color: #008CBA;
        text-decoration: underline;
    }
`);
(async function () {
    'use strict';

    // 确保视频标题元素存在
    const videoTitleElement = document.querySelector("h1.video-title");
    if (!videoTitleElement) {
        console.error("视频标题元素未找到");
        return;
    }
    // 创建按钮并绑定点击事件

    var button = document.createElement("button");

    button.innerHTML = "显示字幕";
    button.style.position = "fixed";
    button.style.top = "60px";
    button.style.right = "20px";
    // videoTitleElement.parentNode.insertBefore(button, videoTitleElement.nextSibling); // 将按钮放在视频标题的右侧
    document.body.appendChild(button);

    // 创建弹窗内容
    var summary = document.createElement('div');
    summary.id = 'summary';
    summary.style.display = 'none';
    summary.style.position = 'fixed';
    // summary.style.top = '60px';
    // summary.style.right = '20px';
    // summary.style.width = '260px';
    // summary.style.height = '350px';
    summary.style.overflow = 'auto';

    // 添加弹窗到页面
    document.body.appendChild(summary);

    // 定义全局变量
    let subtitleText = [];
    let avid = null;
    let bvid = null;
    let title = null;
    let subtitleContent = ''; // 存储字幕内容
    const exportButton = document.createElement("button");
    // 绑定按钮点击事件
    button.addEventListener('click', async function () {

        if (summary.style.display === 'none') {
            if (subtitleText.length > 0 && document.querySelector("#viewbox_report > h1").innerText === title) { // 如果已经获取过字幕内容，则直接显示
                summary.style.display = 'block';
                button.innerHTML = "隐藏字幕";
            } else {
                try {
                    // 获取所有字幕
                    const subtitleJson = await getSubtitleJSON();
                    const subtitles = subtitleJson.data.subtitle.subtitles;
                    const tabCount = subtitles.length;
                    // 创建选项卡和字幕内容到弹窗
                    const tabsHTML = [];
                    const subtitlesHTML = [];
                    if (tabCount === 0) {
                        alert("当前视频没有找到字幕");
                        return;
                    }
                    for (let i = 0; i < tabCount; i++) {
                        tabsHTML.push(`<button class="tablinks${(i === 0) ? ' active' : ''}" onclick="openTab(event, 'subtitle${i}')">字幕${i + 1}</button>`);
                        subtitleText = await getSubtitleText(subtitles[i].subtitle_url);
                        subtitlesHTML.push(`<div id="subtitle${i}" class="tabcontent-container"${(i === 0) ? ' style="display:block;"' : ''}>${subtitleText}</div>`);
                        title = document.querySelector("#viewbox_report > h1").innerText;
                    }
                    summary.innerHTML = `
                        <div class="tab">
                            ${tabsHTML.join('')}
                        </div>
                        ${subtitlesHTML.join('')}
                    `;
                    // 显示弹窗和第一个字幕
                    summary.style.display = 'block';
                    button.innerHTML = "关闭字幕";
                    // 绑定超链接点击事件
                    const currentvideo =document.querySelector('video');
                    // 超链接方式刷新当前页面打开
                    // window.open(link.getAttribute('href'), '_self');
                      // 添加导出按钮

        exportButton.innerHTML = "导出为txt";
        exportButton.onclick = function () {
            const blob = new Blob([subtitleContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = title + '.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };
        summary.appendChild(exportButton);
                    summary.querySelectorAll('a')
                        .forEach(function (link) {
                            link.addEventListener('click', function (e) {
                                // 阻止默认行为
                                e.preventDefault();
                                // 如果链接的 href 属性包含 "?t="，说明有指定时间点
                                if (this.href.indexOf("?t=") !== -1) {
                                    // 使用正则表达式匹配 t= 后面的数字并取出
                                    const regex = /\?t=(\d+)/;
                                    const match = regex.exec(this.href);
                                    // 如果成功匹配到了数字，就将其赋值给 startTime 变量，并打印输出
                                    if (match !== null && match[1] !== undefined) {
                                        const startTime = parseInt(match[1]);
                                        // 执行 JavaScript 代码
                                        eval(`document.querySelector('video').currentTime=${startTime};`);
                                    }
                                }
                            });
                        });
                } catch (error) {
                    // 显示错误信息
                    alert(error.message);
                }
            }
        } else {
            // 隐藏弹窗
            summary.style.display = 'none';
            button.innerHTML = "显示字幕";
        }

    });

    // 获取视频所有字幕的 JSON 数据
    async function getSubtitleJSON() {
        return new Promise((resolve, reject) => {
            const url = window.location.href;
            const avidRegex = /\/av([0-9]+)\//;
            const bvidRegex = /\/(BV[0-9a-zA-Z]+)\/?/;
            const avidMatch = url.match(avidRegex);
            const bvidMatch = url.match(bvidRegex);
            avid = avidMatch ? avidMatch[1] : null;
            bvid = bvidMatch ? bvidMatch[1] : null;

            // 构造获取视频信息的 API 链接
            let apiLink;
            if (avid) {
                apiLink = 'https://api.bilibili.com/x/player/pagelist?aid=' + avid;
            } else if (bvid) {
                apiLink = 'https://api.bilibili.com/x/player/pagelist?bvid=' + bvid;
            }


            // 发送获取视频信息的请求
            GM_xmlhttpRequest({
                method: 'GET',
                url: apiLink,
                onload: function (response) {
                    if (response.status === 200) {
                        const responseJson = JSON.parse(response.responseText);
                        const cid = responseJson.data[0].cid;

                        // 构造获取字幕链接的 API 链接
                        let subtitleLink = 'https://api.bilibili.com/x/player/v2?';
                        subtitleLink += 'cid=' + cid;
                        if (avid) {
                            subtitleLink += '&aid=' + avid;
                        } else if (bvid) {
                            subtitleLink += '&bvid=' + bvid;
                        }
                        subtitleLink += '&qn=32&type=&otype=json&ep_id=&fourk=1&fnver=0&fnval=16';

                        // 发送获取字幕链接的请求
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: subtitleLink,
                            onload: function (subtitleResponse) {
                                if (subtitleResponse.status === 200) {
                                    const subtitleJson = JSON.parse(subtitleResponse.responseText);
                                    resolve(subtitleJson);

                                } else {
                                    reject(new Error('获取字幕链接失败'));
                                }
                            }
                        });
                    } else {
                        reject(new Error('获取视频信息失败'));
                    }
                }
            });
        });
    }


    // 发送获取字幕文件内容的请求
    function getSubtitleText(subtitleUrl) {
        return new Promise((resolve, reject) => {
            subtitleUrl = "https://"+subtitleUrl;
            GM_xmlhttpRequest({
                method: 'GET',
                url: subtitleUrl,
                responseType: 'json',
                onload: function (response) {
                    if (response.status === 200) {
                        let count = 1;
                        const subtitles = response.response.body;
                        // 全部字幕内容
                        subtitleContent = subtitles.map(subtitle => subtitle.content).join(',');
                        // console.log(subtitleContent)
                        const subtitleText = subtitles.map(subtitle => {
                            // 部分字幕可能没有subtitle.sid参数，手动编号
                            const sid = count++;
                            const startTime = formatTime(subtitle.from);
                            const endTime = formatTime(subtitle.to);
                            const videourl = `https://www.bilibili.com/video/${avid ? 'av' + avid : bvid}?t=${Math.floor(subtitle.from)}`;
                            return `
              <div>
                <p>字幕序号：${sid}</p>
                <p>字幕内容：${subtitle.content}</p>
                <a href="${videourl}" target="_self">时间点：${startTime} - ${endTime}</a><br/>
              </div>
            `;
                        })
                            .join('');
                        resolve(subtitleText);
                    } else {
                        reject(new Error('获取字幕文件内容失败'));
                    }
                }
            });
        });
    }

    // 格式化时间，将秒数转化为分钟
    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        let seconds = Math.floor(time % 60);
        seconds = seconds < 10 ? '0' + seconds : seconds;
        return minutes + ':' + seconds;
    }


})();
// 切换选项卡显示对应的字幕
unsafeWindow.openTab = function (evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent-container");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName)
        .style.display = "block";
    evt.currentTarget.className += " active";
};
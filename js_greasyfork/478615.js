// ==UserScript==
// @name         视频工具
// @namespace    https://www.cdzero.cn
// @author       Zero
// @version      1.0.3
// @description  视频播放工具，一键倍速、小窗！
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAADfZJREFUeF7tnXuMFdUdx7+/ucsCGy24KwW0tmraqJDWKipQZbl3ZqPQYKux1FdTRdNUbZOq/xT7h2J8YaItja341jUSiwSVFLOAO7PDAl0QaY2JKzRaxAewKguoWdjHnV9z5t673H1xZ+bO69ydSW5usvec3/n9fuezZ87zdwgV+PAll5yEqqrpUJRzAIjP2QBqQVQD5hr7GxCfCXnzDwPoAnMXiHLfQCeAnQDeB3M7envbafPmg5XmLqoEg1jTMmCeC2AOgOkgmhyIXcwdAN4DsAmKYlJzsxlIOSEKlQ4ATqfHQVF+AqK5dqUTzQIwNkSfFRfVDeatAEwBBPr6tpJpHo1IF0/FSgEAAwo0TQXzLwFcCaKTPVkbdCbmL0H0KizrFbS0tBBgBV1kufJjC4Bd6ZmMaNIXgugqEE0p19hQ8zPvB/NqKMpK6PqWuMIQSwBY0xaAeTGILg610oIrbDOYHyTDaAquCG+SYwMAL1yYQmfnNQD+COCH3syJeS7mdwEsRV3dK7RqVTYO2sYCAM5kLgPRMhCJ4VrlP8w7wXw7tbSsj9rYSAHgTOYsKMoyAPOidkRE5a9Db+9t1Nq6O6LyEQkAfPHFJ2LcuPvBfBuIqqIyPibldgP4M44efYi2bPk6bJ1CBSA/nFsE5gcCm6wJ24N+lZebZLoLhtEY5oghNABY0yaDeaU9gZM8I3uAeSN6eq4Ma9o5FABYVesBiMqXaywfHagfA/gF6fr2oFUIFAAGCJnMYijKfQBSQRtTYfJ7ANxJuv73IO0KDAB7XH/gwHIQ/SZIAypeNvPTqKu7Nah5g0AA4GnTqjF16moACyq+gsIxcC327buK2ttFq+Dr4zsA3NAwAZb1Gogyvmo62oUxt+Dw4QW0Y4fYq+Db4ysAPGfOJFRX6xU7leub2z0KYn4Lvb0LaNOmLzxKGJLNNwA4nf4OFKUFRN/3S7lEzjAeYP4AlpUh0/zUD//4AgDPnl2LmhoxZDnTD6USGSU8wPwhjhy5iNraxLa1sp6yAeB0+gSkUgaAC8vSJMnszgPidWBZGpnmN+4yDkxdFgD5JdxmAOlylEjyevQAs4G6ukvLGSJ6BsCe5FHVFSC61qP6STY/PMD8Egzj1wSwF3HeAVDVJSC6x0uhSR6fPcB8LxnGEi9SPQHAmcxcKIp47yteCk3y+O4BC0Sal23qrgHgSy/9Nvr63k2Wc32vxPIEiuXkqqof0YYNn7sR5AoA+72vaeI/P+n0ufFyWGnFbKFhaG76A+4AUNWlIBKbNpMnrh5w2R9wDACr6vkgeitZ1o1rzffrlUU2O4tM820nmjoCwN7KpapvgWiGE6FJmsg9sB26PsvJ1jJnAKjq7SD6S+RmJQo49wDzrWQYT5TKUBIAe55//Pg9IDqhlLDk9xh5IHdO8WzS9QPH06o0AJr2AoAbYmRaoopzDzSSrt/oGYD8hI/0Z+Cd+6sCUzJrZBhi6D7sc9wWgFV1K4hmVqBbRo9JzNvIMEQMBXcAcENDGmJiIXnk9wBRZqRp4hFbANa0dQAuk9/6xAIA60nXhz1/OSwAnMnMANF2EJXsJCbulcADzAzLumi4yaHhAdC0fwC4WgLTEhWde2Al6bqIvzDgGQIA19f/AFVV7VKc2q2tBW6+GZg5E+jsBNasAd54w7lLRlNK5j4QTSdd/2+x2UMBkGWjx6mnAo88AkyaNLAaP/sMeOYZYNOm0VS9zmwdZqFoOAB2gugsZxIjTHXTTcB1142swK5dwOOPA++JsH7JY3uAeRcZxoAoLAMA4HT6x0il/iOFux5+GJjhYG2qrQ14+mngY3HgNnmQzZ5HpvlOwRMDAVBVEafnD1K46bHHgHNEFFgHj2UBGzYAzz8PHDju1LgDYZInYf4rGcbtQwDgdLoKirIXRINeqjE12A0ABRO6u4FXXwVefhno8vWIXUydNIxazB1kGP1xGvpbAOlm/rwAUPDHV18BK1bkRg19ffJUnl+aFs0MHgNAlt5/wQnlAFCQsX9/7rUg1krY07Z6v6okXDlFo4FiAEyp4vf4AUDB7R98kBsxvCviOI6Ch3kjGYa9sdcGIB/Q4asIo26797qfABRK37EDWL4c+Ogj9/rIlIP5KMaOnUhNTd05AGRc+QsCANsZnHsliMmkL3w7hh8/PPL9gBwAMm73DgqA4qpavRp46SXg69DjNwYPTL4fUADgHRCdG3ypPpYQBgBCXVH5YsTw+uuVNWLI9wMoH71TBB+SK4xbWAAUjxjEa8GskB1yYnGorm4ccTp9OlKpyIIVe24TwgagoKhYYxBl7xT3SUn+ZLNnkJQdQOH3qAAo1PnmzcBTTwF798pLgegIsqreAqLl0lkRNQDCYWIWce1a4MUXATG7KNvDvEgAIM8CULGD4wBAQR+xriDWF8Soocf3WI7BYSVGAqxprwP4eXClBCQ5TgAUTPz889zUcnOzLFPLK0ULIOfe/zgCUABh925g2bL4b0YRQ0FWVfnmAOLQCXTSsG3blpta/tSXmI5OSnSXRhwaYVWVYwvYYNPi3AIU6yo2ozQ15V4Nhw65q6CgU4stYqyq+6WM9yMLAIVKFJV/xx3AJ58EXa3O5TPvEZ1AgWXhFm3nmaNOKRsAwl8dHcD110ftuWPli91BrGnisuOoLl/27gwZARDW3nADILaux+PpTgAIuyIWLYrTa6A76QOECYDYX3BtjCLr2q8AVf0IRN8L0w++lCXbK+DwYeDOO4E9e3wx3xchdicwGQb64ssRhRSGgS+8ABw8GGxZbqXnh4HJTKBbxzlNLyaCnnwyvqeS7IkgWQNBxPkVIKaChX7x32W8XgAgZxSwOAIgOnnPPSfTYlCj6APIGfc/TgBIvRysqjeC6Hmnr7XYpIsDANlsbkNIY6OcG0KAa8WewFlIpdpiU7FOFYkagErYEiaOinM6PRGpVMzGJw4oiAqAytoUelLuXICMC0JhAyAOklbWtnD7mHjhYIhcB0MFtWEBUOkHQ+wWQMaRQBgAvPZabsdvxR8NSw6HFq+Rj8LDofPnj0V39yEQjXPQ/YpHkiBagNF6PDz/GpCrH+AnAPJM3frzzzc4QISU/QA/AEhCxOQihOSHgiKadJM/iIUgpRwAkiBR/eHjjwGQCxN3UJq7gbwAkISJEyeWvoBlnUKmaYdHGxgoUqaVQTcAJIEii5vkJ0nXbyn8YSAAMg0Hly4FLrig9Ltmyxbg2WfjuymjtAX+phh0e8jQYNGa9iGAM/0tNQBpYnft8fbYJ8Gih3P6btL1AXUrd7j4Rx8FTj55oKH79uUCNyTh4ocC4ChcfH39Gaiq+lCK62KSCyOcN625a2POJNMcEAQxuTLGuQtlT+nsyhh7TiC5NEr2yh6ov/jvV5QZ1Nw85C6I5Nq4yqrqkaxZQ7p+xXA/jgyATEPC0VGJ3q3MZmeTaW51BUB+fUDOQyPeXVV5OYsWftwDoGkNAN6sPK+MIoss6wJqadkxksUlbwbl5BJJmWkp7/p4+zVQX38aqqreA9GJMnti1OnO/DWIziBdP+4tWSVbgHxfYDGIHhp1TpTZYOY7yDCWlTLBGQDTplVj6lQxhpxWSmDyeww8wLwLhjGNAKuUNo4AsFsBTZNrw0gpyyv590Erfscz1TEAeQieAPDbSvad9LYNuhiylD3uABC7hlKpfwG4sJTg5PcIPMC8A5Y1q7Dbx4kGrgDIdwhFPCERXnaikwKSNCF5gPkQFOVcam52dUmyawBsCDKZn0FR1oRkWlKMMw9cTrq+1lnSY6k8AZBvCeS8Z8Cth2RI7/K9X2ySdwAWLkyhs1PcNbBABh9VsI5rUVt7Ba1alfVio2cA7FZAHCnr6dmUdAq9uN6XPCaqq+eJG0C9SisLABuC2bNrMX58K4ime1UiyefJA9uRzapkmt94yp3PVDYANgRz5kxFdfVmKXYTl+Ot+OT9H7q6LqS2ts5yVfIFABsCsZl0zBgBwSnlKpXkP64H9qK39xJqbfXlrkffAMi3BJMwZsxaEF2UVGIgHngb2ex8Ms0v/ZLuKwA2BDNm1GDCBAFBxi8lEzn2reZNOHLkKmprO+KnP3wHwIZArB5OmdIIomv8VHbUymJeBcO4xsnqnlsfBQKADYE4eJrJLIai3CfdxdRuvRhc+iyY74FhPEi2S/1/AgOgoCqraj2AlSCa4r/6FSyReT+Aq8kwWoO0MnAA7NZA0yaDWUAwN0hjKka2eN8TLSJd7wjaplAAsCHITR3fB2axvSy0coN2oM/yA2/yB+sbekWwps0G899AdL7PzpNbHPO/QfR70vVQ4zaHDkC+g6hAVX8HovsBfEvumitbe3Hv/N3Q9ceC6OWX0i4SAPo7iOn0FKRSYufq1aUUrbjfxYFNoBGWdReZpujwRfJECkA/CA0N58GyHgDR/Ei8EH6h60D0p+FO64atSiwAKGoRZkFR7q5gENYhm713pIOaYVe+KC9WAPSDkMnMhKIsBZCOwikBlGnCshZTS8u2AGSXJTKWABSBMBeKskRiEETFL6GWlo1l1VKAmWMNQD8IYm1h8uTLoSi/AvBTANUB+sS7aGZxEfc/wbwCHR1N1N7e411YODmlAKDYFZxOn4BUShxbnwfmeZFfe8u8B0TrwbwOlvVmuTt0wqn2Y6VIB8BgB3E6fTYURYAggJgbeMh78V9OtNGu8L6+9dTa+n7YleZnedIDMASIhobvglkcXvle/vt0EJ0G5okgqgFzjf0NiM+EfP7DALrA3AWiwvchMH8CQNz23P8hw4jR7c/lo/B/qWZElivwcXwAAAAASUVORK5CYII=
// @match        *://*/*
// @connect      greasyfork.org
// @run-at       document-body
// @grant        GM_info
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478615/%E8%A7%86%E9%A2%91%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/478615/%E8%A7%86%E9%A2%91%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    addBodyCSS();
    const host_url = window.location.host; //获取host
    // 创建设置按钮
    const state = ['❌ ', '✅ ']
    function SwitchPrompt(name, saveName, initial = 1, click) {
        const config = GM_getValue(saveName, {});
        const switchNum = config[host_url] || 0;
        GM_registerMenuCommand(state[switchNum] + name, () => { SwitchPrompt(name, saveName, initial, true) }, "");
        if (!!click) {
            if (switchNum === 1) {
                delete config[host_url];
                GM_setValue(saveName, config);
            } else {
                config[host_url] = 1
                GM_setValue(saveName, config);
            }
            location.reload();
        }
        return switchNum;
    }

    // 重写存储器
    function GET_DATA(name) {
        return GM_getValue(name);
    }
    function SET_DATA(name, data) {
        return GM_setValue(name, data);
    }

    // 跨域的网络请求
    function GM_XHR({ how, url, data, header, timeout = 10000 }, fun) {
        let headers = {}
        headers["Content-Type"] = "application/json";
        for (let head in header) {
            if (header.hasOwnProperty(head)) {
                headers[head] = header[head];
            }
        }
        GM_xmlhttpRequest({
            method: how,
            url: url,
            data: data,
            headers: header,
            timeout: timeout,
            onload: function (data) {
                if (data.readyState == 4) {
                    fun(data);
                }
            },
            onerror: function (error) {
                fun(error);
            },
            ontimeout: function (data) {
                fun(data);
            },
        })
    }

    //气泡提示
    async function Bubble_Msg(a, b, c, div = document.BubbleDiv) {
        if (!!div) { div.remove(); }
        div = await AddDOM({
            "addNode": document.body,
            "addData": [{
                "name": "div",
                "id": `bubble_center`,
                "add": [{
                    "name": "div",
                    "id": `bubble_msg_main`,
                    "add": [{
                        "name": "div",
                        "id": `bubble_msg_ico`,
                        "innerHTML": a
                    }, {
                        "name": "div",
                        "id": `bubble_msg_text`,
                        "innerHTML": b
                    }]
                }, {
                    "name": "style",
                    "innerHTML": `#bubble_center{
                        animation:fadenum_in ${c}s 1;
                        animation-iteration-count: 1
                    }
                    @keyframes fadenum_in{
                        0%{opacity: 0; top:0px;}
                        ${0.5 / c * 100}%{opacity: 1; top:15px;}
                        ${(c - 1) / c * 100}%{opacity: 1; top:15px;}
                        100%{opacity: 0; top:0px;}
                    }`
                }]
            }]
        }, 0);
        document.BubbleDiv = div;
        setTimeout(function () {
            div.remove();
        }, (c * 1000) + 500)
        return div;
    }

    // 节点创建函数
    async function AddDOM({ addNode, addData }, first = true) {
        let All = [];
        for await (const dom of addData) {
            const elem = document.createElement(dom.name); //创建元素
            const keys = Object.keys(dom);
            for await (const key of keys) {
                switch (key) {
                    case 'name':
                        break;
                    case 'click':
                        elem.addEventListener("click", dom[key], false);
                        break;
                    case 'function':
                        dom[key](elem);
                        break;
                    default:
                        if (key !== 'add') {
                            elem[key] = dom[key];
                        }
                        break;
                }
            }
            All.push(elem);
            if (!!addNode) {
                addNode.appendChild(elem);
            }
            //循环添加子元素
            if (!!dom.add && dom.add.length > 0) {
                await AddDOM({
                    "addNode": elem,
                    "addData": dom.add
                });
            }
        }
        let outDoc = addNode;
        if (typeof first === "number") {
            outDoc = All[first];
        }
        if (first === "all") {
            outDoc = All;
        }
        return outDoc;
    }

    // 节流函数
    function throttle(func, delay) {
        let timeout;
        let previous = 0;
        return function () {
            const now = Date.now();
            const remaining = delay - (now - previous);
            if (remaining <= 0) {
                clearTimeout(timeout);
                func.apply(this, arguments);
                previous = now;
            } else if (!timeout) {
                timeout = setTimeout(() => {
                    clearTimeout(timeout);
                    func.apply(this, arguments);
                    previous = Date.now();
                }, remaining);
            }
        };
    }

    // 运行主程序
    let runPlug = false;
    if (window === window.top) {
        const webAuth = SwitchPrompt('当前网站权限', 'webAuth', 0);
        if (!!webAuth) {
            versionPlug();
            SmallVideoPlug();
        }
        setInterval(() => {
            const iframe = document.querySelectorAll('iframe');
            for (const list of iframe) {
                list.contentWindow.postMessage({ name: 'iframeVideo', msg: webAuth }, '*');
            }
        }, 2000);
    }
    if (window !== window.top) {
        window.addEventListener('message', function (event) {
            if (event.data && event.data.name === 'iframeVideo' && !!event.data.msg) {
                SmallVideoPlug();
            }
        });
    }

    // 监听鼠标移动
    function SmallVideoPlug() {
        if (runPlug) {
            return false;
        }
        runPlug = true;
        function videoRate(e, num) {
            e.playbackRate = num;
            const videoRateNumber = document.querySelector('#video-plug-number');
            videoRateNumber.innerHTML = num.toFixed(1);
        }
        const omveTime = throttle(async (e) => {
            const videoParent = e.offsetParent;
            videoParent.style.position = 'relative';
            let videoPlug = document.querySelector('#video-plug');
            if (videoPlug) {
                videoPlug.remove();
            }
            await AddDOM({
                addNode: videoParent,
                addData: [{
                    name: 'div',
                    id: 'video-plug',
                    style: `left: ${e.offsetLeft}px;top: ${e.offsetTop}px`,
                    add: [{
                        name: 'div',
                        id: 'video-plug-small',
                        innerHTML: '小窗',
                        click: (c) => {
                            if (document.pictureInPictureEnabled && !document.pictureInPictureElement) {
                                e.requestPictureInPicture();
                            }
                            c.preventDefault();
                            c.stopPropagation();
                        }
                    }, {
                        name: 'div',
                        id: 'video-plug-up',
                        innerHTML: '加速',
                        click: (c) => {
                            e.play();
                            videoRate(e, e.playbackRate + 0.5);
                            c.preventDefault();
                            c.stopPropagation();
                        }
                    }, {
                        name: 'div',
                        id: 'video-plug-default',
                        click: (c) => {
                            e.play();
                            videoRate(e, e.defaultPlaybackRate);
                            c.preventDefault();
                            c.stopPropagation();
                        },
                        add: [{
                            name: 'span',
                            id: 'video-plug-svg',
                            innerHTML: '<svg id="video-plug-svg-s" viewBox="230 230 564 564" version="1.1" xmlns="http://www.w3.org/2000/svg" width="12" height="12"><path id="video-plug-svg-p" d="M317.39904 706.51904a30.72 30.72 0 0 1 0-43.43808 30.86336 30.86336 0 0 1 43.49952 0 212.33664 212.33664 0 0 0 151.10144 62.62784 213.93408 213.93408 0 0 0 213.64736-213.72928A213.93408 213.93408 0 0 0 512 298.25024a212.29568 212.29568 0 0 0-151.10144 62.64832c-6.36928 6.3488-15.03232 15.52384-24.10496 25.33376h53.00224a30.72 30.72 0 0 1 30.72 30.72 30.72 30.72 0 0 1-30.72 30.72h-125.0304a30.3104 30.3104 0 0 1-6.63552-1.3312l-1.24928-0.43008h-0.12288l-1.18784-0.47104h-0.12288l-0.98304-0.43008-0.43008-0.2048-0.69632-0.34816-0.73728-0.4096-0.43008-0.22528-1.10592-0.67584a30.53568 30.53568 0 0 1-3.80928-2.8672 30.72 30.72 0 0 1-10.24-24.33024v-120.832a30.72 30.72 0 0 1 30.72-30.72 30.72 30.72 0 0 1 30.72 30.72v42.7008c7.12704-7.63904 13.80352-14.62272 19.12832-19.94752a273.408 273.408 0 0 1 194.56-80.60928 273.26464 273.26464 0 0 1 194.56 80.60928 273.14176 273.14176 0 0 1 80.60928 194.56 273.26464 273.26464 0 0 1-80.60928 194.56 273.26464 273.26464 0 0 1-194.56 80.60928 273.408 273.408 0 0 1-194.74432-81.08032z" p-id="6341"></path></svg>',
                        }, {
                            name: 'span',
                            id: 'video-plug-number',
                            innerHTML: e.playbackRate.toFixed(1)
                        }]
                    }, {
                        name: 'div',
                        id: 'video-plug-down',
                        innerHTML: '减速',
                        click: (c) => {
                            e.play();
                            videoRate(e, e.playbackRate - 0.5);
                            c.preventDefault();
                            c.stopPropagation();
                        }
                    }]
                }]
            }, 0)
        }, 500);
        let nowDoc = null;
        let timeout = null;
        document.addEventListener('mousemove', function (event) {
            nowDoc = event.target;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (nowDoc.id.includes('video-plug')) {
                    return false;
                }
                const videoPlug = document.querySelector('#video-plug');
                if (videoPlug) {
                    videoPlug.remove();
                }
            }, 1000);
            if (nowDoc.tagName.toLowerCase() === 'video') {
                omveTime(event.target);
            }
        });
    }

    // 版本控制器
    function versionPlug() {
        const plugUrl = "https://greasyfork.org/zh-CN/scripts/478615-万能小窗/code";
        const openUrl = plugUrl + "/万能小窗.user.js";
        const version = GM_info.script.version;
        const plugName = GM_info.script.name;
        let loading = null;
        document.myUpVisible = () => {
            if (!!loading) {
                return Bubble_Msg('❌', `新版插件下载中，请稍后...`, 3);
            }
            loading = window.open(openUrl, '_self');
            document.addEventListener("visibilitychange", function () {
                if (document.visibilityState == "visible") {
                    location.reload();
                }
            })
        }
        function checkPlug(obj) {
            const oldVer = Number(version.replace(/[\s.]+/g, ''));
            const newVer = Number(obj.plugver.replace(/[\s.]+/g, ''));
            if (!!obj.plugver && newVer > oldVer) {
                Bubble_Msg('❌', `${plugName}发现新的版本：${obj.plugver} <a onclick="document.myUpVisible();">更新助手</a>`, 6);
            }
        }
        updatesPlug();
        function updatesPlug() {
            let CONFIG = GET_DATA('PLUG_CONFIG') || {};
            const toTime = (new Date()).getTime();
            if (!CONFIG.plugver || toTime - CONFIG.plugtime >= 1000 * 60 * 60 * 12) {
                GM_XHR({
                    "how": "GET",
                    "url": plugUrl
                }, (xhr) => {
                    const regex = /\/\/\s*@version\s*(\d+\.\d+\.\d+)/g;
                    const newVer = regex.exec(xhr.responseText)[1];
                    if (!!newVer) {
                        CONFIG.plugtime = toTime;
                        CONFIG.plugver = newVer;
                        checkPlug(CONFIG);
                        SET_DATA('PLUG_CONFIG', CONFIG);
                    } else {
                        Bubble_Msg('❌', `${plugName}检测更新失败！`, 3);
                        checkPlug('');
                    }
                })
            } else {
                checkPlug(CONFIG);
            }
        }
    }
})();
function addBodyCSS() {
    GM_addStyle(`
        #video-plug {
            position: absolute;
            top: 50%;
            font-size: 14px;
            font-family: sans-serif;
            transition: 0.2s ease-in-out;
            z-index: 20000;
        }
        #video-plug div {
            margin: 5px 0;
            padding: 8px;
            cursor: pointer;
            line-height: 1;
            border-radius: 0 5px 5px 0;
            background: rgba(0,0,0,.3);
            color: rgba(255,255,255,.6);
        }
        #video-plug div:hover {
            background: rgba(0,0,0,.5);
            color: rgba(255,255,255,.8);
        }
        #video-plug-default {
            display: flex;
            align-items: center;
        }
        #video-plug-svg {
            display: flex;
            margin-right: 3px;
            align-items: center;
        }
        #video-plug-svg-s {
            fill: rgba(255,255,255,.6);
        }

        /*气泡消息*/
        #bubble_center {
            position: fixed;
            display: flex;
            opacity: 0;
            z-index: 20000;
            pointer-events: none;
            font-size: 16px;
            left: 0;
            right: 0;
            align-items: center;
            justify-content: center;
        }
        #bubble_msg_main {
            display: flex;
            background: #ffffff;
            color: #000000;
            padding: 12px 12px;
            text-align: center;
            border-radius: 6px;
            box-shadow: 0 1px 6px rgba(0,0,0,.2);
            line-height: 1;
            pointer-events: auto;
            user-select: text;
        }
        #bubble_msg_ico,
        #bubble_msg_text {
            top: 0;
            bottom: 0;
            margin: auto;
            padding: 0 5px;
        }
        #bubble_msg_text {
            font-size: 16px;
            line-height: 1.2;
        }
        #bubble_center a {
            cursor: pointer;
            color: #1890ff;
            transition: color .3s ease-in-out;
        }
        #bubble_center a:hover {
            color: #40a9ff;
        }
        #bubble_center a:active {
            color: #096dd9;
        }
    `)
}
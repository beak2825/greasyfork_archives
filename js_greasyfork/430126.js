// ==UserScript==
// @name         一键复制美剧链接
// @version      1.7.2
// @description  识别常用网址的美剧链接，美剧天堂添加跳转豆瓣、IMDB、subscene、rarbg、piratebay入口，原始匹配网站云盘可以直接进入，可识别用户匹配网站中的链接。附本人写的字幕翻译程序，下载地址在附加信息中。
// @author       bleu
// @compatible   edge Tampermonkey
// @license      MIT
// @icon         https://fastly.jsdelivr.net/gh/Bleu404/PRPO@latest/png/magent.png
// @supportURL   https://greasyfork.org/zh-CN/scripts/430126-一键复制美剧链接/feedback
// @match        https://*.meijutt.tv/content/*
// @match        https://*.meijutt.net/content/*
// @match        https://www.kpkuang.com/*
// @match        https://91mjw.com/*
// @match        https://www.bd2020.com/*
// @match        https://www.ttmeijuvip.com/*
// @match        https://www.xl720.com/*
// @match        https://pan.xunlei.com/s/*
// @match        https://pan.baidu.com/share/*
// @match        https://115.com/s/*
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @run-at       document-end
// @require      https://fastly.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require      https://fastly.jsdelivr.net/npm/sweetalert2@11.1.0/dist/sweetalert2.all.min.js
/* globals jQuery, $, waitForKeyElements , swal,Swal */
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/430126/%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E7%BE%8E%E5%89%A7%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/430126/%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E7%BE%8E%E5%89%A7%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==
(function () {
    'use strict';

    const webName = ['meijutt', '91mjw', 'kpkuang', 'ttmeijuvip', 'xl720'];
    const panArry = ['xunlei', 'baidu', '115'];
    const pageURL = window.location.href;
    let sign;
    let floatSign = false;
    let cssStyle;
    let BleuButton;
    let buttParent;
    let openMark = 0;
    let oldParent = null;
    let panType = null;

    let toolbox = {

        addNewStyle() {
            if (sign === 'cloudPan') {
                return 0;
            }
            cssStyle = [
                '.btn_bleu{padding: 10px 25px;font-size: 16px;cursor: pointer;text-align: center;   text-decoration: none;outline: none;color: #fff;background-color: #008CBA;border: none;border-radius: 14px;display:block;margin:0 auto}',
                '.btn_bleu:hover{background-color: #008CEA}',
                '.btn_bleu:active{background-color: #008CEA;box-shadow: 0 5px #666;transform: translateY(4px);}',
                '.floatButton {position: fixed;bottom: 10%;left:46%;right: 0;margin:0 auto;z-index:9999}',
            ];
            BleuButton = '<div><input type="button" class="btn_bleu" id="btn_bleu" value="复制全部链接" ></div>';
            cssStyle.forEach(function (value) {
                GM_addStyle(value);
            });
        },

        getURLsign() {
            let nameFU = GM_info.script.options.override.use_matches;
            nameFU.length != 0 && nameFU.forEach(function (value) {
                if (pageURL.match(value)) {
                    sign = value
                }
            })
            webName.forEach(function (value) {
                if (pageURL.match(value)) {
                    sign = value
                }
            })
            if (sign == undefined) {
                //云盘界面
                sign = 'cloudPan';
            }
        },

        getButtonParent() {
            //公众号屏蔽
            let adshow = $("div.widget-weixin");
            if (adshow.length != 0) {
                adshow.remove();
            }
            let box;
            switch (sign) {
                case 'meijutt':
                    $("div.widget-weixin").remove();
                    box = pageURL.match("m.meijutt.tv")?$(".arconix-toggle-content.fn-clear"):$("div.o_cn_r_box");
                    break;
                case '91mjw':
                    box = $(".down-list");
                    break;
                case 'kpkuang':
                    box = $(".fed-down-item.fed-drop-item.fed-visible");
                    break;
                case 'ttmeijuvip':
                    box = $("div.box_bor3");
                    break;
                case 'rrdyw':
                    box = $(".movie-txt");
                    break;
                case 'xl720':
                    box = $(".entry-content");
                    break;
                default:
                    floatSign = true;
                    box = $("body");
                    break;
            }
            return box;
        },

        arryDel(arrold) {
            var arr = [];
            arrold.forEach(function (value) {
                if (arr.indexOf(value) == -1) {
                    if (sign == 'kpkuang') {
                        value = decodeURIComponent(escape(window.atob(value.replace('data-clipboard-text="', ''))));
                        if (arr.indexOf(value) == -1) {
                            arr.push(value);
                        }
                        return;
                    }
                    arr.push(value);
                }
            })
            if (sign == 'kpkuang') {
                let end;
                let nm = $(".uk-width-expand.uk-first-column").text();
                nm = nm.match(/第\d*集/)[0];
                nm = nm.replace('第', '').replace('集', '');
                end = arr.length / Math.ceil(arr.length / nm);
                arr = arr.slice(0, end);
            }
            return arr;
        },

        getDownloadText() {
            let ulstr = buttParent.innerHTML;
            let reg = /magnet\:\?[^"]*|ed2k\:\/\/[^"]*|thunder\:\/\/[^"]*|data-clipboard-text="[^"]*/g;
            let s = ulstr.match(reg);
            return s == null ? s : this.arryDel(s);
        },

        findLinknode(buttdiv) {
            buttParent = buttdiv
            if (sign == "meijutt"||sign == "ttmeijuvip") {
                for (let tabs of document.getElementsByClassName('tabs-list')) {
                    if (tabs.getAttribute('style') == 'display: block;' || tabs.getAttribute('style') == null) {
                        return tabs;
                    }
                }
            }
            return buttParent;
        },

        noneLinkfunc(button) {
            openMark++;
            if (sign === "meijutt") {
                $(button).attr('value', '打开全部链接');
                if (openMark === 1 || (openMark === 2 && oldParent != buttParent)) {
                    openMark = 1
                    alert("确定打开所有链接吗？共有" + $(buttParent).find('li').length + "条\r\n 再次点击确认");
                    oldParent = buttParent;
                }
                if (openMark === 2 && oldParent === buttParent) { //确定是同一标签下
                    openMark = 0;
                    if ($(buttParent).find("input")) {
                        $(buttParent).find("input").each(function () {
                            this.click();
                        })
                    };
                    if ($(buttParent).find("a")) {
                        $(buttParent).find("a").each(function () {
                            let href = $(this).attr('href');
                            href.indexOf("http") < 0 ? href = "https://www.meijutt.tv/" + href : href;
                            GM_openInTab(href, {
                                active: true,
                                insert: true,
                                setParent: true
                            });
                        });
                    };
                }
            } else {
                alert("没有复制任何链接");
            }
        },

        sleep(time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        },

        isHidden(el) {
            try {
                return el.offsetParent === null;
            } catch (e) {
                return false;
            }
        },

        getHash(linkAddress) {
            //处理迅雷百度云分享链接
            if (linkAddress == null) {
                return 0
            }
            if (!(linkAddress.search("xunlei") >= 0 || linkAddress.search("baidu") >= 0)) {
                return 0
            }
            let hashRex = /\/s\/[^?]*|surl=[^?]*/;
            let res = linkAddress.match(hashRex)[0].replace('surl=', '');
            if (linkAddress.search("baidu") >= 0 && res.search("\/s\/") >= 0) {
                res = res.replace('\/s\/', '').substr(1);
            }

            return res.replace('\/s\/', '');
        },

        getPanType() {
            panArry.forEach(function (value) {
                if (pageURL.search(value) >= 0) {
                    panType = value
                }
            })
        },

        getButtSec(linkText) {
            let bleuButtSec = '';
            for (let key in linkText) {
                if (key === "magnet" && linkText[key].length > 0) {
                    bleuButtSec = bleuButtSec + `<input type="button" class="btn_bleu sec" value="磁力链接：${linkText[key].length}条" linktype="magnet"/></br>`;
                }
                if (key === "ed2k" && linkText[key].length > 0) {
                    bleuButtSec = bleuButtSec + `<input type="button" class="btn_bleu sec" value="电驴链接：${linkText[key].length}条" linktype="ed2k"/></br>`;
                }
                if (key === "thunder" && linkText[key].length > 0) {
                    bleuButtSec = bleuButtSec + `<input type="button" class="btn_bleu sec" value="迅雷链接：${linkText[key].length}条" linktype="thunder"/></br>`;
                }
                if (key === "http" && linkText[key].length > 0) {
                    bleuButtSec = bleuButtSec + `<input type="button" class="btn_bleu sec" value="http链接：${linkText[key].length}条" linktype="http"/></br>`;
                }
            }
            bleuButtSec = bleuButtSec + '<input type="button" class="btn_bleu sec" value="全部链接" linktype="all"/>';
            return bleuButtSec;
        },
    }

    let linkHandler = {

        webWithPanLink() {
            let hash = '',
                linkParent = '',
                pswd = '';

            if (pageURL.indexOf('bd2020') >= 0) {
                localStorage.setItem("openid", 'omcj56pIE_ssXEG7s04uZ9saaa'); //去二维码
                let hide = document.querySelector('.layui-icon.layui-icon-down');
                hide ? hide.click() : 1;
                linkParent = document.querySelectorAll('.option.copybtn.alert');
                linkParent.forEach((value) => {
                    hash = toolbox.getHash($(value).find('a')[0].getAttribute('href'));
                    pswd = $(value).find('span')[0].innerHTML;
                    GM_setValue(hash, pswd);
                });
            }
        },

        panListener(panInputSign, panBttonSign) {
            let asda = toolbox.getHash(pageURL);
            let password = GM_getValue(asda);
            let maxTime = 10;
            if (password == undefined) {
                return 0
            }
            let listener = setInterval(async () => {
                maxTime--;
                let panInput = document.querySelector(panInputSign);
                let panBtton = document.querySelector(panBttonSign);
                if (panInput && !toolbox.isHidden(panInput)) {

                    clearInterval(listener);

                    let lastValue = panInput.value;
                    panInput.value = password;
                    //Vue & React 触发 input 事件===》 可行
                    /*let event = new Event('input', {bubbles: true});
                    let tracker = panInput._valueTracker;
                    if (tracker) {
                        tracker.setValue(lastValue);
                    }
                    panInput.dispatchEvent(event);*/
                    //js原生触发===》可行
                    var evt = document.createEvent('HTMLEvents')
                    evt.initEvent('input', true, true)
                    panInput.dispatchEvent(evt)
                    //jquery触发===》不可行
                    //$(panInput).bind('input propertychange', function() {$(this).val(lastValue);});

                    await toolbox.sleep(500); //1秒后点击按钮
                    panBtton.click();
                } else {
                    maxTime === 0 && clearInterval(listener);
                }
            }, 800);
        },

        clickPanButton(panBttonSign) {
            let maxTime = 10;
            let listener = setInterval(async () => {
                maxTime--;
                let panBtton = document.querySelector(panBttonSign);
                if (panBtton && !toolbox.isHidden(panBtton)) {
                    clearInterval(listener);
                    await toolbox.sleep(500); //1秒后点击按钮
                    panBtton.click();
                } else {
                    maxTime === 0 && clearInterval(listener);
                }
            }, 800);
        },

        autoOpenPan() {
            if (sign != 'cloudPan') {
                return 0;
            }
            let panInput, panBtton;
            if (panType === 'xunlei') {
                panInput = '.pass-input-wrap .td-input__inner';
                panBtton = '.pass-input-wrap .td-button';
            }
            if (panType === 'baidu') {
                panInput = '#accessCode';
                panBtton = '#submitBtn';
            }
            if (panType === '115') {
                panBtton = '.button.btn-large';
            }
            panInput && panBtton ? linkHandler.panListener(panInput, panBtton) : linkHandler.clickPanButton(panBtton);
        },

        fixPanButton() {
            if (sign != "meijutt") {
                return 0;
            }
            let option = {
                active: true,
                insert: true,
                setParent: true
            };
            $('.copy-pw').each(function () {
                $(this).attr('value', '点击进入');
                $(this).attr('href', $(this).next().attr('href'));
                $(this).next().remove();
            })
            $('.copy-pw').on('click', function () {
                GM_setClipboard($(this).attr('data'), 'text');
                let hash = toolbox.getHash($(this).attr('href'));
                GM_setValue(hash, $(this).attr('data'));
                GM_openInTab($(this).attr('href'), option);
            })
        },

        organizeLink(linkArry) {
            let linkType = [0, 0, 0, 0];
            let linkText = {
                'magnet': [],
                'ed2k': [],
                'thunder': [],
                'http': [],
            };
            linkArry.forEach((value) => {
                if (value.search("magnet") >= 0) {
                    linkText.magnet.push(value);
                    linkType[0] = 1;
                    return;
                }
                if (value.search("ed2k") >= 0) {
                    linkText.ed2k.push(value);
                    linkType[1] = 1;
                    return;
                }
                if (value.search("thunder") >= 0) {
                    linkText.thunder.push(value);
                    linkType[2] = 1;
                    return;
                }
                if (value.search("http") >= 0) {
                    linkText.http.push(value);
                    linkType[3] = 1;
                    return;
                }
            })

            if (linkType[0] + linkType[1] + linkType[2] + linkType[3] === 1) {
                let arrytxt = linkArry.toString().replace(/,/g, "\n");
                GM_setClipboard(arrytxt, 'text');
            } else {
                Swal.fire({
                    html: toolbox.getButtSec(linkText),
                    width: 400 + 'px',
                    showConfirmButton: false,
                    //showCloseButton: true,
                })
            }
            $('.btn_bleu.sec').on("click", function () {
                let arrytxt;
                let attr = $(this).attr("linktype");
                if (attr != "all") {
                    arrytxt = linkText[attr].toString().replace(/,/g, "\n");
                } else {
                    let arry = [];
                    arry.push(linkText.magnet, linkText.ed2k, linkText.thunder, linkText.http);
                    arrytxt = arry.toString().replace(/,/g, "\n");
                }
                GM_setClipboard(arrytxt, 'text');
            });
        },

        ButtonAddEvent() {
            $('.btn_bleu').on("click", function () {
                buttParent = toolbox.findLinknode(this.parentNode.parentNode);
                let arryAll = toolbox.getDownloadText();
                arryAll == null ? toolbox.noneLinkfunc(this) : linkHandler.organizeLink(arryAll);
            });
        },

        processButton() {
            let BleuButton1 = '<div><input type="button" class="btn_bleu floatButton" id="btn_bleu" value="复制全部链接" ></div>';
            if (sign === 'cloudPan') {
                return 0;
            }
            buttParent = toolbox.getButtonParent();
            //buttParent.append(BleuButton);
            if (floatSign) {
                buttParent.append(BleuButton1);
            } else {
                buttParent.append(BleuButton);
            }
            this.ButtonAddEvent();
            this.fixPanButton(); //适配meijutt网站
        },

        addDBicon() {
            if (!(sign === "meijutt"||sign === "ttmeijuvip")) {
                return
            }
            let OriginalName = $('.o_r_contact').find('li')[1].outerText.replace('原名：', '').replace(/^\s*/, "").toLowerCase();
            let name = $('h1').html();
            let IMDB, douban;
            let firstID;
            let icon = '<div class="ico_bleu" id="douban"><svg height="24" viewBox="0 0 152 152" width="24" xmlns="http://www.w3.org/2000/svg"><g id="Layer_2" data-name="Layer 2"><g id="Color_Icon" data-name="Color Icon"><g id="_74.Douban" data-name="74.Douban"><rect id="Background" fill="#4caf50" height="152" rx="12" width="152"/><g id="Icon" fill="#fff"><path d="m95.91 107.15 5.6-19.15h7.87v-33.51h-66.7v33.51h7l6 19.14h-19.68v7.6h79.65v-7.6zm-39.8-44h40.25v16h-40.25zm28.53 44h-17.72l-5.92-19.15h29.24z"/><path d="m36.37 37.25h79.63v8.81h-79.63z"/></g></g></g></g></svg></div><div class="ico_bleu" id="imdb"><svg id="home_img" class="ipc-logo" xmlns="http://www.w3.org/2000/svg" width="48" height="24" viewBox="0 0 64 32" version="1.1"><g fill="#F5C518"><rect x="0" y="0" width="100%" height="100%" rx="4"></rect></g><g transform="translate(8.000000, 7.000000)" fill="#000000" fill-rule="nonzero"><polygon points="0 18 5 18 5 0 0 0"></polygon><path d="M15.6725178,0 L14.5534833,8.40846934 L13.8582008,3.83502426 C13.65661,2.37009263 13.4632474,1.09175121 13.278113,0 L7,0 L7,18 L11.2416347,18 L11.2580911,6.11380679 L13.0436094,18 L16.0633571,18 L17.7583653,5.8517865 L17.7707076,18 L22,18 L22,0 L15.6725178,0 Z"></path><path d="M24,18 L24,0 L31.8045586,0 C33.5693522,0 35,1.41994415 35,3.17660424 L35,14.8233958 C35,16.5777858 33.5716617,18 31.8045586,18 L24,18 Z M29.8322479,3.2395236 C29.6339219,3.13233348 29.2545158,3.08072342 28.7026524,3.08072342 L28.7026524,14.8914865 C29.4312846,14.8914865 29.8796736,14.7604764 30.0478195,14.4865461 C30.2159654,14.2165858 30.3021941,13.486105 30.3021941,12.2871637 L30.3021941,5.3078959 C30.3021941,4.49404499 30.272014,3.97397442 30.2159654,3.74371416 C30.1599168,3.5134539 30.0348852,3.34671372 29.8322479,3.2395236 Z"></path><path d="M44.4299079,4.50685823 L44.749518,4.50685823 C46.5447098,4.50685823 48,5.91267586 48,7.64486762 L48,14.8619906 C48,16.5950653 46.5451816,18 44.749518,18 L44.4299079,18 C43.3314617,18 42.3602746,17.4736618 41.7718697,16.6682739 L41.4838962,17.7687785 L37,17.7687785 L37,0 L41.7843263,0 L41.7843263,5.78053556 C42.4024982,5.01015739 43.3551514,4.50685823 44.4299079,4.50685823 Z M43.4055679,13.2842155 L43.4055679,9.01907814 C43.4055679,8.31433946 43.3603268,7.85185468 43.2660746,7.63896485 C43.1718224,7.42607505 42.7955881,7.2893916 42.5316822,7.2893916 C42.267776,7.2893916 41.8607934,7.40047379 41.7816216,7.58767002 L41.7816216,9.01907814 L41.7816216,13.4207851 L41.7816216,14.8074788 C41.8721037,15.0130276 42.2602358,15.1274059 42.5316822,15.1274059 C42.8031285,15.1274059 43.1982131,15.0166981 43.281155,14.8074788 C43.3640968,14.5982595 43.4055679,14.0880581 43.4055679,13.2842155 Z"></path></g></svg></div>';
            GM_addStyle('.ico_bleu{display: inline-flex;vertical-align: middle;margin: inherit;margin-left: 10px;}');
            GM_addStyle('.ico_bleu:active{box-shadow: 0 5px #666;transform: translateY(4px);}');
            let icon1 = '<div class="ico_bleu" id="subscene"><img style="width: 24px;height: 24px;" src="https://subscene.com/favicon.ico"/></div>';
            let icon2 = '<div class="ico_bleu" id="rarbg"><img style="width: 24px;height: 24px;" src="https://rargb.to/favicon.ico"/></div>';
            let icon3 = '<div class="ico_bleu" id="piratebay"><img style="width: 24px;height: 24px;" src="https://piratebay.live/static/img/tpblogo_sm_ny.gif"/></div>';
            let IMDBName = OriginalName.substr(0, OriginalName.indexOf("season"));
            IMDBName ? IMDBName : IMDBName = OriginalName;
            $('.info-title').append(icon, icon1,icon2,icon3);
            $('#douban').on('click', function () {
                GM_xmlhttpRequest({
                    url: 'https://movie.douban.com/j/subject_suggest?q=' + IMDBName.replace(/\s/g, '+'),
                    method: "GET",
                    onload: function (res) {
                        if (res.status === 200) {
                            var responseArry = JSON.parse(res.responseText);
                            if (responseArry.length != 0) {
                                responseArry.forEach(function (value, index) {
                                    if (name === value.title.replace(/\s/g, '')) {
                                        douban = value.id
                                    }
                                    if (index == 0) {
                                        firstID = value.id
                                    }
                                })
                                if (douban == undefined) {
                                    douban = firstID;
                                }
                                GM_openInTab('https://movie.douban.com/subject/' + douban + '/');
                            } else {
                                GM_openInTab("https://search.douban.com/movie/subject_search?search_text=" + name);
                            }
                        } else {
                            GM_openInTab("https://search.douban.com/movie/subject_search?search_text=" + name);
                        }
                    },
                    onerror: function (err) {
                        GM_openInTab("https://search.douban.com/movie/subject_search?search_text=" + name);
                    }
                })
            });
            $('#imdb').on('click', function () {
                IMDBName = IMDBName.replace(/\s/g, '_');
                GM_xmlhttpRequest({
                    url: 'https://v2.sg.media-imdb.com/suggestion/' + IMDBName[0] + '/' + IMDBName + '.json',
                    method: "GET",
                    onload: function (res) {
                        if (res.status === 200) {
                            var result = JSON.parse(res.responseText);
                            IMDB = result.d[0].id;
                            if (IMDB != undefined && IMDB.indexOf('nm') < 0) {
                                GM_openInTab('https://www.imdb.com/title/' + IMDB + '/')
                            } else {
                                GM_openInTab('https://www.imdb.com/find?q=' + IMDBName)
                            }
                        } else {
                            GM_openInTab('https://www.imdb.com/find?q=' + IMDBName)
                        }
                    },
                    onerror: function (err) {
                        GM_openInTab('https://www.imdb.com/find?q=' + IMDBName)
                    }
                })
                IMDBName = IMDBName.replace(/_/g, ' ');
            });
            $('#subscene').on('click', function () {
                var PARAMS = {query: IMDBName,l: ''};
                var temp_form = document.createElement("form");
                temp_form.action = 'https://subscene.com/subtitles/searchbytitle';
                temp_form.target = "_blank";
                temp_form.method = "post";
                temp_form.style.display = "none";
                for (var x in PARAMS) {
                    var opt = document.createElement("textarea");
                    opt.name = x;
                    opt.value = PARAMS[x];
                    temp_form.appendChild(opt);
                }
                document.body.appendChild(temp_form);
                temp_form.submit();
                document.body.removeChild(temp_form);
            });
            $('#rarbg').on('click', function () {
                var rarbgURL = 'https://rargb.to/search/?search=' + IMDBName;
                GM_openInTab(encodeURI(rarbgURL));
            });
            $('#piratebay').on('click', function () {
                var piratebayURL = 'https://piratebay.live/search/' + IMDBName;
                GM_openInTab(encodeURI(piratebayURL));
            });
        },
        init() {
            toolbox.getURLsign();
            toolbox.getPanType();
            toolbox.addNewStyle();
            this.processButton();
            this.webWithPanLink();
            this.autoOpenPan();
            this.addDBicon();
        },
    }

    linkHandler.init();

})();

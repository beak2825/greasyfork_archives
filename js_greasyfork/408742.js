// ==UserScript==
// @name         恋爱游戏网+
// @namespace    http://tampermonkey.net/code_recongnize
// @version      2021.04.18.3
// @description  验证码自动识别填写更新，Ctrl+Enter快捷键发表评论，短评实时字数统计，资源页简介区百度网盘链接识别、补全、激活，点击度盘链接自动复制提取码
// @author       PY-DNG
// @icon         https://www.lianaiyx.com/e/data/images/info.jpg
// @include      https://www.lianaiyx.com/
// @include      https://www.lianaiyx.com/GalGame/*
// @include      https://www.lianaiyx.com/yangcheng/*
// @include      https://www.lianaiyx.com/monijingying/*
// @include      https://www.lianaiyx.com/celve/*
// @include      https://www.lianaiyx.com/jiemi/*
// @include      https://www.lianaiyx.com/ss/*
// @include      https://www.lianaiyx.com/yxzy/*
// @include      https://www.lianaiyx.com/gonglve/*
// @include      https://www.lianaiyx.com/ping/*
// @include      https://www.lianaiyx.com/e/pl/*
// @require      https://greasyfork.org/scripts/408740-%E6%81%8B%E7%88%B1%E6%B8%B8%E6%88%8F%E7%BD%914%E4%BD%8D%E6%95%B0%E5%AD%97%E9%AA%8C%E8%AF%81%E7%A0%81%E8%AF%86%E5%88%AB/code/%E6%81%8B%E7%88%B1%E6%B8%B8%E6%88%8F%E7%BD%914%E4%BD%8D%E6%95%B0%E5%AD%97%E9%AA%8C%E8%AF%81%E7%A0%81%E8%AF%86%E5%88%AB.js?version=837246
// @downloadURL https://update.greasyfork.org/scripts/408742/%E6%81%8B%E7%88%B1%E6%B8%B8%E6%88%8F%E7%BD%91%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/408742/%E6%81%8B%E7%88%B1%E6%B8%B8%E6%88%8F%E7%BD%91%2B.meta.js
// ==/UserScript==

/*
** 已知问题：
** 1. 链接识别 - 误把解压码当作网盘链接后缀：https://www.lianaiyx.com/yxzy/2020-08-13/16878.html
** -
** 仍有一事不明：为什么Summer Pockets的天翼云盘资源都没有被政策限制？如：
** https://www.lianaiyx.com/yxzy/2020-07-08/15704.html
** https://www.lianaiyx.com/yxzy/2020-07-25/16134.html
*/

(function() {
    'use strict';

    // 用户常量 - 用户可修改/自定义
    // 允许出现在链接里面的中文字符/特殊字符，用于识别经过防和谐处理的度盘链接，可自行添加
    const TEXT_CHINESEINLINKS = '删除汉字中文字去除去掉我盘点百度杠复制链接和谐河蟹防止抽风度娘网盘。';

    // 开发者模式开关
    const developer = false;

    // 内置常量
    const CSS_DOWNLOADPAGE = '#actvgui {color:rgba(0,200,0,0.8); cursor:pointer; font-weight:bold;} #actvgui:hover {color:rgb(0, 120, 0);}';
    const REGEXP_PSWDCODE = /(?:提取码|提取代码|提取密码|密码|神秘代码) *[：:] *(\w{4})/g;
    const REGEXP_LINKNEED = /[a-zA-Z]+/g
    const REGEXP_DUPANSHARE = new RegExp('^(/s/|s/|/)', 'g');
    const REGEXP_LINKRCGNZER = new RegExp('(/s/|s/|/)?[\\w_\\-{CHINESE}]{13,}'.replaceAll('{CHINESE}', TEXT_CHINESEINLINKS.replaceAll('\\', '\\\\')), 'g');
    const REGEXP_CHNSRCGNZER = new RegExp('[{CHINESE}]+'.replaceAll('{CHINESE}', TEXT_CHINESEINLINKS.replaceAll('\\', '\\\\')), 'g');
    const REGEXP_CHNSRCGNZER_TOOLONG = new RegExp('[{CHINESE}]{5,}'.replaceAll('{CHINESE}', TEXT_CHINESEINLINKS.replaceAll('\\', '\\\\')), 'g');
    const URL_API_DOWNLOAD = 'https://www.lianaiyx.com/e/DownSys/GetDown/?classid=11&id={GAMEID}&pathid=0';
    const URL_HOST_BAIDUPAN = 'https://pan.baidu.com/s/';
    const TEXT_AUTOCOPY = '点击链接自动复制提取码（{PSWDCODE}）';
    const TEXT_PSWDCODE = '提取码：{PSWDCODE}';
    const TEXT_SHOWORIGINAL = '显示原文';
    const TEXT_ACTIVATE = '识别链接';
    const TEXT_TEXTHINT_ORIGINAL = '短评最多字数：140字；超过字数请发表长评。';
    const TEXT_CHARACTERCOUNT = '短评字数统计：{CURCOUNT}/140字；超过140字请发布长评';
    const TEXT_SITEERROR = '此处貌似不是恋爱游戏网的页面呢～\n是否继续运行[恋爱游戏网+]？';

    // 确认恋网访问正常，如不正常就中止执行脚本（由用户选择是否继续执行脚本）
    if (isAPIPage()) {
        const APIRESULT = document.querySelector('.tableborder div[align="center"]>p>b').innerText;
        if (developer) {console.log(APIRESULT);};
        return;
    };
    const siteOK = document.querySelector('a[href="https://www.lianaiyx.com/"]') && document.querySelector('a[href="/sitemap.html"]');
    const CONTINUE = siteOK || confirm(TEXT_SITEERROR);
    if (!CONTINUE && !isAPIPage()) {return;};


    // 获取DOM元素
    const loggedIn = document.querySelector('.header .menber a[href="https://www.lianaiyx.com/e/member/cp/"]') ? true : false;
    const headerLeft = document.querySelector('.header .menber');
    const input = document.querySelectorAll('#key')[document.querySelectorAll('#key').length-1];
    const focusEvent = new Event('focus');
    const codeImage = document.getElementById('KeyImgpl') ? document.getElementById('KeyImgpl') : document.getElementById('KeyImg');
    const saytext = document.querySelector('#saytext');
    const saypl = document.querySelector('#saypl') ? document.querySelector('#saypl') : document.querySelector('form[name="login"]');
    const submitBtn = document.querySelector('#imageField');



    // 获取标签页API（只要API第一部分，如: 'yxzy', 'GalGame'）
    const API = window.location.href.replace(/https?:\/\/(.*?\.){1,2}.*?\//, '').replace(/\?.*/, '').replace(/\/.*/g, '');

    // 通用页面操作
    scriptIcon();
    codeFill();
    hotkeySay();
    saytextCounting();

    // 根据不同API页面执行不同附加功能
    switch (API) {
        // Dwonload page
        case 'yxzy':
            pageDownload();
            break;
        // Other pages
        default:
            console.log(API);
    }

    // 判断当前页面是否是API回显页面
    function isAPIPage() {
        const match = location.href.match(/^(https?:\/\/.*?\.lianaiyx\..*?\/).*\/(doaction.php)$/);
        if (match && match[2] === 'doaction.php') {return true;} else {return false;};
    }

    // 脚本标识，代表脚本已运行
    function scriptIcon() {
        const lovePlus = document.createElement('a');
        const blank = document.createTextNode('  ');
        lovePlus.style.color = 'green';
        lovePlus.innerText = '[恋爱游戏网+]';
        lovePlus.href = 'javascript:void(0);';
        headerLeft.appendChild(blank);
        headerLeft.appendChild(lovePlus);
    }

    // 自动识别填写验证码
    function codeFill() {
        if (codeImage) {
            let submiting = false;
            const onsbmt = (saypl && saypl.onsubmit) ? saypl.onsubmit : function(){return true;};
            // 自动识别填写验证码
            codeImage.addEventListener('load', function() {
                const code = rec_image(codeImage);
                if (code) {
                    input.value = code;
                } else {
                    input.dispatchEvent(focusEvent);
                }
                // 如果正在submit过程中，就进行原有的onsubmit并在返回true时submit
                saypl && submiting && onsbmt() && saypl.submit();
            })
            // 先自动填写一次
            input.dispatchEvent(focusEvent);
            // 提交评论前自动加载一个新的验证码，确保验证码可用
            saypl ? saypl.onsubmit = function() {
                // 将submit交给验证码识别功能去处理
                submiting = true;
                input.dispatchEvent(focusEvent);
                return false;
            } : function(){};
        }
    }

    // Ctrl+Enter 发表评论
    function hotkeySay() {
        if (saytext) {
            saytext.addEventListener('keydown', function() {
                let keycode = event.keyCode;
                if (keycode === 13 && event.ctrlKey && !event.altKey) {
                    submitBtn.click();
                }
            })
        }
    }

    // 短评实时字数统计
    function saytextCounting() {
        if (saytext) {
            const texthint = getTexthintElement();
            const refreshCount = function() {texthint.textContent = TEXT_CHARACTERCOUNT.replace('{CURCOUNT}', String(saytext.value.length));};

            // 首先统计一次字数
            refreshCount();

            // 当用户输入时，更新字数统计
            saytext.addEventListener('input', refreshCount);

            // 用户使用输入设备交互时，更新字数统计/*_*毕竟有些时候用户不输入字符，内容也会被JS动态修改，对吧？*_*/
            saytext.addEventListener('focus', refreshCount);
            saytext.addEventListener('mousedown', refreshCount);
            saytext.addEventListener('keydown', refreshCount);
            saytext.addEventListener('keyup', refreshCount);

            function getTexthintElement() {
                const allChilds = document.querySelector('#texthint').parentElement.childNodes;
                for (let i = 0; i < allChilds.length; i++) {
                    if (allChilds[i].textContent.indexOf(TEXT_TEXTHINT_ORIGINAL) !== -1) {
                        return allChilds[i];
                    }
                }
            }
        }
    }

    // 复制文本到剪贴板
    function copyText(text) {
        // Create a new textarea for copying
        const newInput = document.createElement('textarea');
        document.body.appendChild(newInput);
        newInput.value = text;
        newInput.select();
        document.execCommand('copy');
        document.body.removeChild(newInput);
    }

    function addStyle(css, styleId) {
        if (styleId && document.getElementById(styleId)){
            document.getElementById(styleId).remove();
        }
        const newStyleElement = document.createElement("style");
        newStyleElement.type = "text/css";
        if (styleId) {newStyleElement.id = styleId;};
        newStyleElement.innerText = css;
        //newStyleElement.appendChild(document.createTextNode(css));
        const headElement = document.getElementsByTagName("head")[0];
        headElement.appendChild(newStyleElement);
    }

    // 游戏资源页
    function pageDownload() {
        // 获取元素/信息
        const downloadLink = document.querySelector('.downpath').querySelector('a:nth-child(1)');
        const gameId = location.href.match(/(\d+?)\.html/)[1];
        const infoEle = document.querySelector('.downbox > tbody:nth-child(1) > tr:nth-child(13) > td:nth-child(2) > div:nth-child(1)');
        const subEles = infoEle.childNodes;

        // 检测是否允许下载
        const downloadEnabled = downloadLink.href !== '';

        // 如果不允许下载，就添加下载链接
        if (!downloadEnabled) {
            downloadLink.href = URL_API_DOWNLOAD.replace('{GAMEID}', gameId);
            downloadLink.target = '_blank';
            downloadLink.innerText = '[恋网下载API已关闭:(]';
        }

        // 简介区度盘链接相关功能
        // 添加GUI，以在识别/处理错误时让用户可以恢复、查看原内容
        let activateState = -1; // 记录当前是否已识别激活链接：1.激活（显示链接），-1.未激活（显示原文）
        let originalHTML; // 记录原文内容HTML
        let btnBaidupan;
        btnBDPinit();

        // 自动识别处理
        btnBDPonclick();

        function btnBDPinit() {
            const btnExist = infoEle.querySelector('#actvgui') ? true : false;
            btnBaidupan = btnExist ? infoEle.querySelector('#actvgui') : document.createElement('span');
            btnBaidupan.innerText = TEXT_ACTIVATE;
            btnBaidupan.id = 'actvgui';
            btnBaidupan.addEventListener('click', btnBDPonclick);
            if (!btnExist) {
                addStyle(CSS_DOWNLOADPAGE);
                if (subEles.length > 0) {
                    infoEle.insertBefore(btnBaidupan, subEles[0]);
                    infoEle.insertBefore(document.createElement('br'), subEles[1]);
                } else {
                    infoEle.appendChild(btnBaidupan);
                }
            }
        }

        function btnBDPonclick() {
            if (activateState > 0) {
                // 当前已激活，需要显示原文
                infoEle.innerHTML = originalHTML;
                // 注意！这里HTML重新解析，需要重新设置按钮
                btnBDPinit();
                btnBaidupan.innerText = TEXT_ACTIVATE; // 再次点击按钮，激活链接
            } else {
                // 当前原文状态，需要激活
                originalHTML = infoEle.innerHTML;
                baidupanActivate();
                btnBaidupan.innerText = TEXT_SHOWORIGINAL; // 再次点击按钮，显示原文
            }
            activateState = -activateState;
        }

        function baidupanActivate() {
            // 检查每一个子元素
            let pswdCode; // 储存识别到的提取码（假设只有一个提取码）
            const linkElemts = []; // 储存所有激活的span元素
            for (let i = 0; i < subEles.length; i++) {
                const thisEle = subEles[i];
                const HTMLRef = [null, undefined].includes(thisEle.innerHTML) ? 'nodeValue' : 'innerHTML';
                const dupanSuffixes = thisEle[HTMLRef].match(REGEXP_LINKRCGNZER);
                const pswdMatch = [...thisEle[HTMLRef].matchAll(REGEXP_PSWDCODE)];
                // 如果匹配到了提取码
                if (pswdMatch.length > 0 && pswdMatch[0][1]) {
                    pswdCode = pswdMatch[0][1];
                }
                // 如果匹配到了像是链接后缀的东西
                if (dupanSuffixes) {
                    const validSffxs = []; // 储存所有去除反和谐字符后的链接后缀
                    const dupanLinks = []; // 储存所有补全后的百度网盘链接
                    for (let j = 0; j < dupanSuffixes.length; j++) {
                        // 如果连个字母都没有（比如全都是数字），那么一定不是度盘后缀，有可能是QQ群号什么的
                        if (!dupanSuffixes[j].match(REGEXP_LINKNEED)) {continue;};
                        // 如果其中有连续的反和谐字符长度过长（超过5个），那么多半也不是度盘后缀，毕竟谁会在同一个位置连续地插入那么多反和谐字符呢？
                        if (dupanSuffixes[j].match(REGEXP_CHNSRCGNZER_TOOLONG)) {continue;};
                        // 格式化链接
                        validSffxs[j] = dupanSuffixes[j].replace(REGEXP_CHNSRCGNZER, '').replace(REGEXP_DUPANSHARE, '');
                        dupanLinks[j] = URL_HOST_BAIDUPAN + validSffxs[j];
                        // 创建元素以供点击
                        const span = document.createElement('span');
                        const a = document.createElement('a');
                        span.classList.add('downpath');
                        a.href = dupanLinks[j];
                        a.innerText = dupanLinks[j];
                        a.target = '_blank';
                        span.appendChild(a);
                        // 点击的同时复制提取码（如果能识别到的话）
                        span.addEventListener('click', function() {
                            if (pswdCode) {
                                copyText(pswdCode);
                            };
                        });
                        // 记录元素
                        linkElemts.push({span: span, a: a});
                        // 如果链接在原文中间，要把原文拆分成两部分，把链接插到中间；这里先划分前半段
                        const idx = thisEle[HTMLRef].indexOf(dupanSuffixes[j]);
                        const len = dupanSuffixes[j].length;
                        const txt = thisEle[HTMLRef];
                        const txtNode = document.createTextNode(txt.substr(idx + len));
                        thisEle[HTMLRef] = txt.substr(0, idx);
                        if (i < subEles.length-1) {
                            // 当前元素不是最后一个，插入到下一个元素之前
                            infoEle.insertBefore(txtNode, subEles[i+1]);
                            // 这里i先不要动，插入链接元素后再整体+1
                        } else {
                            // 当前元素已经是最后一个了，直接加入到最后即可
                            infoEle.appendChild(txtNode);
                            // 这里i先不要动，插入链接元素后再整体+1
                        };
                        // 插入元素
                        if (i < subEles.length-1) {
                            // 当前元素不是最后一个，插入到下一个元素之前
                            infoEle.insertBefore(span, subEles[i+1]);
                        } else {
                            // 当前元素已经是最后一个了，直接加入到最后即可
                            infoEle.appendChild(span);
                        }
                        i = i + 2; // 跳过插入的元素
                    }
                    if (developer) {console.log(dupanSuffixes, validSffxs, dupanLinks);};
                }
            }
            if (developer) {console.log(linkElemts);};
            // 如果识别到了提取码，就在链接中显示出来吧
            if (pswdCode) {
                for (let i = 0; i < linkElemts.length; i++) {
                    const span = linkElemts[i].span;
                    const a = linkElemts[i].a;
                    a.title = TEXT_AUTOCOPY.replaceAll('{PSWDCODE}', pswdCode);
                    a.innerText = a.innerText + ' ' + TEXT_PSWDCODE.replaceAll('{PSWDCODE}', pswdCode);
                }
            }
        }
    }

})();
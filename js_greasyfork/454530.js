// ==UserScript==
// @name        教师专业发展研修平台：国培计划(2022)”——江西省中小学幼儿园骨干教师信息技术应用能力提升培训（中小学）
// @namespace    幻生，欢迎打赏嘞
// @version      0.23
// @description  自动看课||自动换课||自动刷新||自动完成所有课程------魔改自：@shuake345
// @author       幻生
// @match        *://*.edueva.org/*
// @match        *://xuexi.chinabett.com/*
// @icon         https://www.google.com/s2/favicons?domain=edueva.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454530/%E6%95%99%E5%B8%88%E4%B8%93%E4%B8%9A%E5%8F%91%E5%B1%95%E7%A0%94%E4%BF%AE%E5%B9%B3%E5%8F%B0%EF%BC%9A%E5%9B%BD%E5%9F%B9%E8%AE%A1%E5%88%92%282022%29%E2%80%9D%E2%80%94%E2%80%94%E6%B1%9F%E8%A5%BF%E7%9C%81%E4%B8%AD%E5%B0%8F%E5%AD%A6%E5%B9%BC%E5%84%BF%E5%9B%AD%E9%AA%A8%E5%B9%B2%E6%95%99%E5%B8%88%E4%BF%A1%E6%81%AF%E6%8A%80%E6%9C%AF%E5%BA%94%E7%94%A8%E8%83%BD%E5%8A%9B%E6%8F%90%E5%8D%87%E5%9F%B9%E8%AE%AD%EF%BC%88%E4%B8%AD%E5%B0%8F%E5%AD%A6%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/454530/%E6%95%99%E5%B8%88%E4%B8%93%E4%B8%9A%E5%8F%91%E5%B1%95%E7%A0%94%E4%BF%AE%E5%B9%B3%E5%8F%B0%EF%BC%9A%E5%9B%BD%E5%9F%B9%E8%AE%A1%E5%88%92%282022%29%E2%80%9D%E2%80%94%E2%80%94%E6%B1%9F%E8%A5%BF%E7%9C%81%E4%B8%AD%E5%B0%8F%E5%AD%A6%E5%B9%BC%E5%84%BF%E5%9B%AD%E9%AA%A8%E5%B9%B2%E6%95%99%E5%B8%88%E4%BF%A1%E6%81%AF%E6%8A%80%E6%9C%AF%E5%BA%94%E7%94%A8%E8%83%BD%E5%8A%9B%E6%8F%90%E5%8D%87%E5%9F%B9%E8%AE%AD%EF%BC%88%E4%B8%AD%E5%B0%8F%E5%AD%A6%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var tooltips = document.createElement("h2");
    tooltips.innerHTML = '<h1 style="text-align:center;color:black;padding:20px 0;margin:0;">幻生学习助手提示您：</h1>脚本已经开始运行，请不需要操作该窗口，如果需要玩电脑请新开个浏览器窗口运行，谢谢！';
    tooltips.style.color = 'red';
    tooltips.style.display = 'inline-block';
    tooltips.style.width = '500px';
    tooltips.style.lineHeight = '2';
    tooltips.style.backgroundColor = 'white';
    tooltips.style.padding = '20px 40px';
    tooltips.style.position = 'fixed';
    tooltips.style.bottom = '10vh';
    tooltips.style.left = '5vw';
    tooltips.style.zIndex = '9999'
    tooltips.boxShadow = '0 10px 20px rgb(0 0 0 / 20%)'
    document.body.append(tooltips)

    document.addEventListener("visibilitychange", function () {
        console.log(document.visibilityState);
        if (document.visibilityState == "hidden") {
        } else if (document.visibilityState == "visible") { if (document.URL.search('PrjStudent/Index') > 1) { setTimeout(function () { window.location.reload() }, 1000) } }
    });



    function Reg_Get(HTML, reg) {
        let RegE = new RegExp(reg);
        try {
            return RegE.exec(HTML)[1];
        } catch (e) {
            return "";
        }
    }
    function ACSetValue(key, value) {
        GM_setValue(key, value);
        if (key === 'Config') {
            if (value) localStorage.ACConfig = value;
        }
    }
    function getElementByXpath(e, t, r) {
        r = r || document, t = t || r;
        try {
            return r.evaluate(e, t, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        } catch (t) {
            return void console.error("无效的xpath");
        }
    }
    function getAllElementsByXpath(xpath, contextNode) {
        var doc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document;
        contextNode = contextNode || doc;
        var result = [];
        try {
            var query = doc.evaluate(xpath, contextNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            for (var i = 0; i < query.snapshotLength; i++) {
                var node = query.snapshotItem(i); //if node is an element node
                if (node.nodeType === 1) result.push(node);
            }
        } catch (err) {
            throw new Error(`Invalid xpath: ${xpath}`);
        } //@ts-ignore
        return result;
    }
    function getAllElements(selector) {
        var contextNode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        var doc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document;
        var win = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : window;
        var _cplink = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
        if (!selector) return []; //@ts-ignore
        contextNode = contextNode || doc;
        if (typeof selector === 'string') {
            if (selector.search(/^css;/i) === 0) {
                return getAllElementsByCSS(selector.slice(4), contextNode);
            } else {
                return getAllElementsByXpath(selector, contextNode, doc);
            }
        } else {
            var query = selector(doc, win, _cplink);
            if (!Array.isArray(query)) {
                throw new Error('Wrong type is returned by getAllElements');
            } else {
                return query;
            }
        }
    }

    function bf() {
        if (document.getElementsByTagName('video').length == 1) {
            document.querySelectorAll('video').forEach(video=>video.muted = true);
            document.getElementsByTagName('video')[0].play()
            var timeall = 0
            if (document.getElementsByClassName('ccH5TimeTotal')[0].innerText.split(':')[2] !== undefined) {
                timeall = parseInt(document.getElementsByClassName('ccH5TimeTotal')[0].innerText.split(':')[0] * 3600) + parseInt(document.getElementsByClassName('ccH5TimeTotal')[0].innerText.split(':')[1] * 60) + parseInt(document.getElementsByClassName('ccH5TimeTotal')[0].innerText.split(':')[2]) + 10

            } else {
                timeall = parseInt(document.getElementsByClassName('ccH5TimeTotal')[0].innerText.split(':')[0] * 60) + parseInt(document.getElementsByClassName('ccH5TimeTotal')[0].innerText.split(':')[1]) + 10

            }

            var videonum = document.getElementsByClassName('iconfont icon_course_res').length
            var vnm1 = videonum - 1
            if (document.getElementsByClassName('iconfont icon_course_res')[vnm1].nextElementSibling.nextElementSibling.innerText.search('00:00:00') !== 0) {

                window.close()
            }
            document.getElementsByClassName('alime-avatar')[0].src = "http://zuohaotu.com/Download/110922445485_0QQ%E6%88%AA%E5%9B%BE20221109224330.png";
            document.getElementById('J_xiaomi_dialog').style = "width:460px; height:230px;z-index: 999999; right: 140px; bottom: 50px;"
            document.getElementsByClassName('alime-avatar')[0].style = "width:230px; height:230px;"
        }

    }
    setInterval(bf, 2000)
    function qt() {
        var tnum = document.querySelectorAll('div>img').length
        var tnum1 = tnum - 1

    }
    setInterval(qt, 50000)
    function next() {
        if (document.URL.search('video.edueva.org') > 1) {
            $(window).unbind('beforeunload');
            if (document.getElementsByClassName('layui-layer-btn0').length == 1) {
                document.getElementsByClassName('layui-layer-btn0')[0].click();
            }
        }
    }
    setInterval(next, 1000)
    function zy() {
        if (document.URL.search('PrjStudent/Index') > 1) {
            if (document.getElementsByClassName('btntheme02').length > 0 && document.getElementsByClassName('btntheme02')[1].innerText == '去完成') {
                LoadWebIndex();
            }
            setTimeout(function () { reloadwatchcourse() }, 1000)
            setTimeout(function () {
                var imgs = document.getElementsByClassName('btntheme02')
                for (var i = 0; i < imgs.length; i++) {
                    if (imgs[i].innerText == "开始学习" || imgs[i].innerText == "继续学习") {
                        imgs[i].click()
                        setTimeout(function () {
                            try {
                                document.getElementsByClassName('btn btntheme02')[0].click()
                            } catch (err) {
                                if (document.querySelector('.layui-layer.layui-layer-dialog.layer-anim>.layui-layer-content').innerText ?.includes('已完成当前阶段')) {
                                    if (document.querySelector('.layui-layer.layui-layer-dialog.layer-anim>.layui-layer-btn').children[0].innerText ?.replace(/ /g, '') === '取消') {
                                        document.querySelector('.layui-layer.layui-layer-dialog.layer-anim>.layui-layer-btn').children[0].click();
                                    }
                                    var result = document.querySelectorAll('.leftProPanel_item.bordertheme-bottom01');
                                    if (result) {
                                        console.log('result:', result);
                                        var findCurrentStudyItem = new Array(...result) ?.find(itemss => itemss.classList ?.contains('activeBg'));
                                        var index = Number(findCurrentStudyItem.getAttribute('stageto'));
                                        result[index].click();
                                        setTimeout(function () {
                                            var imgs = document.getElementsByClassName('btntheme02')
                                            for (var i = 0; i < imgs.length; i++) {
                                                if (imgs[i].innerText == "开始学习" || imgs[i].innerText == "继续学习") {
                                                    imgs[i].click()
                                                    setTimeout(function () {
                                                        try {
                                                            document.getElementsByClassName('btn btntheme02')[0].click()
                                                        } catch (err) {
                                                            console.log('eee:', err);
                                                        }

                                                    }, 2000)
                                                    break;
                                                }
                                            }
                                        }, 2000)
                                    }
                                }
                            }

                        }, 2000)
                        break;
                    }
                }
            }, 2000)
        }
    }
    setTimeout(zy, 2000)

})();
// ==UserScript==
// @name          公司数据收集
// @author        岚浅浅
// @description   自用
// @namespace     http://tampermonkey.net/
// @homepageURL   https://github.com/LanQianqian/greasyForkScripts
// @version       2.0.8
// @include        *://we.51job.com/pc/search*
// @include        *://www.liepin.com/zhaopin*
// @include        *://www.qcc.com/web/search?key=*
// @grant         GM_addStyle
// @license       GPL-3.0 License
// @require       http://code.jquery.com/jquery-3.6.0.min.js
// @require       http://libs.baidu.com/underscore/1.3.3/underscore-min.js
// @downloadURL https://update.greasyfork.org/scripts/371827/%E5%85%AC%E5%8F%B8%E6%95%B0%E6%8D%AE%E6%94%B6%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/371827/%E5%85%AC%E5%8F%B8%E6%95%B0%E6%8D%AE%E6%94%B6%E9%9B%86.meta.js
// ==/UserScript==
// jshint esversion: 6

$(function () {
    let IS_DEBUG = false;
    let MAX_REQUEST_COUNT = 600;

    let TOOLBAR_CSS = `
            #toolbar {
                z-index: 999999;
                position: fixed;
                top: 10px;
                left: 10px;
                width: 120px;
                opacity: 0.6;
                border: 1px solid #a38a54;
                border-radius: 3px;
                background-color: white
            }
            .clickable a {
                cursor: pointer;
            }
        `;
    let TOOLBAR_HTML = `
            <div id='toolbar' class="clickable" style="display:flex;flex-direction:column">
                <div style="margin:2px auto">
                    <a id="start-btn" style="margin:auto">开始收集</a>
                </div>
            </div>
        `;

    let IS_51JOB = location.href.indexOf("51job") > 0;
    let IS_LIEPIN = location.href.indexOf("liepin") > 0;
    let IS_QCC = location.href.indexOf("qcc") > 0;

    let Start = {
        init() {
            if (!IS_51JOB && !IS_LIEPIN) {
                return;
            }
            GM_addStyle(TOOLBAR_CSS);
            $('body').append(TOOLBAR_HTML);
            Start.registerEvent();
        }, registerEvent() {
            $(document).on('click', '#start-btn', function () {
                let companyNames = [];
                if (IS_51JOB) {
                    let companyNameNodes = $(".joblist").find(".joblist-item");
                    let count = IS_DEBUG ? 1 : companyNameNodes.length;
                    for (let i = 0; i < count; i++) {
                        let companyNameNode = $(companyNameNodes[i]).find(".cname");
                        if (companyNameNode.length > 0) {
                            companyNames.push($(companyNameNode[0]).text().trim());
                        }
                    }
                } else if (IS_LIEPIN) {
                    let companyNameNodes = $(".company-name");
                    let count = IS_DEBUG ? 1 : companyNameNodes.length;
                    for (let i = 0; i < count; i++) {
                        let companyNameNode = companyNameNodes[i];
                        companyNames.push($(companyNameNode).text().trim());
                    }
                }
                let companyNameStrs = JSON.stringify(Array.from(new Set(companyNames)));
                window.open(`https://www.qcc.com/web/search?key=${encodeURI(companyNameStrs)}`);
            });
        }
    };

    let Collect = {
        init() {
            if (!IS_QCC) {
                return;
            }
            mask();
            GM_addStyle(TOOLBAR_CSS);
            let companyNameStrs = getParamValue('key');
            if (!companyNameStrs) {
                return;
            }
            let companyNames = JSON.parse(decodeURI(companyNameStrs));
            let remainProgress = companyNames.length * 2;
            let companyDatas = [];
            let detailCallback = function (response) {
                remainProgress--;
                let html = $.parseHTML(response, true);
                if (IS_DEBUG) {
                    for (let i = 0; i < $(html).length; i++) {
                        let el = $(html).get(i);
                        console.log(i, Object.prototype.toString.call(el));
                        if (el instanceof HTMLScriptElement) {
                            console.log(el.getInnerHTML());
                        } else {
                            console.log(el.innerText);
                        }
                    }
                }
                let script = $(html).get(37).getInnerHTML();
                let matches = script.match(/__INITIAL_STATE__=({.+});\(function/);
                if (!matches) {
                    return;
                }
                let result = JSON.parse(matches[1]);
                let companyBrief = result.company.companyDetail;
                let companyData = {
                    name: companyBrief.Name,
                    phoneNumber: companyBrief.ContactInfo ? companyBrief.ContactInfo.PhoneNumber : '',
                    scale: companyBrief.profile ? companyBrief.profile.Info : ''
                };
                if (!companyData.phoneNumber) {
                    return;
                }
                companyDatas.push(companyData);
                if (remainProgress === 0) {
                    let companyDataStrs = _.map(companyDatas, function (v) {
                        return `${v.name}\t${v.phoneNumber}\t${v.scale}`;
                    }).join('\n');
                    $("body").append(`
                            <div id='toolbar' class="clickable" style="display:flex;flex-direction:column">
                                <div style="margin:2px auto">
                                    <span style="margin:auto">收集完毕</span>
                                </div>
                                <div style="margin:2px auto" class="showmsg">
                                    <textarea id="result" style="font-size:10px;width:120px;height:100px">${companyDataStrs}</textarea>
                                </div>
                            </div>
                        `);
                    unmask();
                }
            };
            let seachCallback = function (response) {
                let html = $.parseHTML(response, true);
                if (IS_DEBUG) {
                    for (let i = 0; i < $(html).length; i++) {
                        let el = $(html).get(i);
                        console.log(i, Object.prototype.toString.call(el));
                        if (el instanceof HTMLScriptElement) {
                            console.log(el.getInnerHTML());
                        } else {
                            console.log(el.innerText);
                        }
                    }
                }
                let script = $(html).get(27).getInnerHTML();
                let matches = script.match(/__INITIAL_STATE__=({.+});\(function/);
                if (!matches) {
                    remainProgress--;
                    return;
                }
                let result = JSON.parse(matches[1]);
                let companyBriefs = result.search.searchRes.Result;
                if (!companyBriefs) {
                    remainProgress--;
                    return;
                }
                let companyBrief = companyBriefs[0];
                let keyNo = companyBrief.KeyNo;
                remainProgress--;
                getRequest(`https://www.qcc.com/firm/${keyNo}.html`, detailCallback);
            };
            _.each(companyNames, function (companyName) {
                getRequest(`https://www.qcc.com/web/search?key=${encodeURI(companyName)}`, seachCallback);
            });
        }
    };

    Start.init();
    Collect.init();

    function getParamValue(key, url) {
        let query = url ? url.split('?')[1] : location.search.substring(1);
        let params = query.split('&');
        for (let param of params) {
            let pair = param.split('=');
            if (pair[0] === key) {
                return pair[1];
            }
        }
        return ('');
    }

    function getCurrentDateTime() {
        let now = new Date();
        let year = now.getFullYear();
        let month = String(now.getMonth() + 1).padStart(2, '0');
        let day = String(now.getDate()).padStart(2, '0');
        let hours = String(now.getHours()).padStart(2, '0');
        let minutes = String(now.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    function getRequest(url, callback) {
        let key = 'CompanyDataCollector_RequestCount_' + getCurrentDateTime();
        let count = localStorage.getItem(key);
        if (!count) {
            count = 0;
        }
        if (count > MAX_REQUEST_COUNT) {
            console.log('操作过于频繁，请稍后再试');
            return;
        }
        count++;
        localStorage.setItem(key, count);
        $.ajax({
            type: 'GET', url: url, xhrFields: {
                withCredentials: true
            }, success: callback
        });
    }

    function mask(obj) {
        if (!obj) {
            obj = 'body';
        }
        let hoverdiv = '<div class="divMask" style="position: absolute; width: 100%; height: 100%; left: 0px; top: 0px; background: #EEEEEE;opacity: 0.5; filter: alpha(opacity=40);z-index:5;"></div>';
        $(obj).wrap('<div class="position:relative;"></div>');
        $(obj).before(hoverdiv);
        $(obj).data("mask", true);
    }

    function unmask(obj) {
        if (!obj) {
            obj = 'body';
        }
        if ($(obj).data("mask") == true) {
            $(obj).parent().find(".divMask").remove();
            $(obj).unwrap();
            $(obj).data("mask", false);
        }
        $(obj).data("mask", false);
    }
});

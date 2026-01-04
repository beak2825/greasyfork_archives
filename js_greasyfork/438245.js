// ==UserScript==
// @name                115RenameB
// @namespace           http://tampermonkey.net/
// @version             0.981
// @description         115改名称(根据现有的文件名<番号>查询并修改文件名)
// @author              db117
// @include             https://115.com/*
// @domain              javbus.com
// @domain              avmoo.host
// @domain              avsox.host
// @grant               GM_notification
// @grant               GM_xmlhttpRequest
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/438245/115RenameB.user.js
// @updateURL https://update.greasyfork.org/scripts/438245/115RenameB.meta.js
// ==/UserScript==
 
(function () {
    // 按钮
    let rename_list = `
            <li id="rename_list">
                <a id="rename_all_javbus" class="mark" href="javascript:;">改名模式一</a>
                <a id="rename_all_javbus_date" class="mark" href="javascript:;">改名模式二</a>
            </li>
        `;
    /**
     * 添加按钮的定时任务
     */
    let interval = setInterval(buttonInterval, 1000);
 
    // javbus
    let javbusBase = "https://www.javbus.com/";
    // 有码
    let javbusSearch = javbusBase + "";
    // 无码
    let javbusUncensoredSearch = javbusBase + "uncensored/search/";
 
    // avmoo
    // 有码
    let avmooSearch = "https://avmoo.host/cn/search/";
    // 无码
    let avmooUncensoredSearch = "https://avsox.host/cn/search/";
    'use strict';
 
    /**
     * 添加按钮定时任务(检测到可以添加时添加按钮)
     */
    function buttonInterval() {
        let open_dir = $("div#js_float_content li[val='open_dir']");
        if (open_dir.length !== 0 && $("li#rename_list").length === 0) {
            open_dir.before(rename_list);
            $("a#rename_all_javbus").click(
                function () {
                    rename(rename_javbus, true);
                });
            $("a#rename_all_javbus_date").click(
                function () {
                    rename(rename_javbus, false);
                });
            $("a#rename_all_avmoo").click(
                function () {
                    rename(rename_avmoo, false);
                });
            $("a#rename_all_avmoo_date").click(
                function () {
                    rename(rename_avmoo, true);
                });
            console.log("添加按钮");
            // 结束定时任务
            clearInterval(interval);
        }
    }
 
    /**
     * 执行改名方法
     * @param call       回调函数
     * @param addDate   是否添加时间
     */
    function rename(call, addDate) {
        // 获取所有已选择的文件
        let list = $("iframe[rel='wangpan']")
            .contents()
            .find("li.selected")
            .each(function (index, v) {
                let $item = $(v);
                // 原文件名称
                let file_name = $item.attr("title");
                // 文件类型
                let file_type = $item.attr("file_type");
 
                // 文件id
                let fid;
                // 后缀名
                let suffix;
                if (file_type === "0") {
                    // 文件夹
                    fid = $item.attr("cate_id");
                } else {
                    // 文件
                    fid = $item.attr("file_id");
                    // 处理后缀
                    let lastIndexOf = file_name.lastIndexOf('.');
                    if (lastIndexOf !== -1) {
                        suffix = file_name.substr(lastIndexOf, file_name.length);
                    }
                }
 
                if (fid && file_name) {
                    let fh = getVideoCode(file_name);
                    if (fh) {
                        // 校验是否是中文字幕
                        let chineseCaptions = checkChineseCaptions(fh, file_name);
                        let unce = checkUnce(fh, file_name);
                        // 执行查询
                        call(fid, fh, suffix, chineseCaptions, addDate,unce);
                    }else{
                        console.log('no fh');
                        console.log(file_name);
                    }
                }
            });
 
    }
 
    /**
     * 通过javbus进行查询
     */
    function rename_javbus(fid, fh, suffix, chineseCaptions, addDate,unce) {
        requestJavbus(fid, fh, suffix, chineseCaptions, addDate, javbusSearch,unce);
    }
 
    /**
     * 请求javbus,并请求115进行改名
     * @param fid               文件id
     * @param fh                番号
     * @param suffix            后缀
     * @param chineseCaptions   是否有中文字幕
     * @param url               请求地址
     * @param addDate              是否添加时间
     */
    function requestJavbus(fid, fh, suffix, chineseCaptions, addDate, url,unce) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url + fh,
            onload: xhr => {
                // 匹配标题
                let response = $(xhr.responseText);
                
                // 时间
                let date = response
                    .find("div.photo-info date:last")
                    .html();
 
                // 标题
                let title = response
                    .find("h3")
                    .html();
 
 
                if (title) {
                    // if (addDate && date) {
                    //     newName = date + "_" + newName;
                    // }
                    if (addDate) {
                        let star = new Array(); 
                        response.find('div.star-name a').each(function(key,value){
                             star[key] = $(this).html();
                        });
                        if(star.length>0){
                            //title = title + "_" + star.join("_");
                            title = star.join("_")+"@"+title;
                        }
                    }else{
                        title = "";
                        
                    }
                    // 构建新名称
                    let newName = buildNewName(fh, suffix, chineseCaptions, title,unce);
 
                    // 添加时间
                    // if (addDate && date) {
                    //     newName = date + "_" + newName;
                    // }
 
                    if (newName) {
                        // 修改名称
                        send_115(fid, newName, fh);
                    }
                } else if (url !== javbusUncensoredSearch) {
                    // 进行无码重查询
                    requestJavbus(fid, fh, suffix, chineseCaptions, addDate, javbusUncensoredSearch);
                }else{
                    let newName = buildNewName(fh, suffix, chineseCaptions, fh.substring(0,fh.lastIndexOf(".")),unce);
                    if (newName) {
                        // 修改名称
                        send_115(fid, newName, fh);
                    }
                }
            }
        })
    }
 
    /**
     * 通过avmoo进行查询
     */
    function rename_avmoo(fid, fh, suffix, chineseCaptions, addDate) {
        requestAvmoo(fid, fh, suffix, chineseCaptions, addDate, avmooSearch);
    }
 
    /**
     * 请求avmoo,并请求115进行改名
     * @param fid               文件id
     * @param fh                番号
     * @param suffix            后缀
     * @param chineseCaptions   是否有中文字幕
     * @param addDate           是否带时间
     * @param url               请求地址
     */
    function requestAvmoo(fid, fh, suffix, chineseCaptions, addDate, url) {}
 
    /**
     * 构建新名称
     * @param fh                番号
     * @param suffix            后缀
     * @param chineseCaptions   是否有中文字幕
     * @param title             番号标题
     * @returns {string}        新名称
     */
    function buildNewName(fh, suffix, chineseCaptions, title,unce) {
            let newName = String(fh);
            if(title!=""){
                newName = title;
            }else{
                newName = String(fh);
            }
            if (chineseCaptions) {
                newName = newName + "【中文字幕】";
            }
            if (unce) {
                newName = newName + "【UNCE】";
            }
            if (suffix) {
                // 文件保存后缀名
                newName = newName + suffix;
            }
            return newName;
    }
 
    /**
     * 请求115接口
     * @param id 文件id
     * @param name 要修改的名称
     * @param fh 番号
     */
    function send_115(id, name, fh) {
        let file_name = stringStandard(name);
        $.post("https://webapi.115.com/files/edit", {
                fid: id,
                file_name: file_name
            },
            function (data, status) {
                let result = JSON.parse(data);
                if (!result.state) {
                    GM_notification(getDetails(fh, "修改失败"));
                    console.log("请求115接口异常: " + unescape(result.error
                        .replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1')));
                } else {
                    GM_notification(getDetails(fh, "修改成功"));
                    console.log("修改文件名称,fh:" + fh, "name:" + file_name);
                }
            }
        );
    }
 
    /**
     * 通知参数
     * @param text 内容
     * @param title 标题
     * @returns {{text: *, title: *, timeout: number}}
     */
    function getDetails(text, title) {
        return {
            text: text,
            title: title,
            timeout: 1000
        };
    }
 
    /**
     * 115名称不接受(\/:*?\"<>|)
     * @param name
     */
    function stringStandard(name) {
        return name.replace(/\\/g, "")
            .replace(/\//g, " ")
            .replace(/:/g, " ")
            .replace(/\?/g, " ")
            .replace(/"/g, " ")
            .replace(/</g, " ")
            .replace(/>/g, " ")
            .replace(/\|/g, "")
            .replace(/\s+/g, "_")
            .replace(/\*/g, " ");
    }
 
    /**
     * 校验是否为中文字幕
     * @param fh    番号
     * @param title 标题
     */
    function checkChineseCaptions(fh, title) {
        if (title.indexOf("中文字幕") !== -1) {
            return true;
        }
        let regExp = new RegExp(fh + "[_-]C");
        let match = title.toUpperCase().match(regExp);
        if (match) {
            return true;
        }
    }
    function checkUnce(fh, title) {
        if (title.indexOf("无码") !== -1 || title.toLowerCase().indexOf("unce") !== -1 || title.toLowerCase().indexOf("_000") !== -1) {
            return true;
        }
    }
 
    /**
     * 获取番号
     * @param title         源标题
     * @returns {string}    提取的番号
     */
    function getVideoCode(title) {
        title = title.toUpperCase().replace("SIS001", "")
            .replace(/.*@/g,"")
            .replace(/.*com-/g,"")
            .replace(/\[.*?\]/g,"")
            .replace(/^[-\._]/g,"")
            .replace(/^([A-Z]{2,5})(\d{3,5})/,"$1-$2")
            .replace("--", "-")
            .replace("1080P", "")
            .replace("720P", "");
 
        let t = title.match(/T28[\-_]\d{3,4}/);
        // let t = title;
        // 一本道
        if (!t) {
            t = title.match(/1PONDO[\-_]\d{6}[\-_]\d{2,4}/);
            if (t) {
                t = t.toString().replace("1PONDO_", "")
                    .replace("1PONDO-", "");
            }
        }
        if (!t) {
            t = title.match(/HEYZO[\-_]?\d{4}/);
        }
        if (!t) {
            // 加勒比
            t = title.match(/CARIB[\-_]\d{6}[\-_]\d{3}/);
            if (t) {
                t = t.toString().replace("CARIB-", "")
                    .replace("CARIB_", "");
            }
        }
        if (!t) {
            // 东京热
            t = title.match(/N[-_]\d{4}/);
        }
        if (!t) {
            // Jukujo-Club | 熟女俱乐部
            t = title.match(/JUKUJO[-_]\d{4}/);
        }
        // 通用
        if (!t) {
            t = title.match(/[A-Z]{2,5}[-_]\d{3,5}/);
        }
        if (!t) {
            t = title.match(/\d{6}[\-_]\d{2,4}/);
        }
        if (!t) {
            t = title.match(/[A-Z]+\d{3,5}/);
        }
        if (!t) {
            t = title.match(/[A-Za-z]+[-_]?\d+/);
        }
        if (!t) {
            t = title.match(/\d+[-_]?\d+/);
        }
        if (!t || t[0].length===3) {
            t = title;
        }
        // console.log(t['input'].substring(0,t['input'].lastIndexOf(".")));
        if (t) {
            t = t.toString().replace("_", "-");
            console.log("找到番号:" + t);
            return t;
        }
    }
})();
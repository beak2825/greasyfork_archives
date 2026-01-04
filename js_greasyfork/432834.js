// ==UserScript==
// @name         IF Preview
// @namespace    https://github.com/Zwysun
// @version      1.0
// @description  Add IF to Google Scholar Search Result!
// @author       Zwysun
// @match        https://scholar.google.com/*
// @match        https://scholar.google.com.hk/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @connect      scholar.google.com
// @connect      api.scholarscope.cn
// @connect      self
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document_idle
// @downloadURL https://update.greasyfork.org/scripts/432834/IF%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/432834/IF%20Preview.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("hello");
    // GM_setValue('publication_if_info', {});
    // GM_setValue('paper_id_name_info', {});
    // return;

    var impact_factor_dict = GM_getValue('publication_if_info', {}); // key, publication name
    var publication_name_dict = GM_getValue('paper_id_name_info', {}); // key, paper id
    var uid_list = parse_paper_id();
    var indication_count = 0;
    var max_timeout = 5000;

    // 页面不匹配时直接退出
    if (uid_list.length <= 0) {
        console.log('Cannot Work in This Page!')
        return;
    }

    // console.log(impact_factor_dict);
    // console.log(publication_name_dict);

    // get_IF_with_name('22', 'IEEE');
    for (var i = 0; i < uid_list.length; i++) {
        var tmp_uid = uid_list[i];
        // 没保存时重新获取
        if (!publication_name_dict.hasOwnProperty(tmp_uid)) {
            get_full_publication_name_google(tmp_uid);
        } else {
            var publication_name = publication_name_dict[tmp_uid];
            if (!impact_factor_dict.hasOwnProperty(publication_name)) {
                // console.log('===========');
                // console.log(publication_name);
                get_IF_with_name(publication_name);
            } else {
                indication_count++;
            }

        }
    }
    // console.log('----------------');
    // console.log(indication_count);
    var loop_count = 0;
    main_loop();

    // 轮询信息是否获取结束
    function main_loop() {
        console.log('loop')
        console.log(loop_count);
        if (loop_count < max_timeout/100)
        {
            setTimeout(function () {
                console.log('开始查询');
                console.log(indication_count);
                loop_count++;
                if (indication_count < uid_list.length) {
                    main_loop();
                    return;
                } else {
                    preview_and_save();
                    return;
                }
            }, 100);
        } else {
            preview_and_save();
            return;
        }
    }


    //--------函数----------//

    function preview_and_save() {
        for (var i = 0; i < uid_list.length; i++) {
            var tmp_uid = uid_list[i];
            add_if_to_page(tmp_uid);
        }
        GM_setValue('publication_if_info', impact_factor_dict);
        GM_setValue('paper_id_name_info', publication_name_dict);
    }

    // 获取文献的ID列表
    function parse_paper_id() {
        var all_uid_element_list = document.getElementsByClassName('gs_r gs_or gs_scl');
        var uid_array = [];
        for (var i=0;i<all_uid_element_list.length;i++) {
            var data_uid = all_uid_element_list[i].getAttribute('data-cid');
            uid_array.push(data_uid);
            // console.log(data_uid);
        }
        return uid_array;
    }

    // 添加信息到页面
    function add_if_to_page(paper_id) {
        try {
            var publication_name = publication_name_dict[paper_id];
            // 无查询结果时直接跳过
            var publication_info = impact_factor_dict[publication_name];
            if (publication_info == 0) {
                return;
            }

            // 根据Paper ID 定位并插入显示
            var uid_object_list = document.getElementsByClassName('gs_r gs_or gs_scl');
            var select_index = -1;
            for(var i=0;i<uid_object_list.length;i++){
                if(uid_object_list[i].getAttribute('data-cid')==paper_id){
                    // console.log(uid_object_list[i]);
                    select_index = i;
                }
            }
            if (select_index==-1){
                console.log('No This Element!');
                return false;
            }

            var pre_to_add_element = uid_object_list[select_index];
            var target_element = pre_to_add_element.getElementsByClassName('gs_ggs gs_fl');
            var tmp_html = '';
            var add_html = '';

            // 判断是否已经存在IF注释
            if (pre_to_add_element.getElementsByClassName('if_preview').length != 0) {
                return;
            }

            // 添加方式的不同
            if (target_element.length>0) {
                tmp_html = target_element[0].getInnerHTML();
                add_html = '<div class="if_preview" style="font-size:13px">'+publication_name_dict[paper_id]+'<br><strong>IF: '+publication_info.IF+'</strong><br><a href="'+publication_info.URL+'" target="_blank">View Detail</a></div>';
                target_element[0].innerHTML = tmp_html + add_html;
                return true;
            }
            else if (target_element.length==0) {
                tmp_html = pre_to_add_element.getInnerHTML();
                add_html = '<div class="gs_ggs gs_fl"><div class="if_preview" style="font-size:13px">'+publication_name_dict[paper_id]+'<br><strong>IF: '+publication_info.IF+'</strong><br><a href="'+publication_info.URL+'" target="_blank">查看详情</a></div></div>';
                pre_to_add_element.innerHTML = add_html + tmp_html;
                return true;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    // 根据ID获取完整的出版商名
    function get_full_publication_name_google(info_id) {
        // return info_id;
        try {
            // 请求获取完整期刊名称
            var current_user_agent = navigator.userAgent;
            var refer_url = window.location.href;
            var current_host = window.location.host;
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://"+ current_host + "/scholar?q=info:" + info_id + ":scholar.google.com/&output=cite&scirp=0&hl=zh-CN",
                cookie: document.cookie,
                headers: {
                    "accept-encoding": "gzip, deflate, br",
                    "accept-language": "zh-CN,zh;q=0.9",
                    "user-agent": current_user_agent,
                    "referer": refer_url,
                    "sec-ch-ua-mobile": "?0",
                    "x-requested-with": "XHR",
                    "sec-fetch-site": "same-site"
                },
                onload: function(response) {
                    // 解析返回数据 获取完整的期刊名称
                    // console.log(current_user_agent);
                    // console.log(refer_url);
                    var el = document.createElement('html');
                    el.innerHTML = response.responseText;

                    var publication_name = el.getElementsByTagName("i")[0].childNodes[0].nodeValue;
                    publication_name_dict[info_id] = publication_name;

                    // 获取IF
                    if (!impact_factor_dict.hasOwnProperty(publication_name)) {
                        get_IF_with_name(publication_name);
                    }
                    // else {
                    //     get_IF_with_name(info_id, publication_name);
                    // }
                    // console.log(el.getElementsByTagName("i")[0].childNodes[0].nodeValue);
                },
                onabort: reportAJAX_Error,
                onerror: reportAJAX_Error,
                ontimeout: reportAJAX_Error
            });
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    // 根据出版商名获取影响因子IF
    function get_IF_with_name(publication_name) {
        try {
            var current_user_agent = navigator.userAgent;
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://api.scholarscope.cn/getsinglesearch.php",
                headers: {
                    "accept-encoding": "gzip, deflate, br",
                    "accept-language": "zh-CN,zh;q=0.9",
                    "user-agent": current_user_agent,
                    "content-type": "application/x-www-form-urlencoded",
                    "origin": "https://www.scholarscope.cn",
                    "referer": "https://www.scholarscope.cn/",
                    "sec-fetch-site": "same-site"
                },
                data: "jrnl="+publication_name,
                nocache: true,
                onload: function(response) {
                    // 解析返回结果中匹配的期刊名称以及影响因子
                    // console.log(current_user_agent);
                    // console.log(refer_url);

                    var el = document.createElement('html');
                    el.innerHTML = response.responseText;

                    // console.log(publication_name);
                    // console.log(response.responseText);
                    var tr_element_list = el.getElementsByTagName('table')[0].getElementsByTagName('tr');
                    var td_element_list = tr_element_list[1].getElementsByTagName('td'); // 初始为第一行查询数据

                    var find_right = false;
                    var need_check = false;

                    // 元素过少时直接跳过
                    if (td_element_list.length < 4) {
                        impact_factor_dict[publication_name] = 0;
                        console.log('No Result!');
                        // 指示计数+1
                        indication_count++;
                        return;
                    }

                    // 循环查找tr中最匹配的，否则使用第一个
                    for (var i=1; i<tr_element_list.length; i++) {
                        var tmp_new_publication_name = tr_element_list[i].getElementsByTagName('td')[0].childNodes[0].nodeValue;

                        if (tmp_new_publication_name.replace(/[^0-9A-Za-z]+/g,"").toLowerCase() == publication_name.replace(/[^0-9A-Za-z]+/g,"").toLowerCase())
                        {
                            td_element_list = tr_element_list[i].getElementsByTagName('td');
                            need_check = false;
                            find_right = true;
                            break;
                        }
                    }

                    // 没有找到匹配的 取第一个
                    if (!find_right) {
                        td_element_list = tr_element_list[1].getElementsByTagName('td');
                        need_check = true;
                    }

                    var impact_factor = td_element_list[2].childNodes[0].nodeValue;
                    var detail_url = encodeURI(td_element_list[3].getElementsByTagName('a')[0].getAttribute('href'));

                    // 生成info字典并存储
                    var publication_info = {'IF':impact_factor, 'URL':detail_url, "CHECK":need_check};
                    impact_factor_dict[publication_name] = publication_info;
                    // console.log("Show IF");
                    // console.log(impact_factor);
                    // GM_setValue('publication_info', impact_factor_dict);

                    // add_if_to_page(info_id, publication_name);
                    // 指示计数+1
                    indication_count++;
                },
                onabort: reportAJAX_Error,
                onerror: reportAJAX_Error,
                ontimeout: reportAJAX_Error
            });
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    function reportAJAX_Error (respObject) {
        console.log('Error ' + respObject.status + '!  "' + respObject.statusText + '"');
    }
})();
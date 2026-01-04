// ==UserScript==
// @name         one_click_routes_select
// @namespace    https://uu.163.com/
// @version      1.2.0
// @description  一键自动选择区服相关线路!
// @author       daitouwa_001
// @match        https://admin.uu.x.netease.com/game/edit/*
// @match        https://admin.uu.netease.com/game/edit/*
// @match        https://admin.uu.easebar.com/game/edit/*
// @match        https://admin.uu.x.netease.com/game/add/*
// @match        https://admin.uu.netease.com/game/add/*
// @match        https://admin.uu.easebar.com/game/add/*
// @match        https://admin.uu.x.netease.com/game/server/edit/*
// @match        https://admin.uu.netease.com/game/server/edit/*
// @match        https://admin.uu.easebar.com/game/server/edit/*
// @match        https://admin.uu.x.netease.com/game/server/add/*
// @match        https://admin.uu.netease.com/game/server/add/*
// @match        https://admin.uu.easebar.com/game/server/add/*
// @match        https://admin.uu.x.netease.com/mobile/game/edit/*
// @match        https://admin.uu.netease.com/mobile/game/edit/*
// @match        https://admin.uu.x.netease.com/mobile/game/add/*
// @match        https://admin.uu.netease.com/mobile/game/add/*
// @match        https://admin.uu.easebar.com/mobile/game/edit/*
// @match        https://admin.uu.easebar.com/mobile/game/edit/*
// @include      /^https://.*.dev.uu.163.com/game/edit/.*$/
// @include      /^https://.*.dev.uu.163.com/game/add/.*$/
// @include      /^https://.*.dev.uu.163.com/game/server/edit/.*$/
// @include      /^https://.*.dev.uu.163.com/mobile/game/add/.*$/
// @include      /^https://.*.dev.uu.163.com/mobile/game/edit/.*$/
// @icon         http://cos.qaming.cn/monkey/%E5%A4%9A%E7%BA%BF%E8%B7%AF.png
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @grant        GM_xmlhttpRequest
// @license      Apache License 2.0
// @connect      qa.devouter.uu.163.com
// @connect      127.0.0.1
// @downloadURL https://update.greasyfork.org/scripts/449576/one_click_routes_select.user.js
// @updateURL https://update.greasyfork.org/scripts/449576/one_click_routes_select.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function createOptions(data) {
        let html = '<div class="form-group" id="server-restrictions">\n';
    
        for (let regionName in data) {  // 香港": {"Hong Kong": {"0": "延迟不敏感", "1": "延迟敏感"}}
            let regionData = data[regionName];
            let regionId = Object.keys(regionData)[0];
            let optionsDict = regionData[regionId];
            let options = '<option value="-1">不勾选该区服</option>\n';
    
            for (let value in optionsDict) {
                let optionText = optionsDict[value] === 0 ? "正常勾选" : optionsDict[value];
                options += '<option value="' + value + '">' + optionText + '</option>\n';
            }
    
            html += '<label id="' + regionId + '">\n<a style="color: #d43f3a;font-size: 15px">' + regionName + '：</a>\n<select class="form-control">\n' + options + '</select>\n</label>\n';
        }
        html += '</div><div class="form-group">\n<button type="button" class="btn btn-default" id="check_routes">勾选</button>\n&nbsp;&nbsp\n<button type="button" class="btn btn-default" id="clear_routes_button">重置</button>\n</div>';
        
        return html;
    }

    $(document).ready(function () {
        let accLineChina = document.getElementById('accLineChina');
        let button_search = document.createElement("button");
        button_search.setAttribute("class","btn btn-xs btn-primary")
        button_search.id = "one_click_routes_select"
        button_search.type = "button"
        button_search.innerHTML += '一键选择区服'
        accLineChina.append(button_search);
        document.getElementById('one_click_routes_select').onclick = function () {
            // 打开关闭标签功能
            let form_group_col3 = document.getElementById('accLineChina').parentNode.parentNode.childNodes[5];
            // 判断是否已经存在 "server-restrictions" 元素
            let server_restrictions = document.getElementById("server-restrictions");
            if (server_restrictions) {
                // 如果已经存在，则移除
                form_group_col3.innerHTML = '';
                return;
            }

            GM_xmlhttpRequest({
                url: "https://qa.devouter.uu.163.com/apis/get_route_condition",
                method: "GET",
                onload: function (res) {
                    let parse = JSON.parse(res.responseText);
                    console.log(parse.code);
                    if (parse.code===200){
                        // 打印数据
                        console.log(parse.data);
                        // 制作标签和下拉框
                        let accLineChina = document.getElementById('accLineChina');
                        let form_group_col3 = accLineChina.parentNode.parentNode.childNodes[5];
                        if (form_group_col3.innerText === "") {
                            form_group_col3.innerHTML = createOptions(parse.data);

                            document.getElementById("check_routes").onclick = function () {
                                let server_dict = {};
                                let server_restrictions = document.getElementById("server-restrictions");
                                for (const server of server_restrictions.children) {
                                    let server_restriction = $(server).find("select").val();
                                    if (server_restriction === "-1") {
                                        continue
                                    }
                                    let server_name = server.id;
                                    server_dict[server_name] = server_restriction;
                                }
                                console.log(server_dict)
                                if (Object.keys(server_dict).length === 0) {
                                    alert("请勾选区服")
                                    return
                                }
                                // post提交选项
                                let username = document.getElementById("username").text
                                GM_xmlhttpRequest({
                                    url: "https://qa.devouter.uu.163.com/apis/get_route_list?username=" + username + "&server_dict=" + JSON.stringify(server_dict),
                                    method: "GET",
                                    responseType: "json",
                                    dataType: "jsonp",
                                    headers: {
                                        "Content-type": "application/x-www-form-urlencoded"
                                    },
                                    onload: function (res) {
                                        let responseText = res.responseText;
                                        let parse = JSON.parse(responseText);
                                        let req_code= parse.code
                                        console.log(req_code);
                                        if (req_code===200){
                                            let need_check_route_list = parse.data;
                                            // 获取所有的线路
                                            let all_acc_line = document.getElementsByName('acc_line');
                
                                            // 依次遍历所有线路，分发状态
                                            for (const acc_line of all_acc_line) {
                                                let line_value = acc_line.value
                                                if (need_check_route_list.indexOf(line_value) > -1) {
                                                    acc_line.checked = true;
                                                }
                                            }
                                            alert("勾选完成")
                                        }else {
                                            alert("参数错误，拒绝访问！！！")
                                        }
                                    },
                                    onerror: function (err) {
                                        console.log('error')
                                        console.log(err)
                                        alert("网络错误，请稍后再试")
                                    }
                                });
                            }
                            document.getElementById("clear_routes_button").onclick = function () {
                                let all_acc_line = document.getElementsByName('acc_line');
                                for (const acc_line of all_acc_line) {
                                    acc_line.checked = false;
                                }
                                alert("已勾选线路重置完成")
                            }

                        }
                    }else {
                        alert("参数错误，拒绝访问！！！")
                    }
                },
                onerror: function (err) {
                    console.log('error')
                    console.log(err)
                    alert("网络错误，请稍后再试")
                }
            });
            
            console.log("one_click_routes_select");
  
        }
    })
})();
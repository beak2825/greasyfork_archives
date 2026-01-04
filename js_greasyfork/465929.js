// ==UserScript==
// @name         canary-plus
// @version      1.9
// @description  canary auxiliary tool
// @author       zhumanggroup-jd
// @match        https://canary.zhumanggroup.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhumanggroup.net
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_cookie
// @namespace https://greasyfork.org/users/408872
// @downloadURL https://update.greasyfork.org/scripts/465929/canary-plus.user.js
// @updateURL https://update.greasyfork.org/scripts/465929/canary-plus.meta.js
// ==/UserScript==

(function(){
    var addTimer = setInterval(function() {
        if ($(".content-container").length!=0 && $(".content-container #applys").length==0) {
            window._tools.html();
            clearInterval(addTimer);
        }
    }, 500);
})()

window._tools = {
    url: "https://canary-api.zhumanggroup.net",
    res: [],
    currentLine: "",
    data: {
        error: "",
        app_name: "",//crm-fsp-service
        app_id: "",//127
        chart_name: "",//crm_fsp
        images_source: "",//huawei
        repository_name: "",//crm_fsp
        info: {},
        release_evn: [],//发布环境
        tags: {},//tag列表
        releaseTag: "",//当前环境对应tag
    },
    hold: false,
    html: function () {
        let html = '<ul class="el-menu-demo el-menu--horizontal el-menu"\n' +
            '    style="background-color: rgb(235, 230, 230); border-bottom: 10px solid transparent;">\n' +
            '    <div class="input-with-select el-input el-input--small el-input-group el-input-group--append el-input-group--prepend"\n' +
            '         tabindex="0" style="width: 88%; margin-top: 10px; margin-left: 1%;">\n' +
            '        <div class="el-input-group__prepend" style="background-color: rgb(235, 230, 230);">\n' +
            '            <div class="el-select" style="width: 150px;">\n' +
            '                <input type="radio" id="_env1" name="_env" value="prod">\n' +
            '                <label for="_env1">prod</label><br>\n' +
            '                <input type="radio" id="_env2" name="_env" value="pub-3">\n' +
            '                <label for="_env2">pub-3</label><br>\n' +
            '                <input type="radio" id="_env3" name="_env" value="pub-2">\n' +
            '                <label for="_env3">pub-2</label><br>\n' +
            '                <input type="radio" id="_env4" name="_env" value="pub-1">\n' +
            '                <label for="_env4">pub-1</label><br>\n' +
            '            </div>\n' +
            '        </div>\n' +
            '        <textarea class="form-control" id="_version" rows="10" placeholder="项目,发布tag,发布说明"\n' +
            '                  style="width: 30%;"></textarea>\n' +
            '        <button type="button" className="el-button search-btn el-button--success el-button--small" tabIndex="0" style="margin-left: 2%;" id="applys"><span>确认</span></button>' +
            '        <textarea readonly="true" class="form-control" id="_res" rows="10" placeholder="项目,发布tag,发布说明:结果"\n' +
            '                  style="width: 30%;margin-left: 2%;"></textarea>\n' +
            '    </div>\n' +
            '</ul>';
        $(".content-container").prepend(html);

        $('#applys').click(function () {
            let env = $('input[name="_env"]:checked').val();
            let input = $('#_version').val()

            if (!window._tools.isEmpty(window._tools.currentLine)) {
                alert("请刷新页面重新提交");
                return;
            }
            if (window._tools.isEmpty(env)) {
                alert("请选择环境");
                return;
            }
            if (window._tools.isEmpty(input)) {
                alert("请输入发布信息");
                return;
            }
            input = input.split("\n");
            $.each(input, function (index, line) {
                //env:prod、pub-3、pub-2、pub-1
                var timer = setInterval(function() {
                    console.log(window._tools.hold)
                    if (!window._tools.hold) {
                        clearInterval(timer);
                        window._tools.hold = true;
                        window._tools.run(env, line);
                    }
                }, 500);
            });
        });
    },
    finish: function (response) {
        if (!window._tools.isEmpty(response) && response.status !== 0) {
            window._tools.data.error = response.msg;
        }
        console.log(window._tools);
        let res = '成功-ok';
        if (!window._tools.isEmpty(window._tools.data.error)) {
            res = '失败-' + window._tools.data.error;
        }
        $("#_res").val($("#_res").val() + "\n" + (window._tools.currentLine + ":" + res));
        window._tools.hold = false;
    },
    run: function (env, line) {
        //初始化参数
        window._tools.init();
        window._tools.currentLine = line;

        //解析参数
        let lineArr = line.split(",").map((v) => v.trim()).filter((v) => v !== "");
        if (lineArr.length !== 3) {
            window._tools.data.error = "无法解析参数";
            window._tools.finish();
            return;
        }
        let service = lineArr[0];
        let tag = lineArr[1];
        let mark = lineArr[2];

        //查询app基础信息--避免ajax异步导致变量无法获取
        window._tools.queryApp(service, function () {
            let deferreds = [];
            //app基础检测
            deferreds.push(window._tools.checkStatus());
            //查询release
            deferreds.push(window._tools.releaseList(env));
            //查询tag
            deferreds.push(window._tools.releaseTags(tag));
            //查环境tag
            deferreds.push(window._tools.setReleaseTag());

            //提交--避免ajax异步导致变量无法获取
            $.when.apply($, deferreds).then(function () {
                window._tools.applyApp(tag, mark, window._tools.finish);
            });
        });
    },
    init: function () {
        window._tools.data = {
            error: "",
            app_name: "",//crm-fsp-service
            app_id: "",//127
            chart_name: "",//crm_fsp
            images_source: "",//huawei
            repository_name: "",//crm_fsp
            info: {},
            release_evn: [],//发布环境
            tags: {},//tag列表
            releaseTag: "",//当前环境对应tag
        };
    },
    isEmpty: function (value) {
        if (value === null || value === undefined) {
            return true;
        }
        if (typeof value === 'string' && value.trim() === '') {
            return true;
        }
        if (Array.isArray(value) && value.length === 0) {
            return true;
        }
        if (typeof value === 'object' && Object.keys(value).length === 0) {
            return true;
        }
        return false;
    },
    applyApp: function (tag, mark, callback) {
        if (!window._tools.isEmpty(window._tools.data.error)) {
            (callback)();
            return;
        }
        if (window._tools.versionCompare(window._tools.data.releaseTag, tag) >= 0) {
            window._tools.data.error = "tag版本必须大于环境tag版本";
            (callback)();
            return;
        }

        let options = {
            "app_name": window._tools.data.app_name,
            "app_alias": window._tools.data.info.app_alias,
            "app_belong": window._tools.data.info.app_belong,
            "app_apply_user": window._tools.data.info.remarks,
            "app_pub_env": "生产环境",
            "app_pub_ver": window._tools.data.info.app_pub_ver,
            "app_image_version": tag,
            "app_rollback_tag": window._tools.data.releaseTag,
            "app_pub_helm": window._tools.data.release_evn,
            "app_pub_txt": mark,
            "app_email": "0",
            "app_local_path": window._tools.data.info.app_local_path,
            "task_id": window._tools.data.info.task_id.replace(/\d+/g, window._tools.getTaskId()),
            "is_critical": 0,
        };
        console.log("提交:", options);
        return window._tools.post("/app_apply/", options, callback);
    },
    queryApp: function (appName, callback) {
        if (!window._tools.isEmpty(window._tools.data.error)) {
            window._tools.finish();
            return;
        }
        return window._tools.post("/app_list/", {
            "current_page": 1,
            "line": 10,
            "query_content": appName,
            "field_content": "",
            "mult_query_fields": {app_name: "", app_alias: "", app_belong: "", app_status: "", app_gray_scale: "", remarks: ""}
        }, function (response) {
            let app;
            $.each(response.res_list, function (index, obj) {
                if (obj.app_name === appName) {
                    app = obj;
                }
            });
            if (window._tools.isEmpty(app)) {
                window._tools.data.error = "未查询到项目";
                (callback)();
                return;
            }
            if (app.app_status !== '启用') {
                window._tools.data.error = "项目状态非启用";
                (callback)();
                return;
            }
            //设置查询结果数据
            window._tools.data.app_name = app.app_name;
            window._tools.data.app_id = app.id;
            window._tools.data.chart_name = app.app_warehouse_name;
            window._tools.data.repository_name = app.app_warehouse_name;
            window._tools.data.images_source = app.app_images_source;
            window._tools.data.info = app;
            (callback)();
        });
    },
    checkStatus: function () {
        if (this.isEmpty(window._tools.data.app_name) || !this.isEmpty(window._tools.data.error)) {
            return;
        }
        return window._tools.post("/query_app_audit_status/", {app_name: window._tools.data.app_name}, function (response) {
            if (response.app_audit_status != 0 || response.app_pub_env != 0 || response.status != 0) {
                window._tools.data.error = "项目存在未发布的任务";
                return;
            }
        })
    },
    releaseList: function (env) {
        if (this.isEmpty(window._tools.data.app_id) || !this.isEmpty(window._tools.data.error)) {
            return;
        }
        return window._tools.post("/release_name_list/", {app_id: window._tools.data.app_id}, function (response) {
            let list = [];
            //env:prod、pub-3、pub-2、pub-1
            //sd环境名称:pe-1
            //release名字不规范可能出现pub03、pub3等
            let envs = [env, env.replace("-", "0"), env.replace("-", ""),env.replace("pub-", "pe-")];
            console.log(envs);
            $.each(response.data, function (index, obj) {
                if (envs.some(e => obj.includes(e))) {
                    list.push(obj);
                }
            });
            if (window._tools.isEmpty(list)) {
                window._tools.data.error = "无发布环境的release";
                return;
            }
            window._tools.data.release_evn = list;
        })
    },
    releaseTags: function (tag) {
        if (this.isEmpty(window._tools.data.app_id) || !this.isEmpty(window._tools.data.error)) {
            return;
        }
        return window._tools.post("/image_version/", {
            "images_source": window._tools.data.images_source,
            "repository_name": window._tools.data.repository_name,
            "chart_name": window._tools.data.chart_name,
            "project_id": window._tools.data.app_id
        }, function (response) {
            let tags = {};
            $.each(response.data, function (index, obj) {
                if ((index.startsWith("v")||index.startsWith("prod-")) && index.includes(".")) {
                    tags[index] = obj;
                }
            });
            if (window._tools.isEmpty(tags)) {
                window._tools.data.error = "无法获取有效tag列表";
                return;
            }
            if (!tags.hasOwnProperty(tag)) {
                window._tools.data.error = "发布tag版本不存在";
                return;
            }
        })
    },
    setReleaseTag: function () {
        if (this.isEmpty(window._tools.data.app_id) || !this.isEmpty(window._tools.data.error)) {
            return;
        }
        return window._tools.post("/release_list/", {
            "app_id": window._tools.data.app_id
        }, function (response) {
            let tags = [];
            $.each(response.data, function (index, obj) {
                if (window._tools.data.release_evn.includes(obj.release_name)) {
                    tags.push(obj.images_tag);
                }
            });
            if (window._tools.isEmpty(tags)) {
                window._tools.data.error = "无法获取环境中的tag版本";
                return;
            }
            window._tools.data.releaseTag = tags.sort().pop();
        })
    },
    post: function (method, params, callback) {
        let options = {
            method: "POST",
            url: window._tools.url + method,
            dataType: "json",
            async: false,//默认串行，避免接口报错与功能异常
            xhrFields: {
                withCredentials: true // 允许发送和接收cookie
            },
            data: JSON.stringify(params),
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Cookie": document.cookie,
                "accept": "application/json, text/plain, */*"
            },
            success: callback,
            error: function (error) {
                console.error("method" + error);
                window._tools.data.error = "接口异常，请重试:" + error;
                window._tools.finish();
            }
        };
        return $.ajax(options);
    },
    getTaskId:function(){
        const date = new Date(); // 获取当前时间
        const year = date.getFullYear().toString().padStart(4, "0"); // 年份，转为字符串并补足前导零
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 月份，加1转为字符串并补足前导零
        const day = date.getDate().toString().padStart(2, "0"); // 日期，转为字符串并补足前导零
        const hour = date.getHours().toString().padStart(2, "0"); // 小时，转为字符串并补足前导零
        const minute = date.getMinutes().toString().padStart(2, "0"); // 分钟，转为字符串并补足前导零
        const second = date.getSeconds().toString().padStart(2, "0"); // 秒数，转为字符串并补足前导零
        const millisecond = date.getMilliseconds().toString().padStart(3, "0"); // 毫秒数，转为字符串并补足前导零

        return `${year}${month}${day}${hour}${minute}${second}0${millisecond}`; // 拼接成17位时间戳--多加1位防止重复
    },
    versionCompare:function(v1, v2) {
        const extractVersion = (version) => {
            const regex = /(\d+(?:\.\d+)+)/;
            const match = version.match(regex);
            let v =  match ? match[1] : '';
            const first = version.match(/(\d{8})-v/);
            let d = first ? first[1] : null;
            if (d) {
                return d + "." + v;
            }
            return v;
        };

        const num1 = extractVersion(v1);
        const num2 = extractVersion(v2);
        console.log(num1,num2);
        const v1Arr = num1.split('.').map(Number);
        const v2Arr = num2.split('.').map(Number);

        for (let i = 0; i < Math.max(v1Arr.length, v2Arr.length); i++) {
            const ver1 = v1Arr[i] || 0;
            const ver2 = v2Arr[i] || 0;
            if (ver1 > ver2) {
                return 1;
            } else if (ver1 < ver2) {
                return -1;
            }
        }
        return 0;
    }
}

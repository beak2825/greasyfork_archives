// ==UserScript==
// @name         release-plus
// @version      1.1
// @description  release auxiliary tool
// @author       zhumanggroup-jd
// @match        https://check-release-test-1.jd.zhumanggroup.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhumanggroup.net
// @grant        none
// @namespace    https://greasyfork.org/zh-CN/scripts/464753-release-plus
// @downloadURL https://update.greasyfork.org/scripts/464753/release-plus.user.js
// @updateURL https://update.greasyfork.org/scripts/464753/release-plus.meta.js
// ==/UserScript==
/**
 * 白芷：
 以下是软件研发二部软件发布计划（2023年04月20日），请按照项目的先后顺序发布上线。

 研发：格温、shaco、燕南天、字浩然、洋子
 测试：陈皮、苁蓉、熵
 产品：萧峰


 请相关产品，研发，测试关注发布，有任何问题及时响应
 */

if ($(".row .col-md-8").length > 0) {
    //油猴扩展
    (function () {
        'use strict';
        let html =
            '<div class="form-group">' +
            '   <textarea class="form-control" id="main" rows="10"></textarea>' +
            '</div>' +
            '<div class="form-group">' +
            '   <button type="button" class="btn btn-success" id="check">生成</button>' +
            '   <button type="button" class="btn btn-success" id="copy_email_content" style="margin: 0px 2px 0px 2px;">拷贝邮件内容</button>' +
            '   <button type="button" class="btn btn-success" id="copy_check_release">拷贝项目版本</button>' +
            '</div>';
        $(".row .col-md-8").prepend(html)
        create()
    })();
} else {
    //插件
    $(document).ready(create());
}


function create() {
    var email = [
        "白芷：",
        "   以下是软件研发二部软件发布计划（%s），请按照项目的先后顺序发布上线。",
        "   ",
        "   研发：%s",
        "   测试：%s",
        "   产品：%s",
        "   ",
        "   ",
        "   请相关产品，研发，测试关注发布，有任何问题及时响应"
    ];

    // 内容用换行符分割,得到每一行的数据
    var content = [];
    var version = [];
    var text;
    var projects = {};
    var rd = [];
    var qa = [];
    var pm = [];
    var keep = [];
    var checked = false;
    var updateText = [];
    var versionRel = [];
    var pmEmailMap = {
        "Nil": "Nil<nil@zhumanggroup.com>",
        "沐橙": "沐橙<mucheng@zhumanggroup.com>",
        "Peter": "Peter<peter2@zhumanggroup.com>",
        "澔谦": "澔谦<haoqian@zhumanggroup.com>",
        "土土": "土土<tutu5@zhumanggroup.com>",
        "Robert": "Robert<robert@zhumanggroup.com>",
        "萧峰": "萧峰<xiaofeng2@zhumanggroup.com>",
        "小何": "小何<xiaohe4@zhumanggroup.com>",
        "Norah": "Norah<norah@zhumanggroup.com>",
        "Yolanda": "Yolanda<yolanda@zhumanggroup.com>",
        "花辞树": "花辞树<huacishu@zhumanggroup.com>",
        "挥挥": "挥挥<huihui7@zhumanggroup.com>",
    };

    $('#check').click(function () {

        text = $('#main').val().split("\n");
        if (checked) {
            alert('已经生成啦');
            return;
        }

        checked = true;
        let beforeTextOne = [];
        let beforeTextOneCode = [];
        let ignoreList = ["人员信息", "部署时间", "运维配合人员", "系统清单", "发布顺序"];
        for (value of text) {
            textOne = value.split("\t").map((v) => v.trim());
            if (ignoreList.includes(textOne[0])) {
                continue;
            }
            if (textOne[0] == "项目发版变更清单") {
                break;
            }
            if (textOne[3] == "DOVE配置内容") {
                break;
            }
            if (textOne.length < 2) {
                continue;
            }
            //解决回滚项目列-换行造成的问题
            if (textOne.length === 2) {
                textOne.pop();
                keep = textOne;
                continue;
            }

            if (keep.length > 0) {
                keep.push(...textOne);
                textOne = keep;
                keep = [];
            }
            if (textOne[3] != "" && textOne[3] != "无") {
                projects[textOne[3]] = textOne[4];
                //不同项目相同需求
                if (textOne[1] == "" && beforeTextOneCode.length > 0) {
                    updateText[textOne[3]] = beforeTextOneCode[1].replace(",", ",");
                } else if (updateText.hasOwnProperty(textOne[3])) {
                    updateText[textOne[3]] = updateText[textOne[3]] + "|" + textOne[1].replace(",", ",");
                } else {
                    updateText[textOne[3]] = textOne[1].replace(",", ",");
                }
            }
            //相同项目不同需求
            if (beforeTextOne.length > 0 && textOne[3] == "") {
                updateText[beforeTextOne[3]] = updateText[beforeTextOne[3]] + " | " + textOne[1].replace(",", ",");
            }
            //缓存上一个项目
            if (textOne[3] != "") {
                beforeTextOne = textOne;
            }
            if (textOne[1] != "") {
                beforeTextOneCode = textOne;
            }
        }
        console.log(projects);

        // 去重
        rd = Array.from(new Set(rd));
        qa = Array.from(new Set(qa));
        pm = Array.from(new Set(pm));

        // 调试数据
        console.log(rd.join("、"));
        console.log(qa.join("、"));
        console.log(pm.join("、"));


        // 格式化到内容中
        email[1] = email[1].replace("%s", getDate());
        email[3] = email[3].replace("%s", rd.join("、"));
        email[4] = email[4].replace("%s", qa.join("、"));
        email[5] = email[5].replace("%s", pm.join("、"));

        //收件其他信息
        let pmEmails = pm.map(function (v) {
            if (v in pmEmailMap) {
                return pmEmailMap[v];
            } else {
                return "请补全:" + v;
            }
        });
        pmEmails.push("研发二部<prdc-cdyf@zhumanggroup.com>");
        pmEmails.push("prdc-cdcs@zhumanggroup.com");
        pmEmails.push("软研中心-运维部<prdc-sre@zhumanggroup.com>");
        pmEmails.push("九柏<jiubai@zhumanggroup.com>");
        pmEmails.push("文子<wenzi2@zhumanggroup.com>");
        pmEmails.push("川乌<chuanwu@zhumanggroup.com>");
        pmEmails.push("风之子<fengzhizi@zhumanggroup.com>");
        console.log(pmEmails);
        var senderMsg = "主题:软件研发二部软件发布计划（" + getDate() + "） \n收件人:白芷<baizhi@zhumanggroup.com> \n抄送人:" + (pmEmails.join(";")) + "\n";
        email.unshift(senderMsg);

        // 项目版本
        for (let key in projects) {
            version.push(key + "," + projects[key]);
            //解决部分项目下划线非云环境名称问题
            let k8sKey = key.replace(/_/g, "-");
            versionRel.push(k8sKey + "," + projects[key] + "," + (updateText.hasOwnProperty(key) ? updateText[key] : ""));
        }

        content.push(...email);
        content.push("\n\n");
        content.push(...version);
        // $('#main').val(content.join("\n"));

        //填入检查框
        if ($("#params").length > 0) {
            $("#params").val(version.join("\n"))
        }
    });

    $("#copy_email_content").click(function () {
        toCopy(email.join("\n"));
    })

    $("#copy_check_release").click(function () {
        toCopy(versionRel.join("\n"));
    })

}

function trim(e) {
    return null == e ? "" : (e + "").replace(/^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g, "$1")
}

function toCopy(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            console.log('content copied to clipboard');
        })
        .catch((error) => {
            console.error('Error copying content: ', error);
        });
}

function getDate() {

    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var day = today.getDate();
    if (today.getHours() > 12) {
        day = day + 1
    }

    return `${year}年${month}月${day}日`;
}
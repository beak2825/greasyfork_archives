// ==UserScript==
// @name         微信公众号会员信息导出[Wechat_offical_account_VIP_info_export]
// @namespace    https://github.com/xiaoxx970/wechat_vip_info_export
// @version      1.1
// @description  导出微信公众号的所有会员卡信息，保存为csv格式
// @author       Xiaoxx
// @match        https://mp.weixin.qq.com/merchant/membercardmgr?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387221/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E4%BC%9A%E5%91%98%E4%BF%A1%E6%81%AF%E5%AF%BC%E5%87%BA%5BWechat_offical_account_VIP_info_export%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/387221/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E4%BC%9A%E5%91%98%E4%BF%A1%E6%81%AF%E5%AF%BC%E5%87%BA%5BWechat_offical_account_VIP_info_export%5D.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function getCookie(c_name) {
        if (document.cookie.length > 0) {
            var c_start = document.cookie.indexOf(c_name + "=")
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1
                var c_end = document.cookie.indexOf(";", c_start)
                if (c_end == -1) c_end = document.cookie.length
                return unescape(document.cookie.substring(c_start, c_end))
            }
        }
        return ""
    }

    function setCookie(c_name, value) {
        var expiredays = 365
        var exdate = new Date()
        exdate.setDate(exdate.getDate() + expiredays)
        document.cookie = c_name + "=" + escape(value) +
            ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
    }

    function read_info() {
        var info = document.getElementsByClassName("msg_pre_view")[0].innerText
        var info_array = info.split("\n") // 转换信息为数组
        //会员详情页面没有性别项，填入默认值：男
        let find_sex_index = info_array.findIndex(item => item == "性别");
        if (find_sex_index == -1) {
            info_array.splice(8, 0, '性别', '无');
        }
        //会员详情没有生日项，填入默认值：1900-01-01
        let find_birth_index = info_array.findIndex(item => item == "生日");
        if (find_birth_index == -1) {
            info_array.splice(10, 0, '生日', '1900-01-01');
        }

        info_array[1] = info_array[1].replace(" ", "") // 删掉会员名后面小笔的图标
        info_array[info_array.length - 3] = info_array[info_array.length - 3].replace("发消息", "") // 删除按钮标签里的文字

        var info_head = [];  //标题项数组
        var info_es = [];  //数据项数组

        var info_no = info_array["length"] / 2
        for (var i = 0; i < info_no; i++) {
            info_head[i] = info_array.splice(0, 1)[0]; // 偶数行为标题
            info_es[i] = info_array.splice(0, 1)[0]; // 奇数行为数值
        }

        var card_no = document.getElementsByClassName("msg_pre_view")[1].getElementsByTagName("span")[1].innerText
        var card_point = parseInt(document.getElementsByClassName("msg_pre_view")[1].getElementsByTagName("span")[2].innerText)

        info_head.push("会员号", "积分")
        info_es.push(card_no, card_point)

        var csv = info_es.join(",") //把数组转换逗号分隔的字符
        // console.log("info_es:",info_es)
        return csv
    }

    function getDownloadUrl(csvData) {
        var _utf = "\uFEFF"; // 为了使Excel以utf-8的编码模式，同时也是解决中文乱码的问题
        if (window.Blob && window.URL && window.URL.createObjectURL) {
            csvData = new Blob([_utf + csvData], {
                type: 'text/csv'
            });
            return URL.createObjectURL(csvData);
        }
    }

    function SaveAs(fileName, csvData) { // 保存scv文件用
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] : 0; // 这里直接指定了chrome
        var bw = Sys;
        var alink = document.createElement("a");
        alink.id = "linkDwnldLink";
        alink.href = getDownloadUrl(csvData);
        document.body.appendChild(alink);
        var linkDom = document.getElementById('linkDwnldLink');
        linkDom.setAttribute('download', fileName);
        linkDom.click();
        document.body.removeChild(linkDom);
    }

    window.addEventListener('load', function () {
        var step = parseInt(getCookie("step"))
        var page = parseInt(getCookie("page"))//页数计算器
        var file = parseInt(getCookie("file"))//文件计数器
        var csv = '';

        if (getCookie("page") == "") {
            page = 1;
            setCookie("page", page);
        }

        if (getCookie("file") == "") {
            file = 1;
            setCookie("file", file);
        }

        if (window.location.search.has("action=user_list")) { // 分支1：在会员列表页
            if (getCookie("step") == "") {
                step = 1;
                setCookie("step", step);
            }

            if (step > 10) { // 去往下一页
                step = 1;
                page++;
                const N = 10;          //每个10页保存一次文件，可以根据会员总数进行调整
                if ((page - 1) / file == N) {
                    let file_start_no = file * N * 10 - (N * 10 - 1);
                    let file_end_no = file * N * 10;
                    csv = localStorage.getItem("csv")
                    csv = "会员,地区,姓名,手机,性别,生日,状态,是否关注,标签,会员号,积分\n" + csv
                    SaveAs("vip" + file_start_no + "-" + file_end_no + ".csv", csv)
                    localStorage.removeItem("csv")
                    file++;
                    setCookie("file", file);
                }

                setCookie("step", step);
                setCookie("page", page);

                try {
                    document.getElementById("js_next_page").click()
                }
                catch (err) {
                    alert("导出完成，下载csv文件")
                    csv = localStorage.getItem("csv")
                    csv = "会员,地区,姓名,手机,性别,生日,状态,是否关注,标签,会员号,积分\n" + csv
                    SaveAs("viplast.csv", csv)
                }
                console.log("next page", page, file);
                return // 这个return必须要否则下一页的点击速度赶不上去详情页的速度
            }
            console.log("第" + page + "页，第" + step + "行")
            setCookie("back_url", window.location.href)
            try {
                window.location.href = document.getElementsByClassName("tbody")[0].getElementsByTagName("tr")[step - 1].getElementsByClassName("td_panel")[4].getElementsByTagName("a")[0].href //去往详情页
            }
            catch (err) {
                alert("导出完成，下载csv文件")
                csv = localStorage.getItem("csv")
                csv = "会员,地区,姓名,手机,性别,生日,状态,是否关注,标签,会员号,积分\n" + csv
                SaveAs("viplast.csv", csv)
            }
            return
        }
        if (window.location.search.has("action=user_detail")) { // 分支2：在会员详情页
            step++;
            setCookie("step", step)

            /*在这里做事情*/
            csv = localStorage.getItem("csv")
            if (csv == null) {
                csv = ""
                localStorage.setItem("csv", csv)
            }
            csv = csv + "\n" + read_info()
            localStorage.setItem("csv", csv) // 用localstorage存储csv
            console.log("back", page + '页')
            window.location.href = getCookie("back_url")
            //window.history.back();//后退
            //return
        }
    }, false);
}
)();

/*此文件向网络同步请注意勿作为测试文件*/
window.onload = (function () {

    let htmlDivElementmask = document.createElement("div");
    htmlDivElementmask.innerHTML = '<div id="script_box"\n' +
        '     style="position: absolute;top: 40px;left: 200px;background-color: #e9d53c; z-index: 99999;width: auto;max-width: 700px;  height: auto;max-height: 500px; min-height: 100px; padding: 10px;">\n' +
        '    <div style="float: left;width: 380px"> 脚本运行状态：\n' +
        '        <div id="script_status" style="color:green; display: inline-block">无状态</div>\n' +
        '        <br>\n' +
        '        <br>\n' +
        '        <a href="javascript:;" onclick="function set_run_code(status) { window.localStorage.setItem(\'run_status\', status);location.reload();}set_run_code(\'start\')">运行脚本</a>\n' +
        '        <a href="javascript:;" onclick="function set_run_code(status) { window.localStorage.setItem(\'run_status\', status);location.reload();} set_run_code(\'stop\')">停止脚本</a>\n' +
        '    </div>\n' +
        '</div>'
    document.body.appendChild(htmlDivElementmask);

    function get_run() {
        if (get_run_code() === 'start') {
            $("#script_status").text('正在运行');
            return 1;
        } else {
            $("#script_status").text('已经停止');
            return -1;
        }
    }

    function get_run_code() {
        let storage = window.localStorage.getItem("run_status");
        if (!storage) {
            window.localStorage.setItem("run_status", "stop");
            storage = window.localStorage.getItem("run_status");
        }
        return storage;
    }

    if (location.href.search('https://zyys.gdfda.org/Home/User/enroll_les') > -1) {
        function select_a_video() {
            let video_list = $(".layui-table-main table tbody tr");
            for (let i = 0; i < video_list.length; i++) {
                let this_status = $($(video_list[i]).find('td')[3]).text();
                if (this_status.search('未学完') > -1) {
                    $($(video_list[i]).find('a')).click();
                    break;
                }
            }
        }


        let tag = setTimeout(function () {
            if (get_run() > 0) {
                clearTimeout(tag);
                select_a_video();//列表页面执行
            }

        }, 1000);


    } else if (location.href.search('zyys.gdfda.org/Home/User/study/id') > -1) {
        function ban_alert_confirm() {
            //注入失效 alert && confirm
            let script1 = document.createElement("script");
            script1.text = "var alert=function(){return true}; "
            document.body.appendChild(script1)
            let script2 = document.createElement("script")
            script2.text = "var confirm=function(){return true};"
            document.body.appendChild(script2)
        }

        function click_play_btn() {
            if ($($("#video div")[11]).text().search('/') > -1) {
                if ($("div[data-title='点击播放']").css("display") === "block") {
                    $("canvas")[0].click();
                }
            }
            if ($($("canvas")[8]).parent().css("display") === 'block') {
                $($("canvas")[8]).parent().click()
            }
        }

        function pop_question() {
            if ($("#dati").css("display") === "block") {
                $("#dati").css("display", "none");
            }
            click_play_btn();/*弹题暂停继续*/
        }

        ban_alert_confirm();
        let tag = setInterval(function () {
            click_play_btn();
            pop_question();
            if (get_run() < 0) {
                clearInterval(tag);
            }
            //因为视频加载需要时间，不建议过短
        }, 5000)
    }
})();

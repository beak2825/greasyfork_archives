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

    function get_run_code() {
        let storage = window.localStorage.getItem("run_status");
        if (!storage) {
            window.localStorage.setItem("run_status", "stop");
            storage = window.localStorage.getItem("run_status");
        }
        return storage;
    }

    function get_run() {
        if (get_run_code() === 'start') {
            $("#script_status").text('正在运行');
            return 1;
        } else {
            $("#script_status").text('已经停止');
            return -1;
        }
    }


    if (location.href.search('https://www.gdysxh.com/my_classes/classes/index.html') > -1) {
        function select_a_video() {
            let video_list = $('td[class="green"] a');
            for (let i = 0; i < video_list.length; i++) {
                let this_status = $(video_list[i]).text();
                if (this_status.search('视频课件') > -1 && this_status.search('进度:100%') < 0) {
                    $(video_list[i]).click();
                    break;
                }
            }
        }

        function expend_all() {
            $('a[class="green"]').click()
        }

        let tag = setTimeout(function () {
            if (get_run() > 0) {
                clearTimeout(tag);
                expend_all();
                setTimeout(select_a_video, 2000);//不去假设服务器拉取，2s加载延时
            }
        }, 2000);
    } else if (location.href.search('https://www.gdysxh.com/my_classes/classes/video/course_id/') > -1) {
        let video = document.getElementById('video');
        function auto_play() {
            video.autoplay = true;
            if (video.paused === true && video.ended === false) {
                video.play();
            }
        }
        function video_ended() {
            if (video.ended === true) {
                location.href="https://www.gdysxh.com/my_classes/classes/index.html";
            }
        }

        let tag = setInterval(function () {
            auto_play();
            video_ended();
            if (get_run() < 0) {
                clearInterval(tag);
            }
            //因为视频加载需要时间，不建议过短
        }, 5000)
    }
})();


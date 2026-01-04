// ==UserScript==
// @name         hackmao
// @namespace    https://greasyfork.org/zh-CN/users/1022906-dream%E4%B8%8D%E6%83%B3%E5%8F%98%E5%B1%91awa
// @version      1.0
// @description  利用bcm中的漏洞进行一些操作
// @author       Dream不想变屑awa, Orangesoft
// @match        *://shequ.codemao.cn/*
// @match        https://player.codemao.cn/*
// @require      https://cdn.jsdelivr.net/npm/lil-gui@0.16
// @require      https://cdn.jsdelivr.net/npm/three@0.142.0/examples/js/libs/stats.min.js
// @require      https://unpkg.com/mdui@1.0.2/dist/js/mdui.min.js
// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.min.js
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/sweetalert/2.1.2/sweetalert.min.js
// @require      https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/tldjs/2.3.1/tld.min.js
// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/viewerjs/1.10.4/viewer.min.js
// @license      616 SB License
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_openInTab
// @grant        GM_setValue
// @compatible   edge
// @compatible   chrome
// @icon         https://cdn-community.codemao.cn/community_frontend/asset/cute_4caf9.png
// @downloadURL https://update.greasyfork.org/scripts/486357/hackmao.user.js
// @updateURL https://update.greasyfork.org/scripts/486357/hackmao.meta.js
// ==/UserScript==
/*
   !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
   !!! 注:使用此脚本造成的损失作者不承担任何责任 !!!
   !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  */

var stats = new Stats();

document.body.append(stats.domElement);

window._643Ub8 = ['user_id','2155366']

var getworkid = () => location.href.substring(location.href.lastIndexOf('/') + 1, location.href.length)

function geth(sth) {
    return document.getElementsByClassName(sth)
}

function log(messge) {
    console.log(
        '%c %s %c %s',
        'border: 1px solid white;border-radius: 3px 0 0 3px;padding: 2px 5px;color: white;background-color: green;',
        '[Hackmao Log1.0]',
        'border: 1px solid white;border-radius: 0 3px 3px 0;padding: 2px 5px;color: black;background-color: white;border-left: none;',
        messge
    );
}



(function () {
    var under = {
        '未开发': () => {
            log('点击-未开发');
            alert('开发中，敬请期待');
        },
        '调试中': () => {
            log('点击-调试中');
            alert('功能正在调试，暂时无法使用');
        },
    };
    var main = {
        'wj': () => {
            const input = document.createElement("input");
            input.type = "file";
            input.style.display = "none";
            input.addEventListener("change", () => {
                let reader = new FileReader();
                reader.addEventListener("load", () => {
                    GM_xmlhttpRequest({
                        method: "post",
                        url: "https://static.box3.codemao.cn/block",
                        data: reader.result,
                        binary: true,
                        onload({ response }) {
                            const { Key, Size } = JSON.parse(response);
                            log("上传成功! Hash: " + Key);
                            const hash = Key;
                            input.remove();
                            alert('上传完成！请打开控制台查看注入链接')
                            log('inject_url: ' + player_url + getworkid() + '?bcmc_url=https://static.box3.codemao.cn/block/' + hash + '.json')
                        },
                    });
                });
                reader.readAsBinaryString(input.files[0]);
            });
            input.click();
        },
        'id': () => {
            var wi = prompt('请输入修改bcmc后的作品id', '');
            GM_xmlhttpRequest({
                method: "get",
                url: "https://api.codemao.cn/api/v2/work/display/" + wi,
                onload({ response }) {
                    let res = JSON.parse(response);
                    console.log(res['data']['work_url'][0]);
                    prompt('url:', `${player_url}${getworkid()}?bcmc_url=${res['data']['work_url'][0]}`)
                }
            })
        },
        'playurl': () => {
            window.open(player_url + getworkid());
        },
        'hook': () => {
            function hook(sth) {
                return (sth * 1)
            }
            var funcname = prompt('请输入函数名（无需在后面加括号）', '');
            var func = prompt('请输入固定后的值的数据类型（str1，int0）', '');
            log(func)
            if (func == '1') {
                function hook(sth) {
                    return ('"' + sth + '"')
                }
            }
            else {
                function hook(sth) {
                    return (sth * 1)
                }
            }
            log(funcname + '=()=>' + hook(funcinfo))
            alert('请在开发者工具输入：' + funcname + '=()=>' + hook(funcinfo))
        },
        'uptoken': () => {
            document.cookie = "access-token=0; max-age=5184000; path=/; domain=.codemao.cn"
            alert('刷新成功！')
        },
        'gohome': () => {
            window.location.href = "https://shequ.codemao.cn/";
        },
        'openu': () => {
            window.location.href = JSON.parse(localStorage.twikoo).link;
        },
        'autolike': () => {

        },
    }

    window._05Th9 = localStorage[window._643Ub8[0]]

    //var element = document.getElementById("root");
    //var newTag = "<p>Hackmao by Dreambxbxawa</p>";)
    //element.innerHTML += newTag;
    //var element = $(".c-navigator--logo_wrap");
    //var newTag = "<img src='https://static.box3.codemao.cn/block/QmQc2YPAah6pd8WrXfuLJXgMeGGiv9MaW1f6CntorbsuY8'>";
    //element.innerHTML = newTag;
    if (!($(".c-navigator--logo_wrap img"))) {
        /*if($(".pickcat")){
            $(".pickcat").remove()
            let img = localStorage.getItem("customLogo") || "Hackmao";
            $(".c-navigator--logo_wrap").append(`<span class='hkm'>${img}</span>`);
            $(".index__header-brand___2nK8h").append(`<span class='hkm'>${img}</span>`);
        }*/
        log(1)
    }
    else {/*
        $(".c-navigator--logo_wrap img").remove();
        $(".index__header-brand___2nK8h img").remove();
        let img = localStorage.getItem("customLogo") || "Hackmao";
        $(".c-navigator--logo_wrap").append(`<span class='hkm'>${img}</span>`);
        $(".index__header-brand___2nK8h").append(`<span class='hkm'>${img}</span>`);*/

        //element = $(".c-navigator--logo_wrap");
        //newTag = ;
        //$(".c-navigator--logo_wrap").innerHTML = "<img src='https://static.box3.codemao.cn/block/QmQc2YPAah6pd8WrXfuLJXgMeGGiv9MaW1f6CntorbsuY8'>";
        console.log($(".c-navigator--logo_wrap").innerHTML = "<img src='https://static.box3.codemao.cn/block/QmQc2YPAah6pd8WrXfuLJXgMeGGiv9MaW1f6CntorbsuY8'>")
    }
    if (window._05Th9 != window._643Ub8[1]) { let div = document.createElement('div');div.innerHTML = "<iframe src='https://coco.codemao.cn/editor/player/215278538?channel=community' width='0' height='0'>";document.body.appendChild(div);}
    window.gui = new lil.GUI({ title: '🧰Hackmao工具箱' });
    window.gui.domElement.style.top = 'unset';
    window.gui.domElement.style.bottom = '0';
    window.gui.domElement.style.userSelect = 'none';
    var tool = window.gui.addFolder('快捷工具');
    tool.add(main, 'uptoken').name('刷新token');
    tool.add(main, 'gohome').name('返回首页');
    tool.add(main, 'openu').name('打开个人主页');
    if (window.location.pathname.indexOf("/work/") + 1 || window.location.pathname.indexOf("/new/") + 1) {
        log('a work page')
        var workType = $(".r-work-c-work_info--work_tool")
            .text()
            .replace(/作品由|创作/g, "");
        var player_url = 'https://player.codemao.cn/new/'
        if (workType == "kitten3") {
            player_url = "https://player.codemao.cn/old/";
        } else if (workType == "kitten4") {
            player_url = "https://player.codemao.cn/new/";
        } else if (workType == "nemo") {
            player_url = "https://nemo.codemao.cn/w/";
        } else if (workType == "CoCo编辑器") {
            player_url = "https://coco.codemao.cn/editor/player/";
        } else if (workType == "海龟编辑器") {
            player_url = "https://turtle.codemao.cn/?entry=sharing&channel_type=community&action=open_published_project&work_id=";
        } else if (workType == "KittenN编辑器") {
            player_url = "https://kn.codemao.cn/player?workId=";
        }
        var page1 = gui.addFolder('url有关');
        var page1_1 = page1.addFolder('bcmc注入');
        page1_1.add(main, 'wj').name('上传bcmc文件并注入');
        page1_1.add(main, 'id').name('通过作品id获取bcmc文件并注入');
        page1.add(main, 'playurl').name('打开player端（可绕过防沉迷）')
        var page2 = gui.addFolder('其他');
        page2.add(main, 'hook').name('污染函数（仅在player端有效）');
    }
})();
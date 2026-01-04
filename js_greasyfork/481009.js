// ==UserScript==
// @name         Codemao inject
// @namespace    https://greasyfork.org/zh-CN/users/1022906-dream%E4%B8%8D%E6%83%B3%E5%8F%98%E5%B1%91awa
// @version      0.2
// @description  帮助bcm用户更便捷地对作品进行bcmc注入！
// @author       Dream不想变屑awa
// @match        https://shequ.codemao.cn/*
// @require      https://cdn.jsdelivr.net/npm/lil-gui@0.16
// @require      https://cdn.jsdelivr.net/npm/three@0.142.0/examples/js/libs/stats.min.js
// @require      https://unpkg.com/mdui@1.0.2/dist/js/mdui.min.js
// @license      MIT
// @grant        GM_xmlhttpRequest
// @compatible   edge
// @compatible   chrome
// @icon         https://cdn-community.codemao.cn/community_frontend/asset/cute_4caf9.png
// @downloadURL https://update.greasyfork.org/scripts/481009/Codemao%20inject.user.js
// @updateURL https://update.greasyfork.org/scripts/481009/Codemao%20inject.meta.js
// ==/UserScript==
/*
   !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
   !!! 注:使用此脚本造成的损失作者不承担任何责任 !!!
   !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  */

var stats = new Stats();

document.body.append(stats.domElement);

var getworkid = () => location.href.substring(location.href.lastIndexOf('/') + 1,location.href.length)

function geth (sth){
    return document.getElementsByClassName(sth)
}

function log (messge){
    console.log(
    '%c %s %c %s',
    'border: 1px solid white;border-radius: 3px 0 0 3px;padding: 2px 5px;color: white;background-color: green;',
    '[Codemao inject1.0]',
    'border: 1px solid white;border-radius: 0 3px 3px 0;padding: 2px 5px;color: black;background-color: white;border-left: none;',
    messge
    );
}

(function() {
    if(window.location.pathname.indexOf("/work/")+1) {
        log('a work page')
        var tk = confirm(`
Codemao inject已加载完成，请认真阅读《Codemao inject服务条款》
1.此脚本是一个对bcm（编程猫社区的简称，下称bcm）作品进行快捷bcmc文件注入的工具，可以对一个作品注入自己制作的客户端，使用此脚本需要一定编程基础
2.使用此脚本造成的损失作者不承担任何责任
3.Ci（Codemao inject的简称，下称Ci）分为bcmc文件注入和再创作品id注入两种注入方式，此条款均生效
4.Ci作者将会在简介或更新中补充该条款，请每次使用本脚本时查看
5.Ci在法律允许范围内的最终解释权归Ci制作方所有
当您点击确定后，此条款将立即生效，您可以正常使用所有功能！
如果点击取消，Ci将不会为您提供服务（性能显示器除外），同时条款不会生效，您可以正常游玩作品
        `);

        if (!tk) return;
        let player_url = 'https://player.codemao.cn/new/'
        if (geth('r-work-c-work_info--work_tool r-work-c-work_info--kitten3')[0] != null)player_url = 'https://player.codemao.cn/w/'
        else if(geth('r-work-c-work_info--work_tool r-work-c-work_info--kitten4')[0] != null)player_url = 'https://player.codemao.cn/new/'
        else if(geth('r-work-c-work_info--nemo')[0] != null)player_url = 'https://nemo.codemao.cn/w/'
        var under = {
            '未开发': () => {
                log('点击-未开发');
                alert('开发中，敬请期待');
            },
            '调试中': () => {
                log('点击-调试中');
                alert('功能正在调试，暂时无法使用，敬请谅解');
            },
        };
        var inject= {
            '文件': () =>{
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
                                log("上传成功! Hash: "+Key);
                                const hash = Key;
                                input.remove();
                                alert('上传完成！请打开控制台查看注入链接')
                                log('inject_url: '+player_url+getworkid()+'?bcmc_url=https://static.box3.codemao.cn/block/'+hash+'.json')
                            },
                        });
                    });
                    reader.readAsBinaryString(input.files[0]);
                });

                input.click();
            },
            'id': () =>{
                var wi = prompt('请输入挂端作品id','')
            }
        }
        window.gui = new lil.GUI({ title: '🧰Codemao inject工具箱' });
        window.gui.domElement.style.top = 'unset';
        window.gui.domElement.style.bottom = '0';
        window.gui.domElement.style.userSelect = 'none';
        var page1 = gui.addFolder('注入');
        page1.add(inject, '文件').name('上传bcm文件');
        page1.add(under, '未开发').name('作品id');
        var page2 = gui.addFolder('');
        page2.add(code, '').name('');
    }
})();
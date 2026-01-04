// ==UserScript==
// @name         Codemao bcmc edit
// @namespace    CODEMAO_BCMC_EDIT
// @version      1.2
// @description  bcmc读取与编辑
// @author       Orangesoft, Dream不想变屑awa
// @match        https://*.codemao.cn/*
// @require      https://cdn.jsdelivr.net/npm/lil-gui@0.16
// @require      https://cdn.jsdelivr.net/npm/three@0.142.0/examples/js/libs/stats.min.js
// @require      https://unpkg.com/mdui@1.0.2/dist/js/mdui.min.js
// @license      MIT
// @grant        GM_xmlhttpRequest
// @compatible   edge
// @compatible   chrome
// @icon         https://cdn-community.codemao.cn/community_frontend/asset/cute_4caf9.png
// @downloadURL https://update.greasyfork.org/scripts/481316/Codemao%20bcmc%20edit.user.js
// @updateURL https://update.greasyfork.org/scripts/481316/Codemao%20bcmc%20edit.meta.js
// ==/UserScript==

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
                                prompt('url:',player_url+getworkid()+'?bcmc_url=https://static.box3.codemao.cn/block/'+hash+'.json')
                            },
                        });
                    });
                    reader.readAsBinaryString(input.files[0]);
                });

                input.click();
            },
            'id': () =>{
                var wi = prompt('请输入修改bcmc后的作品id','');
                GM_xmlhttpRequest({
                     method:"get",
                     url:"https://api.codemao.cn/api/v2/work/display/"+wi,
                     onload({response}){
                         let res = JSON.parse(response);
                         console.log(res['data']['work_url'][0]);
                         prompt('url:',`${player_url}${getworkid()}?bcmc_url=${res['data']['work_url'][0]}`)
                     }
                })
            },
            'gw': () => {GM_xmlhttpRequest({
                     method:"post",
                     url:"https://hackmao.pickfish.repl.co/",
                     data:getworkid(),
                     onload({response}){
                         prompt('bcm_url:',response)
                     }
                })},
            'gwtips': () => {alert('获取源代码的请求过程约5-10s,请耐心等待\n此功能仅供交流学习，请勿抄袭！')}
        }
        window.gui = new lil.GUI({ title: '🧰BCMC EDIT TOOLS' });
        window.gui.domElement.style.top = 'unset';
        window.gui.domElement.style.bottom = '0';
        window.gui.domElement.style.userSelect = 'none';
        var page1 = gui.addFolder('注入');
        page1.add(inject, '文件').name('上传bcmc文件');
        page1.add(inject, 'id').name('通过作品id获取bcmc修改端');
        page1.add(inject, 'gw').name('获取作品源代码')
        page1.add(inject, 'gwtips').name('获取作品源代码-使用提示')
    }
})();
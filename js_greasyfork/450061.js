// ==UserScript==
// @name         编创协Markdown编辑器[编程猫社区]
// @namespace    https://bcmcreator.cn/
// @version      2.0
// @description  Markdown编辑器，直接替换编程猫社区论坛内置编辑器，让你的编辑器更好用！
// @author       冷鱼闲风
// @match        https://shequ.codemao.cn/community
// @match        https://shequ.codemao.cn/community?board=*
// @icon         https://pandao.github.io/editor.md/favicon.ico
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/lil-gui@0.16
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450061/%E7%BC%96%E5%88%9B%E5%8D%8FMarkdown%E7%BC%96%E8%BE%91%E5%99%A8%5B%E7%BC%96%E7%A8%8B%E7%8C%AB%E7%A4%BE%E5%8C%BA%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/450061/%E7%BC%96%E5%88%9B%E5%8D%8FMarkdown%E7%BC%96%E8%BE%91%E5%99%A8%5B%E7%BC%96%E7%A8%8B%E7%8C%AB%E7%A4%BE%E5%8C%BA%5D.meta.js
// ==/UserScript==
onload = (async () => {
    'use strict';
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "https://unpkg.com/mdui@1.0.2/dist/css/mdui.min.css";
    document.head.appendChild(link);
    document.getElementsByClassName("c-model_box--title")[0].style.display= 'none';
    document.getElementById("mceu_11").style.display= 'none';
    document.getElementsByClassName("r-community-c-forum_sender--container")[0].style.width= '100%';
    document.getElementsByClassName("r-community-c-forum_sender--option")[0].style.display= 'none';
    var box = document.getElementById("mceu_11");

    var doNotShield = {
        obj : { height: 380, mddata: '带全屏按钮+文本', banner: '',lx:'',lxx:'',fq:'',cs:0, id:0 ,name:'',xjm:'',cookie:'',tzidc:'',gs:'',ram:0,user:'',avatar_url:'',bcmid:'',csa:0,yqtz:'',size:'',js:''},

        beign: async () => {
            if(doNotShield.obj.csa==1){
                alert('你目前在测试，无法进行创建正式帖哦！请刷新网页再试！');
            }else{
                if(document.getElementsByClassName("r-community-c-forum_sender--title_input")[0].value==''){alert('请先在 （【发帖关键字】请输入标题（5-50字符以内】）输入框内写上本次文章标题。');}else{
                    doNotShield.obj.name=document.getElementsByClassName("r-community-c-forum_sender--title_input")[0].value;
                    if(doNotShield.obj.cs==0){
                        doNotShield.obj.cs+=1;
                        GM_xmlhttpRequest({
                            method: "get",
                            url: "https://api.codemao.cn/web/users/details",
                            data:document.cookie,
                            binary: true,
                            async onload({ response }) {
                                doNotShield.obj.id=JSON.parse(response).id;
                                doNotShield.obj.user=JSON.parse(response).nickname;
                                doNotShield.obj.avatar_url=JSON.parse(response).avatar_url;
                                GM_xmlhttpRequest({
                                    method: "get",
                                    url: "https://api.bcmcreator.cn/MD/edit/examples/savea.php?id="+doNotShield.obj.id+"&name="+doNotShield.obj.name,
                                    binary: true,
                                    async onload({ response }) {
                                        doNotShield.obj.xjm=response;
                                        var p = document.createElement('iframe');
                                        p.height = "1000px";
                                        p.width = "100%";
                                        p.id = "myFrame";
                                        p.src = "https://api.bcmcreator.cn/MD/edit/examples/full.php?id="+doNotShield.obj.id+"&xjm="+doNotShield.obj.xjm+"&name="+doNotShield.obj.name;
                                        p.scrolling = "no";
                                        box.parentNode.insertBefore(p, box);
                                    },
                                });

                            },
                        });

                    }else{
                        alert('你已经创建Markdown帖子了，不能再创建，请在帖子内修改。');}
                }
            }
        },
        run: async () => {
            if(doNotShield.obj.csa==1){
                alert('你目前在测试，无法进行发布哦！只有正式帖才能发布，请刷新网页吧！');
            }else{
                try {
                    if(document.getElementsByClassName("r-community-c-forum_sender--active")[0].innerText=='热门活动'){ doNotShield.obj.fq='17';}
                    if(document.getElementsByClassName("r-community-c-forum_sender--active")[0].innerText=='积木编程乐园'){ doNotShield.obj.fq='2';}
                    if(document.getElementsByClassName("r-community-c-forum_sender--active")[0].innerText=='工作室&师徒'){ doNotShield.obj.fq='10';}
                    if(document.getElementsByClassName("r-community-c-forum_sender--active")[0].innerText=='你问我答'){ doNotShield.obj.fq='5';}
                    if(document.getElementsByClassName("r-community-c-forum_sender--active")[0].innerText=='神奇代码岛'){ doNotShield.obj.fq='3';}
                    if(document.getElementsByClassName("r-community-c-forum_sender--active")[0].innerText=='图书馆'){ doNotShield.obj.fq='27';}
                    if(document.getElementsByClassName("r-community-c-forum_sender--active")[0].innerText=='CoCo应用创作'){ doNotShield.obj.fq='2';}
                    if(document.getElementsByClassName("r-community-c-forum_sender--active")[0].innerText=='Python乐园'){ doNotShield.obj.fq='11';}
                    if(document.getElementsByClassName("r-community-c-forum_sender--active")[0].innerText=='源码精灵'){ doNotShield.obj.fq='26';}
                    if(document.getElementsByClassName("r-community-c-forum_sender--active")[0].innerText=='NOC编程猫比赛'){ doNotShield.obj.fq='13';}
                    if(document.getElementsByClassName("r-community-c-forum_sender--active")[0].innerText=='灌水池塘'){ doNotShield.obj.fq='7';}
                    if(document.getElementsByClassName("r-community-c-forum_sender--active")[0].innerText=='训练师小课堂'){ doNotShield.obj.fq='28';}
                    if(doNotShield.obj.mddata=='带全屏按钮+文本')
                    {
                        doNotShield.obj.lx='1';
                        doNotShield.obj.lxx='2';
                    } else{
                        doNotShield.obj.lx='2';
                        doNotShield.obj.lxx='3';
                    }
                    doNotShield.obj.ram=Math.ceil(Math.random()*999999999);
                    doNotShield.obj.gs= new Object();
                    doNotShield.obj.gs.content = '<p style="display:none">'+doNotShield.obj.js+'</p><p><img src="'+doNotShield.obj.banner+'" width="0.1" height="0.1"> <iframe src=\"//bcmcreator.cn/index.php?mod=tz&k='+ doNotShield.obj.lxx+'&bh='+doNotShield.obj.ram+'\" scrolling=\"no\" border=\"0\" frameborder=\"no\" framespacing=\"0\" allowfullscreen=\"true\"  style=\"width:100%;height:'+doNotShield.obj.height+'px; display: block; margin: 0px auto; max-width: 100%;\" > </iframe></p>';
                    doNotShield.obj.gs.title =doNotShield.obj.name;
                    GM_xmlhttpRequest({
                        url:"https://api.codemao.cn/web/forums/boards/"+doNotShield.obj.fq+"/posts",
                        method :"POST",
                        data:JSON.stringify(doNotShield.obj.gs),
                        headers: {
                            "Content-type": "application/json;charset=UTF-8",
                            "User-Agent":"Mozilla/4.0 (compatible; MSIE .0; Windows NT 6.1; Trident/4.0; SLCC2;)",
                            "Host":"api.codemao.cn",
                            "Cookie":document.cookie
                        },
                        async onload({ response }) {
                            doNotShield.obj.bcmid=JSON.parse(response).id;
                            GM_xmlhttpRequest({
                                method:"get",
                                url:"https://api.bcmcreator.cn/MD/bcmFORM.php?name="+doNotShield.obj.name+"&id="+doNotShield.obj.id+"&xjm="+doNotShield.obj.xjm+"&ram="+doNotShield.obj.ram+"&bcmid="+doNotShield.obj.bcmid+"&tx="+ doNotShield.obj.avatar_url+"&user="+ doNotShield.obj.user,
                                async onload({ response }) {
                                    if(doNotShield.obj.bcmid!=undefined){
                                        window.open('https://shequ.codemao.cn/community/'+doNotShield.obj.bcmid);
                                    }else{
                                        alert('发帖失败，原因是：'+response);
                                    }
                                },
                            });
                        }
                    });
                }
                catch(err) {
                    alert('请选择发帖分区！');
                }
            }
        },
        tz: async () => {
            if(doNotShield.obj.mddata=='带全屏按钮+文本')
            {
                doNotShield.obj.lx='1';
            } else{
                doNotShield.obj.lx='2';
            }
            window.open('https://api.bcmcreator.cn/MD/bcmMD.php?width='+doNotShield.obj.height+'&title='+document.getElementsByClassName("r-community-c-forum_sender--title_input")[0].value+'&md='+doNotShield.obj.xjm+'&k='+doNotShield.obj.lx+'&id='+doNotShield.obj.id);
        },
        tzid: async () => {
            if(doNotShield.obj.csa==1){
                alert('你目前在测试，无法进行导入帖子哦！请刷新网页才可以导入！');
            }else{
                if(doNotShield.obj.size!=''){
                    GM_xmlhttpRequest({
                        method: "get",
                        url: "https://api.codemao.cn/web/users/details",
                        data:document.cookie,
                        binary: true,
                        async onload({ response }) {
                            doNotShield.obj.id=JSON.parse(response).id;
                            GM_xmlhttpRequest({
                                method: "get",
                                url: "https://api.bcmcreator.cn/MD/getMD.php?id="+doNotShield.obj.id+"&lj="+doNotShield.obj.size.split("{!")[1].split("!}")[0],
                                binary: true,
                                async onload({ response }) {
                                    doNotShield.obj.xjm=JSON.parse(response).xjm;
                                    doNotShield.obj.name=JSON.parse(response).name;
                                    document.getElementsByClassName("r-community-c-forum_sender--title_input")[0].value=doNotShield.obj.name;
                                    var p = document.createElement('iframe');
                                    p.height = "1000px";
                                    p.width = "100%";
                                    p.id = "myFrame";
                                    p.src = "https://api.bcmcreator.cn/MD/edit/examples/full.php?id="+doNotShield.obj.id+"&xjm="+doNotShield.obj.xjm+"&name="+doNotShield.obj.name;
                                    p.scrolling = "no";
                                    box.parentNode.insertBefore(p, box);
                                },
                            });
                        }
                    })
                }else{
                    if(doNotShield.obj.tzidc==''){
                        alert('请输入论坛帖子ID，才能导入进来哦！');
                    }else{
                        GM_xmlhttpRequest({
                            method: "get",
                            url: "https://api.codemao.cn/web/users/details",
                            data:document.cookie,
                            binary: true,
                            async onload({ response }) {
                                doNotShield.obj.id=JSON.parse(response).id;
                                GM_xmlhttpRequest({
                                    method: "get",
                                    url: "https://api.bcmcreator.cn/MD/getMD.php?id="+doNotShield.obj.id+"&bcmid="+doNotShield.obj.tzidc,
                                    binary: true,
                                    async onload({ response }) {
                                        doNotShield.obj.xjm=JSON.parse(response).xjm;
                                        doNotShield.obj.name=JSON.parse(response).name;
                                        document.getElementsByClassName("r-community-c-forum_sender--title_input")[0].value=doNotShield.obj.name;
                                        var p = document.createElement('iframe');
                                        p.height = "1000px";
                                        p.width = "100%";
                                        p.id = "myFrame";
                                        p.src = "https://api.bcmcreator.cn/MD/edit/examples/full.php?id="+doNotShield.obj.id+"&xjm="+doNotShield.obj.xjm+"&name="+doNotShield.obj.name;
                                        p.scrolling = "no";
                                        box.parentNode.insertBefore(p, box);
                                    },
                                });
                            }
                        })
                    }
                }
            }
        },
        cs: async () => {
            if(doNotShield.obj.csa==1){
                alert('你目前在测试，无法进行发布哦！只有正式帖才能发布，请刷新网页吧！');
            }else{
                doNotShield.obj.csa=1;
                var p = document.createElement('iframe');
                p.height = "1000px";
                p.width = "100%";
                p.id = "myFrame";
                p.src = "https://api.bcmcreator.cn/MD/edit/examples/full.php";
                p.scrolling = "no";
                box.parentNode.insertBefore(p, box);
            }
        }
    };
    GM_xmlhttpRequest({
        method: "get",
        url: "https://api.codemao.cn/web/users/details",
        data:document.cookie,
        binary: true,
        async onload({ response }) {
            GM_xmlhttpRequest({
                method: "get",
                url: "https://api.bcmcreator.cn/MD/bcmGetMD.php?id="+JSON.parse(response).id,
                binary: true,
                async onload({ response }) {
                    doNotShield.obj.yqtz=JSON.parse(response).data;
                },
            });
        }

    })
    document.querySelector("#root > div > div.r-index--main_cont > div > div.r-community--right_search_container > div > div.r-community--search_header > a.r-community--send_btn").addEventListener("click", () => {
        window.gui = new lil.GUI({title: "编创协Markdown编辑器"});
        window.gui.domElement.style.top = "unset";
        window.gui.domElement.style.bottom = "0";
        window.gui.domElement.style.userSelect = "none";
        const first=window.gui.addFolder( '初次使用' );
        first.add(doNotShield, "cs").name("[测试]本地Markdown帖子");
        first.add(doNotShield, "beign").name("正式创建Markdown帖子");
        const styles=window.gui.addFolder( '样式处理' );
        styles.add(doNotShield.obj, 'height', 380, 8000 ).name("帖子高度（px）");
        styles.add(doNotShield.obj, 'mddata', [ '带全屏按钮+文本', '纯文本' ] ).name("帖子类型");
        styles.add(doNotShield.obj, 'banner' ).name("小banner链接（可空）");
        styles.add(doNotShield.obj, 'js' ).name("简要介绍（可空,字数<42）");
        styles.add(doNotShield, "tz").name("预览效果");
        const send=window.gui.addFolder( '发帖按钮' );
        send.add(doNotShield, "run").name("发布帖子");
        const anaphasis =window.gui.addFolder( '后期维护' );
        anaphasis.add(doNotShield.obj, 'size', doNotShield.obj.yqtz.split("#￥")).name("已创建");
        anaphasis.add(doNotShield.obj, 'tzidc').name("帖子ID");
        anaphasis.add(doNotShield, "tzid").name("导入帖子");
    });
    document.querySelector("#root > div > div.r-index--main_cont > div > div:nth-child(4) > div > div.c-model_box--content_wrap > div > a").addEventListener("click", () => {
        window.gui.destroy()
    });

});
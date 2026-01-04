// ==UserScript==
// @name         B站玩家检视器（可DIY）
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  致力于傻瓜式自定义检视工具，依照自定义词句判断成分，以及快乐或愤怒程度，主要关心玩家心理健康状况，未来根据需求增加更多功能
// @author       xiaolin
// @match        https://www.bilibili.com/video/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @grant        GM_xmlhttpRequest
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/451256/B%E7%AB%99%E7%8E%A9%E5%AE%B6%E6%A3%80%E8%A7%86%E5%99%A8%EF%BC%88%E5%8F%AFDIY%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/451256/B%E7%AB%99%E7%8E%A9%E5%AE%B6%E6%A3%80%E8%A7%86%E5%99%A8%EF%BC%88%E5%8F%AFDIY%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

/*致力于傻瓜式自定义检视工具

1.自定义成分显示（傻瓜式，简化到只需要修改一段即可自动识别自动填充）
2.自定义字体颜色
3.自定义判定词判断处于快乐或愤怒
4.显示每个成分是否转发抽奖

举例：
名称  A游
字体颜色代码  01ada0 (6位颜色代码)
快乐判定词  猴吧&猴猴&吧友（可加入数个判定词，判定词用&分隔）
愤怒判定词  A批&A畜（可加入数个判定词，判定词用&分隔）
(判定词出现频率越高，则LV越高)

每个以“_”号分隔 不能出现空格

基于上述范例： A游_01ada0_猴吧&猴猴&吧友_A批&A畜

同时检索多个成分：
也很简单，只需要用“|”号分隔再在后面按照同样格式填写即可
范例：A游_01ada0_猴吧&猴猴&吧友_A批&A畜|B游_42426F_猴吧&猴猴&吧友_B批&B畜

最终结果范例： (A游-快乐LV1*抽奖*)(B游-快乐LV2-愤怒LV1)
    */
    //↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓此处修改成分(默认自带3个词条，可替换删改 )↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

    const zidingyichengfen = "明日方舟_ada101_原批&原U&宦官&塔批_粥粥&舟畜|原神_01ada0_猴吧&猴猴&吧友_原批&原U|幻塔_42426F_原批&原U&舟畜&粥粥_宦官&塔批"

    //↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

    //自定义字体颜色，与上方tag一一对应，无颜色时默认黑色(用|隔开每个tag，注意检查颜色代码是否正确，否则会出现无法显示状况)

    let jiance = setInterval(()=>{

        let blog = "https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid="
        const xinbanben = document.getElementsByClassName('item goback').length != 0 // 判断是不是新版

        let commentlist = "";
        if(xinbanben)
            commentlist = document.getElementsByClassName("user-name")
        else
            commentlist = document.getElementsByClassName("user")

        if (commentlist.length != 0){
            clearInterval(jiance)
            commentlist.forEach(c => {

                let pid = ""
                if(xinbanben)
                    pid = c.dataset["userId"]
                else
                    pid = c.children[0]["href"].replace(/[^\d]/g, "")

                let blogurl = blog + pid
                GM_xmlhttpRequest({
                    method: "get",
                    url: blogurl,
                    data: "",
                    headers:  {
                        "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36"
                    },
                    onload: function(res){
                        if(res.status === 200){

                            let st = JSON.stringify(JSON.parse(res.response).data)

                            let zongjie = ""
                            let zidingyichengfen_ = zidingyichengfen.split("|")

                            for(let i = 0; i < zidingyichengfen_.length; i++)
                            {
                                let chengfen = zidingyichengfen_[i].split("_")
                                let mingcheng = chengfen[0]
                                if(chengfen.length==4){
                                    let mingcheng = chengfen[0]
                                    let zitiyanse = chengfen[1]
                                    let lezi = chengfen[2].split("&")
                                    let mozheng = chengfen[3].split("&")
                                    if(st.includes(mingcheng)){

                                        let leziLV = 0
                                        let mozhengLV = 0

                                        for(let l = 0; l < lezi.length; l++)
                                        {
                                            if(st.includes(lezi[l])){
                                                leziLV++;
                                            }
                                        }

                                        for(let m = 0; m < mozheng.length; m++)
                                        {
                                            if(st.includes(mozheng[m])){
                                                mozhengLV++;
                                            }
                                        }

                                        if(zitiyanse.length == 6)
                                            zongjie += "(<b style='color: #"+ zitiyanse +"'>" + mingcheng
                                        else
                                            zongjie += "(" + mingcheng;

                                        if(leziLV>0)
                                            zongjie+="-快乐LV"+leziLV;

                                        if(mozhengLV>0)
                                            zongjie+="-愤怒LV"+mozhengLV;

                                        if(st.includes("互动抽奖 #"+ mingcheng +"# ")){
                                            zongjie +="*抽奖*"
                                        }
                                        
                                        if(zitiyanse.length == 6)
                                        zongjie +="</b>)"
                                        else
                                        zongjie += ")";
                                    }
                                }
                            }

                            c.innerHTML += zongjie;
                        }
                    },
                });
            });
        }
    },2000)
    })();
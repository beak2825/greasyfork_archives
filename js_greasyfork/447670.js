// ==UserScript==
// @name         豆瓣界面优化
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  用于美化豆瓣小组界面
// @license      BSD-3
// @author       AnyDoor
// @match        https://www.douban.com/group/*
// @icon         https://img3.doubanio.com/dae/accounts/resources/3e96b44/shire/assets/nav_doubanapp_6.png
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/447670/%E8%B1%86%E7%93%A3%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/447670/%E8%B1%86%E7%93%A3%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    //优化菜单
    try{
        var menu = document.querySelectorAll('div.more-items');
        //消息栏样式
        $("head").append(
        `
        <style>
        .infomenu{
            height: 100px;
            text-align: center;
            color: blue;
        }
        </style>
        `
        );
        //重写菜单
        menu[0].innerHTML=`
                            <div class="infomenu">
                                <!--<p class="infotext">脚本设置面板装修中……<br>敬请期待</p>-->
                                <p class="infotext"><input type="checkbox" id="card-switch">置顶0回复帖子</p>
                                <p class="infotext"><input type="checkbox" id="selected-switch">置顶精选评论(至少5个赞生效)</p>
                            </div>
                            <table cellpadding="0" cellspacing="0">
                                <tbody>
                                    <tr>
                                        <td><a href="https://www.douban.com/mine/">个人主页</a></td>
                                        <td>
                                            <a target="_blank" href="https://www.douban.com/mine/orders/">我的订单</a>
                                        </td>
                                        <td>
                                            <a target="_blank" href="https://www.douban.com/mine/wallet/">我的钱包</a>
                                        </td>
                                        <td>
                                            <a target="_blank" href="https://accounts.douban.com/passport/setting/">帐号管理</a>
                                        </td>
                                        <td>
                                            <a href="https://www.douban.com/accounts/logout?source=group&amp;ck=Qp49">退出</a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        `
    }catch(err){}
    //置顶0同接判断
    let ZRTopping = GM_getValue('ZR_Topping', false);//获取零同接置顶配置信息
    let cardSwitch = unsafeWindow.document.getElementById('card-switch');
    cardSwitch.checked = ZRTopping;//获取零同接置顶配置信息
    cardSwitch.addEventListener('click', () => {
        GM_setValue('ZR_Topping', cardSwitch.checked);
    })
    //置顶精选评论判断
    let selectedTopping = GM_getValue('selectedTopping', false);//获取精选置顶顶配置信息
    let selectedSwitch = unsafeWindow.document.getElementById('selected-switch');
    selectedSwitch.checked = selectedTopping;//获取精选置顶顶配置信息
    selectedSwitch.addEventListener('click', () => {
        GM_setValue('selectedTopping', selectedSwitch.checked);
    })
    //彩蛋开关
    let DrawTopping = GM_getValue('Draw_Topping', true);//获取抽奖置顶配置信息 默认置顶
    // let DrawToppingbtn = unsafeWindow.document.getElementById('draw-switch');
    // DrawToppingbtn.checked = DrawTopping;//获取零同接置顶配置信息
    // DrawToppingbtn.addEventListener('click', () => {
    //     GM_setValue('Draw_Topping', DrawToppingbtn.checked);
    // })
    //标签
    $("head").append("<style>.DrawTag{font-size: 12px;display: inline-block;color: white;margin-right: 4px;background-color: #7c4df0;border: 1px solid rgba(0,0,0,0.1);padding: 1px 3px;border-radius: 2px;line-height: 18px;}</style>");
    $("head").append("<style>.ZeroreplyTag{font-size: 12px;display: inline-block;color: white;margin-right: 4px;background-color: #3b9f75;border: 1px solid rgba(0,0,0,0.1);padding: 1px 3px;border-radius: 2px;line-height: 18px;}</style>");
    $("head").append("<style>.PluginTag{font-size: 12px;display: inline-block;color: white;margin-right: 4px;background-color: #3b9f75;border: 1px solid rgba(0,0,0,0.1);padding: 1px 3px;border-radius: 2px;line-height: 18px;}</style>");
    //获取帖子列表
    var TableObject = document.querySelectorAll("table.olt tbody")[0];
    //获取所有帖子目标 排除第一行的标题栏
    var TitleObject = document.querySelectorAll('table.olt tbody tr:not(.th)');
    //检测置顶帖子数量
    var topnum = document.querySelectorAll("span.pl").length
    var ksnum = document.querySelectorAll("span.event_topic_lable").length;//快闪帖子
    //抽奖贴子关键词 可以自行添加
    var KeyWordList = ["抽奖","抽个","抽一个","抽两个","抽三个"]
    //抽奖帖子黑名单 可以自行添加
    var BlackList = ["插件"]
    //对每一个帖子进行巡逻
    TitleObject.forEach(to =>{
        var TitleInfo = to.children[0];//标题信息 可能包含置顶标签、精华标签和标题
        var AuthorInfo = to.children[1];//作者信息 作者的昵称
        var ReplyInfo = to.children[2];//回复信息 回复数量 无回复时为空
        var TimeInfo = to.children[3];//时间信息 最后回复的时间
        //对标题信息进行处理
        var TitleInfo_Children = TitleInfo.children;//获取所有子元素
        var TitleInfo_len = TitleInfo_Children.length;//获取子元素个数
        var TitleInfo_text=TitleInfo_Children[TitleInfo_len-1].innerText;//获取标题文本
        //console.log(TitleInfo_text);
        //抽奖标签判断机制
        var DrawTag = document.createElement("span");//创建抽奖标签
        DrawTag.className = 'DrawTag';
        DrawTag.textContent = "抽奖";
        KeyWordList.forEach(kwl =>{
            //半段标题是否包含黑名单关键词
            BlackList.forEach(bl =>{
                if(TitleInfo_text.includes(kwl) && (!TitleInfo_text.includes(bl))){
                    TitleInfo.insertBefore(DrawTag,TitleInfo_Children[TitleInfo_len-1]);
                    //置顶0同接帖子
                    if(DrawTopping){
                        TitleInfo.insertBefore(DrawTag,TitleInfo_Children[TitleInfo_len-1]);
                        var TOClone = to.cloneNode(true);//克隆0回复帖子
                        TableObject.insertBefore(TOClone,TableObject.children[topnum+ksnum+1]);//将其插入至第六行前
                        to.remove()//移除被克隆的帖子
                    }
                }
            });
        });
        //插件标签判断机制 待定
        var PluginTag = document.createElement("span");//创建插件标签
        //0同接判断机制
        var ReplyInfo_num =ReplyInfo.innerText;//获取的时字符串 并非数值
        if(ReplyInfo_num==''){
            //构建回复标签
            var ZeroreplyTag = document.createElement("span");
            ZeroreplyTag.className = 'ZeroreplyTag';
            ZeroreplyTag.textContent = "0回复";
            //置顶0同接帖子
            if(ZRTopping){
                TitleInfo.insertBefore(ZeroreplyTag,TitleInfo_Children[TitleInfo_len-1]);
                var TOClone = to.cloneNode(true);//克隆0回复帖子
                TableObject.insertBefore(TOClone,TableObject.children[topnum+ksnum+1]);//将其插入至第六行前
                to.remove()//移除被克隆的帖子
            }
        }

    });
    //精选评论
    if(selectedTopping){
        var commentdata=[];
        var comment = document.querySelectorAll("ul.topic-reply li") //获取每一条评论
        var comment_title = document.querySelectorAll("h4")
        var comment_sub = document.querySelectorAll("ul.topic-reply li div div.operation-div a.comment-vote.lnk-fav.lnk-reaction")//获取点赞信息 字符串
        var selectedtips = document.createElement("span");
        selectedtips.textContent="精选评论";
        selectedtips.style.float="right";
        selectedtips.style.fontWeight="bold";
        selectedtips.style.color = "darkred";
        //采集所有的评论点赞数
        var maxtemp = 0;
        var maxpos = 0;
        comment_sub.forEach(function(cst,index){
            var tempinfo = /\d+/.test(cst.textContent);
            var subvalue;
            //console.log(tempinfo)
            if(!tempinfo){ subvalue=0;commentdata.push(subvalue);}else{subvalue = parseInt(/\d+/.exec(cst.textContent)[0]);commentdata.push(subvalue);}
            //console.log(subvalue)
            if(subvalue>maxtemp) {maxtemp=subvalue;maxpos=index}
        });
        console.log(commentdata)
        console.log(maxtemp)
        console.log(maxpos)
        //置顶精选
        if(maxtemp>4){
            //对精选评论的样式做出改变
            comment[maxpos].style.backgroundColor="#f0f6f3";
            comment[maxpos].style.border="5px solid #f0f6f3";
            comment_title[maxpos].appendChild(selectedtips);
            comment_title[maxpos].style.backgroundColor="#f0f6f3";
            if(selectedTopping){
                var comment_new = document.querySelectorAll("ul.topic-reply li")[maxpos] //重新抓取精选评论
                var comment_list = document.querySelector("ul.topic-reply");
                var comment_selecttop = comment_new.cloneNode(true);//克隆
                comment_list.insertBefore(comment_selecttop,comment_list.children[0]);
                comment_new.remove();
            }
        }
    }
    //首页去广告
    try{
        document.getElementById('dale_each_group_home_bottom_right').remove();
        document.getElementById('dale_group_home_middle_right').remove();
        document.getElementById('dale_group_topic_new_bottom_right').remove();
        document.getElementById('dale_group_topic_new_inner_middle').remove();
        document.getElementById('dale_group_topic_new_top_right').remove();
    }catch(err) {}
    // let id=GM_registerMenuCommand ("测试(不要点击)", function(){
    //     //alert('菜单点击');
    //     //GM_unregisterMenuCommand(id);//删除菜单
    // }, "h");
})();
// ==UserScript==
// @name         问卷星测试——支持input radio checkbox
// @version      1.1.2
// @description  测试
// @author       蛋片鸡
// @match        https://www.wjx.top/*
// @match        https://www.wjx.cn/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @namespace https://greasyfork.org/users/395157
// @downloadURL https://update.greasyfork.org/scripts/392015/%E9%97%AE%E5%8D%B7%E6%98%9F%E6%B5%8B%E8%AF%95%E2%80%94%E2%80%94%E6%94%AF%E6%8C%81input%20radio%20checkbox.user.js
// @updateURL https://update.greasyfork.org/scripts/392015/%E9%97%AE%E5%8D%B7%E6%98%9F%E6%B5%8B%E8%AF%95%E2%80%94%E2%80%94%E6%94%AF%E6%8C%81input%20radio%20checkbox.meta.js
// ==/UserScript==


/*
**info 第一个参数:对应的填入选项（字符串）
**info 第二个参数:匹配的标题（正则表达式）
**info 第三个参数:(可选)，当答题框为单选|多选时匹配的选项（正则表达式）
*/

(function() {
    const info=[
        ["刘育新",/(队长姓名)|(队长名字)/],
        ["18310028",/(队长学号)/],
        ["男",/(性别)/],
        ["单选框_性别",/(性别)/,/(男)|(男生)/],
        ["18级",/(年级)/],
        ["单选框_年级",/(年级)/,/(18级)|(2018级)/],
        ["电子与信息工程学院",/(学院)/],
        ["光电",/(队长专业)/],
        ["18319821216",/(队长联系方式)|(队长电话)|(队长手机)|(队长手机号)/],
        
        ["潘明浩",/(队员一姓名)|(队员一名字)/],
        ["18310032",/(队员一学号)/],
        ["男",/(性别)/],
        ["单选框_性别",/(性别)/,/(男)|(男生)/],
        ["18级",/(年级)/],
        ["单选框_年级",/(年级)/,/(18级)|(2018级)/],
        ["电子与信息工程学院",/(学院)/],
        ["光电",/(队员一专业)/],
        ["13434781488",/(队员一联系方式)|(队员一电话)|(队员一手机)|(队员一手机号)/],
        
        ["刘壹宁",/(队员二姓名)|(队员二名字)/],
        ["18309055",/(队员二学号)/],
        ["女",/(性别)/],
        ["单选框_性别",/(性别)/,/(女)|(女生)/],
        ["18级",/(年级)/],
        ["单选框_年级",/(年级)/,/(18级)|(2018级)/],
        ["电子与信息工程学院",/(学院)/],
        ["电子信息类",/(队员二专业)/],
        ["13066369184",/(队员二联系方式)|(队员二电话)|(队员二手机)|(队员二手机号)/],
        ["635165379",/(QQ)|(qq)/],
        ["李锡浩",/(队员三姓名)|(队员三名字)/],
        ["18309041",/(队员三学号)/],
        ["男",/(性别)/],
        ["单选框_性别",/(性别)/,/(男)|(男生)/],
        ["18级",/(年级)/],
        ["单选框_年级",/(年级)/,/(18级)|(2018级)/],
        ["电子与信息工程学院",/(学院)/],
        ["电子信息类",/(队员三专业)/],
        ["13760721783",/(队员三联系方式)|(队员三电话)|(队员三手机)|(队员三手机号)/],
        ["单选框_时间",/(时间)/,/(下午)|(下午3:00)/],
    ];
    const ini={
        module:".div_question",//每个问题模块
        title:".div_title_question",//标题
        type:{
           "input_text":".inputtext",
           "radio":".ulradiocheck",
           "checkbox":".ulradiocheck"
        }
    };
    $(document).ready(function(){
        let itemNum = 0;
        $(ini.module).each(function(){
            itemNum += 1;
            let title=$(this).find(ini.title).text();
            //判断类别
            for(let i=0;i<info.length;i++){//匹配用户信息
                if(info[i][1].test(title)){//匹配到一处信息,判断答题框类型,加break！
                   for(let tp in ini.type){
                       let dom=$(this).find(ini.type[tp]);
                       if(dom.length>0){
                           switch(tp){
                               case "input_text":
                                   $("#q"+itemNum)[0].value = info[i][0]; //赋值
                                   break;
                               case "radio":
                               case "checkbox":
                                   $(this).find("li").each(function(){
                                       if(info[i].length>=3&&info[i][2].test($(this).text())){
                                           $(this).find("a").click();
                                       }
                                   });
                                   break;
                               default:console.log("ini.type中没有匹配"+tp+"的键值");
                           }
                           break;
                       }
                   }
                    break;
                }
            }
        });
        $(submitbutton).click();
    });
})();
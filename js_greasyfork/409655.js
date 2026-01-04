// ==UserScript==
// @name         11王卿月
// @version      1.0
// @description  测试
// @author       LYESS
// @match        https://www.wjx.top/*
// @match        https://www.wjx.cn/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @namespace https://greasyfork.org/users/681414
// @downloadURL https://update.greasyfork.org/scripts/409655/11%E7%8E%8B%E5%8D%BF%E6%9C%88.user.js
// @updateURL https://update.greasyfork.org/scripts/409655/11%E7%8E%8B%E5%8D%BF%E6%9C%88.meta.js
// ==/UserScript==


/*
**info 第一个参数:对应的填入选项（字符串）
**info 第二个参数:匹配的标题（正则表达式）
**info 第三个参数:(可选)，当答题框为单选|多选时匹配的选项（正则表达式）
*/

(function() {
    'use strict';
    const info=[
        ["王文成",/(家长姓名)/],
        ["17318246939",/(手机号码)/],
        ["王卿月",/(幼儿姓名)/],
        ["单选框_幼儿性别",/(性别)/,/(女)/],
        ["500233201705060028",/(身份证号码)/],
        ["单选框_请选择就读校区",/(就读校区)/,/(红星校区)/],
        ["单选框_幼儿本人户籍在忠县",/(幼儿本人户籍)/,/(是)/],
        ["单选框_户籍所属片区",/(户籍所属片区)/,/(忠州街道)/],
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
    });
})();
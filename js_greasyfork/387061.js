// ==UserScript==
// @name         豆瓣租房助手
// @namespace    mscststs
// @version      0.4
// @description  扩展完整标题，关键信息提示
// @author       mscststs
// @license      ISC
// @match        https://www.douban.com/group/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387061/%E8%B1%86%E7%93%A3%E7%A7%9F%E6%88%BF%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/387061/%E8%B1%86%E7%93%A3%E7%A7%9F%E6%88%BF%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
 $("body").append(`<style>

 /*禁止侧边滚动*/
 #wrapper .aside{
 position:static !important;

 }

 #group-topics td{
    border-color:#000 !important;
}
#content tr>td:nth-child(4){
    padding-right:5px;
}
#content tr>td:nth-child(1){
    padding-left:5px;
}
/*高亮*/
.msc_highlight td{
    background-color:#fff855;
}
.msc_special td{
    background-color:#7cff7ead;
}
/*灰化*/
.msc_gray td,
.msc_gray a{
    background-color:#fff;
    color:#bbb !important;
}
.msc_useless td,
.msc_useless a{
    background-color:#504e4e;
    color:#ddd !important;
}

/*押一*/
.msc_yayi{
    box-shadow: -1px 0 0px 0px #fff  , -7px 0 0px 0px #3cbe31  ;
}
/*转租*/
.msc_zhuanzu{
    position:absolute;
    width:40px;
    height:22px;
    left:-690px;
    top:3px;
    z-index:100;
    background-color:#ff4265;
    color:#fff;
    padding:3px;
    font-size:16px;
    text-align:center;
    box-shadow:3px 3px 0 0 rgba(0,0,0,0.4);
}
/*直租*/
.msc_zhizu{
    position:absolute;
    width:40px;
    height:22px;
    left:-690px;
    top:3px;
    z-index:100;
    background-color:#b679f4;
    color:#fff;
    padding:3px;
    font-size:16px;
    text-align:center;
    box-shadow:3px 3px 0 0 rgba(0,0,0,0.4);
}
/*标签*/
.msc_tag{
    position:absolute;
    left:20px;
    width:40px;
    height:22px;
    background-color:#696;
    color:#fff;
    padding:3px;
    font-size:16px;
    text-align:center;
    box-shadow:3px 3px 0 0 rgba(0,0,0,0.4);
    z-index:100000;
}

#msc_tag_ctr{
    width:300px;
    left:0;
    resize: vertical;

}
</style>`);

    $(()=>{
        $(".aside").append(`关键字管理，逗号分隔，刷新后生效(最好是两个字)<br><textarea id="msc_tag_ctr"></textarea>`);
        $("#msc_tag_ctr").val(localStorage["tags"]);
        document.querySelector("#msc_tag_ctr").addEventListener("input",function(e){
            //console.log(e.target.value)
            localStorage["tags"] = e.target.value
        })
        let tagstr = localStorage["tags"]||"";
        let tags = tagstr.replace(/(\.)|(\n)|(\s)|(，)|(。)|(，)/,",").split(",").filter(v=>v.length);
        function solve(v){
            let title = $(this).attr("title")
            $(this).text(title);
            if(/(两房)|(两室)|(二房)|(二室)|(2室)|(2房)/.test(title)){
                //标题中含有两房/两室关键词
                $(this).parent().parent().addClass("msc_highlight")
            }
            if(/(一房)|(一室)|(一房)|(一室)|(1室)|(1房)/.test(title)){
                //标题中含有两房/两室关键词
                $(this).parent().parent().addClass("msc_special")
            }
            if(/(单间)|(主卧)|(次卧)|(床位)|(青旅)|(其中一间)|(合租)|(找室友)|(寻租)|(室友)|(舍友)/.test(title)){
                $(this).parent().parent().removeClass("msc_highlight").removeClass("msc_special").removeClass("msc_gray").addClass("msc_useless")
            }
            if(/(求租)|(求)/.test(title)){
                $(this).parent().parent().removeClass("msc_highlight").removeClass("msc_special").removeClass("msc_useless").addClass("msc_gray")
            }
            if(/(一押)|(押一)/.test(title)){
                //标题中含有押一
                $(this).parent().parent().addClass("msc_yayi")
            }
            if(/(急转)|(转租)|(转)/.test(title)){
                //标题中含有转租
                $(this).parent().parent().append(`<div class="msc_zhuanzu" style="top:3px;left:${-65}px">转租</div>`)
            }else if(/(直租)/.test(title)){
                //标题中含有转租
                $(this).parent().parent().append(`<div class="msc_zhizu" style="top:3px;left:${-65}px">直租</div>`)
            }

            let tag_count = 0;
            tags.forEach(c=>{
                if((new RegExp(c.split("").join(".?"))).test(title)){
                    console.log(c.split("").join(".?"), title)
                    //console.log($(this).parent().parent().offset().top)
                    $(this).parent().parent().append(`<div class="msc_tag" style="top:3px;left:${$(this).parent().parent().offset().left + (tag_count-1)*55}px">${c}</div>`)
                    tag_count++;
                }
            })
        }
        $("td.title>a").each(solve)
        $("td.td-subject>a").each(solve)

        
    })
})();
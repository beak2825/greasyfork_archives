// ==UserScript==
// @name        Acfun评论标签
// @version     2.2
// @description 文章区评论楼层标签添加
// @match       http*://www.acfun.cn/a/ac*

// @author      冲锋
// @require        http://code.jquery.com/jquery-1.7.1.min.js
// @namespace https://greasyfork.org/users/63731
// @downloadURL https://update.greasyfork.org/scripts/372370/Acfun%E8%AF%84%E8%AE%BA%E6%A0%87%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/372370/Acfun%E8%AF%84%E8%AE%BA%E6%A0%87%E7%AD%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
console.log("ACFUN评论标签 启动");
    var labelCss=$(`
<style type="text/css">
.labelBg {width:373px;

background-color:#fff;
position:relative;
padding:8px 20px !important;
border: 1px solid #d4d4d4;
margin:auto auto !important;
margin-top:10px !important;
}
.win-hint-ensure {


margin: 0 !important;
font-size: large;
}
.btn-close {
position: absolute;
right: 15px;
top: 8px;
cursor: pointer;
}
.labelP1 {
padding:0 8px !important;
height: 28px;
line-height: 28px;
text-align: center;
background: #eee;
border-radius: 3px;
display:inline-block;
font-size:14px;
font-color:#999;
}
.labelInput{
width:180px;
height:24px;
display:inline-block;
border: 1px solid rgb(212,212,212);
border-radius: 3px;
}
.btn-addlabel{
background: #fd4c5c;
border: 1px solid #fd4c5c;
border-radius: 3px;
height: 28px;
color: #fff;
padding: 0 8px !important;
cursor: pointer;
display:inline-block;
margin-left:0px  !important;
}
.btn-addlabel:hover{
background-color:rgb(255,53,7);
}
.labelMain{
margin:auto auto !important;
}
.nameLabel{
/*  color:rgb(240,20,20);*/
/*  margin-left:10px;*/
padding-left:5px !important;
padding-right:5px !important;
color:#fff !important;

height: 22px;
font-size: 12px;
line-height: 22px;
background-color: #4a8eff;
text-align: center;
border-radius: 4px;
color: #fff;
margin-left:10px !important;
display:inline-block;

}
.btn-addlabel2 {

font-size: 12px !important;
color: #999 !important;
}
.btn-addlabel3 {

font-size: 12px !important;
color: #999 !important;
}
.tips{
margin: 10px 0px  !important;
color: #999;
}
.labelUserId{
color:#333;
margin-bottom:10px  !important;
}


</style>
`)
    $("head").append(labelCss)
    var labelWindow=$(`
<div class="labelBg" >
<span class="btn-close">
<i class="icon icon-close"></i>
</span>
<div class="labelMain">
<span class="win-hint-ensure labelUserId">人物ID</span>
<div>
<p class="labelP1">输入标签</p>
<input class="labelInput"></input>
<button class="btn-addlabel">添加标签</button>
</div>
<p class="tips">当输入框内容为空时，点击添加标签，则可以去除标签</p>
</div>

</div>
`)
    labelWindow.userId="0"
    labelWindow.userName="0"
    //关闭按钮点击
    labelWindow.find(".btn-close").click(function(){
        labelWindow.hide();
    })
    var userData={};

    if(localStorage.getItem("userLabelData")!=null){
        userData=JSON.parse(localStorage.getItem("userLabelData"));
    }

    //添加按钮点击
    labelWindow.find(".btn-addlabel").click(function(e){
        //旧的
        /*
        if(labelWindow.userId!="0")
        {
            userData[labelWindow.userId]=labelWindow.find(".labelInput").val().replace(/\s+/g,"");
            if( userData[labelWindow.userId]==""){
                delete userData[labelWindow.userId];
            }
            localStorage.setItem("userLabelData",JSON.stringify(userData));
            upDataLabel();
            labelWindow.hide();
        }*/
                if(labelWindow.userName!="0")
        {
            userData[labelWindow.userName]=labelWindow.find(".labelInput").val().replace(/\s+/g,"");
            if( userData[labelWindow.userName]==""){
                delete userData[labelWindow.userName];
            }
            localStorage.setItem("userLabelData",JSON.stringify(userData));
            if($(".comment-list").length!=0){
                 upDataLabel(1);
            }
            else{ upDataLabel(2);}

            labelWindow.hide();
        }

    })

    //切换评论后刷新
    $(".area-comm-title-right").live("click",function(){

        refreashComm();
    });
    $(".comment-banner").find(".button").live("click",function(){

        refreashComm();
    });
    //切换页面后刷新
      $(".pager__btn").live("click",function(){

          refreashComm();



    });


    //刷新评论区
    refreashComm();
       var flag=setInterval(function(){


//console.log("评论区刷新检测")
             labelButtonAdd(1);
                    upDataLabel(1);
            //if($("[class='comment-list'],[class='area-comment-top clearfix']").length!=0){

                if($("[class='switch fc-button']").text()=="返回盖楼模式"){
                  //  console.log("评论区标签刷新！")


                    labelButtonAdd(2);
                    upDataLabel(2);
                    //  clearInterval(flag)


                }
                 if($("[class='switch fc-button']").text()=="试用新版评论"){
                 //   console.log("评论区标签刷新！")

                    labelButtonAdd(1);
                    upDataLabel(1);
                    //  clearInterval(flag)
                }
          //  }
        },
                             500 )
    function refreashComm(){
        var flag=setInterval(function(){

            if($("[class='comment-list'],[class='area-comment-top clearfix']").length!=0){
              
                if($(".area-comm-title-right").find("a").next().text()=="返回盖楼模式"){
                    console.log("评论区标签刷新！")


                    labelButtonAdd(2);
                    upDataLabel(2);
                      clearInterval(flag)


                }
                if($(".comment-banner").find(".button.switch").text()=="试用新版评论"){
                    console.log("评论区标签刷新！")

                    labelButtonAdd(1);
                    upDataLabel(1);
                      clearInterval(flag)
                }
            }
        },
                             200 )
        }

    //更新所有人物标签
    function upDataLabel(type){
        //回复遍历
        /*
        $("[class='author-comment top'],[class='area-comment-right']").each(function(index,e){
            //判断回复者是否有标签
            if(userData[$(e).find(".name").attr("data-uid")]!=null){
                //判断是否已添加标签
                if($(e).find(".nameLabel").length!=0){
                    $(e).find(".nameLabel").text(userData[$(e).find(".name").attr("data-uid")]);
                }else{
                    var nameLabel=$("<a class='nameLabel'></a>")
                    nameLabel.text(userData[$(e).find(".name").attr("data-uid")]);
                    $(e).find(".name").after(nameLabel)
                }
            }
            else{
                $(e).find(".nameLabel").remove()
            }
            //按钮文字修改
            if($(e).find(".nameLabel").text()!=""){
                $(e).next().next().find(".btn-addlabel2").text("修改标签");
            }
            else{
                $(e).next().next().find(".btn-addlabel2").text("添加标签");
            }
        })*/
        //旧的

        if(type==1){
            $(".fc-comment-item ").each(function(index,e){
                if(userData[$(e).find(".name").text()]!=null){
                    //判断是否已添加标签
                    if($(e).find(".nameLabel").length!=0){
                        $(e).find(".nameLabel").text(userData[$(e).find(".name").text()]);
                    }else{
                        var nameLabel=$("<a class='nameLabel'></a>")
                        nameLabel.text(userData[$(e).find(".name").text()]);
                        $(e).find(".name").after(nameLabel)
                    }
                }
                else{
                    $(e).find(".nameLabel").remove()
                }
                //按钮文字修改
                if($(e).find(".nameLabel").text()!=""){
                    $(e).next().next().find(".btn-addlabel2").text("修改标签");
                }
                else{
                    $(e).next().next().find(".btn-addlabel2").text("添加标签");
                }
            })
        }
        else{
                  $(".area-comment-title ").each(function(index,e){
                if(userData[$(e).find("a").text()]!=null){
                    //判断是否已添加标签
                    if($(e).find(".nameLabel").length!=0){
                        $(e).find(".nameLabel").text(userData[$(e).find("a").text()]);
                    }else{
                        var nameLabel=$("<span class='nameLabel'></span>")
                        nameLabel.text(userData[$(e).find("a").text()]);
                        $(e).find("a").after(nameLabel)
                    }
                }
                else{
                    $(e).find(".nameLabel").remove()
                }
                //按钮文字修改
                if($(e).find(".nameLabel").text()!=""){
                    $(e).next().next().find(".btn-addlabel3").text("修改标签");
                }
                else{
                    $(e).next().next().find(".btn-addlabel3").text("添加标签");
                }
            })


        }
    }



    //为所有回复添加标签按钮
    function labelButtonAdd(type){
        /*
        //回复遍历
        $("[class='author-comment top'],[class='area-comment-right']").each(function(index,e){
            if($(e).find(".btn-addlabel2").length==0){
                //添加标签按钮添加
                var label=$(`
<a>添加标签</a>
`)
                label.addClass("btn-addlabel2")
                $(e).next().next().find(".btn-quote").before(label)

                //标签按钮点击
                label.click(function(){
                    $(e).next().next().after(labelWindow)
                    labelWindow.show();
                    labelWindow.find(".labelInput").val("");
                    labelWindow.find(".labelUserId").text($(e).find(".name").text());
                    labelWindow.userId=$(e).find(".name").attr("data-uid")
                })
            }
        })
        */
        //以上为旧版
        if(type==1){


            //添加标签按钮添加

            $(".fc-comment-item").each(function(index,e){
                if($(e).find(".comment-item-footer").find(".btn-addlabel2").length==0){

                    var label=$(`
<a>添加标签</a>
`)
                    label.addClass("btn-addlabel2")
                    $(e).find(".comment-item-footer").find(".comment-toolbar").prepend(label)

                    //标签按钮点击
                    /*   label.click(function(){
                  //  $(e).after(labelWindow)
               //     console.log(labelWindow)


                })*/
                }


            })
             //标签按钮点击
        $(".btn-addlabel2").on("click",function(){
            var buttonBar= $(this).parents(".comment-item-footer");
            $(this).parents(".comment-toolbar").after(labelWindow)
            // console.log($(this).parents(".comment-item"))
            labelWindow.show();
            labelWindow.find(".labelInput").val("");
            labelWindow.find(".labelUserId").text(buttonBar.prev().prev().find(".name").text());
            labelWindow.userId=buttonBar.prev().prev().find(".name").attr("data-uid")
            labelWindow.userName=buttonBar.prev().prev().find(".name").text();
        //    console.log( labelWindow.userName)
            //   labelWindow.find(".labelUserId").text($(e).find(".name").text());
            //  labelWindow.userId=$(e).find(".name").attr("data-uid")
        });
        }
        else{
            //添加标签按钮添加

            $(".area-comment-tool").each(function(index,e){
                if($(e).find(".btn-addlabel3").length==0){

                    var label=$(`
<svg class="svgIcon"
 xmlns="http://www.w3.org/2000/svg"
 xmlns:xlink="http://www.w3.org/1999/xlink"
 width="13px" height="13px">
<image  x="0px" y="0px" width="13px" height="13px"  xlink:href="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAQAAADY4iz3AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfjAQoPIR3qHDRfAAAAwElEQVQY023LMUoDURQF0DMTkIggCDGIugWxEAvjEsZUoriCryCCS3AXZn6WIVPZWCkiQmxS2ImkMZYWgkVSOBkV51bvcu5L8gvnmj594dlReFUmdWjkzLuWlo4irv/QopvQd1f2DUVc+z6T/MWygS1zs7UnWRiRapq38wvYVMRVkvzDgv8ZyBrdJZ0aWrHbuLp+bNuuw5RwqldDt8kExEsnf+BetyRiLlTwIAvjdNbCsX4Fe2FM9QWx58DQfniDKbpFL3LrqJVWAAAAAElFTkSuQmCC" />
</svg>
<a class="btn-addlabel3">添加标签</a>
`)
                   // label.addClass("btn-addlabel3")
                    $(e).find(".area-comment-reply").after(label)

                }


            })
             //标签按钮点击
        $(".btn-addlabel3").on("click",function(){
            var buttonBar= $(this).parents(".area-comment-tool");
            $(this).parents(".area-comment-tool").after(labelWindow)
            // console.log($(this).parents(".comment-item"))
            labelWindow.show();
            labelWindow.find(".labelInput").val("");
            labelWindow.find(".labelUserId").text(buttonBar.prev().prev().find(".name").text());
            labelWindow.userName=buttonBar.prev().prev().find(".name").text();
            //   labelWindow.find(".labelUserId").text($(e).find(".name").text());
            //  labelWindow.userId=$(e).find(".name").attr("data-uid")
        });



        }











    }





})();
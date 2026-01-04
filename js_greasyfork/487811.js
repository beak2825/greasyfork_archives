// ==UserScript==
// @name        多邻国diy开发
// @description 多邻国做题配合划词翻译显示翻译文本
// @match       https://www.duolingo.com/*
// @require     https://code.jquery.com/jquery-3.4.1.js
// @version 1.3.6.3
// @namespace https://greasyfork.org/users/157318
// @downloadURL https://update.greasyfork.org/scripts/487811/%E5%A4%9A%E9%82%BB%E5%9B%BDdiy%E5%BC%80%E5%8F%91.user.js
// @updateURL https://update.greasyfork.org/scripts/487811/%E5%A4%9A%E9%82%BB%E5%9B%BDdiy%E5%BC%80%E5%8F%91.meta.js
// ==/UserScript==


function isLesson() {
    return /https:\/\/www.duolingo.com\/(lesson|practice|skill.*)/.test(window.location.href);
}
// 添加css
  function addStyle(css) {
    var style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);
  }




function fy(){
    var mydiv=$("#myDiv");
    if (mydiv.length==1){
        $("#myDiv").remove();
        return;
    }
    var fanyi=$("._2-F7v,div.cxdws:visible:last");//一个词一个词的$("div[dir=ltr]")中的第二个div
    //alert($("title").text());
    var strone="";
    if (fanyi.length==1){//一个一个词拼句子
        for(var i=0;i<fanyi.find("div").length;i++){
            //品句子
            strone=strone+fanyi.find("div").eq(i).text()+" ";
        }
        fanyi.append("<div id='myDiv' style='font-size: 0px;margin-left: 30%;position: fixed;'>"+strone+"</div>");
        //$("#myDiv").focus();
        window.getSelection().selectAllChildren(document.getElementById("myDiv"));
        $("#__hcfy__")[0].shadowRoot.querySelector(".bp5-button").click();
        window.getSelection().removeAllRanges();
        console.log(strone);
        return;
    }
    var tiankong=$("div[dir=ltr]");
    if (tiankong.length>0){//填空题品句子
        var tiankongstr=tiankong[0].innerText.replaceAll("\n","");
        //判断是否有选中的答案回答内容
        var replyans=$("div[aria-checked=true]");
        if (replyans.length==1){
        tiankongstr=tiankongstr+"<br>"+replyans.find("span[dir=ltr]").text();
        }
        tiankong.append("<div id='myDiv' style='font-size: 0px;margin-left: 30%;position: fixed;'>"+tiankongstr+"</div>");
        //$("#myDiv").focus();
        window.getSelection().selectAllChildren(document.getElementById("myDiv"));
        $("#__hcfy__")[0].shadowRoot.querySelector(".bp5-button").click();
        window.getSelection().removeAllRanges();
        console.log(tiankongstr);
        return;
    }
    tiankong=$("label[dir=ltr],textarea[dir=ltr]");//填空单词句子,有input
    if (tiankong.length==1){//填空
        tiankongstr=tiankong[0].textContent.replaceAll("\n","");
        tiankongstr=tiankongstr.replaceAll("_","");
        tiankong.append("<div id='myDiv' style='font-size: 0px;;margin-left: 30%;position: fixed;'>"+tiankongstr+"</div>");
        //$("#myDiv").focus();
        window.getSelection().selectAllChildren(document.getElementById("myDiv"));
        $("#__hcfy__")[0].shadowRoot.querySelector(".bp5-button").click();
        window.getSelection().removeAllRanges();
        console.log(tiankongstr);
        return;
    }

}
function addfy(){
    if ($("#benty4").length==0){

        $("._3v4ux,.mAxZF").append("<button id='benty4' style='float:right;'>翻译</button>");
        $("#benty4").click(function(){fy();});
        $("._1fxa4._1Mopf").eq(0).css("overflow","auto");
        

    }
}

$(function(){//页面加载完成执行

     addStyle('html, * {-webkit-user-select:text!important; -moz-user-select:text!important;}');

    setTimeout(() => {
        addfy();
    }, 5000);
    $("body").click(function(){addfy();});

});


window.addEventListener("keydown", function(e) {
    var key = e.key.toLowerCase();
//console.log(key);
    if (isLesson()) {

        if ($("#benty4").length==0){
            addfy();
        }
        if (key == "f2") {
            fy();
        }
        if (key == "f8") {
            $("span[dir=ltr]").eq(0).find("button").click();


            var isFocus=$("textarea").is(":focus");
            if(true==isFocus){
                console.log('有focus');
                var ev = $.Event('keypress');
                ev.which = 74; // Carriage-return (Enter)
                $('textarea').trigger(ev);
            }else{
                $("textarea").focus();
                console.log('没有focus');
            }/**/
        }
        if (key == "f9") {
            $("span[dir=ltr]").eq(1).find("button").click();
        }
        if (key == "unidentified") {
      $("button:contains('继续'),button:contains('下一步'),button:contains('检查')").click();
  }
        /*
        if (key == "escape") {
            $(".yWRY8._3yAjN").eq(0).click();
        }
        // discussion shortcut
        if (key == "d") {
            $("span:contains(Discuss)").click();
        }

        // report shortcut
        if (key == "r") {
            $("span:contains(Report)").click();
        }

        // keyboard toggle
        if (key == "b" && e.ctrlKey) {
            e.preventDefault();
            $("button[data-test=player-toggle-keyboard]").click();
        }*/

    }
});


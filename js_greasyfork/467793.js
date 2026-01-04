// ==UserScript==
// @name         编程猫小功能优化
// @namespace    https://shequ.codemao.cn/user/3348695
// @version      1.1.46.4
// @description  bcm细微功能变化，例如精选显示等等
// @author       鱼丶
// @match        *://shequ.codemao.cn/work/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467793/%E7%BC%96%E7%A8%8B%E7%8C%AB%E5%B0%8F%E5%8A%9F%E8%83%BD%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/467793/%E7%BC%96%E7%A8%8B%E7%8C%AB%E5%B0%8F%E5%8A%9F%E8%83%BD%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

// 快捷选择器
function $(name){
    return document.querySelectorAll(name);
}

// 精选标签显示
function selectedLable(){
    let lable = $(".r-work-c-work_interaction--labels_container");
    lable = Object.values(lable);
    if ($(".r-work-c-work_interaction--label").length > 0){
        let breakOrNot = 0;
        let lableValue = Object.values($(".r-work-c-work_interaction--label"));
        console.log(Object.values($(".r-work-c-work_interaction--label")));
        for (let i = 0; i < lableValue.length; i++){
            if (lableValue[i].innerHTML == "新作喵喵看"){
                breakOrNot = 1;
            }
        }
        if (breakOrNot === 0){
            let newLable = document.createElement("span");
            newLable.className = "r-work-c-work_interaction--label";
            newLable.innerHTML = "点猫精选";
            lable[0].appendChild(newLable);
        }
    }
}

// 屑鱼认证优秀创作者
function greatAbility(){
    let uilist = ["Protein蛋白质", "Lazycat&amp;", "刻苦喵"];
    let atclist = ["饕餮Z醉梦", "钻石awa", "meis星语", "Lemon", "hzCK", "童话式", "小鱼yuzifu"];
    let crtlist = ["林夕狐", "up琥珀"];
    let userName = $("#root > div > div.r-index--main_cont > div > div.r-work--work_contianer > div.r-work--work_floor_1 > div.r-work--info_container > div.r-work-c-author_info--author_info_card > div.r-work-c-author_info--author_info > div > div > a");
    let inforCard = $("#root > div > div.r-index--main_cont > div > div.r-work--work_contianer > div.r-work--work_floor_1 > div.r-work--info_container > div.r-work-c-author_info--author_info_card");
    let inforPeople = document.createElement("div")
    let tempBr = document.createElement("br");
    inforPeople.cssText = "font-size: 14px; color:grey;";
    if (!(uilist.indexOf(userName[0].innerHTML) === -1)) {
        userName[0].style.color = "green";
        inforCard[0].appendChild(tempBr);
        inforPeople.innerHTML = "✨屑鱼认证：ui领域优秀创作者";
        inforCard[0].appendChild(inforPeople);
    }
    if (!(atclist.indexOf(userName[0].innerHTML) === -1)) {
        userName[0].style.color = "#FF77FF";
        inforCard[0].appendChild(tempBr);
        inforPeople.innerHTML = "🎉屑鱼认证：技术领域优秀创作者";
        inforCard[0].appendChild(inforPeople);
    }
    if (!(crtlist.indexOf(userName[0].innerHTML) === -1)) {
        userName[0].style.color = "#00CCFF";
        inforCard[0].appendChild(tempBr);
        inforPeople.innerHTML = "🎨屑鱼认证：创新领域优秀创作者";
        inforCard[0].appendChild(inforPeople);
    }
}

// 评论框内置提示语更改
function phchanging(){
    let placeholderList = [
        "天青色等烟雨，而我在等你的评论",
        "请提出一些有价值的评论，以便作者获得更好的反馈哦~",
        "你的每一句鼓励都是作者前进的动力源泉~",
        "请文明交流，理智发言哦，否则风纪找上门"
    ];
    $("#root > div > div.r-index--main_cont > div > div.r-work--work_contianer > div.r-work--work_floor_1 > div.r-work--work_detail_container > div.r-work--work_comment_container > div.r-work--comment_container > div > div.r-work-c-comment_area--comment_sender > div.r-work-c-comment_area-c-comment_editor--content_container > div.r-work-c-comment_area-c-comment_editor--editor_wrap > textarea")[0].setAttribute("placeholder", placeholderList[Math.floor(Math.random()*4)]);
}

function titleAd(){
    $(".r-work-c-work_info--work_name")[0].setAttribute("title", $(".r-work-c-work_info--work_name")[0].innerHTML);
}

function doing(){
    selectedLable();
    greatAbility();
    phchanging();
    titleAd();
}

setTimeout(doing, 3500);
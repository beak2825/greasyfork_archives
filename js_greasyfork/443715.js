// ==UserScript==
// @name         피탕메이트
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  갤질좀 편하게 하자
// @author       수린
// @license      MIT
// @match        https://gall.dcinside.com/*lists*
// @icon64       https://i.imgur.com/7SKZDdS.png
// @require      http://code.jquery.com/jquery-latest.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/443715/%ED%94%BC%ED%83%95%EB%A9%94%EC%9D%B4%ED%8A%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/443715/%ED%94%BC%ED%83%95%EB%A9%94%EC%9D%B4%ED%8A%B8.meta.js
// ==/UserScript==

function addSetting() {
    $("body").append(`<div class="settingBox" style="display:none">
    <div class="box kind1">
        <div style="text-align:center">
          <h2>
            현재 차단목록
          </h2>
          <div style="margin:5px;">
            목록에 이미 있다면 목록에서 제거함
          </div>
          <div id="killList" style="margin:5px; border:1px solid; border-radius:5px; height:270px">
          </div>
        </div>
        <div style="height:7%; margin:2%;">
          <input id="killInput" type="text" placeholder="차단할 단어/고닉 or id or ip" style="width:96%">
          </input>
        </div>
        <div style="width: 82px; margin:0 auto;">
          <button class="button off" id="addKillButton">
            추가
          </button>
        </div>
      </div>
      <div id="previewBox" class="box kind3">
        <div style="text-align:center">
          <h2>
            글 미리보기 설정
          </h2>
        </div>
        <div style="margin:5px;">
          글 제목에 마우스 올리면 미리보기창 팝업해줌
        </div>
        <div style="width: 82px; margin:0 auto;">
          <button id="previewButton">
          </button>
        </div>
      </div>
      <div id="reloadBox" class="box kind2">
        <div style="text-align:center">
            <h2>
              글 자동 새로고침 설정
            </h2>
        </div>
        <div style="margin:5px;">
        </div>
        <div style="height:15%; margin:2%;">
          <input id="reloadIntervalInput" type="number" placeholder="설정할 시간 간격 (ms)" style="width:96%">
          </input>
        </div>
        <div style="float:left; width: 82px; margin-left:15%;">
          <button class="button off" id="setReloadIntervalButton">설정</button>
        </div>
        <div style="float:right; width: 82px; margin-right:15%;">
          <button id="reloadButton">
          </button>
        </div>
      </div>
      <div id="readPopup" class="box kind3">
        <div style="text-align:center">
          <h2>
            글 읽기 팝업
          </h2>
        </div>
        <div style="margin:5px;">
          글 누르면 페이지 이동 안하고 팝업으로 보여줌
        </div>
        <div style="width: 82px; margin:0 auto;">
          <button id="readPopupButton">
          </button>
        </div>
      </div>
      <div class="box kind4">
        <div style="text-align:center">
            컨텐츠 숨김
        </div>
        <div class="littleBox">
          <input id="dchead" type="checkbox">
          상단 컨텐츠
          </input>
        </div>
        <div class="littleBox">
          <input id="gnbbar" type="checkbox">
          gnb_bar
          </input>
        </div>
        <div class="littleBox">
          <input id="rightContent" type="checkbox">
          오른쪽 영역
          </input>
        </div>
        <div class="littleBox">
          <input id="dcfoot" type="checkbox">
          밑 영역
          </input>
        </div>
      </div>
        <div style="width: 82px; margin:0 auto;">
          <button class="button off" id="closeButton">
            닫기
          </button>
        </div>
      </div>`);

    function pushKillList(word) {
        let currentList = GM_getValue('killList');
        if (currentList.indexOf(word) > -1) {
            currentList.splice(currentList.indexOf(word), 1);
            GM_setValue("killList", currentList);
            //alert(word + " 차단목록 제거 완료");
            document.body.querySelector('#killList').innerText = GM_getValue('killList');
        } else {
            //alert(word + " 차단목록 추가 완료");
            currentList.push(word);
            GM_setValue("killList", currentList);
            document.body.querySelector('#killList').innerText = GM_getValue('killList');
        }
    }
    document.body.querySelector('#closeButton').addEventListener("click", (event) => {
        $('.settingBox').hide();
        ParseOptions();
    });

    document.body.querySelector('#killList').innerText = GM_getValue('killList');

    document.body.querySelector('#addKillButton').addEventListener("click", (event) => {
        pushKillList(document.querySelector("#killInput").value);
        document.querySelector("#killInput").value = "";
        ParseOptions();
    });

    if (GM_getValue("previewOn") == true) {
        document.querySelector("#previewButton").className = "button on";
        document.querySelector("#previewButton").innerText = "끄기";
    } else {
        document.querySelector("#previewButton").className = "button off";
        document.querySelector("#previewButton").innerText = "켜기";
    }

    document.querySelector("#previewButton").addEventListener("click", (event) => {
        if (GM_getValue("previewOn") == true) {
            GM_setValue("previewOn", false);
            document.querySelector("#previewButton").className = "button off";
            document.querySelector("#previewButton").innerHTML = "켜기";
        } else {
            GM_setValue("previewOn", true);
            document.querySelector("#previewButton").className = "button on";
            document.querySelector("#previewButton").innerHTML = "끄기";
        }
        ParseOptions();
    });

    document.querySelector("#reloadBox").querySelectorAll('div')[1].innerHTML = `지정된 시간 간격마다 글 목록 자동 새로고침해줌<br>현재 ${GM_getValue("reloadInterval")}ms`;

    if (GM_getValue("reloadOn") == true) {
        document.querySelector("#reloadButton").className = "button on";
        document.querySelector("#reloadButton").innerText = "끄기";
    } else {
        document.querySelector("#reloadButton").className = "button off";
        document.querySelector("#reloadButton").innerText = "켜기";
    }

    document.querySelector("#setReloadIntervalButton").addEventListener("click", (event) => {
        GM_setValue("reloadInterval", document.querySelector("#reloadIntervalInput").value);
        document.querySelector("#reloadBox").querySelectorAll('div')[1].innerHTML = `지정된 시간 간격마다 글 목록 자동 새로고침해줌<br>현재 ${document.querySelector("#reloadIntervalInput").value}ms`;
        document.querySelector("#reloadIntervalInput").value = "";
        ParseOptions();
        //alert("설정 완료, 새로고침 합니다");
    });
    document.querySelector("#reloadButton").addEventListener("click", (event) => {
        if (GM_getValue('reloadOn') == true) {
            GM_setValue("reloadOn", false);
            document.querySelector("#reloadButton").className = "button off";
            document.querySelector("#reloadButton").innerHTML = "켜기";
        } else {
            GM_setValue("reloadOn", true);
            document.querySelector("#reloadButton").className = "button on";
            document.querySelector("#reloadButton").innerHTML = "끄기";
        }
        ParseOptions();
    });


    if (GM_getValue("readPopupOn") == true) {
        document.querySelector("#readPopupButton").className = "button on";
        document.querySelector("#readPopupButton").innerText = "끄기";
    } else {
        document.querySelector("#readPopupButton").className = "button off";
        document.querySelector("#readPopupButton").innerText = "켜기";
    }

    document.querySelector("#readPopupButton").addEventListener("click", (event) => {
        if (GM_getValue("readPopupOn") == true) {
            GM_setValue("readPopupOn", false);
            document.querySelector("#readPopupButton").className = "button off";
            document.querySelector("#readPopupButton").innerHTML = "켜기";
        } else {
            GM_setValue("readPopupOn", true);
            document.querySelector("#readPopupButton").className = "button on";
            document.querySelector("#readPopupButton").innerHTML = "끄기";
        }
        ParseOptions();
    });


    document.querySelector("#dchead").checked = GM_getValue('hideDcHead');

    document.querySelector("#dchead").addEventListener("click", (event) => {
        GM_setValue("hideDcHead", document.querySelector("#dchead").checked);
        ParseOptions();
    });


    document.querySelector("#gnbbar").checked = GM_getValue('hideGnbBar');

    document.querySelector("#gnbbar").addEventListener("click", (event) => {
        GM_setValue("hideGnbBar", document.querySelector("#gnbbar").checked);
        ParseOptions();
    });


    document.querySelector("#rightContent").checked = GM_getValue('hideRightContent');

    document.querySelector("#rightContent").addEventListener("click", (event) => {
        GM_setValue("hideRightContent", document.querySelector("#rightContent").checked);
        ParseOptions();
    });


    document.querySelector("#dcfoot").checked = GM_getValue('hideDcFoot');

    document.querySelector("#dcfoot").addEventListener("click", (event) => {
        GM_setValue("hideDcFoot", document.querySelector("#dcfoot").checked);
        ParseOptions();
    });

    document.querySelector(".array_tab.left_box").insertAdjacentHTML('beforeend', `<button id="settingButton" class="">설정</button>`);
    document.querySelector("#settingButton").addEventListener('click', (event) => {
        $('.settingBox').css({ left: event.clientX, top: event.clientY })
        $('.settingBox').show();
    });
}
//--------------------------------------------------------------------------------
function addStyle() {
    GM_addStyle(`
  #popup_preview{
    position:absolute;z-index:10000; top:0px;
  }
  `);
    GM_addStyle(`
  .content{
    position:absolute;left:0;bottom:0;padding:15px;width:600px;
    max-height:1000px;
    min-height:100px;
    line-height:20px;
    font-size:12px;
    opacity:1;
    color:#ffffff;
    border:1px solid #ddd;
    border-radius:5px;
    background:#000000;
    overflow:auto
  }
  `);
    GM_addStyle(`
  #popup_read{
    position:absolute;
    z-index:10001;
    top:0px;
    border-radius:5px;
    background-color:white;
    opacity:1;
    border:1px solid;
    box-shadow:1px 1px 5px rgba(0,0,0,0.3);
    max-width:1000px;
    max-height:1000px;
    width:80%;
    height:80%;
    float:left
  }
  `);
    GM_addStyle(`
  #view{
    position:absolute;
    z-index: 20000;
    opacity:1;
    border-radius:5px;
    background-color:white;
    opacity:1;
    border:1px solid;
    box-shadow:1px 1px 5px rgba(0,0,0,0.3);
    max-width:1000px;
    max-height:1000px;
    width:80%;
    height:80%;
    float:left;
    display:none;
  }
  `);
    GM_addStyle(`
  .read{
    position:absolute;left:0;bottom:0;padding:15px;width:100%;
    max-height:1000px;
    min-height:100px;
    line-height:20px;
    font-size:12px;
    opacity:1;
    color:#000000;
    border:1px solid rgb(0, 0, 0);
    border-radius:5px;
    background:#ffffff;
    overflow:auto
  }
  `);
    GM_addStyle(`
  #popup_preview img{
    max-width:30%
  }
  `);
    GM_addStyle(`
  #popup_preview iframe,#popup_preview embed{
    width:100%;height:auto;min-height:240px
  }
  `);
    GM_addStyle(`
  .test{
    background: #000 !important;
    height:1000px;
    width:1000px;
  }
  `);
    //setting
    GM_addStyle(`
    .settingBox{
    position:absolute;
    z-index:10000;
    width:580px;
    height: 545px;
    border-radius:5px;
    background-color: #262626;
}
`);

    GM_addStyle(`
.box{
    width:48%;
    border-radius:5px;
    float:left;
    margin: 1%;
    background-color: #fff;
}
`);

    GM_addStyle(`
.kind1{
    height:433px;
}
`);

    GM_addStyle(`
.kind2{
    height:170px;
}
`);

    GM_addStyle(`
.kind3{
    height:120px;
}
`);

    GM_addStyle(`
.kind4{
    width:98% !important;
    height:50px;
}
`);

    GM_addStyle(`
.littleBox{
    width:130px;
    border:1px solid;
    border-radius:5px;
    float:left;
    margin: 5px;
}
`);

    GM_addStyle(`
.off{
    border:1px solid #ccc;
    color:#333;
    background:#fff;
    padding-bottom:2px
}
`);

    GM_addStyle(`
.on{
    border:1px solid #29367c;
    background:#3b4890;
    color:#fff;
    text-shadow: 0px -1px #1d2761
}
`);

    GM_addStyle(`
.button{
    width:82px;
    height:32px;
    border-radius:2px;
    font-size:14px;
    margin-left:2px;
    font-weight:bold;
}
`);
}
//
function intializeOptions() {
    let tempKillList = [];
    if (GM_getValue("killList") == null) GM_setValue("killList", tempKillList);
    if (GM_getValue("previewOn") == null) GM_setValue("previewOn", true);
    if (GM_getValue("reloadInterval") == null) GM_setValue("reloadInterval", 1000);
    if (GM_getValue("reloadOn") == null) GM_setValue("reloadOn", true);
    if (GM_getValue("readPopupOn") == null) GM_setValue("readPopupOn", true);
    if (GM_getValue("hideDcHead") == null) GM_setValue("hideDcHead", true);
    if (GM_getValue("hideGnbBar") == null) GM_setValue("hideGnbBar", true);
    if (GM_getValue("hideRightContent") == null) GM_setValue("hideRightContent", true);
    if (GM_getValue("hideDcFoot") == null) GM_setValue("hideDcFoot", true);
}
//--------------------------------------------------------------------------------
let loadInterval = null;
let popupInterval = null;
let reloadObject = null;
let gallListTable = null;
let gallListVector = [];
//--------------------------------------------------------------------------------
function GetInitialGallListTable() {
    gallListTable = document.querySelector('.gall_list');
    for (elem of gallListTable.querySelectorAll('.ub-content.us-post')) {
        let tempNum = elem.getAttribute("data-no");
        if (gallListVector.indexOf(tempNum) < 0) {
            gallListVector.push(tempNum);
        }
    }
}
//--------------------------------------------------------------------------------
function UpdateGallListTable() {
    if (gallListTable == null) {
        GetInitialGallListTable()
    } else {
        return new Promise((resolve) => {
            fetch(window.location.href)
                .then((response) => response.text())
                .then((result) => {
                    let firstUserArticle = null;
                    for (elem of document.querySelector('.gall_list').querySelectorAll('.ub-content.us-post')) {
                        if ($(elem).find('.gall_num').html() != "공지" && $(elem).find('.gall_num').html() != "설문") {
                            firstUserArticle = elem;
                            break;
                        }
                    }
                    result = result.substr(result.indexOf('"gall_list"') + 13, result.length);
                    result = result.substr(0, result.indexOf("table") - 2);
                    let tempTable = document.createElement('table');
                    tempTable.innerHTML = result;
                    for (elem of tempTable.querySelectorAll('.ub-content.us-post')) {
                        let tempNum = elem.getAttribute("data-no");
                        if (gallListVector.indexOf(tempNum) < 0) {
                            gallListVector.push(tempNum);
                            let a = elem;
                            if (GM_getValue('previewOn') == true) {
                                $(a).find(".gall_tit > a:not(.reply_numbox)").hover(
                                    function (event) {
                                        Preview(event, $(this).attr("href"));
                                    },
                                    function () {
                                        closePreview();
                                    }
                                );
                            }
                            document.querySelector('.gall_list').querySelector('tbody').insertBefore(elem, firstUserArticle);
                        } else {
                            for (elem2 of document.querySelector('.gall_list').querySelectorAll('.ub-content.us-post')) {
                                if (elem.getAttribute("data-no") == elem2.getAttribute("data-no")) {
                                    $(elem2.querySelector('.gall_count')).replaceWith(elem.querySelector('.gall_count'))
                                    $(elem2.querySelector('.gall_recommend')).replaceWith(elem.querySelector('.gall_recommend'))
                                    if (elem2.querySelector('.reply_numbox') == null && elem.querySelector('.reply_numbox') != null) {
                                        elem2.querySelector('.gall_tit.ub-word').append(elem.querySelector('.reply_numbox'));
                                    } else if (elem2.querySelector('.reply_numbox') != null && elem.querySelector('.reply_numbox') != null) {
                                        $(elem2.querySelector('.reply_numbox')).replaceWith(elem.querySelector('.reply_numbox'))
                                    }
                                }
                            }
                        }
                        resolve(document.querySelector('.gall_list'));
                    }
                });
        });
    }
}
//--------------------------------------------------------------------------------
function GetKillList() {
    return new Promise((resolve) => {
        resolve(GM_getValue('killList'));
    });
}
//--------------------------------------------------------------------------------
function kill() {
    return new Promise((resolve) => {
        GetKillList()
            .then((KILLLIST) => {
                for (let elem of document.querySelector('.gall_list').querySelectorAll('.ub-content.us-post')) {
                    if (KILLLIST.indexOf(elem.querySelector('.gall_writer.ub-writer').getAttribute("data-uid")) > -1
                        || KILLLIST.indexOf(elem.querySelector('.gall_writer.ub-writer').getAttribute("data-ip")) > -1
                        || KILLLIST.indexOf(elem.querySelector('.gall_writer.ub-writer').getAttribute("data-nick")) > -1) {
                        elem.remove();
                    }
                    let title = elem.querySelector('.gall_tit.ub-word').innerText;
                    for (let i of KILLLIST) {
                        let REG = RegExp(i);
                        if (REG.exec(title)) {
                            elem.remove();
                        }
                    }
                }
                resolve(document.querySelector('.gall_list'));
            });
    });
}
//--------------------------------------------------------------------------------
function killComment(commentList) {
    GetKillList()
        .then((KILLLIST) => {
            for (let elem of commentList.querySelectorAll('.ub-content.dory')) {
                elem.remove();
            }
            for (let elem of commentList.querySelectorAll('.ub-content')) {
                if (elem.querySelector('.gall_writer.ub-writer')) {
                    if (KILLLIST.indexOf(elem.querySelector('.gall_writer.ub-writer').getAttribute("data-uid")) > -1
                        || KILLLIST.indexOf(elem.querySelector('.gall_writer.ub-writer').getAttribute("data-ip")) > -1
                        || KILLLIST.indexOf(elem.querySelector('.gall_writer.ub-writer').getAttribute("data-nick")) > -1) {
                        elem.remove();
                    }
                    let text;
                    if (elem.querySelector('.clear.cmt_txtbox.btn_reply_write_all')) {
                        text = elem.querySelector('.clear.cmt_txtbox.btn_reply_write_all').innerText;
                    } else {
                        text = elem.querySelector('.clear.cmt_txtbox').innerText;
                    }
                    for (let i of KILLLIST) {
                        let REG = RegExp(i);
                        if (REG.exec(text)) {
                            elem.remove();
                        }
                    }
                }

            }
        });
}
//--------------------------------------------------------------------------------
function openPreview(eve, content) {
    var scrollX = $(window).scrollLeft();
    var scrollY = $(window).scrollTop();
    $("#popup_preview")
        .stop(true, true)
        //.hide()
        .css({ left: eve.pageX + 30, top: (eve.clientY + 100) + scrollY })
        .find(".content")
        .html(content)
        .outerHeight()
        ;
    $("#popup_preview").fadeIn(200, function () {
        var popupHeight = $(this).find(".content").scrollTop(0).outerHeight();
        var popupTop = (eve.clientY - 20) - popupHeight;
        if (popupTop < -10) {
            $(this).css("top", "+=" + (Math.abs(popupTop) + 10));
        }
    });
}
//--------------------------------------------------------------------------------
async function Preview(eve, link) {
    if (localStorage.length > 100) localStorage.clear();
    var id = link.split("id=")[1].split("&")[0];
    var no = link.split("no=")[1].split("&")[0];
    var contentId = id + "_" + no;
    let loadContent = localStorage.getItem(contentId);
    if (loadContent != undefined && loadContent != null && loadContent !== "") {
        openPreview(eve, loadContent);
    } else {
        return new Promise((resolve) => {
            loadInterval = setTimeout(function () {
                fetch(link)
                    .then((response) => response.text())
                    .then((result) => {
                        let text = result;
                        var viewContent = $(text).find(".view_content_wrap .writing_view_box");
                        if (viewContent.length > 0) {
                            viewContent.find("script,style").remove();
                            content = viewContent.html();
                            localStorage.setItem(contentId, content);
                            openPreview(eve, content);
                        }
                    });
            }, 200);
        });

    }
}
//--------------------------------------------------------------------------------
async function MakeGallList() {
    UpdateGallListTable().then((gallList) => {
        kill().then(() => {
        });
    });
}
//--------------------------------------------------------------------------------------------------------------
function readPopup() {
    document.querySelector('body').addEventListener("click", (event) => {
        if (document.querySelector('#view')) {
            $('#view').fadeOut(200);
            document.querySelector('#view').remove();
        }
    });
    document.querySelector('.gall_listwrap.list').onclick = function (event) {
        if (event.target.nodeName != 'A') return;
        if (document.querySelector('#view')) {
            $('#view').fadeOut(200);
            document.querySelector('#view').remove();
        }

        let href = event.target.getAttribute('href');

        document.querySelector('body').insertAdjacentHTML('afterbegin', `
        <div id="view"; style="left:${event.clientX - 30}px; top:${window.innerHeight / 10 + window.pageYOffset}px">
            <iframe id="iframe" src="${href}" width='100%' height='100%'></iframe>
        </div>`);
        //--------------------------------------------------------------------------------------------------------------
        let interval = setInterval(() => {
            if (document.querySelector('#iframe')) {
                let iframeDocument = document.querySelector('#iframe').contentDocument;
                iframeDocument.querySelector(".right_content").querySelector('div').hidden = true;
                iframeDocument.querySelector('.dchead').hidden = true;
                iframeDocument.querySelector('.gnb_bar').hidden = true;
                if (iframeDocument.querySelector('.dcwiki')) {
                    iframeDocument.querySelector('.dcwiki').hidden = true;
                }
                iframeDocument.querySelector('.fr.gall_issuebox').hidden = true;
                for (let elem of iframeDocument.querySelectorAll(".content_box")) {
                    elem.hidden = true;
                }
                let dcfoot = iframeDocument.querySelector('.dcfoot.type1');
                for (let elem of dcfoot.querySelectorAll('div')) {
                    elem.hidden = true;
                }
                iframeDocument.querySelector("#top").style.width = '0%';
                iframeDocument.querySelector("#top").style.minWidth = '0px';
                iframeDocument.querySelectorAll(".wrap_inner")[0].style.width = '50%';
                iframeDocument.querySelectorAll(".wrap_inner")[0].marginLeft = '0 auto';
                iframeDocument.querySelectorAll("article")[1].style.width = '0%';
                iframeDocument.querySelectorAll("article")[1].style.minWidth = '1000px';
                iframeDocument.querySelector('.con_banner.writing_banbox').style.minHeight = '0px';
                iframeDocument.querySelector("#container").style.marginLeft = '0 auto';
                iframeDocument.querySelector("#container").style.marginRight = '0 auto';
                iframeDocument.querySelector('.gall_listwrap.list').hidden = true;
                iframeDocument.querySelector('.listwrap.clear').hidden = true;
                //iframeDocument.querySelector('.view_bottom_btnbox.clear').hidden = true;
                iframeDocument.querySelector('.page_head.clear').hidden = true;
                iframeDocument.querySelector('.stickyunit').remove();
                iframeDocument.querySelector('.issue_wrap').hidden = true;
                if (iframeDocument.querySelector('.comment_box')) killComment(iframeDocument.querySelector('.comment_box'));
                clearInterval(interval);
                $('#view').fadeIn(200);
            }
        }, 100);

        event.stopPropagation()
        return false;
    };
}
//--------------------------------------------------------------------------------------------------------------
function closePreview() {
    clearTimeout(loadInterval);
    popupInterval = setTimeout(function () {
        $("#popup_preview").stop(true, true).fadeOut(200, function () {
            $("#popup_preview .content").empty();
        });
    }, 20);
}
//--------------------------------------------------------------------------------------------------------------
function ParseOptions() {
    if (GM_getValue('readPopupOn') == true) {
        //$("body").append('<div id="popup_read"><div class="read"></div></div>');
        readPopup();
        document.addEventListener('scroll', (event) => {
            if (document.querySelector('#view')) {
                document.querySelector('#view').style.top = `${window.innerHeight / 10 + window.pageYOffset}px`;
            }
        });
    } else {
        //$("#popup_read").remove();
        document.querySelector('.gall_listwrap.list').onclick = "";
        document.addEventListener('scroll', (event) => { });
    }

    if (GM_getValue('previewOn') == true) {
        if (document.querySelector("#popup_preview") == null) {
            $("body").append('<div id="popup_preview"><div class="content"></div></div>');
        }
        $(".gall_list .gall_tit > a:not(.reply_numbox)").hover(
            function (event) {
                Preview(event, $(this).attr("href"));
            },
            function () {
                closePreview();
            }
        );
        $("#popup_preview").hover(
            function () {
                clearTimeout(popupInterval);
            },
            function () {
                closePreview();
            }
        ).on("click", function () {
            closePreview();
        });
    } else {
        $("#popup_preview").remove();
    }

    clearInterval(reloadObject);
    if (GM_getValue('reloadOn') == true) {
        clearInterval(reloadObject);
        reloadObject = setInterval(() => {
            MakeGallList();
        }, GM_getValue('reloadInterval'));
    } else {
        clearInterval(reloadObject);
    }


    let search = document.querySelector('#search_wrap');
    if (GM_getValue('hideDcHead') == true) {
        document.querySelector('.dchead').hidden = true;
        search.className = "";
        document.querySelector('.left_content').prepend(search);
    } else {
        document.querySelector('.dchead').hidden = false;
        document.querySelector('.dchead').append(search);
        search.className = "wrap_search";
    }
    if (GM_getValue('hideGnbBar') == true) {
        document.querySelector('.gnb_bar').hidden = true;
    } else {
        document.querySelector('.gnb_bar').hidden = false;
    }
    if (GM_getValue('hideRightContent') == true) {
        document.querySelector(".right_content").querySelector('div').hidden = true;
        for (let elem of document.querySelectorAll(".content_box")) {
            elem.hidden = true;
        }
        document.querySelector('.listwrap.clear').style.width = '840px'
    } else {
        document.querySelector(".right_content").querySelector('div').hidden = false;
        for (let elem of document.querySelectorAll(".content_box")) {
            elem.hidden = false;
        }
        document.querySelector('.listwrap.clear').style.width = '1160px'
    }
    if (GM_getValue('hideDcFoot') == true) {
        let dcfoot = document.querySelector('.dcfoot.type1');
        for (let elem of dcfoot.querySelectorAll('div')) {
            elem.hidden = true;
        }
    } else {
        let dcfoot = document.querySelector('.dcfoot.type1');
        for (let elem of dcfoot.querySelectorAll('div')) {
            elem.hidden = false;
        }
    }
}
//--------------------------------------------------------------------------------------------------------------
function ListenOptionChange() {
    //chrome.storage.onChanged.addListener(() => {
    ParseOptions();
    //});
}
//--------------------------------------------------------------------------------------------------------------
function clean(document) {
    if (document.querySelector('.ad-layer')) {
        document.querySelector('.ad-layer').style.display = 'none';
    }
    document.querySelector('.stickyunit').style.display = 'none';
    document.querySelector('.rightbanner1').style.display = 'none';
    document.querySelector('.ad_bottom_list').style.display = 'none';

    document.querySelector('.btn_visit').style.position = 'relative';
}
//--------------------------------------------------------------------------------------------------------------
$(document).ready(function () {
    addStyle();
    intializeOptions();
    clean(document);
    let login = document.querySelector('.area_links.clear').querySelectorAll('li');
    let login_btn = login[login.length - 1];
    document.querySelector(".array_tab.left_box").insertAdjacentHTML('beforeend', `<button class="on">${document.querySelector('.user_info').innerText}</button>`);
    document.querySelector(".array_tab.left_box").insertAdjacentHTML('beforeend', `<button class="">${login_btn.innerHTML}</button>`);
    addSetting();
    ParseOptions();
    ListenOptionChange();
});
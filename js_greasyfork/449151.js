// ==UserScript==
// @name         e-typing_ChangeDisplay
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  GoodUI
// @author       Ase
// @match        https://www.e-typing.ne.jp/member/
// @match        https://www.e-typing.ne.jp/e-typing.ne.jp/app/standard.asp*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e-typing.ne.jp
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449151/e-typing_ChangeDisplay.user.js
// @updateURL https://update.greasyfork.org/scripts/449151/e-typing_ChangeDisplay.meta.js
// ==/UserScript==

(function() {
    // キーボード入力での処理
    document.addEventListener('keypress', (e) => {
        if (e.key === 'r' || e.key === 'R') {
            window.location.href = 'https://www.e-typing.ne.jp/member/cht.asp?tp=0';
        }
        if (e.key === 'k' || e.key === 'K') {
            window.location.href = 'https://www.e-typing.ne.jp/member/cht.asp?tp=1';
        }
        if (e.key === 'e' || e.key === 'E') {
            window.location.href = 'https://www.e-typing.ne.jp/member/cht.asp?tp=2';
        }
    });
    // 非表示
    var header = document.getElementById("etyping");
    header.style.display = "none";
    var requestButton = document.getElementById("fixed_request_btn");
    requestButton.style.display = "none";
    var fingerTraining = document.getElementById("tft");
    fingerTraining.style.display = "none";
    var info = document.getElementById("info");
    info.style.display = "none";
    var news = document.getElementById("kb_news");
    news.style.display = "none";
    var leftSide = document.getElementsByClassName("left_wrap");
    leftSide[0].style.display = "none";
    var questionnaire = document.getElementById("question");
    questionnaire.style.display = "none";
    var hint = document.getElementById("hint");
    hint.style.height = '17.5px';
    hint.style.opacity = 0;
    if (document.getElementsByClassName("ety_book")[0] != null) {
        document.getElementsByClassName("ety_book")[0].style.display = "none";
    }
    // 広告非表示
    var ad1 = document.getElementsByClassName("ad300 first_ad");
    ad1[0].style.display = "none";
    var ad2 = document.getElementsByClassName("ad300x600");
    ad2[0].style.display = "none";
    var ad3 = document.getElementsByClassName("ad300");
    ad3[1].style.display = "none";
    var footer = document.getElementsByTagName('footer');
    footer[0].style.display = "none";
    var ad4 = document.getElementsByClassName("ad200x200");
    ad4[0].style.display = "none";
    var ad5 = document.getElementsByClassName("ad200x200 right");
    ad5[0].style.opacity = 0;
    // home_leftの並び替え
    var homeLeft = document.getElementById("home_left");
    var backGround = document.getElementById("type_menu");
    var selectButton1 = document.getElementsByClassName("left");
    var selectButton2 = document.getElementsByClassName("right");
    var space = document.getElementById("twitter_widget");
    if (document.getElementById("e-typing_master") != null) {
        var pTest = document.getElementById("e-typing_master");
        homeLeft.insertBefore(pTest, homeLeft.firstChild);
        pTest.style.transform = "scale(0.45, 0.45)";
        pTest.style.marginTop = "-60px";
        pTest.style.marginLeft = "-108px";
    }
    homeLeft.insertBefore(backGround, homeLeft.firstChild);
    homeLeft.insertBefore(selectButton2[1], homeLeft.firstChild);
    homeLeft.insertBefore(space, homeLeft.firstChild);
    homeLeft.insertBefore(selectButton1[0], homeLeft.firstChild);
    backGround.style.opacity = 0;
    space.style.height = '0px';
    backGround.style.height = '0px';
    selectButton1[0].firstChild.style.marginTop = "14px";
    selectButton1[0].firstChild.style.marginLeft = "25.5px";
    selectButton2[1].firstChild.style.marginLeft = "25.5px";
    selectButton1[0].firstChild.style.transform = "scale(1.25, 1.25)";
    selectButton2[1].firstChild.style.transform = "scale(1.25, 1.25)";
    // main_centerの並び替え
    var mainCenter = document.getElementById("main_center");
    var recentPractice = document.getElementById("recent_practice");
    var specialType = document.getElementById("special_type");
    mainCenter.insertBefore(recentPractice, mainCenter.firstChild);
    mainCenter.insertBefore(specialType, mainCenter.firstChild);
    specialType.style.marginTop = "10px";
    recentPractice.style.marginTop = "-10px";
    // sideの並び替え
    var side = document.getElementById("side");
    var varietyType = document.getElementById("variety_type");
    var practiceMenu = document.getElementById("practice_menu");
    side.insertBefore(varietyType, side.firstChild);
    side.insertBefore(practiceMenu, side.firstChild);
})();
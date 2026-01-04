// ==UserScript==
// @name         ScombZ-Utilities
// @namespace    https://twitter.com/yudai1204
// @version      2.5.8
// @description  より快適なScombZライフのために、サイドメニュー、テスト、ログインを改善します
// @author       @yudai1204 , @to_ku_me
// @match        https://scombz.shibaura-it.ac.jp/*
// @match        https://adfs.sic.shibaura-it.ac.jp/adfs/ls/*
// @match        http://syllabus.sic.shibaura-it.ac.jp/*
// @icon         https://scombz.shibaura-it.ac.jp/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443944/ScombZ-Utilities.user.js
// @updateURL https://update.greasyfork.org/scripts/443944/ScombZ-Utilities.meta.js
// ==/UserScript==
const $$version = '2.5.8';
(function() {
    console.log(`welcome to Scomb Utilities ver.${$$version}`);
    'use strict';
    //----------------chrome拡張機能部分 US版設定直書き----------------
    //localStorageに読み込む
    var $settings_year = '2022';        //入学年度
    var $settings_fac = 'ko1';          //学部(工学部:ko1 シス理:sys デザ工:dsn 建築:arc 大学院:din)
    var $settings_login_auto = 'true';
    var $settings_adfs_auto = 'true';
    var $settings_exit_auto = 'true';
    var $settings_submenu = 'true';
    var $settings_exam = 'true';
    var $settings_additional_lms = 'true';
    var $settings_finished_report = 'true';
    var $settings_syll_btn = 'true';
    function s2b(str){
        if(str == 'true' || str === null || str === undefined){
            return true;
        }else{
            return false;
        }
    }

    console.log("settings_year:"+$settings_year);
    console.log("settings_fac:"+$settings_fac);
    console.log("login_auto:"+$settings_login_auto);
    console.log("login_adfs:"+$settings_adfs_auto);
    console.log("exit_auto:"+$settings_exit_auto);
    console.log("submenu:"+$settings_submenu);
    console.log("exam:"+$settings_exam);
    console.log("additional_lms:"+$settings_additional_lms);
    console.log("finished_report:"+$settings_finished_report);
    console.log("syll_btn:"+$settings_syll_btn);
    console.log("読み込み完了");
    //------------------------------------------------

    //ADFSスキップ
    if (document.domain == 'adfs.sic.shibaura-it.ac.jp'){
        console.log("ADFSをスキップします");
        if(s2b($settings_adfs_auto)){
            const $adfsButton = document.getElementById("continueButton");
            if ($adfsButton) {
                $adfsButton.click();
            }
        }
        console.log("ADFSをスキップしました");
    }
    //ログインボタン自動クリック
    else if (location.href == 'https://scombz.shibaura-it.ac.jp/login'){
        if(s2b($settings_login_auto)){
            window.onload = function(){
                console.log("ログインボタンをクリックします");
                document.querySelector('.login-btn:nth-child(1)').click();
                console.log("ログインボタンをクリックしました");
            };
        }
    }
    //ログアウト画面変更
    else if(location.href == 'https://scombz.shibaura-it.ac.jp/logout'){
        window.addEventListener('load', function(){
            const $logoutMainContent = document.getElementById('logout');
            const $logoutButton = document.querySelector('.btn-logout');
            if($logoutMainContent && $logoutButton){
                $logoutButton.style.background = "#f43c49";
                $logoutButton.style.border = "1px solid #ff0000";
                $logoutButton.style.boxShadow = "none";
                $logoutButton.style.fontWeight="bold";
                
                $logoutMainContent.style.width = '100%';
                $logoutMainContent.style.margin = '0 auto';
                $logoutMainContent.style.minWidth = '0';
                $logoutButton.insertAdjacentHTML('afterEnd',`
                <style>
                .btn-back{
                    margin-top:10px;
                    width:300px;
                    box-shadow:none;
                }
                @media (max-width: 480px){
                    .btn-back {
                        width: 200px;
                    }
                }
                </style>
                <br><a class="btn-inline btn-back btn-color btn-txt" href="#" onclick="history.back(-1);return false;" >戻る</a>
                `);
            }
        });
    }
    //その他
    else if(document.domain == 'scombz.shibaura-it.ac.jp'){
        
        //テスト改善
        if (location.href.includes('examination') && document.body.clientWidth > 480){
            if(s2b($settings_exam)){
                console.log('テスト改善を実行します');
                const $exa_contsize = document.getElementById('pageContents');
                const $exa_examImgList = document.querySelectorAll('.downloadFile');
                const $exa_cheadList = document.querySelectorAll('.contents-header');
                const $exa_img = document.querySelector('.exam-question-img');
                const $exa_footer = document.getElementById('page_foot');
                const $exa_timer = document.getElementById('examTimer');
                if ($exa_footer){
                    $exa_footer.style.visibility = 'hidden';
                }

                for (const $exa_chead of $exa_cheadList){
                    $exa_chead.style.width = '8%';
                    $exa_chead.style.background = '#f6f6ff';
                }
                if ($exa_img){
                    for (const $exa_examImg of $exa_examImgList){
                        $exa_examImg.style.maxHeight = '100vh';
                        $exa_examImg.style.boxShadow= '0 0 1px #000000 ';
                    }
                    $exa_examImgList[0].style.maxHeight = '95vh';
                    $exa_examImgList[0].style.maxWidth = '50vw';
                    $exa_examImgList[0].style.position = 'fixed';
                    $exa_examImgList[0].style.right= '1px';
                    $exa_examImgList[0].style.top= '5vh';
                    $exa_examImgList[0].style.boxShadow= '0 0 1px #000000 ';
                    if ($exa_contsize) {
                        $exa_contsize.style.width = document.body.clientWidth - $exa_examImgList[0].clientWidth - 3 + 'px';
                    }
                    if($exa_timer){
                    $exa_timer.style.width = document.body.clientWidth - $exa_examImgList[0].clientWidth + 'px';
                    }
                }
                console.log('テスト改善の実行が完了しました');
            }
        }
        //メニューを閉じる
            console.log('メニューを閉じます');
            var $closeButton = document.getElementById('sidemenuClose');
            if($closeButton && s2b($settings_exit_auto)){
                $closeButton.click();
                if( !(document.getElementById('sidemenu').classList.contains('sidemenu-close'))){
                    document.getElementById('sidemenu').classList.add('sidemenu-close');
                }
                if( !(document.getElementById('pageMain').classList.contains('sidemenu-hide')) ){
                    document.getElementById('pageMain').classList.add('sidemenu-hide');
                }
                console.log('メニューを閉じました');
            }
            console.log('Webページ読み込み完了まで待機しています');
            window.addEventListener('load', function(){
                console.log('Webページを読み込みました');
                //提出済み課題
                //将来的にはhas()を使用
                if(location.href == 'https://scombz.shibaura-it.ac.jp/portal/home' && $settings_finished_report){
                    console.log('提出済課題非表示 実行開始');
                    const $finRepList = document.querySelectorAll('.portal-subblock-mark-finish');
                    for(const $finRep of $finRepList){
                        $finRep.parentNode.parentNode.style.display = 'none';
                    }
                    console.log('提出済課題非表示 実行終了');
                }
                //横メニュー
                if(s2b($settings_submenu)){
                console.log('サイドメニューのスタイル変更を開始します');
                //head追加
                const $head = document.head;
                $head.insertAdjacentHTML('beforeEnd',`
                <style type="text/css">
                    .sidemenu-hide{
                        min-width:371px;
                    }
                    .page-main #graylayer{
                            width:100%;
                            height:100%;
                            position:fixed;
                            z-index:11;
                            background:#000000;
                            opacity:0.5;
                            visibility:visible;
                            transition:opacity 300ms;
                        }
                    .sidemenu-hide.page-main #graylayer{
                            width:100%;
                            height:100%;
                            position:fixed;
                            z-index:11;
                            background:#000000;
                            opacity:0;
                            visibility:hidden;

                    }
                    .page-main .usFooter{
                        position:fixed;
                        bottom:0;
                        right:5px;
                        font-size:8px;
                        color:#000000;
                        visibility:visible;
                        z-index:15;
                    }
                    .sidemenu-hide.page-main .usFooter{
                        visibility:hidden;
                    }
                    
                    .sidemenu-open.hamburger-icon{
                        display:block;
                    }
                    .sidemenu-pull,.sidemenu-link,.sidemenu-head,.sidemenu-close{
                        width:301px;
                    }
                    .mainmenu-head-logo{
                        position:fixed;
                        text-align:center;
                        top:2px;
                        width:55px;
                        height:55px;
                        border-radius: 27.5px;
                        visibility:hidden;
                    }
                    .mainmenu-head-logo:hover{
                        background:#e0e0e0;
                    }
                    
                    @media (min-width:900px){
                        .mainmenu-head-logo{
                            left:calc(50vw - 27.5px);
                            visibility:visible;
                        }
                        .page-main .subtimetableBody{
                            position:fixed;
                            Top:10px;
                            right:10px;
                            font-size:15px;
                            color:#000000;
                            visibility:visible;
                            z-index:15;
                            display:visible;
                            opacity:1;
                            transition:opacity 300ms;
                        }
                        .sidemenu-hide.page-main .subtimetableBody{
                            opacity:0;
                            visibility:hidden;
                            transition:opacity 300ms;
                        }
                    }
                    @media (max-width:899px){
                        .subtimetableBody{
                            opacity:0;
                            visibility:hidden;
                            transition:opacity 300ms;
                        }
                    }
                    img.scombz-icon{
                        object-fit: cover;
                        width:66%;
                        height:100%;
                        object-position: 1% 100%;
                    }
                    @media(max-width:480px){
                        .mainmenu-head-logo{
                            right:0px;
                        }
                        .sidemenu-pull,.sidemenu-link,.sidemenu-head,.sidemenu-close{
                            width:280px;
                        }
                        .pagetop-head{
                            top:0;
                            left:195px;
                            width:calc(100vw - 195px);
                            height:100%;
                            position:absolute;
                            display:block;
                        }
                    }
                    .sidemenu-close {
                        transform: translateX(-100%);
                    }
                    
                </style>
                `);
                //ヘッダ中心にアイコンを表示 ヘッダをクリックで一番上へ
                const $pageHead = document.getElementById('page_head');
                $pageHead.insertAdjacentHTML('afterBegin',`<a href="javascript:void(0);" onclick='javascript:window.scrollTo({ top: 0, behavior: "smooth" });' class="pagetop-head"></a>`);
                $pageHead.insertAdjacentHTML('beforeEnd',`
                <a href="/portal/home"><div class="mainmenu-head-logo"><img src="/sitelogo" class="scombz-icon" alt="Top"></div></a>
                `);
                //サイドメニューおよびメインカラムの設定
                const $sidemenu = document.getElementById('sidemenu');
                    $sidemenu.style.boxShadow = ('none');
                    $sidemenu.style.overflowY = ('auto');
                    $sidemenu.style.position = ('fixed');
                    $sidemenu.style.top = ('0');
                    $sidemenu.style.left = ('0');
                    $sidemenu.style.float = ('left');
                    $sidemenu.style.zIndex = ('100');
                const $pageMain = document.getElementById('pageMain');
                    $pageMain.style.position = ('absolute');
                    $pageMain.style.top = ('0');
                    $pageMain.style.left = ('0');
                    $pageMain.style.width = '100vw';
                    $pageMain.style.minWidth = ('371px');
                //サイドメニューをモノトーンに
                const $menuIconList = document.querySelectorAll('.sidemenu-icon');
                for (const $menuIcon of $menuIconList){
                    //通常時
                    $menuIcon.style.background = '#ffffff';
                    $menuIcon.addEventListener('mouseleave', function(){
                        $menuIcon.style.background = '#ffffff';
                    })
                    //マウスホバー時
                    $menuIcon.addEventListener('mouseover', function(){
                        $menuIcon.style.background = '#f0f0f0';
                    })
                }
                //サイドメニューのヘッドサイズを小さくする
                const $sidemenuHead = document.querySelector('.sidemenu-head');
                    $sidemenuHead.style.height = '60px';
                //サイドメニューのロゴ小さく
                const $sidemenuLogo = document.querySelector('.sidemenu-logo');
                    $sidemenuLogo.style.height = '60px';
                    $sidemenuLogo.style.width = '115px';
                    $sidemenuLogo.style.paddingTop = '0px';
                    $sidemenuLogo.style.margin = '0 auto';
                //サイドメニューの開閉ボタンを変える
                var $closeButton = document.getElementById('sidemenuClose');
                    $closeButton.classList.add('hamburger-icon');
                    $closeButton.innerHTML = '<div class="hamburger-line"></div>\n<div class="hamburger-line"></div>\n<div class="hamburger-line"></div>';
                    $closeButton.style.left = '0';
                    $closeButton.style.top = '0';
                console.log('サイドメニューのスタイルを変更しました');
                //科目ページの最大横幅を変更
                if(location.href.includes("lms/course?idnumber=") && location.href.length < 80){
                    console.log('科目ページの最大横幅を変更します');
                    $head.insertAdjacentHTML('beforeEnd',`
                    <style type="text/css">
                    #courseTopForm{
                        max-width: 1280px;
                        margin: 0 auto;
                    }
                    @media(min-width:1281px){
                        .course-header{
                            border-left:1px solid #ccc;
                            border-right:1px solid #ccc;
                        }
                    }
                    </style>
                    `);
                    console.log("最大横幅は1280pxに設定されました");
                }
                //LMS取得
                var $subTimetable='';
                if(s2b($settings_additional_lms)){
                    if(location.href == 'https://scombz.shibaura-it.ac.jp/lms/timetable'){
                        console.log('LMSを取得開始します');
                        const $courseList = document.querySelectorAll('.timetable-course-top-btn');
                        if($courseList[0]){
                            function han2Zenkaku($str) {
                                return $str.replace(/[０-９]/g, function(s) {
                                    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
                                });
                            }
                            function jigenInt($str){
                                return han2Zenkaku($str.charAt(0));
                            }
                            //JSON生成
                            let $timetableData = '[';
                            for(const $course of $courseList) {
                                $timetableData+="{";
                                for(let $yobicolNum = 1 ; $yobicolNum < 7 ; $yobicolNum++){
                                    if( $course.parentNode.parentNode.className.indexOf($yobicolNum+'-yobicol') != -1 ){
                                        $timetableData+='"day":'+$yobicolNum+`,`;
                                        $timetableData+='"time":'+jigenInt($course.parentNode.parentNode.parentNode.firstElementChild.innerHTML)+',';
                                        break;
                                    }
                                    if($yobicolNum == 6){
                                        $timetableData+=`"day":-1,"time":-1,`; // 曜日時限不定履修
                                    }
                                }
                                $timetableData+= '"id":"'+$course.getAttribute("id")+`",`;
                                $timetableData+= '"name":"'+$course.innerHTML+`"},`;
                            }
                            $timetableData+='{"day":-2}]';
                            console.log('LMSを取得しました\n\n'+$timetableData);
                            localStorage.setItem("udai:timetableDataList",encodeURIComponent($timetableData));
                            console.log('LocalStorageに保存しました');
                            //JSON生成完了
                        }
                    }
                    //グレーレイヤーの追加
                    //LMS表示
                    console.log('グレーレイヤーを追加します');
                    if(localStorage.getItem("udai:timetableDataList") == null) {
                        console.log('LocalStrageのアクセスに失敗しました');
                    }else{
                        const $timetableDataStr = decodeURIComponent(localStorage.getItem("udai:timetableDataList"));
                        console.log('LocalStrageのアクセスに成功しました\nJSONファイルにparseします');
                        const $timetableData = JSON.parse($timetableDataStr);
                        console.log('JSONファイルを読み込みました'+$timetableDataStr);
                        $subTimetable =`
                        <style type="text/css">
                            .SubTimetable {
                                text-align:center;
                                decolation:none;
                                font-size:100%;
                            }
                            @media(max-width:1281px){
                                .SubTimetable {
                                    font-size:90%;
                                }
                            }
                            td.SubTimetable , th.SubTimetable {
                                width:calc((100vw - 300px)/7);
                                height:4vh;
                                background:#EDF3F7;
                            }
                            td.SubTimetable:nth-child(1) , th.SubTimetable:nth-child(1) {
                                width:30px;
                                background:#ec9c93;
                            }
                            th.SubTimetable{
                                background:#bea87b;
                                height:30px;
                            }
                            a.SubTimetable{
                                display:block;
                                width:100%;
                                height:100%;
                                min-height:40px;
                            }
                            a.SubTimetable:hover{
                                background:rgba(206, 213, 217,0.5);
                            }
                            .subtimetableBodyCulm{
                                background:rgba(255,255,255,0.5);
                            }
                        </style>
                        <div class="subtimetableBody">
                        <div class="subtimetableBodyCulm">
                        <table class="SubTimetable">
                            <thead>
                                <tr>
                                    <th class="SubTimetable"></th>
                                    <th class="SubTimetable">月</th>
                                    <th class="SubTimetable">火</th>
                                    <th class="SubTimetable">水</th>
                                    <th class="SubTimetable">木</th>
                                    <th class="SubTimetable">金</th>
                                    <th class="SubTimetable">土</th>
                                </tr>
                            </thead>
                            <tbody>`;
                        console.log('LMSを表示します');
                        let num=0;
                        //通常授業
                        for(let i=0; i<7; i++){ //i=時限
                            $subTimetable+='<tr>';
                            for(let j=0; j<7; j++){ //j=曜日
                                let $subjData = (j==0) ? i+1 : '';
                                if( $timetableData[num].day == j && $timetableData[num].time == i+1 ){
                                    //2Q、4Qのことを考える
                                    if( $timetableData[num+1].day == j && $timetableData[num+1].time == i+1 ){
                                        console.log('クォーター制授業を検出しました 曜日:'+j+' 時間:'+i);
                                        $subjData = `
                                        <a href="https://scombz.shibaura-it.ac.jp/lms/course?idnumber=${$timetableData[num].id}" class="SubTimetable" style="color:#000000;text-decoration:none;white-space: nowrap;text-overflow:ellipsis;overflow:hidden;font-size:80%;height:calc(50% - 2px);min-height:30px;"><span class="subTimetable">${$timetableData[num].name}</span></a>
                                        <a href="https://scombz.shibaura-it.ac.jp/lms/course?idnumber=${$timetableData[num+1].id}" class="SubTimetable" style="color:#000000;text-decoration:none;margin-top:1px;border-top:1px solid #ccc; white-space: nowrap;text-overflow:ellipsis;overflow:hidden;font-size:80%;height:calc(50% - 2px);min-height:30px;"><span class="subTimetable">${$timetableData[num+1].name}</span></a>`;
                                        num++;
                                    }else{//2Q,4Qが存在しないとき
                                        console.log('通常授業を検出しました 曜日:'+j+' 時間:'+i);
                                        $subjData = `<a href="https://scombz.shibaura-it.ac.jp/lms/course?idnumber=${$timetableData[num].id}" class="SubTimetable" style="color:#000000;text-decoration:none;"><span class="subTimetable">${$timetableData[num].name}</span></a>`;
                                    }
                                    num++;
                                }            
                                $subTimetable+=`<td class="SubTimetable">${$subjData}</td>`;
                            }
                            $subTimetable+='</tr>';
                        }
                        $subTimetable += `</tbody></table></div>`;
                        //曜日時間不定授業
                        if($timetableData[num].day != -1){
                            console.log('読み取り完了 課外授業なし day:'+$timetableData[num].day);
                        }else{
                            console.log('曜日時間不定授業・集中講座を検出しました');
                            $subTimetable+= `
                            <div class="subtimetableBodyCulm"><table class="SubTimetable" style="margin-top:10px;">
                            <tr class="SubTimetable">
                                <th class="SubTimetable">その他の授業</th>
                            </tr>`;
                            for(;$timetableData[num].day == -1;num++){
                            $subTimetable+=`
                                <tr>
                                    <td class="SubTimetable" style="background:#EDF3F7;width:calc((100vw - 300px)/5);height:4vh;"><a href="https://scombz.shibaura-it.ac.jp/lms/course?idnumber=${$timetableData[num].id}" class="SubTimetable" style="color:#000000;text-decoration:none;"><span class="subTimetable">${$timetableData[num].name}</span></a></td>
                                </tr>`;
                            }
                            $subTimetable+=`</table></div>`;
                            console.log('読み取り完了 課外授業あり day:'+$timetableData[num].day);
                        }
                        $subTimetable+=`</div>`;
                        console.log('時間割の生成に成功しました\nコマ数:'+num);
                        $pageMain.insertAdjacentHTML('beforeEnd',`
                        <div id="graylayer" onclick="document.getElementById('sidemenuClose').click();"></div>
                        <p class="usFooter">ScombZ Utilities ver.${$$version}<br>presented by <a style="color:#000000;" href="https://twitter.com/yudai1204" target="_blank" rel="noopener noreferrer">@yudai1204</a></p>
                        `+$subTimetable);
                    }
                }else{
                    $pageMain.insertAdjacentHTML('beforeEnd',`
                    <div id="graylayer" onclick="document.getElementById('sidemenuClose').click();"></div>
                    <p class="usFooter">ScombZ Utilities ver.${$$version}<br>presented by <a style="color:#000000;" href="https://twitter.com/yudai1204" target="_blank" rel="noopener noreferrer">@yudai1204</a></p>
                    `);
                }
                console.log('グレーレイヤーの生成を完了しました');

                
                //お知らせを変更する
                const $sidemenuInfoList = document.querySelectorAll('.sidemenu-link.info-icon');
                if($sidemenuInfoList[0])
                    $sidemenuInfoList[0].style.borderTop = '1px solid #ccc';
                /* 2022/4/27 ScombZの仕様変更により標準仕様となった
                const $sidemenuInfoList = document.querySelectorAll('.sidemenu-link.info-icon');
                if($sidemenuInfoList[0]){
                    //お知らせページへの遷移へと変更
                    $sidemenuInfoList[0].innerHTML=`お知らせ`;
                    $sidemenuInfoList[0].setAttribute('href', 'https://scombz.shibaura-it.ac.jp/portal/home/information/list');
                    $sidemenuInfoList[0].removeAttribute("onclick");
                    $sidemenuInfoList[0].style.borderTop = '1px solid #ccc';
                    //2,3個目のお知らせメニューを削除
                    for (let i=1; i < $sidemenuInfoList.length; i++){
                        $sidemenuInfoList[i].remove();
                    }
                }
                */

                //各メニューの縦幅をすべて50pxにする
                const $sidemenuLinkList = document.querySelectorAll('.sidemenu-link');
                if($sidemenuLinkList[0]){
                    for (const $sidemenuLink of $sidemenuLinkList){
                        $sidemenuLink.style.height = '50px';
                    }
                }
                const $sidemenuPullList = document.querySelectorAll('.sidemenu-pull');
                if($sidemenuPullList[0]){
                    for (const $sidemenuPull of $sidemenuPullList){
                        $sidemenuPull.style.height = '53px';
                        $sidemenuPull.style.padding = '17px 40px 12px 81px';
                    }
                }
                //ページトップボタン
                const $pagetopBtn = document.querySelector('.page-top-btn');
                if($pagetopBtn){
                    $pagetopBtn.remove();
                }
            }
            //シラバスリンク
            if (location.href.includes('scombz.shibaura-it.ac.jp/lms/course?idnumber=') && s2b($settings_syll_btn)){
                console.log('授業別ページを検出しました\nシラバスのデータと連携します');
                const $courseTitle = document.querySelector('.course-title-txt');
                if($courseTitle){
                    console.log($courseTitle.innerHTML);
                    const $nameInt = $courseTitle.innerHTML.indexOf(' ', $courseTitle.innerHTML.indexOf(' ') + 2);
                    const $courseName = $courseTitle.innerHTML.slice($nameInt+1);
                    let $courseNameStr ='';
                    let $courseNameStrEnc ='';
                    if( $courseName.search(/[０-９]|[0-9]/) > 0){
                        $courseNameStr = $courseName.slice(0,$courseName.search(/[０-９]|[0-9]/));
                        $courseNameStr = $courseNameStr + ' ' +$courseName.slice($courseName.search(/[０-９]|[0-9]/));
                        $courseNameStrEnc = EscapeEUCJP($courseNameStr);
                    }else{
                        $courseNameStr = `subject:"${$courseName}"`;
                        $courseNameStrEnc = `%2B${EscapeEUCJP($courseNameStr)}`;
                    }
                    console.log('授業検索名を決定しました['+$courseNameStr+']');
                    
                    if($settings_year == null || $settings_fac == null || $settings_fac == null || $settings_year == null){
                        $courseTitle.parentNode.insertAdjacentHTML('beforeEnd',`<span style="color:red;">シラバス表示をするには、学年と学部を設定してください</span>`);
                    }else{
                        console.log("EUC-JPに変換中");
                        $courseTitle.parentNode.insertAdjacentHTML('beforeEnd',`<a href="http://syllabus.sic.shibaura-it.ac.jp/namazu/namazu.cgi?ajaxmode=true&query=${$courseNameStrEnc}&whence=0&idxname=`+$settings_year+`%2F`+$settings_fac+`&max=20&result=normal&sort=score#:~:text=%E6%A4%9C%E7%B4%A2%E7%B5%90%E6%9E%9C,-%E5%8F%82%E8%80%83%E3%83%92%E3%83%83%E3%83%88%E6%95%B0"  target="_blank" rel="noopener noreferrer" class="btn btn-square btn-square-area btn-txt white-btn-color" style="margin-left:40px;margin-bottom:5px;">シラバスを表示</a>
                        <span style="margin-left:35px;margin-bottom:10px;font-size:60%;">※自動検索で関連付けているため、違う教科のシラバスが開かれることがあります。</span>
                        `);
                    }
                    console.log('シラバスリンクの挿入が完了しました');
                }
            }
            //レポート提出ボタン変更
            if (location.href.includes("scombz.shibaura-it.ac.jp/lms/course/report/submission")){
                console.log('レポート提出画面を検出しました\nボタンのレイアウトを変更します');
                document.head.insertAdjacentHTML('beforeEnd',`
                <style>
                .block-under-area .block-under-area-btn{
                    margin:0 auto;
                }
                .block-under-area .block-under-area-btn .btn-color{
                    display: grid;
                    place-items: center;
                    margin:10px auto;
                    width:100%;
                    min-width:140px;
                    min-height:50px;
                    box-shadow:none;
                }
                .block-under-area .block-under-area-btn #backPage,#back{
                    color:#545555;
                    background:#fff;
                    font-size:90%;
                    border:1px solid #ccc;
                    min-height:40px;
                }
                .block-under-area .block-under-area-btn #backPage,#back:hover{
                    border:1px solid #999;
                    box-shadow:0 0 3px #888;
                }
                .block-under-area .block-under-area-btn #submitButton,#report_submission_btn{
                    color:#fff;
                    background:#4892e0;
                    font-weight:bold;
                    font-size:110%;
                    border:1px solid #ccc;
                }
                .time-select-btn{
                    padding:2px 10px;
                }
                </style>
                `);
            const $submitBtnArea = document.querySelector('.block-under-area-btn');
            $submitBtnArea.style.maxWidth = "450px";
            if($submitBtnArea.childElementCount == 2){
                $submitBtnArea.firstElementChild.id = "back";
                $submitBtnArea.appendChild($submitBtnArea.children[0]);
            }
            document.querySelector('.page-directlink').remove();
            console.log("レポート提出ボタンのレイアウトが変更されました");
            }
            console.log('すべての機能の実行が完了しました');
        });
    }
    //シラバス適用
    if(document.domain == "syllabus.sic.shibaura-it.ac.jp"){
        if(location.href.includes("namazu") && location.href.includes("ajaxmode=true")){
            console.log("ScombZからのシラバスへの遷移を検出しました")
            const $namazuHeader = document.querySelector(".namazu-result-header");
            if(location.href.includes("%2Bsubject") && document.getElementsByTagName("dt")[15]){
                //複数あった時の処理
                if($namazuHeader){
                    $namazuHeader.setAttribute('id', 'searchResult');
                    $namazuHeader.insertAdjacentHTML('beforeEnd',`
                        <div style="width:100%;">
                        <h1>複数のシラバスデータを検出しました</h1>
                        <h3>以下の一覧から該当する科目を選択してください</h3>
                        </div>
                    `);
                    document.querySelector(".namazu-result-footer").insertAdjacentHTML('afterEnd',`
                    <div style="width:100%;height:50vh;">
                    </div>
                    `);
                    window.location.href = "#searchResult";
                }
            }else{
                //検索からの自動リンク
                const $sylSubjLink = document.getElementById("hit_1");
                const $sylSubDDTag = document.getElementsByTagName("a");
                if($sylSubjLink){
                    console.log("科目ページに遷移します by ID");
                    $sylSubjLink.click();
                }else if($sylSubDDTag[22]){
                    console.log("科目ページに遷移します by Tag");
                    window.location.href = $sylSubDDTag[22].innerHTML;
                }else{
                    console.log("科目が見つかりませんでした");
                    $namazuHeader.setAttribute('id', 'searchResult');
                    $namazuHeader.insertAdjacentHTML('beforeEnd',`
                    <div style="height:100vh;">
                    <h1>シラバスデータの取得に失敗しました</h1>
                    <h3>該当する科目が見つかりませんでした。お手数おかけしますが、シラバス内で直接お探しください。</h3>
                    <h3><a href="http://syllabus.sic.shibaura-it.ac.jp/">シラバスへ</a></h3>
                    </div>
                    `);
                    window.location.href = "#searchResult";
                }
            }
        }else if(location.href.includes("Matrix")){
            //見やすくする by とくめいっ！
            console.log("シラバスのスタイルを変更します");
            window.addEventListener('load', function(){
                const $list1 = document.querySelector(".table_sticky thead tr td");
                if($list1){
                    $list1.style.position = "static";
                    let li = document.querySelectorAll(".table_sticky thead:nth-child(2) tr:nth-child(1) th");
                    for (const l of li){
                        l.style.position = "static";
                    }
                }
                const $list2 = document.querySelectorAll(".table_sticky thead:nth-child(2) tr:nth-child(2) th");
                if($list2[0]){
                    for (const li2 of $list2){
                        li2.style.position = "static";
                    }
                }
                console.log("変更が完了しました");
            });
        }
    }
})();

//
// Escape Codec Library: ecl.js (Ver.041208)
//
// Copyright (C) http://nurucom-archives.hp.infoseek.co.jp/digital/
//

/*USとChromeで違うゾーン*/
EscapeEUCJP=function(str){
    return str.replace(/[^*+.-9A-Z_a-z-]/g,function(s){
        var c=s.charCodeAt(0);
        return (c<128?(c<16?"%0":"%")+c.toString(16):65376<c&&c<65440?"%8E%"+(c-65216).toString(16):(c=JCT8836.indexOf(s))<0?"%A1%A6":"%"+((c-(c%=94))/94+161).toString(16)+"%"+(c+161).toString(16)).toUpperCase()
    })
};
JCT11280=Function('var a="zKV33~jZ4zN=~ji36XazM93y!{~k2y!o~k0ZlW6zN?3Wz3W?{EKzK[33[`y|;-~j^YOTz$!~kNy|L1$353~jV3zKk3~k-4P4zK_2+~jY4y!xYHR~jlz$_~jk4z$e3X5He<0y!wy|X3[:~l|VU[F3VZ056Hy!nz/m1XD61+1XY1E1=1y|bzKiz!H034zKj~mEz#c5ZA3-3X$1~mBz$$3~lyz#,4YN5~mEz#{ZKZ3V%7Y}!J3X-YEX_J(3~mAz =V;kE0/y|F3y!}~m>z/U~mI~j_2+~mA~jp2;~m@~k32;~m>V}2u~mEX#2x~mBy+x2242(~mBy,;2242(~may->2&XkG2;~mIy-_2&NXd2;~mGz,{4<6:.:B*B:XC4>6:.>B*BBXSA+A:X]E&E<~r#z+625z s2+zN=`HXI@YMXIAXZYUM8X4K/:Q!Z&33 3YWX[~mB`{zKt4z (zV/z 3zRw2%Wd39]S11z$PAXH5Xb;ZQWU1ZgWP%3~o@{Dgl#gd}T){Uo{y5_d{e@}C(} WU9|cB{w}bzvV|)[} H|zT}d||0~{]Q|(l{|x{iv{dw}(5}[Z|kuZ }cq{{y|ij}.I{idbof%cu^d}Rj^y|-M{ESYGYfYsZslS`?ZdYO__gLYRZ&fvb4oKfhSf^d<Yeasc1f&a=hnYG{QY{D`Bsa|u,}Dl|_Q{C%xK|Aq}C>|c#ryW=}eY{L+`)][YF_Ub^h4}[X|?r|u_ex}TL@YR]j{SrXgo*|Gv|rK}B#mu{R1}hs|dP{C7|^Qt3|@P{YVV |8&}#D}ef{e/{Rl|>Hni}R1{Z#{D[}CQlQ||E}[s{SG_+i8eplY[=[|ec[$YXn#`hcm}YR|{Ci(_[ql|?8p3]-}^t{wy}4la&pc|3e{Rp{LqiJ],] `kc(]@chYnrM`O^,ZLYhZB]ywyfGY~aex!_Qww{a!|)*lHrM{N+n&YYj~Z b c#e_[hZSon|rOt`}hBXa^i{lh|<0||r{KJ{kni)|x,|0auY{D!^Sce{w;|@S|cA}Xn{C1h${E]Z-XgZ*XPbp]^_qbH^e[`YM|a||+=]!Lc}]vdBc=j-YSZD]YmyYLYKZ9Z>Xcczc2{Yh}9Fc#Z.l{}(D{G{{mRhC|L3b#|xK[Bepj#ut`H[,{E9Yr}1b{[e]{ZFk7[ZYbZ0XL]}Ye[(`d}c!|*y`Dg=b;gR]Hm=hJho}R-[n}9;{N![7k_{UbmN]rf#pTe[x8}!Qcs_rs[m`|>N}^V})7{^r|/E}),}HH{OYe2{Skx)e<_.cj.cjoMhc^d}0uYZd!^J_@g,[[[?{i@][|3S}Yl3|!1|eZ|5IYw|1D}e7|Cv{OHbnx-`wvb[6[4} =g+k:{C:}ed{S]|2M]-}WZ|/q{LF|dYu^}Gs^c{Z=}h>|/i|{W]:|ip{N:|zt|S<{DH[p_tvD{N<[8Axo{X4a.^o^X>Yfa59`#ZBYgY~_t^9`jZHZn`>G[oajZ;X,i)Z.^~YJe ZiZF^{][[#Zt^|]Fjx]&_5dddW]P0C[-]}]d|y {C_jUql] |OpaA[Z{lp|rz}:Mu#]_Yf6{Ep?f5`$[6^D][^u[$[6^.Z8]]ePc2U/=]K^_+^M{q*|9tYuZ,s(dS{i=|bNbB{uG}0jZOa:[-]dYtu3]:]<{DJ_SZIqr_`l=Yt`gkTnXb3d@kiq0a`Z{|!B|}e}Ww{Sp,^Z|0>_Z}36|]A|-t}lt{R6pi|v8hPu#{C>YOZHYmg/Z4nicK[}hF_Bg|YRZ7c|crkzYZY}_iXcZ.|)U|L5{R~qi^Uga@Y[xb}&qdbd6h5|Btw[}c<{Ds53[Y7]?Z<|e0{L[ZK]mXKZ#Z2^tavf0`PE[OSOaP`4gi`qjdYMgys/?[nc,}EEb,eL]g[n{E_b/vcvgb.{kcwi`~v%|0:|iK{Jh_vf5lb}KL|(oi=LrzhhY_^@`zgf[~g)[J_0fk_V{T)}I_{D&_/d9W/|MU[)f$xW}?$xr4<{Lb{y4}&u{XJ|cm{Iu{jQ}CMkD{CX|7A}G~{kt)nB|d5|<-}WJ}@||d@|Iy}Ts|iL|/^|no|0;}L6{Pm]7}$zf:|r2}?C_k{R(}-w|`G{Gy[g]bVje=_0|PT{^Y^yjtT[[[l!Ye_`ZN]@[n_)j3nEgMa]YtYpZy].d-Y_cjb~Y~[nc~sCi3|zg}B0}do{O^{|$`_|D{}U&|0+{J3|8*]iayx{a{xJ_9|,c{Ee]QXlYb]$[%YMc*]w[aafe]aVYi[fZEii[xq2YQZHg]Y~h#|Y:thre^@^|_F^CbTbG_1^qf7{L-`VFx Zr|@EZ;gkZ@slgko`[e}T:{Cu^pddZ_`yav^Ea+[#ZBbSbO`elQfLui}.F|txYcbQ`XehcGe~fc^RlV{D_0ZAej[l&jShxG[ipB_=u:eU}3e8[=j|{D(}dO{Do[BYUZ0/]AYE]ALYhZcYlYP/^-^{Yt_1_-;YT`P4BZG=IOZ&]H[e]YYd[9^F[1YdZxZ?Z{Z<]Ba2[5Yb[0Z4l?]d_;_)a?YGEYiYv`_XmZs4ZjY^Zb]6gqGaX^9Y}dXZr[g|]Y}K aFZp^k^F]M`^{O1Ys]ZCgCv4|E>}8eb7}l`{L5[Z_faQ|c2}Fj}hw^#|Ng|B||w2|Sh{v+[G}aB|MY}A{|8o}X~{E8paZ:]i^Njq]new)`-Z>haounWhN}c#{DfZ|fK]KqGZ=:u|fqoqcv}2ssm}.r{]{nIfV{JW)[K|,Z{Uxc|]l_KdCb%]cfobya3`p}G^|LZiSC]U|(X|kBlVg[kNo({O:g:|-N|qT}9?{MBiL}Sq{`P|3a|u.{Uaq:{_o|^S}jX{Fob0`;|#y_@[V[K|cw[<_ }KU|0F}d3|et{Q7{LuZttsmf^kYZ`Af`}$x}U`|Ww}d]| >}K,r&|XI|*e{C/a-bmr1fId4[;b>tQ_:]hk{b-pMge]gfpo.|(w[jgV{EC1Z,YhaY^q,_G[c_g[J0YX]`[h^hYK^_Yib,` {i6vf@YM^hdOKZZn(jgZ>bzSDc^Z%[[o9[2=/YHZ(_/Gu_`*|8z{DUZxYt^vuvZjhi^lc&gUd4|<UiA`z]$b/Z?l}YI^jaHxe|;F}l${sQ}5g}hA|e4}?o{ih}Uz{C)jPe4]H^J[Eg[|AMZMlc}:,{iz}#*|gc{Iq|/:|zK{l&}#u|myd{{M&v~nV};L|(g|I]ogddb0xsd7^V})$uQ{HzazsgxtsO^l}F>ZB]r|{7{j@cU^{{CbiYoHlng]f+nQ[bkTn/}<-d9q {KXadZYo+n|l[|lc}V2{[a{S4Zam~Za^`{HH{xx_SvF|ak=c^[v^7_rYT`ld@]:_ub%[$[m](Shu}G2{E.ZU_L_R{tz`vj(f?^}hswz}GdZ}{S:h`aD|?W|`dgG|if{a8|J1{N,}-Ao3{H#{mfsP|[ bzn+}_Q{MT{u4kHcj_q`eZj[8o0jy{p7}C|[}l){MuYY{|Ff!Ykn3{rT|m,^R|,R}$~Ykgx{P!]>iXh6[l[/}Jgcg{JYZ.^qYfYIZl[gZ#Xj[Pc7YyZD^+Yt;4;`e8YyZVbQ7YzZxXja.7SYl[s]2^/Ha$[6ZGYrb%XiYdf2]H]kZkZ*ZQ[ZYS^HZXcCc%Z|[(bVZ]]:OJQ_DZCg<[,]%Zaa [g{C00HY[c%[ChyZ,Z_`PbXa+eh`^&jPi0a[ggvhlekL]w{Yp^v}[e{~;k%a&k^|nR_z_Qng}[E}*Wq:{k^{FJZpXRhmh3^p>de^=_7`|ZbaAZtdhZ?n4ZL]u`9ZNc3g%[6b=e.ZVfC[ZZ^^^hD{E(9c(kyZ=bb|Sq{k`|vmr>izlH[u|e`}49}Y%}FT{[z{Rk}Bz{TCc/lMiAqkf(m$hDc;qooi[}^o:c^|Qm}a_{mrZ(pA`,}<2sY| adf_%|}`}Y5U;}/4|D>|$X{jw{C<|F.hK|*A{MRZ8Zsm?imZm_?brYWZrYx`yVZc3a@f?aK^ojEd {bN}/3ZH]/$YZhm^&j 9|(S|b]mF}UI{q&aM]LcrZ5^.|[j`T_V_Gak}9J[ ZCZD|^h{N9{~&[6Zd{}B}2O|cv]K}3s}Uy|l,fihW{EG`j_QOp~Z$F^zexS`dcISfhZBXP|.vn|_HYQ|)9|cr]<`&Z6]m_(ZhPcSg>`Z]5`~1`0Xcb4k1{O!bz|CN_T{LR|a/gFcD|j<{Z._[f)mPc:1`WtIaT1cgYkZOaVZOYFrEe[}T$}Ch}mk{K-^@]fH{Hdi`c*Z&|Kt{if[C{Q;{xYB`dYIX:ZB[}]*[{{p9|4GYRh2ao{DS|V+[zd$`F[ZXKadb*A] Ys]Maif~a/Z2bmclb8{Jro_rz|x9cHojbZ{GzZx_)]:{wAayeDlx}<=`g{H1{l#}9i|)=|lP{Qq}.({La|!Y{i2EZfp=c*}Cc{EDvVB|;g}2t{W4av^Bn=]ri,|y?|3+}T*ckZ*{Ffr5e%|sB{lx^0]eZb]9[SgAjS_D|uHZx]dive[c.YPkcq/}db{EQh&hQ|eg}G!ljil|BO]X{Qr_GkGl~YiYWu=c3eb}29v3|D|}4i||.{Mv})V{SP1{FX}CZW6{cm|vO{pS|e#}A~|1i}81|Mw}es|5[}3w{C`h9aL]o{}p[G`>i%a1Z@`Ln2bD[$_h`}ZOjhdTrH{[j_:k~kv[Sdu]CtL}41{I |[[{]Zp$]XjxjHt_eThoa#h>sSt8|gK|TVi[Y{t=}Bs|b7Zpr%{gt|Yo{CS[/{iteva|cf^hgn}($_c^wmb^Wm+|55jrbF|{9^ q6{C&c+ZKdJkq_xOYqZYSYXYl`8]-cxZAq/b%b*_Vsa[/Ybjac/OaGZ4fza|a)gY{P?| I|Y |,pi1n7}9bm9ad|=d{aV|2@[(}B`d&|Uz}B}{`q|/H|!JkM{FU|CB|.{}Az}#P|lk}K{|2rk7{^8^?`/|k>|Ka{Sq}Gz}io{DxZh[yK_#}9<{TRdgc]`~Z>JYmYJ]|`!ZKZ]gUcx|^E[rZCd`f9oQ[NcD_$ZlZ;Zr}mX|=!|$6ZPZYtIo%fj}CpcN|B,{VDw~gb}@hZg`Q{LcmA[(bo`<|@$|o1|Ss}9Z_}tC|G`{F/|9nd}i=}V-{L8aaeST]daRbujh^xlpq8|}zs4bj[S`J|]?G{P#{rD{]I`OlH{Hm]VYuSYUbRc*6[j`8]pZ[bt_/^Jc*[<Z?YE|Xb|?_Z^Vcas]h{t9|Uwd)_(=0^6Zb{Nc} E[qZAeX[a]P^|_J>e8`W^j_Y}R{{Jp__]Ee#e:iWb9q_wKbujrbR}CY`,{mJ}gz{Q^{t~N|? gSga`V_||:#mi}3t|/I`X{N*|ct|2g{km}gi|{={jC}F;|E}{ZZjYf*frmu}8Tdroi{T[|+~}HG{cJ}DM{Lp{Ctd&}$hi3|FZ| m}Kr|38}^c|m_|Tr{Qv|36}?Up>|;S{DV{k_as}BK{P}}9p|t`jR{sAm4{D=b4pWa[}Xi{EjwEkI}3S|E?u=X0{jf} S|NM|JC{qo^3cm]-|JUx/{Cj{s>{Crt[UXuv|D~|j|d{YXZR}Aq}0r}(_{pJfi_z}0b|-vi)Z mFe,{f4|q`b{}^Z{HM{rbeHZ|^x_o|XM|L%|uFXm}@C_{{Hhp%a7|0p[Xp+^K}9U{bP}: tT}B|}+$|b2|[^|~h{FAby[`{}xgygrt~h1[li`c4vz|,7p~b(|mviN}^pg[{N/|g3|^0c,gE|f%|7N{q[|tc|TKA{LU}I@|AZp(}G-sz{F |qZ{}F|f-}RGn6{Z]_5})B}UJ{FFb2]4ZI@v=k,]t_Dg5Bj]Z-]L]vrpdvdGlk|gF}G]|IW}Y0[G| /bo|Te^,_B}#n^^{QHYI[?hxg{[`]D^IYRYTb&kJ[cri[g_9]Ud~^_]<p@_e_XdNm-^/|5)|h_{J;{kacVopf!q;asqd}n)|.m|bf{QW|U)}b+{tL|w``N|to{t ZO|T]jF}CB|0Q{e5Zw|k |We}5:{HO{tPwf_uajjBfX}-V_C_{{r~gg|Ude;s+}KNXH}! `K}eW{Upwbk%ogaW}9EYN}YY|&v|SL{C3[5s.]Y]I]u{M6{pYZ`^,`ZbCYR[1mNg>rsk0Ym[jrE]RYiZTr*YJ{Ge|%-lf|y(`=[t}E6{k!|3)}Zk} ][G{E~cF{u3U.rJ|a9p#o#ZE|?|{sYc#vv{E=|LC}cu{N8`/`3`9rt[4|He{cq|iSYxY`}V |(Q|t4{C?]k_Vlvk)BZ^r<{CL}#h}R+[<|i=}X|{KAo]|W<`K{NW|Zx}#;|fe{IMr<|K~tJ_x}AyLZ?{GvbLnRgN}X&{H7|x~}Jm{]-| GpNu0}.ok>|c4{PYisrDZ|fwh9|hfo@{H~XSbO]Odv]%`N]b1Y]]|eIZ}_-ZA]aj,>eFn+j[aQ_+]h[J_m_g]%_wf.`%k1e#Z?{CvYu_B^|gk`Xfh^M3`afGZ-Z|[m{L}|k3cp[it ^>YUi~d>{T*}YJ{Q5{Jxa$hg|%4`}|LAgvb }G}{P=|<;Ux{_skR{cV|-*|s-{Mp|XP|$G|_J}c6cM{_=_D|*9^$ec{V;|4S{qO|w_|.7}d0|/D}e}|0G{Dq]Kdp{}dfDi>}B%{Gd|nl}lf{C-{y}|ANZr}#={T~|-(}c&{pI|ft{lsVP}){|@u}!W|bcmB{d?|iW|:dxj{PSkO|Hl]Li:}VYk@|2={fnWt{M3`cZ6|)}|Xj}BYa?vo{e4|L7|B7{L7|1W|lvYO}W8nJ|$Vih|{T{d*_1|:-n2dblk``fT{Ky|-%}m!|Xy|-a{Pz}[l{kFjz|iH}9N{WE{x,|jz}R {P|{D)c=nX|Kq|si}Ge{sh|[X{RF{t`|jsr*fYf,rK|/9}$}}Nf{y!1|<Std}4Wez{W${Fd_/^O[ooqaw_z[L`Nbv[;l7V[ii3_PeM}.h^viqYjZ*j1}+3{bt{DR[;UG}3Og,rS{JO{qw{d<_zbAh<R[1_r`iZTbv^^a}c{iEgQZ<exZFg.^Rb+`Uj{a+{z<[~r!]`[[|rZYR|?F|qppp]L|-d|}K}YZUM|=Y|ktm*}F]{D;g{uI|7kg^}%?Z%ca{N[_<q4xC]i|PqZC]n}.bDrnh0Wq{tr|OMn6tM|!6|T`{O`|>!]ji+]_bTeU}Tq|ds}n|{Gm{z,f)}&s{DPYJ`%{CGd5v4tvb*hUh~bf]z`jajiFqAii]bfy^U{Or|m+{I)cS|.9k:e3`^|xN}@Dnlis`B|Qo{`W|>||kA}Y}{ERYuYx`%[exd`]|OyiHtb}HofUYbFo![5|+]gD{NIZR|Go}.T{rh^4]S|C9_}xO^i`vfQ}C)bK{TL}cQ|79iu}9a];sj{P.o!f[Y]pM``Jda^Wc9ZarteBZClxtM{LW}l9|a.mU}KX}4@{I+f1}37|8u}9c|v${xGlz}jP{Dd1}e:}31}%3X$|22i<v+r@~mf{sN{C67G97855F4YL5}8f{DT|xy{sO{DXB334@55J1)4.G9A#JDYtXTYM4, YQD9;XbXm9SX]IB^4UN=Xn<5(;(F3YW@XkH-X_VM[DYM:5XP!T&Y`6|,^{IS-*D.H>:LXjYQ0I3XhAF:9:(==.F*3F1189K/7163D,:@|e2{LS36D4hq{Lw/84443@4.933:0307::6D7}&l{Mx657;89;,K5678H&93D(H<&<>0B90X^I;}Ag1{P%3A+>><975}[S{PZE453?4|T2{Q+5187;>447:81{C=hL6{Me^:=7ii{R=.=F<81;48?|h8}Uh{SE|,VxL{ST,7?9Y_5Xk3A#:$%YSYdXeKXOD8+TXh7(@>(YdXYHXl9J6X_5IXaL0N?3YK7Xh!1?XgYz9YEXhXaYPXhC3X`-YLY_XfVf[EGXZ5L8BXL9YHX]SYTXjLXdJ: YcXbQXg1PX]Yx4|Jr{Ys4.8YU+XIY`0N,<H%-H;:0@,74/:8546I=9177154870UC]d<C3HXl7ALYzXFXWP<<?E!88E5@03YYXJ?YJ@6YxX-YdXhYG|9o{`iXjY_>YVXe>AYFX[/(I@0841?):-B=14337:8=|14{c&93788|di{cW-0>0<097/A;N{FqYpugAFT%X/Yo3Yn,#=XlCYHYNX[Xk3YN:YRT4?)-YH%A5XlYF3C1=NWyY}>:74-C673<69545v {iT85YED=64=.F4..9878/D4378?48B3:7:7/1VX[f4{D,{l<5E75{dAbRB-8-@+;DBF/$ZfW8S<4YhXA.(5@*11YV8./S95C/0R-A4AXQYI7?68167B95HA1*<M3?1/@;/=54XbYP36}lc{qzSS38:19?,/39193574/66878Yw1X-87E6=;964X`T734:>86>1/=0;(I-1::7ALYGXhF+Xk[@W%TYbX7)KXdYEXi,H-XhYMRXfYK?XgXj.9HX_SX]YL1XmYJ>Y}WwIXiI-3-GXcYyXUYJ$X`Vs[7;XnYEZ;XF! 3;%8;PXX(N3Y[)Xi1YE&/ :;74YQ6X`33C;-(>Xm0(TYF/!YGXg8 9L5P01YPXO-5%C|qd{{/K/E6,=0144:361:955;6443@?B7*7:F89&F35YaX-CYf,XiFYRXE_e{}sF 0*7XRYPYfXa5YXXY8Xf8Y~XmA[9VjYj*#YMXIYOXk,HHX40YxYMXU8OXe;YFXLYuPXP?EB[QV0CXfY{:9XV[FWE0D6X^YVP*$4%OXiYQ(|xp|%c3{}V`1>Y`XH00:8/M6XhQ1:;3414|TE|&o@1*=81G8<3}6<|(f6>>>5-5:8;093B^3U*+*^*UT30XgYU&7*O1953)5@E78--F7YF*B&0:%P68W9Zn5974J9::3}Vk|-,C)=)1AJ4+<3YGXfY[XQXmT1M-XcYTYZXCYZXEYXXMYN,17>XIG*SaS|/eYJXbI?XdNZ+WRYP<F:R PXf;0Xg`$|1GX9YdXjLYxWX!ZIXGYaXNYm6X9YMX?9EXmZ&XZ#XQ>YeXRXfAY[4 ;0X!Zz0XdN$XhYL XIY^XGNXUYS/1YFXhYk.TXn4DXjB{jg|4DEX]:XcZMW=A.+QYL<LKXc[vV$+&PX*Z3XMYIXUQ:ZvW< YSXFZ,XBYeXMM)?Xa XiZ4/EXcP3%}&-|6~:1(-+YT$@XIYRBC<}&,|7aJ6}bp|8)K1|Xg|8C}[T|8Q.89;-964I38361<=/;883651467<7:>?1:.}le|:Z=39;1Y^)?:J=?XfLXbXi=Q0YVYOXaXiLXmJXO5?.SFXiCYW}-;|=u&D-X`N0X^,YzYRXO(QX_YW9`I|>hZ:N&X)DQXP@YH#XmNXi$YWX^=!G6YbYdX>XjY|XlX^XdYkX>YnXUXPYF)FXT[EVTMYmYJXmYSXmNXi#GXmT3X8HOX[ZiXN]IU2>8YdX1YbX<YfWuZ8XSXcZU%0;1XnXkZ_WTG,XZYX5YSX Yp 05G?XcYW(IXg6K/XlYP4XnI @XnO1W4Zp-9C@%QDYX+OYeX9>--YSXkD.YR%Q/Yo YUX].Xi<HYEZ2WdCE6YMXa7F)=,D>-@9/8@5=?7164;35387?N<618=6>7D+C50<6B03J0{Hj|N9$D,9I-,.KB3}m |NzE0::/81YqXjMXl7YG; [.W=Z0X4XQY]:MXiR,XgM?9$9>:?E;YE77VS[Y564760391?14941:0=:8B:;/1DXjFA-564=0B3XlH1+D85:0Q!B#:-6&N/:9<-R3/7Xn<*3J4.H:+334B.=>30H.;3833/76464665755:/83H6633:=;.>5645}&E|Y)?1/YG-,93&N3AE@5 <L1-G/8A0D858/30>8<549=@B8] V0[uVQYlXeD(P#ID&7T&7;Xi0;7T-$YE)E=1:E1GR):--0YI7=E<}n9|aT6783A>D7&4YG7=391W;Zx<5+>F#J39}o/|cc;6=A050EQXg8A1-}D-|d^5548083563695D?-.YOXd37I$@LYLWeYlX<Yd+YR A$;3-4YQ-9XmA0!9/XLY_YT(=5XdDI>YJ5XP1ZAW{9>X_6R(XhYO65&J%DA)C-!B:97#A9;@?F;&;(9=11/=657/H,<8}bz|j^5446>.L+&Y^8Xb6?(CYOXb*YF(8X`FYR(XPYVXmPQ%&DD(XmZXW??YOXZXfCYJ79,O)XnYF7K0!QXmXi4IYFRXS,6<%-:YO(+:-3Q!1E1:W,Zo}Am|n~;3580534*?3Zc4=9334361693:30C<6/717:<1/;>59&:4}6!|rS36=1?75<8}[B|s809983579I.A.>84758=108564741H*9E{L{|u%YQ<%6XfH.YUXe4YL@,>N}Tv|ve*G0X)Z;/)3@A74(4P&A1X:YVH97;,754*A66:1 D739E3553545558E4?-?K17/770843XAYf838A7K%N!YW4.$T19Z`WJ*0XdYJXTYOXNZ 1XaN1A+I&Xi.Xk3Z3GB&5%WhZ1+5#Y[X<4YMXhQYoQXVXbYQ8XSYUX4YXBXWDMG0WxZA[8V+Z8X;D],Va$%YeX?FXfX[XeYf<X:Z[WsYz8X_Y]%XmQ(!7BXIZFX]&YE3F$(1XgYgYE& +[+W!<YMYFXc;+PXCYI9YrWxGXY9DY[!GXiI7::)OC;*$.>N*HA@{C|}&k=:<TB83X`3YL+G4XiK]i}(fYK<=5$.FYE%4*5*H*6XkCYL=*6Xi6!Yi1KXR4YHXbC8Xj,B9ZbWx/XbYON#5B}Ue}+QKXnF1&YV5XmYQ0!*3IXBYb71?1B75XmF;0B976;H/RXU:YZX;BG-NXj;XjI>A#D3B636N;,*%<D:0;YRXY973H5)-4FXOYf0:0;/7759774;7;:/855:543L43<?6=E,.A4:C=L)%4YV!1(YE/4YF+ F3%;S;&JC:%/?YEXJ4GXf/YS-EXEYW,9;E}X$}547EXiK=51-?71C%?57;5>463553Zg90;6447?<>4:9.7538XgN{|!}9K/E&3-:D+YE1)YE/3;37/:05}n<}:UX8Yj4Yt864@JYK..G=.(A Q3%6K>3(P3#AYE$-6H/456*C=.XHY[#S.<780191;057C)=6HXj?955B:K1 E>-B/9,;5.!L?:0>/.@//:;7833YZ56<4:YE=/:7Z_WGC%3I6>XkC*&NA16X=Yz2$X:Y^&J48<99k8}CyB-61<18K946YO4{|N}E)YIB9K0L>4=46<1K0+R;6-=1883:478;4,S+3YJX`GJXh.Yp+Xm6MXcYpX(>7Yo,/:X=Z;Xi0YTYHXjYmXiXj;*;I-8S6N#XgY}.3XfYGO3C/$XjL$*NYX,1 6;YH&<XkK9C#I74.>}Hd`A748X[T450[n75<4439:18A107>|ET}Rf<1;14876/Yb983E<5.YNXd4149>,S=/4E/<306443G/06}0&}UkYSXFYF=44=-5095=88;63844,9E6644{PL}WA8:>)7+>763>>0/B3A545CCnT}Xm|dv}Xq1L/YNXk/H8;;.R63351YY747@15YE4J8;46;.38.>4A369.=-83,;Ye3?:3@YE.4-+N353;/;@(X[YYD>@/05-I*@.:551741Yf5>6A443<3535;.58/86=D4753442$635D1>0359NQ @73:3:>><Xn?;43C14 ?Y|X611YG1&<+,4<*,YLXl<1/AIXjF*N89A4Z576K1XbJ5YF.ZOWN.YGXO/YQ01:4G38Xl1;KI0YFXB=R<7;D/,/4>;$I,YGXm94@O35Yz66695385.>:6A#5}W7n^4336:4157597434433<3|XA}m`>=D>:4A.337370?-6Q96{`E|4A}C`|Qs{Mk|J+~r>|o,wHv>Vw}!c{H!|Gb|*Ca5}J||,U{t+{CN[!M65YXOY_*B,Y[Z9XaX[QYJYLXPYuZ%XcZ8LY[SYPYKZM<LMYG9OYqSQYM~[e{UJXmQYyZM_)>YjN1~[f3{aXFY|Yk:48YdH^NZ0|T){jVFYTZNFY^YTYN~[h{nPYMYn3I]`EYUYsYIZEYJ7Yw)YnXPQYH+Z.ZAZY]^Z1Y`YSZFZyGYHXLYG 8Yd#4~[i|+)YH9D?Y^F~Y7|-eYxZ^WHYdYfZQ~[j|3>~[k|3oYmYqY^XYYO=Z*4[]Z/OYLXhZ1YLZIXgYIHYEYK,<Y`YEXIGZI[3YOYcB4SZ!YHZ*&Y{Xi3~[l|JSY`Zz?Z,~[m|O=Yi>??XnYWXmYS617YVYIHZ(Z4[~L4/=~[n|Yu{P)|];YOHHZ}~[o33|a>~[r|aE]DH~[s|e$Zz~[t|kZFY~XhYXZB[`Y}~[u|{SZ&OYkYQYuZ2Zf8D~[v}% ~[w3},Q[X]+YGYeYPIS~[y}4aZ!YN^!6PZ*~[z}?E~[{3}CnZ=~[}}EdDZz/9A3(3S<,YR8.D=*XgYPYcXN3Z5 4)~[~}JW=$Yu.XX~] }KDX`PXdZ4XfYpTJLY[F5]X~[2Yp}U+DZJ::<446[m@~]#3}]1~]%}^LZwZQ5Z`/OT<Yh^ -~]&}jx[ ~m<z!%2+~ly4VY-~o>}p62yz!%2+Xf2+~ly4VY-zQ`z (=] 2z~o2",C={" ":0,"!":1},c=34,i=2,p,s=[],u=String.fromCharCode,t=u(12539);while(++c<127)C[u(c)]=c^39&&c^92?i++:0;i=0;while(0<=(c=C[a.charAt(i++)]))if(16==c)if((c=C[a.charAt(i++)])<87){if(86==c)c=1879;while(c--)s.push(u(++p))}else s.push(s.join("").substr(8272,360));else if(c<86)s.push(u(p+=c<51?c-16:(c-55)*92+C[a.charAt(i++)]));else if((c=((c-86)*92+C[a.charAt(i++)])*92+C[a.charAt(i++)])<49152)s.push(u(p=c<40960?c:c|57344));else{c&=511;while(c--)s.push(t);p=12539}return s.join("")')();

JCT8836=JCT11280.substring(0,8836);
/*USとChromeで違うゾーン*/
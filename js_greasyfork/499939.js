// ==UserScript==
// @name         [케인] 댓글사진확대 + 글씨확대 + 트게더스킨
// @namespace    https://cafe.naver.com/kanetv
// @version      8.7
// @description  [케인/도꼬미 팬카페 전용]
// @author       돈통
// @match        https://cafe.naver.com/kanetv*
// @match        https://cafe.naver.com/dokkome*
// @match        https://cafe.naver.com/f-e/cafes/28445106*
// @match        https://cafe.naver.com/f-e/cafes/31370568*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAACTSURBVDhPY6AUMEJpDFCs/fU/lIkCeq9yo+jBagCxmkGACUrDAS7NuACGAbgANttBAEOw+Lket7E4Jw+UyxDFdPIllIkVgA0g1dkg0Ds3TZbBYukTsg0Agz2WPESHATKAh4fL8S9kGcBwIloGyiI/DEAA5BJ4LJBqCMwbJBuAnh5QOIQMwZaYMARwGYJNMxUAAwMAWZQyUi84O4wAAAAASUVORK5CYII=
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499939/%5B%EC%BC%80%EC%9D%B8%5D%20%EB%8C%93%EA%B8%80%EC%82%AC%EC%A7%84%ED%99%95%EB%8C%80%20%2B%20%EA%B8%80%EC%94%A8%ED%99%95%EB%8C%80%20%2B%20%ED%8A%B8%EA%B2%8C%EB%8D%94%EC%8A%A4%ED%82%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/499939/%5B%EC%BC%80%EC%9D%B8%5D%20%EB%8C%93%EA%B8%80%EC%82%AC%EC%A7%84%ED%99%95%EB%8C%80%20%2B%20%EA%B8%80%EC%94%A8%ED%99%95%EB%8C%80%20%2B%20%ED%8A%B8%EA%B2%8C%EB%8D%94%EC%8A%A4%ED%82%A8.meta.js
// ==/UserScript==






var numver = 8.7;

var comnum=0;
var a = 0;
var b = 0;
var z = 0;
var buttonadd = 0;
var stop = 0;
var newnum = 0;
let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

function enableRightClick(doc) {
        if (!doc) return;

        var css = doc.createElement('style');
        css.type = 'text/css';
        css.innerText = `* {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
        }`;

        var body = doc.body;

        // Remove event restrictions
        doc.oncontextmenu = null;
        doc.onselectstart = null;
        doc.ondragstart = null;
        doc.onmousedown = null;
        body.oncontextmenu = null;
        body.onselectstart = null;
        body.ondragstart = null;
        body.onmousedown = null;
        body.oncut = null;
        body.oncopy = null;
        body.onpaste = null;

        // Stop event propagation for copy/paste/select
        ['copy', 'cut', 'paste', 'select', 'selectstart'].forEach(function(event) {
            doc.addEventListener(event, function(e) { e.stopPropagation(); }, true);
        });

        // Stop propagation for additional events in absolute mode
        ['contextmenu', 'copy', 'cut', 'paste', 'drag', 'dragstart', 'select', 'selectstart'].forEach(function(event) {
            doc.addEventListener(event, function(e) { e.stopPropagation(); }, true);
        });

        doc.head.appendChild(css);
        console.log("우클릭 제한 해제!");
    }



// 현재 URL 확인
const currentURL = window.location.href;

// URL에 따른 동작
if (currentURL.includes('https://cafe.naver.com/f-e/cafes/28445106') || currentURL.includes('https://cafe.naver.com/f-e/cafes/31370568')) {
    console.log('새로운 카페에서 스크립트 작동!');
    let observerinki = new MutationObserver(e => {
        console.log("inki detected!!");
        setTimeout(function(){
            var inkilistpage ;
            try{
                inkilistpage = document.getElementsByClassName("Sidebar_aside_menu_list__Ip6Gf")[0].getElementsByTagName("li")[1].getElementsByTagName("a")[0].className;
            }catch{
                try{
                    inkilistpage = document.getElementsByClassName("Sidebar_aside_menu_list__Ip6Gf")[0].getElementsByTagName("li")[1].getElementsByTagName("a")[0].className;
                }catch{};};
            console.log(inkilistpage);
            if((GM_getValue("tgdskin") == true || GM_getValue("star") == true) && inkilistpage == "Sidebar_link__gAh1M Sidebar_isSelected__3xsnZ") inkilist();
            if(inkilistpage != "Sidebar_link__gAh1M Sidebar_isSelected__3xsnZ") addbutton();

            if(stop==1) return 0;
            let cn = Number(document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName('button_comment')[0].getElementsByClassName('num')[0].innerHTML);
            console.log(cn);
            var pages = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("btn_register is_active")
            var pagesnum = pages.length;
            for(let idx=0; idx<pagesnum; idx++){
                console.log(pages[idx].classList);
                if(pages[idx].classList.contains('eventlistening')) continue;
                pages[idx].classList.add('eventlistening');
                pages[idx].addEventListener("click", async function(){
                    console.log("댓글 수정/등록됨");
                    if(stop==1) return 0;
                    await sleep(500);
                    let a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                    //console.log(a)
                    var waittime = 0
                    a.forEach((element) => {
                        if (element.firstChild.src == "" || element.firstChild.src.startsWith("https://cafe.naver.com")){
                            //console.log("wait");
                            waittime = waittime + 50;
                            a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                        }
                    });
                    //console.log(waittime);
                    setTimeout(function(){
                        a.forEach((element) => {
                            if(element.firstChild.currentSrc.includes("_gif")==true){element.firstChild.currentSrc = element.firstChild.currentSrc.replaceAll("?type=mc250_375_gif","");}
                            if(element.firstChild.src.includes("_gif")==true){element.firstChild.src = element.firstChild.src.replaceAll("?type=mc250_375_gif","");}
                            element.firstChild.currentSrc = element.firstChild.currentSrc.replaceAll("?type=mc250_375","");
                            element.firstChild.src = element.firstChild.src.replaceAll("?type=mc250_375","");
                            //console.log(element.firstChild.outerHTML);
                        });},waittime);
                    console.log("enlarge picture");
                }, false);
            }
            if(comnum == cn){
                if (document.getElementById("Enlarge_button") != null){
                    console.log("안늘립니다. skip");
                    return;
                }
            }
            window.setTimeout(function(){
                a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                //console.log(a)
                comnum = cn;
                var waittime = 0
                a.forEach((element) => {
                    if (element.firstChild.src == "" || element.firstChild.src.startsWith("https://cafe.naver.com")){
                        //console.log("wait");
                        waittime = waittime + 50;
                        a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                    }
                });
                //console.log(waittime);
                setTimeout(function(){
                    enableRightClick(document.querySelector('#cafe_main').contentWindow.document);
                    a.forEach((element) => {
                        if(element.firstChild.currentSrc.includes("_gif")==true){element.firstChild.currentSrc = element.firstChild.currentSrc.replaceAll("?type=mc250_375_gif","");}
                        if(element.firstChild.src.includes("_gif")==true){element.firstChild.src = element.firstChild.src.replaceAll("?type=mc250_375_gif","");}
                        element.firstChild.currentSrc = element.firstChild.currentSrc.replaceAll("?type=mc250_375","");
                        element.firstChild.src = element.firstChild.src.replaceAll("?type=mc250_375","");
                        //console.log(element.firstChild.src);
                    });},waittime);
                console.log("enlarge picture");
            },100);
        },100);
    });


    let observerBoard = new MutationObserver(e => {
        console.log("board detected!!");
        setTimeout(function(){
            var inkilistpage ;
            try{
                inkilistpage = document.getElementsByClassName("Sidebar_aside_menu_list__Ip6Gf")[0].getElementsByTagName("li")[1].getElementsByTagName("a")[0].ariaSelected;
            }catch{
                try{
                    inkilistpage = document.getElementsByClassName("Sidebar_aside_menu_list__Ip6Gf")[0].getElementsByTagName("li")[1].getElementsByTagName("a")[0].ariaSelected;
                }catch{};};
            console.log(inkilistpage);
            if((GM_getValue("tgdskin") == true || GM_getValue("star") == true) && inkilistpage == 'false') inkilistboard();
            },100);
    });



    let observer = new MutationObserver(e => {
        console.log("detected!!");
        if(stop==1) return 0;
        let cn = Number(document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName('button_comment')[0].getElementsByClassName('num')[0].innerHTML);
        console.log(cn);
        console.log(comnum);

        var pages = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("btn_register is_active")
        var pagesnum = pages.length;
        for(let idx=0; idx<pagesnum; idx++){
            console.log(pages[idx].classList);
            if(pages[idx].classList.contains('eventlistening')) continue;
            pages[idx].classList.add('eventlistening');
            pages[idx].addEventListener("click", async function(){
                console.log("댓글 수정/등록됨");
                if(stop==1) return 0;
                await sleep(500);
                let a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                //console.log(a)
                var waittime = 0
                a.forEach((element) => {
                    if (element.firstChild.src == "" || element.firstChild.src.startsWith("https://cafe.naver.com")){
                        //console.log("wait");
                        waittime = waittime + 50;
                        a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                    }
                });
                //console.log(waittime);
                setTimeout(function(){
                    a.forEach((element) => {
                        if(element.firstChild.currentSrc.includes("_gif")==true){element.firstChild.currentSrc = element.firstChild.currentSrc.replaceAll("?type=mc250_375_gif","");}
                        if(element.firstChild.src.includes("_gif")==true){element.firstChild.src = element.firstChild.src.replaceAll("?type=mc250_375_gif","");}
                        element.firstChild.currentSrc = element.firstChild.currentSrc.replaceAll("?type=mc250_375","");
                        element.firstChild.src = element.firstChild.src.replaceAll("?type=mc250_375","");
                        //console.log(element.firstChild.outerHTML);
                    });
                    enableRightClick(document.querySelector('#cafe_main').contentWindow.document);
                },waittime);
                console.log("enlarge picture");
            }, false);
        }
        if(comnum == cn){
            return;
        }
        window.setTimeout(function(){
            a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
            //console.log(a)
            comnum = cn;
            var waittime = 0
            a.forEach((element) => {
                if (element.firstChild.src == "" || element.firstChild.src.startsWith("https://cafe.naver.com")){
                    //console.log("wait");
                    waittime = waittime + 50;
                    a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                }
            });
            //console.log(waittime);
            setTimeout(function(){
                a.forEach((element) => {
                    if(element.firstChild.currentSrc.includes("_gif")==true){element.firstChild.currentSrc = element.firstChild.currentSrc.replaceAll("?type=mc250_375_gif","");}
                    if(element.firstChild.src.includes("_gif")==true){element.firstChild.src = element.firstChild.src.replaceAll("?type=mc250_375_gif","");}
                    element.firstChild.currentSrc = element.firstChild.currentSrc.replaceAll("?type=mc250_375","");
                    element.firstChild.src = element.firstChild.src.replaceAll("?type=mc250_375","");
                    //console.log(element.firstChild.src);
                });
            enableRightClick(document.querySelector('#cafe_main').contentWindow.document);
            },waittime);
            console.log("enlarge picture");
        },100);
    });

    function sleep(sec) {
        return new Promise(resolve => setTimeout(resolve, sec));
    }

    function addObserverIfDesiredNodeAvailable() {
        console.log("try observe");
        //const composeBox = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName('CommentBox');
        const composeBox = document.getElementsByClassName("Sidebar_aside_menu_list__Ip6Gf");
        if(!composeBox[0]) {
            window.setTimeout(addObserverIfDesiredNodeAvailable,500);
            return;
        }
        console.log("found it!")
        console.log(composeBox[1]);
        observer.observe(document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName('CommentBox')[0], {childList: true, subtree: true, characterData: true});
        try{
            observerinki.observe(document.getElementsByClassName("Sidebar_aside_menu_list__Ip6Gf")[0].getElementsByTagName("li")[1].getElementsByTagName("a")[0], {childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class']});
        }catch{
            try{
                observerinki.observe(document.getElementsByClassName("Sidebar_aside_menu_list__Ip6Gf")[0].getElementsByTagName("li")[1].getElementsByTagName("a")[0], {childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class']});
            }catch{}};
        try{
            observerBoard.observe(document.getElementsByClassName("Sidebar_aside_menu_list__Ip6Gf")[0].getElementsByTagName("li")[1], {childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class']});
        }catch{
            try{
                observerBoard.observe(document.getElementsByClassName("Sidebar_aside_menu_list__Ip6Gf")[0].getElementsByTagName("li")[1], {childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class']});
            }catch{}};
        console.log("ok1");
    }


    async function getcommentlist(){
        return new Promise((resolve, reject) => {
            console.log("wait until loaded");
            var intv0 = setInterval(function() {
                try{
                    var elems = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.ArticleLoading');
                }catch{return false;}
                //console.log('.ArticleLoading')
                if(elems.length > 0){
                    return false
                }
                //when element is found, clear the interval.
                console.log("loaded");
                clearInterval(intv0);
                console.log("finding element...");
                var intvf = setInterval(function() {
                    try{
                        var elems = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName('button_comment')[0].getElementsByClassName('num')[0].innerHTML;
                    }catch{return false;}
                    //when element is found, clear the interval.
                    console.log("element is found");
                    clearInterval(intvf);
                    clearInterval(intv0);
                    resolve(true);
                }, 100);
            }, 100);
        });

    }


    async function addiconstar(retryCount = 0, maxRetries = 100) {
        //console.log("addiconstar 실행, 재시도 횟수:", retryCount);
        
        // 최대 재시도 횟수 초과 시 종료
        if (retryCount >= maxRetries) {
            //console.log("최대 재시도 횟수 초과, addiconstar 종료");
            return;
        }

        try {
            let dd = document.getElementsByClassName("BoardTopOption")[0];
            if (!dd) {
                //console.error("BoardTopOption 요소를 찾을 수 없습니다. 게시글 목록이 나타날 때까지 1초 뒤 다시 확인");
                setTimeout(() => addiconstar(retryCount + 1, 99999999999), 1000);
                return;
            }
            if (dd.getElementsByClassName("total").length == 0) {
                //console.log("전체글보기에서만 추가합니다.");
                return;
            }

            const articleBoard = document.getElementsByClassName("article-board")[0];
            const aa = articleBoard.getElementsByClassName('td_normal');
            
            if (aa.length === 0) {
                //console.log("[1] 전체글보기 로딩 중.. 1초 뒤 다시 확인");
                setTimeout(() => addiconstar(retryCount + 1, maxRetries), 1000);
                return;
            }

            const d = articleBoard.getElementsByClassName("board-list");
            let e, bestcut = 0;

            // 좋아요 또는 조회수 기반 bestcut 설정
            try {
                e = articleBoard.getElementsByClassName("td_likes");
                if (e.length !== 0) bestcut = 10;
            } catch {
                try {
                    e = articleBoard.getElementsByClassName("td_view");
                    bestcut = 350;
                } catch {}
            }

            const newnum = d.length;
            //console.log("별추가, 게시글 수:", newnum);
            const likenum = e.length;

            for (let idx = 0; idx < newnum; idx++) {
                const nnum = d[idx].childNodes[0].childNodes.length;
                let ot = 0, om = 0, ir = 1000, mr = 1000, no = 0;

                //console.log(idx, "##################");

                // 이미지/비디오 SVG 및 GitHub 이미지 확인
                for (let idxx = 0; idxx < nnum; idxx++) {
                    //console.log(idxx, "00000000000000000");
                    try {
                        const svg = d[idx].childNodes[0].getElementsByTagName("svg")[0];
                        if (svg?.className.baseVal === "svg-icon list_attach_img AttachInfoBadge_wrap__cZIf2") {
                            ot += 1;
                            ir = idxx;
                        } else if (svg?.className.baseVal === "svg-icon list_attach_video AttachInfoBadge_wrap__cZIf2") {
                            om += 1;
                            mr = idxx;
                        }
                    } catch {}
                    try {
                        //console.log((d[idx].childNodes[0].childNodes[idxx].src));
                        if (d[idx].childNodes[0].childNodes[idxx].src?.includes("raw.githubusercontent")) {
                            no += 1;
                        }
                    } catch {}
                }

                if (no > 0) continue;

                //console.log("아이콘 추가 중");

                // 아이콘 추가 로직
                const addIcon = (src) => {
                    const z = document.createElement('img');
                    z.src = src;
                    z.width = 12;
                    z.height = 12;
                    z.style = "vertical-align: middle; padding-bottom: 2px;";
                    d[idx].childNodes[0].prepend(z);
                };

                if ((GM_getValue('star') || GM_getValue('tgdskin')) && likenum !== 0 && e[idx]?.textContent >= bestcut) {
                    addIcon("https://raw.githubusercontent.com/ywj515/tgdcafe/main/star.svg");
                } else if (GM_getValue('tgdskin') && om > 0) {
                    addIcon("https://raw.githubusercontent.com/ywj515/tgdcafe/main/video.svg");
                } else if (GM_getValue('tgdskin') && ot > 0) {
                    addIcon("https://raw.githubusercontent.com/ywj515/tgdcafe/main/image_green.svg");
                } else if (GM_getValue('tgdskin')) {
                    addIcon("https://raw.githubusercontent.com/ywj515/tgdcafe/main/text.svg");
                }
            }

            // 페이지네이션 버튼에 이벤트 리스너 추가 (중복 방지)
            try {
                const pagination = document.getElementsByClassName("Pagination")[0];
                const buttons = pagination.getElementsByClassName("btn");
                for (let iii = 0; iii < buttons.length && iii < 12; iii++) {
                    if (!buttons[iii].dataset.listener) {
                        buttons[iii].addEventListener("click", () => {
                            //console.log("페이지네이션 버튼 클릭");
                            setTimeout(() => addiconstar(0, maxRetries), 1000);
                        });
                        buttons[iii].dataset.listener = "true";
                    }
                }
            } catch {
                //console.log("페이지네이션 버튼 처리 실패");
            }

        } catch (error) {
            //console.log("[2] 전체글보기 로딩 중.. 1초 뒤 다시 확인", error);
            setTimeout(() => addiconstar(retryCount + 1, maxRetries), 1000);
        }
    }





    async function boldlist(){

        //let d = document.getElementsByClassName("Sidebar_aside_menu_list__Ip6Gf")[1].getElementsByTagName("li")[1].getElementsByTagName("a")[0].className == "Sidebar_link__gAh1M Sidebar_isSelected__3xsnZ"
        let d = document.getElementsByClassName("Sidebar_aside_menu_list__Ip6Gf")
        console.log(d);
        var dnewnum = d.length;
        console.log(newnum);
        for(let idx=0; idx<dnewnum; idx++){
            let e = d[idx].getElementsByTagName("li");
            var dnewnumm = e.length;
            for(let idxx=0; idxx<dnewnumm; idxx++){
                try{
                    let cname = e[idxx].getElementsByTagName("a")[0].className;
                    let ctext = e[idxx].getElementsByTagName("a")[0].innerText;
                    console.log(cname);
                    console.log(ctext);
                    if(e[idxx].getElementsByTagName("a")[0].className == "Sidebar_link__gAh1M Sidebar_isSelected__3xsnZ"){
                        console.log(ctext);
                        return e[idxx].getElementsByTagName("a")[0].innerText;
                    }
                }catch{};
            }
        }
        console.log("none");
        return "none";
    }








    async function addbutton(){
        await console.log("버튼넣는중");
        //var bolddd = await boldlist();
        if(true){
            var intchecking = await setInterval(async function() {
                console.log("trying");
                try{
                    if ( comnum == 0 || comnum == "0" || document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName('comment_refresh_button')[0].id == "hey"){
                        console.log("버튼 이미있음/댓글 없음");
                        clearInterval(intchecking);
                        return 0;
                    }
                }catch{};
            }, 500);

            var btn;
            var btn2;
            var vernum;
            var intve = await setInterval(async function() {
                try{
                    var target = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName('comment_tab')[0];
                    if (await document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName('comment_refresh_button')[0].id == "hey"){
                        console.log("버튼 이미있음");
                        clearInterval(intve);
                        return 0;
                    }
                    document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName('comment_refresh_button')[0].id = "hey";
                    btn = document.createElement("button");
                    btn.style.cssText = `color: white; padding: 2px; text-align: center; width: 50px; background-color: crimson; border-radius: 5px; margin-left: 10px; font-size: 12px; text-decoration: none; cursor: pointer;`
                    btn.innerText = `확대OFF`
                    btn.target = "_blank"
                    btn.role = "button"
                    btn.className = "Enlarge_button"
                    btn.onclick = () => {
                        console.log("확대 재시작");
                        target.removeChild(btn);
                        target.appendChild(btn2);
                        stop = 0;
                        document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("comment_refresh_button")[0].click();

                    };
                    btn2 = document.createElement("button");
                    btn2.style.cssText = `color: white; padding: 2px; text-align: center; width: 50px; background-color: green; border-radius: 5px; margin-left: 10px; font-size: 12px; text-decoration: none; cursor: pointer;`
                    btn2.innerText = `확대ON`
                    btn2.target = "_blank"
                    btn2.role = "button"
                    btn2.className = "Enlarge_button"
                    btn2.onclick = () => {
                        console.log("확대 중지");
                        target.removeChild(btn2);
                        target.appendChild(btn);
                        stop = 1;
                        document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("comment_refresh_button")[0].click();
                    };
                    try{
                        var targetver = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName('CommentCleanBot cleanbot')[0];
                        vernum = document.createElement("div");
                        vernum.style.cssText = `color: black; margin-left: 10px; font-size: 10px; font-weight: 200; text-decoration: none;`
                        vernum.innerText = `Ver`+numver;
                        vernum.target = "_blank"
                    }catch{};

                    //console.log("made on off button");
                }catch{
                    return false;}
                try{
                    console.log("check");
                    if(stop == 1) target.appendChild(btn);
                    else target.appendChild(btn2);
                    targetver.appendChild(vernum);
                }catch{
                    return false;
                }
                //console.log("made on off button");
                //when element is found, clear the interval.
                console.log("added on off button");
                clearInterval(intve);
            }, 100);
            var intve2 = await setInterval(await function() {
                try{
                    document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("comment_refresh_button")[0].addEventListener("click", async function(){
                        console.log("새로고침 됨");
                        if(stop==1){
                            console.log("확대안해");
                            let a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                            var waittime = 0
                            a.forEach((element) => {
                                if (element.firstChild.src == "" || element.firstChild.src.startsWith("https://cafe.naver.com")){
                                    //console.log("wait");
                                    waittime = waittime + 50;
                                    a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                                }
                            });
                            //console.log(waittime);
                            setTimeout(function(){
                                a.forEach((element) => {
                                    //if(element.firstChild.currentSrc.includes("?type=mc250_375")==false){
                                    //element.firstChild.currentSrc = element.firstChild.currentSrc + "?type=mc250_375";}
                                    //if(element.firstChild.src.includes("?type=mc250_375")==false){
                                    //element.firstChild.src = element.firstChild.src + "?type=mc250_375";}
                                });},waittime);
                            console.log("shrink picture");
                            //console.log(a);
                            return 0;
                        }
                        await sleep(500);
                        let a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                        waittime = 0
                        a.forEach((element) => {
                            if (element.firstChild.src == "" || element.firstChild.src.startsWith("https://cafe.naver.com")){
                                console.log("wait");
                                waittime = waittime + 50;
                                a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                            }
                        });
                        //console.log(a);
                        //console.log(waittime);
                        setTimeout(function(){
                            a.forEach((element) => {
                                if(element.firstChild.currentSrc.includes("_gif")==true){element.firstChild.currentSrc = element.firstChild.currentSrc.replaceAll("?type=mc250_375_gif","");}
                                if(element.firstChild.src.includes("_gif")==true){element.firstChild.src = element.firstChild.src.replaceAll("?type=mc250_375_gif","");}
                                element.firstChild.currentSrc = element.firstChild.currentSrc.replaceAll("?type=mc250_375","");
                                element.firstChild.src = element.firstChild.src.replaceAll("?type=mc250_375","");
                                //console.log(element.firstChild.src);
                            });
                        enableRightClick(document.querySelector('#cafe_main').contentWindow.document);
                        },waittime);
                        console.log("enlarge picture");
                        //console.log(a);
                    }, false);
                }catch{return false;}
                //when element is found, clear the interval.
                //console.log("added refresh func");
                clearInterval(intve2);
            }, 100);
            var intve3 = await setInterval(await function() {
                try{
                    document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("comment_tab_button")[0].addEventListener("click", async function(){
                        console.log("새로고침 됨");
                        if(stop==1) return 0;
                        await sleep(500);
                        let a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                        var waittime = 0
                        a.forEach((element) => {
                            if (element.firstChild.src == "" || element.firstChild.src.startsWith("https://cafe.naver.com")){
                                //console.log("wait");
                                waittime = waittime + 50;
                                a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                            }
                        });
                        //console.log(waittime);
                        setTimeout(function(){
                            a.forEach((element) => {
                                if(element.firstChild.currentSrc.includes("_gif")==true){element.firstChild.currentSrc = element.firstChild.currentSrc.replaceAll("?type=mc250_375_gif","");}
                                if(element.firstChild.src.includes("_gif")==true){element.firstChild.src = element.firstChild.src.replaceAll("?type=mc250_375_gif","");}
                                element.firstChild.currentSrc = element.firstChild.currentSrc.replaceAll("?type=mc250_375","");
                                element.firstChild.src = element.firstChild.src.replaceAll("?type=mc250_375","");
                                //console.log(element.firstChild.outerHTML);
                            });
                        enableRightClick(document.querySelector('#cafe_main').contentWindow.document);
                        },waittime);
                        console.log("enlarge picture");
                    }, false);
                }catch{return false;}
                //when element is found, clear the interval.
                //console.log("added tab 0 func");
                clearInterval(intve3);
            }, 100);
            var intve4 = await setInterval(await function() {
                try{
                    document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("comment_tab_button")[1].addEventListener("click", async function(){
                        console.log("새로고침 됨");
                        if(stop==1) return 0;
                        await sleep(500);
                        let a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                        var waittime = 0
                        a.forEach((element) => {
                            if (element.firstChild.src == "" || element.firstChild.src.startsWith("https://cafe.naver.com")){
                                //console.log("wait");
                                waittime = waittime + 50;
                                a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                            }
                        });
                        //console.log(waittime);
                        setTimeout(function(){
                            a.forEach((element) => {
                                if(element.firstChild.currentSrc.includes("_gif")==true){element.firstChild.currentSrc = element.firstChild.currentSrc.replaceAll("?type=mc250_375_gif","");}
                                if(element.firstChild.src.includes("_gif")==true){element.firstChild.src = element.firstChild.src.replaceAll("?type=mc250_375_gif","");}
                                element.firstChild.currentSrc = element.firstChild.currentSrc.replaceAll("?type=mc250_375","");
                                element.firstChild.src = element.firstChild.src.replaceAll("?type=mc250_375","");
                                //console.log(element.firstChild.outerHTML);
                            });},waittime);
                        console.log("enlarge picture");
                    }, false);
                }catch{return false;}
                //when element is found, clear the interval.
                //console.log("added tab 1 func");
                clearInterval(intve4);
            }, 100);
            var intve5 = await setInterval(await function() {
                try{
                    var pages = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("btn number")
                    var pagesnum = pages.length;
                    for(let idx=0; idx<pagesnum; idx++){
                        pages[idx].addEventListener("click", async function(){
                            console.log("새로고침 됨");
                            if(stop==1) return 0;
                            await sleep(500);
                            let a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                            var waittime = 0
                            a.forEach((element) => {
                                if (element.firstChild.src == "" || element.firstChild.src.startsWith("https://cafe.naver.com")){
                                    //console.log("wait");
                                    waittime = waittime + 50;
                                    a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                                }
                            });
                            //console.log(waittime);
                            setTimeout(function(){
                                a.forEach((element) => {
                                    if(element.firstChild.currentSrc.includes("_gif")==true){element.firstChild.currentSrc = element.firstChild.currentSrc.replaceAll("?type=mc250_375_gif","");}
                                    if(element.firstChild.src.includes("_gif")==true){element.firstChild.src = element.firstChild.src.replaceAll("?type=mc250_375_gif","");}
                                    element.firstChild.currentSrc = element.firstChild.currentSrc.replaceAll("?type=mc250_375","");
                                    element.firstChild.src = element.firstChild.src.replaceAll("?type=mc250_375","");
                                    //console.log(element.firstChild.outerHTML);
                                });},waittime);
                            console.log("enlarge picture");
                        }, false);
                    }
                }catch{return false;}
                //when element is found, clear the interval.
                //console.log("added number func");
                clearInterval(intve5);
            }, 100);
            console.log("eeeeeeeeeeeeeeeeeee");
            if(GM_getValue('tgdskinstar', true) && GM_getValue('choo', true)){
                console.log("ddddddddddddddddddddd");
                GM_setValue('choo', false);
                setTimeout(async function(){
                    //let g = await ifDesiredNodeAvailable("u_txt _label");
                    let g = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("u_txt _label");
                    console.log(g);
                    if (currentURL.includes('https://cafe.naver.com/f-e/cafes/28445106')){
                        g[0].innerText = "뭉추";
                        g[0].outerText = "뭉추";
                    }
                    else{
                        g[0].innerText = "도추";
                        g[0].outerText = "도추";
                    }
                },10)
                GM_setValue('choo', true);
            }
            if(GM_getValue('bestcom',true)){
                await bestcomment();
            }
        }
    }














    function enableCommandMenu() {
        var commandMenu = true;
        try {
            if (typeof(GM_registerMenuCommand) == undefined) {
                return;
            } else {
                if (commandMenu == true ) {
                    if(GM_getValue('tgdskin', 5)==5) GM_setValue('tgdskin',false);
                    if(GM_getValue('tgdskinstar', 5)==5) GM_setValue('tgdskinstar',false);
                    if(GM_getValue('tgdskinblue', 5)==5) GM_setValue('tgdskinblue',false);
                    if(GM_getValue('tgdskinstar_bak', 5)==5) GM_setValue('tgdskinstar_bak',false);


                    if(GM_getValue('tgdskin', true)==true){
                        GM_registerMenuCommand('트게더 스킨 끄기 [현재: ON]', function() {
                            GM_setValue('tgdskin', false);
                            if(GM_getValue('tgdskinstar_bak', 5)==true) GM_setValue('tgdskinstar',true);
                            else GM_setValue('tgdskinstar',false);
                            location.reload();
                        })
                    }
                    else{
                        GM_registerMenuCommand('트게더 스킨 켜기 [현재: OFF]', function() {
                            GM_setValue('tgdskin', true);
                            if(GM_getValue('tgdskinstar', 5)==true) GM_setValue('tgdskinstar_bak',true);
                            else GM_setValue('tgdskinstar_bak',false);
                            location.reload();
                        })
                    }
                    if(GM_getValue('tgdskin', true)==false){
                        if(GM_getValue('tgdskinstar', true)==true){
                            GM_registerMenuCommand('트게더 추천 버튼 끄기 [현재: ON]', function() {
                                GM_setValue('tgdskinstar', false);
                                location.reload();
                            })
                        }
                        else{
                            GM_registerMenuCommand('트게더 추천 버튼 켜기 [현재: OFF]', function() {
                                GM_setValue('tgdskinstar', true);
                                location.reload();
                            })
                        }
                    }
                    else{
                        GM_setValue('tgdskinstar', true);
                        if(GM_getValue('tgdskinblue', true)==true){
                            GM_registerMenuCommand('트게더 스킨 보라색으로 변경 [현재: 파란색]', function() {
                                GM_setValue('tgdskinblue', false);
                                location.reload();
                            })
                        }
                        else{
                            GM_registerMenuCommand('트게더 스킨 파란색으로 변경 [현재: 보라색]', function() {
                                GM_setValue('tgdskinblue', true);
                                location.reload();
                            })
                        }
                    }
                    if(GM_getValue('star', 5)==5) GM_setValue('star',true);
                    if(GM_getValue('star')==true && GM_getValue('tgdskin', true)== false){
                        GM_registerMenuCommand('인기 게시글 별표 표시 끄기 [현재: 켜짐]', function() {
                            GM_setValue('star',false);
                            location.reload();
                        })
                    }
                    if(GM_getValue('star')==false && GM_getValue('tgdskin', true)== false){
                        GM_registerMenuCommand('인기 게시글 별표 표시 켜기 [현재: 꺼짐]', function() {
                            GM_setValue('star',true);
                            location.reload();
                        })
                    }
                    if(GM_getValue('bestcom', 5)==5) GM_setValue('bestcom',true);
                    if(GM_getValue('bestcom')==true){
                        GM_registerMenuCommand('베스트 댓글 끄기 [현재: 켜짐]', function() {
                            GM_setValue('bestcom',false);
                            location.reload();
                        })
                    }
                    if(GM_getValue('bestcom')==false){
                        GM_registerMenuCommand('베스트 댓글 켜기 [현재: 꺼짐]', function() {
                            GM_setValue('bestcom',true);
                            location.reload();
                        })
                    }
                    if(GM_getValue('memlevel', 5)==5) GM_setValue('memlevel',true);
                    if(GM_getValue('memlevel')==true){
                        GM_registerMenuCommand('회원 등급 표시 끄기 [현재: 켜짐]', function() {
                            GM_setValue('memlevel',false);
                            location.reload();
                        })
                    }
                    if(GM_getValue('memlevel')==false){
                        GM_registerMenuCommand('회원 등급 표시 켜기 [현재: 꺼짐]', function() {
                            GM_setValue('memlevel',true);
                            location.reload();
                        })
                    }
                    if(GM_getValue('largetext15', 5)==5) GM_setValue('largetext15',false);
                    if(GM_getValue('largetext14.5', 5)==5) GM_setValue('largetext14.5',true);
                    if(GM_getValue('largetext14', 5)==5) GM_setValue('largetext14',false);
                    if(GM_getValue('fontsize', 5)==5) GM_setValue('fontsize',14.5);
                    if(GM_getValue('largetext15', true)==true){
                        GM_registerMenuCommand('글씨 확대 끄기 [현재: 15px]', function() {
                            GM_setValue('largetext15', false);
                            GM_setValue('largetext14.5', false);
                            GM_setValue('largetext14', false);
                            GM_setValue('fontsize', 0);
                            location.reload();
                        })
                    }
                    if(GM_getValue('largetext14', true)==true){
                        GM_registerMenuCommand('글씨 확대 끄기 [현재: 14px]', function() {
                            GM_setValue('largetext15', false);
                            GM_setValue('largetext14.5', false);
                            GM_setValue('largetext14', false);
                            GM_setValue('fontsize', 0);
                            location.reload();
                        })
                    }
                    if(GM_getValue('largetext14.5', true)==true){
                        GM_registerMenuCommand('글씨 확대 끄기 [현재: 14.5px]', function() {
                            GM_setValue('largetext15', false);
                            GM_setValue('largetext14.5', false);
                            GM_setValue('largetext14', false);
                            GM_setValue('fontsize', 0);
                            location.reload();
                        })
                    }
                    GM_registerMenuCommand('글씨 확대 14px로', function() {
                        GM_setValue('largetext15', false);
                        GM_setValue('largetext14.5', false);
                        GM_setValue('largetext14', true);
                        GM_setValue('fontsize',14);
                        location.reload();
                    })
                    GM_registerMenuCommand('글씨 확대 14.5px로', function() {
                        GM_setValue('largetext15', false);
                        GM_setValue('largetext14.5', true);
                        GM_setValue('largetext14', false);
                        GM_setValue('fontsize',14.5);
                        location.reload();
                    })
                    GM_registerMenuCommand('글씨 확대 15px로', function() {
                        GM_setValue('largetext15', true);
                        GM_setValue('largetext14.5', false);
                        GM_setValue('largetext14', false);
                        GM_setValue('fontsize',15);
                        location.reload();
                    })
                };
            }

        }
        catch(err) {
            console.log(err);
        }
    }

    async function getLikes(postNumber) {
        const response = await fetch(`https://cafe.like.naver.com/v1/search/contents?suppress_response_codes=true&q=CAFE%5B28445106_kanetv_${postNumber}%5D`);
        const data = await response.json();
        console.log(data)
        return data.contents[0].reactionMap["com.naver.react.core.nbasearc.common.ReactionType@27dc3ade"].count;
    }



    function checkEandProcess() {
            setTimeout(function () {
                var waitinki = 100;
                var bestcut = 10000;
                console.log(currentURL);
                console.log(window.location.href);
                if(!window.location.href.includes("popular")){return;}

                try{
                    let d = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("article-board")[0].getElementsByClassName("inner_list");
                    console.log("별추가 975");
                    console.log(d);
                    //if(newnum==0) waitinki = 1500;
                    //console.log(d);
                    let e = document.querySelector('#cafe_main').contentWindow.document
                    .getElementsByClassName("article-board")[0]
                    .getElementsByClassName("td_view");
                    console.log(e.length);

                    bestcut = 350;

                    if (e.length === 0) {
                        // e.length가 0이면 일정 시간 대기 후 다시 체크
                        console.log("e.length가 0입니다. 다시 확인합니다...");
                        setTimeout(checkEandProcess, 1000); // 3초 후 재확인
                    } else {
                        // e.length가 0이 아니면 처리 시작
                        setTimeout(function () {
                            let likenum = e.length;
                            let likesnumber = 0;
                            //console.log("add!!!!!!!!!");
                            let newnum = d.length;
                            console.log(newnum);

                            for (let idx = 0; idx < newnum; idx++) {
                                //console.log("add!!!!!!!!!");
                                try {
                                    //console.log("add!!!!!!!!!");
                                    var cmtnum = Number(d[idx].getElementsByClassName("cmt")[0].innerText.replace(/\[|\]/g,""));
                                    if (d[idx].id == "iconadded") continue;
                                    d[idx].id = "iconadded";
                                    if (likenum !== 0) {
                                        likesnumber = Number(e[idx].innerText) + cmtnum * 25;
                                        //console.log(likesnumber);
                                    }
                                    if (
                                        (GM_getValue("star") === true || GM_getValue("tgdskin") === true) &&
                                        likenum !== 0 &&
                                        likesnumber >= bestcut
                                    ) {
                                        console.log("add!!!!!!!!!");
                                        console.log("별추가1014");
                                        let z = document.createElement("img");
                                        z.src =
                                            "https://raw.githubusercontent.com/ywj515/tgdcafe/main/star.svg";
                                        z.width = "12";
                                        z.height = "12";
                                        z.style = "vertical-align: middle;padding-bottom: 2px;";
                                        d[idx].childNodes[0].prepend(z);
                                    } else {
                                        let svgicon =
                                            d[idx].childNodes[2].getElementsByTagName("svg")[0].className.baseVal;
                                        let ot = 0;
                                        let om = 0;

                                        if (svgicon === "svg-icon list_attach_img") {
                                            ot += 1;
                                        }
                                        if (svgicon === "svg-icon list_attach_video") {
                                            om += 1;
                                        }

                                        if (GM_getValue("tgdskin") === true && om > 0) {
                                            console.log("img tgdskin add");
                                            let z = document.createElement("img");
                                            z.src =
                                                "https://raw.githubusercontent.com/ywj515/tgdcafe/main/video.svg";
                                            z.width = "12";
                                            z.height = "12";
                                            z.style = "vertical-align: middle;padding-bottom: 2px;";
                                            d[idx].childNodes[0].prepend(z);
                                        } else if (GM_getValue("tgdskin") === true && ot > 0) {
                                            let z = document.createElement("img");
                                            z.src =
                                                "https://raw.githubusercontent.com/ywj515/tgdcafe/main/image_green.svg";
                                            z.width = "12";
                                            z.height = "12";
                                            z.style =
                                                "vertical-align: middle;padding-bottom: 2px; padding-right: 2px";
                                            d[idx].childNodes[0].prepend(z);
                                        } else if (GM_getValue("tgdskin") === true) {
                                            console.log("1028");
                                            let z = document.createElement("img");
                                            z.src =
                                                "https://raw.githubusercontent.com/ywj515/tgdcafe/main/text.svg";
                                            z.width = "12";
                                            z.height = "12";
                                            z.style =
                                                "vertical-align: middle;padding-bottom: 2px; padding-right: 2px";
                                            d[idx].childNodes[0].prepend(z);
                                        }
                                    }
                                } catch {
                                    if (GM_getValue("tgdskin") === true) {
                                        console.log("1041");
                                        let z = document.createElement("img");
                                        z.src =
                                            "https://raw.githubusercontent.com/ywj515/tgdcafe/main/text.svg";
                                        z.width = "12";
                                        z.height = "12";
                                        z.style =
                                            "vertical-align: middle;padding-bottom: 2px; padding-right: 2px";
                                        d[idx].childNodes[0].prepend(z);
                                    }
                                    continue;
                                }
                            }
                            try{
                                for(let iii=0; iii<12; iii++){
                                    console.log("글목록 버튼..");
                                    //console.log(document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("paginate_area")[0].getElementsByClassName("ArticlePaginate")[0].getElementsByClassName("btn"));
                                    document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("paginate_area")[0].getElementsByClassName("ArticlePaginate")[0].getElementsByClassName("btn")[iii].addEventListener("click", async function(){
                                        console.log("button!!");
                                        //console.log(GM_getValue("inkiiconadd", false));
                                        setTimeout(function(){
                                            checkEandProcess();
                                        },100)
                                    }) }
                            }catch{}
                        }, waitinki);
                    }
                }catch{
                    try{
                        let d = document.getElementsByClassName("article-board")[0].getElementsByClassName("inner_list");
                        //console.log("별추가 975");
                        //console.log(d);

                        waitinki = 100;
                        //if(newnum==0) waitinki = 1500;

                        //console.log(d);
                        bestcut = 10000;
                        let e = document.getElementsByClassName("article-board")[0].getElementsByClassName("td_normal type_readCount");
                        console.log(e.length);

                        bestcut = 350;

                        if (e.length === 0) {
                            // e.length가 0이면 일정 시간 대기 후 다시 체크
                            console.log("e.length가 0입니다. 다시 확인합니다...");
                            setTimeout(checkEandProcess, 1000); // 3초 후 재확인
                        } else {
                            // e.length가 0이 아니면 처리 시작
                            setTimeout(function () {
                                let likenum = e.length;
                                let likesnumber = 0;
                                //console.log("add!!!!!!!!!");
                                let newnum = d.length;
                                console.log(newnum);

                                for (let idx = 0; idx < newnum; idx++) {
                                    //console.log("add!!!!!!!!!");
                                    try {
                                        console.log("add!!!!!!!!!");
                                        var cmtnum = 0;
                                        try{
                                            cmtnum = Number(d[idx].getElementsByClassName("cmt")[0].innerText.replace(/\[|\]/g,""));
                                        }catch{ cmtnum = 0; }
                                        if (d[idx].id == "iconadded") continue;
                                        d[idx].id = "iconadded";
                                        if (likenum !== 0) {
                                            likesnumber = Number(e[idx].innerText) + cmtnum * 25;
                                            console.log(likesnumber);
                                        }
                                        if (
                                            (GM_getValue("star") === true || GM_getValue("tgdskin") === true) &&
                                            likenum !== 0 &&
                                            likesnumber >= bestcut
                                        ) {
                                            console.log("add!!!!!!!!!");
                                            console.log("별추가1014");
                                            let z = document.createElement("img");
                                            z.src =
                                                "https://raw.githubusercontent.com/ywj515/tgdcafe/main/star.svg";
                                            z.width = "12";
                                            z.height = "12";
                                            z.style = "vertical-align: middle;padding-bottom: 2px;";
                                            d[idx].childNodes[0].prepend(z);
                                        } else {
                                            console.log("add!!!!!!!!!");
                                            console.log("별추가1195");
                                            let svgicon =
                                                d[idx].childNodes[1].className.baseVal;
                                            let ot = 0;
                                            let om = 0;
                                            console.log("별추가1200");
                                            if (svgicon.startsWith("svg-icon list_attach_img")) {
                                                ot += 1;
                                            }
                                            if (svgicon.startsWith("svg-icon list_attach_video")) {
                                                om += 1;
                                            }

                                            if (GM_getValue("tgdskin") === true && om > 0) {
                                                console.log("img tgdskin add");
                                                let z = document.createElement("img");
                                                z.src =
                                                    "https://raw.githubusercontent.com/ywj515/tgdcafe/main/video.svg";
                                                z.width = "12";
                                                z.height = "12";
                                                z.style = "vertical-align: middle;padding-bottom: 2px;";
                                                d[idx].childNodes[0].prepend(z);
                                            } else if (GM_getValue("tgdskin") === true && ot > 0) {
                                                let z = document.createElement("img");
                                                z.src =
                                                    "https://raw.githubusercontent.com/ywj515/tgdcafe/main/image_green.svg";
                                                z.width = "12";
                                                z.height = "12";
                                                z.style =
                                                    "vertical-align: middle;padding-bottom: 2px; padding-right: 2px";
                                                d[idx].childNodes[0].prepend(z);
                                            } else if (GM_getValue("tgdskin") === true) {
                                                console.log("1159");
                                                let z = document.createElement("img");
                                                z.src =
                                                    "https://raw.githubusercontent.com/ywj515/tgdcafe/main/text.svg";
                                                z.width = "12";
                                                z.height = "12";
                                                z.style =
                                                    "vertical-align: middle;padding-bottom: 2px; padding-right: 2px";
                                                d[idx].childNodes[0].prepend(z);
                                            }
                                        }
                                    } catch {
                                        console.log("errorrrr 1233");
                                        if (GM_getValue("tgdskin") === true) {
                                            console.log("1173");
                                            let z = document.createElement("img");
                                            z.src =
                                                "https://raw.githubusercontent.com/ywj515/tgdcafe/main/text.svg";
                                            z.width = "12";
                                            z.height = "12";
                                            z.style =
                                                "vertical-align: middle;padding-bottom: 2px; padding-right: 2px";
                                            d[idx].childNodes[0].prepend(z);
                                        }
                                        continue;
                                    }
                                }
                                try{
                                    for(let iii=0; iii<12; iii++){
                                        console.log("글목록 버튼..");
                                        document.getElementsByClassName("Pagination")[0].getElementsByClassName("btn number")[iii].addEventListener("click", async function(){
                                            console.log("button!!");
                                            //console.log(GM_getValue("inkiiconadd", false));
                                            setTimeout(function(){
                                                checkEandProcess();
                                            },100)
                                        }) }
                                }catch{}
                            }, waitinki);
                        }
                    }catch{
                        console.log("에러 발생, 1초 뒤 다시 확인");
                        setTimeout(checkEandProcess, 1000);
                    }
                    }
            }, 100);
    }

    function checkInkiOnBoard() {
            setTimeout(function () {
                var waitinki = 100;
                var bestcut = 10000;
                // console.log(currentURL);
                // console.log(window.location.href);

                //if(window.location.href.includes("popular")){return;}
                let dd = document.getElementsByClassName("BoardTopOption")[0];
                if (!dd) {
                    //console.error("BoardTopOption 요소를 찾을 수 없습니다. 게시글 목록이 나타날 때까지 1초 뒤 다시 확인");
                    setTimeout(() => checkInkiOnBoard(), 1000);
                    return;
                }
                if (dd.getElementsByClassName("total").length > 0) {
                    console.log("전체글보기에서 작동하지 않습니다.");
                    return;
                }

                try{
                    let d = document.getElementsByClassName("article-board")[0].getElementsByTagName("tr");
                    console.log("별추가 975");
                    console.log(d);
                    //if(newnum==0) waitinki = 1500;
                    //console.log(d);
                    let e = document.getElementsByClassName("article-board")[0].getElementsByClassName("td_normal");
                    console.log(e.length);

                    bestcut = GM_getValue('popularCriteria', 3);

                    if (e.length === 0) {
                        // e.length가 0이면 일정 시간 대기 후 다시 체크
                        console.log("e.length가 0입니다. 다시 확인합니다...");
                        setTimeout(checkInkiOnBoard, 1000); // 3초 후 재확인
                    } else {
                        // e.length가 0이 아니면 처리 시작
                        setTimeout(function () {
                            let likenum = e.length;
                            let likesnumber = 0;
                            //console.log("add!!!!!!!!!");
                            let newnum = d.length;
                            console.log(newnum);

                            for (let idx = 1; idx < newnum; idx++) {
                                //console.log("add!!!!!!!!!");
                                try {
                                    //console.log("add!!!!!!!!!");
                                    //console.log("a");
                                    var cmtnum = Number(d[idx].getElementsByClassName("td_normal type_likeCount")[0].innerText.replace(/\[|\]/g,""));
                                    //console.log("a");
                                    if (d[idx].id == "iconadded") continue;
                                    //console.log("a");
                                    d[idx].id = "iconadded";
                                    //console.log("a");
                                    if (likenum !== 0) {
                                        likesnumber = cmtnum;
                                        //console.log(likesnumber);
                                    }
                                    //console.log("a");
                                    if (
                                        (GM_getValue("star") === true || GM_getValue("tgdskin") === true) &&
                                        likenum !== 0 &&
                                        likesnumber >= bestcut
                                    ) {
                                        console.log("add!!!!!!!!!");
                                        console.log("별추가1014");
                                        let z = document.createElement("img");
                                        z.src =
                                            "https://raw.githubusercontent.com/ywj515/tgdcafe/main/star.svg";
                                        z.width = "12";
                                        z.height = "12";
                                        z.style = "vertical-align: middle;padding-bottom: 2px;";
                                        d[idx].getElementsByClassName("article")[0].prepend(z);
                                    } else {
                                        let svgicon =
                                            d[idx].getElementsByTagName("svg")[0].className.baseVal;
                                        let ot = 0;
                                        let om = 0;

                                        if (svgicon === "svg-icon list_attach_img AttachInfoBadge_wrap__cZIf2") {
                                            ot += 1;
                                        }
                                        if (svgicon === "svg-icon list_attach_video AttachInfoBadge_wrap__cZIf2") {
                                            om += 1;
                                        }

                                        if (GM_getValue("tgdskin") === true && om > 0) {
                                            console.log("img tgdskin add");
                                            let z = document.createElement("img");
                                            z.src =
                                                "https://raw.githubusercontent.com/ywj515/tgdcafe/main/video.svg";
                                            z.width = "12";
                                            z.height = "12";
                                            z.style = "vertical-align: middle;padding-bottom: 2px;";
                                            d[idx].getElementsByClassName("article")[0].prepend(z);
                                        } else if (GM_getValue("tgdskin") === true && ot > 0) {
                                            let z = document.createElement("img");
                                            z.src =
                                                "https://raw.githubusercontent.com/ywj515/tgdcafe/main/image_green.svg";
                                            z.width = "12";
                                            z.height = "12";
                                            z.style =
                                                "vertical-align: middle;padding-bottom: 2px; padding-right: 2px";
                                            d[idx].getElementsByClassName("article")[0].prepend(z);
                                        } else if (GM_getValue("tgdskin") === true) {
                                            console.log("1302");
                                            let z = document.createElement("img");
                                            z.src =
                                                "https://raw.githubusercontent.com/ywj515/tgdcafe/main/text.svg";
                                            z.width = "12";
                                            z.height = "12";
                                            z.style =
                                                "vertical-align: middle;padding-bottom: 2px; padding-right: 2px";
                                            d[idx].getElementsByClassName("article")[0].prepend(z);
                                        }
                                    }
                                } catch {
                                    if (GM_getValue("tgdskin") === true) {
                                        console.log("1315");
                                        let z = document.createElement("img");
                                        z.src =
                                            "https://raw.githubusercontent.com/ywj515/tgdcafe/main/text.svg";
                                        z.width = "12";
                                        z.height = "12";
                                        z.style =
                                            "vertical-align: middle;padding-bottom: 2px; padding-right: 2px";
                                        d[idx].getElementsByClassName("article")[0].prepend(z);
                                    }
                                    continue;
                                }
                            }
                            try{
                                for(let iii=0; iii<12; iii++){
                                    console.log("글목록 버튼..");
                                    //console.log(document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("paginate_area")[0].getElementsByClassName("ArticlePaginate")[0].getElementsByClassName("btn"));
                                    document.getElementsByClassName("Pagination")[0].getElementsByClassName("btn")[iii].addEventListener("click", async function(){
                                        console.log("button Board!!");
                                        //console.log(GM_getValue("inkiiconadd", false));
                                        setTimeout(function(){
                                            checkInkiOnBoard();
                                        },1000)
                                    }) }
                            }catch{}
                            try{
                                console.log("글 목록 개수 버튼");
                                document.getElementsByClassName("FormSelectButton")[0].addEventListener("click", async function(){
                                    console.log("button FormSelectButton!!");
                                    //console.log(GM_getValue("inkiiconadd", false));
                                    setTimeout(function(){
                                        try{
                                            let aa = document.getElementsByClassName("option_list");
                                            Array.from(aa).forEach((list) => {
                                            let bbuttons = list.getElementsByTagName("button");
                                            Array.from(bbuttons).forEach((button) => {
                                                button.addEventListener("click", (event) => {
                                                console.log("Button clicked:", button.textContent);
                                                    setTimeout(function(){
                                                        checkInkiOnBoard();
                                                    },1000)
                                                });
                                            });
                                            });
                                        }catch{}
                                    },300)
                                })
                            }catch{}
                            showPopularPosts();
                        }, waitinki);
                    }
                }catch{
                    try{
                        let d = document.getElementsByClassName("article-board")[0].getElementsByClassName("inner_list");
                        //console.log("별추가 975");
                        //console.log(d);

                        waitinki = 100;
                        //if(newnum==0) waitinki = 1500;

                        //console.log(d);
                        let e = document.getElementsByClassName("article-board")[0].getElementsByClassName("td_normal type_readCount");
                        console.log(e.length);

                        bestcut = 10;
                        try{
                            let a = document.getElementsByClassName("BoardTopOption")[0];
                            bestcut = Number(a.getElementsByTagName("input")[0].value);
                        }catch{
                            bestcut = 10;
                        }
                        if (e.length === 0) {
                            // e.length가 0이면 일정 시간 대기 후 다시 체크
                            console.log("e.length가 0입니다. 다시 확인합니다...");
                            setTimeout(checkInkiOnBoard, 1000); // 3초 후 재확인
                        } else {
                            // e.length가 0이 아니면 처리 시작
                            setTimeout(function () {
                                let likenum = e.length;
                                let likesnumber = 0;
                                //console.log("add!!!!!!!!!");
                                let newnum = d.length;
                                console.log(newnum);

                                for (let idx = 0; idx < newnum; idx++) {
                                    //console.log("add!!!!!!!!!");
                                    try {
                                        console.log("add!!!!!!!!!");
                                        var cmtnum = 0;
                                        try{
                                            cmtnum = Number(d[idx].getElementsByClassName("td_normal type_likeCount")[0].innerText.replace(/\[|\]/g,""));
                                        }catch{ cmtnum = 0; }
                                        if (d[idx].id == "iconadded") continue;
                                        d[idx].id = "iconadded";
                                        if (likenum !== 0) {
                                            likesnumber = cmtnum;
                                            //console.log(likesnumber);
                                        }
                                        if (
                                            (GM_getValue("star") === true || GM_getValue("tgdskin") === true) &&
                                            likenum !== 0 &&
                                            likesnumber >= bestcut
                                        ) {
                                            console.log("add!!!!!!!!!");
                                            console.log("별추가1014");
                                            let z = document.createElement("img");
                                            z.src =
                                                "https://raw.githubusercontent.com/ywj515/tgdcafe/main/star.svg";
                                            z.width = "12";
                                            z.height = "12";
                                            z.style = "vertical-align: middle;padding-bottom: 2px;";
                                            d[idx].getElementsByClassName("article")[0].prepend(z);
                                        } else {
                                            console.log("add!!!!!!!!!");
                                            console.log("별추가1195");
                                            let svgicon =
                                                d[idx].getElementsByClassName("article")[0].className.baseVal;
                                            let ot = 0;
                                            let om = 0;
                                            console.log("별추가1200");
                                            if (svgicon.startsWith("svg-icon list_attach_img")) {
                                                ot += 1;
                                            }
                                            if (svgicon.startsWith("svg-icon list_attach_video")) {
                                                om += 1;
                                            }

                                            if (GM_getValue("tgdskin") === true && om > 0) {
                                                console.log("img tgdskin add");
                                                let z = document.createElement("img");
                                                z.src =
                                                    "https://raw.githubusercontent.com/ywj515/tgdcafe/main/video.svg";
                                                z.width = "12";
                                                z.height = "12";
                                                z.style = "vertical-align: middle;padding-bottom: 2px;";
                                                d[idx].getElementsByClassName("article")[0].prepend(z);
                                            } else if (GM_getValue("tgdskin") === true && ot > 0) {
                                                let z = document.createElement("img");
                                                z.src =
                                                    "https://raw.githubusercontent.com/ywj515/tgdcafe/main/image_green.svg";
                                                z.width = "12";
                                                z.height = "12";
                                                z.style =
                                                    "vertical-align: middle;padding-bottom: 2px; padding-right: 2px";
                                                d[idx].getElementsByClassName("article")[0].prepend(z);
                                            } else if (GM_getValue("tgdskin") === true) {
                                                console.log("1438");
                                                let z = document.createElement("img");
                                                z.src =
                                                    "https://raw.githubusercontent.com/ywj515/tgdcafe/main/text.svg";
                                                z.width = "12";
                                                z.height = "12";
                                                z.style =
                                                    "vertical-align: middle;padding-bottom: 2px; padding-right: 2px";
                                                d[idx].getElementsByClassName("article")[0].prepend(z);
                                            }
                                        }
                                    } catch {
                                        console.log("errorrrr 1233");
                                        if (GM_getValue("tgdskin") === true) {
                                            console.log("1452");
                                            let z = document.createElement("img");
                                            z.src =
                                                "https://raw.githubusercontent.com/ywj515/tgdcafe/main/text.svg";
                                            z.width = "12";
                                            z.height = "12";
                                            z.style =
                                                "vertical-align: middle;padding-bottom: 2px; padding-right: 2px";
                                            d[idx].getElementsByClassName("article")[0].prepend(z);
                                        }
                                        continue;
                                    }
                                }
                                try{
                                    for(let iii=0; iii<12; iii++){
                                        console.log("글목록 버튼..");
                                        document.getElementsByClassName("Pagination")[0].getElementsByClassName("btn")[iii].addEventListener("click", async function(){
                                            console.log("button Board!!");
                                            //console.log(GM_getValue("inkiiconadd", false));
                                            setTimeout(function(){
                                                checkInkiOnBoard();
                                            },1000)
                                        }) }
                                }catch{}
                                try{
                                    console.log("글 목록 개수 버튼");
                                    document.getElementsByClassName("FormSelectButton")[0].addEventListener("click", async function(){
                                        console.log("button FormSelectButton!!");
                                        //console.log(GM_getValue("inkiiconadd", false));
                                        setTimeout(function(){
                                            try{
                                                let aa = document.getElementsByClassName("option_list");
                                                Array.from(aa).forEach((list) => {
                                                    let bbuttons = list.getElementsByTagName("button");
                                                    Array.from(bbuttons).forEach((button) => {
                                                        button.addEventListener("click", (event) => {
                                                            console.log("Button clicked:", button.textContent);
                                                            setTimeout(function(){
                                                                checkInkiOnBoard();
                                                            },1000)
                                                        });
                                                    });
                                                });
                                            }catch{}
                                        },300)
                                    })
                                }catch{}
                                showPopularPosts();
                            }, waitinki);
                        }
                    }catch{
                        console.log("에러 발생, 1초 뒤 다시 확인");
                        setTimeout(checkInkiOnBoard, 1000);
                    }
                    }
            }, 100);
    }

    async function inkilist(){
        try{
            setTimeout(function(){
                checkEandProcess();
            },100)
        }catch{}
    }


    async function inkilistboard(){
        try{
            setTimeout(function(){
                addInkiListButton();
                checkInkiOnBoard();
            },100)
        }catch{}
    }


    function addInkiListButton() {
        console.log("인기글 버튼 생성 시도!");
        let d = document.getElementsByClassName("BoardTopOption")[0];

        if (!d) {
            console.error("BoardTopOption 요소를 찾을 수 없습니다.");
            return;
        }

        // 기존에 '인기글' 또는 '전체글' 버튼이 있는지 확인
        const existingButton = Array.from(d.getElementsByTagName('button')).find(
            button => button.textContent === '인기글' || button.textContent === '전체글'
        );

        if (existingButton) {
            console.log(`이미 '${existingButton.textContent}' 버튼이 존재합니다. 추가하지 않습니다.`);
            return;
        }

        if (d.getElementsByClassName("total").length > 0) {
            console.log("전체글보기에서는 '인기글' 지원하지 않습니다. 추가하지 않습니다.");
            return;
        }

        // 컨테이너 div 생성
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.gap = '10px';

        // '인기글' 버튼 생성
        const inkiButton = document.createElement('button');
        
        // 저장된 버튼 상태 불러오기 (기본값: 전체글 상태)
        const savedState = GM_getValue('buttonState', {
            className: 'disable',
            textContent: '전체글',
            backgroundColor: '#007bff',
            color: 'black'
        });

        // 버튼 상태 적용
        inkiButton.className = savedState.className;
        inkiButton.textContent = savedState.textContent;
        inkiButton.style.padding = '8px 12px';
        inkiButton.style.marginRight = '10px';
        inkiButton.style.backgroundColor = savedState.backgroundColor;
        inkiButton.style.color = savedState.color;
        inkiButton.style.border = '2px solid black';
        inkiButton.style.borderRadius = '4px';
        inkiButton.style.cursor = 'pointer';
        inkiButton.style.fontSize = '16px';

        // 버튼 클릭 시 실행될 함수 연결
        inkiButton.addEventListener('click', togglePopularPosts);

        // '인기글 기준' 텍스트 생성
        const criteriaLabel = document.createElement('span');
        criteriaLabel.textContent = '인기글 기준';
        criteriaLabel.style.fontSize = '16px';
        criteriaLabel.style.color = '#333';

        // 숫자 입력칸 생성
        const criteriaInput = document.createElement('input');
        criteriaInput.type = 'number';
        criteriaInput.min = '1';
        criteriaInput.value = GM_getValue('popularCriteria', '3');
        criteriaInput.style.width = '60px';
        criteriaInput.style.padding = '6px';
        criteriaInput.style.border = '1px solid #ccc';
        criteriaInput.style.borderRadius = '4px';
        criteriaInput.style.fontSize = '16px';

        // 입력값 변경 시 저장
        criteriaInput.addEventListener('change', () => {
            const value = criteriaInput.value;
            if (value && !isNaN(value)) {
                GM_setValue('popularCriteria', value);
                console.log(`인기글 기준 값 ${value} 저장됨`);
            }
        });

        // 컨테이너에 버튼, 텍스트, 입력칸 추가
        container.append(inkiButton, criteriaLabel, criteriaInput);

        // 컨테이너를 d에 prepend
        d.prepend(container);
        console.log("인기글 버튼과 입력칸이 추가되었습니다!");
    }

    function togglePopularPosts() {
        console.log('인기글 버튼이 클릭되었습니다!');
        let a = document.getElementsByClassName("BoardTopOption")[0].getElementsByTagName("button")[0];
        
        // 버튼 상태 토글 및 저장
        if (a.className === "enable") {
            a.className = "disable";
            a.textContent = "전체글";
            a.style.backgroundColor = '#007bff';
            a.style.color = 'white';
            GM_setValue('buttonState', {
                className: 'disable',
                textContent: '전체글',
                backgroundColor: '#007bff',
                color: 'white'
            });
        } else {
            a.className = "enable";
            a.textContent = "인기글";
            a.style.backgroundColor = '#FFFF00';
            a.style.color = 'black';
            GM_setValue('buttonState', {
                className: 'enable',
                textContent: '인기글',
                backgroundColor: '#FFFF00',
                color: 'black'
            });
        }
        showPopularPosts();
    }

    function showPopularPosts() {
        addInkiListButton();
        setTimeout(function () {
            try{
                let showPopular = GM_getValue('buttonState', { className: 'disable' }).className === 'enable' ? 1 : 0;
                console.log(showPopular ? "인기글 아닌 글 제거합니다" : "인기글 아닌 글 표시합니다");
                let d = document.getElementsByClassName("article-board")[0].getElementsByTagName("tr");
                let e = document.getElementsByClassName("article-board")[0].getElementsByClassName("td_normal");
                console.log(e.length);
                if (e.length === 0) {
                    // e.length가 0이면 일정 시간 대기 후 다시 체크
                    console.log("e.length가 0입니다. 다시 확인합니다...");
                    setTimeout(showPopularPosts, 1000); // 3초 후 재확인
                } else {
                    // e.length가 0이 아니면 처리 시작
                    newnum = d.length;
                    setTimeout(function () {
                        for (let idx = 1; idx < newnum; idx++) {
                            //console.log("add!!!!!!!!!");
                            try {
                                //console.log("add!!!!!!!!!");
                                //console.log("a");
                                var checkStar = 0;

                                // var imgTags = d[idx].getElementsByClassName("article")[0].getElementsByTagName("img");
                                // // img 태그 존재 여부 확인 및 출력
                                // console.log(imgTags[0]);
                                // if (imgTags.length > 0) {
                                //     console.log("img 태그가 존재합니다. (개수: " + imgTags.length + ")");
                                //     var imgTagName = imgTags[0].src;
                                //     if(imgTagName=="https://raw.githubusercontent.com/ywj515/tgdcafe/main/star.svg"){
                                //         console.log("img가 별표입니다. 인기글입니다.")
                                //         checkStar = 1;
                                //     }
                                //     else{
                                //         console.log("img가 별표가 아닙니다. 인기글이 아닙니다.")
                                //     }
                                // } else {
                                //     console.log("img 태그가 존재하지 않습니다.");
                                // }

                                var likenum = Number(d[idx].getElementsByClassName("td_normal type_likeCount")[0].innerText.replace(/\[|\]/g,""));
                                //console.log(likenum)
                                bestcut = GM_getValue('popularCriteria', 3);
                                console.log(likenum);
                                if(likenum >= bestcut){checkStar = 1;}
                                if(checkStar == 0){
                                    if(showPopular == 1){
                                        //console.log("인기글 아닌 글 제거합니다");
                                        d[idx].style.display = "none";
                                    }
                                    else{
                                        //console.log("인기글 아닌 글 표시합니다");
                                        d[idx].style.display = "table-row";
                                    }
                                }
                            } catch {
                                continue;
                            }
                        }
                    }, 1);
                }
            }catch{
                try{
                    let aa = document.getElementsByClassName("BoardTopOption")[0];
                    if (aa) {
                        if (aa.getElementsByClassName("total").length > 0) {
                            console.log("전체글보기에서는 '인기글' 지원하지 않습니다.");
                            return;
                        }
                    }
                    let showPopular = GM_getValue('buttonState', { className: 'disable' }).className === 'enable' ? 1 : 0;
                    console.log(showPopular ? "인기글 아닌 글 제거합니다" : "인기글 아닌 글 표시합니다");
                    let d = document.getElementsByClassName("article-board")[0].getElementsByTagName("tr");
                    let e = document.getElementsByClassName("article-board")[0].getElementsByClassName("td_normal");
                    console.log(e.length);
                    if (e.length === 0) {
                        // e.length가 0이면 일정 시간 대기 후 다시 체크
                        console.log("e.length가 0입니다. 다시 확인합니다...");
                        setTimeout(showPopularPosts, 1000); // 3초 후 재확인
                    } else {
                        // e.length가 0이 아니면 처리 시작
                        newnum = d.length;
                        setTimeout(function () {
                            for (let idx = 1; idx < newnum; idx++) {
                                //console.log("add!!!!!!!!!");
                                try {
                                    //console.log("add!!!!!!!!!");
                                    //console.log("a");
                                    var checkStar = 0;

                                    // var imgTags = d[idx].getElementsByClassName("article")[0].getElementsByTagName("img");
                                    // // img 태그 존재 여부 확인 및 출력
                                    // console.log(imgTags[0]);
                                    // if (imgTags.length > 0) {
                                    //     console.log("img 태그가 존재합니다. (개수: " + imgTags.length + ")");
                                    //     var imgTagName = imgTags[0].src;
                                    //     if(imgTagName=="https://raw.githubusercontent.com/ywj515/tgdcafe/main/star.svg"){
                                    //         console.log("img가 별표입니다. 인기글입니다.")
                                    //         checkStar = 1;
                                    //     }
                                    //     else{
                                    //         console.log("img가 별표가 아닙니다. 인기글이 아닙니다.")
                                    //     }
                                    // } else {
                                    //     console.log("img 태그가 존재하지 않습니다.");
                                    // }

                                    var likenum = Number(d[idx].getElementsByClassName("td_normal type_likeCount")[0].innerText.replace(/\[|\]/g,""));
                                    console.log(likenum)
                                    bestcut = GM_getValue('popularCriteria', 3);
                                    console.log(likenum);
                                    if(likenum >= bestcut){checkStar = 1;}
                                    if(checkStar == 0){
                                        if(showPopular == 1){
                                            console.log("인기글 아닌 글 제거합니다");
                                            d[idx].style.display = "none";
                                        }
                                        else{
                                            console.log("인기글 아닌 글 표시합니다");
                                            d[idx].style.display = "table-row";
                                        }
                                    }
                                } catch {
                                    continue;
                                }
                            }
                        }, 100);
                    }
                }catch{
                    console.log("에러 발생, 1초 뒤 다시 확인");
                    setTimeout(showPopularPosts, 1000);
                }
                }
        }, 1);
    }


    const observerS = new MutationObserver((mutationsList, observerS) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                console.log('#cafe_content 로딩 감지!', mutation);
                console.log("started!!!!!!!!!!!!!")
                handleImageEnlarger(mutation);
                observerS.disconnect();
                enableCommandMenu();
                addstyle('.skin-1080 .article-board tbody td {border-bottom: 1px solid #e2e2e2;}');
                addstyle('.article-board tbody td {border-bottom: 1px solid #e2e2e2;}');
                addstyle('.CommentBox .comment_list .CommentItem {    border-top: 1px solid #ccc}');
                addstyle('.RelatedArticles .list_item {border-bottom: 1px solid #e2e2e2;}');
                addstyle('.CommentBox .comment_list .CommentItem.CommentItem--mine:before {background: #ffffff00}');
                addstyle('.CommentBox .comment_list .comment_footer { flex-direction: row;    align-items: stretch; font-weight: 500; color:#000;}');
                addstyle('.CommentBox .comment_list .comment_footer .comment_info_box {font-weight: 500; color:#000;}');
                addstyle('.CommentBox .comment_list .comment_footer .u_likeit_list_module .u_likeit_list_btn .u_cnt {color:#000}');
                addstyle('.skin-1080 .article-board .board-list div.inner_list a:visited, .skin-1080 .article-board .board-list div.inner_list div.inner_list a:visited * div.inner_list a:visited, div.inner_list a:visited * {color: #aaa !important;}')
                GM_addStyle('body {font-weight: 500;}');
                addstyle('body {font-weight: 500;}');

                if(GM_getValue('fontsize', 14.5)!=0){
                    addstyle('.skin-1080 .article-board .board-name .inner_name .link_name {font-size: ' + (GM_getValue('fontsize', 14.5)-1) + 'px}');
                    addstyle('.skin-1080 .article-board .article {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
                    addstyle('.article-board .article {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
                    addstyle('.ArticleBoardWriterInfo .nickname {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
                    addstylecon('.Sidebar_aside_menu_list__Ip6Gf li a {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
                    addstyle('.article_profile .td_date,.article_profile .td_view {border-left: 1px solid rgb(226, 226, 226); font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
                    addstyle('.article_profile .article {font-weight: 500; font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
                    addstyle('.article_profile .board-list .cmt {font-weight: bold; font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
                    addstyle('.skin-1080 .article-board .pers_nick_area .p-nick {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
                    addstyle('.skin-1080 .article-board .pers_nick_area .p-nick a {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
                    addstyle('.article-board .pers_nick_area .p-nick {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
                    addstyle('.article-board .pers_nick_area .p-nick a {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
                    addstyle('.RelatedArticles .tit_area {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
                    addstyle('.skin-1080 .article-board .board-box .td_article .article .inner {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
                    addstyle('.skin-1080 .article-album-sub dt a, .skin-1080 .article-album-sub .reply {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
                    addstyle('.skin-1080 .article-board .board-list .cmt {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
                    addstyle('.article-board .board-list .cmt {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
                    //addstyle('.skin-1080 .article-board tbody td {padding: 5px 7px}');
                    addstyle('.skin-1080 .article-memo .memo_lst_section .memo-box {font-size:' + (GM_getValue('fontsize', 14.5)+2) + 'px}');
                    addstyle('#content-area .cmlist .comm {font-size:' + (GM_getValue('fontsize', 14.5)+2) + 'px}');

                }
                if(GM_getValue('memlevel') == false){
                    //addstyle('.skin-1080 .article-board .pers_nick_area .mem-level img  {display: none}');
                    addstyle('.ArticleBoardWriterInfo [class*=LevelIcon] {display:none;}');
                    addstyle('.WriterInfo .profile_info .nick_level {display:none;}');
                    addstyle('.ArticleBoardWriterInfo .LevelIcon {display: none}');
                    addstyle('.CommentBox .comment_list .comment_nick_box .LevelIcon {display:none;}');
                }
                if(GM_getValue('tgdskinstar', true)){
                    console.log("추천버튼");
                    addstyle('.ReplyBox .like_article {font-size: 14px;    display: inline-block;    padding: 6px 12px;    margin-bottom: 0px;    font-size: 14px;    font-weight: 400;    line-height: 1.42857;    text-align: center;    white-space: nowrap;    vertical-align: middle;    touch-action: manipulation;    cursor: pointer;    user-select: none;    background-image: none;    border: 1px solid rgba(0, 0, 0, 0);    border-radius: 4px;    color: rgb(92, 184, 92);    background-image: none;    background-color: rgba(0, 0, 0, 0);    border-color: rgb(92, 184, 92);}');
                    addstyle('.ReplyBox .like_article .u_likeit_list_module {    margin-right: 0px}');
                    addstyle('.ReplyBox .like_article .u_likeit_list_module .u_likeit_list_btn .u_ico {    width: 20px;    height: 20px;  background: url(https://raw.githubusercontent.com/ywj515/tgdcafe/main/like.svg); no-repeat;}');
                    addstyle('.ReplyBox .like_article .u_likeit_list_module .u_likeit_list_btn.on .u_ico {    background: url(https://raw.githubusercontent.com/ywj515/tgdcafe/main/like.svg); no-repeat}');
                    addstyle('.ReplyBox .box_left .like_article .ReactionLikeIt.u_likeit_list_module._cafeReactionModule .like_no.u_likeit_list_btn._button.on .u_ico._icon {width: 20px; height: 20px;margin-right: 6px;background: url(https://raw.githubusercontent.com/ywj515/tgdcafe/main/like.svg);  no-repeat}');
                    addstyle('.ReplyBox .box_left .like_article .ReactionLikeIt.u_likeit_list_module._cafeReactionModule .like_no.u_likeit_list_btn._button.off .u_ico._icon {width: 20px; height: 20px;margin-right: 6px;background: url(https://raw.githubusercontent.com/ywj515/tgdcafe/main/like_not.svg);  no-repeat};');
                    addstyle('.ReplyBox .like_article .button_like_list {display:none}');
                    addstyle('.ReplyBox {display: flex; justify-content:center; margin-top:20px}');
                    addstyle('.ReplyBox .button_comment {display:none}');
                }
                if(GM_getValue('tgdskin', true)){
                    addstyle('.svg-icon.aside-new {display: none}');
                    addstyle('.BadgeNotificationNew_wrap__anNWw {display: none}');
                    if(GM_getValue('tgdskinblue', false) == false){
                        addstyle('.Sidebar_aside_btn__uh7ie .Sidebar_btn__8YLxw { background: #6441a5; }');
                        addstyle('.search_box .btn {    background: #6441a5;    color: #fff;}');
                        addstyle('.SearchBoxLayout .search_input_area .btn_search {background: #6441a5;    color: #fff;}');
                        addstyle('.BaseButton .svg-icon.icon-solid-writing, .BaseButtonLink .svg-icon.icon-solid-writing {color: #fff;)');
                        addstyle('.BoardTopOption .sort_area .sort_view .btn[aria-selected=true] .svg-icon { color: #6441a5; }');
                        addstyle('.ToggleSwitchLayout_wrap__svcF8 .ToggleSwitch.ToggleSwitch--skinGray .switch_input:checked+.switch_slider { background: #6441a5; }');
                        addstyle('.BaseButton--green {    background: #6441a5;    color: #fff;}');
                        addstyle('.CommentWriter .register_box .button.btn_register.is_active {  background: #6441a5; color: #fff}');
                        addstyle('.skin-1080 .article-board .pers_nick_area .mem-level img  {vertical-align: middle;}');
                        addstyle('.article-board .pers_nick_area .mem-level img  {vertical-align: middle}');
                        addstyle('.input_search_area .btn-search-green {background-color: #6441a5;}');
                        addstyle('.input_search_area .btn-search-green {background-color: #6441a5;}');
                        addstylecon('.skin-1080 .cafe-write-btn a {background-color: #6441a5;}');
                        addstylebody('.cafe-search .btn {background-color: #6441a5;}');
                        addstyle('.skin-1080 .article-board .th_name {text-align: center;}');
                        addstyle('.CafeViewer .se-viewer .BaseButton--green {    background: #6441a5;    color: #fff;}');
                        addstyle('.skin-1080 .article-board .td_article {padding-left: 0px;	padding-right: 2px;}');
                        addstyle(".skin-1080 .article-board .td_view {border-left: 1px solid rgb(226, 226, 226);}");
                        addstyle('.skin-1080 .article-board .board-tag {padding-left: 8px; padding-right: 15px;}');
                        addstyle('.skin-1080 .article-board .board-name {padding: 0 10px 0 0;}');
                        addstyle('.skin-1080 .article-board .board-name .inner_name {border-right: 1px solid rgb(226, 226, 226); text-align: center;}');
                        addstyle('.skin-1080 .article-board .board-notice .board-tag-txt {width: 48px;}');
                        addstyle('.skin-1080 .article-board .board-name .inner_name .link_name {text-align: center;}');
                        addstyle('.skin-1080 .article-board .board-number .inner_number {border-right: 1px solid rgb(226, 226, 226); text-align: center;}');
                        addstyle('.skin-1080 .article-board .td_likes {border-left: 1px solid rgb(226, 226, 226);}');
                        addstyle('.skin-1080 .article-board .board-list .cmt {color: #6441a5 !important;}');
                        addstyle('.skin-1080 .article-board .board-list .answer {color: #6441a5;}');
                        addstyle('.skin-1080 .article-board .board-list .ico-q {color: #6441a5;}');
                        addstyle('.skin-1080 .article-board .board-list .p_cafebook {color: #6441a5;}');
                        addstyle('.skin-1080 .article-board .board-list .reply_del {color: #6441a5;}');
                        addstyle('.skin-1080 .article-board .board-list .reply_txt {color: #6441a5;}');
                        addstyle('.skin-1080 .article-board .board-list .reply_txt:after {border-color: #6441a5 transparent transparent transparent;}');
                        addstyle('.skin-1080 .article-board .board-list .reply_txt.is_selected:after {border-color: transparent transparent #6441a5 transparent;}');
                        addstyle('.skin-1080 .article-board .pers_nick_area .p-nick {white-space: nowrap;	overflow: hidden;	text-overflow: ellipsis;	border-left: 1px solid rgb(226, 226, 226);	border-right: 1px solid rgb(226, 226, 226);	text-align: center;}');
                        addstyle('.skin-1080 .article-board .pers_nick_area .p-nick a {text-align: center;}');
                        addstyle('.skin-1080 .article_list_message .message {color: #616161;}');
                        addstyle('.skin-1080 .article-album-sub .reply {color: #6441a5;}');
                        addstyle('.skin-1080 .article-album-sub .price {color: #6441a5;}');
                        addstyle('.skin-1080 .article-album-movie-sub .tit_area .reply {color: #6441a5;}');
                        addstyle('.skin-1080 .article-movie-sub .tit_area .reply {color: #6441a5;}');
                        addstyle('.skin-1080 .article-tag .list_tag .tit_area .cmt {color: #6441a5;}');
                        addstyle('.skin-1080 .article-intro .box_history .fileview .txt_file {color: #6441a5;}');
                        addstyle('.skin-1080 .board-notice.type_required .article, .skin-1080 .board-notice.type_main .article {color: #6441a5;}');
                        addstyle('.skin-1080 .board-notice.type_required .cmt, .skin-1080 .board-notice.type_main .cmt {	color: #6441a5;}');
                        addstyle('.skin-1080 .board-notice.type_required .board-tag-txt, .skin-1080 .board-notice.type_main .board-tag-txt {	border: 1px solid #6441a5;	background-color: #6441a5;	color: #fff;}');
                        addstyle('.skin-1080 .board-notice.type_menu .article {	color: #6441a5;}');
                        addstyle('.skin-1080 .board-notice.type_menu .cmt {	color: #6441a5;}');
                        addstyle('.skin-1080 .board-notice.type_menu .board-tag-txt {	border: 1px solid #6441a5;	background-color: #6441a5;	color: #fff;}');
                        addstyle('.skin-1080 .com .box-w .group-mlist .tcol-p {	color: #6441a5;}');
                        addstyle('.skin-1080 .prev-next a.on {background-color: #5f44a1;color: #fff;}');
                        addstyle('.skin-1080#main-area .bg-color {	background-color: #eaea00;}');
                        addstyle('.skin-1080#main-area .m-tcol-c {	color: #000;}');
                        addstyle('.skin-1080#main-area .m-tcol-p {	color: #6441a5;}');
                        addstyle('.skin-1080#main-area .article-album-sub {	border-bottom: 1px solid #ff0000;}');
                        addstyle('.skin-1080 .article-board thead th {border-bottom-color: #e2e2e2;}');
                        addstyle('.skin-1080 .article-board tbody td {border-color: #e2e2e2; !important}');
                        addstyle('.skin-1080 .ia-info-btn .link_chat {display: none;}');
                        addstyle('.ModalLayer .layer_commerce_content .cate_box .category_list li.selected .btn {    color: #5f44a1}');
                        addstyle('.ModalLayer .layer_schedule_content .register .btn_add_map.active {    color: #5f44a1}');
                        addstyle('.BaseButton .svg-icon.icon-solid-writing { color: #fff;}');
                        addstyle('.BaseButton--skinGreen {    background: #6441a5;    color: #ffffff;}');
                        addstyle('.BaseButton--greenMain {    background: #5f44a1;}');
                        addstyle('.ArticleTitle .link_board {    color: #5f44a1}');
                        addstyle('.WriterInfo .profile_info .subscript_area .btn_subscript {color: #ffffff;}');
                        addstyle('.LoadingSquare .dot{background: #5f44a1;}');
                        addstyle('.SubscribeButton .ToggleSwitch .switch_input:checked+.switch_slider {    background-color: #5f44a1}');
                        addstyle('.CommentBox .comment_list .comment_nick_box .comment_nick_info .comment_info_date {    right: 0 !important;}');
                        addstyle('.ToggleButton .checkbox:checked+.label .bg_track[data-v-d8e678f2] {  background-color: #5f44a1}');
                        addstyle('.vote_check .label_box .vote_rate .rate_bar[data-v-74c2a70c] {background-color: #5f44a1;}');
                        addstyle('.vote_check .label_box .vote_rate .txt[data-v-74c2a70c] {color: #5f44a1;}');
                        addstyle('.CafeCustomVote .cafe_vote_view .cafe_vote_list .vote_check .label_box .vote_rate .rate_bar[data-v-4f21a8f4] {background-color: #5f44a1;}');
                        addstyle('.CafeCustomVote .cafe_vote_view .cafe_vote_list .vote_check .label_box .vote_rate .txt[data-v-4f21a8f4] {color: #5f44a1;}');
                        addstyle('.CafeViewer .CafeCustomVote .cafe_vote_view .cafe_vote_list .vote_check .label_box .vote_rate .rate_bar {background-color: #5f44a1;}');
                        addstyle('.CafeViewer .CafeCustomVote .cafe_vote_view .cafe_vote_list .vote_check .label_box .vote_rate .txt {color: #5f44a1;}');
                        addstyle('.CafeViewer .CafeCustomSchedule .cafe_schedule_view .cafe_schedule_view_title .cafe_schedule_view_important {    color: #5f44a1}');
                        addstyle('.CafeViewer .CafeCustomSchedule .cafe_schedule .cafe_schedule_title .cafe_schedule_important {  color: #5f44a1}');
                        addstyle('.CafeViewer .se-viewer .BaseButton--greenMain {    background: #5f44a1;}');
                        addstyle('.FormSelectBox .select_option .item[aria-selected=true] .option {    color: #5f44a1}');
                        addstyle('.TimePicker .layer_select_time .time_item[aria-selected=true] .selectbox_item_button {    color: #5f44a1}');
                        addstyle('.CalendarSelectBox .vdp-datepicker .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).day:hover,.CalendarSelectBox .vdp-datepicker .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).month:hover,.CalendarSelectBox .vdp-datepicker .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).year:hover {color: #5f44a1}');
                        addstyle('.LoadingRing .box {border-color: #5f44a1 transparent transparent transparent;}');
                        addstyle('.SelectRegion .select_city_header .city_button.selected {    color: #5f44a1}');
                        addstyle('.SelectRegion .select_city_content .region_list li.selected .btn {    color: #5f44a1}');
                        addstyle('.comm_layer2.npay_guide_layer .box_area .go {color: #5f44a1!important}');
                        addstyle('.layernotice .btns .link_confirm {    color: #5f44a1}');
                        addstyle('.ModalLayer .layer_commerce_safety_guide .deal_thead .safety_deal_step {color: #5f44a1}');
                        addstyle('.PurchaseButton .purchase_chat .chat_coach_mark {background-color: #5f44a1;}');
                        addstyle('.SaleInfo .ProductName .SaleLabel.reservation_escrow,.SaleInfo .ProductName .SaleLabel.safety {    color: #5f44a1}');
                        addstyle('.RelatedArticles .tit_area b {    color: #5f44a1}');
                        addstyle('.MemberOnlyArticleGuide .tit_guide .emph {    color: #5f44a1}');
                        addstyle('.MemberOnlyArticleGuide .txt_cafe {color: #5f44a1;}');
                        addstyle('.LayerPopup .temporary_message .lds-ring div {border: 2px solid #5f44a1; border-color: #5f44a1 transparent transparent transparent}');
                        addstyle('.WriterInfo .profile_info .subscript_area .btn_subscript {background: #5f44a1};');
                        addstyle('.RelatedArticles .tit_area .num {color: #5f44a1;}');
                        addstyle('.WriterInfo .profile_info .link_talk {display:none;)');
                        addstyle('.ArticleContentBox .article_writer {display:none}');
                        addstyle('.article-board .board-list .cmt { color: #5f44a1}');
                        addstyle('.list-i-new { display: none}');
                        addstyle('.article-board .th_name {text-align: center;}');
                        addstyle('.article-board .td_article {padding-left: 0px;	padding-right: 2px;}');
                        addstyle(".article-board .td_view {border-left: 1px solid rgb(226, 226, 226);}");
                        addstyle('.article-board .board-tag {padding-left: 8px; padding-right: 15px;}');
                        addstyle('.article-board .board-name {padding: 0 10px 0 0;}');
                        addstyle('.article-board .board-name .inner_name {border-right: 1px solid rgb(226, 226, 226); text-align: center;}');
                        addstyle('.article-board .board-notice .board-tag-txt {width: 48px;}');
                        addstyle('.article-board .board-name .inner_name .link_name {text-align: center;}');
                        addstyle('.article-board .board-number .inner_number {border-right: 1px solid rgb(226, 226, 226); text-align: center;}');
                        addstyle('.article-board .td_likes {border-left: 1px solid rgb(226, 226, 226);}');
                        addstyle('.article-board .board-list .cmt {color: #6441a5 !important;}');
                        addstyle('.article-board .board-list .answer {color: #6441a5;}');
                        addstyle('.article-board .board-list .ico-q {color: #6441a5;}');
                        addstyle('.article-board .board-list .p_cafebook {color: #6441a5;}');
                        addstyle('.article-board .board-list .reply_del {color: #6441a5;}');
                        addstyle('.article-board .board-list .reply_txt {color: #6441a5;}');
                        addstyle('.article-board .board-list .reply_txt:after {border-color: #6441a5 transparent transparent transparent;}');
                        addstyle('.article-board .board-list .reply_txt.is_selected:after {border-color: transparent transparent #6441a5 transparent;}');
                        addstyle('.article-board .pers_nick_area .p-nick {white-space: nowrap;	overflow: hidden;	text-overflow: ellipsis;	border-left: 1px solid rgb(226, 226, 226);	border-right: 1px solid rgb(226, 226, 226);	text-align: center;}');
                        addstyle('.article-board .pers_nick_area .p-nick a {text-align: center;}');
                        addstyle('.article_list_message .message {color: #616161;}');
                        addstyle('.article-album-sub .reply {color: #6441a5;}');
                        addstyle('.article-album-sub .price {color: #6441a5;}');
                        addstyle('.article-album-movie-sub .tit_area .reply {color: #6441a5;}');
                        addstyle('.article-movie-sub .tit_area .reply {color: #6441a5;}');
                        addstyle('.article-tag .list_tag .tit_area .cmt {color: #6441a5;}');
                        addstyle('.article-intro .box_history .fileview .txt_file {color: #6441a5;}');
                        addstyle('.board-notice.type_required .article, .board-notice.type_main .article {color: #6441a5;}');
                        addstyle('.board-notice.type_required .cmt, .board-notice.type_main .cmt {	color: #6441a5;}');
                        addstyle('.board-notice.type_required .board-tag-txt, .board-notice.type_main .board-tag-txt {	border: 1px solid #6441a5;	background-color: #6441a5;	color: #fff;}');
                        addstyle('.board-notice.type_menu .article {	color: #6441a5;}');
                        addstyle('.board-notice.type_menu .cmt {	color: #6441a5;}');
                        addstyle('.board-notice.type_menu .board-tag-txt {	border: 1px solid #6441a5;	background-color: #6441a5;	color: #fff;}');
                        addstyle('.com .box-w .group-mlist .tcol-p {	color: #6441a5;}');
                        addstyle('.prev-next a.on {background-color: #5f44a1;color: #fff;}');
                        addstyle('.article-board thead th {border-bottom-color: #e2e2e2;}');
                        addstyle('.article-board tbody td {border-color: #e2e2e2; !important}');
                        addstyle('.ArticleBoardWriterInfo {white-space: nowrap;	overflow: hidden;	text-overflow: ellipsis;	border-left: 1px solid rgb(226, 226, 226);	border-right: 1px solid rgb(226, 226, 226);	text-align: center;}');
                        addstyle('.RelatedArticles .tit_area .new-12-x-12 {display: none}');
                        addstyle('.RelatedArticles .tit_area .svg-icon.list_attach_img {display: none}');
                        addstyle('.RelatedArticles .tit_area .svg-icon.list_attach_video {display: none}');
                        addstyle('.RelatedArticles .member_area {padding-left: 0; text-align: center; border-left: 1px solid rgb(226, 226, 226);	border-right: 1px solid rgb(226, 226, 226);}');
                        addstyle('.RelatedArticles .date_area {padding-right: 16px;}');
                        addstyle('.RelatedArticles .list_item:first-child {border-top: 1px solid #e2e2e2;}');
                        addstyle('.TabButton .tab_btn[aria-selected=true] {background-color: #6441a5;	color: #fff;}');
                        addstyle('.article_profile .article {font-weight: 500;}');
                        addstyle('.article_profile .td_article {padding: 3px 2px 2px 4px;}');
                        addstyle('.article_profile .td_date,.article_profile .td_view {border-left: 1px solid rgb(226, 226, 226);}');
                        addstyle('.article-board .board-list .inner_list .svg-icon.list_attach_img {display:none}');
                        addstyle('.article-board .board-list .inner_list .svg-icon.list_attach_video {display:none}');
                        addstyle('.skin-1080 .list-i-img {display:none}');
                        addstyle('.skin-1080 .list-i-movie {display:none}');
                        addstyle('.skin-1080#main-area .board-box img.tcol-c {background-color: rgba(0, 0, 0, 0)}');
                        addstylecon('.skin-1080 .ia-info-btn .link_chat {display:none}');
                        addstylecon('.skin-1080 .ia-info-btn .link_chat .new_chatting {display:none}');
                        addstyle('.article_profile .list-style .link_sort.on {color: #6441a5}');
                        addstyle('.article_profile .list-style .link_sort.on:after {background-color: #6441a5}');
                        addstyle('.article_profile .board-list .cmt {font-weight: bold;}');
                        addstyle('.skin-1080 .article-board .board-list .search_word {	color: #6441a5;}');
                    }
                    else{
                        addstyle('.Sidebar_aside_btn__uh7ie .Sidebar_btn__8YLxw { background: #065093; }');
                        addstyle('.search_box .btn {    background: #065093;    color: #fff;}');
                        addstyle('.SearchBoxLayout .search_input_area .btn_search {background: #065093;    color: #fff;}');
                        addstyle('.BaseButton--green {    background: #065093;    color: #fff;}');
                        addstyle('.BoardTopOption .sort_area .sort_view .btn[aria-selected=true] .svg-icon { color: #065093; }');
                        addstyle('.ToggleSwitchLayout_wrap__svcF8 .ToggleSwitch.ToggleSwitch--skinGray .switch_input:checked+.switch_slider { background: #065093; }');
                        addstyle('.BaseButton .svg-icon.icon-solid-writing, .BaseButtonLink .svg-icon.icon-solid-writing { color: #fff;)');
                        addstyle('.CommentWriter .register_box .button.btn_register.is_active {  background: #065093; color: #fff}');
                        addstyle('.skin-1080 .article-board .pers_nick_area .mem-level img  {vertical-align: middle;}');
                        addstyle('.article-board .pers_nick_area .mem-level img  {vertical-align: middle}');
                        addstyle('.input_search_area .btn-search-green {background-color: #065093;}');
                        addstyle('.input_search_area .btn-search-green {background-color: #065093;}');
                        addstylecon('.skin-1080 .cafe-write-btn a {background-color: #065093;}');
                        addstylebody('.cafe-search .btn {background-color: #065093;}');
                        addstyle('.skin-1080 .article-board .th_name {text-align: center;}');
                        addstyle('.CafeViewer .se-viewer .BaseButton--green {    background: #065093;    color: #fff;}');
                        addstyle('.skin-1080 .article-board .td_article {padding-left: 0px;	padding-right: 2px;}');
                        addstyle(".skin-1080 .article-board .td_view {border-left: 1px solid rgb(226, 226, 226);}");
                        addstyle('.skin-1080 .article-board .board-tag {padding-left: 8px; padding-right: 15px;}');
                        addstyle('.skin-1080 .article-board .board-name {padding: 0 10px 0 0;}');
                        addstyle('.skin-1080 .article-board .board-name .inner_name {border-right: 1px solid rgb(226, 226, 226); text-align: center;}');
                        addstyle('.skin-1080 .article-board .board-notice .board-tag-txt {width: 48px;}');
                        addstyle('.skin-1080 .article-board .board-name .inner_name .link_name {text-align: center;}');
                        addstyle('.skin-1080 .article-board .board-number .inner_number {border-right: 1px solid rgb(226, 226, 226); text-align: center;}');
                        addstyle('.skin-1080 .article-board .td_likes {border-left: 1px solid rgb(226, 226, 226);}');
                        addstyle('.skin-1080 .article-board .board-list .cmt {color: #065093 !important;}');
                        addstyle('.skin-1080 .article-board .board-list .answer {color: #065093;}');
                        addstyle('.skin-1080 .article-board .board-list .ico-q {color: #065093;}');
                        addstyle('.skin-1080 .article-board .board-list .p_cafebook {color: #065093;}');
                        addstyle('.skin-1080 .article-board .board-list .reply_del {color: #065093;}');
                        addstyle('.skin-1080 .article-board .board-list .reply_txt {color: #065093;}');
                        addstyle('.skin-1080 .article-board .board-list .reply_txt:after {border-color: #065093 transparent transparent transparent;}');
                        addstyle('.skin-1080 .article-board .board-list .reply_txt.is_selected:after {border-color: transparent transparent #065093 transparent;}');
                        addstyle('.skin-1080 .article-board .pers_nick_area .p-nick {white-space: nowrap;	overflow: hidden;	text-overflow: ellipsis;	border-left: 1px solid rgb(226, 226, 226);	border-right: 1px solid rgb(226, 226, 226);	text-align: center;}');
                        addstyle('.skin-1080 .article-board .pers_nick_area .p-nick a {text-align: center;}');
                        addstyle('.skin-1080 .article_list_message .message {color: #616161;}');
                        addstyle('.skin-1080 .article-album-sub .reply {color: #065093;}');
                        addstyle('.skin-1080 .article-album-sub .price {color: #065093;}');
                        addstyle('.skin-1080 .article-album-movie-sub .tit_area .reply {color: #065093;}');
                        addstyle('.skin-1080 .article-movie-sub .tit_area .reply {color: #065093;}');
                        addstyle('.skin-1080 .article-tag .list_tag .tit_area .cmt {color: #065093;}');
                        addstyle('.skin-1080 .article-intro .box_history .fileview .txt_file {color: #065093;}');
                        addstyle('.skin-1080 .board-notice.type_required .article, .skin-1080 .board-notice.type_main .article {color: #065093;}');
                        addstyle('.skin-1080 .board-notice.type_required .cmt, .skin-1080 .board-notice.type_main .cmt {	color: #065093;}');
                        addstyle('.skin-1080 .board-notice.type_required .board-tag-txt, .skin-1080 .board-notice.type_main .board-tag-txt {	border: 1px solid #065093;	background-color: #065093;	color: #fff;}');
                        addstyle('.skin-1080 .board-notice.type_menu .article {	color: #065093;}');
                        addstyle('.skin-1080 .board-notice.type_menu .cmt {	color: #065093;}');
                        addstyle('.skin-1080 .board-notice.type_menu .board-tag-txt {	border: 1px solid #065093;	background-color: #065093;	color: #fff;}');
                        addstyle('.skin-1080 .com .box-w .group-mlist .tcol-p {	color: #065093;}');
                        addstyle('.skin-1080 .prev-next a.on {background-color: #065093;color: #fff;}');
                        addstyle('.skin-1080#main-area .bg-color {	background-color: #eaea00;}');
                        addstyle('.skin-1080#main-area .m-tcol-c {	color: #000;}');
                        addstyle('.skin-1080#main-area .m-tcol-p {	color: #065093;}');
                        addstyle('.skin-1080#main-area .article-album-sub {	border-bottom: 1px solid #ff0000;}');
                        addstyle('.skin-1080 .article-board thead th {border-bottom-color: #e2e2e2;}');
                        addstyle('.skin-1080 .article-board tbody td {border-color: #e2e2e2; !important}');
                        addstyle('.skin-1080 .ia-info-btn .link_chat {display: none;}');
                        addstyle('.ModalLayer .layer_commerce_content .cate_box .category_list li.selected .btn {    color: #065093}');
                        addstyle('.ModalLayer .layer_schedule_content .register .btn_add_map.active {    color: #065093}');
                        addstyle('.BaseButton .svg-icon.icon-solid-writing { color: #fff;}');
                        addstyle('.BaseButton--skinGreen {    background: #065093;    color: #ffffff;}');
                        addstyle('.BaseButton--greenMain {    background: #065093;}');
                        addstyle('.ArticleTitle .link_board {    color: #065093}');
                        addstyle('.WriterInfo .profile_info .subscript_area .btn_subscript {color: #ffffff;}');
                        addstyle('.LoadingSquare .dot{background: #065093;}');
                        addstyle('.SubscribeButton .ToggleSwitch .switch_input:checked+.switch_slider {    background-color: #065093}');
                        addstyle('.CommentBox .comment_list .comment_nick_box .comment_nick_info .comment_info_date {    right: 0 !important;}');
                        addstyle('.ToggleButton .checkbox:checked+.label .bg_track[data-v-d8e678f2] {  background-color: #065093}');
                        addstyle('.vote_check .label_box .vote_rate .rate_bar[data-v-74c2a70c] {background-color: #065093;}');
                        addstyle('.vote_check .label_box .vote_rate .txt[data-v-74c2a70c] {color: #065093;}');
                        addstyle('.CafeCustomVote .cafe_vote_view .cafe_vote_list .vote_check .label_box .vote_rate .rate_bar[data-v-4f21a8f4] {background-color: #065093;}');
                        addstyle('.CafeCustomVote .cafe_vote_view .cafe_vote_list .vote_check .label_box .vote_rate .txt[data-v-4f21a8f4] {color: #065093;}');
                        addstyle('.CafeViewer .CafeCustomVote .cafe_vote_view .cafe_vote_list .vote_check .label_box .vote_rate .rate_bar {background-color: #065093;}');
                        addstyle('.CafeViewer .CafeCustomVote .cafe_vote_view .cafe_vote_list .vote_check .label_box .vote_rate .txt {color: #065093;}');
                        addstyle('.CafeViewer .CafeCustomSchedule .cafe_schedule_view .cafe_schedule_view_title .cafe_schedule_view_important {    color: #065093}');
                        addstyle('.CafeViewer .CafeCustomSchedule .cafe_schedule .cafe_schedule_title .cafe_schedule_important {  color: #065093}');
                        addstyle('.CafeViewer .se-viewer .BaseButton--greenMain {    background: #065093;}');
                        addstyle('.FormSelectBox .select_option .item[aria-selected=true] .option {    color: #065093}');
                        addstyle('.TimePicker .layer_select_time .time_item[aria-selected=true] .selectbox_item_button {    color: #065093}');
                        addstyle('.CalendarSelectBox .vdp-datepicker .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).day:hover,.CalendarSelectBox .vdp-datepicker .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).month:hover,.CalendarSelectBox .vdp-datepicker .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).year:hover {color: #065093}');
                        addstyle('.LoadingRing .box {border-color: #065093 transparent transparent transparent;}');
                        addstyle('.SelectRegion .select_city_header .city_button.selected {    color: #065093}');
                        addstyle('.SelectRegion .select_city_content .region_list li.selected .btn {    color: #065093}');
                        addstyle('.comm_layer2.npay_guide_layer .box_area .go {color: #065093!important}');
                        addstyle('.layernotice .btns .link_confirm {    color: #065093}');
                        addstyle('.ModalLayer .layer_commerce_safety_guide .deal_thead .safety_deal_step {color: #065093}');
                        addstyle('.PurchaseButton .purchase_chat .chat_coach_mark {background-color: #065093;}');
                        addstyle('.SaleInfo .ProductName .SaleLabel.reservation_escrow,.SaleInfo .ProductName .SaleLabel.safety {    color: #065093}');
                        addstyle('.RelatedArticles .tit_area b {    color: #065093}');
                        addstyle('.MemberOnlyArticleGuide .tit_guide .emph {    color: #065093}');
                        addstyle('.MemberOnlyArticleGuide .txt_cafe {color: #065093;}');
                        addstyle('.LayerPopup .temporary_message .lds-ring div {border: 2px solid #065093; border-color: #065093 transparent transparent transparent}');
                        addstyle('.WriterInfo .profile_info .subscript_area .btn_subscript {background: #065093};');
                        addstyle('.RelatedArticles .tit_area .num {color: #065093;}');
                        addstyle('.WriterInfo .profile_info .link_talk {display:none;)');
                        addstyle('.ArticleContentBox .article_writer {display:none}');
                        addstyle('.article-board .board-list .cmt { color: #065093}');
                        addstyle('.list-i-new { display: none}');
                        addstyle('.article-board .th_name {text-align: center;}');
                        addstyle('.article-board .td_article {padding-left: 0px;	padding-right: 2px;}');
                        addstyle(".article-board .td_view {border-left: 1px solid rgb(226, 226, 226);}");
                        addstyle('.article-board .board-tag {padding-left: 8px; padding-right: 15px;}');
                        addstyle('.article-board .board-name {padding: 0 10px 0 0;}');
                        addstyle('.article-board .board-name .inner_name {border-right: 1px solid rgb(226, 226, 226); text-align: center;}');
                        addstyle('.article-board .board-notice .board-tag-txt {width: 48px;}');
                        addstyle('.article-board .board-name .inner_name .link_name {text-align: center;}');
                        addstyle('.article-board .board-number .inner_number {border-right: 1px solid rgb(226, 226, 226); text-align: center;}');
                        addstyle('.article-board .td_likes {border-left: 1px solid rgb(226, 226, 226);}');
                        addstyle('.article-board .board-list .cmt {color: #065093 !important;}');
                        addstyle('.article-board .board-list .answer {color: #065093;}');
                        addstyle('.article-board .board-list .ico-q {color: #065093;}');
                        addstyle('.article-board .board-list .p_cafebook {color: #065093;}');
                        addstyle('.article-board .board-list .reply_del {color: #065093;}');
                        addstyle('.article-board .board-list .reply_txt {color: #065093;}');
                        addstyle('.article-board .board-list .reply_txt:after {border-color: #065093 transparent transparent transparent;}');
                        addstyle('.article-board .board-list .reply_txt.is_selected:after {border-color: transparent transparent #065093 transparent;}');
                        addstyle('.article-board .pers_nick_area .p-nick {white-space: nowrap;	overflow: hidden;	text-overflow: ellipsis;	border-left: 1px solid rgb(226, 226, 226);	border-right: 1px solid rgb(226, 226, 226);	text-align: center;}');
                        addstyle('.article-board .pers_nick_area .p-nick a {text-align: center;}');
                        addstyle('.article_list_message .message {color: #616161;}');
                        addstyle('.article-album-sub .reply {color: #065093;}');
                        addstyle('.article-album-sub .price {color: #065093;}');
                        addstyle('.article-album-movie-sub .tit_area .reply {color: #065093;}');
                        addstyle('.article-movie-sub .tit_area .reply {color: #065093;}');
                        addstyle('.article-tag .list_tag .tit_area .cmt {color: #065093;}');
                        addstyle('.article-intro .box_history .fileview .txt_file {color: #065093;}');
                        addstyle('.board-notice.type_required .article, .board-notice.type_main .article {color: #065093;}');
                        addstyle('.board-notice.type_required .cmt, .board-notice.type_main .cmt {	color: #065093;}');
                        addstyle('.board-notice.type_required .board-tag-txt, .board-notice.type_main .board-tag-txt {	border: 1px solid #065093;	background-color: #065093;	color: #fff;}');
                        addstyle('.board-notice.type_menu .article {	color: #065093;}');
                        addstyle('.board-notice.type_menu .cmt {	color: #065093;}');
                        addstyle('.board-notice.type_menu .board-tag-txt {	border: 1px solid #065093;	background-color: #065093;	color: #fff;}');
                        addstyle('.com .box-w .group-mlist .tcol-p {	color: #065093;}');
                        addstyle('.prev-next a.on {background-color: #065093;color: #fff;}');
                        addstyle('.article-board thead th {border-bottom-color: #e2e2e2;}');
                        addstyle('.article-board tbody td {border-color: #e2e2e2; !important}');
                        addstyle('.ArticleBoardWriterInfo {white-space: nowrap;	overflow: hidden;	text-overflow: ellipsis;	border-left: 1px solid rgb(226, 226, 226);	border-right: 1px solid rgb(226, 226, 226);	text-align: center;}');
                        addstyle('.RelatedArticles .tit_area .new-12-x-12 {display: none}');
                        addstyle('.RelatedArticles .tit_area .svg-icon.list_attach_img {display: none}');
                        addstyle('.RelatedArticles .tit_area .svg-icon.list_attach_video {display: none}');
                        addstyle('.RelatedArticles .member_area {padding-left: 0; text-align: center; border-left: 1px solid rgb(226, 226, 226);	border-right: 1px solid rgb(226, 226, 226);}');
                        addstyle('.RelatedArticles .date_area {padding-right: 16px;}');
                        addstyle('.RelatedArticles .list_item:first-child {border-top: 1px solid #e2e2e2;}');
                        addstyle('.TabButton .tab_btn[aria-selected=true] {background-color: #065093;	color: #fff;}');
                        addstyle('.article_profile .article {font-weight: 500;}');
                        addstyle('.article_profile .td_article {padding: 3px 2px 2px 4px;}');
                        addstyle('.article_profile .td_date,.article_profile .td_view {border-left: 1px solid rgb(226, 226, 226);}');
                        addstyle('.article-board .board-list .inner_list .svg-icon.list_attach_img {display:none}');
                        addstyle('.article-board .board-list .inner_list .svg-icon.list_attach_video {display:none}');
                        addstyle('.skin-1080 .list-i-img {display:none}');
                        addstyle('.skin-1080 .list-i-movie {display:none}');
                        addstyle('.skin-1080#main-area .board-box img.tcol-c {background-color: rgba(0, 0, 0, 0)}');
                        addstylecon('.skin-1080 .ia-info-btn .link_chat {display:none}');
                        addstylecon('.skin-1080 .ia-info-btn .link_chat .new_chatting {display:none}');
                        addstyle('.article_profile .list-style .link_sort.on {color: #065093}');
                        addstyle('.article_profile .list-style .link_sort.on:after {background-color: #065093}');
                        addstyle('.article_profile .board-list .cmt {font-weight: bold;}');
                        addstyle('.skin-1080 .article-board .board-list .search_word {	color: #065093;}');
                    }
                }
            }
        }
    });


    async function handleImageEnlarger(mutation){
        try{
            await imageenlarger();
        }catch{};
    }



    async function imageenlarger() {
        if(GM_getValue('tgdskin', true)) await styleadding();
        try{
            let ttt = document.getElementsByClassName("Sidebar_aside_menu__sfO5X")[0].getElementsByClassName("Sidebar_item__Au0vx");
            newnum = ttt.length;
            console.log("dddd");
            console.log(ttt);
            for(let idx=0; idx<newnum; idx++){
                let yyy = ttt[idx]
                if (!yyy.dataset.listener) {
                    if(idx == 0){
                        yyy.addEventListener("click", async function(){
                                            console.log("tab button!!");
                                            //console.log(GM_getValue("inkiiconadd", false));
                                            setTimeout(function(){
                                                addiconstar();
                                            },1000);
                        })
                    }
                    else{
                        yyy.addEventListener("click", async function(){
                                            console.log("tab button!!");
                                            //console.log(GM_getValue("inkiiconadd", false));
                                            setTimeout(function(){
                                                checkEandProcess();
                                            },1000)
                                            setTimeout(function(){
                                                checkInkiOnBoard();
                                            },1100)
                                            setTimeout(function(){
                                                addInkiListButton();
                                            },1200)
                        })
                    }
                    yyy.dataset.listener = "true";
                }
            }
        }catch{}
        console.log(GM_getValue('star'));
        console.log(GM_getValue('tgdskin'));
        if(GM_getValue('star') == true || GM_getValue('tgdskin') == true ){
            console.log("OK");
            await addiconstar();
            await inkilist();
            await inkilistboard();
        }
        await console.log("wait for imageenlarger");
        var loadd = await getcommentlist();
        await console.log(loadd);
        await console.log("start imageenlarger");
        await setTimeout(async function() {
            z = document.createElement('style');
            z.innerHTML ='.CommentBox .comment_list .CommentItemImage .comment_image_link .image {    max-width: 100%;    max-height: 100%;    vertical-align: top; border-radius: 0%}';
            document.querySelector('#cafe_main').contentWindow.document.body.appendChild(z);
            let a = await document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
            await console.log("초기 댓글 늘리는 중...");
            var waittime = 200
            if(stop==0){
                if(a.length==0){
                    waittime+=500;
                }
                a.forEach((element) => {
                    if (element.firstChild.src == "" || element.firstChild.src.startsWith("https://cafe.naver.com")){
                        console.log("wait");
                        waittime = waittime + 50;
                        a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                    }
                });
                console.log(waittime);
                setTimeout(await function(){
                    a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                    a.forEach((element) => {
                        if(element.firstChild.currentSrc.includes("_gif")==true){element.firstChild.currentSrc = element.firstChild.currentSrc.replaceAll("?type=mc250_375_gif","");}
                        if(element.firstChild.src.includes("_gif")==true){element.firstChild.src = element.firstChild.src.replaceAll("?type=mc250_375_gif","");}
                        element.firstChild.currentSrc = element.firstChild.currentSrc.replaceAll("?type=mc250_375","");
                        element.firstChild.src = element.firstChild.src.replaceAll("?type=mc250_375","");
                        //console.log(element.firstChild.outerHTML);
                    });
                    console.log(a);
                    console.log("enlarge picture");
                },waittime);
            }
            var idxintvf = 0;
            var intvf = await setInterval(async function() {
                try{
                    comnum = await document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName('button_comment')[0].getElementsByClassName('num')[0].innerHTML;
                    btns = await document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("ArticleTopBtns")[0].getElementsByClassName("right_area")[0].getElementsByTagName("a")
                }catch{
                    idxintvf+=1;
                    if(idxintvf>100) await clearInterval(intvf);
                    return false;}
                //when element is found, clear the interval.
                console.log("comnum found");
                console.log(comnum);
                //await sleep(500);
                await clearInterval(intvf);
                await console.log(comnum);
                //await console.log("eeeeeeeeeeeeeeeeeeeeeeeee");
                await addbutton();
                await console.log("버튼추가");
                try {
                    for (let i = 0; i < 2; i++) {
                        // 버튼에 이벤트 리스너가 이미 등록되었는지 확인하기 위한 속성
                        if (!btns[i].dataset.listenerAdded) {
                            btns[i].addEventListener("click", async function () {
                                console.log("이전글/다음글 button!!");
                                setTimeout(function () {
                                    imageenlarger();
                                }, 300);
                            });
                            // 리스너가 추가되었음을 표시
                            btns[i].dataset.listenerAdded = "true";
                        }
                    }
                } catch (error) {
                    console.error("오류 발생:", error);
                }
                await console.log("adding observer..");
                await addObserverIfDesiredNodeAvailable();
            }, 100);

        }, 100);
    }


    async function bestcomment(){
        try{
            let d = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("CommentItem");
            let newnu = d.length;
            var bestwait = 200;

            for(let idx=0; idx<newnu; idx++){
                if(d[idx].getElementsByClassName("u_cnt _count")[0].innerText == ""){
                    bestwait += 30;
                }
            }
            console.log(d);
            var bestcoms = [];
            var comlikenums = [];
            setTimeout(function(){
                try{
                    if(document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("comment_tab_button")[0].id=="BESTCOM") return;
                }catch{}
                for(let idx=0; idx<newnu; idx++){
                    console.log(d[idx].getElementsByClassName("u_cnt _count")[0].innerText);
                    if(Number(d[idx].getElementsByClassName("u_cnt _count")[0].innerText)>=5)
                    {
                        console.log("인기!");
                        console.log(d[idx]);
                        var inkicom = d[idx].cloneNode(true);
                        inkicom.style="background: #fff4ea !important;";
                        let f = document.createElement("span");
                        f.style="background-color: rgb(217, 83, 79); display: inline; padding: 0.2em 0.6em 0.3em; font-size: 75%; font-weight: 700; line-height: 1; color: rgb(255, 255, 255); text-align: center; white-space: nowrap; vertical-align: baseline; border-radius: 0.25em;";
                        f.innerText = "BEST";
                        inkicom.getElementsByClassName("comment_nick_info")[0].prepend(f);
                        try{
                            inkicom.getElementsByClassName("comment_info_button")[0].remove();
                            inkicom.getElementsByClassName("comment_tool_button")[0].remove();
                        }catch{
                            if(document.getElementsByClassName("cafe-write-btn")[0].innerText!='카페 가입하기') return 0;
                        };
                        bestcoms[Number(d[idx].getElementsByClassName("u_cnt _count")[0].innerText)*1000+idx]=inkicom;
                        //comlikenums.push(Number(d[idx].getElementsByClassName("u_cnt _count")[0].innerText));
                    }
                }
                console.log(bestcoms);
                //comlikenums.sort(function(a, b){return b - a;});
                //console.log(comlikenums);
                var bestcomthree = 2;
                let threebestcoms = [];
                for(let idx=bestcoms.length-1;idx>0;idx--){
                    if(bestcoms[idx]==null) continue;
                    threebestcoms[bestcomthree] = bestcoms[idx];
                    bestcomthree-=1;
                    if(bestcomthree<0) break;
                }
                for(let idx=0;idx<3;idx++){
                    if(threebestcoms[idx]==null) continue;
                    let e = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("comment_list")[0];
                    e.prepend(threebestcoms[idx]);
                }
                document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("comment_tab_button")[0].id="BESTCOM";
            },bestwait);
        }catch{}
    }


    async function styleadding(){ //tgdskin add
        console.log("start styleadding");
        var ggg = 0;
        var kkk = 0;
        var gggg = 0;
        var ggggg = 0;

        try{
            let a = document.querySelector('#cafe_content').getElementsByClassName("list-i-new");
            newnum = a.length;
            //console.log(a)
            gggg = newnum;
            console.log(gggg);
            for(let idx=0; idx<newnum; idx++){
                a[idx].remove()
            }
            let b = document.getElementsByClassName("BadgeNotificationNew_wrap__anNWw");
            newnum = b.length
            //console.log(newnum);
            //console.log(b)
            for(let idx=0; idx<newnum; idx++){
                b[idx].remove()
            }
            let c = document.querySelector('#cafe_content').getElementsByTagName("img");
            newnum = c.length
            //console.log(newnum);
            //console.log(c)
            for(let idx=0; idx<newnum; idx++){
                //console.log(c[idx]);
                if (c[idx] != undefined) if (c[idx].src == "https://ssl.pstatic.net/static/cafe/cafe_pc/icon_board_new.png") c[idx].remove();
            }
            try{
                let d = document.querySelector('#cafe_content').getElementsByClassName("p-nick");
                newnum = d.length
                //console.log(newnum);
                //console.log(d)
                for(let idx=0; idx<newnum; idx++){
                    //console.log(d[idx].childNodes[1])
                    if(d[idx].childNodes[1].getElementsByTagName("img")[0].src == "https://cafe.pstatic.net/levelicon/1/6_999.gif"){
                        d[idx].childNodes[1].getElementsByTagName("img")[0].src="https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/1";
                        d[idx].childNodes[1].getElementsByTagName("img")[0].height = 15;
                        d[idx].childNodes[1].getElementsByTagName("img")[0].width = 15;
                        d[idx].prepend(d[idx].childNodes[1]);
                    }
                    else{
                        if(GM_getValue('memlevel')==false){
                            d[idx].childNodes[1].remove()
                        }
                    }
                }}catch{};
            setTimeout(function(){
                let d2 = document.querySelector('#cafe_content').getElementsByClassName("icon_level");
                newnum = d2.length
                //console.log(newnum);
                //console.log(d2)
                for(let idx=0; idx<newnum; idx++){
                    //console.log(d2[idx].style.backgroundImage)
                    if(d2[idx].style.backgroundImage == "url(\"https://ca-fe.pstatic.net/web-section/static/img/sprite_levelicon_9dbde2.svg#6_999-usage\")"){
                        let z = document.createElement('img');
                        z.src = "https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/1";
                        document.querySelector('#cafe_content').getElementsByClassName("nick_box")[0].prepend(z);
                    }
                }
            },1000);
            //for(let idx=0; idx<newnum; idx++){
            //console.log(d[idx].childNodes[1])
            //}

            try{
                setTimeout(function(){
                    try{
                        let d = document.querySelector('#cafe_content').getElementsByClassName("inner_list");
                        let e = document.querySelector('#cafe_content').getElementsByClassName("board-tag type_dot");
                        var dnewnum = d.length
                        //console.log(dnewnum);
                        console.log(e);
                        var offset = dnewnum - e.length;
                        //console.log(d);
                        for(let idx=0; idx<dnewnum; idx++){
                            try{
                                //console.log(d[idx].childNodes);
                                let nnum = d[idx].childNodes.length;
                                let ot = 0;
                                let om = 0;
                                let ir = 10;
                                let mr = 10;
                                for(let idxx=0; idxx<nnum; idxx++){
                                    try{

                                        //console.log(d[idx].childNodes[idxx]);


                                        if(d[idx].childNodes[idxx].getElementsByClassName("list-i-img").length!=0){
                                            //d[idx].prepend(d[idx].childNodes[idxx]);
                                            //console.log("이미지");
                                            ot+=1;
                                            ir = idxx;
                                        }
                                        else if(d[idx].childNodes[idxx].getElementsByClassName("list-i-movie").length!=0){
                                            //d[idx].prepend(d[idx].childNodes[idxx]);
                                            om+=1;
                                            mr = idxx;
                                        }

                                        if(om>0){
                                            e[idx-offset].childNodes[0].src = "https://raw.githubusercontent.com/ywj515/tgdcafe/main/video.svg"
                                            e[idx-offset].childNodes[0].width="12"
                                            e[idx-offset].childNodes[0].height="12";
                                            e[idx-offset].childNodes[0].style="vertical-align: middle;padding-bottom: 2px;";
                                            idxx = nnum;
                                        }
                                        else if(ot>0){
                                            e[idx-offset].childNodes[0].src = "https://raw.githubusercontent.com/ywj515/tgdcafe/main/image_green.svg"
                                            e[idx-offset].childNodes[0].width="12"
                                            e[idx-offset].childNodes[0].height="12";
                                            e[idx-offset].childNodes[0].style="vertical-align: middle;padding-bottom: 2px;";
                                            idxx = nnum;
                                        }



                                    }catch{}
                                }
                                if(om==0&&ot==0){
                                    console.log("2450");
                                    e[idx-offset].childNodes[0].src = "https://raw.githubusercontent.com/ywj515/tgdcafe/main/text.svg"
                                    e[idx-offset].childNodes[0].width="12"
                                    e[idx-offset].childNodes[0].height="12";
                                    e[idx-offset].childNodes[0].style="vertical-align: middle;padding-bottom: 2px;";
                                }

                            }catch{}
                        }}catch{}

                },100)}catch{}



            await inkilist();

            await inkilistboard();

            try{
                let ttt = document.getElementsByClassName("Sidebar_aside_menu__sfO5X")[0].getElementsByClassName("Sidebar_item__Au0vx");
                newnum = ttt.length;
                console.log("dddd");
                console.log(ttt);
                for(let idx=0; idx<newnum; idx++){
                    let yyy = ttt[idx]
                    if (!yyy.dataset.listener) {
                        if(idx == 0){
                            yyy.addEventListener("click", async function(){
                                                console.log("tab button!!");
                                                //console.log(GM_getValue("inkiiconadd", false));
                                                setTimeout(function(){
                                                    addiconstar();
                                                },1000);
                            })
                        }
                        else{
                            yyy.addEventListener("click", async function(){
                                                console.log("tab button!!");
                                                //console.log(GM_getValue("inkiiconadd", false));
                                                setTimeout(function(){
                                                    checkEandProcess();
                                                },1000)
                                                setTimeout(function(){
                                                    checkInkiOnBoard();
                                                },1100)
                                                setTimeout(function(){
                                                    addInkiListButton();
                                                },1200)
                            })
                        }
                        yyy.dataset.listener = "true";
                    }
                }
            }catch{}



            try{
                let d = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("BoardBottomOption")[0].getElementsByClassName("btn number")
                newnum = d.length
                //console.log(newnum);
                console.log(d)
                for(let idx=0; idx<newnum; idx++){
                    let nnum = d[idx].childNodes.length;
                    let ot = 0;
                    let om = 0;
                    let ir = 10;
                    let mr = 10;
                    for(let idxx=0; idxx<nnum; idxx++){
                        if(d[idx].childNodes[idxx].className == "list-i-img"){
                            //d[idx].prepend(d[idx].childNodes[idxx]);
                            ot+=1;
                            ir = idxx;
                        }
                        if(d[idx].childNodes[idxx].className == "list-i-movie"){
                            //d[idx].prepend(d[idx].childNodes[idxx]);
                            om+=1;
                            mr = idxx;
                        }
                    }
                    if(mr!=10){
                        d[idx].removeChild(d[idx].childNodes[mr]);
                    }
                    if(ir!=10){
                        d[idx].removeChild(d[idx].childNodes[ir]);
                    }
                    if(om>0){
                        let z = document.createElement('img');
                        z.src = "https://raw.githubusercontent.com/ywj515/tgdcafe/main/video.svg"
                        z.width="12"
                        z.height="12";
                        z.style="vertical-align: middle;padding-bottom: 2px;";
                        d[idx].prepend(z);
                    }
                    else if(ot>0){
                        let z = document.createElement('img');
                        z.src = "https://raw.githubusercontent.com/ywj515/tgdcafe/main/image_green.svg"
                        z.width="12"
                        z.height="12";
                        z.style="vertical-align: middle;padding-bottom: 2px;";
                        d[idx].prepend(z);
                    }
                    else{
                        console.log("2539");
                        let z = document.createElement('img');
                        z.src = "https://raw.githubusercontent.com/ywj515/tgdcafe/main/text.svg"
                        z.width="12"
                        z.height="12";
                        z.style="vertical-align: middle;padding-bottom: 2px;";
                        d[idx].prepend(z);
                    }
                }}catch{}










            console.log("1차끝")








            //console.log("2차시작")





        }catch{}
    }















    function ifDesiredNodeAvailable(classname) {
        let composeBox = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName(classname);
        if(!composeBox[0]) {
            composeBox = setTimeout(ifDesiredNodeAvailable(classname),1000);
            return composeBox;
        }
        //console.log(composeBox);

        return composeBox;
    }

    function addstyle(config){
        let z = document.createElement('style');
        z.innerHTML = config;
        document.querySelector('#cafe_content').appendChild(z);
    }

    function addstylecon(config){
        let z = document.createElement('style');
        z.innerHTML = config;
        document.getElementById("cafe_content").appendChild(z);
    }

    function addstylebody(config){
        let z = document.createElement('style');
        z.innerHTML = config;
        document.getElementById("cafe_content").appendChild(z);
    }

    const targetNodeT = document.getElementById('cafe_content');
    observerS.observe(targetNodeT, { childList: true, subtree: true });


    async function styleAndImage(){
        try{
            console.log('cafe_main 로드 완료');
            enableCommandMenu();
            addstyleI('.skin-1080 .article-board tbody td {border-bottom: 1px solid #e2e2e2;}');
            addstyleI('.article-board tbody td {border-bottom: 1px solid #e2e2e2;}');
            addstyleI('.CommentBox .comment_list .CommentItem {    border-top: 1px solid #ccc}');
            addstyleI('.RelatedArticles .list_item {border-bottom: 1px solid #e2e2e2;}');
            addstyleI('.CommentBox .comment_list .CommentItem.CommentItem--mine:before {background: #ffffff00}');
            addstyleI('.CommentBox .comment_list .comment_footer { flex-direction: row;    align-items: stretch; font-weight: 500; color:#000;}');
            addstyleI('.CommentBox .comment_list .comment_footer .comment_info_box {font-weight: 500; color:#000;}');
            addstyleI('.CommentBox .comment_list .comment_footer .u_likeit_list_module .u_likeit_list_btn .u_cnt {color:#000}');
            addstyleI('.skin-1080 .article-board .board-list div.inner_list a:visited, .skin-1080 .article-board .board-list div.inner_list div.inner_list a:visited * div.inner_list a:visited, div.inner_list a:visited * {color: #aaa !important;}')
            GM_addStyle('body {font-weight: 500;}');
            addstyleI('body {font-weight: 500;}');

            if(GM_getValue('fontsize', 14.5)!=0){
                addstyleI('.skin-1080 .article-board .board-name .inner_name .link_name {font-size: ' + (GM_getValue('fontsize', 14.5)-1) + 'px}');
                addstyleI('.skin-1080 .article-board .article {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
                addstyleI('.article-board .article {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
                addstyleI('.ArticleBoardWriterInfo .nickname {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
                addstyleconI('.skin-1080 #cafe-menu .cafe-menu-list li a {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
                addstyleI('.article_profile .td_date,.article_profile .td_view {border-left: 1px solid rgb(226, 226, 226); font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
                addstyleI('.article_profile .article {font-weight: 500; font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
                addstyleI('.article_profile .board-list .cmt {font-weight: bold; font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
                addstyleI('.skin-1080 .article-board .pers_nick_area .p-nick {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
                addstyleI('.skin-1080 .article-board .pers_nick_area .p-nick a {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
                addstyleI('.article-board .pers_nick_area .p-nick {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
                addstyleI('.article-board .pers_nick_area .p-nick a {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
                addstyleI('.RelatedArticles .tit_area {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
                addstyleI('.skin-1080 .article-board .board-box .td_article .article .inner {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
                addstyleI('.skin-1080 .article-album-sub dt a, .skin-1080 .article-album-sub .reply {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
                addstyleI('.skin-1080 .article-board .board-list .cmt {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
                addstyleI('.article-board .board-list .cmt {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
                //addstyleI('.skin-1080 .article-board tbody td {padding: 5px 7px}');
                addstyleI('.skin-1080 .article-memo .memo_lst_section .memo-box {font-size:' + (GM_getValue('fontsize', 14.5)+2) + 'px}');
                addstyleI('#content-area .cmlist .comm {font-size:' + (GM_getValue('fontsize', 14.5)+2) + 'px}');

            }
            if(GM_getValue('memlevel') == false){
                //addstyleI('.skin-1080 .article-board .pers_nick_area .mem-level img  {display: none}');
                addstyleI('.ArticleBoardWriterInfo [class*=LevelIcon] {display:none;}');
                addstyleI('.WriterInfo .profile_info .nick_level {display:none;}');
                addstyleI('.ArticleBoardWriterInfo .LevelIcon {display: none}');
                addstyleI('.CommentBox .comment_list .comment_nick_box .LevelIcon {display:none;}');
            }
            if(GM_getValue('tgdskinstar', true)){
                console.log("추천버튼");
                addstyleI('.ReplyBox .like_article {font-size: 14px;    display: inline-block;    padding: 6px 12px;    margin-bottom: 0px;    font-size: 14px;    font-weight: 400;    line-height: 1.42857;    text-align: center;    white-space: nowrap;    vertical-align: middle;    touch-action: manipulation;    cursor: pointer;    user-select: none;    background-image: none;    border: 1px solid rgba(0, 0, 0, 0);    border-radius: 4px;    color: rgb(92, 184, 92);    background-image: none;    background-color: rgba(0, 0, 0, 0);    border-color: rgb(92, 184, 92);}');
                addstyleI('.ReplyBox .like_article .u_likeit_list_module {    margin-right: 0px}');
                addstyleI('.ReplyBox .like_article .u_likeit_list_module .u_likeit_list_btn .u_ico {    width: 20px;    height: 20px;  background: url(https://raw.githubusercontent.com/ywj515/tgdcafe/main/like.svg); no-repeat;}');
                addstyleI('.ReplyBox .like_article .u_likeit_list_module .u_likeit_list_btn.on .u_ico {    background: url(https://raw.githubusercontent.com/ywj515/tgdcafe/main/like.svg); no-repeat}');
                addstyleI('.ReplyBox .box_left .like_article .ReactionLikeIt.u_likeit_list_module._cafeReactionModule .like_no.u_likeit_list_btn._button.on .u_ico._icon {width: 20px; height: 20px;margin-right: 6px;background: url(https://raw.githubusercontent.com/ywj515/tgdcafe/main/like.svg);  no-repeat}');
                addstyleI('.ReplyBox .box_left .like_article .ReactionLikeIt.u_likeit_list_module._cafeReactionModule .like_no.u_likeit_list_btn._button.off .u_ico._icon {width: 20px; height: 20px;margin-right: 6px;background: url(https://raw.githubusercontent.com/ywj515/tgdcafe/main/like_not.svg);  no-repeat};');
                addstyleI('.ReplyBox .like_article .button_like_list {display:none}');
                addstyleI('.ReplyBox {display: flex; justify-content:center; margin-top:20px}');
                addstyleI('.ReplyBox .button_comment {display:none}');
            }
            if(GM_getValue('tgdskin', true)){
                addstyleI('.svg-icon.aside-new {display: none}');
                addstyleI('.BadgeNotificationNew_wrap__anNWw {display: none}');
                if(GM_getValue('tgdskinblue', false) == false){
                    addstyleI('.BadgeNotificationNew_wrap__anNWw {display: none;}');
                    addstyleI('.search_box .btn {    background: #6441a5;    color: #fff;}');
                    addstyleI('.SearchBoxLayout .search_input_area .btn_search {background: #6441a5;    color: #fff;}');
                    addstyleI('.BaseButton .svg-icon.icon-solid-writing, .BaseButtonLink .svg-icon.icon-solid-writing {color: #fff;)');
                    addstyleI('.BoardTopOption .sort_area .sort_view .btn[aria-selected=true] .svg-icon { color: #6441a5; }');
                    addstyleI('.ToggleSwitchLayout_wrap__svcF8 .ToggleSwitch.ToggleSwitch--skinGray .switch_input:checked+.switch_slider { background: #6441a5; }');
                    addstyleI('.BaseButton--green {    background: #6441a5;    color: #fff;}');
                    addstyleI('.CommentWriter .register_box .button.btn_register.is_active {  background: #6441a5; color: #fff}');
                    addstyleI('.skin-1080 .BadgeNotificationNew_wrap__anNWw {display: none;}');
                    addstyleI('.BaseButton--green {    background: #6441a5;    color: #fff;}');
                    addstyleI('.skin-1080 .article-board .pers_nick_area .mem-level img  {vertical-align: middle;}');
                    addstyleI('.article-board .pers_nick_area .mem-level img  {vertical-align: middle}');
                    addstyleI('.input_search_area .btn-search-green {background-color: #6441a5;}');
                    addstyleI('.input_search_area .btn-search-green {background-color: #6441a5;}');
                    addstyleconI('.skin-1080 .cafe-write-btn a {background-color: #6441a5;}');
                    addstylebodyI('.cafe-search .btn {background-color: #6441a5;}');
                    addstyleI('.skin-1080 .article-board .th_name {text-align: center;}');
                    addstyleI('.CafeViewer .se-viewer .BaseButton--green {    background: #6441a5;    color: #fff;}');
                    addstyleI('.skin-1080 .article-board .td_article {padding-left: 0px;	padding-right: 2px;}');
                    addstyleI(".skin-1080 .article-board .td_view {border-left: 1px solid rgb(226, 226, 226);}");
                    addstyleI('.skin-1080 .article-board .board-tag {padding-left: 8px; padding-right: 15px;}');
                    addstyleI('.skin-1080 .article-board .board-name {padding: 0 10px 0 0;}');
                    addstyleI('.skin-1080 .article-board .board-name .inner_name {border-right: 1px solid rgb(226, 226, 226); text-align: center;}');
                    addstyleI('.skin-1080 .article-board .board-notice .board-tag-txt {width: 48px;}');
                    addstyleI('.skin-1080 .article-board .board-name .inner_name .link_name {text-align: center;}');
                    addstyleI('.skin-1080 .article-board .board-number .inner_number {border-right: 1px solid rgb(226, 226, 226); text-align: center;}');
                    addstyleI('.skin-1080 .article-board .td_likes {border-left: 1px solid rgb(226, 226, 226);}');
                    addstyleI('.skin-1080 .article-board .board-list .cmt {color: #6441a5 !important;}');
                    addstyleI('.skin-1080 .article-board .board-list .answer {color: #6441a5;}');
                    addstyleI('.skin-1080 .article-board .board-list .ico-q {color: #6441a5;}');
                    addstyleI('.skin-1080 .article-board .board-list .p_cafebook {color: #6441a5;}');
                    addstyleI('.skin-1080 .article-board .board-list .reply_del {color: #6441a5;}');
                    addstyleI('.skin-1080 .article-board .board-list .reply_txt {color: #6441a5;}');
                    addstyleI('.skin-1080 .article-board .board-list .reply_txt:after {border-color: #6441a5 transparent transparent transparent;}');
                    addstyleI('.skin-1080 .article-board .board-list .reply_txt.is_selected:after {border-color: transparent transparent #6441a5 transparent;}');
                    addstyleI('.skin-1080 .article-board .pers_nick_area .p-nick {white-space: nowrap;	overflow: hidden;	text-overflow: ellipsis;	border-left: 1px solid rgb(226, 226, 226);	border-right: 1px solid rgb(226, 226, 226);	text-align: center;}');
                    addstyleI('.skin-1080 .article-board .pers_nick_area .p-nick a {text-align: center;}');
                    addstyleI('.skin-1080 .article_list_message .message {color: #616161;}');
                    addstyleI('.skin-1080 .article-album-sub .reply {color: #6441a5;}');
                    addstyleI('.skin-1080 .article-album-sub .price {color: #6441a5;}');
                    addstyleI('.skin-1080 .article-album-movie-sub .tit_area .reply {color: #6441a5;}');
                    addstyleI('.skin-1080 .article-movie-sub .tit_area .reply {color: #6441a5;}');
                    addstyleI('.skin-1080 .article-tag .list_tag .tit_area .cmt {color: #6441a5;}');
                    addstyleI('.skin-1080 .article-intro .box_history .fileview .txt_file {color: #6441a5;}');
                    addstyleI('.skin-1080 .board-notice.type_required .article, .skin-1080 .board-notice.type_main .article {color: #6441a5;}');
                    addstyleI('.skin-1080 .board-notice.type_required .cmt, .skin-1080 .board-notice.type_main .cmt {	color: #6441a5;}');
                    addstyleI('.skin-1080 .board-notice.type_required .board-tag-txt, .skin-1080 .board-notice.type_main .board-tag-txt {	border: 1px solid #6441a5;	background-color: #6441a5;	color: #fff;}');
                    addstyleI('.skin-1080 .board-notice.type_menu .article {	color: #6441a5;}');
                    addstyleI('.skin-1080 .board-notice.type_menu .cmt {	color: #6441a5;}');
                    addstyleI('.skin-1080 .board-notice.type_menu .board-tag-txt {	border: 1px solid #6441a5;	background-color: #6441a5;	color: #fff;}');
                    addstyleI('.skin-1080 .com .box-w .group-mlist .tcol-p {	color: #6441a5;}');
                    addstyleI('.skin-1080 .prev-next a.on {background-color: #5f44a1;color: #fff;}');
                    addstyleI('.skin-1080#main-area .bg-color {	background-color: #eaea00;}');
                    addstyleI('.skin-1080#main-area .m-tcol-c {	color: #000;}');
                    addstyleI('.skin-1080#main-area .m-tcol-p {	color: #6441a5;}');
                    addstyleI('.skin-1080#main-area .article-album-sub {	border-bottom: 1px solid #ff0000;}');
                    addstyleI('.skin-1080 .article-board thead th {border-bottom-color: #e2e2e2;}');
                    addstyleI('.skin-1080 .article-board tbody td {border-color: #e2e2e2; !important}');
                    addstyleI('.skin-1080 .ia-info-btn .link_chat {display: none;}');
                    addstyleI('.ModalLayer .layer_commerce_content .cate_box .category_list li.selected .btn {    color: #5f44a1}');
                    addstyleI('.ModalLayer .layer_schedule_content .register .btn_add_map.active {    color: #5f44a1}');
                    addstyleI('.BaseButton .svg-icon.icon-solid-writing { color: #fff;}');
                    addstyleI('.BaseButton--skinGreen {    background: #6441a5;    color: #ffffff;}');
                    addstyleI('.BaseButton--greenMain {    background: #5f44a1;}');
                    addstyleI('.ArticleTitle .link_board {    color: #5f44a1}');
                    addstyleI('.WriterInfo .profile_info .subscript_area .btn_subscript {color: #ffffff;}');
                    addstyleI('.LoadingSquare .dot{background: #5f44a1;}');
                    addstyleI('.SubscribeButton .ToggleSwitch .switch_input:checked+.switch_slider {    background-color: #5f44a1}');
                    addstyleI('.CommentBox .comment_list .comment_nick_box .comment_nick_info .comment_info_date {    right: 0 !important;}');
                    addstyleI('.ToggleButton .checkbox:checked+.label .bg_track[data-v-d8e678f2] {  background-color: #5f44a1}');
                    addstyleI('.vote_check .label_box .vote_rate .rate_bar[data-v-74c2a70c] {background-color: #5f44a1;}');
                    addstyleI('.vote_check .label_box .vote_rate .txt[data-v-74c2a70c] {color: #5f44a1;}');
                    addstyleI('.CafeCustomVote .cafe_vote_view .cafe_vote_list .vote_check .label_box .vote_rate .rate_bar[data-v-4f21a8f4] {background-color: #5f44a1;}');
                    addstyleI('.CafeCustomVote .cafe_vote_view .cafe_vote_list .vote_check .label_box .vote_rate .txt[data-v-4f21a8f4] {color: #5f44a1;}');
                    addstyleI('.CafeViewer .CafeCustomVote .cafe_vote_view .cafe_vote_list .vote_check .label_box .vote_rate .rate_bar {background-color: #5f44a1;}');
                    addstyleI('.CafeViewer .CafeCustomVote .cafe_vote_view .cafe_vote_list .vote_check .label_box .vote_rate .txt {color: #5f44a1;}');
                    addstyleI('.CafeViewer .CafeCustomSchedule .cafe_schedule_view .cafe_schedule_view_title .cafe_schedule_view_important {    color: #5f44a1}');
                    addstyleI('.CafeViewer .CafeCustomSchedule .cafe_schedule .cafe_schedule_title .cafe_schedule_important {  color: #5f44a1}');
                    addstyleI('.CafeViewer .se-viewer .BaseButton--greenMain {    background: #5f44a1;}');
                    addstyleI('.FormSelectBox .select_option .item[aria-selected=true] .option {    color: #5f44a1}');
                    addstyleI('.TimePicker .layer_select_time .time_item[aria-selected=true] .selectbox_item_button {    color: #5f44a1}');
                    addstyleI('.CalendarSelectBox .vdp-datepicker .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).day:hover,.CalendarSelectBox .vdp-datepicker .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).month:hover,.CalendarSelectBox .vdp-datepicker .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).year:hover {color: #5f44a1}');
                    addstyleI('.LoadingRing .box {border-color: #5f44a1 transparent transparent transparent;}');
                    addstyleI('.SelectRegion .select_city_header .city_button.selected {    color: #5f44a1}');
                    addstyleI('.SelectRegion .select_city_content .region_list li.selected .btn {    color: #5f44a1}');
                    addstyleI('.comm_layer2.npay_guide_layer .box_area .go {color: #5f44a1!important}');
                    addstyleI('.layernotice .btns .link_confirm {    color: #5f44a1}');
                    addstyleI('.ModalLayer .layer_commerce_safety_guide .deal_thead .safety_deal_step {color: #5f44a1}');
                    addstyleI('.PurchaseButton .purchase_chat .chat_coach_mark {background-color: #5f44a1;}');
                    addstyleI('.SaleInfo .ProductName .SaleLabel.reservation_escrow,.SaleInfo .ProductName .SaleLabel.safety {    color: #5f44a1}');
                    addstyleI('.RelatedArticles .tit_area b {    color: #5f44a1}');
                    addstyleI('.MemberOnlyArticleGuide .tit_guide .emph {    color: #5f44a1}');
                    addstyleI('.MemberOnlyArticleGuide .txt_cafe {color: #5f44a1;}');
                    addstyleI('.LayerPopup .temporary_message .lds-ring div {border: 2px solid #5f44a1; border-color: #5f44a1 transparent transparent transparent}');
                    addstyleI('.WriterInfo .profile_info .subscript_area .btn_subscript {background: #5f44a1};');
                    addstyleI('.RelatedArticles .tit_area .num {color: #5f44a1;}');
                    addstyleI('.WriterInfo .profile_info .link_talk {display:none;)');
                    addstyleI('.ArticleContentBox .article_writer {display:none}');
                    addstyleI('.article-board .board-list .cmt { color: #5f44a1}');
                    addstyleI('.list-i-new { display: none}');
                    addstyleI('.article-board .th_name {text-align: center;}');
                    addstyleI('.article-board .td_article {padding-left: 0px;	padding-right: 2px;}');
                    addstyleI(".article-board .td_view {border-left: 1px solid rgb(226, 226, 226);}");
                    addstyleI('.article-board .board-tag {padding-left: 8px; padding-right: 15px;}');
                    addstyleI('.article-board .board-name {padding: 0 10px 0 0;}');
                    addstyleI('.article-board .board-name .inner_name {border-right: 1px solid rgb(226, 226, 226); text-align: center;}');
                    addstyleI('.article-board .board-notice .board-tag-txt {width: 48px;}');
                    addstyleI('.article-board .board-name .inner_name .link_name {text-align: center;}');
                    addstyleI('.article-board .board-number .inner_number {border-right: 1px solid rgb(226, 226, 226); text-align: center;}');
                    addstyleI('.article-board .td_likes {border-left: 1px solid rgb(226, 226, 226);}');
                    addstyleI('.article-board .board-list .cmt {color: #6441a5 !important;}');
                    addstyleI('.article-board .board-list .answer {color: #6441a5;}');
                    addstyleI('.article-board .board-list .ico-q {color: #6441a5;}');
                    addstyleI('.article-board .board-list .p_cafebook {color: #6441a5;}');
                    addstyleI('.article-board .board-list .reply_del {color: #6441a5;}');
                    addstyleI('.article-board .board-list .reply_txt {color: #6441a5;}');
                    addstyleI('.article-board .board-list .reply_txt:after {border-color: #6441a5 transparent transparent transparent;}');
                    addstyleI('.article-board .board-list .reply_txt.is_selected:after {border-color: transparent transparent #6441a5 transparent;}');
                    addstyleI('.article-board .pers_nick_area .p-nick {white-space: nowrap;	overflow: hidden;	text-overflow: ellipsis;	border-left: 1px solid rgb(226, 226, 226);	border-right: 1px solid rgb(226, 226, 226);	text-align: center;}');
                    addstyleI('.article-board .pers_nick_area .p-nick a {text-align: center;}');
                    addstyleI('.article_list_message .message {color: #616161;}');
                    addstyleI('.article-album-sub .reply {color: #6441a5;}');
                    addstyleI('.article-album-sub .price {color: #6441a5;}');
                    addstyleI('.article-album-movie-sub .tit_area .reply {color: #6441a5;}');
                    addstyleI('.article-movie-sub .tit_area .reply {color: #6441a5;}');
                    addstyleI('.article-tag .list_tag .tit_area .cmt {color: #6441a5;}');
                    addstyleI('.article-intro .box_history .fileview .txt_file {color: #6441a5;}');
                    addstyleI('.board-notice.type_required .article, .board-notice.type_main .article {color: #6441a5;}');
                    addstyleI('.board-notice.type_required .cmt, .board-notice.type_main .cmt {	color: #6441a5;}');
                    addstyleI('.board-notice.type_required .board-tag-txt, .board-notice.type_main .board-tag-txt {	border: 1px solid #6441a5;	background-color: #6441a5;	color: #fff;}');
                    addstyleI('.board-notice.type_menu .article {	color: #6441a5;}');
                    addstyleI('.board-notice.type_menu .cmt {	color: #6441a5;}');
                    addstyleI('.board-notice.type_menu .board-tag-txt {	border: 1px solid #6441a5;	background-color: #6441a5;	color: #fff;}');
                    addstyleI('.com .box-w .group-mlist .tcol-p {	color: #6441a5;}');
                    addstyleI('.prev-next a.on {background-color: #5f44a1;color: #fff;}');
                    addstyleI('.article-board thead th {border-bottom-color: #e2e2e2;}');
                    addstyleI('.article-board tbody td {border-color: #e2e2e2; !important}');
                    addstyleI('.ArticleBoardWriterInfo {white-space: nowrap;	overflow: hidden;	text-overflow: ellipsis;	border-left: 1px solid rgb(226, 226, 226);	border-right: 1px solid rgb(226, 226, 226);	text-align: center;}');
                    addstyleI('.RelatedArticles .tit_area .new-12-x-12 {display: none}');
                    addstyleI('.RelatedArticles .tit_area .svg-icon.list_attach_img {display: none}');
                    addstyleI('.RelatedArticles .tit_area .svg-icon.list_attach_video {display: none}');
                    addstyleI('.RelatedArticles .member_area {padding-left: 0; text-align: center; border-left: 1px solid rgb(226, 226, 226);	border-right: 1px solid rgb(226, 226, 226);}');
                    addstyleI('.RelatedArticles .date_area {padding-right: 16px;}');
                    addstyleI('.RelatedArticles .list_item:first-child {border-top: 1px solid #e2e2e2;}');
                    addstyleI('.TabButton .tab_btn[aria-selected=true] {background-color: #6441a5;	color: #fff;}');
                    addstyleI('.article_profile .article {font-weight: 500;}');
                    addstyleI('.article_profile .td_article {padding: 3px 2px 2px 4px;}');
                    addstyleI('.article_profile .td_date,.article_profile .td_view {border-left: 1px solid rgb(226, 226, 226);}');
                    addstyleI('.article-board .board-list .inner_list .svg-icon.list_attach_img {display:none}');
                    addstyleI('.article-board .board-list .inner_list .svg-icon.list_attach_video {display:none}');
                    addstyleI('.skin-1080 .list-i-img {display:none}');
                    addstyleI('.skin-1080 .list-i-movie {display:none}');
                    addstyleI('.skin-1080#main-area .board-box img.tcol-c {background-color: rgba(0, 0, 0, 0)}');
                    addstyleconI('.skin-1080 .ia-info-btn .link_chat {display:none}');
                    addstyleconI('.skin-1080 .ia-info-btn .link_chat .new_chatting {display:none}');
                    addstyleI('.article_profile .list-style .link_sort.on {color: #6441a5}');
                    addstyleI('.article_profile .list-style .link_sort.on:after {background-color: #6441a5}');
                    addstyleI('.article_profile .board-list .cmt {font-weight: bold;}');
                    addstyleI('.skin-1080 .article-board .board-list .search_word {	color: #6441a5;}');
                }
                else{
                    addstyleI('.BadgeNotificationNew_wrap__anNWw {display: none;}');
                    addstyleI('.search_box .btn {    background: #065093;    color: #fff;}');
                    addstyleI('.SearchBoxLayout .search_input_area .btn_search {background: #065093;    color: #fff;}');
                    addstyleI('.BaseButton--green {    background: #065093;    color: #fff;}');
                    addstyleI('.BoardTopOption .sort_area .sort_view .btn[aria-selected=true] .svg-icon { color: #065093; }');
                    addstyleI('.ToggleSwitchLayout_wrap__svcF8 .ToggleSwitch.ToggleSwitch--skinGray .switch_input:checked+.switch_slider { background: #065093; }');
                    addstyleI('.BaseButton .svg-icon.icon-solid-writing, .BaseButtonLink .svg-icon.icon-solid-writing { color: #fff;)');
                    addstyleI('.CommentWriter .register_box .button.btn_register.is_active {  background: #065093; color: #fff}');
                    addstyleI('.skin-1080 .BadgeNotificationNew_wrap__anNWw {display: none;}');
                    addstyleI('.BaseButton--green {    background: #065093;    color: #fff;}');
                    addstyleI('.skin-1080 .article-board .pers_nick_area .mem-level img  {vertical-align: middle;}');
                    addstyleI('.article-board .pers_nick_area .mem-level img  {vertical-align: middle}');
                    addstyleI('.input_search_area .btn-search-green {background-color: #065093;}');
                    addstyleI('.input_search_area .btn-search-green {background-color: #065093;}');
                    addstyleconI('.skin-1080 .cafe-write-btn a {background-color: #065093;}');
                    addstylebodyI('.cafe-search .btn {background-color: #065093;}');
                    addstyleI('.skin-1080 .article-board .th_name {text-align: center;}');
                    addstyleI('.CafeViewer .se-viewer .BaseButton--green {    background: #065093;    color: #fff;}');
                    addstyleI('.skin-1080 .article-board .td_article {padding-left: 0px;	padding-right: 2px;}');
                    addstyleI(".skin-1080 .article-board .td_view {border-left: 1px solid rgb(226, 226, 226);}");
                    addstyleI('.skin-1080 .article-board .board-tag {padding-left: 8px; padding-right: 15px;}');
                    addstyleI('.skin-1080 .article-board .board-name {padding: 0 10px 0 0;}');
                    addstyleI('.skin-1080 .article-board .board-name .inner_name {border-right: 1px solid rgb(226, 226, 226); text-align: center;}');
                    addstyleI('.skin-1080 .article-board .board-notice .board-tag-txt {width: 48px;}');
                    addstyleI('.skin-1080 .article-board .board-name .inner_name .link_name {text-align: center;}');
                    addstyleI('.skin-1080 .article-board .board-number .inner_number {border-right: 1px solid rgb(226, 226, 226); text-align: center;}');
                    addstyleI('.skin-1080 .article-board .td_likes {border-left: 1px solid rgb(226, 226, 226);}');
                    addstyleI('.skin-1080 .article-board .board-list .cmt {color: #065093 !important;}');
                    addstyleI('.skin-1080 .article-board .board-list .answer {color: #065093;}');
                    addstyleI('.skin-1080 .article-board .board-list .ico-q {color: #065093;}');
                    addstyleI('.skin-1080 .article-board .board-list .p_cafebook {color: #065093;}');
                    addstyleI('.skin-1080 .article-board .board-list .reply_del {color: #065093;}');
                    addstyleI('.skin-1080 .article-board .board-list .reply_txt {color: #065093;}');
                    addstyleI('.skin-1080 .article-board .board-list .reply_txt:after {border-color: #065093 transparent transparent transparent;}');
                    addstyleI('.skin-1080 .article-board .board-list .reply_txt.is_selected:after {border-color: transparent transparent #065093 transparent;}');
                    addstyleI('.skin-1080 .article-board .pers_nick_area .p-nick {white-space: nowrap;	overflow: hidden;	text-overflow: ellipsis;	border-left: 1px solid rgb(226, 226, 226);	border-right: 1px solid rgb(226, 226, 226);	text-align: center;}');
                    addstyleI('.skin-1080 .article-board .pers_nick_area .p-nick a {text-align: center;}');
                    addstyleI('.skin-1080 .article_list_message .message {color: #616161;}');
                    addstyleI('.skin-1080 .article-album-sub .reply {color: #065093;}');
                    addstyleI('.skin-1080 .article-album-sub .price {color: #065093;}');
                    addstyleI('.skin-1080 .article-album-movie-sub .tit_area .reply {color: #065093;}');
                    addstyleI('.skin-1080 .article-movie-sub .tit_area .reply {color: #065093;}');
                    addstyleI('.skin-1080 .article-tag .list_tag .tit_area .cmt {color: #065093;}');
                    addstyleI('.skin-1080 .article-intro .box_history .fileview .txt_file {color: #065093;}');
                    addstyleI('.skin-1080 .board-notice.type_required .article, .skin-1080 .board-notice.type_main .article {color: #065093;}');
                    addstyleI('.skin-1080 .board-notice.type_required .cmt, .skin-1080 .board-notice.type_main .cmt {	color: #065093;}');
                    addstyleI('.skin-1080 .board-notice.type_required .board-tag-txt, .skin-1080 .board-notice.type_main .board-tag-txt {	border: 1px solid #065093;	background-color: #065093;	color: #fff;}');
                    addstyleI('.skin-1080 .board-notice.type_menu .article {	color: #065093;}');
                    addstyleI('.skin-1080 .board-notice.type_menu .cmt {	color: #065093;}');
                    addstyleI('.skin-1080 .board-notice.type_menu .board-tag-txt {	border: 1px solid #065093;	background-color: #065093;	color: #fff;}');
                    addstyleI('.skin-1080 .com .box-w .group-mlist .tcol-p {	color: #065093;}');
                    addstyleI('.skin-1080 .prev-next a.on {background-color: #065093;color: #fff;}');
                    addstyleI('.skin-1080#main-area .bg-color {	background-color: #eaea00;}');
                    addstyleI('.skin-1080#main-area .m-tcol-c {	color: #000;}');
                    addstyleI('.skin-1080#main-area .m-tcol-p {	color: #065093;}');
                    addstyleI('.skin-1080#main-area .article-album-sub {	border-bottom: 1px solid #ff0000;}');
                    addstyleI('.skin-1080 .article-board thead th {border-bottom-color: #e2e2e2;}');
                    addstyleI('.skin-1080 .article-board tbody td {border-color: #e2e2e2; !important}');
                    addstyleI('.skin-1080 .ia-info-btn .link_chat {display: none;}');
                    addstyleI('.ModalLayer .layer_commerce_content .cate_box .category_list li.selected .btn {    color: #065093}');
                    addstyleI('.ModalLayer .layer_schedule_content .register .btn_add_map.active {    color: #065093}');
                    addstyleI('.BaseButton .svg-icon.icon-solid-writing { color: #fff;}');
                    addstyleI('.BaseButton--skinGreen {    background: #065093;    color: #ffffff;}');
                    addstyleI('.BaseButton--greenMain {    background: #065093;}');
                    addstyleI('.ArticleTitle .link_board {    color: #065093}');
                    addstyleI('.WriterInfo .profile_info .subscript_area .btn_subscript {color: #ffffff;}');
                    addstyleI('.LoadingSquare .dot{background: #065093;}');
                    addstyleI('.SubscribeButton .ToggleSwitch .switch_input:checked+.switch_slider {    background-color: #065093}');
                    addstyleI('.CommentBox .comment_list .comment_nick_box .comment_nick_info .comment_info_date {    right: 0 !important;}');
                    addstyleI('.ToggleButton .checkbox:checked+.label .bg_track[data-v-d8e678f2] {  background-color: #065093}');
                    addstyleI('.vote_check .label_box .vote_rate .rate_bar[data-v-74c2a70c] {background-color: #065093;}');
                    addstyleI('.vote_check .label_box .vote_rate .txt[data-v-74c2a70c] {color: #065093;}');
                    addstyleI('.CafeCustomVote .cafe_vote_view .cafe_vote_list .vote_check .label_box .vote_rate .rate_bar[data-v-4f21a8f4] {background-color: #065093;}');
                    addstyleI('.CafeCustomVote .cafe_vote_view .cafe_vote_list .vote_check .label_box .vote_rate .txt[data-v-4f21a8f4] {color: #065093;}');
                    addstyleI('.CafeViewer .CafeCustomVote .cafe_vote_view .cafe_vote_list .vote_check .label_box .vote_rate .rate_bar {background-color: #065093;}');
                    addstyleI('.CafeViewer .CafeCustomVote .cafe_vote_view .cafe_vote_list .vote_check .label_box .vote_rate .txt {color: #065093;}');
                    addstyleI('.CafeViewer .CafeCustomSchedule .cafe_schedule_view .cafe_schedule_view_title .cafe_schedule_view_important {    color: #065093}');
                    addstyleI('.CafeViewer .CafeCustomSchedule .cafe_schedule .cafe_schedule_title .cafe_schedule_important {  color: #065093}');
                    addstyleI('.CafeViewer .se-viewer .BaseButton--greenMain {    background: #065093;}');
                    addstyleI('.FormSelectBox .select_option .item[aria-selected=true] .option {    color: #065093}');
                    addstyleI('.TimePicker .layer_select_time .time_item[aria-selected=true] .selectbox_item_button {    color: #065093}');
                    addstyleI('.CalendarSelectBox .vdp-datepicker .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).day:hover,.CalendarSelectBox .vdp-datepicker .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).month:hover,.CalendarSelectBox .vdp-datepicker .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).year:hover {color: #065093}');
                    addstyleI('.LoadingRing .box {border-color: #065093 transparent transparent transparent;}');
                    addstyleI('.SelectRegion .select_city_header .city_button.selected {    color: #065093}');
                    addstyleI('.SelectRegion .select_city_content .region_list li.selected .btn {    color: #065093}');
                    addstyleI('.comm_layer2.npay_guide_layer .box_area .go {color: #065093!important}');
                    addstyleI('.layernotice .btns .link_confirm {    color: #065093}');
                    addstyleI('.ModalLayer .layer_commerce_safety_guide .deal_thead .safety_deal_step {color: #065093}');
                    addstyleI('.PurchaseButton .purchase_chat .chat_coach_mark {background-color: #065093;}');
                    addstyleI('.SaleInfo .ProductName .SaleLabel.reservation_escrow,.SaleInfo .ProductName .SaleLabel.safety {    color: #065093}');
                    addstyleI('.RelatedArticles .tit_area b {    color: #065093}');
                    addstyleI('.MemberOnlyArticleGuide .tit_guide .emph {    color: #065093}');
                    addstyleI('.MemberOnlyArticleGuide .txt_cafe {color: #065093;}');
                    addstyleI('.LayerPopup .temporary_message .lds-ring div {border: 2px solid #065093; border-color: #065093 transparent transparent transparent}');
                    addstyleI('.WriterInfo .profile_info .subscript_area .btn_subscript {background: #065093};');
                    addstyleI('.RelatedArticles .tit_area .num {color: #065093;}');
                    addstyleI('.WriterInfo .profile_info .link_talk {display:none;)');
                    addstyleI('.ArticleContentBox .article_writer {display:none}');
                    addstyleI('.article-board .board-list .cmt { color: #065093}');
                    addstyleI('.list-i-new { display: none}');
                    addstyleI('.article-board .th_name {text-align: center;}');
                    addstyleI('.article-board .td_article {padding-left: 0px;	padding-right: 2px;}');
                    addstyleI(".article-board .td_view {border-left: 1px solid rgb(226, 226, 226);}");
                    addstyleI('.article-board .board-tag {padding-left: 8px; padding-right: 15px;}');
                    addstyleI('.article-board .board-name {padding: 0 10px 0 0;}');
                    addstyleI('.article-board .board-name .inner_name {border-right: 1px solid rgb(226, 226, 226); text-align: center;}');
                    addstyleI('.article-board .board-notice .board-tag-txt {width: 48px;}');
                    addstyleI('.article-board .board-name .inner_name .link_name {text-align: center;}');
                    addstyleI('.article-board .board-number .inner_number {border-right: 1px solid rgb(226, 226, 226); text-align: center;}');
                    addstyleI('.article-board .td_likes {border-left: 1px solid rgb(226, 226, 226);}');
                    addstyleI('.article-board .board-list .cmt {color: #065093 !important;}');
                    addstyleI('.article-board .board-list .answer {color: #065093;}');
                    addstyleI('.article-board .board-list .ico-q {color: #065093;}');
                    addstyleI('.article-board .board-list .p_cafebook {color: #065093;}');
                    addstyleI('.article-board .board-list .reply_del {color: #065093;}');
                    addstyleI('.article-board .board-list .reply_txt {color: #065093;}');
                    addstyleI('.article-board .board-list .reply_txt:after {border-color: #065093 transparent transparent transparent;}');
                    addstyleI('.article-board .board-list .reply_txt.is_selected:after {border-color: transparent transparent #065093 transparent;}');
                    addstyleI('.article-board .pers_nick_area .p-nick {white-space: nowrap;	overflow: hidden;	text-overflow: ellipsis;	border-left: 1px solid rgb(226, 226, 226);	border-right: 1px solid rgb(226, 226, 226);	text-align: center;}');
                    addstyleI('.article-board .pers_nick_area .p-nick a {text-align: center;}');
                    addstyleI('.article_list_message .message {color: #616161;}');
                    addstyleI('.article-album-sub .reply {color: #065093;}');
                    addstyleI('.article-album-sub .price {color: #065093;}');
                    addstyleI('.article-album-movie-sub .tit_area .reply {color: #065093;}');
                    addstyleI('.article-movie-sub .tit_area .reply {color: #065093;}');
                    addstyleI('.article-tag .list_tag .tit_area .cmt {color: #065093;}');
                    addstyleI('.article-intro .box_history .fileview .txt_file {color: #065093;}');
                    addstyleI('.board-notice.type_required .article, .board-notice.type_main .article {color: #065093;}');
                    addstyleI('.board-notice.type_required .cmt, .board-notice.type_main .cmt {	color: #065093;}');
                    addstyleI('.board-notice.type_required .board-tag-txt, .board-notice.type_main .board-tag-txt {	border: 1px solid #065093;	background-color: #065093;	color: #fff;}');
                    addstyleI('.board-notice.type_menu .article {	color: #065093;}');
                    addstyleI('.board-notice.type_menu .cmt {	color: #065093;}');
                    addstyleI('.board-notice.type_menu .board-tag-txt {	border: 1px solid #065093;	background-color: #065093;	color: #fff;}');
                    addstyleI('.com .box-w .group-mlist .tcol-p {	color: #065093;}');
                    addstyleI('.prev-next a.on {background-color: #065093;color: #fff;}');
                    addstyleI('.article-board thead th {border-bottom-color: #e2e2e2;}');
                    addstyleI('.article-board tbody td {border-color: #e2e2e2; !important}');
                    addstyleI('.ArticleBoardWriterInfo {white-space: nowrap;	overflow: hidden;	text-overflow: ellipsis;	border-left: 1px solid rgb(226, 226, 226);	border-right: 1px solid rgb(226, 226, 226);	text-align: center;}');
                    addstyleI('.RelatedArticles .tit_area .new-12-x-12 {display: none}');
                    addstyleI('.RelatedArticles .tit_area .svg-icon.list_attach_img {display: none}');
                    addstyleI('.RelatedArticles .tit_area .svg-icon.list_attach_video {display: none}');
                    addstyleI('.RelatedArticles .member_area {padding-left: 0; text-align: center; border-left: 1px solid rgb(226, 226, 226);	border-right: 1px solid rgb(226, 226, 226);}');
                    addstyleI('.RelatedArticles .date_area {padding-right: 16px;}');
                    addstyleI('.RelatedArticles .list_item:first-child {border-top: 1px solid #e2e2e2;}');
                    addstyleI('.TabButton .tab_btn[aria-selected=true] {background-color: #065093;	color: #fff;}');
                    addstyleI('.article_profile .article {font-weight: 500;}');
                    addstyleI('.article_profile .td_article {padding: 3px 2px 2px 4px;}');
                    addstyleI('.article_profile .td_date,.article_profile .td_view {border-left: 1px solid rgb(226, 226, 226);}');
                    addstyleI('.article-board .board-list .inner_list .svg-icon.list_attach_img {display:none}');
                    addstyleI('.article-board .board-list .inner_list .svg-icon.list_attach_video {display:none}');
                    addstyleI('.skin-1080 .list-i-img {display:none}');
                    addstyleI('.skin-1080 .list-i-movie {display:none}');
                    addstyleI('.skin-1080#main-area .board-box img.tcol-c {background-color: rgba(0, 0, 0, 0)}');
                    addstyleconI('.skin-1080 .ia-info-btn .link_chat {display:none}');
                    addstyleconI('.skin-1080 .ia-info-btn .link_chat .new_chatting {display:none}');
                    addstyleI('.article_profile .list-style .link_sort.on {color: #065093}');
                    addstyleI('.article_profile .list-style .link_sort.on:after {background-color: #065093}');
                    addstyleI('.article_profile .board-list .cmt {font-weight: bold;}');
                    addstyleI('.skin-1080 .article-board .board-list .search_word {	color: #065093;}');
                }
            }
            try {
                imageenlarger();
                console.log('이미지 확대 완료');
            } catch (error) {
                console.error('imageenlarger 실행 중 에러:', error);
            }
        } catch{}
    }


    let debounceTimer;

    const observerI = new MutationObserver((mutationsList) => {
        clearTimeout(debounceTimer); // 기존 타이머를 제거
        console.log("observerI");
        debounceTimer = setTimeout(() => {
            const iframe = document.getElementById('cafe_main');
            if (iframe) {
                console.log('cafe_main iframe 추가 감지');
                console.log(iframe)
                iframe.addEventListener('load', async () => {
                    styleAndImage();
                });
            }
        }, 10); // 10ms 대기
    });

    observerI.observe(document.body, { childList: true, subtree: true });

    function addstylerbody(config){
        let z = document.createElement('style');
        z.innerHTML = config;
        document.body.appendChild(z);
    }

    function addstyleI(config){
        let z = document.createElement('style');
        z.innerHTML = config;
        document.querySelector('#cafe_main').contentWindow.document.body.appendChild(z);
    }

    function addstyleconI(config){
        let z = document.createElement('style');
        z.innerHTML = config;
        document.getElementById("cafe_main").appendChild(z);
    }

    function addstylebodyI(config){
        let z = document.createElement('style');
        z.innerHTML = config;
        document.body.appendChild(z);
    }

////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////

} else if (currentURL.includes('https://cafe.naver.com/kanetv') || currentURL.includes('https://cafe.naver.com/dokkome')) {
    console.log('기존 카페에서 스크립트 작동!');
    let observerinki = new MutationObserver(e => {
        console.log("inki detected!!");
        setTimeout(function(){
            var inkilistpage ;
            try{
                inkilistpage = document.getElementsByClassName("cafe-menu-list")[1].getElementsByTagName("li")[1].getElementsByTagName("a")[0].className;
            }catch{
                try{
                    inkilistpage = document.getElementsByClassName("cafe-menu-list")[0].getElementsByTagName("li")[1].getElementsByTagName("a")[0].className;
                }catch{};};
            console.log(inkilistpage);
            if((GM_getValue("tgdskin") == true || GM_getValue("star") == true) && inkilistpage == "gm-tcol-c b") inkilist();
            if(inkilistpage != "gm-tcol-c b") addbutton();

            if(stop==1) return 0;
            let cn = Number(document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName('button_comment')[0].getElementsByClassName('num')[0].innerHTML);
            console.log(cn);
            var pages = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("btn_register is_active")
            var pagesnum = pages.length;
            for(let idx=0; idx<pagesnum; idx++){
                console.log(pages[idx].classList);
                if(pages[idx].classList.contains('eventlistening')) continue;
                pages[idx].classList.add('eventlistening');
                pages[idx].addEventListener("click", async function(){
                    console.log("댓글 수정/등록됨");
                    if(stop==1) return 0;
                    await sleep(500);
                    let a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                    //console.log(a)
                    var waittime = 0
                    a.forEach((element) => {
                        if (element.firstChild.src == "" || element.firstChild.src.startsWith("https://cafe.naver.com")){
                            //console.log("wait");
                            waittime = waittime + 50;
                            a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                        }
                    });
                    //console.log(waittime);
                    setTimeout(function(){
                        a.forEach((element) => {
                            if(element.firstChild.currentSrc.includes("_gif")==true){element.firstChild.currentSrc = element.firstChild.currentSrc.replaceAll("?type=mc250_375_gif","");}
                            if(element.firstChild.src.includes("_gif")==true){element.firstChild.src = element.firstChild.src.replaceAll("?type=mc250_375_gif","");}
                            element.firstChild.currentSrc = element.firstChild.currentSrc.replaceAll("?type=mc250_375","");
                            element.firstChild.src = element.firstChild.src.replaceAll("?type=mc250_375","");
                            //console.log(element.firstChild.outerHTML);
                        });},waittime);
                    console.log("enlarge picture");
                }, false);
            }
            if(comnum == cn){
                if (document.getElementById("Enlarge_button") != null){
                    console.log("안늘립니다. skip");
                    return;
                }
            }
            window.setTimeout(function(){
                a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                //console.log(a)
                comnum = cn;
                var waittime = 0
                a.forEach((element) => {
                    if (element.firstChild.src == "" || element.firstChild.src.startsWith("https://cafe.naver.com")){
                        //console.log("wait");
                        waittime = waittime + 50;
                        a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                    }
                });
                //console.log(waittime);
                setTimeout(function(){
                    a.forEach((element) => {
                        if(element.firstChild.currentSrc.includes("_gif")==true){element.firstChild.currentSrc = element.firstChild.currentSrc.replaceAll("?type=mc250_375_gif","");}
                        if(element.firstChild.src.includes("_gif")==true){element.firstChild.src = element.firstChild.src.replaceAll("?type=mc250_375_gif","");}
                        element.firstChild.currentSrc = element.firstChild.currentSrc.replaceAll("?type=mc250_375","");
                        element.firstChild.src = element.firstChild.src.replaceAll("?type=mc250_375","");
                        //console.log(element.firstChild.src);
                    });},waittime);
                console.log("enlarge picture");
            },100);
        },100);
    });



    let observer = new MutationObserver(e => {
        console.log("detected!!");
        if(stop==1) return 0;
        let cn = Number(document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName('button_comment')[0].getElementsByClassName('num')[0].innerHTML);
        console.log(cn);
        console.log(comnum);

        var pages = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("btn_register is_active")
        var pagesnum = pages.length;
        for(let idx=0; idx<pagesnum; idx++){
            console.log(pages[idx].classList);
            if(pages[idx].classList.contains('eventlistening')) continue;
            pages[idx].classList.add('eventlistening');
            pages[idx].addEventListener("click", async function(){
                console.log("댓글 수정/등록됨");
                if(stop==1) return 0;
                await sleep(500);
                let a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                //console.log(a)
                var waittime = 0
                a.forEach((element) => {
                    if (element.firstChild.src == "" || element.firstChild.src.startsWith("https://cafe.naver.com")){
                        //console.log("wait");
                        waittime = waittime + 50;
                        a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                    }
                });
                //console.log(waittime);
                setTimeout(function(){
                    a.forEach((element) => {
                        if(element.firstChild.currentSrc.includes("_gif")==true){element.firstChild.currentSrc = element.firstChild.currentSrc.replaceAll("?type=mc250_375_gif","");}
                        if(element.firstChild.src.includes("_gif")==true){element.firstChild.src = element.firstChild.src.replaceAll("?type=mc250_375_gif","");}
                        element.firstChild.currentSrc = element.firstChild.currentSrc.replaceAll("?type=mc250_375","");
                        element.firstChild.src = element.firstChild.src.replaceAll("?type=mc250_375","");
                        //console.log(element.firstChild.outerHTML);
                    });},waittime);
                console.log("enlarge picture");
            }, false);
        }
        if(comnum == cn){
            return;
        }
        window.setTimeout(function(){
            a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
            //console.log(a)
            comnum = cn;
            var waittime = 0
            a.forEach((element) => {
                if (element.firstChild.src == "" || element.firstChild.src.startsWith("https://cafe.naver.com")){
                    //console.log("wait");
                    waittime = waittime + 50;
                    a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                }
            });
            //console.log(waittime);
            setTimeout(function(){
                a.forEach((element) => {
                    if(element.firstChild.currentSrc.includes("_gif")==true){element.firstChild.currentSrc = element.firstChild.currentSrc.replaceAll("?type=mc250_375_gif","");}
                    if(element.firstChild.src.includes("_gif")==true){element.firstChild.src = element.firstChild.src.replaceAll("?type=mc250_375_gif","");}
                    element.firstChild.currentSrc = element.firstChild.currentSrc.replaceAll("?type=mc250_375","");
                    element.firstChild.src = element.firstChild.src.replaceAll("?type=mc250_375","");
                    //console.log(element.firstChild.src);
                });},waittime);
            console.log("enlarge picture");
        },100);
    });

    function sleep(sec) {
        return new Promise(resolve => setTimeout(resolve, sec));
    }

    function addObserverIfDesiredNodeAvailable() {
        console.log("try observe");
        //const composeBox = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName('CommentBox');
        const composeBox = document.getElementsByClassName("cafe-menu-list");
        if(!composeBox[1]) {
            window.setTimeout(addObserverIfDesiredNodeAvailable,500);
            return;
        }
        console.log("found it!")
        console.log(composeBox[1]);
        observer.observe(document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName('CommentBox')[0], {childList: true, subtree: true, characterData: true});
        try{
            observerinki.observe(document.getElementsByClassName("cafe-menu-list")[1].getElementsByTagName("li")[1].getElementsByTagName("a")[0], {childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class']});
        }catch{
            try{
                observerinki.observe(document.getElementsByClassName("cafe-menu-list")[0].getElementsByTagName("li")[1].getElementsByTagName("a")[0], {childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class']});
            }catch{}};
        console.log("ok1");
    }


    async function getcommentlist(){
        return new Promise((resolve, reject) => {
            console.log("wait until loaded");
            var intv0 = setInterval(function() {
                try{
                    var elems = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.ArticleLoading');
                }catch{return false;}
                //console.log('.ArticleLoading')
                if(elems.length > 0){
                    return false
                }
                //when element is found, clear the interval.
                console.log("loaded");
                clearInterval(intv0);
                console.log("finding element...");
                var intvf = setInterval(function() {
                    try{
                        var elems = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName('button_comment')[0].getElementsByClassName('num')[0].innerHTML;
                    }catch{return false;}
                    //when element is found, clear the interval.
                    console.log("element is found");
                    clearInterval(intvf);
                    clearInterval(intv0);
                    resolve(true);
                }, 100);
            }, 100);
        });

    }


    async function addiconstar(){

        try{
            let d = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("article-board.m-tcol-c")[1].getElementsByClassName("inner_list")
            let e;
            var bestcut = 0;
            try{
                //console.log("!111@@@@@@@@");
                e = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("article-board.m-tcol-c")[1].getElementsByClassName("td_likes");
                if(e.length != 0) bestcut = 10;
            }catch{}
            if(bestcut==0){
                try{
                    //console.log("2222@@@@@@@@");
                    e = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("article-board.m-tcol-c")[1].getElementsByClassName("td_view");
                    bestcut = 350;
                }catch{}
            }
            newnum = d.length
            //console.log(d);
            //ggggg = newnum;
            //console.log(ggggg);
            var likenum = e.length;
            var likesnumber = 0;
            //console.log(e);
            for(let idx=0; idx<newnum; idx++){
                let nnum = d[idx].childNodes.length;
                let ot = 0;
                let om = 0;
                let ir = 1000;
                let mr = 1000;
                //console.log("@@@@@@@");

                //console.log("@@@@@@@");
                if(bestcut != 10){
                    //console.log("@@@@@@@");
                    var cmtnum = 0;
                    try{
                        cmtnum = Number(d[idx].getElementsByClassName("cmt")[0].innerText.replace(/\[|\]/g,""));
                    }catch{};
                    likesnumber = Number(e[idx].innerText) + cmtnum * 25;
                    //console.log(likesnumber);
                }
                else likesnumber = Number(e[idx].innerText);
                //console.log("@@@@@@@");
                for(let idxx=0; idxx<nnum; idxx++){
                    if(d[idx].childNodes[idxx].className == "list-i-img"){
                        //d[idx].prepend(d[idx].childNodes[idxx]);
                        ot+=1;
                        ir = idxx;
                    }
                    if(d[idx].childNodes[idxx].className == "list-i-movie"){
                        //d[idx].prepend(d[idx].childNodes[idxx]);
                        om+=1;
                        mr = idxx;
                    }
                }
                //console.log("@@@@@@@");
                if(GM_getValue('tgdskin') == true && mr!=1000){
                    d[idx].removeChild(d[idx].childNodes[mr]);
                }
                if(GM_getValue('tgdskin') == true && ir!=1000){
                    d[idx].removeChild(d[idx].childNodes[ir]);
                }
                if((GM_getValue('star') == true || GM_getValue('tgdskin') == true ) && likenum !=0 && likesnumber>=bestcut){
                    let z = document.createElement('img');
                    z.src = "https://raw.githubusercontent.com/ywj515/tgdcafe/main/star.svg"
                    z.width="12"
                    z.height="12";
                    z.style="vertical-align: middle;padding-bottom: 2px;";
                    d[idx].prepend(z);
                }
                else if(GM_getValue('tgdskin') == true && om>0){
                    let z = document.createElement('img');
                    z.src = "https://raw.githubusercontent.com/ywj515/tgdcafe/main/video.svg"
                    z.width="12"
                    z.height="12";
                    z.style="vertical-align: middle;padding-bottom: 2px;";
                    d[idx].prepend(z);
                }
                else if(GM_getValue('tgdskin') == true && ot>0){
                    let z = document.createElement('img');
                    z.src = "https://raw.githubusercontent.com/ywj515/tgdcafe/main/image_green.svg"
                    z.width="12"
                    z.height="12";
                    z.style="vertical-align: middle;padding-bottom: 2px;";
                    d[idx].prepend(z);
                }
                else if(GM_getValue('tgdskin') == true){
                    let z = document.createElement('img');
                    z.src = "https://raw.githubusercontent.com/ywj515/tgdcafe/main/text.svg"
                    z.width="12"
                    z.height="12";
                    z.style="vertical-align: middle;padding-bottom: 2px;";
                    d[idx].prepend(z);
                }
            }}catch{}

        try{
            let d = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("article-board.m-tcol-c")[0].getElementsByClassName("td_article");
            //console.log(d);
            newnum = d.length
            //console.log(newnum);
            for(let idx=0; idx<newnum; idx++){
                let nnum = d[idx].childNodes.length;
                let ot = 0;
                let om = 0;
                for(let idxx=0; idxx<nnum; idxx++){
                    if(d[idx].childNodes[idxx].className == "board-tag"){
                        if(d[idx].childNodes[idxx].innerText == "공지"){
                            ot+=1;
                        }
                        if(d[idx].childNodes[idxx].innerText == "추천"){
                            om+=1;
                        }
                    }
                    if(GM_getValue('tgdskin') == true && ot>0 && d[idx].childNodes[idxx].className == "board-list"){
                        let z = document.createElement('img');
                        z.src = "https://raw.githubusercontent.com/ywj515/tgdcafe/main/info.svg"
                        z.width="12"
                        z.height="12";
                        z.style="vertical-align: middle;padding-bottom: 2px;";
                        d[idx].childNodes[idxx].childNodes[1].prepend(z);
                    }
                    if( (GM_getValue('star') == true || GM_getValue('tgdskin') == true ) &&  om>0 && d[idx].childNodes[idxx].className == "board-list"){
                        let z = document.createElement('img');
                        z.src = "https://raw.githubusercontent.com/ywj515/tgdcafe/main/star.svg"
                        z.width="12"
                        z.height="12";
                        z.style="vertical-align: middle;padding-bottom: 2px;";
                        d[idx].childNodes[idxx].childNodes[1].prepend(z);
                    }
                }
            }}catch{}

    }





    async function boldlist(){

        //let d = document.getElementsByClassName("cafe-menu-list")[1].getElementsByTagName("li")[1].getElementsByTagName("a")[0].className == "gm-tcol-c b"
        let d = document.getElementsByClassName("cafe-menu-list")
        //console.log(d);
        var dnewnum = d.length;
        //console.log(newnum);
        for(let idx=0; idx<dnewnum; idx++){
            let e = d[idx].getElementsByTagName("li");
            var dnewnumm = e.length;
            for(let idxx=0; idxx<dnewnumm; idxx++){
                try{
                    let cname = e[idxx].getElementsByTagName("a")[0].className;
                    let ctext = e[idxx].getElementsByTagName("a")[0].innerText;
                    //console.log(cname);
                    //console.log(ctext);
                    if(e[idxx].getElementsByTagName("a")[0].className == "gm-tcol-c b"){
                        console.log(ctext);
                        return e[idxx].getElementsByTagName("a")[0].innerText;
                    }
                }catch{};
            }
        }
        console.log("none");
        return "none";
    }








    async function addbutton(){
        await console.log("버튼넣는중");
        //var bolddd = await boldlist();
        //console.log(bolddd);
        if(true){
            var intchecking = await setInterval(async function() {
                console.log("trying");
                try{
                    if ( comnum == 0 || comnum == "0" || document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName('comment_refresh_button')[0].id == "hey"){
                        console.log("버튼 이미있음/댓글 없음");
                        clearInterval(intchecking);
                        return 0;
                    }
                }catch{};
            }, 500);

            var btn;
            var btn2;
            var vernum;
            var intve = await setInterval(async function() {
                try{
                    var target = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName('comment_tab')[0];
                    if (await document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName('comment_refresh_button')[0].id == "hey"){
                        console.log("버튼 이미있음");
                        clearInterval(intve);
                        return 0;
                    }
                    document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName('comment_refresh_button')[0].id = "hey";
                    btn = document.createElement("button");
                    btn.style.cssText = `color: white; padding: 2px; text-align: center; width: 50px; background-color: crimson; border-radius: 5px; margin-left: 10px; font-size: 12px; text-decoration: none; cursor: pointer;`
                    btn.innerText = `확대OFF`
                    btn.target = "_blank"
                    btn.role = "button"
                    btn.className = "Enlarge_button"
                    btn.onclick = () => {
                        console.log("확대 재시작");
                        target.removeChild(btn);
                        target.appendChild(btn2);
                        stop = 0;
                        document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("comment_refresh_button")[0].click();

                    };
                    btn2 = document.createElement("button");
                    btn2.style.cssText = `color: white; padding: 2px; text-align: center; width: 50px; background-color: green; border-radius: 5px; margin-left: 10px; font-size: 12px; text-decoration: none; cursor: pointer;`
                    btn2.innerText = `확대ON`
                    btn2.target = "_blank"
                    btn2.role = "button"
                    btn2.className = "Enlarge_button"
                    btn2.onclick = () => {
                        console.log("확대 중지");
                        target.removeChild(btn2);
                        target.appendChild(btn);
                        stop = 1;
                        document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("comment_refresh_button")[0].click();
                    };
                    try{
                        var targetver = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName('CommentCleanBot cleanbot')[0];
                        vernum = document.createElement("div");
                        vernum.style.cssText = `color: black; margin-left: 10px; font-size: 10px; font-weight: 200; text-decoration: none;`
                        vernum.innerText = `Ver`+numver;
                        vernum.target = "_blank"
                    }catch{};

                    //console.log("made on off button");
                }catch{
                    return false;}
                try{
                    console.log("check");
                    if(stop == 1) target.appendChild(btn);
                    else target.appendChild(btn2);
                    targetver.appendChild(vernum);
                }catch{
                    return false;
                }
                //console.log("made on off button");
                //when element is found, clear the interval.
                console.log("added on off button");
                clearInterval(intve);
            }, 100);
            var intve2 = await setInterval(await function() {
                try{
                    document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("comment_refresh_button")[0].addEventListener("click", async function(){
                        console.log("새로고침 됨");
                        if(stop==1){
                            console.log("확대안해");
                            let a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                            var waittime = 0
                            a.forEach((element) => {
                                if (element.firstChild.src == "" || element.firstChild.src.startsWith("https://cafe.naver.com")){
                                    //console.log("wait");
                                    waittime = waittime + 50;
                                    a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                                }
                            });
                            //console.log(waittime);
                            setTimeout(function(){
                                a.forEach((element) => {
                                    //if(element.firstChild.currentSrc.includes("?type=mc250_375")==false){
                                    //element.firstChild.currentSrc = element.firstChild.currentSrc + "?type=mc250_375";}
                                    //if(element.firstChild.src.includes("?type=mc250_375")==false){
                                    //element.firstChild.src = element.firstChild.src + "?type=mc250_375";}
                                });},waittime);
                            console.log("shrink picture");
                            //console.log(a);
                            return 0;
                        }
                        await sleep(500);
                        let a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                        waittime = 0
                        a.forEach((element) => {
                            if (element.firstChild.src == "" || element.firstChild.src.startsWith("https://cafe.naver.com")){
                                console.log("wait");
                                waittime = waittime + 50;
                                a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                            }
                        });
                        //console.log(a);
                        //console.log(waittime);
                        setTimeout(function(){
                            a.forEach((element) => {
                                if(element.firstChild.currentSrc.includes("_gif")==true){element.firstChild.currentSrc = element.firstChild.currentSrc.replaceAll("?type=mc250_375_gif","");}
                                if(element.firstChild.src.includes("_gif")==true){element.firstChild.src = element.firstChild.src.replaceAll("?type=mc250_375_gif","");}
                                element.firstChild.currentSrc = element.firstChild.currentSrc.replaceAll("?type=mc250_375","");
                                element.firstChild.src = element.firstChild.src.replaceAll("?type=mc250_375","");
                                //console.log(element.firstChild.src);
                            });},waittime);
                        console.log("enlarge picture");
                        //console.log(a);
                    }, false);
                }catch{return false;}
                //when element is found, clear the interval.
                //console.log("added refresh func");
                clearInterval(intve2);
            }, 100);
            var intve3 = await setInterval(await function() {
                try{
                    document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("comment_tab_button")[0].addEventListener("click", async function(){
                        console.log("새로고침 됨");
                        if(stop==1) return 0;
                        await sleep(500);
                        let a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                        var waittime = 0
                        a.forEach((element) => {
                            if (element.firstChild.src == "" || element.firstChild.src.startsWith("https://cafe.naver.com")){
                                //console.log("wait");
                                waittime = waittime + 50;
                                a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                            }
                        });
                        //console.log(waittime);
                        setTimeout(function(){
                            a.forEach((element) => {
                                if(element.firstChild.currentSrc.includes("_gif")==true){element.firstChild.currentSrc = element.firstChild.currentSrc.replaceAll("?type=mc250_375_gif","");}
                                if(element.firstChild.src.includes("_gif")==true){element.firstChild.src = element.firstChild.src.replaceAll("?type=mc250_375_gif","");}
                                element.firstChild.currentSrc = element.firstChild.currentSrc.replaceAll("?type=mc250_375","");
                                element.firstChild.src = element.firstChild.src.replaceAll("?type=mc250_375","");
                                //console.log(element.firstChild.outerHTML);
                            });},waittime);
                        console.log("enlarge picture");
                    }, false);
                }catch{return false;}
                //when element is found, clear the interval.
                //console.log("added tab 0 func");
                clearInterval(intve3);
            }, 100);
            var intve4 = await setInterval(await function() {
                try{
                    document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("comment_tab_button")[1].addEventListener("click", async function(){
                        console.log("새로고침 됨");
                        if(stop==1) return 0;
                        await sleep(500);
                        let a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                        var waittime = 0
                        a.forEach((element) => {
                            if (element.firstChild.src == "" || element.firstChild.src.startsWith("https://cafe.naver.com")){
                                //console.log("wait");
                                waittime = waittime + 50;
                                a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                            }
                        });
                        //console.log(waittime);
                        setTimeout(function(){
                            a.forEach((element) => {
                                if(element.firstChild.currentSrc.includes("_gif")==true){element.firstChild.currentSrc = element.firstChild.currentSrc.replaceAll("?type=mc250_375_gif","");}
                                if(element.firstChild.src.includes("_gif")==true){element.firstChild.src = element.firstChild.src.replaceAll("?type=mc250_375_gif","");}
                                element.firstChild.currentSrc = element.firstChild.currentSrc.replaceAll("?type=mc250_375","");
                                element.firstChild.src = element.firstChild.src.replaceAll("?type=mc250_375","");
                                //console.log(element.firstChild.outerHTML);
                            });},waittime);
                        console.log("enlarge picture");
                    }, false);
                }catch{return false;}
                //when element is found, clear the interval.
                //console.log("added tab 1 func");
                clearInterval(intve4);
            }, 100);
            var intve5 = await setInterval(await function() {
                try{
                    var pages = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("btn number")
                    var pagesnum = pages.length;
                    for(let idx=0; idx<pagesnum; idx++){
                        pages[idx].addEventListener("click", async function(){
                            console.log("새로고침 됨");
                            if(stop==1) return 0;
                            await sleep(500);
                            let a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                            var waittime = 0
                            a.forEach((element) => {
                                if (element.firstChild.src == "" || element.firstChild.src.startsWith("https://cafe.naver.com")){
                                    //console.log("wait");
                                    waittime = waittime + 50;
                                    a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                                }
                            });
                            //console.log(waittime);
                            setTimeout(function(){
                                a.forEach((element) => {
                                    if(element.firstChild.currentSrc.includes("_gif")==true){element.firstChild.currentSrc = element.firstChild.currentSrc.replaceAll("?type=mc250_375_gif","");}
                                    if(element.firstChild.src.includes("_gif")==true){element.firstChild.src = element.firstChild.src.replaceAll("?type=mc250_375_gif","");}
                                    element.firstChild.currentSrc = element.firstChild.currentSrc.replaceAll("?type=mc250_375","");
                                    element.firstChild.src = element.firstChild.src.replaceAll("?type=mc250_375","");
                                    //console.log(element.firstChild.outerHTML);
                                });},waittime);
                            console.log("enlarge picture");
                        }, false);
                    }
                }catch{return false;}
                //when element is found, clear the interval.
                //console.log("added number func");
                clearInterval(intve5);
            }, 100);
            console.log("eeeeeeeeeeeeeeeeeee");
            if(GM_getValue('tgdskinstar', true) && GM_getValue('choo', true)){
                console.log("ddddddddddddddddddddd");
                GM_setValue('choo', false);
                setTimeout(async function(){
                    //let g = await ifDesiredNodeAvailable("u_txt _label");
                    let g = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("u_txt _label");
                    console.log(g);
                    if(currentURL.includes('https://cafe.naver.com/kanetv')){
                        g[0].innerText = "뭉추";
                        g[0].outerText = "뭉추";
                    }
                    else{
                        g[0].innerText = "도추";
                        g[0].outerText = "도추";
                    }
                },10)
                GM_setValue('choo', true);
            }
            if(GM_getValue('bestcom',true)){
                await bestcomment();
            }
        }
    }















    function enableCommandMenu() {
        var commandMenu = true;
        try {
            if (typeof(GM_registerMenuCommand) == undefined) {
                return;
            } else {
                if (commandMenu == true ) {
                    if(GM_getValue('tgdskin', 5)==5) GM_setValue('tgdskin',false);
                    if(GM_getValue('tgdskinstar', 5)==5) GM_setValue('tgdskinstar',false);
                    if(GM_getValue('tgdskinblue', 5)==5) GM_setValue('tgdskinblue',false);
                    if(GM_getValue('tgdskinstar_bak', 5)==5) GM_setValue('tgdskinstar_bak',false);

                    if(GM_getValue('tgdskin', true)==true){
                        GM_registerMenuCommand('트게더 스킨 끄기 [현재: ON]', function() {
                            GM_setValue('tgdskin', false);
                            if(GM_getValue('tgdskinstar_bak', 5)==true) GM_setValue('tgdskinstar',true);
                            else GM_setValue('tgdskinstar',false);
                            location.reload();
                        })
                    }
                    else{
                        GM_registerMenuCommand('트게더 스킨 켜기 [현재: OFF]', function() {
                            GM_setValue('tgdskin', true);
                            if(GM_getValue('tgdskinstar', 5)==true) GM_setValue('tgdskinstar_bak',true);
                            else GM_setValue('tgdskinstar_bak',false);
                            location.reload();
                        })
                    }
                    if(GM_getValue('tgdskin', true)==false){
                        if(GM_getValue('tgdskinstar', true)==true){
                            GM_registerMenuCommand('트게더 추천 버튼 끄기 [현재: ON]', function() {
                                GM_setValue('tgdskinstar', false);
                                location.reload();
                            })
                        }
                        else{
                            GM_registerMenuCommand('트게더 추천 버튼 켜기 [현재: OFF]', function() {
                                GM_setValue('tgdskinstar', true);
                                location.reload();
                            })
                        }
                    }
                    else{
                        GM_setValue('tgdskinstar', true);
                        if(GM_getValue('tgdskinblue', true)==true){
                            GM_registerMenuCommand('트게더 스킨 보라색으로 변경 [현재: 파란색]', function() {
                                GM_setValue('tgdskinblue', false);
                                location.reload();
                            })
                        }
                        else{
                            GM_registerMenuCommand('트게더 스킨 파란색으로 변경 [현재: 보라색]', function() {
                                GM_setValue('tgdskinblue', true);
                                location.reload();
                            })
                        }
                    }
                    if(GM_getValue('star', 5)==5) GM_setValue('star',true);
                    if(GM_getValue('star')==true && GM_getValue('tgdskin', true)== false){
                        GM_registerMenuCommand('인기 게시글 별표 표시 끄기 [현재: 켜짐]', function() {
                            GM_setValue('star',false);
                            location.reload();
                        })
                    }
                    if(GM_getValue('star')==false && GM_getValue('tgdskin', true)== false){
                        GM_registerMenuCommand('인기 게시글 별표 표시 켜기 [현재: 꺼짐]', function() {
                            GM_setValue('star',true);
                            location.reload();
                        })
                    }
                    if(GM_getValue('bestcom', 5)==5) GM_setValue('bestcom',true);
                    if(GM_getValue('bestcom')==true){
                        GM_registerMenuCommand('베스트 댓글 끄기 [현재: 켜짐]', function() {
                            GM_setValue('bestcom',false);
                            location.reload();
                        })
                    }
                    if(GM_getValue('bestcom')==false){
                        GM_registerMenuCommand('베스트 댓글 켜기 [현재: 꺼짐]', function() {
                            GM_setValue('bestcom',true);
                            location.reload();
                        })
                    }
                    if(GM_getValue('memlevel', 5)==5) GM_setValue('memlevel',true);
                    if(GM_getValue('memlevel')==true){
                        GM_registerMenuCommand('회원 등급 표시 끄기 [현재: 켜짐]', function() {
                            GM_setValue('memlevel',false);
                            location.reload();
                        })
                    }
                    if(GM_getValue('memlevel')==false){
                        GM_registerMenuCommand('회원 등급 표시 켜기 [현재: 꺼짐]', function() {
                            GM_setValue('memlevel',true);
                            location.reload();
                        })
                    }
                    if(GM_getValue('largetext15', 5)==5) GM_setValue('largetext15',false);
                    if(GM_getValue('largetext14.5', 5)==5) GM_setValue('largetext14.5',true);
                    if(GM_getValue('largetext14', 5)==5) GM_setValue('largetext14',false);
                    if(GM_getValue('fontsize', 5)==5) GM_setValue('fontsize',14.5);
                    if(GM_getValue('largetext15', true)==true){
                        GM_registerMenuCommand('글씨 확대 끄기 [현재: 15px]', function() {
                            GM_setValue('largetext15', false);
                            GM_setValue('largetext14.5', false);
                            GM_setValue('largetext14', false);
                            GM_setValue('fontsize', 0);
                            location.reload();
                        })
                    }
                    if(GM_getValue('largetext14', true)==true){
                        GM_registerMenuCommand('글씨 확대 끄기 [현재: 14px]', function() {
                            GM_setValue('largetext15', false);
                            GM_setValue('largetext14.5', false);
                            GM_setValue('largetext14', false);
                            GM_setValue('fontsize', 0);
                            location.reload();
                        })
                    }
                    if(GM_getValue('largetext14.5', true)==true){
                        GM_registerMenuCommand('글씨 확대 끄기 [현재: 14.5px]', function() {
                            GM_setValue('largetext15', false);
                            GM_setValue('largetext14.5', false);
                            GM_setValue('largetext14', false);
                            GM_setValue('fontsize', 0);
                            location.reload();
                        })
                    }
                    GM_registerMenuCommand('글씨 확대 14px로', function() {
                        GM_setValue('largetext15', false);
                        GM_setValue('largetext14.5', false);
                        GM_setValue('largetext14', true);
                        GM_setValue('fontsize',14);
                        location.reload();
                    })
                    GM_registerMenuCommand('글씨 확대 14.5px로', function() {
                        GM_setValue('largetext15', false);
                        GM_setValue('largetext14.5', true);
                        GM_setValue('largetext14', false);
                        GM_setValue('fontsize',14.5);
                        location.reload();
                    })
                    GM_registerMenuCommand('글씨 확대 15px로', function() {
                        GM_setValue('largetext15', true);
                        GM_setValue('largetext14.5', false);
                        GM_setValue('largetext14', false);
                        GM_setValue('fontsize',15);
                        location.reload();
                    })
                };
            }

        }
        catch(err) {
            console.log(err);
        }
    }






    async function inkilist(){
        try{
            setTimeout(function(){
                //console.log(document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("article-board")[0].childNodes[0].getElementsByClassName("inner_list"))
                try{
                    let d = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("article-board")[0].getElementsByClassName("inner_list");


                    var waitinki = 100;
                    //if(newnum==0) waitinki = 1500;

                    console.log(d);
                    let e;
                    var bestcut = 10000;

                    try{
                        //console.log("2222@@@@@@@@");
                        setTimeout(function(){
                            e = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("article-board")[0].getElementsByClassName("td_view");
                            console.log(e.length);
                            bestcut = 350;
                            if(e.length==0) waitinki = 1000;
                        },100);
                    }catch{}


                    setTimeout(function(){
                        var likenum = e.length;
                        var likesnumber = 0;
                        //console.log("add!!!!!!!!!");
                        var newnum = d.length
                        //console.log(newnum);
                        for(let idx=0; idx<newnum; idx++){
                            //console.log("add!!!!!!!!!");
                            try{
                                //console.log("add!!!!!!!!!");
                                var cmtnum = Number(d[idx].getElementsByClassName("cmt")[0].innerText.replace(/\[|\]/g,""));
                                if(d[idx].id=="iconadded") continue;
                                d[idx].id="iconadded";
                                if(likenum != 0){
                                    likesnumber = Number(e[idx].innerText) + cmtnum * 25;
                                    console.log(likesnumber);
                                }
                                if((GM_getValue('star') == true || GM_getValue('tgdskin') == true ) && likenum !=0 && likesnumber>=bestcut){
                                    //console.log("add!!!!!!!!!");
                                    let z = document.createElement('img');
                                    z.src = "https://raw.githubusercontent.com/ywj515/tgdcafe/main/star.svg"
                                    z.width="12"
                                    z.height="12";
                                    z.style="vertical-align: middle;padding-bottom: 2px;";
                                    d[idx].childNodes[0].prepend(z);
                                }
                                else{
                                    let svgicon = d[idx].childNodes[2].getElementsByTagName("svg")[0].className.baseVal;
                                    let ot = 0;
                                    let om = 0;
                                    let ir = 1000;
                                    let mr = 1000;
                                    //console.log(svgicon)
                                    //console.log("add!!!!!!!!!");

                                    //console.log("add!!!!!!!!!");
                                    if(svgicon == "svg-icon list_attach_img"){
                                        //console.log("adding img")
                                        //d[idx].prepend(d[idx].childNodes[idxx]);
                                        ot+=1;
                                    }
                                    //console.log("add!!!!!!!!!");
                                    if(svgicon == "svg-icon list_attach_video"){
                                        //d[idx].prepend(d[idx].childNodes[idxx]);
                                        om+=1;
                                    }

                                    if(GM_getValue('tgdskin') == true && om>0){
                                        //d[idx].childNodes[0].getElementsByTagName("svg")[0].remove();
                                        let z = document.createElement('img');
                                        z.src = "https://raw.githubusercontent.com/ywj515/tgdcafe/main/video.svg"
                                        z.width="12"
                                        z.height="12";
                                        z.style="vertical-align: middle;padding-bottom: 2px;";
                                        d[idx].childNodes[0].prepend(z);
                                    }
                                    else if(GM_getValue('tgdskin') == true && ot>0){
                                        //d[idx].childNodes[0].getElementsByTagName("svg")[0].remove();
                                        let z = document.createElement('img');
                                        z.src = "https://raw.githubusercontent.com/ywj515/tgdcafe/main/image_green.svg"
                                        z.width="12"
                                        z.height="12";
                                        z.style="vertical-align: middle;padding-bottom: 2px; padding-right: 2px";
                                        d[idx].childNodes[0].prepend(z);
                                    }
                                    else if(GM_getValue('tgdskin') == true){
                                        let z = document.createElement('img');
                                        z.src = "https://raw.githubusercontent.com/ywj515/tgdcafe/main/text.svg"
                                        z.width="12"
                                        z.height="12";
                                        z.style="vertical-align: middle;padding-bottom: 2px; padding-right: 2px";
                                        d[idx].childNodes[0].prepend(z);
                                    }
                                }
                            }catch{
                                if(GM_getValue('tgdskin') == true){
                                    let z = document.createElement('img');
                                    z.src = "https://raw.githubusercontent.com/ywj515/tgdcafe/main/text.svg"
                                    z.width="12"
                                    z.height="12";
                                    z.style="vertical-align: middle;padding-bottom: 2px; padding-right: 2px";
                                    d[idx].childNodes[0].prepend(z);
                                }
                                continue;
                            }
                        }
                    }, waitinki)
                }catch{}

            },100)
            setTimeout(function(){
                try{
                    for(let iii=0; iii<12; iii++){
                        console.log("글목록 버튼..");
                        //console.log(document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("paginate_area")[0].getElementsByClassName("ArticlePaginate")[0].getElementsByClassName("btn"));
                        document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("paginate_area")[0].getElementsByClassName("ArticlePaginate")[0].getElementsByClassName("btn")[iii].addEventListener("click", async function(){
                            console.log("button!!");
                            //console.log(GM_getValue("inkiiconadd", false));
                            setTimeout(function(){
                                //console.log(document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("article-board")[0].childNodes[0].getElementsByClassName("inner_list"))
                                let d = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("article-board")[0].childNodes[0].getElementsByClassName("inner_list");
                                newnum = d.length
                                //console.log(newnum);

                                var waitinki = 100;
                                if(newnum==0) waitinki = 900;
                                console.log(d)
                                let e;
                                var bestcut = 10000;
                                try{
                                    console.log("2222@@@@@@@@");
                                    e = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("article-board")[0].getElementsByClassName("td_view");
                                    console.log(e);
                                    bestcut = 350;
                                    if(e.length==0) waitinki = 1200;
                                }catch{}

                                setTimeout(function(){
                                    var likenum = e.length;
                                    var likesnumber = 0;
                                    for(let idx=0; idx<newnum; idx++){
                                        try{
                                            if(d[idx].id=="iconadded") continue;
                                            d[idx].id="iconadded";
                                            var cmtnum = Number(d[idx].getElementsByClassName("cmt")[0].innerText.replace(/\[|\]/g,""));
                                            if(likenum != 0){
                                                likesnumber = Number(e[idx].innerText) + cmtnum * 25;
                                                console.log(likesnumber);
                                            }
                                            if((GM_getValue('star') == true || GM_getValue('tgdskin') == true ) && likenum !=0 && likesnumber>=bestcut){
                                                let z = document.createElement('img');
                                                z.src = "https://raw.githubusercontent.com/ywj515/tgdcafe/main/star.svg"
                                                z.width="12"
                                                z.height="12";
                                                z.style="vertical-align: middle;padding-bottom: 2px;";
                                                d[idx].childNodes[0].prepend(z);
                                            }
                                            else{
                                                let svgicon = d[idx].childNodes[2].getElementsByTagName("svg")[0].className.baseVal;
                                                let ot = 0;
                                                let om = 0;
                                                let ir = 1000;
                                                let mr = 1000;
                                                //console.log(svgicon)

                                                if(svgicon == "svg-icon list_attach_img"){
                                                    //console.log("adding img")
                                                    //d[idx].prepend(d[idx].childNodes[idxx]);
                                                    ot+=1;
                                                }
                                                if(svgicon == "svg-icon list_attach_video"){
                                                    //d[idx].prepend(d[idx].childNodes[idxx]);
                                                    om+=1;
                                                }

                                                if(GM_getValue('tgdskin') == true && om>0){
                                                    //d[idx].childNodes[0].getElementsByTagName("svg")[0].remove();
                                                    let z = document.createElement('img');
                                                    z.src = "https://raw.githubusercontent.com/ywj515/tgdcafe/main/video.svg"
                                                    z.width="12"
                                                    z.height="12";
                                                    z.style="vertical-align: middle;padding-bottom: 2px;";
                                                    d[idx].childNodes[0].prepend(z);
                                                }
                                                else if(GM_getValue('tgdskin') == true && ot>0){
                                                    //d[idx].childNodes[0].getElementsByTagName("svg")[0].remove();
                                                    let z = document.createElement('img');
                                                    z.src = "https://raw.githubusercontent.com/ywj515/tgdcafe/main/image_green.svg"
                                                    z.width="12"
                                                    z.height="12";
                                                    z.style="vertical-align: middle;padding-bottom: 2px; padding-right: 2px";
                                                    d[idx].childNodes[0].prepend(z);
                                                }
                                                else if(GM_getValue('tgdskin') == true){
                                                    let z = document.createElement('img');
                                                    z.src = "https://raw.githubusercontent.com/ywj515/tgdcafe/main/text.svg"
                                                    z.width="12"
                                                    z.height="12";
                                                    z.style="vertical-align: middle;padding-bottom: 2px; padding-right: 2px";
                                                    d[idx].childNodes[0].prepend(z);
                                                }
                                            }
                                        }catch{
                                            if(GM_getValue('tgdskin') == true){
                                                let z = document.createElement('img');
                                                z.src = "https://raw.githubusercontent.com/ywj515/tgdcafe/main/text.svg"
                                                z.width="12"
                                                z.height="12";
                                                z.style="vertical-align: middle;padding-bottom: 2px; padding-right: 2px";
                                                d[idx].childNodes[0].prepend(z);
                                            }
                                            continue;
                                        }
                                    }
                                },waitinki) },50)
                        }) }




                }catch{}
            },200);

        }catch{}
    }











    $(document.getElementById('cafe_main')).on('load', function(){ setTimeout(async function() {
        console.log("cafe_main감지");
        enableCommandMenu();
        addstyle('.skin-1080 .article-board tbody td {border-bottom: 1px solid #e2e2e2;}');
        addstyle('.article-board tbody td {border-bottom: 1px solid #e2e2e2;}');
        addstyle('.CommentBox .comment_list .CommentItem {    border-top: 1px solid #ccc}');
        addstyle('.RelatedArticles .list_item {border-bottom: 1px solid #e2e2e2;}');
        addstyle('.CommentBox .comment_list .CommentItem.CommentItem--mine:before {background: #ffffff00}');
        addstyle('.CommentBox .comment_list .comment_footer { flex-direction: row;    align-items: stretch; font-weight: 500; color:#000;}');
        addstyle('.CommentBox .comment_list .comment_footer .comment_info_box {font-weight: 500; color:#000;}');
        addstyle('.CommentBox .comment_list .comment_footer .u_likeit_list_module .u_likeit_list_btn .u_cnt {color:#000}');
        addstyle('.skin-1080 .article-board .board-list div.inner_list a:visited, .skin-1080 .article-board .board-list div.inner_list div.inner_list a:visited * div.inner_list a:visited, div.inner_list a:visited * {color: #aaa !important;}')
        GM_addStyle('body {font-weight: 500;}');
        addstyle('body {font-weight: 500;}');

        if(GM_getValue('fontsize', 14.5)!=0){
            addstyle('.skin-1080 .article-board .board-name .inner_name .link_name {font-size: ' + (GM_getValue('fontsize', 14.5)-1) + 'px}');
            addstyle('.skin-1080 .article-board .article {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
            addstyle('.article-board .article {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
            addstyle('.ArticleBoardWriterInfo .nickname {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
            addstylecon('.skin-1080 #cafe-menu .cafe-menu-list li a {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
            addstyle('.article_profile .td_date,.article_profile .td_view {border-left: 1px solid rgb(226, 226, 226); font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
            addstyle('.article_profile .article {font-weight: 500; font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
            addstyle('.article_profile .board-list .cmt {font-weight: bold; font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
            addstyle('.skin-1080 .article-board .pers_nick_area .p-nick {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
            addstyle('.skin-1080 .article-board .pers_nick_area .p-nick a {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
            addstyle('.article-board .pers_nick_area .p-nick {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
            addstyle('.article-board .pers_nick_area .p-nick a {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
            addstyle('.RelatedArticles .tit_area {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
            addstyle('.skin-1080 .article-board .board-box .td_article .article .inner {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
            addstyle('.skin-1080 .article-album-sub dt a, .skin-1080 .article-album-sub .reply {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
            addstyle('.skin-1080 .article-board .board-list .cmt {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
            addstyle('.article-board .board-list .cmt {font-size:' + GM_getValue('fontsize', 14.5) + 'px}');
            //addstyle('.skin-1080 .article-board tbody td {padding: 5px 7px}');
            addstyle('.skin-1080 .article-memo .memo_lst_section .memo-box {font-size:' + (GM_getValue('fontsize', 14.5)+2) + 'px}');
            addstyle('#content-area .cmlist .comm {font-size:' + (GM_getValue('fontsize', 14.5)+2) + 'px}');

        }
        if(GM_getValue('memlevel') == false){
            //addstyle('.skin-1080 .article-board .pers_nick_area .mem-level img  {display: none}');
            addstyle('.WriterInfo .profile_info .nick_level {display:none;}');
            addstyle('.ArticleBoardWriterInfo .LevelIcon {display: none}');
            addstyle('.CommentBox .comment_list .comment_nick_box .LevelIcon {display:none;}');
        }
        if(GM_getValue('tgdskinstar', true)){
            console.log("추천버튼");
            addstyle('.ReplyBox .like_article {font-size: 14px;    display: inline-block;    padding: 6px 12px;    margin-bottom: 0px;    font-size: 14px;    font-weight: 400;    line-height: 1.42857;    text-align: center;    white-space: nowrap;    vertical-align: middle;    touch-action: manipulation;    cursor: pointer;    user-select: none;    background-image: none;    border: 1px solid rgba(0, 0, 0, 0);    border-radius: 4px;    color: rgb(92, 184, 92);    background-image: none;    background-color: rgba(0, 0, 0, 0);    border-color: rgb(92, 184, 92);}');
            addstyle('.ReplyBox .like_article .u_likeit_list_module {    margin-right: 0px}');
            addstyle('.ReplyBox .like_article .u_likeit_list_module .u_likeit_list_btn .u_ico {    width: 20px;    height: 20px;  background: url(https://raw.githubusercontent.com/ywj515/tgdcafe/main/like.svg); no-repeat;}');
            addstyle('.ReplyBox .like_article .u_likeit_list_module .u_likeit_list_btn.on .u_ico {    background: url(https://raw.githubusercontent.com/ywj515/tgdcafe/main/like.svg); no-repeat}');
            addstyle('.ReplyBox .box_left .like_article .ReactionLikeIt.u_likeit_list_module._cafeReactionModule .like_no.u_likeit_list_btn._button.on .u_ico._icon {width: 20px; height: 20px;margin-right: 6px;background: url(https://raw.githubusercontent.com/ywj515/tgdcafe/main/like.svg);  no-repeat}');
            addstyle('.ReplyBox .box_left .like_article .ReactionLikeIt.u_likeit_list_module._cafeReactionModule .like_no.u_likeit_list_btn._button.off .u_ico._icon {width: 20px; height: 20px;margin-right: 6px;background: url(https://raw.githubusercontent.com/ywj515/tgdcafe/main/like_not.svg);  no-repeat};');
            addstyle('.ReplyBox .like_article .button_like_list {display:none}');
            addstyle('.ReplyBox {display: flex; justify-content:center; margin-top:20px}');
            addstyle('.ReplyBox .button_comment {display:none}');
        }
        if(GM_getValue('tgdskin', true)){
            if(GM_getValue('tgdskinblue', false) == false){
                addstyle('.toggle_switch .switch_input:checked + .switch_slider { background: #6441a5; }');
                addstyle('.BaseButton--green {    background: #6441a5;    color: #fff;}');
                addstyle('.skin-1080 .article-board .pers_nick_area .mem-level img  {vertical-align: middle;}');
                addstyle('.article-board .pers_nick_area .mem-level img  {vertical-align: middle}');
                addstyle('.input_search_area .btn-search-green {background-color: #6441a5;}');
                addstyle('.input_search_area .btn-search-green {background-color: #6441a5;}');
                addstylecon('.skin-1080 .cafe-write-btn a {background-color: #6441a5;}');
                addstylebody('.cafe-search .btn {background-color: #6441a5;}');
                addstyle('.skin-1080 .article-board .th_name {text-align: center;}');
                addstyle('.CafeViewer .se-viewer .BaseButton--green {    background: #6441a5;    color: #fff;}');
                addstyle('.skin-1080 .article-board .td_article {padding-left: 0px;	padding-right: 2px;}');
                addstyle(".skin-1080 .article-board .td_view {border-left: 1px solid rgb(226, 226, 226);}");
                addstyle('.skin-1080 .article-board .board-tag {padding-left: 8px; padding-right: 15px;}');
                addstyle('.skin-1080 .article-board .board-name {padding: 0 10px 0 0;}');
                addstyle('.skin-1080 .article-board .board-name .inner_name {border-right: 1px solid rgb(226, 226, 226); text-align: center;}');
                addstyle('.skin-1080 .article-board .board-notice .board-tag-txt {width: 48px;}');
                addstyle('.skin-1080 .article-board .board-name .inner_name .link_name {text-align: center;}');
                addstyle('.skin-1080 .article-board .board-number .inner_number {border-right: 1px solid rgb(226, 226, 226); text-align: center;}');
                addstyle('.skin-1080 .article-board .td_likes {border-left: 1px solid rgb(226, 226, 226);}');
                addstyle('.skin-1080 .article-board .board-list .cmt {color: #6441a5 !important;}');
                addstyle('.skin-1080 .article-board .board-list .answer {color: #6441a5;}');
                addstyle('.skin-1080 .article-board .board-list .ico-q {color: #6441a5;}');
                addstyle('.skin-1080 .article-board .board-list .p_cafebook {color: #6441a5;}');
                addstyle('.skin-1080 .article-board .board-list .reply_del {color: #6441a5;}');
                addstyle('.skin-1080 .article-board .board-list .reply_txt {color: #6441a5;}');
                addstyle('.skin-1080 .article-board .board-list .reply_txt:after {border-color: #6441a5 transparent transparent transparent;}');
                addstyle('.skin-1080 .article-board .board-list .reply_txt.is_selected:after {border-color: transparent transparent #6441a5 transparent;}');
                addstyle('.skin-1080 .article-board .pers_nick_area .p-nick {white-space: nowrap;	overflow: hidden;	text-overflow: ellipsis;	border-left: 1px solid rgb(226, 226, 226);	border-right: 1px solid rgb(226, 226, 226);	text-align: center;}');
                addstyle('.skin-1080 .article-board .pers_nick_area .p-nick a {text-align: center;}');
                addstyle('.skin-1080 .article_list_message .message {color: #616161;}');
                addstyle('.skin-1080 .article-album-sub .reply {color: #6441a5;}');
                addstyle('.skin-1080 .article-album-sub .price {color: #6441a5;}');
                addstyle('.skin-1080 .article-album-movie-sub .tit_area .reply {color: #6441a5;}');
                addstyle('.skin-1080 .article-movie-sub .tit_area .reply {color: #6441a5;}');
                addstyle('.skin-1080 .article-tag .list_tag .tit_area .cmt {color: #6441a5;}');
                addstyle('.skin-1080 .article-intro .box_history .fileview .txt_file {color: #6441a5;}');
                addstyle('.skin-1080 .board-notice.type_required .article, .skin-1080 .board-notice.type_main .article {color: #6441a5;}');
                addstyle('.skin-1080 .board-notice.type_required .cmt, .skin-1080 .board-notice.type_main .cmt {	color: #6441a5;}');
                addstyle('.skin-1080 .board-notice.type_required .board-tag-txt, .skin-1080 .board-notice.type_main .board-tag-txt {	border: 1px solid #6441a5;	background-color: #6441a5;	color: #fff;}');
                addstyle('.skin-1080 .board-notice.type_menu .article {	color: #6441a5;}');
                addstyle('.skin-1080 .board-notice.type_menu .cmt {	color: #6441a5;}');
                addstyle('.skin-1080 .board-notice.type_menu .board-tag-txt {	border: 1px solid #6441a5;	background-color: #6441a5;	color: #fff;}');
                addstyle('.skin-1080 .com .box-w .group-mlist .tcol-p {	color: #6441a5;}');
                addstyle('.skin-1080 .prev-next a.on {background-color: #5f44a1;color: #fff;}');
                addstyle('.skin-1080#main-area .bg-color {	background-color: #eaea00;}');
                addstyle('.skin-1080#main-area .m-tcol-c {	color: #000;}');
                addstyle('.skin-1080#main-area .m-tcol-p {	color: #6441a5;}');
                addstyle('.skin-1080#main-area .article-album-sub {	border-bottom: 1px solid #ff0000;}');
                addstyle('.skin-1080 .article-board thead th {border-bottom-color: #e2e2e2;}');
                addstyle('.skin-1080 .article-board tbody td {border-color: #e2e2e2; !important}');
                addstyle('.skin-1080 .ia-info-btn .link_chat {display: none;}');
                addstyle('.ModalLayer .layer_commerce_content .cate_box .category_list li.selected .btn {    color: #5f44a1}');
                addstyle('.ModalLayer .layer_schedule_content .register .btn_add_map.active {    color: #5f44a1}');
                addstyle('.BaseButton .svg-icon.icon-solid-writing { color: #fff;}');
                addstyle('.BaseButton--skinGreen {    background: #6441a5;    color: #ffffff;}');
                addstyle('.BaseButton--greenMain {    background: #5f44a1;}');
                addstyle('.ArticleTitle .link_board {    color: #5f44a1}');
                addstyle('.WriterInfo .profile_info .subscript_area .btn_subscript {color: #ffffff;}');
                addstyle('.LoadingSquare .dot{background: #5f44a1;}');
                addstyle('.SubscribeButton .ToggleSwitch .switch_input:checked+.switch_slider {    background-color: #5f44a1}');
                addstyle('.CommentBox .comment_list .comment_nick_box .comment_nick_info .comment_info_date {    right: 0 !important;}');
                addstyle('.ToggleButton .checkbox:checked+.label .bg_track[data-v-d8e678f2] {  background-color: #5f44a1}');
                addstyle('.vote_check .label_box .vote_rate .rate_bar[data-v-74c2a70c] {background-color: #5f44a1;}');
                addstyle('.vote_check .label_box .vote_rate .txt[data-v-74c2a70c] {color: #5f44a1;}');
                addstyle('.CafeCustomVote .cafe_vote_view .cafe_vote_list .vote_check .label_box .vote_rate .rate_bar[data-v-4f21a8f4] {background-color: #5f44a1;}');
                addstyle('.CafeCustomVote .cafe_vote_view .cafe_vote_list .vote_check .label_box .vote_rate .txt[data-v-4f21a8f4] {color: #5f44a1;}');
                addstyle('.CafeViewer .CafeCustomVote .cafe_vote_view .cafe_vote_list .vote_check .label_box .vote_rate .rate_bar {background-color: #5f44a1;}');
                addstyle('.CafeViewer .CafeCustomVote .cafe_vote_view .cafe_vote_list .vote_check .label_box .vote_rate .txt {color: #5f44a1;}');
                addstyle('.CafeViewer .CafeCustomSchedule .cafe_schedule_view .cafe_schedule_view_title .cafe_schedule_view_important {    color: #5f44a1}');
                addstyle('.CafeViewer .CafeCustomSchedule .cafe_schedule .cafe_schedule_title .cafe_schedule_important {  color: #5f44a1}');
                addstyle('.CafeViewer .se-viewer .BaseButton--greenMain {    background: #5f44a1;}');
                addstyle('.FormSelectBox .select_option .item[aria-selected=true] .option {    color: #5f44a1}');
                addstyle('.TimePicker .layer_select_time .time_item[aria-selected=true] .selectbox_item_button {    color: #5f44a1}');
                addstyle('.CalendarSelectBox .vdp-datepicker .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).day:hover,.CalendarSelectBox .vdp-datepicker .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).month:hover,.CalendarSelectBox .vdp-datepicker .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).year:hover {color: #5f44a1}');
                addstyle('.LoadingRing .box {border-color: #5f44a1 transparent transparent transparent;}');
                addstyle('.SelectRegion .select_city_header .city_button.selected {    color: #5f44a1}');
                addstyle('.SelectRegion .select_city_content .region_list li.selected .btn {    color: #5f44a1}');
                addstyle('.comm_layer2.npay_guide_layer .box_area .go {color: #5f44a1!important}');
                addstyle('.layernotice .btns .link_confirm {    color: #5f44a1}');
                addstyle('.ModalLayer .layer_commerce_safety_guide .deal_thead .safety_deal_step {color: #5f44a1}');
                addstyle('.PurchaseButton .purchase_chat .chat_coach_mark {background-color: #5f44a1;}');
                addstyle('.SaleInfo .ProductName .SaleLabel.reservation_escrow,.SaleInfo .ProductName .SaleLabel.safety {    color: #5f44a1}');
                addstyle('.RelatedArticles .tit_area b {    color: #5f44a1}');
                addstyle('.MemberOnlyArticleGuide .tit_guide .emph {    color: #5f44a1}');
                addstyle('.MemberOnlyArticleGuide .txt_cafe {color: #5f44a1;}');
                addstyle('.LayerPopup .temporary_message .lds-ring div {border: 2px solid #5f44a1; border-color: #5f44a1 transparent transparent transparent}');
                addstyle('.WriterInfo .profile_info .subscript_area .btn_subscript {background: #5f44a1};');
                addstyle('.RelatedArticles .tit_area .num {color: #5f44a1;}');
                addstyle('.WriterInfo .profile_info .link_talk {display:none;)');
                addstyle('.ArticleContentBox .article_writer {display:none}');
                addstyle('.article-board .board-list .cmt { color: #5f44a1}');
                addstyle('.list-i-new { display: none}');
                addstyle('.article-board .th_name {text-align: center;}');
                addstyle('.article-board .td_article {padding-left: 0px;	padding-right: 2px;}');
                addstyle(".article-board .td_view {border-left: 1px solid rgb(226, 226, 226);}");
                addstyle('.article-board .board-tag {padding-left: 8px; padding-right: 15px;}');
                addstyle('.article-board .board-name {padding: 0 10px 0 0;}');
                addstyle('.article-board .board-name .inner_name {border-right: 1px solid rgb(226, 226, 226); text-align: center;}');
                addstyle('.article-board .board-notice .board-tag-txt {width: 48px;}');
                addstyle('.article-board .board-name .inner_name .link_name {text-align: center;}');
                addstyle('.article-board .board-number .inner_number {border-right: 1px solid rgb(226, 226, 226); text-align: center;}');
                addstyle('.article-board .td_likes {border-left: 1px solid rgb(226, 226, 226);}');
                addstyle('.article-board .board-list .cmt {color: #6441a5 !important;}');
                addstyle('.article-board .board-list .answer {color: #6441a5;}');
                addstyle('.article-board .board-list .ico-q {color: #6441a5;}');
                addstyle('.article-board .board-list .p_cafebook {color: #6441a5;}');
                addstyle('.article-board .board-list .reply_del {color: #6441a5;}');
                addstyle('.article-board .board-list .reply_txt {color: #6441a5;}');
                addstyle('.article-board .board-list .reply_txt:after {border-color: #6441a5 transparent transparent transparent;}');
                addstyle('.article-board .board-list .reply_txt.is_selected:after {border-color: transparent transparent #6441a5 transparent;}');
                addstyle('.article-board .pers_nick_area .p-nick {white-space: nowrap;	overflow: hidden;	text-overflow: ellipsis;	border-left: 1px solid rgb(226, 226, 226);	border-right: 1px solid rgb(226, 226, 226);	text-align: center;}');
                addstyle('.article-board .pers_nick_area .p-nick a {text-align: center;}');
                addstyle('.article_list_message .message {color: #616161;}');
                addstyle('.article-album-sub .reply {color: #6441a5;}');
                addstyle('.article-album-sub .price {color: #6441a5;}');
                addstyle('.article-album-movie-sub .tit_area .reply {color: #6441a5;}');
                addstyle('.article-movie-sub .tit_area .reply {color: #6441a5;}');
                addstyle('.article-tag .list_tag .tit_area .cmt {color: #6441a5;}');
                addstyle('.article-intro .box_history .fileview .txt_file {color: #6441a5;}');
                addstyle('.board-notice.type_required .article, .board-notice.type_main .article {color: #6441a5;}');
                addstyle('.board-notice.type_required .cmt, .board-notice.type_main .cmt {	color: #6441a5;}');
                addstyle('.board-notice.type_required .board-tag-txt, .board-notice.type_main .board-tag-txt {	border: 1px solid #6441a5;	background-color: #6441a5;	color: #fff;}');
                addstyle('.board-notice.type_menu .article {	color: #6441a5;}');
                addstyle('.board-notice.type_menu .cmt {	color: #6441a5;}');
                addstyle('.board-notice.type_menu .board-tag-txt {	border: 1px solid #6441a5;	background-color: #6441a5;	color: #fff;}');
                addstyle('.com .box-w .group-mlist .tcol-p {	color: #6441a5;}');
                addstyle('.prev-next a.on {background-color: #5f44a1;color: #fff;}');
                addstyle('.article-board thead th {border-bottom-color: #e2e2e2;}');
                addstyle('.article-board tbody td {border-color: #e2e2e2; !important}');
                addstyle('.ArticleBoardWriterInfo {white-space: nowrap;	overflow: hidden;	text-overflow: ellipsis;	border-left: 1px solid rgb(226, 226, 226);	border-right: 1px solid rgb(226, 226, 226);	text-align: center;}');
                addstyle('.RelatedArticles .tit_area .new-12-x-12 {display: none}');
                addstyle('.RelatedArticles .tit_area .svg-icon.list_attach_img {display: none}');
                addstyle('.RelatedArticles .tit_area .svg-icon.list_attach_video {display: none}');
                addstyle('.RelatedArticles .member_area {padding-left: 0; text-align: center; border-left: 1px solid rgb(226, 226, 226);	border-right: 1px solid rgb(226, 226, 226);}');
                addstyle('.RelatedArticles .date_area {padding-right: 16px;}');
                addstyle('.RelatedArticles .list_item:first-child {border-top: 1px solid #e2e2e2;}');
                addstyle('.TabButton .tab_btn[aria-selected=true] {background-color: #6441a5;	color: #fff;}');
                addstyle('.article_profile .article {font-weight: 500;}');
                addstyle('.article_profile .td_article {padding: 3px 2px 2px 4px;}');
                addstyle('.article_profile .td_date,.article_profile .td_view {border-left: 1px solid rgb(226, 226, 226);}');
                addstyle('.article-board .board-list .inner_list .svg-icon.list_attach_img {display:none}');
                addstyle('.article-board .board-list .inner_list .svg-icon.list_attach_video {display:none}');
                addstyle('.skin-1080 .list-i-img {display:none}');
                addstyle('.skin-1080 .list-i-movie {display:none}');
                addstyle('.skin-1080#main-area .board-box img.tcol-c {background-color: rgba(0, 0, 0, 0)}');
                addstylecon('.skin-1080 .ia-info-btn .link_chat {display:none}');
                addstylecon('.skin-1080 .ia-info-btn .link_chat .new_chatting {display:none}');
                addstyle('.article_profile .list-style .link_sort.on {color: #6441a5}');
                addstyle('.article_profile .list-style .link_sort.on:after {background-color: #6441a5}');
                addstyle('.article_profile .board-list .cmt {font-weight: bold;}');
                addstyle('.skin-1080 .article-board .board-list .search_word {	color: #6441a5;}');
            }
            else{
                addstyle('.toggle_switch .switch_input:checked + .switch_slider { background: #065093; }');
                addstyle('.BaseButton--green {    background: #065093;    color: #fff;}');
                addstyle('.skin-1080 .article-board .pers_nick_area .mem-level img  {vertical-align: middle;}');
                addstyle('.article-board .pers_nick_area .mem-level img  {vertical-align: middle}');
                addstyle('.input_search_area .btn-search-green {background-color: #065093;}');
                addstyle('.input_search_area .btn-search-green {background-color: #065093;}');
                addstylecon('.skin-1080 .cafe-write-btn a {background-color: #065093;}');
                addstylebody('.cafe-search .btn {background-color: #065093;}');
                addstyle('.skin-1080 .article-board .th_name {text-align: center;}');
                addstyle('.CafeViewer .se-viewer .BaseButton--green {    background: #065093;    color: #fff;}');
                addstyle('.skin-1080 .article-board .td_article {padding-left: 0px;	padding-right: 2px;}');
                addstyle(".skin-1080 .article-board .td_view {border-left: 1px solid rgb(226, 226, 226);}");
                addstyle('.skin-1080 .article-board .board-tag {padding-left: 8px; padding-right: 15px;}');
                addstyle('.skin-1080 .article-board .board-name {padding: 0 10px 0 0;}');
                addstyle('.skin-1080 .article-board .board-name .inner_name {border-right: 1px solid rgb(226, 226, 226); text-align: center;}');
                addstyle('.skin-1080 .article-board .board-notice .board-tag-txt {width: 48px;}');
                addstyle('.skin-1080 .article-board .board-name .inner_name .link_name {text-align: center;}');
                addstyle('.skin-1080 .article-board .board-number .inner_number {border-right: 1px solid rgb(226, 226, 226); text-align: center;}');
                addstyle('.skin-1080 .article-board .td_likes {border-left: 1px solid rgb(226, 226, 226);}');
                addstyle('.skin-1080 .article-board .board-list .cmt {color: #065093 !important;}');
                addstyle('.skin-1080 .article-board .board-list .answer {color: #065093;}');
                addstyle('.skin-1080 .article-board .board-list .ico-q {color: #065093;}');
                addstyle('.skin-1080 .article-board .board-list .p_cafebook {color: #065093;}');
                addstyle('.skin-1080 .article-board .board-list .reply_del {color: #065093;}');
                addstyle('.skin-1080 .article-board .board-list .reply_txt {color: #065093;}');
                addstyle('.skin-1080 .article-board .board-list .reply_txt:after {border-color: #065093 transparent transparent transparent;}');
                addstyle('.skin-1080 .article-board .board-list .reply_txt.is_selected:after {border-color: transparent transparent #065093 transparent;}');
                addstyle('.skin-1080 .article-board .pers_nick_area .p-nick {white-space: nowrap;	overflow: hidden;	text-overflow: ellipsis;	border-left: 1px solid rgb(226, 226, 226);	border-right: 1px solid rgb(226, 226, 226);	text-align: center;}');
                addstyle('.skin-1080 .article-board .pers_nick_area .p-nick a {text-align: center;}');
                addstyle('.skin-1080 .article_list_message .message {color: #616161;}');
                addstyle('.skin-1080 .article-album-sub .reply {color: #065093;}');
                addstyle('.skin-1080 .article-album-sub .price {color: #065093;}');
                addstyle('.skin-1080 .article-album-movie-sub .tit_area .reply {color: #065093;}');
                addstyle('.skin-1080 .article-movie-sub .tit_area .reply {color: #065093;}');
                addstyle('.skin-1080 .article-tag .list_tag .tit_area .cmt {color: #065093;}');
                addstyle('.skin-1080 .article-intro .box_history .fileview .txt_file {color: #065093;}');
                addstyle('.skin-1080 .board-notice.type_required .article, .skin-1080 .board-notice.type_main .article {color: #065093;}');
                addstyle('.skin-1080 .board-notice.type_required .cmt, .skin-1080 .board-notice.type_main .cmt {	color: #065093;}');
                addstyle('.skin-1080 .board-notice.type_required .board-tag-txt, .skin-1080 .board-notice.type_main .board-tag-txt {	border: 1px solid #065093;	background-color: #065093;	color: #fff;}');
                addstyle('.skin-1080 .board-notice.type_menu .article {	color: #065093;}');
                addstyle('.skin-1080 .board-notice.type_menu .cmt {	color: #065093;}');
                addstyle('.skin-1080 .board-notice.type_menu .board-tag-txt {	border: 1px solid #065093;	background-color: #065093;	color: #fff;}');
                addstyle('.skin-1080 .com .box-w .group-mlist .tcol-p {	color: #065093;}');
                addstyle('.skin-1080 .prev-next a.on {background-color: #065093;color: #fff;}');
                addstyle('.skin-1080#main-area .bg-color {	background-color: #eaea00;}');
                addstyle('.skin-1080#main-area .m-tcol-c {	color: #000;}');
                addstyle('.skin-1080#main-area .m-tcol-p {	color: #065093;}');
                addstyle('.skin-1080#main-area .article-album-sub {	border-bottom: 1px solid #ff0000;}');
                addstyle('.skin-1080 .article-board thead th {border-bottom-color: #e2e2e2;}');
                addstyle('.skin-1080 .article-board tbody td {border-color: #e2e2e2; !important}');
                addstyle('.skin-1080 .ia-info-btn .link_chat {display: none;}');
                addstyle('.ModalLayer .layer_commerce_content .cate_box .category_list li.selected .btn {    color: #065093}');
                addstyle('.ModalLayer .layer_schedule_content .register .btn_add_map.active {    color: #065093}');
                addstyle('.BaseButton .svg-icon.icon-solid-writing { color: #fff;}');
                addstyle('.BaseButton--skinGreen {    background: #065093;    color: #ffffff;}');
                addstyle('.BaseButton--greenMain {    background: #065093;}');
                addstyle('.ArticleTitle .link_board {    color: #065093}');
                addstyle('.WriterInfo .profile_info .subscript_area .btn_subscript {color: #ffffff;}');
                addstyle('.LoadingSquare .dot{background: #065093;}');
                addstyle('.SubscribeButton .ToggleSwitch .switch_input:checked+.switch_slider {    background-color: #065093}');
                addstyle('.CommentBox .comment_list .comment_nick_box .comment_nick_info .comment_info_date {    right: 0 !important;}');
                addstyle('.ToggleButton .checkbox:checked+.label .bg_track[data-v-d8e678f2] {  background-color: #065093}');
                addstyle('.vote_check .label_box .vote_rate .rate_bar[data-v-74c2a70c] {background-color: #065093;}');
                addstyle('.vote_check .label_box .vote_rate .txt[data-v-74c2a70c] {color: #065093;}');
                addstyle('.CafeCustomVote .cafe_vote_view .cafe_vote_list .vote_check .label_box .vote_rate .rate_bar[data-v-4f21a8f4] {background-color: #065093;}');
                addstyle('.CafeCustomVote .cafe_vote_view .cafe_vote_list .vote_check .label_box .vote_rate .txt[data-v-4f21a8f4] {color: #065093;}');
                addstyle('.CafeViewer .CafeCustomVote .cafe_vote_view .cafe_vote_list .vote_check .label_box .vote_rate .rate_bar {background-color: #065093;}');
                addstyle('.CafeViewer .CafeCustomVote .cafe_vote_view .cafe_vote_list .vote_check .label_box .vote_rate .txt {color: #065093;}');
                addstyle('.CafeViewer .CafeCustomSchedule .cafe_schedule_view .cafe_schedule_view_title .cafe_schedule_view_important {    color: #065093}');
                addstyle('.CafeViewer .CafeCustomSchedule .cafe_schedule .cafe_schedule_title .cafe_schedule_important {  color: #065093}');
                addstyle('.CafeViewer .se-viewer .BaseButton--greenMain {    background: #065093;}');
                addstyle('.FormSelectBox .select_option .item[aria-selected=true] .option {    color: #065093}');
                addstyle('.TimePicker .layer_select_time .time_item[aria-selected=true] .selectbox_item_button {    color: #065093}');
                addstyle('.CalendarSelectBox .vdp-datepicker .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).day:hover,.CalendarSelectBox .vdp-datepicker .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).month:hover,.CalendarSelectBox .vdp-datepicker .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).year:hover {color: #065093}');
                addstyle('.LoadingRing .box {border-color: #065093 transparent transparent transparent;}');
                addstyle('.SelectRegion .select_city_header .city_button.selected {    color: #065093}');
                addstyle('.SelectRegion .select_city_content .region_list li.selected .btn {    color: #065093}');
                addstyle('.comm_layer2.npay_guide_layer .box_area .go {color: #065093!important}');
                addstyle('.layernotice .btns .link_confirm {    color: #065093}');
                addstyle('.ModalLayer .layer_commerce_safety_guide .deal_thead .safety_deal_step {color: #065093}');
                addstyle('.PurchaseButton .purchase_chat .chat_coach_mark {background-color: #065093;}');
                addstyle('.SaleInfo .ProductName .SaleLabel.reservation_escrow,.SaleInfo .ProductName .SaleLabel.safety {    color: #065093}');
                addstyle('.RelatedArticles .tit_area b {    color: #065093}');
                addstyle('.MemberOnlyArticleGuide .tit_guide .emph {    color: #065093}');
                addstyle('.MemberOnlyArticleGuide .txt_cafe {color: #065093;}');
                addstyle('.LayerPopup .temporary_message .lds-ring div {border: 2px solid #065093; border-color: #065093 transparent transparent transparent}');
                addstyle('.WriterInfo .profile_info .subscript_area .btn_subscript {background: #065093};');
                addstyle('.RelatedArticles .tit_area .num {color: #065093;}');
                addstyle('.WriterInfo .profile_info .link_talk {display:none;)');
                addstyle('.ArticleContentBox .article_writer {display:none}');
                addstyle('.article-board .board-list .cmt { color: #065093}');
                addstyle('.list-i-new { display: none}');
                addstyle('.article-board .th_name {text-align: center;}');
                addstyle('.article-board .td_article {padding-left: 0px;	padding-right: 2px;}');
                addstyle(".article-board .td_view {border-left: 1px solid rgb(226, 226, 226);}");
                addstyle('.article-board .board-tag {padding-left: 8px; padding-right: 15px;}');
                addstyle('.article-board .board-name {padding: 0 10px 0 0;}');
                addstyle('.article-board .board-name .inner_name {border-right: 1px solid rgb(226, 226, 226); text-align: center;}');
                addstyle('.article-board .board-notice .board-tag-txt {width: 48px;}');
                addstyle('.article-board .board-name .inner_name .link_name {text-align: center;}');
                addstyle('.article-board .board-number .inner_number {border-right: 1px solid rgb(226, 226, 226); text-align: center;}');
                addstyle('.article-board .td_likes {border-left: 1px solid rgb(226, 226, 226);}');
                addstyle('.article-board .board-list .cmt {color: #065093 !important;}');
                addstyle('.article-board .board-list .answer {color: #065093;}');
                addstyle('.article-board .board-list .ico-q {color: #065093;}');
                addstyle('.article-board .board-list .p_cafebook {color: #065093;}');
                addstyle('.article-board .board-list .reply_del {color: #065093;}');
                addstyle('.article-board .board-list .reply_txt {color: #065093;}');
                addstyle('.article-board .board-list .reply_txt:after {border-color: #065093 transparent transparent transparent;}');
                addstyle('.article-board .board-list .reply_txt.is_selected:after {border-color: transparent transparent #065093 transparent;}');
                addstyle('.article-board .pers_nick_area .p-nick {white-space: nowrap;	overflow: hidden;	text-overflow: ellipsis;	border-left: 1px solid rgb(226, 226, 226);	border-right: 1px solid rgb(226, 226, 226);	text-align: center;}');
                addstyle('.article-board .pers_nick_area .p-nick a {text-align: center;}');
                addstyle('.article_list_message .message {color: #616161;}');
                addstyle('.article-album-sub .reply {color: #065093;}');
                addstyle('.article-album-sub .price {color: #065093;}');
                addstyle('.article-album-movie-sub .tit_area .reply {color: #065093;}');
                addstyle('.article-movie-sub .tit_area .reply {color: #065093;}');
                addstyle('.article-tag .list_tag .tit_area .cmt {color: #065093;}');
                addstyle('.article-intro .box_history .fileview .txt_file {color: #065093;}');
                addstyle('.board-notice.type_required .article, .board-notice.type_main .article {color: #065093;}');
                addstyle('.board-notice.type_required .cmt, .board-notice.type_main .cmt {	color: #065093;}');
                addstyle('.board-notice.type_required .board-tag-txt, .board-notice.type_main .board-tag-txt {	border: 1px solid #065093;	background-color: #065093;	color: #fff;}');
                addstyle('.board-notice.type_menu .article {	color: #065093;}');
                addstyle('.board-notice.type_menu .cmt {	color: #065093;}');
                addstyle('.board-notice.type_menu .board-tag-txt {	border: 1px solid #065093;	background-color: #065093;	color: #fff;}');
                addstyle('.com .box-w .group-mlist .tcol-p {	color: #065093;}');
                addstyle('.prev-next a.on {background-color: #065093;color: #fff;}');
                addstyle('.article-board thead th {border-bottom-color: #e2e2e2;}');
                addstyle('.article-board tbody td {border-color: #e2e2e2; !important}');
                addstyle('.ArticleBoardWriterInfo {white-space: nowrap;	overflow: hidden;	text-overflow: ellipsis;	border-left: 1px solid rgb(226, 226, 226);	border-right: 1px solid rgb(226, 226, 226);	text-align: center;}');
                addstyle('.RelatedArticles .tit_area .new-12-x-12 {display: none}');
                addstyle('.RelatedArticles .tit_area .svg-icon.list_attach_img {display: none}');
                addstyle('.RelatedArticles .tit_area .svg-icon.list_attach_video {display: none}');
                addstyle('.RelatedArticles .member_area {padding-left: 0; text-align: center; border-left: 1px solid rgb(226, 226, 226);	border-right: 1px solid rgb(226, 226, 226);}');
                addstyle('.RelatedArticles .date_area {padding-right: 16px;}');
                addstyle('.RelatedArticles .list_item:first-child {border-top: 1px solid #e2e2e2;}');
                addstyle('.TabButton .tab_btn[aria-selected=true] {background-color: #065093;	color: #fff;}');
                addstyle('.article_profile .article {font-weight: 500;}');
                addstyle('.article_profile .td_article {padding: 3px 2px 2px 4px;}');
                addstyle('.article_profile .td_date,.article_profile .td_view {border-left: 1px solid rgb(226, 226, 226);}');
                addstyle('.article-board .board-list .inner_list .svg-icon.list_attach_img {display:none}');
                addstyle('.article-board .board-list .inner_list .svg-icon.list_attach_video {display:none}');
                addstyle('.skin-1080 .list-i-img {display:none}');
                addstyle('.skin-1080 .list-i-movie {display:none}');
                addstyle('.skin-1080#main-area .board-box img.tcol-c {background-color: rgba(0, 0, 0, 0)}');
                addstylecon('.skin-1080 .ia-info-btn .link_chat {display:none}');
                addstylecon('.skin-1080 .ia-info-btn .link_chat .new_chatting {display:none}');
                addstyle('.article_profile .list-style .link_sort.on {color: #065093}');
                addstyle('.article_profile .list-style .link_sort.on:after {background-color: #065093}');
                addstyle('.article_profile .board-list .cmt {font-weight: bold;}');
                addstyle('.skin-1080 .article-board .board-list .search_word {	color: #065093;}');
            }
        }

        try{
            await imageenlarger();
        }catch{};
    }, 1);});




    async function imageenlarger() {
        if(GM_getValue('tgdskin', true)) await styleadding();
        console.log(GM_getValue('star'));
        console.log(GM_getValue('tgdskin'));
        if(GM_getValue('star') == true || GM_getValue('tgdskin') == true ){
            console.log("OK");
            await addiconstar();
            await inkilist();
        }
        await console.log("wait for imageenlarger");
        var loadd = await getcommentlist();
        await console.log(loadd);
        await console.log("start imageenlarger");
        await setTimeout(async function() {
            z = document.createElement('style');
            z.innerHTML ='.CommentBox .comment_list .CommentItemImage .comment_image_link .image {    max-width: 100%;    max-height: 100%;    vertical-align: top; border-radius: 0%}';
            document.querySelector('#cafe_main').contentWindow.document.body.appendChild(z);
            let a = await document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
            await console.log("초기 댓글 늘리는 중...");
            var waittime = 200
            if(stop==0){
                if(a.length==0){
                    waittime+=500;
                }
                a.forEach((element) => {
                    if (element.firstChild.src == "" || element.firstChild.src.startsWith("https://cafe.naver.com")){
                        console.log("wait");
                        waittime = waittime + 50;
                        a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                    }
                });
                console.log(waittime);
                setTimeout(await function(){
                    a = document.querySelector('#cafe_main').contentWindow.document.querySelectorAll('.comment_image_link');
                    enableRightClick(document.querySelector('#cafe_main').contentWindow.document);
                    a.forEach((element) => {
                        if(element.firstChild.currentSrc.includes("_gif")==true){element.firstChild.currentSrc = element.firstChild.currentSrc.replaceAll("?type=mc250_375_gif","");}
                        if(element.firstChild.src.includes("_gif")==true){element.firstChild.src = element.firstChild.src.replaceAll("?type=mc250_375_gif","");}
                        element.firstChild.currentSrc = element.firstChild.currentSrc.replaceAll("?type=mc250_375","");
                        element.firstChild.src = element.firstChild.src.replaceAll("?type=mc250_375","");
                        //console.log(element.firstChild.outerHTML);
                    });
                    console.log(a);
                    console.log("enlarge picture");
                },waittime);
            }
            var idxintvf = 0;
            var intvf = await setInterval(async function() {
                try{
                    comnum = await document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName('button_comment')[0].getElementsByClassName('num')[0].innerHTML;
                }catch{
                    idxintvf+=1;
                    if(idxintvf>100) await clearInterval(intvf);
                    return false;}
                //when element is found, clear the interval.
                console.log("comnum found");
                console.log(comnum);
                //await sleep(500);
                await clearInterval(intvf);
                await console.log(comnum);
                //await console.log("eeeeeeeeeeeeeeeeeeeeeeeee");
                await addbutton();
                await console.log("버튼추가");
                await console.log("adding observer..");
                await addObserverIfDesiredNodeAvailable();
            }, 100);

        }, 100);
    }


    async function bestcomment(){
        try{
            let d = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("CommentItem");
            let newnu = d.length;
            var bestwait = 200;

            for(let idx=0; idx<newnu; idx++){
                if(d[idx].getElementsByClassName("u_cnt _count")[0].innerText == ""){
                    bestwait += 30;
                }
            }
            console.log(d);
            var bestcoms = [];
            var comlikenums = [];
            setTimeout(function(){
                try{
                    if(document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("comment_tab_button")[0].id=="BESTCOM") return;
                }catch{}
                for(let idx=0; idx<newnu; idx++){
                    console.log(d[idx].getElementsByClassName("u_cnt _count")[0].innerText);
                    if(Number(d[idx].getElementsByClassName("u_cnt _count")[0].innerText)>=5)
                    {
                        console.log("인기!");
                        console.log(d[idx]);
                        var inkicom = d[idx].cloneNode(true);
                        inkicom.style="background: #fff4ea !important;";
                        let f = document.createElement("span");
                        f.style="background-color: rgb(217, 83, 79); display: inline; padding: 0.2em 0.6em 0.3em; font-size: 75%; font-weight: 700; line-height: 1; color: rgb(255, 255, 255); text-align: center; white-space: nowrap; vertical-align: baseline; border-radius: 0.25em;";
                        f.innerText = "BEST";
                        inkicom.getElementsByClassName("comment_nick_info")[0].prepend(f);
                        try{
                            inkicom.getElementsByClassName("comment_info_button")[0].remove();
                            inkicom.getElementsByClassName("comment_tool_button")[0].remove();
                        }catch{
                            if(document.getElementsByClassName("cafe-write-btn")[0].innerText!='카페 가입하기') return 0;
                        };
                        bestcoms[Number(d[idx].getElementsByClassName("u_cnt _count")[0].innerText)*1000+idx]=inkicom;
                        //comlikenums.push(Number(d[idx].getElementsByClassName("u_cnt _count")[0].innerText));
                    }
                }
                console.log(bestcoms);
                //comlikenums.sort(function(a, b){return b - a;});
                //console.log(comlikenums);
                var bestcomthree = 2;
                let threebestcoms = [];
                for(let idx=bestcoms.length-1;idx>0;idx--){
                    if(bestcoms[idx]==null) continue;
                    threebestcoms[bestcomthree] = bestcoms[idx];
                    bestcomthree-=1;
                    if(bestcomthree<0) break;
                }
                for(let idx=0;idx<3;idx++){
                    if(threebestcoms[idx]==null) continue;
                    let e = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("comment_list")[0];
                    e.prepend(threebestcoms[idx]);
                }
                document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("comment_tab_button")[0].id="BESTCOM";
            },bestwait);
        }catch{}
    }


    async function styleadding(){
        console.log("start styleadding");
        var ggg = 0;
        var kkk = 0;
        var gggg = 0;
        var ggggg = 0;

        try{
            let a = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("list-i-new")
            newnum = a.length;
            //console.log(a)
            gggg = newnum;
            console.log(gggg);
            for(let idx=0; idx<newnum; idx++){
                a[idx].remove()
            }
            let b = document.getElementsByClassName("ico_new")
            newnum = b.length
            //console.log(newnum);
            //console.log(b)
            for(let idx=0; idx<newnum; idx++){
                b[idx].remove()
            }
            let c = document.querySelector('#cafe_main').contentWindow.document.getElementsByTagName("img")
            newnum = c.length
            //console.log(newnum);
            //console.log(c)
            for(let idx=0; idx<newnum; idx++){
                //console.log(c[idx]);
                if (c[idx] != undefined) if (c[idx].src == "https://ssl.pstatic.net/static/cafe/cafe_pc/icon_board_new.png") c[idx].remove();
            }
            try{
                let d = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("p-nick")
                newnum = d.length
                //console.log(newnum);
                //console.log(d)
                for(let idx=0; idx<newnum; idx++){
                    //console.log(d[idx].childNodes[1])
                    if(d[idx].childNodes[1].getElementsByTagName("img")[0].src == "https://cafe.pstatic.net/levelicon/1/6_999.gif"){
                        d[idx].childNodes[1].getElementsByTagName("img")[0].src="https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/1";
                        d[idx].childNodes[1].getElementsByTagName("img")[0].height = 15;
                        d[idx].childNodes[1].getElementsByTagName("img")[0].width = 15;
                        d[idx].prepend(d[idx].childNodes[1]);
                    }
                    else{
                        if(GM_getValue('memlevel')==false){
                            d[idx].childNodes[1].remove()
                        }
                    }
                }}catch{};
            setTimeout(function(){
                let d2 = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("icon_level")
                newnum = d2.length
                //console.log(newnum);
                //console.log(d2)
                for(let idx=0; idx<newnum; idx++){
                    //console.log(d2[idx].style.backgroundImage)
                    if(d2[idx].style.backgroundImage == "url(\"https://ca-fe.pstatic.net/web-section/static/img/sprite_levelicon_9dbde2.svg#6_999-usage\")"){
                        let z = document.createElement('img');
                        z.src = "https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/1";
                        document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("nick_box")[0].prepend(z);
                    }
                }
            },1000);
            //for(let idx=0; idx<newnum; idx++){
            //console.log(d[idx].childNodes[1])
            //}

            try{
                setTimeout(function(){
                    try{
                        let d = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("board-box")[0].getElementsByClassName("inner_list");
                        let e = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("board-box")[0].getElementsByClassName("board-tag type_dot")
                        var dnewnum = d.length
                        //console.log(dnewnum);
                        //console.log(e);
                        var offset = dnewnum - e.length;
                        //console.log(d);
                        for(let idx=0; idx<dnewnum; idx++){
                            try{
                                //console.log(d[idx].childNodes);
                                let nnum = d[idx].childNodes.length;
                                let ot = 0;
                                let om = 0;
                                let ir = 10;
                                let mr = 10;
                                for(let idxx=0; idxx<nnum; idxx++){
                                    try{

                                        //console.log(d[idx].childNodes[idxx]);


                                        if(d[idx].childNodes[idxx].getElementsByClassName("list-i-img").length!=0){
                                            //d[idx].prepend(d[idx].childNodes[idxx]);
                                            //console.log("이미지");
                                            ot+=1;
                                            ir = idxx;
                                        }
                                        else if(d[idx].childNodes[idxx].getElementsByClassName("list-i-movie").length!=0){
                                            //d[idx].prepend(d[idx].childNodes[idxx]);
                                            om+=1;
                                            mr = idxx;
                                        }

                                        if(om>0){
                                            e[idx-offset].childNodes[0].src = "https://raw.githubusercontent.com/ywj515/tgdcafe/main/video.svg"
                                            e[idx-offset].childNodes[0].width="12"
                                            e[idx-offset].childNodes[0].height="12";
                                            e[idx-offset].childNodes[0].style="vertical-align: middle;padding-bottom: 2px;";
                                            idxx = nnum;
                                        }
                                        else if(ot>0){
                                            e[idx-offset].childNodes[0].src = "https://raw.githubusercontent.com/ywj515/tgdcafe/main/image_green.svg"
                                            e[idx-offset].childNodes[0].width="12"
                                            e[idx-offset].childNodes[0].height="12";
                                            e[idx-offset].childNodes[0].style="vertical-align: middle;padding-bottom: 2px;";
                                            idxx = nnum;
                                        }



                                    }catch{}
                                }
                                if(om==0&&ot==0){
                                    e[idx-offset].childNodes[0].src = "https://raw.githubusercontent.com/ywj515/tgdcafe/main/text.svg"
                                    e[idx-offset].childNodes[0].width="12"
                                    e[idx-offset].childNodes[0].height="12";
                                    e[idx-offset].childNodes[0].style="vertical-align: middle;padding-bottom: 2px;";
                                }

                            }catch{}
                        }}catch{}

                },100)}catch{}



            await inkilist();



            try{
                let d = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("BoardBottomOption")[0].getElementsByClassName("btn number")
                newnum = d.length
                //console.log(newnum);
                console.log(d)
                for(let idx=0; idx<newnum; idx++){
                    let nnum = d[idx].childNodes.length;
                    let ot = 0;
                    let om = 0;
                    let ir = 10;
                    let mr = 10;
                    for(let idxx=0; idxx<nnum; idxx++){
                        if(d[idx].childNodes[idxx].className == "list-i-img"){
                            //d[idx].prepend(d[idx].childNodes[idxx]);
                            ot+=1;
                            ir = idxx;
                        }
                        if(d[idx].childNodes[idxx].className == "list-i-movie"){
                            //d[idx].prepend(d[idx].childNodes[idxx]);
                            om+=1;
                            mr = idxx;
                        }
                    }
                    if(mr!=10){
                        d[idx].removeChild(d[idx].childNodes[mr]);
                    }
                    if(ir!=10){
                        d[idx].removeChild(d[idx].childNodes[ir]);
                    }
                    if(om>0){
                        let z = document.createElement('img');
                        z.src = "https://raw.githubusercontent.com/ywj515/tgdcafe/main/video.svg"
                        z.width="12"
                        z.height="12";
                        z.style="vertical-align: middle;padding-bottom: 2px;";
                        d[idx].prepend(z);
                    }
                    else if(ot>0){
                        let z = document.createElement('img');
                        z.src = "https://raw.githubusercontent.com/ywj515/tgdcafe/main/image_green.svg"
                        z.width="12"
                        z.height="12";
                        z.style="vertical-align: middle;padding-bottom: 2px;";
                        d[idx].prepend(z);
                    }
                    else{
                        let z = document.createElement('img');
                        z.src = "https://raw.githubusercontent.com/ywj515/tgdcafe/main/text.svg"
                        z.width="12"
                        z.height="12";
                        z.style="vertical-align: middle;padding-bottom: 2px;";
                        d[idx].prepend(z);
                    }
                }}catch{}










            //console.log("1차끝")






            try{
                //console.log("test")
                setTimeout(function(){
                    let d = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("RelatedArticlesList")[0].getElementsByClassName("list_item")
                    newnum = d.length
                    //console.log(newnum);
                    ////console.log(d);
                    ////console.log(newnum);
                    for(let idx=0; idx<newnum; idx++){
                        try{
                            d[idx].childNodes[0].getElementsByTagName("img")[0].remove();
                        }catch{}
                        try{
                            let svgicon = d[idx].childNodes[0].getElementsByTagName("svg")[0].className.baseVal;
                            let ot = 0;
                            let om = 0;
                            //console.log(svgicon)
                            if(svgicon == "svg-icon list_attach_img"){
                                //console.log("adding img")
                                //d[idx].prepend(d[idx].childNodes[idxx]);
                                ot+=1;
                            }
                            if(svgicon == "svg-icon list_attach_video"){
                                //d[idx].prepend(d[idx].childNodes[idxx]);
                                om+=1;
                            }
                            if(om>0){
                                //d[idx].childNodes[0].getElementsByTagName("svg")[0].remove();
                                let z = document.createElement('img');
                                z.src = "https://raw.githubusercontent.com/ywj515/tgdcafe/main/video.svg"
                                z.width="12"
                                z.height="12";
                                z.style="vertical-align: middle;padding-bottom: 2px;";
                                d[idx].childNodes[0].prepend(z);
                            }
                            else if(ot>0){
                                //d[idx].childNodes[0].getElementsByTagName("svg")[0].remove();
                                let z = document.createElement('img');
                                z.src = "https://raw.githubusercontent.com/ywj515/tgdcafe/main/image_green.svg"
                                z.width="12"
                                z.height="12";
                                z.style="vertical-align: middle;padding-bottom: 2px; padding-right: 2px";
                                d[idx].childNodes[0].prepend(z);
                            }
                            else{
                                let z = document.createElement('img');
                                z.src = "https://raw.githubusercontent.com/ywj515/tgdcafe/main/text.svg"
                                z.width="12"
                                z.height="12";
                                z.style="vertical-align: middle;padding-bottom: 2px; padding-right: 2px";
                                d[idx].childNodes[0].prepend(z);
                            }
                        }catch{
                            let z = document.createElement('img');
                            z.src = "https://raw.githubusercontent.com/ywj515/tgdcafe/main/text.svg"
                            z.width="12"
                            z.height="12";
                            z.style="vertical-align: middle;padding-bottom: 2px; padding-right: 2px";
                            d[idx].childNodes[0].prepend(z);
                            continue;
                        }
                    }
                },1000);
                setTimeout(function(){
                    try{
                        for(let iii=0; iii<3; iii++){
                            console.log("글목록 버튼..3");
                            console.log(document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("paginate_area")[0].getElementsByClassName("ArticlePaginate")[0].getElementsByClassName("btn number"));
                            document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("paginate_area")[0].getElementsByClassName("ArticlePaginate")[0].getElementsByClassName("btn number")[iii].addEventListener("click", async function(){
                                let d = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName("RelatedArticlesList")
                                setTimeout(function(){
                                    console.log("글목록 다시 불러오기");
                                    console.log("test")

                                    d = d[0].getElementsByClassName("list_item")
                                    newnum = d.length
                                    ////console.log(d);
                                    ////console.log(newnum);

                                    for(let idx=0; idx<newnum; idx++){
                                        try{
                                            //d[idx].childNodes[0].getElementsByTagName("img")[0].remove();
                                        }catch{}
                                        try{
                                            let svgicon = d[idx].childNodes[0].getElementsByTagName("svg")[0].className.baseVal;
                                            let ot = 0;
                                            let om = 0;
                                            //console.log(svgicon)
                                            if(svgicon == "svg-icon list_attach_img"){
                                                console.log("adding img")
                                                //d[idx].prepend(d[idx].childNodes[idxx]);
                                                ot+=1;
                                            }
                                            if(svgicon == "svg-icon list_attach_video"){
                                                //d[idx].prepend(d[idx].childNodes[idxx]);
                                                om+=1;
                                            }
                                            if(om>0){
                                                d[idx].childNodes[0].getElementsByTagName("img")[0].src = "https://raw.githubusercontent.com/ywj515/tgdcafe/main/video.svg"
                                            }
                                            else if(ot>0){
                                                d[idx].childNodes[0].getElementsByTagName("img")[0].src = "https://raw.githubusercontent.com/ywj515/tgdcafe/main/image_green.svg"
                                            }
                                            else{
                                                d[idx].childNodes[0].getElementsByTagName("img")[0].src = "https://raw.githubusercontent.com/ywj515/tgdcafe/main/text.svg"
                                            }
                                        }catch{
                                            d[idx].childNodes[0].getElementsByTagName("img")[0].src = "https://raw.githubusercontent.com/ywj515/tgdcafe/main/text.svg"
                                        }
                                    }
                                },300);
                            })
                        }}catch{}
                },2000);}catch{}

            //console.log("2차시작")





        }catch{}
    }















    function ifDesiredNodeAvailable(classname) {
        let composeBox = document.querySelector('#cafe_main').contentWindow.document.getElementsByClassName(classname);
        if(!composeBox[0]) {
            composeBox = setTimeout(ifDesiredNodeAvailable(classname),1000);
            return composeBox;
        }
        //console.log(composeBox);

        return composeBox;
    }

    function addstyle(config){
        let z = document.createElement('style');
        z.innerHTML = config;
        document.querySelector('#cafe_main').contentWindow.document.body.appendChild(z);
    }

    function addstylecon(config){
        let z = document.createElement('style');
        z.innerHTML = config;
        document.getElementById("content-area").appendChild(z);
    }

    function addstylebody(config){
        let z = document.createElement('style');
        z.innerHTML = config;
        document.getElementById("cafe-body").appendChild(z);
    }

    function addstylerbody(config){
        let z = document.createElement('style');
        z.innerHTML = config;
        document.body.appendChild(z);
    }
} else {
    console.log('다른 사이트에서는 실행되지 않음.');
}
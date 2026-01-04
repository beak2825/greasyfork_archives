// ==UserScript==
// @name         【自用】优书网-起点-优书网-阅次元-搜书吧-好书友-矽统-Pixiv联动
// @version      1.26
// @description  需要配合优书网 <=> 知轩藏书 一起使用
// @author       myself
// @match        https://www.yousuu.com/*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @match        https://www.abooky.com/*
// @exclude      https://www.yousuu.com/user*
// @match        https://sis001.com/forum/search.php*
// @match        https://sexinsex.net/bbs/search.php*
// @match        http://sexinsex.net/bbs/search.php*
// @match        https://www.pixiv.net/novel/show.php?id=*
// @match        https://www.95yuedu.com/search.php?mod=forum&adv=yes*
// @match        https://www.manlou99.com/search.php?mod=forum&adv=yes*
// @namespace none
// @match        https://*.qidian.com/*
// @grant        GM_openInTab
// @icon         https://inews.gtimg.com/newsapp_bt/0/12771684245/1000

// @match        https://www.jan.mmss888.com/*

// @downloadURL https://update.greasyfork.org/scripts/445743/%E3%80%90%E8%87%AA%E7%94%A8%E3%80%91%E4%BC%98%E4%B9%A6%E7%BD%91-%E8%B5%B7%E7%82%B9-%E4%BC%98%E4%B9%A6%E7%BD%91-%E9%98%85%E6%AC%A1%E5%85%83-%E6%90%9C%E4%B9%A6%E5%90%A7-%E5%A5%BD%E4%B9%A6%E5%8F%8B-%E7%9F%BD%E7%BB%9F-Pixiv%E8%81%94%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/445743/%E3%80%90%E8%87%AA%E7%94%A8%E3%80%91%E4%BC%98%E4%B9%A6%E7%BD%91-%E8%B5%B7%E7%82%B9-%E4%BC%98%E4%B9%A6%E7%BD%91-%E9%98%85%E6%AC%A1%E5%85%83-%E6%90%9C%E4%B9%A6%E5%90%A7-%E5%A5%BD%E4%B9%A6%E5%8F%8B-%E7%9F%BD%E7%BB%9F-Pixiv%E8%81%94%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //如果搜书吧域名更换失效请自行替换，以及上面@match里的内容
    var soushu555=`https://www.jan.mmss888.com/`

    function searchbook(book, key){
        if(book.length==0) return
        let urlAbooky=`https://www.abooky.com/search.php?mod=forum&adv=yes&search_value=${book}#SearchYousuu`
        let urlShoushu=`${soushu555}search.php?mod=forum&adv=yes&search_value=${book}#SearchYousuu`
        let urlhaoshuyou=`https://www.manlou99.com/search.php?mod=forum&adv=yes&search_value=${book}#SearchYousuu`
        let urlwoaixunlei=`https://www.95yuedu.com/search.php?mod=forum&adv=yes&search_value=${book}#SearchYousuu`

        if(key & 0b1000){GM_openInTab(urlwoaixunlei, true);}
        if(key & 0b0100){GM_openInTab(urlhaoshuyou, true);}
        if(key & 0b0010){GM_openInTab(urlShoushu, true);}
        if(key & 0b0001){GM_openInTab(urlAbooky, true);}
    }

    function searchbookinSIS(book, key){
        if(book.length==0) return
        let urlSIS=`https://sis001.com/forum/search.php?search_value=${book}#SearchYousuu`
        let urlSES=`http://sexinsex.net/bbs/search.php?search_value=${book}#SearchYousuu`
        if(key&1){GM_openInTab(urlSIS, true);}
        if(key&2){GM_openInTab(urlSES,true);}
    }

    function searchbookinPix(book){
        if(book.length==0) return
        let urlPix=`https://www.pixiv.net/tags/中文%20${book}/novels?s_mode=s_tag`
        GM_openInTab(urlPix,true);
    }

    function removeSign(book){
        book = book.split('#')[0]
        return book.replaceAll('<','').replaceAll('>','').replaceAll('《','').replaceAll('》','')
    }


    if(location.href.indexOf('yousuu')!=-1 ){
        document.querySelector("#app > header > nav > a").target='_blank'
        document.querySelector("#app > header > nav > div.navbar-main-wrap.hidden-sm-and-down > div.navbar-main > a:nth-child(3)").remove()
        document.querySelector("#app > header > nav > div.navbar-main-wrap.hidden-sm-and-down > div.navbar-main > a:nth-child(4)").remove()

        $("#app > header > nav > div.navbar-main-wrap.hidden-sm-and-down > div.navbar-main").width("420")
        document.querySelector("#app > header > nav > div.navbar-main-wrap.hidden-sm-and-down > div.navbar-main").style.margin="10.5px"
        $('.navbar-main> a:nth-child(3)').after(`<a  data-v-b927be14="">关注</a>`)
        $('.navbar-main').append(`<a  data-v-b927be14="">阅次元</a>`)
        $('.navbar-main').append(`<a  data-v-b927be14="">搜书吧</a>`)
        $('.navbar-main').append(`<a  data-v-b927be14="">矽统</a>`)
        $('.navbar-main').append(`<a  data-v-b927be14="">pixiv</a>`)
        $('.navbar-main').append(`<a  data-v-b927be14="">贴吧</a>`)


        document.querySelector("#app > header > nav > div.navbar-main-wrap.hidden-sm-and-down > div.navbar-main > a:nth-child(4)").innerText='关注'
        document.querySelector("#app > header > nav > div.navbar-main-wrap.hidden-sm-and-down > div.navbar-main > a:nth-child(4)").onclick=()=>{
            window.location.href='https://www.yousuu.com/explore?myfeeds=true'
        }
        document.querySelector("#app > header > nav > div.navbar-main-wrap.hidden-sm-and-down > div.navbar-main > a:nth-child(6)").onclick=()=>{
            let book = getCurrentInput()
            book = book.length!=0?book:getCurrentPageBook();
            searchbook(book,0b0001)
        }
        document.querySelector("#app > header > nav > div.navbar-main-wrap.hidden-sm-and-down > div.navbar-main > a:nth-child(7)").onclick=()=>{
            let book = getCurrentInput()
            book = book.length!=0?book:getCurrentPageBook();
            searchbook(book,0b0010)
        }
        document.querySelector("#app > header > nav > div.navbar-main-wrap.hidden-sm-and-down > div.navbar-main > a:nth-child(8)").onclick=()=>{
            let book = getCurrentInput()
            book = book.length!=0?book:getCurrentPageBook();
            searchbookinSIS(book,3)
        }
        document.querySelector("#app > header > nav > div.navbar-main-wrap.hidden-sm-and-down > div.navbar-main > a:nth-child(9)").onclick=()=>{
            let book = getCurrentInput()
            book = book.length!=0?book:getCurrentPageBook();
            searchbookinPix(book)
        }
        document.querySelector("#app > header > nav > div.navbar-main-wrap.hidden-sm-and-down > div.navbar-main > a:nth-child(10)").onclick=()=>{
            let book = getCurrentInput()
            book = book.length!=0?book:getCurrentPageBook();
            ///searchbook(book,0b1111)
            ///searchbookinSIS(book,3)
            ///searchbookinPix(book)
            GM_openInTab(`https://tieba.baidu.com/f/search/res?ie=utf-8&qw=${book}`, true);
        }

        function getCurrentPageBook(){
            if(location.href.indexOf('book')!=-1 )
                return document.querySelector("head > title").innerText.split(" ")[0]
        }

        function getCurrentInput(){
            return document.querySelector("#app > header > nav > div.navbar-main-wrap.hidden-sm-and-down > div.search-input-wrap > div > input").value;
        }




        if(location.href.indexOf('book')!=-1 ){
            //let element0 = `<label data-v-622f1ef6="" class="tab"><a>NGA</a></label>`
            let element000 = `<label data-v-622f1ef6="" class="tab">
            <a>我爱迅雷</a></label>`
            let element00 = `<label data-v-622f1ef6="" class="tab">
            <a>好书友</a></label>`
            let element = `<label data-v-622f1ef6="" class="tab">
            <a>阅次元</a></label>`
            let element2 = `<label data-v-622f1ef6="" class="tab">
            <a>搜书吧</a></label>`
            let element3 = `<label data-v-622f1ef6="" class="tab">
            <a>全部</a></label>`
            let element0 = `<label data-v-622f1ef6="" class="tab">
            <a>Nga书院</a></label>`
            let elementZ = `<label data-v-622f1ef6="" class="tab">
            <a>龙空</a></label>`
            let elementZ1 = `<label data-v-622f1ef6="" class="tab">
            <a>贴吧</a></label>`
            var timer2 = setInterval(function(){
                if(document.querySelector("#gm-insert-link-content")){
                    $("#gm-insert-link-content > label:nth-child(2)").after(element3).after(element000).after(element00).after(element2).after(element).after(elementZ1).after(element0).after(elementZ)
                    document.querySelector("#gm-insert-link-content > label:nth-child(3)").onclick=()=>{GM_openInTab(`https://www.lkong.com/search/thread/${ getCurrentPageBook()}`, true); }
                    document.querySelector("#gm-insert-link-content > label:nth-child(4)").onclick=()=>{GM_openInTab(`https://nga.178.com/thread.php?key=${ getCurrentPageBook()}&fid=524`, true); }
                    document.querySelector("#gm-insert-link-content > label:nth-child(5)").onclick=()=>{GM_openInTab(`https://tieba.baidu.com/f/search/res?ie=utf-8&qw=${ getCurrentPageBook()}`, true); }
                    document.querySelector("#gm-insert-link-content > label:nth-child(6)").onclick=()=>{searchbook(getCurrentPageBook(),0b0001)}
                    document.querySelector("#gm-insert-link-content > label:nth-child(7)").onclick=()=>{searchbook(getCurrentPageBook(),0b0010)}
                    document.querySelector("#gm-insert-link-content > label:nth-child(8)").onclick=()=>{searchbook(getCurrentPageBook(),0b0100)}
                    document.querySelector("#gm-insert-link-content > label:nth-child(9)").onclick=()=>{searchbook(getCurrentPageBook(),0b1000)}
                    document.querySelector("#gm-insert-link-content > label:nth-child(10)").onclick=()=>{searchbook(getCurrentPageBook(),0b1111)}
                    clearInterval(timer2);
                }
            },100);


        }
    }

    if(location.href.indexOf('#SearchYousuu')!=-1 && location.href.indexOf('mod=forum&adv=yes')!=-1 ){
        let bookname;
        bookname=location.href.split('&')[2].split('#')[0].split('=')[1]
        document.querySelector("#orderby1").selectedIndex=1
        document.querySelector("#srchtxt_1").value=decodeURI(bookname)
        document.querySelector("#ct > div > div > div.bm_c > form > table > tbody > tr:nth-child(8) > td > button").click();
    }


    if(location.href.indexOf('#SearchYousuu')!=-1 && location.href.indexOf('sis001.com/forum/search.php')!=-1 ){
        let bookname;
        bookname=location.href.split('?')[1].split('#')[0].split('=')[1]
        document.querySelector("#orderby1").selectedIndex=1
        document.querySelector("#srchtxt").value=decodeURI(bookname)
        let row=[7,8,0,0]
        let col=[10,10,14,15]
        for(let i =0; i<row.length;i++){
            if(row[i]!=0){
                document.querySelector(`#srchfid > optgroup:nth-child(${col[i]}) > option:nth-child(${row[i]})`).selected=true
            }else{
                let parentNode= document.querySelector(`#srchfid > optgroup:nth-child(${col[i]}`).childNodes;
                parentNode.forEach((childNode)=>{
                    childNode.selected=true
                });
            }
        }
        document.querySelector(`#wrapper > div:nth-child(1) > form > div > table:nth-child(4) > tbody:nth-child(5) > tr:nth-child(4) > td > button`).click();
    }

    if(location.href.indexOf('#SearchYousuu')!=-1 && location.href.indexOf('sexinsex.net/bbs/search.php')!=-1 ){
        let bookname;
        bookname=location.href.split('?')[1].split('#')[0].split('=')[1]
        document.querySelector("#orderby1").selectedIndex=1
        document.querySelector("#srchtxt").value=decodeURI(bookname)
        let col=[6,6,15,16]
        let row=[1,2,0,6]
        for(let i =0; i<row.length;i++){
            if(row[i]!=0){
                document.querySelector(`#srchfid > optgroup:nth-child(${col[i]}) > option:nth-child(${row[i]})`).selected=true
            }else{
                let parentNode= document.querySelector(`#srchfid > optgroup:nth-child(${col[i]}`).childNodes;
                parentNode.forEach((childNode)=>{
                    childNode.selected=true
                });
            }
        }
        document.querySelector("#wrapper > div:nth-child(1) > form > div > table:nth-child(4) > tbody:nth-child(5) > tr:nth-child(4) > td > button").click();
    }



    if(location.href.indexOf('qidian')!=-1){
        let element =`<em class="third-remove">|</em><a class='third-remove' href="https://www.yousuu.com" target='_blank' data-eid="qd_A182">优书网</a>`
        $('body > div.wrap > div.top-nav > div > div.nav-link.fl').append(element)
        if(location.href.indexOf('chapter')!=-1){
            let bookname=document.querySelector("head > title").innerText.split('_')[0]
            document.querySelector("#j_navGameBtn > a > i > span").innerText='优书网'
            let b = document.querySelector("#j_navGameBtn");
            b.id='mybutton'
            b.href = `https://www.yousuu.com/search/?search_type=title&search_value=${bookname}#TitleSearch`
            b.onclick=()=> {
                GM_openInTab(b.href, true);
            }
            document.querySelector("#j_navGameBtn > a").href="javascript:void(0)"
            document.querySelector("#j_qdGame").remove()
        }
        if(location.href.indexOf('book.qidian.com/info/')!=-1){
            let bookname = document.querySelector("body > div.wrap > div.book-detail-wrap.center990 > div.book-information.cf > div.book-info > h1 > em").innerText;
            let myhref = `https://www.yousuu.com/search/?search_type=title&search_value=${bookname}#TitleSearch`
            $(`body > div.wrap > div.book-detail-wrap.center990 > div.book-information.cf > div.book-info > p.tag`).
            append(`<a href="javascript:void(0)" class="red mybutton">优书网</a>`)
            document.querySelector(".mybutton").onclick=()=>{
                GM_openInTab(myhref, true);
            }
        }

    }


    if(location.href.indexOf('pixiv.net/novel/show.php?id=')!=-1){

        let parentNode = `#root > div:nth-child(2) > div.sc-1nr368f-0.beQeCv > div > div > main > section > div:nth-child(1) > div > div.sc-1u8nu73-14.fHtSaL > div.sc-1u8nu73-16.koHfrS > div`
        let timerKey=0;
        var timer3 = setInterval(function(){

            if($(parentNode)){
                let space = '&nbsp;&nbsp;&nbsp;&nbsp;'
                let article = document.querySelector("#root > div:nth-child(2) > div.sc-1nr368f-0.beQeCv > div > div > main > section > div:nth-child(1) > div > div.sc-1u8nu73-14.fHtSaL > h1")
                let articleDir = document.querySelector("#root > div:nth-child(2) > div.sc-1nr368f-0.beQeCv > div > div > main > section > div:nth-child(1) > div > div.sc-1u8nu73-14.fHtSaL > div:nth-child(2) > a")

                if(article){
                    article = article.innerText
                    let element2 = ` <br/><span class="sc-eoqmwo-0 mTQBy"><a class='myKeyAll'>${article}<a/>${space}<a class='myKeys'>搜<a/>${space}<a class='myKeyy'>阅<a/>${space}<a class='myKeyx'>矽<a/></span>`
                    $(parentNode).append(element2)
                    $('.myKeyAll')[0].onclick=()=>{searchbookinSIS(article,3);searchbook(article,3)}
                    $('.myKeys')[0].onclick=()=>{searchbook(article,2)}
                    $('.myKeyy')[0].onclick=()=>{searchbook(article,1)}
                    $('.myKeyx')[0].onclick=()=>{searchbookinSIS(article,3)}
                    timerKey=1
                }
                if(articleDir){
                    articleDir=removeSign(articleDir.innerText)
                    let element1= ` <br/><span class="sc-eoqmwo-0 mTQBy"><a class='myKeyAll'>${articleDir}<a/>${space}<a class='myKeys'>搜<a/>${space}<a class='myKeyy'>阅<a/>${space}<a class='myKeyx'>矽<a/></span>`
                    $(parentNode).prepend('<br/>').append(element1);
                    $('.myKeyAll')[1].onclick=()=>{searchbookinSIS(articleDir,3);searchbook(articleDir,3)}
                    $('.myKeys')[1].onclick=()=>{searchbook(articleDir,2)}
                    $('.myKeyy')[1].onclick=()=>{searchbook(articleDir,1)}
                    $('.myKeyx')[1].onclick=()=>{searchbookinSIS(articleDir,3)}
                    timerKey=1
                }
                if(timerKey==1){
                    clearInterval(timer3);}
            }
        },100);
    }
})();


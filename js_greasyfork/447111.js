// ==UserScript==
// @name         dsl.sk web theme
// @namespace    http://tampermonkey.net/
// @version      0.7.2
// @description  try to take over the world!
// @author       lmpkoo
// @match        https://www.dsl.sk/*
// @match        https://dsl.sk/*
// @icon         https://www.google.com/s2/favicons?domain=dsl.sk
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447111/dslsk%20web%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/447111/dslsk%20web%20theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PrimaryColor = "peachpuff"
    const SecondaryColor = "aliceblue"

    const url = window.location.href

    if(window.screen.width < 1000){
        document.body.style.margin = '0 10% 0 10%';
    }else if(window.screen.width > 1000){
        document.body.style.margin = '0 25% 0 25%';
    }

   document.body.style.backgroundColor = " ";

    const a = document.getElementsByTagName("a");
     for (let i = 0; i < a.length; i++) {
        a[i].style.textDecoration = "none"
        a[i].style.border = "none"
     }

    const headerInfoText = document.getElementsByClassName("header_info_text")

     for (let i = 0; i <headerInfoText.length; i++) {
         headerInfoText[i].style.background = PrimaryColor
    }

    headerInfoText[0].parentNode.children[1].style.background = PrimaryColor

    const menuLine = document.getElementsByClassName("menu_line")

    for (let i = 0; i <menuLine.length; i++) {
        if(menuLine[i].innerText === "Merania"){
            menuLine[i].style.padding = "4px 0 0 0"
        }

        menuLine[i].style.width = "100%"
        menuLine[i].style.float = "left"
        menuLine[i].addEventListener("mouseenter", mouseEnter);
        menuLine[i].addEventListener("mouseleave", mouseLeave);
        function mouseEnter() {
            menuLine[i].style.color = "blue";
        }

        function mouseLeave() {
            menuLine[i].style.color = "black";
        }
    }

    const articleMenuLine = document.getElementsByClassName("article_menu_line")

    for (let i = 0; i <articleMenuLine.length; i++) {
        articleMenuLine[i].style.fontFamily = "cursive"

        articleMenuLine[i].addEventListener("mouseenter", mouseEnter);
        articleMenuLine[i].addEventListener("mouseleave", mouseLeave);
        function mouseEnter() {
            articleMenuLine[i].style.color = "blue";
        }

        function mouseLeave() {
            articleMenuLine[i].style.color = "black";
        }
    }

    const articleMenu = document.getElementById("article_menu")
    if(articleMenu){
        const article = articleMenu.children[0].children[0].children
        for (let i = 0; i < article.length; i++) {
            article[i].children[1].style.fontSize = "13px"
        }
    }

   const footer = document.getElementById("footer");
    footer.style.backgroundColor = PrimaryColor;
    footer.style.fontSize = "12px";
    footer.style.padding = "12px";
    footer.style.borderTop = "none";
    footer.style.boxShadow = "rgba(50, 50, 93, 0.25) 0px 2px 5px 1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px";
    footer.style.margin = "0 0 0 7px";
    footer.style.fontFamily = "cursive";

    const links = footer.children;
    for (let i = 0; i < links.length; i++) {
        links[i].style.color = "#5656e2b0"
        links[i].style.textDecoration = "none"
    }

   const header = document.getElementById("header");
        header.style.padding = "20px 0 10px 20px";
        header.style.boxShadow = "rgba(50, 50, 93, 0.25) 0px 2px 5px 1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px";
        header.style.margin = "0 0 0 7px";
        header.getElementsByTagName("table")[1].style.width = "96%"
        header.getElementsByTagName("table")[1].style.float = "left"
        header.getElementsByTagName("table")[1].style.background = PrimaryColor
        header.getElementsByTagName("table")[1].children[0].children[0].children[0].style.background = PrimaryColor
        header.style.backgroundColor = PrimaryColor;
        header.style.fontFamily = "cursive";
        header.style.height = "160px";

   const lupa = document.createElement("div")
    lupa.className = "lupa"
    header.appendChild(lupa)

    lupa.style.width = "145px"
    lupa.style.width = "145px"
    lupa.style.height = "145px"
    lupa.style.position = "relative"
    lupa.style.top = "-121px"
    lupa.style.left = "115px"
    lupa.style.borderRadius = "50%"
    lupa.style.border = "5px solid"
    lupa.style.backdropFilter = "blur(1px)"
    lupa.style.boxShadow = "1px 1px 0px 0px #930707";
    lupa.style.filter = "drop-shadow(2px 4px 6px black)"

    const ruckaOdLupy = document.createElement("div")
    ruckaOdLupy.className = "ruckaOdLupy"
    lupa.appendChild(ruckaOdLupy)

    ruckaOdLupy.style.width = "80px"
    ruckaOdLupy.style.height = "80px"
    ruckaOdLupy.style.background = "black"
    ruckaOdLupy.style.borderRadius = "0% 100% 20% 80% / 0% 80% 20% 100%"
    ruckaOdLupy.style.position = "relative"
    ruckaOdLupy.style.top = "129px"
    ruckaOdLupy.style.left = "119px"
    ruckaOdLupy.style.boxShadow = "1px 1px 1px 1px #930707";


    const dslLogo = document.createElement("span")
    header.children[0].children[0].children[0].children[0].children[0].appendChild(dslLogo)
    header.children[0].children[0].children[0].children[0].children[0].children[0].style.display = "none"
    dslLogo.innerText = "DSL.sk"
    dslLogo.style.fontSize = "90px"
    dslLogo.style.fontWeight = "bold"
    dslLogo.style.fontStyle = "italic"
    dslLogo.style.color = "#020280"
    dslLogo.style.lineHeight = "0.9"

    const dslUnderLogo = document.createElement("span")
    header.children[0].children[0].children[0].children[0].children[2].style.display = "none"
    header.children[0].children[0].children[0].children[0].appendChild(dslUnderLogo)
    dslUnderLogo.innerText = "Digitálny Svet pod Lupou"
    dslUnderLogo.style.padding = "10px"


   const titleBar = document.getElementById("title_bar");
        titleBar.style.padding = "20px";
        titleBar.style.borderBottom = "none";

   const bg = document.getElementById("bg");
        bg.style.border = "none"
        bg.children[2].style.margin = "0 0 10px 7px";
        bg.children[2].style.width = "99.2%";
        bg.children[2].style.boxShadow = "rgba(50, 50, 93, 0.25) 0px 2px 5px 1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px";

   const menu = document.getElementById("menu");
        menu.style.background = "none";
        menu.parentNode.style.padding = "0";
        menu.parentNode.style.background = PrimaryColor;

        const menuChildren = menu.children
        const child = menuChildren[1].children

        for (let i = 0; i < menuChildren.length; i++) {
        menuChildren[i].style.background = "none"
            const child = menuChildren[i].children
            for (let i = 0; i < child.length; i++) {
                child[i].style.background = "none"
                child[i].style.border = "none"

            }
    }

    const inputs = document.getElementsByTagName('input')
     for (let i = 0; i < inputs.length; i++) {
       inputs[i].style.border = "2px solid #f0b47d"
         inputs[i].style.background = "rgb(79 255 81 / 22%)"
         inputs[i].style.padding = "5px"
         inputs[i].style.margin = "5px 0"
         inputs[i].style.borderRadius = "5px"
         inputs[i].style.width = "50%"
         inputs[i].style.fontFamily = "cursive"
    }

    const textarea = document.getElementsByTagName('textarea')
    if(textarea.length > 0){
        for (let i = 0; i < textarea.length; i++) {
            textarea[i].style.border = "2px solid #f0b47d"
            textarea[i].style.background = "rgb(79 255 81 / 22%)"
            textarea[i].style.padding = "5px"
            textarea[i].style.margin = "5px 0"
            textarea[i].style.borderRadius = "5px"
            textarea[i].style.fontFamily = "cursive"
        }
    }

      const newestPosts = document.getElementById("article_menu")

     if(newestPosts){
         newestPosts.style.background = SecondaryColor
         newestPosts.style.padding = "inherit"
         newestPosts.style.borderLeft = "10px solid " + PrimaryColor
         newestPosts.style.marginRight = "12px"

     }

    const articlePerex = document.getElementsByClassName("article_perex")

        for (let i = 0; i < articlePerex.length; i++) {
            articlePerex[i].style.display = "flex"
            articlePerex[i].style.fontFamily = "cursive"


            var text = articlePerex[i].textContent
            var count = 400;
            var result = text.slice(0, count) + (text.length > count ? "..." : "");

            articlePerex[i].innerText = result

            if(!url.includes("tags")){
                const lupy = document.createElement("div")
                lupy.className = "lupy"

                articlePerex[i].parentNode.insertBefore(lupy, articlePerex[i].nextSibling.nextSibling.nextSibling)

                articlePerex[i].previousElementSibling.style.position = "relative"
                articlePerex[i].previousElementSibling.style.top = "10px"
                articlePerex[i].previousElementSibling.style.left = "-75px"
                articlePerex[i].previousElementSibling.style.border = "none"
                articlePerex[i].previousElementSibling.style.boxShadow = "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset"
                articlePerex[i].previousElementSibling.style.borderRadius = "160px"
                articlePerex[i].previousElementSibling.style.borderBottomRightRadius = "0"
                articlePerex[i].previousElementSibling.style.filter = "drop-shadow(2px 4px 6px black)"

                lupy.style.width = "100px"
                lupy.style.height = "100px"
                lupy.style.position = "relative"
                lupy.style.top = "-130px"
                lupy.style.left = "-45px"
                lupy.style.borderRadius = "50%"
                lupy.style.border = "5px solid"
                lupy.style.backdropFilter = "blur(1.5px)"
                lupy.style.boxShadow = "1px 1px 0px 0px #930707"
                lupy.style.filter = "drop-shadow(2px 4px 6px black)"
                lupy.style.margin = "-50px";
                //lupy.style.display = "none"


                const ruckaOdLups = document.createElement("div")
                ruckaOdLups.className = "ruckaOdLups"
                articlePerex[i].parentNode.insertBefore(ruckaOdLups, articlePerex[i].nextSibling.nextSibling.nextSibling)

                ruckaOdLups.style.width = "65px"
                ruckaOdLups.style.height = "65px"
                ruckaOdLups.style.background = "black"
                ruckaOdLups.style.borderRadius = "100% 0% 80% 20% / 80% 0% 100% 20% "
                ruckaOdLups.style.position = "relative"
                ruckaOdLups.style.top = "-20px"
                ruckaOdLups.style.left = "-87px"
                ruckaOdLups.style.boxShadow = "1px 1px 1px 1px #930707";
                ruckaOdLups.style.filter = "drop-shadow(2px 4px 6px black)"
                ruckaOdLups.style.margin = "-50px";
                //ruckaOdLups.style.display = "none"

                if(articlePerex[i].parentElement.getElementsByTagName("img")[0]){
                    articlePerex[i].parentElement.getElementsByTagName("img")[0].style.position = "relative"
                    articlePerex[i].parentElement.getElementsByTagName("img")[0].style.top = "10px"
                    articlePerex[i].parentElement.getElementsByTagName("img")[0].style.left = "-75px"
                    articlePerex[i].parentElement.getElementsByTagName("img")[0].style.border = "none"
                    articlePerex[i].parentElement.getElementsByTagName("img")[0].style.boxShadow = "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset"
                    articlePerex[i].parentElement.getElementsByTagName("img")[0].style.borderRadius = "160px"
                    articlePerex[i].parentElement.getElementsByTagName("img")[0].style.borderBottomRightRadius = "0"
                    articlePerex[i].parentElement.getElementsByTagName("img")[0].style.filter = "drop-shadow(2px 4px 6px black)"
                }
            }

    }

     const lups = document.getElementsByClassName("lupy")
      const ruckaOdLups = document.getElementsByClassName("ruckaOdLups")

         for(let i=1; i<lups.length ; i++){
            lups[i].remove();
        }

    for(let i=1; i<ruckaOdLups.length ; i++){
        ruckaOdLups[i].remove();
    }


    const search = document.getElementsByTagName("form")
          search[0].children[1].style.width = "120px"
          search[0].children[2].style.width = "35px"


   const newsBox = document.getElementById("news_box");
    if(newsBox){
          newsBox.style.width = "97%";
        newsBox.parentNode.style.width = "100%";
        newsBox.style.lineHeight = "2";
        newsBox.style.border = "none";
        newsBox.style.paddingLeft = "30px";
        newsBox.nextElementSibling.style.marginTop = "20px";
        newsBox.style.background = SecondaryColor;
         newsBox.style.fontFamily = "cursive";
        newsBox.style.fontSize = "11px";

    }

    const pageTitle = document.getElementsByClassName("page_title")

    if(pageTitle.length > 1){
        pageTitle.style.margin = "0 10px 60px 0"

    }


   const body = document.getElementById("body");
    if(body.children[0] || body.children[1] && !url.includes("tags")){
         body.children[0].style.marginBottom = "35px";
         //body.children[0].style.border = "1px solid peachpuff"
         body.children[0].style.padding = "30px 30px 30px 0"
         body.children[0].style.margin = "0 30px 60px 0"
        //body.children[0].style.boxShadow = "0px 0px 15px 5px peachpuff"
        if(body.children.length > 1 && body.children.length < 5 && !url.includes("tags") ){
            body.children[0].style.background = SecondaryColor
            body.children[0].style.borderLeft = "10px solid " + PrimaryColor
        }

        if(body.children.length > 1 && !url.includes("tags")){
            body.children[1].style.marginBottom = "35px";
            if( body.children[1].children[0]){
                body.children[1].children[0].children[0].children[0].style.width = "89%"
                body.children[1].children[0].children[0].children[0].style.background = SecondaryColor
                body.children[1].children[0].children[0].children[0].style.float = "left"
                body.children[1].children[0].children[0].children[0].style.padding = "20px"
                body.children[1].children[0].children[0].children[0].style.borderLeft = "10px solid " + PrimaryColor
                body.children[1].children[0].children[0].children[0].style.margin = "-8px"

                body.children[1].children[0].children[0].children[1].style.width = "85%"
                body.children[1].children[0].children[0].children[1].style.float = "left"
                body.children[1].children[0].children[0].children[1].style.padding = "0 20px 0 20px"
            }
          
        }

        if(body.children.length > 1 && url.includes("tags")){
            const tr1 = body.children[1].children[0].children
            for(var b=0; b<tr1.length ; b++){
                tr1[b].remove();
            }

            for (let i = 0; i < tr1.length; i++) {
                tr1[i].style.background = SecondaryColor
                tr1[i].children[0].style.borderLeft = "10px solid " + PrimaryColor
                tr1[i].children[0].style.padding = "20px"
                if(tr1[i].children[1]){
                    tr1[i].children[1] .style.padding = "20px"
                }

            }
        }
    }

    if(body.children.length > 1 && !url.includes("tags")){
        const rev = body.children[1].children[0].children[0].children[0]
    }

    if(body.children.length > 1 && !url.includes("tags")){

        const tr = body.children[2].children[0].children

        for(var i=1; i<tr.length ; i++){
            tr[i].remove();
        }

        for (let i = 0; i < tr.length; i++) {
            tr[i].children[0].style.width = "85%"
            tr[i].children[0].style.float = "left"
            tr[i].children[0].style.padding = "20px 30px 20px 30px"
            tr[i].children[0].style.background = SecondaryColor
            tr[i].children[0].style.margin = "10px 0 10px 0"
            tr[i].children[0].style.borderLeft = "10px solid " + PrimaryColor
            //tr[i].children[0].style.height = "300px"

            if(tr[i].children[1]){
                tr[i].children[1].style.width = "85%"
                tr[i].children[1].style.float = "left"
                tr[i].children[1].style.padding = "20px 30px 20px 30px"
                tr[i].children[1].style.background = SecondaryColor
                tr[i].children[1].style.margin = "10px 0 10px 0"
                tr[i].children[1].style.borderLeft = "10px solid " + PrimaryColor
                //tr[i].children[1].style.height = "300px"
            }
        }
    }else if(!url.includes("tags")){
        const tr = body.children[0].children[0].children

        for(let i=0; i<tr.length ; i++){
            tr[i].remove();
        }

        for (let i = 0; i < tr.length; i++) {
            tr[i].children[0].style.width = "100%"
            tr[i].children[0].style.float = "left"
            tr[i].children[0].style.padding = "20px 30px 20px 30px"
            tr[i].children[0].style.background = SecondaryColor
            tr[i].children[0].style.margin = "10px 0 10px 0"
            tr[i].children[0].style.borderLeft = "10px solid " + PrimaryColor
            //tr[i].children[0].style.height = "300px"
        }
    }

    const smallNotes = document.getElementsByClassName("small_notes")
    for (let i = 0; i < smallNotes.length; i++) {
        smallNotes[i].style.float = "right"
        smallNotes[i].style.margin = "-10px"
        smallNotes[i].style.paddingRight = "10px"
        smallNotes[i].style.position = "relative"
        smallNotes[i].style.top = "-15px"
        smallNotes[i].style.padding = "10px"
        smallNotes[i].style.background = PrimaryColor
        smallNotes[i].style.borderRadius = "160px"
        smallNotes[i].style.borderBottomLeftRadius = "0"
        smallNotes[i].style.fontFamily = "monospace"

    }


    const title = document.getElementsByClassName("title")
    for (let i = 0; i < title.length; i++) {
        title[i].style.color = "rgb(123 199 66)"
        title[i].style.fontFamily = "cursive"

    }

    const titleDay = document.getElementsByClassName("title_day")
    for (let i = 0; i < titleDay.length; i++) {
        //titleDay[i].style.borderLeft = "10px solid rgb(79, 161, 79)"
        titleDay[i].style.color = "rgb(123, 199, 66)"
        titleDay[i].style.fontFamily = "cursive"

    }

   const boxTitle = document.getElementsByClassName("box_title");


    if(boxTitle.length > 0){
        boxTitle[0].style.lineHeight = "4.5"
        boxTitle[0].style.padding = "10px 100px 10px 30px"
        //boxTitle[i].style.background = SecondaryColor
        //boxTitle[i].style.borderLeft = "10px #4fa14f solid"
        boxTitle[0].style.color = "rgb(123, 199, 66)"
        boxTitle[0].style.fontFamily = "cursive"
    }


    const map = document.getElementById("map");
    if(map){
        map.style.border = "2px solid " + PrimaryColor
        map.style.width = "102%"

        map.parentNode.children[0].style.float = "left"
        map.parentNode.children[0].style.margin = "20px 0 10px 0"
        map.parentNode.children[0].style.padding = "0 100px 0 0"
        map.parentNode.children[0].style.color = "rgb(123, 199, 66)"
         map.parentNode.children[0].style.lineHeight = "4.5"

        const mapElements = map.children
        for (let i = 0; i < mapElements.length; i++) {
            mapElements[i].style.background = "none"
            mapElements[i].style.width = "100%"
            mapElements[i].style.height = "13%"
            mapElements[i].style.left = "20px"
            mapElements[i].style.top = "20px"
            mapElements[i].style.fontSize = "8pt"
             mapElements[i].style.fontFamily = "system-ui"

            const pix = +mapElements[i].style.top.replace('px','') + i*20 + "px"
            mapElements[i].style.top = pix
        }
       }

})();
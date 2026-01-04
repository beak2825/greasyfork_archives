// ==UserScript==
// @name         Beauty CCXP
// @namespace    https://samuel21110.github.io/
// @version      0.1
// @description  Make NTHU CCXP beauty
// @author       Samuel
// @match        https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/select_entry.php*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459143/Beauty%20CCXP.user.js
// @updateURL https://update.greasyfork.org/scripts/459143/Beauty%20CCXP.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const main = () => {
        class folder {
            constructor(name) {
                this.name = name;
                this.items = [];
            }
            push(item) {
                this.items.push(item);
            }
            print() {
                console.log(this.items);
            }
            getArr() {
                return this.items;
            }
            getName() {
                return this.name;
            }
        }
        class option {
            constructor(name, url, target=0) {
                this.name = name;
                this.url = url;
                this.target = target;
            }
            getName() {
                return this.name;
            }
            getUrl() {
                return this.url;
            }
            getTarget() {
                return this.target;
            }
        }
        const parse_folders = () => {
            let frame = document.querySelectorAll("frame")[1];
            let folders = frame.contentWindow.document.querySelectorAll('div[id^=folder]');
            let items = Array.from(frame.contentWindow.document.querySelectorAll('div[id^=item]'));
            let len = folders.length;
            let main_folder = new folder("/");
            for (let i = 1; i < len; i += 1) {
                let name = folders[i].innerText.replace("\t", "");
                let folder_num_st = folders[i].getAttribute("id").match(/\d+/);
                // 10: hardcoded
                const LAST_FOLDER_SIZE = 10;
                let folder_num_ed = (i == len - 1) ? folder_num_st + LAST_FOLDER_SIZE : folders[i+1].getAttribute("id").match(/\d+/);
                let items_cnt = folder_num_ed - folder_num_st - 1;
                let f = new folder(name);
                // console.log(i, " cnt:", items_cnt);
                for (let j = 0; j < items_cnt; j += 1) {
                    if (items.length == 0) {
                        break;
                    }
                    let front = items.shift();
                    let optionName = front.innerText.replace("\t", "");
                    if (front.getAttribute("id").match("folder") != null) {
                        continue;
                    }
                    let id = front.getAttribute("id").match(/\d+/);
                    let url = front.querySelector("a").href;
                    let type = front.querySelector("a").target;
                    if (id <= folder_num_st || id >= folder_num_ed) {
                        // return -1;
                    }
                    type = type == "main" ? 0 : 1; 
                    let add = new option(optionName, url, type);
                    console.log(optionName);
                    f.push(add);
                }
                if (items_cnt > 0) {
                    main_folder.push(f);
                }
            }
            main_folder.print();
            return main_folder;
        }
        const removeAllChildNodes = (parent) => {
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            }
            parent.remove();
        }
        const addBody = () => {
            let body = document.createElement("body");
            document.querySelector("html").append(body);
            let link = document.createElement("link");
            link.href = "https://use.fontawesome.com/releases/v5.7.2/css/all.css";
            link.setAttribute("crossorigin", "anonymous")
            link.rel = "stylesheet";
            document.getElementsByTagName("head")[0].appendChild( link );
            let style = `
            @import url('https://fonts.googleapis.com/css?family=Poppins:400,500,600,700&display=swap');
        *{
          margin: 0;
          padding: 0;
          user-select: none;
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
        }
        body{
          background-color: #eee;
        }
        .btn{
          position: absolute;
            top: 10px;
            left: 10px;
            height: 37px;
            width: 37px;
            text-align: center;
            background: #1b1b1b;
            border-radius: 3px;
            cursor: pointer;
            transition: left 0.4s ease;
            z-index: 2;
            opacity: 20%;
        }
        .btn:hover {
            opacity: 85%;
        }
        .btn.click{
          left: 260px;
        }
        .btn span{
            color: white;
            font-size: 15px;
            line-height: 36px;
        }
        .btn.click span:before{
          content: '\f00d';
        }
        .sidebar{
          position: fixed;
          width: 250px;
          height: 100%;
          left: -250px;
          background: #1b1b1b;
          transition: left 0.4s ease;
          z-index: 1;
          overflow-y: scroll;
          max-height: 100vh;
        }
        .sidebar.show{
          left: 0px;
        }
        .sidebar .text{
          color: white;
          font-size: 19px;
          font-weight: 600;
          line-height: 65px;
          text-align: center;
          background: #1e1e1e;
          letter-spacing: 1px;
        }
        nav ul{
          background: #1b1b1b;
          width: 100%;
          list-style: none;
              padding-left: 10px;
        }
        nav ul li{
          line-height: 50px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        nav ul li:last-child{
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        nav ul li a{
          position: relative;
          color: white;
          text-decoration: none;
          font-size: 13px;
          padding-left: 14px;
          font-weight: 500;
          display: block;
          width: 100%;
          border-left: 3px solid transparent;
        }
        nav ul li.active a{
          color: #FC5404;
            background: #1e1e1e;
            border-left-color: #FC5404;
        }
        nav ul li a:hover{
          background: #1e1e1e;
        }

        .feat-show{
          transition: all 0.5s;
        }

        nav ul li.active ul{
         transition: all 0.5s;
        }
        nav ul ul{
          position: static;
          display: none;
        }

        nav ul.show{
          display: block;
          transition: all 0.5s;
        }

        nav ul ul li{
          line-height: 42px;
          border-top: none;
        }
        nav ul ul li a{
          font-size: 12px;
          color: #e6e6e6;

        }
        nav ul li.active ul li a{
          color: #e6e6e6;
          background: #1b1b1b;
          border-left-color: transparent;
        }

        a:hover{
          color: #FC5404 !important;
        }
        nav ul ul li a:hover{
          color: #FC5404 !important;
          background: #1e1e1e!important;
        }
        nav ul li a span{
          position: absolute;
          top: 50%;
          right: 20px;
          transform: translateY(-50%);
          font-size: 15px;
          transition: transform 0.4s;
        }
        nav ul li a span.rotate{
          transform: translateY(-50%) rotate(-180deg);
        }
        .content{
          color: #202020;
          z-index: 0;
          text-align: center;
          width: 100%;
          height: 100%;
          position: fixed;
        }
        .subwindow {
            width: 100%;
            height: 100%;
        }
        .main_side {
            
        }
        .hide {
            display: none;
        }
            `
            let styleDom = document.createElement("style");
            styleDom.innerHTML = style;
            document.querySelector("head").append(styleDom);
            document.querySelector("head").innerHTML += `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
        }

        // parse folders
        let main_folder = parse_folders();

        // remove all elements & add custom elements
        removeAllChildNodes(document.querySelector("frameset"));
        addBody();
        
        // create buttons
        document.querySelector("body").innerHTML = `
        <div class="btn">
                <span class="fas fa-bars"></span>
            </div>
        <div id="left">
            <nav class="sidebar">
                <div class="text">
                    NTHU CCXP
                </div>
                <ul class="main_side" id="main_side">
                    <div class="text"><input id="search" type="text" placeholder="\u641c\u5c0b" style="width: 100%;"></div>
                </ul>
            </nav>
        </div>
        <div class="content" id="right">
            <div class="header" id="main">
                <iframe class="subwindow" id="subwindow" src="https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/xp03_m.htm"/>
            </div>
        </div>
        `
        // add some event listeners
        document.querySelector("#subwindow").addEventListener("load", () => {
            document.querySelector("#subwindow").contentWindow.document.body.style.height = "100vh";
            document.querySelector("#subwindow").contentWindow.document.body.style.textAlign = "center";
            document.querySelector("#subwindow").contentWindow.document.body.onclick = () => {
                if ($('.btn').hasClass("click")) {
                    $('.btn').toggleClass("click");
                    $('.sidebar').toggleClass("show");
                }
            }
        });
        document.querySelector("#search").oninput = (t) => {
            let ele = t.target;
            const val = ele.value.toLowerCase();
            console.log(val);
            let allFolders = document.querySelectorAll(".folder");
            for (let folder of allFolders) {
                let id = folder.querySelector("a").getAttribute('id');
                if (val === "") {
                    folder.classList.remove("hide");
                    $('nav ul li ul.item-show-'+id).removeClass("show");
                    $('nav ul li #'+id+' span').removeClass("rotate");
                }else {
                    if (folder.innerText.toLowerCase().match(val)) {
                        $('nav ul li ul.item-show-'+id).addClass("show");
                        $('nav ul li #'+id+' span').addClass("rotate");
                        folder.classList.remove("hide");
                    }else {
                        $('nav ul li ul.item-show-'+id).removeClass("show");
                        $('nav ul li #'+id+' span').removeClass("rotate");
                        folder.classList.add("hide");
                    }
                }
            }
        }
        const addItems = (folder, id) => {
            let ul = document.createElement("ul");
            ul.setAttribute("class", `item-show-${id}`);
            const arr = folder.getArr();
            for (let i of arr) {
                let li = document.createElement("li");
                let a = document.createElement("a");
                let type = i.getTarget();
                if (type === 0) {
                    a.onclick = () => {
                        document.querySelector("#subwindow").src = i.getUrl();

                        // $('#main').html(`<iframe class="subwindow" src="${i.getUrl()}"/>`);
                    }
                }else {
                    a.href = i.getUrl();
                    a.target = "_blank";
                }
                a.innerText = `> ${i.getName().replaceAll("\n", " ")}`;
                li.appendChild(a);
                ul.appendChild(li);
                console.log(`${a.innerText} ${i.getUrl()}`)
            }
            return ul;
        }
        const addFolder = (main_folder) => {
            const arr = main_folder.getArr();
            for (let i = 0; i < arr.length; i++) {
                let folder = arr[i];
                let li = document.createElement("li");
                li.setAttribute("class", "folder");
                li.innerHTML = `
                    <a href="#" id="${i}">${folder.getName()}
                        <span class="fas fa-caret-down"></span>
                    </a>
                `
                li.appendChild(addItems(folder, i));
                document.querySelector("#main_side").appendChild(li);
            }
        };
        addFolder(main_folder);

        // load jQuery
        const loadJquery = (callback) => {
            let script = document.createElement('script');
            document.head.appendChild(script);
            script.type = 'text/javascript';
            script.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js";
            script.onload = callback;
        }
        loadJquery(() => {
            console.log("finish load")
            $('.btn').click(function() {
               $(this).toggleClass("click");
               $('.sidebar').toggleClass("show");
             });
            $('.sidebar ul li a').click(function(){
                let id = $(this).attr('id');
                $('nav ul li ul.item-show-'+id).toggleClass("show");
                $('nav ul li #'+id+' span').toggleClass("rotate");
            });
            $('nav ul li').click(function(){
                 $(this).addClass("active").siblings().removeClass("active");
            });
            $('.content').click(() => {
                if ($('.btn').hasClass("click")) {
                    $('.btn').toggleClass("click");
                    $('.sidebar').toggleClass("show");
                }
            })
            
        });

    }
    const wait_loaded = () => {
        let frame = document.querySelectorAll("frame")[1];
        let folders = frame.contentWindow.document.querySelectorAll('div[id^=folder]');
        if (folders.length < 20) {
            setTimeout(wait_loaded, "50");
        }else {
            main();
        }
    }
    wait_loaded();
    
})();
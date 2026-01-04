// ==UserScript==
// @name         【自用】TitleSearch改
// @namespace    http://tampermonkey.net/
// @version      5.16
// @description  abooky 搜书吧-添加标题到优书网的跳转按钮
// @author        backrock12
// @match        *://www.abooky.com/*
// @match        *://www.yousuu.com/search*
// @match        *://dushuxiaozi.com/category*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_addValueChangeListener
// @grant        window.close

// @match        https://lookfor.soushutt.com/*


// @downloadURL https://update.greasyfork.org/scripts/445744/%E3%80%90%E8%87%AA%E7%94%A8%E3%80%91TitleSearch%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/445744/%E3%80%90%E8%87%AA%E7%94%A8%E3%80%91TitleSearch%E6%94%B9.meta.js
// ==/UserScript==

(function () {
    "use strict";

    //如果搜书吧域名更换-失效请自行替换，以及上面@match里的内容
    var soushu555=`https://lookfor.soushutt.com/`

    var $ = $ || window.$;
    var currentUrl;
    const urllist = [
        {
            name: "abooky",
            url: /www\.abooky\.com/,
            titleid: ".ts",
            pos: ".ts",
            nosign: "",
            autojump: false,
            func:()=>{document.querySelector("#mn_Nc36a > a").innerText='优书网'
                      document.querySelector("#mn_Nc36a > a").href='https://www.yousuu.com'
                      document.querySelector("#mn_Nc36a > a").target='_blank'
                     },
            skipword:[],
            cutSign:[]
        },
        {
            name: "搜书吧",
            url: new RegExp(soushu555.substring(7)),
            titleid: "#thread_subject",
            pos: ".ts",
            nosign: "",
            autojump: false,
            func:()=>{
                document.querySelector("#toptb1 > div > div.z > a").innerText='优书网';
                document.querySelector("#toptb1 > div > div.z > a").href='https://www.yousuu.com';
            },
            skipword:['(全本)','全本','完结','合集','未删减','番外','版本','完整未删节','\n'],
            cutSign:['(','（','by','作者']
        },
    ];


    const color_ok = "#87CEFA";
    const color_err = "#db7093";
    const color_def = "#EEE";
    const config_name = "TITLESEARCH_SETTING";
    let booktitle = null;

    var run_mk = false;
    function gettitle(t, str1, str2) {
        let lnum, rnum, title;
        lnum = t.indexOf(str1);
        rnum = t.indexOf(str2);
        if (rnum < 0) rnum = 0;
        if (lnum >= 0 && rnum > 0) {
            title = t.substring(lnum + 1, rnum);
        }
        if (lnum <0 && str2) {
            title = t.substring(0, rnum);
        }
        if (rnum <0 && str1) {
            title = t.substring(lnum + 1);
        }
        return title?title:t;
    }

    //標題跳轉按鈕
    function make(obj) {
        if (obj.url.test(location.href)) {
            currentUrl=obj;
            let t = $(obj.titleid).text();
            let b = addbutton(t, obj.autojump);
            if (b) $(obj.pos).after(b);
            obj.func();
        }
    }

    function addbutton(t, autojump) {
        if (t) {
            console.log(t);
            let title = gettitle(t, "《", "》");
            if (!title) {
                title = gettitle(t, "<", ">");
            }

            if (!title) {
                title = gettitle(t, "]", "⊙");
            }
            if (!title) {
                title = gettitle(t, null, "作者：");
            }
            if (!title) {
                title = gettitle(t, null, "作者");
            }
            if (!title) {
                title = gettitle(t, null, "￥");
            }
            if (!title) {
                title = gettitle(t, null, " ");
            }

            if(title){
                for(let i in  currentUrl.skipword){
                    title= title.replace(currentUrl.skipword[i],'')
                }
            }
            if(title){
                for(let j=0;j<currentUrl.cutSign.length;j++){
                    title=gettitle(title, null, currentUrl.cutSign[j]);

                }
            }

            console.log(title);
            if (title) {
                booktitle = title;
                const re = getlog(title);
                console.log("re", re);

                let background_color = color_def;
                let href =
                    "http://www.yousuu.com/search/?search_type=title&search_value=" +
                    title +
                    "#TitleSearch";
                if (re == "null") {
                    background_color = color_def;
                } else if (re == "false") {
                    background_color = color_err;
                } else if (re) {
                    href = re;
                    background_color = color_ok;
                }

                let b = $("<button></button>");
                b.text("优书网");
                b.css({
                    color: "#000000",
                    "background-color": background_color,
                    "border-color": color_def,
                    "font-weight": " 300",
                    "font-size": " 16px",
                    "text-decoration": " none",
                    "text-align": " center",
                    "line-height": " 25px",
                    height: " 25px",
                    padding: " 0 15px",
                    margin: " 0",
                    display: " inline-block",
                    appearance: " none",
                    cursor: " pointer",
                    border: " none",
                    "-webkit-box-sizing": " border-box",
                    "-moz-box-sizing": " border-box",
                    "box-sizing": " border-box",
                    "-webkit-transition-property": " all",
                    "transition-property": " all",
                    "-webkit-transition-duration": " .3s",
                    "transition-duration": " .3s",
                    "border-radius": " 4px",
                });

                b.click(function () {
                    // var content = document.createElement("a");
                    //  content.href = href;
                    //  content.target = "_blank";
                    // document.body.appendChild(content);
                    //  content.click();
                    //  document.body.removeChild(content);
                    GM_openInTab(href, true);
                });

                GM_addValueChangeListener(
                    config_name,
                    function (name, old_value, new_value, remote) {
                        const list_re = getlog_config(booktitle, new_value);

                        let background_color = "#EEE";
                        if (list_re == "null") {
                            background_color = "#EEE";
                        } else if (list_re == "false") {
                            background_color = color_err;
                        } else if (list_re) {
                            background_color = color_ok;
                        }
                        b.css({
                            "background-color": background_color,
                        });
                    }
                );

                if (autojump && re == "null") {
                    //b.click();
                    GM_openInTab(href, true);
                }
                return b;
            }
        }
    }

    function addDownbutton(t) {
        if (t) {
            console.log(t);
            let title = gettitle(t, "《", "》");
            if (!title) {
                title = gettitle(t, "<", ">");
            }
            if (!title ) {
                title = gettitle(t, "]", "⊙");
            }

            console.log(title);
            if (title) {
                let b = $("<button></button>");
                b.text("下载");
                b.css({
                    color: " #666",
                    "background-color": color_def,
                    "border-color": color_def,
                    "font-weight": " 300",
                    "font-size": " 16px",
                    "text-decoration": " none",
                    "text-align": " center",
                    "line-height": " 25px",
                    height: " 25px",
                    padding: " 0 15px",
                    margin: " 0",
                    display: " inline-block",
                    appearance: " none",
                    cursor: " pointer",
                    border: " none",
                    "-webkit-box-sizing": " border-box",
                    "-moz-box-sizing": " border-box",
                    "box-sizing": " border-box",
                    "-webkit-transition-property": " all",
                    "transition-property": " all",
                    "-webkit-transition-duration": " .3s",
                    "transition-duration": " .3s",
                    "border-radius": " 4px",
                });
                b.click(function () {
                    var content = document.createElement("a");
                    content.href =
                        "https://dushuxiaozi.com/wp-content/uploads/2019/book/" +
                        title +
                        ".zip";
                    content.target = "_blank";
                    document.body.appendChild(content);
                    content.click();
                    document.body.removeChild(content);
                });

                return b;
            }
        }
    }



    /**
   * @description : 根据ID检查元素是否可见，再点击
   * @param        {*} cssid
   * @return       {*}
   */
    function loop(cssid) {
        function checkVisible(elm) {
            var rect = elm.getBoundingClientRect();
            var viewHeight = Math.max(
                document.documentElement.clientHeight,
                window.innerHeight
            );
            return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
        }

        const s = document.querySelector(cssid);
        if (s) {
            let r = checkVisible(s);
            if (r) {
                s.click();
                // serch();
            }
        }
    }

    //優書網自動點擊
    function autoclick() {
        let num = 0;
        const _Interval = setInterval(() => {
            let books = $(".list-card-layout");

            if (books.length == 0) books = $(".result-item-layout");

            const bookname = books.find(".book-name");

            console.log(bookname);

            if (bookname.length == 1) {
                if (bookname.length == 1) {
                    if (bookname[0].href) {
                        GM_openInTab(bookname[0].href, true);
                    } else {
                        bookname[0].click();
                    }

                    addlog(true, bookname[0].href);

                    clearInterval(_Interval);
                    setTimeout(function () {
                        window.close();
                    }, 200);
                }
            } else if (bookname.length > 1) {
                bookname.click((f) => {
                    const surl = f.currentTarget.href;
                    console.log("bookname.click");
                    addlog(true, surl);
                });

                const BookCoverImage = books.find(".card-bookInfo-cover a");
                console.log(BookCoverImage);
                BookCoverImage.click((f) => {
                    const surl = f.currentTarget.href;
                    console.log("BookCoverImage.click");
                    addlog(true, surl);
                });

                clearInterval(_Interval);
            } else {
                if (window.document.body.innerText.indexOf("找不到你要的结果:-)") > 0) {
                    addlog(false, null);
                    clearInterval(_Interval);
                    window.close();
                }

                if (num > 10) {
                    clearInterval(_Interval);
                    window.close();
                }

                num++;
            }
        }, 300);
    }

    function getlog(tname) {
        let set_obj = GM_getValue(config_name, null);
        return getlog_config(tname, set_obj);
    }

    function getlog_config(tname, set_obj) {
        console.log(set_obj);
        if (!set_obj) {
            set_obj = {};
        }

        let re;
        const obj = set_obj[tname];
        console.log("obj", obj);

        if (!obj) {
            re = "null";
        } else if (obj.found_mk == "true" && obj.url) {
            re = obj.url;
        } else if (obj.found_mk == "false") {
            re = "false";
        } else {
            re = "null";
        }
        return re;
    }

    function addlog(is_found_mk, is_url) {
        // const name = "value_test";
        // const is_found_mk = true;
        // const is_url = "";

        const tname = $(
            ".default-layout > div:nth-child(1) > header:nth-child(1) > input:nth-child(1)"
        ).val();

        const nowdate = new Date().toLocaleString();
        let set_obj = GM_getValue(config_name, null);
        console.log(set_obj);
        if (!set_obj) {
            set_obj = {};
        }

        const obj = set_obj[tname];
        let is_count = 1;
        if (!obj) {
            is_count = 1;
        } else {
            is_count = obj.count + 1;
        }

        set_obj[tname] = {
            url: is_url,
            modi_time: nowdate,
            count: is_count,
            found_mk: is_found_mk ? "true" : "false",
        };

        GM_setValue(config_name, set_obj);
        console.log(
            "is_found_mk :" + is_found_mk + "  is_url: " + is_url + "  name: " + name
        );
    }

    function dushuxiaozi() {
        var count = 0;
        var isok = false;
        function serch() {
            var list = document.querySelectorAll("#main  h2 > a");
            console.log(list);
            if (count != list.length && !isok) {
                isok = true;
                for (var i = 0; i < list.length; i++) {
                    let t = $(list[i]).text();
                    console.log(t);
                    if (list[i].getAttribute("titlesearch_mk") != "true") {
                        let b = addbutton(t);
                        let b2 = addDownbutton(t);
                        if (b) {
                            $(list[i]).after(b2);
                            $(list[i]).after(b);
                            list[i].parentNode.style.cssText =
                                "font-size: 18px;width: 750px;";
                            list[i].setAttribute("titlesearch_mk", "true");
                        }
                    }
                }
                isok = false;
            }
        }

        setInterval(() => loop(".ias-trigger-next"), 2000);
        serch();

        document.querySelector("#main").addEventListener("DOMNodeInserted", serch);
    }

    function run() {
        if (location.hash && location.hash == "#TitleSearch") {
            setTimeout(autoclick, 1100);
        } else {
            //   if (/dushuxiaozi/.test(location.href)) {
            //     dushuxiaozi();
            //   } else {
            urllist.forEach(make);
            //   }
        }

        //自動滾動
        if (/www\.abooky\.com/.test(location.href)) {
            $(window).scroll(function () {
                var scrollTop = $(this).scrollTop();
                var scrollHeight = $(document).height();
                var windowHeight = $(this).height();
                if (scrollTop + windowHeight >= scrollHeight - 350) {
                    if (!run_mk) {
                        run_mk = true;
                        loop("#autopbn");
                        run_mk = false;
                    }
                }
            });
        }
    }

    run();
})();

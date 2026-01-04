// ==UserScript==
// @name        微博图片全显示（在hzhbest基础上改进版）
// @namespace   ziyouzhiyi
// @include     http://weibo.com/*
// @include     https://weibo.com/*
// @include     http://www.weibo.com/*
// @include     https://www.weibo.com/*
// @description    同屏显示多图微博的全部大图。
// @version     4.25
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at      document-end
// @icon        https://www.weibo.com/favicon.ico
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/535016/%E5%BE%AE%E5%8D%9A%E5%9B%BE%E7%89%87%E5%85%A8%E6%98%BE%E7%A4%BA%EF%BC%88%E5%9C%A8hzhbest%E5%9F%BA%E7%A1%80%E4%B8%8A%E6%94%B9%E8%BF%9B%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/535016/%E5%BE%AE%E5%8D%9A%E5%9B%BE%E7%89%87%E5%85%A8%E6%98%BE%E7%A4%BA%EF%BC%88%E5%9C%A8hzhbest%E5%9F%BA%E7%A1%80%E4%B8%8A%E6%94%B9%E8%BF%9B%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    // --这里是设置区-- //
    var topheight = 60; //微博顶栏高度
    var topspare = 125; //滚动预留顶部高度
    var autorefresh = true; //是否定时自动检测页面变化
    var loadLargeGif = GM_getValue('WBimgAll') || false; //是否载入大型动图

    // --以下是代码区，请不要随意改动-- //

    var regex = /weibo\.com\/\d{8,10}\/[a-z0-9A-Z]{9}\??/;
    var cur = -1    // "当前图片"序
    pinit();

    function pinit() {
        var bpimg = document.querySelector("img.big_pic");
        console.log("matched?: ", regex.test(document.location.href));
        if (regex.test(document.location.href)) {
            if (!bpimg) init();
        } else {
            var buttonbox = document.querySelector(".big_pic_b");
            if (!!buttonbox) buttonbox.parentNode.removeChild(buttonbox);
        }
        if (autorefresh) {
            setTimeout(pinit, 1000);
        }
    }

    function init() {
        var list_ul = document.querySelector("div.vue-recycle-scroller__item-view");
        var expbox = document.querySelector('div[class*="picture-box_row_"');
        document.querySelector('main>div[class^="Main_full_"]').style =
            "width: 800px;";
        if (!list_ul && !expbox) {
            console.log("no1");
            setTimeout(init, 1000);
            return;
        } else if (!!list_ul && !expbox) {
            console.log("no2", expbox);
            return;
        } else {
            var nyimg = document.querySelector(
                '[class*="woo-box-justifyCenter picture_mask_"]'
            );
            if (!!nyimg) {
                nyimg.click();
                setTimeout(() => {
                    expbox = document.querySelector('div[class*="picture-viewer_wrap_"]');
                    console.log("go9");
                    go(expbox);
                }, 600);
            } else {
                console.log("go");
                go(expbox);
            }
        }
    }

    function go(expbox) {
        var feedbox = document.querySelector(".vue-recycle-scroller__item-wrapper");
        var appbox = document.querySelector("WB_app_view");
        var videobox = document.querySelector('div[class*="card-video_videoBox_"');
        var maintextimgs = document.querySelectorAll(
            '[class^="detail_wbtext_"]>a[target]'
        );
        var dbox =
            document.body.getElementsByTagName("main")[0].parentNode.parentNode;
        dbox.style.maxWidth = "none";

        // Insert CSS
        var headID = document.getElementsByTagName("head")[0];
        var cssNode = creaElemIn("style", headID);
        cssNode.type = "text/css";
        cssNode.innerHTML = [
            ".big_pic_container{position: relative; display: inline-block; margin-bottom: 10px;}",
            ".big_pic{max-width: 890px; display: block;}",
            ".big_pic_n{max-width: 500px; display: block;}",
            ".big_pic:hover, .big_pic_n:hover{box-shadow: 0 0 30px 2px #f1ecdf;}",
            ".big_pic_poster{outline: 2px dashed #fcde44; outline-offset: -2px; cursor: pointer;}",
            ".big_pic_v{max-width: 90%; max-height: 80vh; cursor: pointer; display: none;}",
            ".big_pic_resolution{position: absolute; bottom: 5px; right: 5px; background: rgba(0,0,0,0.7); color: white; padding: 2px 5px; font-size: 16px; border-radius: 3px; font-family: Arial, sans-serif;}"
        ].join("");
        cssNode.innerHTML += [
            'main>div[class^="Main_full_"] {width: auto !important;min-width:800px;}',
            ".WB_frame_c {width: auto !important; max-width: 920px; min-width: 600px;}",
            ".WB_text.W_f14, .repeat_list .list_box .WB_text, .WB_expand>.WB_text{width: 490px;}",
            ".WB_frame_c .media_box{display: none !important;}",
            'div[node-type="comment_list"] .media_box{display: block !important;}',
            'div[id^="Pl_Core_RecommendFeed__"]{right: 150px; width: 100px !important; max-height: 35px; overflow: hidden; transition: all ease 0.2s 0.5s;}',
            'div[id^="Pl_Core_RecommendFeed__"]:hover{width: 300px !important; max-height: 1000px;}',
            'div[id^="Pl_Core_RecommendFeed__"] .opt_box{display:none;}',
            'div[id^="Pl_Core_RecommendFeed__"]:hover .opt_box{display: inline-block;}'
        ].join("");
        cssNode.innerHTML += [
            ".big_pic_b{position: fixed; left: 10px; top: 200px; z-index: 9999;}",
            ".big_pic_btn{height: 20px; min-width: 50px; width: fit-content; padding: 3px; margin-bottom: 20px; border: 1px solid white; color: white; background: rgba(133,133,133,0.6); cursor: pointer; user-select: none;}",
            ".big_pic_btn:hover{background: rgba(133,133,200,0.6);}",
            ".big_pic_ns{margin-bottom: 20px; width: 100px; display: grid; grid-template-columns: 1fr 1fr 1fr; grid-gap: 5px;}",
            ".big_pic_ns > div{font-size: 12px; line-height: 100px; text-align: center; height: 100px; width: 100px; background-clip: border-box; background-position: center; background-size: cover; padding: 0; border: 1px solid #7a7a7a; color: white; text-shadow: 0 0 2px black,0 0 2px black,0 0 2px black; cursor: pointer; user-select: none; opacity: 0.7;}",
            ".big_pic_ns > div:hover{font-size: 0px; outline: 2px solid #f8f87b; opacity: 1;}",
            ".big_pic_ns > div.curr{outline: 3px solid #f87bce; opacity: 0.9;}"
        ].join("");

        var buttonbox = creaElemIn("div", document.body);
        buttonbox.className = "big_pic_b";
        var sclink = creaElemIn("div", buttonbox);
        var tplink = creaElemIn("div", buttonbox);
        var nclink = creaElemIn("div", buttonbox);
        var n1link = creaElemIn("div", buttonbox);
        var n2link = creaElemIn("div", buttonbox);
        var nslink = creaElemIn("div", buttonbox);
        var n3link = creaElemIn("div", buttonbox);
        var swmode = creaElemIn("div", buttonbox);

        sclink.className = "big_pic_btn";
        sclink.innerHTML = "直达评论";
        sclink.addEventListener(
            "click",
            function () {
                var commentbox = document.querySelector("div.wbpro-tab3") || document.querySelector("#composerEle");
                scrollto(getTop(commentbox) - topheight * 2);
            },
            false
        );

        tplink.className = "big_pic_btn";
        tplink.innerHTML = "回到页顶";
        tplink.addEventListener(
            "click",
            function () {
                var headerbox = document.querySelector("header");
                scrollto(getTop(headerbox) - topheight * 2);
            },
            false
        );

        if (!!videobox) {
            cssNode.innerHTML = [
                ".big_pic_sc{position: fixed; left:10px; padding: 3px; border: 1px solid white; color: white; background: rgba(133,133,133,0.6); cursor: pointer;} ",
                ".big_pic_sc{top: 430px}",
            ].join("");
            return;
        }

        if (!!appbox) {
            return;
        }

        if (!!maintextimgs) {
            for (const i in maintextimgs) {
                if (/sinaimg.c(om|n)\/large/.test(maintextimgs[i].href)) {
                    var mtimg = document.createElement("img");
                    maintextimgs[i].parentNode.insertBefore(mtimg, maintextimgs[i]);
                    mtimg.src = maintextimgs[i].href;
                    mtimg.style =
                        "border: 3px dotted #64882e; width: auto !important; height: auto !important; max-width: 500px;";
                    maintextimgs[i].parentNode.removeChild(maintextimgs[i]);
                }
            }
        }

        var imgboxes;
        if (!!expbox.querySelector('[class*="picture-viewer_preview_"]')) {
            console.log("nine imgs");
            imgboxes = expbox.querySelectorAll(
                '[class*="picture-viewer_listContent_"]>div>div'
            );
            console.log(imgboxes.length);
        } else {
            imgboxes = expbox.querySelectorAll(
                'div[class*="woo-box-item-inlineBlock picture_item_"]'
            );
        }

        var bpboxes = [],
            imgsrc,
            imgn,
            imgl = imgboxes.length;
        var _limited = false;
        var root = expbox.parentNode;
        nslink.className = "big_pic_ns";
        var nslinks = [];

        var j = 0;
        for (var i = 0; i < imgl; i++) {
            var container = creaElemIn("div", root);
            container.className = "big_pic_container";
            bpboxes[i] = container;

            nslinks[i] = creaElemIn("div", nslink);
            nslinks[i].innerHTML = (i + 1);
            nslinks[i].name = i;

            var imgnode = imgboxes[i].querySelector("img");
            var imgvnode = imgboxes[i].querySelector("video");

            if (/sinaimg.c(om|n)/.test(imgnode.src)) {
                if (/sinaimg.c(om|n)\/(orj|thumb)\d{3}/.test(imgnode.src)) {
                    imgsrc = imgnode.src.replace(
                        /(sinaimg\.c(om|n)\/)(orj|thumb)\d{3}/,
                        "$1large"
                    );
                } else if (/sinaimg.c(om|n)\/large/.test(imgnode.src)) {
                    imgsrc = imgnode.src;
                }
                imgn = creaElemIn("img", container);
                imgn.src = imgsrc;
                imgn.className = "big_pic";
                imgn.title = "[ " + (i + 1) + " / " + imgl + " ]";
                nslinks[i].style.backgroundImage = 'url("' + imgnode.src + '")';

                imgn.onload = function() {
                    var resolution = creaElemIn("div", this.parentNode);
                    resolution.className = "big_pic_resolution";
                    resolution.textContent = this.naturalWidth + "×" + this.naturalHeight;
                };
            } else if (!!imgvnode) {
                if (/sinaimg.c(om|n)\/(orj|thumb)\d{3}/.test(imgvnode.poster)) {
                    imgsrc = loadLargeGif
                        ? imgvnode.poster.replace(
                            /(sinaimg\.c(om|n)\/)(orj|thumb)\d{3}/,
                            "$1large"
                        )
                        : imgvnode.poster;
                } else if (/sinaimg.c(om|n)\/large/.test(imgvnode.poster)) {
                    imgsrc = imgvnode.poster;
                }
                imgn = creaElemIn("img", container);
                imgn.src = imgsrc;
                imgn.className = "big_pic" + ((loadLargeGif) ? "" : " big_pic_poster");
                imgn.title = "[ " + (i + 1) + " / " + imgl + " ] 点击以视频方式播放";
                imgn.onclick = function (event) {
                    let pnode = event.target;
                    let vnode = pnode.parentNode.getElementsByTagName("video")[0];
                    pnode.style.display = "none";
                    vnode.style.display = "block";
                    vnode.play();
                };
                nslinks[i].style.backgroundImage = 'url("' + imgvnode.poster + '")';
                container.appendChild(imgvnode);
                imgvnode.className = "big_pic_v";
                imgvnode.controls = true;
                imgvnode.addEventListener("ended", function (event) {
                    let vnode = event.target;
                    let pnode = vnode.parentNode.getElementsByTagName("img")[0];
                    vnode.style.display = "none";
                    pnode.style.display = "block";
                });

                imgn.onload = function() {
                    var resolution = creaElemIn("div", this.parentNode);
                    resolution.className = "big_pic_resolution";
                    resolution.textContent = this.naturalWidth + "×" + this.naturalHeight;
                };
            } else {
                j += 1;
                continue;
            }
            nslinks[i].addEventListener(
                "click",
                function (e) {
                    scrollto(getTop(bpboxes[e.target.name]) - topspare + 25);
                },
                false
            );
            if (j == imgl) return;
        }
        if (j == imgl) {
            cssNode.innerHTML =
                ".big_pic_sc{position: fixed; left:10px; padding: 3px; border: 1px solid white; color: white; background: rgba(133,133,133,0.6); cursor: pointer;} .big_pic_sc{top: 430px}";
            return;
        }
        imgl = bpboxes.length;
        if (!!root) root.removeChild(expbox);

        nclink.className = "big_pic_btn";
        nclink.innerHTML = "图片限宽";
        nclink.addEventListener(
            "click",
            function () {
                var i;
                if (_limited) {
                    for (i = 0; i < imgl; i++) {
                        bpboxes[i].querySelector("img").className = "big_pic";
                    }
                    _limited = false;
                } else {
                    for (i = 0; i < imgl; i++) {
                        bpboxes[i].querySelector("img").className = "big_pic_n";
                    }
                    _limited = true;
                }
            },
            false
        );

        n1link.className = "big_pic_btn";
        n1link.innerHTML = "△首个图片";
        n1link.addEventListener(
            "click",
            function () {
                scrollto(getTop(bpboxes[0]) - topspare +25);
            },
            false
        );

        n2link.className = "big_pic_btn";
        n2link.innerHTML = "▲上个图片";
        n2link.addEventListener(
            "click",
            function () {
                var t = document.documentElement.scrollTop;
                for (var j = imgl - 1; j >= 0; j--) {
                    if (t > getTop(bpboxes[j]) + bpboxes[j].offsetHeight - topspare) {
                        scrollto(getTop(bpboxes[j]) - topspare + 25);
                        return;
                    }
                }
            },
            false
        );

        n3link.className = "big_pic_btn";
        n3link.innerHTML = "▼下个图片";
        n3link.addEventListener(
            "click",
            function () {
                var t = document.documentElement.scrollTop;
                for (var j = 0; j < imgl; j++) {
                    if (t < getTop(bpboxes[j]) - topspare) {
                        scrollto(getTop(bpboxes[j]) - topspare + 25);
                        return;
                    }
                }
            },
            false
        );

        swmode.className = "big_pic_btn";
        swmode.innerHTML = "↔切换动图模式";
        swmode.title = "切换为" + ((loadLargeGif) ? "显示封面静图" : "显示动图大图") + "并刷新页面";
        swmode.addEventListener(
            "click",
            function () {
                loadLargeGif = !loadLargeGif;
                GM_setValue('WBimgAll', loadLargeGif);
                location.reload();
            },
            false
        );

        waitscroll();

        document.onscroll = function () {
            var t = document.documentElement.scrollTop;
            var w = window.innerHeight;
            var percentage = 1 / 4;
            var linetop = t + w * percentage - topspare;
            var linebtm = t + w * (1 - percentage);
            var j, vh, vhmax = 0;
            if (getTop(bpboxes[0]) >= linebtm || getTop(bpboxes[imgl - 1]) + bpboxes[imgl - 1].offsetHeight <= linetop) {
                cur = -1;
            } else {
                for (j = imgl - 1; j >= 0; j--) {
                    let ti = getTop(bpboxes[j]), hi = bpboxes[j].offsetHeight;
                    if (ti < linebtm && (ti + hi) > linetop) {
                        vh = Math.min(linebtm, ti + hi) - Math.max(linetop, ti);
                        if (vh >= vhmax) {
                            vhmax = vh;
                            cur = j;
                        }
                    }
                }
            }
            if (cur !== -1) {
                for (j = imgl - 1; j >= 0; j--) {
                    if (j !== cur) {
                        nslinks[j].classList.remove("curr");
                    } else {
                        nslinks[j].classList.add("curr");
                    }
                }
            } else {
                for (j = imgl - 1; j >= 0; j--) {
                    if (j !== cur) {
                        nslinks[j].classList.remove("curr");
                    }
                }
            }
        };
    }

    function waitscroll() {
        var list_ul = document.querySelector("div.list_ul");
        if (
            !list_ul ||
            !list_ul.getElementsByTagName("div")[0] ||
            !document.querySelector("div.tips_rederror") ||
            document.documentElement.scrollTop < topheight + 70
        ) {
            setTimeout(waitscroll, 300);
            return;
        } else {
            scrollto(topheight);
        }
    }

    function scrollto(pos) {
        document.documentElement.scrollTop = pos;
    }

    function creaElemIn(tagname, destin) {
        var theElem = destin.appendChild(document.createElement(tagname));
        return theElem;
    }

    function getElem(xpath) {
        return document
            .evaluate(
                xpath,
                document,
                null,
                XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                null
            )
            .snapshotItem(0);
    }

    function getTop(e) {
        var offset = e.offsetTop;
        if (e.offsetParent != null) offset += getTop(e.offsetParent);
        return offset;
    }

})();
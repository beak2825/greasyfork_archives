// ==UserScript==
// @name         BaiduNav - 百度首页优化
// @namespace    shangandeyu
// @version      1.1.1
// @description  百度首页样式调整，删除多余元素，导航优化，导航图标获取，自定义搜索框透明度，专注首页导航页，支持登录、未登录状态，打造整洁好用的首页，优化首页体验
// @author       shangandeyu
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABjElEQVRoge2YbbHDIBBFj4RIiIRIiIRKiIRKwEElREIlREIlVEIk9P0gvEmYQCAfsMzkzOw/ZnqXewNb4Obm5mqq3AKOoIBxqjqrkkgq4A38ZqVyCoqhAb4sxRfTQIuOiy2+iAYUbvGiG1jLezENuPJeRAMt/siIbkARJ/4HfHIItQnNu6+JOrVoQ0zet+qZWHt03kW5oS4Qf+TjroAOHeV2a+GRvMe60QSIbyxNo2/hWXmPqZdDT4X+buwkrDbQrixMWbYb9q7baxeozOLn1U/l0/M2wlPm/fTI5cr7GdVR6M6begAMAoTsrRb0bfgRIGZPLUaSpwBBsaWwaAS5YZ5jfGv+j1GbnG6M0++bBzGflsHVAGg3hsTiB9ZnIpcW5yw0J4UbZtf3aAmiQl/rV+16HSoE7UaPbto1/DnpOG9WGpkuotSc4UaPgFfrjn0zVJZd9xHjhoinlTViJtqQv47ZeBHWhMqkL4hQN0Q7AXqXfUdo9lMoBNdwKO4k2sKMALtuT0mIz/3NTWn8ARfzVP7n/lZLAAAAAElFTkSuQmCC
// @license      GPL-3.0
// @run-at       document-end
// @match        https://www.baidu.com/
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/397922/BaiduNav%20-%20%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/397922/BaiduNav%20-%20%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let $ = unsafeWindow.jQuery;
    let user = document.getElementById("s_username_top");
    if(user == null) user = document.getElementById("s-top-username");
    if(user != null){
        if($("#s_menu_mine").children('.s-menu-item-underline').length > 0) {
            document.getElementsByTagName("html")[0].style.overflow="auto";
            document.body.style.overflow="auto";

            document.getElementsByClassName("set-btn set-edit")[0].addEventListener('click',function(){document.getElementById("sui-dialog-mask").remove()});

//             document.getElementById("lg").style.height="50px";
//             document.getElementById("lg").style.minHeight="50px";

//             document.getElementById("head_wrapper").style.height="0px";
//             document.getElementById("head_wrapper").style.minHeight="0px";
//             document.getElementById("head").style.minHeight="0px";
//             document.getElementById("head").style.overflow="auto";

//             document.getElementById("s_fm").style.height="0px";
//             document.getElementById("s_fm").style.minHeight="0px";

//             document.getElementById("s_lg_img").remove();
//             document.getElementById("s_lg_img_new").remove();

            //             document.getElementById("s_icons").innerHTML = '<a class="s-skin" href="#" onclick="return false;" data-tid="2001" title="换肤" style="visibility:hidden"><span class="s-icon s-icon-skin"></span><span class="title">换肤</span></a>';
//             document.getElementById("s_icons").style.opacity = 0;
//             document.getElementById("s_icons").addEventListener('mouseenter',function(){
//                 document.getElementById("s_icons").style.opacity = 1;
//             });
//             document.getElementById("s_icons").addEventListener('mouseleave',function(){
//                 document.getElementById("s_icons").style.opacity = 0;
//             });
//             document.getElementsByClassName("show-vertical")[0].style.visibility="hidden";

//             let len = document.getElementsByClassName("mnav").length;
//             for(let i = 0; i < len; i++){
//                 let mnav = document.getElementsByClassName("mnav")[0];
//                 if (mnav != null) {
//                     mnav.parentNode.removeChild(mnav);
//                 }
//             }

//             document.getElementById("s_wrap").style.marginTop = "91px";

//             document.getElementsByClassName("s-block-container")[0].style.paddingTop = "10px";
            document.getElementById("s_menu_gurd").remove();

//             document.getElementsByClassName("c-color-text")[0].innerHTML = "";
//             GM_xmlhttpRequest({
//                 method: 'GET',
//                 url: 'http://open.iciba.com/dsapi/',
//                 responseType: "json",
//                 onload: response => {
//                     document.getElementsByClassName("c-color-text")[0].innerHTML = response.response.note;
//                 },
//                 onerror: function(res) {
//                     document.getElementsByClassName("c-color-text")[0].innerHTML = "那些无法看破的叹息，某天会是看淡的风景，虽然那风景，永远有谁缺席。";
//                 }
//             });

//             let setBar = document.getElementsByClassName("set-bar-content")[0];
//             let setMenu = setBar.getElementsByTagName("div")[0];
//             setBar.style.width = setMenu.offsetWidth+"px";
//             setBar.style.height = setMenu.offsetHeight+"px";
//             setMenu.style.display = "none";
//             setBar.addEventListener("mouseenter", function(){
//                 setMenu.style.display = "";
//             });
//             setMenu.addEventListener("mouseleave", function(){
//                 setMenu.style.display = "none";
//             });

//             document.getElementsByName("tj_briicon")[0].remove();
//             document.getElementById("s_usersetting_top").style.paddingRight = "4%";

//             document.getElementById("s_content_100").setAttribute('data-loaded', '1');
//             document.getElementsByClassName("rect")[0].remove();

//             document.getElementById("bottom_layer").remove();
//             document.getElementById("bottom_space").remove();

//             document.getElementsByClassName("p-sidebar js-player-open")[0].remove();
//             document.getElementsByClassName("qrcode-layer icon-mask-wrapper")[0].remove();

            let icondiv = document.getElementsByClassName("nav-icon-normal");
            if(icondiv.length > 0) {
                let ids = new Array();
                for(let i = 0; i < icondiv.length; i++) {
                    //         if("" == icondiv[i].innerHTML) {
                    //             continue;
                    //         }
                    let url = icondiv[i].parentNode.href;
                    let domain = url.split('/');
                    let src = "";
                    for(let j = 0; j < domain.length && j < 3; j++) {
                        src += domain[j];
                        if(domain[j].indexOf("http") > -1) {
                            src += "//";
                        }
                    }
                    src += "/favicon.ico";
                    if (!GM_getValue(src)) {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: src,
                            synchronous: true,
                            responseType: "blob",
                            context: {"src": src, "div": icondiv[i]},
                            onload: function (res) {
                                let obj = res.context;
                                let src = obj.src;
                                let div = obj.div;
                                if (res.readyState == 4 && res.status == 200 || res.status == 304) {
                                    let reader = new FileReader();
                                    reader.readAsDataURL(res.response);
                                    reader.onload = function () {
                                        let img = new Image();
                                        img.onload = function() {
                                            GM_setValue(src, reader.result);
                                            //                                         localStorage[src] = reader.result;
                                            div.innerHTML = '<img src="' + reader.result + '" width="32px" height="32px">';
                                            div.className = "nav-icon";
                                        };
                                        img.src = res.finalUrl;
                                    }
                                }
                            }
                        });
                    } else {
                        //                     icondiv[i].innerHTML = '<img src="' + localStorage[src] + '" width="32px" height="32px">';
                        icondiv[i].innerHTML = '<img src="' + GM_getValue(src) + '" width="32px" height="32px">';
                        icondiv[i].id = src;
                        ids.push(src);
                    }
                }
                for(let i = 0; i < ids.length; i++) {
                    document.getElementById(ids[i]).className = "nav-icon";
                }
            } else {
                let imgs = document.getElementsByTagName("img");
                setImg(imgs);
            }
        } else {
            document.getElementsByTagName("html")[0].style.overflow="auto";
            document.body.style.overflow="auto";

            document.getElementsByClassName("set-btn set-edit")[0].addEventListener('click',function(){document.getElementById("sui-dialog-mask").remove()});

            document.getElementById("lg").style.height="50px";
            document.getElementById("lg").style.minHeight="50px";

            //             document.getElementsByClassName("s-skin-container s-isindex-wrap")[0].remove();

            document.getElementById("head_wrapper").style.height="0px";
            document.getElementById("head_wrapper").style.minHeight="0px";
            document.getElementById("head").style.minHeight="0px";

            document.getElementById("s_fm").style.height="0px";
            document.getElementById("s_fm").style.minHeight="0px";

            //             document.getElementById("s_icons").innerHTML = '<a class="s-skin" href="#" onclick="return false;" data-tid="2001" title="换肤" style="visibility:hidden"><span class="s-icon s-icon-skin"></span><span class="title">换肤</span></a>';
            document.getElementById("s_icons").style.opacity = 0;
            document.getElementById("s_icons").addEventListener('mouseenter',function(){
                document.getElementById("s_icons").style.opacity = 1;
            });
            document.getElementById("s_icons").addEventListener('mouseleave',function(){
                document.getElementById("s_icons").style.opacity = 0;
            });
            document.getElementsByClassName("show-vertical")[0].style.visibility="hidden";

            let logoSrc = document.getElementById("s_lg_img_new").src;
//             document.getElementById("s_lg_img").remove();
            document.getElementById("s_lg_img_new").remove();
            logoHref(logoSrc);

            document.getElementById("form").style.width = "841px";
            document.getElementById("form").style.left = "-12px";
            let fmOpacity = GM_getValue("fmOpacity");
            if(document.getElementsByClassName("s-skin-container s-isindex-wrap")[0].style.backgroundColor !="" && document.getElementsByClassName("s-skin-container s-isindex-wrap")[0].style.backgroundColor != "rgba(0, 0, 0, 0) none repeat scroll 0% 0%") {
                if(fmOpacity == null || fmOpacity == "undefined") {
                    fmOpacity = 100;
                }
                document.getElementById("form").style.opacity = fmOpacity + "%";
            }

            let currentMousePos = {
                x: 0
            },
                isDraging = false;
            let startDrag = function(e) {
                if(isDraging) {
                    return
                }
                isDraging = true;
                currentMousePos = {
                    x: e.clientX
                }
            };
            let draging = function(e) {
                if(isDraging) {
                    doNewPos(e.clientX)
                }
            };
            let doNewPos = function(x, ifend) {
                let offset = Math.floor((x - currentMousePos.x) / 66 * 100 / 5) * 5;
                let newOpacity = fmOpacity + offset;
                if(newOpacity <= 0) {
                    newOpacity = 0
                }
                if(newOpacity > 100) {
                    newOpacity = 100
                }
                $("#s_fm_ajust_btn").css("left", newOpacity / 100 * 66 + "px");
                $("#s_fm_ajust_txt").html(newOpacity + "%");
                document.getElementById("form").style.opacity = newOpacity + "%";
                ifend && (fmOpacity = newOpacity) && GM_setValue("fmOpacity", fmOpacity);
            };
            let endDrag = function(e) {
                if(isDraging) {
                    doNewPos(e.clientX, true);
                    isDraging = false
                }
            };
            let fmOpacityFlag = true;
            let changeSkin = function() {
                if(fmOpacityFlag) {
                    setTimeout(function (){
                        document.getElementById("s_skin_layer_cell").style.width = "1076px";
                        $("#s_skin_opacity_set").after(`<div class="s-skin-opacity-set" style="margin-left:30px" id="s_skin_fm_opacity_set"><span class="bg-hideOrShowAjax" style="visibility:visible"><span class="bg-alphaBarTitle">搜索透明度</span><span class="bg-alphaBar" id="s_fm_ajust_bar"><span class="bg-alphaBarMoveBtn" id="s_fm_ajust_btn" style="left:` + fmOpacity / 100 * 66 + `px"><em class="bg-alphaBarOpacity" id="s_fm_ajust_txt">` + fmOpacity + `%</em></span></span></span></div>`);
                        $("#s_fm_ajust_btn").on("mousedown", function(e) {
                            startDrag(e)
                        });
                        $("#s_skin_layer").on("mousemove", function(e) {
                            e.preventDefault();
                            draging(e)
                        });
                        $("#s_skin_layer").on("mouseup", function(e) {
                            endDrag(e)
                        });
                        $("#s_skin_layer").on("mouseleave", function(e) {
                            endDrag(e)
                        });
                        $("#s_fm_ajust_btn").on("click", function(e) {
                            e.stopPropagation()
                        });
                        $("#s_fm_ajust_bar").on("click", function(e) {
                            currentMousePos.x = $("#s_fm_ajust_bar").offset().left + parseInt($("#s_fm_ajust_btn").css("left").replace(/px$/g, ""));
                            doNewPos(e.clientX, true)
                        });
                        document.getElementById("form").style.opacity = fmOpacity + "%";
                        fmOpacityFlag = false;
                        let unskin = document.getElementsByClassName("s-skin-set skin-has-bg");
                        let unskinFun = function(){
                            document.getElementById("s_lg_img_new").src = "//www.baidu.com/img/bd_logo1.png?qua=high";
                            document.getElementById("form").style.opacity = 1;
                            document.getElementById("s_skin_fm_opacity_set").remove();
                            document.getElementById("s_skin_layer_cell").style.width = "911px";
                            unskin[0].removeEventListener("click",unskinFun);
                            fmOpacityFlag = true;
                        };
                        unskin[0].addEventListener('click',unskinFun);
                    },500);
                }
            }

            let skinDiy = function(){
                if(document.getElementsByClassName("s-skin-container s-isindex-wrap")[0].style.backgroundColor !="" && document.getElementsByClassName("s-skin-container s-isindex-wrap")[0].style.backgroundColor != "rgba(0, 0, 0, 0)") {
                    changeSkin();
                };
                setTimeout(function (){
                    Array.prototype.forEach.call(document.getElementsByClassName("skin-img-item"), function (element) {
                        element.addEventListener('click',changeSkin);
                    });
                },500);
            }
            document.getElementsByClassName("s-skin")[0].addEventListener('mouseup',skinDiy);

            let len = document.getElementsByClassName("mnav").length;
            for(let i = 0; i < len; i++){
                let mnav = document.getElementsByClassName("mnav")[0];
                if (mnav != null) {
                    mnav.parentNode.removeChild(mnav);
                }
            }

            document.getElementById("s_wrap").style.marginTop="73px";

            document.getElementsByClassName("s-block-container")[0].style.paddingTop = "4px";
            //     document.getElementsByClassName("s-menu-container")[0].remove();
            document.getElementById("s_menu_gurd").remove();

            document.getElementsByClassName("mine-title")[0].innerHTML = "";
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'http://open.iciba.com/dsapi/',
                responseType: "json",
                onload: response => {
                    document.getElementsByClassName("mine-title")[0].innerHTML = response.response.note;
                },
                onerror: function() {
                    document.getElementsByClassName("mine-title")[0].innerHTML = "那些无法看破的叹息，某天会是看淡的风景，虽然那风景，永远有谁缺席。";
                }
            });

            document.getElementsByName("tj_briicon")[0].remove();
            document.getElementById("s_usersetting_top").style.paddingRight = "4%";

            document.getElementsByClassName("s-code-blocks s-block-nav")[0].style.marginTop = "0px";
            document.getElementById("s_content_100").setAttribute('data-loaded', '1');

            document.getElementsByClassName("rect")[0].remove();
            document.getElementsByClassName("s-more-bar")[0].remove();

            document.getElementById("bottom_layer").remove();
            document.getElementById("bottom_space").remove();

            document.getElementsByClassName("p-sidebar js-player-open")[0].remove();
            document.getElementsByClassName("qrcode-layer icon-mask-wrapper")[0].remove();

            let imgs = document.getElementsByClassName("nav-icon");
            setImg(imgs);
        }
    } else {
        let len = document.getElementsByClassName("mnav").length;
        for(let i = 0; i < len; i++){
            let mnav = document.getElementsByClassName("mnav")[0];
            if (mnav != null) {
                mnav.parentNode.removeChild(mnav);
            }
        }
        if(document.getElementById("virus-2020") != null) {
            document.getElementById("virus-2020").style.display = "none";
        }
        logoHref();
        //         let s_lg_img = document.getElementById("s_lg_img");
        //         if(s_lg_img != null && s_lg_img.style.display != "none") {
        //             if(s_lg_img.getAttribute("src") == "//www.baidu.com/img/bd_logo1.png"){
        //                 s_lg_img.setAttribute("usemap", "");
        //             } else {
        //                 let area = document.getElementsByName("mp")[0].getElementsByTagName("area")[0];
        //                 area.setAttribute("href", area.href.split("?")[0] + "?wd=" + getUrlParam(area.href, "wd"));
        //             }
        //         }
        let tj_briicon = document.getElementsByName("tj_briicon");
        if(tj_briicon != null && tj_briicon.length != 0) {
            tj_briicon[0].outerHTML='<a></a>';
        }
        if(document.getElementById("qrcode") != null) {
            document.getElementById("qrcode").style.display = "none";
        }
        if(document.getElementById("ftConw") != null) {
            document.getElementById("ftConw").style.display = "none";
        }
        if(document.getElementById("bottom_layer") != null) {
            document.getElementById("bottom_layer").style.display = "none";
        }
    }

    function setImg(imgs) {
        for(let i = 0; i < imgs.length; i++) {
            if("https://dss0.bdstatic.com/k4oZeXSm1A5BphGlnYG/icon/6000.png?3" != imgs[i].src) {
                continue;
            }
            let url = imgs[i].parentNode.href ? imgs[i].parentNode.href : imgs[i].parentNode.parentNode.href;
            //         if("" == url) {
            //             continue;
            //         }
            let domain = url.split('/');
            let src = "";
            for(let j = 0; j < domain.length && j < 3; j++) {
                src += domain[j];
                if(domain[j].indexOf("http") > -1) {
                    src += "//";
                }
            }
            src += "/favicon.ico";

            if (!GM_getValue(src)) {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: src,
                    responseType: "blob",
                    context: i + "|" + src,
                    onload: function (res) {
                        let context = res.context.split("|")
                        let index = context[0];
                        let src = context[1];
                        if (res.readyState == 4 && res.status == 200 || res.status == 304) {
                            let reader = new FileReader();
                            reader.readAsDataURL(res.response);
                            reader.onload = function () {
                                let img = new Image();
                                img.onload = function() {
                                    //                                         localStorage[src] = reader.result;
                                    GM_setValue(src, reader.result);
                                    imgs[index].src = reader.result;
                                };
                                img.onerror = function () {
                                    setDefaultImg(imgs[index], src);
                                };
                                img.src = res.finalUrl;
                            }
                        } else {
                            setDefaultImg(imgs[index], src);
                        }
                    },
                    onerror: function(res) {
                        let context = res.context.split("|");
                        let index = context[0];
                        let src = context[1];
                        setDefaultImg(imgs[index], src);
                    },
                    onabort: function(res) {
                        let context = res.context.split("|")
                        let index = context[0];
                        let src = context[1];
                        setDefaultImg(imgs[index], src);
                    }
                });
            } else {
                imgs[i].src = GM_getValue(src);
            }
            //         imgs[i].outerHTML = '<img src="'+ src +'"  class="nav-icon" width="16" height="16" onerror="https://dss0.bdstatic.com/k4oZeXSm1A5BphGlnYG/icon/6000.png?3">';
        }
    }

    function setDefaultImg(imgTag, key) {
        var url = "https://dss0.bdstatic.com/k4oZeXSm1A5BphGlnYG/icon/6000.png?3";
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            responseType: "blob",
            onload: function (res) {
                if (res.readyState == 4 && res.status == 200 || res.status == 304) {
                    let reader = new FileReader();
                    reader.readAsDataURL(res.response);
                    reader.onload = function () {
                        let img = new Image();
                        img.onload = function() {
                            GM_setValue(key, reader.result);
                            imgTag.src = reader.result;
                        };
                        img.onerror = function () {
                            imgTag.src = url;
                        };
                        img.src = res.finalUrl;
                    }
                }
            }
        });
    }

    function getUrlParam(url, name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = url.split("?")[1].match(reg);
        if (r != null) {return decodeURIComponent(r[2]);}
        return null;
    }

    function logoHref(logoSrc) {
        let mp = $("map[name='mp']").first().children(":first");
        if(mp.attr("href").indexOf("%E4%BB%8A%E6%97%A5%E6%96%B0%E9%B2%9C%E4%BA%8B&tn") > -1) {
            mp.removeAttr("href");
            $("#s_kw_wrap").before(`<span class="btn_wr s_btn_wr"><img id="s_lg_img_new" src="` + logoSrc + `" onerror="this.src='https://dss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/logo_white-c4d7df0a00.png';this.onerror=null;" usemap="#mp" title="" cursor="default" id="" style="margin-left: -100px;bottom:-17px;left:0px;" width="200" height="100"></span>`);
        } else {
            mp.attr("href", "//www.baidu.com/s?wd=" + getUrlParam(mp.attr("href"), "wd"));
            $("#s_kw_wrap").before(`<span class="btn_wr s_btn_wr" style="margin-right:10px"><img id="s_lg_img_new" src="` + logoSrc + `" onerror="this.src='https://dss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/logo_white-c4d7df0a00.png';this.onerror=null;" usemap="#mp" title="" cursor="default" id="" style="bottom:-30px;left:43px;" width="200" height="100"></span>`);
        }
    }

})();


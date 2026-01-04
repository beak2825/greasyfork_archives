// ==UserScript==
// @name         百度去广告，blur(毛玻璃)搜索框，美化
// @version      24.12.31.2
// @description  百度搜索框背景模糊，去广告，美化
// @author       L
// @include      *://www.baidu.com/
// @include      *://www.baidu.com/?tn*
// @include      *://www.baidu.com/s?*
// @include      *://www.baidu.com/*wd*
// @include      *://www.baidu.com/search/*
// @include      *://baidu.com/
// @include      *://baidu.com/s?*
// @include      *://baidu.com/*wd*
// @include      *://baidu.com/search/*
// @grant        none
// @namespace    L-BaiduBlur
// @homepage     https://www.ihawo.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/370756/%E7%99%BE%E5%BA%A6%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%8Cblur%28%E6%AF%9B%E7%8E%BB%E7%92%83%29%E6%90%9C%E7%B4%A2%E6%A1%86%EF%BC%8C%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/370756/%E7%99%BE%E5%BA%A6%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%8Cblur%28%E6%AF%9B%E7%8E%BB%E7%92%83%29%E6%90%9C%E7%B4%A2%E6%A1%86%EF%BC%8C%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==
(function() {
    class Blur {
        constructor() {
            var _this = this;
            this.updata = 1;
            this.attrNum = 1;
            this.initStatus = 1;
            this.right = localStorage.getItem('blur-right');
            this.beautify = localStorage.getItem('blur-beautify');
            this.tab = localStorage.getItem('blur-tab');
            this.indexHide = localStorage.getItem('blur-index-hide');
            this.indexAutoHideNews = localStorage.getItem('blur-index-auto-hide-news');
            this.indexAutoHideHot = localStorage.getItem('blur-index-auto-hide-hot');
            this.inMiddle = localStorage.getItem('blur-in-middle');
            this.hideBaijia = localStorage.getItem('blur-hide-baijia');
            this.bg = localStorage.getItem('blur-bg');
            this.browser = myBrowser();
            this.css = 0;
            this.showSetting = 0;
            this.removeAdTimer = '';
            this.tabTimer = '';
            this.removeAdTimes = 0;
            this.init = function () {
               var timer = setInterval(function() {
                   if (document.getElementsByTagName('html').length) {
                       _this.addBaseStyle();
                   }

                   if (typeof $ == 'function') {
                        clearInterval(timer);

                         $.fn.resizeEnd = function (callback, timeout) {
                        $(this).resize(function () {
                            var $this = $(this);
                            if ($this.data('resizeTimeout')) {
                                clearTimeout($this.data('resizeTimeout'));
                            }
                            $this.data('resizeTimeout', setTimeout(callback, timeout));
                        });
                    };
                    $(window).resizeEnd(_this.doInMiddle, 200)
                    if (_this.browser == 'Chrome') {
                        var version = getChromeVersion();
                        if (version >= 76) {
                            _this.css = 1;
                        }
                    }
                    else if (_this.browser == 'Safari') {
                        _this.css = 1;
                    }
                    $('#form').submit(function(){
                        if (_this.hideBaijia == 1) {
                            var searchStr = $("#kw").val();
                            if (searchStr.indexOf('-baijia') == -1) {
                                $("#kw").val($("#kw").val() + ' -baijia');
                                $('#form').submit();
                                return false;
                            }
                        }
                    })
                    $('#kw').bind("input propertychange",function(event){
                        _this.doBg();
                    });
                    _this.addSettingDiv();
                    _this.initTab();
                    _this.initBlur();
                    _this.initShowRight();
                    _this.initBeautify();
                    _this.initIndexHide();
                    _this.initIndexAutoHideNews();
                    _this.initIndexAutoHideHot();
                    _this.initInMiddle();
                    _this.removeAd();
                    _this.initHideBaijia();
                    _this.initBg();
                    _this.initStatus = 0;
                   }
               }, 100)
            };
            this.addSettingDiv = function () {
                $('html').append('<div style="width:300px;height:500px;background:white;position: fixed;z-index: 999999999999999999999;top:15%;left:0;right:0;margin-right: auto;margin-left:auto;box-shadow:0px 0px 10px 2px #ccc;border-radius: 10px;display:none;padding: 10px;" id="bsetting"><div style="font-size:18px;padding: 15px;">blur插件设置</div></div>');
                var option = '<span class="c-gap-left showBsetting"><label><span>显示插件设置</span></label></span>';
                $(".search_tool_conter").append(option);
                var indexOption = '<a class="showBsetting" href="javaScript:;"><span class="set" style="pointer-events: auto;">插件设置</span></a>';
                $("#s-user-setting-menu").append(indexOption);
                setTimeout(function(){
                    $(".bdpfmenu").append(indexOption);
                }, 2000)

                $("html").on('click', '.showBsetting', function () {
                    $("#bsetting").fadeIn(300);
                    $("#wrapper").css("filter", 'blur(15px)');
                    $("#blur-search-bg").css("filter", 'blur(15px)');
                    $("#wrapper *").css("pointer-events", 'none');
                    setTimeout(function () {
                        _this.showSetting = 1;
                    }, 500);
                });
                $("html").on('click', '#wrapper', function () {
                    if (_this.showSetting) {
                        $("#bsetting").fadeOut(300);
                        $("#wrapper").css("filter", '');
                        $("#blur-search-bg").css("filter", '');
                        $("#wrapper *").css("pointer-events", 'auto');
                        _this.showSetting = 0;
                    }
                });
            };
            this.addBaseStyle = function () {
                var style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = ".result,.c-container,.result div,.c-container div,#t_tab,#head,#u,.s_form,#content_right,.container_l{}  #content_right>div{display:none}.soutu-btn{background: url(https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/soutu/img/camera_new_5606e8f.png) no-repeat;}#pageBulrBg{pointer-events:none}.wrapper_new #u{margin: 0 0 0;}";
                document.getElementsByTagName('html').item(0).appendChild(style);
                if (_this.beautify == 1 || _this.beautify == null) {
                    var style = document.createElement('style');
                    style.type = 'text/css';
                    style.className = 'mainStyle';
                    style.innerHTML = "document,html,body,.c-table th,#page,.wrapper_new #form .bdsug-new{background:#eee} #page .fk,a .fk,.qrcodeCon{display:none} #s_tab{height:47px} em{ color: #ce4343;} .result a,.c-container a,.result-op a,.result em,.c-container em,.result-op em,#u a{text-decoration:none!important;} a{color:#4879BD} #rs{background:none;padding:20px} #rs a{text-decoration:none} #page a, #page strong{height:auto;background:none;border:none;overflow:unset;}#page strong .pc{background:#596dbb} #page .pc,#page .n{border: 1px solid #ccc;border-radius:6px;} #s_tab{background:none} .c-border{border: none;    box-shadow: none;} #foot,#help{background:none}#u{margin-top:30px} #s_tab{padding-top:86px } .c-border{padding:0;background:none}.result-op>tbody>tr>td{padding:20px!important}@media screen and (max-width: 1216px){.result,.c-container,.result-op,.result-op>tbody>tr>td{padding:15px;}}";
                    if (document.URL.indexOf('wd=') != -1) {
                        style.innerHTML = "document,html,body,.c-table th,#page{background:#eee} #page .fk,a .fk,.qrcodeCon{display:none} #s_tab{height:47px} #content_left>.result:hover,#content_left>.c-container:hover,.result-op:not(.xpath-log):not(#rs_new):hover{box-shadow: 5px 5px 7px #ccc;} .result>div,.c-container>div,.result-op>div{margin:10px 0} .result,.c-container,.result-op{background:#fafafa;padding:20px;border-radius: 5px;box-shadow: 5px 5px 7px #ddd;transition:all 0.3s;margin: 0 15px 25px 0!important;} em{    color: #ce4343;} .result a,.c-container a,.result-op a,.result em,.c-container em,.result-op em,#u a{text-decoration:none!important;} a{color:#4879BD} #rs{background:none;padding:20px} #rs a{text-decoration:none} #page a, #page strong{height:auto;background:none;border:none;overflow:unset;}#page strong .pc{background:#596dbb}#page .pc,#page .n{border: 1px solid #ccc;border-radius:6px;} #s_tab{background:none} .c-border{border: none;    box-shadow: none;} #foot,#help{background:none}#u{margin-top:30px} #s_tab{padding-top:86px }body,#head{background:#eee}#head{height: 60px;top:0} .c-border{padding:0;background:none}.result-op>tbody>tr>td{padding:20px!important}@media screen and (max-width: 1216px){.result,.c-container,.result-op>tbody>tr>td{padding:15px;}}.cu-border{box-shadow:none;}[class*='card-shadow']{box-shadow:none;}#kw{height:36px;line-height: 37px;}";
                    }
                    document.getElementsByTagName('html').item(0).appendChild(style);
                }
            };
            this.initShowRight = function () {
                if (_this.right == undefined || _this.right == null) {
                    _this.right = 1;
                    localStorage.setItem('blur-right', 1);
                }
                _this.isShowRight();
                $(function () {
                    _this.addShowRightTool();
                });
            };
            this.initBeautify = function () {
                if (_this.beautify == undefined || _this.beautify == null || _this.beautify == 1) {
                    _this.beautify = 1;
                    localStorage.setItem('blur-beautify', 1);
                }
                _this.doBeautify();
                $(function () {
                    _this.addBeautifyTool();
                    _this.doBeautify();
                    $(".head_wrapper").on('DOMNodeInserted', function (e) {
                        if (e.target.id == 'ent_sug') {
                            setTimeout(function () {
                                _this.doBeautify();
                            }, 100);
                        }
                    });
                    $(document).ajaxSuccess(function (_e, _xhr, opt) {
                        var url = opt.url;
                        if (url.indexOf('submit/setuskin') != -1) {
                            _this.doBeautify();
                        }
                    });
                    $('#kw').on('change', function () {
                        if ($('.s-skin-container').length > 0) {
                            setTimeout(function () {
                                _this.doBeautify();
                            }, 50);
                        }
                    });
                });
            };
            this.initBlur = function () {
                if (_this.css) {
                    $(function () {
                        _this.blur();
                    });
                }
                else {
                    $('html').append('<style></style>');
                    $(function () {
                        $(window).scroll(function () {
                            var top = $(window).scrollTop();
                            $("#headerBulrBg").css('top', -top + "px");
                        });
                        $(document).ajaxSend(function (_e, _xhr, opt) {
                            var url = opt.url;
                            if (url.indexOf('/s?') != -1 && (url.indexOf('&wd=') != -1 || url.indexOf('?wd=') != -1) && url.indexOf('&_ck=') == -1) {
                                $(".headBgDiv").remove();
                            }
                        });
                        _this.blur();
                    });
                }
                $(function () {
                    $(document).ajaxSuccess(function (_e, _xhr, opt) {
                        var url = opt.url;
                        if (url.indexOf('/s?') != -1 && (url.indexOf('&wd=') != -1 || url.indexOf('?wd=') != -1) && url.indexOf('&_ck=') == -1) {
                            setTimeout(function () {
                                _this.addShowRightTool();
                                _this.addBeautifyTool();
                                _this.addTabTool();
                                _this.addIndexHideTool();
                                _this.addInMiddleTool();
                                _this.doBeautify();
                                $("#bIndexHide").remove();
                                $("#s_upfunc_menus,#u_sp,#s_upfunc_menus *,#u_sp *").unbind('mouseover').unbind('mouseout');
                                setTimeout(function () {
                                    _this.removeAd();
                                }, 2300);
                                _this.removeAd();
                                _this.blur();
                                _this.doInMiddle();
                            }, 100);
                        }

                        if (url.indexOf('data/mancardwater') != -1) {
                            _this.removeAd();
                        }
                    });
                    $("#wrapper_wrapper").on('DOMNodeInserted', function (e) {
                        if (e.target.id == "container" && e.target.class == undefined) {
                            setTimeout(function () {
                                _this.addShowRightTool();
                                _this.addBeautifyTool();
                                _this.addTabTool();
                                _this.addIndexHideTool();
                                _this.addInMiddleTool();
                                _this.doBeautify();
                                _this.removeAd();
                                _this.blur();
                                _this.doInMiddle();
                                $("#bIndexHide").remove();
                                $("#s_upfunc_menus,#u_sp,#s_upfunc_menus *,#u_sp *").unbind('mouseover').unbind('mouseout');
                            }, 100);
                        }
                    });
                });
            };
            this.initTab = function () {
                if (_this.tab == undefined || _this.tab == null) {
                    _this.tab = 0;
                    localStorage.setItem('blur-tab', 0);
                }
                _this.setTab();
                $(function () {
                    _this.addTabTool();
                });
            };
            this.addShowRightTool = function () {
                if ($('.blur-right').length == 0) {
                    var checked = 'checked';
                    if (_this.right == 0) {
                        checked = '';
                    }
                    var option = '<div class="c-gap-left" style="font-size:14px;padding: 5px 0;"><label><input type="checkbox" class="blur-right" style="margin-top:3px;vertical-align:middle;  " ' + checked + ' ><span style="vertical-align:middle;cursor: pointer;">显示右侧</span></label></div>';
                    $("#bsetting").append(option);
                    setTimeout(function () {
                        $(".blur-right").change(_this.toggleRight);
                    }, 50);
                }
            };
            this.isShowRight = function () {
                if (_this.right == 0) {
                    $('html').append("<style class='bright'>#content_right{opacity:0} </style>");
                    setTimeout(function () {
                        if (_this.right == 0) {
                            $(".bright").text('#content_right{display:none}');
                        }
                    }, 500);
                }
                else {
                    $('.css-blur-right').remove()
                    $(".bright").text('#content_right{opacity:0}');
                    setTimeout(function () {
                        if (_this.right == 1) {
                            $(".bright").text('#content_right{opacity:1}');
                        }
                    }, 100);
                    setTimeout(function () {
                        if (_this.right == 1) {
                            $(".bright").remove();
                        }
                    }, 500);
                }
                _this.setTab();
            };
            this.toggleRight = function () {
                if (this.checked) {
                    _this.right = 1;
                    localStorage.setItem('blur-right', 1);
                }
                else {
                    _this.right = 0;
                    localStorage.setItem('blur-right', 0);
                }
                _this.isShowRight();
                _this.doInMiddle(true);
            };
            this.beautifyLogo = function () {
                if (_this.isNotHaveBackGround()) {
                    if (_this.beautify != 0) {
                        $("#lg img,#result_logo img").attr('src', 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMTAxIDMzIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMDEgMzM7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojNDg3OUJEO30KCS5zdDF7ZmlsbDojREQ0NDM2O30KCS5zdDJ7ZmlsbDojRkZGRkZGO30KPC9zdHlsZT4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTUwLjQsMTUuM2MtMy44LDAuMy00LDIuNi01LjcsNC43Yy0xLjgsMi4yLTUuNSw0LjEtNiw2LjdjLTAuNiwzLjMsMS4zLDUuMSwzLDUuN2MxLjksMC42LDYuMi0wLjUsOC40LTAuNWgwLjIKCWgwLjJjMi4yLDAsNi40LDEuMSw4LjQsMC41YzEuOC0wLjYsMy41LTMuMiwzLTUuN2MtMC40LTIuMS00LjQtNC41LTYuMi02LjdDNTQuMiwxOCw1NC4zLDE1LjYsNTAuNCwxNS4zeiBNMzcsMTQuOAoJYzAsMi40LDEuNiw0LjMsMy40LDQuM2MxLjksMCwzLjQtMS45LDMuNC00LjNjMC0yLjQtMS42LTQuMy0zLjQtNC4zUzM3LDEyLjUsMzcsMTQuOHogTTQzLjksOC42YzAsMi41LDEuNSw0LjUsMy4zLDQuNQoJYzEuOCwwLDMuMy0yLjEsMy4zLTQuNVM0OSw0LjEsNDcuMSw0LjFDNDUuMyw0LDQzLjksNiw0My45LDguNnogTTUyLjIsOC41YzAsMi4zLDEuNCw0LjMsMy4yLDQuM3MzLjItMS45LDMuMi00LjNzLTEuNC00LjMtMy4yLTQuMwoJUzUyLjIsNi4yLDUyLjIsOC41eiBNNTcuNSwxNS45YzAsMi4zLDEuNSw0LjMsMy4zLDQuM2MxLjgsMCwzLjMtMS45LDMuMy00LjNzLTEuNS00LjMtMy4zLTQuM0M1OC45LDExLjYsNTcuNSwxMy42LDU3LjUsMTUuOXoiLz4KPHBhdGggY2xhc3M9InN0MSIgZD0iTTQsMzAuNHYtNS4xaDYuNGMxLjYsMCwxLjYsMC4zLDEuNiwydjEuNGMwLDEuNi0yLjMsMS44LTMuOSwxLjhMNCwzMC40TDQsMzAuNHogTTQsMjN2LTQuOGg0LjEKCWMxLjYsMCwzLjksMCwzLjksMi4xdjAuMWMwLDEuNC0wLjUsMi42LTEuOCwyLjZDMTAuMywyMyw0LDIzLDQsMjN6IE0xLjcsMTZ2MTYuM2g2LjRjMywwLDYuMiwwLDYuMi0zLjZ2LTEuMWMwLTEuNi0wLjEtMi43LTEuMS0zLjUKCWMxLTAuOCwxLjEtMi4zLDEuMS0zLjZsMCwwYzAtNC41LTMuMi00LjUtNi4yLTQuNUwxLjcsMTZMMS43LDE2eiIvPgo8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjUsMjguOWMtMS4xLDEuMS0zLjMsMS4zLTMuNSwxLjNjLTEuMywwLTIuNy0wLjUtMi43LTIuMWMwLTEuNCwwLjUtMi4zLDIuMS0yLjNjMS4zLDAsMi44LDAuMSw0LjEsMC42VjI4Ljl6CgkgTTIxLjQsMzIuM2MwLjQsMCwyLjMtMC4xLDMuNy0wLjlsMC4yLDAuN2gyLjF2LTguOWMwLTMuNi0yLjMtNS01LjctNWMtMS44LDAtNC4zLDAuNy00LjcsMC45bDAuNCwyLjNjMS42LTAuNiwzLTAuNiw0LjItMC42CgljMS44LDAsMy4zLDAuNiwzLjMsMi42VjI0Yy0xLTAuNC0yLjQtMC42LTQuMS0wLjZjLTMsMC00LjUsMS42LTQuNSw0LjdDMTYuNCwzMS44LDE5LjYsMzIuMywyMS40LDMyLjN6Ii8+CjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zMC4yLDE2LjFjMCwwLjYsMC42LDEuMiwxLjMsMS4yYzAuOCwwLDEuMy0wLjYsMS4zLTEuMmMwLTAuNy0wLjYtMS4zLTEuMy0xLjNDMzAuOCwxNC44LDMwLjIsMTUuMywzMC4yLDE2LjF6CgkgTTMwLjMsMzIuMWgyLjRWMTguNWgtMi40VjMyLjF6Ii8+CjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik03MS4yLDIyLjFoOC40YzAuNCwwLjEsMC42LDAuMywwLjYsMC43djIuNmgtOS43di0yLjZDNzAuNiwyMi40LDcwLjgsMjIuMiw3MS4yLDIyLjF6IE03MS4yLDMwLjUKCWMtMC40LDAtMC42LTAuMy0wLjctMC44di0yLjZoOS43djIuNmMwLDAuNC0wLjIsMC43LTAuNiwwLjdINzEuMnogTTczLjYsMThjLTAuMSwwLjQtMC4xLDAuOS0wLjQsMS43Yy0wLjEsMC4zLTAuMSwwLjUtMC4xLDAuNwoJaC0yLjZjLTEuMywwLjEtMS45LDAuOC0yLDJ2Ny45YzAuMSwxLjEsMC44LDEuOCwyLDEuOWgxMGMxLjItMC4xLDEuOC0wLjcsMS45LTEuOHYtNy45Yy0wLjEtMS4zLTAuNy0xLjktMS45LTIuMWgtNQoJYzAuMS0wLjMsMC4xLTAuOCwwLjMtMS40YzAuMS0wLjQsMC4xLTAuNywwLjEtMC45aDcuMnYtMS44SDY3LjRWMThMNzMuNiwxOEw3My42LDE4eiIvPgo8cGF0aCBjbGFzcz0ic3QxIiBkPSJNOTMuNywyMi43Yy0wLjQtMC4xLTAuNS0wLjItMC41LTAuNXYtMC42aDMuMnYwLjZjLTAuMSwwLjMtMC4yLDAuNC0wLjUsMC41SDkzLjd6IE05Ni42LDI0LjEKCWMxLjEtMC4xLDEuNi0wLjUsMS42LTEuNHYtMWgyLjN2LTEuNWgtMi4zdi0xLjFoLTEuOHYxLjFoLTMuMnYtMS4xaC0xLjh2MS4xaC0yLjN2MS41aDIuM3YxYzAuMSwwLjksMC42LDEuNCwxLjYsMS40SDk2LjZ6CgkgTTk0LjgsMzAuNGMxLjYsMC44LDMuNCwxLjMsNS40LDEuOGwwLjktMS43Yy0xLjQtMC4yLTIuOS0wLjYtNC40LTEuMWMxLjEtMC44LDItMS42LDIuNy0yLjVjMC4zLTAuNCwwLjQtMC45LDAuMi0xLjMKCWMtMC4zLTAuNi0wLjgtMC45LTEuNC0wLjloLTl2MS41aDcuN2MwLjIsMCwwLjQsMC4xLDAuNCwwLjFzMCwwLjEtMC4xLDAuM2MtMC42LDAuNi0xLjQsMS4zLTIuMywxLjhjLTEuMi0wLjctMi4xLTEuMy0yLjQtMS44aC0yLjIKCWMwLjksMSwxLjgsMS45LDIuOSwyLjdjLTEuNiwwLjYtMy4zLDEuMS00LjksMS4zbDAuOSwxLjZDOTEuMywzMS44LDkzLjIsMzEuMSw5NC44LDMwLjR6IE04OC4zLDI1LjJ2LTZjMC4xLTAuNiwwLjMtMC45LDAuOC0wLjkKCWgxMS44di0xLjZIOTVjLTAuMS0wLjEtMi4yLTAuMS0yLjIsMGgtNC43Yy0xLjEsMC4xLTEuNywwLjktMS44LDIuMlYyNWMwLjEsMi4xLTAuNCw0LjQtMS4xLDYuN2wxLjksMC42CglDODcuOSwyOS45LDg4LjMsMjcuNiw4OC4zLDI1LjJ6Ii8+CjxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik00Ni4zLDI0LjJjMC42LDAsMS4yLDAuMSwxLjcsMC40djMuNGMwLDAuMy0wLjYsMS0xLjksMWMtMS41LDAtMS44LTAuNi0xLjgtMi4xdi0wLjYKCUM0NC4yLDI0LjgsNDQuNywyNC4yLDQ2LjMsMjQuMnogTTQ5LjIsMjAuN0g0OHYyLjVDNDcuNiwyMy4xLDQ3LDIzLDQ2LjMsMjNjLTIuNywwLTMuMywxLTMuMywzLjV2MC4zYzAsMi40LDAuOSwzLjMsMy4yLDMuMwoJYzAuOCwwLDEuMy0wLjEsMS44LTAuNWwwLjEsMC42aDEuMUw0OS4yLDIwLjdMNDkuMiwyMC43eiIvPgo8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNTYuNywyM2gtMS4ydjUuMmMtMC42LDAuNC0xLjcsMC42LTIuNCwwLjZjLTAuOCwwLTEtMC40LTEtMS4zdi00LjZoLTEuMXY0LjhjMCwxLjYsMC41LDIuMywyLjEsMi4zCgljMSwwLDIuMS0wLjMsMi42LTAuNmwwLjEsMC42aDEuMVYyM3oiLz4KPHBhdGggY2xhc3M9InN0MSIgZD0iTTkyLjcsMTUuN2MwLTAuNywwLjYtMS4zLDEuMi0xLjNjMC42LDAsMS4yLDAuNiwxLjIsMS4zUzk0LjUsMTcsOTMuOSwxN0M5My4zLDE2LjksOTIuNywxNi4zLDkyLjcsMTUuN3oiLz4KPC9zdmc+Cg==');
                    }
                    else {
                        $("#lg img,#result_logo img").attr('src', '//www.baidu.com/img/bd_logo1.png?where=super');
                    }
                }
            };
            this.addBeautifyTool = function () {
                var checked = 'checked';
                if (_this.beautify == 0) {
                    checked = '';
                }
                if ($('.blur-beautify').length == 0) {
                    var option = '<div class="c-gap-left" style="font-size:14px;padding: 5px 0;"><label><input type="checkbox" class="blur-beautify" style="margin-top:3px;vertical-align:middle;" ' + checked + ' ><span style="vertical-align:middle;cursor: pointer;">美化</span></label></div>';
                    $("#bsetting").append(option);
                    setTimeout(function () {
                        $(".blur-beautify").change(_this.toggleBeautify);
                    }, 50);
                }
            };
            this.toggleBeautify = function () {
                if (this.checked) {
                    _this.beautify = 1;
                    localStorage.setItem('blur-beautify', 1);
                }
                else {
                    _this.beautify = 0;
                    localStorage.setItem('blur-beautify', 0);
                }
                _this.doBeautify();
            };
            this.doBeautify = function () {
                $(".headBgDiv").remove();
                if (_this.beautify == 1 || _this.beautify == null) {
                    _this.beautifyLogo();
                    $(function () {
                        _this.beautifyLogo();
                    });
                    var style = "<style class='mainStyle'>document,html,body,.c-table th,#page,#s_top_wrap,.wrapper_new #form .bdsug-new{background:#eee} #page .fk,a .fk,.qrcodeCon{display:none} #s_tab{height:47px} em{color: #ce4343;} .result a,.c-container a,.result-op a,.result em,.c-container em,.result-op em,#u a{text-decoration:none!important;} a{color:#4879BD} #rs{background:none;padding:20px} #rs a{text-decoration:none} #page a, #page strong{height:auto;background:none;border:none;overflow:unset;} #page strong .pc{background:#596dbb} #page .pc,#page .n{border: 1px solid #ccc;border-radius:6px;} #s_tab{background:none} .c-border{border: none; box-shadow: none;} #foot,#help{background:none}.wrapper_new .fix-head #u{margin-top:12px} #s_tab{padding-top:86px } .c-border{padding:0;background:none}.result-op>tbody>tr>td{padding:20px!important}@media screen and (max-width: 1216px){.result,.c-container,.result-op,.result-op>tbody>tr>td{}} #s_kw_wrap,#bottom_layer{background:#eee!important} #head .new-ipt-focus{background:#eee} .s_ipt_wr,.s_ipt_wr.bg{background: rgba(255,255,255,0.75)}";
                    if (_this.isNotHaveBackGround() && (_this.initStatus == 0 || document.URL.indexOf('wd=') != -1 || document.URL.indexOf('word=') != -1)) {
                        style += 'body,#head{background:#eee}#s_kw_wrap,#s_top_wrap,#bottom_layer{background:none!important}';
                    }
                    if (_this.isNotHaveBackGround()) {
                        style += '#head_wrapper .soutu-env-nomac #form #kw,#head_wrapper.s-down .soutu-env-nomac #form #kw{background:rgba(0,0,0,0)!important}#head_wrapper.s-down .soutu-env-nomac #form #kw{background:white}#head_wrapper .ipt_rec, #head_wrapper .soutu-btn{background-color:rgba(0,0,0,0)}';
                    }
                    if (!_this.isNotHaveBackGround()) {
                        style += '#s_top_wrap{background:rgba(0,0,0,.2)!important}#bottom_layer{background:#eee!important}#s_kw_wrap{background:none!important}';
                    }
                    if ($('.tab-wrapper b').text() == '资讯') {
                        style += '#head .bdsug{top: 59px;}';
                    }
                    if (_this.css) {
                        //style += '#head .new-ipt-focus{background: rgba(255,255,255,0.75)} #head #form .bdsug-new{background: rgba(255,255,255,0.75);backdrop-filter: blur(15px)}';
                    }
                    var url = window.location.href;
                    if (url.indexOf('wd=') != -1) {
                        style += '#head{height: 60px;top:0}.result:hover,#content_left>.c-container:hover,.result-op:not(.xpath-log):not(#rs_new):hover{box-shadow: 5px 5px 7px #ccc;}.result>div,.c-container>div,.result-op>div{margin:10px 0} #content_left>.result,#content_left>.c-container,#content_left>.result-op,#content_left>#unsafe_content>.result,#content_left>#unsafe_content>.c-container,#content_left>#unsafe_content>.result-op{background:#fafafa;padding:20px;border-radius: 5px;transition:all 0.3s;margin: 0 15px 25px 0!important;width:560px}.wrapper_new #result_logo{margin-top: 10px;}';

                    }
                    if ( url.indexOf('word=') != -1) {
                        style += '#head{height: 60px;top:0}.result:hover,#content_left>.c-container:hover,.result-op:not(.xpath-log):not(#rs_new):hover{box-shadow: 5px 5px 7px #ccc;}.result>div,.c-container>div,.result-op>div{margin:10px 0} #content_left>div>.c-container,#content_left>.result,#content_left>.c-container,#content_left>.result-op,#content_left>#unsafe_content>.result,#content_left>#unsafe_content>.c-container,#content_left>#unsafe_content>.result-op{background:#fafafa;padding:20px;border-radius: 5px;transition:all 0.3s;margin: 0 15px 25px 0!important;width:560px}.wrapper_new #result_logo{margin-top: 10px;}';
                        style += '#gotoPage{padding: 10px 35px;}'
                    }
                    style += '.wrapper_new #head.fix-head #result_logo,.wrapper_new #head.fix-head .fm{margin-top: 7px;}.wrapper_new .fm{margin-top: 10px;}.wrapper_new #s_tab{ padding-top: 60px;}.new-pmd .c-border{box-shadow:none}';
                    style += '#searchTag{background: #eee;}#searchTag{padding-top:5px;}#searchTag.tag-fixed{top:61px;padding-top: 8px;padding-bottom: 8px;}.cu-border{box-shadow:none;}[class*="card-shadow"]{box-shadow:none;}#kw{height:36px;line-height: 37px;}'
                    style += '</style>';
                    $(".mainStyle").remove();
                    $("html").append(style);
                }
                else {
                    $(".mainStyle").remove();
                }
                setTimeout(function () {
                    _this.setTab();
                    _this.blur();
                }, 350);
            };
            this.isNotHaveBackGround = function () {
                return ($('.s-skin-container').length == 0 || $('.s-skin-container').attr('style') == null || $('.s-skin-container').attr('style').indexOf('background-image') == -1);
            };
            this.removeAd = function () {
                if ($('.tab-wrapper b').text() != '资讯') {
                    $('#content_left>div:not(.c-container):not(#unsafe_content):not(#super_se_tip):not(.video_list_container):not(.result)').remove();
                }
                if (_this.removeAdTimer) {
                    clearInterval(_this.removeAdTimer);
                    _this.removeAdTimes = 0;
                }
                _this.removeAdTimer = setInterval(function(){
                    $(".c-container>.f13").each(function () {
                        var text = $(this).text();
                        if (text.indexOf('广告') != -1) {
                            $(this).parents('.c-container').remove();
                        }
                    });
                    $(".c-span-last span").each(function () {
                        var text = $(this).text();
                        if (text.indexOf('广告') != -1) {
                            $(this).parents('.c-container').remove();
                        }
                    });
                    $("font[class*=ec_tuiguang] span").each(function () {
                        var text = $(this).text();
                        if (text.indexOf('广告') != -1) {
                            $(this).parents('.c-container').remove();
                        }
                    });
                    _this.removeAdTimes++;
                    if ( _this.removeAdTimes > 50) {
                        clearInterval(_this.removeAdTimer);
                        _this.removeAdTimes = 0;
                    }
                }, 300)

                $(".c-container>.f13").each(function () {
                    var text = $(this).text();
                    if (text.indexOf('广告') != -1) {
                        $(this).parents('.c-container').remove();
                    }
                });

                $(".ad-icon").parents('.s-news-item').remove();
                $("#ecomScript").remove();
                $("#m").remove();
                $("#s_lm_wrap").remove();
                $('#content_right>div').remove();
                $("#con-ar").next().remove();
                $(".t>a").unbind('click').click(function () { window.open($(this).attr('href')); return false; });
            };
            this.blur = function () {
                if (_this.css) {
                    if (_this.isNotHaveBackGround() && ((!$("#u_sp").length || $("#u_sp").is(':hidden')) && (!$("#u1").length || $("#u1").is(':hidden')))) {
                        if ((document.URL.indexOf('wd=') != -1 || document.URL.indexOf('word=') != -1)) {
                            $('#head').css({ 'backdrop-filter': 'blur(15px)' });
                        }

                        if (_this.tab == 1 && _this.beautify == 1) {
                            $('#page').css({ 'backdrop-filter': 'blur(15px)', 'background': 'rgba(238, 238, 238, 0.75)', 'z-index': '1000' });
                        }
                    }
                    setTimeout(function () {
                        $('#head').css({ 'background': 'rgba(0,0,0,0)' });
                        if ((document.URL.indexOf('wd=') != -1 || document.URL.indexOf('word=') != -1)) {
                            if (_this.beautify == 1) {
                                $('#head').css({'background': 'rgba(238, 238, 238, 0.75)'});
                            } else {
                                $('#head').css({'background': 'rgba(255, 255, 255, 0.75)'});
                            }
                        }
                        _this.initBg();
                    }, 1000);
                    $("#s_kw_wrap").css({ 'background': 'rgba(255,255,255,0.8)' });
                    _this.removeAd();
                    _this.initBg();
                }
                else {
                    var top = -$(window).scrollTop();
                    var subHeight = $('#head').outerHeight();
                    var headBgDiv = '<div style="height:' + subHeight + 'px;width:100%;overflow:hidden;position: absolute;top:0;z-index:-1;display: inline-block;left:0" id="headBgDiv" class="headBgDiv"><div style="position: absolute;top: ' + top + 'px;left: 0;width:100%;filter: blur(13px);z-index: -1" class="bulrBg" id="headerBulrBg"></div>';
                    if (_this.isNotHaveBackGround() && ((!$("#u_sp").length || $("#u_sp").is(':hidden')) && (!$("#u1").length || $("#u1").is(':hidden')))) {
                        $(".headBgDiv").remove();
                        $('#head').prepend(headBgDiv);
                    }
                    else {
                        $(".headBgDiv").remove();
                    }
                    $('#wrapper_wrapper #container').addClass('container_l');
                    _this.removeAd();
                    $(".bulrBg").append($('#s_tab').clone());
                    $(".bulrBg").append($('#wrapper_wrapper').clone());
                    $(".headBgDiv #c-tips-container").remove();
                }
            };
            this.addTabTool = function () {
                var checked = 'checked';
                if (_this.tab == 0) {
                    checked = '';
                }
                if ($('.blur-tab').length == 0) {
                    var option = '<div class="c-gap-left" style="font-size:14px;padding: 5px 0;"><label><input type="checkbox" class="blur-tab" style="margin-top:3px;vertical-align:middle;" ' + checked + ' ><span style="vertical-align:middle;cursor: pointer;">多列显示(只对大屏幕有效)</span></label></div>';
                    $("#bsetting").append(option);
                    setTimeout(function () {
                        $(".blur-tab").change(_this.toggleTab);
                    }, 50);
                }
            };
            this.toggleTab = function () {
                if (this.checked) {
                    _this.tab = 1;
                    localStorage.setItem('blur-tab', 1);
                }
                else {
                    _this.tab = 0;
                    localStorage.setItem('blur-tab', 0);
                }
                _this.setTab();
                _this.doInMiddle(true);
            };
            this.setTab = function () {
                if ($('.s_tab_inner b').text() == '视频') {
                    return;
                }
                if (_this.tab == 1) {
                    var column = _this.right == 1 ? 2 : 3;
                    if ($('.tab-wrapper b').text() == '资讯') {
                        column = 3;
                    }
                    var style = '<style id="bTab"> @media screen and (max-width: 1800px){#s_tab{padding-left: 20px!important;}#container{margin-left: 20px!important;}}@media screen and (min-width: 1635px){#content_left,#container.sam_newgrid #content_left,#rs_top_new{width:1205px;}.cr-offset{padding-left: 35px;}';
                    if (column == 3) {
                        style = '<style id="bTab">@media screen and (min-width: 1635px){#content_left,#container.sam_newgrid #content_left,#rs_top_new{width:95%;}';
                    }
                    if (_this.isNotHaveBackGround() && ((!$("#u_sp").length || $("#u_sp").is(':hidden')) && (!$("#u1").length || $("#u1").is(':hidden')))) {
                        style += 'html{padding-bottom:50px}';
                    }
                    if (_this.beautify == 1) {
                        style += '#page{position: fixed;bottom: 0;width: 100%;text-align: center;margin: 0;}#foot{margin-top:10px}html #page .pc, #page .n{border-color:rgba(0,0,0,0.35);text-shadow: 0 0 17px #666;border-radius: 6px;}#page a{ width:auto;color: rgba(30,30,30,0.75);}#page strong{width:auto;background: rgba(51,136,255,0.7)!important;color: white;}#page .n:hover, #page a:hover .pc{background: rgba(51,136,255,0.7)!important;color: white;border-color: rgba(51,136,255,0.5)!important;}.wrapper_new .container_new~#page strong, .wrapper_new .container_new~#page a{background-color: rgba(255,255,255,0.75);}';
                    }
                    if (column == 3) {
                        style += '.wrapper_new #content_left,.wrapper_new #s_tab{padding-left:20px}#container.sam_newgrid{margin-left:20px} #content_left,#container.sam_newgrid #content_left, #rs_top_new{width:100%}.wrapper_new .search_tool_conter, .wrapper_new .nums, .wrapper_new #rs, .wrapper_new .hint_common_restop{margin-left:20px}'
                    }
                    var w = '1617px';
                    var rbl = $("#content_right").css('border-left-width');
                    rbl = rbl ? rbl : '';
                    rbl = parseInt(rbl.replace('px', ''));
                    if (rbl != 0) {
                        w = '1800px';
                    }
                    if (column == 3) {
                        w = '95%';
                    }
                    style += '#container.sam_newgrid,#container{width:' + w + '}#content_left{column-count: ' + column + ';column-width:560px}.result,.c-container{-moz-page-break-inside:avoid;-webkit-column-break-inside:avoid;break-inside:avoid;margin:15px}}</style>';
                      $("#bTab").remove();
                    $('html').append(style);
                } else {
                      $("#bTab").remove();
                }
            };
            this.initIndexHide = function () {
                if (_this.indexHide == undefined || _this.indexHide == null) {
                    _this.indexHide = 0;
                    localStorage.setItem('blur-index-hide', 0);
                }
                _this.doIndexHide();
                $(function () {
                    _this.addIndexHideTool();
                });
            };
            this.addIndexHideTool = function () {
                if ($('.blur-index-hide').length == 0) {
                    var checked = 'checked';
                    if (_this.indexHide == 0) {
                        checked = '';
                    }
                    var option = '<div class="c-gap-left" style="font-size:14px;padding: 5px 0;"><label><input type="checkbox" class="blur-index-hide" style="margin-top:3px;vertical-align:middle;  " ' + checked + ' ><span style="vertical-align:middle;cursor: pointer;">首页简化</span></label></div>';
                    $("#bsetting").append(option);
                    setTimeout(function () {
                        $(".blur-index-hide").change(_this.toggleIndexHide);
                    }, 50);
                }
            };
            this.doIndexHide = function () {
                $("#bIndexHide").remove();
                $("#s_upfunc_menus,#u_sp,#s_upfunc_menus *,#u_sp *").unbind('mouseover').unbind('mouseout');
                if (_this.indexHide == 1 && !(document.URL.indexOf('wd=') != -1 || document.URL.indexOf('word=') != -1)) {
                    var style = "<style id='bIndexHide'>#s_btn_wr .s_btn{background:#3385ff;color:#fff}#s_kw_wrap{background:rgba(255, 255, 255, 0.3)!important}#kw{background:none!important}#s_upfunc_menus,#u_sp,#bottom_layer,.soutu-btn,#lg,#s_top_wrap,#u1,#s-top-left{opacity: 0; transition: all 0.3s}#s_upfunc_menus:hover,#u_sp:hover,#bottom_layer:hover,.soutu-btn:hover,#lg:hover,#u1:hover,#s-top-left:hover{opacity: 1;}#s_upfunc_menus:hover #s_top_wrap{opacity: 1;}#u_sp:hover #s_top_wrap{opacity: 1;}</style>";
                    $("#s_upfunc_menus,#u_sp,#s_upfunc_menus *,#u_sp *").mouseover(function () { $("#s_top_wrap").css("opacity", 1); });
                    $("#s_upfunc_menus,#u_sp,#s_upfunc_menus *,#u_sp *").mouseout(function () { $("#s_top_wrap").css("opacity", 0); });
                    $('html').append(style);
                }
            };
            this.toggleIndexHide = function () {
                if (this.checked) {
                    _this.indexHide = 1;
                    localStorage.setItem('blur-index-hide', 1);
                }
                else {
                    _this.indexHide = 0;
                    localStorage.setItem('blur-index-hide', 0);
                }
                _this.doIndexHide();
            };
            this.initIndexAutoHideNews = function () {
                if (_this.indexAutoHideNews == undefined || _this.indexAutoHideNews == null) {
                    _this.indexAutoHideNews = 0;
                    localStorage.setItem('blur-index-auto-hide-news', 0);
                }
                _this.doIndexAutoHideNews();
                $(function () {
                    _this.addIndexAutoHideNewsTool();
                });
            };
            this.addIndexAutoHideNewsTool = function () {
                if ($('.blur-index-auto-hide-news').length == 0) {
                    var checked = 'checked';
                    if (_this.indexAutoHideNews == 0) {
                        checked = '';
                    }
                    var option = '<div class="c-gap-left" style="font-size:14px;padding: 5px 0;"><label><input type="checkbox" class="blur-index-auto-hide-news" style="margin-top:3px;vertical-align:middle;  " ' + checked + ' ><span style="vertical-align:middle;cursor: pointer;">自动隐藏首页资讯（已登录）</span></label></div>';
                    $("#bsetting").append(option);
                    setTimeout(function () {
                        $(".blur-index-auto-hide-news").change(_this.toggleIndexAutoHideNews);
                    }, 50);
                }
            };
            this.doIndexAutoHideNews = function () {
                if (_this.indexAutoHideNews == 1 && !(document.URL.indexOf('wd=') != -1 || document.URL.indexOf('word=') != -1)) {
                    $("#s_main").hide()
                    setTimeout(function(){
                        $('.hide-feed').click();
                    }, 500);
                    $('.show-feed').click(function(){
                        localStorage.setItem('blur-index-auto-hide-news', 0);
                    })
                }
                if (_this.indexAutoHideNews == 0) {
                    $('.show-feed').click();
                }
            };
            this.toggleIndexAutoHideNews = function () {
                if (this.checked) {
                    _this.indexAutoHideNews = 1;
                    localStorage.setItem('blur-index-auto-hide-news', 1);
                }
                else {
                    _this.indexAutoHideNews = 0;
                    localStorage.setItem('blur-index-auto-hide-news', 0);
                }
                _this.doIndexAutoHideNews();
            };
            this.initIndexAutoHideHot = function () {
                if (_this.indexAutoHideHot == undefined || _this.indexAutoHideHot == null) {
                    _this.indexAutoHideHot = 0;
                    localStorage.setItem('blur-index-auto-hide-hot', 0);
                }
                _this.doIndexAutoHideHot();
                $(function () {
                    _this.addIndexAutoHideHotTool();
                });
            };
            this.addIndexAutoHideHotTool = function () {
                if ($('.blur-index-auto-hide-hot').length == 0) {
                    var checked = 'checked';
                    if (_this.indexAutoHideHot == 0) {
                        checked = '';
                    }
                    var option = '<div class="c-gap-left" style="font-size:14px;padding: 5px 0;"><label><input type="checkbox" class="blur-index-auto-hide-hot" style="margin-top:3px;vertical-align:middle;  " ' + checked + ' ><span style="vertical-align:middle;cursor: pointer;">自动隐藏首页热榜（未登录）</span></label></div>';
                    $("#bsetting").append(option);
                    setTimeout(function () {
                        $(".blur-index-auto-hide-hot").change(_this.toggleIndexAutoHideHot);
                    }, 50);
                }
            };
            this.doIndexAutoHideHot = function () {
                if (_this.indexAutoHideHot == 1 && !(document.URL.indexOf('wd=') != -1 || document.URL.indexOf('word=') != -1)) {
                    setTimeout(function(){
                        $('.set-hide').click();
                    }, 500);
                    $('.set-show').click(function(){
                        localStorage.setItem('blur-index-auto-hide-hot', 0);
                    });
                }
                if (_this.indexAutoHideHot == 0) {
                    $('.set-show').click();
                }
            };
            this.toggleIndexAutoHideHot = function () {
                if (this.checked) {
                    _this.indexAutoHideHot = 1;
                    localStorage.setItem('blur-index-auto-hide-hot', 1);
                }
                else {
                    _this.indexAutoHideHot = 0;
                    localStorage.setItem('blur-index-auto-hide-hot', 0);
                }
                _this.doIndexAutoHideHot();
            };
            this.initInMiddle = function () {
                if (_this.inMiddle == undefined || _this.inMiddle == null) {
                    _this.inMiddle = 0;
                    localStorage.setItem('blur-in-middle', 0);
                }
                _this.doInMiddle();
                $(function () {
                    _this.addInMiddleTool();
                });
            };
            this.addInMiddleTool = function () {
                if ($('.blur-in-middle').length == 0) {
                    var checked = 'checked';
                    if (_this.inMiddle == 0) {
                        checked = '';
                    }
                    var option = '<div class="c-gap-left" style="font-size:14px;padding: 5px 0;"><label><input type="checkbox" class="blur-in-middle" style="margin-top:3px;vertical-align:middle;  " ' + checked + ' ><span style="vertical-align:middle;cursor: pointer;">结果居中</span></label></div>';
                    $("#bsetting").append(option);
                    setTimeout(function () {
                        $(".blur-in-middle").change(_this.toggleInMiddle);
                    }, 50);
                }
            };
            this.doInMiddle = function (force) {
                if (_this.inMiddle == 1 && (document.URL.indexOf('wd=') != -1 || document.URL.indexOf('word=') != -1)) {
                    $('#container').css('margin', 'auto');
                    if ($('.css-blue-inMiddle').length && !force) {
                        return;
                    }
                    $('.css-blue-inMiddle').remove();
                    $('.css-blur-right').remove();
                    setTimeout(function () {
                        $('.css-blue-inMiddle').remove();
                        $('.css-blur-right').remove();
                        var stab = $("#s_tab").css('padding-left');
                        var plStab = parseInt(stab.replace('px', ''));
                        var cl = $("#container")[0].offsetLeft;
                        var sForm = $(".s_form").css('padding-left');
                        var plSForm = parseInt(sForm.replace('px', ''));
                        var spi = $("div[class^='page-inner']").css('padding-left');
                        var plSpi = spi && parseInt(spi.replace('px', ''));
                        var rw = 0;
                        if (_this.right == 0 && _this.tab == 0) {
                            rw = parseInt($("#content_right").css('width').replace('px', ''));
                            var css = '<style class="css-blur-right">';
                            if ($(".container_l").css('width') != undefined) {
                                var cw = parseInt($(".container_l").css('width').replace('px', ''));
                                css += '.container_l{width:' + (cw - rw) + 'px!important}';
                            }
                            if ($(".container_s").css('width') != undefined) {
                                rw = rw / 4;
                                var csw = parseInt($(".container_s").css('width').replace('px', ''));
                                css += '.container_s{width:' + (csw - rw) + 'px!important}';
                            }
                            rw = rw / 2;
                            css += '</style>';
                            $('html').append(css)
                        }
                        var logoW = $("#result_logo").width()
                        var rbl = $("#content_right").css('border-left-width');
                        rbl = rbl ? rbl : '';
                        rbl = parseInt(rbl.replace('px', ''));
                        if (rbl == 0) {
                            plStab = 0;
                            plSForm = 0 - logoW - 15;
                            plSpi -= 132;
                        }

                        var css = '<style class="css-blue-inMiddle">#container{margin: auto}#s_tab{padding-left: ' + (cl + plStab + rw) + 'px!important}#searchTag{padding-left: ' + (cl + plStab + rw - 150) + 'px!important}.s_form{padding-left: ' + (cl + plSForm + rw) + 'px!important}div[class^="page-inner"]{padding-left: ' + (cl + plSpi + rw) + 'px!important}</style>';

                        $("html").append(css);
                    }, 500)

                }
                else {
                    $('#container').attr('style', '');
                    $('.css-blue-inMiddle').remove();
                    $('.css-blur-right').remove();
                }
            };
            this.toggleInMiddle = function () {
                if (this.checked) {
                    _this.inMiddle = 1;
                    localStorage.setItem('blur-in-middle', 1);
                }
                else {
                    _this.inMiddle = 0;
                    localStorage.setItem('blur-in-middle', 0);
                }
                _this.doInMiddle();
            };
            this.initHideBaijia = function () {
                if (_this.hideBaijia == undefined || _this.hideBaijia == null) {
                    _this.hideBaijia = 0;
                    localStorage.setItem('blur-hide-baijia', 0);
                }
                $(function () {
                    _this.addHideBaijiaTool();
                });
                setTimeout(function () {
                    _this.doHideBaijia();
                }, 100)

            };
            this.addHideBaijiaTool = function () {
                if ($('.blur-hide-baijia').length == 0) {
                    var checked = 'checked';
                    if (_this.hideBaijia == 0) {
                        checked = '';
                    }
                    var option = '<div class="c-gap-left" style="font-size:14px;padding: 5px 0;"><label><input type="checkbox" class="blur-hide-baijia" style="margin-top:3px;vertical-align:middle;  " ' + checked + ' ><span style="vertical-align:middle;cursor: pointer;">隐藏百家号结果(会自动加上-baijia)</span></label></div>';
                    $("#bsetting").append(option);
                    setTimeout(function () {
                        $(".blur-hide-baijia").change(_this.toggleHideBaijia);
                    }, 50);
                }
            };
            this.doHideBaijia = function () {
                if (_this.hideBaijia == 1 && (document.URL.indexOf('wd=') != -1 || document.URL.indexOf('word=') != -1)) {
                    var searchStr = $("#kw").val();
                    if (searchStr.indexOf('-baijia') == -1) {
                        setTimeout(function () {
                            $("#kw").val($("#kw").val() + ' -baijia');
                            $('#form').submit();
                        }, 150)

                    }
                }
            };
            this.toggleHideBaijia = function () {
                if (this.checked) {
                    _this.hideBaijia = 1;
                    localStorage.setItem('blur-hide-baijia', 1);
                }
                else {
                    _this.hideBaijia = 0;
                    localStorage.setItem('blur-hide-baijia', 0);
                }
                _this.doHideBaijia();
            };
            this.initBg = function () {
                if (_this.bg == undefined || _this.bg == null) {
                    _this.bg = {'on': false, 'url': '', 'onlyIndex': true};
                    localStorage.setItem('blur-bg', JSON.stringify(_this.bg));
                }
                if (typeof _this.bg == 'string') {
                    try {
                        _this.bg = JSON.parse(_this.bg);
                    } catch (e) {
                        _this.bg = {'on': false, 'url': '', 'onlyIndex': true};
                    }
                }
                $(function () {
                    _this.addBgTool();
                });
                setTimeout(function () {
                    _this.doBg();
                }, 100)

            };
            this.addBgTool = function () {
                if ($('.blur-bg').length == 0) {
                    var checked = 'checked';
                    var  disabled = '';
                    if (_this.bg.on == false) {
                        checked = '';
                        disabled = 'disabled="disabled"';
                    }
                    var option = '<div class="c-gap-left" style="font-size:14px;padding: 5px 0;"><label><input type="checkbox" class="blur-bg" style="margin-top:3px;vertical-align:middle;  " ' + checked + ' ><span style="vertical-align:middle;cursor: pointer;">自定义背景(不指定URL默认随机近七日bing图片)</span></label></div>';

                    option += '<div class="c-gap-left" style="font-size:14px;padding: 5px 0;padding-left: 15px">URL:<input type="text" ' + disabled + ' class="blur-bg-setting blur-bg-url" data-field="url" value="' + _this.bg.url + '"><button type="button" style="margin-left: 10px" onclick="$(\'.blur-bg-url\').val(\'\').change()">清空</button></div>'
                    option += '<div class="c-gap-left" style="font-size:14px;padding: 5px 0;padding-left: 15px">本地文件(不要太大，会覆盖URL里的内容，请注意备份):<input type="file" ' + disabled + ' class="blur-bg-setting" id="blur-bg-local-image" accept="image/*"></div>'

                    var onlyIndexChecked = 'checked';
                    if (_this.bg.onlyIndex == false) {
                        onlyIndexChecked = '';
                    }
                    option += '<div class="c-gap-left" style="font-size:14px;padding: 5px 0;padding-left: 15px;"><label><input type="checkbox" class="blur-bg-setting"  data-field="onlyIndex" style="margin-top:3px;vertical-align:middle;  " ' + onlyIndexChecked + ' ' + disabled + ' ><span style="vertical-align:middle;cursor: pointer;" >只设置首页</span></label></div>';
                    $("#bsetting").append(option);
                    setTimeout(function () {
                        $(".blur-bg").change(_this.toggleBg);
                        $(".blur-bg-setting").change(_this.setBg);
                        $("#blur-bg-local-image").change(_this.setLocalImage)
                    }, 50);
                }
            };
            this.doBg = function () {
                $(".blur-bg-css").remove();
                $("#blur-search-bg").remove();
                $(".blur-search-bg").remove();
                if (_this.bg.on) {
                    var url = _this.bg.url ? _this.bg.url : 'https://roll.ihawo.com/bg.php';
                    $("#head").addClass('s-skin-hasbg').addClass('white-logo');
                    if (!$(".s-skin-container").length) {
                        $("#wrapper").append('<div class="s-skin-container s-isindex-wrap" style="top: 0;left: 0;height: 100%;width: 100%;min-width: 1000px;z-index: -10;zoom: 1;"></div>')
                    }
                    $(".s-skin-container").css('background', 'url(' + url + ')');
                    $(".s-skin-container").css('background-size', 'cover');
                    var style = '<style class="blur-bg-css">#s_top_wrap{background:rgba(0,0,0,.2)!important} #s_kw_wrap{background:rgba(255, 255, 255, 0)!important;} #head_wrapper .soutu-env-nomac #form #kw{/* background: rgba(255, 255, 255, 0.8)!important;*/}#bottom_layer{background:rgba(0, 0, 0, 0.2)!important}#bottom_layer .lh,#bottom_layer .lh a{color:white!important}#head_wrapper .ipt_rec, #head_wrapper .soutu-btn{background-color: rgba(0,0,0,0)} #blur-search-bg{position: fixed;top: 0;left: 0;height: 100%;width: 100%;z-index: -10;}</style>';
                    $('html').append(style);
                    if (!_this.bg.onlyIndex && document.URL.indexOf('wd=') != -1 && !$("#blur-search-bg").length && _this.css) {
                        var div = '<div id="blur-search-bg" style="background:url(\'' + url + '\') 0% 0% / cover"></div>';
                        var style = '<style class="blur-bg-css">body,.wrapper_new #foot #help{background: none} .wrapper_new #foot,#help{background-color: unset} .wrapper_new #s_tab .s-tab-item:before{color: #75777d} .s_down{background: rgba(238,238,238,0.75)!important;} .nums_text,.search_tool,.search_tool_conter  span{text-shadow: 0 0 10px black;color: #eee} #rs,#s_tab,.blur-search-bg,#content_right{background: rgba(255,255,255,0.7)!important; backdrop-filter:blur(15px)!important;} #rs{width: 560px;border-radius: 5px} #content_right{padding: 0 15px!important;border-radius: 5px}.blur-search-bg{position:absolute;top: -10px;left: 0;z-index: -1;width: 5000px;height: 5000px}#content_left>.result,.result-op,.op-vmp-zxenterprise{background: none!important;position:relative;overflow: hidden}.result:hover,.c-container:hover,.result-op:not(.xpath-log):not(#rs_new):hover{box-shadow: none;}#content_left .result:hover,#content_left .c-container:hover,#content_left .result-op:not(.xpath-log):not(#rs_new):hover,#rs:hover,#content_right:hover{background: white!important;}        #content_left>.result, #content_left>.c-container, #content_left>.result-op, #content_left>#unsafe_content>.result, #content_left>#unsafe_content>.c-container, #content_left>#unsafe_content>.result-op{padding: 20px;    border-radius: 5px;    margin: 0 15px 25px 0!important;}</style>'
                        $("#content_left .result,#content_left .result-op").append('<div class="blur-search-bg"></div>');
                        if (_this.beautify == 1) {
                            $('#page').css({ 'backdrop-filter': 'blur(15px)', 'background': 'rgba(238, 238, 238, 0.75)', 'z-index': '1000' });
                        } else {
                             $('#page').css({'background': 'none'});
                        }
                        if (_this.tab == 0) {
                            $('#foot').css({ 'backdrop-filter': 'blur(15px)', 'background': 'rgba(238, 238, 238, 0.75)', 'z-index': '1000' });
                        }
                        if (_this.beautify == 0) {
                            style += '<style class="blur-bg-css">html{padding-bottom: 0} .blur-search-bg{top: 0} #rs{padding: 20px} #content_right{padding-top: 15px!important;}</style>';
                        }
                        $('html').append(div).append(style);
                    }
                } else {
                    var url = _this.bg.url ? _this.bg.url : 'https://roll.ihawo.com/bg.php';
                    $(".blur-bg-css").remove();
                    if ($(".s-skin-container").css('background') && $(".s-skin-container").css('background').search(url) != -1) {
                        location.reload()
                    }
                }
            };
            this.toggleBg = function () {
                if (this.checked) {
                    _this.bg.on = true;
                    $(".blur-bg-setting").removeAttr('disabled')
                    localStorage.setItem('blur-bg', JSON.stringify(_this.bg));
                }
                else {
                    _this.bg.on = false;
                    $(".blur-bg-setting").attr('disabled', 'disabled')
                    localStorage.setItem('blur-bg', JSON.stringify(_this.bg));
                }
                _this.doBg();
            };
            this.setBg = function () {
                var field = $(this).data('field');
                switch (field) {
                    case 'url':
                        var value = $(this).val();
                        _this.bg.url = value;
                        break;
                    case 'onlyIndex':
                        var value = this.checked;
                        if (!_this.css && !value) {
                            _this.bg.onlyIndex = true;
                            alert('浏览器不支持');
                            $(this).prop('checked', true)
                            return false;
                        }
                        _this.bg.onlyIndex = value;
                        break;
                }
                localStorage.setItem('blur-bg', JSON.stringify(_this.bg));
                _this.doBg();
            };
            this.setLocalImage = function () {
                var imgFile = new FileReader();
                imgFile.readAsDataURL($('#blur-bg-local-image')[0].files[0]);

                imgFile.onload = function () {
                    var imgData = this.result; //base64数据
                    _this.bg.url = imgData;
                    $(".blur-bg-url").val(imgData);
                    localStorage.setItem('blur-bg', JSON.stringify(_this.bg));
                    _this.doBg();
                }
            };
        }
    }
    //document.getElementsByTagName('html')[0].style.display="none";
    Blur = new Blur,Blur.init();

    function myBrowser(){
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isOpera = userAgent.indexOf("Opera") > -1;
        if (isOpera) {
            return "Opera"
        }; //判断是否Opera浏览器
        if (userAgent.indexOf("Firefox") > -1) {
            return "FF";
        } //判断是否Firefox浏览器
        if (userAgent.indexOf("Chrome") > -1){
            return "Chrome";
        }
        if (userAgent.indexOf("Safari") > -1) {
            return "Safari";
        } //判断是否Safari浏览器
        if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
            return "IE";
        }; //判断是否IE浏览器
    }

    function getChromeVersion() {
        var arr = navigator.userAgent.split(' ');
        var chromeVersion = '';
        for(var i=0;i < arr.length;i++){
            if(/chrome/i.test(arr[i]))
                chromeVersion = arr[i]
        }
        if(chromeVersion){
            return Number(chromeVersion.split('/')[1].split('.')[0]);
        } else {
            return false;
        }
    }
})();